// Gradi kvizovi/razred7-fizika-zadaci/kviz.json
// Izvor zadataka iz fizike za 7. razred (kompaktan zapis + pomoćne funkcije za crteže i scene) je u alati/fizika-zadaci-7/.
// Posle izmene:  node alati/gradi-zadaci-fizika-7.js && npm run proveri      (--suvo = samo provera, bez upisa)
const fs = require('fs');
const path = require('path');
const KOREN = path.join(__dirname, '..');

const A = require('./fizika-zadaci-7/osnova');
const { lekcije, zadaci } = A;

// teme redom (svaki fajl dodaje zadatke svojih lekcija)
for (const tema of ['1-sila-i-kretanje', '2-sila-teze-i-trenje', '3-ravnoteza', '4-rad-i-energija', '5-toplota']) {
  const f = path.join(__dirname, 'fizika-zadaci-7', tema + '.js');
  if (fs.existsSync(f)) require(f)(A);
}
zadaci.sort((a, b) => a.lekcija - b.lekcija);
if (process.argv.includes('--suvo')) { console.log(zadaci.length, 'zadataka (bez upisa)'); process.exit(0); }

// ════════════════ upis ════════════════
const kviz = {
  naziv: '7. razred · Fizika – zadaci',
  ikona: '🧮',
  boja: '#3a86ff',
  opis: 'Računski zadaci iz fizike za rešavanje na papiru, sa animacijama i detaljnim rešenjem korak po korak',
  redosled: 18.5,
  oblast: 'fizika-zadaci',
  razred: 7,
  zadaci: true,
  uOpstem: false,
  lekcije,
  pitanja: zadaci,
};
const dir = path.join(KOREN, 'kvizovi', 'razred7-fizika-zadaci');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'kviz.json'), JSON.stringify(kviz, null, 1) + '\n');
const po = {};
for (const z of zadaci) po[z.lekcija] = (po[z.lekcija] || []).concat(z.tezina);
for (const [l, t] of Object.entries(po)) console.log(l, lekcije[l - 1].naziv, t.length, 'težine', t.join(''));
const sc = zadaci.filter((z) => z.mediji?.vrsta === 'fizika' || z.resenje.some((k) => k.crtez?.vrsta === 'fizika')).length;
console.log(zadaci.length, 'zadataka;', sc, 'sa animiranom scenom;', zadaci.filter((z) => z.mediji || z.resenjeCrtez).length, 'sa crtežom');
