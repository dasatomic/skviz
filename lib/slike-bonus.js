// Slike ličnosti za kraj bonus runde „Na slovo…“ (Wikimedia Commons, naziv datoteke iz rečnika podaci/bonus/).
// Server preuzima umanjenu sliku jednom i čuva je u podaci/bonus-slike/<Q>.<ext>, pa je telefoni dobijaju sa
// našeg servera (i kad sami nemaju pristup internetu). Preuzima se čim igrač navede ličnost, da bude spremna za kraj runde.
const fs = require('fs');
const path = require('path');
const bonus = require('./bonus');

const DIR = path.join(__dirname, '..', 'podaci', 'bonus-slike');
const SIRINA = 320;
const MAKS = 3e6;
const TIPOVI = { jpg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' };
const uToku = new Map(); // q -> Promise<putanja|null>
const neuspeh = new Map(); // q -> vreme neuspeha (ne pokušavaj ponovo 10 min)

function vrsta(b) {
  if (b[0] === 0xff && b[1] === 0xd8) return 'jpg';
  if (b[0] === 0x89 && b[1] === 0x50) return 'png';
  if (b[0] === 0x47 && b[1] === 0x49) return 'gif';
  if (b.slice(8, 12).toString() === 'WEBP') return 'webp';
  return null;
}
function nadji(q) {
  for (const ext of Object.keys(TIPOVI)) {
    const f = path.join(DIR, `${q}.${ext}`);
    if (fs.existsSync(f)) return f;
  }
  return null;
}

function pripremi(q) {
  q = String(q);
  if (!/^Q\d+$/.test(q)) return Promise.resolve(null);
  const ima = nadji(q);
  if (ima) return Promise.resolve(ima);
  if (uToku.has(q)) return uToku.get(q);
  if (Date.now() - (neuspeh.get(q) || 0) < 600e3) return Promise.resolve(null);
  const datoteka = bonus.slikaZa(q);
  if (!datoteka) return Promise.resolve(null);
  const p = (async () => {
    try {
      const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(datoteka.replace(/ /g, '_'))}?width=${SIRINA}`;
      const r = await fetch(url, { headers: { 'User-Agent': 'SkvizBonus/1.0 (porodicni kviz)' }, signal: AbortSignal.timeout(20000) });
      if (!r.ok) throw new Error(r.status);
      const b = Buffer.from(await r.arrayBuffer());
      const ext = b.length <= MAKS && vrsta(b);
      if (!ext) throw new Error('nije slika');
      fs.mkdirSync(DIR, { recursive: true });
      const f = path.join(DIR, `${q}.${ext}`);
      fs.writeFileSync(f + '.tmp', b);
      fs.renameSync(f + '.tmp', f);
      return f;
    } catch (e) {
      neuspeh.set(q, Date.now());
      return null;
    } finally {
      uToku.delete(q);
    }
  })();
  uToku.set(q, p);
  return p;
}

// GET /api/slika-bonus?q=Q123
async function posalji(res, q) {
  const f = await pripremi(q);
  if (!f) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('nema'); }
  const ext = path.extname(f).slice(1);
  res.writeHead(200, { 'Content-Type': TIPOVI[ext], 'Cache-Control': 'public, max-age=2592000' });
  fs.createReadStream(f).pipe(res);
}

module.exports = { pripremi, posalji };
