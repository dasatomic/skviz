// Lekcije 9–13: trougao – osnovni elementi, unutrašnji i spoljašnji uglovi, odnos stranica i
// uglova, nejednakosti trougla. Pitanja su sopstvenim rečima, po gradivu Matematike 6 (Arhiknjiga);
// crteži su medij „geo“ (pomoćni crteži trougla dele se sa zadacima: alati/zadaci-6/3-trougao.js).
const { crtezi } = require('../zadaci-6/3-trougao');

module.exports = (O) => {
  const { L, Q, U, S, G, r, naKrugu, proveri } = O;
  const { izUglova, izStranica, tr, zbir180, spoljasnji360, stapici, iza } = crtezi(O);
  const postoji = ([a, b, c]) => a + b > c && a + c > b && b + c > a;
  const kombinacije = (niz, k) => (k === 0 ? [[]] : niz.flatMap((x, i) => kombinacije(niz.slice(i + 1), k - 1).map((c) => [x, ...c])));
  const OSNOVNI = izUglova(62, 50); // „običan“ raznostranični trougao
  const jk = (vrh, x = {}) => tr(izUglova((180 - vrh) / 2, (180 - vrh) / 2, 5), x);
  // spoljašnji ugao kod temena `kod`, produžena stranica iz temena `od`
  const spolj = (P, { kod = 'C', od = 'B', o, b = 5, e = [], ...x } = {}) => {
    const i = 'ABC'.indexOf(kod), j = 'ABC'.indexOf(od);
    const druga = 'ABC'[3 - i - j];
    return tr(P, { ...x, t: { ...(x.t || {}), x: iza(P[j], P[i], 0.6) }, e: [{ d: kod + 'x', b: 4, isp: 1 }, { u: 'x' + kod + druga, b, ...(o ? { o } : {}) }, ...e] });
  };

  // ══════════ 9. Osnovni elementi trougla ══════════
  L('Osnovni elementi trougla');
  Q(1, 'Koliko temena ima svaki trougao?',
    ['3', '2', '4', '6'],
    'Temena se obeležavaju velikim latiničnim slovima, obično redom suprotno kretanju kazaljke na satu.', 'teme',
    { mediji: tr(OSNOVNI, { bez: ['A', 'B', 'C'], e: [{ tacka: 'ABC', b: 1 }] }) });
  Q(1, 'Kako se obično obeležava stranica trougla koja leži naspram temena A?',
    ['$a$', '$c$', '$b$', 'α'],
    'Svaka stranica dobija malo slovo temena koje joj je „preko puta“: $BC = a$, $CA = b$, $AB = c$.', 'stranica',
    { mediji: tr(OSNOVNI, { stranice: { a: { o: '?', b: 1, debljina: 5 } }, e: [{ tacka: 'A', b: 1 }] }) });
  Q(1, 'Kojim slovom se obično obeležava unutrašnji ugao kod temena B?',
    ['β', 'α', 'γ', '$b$'],
    'Za uglove se koriste grčka slova: α (alfa) kod A, β (beta) kod B i γ (gama) kod C.', 'ugao',
    { mediji: tr(OSNOVNI, { uglovi: { B: '?' } }) });
  Q(1, 'Šta je obim trougla?',
    ['Zbir dužina sve tri stranice', 'Proizvod dužina stranica', 'Zbir sva tri ugla', 'Dužina najduže stranice'],
    'Obim je dužina „ograde“ oko trougla: $O = a + b + c$. Meri se u jedinicama za dužinu (cm, m…).', 'obim',
    { mediji: tr(OSNOVNI, { stranice: { a: 'a', b: 'b', c: 'c' } }) });
  proveri(3 + 4 + 5 === 12, 'obim 3, 4, 5');
  Q(1, 'Koliki je obim trougla na slici?',
    ['12 cm', '60 cm', '9 cm', '11 cm'],
    'Trougao sa stranicama 3, 4 i 5 je pravougli – ovu trojku su koristili još stari Egipćani za pravljenje pravog ugla pomoću kanapa sa čvorovima.', 'obim',
    { mediji: tr(izStranica(4, 3, 5), { stranice: { a: '4 cm', b: '3 cm', c: '5 cm' } }) });
  Q(1, 'Šta su osnovni elementi svakog trougla?',
    ['Stranice i unutrašnji uglovi', 'Dijagonale i temena', 'Samo temena', 'Visine i težišne duži'],
    'Trougao nema dijagonala – svaka dva temena su već spojena stranicom. Zato je trougao jedini mnogougao bez dijagonala.', 'element',
    { mediji: tr(OSNOVNI, { uglovi: { A: 'α', B: 'β', C: 'γ' }, stranice: { a: 'a', b: 'b', c: 'c' } }) });
  Q(2, 'Trougao je unija trougaone linije i…',
    ['njene unutrašnje oblasti', 'njene spoljašnje oblasti', 'tri prave', 'tri ugla'],
    'Trougaona linija je samo „ivica“ (zatvorena izlomljena linija), a trougao obuhvata i sve tačke unutar nje.', 'oblast',
    { mediji: G({ A: [0, 0], B: [5, 0], C: [2, 3.2], D: [7, 0], E: [12, 0], F: [9, 3.2] }, [{ p: 'ABC', b: 0, prazno: 1 }, { p: 'DEF', b: 1, gusto: 1 }], { bezImena: ['A', 'B', 'C', 'D', 'E', 'F'], velicina: 300 }) });
  Q(1, 'Koja duž je stranica $c$ u trouglu ABC?',
    ['AB', 'BC', 'CA', 'AC'],
    'Stranica $c$ leži naspram temena C, pa spaja druga dva temena: A i B.', 'stranica',
    { mediji: tr(OSNOVNI, { e: [{ tacka: 'C', b: 1 }] }), medijiOdgovora: tr(OSNOVNI, { stranice: { c: { o: 'c', b: 3, debljina: 5 } } }) });
  Q(2, 'Koja stranica trougla KLM leži naspram temena L?',
    ['KM', 'KL', 'LM', 'Nijedna'],
    'Naspram temena leži stranica koja ga ne sadrži. Oznaka bi bila malo slovo $l$.', 'naspram',
    { mediji: tr(OSNOVNI, { imena: 'KLM', e: [{ tacka: 'L', b: 1 }] }), medijiOdgovora: tr(OSNOVNI, { imena: 'KLM', stranice: { b: { o: 'l', b: 1, debljina: 5 } } }) });
  Q(2, 'Iz temena C povučena je jedna duž do stranice AB. Koliko trouglova ima na slici?',
    ['3', '2', '4', '1'],
    'Dva mala trougla i ceo veliki trougao. Česta greška je da se zaboravi veliki trougao.', 'trougao',
    { mediji: tr(OSNOVNI, { t: { D: [2.6, 0, -90] }, e: [{ d: 'CD', b: 0 }] }) });
  const pet = 'MNPQR'.split('');
  proveri(kombinacije(pet, 3).length === 10, 'C(5,3) = 10');
  Q(2, 'Na kružnici je 5 tačaka. Koliko ima trouglova čija su temena neke tri od tih tačaka?',
    ['10', '5', '15', '60'],
    'Izbor tri od pet tačaka je isto što i izbor dve koje NE uzimamo – a dve od pet biramo na 10 načina.', 'kombinacija',
    { mediji: G({ O: [0, 0], ...Object.fromEntries(pet.map((n, i) => [n, naKrugu([0, 0], 3, 90 + 72 * i)])) }, [{ kr: 'O', r: 3, b: 4 }, { tacka: 'MNPQR', b: 1 }], { bezImena: ['O'], velicina: 220 }) });
  proveri(7 * 3 === 21, '3 · 7');
  Q(1, 'Stranica jednakostraničnog trougla je 7 cm. Koliki je njegov obim?',
    ['21 cm', '14 cm', '49 cm', '28 cm'],
    'Jednakostranični trougao ima tri jednake stranice, pa je $O = 3a$. Takav oblik ima i muzički instrument triangl.', 'obim',
    { mediji: tr(izStranica(7, 7, 7), { stranice: { c: '7 cm' } }) });
  proveri(kombinacije([1, 2, 3, 4], 2).length === 6, '6 trouglova');
  Q(3, 'Iz temena C povučene su dve duži do stranice AB. Koliko trouglova ima na slici?',
    ['6', '3', '4', '5'],
    'Svaki trougao na slici ima teme C, a osnovicu biramo kao par od 4 tačke na AB – parova je 6.', 'trougao',
    { mediji: tr(OSNOVNI, { t: { D: [1.8, 0, -90], E: [3.8, 0, -90] }, e: [{ d: 'CD', b: 0 }, { d: 'CE', b: 0 }] }) });
  proveri(6 + 8 + 10 === 24, '6, 8, 10');
  Q(3, 'Stranice trougla su tri uzastopna parna broja, a obim je 24 cm. Kolika je najduža stranica?',
    ['10 cm', '8 cm', '12 cm', '9 cm'],
    'Srednja stranica je trećina obima (24 : 3 = 8), a ostale su za 2 manja i veća: 6, 8, 10. To je opet pravougli trougao – trojka 3, 4, 5 uvećana dva puta!', 'paran',
    { mediji: tr(izStranica(8, 6, 10), { stranice: { a: 'n', b: 'n − 2', c: 'n + 2' } }) });
  proveri(3 * 3 + 3 * 3 === 18, '3 + 3 tačke');
  Q(3, 'Na dve paralelne prave je po 3 tačke. Koliko ima trouglova čija su temena neke tri od tih tačaka?',
    ['18', '9', '20', '6'],
    'Tri tačke sa iste prave ne čine trougao, pa trougao ima dva temena na jednoj, a jedno na drugoj pravoj: 3 · 3 + 3 · 3 = 18.', 'paralela',
    { mediji: G({ P: [-2.5, 2], Q: [0, 2], R: [2.5, 2], K: [-2.5, 0], L: [0, 0], M: [2.5, 0], a1: [-4, 2], a2: [4, 2], b1: [-4, 0], b2: [4, 0] },
      [{ d: 'a1a2', b: 4 }, { d: 'b1b2', b: 4 }, { tacka: 'PQRKLM', b: 1 }], { velicina: 260 }) });
  S(2, 'Spoji element trougla ABC sa njegovom oznakom.',
    [['stranica BC', '$a$'], ['stranica CA', '$b$'], ['stranica AB', '$c$'], ['ugao kod temena A', 'α'], ['ugao kod temena C', 'γ']],
    'Grčka slova α, β, γ su prva tri slova grčkog alfabeta – kao latinična $a$, $b$ i $c$.', 'oznaka',
    { mediji: tr(OSNOVNI) });
  U(2, 'Šta od navedenog NEMA trougao?',
    ['Dijagonalu', 'Stranicu', 'Unutrašnji ugao', 'Teme'],
    'Dijagonala spaja dva nesusedna temena, a u trouglu su sva temena susedna.',
    'Broj dijagonala $n$-tougla je $n(n − 3) : 2$ – za $n = 3$ to je 0.', 'dijagonala',
    { mediji: tr(OSNOVNI, { uglovi: { A: '', B: '', C: '' } }) });

  // ══════════ 10. Unutrašnji uglovi trougla ══════════
  L('Unutrašnji uglovi trougla');
  Q(1, 'Koliki je zbir unutrašnjih uglova svakog trougla?',
    ['180°', '360°', '90°', 'Zavisi od trougla'],
    'Uglovi α i β „klize“ do temena C i zajedno sa γ čine opružen ugao uz pravu p, paralelnu sa AB.', 'zbir',
    { mediji: tr(OSNOVNI, { uglovi: { A: 'α', B: 'β', C: 'γ' } }), medijiOdgovora: zbir180(OSNOVNI) });
  proveri(180 - 50 - 60 === 70, 'γ = 70');
  Q(1, 'Koliki je ugao γ na slici?',
    ['70°', '80°', '110°', '60°'],
    'γ = 180° − (50° + 60°) = 70°. Ako znamo dva ugla trougla, treći je uvek određen.', 'ugao',
    { mediji: tr(izUglova(50, 60), { uglovi: { A: '50°', B: '60°', C: 'γ' } }) });
  Q(1, 'Kako se zovu stranice pravouglog trougla koje grade pravi ugao?',
    ['Katete', 'Hipotenuze', 'Kraci', 'Osnovice'],
    'Grčka reč „kathetos“ znači visak – nit sa tegom koja visi uspravno, pod pravim uglom prema tlu.', 'kateta',
    { mediji: tr(izUglova(35, 55), { pu: 'C', stranice: { a: { o: '?', b: 2, debljina: 4 }, b: { o: '?', b: 2, debljina: 4 } } }) });
  Q(1, 'Kako se zove stranica pravouglog trougla naspram pravog ugla?',
    ['Hipotenuza', 'Kateta', 'Osnovica', 'Krak'],
    'Hipotenuza dolazi od grčke reči za „zategnuta“ – Egipćani su prave uglove pravili zatezanjem kanapa.', 'hipotenuza',
    { mediji: tr(izUglova(35, 55), { pu: 'C', stranice: { c: { o: '?', b: 1, debljina: 4 } } }) });
  proveri(90 - 35 === 55, '55');
  Q(1, 'Jedan oštar ugao pravouglog trougla je 35°. Koliki je drugi?',
    ['55°', '65°', '145°', '45°'],
    'Oštri uglovi pravouglog trougla zajedno daju 90° – zato se zovu komplementni.', 'komplement',
    { mediji: tr(izUglova(35, 55), { pu: 'C', uglovi: { A: '35°', B: '?' } }) });
  Q(2, 'Zašto trougao ne može imati dva prava ugla?',
    ['Kraci normalni na istu pravu su paralelni i ne seku se', 'Zato što bi bio prevelik', 'Može, ako je jednakokraki', 'Zato što ima samo dve stranice'],
    'Već dva prava ugla daju 180°, pa za treći ugao ne bi ostalo ništa. Na slici se vidi i zašto: dve normale na AB nikad se ne sretnu.', 'normala',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [0, 4], D: [4, 4] }, [{ d: 'AB', b: 0, debljina: 3 }, { d: 'AC', b: 1, debljina: 3 }, { d: 'BD', b: 1, debljina: 3 }, { pu: 'BAC' }, { pu: 'DBA' }, { tx: '?', at: [2, 4.2], vel: 24, b: 3 }], { bezImena: ['C', 'D'], velicina: 220 }) });
  Q(2, 'Koliko najmanje oštrih uglova ima svaki trougao?',
    ['2', '1', '3', '0'],
    'Ugao koji nije oštar ima bar 90°, a dva takva bi već dala bar 180°. Zato trougao ima najviše jedan prav ili tup ugao.', 'oštar',
    { mediji: tr(izUglova(25, 35), { uglovi: { A: '', B: '', C: '' } }) });
  Q(2, 'Dva ugla trougla su 40° i 30°. Kakav je trougao prema uglovima?',
    ['Tupougli', 'Oštrougli', 'Pravougli', 'Jednakostranični'],
    'Treći ugao je 180° − 70° = 110°, a to je tup ugao. Vrstu trougla određuje njegov najveći ugao.', 'tupougli',
    { medijiOdgovora: tr(izUglova(40, 30), { uglovi: { A: '40°', B: '30°', C: '110°' } }) });
  proveri(48 + 71 + 61 === 180 && 50 + 60 + 80 !== 180 && 45 + 45 + 80 !== 180, 'trojke uglova');
  Q(2, 'Koja tri ugla mogu biti uglovi jednog trougla?',
    ['48°, 71° i 61°', '50°, 60° i 80°', '45°, 45° i 80°', '90°, 90° i 0°'],
    '48° + 71° + 61° = 180°. Ostale trojke daju 190°, 170°, a ugao od 0° nije ugao trougla.', 'zbir',
    { mediji: zbir180(izUglova(48, 71), { oznake: ['?', '?', '?'] }) });
  Q(2, 'Koliki je svaki ugao jednakostraničnog trougla?',
    ['60°', '90°', '45°', '120°'],
    'Tri jednaka ugla dele 180°: 180° : 3 = 60°. Šest takvih trouglova oko jedne tačke popunjava pun ugao (6 · 60° = 360°) i zajedno čine pravilan šestougao – oblik ćelija pčelinjeg saća.', 'jednak',
    { mediji: tr(izUglova(60, 60, 5), { uglovi: { A: '?', B: '?', C: '?' } }) });
  proveri(180 / 6 === 30 && 3 * 30 === 90, 'x, 2x, 3x');
  Q(3, 'Uglovi trougla su $x$, $2x$ i $3x$. Kakav je to trougao?',
    ['Pravougli', 'Oštrougli', 'Tupougli', 'Jednakokraki'],
    '$6x = 180°$, $x = 30°$, pa su uglovi 30°, 60° i 90°. To je „polovina“ jednakostraničnog trougla – jedan od trouglova u kompletu za geometriju.', 'pravougli',
    { mediji: tr(izUglova(30, 60), { uglovi: { A: 'x', B: '2x', C: '3x' } }) });
  Q(3, 'U trouglu je α + β = γ. Koliki je ugao γ?',
    ['90°', '60°', '120°', '45°'],
    'Kad α + β zamenimo sa γ, dobijamo γ + γ = 180°, pa je γ = 90° – trougao je pravougli.', 'pravougli',
    { mediji: tr(izUglova(38, 52), { uglovi: { A: 'α', B: 'β', C: 'α + β' } }) });
  Q(3, 'U dokazu da je zbir uglova trougla 180° kroz teme C povlačimo pravu paralelnu sa AB. Koje svojstvo zatim koristimo?',
    ['Uglovi na transverzali paralelnih pravih su jednaki', 'Naspram veće stranice je veći ugao', 'Zbir dve stranice veći je od treće', 'Dijagonale se polove'],
    'Prave AC i BC su transverzale paralela, pa su α i β jednaki uglovima uz pravu p kod C. Ovaj dokaz zna se još iz Euklidovih „Elemenata“.', 'paralela',
    { mediji: zbir180(izUglova(55, 65)) });
  proveri(90 / 3 === 30, '1 : 2');
  Q(2, 'Oštri uglovi pravouglog trougla odnose se kao 1 : 2. Koliki je manji?',
    ['30°', '45°', '60°', '20°'],
    'Ukupno 3 dela čine 90°, pa je jedan deo 30°. Veći ugao je 60°.', 'odnos',
    { mediji: tr(izUglova(30, 60), { pu: 'C', uglovi: { A: 'x', B: '2x' } }) });
  proveri(180 * 60 - (47 * 60 + 15 + 62 * 60 + 50) === 69 * 60 + 55, '69°55′');
  Q(3, 'U trouglu je α = 47°15′ i β = 62°50′. Koliki je γ?',
    ['69°55′', '70°05′', '70°55′', '69°35′'],
    'α + β = 109°65′ = 110°05′, a 180° − 110°05′ = 69°55′. Jedan stepen ima 60 minuta – kao sat.', 'minut',
    { mediji: tr(izUglova(47.25, 62.83), { uglovi: { A: '47°15′', B: '62°50′', C: 'γ' } }) });
  S(2, 'Spoji uglove trougla sa vrstom trougla.',
    [['30°, 60°, 90°', 'pravougli'], ['50°, 60°, 70°', 'oštrougli'], ['20°, 30°, 130°', 'tupougli']],
    'Dovoljno je pogledati najveći ugao: prav – pravougli, tup – tupougli, a ako je i on oštar – oštrougli.', 'vrsta',
    { mediji: tr(izUglova(20, 30), { uglovi: { A: '20°', B: '30°', C: '130°' } }) });
  U(2, 'Koja tri ugla NE mogu biti uglovi jednog trougla?',
    ['70°, 60°, 60°', '90°, 45°, 45°', '100°, 50°, 30°', '60°, 60°, 60°'],
    '70° + 60° + 60° = 190°, a zbir uglova trougla je uvek tačno 180°.',
    'Na površini lopte to ne važi: trougao sa temenima na Severnom polu i dve tačke na ekvatoru može imati tri prava ugla!', 'zbir',
    { mediji: zbir180(izUglova(60, 60, 5), { oznake: ['?', '?', '?'] }) });

  // ══════════ 11. Spoljašnji uglovi trougla ══════════
  L('Spoljašnji uglovi trougla');
  proveri(180 - 70 === 110, '110');
  Q(1, 'Unutrašnji ugao trougla je 70°. Koliki je njegov spoljašnji ugao?',
    ['110°', '70°', '20°', '290°'],
    'Spoljašnji ugao dobijamo produžavanjem stranice: on i unutrašnji ugao su uporedni, zajedno 180°.', 'spoljašnji',
    { mediji: spolj(izUglova(70, 55), { kod: 'A', od: 'B', o: '?', uglovi: { A: '70°' } }) });
  Q(1, 'Koliki je zbir unutrašnjeg i spoljašnjeg ugla kod istog temena?',
    ['180°', '90°', '360°', 'Zavisi od trougla'],
    'To su uporedni uglovi – zajedno čine opružen ugao duž produžene stranice.', 'uporedan',
    { mediji: spolj(izUglova(65, 50), { kod: 'B', od: 'A', o: 'β₁', uglovi: { B: 'β' } }) });
  Q(1, 'Koliki je zbir tri spoljašnja ugla trougla (po jedan kod svakog temena)?',
    ['360°', '180°', '540°', '270°'],
    'Kad spoljašnje uglove pomerimo u jednu tačku, popune pun ugao. Isto važi za svaki konveksan mnogougao!', 'spoljašnji',
    { mediji: spoljasnji360(OSNOVNI, { slozi: false }), medijiOdgovora: spoljasnji360(OSNOVNI) });
  proveri(40 + 75 === 115, '115');
  Q(2, 'Koliki je spoljašnji ugao kod temena C na slici?',
    ['115°', '65°', '105°', '125°'],
    'Spoljašnji ugao jednak je zbiru dva nesusedna unutrašnja ugla: 40° + 75° = 115°. Ne treba ni računati γ!', 'zbir',
    { mediji: spolj(izUglova(40, 75), { kod: 'C', od: 'B', o: '?', uglovi: { A: '40°', B: '75°' } }) });
  proveri(130 - 50 === 80, '80');
  Q(2, 'Spoljašnji ugao kod C je 130°, a α = 50°. Koliki je β?',
    ['80°', '50°', '100°', '130°'],
    'γ₁ = α + β, pa je β = 130° − 50° = 80°.', 'ugao',
    { mediji: spolj(izUglova(50, 80), { kod: 'C', od: 'B', o: '130°', uglovi: { A: '50°', B: '?' } }) });
  Q(2, 'Kakav je spoljašnji ugao trougla u odnosu na unutrašnji ugao koji mu nije susedan?',
    ['Uvek je veći', 'Uvek je manji', 'Uvek je jednak', 'Nekad veći, nekad manji'],
    'Spoljašnji ugao je zbir dva nesusedna unutrašnja, pa je veći od svakog od njih (oba su veća od 0°).', 'veći',
    { mediji: spolj(izUglova(45, 60), { kod: 'C', od: 'B', o: 'γ₁', uglovi: { A: 'α', B: 'β' } }) });
  Q(1, 'Koliki je spoljašnji ugao jednakostraničnog trougla?',
    ['120°', '60°', '90°', '180°'],
    '180° − 60° = 120°. Tri takva ugla daju 360°, kao kod svakog trougla.', 'spoljašnji',
    { mediji: spolj(izUglova(60, 60, 5), { kod: 'B', od: 'A', o: '?' }) });
  Q(2, 'Kod jednog temena mogu se nacrtati dva spoljašnja ugla (produženjem jedne ili druge stranice). Kakvi su?',
    ['Jednaki – to su unakrsni uglovi', 'Zajedno daju 180°', 'Jedan je oštar, a drugi tup', 'Zajedno daju 90°'],
    'Oba su uporedna istom unutrašnjem uglu, pa su jednaki. Zato je svejedno koju stranicu produžimo.', 'unakrsni',
    { mediji: tr(OSNOVNI, { t: { x: iza(OSNOVNI[1], OSNOVNI[0], 0.5), y: iza(OSNOVNI[2], OSNOVNI[0], 0.5) },
      e: [{ d: 'Ax', b: 4, isp: 1 }, { d: 'Ay', b: 4, isp: 1 }, { u: 'xAC', b: 5, o: '?' }, { u: 'BAy', b: 2, o: '?' }] }) });
  proveri(100 + 140 + 120 === 360, 'spoljašnji 360');
  Q(2, 'Koja tri ugla mogu biti spoljašnji uglovi jednog trougla?',
    ['100°, 140° i 120°', '100°, 120° i 130°', '90°, 90° i 90°', '150°, 150° i 70°'],
    'Zbir spoljašnjih uglova mora biti 360°: samo 100° + 140° + 120° to daje. Unutrašnji uglovi su tada 80°, 40° i 60°.', 'spoljašnji',
    { mediji: spoljasnji360(izUglova(80, 40), { oznake: ['?', '?', '?'], slozi: false }) });
  Q(2, 'Jedan spoljašnji ugao trougla je oštar. Kakav je trougao?',
    ['Tupougli', 'Oštrougli', 'Pravougli', 'Ne može se znati'],
    'Ako je spoljašnji ugao manji od 90°, uporedni unutrašnji ugao je veći od 90° – tup.', 'tupougli',
    { medijiOdgovora: spolj(izUglova(30, 25), { kod: 'C', od: 'B', o: 'oštar', uglovi: { C: 'tup' } }) });
  Q(3, 'Koliko najviše spoljašnjih uglova trougla (po jedan kod svakog temena) može biti oštro?',
    ['1', '2', '3', '0'],
    'Oštar spoljašnji ugao znači tup unutrašnji, a trougao ima najviše jedan tup ugao.', 'oštar',
    { mediji: spoljasnji360(izUglova(25, 30), { oznake: ['?', '?', '?'], slozi: false }) });
  proveri(360 / 15 * 6 === 144 && 180 - 96 === 84, '4:5:6');
  Q(3, 'Spoljašnji uglovi trougla odnose se kao $4 : 5 : 6$. Koliki je najveći unutrašnji ugao?',
    ['84°', '144°', '96°', '72°'],
    '15 delova je 360°, jedan deo 24°: spoljašnji su 96°, 120° i 144°. Najveći unutrašnji je uz najmanji spoljašnji: 180° − 96° = 84°.', 'odnos',
    { mediji: spoljasnji360(izUglova(84, 60), { oznake: ['4x', '5x', '6x'], slozi: false }) });
  Q(3, 'Postoji li trougao čiji su spoljašnji uglovi $x$, $4x$ i $7x$?',
    ['Ne – jedan bi bio 210°', 'Da, to su 30°, 120° i 210°', 'Da, ali je tupougli', 'Da, to je pravougli trougao'],
    '$12x = 360°$, $x = 30°$, pa bi treći spoljašnji ugao bio 210°. Spoljašnji ugao trougla uvek je manji od 180°.', 'postoji',
    { mediji: spoljasnji360(OSNOVNI, { oznake: ['x', '4x', '7x'], slozi: false }) });
  proveri(90 - 50 / 2 === 65, 'φ = 65');
  Q(3, 'Simetrale spoljašnjih uglova kod A i B seku se pod uglom φ. Kako φ zavisi od ugla γ?',
    ['φ = 90° − γ : 2', 'φ = γ', 'φ = 180° − γ', 'φ = 90° + γ : 2'],
    'U trouglu koji grade AB i dve simetrale uglovi kod A i B su polovine spoljašnjih uglova; njihov zbir je (180° + γ) : 2. Tačka preseka je centar kružnice koja dodiruje stranicu AB i produžetke druge dve.', 'simetrala',
    { mediji: spolj(OSNOVNI, { kod: 'A', od: 'B', o: '', uglovi: { C: 'γ' } }) });
  S(2, 'U trouglu je α = 60° i β = 50°. Spoji ugao sa njegovom veličinom.',
    [['α₁', '120°'], ['β₁', '130°'], ['γ₁', '110°'], ['γ', '70°']],
    'Provera: 120° + 130° + 110° = 360°, a svaki spoljašnji je zbir druga dva unutrašnja (γ₁ = 60° + 50°).', 'spoljašnji',
    { mediji: spoljasnji360(izUglova(60, 50), { oznake: ['α₁', 'β₁', 'γ₁'], slozi: false }) });
  U(2, 'Koja tvrdnja o spoljašnjim uglovima trougla NIJE tačna?',
    ['Zbir spoljašnjih uglova je 180°', 'Spoljašnji ugao je uporedan unutrašnjem', 'Spoljašnji ugao je zbir dva nesusedna unutrašnja', 'Zbir spoljašnjih uglova je 360°'],
    'Zbir spoljašnjih uglova je 360°, a 180° je zbir unutrašnjih.',
    'Šetač koji obiđe granicu trougla i vrati se na start okrene se ukupno za pun krug – 360°, baš za zbir spoljašnjih uglova.', 'spoljašnji',
    { mediji: spoljasnji360(OSNOVNI) });

  // ══════════ 12. Odnos stranica i uglova u trouglu ══════════
  L('Odnos stranica i uglova u trouglu');
  {
    const P = izStranica(6, 4, 7);
    Q(1, 'Koji ugao trougla na slici je najveći?',
      ['γ – naspram stranice od 7 cm', 'α – naspram stranice od 6 cm', 'β – naspram stranice od 4 cm', 'Svi su jednaki'],
      'Naspram veće stranice leži veći ugao. Najduža je c = 7 cm, pa je najveći γ.', 'naspram',
      { mediji: tr(P, { stranice: { a: '6 cm', b: '4 cm', c: '7 cm' } }), medijiOdgovora: tr(P, { stranice: { a: '6 cm', b: '4 cm', c: { o: '7 cm', b: 3, debljina: 5 } }, uglovi: { C: 'γ' } }) });
  }
  Q(1, 'Kako se zovu dve jednake stranice jednakokrakog trougla?',
    ['Kraci', 'Osnovice', 'Katete', 'Hipotenuze'],
    'Treća stranica je osnovica, a teme naspram nje je vrh trougla.', 'krak',
    { mediji: jk(50, { stranice: { a: { o: '?', b: 1, debljina: 4 }, b: { o: '?', b: 1, debljina: 4 } } }) });
  Q(1, 'Kako se zove treća (različita) stranica jednakokrakog trougla?',
    ['Osnovica', 'Krak', 'Hipotenuza', 'Visina'],
    'Uglovi uz osnovicu zovu se uglovi na osnovici, a ugao naspram nje ugao pri vrhu.', 'osnovica',
    { mediji: jk(50, { stranice: { c: { o: '?', b: 3, debljina: 4 } } }) });
  Q(1, 'Šta važi za uglove na osnovici jednakokrakog trougla?',
    ['Jednaki su', 'Zajedno daju 90°', 'Jedan je dvostruko veći', 'Uvek su po 60°'],
    'Naspram jednakih stranica leže jednaki uglovi. Presavijanjem preko simetrale osnovice jedan ugao pada tačno na drugi.', 'jednak',
    { mediji: jk(40, { uglovi: { A: '?', B: '?' } }),
      medijiOdgovora: G({ A: [0, 0], B: [5, 0], C: [2.5, 6.87], M: [2.5, 0] }, [{ p: 'ABC', b: 0 }, { d: 'CM', b: 4, isp: 1 }, { p: 'AMC', b: 1, gusto: 1, odrazi: 'CM', ponovi: 1 }, { u: 'CAB', b: 1 }, { u: 'ABC', b: 2 }], { bezImena: ['M'], velicina: 220 }) });
  proveri((180 - 40) / 2 === 70, '70');
  Q(1, 'Ugao pri vrhu jednakokrakog trougla je 40°. Koliki je ugao na osnovici?',
    ['70°', '140°', '40°', '60°'],
    '(180° − 40°) : 2 = 70°. Što je ugao pri vrhu manji, trougao je „šiljatiji“, a uglovi na osnovici bliži 90°.', 'osnovica',
    { mediji: jk(40, { uglovi: { C: '40°', A: '?', B: '?' } }) });
  proveri(180 - 2 * 35 === 110, '110');
  Q(2, 'Ugao na osnovici jednakokrakog trougla je 35°. Koliki je ugao pri vrhu?',
    ['110°', '145°', '70°', '55°'],
    '180° − 2 · 35° = 110°. Takav jednakokraki trougao je tupougli.', 'vrh',
    { mediji: jk(110, { uglovi: { A: '35°', C: '?' } }) });
  Q(2, 'Zašto je hipotenuza najduža stranica pravouglog trougla?',
    ['Leži naspram najvećeg ugla (90°)', 'Zato što je kosa', 'Zato što je uvek dvostruko duža od katete', 'Nije uvek najduža'],
    'Pravi ugao je najveći ugao u pravouglom trouglu, a naspram najvećeg ugla leži najveća stranica.', 'hipotenuza',
    { mediji: tr(izUglova(40, 50), { pu: 'C', stranice: { c: { o: 'c', b: 1, debljina: 4 } } }) });
  proveri(180 - 75 - 45 === 60, 'γ = 60');
  Q(2, 'U trouglu je α = 75° i β = 45°. Kako su poređane stranice?',
    ['$a > c > b$', '$a > b > c$', '$c > a > b$', '$b > c > a$'],
    'γ = 60°, pa je α > γ > β. Isti redosled važi za naspramne stranice: $a > c > b$.', 'poredak',
    { medijiOdgovora: tr(izUglova(75, 45), { uglovi: { A: '75°', B: '45°', C: '60°' }, stranice: { a: 'a', b: 'b', c: 'c' } }) });
  Q(2, 'Koliki može biti ugao na osnovici jednakokrakog trougla?',
    ['85°', '90°', '95°', '120°'],
    'Dva jednaka ugla na osnovici moraju zajedno biti manja od 180°, pa je svaki manji od 90°.', 'osnovica',
    { mediji: jk(10, { uglovi: { A: '?', B: '?' } }) });
  Q(2, 'Jednakokraki trougao ima ugao od 60°. Kakav je to trougao?',
    ['Jednakostranični', 'Pravougli', 'Tupougli', 'Raznostranični'],
    'Ako je 60° pri vrhu, na osnovici su (180° − 60°) : 2 = 60°; ako je na osnovici, oba su 60° pa je i treći 60°. U oba slučaja – sve stranice jednake.', 'stranica',
    { mediji: jk(60, { uglovi: { C: '60°' } }) });
  Q(3, 'U pravouglom trouglu sa uglovima 30° i 60° kateta naspram ugla od 30° je 4 cm. Kolika je hipotenuza?',
    ['8 cm', '4 cm', '6 cm', '2 cm'],
    'Dva takva trougla, preslikana preko duže katete, čine jednakostranični trougao. Kraća kateta je polovina njegove stranice, a stranica je hipotenuza.', 'polovina',
    { mediji: G({ A: [0, 3.464], C: [0, 0], B: [2, 0] }, [{ p: 'ACB', b: 0 }, { pu: 'BCA' }, { u: 'CAB', b: 1, o: '30°' }, { d: 'CB', o: '4 cm' }], { velicina: 200 }),
      medijiOdgovora: G({ A: [0, 3.464], C: [0, 0], B: [2, 0], D: [-2, 0] }, [{ p: 'ACB', b: 0 }, { pu: 'BCA' }, { u: 'CAB', b: 1, o: '30°' }, { d: 'CB', o: '4 cm' }, { p: 'ACB', b: 2, odrazi: 'AC', ponovi: 1 }, { d: 'AB', o: '8 cm', b: 3 }], { bezImena: ['D'], velicina: 220 }) });
  Q(3, 'Ugao pri vrhu jednakokrakog trougla je 80°. Šta je duže: osnovica ili krak?',
    ['Osnovica', 'Krak', 'Jednaki su', 'Zavisi od veličine trougla'],
    'Na osnovici su uglovi od 50°. Osnovica je naspram 80°, a krak naspram 50° – naspram većeg ugla je veća stranica.', 'osnovica',
    { medijiOdgovora: jk(80, { uglovi: { C: '80°', A: '50°', B: '50°' }, stranice: { c: { o: '', b: 3, debljina: 5 } } }) });
  proveri(5 * 36 === 180 && 2 * 36 === 72, '36, 72, 72');
  Q(3, 'Ugao na osnovici jednakokrakog trougla dvaput je veći od ugla pri vrhu. Koliki je ugao pri vrhu?',
    ['36°', '72°', '45°', '30°'],
    '$x + 2x + 2x = 180°$, pa je $x = 36°$. Ovaj „zlatni trougao“ (36°, 72°, 72°) krije se u kracima petokrake zvezde.', 'zlatni',
    { mediji: jk(36, { uglovi: { C: 'x', A: '2x', B: '2x' } }) });
  Q(1, 'Dva ugla trougla su jednaka. Šta znamo o trouglu?',
    ['Jednakokraki je', 'Jednakostranični je', 'Pravougli je', 'Ništa posebno'],
    'Naspram jednakih uglova leže jednake stranice – važi i obrnuto tvrđenje.', 'krak',
    { mediji: jk(70, { uglovi: { A: '55°', B: '55°' } }) });
  S(1, 'Spoji trougao sa njegovim nazivom.',
    [['sve tri stranice jednake', 'jednakostranični'], ['tačno dve stranice jednake', 'jednakokraki'], ['sve stranice različite', 'raznostranični'], ['jedan ugao od 90°', 'pravougli']],
    'Prva tri naziva su po stranicama, a „pravougli“ po uglovima. Trougao može biti i jednakokraki i pravougli u isto vreme (uglovi 45°, 45°, 90°).', 'vrsta',
    { mediji: G({ A: [0, 0], B: [3, 0], C: [1.5, 2.6], D: [4, 0], E: [6.4, 0], F: [5.2, 3.2], H: [7.4, 0], I: [10.4, 0], J: [8.2, 1.9] },
      [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 1 }, { p: 'HIJ', b: 2 }], { bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J'], velicina: 320 }) });
  U(2, 'U trouglu je α = 50°, β = 60°, γ = 70°. Koja nejednakost NIJE tačna?',
    ['$a > b$', '$c > b$', '$b > a$', '$c > a$'],
    'α < β, pa je i $a < b$. Stranice su poređane kao uglovi: $c > b > a$.',
    'Važi i obrnuto: iz poretka stranica čita se poredak uglova, pa se uglovi mogu porediti i bez uglomera – dovoljan je lenjir.', 'poredak',
    { mediji: tr(izUglova(50, 60), { uglovi: { A: '50°', B: '60°', C: '70°' }, stranice: { a: 'a', b: 'b', c: 'c' } }) });
  Q(3, 'Na kojoj pravoj leži vrh jednakokrakog trougla?',
    ['Na simetrali osnovice', 'Na produžetku kraka', 'Na pravoj paralelnoj osnovici', 'Na simetrali kraka'],
    'Vrh je jednako udaljen od krajeva osnovice, a sve takve tačke leže na simetrali osnovice. Zato je jednakokraki trougao osnosimetričan.', 'simetrala',
    { mediji: jk(50), medijiOdgovora: G({ A: [0, 0], B: [5, 0], C: [2.5, 5.36], M: [2.5, -0.8], N: [2.5, 6.2] }, [{ p: 'ABC', b: 0 }, { d: 'MN', b: 3, isp: 1 }, { tx: 's', at: [2.9, 6] }], { bezImena: ['M', 'N'], velicina: 220 }) });

  // ══════════ 13. Nejednakosti trougla ══════════
  L('Nejednakosti trougla');
  Q(1, 'Koja nejednakost važi za stranice svakog trougla?',
    ['Zbir dve stranice veći je od treće', 'Zbir dve stranice manji je od treće', 'Svaka stranica veća je od zbira druge dve', 'Sve stranice su jednake'],
    'Kada bi zbir dve stranice bio manji od treće, kraći štapići ne bi mogli da se spoje iznad dužeg.', 'nejednakost',
    { mediji: stapici(4, 5, 7), medijiOdgovora: stapici(2, 3, 7) });
  proveri(!postoji([2, 3, 6]), '2, 3, 6');
  Q(1, 'Mogu li duži od 2 cm, 3 cm i 6 cm biti stranice trougla?',
    ['Ne, jer je 2 + 3 < 6', 'Da, uvek', 'Da, jer je 6 − 3 > 2', 'Ne, jer je 2 + 6 > 3'],
    'Dva kraća štapića zajedno imaju samo 5 cm – ne mogu da „premoste“ štapić od 6 cm.', 'nejednakost',
    { mediji: stapici(3, 2, 6, { animacija: false }), medijiOdgovora: stapici(3, 2, 6) });
  proveri(postoji([4, 5, 6]), '4, 5, 6');
  Q(1, 'Mogu li duži od 4 cm, 5 cm i 6 cm biti stranice trougla?',
    ['Da', 'Ne', 'Samo ako je pravougli', 'Samo ako je jednakokraki'],
    'Dovoljno je proveriti najdužu: 4 + 5 = 9 > 6.', 'trougao',
    { mediji: stapici(5, 4, 6, { animacija: false }), medijiOdgovora: stapici(5, 4, 6) });
  Q(2, 'Šta se dobije kad štapiće od 3, 4 i 7 cm pokušamo da sklopimo u trougao?',
    ['Duž – štapići leže na pravoj', 'Pravougli trougao', 'Jednakokraki trougao', 'Tupougli trougao'],
    '3 + 4 = 7 tačno, pa se kraći štapići spajaju tek kad potpuno legnu na duži. Nejednakost mora biti stroga (>).', 'duž',
    { mediji: stapici(4, 3, 7, { animacija: false }) });
  proveri(5 - 3 === 2 && 5 + 3 === 8, '2 < c < 8');
  Q(2, 'Dve stranice trougla su 5 cm i 3 cm. U kojim granicama je treća stranica $c$?',
    ['$2 cm < c < 8 cm$', '$3 cm < c < 5 cm$', '$0 cm < c < 8 cm$', '$2 cm < c < 5 cm$'],
    'Treća stranica je veća od razlike, a manja od zbira druge dve.', 'granica',
    { mediji: stapici(5, 3, 6, { natpisi: false }) });
  proveri(!postoji([3, 3, 8]) && postoji([8, 8, 3]), 'krak 8');
  Q(2, 'Dve stranice jednakokrakog trougla su 3 cm i 8 cm. Koliki je krak?',
    ['8 cm', '3 cm', 'Može biti oba', '5,5 cm'],
    'Kraci od 3 cm ne mogu: 3 + 3 = 6 < 8. Sa kracima od 8 cm sve je u redu: 8 + 3 > 8.', 'krak',
    { mediji: stapici(3, 3, 8, { animacija: false }), medijiOdgovora: stapici(8, 8, 3) });
  Q(1, 'Šta je dovoljno proveriti da bi se znalo da tri duži čine trougao?',
    ['Da je zbir dve kraće veći od najduže', 'Da je zbir sve tri veći od 10', 'Da je najduža manja od 10 cm', 'Da su sve tri različite'],
    'Ako dve kraće „premoste“ najdužu, ostale dve nejednakosti važe same od sebe.', 'provera',
    { mediji: stapici(5, 6, 9) });
  {
    const st = [2, 3, 4, 5];
    const n = kombinacije(st, 3).filter(postoji).length;
    proveri(n === 3, 'štapići 2,3,4,5 → 3');
    Q(2, 'Imamo štapiće od 2, 3, 4 i 5 dm. Koliko različitih trouglova možemo složiti od po tri štapića?',
      ['3', '4', '2', '1'],
      'Trojke su 2-3-4, 2-3-5, 2-4-5 i 3-4-5. Ne može samo 2-3-5, jer je 2 + 3 = 5.', 'štapić',
      { mediji: stapici(4, 2, 5) });
  }
  {
    const tr12 = [];
    for (let a = 1; a <= 12; a++) for (let b = a; b <= 12; b++) { const c = 12 - a - b; if (c >= b && postoji([a, b, c])) tr12.push([a, b, c]); }
    proveri(tr12.length === 3, 'obim 12 → 3');
    Q(3, 'Koliko ima trouglova obima 12 cm čije su stranice (u cm) prirodni brojevi?',
      ['3', '2', '4', '5'],
      'Svaka stranica mora biti manja od polovine obima (6 cm): 5-5-2, 5-4-3 i 4-4-4. Trougao 5-4-3 je pravougli!', 'obim',
      { mediji: stapici(4, 4, 4) });
  }
  Q(3, 'Zašto najduža stranica trougla mora biti manja od polovine obima?',
    ['Jer je manja od zbira druge dve', 'Jer su sve stranice jednake', 'Jer je obim uvek paran', 'To nije tačno'],
    '$c < a + b$; kad dodamo $c$ na obe strane: $2c < a + b + c = O$, pa je $c < O : 2$.', 'polovina',
    { mediji: tr(OSNOVNI, { stranice: { c: { o: 'c', b: 1, debljina: 4 }, a: 'a', b: 'b' } }) });
  Q(2, 'Kakva je razlika dve stranice trougla u odnosu na treću?',
    ['Manja je od treće stranice', 'Veća je od treće stranice', 'Jednaka je trećoj stranici', 'Jednaka je obimu'],
    'Iz $c < a + b$ sledi $c − a < b$. Zato je treća stranica „uklještena“: $a − b < c < a + b$.', 'razlika',
    { mediji: stapici(7, 4, 5) });
  Q(3, 'Zašto je put pravo od A do B kraći od puta A → C → B?',
    ['Zbog nejednakosti trougla: AC + CB > AB', 'Jer je ugao kod C prav', 'Nije kraći, isti su', 'Zbog zbira uglova trougla'],
    'Prava linija je najkraći put između dve tačke. Zato ljudi u parkovima često utabaju stazicu preko trave – „prečicu“.', 'prečica',
    { mediji: G({ A: [0, 0], B: [6, 0], C: [2.4, 2.6] }, [{ d: 'AB', b: 2, debljina: 4 }, { d: 'AC', b: 1, debljina: 3, isp: 1 }, { d: 'CB', b: 1, debljina: 3, isp: 1 }, { tacka: 'ABC', b: 3 }], { velicina: 260 }) });
  {
    const n = [];
    for (let k = 1; k < 13; k++) { const o = 13 - 2 * k; if (o > 0 && postoji([k, k, o])) n.push(k); }
    proveri(n.length === 3, 'obim 13 → 3');
    Q(3, 'Koliko ima jednakokrakih trouglova obima 13 cm čije su stranice (u cm) prirodni brojevi?',
      ['3', '4', '6', '2'],
      'Krak $k$, osnovica $13 − 2k$: osnovica mora biti pozitivna ($k ≤ 6$) i manja od $2k$ ($k ≥ 4$). Trouglovi: 4-4-5, 5-5-3, 6-6-1.', 'krak',
      { mediji: jk(70, { stranice: { a: 'k', b: 'k', c: '13 − 2k' } }) });
  }
  proveri(!postoji([2, 3, 5]) && postoji([3, 4, 5]) && postoji([5, 5, 9]) && postoji([6, 7, 12]), 'uljez trojke');
  U(2, 'Koja trojka dužina NE može biti stranice trougla?',
    ['2, 3, 5', '3, 4, 5', '5, 5, 9', '6, 7, 12'],
    '2 + 3 = 5 – štapići bi legli na pravu. Kod ostalih je zbir dve kraće veći od najduže.',
    'Trougao 6-7-12 postoji, ali je vrlo „pljosnat“ – ugao naspram stranice 12 je preko 130°.', 'trojka',
    { mediji: stapici(3, 2, 5, { animacija: false }) });
  S(2, 'Spoji tri štapića sa onim što se od njih može složiti.',
    [['3, 4, 5 cm', 'trougao'], ['3, 4, 7 cm', 'duž'], ['3, 4, 9 cm', 'ne mogu se spojiti']],
    'Odlučuje poređenje zbira dva kraća (7 cm) sa najdužim: veći – trougao, jednak – duž, manji – štapići se ne dodiruju.', 'štapić',
    { mediji: stapici(4, 3, 9) });
};
