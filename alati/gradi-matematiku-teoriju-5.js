// Gradi kvizovi/razred5-matematika/kviz.json – teorija i pojmovi 5. razreda,
// bez zadataka koji traže olovku i papir (ti su u razred5-matematika-zadaci).
//
//   node alati/gradi-matematiku-teoriju-5.js          – izgradi i upiši
//   node alati/gradi-matematiku-teoriju-5.js --suvo   – samo proveri i ispiši statistiku
//
// Pitanja su u alati/matematika-teorija-5/<n>-<tema>.js; lekcije i crteži (medij „geo“)
// se dele sa zadacima 5. razreda (alati/zadaci-5/osnova.js), pa su redni brojevi lekcija isti.
const fs = require('fs');
const path = require('path');

const A = require('./zadaci-5/osnova');
const { lekcije } = A;

const pitanja = [];
let lek = 0;

const L = (naziv) => { lek = lekcije.findIndex((l) => l.naziv === naziv) + 1; if (!lek) throw new Error('Nepoznata lekcija: ' + naziv); };
const proveri = (uslov, opis) => { if (!uslov) throw new Error('Netačan račun: ' + opis); };

function dodaj(p) {
  if (!lek) throw new Error('Pitanje pre nego što je izabrana lekcija (L): ' + p.pitanje);
  if (p.vrsta === 'spoji') {
    if (new Set(p.parovi.map((x) => x[0].trim().toLowerCase())).size !== p.parovi.length) throw new Error('spoji: ponovljeni levi pojmovi: ' + p.pitanje);
    if (new Set(p.parovi.map((x) => x[1].trim().toLowerCase())).size !== p.parovi.length) throw new Error('spoji: ponovljeni desni pojmovi: ' + p.pitanje);
  } else if (new Set(p.odgovori).size !== 4) throw new Error('Odgovori moraju biti 4 različita: ' + p.pitanje);
  pitanja.push({ lekcija: lek, ...p });
}

// Q(težina, pitanje, odgovori [prvi tačan], zanimljivost, pojam, { mediji, medijiOdgovora, vreme })
function Q(tezina, pitanje, odgovori, zanimljivost, rec, x = {}) {
  dodaj({
    tezina, pitanje, ...(x.mediji ? { mediji: x.mediji } : {}), odgovori, zanimljivost,
    ...(x.medijiOdgovora ? { medijiOdgovora: x.medijiOdgovora } : {}),
    ...(x.vreme ? { vreme: x.vreme } : {}),
    rec,
  });
}
// U(težina, pitanje, odgovori [prvi je uljez], objašnjenje, zanimljivost, pojam, { … })
function U(tezina, pitanje, odgovori, objasnjenje, zanimljivost, rec, x = {}) {
  dodaj({ vrsta: 'uljez', tezina, pitanje, ...(x.mediji ? { mediji: x.mediji } : {}), odgovori, objasnjenje, zanimljivost, rec });
}
// S(težina, pitanje, parovi [[levo, desno], …], zanimljivost, pojam, { … })
function S(tezina, pitanje, parovi, zanimljivost, rec, x = {}) {
  dodaj({ vrsta: 'spoji', tezina, pitanje, ...(x.mediji ? { mediji: x.mediji } : {}), parovi, zanimljivost, rec });
}

// Medij „formula“ klijent prikazuje kao običan tekst (.formula) – ne prolazi kroz matematički
// renderer kao tekst pitanja. Zato se LaTeX iz $…$ ovde pretvara u Unicode znakove (bez $).
function srediFormulu(t) {
  let s = String(t).replace(/\$/g, '');
  // razlomak \frac{X}{Y} → X/Y (složeni brojilac/imenilac u zagradama)
  s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, a, b) => {
    const slozen = (x) => /[+\-:·\\\s]/.test(x);
    return (slozen(a) ? `(${a})` : a) + '/' + (slozen(b) ? `(${b})` : b);
  });
  s = s.replace(/\\cdot/g, ' · ');
  s = s.replace(/\\in/g, '∈').replace(/\\varnothing/g, '∅');
  s = s.replace(/\\mathbb\{N\}/g, 'ℕ');
  s = s.replace(/\\cup/g, '∪').replace(/\\cap/g, '∩').replace(/\\setminus/g, '∖');
  s = s.replace(/\\parallel/g, '∥').replace(/\\perp/g, '⊥');
  s = s.replace(/\\angle/g, '∠').replace(/\\Rightarrow/g, '⇒').replace(/\\dots/g, '…');
  s = s.replace(/\\vec\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\\{/g, '{').replace(/\\\}/g, '}').replace(/\\%/g, '%');
  s = s.replace(/\\!/g, '');
  s = s.replace(/_\{?0\}?/g, '₀');
  s = s.replace(/\s*([+=])\s*/g, ' $1 ').replace(/\s*-\s*/g, ' − ');
  return s.replace(/\s+/g, ' ').trim();
}

const O = {
  ...A,
  pitanja, L, Q, U, S, proveri,
};

for (const f of fs.readdirSync(path.join(__dirname, 'matematika-teorija-5')).filter((f) => /^\d+-.*\.js$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b))) {
  require(path.join(__dirname, 'matematika-teorija-5', f))(O);
}
pitanja.sort((a, b) => a.lekcija - b.lekcija || a.tezina - b.tezina);
for (const p of pitanja) if (p.mediji?.vrsta === 'formula') p.mediji.tekst = srediFormulu(p.mediji.tekst);

if (process.argv.includes('--suvo')) {
  const po = {};
  for (const p of pitanja) po[p.lekcija] = (po[p.lekcija] || 0) + 1;
  console.log('Pitanja:', pitanja.length, '· lekcija:', Object.keys(po).length);
  console.log('Po lekciji:', Object.entries(po).map(([l, n]) => `${l}:${n}`).join(' '));
  process.exit(0);
}

const kviz = {
  naziv: '5. razred · Matematika',
  ikona: '📐',
  boja: '#0984e3',
  opis: 'Teorija i pojmovi iz udžbenika Matematika 5: brojevi, deljivost, skupovi, geometrija, razlomci, uglovi, osna simetrija, procenti – sve kroz slike i igru, bez papira',
  redosled: 10,
  oblast: 'matematika',
  razred: 5,
  uOpstem: false,
  lekcije,
  pitanja,
};
const dir = path.join(__dirname, '..', 'kvizovi', 'razred5-matematika');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'kviz.json'), JSON.stringify(kviz, null, 1) + '\n');
console.log(`✓ kvizovi/razred5-matematika/kviz.json: ${pitanja.length} pitanja u ${lekcije.length} lekcija`);
