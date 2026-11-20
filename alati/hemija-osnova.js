// Zajednički alat za kvizove hemije 8. razreda (teorija i laboratorijske vežbe): zapis pitanja Q/U/S,
// pomoćnici za medije (3D molekuli, atomi, reakcije, laboratorija) i provera pre upisa.
//
//   const { gradi } = require('./hemija-osnova');
//   gradi({ lekcije, folder: 'hemija-8', paket: 'razred8-hemija', kviz: { naziv, … } });
//
// Svaki fajl teme u alati/<folder>/<n>-<tema>.js izvozi funkciju ({ L, Q, U, S, mol, at, jon, kov, R, ph, ps, lab, epr, pri, … }) => { … }.
// Zapis: Q(težina, pitanje, odgovori [prvi je tačan], zanimljivost, pojam, { m: mediji, o: medijiOdgovora })
//        U(težina, pitanje, [uljez, a, b, c], objašnjenje, zanimljivost, pojam, { m, o })
//        S(težina, pitanje, [[levo, desno], …], zanimljivost, pojam, { m, o })
const fs = require('fs');
const path = require('path');
const Molekuli = require('../public/molekuli.js');
const Hemija3D = require('../public/hemija3d.js');
const Lab = require('../public/laboratorija.js');

// ───── pomoćnici za medije ─────
const mol = (ime, o = {}) => { if (!Molekuli.IMENA.includes(ime)) throw new Error('nepoznat molekul: ' + ime); return { vrsta: 'molekul', ime, ...o }; };
const at = (z, o = {}) => ({ vrsta: 'hemija', scena: 'atom', z, ...o });
const jon = (metal, nemetal, o = {}) => ({ vrsta: 'hemija', scena: 'jonska', metal, nemetal, ...o });
const kov = (ime, o = {}) => ({ vrsta: 'hemija', scena: 'kovalentna', ime, ...o });
const met = (o = {}) => ({ vrsta: 'hemija', scena: 'metalna', ...o });
const rast = (tip, o = {}) => ({ vrsta: 'hemija', scena: 'rastvaranje', tip, ...o });
const ph = (o = {}) => ({ vrsta: 'hemija', scena: 'ph', ...o });
const ps = (istakni, o = {}) => ({ vrsta: 'hemija', scena: 'periodni', ...(istakni ? { istakni } : {}), ...o });
// reakcija: R('2vodonik+kiseonik>2voda', { efekat: 'plamen', uslov: 't' })
function R(zapis, o = {}) {
  const strana = (t) => t.split('+').map((x) => { const m = /^(\d+)?(.+)$/.exec(x.trim()); return [m[2], m[1] ? +m[1] : 1]; });
  const [l, d] = zapis.split('>');
  const r = { vrsta: 'hemija', scena: 'reakcija', reaktanti: strana(l), proizvodi: strana(d), ...o };
  const g = Hemija3D.proveriReakciju(r);
  if (g) throw new Error(`reakcija ${zapis}: ${g}`);
  return r;
}
const lab = (scena, o = {}) => { if (!Lab.SCENE.includes(scena)) throw new Error('nepoznata laboratorijska scena: ' + scena); return { vrsta: 'laboratorija', scena, ...o }; };
const epr = (preset, o = {}) => { if (!Lab.PRESETI.includes(preset)) throw new Error('nepoznat preset: ' + preset); return lab('epruvete', { preset, ...o }); };
const pri = (stavke, o = {}) => lab('pribor', { stavke: [].concat(stavke), ...o });
const sl = (src, opis) => ({ vrsta: 'slika', src, ...(opis ? { opis } : {}) });

function gradi({ lekcije, folder, kviz: zaglavlje, paket, minPoLekciji = 15, sufiks }) {
  const pitanja = [];
  const greske = [];
  let lek = 0;
  const L = (naziv) => { lek = lekcije.findIndex((l) => l.naziv === naziv) + 1; if (!lek) throw new Error('Nepoznata lekcija: ' + naziv); };
  const dodaj = (p) => {
    if (!lek) throw new Error('Pitanje pre nego što je izabrana lekcija (L): ' + p.pitanje);
    const g = (t) => greske.push(`${t} — ${p.pitanje.slice(0, 70)}`);
    if (p.vrsta === 'spoji') {
      if (new Set(p.parovi.map((x) => x[0].trim().toLowerCase())).size !== p.parovi.length) g('spoji: ponovljeni levi pojmovi');
      if (new Set(p.parovi.map((x) => x[1].trim().toLowerCase())).size !== p.parovi.length) g('spoji: ponovljeni desni pojmovi');
    } else {
      if (!Array.isArray(p.odgovori) || p.odgovori.length !== 4) g('mora biti tačno 4 odgovora');
      else if (new Set(p.odgovori.map((x) => x.trim().toLowerCase())).size !== 4) g('odgovori moraju biti 4 različita');
    }
    if (!/^[\p{L}-]{3,11}$/u.test(p.rec)) g(`rec „${p.rec}“ mora imati 3–11 slova`);
    // težina: račun i pitanja „zašto“ su teža; osnovne definicije i imena lakša (početna oznaka 2 se doteruje)
    if (p.tezina === 2 && p.vrsta !== 'spoji' && p.vrsta !== 'uljez') {
      if (/(Koliko (grama|molova|mola|iznosi|je maseni)|maseni udeo|Koliki je maseni|Izračunaj)/.test(p.pitanje)) p.tezina = 3;
      else if (/^Zašto/.test(p.pitanje)) p.tezina = 3;
      else if (/^(Šta (je|su) |Koji nastavak|Koja je opšta formula|Koji je najjednostavniji|Koja funkcionalna grupa je karakteristična|Kako se zove|U kojoj grupi|Koji (halogeni|metal|nemetal|element) )/.test(p.pitanje)) p.tezina = 1;
    }
    pitanja.push({ lekcija: lek, ...p });
  };
  const med = (x) => ({ ...(x.m ? { mediji: x.m } : {}), ...(x.o ? { medijiOdgovora: x.o } : {}), ...(x.vreme ? { vreme: x.vreme } : {}) });
  const Q = (tezina, pitanje, odgovori, zanimljivost, rec, x = {}) => dodaj({ tezina, pitanje, ...med(x), odgovori, zanimljivost, rec });
  const U = (tezina, pitanje, odgovori, objasnjenje, zanimljivost, rec, x = {}) => dodaj({ vrsta: 'uljez', tezina, pitanje, ...med(x), odgovori, objasnjenje, zanimljivost, rec });
  const S = (tezina, pitanje, parovi, zanimljivost, rec, x = {}) => dodaj({ vrsta: 'spoji', tezina, pitanje, ...med(x), parovi, zanimljivost, rec });

  const dir = path.join(__dirname, folder);
  const pom = { L, Q, U, S, mol, at, jon, kov, met, rast, ph, ps, R, lab, epr, pri, sl, Molekuli };
  for (const f of fs.readdirSync(dir).filter((x) => /^\d.*\.js$/.test(x)).sort()) require(path.join(dir, f))(pom);

  // ispravke dužina odgovora (opciono: alati/<folder>/duzine.js)
  const duzine = path.join(dir, 'duzine.js');
  if (fs.existsSync(duzine)) {
    const norm = (t) => t.replace(/[^\p{L}]/gu, '').toLowerCase().slice(0, 4);
    for (const [i, odg] of require(duzine)) {
      const p = pitanja[i - 1];
      if (!p || !p.odgovori) { greske.push(`duzine: nema pitanja ${i}`); continue; }
      if (norm(p.odgovori[0]) !== norm(odg[0])) { greske.push(`duzine: ${i} – tačan odgovor se ne poklapa („${p.odgovori[0]}“ / „${odg[0]}“)`); continue; }
      if (new Set(odg).size !== 4) { greske.push(`duzine: ${i} – odgovori nisu različiti`); continue; }
      p.odgovori = odg;
    }
  }
  if (greske.length) { console.log('GREŠKE:\n  ' + greske.join('\n  ')); process.exit(1); }
  // statistika i provera
  const suvo = process.argv.includes('--suvo');
  const poLekciji = lekcije.map((l, i) => pitanja.filter((p) => p.lekcija === i + 1).length);
  const nedovoljno = lekcije.map((l, i) => [l.naziv, poLekciji[i]]).filter(([, n]) => n < minPoLekciji);
  const sMedijem = pitanja.filter((p) => p.mediji || p.medijiOdgovora).length;
  const izvestaj = `${pitanja.length} pitanja, ${lekcije.length} lekcija, sa vizuelizacijom ${sMedijem} (${Math.round((sMedijem / pitanja.length) * 100)}%)`;
  if (nedovoljno.length) console.log('Lekcije sa manje od ' + minPoLekciji + ' pitanja:\n' + nedovoljno.map(([n, k]) => `  ${k}  ${n}`).join('\n'));
  const tezine = [1, 2, 3].map((t) => pitanja.filter((p) => p.tezina === t).length);
  console.log(`${izvestaj} · težine ${tezine.join('/')}`);
  if (suvo) return;
  const kviz = { ...zaglavlje, lekcije: lekcije.map((l) => ({ naziv: l.naziv, tema: l.tema, strana: l.strana })), pitanja };
  const izlaz = process.env.IZLAZ || path.join(__dirname, '..', 'kvizovi', paket, 'kviz.json');
  fs.mkdirSync(path.dirname(izlaz), { recursive: true });
  fs.writeFileSync(izlaz, JSON.stringify(kviz, null, 1) + '\n');
  console.log('Upisano: ' + izlaz);
}
module.exports = { gradi, mol, at, jon, kov, met, rast, ph, ps, R, lab, epr, pri, sl };
