// Gradi kvizovi/razred7-matematika-zadaci/kviz.json
// Izvor zadataka za 7. razred (kompaktan zapis + pomoćne funkcije za crteže).
// Posle izmene:  node alati/gradi-zadaci-7.js && npm run proveri
const fs = require('fs');
const path = require('path');
const KOREN = path.join(__dirname, '..');

const G = (t, e, x = {}) => ({ vrsta: 'geo', t, e, ...x });
const K = (t, i, crtez) => ({ t, ...(i && i.length ? { i } : {}), ...(crtez ? { crtez } : {}) });
const zadaci = [];
let lek = 0;
const Z = (tezina, pitanje, odgovori, resenje, mediji) => zadaci.push({ lekcija: lek, tezina, pitanje, odgovori, ...(mediji ? { mediji } : {}), resenje });
const r = (x) => +x.toFixed(3);
const S3 = Math.sqrt(3);

const T = (naziv) => naziv; // tema
const lekcije = [
  ['Kvadrat racionalnog broja', 'Realni brojevi'],
  ['Rešavanje jednačine x² = a', 'Realni brojevi'],
  ['Kvadratni koren', 'Realni brojevi'],
  ['Iracionalni brojevi i brojevna prava', 'Realni brojevi'],
  ['Decimalni zapisi racionalnih i iracionalnih brojeva', 'Realni brojevi'],
  ['Približna vrednost', 'Realni brojevi'],
  ['Osnovne računske operacije i kvadratni koren', 'Realni brojevi'],
  ['Funkcija direktne proporcionalnosti', 'Realni brojevi'],
  ['Produžena proporcija', 'Realni brojevi'],
  ['Pitagorina teorema', 'Pitagorina teorema'],
  ['Obrnuta Pitagorina teorema', 'Pitagorina teorema'],
  ['Primena Pitagorine teoreme na pravougaonik i kvadrat', 'Pitagorina teorema'],
  ['Primena Pitagorine teoreme na jednakokraki i jednakostranični trougao', 'Pitagorina teorema'],
  ['Primena Pitagorine teoreme na paralelogram, romb i deltoid', 'Pitagorina teorema'],
  ['Primena Pitagorine teoreme na trapez', 'Pitagorina teorema'],
  ['Konstrukcije tačaka na brojevnoj pravoj koje odgovaraju kvadratnim korenima', 'Pitagorina teorema'],
  ['Rastojanje između dve tačke u koordinatnoj ravni', 'Pitagorina teorema'],
  ['Stepenovanje prirodnim brojem', 'Celi algebarski izrazi'],
  ['Operacije sa stepenima; stepen proizvoda i količnika', 'Celi algebarski izrazi'],
  ['Stepenovanje dekadne jedinice celim brojem', 'Celi algebarski izrazi'],
  ['Algebarski izrazi; brojevna vrednost izraza', 'Celi algebarski izrazi'],
  ['Polinomi; operacije sa polinomima', 'Celi algebarski izrazi'],
  ['Kvadrat binoma i razlika kvadrata', 'Celi algebarski izrazi'],
  ['Rastavljanje polinoma na činioce', 'Celi algebarski izrazi'],
  ['Pojam mnogougla i broj dijagonala', 'Mnogougao'],
  ['Uglovi mnogougla', 'Mnogougao'],
  ['Pravilni mnogouglovi', 'Mnogougao'],
  ['Konstrukcija pravilnih mnogouglova', 'Mnogougao'],
  ['Obim i površina mnogougla', 'Mnogougao'],
  ['Ortocentar i težište trougla', 'Mnogougao'],
  ['Složenije primene stavova podudarnosti', 'Mnogougao'],
  ['Krug i kružnica', 'Krug'],
  ['Centralni i periferijski ugao kruga', 'Krug'],
  ['Obim kruga; broj π', 'Krug'],
  ['Dužina kružnog luka', 'Krug'],
  ['Površina kruga', 'Krug'],
  ['Površina kružnog isečka i kružnog prstena', 'Krug'],
  ['Rotacija', 'Krug'],
  ['Projektni zadatak; prikupljanje podataka', 'Obrada podataka'],
  ['Statistička obeležja podataka', 'Obrada podataka'],
  ['Priprema, analiza i prezentacija podataka', 'Obrada podataka'],
].map(([naziv, tema]) => ({ naziv, tema }));
const L = (naziv) => { lek = lekcije.findIndex((l) => l.naziv === naziv) + 1; if (!lek) throw new Error(naziv); };

// ════════════════ 2.1 Pitagorina teorema ════════════════
L('Pitagorina teorema');

Z(1, 'Merdevine duge $13 m$ naslonjene su na zid. Donji kraj merdevina udaljen je $5 m$ od zida. Na kojoj visini merdevine dodiruju zid?',
  ['$12 m$', '$8 m$', '$14 m$', '$10 m$'],
  [K('Zid, tlo i merdevine čine pravougli trougao: prav ugao je u podnožju zida, a merdevine su hipotenuza ($c = 13 m$).', ['c']),
   K('Visina $h$ je kateta: $h² = c² − b² = 13² − 5² = 169 − 25 = 144$.', ['h', 'b']),
   K('$h = √{144} = 12 m$. (Pazi: kad tražimo katetu, kvadrate oduzimamo!)', ['h'])],
  G({ z: [0, 0], d: [5, 0], g: [0, 12], w1: [-0.7, 0], w2: [-0.7, 14], w3: [0, 14], t1: [-0.7, -0.5], t2: [7, -0.5], t3: [7, 0] },
    [{ p: 'w1w2w3z', b: 4 }, { p: 't1t2t3w1', b: 2 }, { pu: 'dzg' },
     { d: 'zg', o: 'h', id: 'h', isp: 1, b: 3 }, { d: 'zd', o: '5 m', id: 'b' }, { d: 'dg', o: '13 m', id: 'c', b: 1 }]));

Z(1, 'Katete pravouglog trougla su $9 cm$ i $12 cm$. Kolika je njegova hipotenuza?',
  ['$15 cm$', '$21 cm$', '$17 cm$', '$13 cm$'],
  [K('Hipotenuza je stranica naspram pravog ugla. Katete su $a = 9 cm$ i $b = 12 cm$.', ['c']),
   K('Pitagorina teorema: $c² = a² + b² = 9² + 12² = 81 + 144 = 225$.', ['a', 'b']),
   K('$c = √{225} = 15 cm$. To je poznata trojka $3, 4, 5$ – sve stranice puta $3$.', ['c'])],
  G({ C: [0, 0], A: [12, 0], B: [0, 9] }, [{ p: 'ABC', id: 'tr' }, { pu: 'ACB' }, { d: 'CA', o: '12 cm', id: 'b' }, { d: 'CB', o: '9 cm', id: 'a' }, { d: 'AB', o: 'c', id: 'c', b: 3 }]));

Z(1, 'Filip pušta zmaja na kanapu dugom $50 m$, koji je potpuno zategnut. Njegov drug stoji tačno ispod zmaja, $30 m$ od Filipa. Koliko je zmaj visoko iznad Filipove ruke?',
  ['$40 m$', '$20 m$', '$45 m$', '$35 m$'],
  [K('Kanap, tlo i visina zmaja čine pravougli trougao sa pravim uglom kod druga $D$. Kanap je hipotenuza.', ['kanap']),
   K('$h² = 50² − 30² = 2500 − 900 = 1600$', ['h', 'baza']),
   K('$h = √{1600} = 40 m$ (trojka $3, 4, 5$ puta $10$).', ['h'])],
  G({ F: [0, 0], D: [30, 0], Z: [30, 40] }, [{ pu: 'FDZ' }, { d: 'FD', o: '30 m', id: 'baza' }, { d: 'DZ', o: 'h', id: 'h', isp: 1, b: 3 }, { d: 'FZ', o: '50 m', id: 'kanap', b: 1 }, { tx: '🪁', at: [32.5, 42] }]));

Z(2, 'Dva biciklista istovremeno krenu sa raskrsnice dva puta koji se seku pod pravim uglom: jedan vozi $16 km/h$, a drugi $12 km/h$. Koliko su udaljeni posle sat i po vožnje?',
  ['$30 km$', '$42 km$', '$6 km$', '$36 km$'],
  [K('Za $1,5 h$ prvi pređe $16 · 1,5 = 24 km$, a drugi $12 · 1,5 = 18 km$.', ['rb', 'rp']),
   K('Putevi su normalni, pa je njihovo rastojanje hipotenuza: $d² = 24² + 18² = 576 + 324 = 900$.', ['d']),
   K('$d = √{900} = 30 km$. (Opet $3, 4, 5$ – ovog puta puta $6$.)', ['d'])],
  G({ R: [0, 0], B: [24, 0], P: [0, 18] }, [{ pu: 'BRP' }, { d: 'RB', o: '24 km', id: 'rb' }, { d: 'RP', o: '18 km', id: 'rp' }, { d: 'BP', o: 'd', id: 'd', isp: 1, b: 3 }, { tx: '🚲', at: [25.5, 1.8] }, { tx: '🚲', at: [1.8, 19.5] }]));

Z(2, 'Površina pravouglog trougla je $30 cm²$, a jedna kateta je $5 cm$. Kolika je hipotenuza?',
  ['$13 cm$', '$12 cm$', '$17 cm$', '$15 cm$'],
  [K('Površina pravouglog trougla je pola proizvoda kateta: $P = {a · b|2}$, pa je $30 = {5 · b|2}$.', ['tr']),
   K('$b = {2 · 30|5} = 12 cm$', ['b']),
   K('$c² = 5² + 12² = 25 + 144 = 169$, pa je $c = 13 cm$.', ['c'])],
  G({ C: [0, 0], A: [12, 0], B: [0, 5] }, [{ p: 'ABC', id: 'tr' }, { pu: 'ACB' }, { d: 'CB', o: '5 cm', id: 'a' }, { d: 'CA', o: 'b', id: 'b' }, { d: 'AB', o: 'c', id: 'c', b: 3 }]));

Z(2, 'Hipotenuza pravouglog trougla je $10 cm$, a katete su u razmeri $3 : 4$. Kolika je površina trougla?',
  ['$24 cm²$', '$48 cm²$', '$12 cm²$', '$30 cm²$'],
  [K('Katete označimo sa $3k$ i $4k$.', ['a', 'b']),
   K('$(3k)² + (4k)² = 10²$, tj. $9k² + 16k² = 25k² = 100$, pa je $k² = 4$ i $k = 2$.', ['c']),
   K('Katete su $6 cm$ i $8 cm$, pa je $P = {6 · 8|2} = 24 cm²$.', ['tr'])],
  G({ C: [0, 0], A: [8, 0], B: [0, 6] }, [{ p: 'ABC', id: 'tr' }, { pu: 'ACB' }, { d: 'CB', o: '3k', id: 'a' }, { d: 'CA', o: '4k', id: 'b' }, { d: 'AB', o: '10 cm', id: 'c', b: 3 }]));

Z(2, 'Katete pravouglog trougla su $15 cm$ i $20 cm$. Kolika je visina koja odgovara hipotenuzi?',
  ['$12 cm$', '$12,5 cm$', '$10 cm$', '$15 cm$'],
  [K('$c² = 15² + 20² = 225 + 400 = 625$, pa je $c = 25 cm$.', ['c']),
   K('Površinu računamo na dva načina. Preko kateta: $P = {15 · 20|2} = 150 cm²$. Preko hipotenuze: $P = {c · h|2}$.', ['tr']),
   K('$150 = {25 · h|2}$, pa je $h = {300|25} = 12 cm$.', ['h'])],
  G({ C: [0, 0], A: [20, 0], B: [0, 15], D: [7.2, 9.6] }, [{ p: 'ABC', id: 'tr' }, { pu: 'ACB' }, { pu: 'CDA' }, { d: 'CA', o: '20 cm' }, { d: 'CB', o: '15 cm' }, { d: 'AB', id: 'c', b: 3 }, { d: 'CD', o: 'h', id: 'h', isp: 1, b: 1 }]));

Z(3, 'U pravouglom trouglu $ABC$ prav ugao je kod temena $C$. Tačka $M$ je središte katete $AC$, $|MA| = 5 cm$, a $|BM| = 13 cm$. Kolika je površina trougla $ABC$?',
  ['$60 cm²$', '$30 cm²$', '$120 cm²$', '$78 cm²$'],
  [K('$M$ je središte $AC$, pa je $CM = MA = 5 cm$ i $AC = 10 cm$.', ['cm', 'ma']),
   K('U pravouglom trouglu $BCM$: $BC² = BM² − CM² = 13² − 5² = 169 − 25 = 144$, pa je $BC = 12 cm$.', ['bcm', 'bc', 'bm']),
   K('$P = {AC · BC|2} = {10 · 12|2} = 60 cm²$', ['tr'])],
  G({ C: [0, 0], A: [10, 0], M: [5, 0], B: [0, 12] }, [{ p: 'ABC', id: 'tr' }, { p: 'BCM', id: 'bcm', b: 1, k: 2 }, { pu: 'ACB' }, { d: 'CM', id: 'cm' }, { d: 'MA', o: '5 cm', id: 'ma' }, { d: 'CB', o: '?', id: 'bc' }, { d: 'BM', o: '13 cm', id: 'bm', b: 3 }, { tacka: 'M' }]));

Z(2, 'Dužina duži $AB$ je $16 cm$. Tačka $P$ pripada simetrali duži $AB$ i od prave $AB$ je udaljena $6 cm$. Koliko je tačka $P$ udaljena od tačke $A$?',
  ['$10 cm$', '$8 cm$', '$14 cm$', '$17 cm$'],
  [K('Simetrala prolazi kroz središte $S$ duži $AB$ i normalna je na nju, pa je $AS = 8 cm$ i $SP = 6 cm$.', ['sp']),
   K('Trougao $ASP$ je pravougli: $PA² = 8² + 6² = 64 + 36 = 100$, pa je $PA = 10 cm$.', ['asp', 'pa']),
   K('Svaka tačka simetrale jednako je udaljena od krajeva duži, pa je i $PB = 10 cm$.', ['pb'])],
  G({ A: [-8, 0], B: [8, 0], S: [0, 0, 150], P: [0, 6], s1: [0, -2], s2: [0, 8.5] },
    [{ d: 's1s2', isp: 1, b: 4 }, { p: 'ASP', id: 'asp', b: 1, k: 2 }, { d: 'AB', o: '16 cm', id: 'ab' }, { pu: 'BSP' }, { d: 'SP', o: '6 cm', id: 'sp' }, { d: 'PA', id: 'pa', b: 3 }, { d: 'PB', id: 'pb' }, { tacka: 'SP' }]));

Z(3, 'Dva stuba, visoka $3 m$ i $5 m$, stoje na ravnom tlu na rastojanju od $6 m$. Između njih se u zemlju zabija kočić, a kanap ide od vrha jednog stuba do kočića i od kočića do vrha drugog stuba. Kolika je najmanja moguća dužina kanapa?',
  ['$10 m$', '$14 m$', '$8 m$', '$12 m$'],
  [K('Neka je $A\'$ tačka simetrična vrhu $A$ u odnosu na tlo. Za svaki položaj kočića $S$ važi $SA = SA\'$, pa je kanap dug $A\'S + SB$.', ['pa2']),
   K('Zbir $A\'S + SB$ je najmanji kada su $A\'$, $S$ i $B$ na istoj pravoj – kočić treba zabiti tamo gde duž $A\'B$ seče tlo.', ['ab', 'as', 'sb']),
   K('Dopunimo pravougli trougao $A\'EB$: kateta $A\'E = 6 m$ (rastojanje stubova), kateta $EB = 3 + 5 = 8 m$.', ['ae', 'eb']),
   K('$A\'B² = 6² + 8² = 36 + 64 = 100$, pa je $A\'B = 10 m$. Najkraći kanap je dug $10 m$.', ['ab'])],
  G({ P: [0, 0, 160], A: [0, 3], Q: [6, 0, 20], B: [6, 5], S: [2.25, 0, -60], "A'": [0, -3], E: [6, -3], g1: [-1, 0], g2: [7, 0] },
    [{ d: 'g1g2', b: 2 }, { d: 'PA', o: '3 m', b: 3 }, { d: 'QB', o: '5 m', b: 3 }, { d: 'PQ', o: '6 m' },
     { d: "PA'", isp: 1, id: 'pa2', k: 1 }, { tacka: "A'", k: 1 },
     { d: "A'S", isp: 1, b: 1, id: 'ab', k: 2 }, { d: 'AS', b: 1, id: 'as', k: 2 }, { d: 'SB', b: 1, id: 'sb', k: 2 }, { tacka: 'S', k: 2 },
     { d: "A'E", id: 'ae', k: 3 }, { d: 'EB', isp: 1, id: 'eb', k: 3 }, { pu: "A'EB", k: 3 }]));

// ════════════════ 2.2 Obrnuta Pitagorina teorema ════════════════
L('Obrnuta Pitagorina teorema');

Z(1, 'Od kojih duži (dužine su u centimetrima) može da se sastavi pravougli trougao?',
  ['$6, 8, 10$', '$5, 6, 7$', '$4, 6, 8$', '$7, 8, 9$'],
  [K('Obrnuta Pitagorina teorema: ako je kvadrat najduže stranice jednak zbiru kvadrata druge dve, trougao je pravougli.'),
   K('$6² + 8² = 36 + 64 = 100 = 10²$ ✓ – kvadrati nad katetama zajedno imaju istu površinu kao kvadrat nad hipotenuzom.', [],
     G({ C: [0, 0], A: [8, 0], B: [0, 6], q1: [8, -8], q2: [0, -8], r1: [-6, 6], r2: [-6, 0], s1: [6, 14], s2: [14, 8] },
       [{ p: 'Cq2q1A', b: 0, o: '64' }, { p: 'CBr1r2', b: 2, o: '36' }, { p: 'ABs1s2', b: 1, o: '100' }, { p: 'ABC', b: 3 }, { pu: 'ACB' }], { bezImena: ['A', 'B', 'C'] })),
   K('Ostale trojke: $5² + 6² = 61 ≠ 49$, $4² + 6² = 52 ≠ 64$, $7² + 8² = 113 ≠ 81$ – ti trouglovi nisu pravougli.')]);

Z(1, 'Stranice trougla su $9 cm$, $40 cm$ i $41 cm$. Šta je tačno?',
  ['Pravougli je, prav ugao je naspram $41 cm$', 'Pravougli je, prav ugao je naspram $40 cm$', 'Nije pravougli – oštrougli je', 'Nije pravougli – tupougli je'],
  [K('Proveravamo najdužu stranicu: $41² = 1681$.'),
   K('$9² + 40² = 81 + 1600 = 1681$ – jednako je, pa je trougao pravougli.'),
   K('Prav ugao je uvek naspram najduže stranice (hipotenuze), dakle naspram stranice od $41 cm$.', [],
     G({ C: [0, 0], A: [40, 0], B: [0, 9] }, [{ p: 'ABC' }, { pu: 'ACB' }, { d: 'CA', o: '40 cm' }, { d: 'CB', o: '9' }, { d: 'AB', o: '41 cm', b: 3 }], { bezImena: ['A', 'B', 'C'] }))]);

Z(2, 'Koja od ovih trojki brojeva NIJE Pitagorina trojka?',
  ['$16, 30, 35$', '$12, 35, 37$', '$11, 60, 61$', '$15, 36, 39$'],
  [K('Pitagorina trojka su tri prirodna broja za koje važi $a² + b² = c²$.'),
   K('$12² + 35² = 144 + 1225 = 1369 = 37²$ ✓\n$11² + 60² = 121 + 3600 = 3721 = 61²$ ✓\n$15² + 36² = 225 + 1296 = 1521 = 39²$ ✓'),
   K('$16² + 30² = 256 + 900 = 1156 = 34²$, a ne $35² = 1225$. Prava trojka je $16, 30, 34$ – to je $8, 15, 17$ puta $2$.')]);

Z(2, 'Stranice trougla su $0,7 m$, $24 dm$ i $250 cm$. Kakav je to trougao?',
  ['Pravougli', 'Oštrougli', 'Tupougli', 'Takav trougao ne postoji'],
  [K('Sve dužine izrazimo u centimetrima: $0,7 m = 70 cm$, $24 dm = 240 cm$, $250 cm$.'),
   K('$70² + 240² = 4900 + 57600 = 62500$'),
   K('$250² = 62500$ – jednako je, pa je trougao pravougli. (To je trojka $7, 24, 25$ uvećana $10$ puta.)')]);

Z(2, 'Obim trougla je $60 cm$, a dve njegove stranice su $10 cm$ i $24 cm$. Kakav je to trougao?',
  ['Pravougli', 'Oštrougli', 'Tupougli', 'Jednakokraki'],
  [K('Treća stranica: $60 − 10 − 24 = 26 cm$.'),
   K('$10² + 24² = 100 + 576 = 676$, a $26² = 676$.'),
   K('Jednako je, pa je trougao pravougli (trojka $5, 12, 13$ puta $2$), sa pravim uglom naspram stranice od $26 cm$.', [],
     G({ C: [0, 0], A: [24, 0], B: [0, 10] }, [{ p: 'ABC' }, { pu: 'ACB' }, { d: 'CA', o: '24 cm' }, { d: 'CB', o: '10 cm' }, { d: 'AB', o: '26 cm', b: 3 }], { bezImena: ['A', 'B', 'C'] }))]);

Z(3, 'Dve stranice pravouglog trougla su $20 cm$ i $99 cm$, a obim mu je ceo broj centimetara. Kolika je najduža stranica?',
  ['$101 cm$', '$99 cm$', '$119 cm$', '$97 cm$'],
  [K('Moguća su dva slučaja: obe date stranice su katete, ili je duža od njih ($99 cm$) hipotenuza.'),
   K('Ako su katete: $c² = 20² + 99² = 400 + 9801 = 10201 = 101²$, pa je $c = 101 cm$ i obim je $220 cm$ – ceo broj ✓'),
   K('Ako je $99 cm$ hipotenuza: $b² = 99² − 20² = 9801 − 400 = 9401$. Kako je $96² = 9216$ i $97² = 9409$, $√{9401}$ nije ceo broj, pa ni obim ne bi bio ceo.'),
   K('Dakle, najduža stranica je $101 cm$.')]);

Z(1, 'Stari egipatski graditelji pravili su prav ugao pomoću konopca sa $12$ jednakih razmaka između čvorova, savijenog u trougao. Kako su razmake rasporedili na tri stranice?',
  ['3, 4 i 5 razmaka', '4, 4 i 4 razmaka', '2, 5 i 5 razmaka', '3, 3 i 6 razmaka'],
  [K('Ukupno ima $12$ razmaka – zbir svih ponuđenih trojki jeste $12$, pa moramo da proverimo uglove.'),
   K('Od $3, 3, 6$ trougao se ne može sastaviti ($3 + 3 = 6$). Od $4, 4, 4$ nastaje jednakostranični trougao (svi uglovi $60°$), a $2² + 5² = 29 ≠ 25$.'),
   K('$3² + 4² = 9 + 16 = 25 = 5²$, pa je po obrnutoj Pitagorinoj teoremi ugao između stranica od $3$ i $4$ razmaka prav.', [],
     G({ A: [0, 0], B: [4, 0], C: [0, 3], a1: [1, 0], a2: [2, 0], a3: [3, 0], b1: [0, 1], b2: [0, 2], c1: [3.2, 0.6], c2: [2.4, 1.2], c3: [1.6, 1.8], c4: [0.8, 2.4] },
       [{ p: 'ABC', b: 3 }, { pu: 'BAC' }, { tacka: 'ABCa1a2a3b1b2c1c2c3c4', b: 1 }, { tx: '4', at: [2, -0.45] }, { tx: '3', at: [-0.4, 1.5] }, { tx: '5', at: [2.35, 1.8] }], { bezImena: ['A', 'B', 'C'] }))]);

Z(3, 'Stranice trougla (u cm) su $n$, $n + 7$ i $n + 8$. Za koju vrednost $n$ je trougao pravougli?',
  ['$n = 5$', '$n = 3$', '$n = 8$', '$n = 12$'],
  [K('Najduža stranica je $n + 8$, pa mora da važi $n² + (n + 7)² = (n + 8)²$.'),
   K('Kvadriramo binome: $n² + n² + 14n + 49 = n² + 16n + 64$.'),
   K('Sredimo: $n² − 2n = 15$, tj. $n(n − 2) = 15$. Traže se dva broja koji se razlikuju za $2$, a proizvod im je $15$: to su $5$ i $3$, pa je $n = 5$.'),
   K('Provera: stranice $5, 12, 13$ i $25 + 144 = 169$ ✓')]);

Z(2, 'U trouglu $ABC$ je $|AB| = 17 cm$, $|BC| = 8 cm$ i $|AC| = 15 cm$. Koliki je ugao kod temena $C$?',
  ['$90°$', '$60°$', '$45°$', '$120°$'],
  [K('Najduža stranica je $AB = 17 cm$. Ako je trougao pravougli, prav ugao je naspram nje – kod temena $C$.'),
   K('$BC² + AC² = 64 + 225 = 289 = 17² = AB²$ ✓'),
   K('Po obrnutoj Pitagorinoj teoremi ugao kod $C$ je prav: $∠C = 90°$.', [],
     G({ C: [0, 0], A: [15, 0], B: [0, 8] }, [{ p: 'ABC' }, { pu: 'ACB', b: 3 }, { d: 'CA', o: '15 cm' }, { d: 'CB', o: '8 cm' }, { d: 'AB', o: '17 cm' }]))]);

Z(3, 'Stolar pravi ram od dve letve dužine $40 cm$ i $30 cm$, spojene u temenu $A$. Da proveri ugao, izmerio je rastojanje slobodnih krajeva: $49 cm$. Šta zaključuje?',
  ['Ugao je manji od $90°$', 'Ugao je tačno $90°$', 'Ugao je veći od $90°$', 'Ne može ništa da zaključi'],
  [K('Da je ugao prav, rastojanje krajeva bi bilo hipotenuza: $√{30² + 40²} = √{2500} = 50 cm$.'),
   K('Izmereno je $49 cm$: $49² = 2401 < 2500 = 30² + 40²$.', ['bd']),
   K('Kad je kvadrat naspramne stranice manji od zbira kvadrata druge dve, ugao je oštar (manji od $90°$). Letve treba malo razmaknuti, dok rastojanje ne bude tačno $50 cm$.', ['ugao'])],
  G({ A: [0, 0], B: [40, 0], D: [1.24, 29.97] }, [{ u: 'BAD', id: 'ugao', r: 26 }, { d: 'AB', o: '40 cm' }, { d: 'AD', o: '30 cm' }, { d: 'BD', o: '49 cm', isp: 1, b: 3, id: 'bd' }]));

// ════════════════ 2.3 Pravougaonik i kvadrat ════════════════
L('Primena Pitagorine teoreme na pravougaonik i kvadrat');

Z(1, 'Kolika je dijagonala kvadrata stranice $5 cm$?',
  ['$5√{2} cm$', '$10 cm$', '$2√{5} cm$', '$5√{3} cm$'],
  [K('Dijagonala deli kvadrat na dva jednakokraka pravougla trougla sa katetama $a = 5 cm$.', ['tr', 'd']),
   K('$d² = a² + a² = 25 + 25 = 50$'),
   K('$d = √{50} = √{25 · 2} = 5√{2} cm ≈ 7,07 cm$. Uvek važi $d = a√{2}$.', ['d'])],
  G({ A: [0, 0], B: [5, 0], C: [5, 5], D: [0, 5] }, [{ p: 'ABCD' }, { p: 'ABC', b: 1, id: 'tr', k: 1 }, { pu: 'ABC' }, { d: 'AB', o: '5 cm' }, { d: 'AC', o: 'd', na: 0.78, b: 3, id: 'd' }]));

Z(1, 'Stranice pravougaonika su $8 cm$ i $15 cm$. Kolika je njegova dijagonala?',
  ['$17 cm$', '$23 cm$', '$13 cm$', '$19 cm$'],
  [K('Dijagonala i dve susedne stranice čine pravougli trougao; dijagonala je hipotenuza.', ['tr']),
   K('$d² = 8² + 15² = 64 + 225 = 289$'),
   K('$d = √{289} = 17 cm$', ['d'])],
  G({ A: [0, 0], B: [15, 0], C: [15, 8], D: [0, 8] }, [{ p: 'ABCD' }, { p: 'ABC', b: 1, id: 'tr', k: 1 }, { pu: 'ABC' }, { d: 'AB', o: '15 cm' }, { d: 'BC', o: '8 cm' }, { d: 'AC', o: 'd', na: 0.78, b: 3, id: 'd' }]));

Z(1, 'Dijagonala kvadrata je $6√{2} cm$. Koliki je obim kvadrata?',
  ['$24 cm$', '$24√{2} cm$', '$12√{2} cm$', '$36 cm$'],
  [K('Za kvadrat važi $d = a√{2}$ (iz $d² = a² + a² = 2a²$).', ['d']),
   K('$a√{2} = 6√{2}$, pa je $a = 6 cm$.', ['a']),
   K('$O = 4a = 4 · 6 = 24 cm$')],
  G({ A: [0, 0], B: [6, 0], C: [6, 6], D: [0, 6] }, [{ p: 'ABCD' }, { d: 'AB', o: 'a', id: 'a' }, { d: 'AC', o: '6√2 cm', na: 0.78, b: 3, id: 'd' }]));

Z(2, 'Dijagonala pravougaonika je $13 cm$, a jedna stranica $5 cm$. Kolika je površina pravougaonika?',
  ['$60 cm²$', '$65 cm²$', '$30 cm²$', '$78 cm²$'],
  [K('Trougao $ABC$ je pravougli sa hipotenuzom $AC = 13 cm$.', ['tr']),
   K('$AB² = 13² − 5² = 169 − 25 = 144$, pa je $AB = 12 cm$.', ['ab']),
   K('$P = 12 · 5 = 60 cm²$')],
  G({ A: [0, 0], B: [12, 0], C: [12, 5], D: [0, 5] }, [{ p: 'ABCD' }, { p: 'ABC', b: 1, id: 'tr', k: 1 }, { pu: 'ABC' }, { d: 'AB', o: '?', id: 'ab' }, { d: 'BC', o: '5 cm' }, { d: 'AC', o: '13 cm', na: 0.78, b: 3 }]));

Z(2, 'Jedna stranica pravougaonika je dva puta duža od druge, a dijagonala je $5√{5} cm$. Kolika je površina pravougaonika?',
  ['$50 cm²$', '$25 cm²$', '$100 cm²$', '$125 cm²$'],
  [K('Neka su stranice $a$ i $2a$. Po Pitagorinoj teoremi: $a² + (2a)² = d²$.', ['d']),
   K('$a² + 4a² = 5a² = (5√{5})² = 25 · 5 = 125$, pa je $a² = 25$ i $a = 5 cm$.'),
   K('Stranice su $5 cm$ i $10 cm$, a $P = 5 · 10 = 50 cm²$.')],
  G({ A: [0, 0], B: [10, 0], C: [10, 5], D: [0, 5] }, [{ p: 'ABCD' }, { pu: 'ABC' }, { d: 'AB', o: '2a' }, { d: 'BC', o: 'a' }, { d: 'AC', o: '5√5 cm', na: 0.78, b: 3, id: 'd' }]));

Z(2, 'Stranica kvadrata $ABCD$ je $8 cm$. Tačka $M$ je središte stranice $AB$, a tačka $N$ središte stranice $AD$. Koliki je obim trougla $MCN$?',
  ['$8√{5} + 4√{2} cm$', '$4√{5} + 8√{2} cm$', '$8√{5} cm$', '$16 + 4√{2} cm$'],
  [K('$AM = MB = AN = ND = 4 cm$.'),
   K('Trougao $MBC$ je pravougli: $MC² = 4² + 8² = 16 + 64 = 80$, $MC = √{80} = 4√{5} cm$. Na isti način je $NC = 4√{5} cm$.', ['mbc', 'mc', 'nc']),
   K('Trougao $AMN$: $MN² = 4² + 4² = 32$, $MN = √{32} = 4√{2} cm$.', ['amn', 'mn']),
   K('$O = 4√{5} + 4√{5} + 4√{2} = 8√{5} + 4√{2} cm ≈ 23,5 cm$', ['tr'])],
  G({ A: [0, 0], B: [8, 0], C: [8, 8], D: [0, 8], M: [4, 0], N: [0, 4] },
    [{ p: 'ABCD' }, { p: 'MCN', b: 1, id: 'tr' }, { p: 'MBC', b: 3, id: 'mbc', k: 2 }, { p: 'AMN', b: 2, id: 'amn', k: 3 }, { d: 'AB', o: '8 cm' }, { d: 'MC', id: 'mc' }, { d: 'NC', id: 'nc' }, { d: 'MN', id: 'mn' }]));

Z(3, 'Stranice pravougaonika $ABCD$ su $|AB| = 20 cm$ i $|BC| = 15 cm$. Koliko je teme $B$ udaljeno od dijagonale $AC$?',
  ['$12 cm$', '$12,5 cm$', '$10 cm$', '$15 cm$'],
  [K('$AC² = 20² + 15² = 400 + 225 = 625$, pa je $AC = 25 cm$.', ['ac']),
   K('Trougao $ABC$ je pola pravougaonika: $P = {20 · 15|2} = 150 cm²$.', ['tr']),
   K('Udaljenost $h$ tačke $B$ od $AC$ je visina tog trougla na $AC$: $150 = {25 · h|2}$, pa je $h = {300|25} = 12 cm$.', ['h'])],
  G({ A: [0, 0], B: [20, 0], C: [20, 15], D: [0, 15], E: [12.8, 9.6] },
    [{ p: 'ABCD' }, { p: 'ABC', b: 1, id: 'tr', k: 2 }, { d: 'AB', o: '20 cm' }, { d: 'BC', o: '15 cm' }, { d: 'AC', id: 'ac', b: 3 }, { d: 'BE', o: 'h', isp: 1, id: 'h' }, { pu: 'BEC' }]));

Z(2, 'Središta stranica kvadrata $ABCD$ su temena manjeg kvadrata, čija je površina $18 cm²$. Koliki je obim kvadrata $ABCD$?',
  ['$24 cm$', '$12√{2} cm$', '$36 cm$', '$18 cm$'],
  [K('Stranica $s$ manjeg kvadrata je hipotenuza ugaonog trougla sa katetama ${a|2}$ i ${a|2}$: $s² = ({a|2})² + ({a|2})² = {a²|2}$.', ['ug', 's']),
   K('Dakle, manji kvadrat ima tačno pola površine većeg (četiri ugaona trougla, presavijena ka centru, prekrila bi ga).', ['mali']),
   K('$a² = 2 · 18 = 36$, pa je $a = 6 cm$ i $O = 4 · 6 = 24 cm$.')],
  G({ A: [0, 0], B: [6, 0], C: [6, 6], D: [0, 6], K: [3, 0], L: [6, 3], M: [3, 6], N: [0, 3] },
    [{ p: 'ABCD' }, { p: 'KLMN', b: 1, id: 'mali', o: '18 cm²' }, { p: 'AKN', b: 3, id: 'ug', k: 1 }, { d: 'NK', id: 's' }]));

Z(3, 'Duž koja spaja središte jedne stranice kvadrata sa temenom naspramne stranice duga je $10 cm$. Kolika je površina kvadrata?',
  ['$80 cm²$', '$100 cm²$', '$64 cm²$', '$50 cm²$'],
  [K('Neka je stranica kvadrata $a$. Duž $MC$ je hipotenuza pravouglog trougla $MBC$ sa katetama ${a|2}$ i $a$.', ['mbc', 'mc']),
   K('$({a|2})² + a² = 10²$, tj. ${a²|4} + a² = {5a²|4} = 100$.'),
   K('$a² = 80$ – a to je baš površina kvadrata: $P = 80 cm²$. (Stranica je $a = √{80} = 4√{5} cm$.)')],
  G({ A: [0, 0], B: [8.944, 0], C: [8.944, 8.944], D: [0, 8.944], M: [4.472, 0] },
    [{ p: 'ABCD' }, { p: 'MBC', b: 1, id: 'mbc', k: 1 }, { pu: 'MBC' }, { d: 'MC', o: '10 cm', b: 3, id: 'mc' }, { tacka: 'M' }]));

Z(3, 'Dijagonale pravougaonika duge su $12 cm$ i seku se pod uglom od $60°$. Kolika je površina pravougaonika?',
  ['$36√{3} cm²$', '$72 cm²$', '$18√{3} cm²$', '$72√{3} cm²$'],
  [K('Dijagonale pravougaonika su jednake i polove se: $SB = SC = 6 cm$.', ['sb', 'sc']),
   K('Trougao $SBC$ je jednakokraki sa uglom od $60°$ između krakova, pa je jednakostranični: $BC = 6 cm$.', ['bsc']),
   K('Iz pravouglog trougla $ABC$: $AB² = AC² − BC² = 12² − 6² = 108$, $AB = √{108} = 6√{3} cm$.', ['ab']),
   K('$P = AB · BC = 6√{3} · 6 = 36√{3} cm² ≈ 62,4 cm²$')],
  G({ A: [0, 0], B: [10.392, 0], C: [10.392, 6], D: [0, 6], S: [5.196, 3, 180] },
    [{ p: 'ABCD' }, { p: 'BCS', b: 1, id: 'bsc', k: 2 }, { d: 'AC', b: 3 }, { d: 'BD', b: 3 }, { d: 'SB', id: 'sb' }, { d: 'SC', id: 'sc' }, { u: 'BSC', o: '60°' }, { d: 'AB', id: 'ab' }]));

// ════════════════ 2.4 Jednakokraki i jednakostranični trougao ════════════════
L('Primena Pitagorine teoreme na jednakokraki i jednakostranični trougao');

Z(1, 'Osnovica jednakokrakog trougla je $16 cm$, a krak $17 cm$. Kolika je površina trougla?',
  ['$120 cm²$', '$136 cm²$', '$240 cm²$', '$60 cm²$'],
  [K('Visina na osnovicu polovi osnovicu i deli trougao na dva podudarna pravougla trougla: $AD = 8 cm$.', ['adc', 'h']),
   K('$h² = 17² − 8² = 289 − 64 = 225$, pa je $h = 15 cm$.', ['h']),
   K('$P = {a · h|2} = {16 · 15|2} = 120 cm²$', ['tr'])],
  G({ A: [-8, 0], B: [8, 0], C: [0, 15], D: [0, 0, 40] },
    [{ p: 'ABC', id: 'tr' }, { p: 'ADC', b: 1, id: 'adc', k: 1 }, { d: 'AB', o: '16 cm' }, { d: 'AC', o: '17 cm' }, { d: 'BC', o: '17 cm' }, { d: 'CD', o: 'h', isp: 1, id: 'h', b: 3 }, { pu: 'BDC' }]));

Z(1, 'Kolika je visina jednakostraničnog trougla stranice $6 cm$?',
  ['$3√{3} cm$', '$6√{3} cm$', '$3√{2} cm$', '$2√{3} cm$'],
  [K('Visina polovi stranicu – dobijamo pravougli trougao sa hipotenuzom $6 cm$ i katetom $3 cm$.', ['adc']),
   K('$h² = 6² − 3² = 36 − 9 = 27$, pa je $h = √{27} = 3√{3} cm ≈ 5,2 cm$.', ['h']),
   K('Isto se dobija za bilo koju stranicu: $h = {a√{3}|2}$.')],
  G({ A: [-3, 0], B: [3, 0], C: [0, 5.196], D: [0, 0, 40] },
    [{ p: 'ABC' }, { p: 'ADC', b: 1, id: 'adc', k: 1 }, { d: 'AB', o: '6 cm' }, { d: 'AC', o: '6 cm' }, { d: 'CD', o: 'h', isp: 1, id: 'h', b: 3 }, { pu: 'BDC' }]));

Z(1, 'Krak jednakokrakog trougla je $10 cm$, a osnovica $12 cm$. Kolika je visina na osnovicu?',
  ['$8 cm$', '$6 cm$', '$9 cm$', '$11 cm$'],
  [K('Visina polovi osnovicu: polovina osnovice je $6 cm$.', ['adc']),
   K('$h² = 10² − 6² = 100 − 36 = 64$, $h = 8 cm$.', ['h'])],
  G({ A: [-6, 0], B: [6, 0], C: [0, 8], D: [0, 0, 40] },
    [{ p: 'ABC' }, { p: 'ADC', b: 1, id: 'adc', k: 1 }, { d: 'AB', o: '12 cm' }, { d: 'AC', o: '10 cm' }, { d: 'BC', o: '10 cm' }, { d: 'CD', o: 'h', isp: 1, id: 'h', b: 3 }, { pu: 'BDC' }]));

Z(2, 'Površina jednakostraničnog trougla je $25√{3} cm²$. Koliki je njegov obim?',
  ['$30 cm$', '$15 cm$', '$60 cm$', '$10√{3} cm$'],
  [K('Visina jednakostraničnog trougla je $h = {a√{3}|2}$, pa je $P = {a · h|2} = {a²√{3}|4}$.', ['h']),
   K('${a²√{3}|4} = 25√{3}$, pa je $a² = 100$ i $a = 10 cm$.'),
   K('$O = 3a = 30 cm$')],
  G({ A: [-5, 0], B: [5, 0], C: [0, 8.66], D: [0, 0, 40] },
    [{ p: 'ABC', o: '25√3 cm²' }, { d: 'AB', o: 'a' }, { d: 'CD', o: 'h', isp: 1, id: 'h', b: 3 }, { pu: 'BDC' }], { bezImena: ['D'] }));

Z(2, 'Obim jednakokrakog trougla je $36 cm$, a osnovica $10 cm$. Kolika je njegova površina?',
  ['$60 cm²$', '$65 cm²$', '$120 cm²$', '$78 cm²$'],
  [K('Kraci su jednaki: $b = {36 − 10|2} = 13 cm$.', ['kraci']),
   K('$h² = 13² − 5² = 169 − 25 = 144$, $h = 12 cm$.', ['h']),
   K('$P = {10 · 12|2} = 60 cm²$')],
  G({ A: [-5, 0], B: [5, 0], C: [0, 12], D: [0, 0, 40] },
    [{ p: 'ABC' }, { d: 'AB', o: '10 cm' }, { d: 'AC', o: 'b', id: 'kraci' }, { d: 'BC', o: 'b' }, { d: 'CD', o: 'h', isp: 1, id: 'h', b: 3 }, { pu: 'BDC' }], { bezImena: ['D'] }));

Z(2, 'Visina jednakostraničnog trougla je $6 cm$. Kolika je njegova površina?',
  ['$12√{3} cm²$', '$36 cm²$', '$18√{3} cm²$', '$6√{3} cm²$'],
  [K('Polovina trougla je pravougli trougao sa hipotenuzom $a$ i katetama ${a|2}$ i $h = 6$: $a² = ({a|2})² + 6²$.', ['adc']),
   K('${3a²|4} = 36$, pa je $a² = 48$ i $a = √{48} = 4√{3} cm$.'),
   K('$P = {a · h|2} = {4√{3} · 6|2} = 12√{3} cm² ≈ 20,8 cm²$')],
  G({ A: [-3.464, 0], B: [3.464, 0], C: [0, 6], D: [0, 0, 40] },
    [{ p: 'ABC' }, { p: 'ADC', b: 1, id: 'adc', k: 1 }, { d: 'AC', o: 'a' }, { d: 'CD', o: '6 cm', isp: 1, b: 3 }, { pu: 'BDC' }], { bezImena: ['D'] }));

Z(2, 'U krugu poluprečnika $10 cm$ povučena je tetiva dužine $12 cm$. Koliko je tetiva udaljena od centra kruga?',
  ['$8 cm$', '$6 cm$', '$4 cm$', '$10 cm$'],
  [K('Trougao $OAB$ je jednakokraki ($OA = OB = r$), pa normala iz $O$ na tetivu polovi tetivu: $MB = 6 cm$.', ['omb']),
   K('$d² = 10² − 6² = 100 − 36 = 64$, pa je $d = 8 cm$.', ['d'])],
  G({ O: [0, 0, 90], A: [-6, -8], B: [6, -8], M: [0, -8, 40] },
    [{ kr: 'O', r: 10 }, { p: 'OAB', b: 0 }, { p: 'OMB', b: 1, id: 'omb', k: 1 }, { d: 'AB', o: '12 cm' }, { d: 'OB', o: '10 cm' }, { d: 'OM', o: 'd', isp: 1, b: 3, id: 'd' }, { pu: 'OMB' }, { tacka: 'O' }]));

Z(2, 'Data su dva kruga sa zajedničkim centrom. Tetiva većeg kruga duga $24 cm$ dodiruje manji krug, čiji je poluprečnik $5 cm$. Koliki je poluprečnik većeg kruga?',
  ['$13 cm$', '$12 cm$', '$17 cm$', '$15 cm$'],
  [K('Tetiva dodiruje manji krug u tački $M$, pa je $OM = 5 cm$ i $OM ⊥ AB$ (tangenta je normalna na poluprečnik).', ['om']),
   K('Normala iz centra polovi tetivu: $MB = 12 cm$.', ['omb']),
   K('$R² = OB² = 5² + 12² = 25 + 144 = 169$, pa je $R = 13 cm$.', ['ob'])],
  G({ O: [0, 0, 90], A: [-12, -5], B: [12, -5], M: [0, -5, 40] },
    [{ kr: 'O', r: 13 }, { kr: 'O', r: 5, b: 2 }, { p: 'OMB', b: 1, id: 'omb', k: 2 }, { d: 'AB', o: '24 cm' }, { d: 'OM', o: '5', id: 'om' }, { d: 'OB', o: 'R', isp: 1, b: 3, id: 'ob' }, { pu: 'OMB' }, { tacka: 'OM' }]));

Z(3, 'Nad stranicom $AB$ jednakostraničnog trougla $ABC$ stranice $6 cm$ konstruisan je kvadrat $ABED$, sa druge strane od temena $C$. Kolika je površina trougla $DEC$?',
  ['$18 + 9√{3} cm²$', '$36 + 9√{3} cm²$', '$18 + 18√{3} cm²$', '$9√{3} cm²$'],
  [K('Visina jednakostraničnog trougla $ABC$: $h² = 6² − 3² = 27$, $h = 3√{3} cm$.', ['h']),
   K('Visina trougla $DEC$ na stranicu $DE$ ide iz $C$ kroz središte $F$ stranice $AB$ do $DE$: $h + 6 = 6 + 3√{3} cm$.', ['hv']),
   K('$P = {DE · (6 + 3√{3})|2} = {6(6 + 3√{3})|2} = 18 + 9√{3} cm² ≈ 33,6 cm²$', ['dec'])],
  G({ A: [0, 0, 160], B: [6, 0, 20], C: [3, 5.196], D: [0, -6], E: [6, -6], F: [3, 0, -40], G: [3, -6, -90] },
    [{ p: 'ABED', b: 0 }, { p: 'ABC', b: 2 }, { p: 'DEC', b: 1, id: 'dec', prazno: 1 }, { d: 'AB', o: '6 cm' }, { d: 'CF', isp: 1, id: 'h', b: 3, o: 'h', k: 1 }, { d: 'FG', isp: 1, id: 'hv', b: 3, k: 2 }, { pu: 'DGF', k: 2 }], { bezImena: ['F', 'G'] }));

Z(3, 'Nad svakom stranicom kvadrata stranice $4 cm$ konstruisan je, sa spoljašnje strane, jednakostranični trougao. Kolika je površina dobijene zvezde?',
  ['$16 + 16√{3} cm²$', '$16 + 4√{3} cm²$', '$16 + 8√{3} cm²$', '$32√{3} cm²$'],
  [K('Zvezda se sastoji od kvadrata i četiri jednaka jednakostranična trougla stranice $4 cm$.'),
   K('Kvadrat: $P₁ = 4² = 16 cm²$.', ['kv']),
   K('Visina trougla: $h² = 4² − 2² = 12$, $h = 2√{3} cm$, pa je površina jednog trougla ${4 · 2√{3}|2} = 4√{3} cm²$.', ['t1', 'h']),
   K('Ukupno: $P = 16 + 4 · 4√{3} = 16 + 16√{3} cm² ≈ 43,7 cm²$')],
  G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], p: [2, -3.464], q: [7.464, 2], r: [2, 7.464], s: [-3.464, 2], f: [2, 0] },
    [{ p: 'ApB', b: 1, id: 't1' }, { p: 'BqC', b: 1 }, { p: 'CrD', b: 1 }, { p: 'DsA', b: 1 }, { p: 'ABCD', b: 0, id: 'kv' }, { d: 'AB', o: '4 cm' }, { d: 'fp', isp: 1, b: 3, id: 'h', k: 3 }], { bezImena: ['A', 'B', 'C', 'D'] }));

// ════════════════ 2.5 Paralelogram, romb i deltoid ════════════════
L('Primena Pitagorine teoreme na paralelogram, romb i deltoid');

Z(1, 'Dijagonale romba su $24 cm$ i $10 cm$. Koliki je obim romba?',
  ['$52 cm$', '$68 cm$', '$34 cm$', '$48 cm$'],
  [K('Dijagonale romba se polove i normalne su jedna na drugu: $SA = 12 cm$, $SB = 5 cm$.', ['asb']),
   K('$a² = 12² + 5² = 144 + 25 = 169$, $a = 13 cm$.', ['ab']),
   K('$O = 4a = 52 cm$')],
  G({ A: [-12, 0], B: [0, -5], C: [12, 0], D: [0, 5], S: [0, 0, 45] },
    [{ p: 'ABCD' }, { p: 'ASB', b: 1, id: 'asb', k: 1 }, { d: 'AC', o: '24 cm', na: 0.78, b: 3 }, { d: 'BD', o: '10 cm', na: 0.22, b: 3 }, { pu: 'BSC' }, { d: 'AB', id: 'ab' }]));

Z(1, 'Stranica romba je $17 cm$, a jedna dijagonala $16 cm$. Kolika je površina romba?',
  ['$240 cm²$', '$480 cm²$', '$120 cm²$', '$272 cm²$'],
  [K('Polovina date dijagonale je $8 cm$; ona, stranica i polovina druge dijagonale čine pravougli trougao.', ['asd']),
   K('$SA² = 17² − 8² = 289 − 64 = 225$, $SA = 15 cm$, pa je druga dijagonala $30 cm$.', ['ac']),
   K('$P = {d₁ · d₂|2} = {16 · 30|2} = 240 cm²$')],
  G({ A: [-15, 0], B: [0, -8], C: [15, 0], D: [0, 8], S: [0, 0, 45] },
    [{ p: 'ABCD' }, { p: 'ASD', b: 1, id: 'asd', k: 1 }, { d: 'BD', o: '16 cm', na: 0.22, b: 3 }, { d: 'AC', isp: 1, id: 'ac' }, { d: 'AD', o: '17 cm' }, { pu: 'CSD' }]));

Z(2, 'Dijagonale romba su $30 cm$ i $40 cm$. Kolika je visina romba?',
  ['$24 cm$', '$20 cm$', '$12 cm$', '$30 cm$'],
  [K('Stranica: $a² = 15² + 20² = 625$, $a = 25 cm$.', ['ab']),
   K('Površina preko dijagonala: $P = {30 · 40|2} = 600 cm²$.'),
   K('Romb je i paralelogram: $P = a · h$, pa je $h = {600|25} = 24 cm$.', ['h'])],
  G({ A: [-20, 0], B: [0, -15], C: [20, 0], D: [0, 15], H: [-14.4, -4.2, 200] },
    [{ p: 'ABCD' }, { d: 'AC', o: '40 cm', na: 0.78, b: 3 }, { d: 'BD', o: '30 cm', na: 0.22, b: 3 }, { d: 'AB', id: 'ab' }, { d: 'DH', o: 'h', isp: 1, b: 1, id: 'h' }, { pu: 'DHB' }], { bezImena: ['H'] }));

Z(2, 'Stranice paralelograma su $6 cm$ i $4 cm$, a oštar ugao $60°$. Kolika je površina paralelograma?',
  ['$12√{3} cm²$', '$24 cm²$', '$24√{3} cm²$', '$6√{3} cm²$'],
  [K('Visina iz $D$ odseca pravougli trougao $AED$ sa uglom od $60°$ kod $A$ – to je polovina jednakostraničnog trougla stranice $4 cm$, pa je $AE = 2 cm$.', ['aed']),
   K('$h² = 4² − 2² = 12$, $h = 2√{3} cm$.', ['h']),
   K('$P = a · h = 6 · 2√{3} = 12√{3} cm² ≈ 20,8 cm²$')],
  G({ A: [0, 0], B: [6, 0], C: [8, 3.464], D: [2, 3.464], E: [2, 0, -90] },
    [{ p: 'ABCD' }, { p: 'AED', b: 1, id: 'aed', k: 1 }, { d: 'AB', o: '6 cm', na: 0.7 }, { d: 'AD', o: '4 cm' }, { u: 'BAD', o: '60°' }, { d: 'DE', o: 'h', isp: 1, b: 3, id: 'h' }, { pu: 'DEB' }]));

Z(2, 'Stranice paralelograma su $10 cm$ i $4√{2} cm$, a oštar ugao je $45°$. Kolika je površina paralelograma?',
  ['$40 cm²$', '$40√{2} cm²$', '$20 cm²$', '$80 cm²$'],
  [K('Trougao $AED$ ima uglove $45°$ i $90°$, pa je jednakokraki: $AE = DE = h$.', ['aed']),
   K('$h² + h² = (4√{2})² = 32$, pa je $h² = 16$ i $h = 4 cm$.', ['h']),
   K('$P = a · h = 10 · 4 = 40 cm²$')],
  G({ A: [0, 0], B: [10, 0], C: [14, 4], D: [4, 4], E: [4, 0, -90] },
    [{ p: 'ABCD' }, { p: 'AED', b: 1, id: 'aed', k: 1 }, { d: 'AB', o: '10 cm', na: 0.7 }, { d: 'AD', o: '4√2 cm' }, { u: 'BAD', o: '45°' }, { d: 'DE', o: 'h', isp: 1, b: 3, id: 'h' }, { pu: 'DEB' }]));

Z(2, 'Stranica romba je $8 cm$, a oštar ugao $60°$. Kolika je duža dijagonala romba?',
  ['$8√{3} cm$', '$4√{3} cm$', '$8√{2} cm$', '$16 cm$'],
  [K('Kraća dijagonala $BD$ i stranice $AB = AD$ grade trougao sa uglom od $60°$ između jednakih stranica – jednakostranični: $BD = 8 cm$.', ['abd', 'bd']),
   K('Dijagonale se polove pod pravim uglom: $SA² = 8² − 4² = 48$, $SA = 4√{3} cm$.', ['sa']),
   K('$AC = 2 · SA = 8√{3} cm ≈ 13,9 cm$', ['ac'])],
  G({ A: [0, 0], B: [8, 0], C: [12, 6.928], D: [4, 6.928], S: [6, 3.464, 100] },
    [{ p: 'ABCD' }, { p: 'ABD', b: 1, id: 'abd', k: 1 }, { d: 'AB', o: '8 cm' }, { u: 'BAD', o: '60°' }, { d: 'BD', id: 'bd' }, { d: 'AC', isp: 1, b: 3, id: 'ac' }, { d: 'AS', id: 'sa', k: 2 }, { pu: 'ASB', k: 2 }]));

Z(2, 'U deltoidu $ABCD$ je $|AB| = |AD| = 17 cm$, $|CB| = |CD| = 10 cm$, a dijagonala $|BD| = 16 cm$. Kolika je površina deltoida?',
  ['$168 cm²$', '$336 cm²$', '$84 cm²$', '$210 cm²$'],
  [K('Dijagonala $AC$ je osa simetrije deltoida – normalna je na $BD$ i polovi je: $BS = SD = 8 cm$.', ['bd']),
   K('$AS² = 17² − 8² = 225$, $AS = 15 cm$; $CS² = 10² − 8² = 36$, $CS = 6 cm$.', ['asd', 'csd']),
   K('$AC = 15 + 6 = 21 cm$, pa je $P = {AC · BD|2} = {21 · 16|2} = 168 cm²$.', ['ac'])],
  G({ A: [0, 15], B: [-8, 0], C: [0, -6], D: [8, 0], S: [0, 0, 225] },
    [{ p: 'ABCD' }, { p: 'ASD', b: 1, id: 'asd', k: 2 }, { p: 'CSD', b: 2, id: 'csd', k: 2 }, { d: 'AB', o: '17 cm' }, { d: 'BC', o: '10 cm' }, { d: 'BD', o: '16 cm', na: 0.22, b: 3, id: 'bd' }, { d: 'AC', isp: 1, id: 'ac' }, { pu: 'DSA' }]));

Z(3, 'Jedna dijagonala romba je tri puta duža od druge, a površina romba je $54 cm²$. Koliki je obim romba?',
  ['$12√{10} cm$', '$48 cm$', '$6√{10} cm$', '$36 cm$'],
  [K('Neka su dijagonale $d$ i $3d$: $P = {d · 3d|2} = {3d²|2} = 54$, pa je $d² = 36$, $d = 6 cm$ i $3d = 18 cm$.', ['ac', 'bd']),
   K('Polovine dijagonala su $9 cm$ i $3 cm$: $a² = 9² + 3² = 81 + 9 = 90$, $a = √{90} = 3√{10} cm$.', ['asb']),
   K('$O = 4a = 12√{10} cm ≈ 37,9 cm$')],
  G({ A: [-9, 0], B: [0, -3], C: [9, 0], D: [0, 3], S: [0, 0, 45] },
    [{ p: 'ABCD' }, { p: 'ASB', b: 1, id: 'asb', k: 2 }, { d: 'AC', o: '3d', na: 0.78, b: 3, id: 'ac' }, { d: 'BD', o: 'd', na: 0.22, b: 3, id: 'bd' }, { pu: 'BSC' }]));

Z(3, 'Stranica romba je $13 cm$, a kraća dijagonala $10 cm$. Središta stranica romba su temena četvorougla $KLMN$. Koliki je obim tog četvorougla?',
  ['$34 cm$', '$26 cm$', '$17 cm$', '$52 cm$'],
  [K('Polovina duže dijagonale: $√{13² − 5²} = √{144} = 12 cm$, pa je duža dijagonala $24 cm$.', ['asd']),
   K('Duž koja spaja središta dve stranice trougla (srednja linija) je pola treće stranice: $KL = {AC|2} = 12 cm$, $LM = {BD|2} = 5 cm$.', ['kl', 'lm']),
   K('Stranice $KLMN$ su paralelne normalnim dijagonalama, pa je $KLMN$ pravougaonik: $O = 2(12 + 5) = 34 cm$.', ['klmn'])],
  G({ A: [-12, 0], B: [0, -5], C: [12, 0], D: [0, 5], S: [0, 0, 45], K: [-6, -2.5], L: [6, -2.5], M: [6, 2.5], N: [-6, 2.5] },
    [{ p: 'ABCD' }, { p: 'ASD', b: 2, id: 'asd', k: 1 }, { p: 'KLMN', b: 1, id: 'klmn' }, { d: 'AC', isp: 1 }, { d: 'BD', o: '10 cm', na: 0.2, isp: 1 }, { d: 'AB', o: '13 cm' }, { d: 'KL', id: 'kl' }, { d: 'LM', id: 'lm' }]));

Z(3, 'Stranice paralelograma $ABCD$ su $|AB| = 10 cm$ i $|AD| = 6 cm$, a ugao kod temena $A$ je $60°$. Kolika je duža dijagonala?',
  ['$14 cm$', '$16 cm$', '$2√{19} cm$', '$12 cm$'],
  [K('Visina iz $D$ odseca polovinu jednakostraničnog trougla stranice $6$: projekcija $AE = 3 cm$, visina $h = 3√{3} cm$.', ['aed']),
   K('Iz $C$ spustimo normalu na produžetak stranice $AB$: $AF = 10 + 3 = 13 cm$, $CF = 3√{3} cm$.', ['afc']),
   K('$AC² = 13² + (3√{3})² = 169 + 27 = 196$, pa je $AC = 14 cm$.', ['ac'])],
  G({ A: [0, 0], B: [10, 0], C: [13, 5.196], D: [3, 5.196], E: [3, 0, -90], F: [13, 0, -90] },
    [{ p: 'ABCD' }, { p: 'AED', b: 2, id: 'aed', k: 1 }, { p: 'AFC', b: 1, id: 'afc', k: 2, prazno: 1 }, { d: 'BF', isp: 1, k: 2 }, { d: 'CF', isp: 1, k: 2 }, { pu: 'AFC', k: 2 },
     { d: 'AB', o: '10 cm', na: 0.7 }, { d: 'AD', o: '6 cm' }, { u: 'BAD', o: '60°' }, { d: 'DE', isp: 1, k: 1 }, { d: 'AC', b: 3, id: 'ac' }]));

// ════════════════ 2.6 Trapez ════════════════
L('Primena Pitagorine teoreme na trapez');

Z(1, 'Osnovice jednakokrakog trapeza su $20 cm$ i $8 cm$, a krak $10 cm$. Kolika je površina trapeza?',
  ['$112 cm²$', '$224 cm²$', '$140 cm²$', '$120 cm²$'],
  [K('Visine iz $D$ i $C$ odsecaju sa obe strane jednake delove: $AE = {20 − 8|2} = 6 cm$.', ['ae']),
   K('Trougao $AED$: $h² = 10² − 6² = 64$, $h = 8 cm$.', ['aed', 'h']),
   K('$P = {a + b|2} · h = {20 + 8|2} · 8 = 112 cm²$')],
  G({ A: [0, 0], B: [20, 0], C: [14, 8], D: [6, 8], E: [6, 0, -90], F: [14, 0, -90] },
    [{ p: 'ABCD' }, { p: 'AED', b: 1, id: 'aed', k: 2 }, { d: 'AB', o: '20 cm', na: 0.5 }, { d: 'DC', o: '8 cm' }, { d: 'AD', o: '10 cm' }, { d: 'BC', o: '10 cm' },
     { d: 'DE', o: 'h', isp: 1, b: 3, id: 'h' }, { d: 'CF', isp: 1 }, { d: 'AE', id: 'ae', k: 1, b: 3 }, { pu: 'DEB' }]));

Z(1, 'Osnovice pravouglog trapeza su $11 cm$ i $5 cm$, a visina $8 cm$. Koliki je obim trapeza?',
  ['$34 cm$', '$32 cm$', '$36 cm$', '$30 cm$'],
  [K('Visina iz $C$ deli trapez na pravougaonik i pravougli trougao $EBC$ sa katetama $EB = 11 − 5 = 6 cm$ i $CE = 8 cm$.', ['ebc']),
   K('$c² = 6² + 8² = 100$, pa je kosi krak $c = 10 cm$.', ['c']),
   K('$O = 11 + 5 + 8 + 10 = 34 cm$')],
  G({ A: [0, 0], B: [11, 0], C: [5, 8], D: [0, 8], E: [5, 0, -90] },
    [{ p: 'ABCD' }, { p: 'EBC', b: 1, id: 'ebc', k: 1 }, { pu: 'BAD' }, { d: 'AB', o: '11 cm', na: 0.75 }, { d: 'DC', o: '5 cm' }, { d: 'AD', o: '8 cm' }, { d: 'CE', isp: 1 }, { d: 'BC', o: 'c', b: 3, id: 'c' }]));

Z(2, 'Osnovice jednakokrakog trapeza su $30 cm$ i $14 cm$, a visina $6 cm$. Koliki je obim trapeza?',
  ['$64 cm$', '$60 cm$', '$68 cm$', '$56 cm$'],
  [K('$AE = {30 − 14|2} = 8 cm$', ['ae']),
   K('Krak: $c² = 8² + 6² = 100$, $c = 10 cm$.', ['aed']),
   K('$O = 30 + 14 + 2 · 10 = 64 cm$')],
  G({ A: [0, 0], B: [30, 0], C: [22, 6], D: [8, 6], E: [8, 0, -90] },
    [{ p: 'ABCD' }, { p: 'AED', b: 1, id: 'aed', k: 2 }, { d: 'AB', o: '30 cm', na: 0.5 }, { d: 'DC', o: '14 cm' }, { d: 'DE', o: '6', isp: 1 }, { d: 'AE', b: 3, id: 'ae', k: 1 }, { pu: 'DEB' }]));

Z(2, 'Osnovice jednakokrakog trapeza su $14 cm$ i $8 cm$, a jedan njegov ugao je $135°$. Kolika je površina trapeza?',
  ['$33 cm²$', '$66 cm²$', '$22 cm²$', '$42 cm²$'],
  [K('Uglovi na kraku trapeza zajedno daju $180°$, pa je oštar ugao $180° − 135° = 45°$.', ['ug']),
   K('$AE = {14 − 8|2} = 3 cm$. Trougao $AED$ ima uglove $45°$ i $90°$, pa je jednakokraki: $h = DE = 3 cm$.', ['aed']),
   K('$P = {14 + 8|2} · 3 = 33 cm²$')],
  G({ A: [0, 0], B: [14, 0], C: [11, 3], D: [3, 3], E: [3, 0, -90] },
    [{ p: 'ABCD' }, { p: 'AED', b: 1, id: 'aed', k: 2 }, { d: 'AB', o: '14 cm', na: 0.5 }, { d: 'DC', o: '8 cm' }, { u: 'CDA', o: '135°', r: 16 }, { u: 'BAD', o: '45°', id: 'ug', k: 1 }, { d: 'DE', isp: 1 }, { pu: 'DEB' }]));

Z(2, 'Duža osnovica jednakokrakog trapeza je $12 cm$, krak $6 cm$, a ugao na dužoj osnovici $60°$. Kolika je površina trapeza?',
  ['$27√{3} cm²$', '$54√{3} cm²$', '$27 cm²$', '$18√{3} cm²$'],
  [K('Trougao $AED$ ima uglove $60°$ i $90°$ – polovina jednakostraničnog trougla stranice $6 cm$, pa je $AE = 3 cm$.', ['aed']),
   K('$h² = 6² − 3² = 27$, $h = 3√{3} cm$; kraća osnovica $b = 12 − 2 · 3 = 6 cm$.', ['h']),
   K('$P = {12 + 6|2} · 3√{3} = 27√{3} cm² ≈ 46,8 cm²$')],
  G({ A: [0, 0], B: [12, 0], C: [9, 5.196], D: [3, 5.196], E: [3, 0, -90] },
    [{ p: 'ABCD' }, { p: 'AED', b: 1, id: 'aed', k: 1 }, { d: 'AB', o: '12 cm', na: 0.7 }, { d: 'AD', o: '6 cm' }, { u: 'BAD', o: '60°' }, { d: 'DE', o: 'h', isp: 1, b: 3, id: 'h' }, { pu: 'DEB' }]));

Z(2, 'Osnovice jednakokrakog trapeza su $21 cm$ i $9 cm$, a krak $10 cm$. Kolika je dijagonala trapeza?',
  ['$17 cm$', '$15 cm$', '$19 cm$', '$13 cm$'],
  [K('$DE = h$: $AE = {21 − 9|2} = 6 cm$, $h² = 10² − 6² = 64$, $h = 8 cm$.', ['aed']),
   K('Dijagonala $AC$ je hipotenuza pravouglog trougla $AFC$: $AF = 21 − 6 = 15 cm$, $CF = 8 cm$.', ['afc']),
   K('$AC² = 15² + 8² = 225 + 64 = 289$, pa je $AC = 17 cm$.', ['ac'])],
  G({ A: [0, 0], B: [21, 0], C: [15, 8], D: [6, 8], E: [6, 0, -90], F: [15, 0, -90] },
    [{ p: 'ABCD' }, { p: 'AED', b: 2, id: 'aed', k: 1 }, { p: 'AFC', b: 1, id: 'afc', k: 2 }, { d: 'AB', o: '21 cm', na: 0.5 }, { d: 'DC', o: '9 cm' }, { d: 'AD', o: '10 cm' }, { d: 'DE', isp: 1, k: 1 }, { d: 'CF', isp: 1 }, { pu: 'CFA' }, { d: 'AC', b: 3, id: 'ac' }]));

Z(3, 'Dijagonala jednakokrakog trapeza je normalna na krak. Krak je dug $15 cm$, a dijagonala $20 cm$. Kolika je površina trapeza?',
  ['$192 cm²$', '$150 cm²$', '$300 cm²$', '$240 cm²$'],
  [K('Trougao $ABC$ je pravougli (prav ugao kod $C$): $AB² = 20² + 15² = 625$, pa je $a = 25 cm$.', ['abc']),
   K('Visina trapeza je visina tog trougla na hipotenuzu: $h = {20 · 15|25} = 12 cm$.', ['h']),
   K('Projekcija kraka: $FB² = 15² − 12² = 81$, $FB = 9 cm$, pa je $b = 25 − 2 · 9 = 7 cm$.', ['fb']),
   K('$P = {25 + 7|2} · 12 = 192 cm²$')],
  G({ A: [0, 0], B: [25, 0], C: [16, 12], D: [9, 12], F: [16, 0, -90] },
    [{ p: 'ABCD' }, { p: 'ABC', b: 1, id: 'abc', k: 1 }, { d: 'AC', o: '20 cm', na: 0.78, b: 3 }, { d: 'BC', o: '15 cm' }, { pu: 'ACB' }, { d: 'CF', o: 'h', isp: 1, id: 'h', k: 2 }, { pu: 'CFB', k: 2 }, { d: 'FB', b: 3, id: 'fb', k: 3 }]));

Z(3, 'Dijagonale jednakokrakog trapeza su međusobno normalne, a visina trapeza je $7 cm$. Kolika je površina trapeza?',
  ['$49 cm²$', '$98 cm²$', '$24,5 cm²$', '$28 cm²$'],
  [K('Zbog simetrije $SA = SB$, a ugao $ASB$ je prav – trougao $ABS$ je jednakokraki pravougli. Njegova visina $SM$ jednaka je polovini osnovice: $SM = {a|2}$.', ['abs', 'sm']),
   K('Isto važi i za trougao $CDS$: $SN = {b|2}$.', ['cds', 'sn']),
   K('$h = SM + SN = {a + b|2}$, pa je $P = {a + b|2} · h = h · h = 7² = 49 cm²$. Zanimljivo – ne moramo znati osnovice!')],
  G({ A: [-5, 0], B: [5, 0], C: [2, 7], D: [-2, 7], S: [0, 5, 0], M: [0, 0, -90], N: [0, 7, 90] },
    [{ p: 'ABCD' }, { p: 'ABS', b: 1, id: 'abs', k: 1 }, { p: 'CDS', b: 2, id: 'cds', k: 2 }, { d: 'AC' }, { d: 'BD' }, { pu: 'BSC' }, { d: 'SM', isp: 1, b: 3, id: 'sm', k: 1 }, { d: 'SN', isp: 1, b: 3, id: 'sn', k: 2 }, { tx: 'h = 7 cm', at: [6.3, 3.5] }]));

Z(3, 'Dijagonale trapeza su $20 cm$ i $13 cm$, a visina $12 cm$. Kolika je površina trapeza?',
  ['$126 cm²$', '$252 cm²$', '$130 cm²$', '$156 cm²$'],
  [K('Pomerimo dijagonalu $BD$ paralelno tako da prolazi kroz $C$: dobijamo tačku $E$ na produžetku $AB$, pri čemu je $BE = DC = b$ i $CE = BD = 13 cm$.', ['ce', 'be']),
   K('Trougao $ACE$ ima osnovicu $AE = a + b$ i istu visinu kao trapez, pa ima i istu površinu: ${a + b|2} · h$.', ['ace']),
   K('Visina $CF$: $AF² = 20² − 12² = 256$, $AF = 16 cm$; $FE² = 13² − 12² = 25$, $FE = 5 cm$.', ['cf']),
   K('$a + b = 16 + 5 = 21 cm$, pa je $P = {21 · 12|2} = 126 cm²$.')],
  G({ A: [0, 0], B: [12, 0], C: [16, 12], D: [7, 12], E: [21, 0], F: [16, 0, -90] },
    [{ p: 'ABCD' }, { p: 'ACE', b: 1, id: 'ace', k: 2, prazno: 0 }, { d: 'AC', o: '20 cm', na: 0.78, b: 3 }, { d: 'BD', o: '13 cm', na: 0.22, b: 3 }, { d: 'BE', isp: 1, id: 'be', k: 1 }, { d: 'CE', isp: 1, b: 3, id: 'ce', k: 1 }, { d: 'CF', o: '12', isp: 1, id: 'cf', k: 3 }, { pu: 'CFE', k: 3 }]));

Z(2, 'Kraća osnovica pravouglog trapeza je $5 cm$, kosi krak $8 cm$, a oštar ugao trapeza $60°$. Kolika je površina trapeza?',
  ['$28√{3} cm²$', '$56√{3} cm²$', '$28 cm²$', '$32√{3} cm²$'],
  [K('Visina iz $C$ odseca pravougli trougao $EBC$ sa uglom od $60°$ – polovinu jednakostraničnog trougla stranice $8$: $EB = 4 cm$.', ['ebc']),
   K('$h² = 8² − 4² = 48$, $h = 4√{3} cm$; duža osnovica $a = 5 + 4 = 9 cm$.', ['h']),
   K('$P = {9 + 5|2} · 4√{3} = 28√{3} cm² ≈ 48,5 cm²$')],
  G({ A: [0, 0], B: [9, 0], C: [5, 6.928], D: [0, 6.928], E: [5, 0, -90] },
    [{ p: 'ABCD' }, { p: 'EBC', b: 1, id: 'ebc', k: 1 }, { pu: 'BAD' }, { d: 'DC', o: '5 cm' }, { d: 'BC', o: '8 cm' }, { u: 'CBA', o: '60°' }, { d: 'CE', o: 'h', isp: 1, b: 3, id: 'h' }]));

// ════════════════ 2.7 Konstrukcije korena na brojevnoj pravoj ════════════════
L('Konstrukcije tačaka na brojevnoj pravoj koje odgovaraju kvadratnim korenima');

const koren = (n, a, b, x = {}) => {
  // trougao sa katetama a (po pravoj) i b (normala), luk do prave
  const c = Math.sqrt(a * a + b * b);
  const ug = (Math.atan2(b, a) * 180) / Math.PI;
  return G({ O: [0, 0, 225], A: [a, 0, -45], B: [a, b, 45], T: [r(c), 0, -90] },
    [{ osa: [-1, Math.ceil(c) + 1] }, { p: 'OAB', b: 1 }, { pu: 'OAB' }, { d: 'OA', o: String(a) }, { d: 'AB', o: String(b) }, { d: 'OB', o: `√${n}`, b: 3 },
     { l: 'O', r: c, od: 0, do: ug, b: 3 }, { tacka: 'T', b: 3 }, { tx: `√${n}`, at: [c, -0.75], b: 3 }], { bezImena: ['O', 'A', 'B', 'T'], ...x });
};

Z(1, 'Da bismo na brojevnoj pravoj konstruisali tačku $√{5}$, crtamo pravougli trougao. Kolike treba da budu njegove katete?',
  ['1 i 2', '1 i 4', '2 i 3', '1 i 5'],
  [K('Duž $√{5}$ treba da bude hipotenuza, pa je $c² = 5$.'),
   K('Tražimo dva kvadrata prirodnih brojeva čiji je zbir $5$: $1² + 2² = 1 + 4 = 5$ ✓ (a $1² + 4² = 17$, $2² + 3² = 13$, $1² + 5² = 26$).'),
   K('Na pravoj nacrtamo katetu $2$ (od $0$ do $2$), u tački $2$ normalu dužine $1$, pa hipotenuzu šestarom (centar u $0$) prenesemo na pravu: $√{5} ≈ 2,24$.', [], koren(5, 2, 1))]);

Z(1, 'Kojim katetama dobijamo hipotenuzu dužine $√{13}$?',
  ['2 i 3', '1 i 3', '3 i 4', '1 i 12'],
  [K('$c² = 13$, pa tražimo $a² + b² = 13$.'),
   K('$2² + 3² = 4 + 9 = 13$ ✓ (a $1² + 3² = 10$, $3² + 4² = 25$, $1² + 12² = 145$).'),
   K('Konstrukcija tačke $√{13} ≈ 3,61$ na brojevnoj pravoj:', [], koren(13, 3, 2))]);

Z(2, 'Kako se na brojevnoj pravoj konstruiše tačka $−√{8}$?',
  ['Katete 2 i 2, luk iz 0 ulevo', 'Katete 2 i 2, luk iz 0 udesno', 'Katete 1 i 7, luk iz 0 ulevo', 'Katete 2 i 4, luk iz 0 ulevo'],
  [K('$8 = 4 + 4 = 2² + 2²$, pa je $√{8}$ hipotenuza jednakokrakog pravouglog trougla sa katetama $2$ i $2$ (tj. dijagonala kvadrata stranice $2$).'),
   K('Broj $−√{8}$ je levo od nule, pa trougao crtamo na levoj strani, a hipotenuzu šestarom (centar u $0$) prenosimo ulevo: $−√{8} ≈ −2,83$.', [],
     G({ O: [0, 0], A: [-2, 0], B: [-2, 2], T: [-2.828, 0] },
       [{ osa: [-4, 2] }, { p: 'OAB', b: 1 }, { pu: 'OAB' }, { d: 'OA', o: '2' }, { d: 'AB', o: '2' }, { d: 'OB', o: '√8', b: 3 }, { l: 'O', r: 2.828, od: 135, do: 180, b: 3 }, { tacka: 'T', b: 3 }, { tx: '−√8', at: [-2.828, -0.75], b: 3 }], { bezImena: ['O', 'A', 'B', 'T'] })),
   K('Katete $1$ i $7$ daju $√{50}$, a $2$ i $4$ daju $√{20}$.')]);

Z(1, 'Hipotenuza pravouglog trougla je $4$, a jedna kateta $3$. Kolika je druga kateta?',
  ['$√{7}$', '$5$', '$1$', '$√{12}$'],
  [K('Kad tražimo katetu, od kvadrata hipotenuze oduzimamo kvadrat poznate katete.', ['b']),
   K('$b² = 4² − 3² = 16 − 9 = 7$, pa je $b = √{7} ≈ 2,65$.', ['b']),
   K('Tako se konstruišu i koreni brojeva koji nisu zbir dva kvadrata, npr. $7 = 4² − 3²$.')],
  G({ C: [0, 0], A: [3, 0], B: [0, 2.646] }, [{ p: 'ABC' }, { pu: 'ACB' }, { d: 'CA', o: '3' }, { d: 'AB', o: '4' }, { d: 'CB', o: '?', b: 3, id: 'b' }], { bezImena: ['A', 'B', 'C'] }));

// Teodorova spirala
{
  const t = { O: [0, 0] };
  const e = [];
  let p = [1, 0];
  t.p0 = p;
  for (let n = 1; n <= 8; n++) {
    const d = Math.hypot(p[0], p[1]);
    const q = [r(p[0] - p[1] / d), r(p[1] + p[0] / d)];
    t['p' + n] = q;
    e.push({ p: `Op${n - 1}p${n}`, b: n === 8 ? 3 : n % 2, k: n <= 3 ? 0 : 2, id: 't' + n });
    e.push({ pu: `Op${n - 1}p${n}`, k: n <= 3 ? 0 : 2 });
    e.push({ tx: `√${n + 1}`, at: [r(q[0] * 0.6), r(q[1] * 0.6)], k: n <= 3 ? (n === 1 ? 1 : 0) : 2 });
    p = q;
  }
  Z(3, 'Pravimo spiralu od pravouglih trouglova: prvi ima katete $1$ i $1$, a svaki sledeći ima za katete hipotenuzu prethodnog i duž dužine $1$. Koji po redu trougao ima hipotenuzu dužine $3$?',
    ['Osmi', 'Deveti', 'Treći', 'Šesti'],
    [K('Prvi trougao: $c² = 1² + 1² = 2$, hipotenuza $√{2}$.', ['t1']),
     K('Svaki sledeći: $c² = (prethodna)² + 1²$ – kvadrat hipotenuze raste za $1$: $√{2}, √{3}, √{4}, …$; $n$-ti trougao ima hipotenuzu $√{n + 1}$.'),
     K('$3 = √{9} = √{8 + 1}$ – to je osmi trougao. (Ovo je „Teodorova spirala“.)', ['t8'])],
    G(t, e, { bezImena: ['O'] }));
}

Z(2, 'Na brojevnoj pravoj nacrtan je kvadrat stranice $1$ između tačaka $1$ i $2$. Luk sa centrom u tački $1$ i poluprečnikom jednakim dijagonali kvadrata seče pravu u tački $T$, desno od $1$. Koja je koordinata tačke $T$?',
  ['$1 + √{2}$', '$√{2}$', '$2 + √{2}$', '$√{3}$'],
  [K('Dijagonala kvadrata stranice $1$: $d² = 1² + 1² = 2$, $d = √{2}$.', ['ac']),
   K('Luk prenosi dijagonalu na pravu počevši od tačke $1$: $T = 1 + √{2} ≈ 2,41$.', ['luk'])],
  G({ A: [1, 0], B: [2, 0], C: [2, 1], D: [1, 1], T: [2.414, 0, -60] },
    [{ osa: [-1, 4] }, { p: 'ABCD', b: 1 }, { d: 'AC', b: 3, id: 'ac' }, { l: 'A', r: 1.414, od: 0, do: 45, b: 3, id: 'luk' }, { tacka: 'T', b: 3 }], { bezImena: ['A', 'B', 'C', 'D'] }));

Z(2, 'Treba nacrtati kvadrat površine $29 cm²$. Kolike treba da budu katete pravouglog trougla čija je hipotenuza stranica tog kvadrata?',
  ['5 cm i 2 cm', '4 cm i 3 cm', '3 cm i 2 cm', '4 cm i 2 cm'],
  [K('Stranica kvadrata površine $29 cm²$ je $a = √{29} cm$ (jer je $a² = 29$).'),
   K('$29 = 25 + 4 = 5² + 2²$, pa je $√{29}$ hipotenuza trougla sa katetama $5 cm$ i $2 cm$. (Ostali parovi daju $25$, $13$ i $20$.)'),
   K('Nad hipotenuzom se konstruiše traženi kvadrat:', [],
     G({ C: [0, 0], A: [5, 0], B: [0, 2], q1: [2, 7], q2: [7, 5] },
       [{ p: 'ABq1q2', b: 1, o: '29 cm²' }, { p: 'ABC', b: 3 }, { pu: 'ACB' }, { d: 'CA', o: '5 cm' }, { d: 'CB', o: '2' }], { bezImena: ['A', 'B', 'C'] }))]);

Z(3, 'Treba konstruisati kvadrat površine $15 cm²$. Koji pravougli trougao daje njegovu stranicu?',
  ['Hipotenuza 4 cm, kateta 1 cm', 'Hipotenuza 5 cm, kateta 2 cm', 'Katete 3 cm i 2 cm', 'Katete 4 cm i 1 cm'],
  [K('Stranica treba da bude $√{15}$. Zbir dva kvadrata ($1, 4, 9$) ne može dati $15$.'),
   K('Ali razlika može: $15 = 16 − 1 = 4² − 1²$. Tada je $√{15}$ kateta trougla sa hipotenuzom $4 cm$ i katetom $1 cm$. (Ostali trouglovi daju $√{21}$, $√{13}$ i $√{17}$.)'),
   K('Konstrukcija: kateta $1 cm$, u njenom kraju normala, pa luk poluprečnika $4 cm$ iz drugog kraja – druga kateta je $√{15} ≈ 3,87 cm$.', [],
     G({ C: [0, 0], A: [1, 0], B: [0, 3.873] },
       [{ p: 'ABC', b: 1 }, { pu: 'ACB' }, { d: 'CA', o: '1' }, { d: 'AB', o: '4' }, { d: 'CB', o: '√15', b: 3 }, { l: 'A', r: 4, od: 95, do: 115, b: 3 }], { bezImena: ['A', 'B', 'C'] }))]);

Z(3, 'Nad katetama $1$ i $3$ konstruisan je pravougli trougao. Zatim je nad njegovom hipotenuzom i duži dužine $2$, kao katetama, konstruisan novi pravougli trougao. Kolika je hipotenuza novog trougla?',
  ['$√{14}$', '$√{12}$', '$6$', '$√{10} + 2$'],
  [K('Prvi trougao: $OB² = 1² + 3² = 10$, $OB = √{10}$.', ['t1']),
   K('Drugi trougao: $OC² = OB² + BC² = 10 + 2² = 14$, $OC = √{14} ≈ 3,74$.', ['t2']),
   K('Pazi: ne sabiramo dužine ($√{10} + 2$), nego kvadrate: $1² + 3² + 2² = 14$.')],
  G({ O: [0, 0], A: [3, 0], B: [3, 1, 0], C: [2.368, 2.897] },
    [{ p: 'OAB', b: 0, id: 't1' }, { p: 'OBC', b: 1, id: 't2' }, { pu: 'OAB' }, { pu: 'OBC' }, { d: 'OA', o: '3' }, { d: 'AB', o: '1' }, { d: 'BC', o: '2' }, { d: 'OC', o: '?', b: 3 }]));

Z(2, 'Koja su rešenja jednačine $4x² + 1² = 3²$?',
  ['$√{2}$ i $−√{2}$', 'samo $√{2}$', '$2$ i $−2$', '$√{8}$ i $−√{8}$'],
  [K('$4x² = 9 − 1 = 8$, pa je $x² = 2$.'),
   K('Dva broja imaju kvadrat $2$: $x = √{2}$ i $x = −√{2}$.'),
   K('Na brojevnoj pravoj ih dobijamo pomoću dijagonale kvadrata stranice $1$ – luk sa centrom u $0$ seče pravu u $√{2}$ i u $−√{2}$.', [],
     G({ O: [0, 0], A: [1, 0], B: [1, 1], D: [0, 1], P: [1.414, 0], Q: [-1.414, 0] },
       [{ osa: [-2, 2] }, { p: 'OABD', b: 1 }, { d: 'OB', b: 3 }, { l: 'O', r: 1.414, od: 0, do: 180, b: 3 }, { tacka: 'PQ', b: 3 }, { tx: '√2', at: [1.5, -0.6], b: 3 }, { tx: '−√2', at: [-1.5, -0.6], b: 3 }], { bezImena: ['O', 'A', 'B', 'D', 'P', 'Q'], velicina: 280 }))]);

// ════════════════ upis ════════════════
const kviz = {
  naziv: '7. razred · Matematika – zadaci',
  ikona: '✏️',
  boja: '#0984e3',
  opis: 'Zadaci za rešavanje na papiru, sa detaljnim rešenjem korak po korak',
  redosled: 11,
  oblast: 'matematika-zadaci',
  razred: 7,
  zadaci: true,
  uOpstem: false,
  lekcije,
  pitanja: zadaci,
};
const dir = path.join(KOREN, 'kvizovi', 'razred7-matematika-zadaci');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'kviz.json'), JSON.stringify(kviz, null, 1) + '\n');
const po = {};
for (const z of zadaci) po[z.lekcija] = (po[z.lekcija] || []).concat(z.tezina);
for (const [l, t] of Object.entries(po)) console.log(l, lekcije[l - 1].naziv, t.length, 'težine', t.join(''));
