#!/bin/bash
# Forced command for the gvwwdeploy SSH key (see authorized_keys). The client's
# requested "command" is only a routing label: sandbox | production. It is never
# executed. The release tarball arrives on stdin.
set -euo pipefail
umask 077

TARGET="${SSH_ORIGINAL_COMMAND:-}"
case "$TARGET" in
  sandbox|production) ;;
  *) echo "Refused: unknown deploy target '${TARGET:-<empty>}'" >&2; exit 1 ;;
esac

IN=/var/lib/gvww-deploy/incoming
MAX_BYTES=$((50 * 1024 * 1024))
FILE="$IN/$TARGET-$(date -u +%Y%m%dT%H%M%SZ).tar.gz"

head -c "$MAX_BYTES" > "$FILE"
SIZE=$(stat -c %s "$FILE")
if [ "$SIZE" -ge "$MAX_BYTES" ] || [ "$SIZE" -lt 1024 ]; then
  rm -f "$FILE"
  echo "Refused: upload size $SIZE bytes is outside the allowed range" >&2
  exit 1
fi

exec sudo -n /opt/gvww-deploy/apply.sh "$TARGET" "$FILE"
