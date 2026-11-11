// Prikaz interaktivnih medija u pitanjima: slike, melodije, Morzeova azbuka, 3D molekuli,
// geometrijska tela, Borov model atoma, planete, DNK, mape, sat, emodži-rebusi, SVG.
// Svaki prikazivač vraća funkciju za čišćenje (zaustavlja animacije/zvuk).
'use strict';
(() => {

// tekst iz kviz.json koji ulazi u HTML (opis, oznake na mapi, formula) – uvek kao tekst, ne kao oznake
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const Zvuk = (() => {
  let ctx = null;
  let ugaseno = false;
  try { ugaseno = localStorage.getItem('tiho') === '1'; } catch {}
  const aktivni = new Set();
  function c() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11, H: 11 };
  function frekv(n) {
    const m = /^([A-H])([#b]?)(\d)$/.exec(n);
    if (!m) return 0;
    let s = NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
    const midi = 12 * (+m[3] + 1) + s;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
  function ton(f, t0, dur, tip = 'triangle', jacina = 0.25) {
    const a = c();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = tip;
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(jacina, t0 + 0.015);
    g.gain.setTargetAtTime(jacina * 0.6, t0 + 0.05, 0.1);
    g.gain.setTargetAtTime(0, t0 + Math.max(0.05, dur - 0.06), 0.03);
    o.connect(g).connect(a.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.2);
    aktivni.add(o);
    o.onended = () => aktivni.delete(o);
    return o;
  }
  const INSTR = { klavir: 'triangle', flauta: 'sine', orgulje: 'square', violina: 'sawtooth', truba: 'sawtooth', fagot: 'square' };
  // note: "E4 E4 F4 G4/2 R/0.5 ..." – trajanje u dobama (podrazumevano 1)
  function melodija(zapis, tempo = 120, instrument = 'klavir', naNotu) {
    const a = c();
    const doba = 60 / tempo;
    let t = a.currentTime + 0.1;
    const tip = INSTR[instrument] || 'triangle';
    const jac = tip === 'sawtooth' || tip === 'square' ? 0.08 : 0.25;
    const tajmeri = [];
    zapis.trim().split(/\s+/).forEach((tok, i) => {
      const [n, d] = tok.split('/');
      const dur = (d ? +d : 1) * doba;
      if (n !== 'R') {
        // akord: C4+E4+G4
        n.split('+').forEach((x) => ton(frekv(x), t, dur * 0.95, tip, jac));
        if (naNotu) tajmeri.push(setTimeout(() => naNotu(i, n), (t - a.currentTime) * 1000));
      }
      t += dur;
    });
    return { trajanje: (t - a.currentTime) * 1000, tajmeri };
  }
  function morze(tekst, naZnak) {
    const K = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', 0: '-----' };
    const a = c();
    const j = 0.09;
    let t = a.currentTime + 0.1;
    const tajmeri = [];
    for (const z of tekst.toUpperCase()) {
      if (z === ' ') { t += j * 4; continue; }
      for (const s of K[z] || '') {
        const d = s === '.' ? j : j * 3;
        ton(700, t, d, 'sine', 0.2);
        if (naZnak) {
          const start = (t - a.currentTime) * 1000;
          tajmeri.push(setTimeout(() => naZnak(true), start), setTimeout(() => naZnak(false), start + d * 1000));
        }
        t += d + j;
      }
      t += j * 2;
    }
    return { trajanje: (t - a.currentTime) * 1000, tajmeri };
  }
  function efekat(vrsta) {
    if (ugaseno) return;
    try {
      const a = c();
      const t = a.currentTime;
      if (vrsta === 'tacno') { ton(660, t, 0.12, 'triangle', 0.2); ton(880, t + 0.12, 0.25, 'triangle', 0.2); }
      else if (vrsta === 'netacno') { ton(200, t, 0.3, 'sawtooth', 0.07); ton(150, t + 0.15, 0.35, 'sawtooth', 0.07); }
      else if (vrsta === 'klik') ton(520, t, 0.05, 'sine', 0.12);
      else if (vrsta === 'tik') ton(1000, t, 0.03, 'sine', 0.05);
      else if (vrsta === 'fanfare') [523, 659, 784, 1046].forEach((f, i) => ton(f, t + i * 0.13, i === 3 ? 0.6 : 0.14, 'triangle', 0.18));
      else if (vrsta === 'bubanj') for (let i = 0; i < 12; i++) ton(90 + Math.random() * 30, t + i * 0.07, 0.05, 'square', 0.04);
    } catch {}
  }
  function stop() { aktivni.forEach((o) => { try { o.stop(); } catch {} }); aktivni.clear(); }
  return {
    melodija, morze, efekat, stop, otkljucaj: () => { try { c(); } catch {} },
    get tiho() { return ugaseno; },
    set tiho(v) { ugaseno = v; try { localStorage.setItem('tiho', v ? '1' : '0'); } catch {} },
  };
})();

// ───────────────────────── 3D pomoćnici ─────────────────────────
function rotiraj([x, y, z], ax, ay) {
  let c = Math.cos(ay), s = Math.sin(ay);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(ax); s = Math.sin(ax);
  [y, z] = [y * c - z * s, y * s + z * c];
  return [x, y, z];
}

function platno(kontejner, visina = 260) {
  const cv = document.createElement('canvas');
  cv.className = 'medij-platno';
  kontejner.appendChild(cv);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const sirina = Math.min(kontejner.clientWidth || 340, 640);
  cv.width = sirina * dpr;
  cv.height = visina * dpr;
  cv.style.width = sirina + 'px';
  cv.style.height = visina + 'px';
  const g = cv.getContext('2d');
  g.scale(dpr, dpr);
  return { cv, g, w: sirina, h: visina };
}

// rotacija prevlačenjem prsta + automatsko okretanje
function okretanje(cv, crtaj, { brzina = 0.008, nagib = -0.35 } = {}) {
  let ax = nagib, ay = 0, auto = true, vuce = null, ziv = true, t0 = performance.now();
  const dole = (e) => { const p = e.touches ? e.touches[0] : e; vuce = { x: p.clientX, y: p.clientY, ax, ay }; auto = false; };
  const pomeri = (e) => {
    if (!vuce) return;
    const p = e.touches ? e.touches[0] : e;
    ay = vuce.ay + (p.clientX - vuce.x) * 0.012;
    ax = Math.max(-1.5, Math.min(1.5, vuce.ax + (p.clientY - vuce.y) * 0.012));
    if (e.cancelable) e.preventDefault();
  };
  const gore = () => { vuce = null; setTimeout(() => (auto = true), 2500); };
  cv.addEventListener('pointerdown', dole);
  window.addEventListener('pointermove', pomeri);
  window.addEventListener('pointerup', gore);
  cv.style.touchAction = 'none';
  function petlja(t) {
    if (!ziv) return;
    if (auto && !vuce) ay += brzina * Math.min(3, (t - t0) / 16);
    t0 = t;
    crtaj(ax, ay, t);
    requestAnimationFrame(petlja);
  }
  requestAnimationFrame(petlja);
  return () => { ziv = false; window.removeEventListener('pointermove', pomeri); window.removeEventListener('pointerup', gore); };
}

// ───────────────────────── molekuli ─────────────────────────
const ATOMI = {
  H: { boja: '#f5f6fa', r: 0.32, ime: 'vodonik' }, C: { boja: '#3d3d3d', r: 0.5, ime: 'ugljenik' },
  O: { boja: '#e84118', r: 0.48, ime: 'kiseonik' }, N: { boja: '#3867d6', r: 0.48, ime: 'azot' },
  Cl: { boja: '#4cd137', r: 0.6, ime: 'hlor' }, Na: { boja: '#8c7ae6', r: 0.62, ime: 'natrijum' },
  S: { boja: '#fbc531', r: 0.6, ime: 'sumpor' }, F: { boja: '#7bed9f', r: 0.42, ime: 'fluor' },
  Fe: { boja: '#e67e22', r: 0.6, ime: 'gvožđe' }, Ca: { boja: '#a4b0be', r: 0.62, ime: 'kalcijum' },
  P: { boja: '#ff9f43', r: 0.58, ime: 'fosfor' },
};

function tetraH(c, d, bez = 0) {
  // vodonici u tetraedarskom rasporedu oko tačke c
  const dirs = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]].slice(bez);
  const k = d / Math.sqrt(3);
  return dirs.map(([x, y, z]) => ['H', c[0] + x * k, c[1] + y * k, c[2] + z * k]);
}

const MOLEKULI = {
  voda: { atomi: [['O', 0, 0, 0], ['H', 0.76, 0.59, 0], ['H', -0.76, 0.59, 0]], veze: [[0, 1], [0, 2]] },
  'ugljen-dioksid': { atomi: [['O', -1.16, 0, 0], ['C', 0, 0, 0], ['O', 1.16, 0, 0]], veze: [[0, 1, 2], [1, 2, 2]] },
  metan: { atomi: [['C', 0, 0, 0], ...tetraH([0, 0, 0], 1.09)], veze: [[0, 1], [0, 2], [0, 3], [0, 4]] },
  amonijak: { atomi: [['N', 0, 0.12, 0], ['H', 0.94, -0.26, 0], ['H', -0.47, -0.26, 0.81], ['H', -0.47, -0.26, -0.81]], veze: [[0, 1], [0, 2], [0, 3]] },
  kiseonik: { atomi: [['O', -0.6, 0, 0], ['O', 0.6, 0, 0]], veze: [[0, 1, 2]] },
  azot: { atomi: [['N', -0.55, 0, 0], ['N', 0.55, 0, 0]], veze: [[0, 1, 3]] },
  vodonik: { atomi: [['H', -0.37, 0, 0], ['H', 0.37, 0, 0]], veze: [[0, 1]] },
  ozon: { atomi: [['O', 0, 0.3, 0], ['O', 1.08, -0.36, 0], ['O', -1.08, -0.36, 0]], veze: [[0, 1, 2], [0, 2]] },
  hlorovodonik: { atomi: [['Cl', 0, 0, 0], ['H', 1.27, 0, 0]], veze: [[0, 1]] },
  'vodonik-peroksid': { atomi: [['O', 0, 0.72, 0], ['O', 0, -0.72, 0], ['H', 0.9, 0.95, 0.2], ['H', -0.2, -0.95, 0.9]], veze: [[0, 1], [0, 2], [1, 3]] },
  etanol: {
    atomi: [['C', -0.75, 0, 0], ['C', 0.75, 0, 0], ['O', 1.25, 1.3, 0], ['H', 2.2, 1.3, 0],
      ['H', -1.15, -1.0, 0.1], ['H', -1.15, 0.5, 0.88], ['H', -1.15, 0.5, -0.88], ['H', 1.12, -0.5, 0.88], ['H', 1.12, -0.5, -0.88]],
    veze: [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [0, 6], [1, 7], [1, 8]],
  },
  benzen: (() => {
    const atomi = [], veze = [];
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      atomi.push(['C', 1.39 * Math.cos(a), 1.39 * Math.sin(a), 0]);
    }
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      atomi.push(['H', 2.47 * Math.cos(a), 2.47 * Math.sin(a), 0]);
      veze.push([i, (i + 1) % 6, i % 2 ? 1 : 2], [i, i + 6]);
    }
    return { atomi, veze };
  })(),
  'sumporna-kiselina': {
    atomi: [['S', 0, 0, 0], ['O', 0.83, 0.83, 0.83], ['O', -0.83, -0.83, 0.83], ['O', -0.83, 0.83, -0.83], ['O', 0.83, -0.83, -0.83], ['H', -1.5, 1.6, -0.9], ['H', 1.6, -1.5, -0.9]],
    veze: [[0, 1, 2], [0, 2, 2], [0, 3], [0, 4], [3, 5], [4, 6]],
  },
  so: (() => {
    const atomi = [], veze = [], idx = {};
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      idx[[x, y, z]] = atomi.length;
      atomi.push([(x + y + z) % 2 === 0 ? 'Cl' : 'Na', x * 1.4, y * 1.4, z * 1.4]);
    }
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      if (x < 1) veze.push([idx[[x, y, z]], idx[[x + 1, y, z]]]);
      if (y < 1) veze.push([idx[[x, y, z]], idx[[x, y + 1, z]]]);
      if (z < 1) veze.push([idx[[x, y, z]], idx[[x, y, z + 1]]]);
    }
    return { atomi, veze, tanke: true };
  })(),
  dijamant: (() => {
    const baza = [[0, 0, 0], [0, 2, 2], [2, 0, 2], [2, 2, 0], [1, 1, 1], [1, 3, 3], [3, 1, 3], [3, 3, 1]];
    const atomi = [];
    for (const [x, y, z] of baza) atomi.push(['C', (x - 1.5) * 0.9, (y - 1.5) * 0.9, (z - 1.5) * 0.9]);
    const veze = [];
    for (let i = 0; i < atomi.length; i++) for (let j = i + 1; j < atomi.length; j++) {
      const d = Math.hypot(atomi[i][1] - atomi[j][1], atomi[i][2] - atomi[j][2], atomi[i][3] - atomi[j][3]);
      if (d < 1.6) veze.push([i, j]);
    }
    return { atomi, veze };
  })(),
  glukoza: (() => {
    // pojednostavljen šestočlani prsten (piranoza)
    const atomi = [], veze = [];
    const prsten = ['O', 'C', 'C', 'C', 'C', 'C'];
    prsten.forEach((e, i) => {
      const a = (i * Math.PI) / 3;
      atomi.push([e, 1.45 * Math.cos(a), 1.45 * Math.sin(a), i % 2 ? 0.25 : -0.25]);
    });
    for (let i = 0; i < 6; i++) veze.push([i, (i + 1) % 6]);
    [1, 2, 3, 4].forEach((ci, k) => {
      const a = (ci * Math.PI) / 3;
      const o = atomi.length;
      atomi.push(['O', 2.6 * Math.cos(a), 2.6 * Math.sin(a), k % 2 ? 0.9 : -0.9]);
      atomi.push(['H', 3.3 * Math.cos(a), 3.3 * Math.sin(a), k % 2 ? 1.3 : -1.3]);
      veze.push([ci, o], [o, o + 1]);
    });
    const c6 = atomi.length;
    atomi.push(['C', 2.7 * Math.cos(5 * Math.PI / 3), 2.7 * Math.sin(5 * Math.PI / 3), 1.0]);
    atomi.push(['O', 3.4, -2.9, 0.4], ['H', 4.2, -2.9, 0.8]);
    veze.push([5, c6], [c6, c6 + 1], [c6 + 1, c6 + 2]);
    return { atomi, veze };
  })(),
};

function prikaziMolekul(k, m) {
  const def = m.atomi ? m : MOLEKULI[m.ime];
  if (!def) return prikaziTekst(k, { tekst: m.formula || '?' });
  const { cv, g, w, h } = platno(k, m.visina || 270);
  const at = def.atomi.map(([e, x, y, z]) => ({ e, p: [x, y, z] }));
  // centriranje i razmera
  const cx = at.reduce((s, a) => s + a.p[0], 0) / at.length;
  const cy = at.reduce((s, a) => s + a.p[1], 0) / at.length;
  const cz = at.reduce((s, a) => s + a.p[2], 0) / at.length;
  at.forEach((a) => (a.p = [a.p[0] - cx, a.p[1] - cy, a.p[2] - cz]));
  const R = Math.max(1, ...at.map((a) => Math.hypot(...a.p) + (ATOMI[a.e]?.r || 0.5)));
  const sk = Math.min(w, h) / 2.3 / R;
  const legenda = document.createElement('div');
  legenda.className = 'legenda';
  const elementi = [...new Set(at.map((a) => a.e))];
  legenda.innerHTML = (m.formula && m.prikaziFormulu ? `<b class="formula-mala">${esc(m.formula)}</b>` : '') +
    (m.legenda === false ? '' : elementi.map((e) => `<span><i style="background:${ATOMI[e]?.boja || '#ccc'}"></i>${m.skrijImena ? `<span data-lat>${e}</span>` : ATOMI[e]?.ime || e}</span>`).join(''));
  k.appendChild(legenda);
  return okretanje(cv, (ax, ay) => {
    g.clearRect(0, 0, w, h);
    const P = at.map((a) => {
      const [x, y, z] = rotiraj(a.p, ax, ay);
      const f = 1 / (1 + z * 0.06);
      return { x: w / 2 + x * sk * f, y: h / 2 + y * sk * f, z, f, a };
    });
    const stavke = [];
    for (const [i, j, red = 1] of def.veze) stavke.push({ z: (P[i].z + P[j].z) / 2 + 0.01, veza: [P[i], P[j], red] });
    P.forEach((p) => stavke.push({ z: p.z, atom: p }));
    stavke.sort((a, b) => b.z - a.z);
    for (const s of stavke) {
      if (s.veza) {
        const [A, B, red] = s.veza;
        const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1;
        const nx = -dy / L, ny = dx / L;
        g.lineCap = 'round';
        for (let r = 0; r < red; r++) {
          const o = (r - (red - 1) / 2) * 6;
          g.strokeStyle = '#8a8fa3';
          g.lineWidth = def.tanke ? 2 : red > 1 ? 3.5 : 6;
          g.beginPath();
          g.moveTo(A.x + nx * o, A.y + ny * o);
          g.lineTo(B.x + nx * o, B.y + ny * o);
          g.stroke();
        }
      } else {
        const p = s.atom;
        const info = ATOMI[p.a.e] || { boja: '#ccc', r: 0.5 };
        const r = info.r * sk * p.f * (def.atomi.length < 6 ? 0.72 : 0.85);
        const gr = g.createRadialGradient(p.x - r * 0.35, p.y - r * 0.35, r * 0.1, p.x, p.y, r);
        gr.addColorStop(0, '#ffffff');
        gr.addColorStop(0.25, info.boja);
        gr.addColorStop(1, shade(info.boja, -0.55));
        g.fillStyle = gr;
        g.beginPath();
        g.arc(p.x, p.y, r, 0, Math.PI * 2);
        g.fill();
        if (m.oznake) {
          g.fillStyle = p.a.e === 'H' ? '#333' : '#fff';
          g.font = `bold ${Math.max(10, r * 0.8)}px system-ui`;
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          g.fillText(p.a.e, p.x, p.y);
        }
      }
    }
  });
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
  const t = f < 0 ? 0 : 255, p = Math.abs(f);
  r = Math.round((t - r) * p + r); gg = Math.round((t - gg) * p + gg); b = Math.round((t - b) * p + b);
  return `rgb(${r},${gg},${b})`;
}

// ───────────────────────── geometrijska tela ─────────────────────────
const FI = (1 + Math.sqrt(5)) / 2;
function temenaTela(oblik) {
  const T = [];
  const pm = [1, -1];
  switch (oblik) {
    case 'tetraedar': return [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
    case 'kocka': for (const x of pm) for (const y of pm) for (const z of pm) T.push([x, y, z]); return T;
    case 'kvadar': for (const x of pm) for (const y of pm) for (const z of pm) T.push([x * 1.5, y * 0.8, z]); return T;
    case 'oktaedar': return [[1.4, 0, 0], [-1.4, 0, 0], [0, 1.4, 0], [0, -1.4, 0], [0, 0, 1.4], [0, 0, -1.4]];
    case 'ikosaedar': for (const a of pm) for (const b of pm) T.push([0, a, b * FI], [a, b * FI, 0], [b * FI, 0, a]); return T;
    case 'dodekaedar':
      for (const x of pm) for (const y of pm) for (const z of pm) T.push([x, y, z]);
      for (const a of pm) for (const b of pm) T.push([0, a / FI, b * FI], [a / FI, b * FI, 0], [b * FI, 0, a / FI]);
      return T;
    default: {
      let m;
      if ((m = /^prizma(\d+)$/.exec(oblik))) {
        const n = +m[1];
        for (let i = 0; i < n; i++) { const a = (i * 2 * Math.PI) / n; T.push([Math.cos(a) * 1.2, -1, Math.sin(a) * 1.2], [Math.cos(a) * 1.2, 1, Math.sin(a) * 1.2]); }
        return T;
      }
      if ((m = /^piramida(\d+)$/.exec(oblik))) {
        const n = +m[1];
        for (let i = 0; i < n; i++) { const a = (i * 2 * Math.PI) / n + Math.PI / 4; T.push([Math.cos(a) * 1.4, 1, Math.sin(a) * 1.4]); }
        T.push([0, -1.3, 0]);
        return T;
      }
      if ((m = /^bipiramida(\d+)$/.exec(oblik))) {
        const n = +m[1];
        for (let i = 0; i < n; i++) { const a = (i * 2 * Math.PI) / n; T.push([Math.cos(a) * 1.3, 0, Math.sin(a) * 1.3]); }
        T.push([0, -1.5, 0], [0, 1.5, 0]);
        return T;
      }
      return [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
    }
  }
}

// strane konveksnog tela iz temena
function straneTela(V) {
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const kr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const sk = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const strane = [];
  const vidjene = new Set();
  const n = V.length;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
    let nor = kr(sub(V[j], V[i]), sub(V[k], V[i]));
    const L = Math.hypot(...nor);
    if (L < 1e-6) continue;
    nor = nor.map((x) => x / L);
    const d = sk(nor, V[i]);
    let poz = 0, neg = 0;
    const na = [];
    V.forEach((v, q) => { const s = sk(nor, v) - d; if (Math.abs(s) < 1e-4) na.push(q); else if (s > 0) poz++; else neg++; });
    if (poz && neg) continue;
    const kljuc = na.slice().sort((a, b) => a - b).join(',');
    if (vidjene.has(kljuc)) continue;
    vidjene.add(kljuc);
    if (poz) nor = nor.map((x) => -x);
    const c = na.reduce((s, q) => [s[0] + V[q][0] / na.length, s[1] + V[q][1] / na.length, s[2] + V[q][2] / na.length], [0, 0, 0]);
    const u = sub(V[na[0]], c);
    const vv = kr(nor, u);
    na.sort((a, b) => Math.atan2(sk(sub(V[a], c), vv), sk(sub(V[a], c), u)) - Math.atan2(sk(sub(V[b], c), vv), sk(sub(V[b], c), u)));
    strane.push({ t: na, n: nor });
  }
  return strane;
}

function prikaziTelo(k, m) {
  const { cv, g, w, h } = platno(k, m.visina || 270);
  let V, F, krive = null;
  if (m.oblik === 'valjak' || m.oblik === 'kupa' || m.oblik === 'lopta') krive = m.oblik;
  else { V = temenaTela(m.oblik); F = straneTela(V); }
  const R = V ? Math.max(...V.map((v) => Math.hypot(...v))) : 1.6;
  const sk = Math.min(w, h) / 2.4 / R;
  const boja = m.boja || '#6c5ce7';
  return okretanje(cv, (ax, ay) => {
    g.clearRect(0, 0, w, h);
    if (krive) return crtajKrivo(g, w, h, krive, ax, ay, boja);
    const P = V.map((v) => rotiraj(v, ax, ay));
    const lista = F.map((f) => ({ f, z: f.t.reduce((s, q) => s + P[q][2], 0) / f.t.length, nz: rotiraj(f.n, ax, ay)[2] }));
    lista.sort((a, b) => b.z - a.z);
    for (const { f, nz } of lista) {
      const prednja = nz < 0;
      g.beginPath();
      f.t.forEach((q, i) => { const x = w / 2 + P[q][0] * sk, y = h / 2 + P[q][1] * sk; i ? g.lineTo(x, y) : g.moveTo(x, y); });
      g.closePath();
      const svetlo = Math.max(0.15, -nz);
      g.fillStyle = prednja ? hexA(boja, 0.25 + 0.45 * svetlo) : hexA(boja, 0.08);
      g.fill();
      g.strokeStyle = prednja ? '#fff' : 'rgba(255,255,255,.35)';
      g.setLineDash(prednja ? [] : [4, 4]);
      g.lineWidth = prednja ? 2.2 : 1.2;
      g.stroke();
    }
    g.setLineDash([]);
    if (m.temena !== false) for (const p of P) { g.fillStyle = '#ffeaa7'; g.beginPath(); g.arc(w / 2 + p[0] * sk, h / 2 + p[1] * sk, 4, 0, 7); g.fill(); }
  });
}

function crtajKrivo(g, w, h, oblik, ax, ay, boja) {
  const sk = Math.min(w, h) / 3.4;
  const N = 40;
  const tacka = (x, y, z) => { const p = rotiraj([x, y, z], ax, ay); return [w / 2 + p[0] * sk, h / 2 + p[1] * sk, p[2]]; };
  g.strokeStyle = '#fff';
  g.lineWidth = 1.5;
  g.fillStyle = hexA(boja, 0.35);
  if (oblik === 'lopta') {
    const gr = g.createRadialGradient(w / 2 - sk * 0.4, h / 2 - sk * 0.4, 5, w / 2, h / 2, sk * 1.3);
    gr.addColorStop(0, '#fff'); gr.addColorStop(0.3, boja); gr.addColorStop(1, shade(boja, -0.6));
    g.fillStyle = gr; g.beginPath(); g.arc(w / 2, h / 2, sk * 1.3, 0, 7); g.fill();
    for (let m = 0; m < 6; m++) {
      g.beginPath();
      for (let i = 0; i <= N; i++) { const t = (i / N) * Math.PI * 2, f = (m / 6) * Math.PI; const p = tacka(1.3 * Math.cos(t) * Math.cos(f), 1.3 * Math.sin(t), 1.3 * Math.cos(t) * Math.sin(f)); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
      g.strokeStyle = 'rgba(255,255,255,.3)'; g.stroke();
    }
    return;
  }
  const gornji = oblik === 'kupa' ? 0 : 1;
  const krug = (y, r) => { g.beginPath(); for (let i = 0; i <= N; i++) { const t = (i / N) * Math.PI * 2; const p = tacka(r * Math.cos(t), y, r * Math.sin(t)); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } };
  krug(1, 1.1); g.fill(); g.stroke();
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2, t2 = ((i + 1) / N) * Math.PI * 2;
    const a = tacka(1.1 * Math.cos(t), 1, 1.1 * Math.sin(t)), b = tacka(1.1 * Math.cos(t2), 1, 1.1 * Math.sin(t2));
    const c = tacka(gornji * 1.1 * Math.cos(t2), -1.2, gornji * 1.1 * Math.sin(t2)), d = tacka(gornji * 1.1 * Math.cos(t), -1.2, gornji * 1.1 * Math.sin(t));
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]); g.closePath();
    g.fillStyle = hexA(boja, 0.12 + 0.25 * Math.abs(Math.cos(t + ay))); g.fill();
  }
  if (gornji) { krug(-1.2, 1.1); g.fillStyle = hexA(boja, 0.5); g.fill(); g.stroke(); }
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}

// ───────────────────────── Borov model atoma ─────────────────────────
function prikaziAtom(k, m) {
  const { cv, g, w, h } = platno(k, 270);
  const ljuske = m.ljuske || [2, 4];
  const Rmax = Math.min(w, h) / 2 - 14;
  let ziv = true;
  function crtaj(t) {
    if (!ziv) return;
    g.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const jez = 16 + Math.min(10, ljuske.length * 2);
    const gr = g.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, jez);
    gr.addColorStop(0, '#ffd3b4'); gr.addColorStop(1, '#d35400');
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, jez, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.font = 'bold 13px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(m.jezgro || '?', cx, cy);
    ljuske.forEach((n, i) => {
      const r = jez + 14 + ((Rmax - jez - 14) * (i + 1)) / ljuske.length;
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1.2;
      g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke();
      for (let e = 0; e < n; e++) {
        const a = (e / n) * Math.PI * 2 + (t / 1000) * (1.4 / (i + 1)) * (i % 2 ? -1 : 1);
        g.fillStyle = '#74b9ff';
        g.beginPath(); g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 5.5, 0, 7); g.fill();
        g.strokeStyle = '#fff'; g.lineWidth = 1; g.stroke();
      }
    });
    requestAnimationFrame(crtaj);
  }
  requestAnimationFrame(crtaj);
  return () => (ziv = false);
}

// ───────────────────────── planete ─────────────────────────
const PLANETE = {
  merkur: { b: ['#9e9e9e', '#6d6d6d'], krateri: true }, venera: { b: ['#f5d6a0', '#d9a55b'] },
  zemlja: { b: ['#2e86de', '#1b4f8a'], kopno: '#27ae60', oblaci: true }, mesec: { b: ['#cfcfcf', '#8a8a8a'], krateri: true },
  mars: { b: ['#e2734a', '#9c3d1d'], kape: true }, jupiter: { b: ['#d8b48a', '#a67c52'], trake: ['#c9905d', '#f1dcc1', '#b97b4b', '#e8cfae'], pega: true },
  saturn: { b: ['#f0d9a0', '#c8a96a'], trake: ['#e6c98b', '#f7e6bd'], prstenovi: true }, uran: { b: ['#a8e6f0', '#5fbfcf'], prstenovi: 'tanki', nagib: 1.4 },
  neptun: { b: ['#4b70dd', '#2a3f9e'], trake: ['#3d5fc9'] }, sunce: { b: ['#fff3a0', '#ff9f1a'], sjaj: true },
};
function prikaziPlanetu(k, m) {
  const { cv, g, w, h } = platno(k, 260);
  const P = PLANETE[m.ime] || PLANETE.zemlja;
  const r = Math.min(w, h) / (P.prstenovi ? 4.2 : 2.8);
  let ziv = true;
  const zvezde = Array.from({ length: 60 }, () => [Math.random() * w, Math.random() * h, Math.random()]);
  const kopno = Array.from({ length: 7 }, () => [Math.random() * 6.28, (Math.random() - 0.5) * 1.6, 0.25 + Math.random() * 0.35]);
  const krateri = Array.from({ length: 14 }, () => [Math.random() * 6.28, (Math.random() - 0.5) * 2.2, 0.05 + Math.random() * 0.12]);
  function prsten(prednji, t) {
    const nag = P.nagib || 0.35;
    g.save(); g.translate(w / 2, h / 2); g.rotate(P.nagib ? 1.3 : -0.25);
    for (let i = 0; i < (P.prstenovi === 'tanki' ? 2 : 5); i++) {
      g.beginPath();
      g.ellipse(0, 0, r * (1.45 + i * 0.16), r * (1.45 + i * 0.16) * 0.28, 0, prednji ? 0 : Math.PI, prednji ? Math.PI : Math.PI * 2);
      g.strokeStyle = P.prstenovi === 'tanki' ? 'rgba(200,240,255,.5)' : `rgba(${220 - i * 15},${195 - i * 15},${150 - i * 10},${0.85 - i * 0.1})`;
      g.lineWidth = P.prstenovi === 'tanki' ? 1.5 : r * 0.1;
      g.stroke();
    }
    g.restore();
  }
  function crtaj(t) {
    if (!ziv) return;
    g.fillStyle = '#0b0f2a'; g.fillRect(0, 0, w, h);
    zvezde.forEach(([x, y, s]) => { g.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * Math.abs(Math.sin(t / 900 + s * 9))})`; g.fillRect(x, y, 1.6, 1.6); });
    const cx = w / 2, cy = h / 2;
    if (P.sjaj) { const s = g.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.8); s.addColorStop(0, 'rgba(255,200,50,.6)'); s.addColorStop(1, 'rgba(255,150,0,0)'); g.fillStyle = s; g.beginPath(); g.arc(cx, cy, r * 1.8, 0, 7); g.fill(); }
    if (P.prstenovi) prsten(false, t);
    g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.clip();
    const gr = g.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.1, cx, cy, r);
    gr.addColorStop(0, P.b[0]); gr.addColorStop(1, P.b[1]); g.fillStyle = gr; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    const rot = t / 4000;
    if (P.trake) P.trake.forEach((b, i) => { for (let j = -3; j <= 3; j++) { g.fillStyle = b + '99'; g.fillRect(cx - r, cy + j * r * 0.28 + i * r * 0.07, 2 * r, r * 0.09); } });
    if (P.pega) { const x = cx + Math.sin(rot) * r * 0.8; if (Math.cos(rot) > 0) { g.fillStyle = '#c0392b'; g.beginPath(); g.ellipse(x, cy + r * 0.3, r * 0.18 * Math.cos(rot), r * 0.1, 0, 0, 7); g.fill(); } }
    const povrs = (lista, boja) => lista.forEach(([lon, lat, s]) => {
      const a = lon + rot; if (Math.cos(a) <= 0) return;
      g.fillStyle = boja; g.beginPath(); g.ellipse(cx + Math.sin(a) * r * Math.cos(lat * 0.7), cy + lat * r * 0.55, s * r * Math.cos(a), s * r * 0.8, 0, 0, 7); g.fill();
    });
    if (P.kopno) povrs(kopno, P.kopno);
    if (P.krateri) povrs(krateri, 'rgba(0,0,0,.18)');
    if (P.kape) { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(cx, cy - r * 0.95, r * 0.4, r * 0.12, 0, 0, 7); g.fill(); }
    if (P.oblaci) povrs(krateri, 'rgba(255,255,255,.55)');
    const senka = g.createRadialGradient(cx - r * 0.5, cy - r * 0.5, r * 0.3, cx, cy, r * 1.15);
    senka.addColorStop(0, 'rgba(0,0,0,0)'); senka.addColorStop(1, 'rgba(0,0,0,.65)');
    if (!P.sjaj) { g.fillStyle = senka; g.fillRect(cx - r, cy - r, 2 * r, 2 * r); }
    g.restore();
    if (P.prstenovi) prsten(true, t);
    requestAnimationFrame(crtaj);
  }
  requestAnimationFrame(crtaj);
  return () => (ziv = false);
}

// ───────────────────────── DNK ─────────────────────────
function prikaziDNK(k) {
  const { cv, g, w, h } = platno(k, 280);
  const BAZE = ['#e84118', '#4cd137', '#0097e6', '#fbc531'];
  const parovi = Array.from({ length: 22 }, () => Math.floor(Math.random() * 4));
  return okretanje(cv, (ax, ay) => {
    g.clearRect(0, 0, w, h);
    const st = [];
    parovi.forEach((b, i) => {
      const y = (i - parovi.length / 2) * 0.32, a = i * 0.6;
      const p1 = rotiraj([Math.cos(a), y, Math.sin(a)], 0.1, ay + Math.PI / 2);
      const p2 = rotiraj([Math.cos(a + Math.PI), y, Math.sin(a + Math.PI)], 0.1, ay + Math.PI / 2);
      st.push({ z: (p1[2] + p2[2]) / 2, l: [p1, p2, b] }, { z: p1[2], s: [p1, '#dfe6e9'] }, { z: p2[2], s: [p2, '#a29bfe'] });
    });
    st.sort((a, b) => b.z - a.z);
    const sk = h / 8.5, X = (p) => w / 2 + p[1] * sk, Y = (p) => h / 2 + p[0] * sk * 1.1;
    for (const s of st) {
      if (s.l) {
        const [a, b, t] = s.l, mx = (X(a) + X(b)) / 2, my = (Y(a) + Y(b)) / 2;
        g.lineWidth = 5; g.strokeStyle = BAZE[t]; g.beginPath(); g.moveTo(X(a), Y(a)); g.lineTo(mx, my); g.stroke();
        g.strokeStyle = BAZE[3 - t]; g.beginPath(); g.moveTo(mx, my); g.lineTo(X(b), Y(b)); g.stroke();
      } else {
        const [p, c] = s.s; const r = 7 / (1 + p[2] * 0.15);
        g.fillStyle = c; g.beginPath(); g.arc(X(p), Y(p), r, 0, 7); g.fill();
      }
    }
  }, { brzina: 0.02, nagib: 0 });
}

// ───────────────────────── mape ─────────────────────────
let geoPodaci = null;
async function geo() {
  if (!geoPodaci) geoPodaci = await (await fetch('/geo/svet.json')).json();
  return geoPodaci;
}
const OBLASTI = {
  svet: [-170, -58, 180, 80], evropa: [-25, 34, 45, 71], balkan: [13, 39, 30, 47.5], srbija: [18.6, 41.75, 23.2, 46.3],
  afrika: [-20, -36, 53, 38], azija: [25, -11, 150, 75], 'j-amerika': [-85, -57, -32, 14], 's-amerika': [-170, 5, -50, 75],
  australija: [110, -48, 180, -8], 'bliski-istok': [25, 12, 63, 43],
};
async function prikaziMapu(k, m) {
  const D = await geo();
  const kutija = m.kutija || OBLASTI[m.oblast || 'evropa'];
  const [x0, y0, x1, y1] = kutija;
  const kos = Math.cos((((y0 + y1) / 2) * Math.PI) / 180);
  const W = 1000, H = Math.round((1000 * (y1 - y0)) / ((x1 - x0) * kos));
  const px = (lon, lat) => [((lon - x0) / (x1 - x0)) * W, ((y1 - lat) / (y1 - y0)) * H];
  const putanja = (prsten) => 'M' + prsten.map(([a, b]) => px(a, b).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z';
  const linija = (l) => 'M' + l.map(([a, b]) => px(a, b).map((v) => v.toFixed(1)).join(',')).join('L');
  const istakni = new Set(m.istakni || (m.silueta ? [m.silueta] : []));
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="mapa" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="var(--more)"/>`;
  if (m.silueta) {
    // samo obris države, bez suseda – uvećano
    // samo glavno kopno i obližnja ostrva (bez prekomorskih teritorija, npr. Francuske Gvajane)
    const sve = D.drzave[m.silueta] || [];
    const bbox = (r) => r.reduce(([a, b, c, d], [x, y]) => [Math.min(a, x), Math.min(b, y), Math.max(c, x), Math.max(d, y)], [1e9, 1e9, -1e9, -1e9]);
    const vel = (r) => { const [a, b, c, d] = bbox(r); return (c - a) * (d - b); };
    const glavni = sve.reduce((x, r) => (vel(r) > vel(x) ? r : x), sve[0] || []);
    const [ga, gb, gc, gd] = bbox(glavni);
    const doseg = m.doseg ?? Math.max(4, (gc - ga + gd - gb) * 0.6);
    const rings = sve.filter((r) => { const [a, b, c, d] = bbox(r); return a < gc + doseg && c > ga - doseg && b < gd + doseg && d > gb - doseg; });
    let mx = 1e9, my = 1e9, Mx = -1e9, My = -1e9;
    rings.flat().forEach(([a, b]) => { mx = Math.min(mx, a); Mx = Math.max(Mx, a); my = Math.min(my, b); My = Math.max(My, b); });
    const kk = Math.cos(((my + My) / 2) * Math.PI / 180);
    const sw = (Mx - mx) * kk, sh = My - my, s = Math.min(900 / sw, 600 / sh);
    const P = (a, b) => [50 + ((a - mx) * kk) * s + (900 - sw * s) / 2, 50 + (My - b) * s + (600 - sh * s) / 2];
    svg = `<svg viewBox="0 0 1000 700" class="mapa silueta" xmlns="http://www.w3.org/2000/svg"><rect width="1000" height="700" fill="var(--kartica)"/>`;
    svg += `<path d="${rings.map((r) => 'M' + r.map(([a, b]) => P(a, b).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z').join('')}" fill="var(--istaknuto)" stroke="#fff" stroke-width="4"/>`;
    k.insertAdjacentHTML('beforeend', svg + '</svg>');
    return () => {};
  }
  for (const [kod, rings] of Object.entries(D.drzave)) {
    const ist = istakni.has(kod);
    const vidljivo = rings.some((r) => r.some(([a, b]) => a > x0 - 15 && a < x1 + 15 && b > y0 - 15 && b < y1 + 15));
    if (!vidljivo) continue;
    const dom = !ist && kod === 'SRB' && !istakni.size && ['srbija', 'balkan'].includes(m.oblast);
    svg += `<path d="${rings.map(putanja).join('')}" class="${ist ? 'drz ist' : dom ? 'drz dom' : 'drz'}"/>`;
  }
  for (const r of m.reke || []) for (const l of D.reke[r] || []) svg += `<path d="${linija(l)}" class="reka"/>`;
  for (const t of m.tacke || []) {
    const [x, y] = px(t.lon, t.lat);
    svg += `<g class="pin"><circle cx="${x}" cy="${y}" r="${W / 55}" /><circle cx="${x}" cy="${y}" r="${W / 55}" class="talas"/>`;
    if (t.oznaka) svg += `<text x="${x}" y="${y - W / 40}" text-anchor="middle">${esc(t.oznaka)}</text>`;
    svg += '</g>';
  }
  k.insertAdjacentHTML('beforeend', svg + '</svg>');
  return () => {};
}

// ───────────────────────── sat ─────────────────────────
function prikaziSat(k, m) {
  const [hh, mm] = String(m.vreme || '3:00').split(':').map(Number);
  const ugaoM = mm * 6, ugaoH = (hh % 12) * 30 + mm * 0.5;
  let s = '<svg viewBox="-110 -110 220 220" class="sat"><circle r="100" fill="var(--kartica)" stroke="#fff" stroke-width="5"/>';
  for (let i = 0; i < 60; i++) {
    const a = (i * 6 * Math.PI) / 180, d = i % 5 ? 92 : 84;
    s += `<line x1="${Math.sin(a) * d}" y1="${-Math.cos(a) * d}" x2="${Math.sin(a) * 97}" y2="${-Math.cos(a) * 97}" stroke="#fff" stroke-width="${i % 5 ? 1 : 3}"/>`;
  }
  for (let i = 1; i <= 12; i++) { const a = (i * 30 * Math.PI) / 180; s += `<text x="${Math.sin(a) * 70}" y="${-Math.cos(a) * 70 + 6}" text-anchor="middle" font-size="17" fill="#fff" font-weight="700">${i}</text>`; }
  s += `<line x1="0" y1="0" x2="0" y2="-50" stroke="#ffeaa7" stroke-width="7" stroke-linecap="round" transform="rotate(${ugaoH})"/>`;
  s += `<line x1="0" y1="0" x2="0" y2="-80" stroke="#74b9ff" stroke-width="4" stroke-linecap="round" transform="rotate(${ugaoM})"/>`;
  s += '<circle r="6" fill="#fff"/></svg>';
  k.insertAdjacentHTML('beforeend', s);
  return () => {};
}

// ───────────────────────── ostalo ─────────────────────────
function prikaziTekst(k, m) {
  const d = document.createElement('div');
  d.className = m.vrsta === 'emodzi' ? 'emodzi' : 'formula';
  d.textContent = m.tekst;
  k.appendChild(d);
  return () => {};
}

// izvorni kôd (npr. TLA+ specifikacija): monospace, poravnat levo, uvek latinicom (.kod je u NE_DIRAJ)
function prikaziKod(k, m) {
  const d = document.createElement('pre');
  d.className = 'kod';
  d.textContent = m.tekst || '';
  k.appendChild(d);
  return () => {};
}

function dugmeZvuk(k, natpis, pokreni) {
  const b = document.createElement('button');
  b.className = 'dugme-zvuk';
  b.innerHTML = `<span class="ikona-zvuk">▶</span> ${natpis}`;
  const vis = document.createElement('div');
  vis.className = 'vizuelizator';
  k.append(vis, b);
  let posao = null;
  const pusti = () => {
    Zvuk.stop();
    if (posao) posao.tajmeri.forEach(clearTimeout);
    b.classList.add('svira');
    posao = pokreni(vis);
    setTimeout(() => b.classList.remove('svira'), posao.trajanje);
  };
  b.onclick = pusti;
  return { pusti, stop: () => { Zvuk.stop(); posao?.tajmeri.forEach(clearTimeout); } };
}

function prikaziMelodiju(k, m, auto) {
  const boje = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8'];
  const d = dugmeZvuk(k, m.natpis || 'Pusti melodiju', (vis) => Zvuk.melodija(m.note, m.tempo || 120, m.instrument, (i) => {
    const n = document.createElement('span');
    n.className = 'nota';
    n.textContent = ['♪', '♫', '♩', '♬'][i % 4];
    n.style.left = 10 + Math.random() * 80 + '%';
    n.style.color = boje[i % boje.length];
    vis.appendChild(n);
    setTimeout(() => n.remove(), 1600);
  }));
  // automatsko puštanje se otkazuje ako se ekran promeni pre nego što krene
  const odlozeno = auto ? setTimeout(d.pusti, 400) : null;
  return () => { clearTimeout(odlozeno); d.stop(); };
}

function prikaziMorze(k, m, auto) {
  const d = dugmeZvuk(k, 'Pusti signal', (vis) => {
    vis.innerHTML = '<div class="morze-svetlo"></div>';
    const s = vis.firstChild;
    return Zvuk.morze(m.tekst, (on) => s.classList.toggle('upaljeno', on));
  });
  // automatsko puštanje se otkazuje ako se ekran promeni pre nego što krene
  const odlozeno = auto ? setTimeout(d.pusti, 400) : null;
  return () => { clearTimeout(odlozeno); d.stop(); };
}

function prikaziSliku(k, m, auto, paket) {
  const img = document.createElement('img');
  img.className = 'medij-slika' + (m.zamagljeno ? ' zamagljeno' : '');
  img.alt = '';
  img.src = /^(https?:|\/)/.test(m.src) ? m.src : `/kvizovi/${paket}/${m.src}`;
  if (m.isecak) img.style.objectPosition = m.isecak;
  img.onclick = () => img.classList.toggle('uvecano');
  k.appendChild(img);
  if (m.zamagljeno) setTimeout(() => img.classList.add('izostri'), 50);
  return () => {};
}

// SVG crtež iz kviz.json (pitanja predlažu i ljudi spolja, preko urednika): propuštaju se samo crtački
// elementi – bez skripti, obrada događaja (onload…), ugrađenih stranica i spoljnih veza
const SVG_ELEMENTI = new Set(['svg', 'g', 'path', 'polygon', 'polyline', 'line', 'rect', 'circle', 'ellipse', 'text', 'tspan', 'defs', 'marker',
  'lineargradient', 'radialgradient', 'stop', 'clippath', 'mask', 'pattern', 'symbol', 'use', 'title', 'desc']);
function bezbedanSVG(kod) {
  const t = document.createElement('template'); // sadržaj šablona je „mrtav“ dok se ne ubaci u stranicu
  t.innerHTML = typeof kod === 'string' ? kod : '';
  for (const el of [...t.content.querySelectorAll('*')]) {
    if (!SVG_ELEMENTI.has(el.localName.toLowerCase())) { el.remove(); continue; }
    for (const a of [...el.attributes]) {
      const ime = a.name.toLowerCase(), v = a.value.replace(/\s+/g, '');
      const veza = ime === 'href' || ime.endsWith(':href') || ime === 'src';
      if (ime.startsWith('on') || (veza && !v.startsWith('#')) || /javascript:/i.test(v) || /url\((?!['"]?#)/i.test(v)) el.removeAttribute(a.name);
    }
  }
  return t.content;
}

function prikaziSVG(k, m, auto, paket) {
  if (m.src) return prikaziSliku(k, m, auto, paket);
  const d = document.createElement('div');
  d.className = 'medij-svg';
  d.appendChild(bezbedanSVG(m.kod));
  k.appendChild(d);
  return () => {};
}

// geometrijski crtež zadatka (public/geo.js)
function prikaziGeo(k, m) {
  const d = document.createElement('div');
  d.className = 'medij-svg medij-geo';
  d.innerHTML = window.Geo.crtajGeo(m, { korak: 0 });
  k.appendChild(d);
  return () => {};
}

const PRIKAZI = {
  slika: prikaziSliku, svg: prikaziSVG, melodija: prikaziMelodiju, morze: prikaziMorze, molekul: prikaziMolekul,
  telo: prikaziTelo, atom: prikaziAtom, planeta: prikaziPlanetu, dnk: prikaziDNK, mapa: prikaziMapu,
  sat: prikaziSat, formula: prikaziTekst, emodzi: prikaziTekst, geo: prikaziGeo, kod: prikaziKod,
};

// glavna funkcija: vraća funkciju za čišćenje
function prikaziMedij(kontejner, m, { auto = false, paket = '' } = {}) {
  if (!m) return () => {};
  const f = Object.hasOwn(PRIKAZI, m.vrsta) ? PRIKAZI[m.vrsta] : null;
  if (!f) return () => {};
  kontejner.classList.add('medij', 'medij-' + m.vrsta);
  let ciscenje = () => {};
  try {
    const r = f(kontejner, m, auto, paket);
    if (r && r.then) r.then((c) => (ciscenje = c || ciscenje)).catch((e) => console.error(e));
    else if (typeof r === 'function') ciscenje = r;
  } catch (e) { console.error(e); }
  if (m.opis) kontejner.insertAdjacentHTML('beforeend', `<div class="medij-opis">${esc(m.opis)}</div>`);
  return () => ciscenje();
}

window.Mediji = { prikaziMedij, Zvuk, MOLEKULI };
})();
