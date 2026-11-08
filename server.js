#!/usr/bin/env node
// Gric kviz – kućni kviz za igru preko telefona u kućnoj mreži.
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

function novKod() {
  const A = 'ABCDEFGHJKLMNPRSTUVZ';
  let k;
  do k = Array.from({ length: 4 }, () => A[Math.floor(Math.random() * A.length)]).join('');
  while (sobe.has(k));
  return k;
}

// brisanje napuštenih soba
setInterval(() => {
  for (const [k, s] of sobe) {
    const nikog = !(tokovi.get(k)?.size);
    if (nikog && Date.now() - s.zadnjaAktivnost > 3 * 3600e3) { sobe.delete(k); tokovi.delete(k); }
  }
}, 600e3);

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
    req.on('end', () => { try { ok(JSON.parse(d || '{}')); } catch { ok({}); } });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = decodeURIComponent(url.pathname);

  if (p === '/api/dogadjaji') {
    const soba = sobe.get((url.searchParams.get('soba') || '').toUpperCase());
    const id = url.searchParams.get('igrac') || '';
    if (!soba) return kraj(res, 404, { greska: 'Soba ne postoji' });
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
    if (!soba) return kraj(res, 404, { greska: 'Soba ne postoji' });
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
  if (p === '/api/statistika') return kraj(res, 200, statistika.citaj());
  if (p === '/api/info') return kraj(res, 200, { adrese: lanAdrese(), port: PORT, reci: brojReci });

  if (p === '/api/akcija' && req.method === 'POST') {
    const b = await citajTelo(req);
    const id = String(b.igrac || '');
    if (b.tip === 'nova-soba') {
      const kod = novKod();
      const s = new Soba(kod, emituj);
      sobe.set(kod, s);
      s.dodajIgraca(id, b.ime, b.avatar);
      return kraj(res, 200, { kod });
    }
    const soba = sobe.get(String(b.soba || '').toUpperCase());
    if (!soba) return kraj(res, 404, { greska: 'Soba ne postoji. Proveri kod.' });
    const domacin = soba.domacin === id;
    switch (b.tip) {
      case 'udji':
        soba.dodajIgraca(id, b.ime, b.avatar);
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
});

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
  console.log(`\n  🎉 Gric kviz radi!  (${Object.keys(kvizovi.svi()).length} kvizova, ${ukupno} pitanja, ${brojReci} reči u rečniku)\n`);
  console.log('  Na telefonima (ista Wi-Fi mreža) otvori:');
  for (const a of lanAdrese()) console.log(`     http://${a}:${PORT}`);
  console.log(`  Na ovom računaru:  http://localhost:${PORT}`);
  console.log('  TV / veliki ekran: dodaj  /ekran  na adresu\n');
});
