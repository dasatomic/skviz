#!/usr/bin/env node
// Za sve slike u kvizovima proverava autora i licencu na Wikimedia Commons-u i piše SLIKE.md
//   node alati/licence-slika.js
// Slike koje nisu na Commons-u ili nemaju slobodnu licencu su istaknute na vrhu fajla.
const fs = require('fs');
const path = require('path');
const KOREN = path.join(__dirname, '..', 'kvizovi');
const UA = 'GricKviz/1.0 (otvoreni školski kviz; licence slika)';
const pauza = (ms) => new Promise((r) => setTimeout(r, ms));

function nazivDatoteke(url) {
  let m = /\/wikipedia\/commons\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)\//.exec(url) || /\/wikipedia\/commons\/[0-9a-f]\/[0-9a-f]{2}\/([^/?]+)/.exec(url) || /Special:FilePath\/([^?]+)/.exec(url);
  return m ? decodeURIComponent(m[1]) : null;
}
const bezHtml = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

(async () => {
  const slike = [];
  for (const dir of fs.readdirSync(KOREN).sort()) {
    const f = path.join(KOREN, dir, 'slike', 'izvori.json');
    if (!fs.existsSync(f)) continue;
    const izv = JSON.parse(fs.readFileSync(f, 'utf8'));
    for (const [fajl, v] of Object.entries(izv)) slike.push({ paket: dir, fajl, izvor: v.izvor, naziv: nazivDatoteke(v.slika) });
  }
  const nazivi = [...new Set(slike.map((s) => s.naziv).filter(Boolean))];
  const info = {};
  for (let i = 0; i < nazivi.length; i += 40) {
    const deo = nazivi.slice(i, i + 40);
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=' + encodeURIComponent(deo.map((n) => 'File:' + n).join('|'));
    let j;
    for (let p = 0; p < 4 && !j; p++) {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (r.ok) j = await r.json(); else await pauza(3000 * (p + 1));
    }
    if (!j) { console.log('✗ neuspešan upit', i); continue; }
    const norm = Object.fromEntries((j.query.normalized || []).map((n) => [n.to, n.from]));
    for (const pg of Object.values(j.query.pages)) {
      const em = pg.imageinfo?.[0]?.extmetadata;
      const ime = (norm[pg.title] || pg.title).replace(/^File:/, '');
      info[ime.replace(/_/g, ' ')] = em ? { autor: bezHtml(em.Artist?.value), licenca: bezHtml(em.LicenseShortName?.value), besplatna: em.NonFree?.value !== 'true', url: pg.title } : null;
    }
    await pauza(800);
  }
  const redovi = [], problemi = [];
  for (const s of slike) {
    const m = s.naziv ? info[s.naziv.replace(/_/g, ' ')] : null;
    if (!m || !m.licenca || !m.besplatna) problemi.push(s);
    redovi.push(`| ${s.paket} | ${s.fajl} | ${m ? (m.autor || '—').slice(0, 80).replace(/\|/g, '/') : '?'} | ${m ? m.licenca || '?' : '?'} | [izvor](${s.izvor}) |`);
  }
  const md = `# Slike – autori i licence

Slike u \`kvizovi/*/slike/\` preuzete su sa Wikimedia Commons-a / Vikipedije i **zadržavaju svoje izvorne licence**
(najčešće javno vlasništvo, CC BY ili CC BY-SA). Ovaj spisak je generisan alatom \`alati/licence-slika.js\`.
Ako smatrate da neka slika ne bi trebalo da bude ovde, otvorite issue i biće uklonjena.

${problemi.length ? '## ⚠ Proveriti ručno\n\n' + problemi.map((s) => `- ${s.paket}/${s.fajl} – ${s.izvor}`).join('\n') + '\n\n' : ''}## Spisak

| Paket | Fajl | Autor | Licenca | Izvor |
|---|---|---|---|---|
${redovi.join('\n')}
`;
  fs.writeFileSync(path.join(__dirname, '..', 'SLIKE.md'), md);
  console.log(`${slike.length} slika, za ručnu proveru: ${problemi.length}`);
  problemi.forEach((s) => console.log('  ⚠', s.paket, s.fajl));
})();
