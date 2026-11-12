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
| `odgovori` | **tačno 4**, **prvi je uvek tačan** – igra ih sama meša ; netačni odgovori treba da budu uverljivi i **slične dužine kao tačan** (tačan odgovor ne sme da se prepozna po dužini ili po tome što je jedini opisan) |
| `tezina` | 1 = lako, 2 = srednje, 3 = teško (vredi ×1,5 poena) |
| `zanimljivost` | prikazuje se posle odgovora („💡 Da li si znao?“) – treba da bude nešto *neočigledno* |
| `rec` | ključni pojam pitanja (3–11 slova, idealno 5–8, latinicom). U krugu „Najduža reč“ slova se biraju tako da se može složiti pojam iz nekog od odigranih pitanja – da se gradivo još jednom ponovi. Ne mora biti tačan odgovor, ali treba da je srodan (npr. za „Ko je izumeo gromobran?“ → `gromobran`). Vlastita imena su u redu (`pupin`, `mileševa`). Najbolje u osnovnom obliku (`kost`, ne `kosti`): takav pojam važi kao reč u svakom krugu, i kad ga nema u rečniku (`aksolotl`); promenjen oblik (`oči`, `biljke`) važi samo kad je baš on skriven u slovima. Ako izostane, bira se automatski iz odgovora, pitanja i zanimljivosti. |
| `autor` | (opciono) ime i prezime autora pitanja (više autora odvojeno zarezom) – samo za evidenciju, u igri se ne prikazuje. Urednik pitanja (`/urednik`) ga upisuje sam. |
| `objasnjenje` | (opciono) kratko objašnjenje zašto je odgovor tačan |
| `medijiOdgovora` | (opciono) medij koji se prikazuje tek posle odgovora, ispod zanimljivosti – isti oblik kao `mediji` (najčešće `{"vrsta":"slika","src":"slike/x.jpg","opis":"…"}`). Za sliku onoga što je tačan odgovor (glumac, pisac, životinja), koja bi u pitanju otkrila rešenje. |
| `vreme` | (opciono) sekundi za ovo pitanje, umesto podešavanja sobe |
| `uOpstem` | `false` = kviz se ne meša u „Opšte znanje“ (npr. za kvizove za učenje jedne lekcije) |
| `oblast` | (opciono) npr. `"biologija"` – svi kvizovi iste oblasti (opšti + po razredima) prikazuju se u lobiju kao jedna kartica |
| `razred` | (opciono) 5–8 – kviz za taj razred; u lobiju se bira „Svi razredi / 5. / 6. / 7. / 8.“ |
| `lekcije` | (opciono) spisak lekcija iz udžbenika: `[{"naziv":"Ćelijska građa","tema":"Poreklo i raznovrsnost života","strana":26}]` |
| `lekcija` | (u pitanju) redni broj lekcije iz spiska `lekcije` (od 1) – posle izbora razreda može se igrati „Cela godina“ ili jedna lekcija |
| `kategorija` | `true` = kviz bez pitanja koji samo imenuje oblast u lobiju (naziv, ikona, boja) – vidi „Kategorije i podkategorije“ |
| `celina` | (opciono) natpis za ceo kviz sa lekcijama umesto „Cela godina“, npr. `"Cela knjiga"` |
| `jezik` | (opciono) jezik sadržaja, npr. `"en"` – pitanja, odgovori, zanimljivosti i nazivi lekcija se prikazuju sa `lang="en"` i nikad ne preslovljavaju u ćirilicu (interfejs ostaje srpski) |

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

## Kategorije i podkategorije (npr. „Eksperimenti“ → TLA+)

Za teme van školskog gradiva: kategorija je kviz bez pitanja sa `"kategorija": true` (npr. `kvizovi/eksperimenti/kviz.json`, ikona 🚧, `"oblast": "eksperimenti"` – ime foldera = ime oblasti). Svaki kviz sa istom `oblast` i bez `razred` je njena podkategorija (npr. `kvizovi/eksperimenti-tla`, „TLA+“). U lobiju: kartica kategorije → „Sve teme“ ili jedna tema → (ako tema ima `lekcije`) cela tema ili jedno poglavlje. Podkategorije obično imaju `"uOpstem": false`.

Primer: `kvizovi/eksperimenti-tla` – pitanja po poglavljima knjige Leslija Lamporta „Specifying Systems“ (besplatna, `izvori/knjige/tla/`, nije u git-u), sa `"celina": "Cela knjiga"` i `"jezik": "en"` – pitanja su na engleskom, a `rec` (krug „Najduža reč“) ostaje srpski. Kôd u tekstu ide između `$…$` (`mat()` u `public/app.js` – važi i za zanimljivost, objašnjenje i parove), a duži isečak kao medij `kod`.

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
| mapa (istorijska) | `{"vrsta":"mapa","karta":"srbija-1833","istakni":["pasaluk"],"bezNatpisa":true,"tacke":[{"lat":44.33,"lon":20.6,"oznaka":"Orašac","znak":"⚔️"}]}` | karte iz prošlosti (`public/istorija.js`): granice iz tog doba se crtaju preko kopna, bez današnjih granica. Karte: srbija-1833, srbija-1878, balkan-1878, san-stefano, balkan-1912, balkan-1913, crna-gora, crna-gora-1913, vojna-krajina, vojvodina, osmansko-carstvo, evropa-1812, italija, nemacka, kolonije-13, sad-1783, gradjanski-rat, afrika-1914, svet-1914, evropa-1914, zapadni-front, solunski-front, albanska-golgota. `istakni` = ključevi slojeva (treperi), `sakrij`/`bezNatpisa` sakriva natpise (za „Koja je ovo država?“), `legenda: []` sakriva legendu; dodatno `linije: [{"l":"garibaldi","strelica":true}]` (pohodi, fronte), `slojevi`, `natpisi`, `kutija` |
| lenta | `{"vrsta":"lenta","od":1800,"do":1840,"dogadjaji":[{"g":1804,"t":"Prvi ustanak"},{"g":1815,"t":"?","ist":true}],"periodi":[{"od":1804,"do":1813,"t":"Karađorđe","boja":"#3d7fd9"}]}` | vremenska lenta: događaji se sami raspoređuju iznad i ispod ose; `ist` ističe događaj, `n` menja natpis godine (npr. `"?"` ili `"maj 1913."`) |
| sat | `{"vrsta":"sat","vreme":"3:30"}` | analogni sat |
| formula | `{"vrsta":"formula","tekst":"2¹⁰ = ?"}` | veliki tekst (formule, rečenice za analizu) |
| citat | `{"vrsta":"citat","tekst":"„Svaki Srbin… jednak je pred zakonima“"}` | istaknut citat ili kratka poruka; za razliku od formule preslovljava se u ćirilicu |
| emodzi | `{"vrsta":"emodzi","tekst":"🧙‍♂️⚡👓"}` | rebus od emodžija |
| svg | `{"vrsta":"svg","kod":"<svg …>"}` | sopstveni crtež (geometrija, grafici) |
| kod | `{"vrsta":"kod","tekst":"Init == x = 0\nNext == x' = x + 1"}` | isečak izvornog koda: monospace, poravnat levo, uvek latinicom; redovi do ~40 znakova (telefon) |
| biologija | `{"vrsta":"biologija","scena":"celija","tip":"biljna","istakni":"vakuola"}` | animirana scena (`public/biologija.js`, parametri opisani iznad svake scene): `celija`, `deoba`, `fotosinteza`, `transpiracija`, `pluca`, `varenje`, `mokraca`, `oko`, `ruka`, `preobrazaj`, `klijanje`, `cvet`, `lanac`, `tropizam`, `odabiranje`, `ogled`, `dodir`, `oplodjenje`, `riba`, `mikroskop`, `stubici`, `piramida`; za 6. razred i `protist` (ameba, papučica, euglena, volvoks), `gljiva` (pečurka, buđ), `srce` (riba, žaba, sisar), `krvotok` (otvoreni/zatvoreni), `disanje` (škrge, traheje, koža, vazdušne kese), `zubi`, `hromozomi` (deoba telesne / nastanak polnih ćelija), `mitohondrija`, `spratovi` (šuma), `ekopiramida`, `krive` (linijski grafik), `drvo` (drvo života), `satZemlje`, `antibiotik` (plesan, antibiogram, otpornost), `zaraza` (kapljice, sa/bez zaštite), `koza` (i opekotine). Za 8. razred: `enzim` (ključ i brava; `tip:'energija'` – grafik energije aktivacije), `neuron` (`mijelin`), `sinapsa`, `refleks` (refleksni luk), `kontrakcija` (aktin i miozin), `maticne`, `zlezde` (endokrine žlezde), `mozak` (delovi; `tip:'reznjevi'`), `sprega` (šećer u krvi, insulin/glukagon), `kruzenje` (`tip`: voda, ugljenik, azot; `istakni` proces), `simbioza` (lišaj, mikoriza, kvržice), `sukcesija`, `staklena` (efekat staklene bašte, `pojacan`), `jaje` (omotači jajeta), `kopno` (izlazak na kopno). Scene sa delovima imaju `natpisi` i `istakni` (deo treperi i dobija „?“ – za „Kako se zove označeni deo?“). Natpis koji počinje sa `~` je srpska reč (preslovljava se) |

Slike sa Vikipedije: `node alati/preuzmi-slike.js kvizovi/<folder> ime-fajla "Naslov članka" [jezik]`

Samo slike sa slobodnom licencom (Commons): kadrovi iz filmova, posteri i likovi iz crtanih filmova/igrica to nisu – umesto njih fotografije glumaca, autora, mesta snimanja, stvarnih životinja i predmeta, ili dela u javnom domenu. Posle preuzimanja: `node alati/licence-slika.js` (osvežava `SLIKE.md`, ističe neslobodne).

Provera pre igranja: `npm run proveri`

## Matematički zadaci (`"zadaci": true`)

Kviz sa `"zadaci": true` (npr. `kvizovi/razred7-matematika-zadaci`) je poseban predmet: ne meša se u druge kvizove, igra se samo krug zadataka (bez „Najduže reči“), a u lobiju se bira broj zadataka (1–10) i vreme po zadatku (podrazumevano 5 min). Igrači rešavaju na papiru i biraju jedan od 4 odgovora (prvi je tačan; netačni neka budu tipične greške). Umesto zanimljivosti dobija se **rešenje korak po korak**:

```json
{ "lekcija": 10, "tezina": 2,
  "pitanje": "Katete su $9 cm$ i $12 cm$. Kolika je hipotenuza?",
  "odgovori": ["$15 cm$", "$21 cm$", "$17 cm$", "$13 cm$"],
  "mediji": { "vrsta": "geo", "t": { "C": [0, 0], "A": [12, 0], "B": [0, 9] },
              "e": [{ "p": "ABC" }, { "pu": "ACB" }, { "d": "AB", "o": "c", "id": "c" }, { "d": "CD", "k": 2 }] },
  "resenje": [ { "t": "Prvi korak…", "i": ["c"] }, { "t": "$c² = 9² + 12² = 225$" }, { "t": "…", "crtez": { "vrsta": "geo", … } } ] }
```

- Tekst između `$…$` je matematika: ostaje latinicom (oznake tačaka, promenljive). `√{x}` je koren sa crtom, `{a|b}` razlomak, `^{n}` izložilac (npr. `2^{10}`, `10^{−3}`), `_{c}` indeks (`t_{c}`), `\n` novi red.
- Crtež `geo` (opis u `public/geo.js`): tačke `t` (y nagore; treći broj = smer oznake u stepenima), elementi: `p` mnogougao, `d` duž (`o` oznaka, `isp` isprekidana, `na` mesto oznake), `u` ugao, `pu` pravi ugao, `kr` kružnica, `l` luk, `tx` tekst, `tacka`, `osa` brojevna prava (`podela`, `svaki`), `mreza` koordinatna ravan (`ose`, `podela`), `is` popunjen kružni isečak ili prsten (`r0`), `lin` izlomljena linija / grafik / popunjen lik (`zatv`), `kr` sa `pun` popunjen krug. `str` dodaje strelicu duži ili luku. **Animacija:** `{ "p": "ABC", "okreni": 90, "oko": "O" }` crta lik koji se pri prikazu koraka okreće oko tačke (rotacija, „premeštanje“ delova u dokazima površina). Mala slova su pomoćne tačke bez imena; `bezImena` sakriva imena.
- **Crtež uz pitanje ne sme da oda odgovor**: delovi rešenja (natpisi, pomoćne linije, tražena tačka) dobijaju `k`, pa se pojavljuju tek u rešenju.
- U rešenju: element sa `"k": n` pojavljuje se od n-tog koraka, a korak ističe elemente iz `"i"`. Korak sa sopstvenim `crtez` prikazuje taj crtež.
- Bar 10 zadataka po lekciji, mešane težine. Zadaci za 7. razred se grade iz `alati/gradi-zadaci-7.js`, koji učitava teme iz `alati/zadaci-7/` (`osnova.js` – spisak lekcija i pomoćne funkcije: `pravilni` mnogougao, `stubici` i `kruzni` dijagram, `kocke` izometrijska kocka, `prava`; `1-realni-brojevi.js` … `6-podaci.js`). `proveri(uslov, opis)` u alatu zaustavlja gradnju ako račun ne važi.

## Kviz „Matematika“ – pitanja iz alata i animacije

Pored ručno pisanih pitanja, `kvizovi/matematika` dobija pitanja iz `alati/matematika/<n>-<tema>.js` (kompaktan zapis: `Q(težina, pitanje, odgovori, zanimljivost, pojam, { mediji, medijiOdgovora })`, `U(…)` za uljeza, `S(…)` za spajanje, `proveri(uslov, opis)` za račun). Posle izmene: `node alati/gradi-matematiku.js && npm run proveri`.

- Pitanja su za rešavanje **u glavi**; zadaci za papir idu u `razred<N>-matematika-zadaci`.
- Crteži su medij `geo` (isti kao u zadacima); crtež uz pitanje ne sme da oda odgovor – „rešen“ crtež ide u `medijiOdgovora`.
- Oznake tačaka (`$ABC$`), promenljive (`$n$`, `$a + b$`) i formule pisati između `$…$` – inače bi se u ćirilici pretvorile u АБЦ, а + б.
- Animacije (dokazi „bez reči“) su manim scene u `alati/manim/scene.py`; `alati/manim/renderuj.sh [Scena…]` ih pravi kao animirani WebP (480 px, ponavlja se) u `kvizovi/matematika/animacije/`, a u pitanje se stavljaju kao slika: `A('pitagora', 'opis')` → `{"vrsta":"slika","src":"animacije/pitagora.webp"}`. Na animacijama su samo brojevi, slova promenljivih i znaci (ne preslovljavaju se).

