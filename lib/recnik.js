// Srpski rečnik za igru „Najduža reč“.
// Izvor: Hunspell rečnik srpskog jezika (LibreOffice, sr.dic) – samo osnovni oblici
// (imenice u nominativu jednine, glagoli u infinitivu, pridevi u osnovnom obliku), ćirilica.
const fs = require('fs');
const path = require('path');

const AZBUKA = 'абвгдђежзијклљмнњопрстћуфхцчџш';
const IDX = {};
[...AZBUKA].forEach((c, i) => (IDX[c] = i));

const LAT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'đ', е: 'e', ж: 'ž', з: 'z', и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj',
  м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r', с: 's', т: 't', ћ: 'ć', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'č',
  џ: 'dž', ш: 'š',
};
const uLatinicu = (rec) => [...rec].map((c) => LAT[c] ?? c).join('');

// učestalost slova u srpskom (približno, u promilima) – za dopunu slova
const UCESTALOST = {
  а: 115, о: 90, е: 85, и: 95, у: 42, н: 60, р: 48, с: 47, т: 45, ј: 50, в: 35, к: 36, д: 36, л: 30, м: 32,
  п: 28, з: 16, г: 17, б: 15, ч: 11, ш: 9, ж: 7, ц: 9, х: 6, ћ: 8, њ: 5, љ: 5, ф: 3, ђ: 2, џ: 1,
};
const SAMOGLASNICI = new Set('аеиоу');

// reči koje ne želimo da računar predlaže deci
const ZABRANJENO = ['јеб', 'пичк', 'курв', 'курац', 'курч', 'говн', 'дркаџ', 'педер', 'сере', 'сран', 'кретен', 'шупак'];
const pristojna = (r) => !ZABRANJENO.some((z) => r.includes(z));

let reci = []; // { r: 'кућа', v: Uint8Array(30), n: 4 }
let skup = new Set();
let rang = new Map(); // učestalost (manji broj = češća reč), iz podaci/ucestalost.txt

function ucitaj() {
  const f = path.join(__dirname, '..', 'podaci', 'recnik.txt');
  const linije = fs.readFileSync(f, 'utf8').split('\n');
  for (const l of linije) {
    const r = l.trim();
    if (r.length < 2) continue;
    const v = new Uint8Array(30);
    let ok = true;
    for (const c of r) {
      const i = IDX[c];
      if (i === undefined) { ok = false; break; }
      v[i]++;
    }
    if (!ok) continue;
    reci.push({ r, v, n: r.length });
    skup.add(r);
  }
  try {
    fs.readFileSync(path.join(__dirname, '..', 'podaci', 'ucestalost.txt'), 'utf8').split('\n')
      .forEach((r, i) => { r = r.trim(); if (r && skup.has(r)) rang.set(r, i); });
  } catch {}
  return reci.length;
}
const cest = (r) => rang.get(r) ?? 1e9;

const postoji = (rec) => skup.has(rec);

function vektor(slova) {
  const v = new Uint8Array(30);
  for (const c of slova) v[IDX[c]]++;
  return v;
}

// najduže reči koje se mogu složiti od datih slova
function najduze(slova, koliko = 5) {
  const dostupno = vektor(slova);
  let max = 0;
  let lista = [];
  for (const w of reci) {
    if (w.n < max || w.n > slova.length) continue;
    let ok = true;
    for (let i = 0; i < 30; i++) if (w.v[i] > dostupno[i]) { ok = false; break; }
    if (!ok || !pristojna(w.r)) continue;
    if (w.n > max) { max = w.n; lista = []; }
    lista.push(w.r);
  }
  lista.sort((a, b) => cest(a) - cest(b));
  return { duzina: max, reci: lista.slice(0, koliko) };
}

function nasumicnoSlovo() {
  const ukupno = Object.values(UCESTALOST).reduce((a, b) => a + b, 0);
  let x = Math.random() * ukupno;
  for (const [c, f] of Object.entries(UCESTALOST)) { x -= f; if (x <= 0) return c; }
  return 'а';
}

// 12 slova: sakrivena „semenska“ reč od 8–11 slova + dopuna po učestalosti
function novaSlova(broj = 12) {
  // seme biramo među poznatim (čestim) rečima, da bi rešenje bilo „ljudsko“
  let kandidati = reci.filter((w) => w.n >= 8 && w.n <= Math.min(11, broj - 1) && pristojna(w.r) && rang.has(w.r));
  if (kandidati.length < 50) kandidati = reci.filter((w) => w.n >= 8 && w.n <= Math.min(11, broj - 1) && pristojna(w.r));
  const seme = kandidati[Math.floor(Math.random() * kandidati.length)].r;
  const slova = [...seme];
  while (slova.length < broj) {
    const samog = slova.filter((c) => SAMOGLASNICI.has(c)).length;
    let c = nasumicnoSlovo();
    if (samog < broj * 0.35 && !SAMOGLASNICI.has(c) && Math.random() < 0.6) c = 'аеиоу'[Math.floor(Math.random() * 5)];
    slova.push(c);
  }
  for (let i = slova.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slova[i], slova[j]] = [slova[j], slova[i]];
  }
  return slova;
}

module.exports = { ucitaj, postoji, najduze, novaSlova, uLatinicu, broj: () => reci.length };
