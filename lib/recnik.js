// Srpski rečnik za igru „Najduža reč“.
// Izvor: Hunspell rečnik srpskog jezika (LibreOffice, podaci/hunspell/sr.dic + sr.aff, ćirilica).
// Prihvata se reč u OSNOVNOM obliku (imenica u nominativu jednine, glagol u infinitivu, pridev u osnovnom obliku),
// uključujući vlastite imenice (Венера, Београд, Пупин) i pojmove iz kvizova kojih nema u Hunspellu (аксолотл).
// Promenjeni oblici (куће, кућама, радим, најлепши) se ne prihvataju, ali ih prepoznajemo preko pravila nastavaka
// iz sr.aff, pa igrač dobija poruku „oblik reči кућа“ umesto „nema u rečniku“.
const fs = require('fs');
const path = require('path');

const AZBUKA = 'абвгдђежзијклљмнњопрстћуфхцчџш';
const IDX = {};
[...AZBUKA].forEach((c, i) => (IDX[c] = i));
const SAMO_AZBUKA = /^[абвгдђежзијклљмнњопрстћуфхцчџш]+$/;

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
const ZABRANJENO = ['јеб', 'пичк', 'курв', 'курац', 'курч', 'говн', 'дркаџ', 'педер', 'сере', 'сран', 'кретен', 'шупак',
  'некрофил', 'педофил', 'зоофил', 'порно', 'секс', 'силова', 'проститу', 'дроља', 'кокаин', 'хероин', 'серав', 'серањ',
  'просер', 'посер', 'насер'];
const pristojna = (r) => !ZABRANJENO.some((z) => r.includes(z));

// ───────── Hunspell ─────────
// osnove: reč (mala slova) -> { z: ',1,1224,' (zastavice nastavaka), obicna: da li postoji i kao obična reč (malim slovom), vlastita }
let osnove = new Map();
let nastavci = new Map(); // dodati nastavak -> [{ skini, z }] (SFX: osnova = oblik - dodatak + skini, ako osnova ima zastavicu z)
let predmeci = []; // PFX: [{ dodatak: 'не'|'нај', z }]
let maxNastavak = 0;
const NEGACIJA = 'не'; // „не“ + osnova je i sama osnovni oblik (неискрен, непознат); „нај“ + osnova je superlativ

let reci = []; // reči koje računar predlaže (najduže moguće) i iz kojih bira slova: { r, v, n, vlastita, pojam }
// (slova se ne biraju po vlastitim imenima ni pojmovima iz kvizova – oni ulaze u slova samo kao skriveni pojam)
let pojmovi = new Set(); // pojmovi iz kvizova (polje `rec`) kojih nema u Hunspellu ili su vlastita imena
let rang = new Map(); // učestalost (manji broj = češća reč), iz podaci/ucestalost.txt
let poznateVlastite = new Set(); // vlastita imena koja računar sme da predloži (česta ili iz kvizova)

function ucitajHunspell(dir) {
  const aff = fs.readFileSync(path.join(dir, 'sr.aff'), 'utf8');
  for (const l of aff.split('\n')) {
    const p = l.trim().split(/\s+/);
    if ((p[0] !== 'SFX' && p[0] !== 'PFX') || p.length < 4 || p[2] === 'Y' || p[2] === 'N') continue;
    const skini = p[2] === '0' ? '' : p[2];
    const dodatak = p[3].split('/')[0] === '0' ? '' : p[3].split('/')[0];
    if (p[0] === 'PFX') { predmeci.push({ dodatak, z: p[1] }); continue; }
    if (!nastavci.has(dodatak)) nastavci.set(dodatak, []);
    nastavci.get(dodatak).push({ skini, z: p[1] });
    maxNastavak = Math.max(maxNastavak, dodatak.length);
  }
  const dic = fs.readFileSync(path.join(dir, 'sr.dic'), 'utf8').split('\n');
  for (let i = 1; i < dic.length; i++) {
    const [w, fl] = dic[i].trim().split('/');
    if (!w) continue;
    const r = w.toLowerCase();
    if (!SAMO_AZBUKA.test(r)) continue; // rimski brojevi, latinica, crtice…
    let e = osnove.get(r);
    if (!e) osnove.set(r, (e = { z: ',', obicna: false, vlastita: false }));
    if (w === r) e.obicna = true; else e.vlastita = true;
    if (fl) e.z += fl + ',';
  }
}

const ima = (e, z) => e.z.includes(',' + z + ',');

// ───────── ijekavica i hrvatske reči ─────────
// Hunspell rečnik ima i ijekavske oblike (вријеме, човјек, лијеп, дјеца…) i dosta hrvatskih reči (тисућа, сустав,
// кисик). Igra je ekavska: ijekavsku reč izbacujemo kad njen ekavski par postoji u rečniku (вријеме → време,
// дијелови → делови, хљеб → хлеб, дио → део), pa ni njeni oblici više ne prolaze.
// Ijekavska vlastita imena (Бијељина, Пријепоље, Ријека) ostaju – to su pravi nazivi.
// predmetak + reč na „је“ je ekavska (предјело, објести, одјек, изједначити), ne ijekavska (одјећа, подсјетити)
const PREDMECI = /^(не)?(пред|над|под|од|об|из|раз|без|уз|кроз)$/;
const JE_RECI = /^ј(ел[ои]|ест|ез[иа]|едн|един|ек$|еж|есен|ецањ)/;
// ijekavsko → ekavsko; `ok(r, i)` = da li se zamena na mestu i odnosi na ijekavicu
const IJEKAVSKA_PRAVILA = [
  { re: /ије/g, za: 'е' }, // вријеме, лијеп
  {
    re: /([бвгдзклмнпрстфхцчшж])је/g, za: '$1е', // мјесто, дјеца; na kraju reči samo „дје“ (гдје, овдје) – борје, вучје su ekavske
    ok: (r, i) => (i + 3 < r.length || r[i] === 'д' || r === 'обје') && !(PREDMECI.test(r.slice(0, i + 1)) && JE_RECI.test(r.slice(i + 1))),
  },
  // хљеб, љепота, посљедица; ali ne glagolske imenice i pridevi od „-лити“ (одељење, запаљење, грљен)
  { re: /ље/g, za: 'ле', ok: (r, i) => !(/[нњ]/.test(r[i + 2]) && i > 0 && osnove.has(r.slice(0, i) + 'лити')) },
  { re: /ио$/, za: 'ео' }, // дио, цио, удио
];
const IJEKAVSKI_ZNAK = /ије|[бвгдзклмнпрстфхцчшж]је|ље|ио$/;
// ekavske reči koje samo liče na ijekavske (премијер ≠ премер, бијен од „бити“)
const NISU_IJEKAVSKE = new Set(['молијер', 'дедијер', 'жилијет', 'галијен', 'бијем', 'бијен', 'пијен', 'опијен', 'овијен', 'свијен',
  'полијен', 'зверје', 'горје', 'тискајући', 'артиљерија', 'артиљеријски', 'артиљерац', 'пиљећи']);
const STRANE_IJE = /^(премијер|карабинијер|гардеробијер|ривијер|мијел|конферансије|крупије)/;
// hrvatske reči (i sve izvedene: тисућа → тисућица, тисућити); srpski ekvivalent je u komentaru
const HRVATSKE = [
  'тисућ', // хиљада
  'сустав', // систем
  'кисик', 'водик', 'душик', 'угљик', 'клорид', // кисеоник, водоник, азот, угљеник, хлорид
  'кемиј', 'кемича', // хемија
  'обитељ', // породица
  'вељач', 'травањ', 'свибањ', 'липањ', 'српањ', 'просинац', 'сијечањ', // месеци („рујан“ је и српски придев)
  'тједан', 'тједн', // недеља
  'свеучилиш', // универзитет
  'разин', // ниво
  'учинков', // ефикасан
  'опћ', // општи
  'тлак', // притисак
  'твар', // материја (али „створ“ остаје)
  'крух', // хлеб
  'жлиц', // кашика
  'тањур', // тањир
  'мрква', 'мркв', // шаргарепа
  'овисн', 'овисит', 'овисиш', // зависан
  'изнимк', 'изнимн', // изузетак
  'тисак', 'тискан', 'тискар', // штампа („тискати“ = гурати је и српски)
  'стољећ', // век
  'вањск', // спољни
  'кухати', 'кухар', 'кухан', // кувати, кувар
  'посљедиц', 'посљедњ', // последица, последњи
  'опсежн', // обиман
  'увјет', // услов
  'знаност', 'знанствен', 'знанственик', // наука, научни
  'повијест', // историја
];
const DOZVOLJENE_HR = new Set(['твар', 'тискати']); // i srpske reči
const hrvatska = (r) => HRVATSKE.some((k) => r.startsWith(k) || r.startsWith('не' + k));

// ekavski parovi ijekavske reči (sve kombinacije zamena)
function ekavski(r) {
  let oblici = [r];
  for (const { re, za, ok } of IJEKAVSKA_PRAVILA) {
    const novi = [];
    for (const w of oblici) {
      novi.push(w);
      const x = w.replace(re, (m, ...a) => {
        const i = a[a.length - 2];
        return !ok || ok(w, i) ? m.replace(new RegExp(re.source), za) : m;
      });
      if (x !== w) novi.push(x);
    }
    oblici = novi;
  }
  return oblici.filter((w) => w !== r);
}

function ijekavska(r, e) {
  if (NISU_IJEKAVSKE.has(r) || STRANE_IJE.test(r) || !IJEKAVSKI_ZNAK.test(r)) return false;
  return ekavski(r).some((v) => {
    const p = osnove.get(v);
    if (p) return e.obicna ? p.obicna : p.vlastita && !e.obicna;
    // ekavski par je samo oblik (дијелови → делови од „део“) – samo za „ије“/„је“ u sredini reči
    // (ne „ље“: биље → биле; ne „-ије“ na kraju: студије, рептилије, одраније)
    return e.obicna && /(ије|[бвгдзклмнпрстфхцчшж]је)./.test(r) && !/ије$/.test(r)
      && osnoveOblika(v).some((o) => osnove.get(o).obicna && !IJEKAVSKI_ZNAK.test(o));
  });
}

let izbacene = []; // za proveru: [reč, razlog]
function izbaciNepozeljne() {
  izbacene = [];
  for (const [r, e] of osnove) {
    if (ijekavska(r, e)) izbacene.push([r, 'ijekavica']);
    else if (e.obicna && hrvatska(r) && !DOZVOLJENE_HR.has(r)) izbacene.push([r, 'hrvatska']);
  }
  for (const [r] of izbacene) osnove.delete(r);
}

// osnove od kojih je reč nastala dodavanjem nastavka (bez same reči): кућама → [кућа], мачке → [мачак, мачка]
function osnoveOblika(rec) {
  const nadjene = new Set();
  const sufiksi = (w, pz) => {
    for (let k = 0; k <= Math.min(maxNastavak, w.length - 1); k++) {
      const pravila = nastavci.get(w.slice(w.length - k));
      if (!pravila) continue;
      const koren = w.slice(0, w.length - k);
      for (const { skini, z } of pravila) {
        const o = koren + skini;
        if (o === w && !pz) continue;
        const e = osnove.get(o);
        if (e && ima(e, z) && (!pz || ima(e, pz))) nadjene.add(o);
      }
    }
  };
  sufiksi(rec, null);
  for (const { dodatak, z } of predmeci) {
    if (!dodatak || !rec.startsWith(dodatak) || rec.length - dodatak.length < 2) continue;
    const ostatak = rec.slice(dodatak.length);
    const e = osnove.get(ostatak);
    // „не“ + osnova je nova osnovna reč, ne oblik; „нај“ + osnova je oblik (superlativ)
    if (e && ima(e, z) && dodatak !== NEGACIJA) nadjene.add(ostatak);
    sufiksi(ostatak, z);
  }
  nadjene.delete(rec);
  return [...nadjene];
}

// „не“ + osnova (неискрен, непознат) – Hunspell ih pravi predmetkom, a to su prave osnovne reči
function negacija(rec) {
  if (!rec.startsWith(NEGACIJA)) return false;
  const ostatak = rec.slice(NEGACIJA.length);
  const e = osnove.get(ostatak);
  if (e && predmeci.some((p) => p.dodatak === NEGACIJA && ima(e, p.z))) return true;
  return izPrideva(ostatak) && osnoveOblika(rec).length > 0; // невероватно, немогуће, несрећан
}

// Hunspell kao osnovu prideva vodi određeni oblik (добри, срећни, топли), a reči koje su i same osnovni oblik
// vodi kao njegove oblike – njih prihvatamo:
//  - kratki (neodređeni) oblik: добар, срећан, кратак, тих, топао, весео (to je oblik iz rečnika)
//  - prilog: брзо, лепо, стварно, лоше (Hunspell ga ima samo kao srednji rod)
// pridev prepoznajemo po tome što ima i oblik na -ог/-ег (добрег/доброг, лошег), pa vokativ (брате, боже) ne prolazi
// zamenice se menjaju kao pridevi, ali „моје“, „које“ nisu prilozi
const ZAMENICE = new Set(['мој', 'твој', 'свој', 'наш', 'ваш', 'његов', 'њен', 'њихов', 'који', 'чији', 'какав', 'такав',
  'овакав', 'онакав', 'никакав', 'некакав', 'икакав', 'сваки', 'неки', 'ниједан', 'један', 'сав']);
// kratki oblik i prilog prideva sa osnovom o (добри → добар, добро; лош → лоше; топао → топло), ako je o pridev
function obliciPrideva(o) {
  if (!osnove.get(o)?.obicna || ZAMENICE.has(o)) return [];
  // корен: добр(и), срећн(и), лош; топао/бео/мио → топл, бел, мил
  const k = o.endsWith('и') ? o.slice(0, -1) : /[аеи]о$/.test(o) ? o.slice(0, o.endsWith('ао') ? -2 : -1) + 'л' : o;
  if (k.length < 2 || !(osnoveOblika(k + 'ог').includes(o) || osnoveOblika(k + 'ег').includes(o))) return [];
  const oblici = [/[шжчћђџјљњц]$/.test(k) ? k + 'е' : k + 'о']; // лоше, вруће / брзо, лепо, топло
  if (o.endsWith('и')) {
    oblici.push(k, k.slice(0, -1) + 'а' + k.slice(-1)); // тих; добар, срећан, кратак
    if (k.endsWith('л')) oblici.push(k.slice(0, -1) + 'о', k.slice(0, -2) + 'ао'); // весео, мио; топао
  }
  return oblici;
}
function izPrideva(rec) {
  const osn = osnoveOblika(rec);
  // glagolski pridev (дошао, дошло, рекао) je oblik glagola, ne osnovna reč
  if (osn.some((o) => /(ти|ћи)$/.test(o) && osnove.get(o).obicna)) return false;
  return osn.some((o) => obliciPrideva(o).includes(rec));
}

// česte osnovne reči koje Hunspell vodi samo kao oblik druge reči (како od „кака“, нешто od „нешта“)
const DODATNE = new Set(['како', 'сада', 'нешто', 'ретко', 'кратак', 'тешко', 'далеко', 'близу', 'дубоко', 'високо', 'широко', 'уско', 'исто']);

const obicniOblik = (rec) => osnoveOblika(rec).some((o) => osnove.get(o).obicna);

// da li se reč prihvata u igri (mala slova, ćirilica)
const postoji = (rec) => pojmovi.has(rec) || uHunspellu(rec);
function uHunspellu(rec) {
  const e = osnove.get(rec);
  if (e?.obicna || DODATNE.has(rec) || izPrideva(rec) || negacija(rec)) return true;
  // vlastito ime, osim kad je to ujedno i oblik ČESTE obične reči (Лепа/лепа, Дана/дана, Света/света) – tada je
  // igrač skoro sigurno mislio na oblik; Мокрањац, Пучини, Росини važe
  return !!e?.vlastita && !osnoveOblika(rec).some((o) => osnove.get(o).obicna && cest(o) < 20000);
}

// osnovni oblik reči koja nije prihvaćena (за поруку „oblik reči …“), ili null
function osnovniOblik(rec) {
  const o = osnoveOblika(rec);
  if (!o.length) return null;
  const ocena = (x) => (osnove.get(x).obicna ? 0 : 1e10) + (rang.get(x) ?? 1e9);
  return o.sort((a, b) => ocena(a) - ocena(b))[0];
}

// pojmovi iz kvizova (polje `rec`) – pojam kojeg nema u Hunspellu (аксолотл, пангеа) važi kao reč; pojam koji je
// oblik obične reči (очи, биљке) važi samo kad je baš on skriven u slovima (lib/soba.js)
let cekajuPojmovi = null;
function postaviPojmove(lista) {
  if (!osnove.size) { cekajuPojmovi = lista; return; }
  const novi = new Set();
  for (const x of lista) {
    const r = uCirilicu(String(x || ''));
    if (!r || r.length < 2 || !SAMO_AZBUKA.test(r) || uHunspellu(r) || (!osnove.get(r)?.vlastita && obicniOblik(r))) continue;
    novi.add(r);
  }
  pojmovi = novi;
  reci = reci.filter((w) => !w.pojam);
  for (const r of novi) reci.push({ ...vektorReci(r), pojam: true, vlastita: true });
  for (const r of lista.map((x) => uCirilicu(String(x || ''))).filter((r) => r && osnove.get(r)?.vlastita)) poznateVlastite.add(r);
  ponoviVlastite();
}

function vektorReci(r) {
  const v = new Uint8Array(30);
  for (const c of r) v[IDX[c]]++;
  return { r, v, n: r.length };
}

// vlastita imena koja računar sme da predloži kao „najduže moguće“: česta (iz titlova) ili pojmovi iz kvizova;
// retka prezimena i sela iz Hunspella se prihvataju od igrača, ali ih računar ne predlaže
function ponoviVlastite() {
  reci = reci.filter((w) => !w.vlastita || w.pojam);
  for (const r of poznateVlastite) {
    const e = osnove.get(r);
    if (e && !e.obicna && !pojmovi.has(r) && postoji(r)) reci.push({ ...vektorReci(r), vlastita: true });
  }
}

function ucitaj() {
  osnove = new Map(); nastavci = new Map(); predmeci = []; reci = []; rang = new Map(); poznateVlastite = new Set();
  ucitajHunspell(path.join(__dirname, '..', 'podaci', 'hunspell'));
  izbaciNepozeljne();
  try {
    fs.readFileSync(path.join(__dirname, '..', 'podaci', 'ucestalost.txt'), 'utf8').split('\n')
      .forEach((r, i) => { r = r.trim(); if (r && osnove.has(r)) rang.set(r, i); });
  } catch {}
  for (const [r, e] of osnove) {
    if (e.obicna) reci.push(vektorReci(r));
    else if (rang.has(r)) poznateVlastite.add(r);
  }
  // osnovni oblici kojih nema kao zasebnih reči u sr.dic (добар, брзо, неискрен) – računar predlaže samo česte
  for (const r of rang.keys()) if (!osnove.has(r) && postoji(r)) reci.push(vektorReci(r));
  ponoviVlastite();
  if (cekajuPojmovi) { postaviPojmove(cekajuPojmovi); cekajuPojmovi = null; }
  return [...osnove.values()].filter((e) => e.obicna || e.vlastita).length;
}
const cest = (r) => rang.get(r) ?? 1e9;

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
  const moze = (w) => w.n >= 8 && w.n <= Math.min(11, broj - 1) && !w.vlastita && pristojna(w.r);
  let kandidati = reci.filter((w) => moze(w) && rang.has(w.r));
  if (kandidati.length < 50) kandidati = reci.filter(moze);
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

// reč iz teksta → osnovni oblik iz rečnika (ili null); promenjen oblik vraća na osnovu (Indije → Индија)
function uRecniku(token, padezi = true) {
  for (const dig of [true, false]) {
    const r = uCirilicu(token, dig);
    if (!r) continue;
    if (postoji(r)) return r;
    if (!padezi) continue;
    const o = osnovniOblik(r);
    if (o && o.length >= 3 && postoji(o)) return o;
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
    // vlastito ime iz rečnika (Pupin, Venera): u tačnom odgovoru je pojam, kod imena ljudi prednost ima prezime;
    // u tekstu pitanja i zanimljivosti imena (ljudi, mesta) nisu „ključna reč“
    if (r && /^[A-ZČĆŽŠĐА-ЯЂЈЉЊЋЏ]/.test(t) && !osnove.get(r)?.obicna) {
      if (!imena || tokeni.length > 3) return;
      ocena -= poslednji ? 0.3 : 1.5;
    }
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
    if (postoji(r)) {
      if (rg === undefined) ocena -= 0.7; // retka reč
      else if (rg < 400) ocena -= 1.5; // suviše obična reč
    }
    if (/(ти|ћи)$/.test(r)) ocena -= 1.5; // glagoli su slabiji „pojmovi“ od imenica
    if (/и$/.test(r) && postoji(r)) ocena -= 2; // imenice u nominativu jednine retko se završavaju na -и, pridevi da
    if (out.has(r)) ocena = Math.max(ocena, out.get(r).o) + (out.get(r).izvor !== tezina ? 0.6 : 0); // pominje se i na drugom mestu
    out.set(r, { o: ocena, izvor: tezina });
  });
}

// najbolja ključna reč za pitanje (ćirilica) ili null; `rec` u kviz.json ima prednost
function kljucnaRec(p) {
  if (p.rec) return uRecniku(p.rec, false) || uCirilicu(p.rec);
  const k = new Map();
  kandidati(p.odgovori?.[p.tacan ?? 0], 5, k, true);
  if (p.parovi) kandidati(p.parovi.flat().join(', '), 3, k);
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
    if (w.n <= Math.max(kn, duz - 1) || w.n > broj - 1 || w.vlastita || !rang.has(w.r) || rang.get(w.r) > 60000 || !pristojna(w.r)) continue;
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

module.exports = { ucitaj, postoji, osnovniOblik, osnoveOblika, postaviPojmove, najduze, novaSlova, slovaSaRecju, kljucnaRec, uCirilicu, uLatinicu, broj: () => reci.length, izbacene: () => izbacene };
