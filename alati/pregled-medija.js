#!/usr/bin/env node
// Pregled pitanja sa medijima (sve vrste: fizika, geo, formula, svg, atom…) kao PNG – Chrome headless.
//
//   node alati/pregled-medija.js kvizovi/razred7-fizika/kviz.json 5           (lekcija 5)
//   node alati/pregled-medija.js kvizovi/razred7-fizika/kviz.json 5 --vreme 4000 --izlaz /tmp/pf
//   node alati/pregled-medija.js kvizovi/razred7-fizika/kviz.json 5 --od 3 --do 8   (samo pitanja 3–8 lekcije)
//
// Pravi stranice <izlaz>/L<lekcija>-<n>.png sa po 6 pitanja: tekst pitanja (✓ tačan odgovor),
// medij uz pitanje i medij odgovora. Animacije se vide u trenutku `--vreme` ms od početka (podrazumevano 3000; scena sa
// trajanjem T se posle T + pauza vrti iz početka – za kraj animacije daj vreme malo veće od T).
// Treba Google Chrome (macOS) ili `CHROME=/putanja/do/chrome`.
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const arg = process.argv.slice(2);
const opc = (ime, pod) => (arg.includes(ime) ? arg[arg.indexOf(ime) + 1] : pod);
const slobodni = arg.filter((a, i) => !a.startsWith('--') && !(arg[i - 1] || '').startsWith('--'));
const [fajl, lekcija] = slobodni;
if (!fajl) { console.error('upotreba: node alati/pregled-medija.js <kviz.json> [lekcija] [--od n] [--do n] [--vreme ms] [--izlaz dir]'); process.exit(1); }
const izlaz = path.resolve(opc('--izlaz', path.join(os.tmpdir(), 'pregled-medija')));
const vreme = Number(opc('--vreme', 3000));
const od = Number(opc('--od', 1));
const doN = Number(opc('--do', 1e9));
const NA_STRANI = 6;
fs.mkdirSync(izlaz, { recursive: true });

const CHROME = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('Nema Chrome-a (postavi CHROME=…)'); process.exit(1); }

const kviz = JSON.parse(fs.readFileSync(fajl, 'utf8'));
const sva = kviz.pitanja.map((p, i) => ({ ...p, _i: i }));
const lek = sva.filter((p) => !lekcija || p.lekcija === Number(lekcija));
const izbor = lek.slice(od - 1, doN);
const pub = path.join(__dirname, '..', 'public');
const paket = path.relative(pub, path.dirname(path.resolve(fajl)));

const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
let strana = 0;
for (let s = 0; s < izbor.length; s += NA_STRANI) {
  strana++;
  const deo = izbor.slice(s, s + NA_STRANI);
  const podaci = deo.map((p, j) => ({
    br: od + s + j,
    naslov: `#${p._i} [${p.tezina}] ${p.pitanje}`,
    odgovori: p.odgovori || (p.parovi || []).map((x) => x.join(' ↔ ')),
    mediji: p.mediji || null,
    odg: p.medijiOdgovora || null,
    zan: p.zanimljivost || p.objasnjenje || '',
  }));
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="file://${pub}/style.css">
<style>body{background:#061440;color:#fff;font-family:Helvetica,Arial,sans-serif;margin:0;padding:8px;width:1500px}
.kartica{display:inline-block;vertical-align:top;width:480px;margin:4px;background:#0d1f4a;border-radius:10px;padding:8px;box-sizing:border-box}
.n{font-size:14px;font-weight:700;margin-bottom:4px}.o{font-size:12px;color:#bcd}.o b{color:#7f7}
.z{font-size:11px;color:#9ab;margin-top:4px}.lab{font-size:11px;color:#fc6;margin-top:4px}
*{animation:none!important;transition:none!important}.medij-fizika svg,.medij-svg svg{max-height:320px!important}</style>
<base href="file://${path.dirname(path.resolve(fajl))}/"></head><body>
<script>// animacije: prvi kadrovi u t = 0, zatim stalno kadar u trenutku VREME (scena „zaleđena“ u tom trenutku)
const T0=performance.now();window.requestAnimationFrame=cb=>setTimeout(()=>cb(performance.now()-T0<300?0:${vreme}),40);</script>
<script src="file://${pub}/geo.js"></script><script src="file://${pub}/fizika.js"></script><script src="file://${pub}/biologija.js"></script>
<script src="file://${pub}/istorija.js"></script><script src="file://${pub}/mediji.js"></script><script src="file://${pub}/molekuli.js"></script>
<script src="file://${pub}/hemija3d.js"></script><script src="file://${pub}/laboratorija.js"></script>
<script>
const P=${JSON.stringify(podaci)};
const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
for(const p of P){const d=document.createElement('div');d.className='kartica';
d.innerHTML='<div class="n">'+esc(p.naslov)+'</div><div class="o">'+p.odgovori.map((o,i)=>i?esc(o):'<b>✓ '+esc(o)+'</b>').join(' · ')+'</div>';
document.body.appendChild(d);
for(const [lab,m] of [['uz pitanje',p.mediji],['uz odgovor',p.odg]]){if(!m)continue;
 for(const x of [].concat(m)){const l=document.createElement('div');l.className='lab';l.textContent=lab+': '+x.vrsta+(x.scena?' / '+x.scena:'')+(x.tip?' / '+x.tip:'');d.appendChild(l);
 const k=document.createElement('div');d.appendChild(k);try{Mediji.prikaziMedij(k,x,{auto:true,paket:${JSON.stringify(paket)}})}catch(e){k.textContent='GREŠKA: '+e.message}}}
const z=document.createElement('div');z.className='z';z.textContent=p.zan;d.appendChild(z);}
window.onerror=(m)=>{document.body.insertAdjacentHTML('afterbegin','<div style="color:red">'+esc(m)+'</div>')};
</script></body></html>`;
  const f = path.join(izlaz, `L${lekcija || 'sve'}-${strana}.html`);
  fs.writeFileSync(f, html);
  const png = f.replace(/\.html$/, '.png');
  const visina = Math.ceil(deo.length / 3) * 620 + 40;
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', `--window-size=1516,${visina}`,
    '--virtual-time-budget=1500', `--screenshot=${png}`, 'file://' + f], { stdio: 'ignore', timeout: 60000 });
  console.log(png);
}
if (!izbor.length) console.log('Nema pitanja.');
