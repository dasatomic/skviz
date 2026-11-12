#!/usr/bin/env node
// Provera svih kvizova:  node alati/proveri-kvizove.js   (ili: npm run proveri)
// Proverava format, broj odgovora, duplikate, postojanje slika, poznate vrste medija i pojam za krug reči.
const fs = require('fs');
const path = require('path');
const KOREN = path.join(__dirname, '..', 'kvizovi');
const recnik = require('../lib/recnik');
const VRSTE = ['slika', 'svg', 'melodija', 'morze', 'molekul', 'telo', 'atom', 'planeta', 'dnk', 'mapa', 'sat', 'formula', 'emodzi', 'geo', 'kod', 'fizika', 'biologija'];
const SCENE = require('../public/fizika.js').SCENE;
const BIO_SCENE = require('../public/biologija.js').SCENE;
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
  const lekcije = k.lekcije || [];
  const poLekciji = lekcije.map(() => ({ 1: 0, 2: 0, 3: 0, n: 0 }));
  if (k.razred && !k.oblast) u(dir, 'kviz ima razred, a nema oblast (npr. "biologija")');
  (k.pitanja || []).forEach((p, i) => {
    const oz = `${dir} #${i + 1}`;
    ukupno++;
    if (lekcije.length) {
      if (!Number.isInteger(p.lekcija) || p.lekcija < 1 || p.lekcija > lekcije.length) g(oz, `lekcija mora biti broj od 1 do ${lekcije.length}`);
      else { poLekciji[p.lekcija - 1].n++; poLekciji[p.lekcija - 1][p.tezina]++; }
    } else if (p.lekcija !== undefined) g(oz, 'pitanje ima lekciju, a kviz nema spisak „lekcije“');
    if (!p.pitanje) g(oz, 'nema teksta pitanja');
    if (p.vrsta !== undefined && !['izbor', 'uljez', 'spoji'].includes(p.vrsta)) g(oz, 'nepoznata vrsta pitanja: ' + p.vrsta);
    if (p.vrsta === 'spoji') {
      // „spoji pojmove“: 3–5 parova [levo, desno], bez ponavljanja ni levo ni desno
      const P = p.parovi;
      if (!Array.isArray(P) || P.length < 3 || P.length > 5 || P.some((x) => !Array.isArray(x) || x.length !== 2 || x.some((y) => typeof y !== 'string' || !y.trim())))
        g(oz, 'spoji: „parovi“ mora imati 3–5 parova oblika ["levo", "desno"]');
      else {
        if (new Set(P.map((x) => x[0].trim().toLowerCase())).size !== P.length) g(oz, 'spoji: pojmovi levo se ponavljaju');
        if (new Set(P.map((x) => x[1].trim().toLowerCase())).size !== P.length) g(oz, 'spoji: pojmovi desno se ponavljaju');
      }
      if (p.odgovori) u(oz, 'spoji: „odgovori“ se ne koriste (samo „parovi“)');
    } else {
      if (!Array.isArray(p.odgovori) || p.odgovori.length !== 4 || p.odgovori.some((x) => typeof x !== 'string' || !x.trim())) g(oz, 'mora imati tačno 4 odgovora (prvi je tačan), svaki kao neprazan tekst');
      else if (new Set(p.odgovori.map((x) => x.trim().toLowerCase())).size !== 4) g(oz, 'odgovori se ponavljaju');
      if (p.vrsta === 'uljez' && !p.objasnjenje) u(oz, 'uljez: dodaj „objasnjenje“ – zašto je baš to uljez');
    }
    if (p.autor !== undefined && (typeof p.autor !== 'string' || !p.autor.trim())) g(oz, '„autor“ mora biti tekst (ime i prezime)');
    if (![1, 2, 3].includes(p.tezina)) u(oz, 'tezina treba da bude 1, 2 ili 3');
    else t[p.tezina]++;
    if (k.zadaci) {
      // matematički zadatak: umesto zanimljivosti ide rešenje korak po korak
      if (!Array.isArray(p.resenje) || !p.resenje.length || p.resenje.some((x) => !x || typeof x.t !== 'string' || !x.t.trim())) g(oz, 'zadatak mora imati „resenje“: [{ "t": "korak" }, …]');
      for (const tekst of [p.pitanje, ...(p.odgovori || []), ...(p.resenje || []).map((x) => x?.t || '')])
        if (((tekst || '').match(/\$/g) || []).length % 2) g(oz, 'neuparen znak $ u: ' + tekst);
      const crtezi = [p.mediji, ...(p.resenje || []).map((x) => x?.crtez)].filter((m) => m && m.vrsta === 'geo');
      for (const m of crtezi) {
        const T = m.t || {};
        const imena = (x) => (Array.isArray(x) ? x : String(x).match(/[A-Z][0-9₀-₉']*|[a-z][0-9]*/g) || []);
        for (const e of m.e || []) {
          for (const kljuc of ['p', 'd', 'u', 'pu', 'tacka']) if (e[kljuc]) for (const n of imena(e[kljuc])) if (!T[n]) g(oz, `crtež: nema tačke ${n} (${kljuc}: ${e[kljuc]})`);
          for (const kljuc of ['kr', 'l', 'kroz']) if (e[kljuc] && !T[e[kljuc]]) g(oz, `crtež: nema tačke ${e[kljuc]}`);
          if (e.k > (p.resenje || []).length) g(oz, `crtež: element se pojavljuje u koraku ${e.k}, a rešenje ima ${(p.resenje || []).length} koraka`);
        }
        const idjevi = new Set((m.e || []).map((e) => e.id).filter(Boolean));
        if (m === p.mediji) for (const x of p.resenje || []) for (const id of x.i || []) if (!idjevi.has(id)) g(oz, `rešenje ističe nepoznat element „${id}“`);
      }
    } else if (!p.zanimljivost) u(oz, 'nema zanimljivosti');
    if (k.zadaci && p.rec === undefined) {} else if (p.rec !== undefined) {
      // pojam za krug „Najduža reč“: latinica ili ćirilica, 3–11 slova (ćirilična slova; lj/nj/dž su po jedno)
      const c = recnik.uCirilicu(String(p.rec));
      if (!c) g(oz, `pojam „${p.rec}“ sadrži slova kojih nema u srpskoj azbuci`);
      else if ([...c].length < 3 || [...c].length > 11) g(oz, `pojam „${p.rec}“ mora imati 3–11 slova`);
    } else u(oz, 'nema pojma „rec“ za krug reči (biće izabran automatski)');
    const kljuc = (p.pitanje || '').toLowerCase().replace(/\W+/g, ' ').trim() + '|' + (p.odgovori || p.parovi || [])[0];
    if (svaPitanja.has(kljuc)) u(oz, 'isto pitanje postoji i u ' + svaPitanja.get(kljuc));
    svaPitanja.set(kljuc, oz);
    for (const [polje, m] of [['mediji', p.mediji], ['medijiOdgovora', p.medijiOdgovora]]) {
      if (m !== undefined && (!m || typeof m !== 'object' || Array.isArray(m))) g(oz, `„${polje}“ mora biti objekat sa poljem „vrsta“`);
      else if (m) {
        if (!VRSTE.includes(m.vrsta)) g(oz, 'nepoznata vrsta medija: ' + m.vrsta);
        // SVG kôd se ubacuje u stranicu: skripte, obrade događaja i ugrađene stranice ne smeju u kviz
        // (igra ih ionako uklanja pri crtanju – public/mediji.js → bezbedanSVG – ali predlog sa njima ne treba prihvatiti)
        if (m.kod !== undefined && (typeof m.kod !== 'string' || /<\s*(script|iframe|object|embed|foreignObject|style|link|meta|a|image|animate|set)\b|\son[a-z]+\s*=|javascript:|data:text/i.test(m.kod)))
          g(oz, 'svg: „kod“ sme da sadrži samo crtež (bez skripti, onload/onclick, stilova, veza i ugrađenih sadržaja)');
        if (m.src !== undefined && typeof m.src !== 'string') g(oz, '„src“ mora biti tekst (putanja do slike)');
        else if (m.src && !/^https?:/.test(m.src)) {
          const put = m.src.startsWith('/kvizovi/') ? path.join(KOREN, m.src.slice('/kvizovi/'.length)) : path.join(KOREN, dir, m.src);
          const baza = put.replace(/\.[^.]+$/, '');
          const postoji = fs.existsSync(put) || (fs.existsSync(path.dirname(put)) && fs.readdirSync(path.dirname(put)).some((x) => path.join(path.dirname(put), x).replace(/\.[^.]+$/, '') === baza));
          if (!postoji) g(oz, 'nema fajla ' + m.src);
        }
        if (m.vrsta === 'fizika' && !SCENE.includes(m.scena)) g(oz, 'nepoznata fizička scena ' + m.scena + ' (postoje: ' + SCENE.join(', ') + ')');
        if (m.vrsta === 'biologija' && !BIO_SCENE.includes(m.scena)) g(oz, 'nepoznata biološka scena ' + m.scena + ' (postoje: ' + BIO_SCENE.join(', ') + ')');
        if (m.vrsta === 'molekul' && !m.atomi && !MOLEKULI.includes(m.ime)) g(oz, 'nepoznat molekul ' + m.ime);
        if (m.vrsta === 'melodija' && !/^[A-HR#b0-9+/.\s]+$/.test(m.note || '')) g(oz, 'neispravan zapis nota');
      }
    }
  });
  lekcije.forEach((l, i) => {
    const x = poLekciji[i];
    const ime = typeof l === 'string' ? l : l.naziv;
    if (k.zadaci) { if (x.n && x.n < 10) u(`${dir} lekcija ${i + 1}`, `„${ime}“ ima samo ${x.n} zadataka (preporuka: bar 10)`); return; }
    if (x.n < 15) u(`${dir} lekcija ${i + 1}`, `„${ime}“ ima samo ${x.n} pitanja (preporuka: bar 15)`);
    else if (!x[1] || !x[3]) u(`${dir} lekcija ${i + 1}`, `„${ime}“ nema i lakih i teških pitanja`);
  });
  console.log(`✓ ${dir}: ${k.pitanja?.length || 0} pitanja (lako ${t[1]}, srednje ${t[2]}, teško ${t[3]})${lekcije.length ? `, ${lekcije.length} lekcija` : ''}`);
}
console.log(`\nUkupno ${ukupno} pitanja · ${greske} grešaka · ${upozorenja} upozorenja`);
process.exit(greske ? 1 : 0);
