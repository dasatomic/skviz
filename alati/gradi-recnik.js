#!/usr/bin/env node
// Gradi rečnik za krug „Najduža reč“:
//   podaci/hunspell/sr.dic + sr.aff – Hunspell rečnik srpskog jezika (LibreOffice, Milutin Smiljanić, LGPL 3+)
//   podaci/ucestalost.txt          – osnovni oblici (i vlastita imena) poređani po učestalosti u titlovima
//                                    (FrequencyWords, OpenSubtitles 2018, MIT); promenjeni oblici se svode na osnovu
// Upotreba: node alati/gradi-recnik.js            (preuzima sve iznova)
//           node alati/gradi-recnik.js --ucestalost (samo ponovo računa učestalost iz postojećeg Hunspella)
const fs = require('fs');
const path = require('path');

const PODACI = path.join(__dirname, '..', 'podaci');
const HUNSPELL = path.join(PODACI, 'hunspell');
const IZVORI = {
  'sr.dic': 'https://raw.githubusercontent.com/LibreOffice/dictionaries/master/sr/sr.dic',
  'sr.aff': 'https://raw.githubusercontent.com/LibreOffice/dictionaries/master/sr/sr.aff',
  'README.txt': 'https://raw.githubusercontent.com/LibreOffice/dictionaries/master/sr/README.txt',
};
const TITLOVI = 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/sr/sr_50k.txt';

async function preuzmi(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.text();
}

(async () => {
  if (!process.argv.includes('--ucestalost')) {
    fs.mkdirSync(HUNSPELL, { recursive: true });
    for (const [f, url] of Object.entries(IZVORI)) {
      fs.writeFileSync(path.join(HUNSPELL, f), await preuzmi(url));
      console.log('✓', f);
    }
  }
  const recnik = require('../lib/recnik');
  console.log('osnova u rečniku:', recnik.ucitaj());

  // titlovi su i latinicom i ćirilicom; svaku reč svodimo na osnovni oblik (кућама → кућа) i pamtimo prvo javljanje
  const redosled = new Map();
  for (const l of (await preuzmi(TITLOVI)).split('\n')) {
    const r = recnik.uCirilicu(l.split(' ')[0] || '');
    if (!r || r.length < 2) continue;
    const o = recnik.postoji(r) ? r : recnik.osnovniOblik(r);
    if (o && recnik.postoji(o) && !redosled.has(o)) redosled.set(o, redosled.size);
  }
  fs.writeFileSync(path.join(PODACI, 'ucestalost.txt'), [...redosled.keys()].join('\n') + '\n');
  console.log('✓ ucestalost.txt:', redosled.size, 'reči');
})().catch((e) => { console.error(e.message); process.exit(1); });
