// Tema 4: Podudarnost trouglova (lekcije 23–27 – geometrijske konstrukcije, osnovne konstrukcije
// trougla, podudarnost, stavovi podudarnosti, primene). Sopstveni zadaci po gradivu Matematike 6 (Arhiknjiga).
// Pomoćni crteži (konstrukcije šestarom, crtice jednakih stranica, trouglovi iz SSS/SUS/USU…) se izvoze
// i za teoriju: require('../zadaci-6/6-podudarnost').crtezi
const { G, r } = require('./osnova');

// ════════════════ pomoćni crteži ════════════════
const rad = (u) => (u * Math.PI) / 180;
const ste = (x) => (x * 180) / Math.PI;
const tk = (x, y) => [r(x), r(y)];
const dist = (P, Q) => Math.hypot(Q[0] - P[0], Q[1] - P[1]);
const pravac = (P, Q) => ste(Math.atan2(Q[1] - P[1], Q[0] - P[0]));
const naPravcu = (P, u, d) => tk(P[0] + d * Math.cos(rad(u)), P[1] + d * Math.sin(rad(u)));
// tačka na pravoj PQ: t = 0 → P, t = 1 → Q
const kroz = (P, Q, t) => tk(P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t);
const sred = (P, Q) => kroz(P, Q, 0.5);
const okreniT = (P, Z, u) => {
  const c = Math.cos(rad(u)), s = Math.sin(rad(u)), dx = P[0] - Z[0], dy = P[1] - Z[1];
  return tk(Z[0] + dx * c - dy * s, Z[1] + dx * s + dy * c);
};
// odraz tačke P preko prave MN
const odraziT = (P, M, N) => {
  const dx = N[0] - M[0], dy = N[1] - M[1], t = ((P[0] - M[0]) * dx + (P[1] - M[1]) * dy) / (dx * dx + dy * dy);
  return tk(2 * (M[0] + t * dx) - P[0], 2 * (M[1] + t * dy) - P[1]);
};
const pomeriT = (P, [dx, dy]) => tk(P[0] + dx, P[1] + dy);
// podnožje normale iz P na pravu AB
const noga = (P, A, B) => {
  const dx = B[0] - A[0], dy = B[1] - A[1], t = ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / (dx * dx + dy * dy);
  return tk(A[0] + t * dx, A[1] + t * dy);
};
// presek kružnica k(P, r1) i k(Q, r2); strana = 1 levo od smera P→Q, −1 desno
function presek(P, r1, Q, r2, strana = 1) {
  const d = dist(P, Q), a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const ux = (Q[0] - P[0]) / d, uy = (Q[1] - P[1]) / d;
  return tk(P[0] + a * ux - strana * h * uy, P[1] + a * uy + strana * h * ux);
}
// presek pravih: kroz P pod uglom u1 i kroz Q pod uglom u2 (stepeni)
function presekPravih(P, u1, Q, u2) {
  const [a, b] = [[Math.cos(rad(u1)), Math.sin(rad(u1))], [Math.cos(rad(u2)), Math.sin(rad(u2))]];
  const det = a[0] * -b[1] + b[0] * a[1];
  const t = ((Q[0] - P[0]) * -b[1] + b[0] * (Q[1] - P[1])) / det;
  return tk(P[0] + t * a[0], P[1] + t * a[1]);
}
// trouglovi: A u početku (ili opc.A), AB pod uglom opc.fi; vraća [A, B, C]
const smesti = (pts, { A = [0, 0], fi = 0 } = {}) => pts.map((p) => pomeriT(okreniT(p, [0, 0], fi), A));
// stranice a = BC, b = CA, c = AB
function sss(a, b, c, o) {
  const x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(b * b - x * x);
  return smesti([[0, 0], [c, 0], [x, y]], o);
}
// b = AC, α kod A, c = AB
const sus = (b, alfa, c, o) => smesti([[0, 0], [c, 0], [b * Math.cos(rad(alfa)), b * Math.sin(rad(alfa))]], o);
// c = AB, α kod A, β kod B
const usu = (c, alfa, beta, o) => sus((c * Math.sin(rad(beta))) / Math.sin(rad(alfa + beta)), alfa, c, o);
// centar i poluprečnik opisane i upisane kružnice
function opisana(A, B, C) {
  const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
  const k = (P) => P[0] * P[0] + P[1] * P[1];
  const O = tk((k(A) * (B[1] - C[1]) + k(B) * (C[1] - A[1]) + k(C) * (A[1] - B[1])) / d, (k(A) * (C[0] - B[0]) + k(B) * (A[0] - C[0]) + k(C) * (B[0] - A[0])) / d);
  return { O, R: r(dist(O, A)) };
}
function upisana(A, B, C) {
  const a = dist(B, C), b = dist(C, A), c = dist(A, B), s = a + b + c;
  const S = tk((a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s);
  return { S, r: r(dist(S, noga(S, A, B))) };
}

const IMENA = /[A-Z][0-9₀-₉′']*|[a-z][0-9]*/g;
const imena = (s) => String(s).match(IMENA) || [];
// crtice na duži PQ (n crtica = n-ti par jednakih stranica)
function crtice(P, Q, n = 1, { b = 3, dl = 0.32, razmak = 0.14, ...x } = {}) {
  const L = dist(P, Q), ux = (Q[0] - P[0]) / L, uy = (Q[1] - P[1]) / L, M = sred(P, Q);
  return Array.from({ length: n }, (_, i) => {
    const o = (i - (n - 1) / 2) * razmak, c = [M[0] + ux * o, M[1] + uy * o];
    return { lin: [tk(c[0] + uy * dl / 2, c[1] - ux * dl / 2), tk(c[0] - uy * dl / 2, c[1] + ux * dl / 2)], b, debljina: 2.5, ...x };
  });
}
// crtice po imenima tačaka: crt(T, 'AB', 2)
const crt = (T, s, n, x) => { const [p, q] = imena(s); return crtice(T[p], T[q], n, x); };
// oznaka ugla sa n lukova (n-ti par jednakih uglova)
const lukovi = (u, n = 1, b = 1, x = {}) => Array.from({ length: n }, (_, i) => ({ u, r: 15 + 6 * i, b, ...x }));
// luk šestara sa centrom u imenovanoj tački c, poluprečnika R, oko pravca ka tački X (±raspon°)
function sestar(T, c, R, X, { raspon = 20, kasni = 0.3, b = 4, trajanje = 0.7, ...x } = {}) {
  const u = pravac(T[c], X);
  return { l: c, r: r(R), od: r(u - raspon), do: r(u + raspon), crtaj: 1, kasni, trajanje, b, ...x };
}
// linija (lenjir) kroz tačke P i Q, produžena za `pro` (deo dužine) na obe strane; iscrtava se
const lenjir = (P, Q, { pro = 0, b = 1, kasni = 0.3, trajanje = 0.8, debljina = 2.2, ...x } = {}) =>
  ({ lin: [kroz(P, Q, -pro), kroz(P, Q, 1 + pro)], b, debljina, crtaj: 1, kasni, trajanje, ...x });

// konstrukcija simetrale duži ab (luci iz oba kraja, pa prava kroz preseke)
function simetralaEl(T, a, b, { R, kasni = 0.3, boja = 1, pro = 0.25, x = {} } = {}) {
  const A = T[a], B = T[b];
  R = R ?? dist(A, B) * 0.72;
  const p = presek(A, R, B, R, 1), q = presek(A, R, B, R, -1);
  return [
    sestar(T, a, R, p, { kasni, ...x }), sestar(T, a, R, q, { kasni: kasni + 0.4, ...x }),
    sestar(T, b, R, p, { kasni: kasni + 0.9, ...x }), sestar(T, b, R, q, { kasni: kasni + 1.3, ...x }),
    lenjir(q, p, { pro, b: boja, kasni: kasni + 2, ...x }),
  ];
}
// konstrukcija simetrale ugla kod temena o (kraci ka tačkama x1, x2): vraća { t, e } (pomoćne tačke u1, u2)
function simetralaUglaEl(T, o, x1, x2, { r1, kasni = 0.3, boja = 1, duz = 1.15, x = {} } = {}) {
  const O = T[o], a1 = pravac(O, T[x1]), a2 = pravac(O, T[x2]);
  r1 = r1 ?? Math.min(dist(O, T[x1]), dist(O, T[x2])) * 0.45;
  const u1 = naPravcu(O, a1, r1), u2 = naPravcu(O, a2, r1);
  const t = { u1, u2 };
  const rho = dist(u1, u2) * 0.8;
  const S = presek(u1, rho, u2, rho, Math.sign(((a2 - a1 + 540) % 360) - 180) || 1);
  const dalje = naPravcu(O, pravac(O, S), Math.min(dist(O, T[x1]), dist(O, T[x2])) * duz);
  const [od, doo] = [Math.min(a1, a2), Math.max(a1, a2)];
  const e = [
    { l: o, r: r(r1), od: r(od - 6), do: r(doo + 6), crtaj: 1, kasni, trajanje: 0.8, b: 4, ...x },
    sestar({ ...T, ...t }, 'u1', rho, S, { kasni: kasni + 0.9, raspon: 15, ...x }),
    sestar({ ...T, ...t }, 'u2', rho, S, { kasni: kasni + 1.4, raspon: 15, ...x }),
    lenjir(O, dalje, { b: boja, kasni: kasni + 2, debljina: 2.5, ...x }),
  ];
  return { t, e };
}
// par trouglova sa oznakama jednakih elemenata:
//   stranice: [['AB', 'DE', 1], …] (1, 2, 3 crtice), uglovi: [['BAC', 'EDF', 1], …]
function par(T, t1, t2, { stranice = [], uglovi = [], b1 = 0, b2 = 2, dl, e = [], x = {} } = {}) {
  // crtice srazmerne veličini crteža (~13 px)
  const xs = Object.values(T).map((p) => p[0]), ys = Object.values(T).map((p) => p[1]);
  dl = dl ?? r(Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * 0.045);
  const el = [{ p: t1, b: b1, id: 't1' }, { p: t2, b: b2, id: 't2' }];
  const BOJ = [3, 5, 1];
  stranice.forEach(([s1, s2, n]) => el.push(...crt(T, s1, n, { b: BOJ[n - 1], dl }), ...crt(T, s2, n, { b: BOJ[n - 1], dl })));
  uglovi.forEach(([u1, u2, n]) => el.push(...lukovi(u1, n, n === 1 ? 1 : n === 2 ? 2 : 5), ...lukovi(u2, n, n === 1 ? 1 : n === 2 ? 2 : 5)));
  return G(T, [...el, ...e], { velicina: 340, ...x });
}

const crtezi = {
  rad, ste, tk, dist, pravac, naPravcu, kroz, sred, okreniT, odraziT, pomeriT, noga, presek, presekPravih,
  smesti, sss, sus, usu, opisana, upisana, crtice, crt, lukovi, sestar, lenjir, simetralaEl, simetralaUglaEl, par,
};

// ════════════════ zadaci ════════════════
module.exports = ({ L, Z, K, R, proveri }) => {
  const ugao = (deg) => (Number.isInteger(deg) ? `${deg}°` : `${Math.floor(deg)}°${Math.round((deg % 1) * 60)}′`);

  // ════════ 4.1 Geometrijske konstrukcije ════════
  L('Geometrijske konstrukcije');

  {
    // prav ugao, pa dve simetrale: 45°, 22°30′
    const O = [0, 0], T = { O, x: [5, 0], y: [0, 5], s1: naPravcu(O, 45, 5.2), s2: naPravcu(O, 22.5, 5.4) };
    proveri(90 / 2 / 2 === 22.5, '90 : 2 : 2 = 22,5');
    Z(1, 'Polazi se od pravog ugla i više puta se konstruiše simetrala ugla. Koliko puta treba konstruisati simetralu da bi se dobio ugao od $22°30′$?',
      ['$2$', '$3$', '$1$', '$4$'],
      [K('Prva simetrala deli prav ugao na dva ugla od $90° : 2 = 45°$.', ['s1']),
       K('Druga simetrala deli ugao od $45°$ na dva ugla od $45° : 2 = 22°30′$ (pola stepena je $30′$).', ['s2']),
       K('Dakle, simetrala se konstruiše $2$ puta: $90° : 2 : 2 = 22°30′$.')],
      G(T, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Oy', b: 0, debljina: 3 }, { pu: 'xOy' },
        { d: 'Os1', b: 1, debljina: 2.5, k: 1, id: 's1', crtaj: 1 }, { u: 'xOs1', r: 90, b: 1, o: '45°', k: 1 },
        { d: 'Os2', b: 2, debljina: 2.5, k: 2, id: 's2', crtaj: 1 }, { u: 'xOs2', r: 55, b: 2, o: '22°30′', k: 2 }], { velicina: 260 }));
  }

  {
    // 60° iz jednakostraničnog trougla, pa simetrala → 30°
    const O = [0, 0], B = [4, 0], C = naPravcu(O, 60, 4), T = { O, B, C, x: [6, 0], c: naPravcu(O, 60, 5.6), s: naPravcu(O, 30, 6) };
    Z(1, 'Ugao od $30°$ konstruiše se tako što se prvo konstruiše neki drugi ugao, pa njegova simetrala. Koji je to ugao?',
      ['$60°$', '$90°$', '$45°$', '$120°$'],
      [K('$30° · 2 = 60°$, pa treba prvo konstruisati ugao od $60°$.'),
       K('Ugao od $60°$ dobijamo iz jednakostraničnog trougla $OBC$: luk iz $O$ seče polupravu u $B$, a luk istog poluprečnika iz $B$ seče prvi luk u $C$.', ['tr']),
       K('Simetrala ugla $BOC$ ga deli na dva ugla od $30°$.', ['s'])],
      G(T, [{ d: 'Ox', b: 0, debljina: 3 },
        { l: 'O', r: 4, od: -8, do: 72, crtaj: 1, b: 4, k: 2 }, { l: 'B', r: 4, od: 105, do: 135, crtaj: 1, kasni: 1, b: 4, k: 2 },
        { p: 'OBC', b: 2, prazno: 1, id: 'tr', k: 2 }, { d: 'Oc', b: 1, debljina: 3, k: 2 }, { u: 'BOC', r: 42, b: 1, o: '60°', k: 2 },
        { d: 'Os', b: 3, debljina: 3, crtaj: 1, k: 3, id: 's' }, { u: 'xOs', r: 26, b: 3, o: '30°', k: 3 }], { velicina: 260 }));
  }

  {
    const O = [0, 0], T = { O, x: [5, 0], y: [0, 5], z: naPravcu(O, 120, 5), m: [-5, 0] };
    proveri(90 + 60 / 2 === 120, '90 + 30 = 120');
    Z(1, 'Uglu od $90°$ nadovezan je ugao koji je polovina ugla od $60°$. Koliki je dobijeni ugao?',
      ['$120°$', '$150°$', '$105°$', '$135°$'],
      [K('Polovina ugla od $60°$ je $60° : 2 = 30°$ (simetrala ugla od $60°$).', ['b']),
       K('Nadovezivanjem: $90° + 30° = 120°$.', ['a', 'b']),
       K('Isti ugao može se dobiti i kao $2 · 60°$ – na opruženom uglu se dvaput nanese luk poluprečnika jednakog poluprečniku prvog luka.')],
      G(T, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Oy', b: 0, debljina: 3 }, { d: 'Oz', b: 0, debljina: 3, k: 1 }, { d: 'Om', b: 4, isp: 1 },
        { pu: 'xOy', id: 'a' }, { u: 'yOz', r: 30, b: 1, o: '30°', id: 'b', k: 1 }, { u: 'xOz', r: 56, b: 2, o: '?', k: 2 }], { velicina: 260 }));
  }

  {
    const O = [0, 0], T = { O, x: [5.5, 0], a: naPravcu(O, 50, 5.5), b: naPravcu(O, 70, 5.5), s: naPravcu(O, 35, 6) };
    proveri((50 + 20) / 2 === 35, '(50 + 20) : 2 = 35');
    Z(2, 'Dati su uglovi $α = 50°$ i $β = 20°$. Konstruisan je ugao $α + β$ (nadovezivanjem), a zatim njegova simetrala. Koliki ugao simetrala zaklapa sa krakom ugla?',
      ['$35°$', '$70°$', '$15°$', '$25°$'],
      [K('Nadovezivanjem uglova dobija se $α + β = 50° + 20° = 70°$.', ['ab']),
       K('Simetrala deli ugao na dva jednaka dela: $70° : 2 = 35°$.', ['s'])],
      G(T, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Oa', b: 4, isp: 1 }, { d: 'Ob', b: 0, debljina: 3 },
        { u: 'xOa', r: 50, b: 1, o: 'α' }, { u: 'aOb', r: 70, b: 2, o: 'β' }, { u: 'xOb', r: 100, b: 3, id: 'ab', k: 1 },
        { d: 'Os', b: 1, debljina: 3, crtaj: 1, k: 2, id: 's' }, { u: 'xOs', r: 34, b: 1, o: '35°', k: 2 }], { velicina: 260 }));
  }

  {
    // tupougli: ∠A = 30°, ∠B = 110°; visina iz C pada na produžetak AB iza B
    const [A, B, C] = usu(4, 30, 110);
    const D = noga(C, A, B);
    proveri(180 - 110 === 70 && 90 - 70 === 20, '∠CBD = 70°, ∠BCD = 20°');
    Z(3, 'U trouglu $ABC$ je $∠A = 30°$ i $∠B = 110°$. Iz temena $C$ povučena je visina $CD$ (tačka $D$ je na pravoj $AB$). Koliki je ugao $BCD$?',
      ['$20°$', '$40°$', '$70°$', '$60°$'],
      [K('Ugao kod $B$ je tup, pa podnožje $D$ visine iz $C$ pada na produžetak stranice $AB$, iza temena $B$.', ['h']),
       K('Ugao $CBD$ je naporedan sa uglom od $110°$: $∠CBD = 180° − 110° = 70°$.', ['ub']),
       K('U pravouglom trouglu $BDC$ zbir oštrih uglova je $90°$: $∠BCD = 90° − 70° = 20°$.', ['uc'])],
      G({ A, B, C, D: [D[0], D[1], -90] }, [{ p: 'ABC', b: 0 }, { u: 'BAC', o: '30°', b: 1 }, { u: 'CBA', o: '110°', b: 1 },
        { d: 'BD', b: 4, isp: 1 }, { d: 'CD', b: 2, debljina: 3, id: 'h', k: 1 }, { pu: 'CDB', k: 1 },
        { u: 'DBC', b: 3, o: '70°', id: 'ub', k: 2 }, { u: 'BCD', b: 5, r: 34, id: 'uc', k: 3 }], { velicina: 260 }));
  }

  {
    const T = { A: [0, 0], B: [4.5, 0], C: [0, 3.2] };
    const H = noga(T.A, T.B, T.C);
    Z(2, 'Koliko visina pravouglog trougla leži na njegovim stranicama?',
      ['$2$', '$3$', '$1$', '$0$'],
      [K('Katete su normalne jedna na drugu: visina iz $B$ na pravu $AC$ je baš kateta $AB$, a visina iz $C$ je kateta $AC$.', ['k1', 'k2']),
       K('Treća visina, iz temena pravog ugla na hipotenuzu, je unutar trougla i ne leži na stranici.', ['h']),
       K('Dakle, dve visine se poklapaju sa katetama.')],
      G({ ...T, H }, [{ p: 'ABC', b: 0 }, { pu: 'BAC' }, { d: 'AB', b: 1, debljina: 4, id: 'k1', k: 1 }, { d: 'AC', b: 2, debljina: 4, id: 'k2', k: 1 },
        { d: 'AH', b: 3, isp: 1, id: 'h', k: 2 }, { pu: 'AHB', k: 2 }], { velicina: 240, bezImena: ['H'] }));
  }

  {
    const O = [0, 0], T = { O, x: [5.5, 0], y: naPravcu(O, 84, 5.5), s: naPravcu(O, 42, 5.8), t: naPravcu(O, 21, 6) };
    proveri(84 / 2 === 42 && 42 / 2 === 21 && 84 - 21 === 63, '∠tOy = 63°');
    Z(2, 'Dat je ugao $xOy = 84°$. Konstruisana je njegova simetrala $Os$, a zatim simetrala $Ot$ ugla $xOs$. Koliki je ugao $tOy$?',
      ['$63°$', '$21°$', '$42°$', '$105°$'],
      [K('$∠xOs = ∠sOy = 84° : 2 = 42°$.', ['s']),
       K('$∠xOt = ∠tOs = 42° : 2 = 21°$.', ['t']),
       K('$∠tOy = ∠tOs + ∠sOy = 21° + 42° = 63°$ (ili $84° − 21°$).', ['ty'])],
      G(T, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Oy', b: 0, debljina: 3 }, { u: 'xOy', r: 30, b: 4, o: '84°' },
        { d: 'Os', b: 1, debljina: 2.5, crtaj: 1, k: 1, id: 's' }, { d: 'Ot', b: 2, debljina: 2.5, crtaj: 1, k: 2, id: 't' },
        { u: 'xOt', r: 80, b: 2, k: 2, o: '21°' }, { u: 'tOy', r: 50, b: 3, k: 3, id: 'ty' }], { velicina: 260 }));
  }

  {
    const O = [0, 0], T = { O, x: [5, 0], a: naPravcu(O, 120, 5), b: naPravcu(O, 135, 5), m: [-5, 0] };
    proveri(120 + 60 / 2 / 2 === 135, '120 + 15 = 135');
    Z(3, 'Uglu od $120°$ nadovezan je ugao koji se dobija kada se ugao od $60°$ dvaput prepolovi (simetralom). Koliki je dobijeni ugao?',
      ['$135°$', '$150°$', '$127°30′$', '$140°$'],
      [K('Ugao od $60°$ prepolovljen jednom daje $30°$, a drugi put $15°$.'),
       K('$120° + 15° = 135°$.', ['u']),
       K('Isti ugao se dobija i kao $90° + 45°$ – konstrukcija često ima više puteva.')],
      G(T, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Om', b: 4, isp: 1 }, { d: 'Oa', b: 4, debljina: 2 }, { d: 'Ob', b: 0, debljina: 3 },
        { u: 'xOa', r: 26, b: 1, o: '120°' }, { u: 'aOb', r: 50, b: 2, o: '15°' }, { u: 'xOb', r: 72, b: 3, id: 'u', k: 2 }], { velicina: 260 }));
  }

  {
    const [A, B, C] = usu(6, 35, 75);
    const D = noga(C, A, B);
    proveri(180 - 35 - 75 === 70 && 90 - 35 === 55, '∠ACD = 55°');
    Z(2, 'U trouglu $ABC$ je $∠A = 35°$ i $∠B = 75°$, a $CD$ je visina na stranicu $AB$. Koliki je ugao $ACD$?',
      ['$55°$', '$15°$', '$70°$', '$35°$'],
      [K('Visina $CD$ je normalna na $AB$, pa je trougao $ADC$ pravougli (prav ugao kod $D$).', ['adc']),
       K('U pravouglom trouglu zbir oštrih uglova je $90°$: $∠ACD = 90° − 35° = 55°$.'),
       K('Provera: $∠BCD = 90° − 75° = 15°$, a $55° + 15° = 70° = 180° − 35° − 75°$ ✓')],
      G({ A, B, C, D: [D[0], D[1], -90] }, [{ p: 'ABC', b: 0 }, { u: 'BAC', o: '35°', b: 1 }, { u: 'CBA', o: '75°', b: 1 },
        { d: 'CD', b: 2, debljina: 3 }, { pu: 'CDB' }, { p: 'ADC', b: 3, id: 'adc', k: 1 }, { u: 'ACD', r: 36, b: 5, o: '?', k: 2 }], { velicina: 260 }));
  }

  {
    // normala iz M na pravu a: kružnica iz M seče a u P i Q; PQ = 9 cm
    const M = [0, 3], P = [-4.5, 0], Q = [4.5, 0], N = [0, 0, -90];
    const T = { M, P: [P[0], P[1], -100], Q: [Q[0], Q[1], -80], N, a1: [-6.5, 0], a2: [6.5, 0], m2: [0, -3] };
    const Rk = dist(M, P);
    Z(2, 'Konstruiše se normala iz tačke $M$ na pravu $a$: kružnica sa centrom $M$ seče pravu u tačkama $P$ i $Q$, a $N$ je podnožje normale. Ako je $PQ = 9 cm$, koliko je $PN$?',
      ['$4,5 cm$', '$9 cm$', '$3 cm$', '$18 cm$'],
      [K('Tačka $M$ je jednako udaljena od $P$ i $Q$ ($MP = MQ$ – poluprečnici), pa normala iz $M$ je simetrala duži $PQ$.', ['sim']),
       K('Simetrala prolazi kroz središte duži, pa je $N$ središte duži $PQ$.'),
       K('$PN = 9 cm : 2 = 4,5 cm$.', ['pn'])],
      G(T, [{ d: 'a1a2', b: 0, debljina: 2.5 }, { tx: 'a', at: [6.2, 0.4] }, { tacka: 'M', b: 1 },
        { l: 'M', r: r(Rk), od: 195, do: 345, crtaj: 1, b: 4 }, { tacka: 'P', b: 3 }, { tacka: 'Q', b: 3 },
        sestar(T, 'P', Rk, T.m2, { kasni: 1.4, k: 1 }), sestar(T, 'Q', Rk, T.m2, { kasni: 1.9, k: 1 }),
        { d: 'Mm2', b: 1, debljina: 2.5, crtaj: 1, kasni: 2.5, k: 1, id: 'sim' }, { pu: 'MNQ', k: 1 },
        { d: 'PN', b: 2, debljina: 4, id: 'pn', k: 3, o: '?' }], { velicina: 280, bezImena: ['N'] }));
  }

  // ════════ 4.2 Osnovne konstrukcije trougla ════════
  L('Osnovne konstrukcije trougla');

  {
    const [A, B, C] = usu(7, 20, 20);
    proveri((180 - 140) / 2 === 20, '(180 − 140) : 2 = 20');
    Z(1, 'Konstruiše se jednakokraki trougao čija je osnovica $7 cm$, a ugao pri vrhu $140°$. Koliki ugao treba konstruisati na krajevima osnovice?',
      ['$20°$', '$40°$', '$70°$', '$35°$'],
      [K('Uglovi na osnovici jednakokrakog trougla su jednaki, a zbir sva tri ugla je $180°$.'),
       K('$(180° − 140°) : 2 = 40° : 2 = 20°$.', ['ug']),
       K('Sada su poznati osnovica i dva nalegla ugla – trougao se konstruiše po USU.')],
      G({ A, B, C }, [{ p: 'ABC', b: 0 }, { d: 'AB', o: '7 cm' }, { u: 'BCA', o: '140°', b: 2 },
        ...crt({ A, B, C }, 'AC', 1, { dl: 0.3 }), ...crt({ A, B, C }, 'BC', 1, { dl: 0.3 }),
        { u: 'BAC', b: 1, r: 40, id: 'ug', k: 2, o: '20°' }, { u: 'CBA', b: 1, r: 40, id: 'ug', k: 2, o: '20°' }], { velicina: 280 }));
  }

  {
    // SSS 4, 5, 8: kružnice k(A, 5) i k(B, 4) se seku
    const A = [0, 0], B = [8, 0], C = presek(A, 5, B, 4, 1);
    proveri(4 + 5 > 8 && !(3 + 4 > 8) && !(2 + 5 > 7) && !(1 + 6 > 8), 'nejednakost trougla');
    Z(1, 'Od koje trojke duži može da se konstruiše trougao?',
      ['$4 cm$, $5 cm$, $8 cm$', '$3 cm$, $4 cm$, $8 cm$', '$2 cm$, $5 cm$, $7 cm$', '$1 cm$, $6 cm$, $8 cm$'],
      [K('Trougao postoji samo ako je zbir dve kraće stranice veći od najduže (nejednakost trougla).'),
       K('$4 + 5 = 9 > 8$ ✓; $3 + 4 = 7 < 8$; $2 + 5 = 7$ nije veće od $7$; $1 + 6 = 7 < 8$.'),
       K('Za $4$, $5$, $8$: luci $k(A, 5 cm)$ i $k(B, 4 cm)$ seku se u temenu $C$.', ['tr'])],
      R(G({ A, B, C }, [{ d: 'AB', b: 0, debljina: 3, o: '8 cm' }, { l: 'A', r: 5, od: 5, do: 70, crtaj: 1, b: 1 }, { l: 'B', r: 4, od: 105, do: 175, crtaj: 1, kasni: 1.1, b: 2 },
        { p: 'ABC', b: 3, prazno: 1, id: 'tr', k: 3 }, { d: 'AC', b: 1, o: '5', k: 3 }, { d: 'BC', b: 2, o: '4', k: 3 }], { velicina: 300 })));
  }

  {
    const A = [0, 0], B = [5, 0], T = { A, B, a: naPravcu(A, 70, 6), b: naPravcu(B, 180 - 115, 6) };
    proveri(70 + 115 > 180 && 70 + 105 < 180 && 70 + 95 < 180 && 70 + 45 < 180, 'zbir uglova');
    Z(1, 'Konstruiše se trougao $ABC$ ako je $AB = 5 cm$ i $∠A = 70°$. Za koju vrednost ugla $B$ takav trougao NE postoji?',
      ['$115°$', '$105°$', '$95°$', '$45°$'],
      [K('Zbir dva ugla trougla mora biti manji od $180°$ (treći ugao je $180°$ minus njihov zbir).'),
       K('$70° + 115° = 185° > 180°$ – kraci uglova se „razilaze“ i ne seku se.', ['k1', 'k2']),
       K('Za $105°$, $95°$ i $45°$ zbirovi su $175°$, $165°$ i $115°$ – trougao postoji.')],
      R(G(T, [{ d: 'AB', b: 0, debljina: 3, o: '5 cm' }, { d: 'Aa', b: 1, crtaj: 1, id: 'k1' }, { d: 'Bb', b: 2, crtaj: 1, kasni: 0.8, id: 'k2' },
        { u: 'BAa', o: '70°', b: 1 }, { u: 'bBA', o: '115°', b: 2, r: 18 }], { velicina: 260 })));
  }

  {
    const B = [0, 0], C = [5, 0];
    const A = presekPravih(B, 30, C, 180 - 45);
    const T = { A, B, C, x: [6.5, 0], y: naPravcu(B, 30, 5.4), z: naPravcu(C, 135, 4.4) };
    proveri(180 - 30 - 45 === 105, 'α = 105');
    Z(2, 'Konstruisan je trougao $ABC$ ako je $BC = 5 cm$, $∠B = 30°$ i $∠C = 45°$. Koliki je ugao kod temena $A$?',
      ['$105°$', '$75°$', '$115°$', '$95°$'],
      [K('Na duž $BC$ naležu uglovi od $30°$ i $45°$: kraci $By$ i $Cz$ se seku u temenu $A$ (konstrukcija USU).', ['ky', 'kz']),
       K('Zbir uglova trougla je $180°$: $∠A = 180° − 30° − 45° = 105°$.', ['ua'])],
      G(T, [{ d: 'Bx', b: 4, isp: 1 }, { d: 'BC', b: 0, debljina: 3, o: '5 cm' }, { d: 'By', b: 1, crtaj: 1, id: 'ky' }, { d: 'Cz', b: 2, crtaj: 1, kasni: 0.9, id: 'kz' },
        { u: 'CBy', o: '30°', b: 1, r: 34 }, { u: 'zCB', o: '45°', b: 2 }, { p: 'ABC', b: 3, k: 1 }, { u: 'BAC', b: 5, r: 18, id: 'ua', k: 2 }], { velicina: 280 }));
  }

  {
    const [A, B, C] = usu(5, 30, 60);
    Z(2, 'Konstruiše se pravougli trougao $ABC$ sa hipotenuzom $AB = 5 cm$ i $∠B = 60°$. Koja dva ugla treba konstruisati na krajevima hipotenuze?',
      ['$30°$ i $60°$', '$60°$ i $90°$', '$30°$ i $90°$', '$60°$ i $60°$'],
      [K('Prav ugao je kod temena $C$, naspram hipotenuze – ne naleže na nju.', ['pu']),
       K('Drugi oštar ugao: $∠A = 90° − 60° = 30°$.'),
       K('Na hipotenuzu naležu uglovi od $30°$ i $60°$ – konstrukcija po USU.', ['ua', 'ub'])],
      G({ A, B, C }, [{ p: 'ABC', b: 0 }, { d: 'AB', o: '5 cm' }, { pu: 'ACB', id: 'pu' }, { u: 'CBA', b: 1, o: '60°', id: 'ub' }, { u: 'BAC', b: 2, o: '?', id: 'ua' }], { velicina: 260 }));
  }

  {
    const A = [0, 0], B = [6, 0], C1 = presek(A, 5, B, 4, 1), C2 = presek(A, 5, B, 4, -1);
    const T = { A, B, 'C₁': C1, 'C₂': C2 };
    Z(2, 'Konstruiše se trougao sa stranicama $AB = 6 cm$, $AC = 5 cm$ i $BC = 4 cm$. Kružnice $k(A, 5 cm)$ i $k(B, 4 cm)$ – u koliko tačaka se seku?',
      ['$2$', '$1$', '$0$', '$4$'],
      [K('Pošto je $4 + 5 > 6$, $5 + 6 > 4$ i $4 + 6 > 5$, kružnice se seku – po jednom presek sa svake strane prave $AB$.', ['k1', 'k2']),
       K('Dobijaju se trouglovi $ABC₁$ i $ABC₂$, simetrični u odnosu na $AB$, pa su podudarni: to je isti trougao.', ['t1', 't2'])],
      G(T, [{ d: 'AB', b: 0, debljina: 3, o: '6 cm' }, { kr: 'A', r: 5, b: 1, crtaj: 1, id: 'k1', k: 1 }, { kr: 'B', r: 4, b: 2, crtaj: 1, kasni: 1, id: 'k2', k: 1 },
        { p: 'ABC₁', b: 3, id: 't1', k: 2 }, { p: 'ABC₂', b: 5, id: 't2', k: 2 }], { velicina: 260, bezImena: ['C₁', 'C₂'] }));
  }

  {
    const moguce = []; for (let x = 1; x < 20; x++) if (x < 3 + 7 && 3 + x > 7) moguce.push(x);
    proveri(moguce.join() === '5,6,7,8,9', 'treća stranica 5–9');
    const A = [0, 0], B = [7, 0];
    Z(2, 'Dve stranice trougla su $3 cm$ i $7 cm$, a treća je ceo broj centimetara. Koliko različitih trouglova može da se konstruiše?',
      ['$5$', '$4$', '$6$', '$9$'],
      [K('Treća stranica $x$ mora biti manja od zbira: $x < 3 + 7 = 10$.'),
       K('I veća od razlike: $x > 7 − 3 = 4$ (inače $3 + x$ nije veće od $7$).'),
       K('$x ∈ \\{5, 6, 7, 8, 9\\}$ – ukupno $5$ trouglova.')],
      G({ A, B }, [{ d: 'AB', b: 0, debljina: 3, o: '7 cm' }, { l: 'B', r: 3, od: 0, do: 180, b: 2, crtaj: 1 }, { tx: '3 cm', at: [7, 3.5], b: 2 },
        ...[5, 6, 7, 8, 9].map((x, i) => ({ l: 'A', r: x, od: 0, do: 40, b: 1, crtaj: 1, kasni: 0.5 + 0.3 * i, k: 3 }))], { velicina: 300 }));
  }

  {
    // SSU sa uglom naspram MANJE stranice: AC = 4, BC = 3, α = 40° → dva trougla
    const A = [0, 0], C = naPravcu(A, 40, 4);
    const kos = Math.cos(rad(40)), dis = 64 * kos * kos - 4 * 7;
    const t1 = (8 * kos - Math.sqrt(dis)) / 2, t2 = (8 * kos + Math.sqrt(dis)) / 2;
    proveri(dis > 0 && t1 > 0 && t2 > 0, 'dva preseka na polupravoj');
    const T = { A, C, 'B₁': [r(t1), 0, -90], 'B₂': [r(t2), 0, -90], x: [6.5, 0] };
    Z(3, 'Konstruiše se trougao $ABC$ ako je $AC = 4 cm$, $BC = 3 cm$ i $∠A = 40°$. Koliko različitih (nepodudarnih) trouglova se dobija?',
      ['$2$', '$1$', '$0$', 'beskonačno mnogo'],
      [K('Teme $B$ je na polupravoj $Ax$ i na kružnici $k(C, 3 cm)$.', ['kr']),
       K('Ugao od $40°$ je naspram manje stranice ($BC = 3 < 4 = AC$), pa kružnica seče polupravu u dve tačke $B₁$ i $B₂$.', ['b1', 'b2']),
       K('Trouglovi $AB₁C$ i $AB₂C$ nisu podudarni – zato stav SSU traži ugao naspram veće stranice.')],
      R(G(T, [{ d: 'Ax', b: 0, debljina: 2.5 }, { d: 'AC', b: 0, debljina: 3, o: '4 cm' }, { u: 'xAC', o: '40°', b: 1 },
        { kr: 'C', r: 3, b: 4, crtaj: 1, id: 'kr' }, { p: 'AB₁C', b: 2, id: 'b1', k: 2 }, { p: 'AB₂C', b: 3, prazno: 1, id: 'b2', k: 2 }], { velicina: 260 })));
  }

  {
    const [A, B, C] = usu(5, 30, 30);
    proveri(180 - 2 * 30 === 120, 'γ = 120');
    Z(3, 'Konstruisan je jednakokraki trougao $ABC$ ($AC = BC$) u kome je $AB = 5 cm$ i $∠ABC = 30°$. Koliki je ugao pri vrhu $C$?',
      ['$120°$', '$30°$', '$150°$', '$60°$'],
      [K('U jednakokrakom trouglu uglovi na osnovici su jednaki: $∠BAC = ∠ABC = 30°$.', ['ua']),
       K('$∠ACB = 180° − 30° − 30° = 120°$.', ['uc'])],
      G({ A, B, C }, [{ p: 'ABC', b: 0 }, { d: 'AB', o: '5 cm' }, ...crt({ A, B, C }, 'AC', 1), ...crt({ A, B, C }, 'BC', 1),
        { u: 'CBA', o: '30°', b: 1, r: 40 }, { u: 'BAC', o: '30°', b: 1, r: 40, id: 'ua', k: 1 }, { u: 'ACB', b: 2, id: 'uc', k: 2, o: '?' }], { velicina: 280 }));
  }

  {
    const [A, B, C] = sus(5, 60, 5);
    Z(3, 'Konstruisan je trougao $ABC$ u kome je $AB = AC = 5 cm$ i ugao između njih $60°$. Kakav je to trougao?',
      ['jednakostraničan', 'pravougli', 'tupougli', 'raznostraničan'],
      [K('Trougao je jednakokraki ($AB = AC$), pa su uglovi na osnovici $BC$ jednaki.'),
       K('$∠B = ∠C = (180° − 60°) : 2 = 60°$.', ['uglovi']),
       K('Sva tri ugla su po $60°$, pa su i sve stranice jednake – trougao je jednakostraničan.')],
      R(G({ A, B, C }, [{ p: 'ABC', b: 0 }, { d: 'AB', o: '5 cm' }, { d: 'AC', o: '5 cm' }, { u: 'BAC', o: '60°', b: 1 },
        { u: 'CBA', b: 2, k: 2, id: 'uglovi', o: '60°' }, { u: 'ACB', b: 2, k: 2, id: 'uglovi', o: '60°' }], { velicina: 260 })));
  }

  // ════════ 4.3 Podudarnost trouglova ════════
  L('Podudarnost trouglova');

  {
    const [A, B, C] = sss(7, 9, 6);
    const Z0 = [8, 1];
    const T = { A, B, C, M: okreniT(A, Z0, 150), N: okreniT(B, Z0, 150), P: okreniT(C, Z0, 150) };
    proveri(6 + 7 + 9 === 22, 'obim 22');
    Z(1, 'Trouglovi $ABC$ i $MNP$ su podudarni. Ako je $AB = 6 cm$, $BC = 7 cm$ i $CA = 9 cm$, koliki je obim trougla $MNP$?',
      ['$22 cm$', '$24 cm$', '$20 cm$', '$27 cm$'],
      [K('Podudarni trouglovi imaju jednake odgovarajuće stranice: $MN = 6 cm$, $NP = 7 cm$, $PM = 9 cm$.'),
       K('Obim: $6 + 7 + 9 = 22 cm$ – isti kao obim trougla $ABC$.', ['t2'])],
      par(T, 'ABC', 'MNP', { stranice: [['AB', 'MN', 1], ['BC', 'NP', 2], ['CA', 'PM', 3]], e: [{ d: 'AB', o: '6' }, { d: 'BC', o: '7' }, { d: 'CA', o: '9' }] }));
  }

  {
    const [A, B, C] = usu(5, 50, 60);
    const T = { A, B, C, D: pomeriT(okreniT(A, [0, 0], 200), [12, 3]), E: pomeriT(okreniT(B, [0, 0], 200), [12, 3]), F: pomeriT(okreniT(C, [0, 0], 200), [12, 3]) };
    proveri(180 - 50 - 60 === 70, '∠C = 70');
    Z(1, 'Trouglovi $ABC$ i $DEF$ su podudarni ($△ABC ≅ △DEF$). Ako je $∠A = 50°$ i $∠B = 60°$, koliki je ugao $F$?',
      ['$70°$', '$50°$', '$60°$', '$80°$'],
      [K('Zapis $△ABC ≅ △DEF$ kaže da $A$ odgovara $D$, $B$ odgovara $E$, a $C$ odgovara $F$.'),
       K('$∠C = 180° − 50° − 60° = 70°$.', ['uc']),
       K('Odgovarajući uglovi su jednaki: $∠F = ∠C = 70°$.', ['uf'])],
      G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, { u: 'BAC', o: '50°', b: 1 }, { u: 'CBA', o: '60°', b: 1 },
        { u: 'ACB', b: 3, id: 'uc', k: 2 }, { u: 'DFE', b: 3, id: 'uf', k: 3, o: '?' }], { velicina: 300 }));
  }

  {
    const [K1, L1, M1] = sss(7, 6, 5);
    const T = { K: K1, L: L1, M: M1, P: odraziT(K1, [7, 0], [7, 5]), Q: odraziT(L1, [7, 0], [7, 5]), R: odraziT(M1, [7, 0], [7, 5]) };
    Z(1, 'Trouglovi $KLM$ i $PQR$ su podudarni ($△KLM ≅ △PQR$), pri čemu je $KL = 5 cm$, $LM = 7 cm$ i $MK = 6 cm$. Koliko je $QR$?',
      ['$7 cm$', '$5 cm$', '$6 cm$', '$18 cm$'],
      [K('Po redosledu slova: $K → P$, $L → Q$, $M → R$.'),
       K('Stranica $QR$ odgovara stranici $LM$, pa je $QR = LM = 7 cm$.', ['qr'])],
      par(T, 'KLM', 'PQR', { stranice: [['KL', 'PQ', 1], ['LM', 'QR', 2], ['MK', 'RP', 3]], e: [{ d: 'KL', o: '5' }, { d: 'LM', o: '7' }, { d: 'MK', o: '6' }, { d: 'QR', b: 5, debljina: 4, id: 'qr', k: 2 }] }));
  }

  {
    const T = { A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], S: [2, 2, 90] };
    Z(2, 'Kvadrat $ABCD$ je podeljen dvema dijagonalama. Koliko trouglova na crtežu je podudarno trouglu $ABC$ (računajući i njega)?',
      ['$4$', '$2$', '$8$', '$3$'],
      [K('Na crtežu su $4$ mala trougla (oko centra $S$) i $4$ velika – polovine kvadrata.'),
       K('Trouglovi $ABC$, $BCD$, $CDA$ i $DAB$ su polovine kvadrata: svi imaju dve stranice kvadrata i prav ugao između njih (SUS).', ['t1', 't2', 't3', 't4']),
       K('Mali trouglovi su upola manji, pa nisu podudarni sa $ABC$. Ukupno: $4$.')],
      G(T, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1 }, { d: 'BD', b: 1 },
        { p: 'ABC', b: 2, id: 't1', k: 2 }, { p: 'BCD', b: 3, id: 't2', k: 2, prazno: 1 }, { p: 'CDA', b: 5, id: 't3', k: 2, prazno: 1 }, { p: 'DAB', b: 4, id: 't4', k: 2, prazno: 1 }], { velicina: 220 }));
  }

  {
    // MNPQ: △MNP ≅ △PQM (zajednička stranica MP, centralno simetrični)
    const M = [0, 0], N = [5, 0.6], P = [6.2, 4], Q = [1.2, 3.4];
    proveri(Math.abs(M[0] + P[0] - N[0] - Q[0]) < 1e-9 && Math.abs(M[1] + P[1] - N[1] - Q[1]) < 1e-9, 'paralelogram');
    const T = { M, N, P, Q };
    Z(2, 'Trouglovi $MNP$ i $PQM$ su podudarni ($△MNP ≅ △PQM$) i imaju zajedničku stranicu $MP$. Ako je $MN = 4 cm$ i $NP = 6 cm$, koliko je $PQ$?',
      ['$4 cm$', '$6 cm$', '$5 cm$', '$10 cm$'],
      [K('Po redosledu slova: $M → P$, $N → Q$, $P → M$.'),
       K('Stranica $PQ$ (prva dva slova drugog trougla) odgovara stranici $MN$ (prva dva slova prvog).', ['pq']),
       K('$PQ = MN = 4 cm$ (a $QM = NP = 6 cm$).')],
      G(T, [{ p: 'MNP', b: 0, id: 't1' }, { p: 'PQM', b: 2, id: 't2' }, { d: 'MP', b: 4, isp: 1 },
        ...crt(T, 'MN', 1), ...crt(T, 'NP', 2, { b: 5 }), { d: 'MN', o: '4 cm' }, { d: 'NP', o: '6 cm' },
        { d: 'PQ', b: 3, debljina: 4, k: 2, id: 'pq' }, ...crt(T, 'PQ', 1, { k: 2 }), ...crt(T, 'QM', 2, { b: 5, k: 3 })], { velicina: 280 }));
  }

  {
    const A = [0, 0], B = [6, 0], C = [3, r(3 / Math.tan(rad(25)))], M = [3, 0, -90];
    proveri(50 / 2 === 25, '∠ACM = 25');
    const T = { A, B, C, M };
    Z(2, 'U jednakokrakom trouglu $ABC$ ($AC = BC$) tačka $M$ je središte osnovice $AB$, pa je $△AMC ≅ △BMC$. Ako je $∠ACB = 50°$, koliki je ugao $ACM$?',
      ['$25°$', '$50°$', '$65°$', '$40°$'],
      [K('Iz podudarnosti trouglova $AMC$ i $BMC$ sledi da su odgovarajući uglovi jednaki: $∠ACM = ∠BCM$.', ['l', 'd']),
       K('Ta dva ugla zajedno čine ugao $ACB$: $∠ACM = 50° : 2 = 25°$. Duž $CM$ je i simetrala ugla pri vrhu.')],
      G(T, [{ p: 'AMC', b: 0, id: 'l' }, { p: 'BMC', b: 2, id: 'd' }, ...crt(T, 'AC', 1), ...crt(T, 'BC', 1), ...crt(T, 'AM', 2, { b: 5 }), ...crt(T, 'MB', 2, { b: 5 }),
        { u: 'ACB', r: 48, b: 4, o: '50°' }, { u: 'ACM', r: 26, b: 1, k: 2, o: '?' }], { velicina: 260 }));
  }

  {
    const [A, B, C] = sss(12, 10, 8);
    const T = { A, B, C, 'A₁': pomeriT(A, [11, 0]), 'B₁': pomeriT(B, [11, 0]), 'C₁': pomeriT(C, [11, 0]) };
    proveri(30 - 8 - 12 === 10, 'CA = 10');
    Z(2, 'Trouglovi $ABC$ i $A₁B₁C₁$ su podudarni. Obim trougla $ABC$ je $30 cm$, $AB = 8 cm$ i $B₁C₁ = 12 cm$. Kolika je stranica $CA$?',
      ['$10 cm$', '$12 cm$', '$8 cm$', '$14 cm$'],
      [K('Odgovarajuće stranice su jednake: $BC = B₁C₁ = 12 cm$.', ['bc']),
       K('$CA = 30 − 8 − 12 = 10 cm$.')],
      par(T, 'ABC', 'A₁B₁C₁', { stranice: [['BC', 'B₁C₁', 2]], e: [{ d: 'AB', o: '8 cm' }, { d: 'B₁C₁', o: '12 cm' }, { d: 'BC', b: 5, debljina: 4, id: 'bc', k: 1 }, { d: 'CA', o: '?' }] }));
  }

  {
    const T = { A: [0, 0], B: [6, 0], C: [6, 4], D: [0, 4] };
    proveri(28 / 2 === 14 && 24 - 14 === 10, 'AC = 10');
    Z(3, 'Dijagonala $AC$ deli pravougaonik $ABCD$ na dva podudarna trougla. Obim trougla $ABC$ je $24 cm$, a obim pravougaonika $28 cm$. Kolika je dijagonala $AC$?',
      ['$10 cm$', '$12 cm$', '$14 cm$', '$4 cm$'],
      [K('Obim pravougaonika je $2 · (AB + BC) = 28$, pa je $AB + BC = 14 cm$.', ['ab', 'bc']),
       K('Obim trougla $ABC$ je $AB + BC + AC = 24$, pa je $AC = 24 − 14 = 10 cm$.', ['ac'])],
      G(T, [{ p: 'ABC', b: 0, id: 't1' }, { p: 'CDA', b: 2, id: 't2' }, { pu: 'ABC' }, { pu: 'CDA' },
        { d: 'AB', b: 1, debljina: 4, k: 1, id: 'ab' }, { d: 'BC', b: 1, debljina: 4, k: 1, id: 'bc' }, { d: 'AC', b: 5, debljina: 4, id: 'ac', k: 2, o: '?' }], { velicina: 260 }));
  }

  {
    const A = [0, 0], B = [6, 0], C = [3, r(3 * Math.sqrt(3))];
    const T = { A, B, C, m: sred(A, B), n: sred(B, C), p: sred(C, A) };
    proveri(3 * 3 === 9, 'obim malog = 9');
    Z(3, 'Jednakostranični trougao stranice $6 cm$ podeljen je na $4$ podudarna trougla spajanjem središta njegovih stranica. Koliki je obim jednog malog trougla?',
      ['$9 cm$', '$18 cm$', '$12 cm$', '$6 cm$'],
      [K('Središta dele svaku stranicu na dva dela po $3 cm$. Ugaoni mali trouglovi imaju po dve stranice od $3 cm$ i ugao od $60°$ između njih.', ['u1']),
       K('Takav trougao je jednakostraničan, pa mu je i treća stranica $3 cm$; srednji trougao je sa njima podudaran (SSS).', ['sr']),
       K('Obim malog trougla: $3 · 3 = 9 cm$ – upola manje od obima velikog ($18 cm$).')],
      G(T, [{ p: 'ABC', b: 0 }, { p: 'mnp', b: 2, id: 'sr' }, { p: 'Amp', b: 1, id: 'u1', k: 1 }, { p: 'mBn', b: 3, k: 2 }, { p: 'pnC', b: 5, k: 2 }, { d: 'AB', o: '6 cm' }], { velicina: 240 }));
  }

  {
    // △ABC ≅ △BAD: odraz preko simetrale duži AB
    const A = [0, 0], B = [6, 0], C = presekPravih(A, 40, B, 180 - 70);
    const D = odraziT(C, [3, 0], [3, 5]);
    const T = { A, B, C, D, m: [3, -0.6], n: [3, r(C[1] + 0.8)] };
    Z(3, 'Trouglovi $ABC$ i $BAD$ su podudarni ($△ABC ≅ △BAD$) i leže sa iste strane duži $AB$. Ako je $∠CAB = 40°$ i $∠CBA = 70°$, koliki je ugao $ABD$?',
      ['$40°$', '$70°$', '$110°$', '$30°$'],
      [K('Po redosledu slova: $A → B$, $B → A$, $C → D$.'),
       K('Ugao $CAB$ (kod $A$ u prvom trouglu) odgovara uglu $DBA$ (kod $B$ u drugom).', ['ua', 'ub']),
       K('Zato je $∠ABD = ∠CAB = 40°$ (a $∠BAD = ∠CBA = 70°$). Trougao $BAD$ je odraz trougla $ABC$ preko simetrale duži $AB$.', ['od'])],
      G(T, [{ p: 'ABC', b: 0 }, { p: 'BAD', b: 2, prazno: 1 }, { u: 'BAC', o: '40°', b: 1, id: 'ua' }, { u: 'CBA', o: '70°', b: 3, r: 30 },
        { u: 'DBA', b: 1, k: 2, id: 'ub', o: '?' }, { d: 'mn', b: 4, isp: 1, k: 3 }, { p: 'ABC', b: 2, odrazi: 'mn', k: 3, id: 'od', prazno: 1 }], { velicina: 280 }));
  }

  // ════════ 4.4 Stavovi podudarnosti trouglova ════════
  L('Stavovi podudarnosti trouglova');

  {
    const [A, B, C] = sus(3.5, 55, 5);
    const T = { A, B, C, D: okreniT(pomeriT(A, [8, 0]), [10, 1], 25), E: okreniT(pomeriT(B, [8, 0]), [10, 1], 25), F: okreniT(pomeriT(C, [8, 0]), [10, 1], 25) };
    Z(1, 'Na crtežu su jednakim brojem crtica (i lukova) označeni jednaki elementi. Po kom stavu su trouglovi podudarni?',
      ['SUS', 'USU', 'SSS', 'SSU'],
      [K('Jednake su dve stranice: $AB = DE$ i $AC = DF$.', ['t1', 't2']),
       K('Jednak je i ugao između njih (kod $A$ i kod $D$) – to je stav SUS (stranica–ugao–stranica).'),
       K('Iz podudarnosti sledi i $BC = EF$, $∠B = ∠E$, $∠C = ∠F$.')],
      par(T, 'ABC', 'DEF', { stranice: [['AB', 'DE', 1], ['AC', 'DF', 2]], uglovi: [['BAC', 'EDF', 1]] }));
  }

  {
    const [A, B, C] = sss(4, 5.5, 6);
    const T = { A, B, C, D: odraziT(A, [8, 0], [8, 1]), E: odraziT(B, [8, 0], [8, 1]), F: odraziT(C, [8, 0], [8, 1]) };
    Z(1, 'Na crtežu su jednakim brojem crtica označene jednake stranice. Po kom stavu su trouglovi podudarni?',
      ['SSS', 'SUS', 'USU', 'SSU'],
      [K('Jednake su sve tri stranice: $AB = DE$, $BC = EF$, $CA = FD$.'),
       K('To je stav SSS. Trougao $DEF$ je „preslikan u ogledalu“, ali je ipak podudaran sa $ABC$.', ['t1', 't2'])],
      par(T, 'ABC', 'DEF', { stranice: [['AB', 'DE', 1], ['BC', 'EF', 2], ['CA', 'FD', 3]] }));
  }

  {
    // deltoid ABCD: AB = AD, CB = CD
    const T = { A: [0, 0], B: [2.2, -2.6], C: [7, 0], D: [2.2, 2.6] };
    Z(2, 'U četvorouglu $ABCD$ je $AB = AD$ i $CB = CD$. Ako je $∠ABC = 100°$, koliki je ugao $ADC$?',
      ['$100°$', '$80°$', '$50°$', '$130°$'],
      [K('Trouglovi $ABC$ i $ADC$: $AB = AD$, $CB = CD$, a $AC$ je zajednička stranica.', ['ac']),
       K('Po stavu SSS: $△ABC ≅ △ADC$.', ['t1', 't2']),
       K('Odgovarajući uglovi su jednaki: $∠ADC = ∠ABC = 100°$.', ['ud'])],
      G(T, [{ p: 'ABC', b: 0, id: 't1' }, { p: 'ADC', b: 2, id: 't2' }, { d: 'AC', b: 4, isp: 1, id: 'ac' },
        ...crt(T, 'AB', 1), ...crt(T, 'AD', 1), ...crt(T, 'CB', 2, { b: 5 }), ...crt(T, 'CD', 2, { b: 5 }),
        { u: 'ABC', b: 1, o: '100°' }, { u: 'CDA', b: 1, k: 3, id: 'ud', o: '?' }], { velicina: 280 }));
  }

  {
    const O = [0, 0], A = [-3.6, -1.4], B = [3.6, 1.4], C = [-1.6, 2.4], D = [1.6, -2.4];
    const T = { O: [0, 0, -60], A, B, C, D };
    Z(2, 'Duži $AB$ i $CD$ imaju zajedničko središte $O$. Ako je $AC = 6 cm$, koliko je $BD$?',
      ['$6 cm$', '$12 cm$', '$3 cm$', '$9 cm$'],
      [K('$OA = OB$ i $OC = OD$ jer je $O$ središte obe duži.', ['oa']),
       K('Uglovi $AOC$ i $BOD$ su unakrsni, pa su jednaki.', ['u']),
       K('Po stavu SUS: $△AOC ≅ △BOD$, pa je $BD = AC = 6 cm$.', ['t1', 't2'])],
      G(T, [{ d: 'AB', b: 0 }, { d: 'CD', b: 0 }, { p: 'AOC', b: 1, id: 't1' }, { p: 'BOD', b: 2, id: 't2' },
        ...crt(T, 'AO', 1, { k: 1, id: 'oa' }), ...crt(T, 'OB', 1, { k: 1, id: 'oa' }), ...crt(T, 'CO', 2, { b: 5, k: 1 }), ...crt(T, 'OD', 2, { b: 5, k: 1 }),
        { u: 'COA', b: 3, k: 2, id: 'u' }, { u: 'DOB', b: 3, k: 2 }, { d: 'AC', o: '6 cm' }, { d: 'BD', o: '?' }], { velicina: 260, bezImena: [] }));
  }

  {
    // centralno simetrični trouglovi MNP i SRP
    const P = [0, 0], N = [-2.4, -1], R1 = [2.4, 1], M = [-2.0, 2.2], S = [2.0, -2.2];
    const T = { P: [0, 0, 0], N, R: R1, M, S };
    Z(2, 'Na crtežu je $NP = RP$, $∠MNP = ∠SRP$, a tačke $M$, $P$, $S$ i $N$, $P$, $R$ su na pravama. Ako je $MN = 4,5 cm$, koliko je $SR$?',
      ['$4,5 cm$', '$9 cm$', '$2,25 cm$', '$3 cm$'],
      [K('Uglovi $NPM$ i $RPS$ su unakrsni, pa su jednaki.', ['u']),
       K('Stranica $NP = RP$ i dva na njoj nalegla ugla su jednaki – stav USU: $△MNP ≅ △SRP$.', ['t1', 't2']),
       K('Odgovarajuće stranice su jednake: $SR = MN = 4,5 cm$.')],
      G(T, [{ p: 'MNP', b: 0, id: 't1' }, { p: 'SRP', b: 2, id: 't2' }, ...crt(T, 'NP', 1), ...crt(T, 'RP', 1),
        { u: 'PNM', b: 1 }, { u: 'PRS', b: 1 }, { u: 'NPM', b: 3, k: 1, id: 'u' }, { u: 'RPS', b: 3, k: 1 }, { d: 'MN', o: '4,5 cm' }, { d: 'SR', o: '?' }], { velicina: 260 }));
  }

  {
    const [A, B, C] = usu(5, 58, 32);
    const M0 = [7.5, 3.5];
    const T = { A, B, C, M: okreniT(pomeriT(A, M0), M0, 180), N: okreniT(pomeriT(B, M0), M0, 180), P: okreniT(pomeriT(C, M0), M0, 180) };
    proveri(90 - 58 === 32, '∠B = 32 = ∠N');
    Z(2, 'Pravougli trouglovi $ABC$ i $MNP$ imaju prave uglove kod $C$ i $P$, jednake hipotenuze $AB = MN$, a $∠A = 58°$ i $∠N = 32°$. Koja stranica trougla $MNP$ je jednaka kateti $AC$?',
      ['$MP$', '$NP$', '$MN$', 'nijedna'],
      [K('U trouglu $ABC$: $∠B = 90° − 58° = 32° = ∠N$, a u trouglu $MNP$: $∠M = 90° − 32° = 58° = ∠A$.'),
       K('Hipotenuze i nalegli uglovi su jednaki ($A ↔ M$, $B ↔ N$) – stav USU: $△ABC ≅ △MNP$.', ['t1', 't2']),
       K('Kateta $AC$ (uz ugao od $58°$) odgovara kateti $MP$, pa je $AC = MP$.', ['ac', 'mp'])],
      G(T, [{ p: 'ABC', b: 0, id: 't1' }, { p: 'MNP', b: 2, id: 't2' }, { pu: 'ACB' }, { pu: 'MPN' }, ...crt(T, 'AB', 1), ...crt(T, 'MN', 1),
        { u: 'BAC', b: 1, o: '58°' }, { u: 'PNM', b: 3, o: '32°' }, { d: 'AC', b: 5, debljina: 4, k: 3, id: 'ac' }, { d: 'MP', b: 5, debljina: 4, k: 3, id: 'mp' }], { velicina: 300 }));
  }

  {
    // AC = 7, BC = 5, α = 35° naspram manje stranice → dva različita trougla
    const A = [0, 0], C = naPravcu(A, 35, 7), kos = Math.cos(rad(35));
    const dis = (14 * kos) ** 2 - 4 * 24;
    const t1 = (14 * kos - Math.sqrt(dis)) / 2, t2 = (14 * kos + Math.sqrt(dis)) / 2;
    proveri(dis > 0 && t1 > 0, 'dva rešenja');
    const T = { A, C, 'B₁': [r(t1), 0, -90], 'B₂': [r(t2), 0, -90] };
    Z(2, 'U trouglovima $ABC$ i $MNP$ je $AC = MN = 7 cm$, $BC = NP = 5 cm$ i $∠A = ∠M = 35°$. Da li su trouglovi sigurno podudarni?',
      ['ne moraju biti', 'da, po stavu SSU', 'da, po stavu SUS', 'nikad nisu podudarni'],
      [K('Ugao od $35°$ je naspram stranice $BC = 5 cm$, a to je MANJA od dve date stranice ($5 < 7$).'),
       K('Kružnica $k(C, 5 cm)$ seče krak ugla u dve tačke – sa istim podacima postoje dva različita trougla $AB₁C$ i $AB₂C$.', ['b1', 'b2']),
       K('Stav SSU važi samo za ugao naspram veće stranice, pa trouglovi ne moraju biti podudarni.')],
      R(G(T, [{ p: 'AB₂C', b: 0, prazno: 1, id: 'b2' }, { p: 'AB₁C', b: 2, id: 'b1' }, { kr: 'C', r: 5, b: 4 }, { d: 'AC', o: '7 cm' }, { u: 'B₁AC', o: '35°', b: 1 }], { velicina: 260 })));
  }

  {
    const A = [0, 0], B = [10, 0], C = [5, r(5 / Math.tan(rad(20)))], D = [5, 0, -90];
    const T = { A, B, C, D };
    Z(3, 'U jednakokrakom trouglu $ABC$ ($AC = BC$) visina $CD$ deli trougao na trouglove $ADC$ i $BDC$. Ako je $AB = 10 cm$ i $∠ACB = 40°$, koliki su $AD$ i $∠ACD$?',
      ['$5 cm$ i $20°$', '$5 cm$ i $40°$', '$10 cm$ i $20°$', '$5 cm$ i $70°$'],
      [K('$AC = BC$ (kraci), $CD$ je zajednička, $∠ADC = ∠BDC = 90°$ – ugao naspram veće stranice (kraka), stav SSU.', ['t1', 't2']),
       K('Zato je $△ADC ≅ △BDC$, pa je $AD = BD = 10 : 2 = 5 cm$.'),
       K('I $∠ACD = ∠BCD = 40° : 2 = 20°$.')],
      G(T, [{ p: 'ADC', b: 0, id: 't1' }, { p: 'BDC', b: 2, id: 't2' }, ...crt(T, 'AC', 1), ...crt(T, 'BC', 1), { pu: 'ADC' }, { d: 'AB', o: '10 cm' }, { u: 'ACB', r: 44, b: 4, o: '40°' }], { velicina: 240 }));
  }

  {
    const O = [0, 0], A = naPravcu(O, 160, 4), B = naPravcu(O, 110, 4), C = naPravcu(O, 60, 4);
    const T = { O: [0, 0, -90], A, B, C };
    proveri(2 * 50 === 100, '∠AOC = 100');
    Z(3, 'Tačke $A$, $B$ i $C$ su na kružnici sa centrom $O$ i $AB = BC$. Ako je $∠AOB = 50°$, koliki je ugao $AOC$?',
      ['$100°$', '$50°$', '$25°$', '$130°$'],
      [K('$OA = OB = OC$ (poluprečnici), $AB = CB$, a $OB$ je zajednička – stav SSS: $△OAB ≅ △OCB$.', ['t1', 't2']),
       K('Zato je $∠COB = ∠AOB = 50°$.'),
       K('$∠AOC = 50° + 50° = 100°$.')],
      G(T, [{ kr: 'O', r: 4, b: 4 }, { p: 'OAB', b: 0, id: 't1' }, { p: 'OCB', b: 2, id: 't2' }, ...crt(T, 'AB', 1), ...crt(T, 'BC', 1),
        { u: 'BOA', b: 1, o: '50°' }, { u: 'COB', b: 1, k: 2 }], { velicina: 240 }));
  }

  {
    const T = { A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], M: [2, 0, -90], N: [4, 2, 0] };
    Z(3, 'U kvadratu $ABCD$ tačka $M$ je središte stranice $AB$, a $N$ središte stranice $BC$. Ako je $∠ADM = α$, koliki je ugao $MDN$?',
      ['$90° − 2α$', '$90° − α$', '$2α$', '$45° + α$'],
      [K('$AD = CD$ (stranice kvadrata), $AM = CN$ (polovine stranica), $∠DAM = ∠DCN = 90°$ – stav SUS.', ['t1', 't2']),
       K('Zato je $△ADM ≅ △CDN$ i $∠CDN = ∠ADM = α$.'),
       K('Ugao kod $D$ je prav: $∠MDN = 90° − α − α = 90° − 2α$.', ['u'])],
      G(T, [{ p: 'ABCD', b: 4, prazno: 1 }, { p: 'ADM', b: 0, id: 't1' }, { p: 'CDN', b: 2, id: 't2' }, ...crt(T, 'AM', 1), ...crt(T, 'CN', 1),
        { u: 'MDA', b: 1, o: 'α', r: 30 }, { u: 'CDN', b: 1, o: 'α', r: 30, k: 2 }, { u: 'NDM', b: 3, k: 3, id: 'u', r: 40 }], { velicina: 240 }));
  }

  // ════════ 4.5 Primene stavova podudarnosti ════════
  L('Primene stavova podudarnosti');

  {
    const [A, B, C] = sus(6, 90, 8);
    const { O, R: Rk } = opisana(A, B, C);
    const T = { A: [A[0], A[1], 225], B, C, O: [O[0], O[1], -60] };
    proveri(Math.abs(Rk - 5) < 0.01, 'R = 5');
    Z(1, 'Hipotenuza pravouglog trougla je $10 cm$. Koliki je poluprečnik kružnice opisane oko tog trougla?',
      ['$5 cm$', '$10 cm$', '$2,5 cm$', '$20 cm$'],
      [K('Centar opisane kružnice pravouglog trougla je središte hipotenuze.', ['o']),
       K('Poluprečnik je polovina hipotenuze: $10 : 2 = 5 cm$.', ['kr'])],
      G(T, [{ p: 'ABC', b: 0 }, { pu: 'BAC' }, { d: 'BC', o: '10 cm' }, { tacka: 'O', b: 1, k: 1, id: 'o' }, { kr: 'O', kroz: 'A', b: 1, crtaj: 1, k: 2, id: 'kr' }], { velicina: 240 }));
  }

  {
    const [A, B, C] = usu(6, 25, 30);
    const { O, R: Rk } = opisana(A, B, C);
    const T = { A, B, C, O };
    Z(1, 'Gde se nalazi centar kružnice opisane oko tupouglog trougla?',
      ['van trougla', 'u unutrašnjosti trougla', 'na najdužoj stranici', 'u temenu tupog ugla'],
      [K('Centar opisane kružnice je presek simetrala stranica.', ['s1', 's2']),
       K('Kod tupouglog trougla simetrale se seku sa druge strane najduže stranice – van trougla.', ['o']),
       K('Ipak, kružnica prolazi kroz sva tri temena.')],
      R(G(T, [{ p: 'ABC', b: 0 }, ...simetralaEl(T, 'A', 'B', { x: { id: 's1' } }), ...simetralaEl(T, 'B', 'C', { kasni: 2.8, boja: 2, x: { id: 's2' } }),
        { tacka: 'O', b: 3, k: 2, id: 'o' }, { kr: 'O', r: Rk, b: 3, k: 3 }], { velicina: 280 })));
  }

  {
    const A = [0, 0], B = [6, 0], M = [3, 4];
    const T = { A, B, M, s: [3, 0], m: [3, -1], n: [3, 5.2] };
    proveri(6 + 7 + 7 === 20, 'obim 20');
    Z(1, 'Tačka $M$ pripada simetrali duži $AB$ i $MA = 7 cm$. Ako je $AB = 6 cm$, koliki je obim trougla $ABM$?',
      ['$20 cm$', '$13 cm$', '$27 cm$', '$14 cm$'],
      [K('Svaka tačka simetrale duži jednako je udaljena od krajeva duži: $MB = MA = 7 cm$.', ['mb']),
       K('Obim: $6 + 7 + 7 = 20 cm$.')],
      G(T, [{ d: 'mn', b: 1, isp: 1 }, { pu: 'Bsn' }, { p: 'ABM', b: 0 }, { d: 'AB', o: '6 cm' }, { d: 'MA', o: '7 cm' }, { d: 'MB', b: 2, debljina: 4, k: 1, id: 'mb', o: '?' }], { velicina: 240, bezImena: [] }));
  }

  {
    const O = [0, 0], T = { O, x: [6, 0], y: naPravcu(O, 70, 6), M: naPravcu(O, 35, 4.5) };
    T.P = noga(T.M, O, T.x); T.Q = noga(T.M, O, T.y);
    Z(2, 'Tačka $M$ je na simetrali ugla $xOy = 70°$ i udaljena je $4 cm$ od kraka $Ox$. Koliko je udaljena od kraka $Oy$ i koliki je ugao $MOy$?',
      ['$4 cm$ i $35°$', '$4 cm$ i $70°$', '$8 cm$ i $35°$', '$2 cm$ i $35°$'],
      [K('Simetrala deli ugao na pola: $∠MOy = 70° : 2 = 35°$.', ['u']),
       K('Trouglovi $OPM$ i $OQM$ (sa pravim uglovima kod $P$ i $Q$): $OM$ zajednička, uglovi kod $O$ jednaki, pa i treći uglovi – stav USU.', ['t1', 't2']),
       K('Zato je $MQ = MP = 4 cm$: svaka tačka simetrale ugla jednako je udaljena od krakova.')],
      G(T, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Oy', b: 0, debljina: 3 }, { d: 'OM', b: 1, isp: 1 }, { d: 'MP', b: 2, o: '4 cm' }, { d: 'MQ', b: 2, o: '?' }, { pu: 'OPM' }, { pu: 'MQO' },
        { p: 'OPM', b: 3, k: 2, id: 't1' }, { p: 'OQM', b: 5, k: 2, id: 't2' }, { u: 'MOy', b: 1, r: 30, k: 1, id: 'u' }], { velicina: 260 }));
  }

  {
    // prav ugao kod C, ∠A = 30°, hipotenuza 7,2 (u crtežu): BC = 3,6, AC = 7,2 · cos 30°
    const T = { C: [0, 0], A: [r(7.2 * Math.cos(rad(30))), 0], B: [0, 3.6] };
    const Bp = [0, -3.6];
    proveri(12 / 2 === 6, 'kateta = 6');
    Z(2, 'U pravouglom trouglu jedan oštar ugao je $30°$, a hipotenuza je $12 cm$. Kolika je kateta naspram ugla od $30°$?',
      ['$6 cm$', '$4 cm$', '$3 cm$', '$8 cm$'],
      [K('Odrazimo trougao preko kateta uz ugao od $30°$: dobija se trougao sa uglovima $60°$, $60°$, $60°$ – jednakostraničan.', ['od']),
       K('Njegova stranica je hipotenuza ($12 cm$), a kateta naspram $30°$ je polovina jedne njegove stranice.', ['k']),
       K('Kateta $= 12 : 2 = 6 cm$.')],
      G({ ...T, b: Bp }, [{ p: 'ABC', b: 0 }, { pu: 'ACB' }, { u: 'CAB', o: '30°', b: 1, r: 34 }, { d: 'AB', o: '12 cm' }, { d: 'BC', b: 2, debljina: 4, id: 'k', k: 2, o: '?' },
        { p: 'ABC', b: 3, prazno: 1, odrazi: 'AC', k: 1, id: 'od' }], { velicina: 240, bezImena: [] }));
  }

  {
    const C = [0, 0], A = [r(6 * Math.cos(rad(35)) / Math.sin(rad(35)) * 0.6), 0], B = [0, r(3.6)];
    const T = { C: [0, 0, 225], A, B, M: sred(A, B) };
    proveri(90 - 35 === 55, '∠MCB = 55');
    Z(2, 'U pravouglom trouglu $ABC$ (prav ugao kod $C$) tačka $M$ je središte hipotenuze $AB$, a $∠A = 35°$. Koliki je ugao $MCB$?',
      ['$55°$', '$35°$', '$45°$', '$70°$'],
      [K('$M$ je centar opisane kružnice: $MA = MB = MC$.', ['kr']),
       K('Trougao $AMC$ je jednakokraki ($MA = MC$), pa je $∠ACM = ∠A = 35°$.', ['amc']),
       K('$∠MCB = 90° − 35° = 55°$.', ['u'])],
      G(T, [{ p: 'ABC', b: 0 }, { pu: 'BCA' }, { d: 'CM', b: 1 }, { u: 'CAB', o: '35°', b: 1, r: 34 }, { kr: 'M', kroz: 'A', b: 4, k: 1, id: 'kr' },
        { p: 'AMC', b: 3, k: 2, id: 'amc' }, { u: 'MCA', b: 3, k: 2, r: 30 }, { u: 'BCM', b: 2, k: 3, id: 'u', r: 40, o: '?' }], { velicina: 260 }));
  }

  {
    const [A, B, C] = sss(5, 6, 4);
    const O = [5.5, 1.2];
    const T = { A, B, C, O, 'A₁': okreniT(A, O, 180), 'B₁': okreniT(B, O, 180), 'C₁': okreniT(C, O, 180) };
    proveri(4 + 5 + 6 === 15, 'obim 15');
    Z(2, 'Trougao $ABC$ sa stranicama $4 cm$, $5 cm$ i $6 cm$ preslikan je centralnom simetrijom u trougao $A₁B₁C₁$. Koliki je obim trougla $A₁B₁C₁$?',
      ['$15 cm$', '$30 cm$', '$7,5 cm$', '$20 cm$'],
      [K('Za svaku stranicu: npr. $△AOB ≅ △A₁OB₁$ po SUS ($OA = OA₁$, $OB = OB₁$, unakrsni uglovi kod $O$), pa je $A₁B₁ = AB$.', ['ob']),
       K('Centralna simetrija čuva dužine: slika je podudaran trougao, a obim je isti – $4 + 5 + 6 = 15 cm$.', ['sl'])],
      G(T, [{ p: 'ABC', b: 0 }, { tacka: 'O', b: 3 }, { d: 'AA₁', b: 4, isp: 1, id: 'ob' }, { d: 'BB₁', b: 4, isp: 1 }, { d: 'CC₁', b: 4, isp: 1 },
        { p: 'ABC', b: 2, okreni: 180, oko: 'O', k: 2, id: 'sl', trajanje: 1.8 }, { p: 'A₁B₁C₁', b: 2, prazno: 1 }], { velicina: 280 }));
  }

  {
    // širina reke: A na obali, T (drvo) preko, AO = OC = 30 m, CD ⊥ obali, D na pravoj TO
    const A = [0, 0], T0 = [0, 5.2], O = [3, 0], C = [6, 0], D = [6, -5.2];
    proveri(Math.abs((T0[1] - 0) / (0 - 3) - (D[1] - 0) / (6 - 3)) < 1e-9, 'T, O, D kolinearne');
    const T = { A: [0, 0, 200], T: T0, O: [3, 0, 80], C: [6, 0, 20], D, r1: [-1, 0.5], r2: [7, 0.5], r3: [-1, 4.4], r4: [7, 4.4] };
    Z(3, 'Širina reke meri se ovako: od tačke $A$ (naspram drveta $T$) ide se duž obale $30 m$ do štapa $O$, pa još $30 m$ do tačke $C$, a zatim normalno od reke do tačke $D$ odakle se štap i drvo vide u pravoj liniji. Ako je $CD = 52 m$, kolika je širina reke $AT$?',
      ['$52 m$', '$30 m$', '$60 m$', '$26 m$'],
      [K('Trouglovi $OAT$ i $OCD$: $OA = OC = 30 m$, uglovi kod $A$ i $C$ su pravi.', ['t1', 't2']),
       K('Uglovi $AOT$ i $COD$ su unakrsni, pa su jednaki – stav USU: $△OAT ≅ △OCD$.'),
       K('Zato je $AT = CD = 52 m$ – širina reke se meri na „suvom“.')],
      G(T, [{ lin: [T.r1, T.r2, T.r4, T.r3], zatv: 1, b: 0, prazno: 0 }, { tx: '~reka', at: [5.8, 2.6], b: 0 },
        { p: 'OAT', b: 1, id: 't1' }, { p: 'OCD', b: 2, id: 't2' }, { pu: 'OAT' }, { pu: 'OCD' },
        ...crt(T, 'AO', 1), ...crt(T, 'OC', 1), { u: 'TOA', b: 3, r: 18 }, { u: 'DOC', b: 3, r: 18 }, { d: 'CD', o: '52 m' }, { d: 'AT', o: '?' }], { velicina: 280 }));
  }

  {
    const O = [0, 0], A = naPravcu(O, 200, 4), B = naPravcu(O, 130, 4), C = naPravcu(O, 60, 4), D = naPravcu(O, -10, 4);
    const T = { O: [0, 0, -90], A, B, C, D };
    proveri((180 - 70) / 2 === 55, '∠OCD = 55');
    Z(3, 'U kružnici sa centrom $O$ tetive $AB$ i $CD$ su jednake, a $∠AOB = 70°$. Koliki je ugao $OCD$?',
      ['$55°$', '$70°$', '$35°$', '$110°$'],
      [K('$OA = OB = OC = OD$ (poluprečnici) i $AB = CD$ – stav SSS: $△AOB ≅ △COD$, pa je $∠COD = 70°$.', ['t1', 't2']),
       K('Trougao $COD$ je jednakokraki ($OC = OD$), pa su uglovi na osnovici jednaki.'),
       K('$∠OCD = (180° − 70°) : 2 = 55°$.', ['u'])],
      G(T, [{ kr: 'O', r: 4, b: 4 }, { p: 'AOB', b: 0, id: 't1' }, { p: 'COD', b: 2, id: 't2' }, ...crt(T, 'AB', 1), ...crt(T, 'CD', 1),
        { u: 'BOA', b: 1, o: '70°' }, { u: 'DOC', b: 1, k: 1 }, { u: 'OCD', b: 3, k: 3, id: 'u', o: '?' }], { velicina: 240 }));
  }

  {
    const [A, B, C] = usu(6, 80, 60);
    const { S, r: rk } = upisana(A, B, C);
    const T = { A, B, C, S: [S[0], S[1], 90] };
    proveri(180 - 40 - 30 === 110, '∠ASB = 110');
    Z(3, 'U trouglu $ABC$ je $∠A = 80°$ i $∠B = 60°$. Tačka $S$ je centar upisane kružnice. Koliki je ugao $ASB$?',
      ['$110°$', '$70°$', '$140°$', '$120°$'],
      [K('Centar upisane kružnice je presek simetrala uglova, pa $AS$ i $BS$ polove uglove $A$ i $B$.', ['sa', 'sb']),
       K('$∠SAB = 80° : 2 = 40°$, $∠SBA = 60° : 2 = 30°$.'),
       K('U trouglu $ASB$: $∠ASB = 180° − 40° − 30° = 110°$.', ['asb'])],
      G(T, [{ p: 'ABC', b: 0 }, { u: 'BAC', o: '80°', b: 1, r: 30 }, { u: 'CBA', o: '60°', b: 1, r: 30 }, { kr: 'S', r: rk, b: 4, isp: 1 },
        { d: 'AS', b: 2, k: 1, id: 'sa' }, { d: 'BS', b: 2, k: 1, id: 'sb' }, { p: 'ASB', b: 3, k: 3, id: 'asb' }, { u: 'ASB', b: 5, k: 3, r: 18 }], { velicina: 260 }));
  }
};

module.exports.crtezi = crtezi;
