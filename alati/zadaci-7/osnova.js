// Zajednički alati za zadatke 7. razreda: kompaktan zapis zadataka i pomoćne funkcije za crteže (medij „geo“).
// Svaki fajl teme izvozi funkciju koja dobija ovaj objekat: module.exports = ({ L, Z, K, G, … }) => { … }

const lekcije = [
  ['Kvadrat racionalnog broja', 'Realni brojevi'],
  ['Rešavanje jednačine x² = a', 'Realni brojevi'],
  ['Kvadratni koren', 'Realni brojevi'],
  ['Iracionalni brojevi i brojevna prava', 'Realni brojevi'],
  ['Decimalni zapisi racionalnih i iracionalnih brojeva', 'Realni brojevi'],
  ['Približna vrednost', 'Realni brojevi'],
  ['Osnovne računske operacije i kvadratni koren', 'Realni brojevi'],
  ['Funkcija direktne proporcionalnosti', 'Realni brojevi'],
  ['Produžena proporcija', 'Realni brojevi'],
  ['Pitagorina teorema', 'Pitagorina teorema'],
  ['Obrnuta Pitagorina teorema', 'Pitagorina teorema'],
  ['Primena Pitagorine teoreme na pravougaonik i kvadrat', 'Pitagorina teorema'],
  ['Primena Pitagorine teoreme na jednakokraki i jednakostranični trougao', 'Pitagorina teorema'],
  ['Primena Pitagorine teoreme na paralelogram, romb i deltoid', 'Pitagorina teorema'],
  ['Primena Pitagorine teoreme na trapez', 'Pitagorina teorema'],
  ['Konstrukcije tačaka na brojevnoj pravoj koje odgovaraju kvadratnim korenima', 'Pitagorina teorema'],
  ['Rastojanje između dve tačke u koordinatnoj ravni', 'Pitagorina teorema'],
  ['Stepenovanje prirodnim brojem', 'Celi algebarski izrazi'],
  ['Operacije sa stepenima; stepen proizvoda i količnika', 'Celi algebarski izrazi'],
  ['Stepenovanje dekadne jedinice celim brojem', 'Celi algebarski izrazi'],
  ['Algebarski izrazi; brojevna vrednost izraza', 'Celi algebarski izrazi'],
  ['Polinomi; operacije sa polinomima', 'Celi algebarski izrazi'],
  ['Kvadrat binoma i razlika kvadrata', 'Celi algebarski izrazi'],
  ['Rastavljanje polinoma na činioce', 'Celi algebarski izrazi'],
  ['Pojam mnogougla i broj dijagonala', 'Mnogougao'],
  ['Uglovi mnogougla', 'Mnogougao'],
  ['Pravilni mnogouglovi', 'Mnogougao'],
  ['Konstrukcija pravilnih mnogouglova', 'Mnogougao'],
  ['Obim i površina mnogougla', 'Mnogougao'],
  ['Ortocentar i težište trougla', 'Mnogougao'],
  ['Složenije primene stavova podudarnosti', 'Mnogougao'],
  ['Krug i kružnica', 'Krug'],
  ['Centralni i periferijski ugao kruga', 'Krug'],
  ['Obim kruga; broj π', 'Krug'],
  ['Dužina kružnog luka', 'Krug'],
  ['Površina kruga', 'Krug'],
  ['Površina kružnog isečka i kružnog prstena', 'Krug'],
  ['Rotacija', 'Krug'],
  ['Projektni zadatak; prikupljanje podataka', 'Obrada podataka'],
  ['Statistička obeležja podataka', 'Obrada podataka'],
  ['Priprema, analiza i prezentacija podataka', 'Obrada podataka'],
].map(([naziv, tema]) => ({ naziv, tema }));

const zadaci = [];
let lek = 0;

// G(tačke, elementi, dodatno) – crtež; K(tekst, istaknuti, crtež) – korak rešenja
const G = (t, e, x = {}) => ({ vrsta: 'geo', t, e, ...x });
const K = (t, i, crtez) => ({ t, ...(i && i.length ? { i } : {}), ...(crtez ? { crtez } : {}) });
// Z(težina, pitanje, odgovori [prvi tačan], rešenje [koraci], crtež uz pitanje)
const Z = (tezina, pitanje, odgovori, resenje, mediji) => {
  if (new Set(odgovori).size !== 4) throw new Error('Odgovori moraju biti 4 različita: ' + pitanje);
  zadaci.push({ lekcija: lek, tezina, pitanje, odgovori, ...(mediji ? { mediji } : {}), resenje });
};
const L = (naziv) => { lek = lekcije.findIndex((l) => l.naziv === naziv) + 1; if (!lek) throw new Error(naziv); };
// provera računa u alatu: ako ne važi, gradnja puca (da greška ne bi stigla do dece)
const proveri = (uslov, opis) => { if (!uslov) throw new Error('Netačan račun: ' + opis); };

const r = (x) => +x.toFixed(3);
const S3 = Math.sqrt(3);
const rad = (u) => (u * Math.PI) / 180;
// tačka na kružnici
const naKrugu = (c, R, ugao) => [r(c[0] + R * Math.cos(rad(ugao))), r(c[1] + R * Math.sin(rad(ugao)))];
// temena pravilnog n-tougla: { A: […], B: […], … } (ili sa datim imenima)
function pravilni(n, R = 5, c = [0, 0], pocetak = -90 - 180 / n, imena) {
  const t = {};
  const ime = imena || 'ABCDEFGHIJKLMNOP';
  for (let i = 0; i < n; i++) t[ime[i]] = naKrugu(c, R, pocetak + (360 * i) / n);
  return t;
}
const ime = (n, imena = 'ABCDEFGHIJKLMNOP') => imena.slice(0, n);

// ── dijagrami ──
// stubičasti dijagram: podaci = [[natpis, vrednost], …]
function stubici(podaci, { korakY = 1, maxY, visina = 6, sirina, boja = 0, istakni = [], k = {}, jedinica = '', vrednosti = false } = {}) {
  const n = podaci.length;
  const W = sirina || Math.max(8, n * 1.6);
  const korak = W / n;
  const mx = maxY ?? Math.max(...podaci.map((p) => p[1]));
  const sy = visina / mx;
  const e = [];
  e.push({ lin: [[0, 0], [W + 0.4, 0]], b: 5, debljina: 2, str: 1 });
  e.push({ lin: [[0, 0], [0, visina + 0.8]], b: 5, debljina: 2, str: 1 });
  for (let y = korakY; y <= mx + 1e-9; y += korakY) {
    e.push({ lin: [[-0.15, y * sy], [W, y * sy]], b: 5, debljina: 0.6, isp: 1 });
    e.push({ tx: String(+y.toFixed(2)).replace('.', ','), at: [-0.55, y * sy - 0.12] });
  }
  podaci.forEach(([naziv, v], i) => {
    const x0 = i * korak + korak * 0.18, x1 = (i + 1) * korak - korak * 0.18;
    const el = { lin: [[x0, 0], [x1, 0], [x1, v * sy], [x0, v * sy]], zatv: 1, gusto: 1, b: istakni.includes(i) ? 1 : boja, id: 's' + i };
    if (k[i] !== undefined) el.k = k[i];
    e.push(el);
    e.push({ tx: naziv, at: [(x0 + x1) / 2, -0.55] });
    if (vrednosti) e.push({ tx: String(v).replace('.', ',') + jedinica, at: [(x0 + x1) / 2, v * sy + 0.4], ...(k[i] !== undefined ? { k: k[i] } : {}) });
  });
  return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 320 });
}
// kružni dijagram: podaci = [[natpis, udeo], …] (udeli u bilo kojim jedinicama)
function kruzni(podaci, { R = 4, poc = 90, natpisi = true } = {}) {
  const ukupno = podaci.reduce((a, p) => a + p[1], 0);
  const e = [];
  let ug = poc;
  podaci.forEach(([naziv, v], i) => {
    const d = (360 * v) / ukupno;
    e.push({ is: 'O', r: R, od: r(ug - d), do: r(ug), b: i % 6, gusto: 1, id: 'k' + i, ...(natpisi ? { o: naziv, oR: 0.62 } : {}) });
    ug -= d;
  });
  return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 260 });
}
// izometrijska kocka od n×n×n kockica (za stepene a³), ili kvadar a×b×c
function kocke(a, b = a, c = a, { boja = 0, istakni } = {}) {
  const e = [];
  const P = (x, y, z) => [r(x * 0.87 - y * 0.87), r(z + x * 0.5 + y * 0.5)];
  const lice = (pts, bb, gusto) => e.push({ lin: pts, zatv: 1, b: bb, gusto });
  // posmatrač gleda spreda-odozgo: vide se gornje lice (z = c) i dva prednja (y = 0 i x = 0)
  for (let x = 0; x < a; x++) for (let y = 0; y < b; y++) lice([P(x, y, c), P(x + 1, y, c), P(x + 1, y + 1, c), P(x, y + 1, c)], boja, 1);
  for (let x = 0; x < a; x++) for (let z = 0; z < c; z++) lice([P(x, 0, z), P(x + 1, 0, z), P(x + 1, 0, z + 1), P(x, 0, z + 1)], istakni ?? 4, 0);
  for (let y = 0; y < b; y++) for (let z = 0; z < c; z++) lice([P(0, y, z), P(0, y + 1, z), P(0, y + 1, z + 1), P(0, y, z + 1)], 2, 0);
  return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 220 });
}
// grafik prave y = k·x + n na intervalu [od, do]
const prava = (k, n, od, doo, x = {}) => ({ lin: [[od, r(k * od + n)], [doo, r(k * doo + n)]], b: 1, ...x });

module.exports = { lekcije, zadaci, G, K, Z, L, proveri, r, S3, rad, naKrugu, pravilni, ime, stubici, kruzni, kocke, prava };
