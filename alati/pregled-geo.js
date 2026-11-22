#!/usr/bin/env node
// Pregled crteža (medij „geo“) iz kviz.json kao PNG slike – za proveru bez pregledača.
//
//   node alati/pregled-geo.js kvizovi/razred6-matematika/kviz.json 14        (lekcija 14)
//   node alati/pregled-geo.js kvizovi/razred6-matematika-zadaci/kviz.json 3 --izlaz /tmp/pregled
//
// Za svako pitanje lekcije pravi jednu sliku <izlaz>/L<lekcija>-<nn>.png: tekst pitanja i odgovora,
// crtež uz pitanje, crtež odgovora (medijiOdgovora) i crteže koraka rešenja (poslednji korak sa svim
// elementima). Animacije se ne vide (prikazuje se početno stanje). Treba `rsvg-convert` i `magick`.
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const arg = process.argv.slice(2);
const [fajl, lekcija] = arg.filter((a, i) => !a.startsWith('--') && arg[i - 1] !== '--izlaz');
if (!fajl) { console.error('upotreba: node alati/pregled-geo.js <kviz.json> [lekcija] [--izlaz dir]'); process.exit(1); }
const izlaz = arg.includes('--izlaz') ? arg[arg.indexOf('--izlaz') + 1] : path.join(os.tmpdir(), 'pregled-geo');
fs.mkdirSync(izlaz, { recursive: true });
// font za natpis: prvi koji ImageMagick zna (Arial Unicode na macOS-u, Noto/Liberation na Linuksu)
const FONT = (() => {
  let spisak = '';
  try { spisak = execFileSync('magick', ['-list', 'font'], { encoding: 'utf8' }); } catch { /* bez spiska – ostaje prvi */ }
  return ['Arial-Unicode-MS', 'Noto-Sans-Regular', 'Liberation-Sans', 'DejaVu-Sans'].find((f) => spisak.includes('Font: ' + f + '\n')) || 'Arial-Unicode-MS';
})();

global.window = {};
require(path.join(__dirname, '..', 'public', 'geo.js'));
const { crtajGeo } = window.Geo;

const CSS = `
svg { background: #061440; font-family: Helvetica, Arial, sans-serif; }
.oznaka { fill: #fff; font-size: 15px; font-weight: 800; text-anchor: middle; paint-order: stroke; stroke: #061440; stroke-width: 4px; }
.ime-tacke { fill: #ffc93c; font-size: 16px; font-weight: 900; text-anchor: middle; font-style: italic; paint-order: stroke; stroke: #061440; stroke-width: 4px; }
.ime-ose { fill: #8fa3b8; font-size: 15px; font-weight: 800; font-style: italic; text-anchor: middle; }
.broj { fill: #8fa3b8; font-size: 12px; text-anchor: middle; }
.mreza { stroke: #ffffff22; stroke-width: 1; }
.mreza.osa, .brojevna { stroke: #ffffffaa; stroke-width: 1.6; }
.ist { stroke: #ffc93c !important; stroke-width: 4.5px; }
.lik.ist { fill: #ffc93c; fill-opacity: .35; }
text.ist { fill: #ffc93c; stroke: #061440 !important; stroke-width: 4px !important; font-size: 17px; }
text { fill: #fff; }`;

function png(m, opcije, ime) {
  let svg = crtajGeo(m, opcije);
  svg = svg.replace(/<svg ([^>]*)>/, (x, a) => `<svg ${a}><style>${CSS}</style>`);
  // animacije: ukloni početnu providnost (elementi koji se pojavljuju animacijom)
  svg = svg.replace(/ opacity="0"/g, '').replace(/ data-lat(?!=)/g, ' data-lat=""');
  const f = path.join(izlaz, ime + '.svg');
  fs.writeFileSync(f, svg);
  const p = f.replace(/\.svg$/, '.png');
  execFileSync('rsvg-convert', ['-w', '360', '-b', '#061440', '-o', p, f]);
  return p;
}

const kviz = JSON.parse(fs.readFileSync(fajl, 'utf8'));
const pitanja = kviz.pitanja.filter((p) => !lekcija || p.lekcija === Number(lekcija));
let n = 0;
for (const p of pitanja) {
  n++;
  const ime = `L${p.lekcija}-${String(n).padStart(2, '0')}`;
  const slike = [];
  const tekst = [`[${p.tezina}] ${p.pitanje}`, ...(p.odgovori || []).map((o, i) => (i ? '   ' : ' ✓ ') + o), ...(p.parovi || []).map((x) => ' ' + x.join(' ↔ '))].join('\n');
  try {
    if (p.mediji?.vrsta === 'geo') slike.push(['pitanje', png(p.mediji, {}, ime + '-p')]);
    else if (p.mediji) slike.push(['pitanje: ' + p.mediji.vrsta + (p.mediji.tekst ? ' ' + p.mediji.tekst : ''), null]);
    if (p.medijiOdgovora?.vrsta === 'geo') slike.push(['odgovor', png(p.medijiOdgovora, {}, ime + '-o')]);
    else if (p.medijiOdgovora) slike.push(['odgovor: ' + p.medijiOdgovora.vrsta + (p.medijiOdgovora.tekst ? ' ' + p.medijiOdgovora.tekst : ''), null]);
    if (p.resenje) {
      const osnova = p.resenjeCrtez || (p.mediji?.vrsta === 'geo' ? p.mediji : null);
      p.resenje.forEach((k, i) => {
        if (k.crtez?.vrsta === 'geo') slike.push([`korak ${i + 1}`, png(k.crtez, { korak: i + 1, istakni: k.i }, ime + '-k' + i)]);
      });
      if (osnova) slike.push(['rešenje (kraj)', png(osnova, { korak: p.resenje.length, istakni: p.resenje.at(-1).i }, ime + '-r')]);
    }
  } catch (e) {
    slike.push(['GREŠKA: ' + e.message, null]);
  }
  const delovi = slike.filter((s) => s[1]).flatMap(([natpis, f]) => ['(', f, '+size', '-background', '#061440', '-fill', '#ffc93c', '-pointsize', '16', 'label:' + natpis, '+swap', '-gravity', 'center', '-append', ')']);
  const opis = slike.filter((s) => !s[1]).map((s) => s[0]).join('\n');
  const args = ['-background', '#1b2a5a', '-fill', 'white', '-font', FONT, '-pointsize', '17', '-size', '1100x', 'caption:' + (tekst + (opis ? '\n' + opis : '')).replace(/%/g, '%%')];
  if (delovi.length) args.push('(', ...delovi, '+append', ')', '-gravity', 'west', '-append');
  args.push(path.join(izlaz, ime + '.png'));
  try { execFileSync('magick', args); } catch (e) { console.error(ime, e.message.split('\n')[0]); }
  for (const s of slike) if (s[1]) { fs.rmSync(s[1]); fs.rmSync(s[1].replace(/\.png$/, '.svg')); }
}
console.log(`${n} slika u ${izlaz}`);
