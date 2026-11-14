// Zajednički alati za zadatke iz fizike za 7. razred: spisak lekcija (po udžbenicima Fizika 7 – Arhiknjiga i
// Zavod za udžbenike, sa zbirkama), kompaktan zapis zadataka i pomoćne funkcije za crteže.
// Svaki fajl teme izvozi funkciju koja dobija ovaj objekat: module.exports = ({ L, Z, K, G, S, … }) => { … }
//
// Mediji zadatka:
//   – uz pitanje: animirana fizička scena (S('kretanje', {...}) → public/fizika.js) ili geo crtež (G)
//   – „crtez“ (resenjeCrtez): geo crtež koji se gradi korak po korak u rešenju (elementi sa k, isticanje i)
//   – korak rešenja može imati i svoj crtež: K(tekst, istaknuti, S(...)) – npr. ista scena, ali sa brojevima/vremenom
//     koje bi u pitanju otkrile odgovor
//   – „odgovor“ (medijiOdgovora): medij uz tačan odgovor
// Tekst: veličine, brojevi i jedinice idu između $…$ (ostaju latinicom); u natpisima crteža reči počinju sa „~“.

const { r } = require('../zadaci-7/osnova');

const lekcije = [
  ['Srednja brzina i ubrzanje', 'Sila i kretanje'],
  ['Drugi Njutnov zakon', 'Sila i kretanje'],
  ['Treći Njutnov zakon', 'Sila i kretanje'],
  ['Brzina kod ravnomerno promenljivog kretanja', 'Sila i kretanje'],
  ['Grafik zavisnosti brzine od vremena', 'Sila i kretanje'],
  ['Pređeni put kod ravnomerno promenljivog kretanja', 'Sila i kretanje'],
  ['Slobodno padanje', 'Kretanje pod dejstvom sile teže i sile otpora'],
  ['Hitac naviše i hitac naniže', 'Kretanje pod dejstvom sile teže i sile otpora'],
  ['Sila trenja', 'Kretanje pod dejstvom sile teže i sile otpora'],
  ['Slaganje i razlaganje sila', 'Ravnoteža tela'],
  ['Moment sile i poluga', 'Ravnoteža tela'],
  ['Sila potiska. Arhimedov zakon', 'Ravnoteža tela'],
  ['Plivanje i tonjenje tela', 'Ravnoteža tela'],
  ['Mehanički rad', 'Mehanički rad, energija i snaga'],
  ['Kinetička energija i rad', 'Mehanički rad, energija i snaga'],
  ['Potencijalna energija', 'Mehanički rad, energija i snaga'],
  ['Zakon održanja mehaničke energije', 'Mehanički rad, energija i snaga'],
  ['Snaga i koeficijent korisnog dejstva', 'Mehanički rad, energija i snaga'],
  ['Toplotno širenje i temperatura', 'Toplotne pojave'],
  ['Količina toplote i specifični toplotni kapacitet', 'Toplotne pojave'],
  ['Toplotna ravnoteža', 'Toplotne pojave'],
].map(([naziv, tema]) => ({ naziv, tema }));

const zadaci = [];
let lek = 0;

// G(tačke, elementi, dodatno) – geo crtež; K(tekst, istaknuti, crtež) – korak rešenja; S(scena, parametri) – fizička scena
const G = (e, x = {}) => ({ vrsta: 'geo', t: { O: [0, 0] }, e: e.flat(Infinity).filter(Boolean), bezImena: ['O'], ...x });
const K = (t, i, crtez) => ({ t, ...(i && i.length ? { i } : {}), ...(crtez ? { crtez } : {}) });
const S = (scena, x = {}) => ({ vrsta: 'fizika', scena, ...x });
// Z(težina, pitanje, odgovori [prvi tačan], rešenje [koraci], medij uz pitanje, { crtez, odgovor })
const Z = (tezina, pitanje, odgovori, resenje, mediji, x = {}) => {
  if (new Set(odgovori).size !== 4) throw new Error('Odgovori moraju biti 4 različita: ' + pitanje);
  zadaci.push({
    lekcija: lek, tezina, pitanje, odgovori, ...(mediji ? { mediji } : {}), resenje,
    ...(x.crtez ? { resenjeCrtez: x.crtez } : {}), ...(x.odgovor ? { medijiOdgovora: x.odgovor } : {}),
  });
};
const L = (naziv) => { lek = lekcije.findIndex((l) => l.naziv === naziv) + 1; if (!lek) throw new Error(naziv); };
// provera računa u alatu: ako ne važi, gradnja puca (da greška ne bi stigla do dece)
const blizu = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b));
const proveri = (a, b, opis) => { if (b === undefined ? !a : !blizu(a, b)) throw new Error('Netačan račun: ' + (opis || `${a} ≠ ${b}`)); };
// broj kao tekst: decimalni zarez, hiljade razdvojene razmakom („1 250,5“)
const b = (x, mesta) => {
  const s = mesta === undefined ? String(+(+x).toFixed(6)) : (+x).toFixed(mesta);
  const [c, d] = s.replace('-', '').split('.');
  return (x < 0 ? '−' : '') + c.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (d ? ',' + d : '');
};

// ════════════════ geo crteži ════════════════
// strelica sile (vektor) od (x, y) za (dx, dy); o = natpis kod vrha
const F = (x, y, dx, dy, { o, b: boja = 1, k, id, kraj, kasni, crtaj, deb = 3.5, oAt, isp } = {}) => ({
  lin: [[r(x), r(y)], [r(x + dx), r(y + dy)]], str: 1, b: boja, debljina: deb,
  ...(o ? { o, oAt: oAt || [r(x + dx + (dx >= 0 ? 0.25 : -0.25) * (Math.abs(dy) > Math.abs(dx) ? 0 : 1) + (Math.abs(dy) > Math.abs(dx) ? 0.55 : 0)), r(y + dy + (Math.abs(dy) > Math.abs(dx) ? (dy > 0 ? 0.2 : -0.45) : 0.45))] } : {}),
  ...(k !== undefined ? { k } : {}), ...(id ? { id } : {}), ...(kraj !== undefined ? { kraj } : {}),
  ...(kasni !== undefined ? { kasni } : {}), ...(crtaj ? { crtaj: 1 } : {}), ...(isp ? { isp: 1 } : {}),
});
// telo (pravougaonik) sa natpisom u sredini
const telo = (x, y, w, h, { tx, b: boja = 4, k, id, pomeri, kasni, trajanje, gusto = 1 } = {}) => [
  { lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((p) => p.map(r)), zatv: 1, b: boja, ...(gusto ? { gusto: 1 } : {}), ...(k !== undefined ? { k } : {}), ...(id ? { id } : {}), ...(pomeri ? { pomeri, kasni: kasni ?? 0.3, trajanje: trajanje ?? 1.8 } : {}) },
  ...(tx ? [{ tx, at: [r(x + w / 2), r(y + h / 2)], ...(k !== undefined ? { k } : {}), ...(pomeri ? { pomeri, kasni: kasni ?? 0.3, trajanje: trajanje ?? 1.8 } : {}) }] : []),
];
// podloga (tlo) sa šrafurom
const tlo = (x0, x1, y = 0, { k } = {}) => [
  { lin: [[x0, y], [x1, y]], b: 4, debljina: 2.5, ...(k !== undefined ? { k } : {}) },
  ...Array.from({ length: Math.floor((x1 - x0) / 0.6) }, (_, i) => ({ lin: [[r(x0 + 0.3 + i * 0.6), y], [r(x0 + i * 0.6), r(y - 0.3)]], b: 4, debljina: 1, ...(k !== undefined ? { k } : {}) })),
];
// tekst na crtežu
const T = (tx, x, y, x2 = {}) => ({ tx, at: [r(x), r(y)], ...x2 });
// mera (dvostruka strelica) od (x1, y1) do (x2, y2) sa natpisom
const mera = (x1, y1, x2, y2, o, x = {}) => [
  { lin: [[r((x1 + x2) / 2), r((y1 + y2) / 2)], [x2, y2]], str: 1, b: x.b ?? 3, debljina: 1.6, ...(x.k !== undefined ? { k: x.k } : {}), ...(x.id ? { id: x.id } : {}) },
  { lin: [[r((x1 + x2) / 2), r((y1 + y2) / 2)], [x1, y1]], str: 1, b: x.b ?? 3, debljina: 1.6, ...(x.k !== undefined ? { k: x.k } : {}), ...(x.id ? { id: x.id } : {}) },
  ...(o ? [{ tx: o, at: x.oAt || [r((x1 + x2) / 2 + (y1 === y2 ? 0 : 0.6)), r((y1 + y2) / 2 + (y1 === y2 ? 0.4 : 0))], b: x.b ?? 3, ...(x.k !== undefined ? { k: x.k } : {}), ...(x.id ? { id: x.id } : {}) }] : []),
];

// Grafik (koordinatni sistem sa podeocima): xmax, ymax (i ymin), xk, yk (razmak podeoka), x/y natpisi osa,
// sir/vis (veličina u jedinicama crteža). Vraća { e (osnova), P(x, y), linija(tacke, x), povrs(tacke, x), proj(x, y, x) }.
function grafik({ xmax, ymax, ymin = 0, xk = 1, yk = 1, x = 't (s)', y = 'v (m/s)', sir = 8, vis = 5, brojevi = true } = {}) {
  const sx = sir / xmax, sy = vis / (ymax - ymin);
  const P = (a, c) => [r(a * sx), r(c * sy)];
  const y0 = P(0, 0)[1];
  const e = [{ mreza: [0, r(sir), r(ymin * sy), r(vis + ymin * sy)], podela: [r(xk * sx), r(yk * sy)], brojevi: 0 }];
  if (brojevi) {
    for (let a = xk; a <= xmax + 1e-9; a += xk) e.push({ tx: b(a), at: [P(a, 0)[0], r(y0 - 0.38)], vel: 12 });
    for (let c = Math.ceil(ymin / yk) * yk; c <= ymax + 1e-9; c += yk) if (Math.abs(c) > 1e-9) e.push({ tx: b(c), at: [r(-0.42 - 0.08 * b(c).length), P(0, c)[1]], vel: 12 });
    e.push({ tx: '0', at: [-0.3, r(y0 - 0.38)], vel: 12 });
  }
  e.push({ lin: [[0, y0], [r(sir + 0.7), y0]], str: 1, b: 5, debljina: 2 }, { lin: [[0, r(ymin * sy)], [0, r(vis + ymin * sy + 0.7)]], str: 1, b: 5, debljina: 2 });
  e.push({ tx: x, at: [r(sir + 0.75), r(y0 + 0.45)], vel: 13 }, { tx: y, at: [r(0.25 + y.length * 0.1), r(vis + ymin * sy + 0.85)], vel: 13 });
  const linija = (tacke, x2 = {}) => ({ lin: tacke.map(([a, c]) => P(a, c)), b: x2.b ?? 0, debljina: x2.deb ?? 3.5, ...(x2.crtaj !== false ? { crtaj: 1, trajanje: x2.trajanje ?? 1.6 } : {}), ...(x2.k !== undefined ? { k: x2.k } : {}), ...(x2.id ? { id: x2.id } : {}), ...(x2.kasni !== undefined ? { kasni: x2.kasni } : {}), ...(x2.o ? { o: x2.o, oAt: x2.oAt ? P(...x2.oAt) : undefined } : {}) });
  const povrs = (tacke, x2 = {}) => ({ lin: [P(tacke[0][0], 0), ...tacke.map(([a, c]) => P(a, c)), P(tacke[tacke.length - 1][0], 0)], zatv: 1, b: x2.b ?? 2, ...(x2.gusto ? { gusto: 1 } : {}), ...(x2.k !== undefined ? { k: x2.k } : {}), ...(x2.id ? { id: x2.id } : {}) });
  const proj = (a, c, x2 = {}) => [
    { lin: [P(a, 0), P(a, c)], isp: 1, b: x2.b ?? 3, debljina: 1.5, ...(x2.k !== undefined ? { k: x2.k } : {}), ...(x2.id ? { id: x2.id } : {}) },
    { lin: [P(0, c), P(a, c)], isp: 1, b: x2.b ?? 3, debljina: 1.5, ...(x2.k !== undefined ? { k: x2.k } : {}), ...(x2.id ? { id: x2.id } : {}) },
  ];
  const tacka = (a, c, x2 = {}) => ({ tx: '●', at: P(a, c), b: x2.b ?? 3, ...(x2.k !== undefined ? { k: x2.k } : {}), ...(x2.id ? { id: x2.id } : {}) });
  const tekst = (tx, a, c, x2 = {}) => ({ tx, at: P(a, c), ...x2 });
  return { e, P, linija, povrs, proj, tacka, tekst };
}

// stubići (npr. energije, količine toplote): [[natpis, vrednost, boja]], maks, visina
function stubovi(podaci, { maks, vis = 4, sir = 1.2, razmak = 0.7, k, id, jedinica = '' } = {}) {
  const M = maks ?? Math.max(...podaci.map((p) => p[1]));
  return podaci.flatMap(([o, v, boja], i) => {
    const x = i * (sir + razmak), h = r((v / M) * vis);
    const kk = Array.isArray(k) ? k[i] : k, ii = Array.isArray(id) ? id[i] : id;
    const x2 = { ...(kk !== undefined ? { k: kk } : {}), ...(ii ? { id: ii } : {}) };
    return [
      ...(h > 0 ? [{ lin: [[x, 0], [r(x + sir), 0], [r(x + sir), h], [x, h]], zatv: 1, b: boja ?? i, gusto: 1, ...x2 }] : []),
      { tx: o, at: [r(x + sir / 2), -0.45], vel: 13 },
      ...(jedinica !== null ? [{ tx: b(v) + (jedinica ? ' ' + jedinica : ''), at: [r(x + sir / 2), r(h + 0.4)], vel: 12, ...x2 }] : []),
    ];
  });
}

module.exports = { lekcije, zadaci, G, K, S, Z, L, proveri, blizu, b, r, F, telo, tlo, T, mera, grafik, stubovi };
