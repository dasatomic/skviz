// Matematički zapis u tekstu pitanja: formule napisane kao običan tekst („F = m · a“, „s = v · t = 30 km“,
// „24 : 3 = 8“, „√144“) stavljamo između $…$, da ih klijent prikaže kao matematiku (kurziv promenljivih,
// koren, razlomci) i da se ne preslove u ćirilicu. Tekst koji je već u $…$ se ne dira.
//
//   const { umotaj, umotajPitanje } = require('./mat-zapis');
//   umotaj('Iz F = m · a sledi a = 2 m/s².')  →  'Iz $F = m · a$ sledi $a = 2 m/s²$.'
//   umotajPitanje(p)  – sva tekstualna polja pitanja/zadatka (pitanje, odgovori, parovi, zanimljivost,
//                       objasnjenje, koraci rešenja); odgovor koji je ceo izraz („a + b“, „2x − 1“) ide ceo u $…$
//
// Prepoznaje se samo ono što je sigurno matematika: niz operanada (brojevi, promenljive od 1–2 slova,
// brojevi sa jedinicom, zagrade, √) između kojih su operacije, sa bar jednim znakom odnosa (=, ≈, <, >, ≤, ≥, ≠).
// Kratke srpske reči (je, pa, na, i, a, u…) ne mogu biti promenljive osim tik uz znak operacije.

const JEDINICE = 'km²|dm²|cm²|mm²|m²|km³|dm³|cm³|mm³|m³|s²|kg|km|dm|cm|mm|kWh|kJ|kW|kPa|kN|MJ|MW|mA|kΩ|Hz|Pa|ml|dl|min|din|°C|Wh|m|g|t|s|h|N|J|W|V|A|Ω|K|l|°|%';
// jedinica, i složena: „km/h“, „m/s²“, „kg/m³“, „N/kg“
const RE_JED = new RegExp(`^(?:${JEDINICE})(?:/(?:${JEDINICE}))?(?![\\p{L}\\d])`, 'u');
// srpske reči od 1–2 slova koje ne smeju biti promenljiva ako nisu tik uz operaciju
const RECI = new Set(['je', 'pa', 'na', 'za', 'od', 'do', 'se', 'to', 'li', 'ne', 'da', 'ni', 'mi', 'ti', 'on', 'ga', 'mu', 'im', 'iz', 'uz', 'sa', 'po', 'ko', 'su', 'bi', 'ja', 'me', 'te', 'ih', 'ga', 'Je', 'Pa', 'Na', 'Za', 'Od', 'Do', 'Ne', 'Da', 'Iz', 'Sa', 'Po', 'Ko']);
const ODNOS = /^(=|≈|<|>|≤|≥|≠)$/;

// tokeni jednog dela teksta (van $…$)
function tokeni(s) {
  const T = [];
  let i = 0;
  const probaj = (tip, re) => {
    const m = re.exec(s.slice(i));
    if (!m) return false;
    T.push({ tip, t: m[0], od: i, do: i + m[0].length });
    i += m[0].length;
    return true;
  };
  while (i < s.length) {
    if (probaj('ws', /^\s+/)) continue;
    // ugao u stepenima i minutima („47°15′“, „110°05′30″“) je jedan operand
    if (probaj('broj', /^\d+°\d+′(?:\d+″)?(?![\p{L}\d])/u)) continue;
    // broj (decimalni zarez/tačka samo ispred cifre), opciono stepen, „2x“, „3ab“ (broj pa promenljiva bez razmaka)
    if (probaj('broj', /^\d+(?:[.,]\d+)*(?:[²³])?(?:[a-zA-Z]{1,3}(?:[₀-₉²³′]*)(?![\p{L}\d]))?(?![\p{L}\d])/u)) {
      // jedinica tik iza broja („15 km/h“, „100 N“) pripada operandu
      const m = /^(\s?)(\S+)/.exec(s.slice(i));
      if (m) {
        const j = RE_JED.exec(m[2]);
        if (j) { const t = T[T.length - 1]; const d = m[1].length + j[0].length; t.t += s.slice(i, i + d); t.do += d; i += d; }
      }
      continue;
    }
    if (probaj('koren', /^√/)) continue;
    if (probaj('otv', /^\(/)) continue;
    if (probaj('zat', /^\)/)) continue;
    // dvotačka je deljenje samo sa razmakom ispred („24 : 3“), ne „sa 3,6: …“
    if (/^:/.test(s.slice(i)) && !/\s$/.test(s.slice(0, i))) { probaj('tekst', /^:/); continue; }
    if (probaj('op', /^(=|≈|<|>|≤|≥|≠|\+|−|·|×|:|\/|±)/)) continue;
    if (/^-\s/.test(s.slice(i)) && T.length && T[T.length - 1].tip === 'ws') { probaj('op', /^-/); continue; }
    // promenljiva: 1–2 slova (latinica, grčka, Δ), indeks, prim, stepen; cela reč
    if (probaj('prom', /^(?:Δ)?[A-Za-zα-ωΩΦΣ](?:[a-z])?[₀-₉0-9]*[′']?[²³]?(?![\p{L}\d])/u)) continue;
    // sve ostalo (reč, znak interpunkcije…) prekida formulu
    probaj('tekst', /^[\p{L}\d]+|^./su);
  }
  return T;
}

// operand: [√]* (broj | prom | ( … )) ; vraća indeks posle operanda ili -1
function operand(T, k) {
  while (k < T.length && T[k].tip === 'ws') k++;
  // predznak („x = −3“) i koren ispred operanda
  if (k < T.length && T[k].tip === 'op' && /^[−+±-]$/.test(T[k].t)) k++;
  while (k < T.length && T[k].tip === 'koren') k++;
  if (k >= T.length) return -1;
  let j = -1;
  if (T[k].tip === 'broj' || T[k].tip === 'prom') j = k + 1;
  else if (T[k].tip === 'otv') {
    j = izraz(T, k + 1);
    if (j < 0) return -1;
    while (j < T.length && T[j].tip === 'ws') j++;
    j = j < T.length && T[j].tip === 'zat' ? j + 1 : -1;
  }
  // množenje bez znaka: „2√3“, „3(x + 1)“, „(a + b)(a − b)“ (tik uz operand, bez razmaka)
  while (j > 0 && j < T.length && (T[j].tip === 'koren' || T[j].tip === 'otv')) {
    const q = operand(T, j);
    if (q < 0) break;
    j = q;
  }
  return j;
}
// izraz: operand (op operand)* ; vraća indeks posle izraza
function izraz(T, k, info) {
  let j = operand(T, k);
  if (j < 0) return -1;
  for (;;) {
    let p = j;
    while (p < T.length && T[p].tip === 'ws') p++;
    if (p >= T.length || T[p].tip !== 'op') return j;
    const q = operand(T, p + 1);
    if (q < 0) return j;
    if (info) { info.ops.push(T[p].t); }
    j = q;
  }
}

// promenljiva-reč (je, pa, i…) sme biti samo tik uz operaciju – proveravamo posle sastavljanja
function sumnjiva(T, od, doo) {
  const ops = T.slice(od, doo).filter((t) => t.tip !== 'ws');
  // nijedna srpska reč u formuli
  return ops.some((t) => t.tip === 'prom' && RECI.has(t.t));
}

function umotajDeo(s) {
  const T = tokeni(s);
  const delovi = [];
  let k = 0;
  while (k < T.length) {
    const t = T[k];
    // minus tik uz broj na početku izraza („−2,1 < −2“) pripada formuli, ne ostaje ispred $
    const predznak = t.tip === 'op' && /^[−-]$/.test(t.t) && k + 1 < T.length && T[k + 1].tip !== 'ws' &&
      (k === 0 || T[k - 1].tip === 'ws' || T[k - 1].tip === 'tekst');
    if (!predznak && (t.tip === 'ws' || t.tip === 'tekst' || t.tip === 'op' || t.tip === 'zat')) { k++; continue; }
    const info = { ops: [] };
    const j = izraz(T, k, info);
    if (j > k) {
      const imaOdnos = info.ops.some((o) => ODNOS.test(o));
      const imaKoren = T.slice(k, j).some((x) => x.tip === 'koren');
      // samo ono sa znakom odnosa ili korenom („1 : 200 000“ ili „8 − 12“ bez = ostaju tekst)
      if (!sumnjiva(T, k, j) && (imaOdnos || imaKoren)) { delovi.push([T[k].od, T[j - 1].do]); k = j; continue; }
    }
    k++;
  }
  if (!delovi.length) return s;
  let out = '', p = 0;
  for (const [a, b] of delovi) { out += s.slice(p, a) + '$' + s.slice(a, b) + '$'; p = b; }
  return out + s.slice(p);
}

// ceo tekst: deli na $…$ i ostalo; dira samo ostalo
function umotaj(tekst, x = {}) {
  if (typeof tekst !== 'string' || !tekst) return tekst;
  const delovi = tekst.split(/(\$[^$]*\$)/);
  if (delovi.length % 2 === 0) return tekst; // neuparen $ – ne diramo
  return delovi.map((d, i) => (i % 2 ? d : umotajDeo(d))).join('');
}

// odgovor ceo kao izraz („a + b“, „2x − 1“, „√2“): bez znaka odnosa, ali sav od matematike
function ceoIzraz(s) {
  if (typeof s !== 'string' || s.includes('$')) return s;
  const x = s.trim();
  if (!x || x.length > 40) return s;
  const T = tokeni(x).filter((t) => t.tip !== 'ws');
  if (!T.length || T.some((t) => t.tip === 'tekst')) return s;
  const S = tokeni(x);
  const info = { ops: [] };
  const j = izraz(S, 0, info);
  if (j !== S.length || sumnjiva(S, 0, j)) return s;
  // mora biti nešto više od samog broja ili broja sa jedinicom
  const zanimljivo = info.ops.length || S.some((t) => t.tip === 'koren' || t.tip === 'prom' || (t.tip === 'broj' && /\d[a-zA-Z]/.test(t.t)));
  if (!zanimljivo) return s;
  // „5 cm“, „3 m“ – samo broj sa jedinicom nije izraz
  if (!info.ops.length && S.filter((t) => t.tip !== 'ws').length === 1 && /\d\s?\p{L}/u.test(x) && !/^\d+[a-zA-Z][₀-₉²³′]*$/.test(x)) return s;
  return s.replace(x, `$${x}$`);
}

function umotajPitanje(p) {
  const f = (t) => umotaj(t);
  for (const k of ['pitanje', 'zanimljivost', 'objasnjenje']) if (typeof p[k] === 'string') p[k] = f(p[k]);
  if (Array.isArray(p.odgovori)) p.odgovori = p.odgovori.map((o) => ceoIzraz(f(o)));
  if (Array.isArray(p.parovi)) p.parovi = p.parovi.map((par) => par.map((o) => ceoIzraz(f(o))));
  if (Array.isArray(p.resenje)) for (const k of p.resenje) if (typeof k.t === 'string') k.t = f(k.t);
  return p;
}

module.exports = { umotaj, ceoIzraz, umotajPitanje, tokeni };
