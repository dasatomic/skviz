# Kako se pravi novi kviz

Svaki kviz je jedan folder u `kvizovi/` sa fajlom `kviz.json` (i opciono folderom `slike/`).
Server sam pronalazi nove foldere – dovoljno je osvežiti lobi (nema potrebe za restartom).

```
kvizovi/
  istorija-6-srednji-vek/
    kviz.json
    slike/
      zica.jpg
```

## kviz.json

```json
{
  "naziv": "Istorija 6 – Srednji vek",
  "ikona": "🏰",
  "boja": "#c0392b",
  "opis": "Lekcije 1–5 iz udžbenika",
  "redosled": 80,
  "uOpstem": true,
  "pitanja": [
    {
      "tezina": 2,
      "pitanje": "Koje godine je Srpska crkva postala samostalna?",
      "odgovori": ["1219.", "1389.", "1166.", "1346."],
      "zanimljivost": "Nešto što nije očigledno, a lepo je znati…",
      "rec": "crkva",
      "mediji": { "vrsta": "slika", "src": "slike/zica.jpg" }
    }
  ]
}
```

| polje | značenje |
|---|---|
| `odgovori` | **tačno 4**, **prvi je uvek tačan** – igra ih sama meša |
| `tezina` | 1 = lako, 2 = srednje, 3 = teško (vredi ×1,5 poena) |
| `zanimljivost` | prikazuje se posle odgovora („💡 Da li si znao?“) – treba da bude nešto *neočigledno* |
| `rec` | ključni pojam pitanja (3–11 slova, idealno 5–8, latinicom). U krugu „Najduža reč“ slova se biraju tako da se može složiti pojam iz nekog od odigranih pitanja – da se gradivo još jednom ponovi. Ne mora biti tačan odgovor, ali treba da je srodan (npr. za „Ko je izumeo gromobran?“ → `gromobran`). Vlastita imena su u redu (`pupin`, `mileševa`). Ako izostane, bira se automatski iz odgovora, pitanja i zanimljivosti. |
| `objasnjenje` | (opciono) kratko objašnjenje zašto je odgovor tačan |
| `vreme` | (opciono) sekundi za ovo pitanje, umesto podešavanja sobe |
| `uOpstem` | `false` = kviz se ne meša u „Opšte znanje“ (npr. za kvizove za učenje jedne lekcije) |
| `oblast` | (opciono) npr. `"biologija"` – svi kvizovi iste oblasti (opšti + po razredima) prikazuju se u lobiju kao jedna kartica |
| `razred` | (opciono) 5–8 – kviz za taj razred; u lobiju se bira „Svi razredi / 5. / 6. / 7. / 8.“ |
| `lekcije` | (opciono) spisak lekcija iz udžbenika: `[{"naziv":"Ćelijska građa","tema":"Poreklo i raznovrsnost života","strana":26}]` |
| `lekcija` | (u pitanju) redni broj lekcije iz spiska `lekcije` (od 1) – posle izbora razreda može se igrati „Cela godina“ ili jedna lekcija |

## Posebne vrste pitanja (`"vrsta"`)

Pored običnih pitanja sa 4 odgovora (`"vrsta": "izbor"`, podrazumevano) postoje:

**Izbaci uljeza** – 4 pojma, od kojih jedan ne pripada ostalima. **Prvi u spisku je uljez** (igra meša redosled). Obavezno `objasnjenje`: zašto je baš on uljez i šta povezuje ostale.
```json
{ "vrsta": "uljez", "tezina": 1, "pitanje": "Ko ovde NIJE sisar?",
  "odgovori": ["Pingvin", "Delfin", "Slepi miš", "Kit"],
  "objasnjenje": "Pingvin je ptica, a delfin, slepi miš i kit su sisari.",
  "zanimljivost": "…", "rec": "pingvin" }
```

**Spoji pojmove** – 3–5 parova `[levo, desno]` (preporuka 4). Igra meša obe kolone; igrač dodirne pojam levo, pa njegov par desno. Poeni se dele srazmerno broju tačnih parova, a „tačno“ (i niz) računa se tek kad su svi parovi dobri. Pitanje automatski dobija 5 s više po paru. Pojmovi desno treba da budu kratki (do ~40 znakova) i jednoznačni – svaki levo sme da odgovara samo jednom desno.
```json
{ "vrsta": "spoji", "tezina": 2, "pitanje": "Spoji organ sa njegovom ulogom",
  "parovi": [["Srce", "Pumpa krv"], ["Pluća", "Razmena gasova"], ["Bubrezi", "Prečišćavaju krv"], ["Želudac", "Vari hranu"]],
  "zanimljivost": "…", "rec": "organ" }
```

U jednoj partiji ovakva pitanja čine oko 15% (npr. 2 od 15), naizmenično po vrsti, kad god ih izabrani kviz ima.

## Kvizovi po razredima i lekcijama

Folder `kvizovi/razred<N>-<oblast>/` (npr. `razred6-biologija`) sa `"oblast"`, `"razred"`, `"uOpstem": false` i spiskom `lekcije` (naslovi iz sadržaja udžbenika, redom).
Svaka lekcija treba da ima **bar 15 pitanja** različite težine (i lakih i teških) – `npm run proveri` upozorava ako nema.
Ako lekcija sama ne daje dovoljno smislenih pitanja, dodaj srodna pitanja koja proširuju znanje iz te oblasti.
Opšti kviz oblasti (npr. `kvizovi/biologija`) dobija samo `"oblast": "biologija"` i ulazi u izbor „Svi razredi“.

## Mediji (`"mediji": {...}`)

| vrsta | primer | napomena |
|---|---|---|
| slika | `{"vrsta":"slika","src":"slike/x.jpg","opis":"potpis"}` | dodir uvećava; `"zamagljeno":true` – slika se polako izoštrava |
| melodija | `{"vrsta":"melodija","note":"E4 E4 F4 G4/2 R/1 C4+E4+G4/2","tempo":120,"instrument":"klavir"}` | `/2` = trajanje u dobama, `R` = pauza, `+` = akord; instrumenti: klavir, flauta, violina, orgulje, truba, fagot |
| morze | `{"vrsta":"morze","tekst":"SOS"}` | zvuk + svetlo |
| molekul | `{"vrsta":"molekul","ime":"voda"}` | 3D, okreće se prstom. Gotovi: voda, ugljen-dioksid, metan, amonijak, kiseonik, azot, vodonik, ozon, hlorovodonik, vodonik-peroksid, etanol, benzen, sumporna-kiselina, so, dijamant, glukoza. Svoj: `"atomi":[["O",0,0,0],["H",0.76,0.59,0]],"veze":[[0,1,1]]` |
| telo | `{"vrsta":"telo","oblik":"kocka"}` | tetraedar, kocka, kvadar, oktaedar, dodekaedar, ikosaedar, prizmaN, piramidaN, bipiramidaN, valjak, kupa, lopta |
| atom | `{"vrsta":"atom","ljuske":[2,8,1],"jezgro":"11+"}` | Borov model, elektroni kruže |
| planeta | `{"vrsta":"planeta","ime":"saturn"}` | merkur, venera, zemlja, mesec, mars, jupiter, saturn, uran, neptun, sunce |
| dnk | `{"vrsta":"dnk"}` | 3D dvostruka spirala |
| mapa | `{"vrsta":"mapa","oblast":"srbija","tacke":[{"lat":44.8,"lon":20.46}],"reke":["Dunav"],"istakni":["SRB"]}` | oblasti: svet, evropa, balkan, srbija, afrika, azija, j-amerika, s-amerika, australija, bliski-istok; ili `"silueta":"ITA"` (samo obris države). Države su ISO kodovi (SRB, ITA, FRA…). Reke: Dunav, Sava, Tisa, Morava, Drina, Rajna, Volga, Nil, Amazon, Misisipi, Jangce, Temza, Sena, Loara, Elba, Visla, Po, Tibar |
| sat | `{"vrsta":"sat","vreme":"3:30"}` | analogni sat |
| formula | `{"vrsta":"formula","tekst":"2¹⁰ = ?"}` | veliki tekst (formule, rečenice za analizu) |
| emodzi | `{"vrsta":"emodzi","tekst":"🧙‍♂️⚡👓"}` | rebus od emodžija |
| svg | `{"vrsta":"svg","kod":"<svg …>"}` | sopstveni crtež (geometrija, grafici) |

Slike sa Vikipedije: `node alati/preuzmi-slike.js kvizovi/<folder> ime-fajla "Naslov članka" [jezik]`

Provera pre igranja: `npm run proveri`
