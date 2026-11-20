// Laboratorijske scene (medij „laboratorija“): pribor i posuđe, ogledi u epruvetama, magnet, gustina, provodljivost,
// filtriranje, razvijanje gasa, oznake opasnosti… Crtaju se same u SVG-u i vrte u petlji (isti okvir kao public/fizika.js).
//
//   { "vrsta": "laboratorija", "scena": "pribor", "stavke": ["epruveta", "casa"], "istakni": "casa" }
//   { "vrsta": "laboratorija", "scena": "epruvete", "preset": "baso4" }
//   { "vrsta": "laboratorija", "scena": "magnet", "uzorci": ["Fe", "Cu", "Al"] }
//   { "vrsta": "laboratorija", "scena": "menzura", "predmet": "Fe" }
//   { "vrsta": "laboratorija", "scena": "struja", "predmet": "Cu" }        (Fe, Cu, Al, so, secer, voda, kiselina, etanol, sirce)
//   { "vrsta": "laboratorija", "scena": "toplota" } · "tvrdoca" · "filtriranje" · "gas" · "oznake" · "grejanje" · "lakmus" · "mesanje" · "mirisanje"
//
// Natpisi koji počinju sa „~“ su srpske reči (preslovljavaju se u ćirilicu), ostalo (formule, simboli) ostaje latinicom.
// Dodir na crtež pokreće animaciju iz početka. Spisak scena: Laboratorija.SCENE (koristi i alati/proveri-kvizove.js).
(function () {
  'use strict';
  const NODE = typeof window === 'undefined';
  const SCENE_IMENA = ['pribor', 'epruvete', 'magnet', 'menzura', 'struja', 'toplota', 'tvrdoca', 'filtriranje', 'gas', 'oznake', 'grejanje', 'lakmus', 'mesanje', 'mirisanje', 'destilacija', 'nafta', 'zemni-gas'];
  const PRIBOR_IMENA = ['epruveta', 'casa', 'erlenmajer', 'balon', 'menzura', 'levak', 'pipeta', 'satno', 'lampa', 'stalak', 'stativ', 'tronozac', 'avan', 'stapic', 'boca', 'termometar', 'vaga', 'reso', 'kasicica', 'bireta', 'hvataljka'];
  const PRESETI_IMENA = ['baso4', 'agcl', 'metali', 'soda', 'lugol', 'felling', 'dihromat', 'cuag', 'rastvorljivost', 'denaturacija', 'kiseline', 'baza', 'alkoholi', 'zncuso4', 'fecl3', 'cuoh2', 'masti', 'mesanje-vode', 'jod'];
  if (NODE) { module.exports = { SCENE: SCENE_IMENA, PRIBOR: PRIBOR_IMENA, PRESETI: PRESETI_IMENA }; return; }

  const A = window.Fizika.alati;
  const { NS, C, br, f2, niz, ogr, glatko, el, at, tx, postaviTekst, lin, kr, put, tacke, vel, slucajni, pokreni } = A;
  const lerp = (a, b, u) => a + (b - a) * u;
  const STAKLO = '#cfe6ff', STAKLO_F = 'rgba(160,210,255,.10)';
  const tecnost = '#74b9ff';
  const hex = (c) => { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const mix = (a, b, u) => { const x = hex(a), y = hex(b); return `rgb(${Math.round(lerp(x[0], y[0], u))},${Math.round(lerp(x[1], y[1], u))},${Math.round(lerp(x[2], y[2], u))})`; };
  const mixRgb = (a, b, u) => { const p = (c) => (c.startsWith('#') ? hex(c) : c.match(/\d+/g).map(Number)); const x = p(a), y = p(b); return `rgb(${Math.round(lerp(x[0], y[0], u))},${Math.round(lerp(x[1], y[1], u))},${Math.round(lerp(x[2], y[2], u))})`; };
  const grp = (r, x = 0, y = 0, sk = 1) => { const g = el(r, 'g'); g.setAttribute('transform', `translate(${f2(x)} ${f2(y)})${sk !== 1 ? ` scale(${sk})` : ''}`); return g; };
  const staklo = (r, d, o = {}) => put(r, d, { stroke: STAKLO, 'stroke-width': 2.2, fill: STAKLO_F, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...o });
  const tecno = (r, d, boja = tecnost, op = 0.62) => put(r, d, { fill: boja, opacity: op, stroke: 'none' });

  // ───────────────────────── pribor i posuđe ─────────────────────────
  // svaki crtež je u okviru oko (0,0), širina ≤ 90, visina ≤ 112
  const PRIBOR = {
    epruveta: { n: '~epruveta', f(g) { tecno(g, 'M-9,0 L-9,36 A9,9 0 0 0 9,36 L9,0 Z'); staklo(g, 'M-10,-50 L-10,36 A10,10 0 0 0 10,36 L10,-50'); lin(g, -13, -50, 13, -50, STAKLO, 2.4); } },
    casa: { n: '~laboratorijska čaša', f(g) { tecno(g, 'M-24,-4 L-23,38 L23,38 L24,-4 Z'); staklo(g, 'M-27,-42 L-24,40 L24,40 L27,-42'); lin(g, 27, -42, 33, -46, STAKLO, 2.2); for (let i = 0; i < 4; i++) lin(g, -23 + 1, -24 + i * 14, -16, -24 + i * 14, STAKLO, 1.4); } },
    erlenmajer: { n: '~Erlenmajerova tikvica', f(g) { tecno(g, 'M-24,20 L-31,38 L31,38 L24,20 Z'); staklo(g, 'M-8,-50 L-8,-20 L-32,40 L32,40 L8,-20 L8,-50'); lin(g, -11, -50, 11, -50, STAKLO, 2.4); } },
    balon: { n: '~tikvica sa okruglim dnom', f(g) { tecno(g, 'M-22,22 A26,26 0 0 0 22,22 Z'); staklo(g, 'M-7,-52 L-7,-14 A28,28 0 1 0 7,-14 L7,-52'); lin(g, -10, -52, 10, -52, STAKLO, 2.4); } },
    menzura: { n: '~menzura', f(g) { tecno(g, 'M-9,-8 L-9,46 L9,46 L9,-8 Z'); staklo(g, 'M-10,-52 L-10,48 L10,48 L10,-52'); put(g, 'M-20,50 L20,50 L14,56 L-14,56 Z', { stroke: STAKLO, 'stroke-width': 2, fill: STAKLO_F }); for (let i = 0; i < 9; i++) lin(g, 10, -44 + i * 10, i % 2 ? 4 : 0, -44 + i * 10, STAKLO, 1.4); } },
    levak: { n: '~levak', f(g) { staklo(g, 'M-30,-42 L30,-42 L5,-6 L5,44 L-5,44 L-5,-6 Z'); lin(g, -30, -42, 30, -42, STAKLO, 2.6); } },
    pipeta: { n: '~Pasterova pipeta', f(g) { put(g, 'M-9,-52 Q-11,-30 -5,-26 L5,-26 Q11,-30 9,-52 Z', { fill: '#e84a5f', stroke: '#ff7d8e', 'stroke-width': 1.6 }); staklo(g, 'M-4,-26 L-4,38 L0,52 L4,38 L4,-26'); tecno(g, 'M-3,14 L-3,38 L0,50 L3,38 L3,14 Z'); } },
    satno: { n: '~satno staklo', f(g) { el(g, 'ellipse', { cx: 0, cy: 8, rx: 38, ry: 12, fill: STAKLO_F, stroke: STAKLO, 'stroke-width': 2.2 }); el(g, 'ellipse', { cx: 0, cy: 8, rx: 26, ry: 7, fill: 'none', stroke: STAKLO, 'stroke-width': 1.2, opacity: 0.6 }); el(g, 'ellipse', { cx: 0, cy: 7, rx: 5, ry: 2, fill: '#fff', opacity: 0.8 }); } },
    lampa: { n: '~špiritusna lampa', f(g) { put(g, 'M-6,-40 Q0,-60 6,-40 Q8,-30 0,-26 Q-8,-30 -6,-40 Z', { fill: '#fdcb6e', opacity: 0.95 }); put(g, 'M-3,-38 Q0,-50 3,-38 Q4,-31 0,-28 Q-4,-31 -3,-38 Z', { fill: '#ff7675' }); put(g, 'M-4,-26 L-4,-12 L4,-12 L4,-26', { stroke: '#8d6e63', 'stroke-width': 3, fill: 'none' }); lin(g, 0, -26, 0, -14, '#f5f0e1', 2); tecno(g, 'M-26,18 Q-30,38 -20,44 L20,44 Q30,38 26,18 Z', '#f1c40f', 0.55); staklo(g, 'M-12,-12 L-12,-4 Q-34,6 -32,30 Q-30,46 -20,46 L20,46 Q30,46 32,30 Q34,6 12,-4 L12,-12'); } },
    stalak: { n: '~stalak za epruvete', f(g) { el(g, 'rect', { x: -38, y: -2, width: 76, height: 6, fill: '#a1887f' }); el(g, 'rect', { x: -38, y: 38, width: 76, height: 6, fill: '#a1887f' }); lin(g, -34, 4, -34, 38, '#8d6e63', 5); lin(g, 34, 4, 34, 38, '#8d6e63', 5); for (const x of [-20, 0, 20]) { tecno(g, `M${x - 6},4 L${x - 6},24 A6,6 0 0 0 ${x + 6},24 L${x + 6},4 Z`, tecnost); staklo(g, `M${x - 7},-30 L${x - 7},24 A7,7 0 0 0 ${x + 7},24 L${x + 7},-30`, { 'stroke-width': 1.8 }); } } },
    stativ: { n: '~laboratorijski stativ sa hvataljkom', f(g) { el(g, 'rect', { x: -34, y: 44, width: 68, height: 8, rx: 2, fill: '#6b7d90' }); el(g, 'rect', { x: -22, y: -52, width: 5, height: 98, fill: '#9fb3c8' }); el(g, 'rect', { x: -22, y: -22, width: 40, height: 5, fill: '#9fb3c8' }); put(g, 'M18,-26 L30,-26 L30,-12 L18,-12', { stroke: '#cfd8e3', 'stroke-width': 4, fill: 'none' }); kr(g, -19, -19, 5, { fill: '#e17055' }); } },
    tronozac: { n: '~tronožac sa metalnom mrežicom', f(g) { el(g, 'ellipse', { cx: 0, cy: -12, rx: 32, ry: 8, fill: 'none', stroke: '#cfd8e3', 'stroke-width': 3 }); for (let i = -3; i <= 3; i++) lin(g, i * 9, -18, i * 9, -6, '#9fb3c8', 1.2); lin(g, -32, -12, -38, 46, '#cfd8e3', 3.4); lin(g, 32, -12, 38, 46, '#cfd8e3', 3.4); lin(g, 0, -4, 0, 46, '#cfd8e3', 3.4); } },
    avan: { n: '~avan sa tučkom', f(g) { put(g, 'M-36,4 Q-34,40 0,42 Q34,40 36,4 Z', { fill: '#f5f0e1', stroke: '#fff', 'stroke-width': 2 }); lin(g, -40, 4, 40, 4, '#fff', 4); put(g, 'M6,-6 L30,-50 Q36,-54 34,-46 L16,0 Z', { fill: '#e6dccb', stroke: '#fff', 'stroke-width': 1.5 }); } },
    stapic: { n: '~stakleni štapić', f(g) { lin(g, -40, 34, 40, -34, STAKLO, 5); lin(g, -40, 34, 40, -34, '#fff', 1.2); } },
    boca: { n: '~špric-boca', f(g) { put(g, 'M-14,-8 Q-26,8 -22,38 Q-20,46 -10,46 L10,46 Q20,46 22,38 Q26,8 14,-8 Z', { fill: 'rgba(255,255,255,.2)', stroke: '#e9f2fc', 'stroke-width': 2 }); tecno(g, 'M-22,16 Q-23,40 -10,44 L10,44 Q23,40 22,16 Z', tecnost, 0.55); el(g, 'rect', { x: -7, y: -18, width: 14, height: 10, fill: '#e17055' }); put(g, 'M0,-18 L0,-36 Q0,-44 12,-44 L24,-40', { stroke: '#e9f2fc', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }); } },
    termometar: { n: '~termometar', f(g) { staklo(g, 'M-4,-52 L-4,32 A9,9 0 1 0 4,32 L4,-52 Z'); put(g, 'M-1.8,-8 L-1.8,34 L1.8,34 L1.8,-8 Z', { fill: '#e63946' }); kr(g, 0, 40, 6, { fill: '#e63946' }); for (let i = 0; i < 12; i++) lin(g, 4, -46 + i * 6, i % 2 ? 8 : 11, -46 + i * 6, STAKLO, 1.3); } },
    vaga: { n: '~tehnička vaga', f(g) { el(g, 'rect', { x: -36, y: 36, width: 72, height: 10, rx: 3, fill: '#8fa3b8' }); el(g, 'rect', { x: -5, y: -22, width: 10, height: 60, fill: '#6b7d90' }); lin(g, -36, -26, 36, -26, '#cfd8e3', 4); for (const x of [-34, 34]) { lin(g, x, -26, x - 8, 10, '#9fb3c8', 1.4); lin(g, x, -26, x + 8, 10, '#9fb3c8', 1.4); lin(g, x - 14, 10, x + 14, 10, '#cfd8e3', 3); } kr(g, 0, -28, 5, { fill: '#e17055' }); } },
    reso: { n: '~rešo', f(g) { el(g, 'rect', { x: -36, y: 8, width: 72, height: 32, rx: 6, fill: '#576574' }); el(g, 'ellipse', { cx: 0, cy: 8, rx: 30, ry: 8, fill: '#2d3436', stroke: '#ff7675', 'stroke-width': 3 }); el(g, 'ellipse', { cx: 0, cy: 8, rx: 16, ry: 4, fill: 'none', stroke: '#ff9f43', 'stroke-width': 2 }); kr(g, 24, 28, 4, { fill: '#55efc4' }); } },
    kasicica: { n: '~laboratorijska kašičica', f(g) { lin(g, -36, 28, 22, -22, '#cfd8e3', 4); el(g, 'ellipse', { cx: 30, cy: -30, rx: 13, ry: 8, transform: 'rotate(-40 30 -30)', fill: '#cfd8e3', stroke: '#fff', 'stroke-width': 1.5 }); } },
    bireta: { n: '~bireta', f(g) { staklo(g, 'M-7,-54 L-7,30 L-3,30 L-3,44 L3,44 L3,30 L7,30 L7,-54'); tecno(g, 'M-6,-30 L-6,30 L6,30 L6,-30 Z', tecnost, 0.55); lin(g, -14, 34, 14, 34, '#e17055', 4); for (let i = 0; i < 11; i++) lin(g, 7, -48 + i * 7, i % 2 ? 11 : 15, -48 + i * 7, STAKLO, 1.3); } },
    hvataljka: { n: '~drvena hvataljka za epruvete', f(g) { lin(g, -38, 34, 28, -26, '#a1887f', 7); put(g, 'M20,-36 L40,-16 L34,-10 L16,-28 Z', { fill: '#8d6e63', stroke: '#6d4c41', 'stroke-width': 1.5 }); lin(g, -20, 14, -10, 26, '#6d4c41', 3); } },
  };

  // ───────────────────────── epruvete: ogledi ─────────────────────────
  // tečnost u epruveti: telo od x=-w/2..w/2, dno okruglo
  function epruveta(r, x, y, o = {}) {
    const w = o.w || 24, h = o.h || 96, g = grp(r, x, y);
    const rr = w / 2;
    const clip = 'cp' + Math.random().toString(36).slice(2, 8);
    const cd = el(g, 'clipPath', { id: clip });
    put(cd, `M${-rr + 1},0 L${-rr + 1},${h - rr} A${rr - 1},${rr - 1} 0 0 0 ${rr - 1},${h - rr} L${rr - 1},0 Z`);
    const unutra = el(g, 'g', { 'clip-path': `url(#${clip})` });
    const tec = el(unutra, 'rect', { x: -rr, y: h, width: w, height: 0, fill: o.boja || tecnost, opacity: 0.7 });
    const taloz = el(unutra, 'rect', { x: -rr, y: h, width: w, height: 0, fill: '#fff', opacity: 0 });
    const cvrsto = el(unutra, 'g');
    const mut = el(unutra, 'rect', { x: -rr, y: 0, width: w, height: h, fill: '#fff', opacity: 0 });
    const meh = el(unutra, 'g');
    staklo(g, `M${-rr},-8 L${-rr},${h - rr} A${rr},${rr} 0 0 0 ${rr},${h - rr} L${rr},-8`, { fill: 'none' });
    lin(g, -rr - 3, -8, rr + 3, -8, STAKLO, 2.4);
    if (o.natpis) tx(g, 0, h + 14, o.natpis, { v: 12, b: C.zuta });
    const hh = {
      g, h, rr, tec, taloz, cvrsto, mut, meh, yDno: h, nivo: o.nivo ?? 0.55, boja: o.boja || tecnost,
      postavi(nivo, boja, op) {
        const vis = (h - rr) * 0 + h * nivo; // visina stuba
        at(tec, { y: h - vis, height: vis + 2, fill: boja, opacity: op ?? 0.7 });
        hh.nivo = nivo;
      },
    };
    hh.postavi(hh.nivo, hh.boja);
    return hh;
  }
  function mehurici(grupa, tubeH, t, jacina, nivo, sg) {
    // beskonačni mehurići koji se dižu kroz tečnost
    while (grupa.firstChild) grupa.removeChild(grupa.firstChild);
    const n = Math.round(2 + jacina * 9);
    const visT = tubeH * nivo;
    for (let i = 0; i < n; i++) {
      const per = 1.1 + (i % 3) * 0.35, u = ((t / per + i * 0.37) % 1);
      const x = Math.sin(i * 3.1 + u * 6) * (4 + (i % 3)), yy = tubeH - 10 - u * (visT - 8);
      kr(grupa, x, yy, 1.8 + (i % 3) * 0.7, { fill: 'rgba(255,255,255,.75)' });
    }
  }
  function kapi(r, x, y) {
    const g = grp(r, x, y);
    put(g, 'M-6,-46 Q-8,-28 -3,-24 L3,-24 Q8,-28 6,-46 Z', { fill: '#e84a5f', stroke: '#ff7d8e', 'stroke-width': 1.4 });
    staklo(g, 'M-3,-24 L-3,10 L0,20 L3,10 L3,-24');
    const kap = kr(g, 0, 22, 2.8, { fill: '#fff', opacity: 0 });
    return { g, kap, tekuce: put(g, 'M-2,-6 L-2,10 L0,18 L2,10 L2,-6 Z', { fill: '#fff', opacity: 0.8 }) };
  }
  const PRESET = {
    // tube: { n: natpis, boja, nivo, cvrst: {boja, kol}, d: [{t, tip, ...}] } – događaji
    baso4: { naslov: '', epr: [
      { n: 'Na₂SO₄ + BaCl₂', boja: '#a9d4ff', op: 0.5, d: [{ t: 1, tip: 'kapi', n: 3 }, { t: 2.6, tip: 'taloz', boja: '#ffffff' }] },
      { n: 'Na₂SO₄ + Ba(NO₃)₂', boja: '#a9d4ff', op: 0.5, d: [{ t: 1.6, tip: 'kapi', n: 3 }, { t: 3.2, tip: 'taloz', boja: '#ffffff' }] },
      { n: 'H₂SO₄ + BaCl₂', boja: '#a9d4ff', op: 0.5, d: [{ t: 2.2, tip: 'kapi', n: 3 }, { t: 3.8, tip: 'taloz', boja: '#ffffff' }] }] },
    agcl: { epr: [
      { n: 'NaCl + AgNO₃', boja: '#a9d4ff', op: 0.5, d: [{ t: 1, tip: 'kapi', n: 3 }, { t: 2.6, tip: 'taloz', boja: '#f7f7f2', gust: 1 }] },
      { n: 'HCl + AgNO₃', boja: '#a9d4ff', op: 0.5, d: [{ t: 1.8, tip: 'kapi', n: 3 }, { t: 3.4, tip: 'taloz', boja: '#f7f7f2', gust: 1 }] }] },
    metali: { epr: [
      { n: 'Mg', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.4, tip: 'cvrst', boja: '#cfd8e3', rast: 3.5 }, { t: 1, tip: 'mehurici', jac: 1, traj: 5 }] },
      { n: 'Zn', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.4, tip: 'cvrst', boja: '#9fb3c8' }, { t: 1, tip: 'mehurici', jac: 0.6, traj: 5 }] },
      { n: 'Fe', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.4, tip: 'cvrst', boja: '#6b7d90' }, { t: 1.4, tip: 'mehurici', jac: 0.25, traj: 5 }] },
      { n: 'Cu', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.4, tip: 'cvrst', boja: '#d35400' }] }] },
    soda: { epr: [
      { n: 'NaHCO₃ + CH₃COOH', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.3, tip: 'cvrst', boja: '#f5f0e1' }, { t: 1, tip: 'kapi', n: 3 }, { t: 1.5, tip: 'mehurici', jac: 0.55, traj: 4.5 }] },
      { n: 'NaHCO₃ + HCl', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.3, tip: 'cvrst', boja: '#f5f0e1' }, { t: 1, tip: 'kapi', n: 3 }, { t: 1.5, tip: 'mehurici', jac: 1, traj: 4.5 }] }] },
    lugol: { epr: [
      { n: 'skrob', boja: '#f5f0e1', op: 0.5, d: [{ t: 1, tip: 'kapi', n: 2, boja: '#d35400' }, { t: 2.2, tip: 'promena', u: '#1a1a4a', traj: 1.2 }] },
      { n: '', boja: '#f5f0e1', op: 0.4, d: [{ t: 1.8, tip: 'kapi', n: 2, boja: '#d35400' }, { t: 3, tip: 'promena', u: '#c98a2c', traj: 1 }] }] },
    felling: { epr: [
      { n: 'Felingov reagens + glukoza', boja: '#2a6fd6', op: 0.8, d: [{ t: 0.5, tip: 'zagrevanje', traj: 5 }, { t: 3, tip: 'promena', u: '#8e44ad', traj: 1 }, { t: 3.6, tip: 'taloz', boja: '#d9381e', gust: 1 }] }] },
    dihromat: { epr: [
      { n: 'K₂Cr₂O₇ + alkohol', boja: '#f39c12', op: 0.85, d: [{ t: 0.5, tip: 'zagrevanje', traj: 5 }, { t: 3, tip: 'promena', u: '#3d8b4a', traj: 2 }] }] },
    cuag: { epr: [
      { n: 'Cu + AgNO₃', boja: '#e6ecf2', op: 0.3, d: [{ t: 0.5, tip: 'zica', boja: '#d35400' }, { t: 2, tip: 'promena', u: '#3b8de0', traj: 3.5 }, { t: 2.5, tip: 'srebro' }] }] },
    rastvorljivost: { epr: [
      { n: 'NaCl', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.3, tip: 'cvrst', boja: '#ffffff', rast: 3 }] },
      { n: 'CaCO₃', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.3, tip: 'cvrst', boja: '#ffffff' }, { t: 2, tip: 'mut', op: 0.35 }] },
      { n: 'CuSO₄', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.3, tip: 'cvrst', boja: '#3b8de0', rast: 3.2 }, { t: 1, tip: 'promena', u: '#3b8de0', traj: 3 }] },
      { n: 'NaHCO₃', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.3, tip: 'cvrst', boja: '#f5f0e1', rast: 3.4 }] }] },
    denaturacija: { epr: [
      { n: '~zagrevanje', boja: '#f6f1d8', op: 0.7, d: [{ t: 0.5, tip: 'zagrevanje', traj: 4 }, { t: 2.2, tip: 'promena', u: '#ffffff', traj: 1.6 }] },
      { n: '~sirće', boja: '#f6f1d8', op: 0.7, d: [{ t: 1, tip: 'kapi', n: 3 }, { t: 2.4, tip: 'taloz', boja: '#ffffff', gust: 1 }] },
      { n: 'Pb(NO₃)₂', boja: '#f6f1d8', op: 0.7, d: [{ t: 1.4, tip: 'kapi', n: 3 }, { t: 2.8, tip: 'taloz', boja: '#ffffff', gust: 1 }] }] },
    kiseline: { epr: [
      { n: 'HCl', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.8, tip: 'kapi', n: 2, boja: '#9b59b6' }, { t: 2, tip: 'promena', u: '#e8321e', traj: 1 }] },
      { n: 'H₂SO₄', boja: '#a9d4ff', op: 0.5, d: [{ t: 1.2, tip: 'kapi', n: 2, boja: '#9b59b6' }, { t: 2.4, tip: 'promena', u: '#e8321e', traj: 1 }] }] },
    baza: { epr: [
      { n: 'NaOH', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.8, tip: 'kapi', n: 2, boja: '#e84393' }, { t: 2, tip: 'promena', u: '#e84393', traj: 1 }] },
      { n: 'HCl', boja: '#a9d4ff', op: 0.5, d: [{ t: 1.2, tip: 'kapi', n: 2, boja: '#e84393' }, { t: 2.4, tip: 'promena', u: '#dfe6e9', traj: 1 }] }] },
    alkoholi: { epr: [
      { n: '~etanol + voda', boja: '#a9d4ff', op: 0.45, d: [{ t: 0.8, tip: 'kapi', n: 3, boja: '#e6ecf2' }] },
      { n: '~2-propanol + voda', boja: '#a9d4ff', op: 0.45, d: [{ t: 1.2, tip: 'kapi', n: 3, boja: '#e6ecf2' }] },
      { n: '~1-butanol + voda', boja: '#a9d4ff', op: 0.45, d: [{ t: 1.6, tip: 'kapi', n: 3, boja: '#e6ecf2' }, { t: 3.2, tip: 'sloj', boja: '#d9e7f3' }] },
      { n: '~stearinska kis.', boja: '#a9d4ff', op: 0.45, d: [{ t: 0.4, tip: 'cvrst', boja: '#f7f1e3' }] }] },
    jod: { epr: [
      { n: '~jod + voda', boja: '#a9d4ff', op: 0.45, d: [{ t: 0.4, tip: 'cvrst', boja: '#3b1f5a' }, { t: 2, tip: 'promena', u: '#d9b46a', traj: 3 }] },
      { n: '~jod + heksan', boja: '#f3f1ea', op: 0.3, d: [{ t: 0.4, tip: 'cvrst', boja: '#3b1f5a', rast: 3 }, { t: 1, tip: 'promena', u: '#8e2de2', traj: 3 }] }] },
    zncuso4: { epr: [
      { n: 'Zn + CuSO₄', boja: '#3b8de0', op: 0.75, d: [{ t: 0.5, tip: 'zica', boja: '#9fb3c8' }, { t: 1.5, tip: 'promena', u: '#e6ecf2', traj: 4 }, { t: 2, tip: 'bakar' }] }] },
    fecl3: { epr: [
      { n: 'FeCl₃ + NaOH', boja: '#e0b24a', op: 0.7, d: [{ t: 1, tip: 'kapi', n: 3 }, { t: 2.4, tip: 'taloz', boja: '#a0431e', gust: 1 }] }] },
    cuoh2: { epr: [
      { n: 'CuSO₄ + NaOH', boja: '#5aa3e8', op: 0.6, d: [{ t: 1, tip: 'kapi', n: 3 }, { t: 2.4, tip: 'taloz', boja: '#3b7fe0', gust: 1 }] }] },
    masti: { epr: [
      { n: '~voda + ulje', boja: '#74b9ff', op: 0.6, d: [{ t: 0.5, tip: 'sloj', boja: '#f1c40f' }] },
      { n: '~voda + etanol', boja: '#a9d4ff', op: 0.5, d: [{ t: 0.5, tip: 'mut', op: 0.0 }] }] },
    'mesanje-vode': { epr: [{ n: '', boja: '#74b9ff', op: 0.6, d: [] }] },
  };

  function epruvete(s, m) {
    const P = PRESET[m.preset] || PRESET.baso4;
    const lista = m.epr || P.epr;
    const n = lista.length, W = 320, H = 210;
    vel(s, W, H);
    const razmak = Math.min(78, (W - 30) / n);
    const x0 = W / 2 - ((n - 1) * razmak) / 2;
    el(s, 'rect', { x: 0, y: 150, width: W, height: 60, fill: 'rgba(255,255,255,.04)' });
    const skrij = m.bezNatpisa;
    const tubes = lista.map((tu, i) => {
      const x = x0 + i * razmak;
      const e = epruveta(s, x, 66, { w: 26, h: 100, boja: tu.boja || '#dfe6e9', nivo: tu.nivo ?? 0.5 });
      const kp = kapi(s, x, 14);
      kp.g.style.display = 'none';
      const lampa = el(s, 'g', { opacity: 0 });
      put(lampa, `M${x - 6},176 Q${x},150 ${x + 6},176 Q${x + 8},186 ${x},188 Q${x - 8},186 ${x - 6},176 Z`, { fill: '#fdcb6e' });
      put(lampa, `M${x - 3},178 Q${x},164 ${x + 3},178 Q${x + 4},184 ${x},186 Q${x - 4},184 ${x - 3},178 Z`, { fill: '#ff7675' });
      if (tu.n && !skrij) tx(s, x, 196, tu.n, { v: tu.n.length > 12 ? 8.5 : 10.5, b: C.zuta });
      return { tu, e, kp, lampa, x, op: tu.op ?? 0.7 };
    });
    let T = 6.5;
    return {
      trajanje: T, pauza: 2,
      kadar(t) {
        for (const tb of tubes) {
          const { tu, e } = tb;
          let boja = tu.boja || '#dfe6e9', mutOp = 0, talozGust = 0, talozBoja = '#fff', talozU = 0, mehJ = 0, kapNa = false, grej = false, cvr = null, rast = 0, zicaBoja = null, srebro = 0, bakar = 0, sloj = null;
          let kap = null;
          for (const d of tu.d) {
            const u = t - d.t;
            if (u < 0) continue;
            if (d.tip === 'kapi') {
              const per = 0.5;
              if (u < per * d.n + 0.2) { kapNa = true; const k = Math.floor(u / per), f = (u % per) / per; kap = { f, k, boja: d.boja || '#fff' }; }
            } else if (d.tip === 'promena') { boja = mixRgb(boja, d.u, glatko(u / (d.traj || 1))); }
            else if (d.tip === 'taloz') { talozU = glatko(u / 0.8); talozGust = d.gust ? 1 : 0.5; talozBoja = d.boja; mutOp = Math.max(mutOp, (1 - glatko((u - 0.8) / 2.5)) * 0.55 * glatko(u / 0.5)); }
            else if (d.tip === 'mehurici') { if (u < (d.traj || 4)) mehJ = d.jac || 0.5; }
            else if (d.tip === 'zagrevanje') { if (u < (d.traj || 4)) grej = true; }
            else if (d.tip === 'cvrst') { cvr = { boja: d.boja, rast: d.rast || 0, u }; }
            else if (d.tip === 'mut') { mutOp = Math.max(mutOp, d.op ?? 0.3); }
            else if (d.tip === 'zica') zicaBoja = d.boja;
            else if (d.tip === 'srebro') srebro = glatko(u / 3);
            else if (d.tip === 'bakar') bakar = glatko(u / 3);
            else if (d.tip === 'sloj') sloj = { boja: d.boja, u: glatko(u / 1.2) };
          }
          e.postavi(tu.nivo ?? 0.5, boja, tb.op + (cvr && cvr.boja === '#3b8de0' ? 0.2 : 0));
          // kapaljka
          tb.kp.g.style.display = kapNa ? '' : 'none';
          if (kap) { at(tb.kp.kap, { cy: 22 + kap.f * 36, opacity: kap.f > 0.05 ? 1 : 0, fill: kap.boja }); at(tb.kp.tekuce, { fill: kap.boja }); }
          // čvrsta supstanca na dnu / rastvaranje
          while (e.cvrsto.firstChild) e.cvrsto.removeChild(e.cvrsto.firstChild);
          if (cvr) {
            const k = cvr.rast ? 1 - glatko(cvr.u / cvr.rast) : 1;
            if (k > 0.03) { for (let i = 0; i < 7; i++) el(e.cvrsto, 'rect', { x: -9 + (i % 4) * 4.5, y: e.h - 12 - Math.floor(i / 4) * 4.5 - 1, width: 4.2 * k + 0.6, height: 4.2 * k + 0.6, fill: cvr.boja, transform: `rotate(${i * 20} ${-9 + (i % 4) * 4.5} ${e.h - 12})` }); }
          }
          if (zicaBoja) { lin(e.cvrsto, -2, -8, -2, e.h - 18, zicaBoja, 3); if (srebro > 0) for (let i = 0; i < 10; i++) lin(e.cvrsto, -2, 8 + i * 6, -2 + (i % 2 ? 7 : -7) * srebro, 4 + i * 6, bakar > 0 ? '#d35400' : '#e9eef2', 1.4); }
          // talog
          const visT = e.h * (tu.nivo ?? 0.5);
          at(e.taloz, { y: e.h - 6 - talozU * 14 * (talozGust ? 1 : 0.6), height: talozU * 14 * (talozGust ? 1 : 0.6) + 6, fill: talozBoja, opacity: talozU * 0.95 });
          at(e.mut, { fill: talozBoja, opacity: mutOp, y: e.h - visT, height: visT });
          if (sloj) { at(e.mut, { fill: sloj.boja, opacity: 0.0 }); }
          // mehurići
          if (mehJ > 0) mehurici(e.meh, e.h, t, mehJ, tu.nivo ?? 0.5); else while (e.meh.firstChild) e.meh.removeChild(e.meh.firstChild);
          if (sloj) { // uljani sloj na površini
            while (e.meh.firstChild) e.meh.removeChild(e.meh.firstChild);
            el(e.meh, 'rect', { x: -13, y: e.h - visT, width: 26, height: visT * 0.45 * sloj.u, fill: sloj.boja, opacity: 0.85 });
          }
          tb.lampa.setAttribute('opacity', grej ? '1' : '0');
        }
      },
    };
  }

  // ───────────────────────── pribor (scena) ─────────────────────────
  function pribor(s, m) {
    const stavke = niz(m.stavke).length ? m.stavke.filter((x) => PRIBOR[x]).slice(0, 4) : ['epruveta'];
    const n = stavke.length, W = 320, H = 190;
    vel(s, W, H);
    const rz = Math.min(110, (W - 20) / n), x0 = W / 2 - ((n - 1) * rz) / 2;
    const ist = m.istakni === true ? stavke[0] : m.istakni;
    const okvir = [];
    stavke.forEach((ime, i) => {
      const g = grp(s, x0 + i * rz, 84, n === 1 ? 1.45 : n === 2 ? 1.2 : 1);
      PRIBOR[ime].f(g);
      const jeIst = ime === ist;
      const o = jeIst ? kr(s, x0 + i * rz, 84, 62, { fill: 'none', stroke: C.zuta, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' }) : null;
      okvir.push(o);
      if (m.natpisi !== false) { const nz = PRIBOR[ime].n; tx(s, x0 + i * rz, 168, jeIst ? '?' : nz, { v: jeIst ? 22 : ogr(rz / (nz.length * 0.66), 7.5, 12), b: jeIst ? C.zuta : C.siva }); }
    });
    return { trajanje: 3, pauza: 0, kadar(t) { okvir.forEach((o) => o && at(o, { opacity: 0.45 + 0.55 * Math.abs(Math.sin(t * 2.2)), 'stroke-dashoffset': -t * 20 })); } };
  }

  // ───────────────────────── magnet ─────────────────────────
  const MET = {
    Fe: { n: 'Fe', b: '#6b7d90', magn: true }, Cu: { n: 'Cu', b: '#d35400' }, Al: { n: 'Al', b: '#cfd8e3' }, Zn: { n: 'Zn', b: '#8e9aaf' }, Pb: { n: 'Pb', b: '#4b5563' },
    Mg: { n: 'Mg', b: '#dfe6e9' }, Au: { n: 'Au', b: '#f1c40f' }, Ag: { n: 'Ag', b: '#e6ecf2' }, Ni: { n: 'Ni', b: '#a4b0be', magn: true }, Co: { n: 'Co', b: '#7f8fa6', magn: true }, Hg: { n: 'Hg', b: '#b8c6d6' },
  };
  function magnet(s, m) {
    const uz = niz(m.uzorci).filter((x) => MET[x]).slice(0, 5);
    if (!uz.length) uz.push('Fe', 'Cu', 'Al');
    const n = uz.length, W = 320, H = 200;
    vel(s, W, H);
    const rz = (W - 30) / n, x0 = 15 + rz / 2;
    const stavke = uz.map((k, i) => {
      const x = x0 + i * rz;
      el(s, 'ellipse', { cx: x, cy: 158, rx: 26, ry: 8, fill: STAKLO_F, stroke: STAKLO, 'stroke-width': 1.8 });
      const g = el(s, 'g');
      const kom = [];
      for (let j = 0; j < 7; j++) kom.push(el(g, 'rect', { x: -14 + j * 4.2, y: -8 + (j % 3) * 2, width: 5, height: 5, rx: 1, fill: MET[k].b, stroke: '#0b1826', 'stroke-width': 0.6 }));
      if (m.natpisi !== false) tx(s, x, 182, MET[k].n, { v: 13, b: C.bela });
      return { k, x, g, kom };
    });
    const mg = el(s, 'g');
    put(mg, 'M-14,0 L-14,-26 Q-14,-40 0,-40 Q14,-40 14,-26 L14,0 L6,0 L6,-26 Q6,-32 0,-32 Q-6,-32 -6,-26 L-6,0 Z', { fill: '#e84a5f' });
    el(mg, 'rect', { x: -14, y: -4, width: 8, height: 6, fill: '#dfe6e9' }); el(mg, 'rect', { x: 6, y: -4, width: 8, height: 6, fill: '#dfe6e9' });
    const SEG = 1.7, T = n * SEG + 0.6;
    return {
      trajanje: T, pauza: 1.5,
      kadar(t) {
        const idx = Math.min(n - 1, Math.floor(t / SEG)), u = Math.min(1, (t - idx * SEG) / SEG);
        const px = idx ? stavke[idx - 1].x : stavke[0].x;
        const mx = lerp(px, stavke[idx].x, glatko(u / 0.2));
        const spust = glatko((u - 0.2) / 0.25) * (1 - glatko((u - 0.65) / 0.25));
        const my = lerp(50, 112, spust);
        mg.setAttribute('transform', `translate(${f2(t >= n * SEG ? stavke[n - 1].x : mx)} ${f2(t >= n * SEG ? 50 : my)})`);
        stavke.forEach((st, i) => {
          const magn = MET[st.k].magn;
          const prati = magn && i === idx && t < n * SEG && u > 0.42 && u < 0.97;
          const y = prati ? lerp(150, my + 6, glatko((u - 0.42) / 0.08)) : 150;
          st.g.setAttribute('transform', `translate(${st.x} ${f2(y)})`);
        });
      },
    };
  }

  // ───────────────────────── menzura (gustina) ─────────────────────────
  function menzura(s, m) {
    const W = 320, H = 220;
    vel(s, W, H);
    const V0 = m.v0 ?? 30, V1 = m.v1 ?? 40, masa = m.masa;
    const g = grp(s, 160, 0);
    const yMax = 190, yMin = 20, Vmax = 50;
    const vy = (v) => yMax - ((v - 0) / Vmax) * (yMax - yMin);
    staklo(g, `M-24,${yMin - 10} L-24,${yMax + 4} L24,${yMax + 4} L24,${yMin - 10}`);
    put(g, `M-44,${yMax + 8} L44,${yMax + 8} L34,${yMax + 18} L-34,${yMax + 18} Z`, { stroke: STAKLO, 'stroke-width': 2, fill: STAKLO_F });
    for (let v = 0; v <= Vmax; v += 5) { lin(g, 24, vy(v), v % 10 ? 16 : 10, vy(v), STAKLO, 1.4); if (v % 10 === 0) tx(g, 40, vy(v), String(v), { v: 10, b: C.siva, a: 'start', obrub: false }); }
    const tec = el(g, 'rect', { x: -23, y: vy(V0), width: 46, height: yMax + 4 - vy(V0), fill: tecnost, opacity: 0.55 });
    const pred = el(g, 'g');
    const mt = MET[m.predmet] || MET.Fe;
    el(pred, 'rect', { x: -9, y: -17, width: 18, height: 34, rx: 3, fill: mt.b, stroke: '#fff', 'stroke-width': 1.4 });
    el(pred, 'ellipse', { cx: 0, cy: -17, rx: 9, ry: 3, fill: '#fff', opacity: 0.35 });
    const nat = tx(s, 60, 28, '', { v: 11, b: C.zuta });
    const nat2 = tx(s, 260, 100, '', { v: 11, b: C.zuta });
    const mk = lin(g, -24, vy(V0), 24, vy(V0), C.zuta, 1.8, true);
    const yPocetak = 28, yKraj = yMax - 20 - 17;
    return {
      trajanje: 6, pauza: 2,
      kadar(t) {
        const u = glatko((t - 1.2) / 1.4), V = lerp(V0, V1, u);
        const yp = lerp(yPocetak, vy(V1) + 30, u) ;
        pred.setAttribute('transform', `translate(0 ${f2(Math.min(yp, yKraj - 4 + 0))})`);
        const vv = V, yt = vy(vv);
        at(tec, { y: yt, height: yMax + 4 - yt });
        at(mk, { y1: yt, y2: yt });
        if (masa !== undefined) postaviTekst(nat, `m = ${String(masa).replace('.', ',')} g`);
        postaviTekst(nat2, t < 1.2 ? `V₁ = ${V0} cm³` : u < 1 ? '~uranja…' : `V₂ = ${V1} cm³`);
        nat2.setAttribute('x', 262);
      },
    };
  }

  // ───────────────────────── struja (provodljivost) ─────────────────────────
  const KOLO = {
    Fe: { tip: 'metal', jac: 0.8, n: 'Fe' }, Cu: { tip: 'metal', jac: 1, n: 'Cu' }, Al: { tip: 'metal', jac: 0.9, n: 'Al' },
    so: { tip: 'tecnost', jac: 0.8, n: '~rastvor soli', b: '#74b9ff', jonski: true }, secer: { tip: 'tecnost', jac: 0, n: '~rastvor šećera', b: '#dfe6e9' },
    voda: { tip: 'tecnost', jac: 0.03, n: '~destilovana voda', b: '#9fd1ff' }, kiselina: { tip: 'tecnost', jac: 0.9, n: '~rastvor HCl', b: '#e8f0a8', jonski: true },
    etanol: { tip: 'tecnost', jac: 0, n: '~etanol', b: '#e6ecf2' }, sirce: { tip: 'tecnost', jac: 0.25, n: '~sirće', b: '#f3e6b4', jonski: true, slab: true },
    baza: { tip: 'tecnost', jac: 0.9, n: '~rastvor NaOH', b: '#a8d8ff', jonski: true },
  };
  function struja(s, m) {
    const K = KOLO[m.predmet || 'Cu'] || KOLO.Cu, W = 320, H = K.tip === 'metal' ? 200 : 214; // natpis tečnosti je ispod čaše
    vel(s, W, H);
    // baterija
    el(s, 'rect', { x: 14, y: 78, width: 36, height: 56, rx: 4, fill: '#2d3436', stroke: C.siva, 'stroke-width': 2 });
    el(s, 'rect', { x: 26, y: 72, width: 12, height: 7, fill: C.siva });
    tx(s, 32, 100, '+', { v: 16, b: C.crvena }); tx(s, 32, 122, '−', { v: 16, b: C.plava });
    // sijalica
    const sj = A.kr ? el(s, 'g') : null;
    const sjaj = kr(sj, 260, 62, 34, { fill: C.zuta, opacity: 0 });
    kr(sj, 260, 62, 17, { fill: '#0b1826', stroke: C.bela, 'stroke-width': 2.4 });
    put(sj, 'M251,70 Q255,50 260,62 Q265,50 269,70', { stroke: C.bela, 'stroke-width': 2, fill: 'none' });
    el(sj, 'rect', { x: 252, y: 79, width: 16, height: 10, fill: C.siva });
    // žice
    const zic = '#cfd8e3';
    put(s, 'M32,72 L32,30 L260,30 L260,45', { stroke: zic, 'stroke-width': 2.4 });
    put(s, 'M260,89 L260,104 L246,104', { stroke: zic, 'stroke-width': 2.4 });
    put(s, 'M32,134 L32,168 L90,168', { stroke: zic, 'stroke-width': 2.4 });
    const proba = el(s, 'g');
    let jonovi = [];
    if (K.tip === 'metal') {
      put(s, 'M246,104 L128,104', { stroke: zic, 'stroke-width': 2.4 }); put(s, 'M90,168 L108,168 L108,150', { stroke: zic, 'stroke-width': 2.4 });
      put(s, 'M128,104 L128,150', { stroke: zic, 'stroke-width': 2.4 });
      el(proba, 'rect', { x: 108, y: 146, width: 20, height: 8, fill: MET[m.predmet]?.b || '#d35400', stroke: '#fff', 'stroke-width': 1 });
      tx(s, 118, 184, K.n, { v: 13 });
    } else {
      // čaša sa dva štapića
      staklo(s, 'M96,110 L100,190 L180,190 L184,110', {});
      tecno(s, 'M98,132 L101,188 L179,188 L182,132 Z', K.b || tecnost, 0.45);
      put(s, 'M246,104 L120,104 L120,170', { stroke: zic, 'stroke-width': 2.4 }); put(s, 'M90,168 L160,168', { stroke: zic, 'stroke-width': 2.4 });
      el(s, 'rect', { x: 117, y: 134, width: 6, height: 40, fill: '#8e9aaf' }); el(s, 'rect', { x: 157, y: 134, width: 6, height: 40, fill: '#8e9aaf' });
      put(s, 'M160,168 L160,172', { stroke: zic, 'stroke-width': 2.4 });
      tx(s, 140, 204, K.n, { v: 11 });
      if (K.jonski) for (let i = 0; i < 12; i++) jonovi.push({ x: 128 + (i * 11) % 26, y: 140 + (i * 7) % 40, q: i % 2 ? 1 : -1, f: i });
      jonovi = jonovi.map((j) => ({ ...j, e: kr(s, 0, 0, 3.4, { fill: j.q > 0 ? '#ff7675' : '#74b9ff', opacity: 0.95 }) }));
    }
    const lab = tx(s, 260, 124, '', { v: 11, b: C.zuta });
    return {
      trajanje: 5, pauza: 0.5,
      kadar(t) {
        const kolo = t > 0.8;
        const sv = kolo ? K.jac * (K.slab ? 0.6 : 1) * (0.92 + 0.08 * Math.sin(t * 18)) : 0;
        at(sjaj, { opacity: f2(sv * 0.7) });
        postaviTekst(lab, !kolo ? '~kolo otvoreno' : K.jac > 0.5 ? '~sijalica svetli' : K.jac > 0.1 ? '~slabo svetli' : '~sijalica ne svetli');
        for (const j of jonovi) {
          const v = kolo ? K.jac * 12 : 0;
          const x = 128 + (((j.x - 128) + (j.q > 0 ? 1 : -1) * 0) + 0) + (((j.x - 128) + (kolo ? (j.q > 0 ? -1 : 1) * v * t * 1.1 : 0)) % 26 + 26) % 26 - (j.x - 128) + (j.x - 128) * 0;
          at(j.e, { cx: 124 + ((j.x - 124 + (kolo ? (j.q > 0 ? -v * t : v * t) : 0)) % 32 + 32) % 32, cy: j.y + Math.sin(t * 2 + j.f) * 3 });
        }
      },
    };
  }

  // ───────────────────────── toplotna provodljivost ─────────────────────────
  function toplota(s, m) {
    const W = 320, H = 216;
    vel(s, W, H);
    const uz = (niz(m.uzorci).length ? m.uzorci : ['Fe', 'Al', 'Cu']).filter((x) => MET[x]);
    const brz = { Cu: 1, Al: 0.8, Fe: 0.35, Zn: 0.55, Pb: 0.25, Mg: 0.75 };
    // čaša sa vrućom vodom
    staklo(s, 'M30,86 L36,190 L284,190 L290,86');
    tecno(s, 'M32,110 L37,188 L283,188 L288,110 Z', '#ff9f68', 0.5);
    tx(s, 160, 176, '~vruća voda', { v: 12, b: C.bela });
    const trake = uz.map((k, i) => {
      const x = 70 + i * 84, g = el(s, 'g');
      const seg = [];
      for (let j = 0; j < 14; j++) seg.push(el(g, 'rect', { x: x - 6, y: 24 + j * 12, width: 12, height: 12.5, fill: MET[k].b, stroke: 'none' }));
      el(g, 'rect', { x: x - 6, y: 24, width: 12, height: 168, fill: 'none', stroke: '#fff', 'stroke-width': 1.2, opacity: 0.7 });
      tx(s, x, 10, MET[k].n, { v: 14 });
      return { k, seg, v: brz[k] || 0.5 };
    });
    const nat = tx(s, 160, 206, '', { v: 11, b: C.zuta });
    return {
      trajanje: 7, pauza: 1.5,
      kadar(t) {
        trake.forEach((tr) => {
          const front = ogr((t - 0.5) * tr.v * 0.25, 0, 1); // 0..1 frakcija dužine koja je topla
          tr.seg.forEach((r, j) => {
            const d = (13 - j) / 13; // 0 u vodi (dole)... j=13 je u vodi
            const u = ogr(1 - d / Math.max(front, 0.001) * 0.9, 0, 1) * (d <= front ? 1 : 0);
            r.setAttribute('fill', mixRgb(MET[tr.k].b.length === 7 ? MET[tr.k].b : '#8fa3b8', '#ff3b2e', u * 0.85));
          });
        });
        postaviTekst(nat, t < 0.5 ? '' : '~što je boja crvenija, to je deo metala topliji');
      },
    };
  }

  // ───────────────────────── tvrdoća ─────────────────────────
  function tvrdoca(s, m) {
    const W = 320, H = 190;
    vel(s, W, H);
    const uz = (niz(m.uzorci).length ? m.uzorci : ['Fe', 'Al', 'Cu']).filter((x) => MET[x]);
    const tvr = { Fe: 0.45, Al: 0.8, Cu: 0.65, Zn: 0.7, Pb: 1.0, Mg: 0.75 };
    const n = uz.length, rz = (W - 30) / n, x0 = 15 + rz / 2;
    const stavke = uz.map((k, i) => {
      const x = x0 + i * rz;
      el(s, 'rect', { x: x - 38, y: 70, width: 76, height: 62, rx: 4, fill: MET[k].b, stroke: '#fff', 'stroke-width': 1.3 });
      for (let j = 0; j < 8; j++) lin(s, x - 36, 76 + j * 7, x + 36, 76 + j * 7, '#fff', 0.5).setAttribute('opacity', '.12');
      const ur = lin(s, x - 30, 100, x - 30, 100, '#1b2430', 3.4);
      tx(s, x, 150, MET[k].n, { v: 14 });
      return { k, x, ur, duz: 62 * (tvr[k] ?? 0.7) };
    });
    const ek = el(s, 'g');
    el(ek, 'rect', { x: 0, y: -8, width: 40, height: 7, rx: 2, fill: '#cfd8e3' });
    put(ek, 'M0,-8 L-14,-1 L-0,-1', { fill: '#cfd8e3' });
    return {
      trajanje: 6, pauza: 1.5,
      kadar(t) {
        const idx = Math.min(n - 1, Math.floor(t / 1.8)), u = glatko((t % 1.8) / 1.5);
        stavke.forEach((st, i) => {
          const dd = i < idx ? st.duz : i === idx ? st.duz * u : 0;
          at(st.ur, { x2: st.x - 30 + dd });
        });
        const st = stavke[idx];
        ek.setAttribute('transform', `translate(${f2(st.x - 32 + st.duz * u - 4)} ${f2(100 - 3)}) rotate(-18)`);
      },
    };
  }

  // ───────────────────────── filtriranje ─────────────────────────
  function filtriranje(s, m) {
    const W = 320, H = 210;
    vel(s, W, H);
    // stativ i levak
    el(s, 'rect', { x: 30, y: 192, width: 100, height: 8, rx: 2, fill: '#6b7d90' });
    el(s, 'rect', { x: 40, y: 28, width: 6, height: 164, fill: '#9fb3c8' });
    put(s, 'M46,66 L96,66', { stroke: '#cfd8e3', 'stroke-width': 4 });
    // levak sa filter hartijom
    staklo(s, 'M70,44 L128,44 L105,100 L100,100 L100,118 L98,118 L98,100 L93,100 Z', { fill: 'rgba(160,210,255,.07)' });
    put(s, 'M76,48 L122,48 L100,98 Z', { fill: 'rgba(255,255,255,.55)', stroke: '#fff', 'stroke-width': 1 });
    // prijemna čaša
    staklo(s, 'M72,132 L76,190 L128,190 L132,132');
    const filtrat = el(s, 'rect', { x: 76, y: 188, width: 52, height: 0, fill: '#bfe3ff', opacity: 0.5 });
    const kap = kr(s, 100, 120, 2.2, { fill: '#bfe3ff', opacity: 0 });
    const ostatak = el(s, 'g');
    // čaša sa smešom (ugalj + voda) koja se sipa
    const sip = el(s, 'g');
    staklo(sip, 'M-24,-36 L-22,28 L22,28 L24,-36', {});
    tecno(sip, 'M-23,-14 L-22,26 L22,26 L23,-14 Z', '#5d6d7e', 0.8);
    const mlaz = el(s, 'path', { fill: 'none', stroke: '#5d6d7e', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 });
    tx(s, 235, 160, '~filtrat (bistra tečnost)', { v: 11, b: C.plava }); lin(s, 190, 168, 135, 176, C.plava, 1.2, true);
    tx(s, 235, 40, '~ostatak na filter hartiji', { v: 11, b: C.zuta }); lin(s, 190, 48, 105, 82, C.zuta, 1.2, true);
    return {
      trajanje: 7, pauza: 2,
      kadar(t) {
        const ug = glatko(t / 1.2) * (1 - glatko((t - 3.3) / 0.8));
        sip.setAttribute('transform', `translate(${f2(lerp(235, 150, glatko(t / 1.0)))} ${f2(lerp(120, 18, glatko(t / 1.0)))}) rotate(${f2(-ug * 50 * (t > 0.7 ? 1 : 0))}) scale(.78)`);
        const sipa = t > 1.1 && t < 3.6;
        at(mlaz, { d: 'M118,18 Q108,36 101,62', opacity: sipa ? 0.9 : 0 });
        const u = ogr((t - 1.6) / 4.8, 0, 1);
        at(filtrat, { y: 188 - 26 * u, height: 26 * u + 2 });
        at(kap, { cy: 120 + ((t * 2) % 1) * 24, opacity: t > 1.7 && t < 6.5 ? 1 : 0 });
        while (ostatak.firstChild) ostatak.removeChild(ostatak.firstChild);
        const k = ogr((t - 1.4) / 2, 0, 1);
        for (let i = 0; i < 12 * k; i++) el(ostatak, 'rect', { x: 88 + (i * 5) % 20 + (i % 3), y: 80 + ((i * 3) % 14) + (i % 2), width: 3.4, height: 3, fill: '#2d3436' });
      },
    };
  }

  // ───────────────────────── razvijanje gasa ─────────────────────────
  function gas(s, m) {
    const W = 320, H = 222;
    vel(s, W, H);
    const tip = m.tip || 'co2';
    // epruveta 1 (reakcija) na stativu
    el(s, 'rect', { x: 30, y: 192, width: 260, height: 8, rx: 2, fill: '#6b7d90' });
    el(s, 'rect', { x: 36, y: 40, width: 6, height: 152, fill: '#9fb3c8' }); el(s, 'rect', { x: 284, y: 90, width: 6, height: 102, fill: '#9fb3c8' });
    const e1 = epruveta(s, 78, 70, { w: 30, h: 110, boja: '#dfe6e9', nivo: 0.35 });
    put(s, 'M42,76 L62,76', { stroke: '#cfd8e3', 'stroke-width': 3.5 });
    // čep i cev
    el(s, 'rect', { x: 62, y: 56, width: 32, height: 16, rx: 3, fill: '#c0392b' });
    put(s, 'M78,64 L78,34 L222,34 L222,120', { stroke: STAKLO, 'stroke-width': 3, fill: 'none', 'stroke-linejoin': 'round' });
    // epruveta 2 (kreč voda)
    const e2 = epruveta(s, 222, 90, { w: 30, h: 100, boja: '#e6f1fb', nivo: 0.5 });
    put(s, 'M254,98 L284,98', { stroke: '#cfd8e3', 'stroke-width': 3.5 });
    lin(s, 222, 120, 222, 150, STAKLO, 3);
    tx(s, 78, 192 - 6, tip === 'co2' ? 'NaHCO₃ + HCl' : '', { v: 10.5, b: C.zuta });
    tx(s, 222, 214, tip === 'co2' ? '~kreč na voda Ca(OH)₂' : '', { v: 10.5, b: C.plava });
    const mut = el(s, 'rect', { x: 207, y: 140, width: 30, height: 48, fill: '#fff', opacity: 0, rx: 2 });
    const bub = el(s, 'g');
    const cvr = [];
    for (let i = 0; i < 5; i++) cvr.push(el(e1.cvrsto, 'rect', { x: -10 + i * 4, y: 100 - (i % 2) * 4, width: 5, height: 5, fill: '#f5f0e1' }));
    const nat = tx(s, 160, 14, '', { v: 11, b: C.zuta });
    return {
      trajanje: 8, pauza: 2,
      kadar(t) {
        const r = t > 1;
        const jac = r ? 0.8 : 0;
        e1.postavi(0.38 + (r ? 0.04 : 0), '#e8eef5', 0.5);
        if (jac) mehurici(e1.meh, e1.h, t, 0.8, 0.38); else while (e1.meh.firstChild) e1.meh.removeChild(e1.meh.firstChild);
        // mehurići u cevi i u drugoj epruveti
        while (bub.firstChild) bub.removeChild(bub.firstChild);
        if (r) {
          const u = ((t - 1) * 0.5) % 1;
          [[78, 50], [100, 34], [160, 34], [210, 34], [222, 60], [222, 100]].forEach(([x, y], i) => kr(bub, x, y + Math.sin(t * 5 + i) * 1.5, 2.2, { fill: 'rgba(255,255,255,.8)' }));
          for (let i = 0; i < 5; i++) { const uu = (((t - 3) * 0.7 + i * 0.2) % 1); if (t > 3) kr(bub, 222 + Math.sin(i * 3 + uu * 7) * 4, 188 - uu * 70, 2 + (i % 2), { fill: 'rgba(255,255,255,.8)' }); }
        }
        const m2 = ogr((t - 3.3) / 3.2, 0, 1);
        at(mut, { opacity: tip === 'co2' ? m2 * 0.7 : 0 });
        postaviTekst(nat, t < 1 ? '~dodaje se hlorovodonična kiselina' : t < 3.3 ? '~izdvaja se gas (CO₂) koji ide kroz cevčicu' : '~kreč na voda se muti – dokaz CO₂'.replace(/~/, '~'));
      },
    };
  }

  // ───────────────────────── oznake opasnosti (GHS) ─────────────────────────
  const GHS = [
    { id: 'eksplozivno', n: '~eksplozivna supstanca', e: '💥' }, { id: 'zapaljivo', n: '~zapaljiva supstanca', e: '🔥' }, { id: 'oksidujuce', n: '~oksidujuća supstanca', e: '🔥⭕' },
    { id: 'gas', n: '~komprimovani gas', e: '🧯' }, { id: 'nagrizajuce', n: '~nagrizajuća supstanca', e: '🧪' }, { id: 'otrovno', n: '~otrovna supstanca', e: '☠️' },
    { id: 'skodljivo', n: '~štetna supstanca', e: '❗' }, { id: 'zdravlje', n: '~opasno po zdravlje', e: '🫁' }, { id: 'okolina', n: '~opasno po životnu sredinu', e: '🐟' },
  ];
  function oznake(s, m) {
    const ids = niz(m.znaci).length ? m.znaci : [m.znak || 'otrovno'];
    const list = ids.map((id) => GHS.find((g) => g.id === id)).filter(Boolean).slice(0, 3);
    const W = 320, H = 190, n = list.length;
    vel(s, W, H);
    const rz = Math.min(100, (W - 20) / n), x0 = W / 2 - ((n - 1) * rz) / 2;
    const skr = m.istakni === true;
    list.forEach((g, i) => {
      const x = x0 + i * rz, y = 84, r = n === 1 ? 54 : 40;
      put(s, `M${x},${y - r * 1.2} L${x + r * 1.2},${y} L${x},${y + r * 1.2} L${x - r * 1.2},${y} Z`, { fill: '#fff', stroke: '#e63946', 'stroke-width': r * 0.14, 'stroke-linejoin': 'round' });
      const t = el(s, 'text', { x, y: y + 2, 'font-size': r * 0.9, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
      t.textContent = g.e;
      if (m.natpisa !== false) tx(s, x, 168, skr ? '?' : g.n, { v: skr ? 20 : ogr(rz / (g.n.length * 0.66), 7.5, 12), b: skr ? C.zuta : C.siva });
    });
    return { trajanje: 2, pauza: 0, kadar() {} };
  }

  // ───────────────────────── zagrevanje epruvete ─────────────────────────
  function grejanje(s, m) {
    const W = 320, H = 205;
    vel(s, W, H);
    const tip = m.tip || 'pravilno', ok = tip === 'pravilno';
    const lx = ok ? 170 : 92;
    const lampa = grp(s, lx, 140, 0.8); PRIBOR.lampa.f(lampa);
    const tg = el(s, 'g');
    tg.setAttribute('transform', `translate(130 78) rotate(${ok ? -48 : 48})`);
    const tuba = epruveta(tg, 0, -30, { w: 22, h: 80, boja: '#7ec8ff', nivo: 0.33 });
    put(tg, 'M-12,-22 L12,-22', { stroke: '#8d6e63', 'stroke-width': 5 }); lin(tg, 0, -22, -2, -72, '#a1887f', 6);
    const face = el(s, 'text', { x: 262, y: 76, 'font-size': 52, 'text-anchor': 'middle' }); face.textContent = '🧑‍🔬';
    const nat = tx(s, 160, 194, ok ? '~otvor epruvete je okrenut od ljudi, epruveta je pod uglom' : '~nepravilno: otvor epruvete je usmeren ka čoveku!', { v: 10.5, b: C.zuta });
    const znak = tx(s, 262, 124, ok ? '✔' : '✘', { v: 30, b: ok ? '#55efc4' : '#ff7675' });
    const strel = el(s, 'path', { d: ok ? 'M104,52 Q80,24 40,26' : 'M160,40 Q200,34 224,58', fill: 'none', stroke: ok ? '#55efc4' : '#ff7675', 'stroke-width': 2.5, 'stroke-dasharray': '6 5' });
    return {
      trajanje: 6, pauza: 1.5,
      kadar(t) {
        tuba.postavi(0.33, '#7ec8ff', 0.7);
        mehurici(tuba.meh, tuba.h, t, 0.3, 0.33);
        strel.setAttribute('stroke-dashoffset', String(-t * 18));
      },
    };
  }

  // ───────────────────────── lakmus hartija ─────────────────────────
  function lakmus(s, m) {
    const W = 320, H = 190;
    vel(s, W, H);
    const tip = m.tip || 'kiselina'; // kiselina | baza | neutralno
    const crvena = '#d6402f', plava = '#3f68d6';
    el(s, 'ellipse', { cx: 160, cy: 120, rx: 100, ry: 28, fill: STAKLO_F, stroke: STAKLO, 'stroke-width': 2.2 });
    const traka = (x, b0, nova) => {
      const r = el(s, 'rect', { x: x - 28, y: 98, width: 56, height: 30, rx: 2, fill: b0, stroke: '#0b1826', 'stroke-width': 0.5 });
      return r;
    };
    const A_ = traka(120, plava), B_ = traka(200, crvena);
    const sipka = el(s, 'g'); // stakleni štapić sa kapi
    lin(sipka, 0, 0, 44, -64, STAKLO, 4);
    const kap = kr(sipka, 0, 7, 3, { fill: tip === 'baza' ? '#a8d8ff' : '#e6f3a0', opacity: 0.9 });
    tx(s, 120, 160, '~plava hartija', { v: 11, b: plava }); tx(s, 200, 160, '~crvena hartija', { v: 11, b: crvena });
    const nat = tx(s, 160, 20, '', { v: 12, b: C.zuta });
    return {
      trajanje: 6, pauza: 1.5,
      kadar(t) {
        const idx = t < 2.6 ? 0 : 1, u = glatko(((t < 2.6 ? t : t - 2.6)) / 1.2);
        const x = idx === 0 ? 120 : 200;
        sipka.setAttribute('transform', `translate(${f2(x - 6)} ${f2(86 - 30 * (1 - glatko((idx === 0 ? t : t - 2.6) / 0.7)))})`);
        const rp = glatko((t - 0.9) / 1.0), rc = glatko((t - 3.5) / 1.0);
        const cilj = tip === 'kiselina' ? [crvena, crvena] : tip === 'baza' ? [plava, plava] : [plava, crvena];
        A_.setAttribute('fill', mixRgb(plava, cilj[0], rp)); B_.setAttribute('fill', mixRgb(crvena, cilj[1], rc));
        postaviTekst(nat, t < 0.9 ? '~dodaje se rastvor na hartiju' : tip === 'kiselina' ? '~kiselina boji lakmus u crveno' : tip === 'baza' ? '~baza boji lakmus u plavo' : '~neutralan rastvor ne menja boju lakmusa');
      },
    };
  }

  // ───────────────────────── mešanje rastvora (određivanje nepoznatih) ─────────────────────────
  function mesanje(s, m) {
    const W = 320, H = 222;
    vel(s, W, H);
    const rez = m.tabela || [ // A, B, V, G → rezultat mešanja parova
      ['', '↓', '–', '↑'], ['↓', '', '↓', '–'], ['–', '↓', '', '–'], ['↑', '–', '–', ''],
    ];
    const sl = ['1', '2', '3', '4'];
    const x0 = 80, y0 = 36, c = 40;
    const sk = m.skrij !== false;
    for (let i = 0; i < 4; i++) {
      tx(s, x0 + i * c + c / 2, y0 - 14, sl[i], { v: 14 }); tx(s, x0 - 16, y0 + i * c + c / 2, sl[i], { v: 14 });
    }
    const celije = [];
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      el(s, 'rect', { x: x0 + j * c, y: y0 + i * c, width: c, height: c, fill: i === j ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.1)', stroke: C.tamna, 'stroke-width': 1.4 });
      celije.push({ i, j, e: tx(s, x0 + j * c + c / 2, y0 + i * c + c / 2, '', { v: 22, b: C.bela }) });
    }
    const nat = tx(s, 160, 212, '', { v: 11, b: C.zuta });
    return {
      trajanje: 7, pauza: 2,
      kadar(t) {
        let k = 0;
        postaviTekst(nat, '~↓ talog   ↑ gas   – nema promene');
        for (const ce of celije) {
          if (ce.i === ce.j) continue;
          const par = Math.min(ce.i, ce.j) * 4 + Math.max(ce.i, ce.j);
          const red = [1, 2, 3, 6, 7, 11].indexOf(par);
          const vidi = t > 0.5 + red * 0.9;
          const z = rez[ce.i][ce.j];
          postaviTekst(ce.e, vidi ? z : '');
          ce.e.setAttribute('fill', z === '↓' ? '#fff' : z === '↑' ? '#74b9ff' : C.siva);
        }
      },
    };
  }

  // ───────────────────────── mirisanje ─────────────────────────
  function mirisanje(s, m) {
    const W = 320, H = 180;
    vel(s, W, H);
    const tuba = grp(s, 120, 60); tuba.setAttribute('transform', 'translate(130 90) rotate(60)');
    const e = epruveta(tuba, 0, -40, { w: 24, h: 90, boja: '#dfe6e9', nivo: 0.25 });
    const lice = el(s, 'text', { x: 250, y: 84, 'font-size': 56, 'text-anchor': 'middle' }); lice.textContent = '🙂';
    const ruka = el(s, 'text', { x: 150, y: 60, 'font-size': 30, 'text-anchor': 'middle' }); ruka.textContent = '🖐️';
    const para = el(s, 'g');
    tx(s, 160, 166, '~para se pažljivo usmerava rukom ka nosu', { v: 11, b: C.zuta });
    return {
      trajanje: 4, pauza: 0,
      kadar(t) {
        ruka.setAttribute('transform', `translate(${f2(Math.sin(t * 5) * 8)} ${f2(Math.cos(t * 5) * 4)})`);
        while (para.firstChild) para.removeChild(para.firstChild);
        for (let i = 0; i < 5; i++) {
          const u = ((t * 0.6 + i * 0.2) % 1);
          kr(para, lerp(140, 215, u), lerp(78, 80, u) + Math.sin(u * 9 + i) * 8, 2 + u * 3, { fill: '#cfe8ff', opacity: 0.8 * (1 - u) });
        }
      },
    };
  }

  // ───────────────────────── destilacija ─────────────────────────
  function destilacija(s, m) {
    const W = 320, H = 210;
    vel(s, W, H);
    el(s, 'rect', { x: 10, y: 196, width: 300, height: 8, rx: 2, fill: '#6b7d90' });
    // lampa
    const lg = grp(s, 56, 164, 0.8); PRIBOR.lampa.f(lg);
    // balon sa smešom
    const bal = grp(s, 56, 100); PRIBOR.balon.f(bal);
    const ter = tx(s, 56, 30, '', { v: 11, b: C.zuta });
    // hladnjak
    put(s, 'M82,60 L214,102', { stroke: STAKLO, 'stroke-width': 14, 'stroke-linecap': 'round', opacity: 0.35 });
    put(s, 'M82,60 L214,102', { stroke: STAKLO, 'stroke-width': 2.6, 'stroke-linecap': 'round' });
    put(s, 'M100,48 L120,112', { stroke: '#74b9ff', 'stroke-width': 0 });
    const vl = el(s, 'g');
    // prijemnik
    const pr = grp(s, 252, 150); PRIBOR.erlenmajer.f(pr);
    const kapi_ = kr(s, 222, 108, 2.4, { fill: '#bfe3ff', opacity: 0 });
    const nat = tx(s, 160, 14, '', { v: 11, b: C.zuta });
    tx(s, 150, 126, '~hladnjak (voda hladi paru)', { v: 10.5, b: C.plava });
    return {
      trajanje: 8, pauza: 2,
      kadar(t) {
        while (vl.firstChild) vl.removeChild(vl.firstChild);
        const u = ogr((t - 1.5) / 3, 0, 1);
        for (let i = 0; i < 5; i++) { const p = ((t * 0.5 + i * 0.2) % 1); if (t > 1.5) kr(vl, lerp(60, 150, p), lerp(52, 82, p), 2.5 + i % 2, { fill: '#fff', opacity: 0.5 * (1 - p) }); }
        at(kapi_, { cy: 108 + ((t * 1.8) % 1) * 30, opacity: t > 3 && t < 7 ? 1 : 0 });
        postaviTekst(nat, t < 1.5 ? '~smeša se zagreva' : t < 3.5 ? '~tečnost isparava' : '~para se hladi i kondenzuje u prijemniku');
      },
    };
  }

  // ───────────────────────── frakciona destilacija nafte ─────────────────────────
  const FRAKCIJE = [
    { id: 'gas', n: '~naftni gas (C₁–C₄)', t: '< 40 °C', b: '#c8e6ff' }, { id: 'benzin', n: '~benzin (C₅–C₁₀)', t: '40–200 °C', b: '#ffe08a' },
    { id: 'kerozin', n: '~kerozin (C₁₀–C₁₆)', t: '175–275 °C', b: '#ffbf5c' }, { id: 'dizel', n: '~dizel (C₁₅–C₂₀)', t: '250–350 °C', b: '#e8913a' },
    { id: 'mazut', n: '~mazut (> C₂₀)', t: '> 350 °C', b: '#8d5a2b' },
  ];
  function nafta(s, m) {
    const W = 320, H = 230;
    vel(s, W, H);
    const x0 = 50, w = 54, yT = 16, yB = 190;
    // temperaturni gradijent kolone: dole vruće (crveno), gore hladno (plavo)
    const gr = el(s, 'linearGradient', { id: 'nftg', x1: 0, y1: 0, x2: 0, y2: 1 });
    el(gr, 'stop', { offset: 0, 'stop-color': '#5aa9ff' }); el(gr, 'stop', { offset: 0.5, 'stop-color': '#ffb347' }); el(gr, 'stop', { offset: 1, 'stop-color': '#ff4d3d' });
    el(s, 'rect', { x: x0, y: yT, width: w, height: yB - yT, rx: 8, fill: 'url(#nftg)', opacity: 0.55, stroke: STAKLO, 'stroke-width': 2.4 });
    for (let i = 1; i < 12; i++) lin(s, x0, yT + i * 14.5, x0 + w, yT + i * 14.5, '#ffffff', 1.1).setAttribute('opacity', '.35');
    // peć sa sirovom naftom
    el(s, 'rect', { x: 2, y: 168, width: 36, height: 40, rx: 5, fill: '#4b5563', stroke: '#9fb3c8', 'stroke-width': 2 });
    tx(s, 20, 188, '~sirova nafta', { v: 7.5, b: '#fff' });
    lin(s, 38, 186, x0, 186, '#c0392b', 3);
    const ist = [].concat(m.istakni || []);
    const izlazi = FRAKCIJE.map((f, i) => {
      const y = yT + 14 + i * 36;
      const strel = lin(s, x0 + w, y, 150, y, f.b, 3.4);
      el(s, 'rect', { x: 150, y: y - 11, width: 14, height: 22, rx: 3, fill: f.b, opacity: 0.9 });
      const skr = m.skriveno && ist.includes(f.id);
      tx(s, 172, y - 4, skr ? '?' : f.n, { v: skr ? 14 : 9.5, a: 'start', b: ist.includes(f.id) ? C.zuta : C.bela });
      tx(s, 172, y + 8, f.t, { v: 8.5, a: 'start', b: C.siva });
      return { f, y };
    });
    const para = el(s, 'g');
    return {
      trajanje: 6, pauza: 1,
      kadar(t) {
        while (para.firstChild) para.removeChild(para.firstChild);
        for (let i = 0; i < 12; i++) { const u = ((t * 0.28 + i / 12) % 1), y = yB - u * (yB - yT - 6); kr(para, x0 + 10 + ((i * 17) % (w - 20)) + Math.sin(t * 3 + i) * 2.5, y, 2.4, { fill: '#fff', opacity: 0.55 }); }
      },
    };
  }

  // ───────────────────────── zemni gas (kratko) ─────────────────────────
  function zemniGas(s, m) {
    const W = 320, H = 200;
    vel(s, W, H);
    el(s, 'rect', { x: 0, y: 150, width: W, height: 50, fill: '#5d4037' });
    el(s, 'rect', { x: 0, y: 118, width: W, height: 32, fill: '#8d6e63', opacity: 0.8 });
    el(s, 'ellipse', { cx: 150, cy: 168, rx: 90, ry: 14, fill: '#212d3b', opacity: 0.9 });
    tx(s, 150, 169, '~nafta', { v: 10, b: '#ffbf5c' });
    el(s, 'ellipse', { cx: 150, cy: 138, rx: 90, ry: 12, fill: '#bfe3ff', opacity: 0.35 });
    tx(s, 150, 138, '~zemni gas (metan)', { v: 10, b: '#cfe8ff' });
    lin(s, 150, 60, 150, 138, '#9fb3c8', 4); el(s, 'rect', { x: 134, y: 44, width: 32, height: 18, rx: 3, fill: '#6b7d90' });
    const g = el(s, 'g');
    return { trajanje: 4, pauza: 0, kadar(t) { while (g.firstChild) g.removeChild(g.firstChild); for (let i = 0; i < 5; i++) { const u = ((t * 0.4 + i * 0.2) % 1); kr(g, 150 + Math.sin(u * 7 + i) * 5, 138 - u * 80, 3, { fill: '#cfe8ff', opacity: 1 - u }); } } };
  }

  const SCENE = { nafta, 'zemni-gas': zemniGas, pribor, epruvete, magnet, menzura, struja, toplota, tvrdoca, filtriranje, gas, oznake, grejanje, lakmus, mesanje, mirisanje, destilacija };
  function prikazi(k, m) {
    const f = Object.hasOwn(SCENE, m.scena) ? SCENE[m.scena] : null;
    if (!f) return () => {};
    const d = document.createElement('div');
    d.className = 'medij-svg medij-fizika';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'fizika');
    d.appendChild(svg);
    const sc = f(svg, m || {});
    k.appendChild(d);
    return pokreni(svg, sc);
  }
  window.Laboratorija = { prikazi, SCENE: SCENE_IMENA, PRIBOR: PRIBOR_IMENA, PRESETI: PRESETI_IMENA };
})();
