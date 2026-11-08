#!/usr/bin/env node
// Provera svih kvizova:  node alati/proveri-kvizove.js   (ili: npm run proveri)
// Proverava format, broj odgovora, duplikate, postojanje slika, poznate vrste medija i pojam za krug reči.
const fs = require('fs');
const path = require('path');
const KOREN = path.join(__dirname, '..', 'kvizovi');
const recnik = require('../lib/recnik');
const VRSTE = ['slika', 'svg', 'melodija', 'morze', 'molekul', 'telo', 'atom', 'planeta', 'dnk', 'mapa', 'sat', 'formula', 'emodzi'];
const MOLEKULI = ['voda', 'ugljen-dioksid', 'metan', 'amonijak', 'kiseonik', 'azot', 'vodonik', 'ozon', 'hlorovodonik', 'vodonik-peroksid', 'etanol', 'benzen', 'sumporna-kiselina', 'so', 'dijamant', 'glukoza'];

let greske = 0, upozorenja = 0, ukupno = 0;
const svaPitanja = new Map();
const g = (k, p) => { greske++; console.log(`  ✗ ${k}: ${p}`); };
const u = (k, p) => { upozorenja++; console.log(`  ⚠ ${k}: ${p}`); };

for (const dir of fs.readdirSync(KOREN).sort()) {
  const f = path.join(KOREN, dir, 'kviz.json');
  if (!fs.existsSync(f)) continue;
  let k;
  try { k = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { g(dir, 'neispravan JSON – ' + e.message); continue; }
  const t = { 1: 0, 2: 0, 3: 0 };
  (k.pitanja || []).forEach((p, i) => {
    const oz = `${dir} #${i + 1}`;
    ukupno++;
    if (!p.pitanje) g(oz, 'nema teksta pitanja');
    if (!Array.isArray(p.odgovori) || p.odgovori.length !== 4) g(oz, 'mora imati tačno 4 odgovora (prvi je tačan)');
    else if (new Set(p.odgovori.map((x) => x.trim().toLowerCase())).size !== 4) g(oz, 'odgovori se ponavljaju');
    if (![1, 2, 3].includes(p.tezina)) u(oz, 'tezina treba da bude 1, 2 ili 3');
    else t[p.tezina]++;
    if (!p.zanimljivost) u(oz, 'nema zanimljivosti');
    if (p.rec !== undefined) {
      // pojam za krug „Najduža reč“: latinica ili ćirilica, 3–11 slova (ćirilična slova; lj/nj/dž su po jedno)
      const c = recnik.uCirilicu(String(p.rec));
      if (!c) g(oz, `pojam „${p.rec}“ sadrži slova kojih nema u srpskoj azbuci`);
      else if ([...c].length < 3 || [...c].length > 11) g(oz, `pojam „${p.rec}“ mora imati 3–11 slova`);
    } else u(oz, 'nema pojma „rec“ za krug reči (biće izabran automatski)');
    const kljuc = (p.pitanje || '').toLowerCase().replace(/\W+/g, ' ').trim() + '|' + (p.odgovori || [])[0];
    if (svaPitanja.has(kljuc)) u(oz, 'isto pitanje postoji i u ' + svaPitanja.get(kljuc));
    svaPitanja.set(kljuc, oz);
    const m = p.mediji;
    if (m) {
      if (!VRSTE.includes(m.vrsta)) g(oz, 'nepoznata vrsta medija: ' + m.vrsta);
      if (m.src && !/^https?:/.test(m.src)) {
        const put = m.src.startsWith('/kvizovi/') ? path.join(KOREN, m.src.slice('/kvizovi/'.length)) : path.join(KOREN, dir, m.src);
        const baza = put.replace(/\.[^.]+$/, '');
        const postoji = fs.existsSync(put) || (fs.existsSync(path.dirname(put)) && fs.readdirSync(path.dirname(put)).some((x) => path.join(path.dirname(put), x).replace(/\.[^.]+$/, '') === baza));
        if (!postoji) g(oz, 'nema fajla ' + m.src);
      }
      if (m.vrsta === 'molekul' && !m.atomi && !MOLEKULI.includes(m.ime)) g(oz, 'nepoznat molekul ' + m.ime);
      if (m.vrsta === 'melodija' && !/^[A-HR#b0-9+/.\s]+$/.test(m.note || '')) g(oz, 'neispravan zapis nota');
    }
  });
  console.log(`✓ ${dir}: ${k.pitanja?.length || 0} pitanja (lako ${t[1]}, srednje ${t[2]}, teško ${t[3]})`);
}
console.log(`\nUkupno ${ukupno} pitanja · ${greske} grešaka · ${upozorenja} upozorenja`);
process.exit(greske ? 1 : 0);
