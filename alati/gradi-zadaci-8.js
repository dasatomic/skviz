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
