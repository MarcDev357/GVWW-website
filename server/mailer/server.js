'use strict';

/*
 * Veteran Webworks — website contact/lead mailer
 * Receives form POSTs from the site (proxied by nginx at /api/) and:
 *   1. emails MAIL_TO via Gmail SMTP, with Reply-To set to the visitor
 *   2. appends every submission to a dated JSONL backup log
 * Listens on 127.0.0.1:PORT only. No external deps beyond nodemailer.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// ---- config ---------------------------------------------------------------
const loadEnv = () => {
  const f = path.join(__dirname, '.env');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
};
loadEnv();

const PORT = parseInt(process.env.PORT || '8787', 10);
const MAIL_TO = process.env.MAIL_TO || 'marcus@veteranwebworks.com';
const MAIL_FROM = process.env.MAIL_FROM || `Website <${process.env.SMTP_USER}>`;
const SUB_DIR = process.env.SUBMISSIONS_DIR || path.join(__dirname, '..', 'submissions');

fs.mkdirSync(SUB_DIR, { recursive: true });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: String(process.env.SMTP_SECURE || 'true') === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// ---- tiny in-memory rate limiter ----------------------------------------
const HITS = new Map(); // ip -> [timestamps]
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
function rateLimited(ip) {
  const now = Date.now();
  const arr = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  HITS.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, arr] of HITS) {
    const keep = arr.filter((t) => now - t < WINDOW_MS);
    if (keep.length) HITS.set(ip, keep); else HITS.delete(ip);
  }
}, WINDOW_MS).unref();

// ---- helpers ------------------------------------------------------------
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const FIELD_LABELS = {
  form: 'Form',
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  business: 'Business',
  website: 'Website',
  window: 'Preferred window',
  best_time: 'Best time to call',
  help: 'What they want help with',
  message: 'Message',
  path: 'Recommended path',
  answers: 'Quiz answers',
  page: 'Submitted from',
};

function renderText(data) {
  const lines = [];
  for (const [k, v] of Object.entries(data)) {
    if (v == null || v === '' || k.startsWith('_')) continue;
    const label = FIELD_LABELS[k] || k;
    lines.push(`${label}: ${typeof v === 'object' ? JSON.stringify(v, null, 2) : v}`);
  }
  return lines.join('\n');
}

function renderHtml(data) {
  const rows = [];
  for (const [k, v] of Object.entries(data)) {
    if (v == null || v === '' || k.startsWith('_')) continue;
    const label = FIELD_LABELS[k] || k;
    const val = typeof v === 'object' ? `<pre style="margin:0;white-space:pre-wrap">${esc(JSON.stringify(v, null, 2))}</pre>` : esc(v);
    rows.push(
      `<tr><td style="padding:6px 12px;font-weight:600;vertical-align:top;white-space:nowrap">${esc(label)}</td><td style="padding:6px 12px">${val}</td></tr>`
    );
  }
  return `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:14px;color:#111">
    <h2 style="margin:0 0 12px">New website ${esc(data.form || 'form')} submission</h2>
    <table style="border-collapse:collapse;border:1px solid #e5e7eb">${rows.join('')}</table>
    <p style="margin:16px 0 0;color:#6b7280;font-size:12px">Sent from goveteranwebworks.com — reply directly to reach the sender.</p>
  </div>`;
}

function logSubmission(record) {
  const day = new Date().toISOString().slice(0, 10);
  const file = path.join(SUB_DIR, `${day}.jsonl`);
  fs.appendFile(file, JSON.stringify(record) + '\n', (e) => {
    if (e) console.error('log write failed:', e.message);
  });
}

function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

// ---- server -----------------------------------------------------------
const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (req.method === 'GET' && (url === '/api/health' || url === '/health')) {
    return send(res, 200, { ok: true });
  }

  if (req.method !== 'POST' || (url !== '/api/contact' && url !== '/contact')) {
    return send(res, 404, { ok: false, error: 'not found' });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown';

  let raw = '';
  let tooBig = false;
  req.on('data', (c) => {
    raw += c;
    if (raw.length > 64 * 1024) {
      tooBig = true;
      req.destroy();
    }
  });
  req.on('end', async () => {
    if (tooBig) return send(res, 413, { ok: false, error: 'payload too large' });

    let data;
    try {
      data = JSON.parse(raw || '{}');
    } catch {
      return send(res, 400, { ok: false, error: 'invalid JSON' });
    }

    // ---- spam checks: all silently drop (return ok so bots don't learn) ----
    const hp = data._hp || data.company_website || data._gotcha;
    const fts = parseInt(data.form_ts || data._t || '0', 10);
    const tooFast = fts > 0 && Date.now() - fts < 2500; // human can't fill a form that fast
    const blob = `${data.name || ''} ${data.message || ''} ${data.help || ''} ${data.website || ''}`;
    const linkCount = (blob.match(/https?:\/\/|www\.|\[url|\bhref\b/gi) || []).length;
    const nameHasUrl = /https?:\/\/|www\.|\.[a-z]{2,}\//i.test(String(data.name || ''));
    if (hp || tooFast || linkCount > 2 || nameHasUrl) {
      const reason = hp ? 'honeypot' : tooFast ? 'timing' : nameHasUrl ? 'name-url' : 'links';
      logSubmission({ ts: new Date().toISOString(), ip, spam: true, reason, data });
      return send(res, 200, { ok: true });
    }

    if (rateLimited(ip)) {
      return send(res, 429, { ok: false, error: 'Too many submissions. Please try again in a few minutes.' });
    }

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return send(res, 422, { ok: false, error: 'A name and valid email are required.' });
    }

    const form = String(data.form || 'contact').trim().slice(0, 60);
    const SKIP = new Set(['form', 'company_website', 'form_ts', '_hp', '_t', '_gotcha']);
    const clean = { form, name, email };
    for (const [k, v] of Object.entries(data)) {
      if (k in clean || k.startsWith('_') || SKIP.has(k)) continue;
      if (typeof v === 'string') clean[k] = v.slice(0, 5000);
      else if (v != null) clean[k] = v;
    }
    clean.page = String(data.page || req.headers['referer'] || '').slice(0, 300);

    const record = { ts: new Date().toISOString(), ip, ua: req.headers['user-agent'] || '', data: clean };
    logSubmission(record);

    try {
      await transporter.sendMail({
        from: MAIL_FROM,
        to: MAIL_TO,
        replyTo: `${name} <${email}>`,
        subject: `New ${form} submission — ${name}`,
        text: renderText(clean),
        html: renderHtml(clean),
      });
    } catch (e) {
      console.error('sendMail failed:', e.message);
      // Submission is already logged to disk; tell the visitor it went through.
      return send(res, 200, { ok: true, warning: 'queued' });
    }

    return send(res, 200, { ok: true });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`veteranwebworks mailer listening on 127.0.0.1:${PORT}`);
  transporter.verify().then(
    () => console.log('SMTP connection OK'),
    (e) => console.error('SMTP verify failed:', e.message)
  );
});
