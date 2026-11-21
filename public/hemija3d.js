// 3D scene iz hemije (medij „hemija“): atom, jonska veza, kovalentna veza, reakcije, metalna veza, rastvaranje, pH skala.
// Sve se crta na canvasu (3D rotacija prevlačenjem prsta, dodir bez prevlačenja pokreće animaciju iz početka).
// Molekuli dolaze iz biblioteke public/molekuli.js (SMILES → geometrija), a 3D pomoćnici iz public/mediji.js.
//
//   { "vrsta": "hemija", "scena": "atom", "z": 11, "naboj": 0, "jezgro": false, "brojevi": true, "istakni": "valentna", "natpis": true }
//   { "vrsta": "hemija", "scena": "jonska", "metal": 11, "nemetal": 17 }
//   { "vrsta": "hemija", "scena": "kovalentna", "ime": "voda" }
//   { "vrsta": "hemija", "scena": "reakcija", "reaktanti": [["vodonik", 2], ["kiseonik", 1]], "proizvodi": [["voda", 2]],
//     "uslov": "t", "efekat": "plamen", "bezJednacine": false }
//   { "vrsta": "hemija", "scena": "metalna", "metal": "Cu", "struja": true }
//   { "vrsta": "hemija", "scena": "rastvaranje", "tip": "so" | "secer" | "ulje" | "kiselina" }
//   { "vrsta": "hemija", "scena": "ph", "vrednost": 3, "indikator": "univerzalni", "supstance": ["limun"], "bezBroja": true }
(function () {
  'use strict';
  const NODE = typeof window === 'undefined';
  const MO = NODE ? require('./molekuli.js') : window.Molekuli;
  const MD = () => window.Mediji;

  const lerp = (a, b, u) => a + (b - a) * u;
  const ogr = (v, a, b) => Math.max(a, Math.min(b, v));
  const glatko = (u) => { u = ogr(u, 0, 1); return u * u * (3 - 2 * u); };
  const dod = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const odu = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mno = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const duz = (a) => Math.hypot(a[0], a[1], a[2]);
  const lerp3 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
  const slucajni = (seme = 7) => { let s = seme >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sub = (n) => String(n).split('').map((c) => SUB[+c]).join('');
  const sup = (n) => String(n).split('').map((c) => SUP[+c]).join('');
  const nabojTekst = (q) => (Math.abs(q) > 1 ? sup(Math.abs(q)) : '') + (q > 0 ? '⁺' : '⁻');
  const nCrtaj = (q) => (Math.abs(q) > 1 ? Math.abs(q) : '') + (q > 0 ? '+' : '−');

  const SCENE_IMENA = ['atom', 'jonska', 'kovalentna', 'reakcija', 'metalna', 'rastvaranje', 'ph', 'periodni'];

  // ───────────────────────── reakcije: provera i priprema (radi i u Node-u) ─────────────────────────
  function brojElemenata(lista) {
    const r = {};
    for (const [ime, n] of lista) {
      const d = MO.dohvati(ime);
      if (!d) throw new Error('nepoznat molekul: ' + ime);
      for (const a of d.atomi) r[a[0]] = (r[a[0]] || 0) + (n || 1);
    }
    return r;
  }
  function proveriReakciju(m) {
    if (m.otvoreno) return null; // polimerizacija i sl. (krajevi lanca nisu prikazani)
    const l = brojElemenata(m.reaktanti || []), d = brojElemenata(m.proizvodi || []);
    const el = new Set([...Object.keys(l), ...Object.keys(d)]);
    const lose = [...el].filter((e) => (l[e] || 0) !== (d[e] || 0));
    return lose.length ? 'jednačina nije izjednačena (' + lose.map((e) => `${e}: ${l[e] || 0} → ${d[e] || 0}`).join(', ') + ')' : null;
  }
  const formulaMol = (ime) => MO.dohvati(ime)?.f || ime;
  const jednacinaTekst = (m) => {
    const str = (lista) => lista.map(([ime, n]) => (n > 1 ? n : '') + formulaMol(ime)).join(' + ');
    return `${str(m.reaktanti)} →${m.uslov ? '(' + m.uslov + ')' : ''} ${str(m.proizvodi)}`;
  };

  if (NODE) {
    module.exports = { SCENE: SCENE_IMENA, proveriReakciju, jednacinaTekst };
    return;
  }

  // dopuna boja elemenata (mediji.js ima samo osnovne)
  for (const [e, o] of Object.entries(MO.BOJE_ELEMENATA)) if (!MD().ATOMI[e]) MD().ATOMI[e] = o;
  // molekuli iz biblioteke koji se mogu zadati po imenu u mediju „molekul“
  for (const ime of MO.IMENA) if (!MD().MOLEKULI[ime]) Object.defineProperty(MD().MOLEKULI, ime, { get: () => MO.dohvati(ime), enumerable: false, configurable: true });


  // ───────────────────────── stilovi (ubacuju se jednom) ─────────────────────────
  (function () {
    if (document.getElementById('hem-stil')) return;
    const st = document.createElement('style');
    st.id = 'hem-stil';
    st.textContent = `
.hem-natpis { font-size: .85em; color: var(--blago, #9fb3c8); padding: 4px 12px 8px; min-height: 2.4em; }
.hem-jednacina { padding: 6px 10px 0; font-size: 1.05em; }
.hem-ph { position: relative; padding: 46px 18px 8px; }
.hem-ph-traka { position: relative; height: 26px; border-radius: 13px; box-shadow: inset 0 0 0 2px #fff3; }
.hem-ph-broj { position: absolute; top: 5px; transform: translateX(-50%); font-size: 11px; font-weight: 700; color: #0b1826; text-shadow: 0 0 3px #fff9; }
.hem-ph-oblasti { display: flex; justify-content: space-between; font-size: .72em; color: var(--blago, #9fb3c8); padding: 5px 0 0; }
.hem-ph-marker { position: absolute; top: 4px; transform: translateX(-50%); transition: left 1.6s cubic-bezier(.3,.7,.3,1); text-align: center; line-height: 1; }
.hem-ph-marker b { display: block; background: #fff; color: #0b1826; border-radius: 8px; padding: 2px 8px; font-size: 12px; white-space: nowrap; }
.hem-ph-marker span { display: block; color: #fff; font-size: 14px; margin-top: 1px; }
.hem-ph-supstanca { position: absolute; top: 2px; transform: translateX(-50%); text-align: center; line-height: 1.05; }
.hem-ph-supstanca .em { display: block; font-size: 24px; }
.hem-ph-supstanca .nz { display: block; font-size: 10px; color: #fff; max-width: 74px; }
.hem-ps { display: grid; grid-template-columns: 14px repeat(18, 1fr); gap: 2px; padding: 8px 8px 4px; font-size: 9.5px; }
.hem-ps .c { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 3px; color: #0b1826; font-weight: 700; line-height: 1; min-width: 0; transition: opacity .4s; }
.hem-ps .nbr { color: #9fb3c8; font-size: 8.5px; display: flex; align-items: center; justify-content: center; }
.hem-ps .c.tamno { opacity: .22; }
.hem-ps .c.ist { box-shadow: 0 0 0 2px #fff, 0 0 8px 2px #ffd166; animation: hem-puls 1.4s infinite; z-index: 1; }
@keyframes hem-puls { 50% { box-shadow: 0 0 0 2px #ffd166, 0 0 14px 4px #ffd166; } }
.hem-leg { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 10px; padding: 2px 8px 6px; font-size: .72em; color: #9fb3c8; }
.hem-leg i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 4px; vertical-align: -1px; }`;
    document.head.appendChild(st);
  })();

  // ───────────────────────── zajedničko ─────────────────────────
  function sfera(g, x, y, r, boja, alfa = 1) {
    const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    gr.addColorStop(0, '#ffffff');
    gr.addColorStop(0.25, boja);
    gr.addColorStop(1, MD().shade(boja, -0.55));
    g.globalAlpha = alfa;
    g.fillStyle = gr;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 1;
  }
  const proj = (p, ax, ay, w, h, sk) => {
    const [x, y, z] = MD().rotiraj(p, ax, ay);
    const f = 1 / (1 + z * 0.06);
    return { x: w / 2 + x * sk * f, y: h / 2 + y * sk * f, z, f, zp: z * sk };
  };
  // kugla i veza (jednostruka/dvostruka/trostruka) za Scena3D, iz projektovanih tačaka
  const kugla = (p, r, boja, alfa) => ({ x: p.x, y: p.y, z: p.zp, r, boja, alfa });
  function vezaValjci(out, A, B, red, sk, bA, bB, alfa = 1) {
    const f = (A.f + B.f) / 2;
    const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    const r = (red > 1 ? 0.062 : 0.1) * sk * f, raz = (red > 2 ? 0.15 : 0.19) * sk * f;
    for (let q = 0; q < red; q++) {
      const o = (q - (red - 1) / 2) * raz;
      out.push({ a: [A.x + nx * o, A.y + ny * o, A.zp], b: [B.x + nx * o, B.y + ny * o, B.zp], r, boja: bA, boja2: bB, alfa });
    }
  }
  function natpisDiv(k, klasa = 'hem-natpis') {
    const d = document.createElement('div');
    d.className = klasa;
    k.appendChild(d);
    return d;
  }
  function postavi(d, html) { if (d._h !== html) { d._h = html; d.innerHTML = html; } }
  // vreme animacije: ciklus T + pauza; dodir (bez prevlačenja) pokreće iz početka
  function sat(cv, T, P = 2) {
    let t0 = null, dole = null;
    cv.addEventListener('pointerdown', (e) => { dole = [e.clientX, e.clientY]; });
    cv.addEventListener('click', (e) => { if (!dole || Math.hypot(e.clientX - dole[0], e.clientY - dole[1]) < 6) t0 = null; });
    return (ms) => {
      if (t0 === null) t0 = ms;
      let t = (ms - t0) / 1000;
      if (t > T + P) { t0 = ms; t = 0; }
      return Math.min(t, T);
    };
  }
  function legenda(k, elementi, m = {}) {
    if (m.legenda === false) return;
    const l = document.createElement('div');
    l.className = 'legenda';
    l.innerHTML = elementi.map((e) => `<span><i style="background:${MD().ATOMI[e]?.boja || '#ccc'}"></i>${m.skrijImena ? `<span data-lat>${e}</span>` : MD().ATOMI[e]?.ime || e}</span>`).join('');
    k.appendChild(l);
  }
  function oznaka(g, tekst, x, y, boja = '#fff', vel = 12) {
    g.font = `bold ${vel}px system-ui`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 3; g.strokeStyle = '#0b1826'; g.strokeText(tekst, x, y);
    g.fillStyle = boja; g.fillText(tekst, x, y);
  }

  // ───────────────────────── atom (Borov model u 3D) ─────────────────────────
  const R0 = 0.75, DR = 0.55;
  const ringR = (i) => R0 + DR * i;
  function bazaPrstena(i) {
    const al = 0.35 + 0.5 * i, be = i * 1.1, c = Math.cos(al), s = Math.sin(al), cb = Math.cos(be), sb = Math.sin(be);
    return [[cb, sb, 0], [-sb * c, cb * c, s]];
  }
  const ELEK = '#74b9ff', ELEK_V = '#ffd166';
  function elPoz(a, i, j, n, t) {
    const [e1, e2] = bazaPrstena(i);
    const th = (2 * Math.PI * j) / n + (i % 2 ? -1 : 1) * (1.5 / (1 + 0.6 * i)) * t + i * 0.7;
    const r = ringR(i) * (a.skala || 1);
    return dod(a.c, mno(dod(mno(e1, Math.cos(th)), mno(e2, Math.sin(th))), r));
  }
  function jezgroTacke(z, a) {
    const A = a || MASE_Z(z), p = z, nn = Math.max(0, A - z), uk = p + nn;
    const f = uk > 40 ? 40 / uk : 1, np = Math.max(1, Math.round(p * f)), nnn = Math.round(nn * f);
    const rnd = slucajni(z * 31 + 5), tacke = [];
    const rho = 0.11 * Math.cbrt(np + nnn) + 0.04;
    for (let i = 0; i < np + nnn; i++) {
      const u = rnd() * 2 - 1, fi = rnd() * Math.PI * 2, rr = rho * Math.cbrt(rnd()), s = Math.sqrt(1 - u * u);
      tacke.push({ p: [rr * s * Math.cos(fi), rr * u, rr * s * Math.sin(fi)], proton: i % 2 === 0 ? i / 2 < np : false });
    }
    // proton/neutron naizmenično, pa ostatak
    let pi = 0, ni = 0;
    return tacke.map((t, i) => { const proton = (i % 2 === 0 && pi < np) || ni >= nnn; if (proton) pi++; else ni++; return { p: t.p, proton }; });
  }
  const MASE_Z = (z) => ({ 1: 1, 2: 4, 3: 7, 4: 9, 5: 11, 6: 12, 7: 14, 8: 16, 9: 19, 10: 20, 11: 23, 12: 24, 13: 27, 14: 28, 15: 31, 16: 32, 17: 35, 18: 40, 19: 39, 20: 40 }[z] || Math.round(z * 2.1));

  // crta „svet“ atoma: { atomi: [{ c, ljuske, q, z, jezgro, oznaka, skala, istaknuta }], letece: [{ p }] }
  function crtajSvet(g, w, h, ax, ay, t, svet, sk, o = {}) {
    g.clearRect(0, 0, w, h);
    const P = (p) => proj(p, ax, ay, w, h, sk);
    const kugle = [], valjci = [], oreoli = [], natpisi = [], uvek = [];
    const rEl = (p) => 4.6 * p.f * Math.max(0.8, sk / 50);
    for (const a of svet.atomi) {
      const sc = a.skala || 1;
      a.ljuske.forEach((n, i) => {
        const [e1, e2] = bazaPrstena(i);
        const val = i === a.ljuske.length - 1 && o.istakni === 'valentna';
        // prsten (orbita) od tankih ravnih valjaka – sa dubinom, pa ga jezgro zaklanja kad je iza
        let pr = null;
        for (let s = 0; s <= 64; s++) {
          const th = (s / 64) * Math.PI * 2;
          const p = P(dod(a.c, mno(dod(mno(e1, Math.cos(th)), mno(e2, Math.sin(th))), ringR(i) * sc)));
          if (pr) valjci.push({ a: [pr.x, pr.y, pr.zp], b: [p.x, p.y, p.zp], r: val ? 1 : 0.6, boja: val ? '#ffd166' : '#ffffff', alfa: val ? 0.75 : 0.3, ravno: true });
          pr = p;
        }
        for (let j = 0; j < n; j++) {
          const p = P(elPoz(a, i, j, n, t));
          kugle.push(kugla(p, rEl(p), val ? ELEK_V : ELEK));
        }
        if (o.brojevi) {
          const p = P(dod(a.c, mno(e1, ringR(i) * sc)));
          uvek.push([String(n), p.x + 11, p.y - 9, val ? ELEK_V : '#cfe8ff', 11]);
        }
      });
      // jezgro
      const pc = P(a.c);
      if (a.jezgro) {
        for (const q of a.jezgro) {
          const p = P(dod(a.c, q.p));
          kugle.push(kugla(p, Math.max(3, 0.1 * sk * p.f), q.proton ? '#ff6b6b' : '#b2bec3'));
        }
      } else {
        const rj = (0.3 + 0.012 * a.ljuske.length) * sk * pc.f * sc;
        kugle.push(kugla(pc, rj, '#e17055'));
        if (a.oznaka) natpisi.push([a.oznaka, pc.x, pc.y, '#fff', Math.max(10, rj * 0.9), pc.zp - rj]);
      }
      if (a.q) {
        const R = ringR(a.ljuske.length - 1) * sc;
        const p = P(dod(a.c, [R * 0.75, -R * 0.8, 0]));
        uvek.push([nCrtaj(a.q), p.x, p.y, a.q > 0 ? '#ff7675' : '#74b9ff', 17]);
      }
      if (a.natpis) {
        const R = ringR(a.ljuske.length - 1) * sc;
        const p = P(dod(a.c, [0, R + 0.5, 0]));
        uvek.push([a.natpis, p.x, p.y, '#cfe8ff', 13]);
      }
    }
    for (const e of svet.letece || []) {
      const p = P(e.p);
      oreoli.push({ x: p.x, y: p.y, z: p.zp, r: 13 * p.f, boja: ELEK_V, alfa: 0.55 });
      kugle.push(kugla(p, 4.8 * p.f * Math.max(0.8, sk / 50), ELEK_V));
    }
    window.Scena3D.crtaj(g, w, h, { kugle, valjci, oreoli });
    for (const [tk, x, y, b, v, z] of natpisi) if (!window.Scena3D.zaklonjen(x, y, z, kugle)) oznaka(g, tk, x, y, b, v);
    for (const [tk, x, y, b, v] of uvek) oznaka(g, tk, x, y, b, v);
  }

  function atom(k, m) {
    const z = +m.z || 1, q = +m.naboj || 0;
    const ljuske = m.ljuske || MO.konfiguracija(z, q);
    const sim = MO.SIMBOLI[z] || '?';
    const { cv, g, w, h } = MD().platno(k, m.visina || 270);
    const a = { c: [0, 0, 0], ljuske, q, z, jezgro: m.jezgro ? jezgroTacke(z, m.masa) : null, oznaka: m.jezgro ? null : (m.oznaka === false ? null : `${z}+`) };
    if (m.simbol) a.oznaka = sim;
    const sk = (Math.min(w, h) / 2 - 8) / (ringR(ljuske.length - 1) + 0.4);
    if (m.natpis !== false) {
      const nat = natpisDiv(k);
      const e = ljuske.reduce((s, x) => s + x, 0);
      postavi(nat, `<b class="formula-mala">${sim}${q ? nabojTekst(q) : ''}</b> · ~redni broj ${z} · ~elektrona: ${e} · ~elektronski omotači: ${ljuske.join(' | ')}`.replace(/~/g, ''));
    }
    return MD().okretanje(cv, (ax, ay, ms) => crtajSvet(g, w, h, ax, ay, ms / 1000, { atomi: [a] }, sk, m), { brzina: 0.004 });
  }

  // ───────────────────────── jonska veza ─────────────────────────
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  function formulaSoli(sM, nM, sN, nN) { return sM + (nM > 1 ? sub(nM) : '') + sN + (nN > 1 ? sub(nN) : ''); }
  function jonska(k, m) {
    const zM = +m.metal, zN = +m.nemetal;
    const kM = MO.konfiguracija(zM), kN = MO.konfiguracija(zN);
    const v = kM[kM.length - 1];
    const need = kN.length === 1 ? 2 - kN[0] : 8 - kN[kN.length - 1];
    const d = gcd(v, need), nM = need / d, nN = v / d;
    const sM = MO.SIMBOLI[zM], sN = MO.SIMBOLI[zN];
    // raspored u nizu
    const niz = [];
    if (nN > nM) for (let i = 0; i < nN + nM; i++) niz.push(i % 2 === 0 ? 'N' : 'M');
    else if (nM > nN) for (let i = 0; i < nN + nM; i++) niz.push(i % 2 === 0 ? 'M' : 'N');
    else niz.push('M', 'N');
    const SP = 3.3;
    const atomi = niz.map((tip, i) => ({
      tip, x: (i - (niz.length - 1) / 2) * SP, ljuske: (tip === 'M' ? kM : kN).slice(), z: tip === 'M' ? zM : zN, sim: tip === 'M' ? sM : sN, skala: niz.length > 3 ? 0.8 : 0.92,
    }));
    // prenosi elektrona
    const potreba = atomi.map((a) => (a.tip === 'N' ? need : 0));
    const prenosi = [];
    let red = 0;
    atomi.forEach((a, i) => {
      if (a.tip !== 'M') return;
      for (let e = 0; e < v; e++) {
        let naj = -1, dm = 1e9;
        atomi.forEach((b, j) => { if (b.tip === 'N' && potreba[j] > 0 && Math.abs(a.x - b.x) < dm) { dm = Math.abs(a.x - b.x); naj = j; } });
        potreba[naj]--;
        prenosi.push({ od: i, ka: naj, t0: 1.8 + red * 0.55, dur: 1.2, slot: e });
        red++;
      }
    });
    const tKraj = Math.max(...prenosi.map((p) => p.t0 + p.dur));
    const tPriv = tKraj + 0.3, T = tPriv + 4.2 + 1.2;
    const { cv, g, w, h } = MD().platno(k, m.visina || 270);
    const nat = natpisDiv(k);
    const ukupno = (niz.length - 1) * SP * 1.3 + 2 * ringR(Math.max(kM.length, kN.length) - 1) * 0.92;
    const sk = Math.min(w / ukupno, (h / 2 - 6) / (ringR(Math.max(kM.length, kN.length) - 1) + 0.5));
    const vreme = sat(cv, T);
    const formula = formulaSoli(sM, nM, sN, nN);
    return MD().okretanje(cv, (ax, ay, ms) => {
      const t = vreme(ms);
      const razmak = lerp(1.3, 1, glatko(t / 1.4)) * lerp(1, 0.86, glatko((t - tPriv) / 1.8));
      const svet = { atomi: [], letece: [] };
      const ljuskeT = atomi.map((a) => a.ljuske.slice());
      const odd = atomi.map(() => 0);
      for (const p of prenosi) {
        const A = atomi[p.od], B = atomi[p.ka];
        if (t >= p.t0) { odd[p.od]++; ljuskeT[p.od][ljuskeT[p.od].length - 1]--; }
        if (t >= p.t0 + p.dur) { ljuskeT[p.ka][ljuskeT[p.ka].length - 1]++; }
      }
      const prim = atomi.map(() => 0);
      for (const p of prenosi) if (t >= p.t0 + p.dur) prim[p.ka]++;
      atomi.forEach((a, i) => {
        const ls = ljuskeT[i].filter((x, idx) => x > 0 || idx < ljuskeT[i].length - 1);
        const q = a.tip === 'M' ? odd[i] - prim[i] * 0 : -prim[i];
        const donor = a.tip === 'M' ? prenosi.filter((p) => p.od === i && t >= p.t0 + p.dur).length : 0;
        svet.atomi.push({
          c: [a.x * razmak, 0, 0], ljuske: ls, z: a.z, skala: a.skala, oznaka: a.sim,
          q: a.tip === 'M' ? donor : -prim[i],
          natpis: null,
        });
      });
      // elektroni u letu
      for (const p of prenosi) {
        if (t < p.t0 || t >= p.t0 + p.dur) continue;
        const u = glatko((t - p.t0) / p.dur);
        const A = svet.atomi[p.od], B = svet.atomi[p.ka];
        const iA = atomi[p.od].ljuske.length - 1, iB = B.ljuske.length - 1;
        const nA = Math.max(1, atomi[p.od].ljuske[iA]);
        const pa = elPoz(atomi[p.od].tip === 'M' ? { c: A.c, skala: A.skala } : A, iA, p.slot % nA, nA, t);
        const nB = Math.max(1, B.ljuske[iB] + 1);
        const pb = elPoz({ c: B.c, skala: B.skala }, iB, B.ljuske[iB] % nB, nB, t);
        const pt = lerp3(pa, pb, u);
        pt[1] -= Math.sin(u * Math.PI) * 1.1;
        svet.letece.push({ p: pt });
      }
      crtajSvet(g, w, h, ax, ay, t, svet, sk, { istakni: 'valentna', brojevi: false });
      const faza = t < 1.6 ? 1 : t < tKraj ? 2 : t < tPriv + 2 ? 3 : 4;
      const tekst = {
        1: `1. ~Atom metala (${sM}) i atom nemetala (${sN}) se približavaju`,
        2: `2. ~Metal otpušta valentne elektrone, a nemetal ih prima – popunjava spoljašnji omotač`,
        3: `3. ~Nastali joni suprotnih naboja se privlače`,
        4: `4. ~Jonska veza: ${m.bezFormule ? '?' : formula}`,
      }[faza].replace(/~/g, '');
      postavi(nat, tekst);
    }, { brzina: 0.003 });
  }

  // ───────────────────────── kovalentna veza (Luisove tačke) ─────────────────────────
  const VAL_EL = { H: 1, C: 4, N: 5, O: 6, F: 7, Cl: 7, Br: 7, I: 7, S: 6, P: 5, Si: 4 };
  function ravanski(atomi) {
    // bira projekciju 3D molekula na ravan sa najmanjim preklapanjem atoma
    let naj = null, najV = -1;
    for (const ay of [0, 0.3, 0.6, 0.9, 1.2, 1.5]) for (const ax of [0, 0.4, 0.8, -0.4]) {
      const p = atomi.map((a) => MD().rotiraj([a[1], a[2], a[3]], ax, ay));
      let mn = 1e9;
      for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) mn = Math.min(mn, Math.hypot(p[i][0] - p[j][0], p[i][1] - p[j][1]));
      if (mn > najV + 1e-6) { najV = mn; naj = p; }
    }
    return naj.map((p) => [p[0], p[1]]);
  }
  function kovalentna(k, m) {
    const d = MO.dohvati(m.ime);
    if (!d) return () => {};
    const P0 = d.atomi.length === 1 ? [[0, 0]] : ravanski(d.atomi);
    // razmera: najkraća veza = 1,6 jedinica
    let minV = 1e9;
    for (const [i, j] of d.veze) minV = Math.min(minV, Math.hypot(P0[i][0] - P0[j][0], P0[i][1] - P0[j][1]));
    const sc = minV < 1e8 ? 1.7 / minV : 1;
    const cx = P0.reduce((s, p) => s + p[0], 0) / P0.length, cy = P0.reduce((s, p) => s + p[1], 0) / P0.length;
    const poz = P0.map((p) => [(p[0] - cx) * sc, (p[1] - cy) * sc]);
    const ext = Math.max(1.3, ...poz.map((p) => Math.hypot(p[0], p[1]))) + 1.3;
    const { cv, g, w, h } = MD().platno(k, m.visina || 270);
    const nat = natpisDiv(k);
    const sk = Math.min(w, h) / 2 / ext * 0.98;
    const n = d.atomi.length;
    // elektroni: koliko je zajedničkih, koliko slobodnih
    const sumRed = d.atomi.map(() => 0);
    d.veze.forEach(([i, j, r = 1]) => { sumRed[i] += r; sumRed[j] += r; });
    const ugaoVeze = d.atomi.map(() => []);
    d.veze.forEach(([i, j]) => { const a = Math.atan2(poz[j][1] - poz[i][1], poz[j][0] - poz[i][0]); ugaoVeze[i].push(a); ugaoVeze[j].push(a + Math.PI); });
    const razl = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
    const slobodni = d.atomi.map((a, i) => {
      const val = VAL_EL[a[0]] ?? 4, q = a[4]?.q || 0;
      const sl = Math.max(0, val - q - sumRed[i]);
      // položaji parova/pojedinačnih elektrona na slobodnim uglovima
      const kand = [];
      for (let s = 0; s < 8; s++) kand.push((s * Math.PI) / 4);
      kand.sort((x, y) => Math.min(...ugaoVeze[i].map((v) => razl(y, v)), 9) - Math.min(...ugaoVeze[i].map((v) => razl(x, v)), 9));
      const par = Math.floor(sl / 2), jed = sl % 2, rez = [];
      for (let s = 0; s < par; s++) rez.push({ ug: kand[s], par: true });
      if (jed) rez.push({ ug: kand[par], par: false });
      return rez;
    });
    // početni elektroni oko svakog atoma (valentni), krajnji položaji
    const tacke = []; // {atom, pocetak:[x,y], kraj:[x,y], zajednicki, veza}
    const Rat = 0.62;
    const ring = (i, e, val) => { const a = (e / Math.max(val, 8)) * Math.PI * 2 + 0.4; return [poz[i][0] + Rat * Math.cos(a), poz[i][1] + Rat * Math.sin(a)]; };
    const brojac = d.atomi.map(() => 0);
    d.veze.forEach(([i, j, r = 1], vi) => {
      const mid = [(poz[i][0] + poz[j][0]) / 2, (poz[i][1] + poz[j][1]) / 2];
      const L = Math.hypot(poz[j][0] - poz[i][0], poz[j][1] - poz[i][1]) || 1;
      const ux = (poz[j][0] - poz[i][0]) / L, uy = (poz[j][1] - poz[i][1]) / L, px = -uy, py = ux;
      for (let pr = 0; pr < r; pr++) {
        const off = (pr - (r - 1) / 2) * 0.36;
        const c = [mid[0] + px * off, mid[1] + py * off];
        [[i, -1], [j, 1]].forEach(([at, s]) => {
          const val = VAL_EL[d.atomi[at][0]] ?? 4;
          tacke.push({ atom: at, pocetak: ring(at, brojac[at]++, val), kraj: [c[0] + ux * 0.11 * s, c[1] + uy * 0.11 * s], zaj: true, veza: vi });
        });
      }
    });
    slobodni.forEach((lista, i) => {
      const val = VAL_EL[d.atomi[i][0]] ?? 4;
      lista.forEach((s) => {
        const brE = s.par ? 2 : 1;
        for (let e = 0; e < brE; e++) {
          const ug = s.ug + (brE === 2 ? (e ? 0.2 : -0.2) : 0), R = 0.64;
          tacke.push({ atom: i, pocetak: ring(i, brojac[i]++, val), kraj: [poz[i][0] + R * Math.cos(ug), poz[i][1] + R * Math.sin(ug)], zaj: false });
        }
      });
    });
    const T = 8;
    const vreme = sat(cv, T);
    const imena = [...new Set(d.atomi.map((a) => a[0]))];
    legenda(k, imena, m);
    const redVeze = Math.max(...d.veze.map((v) => v[2] || 1), 1);
    const nazivVeze = { 1: 'jednostruka', 2: 'dvostruka', 3: 'trostruka' }[redVeze];
    const X = (x) => w / 2 + x * sk, Y = (y) => h / 2 + y * sk;
    function crtaj(ms) {
      const t = vreme(ms);
      g.clearRect(0, 0, w, h);
      const razmak = lerp(1.5, 1, glatko(t / 1.8));
      const pozT = poz.map((p) => [p[0] * razmak, p[1] * razmak]);
      const u = glatko((t - 2.2) / 1.6); // elektroni putuju ka krajnjim mestima
      // veze (tanke) kad se elektroni upare
      g.lineCap = 'round';
      d.veze.forEach(([i, j, r = 1]) => {
        g.strokeStyle = `rgba(138,143,163,${0.55 * u})`; g.lineWidth = 3;
        g.beginPath(); g.moveTo(X(pozT[i][0]), Y(pozT[i][1])); g.lineTo(X(pozT[j][0]), Y(pozT[j][1])); g.stroke();
      });
      // atomi
      d.atomi.forEach((a, i) => {
        const info = MD().ATOMI[a[0]] || { boja: '#ccc' };
        const r = (a[0] === 'H' ? 0.42 : 0.5) * sk;
        sfera(g, X(pozT[i][0]), Y(pozT[i][1]), r, info.boja, 0.95);
        oznaka(g, a[0], X(pozT[i][0]), Y(pozT[i][1]), a[0] === 'H' ? '#333' : '#fff', r * 0.95);
      });
      // elektroni
      const puls = 0.5 + 0.5 * Math.sin(t * 4);
      for (const e of tacke) {
        const sh = [pozT[e.atom][0] - poz[e.atom][0], pozT[e.atom][1] - poz[e.atom][1]];
        const a = [e.pocetak[0] + sh[0], e.pocetak[1] + sh[1]], b = [e.kraj[0] * razmak + (e.zaj ? 0 : sh[0] * 0), e.kraj[1] * razmak];
        const bb = e.zaj ? b : [e.kraj[0] + sh[0], e.kraj[1] + sh[1]];
        const p = [lerp(a[0], bb[0], u), lerp(a[1], bb[1], u)];
        const sjaj = e.zaj && u > 0.98;
        if (sjaj) { g.fillStyle = `rgba(255,209,102,${0.18 + 0.2 * puls})`; g.beginPath(); g.arc(X(p[0]), Y(p[1]), 9, 0, 7); g.fill(); }
        sfera(g, X(p[0]), Y(p[1]), 4.4, e.zaj ? ELEK_V : ELEK);
      }
      const faza = t < 2 ? 1 : t < 3.9 ? 2 : 3;
      postavi(nat, {
        1: '1. Atomi nemetala se približavaju (tačkice su valentni elektroni)',
        2: '2. Atomi dele elektrone u zajedničke elektronske parove',
        3: `3. Zajednički elektronski par drži atome zajedno: ${nazivVeze} kovalentna veza${n > 1 && !d.f ? '' : ' – ' + (m.bezFormule ? '?' : d.f)}`,
      }[faza]);
    }
    return MD().okretanje(cv, (ax, ay, ms) => crtaj(ms), { brzina: 0 });
  }

  // ───────────────────────── reakcija ─────────────────────────
  function raspored(n, s) {
    // n tačaka oko koordinatnog početka (3D)
    const T = [[], [[0, 0, 0]], [[-1, 0, 0], [1, 0, 0]], [[-1, -0.6, 0], [1, -0.6, 0], [0, 1, 0.4]], [[-1, -0.7, 0.5], [1, -0.7, -0.5], [-0.8, 0.9, -0.6], [0.9, 0.8, 0.6]]];
    if (T[n]) return T[n].map((p) => mno(p, s));
    const r = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, z = (i % 2 ? 0.7 : -0.7); r.push([Math.cos(a) * s * 1.3, Math.sin(a) * s * 0.9, z * s * 0.6]); }
    return r;
  }
  function pripremiReakciju(m) {
    const rnd = slucajni(11);
    const sastavi = (lista, strana) => {
      const mol = [];
      for (const [ime, n] of lista) for (let i = 0; i < (n || 1); i++) mol.push({ ime, d: MO.dohvati(ime) });
      mol.forEach((x) => {
        const at = x.d.atomi;
        const c = at.reduce((s, a) => dod(s, [a[1], a[2], a[3]]), [0, 0, 0]).map((v) => v / at.length);
        x.lokalno = at.map((a) => odu([a[1], a[2], a[3]], c));
        x.rot = [rnd() * 6.28, rnd() * 6.28];
        x.radius = Math.max(0.6, ...x.lokalno.map(duz)) + 0.5;
      });
      return mol;
    };
    const L = sastavi(m.reaktanti), D = sastavi(m.proizvodi);
    const sp = (lista) => Math.max(1.2, ...lista.map((x) => x.radius)) * (lista.length > 4 ? 1.15 : 1.05);
    const sL = sp(L), sD = sp(D);
    const kraj = Math.max(2.4, sL * 1.9, sD * 1.9);
    const pL = raspored(L.length, sL), pD = raspored(D.length, sD);
    L.forEach((x, i) => { x.start = dod(pL[i], [-kraj, 0, 0]); x.sudar = pL[i]; });
    D.forEach((x, i) => { x.sudar = pD[i]; x.kraj = dod(pD[i], [kraj, 0, 0]); });
    // atomi: lista sa mestima
    const atom = (x, strana) => x.lokalno.map((l, i) => ({ mol: x, i, e: x.d.atomi[i][0], q: x.d.atomi[i][4]?.q, l }));
    const aL = L.flatMap((x) => atom(x)), aD = D.flatMap((x) => atom(x));
    const rotLok = (p, [r1, r2]) => MD().rotiraj(p, r1 * 0.35, r2 * 0.35);
    aL.forEach((a) => { a.pSudar = dod(a.mol.sudar, rotLok(a.l, a.mol.rot)); a.pStart = dod(a.mol.start, rotLok(a.l, a.mol.rot)); });
    aD.forEach((a) => { a.pSudar = dod(a.mol.sudar, rotLok(a.l, a.mol.rot)); a.pKraj = dod(a.mol.kraj, rotLok(a.l, a.mol.rot)); });
    // dodela: proizvodni atom ← reaktantski atom istog elementa (najbliži)
    const par = [];
    for (const e of new Set(aL.map((a) => a.e))) {
      const l = aL.filter((a) => a.e === e), dd = aD.filter((a) => a.e === e);
      const parovi = [];
      for (const a of l) for (const b of dd) parovi.push([duz(odu(a.pSudar, b.pSudar)), a, b]);
      parovi.sort((x, y) => x[0] - y[0]);
      const zl = new Set(), zd = new Set();
      for (const [, a, b] of parovi) if (!zl.has(a) && !zd.has(b)) { zl.add(a); zd.add(b); par.push([a, b]); }
    }
    const veze = (lista, atomi) => lista.flatMap((x) => x.d.veze.map(([i, j, r = 1]) => ({ a: atomi.find((q) => q.mol === x && q.i === i), b: atomi.find((q) => q.mol === x && q.i === j), r })));
    // najveći raspon po x i y (početni i krajnji položaji molekula), da sve stane u platno
    const sviP = [...L.map((x) => [x.start, x.radius]), ...D.map((x) => [x.kraj, x.radius]), ...L.map((x) => [x.sudar, x.radius]), ...D.map((x) => [x.sudar, x.radius])];
    const extX = Math.max(...sviP.map(([p, r]) => Math.abs(p[0]) + r)), extY = Math.max(...sviP.map(([p, r]) => Math.abs(p[1]) + r));
    return { L, D, aL, aD, par, vL: veze(L, aL), vD: veze(D, aD), kraj, extX, extY };
  }

  function reakcija(k, m) {
    const gr = proveriReakciju(m);
    if (gr) console.warn('reakcija:', gr);
    const S = pripremiReakciju(m);
    const { cv, g, w, h } = MD().platno(k, m.visina || 280);
    const nat = natpisDiv(k);
    const jedn = natpisDiv(k, 'hem-jednacina');
    if (!m.bezJednacine) postavi(jedn, `<span class="formula-mala">${m.jednacina || jednacinaTekst(m)}</span>`);
    const sk = Math.min(w / 2 / (S.extX + 0.3), h / 2 / (S.extY + 0.3)) * 0.74;
    const T = m.trajanje || 10.5;
    const vreme = sat(cv, T);
    const imena = [...new Set([...S.aL, ...S.aD].map((a) => a.e))];
    legenda(k, imena, m);
    const tAprox = 2.4, tRaz = 3.4, tOdl = 5.6, tKr = 8.2;
    const efekat = m.efekat || null;
    const parZa = new Map(S.par.map(([a, b]) => [b, a]));
    return MD().okretanje(cv, (ax, ay, ms) => {
      const t = vreme(ms);
      g.clearRect(0, 0, w, h);
      const uA = glatko(t / tAprox), uR = glatko((t - tAprox) / (tRaz - tAprox)), uO = glatko((t - tRaz) / (tOdl - tRaz));
      const drhti = (t > 1.2 && t < tRaz + 0.3) ? 0.05 * Math.min(1, (t - 1.2) / 1.2) : 0;
      const tr = (i, s) => drhti * Math.sin(t * 31 + i * 7.3 + s);
      // položaj svakog atoma u trenutku t
      const pos = new Map();
      S.aL.forEach((a, i) => {
        const p = lerp3(a.pStart, a.pSudar, uA);
        pos.set(a, [p[0] + tr(i, 0), p[1] + tr(i, 1), p[2] + tr(i, 2)]);
      });
      // posle sudara atomi „reaktanata“ prelaze u proizvode: položaj atoma proizvoda
      S.aD.forEach((b, i) => {
        const a = parZa.get(b);
        const pSud = lerp3(pos.get(a) ? lerp3(a.pStart, a.pSudar, 1) : b.pSudar, b.pSudar, uR);
        const p = lerp3(pSud, b.pKraj, uO);
        pos.set(b, [p[0] + tr(i, 3) * (1 - uO), p[1] + tr(i, 4) * (1 - uO), p[2] + tr(i, 5) * (1 - uO)]);
      });
      const faza = t < tAprox ? 0 : t < tRaz ? 1 : t < tKr ? 2 : 3;
      // koji se atomi crtaju: do tRaz-sredine reaktanti, posle proizvodi (isti objekti tokom prelaza)
      const P = (p) => proj(p, ax, ay, w, h, sk);
      const alfaL = 1 - glatko((t - tAprox) / 0.7), alfaD = glatko((t - tAprox - 0.5) / 0.9);
      const kugle = [], valjci = [], natpisi = [];
      const boja = (e) => (MD().ATOMI[e] || { boja: '#ccc' }).boja;
      const veza = (v, alfa, mapa) => {
        if (alfa <= 0.01) return;
        vezaValjci(valjci, P(mapa(v.a)), P(mapa(v.b)), v.r, sk, boja(v.a.e), boja(v.b.e), alfa);
      };
      // veze reaktanata prate atome reaktanata (koji se kreću ka položajima proizvoda), veze proizvoda – atome proizvoda
      const mapaL = (a) => pos.get(S.par.find(([x]) => x === a)?.[1]) || pos.get(a);
      S.vL.forEach((v) => veza(v, t < tAprox ? 1 : alfaL, t < tAprox ? (a) => pos.get(a) : mapaL));
      S.vD.forEach((v) => veza(v, alfaD, (a) => pos.get(a)));
      // atomi: do sudara nacrtani kao reaktanti, posle – kao proizvodi (oblik/veličina isti, pa se ne vidi prelaz)
      const crtajAtom = (a, p) => {
        const q = P(p);
        const info = MD().ATOMI[a.e] || { boja: '#ccc', r: 0.5 };
        const r = info.r * sk * q.f * 0.8;
        kugle.push(kugla(q, r, info.boja));
        if (a.q && !(t >= tAprox && t < tAprox + 0.6)) natpisi.push([nCrtaj(a.q), q.x, q.y, a.q > 0 ? '#ff7675' : '#74b9ff', Math.max(12, r), q.zp - r]);
      };
      if (t < tAprox) S.aL.forEach((a) => crtajAtom(a, pos.get(a)));
      else S.aD.forEach((b) => crtajAtom(b, pos.get(b)));
      window.Scena3D.crtaj(g, w, h, { kugle, valjci });
      for (const [tk, x, y, b, v, z] of natpisi) if (!window.Scena3D.zaklonjen(x, y, z, kugle)) oznaka(g, tk, x, y, b, v);
      // sjaj pri preuređenju
      if (efekat && t > tAprox - 0.2 && t < tRaz + 1.2) {
        const u = (t - (tAprox - 0.2)) / (tRaz + 1.4 - (tAprox - 0.2));
        const c = P([0, 0, 0]);
        const gr2 = g.createRadialGradient(c.x, c.y, 0, c.x, c.y, 60 + 90 * u);
        const boja = efekat === 'plamen' ? '255,150,40' : efekat === 'mehurici' ? '120,200,255' : '255,235,150';
        gr2.addColorStop(0, `rgba(${boja},${0.5 * (1 - u)})`); gr2.addColorStop(1, `rgba(${boja},0)`);
        g.fillStyle = gr2; g.beginPath(); g.arc(c.x, c.y, 150, 0, 7); g.fill();
      }
      postavi(nat, ['Reaktanti (polazne supstance) se približavaju', 'Sudar: veze u reaktantima se kidaju', 'Atomi se preuređuju i grade nove veze', 'Nastali proizvodi'][faza]);
    }, { brzina: 0.0025 });
  }

  // ───────────────────────── metalna veza ─────────────────────────
  function metalna(k, m) {
    const el = m.metal || 'Cu';
    const info = MD().ATOMI[el] || { boja: '#d35400', r: 0.6 };
    const NX = 4, NY = 3, NZ = 3, S = 1.55;
    const joni = [];
    for (let x = 0; x < NX; x++) for (let y = 0; y < NY; y++) for (let z = 0; z < NZ; z++) joni.push([(x - (NX - 1) / 2) * S, (y - (NY - 1) / 2) * S, (z - (NZ - 1) / 2) * S]);
    const box = [NX * S / 2, NY * S / 2, NZ * S / 2];
    const rnd = slucajni(3);
    const N = 46;
    const el3 = Array.from({ length: N }, () => ({ p: [(rnd() * 2 - 1) * box[0], (rnd() * 2 - 1) * box[1], (rnd() * 2 - 1) * box[2]], v: [rnd() - 0.5, rnd() - 0.5, rnd() - 0.5], f: rnd() * 6 }));
    const { cv, g, w, h } = MD().platno(k, m.visina || 270);
    const nat = natpisDiv(k);
    const sk = Math.min(w, h) / 2 / 4.2;
    let tp = null;
    postavi(nat, m.struja ? 'Pod dejstvom napona slobodni elektroni teku u jednom smeru – to je električna struja' : 'Katjoni metala u rešetki + slobodni elektroni („elektronski gas“) = metalna veza');
    return MD().okretanje(cv, (ax, ay, ms) => {
      const dt = tp === null ? 0.016 : Math.min(0.05, (ms - tp) / 1000); tp = ms;
      g.clearRect(0, 0, w, h);
      const sp = 1.3;
      el3.forEach((e) => {
        for (let i = 0; i < 3; i++) {
          e.p[i] += e.v[i] * dt * sp * 1.4 + (m.struja && i === 0 ? 1.6 * dt : 0) + Math.sin(ms / 400 + e.f + i) * dt * 0.8;
          if (e.p[i] > box[i]) e.p[i] -= 2 * box[i];
          if (e.p[i] < -box[i]) e.p[i] += 2 * box[i];
        }
      });
      const kugle = [], oreoli = [], plus = [];
      for (const j of joni) {
        const p = proj(j, ax, ay, w, h, sk), r = info.r * sk * p.f * 0.62;
        kugle.push(kugla(p, r, info.boja));
        plus.push([p.x, p.y, p.zp - r]);
      }
      for (const e of el3) {
        const p = proj(e.p, ax, ay, w, h, sk);
        oreoli.push({ x: p.x, y: p.y, z: p.zp, r: 10 * p.f, boja: ELEK_V, alfa: 0.45 });
        kugle.push(kugla(p, 3.6 * p.f, ELEK_V));
      }
      window.Scena3D.crtaj(g, w, h, { kugle, oreoli });
      for (const [x, y, z] of plus) if (!window.Scena3D.zaklonjen(x, y, z, kugle)) oznaka(g, '+', x, y, '#fff', 13);
    }, { brzina: 0.004 });
  }

  // ───────────────────────── rastvaranje ─────────────────────────
  function vodaMol(g, x, y, ugao, s = 1, boja = 1) {
    g.save(); g.translate(x, y); g.rotate(ugao);
    g.fillStyle = `rgba(255,255,255,${0.9 * boja})`;
    for (const sg of [-1, 1]) { g.beginPath(); g.arc(sg * 5.6 * s, 5 * s, 2.6 * s, 0, 7); g.fill(); }
    g.fillStyle = `rgba(232,65,24,${0.95 * boja})`; g.beginPath(); g.arc(0, 0, 4.4 * s, 0, 7); g.fill();
    g.restore();
  }
  function rastvaranje(k, m) {
    const tip = m.tip || 'so';
    const { cv, g, w, h } = MD().platno(k, m.visina || 270);
    const nat = natpisDiv(k);
    const T = 11;
    const vreme = sat(cv, T);
    const rnd = slucajni(9);
    const X0 = 40, X1 = w - 40, YV = 70, YD = h - 34;
    // čestice supstance
    const R = 9;
    const cest = [];
    const kolone = 7, redovi = 3;
    for (let r = 0; r < redovi; r++) for (let c = 0; c < kolone; c++) {
      const x = w / 2 + (c - (kolone - 1) / 2) * R * 2.05, y = YD - 6 - r * R * 2.05;
      const tipC = tip === 'so' || tip === 'kiselina' ? ((r + c) % 2 ? 'Cl' : 'Na') : 'M';
      cest.push({ x0: x, y0: y, t: tipC, r, c, tOd: 0.8 + rnd() * 6.5, fx: rnd() * 6, fy: rnd() * 6, cx: X0 + 20 + rnd() * (X1 - X0 - 40), cy: YV + 25 + rnd() * (YD - YV - 70), ugao: rnd() * 6.28 });
    }
    cest.sort((a, b) => a.tOd - b.tOd);
    const vm = Array.from({ length: 34 }, () => ({ x: X0 + 10 + rnd() * (X1 - X0 - 20), y: YV + 8 + rnd() * (YD - YV - 14), a: rnd() * 6.28, f: rnd() * 6 }));
    const natpisi = {
      so: ['~Kristal soli: Na⁺ i Cl⁻ jonski vezani', '~Molekuli vode (polarni) privlače jone i vade ih iz kristala', '~Hidratisani joni su razmešani po rastvoru – so se rastvorila'],
      secer: ['~Kristal šećera – cele molekule, bez jona', '~Molekuli vode okružuju molekule šećera i odvajaju ih', '~Molekuli šećera su razmešani – rastvor ne provodi struju'],
      ulje: ['~Ulje (nepolarno) i voda (polarna)', '~Polarni molekuli vode privlače jedni druge, a ne ulje', '~Ulje i voda se ne mešaju – ulje pliva na vodi'],
      kiselina: ['~Molekuli HCl i vode', '~Voda izdvaja jon H⁺ iz HCl – nastaje H₃O⁺', '~Rastvor sadrži H₃O⁺ i Cl⁻ – zato je kiseo i provodi struju'],
    }[tip] || [];
    const BOJ = { Na: '#8c7ae6', Cl: '#4cd137' };
    function crtaj(ms) {
      const t = vreme(ms);
      g.clearRect(0, 0, w, h);
      // čaša
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(X0 - 8, 20); g.lineTo(X0 - 8, h - 14); g.lineTo(X1 + 8, h - 14); g.lineTo(X1 + 8, 20); g.stroke();
      const gr = g.createLinearGradient(0, YV, 0, h);
      gr.addColorStop(0, 'rgba(60,140,230,.28)'); gr.addColorStop(1, 'rgba(30,90,200,.42)');
      g.fillStyle = gr; g.fillRect(X0 - 6, YV, X1 - X0 + 12, h - 16 - YV);
      g.strokeStyle = 'rgba(160,210,255,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(X0 - 6, YV); g.lineTo(X1 + 6, YV); g.stroke();
      // molekuli vode u pozadini
      vm.forEach((v) => vodaMol(g, v.x + Math.sin(t * 1.3 + v.f) * 3, v.y + Math.cos(t * 1.1 + v.f) * 3, v.a + t * 0.6, 0.8, 0.55));
      if (tip === 'ulje') {
        // kapi ulja izdižu se na površinu
        cest.forEach((c, i) => {
          const u = glatko((t - 1) / 7 * (0.6 + c.tOd / 10));
          const x = lerp(c.x0, X0 + 24 + ((i * 37) % (X1 - X0 - 48)), u), y = lerp(c.y0, YV + 10 + (i % 3) * 4, u);
          g.fillStyle = 'rgba(241,196,15,.88)'; g.beginPath(); g.ellipse(x + Math.sin(t + i) * 2, y, 9 + (u > 0.9 ? 6 : 0), 6, 0, 0, 7); g.fill();
        });
      } else if (tip === 'kiselina') {
        cest.forEach((c, i) => {
          const du = glatko((t - c.tOd) / 3);
          const x = lerp(c.x0, c.cx, du) + Math.sin(t * 1.4 + c.fx) * 5 * du, y = lerp(c.y0, c.cy, du) + Math.cos(t * 1.2 + c.fy) * 5 * du;
          if (du < 0.5) {
            // molekul HCl: Cl + H
            sfera(g, x, y, 8, BOJ.Cl); sfera(g, x + 10, y - 2, 5, '#f5f6fa');
          } else {
            sfera(g, x, y, 8, BOJ.Cl); oznaka(g, '−', x, y, '#fff', 12);
            const hx = x + 22 * Math.cos(c.ugao), hy = y + 22 * Math.sin(c.ugao);
            vodaMol(g, hx, hy, c.ugao, 1, 1); sfera(g, hx, hy - 7, 5, '#f5f6fa'); oznaka(g, '+', hx, hy - 7, '#e84118', 10);
          }
        });
      } else {
        cest.forEach((c, i) => {
          const du = glatko((t - c.tOd) / 3.2);
          const x = lerp(c.x0, c.cx, du) + Math.sin(t * 1.4 + c.fx) * 6 * du, y = lerp(c.y0, c.cy, du) + Math.cos(t * 1.2 + c.fy) * 6 * du;
          if (tip === 'so') {
            sfera(g, x, y, c.t === 'Na' ? 7 : 9, BOJ[c.t]);
            oznaka(g, c.t === 'Na' ? '+' : '−', x, y, '#fff', 11);
            if (du > 0.25) {
              const kol = c.t === 'Na' ? 'O' : 'H';
              for (let a = 0; a < 4; a++) {
                const ang = c.ugao + a * 1.57, rr = 20 * Math.min(1, du * 1.4);
                vodaMol(g, x + Math.cos(ang) * rr, y + Math.sin(ang) * rr, ang + (kol === 'O' ? 1.57 : -1.57) + (kol === 'O' ? Math.PI : 0), 0.8, Math.min(1, du * 1.6));
              }
            }
          } else {
            // molekul šećera: šestougao
            g.save(); g.translate(x, y); g.rotate(c.ugao + t * 0.2 * du);
            g.fillStyle = '#fd79a8'; g.beginPath();
            for (let a = 0; a < 6; a++) { const an = (a / 6) * Math.PI * 2; g.lineTo(Math.cos(an) * 8, Math.sin(an) * 8); }
            g.closePath(); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.stroke(); g.restore();
            if (du > 0.3) for (let a = 0; a < 3; a++) { const ang = c.ugao + a * 2.1, rr = 17 * Math.min(1, du * 1.5); vodaMol(g, x + Math.cos(ang) * rr, y + Math.sin(ang) * rr, ang, 0.7, Math.min(1, du * 1.5)); }
          }
        });
      }
      const f = t < 1.5 ? 0 : t < 6.5 ? 1 : 2;
      postavi(nat, natpisi[f].replace(/~/g, ''));
    }
    return MD().okretanje(cv, (ax, ay, ms) => crtaj(ms), { brzina: 0 });
  }

  // ───────────────────────── pH skala ─────────────────────────
  const PH_SUPSTANCE = {
    akumulator: [0.5, '🔋', 'kiselina iz akumulatora'], zeludac: [1.5, '🫃', 'želudačni sok'], limun: [2.2, '🍋', 'sok od limuna'], kola: [2.5, '🥤', 'kola'], sirce: [2.9, '🧴', 'sirće'],
    narandza: [3.5, '🍊', 'sok od narandže'], paradajz: [4.3, '🍅', 'paradajz'], kafa: [5, '☕', 'kafa'], kisa: [5.6, '🌧️', 'kisela kiša'], mleko: [6.5, '🥛', 'mleko'], voda: [7, '💧', 'destilovana voda'],
    krv: [7.4, '🩸', 'krv'], more: [8.1, '🌊', 'morska voda'], soda: [8.3, '🧂', 'sodabikarbona'], pasta: [8.5, '🪥', 'pasta za zube'], sapun: [10, '🧼', 'sapun'], amonijak: [11.5, '🧪', 'rastvor amonijaka'],
    varikina: [12.5, '🧴', 'varikina'], sodakaustik: [14, '⚠️', 'rastvor NaOH'],
  };
  const INDIKATORI = {
    univerzalni: { n: 'univerzalni indikator', s: [[0, '#e8321e'], [2, '#f06a1c'], [4, '#f9c21b'], [6, '#a5d12b'], [7, '#3fae46'], [8, '#1aa59a'], [10, '#2f6fd1'], [12, '#5b3fb0'], [14, '#7a2a9a']] },
    lakmus: { n: 'lakmus', s: [[0, '#e8321e'], [4.9, '#e8321e'], [5, '#9b59b6'], [8, '#9b59b6'], [8.1, '#3d6fd8'], [14, '#3d6fd8']] },
    fenolftalein: { n: 'fenolftalein', s: [[0, '#e8eef5'], [8.1, '#e8eef5'], [8.2, '#e84393'], [14, '#c2185b']] },
    metiloranz: { n: 'metiloranž', s: [[0, '#e8321e'], [3.1, '#e8321e'], [3.2, '#f39c12'], [4.4, '#f1c40f'], [14, '#f1c40f']] },
  };
  function ph(k, m) {
    const ind = INDIKATORI[m.indikator || 'univerzalni'] || INDIKATORI.univerzalni;
    let v = m.vrednost;
    const lista = (m.supstance || []).filter((s) => PH_SUPSTANCE[s]);
    if (v === undefined && lista.length) v = PH_SUPSTANCE[lista[0]][0];
    const d = document.createElement('div');
    d.className = 'hem-ph';
    const stops = ind.s.map(([p, c]) => `${c} ${(p / 14) * 100}%`).join(',');
    let html = `<div class="hem-ph-traka" style="background:linear-gradient(90deg,${stops})">`;
    for (let i = 0; i <= 14; i++) html += `<span class="hem-ph-broj" style="left:${(i / 14) * 100}%" data-lat>${i}</span>`;
    html += '</div>';
    html += '<div class="hem-ph-oblasti"><span class="kis">kiselo</span><span class="neu">neutralno</span><span class="baz">bazno</span></div>';
    d.innerHTML = html;
    const traka = d.firstChild;
    for (const s of lista) {
      const [p, e, naziv] = PH_SUPSTANCE[s];
      const o = document.createElement('div');
      o.className = 'hem-ph-supstanca';
      o.style.left = `${(p / 14) * 100}%`;
      o.innerHTML = `<span class="em">${e}</span>${m.bezNaziva ? '' : `<span class="nz">${naziv}</span>`}`;
      d.appendChild(o);
    }
    if (v !== undefined && !lista.length) {
      const mk = document.createElement('div');
      mk.className = 'hem-ph-marker';
      mk.style.left = '50%';
      mk.innerHTML = `<span>▼</span>${m.bezBroja ? '<b>?</b>' : `<b data-lat>pH = ${String(v).replace('.', ',')}</b>`}`;
      d.appendChild(mk);
      requestAnimationFrame(() => requestAnimationFrame(() => { mk.style.left = `${(ogr(v, 0, 14) / 14) * 100}%`; }));
    }
    const nm = document.createElement('div');
    nm.className = 'hem-natpis';
    nm.textContent = m.indikator ? `Boje indikatora (${ind.n}) na pH skali` : 'pH skala: 0–6 kiselo, 7 neutralno, 8–14 bazno';
    k.appendChild(d); k.appendChild(nm);
    return () => {};
  }


  // ───────────────────────── periodni sistem ─────────────────────────
  const PS_SIM = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ');
  const PS_KLASE = {
    alkalni: 'Li Na K Rb Cs Fr', zemnoalkalni: 'Be Mg Ca Sr Ba Ra', halogeni: 'F Cl Br I At Ts', plemeniti: 'He Ne Ar Kr Xe Rn Og', metaloidi: 'B Si Ge As Sb Te',
    nemetali: 'H C N O P S Se', postprelazni: 'Al Ga In Sn Tl Pb Bi Po Nh Fl Mc Lv',
  };
  const PS_BOJE = { alkalni: '#ff9f7a', zemnoalkalni: '#ffd37a', prelazni: '#8fc7ff', postprelazni: '#a9e0e8', metaloidi: '#e6e486', nemetali: '#8ee3a2', halogeni: '#5fd6c2', plemeniti: '#c9a8ff' };
  const PS_NAZIV = { alkalni: 'alkalni metali', zemnoalkalni: 'zemnoalkalni metali', prelazni: 'prelazni metali', postprelazni: 'ostali metali', metaloidi: 'metaloidi', nemetali: 'nemetali', halogeni: 'halogeni elementi', plemeniti: 'plemeniti gasovi' };
  const psKlasa = (sim) => { for (const k in PS_KLASE) if (PS_KLASE[k].split(' ').includes(sim)) return k; return 'prelazni'; };
  function psMesto(z) {
    if (z === 1) return [1, 1];
    if (z === 2) return [1, 18];
    if (z <= 4) return [2, z - 2];
    if (z <= 10) return [2, z + 8];
    if (z <= 12) return [3, z - 10];
    if (z <= 18) return [3, z];
    if (z <= 36) return [4, z - 18];
    if (z <= 54) return [5, z - 36];
    if (z <= 56) return [6, z - 54];
    if (z <= 71) return [9, z - 57 + 3];
    if (z <= 86) return [6, z - 68];
    if (z <= 88) return [7, z - 86];
    if (z <= 103) return [10, z - 89 + 3];
    return [7, z - 100];
  }
  // ist: lista simbola i/ili naziva klasa ('alkalni', 'halogeni', 'metali', 'grupa:17', 'perioda:3'); bezSimbola: istaknuta polja sa „?“
  function periodni(k, m) {
    const ist = [].concat(m.istakni || []);
    const imaIst = ist.length > 0;
    const jeIst = (sim, z) => {
      const [per, gru] = psMesto(z), kl = psKlasa(sim);
      return ist.some((x) => x === sim || x === kl || (x === 'metali' && ['alkalni', 'zemnoalkalni', 'prelazni', 'postprelazni'].includes(kl)) || x === 'grupa:' + gru || x === 'perioda:' + per);
    };
    const d = document.createElement('div');
    d.className = 'hem-ps';
    const celije = [];
    const dodaj = (red, kol, html, klasa, stil) => { celije.push(`<div class="${klasa}" style="grid-row:${red};grid-column:${kol}${stil || ''}"${html.lat ? ' data-lat' : ''}>${html.t}</div>`); };
    // brojevi grupa i perioda
    for (let g = 1; g <= 18; g++) dodaj(1, g + 1, { t: g, lat: true }, 'nbr');
    for (let p = 1; p <= 7; p++) dodaj(p + 1, 1, { t: p, lat: true }, 'nbr');
    PS_SIM.forEach((sim, i) => {
      const z = i + 1, [per, gru] = psMesto(z), kl = psKlasa(sim), ii = jeIst(sim, z);
      const red = per <= 7 ? per + 1 : per + 1; // red 8 (mala praznina) preskočen: laktanoidi u redu 10
      const boja = PS_BOJE[kl];
      const prikaz = ii && m.bezSimbola ? '?' : sim;
      dodaj(per <= 7 ? per + 1 : per + 1, gru + 1, { t: prikaz, lat: true }, `c${imaIst ? (ii ? ' ist' : ' tamno') : ''}`, `;background:${boja}`);
    });
    // zvezdice u 6. i 7. periodi (laktanoidi/aktinoidi)
    dodaj(7, 4, { t: '*', lat: true }, 'nbr'); dodaj(8, 4, { t: '**', lat: true }, 'nbr');
    d.innerHTML = celije.join('');
    k.appendChild(d);
    if (m.legenda !== false) {
      const l = document.createElement('div');
      l.className = 'hem-leg';
      const kl = imaIst ? [...new Set(PS_SIM.filter((s, i) => jeIst(s, i + 1)).map(psKlasa))] : Object.keys(PS_BOJE);
      l.innerHTML = (m.bezKlasa ? [] : kl).map((x) => `<span><i style="background:${PS_BOJE[x]}"></i>${PS_NAZIV[x]}</span>`).join('');
      k.appendChild(l);
    }
    return () => {};
  }

  const SCENE_F = { atom, jonska, kovalentna, reakcija, metalna, rastvaranje, ph, periodni };
  function prikazi(k, m) {
    const f = Object.hasOwn(SCENE_F, m.scena) ? SCENE_F[m.scena] : null;
    if (!f) return () => {};
    return f(k, m) || (() => {});
  }
  window.Hemija3D = { prikazi, SCENE: SCENE_IMENA, proveriReakciju, jednacinaTekst, PH_SUPSTANCE };
})();
