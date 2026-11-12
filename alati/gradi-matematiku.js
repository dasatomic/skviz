#!/usr/bin/env node
// Dopisuje pitanja iz alati/matematika/<n>-<tema>.js u kvizovi/matematika/kviz.json.
//
//   node alati/gradi-matematiku.js          – izgradi i upiši
//   node alati/gradi-matematiku.js --suvo   – samo proveri i ispiši statistiku
//
// Pitanja koja je alat ranije upisao (spisak u alati/matematika/izgradjeno.json) zamenjuju se novom verzijom,
// a ostala pitanja kviza (ručno pisana, iz urednika) ostaju netaknuta. Pitanje izmenjeno u uredniku se,
// ako mu se promeni tekst, više ne prepoznaje kao izgrađeno – zato ga posle toga menjaj samo na jednom mestu.
// Animacije (WebP) se prave posebno: alati/manim/renderuj.sh
const fs = require('fs');
const path = require('path');

const KVIZ = path.join(__dirname, '..', 'kvizovi', 'matematika', 'kviz.json');
const DIR = path.join(__dirname, 'matematika');
const SPISAK = path.join(DIR, 'izgradjeno.json');
const suvo = process.argv.includes('--suvo');

const O = require('./matematika/osnova.js');
for (const f of fs.readdirSync(DIR).filter((f) => /^\d+-.*\.js$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b))) require(path.join(DIR, f))(O);

const kljuc = (p) => (p.pitanje || '').trim() + '|' + (p.odgovori || p.parovi.map((x) => x.join('='))).join('|');
const nova = O.pitanja.map(({ tema, ...p }) => p);

// statistika
const po = (f) => O.pitanja.reduce((m, p) => ((m[f(p)] = (m[f(p)] || 0) + 1), m), {});
console.log('Pitanja:', nova.length);
console.log('Po temi:', po((p) => p.tema));
console.log('Težina:', po((p) => p.tezina));
console.log('Vrsta:', po((p) => p.vrsta || 'izbor'));
console.log('Sa medijem uz pitanje:', nova.filter((p) => p.mediji).length, '· uz odgovor:', nova.filter((p) => p.medijiOdgovora).length,
  '· bez ikakvog medija:', nova.filter((p) => !p.mediji && !p.medijiOdgovora).length);
const dupl = nova.map(kljuc).filter((k, i, a) => a.indexOf(k) !== i);
if (dupl.length) { console.log('✗ Ponovljena pitanja:', dupl); process.exit(1); }
// slike/animacije moraju postojati
const fali = nova.flatMap((p) => [p.mediji, p.medijiOdgovora]).filter((m) => m && m.src && !fs.existsSync(path.join(path.dirname(KVIZ), m.src)));
if (fali.length) console.log('⚠ Nema fajlova (pokreni alati/manim/renderuj.sh):', [...new Set(fali.map((m) => m.src))].join(', '));
if (suvo) process.exit(0);

const kviz = JSON.parse(fs.readFileSync(KVIZ, 'utf8'));
const ranije = new Set(fs.existsSync(SPISAK) ? JSON.parse(fs.readFileSync(SPISAK, 'utf8')) : []);
const sada = new Set(nova.map(kljuc));
const rucna = kviz.pitanja.filter((p) => !ranije.has(kljuc(p)));
const sudar = rucna.filter((p) => sada.has(kljuc(p)));
if (sudar.length) { console.log('✗ Ova pitanja već postoje u kvizu (napisana ručno):', sudar.map((p) => p.pitanje)); process.exit(1); }
kviz.pitanja = [...rucna, ...nova];
fs.writeFileSync(KVIZ, JSON.stringify(kviz, null, 2) + '\n');
fs.writeFileSync(SPISAK, JSON.stringify([...sada], null, 0).replace(/","/g, '",\n"') + '\n');
console.log(`✓ ${KVIZ}: ${rucna.length} ostalih + ${nova.length} izgrađenih = ${kviz.pitanja.length}`);
