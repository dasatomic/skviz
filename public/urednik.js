// Urednik pitanja (/urednik): izbor predmeta → spisak pitanja → izmena/novo pitanje sa pregledom → „Predloži“ (pull request).
// Namenjen je ljudima koji ne znaju JSON: sve se popunjava kroz obična polja, a server sastavlja kviz.json (lib/predlozi.js).
'use strict';
const { prikaziMedij } = window.Mediji;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const glavni = $('#urednik');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ls = {
  get: (k, d) => { try { const v = localStorage.getItem('urednik-' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem('urednik-' + k, JSON.stringify(v)); } catch {} },
};
const RAZREDI = [5, 6, 7, 8];
const TEZINE = { 1: 'Lako', 2: 'Srednje', 3: 'Teško' };
const VRSTE = { izbor: 'Obično pitanje', uljez: 'Izbaci uljeza', spoji: 'Spoj pojmove' };
const IKONE_VRSTA = { uljez: '🕵️', spoji: '🔗' };

let kvizovi = [];       // iz /api/kvizovi (bez „Opšte znanje“ i bez matematičkih zadataka)
let ukljuceno = false;  // da li server može da otvara pull request-ove
let kviz = null;        // učitan kviz.json izabranog paketa
let kvizId = null;
let izmenjeno = false;  // nesačuvane izmene u formi
let ciscenjeMedija = null;

function poruka(t, ms = 2600) {
  const el = $('#poruka');
  el.textContent = t;
  el.classList.add('vidljiva');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('vidljiva'), ms);
}

// tekst sa matematikom ($…$), kao u igri
function mat(t) {
  // kviz o programiranju ("kod": "rust" | "tla"): $…$ je obojen kôd, kao u igri
  if (kviz?.kod) return String(t ?? '').split(/\$([^$]+)\$/).map((d, i) => (i % 2 ? `<code class="kod-uz">${window.Mediji.bojiKod(d, kviz.kod)}</code>` : esc(d).replace(/\n/g, '<br>'))).join('');
  return esc(t).replace(/\$([^$]+)\$/g, (_, m) => `<span class="mat">${m}</span>`).replace(/\n/g, '<br>');
}

// ───── adresa (hash): #paket=razred5-biologija&lekcija=3&pitanje=12 | pitanje=novo | #oblast=biologija ─────
function citajAdresu() {
  const p = new URLSearchParams(location.hash.slice(1));
  return { oblast: p.get('oblast'), paket: p.get('paket'), lekcija: p.get('lekcija') ? +p.get('lekcija') : null, pitanje: p.get('pitanje') };
}
function adresa(o) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== null && v !== undefined && v !== '') p.set(k, v);
  return '#' + p.toString();
}
let prethodnaAdresa = location.hash;
function idi(o) {
  const h = typeof o === 'string' ? o : adresa(o);
  if (h === location.hash) return crtaj();
  location.hash = h;
}
window.addEventListener('hashchange', () => {
  if (izmenjeno && !confirm('Imaš izmene koje nisu predložene. Da li sigurno želiš da odeš sa ove strane?')) {
    history.replaceState(null, '', prethodnaAdresa);
    return;
  }
  izmenjeno = false;
  crtaj();
});
window.addEventListener('beforeunload', (e) => { if (izmenjeno) { e.preventDefault(); e.returnValue = ''; } });

// ───── podaci ─────
async function ucitajKvizove() {
  const [lista, info] = await Promise.all([
    fetch('/api/kvizovi').then((r) => r.json()),
    fetch('/api/predlog/info').then((r) => r.json()).catch(() => ({})),
  ]);
  kvizovi = lista.filter((k) => k.id !== 'opste' && !k.zadaci);
  ukljuceno = !!info.ukljuceno;
}
async function ucitajKviz(id) {
  if (kvizId === id && kviz) return kviz;
  const r = await fetch(`/kvizovi/${encodeURIComponent(id)}/kviz.json`, { cache: 'no-store' });
  if (!r.ok) throw new Error('Kviz nije pronađen');
  kviz = await r.json();
  kvizId = id;
  return kviz;
}
// pitanja koja su igrači prijavili kao pogrešna (nerešena) – /api/prijave
let prijave = [];
async function ucitajPrijave() {
  try { prijave = await (await fetch('/api/prijave', { cache: 'no-store' })).json(); } catch { prijave = []; }
  if (!Array.isArray(prijave)) prijave = [];
}
const prijavaZa = (paket, tekst) => prijave.find((x) => x.paket === paket && x.tekst === tekst);
const natpisPrijava = (n) => `${n} ${n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'prijave' : 'prijava'}`;

const kvizPo = (id) => kvizovi.find((k) => k.id === id);
const nazivLekcije = (l) => (typeof l === 'string' ? l : l?.naziv || '');

function grupaOblasti(o) {
  const clanovi = kvizovi.filter((x) => x.oblast === o);
  // kategorija (kviz sa "kategorija": true, bez pitanja) okuplja podkategorije iste oblasti – npr. „Eksperimenti“ → TLA+
  const g = clanovi.find((x) => x.kategorija) || clanovi.find((x) => !x.razred) || clanovi[0] || {};
  const podkategorije = g.kategorija ? clanovi.filter((x) => x !== g && !x.razred) : [];
  return { oblast: o, clanovi, podkategorije, naziv: g.razred ? g.naziv.replace(/^\d+\. razred · /, '') : g.naziv, ikona: g.ikona, broj: clanovi.reduce((s, x) => s + x.broj, 0) };
}

// ───── 1) početna: autor, izbor predmeta, moji predlozi ─────
function ekranPocetna() {
  const kartice = [];
  const vidjene = new Set();
  for (const q of kvizovi) {
    if (!q.oblast) { kartice.push({ h: adresa({ paket: q.id }), naziv: q.naziv, ikona: q.ikona, broj: q.broj }); continue; }
    if (vidjene.has(q.oblast)) continue;
    vidjene.add(q.oblast);
    const g = grupaOblasti(q.oblast);
    const razredi = g.clanovi.some((x) => x.razred);
    // oblast (ili kategorija) sa jednim kvizom odmah vodi na njega
    const jedini = g.podkategorije.length === 1 ? g.podkategorije[0] : !g.podkategorije.length && g.clanovi.length === 1 ? g.clanovi[0] : null;
    kartice.push({ h: jedini ? adresa({ paket: jedini.id }) : adresa({ oblast: q.oblast }), naziv: g.naziv, ikona: g.ikona, broj: g.broj, razredi });
  }
  glavni.innerHTML = `
    <div class="u-uvod">
      <h1>✏️ Urednik pitanja</h1>
      <p>Ovde možeš da <b>ispraviš postojeće pitanje</b> ili <b>dodaš novo</b>. Ne moraš ništa da znaš o programiranju:</p>
      <ol>
        <li>izaberi predmet (i razred, ako ih ima),</li>
        <li>klikni na pitanje koje želiš da izmeniš ili na „Dodaj novo pitanje“,</li>
        <li>popuni polja – desno odmah vidiš kako će pitanje izgledati na telefonu,</li>
        <li>klikni „Predloži“. Urednik igre pregleda predlog i, ako je sve u redu, pitanje ulazi u igru.</li>
      </ol>
      ${ukljuceno ? '' : '<div class="u-upozorenje">⚠ Na ovom serveru slanje predloga nije podešeno – možeš da pregledaš i probaš urednik, ali dugme „Predloži“ neće raditi.</div>'}
    </div>
    <div class="kartica" style="max-width:820px">
      <label class="u-polje"><span class="natpis">Tvoje ime i prezime</span>
        <input id="autor" maxlength="80" placeholder="npr. Milica Petrović" value="${esc(ls.get('autor', ''))}">
        <span class="pomoc">Upisuje se uz pitanja koja predložiš (samo radi evidencije – ne prikazuje se u igri). Pamti se na ovom računaru.</span></label>
    </div>
    <div class="kartica"><h3>Izaberi predmet</h3><div class="kvizovi u-kvizovi">${kartice.map((q) => `
      <button class="kviz" data-h="${q.h}"><div class="ik">${q.ikona}</div><div class="nz">${esc(q.naziv)}</div><div class="br">${q.broj} pitanja${q.razredi ? ' · po razredima' : ''}</div></button>`).join('')}</div></div>
    ${karticaPrijava()}
    <div class="kartica" id="moji-predlozi" hidden></div>`;
  $$('[data-prijava]').forEach((b) => (b.onclick = () => otvoriPrijavu(prijave[+b.dataset.prijava])));
  $('#autor').oninput = (e) => ls.set('autor', e.target.value.trim());
  $$('[data-h]').forEach((b) => (b.onclick = () => idi(b.dataset.h)));
  mojiPredlozi();
}

function karticaPrijava() {
  if (!prijave.length) return '';
  return `<div class="kartica"><h3>⚠️ Prijavljena pitanja</h3>
    <p class="sitno">Igrači su tokom igre označili ova pitanja kao pogrešna. Klikni na pitanje, proveri ga i, ako treba, predloži ispravku.</p>
    <ul class="u-prijave">${prijave.map((x, i) => `<li data-prijava="${i}" class="${x.nema ? 'nema' : ''}">
      <span class="u-broj-prijava" title="${natpisPrijava(x.broj)}">${x.broj}</span>
      <span class="naslov">${mat(x.tekst)}<br><span class="sitno">${esc(x.kviz)}${x.lekcija ? ` · ${x.lekcija}. ${esc(x.nazivLekcije || 'lekcija')}` : ''} · tačan odgovor: ${mat(x.odgovor)}
        ${x.izmenjeno || x.nema ? ' · <b>već izmenjeno</b>' : ''}</span></span></li>`).join('')}</ul></div>`;
}

// prijava → isto pitanje u kviz.json (po tekstu; redni broj u id-ju je samo rezerva)
async function otvoriPrijavu(x) {
  if (!x || !kvizPo(x.paket)) return poruka('Ovaj kviz se ne menja preko urednika');
  const K = await ucitajKviz(x.paket);
  let i = (K.pitanja || []).findIndex((p) => p.pitanje === x.tekst);
  if (i < 0) { poruka('Pitanje je u međuvremenu izmenjeno – otvaram spisak'); return idi({ paket: x.paket, lekcija: x.lekcija }); }
  idi({ paket: x.paket, lekcija: x.lekcija, pitanje: i });
}

async function mojiPredlozi() {
  const lista = ls.get('predlozi', []);
  const el = $('#moji-predlozi');
  if (!el || !lista.length) return;
  el.hidden = false;
  const crtajListu = (st = {}) => {
    el.innerHTML = `<h3>📬 Moji predlozi</h3>
      <p class="sitno">Predlozi poslati sa ovog računara. Klik na „Pogledaj“ otvara predlog na GitHub-u, gde urednik može da ostavi komentar ili pitanje.</p>
      <ul class="u-predlozi">${lista.slice().reverse().map((p) => {
        const s = st[p.broj];
        const oznaka = !s ? '<span class="u-stanje ceka">…</span>'
          : s.stanje === 'prihvacen' ? '<span class="u-stanje prihvacen">✓ Prihvaćeno</span>'
          : s.stanje === 'odbijen' ? '<span class="u-stanje odbijen">Nije prihvaćeno</span>'
          : '<span class="u-stanje ceka">⏳ Čeka pregled</span>';
        return `<li>${oznaka}<span class="naslov">${esc(p.naslov)}<br><span class="sitno">${new Date(p.datum).toLocaleDateString('sr-RS')}${s?.komentari ? ` · 💬 ${s.komentari} komentar${s.komentari === 1 ? '' : 'a'}` : ''}</span></span>
          <a href="${esc(p.url)}" target="_blank" rel="noopener">Pogledaj ↗</a></li>`;
      }).join('')}</ul>`;
  };
  crtajListu();
  try {
    const st = await (await fetch('/api/predlog/stanje?brojevi=' + lista.map((p) => p.broj).join(','))).json();
    if (!st.greska) crtajListu(st);
  } catch {}
}

// ───── 2) spisak pitanja (sa izborom razreda i lekcije) ─────
function izborRazreda(oblast, paketId) {
  const g = grupaOblasti(oblast);
  if (g.podkategorije.length) return `<div class="u-razredi"><b style="margin-right:6px">Tema:</b>
    ${g.podkategorije.map((k) => `<button data-h="${adresa({ paket: k.id })}" class="${k.id === paketId ? 'izabran' : ''}">${k.ikona} ${esc(k.naziv)}</button>`).join('')}</div>`;
  if (g.clanovi.length < 2) return '';
  const opsti = g.clanovi.filter((x) => !x.razred);
  return `<div class="u-razredi"><b style="margin-right:6px">Razred:</b>
    ${opsti.map((k) => `<button data-h="${adresa({ paket: k.id })}" class="${k.id === paketId ? 'izabran' : ''}">Opšti kviz</button>`).join('')}
    ${RAZREDI.map((n) => {
      const k = g.clanovi.find((x) => x.razred === n);
      return `<button ${k ? `data-h="${adresa({ paket: k.id })}"` : 'disabled title="Još nema pitanja za ovaj razred"'} class="${k && k.id === paketId ? 'izabran' : ''}">${n}.</button>`;
    }).join('')}</div>`;
}

function zaglavljePredmeta(oblast, paketId) {
  const g = oblast ? grupaOblasti(oblast) : null;
  const k = kvizPo(paketId);
  const ikona = g?.ikona || k?.ikona || '❓';
  const naziv = g?.naziv || k?.naziv || '';
  return `<div class="kartica"><div class="izabrani-predmet"><div class="ik">${ikona}</div><div class="nz">${esc(naziv)}</div>
    <button data-h="#">← Promeni predmet</button></div>
    ${oblast ? `<div style="margin-top:10px">${izborRazreda(oblast, paketId)}</div>` : ''}</div>`;
}

function ekranOblast(oblast) {
  glavni.innerHTML = zaglavljePredmeta(oblast, null) + `<div class="u-prazno">Izaberi ${grupaOblasti(oblast).podkategorije.length ? 'temu' : 'razred'} ☝️</div>`;
  $$('[data-h]').forEach((b) => (b.onclick = () => idi(b.dataset.h)));
}

const zvezdice = (t) => '★'.repeat(t || 2) + '<span style="opacity:.25">' + '★'.repeat(3 - (t || 2)) + '</span>';
const normalizuj = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj');

async function ekranSpisak(a) {
  const info = kvizPo(a.paket);
  if (!info) { glavni.innerHTML = '<div class="u-prazno">Ovaj kviz ne postoji ili se ne menja preko urednika. <a href="#">Nazad</a></div>'; return; }
  glavni.innerHTML = '<div class="u-prazno"><span class="u-ceka"></span>Učitavam pitanja…</div>';
  const K = await ucitajKviz(a.paket);
  const lekcije = K.lekcije || [];
  const pitanja = (K.pitanja || []).map((p, i) => ({ p, i }));
  const pretraga = ls.get('pretraga-' + a.paket, '');
  glavni.innerHTML = `${zaglavljePredmeta(info.oblast, a.paket)}
    <div class="kartica">
      <div class="u-alati">
        <h3 style="margin:0">${esc(K.naziv)}</h3><span class="sitno">${pitanja.length} pitanja</span>
        <span class="razmak"></span>
        <button class="dugme zeleno" id="novo">＋ Dodaj novo pitanje</button>
      </div>
      <div class="u-alati">
        ${lekcije.length ? `<select id="lekcija"><option value="">Sve lekcije</option>${lekcije.map((l, i) =>
          `<option value="${i + 1}" ${a.lekcija === i + 1 ? 'selected' : ''}>${i + 1}. ${esc(nazivLekcije(l))} (${pitanja.filter((x) => x.p.lekcija === i + 1).length})</option>`).join('')}</select>` : ''}
        <input class="u-pretraga" id="pretraga" placeholder="🔍 Traži u pitanjima i odgovorima…" value="${esc(pretraga)}">
        <span class="sitno" id="broj-nadjenih"></span>
      </div>
      <table class="u-tabela"><thead><tr><th>#</th>${lekcije.length ? '<th>Lekcija</th>' : ''}<th>Težina</th><th>Pitanje</th><th>Tačan odgovor</th><th>Autor</th></tr></thead>
        <tbody id="redovi"></tbody></table>
    </div>`;
  const crtajRedove = () => {
    const q = normalizuj($('#pretraga').value.trim());
    const lek = a.lekcija;
    const vidljiva = pitanja.filter(({ p }) => (!lek || p.lekcija === lek) && (!q || normalizuj([p.pitanje, ...(p.odgovori || []), ...(p.parovi || []).flat(), p.autor].join(' ')).includes(q)));
    $('#broj-nadjenih').textContent = q || lek ? `prikazano ${vidljiva.length}` : '';
    $('#redovi').innerHTML = vidljiva.length ? vidljiva.map(({ p, i }) => `<tr class="red-pitanja" data-i="${i}">
      <td class="br">${i + 1}</td>${lekcije.length ? `<td class="br">${p.lekcija || ''}</td>` : ''}
      <td class="zv">${zvezdice(p.tezina)}</td>
      <td>${prijavaZa(a.paket, p.pitanje) ? `<span class="u-prijavljeno" title="${natpisPrijava(prijavaZa(a.paket, p.pitanje).broj)} da je pogrešno">⚠️ ${prijavaZa(a.paket, p.pitanje).broj}</span> ` : ''}${IKONE_VRSTA[p.vrsta] ? IKONE_VRSTA[p.vrsta] + ' ' : ''}${mat(p.pitanje)}</td>
      <td class="tacan">${p.vrsta === 'spoji' ? `<span class="sitno">${p.parovi?.length || 0} para</span>` : (p.vrsta === 'uljez' ? 'uljez: ' : '') + mat(p.odgovori?.[0] || '')}</td>
      <td class="autor">${esc(p.autor || '')}</td></tr>`).join('')
      : `<tr><td colspan="6" class="u-prazno">Nema pitanja${q ? ' za ovu pretragu' : ''}.</td></tr>`;
    $$('#redovi tr[data-i]').forEach((tr) => (tr.onclick = () => idi({ paket: a.paket, lekcija: a.lekcija, pitanje: tr.dataset.i })));
  };
  $('#pretraga').oninput = (e) => { ls.set('pretraga-' + a.paket, e.target.value); crtajRedove(); };
  if ($('#lekcija')) $('#lekcija').onchange = (e) => idi({ paket: a.paket, lekcija: e.target.value });
  $('#novo').onclick = () => idi({ paket: a.paket, lekcija: a.lekcija, pitanje: 'novo' });
  $$('[data-h]').forEach((b) => (b.onclick = () => idi(b.dataset.h)));
  crtajRedove();
}

// ───── 3) izmena / novo pitanje ─────
let F = null; // stanje forme: { vrsta, tezina, lekcija, pitanje, odgovori[4], parovi[[l,d]], objasnjenje, zanimljivost, rec, mediji }

function izPitanja(p) {
  return {
    vrsta: p.vrsta === 'uljez' || p.vrsta === 'spoji' ? p.vrsta : 'izbor',
    tezina: p.tezina || 2,
    lekcija: p.lekcija || null,
    pitanje: p.pitanje || '',
    odgovori: [0, 1, 2, 3].map((i) => p.odgovori?.[i] || ''),
    parovi: p.parovi?.length ? p.parovi.map((x) => [...x]) : [['', ''], ['', ''], ['', ''], ['', '']],
    objasnjenje: p.objasnjenje || '',
    zanimljivost: p.zanimljivost || '',
    rec: p.rec || '',
    mediji: p.mediji || null,
  };
}

// ono što se šalje serveru (server ponovo proverava i sastavlja konačan oblik)
function zaSlanje() {
  return {
    vrsta: F.vrsta,
    tezina: F.tezina,
    lekcija: F.lekcija || undefined,
    pitanje: F.pitanje,
    odgovori: F.vrsta === 'spoji' ? undefined : F.odgovori,
    parovi: F.vrsta === 'spoji' ? F.parovi.filter((x) => x[0].trim() || x[1].trim()) : undefined,
    objasnjenje: F.objasnjenje,
    zanimljivost: F.zanimljivost,
    rec: F.rec,
    mediji: F.mediji || undefined,
  };
}

// broj slova kao u igri (lj, nj, dž su po jedno slovo)
const brojSlova = (r) => r.toLowerCase().replace(/lj|nj|dž/g, '#').length;
const DOZVOLJENA = /^([a-zčćžšđ]|[а-шђјљњћџ])+$/;

function proveri() {
  const g = [], u = [];
  const lek = kviz.lekcije || [];
  if (lek.length && !F.lekcija) g.push('Izaberi lekciju.');
  if (!F.pitanje.trim()) g.push('Upiši tekst pitanja.');
  if (F.vrsta === 'spoji') {
    const P = F.parovi.filter((x) => x[0].trim() || x[1].trim());
    if (P.length < 3) g.push('„Spoj pojmove“ mora imati bar 3 para.');
    if (P.some((x) => !x[0].trim() || !x[1].trim())) g.push('Svaki par mora imati popunjena oba pojma.');
    if (new Set(P.map((x) => x[0].trim().toLowerCase())).size !== P.length) g.push('Pojmovi levo se ponavljaju.');
    if (new Set(P.map((x) => x[1].trim().toLowerCase())).size !== P.length) g.push('Pojmovi desno se ponavljaju.');
  } else {
    if (F.odgovori.some((x) => !x.trim())) g.push('Upiši sva 4 odgovora.');
    else if (new Set(F.odgovori.map((x) => x.trim().toLowerCase())).size !== 4) g.push('Odgovori se ponavljaju – svaki mora biti drugačiji.');
    const d = F.odgovori.map((x) => x.trim().length);
    if (F.vrsta === 'izbor' && d[0] > 12 && d[0] > 1.4 * Math.max(d[1], d[2], d[3]))
      u.push('Tačan odgovor je primetno duži od netačnih – igrači bi mogli da ga pogode po dužini. Probaj da ga skratiš ili da produžiš netačne.');
  }
  if (F.vrsta === 'uljez' && !F.objasnjenje.trim()) g.push('Napiši objašnjenje: zašto je baš to uljez.');
  if (!F.zanimljivost.trim()) g.push('Napiši zanimljivost („Da li si znao?“).');
  const r = F.rec.trim();
  if (r && !DOZVOLJENA.test(r.toLowerCase())) g.push('Ključna reč sme da ima samo slova srpske azbuke (bez razmaka i cifara).');
  else if (r && (brojSlova(r) < 3 || brojSlova(r) > 11)) g.push('Ključna reč mora imati od 3 do 11 slova.');
  if (!r) u.push('Nema ključne reči – igra će je izabrati sama, ali bolje je da je upišeš.');
  if (F.zanimljivost.trim() && F.vrsta !== 'spoji' && F.zanimljivost.trim().toLowerCase() === F.odgovori[0].trim().toLowerCase()) u.push('Zanimljivost samo ponavlja odgovor – napiši nešto novo i neočigledno.');
  return { g, u };
}

const polje = (natpis, unutra, pomoc = '', id = '') => `<label class="u-polje" ${id ? `id="${id}"` : ''}><span class="natpis">${natpis}</span>${unutra}${pomoc ? `<span class="pomoc">${pomoc}</span>` : ''}</label>`;
const radio = (ime, opcije, izabrano) => `<div class="u-radio" data-r="${ime}">${Object.entries(opcije).map(([v, n]) => `<button type="button" data-v="${v}" class="${String(izabrano) === v ? 'izabran' : ''}">${n}</button>`).join('')}</div>`;

async function ekranIzmena(a) {
  const info = kvizPo(a.paket);
  if (!info) return ekranSpisak(a);
  await ucitajKviz(a.paket);
  const novo = a.pitanje === 'novo';
  const indeks = novo ? null : +a.pitanje;
  const original = novo ? null : kviz.pitanja?.[indeks];
  if (!novo && !original) { poruka('Pitanje nije pronađeno'); return idi({ paket: a.paket, lekcija: a.lekcija }); }
  F = izPitanja(original || { lekcija: a.lekcija, tezina: 2 });
  const lekcije = kviz.lekcije || [];
  const nazad = adresa({ paket: a.paket, lekcija: a.lekcija });
  izmenjeno = false;

  glavni.innerHTML = `
    <div class="u-alati"><button class="u-mini" id="nazad">← Nazad na spisak</button>
      <span class="sitno">${esc(info.ikona)} ${esc(kviz.naziv)}</span></div>
    <div class="u-izmena">
      <div class="kartica">
        <h2>${novo ? '＋ Novo pitanje' : `✏️ Izmena pitanja #${indeks + 1}`}</h2>
        ${original?.autor ? `<p class="sitno">Dosadašnji autor: ${esc(original.autor)}</p>` : ''}
        ${polje('Vrsta pitanja', radio('vrsta', VRSTE, F.vrsta), '„Izbaci uljeza“: među 4 pojma jedan ne pripada ostalima. „Spoj pojmove“: igrač spaja parove (3–5).')}
        ${lekcije.length ? polje('Lekcija', `<select id="f-lekcija"><option value="">— izaberi lekciju —</option>${lekcije.map((l, i) =>
          `<option value="${i + 1}" ${F.lekcija === i + 1 ? 'selected' : ''}>${i + 1}. ${esc(nazivLekcije(l))}</option>`).join('')}</select>`) : ''}
        ${polje('Težina', radio('tezina', TEZINE, F.tezina), 'Teška pitanja nose 1,5 puta više poena. Dobra mešavina: oko trećine lakih, malo više srednjih i četvrtina teških.')}
        ${polje('Pitanje', '<textarea id="f-pitanje" rows="2" maxlength="600"></textarea>', 'Piši svojim rečima – ne prepisuj rečenice iz udžbenika.')}
        <div id="f-odgovori"></div>
        ${polje('Zanimljivost („💡 Da li si znao?“)', '<textarea id="f-zanimljivost" rows="3" maxlength="1200"></textarea>',
          'Prikazuje se posle odgovora. Neka bude nešto <b>neočigledno</b> što proširuje znanje – ne ponavljanje tačnog odgovora.')}
        <div id="f-objasnjenje-mesto"></div>
        ${polje('Ključna reč', '<input id="f-rec" maxlength="20" style="max-width:260px">',
          'Jedna reč (3–11 slova, najbolje 5–8) vezana za pitanje, npr. za „Ko je izumeo gromobran?“ → <i>gromobran</i>. U krugu „Najduža reč“ igrači pokušavaju da je slože od ponuđenih slova.', 'p-rec')}
        <div class="u-sekcija" id="f-medij"></div>
        <div class="u-sekcija">
          ${polje('Izvor ili napomena za urednika (nije obavezno)', '<textarea id="f-izvor" rows="2" maxlength="1000" placeholder="npr. Udžbenik Biologija 5, str. 34 · ili: ispravljena godina, bila je pogrešna"></textarea>',
            'Odakle je činjenica ili šta si ispravio/la – pomaže uredniku da brže proveri predlog.')}
          ${polje('Tvoje ime i prezime', `<input id="f-autor" maxlength="80" value="${esc(ls.get('autor', ''))}" placeholder="npr. Milica Petrović" style="max-width:360px">`, 'Upisuje se uz pitanje kao autor (ne prikazuje se u igri).')}
        </div>
        <div id="f-greske"></div>
        <div class="u-akcije">
          <button class="dugme zeleno" id="predlozi">📨 Predloži ${novo ? 'novo pitanje' : 'izmenu'}</button>
          <button class="dugme sivo" id="odustani">Odustani</button>
          ${ukljuceno ? '' : '<span class="sitno">Slanje predloga nije podešeno na ovom serveru.</span>'}
        </div>
      </div>
      <div class="u-pregled-okvir">
        <h3>👁 Pregled <span class="razmak"></span>${radio('pismo', { cirilica: 'Ćirilica', latinica: 'Latinica' }, ls.get('pismo', 'cirilica'))}</h3>
        <div class="u-pregled" id="pregled"></div>
        <p class="napomena sitno centar">Ovako pitanje izgleda na telefonu posle odgovora. U igri se odgovori mešaju.</p>
      </div>
    </div>`;

  $('#f-pitanje').value = F.pitanje;
  $('#f-zanimljivost').value = F.zanimljivost;
  $('#f-rec').value = F.rec;
  crtajOdgovore();
  crtajObjasnjenje();
  crtajMedij(original?.mediji);

  const promena = () => { izmenjeno = true; osveziPregled(); };
  $('#f-pitanje').oninput = (e) => { F.pitanje = e.target.value; promena(); };
  $('#f-zanimljivost').oninput = (e) => { F.zanimljivost = e.target.value; promena(); };
  $('#f-rec').oninput = (e) => { F.rec = e.target.value.trim(); promena(); };
  if ($('#f-lekcija')) $('#f-lekcija').onchange = (e) => { F.lekcija = e.target.value ? +e.target.value : null; promena(); };
  $('#f-autor').oninput = (e) => ls.set('autor', e.target.value.trim());
  $$('.u-radio[data-r]').forEach((g) => $$('button', g).forEach((b) => (b.onclick = () => {
    $$('button', g).forEach((x) => x.classList.toggle('izabran', x === b));
    const r = g.dataset.r, v = b.dataset.v;
    if (r === 'pismo') { ls.set('pismo', v); return osveziPregled(true); }
    if (r === 'tezina') F.tezina = +v;
    if (r === 'vrsta') { F.vrsta = v; crtajOdgovore(); crtajObjasnjenje(); }
    promena();
  })));
  $('#nazad').onclick = $('#odustani').onclick = () => idi(nazad);
  $('#predlozi').onclick = () => potvrdi(a, original);
  osveziPregled(true);
}

function crtajOdgovore() {
  const el = $('#f-odgovori');
  if (F.vrsta === 'spoji') {
    el.innerHTML = `<div class="u-polje"><span class="natpis">Parovi (levo ↔ desno)</span>
      ${F.parovi.map((x, i) => `<div class="u-par"><input data-p="${i}" data-s="0" maxlength="120" placeholder="pojam levo"><span class="strelica">↔</span>
        <input data-p="${i}" data-s="1" maxlength="120" placeholder="njegov par desno"><button type="button" class="u-mini" data-ukloni="${i}" ${F.parovi.length <= 3 ? 'disabled' : ''} title="Ukloni par">✕</button></div>`).join('')}
      <button type="button" class="u-mini" id="dodaj-par" ${F.parovi.length >= 5 ? 'disabled' : ''}>＋ Dodaj par</button>
      <span class="pomoc">3–5 parova (najbolje 4). Pojmovi desno neka budu kratki, i svaki levo sme da odgovara samo jednom desno. Igra meša obe kolone.</span></div>`;
    $$('input[data-p]', el).forEach((inp) => {
      inp.value = F.parovi[+inp.dataset.p][+inp.dataset.s];
      inp.oninput = () => { F.parovi[+inp.dataset.p][+inp.dataset.s] = inp.value; izmenjeno = true; osveziPregled(); };
    });
    $$('[data-ukloni]', el).forEach((b) => (b.onclick = () => { F.parovi.splice(+b.dataset.ukloni, 1); izmenjeno = true; crtajOdgovore(); osveziPregled(); }));
    $('#dodaj-par', el).onclick = () => { F.parovi.push(['', '']); crtajOdgovore(); };
    return;
  }
  const uljez = F.vrsta === 'uljez';
  const oznake = uljez ? ['🕵️ Uljez', 'Pripada grupi', 'Pripada grupi', 'Pripada grupi'] : ['✓ Tačan odgovor', '✗ Netačan', '✗ Netačan', '✗ Netačan'];
  el.innerHTML = `<div class="u-polje"><span class="natpis">${uljez ? 'Pojmovi' : 'Odgovori'}</span>
    ${F.odgovori.map((o, i) => `<div class="u-odgovor"><span class="oznaka ${i === 0 ? 'tacan' : 'netacan'}">${oznake[i]}</span><input data-o="${i}" maxlength="200"></div>`).join('')}
    <span class="pomoc">${uljez ? 'Prvi je uljez – onaj koji ne pripada ostalima. Igra sama meša redosled.'
      : 'Netačni odgovori treba da budu <b>uverljivi</b> i <b>slične dužine</b> kao tačan – da se tačan ne prepozna po tome što je najduži ili najdetaljniji. Igra sama meša redosled.'}</span></div>
    <div id="upozorenje-duzina"></div>`;
  $$('input[data-o]', el).forEach((inp) => {
    inp.value = F.odgovori[+inp.dataset.o];
    inp.oninput = () => { F.odgovori[+inp.dataset.o] = inp.value; izmenjeno = true; osveziPregled(); };
  });
}

function crtajObjasnjenje() {
  const el = $('#f-objasnjenje-mesto');
  const obavezno = F.vrsta === 'uljez';
  el.innerHTML = polje(obavezno ? 'Objašnjenje (zašto je to uljez)' : 'Objašnjenje (nije obavezno)', '<textarea id="f-objasnjenje" rows="2" maxlength="800"></textarea>',
    obavezno ? 'Npr. „Pingvin je ptica, a delfin, slepi miš i kit su sisari.“' : 'Kratko objašnjenje zašto je odgovor tačan – prikazuje se iznad zanimljivosti.');
  $('#f-objasnjenje').value = F.objasnjenje;
  $('#f-objasnjenje').oninput = (e) => { F.objasnjenje = e.target.value; izmenjeno = true; osveziPregled(); };
}

// medij (slika, mapa, 3D, melodija…): može da se zadrži ili ukloni; za iskusne – izmena kao JSON
function crtajMedij(stari) {
  const el = $('#f-medij');
  el.innerHTML = `<span class="natpis" style="font-weight:800">Slika ili interaktivni prikaz</span>
    ${stari ? `<p>Ovo pitanje ima prikaz: <b>${esc(stari.vrsta)}</b>${stari.opis ? ` (${esc(stari.opis)})` : ''}. Vidi ga u pregledu desno.</p>
      <label class="u-potvrda" style="font-weight:600"><input type="checkbox" id="f-bez-medija" ${F.mediji ? '' : 'checked'}> Ukloni ovaj prikaz iz pitanja</label>`
      : '<p class="sitno">Pitanje nema sliku ni interaktivni prikaz. Ako misliš da bi slika pomogla, napiši to u napomeni za urednika – on će je dodati (slike moraju imati slobodnu licencu).</p>'}
    <p class="sitno">Prikaz ne sme da otkriva tačan odgovor (npr. slika pčele uz pitanje „Ko pravi med?“).</p>
    <details class="u-napredno"><summary>Napredno: prikaz zapisan kao JSON</summary>
      ${polje('', '<textarea id="f-medij-json" class="kod" spellcheck="false"></textarea>',
        'Za one koji znaju format – vrste prikaza su opisane u <a href="https://github.com/dasatomic/skviz/blob/main/kvizovi/UPUTSTVO.md#mediji-mediji-" target="_blank" rel="noopener">uputstvu</a>. Npr. <code>{"vrsta":"emodzi","tekst":"🧙‍♂️⚡👓"}</code> ili <code>{"vrsta":"mapa","oblast":"srbija","reke":["Dunav"]}</code>.', 'p-medij')}
    </details>`;
  const json = $('#f-medij-json');
  json.value = F.mediji ? JSON.stringify(F.mediji, null, 2) : '';
  const bez = $('#f-bez-medija');
  if (bez) bez.onchange = () => { F.mediji = bez.checked ? null : stari; json.value = F.mediji ? JSON.stringify(F.mediji, null, 2) : ''; izmenjeno = true; osveziPregled(true); };
  json.oninput = () => {
    const t = json.value.trim();
    const p = $('#p-medij');
    try {
      const m = t ? JSON.parse(t) : null;
      if (m && (typeof m !== 'object' || Array.isArray(m) || !m.vrsta)) throw new Error('nema „vrsta“');
      F.mediji = m;
      p.classList.remove('greska');
      if (bez) bez.checked = !m;
      izmenjeno = true;
      osveziPregled(true);
    } catch { p.classList.add('greska'); }
  };
}

// ───── pregled (kao na telefonu, posle otkrivanja odgovora) ─────
let pregledTajmer = null, poslednjiMedij = '';
function osveziPregled(odmah = false) {
  clearTimeout(pregledTajmer);
  if (!odmah) { pregledTajmer = setTimeout(() => osveziPregled(true), 150); return; }
  const el = $('#pregled');
  if (!el) return;
  const { g, u } = proveri();
  $('#f-greske').innerHTML = u.length ? `<div class="u-upozorenje">${u.map(esc).join('<br>')}</div>` : '';
  $('#p-rec')?.classList.toggle('greska', g.some((x) => x.startsWith('Ključna')));

  const P = F;
  const slova = ls.get('pismo', 'cirilica') === 'cirilica' ? ['А', 'Б', 'В', 'Г'] : ['A', 'B', 'C', 'D'];
  const zv = [1, 2, 3].map((i) => `<span style="opacity:${i <= P.tezina ? 1 : 0.25}">★</span>`).join('');
  const naslov = P.vrsta === 'uljez' ? `<h3>🕵️ Uljez je: ${esc(P.odgovori[0])}</h3>` : P.vrsta === 'spoji' ? '<h3>✅ Tačni parovi</h3>' : `<h3>✅ ${mat(P.odgovori[0])}</h3>`;
  const parovi = P.parovi.filter((x) => x[0].trim() || x[1].trim());
  const telo = P.vrsta === 'spoji'
    ? `<div class="spoji"><div class="kolona">${parovi.map((x) => `<div class="spoj levo">${esc(x[0])}</div>`).join('')}</div>
        <div class="kolona">${parovi.map((x) => `<div class="spoj desno tacan">${esc(x[1])}</div>`).join('')}</div></div>`
    : `<div class="odgovori otkriveno">${P.odgovori.map((o, i) => `<div class="odg ${i === 0 ? 'tacan' : ''}" data-slovo="${slova[i]}">${mat(o) || '<span style="opacity:.4">…</span>'}</div>`).join('')}</div>`;
  const medijKljuc = JSON.stringify(P.mediji || null) + kvizId;
  const zadrziMedij = medijKljuc === poslednjiMedij && $('#pv-medij', el);
  const stariMedij = zadrziMedij ? $('#pv-medij', el) : null;
  el.innerHTML = `
    <div class="traka"><span class="znacka">1/10</span>${kviz.ikona ? `<span class="znacka" style="background:${esc(kviz.boja || '#6c5ce7')}">${kviz.ikona} ${esc(kviz.naziv)}</span>` : ''}
      <span class="znacka tezina">${zv}${P.tezina === 3 ? ' ×1,5' : ''}</span></div>
    ${P.vrsta !== 'izbor' ? `<div class="vrsta-pitanja">${P.vrsta === 'uljez' ? '🕵️ Izbaci uljeza' : '🔗 Spoj pojmove'}</div>` : ''}
    <div class="pitanje-tekst">${mat(P.pitanje) || '<span style="opacity:.4">Tekst pitanja…</span>'}</div>
    <div id="pv-medij-mesto"></div>
    ${telo}
    <div class="kartica zanimljivost">${naslov}${P.objasnjenje.trim() ? `<p>${esc(P.objasnjenje)}</p>` : ''}
      <h3 style="margin-top:12px">💡 Da li si znao?</h3><div>${esc(P.zanimljivost) || '<span style="opacity:.4">…</span>'}</div></div>
    ${P.rec ? `<p class="sitno centar">Ključna reč: <b>${esc(P.rec.toUpperCase())}</b></p>` : ''}`;
  // medij se ne crta ponovo pri svakom slovu (3D prikazi, melodije…)
  const mesto = $('#pv-medij-mesto', el);
  if (stariMedij) mesto.replaceWith(stariMedij);
  else {
    ciscenjeMedija?.();
    ciscenjeMedija = null;
    if (P.mediji) {
      const m = document.createElement('div');
      m.id = 'pv-medij';
      mesto.replaceWith(m);
      try { ciscenjeMedija = prikaziMedij(m, P.mediji, { auto: false, paket: kvizId, kod: kviz?.kod }); } catch { m.innerHTML = '<div class="u-prazno">Prikaz nije ispravan.</div>'; }
    } else mesto.remove();
    poslednjiMedij = medijKljuc;
  }
  if (ls.get('pismo', 'cirilica') === 'cirilica') uCirilicu(el);
}

// preslovljavanje pregleda (kao u igri, pravila su u pismo.js)
const NE_DIRAJ = 'script,style,textarea,input,[data-lat],.formula,.formula-mala,.mat,.kod,#pv-medij';
function uCirilicu(koren) {
  const w = document.createTreeWalker(koren, NodeFilter.SHOW_TEXT);
  const cvorovi = [];
  while (w.nextNode()) cvorovi.push(w.currentNode);
  for (const n of cvorovi) if (!n.parentElement.closest(NE_DIRAJ)) n.nodeValue = window.Pismo.uCirilicu(n.nodeValue);
}

// ───── slanje predloga ─────
function prozor(html) {
  $('#prozor-sadrzaj').innerHTML = html;
  $('#prozor').hidden = false;
}
const zatvoriProzor = () => { $('#prozor').hidden = true; };

function potvrdi(a, original) {
  const { g, u } = proveri();
  const autor = $('#f-autor').value.trim();
  if (autor.length < 3) g.push('Upiši svoje ime i prezime (na dnu forme).');
  if (!ukljuceno) g.push('Slanje predloga nije podešeno na ovom serveru.');
  if (g.length) {
    $('#f-greske').innerHTML = `<ul class="u-greske">${g.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` + (u.length ? `<div class="u-upozorenje">${u.map(esc).join('<br>')}</div>` : '');
    $('#f-greske').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  prozor(`<h2>📨 Slanje predloga</h2>
    <p>${original ? 'Predlažeš izmenu pitanja' : 'Predlažeš novo pitanje'} u kvizu <b>${esc(kviz.naziv)}</b>:</p>
    <p class="kartica" style="margin:8px 0">${mat(F.pitanje)}</p>
    ${u.length ? `<div class="u-upozorenje">${u.map(esc).join('<br>')}</div>` : ''}
    <label class="u-potvrda"><input type="checkbox" id="tacno"> Proverio/la sam da su sve činjenice tačne (pitanja igraju i deca).</label>
    <label class="u-potvrda" style="font-weight:500"><input type="checkbox" id="licenca"> Pitanje sam napisao/la svojim rečima i slažem se da bude javno dostupno svima (javni domen, CC0).</label>
    <div class="u-akcije"><button class="dugme zeleno" id="posalji" disabled>Pošalji predlog</button><button class="dugme sivo" id="ne">Nazad</button></div>`);
  const dugme = $('#posalji');
  const omoguci = () => { dugme.disabled = !($('#tacno').checked && $('#licenca').checked); };
  $('#tacno').onchange = $('#licenca').onchange = omoguci;
  $('#ne').onclick = zatvoriProzor;
  dugme.onclick = () => posalji(a, original, autor);
}

async function posalji(a, original, autor) {
  prozor('<h2>📨 Slanje predloga</h2><p><span class="u-ceka"></span>Šaljem predlog… ovo može da potraje do pola minuta.</p>');
  let r, odg;
  try {
    r = await fetch('/api/predlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paket: kvizId, original, pitanje: zaSlanje(), autor, izvor: $('#f-izvor').value }),
    });
    odg = await r.json();
  } catch { odg = { greska: 'Nema veze sa serverom. Proveri internet i pokušaj ponovo.' }; }
  if (!r?.ok || odg.greska) {
    prozor(`<h2>😕 Predlog nije poslat</h2><p>${esc(odg.greska || 'Nepoznata greška.')}</p>
      <div class="u-akcije"><button class="dugme sivo" id="ne">U redu</button></div>`);
    $('#ne').onclick = zatvoriProzor;
    return;
  }
  const lista = ls.get('predlozi', []);
  lista.push({ broj: odg.broj, url: odg.url, naslov: odg.naslov, datum: Date.now() });
  ls.set('predlozi', lista);
  izmenjeno = false;
  prozor(`<h2>🎉 Hvala! Predlog je poslat.</h2>
    <p>Urednik igre će ga pregledati. Kad ga prihvati, pitanje ulazi u igru sa sledećim osvežavanjem sajta.</p>
    <p>Ovde možeš da pratiš svoj predlog i da vidiš da li je urednik ostavio komentar ili pitanje:</p>
    <a class="u-veza" href="${esc(odg.url)}" target="_blank" rel="noopener">${esc(odg.url)}</a>
    <p class="sitno">Link je sačuvan i na početnoj strani urednika, pod „Moji predlozi“. Za komentarisanje na GitHub-u potreban je nalog, a za gledanje nije.</p>
    <div class="u-akcije"><a class="dugme zeleno" href="${esc(odg.url)}" target="_blank" rel="noopener" style="text-decoration:none">Otvori predlog ↗</a>
      <button class="dugme" id="jos">＋ Dodaj još jedno pitanje</button><button class="dugme sivo" id="spisak">Nazad na spisak</button></div>`);
  $('#jos').onclick = () => { zatvoriProzor(); idi({ paket: a.paket, lekcija: F.lekcija || a.lekcija, pitanje: 'novo' }); };
  $('#spisak').onclick = () => { zatvoriProzor(); idi({ paket: a.paket, lekcija: a.lekcija }); };
}

// ───── usmeravanje ─────
async function crtaj() {
  prethodnaAdresa = location.hash;
  ciscenjeMedija?.();
  ciscenjeMedija = null;
  poslednjiMedij = '';
  zatvoriProzor();
  const a = citajAdresu();
  try {
    if (a.paket && a.pitanje !== null) {
      await ekranIzmena(a);
      const x = a.pitanje !== 'novo' && kviz?.pitanja?.[+a.pitanje] && prijavaZa(a.paket, kviz.pitanja[+a.pitanje].pitanje);
      if (x) glavni.insertAdjacentHTML('afterbegin', `<div class="u-upozorenje">⚠️ Igrači su ovo pitanje prijavili kao pogrešno (${natpisPrijava(x.broj)}). Proveri pitanje i odgovore i, ako nešto ne valja, predloži ispravku.</div>`);
    }
    else if (a.paket) await ekranSpisak(a);
    else if (a.oblast) ekranOblast(a.oblast);
    else ekranPocetna();
  } catch (e) {
    console.error(e);
    glavni.innerHTML = `<div class="u-prazno">Nešto nije u redu: ${esc(e.message)}. <a href="#">Na početak</a></div>`;
  }
  window.scrollTo(0, 0);
}

(async () => {
  try { await Promise.all([ucitajKvizove(), ucitajPrijave()]); } catch { glavni.innerHTML = '<div class="u-prazno">Server ne odgovara. Osveži stranicu.</div>'; return; }
  crtaj();
})();
