'use strict';

/*
 * Veteran Webworks — domain search, cart & checkout service
 * Runs as the unprivileged `vwdomains` system user, isolated from every
 * other site on the box. Talks to ResellerClub (availability, pricing,
 * registration) and Square (payment).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// ---- config / env -------------------------------------------------------
const ENV_PATH = path.join(__dirname, '.env');
for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
}

const PORT = parseInt(process.env.DOMAIN_SERVICE_PORT || '8789', 10);
const RC_BASE = process.env.RESELLERCLUB_API_BASE || 'https://httpapi.com/api';
const RC_AUTH_USERID = process.env.RESELLERCLUB_AUTH_USERID;
const RC_API_KEY = process.env.RESELLERCLUB_API_KEY;
const MARKUP = 1.6; // cost + 60%

const SQUARE_ENV = process.env.SQUARE_ENV || 'sandbox';
const SQUARE_HOST = SQUARE_ENV === 'production' ? 'connect.squareup.com' : 'connect.squareupsandbox.com';
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;
const SQUARE_VERSION = '2026-06-18';

// Safety gate — see .env for the full explanation. False = charge via
// Square (real in production, fake in sandbox) but never actually call
// ResellerClub's register endpoint, which is real money + a real,
// irreversible registration with no sandbox equivalent.
const REGISTER_DOMAINS_LIVE = String(process.env.REGISTER_DOMAINS_LIVE).toLowerCase() === 'true';

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;
const MAIL_FROM = process.env.MAIL_FROM;

// TLD -> ResellerClub classkey (see server-hardening notes for how these
// were confirmed — empirically, not guessed).
const TLDS = [
  { ext: 'com', classkey: 'domcno' },
  { ext: 'net', classkey: 'dotnet' },
  { ext: 'org', classkey: 'domorg' },
  { ext: 'co', classkey: 'dotco' },
  { ext: 'io', classkey: 'dotio' },
  { ext: 'biz', classkey: 'dombiz' },
  { ext: 'us', classkey: 'domus' },
  { ext: 'ai', classkey: 'dotai' },
  { ext: 'app', classkey: 'dotapp' },
  { ext: 'dev', classkey: 'dotdev' },
  { ext: 'info', classkey: 'dominfo' },
  { ext: 'cloud', classkey: 'dotcloud' },
  { ext: 'ca', classkey: 'dotca' },
  { ext: 'uk', classkey: 'dotuk' },
  { ext: 'au', classkey: 'dotau' },
  { ext: 'me', classkey: 'dotme' },
  { ext: 'xyz', classkey: 'dotxyz' },
  { ext: 'online', classkey: 'dotonline' },
  { ext: 'store', classkey: 'dotstore' },
  { ext: 'shop', classkey: 'dotshop' },
  { ext: 'site', classkey: 'dotsite' },
  { ext: 'club', classkey: 'dotclub' },
  { ext: 'live', classkey: 'dotlive' },
  { ext: 'name', classkey: 'dotname' },
];
const CLASSKEY_TO_EXT = Object.fromEntries(TLDS.map((t) => [t.classkey, t.ext]));
const EXT_SET = new Set(TLDS.map((t) => t.ext));

const ADDONS = [
  {
    key: 'privacy',
    field: 'privacy-protection',
    name: 'Privacy Shield',
    description: 'Keeps your name, address, and phone number out of the public WHOIS record.',
  },
];

function retailPrice(cost) {
  return Math.floor(cost * MARKUP) + 0.99;
}
function centsOf(dollars) {
  return Math.round(dollars * 100);
}

// ---- tiny HTTP helpers (no extra deps) -----------------------------------
function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Bad JSON from ' + url + ': ' + e.message));
          }
        });
      })
      .on('error', reject);
  });
}

function httpRequestJson(method, url, { headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = body == null ? null : typeof body === 'string' ? body : JSON.stringify(body);
    const req = https.request(
      {
        method,
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: {
          ...headers,
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = data ? JSON.parse(data) : {};
          } catch {
            parsed = { raw: data };
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function rcUrl(pathname, params) {
  const u = new URL(RC_BASE + pathname);
  u.searchParams.set('auth-userid', RC_AUTH_USERID);
  u.searchParams.set('api-key', RC_API_KEY);
  for (const [k, v] of Object.entries(params || {})) {
    if (Array.isArray(v)) v.forEach((vv) => u.searchParams.append(k, vv));
    else if (v != null) u.searchParams.set(k, v);
  }
  return u.toString();
}

// ResellerClub write calls (customer/contact/register) accept the same
// params as form-encoded POST. Used only when REGISTER_DOMAINS_LIVE=true —
// unverified against the live API by design (see checkout notes): there is
// no ResellerClub sandbox, so this path is only exercised for real once,
// deliberately, after the rest of the flow is proven.
function rcPost(pathname, params) {
  const form = new URLSearchParams({ 'auth-userid': RC_AUTH_USERID, 'api-key': RC_API_KEY });
  for (const [k, v] of Object.entries(params || {})) {
    if (Array.isArray(v)) v.forEach((vv) => form.append(k, vv));
    else if (v != null) form.set(k, v);
  }
  const body = form.toString();
  return httpRequestJson('POST', RC_BASE + pathname, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
}

// ---- pricing cache --------------------------------------------------------
let priceCache = { at: 0, byExt: {}, addons: [] };
const PRICE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

async function refreshPricing() {
  const data = await httpGetJson(rcUrl('/products/reseller-price.json'));
  const byExt = {};
  for (const [classkey, entry] of Object.entries(data)) {
    const ext = CLASSKEY_TO_EXT[classkey];
    if (!ext) continue;
    const costStr = entry?.['0']?.pricing?.addnewdomain?.['1'];
    if (!costStr) continue;
    const cost = parseFloat(costStr);
    byExt[ext] = { cost, price: retailPrice(cost) };
  }

  const addons = [];
  for (const addon of ADDONS) {
    let cost = null;
    for (const [classkey, entry] of Object.entries(data)) {
      if (!CLASSKEY_TO_EXT[classkey]) continue;
      if (entry?.[addon.field] != null) {
        cost = parseFloat(entry[addon.field]);
        break;
      }
    }
    if (cost != null) addons.push({ ...addon, cost, price: retailPrice(cost) });
  }

  priceCache = { at: Date.now(), byExt, addons };
  console.log(`[pricing] refreshed ${Object.keys(byExt).length}/${TLDS.length} TLDs, ${addons.length}/${ADDONS.length} add-ons`);
}

async function getPricing() {
  if (Date.now() - priceCache.at > PRICE_TTL_MS) await refreshPricing();
  return priceCache;
}

// ---- domain search --------------------------------------------------------
function normalizeName(raw) {
  let s = (raw || '').toLowerCase().trim();
  s = s.replace(/^https?:\/\//, '').replace(/^www\./, '');
  s = s.split('.')[0];
  s = s.replace(/[^a-z0-9-]/g, '').slice(0, 63);
  return s;
}

async function checkAvailability(names) {
  // names: array of full "name.tld" strings (mixed names/tlds allowed)
  const byExtNeeded = {};
  for (const full of names) {
    const i = full.lastIndexOf('.');
    const base = full.slice(0, i);
    const ext = full.slice(i + 1);
    (byExtNeeded[base] ||= new Set()).add(ext);
  }
  const out = {};
  for (const [base, exts] of Object.entries(byExtNeeded)) {
    const url = rcUrl('/domains/available.json', { 'domain-name': base, tlds: [...exts] });
    const avail = await httpGetJson(url);
    for (const ext of exts) {
      const info = avail[`${base}.${ext}`];
      out[`${base}.${ext}`] = info?.status === 'available';
    }
  }
  return out;
}

async function searchDomain(name) {
  const { byExt, addons } = await getPricing();
  const exts = TLDS.map((t) => t.ext);
  const avail = await httpGetJson(rcUrl('/domains/available.json', { 'domain-name': name, tlds: exts }));

  const results = exts
    .map((ext) => {
      const info = avail[`${name}.${ext}`];
      const price = byExt[ext];
      return {
        tld: ext,
        domain: `${name}.${ext}`,
        available: info?.status === 'available',
        price: price ? price.price : null,
      };
    })
    .filter((r) => r.price !== null);

  return { results, addons: addons.map(({ key, name, description, price }) => ({ key, name, description, price })) };
}

// ---- Square ---------------------------------------------------------------
async function createSquarePayment({ amountCents, nonce, idempotencyKey, note }) {
  const { status, body } = await httpRequestJson('POST', `https://${SQUARE_HOST}/v2/payments`, {
    headers: {
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Square-Version': SQUARE_VERSION,
    },
    body: {
      source_id: nonce,
      idempotency_key: idempotencyKey,
      amount_money: { amount: amountCents, currency: 'USD' },
      location_id: SQUARE_LOCATION_ID,
      note,
    },
  });
  return { ok: status === 200, status, body };
}

async function refundSquarePayment({ paymentId, amountCents, idempotencyKey, reason }) {
  const { status, body } = await httpRequestJson('POST', `https://${SQUARE_HOST}/v2/refunds`, {
    headers: {
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Square-Version': SQUARE_VERSION,
    },
    body: {
      idempotency_key: idempotencyKey,
      payment_id: paymentId,
      amount_money: { amount: amountCents, currency: 'USD' },
      reason,
    },
  });
  return { ok: status === 200, status, body };
}

// ---- ResellerClub registration (gated — see REGISTER_DOMAINS_LIVE) -------
// ResellerClub returns bare numbers for created ids, objects/arrays for lookups.
function rcId(body, key) {
  if (typeof body === 'number' && Number.isFinite(body)) return String(body);
  if (typeof body === 'string' && /^\d+$/.test(body.trim())) return body.trim();
  if (Array.isArray(body)) return body[0] && body[0][key] != null ? String(body[0][key]) : null;
  if (body && typeof body === 'object' && body[key] != null) return String(body[key]);
  return null;
}

// ResellerClub requires 8-15 alphanumeric characters.
function rcPassword() {
  const sets = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnopqrstuvwxyz', '23456789'];
  const all = sets.join('');
  const pick = (chars) => chars[crypto.randomInt(chars.length)];
  const out = sets.map(pick);
  while (out.length < 14) out.push(pick(all));
  for (let i = out.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.join('');
}

async function rcFindOrCreateCustomer(registrant) {
  const found = await httpRequestJson(
    'GET',
    rcUrl('/customers/details.json', { username: registrant.email }),
    {}
  );
  const existingId = found.status === 200 ? rcId(found.body, 'customerid') : null;
  if (existingId) return existingId;
  const passwd = rcPassword();
  const signup = await rcPost('/customers/signup.json', {
    username: registrant.email,
    passwd,
    name: registrant.name,
    company: registrant.company || registrant.name,
    'address-line-1': registrant.address1,
    city: registrant.city,
    state: registrant.state,
    country: registrant.country || 'US',
    zipcode: registrant.zip,
    'phone-cc': registrant.phoneCc || '1',
    phone: registrant.phone,
    'lang-pref': 'en',
  });
  const newId = rcId(signup.body, 'customerid');
  if (!newId) {
    throw new Error('ResellerClub customer signup failed: ' + JSON.stringify(signup.body));
  }
  return newId;
}

async function rcCreateContact(customerId, registrant) {
  const res = await rcPost('/contacts/add.json', {
    name: registrant.name,
    company: registrant.company || registrant.name,
    email: registrant.email,
    'address-line-1': registrant.address1,
    city: registrant.city,
    state: registrant.state,
    country: registrant.country || 'US',
    zipcode: registrant.zip,
    'phone-cc': registrant.phoneCc || '1',
    phone: registrant.phone,
    'customer-id': customerId,
    type: 'Contact',
  });
  const contactId = rcId(res.body, 'contactid');
  if (!contactId) {
    throw new Error('ResellerClub contact creation failed: ' + JSON.stringify(res.body));
  }
  return contactId;
}

const NAMESERVERS = [
  'veteranwebworks.earth.orderbox-dns.com',
  'veteranwebworks.mars.orderbox-dns.com',
  'veteranwebworks.mercury.orderbox-dns.com',
  'veteranwebworks.venus.orderbox-dns.com',
];

async function rcRegisterDomain({ domain, years, customerId, contactId, addons }) {
  const res = await rcPost('/domains/register.json', {
    'domain-name': domain,
    years: years || 1,
    ns: NAMESERVERS,
    'customer-id': customerId,
    'reg-contact-id': contactId,
    'admin-contact-id': contactId,
    'tech-contact-id': contactId,
    'billing-contact-id': contactId,
    'invoice-option': 'NoInvoice',
    'purchase-privacy': addons.privacy ? 'true' : 'false',
    'protect-privacy': addons.privacy ? 'true' : 'false',
    'auto-renew': 'false',
  });
  return res;
}

// ---- email ------------------------------------------------------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: String(process.env.SMTP_SECURE || 'true') === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

function money(n) {
  return '$' + n.toFixed(2);
}

async function sendOrderEmails(order) {
  const lines = order.lineItems.map((li) => `${li.label} — ${money(li.price)}`).join('\n');
  const modeNote =
    order.mode === 'test'
      ? '\n\n(TEST MODE — payment ran through Square sandbox; no domain was actually registered.)'
      : '';

  const customerText =
    `Thanks for your order, ${order.registrant.name}!\n\n` +
    `Order ${order.orderId}\n${lines}\nTotal: ${money(order.total)}\n` +
    (order.mode === 'live'
      ? `\nYour domain(s) are being registered now — you'll be the registrant of record.`
      : `\nThis was a test transaction — nothing was charged for real and no domain was registered.`) +
    modeNote;

  const staffText =
    `New domain order ${order.orderId} (${order.mode.toUpperCase()})\n\n` +
    `Customer: ${order.registrant.name} <${order.registrant.email}>\n` +
    `${lines}\nTotal: ${money(order.total)}\n` +
    (order.registrationResults
      ? `\nRegistration results:\n${JSON.stringify(order.registrationResults, null, 2)}`
      : '');

  await transporter.sendMail({
    from: MAIL_FROM,
    to: order.registrant.email,
    replyTo: NOTIFY_EMAIL,
    subject: `Your Veteran Webworks domain order ${order.mode === 'test' ? '(test)' : ''}`.trim(),
    text: customerText,
  });
  await transporter.sendMail({
    from: MAIL_FROM,
    to: NOTIFY_EMAIL,
    subject: `[Domains] New order ${order.orderId} (${order.mode})`,
    text: staffText,
  });
}

// ---- checkout orchestration ----------------------------------------------
function validRegistrant(r) {
  if (!r || typeof r !== 'object') return 'Registrant info is required.';
  for (const f of ['name', 'email', 'phone', 'address1', 'city', 'state', 'zip']) {
    if (!String(r[f] || '').trim()) return `Missing ${f}.`;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email)) return 'Invalid email.';
  return null;
}

async function handleCheckout(payload) {
  const { domains, addons: addonSel, registrant, nonce, years } = payload;

  if (!Array.isArray(domains) || domains.length === 0) return { error: 'Cart is empty.', code: 422 };
  if (domains.length > 10) return { error: 'Too many domains in one order.', code: 422 };
  for (const d of domains) {
    const ext = d.split('.').pop();
    if (!EXT_SET.has(ext)) return { error: `Unsupported extension in "${d}".`, code: 422 };
  }
  const regErr = validRegistrant(registrant);
  if (regErr) return { error: regErr, code: 422 };
  if (!nonce) return { error: 'Missing payment token.', code: 422 };

  // 1) Re-check availability server-side — never trust the client's
  //    earlier search results, a name can be taken in the gap between
  //    search and checkout.
  const availability = await checkAvailability(domains);
  const unavailable = domains.filter((d) => !availability[d]);
  if (unavailable.length) {
    return { error: `No longer available: ${unavailable.join(', ')}. Remove and try again.`, code: 409 };
  }

  // 2) Recompute price server-side from the live cache — never trust a
  //    client-submitted price.
  const { byExt, addons } = await getPricing();
  const addonByKey = Object.fromEntries(addons.map((a) => [a.key, a]));
  const wantPrivacy = !!addonSel?.privacy && !!addonByKey.privacy;

  const lineItems = [];
  for (const d of domains) {
    const ext = d.split('.').pop();
    const p = byExt[ext];
    if (!p) return { error: `No pricing available for "${d}".`, code: 422 };
    lineItems.push({ label: d, price: p.price });
    if (wantPrivacy) lineItems.push({ label: `Privacy Shield — ${d}`, price: addonByKey.privacy.price });
  }
  const total = lineItems.reduce((s, li) => s + li.price, 0);
  const orderId = 'VWW-' + Date.now().toString(36).toUpperCase();

  // 3) Charge via Square.
  const payment = await createSquarePayment({
    amountCents: centsOf(total),
    nonce,
    idempotencyKey: orderId,
    note: `Veteran Webworks domains: ${domains.join(', ')}`,
  });
  if (!payment.ok) {
    const msg = payment.body?.errors?.[0]?.detail || 'Payment was declined.';
    return { error: msg, code: 402 };
  }
  const paymentId = payment.body?.payment?.id;

  // 4) Register — gated. In test mode we stop here on purpose (see
  //    REGISTER_DOMAINS_LIVE in .env).
  let registrationResults = null;
  if (REGISTER_DOMAINS_LIVE) {
    try {
      const customerId = await rcFindOrCreateCustomer(registrant);
      const contactId = await rcCreateContact(customerId, registrant);
      registrationResults = [];
      for (const d of domains) {
        const r = await rcRegisterDomain({
          domain: d,
          years: years || 1,
          customerId,
          contactId,
          addons: { privacy: wantPrivacy },
        });
        registrationResults.push({ domain: d, status: r.body?.status, detail: r.body });
      }
      const failed = registrationResults.filter((r) => r.status !== 'Success');
      if (failed.length) throw new Error('One or more domains failed to register: ' + JSON.stringify(failed));
    } catch (err) {
      console.error('[checkout] registration failed after payment, refunding:', err.message);
      let refundOk = true;
      await refundSquarePayment({
        paymentId,
        amountCents: centsOf(total),
        idempotencyKey: orderId + '-refund',
        reason: 'Domain registration failed after payment',
      }).catch((e) => {
        refundOk = false;
        console.error('[checkout] REFUND ALSO FAILED — manual action needed:', e.message);
      });
      transporter
        .sendMail({
          from: MAIL_FROM,
          to: NOTIFY_EMAIL,
          subject: `[Domains] ORDER FAILED ${orderId} — ${refundOk ? 'payment refunded' : 'REFUND FAILED, ACT NOW'}`,
          text:
            `Order ${orderId} failed after payment.\n` +
            `Customer: ${registrant.name} <${registrant.email}>\n` +
            `Domains: ${domains.join(', ')}\nTotal: ${money(total)}\nSquare payment: ${paymentId}\n` +
            `Refund: ${refundOk ? 'issued automatically' : 'FAILED — refund manually in Square'}\n\nError: ${err.message}`,
        })
        .catch((e) => console.error('[checkout] failure alert email failed:', e.message));
      return { error: 'We were unable to complete registration, so your payment was refunded. Our team has been notified.', code: 500 };
    }
  }

  const order = {
    orderId,
    mode: REGISTER_DOMAINS_LIVE ? 'live' : 'test',
    lineItems,
    total,
    registrant,
    paymentId,
    registrationResults,
  };

  try {
    await sendOrderEmails(order);
  } catch (e) {
    console.error('[checkout] confirmation email failed (order still succeeded):', e.message);
  }

  return { order };
}

// ---- rate limiting --------------------------------------------------------
const HITS = new Map();
function rateLimited(ip, windowMs, max) {
  const now = Date.now();
  const arr = (HITS.get(ip) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  HITS.set(ip, arr);
  return arr.length > max;
}

// ---- http server ------------------------------------------------------
function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req, maxBytes = 32 * 1024) {
  return new Promise((resolve, reject) => {
    let data = '';
    let tooBig = false;
    req.on('data', (c) => {
      data += c;
      if (data.length > maxBytes) {
        tooBig = true;
        req.destroy();
      }
    });
    req.on('end', () => {
      if (tooBig) return reject(new Error('payload too large'));
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url, 'http://localhost');
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;

  if (req.method === 'GET' && pathname === '/api/domains/health') {
    return send(res, 200, {
      ok: true,
      tlds: TLDS.length,
      pricedTlds: Object.keys(priceCache.byExt).length,
      addons: priceCache.addons.length,
      mode: REGISTER_DOMAINS_LIVE ? 'live' : 'test',
      squareEnv: SQUARE_ENV,
    });
  }

  if (req.method === 'GET' && pathname === '/api/domains/config') {
    return send(res, 200, {
      ok: true,
      squareEnv: SQUARE_ENV,
      squareAppId: process.env.SQUARE_APP_ID,
      squareLocationId: SQUARE_LOCATION_ID,
    });
  }

  if (req.method === 'GET' && pathname === '/api/domains/search') {
    if (rateLimited(ip, 60 * 1000, 20)) return send(res, 429, { ok: false, error: 'Too many searches. Try again in a minute.' });
    const name = normalizeName(searchParams.get('name'));
    if (!name) return send(res, 422, { ok: false, error: 'Enter a name to search.' });
    searchDomain(name)
      .then(({ results, addons }) => send(res, 200, { ok: true, name, results, addons }))
      .catch((err) => {
        console.error('[search] failed:', err.message);
        send(res, 502, { ok: false, error: 'Domain lookup is temporarily unavailable.' });
      });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/domains/checkout') {
    if (rateLimited(ip, 10 * 60 * 1000, 8)) return send(res, 429, { ok: false, error: 'Too many attempts. Try again shortly.' });
    readBody(req)
      .then(handleCheckout)
      .then((result) => {
        if (result.error) return send(res, result.code || 400, { ok: false, error: result.error });
        send(res, 200, { ok: true, order: result.order });
      })
      .catch((err) => {
        console.error('[checkout] failed:', err.message);
        send(res, 500, { ok: false, error: 'Checkout is temporarily unavailable. Nothing was charged.' });
      });
    return;
  }

  send(res, 404, { ok: false, error: 'not found' });
});

server.listen(PORT, '127.0.0.1', async () => {
  console.log(
    `veteranwebworks domain-service listening on 127.0.0.1:${PORT} — mode=${REGISTER_DOMAINS_LIVE ? 'LIVE' : 'test'}, square=${SQUARE_ENV}`
  );
  try {
    await refreshPricing();
  } catch (e) {
    console.error('[pricing] initial fetch failed:', e.message);
  }
});
