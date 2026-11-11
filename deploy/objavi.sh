#!/usr/bin/env bash
# Objavljivanje nove verzije na server (pokreće se SA SVOG RAČUNARA, iz korena projekta):
#   ./deploy/objavi.sh root@1.2.3.4               – pun deploy: pošalji kod i pitanja, restartuj igru
#   ./deploy/objavi.sh root@1.2.3.4 --pitanja     – samo pitanja (kvizovi/), BEZ restarta: sobe u toku rade dalje
#   ./deploy/objavi.sh root@1.2.3.4 --prvi-put    – pun deploy uz jednokratnu pripremu servera
#   DOMEN=kviz.example.com ./deploy/objavi.sh root@1.2.3.4 --prvi-put   – sa HTTPS-om na domenu
# Objavljuje se poslednji COMMIT (ili REF=<grana/tag/commit>), ne nedovršene izmene iz radnog foldera.
# Napomena: pun deploy (restart) briše sobe koje su u toku (stanje je samo u memoriji).
set -euo pipefail
CILJ="${1:?Upotreba: ./deploy/objavi.sh root@IP-adresa [--pitanja | --prvi-put]}"
NACIN="${2:-}"
case "$NACIN" in ''|--pitanja|--prvi-put) ;; *) echo "Nepoznata opcija: $NACIN (dozvoljeno: --pitanja, --prvi-put)"; exit 1 ;; esac
DIR=/opt/gric-kviz
cd "$(dirname "$0")/.."
REF="${REF:-HEAD}"
COMMIT="$(git rev-parse --verify "$REF^{commit}")"
IZVOR="$(mktemp -d)"
trap 'rm -rf "$IZVOR"' EXIT
git archive "$COMMIT" | tar -x -C "$IZVOR"
echo "Objavljujem $(git log -1 --format='%h %s' "$COMMIT")$([ "$NACIN" = --pitanja ] && echo '  (samo pitanja)')"
[ -n "$(git status --porcelain)" ] && echo "(necommit-ovane izmene u radnom folderu se NE šalju)"

(cd "$IZVOR" && node alati/proveri-kvizove.js >/dev/null) || { echo "Provera kvizova nije prošla – ništa nije poslato."; exit 1; }

if [ "$NACIN" = "--pitanja" ]; then
  # Samo pitanja: dozvoljeno samo ako je kod na serveru isti kao u ovom commitu (novo pitanje možda traži novi kod –
  # npr. novu vrstu medija). Pun deploy upisuje svoj commit u $DIR/.objavljeno.
  KOD="$(ssh "$CILJ" "cat $DIR/.objavljeno 2>/dev/null" || true)"
  [ -n "$KOD" ] || { echo "Na serveru nije zapisano koja verzija koda radi – uradi jednom pun deploy: ./deploy/objavi.sh $CILJ"; exit 1; }
  git cat-file -e "$KOD^{commit}" 2>/dev/null || { echo "Commit $KOD (kod na serveru) ne postoji u ovom repozitorijumu – git fetch ili pun deploy."; exit 1; }
  # sve što server izvršava ili šalje telefonima; pitanja, alati, uputstva i CI se ne računaju
  RAZLIKA="$(git diff --name-only "$KOD" "$COMMIT" -- . ':(exclude)kvizovi' ':(exclude)alati' ':(exclude)deploy' ':(exclude).github' ':(exclude,glob)**/*.md')"
  if [ -n "$RAZLIKA" ]; then
    echo "Od verzije na serveru (${KOD:0:7}) promenjen je i kod:"
    echo "$RAZLIKA" | sed 's/^/  /'
    echo "Potreban je pun deploy: ./deploy/objavi.sh $CILJ"
    exit 1
  fi
  # --delay-updates: sve izmenjene datoteke se zamene tek na kraju prenosa (server nikad ne čita pola objave);
  # P slike/**: stare slike se ne brišu, jer ih možda prikazuje soba u toku (počistiće ih sledeći pun deploy)
  # --checksum: upisuje se samo ono čiji se sadržaj promenio (git archive svima daje vreme commita)
  rsync -rlptz --checksum --chown=gric:gric --delete-after --delay-updates --filter='P slike/**' \
    "$IZVOR/kvizovi/" "$CILJ:$DIR/kvizovi/" | { grep -v 'cannot delete non-empty directory' || true; }
  # /api/kvizovi odmah ponovo učitava izmenjene kvizove – proveri da server vidi isto što i ovaj commit
  OCEKIVANO="$(cd "$IZVOR" && node -e "const k = require('./lib/kvizovi'); k.ucitajSve(); console.log(Object.values(k.svi()).reduce((s, p) => s + p.pitanja.length, 0))")"
  NA_SERVERU="$(ssh "$CILJ" "curl -fsS http://127.0.0.1:3000/api/kvizovi" | node -e "let t = ''; process.stdin.on('data', (d) => (t += d)).on('end', () => console.log(JSON.parse(t).filter((k) => k.id !== 'opste').reduce((s, k) => s + k.broj, 0)))")"
  if [ "$OCEKIVANO" = "$NA_SERVERU" ]; then echo "Pitanja objavljena ✓ ($NA_SERVERU pitanja; nove sobe ih već dobijaju, sobe u toku igraju dalje)"
  else echo "Upozorenje: server vidi $NA_SERVERU pitanja, a commit ih ima $OCEKIVANO – pogledaj: ssh $CILJ journalctl -u gric-kviz -n 50"; exit 1; fi
  exit 0
fi

if [ "$NACIN" = "--prvi-put" ]; then
  ssh "$CILJ" "DOMEN='${DOMEN:-}' bash -s" < deploy/postavi-server.sh
fi

rsync -az --delete \
  --exclude .github --exclude podaci/statistika.json --exclude podaci/odigrana-pitanja.json --exclude 'podaci/telemetrija.db*' \
  "$IZVOR/" "$CILJ:$DIR/"

# server se pokreće ~1–2 s (učitava rečnik), pa se odgovor čeka do 15 s
ssh "$CILJ" "chown -R gric:gric $DIR && echo $COMMIT > $DIR/.objavljeno && systemctl restart gric-kviz && systemctl is-active gric-kviz && for i in \$(seq 30); do curl -fsS http://127.0.0.1:3000/api/info >/dev/null 2>&1 && { echo 'Igra radi ✓'; exit 0; }; sleep 0.5; done; echo 'Igra ne odgovara – journalctl -u gric-kviz -n 50'; exit 1"
