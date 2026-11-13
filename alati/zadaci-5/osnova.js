// Zajednički alati za zadatke 5. razreda: spisak lekcija (po udžbeniku Matematika 5, sadržaj),
// kompaktan zapis zadataka i pomoćne funkcije za crteže (medij „geo“).
// Svaki fajl teme izvozi funkciju koja dobija ovaj objekat: module.exports = ({ L, Z, K, G, … }) => { … }
// Crteži koriste animacije iz public/geo.js: "crtaj" (iscrtavanje), "pomeri" (translacija),
// "odrazi" (presavijanje preko prave), "okreni" (rotacija), "kasni" i "ponovi".

const { r, naKrugu, pravilni, stubici, kruzni, kocke } = require('../zadaci-7/osnova');

const lekcije = [
  ['Svojstva sabiranja, oduzimanja, množenja i deljenja u skupu N₀', 'Prirodni brojevi i deljivost'],
  ['Deljenje sa ostatkom', 'Prirodni brojevi i deljivost'],
  ['Svojstva deljivosti; činioci i sadržaoci', 'Prirodni brojevi i deljivost'],
  ['Deljivost sa 2, 5 i dekadnim jedinicama', 'Prirodni brojevi i deljivost'],
  ['Deljivost sa 4 i 25', 'Prirodni brojevi i deljivost'],
  ['Deljivost sa 3 i 9', 'Prirodni brojevi i deljivost'],
  ['Skupovi', 'Prirodni brojevi i deljivost'],
  ['Skupovne operacije: unija, presek i razlika', 'Prirodni brojevi i deljivost'],
  ['Tačke i prave; pripadanje i raspored', 'Osnovni pojmovi geometrije'],
  ['Odnosi pravih u ravni', 'Osnovni pojmovi geometrije'],
  ['Merenje dužine i jednakost duži', 'Osnovni pojmovi geometrije'],
  ['Prenošenje i nadovezivanje duži', 'Osnovni pojmovi geometrije'],
  ['Mnogougao', 'Osnovni pojmovi geometrije'],
  ['Kružnica i krug; kružnica i prava', 'Osnovni pojmovi geometrije'],
  ['Centralna simetrija', 'Osnovni pojmovi geometrije'],
  ['Vektor i translacija', 'Osnovni pojmovi geometrije'],
  ['Prosti i složeni brojevi; Eratostenovo sito', 'Prirodni brojevi i deljivost (2. deo)'],
  ['Rastavljanje na proste činioce', 'Prirodni brojevi i deljivost (2. deo)'],
  ['Najveći zajednički delilac; Euklidov algoritam', 'Prirodni brojevi i deljivost (2. deo)'],
  ['Najmanji zajednički sadržalac; veza NZD i NZS', 'Prirodni brojevi i deljivost (2. deo)'],
  ['Pojam razlomka', 'Razlomci'],
  ['Razlomci na brojevnoj polupravoj', 'Razlomci'],
  ['Proširivanje, skraćivanje i upoređivanje razlomaka', 'Razlomci'],
  ['Decimalni zapis razlomka', 'Razlomci'],
  ['Upoređivanje i zaokrugljivanje decimalnih brojeva', 'Razlomci'],
  ['Ugao, centralni ugao, jednakost uglova', 'Ugao'],
  ['Prenošenje i nadovezivanje uglova', 'Ugao'],
  ['Upoređivanje uglova; vrste uglova', 'Ugao'],
  ['Merenje uglova; sabiranje i oduzimanje uglova', 'Ugao'],
  ['Ugao između dve prave; unakrsni uglovi', 'Ugao'],
  ['Uglovi na transverzali', 'Ugao'],
  ['Sabiranje i oduzimanje razlomaka', 'Računanje sa razlomcima'],
  ['Sabiranje i oduzimanje decimalnih brojeva', 'Računanje sa razlomcima'],
  ['Svojstva sabiranja i oduzimanja; brojevni izrazi', 'Računanje sa razlomcima'],
  ['Jednačine sa sabiranjem i oduzimanjem razlomaka', 'Računanje sa razlomcima'],
  ['Nejednačine sa sabiranjem i oduzimanjem razlomaka', 'Računanje sa razlomcima'],
  ['Množenje razlomaka', 'Računanje sa razlomcima'],
  ['Množenje decimalnih brojeva', 'Računanje sa razlomcima'],
  ['Recipročan broj; deljenje razlomaka', 'Računanje sa razlomcima'],
  ['Deljenje decimalnih brojeva', 'Računanje sa razlomcima'],
  ['Svojstva množenja i deljenja; brojevni izrazi', 'Računanje sa razlomcima'],
  ['Jednačine sa množenjem i deljenjem razlomaka', 'Računanje sa razlomcima'],
  ['Nejednačine sa množenjem i deljenjem razlomaka', 'Računanje sa razlomcima'],
  ['Osna simetrija', 'Osna simetrija'],
  ['Osnosimetrične figure', 'Osna simetrija'],
  ['Simetrala duži i konstrukcija normale', 'Osna simetrija'],
  ['Simetrala ugla', 'Osna simetrija'],
  ['Procenti i primena procenata', 'Procenti, razmera, sredina'],
  ['Razmera; aritmetička sredina', 'Procenti, razmera, sredina'],
].map(([naziv, tema]) => ({ naziv, tema }));

const zadaci = [];
let lek = 0;

// G(tačke, elementi, dodatno) – crtež; K(tekst, istaknuti, crtež) – korak rešenja
const G = (t, e, x = {}) => ({ vrsta: 'geo', t, e: e.flat(), ...x });
const K = (t, i, crtez) => ({ t, ...(i && i.length ? { i } : {}), ...(crtez ? { crtez } : {}) });
// Z(težina, pitanje, odgovori [prvi tačan], rešenje [koraci], crtež uz pitanje)
const Z = (tezina, pitanje, odgovori, resenje, mediji) => {
  if (new Set(odgovori).size !== 4) throw new Error('Odgovori moraju biti 4 različita: ' + pitanje);
  zadaci.push({ lekcija: lek, tezina, pitanje, odgovori, ...(mediji ? { mediji } : {}), resenje });
};
const L = (naziv) => { lek = lekcije.findIndex((l) => l.naziv === naziv) + 1; if (!lek) throw new Error(naziv); };
// provera računa u alatu: ako ne važi, gradnja puca (da greška ne bi stigla do dece)
const proveri = (uslov, opis) => { if (!uslov) throw new Error('Netačan račun: ' + opis); };

// ── razlomci (za proveru računa) ──
const nzd = (a, b) => (b ? nzd(b, a % b) : Math.abs(a));
const nzs = (a, b) => (a / nzd(a, b)) * b;
const skrati = ([a, b]) => { const d = nzd(a, b); return [a / d, b / d]; };
const isti = (x, y) => x[0] * y[1] === x[1] * y[0];
// decimalni broj kao tekst sa zarezom
const dec = (x, mesta) => (mesta === undefined ? String(+x.toFixed(6)) : x.toFixed(mesta)).replace('.', ',');

// ── pomoćni crteži (elementi su u koordinatama, bez imenovanih tačaka, pa se slobodno kombinuju) ──
const O = { O: [0, 0] };
const bez = { bezImena: ['O'] };

// tačke luka (za isečke, kružnice od linija, sočiva)
const luk = (cx, cy, R, od, doo, n = 48) => Array.from({ length: n + 1 }, (_, i) => naKrugu([cx, cy], R, od + ((doo - od) * i) / n));

// traka razlomka: pravougaonik w×h u (x, y) podeljen na n delova, obojeno prvih m (ili niz indeksa)
function traka(n, m, { x = 0, y = 0, w = 8, h = 1.2, b = 1, k, id, kasni, vertikalno = false } = {}) {
  const e = [];
  const obojeni = Array.isArray(m) ? m : Array.from({ length: m }, (_, i) => i);
  for (let i = 0; i < n; i++) {
    const [x0, x1] = [x + (w * i) / n, x + (w * (i + 1)) / n];
    const pts = vertikalno ? [[x, y + (h * i) / n], [x + w, y + (h * i) / n], [x + w, y + (h * (i + 1)) / n], [x, y + (h * (i + 1)) / n]] : [[x0, y], [x1, y], [x1, y + h], [x0, y + h]];
    const ob = obojeni.includes(i);
    e.push({ lin: pts.map((p) => p.map(r)), zatv: 1, b: ob ? b : 4, ...(ob ? { gusto: 1 } : { prazno: 1 }), ...(ob && k !== undefined ? { k } : {}), ...(ob && id ? { id } : {}), ...(ob && kasni !== undefined ? { kasni } : {}) });
  }
  return e;
}
// „pica“: krug podeljen na n jednakih isečaka, obojeno prvih m (ili niz indeksa)
function pica(n, m, { cx = 0, cy = 0, R = 3, b = 1, k, id, poc = 90 } = {}) {
  const obojeni = Array.isArray(m) ? m : Array.from({ length: m }, (_, i) => i);
  const e = [];
  for (let i = 0; i < n; i++) {
    const od = poc - (360 * (i + 1)) / n, doo = poc - (360 * i) / n;
    const ob = obojeni.includes(i);
    e.push({ lin: [[cx, cy], ...luk(cx, cy, R, od, doo, Math.max(4, Math.round(48 / n)))], zatv: 1, b: ob ? b : 4, ...(ob ? { gusto: 1 } : { prazno: 1 }), ...(ob && k !== undefined ? { k } : {}), ...(ob && id ? { id } : {}) });
  }
  return e;
}
// skok po brojevnoj pravoj od a do b (luk iznad ose sa strelicom, iscrtava se)
function skok(a, b, { h, boja = 1, k, id, kasni = 0.3, o, ispod = false, trajanje = 0.9 } = {}) {
  const v = (h ?? Math.min(1.6, 0.35 + Math.abs(b - a) * 0.25)) * (ispod ? -1 : 1);
  const pts = Array.from({ length: 17 }, (_, i) => { const t = i / 16; return [r(a + (b - a) * t), r(4 * v * t * (1 - t))]; });
  return { lin: pts, str: 1, crtaj: 1, b: boja, debljina: 2.5, kasni, trajanje, ...(k !== undefined ? { k } : {}), ...(id ? { id } : {}), ...(o ? { o, oAt: [r((a + b) / 2), r(v + (ispod ? -0.45 : 0.35))] } : {}) };
}
// niz skokova jednake dužine (sadržaoci, množenje kao ponovljeno sabiranje)
const skokovi = (od, korak, n, x = {}) => Array.from({ length: n }, (_, i) => skok(od + i * korak, od + (i + 1) * korak, { ...x, kasni: (x.kasni ?? 0.3) + i * (x.razmak ?? 0.7) }));
// kružnica od linija (bez imenovanog centra)
const krug = (cx, cy, R, x = {}) => ({ lin: luk(cx, cy, R, 0, 360, 64), zatv: 1, ...x });
// Venov dijagram dva skupa: krugovi poluprečnika R, centri na razmaku d; vraća elemente i položaje delova
function venn({ R = 3, d = 3.2, imena = ['A', 'B'], presek = false, samoA = false, samoB = false, k, kasni } = {}) {
  const [c1, c2] = [[-d / 2, 0], [d / 2, 0]];
  const e = [];
  // sočivo (presek): luk desnog kruga levo od preseka + luk levog kruga
  const ug = (Math.acos(d / 2 / R) * 180) / Math.PI;
  const socivo = [...luk(c1[0], c1[1], R, -ug, ug, 24), ...luk(c2[0], c2[1], R, 180 - ug, 180 + ug, 24)];
  const x = { ...(k !== undefined ? { k } : {}), ...(kasni !== undefined ? { kasni } : {}) };
  if (samoA) e.push({ lin: [...luk(c1[0], c1[1], R, ug, 360 - ug, 48), ...luk(c2[0], c2[1], R, 180 + ug, 180 - ug, 24)], zatv: 1, b: 1, gusto: 1, id: 'samoA', ...x });
  if (samoB) e.push({ lin: [...luk(c2[0], c2[1], R, 180 + ug - 360, 180 - ug, 48), ...luk(c1[0], c1[1], R, ug, -ug, 24)], zatv: 1, b: 1, gusto: 1, id: 'samoB', ...x });
  if (presek) e.push({ lin: socivo, zatv: 1, b: 2, gusto: 1, id: 'presek', ...x });
  e.push(krug(c1[0], c1[1], R, { b: 0, prazno: 1 }), krug(c2[0], c2[1], R, { b: 5, prazno: 1 }));
  e.push({ tx: imena[0], at: [c1[0] - R * 0.75, R * 0.95], vel: 20 }, { tx: imena[1], at: [c2[0] + R * 0.75, R * 0.95], vel: 20 });
  // mesta za elemente: [x, y] centri delova
  const mesta = { A: [c1[0] - (R - (R - d / 2)) * 0.55 - 0.2, 0], B: [c2[0] + (R - (R - d / 2)) * 0.55 + 0.2, 0], AB: [0, 0] };
  return { e, mesta };
}
// elementi raspoređeni oko tačke [x, y] (brojevi u delu Venovog dijagrama)
function upisi(lista, [x, y], { razmak = 0.75, kolona = 2, ...dod } = {}) {
  const red = Math.ceil(lista.length / kolona);
  return lista.map((t, i) => {
    const kol = Math.min(kolona, lista.length - Math.floor(i / kolona) * kolona);
    const ix = i % kolona, iy = Math.floor(i / kolona);
    return { tx: String(t), at: [r(x + (ix - (kol - 1) / 2) * razmak * 1.2), r(y + ((red - 1) / 2 - iy) * razmak)], ...dod };
  });
}
// sat: brojčanik i kazaljke (sati, minuti); kazaljke mogu da se okreću ("okreni": ugao)
function sat(h, m, { R = 4, okreniMin, okreniSat, ponovi = 0 } = {}) {
  const e = [krug(0, 0, R, { b: 4, prazno: 1 })];
  for (let i = 0; i < 60; i++) {
    const a = 90 - i * 6, d = i % 5 ? 0.25 : 0.55;
    e.push({ lin: [naKrugu([0, 0], R, a), naKrugu([0, 0], R - d, a)], b: 4, debljina: i % 5 ? 1 : 2.5 });
  }
  for (let i = 1; i <= 12; i++) e.push({ tx: String(i), at: naKrugu([0, 0], R - 1.05, 90 - i * 30).map((v, j) => r(v - (j ? 0.12 : 0))) });
  const am = 90 - m * 6, ah = 90 - (h % 12) * 30 - m * 0.5;
  e.push({ lin: [[0, 0], naKrugu([0, 0], R * 0.82, am)], b: 1, debljina: 3, id: 'min', ...(okreniMin ? { okreni: okreniMin, oko: 'O', trajanje: 2.4, ponovi } : {}) });
  e.push({ lin: [[0, 0], naKrugu([0, 0], R * 0.55, ah)], b: 3, debljina: 5, id: 'sat', ...(okreniSat ? { okreni: okreniSat, oko: 'O', trajanje: 2.4, ponovi } : {}) });
  return G(O, e, { ...bez, velicina: 220 });
}
// uglomer: polukrug sa podeocima (centar u [cx, cy])
function uglomer({ cx = 0, cy = 0, R = 5 } = {}) {
  const e = [{ lin: [[cx - R - 0.3, cy], [cx + R + 0.3, cy]], b: 4, debljina: 1.5 }, { lin: luk(cx, cy, R, 0, 180, 48), b: 4, debljina: 1.5 }];
  for (let a = 0; a <= 180; a += 10) {
    e.push({ lin: [naKrugu([cx, cy], R, a), naKrugu([cx, cy], R - (a % 30 ? 0.3 : 0.6), a)], b: 4, debljina: 1.2 });
    if (a % 30 === 0) e.push({ tx: String(a), at: naKrugu([cx, cy], R + 0.55, a) });
  }
  return e;
}
// mreža 10×10 (procenti): obojeno n kvadratića
function sto(n, { b = 1, k, x0 = 0, y0 = 0, a = 0.6, id } = {}) {
  const e = [];
  for (let i = 0; i < 100; i++) {
    const x = x0 + (i % 10) * a, y = y0 + (9 - Math.floor(i / 10)) * a;
    const ob = i < n;
    e.push({ lin: [[x, y], [x + a, y], [x + a, y + a], [x, y + a]].map((p) => p.map(r)), zatv: 1, b: ob ? b : 4, ...(ob ? { gusto: 1, ...(k !== undefined ? { k } : {}), ...(id ? { id } : {}) } : { prazno: 1 }) });
  }
  return e;
}
// tačkice u redovima (deljenje sa ostatkom): n tačkica po `uRedu`
function tackice(n, uRedu, { razmak = 0.8 } = {}) {
  const pune = Math.floor(n / uRedu) * uRedu;
  // ostatak (poslednji nepun red) ima id „ost“ – rešenje ga ističe
  return Array.from({ length: n }, (_, i) => ({ tx: '●', at: [r((i % uRedu) * razmak), r(-Math.floor(i / uRedu) * razmak)], ...(i >= pune ? { id: 'ost' } : {}) }));
}
// koordinatna mreža kao „karirani papir“ (bez brojeva)
const papir = (x0, x1, y0, y1) => ({ mreza: [x0, x1, y0, y1], brojevi: 0 });

module.exports = {
  lekcije, zadaci, G, K, Z, L, proveri, r, naKrugu, pravilni, stubici, kruzni, kocke,
  nzd, nzs, skrati, isti, dec, O, bez, luk, traka, pica, skok, skokovi, krug, venn, upisi, sat, uglomer, sto, tackice, papir,
};
