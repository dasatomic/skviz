// Gradi kvizovi/razred6-matematika-zadaci/kviz.json
// Izvor zadataka za 6. razred: teme u alati/zadaci-6/<n>-<tema>.js, lekcije i pomoćni crteži u
// alati/zadaci-6/osnova.js (dele se sa teorijom 6. razreda).
// Posle izmene:  node alati/gradi-zadaci-6.js && npm run proveri
//   --suvo – samo proveri (bez upisa);  SAMO=<deo imena> – samo neke teme;  IZLAZ=<putanja.json>
const fs = require('fs');
const path = require('path');
const KOREN = path.join(__dirname, '..');

const A = require('./zadaci-6/osnova');
const { lekcije, zadaci } = A;

const dir = path.join(__dirname, 'zadaci-6');
for (const f of fs.readdirSync(dir).filter((f) => /^\d+-.*\.js$/.test(f) && (!process.env.SAMO || f.includes(process.env.SAMO))).sort((a, b) => parseInt(a) - parseInt(b))) {
  require(path.join(dir, f))(A);
}
zadaci.sort((a, b) => a.lekcija - b.lekcija);
const po = {};
for (const z of zadaci) po[z.lekcija] = (po[z.lekcija] || []).concat(z.tezina);
for (const [l, t] of Object.entries(po)) console.log(l, lekcije[l - 1].naziv, t.length, 'težine', t.join(''));
if (process.argv.includes('--suvo')) { console.log(zadaci.length, 'zadataka (bez upisa)'); process.exit(0); }

// ════════════════ upis ════════════════
const kviz = {
  naziv: '6. razred · Matematika – zadaci',
  ikona: '✏️',
  boja: '#0984e3',
  opis: 'Zadaci za rešavanje na papiru, sa detaljnim rešenjem korak po korak',
  redosled: 11,
  oblast: 'matematika-zadaci',
  razred: 6,
  zadaci: true,
  uOpstem: false,
  lekcije,
  pitanja: zadaci,
};
const izlaz = process.env.IZLAZ || path.join(KOREN, 'kvizovi', 'razred6-matematika-zadaci', 'kviz.json');
fs.mkdirSync(path.dirname(izlaz), { recursive: true });
fs.writeFileSync(izlaz, JSON.stringify(kviz, null, 1) + '\n');
console.log(`✓ ${path.relative(process.cwd(), izlaz)}: ${zadaci.length} zadataka`);
