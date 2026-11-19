#!/usr/bin/env node
// Formule napisane kao običan tekst („F = m · a“, „s = v · t = 30 km“, „√144“) stavlja između $…$ u ručno
// pisanim kvizovima matematike i fizike (generisani kvizovi to dobijaju pri gradnji – alati/mat-zapis.js).
//
//   node alati/sredi-mat-zapis.js            – upiši izmene u kvizovi/<matematika|fizika…>/kviz.json
//   node alati/sredi-mat-zapis.js --suvo     – samo ispiši šta bi se promenilo
//   node alati/sredi-mat-zapis.js fizika     – samo navedeni paketi
const fs = require('fs');
const path = require('path');
const { umotajPitanje } = require('./mat-zapis');

const KVIZOVI = path.join(__dirname, '..', 'kvizovi');
const suvo = process.argv.includes('--suvo');
const izbor = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const paketi = izbor.length ? izbor : fs.readdirSync(KVIZOVI).filter((d) => /matematika|fizika/.test(d) && fs.existsSync(path.join(KVIZOVI, d, 'kviz.json')));
const tekst = (p) => JSON.stringify([p.pitanje, p.odgovori, p.parovi, p.zanimljivost, p.objasnjenje, (p.resenje || []).map((k) => k.t)]);

for (const d of paketi) {
  const f = path.join(KVIZOVI, d, 'kviz.json');
  const izvor = fs.readFileSync(f, 'utf8');
  const kviz = JSON.parse(izvor);
  let n = 0;
  for (const p of kviz.pitanja || []) {
    const pre = tekst(p);
    umotajPitanje(p);
    if (tekst(p) !== pre) {
      n++;
      if (suvo) JSON.parse(pre).flat(2).forEach((x, i) => { const y = JSON.parse(tekst(p)).flat(2)[i]; if (x !== y) console.log(`  ${d}: ${y}`); });
    }
  }
  if (n && !suvo) {
    // isto uvlačenje kao u izvoru (1 ili 2 razmaka)
    const uvlaka = (/\n( +)"/.exec(izvor) || [, ' '])[1].length;
    fs.writeFileSync(f, JSON.stringify(kviz, null, uvlaka) + '\n');
  }
  console.log(`${n ? '✓' : '·'} ${d}: ${n} pitanja ${suvo ? 'bi bilo izmenjeno' : 'izmenjeno'}`);
}
