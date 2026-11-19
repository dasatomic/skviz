// Zajednički alat za kvizove teorije matematike (5. i 7. razred): zapis pitanja Q/U/S,
// provera odgovora i sređivanje matematičkog zapisa (LaTeX → ono što klijent ume da prikaže).
//
//   const { gradi } = require('./teorija-osnova');
//   gradi({ lekcije, pomocne, folder: 'matematika-teorija-7', kviz: { naziv, … }, paket: 'razred7-matematika' });
//
// Svaki fajl teme u alati/<folder>/<n>-<tema>.js izvozi funkciju ({ L, Q, U, S, G, … }) => { … }.
const fs = require('fs');
const path = require('path');

// Oznake tačaka, skupova i promenljive napisane van $…$ klijent bi preslovio u ćirilicu
// („tačke A, B“ → „А, Б“, „duž AB“ → „АБ“). Ovde ih stavljamo u $…$ (tekst u $…$ se ne dira).
// „A“, „U“, „O“ su i reči (veznik, predlozi): na početku rečenice ispred malog slova ostaju reči.
const NISU_OZNAKE = new Set(['I', 'NE', 'NIJE', 'NEMA', 'DVE', 'SVE', 'PUN', 'RED', 'CSV', 'NZD', 'NZS', 'SSS', 'SUS', 'USU', 'SSU', 'UUU', 'ILI', 'JE', 'DA', 'TV', 'SAD', 'PDF', 'JPG', 'MP', 'DNK', 'GPS', 'NBA', 'OK', 'ZOO', 'PRVA', 'SAMO', 'NULA', 'II', 'III', 'IV', 'VI', 'VII', 'IX', 'XI', 'XII']);
function oznakeUMat(t) {
  return String(t).split(/(\$[^$]*\$)/).map((deo, i) => {
    if (i % 2) return deo; // već matematika
    // ceo tekst je formula („P = 2rπ“) – tipično ponuđeni odgovor
    if (/=/.test(deo) && /^[\sA-Za-z0-9²³π=+\-−·/()₀-₉.,]+$/.test(deo) && /[A-Za-z]/.test(deo)) {
      const x = deo.trim();
      return deo.replace(x, `$${x}$`);
    }
    let s = deo;
    // „a = 3“, „b=2“
    s = s.replace(/(?<![\p{L}\d$])([a-zA-Z])\s?=\s?([−-]?\d+(?:,\d+)?)(?![\p{L}\d])/gu, (m, a, b) => `$${a} = ${b}$`);
    // „n-ti“, „n-tom“
    s = s.replace(/(?<![\p{L}\d$])([nkab])-(?=\p{Ll})/gu, (m, a) => `$${a}$-`);
    // „r²“, „d²“
    // (ne i jedinica iza broja: „100 m²“)
    s = s.replace(/(?<![\p{L}\d$])(?<!\d\s)([a-z][²³])(?![\p{L}\d])/gu, (m, a) => `$${a}$`);
    // „slovom r“
    s = s.replace(/(slov(?:o|om|a)\s)([a-z])(?![\p{L}\d])/gu, (m, a, b) => `${a}$${b}$`);
    // velika slova: A, B, AB, AOB, P₃, A′
    s = s.replace(/(?<![\p{L}\d$])([A-Z]{1,4}[₀-₉′']?)(?![\p{L}\d$])/gu, (m, x, poz, ceo) => {
      if (NISU_OZNAKE.has(x)) return m;
      if (/^[AUO]$/.test(x)) {
        const pre = ceo.slice(0, poz), posle = ceo.slice(poz + 1);
        const malo = /^\s+\p{Ll}/u.test(posle);
        const pocetak = (i === 0 && /^[\s„(]*$/.test(pre)) || /[.!?:;]\s+$/.test(pre);
        const glagol = /^\s+(je|i|su|se|leži|ima)\s/u.test(posle); // „O je centar…“, „A i B…“
        if (pocetak && malo && !glagol) return m; // „A ako…“, „U paralelogramu…“, „O čemu…“
        if (pocetak && x !== 'A' && !glagol && /^\s+([IVX]+\s|\$|\d|\p{Lu}\p{Ll})/u.test(posle)) return m; // „U II kvadrantu“, „U $14$ časova“, „U Novom Sadu“
        if (x !== 'A' && malo && !glagol && !/(tačk\p{L}*|teme\p{L}*|kod|od|do|oko|kroz|iz|skup\p{L}*|centar|centr\p{L}*|središt\p{L}*)\s+$/u.test(pre)) return m;
      }
      return `$${x}$`;
    });
    return s;
  }).join('');
}

function gradi({ lekcije, pomocne, folder, kviz: zaglavlje, paket, oznake = false }) {
  const pitanja = [];
  let lek = 0;

  const L = (naziv) => { lek = lekcije.findIndex((l) => l.naziv === naziv) + 1; if (!lek) throw new Error('Nepoznata lekcija: ' + naziv); };
  const proveri = (uslov, opis) => { if (!uslov) throw new Error('Netačan račun: ' + opis); };

  function dodaj(p) {
    if (!lek) throw new Error('Pitanje pre nego što je izabrana lekcija (L): ' + p.pitanje);
    p.pitanje = srediMatematiku(p.pitanje);
    if (p.odgovori) p.odgovori = p.odgovori.map(srediMatematiku);
    if (p.zanimljivost) p.zanimljivost = srediMatematiku(p.zanimljivost);
    if (p.objasnjenje) p.objasnjenje = srediMatematiku(p.objasnjenje);
    if (p.parovi) p.parovi = p.parovi.map((x) => x.map(srediMatematiku));
    if (p.vrsta === 'spoji') {
      if (new Set(p.parovi.map((x) => x[0].trim().toLowerCase())).size !== p.parovi.length) throw new Error('spoji: ponovljeni levi pojmovi: ' + p.pitanje);
      if (new Set(p.parovi.map((x) => x[1].trim().toLowerCase())).size !== p.parovi.length) throw new Error('spoji: ponovljeni desni pojmovi: ' + p.pitanje);
    } else if (new Set(p.odgovori).size !== 4) throw new Error('Odgovori moraju biti 4 različita: ' + p.pitanje);
    pitanja.push({ lekcija: lek, ...p });
  }

  // Q(težina, pitanje, odgovori [prvi tačan], zanimljivost, pojam, { mediji, medijiOdgovora, vreme })
  function Q(tezina, pitanje, odgovori, zanimljivost, rec, x = {}) {
    dodaj({
      tezina, pitanje, ...(x.mediji ? { mediji: x.mediji } : {}), odgovori, zanimljivost,
      ...(x.medijiOdgovora ? { medijiOdgovora: x.medijiOdgovora } : {}),
      ...(x.vreme ? { vreme: x.vreme } : {}),
      rec,
    });
  }
  // U(težina, pitanje, odgovori [prvi je uljez], objašnjenje, zanimljivost, pojam, { … })
  function U(tezina, pitanje, odgovori, objasnjenje, zanimljivost, rec, x = {}) {
    dodaj({ vrsta: 'uljez', tezina, pitanje, ...(x.mediji ? { mediji: x.mediji } : {}), odgovori, objasnjenje, zanimljivost, ...(x.medijiOdgovora ? { medijiOdgovora: x.medijiOdgovora } : {}), rec });
  }
  // S(težina, pitanje, parovi [[levo, desno], …], zanimljivost, pojam, { … })
  function S(tezina, pitanje, parovi, zanimljivost, rec, x = {}) {
    dodaj({ vrsta: 'spoji', tezina, pitanje, ...(x.mediji ? { mediji: x.mediji } : {}), parovi, zanimljivost, rec });
  }

  // Zajedničke LaTeX → Unicode zamene: sve komande koje klijent NE ume sam da prikaže
  // pretvaramo u odgovarajući znak, da se nigde ne vidi sirovo „\cdot“, „\frac“…
  function unicodeLaTeX(s) {
    return s
      .replace(/\\notin/g, '∉')
      .replace(/\\in/g, '∈')
      .replace(/\\varnothing/g, '∅')
      .replace(/\\mathbb\{N\}/g, 'ℕ')
      .replace(/\\mathbb\{Z\}/g, 'ℤ')
      .replace(/\\mathbb\{Q\}/g, 'ℚ')
      .replace(/\\mathbb\{R\}/g, 'ℝ')
      .replace(/\\cup/g, '∪')
      .replace(/\\cap/g, '∩')
      .replace(/\\setminus/g, '∖')
      .replace(/\\parallel/g, '∥')
      .replace(/\\perp/g, '⊥')
      .replace(/\\angle/g, '∠')
      .replace(/\\Rightarrow/g, '⇒')
      .replace(/\\Leftrightarrow/g, '⇔')
      .replace(/\\dots/g, '…')
      .replace(/\\neq/g, '≠')
      .replace(/\\ne/g, '≠')
      .replace(/\\ge/g, '≥')
      .replace(/\\le/g, '≤')
      .replace(/\\times/g, '×')
      .replace(/\\cdot/g, '·')
      .replace(/\\to/g, '→')
      .replace(/\\star/g, '★')
      .replace(/\\approx/g, '≈')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\pi/g, 'π')
      .replace(/\\circ/g, '°')
      .replace(/\\triangle/g, '△')
      .replace(/\\sqrt\{/g, '√{')
      .replace(/\\%/g, '%')
      .replace(/\\!/g, '')
      .replace(/\\,/g, '.')
      .replace(/_\{?0\}?/g, '₀');
  }

  // \frac{X}{Y} sa uparenim zagradama (X i Y smeju da sadrže ^{…}, √{…}, pa i drugi \frac)
  function razlomci(s, f) {
    const grupa = (i) => { // s[i] === '{' → [sadržaj, indeks posle '}']
      let d = 0;
      for (let j = i; j < s.length; j++) {
        if (s[j] === '{') d++;
        else if (s[j] === '}' && --d === 0) return [s.slice(i + 1, j), j + 1];
      }
      return null;
    };
    for (let i = s.lastIndexOf('\\frac{'); i >= 0; i = s.lastIndexOf('\\frac{', i - 1)) {
      const a = grupa(i + 5); if (!a || s[a[1]] !== '{') continue;
      const b = grupa(a[1]); if (!b) continue;
      s = s.slice(0, i) + f(a[0], b[0]) + s.slice(b[1]);
      if (i === 0) break;
    }
    return s;
  }

  // Medij „formula“ klijent prikazuje kao običan tekst (.formula) – ne prolazi kroz matematički
  // renderer kao tekst pitanja. Zato se LaTeX iz $…$ ovde pretvara u Unicode znakove (bez $).
  function srediFormulu(t) {
    let s = String(t).replace(/\$/g, '');
    // razlomak \frac{X}{Y} → X/Y (složeni brojilac/imenilac u zagradama)
    s = razlomci(s, (a, b) => {
      const slozen = (x) => /[+\-:·\\\s]/.test(x);
      return (slozen(a) ? `(${a})` : a) + '/' + (slozen(b) ? `(${b})` : b);
    });
    s = unicodeLaTeX(s);
    s = s.replace(/\\vec\{([^{}]*)\}/g, '$1');
    s = s.replace(/\\\{/g, '{').replace(/\\\}/g, '}');
    // izložioci i indeksi: x^{2} → x², a_{1} → a₁, √{2} → √2 (formula je običan tekst)
    const GORE = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻', '−': '⁻', n: 'ⁿ' };
    const DOLE = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉', n: 'ₙ' };
    const znaci = (x, T) => ([...x].every((c) => T[c]) ? [...x].map((c) => T[c]).join('') : null);
    s = s.replace(/\^\{([^{}]*)\}/g, (m, x) => znaci(x, GORE) ?? `^(${x})`).replace(/_\{([^{}]*)\}/g, (m, x) => znaci(x, DOLE) ?? `_${x}`);
    s = s.replace(/√\{([^{}]*)\}/g, (m, x) => (/^[\w,.]+$/.test(x) ? `√${x}` : `√(${x})`));
    s = s.replace(/\s*([+=])\s*/g, ' $1 ').replace(/\s*-\s*/g, ' − ');
    // unarni minus (na početku, posle zagrade ili znaka) ostaje uz broj: „(−3)“, „= −9“
    s = s.replace(/(^|[(\[{=<>≤≥≈⇒,:·]\s*)\s*−\s+/g, (m, a) => `${a.trimEnd()}${/[=<>≤≥≈⇒,:·]$/.test(a.trimEnd()) ? ' ' : ''}−`);
    s = s.replace(/(^|\s)(ali|pa|je|ili|za)\s−\s+/g, '$1$2 −');
    return s.replace(/\s+/g, ' ').trim();
  }

  // Tekst pitanja/odgovora/zanimljivosti prolazi kroz matTekst (public/app.js), koji ume:
  // \vec{}, √{}, ^{}, _{}, {a|b}, \|, \{, \}. Zato njih ostavljamo, a sav ostali LaTeX
  // pretvaramo u Unicode (razlomak \frac{X}{Y} → {X|Y}, što matTekst crta kao razlomak).
  function srediMatematiku(t) {
    let s = String(t);
    s = razlomci(s, (a, b) => `{${a}|${b}}`);
    return unicodeLaTeX(s);
  }

  const O = { ...pomocne, lekcije, pitanja, L, Q, U, S, proveri };
  // SAMO=<deo imena> – samo fajlovi tema čije ime sadrži taj tekst (za rad na jednoj temi)
  for (const f of fs.readdirSync(path.join(__dirname, folder)).filter((f) => /^\d+-.*\.js$/.test(f) && (!process.env.SAMO || f.includes(process.env.SAMO))).sort((a, b) => parseInt(a) - parseInt(b))) {
    require(path.join(__dirname, folder, f))(O);
  }
  // završni prolaz: i tekst koji je tema dopisala posle Q/U/S (npr. dopuna zanimljivosti) mora biti sređen
  const tekstovi = (p, f) => {
    for (const k of ['pitanje', 'zanimljivost', 'objasnjenje']) if (p[k]) p[k] = f(p[k]);
    if (p.odgovori) p.odgovori = p.odgovori.map(f);
    if (p.parovi) p.parovi = p.parovi.map((x) => x.map(f));
  };
  for (const p of pitanja) tekstovi(p, srediMatematiku);
  if (oznake) for (const p of pitanja) tekstovi(p, oznakeUMat);
  pitanja.sort((a, b) => a.lekcija - b.lekcija || a.tezina - b.tezina);
  for (const p of pitanja) if (p.mediji?.vrsta === 'formula') p.mediji.tekst = srediFormulu(p.mediji.tekst);
  for (const p of pitanja) if (p.medijiOdgovora?.vrsta === 'formula') p.medijiOdgovora.tekst = srediFormulu(p.medijiOdgovora.tekst);
  // formula sa rečima („…, pa je x = 7“) se preslovljava (vidi prikaziTekst u public/mediji.js)
  if (oznake) for (const p of pitanja) for (const m of [p.mediji, p.medijiOdgovora]) {
    if (m?.vrsta === 'formula' && !/[^\x00-\x7FčćžšđČĆŽŠĐ²³⁴ⁿ₀-₉√π·−±≈≤≥⇒→°∠αβγ…|×÷–]/u.test(m.tekst) && /[a-zčćžšđ]{3,}|(^|\s)(je|pa|ili)(\s|$)|, a /u.test(m.tekst.replace(/\b(cm|mm|dm|km|min)\b/g, ''))) m.pismo = true;
  }

  const po = {};
  for (const p of pitanja) po[p.lekcija] = (po[p.lekcija] || 0) + 1;
  if (process.argv.includes('--suvo')) {
    console.log('Pitanja:', pitanja.length, '· lekcija:', Object.keys(po).length);
    console.log('Po lekciji:', Object.entries(po).map(([l, n]) => `${l}:${n}`).join(' '));
    return pitanja;
  }
  const kviz = { ...zaglavlje, lekcije, pitanja };
  // IZLAZ=<putanja.json> – upis na drugo mesto (pregled jedne teme, bez diranja kvizovi/)
  const izlaz = process.env.IZLAZ || path.join(__dirname, '..', 'kvizovi', paket, 'kviz.json');
  fs.mkdirSync(path.dirname(izlaz), { recursive: true });
  fs.writeFileSync(izlaz, JSON.stringify(kviz, null, 1) + '\n');
  console.log(`✓ ${path.relative(process.cwd(), izlaz)}: ${pitanja.length} pitanja u ${Object.keys(po).length} lekcija`);
  return pitanja;
}

module.exports = { gradi, oznakeUMat };
