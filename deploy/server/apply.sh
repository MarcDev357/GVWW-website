#!/bin/bash
# Applies a release tarball to the sandbox or production. Runs as root via a
# sudoers rule that allows only this script for the gvwwdeploy user, so every
# argument is validated here. To roll back, run it again by hand with an older
# tarball from /var/lib/gvww-deploy/releases/.
#
#   sudo /opt/gvww-deploy/apply.sh <sandbox|production> <tarball>
set -euo pipefail
umask 022

[ "$(id -u)" -eq 0 ] || { echo "Must run as root." >&2; exit 1; }

BASE=/var/lib/gvww-deploy
TARGET="${1:-}"
TARBALL="${2:-}"
WARN=0

case "$TARGET" in
  sandbox)
    DOC=/var/www/veteranwebworks-sandbox/html
    ROOT=/var/www/veteranwebworks-sandbox
    BACKEND_USER=vwsandbox
    DS_SVC=veteranwebworks-sandbox-domains.service;  DS_PORT=8799
    MAIL_SVC=veteranwebworks-sandbox-mailer.service; MAIL_PORT=8797
    MAIL_USER=vwsandbox
    ;;
  production)
    DOC=/var/www/veteranwebworks/html
    ROOT=/var/www/veteranwebworks
    BACKEND_USER=vwdomains
    DS_SVC=veteranwebworks-domains.service;  DS_PORT=8789
    MAIL_SVC=veteranwebworks-mailer.service; MAIL_PORT=8787
    MAIL_USER=ubuntu
    ;;
  *) echo "Refused: unknown target '$TARGET'" >&2; exit 1 ;;
esac

if ! [[ "$TARBALL" =~ ^$BASE/(incoming|releases)/$TARGET-[0-9]{8}T[0-9]{6}Z\.tar\.gz$ ]] || [ -L "$TARBALL" ] || [ ! -f "$TARBALL" ]; then
  echo "Refused: bad tarball path '$TARBALL'" >&2; exit 1
fi

mkdir -p "$BASE/releases" "$BASE/backups"
exec 9>"$BASE/apply.lock"
flock -n 9 || { echo "Another deploy is running." >&2; exit 1; }
exec > >(tee -a /var/log/gvww-deploy.log) 2>&1

TS=$(date -u +%Y%m%dT%H%M%SZ)
echo "=== $TS apply $TARGET from $(basename "$TARBALL")"

gzip -t "$TARBALL"
if tar -tzf "$TARBALL" | grep -qE '(^/|(^|/)\.\.(/|$))'; then
  echo "Refused: tarball contains absolute or parent paths" >&2; exit 1
fi
if tar -tvzf "$TARBALL" | grep -qE '^[lh]'; then
  echo "Refused: tarball contains links" >&2; exit 1
fi

STAGE=$(mktemp -d "$BASE/stage.XXXXXX")
trap 'rm -rf "$STAGE"' EXIT
tar -xzf "$TARBALL" -C "$STAGE" --no-same-owner --no-same-permissions

[ -f "$STAGE/site/index.html" ] || { echo "Refused: no site/index.html" >&2; exit 1; }
[ -d "$STAGE/site/assets" ]     || { echo "Refused: no site/assets" >&2; exit 1; }
COMMIT=$(cat "$STAGE/COMMIT" 2>/dev/null || echo unknown)
for s in domain-service mailer; do
  /usr/bin/node --check "$STAGE/server/$s/server.js"
done
echo "Release commit: $COMMIT"

# ---- backend first, so a bad server.js stops the deploy before the site changes
sync_backend() {
  local name=$1 svc=$2 port=$3 user=$4
  local src="$STAGE/server/$name" dest="$ROOT/$name"
  if cmp -s "$src/server.js" "$dest/server.js" && cmp -s "$src/package-lock.json" "$dest/package-lock.json"; then
    echo "[$name] unchanged"; return 0
  fi
  if ! cmp -s "$src/package-lock.json" "$dest/package-lock.json"; then
    echo "[$name] WARNING: dependencies changed (package-lock.json). Not auto-installed; run npm ci in $dest as $user, then re-run this deploy." >&2
    WARN=1; return 0
  fi
  local bak="$dest/server.js.bak-deploy-$TS"
  cp -p "$dest/server.js" "$bak"
  install -o "$user" -g "$user" -m 640 "$src/server.js" "$dest/server.js"
  systemctl restart "$svc"
  local ok=0 i
  for i in $(seq 1 15); do
    sleep 1
    if systemctl is-active --quiet "$svc" && (exec 3<>"/dev/tcp/127.0.0.1/$port") 2>/dev/null; then ok=1; break; fi
  done
  if [ "$ok" -ne 1 ]; then
    echo "[$name] FAILED to come up on :$port. Rolling back." >&2
    cp -p "$bak" "$dest/server.js"
    systemctl restart "$svc" || true
    exit 1
  fi
  echo "[$name] updated and healthy on :$port"
  ls -1t "$dest"/server.js.bak-deploy-* 2>/dev/null | tail -n +6 | xargs -r rm -f
}
sync_backend domain-service "$DS_SVC" "$DS_PORT" "$BACKEND_USER"
sync_backend mailer "$MAIL_SVC" "$MAIL_PORT" "$MAIL_USER"

# ---- site: snapshot, add new files, swap index.html, then remove stale files
tar -czf "$BASE/backups/$TARGET-docroot-$TS.tar.gz" -C "$DOC" .
ls -1t "$BASE"/backups/"$TARGET"-docroot-*.tar.gz | tail -n +11 | xargs -r rm -f

RSYNC=(rsync -rlc --chmod=D755,F644 --chown=ubuntu:ubuntu)
"${RSYNC[@]}" --exclude=/index.html "$STAGE/site/" "$DOC/"
install -o ubuntu -g ubuntu -m 644 "$STAGE/site/index.html" "$DOC/.index.html.new"
mv -f "$DOC/.index.html.new" "$DOC/index.html"

STALE=$("${RSYNC[@]}" --delete --dry-run --itemize-changes "$STAGE/site/" "$DOC/" | grep -c '^\*deleting' || true)
if [ "$STALE" -gt 25 ]; then
  echo "WARNING: $STALE stale files would be deleted; skipping cleanup. Review $DOC by hand." >&2
  WARN=1
else
  "${RSYNC[@]}" --delete "$STAGE/site/" "$DOC/"
  echo "[site] synced, $STALE stale file(s) removed"
fi

# ---- keep the tarball for rollback
case "$TARBALL" in "$BASE/incoming/"*)
  mv "$TARBALL" "$BASE/releases/"
  ls -1t "$BASE"/releases/"$TARGET"-*.tar.gz | tail -n +21 | xargs -r rm -f
esac

echo "=== Deployed $COMMIT to $TARGET at $(date -u +%FT%TZ)"
[ "$WARN" -eq 0 ] || { echo "Finished with warnings (see above)." >&2; exit 2; }
