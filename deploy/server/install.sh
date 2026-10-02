#!/bin/bash
# One-time server setup for CI/CD. Run from a checkout of this repo:
#   sudo bash deploy/server/install.sh
# Creates the restricted gvwwdeploy user, installs the deploy scripts, and
# generates the SSH key GitHub Actions will use. Does not touch any site.
set -euo pipefail
[ "$(id -u)" -eq 0 ] || { echo "Run with sudo." >&2; exit 1; }

HERE="$(cd "$(dirname "$0")" && pwd)"
BASE=/var/lib/gvww-deploy
KEY=/root/gvww-deploy-key

if ! getent passwd gvwwdeploy >/dev/null; then
  useradd -m -s /bin/bash -p '*' -c "GVWW CI/CD deploy (forced command only)" gvwwdeploy
fi

install -d -o root -g root -m 755 /opt/gvww-deploy
install -o root -g root -m 755 "$HERE/dispatch.sh" /opt/gvww-deploy/dispatch.sh
install -o root -g root -m 755 "$HERE/apply.sh"    /opt/gvww-deploy/apply.sh
install -d -o gvwwdeploy -g gvwwdeploy -m 700 "$BASE/incoming"
install -d -o root -g root -m 755 "$BASE" "$BASE/releases" "$BASE/backups"
chmod 755 "$BASE"
touch /var/log/gvww-deploy.log; chmod 640 /var/log/gvww-deploy.log

cat > /etc/sudoers.d/gvww-deploy <<'EOF'
gvwwdeploy ALL=(root) NOPASSWD: /opt/gvww-deploy/apply.sh sandbox *, /opt/gvww-deploy/apply.sh production *
EOF
chmod 440 /etc/sudoers.d/gvww-deploy
visudo -cf /etc/sudoers.d/gvww-deploy

SSHD=/home/gvwwdeploy/.ssh
install -d -o gvwwdeploy -g gvwwdeploy -m 700 "$SSHD"
if ! grep -q "gvww-ci" "$SSHD/authorized_keys" 2>/dev/null; then
  rm -f "$KEY" "$KEY.pub"
  ssh-keygen -q -t ed25519 -N '' -C gvww-ci -f "$KEY"
  { printf 'command="/opt/gvww-deploy/dispatch.sh",restrict '; cat "$KEY.pub"; } >> "$SSHD/authorized_keys"
  chown gvwwdeploy:gvwwdeploy "$SSHD/authorized_keys"; chmod 600 "$SSHD/authorized_keys"
  NEWKEY=1
else
  NEWKEY=0
fi

echo
echo "Installed: /opt/gvww-deploy/{dispatch,apply}.sh, sudoers rule, gvwwdeploy user."
if [ "$NEWKEY" -eq 1 ]; then
  cat <<EOF

NEXT (you, in GitHub, one time):
  1. Show the private key and copy all of it (including BEGIN/END lines):
       sudo cat $KEY
  2. GitHub repo MarcDev357/GVWW-website > Settings > Secrets and variables >
     Actions > New repository secret. Name: DEPLOY_SSH_KEY. Paste the key.
  3. Then delete the key from the server:
       sudo shred -u $KEY $KEY.pub
EOF
else
  echo "Deploy key already installed; nothing new generated."
fi
