// Zajednički alati za matematiku 6. razreda (zadaci i teorija): spisak lekcija (po udžbeniku
// Matematika 6, Arhiknjiga / Fondacija Kavčić, sadržaj), kompaktan zapis zadataka i pomoćne funkcije
// za crteže (medij „geo“). Svaki fajl teme izvozi funkciju: module.exports = ({ L, Z, K, G, … }) => { … }
//
// Pomoćni crteži 5. i 7. razreda su ovde svi dostupni (traka, pica, skok, skokovi, krug, venn, upisi,
// uglomer, sto, papir, pravilni, stubici, kruzni, kocke, prava …), a uz njih i crteži 6. razreda:
// `brojevna` (brojevna prava celih/racionalnih brojeva), `termometar`, `trougao`, `cetvorougao`,
// `vektor`, `koord` (koordinatna ravan sa tačkama), `kvadratici` (površina brojanjem kvadratića).

const A5 = require('../zadaci-5/osnova');
const A7 = require('../zadaci-7/osnova');
const { r, naKrugu, luk } = A5;

const lekcije = [
  ['Skup celih brojeva i brojevna prava', 'Celi brojevi'],
  ['Suprotni brojevi i apsolutna vrednost broja', 'Celi brojevi'],
  ['Poređenje celih brojeva', 'Celi brojevi'],
  ['Sabiranje celih brojeva', 'Celi brojevi'],
  ['Oduzimanje celih brojeva', 'Celi brojevi'],
  ['Izrazi sa zagradama', 'Celi brojevi'],
  ['Množenje celih brojeva', 'Celi brojevi'],
  ['Deljenje celih brojeva', 'Celi brojevi'],
  ['Osnovni elementi trougla', 'Trougao'],
  ['Unutrašnji uglovi trougla', 'Trougao'],
  ['Spoljašnji uglovi trougla', 'Trougao'],
  ['Odnos stranica i uglova u trouglu', 'Trougao'],
  ['Nejednakosti trougla', 'Trougao'],
  ['Skup racionalnih brojeva i brojevna prava', 'Racionalni brojevi'],
  ['Različiti zapisi racionalnih brojeva', 'Racionalni brojevi'],
  ['Apsolutna vrednost i upoređivanje racionalnih brojeva', 'Racionalni brojevi'],
  ['Sabiranje i oduzimanje racionalnih brojeva', 'Racionalni brojevi'],
  ['Množenje racionalnih brojeva', 'Racionalni brojevi'],
  ['Deljenje racionalnih brojeva', 'Racionalni brojevi'],
  ['Izrazi sa racionalnim brojevima', 'Racionalni brojevi'],
  ['Jednačine sa jednom nepoznatom', 'Racionalni brojevi'],
  ['Nejednačine sa jednom nepoznatom', 'Racionalni brojevi'],
  ['Geometrijske konstrukcije', 'Podudarnost trouglova'],
  ['Osnovne konstrukcije trougla', 'Podudarnost trouglova'],
  ['Podudarnost trouglova', 'Podudarnost trouglova'],
  ['Stavovi podudarnosti trouglova', 'Podudarnost trouglova'],
  ['Primene stavova podudarnosti', 'Podudarnost trouglova'],
  ['Koordinatni sistem i prikaz tačaka', 'Zavisne veličine i proporcionalnost'],
  ['Zavisnosti među veličinama', 'Zavisne veličine i proporcionalnost'],
  ['Direktna proporcionalnost', 'Zavisne veličine i proporcionalnost'],
  ['Obrnuta proporcionalnost', 'Zavisne veličine i proporcionalnost'],
  ['Razmera i proporcija', 'Zavisne veličine i proporcionalnost'],
  ['Osnovni elementi četvorougla', 'Četvorougao'],
  ['Unutrašnji uglovi četvorougla', 'Četvorougao'],
  ['Spoljašnji uglovi četvorougla', 'Četvorougao'],
  ['Paralelogram', 'Četvorougao'],
  ['Vrste paralelograma', 'Četvorougao'],
  ['Konstrukcija paralelograma', 'Četvorougao'],
  ['Operacije sa vektorima', 'Četvorougao'],
  ['Trapez', 'Četvorougao'],
  ['Konstrukcija trapeza', 'Četvorougao'],
  ['Deltoid', 'Četvorougao'],
  ['Pojam površine; merenje površine', 'Površina trougla i četvorougla'],
  ['Površina pravougaonika i kvadrata', 'Površina trougla i četvorougla'],
  ['Površina paralelograma', 'Površina trougla i četvorougla'],
  ['Površina trougla', 'Površina trougla i četvorougla'],
  ['Površina trapeza', 'Površina trougla i četvorougla'],
  ['Površina četvorougla sa normalnim dijagonalama', 'Površina trougla i četvorougla'],
].map(([naziv, tema]) => ({ naziv, tema }));

const zadaci = [];
let lek = 0;

// G(tačke, elementi, dodatno) – crtež; K(tekst, istaknuti, crtež) – korak rešenja
const G = (t, e, x = {}) => ({ vrsta: 'geo', t, e: e.flat(), ...x });
const K = (t, i, crtez) => ({ t, ...(i && i.length ? { i } : {}), ...(crtez ? { crtez } : {}) });
// Crtež umotan u R(…) vidi se tek u rešenju – kad bi uz pitanje odao odgovor.
const R = (crtez) => ({ samoResenje: crtez });
// Z(težina, pitanje, odgovori [prvi tačan], rešenje [koraci], crtež uz pitanje ili R(crtež))
const Z = (tezina, pitanje, odgovori, resenje, mediji) => {
  if (!lek) throw new Error('Zadatak pre nego što je izabrana lekcija (L): ' + pitanje);
  if (new Set(odgovori).size !== 4) throw new Error('Odgovori moraju biti 4 različita: ' + pitanje);
  const crtez = mediji && mediji.samoResenje ? { resenjeCrtez: mediji.samoResenje } : mediji ? { mediji } : {};
  zadaci.push({ lekcija: lek, tezina, pitanje, odgovori, ...crtez, resenje });
};
const L = (naziv) => { lek = lekcije.findIndex((l) => l.naziv === naziv) + 1; if (!lek) throw new Error('Nepoznata lekcija: ' + naziv); };
// provera računa u alatu: ako ne važi, gradnja puca (da greška ne bi stigla do dece)
const proveri = (uslov, opis) => { if (!uslov) throw new Error('Netačan račun: ' + opis); };

const O = { O: [0, 0] };
const bez = { bezImena: ['O'] };

// ── crteži 6. razreda (elementi bez imenovanih tačaka, slobodno se kombinuju) ──

// brojevna prava od..do sa podeocima (može i negativno); tacke = [[vrednost, natpis, boja], …]
// (natpis iznad tačke, npr. 'A' ili '−3'); x = dodatna polja ose ({ podela, svaki })
function brojevna(od, doo, tacke = [], { podela = 1, svaki, velicina = 320, e = [] } = {}) {
  const el = [{ osa: [od, doo], podela, ...(svaki ? { svaki } : {}) }];
  const h = Math.max(1, (doo - od) / 12); // natpisi iznad ose srazmerni dužini prave
  for (const [v, natpis, b = 1, dod = {}] of tacke) {
    el.push({ tx: '●', at: [r(v), 0.02 * h], b, ...dod });
    if (natpis) el.push({ tx: natpis, at: [r(v), r(0.6 * h)], b, vel: 18, ...dod });
  }
  // tačka O (0, 0) bi rastegla crtež do nule kad prava ne sadrži nulu
  return G(od <= 0 && doo >= 0 ? O : {}, [...el, ...e], { ...bez, velicina });
}

// termometar (uspravna skala od..do, živa do vrednosti t); korak natpisa bar 5, uz G(…, { velicina: 140 })
function termometar(t, { od = -20, doo = 30, korak = 10, x = 0, b = 1, k, id } = {}) {
  const s = 0.12; // 1 °C = 0,12 jedinice (crtež uz G(O, termometar(…), { ...bez, velicina: 200 }))
  const e = [
    { lin: [[x - 0.3, od * s - 0.6], [x + 0.3, od * s - 0.6], [x + 0.3, doo * s + 0.3], [x - 0.3, doo * s + 0.3]], zatv: 1, b: 4, prazno: 1 },
    { lin: [[x - 0.16, od * s - 0.5], [x + 0.16, od * s - 0.5], [x + 0.16, t * s], [x - 0.16, t * s]], zatv: 1, gusto: 1, b, ...(k !== undefined ? { k } : {}), ...(id ? { id } : {}) },
  ];
  for (let v = od; v <= doo; v += korak) {
    e.push({ lin: [[x + 0.3, v * s], [x + 0.6, v * s]], b: 4, debljina: 1.5 });
    e.push({ tx: (v < 0 ? '−' : '') + Math.abs(v) + '°', at: [x + 1.3, v * s - 0.1] });
  }
  return e;
}

// trougao iz tri tačke: t = { A, B, C } (koordinate); x = { uglovi: { A: '50°' }, stranice: { a: '5 cm' }, pu: 'C', … }
// vraća { t, e } da bi se mogli dodati elementi (visine, spoljašnji uglovi…)
function trougao(A, B, C, { imena = 'ABC', b = 0, uglovi = {}, stranice = {}, pu, e = [], velicina = 240, x = {} } = {}) {
  const [a, bb, c] = imena;
  const t = { [a]: A, [bb]: B, [c]: C };
  const el = [{ p: imena, b }];
  // stranica a je naspram A (BC), b naspram B (CA), c naspram C (AB)
  const nasp = { a: bb + c, b: c + a, c: a + bb };
  for (const [s, o] of Object.entries(stranice)) el.push({ d: nasp[s] || s, o });
  for (const [v, o] of Object.entries(uglovi)) {
    const i = imena.indexOf(v);
    el.push({ u: imena[(i + 2) % 3] + v + imena[(i + 1) % 3], o, b: 1 });
  }
  if (pu) { const i = imena.indexOf(pu); el.push({ pu: imena[(i + 2) % 3] + pu + imena[(i + 1) % 3] }); }
  return G(t, [...el, ...e], { velicina, ...x });
}

// četvorougao iz četiri tačke ABCD (koordinate), opciono dijagonale
function cetvorougao(A, B, C, D, { imena = 'ABCD', b = 0, dijagonale = false, e = [], velicina = 240, x = {}, t: dodT = {} } = {}) {
  const t = { [imena[0]]: A, [imena[1]]: B, [imena[2]]: C, [imena[3]]: D, ...dodT };
  const el = [{ p: imena, b }];
  if (dijagonale) el.push({ d: imena[0] + imena[2], b: 1, isp: 1, id: 'd1' }, { d: imena[1] + imena[3], b: 2, isp: 1, id: 'd2' });
  return G(t, [...el, ...e], { velicina, ...x });
}

// vektor kao strelica od tačke [x, y] za [dx, dy] (koordinate, bez imenovanih tačaka)
const vektor = ([x, y], [dx, dy], { b = 1, o, ...dod } = {}) => ({
  lin: [[r(x), r(y)], [r(x + dx), r(y + dy)]], str: 1, b, debljina: 3,
  ...(o ? { o, oAt: [r(x + dx / 2 - dy * 0.12), r(y + dy / 2 + dx * 0.12 + 0.3)] } : {}), ...dod,
});

// koordinatna ravan [x0, x1] × [y0, y1] sa tačkama: tacke = { A: [2, 3], … } (imenovane, za d/p elemente)
function koord(x0, x1, y0, y1, tacke = {}, { e = [], velicina = 300, istakni = Object.keys(tacke), ose = ['x', 'y'] } = {}) {
  const el = [{ mreza: [x0, x1, y0, y1], ose }];
  for (const n of istakni) el.push({ tacka: n, b: 1 });
  return G({ ...O, ...tacke }, [...el, ...e], { ...bez, velicina });
}

// mreža jediničnih kvadratića [x0, x1] × [y0, y1] (karirani papir za površinu) + lik (lin, zatv)
function kvadratici(x0, x1, y0, y1, likovi = [], { velicina = 280 } = {}) {
  const e = [];
  for (let x = x0; x <= x1; x++) e.push({ lin: [[x, y0], [x, y1]], b: 4, debljina: 0.6 });
  for (let y = y0; y <= y1; y++) e.push({ lin: [[x0, y], [x1, y]], b: 4, debljina: 0.6 });
  return G(O, [...e, ...likovi], { ...bez, velicina });
}

module.exports = {
  ...A5, ...A7,
  lekcije, zadaci, G, K, Z, R, L, proveri, O, bez, r, naKrugu, luk,
  brojevna, termometar, trougao, cetvorougao, vektor, koord, kvadratici,
};
