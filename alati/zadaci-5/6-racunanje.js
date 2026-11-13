// Tema 6: Razlomci – drugi deo: računanje (lekcije 6.1–6.12)
module.exports = ({ L, Z, K, G, O, bez, r, proveri, traka, pica, skok, skokovi, sto, skrati, isti }) => {
  const pr = (x, y, w, h, x2 = {}) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((p) => p.map(r)), zatv: 1, ...x2 });
  const g = (e, vel = 240) => G(O, e, { ...bez, velicina: vel });
  const g0 = (e, vel = 280) => G({}, e, { velicina: vel });
  const osa = (a, b, n, x = {}) => ({ osa: [a, b], podela: 1 / n, svaki: n, ...x });
  const jed = (a, b) => Math.abs(a - b) < 1e-9;
  // razlomak kao par [brojilac, imenilac] – provera računa
  const R = (a, b) => [a, b];
  const zbir = (x, y) => skrati([x[0] * y[1] + y[0] * x[1], x[1] * y[1]]);
  const razl = (x, y) => skrati([x[0] * y[1] - y[0] * x[1], x[1] * y[1]]);
  const pro = (x, y) => skrati([x[0] * y[0], x[1] * y[1]]);
  const kol = (x, y) => skrati([x[0] * y[1], x[1] * y[0]]);
  const je = (x, y) => isti(x, y);
  // model površine: jedinični kvadrat (strana s), kolone a/b obojene jednom, redovi c/d drugom bojom
  const povrsina = (a, b, c, d, s = 4, kRed = 1) => {
    const e = [pr(0, 0, s, s, { b: 4, prazno: 1 })];
    for (let i = 0; i < a; i++) e.push(pr((i * s) / b, 0, s / b, s, { b: 0, gusto: 0 }));
    for (let j = 0; j < c; j++) e.push(pr(0, (j * s) / d, s, s / d, { b: 1, k: kRed, crtaj: 0 }));
    for (let i = 0; i < a; i++) for (let j = 0; j < c; j++) e.push(pr((i * s) / b, (j * s) / d, s / b, s / d, { b: 3, gusto: 1, k: kRed + 1, id: 'pr' }));
    for (let i = 1; i < b; i++) e.push({ lin: [[(i * s) / b, 0], [(i * s) / b, s]], b: 4, debljina: 1 });
    for (let j = 1; j < d; j++) e.push({ lin: [[0, (j * s) / d], [s, (j * s) / d]], b: 4, debljina: 1, k: kRed });
    return e;
  };
  // vaga u ravnoteži: levo i desno su natpisi na tasovima
  const vaga = (levo, desno) => [
    { lin: [[-0.6, -2.4], [0.6, -2.4], [0, 0]], zatv: 1, b: 4, gusto: 1 },
    { lin: [[-4, 0], [4, 0]], b: 4, debljina: 4 },
    { lin: [[-4, 0], [-4, -0.8]], b: 4, debljina: 1.5 }, { lin: [[4, 0], [4, -0.8]], b: 4, debljina: 1.5 },
    { lin: [[-5.4, -0.8], [-2.6, -0.8], [-3.1, -1.5], [-4.9, -1.5]], zatv: 1, b: 0, gusto: 1 },
    { lin: [[2.6, -0.8], [5.4, -0.8], [4.9, -1.5], [3.1, -1.5]], zatv: 1, b: 1, gusto: 1 },
    { tx: levo, at: [-4, -0.3], vel: 17 }, { tx: desno, at: [4, -0.3], vel: 17 },
  ];
  // rešenja nejednačine na brojevnoj pravoj: zrak od x (otvoren ili zatvoren kraj) ulevo ili udesno
  const zrak = (x, levo, ukljuceno, od, doo, x2 = {}) => [
    { lin: [[x, 0.25], [levo ? od : doo, 0.25]], b: 2, debljina: 5, str: 1, crtaj: 1, ...x2 },
    { tx: ukljuceno ? '●' : '○', at: [x, 0.2], b: 2, vel: 20, ...x2 },
  ];
  const tacke = (lista, x2 = {}) => lista.map((x) => ({ tx: '●', at: [x, 0], b: 1, ...x2 }));

  // ════════════════ 6.1 Sabiranje i oduzimanje razlomaka ════════════════
  L('Sabiranje i oduzimanje razlomaka');

  Z(1, 'Izračunaj: ${2|7} + {3|7}$.',
    ['${5|7}$', '${5|14}$', '${6|7}$', '${5|49}$'],
    [K('Isti imenilac – sabiramo samo brojioce (delove iste veličine).', ['b']),
     K('${2 + 3|7} = {5|7}$. (Imenioci se NE sabiraju: sedmine ostaju sedmine.)')],
    g([...traka(7, 2, { w: 7 }), ...traka(7, [2, 3, 4], { w: 7, b: 2, k: 1, id: 'b' })], 240));

  Z(1, 'Izračunaj: ${1|2} + {1|3}$.',
    ['${5|6}$', '${2|5}$', '${2|6}$', '${1|5}$'],
    [K('Polovine i trećine nisu iste veličine – svodimo na šestine: ${1|2} = {3|6}$, ${1|3} = {2|6}$.', ['s']),
     K('${3|6} + {2|6} = {5|6}$.')],
    g([...traka(2, 1, { w: 6 }), ...traka(3, 1, { y: -1.8, w: 6, b: 2 }), ...traka(6, [0, 1, 2], { y: -4, w: 6, k: 1, id: 's' }), ...traka(6, [3, 4], { y: -4, w: 6, b: 2, k: 1, id: 's' })], 220));
  proveri(je(zbir(R(1, 2), R(1, 3)), R(5, 6)), '1/2+1/3');

  Z(1, 'Izračunaj: ${7|10} − {2|5}$.',
    ['${3|10}$', '${5|5}$', '${1|2}$', '${5|10}$'],
    [K('${2|5} = {4|10}$.'),
     K('${7|10} − {4|10} = {3|10}$.')]);

  Z(2, 'Izračunaj: ${3|4} − {1|6}$.',
    ['${7|12}$', '${2|2}$', '${1|2}$', '${5|12}$'],
    [K('$NZS(4, 6) = 12$: ${3|4} = {9|12}$, ${1|6} = {2|12}$.'),
     K('${9|12} − {2|12} = {7|12}$.')]);
  proveri(je(razl(R(3, 4), R(1, 6)), R(7, 12)), '3/4-1/6');

  Z(2, 'Izračunaj: $2{1|3} + 1{3|4}$.',
    ['$4{1|12}$', '$3{4|7}$', '$3{13|12}$', '$4{1|7}$'],
    [K('Celi: $2 + 1 = 3$. Razlomci: ${1|3} + {3|4} = {4|12} + {9|12} = {13|12}$.'),
     K('${13|12} = 1{1|12}$, pa je ukupno $3 + 1{1|12} = 4{1|12}$.')]);

  Z(2, 'Izračunaj: $5 − 2{3|8}$.',
    ['$2{5|8}$', '$3{3|8}$', '$3{5|8}$', '$2{3|8}$'],
    [K('Pozajmimo jedno celo: $5 = 4{8|8}$.'),
     K('$4{8|8} − 2{3|8} = 2{5|8}$.', ['p'])],
    g([...[0, 1, 2, 3, 4].map((i) => pica(8, 8, { cx: i * 2.3, R: 1, b: i < 2 ? 0 : 0 })).flat(), ...pica(8, [0, 1, 2], { cx: 4.6, R: 1, b: 1, k: 2, id: 'p' }).filter((e) => e.k), ...[3, 4].map((i) => pica(8, 8, { cx: i * 2.3, R: 1, b: 1, k: 2, id: 'p' })).flat()], 280));
  proveri(je(razl(R(5, 1), R(19, 8)), R(21, 8)), '5-2 3/8');

  Z(2, 'Ana je pojela ${1|4}$ pice, a Bojan ${1|3}$. Koji deo pice je ostao?',
    ['${5|12}$', '${7|12}$', '${2|7}$', '${1|2}$'],
    [K('Pojeli su ${1|4} + {1|3} = {3|12} + {4|12} = {7|12}$.', ['a', 'b']),
     K('Ostalo: $1 − {7|12} = {5|12}$.')],
    g([...pica(12, [0, 1, 2], { R: 3, b: 1, k: 1, id: 'a' }), ...pica(12, [3, 4, 5, 6], { R: 3, b: 2, k: 1, id: 'b' }), ...pica(12, 0, { R: 3 })], 180));

  Z(2, 'Za koliko je ${5|6}$ veće od ${3|4}$?',
    ['za ${1|12}$', 'za ${2|2}$', 'za ${1|6}$', 'za ${2|10}$'],
    [K('Razlika: ${5|6} − {3|4} = {10|12} − {9|12}$.'),
     K('$= {1|12}$.')],
    g0([osa(0, 1, 12, { svaki: 12 }), { tx: '3/4', at: [0.75, 0.1], b: 0 }, { tx: '5/6', at: [5 / 6, -0.12], b: 1 }, skok(0.75, 5 / 6, { h: 0.05, k: 2 })]));

  Z(3, 'Bazen je prvog dana napunjen do ${2|5}$, a drugog još za ${1|3}$ zapremine. Koji deo bazena još nije napunjen?',
    ['${4|15}$', '${11|15}$', '${3|8}$', '${5|8}$'],
    [K('Napunjeno: ${2|5} + {1|3} = {6|15} + {5|15} = {11|15}$.'),
     K('Nije napunjeno: $1 − {11|15} = {4|15}$.', ['n'])],
    g([...traka(15, [0, 1, 2, 3, 4, 5], { w: 7.5 }), ...traka(15, [6, 7, 8, 9, 10], { w: 7.5, b: 2 }), ...traka(15, [11, 12, 13, 14], { w: 7.5, b: 3, k: 2, id: 'n' })], 260));

  Z(3, 'Izračunaj: ${1|2} + {1|4} + {1|8} + {1|16}$.',
    ['${15|16}$', '${4|30}$', '$1$', '${7|8}$'],
    [K('Na kvadratu: polovina, pa četvrtina, pa osmina, pa šesnaestina – svaki deo je pola preostalog.', ['k']),
     K('Neobojen ostaje samo jedan deo od ${1|16}$: zbir je $1 − {1|16} = {15|16}$.')],
    g([pr(0, 0, 4, 4, { b: 4, prazno: 1 }), pr(0, 0, 2, 4, { b: 0, gusto: 1, crtaj: 1, k: 1, id: 'k' }), pr(2, 2, 2, 2, { b: 1, gusto: 1, crtaj: 1, kasni: 0.8, k: 1, id: 'k' }), pr(2, 0, 1, 2, { b: 2, gusto: 1, crtaj: 1, kasni: 1.4, k: 1, id: 'k' }), pr(3, 1, 1, 1, { b: 5, gusto: 1, crtaj: 1, kasni: 2, k: 1, id: 'k' }), pr(3, 0, 1, 1, { b: 4, prazno: 1 })], 160));

  // ════════════════ 6.2 Sabiranje i oduzimanje decimalnih brojeva ════════════════
  L('Sabiranje i oduzimanje decimalnih brojeva');

  Z(1, 'Izračunaj: $3,75 + 2,6$.',
    ['$6,35$', '$4,01$', '$6,81$', '$5,35$'],
    [K('Potpišemo zarez ispod zareza: $3,75 + 2,60$.'),
     K('$75 + 60 = 135$ stotih – pišemo $35$, prenosimo $1$: $3 + 2 + 1 = 6$. Rezultat $6,35$. (Greška $4,01$: sabrano $75 + 26$ bez potpisivanja.)')]);

  Z(1, 'Na brojevnoj pravoj iz $2,7$ skočimo $0,5$ udesno. Gde smo?',
    ['$3,2$', '$2,12$', '$3,7$', '$2,75$'],
    [K('$2,7 + 0,5$: do $3$ fali $0,3$, pa još $0,2$.', ['s']),
     K('$2,7 + 0,5 = 3,2$.')],
    g0([osa(2, 4, 10, { svaki: 10 }), { tx: '●', at: [2.7, 0], b: 1 }, skok(2.7, 3.2, { h: 0.2, k: 1, id: 's', o: '+0,5' })]));

  Z(1, 'Stranice trougla su $2,4 cm$, $3,15 cm$ i $4 cm$. Koliki je obim?',
    ['$9,55 cm$', '$5,95 cm$', '$9,19 cm$', '$9,5 cm$'],
    [K('$2,40 + 3,15 + 4,00$ – dopisujemo nule da svi imaju dve decimale.'),
     K('$= 9,55 cm$.')]);

  Z(1, 'Prvi skok u dalj je $4,37 m$, a drugi $0,48 m$ duži. Koliki je drugi skok?',
    ['$4,85 m$', '$4,75 m$', '$3,89 m$', '$4,415 m$'],
    [K('$4,37 + 0,48$: stoti delovi $7 + 8 = 15$ – pišemo $5$, prenosimo $1$.'),
     K('Desetine: $3 + 4 + 1 = 8$. Rezultat: $4,85 m$.')]);

  Z(2, 'Izračunaj: $10 − 3,47$.',
    ['$6,53$', '$7,47$', '$7,53$', '$6,63$'],
    [K('$10 = 10,00$.'),
     K('$10,00 − 3,47 = 6,53$ (provera: $6,53 + 3,47 = 10$ ✓).')]);

  Z(2, 'Platili smo $125,50$ i $89,90$ dinara novčanicom od $500$ dinara. Koliki je kusur?',
    ['$284,60$ din', '$215,40$ din', '$285,40$ din', '$284,40$ din'],
    [K('Ukupno: $125,50 + 89,90 = 215,40$ dinara.'),
     K('Kusur: $500 − 215,40 = 284,60$ dinara.')]);

  Z(2, 'U posudi je $2,5 l$ vode. Odlijemo $0,75 l$, a zatim dolijemo $1,3 l$. Koliko je vode sada?',
    ['$3,05 l$', '$2,95 l$', '$4,55 l$', '$3,5 l$'],
    [K('$2,5 − 0,75 = 1,75 l$.'),
     K('$1,75 + 1,3 = 3,05 l$.')]);

  Z(2, 'Izračunaj: $0,3 + 0,03 + 0,003$.',
    ['$0,333$', '$0,9$', '$0,036$', '$0,0333$'],
    [K('Desetine: $3$, stoti delovi: $3$, hiljaditi: $3$.'),
     K('$0,333$ – svaki sabirak „puni“ drugo mesto.')]);

  Z(3, 'Koju cifru treba upisati umesto * da važi $4,*8 + 2,57 = 7,35$?',
    ['$7$', '$8$', '$6$', '$9$'],
    [K('$4,*8 = 7,35 − 2,57 = 4,78$.'),
     K('Na mestu zvezdice je cifra $7$.')]);
  proveri(jed(7.35 - 2.57, 4.78), '4,78');

  Z(3, 'Izračunaj: ${1|4} + 0,35$.',
    ['$0,6$', '$0,39$', '${36|100}$', '$0,285$'],
    [K('${1|4} = 0,25$.'),
     K('$0,25 + 0,35 = 0,60 = 0,6$.')]);

  // ════════════════ 6.3 Svojstva sabiranja i oduzimanja ════════════════
  L('Svojstva sabiranja i oduzimanja; brojevni izrazi');

  Z(1, 'Izračunaj na najlakši način: ${2|9} + {5|8} + {7|9}$.',
    ['$1{5|8}$', '${14|26}$', '${5|8}$', '$1{7|9}$'],
    [K('Grupišemo devetine: ${2|9} + {7|9} = 1$.'),
     K('$1 + {5|8} = 1{5|8}$.')]);

  Z(1, 'Izračunaj na najlakši način: $3,7 + 4,85 + 6,3$.',
    ['$14,85$', '$13,85$', '$14,58$', '$15,85$'],
    [K('$3,7 + 6,3 = 10$.'),
     K('$10 + 4,85 = 14,85$.')]);

  Z(2, 'Izračunaj: $5 − ({1|3} + {1|6})$.',
    ['$4{1|2}$', '$4{2|9}$', '$5{1|2}$', '$4{5|6}$'],
    [K('Zagrada: ${2|6} + {1|6} = {3|6} = {1|2}$.'),
     K('$5 − {1|2} = 4{1|2}$.')]);

  Z(2, 'Izračunaj: $7,5 − 2,8 − 1,2$.',
    ['$3,5$', '$5,9$', '$6,1$', '$4,3$'],
    [K('Oduzimanje dva broja = oduzimanje njihovog zbira: $7,5 − (2,8 + 1,2)$.'),
     K('$7,5 − 4 = 3,5$.')]);

  Z(2, 'Izračunaj: $2{3|5} − (1{1|5} − {1|2})$.',
    ['$1{9|10}$', '$1{2|5}$', '$1{1|10}$', '$2{1|10}$'],
    [K('Zagrada: $1{1|5} − {1|2} = {6|5} − {1|2} = {12|10} − {5|10} = {7|10}$.'),
     K('$2{3|5} − {7|10} = {26|10} − {7|10} = {19|10} = 1{9|10}$.')]);
  proveri(je(razl(R(13, 5), razl(R(6, 5), R(1, 2))), R(19, 10)), '2 3/5');

  Z(2, 'Izračunaj: $(4,5 + {1|2}) − (2,25 + {3|4})$.',
    ['$2$', '$3$', '$1,5$', '$2,5$'],
    [K('${1|2} = 0,5$ i ${3|4} = 0,75$.'),
     K('$(4,5 + 0,5) − (2,25 + 0,75) = 5 − 3 = 2$.')]);

  Z(2, 'Izračunaj: ${9|10} − {1|2} + {3|5}$.',
    ['$1$', '${1|5}$', '${11|10}$', '${4|5}$'],
    [K('Redom sleva: ${9|10} − {5|10} = {4|10}$.'),
     K('${4|10} + {6|10} = {10|10} = 1$. (Greška ${1|5}$: prvo sabrano ${1|2} + {3|5}$.)')]);

  Z(2, 'Za koliko je zbir ${3|4}$ i ${2|3}$ veći od $1$?',
    ['za ${5|12}$', 'za ${5|7}$', 'za ${1|12}$', 'za ${7|12}$'],
    [K('${3|4} + {2|3} = {9|12} + {8|12} = {17|12}$.'),
     K('${17|12} − 1 = {5|12}$.')]);

  Z(3, 'Izračunaj: $1 − {1|2} + {1|3} − {1|6}$.',
    ['${2|3}$', '${1|3}$', '$1$', '${1|6}$'],
    [K('Sve u šestinama: ${6|6} − {3|6} + {2|6} − {1|6}$.'),
     K('$= {6 − 3 + 2 − 1|6} = {4|6} = {2|3}$.')]);

  Z(3, 'Izračunaj: ${1|2} + {1|6} + {1|12} + {1|20}$.',
    ['${4|5}$', '${4|40}$', '${3|4}$', '${9|10}$'],
    [K('Trik: ${1|2} = 1 − {1|2}$, ${1|6} = {1|2} − {1|3}$, ${1|12} = {1|3} − {1|4}$, ${1|20} = {1|4} − {1|5}$.'),
     K('Saberemo – srednji članovi se poništavaju: $1 − {1|5} = {4|5}$.')]);
  proveri(je(zbir(zbir(R(1, 2), R(1, 6)), zbir(R(1, 12), R(1, 20))), R(4, 5)), 'teleskop');

  // ════════════════ 6.4 Jednačine sa sabiranjem i oduzimanjem ════════════════
  L('Jednačine sa sabiranjem i oduzimanjem razlomaka');

  Z(1, 'Reši jednačinu: $x + {2|5} = {9|10}$.',
    ['$x = {1|2}$', '$x = {7|5}$', '$x = {7|10}$', '$x = {11|10}$'],
    [K('Nepoznati sabirak = zbir minus poznati sabirak: $x = {9|10} − {2|5}$.'),
     K('$x = {9|10} − {4|10} = {5|10} = {1|2}$. Provera: ${1|2} + {2|5} = {9|10}$ ✓')],
    g(vaga('x + 2/5', '9/10'), 220));

  Z(1, 'Reši jednačinu: $x − 3,4 = 1,75$.',
    ['$x = 5,15$', '$x = 1,65$', '$x = 2,09$', '$x = 4,15$'],
    [K('Umanjenik = razlika + umanjilac: $x = 1,75 + 3,4$.'),
     K('$x = 5,15$.')]);

  Z(1, 'Reši jednačinu: $4,2 + x = 7$.',
    ['$x = 2,8$', '$x = 3,8$', '$x = 11,2$', '$x = 3,2$'],
    [K('$x = 7 − 4,2 = 2,8$.')],
    g(vaga('4,2 + x', '7'), 220));

  Z(2, 'Reši jednačinu: ${5|6} − x = {1|4}$.',
    ['$x = {7|12}$', '$x = {13|12}$', '$x = {4|2}$', '$x = {1|12}$'],
    [K('Umanjilac = umanjenik − razlika: $x = {5|6} − {1|4}$.'),
     K('$x = {10|12} − {3|12} = {7|12}$.')]);

  Z(2, 'Reši jednačinu: $x + 1{1|3} = 3{1|4}$.',
    ['$x = 1{11|12}$', '$x = 2{1|12}$', '$x = 4{7|12}$', '$x = 1{1|12}$'],
    [K('$x = 3{1|4} − 1{1|3} = {13|4} − {4|3}$.'),
     K('$= {39|12} − {16|12} = {23|12} = 1{11|12}$.')]);
  proveri(je(razl(R(13, 4), R(4, 3)), R(23, 12)), 'x+1 1/3');

  Z(2, 'Reši jednačinu: $(x − {1|2}) + {1|3} = {5|6}$.',
    ['$x = 1$', '$x = {1|2}$', '$x = {2|3}$', '$x = 1{1|6}$'],
    [K('Zagrada je nepoznati sabirak: $x − {1|2} = {5|6} − {1|3} = {1|2}$.'),
     K('$x = {1|2} + {1|2} = 1$.')]);

  Z(2, 'Broj umanjen za $2,35$ jednak je $4,8$. Koji je to broj?',
    ['$7,15$', '$2,45$', '$7,05$', '$6,15$'],
    [K('$x − 2,35 = 4,8$'),
     K('$x = 4,8 + 2,35 = 7,15$.')]);

  Z(3, 'Reši jednačinu: $7,5 − (x + 1,2) = 3,3$.',
    ['$x = 3$', '$x = 5,4$', '$x = 4,2$', '$x = 2,4$'],
    [K('Zagrada je umanjilac: $x + 1,2 = 7,5 − 3,3 = 4,2$.'),
     K('$x = 4,2 − 1,2 = 3$.')]);

  Z(3, 'Kad zamišljenom broju dodam ${3|4}$, pa oduzmem ${1|6}$, dobijem $2$. Koji sam broj zamislio?',
    ['$1{5|12}$', '$2{7|12}$', '$1{7|12}$', '${5|12}$'],
    [K('$x + {3|4} − {1|6} = 2$. Idemo unazad: pre oduzimanja bilo je $2 + {1|6} = 2{1|6}$.'),
     K('Pre dodavanja: $2{1|6} − {3|4} = {26|12} − {9|12} = {17|12} = 1{5|12}$.')]);
  proveri(je(razl(zbir(R(2, 1), R(1, 6)), R(3, 4)), R(17, 12)), 'zamišljen');

  Z(2, 'Reši jednačinu: $x − {2|3} = {2|3} + {1|2}$.',
    ['$x = 1{5|6}$', '$x = {1|2}$', '$x = 1{1|6}$', '$x = {5|6}$'],
    [K('Desna strana: ${4|6} + {3|6} = {7|6}$.'),
     K('$x = {7|6} + {2|3} = {7|6} + {4|6} = {11|6} = 1{5|6}$.')]);

  // ════════════════ 6.5 Nejednačine sa sabiranjem i oduzimanjem ════════════════
  L('Nejednačine sa sabiranjem i oduzimanjem razlomaka');

  Z(1, 'Koji prirodni brojevi zadovoljavaju nejednačinu $x + 2,5 < 7$?',
    ['$1, 2, 3, 4$', '$1, 2, 3, 4, 5$', '$5, 6, 7, …$', '$4$'],
    [K('$x < 7 − 2,5$, tj. $x < 4,5$.', ['z']),
     K('Prirodni brojevi manji od $4,5$: $1, 2, 3, 4$.', ['t'])],
    g0([osa(0, 7, 2), ...zrak(4.5, true, false, 0, 7, { k: 1, id: 'z' }), ...tacke([1, 2, 3, 4], { k: 2, id: 't' })]));

  Z(1, 'Koji je najmanji prirodan broj koji zadovoljava $x − 1,3 > 2$?',
    ['$4$', '$3$', '$3,3$', '$1$'],
    [K('$x > 2 + 1,3 = 3,3$.', ['z']),
     K('Prvi prirodan broj veći od $3,3$ je $4$.')],
    g0([osa(0, 7, 2), ...zrak(3.3, false, false, 0, 7, { k: 1, id: 'z' })]));

  Z(1, 'Koliko prirodnih brojeva je između $1,5$ i $6,2$?',
    ['$5$', '$4$', '$6$', '$3$'],
    [K('To su $2, 3, 4, 5, 6$.', ['t']),
     K('Ukupno $5$.')],
    g0([osa(0, 7, 2), { lin: [[1.5, 0.25], [6.2, 0.25]], b: 2, debljina: 5, crtaj: 1 }, ...tacke([2, 3, 4, 5, 6], { k: 1, id: 't' })]));

  Z(2, 'Koliko prirodnih brojeva zadovoljava ${3|4} + x ≤ 2$?',
    ['$1$', '$2$', '$0$', '$5$'],
    [K('$x ≤ 2 − {3|4} = {5|4} = 1{1|4}$.'),
     K('Prirodni brojevi do $1{1|4}$: samo $1$.')],
    g0([osa(0, 3, 4), ...zrak(1.25, true, true, 0, 3, { k: 1 }), ...tacke([1], { k: 2 })]));

  Z(2, 'Koji prirodni brojevi zadovoljavaju $5 − x > 2,6$?',
    ['$1, 2$', '$1, 2, 3$', '$3, 4, 5$', '$2$'],
    [K('Od $5$ oduzimamo $x$, a ostatak mora biti veći od $2,6$: $x < 5 − 2,6 = 2,4$.'),
     K('Prirodni: $1$ i $2$.')]);

  Z(2, 'Koji je najmanji prirodan broj koji zadovoljava $x + {4|5} ≥ 3{1|2}$?',
    ['$3$', '$2$', '$4$', '$1$'],
    [K('$x ≥ 3{1|2} − {4|5} = {35|10} − {8|10} = {27|10} = 2{7|10}$.'),
     K('Prvi prirodan broj od $2{7|10}$ naviše je $3$.')]);

  Z(2, 'Lift nosi najviše $300 kg$, a u njemu je već $236,5 kg$. Koliko najviše može da ima još jedna osoba?',
    ['$63,5 kg$', '$64,5 kg$', '$536,5 kg$', '$73,5 kg$'],
    [K('$236,5 + x ≤ 300$'),
     K('$x ≤ 300 − 236,5 = 63,5 kg$.')]);

  Z(2, 'Koji brojevi iz skupa $\\{0, 1, 2\\}$ zadovoljavaju ${7|3} − x > {1|2}$?',
    ['$0$ i $1$', 'samo $0$', '$0, 1, 2$', '$1$ i $2$'],
    [K('$x < {7|3} − {1|2} = {14|6} − {3|6} = {11|6} = 1{5|6}$.'),
     K('Iz skupa: $0$ i $1$ ($2 > 1{5|6}$).')]);

  Z(3, 'Koji prirodni brojevi zadovoljavaju $2,4 < x + 1,1 < 5$?',
    ['$2, 3$', '$1, 2, 3$', '$2, 3, 4$', '$3$'],
    [K('Oduzmemo $1,1$ od svih delova: $1,3 < x < 3,9$.', ['z']),
     K('Prirodni: $2$ i $3$.')],
    g0([osa(0, 5, 10, { svaki: 10 }), { lin: [[1.3, 0.25], [3.9, 0.25]], b: 2, debljina: 5, k: 1, id: 'z', crtaj: 1 }, ...tacke([2, 3], { k: 2 })]));

  Z(3, 'Koji od razlomaka ${1|2}$, ${2|3}$, ${3|4}$, ${5|6}$ zadovoljava $x − {3|8} < {1|4}$?',
    ['${1|2}$', '${2|3}$', '${3|4}$', '${5|6}$'],
    [K('$x < {1|4} + {3|8} = {5|8}$.'),
     K('${1|2} = {4|8} < {5|8}$ ✓; ${2|3} > {5|8}$ (jer je ${16|24} > {15|24}$), ostali još veći.')]);

  // ════════════════ 6.6 Množenje razlomaka ════════════════
  L('Množenje razlomaka');

  Z(1, 'Izračunaj: $3 · {2|7}$.',
    ['${6|7}$', '${6|21}$', '${5|7}$', '${2|21}$'],
    [K('$3 · {2|7} = {2|7} + {2|7} + {2|7}$.', ['t']),
     K('$= {6|7}$ (množi se samo brojilac).')],
    g([...traka(7, [0, 1], { w: 7, k: 1, id: 't' }), ...traka(7, [2, 3], { w: 7, b: 2, k: 1, id: 't' }), ...traka(7, [4, 5], { w: 7, b: 5, k: 1, id: 't' }), ...traka(7, 0, { w: 7 })], 240));

  Z(1, 'Izračunaj: ${2|3} · {3|4}$.',
    ['${1|2}$', '${5|7}$', '${6|7}$', '${8|9}$'],
    [K('Model površine: kvadrat podelimo na trećine (kolone) i obojimo $2$…'),
     K('…pa na četvrtine (redove) i obojimo $3$.'),
     K('Preklapanje: $2 · 3 = 6$ od $3 · 4 = 12$ delova: ${6|12} = {1|2}$.', ['pr'])],
    g(povrsina(2, 3, 3, 4, 4, 2), 180));

  Z(1, 'Koliko je ${3|5}$ od $40$?',
    ['$24$', '$8$', '$15$', '$120$'],
    [K('Petina od $40$: $40 : 5 = 8$.'),
     K('Tri petine: $3 · 8 = 24$. (Isto: ${3|5} · 40 = {120|5} = 24$.)')]);

  Z(2, 'Izračunaj: $1{1|2} · 2{2|3}$.',
    ['$4$', '$2{1|3}$', '$3$', '$2{2|6}$'],
    [K('Mešovite pretvorimo u razlomke: ${3|2} · {8|3}$.'),
     K('Skratimo unakrsno: ${1 · 4|1 · 1} = 4$. (Ne množe se posebno celi i posebno razlomci!)')]);

  Z(2, 'Izračunaj: ${5|6} · {9|10}$.',
    ['${3|4}$', '${14|16}$', '${4|5}$', '${1|2}$'],
    [K('Pre množenja skratimo: $5$ i $10$ sa $5$, $9$ i $6$ sa $3$.'),
     K('${1 · 3|2 · 2} = {3|4}$.')]);

  Z(2, 'Stranice pravougaonika su ${3|4} m$ i ${2|3} m$. Kolika je površina?',
    ['${1|2} m²$', '${5|7} m²$', '${17|6} m²$', '${6|7} m²$'],
    [K('$P = {3|4} · {2|3}$.'),
     K('$= {6|12} = {1|2} m²$ – pola kvadratnog metra.', ['pr'])],
    g(povrsina(3, 4, 2, 3, 4, 1), 180));

  Z(2, 'Mama je od ${3|4}$ pice dala Marku ${2|3}$. Koji deo cele pice je dobio Marko?',
    ['${1|2}$', '${2|3}$', '${1|12}$', '${5|12}$'],
    [K('${2|3}$ od ${3|4}$ znači ${2|3} · {3|4}$.'),
     K('$= {6|12} = {1|2}$ cele pice.', ['m'])],
    g([...pica(4, [0, 1, 2], { R: 3, b: 0 }), ...pica(12, [0, 1, 2, 3, 4, 5], { R: 3, b: 1, k: 2, id: 'm' }).map((e) => ({ ...e }))], 180));

  Z(2, 'Izračunaj: $({2|3})^{2}$.',
    ['${4|9}$', '${4|6}$', '${2|9}$', '${4|3}$'],
    [K('$({2|3})^{2} = {2|3} · {2|3}$'),
     K('$= {2 · 2|3 · 3} = {4|9}$.')],
    g(povrsina(2, 3, 2, 3, 4, 1), 160));

  Z(3, 'Izračunaj: ${1|2} · {2|3} · {3|4} · {4|5}$.',
    ['${1|5}$', '${10|14}$', '${4|5}$', '${1|120}$'],
    [K('Svaki brojilac se skrati sa imeniocem prethodnog razlomka: $2$, $3$, $4$ nestaju.'),
     K('Ostaje ${1|5}$.')]);

  Z(3, 'Ana je pročitala ${2|5}$ knjige, a zatim još ${1|3}$ ostatka. Koji deo knjige je pročitala?',
    ['${3|5}$', '${11|15}$', '${2|15}$', '${3|8}$'],
    [K('Ostatak posle prvog dana: $1 − {2|5} = {3|5}$.'),
     K('${1|3}$ ostatka: ${1|3} · {3|5} = {1|5}$.', ['d']),
     K('Ukupno: ${2|5} + {1|5} = {3|5}$.')],
    g([...traka(5, 2, { w: 7.5 }), ...traka(5, [2], { w: 7.5, b: 2, k: 2, id: 'd' })], 240));

  // ════════════════ 6.7 Množenje decimalnih brojeva ════════════════
  L('Množenje decimalnih brojeva');

  Z(1, 'Izračunaj: $0,3 · 0,4$.',
    ['$0,12$', '$1,2$', '$0,7$', '$0,012$'],
    [K('U kvadratu $10 × 10$: $3$ kolone puta $4$ reda = $12$ kvadratića od $100$.', ['pr']),
     K('$0,3 · 0,4 = 0,12$ (ukupno dve decimale).')],
    g(povrsina(3, 10, 4, 10, 4, 1), 180));

  Z(1, 'Izračunaj: $3,6 · 100$.',
    ['$360$', '$36$', '$3 600$', '$0,036$'],
    [K('Množenje sa $100$ pomera zarez za dva mesta udesno.'),
     K('$3,6 → 36 → 360$.')]);

  Z(1, 'Izračunaj: $2,5 · 4$.',
    ['$10$', '$8,20$', '$1$', '$100$'],
    [K('$2,5 · 4 = 2,5 + 2,5 + 2,5 + 2,5$.'),
     K('$= 10$.')],
    g0([osa(0, 11, 1), ...skokovi(0, 2.5, 4, { h: 0.9 })]));

  Z(2, 'Izračunaj: $1,25 · 0,8$.',
    ['$1$', '$0,1$', '$10$', '$1,08$'],
    [K('$125 · 8 = 1 000$, a decimala je ukupno $2 + 1 = 3$.'),
     K('$1,000 = 1$.')]);

  Z(2, 'Kilogram jabuka košta $85,5$ dinara. Koliko košta $3,2 kg$?',
    ['$273,6$ din', '$88,7$ din', '$2 736$ din', '$256,5$ din'],
    [K('$85,5 · 3,2$: $855 · 32 = 27 360$.'),
     K('Decimala ima $1 + 1 = 2$: $273,60$ dinara.')]);
  proveri(jed(85.5 * 3.2, 273.6), 'jabuke');

  Z(2, 'Kolika je površina pravougaonika $4,5 cm × 2,4 cm$?',
    ['$10,8 cm²$', '$6,9 cm²$', '$108 cm²$', '$13,8 cm²$'],
    [K('$45 · 24 = 1 080$.'),
     K('Dve decimale: $10,80 = 10,8 cm²$.')],
    g([pr(0, 0, 4.5, 2.4, { b: 0, gusto: 1 }), { tx: '4,5', at: [2.25, -0.45] }, { tx: '2,4', at: [-0.5, 1.2] }], 200));

  Z(2, 'Izračunaj: $0,2 · 0,2 · 0,2$.',
    ['$0,008$', '$0,6$', '$0,08$', '$0,0008$'],
    [K('$2 · 2 · 2 = 8$.'),
     K('Decimala ukupno $1 + 1 + 1 = 3$: $0,008$.')]);

  Z(2, 'Pešak ide brzinom $4,5 km$ na sat. Koliko pređe za $2,5$ sata?',
    ['$11,25 km$', '$7 km$', '$10,25 km$', '$112,5 km$'],
    [K('Pređeni put je proizvod brzine i vremena: $4,5 · 2,5$.'),
     K('$45 · 25 = 1 125$, dve decimale: $11,25 km$.')]);

  Z(3, 'Izračunaj: $0,05 · 0,006$.',
    ['$0,0003$', '$0,003$', '$0,00003$', '$0,03$'],
    [K('$5 · 6 = 30$.'),
     K('Decimala: $2 + 3 = 5$ → $0,00030 = 0,0003$.')]);

  Z(3, 'Izračunaj na najlakši način: $0,25 · 4,8 · 4$.',
    ['$4,8$', '$48$', '$0,48$', '$19,2$'],
    [K('Zamenimo mesta: $0,25 · 4 = 1$.'),
     K('$1 · 4,8 = 4,8$.')]);

  // ════════════════ 6.8 Recipročan broj; deljenje razlomaka ════════════════
  L('Recipročan broj; deljenje razlomaka');

  Z(1, 'Koji je recipročan broj razlomka ${3|7}$?',
    ['${7|3}$', '${3|7}$', '${4|7}$', '$−{3|7}$'],
    [K('Recipročan broj dobijamo zamenom brojioca i imenioca.'),
     K('${3|7} · {7|3} = 1$ ✓')]);

  Z(1, 'Izračunaj: ${3|4} : {3|8}$.',
    ['$2$', '${9|32}$', '${1|2}$', '${3|2}$'],
    [K('Koliko puta ${3|8}$ staje u ${3|4}$? ${3|4} = {6|8}$, a $6 : 3 = 2$.', ['t']),
     K('Računski: ${3|4} · {8|3} = 2$.')],
    g([...traka(4, 3, { w: 8 }), ...traka(8, [0, 1, 2], { y: -1.8, w: 8, b: 2, k: 1, id: 't' }), ...traka(8, [3, 4, 5], { y: -1.8, w: 8, b: 5, k: 1, id: 't' }), ...traka(8, 0, { y: -1.8, w: 8 })], 240));

  Z(1, 'Izračunaj: $2 : {1|5}$.',
    ['$10$', '${2|5}$', '${1|10}$', '$7$'],
    [K('Koliko petina ima u $2$ cela? U svakom celom $5$, u dva cela $10$.', ['t']),
     K('$2 : {1|5} = 2 · 5 = 10$.')],
    g([...traka(5, 5, { w: 5, k: 1, id: 't' }), ...traka(5, 5, { x: 5.4, w: 5, b: 2, k: 1, id: 't' }), ...traka(5, 0, { w: 5 }), ...traka(5, 0, { x: 5.4, w: 5 })], 260));

  Z(2, 'Izračunaj: ${5|6} : 10$.',
    ['${1|12}$', '${25|3}$', '${50|6}$', '${1|2}$'],
    [K('Deliti sa $10$ = množiti sa ${1|10}$: ${5|6} · {1|10}$.'),
     K('$= {5|60} = {1|12}$.')]);

  Z(2, 'Izračunaj: $2{1|4} : 1{1|2}$.',
    ['${3|2}$', '$2{1|2}$', '${2|3}$', '$1{1|8}$'],
    [K('${9|4} : {3|2} = {9|4} · {2|3}$.'),
     K('$= {18|12} = {3|2} = 1{1|2}$.')]);

  Z(2, 'Koji je recipročan broj broja $2{1|3}$?',
    ['${3|7}$', '$3{1|2}$', '${1|3}$', '$1{1|3}$'],
    [K('Prvo pretvorimo: $2{1|3} = {7|3}$.'),
     K('Recipročan: ${3|7}$. (Nije $2{3|1}$ – menja se ceo broj, ne samo razlomljeni deo.)')]);

  Z(2, 'Koliko čaša od ${1|4} l$ može da se napuni sa $3{1|2} l$ soka?',
    ['$14$', '$12$', '${7|8}$', '$13$'],
    [K('$3{1|2} : {1|4} = {7|2} · 4$.'),
     K('$= 14$ čaša.')]);

  Z(2, 'Izračunaj: ${4|9} : {2|3}$.',
    ['${2|3}$', '${8|27}$', '${3|2}$', '${2|9}$'],
    [K('${4|9} · {3|2}$ – skratimo $4$ i $2$, $3$ i $9$.'),
     K('$= {2|3}$.')]);

  Z(3, 'Koji broj je jednak svom recipročnom broju (od pozitivnih brojeva)?',
    ['$1$', '$0$', '${1|2}$', 'nijedan'],
    [K('$x · {1|x} = 1$; ako je $x = {1|x}$, onda je $x · x = 1$.'),
     K('Jedini pozitivan takav broj je $1$. (Nula nema recipročan broj.)')]);

  Z(3, 'Izračunaj: $({3|5} : {9|10}) : {2|3}$.',
    ['$1$', '${4|9}$', '${9|4}$', '${2|3}$'],
    [K('Zagrada: ${3|5} · {10|9} = {30|45} = {2|3}$.'),
     K('${2|3} : {2|3} = 1$.')]);

  // ════════════════ 6.9 Deljenje decimalnih brojeva ════════════════
  L('Deljenje decimalnih brojeva');

  Z(1, 'Izračunaj: $7,2 : 0,9$.',
    ['$8$', '$0,8$', '$80$', '$6,3$'],
    [K('Proširimo oba broja sa $10$: $72 : 9$.'),
     K('$= 8$.')]);

  Z(1, 'Izračunaj: $4,5 : 100$.',
    ['$0,045$', '$450$', '$0,45$', '$0,0045$'],
    [K('Deljenje sa $100$ pomera zarez dva mesta ulevo.'),
     K('$4,5 → 0,45 → 0,045$.')]);

  Z(1, 'Izračunaj: $5 : 8$.',
    ['$0,625$', '$1,6$', '$0,58$', '$0,6$'],
    [K('$5,000 : 8$: $50 : 8 = 6$ (ost. $2$), $20 : 8 = 2$ (ost. $4$), $40 : 8 = 5$.'),
     K('$= 0,625$.')]);

  Z(2, 'Izračunaj: $1,2 : 0,04$.',
    ['$30$', '$3$', '$0,3$', '$300$'],
    [K('Proširimo sa $100$: $120 : 4$.'),
     K('$= 30$.')]);

  Z(2, 'Izračunaj: $10 : 0,25$.',
    ['$40$', '$2,5$', '$4$', '$0,4$'],
    [K('$0,25 = {1|4}$ – koliko četvrtina ima u $10$?'),
     K('$10 · 4 = 40$.')]);

  Z(2, 'Koliko boca od $0,75 l$ može da se napuni sa $6 l$?',
    ['$8$', '$4,5$', '$80$', '$6$'],
    [K('$6 : 0,75 = 600 : 75$.'),
     K('$= 8$ boca.')]);

  Z(2, 'Traka dugačka $8,4 m$ seče se na komade od $0,35 m$. Koliko komada se dobija?',
    ['$24$', '$2,4$', '$240$', '$29$'],
    [K('$8,4 : 0,35 = 840 : 35$.'),
     K('$= 24$ komada.')]);

  Z(2, '$3,5 kg$ sira košta $437,5$ dinara. Koliko košta $1 kg$?',
    ['$125$ din', '$1 531,25$ din', '$12,5$ din', '$150$ din'],
    [K('$437,5 : 3,5 = 4 375 : 35$.'),
     K('$= 125$ dinara.')]);

  Z(3, 'Izračunaj: $0,6 : 0,003$.',
    ['$200$', '$20$', '$2$', '$0,002$'],
    [K('Proširimo sa $1 000$: $600 : 3$.'),
     K('$= 200$.')]);

  Z(3, 'Biciklista je prešao $31,5 km$ za $1,75$ sati. Kolikom je prosečnom brzinom vozio?',
    ['$18 km$ na sat', '$55,125 km$ na sat', '$1,8 km$ na sat', '$29,75 km$ na sat'],
    [K('Brzina je količnik pređenog puta i vremena: $31,5 : 1,75$.'),
     K('Proširimo sa $100$: $3 150 : 175 = 18$ km na sat.')]);

  // ════════════════ 6.10 Svojstva množenja i deljenja ════════════════
  L('Svojstva množenja i deljenja; brojevni izrazi');

  Z(1, 'Izračunaj na najlakši način: $25 · 3,7 · 4$.',
    ['$370$', '$37$', '$3 700$', '$92,5$'],
    [K('$25 · 4 = 100$.'),
     K('$100 · 3,7 = 370$.')]);

  Z(1, 'Izračunaj na najlakši način: ${7|8} · 5 + {7|8} · 3$.',
    ['$7$', '${7|64}$', '${35|8}$', '$8$'],
    [K('Izvučemo zajednički činilac: ${7|8} · (5 + 3)$.'),
     K('$= {7|8} · 8 = 7$.')]);

  Z(1, 'Izračunaj: $({1|2} + {1|3}) · 6$.',
    ['$5$', '${5|6}$', '$3{1|3}$', '$6$'],
    [K('Distributivnost: ${1|2} · 6 + {1|3} · 6$.'),
     K('$= 3 + 2 = 5$.')]);

  Z(2, 'Izračunaj na najlakši način: $2,5 · 9,6 + 2,5 · 0,4$.',
    ['$25$', '$24$', '$10$', '$250$'],
    [K('$2,5 · (9,6 + 0,4) = 2,5 · 10$.'),
     K('$= 25$.')]);

  Z(2, 'Izračunaj: ${3|4} : ({1|2} + {1|4})$.',
    ['$1$', '$2{1|2}$', '${9|16}$', '$3$'],
    [K('Zagrada: ${2|4} + {1|4} = {3|4}$.'),
     K('${3|4} : {3|4} = 1$. (Greška: deljenje „razbiti“ na ${3|4} : {1|2} + {3|4} : {1|4}$ – to ne važi!)')]);

  Z(2, 'Izračunaj: $1,2 · (5 − 0,5 : 0,25)$.',
    ['$3,6$', '$5,4$', '$21,6$', '$2,4$'],
    [K('U zagradi prvo deljenje: $0,5 : 0,25 = 2$.'),
     K('$5 − 2 = 3$, pa $1,2 · 3 = 3,6$.')]);

  Z(2, 'Izračunaj: ${2|3} + {1|3} · {3|4}$.',
    ['${11|12}$', '${3|4}$', '${1|2}$', '$1$'],
    [K('Množenje pre sabiranja: ${1|3} · {3|4} = {1|4}$.'),
     K('${2|3} + {1|4} = {8|12} + {3|12} = {11|12}$. (Greška ${3|4}$: prvo sabrano.)')]);

  Z(2, 'Izračunaj na najlakši način: $9,9 · 9,9 + 9,9 · 0,1$.',
    ['$99$', '$98,01$', '$990$', '$9,9$'],
    [K('$9,9 · (9,9 + 0,1) = 9,9 · 10$.'),
     K('$= 99$.')]);

  Z(3, 'Izračunaj: $(2 − {1|3}) : (2 + {1|3})$.',
    ['${5|7}$', '${7|5}$', '$1$', '${1|9}$'],
    [K('$2 − {1|3} = {5|3}$, $2 + {1|3} = {7|3}$.'),
     K('${5|3} : {7|3} = {5|3} · {3|7} = {5|7}$.')]);

  Z(3, 'Izračunaj na najlakši način: $0,125 · 3,2 · 8 · 2,5$.',
    ['$8$', '$80$', '$0,8$', '$10$'],
    [K('Grupišemo: $(0,125 · 8) · (3,2 · 2,5)$.'),
     K('$0,125 · 8 = 1$ i $3,2 · 2,5 = 8$: rezultat $8$.')]);

  // ════════════════ 6.11 Jednačine sa množenjem i deljenjem ════════════════
  L('Jednačine sa množenjem i deljenjem razlomaka');

  Z(1, 'Reši jednačinu: ${3|4} · x = {9|16}$.',
    ['$x = {3|4}$', '$x = {27|64}$', '$x = {4|3}$', '$x = {12|16}$'],
    [K('Nepoznati činilac = proizvod : poznati činilac.'),
     K('$x = {9|16} : {3|4} = {9|16} · {4|3} = {3|4}$.')],
    g(vaga('3/4 · x', '9/16'), 220));

  Z(1, 'Reši jednačinu: $x : 0,5 = 12$.',
    ['$x = 6$', '$x = 24$', '$x = 0,6$', '$x = 2,4$'],
    [K('Deljenik = količnik · delilac: $x = 12 · 0,5$.'),
     K('$x = 6$.')]);

  Z(1, 'Reši jednačinu: $2,5 · x = 10$.',
    ['$x = 4$', '$x = 25$', '$x = 7,5$', '$x = 0,4$'],
    [K('$x = 10 : 2,5 = 100 : 25 = 4$.')],
    g(vaga('2,5 · x', '10'), 220));

  Z(2, '${2|3}$ nekog broja je $18$. Koji je to broj?',
    ['$27$', '$12$', '$36$', '$9$'],
    [K('${2|3} · x = 18$, pa je $x = 18 : {2|3} = 18 · {3|2}$.'),
     K('$x = 27$. Na traci: dve trećine su $18$, jedna je $9$, tri su $27$.', ['t'])],
    g([...traka(3, 2, { w: 6 }), { tx: '18', at: [2, 1.7] }, ...[0, 1, 2].map((i) => ({ tx: '9', at: [1 + i * 2, 0.6], k: 2, id: 't' }))], 220));

  Z(2, 'Reši jednačinu: $x : {3|5} = {5|6}$.',
    ['$x = {1|2}$', '$x = {25|18}$', '$x = {18|25}$', '$x = 2$'],
    [K('$x = {5|6} · {3|5}$.'),
     K('$= {15|30} = {1|2}$.')]);

  Z(2, 'Reši jednačinu: $6 : x = {3|4}$.',
    ['$x = 8$', '$x = {9|2}$', '$x = {1|8}$', '$x = 4{1|2}$'],
    [K('Delilac = deljenik : količnik: $x = 6 : {3|4}$.'),
     K('$x = 6 · {4|3} = 8$.')]);

  Z(2, 'Reši jednačinu: $2x + 1,5 = 6,3$.',
    ['$x = 2,4$', '$x = 3,9$', '$x = 4,8$', '$x = 1,4$'],
    [K('$2x = 6,3 − 1,5 = 4,8$.'),
     K('$x = 4,8 : 2 = 2,4$.')],
    g(vaga('x + x + 1,5', '6,3'), 220));

  Z(2, 'Zamišljeni broj pomnožen sa $1,5$, pa uvećan za $0,8$, daje $5,3$. Koji je broj?',
    ['$3$', '$4,03$', '$6,75$', '$2,4$'],
    [K('$1,5 · x + 0,8 = 5,3$, pa je $1,5 · x = 4,5$.'),
     K('$x = 4,5 : 1,5 = 3$.')]);

  Z(3, 'Reši jednačinu: ${3|5} · x − {1|2} = {1|10}$.',
    ['$x = 1$', '$x = {3|5}$', '$x = {1|3}$', '$x = {5|3}$'],
    [K('${3|5} · x = {1|10} + {1|2} = {6|10} = {3|5}$.'),
     K('$x = {3|5} : {3|5} = 1$.')]);

  Z(3, '${3|8}$ konopca je $4,5 m$. Koliko je dugačak ceo konopac?',
    ['$12 m$', '$1,6875 m$', '$13,5 m$', '$1,5 m$'],
    [K('Jedna osmina: $4,5 : 3 = 1,5 m$.', ['t']),
     K('Ceo konopac: $8 · 1,5 = 12 m$.')],
    g([...traka(8, 3, { w: 8 }), { tx: '4,5 m', at: [1.5, 1.7] }, ...[...Array(8)].map((_, i) => ({ tx: '1,5', at: [0.5 + i, 0.6], k: 1, id: 't', vel: 12 }))], 260));

  // ════════════════ 6.12 Nejednačine sa množenjem i deljenjem ════════════════
  L('Nejednačine sa množenjem i deljenjem razlomaka');

  Z(1, 'Koji prirodni brojevi zadovoljavaju $2 · x < 7$?',
    ['$1, 2, 3$', '$1, 2, 3, 4$', '$1, 2$', '$4, 5, 6, …$'],
    [K('$x < 7 : 2 = 3,5$.', ['z']),
     K('Prirodni: $1, 2, 3$.')],
    g0([osa(0, 6, 2), ...zrak(3.5, true, false, 0, 6, { k: 1, id: 'z' }), ...tacke([1, 2, 3], { k: 2 })]));

  Z(1, 'U ranac sme najviše $5 kg$. Koliko najviše knjiga od po $0,8 kg$ može da stane?',
    ['$6$', '$7$', '$5$', '$6,25$'],
    [K('$0,8 · x ≤ 5$, pa je $x ≤ 5 : 0,8 = 6,25$.'),
     K('Broj knjiga je prirodan broj: najviše $6$ ($6 · 0,8 = 4,8 kg$).')]);

  Z(1, 'Kilogram trešanja košta $120$ dinara, a imam $500$ dinara. Koliko najviše celih kilograma mogu da kupim?',
    ['$4$', '$5$', '$4,1$', '$3$'],
    [K('$120 · x ≤ 500$, $x ≤ 500 : 120 = 4{1|6}$.'),
     K('Najviše $4$ cela kilograma ($480$ dinara).')]);

  Z(2, 'Koji prirodni brojevi zadovoljavaju $x : 0,5 ≤ 7$?',
    ['$1, 2, 3$', '$1, …, 14$', '$1, 2, 3, 4$', '$1, 2$'],
    [K('$x : 0,5 = 2x$, pa je $2x ≤ 7$, $x ≤ 3,5$.'),
     K('Prirodni: $1, 2, 3$.')]);

  Z(2, 'Koji je najmanji prirodan broj koji zadovoljava ${3|4} · x > 6$?',
    ['$9$', '$8$', '$5$', '$4$'],
    [K('$x > 6 : {3|4} = 6 · {4|3} = 8$.'),
     K('Prvi prirodan broj veći od $8$ je $9$. ($8$ nije rešenje jer je ${3|4} · 8 = 6$, a ne više od $6$.)')],
    g0([osa(0, 12, 1), ...zrak(8, false, false, 0, 12, { k: 1 }), ...tacke([9], { k: 2 })]));

  Z(2, 'Koji prirodni brojevi zadovoljavaju $1,2 · x ≥ 6$?',
    ['svi od $5$ naviše', 'svi od $6$ naviše', '$1, 2, 3, 4, 5$', 'samo $5$'],
    [K('$x ≥ 6 : 1,2 = 5$.'),
     K('Rešenja: $5, 6, 7, …$ (zatvoren kraj – $5$ jeste rešenje).')],
    g0([osa(0, 10, 1), ...zrak(5, false, true, 0, 10, { k: 1 })]));

  Z(2, 'Koliko prirodnih brojeva zadovoljava $x : 3 < 2{1|3}$?',
    ['$6$', '$7$', '$2$', '$9$'],
    [K('$x < 2{1|3} · 3 = {7|3} · 3 = 7$.'),
     K('Prirodni: $1, 2, …, 6$ – šest brojeva.')]);

  Z(2, 'Koliko prirodnih brojeva zadovoljava ${2|3} · x ≤ 4$?',
    ['$6$', '$2$', '$5$', '$7$'],
    [K('$x ≤ 4 : {2|3} = 4 · {3|2} = 6$.'),
     K('$1, 2, 3, 4, 5, 6$: šest brojeva (i $6$ jeste rešenje).')]);

  Z(3, 'Koji prirodni brojevi zadovoljavaju $0,5 < x : 4 < 1,25$?',
    ['$3, 4$', '$2, 3, 4, 5$', '$3, 4, 5$', '$1, 2, 3, 4$'],
    [K('Pomnožimo sve delove sa $4$: $2 < x < 5$.', ['z']),
     K('Prirodni: $3$ i $4$.')],
    g0([osa(0, 6, 1), { lin: [[2, 0.25], [5, 0.25]], b: 2, debljina: 5, k: 1, id: 'z', crtaj: 1 }, { tx: '○', at: [2, 0.2], b: 2, vel: 20, k: 1 }, { tx: '○', at: [5, 0.2], b: 2, vel: 20, k: 1 }, ...tacke([3, 4], { k: 2 })]));

  Z(3, 'Koliko prirodnih brojeva zadovoljava $3 < 1,5 · x ≤ 9$?',
    ['$4$', '$3$', '$5$', '$6$'],
    [K('Podelimo sve delove sa $1,5$: $2 < x ≤ 6$.'),
     K('$3, 4, 5, 6$ – četiri broja.')]);
};
