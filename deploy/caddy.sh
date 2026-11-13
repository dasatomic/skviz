#!/usr/bin/env bash
# Podešavanje Caddy-ja (pokreće se kao root NA SERVERU). Zovu ga postavi-server.sh (prvi put) i objavi.sh
# (svaki pun deploy), pa izmena ovde stigne na server sa sledećim deploy-om. Ako je Caddyfile već takav,
# ništa se ne dira; inače se stari sačuva kao /etc/caddy/Caddyfile.pre-<vreme> i Caddy se blago ponovo učita
# (bez prekida veza).
#   DOMEN=kviz.example.com bash caddy.sh   → HTTPS na domenu (+ www → domen, + obični HTTP preko IP adrese)
#   bash caddy.sh                          → domen se čita iz postojećeg Caddyfile-a; ako ga nema, HTTP na portu 80
set -euo pipefail
CF=/etc/caddy/Caddyfile

if [ -z "${DOMEN:-}" ] && [ -f "$CF" ]; then
  DOMEN="$(awk '/^[A-Za-z0-9.-]+\.[A-Za-z]+ \{$/ && !/^www\./ { print $1; exit }' "$CF")"
fi

# Sažimaju se samo navedene vrste sadržaja – SSE tokovi (text/event-stream: /api/dogadjaji, /api/admin/uzivo)
# nisu na spisku: gzip zadržava poruke dok se ne skupi dovoljno podataka, pa tok kasni i po minut.
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

NOVO="$(mktemp)"
trap 'rm -f "$NOVO"' EXIT
if [ -n "${DOMEN:-}" ]; then
  # HTTPS na domenu (Caddy sam vadi i obnavlja Let's Encrypt sertifikat), www → glavna adresa,
  # a preko IP adrese igra i dalje radi na običnom HTTP-u
  IP="$(curl -4 -fsS --max-time 5 https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')"
  cat > "$NOVO" <<CADDY
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
else
  cat > "$NOVO" <<CADDY
:80 {
$IGRA
}
CADDY
fi

if [ -f "$CF" ] && cmp -s "$NOVO" "$CF"; then
  echo "Caddy: podešavanje je već ažurno."
  exit 0
fi
caddy validate --config "$NOVO" --adapter caddyfile >/dev/null 2>&1 || { echo "Caddy: novo podešavanje nije ispravno – ostavljam staro."; caddy validate --config "$NOVO" --adapter caddyfile; exit 1; }
[ -f "$CF" ] && cp "$CF" "$CF.pre-$(date +%Y%m%d-%H%M%S)"
install -m 644 "$NOVO" "$CF"
systemctl reload caddy || systemctl restart caddy
echo "Caddy: podešavanje osveženo${DOMEN:+ ($DOMEN)}."
