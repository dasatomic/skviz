// Gradi kvizovi/razred5-matematika-zadaci/kviz.json
// Izvor zadataka za 5. razred (kompaktan zapis + pomoćne funkcije za crteže).
// Posle izmene:  node alati/gradi-zadaci-5.js && npm run proveri
const fs = require('fs');
const path = require('path');
const KOREN = path.join(__dirname, '..');

const A = require('./zadaci-5/osnova');
const { lekcije, zadaci } = A;

// teme redom (svaki fajl dodaje zadatke svojih lekcija)
for (const tema of ['1-deljivost', '2-geometrija', '3-nzd-nzs', '4-razlomci', '5-ugao', '6-racunanje', '7-osna-simetrija', '8-procenti']) {
  const f = path.join(__dirname, 'zadaci-5', tema + '.js');
  if (fs.existsSync(f)) require(f)(A);
}
zadaci.sort((a, b) => a.lekcija - b.lekcija);
if (process.argv.includes('--suvo')) { console.log(zadaci.length, 'zadataka (bez upisa)'); process.exit(0); }

// ════════════════ upis ════════════════
const kviz = {
  naziv: '5. razred · Matematika – zadaci',
  ikona: '✏️',
  boja: '#0984e3',
  opis: 'Zadaci za rešavanje na papiru, sa detaljnim rešenjem korak po korak',
  redosled: 11,
  oblast: 'matematika-zadaci',
  razred: 5,
  zadaci: true,
  uOpstem: false,
  lekcije,
  pitanja: zadaci,
};
const dir = path.join(KOREN, 'kvizovi', 'razred5-matematika-zadaci');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'kviz.json'), JSON.stringify(kviz, null, 1) + '\n');
const po = {};
for (const z of zadaci) po[z.lekcija] = (po[z.lekcija] || []).concat(z.tezina);
for (const [l, t] of Object.entries(po)) console.log(l, lekcije[l - 1].naziv, t.length, 'težine', t.join(''));
