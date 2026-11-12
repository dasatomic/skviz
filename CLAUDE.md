# Skviz – porodični kućni kviz

Kviz u stilu Jackbox igara za porodicu: server radi na ovom računaru, svi igraju preko telefona u kućnoj Wi-Fi mreži.
Ceo interfejs, pitanja i komentari u kodu su na **srpskom (latinica)**. Igrači su deca 11–15 godina i odrasli.

## Pokretanje
- `node server.js` (ili `npm start`), port 3000 (`PORT=…` za drugi). Bez npm zavisnosti – samo Node.
- Telefoni: `http://<IP računara>:3000`, TV/veliki ekran: `/ekran`.
- Firewall (ufw) mora da propušta port: `sudo ufw allow 3000/tcp`.
- Objava na server: `./deploy/objavi.sh root@IP` (pun, restart) ili `… --pitanja` (samo `kvizovi/`, bez restarta – server pokupi izmene za ≤10 s, sobe u toku zadržavaju svoja pitanja). Detalji u `deploy/README.md`.

## Struktura
- `server.js` – HTTP + Server-Sent Events (`/api/dogadjaji`), akcije preko `POST /api/akcija`.
- `lib/soba.js` – tok igre: lobi → uvod → pitanje/otkrivanje ×N → tabela → reči ×N → tabela → kraj.
- ID igrača: telefon čuva **tajni** id (`ja.id` u localStorage) i šalje ga samo serveru; `server.js` iz njega izvodi **javni** id (`javniId`, HMAC) i samo taj ide u `Soba` i u stanje koje vide ostali. Klijent se prepoznaje po `V.ja` (ne po `ja.id`), a akcije nad drugima (`izbaci`, `vodja`) šalju javni id.
- Pismo: podrazumevano ćirilica za ceo prikaz (`podesavanja.pismo`, na početnom ekranu izbor po uređaju). Kod i `kviz.json` ostaju na latinici – `public/app.js` preslovljava DOM u hodu (`tr`, `prevedi`, MutationObserver); izuzeci: `[data-lat]`, `.formula`, kod sobe, adresa, strane reči (q/w/x/y) i oznake sa ciframa (H2O).
- Pravila preslovljavanja su u `public/pismo.js` (rimski brojevi, formule, jedinice, hemijski simboli, krvne grupe, strani navodi ostaju latinicom; izvorno pisani strani nazivi – igre, brendovi, naslovi, latinski nazivi vrsta – su u skupu `STRANE`, sa padežima i susednim rečima naziva: „Minecraftu“, „KPop Demon Hunters“, „Homo sapiens“); provera nad svim pitanjima: `node -e "require('./public/pismo.js').uCirilicu('…')"`.
- Lobi vođe u dva koraka: predmet → razred/lekcija + podešavanja + „Pokreni“ (`korakLobija`).
- Soba ima najviše 40 igrača (`MAKS_IGRACA`). Klijent ima dva prikaza: do 5 igrača avatari sa imenima, preko 5 sažeto (brojač „N / M odgovorilo“, mali avatari, skraćene liste poena – `mnogo()`, `koJeOdgovorio`, `skratiListu` u `public/app.js`).
- `lib/kvizovi.js` – učitavanje `kvizovi/*/kviz.json`, izbor pitanja (mešavina težina, prednost neodigranim – `podaci/odigrana-pitanja.json`).
- `lib/recnik.js` – „Najduža reč“: pun Hunspell rečnik `podaci/hunspell/sr.dic` + `sr.aff` (ćirilica) + `podaci/ucestalost.txt` (oba gradi `alati/gradi-recnik.js`). Važi samo osnovni oblik, ali i: vlastita imena (Venera, Beograd – osim kad su ujedno oblik obične reči: „Lepa“/лепа), prilozi od prideva (brzo, lepo), „ne-“ reči, `DODATNE`, i pojmovi `rec` iz kvizova kojih nema u Hunspellu (`postaviPojmove`, iz `lib/kvizovi.js`). Promenjen oblik se prepoznaje preko nastavaka iz `sr.aff` (`osnovniOblik`) → poruka „Oblik reči „kuća““. Računar predlaže samo obične reči i poznata imena (česta u titlovima ili iz kvizova). Slova se biraju tako da se može složiti pojam (`rec`) iz nekog od upravo odigranih pitanja (`slovaSaRecju`, `Soba.izaberiPojam`).
- `lib/statistika.js` – porodična tabla slavnih u `podaci/statistika.json`.
- `lib/telemetrija.js` + `admin/admin.html` (`/admin`, samo uz `ADMIN_LOZINKA`) – sobe uživo i istorija u SQLite-u (`podaci/telemetrija.db`, ugrađeni `node:sqlite`): događaji soba (`Soba.zabelezi`) i presek stanja svakog minuta. Bez imena igrača. Postavka u `deploy/README.md`.
- `public/` – klijent (vanilla JS): `logo.svg` (logo „Сквиз“ po ručnom crtežu), `ikona.svg`/`ikona-180.png` (slovo К), `app.js` ekrani, `mediji.js` interaktivni mediji (3D, mape, melodije…), `fizika.js` i `biologija.js` animirane SVG scene (medij `fizika`/`biologija`; `biologija.js` koristi crtanje iz `Fizika.alati`, pa se učitava posle `fizika.js`), `geo/svet.json` mape, `istorija.js` istorijske karte (približne granice po epohama, pohodi, fronte – medij `mapa` sa `"karta"`) i medij `lenta` (vremenska lenta, u `mediji.js`).
- `public/urednik.html` + `urednik.js` (`/urednik`) – urednik pitanja za ljude koji ne znaju JSON: predmet → razred/lekcija → spisak → izmena/novo sa pregledom → „Predloži“. `lib/predlozi.js` (`POST /api/predlog`) primenjuje izmenu na najnoviji `main` sa GitHub-a i otvara PR preko robot naloga (`GITHUB_TOKEN`, fork robota; postavka u `deploy/README.md`). Pitanje dobija polje `autor` (samo evidencija). Matematički zadaci se ne menjaju ovde (generišu se alatom).
- `alati/` – `proveri-kvizove.js`, `preuzmi-slike.js` (Vikipedija), `preuzmi-udzbenike.js` (Fondacija Kavčić; `node alati/preuzmi-udzbenike.js 8 --samo biologija`).
- `izvori/udzbenici/<razred>/<udžbenik>/` – preuzete stranice udžbenika (slike `str-NNNN.jpg`, `tekst.md`); nije deo igre i **nije u git-u** (`.gitignore`, tuđa autorska prava) – preuzima se alatom `alati/preuzmi-udzbenike.js`.

## Dodavanje novog kviza (npr. iz slikanih stranica knjige)
Format je opisan u `kvizovi/UPUTSTVO.md`. Ukratko:
1. Napravi folder `kvizovi/<oblast-razred-tema>/` i `kviz.json` sa `naziv`, `ikona`, `boja`, `opis`, `pitanja`.
2. Svako pitanje: `pitanje`, `odgovori` (tačno 4, **prvi je tačan**), `tezina` (1–3), `zanimljivost`, `rec` (ključni pojam 3–11 slova, idealno 5–8 – krug reči ga sakriva u slovima), opciono `mediji`.
2a. **Netačni odgovori moraju biti uverljivi i slične dužine kao tačan** – tačan odgovor ne sme da se prepoznaje po tome što je najduži ili najdetaljniji. Statistika: `node alati/duzine-odgovora.js` (tačan je najduži u ~25% pitanja, kao slučajno).
3. Pitanja pravi **svojim rečima** na osnovu gradiva (ne prepisuj odlomke iz knjige). Mešaj težine (~35% lako, 40% srednje, 25% teško), uz par pitanja koja bi pomučila i odrasle.
4. `zanimljivost` = nešto neočigledno što proširuje znanje, ne ponavljanje tačnog odgovora.
5. Kad god ima smisla, koristi interaktivne medije (molekul, telo, mapa, melodija, atom, sat, emodzi, svg).
   Slika onoga što je odgovor (glumac, pisac, mesto, životinja) ide u `medijiOdgovora` – prikazuje se tek pri otkrivanju, ispod zanimljivosti.
   **Medij ne sme da otkriva tačan odgovor**: bez ukrasnih emodžija (🐝🍯 uz „ko daje med“), formula koje su same odgovor, molekula čija legenda imenuje traženi element, slike baš onoga što se pita. Slika onoga što se prepoznaje ide uz pitanje „Koji je ovo…?“. Slike: `node alati/preuzmi-slike.js kvizovi/<paket> --lista spisak.txt` (putanja do foldera paketa, ne samo ime).
5a. Posebne vrste pitanja (`"vrsta"`): `"uljez"` (4 odgovora, prvi je uljez, obavezno `objasnjenje`) i `"spoji"` (`"parovi": [[levo, desno], …]`, 3–5 parova, bez `odgovori`). Partija ih meša oko 15% (`lib/kvizovi.js` → `izaberi`); bodovanje „spoji“ je srazmerno tačnim parovima (`lib/soba.js` → `otkrij`). Prvi primer: `kvizovi/biologija`.
6. Za učenje jedne lekcije postavi `"uOpstem": false` da se ne meša u „Opšte znanje“.
6a. Kvizovi po razredima: `kvizovi/razred<N>-<oblast>/` sa `oblast`, `razred`, `lekcije` (naslovi iz sadržaja udžbenika u `izvori/`), a svako pitanje ima `lekcija` (redni broj). Lobi: oblast → Svi razredi / 5–8 → Cela godina / lekcija. Bar 15 pitanja po lekciji, mešane težine. Izbor kviza na serveru: `opste`, `oblast:<oblast>`, `<paket>`, `<paket>#<lekcija>` (`lib/kvizovi.js` → `izvor`).
6b. **Matematički zadaci** (`"zadaci": true`, `kvizovi/razred7-matematika-zadaci`, izvor `alati/gradi-zadaci-7.js`): poseban predmet „Matematika – zadaci“, rešava se na papiru (podrazumevano 5 min, `brojZadataka`/`vremeZadatka`), bez kruga reči; umesto zanimljivosti `resenje` korak po korak sa crtežom `geo` (`public/geo.js`) koji ističe delove po koracima. Matematika u tekstu između `$…$`. Detalji u `kvizovi/UPUTSTVO.md`. Ne kopirati tekst zadataka iz zbirki – samo ideje, sopstveni brojevi.
6c. **Kategorije** (`"kategorija": true`, kviz bez pitanja, npr. `kvizovi/eksperimenti` 🚧) okupljaju podkategorije iste `oblast` bez razreda (npr. `kvizovi/eksperimenti-tla` – TLA+ po poglavljima knjige „Specifying Systems“, `"celina": "Cela knjiga"`, **na engleskom**: `"jezik": "en"` → `lang="en"`, bez preslovljavanja; `rec` ostaje srpski). Lobi/urednik: kategorija → tema → poglavlje (`grupaOblasti` → `podkategorije` u `public/app.js` i `urednik.js`). Kôd u tekstu između `$…$` (ostaje latinicom), duži isečak kao medij `kod`. Detalji u `kvizovi/UPUTSTVO.md`.
7. Pokreni `npm run proveri` – mora proći bez grešaka. Server pokupi nove kvizove bez restarta.

## Konvencije
- Ne dodavati npm zavisnosti; klijent radi i bez interneta (osim Google fonta, koji ima rezervu).
- Proveravati činjenice – pitanja su za decu i moraju biti tačna.

## Git i licence
- Repozitorijum je otvoren (kôd MIT, pitanja CC0 – javni domen). Pre dodavanja slika proveriti licencu (`node alati/licence-slika.js` osvežava `SLIKE.md`).
- Ne dodavati u git: `izvori/`, `podaci/statistika.json`, `podaci/odigrana-pitanja.json`, `podaci/telemetrija.db*`.
