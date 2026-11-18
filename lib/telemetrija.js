// Telemetrija za /admin: šta se igra uživo i istorija u SQLite bazi (podaci/telemetrija.db).
// Beleže se podaci o sobama (kod, kviz, broj igrača, trajanje), a uz početak i kraj partije i nadimci igrača sa poenima
// (za „Partije po sobama“ u /admin; brišu se posle CUVA_DANA kao i ostalo). Tajni ni javni id igrača se tu ne čuvaju.
// Baza koristi ugrađeni node:sqlite (Node 22.13+); na starijem Node-u radi samo prikaz uživo, bez istorije.
const fs = require('fs');
const path = require('path');
const kvizovi = require('./kvizovi');

const BAZA = process.env.TELEMETRIJA_BAZA || path.join(__dirname, '..', 'podaci', 'telemetrija.db');
const CUVA_DANA = +process.env.TELEMETRIJA_DANA || 90; // stariji zapisi se brišu
const ZONA = process.env.ZONA_PRIKAZA || 'Europe/Belgrade'; // dani i sati u istoriji su po našem vremenu

let db = null;
let upisDogadjaja, upisUzorka;
try {
  // node:sqlite na Node 22 ispisuje „ExperimentalWarning“ – ovde je to očekivano, pa ga utišamo samo za taj modul
  const emit = process.emitWarning;
  process.emitWarning = (w, ...r) => (String(w).includes('SQLite') ? undefined : emit.call(process, w, ...r));
  let DatabaseSync;
  try { ({ DatabaseSync } = require('node:sqlite')); } finally { process.emitWarning = emit; }
  fs.mkdirSync(path.dirname(BAZA), { recursive: true });
  db = new DatabaseSync(BAZA);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    CREATE TABLE IF NOT EXISTS dogadjaji (
      t INTEGER NOT NULL,          -- ms od 1970.
      tip TEXT NOT NULL,           -- soba-nova | igra-pocela | igra-zavrsena | igra-prekinuta | soba-zatvorena
      soba TEXT, kviz TEXT, kategorija TEXT, detalj TEXT,
      igraca INTEGER,              -- igrača u sobi u tom trenutku
      trajanje INTEGER,            -- ms (za kraj igre: od početka partije; za zatvorenu sobu: koliko je soba postojala)
      igraci TEXT                  -- JSON [{ ime, avatar, poeni }] uz igra-* (takmičari, po poenima)
    );
    CREATE INDEX IF NOT EXISTS dogadjaji_t ON dogadjaji (t);
    -- presek stanja jednom u minutu (za grafikon „koliko soba je bilo aktivno“)
    CREATE TABLE IF NOT EXISTS uzorci (
      t INTEGER NOT NULL,
      sobe INTEGER, aktivne INTEGER, igre INTEGER, igraca INTEGER,
      po_kategoriji TEXT           -- JSON { kategorija: broj aktivnih soba }
    );
    CREATE INDEX IF NOT EXISTS uzorci_t ON uzorci (t);
    -- igrači prijavljuju pogrešno pitanje (neupadljivo dugme posle otkrivanja); vidi se samo u /admin
    CREATE TABLE IF NOT EXISTS prijave (
      t INTEGER NOT NULL,
      soba TEXT, paket TEXT,
      pitanje_id TEXT NOT NULL,    -- id pitanja iz lib/kvizovi.js (paket-redni broj, ako nema svoj)
      lekcija INTEGER,
      tekst TEXT,                  -- tekst pitanja u trenutku prijave (pitanje se kasnije može promeniti)
      odgovor TEXT,                -- tačan odgovor (ili tačni parovi)
      igrac TEXT,                  -- javni id (HMAC) – samo da isti igrač ne prijavi isto pitanje više puta
      reseno INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS prijave_pitanje ON prijave (pitanje_id, reseno);
  `);
  // starije baze nemaju kolonu igraci
  if (!db.prepare('PRAGMA table_info(dogadjaji)').all().some((k) => k.name === 'igraci')) db.exec('ALTER TABLE dogadjaji ADD COLUMN igraci TEXT');
  upisDogadjaja = db.prepare('INSERT INTO dogadjaji (t, tip, soba, kviz, kategorija, detalj, igraca, trajanje, igraci) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  upisUzorka = db.prepare('INSERT INTO uzorci (t, sobe, aktivne, igre, igraca, po_kategoriji) VALUES (?, ?, ?, ?, ?, ?)');
} catch (e) {
  console.warn('⚠ Telemetrija radi bez istorije (node:sqlite nije dostupan):', e.message);
  db = null;
}

const velikoSlovo = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// izbor kviza iz lobija ('opste', 'oblast:biologija', 'razred5-biologija#3', 'sport') → { kategorija, detalj }
function opis(kviz) {
  kviz = String(kviz || '');
  if (kviz === 'opste') return { kategorija: 'Opšte znanje', detalj: '' };
  const nazivOblasti = (o) => kvizovi.paket(o)?.naziv || velikoSlovo(o.replace(/-/g, ' '));
  if (kviz.startsWith('oblast:')) return { kategorija: nazivOblasti(kviz.slice(7)), detalj: kvizovi.paket(kviz.slice(7))?.kategorija ? 'Sve teme' : 'Svi razredi' };
  const [pid, lek] = kviz.split('#');
  const pk = kvizovi.paket(pid);
  if (!pk) return { kategorija: kviz, detalj: '' };
  const kategorija = pk.oblast ? nazivOblasti(pk.oblast) : pk.naziv;
  const delovi = [];
  if (pk.razred) delovi.push(`${pk.razred}. razred`);
  // podkategorija (npr. TLA+ u „Eksperimentima“)
  else if (pk.oblast && kvizovi.paket(pk.oblast)?.kategorija) delovi.push(pk.naziv);
  if (lek) delovi.push(`lekcija ${lek}${pk.lekcije[lek - 1]?.naziv ? ': ' + pk.lekcije[lek - 1].naziv : ''}`);
  else if (pk.razred || (pk.celina && pk.lekcije.length)) delovi.push((pk.celina || 'cela godina').toLowerCase());
  return { kategorija, detalj: delovi.join(', ') };
}

const brojPrisutnih = (s) => [...s.igraci.values()].filter((x) => s.aktivan(x)).length;
const uIgri = (s) => s.faza !== 'lobi' && s.faza !== 'kraj';

// takmičari sobe (bez vođe koji samo gleda), po poenima
const spisakIgraca = (s) => s.takmicari()
  .sort((a, b) => b.poeni - a.poeni || String(a.ime).localeCompare(String(b.ime)))
  .map((x) => ({ ime: x.ime, avatar: x.avatar, poeni: x.poeni }));

function dogadjaj(tip, soba, trajanje = null) {
  if (!db) return;
  const { kategorija, detalj } = opis(soba.podesavanja.kviz);
  const igraci = tip.startsWith('igra-') ? JSON.stringify(spisakIgraca(soba)) : null;
  try {
    upisDogadjaja.run(Date.now(), tip, soba.kod, soba.podesavanja.kviz, kategorija, detalj, soba.igraci.size, trajanje, igraci);
  } catch (e) { console.error('telemetrija:', e.message); }
}

// trenutno stanje svih soba (za /admin uživo)
function presek(sobe) {
  const sad = Date.now();
  const lista = [...sobe.values()].map((s) => {
    const { kategorija, detalj } = opis(s.podesavanja.kviz);
    return {
      kod: s.kod, faza: s.faza, kategorija, detalj,
      igraca: s.igraci.size, prisutnih: brojPrisutnih(s),
      otvorena: s.napravljena || null, igraOd: uIgri(s) ? s.igraPocela || null : null,
      neaktivnaMs: sad - s.zadnjaAktivnost,
      // nadimci za /admin uživo (vođa prvi, pa po poenima)
      igraci: [...s.igraci.values()]
        .map((x) => ({ ime: x.ime, avatar: x.avatar, poeni: x.poeni, povezan: s.aktivan(x), vodja: x.id === s.domacin, gleda: !!x.gleda }))
        .sort((a, b) => b.vodja - a.vodja || b.poeni - a.poeni || String(a.ime).localeCompare(String(b.ime))),
    };
  });
  const aktivne = lista.filter((s) => s.prisutnih > 0);
  const poKategoriji = {};
  for (const s of aktivne) {
    const k = (poKategoriji[s.kategorija] ||= { kategorija: s.kategorija, sobe: 0, uIgri: 0, igraca: 0 });
    k.sobe++;
    if (s.igraOd) k.uIgri++;
    k.igraca += s.prisutnih;
  }
  return {
    sada: sad,
    istorija: !!db,
    ukupno: {
      sobe: lista.length,
      aktivne: aktivne.length,
      uIgri: aktivne.filter((s) => s.igraOd).length,
      igraca: aktivne.reduce((a, s) => a + s.prisutnih, 0),
    },
    poKategoriji: Object.values(poKategoriji).sort((a, b) => b.sobe - a.sobe || b.igraca - a.igraca),
    sobe: lista.sort((a, b) => b.prisutnih - a.prisutnih || a.neaktivnaMs - b.neaktivnaMs),
  };
}

function zabeleziUzorak(sobe) {
  if (!db) return;
  const p = presek(sobe);
  const poKat = Object.fromEntries(p.poKategoriji.map((k) => [k.kategorija, k.sobe]));
  try { upisUzorka.run(p.sada, p.ukupno.sobe, p.ukupno.aktivne, p.ukupno.uIgri, p.ukupno.igraca, JSON.stringify(poKat)); } catch (e) { console.error('telemetrija:', e.message); }
}

function ocisti() {
  if (!db) return;
  const granica = Date.now() - CUVA_DANA * 86400e3;
  try {
    db.prepare('DELETE FROM dogadjaji WHERE t < ?').run(granica);
    db.prepare('DELETE FROM uzorci WHERE t < ?').run(granica);
    // nerešene prijave ostaju dok ih neko ne pregleda
    db.prepare('DELETE FROM prijave WHERE reseno = 1 AND t < ?').run(granica);
  } catch (e) { console.error('telemetrija:', e.message); }
}

// ključevi dana i sata po lokalnom vremenu (server je obično na UTC-u)
const fDan = new Intl.DateTimeFormat('sv-SE', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' });
const fSat = new Intl.DateTimeFormat('sv-SE', { timeZone: ZONA, hour: '2-digit', hourCycle: 'h23' });
const danKljuc = (t) => fDan.format(t);

// istorija poslednjih N dana: po danu, po satu (vrh aktivnih soba), po kategoriji i najigraniji izbori
function istorija(dana = 14) {
  dana = Math.min(Math.max(Math.round(+dana) || 14, 1), CUVA_DANA);
  // od ponoći (po našem vremenu) pre dana-1 dana: „14 dana“ = danas i 13 prethodnih kalendarskih dana
  let od = Math.floor((Date.now() - (dana - 1) * 86400e3) / 3600e3) * 3600e3;
  while (+fSat.format(od) !== 0) od -= 3600e3;
  if (!db) return { istorija: false, dana };

  const sad = Date.now();
  const dani = new Map();
  // prazni dani se vide u grafikonu kao nula (a ne kao da ih nema)
  const dodajDan = (t) => {
    const k = danKljuc(t);
    if (!dani.has(k)) dani.set(k, { dan: k, sobe: 0, igre: 0, zavrsene: 0, prekinute: 0, igraca: 0, vrhAktivnih: 0, vrhIgraca: 0 });
  };
  for (let t = od; t < sad; t += 3600e3) dodajDan(t);
  dodajDan(sad);
  const poKategoriji = new Map();
  const poIzboru = new Map();
  const poSatuDana = Array.from({ length: 24 }, (_, h) => ({ sat: h, igre: 0 }));

  const dog = db.prepare('SELECT t, tip, kviz, kategorija, detalj, igraca, trajanje FROM dogadjaji WHERE t >= ? ORDER BY t').all(od);
  for (const d of dog) {
    const dan = dani.get(danKljuc(d.t));
    if (!dan) continue;
    if (d.tip === 'soba-nova') dan.sobe++;
    else if (d.tip === 'igra-pocela') {
      dan.igre++;
      dan.igraca += d.igraca || 0;
      poSatuDana[+fSat.format(d.t) % 24].igre++;
      const k = poKategoriji.get(d.kategorija) || { kategorija: d.kategorija, igre: 0, igraca: 0, zavrsene: 0, trajanjeUkupno: 0 };
      k.igre++;
      k.igraca += d.igraca || 0;
      poKategoriji.set(d.kategorija, k);
      const kljuc = d.kategorija + (d.detalj ? ' – ' + d.detalj : '');
      poIzboru.set(kljuc, (poIzboru.get(kljuc) || 0) + 1);
    } else if (d.tip === 'igra-zavrsena') {
      dan.zavrsene++;
      const k = poKategoriji.get(d.kategorija);
      if (k && d.trajanje) { k.zavrsene++; k.trajanjeUkupno += d.trajanje; }
    } else if (d.tip === 'igra-prekinuta') dan.prekinute++;
  }

  // po satu: najveći broj aktivnih soba i igrača u tom satu (iz minutnih preseka)
  const satno = new Map();
  for (const u of db.prepare('SELECT t, aktivne, igre, igraca FROM uzorci WHERE t >= ? ORDER BY t').all(od)) {
    const h = Math.floor(u.t / 3600e3) * 3600e3;
    const s = satno.get(h) || { t: h, aktivne: 0, igre: 0, igraca: 0 };
    s.aktivne = Math.max(s.aktivne, u.aktivne);
    s.igre = Math.max(s.igre, u.igre);
    s.igraca = Math.max(s.igraca, u.igraca);
    satno.set(h, s);
    const dan = dani.get(danKljuc(u.t));
    if (dan) { dan.vrhAktivnih = Math.max(dan.vrhAktivnih, u.aktivne); dan.vrhIgraca = Math.max(dan.vrhIgraca, u.igraca); }
  }
  // sati bez uzorka (server nije radio) ostaju prazni – grafikon tu prekida liniju
  const sati = [];
  for (let h = Math.floor(od / 3600e3) * 3600e3; h <= Date.now(); h += 3600e3) sati.push(satno.get(h) || { t: h, aktivne: null, igre: null, igraca: null });

  return {
    istorija: true,
    dana,
    zona: ZONA,
    dani: [...dani.values()],
    sati,
    poSatuDana,
    poKategoriji: [...poKategoriji.values()]
      .map(({ trajanjeUkupno, ...k }) => ({ ...k, prosecnoMin: k.zavrsene ? Math.round(trajanjeUkupno / k.zavrsene / 6e3) / 10 : null }))
      .sort((a, b) => b.igre - a.igre),
    najigranije: [...poIzboru.entries()].map(([izbor, igre]) => ({ izbor, igre })).sort((a, b) => b.igre - a.igre).slice(0, 15),
  };
}

// istorija partija po sobi za poslednjih N dana: svaka soba (od „soba-nova“ do „soba-zatvorena“; isti kod se
// kasnije može ponoviti) sa svojim partijama – kada, šta, kako se završila i ko je igrao (sa poenima na kraju)
const MAKS_SOBA_U_ISTORIJI = 300;
function partije(dana = 14) {
  dana = Math.min(Math.max(Math.round(+dana) || 14, 1), CUVA_DANA);
  if (!db) return { istorija: false, dana, sobe: [] };
  const od = Date.now() - dana * 86400e3;
  const citaj = (j) => { try { return j ? JSON.parse(j) : null; } catch { return null; } };
  const otvorene = new Map(); // kod -> soba (još nije zatvorena)
  const sve = [];
  const soba = (kod, t) => {
    let s = otvorene.get(kod);
    if (!s) { s = { kod, otvorena: null, zatvorena: null, partije: [], poslednje: t }; otvorene.set(kod, s); sve.push(s); }
    s.poslednje = t;
    return s;
  };
  const dog = db.prepare(`SELECT t, tip, soba, kategorija, detalj, igraca, trajanje, igraci FROM dogadjaji
    WHERE t >= ? AND soba IS NOT NULL ORDER BY t`).all(od);
  for (const d of dog) {
    if (d.tip === 'soba-nova') {
      otvorene.delete(d.soba); // stara soba sa istim kodom (bez zapisa o zatvaranju) ostaje kakva je
      soba(d.soba, d.t).otvorena = d.t;
    } else if (d.tip === 'igra-pocela') {
      soba(d.soba, d.t).partije.push({ pocela: d.t, kategorija: d.kategorija, detalj: d.detalj, igraca: d.igraca, igraci: citaj(d.igraci), kraj: null, trajanje: null });
    } else if (d.tip === 'igra-zavrsena' || d.tip === 'igra-prekinuta') {
      const s = soba(d.soba, d.t);
      let p = s.partije[s.partije.length - 1];
      // početak je pre perioda – partija se vidi samo po kraju
      if (!p || p.kraj) s.partije.push(p = { pocela: d.trajanje ? d.t - d.trajanje : null, kategorija: d.kategorija, detalj: d.detalj, igraca: d.igraca, igraci: null, kraj: null, trajanje: null });
      p.kraj = d.tip === 'igra-zavrsena' ? 'zavrsena' : 'prekinuta';
      p.trajanje = d.trajanje;
      p.zavrsila = d.t;
      p.igraci = citaj(d.igraci) || p.igraci;
    } else if (d.tip === 'soba-zatvorena') {
      const s = soba(d.soba, d.t);
      s.zatvorena = d.t;
      if (!s.otvorena && d.trajanje) s.otvorena = d.t - d.trajanje;
      otvorene.delete(d.soba);
    }
  }
  const saPartijama = sve.filter((s) => s.partije.length).sort((a, b) => b.poslednje - a.poslednje);
  return {
    istorija: true, dana, zona: ZONA,
    ukupnoSoba: saPartijama.length,
    sobe: saPartijama.slice(0, MAKS_SOBA_U_ISTORIJI).map((s) => ({ ...s, partije: s.partije.reverse() })),
  };
}

// ───── prijave pogrešnih pitanja ─────
// p = pitanje iz Soba.pitanja; vraća true i kad je isti igrač to pitanje već prijavio (igraču je svejedno)
function prijavi(soba, p, igrac) {
  if (!db || !p) return false;
  const id = String(p.id || '');
  try {
    if (db.prepare('SELECT 1 FROM prijave WHERE pitanje_id = ? AND igrac = ? AND reseno = 0').get(id, igrac)) return true;
    const odgovor = p.vrsta === 'spoji'
      ? (p.parovi || []).map(([a, b]) => `${a} → ${b}`).join(' · ')
      : (p.odgovori || [])[p.tacan ?? 0] || '';
    db.prepare('INSERT INTO prijave (t, soba, paket, pitanje_id, lekcija, tekst, odgovor, igrac) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(Date.now(), soba.kod, p.paket || '', id, Number.isInteger(p.lekcija) ? p.lekcija : null, String(p.pitanje || ''), String(odgovor), igrac);
    return true;
  } catch (e) { console.error('telemetrija:', e.message); return false; }
}

// nerešene prijave grupisane po pitanju (najčešće prijavljivana prva), uz pitanje kakvo je sada u kvizu
function prijave() {
  if (!db) return { istorija: false, prijave: [] };
  const redovi = db.prepare(`SELECT pitanje_id, paket, lekcija, COUNT(*) AS broj, MIN(t) AS prva, MAX(t) AS poslednja,
      (SELECT tekst FROM prijave p2 WHERE p2.pitanje_id = p.pitanje_id AND reseno = 0 ORDER BY t DESC LIMIT 1) AS tekst,
      (SELECT odgovor FROM prijave p2 WHERE p2.pitanje_id = p.pitanje_id AND reseno = 0 ORDER BY t DESC LIMIT 1) AS odgovor
    FROM prijave p WHERE reseno = 0 GROUP BY pitanje_id ORDER BY broj DESC, poslednja DESC LIMIT 500`).all();
  return {
    istorija: true,
    prijave: redovi.map((r) => {
      const pk = kvizovi.paket(r.paket);
      const sada = pk?.pitanja.find((x) => x.id === r.pitanje_id);
      return {
        ...r,
        kviz: pk ? pk.naziv + (pk.razred ? `, ${pk.razred}. razred` : '') : r.paket,
        nazivLekcije: r.lekcija && pk?.lekcije?.[r.lekcija - 1]?.naziv || null,
        izmenjeno: !!sada && sada.pitanje !== r.tekst, // u međuvremenu je pitanje promenjeno
        nema: !sada,                                     // pitanja više nema pod tim id-jem
      };
    }),
  };
}

function resiPrijavu(pitanjeId) {
  if (!db) return 0;
  return Number(db.prepare('UPDATE prijave SET reseno = 1 WHERE pitanje_id = ? AND reseno = 0').run(String(pitanjeId)).changes);
}

// minutni presek + čišćenje starih zapisa
function pokreni(sobe) {
  if (!db) return;
  ocisti();
  setInterval(() => zabeleziUzorak(sobe), 60e3).unref();
  setInterval(ocisti, 6 * 3600e3).unref();
}

module.exports = { dogadjaj, presek, istorija, partije, pokreni, opis, prijavi, prijave, resiPrijavu, ukljuceno: () => !!db };
