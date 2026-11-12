// Gradi kvizovi/razred7-matematika-zadaci/kviz.json
// Izvor zadataka za 7. razred (kompaktan zapis + pomoćne funkcije za crteže).
// Posle izmene:  node alati/gradi-zadaci-7.js && npm run proveri
const fs = require('fs');
const path = require('path');
const KOREN = path.join(__dirname, '..');

const A = require('./zadaci-7/osnova');
const { lekcije, zadaci } = A;

// teme redom (svaki fajl dodaje zadatke svojih lekcija)
for (const tema of ['1-realni-brojevi', '2-pitagora', '3-izrazi', '4-mnogougao', '5-krug', '6-podaci']) {
  const f = path.join(__dirname, 'zadaci-7', tema + '.js');
  if (fs.existsSync(f)) require(f)(A);
}
zadaci.sort((a, b) => a.lekcija - b.lekcija);

// ════════════════ upis ════════════════
const kviz = {
  naziv: '7. razred · Matematika – zadaci',
  ikona: '✏️',
  boja: '#0984e3',
  opis: 'Zadaci za rešavanje na papiru, sa detaljnim rešenjem korak po korak',
  redosled: 11,
  oblast: 'matematika-zadaci',
  razred: 7,
  zadaci: true,
  uOpstem: false,
  lekcije,
  pitanja: zadaci,
};
const dir = path.join(KOREN, 'kvizovi', 'razred7-matematika-zadaci');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'kviz.json'), JSON.stringify(kviz, null, 1) + '\n');
const po = {};
for (const z of zadaci) po[z.lekcija] = (po[z.lekcija] || []).concat(z.tezina);
for (const [l, t] of Object.entries(po)) console.log(l, lekcije[l - 1].naziv, t.length, 'težine', t.join(''));
