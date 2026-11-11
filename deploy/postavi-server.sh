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

# Caddy: reverse proxy ka Node-u. Sažimaju se samo navedene vrste sadržaja – SSE tokovi
# (text/event-stream: /api/dogadjaji, /api/admin/uzivo) nisu na spisku, jer bi sažimanje zadržavalo poruke.
# Ne koristiti text/* (ni Caddy-jev podrazumevani spisak) – obuhvata i text/event-stream.
IGRA='	encode zstd gzip {
		match {
			header Content-Type text/html*
			header Content-Type text/css*
			header Content-Type text/javascript*
			header Content-Type text/plain*
			header Content-Type application/json*
			header Content-Type application/xml*
			header Content-Type image/svg+xml*
		}
	}
	reverse_proxy 127.0.0.1:3000'
IP="$(curl -4 -fsS https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')"
if [ -n "${DOMEN:-}" ]; then
  # HTTPS na domenu (Caddy sam vadi i obnavlja Let's Encrypt sertifikat), www → glavna adresa,
  # a preko IP adrese igra i dalje radi na običnom HTTP-u
  cat > /etc/caddy/Caddyfile <<CADDY
$DOMEN {
$IGRA
}

www.$DOMEN {
	redir https://$DOMEN{uri} permanent
}

http://$IP {
$IGRA
}
CADDY
  ADRESA="https://$DOMEN"
else
  cat > /etc/caddy/Caddyfile <<CADDY
:80 {
$IGRA
}
CADDY
  ADRESA="http://$IP"
fi
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null

ufw allow OpenSSH >/dev/null
ufw allow 80/tcp >/dev/null
ufw allow 443/tcp >/dev/null
ufw --force enable >/dev/null

systemctl daemon-reload
systemctl enable gric-kviz >/dev/null
systemctl reload caddy || systemctl restart caddy
echo "Server je spreman (adresa: $ADRESA)."
