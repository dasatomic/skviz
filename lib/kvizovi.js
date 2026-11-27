// Učitavanje kvizova iz foldera kvizovi/<id>/kviz.json
// Format je opisan u kvizovi/UPUTSTVO.md
const fs = require('fs');
const crypto = require('crypto');
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
  } else if (p.vrsta === 'dokaz') {
    if (!Array.isArray(p.resenje) || !p.resenje.length) return '„dokaz“ nema rešenje';
  } else if (!Array.isArray(p.odgovori) || p.odgovori.length < 2 || p.odgovori.length > 4 || p.odgovori.some((x) => typeof x !== 'string')) return 'odgovori nisu ispravni';
  for (const k of ['mediji', 'medijiOdgovora', 'resenjeCrtez'])
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
        // programski jezik kviza ("rust", "tla"): $…$ se prikazuje kao obojen kôd, a medij „kod“ kao Carbon prozor
        kod: typeof k.kod === 'string' ? k.kod : null,
        // lekcije: [{ naziv, tema, strana }] – pitanje pripada lekciji preko polja `lekcija` (redni broj od 1)
        // zadaci sa podrazumevanim vremenom po zadatku (s), npr. takmičenja – 600 (10 min)
        vremeZadatka: Number.isInteger(k.vremeZadatka) ? k.vremeZadatka : null,
        // lobi: lekcije se biraju u dva koraka – tema (npr. nivo takmičenja), pa lekcija (godina)
        izborTeme: !!k.izborTeme,
        naslovTeme: typeof k.naslovTeme === 'string' ? k.naslovTeme : null,
        naslovLekcije: typeof k.naslovLekcije === 'string' ? k.naslovLekcije : null,
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

// Istorija odigranih pitanja: ključ pitanja → kada je poslednji put igrano (ms), zajednička za sve sobe.
// Ključ se pravi od sadržaja (paket + pitanje + tačan odgovor/parovi), a ne od rednog broja u kviz.json –
// inače bi svako ubacivanje ili brisanje pitanja pomerilo istoriju na pogrešna pitanja.
const kljucevi = new WeakMap();
function kljuc(p) {
  let k = kljucevi.get(p);
  if (!k) {
    k = p.paket + ':' + crypto.createHash('sha1').update(JSON.stringify([p.pitanje, p.odgovori?.[0], p.parovi])).digest('base64url').slice(0, 12);
    kljucevi.set(p, k);
  }
  return k;
}
const svaPitanja = () => Object.values(paketi).flatMap((p) => p.pitanja);
function citajIstoriju() {
  let o;
  try { o = JSON.parse(fs.readFileSync(ISTORIJA, 'utf8')); } catch { return new Map(); }
  if (Array.isArray(o)) {
    // stari zapis: niz id-jeva („paket-redniBroj“) bez vremena → odigrano „davno“
    const poId = new Map(svaPitanja().map((p) => [p.id, p]));
    return new Map(o.filter((id) => poId.has(id)).map((id) => [kljuc(poId.get(id)), 1]));
  }
  return new Map(Object.entries(o?.pitanja || {}));
}
function pisiIstoriju(m) {
  // čuvaju se samo pitanja koja još postoje (izmenjeno pitanje dobija novi ključ i ponovo je „sveže“)
  const postoje = new Set(svaPitanja().map(kljuc));
  const pitanja = {};
  for (const [k, t] of m) if (postoje.has(k)) pitanja[k] = t;
  try { upisi(ISTORIJA, JSON.stringify({ pitanja })); } catch {}
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
//   'razred5-biologija'         – ceo kviz (cela godina)
//   'razred5-biologija#3'       – samo 3. lekcija
//   'razred5-biologija#1,3,5'   – više izabranih lekcija
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
  if (!lek) return pk.pitanja;
  const brojevi = new Set(lek.split(',').map((x) => +x).filter((n) => Number.isInteger(n) && n > 0));
  return pk.pitanja.filter((p) => brojevi.has(p.lekcija));
}

const postoji = (id) => izvor(id).length > 0;

// da li izabrani izvor čine samo zadaci (duže vreme, rešenje umesto zanimljivosti, bez kruga reči)
const jeZadaci = (id) => {
  const izv = izvor(id);
  return izv.length > 0 && izv.every((p) => paketi[p.paket]?.zadaci);
};

// podrazumevano vreme po zadatku za izvor (s): 600 za takmičenja, inače 300
const vremeZadatka = (id) => {
  const izv = izvor(id);
  const v = new Set(izv.map((p) => paketi[p.paket]?.vremeZadatka || 300));
  return v.size === 1 ? [...v][0] : 300;
};

// Bira `broj` pitanja: mešavina težina (≈ 35% lako, 40% srednje, 25% teško), poređano od lakših ka težim.
// Što manje ponavljanja između partija – pitanja se uzimaju po „nivoima svežine“:
//   1. neigrana nigde (nasumično);
//   2. igrana u drugim sobama, od najdavnije igranih (bez obzira na to koliko davno – ne „resetuje“ se ceo izvor,
//      pa poslednja partija ne može odmah da se ponovi);
//   3. tek na kraju ona koja je ova soba već imala (`vidjena`: ključ → redni broj partije u sobi), od najstarijih.
// Uzastopne partije (nivoi 2 i 3) se spajaju dok nivo nema bar dvostruko više pitanja nego što treba, da se
// partije ne bi ponavljale u istim kompletima (30 pitanja po 10: četvrta partija ≠ prva).
// U nivou: prvo po kvoti težina, pa ostala; ravnomerno po grupama (oblasti u „opštem“, lekcije u jednom predmetu).
function izaberi(paketId, broj, vidjena = new Map()) {
  broj = Math.max(0, +broj || 0);
  const izv = izvor(paketId);
  if (!izv.length) return [];
  const istorija = citajIstoriju();
  // u „opštem znanju“ ravnomerno po oblastima: podkategorije jedne oblasti (npr. četiri sportska kviza)
  // čine jednu grupu, da oblast sa više kvizova ne bi dobila više pitanja; u jednom predmetu (cela godina ili
  // više lekcija) ravnomerno po lekcijama
  const jedanPaket = !paketId.startsWith('oblast:') && paketId !== 'opste';
  const grupa = (p) => (paketId === 'opste' && paketi[p.paket]?.oblast) || (jedanPaket && p.lekcija ? `${p.paket}#${p.lekcija}` : p.paket);
  // bira do n pitanja iz jedne liste, ravnomerno po grupama
  const izListe = (lista, n) => {
    const poGrupi = {};
    for (const p of promesaj([...lista])) (poGrupi[grupa(p)] ||= []).push(p);
    const redovi = promesaj(Object.values(poGrupi));
    const out = [];
    while (out.length < n && redovi.some((r) => r.length)) for (const r of redovi) if (r.length && out.length < n) out.push(r.pop());
    return out;
  };
  // nivoi svežine: [[pitanja…], …] od najsvežijeg
  const nivoi = (lista) => {
    const sveza = [], drugde = new Map(), ovde = new Map();
    for (const p of lista) {
      const k = kljuc(p);
      if (vidjena.has(k)) (ovde.get(vidjena.get(k)) || ovde.set(vidjena.get(k), []).get(vidjena.get(k))).push(p);
      else if (istorija.has(k)) (drugde.get(istorija.get(k)) || drugde.set(istorija.get(k), []).get(istorija.get(k))).push(p);
      else sveza.push(p);
    }
    const spoji = (m) => {
      const out = [];
      let tek = [];
      for (const [, l] of [...m].sort((a, b) => a[0] - b[0])) {
        tek.push(...l);
        if (tek.length >= 2 * broj) { out.push(tek); tek = []; }
      }
      if (tek.length) out.push(tek);
      return out;
    };
    const out = [sveza, ...spoji(drugde)].filter((n) => n.length);
    // nivoi iz ove sobe su obeleženi (`ovde`), da bi se posebna pitanja mogla preskočiti
    return [...out, ...spoji(ovde).map((n) => Object.assign(n, { ovde: true }))];
  };
  // posebne vrste pitanja („spoj pojmove“, „izbaci uljeza“) – oko 15% partije, naizmenično po vrsti
  const posebnaF = (p) => p.vrsta === 'spoji' || p.vrsta === 'uljez';
  const brojPosebnih = izv.some(posebnaF) && broj >= 5 ? Math.min(izv.filter(posebnaF).length, Math.max(1, Math.round(broj * 0.15))) : 0;
  const izabranaPosebna = [];
  // posebnih je malo (često 1–2 po lekciji), pa bi se ista ponavljala svake partije: ono što je soba već imala
  // ide ponovo tek kad ni običnih pitanja koja soba nije videla nema dovoljno
  const ponovoPosebna = izv.filter((p) => !posebnaF(p) && !vidjena.has(kljuc(p))).length < broj;
  if (brojPosebnih) {
    // u svakoj vrsti se oblasti smenjuju
    const redoviOd = (lista) => {
      const poVrsti = {};
      for (const p of lista) ((poVrsti[p.vrsta] ||= {})[grupa(p)] ||= []).push(p);
      return promesaj(Object.values(poVrsti).map((g) => {
        const grupe = promesaj(Object.values(g).map((l) => promesaj([...l])));
        const niz = [];
        while (grupe.some((l) => l.length)) for (const l of grupe) if (l.length) niz.push(l.pop());
        return niz.reverse(); // pop() uzima s kraja
      }));
    };
    for (const nivo of nivoi(izv.filter(posebnaF))) {
      if (nivo.ovde && !ponovoPosebna) break;
      const redovi = redoviOd(nivo);
      while (izabranaPosebna.length < brojPosebnih && redovi.some((r) => r.length)) for (const r of redovi) if (r.length && izabranaPosebna.length < brojPosebnih) izabranaPosebna.push(r.pop());
    }
    broj -= izabranaPosebna.length;
  }
  const kvota = { 1: Math.round(broj * 0.35), 3: Math.round(broj * 0.25) };
  kvota[2] = broj - kvota[1] - kvota[3];
  const izabrana = [];
  for (const nivo of nivoi(izv.filter((p) => !posebnaF(p)))) {
    if (izabrana.length >= broj) break;
    // 1) po kvoti (mešavina težina: lako → srednje → teško), koliko je od kvote još ostalo
    for (const t of [1, 2, 3]) {
      const ostalo = kvota[t] - izabrana.filter((p) => p.tezina === t).length;
      if (ostalo > 0) izabrana.push(...izListe(nivo.filter((p) => p.tezina === t), Math.min(ostalo, broj - izabrana.length)));
    }
    // 2) ostala iz istog nivoa (bez obzira na kvotu) – svežije pitanje je preče od tačne mešavine težina
    if (izabrana.length < broj) izabrana.push(...izListe(nivo.filter((p) => !izabrana.includes(p)), broj - izabrana.length));
  }
  const sve = [...izabrana, ...izabranaPosebna];
  sve.sort((a, b) => a.tezina - b.tezina + (Math.random() - 0.5) * 0.9);
  const sad = Date.now();
  for (const p of sve) istorija.set(kljuc(p), sad);
  pisiIstoriju(istorija);
  return sve;
}

const paket = (id) => paketi[String(id)];

// Bonus krug po predmetu: oblast (ili id kviza bez oblasti) → igra „Na slovo…“ (lib/bonus.js), ostalo → „Najduža reč“.
// „Opšte znanje“ dobija nasumičnu vrstu (Soba bira između reči i svih rečnika).
// bonus igre po oblasti, redom kojim se igraju (posle njih uvek „Najduža reč“); „Beži od raptora!“ samo uz matematiku, fiziku i zabavu, „Trojka!“ uz fiziku, matematiku, sport i zabavu, „Elementi – cena i opasnost“ uz hemiju i zabavu, igra „Na slovo…“ (sportisti) uz sport i zabavu.
// Kod matematike se prva bonus igra bira nasumično između „Beži od raptora!“ (45%), „Trojka!“ (45%) i „Napucani iks oks“ (10%) – marker 'raptori|trojka|xo', težine u TEZINE_BONUSA.
// „Napucani iks oks“ ulazi u izbor samo kad igraju tačno 2 ili 4 takmičara (Soba.dozvoljenaIgra) – inače raptori/trojka 50/50.
const BONUS = { geografija: ['karta', 'geografija'], fizika: ['trojka', 'raptori', 'nauka'], matematika: ['raptori|trojka|xo', 'nauka'], 'fizika-zadaci': ['trojka', 'raptori', 'nauka'], 'matematika-zadaci': ['raptori|trojka|xo', 'nauka'], 'matematika-takmicenja': ['raptori|trojka|xo', 'nauka'], hemija: ['hemija'], 'hemija-laboratorija': ['hemija'], istorija: ['istorija'], 'srpska-istorija': ['istorija'], 'svetska-istorija': ['istorija'], sport: ['sport', 'trojka'], zabava: ['trojka', 'raptori', 'sport', 'hemija'] };
// verovatnoće igara u markeru (bez unosa → sve jednako)
const TEZINE_BONUSA = { 'raptori|trojka|xo': { raptori: 45, trojka: 45, xo: 10 } };
function oblastIzbora(id) {
  const pid = id.startsWith('oblast:') ? null : id.split('#')[0];
  return pid ? paketi[pid]?.oblast || pid : id.slice(7);
}
// marker 'a|b' (bonus igra koja se bira nasumično) → jedna od igara, inače isti string;
// dozvoljena(igra) → false izbacuje igru iz izbora (ostale zadržavaju svoje međusobne odnose verovatnoća)
function resiBonusIgru(x, dozvoljena = () => true) {
  if (typeof x === 'string' && x.includes('|')) {
    const izbor = x.split('|').filter(dozvoljena);
    if (!izbor.length) return x.split('|')[0];
    const t = TEZINE_BONUSA[x] || {};
    const tez = izbor.map((v) => t[v] ?? 1);
    let r = Math.random() * tez.reduce((a, b) => a + b, 0);
    for (let i = 0; i < izbor.length; i++) if ((r -= tez[i]) < 0) return izbor[i];
    return izbor[izbor.length - 1];
  }
  return x;
}
// 'nasumicno' („Opšte znanje“) ili prva bonus igra predmeta
function bonusVrsta(id) {
  id = String(id || '');
  if (id === 'opste') return 'nasumicno';
  return BONUS[oblastIzbora(id)]?.[0] || 'reci';
}
// sve bonus igre predmeta redom, na kraju „Najduža reč“
function bonusVrste(id) {
  id = String(id || '');
  if (id === 'opste') return ['nasumicno'];
  return [...(BONUS[oblastIzbora(id)] || []), 'reci'];
}

module.exports = { ucitajSve, spisak, izaberi, kljuc, paket, postoji, jeZadaci, vremeZadatka, bonusVrsta, bonusVrste, resiBonusIgru, promesaj, svi: () => paketi };
