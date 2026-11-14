// Bonus krug „Na slovo…“: zadato je slovo, a igrači nabrajaju što više pojmova na to slovo
// (zanimljiva geografija: država, grad, reka, planina; matematičari i fizičari; istorijske ličnosti; sportisti).
// Rečnici su u podaci/bonus/<vrsta>.json (gradi ih alati/gradi-bonus.js iz Wikidate).
//
// Priznaje se:
//   – latinica i ćirilica, sa i bez kvačica (Čačak = Cacak = Чачак), velika/mala slova, crtice i tačke;
//   – svaki naziv iz Wikidate na srpskom, hrvatskom, bosanskom, engleskom i nemačkom (Ojler = Euler);
//   – sitna slovna greška: 1 slovo kod reči do 6 slova, 2 slova kod dužih (Mihailo Pupin → Mihajlo Pupin),
//     ali ne pogrešno ime (Marko Pupin) ni pojam koji ne počinje zadatim slovom;
//   – za ličnosti i samo prezime (Pupin) ili ime pod kojim je poznat (Pitagora, Napoleon).
// Početno slovo se gleda po srpskom nazivu (Ojler je na O, a ne na E; Njujork je na Nj, a ne na N).
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'podaci', 'bonus');
const AZBUKA = [...'абвгдђежзијклљмнњопрстћуфхцчџш'];

// ćirilica → „ravna“ latinica (bez kvačica), za poređenje
const RAVNO = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'dj', е: 'e', ж: 'z', з: 'z', и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj',
  м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r', с: 's', т: 't', ћ: 'c', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'c',
  џ: 'dz', ш: 's',
};
const LAT = { ...RAVNO, ђ: 'đ', ж: 'ž', ћ: 'ć', ч: 'č', џ: 'dž', ш: 'š' };
const uLatinicu = (t) => [...String(t)].map((c) => { const l = LAT[c.toLowerCase()]; return l === undefined ? c : c === c.toLowerCase() ? l : l[0].toUpperCase() + l.slice(1); }).join('');

function ravno(s) {
  s = [...String(s).toLowerCase()].map((c) => RAVNO[c] ?? c).join('');
  s = s.replace(/đ/g, 'dj').replace(/ß/g, 'ss').replace(/æ/g, 'ae').replace(/œ/g, 'oe').replace(/ø/g, 'o').replace(/ł/g, 'l').replace(/ı/g, 'i');
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
// prvo slovo srpskog naziva (ćirilica, ili latinica sa digrafima lj/nj/dž)
function prvoSlovo(ime) {
  const s = String(ime).trim().toLowerCase();
  if (/^[а-шђјљњћџ]/.test(s)) return s[0];
  const dva = s.slice(0, 2);
  if (dva === 'lj') return 'љ';
  if (dva === 'nj') return 'њ';
  if (dva === 'dž') return 'џ';
  const m = { a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', đ: 'ђ', e: 'е', ž: 'ж', z: 'з', i: 'и', j: 'ј', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т', ć: 'ћ', u: 'у', f: 'ф', h: 'х', c: 'ц', č: 'ч', š: 'ш' };
  return m[s[0]] || null;
}
// „ravno“ prvo slovo – kad igrač kuca bez kvačica, Cacak je na Č (c), a Djakovica/Dakovica na Đ (d)
const RAVNO_SLOVO = (sl) => RAVNO[sl][0];

// reči koje nisu ime po kome je ličnost poznata (Karlo Veliki je na K, a ne na V)
const NADIMCI = new Set(['велики', 'свети', 'света', 'млади', 'стари', 'мали', 'грозни', 'освајач', 'смели', 'добри', 'лепи',
  'први', 'други', 'трећи', 'цар', 'краљ', 'кнез', 'деспот', 'војвода', 'султан', 'папа', 'сер', 'да', 'де', 'ди', 'дел', 'фон', 'ван', 'ал', 'ел', 'ибн', 'бин', 'од', 'из']);
const RIMSKI = /^[ivxlcdm]+\.?$/i;
const znacajne = (ime) => String(ime).split(/[\s,]+/).filter((w) => w && !RIMSKI.test(uLatinicu(w)) && !NADIMCI.has(w.toLowerCase()) && !/^\(/.test(w));

// ───────── učitavanje ─────────
let ucitano = false;
let vrste = {}; // vrsta -> { naziv, kategorije: [{ id, naziv, ikona, licnosti, stavke }] , tacno: Map, poSlovu: Map, slova }
const poQ = new Map(); // q -> stavka (za slike)

function pripremiStavku(s, k) {
  // ključna slova: po kojima se stavka računa (za mesta: naziv; za ličnosti: prezime ili ime pod kojim je poznat)
  const kljucevi = new Set();
  const glavni = new Set(); // ključna slova samo po glavnom nazivu (za predloge računara – bez neobičnih drugih naziva)
  const oblici = new Set(); // „ravni“ oblici koji se priznaju
  const srpska = [s.ime, ...(s.sr || [])];
  const sva = [...srpska, ...(s.imena || [])];
  for (const ime of sva) { const r = ravno(ime); if (r) oblici.add(r); }
  if (!k.licnosti) {
    for (const ime of srpska) { const p = prvoSlovo(ime); if (p) kljucevi.add(p); }
    glavni.add(prvoSlovo(s.ime));
  } else {
    // po prezimenu (Pupin, Ojler, Đoković); vladari po imenu (Napoleon I, Petar I, Stefan Nemanja – bez prezimena
    // u Wikidati), antički po imenu (Tales iz Mileta), a jednorečna imena su sama ključ (Pitagora, Pele)
    if (s.prezime) { kljucevi.add(prvoSlovo(s.prezime)); oblici.add(ravno(s.prezime)); }
    srpska.forEach((ime, i) => {
      const pre = new Set(kljucevi);
      const reci = String(ime).split(/[\s,]+/);
      const iz = reci.findIndex((w) => ['из', 'од'].includes(w.toLowerCase()));
      const r = znacajne(ime);
      if (iz > 0) kljucevi.add(prvoSlovo(reci[0]));
      else if (r.length) {
        kljucevi.add(prvoSlovo(r[r.length - 1]));
        const vladar = reci.some((w) => RIMSKI.test(uLatinicu(w)));
        if (r.length === 1 || vladar || (k.vladari && !s.prezime)) kljucevi.add(prvoSlovo(r[0]));
      }
      if (i === 0) for (const x of kljucevi) if (!pre.has(x)) glavni.add(x);
    });
    if (s.prezime) glavni.add(prvoSlovo(s.prezime));
    // skraćeni oblici: samo prezime (Pupin), ime i prezime bez srednjeg imena (Karl Gaus), poslednje dve reči (da Vinči)
    for (const ime of sva) {
      const reci = ravno(ime).split(' ');
      if (reci.length < 2) continue;
      const pos = reci[reci.length - 1];
      if (pos.length >= 3 && !RIMSKI.test(pos)) oblici.add(pos);
      oblici.add(reci.slice(-2).join(' '));
      oblici.add(reci[0] + ' ' + pos);
    }
  }
  // oblici glavnog naziva (i njegovi skraćeni oblici kod ličnosti); drugi srpski nazivi se pamte da bi se igraču
  // reklo pod kojim imenom je pojam priznat („Crkvena planina (Gramada)“)
  const g = ravno(s.ime);
  const go = new Set([g]);
  if (k.licnosti) {
    const reci = g.split(' ');
    if (reci.length > 1) { go.add(reci[reci.length - 1]); go.add(reci.slice(-2).join(' ')); go.add(reci[0] + ' ' + reci[reci.length - 1]); }
    if (s.prezime) go.add(ravno(s.prezime));
  }
  s.glavniOblici = go;
  s.drugaImena = new Map((s.sr || []).map((x) => [ravno(x), x]).filter(([r]) => !go.has(r)));
  kljucevi.delete(null);
  glavni.delete(null);
  s.kljucevi = [...kljucevi];
  s.kljucGlavni = [...glavni];
  s.oblici = [...oblici].filter((o) => o.length >= 2);
}

function ucitaj() {
  ucitano = true;
  vrste = {};
  poQ.clear();
  let ukupno = 0;
  let fajlovi = [];
  try { fajlovi = fs.readdirSync(DIR).filter((f) => f.endsWith('.json')); } catch { return 0; }
  for (const f of fajlovi) {
    let d;
    try { d = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch (e) { console.error(`bonus/${f}:`, e.message); continue; }
    const V = { id: f.replace(/\.json$/, ''), naziv: d.naziv, kategorije: d.kategorije, tacno: new Map(), poSlovu: new Map() };
    for (const k of V.kategorije) {
      k.poQ = new Map();
      for (const s of k.stavke) {
        pripremiStavku(s, k);
        k.poQ.set(s.q, s);
        if (!poQ.has(s.q)) poQ.set(s.q, s);
        for (const o of s.oblici) {
          if (!V.tacno.has(o)) V.tacno.set(o, []);
          V.tacno.get(o).push({ k, s, o });
        }
      }
      ukupno += k.stavke.length;
      // po koliko poznatih stavki (najpoznatijih 400) ima svako slovo – za izbor slova
      k.poznatihNa = {};
      for (const s of k.stavke.slice(0, 400)) for (const sl of s.kljucevi) k.poznatihNa[sl] = (k.poznatihNa[sl] || 0) + 1;
    }
    // slova sa dovoljno poznatih pojmova u SVAKOJ kategoriji (težina = najslabija kategorija)
    V.slova = AZBUKA.map((sl) => ({ sl, t: Math.min(...V.kategorije.map((k) => k.poznatihNa[sl] || 0)) })).filter((x) => x.t >= (V.kategorije.length > 1 ? 3 : 8));
    vrste[V.id] = V;
  }
  return ukupno;
}

const postoji = (vrsta) => !!vrste[vrsta];
const spisakVrsta = () => Object.keys(vrste);
function opis(vrsta) {
  const V = vrste[vrsta];
  if (!V) return null;
  return { vrsta, naziv: V.naziv, kategorije: V.kategorije.map((k) => ({ id: k.id, naziv: k.naziv, ikona: k.ikona, licnosti: !!k.licnosti })) };
}

// slovo za krug: nasumično, češće slova sa više poznatih pojmova; bez ponavljanja u istoj partiji
function izaberiSlovo(vrsta, bilo = []) {
  const V = vrste[vrsta];
  let lista = V.slova.filter((x) => !bilo.includes(x.sl));
  if (!lista.length) lista = V.slova;
  let x = Math.random() * lista.reduce((a, l) => a + Math.sqrt(l.t), 0);
  return (lista.find((l) => (x -= Math.sqrt(l.t)) <= 0) || lista[lista.length - 1]).sl;
}

// Damerau-Levenshtein sa prekidom kad pređe granicu
function razlika(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const n = a.length, m = b.length;
  let pp = null, p = Array.from({ length: m + 1 }, (_, j) => j);
  for (let i = 1; i <= n; i++) {
    const t = [i];
    let min = i;
    for (let j = 1; j <= m; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(p[j] + 1, t[j - 1] + 1, p[j - 1] + c);
      if (pp && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, pp[j - 2] + 1);
      t.push(v);
      if (v < min) min = v;
    }
    if (min > max) return max + 1;
    pp = p; p = t;
  }
  return p[m];
}
const dozvoljeno = (r) => { const n = r.replace(/ /g, '').length; return n <= 4 ? 0 : n <= 8 ? 1 : 2; };

// oblici stavki koje važe za dato slovo (za traženje sa slovnom greškom), keširano po vrsti i slovu
function obliciZaSlovo(V, sl) {
  if (!V.poSlovu.has(sl)) {
    const out = [];
    for (const k of V.kategorije) for (const s of k.stavke) if (s.kljucevi.includes(sl)) for (const o of s.oblici) out.push({ o, k, s });
    V.poSlovu.set(sl, out);
  }
  return V.poSlovu.get(sl);
}

// da li neka reč koju je igrač napisao počinje zadatim slovom (bez obzira na kvačice)
function napisanoNaSlovo(r, sl) {
  const p = RAVNO_SLOVO(sl);
  return r.split(' ').some((w) => w[0] === p);
}

// Proverava unos. Vraća { pogoci: [{ kat, q }], ispravljeno } ili { greska: 'poruka' }.
// Isti naziv može da važi u više kategorija (Kongo: država i reka) – tada se računa u svakoj.
function proveri(vrsta, sl, unos) {
  const V = vrste[vrsta];
  if (!V) return { greska: 'Nema rečnika' };
  const r = ravno(unos);
  if (r.replace(/ /g, '').length < 2) return { greska: 'Prekratko' };
  // najbolji pogodak: prvo po glavnom nazivu, pa najpoznatiji. U još neku kategoriju pojam ulazi samo ako je i tamo
  // napisan glavni naziv (Niger – država i reka), a ne neki drugi naziv (Crna Gora nije i „Skopska Crna gora“).
  // Sa slovnom greškom – samo jedan pogodak (Granada nije i Grenada i Gramada).
  const glavno = (x) => x.s.glavniOblici.has(x.o);
  const najbolji = (lista, viseKategorija) => {
    lista = [...lista].sort((a, b) => glavno(b) - glavno(a) || b.s.sl - a.s.sl);
    const out = [lista[0]];
    if (viseKategorija) for (const x of lista) if (glavno(x) && !out.some((y) => y.k.id === x.k.id)) out.push(x);
    return out.map((x) => ({ kat: x.k.id, q: x.s.q, kao: glavno(x) ? null : x.s.drugaImena.get(x.o) || null }));
  };
  const tacni = V.tacno.get(r) || [];
  const naSlovo = napisanoNaSlovo(r, sl);
  // napisan je deo imena na drugo slovo (samo „Nemanja“, a traži se S) – ne važi; strani oblik (Euler za Ojlera) važi
  const drugiDeo = (x) => !naSlovo && x.s.kljucevi.some((kl) => napisanoNaSlovo(r, kl));
  const valja = tacni.filter((x) => x.s.kljucevi.includes(sl) && !drugiDeo(x));
  if (valja.length) return { pogoci: najbolji(valja, true) };
  // sa slovnom greškom – samo među pojmovima na zadato slovo (i samo ako tačno napisan pojam ne postoji na drugo slovo)
  const max = dozvoljeno(r);
  if (max && naSlovo && !tacni.length) {
    let min = max + 1, nadjeni = [];
    for (const x of obliciZaSlovo(V, sl)) {
      if (Math.abs(x.o.length - r.length) > min) continue;
      const d = razlika(r, x.o, min);
      if (d < min) { min = d; nadjeni = [x]; } else if (d === min && d <= max) nadjeni.push(x);
    }
    if (min <= max && nadjeni.length) return { pogoci: najbolji(nadjeni, false), ispravljeno: true };
  }
  if (tacni.length) {
    // pojam postoji, ali nije na zadato slovo (Euler je Ojler – na O)
    const x = tacni.sort((a, b) => b.s.sl - a.s.sl)[0];
    const S = (z) => uLatinicu(z).replace(/^./, (c) => c.toUpperCase());
    if (x.s.kljucevi.includes(sl)) return { greska: `Napiši deo imena koji počinje na ${S(sl)} (${uLatinicu(x.s.ime)})` };
    return { greska: `${uLatinicu(x.s.ime)} se računa na ${x.s.kljucevi.map(S).join(' ili ')}, a ne na ${S(sl)}` };
  }
  return { greska: 'Ne nalazim – proveri slovo i pravopis' };
}

const stavka = (vrsta, kat, q) => vrste[vrsta]?.kategorije.find((k) => k.id === kat)?.poQ.get(q) || null;
const kategorija = (vrsta, kat) => vrste[vrsta]?.kategorije.find((k) => k.id === kat) || null;

const broj = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
function godine(s) {
  const g = (x) => (x < 0 ? `${-x}. p. n. e.` : `${x}.`);
  if (s.rodjen == null && s.umro == null) return '';
  if (s.umro == null) return `rođen ${g(s.rodjen)}`;
  if (s.rodjen == null) return `umro ${g(s.umro)}`;
  return s.rodjen < 0 && s.umro < 0 ? `${-s.rodjen}–${-s.umro}. p. n. e.` : `${g(s.rodjen)} – ${g(s.umro)}`;
}

// podaci za prikaz na kraju kruga (ćirilični nazivi iz Wikidate idu kako jesu – klijent ih preslovljava)
function prikaz(vrsta, kat, q) {
  const s = stavka(vrsta, kat, q);
  if (!s) return null;
  const k = kategorija(vrsta, kat);
  const info = [];
  const spoji = (l) => (l || []).join(', ');
  if (k.licnosti) {
    if (s.nobel?.length) info.push('🏅 ' + spoji(s.nobel));
    if (s.delo?.length) info.push('Poznat po: ' + spoji(s.delo));
    if (s.polozaj?.length) info.push(spoji(s.polozaj.slice(0, 2)));
    if (s.sport?.length) info.push(spoji(s.sport));
    if (s.zemlja?.length) info.push(spoji(s.zemlja.slice(0, 2)));
  } else {
    if (s.zemlja?.length) info.push(spoji(s.zemlja));
    if (s.glavni?.length) info.push('Glavni grad: ' + spoji(s.glavni.slice(0, 1)));
    if (s.stanovnika) info.push(broj(s.stanovnika) + ' stanovnika');
    if (s.duzina) info.push(broj(s.duzina) + ' km');
    if (s.visina) info.push(broj(s.visina) + ' m');
  }
  return {
    q: s.q, kat, ime: s.ime, opis: s.opis || (s.zanimanje || []).slice(0, 2).join(', '), godine: k.licnosti ? godine(s) : '',
    info, slika: k.licnosti && s.slika ? `/api/slika-bonus?q=${s.q}` : null, clanak: s.clanak || null,
  };
}

// najpoznatiji pojmovi na slovo koje niko nije naveo – „mogli ste i…“. Mesta: samo ona čiji naziv počinje slovom
// (ne „Sjedinjene Američke Države“ za A); ličnosti: po prezimenu. Kod naučnika samo oni kojima opis kaže da su
// matematičari/fizičari/astronomi (u Wikidati se kao „fizičar“ ponegde vodi i filozof ili vladar).
const OPIS_PREDLOGA = {
  naucnik: /математи|физич|астроном|проналаз/i,
  licnost: /владар|краљ|цар|кнез|војсков|генерал|политич|председник|император|фараон|султан|истражив|револуционар|државник|деспот|вожд|војвод|папа|принц|кнегињ|херцег|маршал|диктатор|премијер|освајач|морепловац|вођ|устаник|бан |калиф|хан |адмирал|канцелар|министар/i,
  sportista: /фудбал|кошарк|тенис|одбојк|ватерпол|рукомет|атлет|пливач|спорт|шахист|шахов|боксер|возач|скија|гимнаст|бициклист|голф|хокеј|играч|олимпиј|маратон|рвач|џудист|каратист|веслач|кајакаш|стреља|мачевал|спринтер|тркач|скакач|бацач/i,
};
function predlozi(vrsta, kat, sl, bez = new Set(), n = 5) {
  const k = kategorija(vrsta, kat);
  if (!k) return [];
  const out = [];
  for (const s of k.stavke) {
    if (out.length >= n) break;
    if (bez.has(s.q) || !s.kljucGlavni.includes(sl)) continue;
    if (OPIS_PREDLOGA[kat] && !OPIS_PREDLOGA[kat].test(s.opis || '')) continue;
    out.push(s.q);
  }
  return out;
}

const slikaZa = (q) => poQ.get(q)?.slika || null;

// rečnici se učitavaju pri prvoj upotrebi (server ih učitava odmah pri pokretanju)
const lenjo = (f) => (...a) => { if (!ucitano) ucitaj(); return f(...a); };
module.exports = {
  ucitaj, ravno, uLatinicu,
  ...Object.fromEntries(Object.entries({ postoji, spisakVrsta, opis, izaberiSlovo, proveri, stavka, prikaz, predlozi, slikaZa }).map(([k, f]) => [k, lenjo(f)])),
};
