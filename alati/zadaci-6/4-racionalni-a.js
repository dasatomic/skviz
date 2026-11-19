// Tema 3: Racionalni brojevi – prvi deo (lekcije 3.1–3.5): skup Q i brojevna prava, zapisi,
// apsolutna vrednost i upoređivanje, sabiranje i oduzimanje, množenje. Sopstveni brojevi.
module.exports = ({ L, Z, K, G, R, O, bez, r, proveri, traka, skok, sto, termometar, skrati, isti }) => {
  // ── provera računa: razlomak = [brojilac, imenilac] ──
  const F = (a, b = 1) => skrati([a, b]);
  const zb = (...x) => x.reduce((p, q) => skrati([p[0] * q[1] + q[0] * p[1], p[1] * q[1]]));
  const ra = (x, y) => skrati([x[0] * y[1] - y[0] * x[1], x[1] * y[1]]);
  const pr = (...x) => x.reduce((p, q) => skrati([p[0] * q[0], p[1] * q[1]]));
  const je = (x, y) => isti(x, y);
  const blizu = (a, b) => Math.abs(a - b) < 1e-9;

  // ── crteži ──
  // brojevna prava; tacke = [[vrednost, natpis, boja, { k, id, visina }]]
  function prava(od, doo, n, tacke = [], e = [], { svaki = n, vel = 320 } = {}) {
    const h = (doo - od) * 0.06;
    const el = [{ osa: [od, doo], podela: 1 / n, svaki }];
    for (const [x, nat, b = 1, d = {}] of tacke) {
      const { visina = 1, ...dod } = d;
      el.push({ tx: '●', at: [r(x), 0], b, vel: 18, ...dod });
      if (nat) el.push({ tx: nat, at: [r(x), r(h * (1 + 0.9 * (visina - 1)) * 1.3)], b, vel: 16, ...dod });
    }
    return G({}, [...el, ...e], { velicina: vel });
  }
  // rastojanje od a do b iznad prave, sa natpisom
  const raz = (a, b, natpis, od, doo, { boja = 2, nivo = 2.6, ...dod } = {}) => {
    const h = (doo - od) * 0.06, y = r(h * nivo);
    return [
      { lin: [[r(a), y], [r(b), y]], b: boja, debljina: 4, ...dod },
      { lin: [[r(a), r(y - h * 0.4)], [r(a), r(y + h * 0.4)]], b: boja, debljina: 3, ...dod },
      { lin: [[r(b), r(y - h * 0.4)], [r(b), r(y + h * 0.4)]], b: boja, debljina: 3, ...dod },
      ...(natpis ? [{ tx: natpis, at: [r((a + b) / 2), r(y + h * 0.9)], b: boja, vel: 15, ...dod }] : []),
    ];
  };
  // skok po pravoj (visina srazmerna rasponu); ispod = ulevo, ispod prave
  const sk = (a, b, od, doo, { boja = 1, ispod = false, kasni = 0.3, ...dod } = {}) =>
    skok(a, b, { h: (doo - od) * (ispod ? 0.1 : 0.13), boja, ispod, kasni, ...dod });
  // niz skokova jednake dužine
  const niz = (pocetak, korak, n, od, doo, x = {}) => Array.from({ length: n }, (_, i) =>
    sk(pocetak + i * korak, pocetak + (i + 1) * korak, od, doo, { ...x, kasni: 0.3 + i * (x.razmak ?? 0.45) }));
  // kartice sa znacima činilaca
  function cinioci(zn, { k, id } = {}) {
    const e = [];
    zn.forEach((z, i) => {
      const x = i * 1.6;
      e.push({ lin: [[x, 0], [x + 1.1, 0], [x + 1.1, 1.1], [x, 1.1]], zatv: 1, gusto: 1, b: z === '−' ? 1 : 2, ...(z === '−' && id ? { id } : {}) });
      e.push({ tx: z, at: [r(x + 0.55), 0.45], vel: 24 });
      if (i < zn.length - 1) e.push({ tx: '·', at: [r(x + 1.35), 0.45], vel: 20 });
    });
    return e;
  }
  // model površine (jedinični kvadrat): a/b širine, c/d visine; preklop (id 'pr') od koraka k
  function pov(a, b, c, d, { s = 4, k = 1, natpisi = true } = {}) {
    const p = (x, y, w, h, x2) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((q) => q.map(r)), zatv: 1, ...x2 });
    const e = [p(0, 0, s, s, { b: 4, prazno: 1 })];
    e.push(p(0, 0, (s * a) / b, s, { b: 0 }));
    e.push(p(0, 0, s, (s * c) / d, { b: 1 }));
    e.push(p(0, 0, (s * a) / b, (s * c) / d, { b: 3, gusto: 1, k, id: 'pr' }));
    for (let i = 1; i < b; i++) e.push({ lin: [[r((i * s) / b), 0], [r((i * s) / b), s]], b: 4, debljina: 1 });
    for (let j = 1; j < d; j++) e.push({ lin: [[0, r((j * s) / d)], [s, r((j * s) / d)]], b: 4, debljina: 1 });
    if (natpisi) e.push({ tx: `${a}/${b}`, at: [r((s * a) / b / 2), -0.45], b: 0, vel: 16 }, { tx: `${c}/${d}`, at: [-0.6, r((s * c) / d / 2)], b: 1, vel: 16 });
    return e;
  }
  // trake dužina (litri, kilogrami): redovi = [[[dužina, boja, natpis, dod], …], …]
  const nadovezi = (redovi, { jed = 3 } = {}) => {
    const e = [];
    redovi.forEach((red, j) => {
      let x = 0;
      const y = -j * 1.6;
      for (const [d, b, nat, dod = {}] of red) {
        const w = d * jed;
        e.push({ lin: [[r(x), y], [r(x + w), y], [r(x + w), y + 1], [r(x), y + 1]], zatv: 1, gusto: 1, b, ...dod });
        if (nat) e.push({ tx: nat, at: [r(x + w / 2), y + 0.45], vel: 14, ...dod });
        x += w;
      }
    });
    return e;
  };
  const g = (e, vel = 300) => G({}, e, { velicina: vel });

  // ════════════════ 3.1 Skup racionalnih brojeva i brojevna prava ════════════════
  L('Skup racionalnih brojeva i brojevna prava');

  Z(1, 'Kom broju odgovara tačka $A$?',
    ['$−{5|4}$', '$−{3|4}$', '$−{4|5}$', '$−{1|4}$'],
    [K('Jedinična duž je podeljena na $4$ jednaka dela – svaki podeok je ${1|4}$.'),
     K('Od nule do tačke $A$ ima $5$ podeoka ulevo: $A$ odgovara broju $−{5|4} = −1{1|4}$.', ['s'])],
    prava(-2, 1, 4, [[-1.25, 'A']], niz(0, -0.25, 5, -2, 1, { k: 2, id: 's', razmak: 0.3 })));

  Z(1, 'Koji od brojeva $−3$, ${2|5}$, $0$, $−{7|2}$, $4$ su negativni racionalni brojevi koji NISU celi?',
    ['samo $−{7|2}$', '$−3$ i $−{7|2}$', 'samo $−3$', '${2|5}$ i $−{7|2}$'],
    [K('Negativni su $−3$ i $−{7|2}$ – leže levo od nule.', ['neg']),
     K('$−3$ je ceo broj, a $−{7|2} = −3,5$ nije. Traženi broj je samo $−{7|2}$.', ['tr'])],
    prava(-4, 5, 1, [[-3, '−3', 1, { id: 'neg' }], [0.4, '2/5', 2, { visina: 2.2 }], [0, '0', 0], [-3.5, '−7/2', 3, { id: 'tr', visina: 2.2 }], [4, '4', 2]], [{ lin: [[-4, 0], [-0.1, 0]], b: 1, debljina: 6, k: 1, id: 'neg' }]));

  Z(1, 'Koji broj je suprotan broju $−2{3|4}$?',
    ['$2{3|4}$', '$−2{3|4}$', '$−{4|11}$', '${4|11}$'],
    [K('Suprotan broj je na istom rastojanju od nule, sa druge strane.', ['d']),
     K('Suprotan broj broju $−2{3|4}$ je $2{3|4}$. (${4|11}$ je recipročan broju ${11|4}$ – to je drugi pojam.)', ['b'])],
    prava(-3, 3, 4, [[-2.75, '−2 3/4'], [2.75, '2 3/4', 2, { k: 2, id: 'b' }]], [...raz(-2.75, 0, '', -3, 3, { boja: 1, k: 1, id: 'd' }), ...raz(0, 2.75, '', -3, 3, { k: 1, id: 'd' })], { svaki: 4 }));

  Z(2, 'Koliko ima racionalnih brojeva koji NISU celi, a mogu se zapisati sa imeniocem $5$ i leže između $−2$ i $1$?',
    ['$12$', '$14$', '$15$', '$9$'],
    [K('Od $−2$ do $1$ ima $3$ jedinične duži.'),
     K('Svaka duž je podeljena na $5$ delova, pa unutar nje ima $4$ podeoka koji nisu celi brojevi.', ['t']),
     K('Ukupno $3 · 4 = 12$. (Brojevi $−1$ i $0$ se mogu zapisati kao $−{5|5}$ i ${0|5}$, ali su celi.)')],
    prava(-2, 1, 5, [-9, -8, -7, -6, -4, -3, -2, -1, 1, 2, 3, 4].map((m) => [m / 5, '', 1, { k: 2, id: 't' }]), [], { svaki: 5 }));
  proveri([...Array(15)].map((_, i) => -10 + i + 1).filter((m) => m % 5 !== 0 && m > -10 && m < 5).length === 12, '12 razlomaka');

  Z(2, 'Koliko celih brojeva ima između $−{13|3}$ i ${7|4}$?',
    ['$6$', '$5$', '$7$', '$4$'],
    [K('$−{13|3} = −4{1|3}$, a ${7|4} = 1{3|4}$.', ['kr']),
     K('Celi brojevi između: $−4, −3, −2, −1, 0, 1$ – ukupno $6$.', ['c'])],
    prava(-5, 2, 1, [[-13 / 3, '−13/3', 2, { k: 1, id: 'kr' }], [1.75, '7/4', 2, { k: 1, id: 'kr' }], ...[-4, -3, -2, -1, 0, 1].map((x) => [x, '', 1, { k: 2, id: 'c' }])]));
  proveri([-5, -4, -3, -2, -1, 0, 1, 2].filter((x) => x > -13 / 3 && x < 7 / 4).length === 6, 'celi između');

  Z(2, 'Tačka $M$ je na sredini između $−1$ i $0$, a tačka $N$ na sredini između $M$ i $0$. Kom broju odgovara $N$?',
    ['$−{1|4}$', '$−{1|2}$', '${1|4}$', '$−{3|4}$'],
    [K('Sredina između $−1$ i $0$: $M = −{1|2}$.', ['m']),
     K('Sredina između $−{1|2}$ i $0$ je polovina od polovine: $N = −{1|4}$.', ['n'])],
    prava(-1.25, 0.5, 4, [[-1, '−1', 2], [-0.5, 'M', 1, { k: 1, id: 'm' }], [-0.25, 'N', 3, { k: 2, id: 'n' }]], [...raz(-1, -0.5, '', -1.25, 0.5, { boja: 1, k: 1 }), ...raz(-0.5, 0, '', -1.25, 0.5, { boja: 1, k: 1 }), ...raz(-0.25, 0, '', -1.25, 0.5, { boja: 3, nivo: 4, k: 2 })], { svaki: 4 }));

  Z(2, 'Koji od ovih brojeva leži između $−{1|2}$ i $−{1|3}$?',
    ['$−{5|12}$', '$−{1|5}$', '$−{2|3}$', '$−{1|6}$'],
    [K('Svedemo na imenilac $12$: $−{1|2} = −{6|12}$, $−{1|3} = −{4|12}$.', ['kr']),
     K('Između njih je $−{5|12}$. Ostali: $−{1|5} = −0,2$ i $−{1|6} ≈ −0,17$ su desno, a $−{2|3}$ levo.', ['s'])],
    prava(-0.75, 0, 12, [[-0.5, '−1/2', 2, { id: 'kr' }], [-1 / 3, '−1/3', 2, { id: 'kr' }], [-5 / 12, '−5/12', 1, { k: 2, id: 's', visina: 2.2 }]], [], { svaki: 12 }));
  proveri(-5 / 12 > -1 / 2 && -5 / 12 < -1 / 3 && -1 / 5 > -1 / 3 && -1 / 6 > -1 / 3 && -2 / 3 < -1 / 2, 'između −1/2 i −1/3');

  Z(3, 'Na brojevnoj pravoj jedinična duž je duga $6 cm$. Koliko su centimetara udaljene tačke koje odgovaraju brojevima $−{5|3}$ i ${1|2}$?',
    ['$13 cm$', '$7 cm$', '$8 cm$', '$12 cm$'],
    [K('Tačka $−{5|3}$ je od nule udaljena ${5|3}$ jedinične duži: ${5|3} · 6 = 10 cm$.', ['a']),
     K('Tačka ${1|2}$ je od nule udaljena ${1|2} · 6 = 3 cm$, sa druge strane.', ['b']),
     K('Tačke su sa različitih strana nule, pa se rastojanja sabiraju: $10 + 3 = 13 cm$.')],
    prava(-2, 1, 6, [[-5 / 3, '−5/3'], [0.5, '1/2', 2]], [...raz(-5 / 3, 0, '10 cm', -2, 1, { boja: 1, k: 1, id: 'a' }), ...raz(0, 0.5, '3 cm', -2, 1, { k: 2, id: 'b' })]));
  proveri(blizu((5 / 3) * 6 + 0.5 * 6, 13), '13 cm');

  Z(3, 'Koliko elemenata skupa $\\{−{7|2}, 0, {9|3}, −1, 0,5, −{8|4}\\}$ pripada skupu celih brojeva $Z$?',
    ['$4$', '$3$', '$2$', '$6$'],
    [K('Prepoznajemo cele brojeve i kad su zapisani kao razlomak: ${9|3} = 3$ i $−{8|4} = −2$.', ['c']),
     K('Celi su $0$, $3$, $−1$ i $−2$ – četiri broja. $−{7|2} = −3,5$ i $0,5$ nisu celi.')],
    prava(-4, 4, 2, [[-3.5, '−7/2', 3], [0, '0', 1, { k: 1, id: 'c' }], [3, '9/3', 1, { k: 1, id: 'c' }], [-1, '−1', 1, { k: 1, id: 'c' }], [0.5, '0,5', 3, { visina: 2 }], [-2, '−8/4', 1, { k: 1, id: 'c' }]], [], { svaki: 2 }));

  Z(3, 'Žaba kreće iz tačke $−2$ i skače udesno, svaki skok dug ${3|4}$. Posle koliko skokova će prvi put biti desno od nule?',
    ['$3$', '$2$', '$4$', '$8$'],
    [K('Posle $2$ skoka: $−2 + {6|4} = −{1|2}$ – još levo od nule.', ['s']),
     K('Posle $3$ skoka: $−2 + {9|4} = {1|4}$ – desno od nule. Odgovor: $3$ skoka.', ['s3'])],
    prava(-2.5, 1, 4, [[-2, '−2', 2]], [sk(-2, -1.25, -2.5, 1, { k: 1, id: 's' }), sk(-1.25, -0.5, -2.5, 1, { k: 1, id: 's', kasni: 0.8 }), sk(-0.5, 0.25, -2.5, 1, { k: 2, id: 's3', boja: 3 })], { svaki: 4 }));
  proveri(-2 + 2 * 0.75 < 0 && -2 + 3 * 0.75 > 0, 'žaba');

  // ════════════════ 3.2 Različiti zapisi racionalnih brojeva ════════════════
  L('Različiti zapisi racionalnih brojeva');

  Z(1, 'Zapiši $−0,45$ kao skraćen razlomak.',
    ['$−{9|20}$', '$−{45|10}$', '$−{4|5}$', '$−{9|2}$'],
    [K('$0,45$ su $45$ stotih delova: ${45|100}$.'),
     K('Skratimo sa $5$: ${45|100} = {9|20}$ – svaka kolona od $5$ kvadratića je jedna dvadesetina, pa je $−0,45 = −{9|20}$.', [], g([...traka(20, 9, { w: 10, h: 1.4, b: 2 }), { tx: '9/20', at: [5, 2], b: 2, vel: 18 }], 300))],
    g(sto(45, { a: 0.5 }), 200));
  proveri(je(F(-45, 100), F(-9, 20)), '−0,45');

  Z(1, 'Koji je decimalni zapis broja ${11|−5}$?',
    ['$−2,2$', '$2,2$', '$−2,1$', '$−2,5$'],
    [K('Znak: brojilac pozitivan, imenilac negativan – broj je negativan.'),
     K('${11|5} = {22|10} = 2,2$, pa je ${11|−5} = −2,2$.', ['t'])],
    R(prava(-3, 0, 5, [[-2.2, '−2,2', 1, { id: 't' }]], [], { svaki: 5 })));
  proveri(blizu(11 / -5, -2.2), '11/−5');

  Z(1, 'Skrati razlomak ${−12|−16}$.',
    ['${3|4}$', '$−{3|4}$', '${4|3}$', '$−{4|3}$'],
    [K('Brojilac i imenilac su istog znaka – razlomak je pozitivan: ${12|16}$.'),
     K('NZD$(12, 16) = 4$: ${12 : 4|16 : 4} = {3|4}$.', ['t'])],
    R(g([...traka(16, 12, { w: 8 }), ...traka(4, 3, { w: 8, y: -1.8, b: 2, k: 2, id: 't' })], 280)));

  Z(2, 'Zapiši $−1,75$ kao mešoviti broj.',
    ['$−1{3|4}$', '$−1{1|4}$', '$−{7|5}$', '$−1{3|5}$'],
    [K('$1,75 = 1 + 0,75$, a $0,75 = {75|100} = {3|4}$.'),
     K('Dakle $−1,75 = −1{3|4}$ (minus važi za ceo broj).', ['t'])],
    prava(-2, 0, 4, [[-1.75, '?', 1, { id: 't' }]], [{ tx: '−1,75', at: [-1.75, 0.3], b: 1, vel: 16, k: 2 }], { svaki: 4 }));

  Z(2, 'Zapiši $−2,125$ kao razlomak.',
    ['$−{17|8}$', '$−{21|8}$', '$−{17|4}$', '$−{2125|100}$'],
    [K('$2,125 = 2 + {125|1000} = 2 + {1|8}$.'),
     K('$2{1|8} = {16 + 1|8} = {17|8}$, pa je $−2,125 = −{17|8}$.', ['t'])],
    R(prava(-3, 0, 8, [[-2.125, '−17/8', 1, { id: 't' }]], [], { svaki: 8 })));
  proveri(blizu(-17 / 8, -2.125), '−2,125');

  Z(2, 'Koliko RAZLIČITIH brojeva je zapisano u nizu: $−{3|5}$, ${6|−10}$, $−0,6$, ${−9|−15}$, $0,6$?',
    ['$2$', '$3$', '$1$', '$5$'],
    [K('$−{3|5} = −0,6$; ${6|−10} = −{3|5} = −0,6$; $−0,6$ – sva tri su isti broj.', ['a']),
     K('${−9|−15} = {9|15} = {3|5} = 0,6$, isto kao poslednji. Različita su samo dva broja: $−0,6$ i $0,6$.', ['b'])],
    R(prava(-1, 1, 5, [[-0.6, '−0,6 (×3)', 1, { id: 'a' }], [0.6, '0,6 (×2)', 2, { id: 'b' }]], [], { svaki: 5 })));
  proveri(blizu(-3 / 5, 6 / -10) && blizu(-9 / -15, 0.6), 'isti brojevi');

  Z(2, 'Proširi razlomak ${7|−4}$ do imenioca $100$ (po apsolutnoj vrednosti) i zapiši ga decimalno.',
    ['$−1,75$', '$−1,74$', '$−0,175$', '$−17,5$'],
    [K('${7|−4} = −{7|4} = −{7 · 25|4 · 25} = −{175|100}$.'),
     K('$−{175|100} = −1,75$.', ['t'])],
    R(prava(-2, 0, 4, [[-1.75, '−1,75', 1, { id: 't' }]], [], { svaki: 4 })));

  Z(3, 'Koji razlomak ima decimalni zapis $−0,1666…$ (šestica se ponavlja)?',
    ['$−{1|6}$', '$−{1|16}$', '$−{16|100}$', '$−{1|3}$'],
    [K('Probamo ${1|6}$: delimo $1 : 6 = 0,1666…$ – posle prve cifre ostatak je stalno $4$, pa se šestica ponavlja.'),
     K('Dakle $−0,1666… = −{1|6}$. (${16|100} = 0,16$ je konačan zapis – manji broj.)', ['t'])],
    g([...traka(6, 1, { w: 9, k: 1, id: 't' }), ...traka(100, 16, { w: 9, y: -1.6, b: 2, h: 1 })], 300));
  proveri(blizu(1 / 6, 0.16666666666666666) && 16 / 100 < 1 / 6, '1/6');

  Z(3, 'Brojilac razlomka je $−14$, a vrednost razlomka je $3,5$. Koliki je imenilac?',
    ['$−4$', '$4$', '$−49$', '$−{1|4}$'],
    [K('Razlomak je pozitivan, a brojilac negativan – imenilac mora biti negativan.'),
     K('$14 : 3,5 = 4$, pa je imenilac $−4$. Provera: ${−14|−4} = {14|4} = 3,5$ ✓', ['d'])],
    R(g([...nadovezi([[[3.5, 1, '3,5', { id: 'd' }], [3.5, 2, '3,5', { id: 'd' }], [3.5, 1, '3,5', { id: 'd' }], [3.5, 2, '3,5', { id: 'd' }]]], { jed: 0.8 }), { lin: [[0, -0.4], [11.2, -0.4]], b: 4, debljina: 2 }, { tx: '14', at: [5.6, -0.9], vel: 16 }], 300)));
  proveri(blizu(-14 / -4, 3.5), '−14/−4');

  Z(3, 'Koliki je zbir svih celih brojeva $n$ za koje je razlomak ${12|n}$ ceo NEGATIVAN broj?',
    ['$−28$', '$−16$', '$28$', '$−27$'],
    [K('${12|n}$ je ceo kad je $n$ delilac broja $12$, a negativan kad je $n < 0$.'),
     K('Negativni delioci broja $12$: $−1, −2, −3, −4, −6, −12$.', ['d']),
     K('Zbir: $−(1 + 2 + 3 + 4 + 6 + 12) = −28$.')],
    R(prava(-13, 0, 1, [-1, -2, -3, -4, -6, -12].map((x) => [x, String(x).replace('-', '−'), 1, { id: 'd' }]), [], { svaki: 1 })));
  proveri([-1, -2, -3, -4, -6, -12].reduce((a, b) => a + b, 0) === -28, 'zbir delilaca');

  // ════════════════ 3.3 Apsolutna vrednost i upoređivanje ════════════════
  L('Apsolutna vrednost i upoređivanje racionalnih brojeva');

  Z(1, 'Izračunaj: $\\|−{7|3}\\| − \\|{1|3}\\|$.',
    ['$2$', '$−{8|3}$', '$−2$', '${8|3}$'],
    [K('$\\|−{7|3}\\| = {7|3}$ – rastojanje tačke $−{7|3}$ od nule.', ['a']),
     K('$\\|{1|3}\\| = {1|3}$, pa je ${7|3} − {1|3} = {6|3} = 2$.', ['b'])],
    prava(-3, 1, 3, [[-7 / 3, '−7/3'], [1 / 3, '1/3', 2]], [...raz(-7 / 3, 0, '7/3', -3, 1, { boja: 1, k: 1, id: 'a' }), ...raz(0, 1 / 3, '1/3', -3, 1, { k: 2, id: 'b' })]));

  Z(1, 'Poređaj od najmanjeg do najvećeg: $−0,7$, $−{3|4}$, $−{2|3}$.',
    ['$−{3|4} < −0,7 < −{2|3}$', '$−{2|3} < −0,7 < −{3|4}$', '$−0,7 < −{3|4} < −{2|3}$', '$−{3|4} < −{2|3} < −0,7$'],
    [K('Decimalno: $−{3|4} = −0,75$, $−{2|3} ≈ −0,67$.'),
     K('Od negativnih manji je onaj dalji od nule: $−0,75 < −0,7 < −0,67$.', ['t'])],
    R(prava(-0.8, -0.6, 100, [[-0.75, '−3/4', 1, { id: 't' }], [-0.7, '−0,7', 2, { id: 't', visina: 2 }], [-2 / 3, '−2/3', 3, { id: 't' }]], [], { svaki: 10 })));
  proveri(-3 / 4 < -0.7 && -0.7 < -2 / 3, 'poredak');

  Z(1, 'Koji znak treba staviti umesto kvadratića: $−{5|6}$ ☐ $−{4|5}$?',
    ['$<$', '$>$', '$=$', 'ne može se odrediti'],
    [K('Uporedimo apsolutne vrednosti unakrsno: $5 · 5 = 25$ i $4 · 6 = 24$, pa je ${5|6} > {4|5}$.'),
     K('Kod negativnih je obrnuto: veća apsolutna vrednost – manji broj. $−{5|6} < −{4|5}$.', ['t'])],
    R(prava(-1, -0.6, 30, [[-5 / 6, '−5/6', 1, { id: 't' }], [-0.8, '−4/5', 2, { visina: 2 }]], [], { svaki: 30 })));
  proveri(-5 / 6 < -4 / 5, '−5/6 < −4/5');

  Z(2, 'Koliko celih brojeva $x$ zadovoljava uslov $\\|x\\| < {17|4}$?',
    ['$9$', '$8$', '$4$', '$10$'],
    [K('${17|4} = 4{1|4}$. Tražimo cele brojeve udaljene od nule manje od $4{1|4}$.', ['g']),
     K('To su $−4, −3, …, 3, 4$: četiri negativna, nula i četiri pozitivna – ukupno $9$.', ['c'])],
    prava(-5, 5, 4, [...[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((x) => [x, '', 1, { k: 2, id: 'c' }])], [{ lin: [[-4.25, 0], [4.25, 0]], b: 2, debljina: 5, k: 1, id: 'g' }], { svaki: 4 }));
  proveri([...Array(11)].map((_, i) => i - 5).filter((x) => Math.abs(x) < 17 / 4).length === 9, '|x| < 17/4');

  Z(2, 'Koji je najveći ceo broj manji od $−{13|4}$?',
    ['$−4$', '$−3$', '$−5$', '$3$'],
    [K('$−{13|4} = −3{1|4}$ – između $−4$ i $−3$.', ['t']),
     K('Manji brojevi su levo. Prvi ceo broj levo od $−3{1|4}$ je $−4$.', ['c'])],
    prava(-5, -2, 4, [[-3.25, '−13/4', 2, { k: 1, id: 't' }], [-4, '', 1, { k: 2, id: 'c' }]], [sk(-3.25, -4, -5, -2, { ispod: true, k: 2, id: 'c' })], { svaki: 4 }));

  Z(2, 'Koji je broj veći: $−{7|9}$ ili $−{11|14}$?',
    ['$−{7|9}$', '$−{11|14}$', 'jednaki su', 'ne može se odrediti'],
    [K('Unakrsno za apsolutne vrednosti: $7 · 14 = 98$ i $11 · 9 = 99$, pa je ${7|9} < {11|14}$.'),
     K('Manja apsolutna vrednost – broj bliži nuli – veći broj: $−{7|9} > −{11|14}$.', ['t'])],
    R(prava(-0.8, -0.76, 100, [[-7 / 9, '−7/9', 1, { id: 't' }], [-11 / 14, '−11/14', 2, { visina: 2.2 }]], [], { svaki: 1 })));
  proveri(-7 / 9 > -11 / 14 && 7 * 14 === 98 && 11 * 9 === 99, '−7/9 > −11/14');

  Z(2, 'Koliko ima racionalnih brojeva $x$ sa imeniocem $6$ (brojilac ceo) za koje je $\\|x\\| < {1|2}$?',
    ['$5$', '$3$', '$6$', '$2$'],
    [K('${1|2} = {3|6}$, pa brojilac mora imati apsolutnu vrednost manju od $3$.', ['g']),
     K('Brojioci $−2, −1, 0, 1, 2$: brojevi $−{2|6}, −{1|6}, 0, {1|6}, {2|6}$ – njih $5$.', ['c'])],
    prava(-1, 1, 6, [-2, -1, 0, 1, 2].map((m) => [m / 6, '', 1, { k: 2, id: 'c' }]), [{ lin: [[-0.5, 0], [0.5, 0]], b: 2, debljina: 5, k: 1, id: 'g' }, { tx: '○', at: [-0.5, 0], b: 2, vel: 18, k: 1 }, { tx: '○', at: [0.5, 0], b: 2, vel: 18, k: 1 }], { svaki: 6 }));

  Z(3, 'Koliko prirodnih brojeva $n$ zadovoljava ${3|7} < {n|5} < 2$?',
    ['$7$', '$6$', '$8$', '$9$'],
    [K('${n|5} < 2$ znači $n < 10$.'),
     K('${3|7} < {n|5}$ unakrsno: $15 < 7n$, pa je $n ≥ 3$ (za $n = 2$: $14 < 15$).'),
     K('$n ∈ \\{3, 4, 5, 6, 7, 8, 9\\}$ – ukupno $7$ brojeva.', ['c'])],
    R(prava(0, 2.2, 5, [3, 4, 5, 6, 7, 8, 9].map((n) => [n / 5, '', 1, { id: 'c' }]), [{ tx: '3/7', at: [3 / 7, 0.32], b: 2, vel: 14 }, { tx: '|', at: [3 / 7, -0.02], b: 2, vel: 20 }], { svaki: 5 })));
  proveri([...Array(20)].map((_, i) => i + 1).filter((n) => 3 / 7 < n / 5 && n / 5 < 2).length === 7, '3/7 < n/5 < 2');

  Z(3, 'Dati su $a = −{2|3}$, $b = −0,7$ i $c = −{5|8}$. Koji je poredak tačan?',
    ['$b < a < c$', '$c < a < b$', '$a < b < c$', '$b < c < a$'],
    [K('Apsolutne vrednosti: $\\|a\\| ≈ 0,667$, $\\|b\\| = 0,7$, $\\|c\\| = 0,625$.'),
     K('Najdalje od nule je $b$ – on je najmanji; najbliže je $c$ – on je najveći: $b < a < c$.', ['t'])],
    R(prava(-0.75, -0.55, 100, [[-0.7, 'b', 1, { id: 't' }], [-2 / 3, 'a', 2, { id: 't' }], [-0.625, 'c', 3, { id: 't' }]], [], { svaki: 5 })));
  proveri(-0.7 < -2 / 3 && -2 / 3 < -5 / 8, 'b < a < c');

  Z(3, 'Za broj $x$ važi $\\|x\\| = {5|4}$ i $x < 0$, a za broj $y$ važi $\\|y\\| = {3|2}$ i $y > 0$. Koliko je rastojanje između tačaka $x$ i $y$?',
    ['${11|4}$', '${1|4}$', '$−{1|4}$', '${8|6}$'],
    [K('$x = −{5|4}$ (levo od nule), $y = {3|2}$ (desno od nule).', ['t']),
     K('Tačke su sa različitih strana nule, pa se rastojanja od nule sabiraju: ${5|4} + {3|2} = {5|4} + {6|4} = {11|4}$.', ['d'])],
    prava(-2, 2, 4, [[-1.25, 'x', 1, { k: 1, id: 't' }], [1.5, 'y', 2, { k: 1, id: 't' }]], raz(-1.25, 1.5, '11/4', -2, 2, { boja: 3, k: 2, id: 'd' }), { svaki: 4 }));
  proveri(je(zb(F(5, 4), F(3, 2)), F(11, 4)), 'rastojanje 11/4');

  // ════════════════ 3.4 Sabiranje i oduzimanje racionalnih brojeva ════════════════
  L('Sabiranje i oduzimanje racionalnih brojeva');

  Z(1, 'Izračunaj: $−{3|8} + {5|8}$.',
    ['${1|4}$', '$−{1|4}$', '$1$', '${1|8}$'],
    [K('Isti imenilac: ${−3 + 5|8} = {2|8}$.', ['s']),
     K('Skratimo: ${2|8} = {1|4}$.')],
    prava(-1, 1, 8, [[-0.375, '−3/8'], [0.25, '1/4', 2, { k: 2 }]], [sk(-0.375, 0.25, -1, 1, { k: 1, id: 's' })], { svaki: 8 }));
  proveri(je(zb(F(-3, 8), F(5, 8)), F(1, 4)), '−3/8 + 5/8');

  Z(1, 'Izračunaj: ${2|3} − {5|6}$.',
    ['$−{1|6}$', '${1|6}$', '$−1$', '$−{3|6}$'],
    [K('Svedemo na šestine: ${2|3} = {4|6}$.'),
     K('${4|6} − {5|6} = −{1|6}$ – oduzeli smo veći broj, pa je razlika negativna.', ['s'])],
    prava(-0.5, 1, 6, [[2 / 3, '2/3'], [-1 / 6, '−1/6', 2, { k: 2 }]], [sk(2 / 3, -1 / 6, -0.5, 1, { boja: 2, ispod: true, k: 2, id: 's' })], { svaki: 6 }));
  proveri(je(ra(F(2, 3), F(5, 6)), F(-1, 6)), '2/3 − 5/6');

  Z(1, 'Izračunaj: $−1,2 − 0,35$.',
    ['$−1,55$', '$−0,85$', '$0,85$', '$−1,47$'],
    [K('Oduzimanje pozitivnog broja – pomeramo se ulevo.'),
     K('Oba broja „vuku“ ulevo, pa se apsolutne vrednosti sabiraju: $1,2 + 0,35 = 1,55$; rezultat $−1,55$.', ['s'])],
    prava(-2, 0, 20, [[-1.2, '−1,2'], [-1.55, '−1,55', 2, { k: 2, visina: 2 }]], [sk(-1.2, -1.55, -2, 0, { boja: 2, ispod: true, k: 2, id: 's' })], { svaki: 10 }));
  proveri(blizu(-1.2 - 0.35, -1.55), '−1,2 − 0,35');

  Z(2, 'Izračunaj: $1{3|4} − 2{1|6}$.',
    ['$−{5|12}$', '${5|12}$', '$−1{5|12}$', '$−{1|2}$'],
    [K('Pretvorimo u razlomke: $1{3|4} = {7|4}$, $2{1|6} = {13|6}$.'),
     K('NZS$(4, 6) = 12$: ${21|12} − {26|12} = −{5|12}$.', ['s'])],
    prava(-1, 2.5, 12, [[1.75, '1 3/4'], [-5 / 12, '−5/12', 2, { k: 2 }]], [sk(1.75, -5 / 12, -1, 2.5, { boja: 2, ispod: true, k: 2, id: 's' })], { svaki: 12 }));
  proveri(je(ra(F(7, 4), F(13, 6)), F(-5, 12)), '1 3/4 − 2 1/6');

  Z(2, 'Izračunaj: $−{3|4} + {1|2} − {1|8}$.',
    ['$−{3|8}$', '$−{5|8}$', '${1|8}$', '$−{1|8}$'],
    [K('Sve u osmine: $−{6|8} + {4|8} − {1|8}$.'),
     K('$−6 + 4 = −2$, pa $−2 − 1 = −3$: rezultat $−{3|8}$.', ['s1', 's2'])],
    prava(-1, 0.25, 8, [[-0.75, '−3/4'], [-0.375, '−3/8', 2, { k: 2, visina: 2 }]], [sk(-0.75, -0.25, -1, 0.25, { k: 1, id: 's1' }), sk(-0.25, -0.375, -1, 0.25, { boja: 2, ispod: true, k: 2, id: 's2' })], { svaki: 8 }));
  proveri(je(zb(F(-3, 4), F(1, 2), F(-1, 8)), F(-3, 8)), 'tri sabirka');

  Z(2, 'Ujutru je bilo $−4,5 °C$. Do podneva je toplota porasla na $3 °C$, a do večeri je pala za $6,5 °C$. Kolika je temperatura uveče?',
    ['$−3,5 °C$', '$−1,5 °C$', '$3,5 °C$', '$−8 °C$'],
    [K('Podatak „ujutru $−4,5 °C$“ nam ne treba – važi samo podnevna temperatura.'),
     K('$3 − 6,5 = −3,5$, pa je uveče $−3,5 °C$.', ['v'])],
    G(O, [...termometar(-4.5, { od: -10, doo: 10, korak: 5, x: 0 }), { tx: '~jutro', at: [0.4, 2.1], vel: 14 }, ...termometar(3, { od: -10, doo: 10, korak: 5, x: 3.2, b: 2 }), { tx: '~podne', at: [3.6, 2.1], b: 2, vel: 14 }, ...termometar(-3.5, { od: -10, doo: 10, korak: 5, x: 6.4, b: 0, k: 2, id: 'v' }), { tx: '~veče', at: [6.8, 2.1], b: 0, vel: 14, k: 2 }], { ...bez, velicina: 260 }));
  proveri(blizu(3 - 6.5, -3.5), 'temperatura');

  Z(2, 'Koliko je rastojanje između tačaka koje odgovaraju brojevima $−{5|3}$ i ${3|4}$?',
    ['${29|12}$', '${11|12}$', '$−{11|12}$', '${8|7}$'],
    [K('Rastojanje je razlika većeg i manjeg broja: ${3|4} − (−{5|3}) = {3|4} + {5|3}$.', ['d']),
     K('${9|12} + {20|12} = {29|12} = 2{5|12}$.')],
    prava(-2, 1, 12, [[-5 / 3, '−5/3'], [0.75, '3/4', 2]], raz(-5 / 3, 0.75, '?', -2, 1, { boja: 3, k: 1, id: 'd' }), { svaki: 12 }));
  proveri(je(ra(F(3, 4), F(-5, 3)), F(29, 12)), 'rastojanje 29/12');

  Z(3, 'Podmornica je na dubini $35,6 m$ (visina $−35,6 m$). Izroni $12,8 m$, pa se spusti $4,25 m$. Na kojoj je visini sada?',
    ['$−27,05 m$', '$−18,55 m$', '$−52,65 m$', '$−44,15 m$'],
    [K('Izranjanje je pomeranje naviše (sabiramo): $−35,6 + 12,8 = −22,8$.', ['a']),
     K('Spuštanje je pomeranje naniže (oduzimamo): $−22,8 − 4,25 = −27,05$.', ['b'])],
    prava(-40, 0, 1, [[-35.6, '−35,6']], [sk(-35.6, -22.8, -40, 0, { k: 1, id: 'a' }), sk(-22.8, -27.05, -40, 0, { boja: 2, ispod: true, k: 2, id: 'b' }), { tx: '●', at: [-27.05, 0], b: 2, vel: 18, k: 2 }, { tx: '−27,05', at: [-27.05, 3.4], b: 2, vel: 15, k: 2 }], { svaki: 5 }));
  proveri(blizu(-35.6 + 12.8 - 4.25, -27.05), 'podmornica');

  Z(3, 'Izračunaj $p − (q − r)$ za $p = −{1|2}$, $q = {3|4}$ i $r = −0,25$.',
    ['$−{3|2}$', '$−1$', '$0$', '${1|2}$'],
    [K('Zagrada: $q − r = {3|4} − (−{1|4}) = {3|4} + {1|4} = 1$.'),
     K('$p − 1 = −{1|2} − 1 = −{3|2}$. (Ishod $−1$ dobija ko zaboravi da je $r$ negativan.)')],
    R(prava(-2, 1, 4, [[-0.5, 'p'], [-1.5, '−3/2', 2]], [sk(-0.5, -1.5, -2, 1, { boja: 2, ispod: true })], { svaki: 4 })));
  proveri(je(ra(F(-1, 2), ra(F(3, 4), F(-1, 4))), F(-3, 2)), 'p − (q − r)');

  Z(3, 'Jovana je imala $2,4 kg$ brašna. Za kolač je potrošila ${3|4} kg$, a za hleb $1{1|2} kg$. Koliko joj je brašna ostalo?',
    ['$0,15 kg$', '$0,25 kg$', '$1,05 kg$', '$0,9 kg$'],
    [K('U decimalnom zapisu: ${3|4} = 0,75$ i $1{1|2} = 1,5$.'),
     K('Potrošeno: $0,75 + 1,5 = 2,25 kg$.', ['p']),
     K('Ostalo: $2,4 − 2,25 = 0,15 kg$.', ['o'])],
    g(nadovezi([[[2.4, 0, '2,4 kg']], [[0.75, 1, '3/4', { id: 'p' }], [1.5, 2, '1 1/2', { id: 'p' }], [0.15, 3, '', { k: 2, id: 'o' }]]]), 320));
  proveri(blizu(2.4 - 0.75 - 1.5, 0.15), 'brašno');

  // ════════════════ 3.5 Množenje racionalnih brojeva ════════════════
  L('Množenje racionalnih brojeva');

  Z(1, 'Izračunaj: ${3|4} · {2|5}$.',
    ['${3|10}$', '${6|9}$', '${5|20}$', '${15|8}$'],
    [K('Brojilac puta brojilac, imenilac puta imenilac: ${3 · 2|4 · 5} = {6|20}$.', ['pr']),
     K('Skratimo sa $2$: ${6|20} = {3|10}$.')],
    G({}, pov(3, 4, 2, 5), { velicina: 220 }));
  proveri(je(pr(F(3, 4), F(2, 5)), F(3, 10)), '3/4 · 2/5');

  Z(1, 'Izračunaj: $(−5) · {3|10}$.',
    ['$−{3|2}$', '$−{15|50}$', '${3|2}$', '$−{1|2}$'],
    [K('Jedan činilac je negativan – proizvod je negativan.'),
     K('$5 · {3|10} = {15|10} = {3|2}$; pet skokova po ${3|10}$ ulevo stiže do $−{3|2}$.', ['s'])],
    prava(-2, 0.5, 10, [[0, '0', 2]], niz(0, -0.3, 5, -2, 0.5, { k: 2, id: 's', razmak: 0.4 }), { svaki: 10 }));
  proveri(je(pr(F(-5), F(3, 10)), F(-3, 2)), '−5 · 3/10');

  Z(1, 'Izračunaj: $(−{2|7}) · (−{7|2})$.',
    ['$1$', '$−1$', '${4|49}$', '$0$'],
    [K('Dva negativna činioca – proizvod je pozitivan.', ['m']),
     K('${2 · 7|7 · 2} = {14|14} = 1$. Brojevi ${2|7}$ i ${7|2}$ su recipročni.')],
    g(cinioci(['−', '−'], { id: 'm' }), 140));

  Z(2, 'Izračunaj: $(−{1|2}) · (−{2|3}) · (−{3|4})$.',
    ['$−{1|4}$', '${1|4}$', '$−{1|24}$', '$−{3|4}$'],
    [K('Tri negativna činioca (neparan broj) – proizvod je negativan.', ['m']),
     K('Skraćivanje „u lancu“: ${1 · 2 · 3|2 · 3 · 4} = {1|4}$, pa je rezultat $−{1|4}$.')],
    g(cinioci(['−', '−', '−'], { id: 'm' }), 200));
  proveri(je(pr(F(-1, 2), F(-2, 3), F(-3, 4)), F(-1, 4)), 'lanac');

  Z(2, 'Izračunaj: $−2{1|3} · 1{1|2}$.',
    ['$−3{1|2}$', '$−2{1|6}$', '$3{1|2}$', '$−{7|6}$'],
    [K('Mešovite brojeve pretvorimo u razlomke: $−{7|3} · {3|2}$.'),
     K('Skratimo $3$ sa $3$: $−{7|2} = −3{1|2}$. (Greška $−2{1|6}$: ne množe se posebno celi delovi i razlomci!)', ['s'])],
    R(prava(-4, 0.5, 6, [[-7 / 3, '−7/3'], [-3.5, '−3 1/2', 2, { id: 's', visina: 2.2 }]], [sk(0, -7 / 3, -4, 0.5, { ispod: true }), sk(-7 / 3, -3.5, -4, 0.5, { boja: 2, ispod: true, kasni: 1, id: 's' }), { tx: '~još pola', at: [-2.9, -0.75], b: 2, vel: 13 }], { svaki: 6 })));
  proveri(je(pr(F(-7, 3), F(3, 2)), F(-7, 2)), 'mešoviti');

  Z(2, 'Izračunaj: $−{3|4} · ({8|9} − {4|3})$.',
    ['${1|3}$', '$−{1|3}$', '$−{5|3}$', '${1|6}$'],
    [K('Zagrada: ${8|9} − {12|9} = −{4|9}$.'),
     K('$−{3|4} · (−{4|9}) = {12|36} = {1|3}$ – dva minusa daju plus.', ['p'])],
    R(prava(-1, 1.5, 9, [[8 / 9, '8/9'], [-4 / 9, '−4/9', 2], [1 / 3, '1/3', 3, { id: 'p', visina: 2.2 }]], [sk(8 / 9, -4 / 9, -1, 1.5, { boja: 2, ispod: true }), sk(-4 / 9, 1 / 3, -1, 1.5, { boja: 3, kasni: 1.2, id: 'p' })], { svaki: 9 })));
  proveri(je(pr(F(-3, 4), ra(F(8, 9), F(4, 3))), F(1, 3)), 'distributivnost');

  Z(2, 'Izračunaj vrednost izraza $−{3|5}x + {1|2}$ za $x = −{5|6}$.',
    ['$1$', '$0$', '$−{1|2}$', '${3|2}$'],
    [K('$−{3|5} · (−{5|6}) = {15|30} = {1|2}$.'),
     K('${1|2} + {1|2} = 1$.')],
    prava(-1, 1.5, 6, [[-5 / 6, 'x']], [], { svaki: 6 }));
  proveri(je(zb(pr(F(-3, 5), F(-5, 6)), F(1, 2)), F(1)), 'izraz sa x');

  Z(2, 'Pravougaona leja ima stranice ${3|4} m$ i ${2|3} m$. Kolika joj je površina?',
    ['${1|2} m^{2}$', '${5|7} m^{2}$', '${17|12} m^{2}$', '${6|7} m^{2}$'],
    [K('Površina pravougaonika: $P = a · b = {3|4} · {2|3}$.'),
     K('${6|12} = {1|2} m^{2}$ – tamni deo je pola kvadrata od $1 m^{2}$.', ['pr'])],
    G({}, pov(3, 4, 2, 3, { k: 2 }), { velicina: 220 }));
  proveri(je(pr(F(3, 4), F(2, 3)), F(1, 2)), 'leja');

  Z(3, 'Temperatura je $2 °C$ i svakog sata pada za $0,75 °C$. Kolika će biti posle $6$ sati?',
    ['$−2,5 °C$', '$6,5 °C$', '$−4,5 °C$', '$2,5 °C$'],
    [K('Promena za $6$ sati: $6 · (−0,75) = −4,5 °C$.'),
     K('$2 + (−4,5) = −2,5 °C$.', ['v'])],
    G(O, [...termometar(2, { od: -5, doo: 5, korak: 5, x: 0 }), { tx: '~sada', at: [0.4, 1.4], vel: 14 }, ...termometar(-2.5, { od: -5, doo: 5, korak: 5, x: 3.2, b: 2, k: 2, id: 'v' }), { tx: '~posle 6 h', at: [3.6, 1.4], b: 2, vel: 14, k: 2 }], { ...bez, velicina: 240 }));
  proveri(blizu(2 + 6 * -0.75, -2.5), 'pad temperature');

  Z(3, 'Izračunaj na lak način: $(−{2|3}) · 27 + (−{2|3}) · (−12)$.',
    ['$−10$', '$10$', '$−26$', '$−6$'],
    [K('Zajednički činilac izvučemo ispred zagrade (distributivnost): $(−{2|3}) · (27 + (−12))$.'),
     K('$27 − 12 = 15$, pa je $(−{2|3}) · 15 = −10$.')],
    R(g([{ lin: [[0, 0], [5.4, 0], [5.4, 1.4], [0, 1.4]], zatv: 1, b: 1, gusto: 1 }, { lin: [[3, 0], [5.4, 0], [5.4, 1.4], [3, 1.4]], zatv: 1, b: 4, prazno: 1, isp: 1 }, { tx: '27', at: [2.7, -0.45], vel: 16 }, { tx: '−12', at: [4.2, 0.7], vel: 16, b: 4 }, { tx: '15', at: [1.5, 0.7], vel: 18 }, { tx: '· (−2/3)', at: [6.8, 0.7], vel: 16, b: 1 }], 300)));
  proveri(je(zb(pr(F(-2, 3), F(27)), pr(F(-2, 3), F(-12))), F(-10)), 'na lak način');
};
