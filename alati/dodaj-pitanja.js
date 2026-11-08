#!/usr/bin/env node
// Dodaje pitanja u kviz iz kompaktnog tekstualnog formata (lakše za pisanje velikog broja pitanja).
//
//   node alati/dodaj-pitanja.js <folder-kviza> <fajl.txt>
//
// Format fajla – jedno pitanje po redu, polja odvojena sa „|“:
//   težina|Pitanje?|Tačan odgovor|Netačan 1|Netačan 2|Netačan 3|Zanimljivost
// Red koji počinje sa „@“ je JSON medija za SLEDEĆE pitanje, npr:
//   @{"vrsta":"molekul","ime":"voda"}
// Prazni redovi i redovi koji počinju sa „#“ se preskaču.
// Pitanja koja već postoje (isti tekst pitanja) se ne dodaju ponovo.
const fs = require('fs');
const path = require('path');

const [folder, ulaz] = process.argv.slice(2);
if (!folder || !ulaz) {
  console.log('Upotreba: node alati/dodaj-pitanja.js <folder-kviza> <fajl.txt>');
  process.exit(1);
}
const f = path.join(folder, 'kviz.json');
const kviz = JSON.parse(fs.readFileSync(f, 'utf8'));
const kljuc = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const postojeca = new Set(kviz.pitanja.map((p) => kljuc(p.pitanje)));

let medij = null, dodato = 0, preskoceno = 0, greske = 0;
fs.readFileSync(ulaz, 'utf8').split('\n').forEach((red, i) => {
  red = red.trim();
  if (!red || red.startsWith('#')) return;
  if (red.startsWith('@')) {
    try { medij = JSON.parse(red.slice(1)); } catch (e) { greske++; console.log(`✗ red ${i + 1}: neispravan JSON medija`); }
    return;
  }
  const d = red.split('|').map((x) => x.trim());
  if (d.length !== 7 || ![1, 2, 3].includes(+d[0])) {
    greske++;
    console.log(`✗ red ${i + 1}: očekuje se 7 polja (ima ${d.length}): ${red.slice(0, 80)}`);
    medij = null;
    return;
  }
  const [tez, pitanje, ...ostalo] = d;
  const odgovori = ostalo.slice(0, 4);
  const zanimljivost = ostalo[4];
  if (new Set(odgovori.map((x) => x.toLowerCase())).size !== 4) {
    greske++;
    console.log(`✗ red ${i + 1}: odgovori se ponavljaju`);
    medij = null;
    return;
  }
  if (postojeca.has(kljuc(pitanje)) && !medij) { preskoceno++; return; }
  const p = { tezina: +tez, pitanje, odgovori, zanimljivost };
  if (medij) p.mediji = medij;
  medij = null;
  kviz.pitanja.push(p);
  postojeca.add(kljuc(pitanje));
  dodato++;
});
fs.writeFileSync(f, JSON.stringify(kviz, null, 2) + '\n');
console.log(`${path.basename(folder)}: +${dodato} (preskočeno duplikata: ${preskoceno}, grešaka: ${greske}) → ukupno ${kviz.pitanja.length}`);
process.exit(greske ? 2 : 0);
