# Objavljivanje (deploy) na skviz.rs

Sve se radi sa svog računara, iz korena projekta.

```bash
cd ~/projects/gric_kviz
git add -A && git commit -m "Opis izmene"   # objavljuje se samo ono što je commitovano
git push                                     # čuva izmene na GitHub-u (nije obavezno za deploy)
./deploy/objavi.sh root@2.29.146.92
```

Na kraju treba da piše `active` i `Igra radi ✓ (vraćeno soba: N, …)`.

## Pre svakog deploy-a: lokalni test (obavezan)
Pun deploy ne prekida igre u toku, a to se **pre svakog punog deploy-a proverava lokalno**:
```bash
node alati/test-deploy.js                 # stara = poslednje objavljeno, nova = HEAD  (ili: npm run test-deploy)
node alati/test-deploy.js --nova radni    # proba necommitovanih izmena (pre commita)
```
Test na ovom računaru pokrene **staru verziju** (ono što je na serveru) iza proksija koji radi kao Caddy, otvori
5 soba u raznim fazama (lobi, pitanje, otkrivanje, krug reči) sa simuliranim telefonima i pravim pregledačem
(headless chromium), uradi **isti deploy** kao `objavi.sh` (rsync sa istim izuzecima, SIGTERM, 2,5 s pauze, start nove
verzije) i proveri da su sobe preživele: isti igrači i vođa, ista faza, poeni, odgovori, slova, rok pomeren za pauzu,
odgovor poslat dok server nije radio je primljen, telefoni i pregledač su se sami povezali (i osvežili stranicu ako je
promenjen klijent). Zatim sve partije odigra do kraja na novoj verziji. Traje ~40 s.
- `0` ✓ – sme da se objavi.  `1` ✗ – **ne objavljivati**; logovi servera ostaju u privremenom folderu koji test ispiše.
- `2` ⚠ – nova verzija namerno ne preuzima sobe (vidi „Promena formata“ ispod) – deploy prekida igre u toku.

`objavi.sh` test pokreće **sam**, za prelaz *verzija sa servera* (`/opt/gric-kviz/.objavljeno`) → *commit koji se
objavljuje*; ako test padne, ništa se ne šalje. Ručno pokretanje je za proveru pre commita i za ispitivanje grešaka.
Ostale opcije: `--stara/--nova <commit|grana|radni>`, `--pauza <ms>`, `--bez-pregledaca`, `--zadrzi`, `--tiho`.

## Kako deploy ne prekida igre
- Stari server na SIGTERM (`systemctl restart`) upiše sve sobe u `podaci/sobe.json` i zatvori veze; novi ih pri
  pokretanju vrati (ako zapis nije stariji od 10 min), pomeri rokove za trajanje pauze i nastavi tajmere.
- Javni id igrača se izvodi ključem iz `podaci/kljuc-id` (pravi se jednom), pa novi server prepoznaje iste telefone.
- Telefoni se sami ponovo povežu (i posle 502 od Caddy-ja), a akcije poslate dok server ne radi ponavljaju (~4 s).
  Ako je promenjen klijent (`public/`), stranica se osveži i vrati u istu sobu (TV ekran preko `/ekran?soba=KOD`).
- `deploy/izuzeci-rsync.txt`: šta rsync ne šalje i ne briše (statistika, telemetrija, ključ, sačuvane sobe).
- Pauza za igrače: oko 1 s (koliko se novi server pokreće).

## Promena formata stanja sobe
Čuvaju se sva polja sobe, pa **izmene koje ne menjaju format nemaju uticaja na igre u toku** – i novo polje sa
podrazumevanom vrednošću u konstruktoru je u redu. Kad se promeni značenje ili oblik postojećeg polja sobe
(`lib/soba.js`), poveća se `Soba.FORMAT`:
- **sa migracijom** (`Soba.MIGRACIJE[stari] = (soba) => …` u `lib/soba.js`) – stare sobe se prevedu i igre idu dalje
  (test to proverava kao običan deploy, `0`);
- **bez migracije** – novi server odbacuje stare sobe, test vraća `2`, a `objavi.sh` objavljuje samo:
  - ako trenutno niko nije u sobi (proveri sam), ili
  - `./deploy/objavi.sh root@2.29.146.92 --kad-niko-ne-igra` – čeka da niko ne bude u sobi (do `SACEKAJ_MIN=30` min), ili
  - `PREKINI_SOBE=1 ./deploy/objavi.sh root@2.29.146.92` – svesno prekida igre u toku.

**Prvi deploy posle uvođenja čuvanja soba** je takav slučaj (stara verzija na serveru ne ume da sačuva sobe, a nema ni
`/api/zdravlje`): objavi kad niko ne igra (pogledaj `/admin`) sa `PREKINI_SOBE=1`. Od sledećeg deploy-a sobe preživljavaju.

### Samo pitanja (bez restarta)
Kad su se menjala samo pitanja (`kvizovi/`), objavi ih bez prekidanja soba u toku:
```bash
./deploy/objavi.sh root@2.29.146.92 --pitanja
```
- Šalje se samo folder `kvizovi/`; server ga pokupi odmah (najkasnije za 10 s), bez restarta i bez prekida veza.
- Sobe u toku igraju sa već izabranim pitanjima; nove sobe (i „Pokreni“ u lobiju) dobijaju nova pitanja, kvizove i kategorije.
- Stare slike se ne brišu (možda ih prikazuje soba u toku) – čisti ih sledeći pun deploy.
- Skripta odbija ako je od poslednjeg punog deploy-a promenjen i kod (`server.js`, `lib/`, `public/`, `podaci/`…) –
  tada treba pun deploy. Pun deploy zato upisuje svoj commit u `/opt/gric-kviz/.objavljeno`
  (prvi put posle ove izmene treba jednom uraditi pun deploy).
- Na kraju piše `Pitanja objavljena ✓ (N pitanja…)` – server vidi isti broj pitanja kao commit.

## Šta skripta radi (pun deploy)
1. Uzme poslednji commit (necommitovane izmene se **ne šalju** – skripta upozori).
2. Pokrene proveru kvizova – ako ne prođe, ništa se ne šalje.
3. Pokrene **lokalni test deploy-a** (verzija sa servera → ovaj commit) – ako ne prođe, ništa se ne šalje; ako deploy
   prekida sobe (`2`), nastavlja samo kad niko nije u sobi, uz `--kad-niko-ne-igra` ili `PREKINI_SOBE=1`.
   `BEZ_TESTA=1` preskače test – samo u nuždi.
4. Pošalje kod na server u `/opt/gric-kviz` (`rsync --checksum --delay-updates`, izuzeci iz `deploy/izuzeci-rsync.txt`:
   ne dira statistiku, istoriju odigranih pitanja, telemetriju, ključ id-jeva ni sačuvane sobe).
5. Uskladi podešavanje Caddy-ja sa `deploy/caddy.sh` (dira ga samo ako se razlikuje; staro sačuva kao `/etc/caddy/Caddyfile.pre-<vreme>`).
6. Zapiše commit u `.objavljeno` (i lokalno u `refs/skviz/objavljeno`, za ručni test), restartuje servis `gric-kviz`
   (sobe se sačuvaju i vrate) i proveri da igra odgovara.

## Važno
- Pun deploy **ne prekida sobe u toku** (osim kad test kaže drugačije – vidi „Promena formata“). Za samo pitanja i dalje je brže `--pitanja` (bez restarta).
- Stanje servera za skripte (samo sa samog servera): `ssh root@2.29.146.92 curl -s localhost:3000/api/zdravlje` – broj soba, aktivnih, partija u toku, vraćenih posle restarta.
- Za pristup serveru koristi se SSH ključ dodat na Hetzneru. Ako traži lozinku, ključ nije učitan.
- Starija verzija (vraćanje): `REF=<commit> ./deploy/objavi.sh root@2.29.146.92`
- Novi server (jednom): `DOMEN=skviz.rs ./deploy/objavi.sh root@IP --prvi-put` – instalira Node, Caddy (HTTPS) i firewall (`deploy/postavi-server.sh`).

## Provera i problemi
- Da li sajt radi: `curl -s https://skviz.rs/api/info`
- Samo Caddy (bez restarta igre, sobe rade dalje): `ssh root@2.29.146.92 'bash -s' < deploy/caddy.sh`
- Logovi na serveru: `ssh root@2.29.146.92 journalctl -u gric-kviz -n 50`
- Ručni restart: `ssh root@2.29.146.92 systemctl restart gric-kviz`
- Status: `ssh root@2.29.146.92 systemctl status gric-kviz`

## Nalog za predloge (urednik pitanja, `/urednik`)

Urednik pitanja otvara pull request preko posebnog GitHub naloga („robota“). Robot **nema pravo pisanja** u `dasatomic/skviz`:
izmenu stavlja na granu u svom forku i odatle otvara PR, a vlasnik ga pregleda i prihvata ili odbija.
Ako token procuri, najviše što neko može je da otvara PR-ove i menja robotov fork.

1. **Novi nalog** (odjavi se sa svog, ili otvori privatni prozor): <https://github.com/signup>
   - imejl: zaseban, npr. `tvoja.adresa+skviz@gmail.com` (Gmail „+“ adrese stižu u isto sanduče)
   - korisničko ime: npr. `skviz-predlozi` (vidi se kao autor PR-ova)
   - GitHub dozvoljava jedan besplatan „mašinski“ nalog po osobi.
   - Podesi dvofaktorsku zaštitu (Settings → Password and authentication).
2. **Token** (prijavljen kao robot): Settings → Developer settings → Personal access tokens → **Tokens (classic)** → Generate new token (classic)
   - Note: `skviz urednik`, Expiration: 1 godina (stavi podsetnik u kalendar)
   - Scope: **samo `public_repo`**
   - Kopiraj token (`ghp_…`) – prikazuje se samo jednom.
   - Klasični token je potreban jer fine-grained token ne može da otvori PR u tuđem repozitorijumu.
3. **Token na server** (sa svog računara):
   ```bash
   ssh root@2.29.146.92 'umask 077; printf "GITHUB_TOKEN=%s\n" "ghp_TVOJ_TOKEN" > /etc/gric-kviz.env
     mkdir -p /etc/systemd/system/gric-kviz.service.d
     printf "[Service]\nEnvironmentFile=-/etc/gric-kviz.env\n" > /etc/systemd/system/gric-kviz.service.d/token.conf
     systemctl daemon-reload && systemctl restart gric-kviz'
   curl -s https://skviz.rs/api/predlog/info     # → {"ukljuceno":true,...}
   ```
   (Novi serveri dobijaju `EnvironmentFile` automatski iz `postavi-server.sh`; dovoljan je prvi red.)
   Lokalno: `GITHUB_TOKEN=ghp_… npm start`.
4. **Fork** se pravi sam pri prvom predlogu (`skviz-predlozi/skviz`).
5. Na svom nalogu (`dasatomic`): Watch → Custom → Pull requests, da stižu imejlovi o predlozima.
   GitHub Actions za PR-ove iz forka novih saradnika traže odobrenje („Approve and run“) – to je u redu.

Prihvatanje predloga: na stranici PR-a „Merge pull request“, pa `git pull` i `./deploy/objavi.sh … --pitanja` (predlozi menjaju samo pitanja).
Autor predloga vidi stanje („Čeka pregled / Prihvaćeno“) i komentare u uredniku pod „Moji predlozi“.
Ograničenja: 10 predloga na sat po adresi, 100 dnevno ukupno (`LIMIT_PREDLOGA`, `LIMIT_PREDLOGA_DAN`); provera stanja predloga („Moji predlozi“) 20 puta u minutu po adresi (`LIMIT_STANJA`).

## Admin pregled (`/admin`)
Sobe uživo (koliko ih je aktivno, iz kojih kategorija, faza igre) i istorija poslednjih 7/14/30 dana iz SQLite baze `podaci/telemetrija.db` (`lib/telemetrija.js`, ugrađeni `node:sqlite`, Node 22.13+). Beleže se samo zbirni podaci o sobama, bez imena igrača; zapisi stariji od 90 dana se brišu (`TELEMETRIJA_DANA`).

Stranica postoji samo ako je postavljena lozinka (inače `/admin` vraća 404):
```bash
ssh root@2.29.146.92 'umask 077; echo "ADMIN_LOZINKA=$(openssl rand -base64 18)" >> /etc/gric-kviz.env && systemctl restart gric-kviz && grep ADMIN_LOZINKA /etc/gric-kviz.env'
```
Lokalno: `ADMIN_LOZINKA=nesto npm start`, pa `http://localhost:3000/admin`. Prijava važi 12 sati (restart servera traži novu prijavu); 10 pokušaja prijave na 15 minuta po adresi (`LIMIT_PRIJAVA`).
