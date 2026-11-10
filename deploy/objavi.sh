#!/usr/bin/env bash
# Objavljivanje nove verzije na server (pokreće se SA SVOG RAČUNARA, iz korena projekta):
#   ./deploy/objavi.sh root@1.2.3.4               – pošalji kod i restartuj igru
#   ./deploy/objavi.sh root@1.2.3.4 --prvi-put    – isto, uz jednokratnu pripremu servera
#   DOMEN=kviz.example.com ./deploy/objavi.sh root@1.2.3.4 --prvi-put   – sa HTTPS-om na domenu
# Objavljuje se poslednji COMMIT (ili REF=<grana/tag/commit>), ne nedovršene izmene iz radnog foldera.
# Napomena: restart briše sobe koje su u toku (stanje je samo u memoriji).
set -euo pipefail
CILJ="${1:?Upotreba: ./deploy/objavi.sh root@IP-adresa [--prvi-put]}"
DIR=/opt/gric-kviz
cd "$(dirname "$0")/.."
REF="${REF:-HEAD}"
IZVOR="$(mktemp -d)"
trap 'rm -rf "$IZVOR"' EXIT
git archive "$REF" | tar -x -C "$IZVOR"
echo "Objavljujem $(git log -1 --format='%h %s' "$REF")"
[ -n "$(git status --porcelain)" ] && echo "(necommit-ovane izmene u radnom folderu se NE šalju)"

(cd "$IZVOR" && node alati/proveri-kvizove.js >/dev/null) || { echo "Provera kvizova nije prošla – ništa nije poslato."; exit 1; }

if [ "${2:-}" = "--prvi-put" ]; then
  ssh "$CILJ" "DOMEN='${DOMEN:-}' bash -s" < deploy/postavi-server.sh
fi

rsync -az --delete \
  --exclude .github --exclude podaci/statistika.json --exclude podaci/odigrana-pitanja.json --exclude 'podaci/telemetrija.db*' \
  "$IZVOR/" "$CILJ:$DIR/"

ssh "$CILJ" "chown -R gric:gric $DIR && systemctl restart gric-kviz && sleep 1 && systemctl is-active gric-kviz && curl -fsS http://127.0.0.1:3000/api/info >/dev/null && echo 'Igra radi ✓'"
