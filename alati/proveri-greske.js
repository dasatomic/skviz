#!/usr/bin/env node
// Provera rečenica za bonus igru „Lovac na greške“ (podaci/greske.txt): oznake, pravila, broj grešaka, i da se
// svaka greška vidi i u ćirilici (telefon preslovljava svaku reč posebno – reč ne sme ostati latinicom, a pogrešan i
// tačan oblik moraju se razlikovati i posle preslovljavanja). Izlaz 1 kod grešaka.
'use strict';
const fs = require('fs');
const path = require('path');
const Greske = require('../public/greske.js');
const Pismo = require('../public/pismo.js');

const { pravila, recenice, greske } = Greske.parsiraj(fs.readFileSync(path.join(__dirname, '..', 'podaci', 'greske.txt'), 'utf8'));
const ponovo = new Set();
const poPravilu = {};
for (const r of recenice) {
  if (ponovo.has(r.id)) greske.push(`ponovljena rečenica: ${r.id}`);
  ponovo.add(r.id);
  if (!/^[A-ZČĆŠŽĐ„]/.test(r.id)) greske.push(`ne počinje velikim slovom: ${r.id}`);
  if (!/[.!?…]$/.test(r.id)) greske.push(`nema znaka na kraju: ${r.id}`);
  // telefon preslovljava celu rečenicu odjednom (kontekst: „U“ na početku nije oznaka) pa je deli na reči
  const cir = Pismo.uCirilicu(r.reci.join(' ')).split(' ');
  if (cir.length !== r.reci.length) greske.push(`preslovljavanje menja broj reči: ${r.id}`);
  cir.forEach((c, i) => { if (/[a-zA-ZčćšžđČĆŠŽĐ]/.test(c)) greske.push(`reč ostaje latinicom u ćirilici: „${r.reci[i]}“ → „${c}“ (${r.id})`); });
  for (const x of r.greske) {
    poPravilu[x.pravilo] = (poPravilu[x.pravilo] || 0) + 1;
    if (Pismo.uCirilicu(x.pogresno) === Pismo.uCirilicu(x.tacno)) greske.push(`greška se ne vidi u ćirilici: ${x.pogresno} / ${x.tacno}`);
  }
}
const nekoriscena = Object.keys(pravila).filter((p) => !poPravilu[p]);
const po = [1, 2, 3].map((n) => recenice.filter((r) => r.greske.length === n).length);
console.log(`Lovac na greške: ${recenice.length} rečenica (1 greška: ${po[0]}, 2: ${po[1]}, 3: ${po[2]}), ${Object.keys(pravila).length} pravila`);
console.log('po pravilu: ' + Object.entries(poPravilu).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', '));
if (nekoriscena.length) console.log('  ⚠ pravila bez rečenice: ' + nekoriscena.join(', '));
for (const g of greske) console.log('  ✗ ' + g);
process.exit(greske.length ? 1 : 0);
