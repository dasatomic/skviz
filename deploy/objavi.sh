#!/usr/bin/env bash
# Objavljivanje nove verzije na server (pokreće se SA SVOG RAČUNARA, iz korena projekta):
#   ./deploy/objavi.sh root@1.2.3.4                     – pun deploy: lokalni test, pošalji kod i pitanja, restart
#   ./deploy/objavi.sh root@1.2.3.4 --kad-niko-ne-igra  – pun deploy tek kad niko nije u sobi (čeka do SACEKAJ_MIN=30 min)
#   ./deploy/objavi.sh root@1.2.3.4 --pitanja           – samo pitanja (kvizovi/), BEZ restarta
#   ./deploy/objavi.sh root@1.2.3.4 --prvi-put          – pun deploy uz jednokratnu pripremu servera
#   DOMEN=kviz.example.com ./deploy/objavi.sh root@1.2.3.4 --prvi-put   – sa HTTPS-om na domenu
# Objavljuje se poslednji COMMIT (ili REF=<grana/tag/commit>), ne nedovršene izmene iz radnog foldera.
#
# Pun deploy NE prekida igre: stari server pri gašenju sačuva sobe (podaci/sobe.json), novi ih vrati, telefoni se
# sami povežu ponovo (~1 s pauze). Pre slanja se OBAVEZNO pokreće lokalni test (alati/test-deploy.js): igra se
# pokrene na verziji koja je sada na serveru, uradi se isti deploy na novu verziju i proveri da su sobe preživele.
#   – test pao                          → ništa se ne šalje
#   – nova verzija ne može da preuzme sobe (stari server to još ne ume, ili je promenjen Soba.FORMAT bez migracije
#     u Soba.MIGRACIJE – vidi lib/soba.js)
#                                       → deploy ide samo ako niko nije u sobi, uz --kad-niko-ne-igra ili PREKINI_SOBE=1
#   BEZ_TESTA=1   – preskoči test (samo u nuždi, npr. hitna popravka kad test ne može da radi)
set -euo pipefail
CILJ="${1:?Upotreba: ./deploy/objavi.sh root@IP-adresa [--pitanja | --prvi-put | --kad-niko-ne-igra]}"
NACIN="${2:-}"
case "$NACIN" in ''|--pitanja|--prvi-put|--kad-niko-ne-igra) ;; *) echo "Nepoznata opcija: $NACIN (dozvoljeno: --pitanja, --prvi-put, --kad-niko-ne-igra)"; exit 1 ;; esac
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

# stanje igre na serveru (/api/zdravlje: sobe, aktivne = sa prisutnim igračima, uIgri = partije u toku); prazno ako
# server ne odgovara ili je to stara verzija koja ga nema
zdravlje() { ssh "$CILJ" "curl -fsS http://127.0.0.1:3000/api/zdravlje 2>/dev/null" || true; }
# opis(json, izraz) – izraz nad poljima z (npr. z.aktivne); prazno ako json nije ispravan
opis() { node -e "try { const z = JSON.parse(process.argv[1]); console.log($2) } catch { console.log('') }" "$1" 2>/dev/null || true; }

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
  PREKID=0 # nema igara koje bi se prekinule
else
  # ───── obavezan lokalni test: igra na verziji sa servera → deploy na novu → sobe moraju da prežive ─────
  KOD="$(ssh "$CILJ" "cat $DIR/.objavljeno 2>/dev/null" || true)"
  PREKID=0
  if [ "${BEZ_TESTA:-}" = 1 ]; then
    echo "⚠ BEZ_TESTA=1 – lokalni test deploy-a je preskočen."
    [ -n "$KOD" ] && git cat-file -e "$KOD^{commit}" 2>/dev/null || PREKID=1
  elif [ -z "$KOD" ]; then
    echo "Na serveru nije zapisano koja verzija radi – ne može da se testira prelaz; smatra se da deploy prekida sobe."
    PREKID=1
  else
    git cat-file -e "$KOD^{commit}" 2>/dev/null || { echo "Commit $KOD (kod na serveru) ne postoji u ovom repozitorijumu – uradi git fetch."; exit 1; }
    echo "Lokalni test deploy-a: ${KOD:0:7} (server) → ${COMMIT:0:7}…"
    set +e
    node "$IZVOR/alati/test-deploy.js" --stara "$KOD" --nova "$COMMIT" --tiho
    T=$?
    set -e
    case $T in
      0) ;;
      2) PREKID=1 ;;
      *) echo "Lokalni test deploy-a NIJE prošao – ništa nije poslato. (Detalji: node alati/test-deploy.js --stara $KOD --nova $COMMIT)"; exit 1 ;;
    esac
  fi

  if [ "$PREKID" = 1 ] || [ "$NACIN" = "--kad-niko-ne-igra" ]; then
    Z="$(zdravlje)"
    if [ "$NACIN" = "--kad-niko-ne-igra" ]; then
      [ -n "$Z" ] || { echo "Server ne daje /api/zdravlje (stara verzija) – ne vidim ko igra. Kad znaš da niko ne igra: PREKINI_SOBE=1 ./deploy/objavi.sh $CILJ"; exit 1; }
      KRAJ=$(( $(date +%s) + ${SACEKAJ_MIN:-30} * 60 ))
      while [ "$(opis "$Z" z.aktivne)" != 0 ]; do
        [ "$(date +%s)" -lt "$KRAJ" ] || { echo "I posle ${SACEKAJ_MIN:-30} min neko igra – deploy nije urađen. Pokušaj kasnije."; exit 1; }
        echo "  $(opis "$Z" "z.aktivne + ' soba sa igračima (' + z.uIgri + ' u partiji, ' + z.igraca + ' igrača) – čekam…'")"
        sleep 30
        Z="$(zdravlje)"
        [ -n "$Z" ] || { echo "Server ne odgovara – prekidam."; exit 1; }
      done
      echo "Niko nije u sobi – nastavljam."
    elif [ "${PREKINI_SOBE:-}" = 1 ]; then
      echo "⚠ PREKINI_SOBE=1 – sobe u toku se prekidaju."
    elif [ "$(opis "$Z" z.aktivne)" = 0 ]; then
      echo "Ovaj deploy prekida sobe, ali sada niko nije u sobi – nastavljam."
    else
      echo
      echo "Ovaj deploy PREKIDA sobe u toku$([ -n "$Z" ] && opis "$Z" "', a sada je ' + z.aktivne + ' soba sa igračima (' + z.uIgri + ' u partiji)'")."
      echo "  ./deploy/objavi.sh $CILJ --kad-niko-ne-igra     – sačekaj da niko ne igra"
      echo "  PREKINI_SOBE=1 ./deploy/objavi.sh $CILJ         – svejedno objavi (sobe se prekidaju)"
      exit 1
    fi
  fi
fi

# --delay-updates: izmenjene datoteke se zamene tek na kraju prenosa; izuzeci (statistika, ključ id-jeva, sačuvane
# sobe…) se ne šalju i ne brišu – isti spisak koristi i lokalni test
# --checksum: git archive svim fajlovima daje vreme commita, pa bi fajl iste veličine iz commita napravljenog u istoj
# sekundi (amend) rsync preskočio kao „isti“
rsync -az --checksum --delete --delay-updates --exclude-from="$IZVOR/deploy/izuzeci-rsync.txt" "$IZVOR/" "$CILJ:$DIR/"

# Caddy podešavanje iz deploy/caddy.sh (dira se samo ako se razlikuje od onoga na serveru)
ssh "$CILJ" "DOMEN='${DOMEN:-}' bash -s" < "$IZVOR/deploy/caddy.sh"

# restart: stari server na SIGTERM sačuva sobe, novi ih vrati (~1 s); odgovor se čeka do 15 s
ssh "$CILJ" "chown -R gric:gric $DIR && echo $COMMIT > $DIR/.objavljeno && systemctl restart gric-kviz && systemctl is-active gric-kviz && for i in \$(seq 30); do curl -fsS http://127.0.0.1:3000/api/info >/dev/null 2>&1 && exit 0; sleep 0.5; done; echo 'Igra ne odgovara – journalctl -u gric-kviz -n 50'; exit 1"
# zapamti lokalno šta je objavljeno (podrazumevana „stara“ verzija za ručni test: node alati/test-deploy.js)
git update-ref refs/skviz/objavljeno "$COMMIT" 2>/dev/null || true
Z="$(zdravlje)"
if [ -n "$Z" ]; then
  echo "Igra radi ✓ ($(opis "$Z" "'vraćeno soba: ' + z.vraceno + ', sa igračima: ' + z.aktivne"))"
else
  echo "Igra radi ✓"
fi
