// Lekcije 43–48: površina trougla i četvorougla (pojam i merenje površine, pravougaonik i kvadrat,
// paralelogram, trougao, trapez, četvorougao sa normalnim dijagonalama).
// Pitanja su sopstvenim rečima, po gradivu Matematike 6 (Arhiknjiga); crteži su medij „geo“:
// brojanje kvadratića, „seci i premesti“ (paralelogram → pravougaonik), okrenuta kopija (trougao kao
// pola paralelograma, trapez + kopija = paralelogram), okrenute kopije oko sredina stranica (romb i deltoid kao pola pravougaonika).
module.exports = ({ L, Q, U, S, G, proveri, sto }) => {
  const sh = (P) => Math.abs(P.reduce((s, [x, y], i) => { const [x2, y2] = P[(i + 1) % P.length]; return s + x * y2 - x2 * y; }, 0)) / 2;
  const blizu = (a, b) => Math.abs(a - b) < 1e-9;

  // ── crteži ──
  const V = (x = {}) => ({ velicina: 240, ...x });
  // karirani papir [x0, x1] × [y0, y1]
  const kv = (x0, x1, y0, y1) => {
    const e = [];
    for (let x = x0; x <= x1; x++) e.push({ lin: [[x, y0], [x, y1]], b: 4, debljina: 0.6 });
    for (let y = y0; y <= y1; y++) e.push({ lin: [[x0, y], [x1, y]], b: 4, debljina: 0.6 });
    return e;
  };
  const lik = (pts, x = {}) => ({ lin: pts, zatv: 1, b: 1, ...x });
  const tx = (t, at, x = {}) => ({ tx: t, at, ...x });
  // lik(ovi) na kariranom papiru
  const mreza = (x0, x1, y0, y1, likovi, x = {}) => G({}, [...kv(x0, x1, y0, y1), ...likovi], V(x));
  // pravougaonik a × b sa oznakama stranica
  const pravoug = (a, b, oa, ob, e = [], x = {}) => G({ a: [0, 0], b: [a, 0], c: [a, b], d: [0, b] },
    [{ p: 'abcd', b: 0 }, ...(oa ? [{ d: 'ab', o: oa }] : []), ...(ob ? [{ d: 'bc', o: ob }] : []), ...e], V(x));
  // paralelogram ABCD (osnovica a, visina h, pomak gornje stranice s); premesti = trougao AED klizi na mesto BFC
  function paral(a, h, s, { oa, oh, ob, premesti = false, imena = false, e = [], x = {} } = {}) {
    const t = { A: [0, 0], B: [a, 0], C: [a + s, h], D: [s, h], e: [s, 0], f: [a + s, 0] };
    const el = premesti
      ? [{ p: 'eBCD', b: 0 }, { p: 'BfC', b: 1, prazno: 1, isp: 1 }, { p: 'AeD', b: 1, gusto: 1, pomeri: [a, 0], kasni: 0.6, trajanje: 1.8 }]
      : [{ p: 'ABCD', b: 0 }];
    el.push({ d: 'De', isp: 1, b: 3, ...(oh ? { o: oh } : {}) }, { pu: 'DeB' });
    if (oa) el.push({ d: premesti ? 'ef' : 'AB', o: oa });
    if (ob) el.push({ d: 'BC', o: ob });
    return G(t, [...el, ...e], V({ ...(imena ? {} : { bezImena: ['A', 'B', 'C', 'D'] }), ...x }));
  }
  // trougao ABC (A u koordinatnom početku, B na x-osi), visina iz C; kopija = okrenuta kopija oko sredine BC
  function trougao(a, cx, h, { oa, oh, kopija = false, imena = false, e = [], x = {} } = {}) {
    const t = { A: [0, 0], B: [a, 0], C: [cx, h], c: [cx, 0], m: [(a + cx) / 2, h / 2], g: [a + cx, h] };
    const el = [{ p: 'ABC', b: 0 }];
    if (kopija) el.push({ p: 'ABC', b: 1, gusto: 1, okreni: 180, oko: 'm', kasni: 0.6, trajanje: 1.8 });
    if (cx < 0 || cx > a) el.push({ d: (cx < 0 ? 'A' : 'B') + 'c', isp: 1, b: 4 });
    el.push({ d: 'Cc', isp: 1, b: 3, ...(oh ? { o: oh } : {}) }, { pu: cx > a ? 'CcA' : 'CcB' });
    if (oa) el.push({ d: 'AB', o: oa });
    return G(t, [...el, ...e], V({ ...(imena ? {} : { bezImena: ['A', 'B', 'C'] }), ...x }));
  }
  // trapez ABCD: donja osnovica a, gornja b (od x = s), visina h; kopija = okrenuta oko sredine kraka BC
  function trapez(a, b, s, h, { oa, ob, oh, kopija = false, srednja = false, imena = false, e = [], x = {} } = {}) {
    const t = { A: [0, 0], B: [a, 0], C: [s + b, h], D: [s, h], d: [s, 0], m: [(a + s + b) / 2, h / 2], n: [s / 2, h / 2], p: [a + b, 0], q: [a + s, h] };
    const el = [{ p: 'ABCD', b: 0 }];
    if (kopija) el.push({ p: 'ABCD', b: 1, gusto: 1, okreni: 180, oko: 'm', kasni: 0.6, trajanje: 1.8 });
    el.push({ d: 'Dd', isp: 1, b: 3, ...(oh ? { o: oh } : {}) }, { pu: 'DdB' });
    if (srednja) el.push({ d: 'nm', b: 2, debljina: 3, ...(typeof srednja === 'string' ? { o: srednja } : {}) });
    if (oa) el.push({ d: 'AB', o: oa });
    if (ob) el.push({ d: 'DC', o: ob });
    return G(t, [...el, ...e], V({ ...(imena ? {} : { bezImena: ['A', 'B', 'C', 'D'] }), ...x }));
  }
  // četvorougao sa normalnim dijagonalama: A(−l, 0), C(d, 0), B(0, −g), D(0, gg); presavij = unutrašnji
  // trouglovi se okreću za 180° oko sredina stranica i popune opisani pravougaonik
  function normalne(l, d, g, gg, { o1, o2, okvir = false, presavij = false, e = [], x = {} } = {}) {
    const t = { A: [-l, 0], C: [d, 0], B: [0, -g], D: [0, gg], O: [0, 0], e: [-l, -g], f: [d, -g], h: [d, gg], k: [-l, gg], s: [-l / 2, -g / 2], u: [d / 2, -g / 2], v: [d / 2, gg / 2], w: [-l / 2, gg / 2] };
    const el = [];
    if (okvir || presavij) el.push({ p: 'efhk', b: 4, prazno: 1, isp: 1 });
    el.push({ p: 'ABCD', b: 0 });
    if (presavij) [['AOB', 's'], ['BOC', 'u'], ['COD', 'v'], ['DOA', 'w']].forEach(([p, o], i) => el.push({ p, b: 2, gusto: 1, okreni: 180, oko: o, kasni: 0.5 + i * 0.5, trajanje: 1.2 }));
    el.push({ d: 'AC', b: 1, isp: 1, ...(o1 ? { o: o1, na: 0.75 } : {}) }, { d: 'BD', b: 3, isp: 1, ...(o2 ? { o: o2, na: 0.3 } : {}) }, { pu: 'COD' });
    return G(t, [...el, ...e], V({ bezImena: ['A', 'B', 'C', 'D', 'O'], ...x }));
  }

  // ── provere računa ──
  proveri(sh([[0, 0], [6, 2], [2, 4]]) === 10 && 24 - (6 + 4 + 4) === 10, 'trougao u pravougaoniku 6×4');
  proveri(sh([[0, 0], [8, 0], [6, 3], [2, 3]]) === 18 && 12 + 3 + 3 === 18, 'trapez na mreži');
  proveri(sh([[0, 0], [4, 0], [4, 2], [2, 2], [2, 4], [0, 4]]) === 12, 'L-figura 12');
  proveri(12 * 8 - 10 * 6 === 36 && 2 * (10 + 6) === 32, 'staza oko bazena');
  proveri((30 * 20) / (2 * 1) === 300, 'pločice');
  proveri(6 * 6 === 36 && 2 * (9 + 4) === 26 && 4 * 6 === 24, 'kvadrat i pravougaonik iste površine');
  proveri((5 + 3) ** 2 - 5 ** 2 === 39, 'kvadrat +3 cm → +39');
  proveri(8 * 5 - 3 * 2 === 34, 'L-figura 34');
  proveri(5 * 5 === 25 && 7 * 3 === 21, 'isti obim 20');
  proveri(6 * 4 === 24 && 48 / 8 === 6 && 8 * 4 / 2 === 16, 'paralelogram');
  proveri(8 * 4 === 32 && 10 * 3 === 30, 'romb i paralelogram sa uglom 30°');
  proveri(5 * 3 === 15, 'paralelogram u koordinatnoj ravni');
  proveri((15 * 20) / 2 === 150 && 300 / 25 === 12, 'visina na hipotenuzu');
  proveri(sh([[1, 1], [1, 6], [5, 3]]) === 10, 'trougao u koordinatnoj ravni');
  proveri((8 * 8) / 2 === 32 && (10 * 5) / 2 === 25, 'jednakokrako pravougli');
  proveri([[14, 12], [12, 14], [21, 8], [24, 7]].every(([a, h]) => (a * h) / 2 === 84), 'visine za P = 84');
  proveri(((9 + 5) / 2) * 4 === 28 && (12 + 6) / 2 === 9 && 60 / 5 === 12 && 2 * (54 / 6) - 12 === 6, 'trapez');
  proveri((11 - 5) / 2 === 3 && ((11 + 5) / 2) * 3 === 24 && ((8 + 4) / 2) * 3 === 18, 'trapez 45° i pravougli');
  proveri(((10 + 7) / 2) * 2 === 17 && ((7 + 4) / 2) * 2 === 11, 'srednja linija deli trapez');
  proveri(sh([[0, 0], [9, 0], [6, 4], [1, 4]]) === 28, 'trapez na mreži 28');
  proveri([[6, 4, 5, 25], [10, 2, 3, 18], [7, 5, 2, 12], [9, 3, 4, 24]].every(([a, b, h, P]) => ((a + b) / 2) * h === P), 'spoji trapez');
  proveri(60 - 60 / 4 === 45 && 72 / 12 === 6, 'trapez ABNM, h iz P i m');
  proveri((10 * 6) / 2 === 30 && (8 * 8) / 2 === 32 && (12 * 7) / 2 === 42 && (10 * 10) / 2 === 50, 'normalne dijagonale');
  proveri((16 * 12) / 2 === 96 && blizu(96 / 10, 9.6), 'romb obim 40');
  proveri((50 * 30) / 2 === 750, 'plac 7,5 a');
  proveri(sh([[0, 3], [3, 0], [6, 3], [3, 8]]) === 24, 'deltoid u koordinatnoj ravni');
  proveri((2 * 24) / 6 === 8, 'romb d₂');
  proveri([[4, 6, 12], [10, 3, 15], [8, 5, 20], [7, 2, 7]].every(([a, b, P]) => (a * b) / 2 === P), 'spoji dijagonale');
  proveri(sh([[-2, 0], [0, -4], [8, 0], [0, 2]]) === 30, 'duži 10 i 6 seku se normalno');

  // ════════════════ 43. Pojam površine; merenje površine ════════════════
  L('Pojam površine; merenje površine');
  Q(1, 'Koja je osnovna jedinica mere za površinu?',
    ['Kvadratni metar', 'Metar', 'Hektar', 'Kvadratni centimetar'],
    'Kvadratni metar se lako napravi na podu od četiri metra (štapa ili kanapa) složena u kvadrat. Od njega se izvode sve ostale jedinice za površinu.', 'metar',
    { mediji: pravoug(4, 4, '1 m', '1 m', [{ tx: '?', at: [2, 2], vel: 30 }]) });
  Q(1, 'Kolika je površina figure na slici, ako je jedinica mere jedan kvadratić mreže?',
    ['12 kvadratića', '16 kvadratića', '14 kvadratića', '10 kvadratića'],
    'Za merenje površine važno je da se jedinice ne preklapaju i da ne ostaju praznine. Zato se kao jedinica uzima kvadrat: kvadratima se ravan može potpuno popločati.', 'kvadratić',
    { mediji: mreza(0, 5, 0, 5, [lik([[0, 0], [4, 0], [4, 2], [2, 2], [2, 4], [0, 4]])]),
      medijiOdgovora: mreza(0, 5, 0, 5, [lik([[0, 0], [4, 0], [4, 2], [0, 2]], { gusto: 1 }), lik([[0, 2], [2, 2], [2, 4], [0, 4]], { b: 2, gusto: 1 }), tx('8', [2, 1]), tx('4', [1, 3])]) });
  Q(1, 'Koliko kvadratnih centimetara ima jedan kvadratni decimetar?',
    ['100 cm²', '10 cm²', '1 000 cm²', '50 cm²'],
    'Kod dužina je 1 dm = 10 cm, a kod površina se taj broj „kvadrira“: 10 redova po 10 kvadratića daje 100.', 'decimetar',
    { mediji: pravoug(5, 5, '1 dm = 10 cm', '10 cm'),
      medijiOdgovora: G({}, sto(100, { a: 0.5, b: 2 }), V()) });
  Q(1, 'Dve figure su podudarne. Šta sigurno važi za njihove površine?',
    ['Jednake su', 'Prva je veća', 'Zavise od položaja', 'Ne mogu se porediti'],
    'Podudarne figure se mogu pomeriti, okrenuti ili presaviti tako da se potpuno poklope – a pri tome se površina ne menja.', 'podudarne',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [1, 3], o: [5, 1.5] }, [{ p: 'ABC', b: 0 }, { p: 'ABC', b: 1, gusto: 1, okreni: 150, oko: 'o', kasni: 0.4, trajanje: 2, ponovi: 1 }], V({ bezImena: ['A', 'B', 'C'] })) });
  Q(1, 'Figura je presečena na dva dela. Kako se dobija površina cele figure?',
    ['Saberu se površine delova', 'Pomnože se površine delova', 'Uzme se veći deo', 'Oduzmu se površine delova'],
    'Ovo svojstvo se zove aditivnost površine. Zahvaljujući njemu, složene figure računamo tako što ih razložimo na pravougaonike i trouglove.', 'zbir',
    { mediji: mreza(0, 7, 0, 4, [lik([[0, 0], [4, 0], [3, 2], [4, 4], [0, 4]], { b: 1, gusto: 1 }), lik([[4, 0], [7, 0], [7, 4], [4, 4], [3, 2]], { b: 2, gusto: 1 }), tx('F₁', [1.8, 2], { vel: 20 }), tx('F₂', [5.3, 2], { vel: 20 })]) });
  Q(2, 'Koliko kvadratnih metara ima jedan ar?',
    ['100 m²', '10 m²', '1 000 m²', '10 000 m²'],
    'Ar je kvadrat stranice 10 m – otprilike koliko dve školske učionice zajedno. Reč „ar“ potiče od latinske reči area – „površina, dvorište“.', 'dvorište',
    { mediji: pravoug(5, 5, '10 m', '10 m', [{ tx: '1 a', at: [2.5, 2.5], vel: 26 }]) });
  Q(2, 'Koliko kvadratnih metara ima jedan hektar?',
    ['10 000 m²', '1 000 m²', '100 m²', '100 000 m²'],
    'Hektar je kvadrat stranice 100 m. Fudbalski teren je velik nešto manje od jednog hektara (oko 0,7 ha).', 'hektar',
    { mediji: pravoug(5, 5, '100 m', '100 m', [{ tx: '1 ha', at: [2.5, 2.5], vel: 26 }]),
      medijiOdgovora: G({}, sto(100, { a: 0.5, b: 2 }), V()) });
  Q(2, 'Kolika je površina trougla na slici, ako je jedinica mere jedan kvadratić?',
    ['10 kvadratića', '20 kvadratića', '9 kvadratića', '12 kvadratića'],
    'Pravougli trougao je tačno pola pravougaonika: dijagonala deli pravougaonik na dva podudarna trougla. Zato ne moramo da brojimo „isečene“ kvadratiće.', 'trougao',
    { mediji: mreza(0, 6, 0, 5, [lik([[0, 0], [5, 0], [0, 4]])]),
      medijiOdgovora: mreza(0, 6, 0, 5, [lik([[0, 0], [5, 0], [5, 4], [0, 4]], { b: 4, prazno: 1, isp: 1 }), lik([[0, 0], [5, 0], [0, 4]], { gusto: 1 }), tx('20 : 2', [3.4, 3])]) });
  Q(2, 'Šta znači da su dve figure razloživo jednake?',
    ['Mogu se razložiti na iste podudarne delove', 'Imaju isti oblik i jednako duge stranice', 'Imaju jednake obime i iste uglove', 'Imaju isti broj temena i stranica'],
    'Mađarski matematičar Farkaš Boljai i Nemac Gervin dokazali su da su bilo koja dva mnogougla iste površine uvek razloživo jednaka – jedan se može iseći i složiti u drugi.', 'deo',
    { mediji: G({ A: [0, 0], B: [6, 0], C: [3, 2], m: [3, 0], e: [8, 0], f: [11, 0], g: [11, 2], h: [8, 2] }, [{ p: 'AmC', b: 1, gusto: 1 }, { p: 'mBC', b: 2, gusto: 1 }, { d: 'Cm', isp: 1, b: 3 }, { p: 'efg', b: 1, gusto: 1 }, { p: 'egh', b: 2, gusto: 1 }],
      V({ bezImena: ['A', 'B', 'C'], velicina: 300 })) });
  Q(2, 'Mogu li dve figure koje nisu podudarne imati jednake površine?',
    ['Mogu', 'Ne mogu nikada', 'Samo ako su obe trouglovi', 'Samo ako imaju isti obim'],
    'Na slici pravougaonik 3 × 2 i trougao osnovice 4 i visine 3 imaju istu površinu – po 6 kvadratića, a sasvim su različitog oblika.', 'oblik',
    { mediji: mreza(0, 9, 0, 3, [lik([[0, 0], [3, 0], [3, 2], [0, 2]]), lik([[4, 0], [8, 0], [6, 3]], { b: 2 })]) });
  Q(2, 'Koliko kvadratnih decimetara ima jedan kvadratni metar?',
    ['100 dm²', '10 dm²', '1 000 dm²', '10 000 dm²'],
    'Svaka sledeća jedinica (mm², cm², dm², m², a, ha, km²) je 100 puta veća od prethodne, pa se pri pretvaranju zarez pomera za po dva mesta.', 'jedinica',
    { mediji: G({}, sto(0, { a: 0.5 }), V()) });
  Q(2, 'Kolika je površina trapeza na slici, ako je jedinica mere jedan kvadratić?',
    ['18 kvadratića', '24 kvadratića', '21 kvadratić', '15 kvadratića'],
    'Razlaganje je najstariji način računanja površina: egipatski geometri su njive nepravilnog oblika delili na pravougaonike i trouglove.', 'trapez',
    { mediji: mreza(0, 8, 0, 4, [lik([[0, 0], [8, 0], [6, 3], [2, 3]])]),
      medijiOdgovora: mreza(0, 8, 0, 4, [lik([[2, 0], [6, 0], [6, 3], [2, 3]], { gusto: 1 }), lik([[0, 0], [2, 0], [2, 3]], { b: 2, gusto: 1 }), lik([[6, 0], [8, 0], [6, 3]], { b: 2, gusto: 1 }), tx('12', [4, 1.5]), tx('3', [1.4, 0.9]), tx('3', [6.6, 0.9])]) });
  Q(3, 'Kolika je površina trougla na slici (jedinica je jedan kvadratić)?',
    ['10 kvadratića', '12 kvadratića', '14 kvadratića', '8 kvadratića'],
    'Ovaj trik – „upakovati“ lik u pravougaonik i oduzeti višak – radi za svaki trougao čija su temena u čvorovima mreže.', 'višak',
    { mediji: mreza(0, 6, 0, 4, [lik([[0, 0], [6, 2], [2, 4]])]),
      medijiOdgovora: mreza(0, 6, 0, 4, [lik([[0, 0], [6, 0], [6, 2]], { b: 4, gusto: 1 }), lik([[6, 2], [6, 4], [2, 4]], { b: 4, gusto: 1 }), lik([[0, 0], [2, 4], [0, 4]], { b: 4, gusto: 1 }), lik([[0, 0], [6, 2], [2, 4]], { gusto: 1 }), tx('24 − 6 − 4 − 4', [3, 2.3])]) });
  Q(3, 'Koliko hektara ima jedan kvadratni kilometar?',
    ['100 ha', '10 ha', '1 000 ha', '10 000 ha'],
    'Kvadrat stranice 1 km = 1 000 m ima 1 000 000 m², a hektar ima 10 000 m². Srbija ima površinu od oko 88 000 km², odnosno oko 8,8 miliona hektara.', 'kilometar',
    { mediji: pravoug(5, 5, '1 km', '1 km') });
  Q(3, 'Koliko kvadratnih metara ima pola hektara?',
    ['5 000 m²', '50 m²', '500 m²', '50 000 m²'],
    'Plac od pola hektara bi mogao biti pravougaonik 100 m × 50 m. U oglasima se plac često meri u arima: pola hektara je 50 ari.', 'plac',
    { mediji: G({ a: [0, 0], b: [6, 0], c: [6, 6], d: [0, 6], e: [3, 0], f: [3, 6] }, [{ p: 'abcd', b: 4, prazno: 1 }, { p: 'aefd', b: 1, gusto: 1 }, { d: 'ab', o: '100 m' }, { d: 'bc', o: '100 m' }], V()) });
  S(1, 'Spoji jedinicu sa onim koliko iznosi.',
    [['1 cm²', '100 mm²'], ['1 m²', '100 dm²'], ['1 a', '100 m²'], ['1 ha', '100 a'], ['1 km²', '100 ha']],
    'Sve ove veze imaju isti broj – 100 – jer je stranica svake veće jedinice 10 puta duža od stranice prethodne.', 'hektar');
  U(2, 'Koja od ovih jedinica NIJE jedinica za površinu?',
    ['kilometar', 'ar', 'hektar', 'kvadratni metar'],
    'Kilometar meri dužinu. Ar, hektar i kvadratni metar mere površinu.',
    'U nekim krajevima Srbije i danas se njive mere u starim jedinicama, na primer u katastarskim jutrima – jedno jutro je oko 57 ari.', 'jutro');

  // ════════════════ 44. Površina pravougaonika i kvadrata ════════════════
  L('Površina pravougaonika i kvadrata');
  Q(1, 'Kolika je površina pravougaonika sa stranicama 7 cm i 4 cm?',
    ['28 cm²', '22 cm²', '11 cm²', '28 cm'],
    'Broj 22 bi bio obim (zbir svih stranica) – meri se u centimetrima. Površina se meri u kvadratnim jedinicama.', 'pravougaon',
    { mediji: pravoug(7, 4, '7 cm', '4 cm'), medijiOdgovora: G({}, [...kv(0, 7, 0, 4), lik([[0, 0], [7, 0], [7, 4], [0, 4]], { b: 0 })], V()) });
  Q(1, 'Koja formula daje površinu kvadrata stranice $a$?',
    ['$P = a²$', '$P = 4a$', '$P = 2a$', '$P = a + a$'],
    'Zato se broj pomnožen samim sobom zove „kvadrat broja“ – to je baš površina kvadrata čija je stranica taj broj.', 'kvadrat',
    { mediji: pravoug(4, 4, 'a', 'a') });
  Q(1, 'Kolika je površina kvadrata stranice 6 cm?',
    ['36 cm²', '24 cm²', '12 cm²', '36 cm'],
    'Kvadrat stranice 6 cm ima obim 24 cm i površinu 36 cm². Za kvadrat stranice 4 cm obim i površina su brojčano jednaki (16).', 'stranica',
    { mediji: pravoug(6, 6, '6 cm', '6 cm') });
  Q(1, 'Koliko kvadratića od 1 cm² staje u pravougaonik 5 cm × 3 cm?',
    ['15', '16', '8', '30'],
    'Formula $P = a · b$ je samo kraći zapis brojanja: $b$ redova sa po $a$ kvadratića.', 'red',
    { mediji: G({}, [...kv(0, 5, 0, 3), lik([[0, 0], [5, 0], [5, 3], [0, 3]], { b: 0, prazno: 1 })], V()) });
  Q(2, 'Kvadrat i pravougaonik imaju isti obim, 20 cm. Stranice pravougaonika su 7 cm i 3 cm. Koja figura ima veću površinu?',
    ['Kvadrat, 25 cm²', 'Pravougaonik, 21 cm²', 'Iste su, po 20 cm²', 'Kvadrat, 20 cm²'],
    'Od svih pravougaonika istog obima najveću površinu ima kvadrat. Zato su mnoge stare tvrđave i ograđena dvorišta približno kvadratna.', 'obim',
    { mediji: G({}, [...kv(0, 13, 0, 5), lik([[0, 0], [5, 0], [5, 5], [0, 5]], { b: 0 }), lik([[6, 0], [13, 0], [13, 3], [6, 3]], { b: 1 })], V({ velicina: 280 })) });
  Q(2, 'Površina kvadrata je 49 cm². Kolika mu je stranica?',
    ['7 cm', '12,25 cm', '24,5 cm', '9 cm'],
    'Tražimo broj koji pomnožen samim sobom daje 49. Ta operacija se zove korenovanje i uči se u 7. razredu.', 'koren',
    { mediji: pravoug(5, 5, '?', '?', [{ tx: '49 cm²', at: [2.5, 2.5], vel: 22 }]) });
  Q(2, 'Stranica kvadrata se udvostruči. Koliko puta se poveća njegova površina?',
    ['4 puta', '2 puta', '3 puta', '8 puta'],
    'U kvadrat dvostruko veće stranice staju tačno četiri početna kvadrata. Kod utrostručenja bi stalo čak devet.', 'dvostruko',
    { mediji: pravoug(2, 2, 'a', 'a', [], { velicina: 120 }),
      medijiOdgovora: G({}, [lik([[0, 0], [2, 0], [2, 2], [0, 2]], { b: 0, gusto: 1 }), lik([[2, 0], [4, 0], [4, 2], [2, 2]], { b: 1, gusto: 1 }), lik([[0, 2], [2, 2], [2, 4], [0, 4]], { b: 2, gusto: 1 }), lik([[2, 2], [4, 2], [4, 4], [2, 4]], { b: 3, gusto: 1 })], V()) });
  Q(2, 'Pravougaonik ima površinu 48 cm², a jednu stranicu 8 cm. Kolika je druga stranica?',
    ['6 cm', '40 cm', '16 cm', '12 cm'],
    'Kad znamo površinu i jednu stranicu, drugu dobijamo deljenjem. Isto rade majstori kad od površine sobe i širine traže dužinu.', 'deljenje',
    { mediji: pravoug(8, 6, '8 cm', '?', [{ tx: '48 cm²', at: [4, 3], vel: 22 }]) });
  Q(2, 'Bazen 10 m × 6 m okružen je stazom širine 1 m. Kolika je površina staze?',
    ['36 m²', '32 m²', '96 m²', '40 m²'],
    'Najlakše je od velikog pravougaonika (12 m × 8 m) oduzeti bazen. Ko staze samo sabere duž ivica dobije 32 m² i zaboravi četiri ugaona kvadrata.', 'staza',
    { mediji: G({ a: [0, 0], b: [12, 0], c: [12, 8], d: [0, 8], e: [1, 1], f: [11, 1], g: [11, 7], h: [1, 7] }, [{ p: 'abcd', b: 3, gusto: 1 }, { p: 'efgh', b: 0, gusto: 1 }, { d: 'ef', o: '10 m' }, { d: 'fg', o: '6 m' }, { tx: '1 m', at: [11.5, 4] }], V({ velicina: 260 })) });
  Q(2, 'Kolika je površina figure na slici?',
    ['34 cm²', '40 cm²', '26 cm²', '28 cm²'],
    'Figuru u obliku slova L možemo računati na dva načina: kao zbir dva pravougaonika ili kao veliki pravougaonik bez isečenog ugla. Oba moraju dati isti broj.', 'razlika',
    { mediji: G({ a: [0, 0], b: [8, 0], c: [8, 3], d: [5, 3], e: [5, 5], f: [0, 5], g: [8, 5] }, [{ p: 'abcdef', b: 0 }, { d: 'ab', o: '8 cm' }, { d: 'fa', o: '5 cm' }, { d: 'cd', o: '3 cm' }, { d: 'de', o: '2 cm' }], V()),
      medijiOdgovora: G({ a: [0, 0], b: [8, 0], c: [8, 3], d: [5, 3], e: [5, 5], f: [0, 5], g: [8, 5] }, [{ p: 'abgf', b: 4, prazno: 1, isp: 1 }, { p: 'abcdef', b: 0, gusto: 1 }, { p: 'dcge', b: 1, gusto: 1 }, { tx: '40 − 6', at: [3, 2.5], vel: 20 }], V()) });
  Q(3, 'Pod sobe 3 m × 2 m popločava se pločicama 20 cm × 10 cm. Koliko pločica treba?',
    ['300', '30', '600', '3 000'],
    'Pre deljenja sve mere moraju biti u istoj jedinici: 30 dm × 20 dm = 600 dm², a pločica ima 2 dm². Majstori uvek kupe 5–10 % više pločica zbog sečenja i loma.', 'pločica',
    { mediji: G({}, [lik([[0, 0], [6, 0], [6, 4], [0, 4]], { b: 0 }), ...Array.from({ length: 6 }, (_, i) => lik([[i * 0.4, 0], [i * 0.4 + 0.4, 0], [i * 0.4 + 0.4, 0.2], [i * 0.4, 0.2]], { b: 1, gusto: 1 })), { tx: '3 m', at: [3, -0.4] }, { tx: '2 m', at: [6.6, 2] }], V()) });
  Q(3, 'Pravougaonik 9 cm × 4 cm i kvadrat imaju istu površinu. Koja figura ima manji obim?',
    ['Kvadrat, 24 cm', 'Pravougaonik, 26 cm', 'Jednaki su, 26 cm', 'Pravougaonik, 24 cm'],
    'Kvadrat ima stranicu 6 cm (6 · 6 = 36). Od svih pravougaonika iste površine kvadrat ima najmanji obim – zato su kutije i sobe često bliske kvadratu.', 'manji',
    { mediji: G({}, [...kv(0, 16, 0, 6), lik([[0, 0], [9, 0], [9, 4], [0, 4]], { b: 1 }), lik([[10, 0], [16, 0], [16, 6], [10, 6]], { b: 0 })], V({ velicina: 300 })) });
  Q(3, 'Kad se stranica kvadrata produži za 3 cm, površina mu se poveća za 39 cm². Kolika je bila stranica?',
    ['5 cm', '13 cm', '6 cm', '4 cm'],
    'Uvećani kvadrat se sastoji od starog kvadrata, dve trake $a × 3$ i kvadratića $3 × 3$. Zato je $6a + 9 = 39$.', 'traka',
    { mediji: G({ a: [0, 0], b: [5, 0], c: [5, 5], d: [0, 5], e: [8, 0], f: [8, 5], g: [8, 8], h: [5, 8], i: [0, 8] }, [{ p: 'abcd', b: 0, gusto: 1 }, { p: 'befc', b: 1, gusto: 1 }, { p: 'dchi', b: 1, gusto: 1 }, { p: 'cfgh', b: 2, gusto: 1 }, { d: 'ab', o: 'a' }, { d: 'be', o: '3' }, { tx: '+39 cm²', at: [6.5, 6.5] }], V()) });
  U(1, 'Tri pravougaonika imaju istu površinu. Koji je uljez?',
    ['4 cm × 4 cm', '3 cm × 4 cm', '2 cm × 6 cm', '1 cm × 12 cm'],
    'Kvadrat 4 cm × 4 cm ima površinu 16 cm², a ostala tri po 12 cm².',
    'Isti broj kvadratića može se složiti u pravougaonike veoma različitog oblika – i veoma različitog obima: 14 cm, 16 cm ili čak 26 cm.', 'uljez',
    { mediji: G({}, [...kv(0, 17, 0, 6), lik([[0, 0], [12, 0], [12, 1], [0, 1]], { b: 1 }), lik([[0, 2], [6, 2], [6, 4], [0, 4]], { b: 2 }), lik([[7, 2], [10, 2], [10, 6], [7, 6]], { b: 0 }), lik([[12, 2], [16, 2], [16, 6], [12, 6]], { b: 3 })], V({ velicina: 300 })) });
  S(2, 'Spoji stranice pravougaonika sa njegovom površinom.',
    [['3 cm i 5 cm', '15 cm²'], ['4 cm i 4 cm', '16 cm²'], ['2 cm i 9 cm', '18 cm²'], ['2,5 cm i 4 cm', '10 cm²']],
    'Sa decimalnim brojevima pomaže razlaganje: 2,5 · 4 = 2 · 4 + 0,5 · 4 = 8 + 2 = 10.', 'proizvod',
    { mediji: pravoug(5, 3, 'a', 'b') });
  Q(2, 'Jedna stranica pravougaonika se udvostruči, a druga prepolovi. Šta se desi sa površinom?',
    ['Ostane ista', 'Udvostruči se', 'Prepolovi se', 'Poveća se 4 puta'],
    'Pravougaonik 4 × 2 i pravougaonik 8 × 1 imaju istu površinu, ali drugi ima veći obim: 18 umesto 12.', 'isto',
    { mediji: G({}, [...kv(0, 8, 0, 4), lik([[0, 2], [4, 2], [4, 4], [0, 4]], { b: 0, gusto: 1 }), lik([[0, 0], [8, 0], [8, 1], [0, 1]], { b: 1, gusto: 1 })], V()) });

  // ════════════════ 45. Površina paralelograma ════════════════
  L('Površina paralelograma');
  Q(1, 'Kako se računa površina paralelograma?',
    ['Stranica puta odgovarajuća visina', 'Proizvod dve susedne stranice', 'Zbir svih stranica puta visina', 'Polovina proizvoda dve stranice'],
    'Paralelogram „nagnut“ na stranu može da ima vrlo dugačke stranice, a malu površinu – važna je visina, a ne dužina kosih stranica.', 'visina',
    { mediji: paral(6, 3, 2, { oa: 'a', oh: 'h' }) });
  Q(1, 'Osnovica paralelograma je 9 cm, a visina na nju 4 cm. Kolika je površina?',
    ['36 cm²', '26 cm²', '18 cm²', '13 cm²'],
    'Broj 18 bi se dobio kad bismo greškom podelili sa 2 – tako se računa površina trougla, ne paralelograma.', 'osnovica',
    { mediji: paral(9, 4, 2.5, { oa: '9 cm', oh: '4 cm' }) });
  Q(2, 'Kako se paralelogram pretvara u pravougaonik iste površine?',
    ['Odseče se trougao i premesti na drugu stranu', 'Stranice se ispravljaju dok ne postanu uspravne', 'Preseče se dijagonalom na pola', 'Doda mu se još jedan isti paralelogram'],
    'Pravougaonik koji se dobije ima istu osnovicu kao paralelogram, a za drugu stranicu – njegovu visinu. Zato je $P = a · h$.', 'premesti',
    { mediji: paral(6, 3, 2, { oa: 'a', oh: 'h' }), medijiOdgovora: paral(6, 3, 2, { oa: 'a', oh: 'h', premesti: true }) });
  Q(2, 'Stranice paralelograma su 6 cm i 5 cm, a visina na stranicu od 6 cm je 4 cm. Kolika je površina?',
    ['24 cm²', '30 cm²', '20 cm²', '22 cm²'],
    'Proizvod stranica (30) bi važio samo da je paralelogram pravougaonik. Kosa stranica je uvek duža od visine, pa je površina manja.', 'kosa',
    { mediji: paral(6, 4, 3, { oa: '6 cm', oh: '4 cm', ob: '5 cm' }) });
  Q(2, 'Paralelogram ima površinu 48 cm² i stranicu $b = 8$ cm. Kolika je visina na stranicu $b$?',
    ['6 cm', '40 cm', '4 cm', '12 cm'],
    'Iz $P = b · h_{b}$ sledi $h_{b} = P : b$. Isti paralelogram ima dve visine, a obe daju istu površinu.', 'visina',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [10, 6], D: [2, 6], e: [2, 0] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '8 cm' }, { d: 'De', isp: 1, b: 3, o: '?' }, { pu: 'DeB' }, { tx: '48 cm²', at: [5, 3], vel: 20 }], V({ bezImena: ['A', 'B', 'C', 'D'] })) });
  Q(2, 'Kojoj stranici paralelograma odgovara duža visina?',
    ['Kraćoj stranici', 'Dužoj stranici', 'Visine su uvek jednake', 'Zavisi od dijagonala'],
    'Proizvod stranice i njene visine je uvek ista površina. Ako je stranica dva puta kraća, visina na nju je dva puta duža.', 'kraća',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [11, 4], D: [3, 4], e: [3, 0], f: [2.88, 3.84] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '8 cm' }, { d: 'AD', o: '5 cm', os: -1 }, { d: 'De', isp: 1, b: 3 }, { pu: 'DeB' }, { d: 'Bf', isp: 1, b: 1 }, { pu: 'BfA' }], V({ bezImena: ['A', 'B', 'C', 'D'] })) });
  Q(2, 'Romb ima stranicu 5 cm i visinu 4 cm. Kolika mu je površina?',
    ['20 cm²', '25 cm²', '10 cm²', '18 cm²'],
    'Romb je paralelogram sa jednakim stranicama, pa za njega važi ista formula $P = a · h$. Broj 25 bi bila površina kvadrata stranice 5 cm.', 'romb',
    { mediji: paral(5, 4, 3, { oa: '5 cm', oh: '4 cm' }) });
  Q(1, 'Dijagonala deli paralelogram površine 50 cm² na dva trougla. Kolika je površina jednog?',
    ['25 cm²', '50 cm²', '100 cm²', '12,5 cm²'],
    'Dva trougla su podudarna (po stavu SSS), pa svaki zauzima tačno polovinu paralelograma.', 'polovina',
    { mediji: G({ A: [0, 0], B: [6, 0], C: [8, 3], D: [2, 3] }, [{ p: 'ABCD', b: 0 }, { p: 'ABC', b: 1, gusto: 1 }, { d: 'AC', b: 3 }], V()) });
  Q(2, 'Paralelogram ima temena $A(−1, 0)$, $B(4, 0)$, $C(6, 3)$ i $D(1, 3)$. Kolika mu je površina (jedinica je jedan kvadratić)?',
    ['15', '18', '10', '21'],
    'Stranica $AB$ leži na x-osi, pa je visina jednostavno y-koordinata temena $C$ i $D$.', 'mreža',
    { mediji: G({ O: [0, 0], A: [-1, 0], B: [4, 0], C: [6, 3], D: [1, 3] }, [{ mreza: [-2, 7, -1, 4] }, { p: 'ABCD', b: 1 }], V({ bezImena: ['O'], velicina: 280 })) });
  Q(3, 'Romb ima stranicu 8 cm i oštar ugao 30°. Kolika mu je površina?',
    ['32 cm²', '64 cm²', '16 cm²', '24 cm²'],
    'Pravougli trougao sa uglom 30° je pola jednakostraničnog trougla, pa je naspramna kateta (visina) pola stranice: 4 cm.', 'ugao',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [14.93, 4], D: [6.93, 4], e: [6.93, 0] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '8 cm' }, { u: 'BAD', o: '30°', b: 1 }, { d: 'De', isp: 1, b: 3 }, { pu: 'DeB' }], V({ bezImena: ['A', 'B', 'C', 'D'], velicina: 280 })),
      medijiOdgovora: G({ A: [0, 0], B: [8, 0], C: [14.93, 4], D: [6.93, 4], e: [6.93, 0], f: [6.93, -4] }, [{ p: 'ABCD', b: 0 }, { p: 'ADf', b: 2, prazno: 1, isp: 1 }, { d: 'De', b: 3, o: '4 cm' }, { pu: 'DeB' }], V({ bezImena: ['A', 'B', 'C', 'D'], velicina: 280 })) });
  Q(3, 'Tri paralelograma imaju zajedničku osnovicu, a gornje stranice im leže na istoj pravoj paralelnoj osnovici. Šta važi za njihove površine?',
    ['Sve su jednake', 'Najveća je kod najkosijeg', 'Najveća je kod pravougaonika', 'Ne može se znati'],
    'Ovo tvrđenje se nalazi već u Euklidovim „Elementima“ (oko 300. godine pre n. e.): paralelogrami sa istom osnovicom između istih paralela imaju jednake površine.', 'euklid',
    { mediji: G({ a: [0, 0], b: [4, 0], c: [4, 3], d: [0, 3], e: [6, 3], f: [2, 3], g: [11, 3], h: [7, 3], k: [-3, 3], l: [12, 3] }, [{ d: 'kl', isp: 1, b: 4 }, { p: 'abcd', b: 0, prazno: 1 }, { p: 'abef', b: 1, prazno: 1 }, { p: 'abgh', b: 2, prazno: 1 }, { d: 'ab', debljina: 4, b: 3 }], V({ velicina: 300 })) });
  Q(3, 'Stranice paralelograma su u razmeri $a : b = 5 : 3$. U kojoj su razmeri visine $h_{a} : h_{b}$?',
    ['3 : 5', '5 : 3', '1 : 1', '25 : 9'],
    'Iz $a · h_{a} = b · h_{b}$ sledi da su visine obrnuto srazmerne stranicama – što je stranica duža, njena visina je kraća.', 'razmera',
    { mediji: G({ A: [0, 0], B: [5, 0], C: [6.8, 2.4], D: [1.8, 2.4] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '5' }, { d: 'BC', o: '3' }], V()) });
  U(2, 'Koji izraz NE daje površinu paralelograma (osim ako je pravougaonik)?',
    ['$a · b$', '$a · h_{a}$', '$b · h_{b}$', '$h_{a} · a$'],
    'Proizvod susednih stranica $a · b$ je površina samo kad je paralelogram pravougaonik. Ostali izrazi su ista formula „stranica puta njena visina“.',
    'Ako paralelogram napravimo od četiri štapića spojena zglobovima i „naginjemo“ ga, obim ostaje isti, a površina se smanjuje i teži nuli.', 'zglob',
    { mediji: paral(6, 3, 2, { oa: 'a', oh: 'hₐ', ob: 'b' }) });
  Q(1, 'Paralelogramu se visina udvostruči, a osnovica ostane ista. Šta se desi sa površinom?',
    ['Udvostruči se', 'Ostane ista', 'Poveća se 4 puta', 'Prepolovi se'],
    'Površina je srazmerna visini kad je osnovica stalna: dvostruka visina – dvostruka površina, trostruka – trostruka.', 'dvaput',
    { mediji: G({ a: [0, 0], b: [4, 0], c: [5, 2], d: [1, 2], e: [6, 4], f: [2, 4] }, [{ p: 'abef', b: 1, prazno: 1, isp: 1 }, { p: 'abcd', b: 0, gusto: 1 }], V()) });
  S(2, 'Spoji osnovicu i visinu paralelograma sa njegovom površinom.',
    [['7 cm i 3 cm', '21 cm²'], ['5 cm i 5 cm', '25 cm²'], ['6 cm i 4 cm', '24 cm²'], ['8 cm i 2,5 cm', '20 cm²']],
    'Paralelogram 5 × 5 ne mora biti kvadrat: romb stranice 5 cm i visine 5 cm jeste kvadrat, ali paralelogram sa osnovicom 5 cm i dužom kosom stranicom nije.', 'množenje');
  Q(3, 'Paralelogram ima stranice 10 cm i 6 cm i ugao 150°. Kolika mu je površina?',
    ['30 cm²', '60 cm²', '45 cm²', '15 cm²'],
    'Ugao od 150° ima susedni ugao 30°. Visina na stranicu od 10 cm je naspram ugla 30°, pa je pola od 6 cm, to jest 3 cm.', 'tupi',
    { mediji: G({ A: [0, 0], B: [10, 0], C: [15.2, 3], D: [5.2, 3] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '10 cm' }, { d: 'BC', o: '6 cm' }, { u: 'CBA', o: '150°', b: 1 }], V({ bezImena: ['A', 'B', 'C', 'D'], velicina: 280 })) });

  // ════════════════ 46. Površina trougla ════════════════
  L('Površina trougla');
  Q(1, 'Kako se računa površina trougla?',
    ['$P = {a · h_{a}|2}$', '$P = a · h_{a}$', '$P = {a + h_{a}|2}$', '$P = a · b · c$'],
    'Svaki trougao je tačno pola paralelograma sa istom osnovicom i visinom – zato deljenje sa 2.', 'formula',
    { mediji: trougao(6, 2, 4, { oa: 'a', oh: 'hₐ' }) });
  Q(1, 'Osnovica trougla je 10 cm, a visina na nju 6 cm. Kolika je površina?',
    ['30 cm²', '60 cm²', '16 cm²', '8 cm²'],
    'Najčešća greška je zaboravljeno deljenje sa 2. Dobro je proveriti: trougao mora imati manju površinu od pravougaonika 10 × 6.', 'pola',
    { mediji: trougao(10, 3.5, 6, { oa: '10 cm', oh: '6 cm' }) });
  Q(2, 'Zašto se u formuli za površinu trougla deli sa 2?',
    ['Dva ista trougla čine paralelogram', 'Trougao ima bar dva oštra ugla', 'Visina se meri iz dva temena', 'Trougao je uvek pola kvadrata'],
    'Kad trouglu dodamo njegovu kopiju okrenutu za 180° oko sredine jedne stranice, dobijamo paralelogram sa istom osnovicom i visinom.', 'kopija',
    { mediji: trougao(6, 2, 4, { oa: 'a', oh: 'h' }), medijiOdgovora: trougao(6, 2, 4, { oa: 'a', oh: 'h', kopija: true }) });
  Q(1, 'Katete pravouglog trougla su 6 cm i 8 cm. Kolika mu je površina?',
    ['24 cm²', '48 cm²', '14 cm²', '40 cm²'],
    'U pravouglom trouglu jedna kateta je visina na drugu, pa je površina pola proizvoda kateta – pola pravougaonika 6 × 8.', 'kateta',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [0, 6] }, [{ p: 'ABC', b: 0 }, { pu: 'BAC' }, { d: 'AB', o: '8 cm' }, { d: 'AC', o: '6 cm' }], V({ bezImena: ['A', 'B', 'C'] })),
      medijiOdgovora: G({ A: [0, 0], B: [8, 0], C: [0, 6], d: [8, 6] }, [{ p: 'ABdC', b: 4, prazno: 1, isp: 1 }, { p: 'ABC', b: 1, gusto: 1 }, { pu: 'BAC' }], V({ bezImena: ['A', 'B', 'C'] })) });
  Q(2, 'Trouglovi $ABC$, $ABD$ i $ABE$ imaju zajedničku stranicu $AB$, a temena $C$, $D$ i $E$ su na pravoj paralelnoj sa $AB$. Šta važi za njihove površine?',
    ['Jednake su', 'Najveću ima najviši trougao', 'Najveću ima pravougli trougao', 'Ne mogu se porediti'],
    'Sva tri trougla imaju istu osnovicu i istu visinu – rastojanje između paralelnih pravih. Oblik ne igra ulogu.', 'paralela',
    { mediji: G({ A: [0, 0], B: [5, 0], C: [-2, 3], D: [2.5, 3], E: [8, 3], k: [-3, 3], l: [9, 3] }, [{ d: 'kl', isp: 1, b: 4 }, { p: 'ABC', b: 0, prazno: 1 }, { p: 'ABD', b: 1, prazno: 1 }, { p: 'ABE', b: 2, prazno: 1 }, { d: 'AB', debljina: 4, b: 3 }], V({ velicina: 280 })) });
  Q(2, 'Površina trougla je 36 cm², a stranica $a = 9$ cm. Kolika je visina $h_{a}$?',
    ['8 cm', '4 cm', '27 cm', '18 cm'],
    'Iz $P = {a · h|2}$ sledi $h = {2P|a}$. Ko zaboravi dvojku dobije 4 cm – pa trougao ispadne dvostruko manji.', 'dvostruko',
    { mediji: trougao(9, 6, 4, { oa: '9 cm', oh: '?', e: [{ tx: '36 cm²', at: [3.4, 1], vel: 16 }] }) });
  Q(2, 'Kod tupouglog trougla visina iz jednog temena pada van trougla. Osnovica je 6 cm, a ta visina 4 cm. Kolika je površina?',
    ['12 cm²', '24 cm²', '10 cm²', '20 cm²'],
    'Formula važi i kad visina pada na produžetak stranice: trougao je i tada pola paralelograma sa istom osnovicom i visinom.', 'tupougli',
    { mediji: trougao(6, -2, 4, { oa: '6 cm', oh: '4 cm' }) });
  Q(3, 'Katete pravouglog trougla su 15 cm i 20 cm, a hipotenuza 25 cm. Kolika je visina na hipotenuzu?',
    ['12 cm', '15 cm', '6 cm', '10 cm'],
    'Površina se računa na dva načina: preko kateta (150 cm²) i preko hipotenuze i njene visine. Iz $25 · h : 2 = 150$ dobija se $h = 12$ cm.', 'hipotenuza',
    { mediji: G({ A: [0, 0], B: [25, 0], C: [9, 12], c: [9, 0] }, [{ p: 'ABC', b: 0 }, { pu: 'BCA' }, { d: 'AC', o: '15 cm' }, { d: 'BC', o: '20 cm' }, { d: 'AB', o: '25 cm' }, { d: 'Cc', isp: 1, b: 3, o: '?' }, { pu: 'CcB' }], V({ bezImena: ['A', 'B', 'C'], velicina: 280 })) });
  Q(2, 'Duž iz temena $C$ do sredine stranice $AB$ deli trougao na dva dela. Kakve su im površine?',
    ['Jednake', 'Veći je deo uz dužu stranicu', 'Odnos zavisi od ugla kod C', 'Jedan je dvostruko veći'],
    'Oba dela imaju jednake osnovice (polovine od $AB$) i istu visinu iz $C$. Ta duž se zove težišna duž i uči se u 7. razredu.', 'sredina',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [2, 5], M: [4, 0] }, [{ p: 'AMC', b: 1, gusto: 1 }, { p: 'MBC', b: 2, gusto: 1 }, { d: 'CM', b: 3 }], V()) });
  Q(3, 'Trougao ima temena $A(1, 1)$, $B(1, 6)$ i $C(5, 3)$. Kolika mu je površina (jedinica je jedan kvadratić)?',
    ['10', '20', '12', '15'],
    'Stranica $AB$ je uspravna (dužine 5), pa je visina na nju vodoravno rastojanje temena $C$ od prave $x = 1$, a to je 4.', 'koordinata',
    { mediji: G({ O: [0, 0], A: [1, 1], B: [1, 6], C: [5, 3] }, [{ mreza: [-1, 6, -1, 7] }, { p: 'ABC', b: 1 }], V({ bezImena: ['O'], velicina: 260 })),
      medijiOdgovora: G({ O: [0, 0], A: [1, 1], B: [1, 6], C: [5, 3], c: [1, 3] }, [{ mreza: [-1, 6, -1, 7] }, { p: 'ABC', b: 1 }, { d: 'Cc', isp: 1, b: 3, o: '4' }, { d: 'AB', b: 2, o: '5' }], V({ bezImena: ['O'], velicina: 260 })) });
  Q(2, 'Tačka $E$ je bilo gde na stranici $CD$ kvadrata $ABCD$ stranice 6 cm. Kolika je površina trougla $ABE$?',
    ['18 cm²', '36 cm²', '12 cm²', 'Zavisi od položaja E'],
    'Gde god da je $E$, trougao ima osnovicu 6 cm i visinu 6 cm (stranicu kvadrata). Zato uvek zauzima tačno pola kvadrata.', 'kvadrat',
    { mediji: G({ A: [0, 0], B: [6, 0], C: [6, 6], D: [0, 6], E: [2, 6] }, [{ p: 'ABCD', b: 4, prazno: 1 }, { p: 'ABE', b: 1, gusto: 1 }, { d: 'AB', o: '6 cm' }], V()) });
  U(1, 'Tri trougla imaju površinu 12 cm². Koji je uljez?',
    ['osnovica 6 cm, visina 2 cm', 'osnovica 6 cm, visina 4 cm', 'osnovica 8 cm, visina 3 cm', 'osnovica 12 cm, visina 2 cm'],
    'Trougao sa osnovicom 6 cm i visinom 2 cm ima površinu 6 · 2 : 2 = 6 cm². Ostali imaju po 12 cm².',
    'Trouglova iste površine ima beskonačno mnogo: dovoljno je da proizvod osnovice i visine bude isti.', 'jednako',
    { mediji: trougao(6, 2, 4, { oa: 'a', oh: 'h' }) });
  Q(2, 'Katete jednakokrako-pravouglog trougla su po 8 cm. Kolika mu je površina?',
    ['32 cm²', '64 cm²', '16 cm²', '24 cm²'],
    'Takav trougao je tačno pola kvadrata stranice 8 cm – kvadrat presečen dijagonalom. Takav je i trougaoni lenjir (geometrijski trougao).', 'lenjir',
    { mediji: G({}, [...kv(0, 8, 0, 8), lik([[0, 0], [8, 0], [0, 8]], { b: 1 })], V({ velicina: 220 })) });
  Q(3, 'Hipotenuza jednakokrako-pravouglog trougla je 10 cm. Kolika mu je površina?',
    ['25 cm²', '50 cm²', '100 cm²', '20 cm²'],
    'Visina na hipotenuzu je pola hipotenuze (5 cm), jer dve takve polovine čine kvadrat. Četiri ovakva trougla složena oko jedne tačke daju kvadrat stranice 10 cm.', 'hipotenuza',
    { mediji: G({ A: [0, 0], B: [10, 0], C: [5, 5], c: [5, 0] }, [{ p: 'ABC', b: 0 }, { pu: 'ACB' }, { d: 'AB', o: '10 cm' }], V({ bezImena: ['A', 'B', 'C'] })),
      medijiOdgovora: G({ A: [0, 0], B: [10, 0], C: [5, 5], c: [5, 0] }, [{ p: 'ABC', b: 4, prazno: 1, isp: 1 }, { p: 'AcC', b: 1, gusto: 1 }, { p: 'cBC', b: 2, gusto: 1, okreni: -90, oko: 'C', kasni: 0.5, trajanje: 1.8 }, { d: 'Cc', isp: 1, b: 3, o: '5 cm' }], V({ bezImena: ['A', 'B', 'C'] })) });
  Q(2, 'Pravougaonik $ABCD$ ima površinu 40 cm². Kolika je površina trougla $ABD$?',
    ['20 cm²', '40 cm²', '10 cm²', '80 cm²'],
    'Dijagonala deli pravougaonik na dva podudarna pravougla trougla, pa svaki ima pola površine.', 'dijagonala',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [8, 5], D: [0, 5] }, [{ p: 'ABCD', b: 4, prazno: 1 }, { p: 'ABD', b: 1, gusto: 1 }], V()) });
  S(3, 'Trougao ima površinu 84 cm². Spoji stranicu sa visinom koja joj odgovara.',
    [['14 cm', '12 cm'], ['12 cm', '14 cm'], ['21 cm', '8 cm'], ['24 cm', '7 cm']],
    'Proizvod stranice i njene visine je uvek dvostruka površina: ovde 168. Trougao sa stranicama 13, 14 i 15 cm ima baš površinu 84 cm².', 'visina',
    { mediji: trougao(7, 2.5, 4, { oa: 'a', oh: 'hₐ' }) });

  // ════════════════ 47. Površina trapeza ════════════════
  L('Površina trapeza');
  Q(1, 'Kako se računa površina trapeza sa osnovicama $a$ i $b$ i visinom $h$?',
    ['$P = {a + b|2} · h$', '$P = a · b · h$', '$P = (a + b) · h$', '$P = {a · b|2} · h$'],
    'Izraz ${a + b|2}$ je dužina srednje linije trapeza, pa se kraće piše $P = m · h$.', 'trapez',
    { mediji: trapez(7, 3, 2, 3, { oa: 'a', ob: 'b', oh: 'h' }) });
  Q(1, 'Osnovice trapeza su 9 cm i 5 cm, a visina 4 cm. Kolika je površina?',
    ['28 cm²', '56 cm²', '36 cm²', '18 cm²'],
    'Rezultat 56 je zbir osnovica puta visina – to je površina dva ista trapeza složena u paralelogram.', 'osnovica',
    { mediji: trapez(9, 5, 2, 4, { oa: '9 cm', ob: '5 cm', oh: '4 cm' }) });
  Q(2, 'Osnovice trapeza su 12 cm i 6 cm. Kolika je srednja linija?',
    ['9 cm', '18 cm', '6 cm', '3 cm'],
    'Srednja linija spaja sredine krakova, paralelna je osnovicama i duga je koliko njihova aritmetička sredina.', 'srednja',
    { mediji: trapez(12, 6, 3, 4, { oa: '12 cm', ob: '6 cm', srednja: '?' }) });
  Q(2, 'Trapez i njegova kopija okrenuta za 180° oko sredine kraka zajedno čine koji lik?',
    ['Paralelogram', 'Pravougaonik', 'Trougao', 'Veći trapez'],
    'Taj paralelogram ima osnovicu $a + b$ i istu visinu, pa je površina jednog trapeza pola od $(a + b) · h$.', 'kopija',
    { mediji: trapez(6, 3, 1.5, 3, { oa: 'a', ob: 'b' }), medijiOdgovora: trapez(6, 3, 1.5, 3, { oa: 'a', ob: 'b', kopija: true }) });
  Q(2, 'Trapez ima površinu 60 cm² i visinu 5 cm. Kolika je srednja linija?',
    ['12 cm', '24 cm', '6 cm', '55 cm'],
    'Iz $P = m · h$ srednja linija se dobija deljenjem površine visinom: $m = P : h$.', 'deljenje',
    { mediji: trapez(10, 5, 2, 5, { oh: '5 cm', srednja: '?', e: [{ tx: '60 cm²', at: [6, 1.1], vel: 16 }] }) });
  Q(2, 'Površina trapeza je 54 cm², duža osnovica 12 cm, a visina 6 cm. Kolika je kraća osnovica?',
    ['6 cm', '9 cm', '3 cm', '18 cm'],
    'Srednja linija je 54 : 6 = 9 cm, pa je zbir osnovica 18 cm. Česta greška je da se srednja linija proglasi za kraću osnovicu.', 'kraća',
    { mediji: trapez(12, 6, 3, 6, { oa: '12 cm', ob: '?', oh: '6 cm', x: { velicina: 250 } }) });
  Q(3, 'Jednakokraki trapez ima osnovice 11 cm i 5 cm, a uglovi na dužoj osnovici su 45°. Kolika mu je površina?',
    ['24 cm²', '48 cm²', '40 cm²', '16 cm²'],
    'Visine iz temena kraće osnovice odsecaju dva jednakokrako-pravougla trougla sa katetama (11 − 5) : 2 = 3 cm, pa je i visina 3 cm.', 'ugao',
    { mediji: G({ A: [0, 0], B: [11, 0], C: [8, 3], D: [3, 3] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '11 cm' }, { d: 'DC', o: '5 cm' }, { u: 'BAD', o: '45°', b: 1 }, { u: 'CBA', o: '45°', b: 1 }], V({ bezImena: ['A', 'B', 'C', 'D'] })),
      medijiOdgovora: G({ A: [0, 0], B: [11, 0], C: [8, 3], D: [3, 3], d: [3, 0], c: [8, 0] }, [{ p: 'ABCD', b: 0 }, { p: 'AdD', b: 2, gusto: 1 }, { p: 'cBC', b: 2, gusto: 1 }, { d: 'Dd', b: 3, o: '3 cm' }, { d: 'Ad', o: '3' }, { pu: 'DdB' }], V({ bezImena: ['A', 'B', 'C', 'D'] })) });
  Q(2, 'Pravougli trapez ima osnovice 8 cm i 4 cm, a krak normalan na osnovice dug je 3 cm. Kolika je površina?',
    ['18 cm²', '36 cm²', '24 cm²', '12 cm²'],
    'Kod pravouglog trapeza krak normalan na osnovice je ujedno i visina – ne treba je posebno crtati.', 'pravougli',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [4, 3], D: [0, 3] }, [{ p: 'ABCD', b: 0 }, { pu: 'BAD' }, { pu: 'ADC' }, { d: 'AB', o: '8 cm' }, { d: 'DC', o: '4 cm' }, { d: 'AD', o: '3 cm' }], V({ bezImena: ['A', 'B', 'C', 'D'] })) });
  Q(3, 'Trapez ima osnovice 10 cm i 4 cm i visinu 4 cm. Srednja linija ga deli na dva trapeza. Kolika je površina donjeg (uz dužu osnovicu)?',
    ['17 cm²', '14 cm²', '11 cm²', '28 cm²'],
    'Srednja linija je 7 cm, a oba nova trapeza imaju visinu 2 cm: donji (10 + 7) : 2 · 2 = 17, gornji (7 + 4) : 2 · 2 = 11. Delovi nisu jednaki!', 'nejednaki',
    { mediji: trapez(10, 4, 3, 4, { oa: '10 cm', ob: '4 cm', oh: '4 cm', srednja: true, e: [{ lin: [[0, 0], [10, 0], [8.5, 2], [1.5, 2]], zatv: 1, b: 1, gusto: 1 }] }) });
  U(1, 'Šta od ovoga NIJE potrebno da bi se izračunala površina trapeza?',
    ['dužine krakova', 'duža osnovica', 'kraća osnovica', 'visina'],
    'Za površinu su dovoljne osnovice i visina (ili srednja linija i visina). Krakovi mogu biti različito nagnuti, a površina ostaje ista.',
    'Trapezi sa istim osnovicama i visinom, ali različitim krakovima, imaju iste površine – kao i paralelogrami između istih paralela.', 'krak',
    { mediji: trapez(7, 3, 2, 3, { oa: 'a', ob: 'b', oh: 'h' }) });
  Q(2, 'Pročitaj sa mreže osnovice i visinu trapeza i izračunaj mu površinu (jedinica je jedan kvadratić).',
    ['28 kvadratića', '56 kvadratića', '36 kvadratića', '20 kvadratića'],
    'Formula se slaže sa brojanjem: osnovice 9 i 5, visina 4, pa je (9 + 5) : 2 · 4 = 28. Brojanje celih i „polovičnih“ kvadratića daje isto.', 'brojanje',
    { mediji: mreza(0, 9, 0, 5, [lik([[0, 0], [9, 0], [6, 4], [1, 4]])]) });
  Q(3, 'Kroz teme $D$ i sredinu kraka $BC$ trapeza povučena je prava do produžetka osnovice $AB$. Dobija se trougao iste površine kao trapez. Kolika mu je osnovica?',
    ['a + b', 'a − b', 'a', '2a'],
    'Mali trougao kod gornje osnovice „preklopi se“ na produžetak donje osnovice. Trougao sa osnovicom $a + b$ i visinom $h$ ima površinu ${(a + b) · h|2}$ – baš kao trapez.', 'trougao',
    { mediji: G({ A: [0, 0], B: [6, 0], C: [4, 3], D: [1, 3], f: [5, 1.5], r: [9, 0] }, [{ p: 'ABCD', b: 0 }, { d: 'Dr', isp: 1, b: 3 }, { d: 'Br', isp: 1, b: 4 }, { tacka: 'f', b: 3 }], V({ bezImena: ['C'] })),
      medijiOdgovora: G({ A: [0, 0], B: [6, 0], C: [4, 3], D: [1, 3], f: [5, 1.5], r: [9, 0] }, [{ p: 'ABfD', b: 0, gusto: 1 }, { p: 'DCf', b: 1, gusto: 1, okreni: 180, oko: 'f', kasni: 0.5, trajanje: 1.8 }, { d: 'Ar', o: 'a + b', os: -1 }], V({ bezImena: ['C'] })) });
  S(2, 'Spoji trapez (osnovice i visina) sa njegovom površinom.',
    [['6, 4 i 5 cm', '25 cm²'], ['10, 2 i 3 cm', '18 cm²'], ['7, 5 i 2 cm', '12 cm²'], ['9, 3 i 4 cm', '24 cm²']],
    'Brz način: prvo saberi osnovice, pa pomnoži sa visinom i tek na kraju podeli sa 2 – tako se izbegavaju decimalni brojevi.', 'zbir');
  Q(1, 'Šta je visina trapeza?',
    ['Rastojanje između osnovica', 'Dužina kraćeg kraka', 'Polovina duže osnovice', 'Dužina duže dijagonale'],
    'Pošto su osnovice paralelne, rastojanje između njih je isto u svakoj tački – visinu možemo povući iz bilo kog mesta na gornjoj osnovici.', 'rastojanje',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [6, 3], D: [2, 3], e: [3, 3], f: [3, 0], g: [5, 3], h: [5, 0] }, [{ p: 'ABCD', b: 0 }, { d: 'ef', isp: 1, b: 3 }, { d: 'gh', isp: 1, b: 3 }, { pu: 'efB' }, { pu: 'ghB' }], V({ bezImena: ['A', 'B', 'C', 'D'] })) });
  Q(3, 'Tačke $M$ i $N$ su sredine stranica $AC$ i $BC$ trougla $ABC$ površine 60 cm². Kolika je površina trapeza $ABNM$?',
    ['45 cm²', '30 cm²', '40 cm²', '15 cm²'],
    'Srednja linija $MN$ seče mali trougao $MNC$ koji je četvrtina celog (četiri takva trougla popločaju veliki). Ostaje 60 − 15 = 45 cm².', 'četvrtina',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [3, 6], M: [1.5, 3], N: [5.5, 3] }, [{ p: 'ABNM', b: 1, gusto: 1 }, { p: 'MNC', b: 4, prazno: 1 }], V()),
      medijiOdgovora: G({ A: [0, 0], B: [8, 0], C: [3, 6], M: [1.5, 3], N: [5.5, 3], k: [4, 0] }, [{ p: 'MNC', b: 2, gusto: 1 }, { p: 'AkM', b: 1, gusto: 1 }, { p: 'kBN', b: 1, gusto: 1 }, { p: 'kNM', b: 3, gusto: 1 }], V()) });
  Q(2, 'Trapez ima površinu 72 cm², a srednju liniju 12 cm. Kolika mu je visina?',
    ['6 cm', '3 cm', '12 cm', '60 cm'],
    'Kad se srednja linija pomnoži visinom dobije se površina, pa visinu dobijamo deljenjem: 72 : 12 = 6.', 'visina',
    { mediji: trapez(16, 8, 4, 6, { srednja: '12 cm', oh: '?', x: { velicina: 250 } }) });

  // ════════════════ 48. Površina četvorougla sa normalnim dijagonalama ════════════════
  L('Površina četvorougla sa normalnim dijagonalama');
  Q(1, 'Kako se računa površina četvorougla čije su dijagonale $d_{1}$ i $d_{2}$ normalne?',
    ['$P = {d_{1} · d_{2}|2}$', '$P = d_{1} · d_{2}$', '$P = {d_{1} + d_{2}|2}$', '$P = 2 · d_{1} · d_{2}$'],
    'Formula važi za svaki četvorougao sa normalnim dijagonalama – i za one koji nisu ni romb ni deltoid.', 'dijagonala',
    { mediji: normalne(3, 4, 2, 3, { o1: 'd₁', o2: 'd₂' }) });
  Q(1, 'Dijagonale romba su 10 cm i 6 cm. Kolika mu je površina?',
    ['30 cm²', '60 cm²', '16 cm²', '15 cm²'],
    'Dijagonale romba se seku pod pravim uglom i polove se, pa romb deli opisani pravougaonik 10 × 6 tačno na pola.', 'romb',
    { mediji: normalne(5, 5, 3, 3, { o1: '10 cm', o2: '6 cm' }) });
  Q(2, 'Zašto se u formuli $P = {d_{1} · d_{2}|2}$ deli sa 2?',
    ['Četvorougao je pola pravougaonika čije su stranice dijagonale', 'Dijagonale se uvek seku tačno na pola svoje dužine', 'Četvorougao ima dve dijagonale, pa se deli njihovim brojem', 'Dijagonale grade dva prava ugla, pa se deli sa dva'],
    'Svaki od četiri unutrašnja trougla ima podudarnog „blizanca“ u uglu opisanog pravougaonika – okrenutog za 180° oko sredine stranice četvorougla.', 'blizanac',
    { mediji: normalne(3, 4, 2, 3, { okvir: true }), medijiOdgovora: normalne(3, 4, 2, 3, { presavij: true }) });
  Q(2, 'Dijagonala kvadrata je 8 cm. Kolika je površina kvadrata?',
    ['32 cm²', '64 cm²', '16 cm²', '32 cm'],
    'Kvadrat je i romb, pa se njegova površina može računati i preko dijagonale: $P = {d²|2}$. Broj 64 bi bila površina kvadrata čija je stranica 8 cm.', 'kvadrat',
    { mediji: normalne(4, 4, 4, 4, { o1: '8 cm' }) });
  Q(2, 'Dijagonale deltoida su 12 cm i 7 cm. Kolika mu je površina?',
    ['42 cm²', '84 cm²', '19 cm²', '38 cm²'],
    'Kod deltoida se dijagonale seku normalno, ali samo jedna polovi drugu. Formula ipak važi, jer ne zavisi od toga gde se dijagonale seku.', 'deltoid',
    { mediji: normalne(2, 10, 3.5, 3.5, { o1: '12 cm', o2: '7 cm', x: { velicina: 260 } }) });
  Q(3, 'Kvadrat je upisan u krug poluprečnika 5 cm. Kolika je površina kvadrata?',
    ['50 cm²', '100 cm²', '25 cm²', '75 cm²'],
    'Dijagonala kvadrata upisanog u krug je prečnik kruga – 10 cm. Kvadrat zauzima oko 64 % površine kruga.', 'krug',
    { mediji: G({ O: [0, 0], A: [5, 0], B: [0, 5], C: [-5, 0], D: [0, -5] }, [{ kr: 'O', r: 5, b: 4 }, { p: 'ABCD', b: 0 }, { d: 'OA', o: '5 cm' }], V({ bezImena: ['A', 'B', 'C', 'D'] })) });
  Q(3, 'Romb ima obim 40 cm i dijagonale 16 cm i 12 cm. Kolika mu je visina?',
    ['9,6 cm', '9 cm', '12 cm', '4,8 cm'],
    'Površina se računa na dva načina: preko dijagonala (96 cm²) i kao stranica puta visina. Stranica je 10 cm, pa je visina 96 : 10.', 'obim',
    { mediji: normalne(8, 8, 6, 6, { o1: '16 cm', o2: '12 cm', x: { velicina: 250 } }) });
  U(1, 'Koji od ovih četvorouglova NEMA uvek normalne dijagonale?',
    ['pravougaonik', 'kvadrat', 'romb', 'deltoid'],
    'Dijagonale pravougaonika su jednake, ali se seku pod pravim uglom samo kad je on kvadrat.',
    'Zmajevi koje deca puštaju na vetru najčešće imaju oblik deltoida – po tome je deltoid na engleskom dobio ime „kite“ (zmaj).', 'zmaj',
    { medijiOdgovora: G({ a: [0, 0], b: [6, 0], c: [6, 3], d: [0, 3] }, [{ p: 'abcd', b: 0 }, { d: 'ac', isp: 1, b: 1 }, { d: 'bd', isp: 1, b: 3 }], V()) });
  Q(2, 'Plac ima oblik četvorougla sa normalnim dijagonalama dugim 50 m i 30 m. Koliko ari ima plac?',
    ['7,5 a', '15 a', '75 a', '750 a'],
    'Površina je 750 m², a jedan ar ima 100 m². Ko zaboravi da pretvori jedinice, dobije „750 ari“ – plac veći od sedam hektara!', 'parcela',
    { mediji: normalne(2, 3, 2, 3, { o1: '50 m', o2: '30 m' }) });
  Q(2, 'Obe dijagonale romba se udvostruče. Koliko puta se poveća površina?',
    ['4 puta', '2 puta', '8 puta', 'Ostane ista'],
    'Kao i kod kvadrata: kad se sve dužine udvostruče, površina se poveća 2 · 2 = 4 puta.', 'puta',
    { mediji: G({ a: [-2, 0], b: [0, -1], c: [2, 0], d: [0, 1], e: [-4, 0], f: [0, -2], g: [4, 0], h: [0, 2] }, [{ p: 'efgh', b: 1, prazno: 1, isp: 1 }, { p: 'abcd', b: 0, gusto: 1 }], V()) });
  Q(2, 'Četvorougao ima temena $A(0, 3)$, $B(3, 0)$, $C(6, 3)$ i $D(3, 8)$. Kolika mu je površina?',
    ['24', '48', '18', '30'],
    'Dijagonala $AC$ je vodoravna (dužine 6), a $BD$ uspravna (dužine 8) – zato su normalne. Ovaj četvorougao je deltoid.', 'deltoid',
    { mediji: G({ O: [0, 0], A: [0, 3], B: [3, 0], C: [6, 3], D: [3, 8] }, [{ mreza: [-1, 7, -1, 9] }, { p: 'ABCD', b: 1 }, { d: 'AC', isp: 1, b: 3 }, { d: 'BD', isp: 1, b: 3 }], V({ bezImena: ['O'], velicina: 260 })) });
  Q(3, 'Romb ima površinu 24 cm², a jednu dijagonalu 6 cm. Kolika je druga dijagonala?',
    ['8 cm', '4 cm', '18 cm', '12 cm'],
    'Iz $P = {d_{1} · d_{2}|2}$ sledi $d_{2} = {2P|d_{1}}$. Ovaj romb ima stranicu 5 cm – njegove polovine dijagonala su 3 i 4 cm.', 'romb',
    { mediji: normalne(3, 3, 4, 4, { o1: '6 cm', o2: '?' }) });
  S(2, 'Spoji dijagonale (normalne) sa površinom četvorougla.',
    [['4 cm i 6 cm', '12 cm²'], ['10 cm i 3 cm', '15 cm²'], ['8 cm i 5 cm', '20 cm²'], ['7 cm i 2 cm', '7 cm²']],
    'Ako je jedan od brojeva paran, zgodno je prvo njega prepoloviti: 8 · 5 : 2 = 4 · 5 = 20.', 'pola',
    { mediji: normalne(2, 3, 1.5, 2.5, { o1: 'd₁', o2: 'd₂' }) });
  Q(3, 'Duži $AB = 10$ cm i $CD = 6$ cm seku se pod pravim uglom, ali ne u svojim sredinama. Kolika je površina četvorougla $ACBD$?',
    ['30 cm²', '60 cm²', '15 cm²', 'Ne može se znati'],
    'Četvorougao se dijagonalom $AB$ deli na dva trougla sa osnovicom 10 cm; zbir njihovih visina je baš $CD$ = 6 cm. Zato je položaj preseka nebitan.', 'presek',
    { mediji: G({ A: [-2, 0], B: [8, 0], C: [0, -4], D: [0, 2], O: [0, 0] }, [{ p: 'ACBD', b: 0 }, { d: 'AB', b: 1, isp: 1, o: '10 cm', na: 0.7 }, { d: 'CD', b: 3, isp: 1, o: '6 cm', na: 0.25 }, { pu: 'BOD' }], V({ bezImena: ['O'] })) });
  Q(1, 'Kvadrat ima dijagonalu $d$. Koja formula daje njegovu površinu?',
    ['$P = {d²|2}$', '$P = d²$', '$P = 2d$', '$P = {d|2}$'],
    'Kvadrat stranice 4 cm ima površinu 16 cm²; kvadrat njegove dijagonale je 32, a pola od toga je opet 16.', 'formula',
    { mediji: G({ a: [0, 0], b: [4, 0], c: [4, 4], d: [0, 4] }, [{ p: 'abcd', b: 0 }, { d: 'ac', b: 1, o: 'd' }], V()) });
  Q(2, 'Romb ima dijagonale 8 cm i 6 cm, a pravougaonik stranice 8 cm i 6 cm. Kakav je odnos njihovih površina?',
    ['Romb je pola pravougaonika', 'Jednake su', 'Romb je četvrtina pravougaonika', 'Romb je veći'],
    'Temena romba su sredine stranica tog pravougaonika. Spajanjem sredina stranica bilo kog pravougaonika dobija se romb dvostruko manje površine.', 'sredine',
    { mediji: normalne(4, 4, 3, 3, { okvir: true, o1: '8 cm', o2: '6 cm' }) });
};
