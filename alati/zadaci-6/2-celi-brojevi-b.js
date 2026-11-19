// Tema 1 (drugi deo): Celi brojevi – oduzimanje, izrazi sa zagradama, množenje i deljenje (lekcije 1.5–1.8)
// Pomoćni crteži ovog dela (crtezi) koristi i teorija: alati/matematika-teorija-6/2-celi-brojevi-b.js

// ── pomoćni crteži (elementi bez imenovanih tačaka, osim ose odraza M, N) ──
function crtezi(A) {
  const { G, O, bez, r, skok } = A;
  const m = (x) => (x < 0 ? '−' + Math.abs(x) : String(x)); // broj sa pravim minusom
  // nevidljiv okvir: crtež samo od teksta inače nema širinu (tekst je u pikselima)
  const okvir = (x0, y0, x1, y1) => ({ lin: [[x0, y0], [x1, y1]], b: 4, debljina: 0.01 });
  // redovi teksta jedan ispod drugog (preobražaj izraza korak po korak): redovi = [[tekst, boja, k], …]
  const redovi = (lista, { sirina = 12, vel = 22, velicina = 300 } = {}) => G(O, [okvir(-sirina / 2, 0.6, sirina / 2, -1.4 * lista.length + 0.4),
    ...lista.map(([t, b, k], i) => ({ tx: t, at: [0, r(-1.4 * i)], vel, ...(b !== undefined ? { b } : {}), ...(k ? { k } : {}) }))], { ...bez, velicina });
  const tacka = (v, natpis, b = 1, dod = {}) => [{ tx: '●', at: [r(v), 0.02], b, ...dod }, ...(natpis ? [{ tx: natpis, at: [r(v), 0.62], b, vel: 17, ...dod }] : [])];

  // brojevna prava sa skokovima: skokovi = [[od, do, { boja, o, ispod, k, id, kasni }], …], tacke = [[v, natpis, boja, dod], …]
  function prava(od, doo, skokovi = [], tacke = [], { podela = 1, svaki, velicina = 320, e = [], t = {}, bezImena = [] } = {}) {
    const el = [{ osa: [od, doo], podela, ...(svaki ? { svaki } : {}) }];
    skokovi.forEach(([a, b, x = {}], i) => el.push(skok(a, b, { kasni: 0.3 + i * 0.8, ...x })));
    for (const [v, natpis, b, dod] of tacke) el.push(...tacka(v, natpis, b, dod));
    return G({ ...O, ...t }, [...el, ...e], { bezImena: ['O', ...bezImena], velicina });
  }
  // niz jednakih skokova od 0 (množenje kao ponovljeno sabiranje): n skokova po korak
  const nizSkokova = (n, korak, x = {}) => Array.from({ length: n }, (_, i) => [i * korak, (i + 1) * korak, { kasni: 0.3 + i * 0.6, ...x }]);

  // zgrada sa spratovima min..max (podzemni smeđi), istaknuti spratovi: { sprat: boja }, strelica od → do
  function zgrada(min, max, { istakni = {}, od, doo, k, natpisi = true, velicina = 220 } = {}) {
    const e = [];
    const h = 1;
    for (let s = min; s <= max; s++) {
      const y = s * h;
      const b = istakni[s] !== undefined ? istakni[s] : s < 0 ? 5 : 0;
      e.push({ lin: [[0, y], [3, y], [3, y + h * 0.9], [0, y + h * 0.9]].map((p) => p.map(r)), zatv: 1, b, ...(istakni[s] !== undefined ? { gusto: 1 } : {}) });
      if (natpisi) e.push({ tx: m(s), at: [-0.9, r(y + 0.3)] });
    }
    e.push({ lin: [[-1.6, -0.05], [4.6, -0.05]], b: 2, debljina: 3 }); // tlo
    if (od !== undefined && doo !== undefined) e.push({ lin: [[3.8, r(od + 0.45)], [3.8, r(doo + 0.45)]], str: 1, b: 1, debljina: 3, crtaj: 1, id: 's', ...(k !== undefined ? { k } : {}) });
    return G(O, e, { ...bez, velicina });
  }

  // stablo izraza: cvor = broj ili [znak, levo, desno]; vrednosti (od koraka k) se ispisuju ispod znaka.
  // Listovi su beli, znaci operacija u boji; id unutrašnjih čvorova: 'c0', 'c1', … (redom računanja – prvo dublji)
  function stablo(koren, { dx = 2.4, dy = 1.8, k, vrednosti = true, velicina = 300, x0 = 0 } = {}) {
    const e = [];
    const red = [];
    const vr = (c) => (Array.isArray(c) ? racun(c[0], vr(c[1]), vr(c[2])) : c);
    const sirina = (c) => (Array.isArray(c) ? sirina(c[1]) + sirina(c[2]) : 1);
    function crtaj(c, x, y, s) {
      if (!Array.isArray(c)) { e.push({ tx: m(c), at: [r(x), r(y)], vel: 18 }); return; }
      const [op, l, d] = c;
      const sl = sirina(l), sd = sirina(d);
      const xl = x - (sd * s) / 2, xd = x + (sl * s) / 2;
      e.push({ lin: [[r(x), r(y - 0.3)], [r(xl), r(y - dy + 0.45)]], b: 4, debljina: 1.5 });
      e.push({ lin: [[r(x), r(y - 0.3)], [r(xd), r(y - dy + 0.45)]], b: 4, debljina: 1.5 });
      crtaj(l, xl, y - dy, s);
      crtaj(d, xd, y - dy, s);
      red.push([c, x, y]);
    }
    crtaj(koren, x0, 0, dx);
    red.forEach(([c, x, y], i) => {
      e.push({ tx: c[0] === '·' ? '•' : c[0], at: [r(x), r(y - (c[0] === ':' ? 0.1 : 0))], b: 1, vel: c[0] === ':' ? 40 : c[0] === '·' ? 26 : 24, id: 'c' + i });
      if (vrednosti) e.push({ tx: '= ' + m(vr(c)), at: [r(x + 1.35), r(y + 0.3)], b: 2, vel: 16, id: 'v' + i, ...(k !== undefined ? { k: typeof k === 'function' ? k(i) : k } : {}) });
    });
    return G(O, e, { ...bez, velicina });
  }
  function racun(op, a, b) {
    if (op === '+') return a + b;
    if (op === '−') return a - b;
    if (op === '·') return a * b;
    if (op === ':') return a / b;
    throw new Error('nepoznat znak ' + op);
  }
  const vrednost = (c) => (Array.isArray(c) ? racun(c[0], vrednost(c[1]), vrednost(c[2])) : c);

  // tablica znakova za množenje/deljenje (op = '·' ili ':'); istakni = [red, kolona] (0 = „+“, 1 = „−“)
  function tablicaZnaka(op = '·', { istakni, k, velicina = 200, sakrij = false } = {}) {
    const e = [];
    const c = (x, y, w = 1.4, h = 1.1, x2 = {}) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((p) => p.map(r)), zatv: 1, ...x2 });
    const zn = ['+', '−'];
    e.push(c(0, 2.2, 1.4, 1.1, { b: 4, gusto: 1 }), { tx: op, at: [0.7, 2.6], vel: 22 });
    for (let i = 0; i < 2; i++) {
      e.push(c(1.4 + i * 1.4, 2.2, 1.4, 1.1, { b: 4, prazno: 1 }), { tx: zn[i], at: [2.1 + i * 1.4, 2.6], vel: 24, b: 3 });
      e.push(c(0, 1.1 - i * 1.1, 1.4, 1.1, { b: 4, prazno: 1 }), { tx: zn[i], at: [0.7, 1.5 - i * 1.1], vel: 24, b: 3 });
    }
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const ist = istakni && istakni[0] === i && istakni[1] === j;
      const res = i === j ? '+' : '−';
      e.push(c(1.4 + j * 1.4, 1.1 - i * 1.1, 1.4, 1.1, { b: sakrij ? (ist ? 3 : 4) : res === '+' ? 2 : 1, ...(sakrij && !ist ? { prazno: 1 } : {}), ...(ist ? { gusto: 1, id: 'ist' } : {}) }));
      if (!sakrij || ist) e.push({ tx: sakrij && ist ? '?' : res, at: [2.1 + j * 1.4, 1.5 - i * 1.1], vel: 24, ...(k !== undefined && ist ? { k } : {}) });
    }
    return G(O, e, { ...bez, velicina });
  }

  // model površine za distributivnost a·(b + c): pravougaonik visine a, širine b i c (jedinice su kvadratići)
  function povrsinaAbc(a, b, c, { k, velicina = 260 } = {}) {
    const e = [];
    const pr = (x, y, w, h, x2) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((p) => p.map(r)), zatv: 1, ...x2 });
    e.push(pr(0, 0, b, a, { b: 0, gusto: 1, id: 'p1', ...(k !== undefined ? { k } : {}) }), pr(b, 0, c, a, { b: 1, gusto: 1, id: 'p2', ...(k !== undefined ? { k } : {}) }));
    for (let x = 1; x < b + c; x++) e.push({ lin: [[x, 0], [x, a]], b: 4, debljina: 0.6 });
    for (let y = 1; y < a; y++) e.push({ lin: [[0, y], [b + c, y]], b: 4, debljina: 0.6 });
    e.push({ tx: String(b), at: [b / 2, -0.6], vel: 17, b: 0 }, { tx: String(c), at: [b + c / 2, -0.6], vel: 17, b: 1 }, { tx: String(a), at: [-0.6, a / 2 - 0.1], vel: 17 });
    return G(O, e, { ...bez, velicina });
  }

  // stubići prihoda (+, zeleno, gore) i rashoda (−, roze, dole): vrednosti = [[natpis, v], …], sk = jedinica po kvadratu
  function bilans(vrednosti, { sk = 1, velicina = 300, k = {}, ids = {}, zbir } = {}) {
    const e = [{ lin: [[-0.3, 0], [vrednosti.length * 2.2 + 0.3, 0]], b: 4, debljina: 2 }];
    vrednosti.forEach(([natpis, v], i) => {
      const x0 = i * 2.2 + 0.3, h = v / sk;
      e.push({ lin: [[x0, 0], [x0 + 1, 0], [x0 + 1, r(h)], [x0, r(h)]], zatv: 1, gusto: 1, b: v >= 0 ? 2 : 1, ...(k[i] !== undefined ? { k: k[i] } : {}), ...(ids[i] ? { id: ids[i] } : {}) });
      e.push({ tx: m(v), at: [x0 + 0.5, r(h + (v >= 0 ? 0.35 : -0.6))], vel: 14, ...(k[i] !== undefined ? { k: k[i] } : {}) });
      e.push({ tx: '~' + natpis, at: [x0 + 0.5, v >= 0 ? -0.55 : 0.35], vel: 12 });
    });
    if (zbir) e.push(zbir);
    return G(O, e, { ...bez, velicina });
  }


  // red činilaca u kućicama: negativni su roze i dobijaju redni broj (brojanje minusa) od koraka k
  function cinioci(lista, { k = 1, velicina = 300, znak = '·' } = {}) {
    const e = [];
    let n = 0;
    lista.forEach((v, i) => {
      const x = i * 1.9;
      e.push({ lin: [[x, 0], [x + 1.4, 0], [x + 1.4, 1.1], [x, 1.1]], zatv: 1, b: v < 0 ? 1 : 0, gusto: v < 0 ? 1 : 0, ...(v < 0 ? { id: 'neg' } : {}) });
      e.push({ tx: m(v), at: [x + 0.7, 0.4], vel: 18 });
      if (i < lista.length - 1) e.push({ tx: znak, at: [x + 1.65, 0.4], vel: 18 });
      if (v < 0) e.push({ tx: String(++n), at: [x + 0.7, -0.6], b: 3, vel: 16, k, id: 'n' });
    });
    return G(O, e, { ...bez, velicina });
  }
  // „mašina“: ulaz → operacije → izlaz (kućice sa strelicama); obrnuto = strelice unazad sa obrnutim operacijama (od koraka k)
  function masina(ulaz, ops, izlaz, { obrnuto, k = 1, velicina = 320 } = {}) {
    const e = [];
    const kut = (x, t, b) => [{ lin: [[x, 0], [x + 1.6, 0], [x + 1.6, 1.1], [x, 1.1]], zatv: 1, b, gusto: 1 }, { tx: t, at: [x + 0.8, 0.4], vel: 18 }];
    const n = ops.length;
    for (let i = 0; i <= n; i++) e.push(...kut(i * 2.6, i === 0 ? ulaz : i === n ? izlaz : '', i === 0 ? 3 : i === n ? 2 : 4));
    ops.forEach((o, i) => {
      const x = (i + 1) * 2.6;
      e.push({ lin: [[x - 0.95, 0.75], [x - 0.05, 0.75]], str: 1, b: 4, debljina: 2 }, { tx: o, at: [x - 0.5, 1.3], vel: 15, b: 2 });
      if (obrnuto) e.push({ lin: [[x - 0.05, 0.3], [x - 0.95, 0.3]], str: 1, b: 1, debljina: 2, k }, { tx: obrnuto[i], at: [x - 0.5, -0.55], vel: 15, b: 1, k });
    });
    return G(O, e, { ...bez, velicina });
  }

  return { okvir, redovi, cinioci, masina, m, prava, nizSkokova, zgrada, stablo, vrednost, tablicaZnaka, povrsinaAbc, bilans, tacka };
}

module.exports = (A) => {
  const { L, Z, K, G, O, bez, r, proveri, termometar, R: RS } = A;
  const { okvir, redovi, cinioci, masina, m, prava, nizSkokova, zgrada, stablo, vrednost, tablicaZnaka, povrsinaAbc, bilans } = crtezi(A);
  const term = (t, x = {}) => G(O, termometar(t, x), { ...bez, velicina: 200 });
  const dvaTerm = (t1, t2, x = {}) => G(O, [...termometar(t1, { b: 0, ...x }), ...termometar(t2, { x: 3.2, b: 1, ...x })], { ...bez, velicina: 240 });

  // ════════════════ 1.5 Oduzimanje celih brojeva ════════════════
  L('Oduzimanje celih brojeva');

  Z(1, 'Izračunaj: $5 − 9$.',
    ['$−4$', '$4$', '$−14$', '$14$'],
    [K('Oduzeti $9$ znači sabrati suprotan broj: $5 − 9 = 5 + (−9)$.'),
     K('Na brojevnoj pravoj od $5$ skočimo $9$ mesta ulevo i stižemo do $−4$.', ['s']),
     K('$5 − 9 = −4$')],
    RS(prava(-6, 7, [[5, -4, { id: 's', o: '−9', k: 1 }]], [[5, '5', 0], [-4, '−4', 1, { k: 2 }]])));
  proveri(5 - 9 === -4, '5 − 9');

  Z(1, 'Izračunaj: $−3 − (−8)$.',
    ['$5$', '$−11$', '$−5$', '$11$'],
    [K('Oduzimanje broja $−8$ je isto što i sabiranje broja $8$: $−3 − (−8) = −3 + 8$.'),
     K('Od $−3$ skočimo $8$ mesta udesno.', ['s']),
     K('$−3 + 8 = 5$')],
    RS(prava(-4, 7, [[-3, 5, { id: 's', o: '+8', k: 1 }]], [[-3, '−3', 0], [5, '5', 1, { k: 2 }]])));
  proveri(-3 - -8 === 5, '−3 − (−8)');

  Z(1, 'Ujutru je bilo $4 °C$, a do večeri se temperatura spustila za $7 °C$. Kolika je bila temperatura uveče?',
    ['$−3 °C$', '$3 °C$', '$−11 °C$', '$11 °C$'],
    [K('Spuštanje za $7$ stepeni je oduzimanje: $4 − 7$.'),
     K('$4 − 7 = 4 + (−7) = −3$', ['t2']),
     K('Uveče je bilo $−3 °C$, tri stepena ispod nule.')],
    RS(G(O, [...termometar(4, { od: -10, doo: 10, korak: 5, b: 0 }), ...termometar(-3, { od: -10, doo: 10, korak: 5, x: 3.2, b: 1, id: 't2', k: 2 })], { ...bez, velicina: 240 })));
  proveri(4 - 7 === -3, '4 − 7');

  Z(1, 'Lift je na $−2$. spratu (garaža), a Mila živi na $5$. spratu. Za koliko spratova lift treba da se popne?',
    ['$7$', '$3$', '$−7$', '$−3$'],
    [K('Razlika je „gde treba“ minus „gde je“: $5 − (−2)$.', ['s']),
     K('$5 − (−2) = 5 + 2 = 7$ spratova.'),
     K('Provera brojanjem: $−2 → −1 → 0 → 1 → 2 → 3 → 4 → 5$ – sedam koraka.')],
    zgrada(-2, 5, { istakni: { [-2]: 1, 5: 2 }, od: -2, doo: 5, k: 1 }));
  proveri(5 - -2 === 7, '5 − (−2)');

  Z(2, 'Izračunaj: $−12 − 15 − (−20)$.',
    ['$−7$', '$−47$', '$23$', '$7$'],
    [K('Svako oduzimanje zamenimo sabiranjem suprotnog broja: $−12 + (−15) + 20$.'),
     K('$−12 + (−15) = −27$', ['s1']),
     K('$−27 + 20 = −7$', ['s2'])],
    RS(prava(-28, -4, [[-12, -27, { id: 's1', o: '−15', k: 1 }], [-27, -7, { id: 's2', k: 2, ispod: true, boja: 2 }]], [[-12, '−12', 0], [-7, '−7', 1, { k: 3 }]], { svaki: 2, velicina: 360 })));
  proveri(-12 - 15 - -20 === -7, '−12 − 15 − (−20)');

  Z(2, 'Najviša tačka nekog ostrva je $87 m$ iznad mora, a ronilac je na dubini od $23 m$ ispod mora. Kolika je visinska razlika između njih?',
    ['$110 m$', '$64 m$', '$−64 m$', '$100 m$'],
    [K('Visinu iznad mora pišemo kao $87$, a dubinu kao $−23$.'),
     K('Razlika: $87 − (−23) = 87 + 23 = 110$.', ['s']),
     K('Između vrha i ronioca je $110 m$.')],
    G(O, [
      { lin: [[-4, 0], [4, 0]], b: 0, debljina: 3 },
      { lin: [[-3, 0], [-1, 4.35], [1.5, 0]], zatv: 1, b: 2, gusto: 1 },
      { lin: [[-4, 0], [4, 0], [4, -2], [-4, -2]], zatv: 1, b: 0 },
      { tx: '87 m', at: [-1, 4.9] }, { tx: '🤿', at: [2.8, -1.15], vel: 22 }, { tx: '−23 m', at: [1.4, -1.15], vel: 14 },
      { lin: [[3.8, -1.15], [3.8, 4.35]], b: 1, str: 1, debljina: 2.5, isp: 1, k: 2, id: 's' },
    ], { ...bez, velicina: 260 }));
  proveri(87 - -23 === 110, '87 − (−23)');

  Z(2, 'Zbir dva cela broja je $3$, a njihova razlika (prvi minus drugi) je $−11$. Koji su to brojevi?',
    ['$−4$ i $7$', '$7$ i $−4$', '$−7$ i $4$', '$4$ i $−7$'],
    [K('Ako saberemo zbir i razliku, drugi broj se poništi: $(a + b) + (a − b) = 2a$.'),
     K('$2a = 3 + (−11) = −8$, pa je $a = −4$.', ['a']),
     K('$b = 3 − (−4) = 7$. Provera: $−4 + 7 = 3$ ✓, $−4 − 7 = −11$ ✓', ['b'])],
    RS(prava(-6, 9, [[0, -4, { id: 'a', k: 2, boja: 1 }], [0, 7, { id: 'b', k: 3, boja: 2, ispod: true }]], [[-4, 'a', 1, { k: 2 }], [7, 'b', 2, { k: 3 }]])));
  proveri(-4 + 7 === 3 && -4 - 7 === -11, 'zbir i razlika');

  Z(2, 'Koliko je $|−6 − 9| − |−6| − |9|$?',
    ['$0$', '$−30$', '$30$', '$6$'],
    [K('$−6 − 9 = −15$, pa je $|−15| = 15$.', ['s']),
     K('$|−6| = 6$, $|9| = 9$.'),
     K('$15 − 6 − 9 = 0$. (Kad su oba broja istog znaka, rastojanje se sabira.)')],
    RS(prava(-16, 1, [[-6, -15, { id: 's', o: '−9', k: 1 }]], [[0, '0', 0], [-6, '−6', 0], [-15, '−15', 1, { k: 1 }]], { svaki: 3 })));
  proveri(Math.abs(-6 - 9) - 6 - 9 === 0, '|−15| − 6 − 9');

  Z(3, 'Na računu je bilo $−350$ dinara (dug). Posle dve uplate stanje je $+420$ dinara. Prva uplata je bila $500$ dinara. Kolika je bila druga?',
    ['$270$ dinara', '$770$ dinara', '$570$ dinara', '$420$ dinara'],
    [K('Ukupno uplaćeno = novo stanje − staro stanje: $420 − (−350) = 770$ dinara.', ['p']),
     K('Druga uplata: $770 − 500 = 270$ dinara.'),
     K('Provera: $−350 + 500 + 270 = 420$ ✓')],
    RS(bilans([['staro', -350], ['1. uplata', 500], ['2. uplata', 270], ['novo', 420]], { sk: 100, k: { 2: 2 }, ids: { 0: 'p', 3: 'p' } })));
  proveri(420 - -350 === 770 && 770 - 500 === 270 && -350 + 500 + 270 === 420, 'uplate');

  Z(3, 'Koliko je $(−1) − (−2) − (−3) − (−4) − … − (−10)$?',
    ['$53$', '$−55$', '$55$', '$−53$'],
    [K('Oduzimanje negativnog broja je sabiranje: $−1 + 2 + 3 + … + 10$.'),
     K('$2 + 3 + … + 10 = 55 − 1 = 54$.'),
     K('$−1 + 54 = 53$')],
    RS(redovi([['(−1) − (−2) − (−3) − … − (−10)'], ['−1 + 2 + 3 + … + 10', 2, 1], ['−1 + 54', 3, 2], ['53', 1, 3]], { sirina: 14 })));
  proveri(-1 - -2 - -3 - -4 - -5 - -6 - -7 - -8 - -9 - -10 === 53, 'zbir');

  // ════════════════ 1.6 Izrazi sa zagradama ════════════════
  L('Izrazi sa zagradama');

  const k1 = (i) => i + 1; // vrednost čvora i se vidi od koraka i + 1

  {
    const s = ['−', 14, ['−', 6, 9]];
    proveri(vrednost(s) === 17, '14 − (6 − 9)');
    Z(1, 'Izračunaj: $14 − (6 − 9)$.',
      ['$17$', '$11$', '$−1$', '$29$'],
      [K('Prvo zagrada: $6 − 9 = −3$.', ['c0', 'v0']),
       K('$14 − (−3) = 14 + 3 = 17$', ['c1', 'v1'])],
      stablo(s, { k: k1 }));
  }

  Z(1, 'Oslobodi se zagrada: $a − (b − c)$.',
    ['$a − b + c$', '$a − b − c$', '$a + b − c$', '$a + b + c$'],
    [K('Ispred zagrade je minus: zagradu brišemo, a znake brojeva u njoj menjamo u suprotne.'),
     K('$+b$ postaje $−b$, a $−c$ postaje $+c$: $a − b + c$.')],
    redovi([['a − ( b − c )'], ['a − b + c', 2, 2]], { sirina: 9, vel: 26, velicina: 240 }));

  {
    const s = ['+', ['−', -8, 5], ['−', 3, -4]];
    proveri(vrednost(s) === -6, '(−8 − 5) + (3 − (−4))');
    Z(1, 'Izračunaj: $(−8 − 5) + [3 − (−4)]$.',
      ['$−6$', '$−20$', '$6$', '$−14$'],
      [K('Prva zagrada: $−8 − 5 = −13$.', ['c0', 'v0']),
       K('Druga zagrada: $3 − (−4) = 7$.', ['c1', 'v1']),
       K('$−13 + 7 = −6$', ['c2', 'v2'])],
      stablo(s, { k: k1 }));
  }

  Z(2, 'Izračunaj na najlakši način: $47 − 39 + 53 − 61$.',
    ['$0$', '$−2$', '$200$', '$22$'],
    [K('Grupišemo sabirke koji daju „okrugle“ brojeve: $(47 + 53) − (39 + 61)$.', ['p', 'n']),
     K('$100 − 100 = 0$')],
    G(O, [
      { tx: '47', at: [-3, 1], vel: 24, b: 2, id: 'p' }, { tx: '− 39', at: [-1, 1], vel: 24, b: 1, id: 'n' },
      { tx: '+ 53', at: [1.1, 1], vel: 24, b: 2, id: 'p' }, { tx: '− 61', at: [3.2, 1], vel: 24, b: 1, id: 'n' },
      { tx: '100', at: [-1, -0.6], vel: 22, b: 2, k: 1 }, { tx: '−100', at: [1.6, -0.6], vel: 22, b: 1, k: 1 },
      okvir(-4.2, 1.6, 4.4, -1.2),
    ], { ...bez, velicina: 280 }));
  proveri(47 - 39 + 53 - 61 === 0, '47 − 39 + 53 − 61');

  {
    const s = ['−', 20, ['−', ['−', 7, 12], ['−', -3, 4]]];
    proveri(vrednost(s) === 18, '20 − [(7 − 12) − (−3 − 4)]');
    Z(2, 'Izračunaj: $20 − [(7 − 12) − (−3 − 4)]$.',
      ['$18$', '$22$', '$32$', '$8$'],
      [K('Obične zagrade: $7 − 12 = −5$ i $−3 − 4 = −7$.', ['c0', 'v0', 'c1', 'v1']),
       K('Uglasta zagrada: $−5 − (−7) = −5 + 7 = 2$.', ['c2', 'v2']),
       K('$20 − 2 = 18$', ['c3', 'v3'])],
      stablo(s, { k: (i) => (i < 2 ? 1 : i), dx: 2 }));
  }

  Z(2, 'Oslobodi se zagrada i sredi: $x − (5 − x) + (x − 3)$.',
    ['$3x − 8$', '$x − 8$', '$3x + 2$', '$x − 2$'],
    [K('Ispred prve zagrade je minus: $−(5 − x) = −5 + x$.'),
     K('Ispred druge je plus: $+(x − 3) = x − 3$.'),
     K('$x − 5 + x + x − 3 = 3x − 8$')],
    redovi([['x − ( 5 − x ) + ( x − 3 )'], ['x − 5 + x', 3, 1], ['x − 5 + x + x − 3', 2, 2], ['3x − 8', 1, 3]], { sirina: 13 }));
  proveri([0, 1, 5, -2].every((x) => x - (5 - x) + (x - 3) === 3 * x - 8), '3x − 8');

  Z(2, 'Izračunaj: $1 − 2 + 3 − 4 + 5 − 6 + … + 19 − 20$.',
    ['$−10$', '$10$', '$−20$', '$0$'],
    [K('Grupišemo po dva: $(1 − 2) + (3 − 4) + … + (19 − 20)$.'),
     K('Svaka zagrada je $−1$, a zagrada ima $20 : 2 = 10$.'),
     K('$10 · (−1) = −10$', ['s'])],
    RS(prava(-11, 1, nizSkokova(10, -1, { boja: 1 }).map(([a, b, x]) => [a, b, { ...x, k: 3, id: 's' }]), [[-10, '−10', 1, { k: 3 }]])));
  proveri(Array.from({ length: 20 }, (_, i) => (i % 2 ? -(i + 1) : i + 1)).reduce((a, b) => a + b, 0) === -10, '1 − 2 + … − 20');

  {
    const s = ['−', 30, ['−', -15, ['+', ['−', 8, 21], 6]]];
    proveri(vrednost(s) === 38, '30 − {−15 − [(8 − 21) + 6]}');
    Z(3, 'Izračunaj: $30 − \\{−15 − [(8 − 21) + 6]\\}$.',
      ['$38$', '$22$', '$52$', '$8$'],
      [K('Obična zagrada: $8 − 21 = −13$.', ['c0', 'v0']),
       K('Uglasta: $−13 + 6 = −7$.', ['c1', 'v1']),
       K('Vitičasta: $−15 − (−7) = −15 + 7 = −8$.', ['c2', 'v2']),
       K('$30 − (−8) = 38$', ['c3', 'v3'])],
      stablo(s, { k: k1, dx: 2.1 }));
  }

  Z(3, 'Koliko je $1 − 2 − 3 + 4 + 5 − 6 − 7 + 8 + … + 37 − 38 − 39 + 40$?',
    ['$0$', '$40$', '$−20$', '$20$'],
    [K('Grupišemo po četiri: $(1 − 2 − 3 + 4) + (5 − 6 − 7 + 8) + …$'),
     K('Svaka četvorka je $0$: npr. $5 − 6 − 7 + 8 = 13 − 13 = 0$.'),
     K('Ima $40 : 4 = 10$ četvorki, pa je zbir $0$.')],
    RS(redovi([['( 1 − 2 − 3 + 4 ) = 0', 2, 1], ['( 5 − 6 − 7 + 8 ) = 0', 2, 2], ['…', 4, 2], ['( 37 − 38 − 39 + 40 ) = 0', 2, 3]], { sirina: 13, vel: 20 })));
  {
    let z = 0;
    for (let i = 1; i <= 40; i++) z += [1, -1, -1, 1][(i - 1) % 4] * i;
    proveri(z === 0, 'četvorke');
  }

  Z(3, 'Za koji broj $a$ važi $7 − [a − (3 − a) + 2a] = −10$?',
    ['$a = 5$', '$a = −5$', '$a = 4$', '$a = 3$'],
    [K('Prvo obična zagrada: $a − (3 − a) = a − 3 + a$.'),
     K('Uglasta: $a − 3 + a + 2a = 4a − 3$.'),
     K('$7 − (4a − 3) = 10 − 4a = −10$, pa je $4a = 20$ i $a = 5$.')],
    redovi([['7 − [ a − ( 3 − a ) + 2a ]'], ['7 − [ a − 3 + a + 2a ]', 3, 1], ['7 − ( 4a − 3 )', 2, 2], ['10 − 4a = −10', 1, 3]], { sirina: 13 }));
  proveri(7 - (5 - (3 - 5) + 10) === -10 && ![-5, 4, 3].some((a) => 7 - (a - (3 - a) + 2 * a) === -10), 'a = 5');

  // ════════════════ 1.7 Množenje celih brojeva ════════════════
  L('Množenje celih brojeva');

  Z(1, 'Izračunaj: $4 · (−3)$.',
    ['$−12$', '$12$', '$−7$', '$1$'],
    [K('$4 · (−3)$ znači četiri skoka po $3$ ulevo, od nule.', ['s']),
     K('$(−3) + (−3) + (−3) + (−3) = −12$')],
    RS(prava(-13, 1, nizSkokova(4, -3, { boja: 1, id: 's' }), [[-12, '−12', 1, { k: 2 }]])));
  proveri(4 * -3 === -12, '4 · (−3)');

  Z(1, 'Izračunaj: $(−6) · (−7)$.',
    ['$42$', '$−42$', '$−13$', '$13$'],
    [K('Proizvod dva broja istog znaka je pozitivan.', ['ist']),
     K('$6 · 7 = 42$, pa je $(−6) · (−7) = 42$.')],
    RS(tablicaZnaka('·', { istakni: [1, 1] })));
  proveri(-6 * -7 === 42, '(−6)(−7)');

  Z(1, 'Ronilica se spušta $2 m$ svake minute. Na kojoj je visini (u odnosu na površinu vode) posle $5$ minuta?',
    ['$−10 m$', '$10 m$', '$−7 m$', '$−2 m$'],
    [K('Svake minute promena je $−2 m$.'),
     K('Posle $5$ minuta: $5 · (−2) = −10$.', ['s']),
     K('Ronilica je $10 m$ ispod površine.')],
    RS(prava(-11, 1, nizSkokova(5, -2, { boja: 1, id: 's' }), [[-10, '−10', 1, { k: 2 }]])));
  proveri(5 * -2 === -10, '5 · (−2)');

  Z(2, 'Izračunaj: $(−2) · 5 · (−3) · (−1)$.',
    ['$−30$', '$30$', '$−10$', '$10$'],
    [K('Negativnih činilaca ima tri – neparan broj, pa je proizvod negativan.'),
     K('Apsolutne vrednosti: $2 · 5 · 3 · 1 = 30$.'),
     K('Rezultat: $−30$')],
    cinioci([-2, 5, -3, -1]));
  proveri(-2 * 5 * -3 * -1 === -30, 'proizvod četiri činioca');

  Z(2, 'Izračunaj na lak način: $(−25) · 13 · (−4)$.',
    ['$1300$', '$−1300$', '$130$', '$−130$'],
    [K('Grupišemo: $[(−25) · (−4)] · 13$ (komutativnost i asocijativnost).'),
     K('$(−25) · (−4) = 100$', ['neg']),
     K('$100 · 13 = 1300$')],
    cinioci([-25, 13, -4]));
  proveri(-25 * 13 * -4 === 1300, '(−25)·13·(−4)');

  Z(2, 'Izračunaj: $−7 · 98$ koristeći distributivnost.',
    ['$−686$', '$−714$', '$686$', '$−706$'],
    [K('$98 = 100 − 2$, pa je $−7 · 98 = −7 · (100 − 2)$.'),
     K('$= −7 · 100 − (−7) · 2 = −700 + 14$.'),
     K('$= −686$')],
    RS(redovi([['−7 · 98'], ['−7 · (100 − 2)', 3, 1], ['−700 + 14', 2, 2], ['−686', 1, 3]], { sirina: 9 })));
  proveri(-7 * 98 === -686, '−7 · 98');

  Z(2, 'Tačka $A$ na brojevnoj pravoj odgovara broju $a$. Koliko je $a · (−1)$?',
    ['$6$', '$−6$', '$1$', '$−7$'],
    [K('Tačka $A$ odgovara broju $−6$.'),
     K('Množenje sa $−1$ daje suprotan broj – tačku „presavijemo“ preko nule.', ['o']),
     K('$(−6) · (−1) = 6$')],
    prava(-8, 8, [], [[-6, 'A', 1]], {
      t: { M: [0, -1], N: [0, 1] }, bezImena: ['M', 'N'],
      e: [{ tx: '●', at: [-6, 0.02], b: 2, odrazi: 'MN', k: 2, id: 'o', trajanje: 1.4 }, { d: 'MN', b: 4, isp: 1, k: 2 }],
    }));
  proveri(-6 * -1 === 6, '−(−6)');

  Z(3, 'Proizvod $(−1) · (−2) · (−3) · … · (−9)$ je:',
    ['$−362880$', '$362880$', '$−45$', '$45$'],
    [K('Ima $9$ negativnih činilaca – neparan broj, pa je proizvod negativan.'),
     K('$1 · 2 · 3 · … · 9 = 362880$.'),
     K('Rezultat: $−362880$')],
    cinioci([-1, -2, -3, -4, -5, -6, -7, -8, -9], { velicina: 340 }));
  {
    let p = 1;
    for (let i = 1; i <= 9; i++) p *= -i;
    proveri(p === -362880, '9 činilaca');
  }

  Z(3, 'Proizvod dva cela broja je $−12$, a zbir im je $1$. Koji su to brojevi?',
    ['$4$ i $−3$', '$−4$ i $3$', '$6$ i $−2$', '$−6$ i $2$'],
    [K('Proizvod je negativan, pa su brojevi suprotnih znakova.'),
     K('Parovi sa proizvodom $−12$: $(4, −3)$ ima zbir $1$ ✓; $(−4, 3)$ zbir $−1$; $(6, −2)$ zbir $4$; $(−6, 2)$ zbir $−4$.'),
     K('Traženi brojevi su $4$ i $−3$.')],
    RS(redovi([['4 · (−3)   →   4 + (−3) = 1 ✓', 2], ['(−4) · 3   →   −4 + 3 = −1', 4], ['6 · (−2)   →   6 + (−2) = 4', 4], ['(−6) · 2   →   −6 + 2 = −4', 4]], { sirina: 14, vel: 18 })));
  proveri(4 * -3 === -12 && 4 + -3 === 1, '4 i −3');

  Z(3, 'Prodavnica je u $6$ dana imala dobit od $1500$ dinara dnevno, a u $4$ dana gubitak od $2800$ dinara dnevno. Koliki je ukupan rezultat?',
    ['$−2200$ dinara', '$2200$ dinara', '$−1300$ dinara', '$20200$ dinara'],
    [K('Dobit je pozitivna: $6 · 1500 = 9000$.', ['p']),
     K('Gubitak je negativan: $4 · (−2800) = −11200$.', ['n']),
     K('$9000 + (−11200) = −2200$ – ukupno gubitak od $2200$ dinara.')],
    RS(bilans([['dobit', 9000], ['gubitak', -11200], ['ukupno', -2200]], { sk: 2000, k: { 2: 3 }, ids: { 0: 'p', 1: 'n' } })));
  proveri(6 * 1500 + 4 * -2800 === -2200, 'dobit i gubitak');

  // ════════════════ 1.8 Deljenje celih brojeva ════════════════
  L('Deljenje celih brojeva');

  Z(1, 'Izračunaj: $(−36) : 4$.',
    ['$−9$', '$9$', '$−32$', '$−40$'],
    [K('Deljenik i delilac su suprotnih znakova – količnik je negativan.', ['ist']),
     K('$36 : 4 = 9$, pa je $(−36) : 4 = −9$.'),
     K('Provera: $(−9) · 4 = −36$ ✓')],
    RS(tablicaZnaka(':', { istakni: [1, 0] })));
  proveri(-36 / 4 === -9, '(−36):4');

  Z(1, 'Izračunaj: $(−56) : (−8)$.',
    ['$7$', '$−7$', '$−48$', '$64$'],
    [K('Isti znaci – količnik je pozitivan.', ['ist']),
     K('$56 : 8 = 7$'),
     K('Provera: $7 · (−8) = −56$ ✓')],
    RS(tablicaZnaka(':', { istakni: [1, 1] })));
  proveri(-56 / -8 === 7, '(−56):(−8)');

  Z(1, 'Tri drugara zajedno duguju $−24$ boda u igri i podele dug na jednake delove. Koliko je stanje svakog od njih?',
    ['$−8$', '$8$', '$−21$', '$−27$'],
    [K('Dug delimo na $3$ jednaka dela: $(−24) : 3$.', ['s']),
     K('$(−24) : 3 = −8$ – svako ima $−8$ bodova.')],
    RS(prava(-25, 1, nizSkokova(3, -8, { boja: 1, id: 's' }), [[-24, '−24', 0], [-8, '−8', 1, { k: 2 }]], { svaki: 4 })));
  proveri(-24 / 3 === -8, '−24 : 3');

  Z(2, 'Temperatura je za $6$ sati pala sa $5 °C$ na $−13 °C$, svakog sata podjednako. Za koliko se menjala svakog sata?',
    ['$−3 °C$', '$3 °C$', '$−1 °C$', '$−18 °C$'],
    [K('Ukupna promena: $−13 − 5 = −18$.', ['t2']),
     K('Svakog sata: $(−18) : 6 = −3$ – temperatura je padala po $3$ stepena.')],
    G(O, [...termometar(5, { od: -20, doo: 10, korak: 5, b: 0 }), ...termometar(-13, { od: -20, doo: 10, korak: 5, x: 3.2, b: 1, id: 't2' })], { ...bez, velicina: 240 }));
  proveri((-13 - 5) / 6 === -3, 'pad po satu');

  {
    const s = ['·', [':', -12, -4], [':', -18, 6]];
    proveri(vrednost(s) === -9, '[(−12):(−4)]·[(−18):6]');
    Z(2, 'Izračunaj: $[(−12) : (−4)] · [(−18) : 6]$.',
      ['$−9$', '$9$', '$−6$', '$6$'],
      [K('$(−12) : (−4) = 3$ (isti znaci).', ['c0', 'v0']),
       K('$(−18) : 6 = −3$ (različiti znaci).', ['c1', 'v1']),
       K('$3 · (−3) = −9$', ['c2', 'v2'])],
      stablo(s, { k: k1 }));
  }

  Z(2, 'Koji broj treba upisati umesto $□$ da bi bilo $□ : (−7) = 6$?',
    ['$−42$', '$42$', '$−13$', '$1$'],
    [K('Deljenik = količnik · delilac: $□ = 6 · (−7)$.'),
     K('$6 · (−7) = −42$. Provera: $(−42) : (−7) = 6$ ✓')],
    masina('□', [': (−7)'], '6', { obrnuto: ['· (−7)'] }));
  proveri(-42 / -7 === 6, '−42 : (−7)');

  Z(2, 'Koliko je $(−1) : (−1) : (−1) : (−1) : (−1)$ (pet puta $−1$)?',
    ['$−1$', '$1$', '$0$', '$−5$'],
    [K('Deljenje sa $−1$ je isto što i množenje sa $−1$: svaki put broj prelazi u suprotan.'),
     K('$−1 → 1 → −1 → 1 → −1$ (četiri deljenja).'),
     K('Rezultat: $−1$')],
    RS(prava(-2, 2, [[-1, 1, { k: 2 }], [1, -1, { k: 2, ispod: true, boja: 2 }], [-1, 1, { k: 2 }], [1, -1, { k: 2, ispod: true, boja: 2 }]], [[-1, '−1', 0], [-1, '', 1, { k: 3 }]], { velicina: 240 })));
  proveri(-1 / -1 / -1 / -1 / -1 === -1, 'pet puta −1');

  {
    const s = [':', ['·', ['·', -6, -5], -4], ['·', ['·', -2, -3], -5]];
    proveri(vrednost(s) === 4, '[(−6)(−5)(−4)] : [(−2)(−3)(−5)]');
    Z(3, 'Izračunaj: $[(−6) · (−5) · (−4)] : [(−2) · (−3) · (−5)]$.',
      ['$4$', '$−4$', '$12$', '$−12$'],
      [K('Brojilac: tri negativna činioca → $−120$.', ['c0', 'v0', 'c1', 'v1']),
       K('Delilac: tri negativna činioca → $−30$.', ['c2', 'v2', 'c3', 'v3']),
       K('$(−120) : (−30) = 4$', ['c4', 'v4'])],
      stablo(s, { k: (i) => (i < 2 ? 1 : i < 4 ? 2 : 3), dx: 1.9 }));
  }

  Z(3, 'Nina je zamislila ceo broj, pomnožila ga sa $−4$, dodala $10$ i rezultat podelila sa $−2$. Dobila je $7$. Koji broj je zamislila?',
    ['$6$', '$−6$', '$1$', '$−1$'],
    [K('Vraćamo se unazad: pre deljenja sa $−2$ bilo je $7 · (−2) = −14$.'),
     K('Pre dodavanja $10$: $−14 − 10 = −24$.'),
     K('Pre množenja sa $−4$: $(−24) : (−4) = 6$. Provera: $(6 · (−4) + 10) : (−2) = 7$ ✓')],
    masina('?', ['· (−4)', '+ 10', ': (−2)'], '7', { obrnuto: [': (−4)', '− 10', '· (−2)'] }));
  proveri((6 * -4 + 10) / -2 === 7, 'Nina');

  Z(3, 'Prosek temperatura izmerenih u pet dana je $−2 °C$. Prva četiri dana je bilo $3 °C$, $−5 °C$, $−4 °C$ i $1 °C$. Kolika je temperatura petog dana?',
    ['$−5 °C$', '$5 °C$', '$−2 °C$', '$−15 °C$'],
    [K('Zbir svih pet = prosek · broj dana: $(−2) · 5 = −10$.'),
     K('Zbir prva četiri: $3 − 5 − 4 + 1 = −5$.', ['s']),
     K('Peti dan: $−10 − (−5) = −5 °C$.')],
    RS(bilans([['1.', 3], ['2.', -5], ['3.', -4], ['4.', 1], ['5.', -5]], { k: { 4: 3 }, ids: { 0: 's', 1: 's', 2: 's', 3: 's' } })));
  proveri((3 - 5 - 4 + 1 - 5) / 5 === -2, 'prosek');
};
module.exports.crtezi = crtezi;
