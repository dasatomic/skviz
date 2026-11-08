// Gric kviz – klijent (telefon ili TV ekran)
'use strict';
const { prikaziMedij, Zvuk } = window.Mediji;
const $ = (s, el = document) => el.querySelector(s);
const app = $('#app');
const EKRAN = location.pathname.startsWith('/ekran');
if (EKRAN) document.body.classList.add('ekran');

const AVATARI = ['🦉', '🦊', '🐼', '🐯', '🦁', '🐸', '🐙', '🦄', '🐧', '🐨', '🐵', '🐶', '🐱', '🐰', '🦖', '🐢', '🦋', '🐝', '🦈', '🐳', '🌻', '🚀', '⚽', '🎸', '👑', '🧙', '🦸', '🤖', '👽', '🍕', '🌈', '⭐'];
const SLOVA_ODG = ['A', 'B', 'C', 'D'];
const LAT = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'đ', е: 'e', ж: 'ž', з: 'z', и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r', с: 's', т: 't', ћ: 'ć', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'č', џ: 'dž', ш: 'š' };

const ls = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const ja = ls.get('ja', null) || { id: (EKRAN ? 'tv-' : 'p-') + Math.random().toString(36).slice(2, 10), ime: '', avatar: AVATARI[Math.floor(Math.random() * 12)] };
if (EKRAN && !ja.id.startsWith('tv-')) ja.id = 'tv-' + ja.id;
const sacuvajJa = () => { if (!EKRAN) ls.set('ja', ja); };

let V = null;          // poslednje stanje sa servera
let pomak = 0;         // razlika satova server - klijent
let izvor = null;      // EventSource
let kljucEkrana = '';  // kad se promeni – ekran se crta iznova
let ciscenje = [];     // funkcije za gašenje animacija
let kvizovi = [];
let tikTajmer = null;

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slovo = (c) => (V?.podesavanja?.pismo === 'cirilica' ? c : LAT[c] ?? c);
const rec = (r) => [...(r || '')].map(slovo).join('');
const igrac = (id) => V?.igraci.find((x) => x.id === id);
const jaDomacin = () => V && V.domacin === ja.id;
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

function primi(v) {
  pomak = v.sada - Date.now();
  const staro = V;
  V = v;
  if (!EKRAN && !v.igraci.some((x) => x.id === ja.id)) {
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
      primi(await r.json());
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
  izvor.onmessage = (e) => { stiglo = true; primi(JSON.parse(e.data)); };
  izvor.onerror = async () => {
    const r = await fetch(`/api/stanje?soba=${kod}&igrac=x&v=999999999`, { method: 'HEAD' }).catch(() => null);
    if (r && r.status === 404) { prekiniVezu(); V = null; ls.set('soba', ''); poruka('Soba više ne postoji'); pocetna(); }
  };
  // ako za 3 s ne stigne ništa preko SSE-a, prelazimo na long-polling
  setTimeout(() => {
    if (!stiglo && gen === generacija) { nacin = 'poll'; povezi(kod); }
  }, 3000);
}

function ocisti() {
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
async function pocetna() {
  ocisti();
  kljucEkrana = '';
  $('.meni-dugme')?.remove();
  const qs = new URLSearchParams(location.search);
  const kodIzLinka = (qs.get('soba') || '').toUpperCase();
  if (EKRAN) {
    app.innerHTML = `<div class="naslov-igre">Gric kviz</div><div class="podnaslov">📺 TV ekran – prikazuje igru za sve</div>
      <div class="kartica"><label>Kod sobe</label><input class="polje kod" id="kod" maxlength="4" value="${esc(kodIzLinka)}" placeholder="ABCD">
      <div style="height:12px"></div><button class="dugme zuto siroko" id="gledaj">Prikaži sobu</button></div>`;
    const kreni = () => { const k = $('#kod').value.trim().toUpperCase(); if (k.length === 4) povezi(k); };
    $('#gledaj').onclick = kreni;
    if (kodIzLinka) kreni();
    return;
  }
  let poznati = [];
  try { poznati = Object.values((await (await fetch('/api/statistika')).json()).igraci || {}); } catch {}
  app.innerHTML = `
    <div class="naslov-igre">Gric kviz</div>
    <div class="podnaslov">Porodični kviz znanja 🦉</div>
    <div class="kartica">
      <label class="sitno">Kako se zoveš?</label>
      <input class="polje" id="ime" maxlength="16" value="${esc(ja.ime)}" placeholder="Ime" autocomplete="off">
      ${poznati.length ? `<div class="cipovi">${poznati.map((p) => `<button class="cip" data-ime="${esc(p.ime)}" data-av="${esc(p.avatar)}">${esc(p.avatar)} ${esc(p.ime)}</button>`).join('')}</div>` : ''}
      <div class="avatari">${AVATARI.map((a) => `<button data-a="${a}" class="${a === ja.avatar ? 'izabran' : ''}">${a}</button>`).join('')}</div>
    </div>
    <div class="kartica">
      <button class="dugme zuto siroko" id="nova">🎲 Napravi sobu</button>
      <div class="centar sitno" style="margin:12px 0">ili uđi u postojeću</div>
      <div class="red"><input class="polje kod" id="kod" maxlength="4" placeholder="KOD" value="${esc(kodIzLinka)}" style="flex:1">
      <button class="dugme" id="udji">Uđi</button></div>
    </div>
    <div class="centar sitno">Igra se može igrati i sam – napravi sobu i pokreni.<br>TV / računar kao veliki ekran: <b>${location.host}/ekran</b></div>`;
  const ime = $('#ime');
  app.querySelectorAll('.avatari button').forEach((b) => (b.onclick = () => {
    ja.avatar = b.dataset.a;
    app.querySelectorAll('.avatari button').forEach((x) => x.classList.toggle('izabran', x === b));
    Zvuk.efekat('klik');
  }));
  app.querySelectorAll('.cip').forEach((b) => (b.onclick = () => {
    ime.value = b.dataset.ime; ja.avatar = b.dataset.av;
    app.querySelectorAll('.avatari button').forEach((x) => x.classList.toggle('izabran', x.dataset.a === ja.avatar));
  }));
  const proveri = () => {
    Zvuk.otkljucaj();
    ja.ime = ime.value.trim();
    if (!ja.ime) { poruka('Upiši ime 🙂'); ime.focus(); return false; }
    sacuvajJa();
    return true;
  };
  $('#nova').onclick = async () => {
    if (!proveri()) return;
    const r = await akcija('nova-soba', { ime: ja.ime, avatar: ja.avatar });
    if (r.kod) povezi(r.kod);
  };
  $('#udji').onclick = async () => {
    if (!proveri()) return;
    const kod = $('#kod').value.trim().toUpperCase();
    if (kod.length !== 4) return poruka('Kod ima 4 slova');
    const r = await akcija('udji', { soba: kod, ime: ja.ime, avatar: ja.avatar });
    if (r.kod) povezi(r.kod);
  };
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
    if (jaDomacin() && V.faza === 'pitanje') stavke.push(['⏭ Završi pitanje sad', () => akcija('dalje')]);
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
  $('#dalje', d).onclick = () => { Zvuk.efekat('klik'); akcija('dalje'); };
}

function avatarHTML(x, dodatak = '') {
  return `<div class="igrac ${x.povezan ? '' : 'odsutan'}" data-id="${x.id}">${x.id === V.domacin ? '<span class="kruna">👑</span>' : ''}
    <div class="av" style="border-color:${x.boja}">${esc(x.avatar)}</div><div class="ime">${esc(x.ime)}</div>${dodatak}</div>`;
}

// ───────────────────────── lobi ─────────────────────────
async function ekranLobi(nov) {
  if (nov) {
    if (!kvizovi.length) try { kvizovi = await (await fetch('/api/kvizovi')).json(); } catch {}
    let info = { adrese: [location.hostname], port: location.port };
    try { info = await (await fetch('/api/info')).json(); } catch {}
    // preko tunela (javna adresa) prikaži nju, a u kućnoj mreži IP adresu računara
    const lokalno = /^(localhost|127\.|\d+\.\d+\.\d+\.\d+$)/.test(location.hostname);
    const adresa = lokalno ? `http://${info.adrese[0] || location.hostname}:${info.port}` : location.origin;
    app.innerHTML = `
      <div class="naslov-igre" style="font-size:1.8rem">Gric kviz</div>
      <div class="kartica centar">
        <div class="sitno">Kod sobe</div><div class="kod-sobe">${V.kod}</div>
        <div class="adresa">${adresa}/?soba=${V.kod}</div>
        <div class="igraci" id="igraci"></div>
      </div>
      <div id="podesavanja"></div>
      <div class="kartica" id="slavni"></div>`;
    slavni();
  }
  $('#igraci').innerHTML = V.igraci.map((x) => avatarHTML(x)).join('') || '<div class="sitno">Još nema igrača</div>';
  if (jaDomacin()) {
    app.querySelectorAll('#igraci .igrac').forEach((el) => {
      if (el.dataset.id === ja.id) return;
      el.onclick = () => { if (confirm('Izbaciti igrača?')) akcija('izbaci', { koga: el.dataset.id }); };
    });
  }
  podesavanja();
}

function podesavanja() {
  const P = V.podesavanja;
  const k = $('#podesavanja');
  const izbranKviz = kvizovi.find((x) => x.id === P.kviz);
  if (!jaDomacin()) {
    k.innerHTML = `<div class="kartica centar"><div style="font-size:2.5em">${izbranKviz?.ikona || '🌍'}</div><h2>${esc(izbranKviz?.naziv || 'Opšte znanje')}</h2>
      <div class="cekanje">Čeka se da vođa igre pokrene igru<span class="tackice"></span></div></div>`;
    donjaTraka('');
    return;
  }
  const opcija = (ime, vrednosti, natpisi) => `<div class="izbor" data-p="${ime}">${vrednosti.map((v, i) =>
    `<button data-v="${v}" class="${String(P[ime]) === String(v) ? 'izabran' : ''}">${natpisi ? natpisi[i] : v}</button>`).join('')}</div>`;
  const html = `
    <div class="kartica"><h3>Izaberi kviz</h3><div class="kvizovi">${kvizovi.map((q) => `
      <button class="kviz ${q.id === P.kviz ? 'izabran' : ''}" data-k="${q.id}"><div class="ik">${q.ikona}</div><div class="nz">${esc(q.naziv)}</div><div class="br">${q.broj} pitanja</div></button>`).join('')}</div></div>
    <div class="kartica"><h3>Podešavanja</h3>
      <div class="podesavanje"><span>Krugovi</span>${opcija('krugovi', ['oba', 'pitanja', 'reci'], ['Oba', 'Pitanja', 'Reči'])}</div>
      ${P.krugovi !== 'reci' ? `<div class="podesavanje"><span>Broj pitanja</span>${opcija('brojPitanja', [5, 10, 15, 20, 25])}</div>
      <div class="podesavanje"><span>Sekundi za pitanje</span>${opcija('vreme', [10, 15, 20, 30, 45])}</div>` : ''}
      ${P.krugovi !== 'pitanja' ? `<div class="podesavanje"><span>Krug „Najduža reč“</span>${opcija('brojReci', [1, 3, 5, 10, 15], ['1', '3', '5', '10', '15'])}</div>
      <div class="podesavanje"><span>Sekundi za reč</span>${opcija('vremeReci', [45, 60, 75, 90, 120])}</div>
      <div class="podesavanje"><span>Pismo za slova</span>${opcija('pismo', ['latinica', 'cirilica'], ['Latinica', 'Ćirilica'])}</div>` : ''}
    </div>`;
  if (k.dataset.h !== html) {
    k.innerHTML = html;
    k.dataset.h = html;
    k.querySelectorAll('.kviz').forEach((b) => (b.onclick = () => { Zvuk.efekat('klik'); akcija('podesavanja', { podesavanja: { kviz: b.dataset.k } }); }));
    k.querySelectorAll('.izbor button').forEach((b) => (b.onclick = () => {
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
  const kv = kvizovi.find((x) => x.id === V.podesavanja.kviz);
  app.innerHTML = `<div class="uvod">
    <div class="veliki">${pitanja ? kv?.ikona || '❓' : '🔤'}</div>
    <div class="sitno">Krug ${u.broj}</div>
    <h1>${pitanja ? esc(kv?.naziv || 'Pitanja') : 'Najduža reč'}</h1>
    <p>${pitanja ? `${u.brojPitanja} pitanja sa 4 ponuđena odgovora. Brži tačan odgovor donosi više poena, teška pitanja vrede ×1,5, a niz tačnih odgovora daje bonus!`
      : `${u.brojReci === 1 ? '12 slova' : `${u.brojReci}× po 12 slova`}. Složi što dužu reč u osnovnom obliku (imenica u jednini, glagol u infinitivu…). 100 poena po slovu, bonus za najdužu!${V.krugovi.includes('pitanja') ? ' U slovima se krije i jedan pojam iz prethodnih pitanja – ko ga pronađe, dobija +200.' : ''}`}</p>
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
      br.textContent = s;
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
function ekranPitanje(nov, staro) {
  const P = V.pitanje;
  const otkriveno = V.faza === 'otkrivanje';
  if (nov) {
    const zvezde = [1, 2, 3].map((i) => `<span style="opacity:${i <= P.tezina ? 1 : 0.25}">★</span>`).join('');
    app.innerHTML = `
      <div class="traka"><span class="znacka">${P.rb}/${P.ukupno}</span>
        ${P.oblast ? `<span class="znacka" style="background:${P.oblast.boja}">${P.oblast.ikona} ${esc(P.oblast.naziv)}</span>` : ''}
        <span class="znacka tezina" title="težina">${zvezde}${P.tezina === 3 ? ' ×1,5' : ''}</span><span class="razmak"></span><span class="sekunde"></span></div>
      <div class="tajmer"><i></i></div>
      <div class="pitanje-tekst">${esc(P.tekst)}</div>
      <div id="medij"></div>
      <div class="odgovori" id="odgovori">${P.odgovori.map((o, i) => `<button class="odg" data-i="${i}" data-slovo="${SLOVA_ODG[i]}">${esc(o)}<span class="glasovi"></span><span class="procenat"></span></button>`).join('')}</div>
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
  const ispod = $('#ispod');

  if (!otkriveno) {
    const ko = V.igraci.map((x) => avatarHTML(x, V.odgovorili.includes(x.id) ? '<span class="kvacica">✓</span>' : '')).join('');
    ispod.innerHTML = `${V.mojOdgovor !== null ? '<div class="cekanje">Odgovor zaključan 🔒 čekamo ostale<span class="tackice"></span></div>' : ''}
      ${V.igraci.length > 1 || EKRAN ? `<div class="igraci">${ko}</div>` : ''}`;
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
      $('.glasovi', b).innerHTML = Object.entries(V.izbori).filter(([, iz]) => iz === i).map(([id]) => esc(igrac(id)?.avatar || '')).join('');
    });
    const moj = V.dobitak[ja.id];
    let rez = '';
    if (moj && !EKRAN) {
      if (moj.tacno) {
        rez = `<div class="rezultat dobro">Tačno! +${moj.poeni}</div>${moj.bonus ? `<div class="bonus">🔥 Niz od ${moj.niz} tačnih: +${moj.bonus}</div>` : ''}`;
        Zvuk.efekat('tacno');
        if (moj.niz >= 3) konfete(40);
      } else {
        rez = `<div class="rezultat lose">${moj.bez ? 'Vreme je isteklo ⏰' : 'Netačno 😕'}</div>`;
        Zvuk.efekat('netacno');
      }
    } else if (EKRAN) Zvuk.efekat('tacno');
    const tacniLista = V.igraci.filter((x) => V.dobitak[x.id]?.tacno).sort((a, b) => V.dobitak[a.id].ms - V.dobitak[b.id].ms);
    const brzi = tacniLista[0];
    const poeni = V.igraci.length > 1 || EKRAN ? `<div class="kartica"><div class="lista-poena">${[...V.igraci].sort((a, b) => b.poeni - a.poeni).map((x, i) => {
      const d = V.dobitak[x.id] || {};
      return `<div class="st" style="animation-delay:${0.1 * i}s"><span style="font-size:1.4em">${esc(x.avatar)}</span><b>${esc(x.ime)}</b>
        ${d.tacno ? `<span class="plus">+${d.poeni + (d.bonus || 0)}</span>${x === brzi && tacniLista.length > 1 ? ' ⚡' : ''}` : '<span class="sitno">—</span>'}<span class="p">${x.poeni}</span></div>`;
    }).join('')}</div></div>` : '';
    ispod.innerHTML = `${rez}
      <div class="kartica zanimljivost"><h3>✅ ${esc(P.odgovori[P.tacan])}</h3>${P.objasnjenje ? `<p>${esc(P.objasnjenje)}</p>` : ''}
      ${P.zanimljivost ? `<h3 style="margin-top:12px">💡 Da li si znao?</h3><div>${esc(P.zanimljivost)}</div>` : ''}</div>
      ${poeni}`;
    if (!EKRAN) setTimeout(() => $('.zanimljivost')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 900);
  }
  dugmeDalje(P.rb === P.ukupno ? 'Rang lista 🏆' : 'Sledeće pitanje ➜');
}

// ───────────────────────── rang lista ─────────────────────────
function ekranTabela(nov) {
  if (!nov) return dugmeDalje(V.tabela.poslednja ? 'Proglašenje pobednika 🏆' : 'Sledeći krug ➜');
  const T = V.tabela;
  const visina = 66;
  const max = Math.max(1, ...T.sada.map((x) => x.poeni));
  const prePoz = Object.fromEntries(T.pre.map((x, i) => [x.id, i]));
  const prePoeni = Object.fromEntries(T.pre.map((x) => [x.id, x.poeni]));
  app.innerHTML = `<h1 class="centar" style="animation:uskok .6s">🏆 Rang lista</h1><div class="sitno centar">posle ${V.krug + 1}. kruga</div>
    <div class="tabela" style="height:${T.sada.length * visina}px">${T.sada.map((r) => {
      const x = igrac(r.id); if (!x) return '';
      const i0 = prePoz[r.id] ?? T.sada.length;
      return `<div class="red-t" data-id="${r.id}" style="top:${i0 * visina}px"><span class="traka-p" style="width:${(100 * (prePoeni[r.id] || 0)) / max}%;background:${x.boja}"></span>
        <span class="mesto">${i0 + 1}.</span><span class="av">${esc(x.avatar)}</span><span class="nm">${esc(x.ime)}</span><span class="strelica"></span><span class="pp">${prePoeni[r.id] || 0}</span></div>`;
    }).join('')}</div>`;
  Zvuk.efekat('bubanj');
  setTimeout(() => {
    T.sada.forEach((r, i) => {
      const el = app.querySelector(`.red-t[data-id="${r.id}"]`);
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
        else { Zvuk.efekat('netacno'); poruka(r.poruka === 'Nema u rečniku' ? 'Nema u rečniku – probaj osnovni oblik reči' : r.poruka || 'Ne može'); }
      };
      osveziSlaganje();
    }
  }
  if (!otkriveno) {
    if (!EKRAN) {
      $('#najbolja').textContent = R.mojaNajbolja ? `${rec(R.mojaNajbolja)} (${[...R.mojaNajbolja].length})` : '—';
      $('#pokusaji').innerHTML = R.moji.map((p) => `<div class="pokusaj ${p.ok ? 'ok' : 'ne'}"><span>${esc(rec(p.rec))}</span><small>${esc(p.poruka)}</small></div>`).join('');
      const gotov = R.gotovi.includes(ja.id);
      const d = donjaTraka(gotov ? '<div class="cekanje">Čekamo ostale<span class="tackice"></span></div>' : '<button class="dugme zuto" id="gotov">Gotov sam ✋</button>');
      if (!gotov) $('#gotov', d).onclick = () => { if (!R.mojaNajbolja && !confirm('Još nemaš nijednu ispravnu reč. Završiti?')) return; akcija('gotov'); };
    } else {
      $('#sredina').innerHTML = `<div class="igraci">${V.igraci.map((x) => avatarHTML(x, R.predali.includes(x.id) ? '<span class="kvacica">✓</span>' : '')).join('')}</div>
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
    const moj = V.dobitak[ja.id];
    if (moj && !EKRAN) {
      if (moj.rec) Zvuk.efekat('tacno'); else Zvuk.efekat('netacno');
      if (moj.oznaka === 'Savršeno!') konfete(80);
    }
    $('#sredina').innerHTML = `
      ${moj && !EKRAN ? `<div class="rezultat ${moj.rec ? 'dobro' : 'lose'}">${moj.rec ? `+${moj.poeni + moj.bonus}${moj.oznaka ? ' · ' + moj.oznaka : ''}` : 'Bez reči 😕'}</div>` : ''}
      <div class="kartica"><div class="lista-poena">${redosled.map((x, i) => {
        const d = V.dobitak[x.id] || {};
        return `<div class="st" style="animation-delay:${0.15 * i}s"><span style="font-size:1.4em">${esc(x.avatar)}</span><div><b>${esc(x.ime)}</b><div class="najbolja-rec" style="font-size:1.15em">${d.rec ? esc(rec(d.rec)) + ` <span class="sitno">(${[...d.rec].length})</span>` : '<span class="sitno">—</span>'}</div></div>
          <span class="p">${d.rec ? `<span class="plus">+${d.poeni + d.bonus}</span>` : ''}${d.oznaka ? `<div class="sitno">${d.oznaka}</div>` : ''}</span></div>`;
      }).join('')}</div></div>
      ${R.kljuc ? `<div class="kartica pojam"><h3>🔁 Pojam iz kviza: <span class="najbolja-rec">${esc(rec(R.kljuc.rec))}</span></h3>
        <div class="sitno">Iz pitanja: „${esc(R.kljuc.pitanje)}“ – tačan odgovor: <b>${esc(R.kljuc.odgovor)}</b></div>
        ${R.nasli.length ? `<div class="sitno" style="margin-top:6px">Pronašli: ${R.nasli.map((id) => esc(igrac(id)?.ime || '')).join(', ')} (+200)</div>` : ''}</div>` : ''}
      <div class="kartica zanimljivost"><h3>🤖 Najduže moguće (${N.duzina} slova)</h3>
        <div class="najbolja-rec">${N.reci.map((r) => esc(rec(r))).join(' · ') || '—'}</div>
        <div class="sitno" style="margin-top:8px">Reči proverava srpski rečnik sa ${'oko 160.000'} reči u osnovnom obliku.</div></div>`;
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
      ${R.length > 3 ? `<div class="kartica"><div class="lista-poena">${R.slice(3).map((x, i) => `<div class="st"><b>${i + 4}.</b> ${esc(x.avatar)} ${esc(x.ime)}<span class="p">${x.poeni}</span></div>`).join('')}</div></div>` : ''}
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
  fetch('/api/kvizovi').then((r) => r.json()).then((k) => (kvizovi = k)).catch(() => {});
  const qs = new URLSearchParams(location.search);
  const sacuvana = ls.get('soba', '');
  const kod = (qs.get('soba') || '').toUpperCase();
  if (!EKRAN && sacuvana && ja.ime && (!kod || kod === sacuvana)) {
    const r = await akcija('udji', { soba: sacuvana, ime: ja.ime, avatar: ja.avatar });
    if (r.kod) return povezi(r.kod);
    ls.set('soba', '');
  }
  pocetna();
})();
