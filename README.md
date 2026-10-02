# GVWW Website

Source for veteranwebworks.com / goveteranwebworks.com: the marketing site, the
domain search and checkout pages, and the two small backends behind them.
Vite + React + TanStack Router + Tailwind v4. No dependency on the old
site-builder platform.

## Layout

| Path | What it is |
| --- | --- |
| `src/` | React site (pages, components, `src/data/*.js` content) |
| `public/` | Copied to the site root as-is: `book.html`, `domains.html`, `checkout.html`, `llms.txt`, `robots.txt`, `sitemap.xml`, favicons, `brand/`, portfolio images |
| `server/domain-service/` | Domain search, Square checkout, ResellerClub registration (Node, port 8789 prod / 8799 sandbox) |
| `server/mailer/` | Contact/lead form mailer (Node, port 8787 prod / 8797 sandbox) |
| `deploy/server/` | Scripts installed on the server for CI/CD (see below) |
| `.github/workflows/` | CI/CD |

Secrets never live in the repo. Each backend reads its own `.env` on the
server; see `server/*/.env.example` for the variable names.

## Develop

```bash
npm install
npm run dev
npm run build      # outputs dist/
```

## CI/CD

| Trigger | Workflow | Result |
| --- | --- | --- |
| Push to `main` | `deploy.yml` | Build, gates, deploy to the **sandbox** (`vww-sandbox.goveteranwebworks.com`) |
| Manual "Run workflow" | `deploy-production.yml` | Same build and gates, deploy to **production** |

There is no automatic path to production. A person has to click Run workflow.

`build.yml` (shared) runs `npm ci`, `npm run build`, a syntax check of both
backends, then Lighthouse CI against the built site. The job fails, and nothing
deploys, if accessibility < 95, SEO < 90, or best practices < 90 on any tested
page. Performance only warns. `book.html` has a lower best-practices floor (70)
because the Cal.com embed sets third-party cookies we cannot control.

The tarball that passed the gates is the exact thing deployed: Actions sends it
over SSH to the `gvwwdeploy` user, whose key is locked to a forced command
(`/opt/gvww-deploy/dispatch.sh`). That script accepts only `sandbox` or
`production`, then calls `/opt/gvww-deploy/apply.sh`, which:

1. Validates the tarball, then updates `domain-service` and `mailer` if they
   changed (backup, restart, health check, automatic rollback).
2. Snapshots the docroot, adds new files, swaps `index.html`, then deletes stale
   files (never deletes first).
3. Keeps the tarball in `/var/lib/gvww-deploy/releases/` for rollback.

If `package-lock.json` changes for a backend, the deploy does not auto-install.
It exits with a warning so someone runs `npm ci` in that service directory.

### One-time server setup

```bash
sudo bash deploy/server/install.sh
```

Then add the printed private key as the repository secret `DEPLOY_SSH_KEY`.

### Rollback

```bash
ls /var/lib/gvww-deploy/releases/
sudo /opt/gvww-deploy/apply.sh production /var/lib/gvww-deploy/releases/<older-tarball>
```

Log: `/var/log/gvww-deploy.log`.
