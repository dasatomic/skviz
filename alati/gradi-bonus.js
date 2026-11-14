#!/usr/bin/env node
// Gradi rečnike za bonus krug „Na slovo…“ (zanimljiva geografija, naučnici, istorijske ličnosti, sportisti)
// iz Wikidate (CC0). Rezultat: podaci/bonus/<vrsta>.json – lib/bonus.js ih učitava pri pokretanju servera.
//
// Upotreba: node alati/gradi-bonus.js                 (sve vrste)
//           node alati/gradi-bonus.js geografija sport (samo neke)
//           node alati/gradi-bonus.js --wdqs           (zvanični query.wikidata.org umesto QLever kopije)
//
// Za svaku stavku čuva: srpski naziv (ćirilica), sve oblike imena koji se priznaju (sr, sr-el, sh, hr, bs, en, de –
// zato važe i „Ojler“ i „Euler“), broj Vikipedija na kojima ima članak (meri poznatost – računar predlaže poznate),
// a za ličnosti i sliku (Wikimedia Commons), godine, opis i par podataka za prikaz na kraju kruga.
const fs = require('fs');
const path = require('path');

const IZLAZ = path.join(__dirname, '..', 'podaci', 'bonus');
const WDQS = process.argv.includes('--wdqs');
const ENDPOINT = WDQS ? 'https://query.wikidata.org/sparql' : 'https://qlever.dev/api/wikidata';

const PREFIKSI = `PREFIX wdt: <http://www.wikidata.org/prop/direct/> PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wikibase: <http://wikiba.se/ontology#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/> PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`;

// države bivše Jugoslavije (i Kosovo i Metohija, čija mesta neki zapisi vode posebno) – za njih niži prag poznatosti
const EXYU = 'wd:Q403 wd:Q225 wd:Q236 wd:Q224 wd:Q221 wd:Q215 wd:Q1246';
// državljanstvo „naših“ ličnosti: Srbija, Jugoslavije, SRJ/SCG, Kraljevina i Kneževina Srbija, Crna Gora, BiH…
const NASE_DRZAVE = 'wd:Q403 wd:Q215 wd:Q224 wd:Q225 wd:Q236 wd:Q221 wd:Q838261 wd:Q83286 wd:Q191077 wd:Q37024 wd:Q36704 wd:Q241748 ' +
  'wd:Q2603851 wd:Q386496 wd:Q1406298 wd:Q13107370 wd:Q684030 wd:Q11314573 wd:Q12752840 wd:Q15102440 wd:Q878319 wd:Q1311990';
// „naša“ ličnost (?nas vezano) ili poznata u svetu: prag `svet` za sve, `nasi` za naše
// (ili sa člankom na srpskoj Vikipediji i bar `srpska` članaka ukupno – Hajduk Veljko nema državljanstvo u Wikidati)
const POZNAT = (svet, nasi, srpska = svet) => `OPTIONAL { ?x wdt:P27 ?dz . VALUES ?dz { ${NASE_DRZAVE} } BIND(1 AS ?nas) }
          OPTIONAL { ?srw schema:about ?x ; schema:isPartOf <https://sr.wikipedia.org/> }
          FILTER(?sl >= ${svet} || (BOUND(?nas) && ?sl >= ${nasi}) || (BOUND(?srw) && ?sl >= ${srpska}))`;
// mesto/reka/planina u bivšoj Jugoslaviji ili dovoljno poznato (ili veliko: `dodatno` je uslov nad ?mera)
const BLIZU = (svet, mera) => `OPTIONAL { ?x wdt:P17 ?c . VALUES ?c { ${EXYU} } BIND(1 AS ?blizu) }
          ${mera ? `OPTIONAL { ?x ${mera[0]} ?mera }` : ''}
          FILTER(?sl >= ${svet} || BOUND(?blizu)${mera ? ` || (BOUND(?mera) && ?mera >= ${mera[1]})` : ''})`;

// Kategorije po vrsti bonus igre. `upit` bira ?x (i mora vezati ?sl = broj članaka na Vikipedijama).
const VRSTE = {
  geografija: {
    naziv: 'Zanimljiva geografija',
    kategorije: [
      {
        id: 'drzava', naziv: 'Država', ikona: '🏳️',
        // članice UN + Vatikan i Palestina; uz to Engleska, Škotska, Vels i Severna Irska (deca ih pišu kao države)
        upit: `{ ?x wdt:P463 wd:Q1065 . FILTER NOT EXISTS { ?x wdt:P576 ?kraj } } UNION { VALUES ?x { wd:Q237 wd:Q219060 wd:Q21 wd:Q22 wd:Q25 wd:Q26 } }
          ?x wikibase:sitelinks ?sl .`,
        podaci: ['glavni'],
      },
      {
        id: 'grad', naziv: 'Grad', ikona: '🏙️',
        // gradovi sa 100.000+ stanovnika (i opštine – Španija i Italija gradove vode kao opštine: Granada, Valensija), gradovi i varošice bivše Jugoslavije (i sedišta opština, i mesta sa 3.000+) i sve prestonice
        upit: `{ ?x wdt:P31/wdt:P279* wd:Q486972 ; wdt:P1082 ?pop . FILTER(?pop >= 100000) }
          UNION { ?x wdt:P31/wdt:P279* wd:Q486972 ; wdt:P1082 ?pop ; wdt:P17 ?c . VALUES ?c { ${EXYU} } FILTER(?pop >= 3000) }
          UNION { ?x wdt:P31/wdt:P279* ?tt ; wdt:P17 ?c . VALUES ?tt { wd:Q515 wd:Q7930989 wd:Q3957 } VALUES ?c { ${EXYU} } }
          UNION { ?x wdt:P31/wdt:P279* wd:Q486972 ; wdt:P1376 ?sediste ; wdt:P17 ?c . VALUES ?c { ${EXYU} } }
          UNION { ?d wdt:P463 wd:Q1065 ; wdt:P36 ?x . }
          UNION { ?x wdt:P31/wdt:P279* wd:Q515 ; wikibase:sitelinks ?sl0 . FILTER(?sl0 >= 60) }
          UNION { ?x wdt:P31/wdt:P279* wd:Q15284 ; wdt:P1082 ?pop . FILTER(?pop >= 100000) }
          ?x wikibase:sitelinks ?sl .`,
        podaci: ['zemlja', 'stanovnika'],
        // administrativne jedinice koje Wikidata vodi kao naselja (okruzi u SAD, opštine, gradske četvrti)
        izuzmi: /^(Округ|Општина|Градска општина|Сектор|Регион|Провинција|Префектура)\s|\s(арондисман|округ|општина|рејон|област|дистрикт|кварт)(\s|$)|област$/i,
      },
      {
        id: 'reka', naziv: 'Reka', ikona: '🌊',
        upit: `?x wdt:P31/wdt:P279* wd:Q4022 ; wikibase:sitelinks ?sl .
          ${BLIZU(12, ['wdt:P2043', 500])}`,
        podaci: ['zemlja', 'duzina'],
      },
      {
        id: 'planina', naziv: 'Planina', ikona: '⛰️',
        // planine, planinski vrhovi i venci (Alpi, Himalaji)
        upit: `?x wdt:P31/wdt:P279* ?t . VALUES ?t { wd:Q8502 wd:Q46831 wd:Q1437459 } ?x wikibase:sitelinks ?sl .
          ${BLIZU(12, ['wdt:P2044', 6000])}`,
        podaci: ['zemlja', 'visina'],
      },
    ],
  },
  nauka: {
    naziv: 'Naučnici',
    kategorije: [
      {
        id: 'naucnik', naziv: 'Matematičar ili fizičar', ikona: '🧑‍🔬', licnosti: true,
        // matematičari, fizičari i astronomi (sa svim podvrstama zanimanja)
        upit: `?x wdt:P31 wd:Q5 ; wdt:P106 ?o ; wikibase:sitelinks ?sl . ?o wdt:P279* ?k . VALUES ?k { wd:Q170790 wd:Q169470 wd:Q11063 }
          ${POZNAT(12, 3, 8)}`,
        podaci: ['zemlja', 'zanimanje', 'nobel', 'delo'],
      },
    ],
  },
  istorija: {
    naziv: 'Istorijske ličnosti',
    kategorije: [
      {
        id: 'licnost', naziv: 'Istorijska ličnost', ikona: '👑', licnosti: true, vladari: true,
        // vladari, vojskovođe, državnici, revolucionari i istraživači koji više nisu živi
        // (i polulegendarne ličnosti: Miloš Obilić)
        upit: `?x wdt:P31 ?covek ; wdt:P570 ?umro ; wikibase:sitelinks ?sl . VALUES ?covek { wd:Q5 wd:Q13002315 wd:Q21070568 }
          { ?x wdt:P106/wdt:P279* ?k . VALUES ?k { wd:Q82955 wd:Q116 wd:Q189290 wd:Q47064 wd:Q11900058 wd:Q3242115 wd:Q372436 wd:Q1097498 } }
          UNION { ?x wdt:P39/wdt:P279* ?pz . VALUES ?pz { wd:Q116 wd:Q48352 } }
          ${POZNAT(30, 5, 15)}`,
        podaci: ['zemlja', 'polozaj', 'zanimanje'],
      },
    ],
  },
  sport: {
    naziv: 'Sportisti',
    kategorije: [
      {
        id: 'sportista', naziv: 'Sportista', ikona: '🏅', licnosti: true,
        upit: `?x wdt:P31 wd:Q5 ; wdt:P106 ?o ; wikibase:sitelinks ?sl . ?o wdt:P279* wd:Q2066131 .
          ${POZNAT(45, 6, 25)}`,
        podaci: ['zemlja', 'sport'],
      },
    ],
  },
};

const JEZICI = ['sr', 'sr-el', 'sh', 'hr', 'bs', 'en', 'de'];

async function upit(telo, pokusaj = 0) {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'User-Agent': 'SkvizBonus/1.0 (porodicni kviz)', Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'query=' + encodeURIComponent(PREFIKSI + '\n' + telo),
  });
  if (!r.ok) {
    const t = await r.text();
    if (pokusaj < 6 && (r.status === 429 || r.status >= 500)) {
      await new Promise((ok) => setTimeout(ok, 4000 * (pokusaj + 1)));
      return upit(telo, pokusaj + 1);
    }
    throw new Error(`${r.status} za upit:\n${telo.replace(/VALUES ?x { [^}]* }/, "VALUES …").slice(0, 600)}\n${t.slice(0, 200)}`);
  }
  // vrednost, a jezik oznake kao <ime>_jezik (npr. l_jezik: 'sr-el')
  return (await r.json()).results.bindings.map((b) => Object.fromEntries(Object.entries(b).flatMap(([k, v]) => [[k, v.value], ...(v['xml:lang'] ? [[k + '_jezik', v['xml:lang']]] : [])])));
}
// srpska oznaka je ponegde latinicom (Beograd) – prevodi se u ćirilicu (ako je pisana srpskom latinicom)
const CIR = { a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', đ: 'ђ', e: 'е', ž: 'ж', z: 'з', i: 'и', j: 'ј', k: 'к', l: 'л', m: 'м',
  n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т', ć: 'ћ', u: 'у', f: 'ф', h: 'х', c: 'ц', č: 'ч', š: 'ш' };
function uCirilicu(t) {
  if (/[а-яђјљњћџ]/i.test(t)) return t;
  if (/[qwxyäöüéèáàíóúßñ]/i.test(t)) return null;
  let out = '';
  for (let i = 0; i < t.length; i++) {
    const c = t[i], m = c.toLowerCase(), d = (t[i + 1] || '').toLowerCase();
    const veliko = c !== m;
    let x;
    if (m === 'l' && d === 'j') { x = 'љ'; i++; } else if (m === 'n' && d === 'j') { x = 'њ'; i++; } else if (m === 'd' && d === 'ž') { x = 'џ'; i++; }
    else if (CIR[m]) x = CIR[m];
    else if (/[a-z]/.test(m)) return null;
    else x = c;
    out += veliko ? x.toUpperCase() : x;
  }
  return out;
}
// ručno dodati nazivi koje deca pišu, a Wikidata ih nema kao srpske nazive
const DODATNO = {
  Q30: ['Америка', 'САД', 'Сједињене Државе'], Q145: ['Велика Британија', 'Британија'], Q159: ['Русија'],
  Q55: ['Холандија'], Q974: ['Конго', 'ДР Конго'], Q971: ['Конго'], Q1033: ['Нигерија'], Q213: ['Чешка'], Q184: ['Белорусија'], Q1246: [], Q3711: ['Београд'],
};

const qid = (u) => u.replace('http://www.wikidata.org/entity/', '');
const godina = (d) => {
  const m = /^(-?)0*(\d+)-/.exec(d || '');
  // XSD datumi u Wikidati broje i godinu 0 (-0042 = 43. p. n. e.)
  return m ? (m[1] ? -(+m[2] + 1) : +m[2]) : null;
};

// sporedni podaci (po jedan upit za sve stavke kategorije): [promenljiva, deo upita]
const PODACI = {
  zemlja: (l) => `?x wdt:${l ? 'P27' : 'P17'} ?z . ?z rdfs:label ?v . FILTER(LANG(?v) = "sr")`,
  glavni: () => `?x wdt:P36 ?z . ?z rdfs:label ?v . FILTER(LANG(?v) = "sr")`,
  stanovnika: () => `?x wdt:P1082 ?v .`,
  duzina: () => `?x wdt:P2043 ?v .`,
  visina: () => `?x wdt:P2044 ?v .`,
  zanimanje: () => `?x wdt:P106 ?z . ?z rdfs:label ?v . FILTER(LANG(?v) = "sr")`,
  nobel: () => `?x wdt:P166 ?z . ?z wdt:P279* wd:Q7191 . ?z rdfs:label ?v . FILTER(LANG(?v) = "sr")`,
  delo: () => `?x wdt:P800 ?z . ?z rdfs:label ?v . FILTER(LANG(?v) = "sr")`,
  polozaj: () => `?x wdt:P39 ?z . ?z rdfs:label ?v . FILTER(LANG(?v) = "sr")`,
  sport: () => `?x wdt:P641 ?z . ?z rdfs:label ?v . FILTER(LANG(?v) = "sr")`,
};

async function gradiKategoriju(k) {
  const t0 = Date.now();
  const osnovno = await upit(`SELECT ?x (MAX(?sl) AS ?n) (SAMPLE(?ime0) AS ?ime) WHERE {
    ${k.upit}
    ?x rdfs:label ?ime0 . FILTER(LANG(?ime0) = "sr")
  } GROUP BY ?x`);
  const stavke = new Map();
  for (const b of osnovno) {
    // naziv mora biti ćirilicom (latinični srpski naziv se preslovljava, strani naziv se preskače)
    const ime = uCirilicu(b.ime.replace(/\s*\(.*\)\s*$/, ''));
    if (!ime || k.izuzmi?.test(ime)) continue;
    stavke.set(qid(b.x), { q: qid(b.x), ime, sl: +b.n, imena: new Set(), srImena: new Set(DODATNO[qid(b.x)] || []) });
  }
  console.log(`  ${k.id}: ${stavke.size} stavki (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  const ids = [...stavke.keys()];
  // upiti po paketima od 500 stavki (veći upiti ponekad padnu na QLever-u sa 500)
  const zaSve = async (telo) => {
    const out = [];
    for (let i = 0; i < ids.length; i += 500) {
      const d = ids.slice(i, i + 500).map((q) => 'wd:' + q).join(' ');
      out.push(...(await upit(telo.replace('%VALUES%', `VALUES ?x { ${d} }`))));
    }
    return out;
  };

  // svi oblici imena (oznake i drugi nazivi)
  const imena = await zaSve(`SELECT ?x ?l WHERE { %VALUES% ?x rdfs:label|skos:altLabel ?l . FILTER(LANG(?l) IN (${JEZICI.map((j) => `"${j}"`).join(',')})) }`);
  for (const b of imena) {
    const s = stavke.get(qid(b.x));
    if (!s) continue;
    const ime = b.l.replace(/\s*\(.*\)\s*$/, '').trim();
    if (!ime || ime.length > 60) continue;
    s.imena.add(ime);
    // srpski oblici (ćirilica) – po njima se gleda početno slovo; srpski latinični (sr, sr-el) se preslovljavaju
    if (/^[а-яђјљњћџА-ЯЂЈЉЊЋЏ]/.test(ime)) s.srImena.add(ime);
    else if (['sr', 'sr-el'].includes(b.l_jezik)) { const c = uCirilicu(ime); if (c) s.srImena.add(c); }
  }
  // opis, slika, članak na srpskoj Vikipediji, godine
  const opisi = await zaSve(`SELECT ?x (SAMPLE(?o) AS ?opis) (SAMPLE(?s) AS ?slika) (SAMPLE(?c) AS ?clanak) (MIN(?r) AS ?rodj) (MIN(?u) AS ?umro) (SAMPLE(?pr) AS ?prezime) WHERE { %VALUES%
    OPTIONAL { ?x schema:description ?o . FILTER(LANG(?o) = "sr") }
    OPTIONAL { ?x wdt:P18 ?s }
    OPTIONAL { ?c schema:about ?x ; schema:isPartOf <https://sr.wikipedia.org/> }
    ${k.licnosti ? `OPTIONAL { ?x wdt:P569 ?r } OPTIONAL { ?x wdt:P570 ?u } OPTIONAL { ?x wdt:P734 ?pz . ?pz rdfs:label ?pr . FILTER(LANG(?pr) = "sr") }` : ''}
  } GROUP BY ?x`);
  for (const b of opisi) {
    const s = stavke.get(qid(b.x));
    if (!s) continue;
    if (b.opis) s.opis = b.opis;
    if (b.slika) s.slika = decodeURIComponent(b.slika.replace(/^.*\/Special:FilePath\//, '')).replace(/_/g, ' ');
    if (b.clanak) s.clanak = decodeURIComponent(b.clanak.replace('https://sr.wikipedia.org/wiki/', ''));
    const r = godina(b.rodj), u = godina(b.umro);
    if (r !== null) s.rodjen = r;
    if (u !== null) s.umro = u;
    if (b.prezime && uCirilicu(b.prezime)) s.prezime = uCirilicu(b.prezime);
  }
  for (const p of k.podaci || []) {
    const red = await zaSve(`SELECT ?x ?v WHERE { %VALUES% ${PODACI[p](k.licnosti)} }`);
    for (const b of red) {
      const s = stavke.get(qid(b.x));
      if (!s) continue;
      const v = /^[\d.]+$/.test(b.v) ? Math.round(+b.v) : b.v;
      if (['stanovnika', 'duzina', 'visina'].includes(p)) s[p] = Math.max(s[p] || 0, v);
      else if (!(s[p] ||= []).includes(v)) s[p].push(v);
    }
  }
  const lista = [...stavke.values()].sort((a, b) => b.sl - a.sl).map((s) => {
    const { imena: im, srImena, ...ost } = s;
    for (const p of ['zemlja', 'zanimanje', 'nobel', 'delo', 'polozaj', 'sport', 'glavni']) if (ost[p]) ost[p] = ost[p].slice(0, 3);
    return { ...ost, sr: [...srImena].filter((x) => x !== s.ime), imena: [...im].filter((x) => x !== s.ime && !srImena.has(x)) };
  });
  console.log(`  ${k.id}: gotovo (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  return lista;
}

(async () => {
  const trazene = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  fs.mkdirSync(IZLAZ, { recursive: true });
  for (const [vrsta, V] of Object.entries(VRSTE)) {
    if (trazene.length && !trazene.includes(vrsta)) continue;
    console.log(`${vrsta}:`);
    const kategorije = [];
    for (const k of V.kategorije) {
      const { upit: _, podaci: __, izuzmi: ___, ...opis } = k;
      kategorije.push({ ...opis, stavke: await gradiKategoriju(k) });
    }
    const out = { naziv: V.naziv, izvor: 'Wikidata (CC0), ' + new Date().toISOString().slice(0, 10), kategorije };
    const f = path.join(IZLAZ, vrsta + '.json');
    fs.writeFileSync(f, JSON.stringify(out));
    console.log(`  → ${path.relative(process.cwd(), f)} (${(fs.statSync(f).size / 1e6).toFixed(1)} MB)`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
