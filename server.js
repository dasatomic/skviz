#!/usr/bin/env node
// Skviz – kućni kviz za igru preko telefona u kućnoj mreži.
// Pokretanje:  node server.js   (ili: npm start)   – port se menja sa PORT=8080 node server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const kvizovi = require('./lib/kvizovi');
const recnik = require('./lib/recnik');
const statistika = require('./lib/statistika');
const Soba = require('./lib/soba');

const PORT = +process.env.PORT || 3000;
const JAVNO = path.join(__dirname, 'public');
const KVIZOVI = path.join(__dirname, 'kvizovi');

const greske = kvizovi.ucitajSve();
greske.forEach((g) => console.warn('⚠ Greška u kvizu', g));
const brojReci = recnik.ucitaj();

const sobe = new Map(); // kod -> Soba
const tokovi = new Map(); // kod -> Set<{res, id}>

const cekaci = new Map(); // kod -> Set<{res, id, tajmer}>  (long-polling, kad SSE ne prolazi – npr. Cloudflare tunel)

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
function novKod() {
  const A = 'ABCDEFGHJKLMNPRSTUVZ';
  if (sobe.size >= MAKS_SOBA) return null;
  for (let i = 0; i < 200; i++) {
    const k = Array.from({ length: 4 }, () => A[Math.floor(Math.random() * A.length)]).join('');
    if (!sobe.has(k)) return k;
  }
  return null;
}

// ograničenje učestalosti po adresi (iza Caddy-ja prava adresa je u X-Forwarded-For)
const brojaci = new Map(); // kljuc -> { n, od }
function adresa(req) {
  const l = req.socket.remoteAddress || '';
  const lokalno = l === '127.0.0.1' || l === '::1' || l === '::ffff:127.0.0.1';
  const xf = lokalno && req.headers['x-forwarded-for'];
  return xf ? String(xf).split(',').pop().trim() : l;
}
function previse(req, vrsta, maks, prozorMs) {
  const k = vrsta + '|' + adresa(req), sad = Date.now();
  let b = brojaci.get(k);
  if (!b || sad - b.od > prozorMs) { b = { n: 0, od: sad }; brojaci.set(k, b); }
  return ++b.n > maks;
}
setInterval(() => { const sad = Date.now(); for (const [k, b] of brojaci) if (sad - b.od > 300e3) brojaci.delete(k); }, 60e3);

process.on('uncaughtException', (e) => console.error('Neuhvaćena greška:', e));
process.on('unhandledRejection', (e) => console.error('Neobrađeno odbijanje:', e));

// brisanje napuštenih soba
setInterval(() => {
  for (const [k, s] of sobe) {
    const nikog = !(tokovi.get(k)?.size) && !(cekaci.get(k)?.size);
    const dokle = s.igraci.size === 0 || s.faza === 'lobi' ? 30 * 60e3 : 3 * 3600e3; // prazne i nepokrenute sobe brže nestaju
    if (nikog && Date.now() - s.zadnjaAktivnost > dokle) { sobe.delete(k); tokovi.delete(k); cekaci.delete(k); }
  }
}, 60e3);

const TIPOVI = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg',
  '.wav': 'audio/wav', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

function staticki(res, koren, rel) {
  const f = path.normalize(path.join(koren, rel));
  if (!f.startsWith(koren)) return kraj(res, 403, 'zabranjeno');
  fs.stat(f, (e, st) => {
    if (e || !st.isFile()) return kraj(res, 404, 'nema');
    res.writeHead(200, {
      'Content-Type': TIPOVI[path.extname(f).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': koren === KVIZOVI || rel.startsWith('/geo') ? 'public, max-age=3600' : 'no-cache',
    });
    fs.createReadStream(f).pipe(res);
  });
}

function kraj(res, kod, telo) {
  const json = typeof telo !== 'string';
  res.writeHead(kod, { 'Content-Type': json ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8' });
  res.end(json ? JSON.stringify(telo) : telo);
}

function citajTelo(req) {
  return new Promise((ok) => {
    let d = '';
    req.on('data', (c) => { d += c; if (d.length > 1e5) req.destroy(); });
    req.on('end', () => { try { const o = JSON.parse(d || '{}'); ok(o && typeof o === 'object' && !Array.isArray(o) ? o : {}); } catch { ok({}); } });
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
    const id = url.searchParams.get('igrac') || '';
    if (!soba) return kraj(res, previse(req, 'nema', LIMIT_NEMA, 60e3) ? 429 : 404, { greska: 'Soba ne postoji' });
    if (id.length > 64) return kraj(res, 400, { greska: 'Loš ID' });
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 1500\n\n');
    const t = { res, id };
    if (!tokovi.has(soba.kod)) tokovi.set(soba.kod, new Set());
    tokovi.get(soba.kod).add(t);
    const igrac = soba.igraci.has(id);
    if (igrac) soba.povezan(id, true);
    posalji(res, soba.pogled(id));
    const puls = setInterval(() => { try { res.write(': puls\n\n'); } catch {} }, 15000);
    req.on('close', () => {
      clearInterval(puls);
      tokovi.get(soba.kod)?.delete(t);
      if (igrac) soba.povezan(id, false);
    });
    return;
  }

  if (p === '/api/stanje') {
    const soba = sobe.get((url.searchParams.get('soba') || '').toUpperCase());
    const id = url.searchParams.get('igrac') || '';
    if (!soba) return kraj(res, previse(req, 'nema', LIMIT_NEMA, 60e3) ? 429 : 404, { greska: 'Soba ne postoji' });
    if (id.length > 64) return kraj(res, 400, { greska: 'Loš ID' });
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

  if (p === '/api/kvizovi') { kvizovi.ucitajSve(); return kraj(res, 200, kvizovi.spisak()); }
  // na javnom serveru (production) porodična statistika se ne izlaže strancima
  if (p === '/api/statistika') return kraj(res, 200, process.env.NODE_ENV === 'production' && !process.env.JAVNA_STATISTIKA ? { igraci: {}, igre: [] } : statistika.citaj());
  if (p === '/api/info') return kraj(res, 200, { adrese: lanAdrese(), port: PORT, reci: brojReci });

  if (p === '/api/akcija' && req.method === 'POST') {
    const b = await citajTelo(req);
    const id = String(b.igrac || '');
    if (!id || id.length > 64) return kraj(res, 400, { greska: 'Loš ID igrača' });
    if (b.tip === 'nova-soba') {
      if (previse(req, 'soba', LIMIT_SOBA, 60e3)) return kraj(res, 429, { greska: 'Previše novih soba. Pokušaj za minut.' });
      const kod = novKod();
      if (!kod) return kraj(res, 503, { greska: 'Server je pun. Pokušaj malo kasnije.' });
      const s = new Soba(kod, emituj);
      sobe.set(kod, s);
      s.dodajIgraca(id, b.ime, b.avatar);
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
      default:
        if (!domacin) return kraj(res, 403, { greska: 'Samo vođa igre ovo može' });
        if (b.tip === 'podesavanja') soba.postavi(b.podesavanja || {});
        else if (b.tip === 'pokreni') {
          kvizovi.ucitajSve(); // pokupi nove kvizove bez restartovanja servera
          soba.pokreni();
        } else if (b.tip === 'dalje') soba.dalje();
        else if (b.tip === 'lobi') soba.uLobi();
        else if (b.tip === 'izbaci') soba.izbaci(String(b.koga));
        else if (b.tip === 'vodja' && soba.igraci.has(b.koga)) { soba.domacin = b.koga; soba.promena(); }
    }
    return kraj(res, 200, { ok: true });
  }

  if (p.startsWith('/kvizovi/')) return staticki(res, KVIZOVI, p.slice('/kvizovi'.length));
  if (p === '/' || p === '/ekran') return staticki(res, JAVNO, '/index.html');
  return staticki(res, JAVNO, p);
}

function lanAdrese() {
  const out = [];
  for (const [ime, lista] of Object.entries(os.networkInterfaces())) {
    if (/docker|br-|veth|virbr|lo/.test(ime)) continue;
    for (const a of lista || []) if (a.family === 'IPv4' && !a.internal) out.push(a.address);
  }
  return out;
}

server.listen(PORT, '0.0.0.0', () => {
  const ukupno = Object.values(kvizovi.svi()).reduce((s, k) => s + k.pitanja.length, 0);
  console.log(`\n  🎉 Skviz radi!  (${Object.keys(kvizovi.svi()).length} kvizova, ${ukupno} pitanja, ${brojReci} reči u rečniku)\n`);
  console.log('  Na telefonima (ista Wi-Fi mreža) otvori:');
  for (const a of lanAdrese()) console.log(`     http://${a}:${PORT}`);
  console.log(`  Na ovom računaru:  http://localhost:${PORT}`);
  console.log('  TV / veliki ekran: dodaj  /ekran  na adresu\n');
});
