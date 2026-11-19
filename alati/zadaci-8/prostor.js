// Crteži tela i prostora za 8. razred (medij „geo“): tela u ortogonalnoj projekciji (pogled
// spreda-zdesna-odozgo), nevidljive ivice isprekidane, imena temena kao u udžbeniku (A, B, …, A₁, B₁, …, S).
// Sve funkcije vraćaju običan geo crtež, pa mu se mogu dodati elementi (dijagonale, visine, preseci, oznake).
//
// Koordinate u prostoru: x udesno, y u dubinu (od posmatrača), z nagore.
//   prostor(T3, e, x)        – bilo kakve imenovane tačke u prostoru + elementi (d, p, u, pu, tacka…);
//                              u elementima smeju i { lin3: [[x,y,z],…] } i { at3: [x,y,z] } (prevode se u lin/at)
//   kvadar(a, b, c, e, x)    – kvadar ABCDA₁B₁C₁D₁ (a duž x, b u dubinu, c visina); kocka(a, e, x)
//   prizma(n, a, h, e, x)    – prava pravilna n-tostrana prizma (osnovna ivica a); prizmaOsnova([[x,y],…], h, e, x)
//   piramida(n, a, H, e, x)  – pravilna n-tostrana piramida ABC…S, O = centar osnove; piramidaOsnova(pts, vrh3, e, x)
//   valjak(r, H, e, x)       – O, O₁ centri osnova; A, B (levo/desno na donjoj), A₁, B₁ (na gornjoj)
//   kupa(r, H, e, x)         – O centar osnove, S vrh, A, B krajevi prečnika osnove (levo/desno)
//   lopta(R, e, x)           – O centar, A, B krajevi prečnika (levo/desno); uz x.ekvator: false bez ekvatora
//   ravan(uglovi3, x)        – deo ravni kao paralelogram (4 tačke u prostoru) sa imenom (α, β…) – vraća elemente za prostor()
//   elipsa3(c3, r, x)        – horizontalni krug u prostoru: [prednji luk (pun), zadnji luk (isprekidan)] – elementi za prostor()
// Zajedničke opcije x: { theta = 30 (okret oko uspravne ose, °), phi = 22 (pogled odozgo, °), velicina = 240,
//   T3: { dodatne tačke }, bezImena: [...], b: boja ivica (0), strane: false (bez senčenja strana), imena: false (bez imena temena) }
//
// Mreže tela (u ravni, vraćaju geo crtež): mrezaKvadra(a, b, c), mrezaPrizme(n, a, h), mrezaPiramide(n, a, hs),
//   mrezaValjka(r, H), mrezaKupe(r, s). Opcija x.b0 / x.b1 = boje osnove i omotača, x.e = dodatni elementi, x.oznake.
const A5 = require('../zadaci-5/osnova');
const G = A5.G;
const r = (x) => +(+x).toFixed(3);
const rad = (u) => (u * Math.PI) / 180;

// ───────────── projekcija ─────────────
function projektor({ theta = 30, phi = 22 } = {}) {
  const t = rad(theta), f = rad(phi);
  const R = [Math.cos(t), Math.sin(t), 0];
  const U = [-Math.sin(f) * Math.sin(t), Math.sin(f) * Math.cos(t), Math.cos(f)];
  const W = [Math.cos(f) * Math.sin(t), -Math.cos(f) * Math.cos(t), Math.sin(f)]; // ka posmatraču
  const sk = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  return { P: (p) => [r(sk(p, R)), r(sk(p, U))], dubina: (p) => sk(p, W), W, sinf: Math.sin(f), cosf: Math.cos(f), theta, phi };
}

// prevod elemenata sa lin3/at3 u ravan
const prevedi = (e, P) => e.flat(Infinity).filter(Boolean).map((el) => {
  const o = { ...el };
  if (o.lin3) { o.lin = o.lin3.map(P); delete o.lin3; }
  if (o.at3) { o.at = P(o.at3); delete o.at3; }
  if (o.oAt3) { o.oAt = P(o.oAt3); delete o.oAt3; }
  return o;
});

// prostor: imenovane tačke u prostoru → geo crtež
function prostor(T3, e = [], x = {}) {
  const pr = projektor(x);
  const t = {};
  for (const [n, p] of Object.entries({ ...T3, ...(x.T3 || {}) })) t[n] = p.length === 2 ? p : pr.P(p);
  return G(t, prevedi([e], pr.P), { velicina: x.velicina || 240, ...(x.bezImena ? { bezImena: x.bezImena } : {}) });
}

// ───────────── poliedri ─────────────
// T3 = { ime: [x, y, z] }, strane = [['A','B','C'], …] (bilo kojim redom temena po obodu)
function poliedar(T3, strane, e = [], x = {}) {
  const pr = projektor(x);
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const imena = Object.keys(T3);
  const c = imena.reduce((s, n) => s.map((v, i) => v + T3[n][i] / imena.length), [0, 0, 0]);
  // Njuelov vektor normale, okrenut napolje
  const vidljiva = strane.map((s) => {
    const n = [0, 0, 0];
    s.forEach((a, i) => {
      const p = T3[a], q = T3[s[(i + 1) % s.length]];
      n[0] += (p[1] - q[1]) * (p[2] + q[2]); n[1] += (p[2] - q[2]) * (p[0] + q[0]); n[2] += (p[0] - q[0]) * (p[1] + q[1]);
    });
    const cs = s.reduce((acc, a) => acc.map((v, i) => v + T3[a][i] / s.length), [0, 0, 0]);
    const d = sub(cs, c);
    const napolje = n[0] * d[0] + n[1] * d[1] + n[2] * d[2] >= 0 ? 1 : -1;
    return napolje * (n[0] * pr.W[0] + n[1] * pr.W[1] + n[2] * pr.W[2]) > 1e-9;
  });
  // ivice: svaka stranica svake strane; vidljiva ako je bar jedna susedna strana vidljiva
  const ivice = new Map();
  strane.forEach((s, i) => s.forEach((a, j) => {
    const b = s[(j + 1) % s.length];
    const k = [a, b].sort().join('|');
    if (!ivice.has(k)) ivice.set(k, { a, b, vid: false });
    if (vidljiva[i]) ivice.get(k).vid = true;
  }));
  const boja = x.b ?? 0;
  const el = [];
  if (x.strane !== false) strane.forEach((s, i) => { if (vidljiva[i]) el.push({ p: s, b: boja, prazno: x.prazno ? 1 : undefined }); });
  for (const { a, b, vid } of ivice.values()) el.push(vid ? { d: a + b, b: boja, debljina: 2.5 } : { d: a + b, b: boja, debljina: 1.6, isp: 1 });
  const t = {};
  for (const [n, p] of Object.entries({ ...T3, ...(x.T3 || {}) })) t[n] = p.length === 2 ? p : pr.P(p);
  const bezImena = x.imena === false ? Object.keys(t) : (x.bezImena || []);
  return G(t, [...el.map((q) => JSON.parse(JSON.stringify(q))), ...prevedi([e], pr.P)], { velicina: x.velicina || 240, ...(bezImena.length ? { bezImena } : {}) });
}

const IME = 'ABCDEFGHIJKL';
const gornje = (n) => n + '₁';

function prizmaOsnova(osnova, h, e = [], x = {}) {
  const n = osnova.length, ime = x.imenaOsnove || IME.slice(0, n);
  const T3 = {};
  osnova.forEach(([px, py], i) => { T3[ime[i]] = [px, py, 0]; T3[gornje(ime[i])] = [px, py, h]; });
  const strane = [[...ime].reverse(), [...ime].map(gornje)];
  for (let i = 0; i < n; i++) { const a = ime[i], b = ime[(i + 1) % n]; strane.push([a, b, gornje(b), gornje(a)]); }
  return poliedar(T3, strane, e, x);
}
// pravilni n-tougao stranice a, centar u (0, 0), prva stranica AB napred (najbliža posmatraču) i vodoravna
function pravilnaOsnova(n, a) {
  const R = a / (2 * Math.sin(Math.PI / n));
  return Array.from({ length: n }, (_, i) => {
    const u = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * i) / n;
    return [r(R * Math.cos(u)), r(R * Math.sin(u))];
  });
}
const kvadar = (a, b, c, e = [], x = {}) => prizmaOsnova([[0, 0], [a, 0], [a, b], [0, b]], c, e, x);
const kocka = (a, e = [], x = {}) => kvadar(a, a, a, e, x);
// trostrana tela se gledaju malo više spreda (pri 30° bi bočna ivica pala iza prednje)
const ugaoN = (n, x) => (x.theta === undefined && n === 3 ? { ...x, theta: 12 } : x);
const prizma = (n, a, h, e = [], x = {}) => (n === 4 && !x.pravilna ? kvadar(a, a, h, e, x) : prizmaOsnova(pravilnaOsnova(n, a), h, e, ugaoN(n, x)));

function piramidaOsnova(osnova, vrh, e = [], x = {}) {
  const n = osnova.length, ime = x.imenaOsnove || IME.slice(0, n);
  const T3 = {};
  osnova.forEach(([px, py], i) => { T3[ime[i]] = [px, py, 0]; });
  T3.S = vrh;
  const strane = [[...ime].reverse()];
  for (let i = 0; i < n; i++) strane.push([ime[i], ime[(i + 1) % n], 'S']);
  return poliedar(T3, strane, e, x);
}
function piramida(n, a, H, e = [], x = {}) {
  const osn = n === 4 && !x.pravilna ? [[-a / 2, -a / 2], [a / 2, -a / 2], [a / 2, a / 2], [-a / 2, a / 2]] : pravilnaOsnova(n, a);
  return piramidaOsnova(osn, [0, 0, H], e, { ...ugaoN(n, x), T3: { O: [0, 0, 0], ...(x.T3 || {}) } });
}

// ───────────── obla tela ─────────────
// horizontalni krug (centar c3, poluprečnik R): prednji luk pun, zadnji isprekidan
function elipsa3(c3, R, x = {}) {
  const pr = projektor(x);
  const c = pr.P(c3), s = pr.sinf, N = 36;
  const luk = (u0, u1) => Array.from({ length: N + 1 }, (_, i) => { const u = u0 + ((u1 - u0) * i) / N; return [r(c[0] + R * Math.cos(u)), r(c[1] + R * s * Math.sin(u))]; });
  const b = x.b ?? 0;
  if (x.cela) return [{ lin: luk(0, 2 * Math.PI), b, debljina: 2.5, ...(x.pun ? { zatv: 1, gusto: x.gusto } : {}) }];
  return [{ lin: luk(Math.PI, 2 * Math.PI), b, debljina: 2.5 }, { lin: luk(0, Math.PI), b, debljina: 1.6, isp: 1 }];
}
// elementi koji su već u ravni (lin) ne prolaze kroz projekciju – zato obla tela grade t i e sama
function oblo(t2, el, e, x, pr) {
  const t = { ...t2 };
  for (const [n, p] of Object.entries(x.T3 || {})) t[n] = p.length === 2 ? p : pr.P(p);
  const bezImena = x.imena === false ? Object.keys(t) : (x.bezImena || ['O', 'O₁'].filter((n) => t[n]));
  return G(t, [...el, ...prevedi([e], pr.P)], { velicina: x.velicina || 220, ...(bezImena.length ? { bezImena } : {}) });
}
function valjak(R, H, e = [], x = {}) {
  const pr = projektor(x), s = pr.sinf, b = x.b ?? 0, N = 48;
  const O = pr.P([0, 0, 0]), O1 = pr.P([0, 0, H]);
  const elip = (c, u0, u1) => Array.from({ length: N + 1 }, (_, i) => { const u = u0 + ((u1 - u0) * i) / N; return [r(c[0] + R * Math.cos(u)), r(c[1] + R * s * Math.sin(u))]; });
  const t = { O, 'O₁': O1, A: [O[0] - R, O[1]], B: [O[0] + R, O[1]], 'A₁': [O1[0] - R, O1[1]], 'B₁': [O1[0] + R, O1[1]] };
  const el = [
    x.strane !== false ? { lin: [...elip(O, Math.PI, 2 * Math.PI), ...elip(O1, 0, Math.PI)], zatv: 1, b, prazno: x.prazno ? 1 : undefined } : null,
    { lin: elip(O1, 0, 2 * Math.PI), b, debljina: 2.5, zatv: x.strane !== false ? 1 : undefined, prazno: 1 },
    { lin: elip(O, Math.PI, 2 * Math.PI), b, debljina: 2.5 },
    { lin: elip(O, 0, Math.PI), b, debljina: 1.6, isp: 1 },
    { d: 'AA₁', b, debljina: 2.5 }, { d: 'BB₁', b, debljina: 2.5 },
  ].filter(Boolean);
  if (!x.imena) x = { ...x, bezImena: x.bezImena || ['O', 'O₁', 'A', 'B', 'A₁', 'B₁'] };
  return oblo(t, el, e, x, pr);
}
function kupa(R, H, e = [], x = {}) {
  const pr = projektor(x), s = pr.sinf, b = x.b ?? 0, N = 48;
  const O = pr.P([0, 0, 0]), S = pr.P([0, 0, H]);
  const Hc = S[1] - O[1];
  const elip = (u0, u1) => Array.from({ length: N + 1 }, (_, i) => { const u = u0 + ((u1 - u0) * i) / N; return [r(O[0] + R * Math.cos(u)), r(O[1] + R * s * Math.sin(u))]; });
  const t = { O, S, A: [O[0] - R, O[1]], B: [O[0] + R, O[1]] };
  // dodirne tačke izvodnica konture: sin u = R·sinφ / Hc (na zadnjoj polovini osnove)
  const sin0 = (R * s) / Hc;
  let el;
  if (sin0 < 1) {
    const u0 = Math.asin(sin0), u1 = Math.PI - u0;
    t.K = [r(O[0] + R * Math.cos(u0)), r(O[1] + R * s * Math.sin(u0))];
    t.L = [r(O[0] + R * Math.cos(u1)), r(O[1] + R * s * Math.sin(u1))];
    el = [
      x.strane !== false ? { lin: [...elip(u1, 2 * Math.PI + u0), S], zatv: 1, b, prazno: x.prazno ? 1 : undefined } : null,
      { lin: elip(u1, 2 * Math.PI + u0), b, debljina: 2.5 },
      { lin: elip(u0, u1), b, debljina: 1.6, isp: 1 },
      { d: 'KS', b, debljina: 2.5 }, { d: 'LS', b, debljina: 2.5 },
    ].filter(Boolean);
  } else {
    el = [{ lin: elip(0, 2 * Math.PI), b, debljina: 2.5, zatv: 1 }];
  }
  if (!x.imena) x = { ...x, bezImena: x.bezImena || ['O', 'S', 'A', 'B', 'K', 'L'] };
  else x = { ...x, bezImena: [...(x.bezImena || []), 'K', 'L'] };
  return oblo(t, el, e, x, pr);
}
function lopta(R, e = [], x = {}) {
  const pr = projektor(x), b = x.b ?? 0;
  const O = pr.P([0, 0, 0]);
  const t = { O, A: [O[0] - R, O[1]], B: [O[0] + R, O[1]] };
  const el = [{ kr: 'O', r: R, b, pun: x.strane !== false ? 1 : undefined }];
  if (x.ekvator !== false) el.push(...elipsa3([0, 0, 0], R, { ...x, b }));
  if (!x.imena) x = { ...x, bezImena: x.bezImena || ['O', 'A', 'B'] };
  return oblo(t, el, e, x, pr);
}

// deo ravni: 4 temena paralelograma u prostoru, ime (α) kod prvog ugla
function ravan(uglovi3, { ime, b = 4, k, id, gusto } = {}) {
  const [p] = uglovi3;
  const c = uglovi3.reduce((s, q) => s.map((v, i) => v + q[i] / 4), [0, 0, 0]);
  const el = [{ lin3: uglovi3, zatv: 1, b, ...(gusto ? { gusto } : {}), ...(k !== undefined ? { k } : {}), ...(id ? { id } : {}) }];
  if (ime) el.push({ tx: ime, at3: p.map((v, i) => v + (c[i] - v) * 0.2), b, vel: 18, ...(k !== undefined ? { k } : {}) });
  return el;
}
// vodoravna ravan z = z0 kao pravougaonik [x0, x1] × [y0, y1]
const ravanZ = (x0, x1, y0, y1, z0 = 0, o = {}) => ravan([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], o);

// ───────────── mreže tela (u ravni) ─────────────
const bez = (t) => ({ bezImena: Object.keys(t) });
function mrezaKvadra(a, b, c, x = {}) {
  // pojas bočnih strana (a, b, a, b) visine c, osnove a×b iznad i ispod druge strane
  const e = [];
  const sir = [a, b, a, b];
  let x0 = 0;
  sir.forEach((w, i) => {
    e.push({ lin: [[x0, 0], [x0 + w, 0], [x0 + w, c], [x0, c]], zatv: 1, b: x.b1 ?? 0, id: 'o' + i });
    x0 += w;
  });
  e.push({ lin: [[0, c], [a, c], [a, c + b], [0, c + b]], zatv: 1, b: x.b0 ?? 2, gusto: 1, id: 'B1' });
  e.push({ lin: [[0, 0], [a, 0], [a, -b], [0, -b]], zatv: 1, b: x.b0 ?? 2, gusto: 1, id: 'B2' });
  if (x.oznake) e.push({ tx: x.oznake[0] ?? String(a), at: [a / 2, -b - 0.5] }, { tx: x.oznake[1] ?? String(b), at: [a + b / 2, -0.5] }, { tx: x.oznake[2] ?? String(c), at: [2 * a + 2 * b + 0.6, c / 2] });
  return G({ Q: [0, 0] }, [...e, ...(x.e || [])], { bezImena: ['Q'], velicina: x.velicina || 280 });
}
function mrezaPrizme(n, a, h, x = {}) {
  const e = [];
  for (let i = 0; i < n; i++) e.push({ lin: [[i * a, 0], [(i + 1) * a, 0], [(i + 1) * a, h], [i * a, h]], zatv: 1, b: x.b1 ?? 0, id: 'o' + i });
  // osnove: pravilni n-tougao nad (ispod) prvom stranicom
  const R = a / (2 * Math.sin(Math.PI / n)), ap = a / (2 * Math.tan(Math.PI / n));
  const osn = (y, gore) => Array.from({ length: n }, (_, i) => {
    const u = (gore ? -Math.PI / 2 : Math.PI / 2) - Math.PI / n + (2 * Math.PI * i) / n;
    return [r(a / 2 + R * Math.cos(u)), r(y + (gore ? ap : -ap) + R * Math.sin(u))];
  });
  e.push({ lin: osn(h, true), zatv: 1, b: x.b0 ?? 2, gusto: 1, id: 'B1' });
  e.push({ lin: osn(0, false), zatv: 1, b: x.b0 ?? 2, gusto: 1, id: 'B2' });
  if (x.oznake) e.push({ tx: x.oznake[0] ?? String(a), at: [n * a - a / 2, -0.5] }, { tx: x.oznake[1] ?? String(h), at: [n * a + 0.6, h / 2] });
  return G({ Q: [0, 0] }, [...e, ...(x.e || [])], { bezImena: ['Q'], velicina: x.velicina || 280 });
}
function mrezaPiramide(n, a, hs, x = {}) {
  // osnova u sredini, bočni trouglovi (visina hs) spolja na svakoj stranici
  const R = a / (2 * Math.sin(Math.PI / n));
  const V = Array.from({ length: n }, (_, i) => { const u = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * i) / n; return [r(R * Math.cos(u)), r(R * Math.sin(u))]; });
  const e = [{ lin: V, zatv: 1, b: x.b0 ?? 2, gusto: 1, id: 'B' }];
  V.forEach((p, i) => {
    const q = V[(i + 1) % n], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], d = Math.hypot(m[0], m[1]);
    const vrh = [r(m[0] + (m[0] / d) * hs), r(m[1] + (m[1] / d) * hs)];
    e.push({ lin: [p, q, vrh], zatv: 1, b: x.b1 ?? 0, id: 'o' + i });
  });
  return G({ Q: [0, 0] }, [...e, ...(x.e || [])], { bezImena: ['Q'], velicina: x.velicina || 260 });
}
function mrezaValjka(R, H, x = {}) {
  const O2 = 2 * Math.PI * R;
  const e = [
    { lin: [[0, 0], [O2, 0], [O2, H], [0, H]], zatv: 1, b: x.b1 ?? 0, id: 'M' },
    { kr: 'P', r: R, b: x.b0 ?? 2, pun: 1, gusto: 1, id: 'B1' },
    { kr: 'Q', r: R, b: x.b0 ?? 2, pun: 1, gusto: 1, id: 'B2' },
  ];
  return G({ P: [O2 / 2, H + R], Q: [O2 / 2, -R] }, [...e, ...(x.e || [])], { bezImena: ['P', 'Q'], velicina: x.velicina || 280 });
}
function mrezaKupe(R, s, x = {}) {
  // isečak poluprečnika s i ugla 360°·R/s, krug osnove ispod, dodiruje luk
  const ug = (360 * R) / s;
  const e = [
    { is: 'V', r: s, od: r(270 - ug / 2), do: r(270 + ug / 2), b: x.b1 ?? 0, id: 'M' },
    { kr: 'Q', r: R, b: x.b0 ?? 2, pun: 1, gusto: 1, id: 'B' },
  ];
  return G({ V: [0, 0], Q: [0, r(-s - R)] }, [...e, ...(x.e || [])], { bezImena: ['V', 'Q'], velicina: x.velicina || 240 });
}

// ───────────── jednačine: terazije ─────────────
// terazije(levo, desno, { nagib }) – levo/desno = niz stvari: 'x' (kutija nepoznate), broj (teg), ili { tx, b }
// nagib: 0 ravnoteža, 1 leva strana teža, −1 desna teža
function terazije(levo, desno, { nagib = 0, velicina = 300, e = [] } = {}) {
  const ug = rad(-8 * nagib);
  const najsiri = Math.max(...[levo, desno].map((l) => l.map((q) => (typeof q === 'object' ? q.tx : String(q))).reduce((a, t) => a + Math.max(0.8, 0.36 * [...t].length + 0.3) + 0.08, 0)));
  const krak = Math.max(4, najsiri / 2 + 1.6);
  const L = [r(-krak * Math.cos(ug)), r(3 + krak * Math.sin(ug))], D = [r(krak * Math.cos(ug)), r(3 - krak * Math.sin(ug))];
  const el = [
    { lin: [[-1.2, -0.2], [1.2, -0.2], [0, 3]], zatv: 1, b: 4, gusto: 1 }, // stalak
    { lin: [L, D], b: 5, debljina: 4 },
  ];
  // širina stvari prema dužini natpisa (kutija „3(x − 5)“ mora biti šira od kutije „x“); tas se širi po potrebi
  const stvar = (s) => (typeof s === 'object' ? s : s === 'x' ? { tx: 'x', b: 1 } : { tx: String(s), b: 3, teg: 1 });
  const sirina = (o) => Math.max(0.8, 0.36 * [...String(o.tx)].length + 0.3);
  const tas = (c, stvari, bt) => {
    const lista = stvari.map(stvar), sir = lista.map(sirina);
    const razmak = 0.08, uk = sir.reduce((a, b) => a + b, 0) + razmak * (lista.length - 1);
    const pola = Math.max(1.9, uk / 2 + 0.25);
    el.push({ lin: [c, [c[0] - pola + 0.3, c[1] - 1.8]], b: 5, debljina: 1.2 }, { lin: [c, [c[0] + pola - 0.3, c[1] - 1.8]], b: 5, debljina: 1.2 });
    el.push({ lin: [[c[0] - pola, c[1] - 1.8], [c[0] + pola, c[1] - 1.8], [c[0] + pola - 0.4, c[1] - 2.1], [c[0] - pola + 0.4, c[1] - 2.1]], zatv: 1, b: bt, gusto: 1 });
    let x0 = c[0] - uk / 2;
    lista.forEach((o, i) => {
      const ww = sir[i], cx = x0 + ww / 2, y0 = c[1] - 1.8, hh = 0.8;
      x0 += ww + razmak;
      if (o.teg) el.push({ lin: [[cx - ww / 2, y0], [cx + ww / 2, y0], [cx + ww / 2 - 0.18, y0 + hh], [cx - ww / 2 + 0.18, y0 + hh]], zatv: 1, b: o.b, gusto: 1 });
      else el.push({ lin: [[cx - ww / 2, y0], [cx + ww / 2, y0], [cx + ww / 2, y0 + hh], [cx - ww / 2, y0 + hh]], zatv: 1, b: o.b, gusto: 1 });
      el.push({ tx: o.tx, at: [r(cx), r(y0 + 0.3)], vel: 16 });
    });
  };
  tas(L, levo, 0);
  tas(D, desno, 0);
  return G({ Q: [0, 0] }, [...el, ...e], { bezImena: ['Q'], velicina });
}

// ───────────── nejednačine: skup rešenja na brojevnoj pravoj ─────────────
// interval(od, doo, { a, b, ukljA, ukljB }) – ako nema b: zrak od a udesno (ili ulevo uz levo: true)
function interval(od, doo, { a, b, ukljA = false, ukljB = false, levo = false, boja = 2, podela = 1, svaki, velicina = 320, e = [], crtaj = true } = {}) {
  const el = [{ osa: [od, doo], podela, ...(svaki ? { svaki } : {}) }];
  const h = 0.28 * Math.max(1, (doo - od) / 12);
  if (b === undefined) {
    el.push({ lin: [[a, h], [levo ? od - 0.3 : doo + 0.3, h]], b: boja, debljina: 5, str: 1, ...(crtaj ? { crtaj: 1 } : {}) });
    el.push({ tx: ukljA ? '●' : '○', at: [a, h - 0.05], b: boja, vel: 20 });
  } else {
    el.push({ lin: [[a, h], [b, h]], b: boja, debljina: 5, ...(crtaj ? { crtaj: 1 } : {}) });
    el.push({ tx: ukljA ? '●' : '○', at: [a, h - 0.05], b: boja, vel: 20 }, { tx: ukljB ? '●' : '○', at: [b, h - 0.05], b: boja, vel: 20 });
  }
  return G(od <= 0 && doo >= 0 ? { O: [0, 0] } : {}, [...el, ...e], { bezImena: ['O'], velicina });
}

module.exports = {
  projektor, prostor, poliedar, prizmaOsnova, pravilnaOsnova, kvadar, kocka, prizma, piramidaOsnova, piramida,
  elipsa3, valjak, kupa, lopta, ravan, ravanZ, mrezaKvadra, mrezaPrizme, mrezaPiramide, mrezaValjka, mrezaKupe,
  terazije, interval,
};
