#!/usr/bin/env node
// Preuzima stranice besplatnih udžbenika Fondacije „Alek Kavčić“ (interaktivnabiblioteka.com)
// kao slike, za lično korišćenje pri pravljenju kvizova.
//
//   node alati/preuzmi-udzbenike.js 5 6 7          (razredi)
//   node alati/preuzmi-udzbenike.js 8 --samo biologija   (samo udžbenici čije ime sadrži reč)
//
// Rezultat: izvori/udzbenici/<razred>/<udzbenik>/str-0001.jpg …  + spisak.json
//           (H5P knjige, npr. matematika: tekst.md sa formulama $…$ i slikama iz slike/LNNN-NNNN.jpg)
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

// H5P podaci iz stranice: \u201eH5PIntegration = {\u2026};\u201c \u2013 JSON se izdvaja brojanjem zagrada
// (regex do \u201e};\n\u201c puca kad iza sledi jo\u0161 skripte, npr. kod lekcija matematike)
function h5pPodaci(h) {
  const i = h.search(/H5PIntegration\s*=\s*\{/);
  if (i < 0) return null;
  const p = h.indexOf('{', i);
  let dub = 0, uNizu = false;
  for (let j = p; j < h.length; j++) {
    const c = h[j];
    if (uNizu) { if (c === '\\') j++; else if (c === '"') uNizu = false; continue; }
    if (c === '"') uNizu = true;
    else if (c === '{') dub++;
    else if (c === '}' && --dub === 0) { try { return JSON.parse(h.slice(p, j + 1)); } catch { return null; } }
  }
  return null;
}

// HTML \u2192 \u010dist tekst; MathJax \( \u2026 \) \u2192 $ \u2026 $
const ocisti = (v) => v.replace(/<br\s*\/?>|<\/p>|<\/li>|<\/h\d>/gi, '\n').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&shy;|\u00ad/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
  .replace(/&[a-z#0-9]+;/gi, ' ').replace(/\\\(([\s\S]*?)\\\)/g, (_, f) => `$${f.trim()}$`)
  .replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n').trim();

// tekst i slike iz H5P sadr\u017eaja, redom kako se pojavljuju; slika je u tekstu oznaka @SLIKAn@
function h5pSadrzaj(d) {
  const out = [];
  const slike = [];
  if (!d) return { tekst: '', slike };
  const baza = (d.baseUrl || '') + (d.url || '/media/h5p');
  for (const [kljuc, c] of Object.entries(d.contents || {})) {
    const id = kljuc.replace(/^cid-/, '');
    const setaj = (o) => {
      if (Array.isArray(o)) return o.forEach(setaj);
      if (!o || typeof o !== 'object') return;
      if (typeof o.path === 'string' && /^image\//.test(o.mime || '')) {
        slike.push(/^https?:/.test(o.path) ? o.path : `${baza}/content/${id}/${o.path}`);
        out.push(`![](@SLIKA${slike.length - 1}@)`);
      }
      for (const [k, v] of Object.entries(o)) {
        if (['text', 'question', 'answer', 'correct', 'tip', 'feedback'].includes(k) && typeof v === 'string') {
          const t = ocisti(v);
          if (t && !/^Untitled/.test(t)) out.push(t);
        } else if (k !== 'path') setaj(v);
      }
    };
    try { setaj(JSON.parse(c.jsonContent)); } catch {}
  }
  return { tekst: jedinstveno(out).join('\n'), slike };
}

// tekst iz H5P interaktivnih lekcija (novije knjige nemaju slike stranica, nego H5P prezentacije)
async function h5pTekst(url) {
  return h5pSadrzaj(h5pPodaci(await tekst(url.replace(/&#0?38;/g, '&'))));
}

(async () => {
  const arg = process.argv.slice(2);
  const iSamo = arg.indexOf('--samo');
  const samo = iSamo >= 0 ? arg.splice(iSamo, 2)[1] : '';
  const razredi = arg.length ? arg : ['5', '6', '7'];
  for (const raz of razredi) {
    const lista = await tekst(`https://interaktivnabiblioteka.com/udzbenici/razredi/${raz}-razred/`);
    const knjige = jedinstveno([...lista.matchAll(/href="(https:\/\/interaktivnabiblioteka\.com\/udzbenik\/[^"]+)"/g)].map((m) => m[1]))
      .filter((k) => !samo || k.includes(samo));
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
      let brSlika = 0;
      for (const [rb, l] of lekcije.entries()) {
        const h = await tekst(l);
        // tekst i slike lekcije iz H5P sadržaja – ugrađenog u stranicu (matematika) ili preko embed linka
        const naslov = ((h.match(/<title>([^<]*)<\/title>/) || [])[1] || l).replace(/ – .*$/, '').replace(/&#8211;.*$/, '').trim();
        const sadrzaji = [h5pSadrzaj(h5pPodaci(h))];
        for (const f of jedinstveno([...h.matchAll(/src="([^"]*action=h5p_embed[^"]*)"/g)].map((x) => x[1]))) {
          sadrzaji.push(await h5pTekst(f));
        }
        const delovi = [];
        for (const { tekst: t, slike: sl } of sadrzaji) {
          if (!t) continue;
          const imena = [];
          for (const url of sl) {
            const ime = `slike/L${String(rb + 1).padStart(3, '0')}-${String(++brSlika).padStart(4, '0')}${path.extname(url).toLowerCase()}`;
            fs.mkdirSync(path.join(dir, 'slike'), { recursive: true });
            imena.push((await preuzmi(url, path.join(dir, ime))) ? ime : url);
          }
          delovi.push(t.replace(/@SLIKA(\d+)@/g, (_, i) => imena[+i]));
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
      fs.writeFileSync(path.join(dir, 'spisak.json'), JSON.stringify({ udzbenik: k, kurs, lekcija: lekcije.length, strana: ok, slika: brSlika }, null, 1));
      console.log(`  ${ime}: ${lekcije.length} lekcija, ${ok} strana, ${brSlika} slika iz lekcija, ${tekstovi.length} lekcija sa tekstom`);
    }
  }
})();
