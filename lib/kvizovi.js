// Učitavanje kvizova iz foldera kvizovi/<id>/kviz.json
// Format je opisan u kvizovi/UPUTSTVO.md
const fs = require('fs');
const path = require('path');

const KORENI = path.join(__dirname, '..', 'kvizovi');
const ISTORIJA = path.join(__dirname, '..', 'podaci', 'odigrana-pitanja.json');

let paketi = {}; // id -> { id, naziv, opis, ikona, boja, oblast, razred, lekcije, pitanja: [...] }

function ucitajSve() {
  paketi = {};
  const greske = [];
  for (const dir of fs.readdirSync(KORENI)) {
    const f = path.join(KORENI, dir, 'kviz.json');
    if (!fs.existsSync(f)) continue;
    try {
      const k = JSON.parse(fs.readFileSync(f, 'utf8'));
      const id = dir;
      // ako slika ne postoji tačno pod tim imenom, probaj istu sa drugom ekstenzijom (.jpg/.png/...)
      const slike = fs.existsSync(path.join(KORENI, dir, 'slike')) ? fs.readdirSync(path.join(KORENI, dir, 'slike')) : [];
      for (const p of k.pitanja || []) {
        const m = p.mediji;
        if (m && m.src && !/^(https?:|\/)/.test(m.src) && !fs.existsSync(path.join(KORENI, dir, m.src))) {
          const baza = path.basename(m.src).replace(/\.[^.]+$/, '');
          const nadjena = slike.find((f) => f.replace(/\.[^.]+$/, '') === baza);
          if (nadjena) m.src = 'slike/' + nadjena;
          else greske.push(`${dir}: nema slike ${m.src}`);
        }
      }
      const pitanja = (k.pitanja || []).map((p, i) => ({
        ...p,
        id: p.id || `${id}-${i + 1}`,
        paket: id,
        tezina: p.tezina || 2,
      }));
      paketi[id] = {
        id,
        naziv: k.naziv || id,
        opis: k.opis || '',
        ikona: k.ikona || '❓',
        boja: k.boja || '#6c5ce7',
        redosled: k.redosled ?? 50,
        uOpstem: k.uOpstem !== false,
        // oblast (npr. „biologija“) spaja opšti kviz i kvizove po razredima u jednu karticu u lobiju
        oblast: k.oblast || null,
        razred: k.razred || null,
        // lekcije: [{ naziv, tema, strana }] – pitanje pripada lekciji preko polja `lekcija` (redni broj od 1)
        lekcije: (k.lekcije || []).map((l) => (typeof l === 'string' ? { naziv: l } : l)),
        pitanja,
      };
    } catch (e) {
      greske.push(`${dir}: ${e.message}`);
    }
  }
  return greske;
}

function spisak() {
  const lista = Object.values(paketi)
    .sort((a, b) => a.redosled - b.redosled || a.naziv.localeCompare(b.naziv))
    .map(({ pitanja, lekcije, ...m }) => ({
      ...m,
      broj: pitanja.length,
      lekcije: lekcije.map((l, i) => ({ ...l, broj: pitanja.filter((p) => p.lekcija === i + 1).length })),
    }));
  const ukupno = Object.values(paketi).filter((p) => p.uOpstem).reduce((s, p) => s + p.pitanja.length, 0);
  return [{ id: 'opste', naziv: 'Opšte znanje', opis: 'Mešavina pitanja iz svih oblasti', ikona: '🌍', boja: '#e17055', broj: ukupno }, ...lista];
}

function citajIstoriju() {
  try { return new Set(JSON.parse(fs.readFileSync(ISTORIJA, 'utf8'))); } catch { return new Set(); }
}
function pisiIstoriju(s) {
  try { fs.writeFileSync(ISTORIJA, JSON.stringify([...s])); } catch {}
}

const promesaj = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Izbor kviza u lobiju:
//   'opste'                 – sve oblasti (kvizovi sa uOpstem)
//   'oblast:biologija'      – svi razredi jedne oblasti (i opšti kviz te oblasti)
//   'razred5-biologija'     – ceo kviz (cela godina)
//   'razred5-biologija#3'   – samo 3. lekcija
function izvor(id) {
  id = String(id || '');
  if (id === 'opste') return Object.values(paketi).filter((p) => p.uOpstem).flatMap((p) => p.pitanja);
  if (id.startsWith('oblast:')) {
    const o = id.slice(7);
    return Object.values(paketi).filter((p) => p.oblast === o).flatMap((p) => p.pitanja);
  }
  const [pid, lek] = id.split('#');
  const pk = paketi[pid];
  if (!pk) return [];
  return lek ? pk.pitanja.filter((p) => p.lekcija === +lek) : pk.pitanja;
}

const postoji = (id) => izvor(id).length > 0;

// Bira `broj` pitanja: mešavina težina (≈ 35% lako, 40% srednje, 25% teško),
// prednost imaju pitanja koja još nisu igrana; poređano od lakših ka težim.
function izaberi(paketId, broj) {
  const izv = izvor(paketId);
  if (!izv.length) return [];
  let odigrana = citajIstoriju();
  let sveza = izv.filter((p) => !odigrana.has(p.id));
  if (sveza.length < Math.min(broj, izv.length)) {
    // sve je odigrano – krećemo iz početka za ovaj izvor
    for (const p of izv) odigrana.delete(p.id);
    sveza = [...izv];
  }
  const kvota = { 1: Math.round(broj * 0.35), 3: Math.round(broj * 0.25) };
  kvota[2] = broj - kvota[1] - kvota[3];
  const izabrana = [];
  const uzmi = (lista, n) => {
    // u „opštem znanju“ ravnomerno po oblastima
    const poPaketu = {};
    for (const p of promesaj([...lista])) (poPaketu[p.paket] ||= []).push(p);
    const redovi = promesaj(Object.values(poPaketu));
    const out = [];
    while (out.length < n && redovi.some((r) => r.length)) for (const r of redovi) if (r.length && out.length < n) out.push(r.pop());
    return out;
  };
  for (const t of [1, 2, 3]) izabrana.push(...uzmi(sveza.filter((p) => p.tezina === t), kvota[t]));
  if (izabrana.length < broj) {
    const ostatak = sveza.filter((p) => !izabrana.includes(p));
    izabrana.push(...uzmi(ostatak, broj - izabrana.length));
  }
  izabrana.sort((a, b) => a.tezina - b.tezina + (Math.random() - 0.5) * 0.9);
  for (const p of izabrana) odigrana.add(p.id);
  pisiIstoriju(odigrana);
  return izabrana.slice(0, broj);
}

const paket = (id) => paketi[id];

module.exports = { ucitajSve, spisak, izaberi, paket, postoji, promesaj, svi: () => paketi };
