#!/usr/bin/env node
// Provera događaja za bonus igru „Vremeplov“ (podaci/vremeplov.txt).
//   node alati/proveri-vremeplov.js              – oblik redova, oblasti, ponavljanja, preslovljavanje
//   node alati/proveri-vremeplov.js --wikidata   – i godine: za svaki događaj se preko članka na engleskoj Vikipediji
//                                                  nađe stavka u Wikidati (QLever) i uporede godine iz svojstava
//                                                  „trenutak“, „početak“, „nastanak“, „objavljeno“, „rođenje“…
// Godina koja se ne slaže ne mora biti greška (npr. članak o osobi, a događaj je iz njenog života) – ispis treba
// pregledati ručno; izlaz je 1 samo kod grešaka u obliku.
'use strict';
const fs = require('fs');
const path = require('path');
const Vremeplov = require('../public/vremeplov.js');
const Pismo = require('../public/pismo.js');

const tekst = fs.readFileSync(path.join(__dirname, '..', 'podaci', 'vremeplov.txt'), 'utf8');
const { dogadjaji, greske } = Vremeplov.parsiraj(tekst);
const imena = new Map();
for (const d of dogadjaji) {
  if (imena.has(d.t)) greske.push(`ponovljen događaj: ${d.t}`);
  imena.set(d.t, d);
  if (/\b(1\d{3}|20\d\d)\b/.test(d.t)) greske.push(`naziv odaje godinu: ${d.t}`);
  const c = Pismo.uCirilicu(d.t + '. ' + d.opis);
  if (/[a-zčćšžđ]{4,}/i.test(c.replace(/„[^“]*“/g, '').replace(/\b(CERN|Minecraft)\S*/g, ''))) console.log(`  ⚠ latinica ostaje u ćirilici: ${d.t} → ${c}`);
}
const poOblasti = {};
for (const d of dogadjaji) poOblasti[d.oblast] = (poOblasti[d.oblast] || 0) + 1;
console.log(`Vremeplov: ${dogadjaji.length} događaja (${Object.entries(poOblasti).map(([k, v]) => `${k} ${v}`).join(', ')})`);
const doba = {};
for (const d of dogadjaji) { const k = Vremeplov.doba(d.g); doba[k] = (doba[k] || 0) + 1; }
console.log('po dobu: ' + Object.entries(doba).map(([k, v]) => `${k}: ${v}`).join(', '));
for (const g of greske) console.log('  ✗ ' + g);

async function wikidata() {
  const ENDPOINT = 'https://qlever.dev/api/wikidata';
  const SVOJSTVA = { P585: 'trenutak', P580: 'početak', P571: 'nastanak', P577: 'objavljeno', P569: 'rođenje', P1619: 'otvaranje', P619: 'lansiranje', P575: 'otkriće', P570: 'smrt', P582: 'kraj' };
  const sa = dogadjaji.filter((d) => d.wiki);
  const godine = new Map();
  for (let i = 0; i < sa.length; i += 40) {
    const deo = sa.slice(i, i + 40);
    const upit = `PREFIX wdt: <http://www.wikidata.org/prop/direct/> PREFIX schema: <http://schema.org/>
      SELECT ?naslov ?p ?t WHERE {
        VALUES ?naslov { ${deo.map((d) => JSON.stringify(d.wiki) + '@en').join(' ')} }
        ?cl schema:about ?x ; schema:isPartOf <https://en.wikipedia.org/> ; schema:name ?naslov .
        VALUES ?p { ${Object.keys(SVOJSTVA).map((p) => 'wdt:' + p).join(' ')} }
        ?x ?p ?t . }`;
    const r = await fetch(ENDPOINT + '?query=' + encodeURIComponent(upit), { headers: { Accept: 'application/sparql-results+json' } });
    if (!r.ok) throw new Error('Wikidata: HTTP ' + r.status);
    const j = await r.json();
    for (const b of j.results.bindings) {
      const m = /^(-?)0*(\d+)-/.exec(b.t.value);
      if (!m) continue;
      // Wikidata: godina „-0489“ = 490. p. n. e. (astronomsko brojanje, ima godinu 0)
      const g = m[1] ? -(+m[2]) - 1 : +m[2];
      const p = b.p.value.split('/').pop();
      const l = godine.get(b.naslov.value) || [];
      l.push({ g, s: SVOJSTVA[p] });
      godine.set(b.naslov.value, l);
    }
  }
  let slaze = 0, nema = 0;
  for (const d of sa) {
    const l = godine.get(d.wiki);
    if (!l) { nema++; console.log(`  ? ${Vremeplov.godina(d.g)} ${d.t} – u Wikidati nema godine („${d.wiki}“)`); continue; }
    if (l.some((x) => Math.abs(x.g - d.g) <= 1)) { slaze++; continue; }
    console.log(`  ⚠ ${Vremeplov.godina(d.g)} ${d.t} – Wikidata: ${[...new Set(l.map((x) => `${x.s} ${Vremeplov.godina(x.g)}`))].join(', ')}`);
  }
  console.log(`Wikidata: ${slaze} se slaže, ${sa.length - slaze - nema} drugačije (pregledati), ${nema} bez godine`);
}

(process.argv.includes('--wikidata') ? wikidata() : Promise.resolve())
  .catch((e) => console.log('  ✗ ' + e.message))
  .finally(() => process.exit(greske.length ? 1 : 0));
