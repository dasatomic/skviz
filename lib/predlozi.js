// Predlozi izmena pitanja iz urednika (/urednik) → pull request na GitHub-u.
//
// PR otvara poseban „robot“ nalog (vidi deploy/README.md → „Nalog za predloge“):
//   GITHUB_TOKEN  – klasični token robota, samo dozvola `public_repo`
//   GITHUB_REPO   – glavni repozitorijum (podrazumevano dasatomic/skviz)
//   GITHUB_GRANA  – grana na koju idu predlozi (podrazumevano main)
// Robot nema pravo pisanja u glavni repozitorijum: izmenu stavlja na granu u svom forku
// i odatle otvara PR – vlasnik pregleda i prihvata (merge) ili odbija.
const crypto = require('crypto');
const recnik = require('./recnik');

const TOKEN = process.env.GITHUB_TOKEN || '';
const REPO = process.env.GITHUB_REPO || 'dasatomic/skviz';
const GRANA = process.env.GITHUB_GRANA || 'main';
const API = 'https://api.github.com';

const ukljuceno = () => !!TOKEN;

class Greska extends Error {
  constructor(poruka, kod = 400) { super(poruka); this.kod = kod; }
}

async function gh(metod, put, telo, zaglavlja = {}) {
  const r = await fetch(API + put, {
    method: metod,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'skviz-urednik',
      ...(telo ? { 'Content-Type': 'application/json' } : {}),
      ...zaglavlja,
    },
    body: telo ? JSON.stringify(telo) : undefined,
    signal: AbortSignal.timeout(20000),
  });
  const tekst = await r.text();
  if (!r.ok) {
    const e = new Error(`GitHub ${metod} ${put}: ${r.status} ${tekst.slice(0, 300)}`);
    e.status = r.status;
    throw e;
  }
  if (zaglavlja.Accept === 'application/vnd.github.raw+json') return tekst;
  return tekst ? JSON.parse(tekst) : {};
}

// ───── provera jednog pitanja (prijateljske poruke za urednika) ─────
const TEKST = 2000; // najviše znakova po polju
function ocisti(s) { return typeof s === 'string' ? s.replace(/\r\n?/g, '\n').trim() : ''; }

function proveriPitanje(p, kviz) {
  const g = [];
  if (!p || typeof p !== 'object') return ['Pitanje nije poslato.'];
  const vrsta = p.vrsta || 'izbor';
  if (!['izbor', 'uljez', 'spoji'].includes(vrsta)) g.push('Nepoznata vrsta pitanja.');
  if (!p.pitanje) g.push('Upiši tekst pitanja.');
  if (![1, 2, 3].includes(p.tezina)) g.push('Izaberi težinu (lako, srednje ili teško).');
  if (vrsta === 'spoji') {
    const P = p.parovi;
    if (!Array.isArray(P) || P.length < 3 || P.length > 5) g.push('„Spoji pojmove“ mora imati od 3 do 5 parova.');
    else if (P.some((x) => !Array.isArray(x) || x.length !== 2 || x.some((y) => !y))) g.push('Svaki par mora imati popunjena oba pojma.');
    else {
      if (new Set(P.map((x) => x[0].toLowerCase())).size !== P.length) g.push('Pojmovi levo se ponavljaju.');
      if (new Set(P.map((x) => x[1].toLowerCase())).size !== P.length) g.push('Pojmovi desno se ponavljaju.');
    }
  } else {
    if (!Array.isArray(p.odgovori) || p.odgovori.length !== 4 || p.odgovori.some((x) => !x)) g.push('Upiši sva 4 odgovora.');
    else if (new Set(p.odgovori.map((x) => x.toLowerCase())).size !== 4) g.push('Odgovori se ponavljaju – svaki mora biti drugačiji.');
  }
  if (vrsta === 'uljez' && !p.objasnjenje) g.push('Kod „Izbaci uljeza“ napiši objašnjenje: zašto je baš to uljez.');
  if (!p.zanimljivost) g.push('Napiši zanimljivost („Da li si znao?“).');
  if (p.rec !== undefined) {
    const c = recnik.uCirilicu(String(p.rec));
    if (!c) g.push(`Ključna reč „${p.rec}“ sadrži slova kojih nema u srpskoj azbuci.`);
    else if ([...c].length < 3 || [...c].length > 11) g.push(`Ključna reč „${p.rec}“ mora imati od 3 do 11 slova.`);
  }
  const lekcije = kviz.lekcije || [];
  if (lekcije.length) {
    if (!Number.isInteger(p.lekcija) || p.lekcija < 1 || p.lekcija > lekcije.length) g.push('Izaberi lekciju.');
  } else if (p.lekcija !== undefined) g.push('Ovaj kviz nema lekcije.');
  const sviTekstovi = [p.pitanje, p.zanimljivost, p.objasnjenje, p.autor, ...(p.odgovori || []), ...(p.parovi || []).flat()];
  if (sviTekstovi.some((t) => typeof t === 'string' && t.length > TEKST)) g.push(`Neko polje je predugačko (najviše ${TEKST} znakova).`);
  if (p.mediji !== undefined && (typeof p.mediji !== 'object' || Array.isArray(p.mediji) || !p.mediji.vrsta)) g.push('Medij nije ispravan.');
  if (p.mediji && JSON.stringify(p.mediji).length > 20000) g.push('Medij je prevelik.');
  return g;
}

// sastavlja pitanje iz onoga što je poslao urednik: samo poznata polja, bez praznih,
// a kod izmene se čuva redosled polja iz originala (da razlika u PR-u bude mala)
const POLJA = ['lekcija', 'vrsta', 'tezina', 'pitanje', 'mediji', 'odgovori', 'parovi', 'objasnjenje', 'zanimljivost', 'rec', 'vreme', 'autor'];
function sastavi(ulaz, original) {
  const v = ulaz.vrsta === 'uljez' || ulaz.vrsta === 'spoji' ? ulaz.vrsta : undefined;
  const novo = {
    lekcija: ulaz.lekcija === undefined || ulaz.lekcija === null || ulaz.lekcija === '' ? undefined : +ulaz.lekcija,
    vrsta: v ?? (original?.vrsta === 'izbor' ? 'izbor' : undefined),
    tezina: +ulaz.tezina,
    pitanje: ocisti(ulaz.pitanje),
    mediji: ulaz.mediji && typeof ulaz.mediji === 'object' ? ulaz.mediji : undefined,
    odgovori: v === 'spoji' ? undefined : (Array.isArray(ulaz.odgovori) ? ulaz.odgovori : []).map(ocisti),
    parovi: v === 'spoji' ? (Array.isArray(ulaz.parovi) ? ulaz.parovi : []).map((x) => (Array.isArray(x) ? x.map(ocisti) : [])) : undefined,
    objasnjenje: ocisti(ulaz.objasnjenje) || undefined,
    zanimljivost: ocisti(ulaz.zanimljivost),
    rec: ocisti(ulaz.rec).toLowerCase() || undefined,
    vreme: original?.vreme,
    autor: ocisti(ulaz.autor) || undefined,
  };
  const out = {};
  const red = original ? [...Object.keys(original).filter((k) => POLJA.includes(k)), ...POLJA] : POLJA;
  for (const k of red) if (!(k in out) && novo[k] !== undefined && novo[k] !== '') out[k] = novo[k];
  // nepoznata polja iz originala (npr. „id“) ostaju netaknuta
  if (original) for (const k of Object.keys(original)) if (!POLJA.includes(k)) out[k] = original[k];
  return out;
}

// više autora jednog pitanja: „Ana Anić, Petar Perić“
function spojiAutore(stari, nov) {
  const lista = String(stari || '').split(',').map((x) => x.trim()).filter(Boolean);
  if (nov && !lista.some((x) => x.toLowerCase() === nov.toLowerCase())) lista.push(nov);
  return lista.join(', ') || undefined;
}

const isto = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Tekst koji je upisao posetilac ide u naslov i opis PR-a: „@ime“ bi poslalo obaveštenje tom GitHub nalogu,
// a „#12“ ostavilo trag u tuđem predlogu. Nevidljivi razmak iza znaka to sprečava, a tekst izgleda isto.
const bezPominjanja = (s) => String(s).replace(/@/g, '@\u200b').replace(/#(?=\d)/g, '#\u200b');

// ───── GitHub: fork robota, grana, commit, PR ─────
let robot = null; // { login, id, fork }
async function pripremiRobota() {
  if (robot) return robot;
  const ja = await gh('GET', '/user');
  // POST /forks vraća postojeći fork ako ga već ima
  const f = await gh('POST', `/repos/${REPO}/forks`, { default_branch_only: true });
  // novi fork se pravi asinhrono – sačekaj da bude dostupan
  for (let i = 0; i < 15; i++) {
    try { await gh('GET', `/repos/${f.full_name}`); break; } catch { await new Promise((r) => setTimeout(r, 2000)); }
  }
  robot = { login: ja.login, id: ja.id, fork: f.full_name };
  return robot;
}

const blobSha = (buf) => crypto.createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');

// ulaz: { paket, original (pitanje kakvo je urednik učitao) | null, pitanje, autor, izvor, napomena }
async function predlozi(ulaz, paketInfo) {
  if (!ukljuceno()) throw new Greska('Predlaganje nije podešeno na ovom serveru.', 503);
  const paket = String(ulaz.paket || '');
  if (!/^[a-z0-9-]+$/.test(paket) || !paketInfo) throw new Greska('Nepoznat kviz.');
  if (paketInfo.zadaci) throw new Greska('Matematički zadaci se ne menjaju preko urednika.');
  const autor = ocisti(ulaz.autor);
  if (autor.length < 3 || autor.length > 80) throw new Greska('Upiši svoje ime i prezime.');
  const izvor = ocisti(ulaz.izvor).slice(0, 1000);
  const putanja = `kvizovi/${paket}/kviz.json`;

  const r = await pripremiRobota();
  // najnovija verzija glavne grane – izmena se primenjuje na nju, ne na (možda stariju) kopiju na serveru
  const ref = await gh('GET', `/repos/${REPO}/git/ref/heads/${GRANA}`);
  const sha = ref.object.sha;
  const sirovo = await gh('GET', `/repos/${REPO}/contents/${putanja}?ref=${sha}`, null, { Accept: 'application/vnd.github.raw+json' });
  const kviz = JSON.parse(sirovo);
  const pitanja = kviz.pitanja || (kviz.pitanja = []);

  let indeks = -1;
  const original = ulaz.original && typeof ulaz.original === 'object' ? ulaz.original : null;
  if (original) {
    indeks = pitanja.findIndex((p) => isto(p, original));
    if (indeks < 0) {
      // možda je u međuvremenu promenjeno nešto drugo – nađi po tekstu pitanja (ako je jedinstven)
      const isti = pitanja.map((p, i) => (p.pitanje === original.pitanje ? i : -1)).filter((i) => i >= 0);
      if (isti.length === 1) indeks = isti[0];
    }
    if (indeks < 0) throw new Greska('Ovo pitanje je u međuvremenu izmenjeno ili obrisano na GitHub-u. Osveži stranicu i pokušaj ponovo.', 409);
  }
  const staro = indeks >= 0 ? pitanja[indeks] : null;
  const novo = sastavi({ ...ulaz.pitanje, autor: spojiAutore(staro?.autor, autor) }, staro);
  const greske = proveriPitanje(novo, kviz);
  if (greske.length) throw new Greska(greske.join(' '));
  const bezAutora = ({ autor, ...x }) => x;
  if (staro && isto(bezAutora(staro), bezAutora(novo))) throw new Greska('Nema izmena u odnosu na postojeće pitanje.');
  const tekst = (p) => (p.pitanje || '').toLowerCase().replace(/\s+/g, ' ');
  if (pitanja.some((p, i) => i !== indeks && tekst(p) === tekst(novo))) throw new Greska('Isto pitanje već postoji u ovom kvizu.');

  if (staro) pitanja[indeks] = novo;
  else {
    // novo pitanje ide iza poslednjeg pitanja iste lekcije (da ostanu grupisana)
    let posle = -1;
    if (novo.lekcija) pitanja.forEach((p, i) => { if (p.lekcija === novo.lekcija) posle = i; });
    if (posle >= 0) pitanja.splice(posle + 1, 0, novo); else pitanja.push(novo);
  }
  const sadrzaj = Buffer.from(JSON.stringify(kviz, null, 2) + '\n');

  const nazivKviza = kviz.naziv || paket;
  const lekcija = novo.lekcija && kviz.lekcije?.[novo.lekcija - 1];
  const nazivLekcije = lekcija ? (typeof lekcija === 'string' ? lekcija : lekcija.naziv) : '';
  const kratko = novo.pitanje.length > 60 ? novo.pitanje.slice(0, 57) + '…' : novo.pitanje;
  const naslov = `${staro ? 'Izmena pitanja' : 'Novo pitanje'} (${nazivKviza}): ${kratko}`;

  try { await gh('POST', `/repos/${r.fork}/merge-upstream`, { branch: GRANA }); } catch {}
  const grana = `predlog/${paket}-${Date.now().toString(36)}`;
  await gh('POST', `/repos/${r.fork}/git/refs`, { ref: `refs/heads/${grana}`, sha });
  await gh('PUT', `/repos/${r.fork}/contents/${putanja}`, {
    message: bezPominjanja(`${naslov}\n\nPredložio/la: ${autor}`),
    content: sadrzaj.toString('base64'),
    sha: blobSha(Buffer.from(sirovo)),
    branch: grana,
    // autor commit-a je osoba koja je predložila (adresa je robotova, da se ne traži imejl)
    author: { name: autor, email: `${r.id}+${r.login}@users.noreply.github.com` },
  });
  const pr = await gh('POST', `/repos/${REPO}/pulls`, {
    title: bezPominjanja(naslov),
    head: `${r.login}:${grana}`,
    base: GRANA,
    maintainer_can_modify: true,
    body: bezPominjanja(opisPR({ autor, izvor, nazivKviza, nazivLekcije, paket, staro, novo })),
  });
  return { broj: pr.number, url: pr.html_url, naslov };
}

function opisPR({ autor, izvor, nazivKviza, nazivLekcije, paket, staro, novo }) {
  const red = (p) => {
    if (!p) return '_(novo pitanje)_';
    const o = p.vrsta === 'spoji' ? p.parovi.map((x) => `${x[0]} ↔ ${x[1]}`) : p.odgovori.map((x, i) => (i === 0 ? `**${x}** ✓` : x));
    return [`**${p.pitanje}**`, ...o.map((x) => `- ${x}`), p.objasnjenje ? `\n_Objašnjenje:_ ${p.objasnjenje}` : '', `\n_Zanimljivost:_ ${p.zanimljivost || '—'}`, `_Reč:_ ${p.rec || '—'} · _težina:_ ${p.tezina}`].filter(Boolean).join('\n');
  };
  return [
    `Predlog poslat iz urednika pitanja (\`/urednik\`).`,
    '',
    `- **Autor:** ${autor}`,
    `- **Kviz:** ${nazivKviza} (\`${paket}\`)${nazivLekcije ? ` · lekcija ${novo.lekcija}: ${nazivLekcije}` : ''}`,
    `- **Izvor / napomena:** ${izvor || '—'}`,
    '',
    staro ? '### Pre\n\n' + red(staro) + '\n\n### Posle\n\n' + red(novo) : '### Novo pitanje\n\n' + red(novo),
    '',
    '---',
    'Pre prihvatanja proveriti tačnost činjenica i uverljivost netačnih odgovora (vidi `kvizovi/UPUTSTVO.md`).',
  ].join('\n');
}

// ───── stanje predloga (za „Moji predlozi“ u uredniku) – keš da se ne troši GitHub limit ─────
const kesStanja = new Map(); // broj -> { do, v }
async function stanje(brojevi) {
  if (!ukljuceno()) throw new Greska('Predlaganje nije podešeno na ovom serveru.', 503);
  const out = {};
  if (kesStanja.size > 5000) kesStanja.clear(); // keš ne sme da raste bez kraja
  for (const n of brojevi.slice(0, 30)) {
    const k = kesStanja.get(n);
    if (k && k.do > Date.now()) { out[n] = k.v; continue; }
    try {
      const pr = await gh('GET', `/repos/${REPO}/pulls/${n}`);
      const v = {
        stanje: pr.merged_at ? 'prihvacen' : pr.state === 'closed' ? 'odbijen' : 'ceka',
        komentari: (pr.comments || 0) + (pr.review_comments || 0),
        url: pr.html_url,
        naslov: pr.title,
      };
      kesStanja.set(n, { do: Date.now() + 60e3, v });
      out[n] = v;
    } catch (e) {
      // nepostojeći broj se pamti duže – da ponovljeni upiti za izmišljene brojeve ne troše GitHub limit robota
      if (e.status === 404) kesStanja.set(n, { do: Date.now() + 600e3, v: null });
      out[n] = null;
    }
  }
  return out;
}

module.exports = { predlozi, stanje, ukljuceno, proveriPitanje, sastavi, Greska, REPO };
