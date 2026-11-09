# Skviz – porodični kućni kviz

Kviz u stilu Jackbox igara za porodicu: server radi na ovom računaru, svi igraju preko telefona u kućnoj Wi-Fi mreži.
Ceo interfejs, pitanja i komentari u kodu su na **srpskom (latinica)**. Igrači su deca 11–15 godina i odrasli.

## Pokretanje
- `node server.js` (ili `npm start`), port 3000 (`PORT=…` za drugi). Bez npm zavisnosti – samo Node.
- Telefoni: `http://<IP računara>:3000`, TV/veliki ekran: `/ekran`.
- Firewall (ufw) mora da propušta port: `sudo ufw allow 3000/tcp`.

## Struktura
- `server.js` – HTTP + Server-Sent Events (`/api/dogadjaji`), akcije preko `POST /api/akcija`.
- `lib/soba.js` – tok igre: lobi → uvod → pitanje/otkrivanje ×N → tabela → reči ×N → tabela → kraj.
- Pismo: podrazumevano ćirilica za ceo prikaz (`podesavanja.pismo`, na početnom ekranu izbor po uređaju). Kod i `kviz.json` ostaju na latinici – `public/app.js` preslovljava DOM u hodu (`tr`, `prevedi`, MutationObserver); izuzeci: `[data-lat]`, `.formula`, kod sobe, adresa, strane reči (q/w/x/y) i oznake sa ciframa (H2O).
- Lobi vođe u dva koraka: predmet → razred/lekcija + podešavanja + „Pokreni“ (`korakLobija`).
- Soba ima najviše 40 igrača (`MAKS_IGRACA`). Klijent ima dva prikaza: do 5 igrača avatari sa imenima, preko 5 sažeto (brojač „N / M odgovorilo“, mali avatari, skraćene liste poena – `mnogo()`, `koJeOdgovorio`, `skratiListu` u `public/app.js`).
- `lib/kvizovi.js` – učitavanje `kvizovi/*/kviz.json`, izbor pitanja (mešavina težina, prednost neodigranim – `podaci/odigrana-pitanja.json`).
- `lib/recnik.js` – „Najduža reč“: `podaci/recnik.txt` (Hunspell sr, osnovni oblici, ćirilica) + `podaci/ucestalost.txt`. Slova se biraju tako da se može složiti pojam (`rec`) iz nekog od upravo odigranih pitanja (`slovaSaRecju`, `Soba.izaberiPojam`).
- `lib/statistika.js` – porodična tabla slavnih u `podaci/statistika.json`.
- `public/` – klijent (vanilla JS): `logo.svg` (logo „Сквиз“ po ručnom crtežu), `ikona.svg`/`ikona-180.png` (slovo К), `app.js` ekrani, `mediji.js` interaktivni mediji (3D, mape, melodije…), `geo/svet.json` mape.
- `alati/` – `proveri-kvizove.js`, `preuzmi-slike.js` (Vikipedija), `preuzmi-udzbenike.js` (Fondacija Kavčić; `node alati/preuzmi-udzbenike.js 8 --samo biologija`).
- `izvori/udzbenici/<razred>/<udžbenik>/` – preuzete stranice udžbenika (slike `str-NNNN.jpg`, `tekst.md`); nije deo igre i **nije u git-u** (`.gitignore`, tuđa autorska prava) – preuzima se alatom `alati/preuzmi-udzbenike.js`.

## Dodavanje novog kviza (npr. iz slikanih stranica knjige)
Format je opisan u `kvizovi/UPUTSTVO.md`. Ukratko:
1. Napravi folder `kvizovi/<oblast-razred-tema>/` i `kviz.json` sa `naziv`, `ikona`, `boja`, `opis`, `pitanja`.
2. Svako pitanje: `pitanje`, `odgovori` (tačno 4, **prvi je tačan**), `tezina` (1–3), `zanimljivost`, `rec` (ključni pojam 3–11 slova, idealno 5–8 – krug reči ga sakriva u slovima), opciono `mediji`.
3. Pitanja pravi **svojim rečima** na osnovu gradiva (ne prepisuj odlomke iz knjige). Mešaj težine (~35% lako, 40% srednje, 25% teško), uz par pitanja koja bi pomučila i odrasle.
4. `zanimljivost` = nešto neočigledno što proširuje znanje, ne ponavljanje tačnog odgovora.
5. Kad god ima smisla, koristi interaktivne medije (molekul, telo, mapa, melodija, atom, sat, emodzi, svg).
5a. Posebne vrste pitanja (`"vrsta"`): `"uljez"` (4 odgovora, prvi je uljez, obavezno `objasnjenje`) i `"spoji"` (`"parovi": [[levo, desno], …]`, 3–5 parova, bez `odgovori`). Partija ih meša oko 15% (`lib/kvizovi.js` → `izaberi`); bodovanje „spoji“ je srazmerno tačnim parovima (`lib/soba.js` → `otkrij`). Prvi primer: `kvizovi/biologija`.
6. Za učenje jedne lekcije postavi `"uOpstem": false` da se ne meša u „Opšte znanje“.
6a. Kvizovi po razredima: `kvizovi/razred<N>-<oblast>/` sa `oblast`, `razred`, `lekcije` (naslovi iz sadržaja udžbenika u `izvori/`), a svako pitanje ima `lekcija` (redni broj). Lobi: oblast → Svi razredi / 5–8 → Cela godina / lekcija. Bar 15 pitanja po lekciji, mešane težine. Izbor kviza na serveru: `opste`, `oblast:<oblast>`, `<paket>`, `<paket>#<lekcija>` (`lib/kvizovi.js` → `izvor`).
7. Pokreni `npm run proveri` – mora proći bez grešaka. Server pokupi nove kvizove bez restarta.

## Konvencije
- Ne dodavati npm zavisnosti; klijent radi i bez interneta (osim Google fonta, koji ima rezervu).
- Proveravati činjenice – pitanja su za decu i moraju biti tačna.

## Git i licence
- Repozitorijum je otvoren (kôd MIT, pitanja CC BY-SA 4.0). Pre dodavanja slika proveriti licencu (`node alati/licence-slika.js` osvežava `SLIKE.md`).
- Ne dodavati u git: `izvori/`, `podaci/statistika.json`, `podaci/odigrana-pitanja.json`.
