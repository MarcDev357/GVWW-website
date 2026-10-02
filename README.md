# GVWW Website

Real source for veteranwebworks.com / goveteranwebworks.com, replacing the
compiled, hand-patched bundle the site ran on previously. Built with
Vite + React + TanStack Router + Tailwind v4.

This also removes every dependency on the original site-builder platform
("Vincen"): no CDN image lookups, no live Neon/Postgres data API calls at
runtime. All content that used to be fetched live is now static source in
`src/data/`, pulled from the real data the live site was serving at the time
of migration.

## Status: Phase 1

Built and in the sandbox:
- Shared `Header` / `Footer`
- `Home`, `Work`, `Contact`

Not yet ported (still only on the old compiled bundle in production):
Services index + the 7 individual service pages, Process, Pricing, FAQ,
About.

`book.html`, `domains.html`, `checkout.html` are intentionally **not** part
of this project — they're already hand-authored static pages and are copied
into the deploy as-is.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs to `dist/`. Deploy by copying `dist/*` plus `book.html`,
`domains.html`, `checkout.html` into the target docroot.

## Sandbox

Live (password-protected) at `vww-sandbox.goveteranwebworks.com`, deployed
on the same server as production but fully isolated: its own system user,
its own mailer/domain-service backend instances on different ports, its own
`.env` (Square sandbox credentials, `REGISTER_DOMAINS_LIVE` hardcoded
`false`), its own nginx vhost.
