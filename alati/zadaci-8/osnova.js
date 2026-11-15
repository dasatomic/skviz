// Zajednički alati za zadatke 8. razreda: kompaktan zapis zadataka i pomoćne funkcije za crteže.
// Koristi pomoćne funkcije za geo crteže iz 7. razreda (public/geo.js, isti format).
// Svaki fajl teme izvozi funkciju koja dobija ovaj objekat: module.exports = ({ L, Z, G, K, … }) => { … }

const Z7 = require('../zadaci-7/osnova.js');
const { G, K, proveri, r, S3, rad, naKrugu, pravilni, ime, stubici, kruzni, kocke, prava } = Z7;

const lekcije = [
  // ── 1. Sličnost ──
  ['Proporcionalnost duži', 'Sličnost'],
  ['Talesova teorema', 'Sličnost'],
  ['Primena Talesove teoreme u konstrukcijama', 'Sličnost'],
  ['Sličnost trouglova', 'Sličnost'],
  ['Stavovi sličnosti trouglova', 'Sličnost'],
  ['Primena sličnosti na pravougli trougao', 'Sličnost'],
  ['Primena sličnosti', 'Sličnost'],
  // ── 2. Tačka, prava, ravan ──
  ['Odnos tačke i prave; određenost prave', 'Tačka, prava, ravan'],
  ['Odnos tačke, prave i ravni; određenost ravni', 'Tačka, prava, ravan'],
  ['Međusobni odnosi pravih', 'Tačka, prava, ravan'],
  ['Mimoilazne prave; presek pravih', 'Tačka, prava, ravan'],
  ['Odnos prave i ravni; normala na ravan', 'Tačka, prava, ravan'],
  ['Odnosi dve ravni', 'Tačka, prava, ravan'],
  ['Normalna projekcija tačke, prave i duži na ravan', 'Tačka, prava, ravan'],
  ['Normalna projekcija prave; ugao između prave i ravni', 'Tačka, prava, ravan'],
  // ── 3. Linearne jednačine i nejednačine ──
  ['Pojam jednačine', 'Linearne jednačine i nejednačine'],
  ['Ekvivalentne jednačine; linearna jednačina', 'Linearne jednačine i nejednačine'],
  ['Ekvivalentne transformacije', 'Linearne jednačine i nejednačine'],
  ['Rešavanje linearnih jednačina', 'Linearne jednačine i nejednačine'],
  ['Još o linearnim jednačinama', 'Linearne jednačine i nejednačine'],
  ['Jednačine koje se svode na linearnu jednačinu', 'Linearne jednačine i nejednačine'],
  ['Primena linearnih jednačina', 'Linearne jednačine i nejednačine'],
  ['Primena linearnih jednačina na probleme kretanja', 'Linearne jednačine i nejednačine'],
  ['Još neke primene linearnih jednačina', 'Linearne jednačine i nejednačine'],
  ['Nejednačine', 'Linearne jednačine i nejednačine'],
  ['Ekvivalentne nejednačine', 'Linearne jednačine i nejednačine'],
  ['Linearna nejednačina', 'Linearne jednačine i nejednačine'],
  ['Rešavanje linearnih nejednačina', 'Linearne jednačine i nejednačine'],
  ['Primena linearnih nejednačina', 'Linearne jednačine i nejednačine'],
  // ── 4. Prizma ──
  ['Pojam, vrste i elementi prizme', 'Prizma'],
  ['Dijagonale prizme i dijagonalni presek', 'Prizma'],
  ['Mreža prizme', 'Prizma'],
  ['Površina prave prizme i prave četvorostrane prizme', 'Prizma'],
  ['Površina prave trostrane prizme i pravilne šestostrane prizme', 'Prizma'],
  ['Zapremina prizme i prave četvorostrane prizme', 'Prizma'],
  ['Zapremina prave trostrane prizme i pravilne šestostrane prizme', 'Prizma'],
  ['Neke primene površine i zapremine prizme', 'Prizma'],
  // ── 5. Piramida ──
  ['Piramida: pojam, vrste, elementi', 'Piramida'],
  ['Mreža piramide', 'Piramida'],
  ['Površina piramide', 'Piramida'],
  ['Površina pravilne trostrane i pravilne šestostrane piramide', 'Piramida'],
  ['Zapremina piramide; zapremina četvorostrane piramide', 'Piramida'],
  ['Zapremina pravilne trostrane i pravilne šestostrane piramide', 'Piramida'],
  // ── 6. Linearne funkcije ──
  ['Pojam funkcije', 'Linearne funkcije'],
  ['Linearna funkcija y = kx + n', 'Linearne funkcije'],
  ['Primeri linearnih funkcija', 'Linearne funkcije'],
  ['Grafik linearne funkcije', 'Linearne funkcije'],
  ['Neke karakteristike linearne funkcije i njihovi grafici', 'Linearne funkcije'],
  ['Nule i znak linearne funkcije', 'Linearne funkcije'],
  ['Rast i opadanje linearne funkcije', 'Linearne funkcije'],
  ['Implicitni oblik linearne funkcije', 'Linearne funkcije'],
  ['Čitanje grafika linearne funkcije', 'Linearne funkcije'],
  // ── 7. Sistemi linearnih jednačina ──
  ['Pojam sistema linearnih jednačina sa dve nepoznate', 'Sistemi linearnih jednačina'],
  ['Ekvivalentnost sistema linearnih jednačina', 'Sistemi linearnih jednačina'],
  ['Rešavanje sistema metodom smene', 'Sistemi linearnih jednačina'],
  ['Rešavanje sistema metodom suprotnih koeficijenata', 'Sistemi linearnih jednačina'],
  ['Rešavanje sistema grafičkom metodom', 'Sistemi linearnih jednačina'],
  ['Rešavanje nekih karakterističnih sistema', 'Sistemi linearnih jednačina'],
  ['Primena sistema linearnih jednačina', 'Sistemi linearnih jednačina'],
  // ── 8. Valjak, kupa, lopta ──
  ['Valjak: osnovni elementi', 'Valjak, kupa, lopta'],
  ['Ravni preseci valjka', 'Valjak, kupa, lopta'],
  ['Mreža valjka, površina valjka', 'Valjak, kupa, lopta'],
  ['Zapremina valjka', 'Valjak, kupa, lopta'],
  ['Kupa: osnovni elementi', 'Valjak, kupa, lopta'],
  ['Ravni preseci kupe', 'Valjak, kupa, lopta'],
  ['Mreža kupe, površina kupe', 'Valjak, kupa, lopta'],
  ['Zapremina kupe', 'Valjak, kupa, lopta'],
  ['Lopta: osnovni elementi', 'Valjak, kupa, lopta'],
  ['Ravni preseci lopte', 'Valjak, kupa, lopta'],
  ['Površina i zapremina lopte', 'Valjak, kupa, lopta'],
  ['Upisana i opisana tela', 'Valjak, kupa, lopta'],
].map(([naziv, tema]) => ({ naziv, tema }));

const zadaci = [];
let lek = 0;

// Z(težina, pitanje, odgovori [prvi tačan], rešenje [koraci], crtež/medij uz pitanje)
const Z = (tezina, pitanje, odgovori, resenje, mediji) => {
  if (new Set(odgovori).size !== 4) throw new Error('Odgovori moraju biti 4 različita: ' + pitanje);
  zadaci.push({ lekcija: lek, tezina, pitanje, odgovori, ...(mediji ? { mediji } : {}), resenje });
};
const L = (naziv) => { lek = lekcije.findIndex((l) => l.naziv === naziv) + 1; if (!lek) throw new Error('Nepoznata lekcija: ' + naziv); };

// ── 8. razred: 3D model tela (interaktivan, okreće se prstom) ──
// oblici: kocka, kvadar, prizma3/4/6, piramida3/4/6, tetraedar, valjak, kupa, lopta
const telo = (oblik, x = {}) => ({ vrsta: 'telo', oblik, ...x });

// manim animacija iz alati/manim/scene.py; delimo folder sa kvizom „Matematika“
const A = (ime, opis) => ({ vrsta: 'slika', src: `../matematika/animacije/${ime}.webp`, ...(opis ? { opis } : {}) });

// ── koordinatna ravan sa pravom y = kx + n i trouglom nagiba ──
function grafik(k, n, x = {}) {
  const od = x.od ?? -4, doo = x.do ?? 4;
  const y0 = k * od + n, y1 = k * doo + n;
  const mx = [Math.min(od, 0) - 0.6, Math.max(doo, 0) + 0.6, Math.min(y0, y1, 0) - 0.6, Math.max(y0, y1, 0) + 0.6];
  const e = [
    { mreza: mx, ose: ['x', 'y'], podela: x.podela },
    prava(k, n, od, doo, { b: 1, id: x.id || 'p', ...(x.prava || {}) }),
  ];
  // presek sa y-osom
  if (x.sece !== false) e.push({ tacka: 'N', b: 3, ...(x.kN ? { k: x.kN } : {}) });
  // trougao nagiba: od preseka sa y-osom udesno 1, nagore k
  if (x.nagib) {
    e.push({ lin: [[0, n], [1, n], [1, n + k]], b: 2, isp: 1, id: 'trn', k: x.kT || 1 });
    if (x.kT) e.push({ tx: '1', at: [0.5, n - 0.4], k: x.kT });
  }
  const t = { O: [0, 0], N: [0, n] };
  return G(t, e, { bezImena: ['O'], velicina: x.velicina || 270 });
}

// dve prave u koordinatnoj ravni (za sisteme) — presek je rešenje
function dvePrave(k1, n1, k2, n2, x = {}) {
  const presek = { x: r((n2 - n1) / (k1 - k2)), y: r(k1 * ((n2 - n1) / (k1 - k2)) + n1) };
  const mx = [Math.min(presek.x, 0) - 1.5, Math.max(presek.x, 0) + 1.5, Math.min(presek.y, 0) - 1.5, Math.max(presek.y, 0) + 1.5];
  const e = [{ mreza: mx, ose: ['x', 'y'], podela: x.podela },
    prava(k1, n1, mx[0], mx[1], { b: 1, id: 'p1' }),
    prava(k2, n2, mx[0], mx[1], { b: 2, id: 'p2' })];
  if (x.presek !== false) e.push({ tacka: 'S', b: 3, k: x.kS ?? 1 });
  return G({ O: [0, 0], S: [presek.x, presek.y] }, e, { bezImena: ['O'], velicina: x.velicina || 270 });
}

module.exports = { lekcije, zadaci, G, K, Z, L, proveri, r, S3, rad, naKrugu, pravilni, ime, stubici, kruzni, kocke, prava, telo, A, grafik, dvePrave };
