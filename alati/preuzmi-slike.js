#!/usr/bin/env node
// Preuzima glavne (lead) slike sa Wikipedije u folder kviza.
//
// Upotreba:
//   node alati/preuzmi-slike.js <folder-kviza> <ime-fajla> "<Naslov članka>" [jezik] [sirina]
//   node alati/preuzmi-slike.js <folder-kviza> --lista spisak.txt
//
// Spisak (jedna slika po redu):  ime-fajla | Naslov članka | jezik(opciono, en) | sirina(opciono)
// Za fajl sa Commons-a direktno:  ime-fajla | File:Flag_of_Japan.svg
//
// Slike se snimaju u kvizovi/<folder>/slike/<ime-fajla>.jpg|png, a izvor se upisuje u slike/izvori.json
const fs = require('fs');
const path = require('path');

const UA = 'GricKviz/1.0 (porodicni kucni kviz; nekomercijalno)';
const pauza = (ms) => new Promise((r) => setTimeout(r, ms));

// fetch sa ponavljanjem (Wikimedia vraća 429 kad se ide prebrzo)
async function dohvati(url) {
  let greska;
  for (let pokusaj = 0; pokusaj < 5; pokusaj++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (r.status === 429 || r.status >= 500) { greska = new Error(r.status + ' ' + url); await pauza(4000 * (pokusaj + 1)); continue; }
      return r;
    } catch (e) { greska = e; await pauza(3000 * (pokusaj + 1)); }
  }
  throw greska;
}

async function json(url) {
  const r = await dohvati(url);
  if (!r.ok) throw new Error(r.status + ' ' + url);
  return r.json();
}

async function nadjiUrl(naslov, jezik, sirina) {
  if (naslov.startsWith('File:')) {
    const ime = naslov.slice(5);
    return {
      url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(ime)}?width=${sirina}`,
      stranica: `https://commons.wikimedia.org/wiki/${encodeURIComponent(naslov)}`,
    };
  }
  const s = await json(`https://${jezik}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(naslov.replace(/ /g, '_'))}`);
  const orig = s.originalimage;
  const thumb = s.thumbnail;
  if (!orig && !thumb) throw new Error('članak nema glavnu sliku: ' + naslov);
  let url = orig.source;
  // Wikimedia dozvoljava samo standardne širine sličica (250, 330, 500, 960, 1280...)
  if (orig.width > sirina && thumb && thumb.source.includes('/thumb/')) {
    url = thumb.source.replace(/\/\d+px-/, `/${sirina}px-`).replace(/\?.*$/, '');
  }
  return { url, stranica: s.content_urls?.desktop?.page || '' };
}

async function preuzmi(folder, ime, naslov, jezik = 'en', sirina = 960) {
  const dir = path.join(folder, 'slike');
  fs.mkdirSync(dir, { recursive: true });
  const { url, stranica } = await nadjiUrl(naslov, jezik, Number(sirina));
  const r = await dohvati(url);
  if (!r.ok) throw new Error(r.status + ' ' + url);
  const tip = r.headers.get('content-type') || '';
  const ext = tip.includes('png') ? '.png' : tip.includes('svg') ? '.svg' : tip.includes('webp') ? '.webp' : '.jpg';
  const fajl = ime + ext;
  fs.writeFileSync(path.join(dir, fajl), Buffer.from(await r.arrayBuffer()));
  const izvoriF = path.join(dir, 'izvori.json');
  const izvori = fs.existsSync(izvoriF) ? JSON.parse(fs.readFileSync(izvoriF, 'utf8')) : {};
  izvori[fajl] = { izvor: stranica, slika: url };
  fs.writeFileSync(izvoriF, JSON.stringify(izvori, null, 1));
  return fajl;
}

(async () => {
  const [folder, ...ost] = process.argv.slice(2);
  if (!folder || !ost.length) {
    console.log('Upotreba: node alati/preuzmi-slike.js <folder-kviza> <ime> "<Naslov>" [jezik] [sirina]\n         node alati/preuzmi-slike.js <folder-kviza> --lista spisak.txt');
    process.exit(1);
  }
  let poslovi;
  if (ost[0] === '--lista') {
    poslovi = fs.readFileSync(ost[1], 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
      .map((l) => l.split('|').map((x) => x.trim()));
  } else poslovi = [ost];
  let greske = 0;
  for (const [ime, naslov, jezik, sirina] of poslovi) {
    const postoji = fs.existsSync(path.join(folder, 'slike')) &&
      fs.readdirSync(path.join(folder, 'slike')).some((f) => f.replace(/\.[^.]+$/, '') === ime);
    if (postoji) { console.log('· već postoji', ime); continue; }
    try {
      const f = await preuzmi(folder, ime, naslov, jezik || 'en', sirina || 960);
      console.log('✓', f);
    } catch (e) {
      greske++;
      console.log('✗', ime, '-', e.message);
    }
    await pauza(1500);
  }
  process.exit(greske ? 2 : 0);
})();
