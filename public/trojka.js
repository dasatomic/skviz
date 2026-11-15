// Bonus igra „Trojka!“: šut za tri poena (pogled sa strane). Igrač bira silu kojom ruke guraju loptu (u njutnima) i
// ugao izbačaja – povuče vektor od lopte, pa ga dotera dugmićima. Sila deluje kratko (Δt), pa po impulsu
// F·Δt = m·v₀ daje lopti početnu brzinu; u letu deluje samo težina (bez otpora vazduha). Simulacija sa odbijanjem
// od obruča, table i poda pokaže da li je koš. Isti kôd koristi server (bodovanje, lib/soba.js) i telefon
// (animacija) – simulacija je deterministička, pa obe strane dobijaju isti ishod.
(function (koren, f) {
  const T = f();
  if (typeof module === 'object' && module.exports) module.exports = T;
  else koren.Trojka = T;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const TAU = Math.PI * 2;
  const RAD = Math.PI / 180;
  const M = 0.6;            // kg – lopta veličine 7
  const DT_UDARCA = 0.1;    // s – koliko dugo ruke guraju loptu
  const F_MAX = 100;        // N
  const R_LOPTE = 0.12;     // m (prečnik 24 cm)
  const H_OBRUCA = 3.05;    // m
  const R_OBRUCA = 0.225;   // unutrašnji poluprečnik (prečnik 45 cm)
  const R_ZICE = 0.009;     // debljina šipke obruča
  const OD_TABLE = 0.15;    // od table do unutrašnje ivice obruča
  const TABLA = [2.9, 3.95];
  const DT = 1 / 600;
  const KADAR = 10;          // svaki 10. korak = 60 kadrova u sekundi
  const MAKS_T = 9;
  const UGAO_MIN = 5, UGAO_MAX = 85;
  const PLANETE = {
    zemlja: { g: 9.81, naziv: 'Zemlja', ikona: '🌍' },
    mesec: { g: 1.62, naziv: 'Mesec', ikona: '🌕' },
    mars: { g: 3.71, naziv: 'Mars', ikona: '🔴' },
  };
  const MESTA = [
    { id: 'trojka', naziv: 'Linija za tri poena', d: 6.75 },
    { id: 'ugao', naziv: 'Trojka iz ugla', d: 6.6 },
    { id: 'nba', naziv: 'NBA linija za tri poena', d: 7.24 },
    { id: 'daleko', naziv: 'Daleko iza linije', d: 8.5 },
    { id: 'centar', naziv: 'Sa centra terena!', d: 12.4 },
  ];
  const zaokruzi = (x, k) => Math.round(x / k) * k;
  const sredi = (sila, ugao) => [+zaokruzi(Math.max(0.1, Math.min(F_MAX, +sila || 0)), 0.1).toFixed(1), +zaokruzi(Math.max(UGAO_MIN, Math.min(UGAO_MAX, +ugao || 45)), 0.5).toFixed(1)];

  // položaji (x = vodoravno od lopte u trenutku izbačaja, y = visina od poda)
  const geometrija = (sc) => {
    const xb = sc.d + R_OBRUCA + OD_TABLE; // lice table
    return { xb, prednji: sc.d - R_OBRUCA - R_ZICE, zadnji: sc.d + R_OBRUCA + R_ZICE };
  };

  // ───────── simulacija ─────────
  // sila u N, ugao u stepenima. Vraća { kos, cisto, dodiri, blizu (m), t, tKos, kadrovi }.
  function simuliraj(sc, sila, ugao, snimak = false) {
    [sila, ugao] = sredi(sila, ugao);
    const g = sc.g;
    const v0 = (sila * DT_UDARCA) / M;
    let x = 0, y = sc.h0, vx = v0 * Math.cos(ugao * RAD), vy = v0 * Math.sin(ugao * RAD);
    const { xb, prednji, zadnji } = geometrija(sc);
    const tacke = [[prednji, H_OBRUCA, 'obruc'], [zadnji, H_OBRUCA, 'obruc']];
    let kos = false, tKos = 0, pod = 0, tPod = 0, blizu = Infinity, dodirKos = 0;
    const dodiri = [];
    const kadrovi = snimak ? [] : null;
    let dodirSad = null;
    const odbij = (px, py, r, e, tr, vrsta, t) => {
      const dx = x - px, dy = y - py, d = Math.hypot(dx, dy);
      if (d >= R_LOPTE + r || d === 0) return;
      const nx = dx / d, ny = dy / d;
      x = px + nx * (R_LOPTE + r); y = py + ny * (R_LOPTE + r);
      const vn = vx * nx + vy * ny;
      if (vn >= 0) return;
      const tx = vx - vn * nx, ty = vy - vn * ny;
      vx = tx * tr - e * vn * nx; vy = ty * tr - e * vn * ny;
      if (-vn > 0.3) { dodiri.push({ vrsta, t: +t.toFixed(3) }); dodirSad = vrsta; }
    };
    for (let k = 0; ; k++) {
      const t = k * DT;
      if (snimak && k % KADAR === 0) { kadrovi.push([+x.toFixed(4), +y.toFixed(4), dodirSad]); dodirSad = null; }
      if (t >= MAKS_T || (kos && t > tKos + 1.1) || (pod && t > tPod + 0.9)) {
        return { kos, cisto: kos && !dodirKos, dodiri, blizu: +blizu.toFixed(3), t: +t.toFixed(3), tKos: +tKos.toFixed(3), kadrovi, sila, ugao };
      }
      const py0 = y;
      vy -= g * DT;
      x += vx * DT; y += vy * DT;
      for (const [px, pyy, v] of tacke) odbij(px, pyy, R_ZICE, 0.55, 0.85, v, t);
      // tabla (duž x = xb, od TABLA[0] do TABLA[1]) i njene ivice
      odbij(xb, Math.max(TABLA[0], Math.min(TABLA[1], y)), 0, 0.65, 0.9, 'tabla', t);
      if (y < R_LOPTE) {
        y = R_LOPTE;
        if (vy < 0) { vy = -0.72 * vy; vx *= 0.85; if (!pod) { pod = 1; tPod = t; } }
      }
      if (!pod) blizu = Math.min(blizu, Math.hypot(x - sc.d, y - H_OBRUCA));
      // koš: središte lopte pređe ravan obruča naniže, između šipki
      if (!kos && py0 > H_OBRUCA && y <= H_OBRUCA && x > prednji && x < zadnji) {
        kos = true; tKos = t; dodirKos = dodiri.length;
        vx *= 0.3; vy *= 0.55; // mrežica koči
      }
    }
  }

  // sila potrebna da lopta (središte) prođe kroz sredinu obruča pod datim uglom (null ako je nemoguće)
  function potrebnaSila(sc, ugao) {
    const a = ugao * RAD, dh = H_OBRUCA - sc.h0;
    const imen = 2 * Math.cos(a) ** 2 * (sc.d * Math.tan(a) - dh);
    if (imen <= 0) return null;
    const v0 = Math.sqrt((sc.g * sc.d * sc.d) / imen);
    return { v0, sila: (M * v0) / DT_UDARCA };
  }
  const optimalniUgao = (sc) => 45 + Math.atan((H_OBRUCA - sc.h0) / sc.d) / RAD / 2;

  // raspon sila koje daju koš za dati ugao (oko sile za sredinu obruča)
  function prozor(sc, ugao) {
    const p = potrebnaSila(sc, ugao);
    if (!p) return null;
    const s0 = zaokruzi(p.sila, 0.1);
    const ok = (s) => simuliraj(sc, s, ugao).kos;
    let od = null, do_ = null;
    for (let i = 0; i <= 60; i++) { const s = +(s0 - i * 0.1).toFixed(1); if (ok(s)) od = s; else if (od !== null) break; }
    for (let i = 0; i <= 60; i++) { const s = +(s0 + i * 0.1).toFixed(1); if (ok(s)) do_ = s; else if (do_ !== null) break; }
    if (od === null) od = do_;
    if (do_ === null) do_ = od;
    return od === null ? { ugao, sila: s0, od: null, do: null } : { ugao, sila: s0, od, do: do_ };
  }

  function najbolje(sc) {
    const ugao = zaokruzi(optimalniUgao(sc), 0.5);
    let sila = +zaokruzi(potrebnaSila(sc, ugao).sila, 0.1).toFixed(1);
    // malo doterivanje: najbolje je pogoditi sredinu „prozora“ (čist koš)
    const pz = prozor(sc, ugao);
    if (pz.od !== null) sila = +zaokruzi((pz.od + pz.do) / 2, 0.1).toFixed(1);
    const sim = simuliraj(sc, sila, ugao);
    const strmo = Math.min(UGAO_MAX, ugao + 15), plitko = Math.max(UGAO_MIN, ugao - 12);
    return {
      sila, ugao, v0: +((sila * DT_UDARCA) / M).toFixed(2), kos: sim.kos, cisto: sim.cisto, t: sim.t,
      prozori: [prozor(sc, plitko), pz, prozor(sc, strmo)].filter(Boolean),
    };
  }

  // ───────── scenario ─────────
  function napravi(rnd = Math.random) {
    const r = rnd();
    const planeta = r < 0.7 ? 'zemlja' : r < 0.85 ? 'mesec' : 'mars';
    const r2 = rnd();
    const mesto = MESTA[r2 < 0.3 ? 0 : r2 < 0.5 ? 1 : r2 < 0.72 ? 2 : r2 < 0.92 ? 3 : 4];
    const d = mesto.id === 'daleko' ? +(8 + Math.floor(rnd() * 6) * 0.25).toFixed(2) : mesto.d;
    const h0 = +(2 + Math.floor(rnd() * 11) * 0.05).toFixed(2);
    const sc = { mesto: mesto.id, naziv: mesto.naziv, d, h0, planeta, g: PLANETE[planeta].g, m: M, dt: DT_UDARCA, fMax: F_MAX };
    sc.najbolje = najbolje(sc);
    return sc;
  }

  // ───────── bodovanje ─────────
  // koš 500, čist koš +200, „kao iz udžbenika“ (blizu optimalnog šuta) +100; promašaj do 200 po blizini obruču
  function bodovi(sc, sila, ugao) {
    const s = simuliraj(sc, sila, ugao);
    const nb = sc.najbolje;
    let poeni = 0, bonus = 0;
    const oznake = [];
    if (s.kos) {
      poeni = 500;
      if (s.cisto) { bonus += 200; oznake.push('Čisto!'); }
      else if (s.dodiri.some((x) => x.vrsta === 'tabla')) oznake.push('Od table');
    } else poeni = Math.round(Math.max(0, 200 * (1 - s.blizu / 1.2)) / 10) * 10;
    if (s.kos && Math.abs(s.sila - nb.sila) <= 0.5 && Math.abs(s.ugao - nb.ugao) <= 1.5) { bonus += 100; oznake.push('Kao iz udžbenika!'); }
    return { kos: s.kos, cisto: s.cisto, blizu: s.blizu, t: s.t, poeni, bonus, oznaka: oznake.join(' · ') };
  }

  // ───────── tekstovi (latinica; $…$ = matematika, ne preslovljava se) ─────────
  const broj = (x, d = 2) => String(+(+x).toFixed(d)).replace('.', ',');
  const n1 = (x) => (+x).toFixed(1).replace('.', ',');
  function opis(sc) {
    const P = PLANETE[sc.planeta];
    return {
      mesto: `${sc.naziv} · d = ${broj(sc.d)} m`,
      planeta: `${P.ikona} ${P.naziv} · g = ${broj(sc.g)} m/s²`,
      lopta: `🏀 m = ${broj(M)} kg · ruke guraju ${broj(DT_UDARCA)} s`,
      visina: `h₀ = ${broj(sc.h0)} m → obruč ${broj(H_OBRUCA)} m`,
    };
  }

  // objašnjenje posle runde: niz pasusa { naslov, tekst } (tekst sa $…$)
  function objasni(sc, moj) {
    const nb = sc.najbolje, P = PLANETE[sc.planeta];
    const dh = H_OBRUCA - sc.h0, fg = M * sc.g;
    const a = optimalniUgao(sc);
    const v = (s) => broj((s * DT_UDARCA) / M);
    const deo = [];
    deo.push({ naslov: '🧲 Sile na loptu', tekst:
      `Dok je ruke guraju ($Δt = ${broj(DT_UDARCA)} s$), na loptu deluje tvoja sila $\\vec{F}$ (težinu za to kratko vreme zanemarujemo). ` +
      `Kad poleti, deluje samo težina, uvek naniže: $F_{g} = m·g = ${broj(M)} kg · ${broj(sc.g)} m/s^{2} = ${broj(fg)} N$` +
      `${sc.planeta !== 'zemlja' ? ` (${P.naziv === 'Mesec' ? 'na Mesecu' : 'na Marsu'} je lopta lakša nego na Zemlji, gde bi bila ${broj(M * 9.81)} N)` : ''}. Otpor vazduha zanemarujemo.` });
    deo.push({ naslov: '💥 Od sile do brzine (impuls)', tekst:
      `Sila koja deluje kratko daje lopti brzinu: $F·Δt = m·v_{0}$, pa je $v_{0} = {F·Δt|m}$. Na primer $${n1(nb.sila)} N · ${broj(DT_UDARCA)} s ÷ ${broj(M)} kg = ${v(nb.sila)} m/s$.` });
    deo.push({ naslov: '📈 Putanja – parabola', tekst:
      `Vodoravno lopta ide stalnom brzinom $v_{x} = v_{0}·cos α$ (vodoravno nema sile), a uspravno je težina usporava pa ubrzava naniže: ` +
      `$x = v_{0}·cos α·t$, $y = h_{0} + v_{0}·sin α·t − {g·t^{2}|2}$.` });
    deo.push({ naslov: '🎯 Uslov za koš', tekst:
      `Lopta treba da prođe kroz sredinu obruča: $x = d = ${broj(sc.d)} m$, a visinu savlada za $Δh = ${broj(H_OBRUCA)} − ${broj(sc.h0)} = ${broj(dh)} m$. ` +
      `Iz jednačina putanje: $v_{0}^{2} = {g·d^{2}|2·cos^{2}α·(d·tg α − Δh)}$.` });
    const pz = nb.prozori.find((p) => p.ugao === nb.ugao);
    deo.push({ naslov: `⭐ Optimalan šut: ${n1(nb.ugao)}° i ${n1(nb.sila)} N`, tekst:
      `Najmanja brzina (i sila) potrebna je pri uglu $α = 45° + {1|2}·arctg {Δh|d} = ${n1(a)}°$. Tada je $v_{0} = √{g·(Δh + √{d^{2} + Δh^{2}})} = ${broj(potrebnaSila(sc, a).v0)} m/s$, ` +
      `a sila $F = {m·v_{0}|Δt} ≈ ${n1(potrebnaSila(sc, a).sila)} N$.` +
      (pz?.od != null ? ` Pod tim uglom koš prolaze sile od ${n1(pz.od)} do ${n1(pz.do)} N.` : '') });
    const ostali = nb.prozori.filter((p) => p.ugao !== nb.ugao && p.od != null);
    if (ostali.length && pz?.od != null) {
      deo.push({ naslov: '🤔 Najmanja sila ili strmiji šut?', tekst:
        `Lopta (24 cm) prolazi kroz obruč (45 cm) samo ako pada dovoljno strmo – bar oko 32°, jer je $sin β = {24|45}$; što strmije pada, „vidi“ veći otvor obruča. ` +
        `Zato prozor sila za koš raste sa uglom: ` +
        [pz, ...ostali].sort((x, y) => x.ugao - y.ugao).map((p) => `${n1(p.ugao)}° → ${n1(p.sila)} N (širina ${n1(p.do - p.od + 0.1)} N)`).join(', ') +
        `. Ali strm šut traži jaču silu i duži let, pa je svaka greška u pravcu veća. Košarkaši zato šutiraju malo strmije od ugla najmanje sile – oko 45–55°.` });
    }
    if (moj) {
      const p = potrebnaSila(sc, moj.ugao);
      deo.push({ naslov: '🏀 Tvoj šut', tekst:
        `$F = ${n1(moj.sila)} N$, $α = ${n1(moj.ugao)}°$ → $v_{0} = ${v(moj.sila)} m/s$. ` +
        (p ? `Za taj ugao trebalo je oko ${n1(p.sila)} N${Math.abs(p.sila - moj.sila) < 0.3 ? ' – pogođeno!' : moj.sila > p.sila ? ` – bio si jači za ${n1(moj.sila - p.sila)} N.` : ` – nedostajalo je ${n1(p.sila - moj.sila)} N.`}`
          : 'Pod tim uglom lopta ne može da stigne do obruča – ugao je preplitak.') });
    }
    return deo;
  }

  // ───────── prikaz (samo u pregledaču) ─────────
  function seme(s) { return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  function pilula(g, tekst, x, y, pozadina, boja, vel, poravnaj = 'center') {
    g.font = `600 ${vel}px system-ui, sans-serif`;
    const w = g.measureText(tekst).width + vel * 0.9, h = vel * 1.55;
    const x0 = poravnaj === 'left' ? x : poravnaj === 'right' ? x - w : x - w / 2;
    g.fillStyle = pozadina;
    g.beginPath(); g.roundRect ? g.roundRect(x0, y - h / 2, w, h, h / 2) : g.rect(x0, y - h / 2, w, h); g.fill();
    g.fillStyle = boja; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(tekst, x0 + w / 2, y + vel * 0.05);
  }

  function strelica(g, x, y, dx, dy, boja, debljina, glava = 12) {
    const d = Math.hypot(dx, dy);
    if (d < 2) return;
    const ux = dx / d, uy = dy / d;
    glava = Math.min(glava, d * 0.5);
    g.strokeStyle = boja; g.fillStyle = boja; g.lineWidth = debljina; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx - ux * glava * 0.7, y + dy - uy * glava * 0.7); g.stroke();
    g.beginPath(); g.moveTo(x + dx, y + dy);
    g.lineTo(x + dx - ux * glava - uy * glava * 0.55, y + dy - uy * glava + ux * glava * 0.55);
    g.lineTo(x + dx - ux * glava + uy * glava * 0.55, y + dy - uy * glava - ux * glava * 0.55);
    g.closePath(); g.fill();
  }

  // lopta: narandžasta sa šavovima, rot = ugao rotacije
  function crtajLoptu(g, x, y, r, rot, boja) {
    g.save(); g.translate(x, y);
    if (boja) { g.shadowColor = boja; g.shadowBlur = r * 1.6; }
    const gr = g.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
    gr.addColorStop(0, '#ffb066'); gr.addColorStop(0.7, '#e8701f'); gr.addColorStop(1, '#a8440c');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill();
    g.shadowBlur = 0;
    g.rotate(rot);
    g.strokeStyle = 'rgba(40,15,0,.85)'; g.lineWidth = Math.max(0.8, r * 0.09);
    g.beginPath(); g.moveTo(-r, 0); g.lineTo(r, 0); g.stroke();
    g.beginPath(); g.moveTo(0, -r); g.lineTo(0, r); g.stroke();
    g.beginPath(); g.arc(-r * 1.25, 0, r * 0.95, -0.85, 0.85); g.stroke();
    g.beginPath(); g.arc(r * 1.25, 0, r * 0.95, Math.PI - 0.85, Math.PI + 0.85); g.stroke();
    g.restore();
  }

  // op: { boja, avatar, avatarIgraca }
  function scena(el, sc, op = {}) {
    const cv = document.createElement('canvas');
    cv.className = 'trojka-platno';
    el.appendChild(cv);
    const g = cv.getContext('2d');
    const poz = document.createElement('canvas');
    let W = 0, H = 0, dpr = 1;
    let kam = null;
    let unisten = false, raf = 0, prosli = performance.now(), vreme = 0;
    let nisan = null;          // { sila, ugao } – trenutni izbor (prikazuje se strelica)
    let naPromenu = null;      // fn(sila, ugao) dok igrač vuče
    let vuce = false, zakljucano = false;
    let let_ = null;           // { lista, t0, T, kraj, resi }
    let zlatna = null, sile = false;
    let natpis = null;         // { tekst, boja, t }
    let mreza = 0;             // njihanje mrežice
    const { xb } = geometrija(sc);
    const tamno = sc.planeta === 'mesec';

    const sxy = (x, y) => [(x - kam.x) * kam.s + W / 2, H / 2 - (y - kam.y) * kam.s];
    const RMAX = () => Math.min(W, H) * 0.36;

    function okvir(x0, y0, x1, y1) {
      const s = Math.min(W / (x1 - x0), H / (y1 - y0));
      return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, s };
    }
    const okvirPocetni = () => okvir(-1.3, -0.55, sc.d + 1.15, Math.max(5.2, sc.h0 + 2.6));

    // ── pozadina po planeti (statična, crta se jednom po veličini) ──
    function crtajPozadinu() {
      poz.width = Math.round(W * dpr); poz.height = Math.round(H * dpr);
      const t = poz.getContext('2d');
      t.setTransform(dpr, 0, 0, dpr, 0, 0);
      const r = seme(11);
      const pod = sxy(0, 0)[1];
      if (sc.planeta === 'zemlja') {
        const gr = t.createLinearGradient(0, 0, 0, pod);
        gr.addColorStop(0, '#0b1424'); gr.addColorStop(1, '#1d3150');
        t.fillStyle = gr; t.fillRect(0, 0, W, pod);
        // reflektori
        for (let i = 0; i < 4; i++) {
          const x = W * (0.15 + i * 0.24), rg = t.createRadialGradient(x, 0, 0, x, 0, H * 0.7);
          rg.addColorStop(0, 'rgba(255,240,200,.16)'); rg.addColorStop(1, 'rgba(255,240,200,0)');
          t.fillStyle = rg; t.fillRect(0, 0, W, pod);
        }
        // publika na tribinama
        const top = pod - Math.min(H * 0.2, kam.s * 1.5);
        t.fillStyle = 'rgba(6,10,20,.85)'; t.fillRect(0, top, W, pod - top);
        const boje = ['#ff7675', '#74b9ff', '#ffeaa7', '#55efc4', '#fd79a8', '#dfe6e9', '#a29bfe', '#fab1a0'];
        const vel = Math.max(1.6, kam.s * 0.06);
        for (let red = 0; red < 5; red++) {
          const y = top + (red + 0.6) * ((pod - top) / 5.4);
          for (let x = (red % 2) * vel * 1.2; x < W; x += vel * 2.5 + r() * vel) {
            t.globalAlpha = 0.14 + red * 0.05;
            t.fillStyle = boje[Math.floor(r() * boje.length)];
            t.beginPath(); t.arc(x, y - r() * vel * 0.5, vel, 0, TAU); t.fill();
          }
        }
        t.globalAlpha = 1;
        t.fillStyle = '#7d2a22'; t.fillRect(0, pod - Math.max(3, kam.s * 0.12), W, Math.max(3, kam.s * 0.12));
      } else if (sc.planeta === 'mesec') {
        t.fillStyle = '#04050b'; t.fillRect(0, 0, W, pod);
        for (let i = 0; i < 160; i++) { t.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.7})`; t.fillRect(r() * W, r() * pod, r() < 0.1 ? 2 : 1, r() < 0.1 ? 2 : 1); }
        // Zemlja na nebu
        const zx = W * 0.2, zy = H * 0.16, zr = Math.min(W, H) * 0.07;
        const zg = t.createRadialGradient(zx - zr * 0.3, zy - zr * 0.3, zr * 0.1, zx, zy, zr);
        zg.addColorStop(0, '#9fd3ff'); zg.addColorStop(0.6, '#2f7bd6'); zg.addColorStop(1, '#123a6e');
        t.fillStyle = zg; t.beginPath(); t.arc(zx, zy, zr, 0, TAU); t.fill();
        t.fillStyle = 'rgba(80,170,90,.8)';
        t.beginPath(); t.ellipse(zx - zr * 0.2, zy + zr * 0.1, zr * 0.35, zr * 0.22, 0.6, 0, TAU); t.fill();
        t.fillStyle = 'rgba(255,255,255,.7)';
        t.beginPath(); t.ellipse(zx + zr * 0.3, zy - zr * 0.4, zr * 0.3, zr * 0.1, -0.3, 0, TAU); t.fill();
        // daleka brda
        t.fillStyle = '#3a3c44'; t.beginPath(); t.moveTo(0, pod);
        for (let x = 0; x <= W; x += W / 12) t.lineTo(x, pod - kam.s * (0.5 + r() * 0.9));
        t.lineTo(W, pod); t.fill();
      } else {
        const gr = t.createLinearGradient(0, 0, 0, pod);
        gr.addColorStop(0, '#d9a07a'); gr.addColorStop(1, '#f0c9a3');
        t.fillStyle = gr; t.fillRect(0, 0, W, pod);
        t.fillStyle = 'rgba(255,245,230,.7)'; t.beginPath(); t.arc(W * 0.82, H * 0.14, Math.min(W, H) * 0.035, 0, TAU); t.fill();
        t.fillStyle = '#a65a35'; t.beginPath(); t.moveTo(0, pod);
        for (let x = 0; x <= W; x += W / 9) t.lineTo(x, pod - kam.s * (0.4 + r() * 1.3));
        t.lineTo(W, pod); t.fill();
      }
      // pod
      const dno = H;
      if (sc.planeta === 'zemlja') {
        const gr = t.createLinearGradient(0, pod, 0, dno);
        gr.addColorStop(0, '#d9a465'); gr.addColorStop(1, '#8a5a2b');
        t.fillStyle = gr; t.fillRect(0, pod, W, dno - pod);
        const daska = Math.max(10, kam.s * 0.9);
        t.strokeStyle = 'rgba(90,50,20,.35)'; t.lineWidth = 1;
        for (let red = 0, y = pod; y < dno; red++, y += Math.max(5, (dno - pod) / 4)) {
          t.beginPath(); t.moveTo(0, y); t.lineTo(W, y); t.stroke();
          for (let x = (red % 2) * daska * 0.5; x < W; x += daska) { t.beginPath(); t.moveTo(x, y); t.lineTo(x, y + (dno - pod) / 4); t.stroke(); }
        }
        t.fillStyle = 'rgba(255,255,255,.25)'; t.fillRect(0, pod, W, 1.5);
        // linija za tri poena (ispod šutera)
        const [lx] = sxy(-0.25, 0);
        t.fillStyle = '#fff'; t.fillRect(lx - 2, pod, 4, dno - pod);
      } else {
        t.fillStyle = sc.planeta === 'mesec' ? '#8d8f96' : '#b5653c'; t.fillRect(0, pod, W, dno - pod);
        for (let i = 0; i < 18; i++) {
          const x = r() * W, y = pod + 4 + r() * (dno - pod - 6), w = 6 + r() * 20;
          t.fillStyle = sc.planeta === 'mesec' ? 'rgba(40,40,48,.35)' : 'rgba(90,40,20,.35)';
          t.beginPath(); t.ellipse(x, y, w, w * 0.25, 0, 0, TAU); t.fill();
        }
        t.fillStyle = 'rgba(255,255,255,.25)'; t.fillRect(0, pod, W, 1.5);
      }
    }

    function velicina() {
      const w = el.clientWidth || 320;
      const tv = document.body.classList.contains('ekran');
      const h = Math.round(Math.min(w * (tv ? 0.5 : 0.78), innerHeight * (tv ? 0.55 : 0.55)));
      if (w === W && h === H) return;
      W = w; H = h; dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.height = H + 'px';
      const k = okvirPocetni();
      kam = let_ ? { ...kam, s: Math.min(kam.s, k.s) } : k;
      crtajPozadinu();
    }

    // ── nišanjenje: vektor od lopte ──
    const tackaDogadjaja = (e) => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    function izDogadjaja(e) {
      const [px, py] = tackaDogadjaja(e);
      const [hx, hy] = sxy(0, sc.h0);
      const dx = px - hx, dy = hy - py;
      const d = Math.min(RMAX(), Math.hypot(dx, dy));
      const ugao = Math.atan2(dy, dx) / RAD;
      nisan = { sila: (d / RMAX()) * F_MAX, ugao };
      [nisan.sila, nisan.ugao] = sredi(zaokruzi(nisan.sila, 0.5), ugao);
      naPromenu?.(nisan.sila, nisan.ugao);
    }
    cv.addEventListener('pointerdown', (e) => {
      if (!naPromenu || zakljucano || let_) return;
      cv.setPointerCapture?.(e.pointerId);
      vuce = true; izDogadjaja(e); e.preventDefault();
    });
    cv.addEventListener('pointermove', (e) => { if (vuce && !zakljucano) { izDogadjaja(e); e.preventDefault(); } });
    const kraj = () => { vuce = false; };
    cv.addEventListener('pointerup', kraj);
    cv.addEventListener('pointercancel', kraj);

    // ── crtanje sveta (kamera k) ──
    function obruc(k, prednji) {
      const [cx, cy] = sxy(sc.d, H_OBRUCA);
      const rx = (R_OBRUCA + R_ZICE) * kam.s, ry = Math.max(2, rx * 0.22);
      g.strokeStyle = '#ff6a1a'; g.lineWidth = Math.max(2, R_ZICE * 2.4 * kam.s);
      g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, prednji ? 0 : Math.PI, prednji ? Math.PI : TAU); g.stroke();
      if (!prednji) {
        // nosač do table
        const [bx] = sxy(xb, 0);
        g.lineWidth = Math.max(2, kam.s * 0.03); g.strokeStyle = '#c94f10';
        g.beginPath(); g.moveTo(cx + rx, cy); g.lineTo(bx, cy); g.stroke();
      }
    }
    function mrezica() {
      const [cx, cy] = sxy(sc.d, H_OBRUCA);
      const rx = R_OBRUCA * kam.s, h = 0.42 * kam.s, rd = rx * 0.6;
      const nj = Math.sin(vreme * 18) * mreza * rx * 0.25;
      const izboc = mreza * rx * 0.35;
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = Math.max(1, kam.s * 0.012);
      const n = 6;
      for (let i = 0; i <= n; i++) {
        const u = i / n;
        const x0 = cx - rx + 2 * rx * u, x1 = cx - rd + 2 * rd * u + nj;
        g.beginPath(); g.moveTo(x0, cy);
        g.quadraticCurveTo((x0 + x1) / 2 + (u - 0.5) * izboc, cy + h * 0.55, x1, cy + h); g.stroke();
      }
      for (let j = 1; j <= 3; j++) {
        const v = j / 3.2, w = rx + (rd - rx) * v;
        g.beginPath(); g.moveTo(cx - w - izboc * 0.5 + nj * v, cy + h * v); g.lineTo(cx + w + izboc * 0.5 + nj * v, cy + h * v); g.stroke();
      }
    }
    function tabla() {
      const [x0, y0] = sxy(xb, TABLA[1]);
      const [, y1] = sxy(xb, TABLA[0]);
      const w = Math.max(4, 0.06 * kam.s);
      // stub i ruka
      const [sx, sy] = sxy(xb + 1.1, 0);
      const [, gy] = sxy(0, 3.5);
      g.fillStyle = '#2d3640'; g.fillRect(sx - kam.s * 0.08, gy, kam.s * 0.16, sy - gy);
      g.strokeStyle = '#2d3640'; g.lineWidth = kam.s * 0.08;
      g.beginPath(); g.moveTo(sx, gy + kam.s * 0.05); g.lineTo(x0 + w, (y0 + y1) / 2); g.stroke();
      g.fillStyle = '#e8f0f7'; g.fillRect(x0, y0, w, y1 - y0);
      g.fillStyle = '#d63031'; g.fillRect(x0, sxy(0, 3.05 + 0.45)[1], w * 0.5, 0.45 * kam.s);
    }
    function sutera(k) {
      // šuter: noge, telo u boji igrača, ruke ka lopti, glava sa avatarom
      const boja = op.boja || '#74b9ff';
      const s = kam.s;
      const ruke = sxy(0, sc.h0);
      const glavaY = sc.h0 - 0.42, rame = sc.h0 - 0.62, kuk = sc.h0 - 1.25;
      const stopala = Math.max(0, sc.h0 - 2.05);
      const [gx, gyy] = sxy(-0.3, glavaY), [rx, ry] = sxy(-0.3, rame), [kx, ky] = sxy(-0.32, kuk), [, sy] = sxy(0, stopala);
      g.lineCap = 'round';
      g.strokeStyle = '#1f2a36'; g.lineWidth = s * 0.13;
      g.beginPath(); g.moveTo(kx, ky); g.lineTo(kx - s * 0.08, sy - s * 0.05); g.moveTo(kx, ky); g.lineTo(kx + s * 0.12, sy - s * 0.08); g.stroke();
      g.strokeStyle = boja; g.lineWidth = s * 0.3;
      g.beginPath(); g.moveTo(rx, ry); g.lineTo(kx, ky); g.stroke();
      g.strokeStyle = '#e0ac69'; g.lineWidth = s * 0.08;
      if (!let_ || let_.T < 0.12) { g.beginPath(); g.moveTo(rx, ry); g.lineTo(ruke[0] - s * 0.05, ruke[1] + s * 0.06); g.stroke(); }
      else { const [px, py] = sxy(0.15, sc.h0 + 0.12); g.beginPath(); g.moveTo(rx, ry); g.lineTo(px, py); g.stroke(); }
      const r = s * 0.2;
      g.fillStyle = '#1d2b3a'; g.strokeStyle = boja; g.lineWidth = Math.max(2, s * 0.03);
      g.beginPath(); g.arc(gx, gyy, r, 0, TAU); g.fill(); g.stroke();
      g.font = `${Math.round(r * 1.3)}px system-ui, 'Noto Color Emoji', sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(op.avatar || '🙂', gx, gyy + r * 0.08);
      if (sc.planeta !== 'zemlja') { // kaciga
        g.strokeStyle = 'rgba(200,230,255,.8)'; g.lineWidth = Math.max(1.5, s * 0.02);
        g.beginPath(); g.arc(gx, gyy, r * 1.35, 0, TAU); g.stroke();
        g.fillStyle = 'rgba(200,230,255,.12)'; g.fill();
      }
    }

    function putanja(pts, boja, a, w, crtice) {
      if (pts.length < 2) return;
      g.globalAlpha = a; g.strokeStyle = boja; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round';
      if (crtice) g.setLineDash(crtice);
      g.beginPath();
      pts.forEach(([x, y], i) => { const [sx, sy] = sxy(x, y); i ? g.lineTo(sx, sy) : g.moveTo(sx, sy); });
      g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
    }

    function kotiranje() {
      const v = Math.max(10, Math.min(15, kam.s * 0.3));
      const boja = tamno || sc.planeta === 'zemlja' ? 'rgba(255,255,255,.75)' : 'rgba(60,20,0,.75)';
      g.strokeStyle = boja; g.lineWidth = 1.5; g.setLineDash([4, 4]);
      const [x0, y0] = sxy(0, -0.25), [x1] = sxy(sc.d, -0.25);
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y0); g.stroke();
      const [, yv] = sxy(0, sc.h0), [hx, hy0] = sxy(-0.95, 0);
      g.beginPath(); g.moveTo(hx, hy0); g.lineTo(hx, yv); g.stroke();
      const [ox, oy] = sxy(sc.d, H_OBRUCA), [, op0] = sxy(0, 0);
      g.beginPath(); g.moveTo(ox, oy); g.lineTo(ox, op0); g.stroke();
      g.setLineDash([]);
      pilula(g, `d = ${broj(sc.d)} m`, (x0 + x1) / 2, y0, 'rgba(0,0,0,.65)', '#fff', v);
      pilula(g, `h₀ = ${broj(sc.h0)} m`, Math.max(4, hx - 20), (hy0 + yv) / 2, 'rgba(0,0,0,.65)', '#fff', v, 'left');
      pilula(g, `${broj(H_OBRUCA)} m`, ox, (oy + op0) / 2, 'rgba(0,0,0,.65)', '#fff', v);
    }

    function nisanCrtez() {
      const [hx, hy] = sxy(0, sc.h0);
      const m = RMAX(), v = Math.max(10, Math.min(14, m * 0.09));
      g.lineWidth = 1;
      for (let k = 1; k <= 4; k++) {
        g.strokeStyle = `rgba(255,255,255,${k === 4 ? 0.4 : 0.16})`;
        g.setLineDash(k === 4 ? [5, 5] : []);
        g.beginPath(); g.arc(hx, hy, (m * k) / 4, -Math.PI / 2, 0); g.stroke();
      }
      g.setLineDash([]);
      g.font = `600 ${v}px system-ui, sans-serif`; g.fillStyle = 'rgba(255,255,255,.7)'; g.textAlign = 'center'; g.textBaseline = 'top';
      for (const k of [2, 4]) g.fillText(`${(F_MAX * k) / 4} N`, hx + (m * k) / 4, hy + 4);
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.setLineDash([3, 5]);
      g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + m * 1.05, hy); g.stroke(); g.setLineDash([]);
      if (!nisan) {
        const p = (vreme % 1.4) / 1.4;
        g.strokeStyle = `rgba(255,209,102,${0.8 * (1 - p)})`; g.lineWidth = 3;
        g.beginPath(); g.arc(hx, hy, 10 + p * m * 0.4, 0, TAU); g.stroke();
        return;
      }
      const d = (nisan.sila / F_MAX) * m, u = nisan.ugao * RAD;
      const dx = Math.cos(u) * d, dy = -Math.sin(u) * d;
      g.setLineDash([2, 8]); g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(hx + dx, hy + dy); g.lineTo(hx + Math.cos(u) * m * 1.3, hy - Math.sin(u) * m * 1.3); g.stroke(); g.setLineDash([]);
      g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 6;
      strelica(g, hx, hy, dx, dy, op.boja || '#ffd166', 6, 20);
      g.shadowBlur = 0;
      // luk ugla
      const ra = Math.min(m * 0.3, Math.max(26, d * 0.4));
      g.strokeStyle = '#ffd166'; g.lineWidth = 2;
      g.beginPath(); g.arc(hx, hy, ra, -u, 0); g.stroke();
      g.font = `700 ${v}px system-ui, sans-serif`; g.fillStyle = '#ffd166'; g.textAlign = 'left'; g.textBaseline = 'middle';
      g.fillText(`α = ${n1(nisan.ugao)}°`, hx + ra * Math.cos(u / 2) + 6, hy - ra * Math.sin(u / 2) - 2);
      pilula(g, `F = ${n1(nisan.sila)} N`, hx + dx + Math.cos(u) * 34, hy + dy - Math.sin(u) * 20, 'rgba(0,0,0,.72)', '#fff', v + 1);
    }

    // sile na putanji idealnog šuta: F na početku, pa težina (crveno) i brzina (zeleno) u nekoliko tačaka
    function dijagramSila() {
      if (!zlatna) return;
      const k = zlatna.kadrovi, nb = zlatna.nb; // scena je možda napravljena pre otkrivanja (sc bez najboljeg)
      const kraj = Math.max(2, Math.min(k.length - 1, Math.round((zlatna.tKos || zlatna.t) * 60)));
      const v = Math.max(10, Math.min(13, kam.s * 0.28));
      const [hx, hy] = sxy(0, sc.h0);
      const lf = (nb.sila / F_MAX) * RMAX(), u = nb.ugao * RAD;
      strelica(g, hx, hy, Math.cos(u) * lf, -Math.sin(u) * lf, '#ffd166', 4, 14);
      pilula(g, `F = ${n1(nb.sila)} N`, hx + Math.cos(u) * lf, hy - Math.sin(u) * lf - 16, 'rgba(255,209,102,.95)', '#3a2a00', v);
      const lg = Math.max(26, kam.s * 0.9);
      const v0 = (nb.sila * DT_UDARCA) / M;
      const lv = lg * 1.6 / v0; // px po m/s
      for (const f of [0.22, 0.5, 0.8]) {
        const i = Math.round(kraj * f), j = Math.min(k.length - 1, i + 1);
        const [px, py] = sxy(k[i][0], k[i][1]);
        const vx = (k[j][0] - k[i][0]) * 60, vy = (k[j][1] - k[i][1]) * 60;
        g.setLineDash([3, 3]); g.strokeStyle = 'rgba(85,239,196,.6)'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(px, py); g.lineTo(px + vx * lv, py); g.lineTo(px + vx * lv, py - vy * lv); g.stroke(); g.setLineDash([]);
        strelica(g, px, py, vx * lv, -vy * lv, '#55efc4', 3, 10);
        strelica(g, px, py, 0, lg, '#ff7675', 3.5, 10);
        g.font = `700 ${v}px system-ui, sans-serif`; g.textAlign = 'left'; g.textBaseline = 'middle';
        g.fillStyle = '#ff7675'; g.fillText('Fg', px + 5, py + lg * 0.75);
        g.fillStyle = '#55efc4'; g.fillText('v', px + vx * lv + 5, py - vy * lv);
      }
      pilula(g, `Fg = m·g = ${broj(M * sc.g)} N ↓`, W - 10, H - 18, 'rgba(255,118,117,.92)', '#fff', v, 'right');
    }

    function crtaj(dt) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.drawImage(poz, 0, 0, W, H);
      const pre = !let_;
      tabla();
      obruc(kam, false);
      if (zlatna) putanja(zlatna.kadrovi.map((q) => [q[0], q[1]]), '#ffd166', 0.95, 3, [7, 6]);
      if (let_) for (const e of let_.lista) putanja(e.put, e.boja, e.glavna ? 0.9 : 0.6, e.glavna ? 3 : 2);
      sutera();
      if (pre && !zlatna) kotiranje();
      // lopte
      const rl = Math.max(4.5, R_LOPTE * kam.s);
      if (let_) {
        for (const e of let_.lista) {
          const [x, y] = sxy(e.p[0], e.p[1]);
          // senka na podu
          const [, py] = sxy(0, 0);
          const vis = Math.max(0, e.p[1]);
          g.fillStyle = `rgba(0,0,0,${Math.max(0.05, 0.35 - vis * 0.05)})`;
          g.beginPath(); g.ellipse(x, py + 2, rl * (1.2 + vis * 0.1), rl * 0.3, 0, 0, TAU); g.fill();
          crtajLoptu(g, x, y, rl, e.rot, e.glavna ? null : e.boja);
          if (!e.glavna) { g.strokeStyle = e.boja; g.lineWidth = 2; g.beginPath(); g.arc(x, y, rl + 2, 0, TAU); g.stroke(); }
        }
      } else {
        const [x, y] = sxy(0, sc.h0);
        crtajLoptu(g, x, y, rl, 0, null);
      }
      mrezica();
      obruc(kam, true);
      if (pre && naPromenu) nisanCrtez();
      if (sile) dijagramSila();
      // natpis (KOŠ! / promašaj)
      if (natpis) {
        const p = (vreme - natpis.t);
        if (p > 2.2) natpis = null;
        else {
          const sk = Math.min(1, p * 5) * (1 + Math.max(0, 0.25 - p) * 2);
          const vel = Math.max(26, Math.min(64, W * 0.11)) * sk;
          g.save(); g.globalAlpha = Math.min(1, (2.2 - p) * 2);
          g.font = `900 ${vel}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
          g.lineWidth = vel * 0.12; g.strokeStyle = 'rgba(0,0,0,.6)'; g.strokeText(natpis.tekst, W / 2, H * 0.28);
          g.fillStyle = natpis.boja; g.fillText(natpis.tekst, W / 2, H * 0.28);
          g.restore();
        }
      }
      // lupa: obruč izbliza kad mu lopta priđe
      const glavna = let_?.lista.find((e) => e.glavna);
      if (glavna && Math.hypot(glavna.p[0] - sc.d, glavna.p[1] - H_OBRUCA) < 1.4 && kam.s * R_OBRUCA < 40) lupa(glavna);
      if (mreza > 0) mreza = Math.max(0, mreza - dt * 0.9);
    }

    function lupa(glavna) {
      const r = Math.min(W, H) * 0.24, cx = r + 10, cy = r + 10;
      const stara = kam;
      g.save();
      g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.clip();
      g.fillStyle = tamno ? '#06070d' : sc.planeta === 'mars' ? '#e2b08c' : '#14233a'; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      kam = { x: sc.d + 0.12, y: H_OBRUCA - 0.05, s: r / 0.62 };
      // pomeri centar kamere u centar lupe
      const sW = W, sH = H; W = cx * 2; H = cy * 2;
      tabla(); obruc(kam, false);
      for (const e of let_.lista) putanja(e.put.slice(-40), e.boja, 0.6, 2);
      for (const e of let_.lista) { const [x, y] = sxy(e.p[0], e.p[1]); if (Math.abs(x - cx) < r * 1.2 && Math.abs(y - cy) < r * 1.2) crtajLoptu(g, x, y, R_LOPTE * kam.s, e.rot, e.glavna ? null : e.boja); }
      mrezica(); obruc(kam, true);
      W = sW; H = sH; kam = stara;
      g.restore();
      g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 3;
      g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke();
      g.font = `700 ${Math.max(10, r * 0.13)}px system-ui, sans-serif`; g.fillStyle = 'rgba(255,255,255,.8)'; g.textAlign = 'center'; g.textBaseline = 'top';
      g.fillText('🔍 ×' + Math.round(r / 0.62 / kam.s), cx, cy + r * 0.72);
    }

    function korak(T, dt) {
      const tacke = [];
      for (const e of let_.lista) {
        const k = e.sim.kadrovi;
        const f = Math.min(k.length - 1, T * 60), i = Math.floor(f), a = f - i;
        const p = k[i], q = k[Math.min(k.length - 1, i + 1)];
        const np = [p[0] + (q[0] - p[0]) * a, p[1] + (q[1] - p[1]) * a];
        e.rot -= ((np[0] - e.p[0]) / R_LOPTE) * 0.6; // povratna rotacija
        e.p = np;
        if (e.put.length === 0 || Math.hypot(np[0] - e.put[e.put.length - 1][0], np[1] - e.put[e.put.length - 1][1]) > 0.04) e.put.push(np);
        tacke.push(np);
        // događaji glavne lopte
        for (; e.sledeci < k.length && e.sledeci <= i; e.sledeci++) {
          const dod = k[e.sledeci][2];
          if (dod && e.glavna) { try { navigator.vibrate?.(20); } catch {} op.dodir?.(dod); }
        }
        if (!e.javljeno && e.sim.kos && T >= e.sim.tKos) {
          e.javljeno = true; mreza = 1;
          if (e.glavna) { natpis = { tekst: (op.tr || String)(e.sim.cisto ? 'ČISTO! 🎯' : 'KOŠ! 🏀'), boja: '#ffd166', t: vreme }; try { navigator.vibrate?.([40, 30, 80]); } catch {} op.kos?.(e); }
        }
        if (!e.javljeno && !e.sim.kos && e.glavna && T >= Math.min(e.sim.t - 0.6, (e.sim.kadrovi.findIndex((x) => x[1] <= R_LOPTE + 0.01) / 60) || e.sim.t)) {
          e.javljeno = true;
          natpis = { tekst: (op.tr || String)('Promašaj'), boja: '#ff7675', t: vreme }; op.promasaj?.(e);
        }
      }
      // kamera: samo odzumira ako lopta izađe iz kadra
      let x0 = -1.3, y0 = -0.55, x1 = sc.d + 1.15, y1 = Math.max(5.2, sc.h0 + 2.6);
      for (const [x, y] of tacke) { x0 = Math.min(x0, x - 0.6); x1 = Math.max(x1, x + 0.6); y1 = Math.max(y1, y + 0.8); }
      const c = okvir(x0, y0, x1, y1);
      if (!let_.gotovo && c.s < kam.s - 1e-6) {
        const k = 1 - Math.exp(-dt * 4);
        kam.x += (c.x - kam.x) * k; kam.y += (c.y - kam.y) * k; kam.s += (c.s - kam.s) * k;
        crtajPozadinu();
      }
    }

    function petlja(sad) {
      if (unisten) return;
      raf = requestAnimationFrame(petlja);
      if (!cv.isConnected) return;
      const dt = Math.min(0.05, (sad - prosli) / 1000);
      prosli = sad; vreme += dt;
      velicina();
      if (let_) {
        let_.T = Math.max(0, (sad - let_.t0) / 1000);
        korak(let_.T, dt);
        if (!let_.gotovo && let_.T >= let_.kraj) { let_.gotovo = true; setTimeout(() => let_?.resi(), 300); }
      }
      crtaj(dt);
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => velicina()) : null;
    ro?.observe(el);
    velicina();
    raf = requestAnimationFrame(petlja);

    return {
      // igrač nišani: fn(sila, ugao) pri svakoj promeni povlačenjem
      nisani(fn) { naPromenu = fn; zakljucano = false; cv.classList.add('vuci'); },
      postavi(sila, ugao) { nisan = { sila, ugao }; },
      // let: lista = [{ sila, ugao, boja, avatar, glavna }]; vraća Promise na kraju
      pusti(lista) {
        naPromenu = null; zakljucano = true; cv.classList.remove('vuci');
        natpis = null; mreza = 0;
        kam = okvirPocetni(); crtajPozadinu();
        if (!lista.some((e) => e.glavna) && lista.length) lista[0].glavna = true;
        const L = lista.map((e) => ({ ...e, sim: simuliraj(sc, e.sila, e.ugao, true), p: [0, sc.h0], put: [], rot: 0, sledeci: 0, javljeno: false }));
        return new Promise((resi) => {
          let_ = { lista: L, t0: performance.now(), T: 0, kraj: Math.max(...L.map((e) => e.sim.t)), gotovo: false, resi };
        });
      },
      najbolje(nb) {
        zlatna = nb ? { ...simuliraj(sc, nb.sila, nb.ugao, true), nb } : null;
        if (nb && W) { kam = okvirPocetni(); crtajPozadinu(); } // posle dalekih šuteva – nazad na teren, da se sile vide
      },
      sile(da) { sile = !!da; },
      unisti() { unisten = true; cancelAnimationFrame(raf); ro?.disconnect(); cv.remove(); },
    };
  }

  return { simuliraj, najbolje, napravi, bodovi, opis, objasni, potrebnaSila, optimalniUgao, sredi, scena, broj, n1, F_MAX, UGAO_MIN, UGAO_MAX, M, DT_UDARCA, H_OBRUCA, PLANETE };
});
