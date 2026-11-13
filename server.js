#!/usr/bin/env node
// Skviz – kućni kviz za igru preko telefona u kućnoj mreži.
// Pokretanje:  node server.js   (ili: npm start)   – port se menja sa PORT=8080 node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const kvizovi = require('./lib/kvizovi');
const recnik = require('./lib/recnik');
const statistika = require('./lib/statistika');
const Soba = require('./lib/soba');
const predlozi = require('./lib/predlozi');
const telemetrija = require('./lib/telemetrija');
const upisi = require('./lib/upis');

const PORT = +process.env.PORT || 3000;
const JAVNO = path.join(__dirname, 'public');
const KVIZOVI = path.join(__dirname, 'kvizovi');
const PODACI = path.join(__dirname, 'podaci');
const SOBE_DAT = path.join(PODACI, 'sobe.json'); // sobe sačuvane pri gašenju (deploy), vraćaju se pri pokretanju
const MAKS_PAUZA = 10 * 60e3; // starije sačuvane sobe se ne vraćaju (server je dugo stajao – igrači su otišli)
const POKRENUT = Date.now();

const greske = kvizovi.ucitajSve();
greske.forEach((g) => console.warn('⚠ Greška u kvizu', g));
// pitanja objavljena bez restarta (`deploy/objavi.sh … --pitanja`) server pokupi najkasnije za 10 s
// (i odmah pri /api/kvizovi i „Pokreni“); sobe u toku zadržavaju već izabrana pitanja
setInterval(() => {
  const pre = kvizovi.svi();
  const g = kvizovi.ucitajSve();
  if (kvizovi.svi() === pre) return;
  const sve = Object.values(kvizovi.svi());
  console.log(`Kvizovi osveženi: ${sve.length} kvizova, ${sve.reduce((s, k) => s + k.pitanja.length, 0)} pitanja`);
  g.forEach((x) => console.warn('⚠ Greška u kvizu', x));
}, 10e3).unref();
const brojReci = recnik.ucitaj();

const sobe = new Map(); // kod -> Soba
Soba.zabelezi = telemetrija.dogadjaj;
telemetrija.pokreni(sobe);
const tokovi = new Map(); // kod -> Set<{res, id}>

const cekaci = new Map(); // kod -> Set<{res, id, tajmer}>  (long-polling, kad SSE ne prolazi – npr. Cloudflare tunel)

// Telefon šalje svoj TAJNI id (čuva ga u localStorage); ostali igrači vide samo javni id izveden iz njega.
// Tako niko ne može da se predstavi kao drugi igrač ili vođa samo zato što mu vidi id u stanju sobe.
// Ključ se pravi jednom i čuva u podaci/kljuc-id: posle restarta (deploy) isti telefon mora da dobije isti javni id,
// inače ga vraćena soba ne bi prepoznala ni kao igrača ni kao vođu. deploy/izuzeci-rsync.txt ga štiti od brisanja.
function kljucId() {
  const f = path.join(PODACI, 'kljuc-id');
  try { const k = Buffer.from(fs.readFileSync(f, 'utf8').trim(), 'hex'); if (k.length === 32) return k; } catch {}
  const k = crypto.randomBytes(32);
  try { fs.mkdirSync(PODACI, { recursive: true }); fs.writeFileSync(f, k.toString('hex') + '\n', { mode: 0o600 }); }
  catch (e) { console.warn('⚠ Ključ za id igrača nije sačuvan – posle restarta sobe neće prepoznati igrače:', e.message); }
  return k;
}
const KLJUC_ID = kljucId();
const javniId = (tajni) => (tajni ? crypto.createHmac('sha256', KLJUC_ID).update(String(tajni)).digest('hex').slice(0, 16) : '');
// broj otvorenih SSE tokova jednog igrača (računa se iz skupa tokova, pa ne može da se „raštimuje“)
const brojVeza = (kod, id) => { let n = 0; for (const t of tokovi.get(kod) || []) if (t.id === id) n++; return n; };

function emituj(soba) {
  const set = tokovi.get(soba.kod);
  if (set) for (const t of set) posalji(t.res, soba.pogled(t.id));
  const c = cekaci.get(soba.kod);
  if (c && c.size) {
    cekaci.set(soba.kod, new Set());
    for (const w of c) { clearTimeout(w.tajmer); kraj(w.res, 200, soba.pogled(w.id)); }
  }
}
function posalji(res, podaci) {
  try { res.write(`data: ${JSON.stringify(podaci)}\n\n`); } catch {}
}

const MAKS_SOBA = 20000; // 4 slova = 160.000 kodova; iznad ovoga nova soba se odbija (umesto beskonačne petlje)
const LIMIT_SOBA = +process.env.LIMIT_SOBA || 20; // novih soba po minutu po adresi
const LIMIT_NEMA = +process.env.LIMIT_NEMA || 120; // pogrešnih kodova soba po minutu po adresi
const LIMIT_PREDLOGA = +process.env.LIMIT_PREDLOGA || 100; // predloga (pull request-ova) po satu po adresi
const LIMIT_PREDLOGA_DAN = +process.env.LIMIT_PREDLOGA_DAN || 1000; // ukupno predloga dnevno (zaštita od zloupotrebe)
const LIMIT_PRIJAVA_PITANJA = +process.env.LIMIT_PRIJAVA_PITANJA || 300; // prijava pogrešnih pitanja po satu po adresi
const LIMIT_STANJA = +process.env.LIMIT_STANJA || 200; // provera stanja predloga („Moji predlozi“) po minutu po adresi
function novKod() {
  const A = 'ABCDEFGHJKLMNPRSTUVZ';
  if (sobe.size >= MAKS_SOBA) return null;
  for (let i = 0; i < 200; i++) {
    const k = Array.from({ length: 4 }, () => A[Math.floor(Math.random() * A.length)]).join('');
    if (!sobe.has(k)) return k;
  }
  return null;
}

// ───── /admin: pregled soba uživo i istorija (lib/telemetrija.js), samo uz lozinku ADMIN_LOZINKA ─────
// Bez postavljene lozinke stranica ne postoji (404). Prijava daje nasumičan token u HttpOnly kolačiću;
// sesije žive u memoriji (restart servera = nova prijava).
const ADMIN_LOZINKA = process.env.ADMIN_LOZINKA || '';
const LIMIT_PRIJAVA = +process.env.LIMIT_PRIJAVA || 10; // pokušaja prijave na 15 minuta po adresi
const ADMIN_TRAJE = 12 * 3600e3;
const adminSesije = new Map(); // token -> ističe (ms)
const otisakLozinke = (x) => crypto.createHash('sha256').update(String(x)).digest();
function tacnaLozinka(x) {
  return !!ADMIN_LOZINKA && typeof x === 'string' && crypto.timingSafeEqual(otisakLozinke(x), otisakLozinke(ADMIN_LOZINKA));
}
function kolacic(req, ime) {
  for (const deo of String(req.headers.cookie || '').split(';')) {
    const [k, ...v] = deo.trim().split('=');
    if (k === ime) return v.join('=');
  }
  return '';
}
function jeAdmin(req) {
  const t = kolacic(req, 'skviz_admin');
  const istice = t && adminSesije.get(t);
  if (!istice) return false;
  if (Date.now() > istice) { adminSesije.delete(t); return false; }
  return true;
}
// iza Caddy-ja (HTTPS) kolačić sme samo preko HTTPS-a
const preko_https = (req) => adresaJeLokalna(req) && req.headers['x-forwarded-proto'] === 'https';
setInterval(() => { const sad = Date.now(); for (const [t, d] of adminSesije) if (sad > d) adminSesije.delete(t); }, 3600e3).unref();

// ograničenje učestalosti po adresi (iza Caddy-ja prava adresa je u X-Forwarded-For)
const brojaci = new Map(); // kljuc -> { n, od }
function adresaJeLokalna(req) {
  const l = req.socket.remoteAddress || '';
  return l === '127.0.0.1' || l === '::1' || l === '::ffff:127.0.0.1';
}
function adresa(req) {
  const l = req.socket.remoteAddress || '';
  const xf = adresaJeLokalna(req) && req.headers['x-forwarded-for'];
  return xf ? String(xf).split(',').pop().trim() : l;
}
function previse(req, vrsta, maks, prozorMs) {
  const k = vrsta + '|' + adresa(req), sad = Date.now();
  let b = brojaci.get(k);
  if (!b || sad - b.od > prozorMs) { b = { n: 0, od: sad, prozor: prozorMs }; brojaci.set(k, b); }
  return ++b.n > maks;
}
setInterval(() => { const sad = Date.now(); for (const [k, b] of brojaci) if (sad - b.od > Math.max(300e3, b.prozor)) brojaci.delete(k); }, 60e3);

process.on('uncaughtException', (e) => console.error('Neuhvaćena greška:', e));
process.on('unhandledRejection', (e) => console.error('Neobrađeno odbijanje:', e));

// brisanje napuštenih soba
setInterval(() => {
  for (const [k, s] of sobe) {
    const nikog = !(tokovi.get(k)?.size) && !(cekaci.get(k)?.size);
    const dokle = s.igraci.size === 0 || s.faza === 'lobi' ? 30 * 60e3 : 3 * 3600e3; // prazne i nepokrenute sobe brže nestaju
    if (nikog && Date.now() - s.zadnjaAktivnost > dokle) {
      if (s.faza !== 'lobi' && s.faza !== 'kraj') s.zabelezi('igra-prekinuta', Date.now() - s.igraPocela);
      s.zabelezi('soba-zatvorena', Date.now() - s.napravljena);
      clearTimeout(s.tajmer); sobe.delete(k); tokovi.delete(k); cekaci.delete(k);
    }
  }
}, 60e3);
// vođa koji je nestao (ugašen telefon, zatvorena stranica) predaje vođstvo prvom prisutnom igraču
setInterval(() => { for (const s of sobe.values()) s.proveriDomacina(); }, 4000);

const TIPOVI = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg',
  '.wav': 'audio/wav', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
};

// verzija klijenta (otisak fajlova iz public/) – telefon koji je otvorio staru verziju stranice sam se osveži.
// Na javnom serveru (production) računa se jednom, iz SADRŽAJA fajlova: novi kod stiže samo punim deploy-om (restart),
// pa se telefoni osvežavaju tek kad novi server radi, i to samo ako se klijent zaista promenio (git archive svakom
// commitu daje novo vreme izmene). Lokalno se prati vreme izmene, da se vidi i izmena bez restarta.
const PRODUKCIJA = process.env.NODE_ENV === 'production';
let otisak = { do: 0, v: '' };
function verzijaKlijenta() {
  if (Date.now() < otisak.do || (otisak.v && PRODUKCIJA)) return otisak.v;
  const h = crypto.createHash('md5');
  for (const f of ['index.html', 'app.js', 'geo.js', 'fizika.js', 'biologija.js', 'istorija.js', 'mediji.js', 'pismo.js', 'style.css']) {
    try {
      if (PRODUKCIJA) h.update(fs.readFileSync(path.join(JAVNO, f)));
      else { const st = fs.statSync(path.join(JAVNO, f)); h.update(st.size.toString(36) + st.mtimeMs.toString(36)); }
    } catch {}
  }
  otisak = { do: Date.now() + 5000, v: h.digest('hex').slice(0, 10) };
  return otisak.v;
}
Soba.verzijaKlijenta = verzijaKlijenta;

function staticki(res, koren, rel, zaglavlja = {}) {
  const f = path.normalize(path.join(koren, rel));
  // sme samo unutar korena („public-x“ pored „public“ nije unutra, iako počinje isto)
  if (f !== koren && !f.startsWith(koren + path.sep)) return kraj(res, 403, 'zabranjeno');
  fs.stat(f, (e, st) => {
    if (e || !st.isFile()) return kraj(res, 404, 'nema');
    res.writeHead(200, {
      'Content-Type': TIPOVI[path.extname(f).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': koren === KVIZOVI || rel.startsWith('/geo/') ? 'public, max-age=3600' : 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      // fajlovi kvizova (slike, SVG) su samo sadržaj: ako se otvore direktno u pregledaču, ne smeju da pokreću skripte
      ...(koren === KVIZOVI ? { 'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'" } : {}),
      ...zaglavlja,
    });
    fs.createReadStream(f).on('error', () => res.destroy()).pipe(res);
  });
}

function kraj(res, kod, telo) {
  const json = typeof telo !== 'string';
  res.writeHead(kod, { 'Content-Type': json ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
  res.end(json ? JSON.stringify(telo) : telo);
}

function citajTelo(req) {
  return new Promise((ok) => {
    const delovi = [];
    let n = 0;
    // delovi se spajaju kao bajtovi – višebajtno slovo (š, ћ, emodži) može da bude presečeno između dva dela
    req.on('data', (c) => { n += c.length; if (n > 1e5) { req.destroy(); return ok({}); } delovi.push(c); });
    req.on('end', () => { try { const o = JSON.parse(Buffer.concat(delovi).toString('utf8') || '{}'); ok(o && typeof o === 'object' && !Array.isArray(o) ? o : {}); } catch { ok({}); } });
    req.on('error', () => ok({}));
    req.on('close', () => ok({})); // prekinuta veza – da obrada ne ostane da visi
  });
}

const server = http.createServer(async (req, res) => {
  try { await obradi(req, res); } catch (e) {
    console.error('Greška u zahtevu:', req.method, req.url, e);
    if (!res.headersSent) kraj(res, 400, { greska: 'Loš zahtev' }); else res.end();
  }
});

async function obradi(req, res) {
  let url, p;
  try { url = new URL(req.url, 'http://x'); p = decodeURIComponent(url.pathname); } catch { return kraj(res, 400, { greska: 'Loša adresa' }); }

  if (p === '/api/dogadjaji') {
    const soba = sobe.get((url.searchParams.get('soba') || '').toUpperCase());
    const tajni = url.searchParams.get('igrac') || '';
    if (!soba) return kraj(res, previse(req, 'nema', LIMIT_NEMA, 60e3) ? 429 : 404, { greska: 'Soba ne postoji' });
    if (tajni.length > 64) return kraj(res, 400, { greska: 'Loš ID' });
    const id = javniId(tajni);
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 1500\n\n');
    const t = { res, id };
    if (!tokovi.has(soba.kod)) tokovi.set(soba.kod, new Set());
    tokovi.get(soba.kod).add(t);
    soba.povezan(id, brojVeza(soba.kod, id));
    posalji(res, soba.pogled(id));
    const puls = setInterval(() => { try { res.write(': puls\n\n'); } catch {} }, 15000);
    req.on('close', () => {
      clearInterval(puls);
      tokovi.get(soba.kod)?.delete(t);
      // soba je možda u međuvremenu obrisana (ili je pod istim kodom napravljena nova)
      if (sobe.get(soba.kod) === soba) soba.povezan(id, brojVeza(soba.kod, id));
    });
    return;
  }

  if (p === '/api/stanje') {
    const soba = sobe.get((url.searchParams.get('soba') || '').toUpperCase());
    const tajni = url.searchParams.get('igrac') || '';
    if (!soba) return kraj(res, previse(req, 'nema', LIMIT_NEMA, 60e3) ? 429 : 404, { greska: 'Soba ne postoji' });
    if (tajni.length > 64) return kraj(res, 400, { greska: 'Loš ID' });
    const id = javniId(tajni);
    soba.vidjen(id);
    const v = +(url.searchParams.get('v') ?? -1);
    if (v < soba.verzija) return kraj(res, 200, soba.pogled(id));
    if (!cekaci.has(soba.kod)) cekaci.set(soba.kod, new Set());
    const w = { res, id };
    w.tajmer = setTimeout(() => { cekaci.get(soba.kod)?.delete(w); kraj(res, 200, soba.pogled(id)); }, 20000);
    cekaci.get(soba.kod).add(w);
    req.on('close', () => { clearTimeout(w.tajmer); cekaci.get(soba.kod)?.delete(w); });
    return;
  }

  // stanje servera za deploy skriptu (deploy/objavi.sh: --kad-niko-ne-igra, provera posle restarta) – samo sa samog
  // servera, ne preko Caddy-ja (Caddy uvek dodaje X-Forwarded-For)
  if (p === '/api/zdravlje') {
    if (!adresaJeLokalna(req) || req.headers['x-forwarded-for']) return kraj(res, 404, 'nema');
    return kraj(res, 200, { ...telemetrija.presek(sobe).ukupno, format: Soba.FORMAT, pokrenut: POKRENUT, vraceno: vraceno.sobe });
  }
  if (p === '/api/kvizovi') { kvizovi.ucitajSve(); return kraj(res, 200, kvizovi.spisak()); }
  // na javnom serveru (production) porodična statistika se ne izlaže strancima
  if (p === '/api/statistika') return kraj(res, 200, process.env.NODE_ENV === 'production' && !process.env.JAVNA_STATISTIKA ? { igraci: {}, igre: [] } : statistika.citaj());
  // adrese računara trebaju samo u kućnoj mreži (lobi ih ispisuje za telefone); javni server ih ne otkriva
  if (p === '/api/info') return kraj(res, 200, { adrese: process.env.NODE_ENV === 'production' ? [] : lanAdrese(), port: PORT, reci: brojReci });

  // ───── urednik pitanja: predlozi izmena → pull request na GitHub-u (lib/predlozi.js) ─────
  // prijavljena pitanja za urednik – javno: samo pitanje i broj prijava (bez soba i igrača)
  if (p === '/api/prijave') {
    kvizovi.ucitajSve();
    return kraj(res, 200, telemetrija.prijave().prijave.map(({ pitanje_id, paket, lekcija, broj, poslednja, tekst, odgovor, kviz, nazivLekcije, izmenjeno, nema }) =>
      ({ id: pitanje_id, paket, lekcija, broj, poslednja, tekst, odgovor, kviz, nazivLekcije, izmenjeno, nema })));
  }
  if (p === '/api/predlog/info') return kraj(res, 200, { ukljuceno: predlozi.ukljuceno(), repo: predlozi.REPO });
  if (p === '/api/predlog' && req.method === 'POST') {
    const b = await citajTelo(req);
    if (previse(req, 'predlog', LIMIT_PREDLOGA, 3600e3) || previse({ socket: {}, headers: {} }, 'predlog-dan', LIMIT_PREDLOGA_DAN, 86400e3))
      return kraj(res, 429, { greska: 'Previše predloga za kratko vreme. Pokušaj ponovo za sat vremena.' });
    try {
      kvizovi.ucitajSve();
      return kraj(res, 200, await predlozi.predlozi(b, kvizovi.paket(String(b.paket || ''))));
    } catch (e) {
      if (e instanceof predlozi.Greska) return kraj(res, e.kod, { greska: e.message });
      console.error('Predlog nije uspeo:', e);
      return kraj(res, 502, { greska: 'GitHub trenutno ne odgovara kako treba. Pokušaj ponovo za nekoliko minuta.' });
    }
  }
  if (p === '/api/predlog/stanje') {
    // svaki nepoznat broj je jedan poziv GitHub-u sa robotovog naloga – ne dati da se limit potroši spolja
    if (previse(req, 'stanje', LIMIT_STANJA, 60e3)) return kraj(res, 429, { greska: 'Previše zahteva. Pokušaj za minut.' });
    const brojevi = (url.searchParams.get('brojevi') || '').slice(0, 400).split(',').map(Number).filter((n) => Number.isSafeInteger(n) && n > 0);
    try { return kraj(res, 200, await predlozi.stanje(brojevi)); } catch (e) { return kraj(res, e.kod || 502, { greska: e.message }); }
  }
  if (p === '/admin' || p.startsWith('/api/admin/')) return admin(req, res, p, url);
  if (p === '/urednik') return staticki(res, JAVNO, '/urednik.html', { 'X-Robots-Tag': 'noindex' });

  if (p === '/api/akcija' && req.method === 'POST') {
    const b = await citajTelo(req);
    const tajni = typeof b.igrac === 'string' ? b.igrac : '';
    // prekratak id bi mogao da se pogodi; klijent pravi nasumičan od 32 znaka
    if (tajni.length < 8 || tajni.length > 64) return kraj(res, 400, { greska: 'Loš ID igrača' });
    const id = javniId(tajni);
    if (b.tip === 'nova-soba') {
      if (previse(req, 'soba', LIMIT_SOBA, 60e3)) return kraj(res, 429, { greska: 'Previše novih soba. Pokušaj za minut.' });
      const kod = novKod();
      if (!kod) return kraj(res, 503, { greska: 'Server je pun. Pokušaj malo kasnije.' });
      const s = new Soba(kod, emituj);
      sobe.set(kod, s);
      if (b.pismo === 'latinica') s.podesavanja.pismo = 'latinica';
      s.dodajIgraca(id, b.ime, b.avatar);
      s.zabelezi('soba-nova');
      return kraj(res, 200, { kod });
    }
    const soba = sobe.get(String(b.soba || '').toUpperCase());
    if (!soba) return kraj(res, previse(req, 'nema', LIMIT_NEMA, 60e3) ? 429 : 404, { greska: 'Soba ne postoji. Proveri kod.' });
    const domacin = soba.domacin === id;
    switch (b.tip) {
      case 'udji':
        if (!soba.dodajIgraca(id, b.ime, b.avatar)) return kraj(res, 403, { greska: 'Soba je puna (najviše 40 igrača).' });
        return kraj(res, 200, { kod: soba.kod });
      case 'odgovor':
        soba.odgovori_(id, b.izbor);
        break;
      case 'rec':
        return kraj(res, 200, soba.posaljiRec(id, b.indeksi) || { ok: false, poruka: 'Ne može sad' });
      case 'gotov':
        soba.gotovSaRecima(id);
        break;
      case 'izadji':
        soba.izbaci(id);
        break;
      case 'prijavi': {
        // „Prijavi pogrešno pitanje“: tiho se beleži za /admin, igra ide dalje; igrač uvek dobije „ok“
        const rb = Number(b.rb);
        const p = soba.faza !== 'lobi' && soba.igraci.has(id) && Number.isInteger(rb) ? soba.pitanja[rb - 1] : null;
        if (p && !previse(req, 'prijavi', LIMIT_PRIJAVA_PITANJA, 3600e3)) telemetrija.prijavi(soba, p, id);
        return kraj(res, 200, { ok: true });
      }
      default:
        if (!domacin) return kraj(res, 403, { greska: 'Samo vođa igre ovo može' });
        if (b.tip === 'podesavanja') soba.postavi(b.podesavanja || {});
        else if (b.tip === 'pokreni') {
          kvizovi.ucitajSve(); // pokupi nove kvizove bez restartovanja servera
          if (!soba.pokreni()) return kraj(res, 409, { greska: 'Za ovaj izbor nema pitanja. Izaberi drugi kviz.' });
        } else if (b.tip === 'dalje') soba.dalje(typeof b.faza === 'string' ? b.faza : undefined);
        else if (b.tip === 'lobi') soba.uLobi();
        else if (b.tip === 'izbaci') soba.izbaci(String(b.koga));
        else if (b.tip === 'vodja' && typeof b.koga === 'string' && soba.igraci.has(b.koga)) { soba.domacin = b.koga; soba.promena(); }
    }
    return kraj(res, 200, { ok: true });
  }

  if (p.startsWith('/kvizovi/')) return staticki(res, KVIZOVI, p.slice('/kvizovi'.length));
  if (p === '/') return staticki(res, JAVNO, '/index.html');
  // TV ekran je ista stranica – pretraživači neka indeksiraju samo početnu
  if (p === '/ekran') return staticki(res, JAVNO, '/index.html', { 'X-Robots-Tag': 'noindex' });
  return staticki(res, JAVNO, p);
}

async function admin(req, res, p, url) {
  if (!ADMIN_LOZINKA) return kraj(res, 404, 'nema');
  if (p === '/admin') {
    return staticki(res, path.join(__dirname, 'admin'), '/admin.html', {
      'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'",
    });
  }
  if (p === '/api/admin/prijava' && req.method === 'POST') {
    if (previse(req, 'prijava', LIMIT_PRIJAVA, 15 * 60e3)) return kraj(res, 429, { greska: 'Previše pokušaja. Pokušaj ponovo za 15 minuta.' });
    const b = await citajTelo(req);
    if (!tacnaLozinka(b.lozinka)) return kraj(res, 403, { greska: 'Pogrešna lozinka' });
    const t = crypto.randomBytes(32).toString('hex');
    adminSesije.set(t, Date.now() + ADMIN_TRAJE);
    res.setHeader('Set-Cookie', `skviz_admin=${t}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${ADMIN_TRAJE / 1000}${preko_https(req) ? '; Secure' : ''}`);
    return kraj(res, 200, { ok: true });
  }
  if (p === '/api/admin/odjava' && req.method === 'POST') {
    adminSesije.delete(kolacic(req, 'skviz_admin'));
    res.setHeader('Set-Cookie', 'skviz_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
    return kraj(res, 200, { ok: true });
  }
  if (!jeAdmin(req)) return kraj(res, 401, { greska: 'Potrebna je prijava' });
  if (p === '/api/admin/istorija') return kraj(res, 200, telemetrija.istorija(url.searchParams.get('dana') || 14));
  if (p === '/api/admin/prijave') return kraj(res, 200, telemetrija.prijave());
  if (p === '/api/admin/prijave/resi' && req.method === 'POST') {
    const b = await citajTelo(req);
    return kraj(res, 200, { reseno: telemetrija.resiPrijavu(b.pitanje) });
  }
  if (p === '/api/admin/uzivo') {
    // presek svih soba na svake 2 s, dok je stranica otvorena
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 3000\n\n');
    let tik = null;
    const salji = () => {
      if (!jeAdmin(req)) { clearInterval(tik); return res.end(); } // sesija je istekla ili je odjavljen
      posalji(res, telemetrija.presek(sobe));
    };
    salji();
    tik = setInterval(salji, 2000);
    req.on('close', () => clearInterval(tik));
    return;
  }
  return kraj(res, 404, { greska: 'nema' });
}

function lanAdrese() {
  const out = [];
  for (const [ime, lista] of Object.entries(os.networkInterfaces())) {
    if (/docker|br-|veth|virbr|lo/.test(ime)) continue;
    for (const a of lista || []) if (a.family === 'IPv4' && !a.internal) out.push(a.address);
  }
  return out;
}

// ───── sobe preko restarta (deploy): sačuvaj pri gašenju, vrati pri pokretanju ─────
// Map/Set se u JSON-u čuvaju kao { "__Map": [...] } / { "__Set": [...] }
const uJson = (k, v) => (v instanceof Map ? { __Map: [...v] } : v instanceof Set ? { __Set: [...v] } : v);
const izJsona = (k, v) => (v && typeof v === 'object' && !Array.isArray(v) ? (Array.isArray(v.__Map) ? new Map(v.__Map) : Array.isArray(v.__Set) ? new Set(v.__Set) : v) : v);

function sacuvajSobe() {
  const lista = [...sobe.values()].filter((s) => s.igraci.size).map((s) => s.uStanje());
  upisi(SOBE_DAT, JSON.stringify({ format: Soba.FORMAT, sacuvano: Date.now(), sobe: lista }, uJson));
  console.log(`Sačuvano ${lista.length} soba za sledeće pokretanje.`);
}

// vraćene sobe pamte se do kraja rada (za /api/zdravlje i test deploy-a)
const vraceno = { sobe: 0 };
function vratiSobe() {
  let z;
  try { z = JSON.parse(fs.readFileSync(SOBE_DAT, 'utf8'), izJsona); } catch (e) { if (e.code !== 'ENOENT') console.warn('⚠ Sačuvane sobe se ne mogu pročitati:', e.message); return; }
  // zapis se briše odmah: ako se server posle sruši i sam podigne, ne vraćaju se ponovo stare sobe
  try { fs.unlinkSync(SOBE_DAT); } catch {}
  const pauza = Date.now() - (+z?.sacuvano || 0);
  // stariji format se prevodi migracijama korak po korak (Soba.MIGRACIJE, lib/soba.js); bez migracije sobe se odbacuju
  let format = z?.format;
  try {
    while (Number.isInteger(format) && format < Soba.FORMAT && Soba.MIGRACIJE[format] && Array.isArray(z.sobe)) {
      z.sobe = z.sobe.map(Soba.MIGRACIJE[format]);
      console.log(`Sačuvane sobe prevedene iz formata ${format} u ${++format}.`);
    }
  } catch (e) { return console.error(`⚠ Migracija soba iz formata ${format} nije uspela – sobe odbačene:`, e); }
  if (format !== Soba.FORMAT) return console.warn(`⚠ Sačuvane sobe su u formatu ${z?.format}, a server traži ${Soba.FORMAT} (nema migracije) – odbačene.`);
  if (!(pauza >= 0 && pauza < MAKS_PAUZA)) return console.warn(`⚠ Sačuvane sobe su stare ${Math.round(pauza / 1000)} s – odbačene.`);
  for (const o of Array.isArray(z.sobe) ? z.sobe : []) {
    try {
      const s = Soba.izStanja(o, emituj, pauza);
      if (s.kod && !sobe.has(s.kod)) { sobe.set(s.kod, s); vraceno.sobe++; }
    } catch (e) { console.error('Soba nije vraćena:', o?.kod, e); }
  }
  console.log(`Vraćeno ${vraceno.sobe} soba (server je stajao ${pauza} ms).`);
}
vratiSobe();

// systemctl restart / stop šalje SIGTERM (Ctrl+C lokalno – SIGINT): sobe se sačuvaju, a otvorene veze zatvore,
// pa se telefoni odmah povezuju ponovo (na novi server)
let gasenje = false;
function ugasi(signal) {
  if (gasenje) return;
  gasenje = true;
  console.log(`${signal}: gasim server…`);
  server.close();
  try { sacuvajSobe(); } catch (e) { console.error('Sobe nisu sačuvane:', e); }
  for (const set of tokovi.values()) for (const t of set) { try { t.res.end(); } catch {} }
  for (const set of cekaci.values()) for (const w of set) { clearTimeout(w.tajmer); try { w.res.destroy(); } catch {} }
  process.exit(0);
}
process.on('SIGTERM', () => ugasi('SIGTERM'));
process.on('SIGINT', () => ugasi('SIGINT'));

server.listen(PORT, '0.0.0.0', () => {
  const ukupno = Object.values(kvizovi.svi()).reduce((s, k) => s + k.pitanja.length, 0);
  console.log(`\n  🎉 Skviz radi!  (${Object.keys(kvizovi.svi()).length} kvizova, ${ukupno} pitanja, ${brojReci} reči u rečniku)\n`);
  console.log('  Na telefonima (ista Wi-Fi mreža) otvori:');
  for (const a of lanAdrese()) console.log(`     http://${a}:${PORT}`);
  console.log(`  Na ovom računaru:  http://localhost:${PORT}`);
  console.log('  TV / veliki ekran: dodaj  /ekran  na adresu\n');
});
