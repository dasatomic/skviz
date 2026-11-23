// Ispisuje sve reči iz rečnika koje obuhvata spisak podaci/nevalidne-reci.txt (provera da nema promašaja).
const fs = require('fs');
const path = require('path');
const recnik = require('../lib/recnik.js');
recnik.ucitaj();
const sve = new Set();
for (const l of fs.readFileSync(path.join(__dirname, '..', 'podaci', 'hunspell', 'sr.dic'), 'utf8').split('\n')) {
  const r = l.split('/')[0].toLowerCase();
  if (r) sve.add(r);
}
const blokirane = [...sve].filter((r) => recnik.jeNevalidna(r)).sort();
console.log(blokirane.length + ' reči:\n' + blokirane.join(' '));
