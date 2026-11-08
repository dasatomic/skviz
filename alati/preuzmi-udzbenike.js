#!/usr/bin/env node
// Preuzima stranice besplatnih udžbenika Fondacije „Alek Kavčić“ (interaktivnabiblioteka.com)
// kao slike, za lično korišćenje pri pravljenju kvizova.
//
//   node alati/preuzmi-udzbenike.js 5 6 7          (razredi)
//
// Rezultat: izvori/udzbenici/<razred>/<udzbenik>/str-0001.jpg …  + spisak.json
const fs = require('fs');
const path = require('path');

const UA = 'Mozilla/5.0 (GricKviz; licna upotreba)';
const KOREN = path.join(__dirname, '..', 'izvori', 'udzbenici');
const pauza = (ms) => new Promise((r) => setTimeout(r, ms));

async function tekst(url) {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (r.ok) return await r.text();
      if (r.status === 404) return '';
    } catch {}
    await pauza(2000 * (i + 1));
  }
  return '';
}

async function preuzmi(url, f) {
  if (fs.existsSync(f) && fs.statSync(f).size > 1000) return true;
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (r.ok) { fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); return true; }
      if (r.status === 404) return false;
    } catch {}
    await pauza(2000 * (i + 1));
  }
  return false;
}

const jedinstveno = (a) => [...new Set(a)];

// tekst iz H5P interaktivnih lekcija (novije knjige nemaju slike stranica, nego H5P prezentacije)
async function h5pTekst(url) {
  const h = await tekst(url.replace(/&#0?38;/g, '&'));
  const m = h.match(/H5PIntegration\s*=\s*(\{[\s\S]*?\});\s*\n/);
  if (!m) return '';
  let d;
  try { d = JSON.parse(m[1]); } catch { return ''; }
  const out = [];
  const setaj = (o) => {
    if (Array.isArray(o)) return o.forEach(setaj);
    if (o && typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) {
        if (['text', 'question', 'answer', 'correct', 'tip', 'feedback'].includes(k) && typeof v === 'string') {
          const t = v.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&shy;|\u00ad/g, '').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
          if (t && !/^Untitled/.test(t)) out.push(t);
        } else setaj(v);
      }
    }
  };
  for (const c of Object.values(d.contents || {})) { try { setaj(JSON.parse(c.jsonContent)); } catch {} }
  return jedinstveno(out).join('\n');
}

(async () => {
  const razredi = process.argv.slice(2).length ? process.argv.slice(2) : ['5', '6', '7'];
  for (const raz of razredi) {
    const lista = await tekst(`https://interaktivnabiblioteka.com/udzbenici/razredi/${raz}-razred/`);
    const knjige = jedinstveno([...lista.matchAll(/href="(https:\/\/interaktivnabiblioteka\.com\/udzbenik\/[^"]+)"/g)].map((m) => m[1]));
    console.log(`\n=== ${raz}. razred: ${knjige.length} udžbenika`);
    for (const k of knjige) {
      const ime = k.split('/').filter(Boolean).pop();
      const dir = path.join(KOREN, raz, ime);
      fs.mkdirSync(dir, { recursive: true });
      const strana = await tekst(k);
      const kurs = (strana.match(/href="(https:\/\/app\.[a-z.]+\/courses\/[^"]+)"/) || [])[1];
      let lekcije = jedinstveno([...strana.matchAll(/href="(https:\/\/app\.[a-z.]+\/lessons\/[^"]+)"/g)].map((m) => m[1]));
      if (kurs) {
        const kp = await tekst(kurs);
        lekcije = jedinstveno([...lekcije, ...[...kp.matchAll(/href="(https:\/\/app\.[a-z.]+\/lessons\/[^"]+)"/g)].map((m) => m[1])]);
      }
      // stranice udžbenika su slike sa „page-XXXX“ u imenu
      const slike = new Map();
      const tekstovi = [];
      for (const l of lekcije) {
        const h = await tekst(l);
        // tekst lekcije iz H5P sadržaja
        const naslov = ((h.match(/<title>([^<]*)<\/title>/) || [])[1] || l).replace(/ – .*$/, '').replace(/&#8211;.*$/, '').trim();
        const delovi = [];
        for (const f of jedinstveno([...h.matchAll(/src="([^"]*action=h5p_embed[^"]*)"/g)].map((x) => x[1]))) {
          const t = await h5pTekst(f);
          if (t) delovi.push(t);
        }
        if (delovi.length) tekstovi.push(`### ${naslov}\n${delovi.join('\n')}`);
        for (const m of h.matchAll(/src="(https:\/\/app\.[a-z.]+\/media\/[^"]*?page-?(\d+)[^"]*?\.(?:jpg|jpeg|png|webp))"/gi)) {
          const br = +m[2];
          if (!slike.has(br) && !/-\d+x\d+\./.test(m[1])) slike.set(br, m[1]);
        }
        await pauza(150);
      }
      let ok = 0;
      for (const [br, url] of [...slike].sort((a, b) => a[0] - b[0])) {
        if (await preuzmi(url, path.join(dir, `str-${String(br).padStart(4, '0')}${path.extname(url)}`))) ok++;
      }
      if (tekstovi.length) fs.writeFileSync(path.join(dir, 'tekst.md'), tekstovi.join('\n\n'));
      fs.writeFileSync(path.join(dir, 'spisak.json'), JSON.stringify({ udzbenik: k, kurs, lekcija: lekcije.length, strana: ok }, null, 1));
      console.log(`  ${ime}: ${lekcije.length} lekcija, ${ok} strana, ${tekstovi.length} lekcija sa tekstom`);
    }
  }
})();
