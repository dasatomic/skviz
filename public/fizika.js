// Animirane fizičke scene (medij „fizika“): crtaju se same u SVG-u i vrte u petlji, bez slika i biblioteka.
//
//   { "vrsta": "fizika", "scena": "klatno", "ugao": 30, "energija": true }
//
// Scena se bira poljem "scena", podvrsta scene poljem "tip", a ostala polja su parametri (opis je iznad svake scene u SCENE).
// Natpisi: tekst koji počinje sa „~“ je srpska reč i preslovljava se u ćirilicu („~voda“); sve ostalo
// (oznake, brojevi, jedinice: „F₁“, „50 N“) ostaje latinicom. Boje: broj 0–5 (paleta) ili "#rrggbb".
// Dodir na crtež pokreće animaciju iz početka. Spisak scena: Fizika.SCENE (koristi i alati/proveri-kvizove.js).
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const BOJE = ['#74b9ff', '#fd79a8', '#55efc4', '#ffeaa7', '#a29bfe', '#fab1a0'];
  const C = {
    bela: '#ffffff', siva: '#8fa3b8', tamna: '#3b5068', pozadina: '#0b1826', tlo: '#6b7d90',
    voda: '#2e86de', crvena: '#ff7675', plava: '#74b9ff', zelena: '#55efc4', zuta: '#ffeaa7', narandz: '#fdcb6e', ljub: '#a29bfe', roze: '#fd79a8',
  };
  const boja = (b, pod = '#fff') => (Number.isInteger(b) ? BOJE[((b % 6) + 6) % 6] : typeof b === 'string' && /^#[0-9a-f]{3,8}$/i.test(b) ? b : pod);
  const br = (v, pod) => (v !== null && v !== '' && v !== undefined && Number.isFinite(+v) ? +v : pod);
  const f2 = (v) => Math.round(v * 100) / 100;
  const bf = (v, d = 1) => String(+(+v).toFixed(d)).replace('.', ','); // broj sa decimalnim zarezom
  const niz = (v) => (Array.isArray(v) ? v : []);
  const ogr = (v, a, b) => Math.max(a, Math.min(b, v));
  const glatko = (u) => { u = ogr(u, 0, 1); return u * u * (3 - 2 * u); };
  const RAD = Math.PI / 180;
  let brojac = 0; // jedinstveni id-jevi (clipPath, gradijenti) kad je više crteža na strani

  // pseudo-slučajni brojevi – ista scena izgleda isto na svim telefonima
  function slucajni(seme = 7) { let s = seme >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  // ───────── crtanje ─────────
  function el(r, tag, a) {
    const e = document.createElementNS(NS, tag);
    if (a) at(e, a);
    if (r) r.appendChild(e);
    return e;
  }
  function at(e, a) {
    for (const k in a) if (a[k] !== undefined && a[k] !== null) e.setAttribute(k, typeof a[k] === 'number' ? f2(a[k]) : a[k]);
    return e;
  }
  // natpis: „~reč“ se preslovljava, ostalo ostaje latinicom (data-lat)
  function tx(r, x, y, s, o = {}) {
    s = String(s ?? '');
    const prevod = s.startsWith('~');
    const e = el(r, 'text', {
      x, y, 'font-size': o.v || 12, fill: o.b || C.bela, 'text-anchor': o.a || 'middle', 'font-weight': o.tez || 700,
      'dominant-baseline': 'central', 'paint-order': o.obrub === false ? null : 'stroke', stroke: o.obrub === false ? null : C.pozadina, 'stroke-width': o.obrub === false ? null : 3,
    });
    if (!prevod) e.setAttribute('data-lat', '');
    e.textContent = prevod ? s.slice(1) : s;
    return e;
  }
  function postaviTekst(e, s) {
    s = String(s ?? '');
    const prevod = s.startsWith('~');
    const t = prevod ? s.slice(1) : s;
    if (e._t === s) return;
    e._t = s;
    if (prevod) e.removeAttribute('data-lat'); else e.setAttribute('data-lat', '');
    e.textContent = t;
  }
  // emodži u grupi koja se pomera: poz(g, x, y, okreni, rotacija)
  function emo(r, e, v = 24) {
    const g = el(r, 'g');
    const t = el(g, 'text', { x: 0, y: 0, 'font-size': v, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    t.textContent = e;
    return g;
  }
  function poz(g, x, y, okreni = false, rot = 0, sk = 1) {
    g.setAttribute('transform', `translate(${f2(x)} ${f2(y)})${rot ? ` rotate(${f2(rot)})` : ''}${okreni || sk !== 1 ? ` scale(${okreni ? -sk : sk} ${sk})` : ''}`);
  }
  const lin = (r, x1, y1, x2, y2, b = C.bela, w = 2, isp) => el(r, 'line', { x1, y1, x2, y2, stroke: b, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-dasharray': isp ? (isp === true ? '5 4' : isp) : null });
  const kr = (r, cx, cy, rr, a = {}) => el(r, 'circle', { cx, cy, r: rr, ...a });
  const put = (r, d, a = {}) => el(r, 'path', { d, fill: 'none', ...a });
  const tacke = (pts) => pts.map((p) => `${f2(p[0])},${f2(p[1])}`).join(' ');
  function strelica(r, b = C.bela, deb = 3) {
    const g = el(r, 'g');
    const l = el(g, 'line', { stroke: b, 'stroke-width': deb, 'stroke-linecap': 'round' });
    const v = el(g, 'polygon', { fill: b });
    const s = {
      g,
      set(x1, y1, x2, y2) {
        const d = Math.hypot(x2 - x1, y2 - y1);
        if (d < 2) { g.style.display = 'none'; return s; }
        g.style.display = '';
        const ux = (x2 - x1) / d, uy = (y2 - y1) / d;
        const h = Math.min(5 + deb * 2, d * 0.6), w = h * 0.5;
        const bx = x2 - ux * h, by = y2 - uy * h;
        at(l, { x1, y1, x2: bx + ux, y2: by + uy });
        at(v, { points: tacke([[x2, y2], [bx - uy * w, by + ux * w], [bx + uy * w, by - ux * w]]) });
        return s;
      },
    };
    return s;
  }
  // vertikalne trake energije: set([0..1, …])
  function trake(r, x, yDno, h, stavke) {
    const g = el(r, 'g');
    const sts = stavke.map((s, i) => {
      const X = x + i * 24;
      el(g, 'rect', { x: X, y: yDno - h, width: 14, height: h, fill: 'none', stroke: C.tamna, 'stroke-width': 1.5, rx: 2 });
      const p = el(g, 'rect', { x: X, y: yDno, width: 14, height: 0, fill: s.b, rx: 2 });
      tx(g, X + 7, yDno + 11, s.o, { v: 11 });
      return p;
    });
    return { set(v) { sts.forEach((p, i) => { const hh = ogr(v[i] || 0, 0, 1) * h; at(p, { y: yDno - hh, height: hh }); }); } };
  }
  // opruga kao cik-cak od (x, y1) do (x, y2)
  function cikcak(x, y1, y2, n = 10, w = 9) {
    const d = (y2 - y1) / (n + 1);
    let s = `M${f2(x)},${f2(y1)} l0,${f2(d / 2)}`;
    for (let i = 0; i < n; i++) s += ` L${f2(x + (i % 2 ? -w : w))},${f2(y1 + d / 2 + d * (i + 0.5))}`;
    return s + ` L${f2(x)},${f2(y2 - d / 2)} L${f2(x)},${f2(y2)}`;
  }
  const cikcakH = (x1, x2, y, n = 10, w = 8) => {
    const d = (x2 - x1) / (n + 1);
    let s = `M${f2(x1)},${f2(y)} l${f2(d / 2)},0`;
    for (let i = 0; i < n; i++) s += ` L${f2(x1 + d / 2 + d * (i + 0.5))},${f2(y + (i % 2 ? -w : w))}`;
    return s + ` L${f2(x2 - d / 2)},${f2(y)} L${f2(x2)},${f2(y)}`;
  };
  // šrafura ispod/iznad linije (zid, plafon, ogledalo)
  function srafura(r, x1, y1, x2, y2, strana = 1, b = C.siva) {
    const g = el(r, 'g');
    lin(g, x1, y1, x2, y2, b, 2.5);
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    const nx = -uy * strana, ny = ux * strana;
    for (let s = 4; s < L; s += 8) {
      const x = x1 + ux * s, y = y1 + uy * s;
      lin(g, x, y, x + nx * 6 - ux * 5, y + ny * 6 - uy * 5, b, 1.2);
    }
    return g;
  }
  // luk ugla oko (cx, cy) od ugla a1 do a2 (stepeni, SVG smer: 0 = desno, 90 = dole)
  function luk(cx, cy, r, a1, a2) {
    const p1 = [cx + r * Math.cos(a1 * RAD), cy + r * Math.sin(a1 * RAD)], p2 = [cx + r * Math.cos(a2 * RAD), cy + r * Math.sin(a2 * RAD)];
    const vel = Math.abs(a2 - a1) > 180 ? 1 : 0, sm = a2 > a1 ? 1 : 0;
    return `M${f2(p1[0])},${f2(p1[1])} A${f2(r)},${f2(r)} 0 ${vel} ${sm} ${f2(p2[0])},${f2(p2[1])}`;
  }
  // izlomljena linija koja se postepeno iscrtava (zraci svetlosti, putanje): set(0..1)
  function zrak(r, pts, a = {}) {
    const e = el(r, 'polyline', { fill: 'none', stroke: a.b || C.zuta, 'stroke-width': a.w || 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': a.isp ? '5 4' : null, opacity: a.op });
    const duz = [];
    let L = 0;
    for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); duz.push(L); }
    const s = {
      e, L,
      set(u) {
        u = ogr(u, 0, 1);
        if (u <= 0) { e.style.display = 'none'; return; }
        e.style.display = '';
        const cilj = u * L, out = [pts[0]];
        for (let i = 1; i < pts.length; i++) {
          if (duz[i - 1] <= cilj) { out.push(pts[i]); continue; }
          const pre = i > 1 ? duz[i - 2] : 0, k = (cilj - pre) / (duz[i - 1] - pre || 1);
          out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]);
          break;
        }
        e.setAttribute('points', tacke(out));
      },
      tacka(u) { // položaj na delu u (0..1) linije
        const cilj = ogr(u, 0, 1) * L;
        for (let i = 1; i < pts.length; i++) {
          if (duz[i - 1] < cilj && i < pts.length - 1) continue;
          const pre = i > 1 ? duz[i - 2] : 0, k = ogr((cilj - pre) / (duz[i - 1] - pre || 1), 0, 1);
          return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
        }
        return pts[pts.length - 1];
      },
    };
    s.set(0);
    return s;
  }
  // linije polja dve ili više tačkastih „naboja“ ([x, y, q]); polazi od pozitivnih
  function linijePolja(naboji, starts, gr, korak = 2.5, maxK = 700) {
    const B = (x, y) => {
      let bx = 0, by = 0;
      for (const [cx, cy, q] of naboji) { const dx = x - cx, dy = y - cy, r2 = dx * dx + dy * dy + 1e-6, r3 = r2 * Math.sqrt(r2); bx += (q * dx) / r3; by += (q * dy) / r3; }
      return [bx, by];
    };
    return starts.map(([x, y, smer = 1]) => {
      const pts = [[x, y]];
      for (let i = 0; i < maxK; i++) {
        const [bx, by] = B(x, y), L = Math.hypot(bx, by) || 1;
        // srednja tačka (RK2) za glatke linije
        const mx = x + (smer * korak * bx) / L / 2, my = y + (smer * korak * by) / L / 2;
        const [cx, cy] = B(mx, my), L2 = Math.hypot(cx, cy) || 1;
        x += (smer * korak * cx) / L2; y += (smer * korak * cy) / L2;
        pts.push([x, y]);
        if (x < gr[0] || x > gr[2] || y < gr[1] || y > gr[3]) break;
        if (naboji.some(([nx, ny, q]) => q * smer < 0 && Math.hypot(x - nx, y - ny) < 6)) break;
      }
      return pts;
    });
  }
  const putanja = (pts) => 'M' + pts.map((p) => `${f2(p[0])},${f2(p[1])}`).join(' L');
  // strelica-oznaka smera na sredini linije
  function smerNaLiniji(r, pts, b = C.bela, u = 0.5) {
    if (pts.length < 3) return;
    const i = Math.max(1, Math.min(pts.length - 1, Math.floor(pts.length * u)));
    const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
    const d = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / d, uy = (y2 - y1) / d;
    el(r, 'polygon', { fill: b, points: tacke([[x2 + ux * 4, y2 + uy * 4], [x2 - ux * 4 - uy * 4, y2 - uy * 4 + ux * 4], [x2 - ux * 4 + uy * 4, y2 - uy * 4 - ux * 4]]) });
  }
  // sijalica (šematski: krug sa krstićem) + sjaj
  function sijalica(r, x, y, rr = 11) {
    const g = el(r, 'g');
    const sjaj = kr(g, x, y, rr * 1.9, { fill: C.zuta, opacity: 0 });
    kr(g, x, y, rr, { fill: C.pozadina, stroke: C.bela, 'stroke-width': 2 });
    const d = rr * 0.7;
    lin(g, x - d, y - d, x + d, y + d, C.bela, 2);
    lin(g, x - d, y + d, x + d, y - d, C.bela, 2);
    return { g, sjaj: (v) => at(sjaj, { opacity: f2(v * 0.55) }) };
  }
  function vel(s, W, H) { s.setAttribute('viewBox', `0 0 ${W} ${H}`); s.dataset.w = W; s.dataset.h = H; }
  // kanta/sud sa tečnošću (pravougaonik bez poklopca)
  function sud(r, x, y, w, h, b = C.siva) { return put(r, `M${x},${y} L${x},${y + h} L${x + w},${y + h} L${x + w},${y}`, { stroke: b, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }); }

  // ─────────────────────────────── SCENE ───────────────────────────────
  // Svaka scena dobija (svg, parametri) i vraća { kadar(t, novo), trajanje, pauza } – kadar crta trenutak t (s).
  const SCENE = {
    // Kretanje po stazi. tela: [{e:'🚗', v:20, a:0, x0:0, o:'20 m/s', staza:'~led', podloga:'led|pesak|trava|asfalt|sneg'}],
    // duzina (m), jedinica, podeok, tempo (fizičkih jedinica vremena po s animacije), jedVreme ('s' | 'h' | 'min'), trag (vreme između otisaka), vektor, sat.
    kretanje(s, m) {
      const tela = niz(m.tela).slice(0, 4);
      if (!tela.length) tela.push({ e: '🚗', v: 2 });
      const L = br(m.duzina, 10), tempo = br(m.tempo, 1), jed = m.jedinica ?? 'm', jv = ['s', 'h', 'min'].includes(m.jedVreme) ? m.jedVreme : 's';
      const W = 320, RED = 54, H = 26 + tela.length * RED + 34;
      vel(s, W, H);
      const X0 = 22, X1 = W - 22, px = (x) => X0 + (x / L) * (X1 - X0);
      const kin = tela.map((b) => {
        const v = br(b.v, 0), a = br(b.a, 0), x0 = br(b.x0, 0);
        const tz = a && v * a < 0 ? -v / a : Infinity;
        return { x: (t) => { const u = Math.min(t, tz); return x0 + v * u + (a * u * u) / 2; }, v: (t) => (t >= tz ? 0 : v + a * t), tz };
      });
      let T = br(m.trajanje, 0);
      if (!T) {
        for (const k of kin) {
          let t = 0;
          while (t < 40) { const x = k.x(t); if (x < -1e-6 || x > L + 1e-6 || t >= k.tz) break; t += 0.02; }
          T = Math.max(T, Math.min(t, k.tz) + 0.3);
        }
        T = Math.max(T, 1);
      }
      const yR = H - 24;
      lin(s, X0, yR, X1, yR, C.siva, 1.5);
      const pod = br(m.podeok, L / 10), nat = Math.max(1, br(m.natpisi, Math.round(L / pod / 5)));
      for (let i = 0; i * pod <= L + 1e-9; i++) {
        const x = px(i * pod), velik = i % nat === 0;
        lin(s, x, yR - (velik ? 5 : 3), x, yR + (velik ? 5 : 3), C.siva, 1.5);
        if (velik) tx(s, x, yR + 14, `${bf(i * pod, 2)}${jed ? ' ' + jed : ''}`, { v: 10, b: C.siva });
      }
      const PODLOGE = { led: '#a5d8ff', pesak: '#e1b866', trava: '#3fae5a', asfalt: '#7f8c8d', sneg: '#ecf0f1', drvo: '#b07d4f' };
      const tragovi = el(s, 'g');
      const delovi = tela.map((b, i) => {
        const y = 26 + i * RED + RED - 12;
        lin(s, X0 - 12, y + 2, X1 + 12, y + 2, PODLOGE[b.podloga] || C.tamna, b.podloga ? 5 : 2.5);
        if (b.staza) tx(s, X0 - 10, y - RED + 22, b.staza, { a: 'start', v: 11, b: C.siva });
        const g = el(s, 'g');
        const lik = b.e ? emo(g, b.e, 28) : null;
        if (!b.e) kr(g, 0, 0, 10, { fill: boja(b.b, BOJE[i]) });
        const nat = b.o ? tx(s, 0, y - 42, b.o, { v: 11, b: boja(b.b, C.bela) }) : null;
        const vek = m.vektor ? strelica(s, boja(b.b, BOJE[i]), 2.5) : null;
        return { b, y, g, lik, nat, vek, sled: 0 };
      });
      const vmax = Math.max(...kin.map((k) => Math.max(Math.abs(k.v(0)), Math.abs(k.v(Math.min(T, k.tz))))), 1e-6);
      const sat = m.sat === false ? null : tx(s, W - 8, 12, '', { a: 'end', v: 12, b: C.zuta });
      const korak = br(m.trag, 0);
      return {
        trajanje: T / tempo, pauza: 1.6,
        kadar(t, novo) {
          const tf = t * tempo;
          if (novo) { tragovi.replaceChildren(); delovi.forEach((d) => (d.sled = korak ? 0 : Infinity)); }
          if (sat) postaviTekst(sat, `t = ${bf(Math.min(tf, T), 1)} ${jv}`);
          delovi.forEach((d, i) => {
            const x = kin[i].x(tf), v = kin[i].v(tf);
            const vidi = x >= -0.04 * L && x <= 1.04 * L;
            d.g.style.display = vidi ? '' : 'none';
            if (d.nat) d.nat.style.display = vidi ? '' : 'none';
            const smer = (kin[i].v(0) || br(d.b.a, 0)) >= 0 ? 1 : -1;
            const X = px(ogr(x, -0.04 * L, 1.04 * L));
            poz(d.g, X, d.y - 14, d.lik ? (smer > 0) !== !!d.b.okreni : false);
            if (d.nat) at(d.nat, { x: X });
            if (d.vek) { if (vidi) d.vek.set(X, d.y - 32, X + (v / vmax) * 46, d.y - 32); else d.vek.g.style.display = 'none'; }
            while (korak && d.sled * korak <= tf + 1e-9 && d.sled * korak <= T) {
              const xs = kin[i].x(d.sled * korak);
              if (xs >= 0 && xs <= L) {
                kr(tragovi, px(xs), d.y + 2, 3.2, { fill: boja(d.b.b, BOJE[i]) });
                if (m.tragNatpis) tx(tragovi, px(xs), d.y + 13, `${bf(d.sled * korak, 1)} ${jv}`, { v: 9, b: C.siva });
              }
              d.sled++;
            }
          });
        },
      };
    },

    // Grafik zavisnosti (npr. s(t), v(t)). x:'t (s)', y:'s (m)', xmax, ymax, xk, yk (podeoci),
    // linije: [{t:[[0,0],[4,20]], b:0, o:'A', isp}], povrsina: indeks linije (osenči površinu ispod nje),
    // projekcije: [[2,10]] (isprekidane linije do osa), telo: '🚗' (kreće se po prvoj liniji), trajanje.
    grafik(s, m) {
      const linije = niz(m.linije).slice(0, 4).map((l) => ({ ...l, t: niz(l.t).filter((p) => Array.isArray(p) && p.length >= 2).map((p) => [+p[0], +p[1]]) })).filter((l) => l.t.length >= 2);
      const telo = typeof m.telo === 'string' ? m.telo : null;
      const W = 320, H = 214 + (telo ? 36 : 0);
      vel(s, W, H);
      const sviX = linije.flatMap((l) => l.t.map((p) => p[0])), sviY = linije.flatMap((l) => l.t.map((p) => p[1]));
      const xmax = br(m.xmax, Math.max(1, ...sviX)), ymax = br(m.ymax, Math.max(1, ...sviY) * 1.1), ymin = br(m.ymin, Math.min(0, ...sviY));
      const lep = (v) => { const e = Math.pow(10, Math.floor(Math.log10(v))); const k = v / e; return (k <= 1 ? 1 : k <= 2 ? 2 : k <= 5 ? 5 : 10) * e; };
      const xk = br(m.xk, lep(xmax / 6)), yk = br(m.yk, lep((ymax - ymin) / 5));
      const L = 46, R = W - 22, Tp = 18 + (telo ? 36 : 0), D = H - 30;
      const X = (x) => L + (x / xmax) * (R - L), Y = (y) => D - ((y - ymin) / (ymax - ymin)) * (D - Tp);
      for (let x = xk; x <= xmax + 1e-9; x += xk) { lin(s, X(x), Y(ymin), X(x), Tp, C.tamna, 1); tx(s, X(x), D + 12, bf(x, 2), { v: 11, b: C.siva }); }
      for (let y = Math.ceil(ymin / yk) * yk; y <= ymax + 1e-9; y += yk) { if (Math.abs(y) > 1e-9) lin(s, L, Y(y), R, Y(y), C.tamna, 1); tx(s, L - 6, Y(y), bf(y, 2), { v: 11, b: C.siva, a: 'end' }); }
      strelica(s, C.bela, 2).set(L, Y(Math.max(ymin, 0)), R + 14, Y(Math.max(ymin, 0)));
      strelica(s, C.bela, 2).set(L, Y(ymin) + 4, L, Tp - 12);
      if (m.x) tx(s, R + 12, Y(Math.max(ymin, 0)) - 13, m.x, { a: 'end', v: 12 });
      if (m.y) tx(s, L + 8, Tp - 10, m.y, { a: 'start', v: 12 });
      const povrs = Number.isInteger(m.povrsina) && linije[m.povrsina] ? el(s, 'polygon', { fill: boja(linije[m.povrsina].b, BOJE[m.povrsina]), opacity: 0 }) : null;
      if (povrs) { const t = linije[m.povrsina].t; at(povrs, { points: tacke([[X(t[0][0]), Y(0)], ...t.map((p) => [X(p[0]), Y(p[1])]), [X(t[t.length - 1][0]), Y(0)]]) }); }
      const proj = niz(m.projekcije).filter((p) => Array.isArray(p)).map(([px, py]) => {
        const g = el(s, 'g', { opacity: 0 });
        lin(g, X(px), Y(py), X(px), Y(0), C.zuta, 1.5, true);
        lin(g, X(px), Y(py), L, Y(py), C.zuta, 1.5, true);
        return { g, x: +px };
      });
      const nacrt = linije.map((l, i) => {
        const b = boja(l.b, BOJE[i]);
        const e = el(s, 'polyline', { fill: 'none', stroke: b, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': l.isp ? '7 5' : null });
        const tc = kr(s, 0, 0, 4.5, { fill: b });
        const kraj = l.t[l.t.length - 1];
        const nat = l.o ? tx(s, X(kraj[0]) + (l.oPomak?.[0] ?? 0), Y(kraj[1]) - 12 + (l.oPomak?.[1] ?? 0), l.o, { v: 12, b, a: X(kraj[0]) > R - 20 ? 'end' : 'middle' }) : null;
        if (nat) nat.style.display = 'none';
        return { l, e, tc, nat };
      });
      let telG = null, yTel = 24;
      if (telo) { lin(s, L - 10, yTel + 13, R + 6, yTel + 13, C.tamna, 2.5); telG = emo(s, telo, 24); }
      const Tc = br(m.trajanje, 3);
      const yNa = (t, x) => { for (let i = 1; i < t.length; i++) if (x <= t[i][0] || i === t.length - 1) { const [a, b] = [t[i - 1], t[i]]; const k = b[0] === a[0] ? 1 : ogr((x - a[0]) / (b[0] - a[0]), 0, 1); return a[1] + (b[1] - a[1]) * k; } return t[0][1]; };
      return {
        trajanje: Tc, pauza: 2.5,
        kadar(t) {
          const xc = (t / Tc) * xmax, gotovo = t >= Tc;
          nacrt.forEach(({ l, e, tc, nat }) => {
            const p = l.t.filter((q) => q[0] <= xc);
            const kraj = Math.min(xc, l.t[l.t.length - 1][0]);
            const yk2 = yNa(l.t, kraj);
            if (!p.length || p[p.length - 1][0] < kraj) p.push([kraj, yk2]);
            e.setAttribute('points', tacke(p.map((q) => [X(q[0]), Y(q[1])])));
            at(tc, { cx: X(kraj), cy: Y(yk2) });
            if (nat) nat.style.display = gotovo ? '' : 'none';
          });
          if (povrs) at(povrs, { opacity: gotovo ? 0.3 : 0 });
          proj.forEach((p) => at(p.g, { opacity: xc >= p.x ? 1 : 0 }));
          if (telG && linije[0]) {
            const l0 = linije[0].t, ymx = Math.max(...l0.map((q) => q[1])) || 1;
            const kraj = Math.min(xc, l0[l0.length - 1][0]);
            poz(telG, L - 4 + (yNa(l0, kraj) / ymx) * (R - L), yTel, true);
          }
        },
      };
    },

    // Klatno. ugao (amplituda °), klatna: [{l:1, o:'1 m', b, g}] (dužine se porede; g – npr. 0.165 za Mesec), energija (trake Ep/Ek),
    // prigusenje (npr. 0.15 – ljuljaška staje), brzina (vektor brzine), oznake (ravnotežni položaj, amplituda), g.
    klatno(s, m) {
      const kl = (niz(m.klatna).length ? niz(m.klatna) : [{ l: br(m.duzina, 1), o: m.o }]).slice(0, 3);
      const en = !!m.energija, W = 320, H = 214;
      vel(s, W, H);
      const lmax = Math.max(...kl.map((k) => br(k.l, 1)));
      const sc = 158 / lmax, th0 = br(m.ugao, 30) * RAD, d = br(m.prigusenje, 0), g = br(m.g, 1);
      const sirina = en ? 236 : W;
      el(s, 'rect', { x: 20, y: 6, width: sirina - 40, height: 8, fill: C.tamna, rx: 2 });
      const delovi = kl.map((k, i) => {
        const l = br(k.l, 1), x = (sirina / (kl.length + 1)) * (i + 1), y = 14, Lp = l * sc;
        const b = boja(k.b, BOJE[(i + 3) % 6]);
        if (m.oznake !== false) {
          lin(s, x, y, x, y + Lp + 14, C.tamna, 1.5, true);
          put(s, luk(x, y, Lp, 90 - th0 / RAD, 90 + th0 / RAD), { stroke: C.tamna, 'stroke-width': 1.5, 'stroke-dasharray': '3 4' });
        }
        const nit = lin(s, x, y, x, y + Lp, C.siva, 1.8);
        const kug = kr(s, x, y + Lp, 6 + 5 * Math.sqrt(br(k.masa, 1)), { fill: b, stroke: C.bela, 'stroke-width': 1.5 });
        kr(s, x, y, 3, { fill: C.bela });
        if (k.o) tx(s, x, Math.min(H - 10, y + Lp + 28), k.o, { v: 12, b });
        const vek = m.brzina ? strelica(s, C.crvena, 2.5) : null;
        return { x, y, Lp, T: (2 * Math.sqrt(l / br(k.g, g))) / br(m.brzinaPrikaza, 1), nit, kug, vek };
      });
      const tr = en ? trake(s, 248, H - 26, 150, [{ o: 'Ep', b: C.plava }, { o: 'Ek', b: C.crvena }, ...(d ? [{ o: 'Q', b: C.narandz }] : [])]) : null;
      if (m.ugaoNatpis) tx(s, delovi[0].x + 16, 40, m.ugaoNatpis, { v: 12, b: C.zuta, a: 'start' });
      return {
        trajanje: d ? 16 : Infinity, pauza: 0.5,
        kadar(t) {
          delovi.forEach((p, i) => {
            const amp = th0 * Math.exp(-d * t), w = (2 * Math.PI) / p.T;
            const th = amp * Math.cos(w * t), om = -amp * w * Math.sin(w * t);
            const bx = p.x + p.Lp * Math.sin(th), by = p.y + p.Lp * Math.cos(th);
            at(p.nit, { x2: bx, y2: by });
            at(p.kug, { cx: bx, cy: by });
            if (p.vek) p.vek.set(bx, by, bx + Math.cos(th) * om * p.Lp * 0.35, by - Math.sin(th) * om * p.Lp * 0.35);
            if (i === 0 && tr) {
              const E = Math.exp(-2 * d * t), Ep = (1 - Math.cos(th)) / (1 - Math.cos(th0));
              tr.set([Ep, Math.max(0, E - Ep), 1 - E]);
            }
          });
        },
      };
    },

    // Opruga. tip 'oscilacije' (teg na opruzi; energija, oznake) ili 'istezanje' – koraci:
    // [{F:'4 N', dl:2, o:'2 cm'}, {F:'10 N', dl:5, o:'?'}] (dl u istim jedinicama, crta se srazmerno).
    opruga(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      if (m.tip === 'istezanje') {
        const koraci = niz(m.koraci).slice(0, 4);
        const maxDl = Math.max(1, ...koraci.map((k) => br(k.dl, 1)));
        const x = 150, y0 = 14, L0 = 60, sc = 100 / maxDl;
        el(s, 'rect', { x: x - 50, y: 4, width: 100, height: 10, fill: C.tamna, rx: 2 });
        // lenjir
        const xr = x + 56;
        lin(s, xr, y0 + L0, xr, y0 + L0 + maxDl * sc + 8, C.siva, 1.5);
        lin(s, x - 30, y0 + L0, xr + 6, y0 + L0, C.siva, 1, '3 3');
        tx(s, xr + 8, y0 + L0, '0', { a: 'start', v: 11, b: C.siva });
        const spr = put(s, '', { stroke: C.bela, 'stroke-width': 2 });
        const teg = el(s, 'g');
        const kutija = el(teg, 'rect', { x: -22, y: 0, width: 44, height: 30, rx: 4, fill: C.ljub });
        const tF = tx(teg, 0, 15, '', { v: 12, obrub: false, b: C.pozadina });
        const crtica = lin(s, x - 30, 0, xr + 6, 0, C.zuta, 1.5, '3 3');
        const tDl = tx(s, xr + 8, 0, '', { a: 'start', v: 13, b: C.zuta });
        const T1 = 1.2, Tk = 2.2;
        return {
          trajanje: T1 + koraci.length * Tk, pauza: 1.2,
          kadar(t) {
            let i = Math.floor((t - T1) / Tk), u = t - T1 - i * Tk;
            if (t < T1) i = -1;
            i = Math.min(i, koraci.length - 1);
            const k = koraci[i];
            const dlCilj = k ? br(k.dl, 1) * sc : 0, dlPre = i > 0 ? br(koraci[i - 1].dl, 1) * sc : 0;
            const dl = i < 0 ? 0 : dlCilj + (dlPre - dlCilj) * Math.exp(-3 * u) * Math.cos(9 * u);
            const yk = y0 + L0 + dl;
            spr.setAttribute('d', cikcak(x, y0, yk, 12, 9));
            teg.style.display = i < 0 ? 'none' : '';
            poz(teg, x, yk);
            if (k) postaviTekst(tF, k.F ?? '');
            crtica.style.display = tDl.style.display = i < 0 || u < 0.6 ? 'none' : '';
            at(crtica, { y1: yk, y2: yk });
            at(tDl, { y: yk });
            if (k) postaviTekst(tDl, k.o ?? '');
          },
        };
      }
      // oscilacije
      const x = 120, y0 = 14, yR = 110, A = br(m.amplituda, 36), T = br(m.period, 2);
      el(s, 'rect', { x: x - 50, y: 4, width: 100, height: 10, fill: C.tamna, rx: 2 });
      if (m.oznake !== false) {
        lin(s, x - 60, yR + 15, x + 70, yR + 15, C.tamna, 1.5, true);
        lin(s, x - 40, yR + 15 - A, x + 40, yR + 15 - A, C.tamna, 1, '2 4');
        lin(s, x - 40, yR + 15 + A, x + 40, yR + 15 + A, C.tamna, 1, '2 4');
        strelica(s, C.siva, 1.5).set(x + 52, yR + 15, x + 52, yR + 15 - A);
        tx(s, x + 60, yR + 15 - A / 2, 'A', { v: 12, b: C.siva, a: 'start' });
      }
      const spr = put(s, '', { stroke: C.bela, 'stroke-width': 2 });
      const teg = el(s, 'rect', { x: x - 20, y: 0, width: 40, height: 30, rx: 4, fill: C.ljub });
      const vek = m.brzina ? strelica(s, C.crvena, 2.5) : null;
      const tr = m.energija ? trake(s, 248, H - 26, 150, [{ o: 'Ep', b: C.plava }, { o: 'Ek', b: C.crvena }]) : null;
      return {
        trajanje: Infinity,
        kadar(t) {
          const w = (2 * Math.PI) / T, y = yR + A * Math.cos(w * t), v = -A * w * Math.sin(w * t);
          spr.setAttribute('d', cikcak(x, y0, y, 12, 9));
          at(teg, { y });
          if (vek) vek.set(x - 34, y + 15, x - 34, y + 15 + v * 0.3);
          if (tr) { const e = ((y - yR) / A) ** 2; tr.set([e, 1 - e]); }
        },
      };
    },

    // Talasi. tip: 'poprecni' | 'uzduzni' | 'kruzni' | 'zvuk' | 'jeka' | 'poredi' | 'dopler'.
    // lambda (px), A, period, oznake (breg, dolja, λ, A), talasi (za 'poredi': [{A, lambda, o}]), d, t (za 'jeka').
    talas(s, m) {
      const W = 320, v = m.tip || 'poprecni';
      if (v === 'poredi') {
        const ts = niz(m.talasi).slice(0, 3);
        const H = 20 + ts.length * 74;
        vel(s, W, H);
        const linije = ts.map((tl, i) => {
          const y = 46 + i * 74;
          lin(s, 16, y, W - 12, y, C.tamna, 1, true);
          if (tl.o) tx(s, 18, y - 34, tl.o, { a: 'start', v: 12, b: boja(tl.b, BOJE[i]) });
          return { y, A: br(tl.A, 22), lam: br(tl.lambda, 80), e: put(s, '', { stroke: boja(tl.b, BOJE[i]), 'stroke-width': 2.6 }) };
        });
        return {
          trajanje: Infinity,
          kadar(t) {
            linije.forEach((l) => {
              const p = [];
              for (let x = 16; x <= W - 12; x += 3) p.push([x, l.y - l.A * Math.sin((2 * Math.PI * (x - 16)) / l.lam - (2 * Math.PI * t * 60) / l.lam)]);
              l.e.setAttribute('d', putanja(p));
            });
          },
        };
      }
      if (v === 'kruzni') {
        const H = 200;
        vel(s, W, H);
        el(s, 'rect', { x: 0, y: 0, width: W, height: H, fill: '#123a5c' });
        const krugovi = Array.from({ length: 6 }, () => kr(s, 160, 100, 0, { fill: 'none', stroke: '#9fd3ff', 'stroke-width': 2.5 }));
        const list = emo(s, m.e || '🍃', 22);
        const period = br(m.period, 0.9);
        return {
          trajanje: Infinity,
          kadar(t) {
            krugovi.forEach((c, i) => {
              const u = ((t / period - i) % 6 + 6) % 6 / 6, r = u * 190;
              at(c, { r, opacity: f2(Math.max(0, 1 - u * 1.1)) });
            });
            poz(list, 245, 100, false, 8 * Math.sin((2 * Math.PI * t) / period), 1 + 0.12 * Math.sin((2 * Math.PI * t) / period));
          },
        };
      }
      if (v === 'jeka') {
        const H = 170;
        vel(s, W, H);
        lin(s, 6, 140, W - 6, 140, C.tlo, 3);
        el(s, 'rect', { x: 286, y: 30, width: 30, height: 110, fill: '#6d5d4b', rx: 3 });
        const covek = emo(s, m.e || '🧍', 34);
        poz(covek, 26, 120);
        const talasi = [0, 1, 2].map(() => put(s, '', { stroke: C.zuta, 'stroke-width': 2.5 }));
        const odbij = [0, 1, 2].map(() => put(s, '', { stroke: C.narandz, 'stroke-width': 2.5 }));
        if (m.d) { strelica(s, C.siva, 1.5).set(40, 156, 284, 156); strelica(s, C.siva, 1.5).set(284, 156, 40, 156); tx(s, 160, 156, m.d, { v: 12 }); }
        const sat = tx(s, W - 40, 14, '', { a: 'end', v: 12, b: C.zuta });
        const Tput = 2.4, ukupno = br(m.t, 0);
        return {
          trajanje: Tput + 0.4, pauza: 1.2,
          kadar(t) {
            const u = t / Tput;
            talasi.forEach((p, i) => {
              const x = 44 + (u * 2 - i * 0.04) * 242;
              p.style.display = u < 0.5 && x > 44 ? '' : 'none';
              p.setAttribute('d', `M${f2(x)},${100 - 26 + i * 0} A40,40 0 0 1 ${f2(x)},${126 + i * 0}`);
            });
            odbij.forEach((p, i) => {
              const x = 286 - (u * 2 - 1 - i * 0.04) * 242;
              p.style.display = u >= 0.5 && u <= 1 && x < 284 ? '' : 'none';
              p.setAttribute('d', `M${f2(x)},74 A40,40 0 0 0 ${f2(x)},126`);
            });
            postaviTekst(sat, ukupno ? `t = ${bf(Math.min(u, 1) * ukupno, 1)} s` : '');
          },
        };
      }
      if (v === 'dopler') {
        const H = 200;
        vel(s, W, H);
        const krugovi = Array.from({ length: 9 }, () => kr(s, 0, 100, 0, { fill: 'none', stroke: '#9fd3ff', 'stroke-width': 2 }));
        const izv = emo(s, m.e || '🚑', 30);
        const covek1 = emo(s, '🧍', 26), covek2 = emo(s, '🧍', 26);
        poz(covek1, 300, 150); poz(covek2, 20, 150);
        const vz = 60, vi = 28, per = 0.45;
        return {
          trajanje: 9, pauza: 0,
          kadar(t) {
            const xi = 40 + vi * t;
            poz(izv, xi, 100, true);
            krugovi.forEach((c, i) => {
              const n = Math.floor(t / per) - i;
              if (n < 0) { c.style.display = 'none'; return; }
              c.style.display = '';
              const t0 = n * per, r = (t - t0) * vz;
              at(c, { cx: 40 + vi * t0, r, opacity: f2(Math.max(0, 1 - r / 260)) });
            });
          },
        };
      }
      // poprečni, uzdužni, zvuk
      const uzd = v === 'uzduzni' || v === 'zvuk';
      const H = uzd ? 178 : 190;
      vel(s, W, H);
      const lam = br(m.lambda, 110), A = br(m.A, uzd ? 9 : 34), per = br(m.period, 1.6);
      const k = (2 * Math.PI) / lam, w = (2 * Math.PI) / per;
      const x0 = v === 'zvuk' ? 64 : 16, x1 = W - 14;
      if (v === 'zvuk') {
        el(s, 'rect', { x: 8, y: 58, width: 26, height: 44, fill: C.tamna, rx: 3 });
        put(s, 'M34,62 L52,40 L52,120 L34,98 Z', { fill: C.siva });
      }
      const membr = v === 'zvuk' ? lin(s, 54, 42, 54, 118, C.bela, 3) : null;
      const cestice = [];
      if (uzd) {
        const kol = Math.floor((x1 - x0) / 7);
        for (let j = 0; j < kol; j++) for (let r = 0; r < 7; r++) {
          const ist = m.oznake !== false && j === Math.floor(kol / 3) && v !== 'zvuk';
          cestice.push({ x: x0 + j * 7 + (r % 2) * 3.5, y: 52 + r * 10, e: kr(s, 0, 52 + r * 10, ist ? 3.6 : 2.3, { fill: ist ? C.crvena : C.plava }) });
        }
      } else {
        lin(s, x0, 95, x1, 95, C.tamna, 1, true);
        const uze = put(s, '', { stroke: C.plava, 'stroke-width': 2.5 });
        cestice.push({ uze });
        for (let x = x0; x <= x1; x += 11) cestice.push({ x, e: kr(s, x, 95, 3, { fill: C.plava }) });
      }
      const ist = !uzd && m.oznake !== false ? kr(s, 0, 0, 6, { fill: C.crvena, stroke: C.bela, 'stroke-width': 1.5 }) : null;
      const xIst = x0 + 11 * 6;
      if (m.smer !== false) { strelica(s, C.zelena, 2).set(W / 2 - 40, uzd ? 162 : 176, W / 2 + 40, uzd ? 162 : 176); tx(s, W / 2 + 46, uzd ? 162 : 176, '~smer prostiranja', { a: 'start', v: 11, b: C.zelena }); }
      const oz = m.oznake === true ? el(s, 'g') : null;
      let tL, tA, sL, tB, tD, tZ, tR;
      if (oz && !uzd) {
        sL = strelica(oz, C.zuta, 1.5); tL = tx(oz, 0, 0, 'λ', { v: 14, b: C.zuta });
        tB = tx(oz, 0, 0, '~breg', { v: 11, b: C.zuta }); tD = tx(oz, 0, 0, '~dolja', { v: 11, b: C.zuta });
        tA = tx(oz, 0, 0, 'A', { v: 13, b: C.narandz });
      }
      if (oz && uzd) { tZ = tx(oz, 0, 36, '~zgušnjenje', { v: 11, b: C.zuta }); tR = tx(oz, 0, 134, '~razređenje', { v: 11, b: C.zuta }); }
      const aStr = oz && !uzd ? strelica(oz, C.narandz, 1.5) : null;
      return {
        trajanje: Infinity,
        kadar(t) {
          if (uzd) {
            const izv = v === 'zvuk' ? Math.min(1, t / 0.3) : 1;
            if (membr) at(membr, { x1: 54 + 4 * Math.sin(w * t), x2: 54 + 4 * Math.sin(w * t) });
            for (const c of cestice) {
              const faza = k * (c.x - x0) - w * t;
              const aktiv = v === 'zvuk' ? (c.x - x0 < (t * lam) / per ? 1 : 0) : izv;
              at(c.e, { cx: c.x + A * aktiv * Math.sin(-faza) });
            }
            if (oz) {
              // pomeraj ξ = A·sin(ωt − k·x): zgušnjenje gde je ωt − k·x = 2πn, razređenje pola talasa dalje
              let xz = x0 + ((w * t) / k) % lam;
              while (xz < x0 + 34) xz += lam;
              while (xz > x1 - 34) xz -= lam;
              let xr = xz + lam / 2;
              if (xr > x1 - 34) xr -= lam;
              at(tZ, { x: xz }); at(tR, { x: xr });
            }
          } else {
            const p = [];
            for (let x = x0; x <= x1; x += 3) p.push([x, 95 - A * Math.sin(k * (x - x0) - w * t)]);
            cestice[0].uze.setAttribute('d', putanja(p));
            for (const c of cestice.slice(1)) at(c.e, { cy: 95 - A * Math.sin(k * (c.x - x0) - w * t) });
            if (ist) at(ist, { cx: xIst, cy: 95 - A * Math.sin(k * (xIst - x0) - w * t) });
            if (oz) {
              // brег: k(x−x0) − ωt = π/2 + 2πn
              let xb = x0 + (Math.PI / 2 + w * t) / k;
              while (xb > x0 + lam * 0.25) xb -= lam;
              while (xb < x0 + lam * 0.25) xb += lam;
              const xb2 = xb + lam;
              if (xb2 > x1 - 4) { xb -= lam; }
              const yb = 95 - A;
              sL.set(Math.max(xb, x0), yb - 18, xb + lam, yb - 18);
              at(tL, { x: xb + lam / 2, y: yb - 28 });
              at(tB, { x: xb + lam, y: yb - 9 }); at(tD, { x: xb + lam / 2, y: 95 + A + 12 });
              aStr.set(xb + lam, 95, xb + lam, yb + 2);
              at(tA, { x: xb + lam + 10, y: 95 - A / 2 });
            }
          }
        },
      };
    },

    // Padanje i hici. tip: 'slobodan' | 'navise' | 'nanize' | 'vakuum' | 'horizontalni' | 'kosi' | 'padobran'.
    // visina (m), v0 (m/s), uglovi ([15,45,75] za 'kosi'), strob (s između otisaka), brzina (prikaz v), sat.
    pad(s, m) {
      const v = m.tip || 'slobodan', g = br(m.g, 10), W = 320, H = 230;
      vel(s, W, H);
      const yTlo = H - 18;
      if (v === 'vakuum') {
        const cevi = [{ x: 90, o: m.levo || '~vazduh', otpor: true }, { x: 230, o: m.desno || '~vakuum', otpor: false }];
        const tela = [];
        for (const c of cevi) {
          el(s, 'rect', { x: c.x - 40, y: 26, width: 80, height: 180, rx: 16, fill: c.otpor ? 'rgba(116,185,255,.10)' : 'rgba(255,255,255,.02)', stroke: C.siva, 'stroke-width': 2 });
          tx(s, c.x, 14, c.o, { v: 12 });
          tela.push({ e: emo(s, m.e1 || '🪶', 22), x: c.x - 16, otpor: c.otpor, pero: true }, { e: emo(s, m.e2 || '🪙', 22), x: c.x + 16, otpor: c.otpor });
        }
        const y0 = 46, y1 = 190, Tp = 1.4;
        return {
          trajanje: 3.4, pauza: 1.2,
          kadar(t) {
            for (const b of tela) {
              const u = b.pero && b.otpor ? t / (Tp * 2.4) : (t / Tp) ** 2;
              poz(b.e, b.x + (b.pero && b.otpor ? 8 * Math.sin(t * 4) : 0), y0 + Math.min(1, u) * (y1 - y0), false, b.pero && b.otpor ? 20 * Math.sin(t * 4) : 0);
            }
          },
        };
      }
      if (v === 'kosi') {
        const uglovi = niz(m.uglovi).length ? niz(m.uglovi).slice(0, 6) : [15, 30, 45, 60, 75];
        const v0 = br(m.v0, 20), R = (v0 * v0) / g, hm = (v0 * v0) / (2 * g);
        const sc = Math.min(270 / R, 170 / hm);
        lin(s, 8, yTlo, W - 8, yTlo, C.tlo, 3);
        const zr = uglovi.map((a, i) => {
          const pts = [], T = (2 * v0 * Math.sin(a * RAD)) / g;
          for (let k = 0; k <= 40; k++) { const tt = (T * k) / 40; pts.push([22 + v0 * Math.cos(a * RAD) * tt * sc, yTlo - (v0 * Math.sin(a * RAD) * tt - (g * tt * tt) / 2) * sc]); }
          const z = zrak(s, pts, { b: BOJE[i % 6], w: 2.4 });
          const nat = tx(s, pts[40][0], a > 45 ? yTlo - 11 : yTlo + 9, `${a}°`, { v: 11, b: BOJE[i % 6] });
          nat.style.display = 'none';
          return { z, nat, lopta: kr(s, 0, 0, 4.5, { fill: BOJE[i % 6] }) };
        });
        return {
          trajanje: 3, pauza: 2,
          kadar(t) {
            zr.forEach((o) => { const u = t / 2.6; o.z.set(u); const [x, y] = o.z.tacka(Math.min(u, 1)); at(o.lopta, { cx: x, cy: y }); o.nat.style.display = u >= 1 ? '' : 'none'; });
          },
        };
      }
      if (v === 'horizontalni') {
        const h = br(m.visina, 20), v0 = br(m.v0, 10), Tp = Math.sqrt((2 * h) / g), sc = 170 / h;
        el(s, 'rect', { x: 10, y: yTlo - h * sc, width: 40, height: h * sc, fill: C.tamna });
        lin(s, 8, yTlo, W - 8, yTlo, C.tlo, 3);
        const a = kr(s, 0, 0, 7, { fill: C.crvena }), b = kr(s, 0, 0, 7, { fill: C.plava });
        const tragovi = el(s, 'g'), korak = br(m.strob, Tp / 6);
        let sled = 0;
        const sxc = Math.min(sc, 220 / (v0 * Tp));
        return {
          trajanje: Tp * 1.6, pauza: 1.5,
          kadar(t, novo) {
            const tf = Math.min(t / 1.6, Tp);
            if (novo) { tragovi.replaceChildren(); sled = 0; }
            const y = yTlo - (h - (g * tf * tf) / 2) * sc;
            at(a, { cx: 58 + v0 * tf * sxc, cy: y }); at(b, { cx: 58, cy: y });
            while (sled * korak <= tf + 1e-9) {
              const tt = sled * korak, yy = yTlo - (h - (g * tt * tt) / 2) * sc;
              lin(tragovi, 58, yy, 58 + v0 * tt * sxc, yy, C.tamna, 1, '2 3');
              kr(tragovi, 58 + v0 * tt * sxc, yy, 5, { fill: 'none', stroke: C.crvena, opacity: 0.6 });
              kr(tragovi, 58, yy, 5, { fill: 'none', stroke: C.plava, opacity: 0.6 });
              sled++;
            }
          },
        };
      }
      if (v === 'padobran') {
        lin(s, 8, yTlo, W - 8, yTlo, C.tlo, 3);
        const cov = emo(s, '🪂', 34);
        const fg = strelica(s, C.crvena, 3), fo = strelica(s, C.plava, 3);
        tx(s, 250, 30, 'Fg', { v: 13, b: C.crvena }); tx(s, 290, 30, 'Fo', { v: 13, b: C.plava });
        const tv = tx(s, 20, 16, '', { a: 'start', v: 12, b: C.zuta });
        return {
          trajanje: 7, pauza: 1,
          kadar(t) {
            const vg = 1 - Math.exp(-t / 1.1), y = 30 + 150 * (t / 7);
            poz(cov, 120, y);
            fg.set(165, y, 165, y + 50); fo.set(175, y, 175, y - 50 * vg * vg);
            postaviTekst(tv, vg > 0.97 ? '~stalna brzina' : '~brzina raste');
          },
        };
      }
      // slobodan, navise, nanize
      const v0 = v === 'navise' ? br(m.v0, 20) : v === 'nanize' ? br(m.v0, 5) : 0;
      const hm = v === 'navise' ? (v0 * v0) / (2 * g) : br(m.visina, 20);
      const T = v === 'navise' ? (2 * v0) / g : (-v0 + Math.sqrt(v0 * v0 + 2 * g * hm)) / g;
      const sc = 180 / hm, X = 150;
      lin(s, 8, yTlo, W - 8, yTlo, C.tlo, 3);
      // lenjir sa metrima
      const xr = 64;
      lin(s, xr, yTlo, xr, yTlo - hm * sc, C.siva, 1.5);
      const kor = [1, 2, 5, 10, 20, 50, 100].find((k) => hm / k <= 5) || 200;
      for (let i = 0; i * kor <= hm + 1e-9; i++) { const y = v === 'navise' ? yTlo - i * kor * sc : yTlo - hm * sc + i * kor * sc; lin(s, xr - 4, y, xr + 4, y, C.siva, 1.5); tx(s, xr - 8, y, `${i * kor} m`, { a: 'end', v: 10, b: C.siva }); }
      if (v !== 'navise') el(s, 'rect', { x: X - 52, y: yTlo - hm * sc - 1, width: 40, height: 6, fill: C.tamna });
      const tragovi = el(s, 'g');
      const lopta = kr(s, X, 0, 8, { fill: C.narandz, stroke: C.bela, 'stroke-width': 1.5 });
      const vek = m.brzina !== false ? strelica(s, C.crvena, 2.5) : null;
      const tv = m.brzina !== false && m.brojevi !== false ? tx(s, X + 70, 30, '', { a: 'start', v: 12, b: C.crvena }) : null;
      const sat = m.sat !== false ? tx(s, W - 10, 14, '', { a: 'end', v: 12, b: C.zuta }) : null;
      const korak = br(m.strob, T / (v === 'navise' ? 8 : 5));
      const tempo = br(m.tempo, 1);
      let sled = 0;
      const yOd = (tt) => (v === 'navise' ? yTlo - (v0 * tt - (g * tt * tt) / 2) * sc : yTlo - hm * sc + (v0 * tt + (g * tt * tt) / 2) * sc);
      return {
        trajanje: T / tempo, pauza: 1.5,
        kadar(t, novo) {
          const tf = Math.min(t * tempo, T);
          if (novo) { tragovi.replaceChildren(); sled = 0; }
          const y = yOd(tf), vv = v === 'navise' ? v0 - g * tf : v0 + g * tf;
          at(lopta, { cy: y - 8 });
          const xo = v === 'navise' && vv < 0 ? X + 22 : X;
          at(lopta, { cx: xo });
          if (vek) vek.set(xo + 16, y - 8, xo + 16, y - 8 + (v === 'navise' ? -1 : 1) * vv * (60 / Math.max(v0, g * T, v0 + g * T)));
          if (tv) postaviTekst(tv, `v = ${bf(Math.abs(vv), 0)} m/s`);
          if (sat) postaviTekst(sat, `t = ${bf(tf, 1)} s`);
          while (sled * korak <= tf + 1e-9) {
            const tt = sled * korak, xs = v === 'navise' && v0 - g * tt < 0 ? X + 22 : X;
            kr(tragovi, xs, yOd(tt) - 8, 7, { fill: 'none', stroke: C.narandz, opacity: 0.55 });
            sled++;
          }
        },
      };
    },

    // Sile na telo. sile: [{F:50, ugao:0, o:'50 N', b}] (ugao: 0 = desno, 90 = gore), telo: tekst na kutiji ili e: emodži,
    // rezultanta: true | 'oznaka' (prikazuje se posle), kretanje (telo kreće u smeru rezultante), podloga (podrazumevano da).
    sile(s, m) {
      const W = 320, H = 190;
      vel(s, W, H);
      const sile = niz(m.sile).slice(0, 5).map((f, i) => ({ F: Math.abs(br(f.F, 1)), u: br(f.ugao, 0), o: f.o, b: boja(f.b, BOJE[i]) }));
      const Fmax = Math.max(1, ...sile.map((f) => f.F));
      const rx = sile.reduce((a, f) => a + f.F * Math.cos(f.u * RAD), 0);
      const ry = sile.reduce((a, f) => a + f.F * Math.sin(f.u * RAD), 0);
      const R = Math.hypot(rx, ry);
      const horiz = sile.every((f) => Math.abs(Math.sin(f.u * RAD)) < 0.01);
      const pod = m.podloga !== false && horiz;
      const sc = (horiz ? 100 : 80) / Math.max(Fmax, m.rezultanta ? R : 0);
      const cx = horiz ? 160 : 130, cy = pod ? 118 : 110, a = 22;
      if (pod) lin(s, 6, cy + a + 1, W - 6, cy + a + 1, C.tlo, 3);
      const svet = el(s, 'g');
      const telo = el(svet, 'g', { transform: `translate(${cx} ${cy})` });
      if (m.e) poz(emo(telo, m.e, 40), 0, 0);
      else if (horiz) { el(telo, 'rect', { x: -a, y: -a, width: 2 * a, height: 2 * a, rx: 5, fill: C.ljub }); if (m.telo) tx(telo, 0, 0, m.telo, { v: 12, b: C.pozadina, obrub: false }); }
      // sile istog pravca i smera crtaju se jedna pored druge
      const grupe = {};
      sile.forEach((f) => { const k = Math.round(((f.u % 360) + 360) % 360); (grupe[k] = grupe[k] || []).push(f); });
      Object.values(grupe).forEach((g) => g.forEach((f, j) => (f.pom = (j - (g.length - 1) / 2) * 12)));
      const str = sile.map((f) => {
        const dx = Math.cos(f.u * RAD), dy = -Math.sin(f.u * RAD);
        // kod sila duž jedne prave strelice kreću od ivice kutije, inače iz tačke (materijalna tačka)
        const t0 = horiz ? a : 0;
        const sx = cx + dx * t0 - dy * f.pom, sy = cy + dy * t0 + dx * f.pom;
        const st = strelica(svet, f.b, 3.2);
        const nat = tx(svet, 0, 0, f.o ?? `${bf(f.F, 1)} N`, { v: 13, b: f.b });
        return { st, nat, dx, dy, sx, sy, L: f.F * sc, pom: f.pom };
      });
      const rez = m.rezultanta ? strelica(svet, C.zelena, 3.6) : null;
      if (!horiz && !m.e) kr(svet, cx, cy, 7, { fill: C.ljub, stroke: C.bela, 'stroke-width': 1.5 });
      const pg = m.rezultanta && sile.length === 2 && !horiz ? el(svet, 'g') : null;
      const pl = pg ? [lin(pg, 0, 0, 0, 0, C.siva, 1.2, true), lin(pg, 0, 0, 0, 0, C.siva, 1.2, true)] : null;
      const rNat = m.rezultanta ? tx(svet, 0, 0, typeof m.rezultanta === 'string' ? m.rezultanta : 'R', { v: 14, b: C.zelena }) : null;
      const T1 = 1, T2 = rez ? 2.3 : 1.2, T3 = m.kretanje && R > 1e-6 ? 2.2 : 0;
      return {
        trajanje: T2 + T3 + 0.3, pauza: 1.8,
        kadar(t) {
          const u = glatko(t / T1);
          str.forEach((o) => {
            const ex = o.sx + o.dx * o.L * u, ey = o.sy + o.dy * o.L * u;
            o.st.set(o.sx, o.sy, ex, ey);
            // više sila istog smera: natpis na vrhu strelice; inače iznad strelice
            if (horiz && o.pom) at(o.nat, { x: ex + o.dx * 6, y: ey, 'text-anchor': o.dx > 0 ? 'start' : 'end' });
            else if (horiz) at(o.nat, { x: o.sx + o.dx * o.L * 0.55, y: o.sy - 11 });
            else at(o.nat, { x: ex + o.dx * 16 + (Math.abs(o.dx) < 0.3 ? 22 : 0), y: ey + o.dy * 12 + (Math.abs(o.dy) < 0.3 ? -12 : 0) });
            o.nat.style.display = u > 0.9 ? '' : 'none';
          });
          if (rez) {
            const ur = glatko((t - T1 - 0.2) / (T2 - T1 - 0.2));
            // rezultanta: kod sila duž jedne prave crta se iznad tela, inače iz središta
            const x0 = cx, y0 = horiz ? cy - a - 26 : cy;
            rez.set(x0, y0, x0 + rx * sc * ur, y0 - ry * sc * ur);
            rNat.style.display = ur > 0.95 ? '' : 'none';
            if (horiz) at(rNat, { x: x0 + rx * sc * 0.5, y: y0 - 13 });
            else at(rNat, { x: x0 + rx * sc + 18, y: y0 - ry * sc - 8 });
            if (pg) {
              const [f1, f2_] = str;
              const p1 = [cx + f1.dx * f1.L, cy + f1.dy * f1.L], p2 = [cx + f2_.dx * f2_.L, cy + f2_.dy * f2_.L];
              at(pl[0], { x1: p1[0], y1: p1[1], x2: p1[0] + f2_.dx * f2_.L, y2: p1[1] + f2_.dy * f2_.L });
              at(pl[1], { x1: p2[0], y1: p2[1], x2: p2[0] + f1.dx * f1.L, y2: p2[1] + f1.dy * f1.L });
              pg.style.opacity = ur;
            }
          }
          if (T3) {
            const tt = Math.max(0, t - T2), mx = ogr(0.5 * 30 * tt * tt, 0, horiz ? 110 : 60);
            svet.setAttribute('transform', `translate(${f2((rx / R) * mx)} ${f2((-ry / R) * mx)})`);
          } else svet.removeAttribute('transform');
        },
      };
    },
    // Akcija i reakcija. tip: 'klizaci' (levo/desno: {e, m, o}) | 'raketa' | 'balon'.
    reakcija(s, m) {
      const W = 320, H = 190, v = m.tip || 'klizaci';
      vel(s, W, H);
      if (v === 'raketa' || v === 'balon') {
        const rak = v === 'raketa';
        const g = el(s, 'g');
        const telo = rak ? emo(g, '🚀', 40) : null;
        if (rak) poz(telo, 0, 0, false, -45);
        else { el(g, 'ellipse', { cx: 0, cy: 0, rx: 30, ry: 24, fill: C.roze }); put(g, 'M-30,0 L-38,-6 L-38,6 Z', { fill: C.roze }); }
        const cest = Array.from({ length: 26 }, () => kr(s, 0, 0, rak ? 3 : 2.5, { fill: rak ? C.narandz : '#dfe6e9', opacity: 0.8 }));
        const fa = strelica(s, C.zelena, 3), fb = strelica(s, C.crvena, 3);
        const na = tx(s, 0, 0, m.o1 || (rak ? '~gas' : '~vazduh'), { v: 11, b: C.crvena }), nb = tx(s, 0, 0, m.o2 || (rak ? '~raketa' : '~balon'), { v: 11, b: C.zelena });
        const rnd = slucajni(3);
        const ph = cest.map(() => [rnd(), rnd() - 0.5]);
        return {
          trajanje: 4, pauza: 0.8,
          kadar(t) {
            const pom = 0.5 * 9 * t * t;
            if (rak) {
              const x = 160, y = 140 - pom;
              poz(g, x, y);
              cest.forEach((c, i) => { const u = (t * 2.2 + ph[i][0]) % 1; at(c, { cx: x - 12 + ph[i][1] * 18 * (1 + u), cy: y + 26 + u * 60, opacity: f2(0.9 - u * 0.8) }); });
              fb.set(196, y + 22, 196, y + 62); fa.set(196, y - 8, 196, y - 48);
              at(nb, { x: 228, y: y - 30 }); at(na, { x: 222, y: y + 46 });
            } else {
              const x = 110 + pom * 1.3, y = 90;
              poz(g, x, y);
              cest.forEach((c, i) => { const u = (t * 2.5 + ph[i][0]) % 1; at(c, { cx: x - 40 - u * 70, cy: y + ph[i][1] * 14 * (1 + u * 2), opacity: f2(0.9 - u * 0.8) }); });
              fa.set(x + 34, y + 44, x + 84, y + 44); fb.set(x - 38, y + 44, x - 88, y + 44);
              at(nb, { x: x + 60, y: y + 58 }); at(na, { x: x - 64, y: y + 58 });
            }
          },
        };
      }
      const L = m.levo || {}, D = m.desno || {};
      const mL = br(L.m, 40), mD = br(D.m, 80);
      lin(s, 8, 150, W - 8, 150, '#a5d8ff', 5);
      const gl = emo(s, L.e || '🧒', 44), gd = emo(s, D.e || '🧑', 56);
      const nl = tx(s, 0, 172, L.o || `${mL} kg`, { v: 12 }), nd = tx(s, 0, 172, D.o || `${mD} kg`, { v: 12 });
      const fl = strelica(s, C.crvena, 3), fd = strelica(s, C.crvena, 3);
      const vl = strelica(s, C.zelena, 2.5), vd = strelica(s, C.zelena, 2.5);
      const vNat = m.brzine ? [tx(s, 0, 0, '', { v: 11, b: C.zelena }), tx(s, 0, 0, '', { v: 11, b: C.zelena })] : null;
      const vL = 30 * Math.sqrt(mD / mL) * Math.sqrt(mL / mD), vlv = (60 * mD) / (mL + mD), vdv = (60 * mL) / (mL + mD);
      return {
        trajanje: 4.2, pauza: 1.2,
        kadar(t) {
          const tt = Math.max(0, t - 1.2);
          const xl = 140 - vlv * tt * 0.9, xd = 180 + vdv * tt * 0.9;
          poz(gl, xl, 122, true); poz(gd, xd, 116);
          at(nl, { x: xl }); at(nd, { x: xd });
          const pr = t > 0.5 && t < 1.4;
          fl.g.style.display = fd.g.style.display = pr ? '' : 'none';
          if (pr) { fl.set(156, 70, 106, 70); fd.set(164, 70, 214, 70); }
          if (t > 1.4) { vl.set(xl, 82, xl - vlv * 0.9, 82); vd.set(xd, 82, xd + vdv * 0.9, 82); } else { vl.g.style.display = vd.g.style.display = 'none'; }
          if (vNat) { postaviTekst(vNat[0], t > 1.4 ? 'v₁' : ''); postaviTekst(vNat[1], t > 1.4 ? 'v₂' : ''); at(vNat[0], { x: xl - vlv * 0.45, y: 70 }); at(vNat[1], { x: xd + vdv * 0.45, y: 70 }); }
          void vL;
        },
      };
    },

    // Poluga / klackalica. levo, desno: [{m:30, d:2, e:'🧒', o:'30 kg'}] ili sile [{F:'20 N', d:1}] (d = rastojanje od oslonca),
    // ravnoteza: true (ne naginje se – kad je nešto nepoznato „?“), duzina (pola dužine), rastojanja (natpisi d).
    poluga(s, m) {
      const W = 320, H = 200;
      vel(s, W, H);
      const lev = niz(m.levo).slice(0, 3), des = niz(m.desno).slice(0, 3);
      const Lmax = br(m.duzina, Math.max(1, ...[...lev, ...des].map((x) => br(x.d, 1))) + 0.4);
      const sc = 132 / Lmax, cx = 160, cy = 130;
      const tez = (x) => br(x.m, br(String(x.F ?? '').replace(',', '.').match(/[\d.]+/)?.[0], 1));
      const Mom = des.reduce((a, x) => a + tez(x) * br(x.d, 1), 0) - lev.reduce((a, x) => a + tez(x) * br(x.d, 1), 0);
      const nagib = m.ravnoteza || Math.abs(Mom) < 1e-6 ? 0 : Math.sign(Mom) * 13;
      el(s, 'polygon', { points: tacke([[cx, cy + 4], [cx - 18, cy + 40], [cx + 18, cy + 40]]), fill: C.siva });
      lin(s, 20, cy + 40, W - 20, cy + 40, C.tlo, 3);
      const g = el(s, 'g');
      el(g, 'rect', { x: -Lmax * sc, y: -4, width: 2 * Lmax * sc, height: 8, rx: 3, fill: '#b07d4f' });
      const crtaj = (x, strana, i) => {
        const X = strana * br(x.d, 1) * sc;
        if (x.F !== undefined && x.m === undefined) {
          strelica(g, C.crvena, 3).set(X, -58, X, -6);
          tx(g, X, -66, x.o ?? x.F, { v: 13, b: C.crvena });
        } else if (x.e) {
          const e = emo(g, x.e, 34); poz(e, X, -24, strana > 0);
          tx(g, X, -50, x.o ?? `${x.m} kg`, { v: 12, b: C.zuta });
        } else {
          const vv = 16 + 6 * Math.sqrt(tez(x) / 10);
          el(g, 'rect', { x: X - vv / 2, y: -4 - vv, width: vv, height: vv, rx: 3, fill: BOJE[(i + (strana > 0 ? 2 : 0)) % 6] });
          tx(g, X, -12 - vv, x.o ?? `${x.m} kg`, { v: 12, b: C.zuta });
        }
        if (m.rastojanja !== false) {
          const yy = 18 + i * 14;
          lin(g, 0, yy, X, yy, C.siva, 1.2); lin(g, X, yy - 4, X, yy + 4, C.siva, 1.2);
          tx(g, X / 2, yy + 1, x.do ?? `${bf(br(x.d, 1), 2)} m`, { v: 11, b: C.siva });
        }
      };
      lev.forEach((x, i) => crtaj(x, -1, i));
      des.forEach((x, i) => crtaj(x, 1, i));
      return {
        trajanje: 4, pauza: 1.2,
        kadar(t) {
          const u = Math.max(0, t - 1);
          const ug = nagib * (1 - Math.exp(-2.6 * u) * Math.cos(5 * u));
          g.setAttribute('transform', `translate(${cx} ${cy}) rotate(${f2(t < 1 ? 0 : ug)})`);
        },
      };
    },

    // Tečnost i potisak. tip 'plivanje': tela [{ro:600, o:'~drvo', b}], ro (gustina tečnosti), tecnost: '~voda', sile (Fg i Fp)
    // tip 'dinamometar': F1 (u vazduhu, N), F2 (u vodi, N), tecnost.
    tecnost(s, m) {
      const W = 320, H = 210;
      vel(s, W, H);
      const roT = br(m.ro, 1000);
      if (m.tip === 'dinamometar') {
        // dinamometar miruje, a čaša sa vodom se podiže dok telo ne bude potpuno potopljeno
        const F1 = br(m.F1, 10), F2 = br(m.F2, 6), sx = 160;
        el(s, 'rect', { x: 110, y: 4, width: 100, height: 8, fill: C.tamna, rx: 2 });
        el(s, 'rect', { x: sx - 14, y: 12, width: 28, height: 66, rx: 5, fill: '#dfe6e9' });
        const spr = put(s, '', { stroke: C.pozadina, 'stroke-width': 1.5 });
        const kaz = lin(s, sx - 10, 0, sx + 10, 0, C.crvena, 2);
        const ploc = tx(s, sx + 22, 45, '', { v: 15, b: C.zuta, a: 'start' });
        lin(s, sx, 78, sx, 96, C.siva, 1.5);
        const casa = el(s, 'g');
        const voda = el(casa, 'rect', { x: 101, y: 0, width: 118, height: 0, fill: 'rgba(46,134,222,.45)' });
        sud(casa, 100, 0, 120, 80);
        tx(casa, 212, 68, m.tecnost || '~voda', { v: 11, a: 'end', b: '#9fd3ff' });
        el(s, 'rect', { x: sx - 18, y: 96, width: 36, height: 30, rx: 3, fill: '#b2bec3' });
        const fp = strelica(s, C.zelena, 3);
        const fpN = tx(s, sx + 32, 104, m.potisak || 'Fp', { v: 12, b: C.zelena, a: 'start' });
        return {
          trajanje: 5, pauza: 1.4,
          kadar(t) {
            const u = glatko((t - 1.2) / 2);
            const yc = 124 - u * 62; // vrh čaše
            const nivo0 = yc + 30, potop = ogr((126 - nivo0) / 30, 0, 1), nivo = nivo0 - potop * 8;
            casa.setAttribute('transform', `translate(0 ${f2(yc)})`);
            at(voda, { y: nivo - yc, height: 79 - (nivo - yc) });
            const F = F1 - (F1 - F2) * potop, yk = 40 + (F / F1) * 22;
            spr.setAttribute('d', cikcak(sx, 16, yk, 7, 6));
            at(kaz, { y1: yk, y2: yk });
            postaviTekst(ploc, `${bf(F, 1)} N`);
            fp.set(sx + 26, 126, sx + 26, 126 - potop * 34);
            fp.g.style.display = potop > 0.1 ? '' : 'none';
            fpN.style.display = potop > 0.95 ? '' : 'none';
          },
        };
      }
      const tela = niz(m.tela).slice(0, 4);
      const nv = 90, dno = 188;
      sud(s, 20, 40, 280, dno - 40);
      el(s, 'rect', { x: 21, y: nv, width: 278, height: dno - nv - 1, fill: m.boja ? boja(m.boja) : 'rgba(46,134,222,.4)', opacity: m.boja ? 0.45 : 1 });
      tx(s, 160, dno + 12, m.tecnost || '~voda', { v: 11, b: '#9fd3ff' });
      const a = 34;
      const obj = tela.map((tl, i) => {
        const x = 20 + (280 / (tela.length + 1)) * (i + 1);
        const g = el(s, 'g');
        el(g, 'rect', { x: -a / 2, y: -a / 2, width: a, height: a, rx: 4, fill: boja(tl.b, BOJE[i]), stroke: C.bela, 'stroke-width': 1 });
        if (tl.e) poz(emo(g, tl.e, 20), 0, 0);
        const nat = tx(s, x, 22, tl.o ?? '', { v: 11, b: boja(tl.b, BOJE[i]) });
        const fg = m.sile ? strelica(s, C.crvena, 2.5) : null, fp = m.sile ? strelica(s, C.zelena, 2.5) : null;
        return { x, g, ro: br(tl.ro, 500), nat, fg, fp, y: 30, v: 0 };
      });
      return {
        trajanje: 6, pauza: 1.2,
        kadar(t, novo) {
          for (const o of obj) {
            if (novo) { o.y = 34; o.v = 0; o.t = 0; }
            const dt = Math.min(0.03, Math.max(0, t - (o.t || 0)));
            o.t = t;
            for (let k = 0; k < 3; k++) {
              const pot = ogr((o.y + a / 2 - nv) / a, 0, 1);
              const acc = 600 * (1 - (roT / o.ro) * pot) - (pot > 0 ? 6 : 0.5) * o.v;
              o.v += (acc * dt) / 3; o.y += (o.v * dt) / 3;
              if (o.y > dno - a / 2 - 2) { o.y = dno - a / 2 - 2; o.v = 0; }
            }
            poz(o.g, o.x, o.y);
            if (o.fg) {
              const pot = ogr((o.y + a / 2 - nv) / a, 0, 1);
              o.fg.set(o.x - 8, o.y, o.x - 8, o.y + 36);
              o.fp.set(o.x + 8, o.y, o.x + 8, o.y - 36 * (roT / o.ro) * pot);
            }
          }
        },
      };
    },

    // Pritisak. tip: 'rupice' | 'spojeni' | 'presa' | 'dubina' | 'paskal' | 'toriceli' | 'podloga' | 'visina'.
    pritisak(s, m) {
      const W = 320, H = 210, v = m.tip || 'rupice';
      vel(s, W, H);
      const VODA = 'rgba(46,134,222,.45)';
      if (v === 'rupice') {
        sud(s, 50, 20, 70, 180);
        el(s, 'rect', { x: 51, y: 34, width: 68, height: 165, fill: VODA });
        lin(s, 10, 200, W - 10, 200, C.tlo, 3);
        const rupe = [70, 115, 160].map((y) => ({ y, v: Math.sqrt(y - 34) }));
        const kap = rupe.map(() => Array.from({ length: 14 }, () => kr(s, 0, 0, 2.6, { fill: '#9fd3ff' })));
        return {
          trajanje: Infinity,
          kadar(t) {
            rupe.forEach((r, i) => kap[i].forEach((c, j) => {
              const u = ((t * 0.9 + j / 14) % 1), tt = u * 1.2;
              const x = 120 + r.v * 9 * tt, y = r.y + 0.5 * 110 * tt * tt;
              at(c, { cx: x, cy: Math.min(y, 198) });
              c.style.display = y > 199 ? 'none' : '';
            }));
          },
        };
      }
      if (v === 'spojeni') {
        const id = 'sp' + ++brojac;
        const oblici = ['M30,40 L30,170 L70,170 L70,40', 'M110,40 L110,170 L122,170 L122,40', 'M160,40 L190,170 L215,170 L245,40', 'M275,40 L262,100 L262,170 L284,170 L284,100 L300,40'];
        const cp = el(el(s, 'defs'), 'clipPath', { id });
        el(cp, 'path', { d: 'M31,40 L31,186 L299,186 L299,40 L284,40 L284,40 Z' });
        const sve = 'M30,40 L30,170 L70,170 L70,40 M110,40 L110,170 L122,170 L122,40 M160,40 L190,170 L215,170 L245,40 M275,40 L262,100 L262,170 L284,170 L284,100 L300,40';
        void sve;
        const unutra = el(s, 'g', { 'clip-path': `url(#${id})` });
        const nivo = el(unutra, 'rect', { x: 0, y: 186, width: W, height: 40, fill: VODA });
        // zajednička cev pri dnu
        put(s, 'M30,170 L30,186 L284,186 L284,170', { stroke: C.siva, 'stroke-width': 2.5 });
        for (const d of oblici) put(s, d, { stroke: C.siva, 'stroke-width': 2.5 });
        // maska: tečnost se vidi samo u sudovima i cevi
        const cp2 = el(el(s, 'defs'), 'clipPath', { id: id + 'b' });
        el(cp2, 'path', { d: 'M31,40 L31,185 L283,185 L283,170 L263,170 L263,100 L276,40 L299,40 L285,100 L285,186 L31,186 Z' });
        cp.replaceChildren();
        for (const d of ['M31,40 L31,171 L69,171 L69,40 Z', 'M111,40 L111,171 L121,171 L121,40 Z', 'M161,40 L191,171 L214,171 L244,40 Z', 'M276,40 L263,100 L263,171 L283,171 L283,100 L299,40 Z', 'M31,169 L31,185 L283,185 L283,169 Z'])
          el(cp, 'path', { d });
        const linija = lin(s, 20, 0, 306, 0, C.zuta, 1.2, '4 4');
        return {
          trajanje: 4, pauza: 2,
          kadar(t) {
            const y = 186 - glatko(t / 3.5) * 110;
            at(nivo, { y, height: 200 - y });
            at(linija, { y1: y, y2: y });
            linija.style.display = t > 3.5 ? '' : 'none';
          },
        };
      }
      if (v === 'presa') {
        const S1 = 20, S2 = 90;
        put(s, `M60,40 L60,170 L230,170 L230,60 M${60 + S1},40 L${60 + S1},150 L${230 - S2},150 L${230 - S2},60`, { stroke: C.siva, 'stroke-width': 2.5 });
        const voda = el(s, 'path', { fill: VODA });
        const k1 = el(s, 'rect', { x: 61, y: 0, width: S1 - 2, height: 8, fill: C.siva });
        const k2 = el(s, 'rect', { x: 231 - S2, y: 0, width: S2 - 2, height: 8, fill: C.siva });
        const auto = emo(s, m.e || '🚗', 40);
        const f1 = strelica(s, C.crvena, 3), f2s = strelica(s, C.zelena, 4);
        const n1 = tx(s, 40, 20, m.o1 || 'F₁', { v: 13, b: C.crvena }), n2 = tx(s, 268, 40, m.o2 || 'F₂', { v: 13, b: C.zelena });
        tx(s, 70, 186, m.s1 || 'S₁', { v: 12, b: C.siva }); tx(s, 185, 186, m.s2 || 'S₂', { v: 12, b: C.siva });
        return {
          trajanje: 3, pauza: 1.4,
          kadar(t) {
            const u = glatko(t / 2.6), y1 = 60 + u * 60, y2 = 80 - (u * 60 * S1) / S2;
            at(k1, { y: y1 - 8 }); at(k2, { y: y2 - 8 });
            voda.setAttribute('d', `M61,${f2(y1)} L61,169 L229,169 L229,${f2(y2)} L${231 - S2},${f2(y2)} L${231 - S2},149 L${59 + S1},149 L${59 + S1},${f2(y1)} Z`);
            poz(auto, 185, y2 - 26, true);
            f1.set(70, y1 - 48, 70, y1 - 10); at(n1, { y: y1 - 30 });
            f2s.set(260, y2 + 30, 260, y2 - 20); at(n2, { y: y2 - 30 });
          },
        };
      }
      if (v === 'dubina') {
        sud(s, 70, 20, 180, 180);
        el(s, 'rect', { x: 71, y: 34, width: 178, height: 165, fill: VODA });
        const str = [60, 95, 130, 165].map((y) => ({ y, l: strelica(s, C.zuta, 2.5), d: strelica(s, C.zuta, 2.5) }));
        const dno = [100, 140, 180, 220].map((x) => ({ x, l: strelica(s, C.narandz, 2.5) }));
        const ron = emo(s, m.e || '🤿', 26);
        return {
          trajanje: 4, pauza: 1.5,
          kadar(t) {
            const u = glatko(t / 1.5);
            str.forEach((o) => { const L = (o.y - 34) * 0.32 * u; o.l.set(75, o.y, 75 + L, o.y); o.d.set(245, o.y, 245 - L, o.y); });
            dno.forEach((o) => o.l.set(o.x, 196, o.x, 196 - 165 * 0.32 * u));
            poz(ron, 160, 50 + 110 * glatko((t - 1.5) / 2.3));
          },
        };
      }
      if (v === 'paskal') {
        el(s, 'rect', { x: 20, y: 85, width: 120, height: 30, fill: VODA, stroke: C.siva, 'stroke-width': 2.5 });
        kr(s, 190, 100, 44, { fill: VODA, stroke: C.siva, 'stroke-width': 2.5 });
        const klip = el(s, 'g');
        el(klip, 'rect', { x: 0, y: 86, width: 8, height: 28, fill: C.siva });
        lin(klip, 0, 100, -40, 100, C.siva, 4);
        const rupe = Array.from({ length: 9 }, (_, i) => (-120 + i * 30) * RAD);
        const kap = rupe.map(() => Array.from({ length: 6 }, () => kr(s, 0, 0, 2.4, { fill: '#9fd3ff' })));
        return {
          trajanje: 4, pauza: 0.8,
          kadar(t) {
            const u = glatko(t / 3.6);
            poz(klip, 30 + u * 70, 0);
            rupe.forEach((a, i) => kap[i].forEach((c, j) => {
              const w = ((t * 1.5 + j / 6) % 1);
              const r = 44 + w * 60;
              at(c, { cx: 190 + Math.cos(a) * r, cy: 100 + Math.sin(a) * r, opacity: t > 0.3 ? f2(1 - w) : 0 });
            }));
          },
        };
      }
      if (v === 'toriceli') {
        el(s, 'rect', { x: 70, y: 160, width: 140, height: 36, fill: '#b2bec3', opacity: 0.85 });
        sud(s, 70, 150, 140, 46);
        el(s, 'rect', { x: 128, y: 14, width: 24, height: 176, rx: 4, fill: 'none', stroke: C.bela, 'stroke-width': 2 });
        const ziva = el(s, 'rect', { x: 130, y: 16, width: 20, height: 174, fill: '#b2bec3' });
        // lenjir
        const yNula = 160, sc = 1.6; // 1 cm = 1,6 px
        lin(s, 116, yNula, 116, yNula - 85 * sc, C.siva, 1.5);
        for (let c = 0; c <= 80; c += 10) { lin(s, 112, yNula - c * sc, 120, yNula - c * sc, C.siva, 1.5); if (c % 20 === 0) tx(s, 108, yNula - c * sc, `${c} cm`, { a: 'end', v: 10, b: C.siva }); }
        const vrh = lin(s, 112, 0, 196, 0, C.zuta, 1.5, '4 3');
        const nat = tx(s, 202, 0, m.visina ?? '76 cm', { v: 13, b: C.zuta, a: 'start' });
        tx(s, 140, 8, '~vakuum', { v: 11, b: C.siva });
        const atm = [172, 188, 204].map((x) => ({ x, s: strelica(s, C.plava, 2) }));
        return {
          trajanje: 3, pauza: 2,
          kadar(t) {
            const u = glatko((t - 0.6) / 1.6), y = 16 + u * (yNula - 76 * sc - 16);
            at(ziva, { y, height: 190 - y });
            at(vrh, { y1: y, y2: y }); at(nat, { y });
            vrh.style.display = nat.style.display = u >= 1 ? '' : 'none';
            atm.forEach((o) => o.s.set(o.x, 120, o.x, 156));
          },
        };
      }
      if (v === 'podloga') {
        const tela = niz(m.tela).slice(0, 3);
        const ys = 120;
        el(s, 'rect', { x: 10, y: ys, width: W - 20, height: 80, fill: m.boja ? boja(m.boja) : '#dfe6e9', opacity: 0.85 });
        if (m.podloga) tx(s, W - 16, H - 14, m.podloga, { a: 'end', v: 11, b: C.pozadina, obrub: false });
        const obj = tela.map((tl, i) => {
          const x = 10 + ((W - 20) / (tela.length + 1)) * (i + 1), w = br(tl.w, 40), h = br(tl.h, 40);
          const g = el(s, 'g');
          el(g, 'rect', { x: -w / 2, y: -h, width: w, height: h, rx: 3, fill: boja(tl.b, '#e17055'), opacity: tl.e ? 0.35 : 1 });
          if (tl.e) poz(emo(g, tl.e, 26), 0, -h / 2);
          tx(s, x, 16, tl.o ?? '', { v: 11, b: boja(tl.b, C.bela) });
          return { x, g, d: 1600 / w };
        });
        return {
          trajanje: 3, pauza: 1.5,
          kadar(t) { obj.forEach((o) => poz(o.g, o.x, ys + Math.min(o.d, 60) * glatko((t - 0.5) / 2))); },
        };
      }
      // visina: vazduh je sve ređi
      const rnd = slucajni(11);
      put(s, 'M10,200 L130,40 L170,70 L250,200 Z', { fill: '#5d6d7e' });
      put(s, 'M118,56 L130,40 L142,56 L136,52 L130,58 L124,52 Z', { fill: '#ecf0f1' });
      const cest = [];
      for (let i = 0; i < 260; i++) { const y = 200 * Math.pow(rnd(), 0.45); cest.push({ x: 8 + rnd() * 304, y, c: kr(s, 0, 0, 1.8, { fill: C.plava, opacity: 0.8 }) }); }
      return {
        trajanje: Infinity,
        kadar(t) { cest.forEach((c, i) => at(c.c, { cx: c.x + 2 * Math.sin(t * 3 + i), cy: c.y + 2 * Math.cos(t * 2.5 + i * 1.7) })); },
      };
    },

    // Strujno kolo (šema). veza: 'redno' | 'paralelno', elementi: [{t:'sijalica'|'otpornik'|'motor', o:'4 Ω', pregorela}],
    // izvor: '12 V', prekidac: true (zatvoren) | false (otvoren) | 'klik' (igrač ga uključuje dodirom),
    // ampermetar (u glavnoj grani), voltmetar: indeks elementa, elektroni (plave čestice od − ka +).
    kolo(s, m) {
      const W = 320, H = 200;
      vel(s, W, H);
      const elem = niz(m.elementi).slice(0, 4);
      if (!elem.length) elem.push({ t: 'sijalica' });
      const par = m.veza === 'paralelno';
      let zatvoren = m.prekidac === undefined || m.prekidac === true || m.prekidac === 'klik' ? m.prekidac !== 'klik' : false;
      const xl = 58, xr = 292, yt = Number.isInteger(m.voltmetar) && !par ? 70 : 44, yb = 168, ym = (yt + yb) / 2;
      const zice = el(s, 'g');
      const cestG = el(s, 'g');
      const crtezi = el(s, 'g');
      const vrh = el(s, 'g');
      // izvor na levoj strani: duža tanka ploča = +, kraća debela = −
      const izvor = (x, y) => {
        el(crtezi, 'rect', { x: x - 16, y: y - 9, width: 32, height: 18, fill: C.pozadina });
        lin(crtezi, x - 15, y - 5, x + 15, y - 5, C.bela, 2);
        lin(crtezi, x - 8, y + 5, x + 8, y + 5, C.bela, 5);
        tx(crtezi, x + 22, y - 12, '+', { v: 13, b: C.crvena }); tx(crtezi, x + 22, y + 12, '−', { v: 15, b: C.plava });
        if (m.izvor) tx(crtezi, x - 22, y, m.izvor, { v: 12, a: 'end', b: C.zuta });
      };
      const prekidac = (x, y, vert) => {
        const g = el(crtezi, 'g', { transform: `translate(${x} ${y})${vert ? ' rotate(90)' : ''}` });
        el(g, 'rect', { x: -15, y: -8, width: 30, height: 16, fill: C.pozadina });
        kr(g, -12, 0, 3, { fill: C.bela }); kr(g, 12, 0, 3, { fill: C.bela });
        const ruc = lin(g, -12, 0, 12, 0, C.bela, 2.5);
        if (m.prekidac === 'klik') {
          tx(crtezi, vert ? x - 20 : x, vert ? y : y - 22, '~dodirni', { v: 11, b: C.zelena, a: vert ? 'end' : 'middle' });
          const z = el(g, 'rect', { x: -20, y: -22, width: 40, height: 34, fill: 'transparent', 'data-klik': '' });
          z.style.cursor = 'pointer';
          z.addEventListener('click', () => { zatvoren = !zatvoren; azur(); });
        }
        return () => at(ruc, { x2: zatvoren ? 12 : 12 * Math.cos(32 * RAD), y2: zatvoren ? 0 : -12 * Math.sin(32 * RAD) * 1.6 });
      };
      const element = (e, x, y, vert, ispod) => {
        const t = e.t || 'sijalica';
        let sj = null;
        if (t === 'sijalica') sj = sijalica(crtezi, x, y, 11);
        else if (t === 'otpornik') el(crtezi, 'rect', vert ? { x: x - 7, y: y - 17, width: 14, height: 34, fill: C.pozadina, stroke: C.bela, 'stroke-width': 2 } : { x: x - 17, y: y - 7, width: 34, height: 14, fill: C.pozadina, stroke: C.bela, 'stroke-width': 2 });
        else { kr(crtezi, x, y, 12, { fill: C.pozadina, stroke: C.bela, 'stroke-width': 2 }); tx(crtezi, x, y, t === 'motor' ? 'M' : t === 'ampermetar' ? 'A' : t === 'voltmetar' ? 'V' : '?', { v: 13 }); }
        if (e.pregorela && sj) { lin(crtezi, x - 4, y - 14, x + 4, y - 4, C.crvena, 2); }
        if (e.o) tx(crtezi, vert ? x + 18 : x, vert ? y : ispod ? y + 22 : y - 22, e.o, { v: 12, b: C.zuta, a: vert ? 'start' : 'middle' });
        return sj;
      };
      const petlje = []; // putanje struje: { pts, aktivna() }
      const sijalice = [];
      let azurPrek;
      if (!par) {
        put(zice, `M${xl},${ym} L${xl},${yt} L${xr},${yt} L${xr},${yb} L${xl},${yb} Z`, { stroke: C.bela, 'stroke-width': 2 });
        izvor(xl, ym);
        const n = elem.length, x0 = 104, x1 = 258;
        elem.forEach((e, i) => { const x = n === 1 ? (x0 + x1) / 2 : x0 + ((x1 - x0) * i) / (n - 1); const sj = element(e, x, yt, false, i === m.voltmetar); if (sj) sijalice.push({ sj, i }); e._x = x; });
        azurPrek = m.prekidac === undefined ? null : prekidac(xr, ym, true);
        if (m.ampermetar) element({ t: 'ampermetar', o: typeof m.ampermetar === 'string' ? m.ampermetar : null }, (xl + xr) / 2, yb, false);
        if (Number.isInteger(m.voltmetar) && elem[m.voltmetar]) {
          const x = elem[m.voltmetar]._x;
          put(zice, `M${x - 26},${yt} L${x - 26},${yt - 40} L${x + 26},${yt - 40} L${x + 26},${yt}`, { stroke: C.bela, 'stroke-width': 1.6 });
          element({ t: 'voltmetar', o: null }, x, yt - 40, false);
          if (typeof m.napon === 'string') tx(crtezi, x + 42, yt - 40, m.napon, { v: 12, b: C.zuta, a: 'start' });
        }
        petlje.push({ pts: [[xl, ym - 6], [xl, yt], [xr, yt], [xr, yb], [xl, yb], [xl, ym + 6]], aktivna: () => zatvoren && !elem.some((e) => e.pregorela) });
      } else {
        const n = elem.length, x0 = 150, x1 = 276;
        const xs = elem.map((_, i) => (n === 1 ? 200 : x0 + ((x1 - x0) * i) / (n - 1)));
        const xk = xs[xs.length - 1];
        put(zice, `M${xl},${ym} L${xl},${yt} L${xk},${yt} M${xl},${ym} L${xl},${yb} L${xk},${yb}`, { stroke: C.bela, 'stroke-width': 2 });
        xs.forEach((x) => lin(zice, x, yt, x, yb, C.bela, 2));
        izvor(xl, ym);
        elem.forEach((e, i) => { const sj = element(e, xs[i], ym, true); if (sj) sijalice.push({ sj, i }); });
        azurPrek = m.prekidac === undefined ? null : prekidac(104, yt, false);
        if (m.ampermetar) element({ t: 'ampermetar', o: typeof m.ampermetar === 'string' ? m.ampermetar : null }, 104, yb, false, true);
        if (m.ampermetri) elem.forEach((e, i) => element({ t: 'ampermetar', o: Array.isArray(m.ampermetri) ? m.ampermetri[i] : null }, xs[i], yt + 30, true));
        xs.forEach((x, i) => petlje.push({ pts: [[xl, ym - 6], [xl, yt], [x, yt], [x, yb], [xl, yb], [xl, ym + 6]], aktivna: () => zatvoren && !elem[i].pregorela }));
      }
      // čestice struje
      const el2 = !!m.elektroni;
      const cest = petlje.map((p) => {
        const z = zrak(vrh, p.pts, { b: 'transparent', w: 0 });
        const n = Math.round(z.L / 18);
        return { p, z, c: Array.from({ length: n }, () => kr(cestG, 0, 0, 2.6, { fill: el2 ? C.plava : C.zuta })) };
      });
      function azur() {
        if (azurPrek) azurPrek();
        const n = elem.filter((e) => (e.t || 'sijalica') !== 'ampermetar').length;
        sijalice.forEach(({ sj, i }) => {
          const ide = par ? petlje[i].aktivna() : petlje[0].aktivna();
          sj.sjaj(ide && !elem[i].pregorela ? (par ? 1 : 1 / Math.max(1, n) ** 1.2) : 0);
        });
      }
      azur();
      return {
        trajanje: Infinity,
        kadar(t) {
          cest.forEach(({ p, z, c }) => {
            const ide = p.aktivna();
            c.forEach((k, j) => {
              k.style.display = ide ? '' : 'none';
              if (!ide) return;
              let u = ((j / c.length + (t * 26) / z.L) % 1);
              if (el2) u = 1 - u;
              const [x, y] = z.tacka(u);
              at(k, { cx: x, cy: y });
            });
          });
        },
      };
    },

    // Ravno ogledalo. tip 'odbijanje' (ugao, menja: ugao se menja, oznake) | 'lik' (o1, o2: rastojanja) | 'difuzno' | 'periskop'.
    ogledalo(s, m) {
      const W = 320, H = 200, v = m.tip || 'odbijanje';
      vel(s, W, H);
      if (v === 'lik') {
        srafura(s, 170, 20, 170, 170, 1, C.plava);
        lin(s, 10, 170, W - 10, 170, C.tamna, 2);
        const d = 90;
        const p = emo(s, m.e || '🕯️', 40); poz(p, 170 - d, 140);
        const l = emo(s, m.e || '🕯️', 40); poz(l, 170 + d, 140, true); l.setAttribute('opacity', 0.4);
        const oko = emo(s, '👁️', 22); poz(oko, 40, 60);
        const z1 = zrak(s, [[170 - d, 124], [170, 104], [42, 64]], { b: C.zuta });
        const z2 = zrak(s, [[170, 104], [170 + d, 124]], { b: C.zuta, isp: true, op: 0.6 });
        if (m.o1 || m.o2) {
          strelica(s, C.siva, 1.5).set(170 - d / 2, 186, 170 - d, 186); strelica(s, C.siva, 1.5).set(170 - d / 2, 186, 170, 186);
          strelica(s, C.siva, 1.5).set(170 + d / 2, 186, 170, 186); strelica(s, C.siva, 1.5).set(170 + d / 2, 186, 170 + d, 186);
          tx(s, 170 - d / 2, 186, m.o1 ?? '', { v: 12 }); tx(s, 170 + d / 2, 186, m.o2 ?? '', { v: 12 });
        }
        return { trajanje: 3, pauza: 2, kadar(t) { z1.set(t / 1.6); z2.set((t - 1.6) / 0.8); l.style.display = t > 1.9 ? '' : 'none'; } };
      }
      if (v === 'difuzno') {
        srafura(s, 20, 150, 145, 150, 1, C.plava);
        put(s, 'M175,150 l8,-6 l7,8 l9,-9 l6,7 l10,-8 l7,9 l8,-6 l9,8 l8,-7 l10,6 l8,-5 l9,7 l7,-6', { stroke: C.siva, 'stroke-width': 2.5 });
        tx(s, 82, 186, '~glatka površina', { v: 11, b: C.siva }); tx(s, 240, 186, '~hrapava površina', { v: 11, b: C.siva });
        const zr = [];
        [45, 70, 95].forEach((x) => zr.push(zrak(s, [[x - 40, 40], [x, 150], [x + 40, 40]], { b: C.zuta })));
        const rnd = slucajni(5);
        [205, 230, 255].forEach((x) => { const a = (rnd() - 0.5) * 120; zr.push(zrak(s, [[x - 40, 40], [x, 150], [x + 110 * Math.sin(a * RAD), 150 - 110 * Math.cos(a * RAD)]], { b: C.zuta })); });
        return { trajanje: 2.4, pauza: 2, kadar(t) { zr.forEach((z) => z.set(t / 2)); } };
      }
      if (v === 'periskop') {
        put(s, 'M160,32 L160,20 L120,20 L120,132 M120,168 L120,180 L160,180 L160,68', { stroke: C.siva, 'stroke-width': 2.5 });
        lin(s, 122, 68, 158, 32, C.plava, 3.5);
        lin(s, 122, 168, 158, 132, C.plava, 3.5);
        const pr = emo(s, m.e || '🌳', 30); poz(pr, 250, 46);
        const oko = emo(s, '👁️', 22); poz(oko, 60, 150);
        const z = zrak(s, [[234, 50], [140, 50], [140, 150], [74, 150]], { b: C.zuta });
        return { trajanje: 2.4, pauza: 2, kadar(t) { z.set(t / 2); } };
      }
      // odbijanje
      srafura(s, 30, 160, 290, 160, 1, C.plava);
      lin(s, 160, 160, 160, 26, C.siva, 1.5, true);
      if (m.oznake !== false) tx(s, 166, 22, '~normala', { a: 'start', v: 11, b: C.siva });
      const z = zrak(s, [[0, 0], [160, 160], [0, 0]], { b: C.zuta });
      const g = el(s, 'g');
      const l1 = put(g, '', { stroke: C.crvena, 'stroke-width': 2 }), l2 = put(g, '', { stroke: C.zelena, 'stroke-width': 2 });
      const n1 = tx(g, 0, 0, 'α', { v: 14, b: C.crvena }), n2 = tx(g, 0, 0, 'β', { v: 14, b: C.zelena });
      const u0 = br(m.ugao, 40), D = 125;
      let zr = null;
      return {
        trajanje: m.menja ? 10 : 2.6, pauza: m.menja ? 0 : 2,
        kadar(t) {
          const u = m.menja ? 45 + 28 * Math.sin((t / 10) * 2 * Math.PI) : u0;
          const p1 = [160 - D * Math.sin(u * RAD), 160 - D * Math.cos(u * RAD)], p2 = [160 + D * Math.sin(u * RAD), 160 - D * Math.cos(u * RAD)];
          if (m.menja || !zr) { z.e.remove(); zr = zrak(s, [p1, [160, 160], p2], { b: C.zuta, w: 2.6 }); s.insertBefore(zr.e, g); z.e = zr.e; }
          zr.set(m.menja ? 1 : t / 1.6);
          const vid = m.menja || t > 1.7;
          g.style.display = vid ? '' : 'none';
          l1.setAttribute('d', luk(160, 160, 34, -90 - u, -90));
          l2.setAttribute('d', luk(160, 160, 40, -90, -90 + u));
          at(n1, { x: 160 - 48 * Math.sin((u / 2) * RAD), y: 160 - 48 * Math.cos((u / 2) * RAD) });
          at(n2, { x: 160 + 54 * Math.sin((u / 2) * RAD), y: 160 - 54 * Math.cos((u / 2) * RAD) });
          if (m.menja) { postaviTekst(n1, `${Math.round(u)}°`); postaviTekst(n2, `${Math.round(u)}°`); }
        },
      };
    },

    // Sferno ogledalo. tip 'konkavno' | 'konveksno', predmet: rastojanje u žižnim daljinama (npr. 3, 1.5, 0.5)
    // ili snop: true (paralelni zraci), lik (prikaži lik, podrazumevano da), oznake (F, C).
    sferno(s, m) {
      const W = 320, H = 200, konv = m.tip === 'konveksno';
      vel(s, W, H);
      const A = 100, f = konv ? 60 : 56;
      // kod udubljenog ogledala sa predmetom unutar žiže lik je iza ogledala – ogledalo se pomera ulevo da lik stane
      const pv = m.predmet === undefined || m.snop ? null : br(m.predmet, 3);
      const M = konv ? 200 : pv && pv < 1 ? Math.min(290, W - 16 - (pv / (1 - pv)) * f) : 290;
      lin(s, 6, A, W - 6, A, C.tamna, 1.5);
      const zak = konv ? -1 : 1; // konkavno: centar levo
      put(s, `M${M + zak * 8},${A - 80} Q${M - zak * 8},${A} ${M + zak * 8},${A + 80}`, { stroke: C.plava, 'stroke-width': 3.5 });
      for (let y = -74; y <= 74; y += 9) { const x = M + zak * 8 * (1 - 2 * (1 - (y / 80) ** 2)) + 0; lin(s, x, A + y, x + zak * 7, A + y - 4, C.plava, 1.2); }
      const F = M - zak * f, Cc = M - zak * 2 * f;
      if (m.oznake !== false) {
        kr(s, F, A, 3.5, { fill: C.zuta }); tx(s, F, A + 13, 'F', { v: 13, b: C.zuta });
        if (Cc > 4 && Cc < W - 4) { kr(s, Cc, A, 3.5, { fill: C.narandz }); tx(s, Cc, A + 13, 'C', { v: 13, b: C.narandz }); }
      }
      const zraci = [];
      if (m.snop || m.predmet === undefined) {
        for (const h of [-48, -24, 24, 48]) {
          if (!konv) zraci.push({ z: zrak(s, [[10, A + h], [M, A + h], [F, A], [F - (M - F) * 0.7, A - h * 0.7]], { b: C.zuta }), t0: 0 });
          else {
            const k = h / f; // odbijeni zrak ide kao da dolazi iz F (iza ogledala)
            zraci.push({ z: zrak(s, [[10, A + h], [M, A + h], [M - 150, A + h + k * 150]], { b: C.zuta }), t0: 0 });
            zraci.push({ z: zrak(s, [[M, A + h], [F, A]], { b: C.zuta, isp: true, op: 0.6 }), t0: 1.6 });
          }
        }
        return { trajanje: 3, pauza: 2, kadar(t) { zraci.forEach((o) => o.z.set((t - o.t0) / 1.5)); } };
      }
      const p = br(m.predmet, 3) * f, h = 40;
      const xo = M - p;
      strelica(s, C.zelena, 3).set(xo, A, xo, A - h);
      const fz = konv ? -f : f;
      const q = Math.abs(p - fz) < 1e-6 ? Infinity : (p * fz) / (p - fz); // 1/p + 1/q = 1/f
      const hi = Number.isFinite(q) ? (-h * q) / p : 0;
      const xi = M - q;
      const y0 = A - h;
      const dalje = (x1, y1, x2, y2, xKraj) => [xKraj, y1 + ((y2 - y1) * (xKraj - x1)) / (x2 - x1)];
      // zrak 1: paralelan osi → kroz F (ili kao iz F)
      const r1 = konv ? dalje(F, A, M, y0, 6) : dalje(M, y0, F, A, 6);
      zraci.push({ z: zrak(s, [[xo, y0], [M, y0], r1], { b: C.zuta }), t0: 0 });
      if (konv) zraci.push({ z: zrak(s, [[M, y0], [F, A]], { b: C.zuta, isp: true, op: 0.55 }), t0: 1.4 });
      // zrak 2: ka temenu → odbija se simetrično
      const r2 = dalje(M, A, xo, A + h, 6);
      zraci.push({ z: zrak(s, [[xo, y0], [M, A], r2], { b: C.narandz }), t0: 0.5 });
      if (Number.isFinite(q) && q < 0) zraci.push({ z: zrak(s, [[M, A], [xi, A - hi]], { b: C.narandz, isp: true, op: 0.55 }), t0: 1.9 }, { z: zrak(s, [[M, y0], [xi, A - hi]], { b: C.zuta, isp: true, op: 0.55 }), t0: 1.9 });
      const lik = Number.isFinite(q) && xi > 4 && xi < W - 4 && m.lik !== false ? strelica(s, C.roze, 3) : null;
      if (lik) { lik.set(xi, A, xi, A - hi); if (q < 0) lik.g.querySelector('line').setAttribute('stroke-dasharray', '5 4'); }
      return {
        trajanje: 3.6, pauza: 2.4,
        kadar(t) {
          zraci.forEach((o) => o.z.set((t - o.t0) / 1.4));
          if (lik) lik.g.style.opacity = t > 2.6 ? 1 : 0;
        },
      };
    },

    // Sočivo. tip 'sabirno' | 'rasipno', predmet (u žižnim daljinama) ili snop: true, lik, oznake.
    socivo(s, m) {
      const W = 320, H = 200, ras = m.tip === 'rasipno';
      vel(s, W, H);
      const A = 100;
      const p = m.snop || m.predmet === undefined ? null : br(m.predmet, 3);
      const fz = ras ? -1 : 1;
      let q = p && Math.abs(p - fz) > 1e-6 ? (p * fz) / (p - fz) : Infinity;
      // razmera: sve da stane
      const levo = p ? Math.max(p, Number.isFinite(q) && q < 0 ? -q : 0) + 0.35 : 1.6, desno = p && Number.isFinite(q) && q > 0 ? Math.max(q, 1) + 0.3 : 1.6;
      const f = Math.min(64, 300 / (levo + desno));
      const Lx = 10 + levo * f;
      lin(s, 4, A, W - 4, A, C.tamna, 1.5);
      if (ras) put(s, `M${Lx - 12},${A - 80} Q${Lx},${A} ${Lx - 12},${A + 80} L${Lx + 12},${A + 80} Q${Lx},${A} ${Lx + 12},${A - 80} Z`, { fill: 'rgba(116,185,255,.25)', stroke: C.plava, 'stroke-width': 2 });
      else el(s, 'ellipse', { cx: Lx, cy: A, rx: 12, ry: 80, fill: 'rgba(116,185,255,.25)', stroke: C.plava, 'stroke-width': 2 });
      if (m.oznake !== false) for (const [x, o] of [[Lx - f, 'F'], [Lx + f, 'F'], [Lx - 2 * f, '2F'], [Lx + 2 * f, '2F']]) if (x > 4 && x < W - 4) { kr(s, x, A, 3, { fill: C.zuta }); tx(s, x, A + 13, o, { v: 12, b: C.zuta }); }
      const zraci = [];
      const kraj = (x1, y1, x2, y2, xK) => [xK, y1 + ((y2 - y1) * (xK - x1)) / (x2 - x1 || 1e-6)];
      if (!p) {
        for (const h of [-50, -25, 0, 25, 50]) {
          if (!ras) zraci.push({ z: zrak(s, [[6, A + h], [Lx, A + h], kraj(Lx, A + h, Lx + f, A, W - 6)], { b: C.zuta }), t0: 0 });
          else {
            zraci.push({ z: zrak(s, [[6, A + h], [Lx, A + h], kraj(Lx - f, A, Lx, A + h, W - 6)], { b: C.zuta }), t0: 0 });
            if (h) zraci.push({ z: zrak(s, [[Lx, A + h], [Lx - f, A]], { b: C.zuta, isp: true, op: 0.55 }), t0: 1.4 });
          }
        }
        return { trajanje: 3, pauza: 2, kadar(t) { zraci.forEach((o) => o.z.set((t - o.t0) / 1.5)); } };
      }
      const h = 38, xo = Lx - p * f, y0 = A - h;
      strelica(s, C.zelena, 3).set(xo, A, xo, y0);
      const xi = Lx + q * f, yi = A + (h * q) / p;
      // 1: paralelan → kroz F' (sabirno) / kao iz F (rasipno)
      const r1 = ras ? kraj(Lx - f, A, Lx, y0, W - 6) : kraj(Lx, y0, Lx + f, A, W - 6);
      zraci.push({ z: zrak(s, [[xo, y0], [Lx, y0], r1], { b: C.zuta }), t0: 0 });
      // 2: kroz optički centar
      zraci.push({ z: zrak(s, [[xo, y0], kraj(xo, y0, Lx, A, W - 6)], { b: C.narandz }), t0: 0.5 });
      if (Number.isFinite(q) && q < 0) {
        zraci.push({ z: zrak(s, [[Lx, y0], [xi, yi]], { b: C.zuta, isp: true, op: 0.55 }), t0: 1.9 });
        zraci.push({ z: zrak(s, [[Lx, A], [xi, yi]], { b: C.narandz, isp: true, op: 0.55 }), t0: 1.9 });
      }
      const lik = Number.isFinite(q) && xi > 4 && xi < W - 4 && m.lik !== false ? strelica(s, C.roze, 3) : null;
      if (lik) { lik.set(xi, A, xi, yi); if (q < 0) lik.g.querySelector('line').setAttribute('stroke-dasharray', '5 4'); }
      return {
        trajanje: 3.6, pauza: 2.4,
        kadar(t) {
          zraci.forEach((o) => o.z.set((t - o.t0) / 1.4));
          if (lik) lik.g.style.opacity = t > 2.6 ? 1 : 0;
        },
      };
    },

    // Prelamanje svetlosti. gore/dole: 'vazduh' | 'voda' | 'staklo' | 'dijamant', ugao (upadni, °),
    // iz: 'gore' | 'dole' (odakle dolazi zrak), menja (ugao se menja – vidi se i totalna refleksija), uglovi (α, β).
    prelamanje(s, m) {
      const W = 320, H = 200;
      vel(s, W, H);
      const N = { vazduh: 1, voda: 1.33, staklo: 1.5, dijamant: 2.42 };
      const IME = { vazduh: '~vazduh', voda: '~voda', staklo: '~staklo', dijamant: '~dijamant' };
      const g1 = N[m.gore] ? m.gore : 'vazduh', g2 = N[m.dole] ? m.dole : 'voda';
      const odozdo = m.iz === 'dole';
      const n1 = odozdo ? N[g2] : N[g1], n2 = odozdo ? N[g1] : N[g2];
      const yG = 100, X = 160, D = 120;
      el(s, 'rect', { x: 0, y: yG, width: W, height: H - yG, fill: g2 === 'vazduh' ? 'transparent' : 'rgba(46,134,222,.35)' });
      if (g1 !== 'vazduh') el(s, 'rect', { x: 0, y: 0, width: W, height: yG, fill: 'rgba(46,134,222,.35)' });
      tx(s, 10, 14, IME[g1], { a: 'start', v: 11, b: C.siva }); tx(s, 10, H - 12, IME[g2], { a: 'start', v: 11, b: C.siva });
      lin(s, X, 12, X, H - 12, C.siva, 1.2, true);
      const ul = zrak(s, [[0, 0], [X, yG]], { b: C.zuta, w: 2.6 }), izl = zrak(s, [[X, yG], [0, 0]], { b: C.zuta, w: 2.6 }), odb = zrak(s, [[X, yG], [0, 0]], { b: C.zuta, w: 2 });
      const g = el(s, 'g');
      const l1 = put(g, '', { stroke: C.crvena, 'stroke-width': 2 }), l2 = put(g, '', { stroke: C.zelena, 'stroke-width': 2 });
      const t1 = tx(g, 0, 0, 'α', { v: 13, b: C.crvena }), t2 = tx(g, 0, 0, 'β', { v: 13, b: C.zelena });
      const tot = tx(s, W - 10, odozdo ? 14 : H - 12, '', { a: 'end', v: 12, b: C.narandz });
      const sy = odozdo ? 1 : -1; // strana upadnog zraka (1 = dole)
      let stari = [];
      const zameni = (z, pts, a) => { const n = zrak(s, pts, a); s.replaceChild(n.e, z.e); return n; };
      let Z = [ul, izl, odb];
      return {
        trajanje: m.menja ? 12 : 3, pauza: m.menja ? 0 : 2,
        kadar(t) {
          const u = m.menja ? 40 + 38 * Math.sin((t / 12) * 2 * Math.PI - Math.PI / 2) + 0.5 : br(m.ugao, 45);
          const sb = (n1 / n2) * Math.sin(u * RAD), totalna = sb >= 1;
          const b = totalna ? 0 : Math.asin(sb) / RAD;
          const p0 = [X - D * Math.sin(u * RAD), yG + sy * D * Math.cos(u * RAD)];
          const p1 = [X + D * Math.sin(b * RAD), yG - sy * D * Math.cos(b * RAD)];
          const p2 = [X + D * Math.sin(u * RAD), yG + sy * D * Math.cos(u * RAD)];
          const kljuc = [u, b].map(Math.round).join();
          if (kljuc !== stari) {
            stari = kljuc;
            Z = [zameni(Z[0], [p0, [X, yG]], { b: C.zuta, w: 2.6 }), zameni(Z[1], [[X, yG], p1], { b: C.zuta, w: 2.6 }), zameni(Z[2], [[X, yG], p2], { b: C.zuta, w: totalna ? 2.6 : 1.4, op: totalna ? 1 : 0.35 })];
          }
          const tt = m.menja ? 9 : t;
          Z[0].set(tt / 1.2); Z[1].set(totalna ? 0 : (tt - 1.2) / 1.2); Z[2].set((tt - 1.2) / 1.2);
          g.style.display = tt > 2.4 && m.uglovi !== false ? '' : 'none';
          const a0 = odozdo ? 90 : -90;
          l1.setAttribute('d', odozdo ? luk(X, yG, 30, 90, 90 + u) : luk(X, yG, 30, -90 - u, -90));
          l2.setAttribute('d', totalna ? '' : odozdo ? luk(X, yG, 36, -90, -90 + b) : luk(X, yG, 36, 90 - b, 90));
          at(t1, { x: X - 44 * Math.sin((u / 2) * RAD), y: yG + sy * 44 * Math.cos((u / 2) * RAD) });
          at(t2, { x: X + 50 * Math.sin((b / 2) * RAD), y: yG - sy * 50 * Math.cos((b / 2) * RAD) });
          t2.style.display = totalna ? 'none' : '';
          if (m.menja) { postaviTekst(t1, `${Math.round(u)}°`); postaviTekst(t2, `${Math.round(b)}°`); }
          postaviTekst(tot, totalna && m.oznake !== false ? '~totalna refleksija' : '');
          void a0;
        },
      };
    },

    // Prizma: bela svetlost se razlaže na boje (disperzija). duga: false – bez natpisa boja.
    prizma(s, m) {
      const W = 320, H = 200;
      vel(s, W, H);
      const P = [[160, 30], [100, 150], [220, 150]];
      el(s, 'polygon', { points: tacke(P), fill: 'rgba(255,255,255,.12)', stroke: C.bela, 'stroke-width': 2 });
      const boje = ['#ff3b3b', '#ff8c1a', '#ffe11a', '#3ddc5a', '#3aa0ff', '#4b4bff', '#a64bff'];
      const nn = boje.map((_, i) => 1.47 + i * 0.03); // razlika je preuveličana da se boje vide
      const presek = (o, d, a, b) => { // zrak o + t·d sa duži a–b
        const ex = b[0] - a[0], ey = b[1] - a[1], den = d[0] * ey - d[1] * ex;
        const t = ((a[0] - o[0]) * ey - (a[1] - o[1]) * ex) / den, u = ((a[0] - o[0]) * d[1] - (a[1] - o[1]) * d[0]) / den;
        return t > 1e-6 && u >= 0 && u <= 1 ? [o[0] + d[0] * t, o[1] + d[1] * t] : null;
      };
      const lomi = (d, nrm, n) => { // Snel, vektorski; nrm ka upadnoj strani
        const c = -(d[0] * nrm[0] + d[1] * nrm[1]), k = 1 - n * n * (1 - c * c);
        if (k < 0) return null;
        return [n * d[0] + (n * c - Math.sqrt(k)) * nrm[0], n * d[1] + (n * c - Math.sqrt(k)) * nrm[1]];
      };
      const norm = (a, b, spolja) => { let nx = b[1] - a[1], ny = -(b[0] - a[0]); const L = Math.hypot(nx, ny); nx /= L; ny /= L; return spolja ? [nx, ny] : [-nx, -ny]; };
      const o = [10, 118], d0 = [1, -0.32]; const L0 = Math.hypot(...d0); const d = [d0[0] / L0, d0[1] / L0];
      const ulaz = presek(o, d, P[0], P[1]);
      const bela = zrak(s, [o, ulaz], { b: C.bela, w: 3 });
      const zr = boje.map((b, i) => {
        const n1 = norm(P[0], P[1], false); // ka spolja (levo gore)
        const nl = [-n1[0], -n1[1]];
        const d1 = lomi(d, nl[0] * d[0] + nl[1] * d[1] < 0 ? nl : n1, 1 / nn[i]);
        const izl = presek(ulaz, d1, P[0], P[2]);
        const n2 = norm(P[0], P[2], true);
        const n2u = n2[0] * d1[0] + n2[1] * d1[1] < 0 ? n2 : [-n2[0], -n2[1]];
        const d2 = lomi(d1, n2u, nn[i]);
        return zrak(s, [ulaz, izl, [izl[0] + d2[0] * 200, izl[1] + d2[1] * 200]], { b, w: 2.4 });
      });
      return { trajanje: 3, pauza: 2.5, kadar(t) { bela.set(t / 1); zr.forEach((z) => z.set((t - 1) / 1.6)); } };
    },

    // Planparalelna ploča (prozorsko staklo): zrak izlazi paralelan upadnom, samo pomeren. ugao (upadni, °).
    ploca(s, m) {
      const W = 320, H = 200;
      vel(s, W, H);
      const y1 = 70, y2 = 130, X = 130, n = 1.5, u = br(m.ugao, 50) * RAD;
      el(s, 'rect', { x: 10, y: y1, width: 300, height: y2 - y1, fill: 'rgba(116,185,255,.22)', stroke: C.plava, 'stroke-width': 1.5 });
      tx(s, 300, y1 + 14, '~staklo', { a: 'end', v: 11, b: C.siva });
      const b = Math.asin(Math.sin(u) / n);
      const p0 = [X - 70 * Math.tan(u), y1 - 70], p1 = [X, y1], p2 = [X + (y2 - y1) * Math.tan(b), y2], p3 = [p2[0] + 66 * Math.tan(u), y2 + 66];
      lin(s, X, y1 - 50, X, y1 + 20, C.siva, 1.2, true); lin(s, p2[0], y2 - 20, p2[0], y2 + 50, C.siva, 1.2, true);
      const pro = zrak(s, [p1, [X + 136 * Math.tan(u), y1 + 136]], { b: C.siva, isp: true, op: 0.6, w: 1.5 });
      const z = zrak(s, [p0, p1, p2, p3], { b: C.zuta, w: 2.6 });
      return { trajanje: 3, pauza: 2, kadar(t) { z.set(t / 2); pro.set((t - 2) / 0.8); } };
    },

    // Senka. tip 'tackasti' (oštra senka) | 'veliki' (senka i polusenka) | 'oba' (smenjuju se).
    senka(s, m) {
      const W = 320, H = 200, v = m.tip || 'oba';
      vel(s, W, H);
      const zid = 290, ob = [170, 100, 22];
      el(s, 'rect', { x: zid, y: 10, width: 8, height: 180, fill: C.siva });
      const sl = el(s, 'g');
      const polu = el(sl, 'polygon', { fill: 'rgba(0,0,0,.4)' }), pun = el(sl, 'polygon', { fill: 'rgba(0,0,0,.85)' });
      const oz = m.oznake ? [tx(s, 0, 0, '~senka', { v: 11, a: 'end', b: C.siva }), tx(s, 0, 0, '~polusenka', { v: 11, a: 'end', b: C.siva })] : null;
      const zz = el(s, 'g');
      const zid1 = el(s, 'rect', { x: zid - 3, y: 0, width: 3, height: 0, fill: '#2d3436' }), zid2 = el(s, 'rect', { x: zid - 3, y: 0, width: 3, height: 0, fill: '#636e72' });
      void zid2;
      kr(s, ob[0], ob[1], ob[2], { fill: '#b2bec3' });
      const izv = kr(s, 40, 100, 4, { fill: C.zuta });
      const sjaj = kr(s, 40, 100, 14, { fill: C.zuta, opacity: 0.25 });
      const nat = tx(s, 40, 186, '', { v: 11, b: C.siva });
      const tang = (sx, sy, sr, gore, unutra) => {
        // tangente sa izvora (krug poluprečnika sr) na prepreku: spoljašnje (gore/dole) ili unutrašnje
        const dx = ob[0] - sx, dy = ob[1] - sy, d = Math.hypot(dx, dy);
        const r = unutra ? ob[2] + sr : ob[2] - sr;
        const a = Math.atan2(dy, dx), b = Math.asin(r / d) * (gore ? -1 : 1);
        const u = a + b;
        const y = (x) => (unutra ? sy - (gore ? -1 : 1) * 0 : sy) + Math.tan(u) * (x - sx);
        void y;
        return u;
      };
      const crtaj = (veliki) => {
        const sr = veliki ? 16 : 0.01;
        at(izv, { r: veliki ? 16 : 4 }); at(sjaj, { r: veliki ? 26 : 12 });
        // spoljašnje tangente → granica pune senke; unutrašnje → granica polusenke
        const yz = (x0, y0, u) => y0 + Math.tan(u) * (zid - x0);
        const ug = tang(40, 100, sr, true, false), ud = tang(40, 100, sr, false, false);
        const ig = tang(40, 100, sr, true, true), id = tang(40, 100, sr, false, true);
        const ta = (u, gore) => [ob[0] + ob[2] * Math.cos(u + (gore ? -Math.PI / 2 : Math.PI / 2)), ob[1] + ob[2] * Math.sin(u + (gore ? -Math.PI / 2 : Math.PI / 2))];
        const A1 = ta(ug, true), A2 = ta(ud, false);
        const yA1 = A1[1] + Math.tan(ug) * (zid - A1[0]), yA2 = A2[1] + Math.tan(ud) * (zid - A2[0]);
        at(pun, { points: tacke([A1, [zid, yA1], [zid, yA2], A2]) });
        const B1 = ta(id, true), B2 = ta(ig, false);
        const yB1 = B1[1] + Math.tan(id) * (zid - B1[0]), yB2 = B2[1] + Math.tan(ig) * (zid - B2[0]);
        at(polu, { points: veliki ? tacke([B1, [zid, yB1], [zid, yB2], B2]) : '' });
        zz.replaceChildren();
        for (const [P, y, u] of [[A1, yA1, ug], [A2, yA2, ud], ...(veliki ? [[B1, yB1, id], [B2, yB2, ig]] : [])]) {
          const sx = veliki ? 40 + 16 * Math.cos(Math.atan2(P[1] - 100, P[0] - 40) + Math.PI / 2 * 0) : 40;
          void sx; void u;
          lin(zz, 40, 100, zid, y, C.zuta, 1, '3 3').setAttribute('opacity', 0.5);
          void P;
        }
        at(zid1, { y: Math.min(yA1, yA2), height: Math.abs(yA2 - yA1) });
        if (oz) { at(oz[0], { x: zid - 8, y: 100 }); at(oz[1], { x: zid - 8, y: Math.min(yB1, yB2) + 8 }); oz[1].style.display = veliki ? '' : 'none'; }
        postaviTekst(nat, veliki ? '~veliki izvor' : '~tačkasti izvor');
        void yz;
      };
      let pre = null;
      return {
        trajanje: Infinity,
        kadar(t) {
          const veliki = v === 'veliki' || (v === 'oba' && Math.floor(t / 3.5) % 2 === 1);
          if (veliki !== pre) { crtaj(veliki); pre = veliki; }
          at(sjaj, { opacity: f2(0.2 + 0.08 * Math.sin(t * 4)) });
        },
      };
    },

    // Pomračenje (pogled odozgo, nije u razmeri). tip 'sunca' | 'meseca' | 'oba'.
    pomracenje(s, m) {
      const W = 320, H = 200, v = m.tip || 'oba';
      vel(s, W, H);
      kr(s, -30, 100, 70, { fill: '#fdcb6e' });
      kr(s, -30, 100, 80, { fill: '#fdcb6e', opacity: 0.2 });
      tx(s, 22, 186, '~Sunce', { v: 11, b: C.narandz });
      const Z = [210, 100], rz = 16, rm = 7, R = 55;
      const senkaZ = el(s, 'polygon', { fill: 'rgba(0,0,0,.6)', points: tacke([[Z[0], Z[1] - rz], [W, Z[1] - rz * 0.6], [W, Z[1] + rz * 0.6], [Z[0], Z[1] + rz]]) });
      void senkaZ;
      put(s, `M${Z[0] + R},${Z[1]} A${R},${R} 0 1 1 ${Z[0] - R},${Z[1]} A${R},${R} 0 1 1 ${Z[0] + R},${Z[1]}`, { stroke: C.tamna, 'stroke-width': 1.2, 'stroke-dasharray': '3 4' });
      kr(s, Z[0], Z[1], rz, { fill: '#0984e3' });
      tx(s, Z[0], Z[1] + 30, '~Zemlja', { v: 11, b: C.plava });
      const senkaM = el(s, 'polygon', { fill: 'rgba(0,0,0,.7)' });
      const mesec = kr(s, 0, 0, rm, { fill: '#dfe6e9' });
      const nat = tx(s, 160, 14, '', { v: 12, b: C.zuta });
      const mrlja = kr(s, Z[0] - rz + 2, Z[1], 4, { fill: '#000', opacity: 0 });
      return {
        trajanje: Infinity,
        kadar(t) {
          // Mesec stalno obilazi Zemlju (suprotno kazaljci); natpis samo za traženo pomračenje
          const a = Math.PI * 0.6 - (t / 9) * 2 * Math.PI;
          const x = Z[0] + R * Math.cos(a), y = Z[1] + R * Math.sin(a);
          at(mesec, { cx: x, cy: y });
          // senka Meseca (pada desno, od Sunca)
          at(senkaM, { points: tacke([[x, y - rm], [x + 70, y - rm * 0.3], [x + 70, y + rm * 0.3], [x, y + rm]]) });
          const uSenciZ = Math.cos(a) > 0.93;
          const sSunca = Math.cos(a) < -0.97;
          at(mesec, { fill: uSenciZ ? '#a0522d' : '#dfe6e9' });
          at(mrlja, { opacity: sSunca ? 0.9 : 0 });
          postaviTekst(nat, m.oznake === false ? '' : uSenciZ && v !== 'sunca' ? '~pomračenje Meseca' : sSunca && v !== 'meseca' ? '~pomračenje Sunca' : '');
        },
      };
    },

    // Mračna komora (camera obscura): lik je obrnut. e: emodži predmeta.
    kamera(s, m) {
      const W = 320, H = 200;
      vel(s, W, H);
      el(s, 'rect', { x: 170, y: 40, width: 130, height: 120, fill: '#1e272e', stroke: C.siva, 'stroke-width': 2.5 });
      el(s, 'rect', { x: 168, y: 97, width: 5, height: 6, fill: C.pozadina });
      const pr = emo(s, m.e || '🌲', 80); poz(pr, 60, 100);
      const lik = emo(s, m.e || '🌲', 40); poz(lik, 280, 100, false, 180); lik.setAttribute('opacity', 0.85);
      const z1 = zrak(s, [[60, 62], [170, 100], [298, 144]], { b: C.zuta, w: 1.8 });
      const z2 = zrak(s, [[60, 138], [170, 100], [298, 56]], { b: C.narandz, w: 1.8 });
      return { trajanje: 3, pauza: 2.5, kadar(t) { z1.set(t / 1.6); z2.set((t - 0.4) / 1.6); lik.style.display = t > 2.1 ? '' : 'none'; } };
    },

    // Optičko vlakno: svetlost se totalno odbija od zidova.
    vlakno(s, m) {
      const W = 320, H = 160;
      vel(s, W, H);
      el(s, 'rect', { x: 10, y: 50, width: 300, height: 60, rx: 30, fill: 'rgba(116,185,255,.18)', stroke: C.plava, 'stroke-width': 2 });
      const pts = [[10, 64]];
      let x = 10, y = 64, dir = 1;
      while (x < 300) { x += 46; y = dir > 0 ? 104 : 56; pts.push([Math.min(x, 310), y]); dir = -dir; }
      const z = zrak(s, pts, { b: C.zuta, w: 2.6 });
      const sv = kr(s, 0, 0, 5, { fill: C.zuta });
      return { trajanje: 2.6, pauza: 0.8, kadar(t) { z.set(t / 2.4); const [a, b] = z.tacka(Math.min(1, t / 2.4)); at(sv, { cx: a, cy: b }); } };
    },

    // Čestice. stanje 'cvrsto' | 'tecno' | 'gas', temp (brzina, 1 = sobna), poredi: [{stanje, temp, o}] (više posuda),
    // tip 'difuzija' | 'braun' | 'zagrevanje'.
    cestice(s, m) {
      const W = 320, rnd = slucajni(9);
      const posude = niz(m.poredi).length ? niz(m.poredi).slice(0, 3) : [{ stanje: m.stanje || 'gas', temp: m.temp, o: m.o }];
      const v = m.tip;
      const H = v ? 200 : 190;
      vel(s, W, H);
      const n = v ? 1 : posude.length, gap = 12, bw = v ? 280 : (W - 20 - gap * (n - 1)) / n, bh = v ? 160 : 140, by = v ? 12 : 30;
      const sve = [];
      const kutije = (v ? [{ stanje: v === 'zagrevanje' ? 'cvrsto' : 'gas', temp: m.temp }] : posude).map((p, i) => {
        const bx = 10 + i * (bw + gap);
        el(s, 'rect', { x: bx, y: by, width: bw, height: bh, rx: 4, fill: 'rgba(255,255,255,.03)', stroke: C.siva, 'stroke-width': 2 });
        if (p.o) tx(s, bx + bw / 2, by + bh + 14, p.o, { v: 12 });
        const T = br(p.temp, 1);
        const c = [];
        const st = p.stanje || 'gas';
        if (st === 'cvrsto') {
          // kod zagrevanja rešetka se širi oko središta posude, inače čestice leže na dnu
          const k = 7, r = Math.min(bw, bh) / (k + 1) / (v === 'zagrevanje' ? 3 : 2.4);
          const cx = bx + bw / 2, cy = v === 'zagrevanje' ? by + bh / 2 : by + bh - 4;
          for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) c.push({ x0: cx + (a - (k - 1) / 2) * r * 2.3, y0: v === 'zagrevanje' ? cy + (b - (k - 1) / 2) * r * 2.3 : by + bh - (b + 0.7) * r * 2.3 - 4, cx, cy, f: rnd() * 6.28, g: rnd() * 6.28, r, st, T });
        } else if (st === 'tecno') {
          const r = Math.min(bw / 18, 5);
          for (let a = 0; a < 30; a++) c.push({ x: bx + r + rnd() * (bw - 2 * r), y: by + bh * 0.4 + rnd() * (bh * 0.6 - r), vx: (rnd() - 0.5) * 30 * T, vy: (rnd() - 0.5) * 30 * T, r, st, gr: [bx + r, by + bh * 0.38, bx + bw - r, by + bh - r], T });
        } else {
          const r = Math.min(bw / 16, 5);
          for (let a = 0; a < (v === 'difuzija' ? 60 : 16); a++) {
            const levo = v === 'difuzija' ? a % 2 === 0 : true;
            c.push({ x: v === 'difuzija' ? (levo ? bx + r + rnd() * (bw / 2 - 2 * r) : bx + bw / 2 + r + rnd() * (bw / 2 - 2 * r)) : bx + r + rnd() * (bw - 2 * r), y: by + r + rnd() * (bh - 2 * r), vx: (rnd() - 0.5) * 140 * T, vy: (rnd() - 0.5) * 140 * T, r, st, gr: [bx + r, by + r, bx + bw - r, by + bh - r], boja: v === 'difuzija' ? (levo ? C.plava : C.roze) : C.plava, levo });
          }
        }
        c.forEach((q) => { q.e = kr(s, 0, 0, q.r, { fill: q.boja || (st === 'cvrsto' ? C.narandz : st === 'tecno' ? C.plava : C.zelena) }); sve.push(q); });
        return { bx, c };
      });
      let pregrada = null, braun = null, putB = null, trag = [];
      if (v === 'difuzija') pregrada = lin(s, 150, by, 150, by + bh, C.bela, 3);
      if (v === 'braun') {
        sve.forEach((q) => { at(q.e, { r: 2, opacity: 0.5 }); q.vx *= 1.6; q.vy *= 1.6; });
        braun = { x: 150, y: 92, vx: 0, vy: 0, e: kr(s, 150, 92, 9, { fill: C.zuta }) };
        putB = el(s, 'polyline', { fill: 'none', stroke: C.zuta, 'stroke-width': 1.2, opacity: 0.6 });
        s.insertBefore(putB, braun.e);
      }
      let tPre = 0;
      return {
        trajanje: v === 'difuzija' || v === 'braun' ? 12 : Infinity, pauza: 0.5,
        kadar(t, novo) {
          let dt = Math.min(0.04, Math.max(0, t - tPre));
          if (novo) { dt = 0; trag = []; }
          tPre = t;
          if (pregrada) pregrada.style.display = t < 1.5 ? '' : 'none';
          for (const q of sve) {
            if (q.st === 'cvrsto') {
              const top = v === 'zagrevanje' ? 0.5 - 0.5 * Math.cos((t / 6) * 2 * Math.PI) : 0;
              const A = 1.2 * q.T + 2.5 * top, sir = 1 + 0.16 * top;
              at(q.e, { cx: q.cx + (q.x0 - q.cx) * sir + A * Math.sin(t * 13 + q.f), cy: q.cy + (q.y0 - q.cy) * sir + A * Math.cos(t * 11 + q.g), fill: v === 'zagrevanje' ? `rgb(${Math.round(253 - 0 * top)},${Math.round(203 - 120 * top)},${Math.round(110 - 60 * top)})` : null });
              continue;
            }
            if (novo && q.x0s === undefined) { q.x0s = q.x; q.y0s = q.y; }
            if (novo) { q.x = q.x0s; q.y = q.y0s; }
            q.x += q.vx * dt; q.y += q.vy * dt;
            const [x1, y1, x2, y2] = q.gr;
            const gx2 = pregrada && t < 1.5 && q.levo ? 150 - q.r : x2, gx1 = pregrada && t < 1.5 && !q.levo ? 150 + q.r : x1;
            if (q.x < gx1) { q.x = gx1; q.vx = Math.abs(q.vx); } if (q.x > gx2) { q.x = gx2; q.vx = -Math.abs(q.vx); }
            if (q.y < y1) { q.y = y1; q.vy = Math.abs(q.vy); } if (q.y > y2) { q.y = y2; q.vy = -Math.abs(q.vy); }
            if (q.st === 'tecno') { q.vx += (rnd() - 0.5) * 80 * q.T * dt * 10; q.vy += (rnd() - 0.5) * 80 * q.T * dt * 10; const vm = 30 * q.T, vv = Math.hypot(q.vx, q.vy); if (vv > vm) { q.vx *= vm / vv; q.vy *= vm / vv; } }
            at(q.e, { cx: q.x, cy: q.y });
          }
          if (braun) {
            if (novo) { braun.x = 150; braun.y = 92; }
            braun.vx += (rnd() - 0.5) * 900 * dt; braun.vy += (rnd() - 0.5) * 900 * dt;
            braun.vx *= 0.9; braun.vy *= 0.9;
            braun.x = ogr(braun.x + braun.vx * dt, 22, 278); braun.y = ogr(braun.y + braun.vy * dt, 22, 162);
            at(braun.e, { cx: braun.x, cy: braun.y });
            trag.push([braun.x, braun.y]); if (trag.length > 400) trag.shift();
            putB.setAttribute('points', tacke(trag));
          }
          void kutije;
        },
      };
    },

    // Magneti. tip 'sipka' (linije polja + kompas koji kruži) | 'polovi' (polovi: 'NS' privlače, 'NN' odbijaju) |
    // 'zica' (provodnik sa strujom, igle kompasa; obrni: menja smer struje) | 'kalem' | 'zemlja'.
    magnet(s, m) {
      const W = 320, H = 200, v = m.tip || 'sipka';
      vel(s, W, H);
      const igla = (r, d = 12) => { const g = el(r, 'g'); el(g, 'polygon', { points: `${d},0 0,-3.5 0,3.5`, fill: C.crvena }); el(g, 'polygon', { points: `${-d},0 0,-3.5 0,3.5`, fill: '#dfe6e9' }); kr(g, 0, 0, 1.6, { fill: C.pozadina }); return g; };
      const sipka = (r, x, y, w = 100, h = 24, nDesno = true) => {
        const g = el(r, 'g', { transform: `translate(${x} ${y})` });
        el(g, 'rect', { x: -w / 2, y: -h / 2, width: w / 2, height: h, fill: nDesno ? '#3a86ff' : '#e63946' });
        el(g, 'rect', { x: 0, y: -h / 2, width: w / 2, height: h, fill: nDesno ? '#e63946' : '#3a86ff' });
        tx(g, -w / 4, 0, nDesno ? 'S' : 'N', { v: 14, obrub: false }); tx(g, w / 4, 0, nDesno ? 'N' : 'S', { v: 14, obrub: false });
        return g;
      };
      if (v === 'polovi') {
        // levi magnet miruje (S|N), desni se primiče: NS – privlače se i spoje, NN – odbijaju se
        const isti = (m.polovi || 'NS') !== 'NS';
        sipka(s, 80, 100, 110, 26, true);
        const desni = sipka(s, 0, 0, 110, 26, !isti);
        const f1 = strelica(s, C.zelena, 3), f2s = strelica(s, C.zelena, 3);
        return {
          trajanje: 3.4, pauza: 1,
          kadar(t) {
            const x = isti ? 290 - 62 * glatko(t / 1.4) + (t > 1.4 ? 34 * glatko((t - 1.4) / 0.8) : 0)
              : 290 - 40 * glatko(t / 1.2) - (t > 1.2 ? Math.min(60, 150 * (t - 1.2) ** 2) : 0);
            desni.setAttribute('transform', `translate(${f2(x)} 100)`);
            const vid = t > 0.9 && t < 2.6;
            f1.g.style.display = f2s.g.style.display = vid ? '' : 'none';
            if (vid) {
              if (isti) { f1.set(140, 70, 108, 70); f2s.set(x - 52, 70, x - 20, 70); }
              else { f1.set(108, 70, 140, 70); f2s.set(x - 20, 70, x - 52, 70); }
            }
          },
        };
      }
      if (v === 'zica') {
        const cx = 160, cy = 100;
        for (const r of [30, 55, 80]) kr(s, cx, cy, r, { fill: 'none', stroke: C.tamna, 'stroke-width': 1.5, 'stroke-dasharray': '4 4' });
        const sm = el(s, 'g');
        kr(s, cx, cy, 12, { fill: '#b87333', stroke: C.bela, 'stroke-width': 2 });
        const tacka = kr(s, cx, cy, 3.5, { fill: C.bela });
        const krst = el(s, 'g'); lin(krst, cx - 6, cy - 6, cx + 6, cy + 6, C.bela, 2.5); lin(krst, cx - 6, cy + 6, cx + 6, cy - 6, C.bela, 2.5);
        const igle = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * 2 * Math.PI; const g = igla(s, 11); return { a, g }; });
        const nat = tx(s, 12, 14, '', { a: 'start', v: 11, b: C.siva });
        let ug = 0;
        return {
          trajanje: Infinity,
          kadar(t) {
            const smer = m.obrni === false || Math.floor(t / 3.5) % 2 === 0 ? 1 : -1; // 1 = struja iz ekrana (⊙) → polje suprotno kazaljci
            tacka.style.display = smer > 0 ? '' : 'none'; krst.style.display = smer > 0 ? 'none' : '';
            const cilj = smer > 0 ? 0 : 180;
            ug += (cilj - ug) * 0.08;
            igle.forEach(({ a, g }) => {
              const x = cx + 55 * Math.cos(a), y = cy + 55 * Math.sin(a);
              const smerPolja = Math.atan2(-Math.cos(a), Math.sin(a)) / RAD; // tangenta (suprotno kazaljci na ekranu)
              g.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(smerPolja + ug)})`);
            });
            postaviTekst(nat, smer > 0 ? '~struja izlazi iz ekrana' : '~struja ulazi u ekran');
            void sm;
          },
        };
      }
      if (v === 'zemlja') {
        const cx = 160, cy = 100, R = 46, nag = -11;
        const g = el(s, 'g', { transform: `rotate(${nag} ${cx} ${cy})` });
        const nab = [[cx, cy + 14, 1], [cx, cy - 14, -1]];
        const linije = linijePolja(nab, Array.from({ length: 12 }, (_, i) => { const a = Math.PI / 2 + ((i - 5.5) / 6) * 1.25; return [cx + 3 * Math.cos(a), cy + 14 + 3 * Math.sin(a)]; }), [-60, -60, 380, 260]);
        linije.forEach((p) => { put(g, putanja(p), { stroke: C.ljub, 'stroke-width': 1.4, opacity: 0.8 }); smerNaLiniji(g, p, C.ljub, 0.3); });
        kr(s, cx, cy, R, { fill: '#0984e3', stroke: C.bela, 'stroke-width': 1.5 });
        put(s, `M${cx - 30},${cy - 20} q10,-10 25,-2 q8,10 -5,16 q-14,4 -20,-14 M${cx + 8},${cy + 6} q14,-6 20,6 q-4,16 -16,12 z`, { fill: '#27ae60' });
        lin(s, cx, cy - R - 16, cx, cy + R + 16, C.bela, 1.2, '3 3');
        tx(s, cx, cy - R - 24, '~geografski sever', { v: 11 });
        const gm = el(s, 'g', { transform: `rotate(${nag} ${cx} ${cy})` });
        tx(gm, cx, cy - R + 10, 'S', { v: 13, b: '#3a86ff' }); tx(gm, cx, cy + R - 10, 'N', { v: 13, b: '#e63946' });
        const k = igla(s, 10);
        return { trajanje: Infinity, kadar(t) { const a = -Math.PI / 2 - 0.7 + 0.35 * Math.sin(t); const x = cx + (R + 12) * Math.cos(a), y = cy + (R + 12) * Math.sin(a); k.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(-90 + nag + 4 * Math.sin(t * 5))})`); } };
      }
      // šipka ili kalem: linije polja kao kod dva pola
      const kal = v === 'kalem';
      const cx = 160, cy = 100, a = kal ? 56 : 40;
      const nab = [[cx + a, cy, 1], [cx - a, cy, -1]];
      const st = [];
      for (let i = 0; i < 16; i++) { const u = ((i + 0.5) / 16) * 2 * Math.PI; st.push([cx + a + 4 * Math.cos(u), cy + 4 * Math.sin(u)]); }
      const linije = linijePolja(nab, st, [-20, -20, W + 20, H + 20]);
      // polje je simetrično: linije koje izađu iz crteža preslikaju se u linije koje ulaze u južni pol
      for (const p of [...linije]) { const k = p[p.length - 1]; if (Math.hypot(k[0] - (cx - a), k[1] - cy) > 8) linije.push(p.map(([x, y]) => [2 * cx - x, y]).reverse()); }
      const pol = el(s, 'g');
      linije.forEach((p) => {
        const e = put(pol, putanja(p), { stroke: C.ljub, 'stroke-width': 1.5, 'stroke-dasharray': '6 5', opacity: 0.85 });
        e.classList.add('tok');
        smerNaLiniji(pol, p, C.ljub, 0.25);
      });
      if (kal) {
        el(s, 'rect', { x: cx - 70, y: cy - 20, width: 140, height: 40, fill: 'rgba(11,24,38,.8)' });
        for (let i = 0; i < 12; i++) { const x = cx - 64 + i * 11.6; put(s, `M${f2(x)},${cy + 22} L${f2(x + 6)},${cy - 22}`, { stroke: '#e17055', 'stroke-width': 3 }); }
        tx(s, cx + 82, cy, 'N', { v: 14, b: '#e63946' }); tx(s, cx - 82, cy, 'S', { v: 14, b: '#3a86ff' });
      } else sipka(s, cx, cy, 100, 24, true);
      const k = m.kompas === false ? null : igla(s, 11);
      const B = (x, y) => { let bx = 0, by = 0; for (const [nx, ny, q] of nab) { const dx = x - nx, dy = y - ny, r3 = Math.pow(dx * dx + dy * dy, 1.5) + 1e-6; bx += (q * dx) / r3; by += (q * dy) / r3; } return [bx, by]; };
      const linijeE = [...pol.querySelectorAll('.tok')];
      return {
        trajanje: Infinity,
        kadar(t) {
          linijeE.forEach((e) => e.setAttribute('stroke-dashoffset', f2(-t * 14)));
          if (k) {
            const u = (t / 10) * 2 * Math.PI, x = cx + 120 * Math.cos(u), y = cy + 72 * Math.sin(u);
            const [bx, by] = B(x, y);
            k.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(Math.atan2(by, bx) / RAD)})`);
          }
        },
      };
    },

    // Naelektrisanja. tip 'kuglice' (znaci: '+-' | '++' | '--'; dve kuglice na koncu) | 'polje' (znak: '+' | '−', ili dipol: true) |
    // 'elektroskop'.
    naelektrisanje(s, m) {
      const W = 320, H = 200, v = m.tip || 'kuglice';
      vel(s, W, H);
      const kuglica = (r, znak, rr = 14) => { const g = el(r, 'g'); kr(g, 0, 0, rr, { fill: znak === '+' ? '#e63946' : znak === '−' || znak === '-' ? '#3a86ff' : '#b2bec3', stroke: C.bela, 'stroke-width': 1.5 }); tx(g, 0, 0, znak === '-' ? '−' : znak, { v: 16, obrub: false }); return g; };
      if (v === 'polje') {
        const dip = !!m.dipol, znak = m.znak === '-' || m.znak === '−' ? -1 : 1;
        const nab = dip ? [[110, 100, 1], [210, 100, -1]] : [[160, 100, znak]];
        const st = [];
        const izv = dip ? nab[0] : nab[0];
        for (let i = 0; i < 16; i++) { const u = ((i + 0.5) / 16) * 2 * Math.PI; st.push([izv[0] + 5 * Math.cos(u), izv[1] + 5 * Math.sin(u), dip ? 1 : znak]); }
        const linije = linijePolja(nab, st, [-10, -10, W + 10, H + 10]);
        const g = el(s, 'g');
        const e = linije.map((p) => { const d = znak < 0 && !dip ? [...p].reverse() : p; const x = put(g, putanja(d), { stroke: C.ljub, 'stroke-width': 1.6, 'stroke-dasharray': '6 5' }); smerNaLiniji(g, d, C.ljub, dip ? 0.5 : 0.55); return x; });
        nab.forEach(([x, y, q]) => poz(kuglica(s, q > 0 ? '+' : '−', 15), x, y));
        return { trajanje: Infinity, kadar(t) { e.forEach((x) => x.setAttribute('stroke-dashoffset', f2(-t * 14))); } };
      }
      if (v === 'elektroskop') {
        put(s, 'M120,190 L120,90 Q160,60 200,90 L200,190 Z', { fill: 'rgba(255,255,255,.05)', stroke: C.siva, 'stroke-width': 2 });
        lin(s, 160, 40, 160, 130, '#b8860b', 4);
        kr(s, 160, 38, 10, { fill: '#b8860b' });
        const l1 = lin(s, 160, 130, 160, 170, '#ffd166', 3), l2 = lin(s, 160, 130, 160, 170, '#ffd166', 3);
        const stap = el(s, 'g');
        el(stap, 'rect', { x: 0, y: -6, width: 110, height: 12, rx: 5, fill: '#636e72' });
        for (let i = 0; i < 5; i++) tx(stap, 12 + i * 20, 0, '−', { v: 14, b: '#74b9ff', obrub: false });
        const zn = Array.from({ length: 4 }, () => tx(s, 0, 0, '−', { v: 13, b: '#74b9ff' }));
        return {
          trajanje: 5, pauza: 0.5,
          kadar(t) {
            const u = glatko(t / 1.8) * (t < 3.6 ? 1 : 1 - glatko((t - 3.6) / 1.2));
            stap.setAttribute('transform', `translate(${f2(290 - 110 * u)} ${f2(20 + 10 * (1 - u))}) rotate(-12)`);
            const a = 28 * u;
            at(l1, { x2: 160 - 40 * Math.sin(a * RAD), y2: 130 + 40 * Math.cos(a * RAD) }); at(l2, { x2: 160 + 40 * Math.sin(a * RAD), y2: 130 + 40 * Math.cos(a * RAD) });
            zn.forEach((z, i) => { const st = i % 2 ? 1 : -1; at(z, { x: 160 + st * (8 + 22 * Math.sin(a * RAD)), y: 150 + (i > 1 ? 10 : -4) }); z.style.opacity = u; });
          },
        };
      }
      const zn = String(m.znaci || '+-').replace('−', '-');
      const z1 = zn[0], z2 = zn[1];
      const privl = z1 !== z2;
      el(s, 'rect', { x: 60, y: 8, width: 200, height: 8, fill: C.tamna, rx: 2 });
      const n1 = lin(s, 124, 16, 124, 150, C.siva, 1.5), n2 = lin(s, 196, 16, 196, 150, C.siva, 1.5);
      const k1 = kuglica(s, z1 === '-' ? '−' : z1), k2 = kuglica(s, z2 === '-' ? '−' : z2);
      const f1 = strelica(s, C.zelena, 3), f2s = strelica(s, C.zelena, 3);
      return {
        trajanje: 3, pauza: 1.2,
        kadar(t) {
          const u = glatko((t - 0.4) / 1.4) * (privl ? 6 : 14);
          const L = 134;
          const p1 = [124 + (privl ? 1 : -1) * L * Math.sin(u * RAD), 16 + L * Math.cos(u * RAD)];
          const p2 = [196 - (privl ? 1 : -1) * L * Math.sin(u * RAD), 16 + L * Math.cos(u * RAD)];
          at(n1, { x2: p1[0], y2: p1[1] }); at(n2, { x2: p2[0], y2: p2[1] });
          poz(k1, p1[0], p1[1]); poz(k2, p2[0], p2[1]);
          const s1 = privl ? 1 : -1;
          f1.set(p1[0], p1[1] - 26, p1[0] + s1 * 17, p1[1] - 26); f2s.set(p2[0], p2[1] - 26, p2[0] - s1 * 17, p2[1] - 26);
          f1.g.style.display = f2s.g.style.display = t > 0.4 ? '' : 'none';
        },
      };
    },

    // Radioaktivnost i nuklearne reakcije. tip 'poluraspad' (koraka) | 'fisija' | 'lancana' | 'fuzija' | 'prodornost' | 'raderford'.
    raspad(s, m) {
      const W = 320, H = 200, v = m.tip || 'poluraspad', rnd = slucajni(21);
      vel(s, W, H);
      const jezgro = (r, np, nn, rr) => {
        const g = el(r, 'g'), uk = np + nn;
        const rj = rr || 4 + 2.6 * Math.sqrt(uk);
        const ugl = slucajni(np * 31 + nn);
        const rc = uk <= 4 ? 5 : 3.6, vrste = []; // protoni i neutroni naizmenično
        for (let p = np, n = nn; p || n;) { if (p) { vrste.push(1); p--; } if (n) { vrste.push(0); n--; } }
        for (let i = 0; i < Math.min(uk, 40); i++) { const a = ugl() * 6.28, d = uk <= 4 ? (uk > 1 ? rc * 1.1 : 0) : Math.sqrt(ugl()) * (rj - 3.5); const a2 = uk <= 4 ? (i / uk) * 6.28 : a; kr(g, d * Math.cos(a2), d * Math.sin(a2), rc, { fill: vrste[i] ? '#e63946' : '#b2bec3', stroke: C.pozadina, 'stroke-width': 0.6 }); }
        return g;
      };
      if (v === 'poluraspad') {
        const k = 8, n = k * k, koraka = Math.max(1, Math.min(5, br(m.koraka, 4)));
        const at0 = [];
        for (let i = 0; i < n; i++) at0.push({ e: kr(s, 40 + (i % k) * 18, 30 + Math.floor(i / k) * 18, 7, { fill: '#55efc4' }), ziv: true, t: Infinity });
        // redosled raspada: svaki korak pola preostalih
        const red = at0.map((_, i) => i).sort(() => rnd() - 0.5);
        let ziv = n, pos = 0;
        for (let s2 = 1; s2 <= koraka; s2++) { const d = Math.floor(ziv / 2); for (let j = 0; j < d; j++) at0[red[pos++]].t = s2 * 1.8 - 0.6 * rnd(); ziv -= d; }
        const nat = tx(s, 236, 60, '', { v: 14, b: C.zuta, a: 'start' }), nat2 = tx(s, 236, 90, '', { v: 14, b: C.bela, a: 'start' });
        return {
          trajanje: koraka * 1.8 + 0.4, pauza: 2,
          kadar(t) {
            let ostalo = 0;
            at0.forEach((a) => { const r = t >= a.t; at(a.e, { fill: r ? '#3b5068' : '#55efc4', r: r ? 5 : 7 }); if (!r) ostalo++; });
            const st = Math.min(koraka, Math.floor(t / 1.8));
            postaviTekst(nat, `t = ${st ? st + ' · ' : ''}${st ? 'T½' : '0'}`);
            postaviTekst(nat2, `N = ${ostalo}`);
          },
        };
      }
      if (v === 'fisija' || v === 'fuzija') {
        const fis = v === 'fisija';
        const a = fis ? jezgro(s, 20, 26, 20) : jezgro(s, 1, 1, 7);
        const b = fis ? null : jezgro(s, 1, 2, 8);
        const he = fis ? null : jezgro(s, 2, 2, 9);
        const d1 = fis ? jezgro(s, 10, 12, 13) : null, d2 = fis ? jezgro(s, 9, 13, 13) : null;
        const n0 = kr(s, 0, 0, 4, { fill: '#b2bec3', stroke: C.bela, 'stroke-width': 1 });
        const nn = Array.from({ length: fis ? 3 : 1 }, () => kr(s, 0, 0, 4, { fill: '#b2bec3', stroke: C.bela, 'stroke-width': 1 }));
        const blesak = kr(s, 160, 100, 0, { fill: C.zuta, opacity: 0 });
        const E = tx(s, 160, 24, 'E', { v: 18, b: C.zuta });
        if (fis) { tx(s, 160, 186, m.o || 'U-235', { v: 12, b: C.siva }); }
        else { tx(s, 60, 150, m.o1 || '²H', { v: 12, b: C.siva }); tx(s, 260, 150, m.o2 || '³H', { v: 12, b: C.siva }); }
        const ug = [-50, 10, 70];
        return {
          trajanje: 3.6, pauza: 1.2,
          kadar(t) {
            const u = t - 1.4;
            if (fis) {
              n0.style.display = u < 0 ? '' : 'none';
              at(n0, { cx: 20 + 140 * Math.min(1, t / 1.4) - 20, cy: 100 });
              a.style.display = u < 0.3 ? '' : 'none';
              poz(a, 160, 100, false, 0, u > 0 ? 1 + u * 0.6 : 1);
              [d1, d2].forEach((d, i) => { d.style.display = u >= 0.3 ? '' : 'none'; poz(d, 160 + (i ? 1 : -1) * 60 * (u - 0.3), 100 + (i ? 1 : -1) * 25 * (u - 0.3)); });
              nn.forEach((n, i) => { n.style.display = u >= 0.3 ? '' : 'none'; const r = 110 * (u - 0.3); at(n, { cx: 160 + r * Math.cos(ug[i] * RAD), cy: 100 + r * Math.sin(ug[i] * RAD) }); });
            } else {
              const x = 70 + 80 * Math.min(1, t / 1.4);
              a.style.display = b.style.display = u < 0 ? '' : 'none';
              poz(a, x, 100); poz(b, 320 - x, 100);
              he.style.display = u >= 0 ? '' : 'none'; poz(he, 160 - 30 * Math.max(0, u), 100 - 10 * Math.max(0, u));
              nn[0].style.display = u >= 0 ? '' : 'none'; at(nn[0], { cx: 160 + 90 * Math.max(0, u), cy: 100 + 30 * Math.max(0, u) });
              at(n0, { cx: -20, cy: -20 });
            }
            const bl = u > 0 && u < 0.8 ? 1 - u / 0.8 : 0;
            at(blesak, { r: 10 + 60 * (u > 0 ? u : 0), opacity: f2(bl * 0.6) });
            E.style.display = u > 0.2 ? '' : 'none';
          },
        };
      }
      if (v === 'lancana') {
        // stablo: 1 → 3 → 9 → (deo) jezgara
        const cvorovi = [{ x: 40, y: 100, g: 0, rod: -1 }];
        for (let gen = 1; gen <= 3; gen++) {
          const pre = cvorovi.filter((c) => c.g === gen - 1);
          pre.forEach((p, j) => { const n = gen === 3 ? 2 : 3; for (let k = 0; k < n; k++) { const i = cvorovi.length; void i; cvorovi.push({ x: 40 + gen * 85, y: 0, g: gen, rod: cvorovi.indexOf(p) }); } void j; });
        }
        for (let gen = 1; gen <= 3; gen++) { const c = cvorovi.filter((x) => x.g === gen); c.forEach((x, i) => (x.y = 14 + ((i + 0.5) * 172) / c.length)); }
        const g0 = el(s, 'g');
        cvorovi.forEach((c) => { c.e = kr(s, c.x, c.y, c.g === 3 ? 5 : 8, { fill: '#e17055', stroke: C.bela, 'stroke-width': 1 }); if (c.rod >= 0) { const p = cvorovi[c.rod]; c.n = kr(s, p.x, p.y, 2.6, { fill: '#dfe6e9' }); c.l = lin(g0, p.x, p.y, p.x, p.y, C.tamna, 1); } });
        return {
          trajanje: 4.4, pauza: 1.4,
          kadar(t) {
            cvorovi.forEach((c) => {
              const tk = c.g * 1.1;
              at(c.e, { fill: t > tk + 0.1 ? C.zuta : '#e17055', opacity: t > tk + 0.4 ? 0.35 : 1 });
              if (c.rod >= 0) {
                const p = cvorovi[c.rod], u = ogr((t - (c.g - 1) * 1.1 - 0.15) / 0.95, 0, 1);
                at(c.n, { cx: p.x + (c.x - p.x) * u, cy: p.y + (c.y - p.y) * u });
                c.n.style.display = u > 0 && u < 1 ? '' : 'none';
                at(c.l, { x2: p.x + (c.x - p.x) * u, y2: p.y + (c.y - p.y) * u });
              }
            });
          },
        };
      }
      if (v === 'raderford') {
        el(s, 'rect', { x: 156, y: 10, width: 8, height: 180, fill: '#d4a017', opacity: 0.6 });
        for (let y = 16; y < 190; y += 12) kr(s, 160, y, 1.6, { fill: '#ffd166' });
        tx(s, 160, 6, '~zlatna folija', { v: 10, b: C.narandz });
        const cest = Array.from({ length: 18 }, (_, i) => ({ y: 20 + rnd() * 160, ug: i === 3 ? 160 : i === 11 ? 70 : i === 7 ? -35 : (rnd() - 0.5) * 6, f: rnd(), e: kr(s, 0, 0, 3, { fill: C.crvena }) }));
        return {
          trajanje: Infinity,
          kadar(t) {
            cest.forEach((c) => {
              const u = ((t / 2.4 + c.f) % 1) * 2;
              let x = 10 + u * 150, y = c.y;
              if (x > 160) { const d = x - 160; x = 160 + d * Math.cos(c.ug * RAD); y = c.y - d * Math.sin(c.ug * RAD); }
              at(c.e, { cx: x, cy: y });
            });
          },
        };
      }
      // prodornost: α staje na papiru, β na aluminijumu, γ prolazi (slabi) kroz olovo
      const zid = [[120, '~papir', '#f5f6fa', 4], [180, '~aluminijum', '#b2bec3', 8], [245, '~olovo', '#636e72', 20]];
      zid.forEach(([x, o, b, w]) => { el(s, 'rect', { x, y: 20, width: w, height: 160, fill: b }); tx(s, x + w / 2, 192, o, { v: 10, b: C.siva }); });
      el(s, 'rect', { x: 8, y: 80, width: 30, height: 40, rx: 4, fill: '#2d3436', stroke: C.zuta, 'stroke-width': 2 });
      tx(s, 23, 100, '☢', { v: 18, b: C.zuta, obrub: false });
      const vrste = [{ y: 55, o: 'α', b: C.crvena, stop: 120, r: 5 }, { y: 100, o: 'β', b: C.plava, stop: 180, r: 3 }, { y: 145, o: 'γ', b: C.zuta, stop: 330, r: 2.5 }];
      vrste.forEach((q) => { tx(s, 52, q.y - 14, q.o, { v: 14, b: q.b }); q.c = Array.from({ length: 5 }, (_, i) => ({ f: i / 5, e: q.o === 'γ' ? put(s, '', { stroke: q.b, 'stroke-width': 2 }) : kr(s, 0, 0, q.r, { fill: q.b }) })); });
      return {
        trajanje: Infinity,
        kadar(t) {
          vrste.forEach((q) => q.c.forEach((c) => {
            const u = (t / 2.2 + c.f) % 1, x = 40 + u * 290;
            const vid = x < q.stop;
            const op = q.o === 'γ' && x > 265 ? 0.4 : 1;
            if (q.o === 'γ') { c.e.setAttribute('d', `M${f2(x - 14)},${q.y} q3.5,-6 7,0 t7,0`); }
            else at(c.e, { cx: x, cy: q.y });
            c.e.style.display = vid ? '' : 'none';
            c.e.setAttribute('opacity', op);
          }));
        },
      };
    },

    // Mehanička energija. tip 'staza' (kuglica u žlebu; trenje: true – zaustavlja se) | 'odskok' (lopta odskače sve niže).
    energija(s, m) {
      const W = 320, H = 210, v = m.tip || 'staza';
      vel(s, W, H);
      const tr = trake(s, 252, H - 26, 150, [{ o: 'Ep', b: C.plava }, { o: 'Ek', b: C.crvena }, ...(m.trenje || v === 'odskok' ? [{ o: 'Q', b: C.narandz }] : [])]);
      if (v === 'odskok') {
        lin(s, 10, 186, 236, 186, C.tlo, 3);
        const lopta = kr(s, 120, 0, 10, { fill: C.narandz });
        const e = 0.8, h0 = 160;
        const trag = el(s, 'g');
        return {
          trajanje: 9, pauza: 0.6,
          kadar(t, novo) {
            if (novo) trag.replaceChildren();
            // segmenti odskoka
            let h = h0, tt = t, k = 0, poc = Math.sqrt(h0) * 0.11;
            let y = 0, E = 1, Ep = 1;
            // prvi pad
            if (tt < poc) { y = h0 * (1 - (tt / poc) ** 2); Ep = y / h0; }
            else {
              tt -= poc;
              for (;;) {
                h *= e; k++;
                const T = 2 * Math.sqrt(h) * 0.11;
                if (tt < T || k > 12) { const u = tt / T; y = h * 4 * u * (1 - u); break; }
                tt -= T;
              }
              E = h / h0 + 0; Ep = y / h0;
            }
            at(lopta, { cy: 176 - y * 1, cx: 60 + Math.min(t, 9) * 18 });
            tr.set([Ep, Math.max(0, E - Ep), 1 - E]);
          },
        };
      }
      const pts = [];
      for (let x = -1; x <= 1.0001; x += 0.05) pts.push([125 + x * 105, 180 - 140 * x * x]);
      put(s, putanja(pts), { stroke: C.siva, 'stroke-width': 3 });
      const lopta = kr(s, 0, 0, 9, { fill: C.narandz, stroke: C.bela, 'stroke-width': 1.5 });
      const d = m.trenje ? 0.12 : 0;
      return {
        trajanje: m.trenje ? 16 : Infinity, pauza: 0.4,
        kadar(t) {
          const A = 0.95 * Math.exp(-d * t), x = A * Math.cos(t * 2.6);
          at(lopta, { cx: 125 + x * 105, cy: 180 - 140 * x * x - 9 });
          const E = A * A / (0.95 * 0.95), Ep = (x * x) / (0.95 * 0.95);
          tr.set([Ep, Math.max(0, E - Ep), 1 - E]);
        },
      };
    },

    // Termometar sa dve skale. skale: ['C','K'] | ['C','F'], od, do (°C), tacke: [{c:0, o:'~led se topi'}], temp (zaustavi na vrednosti).
    termometar(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      const sk = niz(m.skale).length ? niz(m.skale) : ['C', 'K'];
      const od = br(m.od, -20), dok = br(m.do, 110);
      const y0 = 176, y1 = 22, Y = (c) => y0 - ((c - od) / (dok - od)) * (y0 - y1);
      const x = 160;
      el(s, 'rect', { x: x - 9, y: y1 - 10, width: 18, height: y0 - y1 + 20, rx: 9, fill: 'rgba(255,255,255,.08)', stroke: C.siva, 'stroke-width': 2 });
      kr(s, x, y0 + 18, 16, { fill: '#e63946', stroke: C.siva, 'stroke-width': 2 });
      const stub = el(s, 'rect', { x: x - 4.5, y: 0, width: 9, height: 0, fill: '#e63946' });
      const pret = (c, k) => (k === 'K' ? c + 273 : k === 'F' ? (c * 9) / 5 + 32 : c);
      sk.slice(0, 2).forEach((k, i) => {
        const st = i ? 1 : -1;
        const korak = k === 'F' ? 20 : 20;
        const a = Math.ceil(pret(od, k) / korak) * korak, b = pret(dok, k);
        for (let v = a; v <= b; v += korak) {
          const c = k === 'K' ? v - 273 : k === 'F' ? ((v - 32) * 5) / 9 : v;
          lin(s, x + st * 12, Y(c), x + st * 20, Y(c), C.siva, 1.5);
          tx(s, x + st * 24, Y(c), String(v), { a: st < 0 ? 'end' : 'start', v: 10, b: C.siva });
        }
        tx(s, x + st * 40, 10, k === 'C' ? '°C' : k === 'F' ? '°F' : 'K', { v: 13, b: C.zuta });
      });
      niz(m.tacke).forEach((p) => {
        const y = Y(br(p.c, 0));
        lin(s, x - 60, y, x + 60, y, C.zuta, 1, '3 3');
        tx(s, x + 70, y, p.o ?? '', { a: 'start', v: 11, b: C.zuta });
        if (p.l) tx(s, x - 70, y, p.l, { a: 'end', v: 11, b: C.zuta });
      });
      const cilj = m.temp === undefined ? null : br(m.temp, 20);
      return {
        trajanje: cilj === null ? 8 : 3, pauza: cilj === null ? 0 : 3,
        kadar(t) {
          const c = cilj === null ? od + (dok - od) * (0.5 - 0.5 * Math.cos((t / 8) * 2 * Math.PI)) : od + (cilj - od) * glatko(t / 2.6);
          const y = Y(c);
          at(stub, { y, height: y0 + 6 - y });
        },
      };
    },

    // Toplota. tip 'provodjenje' (sipke: [{o:'~metal', k:1}, {o:'~drvo', k:0.1}]) | 'strujanje' | 'zracenje' | 'bimetal' | 'sine' | 'zice'.
    toplota(s, m) {
      const W = 320, H = 200, v = m.tip || 'provodjenje';
      vel(s, W, H);
      const vatra = (x, y, v2 = 28) => { const g = emo(s, '🔥', v2); poz(g, x, y); return g; };
      const toplo = (u) => { u = ogr(u, 0, 1); const r = Math.round(90 + 165 * u), g = Math.round(110 - 40 * u + 60 * (1 - u)), b = Math.round(140 * (1 - u)); return `rgb(${r},${g},${b})`; };
      if (v === 'provodjenje') {
        const sipke = niz(m.sipke).length ? niz(m.sipke).slice(0, 3) : [{ o: '~metal', k: 1 }];
        const n = sipke.length;
        const delovi = sipke.map((sp, i) => {
          const y = 60 + i * (n > 1 ? 70 : 0) + (n === 1 ? 40 : 0);
          const seg = Array.from({ length: 20 }, (_, j) => el(s, 'rect', { x: 50 + j * 12, y: y - 7, width: 12.5, height: 14, fill: toplo(0) }));
          tx(s, 300, y - 18, sp.o ?? '', { a: 'end', v: 11, b: C.siva });
          vatra(42, y + 18, 26);
          return { seg, k: br(sp.k, 1) };
        });
        return {
          trajanje: 8, pauza: 1.5,
          kadar(t) { delovi.forEach((d) => d.seg.forEach((e, j) => at(e, { fill: toplo(Math.exp(-j / (0.4 + 3.2 * d.k * t))) }))); },
        };
      }
      if (v === 'strujanje') {
        put(s, 'M80,40 L80,170 L240,170 L240,40', { stroke: C.siva, 'stroke-width': 3 });
        el(s, 'rect', { x: 81, y: 55, width: 158, height: 114, fill: 'rgba(46,134,222,.3)' });
        vatra(160, 186, 26);
        const cest = Array.from({ length: 28 }, (_, i) => ({ f: i / 28, l: i % 2, e: kr(s, 0, 0, 3.4, { fill: C.plava }) }));
        return {
          trajanje: Infinity,
          kadar(t) {
            cest.forEach((c) => {
              const u = ((t / 5 + c.f) % 1) * 2 * Math.PI, st = c.l ? 1 : -1;
              const x = 160 + st * (38 - 32 * Math.cos(u)), y = 112 + 46 * Math.sin(u) * st * 0 + 46 * Math.sin(u);
              // gore u sredini (toplo), dole sa strane (hladno)
              const xx = 160 + st * (36 + 34 * Math.cos(u)), yy = 112 - 46 * Math.sin(u);
              void x; void y;
              at(c.e, { cx: xx, cy: yy, fill: toplo(0.5 + 0.5 * Math.sin(u) * -Math.cos(u) * 0 + 0.5 * -Math.cos(u)) });
            });
          },
        };
      }
      if (v === 'zracenje') {
        const sunce = emo(s, '☀️', 54); poz(sunce, 46, 60);
        const talasi = Array.from({ length: 4 }, () => put(s, '', { stroke: C.narandz, 'stroke-width': 2 }));
        const kamen = el(s, 'rect', { x: 230, y: 120, width: 60, height: 40, rx: 8, fill: toplo(0) });
        tx(s, 160, 190, '~nije potreban vazduh ni dodir', { v: 11, b: C.siva });
        return {
          trajanje: 6, pauza: 1,
          kadar(t) {
            talasi.forEach((p, i) => { const u = ((t / 1.6 + i / 4) % 1); const x = 80 + u * 140, y = 70 + u * 60; p.setAttribute('d', `M${f2(x)},${f2(y)} q5,-8 10,0 t10,0 t10,0`); p.setAttribute('transform', `rotate(23 ${f2(x)} ${f2(y)})`); });
            at(kamen, { fill: toplo(t / 6) });
          },
        };
      }
      if (v === 'bimetal') {
        const g1 = put(s, '', { stroke: '#d4a017', 'stroke-width': 7 }), g2 = put(s, '', { stroke: '#95a5a6', 'stroke-width': 7 });
        el(s, 'rect', { x: 40, y: 80, width: 20, height: 50, fill: C.tamna });
        tx(s, 240, 30, m.o1 || '~mesing', { v: 11, b: '#d4a017' }); tx(s, 240, 46, m.o2 || '~čelik', { v: 11, b: '#95a5a6' });
        const vr = vatra(160, 180, 30);
        return {
          trajanje: 7, pauza: 0,
          kadar(t) {
            const u = t < 3.5 ? glatko(t / 2.5) : 1 - glatko((t - 3.5) / 2.5);
            vr.style.opacity = t < 3.5 ? 1 : 0;
            const R = 2000 / (0.01 + u * 9), L = 210;
            const luk2 = (dy) => { if (u < 0.01) return `M60,${105 + dy} L${60 + L},${105 + dy}`; const r = R - dy, a = L / R; return `M60,${105 + dy} A${f2(r)},${f2(r)} 0 0 0 ${f2(60 + r * Math.sin(a))},${f2(105 - R + dy + r * (1 - Math.cos(a)) * -1 + R)}`; };
            g1.setAttribute('d', luk2(3.5)); g2.setAttribute('d', luk2(-3.5));
          },
        };
      }
      if (v === 'zice') {
        lin(s, 10, 190, W - 10, 190, C.tlo, 3);
        for (const x of [30, 290]) { lin(s, x, 190, x, 40, '#8d6e63', 5); lin(s, x - 14, 44, x + 14, 44, '#8d6e63', 4); }
        const z = put(s, '', { stroke: C.bela, 'stroke-width': 2 });
        const ik = emo(s, '☀️', 26); poz(ik, 160, 22);
        return {
          trajanje: 8, pauza: 0,
          kadar(t) {
            const u = 0.5 - 0.5 * Math.cos((t / 8) * 2 * Math.PI);
            z.setAttribute('d', `M30,44 Q160,${f2(60 + u * 70)} 290,44`);
            ik.firstChild.textContent = u > 0.5 ? '☀️' : '❄️';
          },
        };
      }
      // šine sa razmakom
      const ik = emo(s, '☀️', 30); poz(ik, 160, 30);
      const s1 = el(s, 'rect', { x: 20, y: 110, height: 16, fill: '#95a5a6' }), s2 = el(s, 'rect', { y: 110, height: 16, fill: '#95a5a6' });
      for (let x = 30; x < 300; x += 26) el(s, 'rect', { x, y: 126, width: 14, height: 8, fill: '#8d6e63' });
      const raz = tx(s, 160, 150, '', { v: 11, b: C.zuta });
      return {
        trajanje: 8, pauza: 0,
        kadar(t) {
          const u = 0.5 - 0.5 * Math.cos((t / 8) * 2 * Math.PI), g = 12 * (1 - u) + 1;
          at(s1, { width: 140 - g / 2 }); at(s2, { x: 160 + g / 2, width: 140 - g / 2 });
          ik.firstChild.textContent = u > 0.5 ? '☀️' : '❄️';
          postaviTekst(raz, u > 0.5 ? '~leto' : '~zima');
        },
      };
    },

    // Njutnov top: sve brže ispaljeno telo pada sve dalje, a dovoljno brzo obilazi Zemlju (kao Mesec). tip 'njutn' | 'mesec'.
    orbita(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      const cx = 160, cy = 116, R = 54;
      if (m.tip === 'mesec') {
        kr(s, cx, cy, 26, { fill: '#0984e3' });
        put(s, `M${cx + 80},${cy} A80,80 0 1 1 ${cx - 80},${cy} A80,80 0 1 1 ${cx + 80},${cy}`, { stroke: C.tamna, 'stroke-width': 1.2, 'stroke-dasharray': '3 4' });
        const mes = kr(s, 0, 0, 9, { fill: '#dfe6e9' });
        const v = strelica(s, C.zelena, 2.5), f = strelica(s, C.crvena, 2.5);
        const tv = tx(s, 0, 0, 'v', { v: 13, b: C.zelena }), tf = tx(s, 0, 0, 'F', { v: 13, b: C.crvena });
        return {
          trajanje: Infinity,
          kadar(t) {
            const a = (t / 8) * 2 * Math.PI, x = cx + 80 * Math.cos(a), y = cy - 80 * Math.sin(a) * 0.85;
            at(mes, { cx: x, cy: y });
            const tx2 = -Math.sin(a), ty2 = -Math.cos(a) * 0.85, L = Math.hypot(tx2, ty2);
            v.set(x, y, x + (tx2 / L) * 40, y + (ty2 / L) * 40);
            const dx = cx - x, dy = cy - y, D = Math.hypot(dx, dy);
            f.set(x, y, x + (dx / D) * 32, y + (dy / D) * 32);
            at(tv, { x: x + (tx2 / L) * 50, y: y + (ty2 / L) * 50 }); at(tf, { x: x + (dx / D) * 42, y: y + (dy / D) * 42 });
          },
        };
      }
      kr(s, cx, cy, R, { fill: '#0984e3' });
      put(s, `M${cx - 14},${cy - R + 4} L${cx},${cy - R - 26} L${cx + 14},${cy - R + 4} Z`, { fill: "#6d5d4b" });
      const start = [cx, cy - R - 28];
      const brzine = [0.5, 0.66, 0.8, 1.0];
      const zr = brzine.map((k, i) => {
        // integracija pod gravitacijom ka centru
        const GM = 1;
        const r0 = Math.hypot(start[0] - cx, start[1] - cy), vk = Math.sqrt(GM / r0) * k;
        let x = start[0] - cx, y = start[1] - cy, vx = vk, vy = 0;
        const pts = [[start[0], start[1]]];
        const dt = 0.5 * r0 ** 1.5 / 400;
        for (let n = 0; n < 4000; n++) {
          const r = Math.hypot(x, y), a = GM / (r * r);
          vx -= (a * x / r) * dt; vy -= (a * y / r) * dt; x += vx * dt; y += vy * dt;
          if (n % 8 === 0) pts.push([cx + x, cy + y]);
          if (Math.hypot(x, y) < R) break;
          if (n > 50 && k >= 1 && Math.hypot(x - (start[0] - cx), y - (start[1] - cy)) < 3) break;
        }
        return { z: zrak(s, pts, { b: BOJE[i], w: 2.2 }), t0: i * 1.6, k };
      });
      return {
        trajanje: zr.length * 1.6 + 2.4, pauza: 1.2,
        kadar(t) { zr.forEach((o) => o.z.set((t - o.t0) / (o.k >= 1 ? 3.2 : 1.4))); },
      };
    },

    // Inercija. tip 'autobus' (putnik se nagne napred pri kočenju) | 'stolnjak' | 'novcic' (karta ispod novčića).
    inercija(s, m) {
      const W = 320, H = 190, v = m.tip || 'autobus';
      vel(s, W, H);
      if (v === 'stolnjak' || v === 'novcic') {
        const nov = v === 'novcic';
        if (nov) {
          put(s, 'M130,100 L136,180 L184,180 L190,100', { stroke: C.siva, 'stroke-width': 2.5, fill: 'rgba(255,255,255,.05)' });
        } else {
          el(s, 'rect', { x: 70, y: 110, width: 180, height: 8, fill: '#8d6e63' });
          lin(s, 90, 118, 90, 180, '#8d6e63', 6); lin(s, 230, 118, 230, 180, '#8d6e63', 6);
        }
        const karta = el(s, 'rect', { x: 0, y: nov ? 92 : 104, width: nov ? 90 : 200, height: nov ? 8 : 6, fill: nov ? '#fd79a8' : '#e17055' });
        const pred = nov ? [emo(s, '🪙', 22)] : [emo(s, '🍽️', 26), emo(s, '🥛', 26)];
        const prst = nov ? emo(s, '👉', 26) : emo(s, '✋', 26);
        return {
          trajanje: 2.6, pauza: 1.2,
          kadar(t) {
            const u = t < 1 ? 0 : Math.min(1, ((t - 1) / 0.25) ** 2);
            const xk = (nov ? 115 : 60) + (nov ? 230 : -260) * u;
            at(karta, { x: xk });
            if (nov) {
              poz(prst, 90 + Math.min(1, t / 1) * 22 + 240 * u, 96);
              const pad = t > 1.25 ? Math.min(1, ((t - 1.25) / 0.5) ** 2) : 0;
              poz(pred[0], 160, 84 + pad * 86);
            } else {
              poz(prst, 50 - 260 * u, 107);
              poz(pred[0], 130 + 4 * u, 94); poz(pred[1], 190 + 4 * u, 92);
            }
          },
        };
      }
      // autobus
      const bus = el(s, 'g');
      el(bus, 'rect', { x: 0, y: 40, width: 220, height: 110, rx: 14, fill: 'rgba(253,203,110,.18)', stroke: C.narandz, 'stroke-width': 3 });
      for (let i = 0; i < 4; i++) el(bus, 'rect', { x: 16 + i * 50, y: 54, width: 38, height: 30, rx: 4, fill: 'rgba(116,185,255,.25)' });
      kr(bus, 45, 152, 14, { fill: '#2d3436', stroke: C.siva, 'stroke-width': 3 }); kr(bus, 175, 152, 14, { fill: '#2d3436', stroke: C.siva, 'stroke-width': 3 });
      const putnik = el(bus, 'g');
      kr(putnik, 0, -78, 9, { fill: '#ffeaa7' });
      lin(putnik, 0, -68, 0, -34, C.bela, 4); lin(putnik, 0, -34, -7, 0, C.bela, 4); lin(putnik, 0, -34, 7, 0, C.bela, 4); lin(putnik, 0, -60, 12, -46, C.bela, 3);
      lin(s, 0, 168, W, 168, C.tlo, 3);
      const nat = tx(s, 160, 16, '', { v: 12, b: C.zuta });
      return {
        trajanje: 5, pauza: 0.6,
        kadar(t) {
          // vozi stalnom brzinom, pa naglo koči
          const x = t < 2 ? -40 + t * 40 : 40 + Math.min(1, (t - 2) / 0.8) * 16 - 0;
          bus.setAttribute('transform', `translate(${f2(x)} 0)`);
          const nag = t < 2 ? 0 : t < 2.8 ? 26 * Math.sin(((t - 2) / 0.8) * Math.PI * 0.5) : 26 * Math.max(0, 1 - (t - 2.8) / 1.2);
          putnik.setAttribute('transform', `translate(120 149) rotate(${f2(nag)})`);
          postaviTekst(nat, t < 2 ? '~vozi' : '~koči!');
        },
      };
    },
  };

  // ───────── pokretanje ─────────
  function pokreni(svg, sc) {
    if (!sc || typeof sc.kadar !== 'function') return () => {};
    const T = sc.trajanje ?? Infinity, P = sc.pauza ?? 1.5;
    let id, t0 = null, ziv = true, novo = true;
    const kadar = (ts) => {
      if (!ziv) return;
      if (t0 === null) { t0 = ts; novo = true; }
      let t = (ts - t0) / 1000;
      if (t > T + P) { t0 = ts; t = 0; novo = true; }
      try { sc.kadar(Math.min(t, T), novo); } catch (e) { console.error(e); ziv = false; return; }
      novo = false;
      id = requestAnimationFrame(kadar);
    };
    id = requestAnimationFrame(kadar);
    svg.addEventListener('click', (e) => { if (!e.target.closest('[data-klik]')) t0 = null; });
    return () => { ziv = false; cancelAnimationFrame(id); };
  }

  function prikazi(k, m) {
    const f = Object.hasOwn(SCENE, m.scena) ? SCENE[m.scena] : null;
    if (!f) return () => {};
    const d = document.createElement('div');
    d.className = 'medij-svg medij-fizika';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'fizika');
    d.appendChild(svg);
    const sc = f(svg, m || {});
    k.appendChild(d); // tek gotov crtež ulazi u stranicu (preslovljavanje natpisa ide jednom)
    return pokreni(svg, sc);
  }

  // pomoćne funkcije za crtanje dele i druge animirane scene (public/biologija.js)
  const alati = {
    NS, BOJE, C, boja, br, f2, bf, niz, ogr, glatko, RAD, slucajni, el, at, tx, postaviTekst, emo, poz,
    lin, kr, put, tacke, strelica, zrak, luk, vel, sud, cikcak, pokreni,
  };
  const API = { prikazi, SCENE: Object.keys(SCENE), alati };
  if (typeof window !== 'undefined') window.Fizika = API;
  if (typeof module !== 'undefined') module.exports = { SCENE: Object.keys(SCENE) };
})();
