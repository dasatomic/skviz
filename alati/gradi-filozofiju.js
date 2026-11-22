#!/usr/bin/env node
// Gradi kvizovi/eksperimenti-filozofija/kviz.json – „Istorija zapadne filozofije“ po poglavljima
// knjige Bertranda Rasela (A History of Western Philosophy, 1945). Izvor: alati/filozofija/*.txt
//
//   node alati/gradi-filozofiju.js [--suvo]
//
// Format izvora (redosled fajlova = redosled poglavlja):
//   == Naziv dela knjige            → `tema` za sledeća poglavlja (grupa u lobiju)
//   = Naziv poglavlja               → nova lekcija
//   težina|Pitanje?|Tačan|Netačan 1|Netačan 2|Netačan 3|Zanimljivost|pojam
//   @{…json…}                       → medij za sledeće pitanje (`mediji`), @@{…} → `medijiOdgovora`
// Prazni redovi i redovi sa „#“ na početku se preskaču.
const fs = require('fs');
const path = require('path');

const IZVOR = path.join(__dirname, 'filozofija');
const IZLAZ = path.join(__dirname, '..', 'kvizovi', 'eksperimenti-filozofija', 'kviz.json');
const suvo = process.argv.includes('--suvo');

const lekcije = [], pitanja = [], greske = [];
let tema = null, medij = null, medijOdg = null;
const vidjena = new Set();

for (const fajl of fs.readdirSync(IZVOR).filter((f) => f.endsWith('.txt')).sort()) {
  fs.readFileSync(path.join(IZVOR, fajl), 'utf8').split('\n').forEach((red, i) => {
    const gde = `${fajl}:${i + 1}`;
    red = red.trim();
    if (!red || red.startsWith('#')) return;
    if (red.startsWith('==')) { tema = red.slice(2).trim(); return; }
    if (red.startsWith('=')) { lekcije.push({ naziv: red.slice(1).trim(), tema }); return; }
    if (red.startsWith('@@')) { medijOdg = JSON.parse(red.slice(2)); return; }
    if (red.startsWith('@')) { medij = JSON.parse(red.slice(1)); return; }
    if (/[\u0400-\u04FF]/.test(red)) greske.push(`${gde}: ćirilično slovo u latiničnom tekstu`);
    const d = red.split('|').map((x) => x.trim());
    if (d.length !== 8) return greske.push(`${gde}: očekuje se 8 polja, ima ${d.length}`);
    const [tez, pitanje, a, b, c, e, zanimljivost, rec] = d;
    if (![1, 2, 3].includes(+tez)) greske.push(`${gde}: težina mora biti 1–3`);
    if (!lekcije.length) greske.push(`${gde}: pitanje pre prvog poglavlja`);
    const odgovori = [a, b, c, e];
    if (odgovori.some((o) => !o) || new Set(odgovori.map((o) => o.toLowerCase())).size !== 4) greske.push(`${gde}: odgovori prazni ili se ponavljaju`);
    const k = pitanje.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    if (vidjena.has(k)) greske.push(`${gde}: pitanje se ponavlja`);
    vidjena.add(k);
    if (!/^[A-Za-zČĆŽŠĐčćžšđ]+$/.test(rec) || !/^.{3,11}$/.test(rec.replace(/lj|nj|dž/gi, '_'))) greske.push(`${gde}: pojam „${rec}“`);
    const p = { lekcija: lekcije.length, tezina: +tez, pitanje, odgovori, zanimljivost, rec };
    if (medij) p.mediji = medij;
    if (medijOdg) p.medijiOdgovora = medijOdg;
    medij = medijOdg = null;
    pitanja.push(p);
  });
}

lekcije.forEach((l, i) => {
  const n = pitanja.filter((p) => p.lekcija === i + 1).length;
  if (n < 15) greske.push(`poglavlje ${i + 1} „${l.naziv}“ ima samo ${n} pitanja`);
});
const tez = [1, 2, 3].map((t) => pitanja.filter((p) => p.tezina === t).length);
console.log(`${lekcije.length} poglavlja, ${pitanja.length} pitanja (lako ${tez[0]}, srednje ${tez[1]}, teško ${tez[2]})`);
if (greske.length) {
  greske.forEach((g) => console.log('✗ ' + g));
  process.exit(1);
}
if (suvo) process.exit(0);

const kviz = {
  naziv: 'Istorija zapadne filozofije',
  ikona: '🦉',
  boja: '#6c5b7b',
  opis: 'Od Talesa do logičke analize, poglavlje po poglavlje, po knjizi Bertranda Rasela „Istorija zapadne filozofije“ (1945)',
  redosled: 903,
  oblast: 'eksperimenti',
  uOpstem: false,
  celina: 'Cela knjiga',
  lekcije,
  pitanja,
};
fs.mkdirSync(path.dirname(IZLAZ), { recursive: true });
fs.writeFileSync(IZLAZ, JSON.stringify(kviz, null, 2) + '\n');
console.log('→ ' + path.relative(process.cwd(), IZLAZ));
