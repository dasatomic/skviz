#!/usr/bin/env node
// Lokalni test deploy-a – OBAVEZAN pre svakog punog deploy-a (deploy/objavi.sh ga sam pokreće).
// Na ovom računaru, u privremenom folderu:
//   1. pokrene STARU verziju servera (ono što je sada na serveru) iza malog proksija koji radi kao Caddy (502 dok
//      server ne radi) i u njoj otvori nekoliko soba u raznim fazama igre (lobi, pitanje, otkrivanje, krug reči),
//      sa simuliranim telefonima i jednim pravim pregledačem (headless chromium, ako postoji);
//   2. uradi isti deploy kao deploy/objavi.sh: rsync nove verzije preko stare (isti izuzeci), SIGTERM, pauza, start;
//   3. proveri da su sve sobe preživele: isti igrači i vođa, ista faza, poeni, odgovori, slova, podešavanja, pomeren rok
//      (niko ne gubi sekunde), odgovor poslat dok server nije radio je primljen, telefoni su se sami povezali;
//   4. odigra sve sobe do kraja na novoj verziji i napravi novu sobu.
//
// Upotreba:
//   node alati/test-deploy.js                         stara = poslednji objavljeni commit (refs/skviz/objavljeno,
//                                                     upisuje ga objavi.sh) ili HEAD; nova = HEAD
//   node alati/test-deploy.js --stara <ref> --nova <ref>    ref = commit/grana/tag, ili „radni“ = radni folder
//   node alati/test-deploy.js --nova radni            proba necommitovanih izmena
//   --pauza <ms>        koliko server ne radi između starog i novog (podrazumevano 2500 – sporiji server)
//   --bez-pregledaca    bez chromiuma (samo simulirani telefoni)
//   --tiho              ispisuje samo greške i zaključak (tako ga zove objavi.sh)
//   --zadrzi            ne briše privremeni folder (logovi servera: server-1.log, server-2.log)
// Izlaz: 0 = sobe preživljavaju deploy; 1 = greška (ne objavljivati!);
//        2 = nova verzija namerno ne preuzima sobe (stara verzija ih ne čuva ili je promenjen Soba.FORMAT) –
//            deploy prekida igre u toku, sme samo kad niko ne igra (objavi.sh --kad-niko-ne-igra).
'use strict';
const { spawn, execFileSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const net = require('net');
const crypto = require('crypto');

const argv = process.argv.slice(2);
const arg = (ime, pod) => { const i = argv.indexOf(ime); return i >= 0 && argv[i + 1] ? argv[i + 1] : pod; };
const ima = (ime) => argv.includes(ime);
if (ima('-h') || ima('--pomoc')) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 26).map((r) => r.replace(/^\/\/ ?/, '')).join('\n')); process.exit(0); }

const KOREN = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const git = (...a) => execFileSync('git', a, { cwd: KOREN, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const jeRef = (r) => { try { git('rev-parse', '--verify', '-q', r + '^{commit}'); return true; } catch { return false; } };
const STARA = arg('--stara', jeRef('refs/skviz/objavljeno') ? 'refs/skviz/objavljeno' : 'HEAD');
const NOVA = arg('--nova', 'HEAD');
const PAUZA = +arg('--pauza', 2500);
const TIHO = ima('--tiho');
const spavaj = (ms) => new Promise((ok) => setTimeout(ok, ms));

let TMP, SERVER, NOVI, B, P, URL_P;
const procesi = new Set();
const log = (...a) => { if (!TIHO) console.log(...a); };

// ───── provere ─────
const rezultati = [];
function provera(ok, opis, detalj = '') {
  rezultati.push({ ok: !!ok, opis });
  if (!ok) console.log(`  ✗ ${opis}${detalj ? ` – ${detalj}` : ''}`);
  else log(`  ✓ ${opis}`);
  return !!ok;
}
const isto = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ───── priprema verzija ─────
function izdvoji(ref, dir) {
  fs.mkdirSync(dir, { recursive: true });
  if (ref === 'radni') {
    const fajlovi = execFileSync('git', ['ls-files', '-z', '-co', '--exclude-standard'], { cwd: KOREN, maxBuffer: 1e8 }).toString().split('\0').filter(Boolean);
    for (const f of fajlovi) {
      const iz = path.join(KOREN, f);
      if (!fs.existsSync(iz) || !fs.statSync(iz).isFile()) continue;
      fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
      fs.copyFileSync(iz, path.join(dir, f));
    }
    return 'radni folder (necommitovane izmene)';
  }
  if (!jeRef(ref)) throw new Error(`Nepoznata verzija „${ref}“ (commit, grana, tag ili „radni“)`);
  const c = git('rev-parse', '--verify', ref + '^{commit}');
  execSync(`git archive ${c} | tar -x -C '${dir.replace(/'/g, "'\\''")}'`, { cwd: KOREN, maxBuffer: 1e9 });
  return git('log', '-1', '--format=%h %s', c);
}
const slobodanPort = () => new Promise((ok) => { const s = net.createServer().listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => ok(p)); }); });

// ───── server (kao systemd: NODE_ENV=production, SIGTERM pri restartu) ─────
function pokreniServer(rb) {
  const izlaz = fs.openSync(path.join(TMP, `server-${rb}.log`), 'w');
  const p = spawn(process.execPath, ['server.js'], {
    cwd: SERVER, stdio: ['ignore', izlaz, izlaz],
    env: { PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: 'production', PORT: String(B) },
  });
  procesi.add(p);
  p.on('exit', () => procesi.delete(p));
  return p;
}
async function cekajServer(ms) {
  for (const kraj = Date.now() + ms; Date.now() < kraj; await spavaj(50)) {
    try { if ((await fetch(`http://127.0.0.1:${B}/api/info`)).ok) return true; } catch {}
  }
  return false;
}
const zdravlje = async () => { try { const r = await fetch(`http://127.0.0.1:${B}/api/zdravlje`); return r.ok ? await r.json() : null; } catch { return null; } };
const citajLog = (rb) => { try { return fs.readFileSync(path.join(TMP, `server-${rb}.log`), 'utf8'); } catch { return ''; } };

// ───── proksi kao Caddy: prosleđuje (i SSE bez baferisanja), a dok server ne radi vraća 502 ─────
function proksi() {
  return http.createServer((req, res) => {
    const gore = http.request({
      host: '127.0.0.1', port: B, method: req.method, path: req.url, agent: false,
      headers: { ...req.headers, 'x-forwarded-for': '127.0.0.1', 'x-forwarded-proto': 'http' },
    }, (r) => {
      res.writeHead(r.statusCode, r.headers);
      r.pipe(res);
      r.on('error', () => res.destroy());
      r.on('aborted', () => res.destroy());
    });
    gore.on('error', () => { if (!res.headersSent) { res.writeHead(502, { 'Content-Type': 'text/plain' }); res.end('502 Bad Gateway'); } else res.destroy(); });
    req.pipe(gore);
    res.on('close', () => gore.destroy());
  });
}

// ───── simulirani telefon: ponaša se kao public/app.js (SSE + ponovno povezivanje, akcija sa ponavljanjem,
// osvežavanje stranice kad se promeni verzija klijenta → „udji“ u sačuvanu sobu) ─────
class Telefon {
  constructor(ime, tajni) {
    this.ime = ime;
    this.avatar = '🦊';
    this.tajni = tajni || 'test-' + crypto.randomBytes(12).toString('hex');
    this.V = null; this.primljeno = 0; this.veza = 0; this.osvezavanja = 0;
    this.nestala = false; this.izbacen = false; this.klijent = null; this.zatvoren = false; this.gen = 0;
  }
  async akcija(tip, podaci = {}) {
    const telo = JSON.stringify({ tip, igrac: this.tajni, soba: this.kod, ...podaci });
    for (let i = 0; ; i++) {
      try {
        const r = await fetch(`${URL_P}/api/akcija`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: telo });
        if (r.status >= 502 && r.status <= 504 && i < 5) throw new Error('restart');
        return { status: r.status, ...(await r.json()) };
      } catch { if (i >= 5) return { status: 0, greska: 'nema veze sa serverom' }; await spavaj(800); }
    }
  }
  povezi(kod) {
    this.kod = kod;
    const gen = ++this.gen;
    const jednom = () => {
      if (this.zatvoren || gen !== this.gen) return;
      let gotovo = false;
      const ponovo = () => { if (gotovo) return; gotovo = true; setTimeout(jednom, 1500); };
      const req = http.get(`${URL_P}/api/dogadjaji?soba=${kod}&igrac=${encodeURIComponent(this.tajni)}`, (res) => {
        if (res.statusCode !== 200) {
          res.resume(); gotovo = true;
          if (res.statusCode === 404) { this.nestala = true; return; }
          return setTimeout(jednom, 1500);
        }
        this.veza++;
        let buf = '';
        res.setEncoding('utf8');
        res.on('data', (d) => {
          buf += d;
          for (let i; (i = buf.indexOf('\n\n')) >= 0; buf = buf.slice(i + 2))
            for (const red of buf.slice(0, i).split('\n')) if (red.startsWith('data: ') && gen === this.gen) this.primi(JSON.parse(red.slice(6)));
        });
        res.on('close', ponovo);
        res.on('error', () => {});
      });
      req.on('error', ponovo);
      this.req = req;
    };
    jednom();
  }
  primi(v) {
    if (this.zatvoren) return;
    if (v.klijent) {
      if (this.klijent === null) this.klijent = v.klijent;
      else if (v.klijent !== this.klijent) {
        // „location.reload()“: nova stranica uđe u sačuvanu sobu i poveže se iznova
        this.osvezavanja++; this.klijent = null;
        const gen = ++this.gen; // stara stranica više ne prima ništa
        this.req?.destroy(); this.req = null;
        this.akcija('udji', { ime: this.ime, avatar: this.avatar }).then((r) => {
          if (gen !== this.gen) return;
          if (r.kod) this.povezi(r.kod); else this.nestala = true;
        });
        return;
      }
    }
    if (!v.igraci.some((x) => x.id === v.ja)) this.izbacen = true;
    this.V = v; this.primljeno = Date.now();
  }
  async cekaj(uslov, ms, opis) {
    for (const kraj = Date.now() + ms; Date.now() < kraj; await spavaj(40)) { try { if (this.V && uslov(this.V)) return this.V; } catch {} }
    throw new Error(`${this.ime}: ${opis} (faza: ${this.V?.faza})`);
  }
  zatvori() { this.zatvoren = true; this.req?.destroy(); }
}

// ───── pravi pregledač (headless chromium preko DevTools protokola) – proverava i public/app.js ─────
async function otvoriPregledac() {
  if (ima('--bez-pregledaca') || typeof WebSocket !== 'function') return null;
  const bin = process.env.CHROMIUM || ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable']
    .find((b) => { try { execFileSync('which', [b], { stdio: 'ignore' }); return true; } catch { return false; } });
  if (!bin) return null;
  const dir = path.join(TMP, 'chromium');
  const proc = spawn(bin, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--no-first-run',
    '--no-default-browser-check', '--mute-audio', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  procesi.add(proc);
  let port;
  for (let i = 0; i < 100 && !port; i++) { await spavaj(100); try { port = fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch {} }
  if (!port) { proc.kill(); return null; }
  const strana = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
  const ws = new WebSocket(strana.webSocketDebuggerUrl);
  await new Promise((ok, ne) => { ws.onopen = ok; ws.onerror = ne; });
  const b = { ucitavanja: 0, greske: [] };
  const cekaju = new Map();
  let id = 0;
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && cekaju.has(m.id)) { cekaju.get(m.id)(m); cekaju.delete(m.id); }
    else if (m.method === 'Page.loadEventFired') b.ucitavanja++;
    else if (m.method === 'Runtime.exceptionThrown') { const d = m.params.exceptionDetails; b.greske.push(d?.exception?.description || d?.text); }
  };
  b.posalji = (method, params = {}) => new Promise((ok) => { const i = ++id; cekaju.set(i, ok); ws.send(JSON.stringify({ id: i, method, params })); });
  b.izracunaj = async (izraz) => (await b.posalji('Runtime.evaluate', { expression: izraz, returnByValue: true })).result?.result?.value;
  b.stanje = () => b.izracunaj(`(() => { try { return { faza: V && V.faza, kod: V && V.kod, verzija: V && V.verzija, sada: V && V.sada, u: !!(V && V.igraci.some((x) => x.id === V.ja)), nacin, rs: izvor && izvor.readyState }; } catch (e) { return { greska: String(e) }; } })()`);
  b.cekaj = async (uslov, ms, opis) => {
    let s;
    for (const kraj = Date.now() + ms; Date.now() < kraj; await spavaj(100)) { s = await b.stanje(); if (s && uslov(s)) return s; }
    throw new Error(`pregledač: ${opis} (${JSON.stringify(s)})`);
  };
  b.ucitaj = async (fn) => { const n = b.ucitavanja; await fn(); for (let i = 0; i < 200 && b.ucitavanja === n; i++) await spavaj(50); };
  b.zatvori = () => { try { ws.close(); } catch {} proc.kill(); };
  await b.posalji('Page.enable');
  await b.posalji('Runtime.enable');
  return b;
}

// ───── igra ─────
const odgovorZa = (V) => (V.pitanje.vrsta === 'spoji' ? V.pitanje.levo.map((_, i) => i) : 0);

async function napraviSobu(imena, podesavanja, vodja) {
  const igraci = [vodja || new Telefon(imena[0]), ...imena.slice(1).map((i) => new Telefon(i))];
  const r = await igraci[0].akcija('nova-soba', { ime: igraci[0].ime, avatar: igraci[0].avatar });
  if (!r.kod) throw new Error('Nova soba nije napravljena: ' + JSON.stringify(r));
  for (const ig of igraci.slice(1)) { ig.kod = r.kod; await ig.akcija('udji', { ime: ig.ime, avatar: ig.avatar }); }
  for (const ig of igraci) ig.povezi(r.kod);
  const s = { kod: r.kod, igraci, vodja: igraci[0] };
  if (podesavanja) await s.vodja.akcija('podesavanja', { podesavanja });
  await Promise.all(igraci.map((ig) => ig.cekaj((V) => V.igraci.length === igraci.length && (!podesavanja || Object.entries(podesavanja).every(([k, v]) => V.podesavanja[k] === v)), 5000, 'ulazak u sobu')));
  return s;
}
async function dalje(s, faza) {
  const pre = s.vodja.V.verzija;
  await s.vodja.akcija('dalje', { faza });
  await s.vodja.cekaj((V) => V.verzija > pre && V.faza !== faza, 8000, `posle „Dalje“ iz faze ${faza}`);
}
async function pokreni(s) {
  const r = await s.vodja.akcija('pokreni');
  if (r.greska) throw new Error('Pokreni: ' + r.greska);
  await s.vodja.cekaj((V) => V.faza === 'uvod', 5000, 'uvod posle „Pokreni“');
  await dalje(s, 'uvod');
}
async function odgovori(ig) {
  const V = await ig.cekaj((V) => V.faza === 'pitanje', 5000, 'pitanje');
  await ig.akcija('odgovor', { izbor: odgovorZa(V) });
  await ig.cekaj((V) => V.mojOdgovor !== null, 5000, 'odgovor primljen');
}
// igra do kraja: odgovara, završava krug reči i pritiska „Dalje“
async function odigrajDoKraja(s, ms = 120000) {
  for (const kraj = Date.now() + ms; ;) {
    const V = s.vodja.V;
    if (V.faza === 'kraj') return;
    if (Date.now() > kraj) throw new Error(`soba ${s.kod} nije stigla do kraja (faza ${V.faza})`);
    if (V.faza === 'pitanje') {
      for (const ig of s.igraci) if (ig.V?.faza === 'pitanje' && ig.V.mojOdgovor === null) await ig.akcija('odgovor', { izbor: odgovorZa(ig.V) });
    } else if (V.faza === 'reci') {
      for (const ig of s.igraci) if (!V.reci.gotovi.includes(ig.V?.ja)) await ig.akcija('gotov');
    } else if (V.faza === 'lobi') await s.vodja.akcija('pokreni');
    else await s.vodja.akcija('dalje', { faza: V.faza });
    await s.vodja.cekaj((v) => v.verzija > V.verzija, 15000, `promena u fazi ${V.faza}`);
  }
}
// sažetak sobe za poređenje pre/posle deploy-a
const sazetak = (V) => ({
  faza: V.faza, domacin: V.domacin, podesavanja: V.podesavanja, krug: V.krug, krugovi: V.krugovi,
  igraci: V.igraci.map((x) => [x.id, x.ime, x.poeni, x.niz]),
  pitanje: V.pitanje && { rb: V.pitanje.rb, tekst: V.pitanje.tekst, odgovori: V.pitanje.odgovori || V.pitanje.levo, tacan: V.pitanje.tacan },
  odgovorili: V.odgovorili, dobitak: V.dobitak,
  reci: V.reci && { slova: V.reci.slova, rb: V.reci.rb, moji: V.reci.moji },
});

// ───── test ─────
async function test() {
  TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'skviz-test-deploy-'));
  SERVER = path.join(TMP, 'server'); // kao /opt/gric-kviz
  NOVI = path.join(TMP, 'nova');
  const opisStare = izdvoji(STARA, SERVER), opisNove = izdvoji(NOVA, NOVI);
  console.log(`Test deploy-a: ${opisStare}  →  ${opisNove}`);
  const izuzeci = path.join(NOVI, 'deploy', 'izuzeci-rsync.txt');
  if (!fs.existsSync(izuzeci)) throw new Error('Nova verzija nema deploy/izuzeci-rsync.txt');
  const formatNove = +(fs.readFileSync(path.join(NOVI, 'lib', 'soba.js'), 'utf8').match(/Soba\.FORMAT\s*=\s*(\d+)/) || [])[1] || null;

  B = await slobodanPort(); P = await slobodanPort(); URL_P = `http://127.0.0.1:${P}`;
  const px = proksi().listen(P, '127.0.0.1');
  let srv = pokreniServer(1);
  if (!(await cekajServer(20000))) throw new Error('Stara verzija servera se nije pokrenula:\n' + citajLog(1));

  // ── sobe na staroj verziji ──
  log('\nSobe na staroj verziji:');
  // A: usred pitanja, dvoje odgovorilo, treći odgovara baš dok server ne radi
  const A = await napraviSobu(['Ana', 'Bora', 'Cica'], { brojPitanja: 5, vreme: 60, krugovi: 'oba', brojReci: 1 });
  await pokreni(A);
  await odgovori(A.igraci[0]); await odgovori(A.igraci[1]);
  // B: krug reči, jedna reč već poslata
  const Bs = await napraviSobu(['Dule', 'Ema'], { krugovi: 'reci', brojReci: 3, vremeReci: 90 });
  await pokreni(Bs);
  await Bs.igraci[0].akcija('rec', { indeksi: [0, 1, 2] });
  await Bs.igraci[0].cekaj((V) => V.reci.moji.length === 1, 5000, 'reč primljena');
  // C: lobi sa podešavanjima
  const C = await napraviSobu(['Fića', 'Gaga'], { brojPitanja: 10, vreme: 30, krugovi: 'pitanja', pismo: 'latinica' });
  // D: otkrivanje drugog pitanja (poeni, tačan odgovor, raspodela)
  const D = await napraviSobu(['Hana', 'Ivan'], { krugovi: 'pitanja', brojPitanja: 5, vreme: 60 });
  await pokreni(D);
  for (let k = 0; k < 2; k++) {
    await Promise.all(D.igraci.map(odgovori));
    await D.vodja.cekaj((V) => V.faza === 'otkrivanje', 5000, 'otkrivanje');
    if (k === 0) await dalje(D, 'otkrivanje');
  }
  // E: pravi pregledač (vođa) + telefon, usred pitanja
  let br = null, E = null;
  try { br = await otvoriPregledac(); } catch (e) { log('  (pregledač nije pokrenut: ' + e.message + ')'); }
  if (br) {
    const vodjaE = new Telefon('Pregledač');
    E = await napraviSobu(['Pregledač', 'Jova'], { brojPitanja: 5, vreme: 60, krugovi: 'oba', brojReci: 1 }, vodjaE);
    await br.ucitaj(() => br.posalji('Page.navigate', { url: URL_P + '/' }));
    await br.izracunaj(`localStorage.setItem('ja', ${JSON.stringify(JSON.stringify({ id: vodjaE.tajni, ime: 'Pregledač', avatar: '🤖' }))}); localStorage.setItem('soba', ${JSON.stringify(JSON.stringify(E.kod))})`);
    await br.ucitaj(() => br.posalji('Page.reload'));
    await br.cekaj((s) => s.kod === E.kod && s.u, 8000, 'pregledač je ušao u sobu');
    await pokreni(E);
    await odgovori(E.igraci[1]);
    await br.cekaj((s) => s.faza === 'pitanje', 5000, 'pregledač vidi pitanje');
    provera((await br.stanje()).nacin === 'sse', 'pregledač je na SSE vezi');
  } else log('  (bez pravog pregledača – nema chromiuma ili je zadato --bez-pregledaca)');

  const sobe = [['A (pitanje)', A], ['B (krug reči)', Bs], ['C (lobi)', C], ['D (otkrivanje)', D], ...(E ? [['E (pregledač)', E]] : [])];
  const telefoni = sobe.flatMap(([, s]) => s.igraci);
  const pre = new Map(sobe.map(([, s]) => [s, { sazetak: sazetak(s.vodja.V), V: s.vodja.V, moji: s.igraci.map((ig) => ig.V.reci?.moji || null), ja: s.igraci.map((ig) => ig.V.ja) }]));
  const klijentPre = A.vodja.V.klijent;
  const ucitavanjaPre = br?.ucitavanja;
  log(`  ${sobe.length} soba, ${telefoni.length} igrača`);

  // ── deploy, kao deploy/objavi.sh ──
  log('\nDeploy:');
  const kljuc = () => { try { return fs.readFileSync(path.join(SERVER, 'podaci', 'kljuc-id'), 'utf8'); } catch { return null; } };
  const kljucPre = kljuc();
  execFileSync('rsync', ['-a', '--checksum', '--delete', '--delay-updates', `--exclude-from=${izuzeci}`, NOVI + '/', SERVER + '/']);
  if (kljucPre) provera(kljuc() === kljucPre, 'rsync nije dirao ključ za id-jeve igrača (podaci/kljuc-id)');
  provera(await cekajServer(2000), 'stari server radi i posle rsync-a');
  const tGasenje = Date.now();
  srv.kill('SIGTERM');
  const kod = await new Promise((ok) => { const t = setTimeout(() => ok('visi'), 10000); srv.on('exit', (c, sig) => { clearTimeout(t); ok(c ?? sig); }); });
  provera(kod === 0 || kod === 'SIGTERM', 'stari server se ugasio na SIGTERM', String(kod));
  if (kod === 'visi') srv.kill('SIGKILL');
  let sacuvano = null;
  try { sacuvano = JSON.parse(fs.readFileSync(path.join(SERVER, 'podaci', 'sobe.json'), 'utf8')); } catch {}
  // Cica odgovara dok server ne radi – telefon ponavlja zahtev dok novi server ne proradi
  const odgovorCice = A.igraci[2].akcija('odgovor', { izbor: odgovorZa(A.igraci[2].V) });
  await spavaj(PAUZA);
  srv = pokreniServer(2);
  const radi = await cekajServer(20000);
  const tRadi = Date.now();
  if (!provera(radi, 'nova verzija se pokrenula')) { console.log(citajLog(2)); return 1; }
  log(`  server nije radio ${tRadi - tGasenje} ms (od toga namerna pauza ${PAUZA} ms)`);

  // ── stara verzija ne čuva sobe, ili je promenjen format → deploy namerno prekida sobe ──
  let razlog = null;
  const z = await zdravlje();
  if (!sacuvano) razlog = `stara verzija (${opisStare}) ne čuva sobe pri gašenju`;
  else if (sacuvano.format !== formatNove && !z?.vraceno) razlog = `promenjen je format stanja sobe (Soba.FORMAT ${sacuvano.format} → ${formatNove}), a nema migracije (Soba.MIGRACIJE[${sacuvano.format}] u lib/soba.js)`;
  else if (sacuvano.format !== formatNove) log(`  format stanja ${sacuvano.format} → ${formatNove}: sobe prevedene migracijom`);
  if (razlog) {
    // i tada nova verzija mora da radi: nova soba, partija do kraja
    const N = await napraviSobu(['Kaća', 'Laza'], { brojPitanja: 5, krugovi: 'oba', brojReci: 1 });
    await odigrajDoKraja(N);
    provera(true, 'nova soba na novoj verziji – partija do kraja');
    telefoni.concat(N.igraci).forEach((t) => t.zatvori());
    br?.zatvori(); px.close(); srv.kill('SIGTERM');
    console.log(`\n⚠ Ovaj deploy PREKIDA sobe u toku: ${razlog}.`);
    console.log('  Objavljivati samo kad niko ne igra: ./deploy/objavi.sh <server> --kad-niko-ne-igra  (ili PREKINI_SOBE=1)');
    return rezultati.every((r) => r.ok) ? 2 : 1;
  }

  // ── sobe posle deploy-a ──
  log('\nPosle deploy-a:');
  provera(z && z.vraceno === sobe.length, `novi server je vratio svih ${sobe.length} soba`, `vraćeno: ${z?.vraceno}`);
  const stajao = +(citajLog(2).match(/server je stajao (\d+) ms/) || [])[1];
  try {
    // V.sada = kad je server poslao stanje; sve posle gašenja starog servera moglo je da stigne samo od novog
    await Promise.all(telefoni.map((t) => t.cekaj((V) => V.sada > tGasenje, 10000, 'nije se ponovo povezao posle deploy-a')));
    provera(true, `svi telefoni su se sami ponovo povezali (${telefoni.length})`);
  } catch (e) { provera(false, 'svi telefoni su se sami ponovo povezali', e.message); }
  provera(!telefoni.some((t) => t.nestala), 'nijedan telefon nije dobio „Soba više ne postoji“');
  provera(!telefoni.some((t) => t.izbacen), 'nijedan igrač nije izgubljen iz sobe');
  const klijentPosle = A.vodja.V.klijent;
  const osvezeni = telefoni.filter((t) => t.osvezavanja).length;
  log(`  verzija klijenta ${klijentPre === klijentPosle ? 'ista – stranice se ne osvežavaju' : `promenjena – osveženo telefona: ${osvezeni}/${telefoni.length}`}`);
  if (klijentPre !== klijentPosle) provera(osvezeni === telefoni.length, 'promenjen klijent → svi telefoni su osvežili stranicu i vratili se u sobu');

  for (const [ime, s] of sobe) {
    const p = pre.get(s);
    const V = s.vodja.V;
    const sad = sazetak(V);
    // A je u međuvremenu (Cicin odgovor) prešla u otkrivanje – njeno pitanje se proverava posebno ispod
    const istiIgraci = isto(sad.igraci.map((x) => x[0]), p.sazetak.igraci.map((x) => x[0]));
    const poredi = s === A ? { ...p.sazetak, faza: sad.faza, odgovorili: sad.odgovorili, dobitak: sad.dobitak, pitanje: { ...p.sazetak.pitanje, tacan: sad.pitanje?.tacan }, igraci: istiIgraci ? sad.igraci : p.sazetak.igraci } : p.sazetak;
    provera(isto(sad, poredi), `${ime}: stanje sobe je isto kao pre deploy-a`, isto(sad, poredi) ? '' : `\n      pre:   ${JSON.stringify(poredi).slice(0, 400)}\n      posle: ${JSON.stringify(sad).slice(0, 400)}`);
    provera(isto(s.igraci.map((ig) => ig.V.ja), p.ja), `${ime}: telefoni su prepoznati kao isti igrači (javni id)`);
    provera(isto(s.igraci.map((ig) => ig.V.reci?.moji || null), p.moji), `${ime}: svaki igrač vidi svoje poslate reči`);
    if (['pitanje', 'reci'].includes(p.V.faza) && s !== A) {
      // preostalo vreme: koliko je bilo pre, minus vreme koje je server RADIO (pauza se ne računa)
      const ocekivano = p.V.rokDo - p.V.sada - (V.sada - p.V.sada - stajao);
      const stvarno = V.rokDo - V.sada;
      provera(Math.abs(stvarno - ocekivano) < 1000, `${ime}: rok je pomeren za pauzu (niko ne gubi sekunde)`, `preostalo ${stvarno} ms, očekivano ~${ocekivano} ms (pauza ${stajao} ms)`);
    }
  }
  // A: Cicin odgovor poslat dok server nije radio
  const rc = await odgovorCice;
  provera(rc.ok, 'A: odgovor poslat dok server nije radio je primljen (telefon je ponovio zahtev)', JSON.stringify(rc));
  try {
    const V = await A.vodja.cekaj((V) => V.faza === 'otkrivanje', 5000, 'otkrivanje posle Cicinog odgovora');
    provera(A.igraci.every((ig) => V.dobitak[ig.V.ja] && !V.dobitak[ig.V.ja].bez), 'A: sva tri odgovora se računaju (i onaj iz pauze)');
  } catch (e) { provera(false, 'A: posle trećeg odgovora sledi otkrivanje', e.message); }
  if (br) {
    try {
      // stanje mora da stigne od NOVOG servera (V.sada = vreme slanja), a ne da ostane ono od pre deploy-a
      if (klijentPre !== klijentPosle) {
        for (let i = 0; i < 200 && br.ucitavanja === ucitavanjaPre; i++) await spavaj(50);
        provera(br.ucitavanja > ucitavanjaPre, 'pregledač: osvežio je stranicu (nov klijent)');
      }
      const s = await br.cekaj((s) => s.sada > tGasenje && s.kod === E.kod && s.u && s.faza === 'pitanje', 10000, 'stanje od novog servera');
      provera(s.nacin === 'sse', 'pregledač: sam se ponovo povezao na novi server, ista soba i faza, i dalje SSE (nije pao na long-polling)', JSON.stringify(s));
      if (klijentPre === klijentPosle) provera(br.ucitavanja === ucitavanjaPre, 'pregledač: stranica nije osvežavana (klijent isti)');
    } catch (e) { provera(false, 'pregledač: sam se ponovo povezao na novi server', e.message); }
  }

  // ── igra se nastavlja na novoj verziji ──
  log('\nIgra dalje na novoj verziji:');
  for (const [ime, s] of sobe) {
    try { await odigrajDoKraja(s); provera(true, `${ime}: partija odigrana do kraja`); }
    catch (e) { provera(false, `${ime}: partija do kraja`, e.message); }
  }
  if (br) {
    try { await br.cekaj((s) => s.faza === 'kraj', 8000, 'kraj'); provera(true, 'pregledač: prikazuje kraj partije'); }
    catch (e) { provera(false, 'pregledač: prikazuje kraj partije', e.message); }
    provera(!br.greske.length, 'pregledač: bez JavaScript grešaka', br.greske.slice(0, 3).join(' | '));
  }
  try {
    const N = await napraviSobu(['Kaća', 'Laza'], { brojPitanja: 5, krugovi: 'oba', brojReci: 1 });
    await odigrajDoKraja(N);
    provera(true, 'nova soba na novoj verziji – partija do kraja');
    N.igraci.forEach((t) => t.zatvori());
  } catch (e) { provera(false, 'nova soba na novoj verziji', e.message); }
  const greske = (citajLog(1) + citajLog(2)).split('\n').filter((r) => /Greška u zahtevu|Neuhvaćena|Neobrađeno|nije vraćena|nisu sačuvane/.test(r));
  provera(!greske.length, 'u logovima servera nema grešaka', greske.slice(0, 5).join('\n      '));

  telefoni.forEach((t) => t.zatvori());
  br?.zatvori();
  px.close();
  srv.kill('SIGTERM');
  return rezultati.every((r) => r.ok) ? 0 : 1;
}

let izlaz = 1;
const rok = setTimeout(() => { console.log('✗ Test traje predugo (preko 5 min) – prekidam.'); kraj(1); }, 5 * 60e3);
async function kraj(k) {
  clearTimeout(rok);
  // sačekaj da se serveri i chromium zaista ugase (inače još pišu u privremeni folder dok se briše)
  await Promise.all([...procesi].map((p) => new Promise((ok) => { if (p.exitCode !== null || p.signalCode) return ok(); p.once('exit', ok); try { p.kill('SIGKILL'); } catch { ok(); } setTimeout(ok, 3000); })));
  const zadrzi = ima('--zadrzi') || k === 1;
  if (TMP) {
    if (zadrzi) console.log(`Privremeni folder (logovi servera): ${TMP}`);
    else try { fs.rmSync(TMP, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch (e) { console.log(`(privremeni folder ${TMP} nije obrisan: ${e.code})`); }
  }
  const prolaz = rezultati.filter((r) => r.ok).length;
  if (k === 0) console.log(`\n✓ Test deploy-a prošao (${prolaz}/${rezultati.length} provera): sobe u toku preživljavaju deploy.`);
  else if (k === 1) console.log(`\n✗ Test deploy-a NIJE prošao (${rezultati.length - prolaz} od ${rezultati.length} provera palo). Ne objavljivati.`);
  process.exit(k);
}
test().then((k) => kraj(k), (e) => { console.log('✗ ' + (e.stack || e.message)); kraj(1); });
