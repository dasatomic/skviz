// Gradi kvizovi/takmicenja-razred<N>/kviz.json – „Matematika – takmičenja“ (oblast matematika-takmicenja).
// Zadaci sa školskog, opštinskog, okružnog (gradskog) i državnog takmičenja iz matematike za osnovne škole
// (Društvo matematičara Srbije, https://dms.rs/matematika-osnovne-skole/), poslednjih 10 školskih godina.
// Izvor: alati/takmicenja/<godina>-<nivo>.js. Lobi: razred → nivo → godina (lekcija = jedno takmičenje).
// Posle izmene:  node alati/gradi-takmicenja.js && npm run proveri      (--suvo = samo provera)
const fs = require('fs');
const path = require('path');
const KOREN = path.join(__dirname, '..');
const { NIVOI, KRATKO, zaTakmicenje } = require('./takmicenja/osnova');

const suvo = process.argv.includes('--suvo');
const dir = path.join(__dirname, 'takmicenja');
const sve = [];
const takmicenja = [];
for (const f of fs.readdirSync(dir).filter((x) => /^\d{4}-\d\d-[a-z]+\.js$/.test(x)).sort()) {
  const tak = require(path.join(dir, f));
  if (!NIVOI[tak.nivo]) throw new Error(f + ': nepoznat nivo ' + tak.nivo);
  takmicenja.push(tak);
  tak.zadaci(zaTakmicenje(tak, sve));
}

const REDOSLED_NIVOA = Object.keys(NIVOI);
const ukupno = [];
for (const razred of [5, 6, 7, 8]) {
  const moji = sve.filter((x) => x.razred === razred);
  // lekcije: po nivou (školsko → državno), u nivou najnovija godina prva
  const kljucevi = [...new Set(moji.map((x) => x.nivo + '|' + x.godina))].sort((a, b) => {
    const [na, ga] = a.split('|'), [nb, gb] = b.split('|');
    return REDOSLED_NIVOA.indexOf(na) - REDOSLED_NIVOA.indexOf(nb) || gb.localeCompare(ga);
  });
  const lekcije = kljucevi.map((k) => {
    const [nivo, godina] = k.split('|');
    const tak = takmicenja.find((t) => t.nivo === nivo && t.godina === godina);
    return { naziv: godina, tema: KRATKO[nivo], ...(tak?.datum ? { datum: tak.datum } : {}) };
  });
  const pitanja = moji
    .sort((a, b) => kljucevi.indexOf(a.nivo + '|' + a.godina) - kljucevi.indexOf(b.nivo + '|' + b.godina) || a.broj - b.broj)
    .map((x) => ({ lekcija: kljucevi.indexOf(x.nivo + '|' + x.godina) + 1, ...x.zadatak }));
  const kviz = {
    naziv: `${razred}. razred · Matematika – takmičenja`,
    ikona: '🏆',
    boja: '#d35400',
    opis: 'Pravi zadaci sa školskog, opštinskog, okružnog i državnog takmičenja (Društvo matematičara Srbije), sa detaljnim rešenjima',
    redosled: 12,
    oblast: 'matematika-takmicenja',
    razred,
    zadaci: true,
    uOpstem: false,
    vremeZadatka: 600,
    izborTeme: true,
    naslovTeme: 'Nivo takmičenja',
    naslovLekcije: 'Godina',
    celina: 'Sva takmičenja',
    lekcije,
    pitanja,
  };
  for (const p of kviz.pitanja) require('./mat-zapis').umotajPitanje(p);
  ukupno.push(`${razred}. razred: ${pitanja.length} zadataka, ${lekcije.length} takmičenja`);
  if (suvo || !pitanja.length) continue;
  const izlaz = path.join(KOREN, 'kvizovi', `takmicenja-razred${razred}`);
  fs.mkdirSync(izlaz, { recursive: true });
  fs.writeFileSync(path.join(izlaz, 'kviz.json'), JSON.stringify(kviz, null, 1) + '\n');
}
console.log(ukupno.join('\n'));
