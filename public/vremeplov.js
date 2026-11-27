// Bonus igra „Vremeplov“: tri događaja iz različitih doba, a igrač za svaki klizačem (i dugmićima ±1/±10/±100)
// bira godinu kada se desio. Poeni zavise od toga koliko je promašio, ali RELATIVNO prema tome koliko je događaj
// star: 20 godina za antiku je skoro pogodak, a za 20. vek veliki promašaj (logaritamsko bodovanje).
// Klizač ima logaritamsku skalu „godina unazad“: bliža prošlost je razvučena, a stari vek sabijen.
// Isti kôd koristi server (izbor događaja, bodovanje – lib/soba.js) i telefon (klizač, lenta na otkrivanju);
// spisak događaja je u podaci/vremeplov.txt i do telefona stiže samo ono što je u igri.
(function (koren, f) {
  const V = f();
  if (typeof module === 'object' && module.exports) module.exports = V;
  else koren.Vremeplov = V;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const OBLASTI = { srbija: '🇷🇸', svet: '🌍', nauka: '🔬', kultura: '🎭', sport: '🏅' };
  const OD = -3000, DO = 2026; // opseg klizača
  const REF = 2036; // „sada“ za logaritamsku skalu (malo posle DO – da i poslednje godine imaju mesta)
  const PO_RUNDI = 3;
  const MAX = 300; // poena po događaju
  const TACNO = 100; // bonus za tačnu godinu

  // „godina|naziv|zanimljivost|oblast|članak“ po redu (# = komentar)
  function parsiraj(tekst) {
    const dogadjaji = [], greske = [];
    String(tekst).split('\n').forEach((red, i) => {
      red = red.trim();
      if (!red || red.startsWith('#')) return;
      const [g, t, opis, oblast, wiki] = red.split('|').map((x) => (x || '').trim());
      const god = Number(g);
      if (!Number.isInteger(god) || god === 0 || god < OD || god > DO) greske.push(`red ${i + 1}: godina „${g}“`);
      else if (!t || !opis) greske.push(`red ${i + 1}: nedostaje naziv ili zanimljivost`);
      else if (!OBLASTI[oblast]) greske.push(`red ${i + 1}: nepoznata oblast „${oblast}“`);
      else dogadjaji.push({ id: `${god}:${t}`, g: god, t, opis, oblast, ...(wiki && { wiki }) });
    });
    return { dogadjaji, greske };
  }

  // doba (za raznovrsnost runde: tri događaja iz tri različita doba)
  function doba(g) {
    if (g < 500) return 'stari vek';
    if (g < 1500) return 'srednji vek';
    if (g < 1800) return 'novi vek';
    if (g < 1900) return '19. vek';
    if (g < 1960) return 'prva polovina 20. veka';
    return 'savremeno doba';
  }

  const promesaj = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // tri događaja iz različitih doba (bar jedan iz naše istorije, kad ga ima), izmešanim redom (redosled ne sme da oda godine);
  // bilo = id-jevi već odigranih događaja (dok ima neodigranih, oni se ne ponavljaju)
  // opcije.srbija – samo za srpsku istoriju: više naših događaja
  function napravi(svi, bilo = [], opcije = {}) {
    const vec = new Set(bilo);
    let izbor = svi.filter((d) => !vec.has(d.id));
    if (izbor.length < PO_RUNDI * 2) izbor = svi;
    const red = promesaj(izbor);
    const nasi = red.filter((d) => d.oblast === 'srbija');
    const uzeto = [];
    const dobaUzeta = new Set();
    const uzmi = (d) => { uzeto.push(d); dobaUzeta.add(doba(d.g)); };
    const kolikoNasih = opcije.srbija ? 2 : 1;
    for (const d of nasi) { if (uzeto.length >= kolikoNasih) break; if (!dobaUzeta.has(doba(d.g))) uzmi(d); }
    for (const d of red) { if (uzeto.length >= PO_RUNDI) break; if (!uzeto.includes(d) && !dobaUzeta.has(doba(d.g))) uzmi(d); }
    for (const d of red) { if (uzeto.length >= PO_RUNDI) break; if (!uzeto.includes(d)) uzmi(d); }
    return promesaj(uzeto).map(({ wiki, ...d }) => d);
  }

  // ───────── klizač: položaj 0–1000 ↔ godina (logaritamski po broju godina unazad) ─────────
  const L0 = Math.log(REF - DO), L1 = Math.log(REF - OD);
  function izKlizaca(p) {
    const g = Math.round(REF - Math.exp(L1 - (p / 1000) * (L1 - L0)));
    return ogranici(g);
  }
  function uKlizac(g) {
    return Math.round(((L1 - Math.log(REF - g)) / (L1 - L0)) * 1000);
  }
  // godina u opsegu, bez godine 0 (posle 1. p. n. e. dolazi 1. n. e.)
  function ogranici(g, smer = 1) {
    g = Math.max(OD, Math.min(DO, Math.round(g)));
    return g === 0 ? smer : g;
  }
  // pomeri godinu za d (±1, ±10, ±100), preskačući godinu 0
  function pomeri(g, d) {
    let n = g + d;
    if (g > 0 && n <= 0) n -= 1;
    else if (g < 0 && n >= 0) n += 1;
    return ogranici(n, Math.sign(d));
  }
  // koliko je godina između dve godine (nema godine 0)
  const razlika = (a, b) => Math.abs(a - b) - (a < 0 !== b < 0 ? 1 : 0);

  // ───────── bodovanje ─────────
  // tolerancija raste sa starošću događaja: ~3% od broja godina do danas, najmanje 3 godine
  const tolerancija = (g) => Math.max(3, (REF - 10 - g) * 0.03);
  function bodovi(g, pogodak) {
    const d = razlika(g, pogodak);
    const T = tolerancija(g);
    const udeo = Math.max(0, 1 - Math.log2(1 + d / T) / 3); // d = T → 2/3, d = 3T → 1/3, d = 7T → 0
    const poeni = Math.round((MAX * udeo) / 10) * 10;
    let bonus = 0, oznaka = '';
    if (d === 0) { bonus = TACNO; oznaka = 'Tačna godina!'; }
    else if (d <= T / 2) oznaka = 'Za dlaku!';
    else if (d <= T) oznaka = 'Blizu!';
    return { d, poeni, bonus, oznaka };
  }

  const godina = (g) => (g < 0 ? `${-g}. p. n. e.` : `${g}.`);
  const godinaBroj = (g) => (g < 0 ? `${-g}` : `${g}`); // za veliki prikaz (p. n. e. ide posebno)
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ───────── lenta na otkrivanju (samo klijent) ─────────
  // tacke: [{ g, boja, oznaka, veliko }] – zlatne su tačne godine, ostale izbori igrača
  const PODEOCI = [-3000, 1, 1000, 1500, 1800, 1900, 2000];
  const W = 1000, P = 40;
  const xLente = (g) => P + (uKlizac(g) / 1000) * (W - 2 * P);
  // položaj oznake na skali ispod klizača (procenat širine)
  const procenat = (g) => uKlizac(g) / 10;
  function lenta(dogadjaji, izbori = []) {
    const Y = 120;
    const x = xLente;
    let s = `<svg viewBox="0 0 ${W} 190" class="vp-lenta" xmlns="http://www.w3.org/2000/svg">`;
    s += `<line x1="${P}" y1="${Y}" x2="${W - P}" y2="${Y}" class="osa"/>`;
    for (const g of PODEOCI) {
      s += `<line x1="${x(g)}" y1="${Y - 8}" x2="${x(g)}" y2="${Y + 8}" class="crtica"/>`;
      s += `<text x="${g < 0 ? P - 10 : x(g)}" y="${Y + 46}" text-anchor="${g < 0 ? 'start' : 'middle'}" class="god-osa">${g === 1 ? '' : g < 0 ? `${-g}. p. n. e.` : g}</text>`; // nula bez natpisa – tu je natpis stare ere
    }
    for (const t of izbori) s += `<circle cx="${x(t.g).toFixed(1)}" cy="${Y}" r="12" style="fill:${esc(t.boja)}" class="vp-izbor"/>`;
    // brojevi tačnih godina; bliski se penju jedan iznad drugog
    const red = dogadjaji.map((d, i) => ({ i, xx: x(d.g) })).sort((a, b) => a.xx - b.xx);
    let pret = -1e9, nivo = 0;
    for (const o of red) { nivo = o.xx - pret < 56 ? nivo + 1 : 0; o.nivo = nivo; pret = o.xx; }
    for (const o of red) {
      const xx = o.xx.toFixed(1), yv = Y - 46 - o.nivo * 46;
      s += `<g class="vp-tacan" style="animation-delay:${0.3 + o.i * 0.35}s"><line x1="${xx}" y1="${Y}" x2="${xx}" y2="${yv}" class="stub"/><circle cx="${xx}" cy="${yv}" r="22"/><text x="${xx}" y="${yv + 10}" text-anchor="middle">${o.i + 1}</text></g>`;
    }
    return s + '</svg>';
  }

  return { OBLASTI, OD, DO, PO_RUNDI, MAX, TACNO, PODEOCI, procenat, parsiraj, doba, napravi, izKlizaca, uKlizac, pomeri, ogranici, razlika, tolerancija, bodovi, godina, godinaBroj, lenta };
});
