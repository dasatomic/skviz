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

// ───────── pojam iz kviza ─────────
// Svako pitanje nudi jednu „ključnu reč“ (pojam iz odgovora, pitanja ili zanimljivosti) koja postoji u
// rečniku. U krugu reči slova se biraju tako da se ta reč može složiti – da se pojam još jednom ponovi.
const CIR = {
  a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', đ: 'ђ', e: 'е', ž: 'ж', z: 'з', i: 'и', j: 'ј', k: 'к', l: 'л', m: 'м',
  n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т', ć: 'ћ', u: 'у', f: 'ф', h: 'х', c: 'ц', č: 'ч', š: 'ш',
};
function uCirilicu(rec, digrafi = true) {
  rec = rec.toLowerCase();
  let out = '';
  for (let i = 0; i < rec.length; i++) {
    const c = rec[i], d = rec[i + 1];
    if (/[а-яђјљњћџ]/.test(c)) { out += c; continue; }
    if (digrafi && c === 'l' && d === 'j') { out += 'љ'; i++; continue; }
    if (digrafi && c === 'n' && d === 'j') { out += 'њ'; i++; continue; }
    if (digrafi && c === 'd' && d === 'ž') { out += 'џ'; i++; continue; }
    if (!CIR[c]) return null;
    out += CIR[c];
  }
  return out;
}

// reč iz teksta → oblik iz rečnika (ili null); pokušava i da „skine“ padežni nastavak (Indije → Индија)
const NASTAVCI = [['ом', ''], ['ем', ''], ['ој', 'а'], ['ама', 'а'], ['има', ''], ['е', 'а'], ['у', 'а'], ['у', ''],
  ['а', ''], ['е', ''], ['и', 'а']];
function uRecniku(token, padezi = true) {
  for (const dig of [true, false]) {
    const r = uCirilicu(token, dig);
    if (!r) continue;
    if (skup.has(r)) return r;
    if (!padezi) continue;
    for (const [n, z] of NASTAVCI) {
      if (!r.endsWith(n) || r.length - n.length < 3) continue;
      const l = r.slice(0, r.length - n.length) + z;
      if (skup.has(l)) return l;
    }
  }
  return null;
}

// suviše opšte reči nisu „pojam“
const OPSTE = new Set(['године', 'година', 'између', 'према', 'после', 'време', 'данас', 'место', 'много', 'након',
  'једна', 'један', 'први', 'друга', 'други', 'трећи', 'већи', 'мањи', 'неки', 'свако', 'свега', 'неколико', 'познат',
  'зове', 'назива', 'такође', 'којем', 'којој', 'која', 'који', 'којих', 'зато', 'стога', 'зашто', 'када', 'него',
  'више', 'мање', 'веома', 'управо', 'отприлике', 'око', 'само', 'чак', 'опет', 'већ', 'увек', 'никад', 'свет', 'света', 'преко', 'рођен', 'следећи',
  'богат', 'посто', 'откривен', 'колики', 'заједно', 'мали', 'мале', 'велики', 'приказан', 'обично', 'понекад', 'највише', 'најмање', 'означен', 'тачан', 'тачно', 'постоји', 'зовемо', 'кажемо', 'нажалост', 'отуда', 'данашња', 'ствар',
  'земља', 'човек', 'људи', 'део', 'дело', 'број', 'страна', 'пута', 'облик', 'начин', 'стварно', 'данашњи']);

function kandidati(tekst, tezina, out, imena = false) {
  if (!tekst) return;
  const tokeni = String(tekst).replace(/\([^)]*\)/g, ' ').split(/[^A-Za-zČĆŽŠĐčćžšđА-Яа-яЂЈЉЊЋЏђјљњћџ]+/).filter(Boolean);
  tokeni.forEach((t, ti) => {
    if (t.length < 4) return;
    let r = uRecniku(t);
    let ocena = tezina;
    const poslednji = ti === tokeni.length - 1;
    if (!r && imena && /^[A-ZČĆŽŠĐ]/.test(t) && tokeni.length <= 3 && !/(u|om|em|ama|ima|oj|og|eg|ih|im|sk[ae]|čk[aei]|ški)$/.test(t)
      && (poslednji || !/ski$/.test(t))) {
      // vlastito ime iz tačnog odgovora (Mileševa, Pupin, Lavoazje…) – nema ga u rečniku, ali je baš pojam;
      // kod imena ljudi prednost ima prezime (poslednja reč)
      r = uCirilicu(t);
      ocena -= poslednji ? 0.3 : 1.5;
    }
    if (!r || OPSTE.has(r) || !pristojna(r)) return;
    const n = [...r].length;
    if (n < 4 || n > 11) return;
    ocena += n >= 5 && n <= 8 ? 2 : n === 11 ? 0.5 : 1;
    const rg = rang.get(r);
    if (skup.has(r)) {
      if (rg === undefined) ocena -= 0.7; // retka reč
      else if (rg < 400) ocena -= 1.5; // suviše obična reč
    }
    if (/(ти|ћи)$/.test(r)) ocena -= 1.5; // glagoli su slabiji „pojmovi“ od imenica
    if (/и$/.test(r) && skup.has(r)) ocena -= 2; // imenice u nominativu jednine retko se završavaju na -и, pridevi da
    if (out.has(r)) ocena = Math.max(ocena, out.get(r).o) + (out.get(r).izvor !== tezina ? 0.6 : 0); // pominje se i na drugom mestu
    out.set(r, { o: ocena, izvor: tezina });
  });
}

// najbolja ključna reč za pitanje (ćirilica) ili null; `rec` u kviz.json ima prednost
function kljucnaRec(p) {
  if (p.rec) return uRecniku(p.rec, false) || uCirilicu(p.rec);
  const k = new Map();
  kandidati(p.odgovori?.[p.tacan ?? 0], 5, k, true);
  kandidati(p.pitanje, 2, k);
  kandidati(p.zanimljivost, 1.5, k);
  kandidati(p.objasnjenje, 1, k);
  let naj = null, max = -1;
  for (const [r, { o }] of k) if (o > max) { max = o; naj = r; }
  return naj;
}

// 12 slova u kojima se krije data reč, plus (ako može) još jedna duža česta reč
function slovaSaRecju(kljuc, broj = 12) {
  const kv = vektor(kljuc);
  const kn = [...kljuc].length;
  let najbolji = [], duz = 0;
  for (const w of reci) {
    if (w.n <= Math.max(kn, duz - 1) || w.n > broj - 1 || !rang.has(w.r) || rang.get(w.r) > 60000 || !pristojna(w.r)) continue;
    let ukupno = 0;
    for (let i = 0; i < 30; i++) ukupno += Math.max(kv[i], w.v[i]);
    if (ukupno > broj) continue;
    if (w.n > duz) { duz = w.n; najbolji = najbolji.filter((x) => x.n >= duz - 1); }
    najbolji.push(w);
  }
  const slova = [...kljuc];
  if (najbolji.length) {
    const izbor = najbolji[Math.floor(Math.random() * najbolji.length)];
    const ima = vektor(kljuc);
    for (const c of izbor.r) { const i = IDX[c]; if (ima[i] > 0) ima[i]--; else slova.push(c); }
  }
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

module.exports = { ucitaj, postoji, najduze, novaSlova, slovaSaRecju, kljucnaRec, uCirilicu, uLatinicu, broj: () => reci.length };
