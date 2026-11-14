// Bonus igra „Beži od raptora!“ (po xkcd #135 „Substitute“): čovek u geometrijskom telu (trougao, kvadrat), raptori
// u temenima; svaki raptor uvek trči pravo ka čoveku. Igrač bira pravac i brzinu (povlači vektor), a simulacija
// pokaže koliko je izdržao. Isti kôd koristi server (bodovanje, lib/soba.js) i telefon (animacija) – simulacija je
// deterministička, pa obe strane dobijaju isto vreme.
(function (koren, f) {
  const R = f();
  if (typeof module === 'object' && module.exports) module.exports = R;
  else koren.Raptori = R;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const TAU = Math.PI * 2;
  const KMH = 1 / 3.6;
  const V_COVEKA_KMH = 20;
  const V_COVEKA = V_COVEKA_KMH * KMH; // m/s
  const ULOV = 0.6; // m – raptor je stigao čoveka
  const DT = 1 / 240; // korak simulacije (s)
  const KADAR = 4; // svaki 4. korak = 60 kadrova u sekundi za animaciju
  const MAKS_T = 25;
  const okrugli = (t) => Math.round(t * 100) / 100;

  // ───────── simulacija ─────────
  // ugao u ravni ekrana (y nadole), jacina 0–1 (deo najveće brzine). Vraća vreme do ulova i (po želji) kadrove.
  function simuliraj(sc, ugao, jacina, snimak = false, dt = DT) {
    const v = V_COVEKA * Math.max(0, Math.min(1, +jacina || 0));
    const vx = Math.cos(ugao) * v, vy = Math.sin(ugao) * v;
    let cx = sc.covek[0], cy = sc.covek[1];
    const r = sc.raptori.map((p) => [p.x, p.y]);
    const brz = sc.raptori.map((p) => p.v * KMH * dt);
    const kadrovi = snimak ? [] : null;
    const zapisi = () => kadrovi.push({ c: [cx, cy], r: r.map((p) => [p[0], p[1]]) });
    const kadarSvaki = Math.round(KADAR * (DT / dt)) || 1;
    for (let k = 0; ; k++) {
      if (snimak && k % kadarSvaki === 0) zapisi();
      if (k * dt >= MAKS_T) return { t: MAKS_T, ko: -1, kadrovi };
      cx += vx * dt; cy += vy * dt;
      for (let i = 0; i < r.length; i++) {
        const dx = cx - r[i][0], dy = cy - r[i][1];
        const d = Math.hypot(dx, dy);
        if (d - brz[i] <= ULOV) {
          // stigao: raptor staje tik uz čoveka
          const k2 = d > 0 ? (d - ULOV) / d : 0;
          r[i][0] += dx * Math.max(0, k2); r[i][1] += dy * Math.max(0, k2);
          if (snimak) zapisi();
          return { t: okrugli((k + 1) * dt), ko: i, kadrovi };
        }
        r[i][0] += (dx / d) * brz[i];
        r[i][1] += (dy / d) * brz[i];
      }
    }
  }

  // najduže moguće preživljavanje: gruba pretraga po pravcima i brzinama, pa doterivanje oko najboljeg
  function najbolje(sc) {
    let b = { t: -1, ugao: 0, jacina: 1 };
    const probaj = (u, j, dt) => {
      j = Math.max(0.2, Math.min(1, j));
      const t = simuliraj(sc, u, j, false, dt).t;
      if (t > b.t + 1e-9) b = { ugao: u, jacina: j, t };
    };
    for (let k = 0; k < 120; k++) for (const j of [1, 0.75, 0.5]) probaj((k * TAU) / 120, j, 1 / 80);
    for (const [korak, kj] of [[TAU / 360, 0.1], [TAU / 1440, 0.03]]) {
      const { ugao: u0, jacina: j0 } = b;
      for (let d = -4; d <= 4; d++) for (const dj of [-2, -1, 0, 1, 2]) probaj(u0 + d * korak, j0 + dj * kj, 1 / 160);
    }
    const u = ((b.ugao % TAU) + TAU) % TAU;
    const j = Math.round(b.jacina * 100) / 100;
    return { ugao: u, jacina: j, t: simuliraj(sc, u, j).t };
  }

  // ───────── scenario ─────────
  const OBLICI = {
    jednakostranicni: () => [0, 1, 2].map((i) => { const a = -Math.PI / 2 + (i * TAU) / 3; return [Math.cos(a) / Math.sqrt(3), Math.sin(a) / Math.sqrt(3)]; }),
    pravougli: () => [[0, 0], [1, 0], [0, 1]].map(([x, y]) => [x - 1 / 3, y - 1 / 3]),
    kvadrat: () => [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]],
  };
  const izaberi = (niz, rnd) => niz[Math.floor(rnd() * niz.length)];

  function sastavi(osnova, L) {
    return {
      ...osnova,
      L,
      temena: osnova.jed.map(([x, y]) => [okrugli(x * L), okrugli(y * L)]),
      covek: [okrugli(osnova.cJed[0] * L), okrugli(osnova.cJed[1] * L)],
      raptori: osnova.rap.map((r) => ({ ...r, x: okrugli(osnova.jed[r.teme][0] * L), y: okrugli(osnova.jed[r.teme][1] * L) })),
    };
  }

  function napravi(rnd = Math.random) {
    const oblik = rnd() < 0.5 ? 'kvadrat' : rnd() < 0.6 ? 'jednakostranicni' : 'pravougli';
    let jed = OBLICI[oblik]();
    // nasumično okrenut (kvadrat ponekad kao „romb“)
    const rot = oblik === 'kvadrat' ? (rnd() < 0.3 ? Math.PI / 4 : 0) : oblik === 'pravougli' ? Math.floor(rnd() * 4) * (Math.PI / 2) : (rnd() < 0.5 ? 0 : Math.PI);
    jed = jed.map(([x, y]) => [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)]);
    // čovek: u težištu ili pomeren ka nasumičnoj tački unutar tela
    const tez = [jed.reduce((a, p) => a + p[0], 0) / jed.length, jed.reduce((a, p) => a + p[1], 0) / jed.length];
    let cJed = tez;
    if (rnd() > 0.3) {
      let u;
      if (jed.length === 3) {
        let a = rnd(), b = rnd();
        if (a + b > 1) { a = 1 - a; b = 1 - b; }
        u = [jed[0][0] + a * (jed[1][0] - jed[0][0]) + b * (jed[2][0] - jed[0][0]), jed[0][1] + a * (jed[1][1] - jed[0][1]) + b * (jed[2][1] - jed[0][1])];
      } else {
        const a = rnd(), b = rnd();
        u = [jed[0][0] + a * (jed[1][0] - jed[0][0]) + b * (jed[3][0] - jed[0][0]), jed[0][1] + a * (jed[1][1] - jed[0][1]) + b * (jed[3][1] - jed[0][1])];
      }
      const f = 0.25 + rnd() * 0.35;
      cJed = [tez[0] + (u[0] - tez[0]) * f, tez[1] + (u[1] - tez[1]) * f];
    }
    // dve grupe raptora: povređeni (sporiji) ili napredni (brži) među običnima
    const varijanta = rnd() < 0.55 ? 'povredjeni' : 'napredni';
    const n = jed.length;
    const posebnih = n === 3 ? (rnd() < 0.7 ? 1 : 2) : rnd() < 0.5 ? 1 : 2;
    const v1 = varijanta === 'povredjeni' ? izaberi([40, 45, 50, 55, 60], rnd) : izaberi([30, 35, 40], rnd);
    const v2 = varijanta === 'povredjeni' ? izaberi([25, 30], rnd) : izaberi([60, 65, 70], rnd);
    const posebni = new Set();
    while (posebni.size < posebnih) posebni.add(Math.floor(rnd() * n));
    const rap = jed.map((_, i) => (posebni.has(i)
      ? { teme: i, v: v2, tip: varijanta === 'povredjeni' ? 'povredjen' : 'napredni' }
      : { teme: i, v: v1, tip: 'obican' }));
    const osnova = { oblik, varijanta, jed, cJed, rap };
    // veličina tela se podešava tako da najbolji beg traje 6,5–9,5 s (najgori tek 2–4 s)
    const cilj = 6.5 + rnd() * 3;
    let L = 60, sc, nb;
    for (let i = 0; i < 3; i++) {
      sc = sastavi(osnova, L);
      nb = najbolje(sc);
      const novo = Math.max(15, Math.min(500, Math.round((L * cilj) / nb.t)));
      if (novo === L) break;
      L = novo;
    }
    sc = sastavi(osnova, L);
    const { jed: _j, cJed: _c, rap: _r, ...javno } = sc;
    return { ...javno, vCoveka: V_COVEKA_KMH, najbolje: najbolje(sc) };
  }

  // ───────── tekstovi (latinica – klijent preslovljava DOM) ─────────
  const NAZIV_OBLIKA = { jednakostranicni: 'Jednakostranični trougao', pravougli: 'Pravougli trougao', kvadrat: 'Kvadrat' };
  const broj = (x, d = 2) => String(+x.toFixed(d)).replace('.', ',');
  const STRELICE = ['→', '↘', '↓', '↙', '←', '↖', '↑', '↗'];
  const strelica = (u) => STRELICE[((Math.round(u / (Math.PI / 4)) % 8) + 8) % 8];
  const raptora = (n) => (n === 1 ? 'raptor' : 'raptora');

  function opis(sc) {
    const grupe = {};
    for (const r of sc.raptori) (grupe[r.tip] ||= []).push(r);
    const delovi = [];
    if (grupe.obican) delovi.push(`${grupe.obican.length} ${raptora(grupe.obican.length)} – ${grupe.obican[0].v} km/h`);
    if (grupe.povredjen) delovi.push(`${grupe.povredjen.length} ${grupe.povredjen.length === 1 ? 'povređen' : 'povređena'} 🩹 – ${grupe.povredjen[0].v} km/h`);
    if (grupe.napredni) delovi.push(`${grupe.napredni.length} ${grupe.napredni.length === 1 ? 'napredni' : 'napredna'} ⚡ – ${grupe.napredni[0].v} km/h`);
    const mera = sc.oblik === 'pravougli' ? `katete ${sc.L} m` : `stranica ${sc.L} m`;
    return { oblik: `${NAZIV_OBLIKA[sc.oblik]}, ${mera}`, raptori: delovi.join(' · '), covek: `Ti: najviše ${V_COVEKA_KMH} km/h` };
  }

  // kratko objašnjenje najboljeg bega
  function objasni(sc) {
    const nb = sc.najbolje;
    const [cx, cy] = sc.covek;
    const uglovi = sc.raptori.map((r) => {
      const a = Math.atan2(r.y - cy, r.x - cx);
      return { r, razlika: Math.abs(((a - nb.ugao + Math.PI * 3) % TAU) - Math.PI) };
    });
    const vMax = Math.max(...sc.raptori.map((r) => r.v));
    const vMin = Math.min(...sc.raptori.map((r) => r.v));
    const ka = uglovi.sort((a, b) => a.razlika - b.razlika)[0];
    const recenice = ['Raptori uvek trče pravo ka tebi, pa tvoj pravac određuje i njihove putanje.'];
    if (ka.razlika < 0.8 && ka.r.v === vMin && vMin < vMax) {
      recenice.push(`Najbolje je bilo trčati ${strelica(nb.ugao)} – skoro ka ${ka.r.tip === 'povredjen' ? 'povređenom' : 'sporijem'} raptoru (${ka.r.v} km/h): on je spor, a brzi (${vMax} km/h) moraju da te stižu s leđa.`);
    } else {
      recenice.push(`Najbolje je bilo trčati ${strelica(nb.ugao)} – kroz procep između raptora, što dalje od najbržih (${vMax} km/h).`);
    }
    recenice.push(nb.jacina >= 0.98
      ? `Punom brzinom tako izdržiš ${broj(nb.t)} s.`
      : `Najbolje je bilo ${Math.round(nb.jacina * V_COVEKA_KMH)} km/h, a ne punom brzinom (${broj(nb.t)} s): sporiji beg ponekad „namami“ raptore da se skupe iza tebe.`);
    return recenice;
  }

  // ───────── prikaz (samo u pregledaču) ─────────
  const BOJE_R = {
    obican: { telo: '#c98a3f', tamno: '#6b4220', pruge: '#7c4a1f', svetlo: '#f0c27a', trag: '#e0a35a' },
    povredjen: { telo: '#a89c76', tamno: '#5a523e', pruge: '#6e6447', svetlo: '#d8cfa9', trag: '#c9bf98' },
    napredni: { telo: '#5b55d6', tamno: '#262078', pruge: '#2c247d', svetlo: '#9d97ff', trag: '#8f89ff', sjaj: '#59f3ff' },
  };

  // seme za travu (isti izgled pri svakom crtanju)
  function seme(s) { return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  function pilula(g, tekst, x, y, pozadina, boja, vel) {
    g.font = `600 ${vel}px system-ui, sans-serif`;
    const w = g.measureText(tekst).width + vel * 0.9, h = vel * 1.55;
    g.fillStyle = pozadina;
    g.beginPath(); g.roundRect ? g.roundRect(x - w / 2, y - h / 2, w, h, h / 2) : g.rect(x - w / 2, y - h / 2, w, h); g.fill();
    g.fillStyle = boja; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(tekst, x, y + vel * 0.05);
  }

  // raptor odozgo, okrenut ka +x; jedinica = dužina tela (od njuške do vrha repa ≈ 1,1)
  function crtajRaptora(g, x, y, ugao, faza, s, tip, trci, vreme, sjajJacina = 1) {
    const P = BOJE_R[tip] || BOJE_R.obican;
    const z = Math.sin(faza);
    const zr = trci ? 1 : 0.12;
    g.save();
    g.translate(x, y); g.rotate(ugao); g.scale(s, s);
    // senka
    g.fillStyle = 'rgba(0,0,0,.28)';
    g.beginPath(); g.ellipse(-0.04, 0.07, 0.56, 0.17, 0, 0, TAU); g.fill();
    // rep (njiše se)
    const rep = trci ? Math.sin(faza + 1.2) * 0.11 : Math.sin(vreme * 1.6) * 0.1;
    g.fillStyle = P.telo;
    g.beginPath(); g.moveTo(-0.14, -0.08);
    g.quadraticCurveTo(-0.4, -0.06 + rep * 0.4, -0.64, rep);
    g.quadraticCurveTo(-0.4, 0.06 + rep * 0.4, -0.14, 0.08); g.closePath(); g.fill();
    g.strokeStyle = P.pruge; g.lineWidth = 0.018;
    for (const t of [0.3, 0.5, 0.7]) {
      const xx = -0.14 - t * 0.5, yy = rep * t * t, w = 0.07 * (1 - t * 0.7);
      g.beginPath(); g.moveTo(xx, yy - w); g.lineTo(xx - 0.02, yy + w); g.stroke();
    }
    // zadnje noge: korak napred-nazad, prsti i kandža srp
    for (const st of [-1, 1]) {
      const k = st * z * 0.22 * zr;
      const fx = -0.03 + k, fy = st * 0.17;
      g.strokeStyle = P.tamno; g.lineCap = 'round';
      g.lineWidth = 0.075; g.beginPath(); g.moveTo(-0.07, st * 0.07); g.lineTo(fx, fy); g.stroke();
      g.lineWidth = 0.026;
      for (const a of [-0.55, 0, 0.55]) { g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx + Math.cos(a) * 0.075, fy + Math.sin(a) * 0.075); g.stroke(); }
      g.strokeStyle = '#f4ecd8'; g.lineWidth = 0.02;
      g.beginPath(); g.arc(fx + 0.01, fy, 0.04, -Math.PI * 0.9, -Math.PI * 0.35); g.stroke();
    }
    // telo sa senčenjem
    if (tip === 'napredni') { g.shadowColor = P.sjaj; g.shadowBlur = 14 * sjajJacina; }
    const gr = g.createRadialGradient(0.03, -0.04, 0.02, 0, 0, 0.28);
    gr.addColorStop(0, P.svetlo); gr.addColorStop(1, P.telo);
    g.fillStyle = gr;
    g.beginPath(); g.ellipse(0, 0, 0.25, 0.12, 0, 0, TAU); g.fill();
    g.shadowBlur = 0;
    // pruge preko leđa
    g.strokeStyle = P.pruge; g.lineWidth = 0.024; g.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const xx = -0.15 + i * 0.075;
      g.beginPath(); g.moveTo(xx, -0.085); g.quadraticCurveTo(xx + 0.025, 0, xx, 0.085); g.stroke();
    }
    // perje na leđima naprednog
    if (tip === 'napredni') {
      g.strokeStyle = P.sjaj; g.lineWidth = 0.02;
      for (let i = 0; i < 5; i++) { const xx = -0.18 + i * 0.07; g.beginPath(); g.moveTo(xx, 0); g.lineTo(xx - 0.06, 0); g.stroke(); }
    }
    // zavoj povređenog
    if (tip === 'povredjen') {
      g.fillStyle = '#f7f3ea';
      g.beginPath(); g.rect(-0.07, -0.125, 0.07, 0.25); g.fill();
      g.fillStyle = '#d94b4b';
      g.beginPath(); g.arc(-0.035, -0.06, 0.018, 0, TAU); g.fill();
    }
    // prednje ručice
    g.strokeStyle = P.tamno; g.lineWidth = 0.04;
    for (const st of [-1, 1]) {
      const m = trci ? Math.sin(faza + (st > 0 ? 0 : Math.PI)) * 0.03 : 0;
      g.beginPath(); g.moveTo(0.13, st * 0.08); g.quadraticCurveTo(0.2 + m, st * 0.15, 0.25 + m, st * 0.11); g.stroke();
    }
    // vrat i glava (blago klimanje u trku)
    const bob = trci ? Math.sin(faza * 2) * 0.012 : Math.sin(vreme * 0.9) * 0.02;
    g.fillStyle = P.telo;
    g.beginPath(); g.ellipse(0.22, bob * 0.5, 0.1, 0.07, 0, 0, TAU); g.fill();
    g.save(); g.translate(0, bob);
    g.fillStyle = P.telo;
    g.beginPath(); g.moveTo(0.26, -0.075);
    g.quadraticCurveTo(0.38, -0.085, 0.5, -0.032);
    g.quadraticCurveTo(0.55, 0, 0.5, 0.032);
    g.quadraticCurveTo(0.38, 0.085, 0.26, 0.075); g.closePath(); g.fill();
    g.fillStyle = P.pruge;
    g.beginPath(); g.ellipse(0.33, 0, 0.05, 0.025, 0, 0, TAU); g.fill();
    for (const st of [-1, 1]) {
      g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(0.39, st * 0.05, 0.022, 0, TAU); g.fill();
      g.fillStyle = '#111'; g.beginPath(); g.ellipse(0.395, st * 0.05, 0.007, 0.017, 0, 0, TAU); g.fill();
      g.fillStyle = '#3a2410'; g.beginPath(); g.arc(0.515, st * 0.016, 0.007, 0, TAU); g.fill();
    }
    g.restore();
    g.restore();
  }

  // čovek = žeton sa avatarom igrača: stopala koja trče ispod, klin u pravcu bega
  function crtajCoveka(g, x, y, ugao, faza, s, boja, trci, pao, avatar) {
    const z = trci ? Math.sin(faza) : 0;
    g.save();
    g.translate(x, y);
    g.fillStyle = 'rgba(0,0,0,.3)';
    g.beginPath(); g.ellipse(s * 0.04, s * 0.08, s * 0.36, s * 0.3, 0, 0, TAU); g.fill();
    g.save(); g.rotate(ugao);
    // stopala
    g.fillStyle = '#2d2a32';
    for (const st of [-1, 1]) { g.beginPath(); g.ellipse(st * z * s * 0.3, st * s * 0.15, s * 0.11, s * 0.065, 0, 0, TAU); g.fill(); }
    // klin – pravac
    if (!pao) {
      g.fillStyle = boja;
      g.beginPath(); g.moveTo(s * 0.5, 0); g.lineTo(s * 0.26, -s * 0.15); g.lineTo(s * 0.26, s * 0.15); g.closePath(); g.fill();
    }
    g.restore();
    const r = s * 0.3;
    g.fillStyle = pao ? '#4a4f58' : '#1d2b3a';
    g.strokeStyle = pao ? '#8a8f98' : boja; g.lineWidth = Math.max(2, s * 0.07);
    g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); g.stroke();
    g.globalAlpha *= pao ? 0.55 : 1;
    g.font = `${Math.round(r * 1.25)}px system-ui, 'Noto Color Emoji', sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(avatar || '🙂', 0, r * 0.08);
    g.restore();
    if (pao) {
      g.save(); g.translate(x, y);
      g.strokeStyle = '#ff5d5d'; g.lineWidth = Math.max(2.5, s * 0.08); g.lineCap = 'round';
      const k = r * 0.75;
      g.beginPath(); g.moveTo(-k, -k); g.lineTo(k, k); g.moveTo(k, -k); g.lineTo(-k, k); g.stroke();
      g.restore();
    }
  }

  function otisakRaptora(g, x, y, ugao, s, a) {
    g.save(); g.translate(x, y); g.rotate(ugao);
    g.strokeStyle = `rgba(35,22,10,${a})`; g.lineWidth = Math.max(1.2, s * 0.022); g.lineCap = 'round';
    for (const u of [-0.5, 0, 0.5]) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(u) * s * 0.075, Math.sin(u) * s * 0.075); g.stroke(); }
    g.restore();
  }
  function otisakCoveka(g, x, y, ugao, s, a) {
    g.save(); g.translate(x, y); g.rotate(ugao);
    g.fillStyle = `rgba(30,24,18,${a})`;
    g.beginPath(); g.ellipse(0, 0, s * 0.06, s * 0.03, 0, 0, TAU); g.fill();
    g.restore();
  }

  // op: { boja, avatar }
  function scena(el, sc, op = {}) {
    const cv = document.createElement('canvas');
    cv.className = 'raptori-platno';
    el.appendChild(cv);
    const g = cv.getContext('2d');
    const trava = document.createElement('canvas');
    let W = 0, H = 0, dpr = 1;
    let kam = null, kamCilj = null;
    let unisten = false, raf = 0, prosli = performance.now(), vreme = 0;
    let vucenje = null; // { x, y } vektor u pikselima dok igrač vuče
    let naIzbor = null, zakljucano = false;
    let trka = null; // { lista, t0, gotovo, kraj, resi }
    let zlatna = null; // putanja najboljeg bega (posle otkrivanja)
    let tragovi = [], prasina = [], talasi = [], tresenje = 0;

    const sxy = (x, y) => [(x - kam.x) * kam.s + W / 2, (y - kam.y) * kam.s + H / 2];
    const vel = () => Math.max(34, Math.min(100, Math.min(W, H) * 0.14));
    const RMAX = () => Math.min(W, H) * 0.3;

    function okvir(tacke) {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const [x, y] of tacke) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
      const pad = Math.max(x1 - x0, y1 - y0) * 0.12 + 4;
      x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
      const s = Math.min(W / (x1 - x0), H / (y1 - y0));
      return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, s };
    }
    const okvirTela = () => okvir([...sc.temena, sc.covek]);

    function crtajTravu() {
      trava.width = Math.round(W * dpr); trava.height = Math.round(H * dpr);
      const t = trava.getContext('2d');
      t.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gr = t.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
      gr.addColorStop(0, '#2f5a3a'); gr.addColorStop(1, '#14291c');
      t.fillStyle = gr; t.fillRect(0, 0, W, H);
      const r = seme(7);
      for (let i = 0; i < 26; i++) {
        t.fillStyle = `rgba(${r() < 0.5 ? '10,30,15' : '70,110,60'},${0.08 + r() * 0.08})`;
        t.beginPath(); t.ellipse(r() * W, r() * H, 20 + r() * 70, 12 + r() * 40, r() * 3, 0, TAU); t.fill();
      }
      t.lineCap = 'round';
      // sitne tačkice zemlje, pa buseni trave (3–6 vlati u lepezi)
      for (let i = 0, n = Math.round((W * H) / 260); i < n; i++) {
        t.fillStyle = `rgba(${r() < 0.5 ? '20,40,22' : '90,120,70'},${0.15 + r() * 0.2})`;
        t.fillRect(r() * W, r() * H, 1.2, 1.2);
      }
      for (let i = 0, n = Math.round((W * H) / 2200); i < n; i++) {
        const x = r() * W, y = r() * H, vlati = 3 + Math.floor(r() * 4), h0 = 4 + r() * 6;
        const hue = 90 + r() * 45, sv = 30 + r() * 25;
        for (let k = 0; k < vlati; k++) {
          const a = -Math.PI / 2 + (k / (vlati - 1) - 0.5) * 1.3 + (r() - 0.5) * 0.3, h = h0 * (0.6 + r() * 0.5);
          t.strokeStyle = `hsla(${hue},${sv}%,${30 + r() * 22}%,${0.45 + r() * 0.35})`;
          t.lineWidth = 1 + r() * 0.6;
          t.beginPath(); t.moveTo(x, y); t.quadraticCurveTo(x + Math.cos(a) * h * 0.5, y + Math.sin(a) * h * 0.6, x + Math.cos(a) * h, y + Math.sin(a) * h); t.stroke();
        }
      }
      // tamni rub (vinjeta)
      const v = t.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.35)');
      t.fillStyle = v; t.fillRect(0, 0, W, H);
    }

    function velicina() {
      const w = el.clientWidth || 320;
      const tv = document.body.classList.contains('ekran');
      const h = Math.round(Math.min(w * (tv ? 0.5 : 0.92), innerHeight * (tv ? 0.55 : 0.6)));
      if (w === W && h === H) return;
      W = w; H = h; dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.height = H + 'px';
      crtajTravu();
      const k = okvirTela();
      if (!trka) kam = { ...k };
      else kam = { ...kam, s: Math.min(kam.s, k.s) };
      kamCilj = { ...kam };
    }

    // ── interakcija: vektor bega od čoveka ──
    const tackaDogadjaja = (e) => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    function vektor(e) {
      const [px, py] = tackaDogadjaja(e);
      const [hx, hy] = sxy(sc.covek[0], sc.covek[1]);
      let dx = px - hx, dy = py - hy;
      const d = Math.hypot(dx, dy), m = RMAX();
      if (d > m) { dx *= m / d; dy *= m / d; }
      vucenje = { x: dx, y: dy };
    }
    const izbor = () => {
      const d = Math.hypot(vucenje.x, vucenje.y) / RMAX();
      return { ugao: ((Math.atan2(vucenje.y, vucenje.x) % TAU) + TAU) % TAU, jacina: d > 0.97 ? 1 : Math.round(d * 100) / 100 };
    };
    cv.addEventListener('pointerdown', (e) => {
      if (!naIzbor || zakljucano || trka) return;
      cv.setPointerCapture?.(e.pointerId);
      vektor(e); e.preventDefault();
    });
    cv.addEventListener('pointermove', (e) => { if (vucenje && naIzbor && !zakljucano) { vektor(e); e.preventDefault(); } });
    const pusten = () => {
      if (!vucenje || zakljucano) return;
      const iz = izbor();
      if (iz.jacina < 0.08) { vucenje = null; op.premalo?.(); return; }
      zakljucano = true;
      try { navigator.vibrate?.(30); } catch {}
      naIzbor(iz.ugao, iz.jacina);
    };
    cv.addEventListener('pointerup', pusten);
    cv.addEventListener('pointercancel', () => { if (!zakljucano) vucenje = null; });

    // ── stanje u trenutku T trke ──
    function uTrenutku(sim, T) {
      const k = sim.kadrovi;
      const f = Math.min(k.length - 1, T * 60);
      const i = Math.floor(f), a = f - i, b = k[Math.min(k.length - 1, i + 1)], p = k[i];
      const lerp = (u, v) => [u[0] + (v[0] - u[0]) * a, u[1] + (v[1] - u[1]) * a];
      return { c: lerp(p.c, b.c), r: p.r.map((q, j) => lerp(q, b.r[j])) };
    }

    function korakTrke(T, dt) {
      const L = trka.lista;
      const s = vel();
      const tacke = [...sc.temena];
      for (const e of L) {
        const st = uTrenutku(e.sim, Math.min(T, e.sim.t));
        // čovek
        const pao = T >= e.sim.t;
        if (!pao) {
          const d = Math.hypot(st.c[0] - e.c[0], st.c[1] - e.c[1]) * kam.s;
          e.fc += (d / (s * 0.42)) * Math.PI;
          if (Math.floor(e.fc / Math.PI) !== e.korak) {
            e.korak = Math.floor(e.fc / Math.PI);
            const st2 = e.korak % 2 ? 1 : -1, off = (s * 0.1) / kam.s;
            tragovi.push({ x: st.c[0] - Math.sin(e.ugao) * off * st2, y: st.c[1] + Math.cos(e.ugao) * off * st2, u: e.ugao, t: vreme, c: 1 });
          }
        }
        if (pao && !e.pao) {
          e.pao = true;
          if (e.glavna) {
            talasi.push({ x: st.c[0], y: st.c[1], t: vreme, b: '#ff5d5d' }, { x: st.c[0], y: st.c[1], t: vreme + 0.15, b: '#ffd166' });
            tresenje = 0.45;
            try { navigator.vibrate?.([60, 40, 90]); } catch {}
            op.ulov?.(e);
          } else talasi.push({ x: st.c[0], y: st.c[1], t: vreme, b: e.boja, mali: true });
        }
        e.c = st.c;
        tacke.push(st.c);
        e.put.push(st.c);
        // raptori (samo glavne trke)
        if (e.glavna) {
          st.r.forEach((q, j) => {
            const R = e.rap[j];
            const d = Math.hypot(q[0] - R.p[0], q[1] - R.p[1]);
            if (d > 1e-6) R.u = Math.atan2(q[1] - R.p[1], q[0] - R.p[0]);
            R.trci = d > 1e-6;
            const dpx = d * kam.s;
            R.f += (dpx / (s * 0.55)) * Math.PI;
            if (Math.floor(R.f / Math.PI) !== R.korak) {
              R.korak = Math.floor(R.f / Math.PI);
              const st2 = R.korak % 2 ? 1 : -1, off = (s * 0.17) / kam.s;
              const fx = q[0] - Math.sin(R.u) * off * st2, fy = q[1] + Math.cos(R.u) * off * st2;
              tragovi.push({ x: fx, y: fy, u: R.u, t: vreme, r: 1 });
              for (let i = 0; i < 2; i++) prasina.push({ x: fx, y: fy, vx: (Math.random() - 0.5) * 8 - Math.cos(R.u) * 6, vy: (Math.random() - 0.5) * 8 - Math.sin(R.u) * 6, t: vreme, r: s * (0.06 + Math.random() * 0.06) });
            }
            R.p = q;
            R.put.push(q);
            tacke.push(q);
          });
        }
      }
      // kamera prati: sve mora da stane u kadar (glatko odzumira)
      kamCilj = okvir(tacke);
      if (kamCilj.s > kam.s) kamCilj.s = kam.s; // tokom trke samo odzumiranje – bez „pumpanja“
      const k = 1 - Math.exp(-dt * 3.5);
      kam.x += (kamCilj.x - kam.x) * k; kam.y += (kamCilj.y - kam.y) * k; kam.s += (kamCilj.s - kam.s) * k;
    }

    // ── crtanje ──
    function crtaj(dt) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.drawImage(trava, 0, 0, W, H);
      let ox = 0, oy = 0;
      if (tresenje > 0) { tresenje -= dt; const j = tresenje * 14; ox = (Math.random() - 0.5) * j; oy = (Math.random() - 0.5) * j; }
      g.save(); g.translate(ox, oy);
      const s = vel();
      // telo (ograda)
      const T = sc.temena.map(([x, y]) => sxy(x, y));
      g.beginPath(); T.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
      g.fillStyle = 'rgba(232,214,160,0.10)'; g.fill();
      g.setLineDash([9, 7]); g.lineWidth = 2.2; g.strokeStyle = 'rgba(240,255,220,0.55)'; g.stroke(); g.setLineDash([]);
      for (const [x, y] of T) { g.fillStyle = 'rgba(240,255,220,0.7)'; g.beginPath(); g.arc(x, y, 3.5, 0, TAU); g.fill(); }
      // dužina stranice
      {
        const [a, b] = [T[0], T[1]];
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        const [cx, cy] = sxy(sc.covek[0], sc.covek[1]);
        const nx = mx - cx, ny = my - cy, n = Math.hypot(nx, ny) || 1;
        pilula(g, `${sc.L} m`, mx + (nx / n) * 16, my + (ny / n) * 16, 'rgba(10,25,15,.75)', '#e8f5d0', Math.max(11, s * 0.36));
      }
      // najbolji beg (zlatna isprekidana putanja)
      if (zlatna) {
        const pts = zlatna.kadrovi.map((k) => sxy(k.c[0], k.c[1]));
        g.setLineDash([6, 6]); g.lineWidth = 3; g.strokeStyle = 'rgba(255,209,102,0.95)';
        g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.setLineDash([]);
        const [ex, ey] = pts[pts.length - 1];
        g.font = `${Math.round(s * 0.55)}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('⭐', ex, ey);
        pilula(g, `${broj(zlatna.t)} s`, ex, ey - s * 0.6, 'rgba(255,209,102,.95)', '#3a2a00', Math.max(11, s * 0.36));
      }
      // putanje
      if (trka) {
        for (const e of trka.lista) {
          if (e.glavna) for (const R of e.rap) linija(R.put, BOJE_R[R.tip].trag, 0.4, 2.5);
          if (e.glavna) linija(e.put, '#ffffff', 0.15, 9);
          linija(e.put, e.boja, e.glavna ? 0.85 : 0.65, e.glavna ? 3.5 : 2.5);
        }
      }
      // otisci (blede, ali ne nestaju sasvim – ostaje trag)
      for (const o of tragovi) {
        const a = Math.max(0.22, 0.6 - (vreme - o.t) * 0.12);
        const [x, y] = sxy(o.x, o.y);
        if (o.r) otisakRaptora(g, x, y, o.u, s, a); else otisakCoveka(g, x, y, o.u, s, a * 0.9);
      }
      // prašina
      prasina = prasina.filter((p) => vreme - p.t < 0.7);
      for (const p of prasina) {
        const t = vreme - p.t;
        const [x, y] = sxy(p.x + p.vx * t * 0.15, p.y + p.vy * t * 0.15);
        g.fillStyle = `rgba(214,196,150,${0.35 * (1 - t / 0.7)})`;
        g.beginPath(); g.arc(x, y, p.r * (1 + t * 2.2), 0, TAU); g.fill();
      }
      // vektor koji igrač vuče
      const [hx, hy] = sxy(sc.covek[0], sc.covek[1]);
      if (naIzbor && !trka) {
        const m = RMAX();
        g.lineWidth = 1;
        for (let k = 1; k <= 4; k++) {
          g.strokeStyle = `rgba(255,255,255,${k === 4 ? 0.35 : 0.12})`;
          g.setLineDash(k === 4 ? [5, 5] : []);
          g.beginPath(); g.arc(hx, hy, (m * k) / 4, 0, TAU); g.stroke();
        }
        g.setLineDash([]);
        g.font = `600 ${Math.max(10, s * 0.3)}px system-ui, sans-serif`; g.fillStyle = 'rgba(255,255,255,.55)'; g.textAlign = 'left'; g.textBaseline = 'middle';
        for (let k = 1; k <= 4; k++) g.fillText(k === 4 ? `${V_COVEKA_KMH} km/h` : String((V_COVEKA_KMH * k) / 4), hx + (m * k) / 4 + 3, hy - 7);
        if (!vucenje) {
          // poziv: pulsirajući krug oko čoveka
          const p = (vreme % 1.4) / 1.4;
          g.strokeStyle = `rgba(255,209,102,${0.8 * (1 - p)})`; g.lineWidth = 3;
          g.beginPath(); g.arc(hx, hy, s * 0.5 + p * m * 0.5, 0, TAU); g.stroke();
        }
      }
      if (vucenje) strelicaVektora(hx, hy, vucenje.x, vucenje.y, op.boja || '#ffd166', !trka, s);
      // ljudi
      if (trka) {
        for (const e of trka.lista) {
          const [x, y] = sxy(e.c[0], e.c[1]);
          crtajCoveka(g, x, y, e.ugao, e.fc, s * 0.85, e.boja, !e.pao, e.pao, e.avatar || op.avatar);
          if (e.pao && !e.glavna) pilula(g, `${broj(e.sim.t, 1)} s`, x, y + s * 0.5, 'rgba(0,0,0,.65)', '#fff', Math.max(10, s * 0.26));
        }
      } else {
        crtajCoveka(g, hx, hy, vucenje ? Math.atan2(vucenje.y, vucenje.x) : -Math.PI / 2, 0, s * 0.85, op.boja || '#74b9ff', false, false, op.avatar);
      }
      // raptori
      const glavna = trka?.lista.find((e) => e.glavna);
      sc.raptori.forEach((r, j) => {
        let p = [r.x, r.y], u, f = 0, trci = false;
        if (glavna) { const R = glavna.rap[j]; p = R.p; u = R.u; f = R.f; trci = R.trci && !glavna.pao; }
        else u = Math.atan2(sc.covek[1] - r.y, sc.covek[0] - r.x);
        const [x, y] = sxy(p[0], p[1]);
        crtajRaptora(g, x, y, u, f, s, r.tip, trci, vreme + j * 1.7, 0.7 + 0.3 * Math.sin(vreme * 4));
        const oznaka = `${r.tip === 'povredjen' ? '🩹 ' : r.tip === 'napredni' ? '⚡ ' : ''}${r.v} km/h`;
        // oznake brzine samo pre trke (posle bi se preklapale kad se raptori skupe)
        const a = trka ? Math.max(0, 1 - trka.T / 0.8) : 0.95;
        if (a <= 0) return;
        g.globalAlpha = a;
        pilula(g, oznaka, x, y - s * 0.55, r.tip === 'napredni' ? 'rgba(40,30,120,.85)' : r.tip === 'povredjen' ? 'rgba(70,64,45,.85)' : 'rgba(90,50,15,.85)', '#fff', Math.max(10, s * 0.3));
        g.globalAlpha = 1;
      });
      // talasi ulova
      talasi = talasi.filter((t) => vreme - t.t < 0.9);
      for (const t of talasi) {
        const p = (vreme - t.t) / 0.9;
        if (p < 0) continue;
        const [x, y] = sxy(t.x, t.y);
        g.strokeStyle = t.b; g.globalAlpha = 1 - p; g.lineWidth = t.mali ? 2 : 5;
        g.beginPath(); g.arc(x, y, (t.mali ? s * 0.6 : s * 1.8) * Math.sqrt(p) + 4, 0, TAU); g.stroke();
        g.globalAlpha = 1;
      }
      g.restore();
      // štoperica
      if (trka) {
        const glavnaT = glavna ? Math.min(trka.T, glavna.sim.t) : trka.T;
        const v = Math.max(16, Math.min(40, W * 0.06));
        g.font = `800 ${v}px system-ui, sans-serif`; g.textAlign = 'left'; g.textBaseline = 'top';
        g.fillStyle = 'rgba(0,0,0,.45)'; g.fillText(`⏱ ${broj(glavnaT, 1)} s`, 14, 12);
        g.fillStyle = glavna?.pao ? '#ff7675' : '#fff'; g.fillText(`⏱ ${broj(glavnaT, 1)} s`, 12, 10);
      }
    }

    function linija(pts, boja, a, w) {
      if (pts.length < 2) return;
      g.globalAlpha = a; g.strokeStyle = boja; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round';
      g.beginPath();
      pts.forEach(([x, y], i) => { const [sx, sy] = sxy(x, y); i ? g.lineTo(sx, sy) : g.moveTo(sx, sy); });
      g.stroke(); g.globalAlpha = 1;
    }

    function strelicaVektora(x, y, dx, dy, boja, oznaka, s) {
      const d = Math.hypot(dx, dy);
      if (d < 4) return;
      const ux = dx / d, uy = dy / d;
      // tačkasta produžena linija (nišan)
      g.setLineDash([2, 8]); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(x + dx, y + dy); g.lineTo(x + ux * Math.max(W, H) * 1.5, y + uy * Math.max(W, H) * 1.5); g.stroke(); g.setLineDash([]);
      const gr = g.createLinearGradient(x, y, x + dx, y + dy);
      gr.addColorStop(0, 'rgba(255,255,255,.25)'); gr.addColorStop(1, boja);
      const glava = Math.min(22, d * 0.45);
      g.strokeStyle = gr; g.lineWidth = 7; g.lineCap = 'round';
      g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 6;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx - ux * glava * 0.7, y + dy - uy * glava * 0.7); g.stroke();
      g.fillStyle = boja;
      g.beginPath(); g.moveTo(x + dx, y + dy);
      g.lineTo(x + dx - ux * glava - uy * glava * 0.6, y + dy - uy * glava + ux * glava * 0.6);
      g.lineTo(x + dx - ux * glava + uy * glava * 0.6, y + dy - uy * glava - ux * glava * 0.6);
      g.closePath(); g.fill(); g.shadowBlur = 0;
      if (oznaka) {
        const kmh = Math.round((d / RMAX()) * V_COVEKA_KMH);
        pilula(g, `${d / RMAX() > 0.97 ? V_COVEKA_KMH : kmh} km/h`, x + dx + ux * 30, y + dy + uy * 24, 'rgba(0,0,0,.7)', '#fff', Math.max(12, s * 0.4));
      }
    }

    function petlja(sad) {
      if (unisten) return;
      raf = requestAnimationFrame(petlja);
      if (!cv.isConnected) return;
      const dt = Math.min(0.05, (sad - prosli) / 1000);
      prosli = sad; vreme += dt;
      velicina();
      if (trka) {
        trka.T = (sad - trka.t0) / 1000;
        korakTrke(trka.T, dt);
        if (!trka.gotovo && trka.T >= trka.kraj) { trka.gotovo = true; setTimeout(() => trka?.resi(), 700); }
      }
      crtaj(dt);
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => velicina()) : null;
    ro?.observe(el);
    velicina();
    raf = requestAnimationFrame(petlja);

    return {
      // igrač povlači vektor; po puštanju se poziva fn(ugao, jacina)
      vuci(fn) { naIzbor = fn; zakljucano = false; vucenje = null; cv.classList.add('vuci'); },
      // trka: lista = [{ ugao, jacina, boja, avatar, glavna }] – glavna vodi sa sobom raptore; vraća Promise na kraju
      pusti(lista) {
        naIzbor = null; cv.classList.remove('vuci');
        tragovi = []; prasina = []; talasi = [];
        if (!lista.some((e) => e.glavna) && lista.length) lista[0].glavna = true;
        const L = lista.map((e) => {
          const sim = simuliraj(sc, e.ugao, e.jacina, true);
          return { ...e, sim, c: sc.covek, put: [], fc: 0, korak: 0, pao: false,
            rap: sc.raptori.map((r) => ({ tip: r.tip, p: [r.x, r.y], u: Math.atan2(sc.covek[1] - r.y, sc.covek[0] - r.x), f: 0, korak: 0, put: [], trci: false })) };
        });
        // strelica izbora ostaje vidljiva još tren posle puštanja
        if (vucenje) setTimeout(() => (vucenje = null), 350);
        return new Promise((resi) => {
          trka = { lista: L, t0: performance.now(), T: 0, kraj: Math.max(...L.map((e) => e.sim.t)) + 0.4, gotovo: false, resi };
        });
      },
      najbolje(nb) { zlatna = nb ? { ...simuliraj(sc, nb.ugao, nb.jacina, true), t: nb.t } : null; },
      unisti() { unisten = true; cancelAnimationFrame(raf); ro?.disconnect(); cv.remove(); },
    };
  }

  return { simuliraj, najbolje, napravi, opis, objasni, scena, strelica, broj, V_COVEKA_KMH };
});
