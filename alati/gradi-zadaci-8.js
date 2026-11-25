// Gradi kvizovi/razred8-matematika-zadaci/kviz.json
// Izvor zadataka za 8. razred (kompaktan zapis + pomoćne funkcije za crteže).
// Posle izmene:  node alati/gradi-zadaci-8.js && npm run proveri
const fs = require('fs');
const path = require('path');
const KOREN = path.join(__dirname, '..');

const A = require('./zadaci-8/osnova');
const { lekcije, zadaci } = A;

// teme redom (svaki fajl dodaje zadatke svojih lekcija)
for (const tema of ['1-slicnost', '2-tacka-prava-ravan', '3-linearne-jednacine', '4-prizma',
  '5-piramida', '6-linearne-funkcije', '7-sistemi', '8-valjak-kupa-lopta']) {
  const f = path.join(__dirname, 'zadaci-8', tema + '.js');
  if (fs.existsSync(f)) require(f)(A);
}
zadaci.sort((a, b) => a.lekcija - b.lekcija);

// ════════════════ skica tela uz zadatak ════════════════
// Zadaci o telima (i o pravama i ravnima na kvadru) bez sopstvenog crteža dobijaju skicu tela
// sa oznakama temena, bez brojeva – da se zamisli telo, a da crtež ne oda rezultat.
// Ne dobijaju je: zadaci sa crtežom u rešenju, zadaci sa dva tela (upisana/opisana) i pitanja
// tipa „koliko ivica/temena/strana“, kojima bi crtež bio odgovor.
const P = require('./zadaci-8/prostor');
const skice = [
  [/\bkock/i, [9, 71], () => P.kocka(3)],
  [/\bkvad(ar|ra|ru|rom)\b/i, [8, 71], () => P.kvadar(4, 3, 2.5)],
  [/tetraed/i, [38, 43], () => P.piramida(3, 4, 3.3)],
  [/trostran\S* prizm/i, [30, 37], () => P.prizma(3, 3, 4)],
  [/četvorostran\S* prizm/i, [30, 37], () => P.prizma(4, 3, 4.5)],
  [/šestostran\S* prizm/i, [30, 37], () => P.prizma(6, 2, 4)],
  [/trostran\S* piramid/i, [38, 43], () => P.piramida(3, 4, 3.5)],
  [/četvorostran\S* piramid/i, [38, 43], () => P.piramida(4, 4, 3.5)],
  [/šestostran\S* piramid/i, [38, 43], () => P.piramida(6, 2.4, 3.5)],
  [/\bvalj(ak|ka|ku|kom)\b/i, [60, 71], () => P.valjak(2, 3.5)],
  [/\bkup(a|e|u|om)\b/i, [64, 71], () => P.kupa(2, 3.5)],
  [/\blopt(a|e|i|u|om)\b/i, [68, 71], () => P.lopta(2.5)],
];
const BROJANJE = /Koliko (ivica|temena|strana|bočnih|dijagonala|mnogouglova|pravougaonika|trouglova|osnova)/i;
let skicirano = 0;
for (const z of zadaci) {
  if (z.mediji || z.resenje.some((k) => k.crtez) || BROJANJE.test(z.pitanje)) continue;
  // temena imenovana sa E–H (kocka ABCDEFGH) ne odgovaraju skici sa A₁B₁C₁D₁
  const tekst = z.pitanje + ' ' + z.resenje.map((k) => k.t).join(' ');
  if (/\b(?=[A-H]*[EFGH])[A-H]{2,}\b/.test(tekst.replace(/\$[^$]*\$/g, (m) => m.replace(/[₁_{}]/g, '')).replace(/[^A-Za-z\s]/g, ' ').replace(/\b[a-zšđčćž]\w*/g, ' '))) continue;
  const tela = skice.filter(([re, [od, doo]]) => z.lekcija >= od && z.lekcija <= doo && re.test(z.pitanje));
  // kocka je i kvadar, a pravilna prizma/piramida se poklapa samo sa jednim izrazom
  const jedno = tela.length === 1 || (tela.length === 2 && tela[0][0].source.includes('kock') && tela[1][0].source.includes('kvad'));
  if (!tela.length || !jedno) continue;
  z.mediji = tela[0][2]();
  skicirano++;
}
console.log('skica tela u', skicirano, 'zadataka');

// ════════════════ upis ════════════════
const kviz = {
  naziv: '8. razred · Matematika – zadaci',
  ikona: '✏️',
  boja: '#6c5ce7',
  opis: 'Zadaci za rešavanje na papiru, sa detaljnim rešenjem korak po korak',
  redosled: 12,
  oblast: 'matematika-zadaci',
  razred: 8,
  zadaci: true,
  uOpstem: false,
  lekcije,
  pitanja: zadaci,
};
const dir = path.join(KOREN, 'kvizovi', 'razred8-matematika-zadaci');
fs.mkdirSync(dir, { recursive: true });
// formule napisane kao običan tekst idu u $…$ (alati/mat-zapis.js)
for (const p of kviz.pitanja) require('./mat-zapis').umotajPitanje(p);
fs.writeFileSync(path.join(dir, 'kviz.json'), JSON.stringify(kviz, null, 1) + '\n');
const po = {};
for (const z of zadaci) po[z.lekcija] = (po[z.lekcija] || []).concat(z.tezina);
for (const [l, t] of Object.entries(po)) console.log(l, lekcije[l - 1].naziv, t.length, 'težine', t.join(''));
