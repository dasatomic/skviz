// Učitavanje kvizova iz foldera kvizovi/<id>/kviz.json
// Format je opisan u kvizovi/UPUTSTVO.md
const fs = require('fs');
const path = require('path');

const KORENI = path.join(__dirname, '..', 'kvizovi');
const ISTORIJA = path.join(__dirname, '..', 'podaci', 'odigrana-pitanja.json');
const upisi = require('./upis');
const recnik = require('./recnik');

// rečnik bez prototipa: id kviza stiže i spolja (podešavanja sobe, urednik), pa „constructor“ ne sme da „postoji“
let paketi = Object.create(null); // id -> { id, naziv, opis, ikona, boja, oblast, razred, lekcije, pitanja: [...] }

// pitanje koje bi srušilo igru usred partije (nema teksta, odgovora ili parova) se preskače pri učitavanju
function mana(p) {
  if (!p || typeof p !== 'object' || typeof p.pitanje !== 'string' || !p.pitanje.trim()) return 'nema teksta pitanja';
  if (p.vrsta === 'spoji') {
    if (!Array.isArray(p.parovi) || p.parovi.length < 2 || p.parovi.some((x) => !Array.isArray(x) || x.length !== 2 || x.some((y) => typeof y !== 'string'))) return '„spoji“ nema ispravne parove';
  } else if (!Array.isArray(p.odgovori) || p.odgovori.length < 2 || p.odgovori.length > 4 || p.odgovori.some((x) => typeof x !== 'string')) return 'odgovori nisu ispravni';
  for (const k of ['mediji', 'medijiOdgovora'])
    if (p[k] !== undefined && p[k] !== null && (typeof p[k] !== 'object' || Array.isArray(p[k]))) return 'medij nije ispravan';
  return null;
}

// otisak foldera sa kvizovima (vreme izmene i veličina svakog kviz.json i foldera sa slikama) –
// kvizovi se ponovo čitaju samo kad se nešto zaista promenilo, a ne pri svakom zahtevu
// (null ako se folder trenutno ne može pročitati – tada ostaju već učitani kvizovi)
function otisakFoldera() {
  let o = '';
  let dirs;
  try { dirs = fs.readdirSync(KORENI); } catch { return null; }
  for (const dir of dirs) {
    for (const f of ['kviz.json', 'slike']) {
      try { const st = fs.statSync(path.join(KORENI, dir, f)); o += `${dir}/${f}:${st.mtimeMs}:${st.size};`; } catch {}
    }
  }
  return o;
}
let ucitano = { otisak: null, greske: [] };

function ucitajSve() {
  const otisak = otisakFoldera();
  if (otisak === null || otisak === ucitano.otisak) return ucitano.greske;
  const novi = Object.create(null);
  const greske = [];
  for (const dir of fs.readdirSync(KORENI)) {
    const f = path.join(KORENI, dir, 'kviz.json');
    if (!fs.existsSync(f)) continue;
    try {
      const k = JSON.parse(fs.readFileSync(f, 'utf8'));
      const id = dir;
      // ako slika ne postoji tačno pod tim imenom, probaj istu sa drugom ekstenzijom (.jpg/.png/...)
      const slike = fs.existsSync(path.join(KORENI, dir, 'slike')) ? fs.readdirSync(path.join(KORENI, dir, 'slike')) : [];
      if (!k || typeof k !== 'object' || (k.pitanja !== undefined && !Array.isArray(k.pitanja))) throw new Error('„pitanja“ mora biti lista');
      for (const m of (k.pitanja || []).flatMap((p) => (p ? [p.mediji, p.medijiOdgovora] : []))) {
        if (m && typeof m.src === 'string' && m.src && !/^(https?:|\/)/.test(m.src) && !fs.existsSync(path.join(KORENI, dir, m.src))) {
          const baza = path.basename(m.src).replace(/\.[^.]+$/, '');
          const nadjena = slike.find((f) => f.replace(/\.[^.]+$/, '') === baza);
          if (nadjena) m.src = 'slike/' + nadjena;
          else greske.push(`${dir}: nema slike ${m.src}`);
        }
      }
      const pitanja = [];
      (k.pitanja || []).forEach((p, i) => {
        const m = mana(p);
        if (m) return greske.push(`${dir} #${i + 1}: ${m} – pitanje je preskočeno`);
        pitanja.push({ ...p, id: p.id || `${id}-${i + 1}`, paket: id, tezina: [1, 2, 3].includes(p.tezina) ? p.tezina : 2 });
      });
      novi[id] = {
        id,
        naziv: k.naziv || id,
        opis: k.opis || '',
        ikona: k.ikona || '❓',
        boja: k.boja || '#6c5ce7',
        redosled: k.redosled ?? 50,
        // zadaci (matematički zadaci sa rešenjem) se nikad ne mešaju u opšte znanje
        zadaci: !!k.zadaci,
        uOpstem: k.uOpstem !== false && !k.zadaci,
        // oblast (npr. „biologija“) spaja opšti kviz i kvizove po razredima u jednu karticu u lobiju
        oblast: k.oblast || null,
        razred: k.razred || null,
        // kategorija: kviz bez pitanja koji samo imenuje oblast u lobiju (npr. „Eksperimenti“ 🚧);
        // ostali kvizovi iste oblasti (bez razreda) su njene podkategorije (npr. TLA+)
        kategorija: !!k.kategorija,
        // natpis za ceo kviz sa lekcijama (podrazumevano „Cela godina“), npr. „Cela knjiga“
        celina: typeof k.celina === 'string' ? k.celina : null,
        // jezik sadržaja kviza: "en" = pitanja na engleskom (npr. TLA+) – klijent ih nikad ne preslovljava u ćirilicu
        jezik: typeof k.jezik === 'string' ? k.jezik : null,
        // lekcije: [{ naziv, tema, strana }] – pitanje pripada lekciji preko polja `lekcija` (redni broj od 1)
        lekcije: (Array.isArray(k.lekcije) ? k.lekcije : []).map((l) => (typeof l === 'string' ? { naziv: l } : l)),
        pitanja,
      };
    } catch (e) {
      greske.push(`${dir}: ${e.message}`);
    }
  }
  paketi = novi;
  ucitano = { otisak, greske };
  // pojmovi iz pitanja (аксолотл, пангеа…) važe kao reči u krugu „Najduža reč“
  recnik.postaviPojmove(Object.values(novi).flatMap((k) => k.pitanja.map((p) => p.rec)).filter(Boolean));
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
  try { upisi(ISTORIJA, JSON.stringify([...s])); } catch {}
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

// da li izabrani izvor čine samo zadaci (duže vreme, rešenje umesto zanimljivosti, bez kruga reči)
const jeZadaci = (id) => {
  const izv = izvor(id);
  return izv.length > 0 && izv.every((p) => paketi[p.paket]?.zadaci);
};

// Bira `broj` pitanja: mešavina težina (≈ 35% lako, 40% srednje, 25% teško),
// prednost imaju pitanja koja još nisu igrana; poređano od lakših ka težim.
function izaberi(paketId, broj) {
  broj = Math.max(0, +broj || 0);
  const zatrazeno = broj;
  const izv = izvor(paketId);
  if (!izv.length) return [];
  let odigrana = citajIstoriju();
  let sveza = izv.filter((p) => !odigrana.has(p.id));
  if (sveza.length < Math.min(broj, izv.length)) {
    // sve je odigrano – krećemo iz početka za ovaj izvor
    for (const p of izv) odigrana.delete(p.id);
    sveza = [...izv];
  }
  // u „opštem znanju“ ravnomerno po oblastima: podkategorije jedne oblasti (npr. četiri sportska kviza)
  // čine jednu grupu, da oblast sa više kvizova ne bi dobila više pitanja
  const grupa = (p) => (paketId === 'opste' && paketi[p.paket]?.oblast) || p.paket;
  // posebne vrste pitanja („spoj pojmove“, „izbaci uljeza“) – oko 15% partije, naizmenično po vrsti
  const posebna = sveza.filter((p) => p.vrsta === 'spoji' || p.vrsta === 'uljez');
  const brojPosebnih = posebna.length && broj >= 5 ? Math.min(posebna.length, Math.max(1, Math.round(broj * 0.15))) : 0;
  const izabranaPosebna = [];
  if (brojPosebnih) {
    // u „opštem znanju“ i posebna pitanja ravnomerno po oblastima: u svakoj vrsti oblasti se smenjuju
    const poVrsti = {};
    for (const p of posebna) ((poVrsti[p.vrsta] ||= {})[grupa(p)] ||= []).push(p);
    const redovi = promesaj(Object.values(poVrsti).map((g) => {
      const grupe = promesaj(Object.values(g).map((l) => promesaj([...l])));
      const niz = [];
      while (grupe.some((l) => l.length)) for (const l of grupe) if (l.length) niz.push(l.pop());
      return niz.reverse(); // pop() uzima s kraja
    }));
    while (izabranaPosebna.length < brojPosebnih) for (const r of redovi) if (r.length && izabranaPosebna.length < brojPosebnih) izabranaPosebna.push(r.pop());
    sveza = sveza.filter((p) => !posebna.includes(p));
    broj -= brojPosebnih;
  }
  const kvota = { 1: Math.round(broj * 0.35), 3: Math.round(broj * 0.25) };
  kvota[2] = broj - kvota[1] - kvota[3];
  const izabrana = [];
  const uzmi = (lista, n) => {
    const poPaketu = {};
    for (const p of promesaj([...lista])) (poPaketu[grupa(p)] ||= []).push(p);
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
  const sve = [...izabrana.slice(0, broj), ...izabranaPosebna];
  // ako je svežih običnih pitanja ponestalo, dopuni već igranim da partija ima traženi broj
  const fali = Math.min(zatrazeno, izv.length) - sve.length;
  if (fali > 0) sve.push(...promesaj(izv.filter((p) => !sve.includes(p))).slice(0, fali));
  sve.sort((a, b) => a.tezina - b.tezina + (Math.random() - 0.5) * 0.9);
  for (const p of sve) odigrana.add(p.id);
  pisiIstoriju(odigrana);
  return sve;
}

const paket = (id) => paketi[String(id)];

module.exports = { ucitajSve, spisak, izaberi, paket, postoji, jeZadaci, promesaj, svi: () => paketi };
