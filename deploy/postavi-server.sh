#!/usr/bin/env bash
# Jednokratna priprema servera (Ubuntu 24.04, pokreće se kao root NA SERVERU).
# Obično se ne pokreće ručno – zove ga ./deploy/objavi.sh --prvi-put.
#   DOMEN=kviz.example.com bash postavi-server.sh   → HTTPS preko Caddy-ja (Let's Encrypt)
#   bash postavi-server.sh                          → obični HTTP na portu 80 (za probu preko IP adrese)
set -euo pipefail
DIR=/opt/gric-kviz

apt-get update -q
DEBIAN_FRONTEND=noninteractive apt-get install -yq nodejs rsync caddy ufw
node --version

id gric >/dev/null 2>&1 || useradd --system --home "$DIR" --shell /usr/sbin/nologin gric
mkdir -p "$DIR/podaci"
chown -R gric:gric "$DIR"

cat > /etc/systemd/system/gric-kviz.service <<UNIT
[Unit]
Description=Gric kviz
After=network.target

[Service]
User=gric
WorkingDirectory=$DIR
Environment=NODE_ENV=production PORT=3000
# GITHUB_TOKEN za urednik pitanja (deploy/README.md → „Nalog za predloge“); fajl nije obavezan
EnvironmentFile=-/etc/gric-kviz.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=2
LimitNOFILE=65536
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$DIR/podaci

[Install]
WantedBy=multi-user.target
UNIT

IP="$(curl -4 -fsS https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')"
if [ -n "${DOMEN:-}" ]; then ADRESA="https://$DOMEN"; else ADRESA="http://$IP"; fi

ufw allow OpenSSH >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
ufw --force enable >/dev/null

systemctl daemon-reload
systemctl enable gric-kviz >/dev/null
# Caddy (reverse proxy ka Node-u) podešava deploy/caddy.sh – objavi.sh ga pokreće posle ove skripte
echo "Server je spreman (adresa: $ADRESA)."
