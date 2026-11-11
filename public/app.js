// Skviz – klijent (telefon ili TV ekran)
'use strict';
const { prikaziMedij, Zvuk } = window.Mediji;
const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const EKRAN = location.pathname.startsWith('/ekran');
if (EKRAN) document.body.classList.add('ekran');

const AVATARI = ['🦉', '🦊', '🐼', '🐯', '🦁', '🐸', '🐙', '🦄', '🐧', '🐨', '🐵', '🐶', '🐱', '🐰', '🦖', '🐢', '🦋', '🐝', '🦈', '🐳', '🌻', '🚀', '⚽', '🎸', '👑', '🧙', '🦸', '🤖', '👽', '🍕', '🌈', '⭐'];
const LAT = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'đ', е: 'e', ж: 'ž', з: 'z', и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r', с: 's', т: 't', ћ: 'ć', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'č', џ: 'dž', ш: 'š' };

const ls = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
// ja.id je TAJNI ključ ovog uređaja (šalje se samo serveru); ostali igrači vide javni id koji server izvodi iz njega (V.ja)
function noviId() {
  try { return 'p-' + Array.from(crypto.getRandomValues(new Uint8Array(15)), (b) => b.toString(16).padStart(2, '0')).join(''); } catch {}
  return 'p-' + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12);
}
let ja = ls.get('ja', null);
if (!ja || typeof ja !== 'object' || typeof ja.id !== 'string' || ja.id.length < 8 || ja.id.length > 60)
  ja = { id: noviId(), ime: typeof ja?.ime === 'string' ? ja.ime : '', avatar: AVATARI[Math.floor(Math.random() * 12)] };
if (typeof ja.ime !== 'string') ja.ime = '';
if (typeof ja.avatar !== 'string') ja.avatar = AVATARI[0];
if (EKRAN && !ja.id.startsWith('tv-')) ja.id = 'tv-' + ja.id;
const sacuvajJa = () => { if (!EKRAN) ls.set('ja', ja); };

// ───── pismo: ćirilica (podrazumevano) ili latinica – važi za ceo prikaz ─────
// Kod i podaci ostaju na latinici; ceo ekran (tekst čvorovi, placeholder/title) se preslovljava u hodu.
let PISMO = ls.get('pismo', 'cirilica') === 'latinica' ? 'latinica' : 'cirilica';
const NE_DIRAJ = 'script,style,textarea,input,[data-lat],[lang="en"],.formula,.formula-mala,.kod-sobe,.adresa,.mat,.kod';
const tr = (t) => (PISMO === 'cirilica' ? window.Pismo.uCirilicu(t) : String(t)); // pravila u pismo.js
function prevedi(koren) {
  if (PISMO !== 'cirilica') return;
  if (koren.nodeType === 3) { if (!koren.parentElement?.closest(NE_DIRAJ)) { const n = tr(koren.data); if (n !== koren.data) koren.data = n; } return; }
  if (koren.nodeType !== 1 || koren.closest(NE_DIRAJ)) return;
  for (const a of ['placeholder', 'title']) if (koren.hasAttribute?.(a)) koren.setAttribute(a, tr(koren.getAttribute(a)));
  koren.querySelectorAll('[placeholder],[title]').forEach((e) => { if (!e.closest(NE_DIRAJ) || e.matches('input,textarea')) for (const a of ['placeholder', 'title']) if (e.hasAttribute(a)) e.setAttribute(a, tr(e.getAttribute(a))); });
  const w = document.createTreeWalker(koren, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    if (n.parentElement?.closest(NE_DIRAJ)) continue;
    const t = tr(n.data);
    if (t !== n.data) n.data = t;
  }
}
new MutationObserver((lista) => {
  if (PISMO !== 'cirilica') return;
  for (const m of lista) {
    if (m.type === 'characterData') prevedi(m.target);
    else m.addedNodes.forEach(prevedi);
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true });
const _confirm = window.confirm.bind(window);
window.confirm = (t) => _confirm(tr(t));
function postaviPismo(p, crtajPonovo = true) {
  p = p === 'latinica' ? 'latinica' : 'cirilica';
  document.title = p === 'cirilica' ? 'Квиз' : 'Kviz';
  if (p === PISMO) return;
  PISMO = p;
  ls.set('pismo', p);
  if (!crtajPonovo) return;
  if (V) { kljucEkrana = ''; crtaj(); } else pocetna();
}
// kod sobe je uvek latinicom; ako se ukuca ćirilicom (ЗГЛА), pretvori u ZGLA
const kodSobe = (t) => [...String(t).trim().toLowerCase()].map((c) => LAT[c] ?? c).join('').toUpperCase();
const slovaOdg = () => (PISMO === 'cirilica' ? ['А', 'Б', 'В', 'Г'] : ['A', 'B', 'C', 'D']);

let V = null;          // poslednje stanje sa servera
let pomak = 0;         // razlika satova server - klijent
let izvor = null;      // EventSource
let kljucEkrana = '';  // kad se promeni – ekran se crta iznova
let ciscenje = [];     // funkcije za gašenje animacija
let kvizovi = [];
let tikTajmer = null;

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// tekst sa matematikom: $…$ ostaje latinicom (oznake tačaka, promenljive), √{x} – koren sa crtom, {a|b} – razlomak
// sadržaj kviza na stranom jeziku ("jezik": "en", npr. TLA+) ide u <span lang> – ne preslovljava se u ćirilicu
const strano = (html, jezik = V?.pitanje?.jezik) => (jezik ? `<span lang="${esc(jezik)}">${html}</span>` : html);
function mat(t) {
  return strano(matTekst(t));
}
function matTekst(t) {
  return esc(t).replace(/\$([^$]+)\$/g, (_, m) => {
    let x = m, pre;
    do {
      pre = x;
      x = x.replace(/√\{([^{}]*)\}/g, '√<span class="pod-korenom">$1</span>')
        .replace(/\{([^{}|]*)\|([^{}|]*)\}/g, '<span class="razlomak"><span>$1</span><span>$2</span></span>');
    } while (x !== pre);
    return `<span class="mat">${x}</span>`;
  }).replace(/\n/g, '<br>');
}
const slovo = (c) => (PISMO === 'cirilica' ? c : LAT[c] ?? c);
const rec = (r) => [...(r || '')].map(slovo).join('');
const igrac = (id) => V?.igraci.find((x) => x.id === id);
const jaDomacin = () => !!V && !!V.ja && V.domacin === V.ja;
const sada = () => Date.now() + pomak;

function poruka(t, ms = 2200) {
  const p = $('#poruka');
  p.textContent = t;
  p.classList.add('vidljiva');
  clearTimeout(poruka.t);
  poruka.t = setTimeout(() => p.classList.remove('vidljiva'), ms);
}

async function akcija(tip, podaci = {}) {
  try {
    const r = await fetch('/api/akcija', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tip, igrac: ja.id, soba: V?.kod || ls.get('soba', ''), ...podaci }),
    });
    const j = await r.json();
    if (j.greska) poruka(j.greska);
    return j;
  } catch { poruka('Nema veze sa serverom'); return {}; }
}

// ───────────────────────── veza ─────────────────────────
let nacin = 'sse';      // 'sse' ili 'poll' (long-polling kad SSE ne prolazi, npr. kroz Cloudflare tunel)
let generacija = 0;

// verzija koda sa servera pri prvom stanju; ako se kasnije promeni (server je dobio novi kod), stranica se osveži
let mojaVerzija = null;
function primi(v) {
  if (v.klijent) {
    if (mojaVerzija === null) mojaVerzija = v.klijent;
    else if (v.klijent !== mojaVerzija) { location.reload(); return; }
  }
  pomak = v.sada - Date.now();
  const staro = V;
  V = v;
  if (v.podesavanja?.pismo && v.podesavanja.pismo !== PISMO) { postaviPismo(v.podesavanja.pismo, false); kljucEkrana = ''; }
  if (!EKRAN && !v.igraci.some((x) => x.id === v.ja)) {
    // izbačen ili soba nova – vrati na početak
    if (staro) { prekiniVezu(); V = null; ls.set('soba', ''); poruka('Nisi više u sobi'); pocetna(); return; }
  }
  crtaj(staro);
}

function prekiniVezu() {
  generacija++;
  if (izvor) { izvor.close(); izvor = null; }
}

async function anketa(kod, gen) {
  while (gen === generacija) {
    try {
      const r = await fetch(`/api/stanje?soba=${encodeURIComponent(kod)}&igrac=${encodeURIComponent(ja.id)}&v=${V && V.kod === kod ? V.verzija : -1}`, { cache: 'no-store' });
      if (gen !== generacija) return;
      if (r.status === 404) { prekiniVezu(); V = null; ls.set('soba', ''); poruka('Soba više ne postoji'); return pocetna(); }
      if (!r.ok) { await new Promise((ok) => setTimeout(ok, r.status === 429 ? 5000 : 1500)); continue; }
      const v = await r.json();
      if (gen !== generacija) return;
      primi(v);
    } catch { await new Promise((ok) => setTimeout(ok, 1500)); }
  }
}

function povezi(kod) {
  prekiniVezu();
  const gen = generacija;
  ls.set('soba', kod);
  if (nacin === 'poll') return anketa(kod, gen);
  let stiglo = false;
  izvor = new EventSource(`/api/dogadjaji?soba=${encodeURIComponent(kod)}&igrac=${encodeURIComponent(ja.id)}`);
  izvor.onmessage = (e) => { if (gen !== generacija) return; stiglo = true; primi(JSON.parse(e.data)); };
  izvor.onerror = async () => {
    // v=-1: server odgovara odmah (ne drži zahtev otvoren kao kod long-pollinga)
    const r = await fetch(`/api/stanje?soba=${encodeURIComponent(kod)}&igrac=x&v=-1`, { method: 'HEAD', cache: 'no-store' }).catch(() => null);
    if (gen !== generacija) return;
    if (r && r.status === 404) { prekiniVezu(); V = null; ls.set('soba', ''); poruka('Soba više ne postoji'); pocetna(); }
  };
  // ako za 3 s ne stigne ništa preko SSE-a, prelazimo na long-polling
  setTimeout(() => {
    if (!stiglo && gen === generacija) { nacin = 'poll'; povezi(kod); }
  }, 3000);
}

// „O igri“ (statični tekst iz index.html, i za pretraživače) – samo na početnom ekranu telefona
const oIgri = document.getElementById('o-igri');
const oIgriLat = oIgri ? oIgri.innerHTML : '';
function prikaziOIgri(da) {
  if (!oIgri) return;
  oIgri.hidden = !da;
  if (da) oIgri.innerHTML = oIgriLat; // iznova, da se preslovi po izabranom pismu
}

function ocisti() {
  prikaziOIgri(false);
  ciscenje.forEach((f) => { try { f(); } catch {} });
  ciscenje = [];
  clearInterval(tikTajmer);
  Zvuk.stop();
}

function crtaj(staro) {
  const f = V.faza;
  let kljuc = f;
  if (f === 'pitanje' || f === 'otkrivanje') kljuc = 'p' + V.pitanje.rb + V.krug;
  if (f === 'reci' || f === 'reci-otkrivanje') kljuc = 'r' + V.reci.rb + V.krug;
  const nov = kljuc !== kljucEkrana;
  if (nov) { ocisti(); kljucEkrana = kljuc; app.innerHTML = ''; window.scrollTo(0, 0); }
  ({ lobi: ekranLobi, uvod: ekranUvod, pitanje: ekranPitanje, otkrivanje: ekranPitanje, tabela: ekranTabela,
    reci: ekranReci, 'reci-otkrivanje': ekranReci, kraj: ekranKraj }[f] || ekranLobi)(nov, staro);
  meniDugme();
}

// ───────────────────────── početna ─────────────────────────
let linkIskoriscen = false; // kod sobe iz adrese (/ekran?soba=ABCD) koristi se samo jednom – inače mrtva soba vrti u krug
function pocetna() {
  ocisti();
  kljucEkrana = '';
  $('.meni-dugme')?.remove();
  const qs = new URLSearchParams(location.search);
  const kodIzLinka = (qs.get('soba') || '').toUpperCase();
  if (EKRAN) {
    app.innerHTML = `<h1 class="naslov-igre"><img class="logo" src="/logo.svg" alt="Сквиз"></h1><div class="podnaslov">📺 TV ekran – prikazuje igru za sve</div>
      <div class="kartica"><label>Kod sobe</label><input class="polje kod" id="kod" maxlength="4" value="${esc(kodIzLinka)}" placeholder="ABCD">
      <div style="height:12px"></div><button class="dugme zuto siroko" id="gledaj">Prikaži sobu</button></div>`;
    const kreni = () => { const k = kodSobe($('#kod').value); if (k.length === 4) povezi(k); };
    $('#gledaj').onclick = kreni;
    if (kodIzLinka && !linkIskoriscen) { linkIskoriscen = true; kreni(); }
    return;
  }
  prikaziOIgri(true);
  app.innerHTML = `
    <h1 class="naslov-igre"><img class="logo" src="/logo.svg" alt="Сквиз"></h1>
    <div class="izbor pismo-izbor">${['cirilica', 'latinica'].map((p) => `<button data-pismo="${p}" class="${PISMO === p ? 'izabran' : ''}" ${p === 'latinica' ? 'data-lat' : ''}>${p === 'cirilica' ? 'Ćirilica' : 'Latinica'}</button>`).join('')}</div>
    <div class="kartica">
      <label class="sitno">Kako se zoveš?</label>
      <input class="polje" id="ime" maxlength="16" value="${esc(ja.ime)}" placeholder="Ime" autocomplete="off">
      <div class="avatari">${AVATARI.map((a) => `<button data-a="${a}" class="${a === ja.avatar ? 'izabran' : ''}">${a}</button>`).join('')}</div>
    </div>
    <div class="kartica">
      <button class="dugme zuto siroko" id="nova">🎲 Napravi sobu</button>
      <div class="centar sitno" style="margin:12px 0">ili uđi u postojeću</div>
      <div class="red"><input class="polje kod" id="kod" maxlength="4" placeholder="KOD" value="${esc(kodIzLinka || ls.get('soba', ''))}" style="flex:1">
      <button class="dugme" id="udji">Uđi</button></div>
    </div>
    <div class="centar sitno">Igra se može igrati i sam – napravi sobu i pokreni.<br>TV / računar kao veliki ekran: <b data-lat>${location.host}/ekran</b></div>
    <div class="centar podnozje"><a href="#" id="kontakt">Kontakt</a></div>`;
  const ime = $('#ime');
  $('#kontakt').onclick = (e) => { e.preventDefault(); ja.ime = ime.value.trim(); kontakt(); };
  app.querySelectorAll('[data-pismo]').forEach((b) => (b.onclick = () => { ja.ime = ime.value.trim(); Zvuk.efekat('klik'); postaviPismo(b.dataset.pismo); }));
  app.querySelectorAll('.avatari button').forEach((b) => (b.onclick = () => {
    ja.avatar = b.dataset.a;
    app.querySelectorAll('.avatari button').forEach((x) => x.classList.toggle('izabran', x === b));
    Zvuk.efekat('klik');
  }));
  // poznati igrači (porodična statistika) – stižu naknadno, da početni ekran ne čeka server
  fetch('/api/statistika').then((r) => r.json()).then((st) => {
    const poznati = Object.values(st.igraci || {}).filter((p) => p && typeof p.ime === 'string');
    if (!poznati.length || !ime.isConnected || $('.cipovi')) return;
    ime.insertAdjacentHTML('afterend', `<div class="cipovi">${poznati.map((p) => `<button class="cip" data-ime="${esc(p.ime)}" data-av="${esc(p.avatar)}">${esc(p.avatar)} ${esc(p.ime)}</button>`).join('')}</div>`);
    app.querySelectorAll('.cip').forEach((b) => (b.onclick = () => {
      ime.value = b.dataset.ime; ja.avatar = b.dataset.av;
      app.querySelectorAll('.avatari button').forEach((x) => x.classList.toggle('izabran', x.dataset.a === ja.avatar));
    }));
  }).catch(() => {});
  const proveri = () => {
    Zvuk.otkljucaj();
    ja.ime = ime.value.trim();
    if (!ja.ime) { poruka('Upiši ime 🙂'); ime.focus(); return false; }
    sacuvajJa();
    return true;
  };
  $('#nova').onclick = async () => {
    if (!proveri()) return;
    const r = await akcija('nova-soba', { ime: ja.ime, avatar: ja.avatar, pismo: PISMO });
    if (r.kod) povezi(r.kod);
  };
  $('#udji').onclick = async () => {
    if (!proveri()) return;
    const kod = kodSobe($('#kod').value);
    if (kod.length !== 4) return poruka('Kod ima 4 slova');
    const r = await akcija('udji', { soba: kod, ime: ja.ime, avatar: ja.avatar });
    if (r.kod) povezi(r.kod);
  };
}

// ───────────────────────── kontakt ─────────────────────────
function kontakt() {
  ocisti();
  window.scrollTo(0, 0);
  app.innerHTML = `
    <h1 class="naslov-igre mali"><img class="logo" src="/logo.svg" alt="Сквиз"></h1>
    <div class="kartica centar">
      <h2>Kontakt</h2>
      <p>Pitanja, predlozi i greške – javi nam se na Discord kanalu:</p>
      <a class="dugme zuto siroko" data-lat href="https://discord.gg/9sMYvbGZAr" target="_blank" rel="noopener">💬 Discord</a>
      <div class="sitno" style="margin-top:10px" data-lat>discord.gg/9sMYvbGZAr</div>
    </div>
    <div class="centar"><button class="dugme" id="nazad">⬅ Nazad</button></div>`;
  $('#nazad').onclick = () => pocetna();
}

// ───────────────────────── meni ─────────────────────────
function meniDugme() {
  if ($('.meni-dugme')) return;
  const b = document.createElement('button');
  b.className = 'meni-dugme';
  b.textContent = '☰';
  document.body.appendChild(b);
  b.onclick = () => {
    if ($('.meni')) return $('.meni').remove();
    const m = document.createElement('div');
    m.className = 'meni';
    const stavke = [[Zvuk.tiho ? '🔊 Uključi zvuk' : '🔇 Isključi zvuk', () => (Zvuk.tiho = !Zvuk.tiho)]];
    if (jaDomacin() && V.faza !== 'lobi') stavke.push(['⏹ Prekini igru (nazad u sobu)', () => confirm('Prekinuti igru?') && akcija('lobi')]);
    if (jaDomacin() && V.faza === 'pitanje') stavke.push(['⏭ Završi pitanje sad', () => akcija('dalje', { faza: V.faza })]);
    if (!EKRAN) stavke.push(['🚪 Izađi iz sobe', async () => { if (!confirm('Izaći iz sobe?')) return; await akcija('izadji'); prekiniVezu(); V = null; ls.set('soba', ''); pocetna(); }]);
    stavke.forEach(([t, f]) => { const x = document.createElement('button'); x.textContent = t; x.onclick = () => { m.remove(); f(); }; m.appendChild(x); });
    document.body.appendChild(m);
  };
}

function donjaTraka(html) {
  let d = $('.donja-traka');
  if (!html) { d?.remove(); return; }
  if (!d) { d = document.createElement('div'); d.className = 'donja-traka'; app.appendChild(d); }
  if (d.dataset.h !== html) { d.innerHTML = html; d.dataset.h = html; }
  return d;
}

function dugmeDalje(natpis = 'Dalje ➜') {
  if (!jaDomacin()) { donjaTraka(EKRAN ? '' : '<div class="cekanje">Vođa igre nastavlja<span class="tackice"></span></div>'); return; }
  const d = donjaTraka(`<button class="dugme zuto" id="dalje">${natpis}</button>`);
  $('#dalje', d).onclick = () => { Zvuk.efekat('klik'); akcija('dalje', { faza: V.faza }); };
}

function avatarHTML(x, dodatak = '') {
  return `<div class="igrac ${x.povezan ? '' : 'odsutan'}" data-id="${esc(x.id)}">${x.id === V.domacin ? '<span class="kruna">👑</span>' : ''}
    <div class="av" style="border-color:${x.boja}">${esc(x.avatar)}</div><div class="ime">${esc(x.ime)}</div>${dodatak}</div>`;
}

// ───── dva načina prikaza igrača: do 5 – avatari sa imenima; preko 5 – sažeto (brojač, mali avatari, skraćene liste) ─────
const MALO = 5;
const mnogo = () => V.igraci.length > MALO;

// ko je već odgovorio / predao (spisak id-jeva)
function koJeOdgovorio(spisak, rec = 'odgovorilo') {
  if (V.igraci.length <= 1 && !EKRAN) return '';
  if (!mnogo()) return `<div class="igraci">${V.igraci.map((x) => avatarHTML(x, spisak.includes(x.id) ? '<span class="kvacica">✓</span>' : '')).join('')}</div>`;
  const n = V.igraci.filter((x) => spisak.includes(x.id)).length;
  const cekamo = V.igraci.filter((x) => !spisak.includes(x.id) && x.povezan);
  return `<div class="napredak"><div class="napredak-traka"><i style="width:${(100 * n) / V.igraci.length}%"></i></div><span><b>${n}</b> / ${V.igraci.length} ${rec}</span></div>
    <div class="mini-igraci">${V.igraci.map((x) => `<span class="mini ${spisak.includes(x.id) ? 'gotov' : ''} ${x.povezan ? '' : 'odsutan'} ${x.id === V.ja ? 'ja' : ''}" title="${esc(x.ime)}" style="border-color:${x.boja}">${esc(x.avatar)}</span>`).join('')}</div>
    ${cekamo.length && cekamo.length <= 6 && n ? `<div class="sitno centar">Čekamo: ${cekamo.map((x) => esc(x.ime)).join(', ')}</div>` : ''}`;
}

// u sažetom prikazu: prvih `limit` redova + moj red (ako nisam među njima) + „i još N“
function skratiListu(lista, red, limit = EKRAN ? 10 : 5) {
  if (!mnogo() || lista.length <= limit + 1) return lista.map(red).join('');
  const moj = lista.findIndex((x) => x.id === V.ja);
  let html = lista.slice(0, limit).map(red).join('');
  if (moj >= limit) html += '<div class="razmak">⋯</div>' + red(lista[moj], moj);
  const ostalo = lista.length - limit - (moj >= limit ? 1 : 0);
  if (ostalo > 0) html += `<div class="sitno centar">i još ${ostalo} ${ostalo % 10 === 1 && ostalo % 100 !== 11 ? 'igrač' : 'igrača'}</div>`;
  return html;
}
const mesto = (i) => (mnogo() ? `<b class="rb">${i + 1}.</b>` : '');

// ───────────────────────── lobi ─────────────────────────
async function ekranLobi(nov) {
  if (nov) {
    if (!kvizovi.length) try { const k = await (await fetch('/api/kvizovi')).json(); if (Array.isArray(k)) kvizovi = k; } catch {}
    let info = { adrese: [location.hostname], port: location.port };
    try { const i = await (await fetch('/api/info')).json(); if (Array.isArray(i.adrese)) info = i; } catch {}
    // dok smo čekali server, igra je možda krenula ili smo izašli iz sobe
    if (!V || V.faza !== 'lobi' || kljucEkrana !== 'lobi') return;
    // preko tunela (javna adresa) prikaži nju, a u kućnoj mreži IP adresu računara
    const lokalno = /^(localhost|127\.|\d+\.\d+\.\d+\.\d+$)/.test(location.hostname);
    const adresa = lokalno ? `http://${info.adrese[0] || location.hostname}:${info.port}` : location.origin;
    app.innerHTML = `
      <h1 class="naslov-igre mali"><img class="logo" src="/logo.svg" alt="Сквиз"></h1>
      <div class="kartica centar">
        <div class="sitno">Kod sobe</div><div class="kod-sobe">${V.kod}</div>
        <div class="adresa">${adresa}/?soba=${V.kod}</div>
        <div class="igraci" id="igraci"></div><div class="sitno" id="broj-igraca"></div>
      </div>
      <div id="podesavanja"></div>
      <div class="kartica" id="slavni"></div>`;
    slavni();
  }
  if (!$('#igraci')) return; // prvo crtanje još čeka /api/kvizovi – ono će prikazati i ovu izmenu
  $('#igraci').classList.toggle('gusto', mnogo());
  $('#igraci').innerHTML = V.igraci.map((x) => avatarHTML(x)).join('') || '<div class="sitno">Još nema igrača</div>';
  $('#broj-igraca').textContent = V.igraci.length > 1 ? `${V.igraci.length} / 40 igrača` : '';
  if (jaDomacin()) {
    app.querySelectorAll('#igraci .igrac').forEach((el) => {
      if (el.dataset.id === V.ja) return;
      el.onclick = () => { if (confirm('Izbaciti igrača?')) akcija('izbaci', { koga: el.dataset.id }); };
    });
  }
  podesavanja();
}

// ───── izbor kviza: 'opste' | 'oblast:biologija' | 'razred5-biologija' (cela godina) | 'razred5-biologija#3' (lekcija) ─────
const RAZREDI = [5, 6, 7, 8];
const kvizPo = (id) => kvizovi.find((x) => x.id === id);

// kategorija (kviz sa "kategorija": true, bez pitanja – npr. „Eksperimenti“) okuplja podkategorije iste oblasti (npr. TLA+)
function grupaOblasti(o) {
  const clanovi = kvizovi.filter((x) => x.oblast === o);
  const glavni = clanovi.find((x) => x.kategorija) || clanovi.find((x) => !x.razred) || clanovi[0] || {};
  const podkategorije = glavni.kategorija ? clanovi.filter((x) => x !== glavni && !x.razred) : [];
  return { oblast: o, glavni, clanovi, podkategorije, naziv: glavni.razred ? glavni.naziv.replace(/^\d+\. razred · /, '') : glavni.naziv, ikona: glavni.ikona, boja: glavni.boja, broj: clanovi.reduce((s, x) => s + x.broj, 0), zadaci: clanovi.every((x) => x.zadaci) };
}
const brojTema = (n) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'tema' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'teme' : 'tema'}`;
// natpis za ceo kviz sa lekcijama: „Cela godina“ (razredi) ili sopstveni ("celina": "Cela knjiga")
const celina = (k) => k.celina || 'Cela godina';

// rastavlja izbor na delove: { oblast, paket, lekcija }
function rastaviIzbor(id) {
  id = String(id || 'opste');
  if (id.startsWith('oblast:')) return { oblast: id.slice(7) };
  const [pid, lek] = id.split('#');
  const k = kvizPo(pid);
  return { oblast: k?.oblast || null, paket: k || null, lekcija: lek ? +lek : null };
}

function opisIzbora(id) {
  const r = rastaviIzbor(id);
  if (id === 'opste' || (!r.oblast && !r.paket)) return kvizPo('opste') || { naziv: 'Opšte znanje', ikona: '🌍' };
  if (!r.paket) { const g = grupaOblasti(r.oblast); return { naziv: g.naziv, podnaslov: g.podkategorije.length ? 'sve teme' : 'svi razredi', ikona: g.ikona, boja: g.boja }; }
  const k = r.paket;
  if (r.lekcija) return { naziv: k.lekcije[r.lekcija - 1]?.naziv || k.naziv, podnaslov: k.naziv, ikona: k.ikona, boja: k.boja, jezik: k.jezik };
  return { naziv: k.naziv, podnaslov: k.razred || (k.celina && k.lekcije.length) ? celina(k).toLowerCase() : '', ikona: k.ikona, boja: k.boja };
}

function izborKvizaHTML(P) {
  const r = rastaviIzbor(P.kviz);
  // kartice: obični kvizovi + jedna kartica po oblasti (opšti kviz i razredi zajedno)
  const vidjene = new Set();
  const kartice = [];
  for (const q of kvizovi) {
    if (!q.oblast) { kartice.push({ id: q.id, naziv: q.naziv, ikona: q.ikona, broj: q.broj, izabran: q.id === P.kviz }); continue; }
    if (vidjene.has(q.oblast)) continue;
    vidjene.add(q.oblast);
    const g = grupaOblasti(q.oblast);
    kartice.push({ id: 'oblast:' + q.oblast, naziv: g.naziv, ikona: g.ikona, broj: g.broj, izabran: r.oblast === q.oblast, razredi: g.clanovi.some((x) => x.razred), teme: g.podkategorije.length, zadaci: g.zadaci });
  }
  return `<div class="kartica"><h3>Izaberi predmet</h3><div class="kvizovi">${kartice.map((q) => `
    <button class="kviz ${q.izabran ? 'izabran' : ''}" data-k="${q.id}"><div class="ik">${q.ikona}</div><div class="nz">${esc(q.naziv)}</div><div class="br">${q.broj} ${q.zadaci ? 'zadataka' : 'pitanja'}${q.razredi ? ' · po razredima' : ''}${q.teme ? ' · ' + brojTema(q.teme) : ''}</div></button>`).join('')}</div></div>`;
}

// spisak lekcija izabranog kviza: „Cela godina“ (ili `celina`) + lekcije, grupisane po temama
function lekcijeHTML(k, lekcija) {
  let tema = null;
  let html = `<div class="lekcije"><button class="lekcija ${!lekcija ? 'izabran' : ''}" data-k="${k.id}"><b>📚 ${esc(celina(k))}</b><span>${k.broj}</span></button>`;
  k.lekcije.forEach((l, i) => {
    if (l.tema && l.tema !== tema) { tema = l.tema; html += `<div class="tema">${strano(esc(tema), k.jezik)}</div>`; }
    html += `<button class="lekcija ${lekcija === i + 1 ? 'izabran' : ''}" data-k="${k.id}#${i + 1}" ${l.broj ? '' : 'disabled'}><span class="rb">${i + 1}.</span> ${strano(esc(l.naziv), k.jezik)}<span>${l.broj}</span></button>`;
  });
  return html + '</div>';
}

// drugi korak: izabrani predmet (sa „promeni“) + razred i lekcija, ako ih predmet ima
function izborRazredaHTML(P) {
  const r = rastaviIzbor(P.kviz);
  const opis = r.oblast ? grupaOblasti(r.oblast) : opisIzbora(P.kviz);
  let html = `<div class="kartica izabrani-predmet"><div class="ik">${opis.ikona || '🌍'}</div><div class="nz">${esc(opis.naziv)}</div>
    <button id="promeni-predmet">← Promeni</button></div>`;
  if (!r.oblast) return html;
  const g = grupaOblasti(r.oblast);
  if (g.podkategorije.length) {
    // kategorija (npr. „Eksperimenti“): izbor teme, pa poglavlje/lekcija
    html += `<div class="kartica"><h3>Tema</h3><div class="izbor razredi">
      <button data-k="oblast:${g.oblast}" class="${!r.paket ? 'izabran' : ''}">Sve teme</button>
      ${g.podkategorije.map((k) => `<button data-k="${k.id}" class="${r.paket === k ? 'izabran' : ''}">${k.ikona} ${esc(k.naziv)}</button>`).join('')}</div>`;
    if (r.paket?.lekcije.length) html += lekcijeHTML(r.paket, r.lekcija);
    return html + '</div>';
  }
  if (!g.clanovi.some((x) => x.razred)) return html;
  const raz = r.paket?.razred || null;
  html += `<div class="kartica"><h3>Razred</h3><div class="izbor razredi">
    <button data-k="oblast:${g.oblast}" class="${!r.paket ? 'izabran' : ''}">Svi razredi</button>
    ${RAZREDI.map((n) => {
      const k = g.clanovi.find((x) => x.razred === n);
      return `<button ${k ? `data-k="${k.id}"` : 'disabled title="Još nema pitanja za ovaj razred"'} class="${raz === n ? 'izabran' : ''}">${n}.</button>`;
    }).join('')}</div>`;
  if (raz && r.paket.lekcije.length) html += lekcijeHTML(r.paket, r.lekcija);
  return html + '</div>';
}

// vođa bira u dva koraka: 1) predmet, 2) razred/lekcija + podešavanja + „Pokreni“
let korakLobija = 'predmet', korakSoba = null;
function podesavanja() {
  const P = V.podesavanja;
  const k = $('#podesavanja');
  const izbor = opisIzbora(P.kviz);
  if (!jaDomacin()) {
    k.innerHTML = `<div class="kartica centar"><div style="font-size:2.5em">${izbor.ikona || '🌍'}</div><h2>${strano(esc(izbor.naziv), izbor.jezik)}</h2>
      ${izbor.podnaslov ? `<div class="sitno">${esc(izbor.podnaslov)}</div>` : ''}
      <div class="cekanje">Čeka se da vođa igre pokrene igru<span class="tackice"></span></div></div>`;
    donjaTraka('');
    return;
  }
  const opcija = (ime, vrednosti, natpisi) => `<div class="izbor" data-p="${ime}">${vrednosti.map((v, i) =>
    `<button data-v="${v}" class="${String(P[ime]) === String(v) ? 'izabran' : ''}">${natpisi ? natpisi[i] : v}</button>`).join('')}</div>`;
  if (korakSoba !== V.kod) { korakSoba = V.kod; korakLobija = 'predmet'; }
  if (korakLobija === 'predmet') {
    const html = izborKvizaHTML(P);
    if (k.dataset.h !== html) {
      k.innerHTML = html;
      k.dataset.h = html;
      k.querySelectorAll('[data-k]').forEach((b) => (b.onclick = () => {
        Zvuk.efekat('klik');
        const id = b.dataset.k;
        korakLobija = 'podesavanja';
        // isti predmet kao do sada – zadrži već izabran razred/lekciju
        const isti = id.startsWith('oblast:') && rastaviIzbor(P.kviz).oblast === id.slice(7);
        if (!isti && id !== P.kviz) akcija('podesavanja', { podesavanja: { kviz: id } });
        podesavanja();
        window.scrollTo({ top: $('#podesavanja').offsetTop - 10, behavior: 'smooth' });
      }));
    }
    donjaTraka('<div class="cekanje">Izaberi predmet ☝️</div>');
    return;
  }
  const html = `
    ${izborRazredaHTML(P)}
    <div class="kartica"><h3>Podešavanja</h3>
      ${V.zadaci ? `<div class="podesavanje"><span>Broj zadataka</span>${opcija('brojZadataka', [1, 3, 5, 10])}</div>
      <div class="podesavanje"><span>Minuta po zadatku</span>${opcija('vremeZadatka', [120, 180, 300, 480, 600, 900], ['2', '3', '5', '8', '10', '15'])}</div>
      <div class="sitno">Zadaci se rešavaju na papiru; posle svakog sledi detaljno rešenje korak po korak.</div>` : `
      <div class="podesavanje"><span>Krugovi</span>${opcija('krugovi', ['oba', 'pitanja', 'reci'], ['Oba', 'Pitanja', 'Reči'])}</div>
      ${P.krugovi !== 'reci' ? `<div class="podesavanje"><span>Broj pitanja</span>${opcija('brojPitanja', [5, 10, 15, 20, 25])}</div>
      <div class="podesavanje"><span>Sekundi za pitanje</span>${opcija('vreme', [10, 15, 20, 30, 45])}</div>` : ''}
      ${P.krugovi !== 'pitanja' ? `<div class="podesavanje"><span>Krug „Najduža reč“</span>${opcija('brojReci', [1, 3, 5, 10, 15], ['1', '3', '5', '10', '15'])}</div>
      <div class="podesavanje"><span>Sekundi za reč</span>${opcija('vremeReci', [45, 60, 75, 90, 120])}</div>
      ` : ''}`}
      <div class="podesavanje"><span>Pismo</span>${opcija('pismo', ['cirilica', 'latinica'], ['Ćirilica', '<span data-lat>Latinica</span>'])}</div>
    </div>`;
  if (k.dataset.h !== html) {
    k.innerHTML = html;
    k.dataset.h = html;
    k.querySelectorAll('[data-k]').forEach((b) => (b.onclick = () => {
      Zvuk.efekat('klik');
      akcija('podesavanja', { podesavanja: { kviz: b.dataset.k } });
    }));
    $('#promeni-predmet', k).onclick = () => { Zvuk.efekat('klik'); korakLobija = 'predmet'; podesavanja(); };
    k.querySelectorAll('.izbor[data-p] button').forEach((b) => (b.onclick = () => {
      Zvuk.efekat('klik');
      akcija('podesavanja', { podesavanja: { [b.parentNode.dataset.p]: b.dataset.v } });
    }));
  }
  const d = donjaTraka(`<button class="dugme zeleno" id="start">▶ Pokreni igru${V.igraci.length === 1 ? ' (sam)' : ''}</button>`);
  $('#start', d).onclick = () => { Zvuk.otkljucaj(); Zvuk.efekat('fanfare'); akcija('pokreni'); };
}

async function slavni() {
  let s;
  try { s = await (await fetch('/api/statistika')).json(); } catch { return; }
  const lista = Object.values(s.igraci || {}).sort((a, b) => b.pobede - a.pobede || b.poeni - a.poeni);
  const el = $('#slavni');
  if (!el) return;
  if (!lista.length) { el.innerHTML = '<h3>🏆 Porodična tabla slavnih</h3><div class="sitno">Ovde će se upisivati pobede, rekordi i najduže reči.</div>'; return; }
  el.innerHTML = `<h3>🏆 Porodična tabla slavnih</h3><table class="slavni">${lista.slice(0, 10).map((p) => `<tr>
    <td>${esc(p.avatar)} <b>${esc(p.ime)}</b><div class="sitno">${p.igre} igara · ${p.odgovorenih ? Math.round((100 * p.tacnih) / p.odgovorenih) : 0}% tačno${p.najduzaRec ? ' · reč: ' + esc(rec(p.najduzaRec)).toUpperCase() : ''}</div></td>
    <td>🥇 ${p.pobede}<div class="sitno">rekord ${p.rekord || 0}</div></td></tr>`).join('')}</table>`;
}

// ───────────────────────── uvod kruga ─────────────────────────
function ekranUvod(nov) {
  if (!nov) return;
  const u = V.uvod;
  const pitanja = u.vrsta === 'pitanja';
  const kv = opisIzbora(V.podesavanja.kviz);
  app.innerHTML = `<div class="uvod">
    <div class="veliki">${pitanja ? kv?.ikona || '❓' : '🔤'}</div>
    <div class="sitno">Krug ${u.broj}${pitanja && kv?.podnaslov ? ' · ' + esc(kv.podnaslov) : ''}</div>
    <h1>${pitanja ? esc(kv?.naziv || 'Pitanja') : 'Najduža reč'}</h1>
    <p>${pitanja && V.zadaci ? `${u.brojPitanja} ${u.brojPitanja === 1 ? 'zadatak' : u.brojPitanja < 5 ? 'zadatka' : 'zadataka'}, po ${Math.round(V.podesavanja.vremeZadatka / 60)} min. Pripremi papir i olovku! Tačan odgovor donosi poene (brže rešenje malo više), a posle svakog zadatka sledi detaljno rešenje korak po korak.`
      : pitanja ? `${u.brojPitanja} pitanja sa 4 ponuđena odgovora. Brži tačan odgovor donosi više poena, teška pitanja vrede ×1,5, a niz tačnih odgovora daje bonus!`
      : `${u.brojReci === 1 ? '12 slova' : `${u.brojReci}× po 12 slova`}. Složi što dužu reč u osnovnom obliku (imenica u jednini, glagol u infinitivu…) – važe i imena, npr. Venera ili Beograd. 100 poena po slovu, bonus za najdužu!${V.krugovi.includes('pitanja') ? ' U slovima se krije i jedan pojam iz prethodnih pitanja – ko ga pronađe, dobija +200.' : ''}`}</p>
  </div>`;
  Zvuk.efekat('bubanj');
  dugmeDalje('Kreni! ➜');
}

// ───────────────────────── tajmer ─────────────────────────
function tajmer(pocetak, trajanje) {
  const traka = $('.tajmer i'), br = $('.sekunde');
  let posl = -1;
  const tik = () => {
    const ost = Math.max(0, pocetak + trajanje - sada());
    if (traka) traka.style.transform = `scaleX(${ost / trajanje})`;
    const s = Math.ceil(ost / 1000);
    if (br && s !== posl) {
      br.textContent = trajanje > 99000 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : s;
      br.classList.toggle('hitno', s <= 5);
      if (s <= 5 && s > 0 && posl !== -1) Zvuk.efekat('tik');
      posl = s;
    }
  };
  tik();
  clearInterval(tikTajmer);
  tikTajmer = setInterval(tik, 100);
}

// ───────────────────────── pitanje ─────────────────────────
// posebne vrste pitanja: natpis iznad pitanja
const VRSTE_PITANJA = { uljez: '🕵️ Izbaci uljeza', spoji: '🔗 Spoji pojmove' };

function zaglavljePitanja(P) {
  const zvezde = [1, 2, 3].map((i) => `<span style="opacity:${i <= P.tezina ? 1 : 0.25}">★</span>`).join('');
  return `
      <div class="traka"><span class="znacka">${P.rb}/${P.ukupno}</span>
        ${P.oblast ? `<span class="znacka" style="background:${P.oblast.boja}">${P.oblast.ikona} ${esc(P.oblast.naziv)}</span>` : ''}
        <span class="znacka tezina" title="težina">${zvezde}${P.tezina === 3 ? ' ×1,5' : ''}</span><span class="razmak"></span><span class="sekunde"></span></div>
      <div class="tajmer"><i></i></div>
      ${VRSTE_PITANJA[P.vrsta] ? `<div class="vrsta-pitanja">${VRSTE_PITANJA[P.vrsta]}</div>` : ''}
      <div class="pitanje-tekst${P.zadatak ? ' zadatak' : ''}">${mat(P.tekst)}</div>`;
}

// rezultat igrača, „Da li si znao?“ i poeni svih igrača – zajedničko za sve vrste pitanja
function otkrivanjePitanja(P, naslov) {
  const moj = V.dobitak[V.ja];
  let rez = '';
  if (moj && !EKRAN) {
    if (moj.tacno) {
      rez = `<div class="rezultat dobro">${P.vrsta === 'spoji' ? 'Sve tačno!' : 'Tačno!'} +${moj.poeni}</div>${moj.bonus ? `<div class="bonus">🔥 Niz od ${moj.niz} tačnih: +${moj.bonus}</div>` : ''}`;
      Zvuk.efekat('tacno');
      if (moj.niz >= 3) konfete(40);
    } else if (moj.pogodjeno) {
      rez = `<div class="rezultat delimicno">${moj.pogodjeno} od ${moj.od} tačno · +${moj.poeni}</div>`;
      Zvuk.efekat('tacno');
    } else {
      rez = `<div class="rezultat lose">${moj.bez ? 'Vreme je isteklo ⏰' : 'Netačno 😕'}</div>`;
      Zvuk.efekat('netacno');
    }
  } else if (EKRAN) Zvuk.efekat('tacno');
  const tacniLista = V.igraci.filter((x) => V.dobitak[x.id]?.tacno).sort((a, b) => V.dobitak[a.id].ms - V.dobitak[b.id].ms);
  const brzi = tacniLista[0];
  const poeni = V.igraci.length > 1 || EKRAN ? `<div class="kartica"><div class="lista-poena">${skratiListu([...V.igraci].sort((a, b) => b.poeni - a.poeni), (x, i) => {
    const d = V.dobitak[x.id] || {};
    return `<div class="st ${x.id === V.ja ? 'ja' : ''}" style="animation-delay:${0.1 * Math.min(i, 8)}s">${mesto(i)}<span style="font-size:1.4em">${esc(x.avatar)}</span><b>${esc(x.ime)}</b>
      ${d.poeni > 0 ? `<span class="plus">+${d.poeni + (d.bonus || 0)}</span>${d.od ? ` <span class="sitno">${d.pogodjeno}/${d.od}</span>` : ''}${x === brzi && tacniLista.length > 1 ? ' ⚡' : ''}` : '<span class="sitno">—</span>'}<span class="p">${x.poeni}</span></div>`;
  })}</div></div>` : '';
  return `${rez}
      <div class="kartica zanimljivost">${naslov}${P.objasnjenje ? `<p>${mat(P.objasnjenje)}</p>` : ''}
      ${P.zanimljivost ? `<h3 style="margin-top:12px">💡 Da li si znao?</h3><div>${mat(P.zanimljivost)}</div>` : ''}
      ${P.medijiOdgovora ? '<div id="medij-odgovora"></div>' : ''}</div>
      ${P.resenje ? resenjeHTML(P) : ''}
      ${poeni}`;
}

// medij uz zanimljivost (npr. fotografija onoga što je bio tačan odgovor) – crta se tek pri otkrivanju
function prikaziMedijOdgovora(P) {
  const k = $('#medij-odgovora');
  if (k && P.medijiOdgovora) ciscenje.push(prikaziMedij(k, P.medijiOdgovora, { auto: true, paket: P.paket }));
}

// ───── rešenje zadatka korak po korak: crtež prati korak (novi elementi se pojavljuju, delovi se ističu) ─────
function resenjeHTML(P) {
  const R = P.resenje;
  const crtez = P.mediji?.vrsta === 'geo' || R.some((k) => k.crtez);
  return `<div class="kartica resenje"><h3>📝 Rešenje</h3>
    ${crtez ? '<div class="medij medij-svg resenje-crtez" id="resenje-crtez"></div>' : ''}
    <ol class="koraci">${R.map((k, i) => `<li data-k="${i}">${mat(k.t)}</li>`).join('')}</ol>
    <div class="koraci-dugmad"><button class="dugme sivo" id="kr-pre">◀</button><span id="kr-br"></span>
      <button class="dugme zuto" id="kr-sled">Sledeći korak ▶</button><button class="dugme sivo" id="kr-sve">Sve</button></div>
  </div>`;
}

function pokreniResenje(P) {
  const R = P.resenje;
  let tek = 0, vidljivo = 0;
  const crtez = $('#resenje-crtez');
  const prikazi = () => {
    app.querySelectorAll('.koraci li').forEach((li, i) => {
      li.classList.toggle('skriven', i > vidljivo);
      li.classList.toggle('aktivan', i === tek);
    });
    if (crtez) {
      const k = R[tek];
      const m = k.crtez || (P.mediji?.vrsta === 'geo' ? P.mediji : null);
      crtez.style.display = m ? '' : 'none';
      if (m) crtez.innerHTML = window.Geo.crtajGeo(m, { korak: k.crtez ? 99 : tek + 1, istakni: k.i || [], prevod: tr });
    }
    $('#kr-br').textContent = `${tek + 1} / ${R.length}`;
    $('#kr-pre').disabled = tek === 0;
    $('#kr-sled').disabled = tek === R.length - 1;
    $('#kr-sve').style.display = vidljivo === R.length - 1 ? 'none' : '';
  };
  const idi = (i) => { tek = Math.max(0, Math.min(R.length - 1, i)); vidljivo = Math.max(vidljivo, tek); prikazi(); };
  $('#kr-pre').onclick = () => { Zvuk.efekat('klik'); idi(tek - 1); };
  $('#kr-sled').onclick = () => { Zvuk.efekat('klik'); idi(tek + 1); $('.koraci li.aktivan')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
  $('#kr-sve').onclick = () => { vidljivo = R.length - 1; prikazi(); };
  app.querySelectorAll('.koraci li').forEach((li) => (li.onclick = () => { if (!li.classList.contains('skriven')) idi(+li.dataset.k); }));
  // veliki ekran sam prolazi kroz korake
  if (EKRAN) {
    const t = setInterval(() => { if (tek < R.length - 1) idi(tek + 1); else clearInterval(t); }, 7000);
    ciscenje.push(() => clearInterval(t));
  }
  prikazi();
}

function ekranPitanje(nov, staro) {
  const P = V.pitanje;
  if (P.vrsta === 'spoji') return ekranSpoji(nov, staro);
  const otkriveno = V.faza === 'otkrivanje';
  if (nov) {
    app.innerHTML = `${zaglavljePitanja(P)}
      <div id="medij"></div>
      <div class="odgovori" id="odgovori">${P.odgovori.map((o, i) => `<button class="odg" data-i="${i}" data-slovo="${slovaOdg()[i]}">${mat(o)}<span class="glasovi"></span><span class="procenat"></span></button>`).join('')}</div>
      <div id="ispod"></div>`;
    if (P.mediji) ciscenje.push(prikaziMedij($('#medij'), P.mediji, { auto: true, paket: P.paket }));
    else $('#medij').remove();
    if (P.odgovori.every((o) => o.length < 18) && !EKRAN) $('#odgovori').classList.add('dvokolonski');
    app.querySelectorAll('.odg').forEach((b) => (b.onclick = () => {
      if (EKRAN || V.faza !== 'pitanje' || V.mojOdgovor !== null) return;
      Zvuk.efekat('klik');
      V.mojOdgovor = +b.dataset.i;
      ekranPitanje(false);
      akcija('odgovor', { izbor: +b.dataset.i });
    }));
    if (!otkriveno) tajmer(P.pocetak, P.trajanje);
  }
  const odg = $('#odgovori');
  app.querySelectorAll('.odg').forEach((b, i) => {
    b.classList.toggle('izabran', V.mojOdgovor === i);
    b.classList.toggle('tacan', otkriveno && P.tacan === i);
  });
  odg.classList.toggle('zakljucano', V.mojOdgovor !== null && !otkriveno);
  odg.classList.toggle('otkriveno', otkriveno);
  const ispod = $('#ispod');

  if (!otkriveno) {
    ispod.innerHTML = `${V.mojOdgovor !== null ? '<div class="cekanje">Odgovor zaključan 🔒 čekamo ostale<span class="tackice"></span></div>'
      : P.zadatak && !EKRAN ? '<div class="sitno centar">✏️ Reši zadatak na papiru, pa izaberi odgovor.</div>' : ''}
      ${koJeOdgovorio(V.odgovorili)}`;
    donjaTraka('');
    return;
  }

  // ── otkrivanje ──
  if (nov || staro?.faza !== 'otkrivanje') {
    clearInterval(tikTajmer);
    $('.tajmer i').style.transform = 'scaleX(0)';
    $('.sekunde').textContent = '';
    const ukupno = V.raspodela.reduce((a, b) => a + b, 0) || 1;
    app.querySelectorAll('.odg').forEach((b, i) => {
      $('.procenat', b).style.width = (100 * V.raspodela[i]) / ukupno + '%';
      const glasali = Object.entries(V.izbori).filter(([, iz]) => iz === i).map(([id]) => esc(igrac(id)?.avatar || ''));
      // u velikoj sobi samo broj glasova (avatari bi prekrili tekst odgovora)
      $('.glasovi', b).innerHTML = mnogo() ? (glasali.length ? `<b class="jos">${glasali.length}</b>` : '') : glasali.join('');
    });
    const naslov = P.vrsta === 'uljez' ? `<h3>🕵️ Uljez je: ${mat(P.odgovori[P.tacan])}</h3>` : `<h3>✅ ${mat(P.odgovori[P.tacan])}</h3>`;
    ispod.innerHTML = otkrivanjePitanja(P, naslov);
    prikaziMedijOdgovora(P);
    if (P.resenje) pokreniResenje(P);
    if (!EKRAN) setTimeout(() => $('.zanimljivost')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 900);
  }
  dugmeDalje(P.rb === P.ukupno ? 'Rang lista 🏆' : 'Sledeće pitanje ➜');
}

// ───────────────────────── spoji pojmove ─────────────────────────
// Dodirni pojam levo, pa njegov par desno – spojeni parovi dobiju istu boju. Ponovni dodir raskida par.
const BOJE_PAROVA = ['#e17055', '#0984e3', '#00b894', '#e1a700', '#a29bfe'];
let spajanje = { levo: 0, parovi: [] }; // parovi[i] = indeks pojma desno spojenog sa i-tim levo (ili null)

function ekranSpoji(nov, staro) {
  const P = V.pitanje;
  const otkriveno = V.faza === 'otkrivanje';
  const n = P.levo.length;
  if (nov) {
    spajanje = { levo: 0, parovi: Array(n).fill(null) };
    app.innerHTML = `${zaglavljePitanja(P)}
      <div id="medij"></div>
      <div class="spoji" id="spoji">
        <div class="kolona">${P.levo.map((t, i) => `<button class="spoj levo" data-i="${i}" style="animation-delay:${0.05 * i}s">${mat(t)}</button>`).join('')}</div>
        <div class="kolona">${P.desno.map((t, j) => `<button class="spoj desno" data-j="${j}" style="animation-delay:${0.05 * j + 0.1}s">${mat(t)}</button>`).join('')}</div>
      </div>
      <div id="ispod"></div>`;
    if (P.mediji) ciscenje.push(prikaziMedij($('#medij'), P.mediji, { auto: true, paket: P.paket }));
    else $('#medij').remove();
    const moze = () => !EKRAN && V.faza === 'pitanje' && V.mojOdgovor === null;
    app.querySelectorAll('.spoj.levo').forEach((b) => (b.onclick = () => {
      if (!moze()) return;
      const i = +b.dataset.i;
      spajanje.parovi[i] = null;
      spajanje.levo = i;
      Zvuk.efekat('klik');
      ekranSpoji(false);
    }));
    app.querySelectorAll('.spoj.desno').forEach((b) => (b.onclick = () => {
      if (!moze()) return;
      const j = +b.dataset.j;
      const vec = spajanje.parovi.indexOf(j);
      if (vec >= 0) spajanje.parovi[vec] = null;
      if (spajanje.levo === null || vec === spajanje.levo) { spajanje.levo = vec >= 0 ? vec : spajanje.parovi.indexOf(null); }
      else {
        spajanje.parovi[spajanje.levo] = j;
        const sledeci = spajanje.parovi.findIndex((x, k) => x === null && k > spajanje.levo);
        spajanje.levo = sledeci >= 0 ? sledeci : spajanje.parovi.indexOf(null);
      }
      if (spajanje.levo < 0) spajanje.levo = null;
      Zvuk.efekat('klik');
      ekranSpoji(false);
    }));
    if (!otkriveno) tajmer(P.pocetak, P.trajanje);
  }
  // boje parova: moji izbori (pre slanja – lokalni, posle – sa servera)
  const parovi = Array.isArray(V.mojOdgovor) ? V.mojOdgovor : spajanje.parovi;
  app.querySelectorAll('.spoj.levo').forEach((b, i) => {
    const boja = parovi[i] !== null && parovi[i] !== undefined ? BOJE_PAROVA[i] : '';
    b.style.background = boja;
    b.classList.toggle('spojen', !!boja);
    b.classList.toggle('aktivan', !otkriveno && V.mojOdgovor === null && spajanje.levo === i);
    b.classList.toggle('tacan', otkriveno && Array.isArray(V.mojOdgovor) && V.mojOdgovor[i] === P.tacan[i]);
    b.classList.toggle('pogresan', otkriveno && Array.isArray(V.mojOdgovor) && V.mojOdgovor[i] !== P.tacan[i]);
  });
  app.querySelectorAll('.spoj.desno').forEach((b, j) => {
    const i = parovi.indexOf(j);
    b.style.background = i >= 0 ? BOJE_PAROVA[i] : '';
    b.classList.toggle('spojen', i >= 0);
  });
  $('#spoji').classList.toggle('zakljucano', V.mojOdgovor !== null && !otkriveno);
  const ispod = $('#ispod');

  if (!otkriveno) {
    const spremno = spajanje.parovi.every((x) => x !== null);
    ispod.innerHTML = `${V.mojOdgovor !== null ? '<div class="cekanje">Parovi poslati 🔒 čekamo ostale<span class="tackice"></span></div>'
      : EKRAN ? '' : `<div class="sitno centar">${spremno ? 'Sve je spojeno – proveri pa pošalji.' : 'Dodirni pojam levo, pa njegov par desno.'}</div>`}
      ${koJeOdgovorio(V.odgovorili)}`;
    if (!EKRAN && V.mojOdgovor === null && spremno) {
      const d = donjaTraka('<button class="dugme zeleno" id="posalji-parove">Pošalji parove ✓</button>');
      $('#posalji-parove', d).onclick = () => {
        if (V.mojOdgovor !== null) return;
        Zvuk.efekat('klik');
        V.mojOdgovor = [...spajanje.parovi];
        akcija('odgovor', { izbor: V.mojOdgovor });
        ekranSpoji(false);
      };
    } else donjaTraka('');
    return;
  }

  if (nov || staro?.faza !== 'otkrivanje') {
    clearInterval(tikTajmer);
    $('.tajmer i').style.transform = 'scaleX(0)';
    $('.sekunde').textContent = '';
    const odgovorilo = Object.keys(V.izbori).length || 1;
    const resenje = P.levo.map((l, i) => {
      const moj = Array.isArray(V.mojOdgovor) ? V.mojOdgovor[i] : null;
      const znak = moj === null || EKRAN ? '' : moj === P.tacan[i] ? '✅' : '❌';
      return `<div class="par-resenje" style="animation-delay:${0.12 * i}s"><span class="boja" style="background:${BOJE_PAROVA[i]}"></span>
        <span class="tekst"><b>${mat(l)}</b> <span class="strelica">→</span> ${mat(P.desno[P.tacan[i]])}</span>
        <span class="sitno">${Math.round((100 * V.raspodela[i]) / odgovorilo)}%</span>${znak ? `<span>${znak}</span>` : ''}</div>`;
    }).join('');
    ispod.innerHTML = otkrivanjePitanja(P, `<h3>🔗 Tačni parovi</h3>${resenje}`);
    prikaziMedijOdgovora(P);
    if (!EKRAN) setTimeout(() => $('.zanimljivost')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 900);
  }
  dugmeDalje(P.rb === P.ukupno ? 'Rang lista 🏆' : 'Sledeće pitanje ➜');
}

// ───────────────────────── rang lista ─────────────────────────
function ekranTabela(nov) {
  if (!nov) return dugmeDalje(V.tabela.poslednja ? 'Proglašenje pobednika 🏆' : 'Sledeći krug ➜');
  const T = V.tabela;
  const gusto = T.sada.length > MALO;
  const visina = gusto ? 42 : 66;
  const max = Math.max(1, ...T.sada.map((x) => x.poeni));
  const prePoz = Object.fromEntries(T.pre.map((x, i) => [x.id, i]));
  const prePoeni = Object.fromEntries(T.pre.map((x) => [x.id, x.poeni]));
  app.innerHTML = `<h1 class="centar" style="animation:uskok .6s">🏆 Rang lista</h1><div class="sitno centar">posle ${V.krug + 1}. kruga</div>
    <div class="tabela ${gusto ? 'gusto' : ''}" style="height:${T.sada.length * visina}px">${T.sada.map((r) => {
      const x = igrac(r.id); if (!x) return '';
      const i0 = prePoz[r.id] ?? T.sada.length;
      return `<div class="red-t${r.id === V.ja ? ' ja' : ''}" data-id="${esc(r.id)}" style="top:${i0 * visina}px"><span class="traka-p" style="width:${(100 * (prePoeni[r.id] || 0)) / max}%;background:${x.boja}"></span>
        <span class="mesto">${i0 + 1}.</span><span class="av">${esc(x.avatar)}</span><span class="nm">${esc(x.ime)}</span><span class="strelica"></span><span class="pp">${prePoeni[r.id] || 0}</span></div>`;
    }).join('')}</div>`;
  Zvuk.efekat('bubanj');
  setTimeout(() => {
    T.sada.forEach((r, i) => {
      const el = [...app.querySelectorAll('.red-t')].find((x) => x.dataset.id === r.id);
      if (!el) return;
      el.style.top = i * visina + 'px';
      $('.traka-p', el).style.width = (100 * r.poeni) / max + '%';
      $('.mesto', el).textContent = i + 1 + '.';
      const pre = prePoz[r.id];
      const s = $('.strelica', el);
      if (pre !== undefined && pre > i) { s.textContent = '▲' + (pre - i); s.style.color = '#55efc4'; }
      else if (pre !== undefined && pre < i) { s.textContent = '▼' + (i - pre); s.style.color = '#ff7675'; }
      if (i === 0) el.classList.add('prvi');
      brojanje($('.pp', el), prePoeni[r.id] || 0, r.poeni, 1600);
    });
    setTimeout(() => { Zvuk.efekat('fanfare'); konfete(70); }, 1300);
  }, 700);
  dugmeDalje(T.poslednja ? 'Proglašenje pobednika 🏆' : 'Sledeći krug ➜');
}

function brojanje(el, od, do_, ms) {
  const t0 = performance.now();
  const k = (t) => {
    const p = Math.min(1, (t - t0) / ms);
    el.textContent = Math.round(od + (do_ - od) * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(k);
  };
  requestAnimationFrame(k);
}

// ───────────────────────── najduža reč ─────────────────────────
let slozeno = [];
function ekranReci(nov, staro) {
  const R = V.reci;
  const otkriveno = V.faza === 'reci-otkrivanje';
  if (nov) {
    slozeno = [];
    app.innerHTML = `
      <div class="traka"><span class="znacka">🔤 Reč ${R.rb}/${R.ukupno}</span><span class="razmak"></span><span class="sekunde"></span></div>
      <div class="tajmer"><i></i></div>
      <div class="slova" id="slova">${R.slova.map((c, i) => `<button class="slovo" data-i="${i}" style="animation-delay:${i * 0.05}s">${slovo(c)}</button>`).join('')}</div>
      ${R.imaPojam && !otkriveno ? '<div class="pojam-savet">💡 U ovim slovima krije se jedan pojam iz kviza – pronađi ga za +200!</div>' : ''}
      <div id="sredina"></div>`;
    if (!otkriveno) tajmer(R.pocetak, R.trajanje);
    if (!EKRAN && !otkriveno) {
      $('#sredina').innerHTML = `
        <div class="slaganje" id="slaganje"></div>
        <div class="red" style="margin-top:10px">
          <button class="dugme sivo" id="brisi" style="flex:1">⌫</button>
          <button class="dugme sivo" id="ponisti" style="flex:1">✕</button>
          <button class="dugme zeleno" id="posalji" style="flex:2">Proveri ✓</button></div>
        <div class="kartica" style="padding:10px 14px"><div class="red"><span class="sitno">Tvoja najbolja:</span><span class="najbolja-rec" id="najbolja"></span></div>
        <div class="pokusaji" id="pokusaji"></div></div>`;
      app.querySelectorAll('.slovo').forEach((b) => (b.onclick = () => {
        const i = +b.dataset.i;
        if (slozeno.includes(i)) slozeno = slozeno.filter((x) => x !== i);
        else slozeno.push(i);
        Zvuk.efekat('klik');
        osveziSlaganje();
      }));
      $('#brisi').onclick = () => { slozeno.pop(); osveziSlaganje(); };
      $('#ponisti').onclick = () => { slozeno = []; osveziSlaganje(); };
      $('#posalji').onclick = async () => {
        if (slozeno.length < 2) return poruka('Izaberi bar 2 slova');
        const r = await akcija('rec', { indeksi: slozeno });
        if (r.ok) { Zvuk.efekat('tacno'); slozeno = []; osveziSlaganje(); }
        else { Zvuk.efekat('netacno'); poruka(r.poruka === 'Nema u rečniku' ? 'Nema u rečniku – probaj osnovni oblik reči'
          : r.poruka?.startsWith('Oblik reči') ? r.poruka + ' – složi osnovni oblik' : r.poruka || 'Ne može'); }
      };
      osveziSlaganje();
    }
  }
  if (!otkriveno) {
    if (!EKRAN) {
      $('#najbolja').textContent = R.mojaNajbolja ? `${rec(R.mojaNajbolja)} (${[...R.mojaNajbolja].length})` : '—';
      $('#pokusaji').innerHTML = R.moji.map((p) => `<div class="pokusaj ${p.ok ? 'ok' : 'ne'}"><span>${esc(rec(p.rec))}</span><small>${esc(p.poruka)}</small></div>`).join('');
      const gotov = R.gotovi.includes(V.ja);
      const d = donjaTraka(gotov ? '<div class="cekanje">Čekamo ostale<span class="tackice"></span></div>' : '<button class="dugme zuto" id="gotov">Gotov sam ✋</button>');
      if (!gotov) $('#gotov', d).onclick = () => { if (!R.mojaNajbolja && !confirm('Još nemaš nijednu ispravnu reč. Završiti?')) return; akcija('gotov'); };
    } else {
      $('#sredina').innerHTML = `${koJeOdgovorio(R.predali, 'završilo')}
        <div class="cekanje">Slažemo reči<span class="tackice"></span></div>`;
    }
    return;
  }
  if (nov || staro?.faza !== 'reci-otkrivanje') {
    clearInterval(tikTajmer);
    $('.tajmer i').style.transform = 'scaleX(0)';
    $('.sekunde').textContent = '';
    app.querySelectorAll('.slovo').forEach((b) => (b.onclick = null));
    const N = R.najbolje;
    const redosled = [...V.igraci].sort((a, b) => [...(V.dobitak[b.id]?.rec || '')].length - [...(V.dobitak[a.id]?.rec || '')].length);
    const moj = V.dobitak[V.ja];
    if (moj && !EKRAN) {
      if (moj.rec) Zvuk.efekat('tacno'); else Zvuk.efekat('netacno');
      if (moj.oznaka === 'Savršeno!') konfete(80);
    }
    $('#sredina').innerHTML = `
      ${moj && !EKRAN ? `<div class="rezultat ${moj.rec ? 'dobro' : 'lose'}">${moj.rec ? `+${moj.poeni + moj.bonus}${moj.oznaka ? ' · ' + moj.oznaka : ''}` : 'Bez reči 😕'}</div>` : ''}
      <div class="kartica"><div class="lista-poena">${skratiListu(redosled, (x, i) => {
        const d = V.dobitak[x.id] || {};
        return `<div class="st ${x.id === V.ja ? 'ja' : ''}" style="animation-delay:${0.15 * Math.min(i, 8)}s">${mesto(i)}<span style="font-size:1.4em">${esc(x.avatar)}</span><div><b>${esc(x.ime)}</b><div class="najbolja-rec" style="font-size:1.15em">${d.rec ? esc(rec(d.rec)) + ` <span class="sitno">(${[...d.rec].length})</span>` : '<span class="sitno">—</span>'}</div></div>
          <span class="p">${d.rec ? `<span class="plus">+${d.poeni + d.bonus}</span>` : ''}${d.oznaka ? `<div class="sitno">${d.oznaka}</div>` : ''}</span></div>`;
      })}</div></div>
      ${R.kljuc ? `<div class="kartica pojam"><h3>🔁 Pojam iz kviza: <span class="najbolja-rec">${esc(rec(R.kljuc.rec))}</span></h3>
        <div class="sitno">Iz pitanja: „${esc(R.kljuc.pitanje)}“ – tačan odgovor: <b>${esc(R.kljuc.odgovor)}</b></div>
        ${R.nasli.length ? `<div class="sitno" style="margin-top:6px">Pronašli: ${R.nasli.length > 8 ? R.nasli.length + ' igrača' : R.nasli.map((id) => esc(igrac(id)?.ime || '')).join(', ')} (+200)</div>` : ''}</div>` : ''}
      <div class="kartica zanimljivost"><h3>🤖 Najduže moguće (${N.duzina} slova)</h3>
        <div class="najbolja-rec">${N.reci.map((r) => esc(rec(r))).join(' · ') || '—'}</div>
        <div class="sitno" style="margin-top:8px">Reči proverava srpski rečnik sa oko 190.000 reči u osnovnom obliku (sa imenima i pojmovima iz kvizova).</div></div>`;
  }
  dugmeDalje(R.rb === R.ukupno ? 'Rang lista 🏆' : 'Sledeća slova ➜');
}

function osveziSlaganje() {
  const el = $('#slaganje');
  if (!el) return;
  el.innerHTML = slozeno.length ? slozeno.map((i) => `<span>${slovo(V.reci.slova[i])}</span>`).join('') : '<span class="prazno">dodiruj slova da složiš reč</span>';
  app.querySelectorAll('.slovo').forEach((b) => b.classList.toggle('iskorisceno', slozeno.includes(+b.dataset.i)));
}

// ───────────────────────── kraj ─────────────────────────
function ekranKraj(nov) {
  if (nov) {
    const R = V.konacno.map((r) => ({ ...igrac(r.id), poeni: r.poeni })).filter((x) => x.id);
    const [p1, p2, p3] = R;
    const stub = (x, m) => x ? `<div class="stub m${m}"><div class="lice">${esc(x.avatar)}</div><div class="ime">${esc(x.ime)}</div><div class="poeni">${x.poeni}</div><div class="blok">${m}</div></div>` : '<div class="stub"></div>';
    app.innerHTML = `<h1 class="centar" style="animation:uskok .8s">${R.length > 1 ? '🎉 Pobednik!' : '🎉 Kraj igre!'}</h1>
      <div class="podijum">${stub(p2, 2)}${stub(p1, 1)}${stub(p3, 3)}</div>
      ${R.length > 3 ? `<div class="kartica"><div class="lista-poena">${skratiListu(R.slice(3), (x, i) => `<div class="st ${x.id === V.ja ? 'ja' : ''}"><b>${i + 4}.</b> ${esc(x.avatar)} ${esc(x.ime)}<span class="p">${x.poeni}</span></div>`, EKRAN ? 12 : 7)}</div></div>` : ''}
      <div class="kartica centar sitno">Rezultati su upisani u porodičnu tablu slavnih 🏆</div>`;
    Zvuk.efekat('bubanj');
    setTimeout(() => { Zvuk.efekat('fanfare'); konfete(200); }, 2000);
    setTimeout(() => konfete(120), 3500);
  }
  if (jaDomacin()) {
    const d = donjaTraka('<button class="dugme zuto" id="opet">🔁 Nova igra</button>');
    $('#opet', d).onclick = () => akcija('lobi');
  } else donjaTraka(EKRAN ? '' : '<div class="cekanje">Vođa može da pokrene novu igru</div>');
}

// ───────────────────────── konfete ─────────────────────────
const konfete = (() => {
  const cv = $('#konfete');
  const g = cv.getContext('2d');
  let cestice = [], radi = false;
  const BOJE = ['#fdcb6e', '#ff7675', '#74b9ff', '#55efc4', '#a29bfe', '#fd79a8', '#ffffff'];
  function korak() {
    g.clearRect(0, 0, cv.width, cv.height);
    cestice = cestice.filter((c) => c.y < cv.height + 20);
    for (const c of cestice) {
      c.vy += 0.12; c.vx *= 0.99; c.x += c.vx; c.y += c.vy; c.r += c.vr;
      g.save(); g.translate(c.x, c.y); g.rotate(c.r); g.fillStyle = c.b; g.fillRect(-c.s / 2, -c.s / 4, c.s, c.s / 2); g.restore();
    }
    if (cestice.length) requestAnimationFrame(korak); else { radi = false; g.clearRect(0, 0, cv.width, cv.height); }
  }
  return (n = 100) => {
    cv.width = innerWidth; cv.height = innerHeight;
    for (let i = 0; i < n; i++) {
      const levo = i % 2;
      cestice.push({ x: levo ? 0 : cv.width, y: cv.height * 0.7, vx: (levo ? 1 : -1) * (3 + Math.random() * 7), vy: -8 - Math.random() * 9,
        r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, s: 7 + Math.random() * 8, b: BOJE[i % BOJE.length] });
    }
    if (!radi) { radi = true; requestAnimationFrame(korak); }
  };
})();

// ───────────────────────── start ─────────────────────────
document.addEventListener('pointerdown', () => Zvuk.otkljucaj(), { once: true });
document.addEventListener('visibilitychange', () => {
  // telefon se probudio – ako je veza pukla, poveži ponovo
  if (!document.hidden && V && nacin === 'sse' && izvor && izvor.readyState === 2) povezi(V.kod);
});
(async () => {
  postaviPismo(PISMO, false); // naslov kartice
  fetch('/api/kvizovi').then((r) => r.json()).then((k) => { if (Array.isArray(k)) kvizovi = k; }).catch(() => {});
  const qs = new URLSearchParams(location.search);
  const sacuvana = ls.get('soba', '');
  const kod = (qs.get('soba') || '').toUpperCase();
  if (!EKRAN && sacuvana && ja.ime && (!kod || kod === sacuvana)) {
    const r = await akcija('udji', { soba: sacuvana, ime: ja.ime, avatar: ja.avatar });
    if (r.kod) return povezi(r.kod);
    if (r.greska) ls.set('soba', '');
  }
  pocetna();
})();
