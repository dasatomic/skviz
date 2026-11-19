// Lekcije 5–8: oduzimanje celih brojeva, izrazi sa zagradama, množenje i deljenje celih brojeva.
// Pitanja su sopstvenim rečima, po gradivu Matematike 6 (Arhiknjiga); crteži su medij „geo“
// (pomoćni crteži su zajednički sa zadacima: alati/zadaci-6/2-celi-brojevi-b.js → crtezi).
const { crtezi } = require('../zadaci-6/2-celi-brojevi-b');

module.exports = (A) => {
  const { L, Q, U, S, G, O, bez, proveri, termometar } = A;
  const { prava, nizSkokova, zgrada, stablo, vrednost, tablicaZnaka, povrsinaAbc, bilans, cinioci, masina, redovi } = crtezi(A);
  const term = (t, x = {}) => G(O, termometar(t, { od: -20, doo: 20, korak: 5, ...x }), { ...bez, velicina: 140 });
  const dvaTerm = (t1, t2, x = {}) => G(O, [...termometar(t1, { od: -20, doo: 20, korak: 5, b: 0, ...x }), ...termometar(t2, { od: -20, doo: 20, korak: 5, x: 3.2, b: 1, ...x })], { ...bez, velicina: 240 });
  const formula = (tekst) => ({ vrsta: 'formula', tekst });

  // ── provere računa ──
  proveri(3 - 8 === -5 && -4 - 6 === -10 && -2 - -9 === 7 && 0 - 7 === -7, 'oduzimanja');
  proveri(6 - -4 === 10 && -5 - -5 === 0 && -10 - 3 === -13, 'oduzimanja 2');
  proveri(8848 - -430 === 9278 && 8849 - -10994 === 19843, 'visinske razlike');
  proveri(-3 - 4 === -7 && 2 - 9 === -7, 'temperature');
  proveri(10 - (4 - 7) === 13 && -(3 - 8) === 5 && 5 - (2 + 6) === -3, 'zagrade');
  proveri(3 * -5 === -15 && -4 * -6 === 24 && -1 * 9 === -9 && 0 * -8 === 0, 'množenje');
  proveri(-2 * -2 * -2 === -8 && (-1) ** 10 === 1 && (-1) ** 7 === -1, 'stepeni −1');
  proveri(-20 / 5 === -4 && -27 / -3 === 9 && 45 / -9 === -5 && 0 / -6 === 0, 'deljenje');

  // ══════════ 5. Oduzimanje celih brojeva ══════════
  L('Oduzimanje celih brojeva');
  Q(1, 'Čemu je jednako oduzimanje broja $n$?',
    ['Sabiranju suprotnog broja $−n$', 'Sabiranju broja $n$', 'Množenju sa $n$', 'Oduzimanju broja $−n$'],
    'Zato među celim brojevima oduzimanje uvek može da se izvede – čak i kad je umanjilac veći od umanjenika.', 'suprotan',
    { mediji: redovi([['a − n = a + ( ? )']], { sirina: 9, vel: 26, velicina: 240 }), medijiOdgovora: redovi([['a − n = a + (−n)', 2], ['a − (−n) = a + n', 1]], { sirina: 9, vel: 24, velicina: 240 }) });
  Q(1, 'Koliko je $3 − 8$?',
    ['$−5$', '$5$', '$−11$', '$11$'],
    'Na brojevnoj pravoj oduzimanje pozitivnog broja je skok ulevo. Od $3$ osam koraka ulevo – prođemo nulu i stignemo do $−5$.', 'razlika',
    { mediji: prava(-7, 5, [], [[3, '3', 0]]), medijiOdgovora: prava(-7, 5, [[3, -5, { o: '−8' }]], [[3, '3', 0], [-5, '−5', 1]]) });
  Q(1, 'Koliko je $−2 − (−9)$?',
    ['$7$', '$−11$', '$11$', '$−7$'],
    'Oduzeti dug znači dobiti novac: oduzimanje broja $−9$ je isto što i dodavanje $9$.', 'minus',
    { mediji: prava(-3, 8, [], [[-2, '−2', 0]]), medijiOdgovora: prava(-3, 8, [[-2, 7, { o: '+9' }]], [[-2, '−2', 0], [7, '7', 1]]) });
  Q(1, 'Kako se zove broj od koga oduzimamo u razlici $a − b$?',
    ['Umanjenik', 'Umanjilac', 'Razlika', 'Sabirak'],
    'Umanjenik se umanjuje, a umanjilac je onaj koji umanjuje. U skupu celih brojeva umanjilac sme da bude i veći od umanjenika.', 'umanjenik',
    { mediji: redovi([['a  −  b  =  c'], ['?', 1]], { sirina: 7, vel: 28, velicina: 220 }) });
  Q(1, 'Napolju je bilo $−3 °C$, a onda je zahladnelo za još $4 °C$. Kolika je sada temperatura?',
    ['$−7 °C$', '$1 °C$', '$−1 °C$', '$7 °C$'],
    'Najniža temperatura izmerena u Srbiji je $−39,5 °C$ (Karajukića Bunari na Pešteri, 1985. godine).', 'temperatura',
    { mediji: term(-3), medijiOdgovora: dvaTerm(-3, -7) });
  Q(1, 'Koliko je $0 − 7$?',
    ['$−7$', '$7$', '$0$', '$70$'],
    'Kad se od nule oduzme broj, dobija se njemu suprotan broj: $0 − n = −n$.', 'nula',
    { mediji: prava(-8, 2, [], [[0, '0', 0]]), medijiOdgovora: prava(-8, 2, [[0, -7, { o: '−7' }]], [[-7, '−7', 1]]) });
  Q(2, 'Koliko je $−5 − (−5)$?',
    ['$0$', '$−10$', '$10$', '$−25$'],
    'Oduzimanje broja od samog sebe uvek daje nulu, bez obzira na znak: $a − a = 0$.', 'nula',
    { mediji: prava(-7, 2, [], [[-5, '−5', 0]]), medijiOdgovora: prava(-7, 2, [[-5, 0, { o: '+5' }]], [[-5, '−5', 0], [0, '0', 1]]) });
  Q(2, 'Lift je bio na $3$. spratu i spustio se za $5$ spratova. Na kom je sada spratu?',
    ['Na $−2$. (podzemnom)', 'Na $2$. spratu', 'Na $8$. spratu', 'Na $−8$. (podzemnom)'],
    'U Srbiji je prizemlje sprat $0$, a u SAD prizemlje je „prvi sprat“ – zato tamo dugmad lifta izgledaju drugačije.', 'sprat',
    { mediji: zgrada(-3, 5, { istakni: { 3: 2 } }), medijiOdgovora: zgrada(-3, 5, { istakni: { 3: 2, [-2]: 1 }, od: 3, doo: -2 }) });
  Q(3, 'Vrh Everesta je na $8849 m$, a obala Mrtvog mora oko $430 m$ ispod nivoa mora. Kolika je razlika visina?',
    ['$9279 m$', '$8419 m$', '$9249 m$', '$8379 m$'],
    'Obala Mrtvog mora je najniže kopno na Zemlji, a nivo mu se svake godine spušta za oko metar.', 'visina',
    { mediji: G(O, [{ lin: [[-4, 0], [4, 0]], b: 0, debljina: 2 }, { lin: [[-3.5, 0], [-1.5, 4.4], [0.5, 0]], zatv: 1, b: 2, gusto: 1 }, { lin: [[1, 0], [1.5, -0.6], [3.5, -0.6], [4, 0]], zatv: 1, b: 0, gusto: 1 }, { tx: '8849 m', at: [-1.5, 5] }, { tx: '−430 m', at: [2.5, -1.1] }], { ...bez, velicina: 240 }) });
  proveri(8849 - -430 === 9279, 'Everest − Mrtvo more');
  Q(2, 'Koji izraz je jednak izrazu $6 − (−4)$?',
    ['$6 + 4$', '$6 − 4$', '$−6 + 4$', '$−6 − 4$'],
    'Dva minusa jedan do drugog („oduzmi negativan“) zamenjujemo jednim plusom.', 'plus',
    { mediji: prava(-1, 11, [], [[6, '6', 0]]), medijiOdgovora: prava(-1, 11, [[6, 10, { o: '+4' }]], [[6, '6', 0], [10, '10', 1]]) });
  Q(3, 'Rastojanje između tačaka koje odgovaraju brojevima $a$ i $b$ na brojevnoj pravoj je:',
    ['$|a − b|$', '$a + b$', '$|a| + |b|$ uvek', '$a − b$ uvek'],
    'Na primer, između $−4$ i $3$ ima $|−4 − 3| = 7$ jedinica. Zbir apsolutnih vrednosti daje isto samo kad su brojevi različitih znakova.', 'rastojanje',
    { mediji: prava(-5, 4, [], [[-4, 'a', 0], [3, 'b', 1]]), medijiOdgovora: prava(-5, 4, [[-4, 3, { o: '7' }]], [[-4, '−4', 0], [3, '3', 1]]) });
  Q(2, 'Ako je umanjilac veći od umanjenika, razlika je:',
    ['Negativna', 'Pozitivna', 'Jednaka nuli', 'Ne može se izračunati'],
    'U 5. razredu se $3 − 8$ „nije moglo“. Celi brojevi su uvedeni upravo zato da bi svako oduzimanje imalo rezultat.', 'negativan',
    { mediji: redovi([['3 − 8 = ?']], { sirina: 6, vel: 30, velicina: 200 }), medijiOdgovora: prava(-6, 4, [[3, -5, { boja: 1, o: '−8' }]], [[3, '3', 0], [-5, '−5', 1]]) });
  Q(3, 'Zbir dva broja je $4$, a razlika (prvi minus drugi) je $−10$. Koji je prvi broj?',
    ['$−3$', '$3$', '$7$', '$−7$'],
    'Kad se saberu zbir i razlika, drugi broj nestane: $(a + b) + (a − b) = 2a = −6$, pa je $a = −3$, a $b = 7$.', 'razlika',
    { mediji: prava(-5, 9, [], [[0, '0', 4]]), medijiOdgovora: prava(-5, 9, [], [[-3, 'a', 1], [7, 'b', 2]]) });
  proveri(-3 + 7 === 4 && -3 - 7 === -10, 'a = −3, b = 7');
  Q(3, 'Za koliko je broj $−8$ manji od broja $5$?',
    ['Za $13$', 'Za $3$', 'Za $−3$', 'Za $−13$'],
    '„Za koliko je manji“ pitamo razlikom većeg i manjeg: $5 − (−8) = 13$. Rezultat je uvek pozitivan.', 'manji',
    { mediji: prava(-9, 6, [], [[-8, '−8', 1], [5, '5', 0]]), medijiOdgovora: prava(-9, 6, [[-8, 5, { o: '13' }]], [[-8, '−8', 1], [5, '5', 0]]) });
  U(2, 'Koja razlika NE daje $−4$?',
    ['$4 − 8 − (−8)$', '$3 − 7$', '$−6 − (−2)$', '$0 − 4$'],
    '$4 − 8 − (−8) = 4 − 8 + 8 = 4$, a ostale su $−4$.',
    'Isti rezultat može se dobiti beskonačno mnogo načina – svaki par brojeva koji se razlikuje za $4$ (manji minus veći) daje $−4$.', 'razlika',
    { mediji: prava(-7, 5, [], [[-4, '−4', 1]]) });
  proveri(4 - 8 - -8 === 4 && 3 - 7 === -4 && -6 - -2 === -4, 'uljez −4');
  S(2, 'Spoji razliku sa rezultatom.',
    [['$2 − 9$', '$−7$'], ['$−2 − 9$', '$−11$'], ['$−2 − (−9)$', '$7$'], ['$2 − (−9)$', '$11$']],
    'Četiri razlike sa istim brojevima $2$ i $9$ daju četiri različita rezultata – zato je važno pažljivo pratiti znake.', 'znak',
    { mediji: prava(-12, 12, [], [[-11, '', 1], [-7, '', 1], [7, '', 2], [11, '', 2]], { svaki: 2 }) });
  proveri(2 - 9 === -7 && -2 - 9 === -11 && -2 - -9 === 7 && 2 - -9 === 11, 'spoji razlike');

  // ══════════ 6. Izrazi sa zagradama ══════════
  L('Izrazi sa zagradama');
  Q(1, 'Kojim redom se računa izraz sa običnim, uglastim i vitičastim zagradama?',
    ['Obične ( ), pa uglaste [ ], pa vitičaste { }', 'Vitičaste, pa uglaste, pa obične', 'Uglaste, pa obične, pa vitičaste', 'Sleva nadesno, bez obzira na zagrade'],
    'Pre nego što su se zagrade ustalile, matematičari su grupu brojeva označavali crtom iznad nje (vinkulum) – trag toga je crta iznad broja pod korenom.', 'zagrada',
    { mediji: redovi([['{  [  (  )  ]  }']], { sirina: 7, vel: 34, velicina: 220 }), medijiOdgovora: redovi([['{  [  (  )  ]  }'], ['3.  2.  1.', 2]], { sirina: 7, vel: 30, velicina: 220 }) });
  Q(1, 'Šta se radi sa zagradom ispred koje stoji znak „+“?',
    ['Briše se, a znaci u njoj ostaju isti', 'Briše se, a znaci se menjaju', 'Ne sme se obrisati', 'Briše se i prvi broj u njoj'],
    'Plus ispred zagrade je kao množenje sa $+1$ – ništa se ne menja: $+(a − b) = a − b$.', 'zagrada',
    { mediji: redovi([['+ ( a − b ) = ?']], { sirina: 8, vel: 28, velicina: 220 }), medijiOdgovora: redovi([['+ ( a − b )'], ['a − b', 2]], { sirina: 8, vel: 28, velicina: 220 }) });
  Q(1, 'Šta se radi sa zagradom ispred koje stoji znak „−“?',
    ['Briše se, a svi znaci u njoj postaju suprotni', 'Briše se, a znaci ostaju isti', 'Menja se samo znak prvog broja', 'Menja se samo znak poslednjeg broja'],
    'Minus ispred zagrade je kao množenje sa $−1$ – svaki član u zagradi prelazi u suprotan.', 'minus',
    { mediji: redovi([['− ( a − b + c ) = ?']], { sirina: 9, vel: 26, velicina: 240 }), medijiOdgovora: redovi([['− ( a − b + c )'], ['− a + b − c', 1]], { sirina: 9, vel: 26, velicina: 240 }) });
  Q(1, 'Koliko je $10 − (4 − 7)$?',
    ['$13$', '$7$', '$−1$', '$1$'],
    'Česta greška je da se zagrada „zaboravi“: $10 − 4 − 7 = −1$. Zagrada menja rezultat!', 'zagrada',
    { mediji: stablo(['−', 10, ['−', 4, 7]], { vrednosti: false }), medijiOdgovora: stablo(['−', 10, ['−', 4, 7]]) });
  Q(1, 'Šta je prvo u izrazu $20 − (3 + 5)$?',
    ['Zbir u zagradi $3 + 5$', 'Razlika $20 − 3$', 'Razlika $20 − 5$', 'Svejedno je'],
    'Stablo izraza pokazuje redosled: računa se odozdo nagore, od listova ka vrhu.', 'redosled',
    { mediji: stablo(['−', 20, ['+', 3, 5]], { vrednosti: false }), medijiOdgovora: stablo(['−', 20, ['+', 3, 5]]) });
  proveri(20 - (3 + 5) === 12, '20 − (3 + 5)');
  Q(2, 'Koliko je $−(3 − 8)$?',
    ['$5$', '$−5$', '$11$', '$−11$'],
    '$3 − 8 = −5$, a suprotan broj od $−5$ je $5$. Isto se dobija brisanjem zagrade: $−3 + 8 = 5$.', 'suprotan',
    { mediji: prava(-6, 6, [], [[0, '0', 4]]), medijiOdgovora: prava(-6, 6, [[-5, 5, { o: '−(−5)' }]], [[-5, '−5', 0], [5, '5', 1]]) });
  Q(3, 'Kojim izrazom se oslobađamo zagrade u $a − (−b + c)$?',
    ['$a + b − c$', '$a − b + c$', '$a + b + c$', '$a − b − c$'],
    'Ispred zagrade je minus: $−b$ postaje $+b$, a $+c$ postaje $−c$.', 'zagrada',
    { mediji: redovi([['a − ( −b + c )']], { sirina: 8, vel: 28, velicina: 220 }), medijiOdgovora: redovi([['a − ( −b + c )'], ['a + b − c', 2]], { sirina: 8, vel: 28, velicina: 220 }) });
  Q(2, 'Koliko je $5 − (2 + 6)$?',
    ['$−3$', '$9$', '$3$', '$−13$'],
    'Može prvo zagrada ($5 − 8$), a može i brisanje zagrade ($5 − 2 − 6$) – rezultat je isti, $−3$.', 'zagrada',
    { mediji: stablo(['−', 5, ['+', 2, 6]], { vrednosti: false }), medijiOdgovora: stablo(['−', 5, ['+', 2, 6]]) });
  {
    const s = ['+', ['−', -4, 6], ['−', 9, 12]];
    proveri(vrednost(s) === -13, '(−4 − 6) + (9 − 12)');
    Q(2, 'Koliko je $(−4 − 6) + (9 − 12)$?',
      ['$−13$', '$−7$', '$13$', '$−1$'],
      'Dve zagrade se mogu računati bilo kojim redom, jer je sabiranje komutativno.', 'zbir',
      { mediji: stablo(s, { vrednosti: false }), medijiOdgovora: stablo(s) });
  }
  Q(3, 'Grupisanjem izračunaj: $38 − 45 + 62 − 55$.',
    ['$0$', '$−10$', '$10$', '$200$'],
    'Lakše je kad se grupišu brojevi koji daju „okrugle“ zbirove: $(38 + 62) − (45 + 55) = 100 − 100$.', 'grupisanje',
    { mediji: G(O, [{ tx: '38', at: [-3, 0], vel: 24, b: 2 }, { tx: '− 45', at: [-1, 0], vel: 24, b: 1 }, { tx: '+ 62', at: [1.1, 0], vel: 24, b: 2 }, { tx: '− 55', at: [3.2, 0], vel: 24, b: 1 }, { lin: [[-4.2, 1], [4.4, -1]], b: 4, debljina: 0.01 }], { ...bez, velicina: 280 }) });
  proveri(38 - 45 + 62 - 55 === 0, 'grupisanje');
  Q(3, 'Koliko je $1 − 2 + 3 − 4 + 5 − 6 + 7 − 8$?',
    ['$−4$', '$4$', '$0$', '$−8$'],
    'Parovi $(1 − 2), (3 − 4), …$ daju po $−1$, a parova ima četiri. Ovaj trik sa grupisanjem koristio je, prema priči, mali Gaus.', 'par',
    { mediji: bilans([['1', 1], ['−2', -2], ['3', 3], ['−4', -4], ['5', 5], ['−6', -6], ['7', 7], ['−8', -8]], { velicina: 320 }) });
  proveri(1 - 2 + 3 - 4 + 5 - 6 + 7 - 8 === -4, '1 − 2 + … − 8');
  {
    const s = ['−', 12, ['−', ['+', -5, 9], ['−', 2, 10]]];
    proveri(vrednost(s) === 0, '12 − [(−5 + 9) − (2 − 10)]');
    Q(3, 'Koliko je $12 − [(−5 + 9) − (2 − 10)]$?',
      ['$0$', '$24$', '$16$', '$−4$'],
      'Obične zagrade: $4$ i $−8$. Uglasta: $4 − (−8) = 12$. Na kraju $12 − 12 = 0$.', 'zagrada',
      { mediji: stablo(s, { vrednosti: false, dx: 2 }), medijiOdgovora: stablo(s, { dx: 2 }) });
  }
  Q(3, 'Gde treba staviti zagradu da bi bilo $1 − 2 + 3 − 4 + 5 = −5$?',
    ['$1 − (2 + 3 − 4 + 5)$', '$1 − 2 + (3 − 4 + 5)$', '$1 − (2 + 3) − 4 + 5$', '$(1 − 2 + 3) − 4 + 5$'],
    'Zagrada iza minusa menja znake svih brojeva u njoj: $1 − (2 + 3 − 4 + 5) = 1 − 6 = −5$. Bez zagrade je rezultat $3$.', 'zagrada',
    { mediji: redovi([['1 − 2 + 3 − 4 + 5 = −5']], { sirina: 11, vel: 24, velicina: 260 }) });
  proveri(1 - (2 + 3 - 4 + 5) === -5 && 1 - 2 + 3 - 4 + 5 === 3 && 1 - 2 + (3 - 4 + 5) === 3 && 1 - (2 + 3) - 4 + 5 === -3 && (1 - 2 + 3) - 4 + 5 === 3, 'zagrade −5');
  U(2, 'Koji izraz NIJE jednak izrazu $a − b + c$?',
    ['$a − (b + c)$', '$a − (b − c)$', '$a + (c − b)$', '$(a + c) − b$'],
    '$a − (b + c) = a − b − c$, a ostali su jednaki $a − b + c$.',
    'Komutativnost i asocijativnost sabiranja dozvoljavaju da sabirke premeštamo i grupišemo – samo uz svaki broj mora da „putuje“ i njegov znak.', 'zagrada',
    { mediji: redovi([['a − b + c']], { sirina: 7, vel: 28, velicina: 200 }) });
  proveri([[1, 2, 3], [-4, 5, 7]].every(([a, b, c]) => a - (b - c) === a - b + c && a + (c - b) === a - b + c && a - (b + c) !== a - b + c), 'uljez zagrade');
  S(2, 'Spoji izraz sa izrazom bez zagrada.',
    [['$+(a − b)$', '$a − b$'], ['$−(a − b)$', '$−a + b$'], ['$−(a + b)$', '$−a − b$'], ['$−(−a − b)$', '$a + b$']],
    'Pravilo se lako pamti: plus ispred zagrade – ništa se ne menja; minus ispred zagrade – svaki znak u zagradi se okreće.', 'zagrada',
    { mediji: redovi([['+ ( … )   →   isti znaci', 2], ['− ( … )   →   suprotni znaci', 1]], { sirina: 12, vel: 20, velicina: 260 }) });

  // ══════════ 7. Množenje celih brojeva ══════════
  L('Množenje celih brojeva');
  Q(1, 'Kakav je proizvod dva negativna broja?',
    ['Pozitivan', 'Negativan', 'Jednak nuli', 'Zavisi od brojeva'],
    'Indijski matematičar Bramagupta je još 628. godine zapisao pravila: „dug puta dug je imovina“, „dug puta imovina je dug“.', 'proizvod',
    { mediji: tablicaZnaka('·', { istakni: [1, 1], sakrij: true }), medijiOdgovora: tablicaZnaka('·', { istakni: [1, 1] }) });
  Q(1, 'Kakav je proizvod pozitivnog i negativnog broja?',
    ['Negativan', 'Pozitivan', 'Jednak nuli', 'Ponekad pozitivan'],
    'Primer: $3 · (−2)$ su tri duga po $2$ – ukupno dug od $6$, dakle $−6$.', 'proizvod',
    { mediji: tablicaZnaka('·', { istakni: [0, 1], sakrij: true }), medijiOdgovora: tablicaZnaka('·', { istakni: [0, 1] }) });
  Q(1, 'Koliko je $3 · (−5)$?',
    ['$−15$', '$15$', '$−8$', '$−2$'],
    'Množenje prirodnim brojem je ponovljeno sabiranje: $(−5) + (−5) + (−5) = −15$ – tri skoka po $5$ ulevo.', 'skok',
    { mediji: prava(-16, 1, [], [[0, '0', 4]], { svaki: 5 }), medijiOdgovora: prava(-16, 1, nizSkokova(3, -5, { boja: 1 }), [[-15, '−15', 1]], { svaki: 5 }) });
  Q(1, 'Koliko je $(−4) · (−6)$?',
    ['$24$', '$−24$', '$−10$', '$10$'],
    'Isti znaci daju plus. Zgodna rečenica za pamćenje: „Neprijatelj mog neprijatelja je moj prijatelj.“', 'znak',
    { mediji: tablicaZnaka('·', { sakrij: true }), medijiOdgovora: tablicaZnaka('·', { istakni: [1, 1] }) });
  Q(1, 'Šta se dobija kad se broj pomnoži sa $−1$?',
    ['Njemu suprotan broj', 'Isti broj', 'Nula', 'Broj $−1$'],
    'Množenje sa $−1$ je kao ogledalo na brojevnoj pravoj: tačka se „presavije“ preko nule na drugu stranu.', 'suprotan',
    { mediji: prava(-6, 6, [], [[4, 'a', 0]]), medijiOdgovora: prava(-6, 6, [[4, -4, { o: '· (−1)' }]], [[4, 'a', 0], [-4, '−a', 1]]) });
  Q(1, 'Koliko je $0 · (−8)$?',
    ['$0$', '$−8$', '$8$', '$−1$'],
    'Nula je jedini ceo broj koji nije ni pozitivan ni negativan, pa proizvod sa nulom nema znak.', 'nula',
    { mediji: cinioci([0, -8]) });
  Q(2, 'Proizvod pet negativnih brojeva (bez nule) je:',
    ['Negativan', 'Pozitivan', 'Jednak nuli', 'Može biti oba'],
    'Svaki par negativnih činilaca daje plus. Od pet minusa nastaju dva para i jedan „višak“, pa je proizvod negativan.', 'neparan',
    { mediji: cinioci([-2, -1, -3, -1, -2], { k: 99 }), medijiOdgovora: cinioci([-2, -1, -3, -1, -2], { k: 0 }) });
  Q(2, 'Kada je proizvod nekoliko celih brojeva (bez nule) pozitivan?',
    ['Kad je broj negativnih činilaca paran', 'Kad je broj negativnih činilaca neparan', 'Kad je prvi činilac pozitivan', 'Kad su svi činioci veći od $1$'],
    'Pozitivni činioci ne utiču na znak – broje se samo minusi. $(−1)^{10} = 1$, a $(−1)^{7} = −1$.', 'paran',
    { mediji: cinioci([-3, 2, -1, 5], { k: 99 }), medijiOdgovora: cinioci([-3, 2, -1, 5], { k: 0 }) });
  Q(2, 'Koliko je $(−2) · (−2) · (−2)$?',
    ['$−8$', '$8$', '$−6$', '$6$'],
    'Tri minusa – neparan broj – daju minus. Prva dva daju $4$, pa $4 · (−2) = −8$.', 'proizvod',
    { mediji: cinioci([-2, -2, -2], { k: 99 }), medijiOdgovora: cinioci([-2, -2, -2], { k: 0 }) });
  Q(2, 'Ronilac se svake sekunde spusti za $3 m$. Gde je posle $4$ sekunde, ako je krenuo sa površine?',
    ['Na $−12 m$', 'Na $12 m$', 'Na $−7 m$', 'Na $−1 m$'],
    'Najdublje mesto u okeanima je Čelendžerov ponor u Marijanskoj brazdi, oko $11 000 m$ ispod nivoa mora.', 'dubina',
    { mediji: prava(-13, 1, [], [[0, '0', 4]]), medijiOdgovora: prava(-13, 1, nizSkokova(4, -3, { boja: 1 }), [[-12, '−12', 1]]) });
  proveri(4 * -3 === -12, 'ronilac');
  Q(2, 'Koje svojstvo kaže da je $a · (b + c) = a · b + a · c$?',
    ['Distributivnost', 'Komutativnost', 'Asocijativnost', 'Neutralni element'],
    'Distributivnost je osnova računanja napamet: $−4 · 102 = −4 · 100 + (−4) · 2 = −408$.', 'raspodela',
    { mediji: povrsinaAbc(3, 4, 2), medijiOdgovora: povrsinaAbc(3, 4, 2) });
  proveri(-4 * 102 === -408, '−4 · 102');
  Q(2, 'Koliko je $(−25) · 7 · (−4)$?',
    ['$700$', '$−700$', '$175$', '$−175$'],
    'Činioci mogu da menjaju mesta i da se grupišu: $(−25) · (−4) = 100$, a $100 · 7$ je lako.', 'grupisanje',
    { mediji: cinioci([-25, 7, -4], { k: 99 }) });
  proveri(-25 * 7 * -4 === 700, '(−25)·7·(−4)');
  Q(3, 'Ako je proizvod $a · b$ negativan, a $a$ je pozitivan, šta važi za $b$?',
    ['$b$ je negativan', '$b$ je pozitivan', '$b = 0$', '$b$ može biti bilo šta'],
    'Da je $b = 0$, proizvod bi bio $0$, a da je pozitivan, proizvod bi bio pozitivan. Ostaje samo negativan.', 'znak',
    { mediji: tablicaZnaka('·', { sakrij: true }) });
  Q(3, 'Koliko je $(−1) · (−1) · (−1) · … · (−1)$ ako ima $100$ činilaca?',
    ['$1$', '$−1$', '$100$', '$−100$'],
    'Paran broj minusa daje plus. Zato $(−1)^{n}$ „treperi“: $−1, 1, −1, 1, …$', 'paran',
    { mediji: prava(-2, 2, [], [[-1, '−1', 1], [1, '1', 2]], { velicina: 220 }) });
  U(2, 'Koji proizvod NIJE jednak $−12$?',
    ['$(−3) · (−4)$', '$3 · (−4)$', '$(−2) · 6$', '$12 · (−1)$'],
    '$(−3) · (−4) = 12$, jer su oba činioca negativna. Ostali proizvodi su $−12$.',
    'Broj $−12$ može se zapisati kao proizvod dva cela broja na čak $12$ načina (računajući i redosled činilaca).', 'proizvod',
    { mediji: tablicaZnaka('·') });
  S(2, 'Spoji proizvod sa rezultatom.',
    [['$5 · (−3)$', '$−15$'], ['$(−5) · (−3)$', '$15$'], ['$(−5) · 0$', '$0$'], ['$(−5) · (−1)$', '$5$']],
    'Množenje sa $1$ ne menja broj, sa $−1$ ga menja u suprotan, a sa $0$ ga „briše“.', 'proizvod',
    { mediji: tablicaZnaka('·') });
  proveri(5 * -3 === -15 && -5 * -3 === 15 && -5 * -1 === 5, 'spoji proizvode');

  // ══════════ 8. Deljenje celih brojeva ══════════
  L('Deljenje celih brojeva');
  Q(1, 'Kakav je količnik dva broja istog znaka?',
    ['Pozitivan', 'Negativan', 'Jednak nuli', 'Jednak jedan'],
    'Pravila znaka za deljenje su ista kao za množenje, jer je deljenje obrnuto od množenja: $(−12) : (−3) = 4$ jer je $4 · (−3) = −12$.', 'kolicnik',
    { mediji: tablicaZnaka(':', { istakni: [1, 1], sakrij: true }), medijiOdgovora: tablicaZnaka(':', { istakni: [1, 1] }) });
  Q(1, 'Koliko je $(−20) : 5$?',
    ['$−4$', '$4$', '$−15$', '$−25$'],
    'Dug od $20$ podeljen na $5$ ljudi – svako duguje $4$.', 'deljenje',
    { mediji: prava(-21, 1, [], [[-20, '−20', 0]], { svaki: 5 }), medijiOdgovora: prava(-21, 1, nizSkokova(5, -4, { boja: 1 }), [[-20, '−20', 0], [-4, '−4', 1]], { svaki: 4 }) });
  Q(1, 'Koliko je $(−27) : (−3)$?',
    ['$9$', '$−9$', '$−24$', '$−30$'],
    'Proveravamo množenjem: $9 · (−3) = −27$ ✓.', 'kolicnik',
    { mediji: tablicaZnaka(':', { sakrij: true }), medijiOdgovora: tablicaZnaka(':', { istakni: [1, 1] }) });
  Q(1, 'Koliko je $45 : (−9)$?',
    ['$−5$', '$5$', '$36$', '$−36$'],
    'Različiti znaci daju negativan količnik. Provera: $(−5) · (−9) = 45$.', 'deljenje',
    { mediji: tablicaZnaka(':', { sakrij: true }), medijiOdgovora: tablicaZnaka(':', { istakni: [0, 1] }) });
  Q(1, 'Kojim brojem se NE sme deliti?',
    ['Nulom', 'Brojem $−1$', 'Negativnim brojem', 'Brojem $1$'],
    'Kalkulator na deljenje nulom javlja grešku („Error“). Nema broja koji pomnožen nulom daje, recimo, $5$.', 'nula',
    { mediji: redovi([['c : 0 = ?']], { sirina: 6, vel: 32, velicina: 200 }) });
  Q(1, 'Koliko je $0 : (−6)$?',
    ['$0$', '$−6$', 'Nije definisano', '$6$'],
    'Nula podeljena bilo kojim brojem različitim od nule je nula, jer je $0 · (−6) = 0$. Obrnuto, $(−6) : 0$ ne postoji.', 'nula',
    { mediji: redovi([['0 : (−6) = ?']], { sirina: 7, vel: 30, velicina: 200 }) });
  Q(2, 'Koliko je $c : (−1)$, za bilo koji ceo broj $c$?',
    ['$−c$', '$c$', '$1$', '$−1$'],
    'Deljenje sa $−1$ je isto što i množenje sa $−1$: broj prelazi u suprotan.', 'suprotan',
    { mediji: prava(-6, 6, [], [[-3, 'c', 0]]), medijiOdgovora: prava(-6, 6, [[-3, 3, { o: ': (−1)' }]], [[-3, 'c', 0], [3, '−c', 1]]) });
  Q(3, 'Koliko je ceo broj (različit od nule) podeljen njemu suprotnim brojem?',
    ['$−1$', '$1$', '$0$', 'Zavisi od broja'],
    'Broj i njemu suprotan imaju istu apsolutnu vrednost i različite znake, pa je količnik uvek $−1$: $7 : (−7) = −1$.', 'suprotan',
    { mediji: prava(-8, 8, [], [[-7, '−7', 1], [7, '7', 0]]) });
  Q(2, 'Temperatura je za $4$ sata pala sa $6 °C$ na $−6 °C$, svakog sata podjednako. Koliko je bila promena po satu?',
    ['$−3 °C$', '$3 °C$', '$−12 °C$', '$0 °C$'],
    'Ukupna promena je $−6 − 6 = −12$, a po satu $(−12) : 4 = −3$. Takav pad je čest zimi kad se razvedri noću.', 'temperatura',
    { mediji: dvaTerm(6, -6) });
  proveri((-6 - 6) / 4 === -3, 'promena po satu');
  Q(2, 'U izrazu $c : b = a$, kako se zove broj $b$?',
    ['Delilac', 'Deljenik', 'Količnik', 'Činilac'],
    'Deljenik se deli, delilac deli, a količnik je rezultat. Iz $c : b = a$ sledi $c = a · b$.', 'delilac',
    { mediji: redovi([['c  :  b  =  a'], ['?', 1]], { sirina: 7, vel: 28, velicina: 220 }) });
  Q(3, 'Šta je veće: $(−100) : 50$ ili $25 : (−5)$?',
    ['$(−100) : 50$', '$25 : (−5)$', 'Jednaki su', 'Ne mogu se uporediti'],
    '$(−100) : 50 = −2$, a $25 : (−5) = −5$. Na brojevnoj pravoj $−2$ je desno od $−5$, pa je veći.', 'veci',
    { mediji: prava(-7, 1, [], [[0, '0', 4]]), medijiOdgovora: prava(-7, 1, [], [[-2, '−2', 2], [-5, '−5', 1]]) });
  proveri(-100 / 50 === -2 && 25 / -5 === -5, 'poređenje količnika');
  Q(3, 'Koji broj treba upisati: $□ : (−4) = −8$?',
    ['$32$', '$−32$', '$2$', '$−2$'],
    'Deljenik se dobija množenjem količnika i delioca: $(−8) · (−4) = 32$.', 'deljenik',
    { mediji: masina('□', [': (−4)'], '−8'), medijiOdgovora: masina('32', [': (−4)'], '−8', { obrnuto: ['· (−4)'], k: 0 }) });
  proveri(32 / -4 === -8, '32 : (−4)');
  Q(3, 'Koliko je $[(−7) · (−8) · (−9)] : [(−2) · (−3) · (−4)]$?',
    ['$21$', '$−21$', '$7$', '$−7$'],
    'Brojilac i delilac su oba negativni (po tri minusa), pa je količnik pozitivan: $504 : 24 = 21$.', 'kolicnik',
    { mediji: stablo([':', ['·', ['·', -7, -8], -9], ['·', ['·', -2, -3], -4]], { vrednosti: false, dx: 1.9 }), medijiOdgovora: stablo([':', ['·', ['·', -7, -8], -9], ['·', ['·', -2, -3], -4]], { dx: 1.9 }) });
  proveri((-7 * -8 * -9) / (-2 * -3 * -4) === 21, '504 : 24');
  Q(3, 'Zdravko duguje $6000$ dinara i vraća dug u $12$ jednakih rata. Kako se zapisuje promena njegovog novca svakog meseca?',
    ['$(−6000) : 12 = −500$', '$6000 : 12 = 500$', '$(−6000) · 12$', '$6000 : (−12) = 500$'],
    'Rate, krediti i računi u banci rade sa celim brojevima: dug je negativan, a uplata pozitivna.', 'dug',
    { mediji: bilans([['dug', -6000]], { sk: 3000, velicina: 160 }) });
  proveri(-6000 / 12 === -500, 'rata');
  U(2, 'Koji količnik NIJE jednak $−3$?',
    ['$(−15) : (−5)$', '$15 : (−5)$', '$(−15) : 5$', '$3 : (−1)$'],
    '$(−15) : (−5) = 3$, jer su deljenik i delilac istog znaka. Ostali su $−3$.',
    'Svaki količnik može se proveriti množenjem – tako se najlakše uhvati greška u znaku.', 'kolicnik',
    { mediji: tablicaZnaka(':') });
  proveri(-15 / -5 === 3 && 15 / -5 === -3 && -15 / 5 === -3 && 3 / -1 === -3, 'uljez količnik');
  S(2, 'Spoji količnik sa rezultatom.',
    [['$(−36) : 9$', '$−4$'], ['$(−36) : (−9)$', '$4$'], ['$(−36) : (−36)$', '$1$'], ['$36 : (−36)$', '$−1$']],
    'Broj podeljen samim sobom je $1$, a podeljen suprotnim brojem je $−1$ (uz uslov da nije nula).', 'kolicnik',
    { mediji: tablicaZnaka(':') });
  proveri(-36 / 9 === -4 && -36 / -9 === 4 && 36 / -36 === -1, 'spoji količnike');
};
