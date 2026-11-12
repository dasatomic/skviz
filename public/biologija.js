// Animirane biološke scene (medij „biologija“): ćelija, deoba, fotosinteza, disanje, varenje, preobražaj…
// Crtaju se same u SVG-u i vrte u petlji, bez slika i biblioteka.
//
//   { "vrsta": "biologija", "scena": "celija", "tip": "biljna", "istakni": "jedro" }
//
// Zajedničko za scene sa delovima: "natpisi" (true/false – nazivi delova; podrazumevano uključeni, osim kad
// postoji "istakni"), "istakni" ("id" ili niz id-jeva – deo treperi i dobija „?“ umesto naziva, za pitanja
// tipa „Kako se zove označeni deo?“). Id-jevi delova su navedeni iznad svake scene.
// Natpisi: tekst koji počinje sa „~“ je srpska reč i preslovljava se u ćirilicu („~voda“); ostalo ostaje
// latinicom („CO₂“). Crtanje i pokretanje dele se sa public/fizika.js (Fizika.alati) – fizika.js se učitava pre.
// Dodir na crtež pokreće animaciju iz početka. Spisak scena: Biologija.SCENE (koristi i alati/proveri-kvizove.js).
(function () {
  'use strict';
  const A = (typeof window !== 'undefined' && window.Fizika && window.Fizika.alati) || {};
  const { NS, C, br, f2, niz, ogr, glatko, slucajni, el, at, tx, postaviTekst, emo, poz, lin, kr, put, tacke, strelica, vel, pokreni } = A;
  const B = {
    zid: '#2ecc71', membrana: '#a3e4d7', citop: 'rgba(120,200,160,.16)', jedro: '#a29bfe', jedarce: '#6c5ce7',
    hloro: '#27ae60', vakuola: 'rgba(116,185,255,.32)', mito: '#fdcb6e', koza: '#f3c6a5', misic: '#e17055', misicO: '#fab1a0',
    kost: '#dfe6e9', krv: '#e74c3c', zemlja: '#5d4330', zemlja2: '#7a5a3f', stablo: '#55b96a', list: '#3fae5a', list2: '#2d8a47',
    kiseonik: '#74b9ff', ugljen: '#b2bec3', voda: '#2e86de', secer: '#ffeaa7', organ: '#2a3f55', organO: '#5d7a96',
  };
  const lerp = (a, b, u) => a + (b - a) * u;
  const talas = (t, f = 1) => 0.5 + 0.5 * Math.sin(t * f * Math.PI * 2);
  const lista = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  const izbor = (v, dozv, pod) => (dozv.includes(v) ? v : pod);
  // tačka na izlomljenoj liniji: na(pts, 0..1) → [x, y, ugao]
  function na(pts, u) {
    let L = 0;
    const d = [];
    for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); d.push(L); }
    let c = ogr(u, 0, 1) * L;
    for (let i = 1; i < pts.length; i++) {
      const s = d[i - 1] - (i > 1 ? d[i - 2] : 0);
      if (c <= s || i === pts.length - 1) {
        const k = s ? ogr(c / s, 0, 1) : 0;
        return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k), Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])];
      }
      c -= s;
    }
    return [...pts[pts.length - 1], 0];
  }
  // glatka zatvorena kriva kroz tačke (Catmull-Rom → Bezier)
  function glatkaKriva(p, zatvori = true) {
    const n = p.length;
    const q = (i) => p[zatvori ? (i + n) % n : ogr(i, 0, n - 1)];
    let s = `M${f2(p[0][0])},${f2(p[0][1])}`;
    for (let i = 0; i < (zatvori ? n : n - 1); i++) {
      const p0 = q(i - 1), p1 = q(i), p2 = q(i + 1), p3 = q(i + 2);
      s += ` C${f2(p1[0] + (p2[0] - p0[0]) / 6)},${f2(p1[1] + (p2[1] - p0[1]) / 6)} ${f2(p2[0] - (p3[0] - p1[0]) / 6)},${f2(p2[1] - (p3[1] - p1[1]) / 6)} ${f2(p2[0])},${f2(p2[1])}`;
    }
    return s + (zatvori ? 'Z' : '');
  }
  // mrlja (ameba, životinjska ćelija): poluprečnik se blago talasa
  function mrlja(cx, cy, R, t, seme = 0, n = 18, jacina = 1) {
    const p = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = R * (1 + jacina * (0.06 * Math.sin(3 * a + t * 1.3 + seme) + 0.04 * Math.sin(5 * a - t * 0.9 + seme * 2)));
      p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return glatkaKriva(p);
  }

  // Natpisi delova: delovi = [{ id, naziv: '~jedro', ax, ay (tačka na delu), lx, ly (natpis), a, sjaj(v) }]
  function natpisi(s, m, delovi) {
    const ist = lista(m.istakni);
    const pokazi = m.natpisi ?? !ist.length;
    const g = el(s, 'g');
    const aktivni = [];
    for (const d of delovi) {
      const jeIst = ist.includes(d.id);
      if (!jeIst && (!pokazi || d.skriven)) continue;
      const a = d.a || (d.lx < d.ax ? 'end' : 'start');
      const vx = a === 'end' ? 3 : a === 'start' ? -3 : 0, vy = a === 'middle' ? (d.ly < d.ay ? 8 : -8) : 0;
      const b = jeIst ? C.zuta : '#9fb3c8';
      lin(g, d.ax, d.ay, d.lx + vx * (jeIst ? 3 : 1), d.ly + vy, b, 1.2);
      kr(g, d.ax, d.ay, 2.3, { fill: b });
      if (jeIst) {
        const bx = d.lx + (a === 'end' ? -8 : a === 'start' ? 8 : 0);
        kr(g, bx, d.ly, 11, { fill: C.zuta });
        tx(g, bx, d.ly + 0.5, '?', { v: 15, b: C.pozadina, obrub: false });
        aktivni.push(d);
      } else tx(g, d.lx, d.ly, d.naziv, { v: d.v || 11, a, b: d.b || C.bela });
    }
    return { kadar(t) { const v = talas(t, 0.8); aktivni.forEach((d) => d.sjaj && d.sjaj(v)); } };
  }
  // treperenje istaknutog dela: obris postaje žut i deblji
  function sjaj(...els) {
    const st = els.map((e) => +e.getAttribute('stroke-width') || 1);
    return (v) => els.forEach((e, i) => at(e, { stroke: C.zuta, 'stroke-width': st[i] + 0.8 + v * 2.2 }));
  }
  function natpisOznaka(s, x, y, tekst, o = {}) { return tx(s, x, y, tekst, { v: 11, b: '#9fb3c8', ...o }); }
  // čestica sa natpisom (O₂, CO₂…)
  function cestica(r, b, nat, rr = 4.5) {
    const g = el(r, 'g');
    kr(g, 0, 0, rr, { fill: b, stroke: '#0b1826', 'stroke-width': 1 });
    if (nat) tx(g, 0, -rr - 6, nat, { v: 8, b });
    return g;
  }

  // ─────────────────────────────── SCENE ───────────────────────────────
  const SCENE = {
    // Ćelija. tip: 'biljna' | 'zivotinjska' | 'bakterija'. Organele blago plove.
    // Delovi: membrana, citoplazma, jedro, organele; biljna još zid, hloroplast, vakuola; bakterija: zid, nasledni, bic.
    celija(s, m) {
      const tip = izbor(m.tip, ['biljna', 'zivotinjska', 'bakterija'], 'zivotinjska');
      const W = 320, H = 226;
      vel(s, W, H);
      const r = slucajni(5);
      const delovi = [], plove = [];
      let kadarOblika = () => {};
      if (tip === 'biljna') {
        const x0 = 118, y0 = 18, w = 104, h = 190;
        const zid = el(s, 'rect', { x: x0, y: y0, width: w, height: h, rx: 9, fill: 'none', stroke: B.zid, 'stroke-width': 6 });
        const mem = el(s, 'rect', { x: x0 + 6, y: y0 + 6, width: w - 12, height: h - 12, rx: 6, fill: B.citop, stroke: B.membrana, 'stroke-width': 1.8 });
        const vak = el(s, 'ellipse', { cx: x0 + w / 2 + 8, cy: y0 + h / 2 + 22, rx: 36, ry: 56, fill: B.vakuola, stroke: '#74b9ff', 'stroke-width': 1.5 });
        const jed = kr(s, x0 + 34, y0 + 40, 17, { fill: B.jedro, stroke: '#dcd6ff', 'stroke-width': 2 });
        kr(s, x0 + 37, y0 + 37, 5, { fill: B.jedarce });
        const mesta = [[x0 + 74, y0 + 24], [x0 + 86, y0 + 52], [x0 + 18, y0 + 80], [x0 + 17, y0 + 120], [x0 + 20, y0 + 160], [x0 + 86, y0 + 170], [x0 + 56, y0 + 176], [x0 + 88, y0 + 128]];
        const hl = mesta.map(([x, y], i) => {
          const e = el(s, 'ellipse', { cx: x, cy: y, rx: 9, ry: 5, fill: B.hloro, stroke: '#7bed9f', 'stroke-width': 1 });
          plove.push({ e, x, y, f: 0.3 + r() * 0.3, faza: r() * 6, rot: i * 37 });
          return e;
        });
        for (const [x, y] of [[x0 + 62, y0 + 18 + 22], [x0 + 26, y0 + 98], [x0 + 88, y0 + 92]]) {
          const e = el(s, 'ellipse', { cx: x, cy: y, rx: 6, ry: 3.4, fill: B.mito, stroke: '#e17055', 'stroke-width': 1 });
          plove.push({ e, x, y, f: 0.4 + r() * 0.3, faza: r() * 6, rot: r() * 180 });
        }
        delovi.push(
          { id: 'jedro', naziv: '~jedro', ax: x0 + 30, ay: y0 + 44, lx: 106, ly: 40, sjaj: sjaj(jed) },
          { id: 'membrana', naziv: '~ćelijska membrana', ax: x0 + 6, ay: y0 + 100, lx: 106, ly: 100, v: 10, sjaj: sjaj(mem) },
          { id: 'citoplazma', naziv: '~citoplazma', ax: x0 + 22, ay: y0 + 140, lx: 106, ly: 152, sjaj: sjaj(mem) },
          { id: 'organele', naziv: '~organele', ax: x0 + 88, ay: y0 + 92, lx: 106, ly: 196, skriven: true },
          { id: 'zid', naziv: '~ćelijski zid', ax: x0 + w, ay: y0 + 30, lx: 234, ly: 28, sjaj: sjaj(zid) },
          { id: 'hloroplast', naziv: '~hloroplast', ax: x0 + 86, ay: y0 + 52, lx: 234, ly: 66, sjaj: sjaj(...hl) },
          { id: 'vakuola', naziv: '~vakuola', ax: x0 + w / 2 + 30, ay: y0 + h / 2 + 30, lx: 234, ly: 140, sjaj: sjaj(vak) },
        );
      } else if (tip === 'zivotinjska') {
        const cx = 160, cy = 113, R = 80;
        const tel = el(s, 'path', { fill: 'rgba(253,121,168,.13)', stroke: '#fd79a8', 'stroke-width': 2.2 });
        const jed = kr(s, cx - 8, cy - 6, 22, { fill: B.jedro, stroke: '#dcd6ff', 'stroke-width': 2 });
        kr(s, cx - 4, cy - 10, 6, { fill: B.jedarce });
        const mito = [];
        for (const [x, y, rt] of [[cx + 40, cy + 30, 20], [cx - 45, cy + 32, -30], [cx + 38, cy - 36, 70], [cx - 40, cy - 38, 10], [cx + 6, cy + 48, -10]]) {
          const e = el(s, 'ellipse', { cx: x, cy: y, rx: 9, ry: 4.6, fill: B.mito, stroke: '#e17055', 'stroke-width': 1 });
          mito.push(e);
          plove.push({ e, x, y, f: 0.35 + r() * 0.3, faza: r() * 6, rot: rt });
        }
        for (let i = 0; i < 22; i++) {
          const a = r() * Math.PI * 2, d = 34 + r() * 36;
          const e = kr(s, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.6, { fill: '#dfe6e9' });
          plove.push({ e, x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, f: 0.5 + r() * 0.5, faza: r() * 6, krug: true });
        }
        kadarOblika = (t) => at(tel, { d: mrlja(cx, cy, R, t * 0.8, 1, 22, 0.8) });
        delovi.push(
          { id: 'jedro', naziv: '~jedro', ax: cx - 20, ay: cy - 10, lx: 64, ly: 40, sjaj: sjaj(jed) },
          { id: 'membrana', naziv: '~ćelijska membrana', ax: cx + 20, ay: cy + R - 2, lx: 196, ly: 214, a: 'middle', v: 10, sjaj: sjaj(tel) },
          { id: 'citoplazma', naziv: '~citoplazma', ax: cx - 30, ay: cy + 50, lx: 64, ly: 150, sjaj: sjaj(tel) },
          { id: 'organele', naziv: '~organele', ax: cx + 46, ay: cy + 32, lx: 254, ly: 150, sjaj: sjaj(...mito) },
        );
      } else {
        const x0 = 64, y0 = 82, w = 176, h = 66;
        const zid = el(s, 'rect', { x: x0, y: y0, width: w, height: h, rx: h / 2, fill: 'none', stroke: '#00b894', 'stroke-width': 5 });
        const mem = el(s, 'rect', { x: x0 + 5, y: y0 + 5, width: w - 10, height: h - 10, rx: h / 2 - 5, fill: 'rgba(85,239,196,.14)', stroke: '#81ecec', 'stroke-width': 1.5 });
        const dnk = put(s, '', { stroke: '#a29bfe', 'stroke-width': 2.4, 'stroke-linejoin': 'round' });
        for (let i = 0; i < 16; i++) {
          const x = x0 + 18 + r() * (w - 36), y = y0 + 14 + r() * (h - 28);
          plove.push({ e: kr(s, x, y, 1.8, { fill: '#dfe6e9' }), x, y, f: 0.6 + r() * 0.4, faza: r() * 6, krug: true });
        }
        const bic = put(s, '', { stroke: '#81ecec', 'stroke-width': 2.2, 'stroke-linecap': 'round' });
        kadarOblika = (t) => {
          const p = [];
          for (let i = 0; i <= 14; i++) {
            const a = (i / 14) * Math.PI * 4.2;
            p.push([x0 + 58 + i * 4.6 + 6 * Math.sin(a * 1.7 + t * 0.6), y0 + h / 2 + 15 * Math.sin(a + t * 0.4) * Math.cos(i * 0.4)]);
          }
          at(dnk, { d: glatkaKriva(p, false) });
          const b = [];
          for (let i = 0; i <= 20; i++) b.push([x0 + w + i * 3.2, y0 + h / 2 + Math.sin(i * 0.55 - t * 9) * (2 + i * 0.45)]);
          at(bic, { d: glatkaKriva(b, false) });
        };
        delovi.push(
          { id: 'zid', naziv: '~ćelijski zid', ax: x0 + 30, ay: y0 + 2, lx: 70, ly: 46, a: 'middle', sjaj: sjaj(zid) },
          { id: 'membrana', naziv: '~ćelijska membrana', ax: x0 + w - 40, ay: y0 + 6, lx: 214, ly: 46, a: 'middle', v: 10, sjaj: sjaj(mem) },
          { id: 'nasledni', naziv: '~nasledni materijal', ax: x0 + 90, ay: y0 + h / 2 + 4, lx: 112, ly: 192, a: 'middle', sjaj: sjaj(dnk) },
          { id: 'citoplazma', naziv: '~citoplazma', ax: x0 + 30, ay: y0 + h - 16, lx: 40, ly: 176, a: 'middle', sjaj: sjaj(mem) },
          { id: 'bic', naziv: '~bič', ax: x0 + w + 30, ay: y0 + h / 2 + 4, lx: 280, ly: 176, a: 'middle', sjaj: sjaj(bic) },
        );
      }
      const nat = natpisi(s, m, delovi);
      return {
        kadar(t) {
          kadarOblika(t);
          for (const p of plove) {
            const dx = 2.6 * Math.sin(t * p.f * 2 + p.faza), dy = 2.2 * Math.cos(t * p.f * 1.7 + p.faza);
            if (p.krug) at(p.e, { cx: p.x + dx, cy: p.y + dy });
            else p.e.setAttribute('transform', `translate(${f2(dx)} ${f2(dy)}) rotate(${f2(p.rot + 8 * Math.sin(t * p.f + p.faza))} ${p.x} ${p.y})`);
          }
          nat.kadar(t);
        },
      };
    },

    // Deoba ćelija: 1 → 2 → 4 → … tip: 'bakterija' | 'ameba' | 'kvasac' (pupljenje) | 'zigot' (oplođena jajna ćelija).
    // koraci (broj deoba, do 5), interval (npr. 30) + jedinica ('min') – vreme između deoba, o (naslov).
    deoba(s, m) {
      const tip = izbor(m.tip, ['bakterija', 'ameba', 'kvasac', 'zigot'], 'bakterija');
      const K = ogr(Math.round(br(m.koraci, tip === 'zigot' ? 3 : 4)), 1, 5);
      const W = 320, H = 214;
      vel(s, W, H);
      const zigot = tip === 'zigot';
      const ax = zigot ? 100 : 16, ay = zigot ? 44 : 40, aw = zigot ? 120 : 288, ah = zigot ? 120 : 162;
      if (zigot) kr(s, 160, 104, 76, { fill: 'rgba(250,177,160,.08)', stroke: '#fab1a0', 'stroke-width': 1.5, 'stroke-dasharray': '4 3' });
      const raspored = (L) => ({ k: 2 ** Math.ceil(L / 2), r: 2 ** Math.floor(L / 2) });
      // zigot: ćelije u prstenu (posle 4 deobe – šuplja loptica)
      const PR = [0, 30, 31, 37, 46, 52], VZ = [52, 29, 21, 15, 10, 7];
      const mesto = (L, j) => {
        if (zigot) { const n = 2 ** L, a = Math.PI / 2 + ((j + 0.5) * 2 * Math.PI) / n; return L ? [160 + PR[L] * Math.cos(a), 104 + PR[L] * Math.sin(a)] : [160, 104]; }
        const { k, r } = raspored(L); const c = j % k, rr = Math.floor(j / k); return [ax + (c + 0.5) * aw / k, ay + (rr + 0.5) * ah / r];
      };
      const vel1 = (L) => { if (zigot) return VZ[L]; const { k, r } = raspored(L); return Math.min(aw / k, ah / r) * 0.34; };
      // dete ćelije j sa nivoa L na nivou L+1
      const deca = (L, j) => {
        if (zigot) return [2 * j, 2 * j + 1];
        const { k } = raspored(L), c = j % k, rr = Math.floor(j / k);
        if (L % 2 === 0) return [rr * 2 * k + 2 * c, rr * 2 * k + 2 * c + 1]; // kolone se udvostručuju
        return [2 * rr * k + c, (2 * rr + 1) * k + c]; // redovi se udvostručuju
      };
      const N = 2 ** K;
      const tela = [];
      for (let i = 0; i < N; i++) {
        const g = el(s, 'g');
        let oblik;
        if (tip === 'bakterija') { oblik = el(g, 'rect', { x: -1.1, y: -0.55, width: 2.2, height: 1.1, rx: 0.55, fill: 'rgba(85,239,196,.35)', stroke: '#00b894', 'stroke-width': 0.08 }); el(g, 'path', { d: 'M-0.5,0 C-0.2,-0.3 0.1,0.3 0.45,0', fill: 'none', stroke: '#a29bfe', 'stroke-width': 0.09 }); }
        else if (tip === 'kvasac') { oblik = el(g, 'ellipse', { rx: 1.05, ry: 0.88, fill: 'rgba(255,234,167,.35)', stroke: '#fdcb6e', 'stroke-width': 0.08 }); kr(g, 0.15, -0.1, 0.25, { fill: '#e1b866' }); }
        else if (tip === 'ameba') { oblik = el(g, 'path', { fill: 'rgba(162,155,254,.3)', stroke: '#a29bfe', 'stroke-width': 0.08 }); kr(g, 0.1, 0, 0.28, { fill: '#6c5ce7' }); }
        else { oblik = kr(g, 0, 0, 1, { fill: 'rgba(250,177,160,.4)', stroke: '#e17055', 'stroke-width': 0.06 }); kr(g, 0, 0, 0.26, { fill: '#e17055', opacity: 0.8 }); }
        tela.push({ g, oblik });
      }
      const brojac = tx(s, 12, 16, '', { a: 'start', v: 13, b: C.zuta });
      const vreme = m.interval ? tx(s, W - 12, 16, '', { a: 'end', v: 13, b: C.zuta }) : null;
      if (m.o) tx(s, W / 2, H - 9, m.o, { v: 11, b: '#9fb3c8' });
      const KORAK = 1.9, MIR = 0.75;
      const crtaj = (i, x, y, sz, osa, vid, t) => {
        const d = tela[i];
        d.g.style.display = vid ? '' : 'none';
        if (!vid) return;
        d.g.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) scale(${f2(sz)})${osa ? ' rotate(90)' : ''}`);
        if (tip === 'ameba') at(d.oblik, { d: mrlja(0, 0, 1, t * 1.5, i, 12, 1.6) });
      };
      return {
        trajanje: K * KORAK + 1.2, pauza: 2,
        kadar(t) {
          const L = Math.min(K, Math.floor(t / KORAK));
          const u = L >= K ? 0 : glatko((t - L * KORAK - MIR) / (KORAK - MIR));
          const n = 2 ** L;
          postaviTekst(brojac, `~${tip === 'zigot' ? 'ćelija' : tip === 'bakterija' ? 'bakterija' : tip === 'ameba' ? 'ameba' : 'ćelija'}: ${u > 0.5 ? n * 2 : n}`);
          if (vreme) postaviTekst(vreme, `${(u > 0.5 ? L + 1 : L) * br(m.interval, 0)} ${m.jedinica ?? 'min'}`);
          let k = 0;
          const osaL = (LL) => (LL === 0 ? 0 : (LL - 1) % 2); // smer poslednje deobe
          for (let j = 0; j < n; j++) {
            const P = mesto(L, j), sz = vel1(L);
            if (u <= 0) { crtaj(k++, P[0], P[1], sz, osaL(L), true, t); continue; }
            const [c1, c2] = deca(L, j), C1 = mesto(L + 1, c1), C2 = mesto(L + 1, c2), sz2 = vel1(L + 1);
            const osa = L % 2; // 0: razdvajanje vodoravno, 1: uspravno
            if (tip === 'kvasac') {
              const dir = osa ? [0, 1] : [1, 0];
              const s1 = lerp(sz, sz2, u), pup = sz2 * lerp(0.25, 1, ogr(u * 1.6, 0, 1));
              const x1 = lerp(P[0], C1[0], u), y1 = lerp(P[1], C1[1], u);
              const v = ogr((u - 0.55) / 0.45, 0, 1);
              const bx = lerp(x1 + dir[0] * (s1 + pup) * 0.92, C2[0], v), by = lerp(y1 + dir[1] * (s1 + pup) * 0.8, C2[1], v);
              crtaj(k++, x1, y1, s1, 0, true, t);
              crtaj(k++, bx, by, pup, 0, true, t);
            } else {
              const s2 = lerp(sz, sz2, u), o = tip === 'bakterija' ? osa : 0;
              const e = tip === 'bakterija' ? ogr(u * 1.3, 0, 1) : u;
              crtaj(k++, lerp(P[0], C1[0], e), lerp(P[1], C1[1], e), s2, o, true, t);
              crtaj(k++, lerp(P[0], C2[0], e), lerp(P[1], C2[1], e), s2, o, true, t);
            }
          }
          for (; k < N; k++) crtaj(k, 0, 0, 1, 0, false, t);
        },
      };
    },

    // Fotosinteza: svetlost, voda iz korena i CO₂ ulaze u list, kiseonik izlazi, šećer se odnosi u biljku.
    // skrij: ['kiseonik' | 'ugljen-dioksid' | 'voda' | 'secer' | 'svetlost'] – umesto naziva „?“; natpisi:false – bez naziva.
    fotosinteza(s, m) {
      const W = 320, H = 236;
      vel(s, W, H);
      const skrij = lista(m.skrij), nat = m.natpisi !== false;
      const ime = (id, n) => (skrij.includes(id) ? '?' : n);
      // Sunce i zraci
      const sunce = el(s, 'g');
      kr(sunce, 34, 32, 18, { fill: '#ffd166' });
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; lin(sunce, 34 + 23 * Math.cos(a), 32 + 23 * Math.sin(a), 34 + 30 * Math.cos(a), 32 + 30 * Math.sin(a), '#ffd166', 2.5); }
      const zraci = [0, 1, 2].map((i) => lin(s, 52, 44 + i * 9, 132, 92 + i * 6, '#ffd166', 2, '6 7'));
      // zemlja, koren, stablo, listovi
      el(s, 'rect', { x: 0, y: 178, width: W, height: H - 178, fill: B.zemlja });
      for (const d of ['M160,178 C158,195 150,205 136,214', 'M160,178 C162,198 172,208 188,216', 'M160,180 L160,224', 'M150,196 C142,198 132,196 124,200', 'M166,200 C176,203 184,200 194,204'])
        put(s, d, { stroke: '#e8d5b7', 'stroke-width': 2.2, 'stroke-linecap': 'round' });
      put(s, 'M160,178 C160,140 158,110 160,70', { stroke: B.stablo, 'stroke-width': 6, 'stroke-linecap': 'round' });
      const list = (d) => el(s, 'path', { d, fill: B.list, stroke: B.list2, 'stroke-width': 1.5 });
      list('M160,120 C136,96 112,100 98,112 C116,132 140,134 160,120Z');
      const glavni = list('M160,96 C176,64 214,58 236,70 C222,100 190,110 160,96Z');
      put(s, 'M160,96 C185,82 208,74 236,70', { stroke: B.list2, 'stroke-width': 1.2 });
      list('M160,72 C150,52 154,36 164,26 C174,40 172,58 160,72Z');
      const sjajLista = el(s, 'path', { d: 'M160,96 C176,64 214,58 236,70 C222,100 190,110 160,96Z', fill: '#ffeaa7', opacity: 0 });
      // čestice
      const pV = [[146, 222], [160, 206], [160, 120], [168, 98], [190, 86]];
      const pC = [[300, 128], [258, 112], [214, 90]];
      const pO = [[200, 78], [230, 50], [262, 28], [300, 14]];
      const pS = [[176, 92], [162, 104], [160, 150], [158, 176], [152, 200]];
      const tok = (pts, b, n, nat0, rr) => Array.from({ length: n }, (_, i) => ({ g: cestica(s, b, i === 0 ? nat0 : '', rr), pts, f: i / n }));
      const sve = [
        ...tok(pV, B.voda, 3, 'H₂O', 4),
        ...tok(pC, B.ugljen, 3, 'CO₂', 4.5),
        ...tok(pO, B.kiseonik, 3, 'O₂', 4.5),
        ...tok(pS, B.secer, 3, '', 3.5),
      ];
      if (nat) {
        tx(s, 70, 70, ime('svetlost', '~svetlost'), { v: 11, b: '#ffd166', a: 'start' });
        tx(s, 268, 150, ime('ugljen-dioksid', '~ugljen-dioksid'), { v: 11, b: B.ugljen });
        tx(s, 270, 46, ime('kiseonik', '~kiseonik'), { v: 11, b: B.kiseonik, a: 'end' });
        tx(s, 112, 196, ime('voda', '~voda'), { v: 11, b: '#74b9ff', a: 'end' });
        tx(s, 172, 140, ime('secer', '~šećer'), { v: 11, b: B.secer, a: 'start' });
      }
      return {
        kadar(t) {
          zraci.forEach((z, i) => at(z, { 'stroke-dashoffset': f2(-t * 26 - i * 4) }));
          at(sjajLista, { opacity: f2(0.1 + 0.12 * talas(t, 0.5)) });
          for (const c of sve) {
            const u = (t * 0.28 + c.f) % 1;
            const [x, y] = na(c.pts, u);
            c.g.setAttribute('transform', `translate(${f2(x)} ${f2(y)})`);
            c.g.style.opacity = f2(Math.min(1, u * 6, (1 - u) * 6));
          }
        },
      };
    },

    // Disanje čoveka: pluća se šire i skupljaju, vazduh ide kroz nos/usta, ždrelo i dušnik.
    // Delovi: nos, zdrelo, dusnik, pluca, dijafragma. Kiseonik (plavo) ulazi, ugljen-dioksid (sivo) izlazi.
    pluca(s, m) {
      const W = 320, H = 236;
      vel(s, W, H);
      // obris tela
      put(s, 'M136,62 C136,70 120,76 96,84 C76,92 70,110 70,140 L70,232 M184,62 C184,70 200,76 224,84 C244,92 250,110 250,140 L250,232', { stroke: '#3b5068', 'stroke-width': 2 });
      kr(s, 160, 34, 26, { fill: 'none', stroke: '#3b5068', 'stroke-width': 2 });
      put(s, 'M160,30 L166,42 L160,44', { stroke: '#9fb3c8', 'stroke-width': 1.6 }); // nos
      put(s, 'M154,51 C158,53 162,53 166,51', { stroke: '#9fb3c8', 'stroke-width': 1.6 }); // usta
      const zdrelo = put(s, 'M160,44 C150,48 150,58 156,66', { stroke: '#fab1a0', 'stroke-width': 5, 'stroke-linecap': 'round' });
      const dusnik = put(s, 'M156,66 L160,120', { stroke: '#dfe6e9', 'stroke-width': 7, 'stroke-linecap': 'round' });
      for (let y = 74; y < 118; y += 6) lin(s, 154 + (y - 66) * 0.08, y, 166 + (y - 66) * 0.08, y, '#8fa3b8', 1);
      const plucaG = el(s, 'g');
      const levo = el(plucaG, 'path', { d: 'M150,112 C126,104 98,120 94,160 C92,186 100,204 118,206 C136,206 146,196 148,184 Z', fill: 'rgba(250,128,128,.5)', stroke: '#fd79a8', 'stroke-width': 2 });
      const desno = el(plucaG, 'path', { d: 'M170,112 C194,104 222,120 226,160 C228,186 220,204 202,206 C184,206 174,196 172,184 Z', fill: 'rgba(250,128,128,.5)', stroke: '#fd79a8', 'stroke-width': 2 });
      put(plucaG, 'M160,120 C150,124 142,132 132,146 M138,138 C130,142 124,152 118,166 M160,120 C170,124 178,132 188,146 M182,138 C190,142 196,152 202,166', { stroke: '#f8c8d0', 'stroke-width': 2.4, 'stroke-linecap': 'round' });
      const dijaf = put(s, '', { stroke: '#e17055', 'stroke-width': 3 });
      const stanje = tx(s, W - 10, 16, '', { a: 'end', v: 13, b: C.zuta });
      const putV = [[160, 30], [160, 44], [152, 56], [156, 66], [160, 118], [130, 150], [118, 178]];
      const putV2 = [[160, 30], [160, 44], [152, 56], [156, 66], [160, 118], [190, 150], [202, 178]];
      const cest = Array.from({ length: 10 }, (_, i) => ({ g: cestica(s, B.kiseonik, '', 3.4), p: i % 2 ? putV2 : putV, f: i / 10 }));
      const T = 4.4;
      const delovi = [
        { id: 'nos', naziv: '~nos i usta', ax: 166, ay: 40, lx: 214, ly: 28 },
        { id: 'zdrelo', naziv: '~ždrelo', ax: 151, ay: 56, lx: 96, ly: 56, sjaj: sjaj(zdrelo) },
        { id: 'dusnik', naziv: '~dušnik', ax: 162, ay: 92, lx: 214, ly: 82, sjaj: sjaj(dusnik) },
        { id: 'pluca', naziv: '~pluća', ax: 102, ay: 168, lx: 40, ly: 150, sjaj: sjaj(levo, desno) },
        { id: 'dijafragma', naziv: '~dijafragma', ax: 210, ay: 214, lx: 284, ly: 222, skriven: !m.dijafragma, sjaj: sjaj(dijaf) },
      ];
      const nat = natpisi(s, m, delovi);
      return {
        kadar(t) {
          const f = ((t % T) / T), udah = f < 0.45;
          const sir = udah ? glatko(f / 0.45) : 1 - glatko((f - 0.45) / 0.55);
          plucaG.setAttribute('transform', `translate(160 120) scale(${f2(0.92 + 0.12 * sir)} ${f2(0.94 + 0.1 * sir)}) translate(-160 -120)`);
          const dy = 6 * sir;
          at(dijaf, { d: `M86,${f2(210 + dy)} C120,${f2(186 + dy * 1.6)} 200,${f2(186 + dy * 1.6)} 234,${f2(210 + dy)}` });
          postaviTekst(stanje, udah ? '~udisaj' : '~izdisaj');
          for (const c of cest) {
            const u = udah ? ogr(f / 0.45 * 1.25 - c.f * 0.5, 0, 1) : 1 - ogr((f - 0.45) / 0.55 * 1.25 - c.f * 0.5, 0, 1);
            const [x, y] = na(c.p, u);
            c.g.setAttribute('transform', `translate(${f2(x)} ${f2(y)})`);
            c.g.firstChild.setAttribute('fill', udah ? B.kiseonik : B.ugljen);
            c.g.style.opacity = u > 0.02 && u < 0.98 ? 1 : 0;
          }
          nat.kadar(t);
        },
      };
    },

    // Varenje: zalogaj putuje kroz usta, jednjak, želudac, tanko i debelo crevo; u tankom crevu hranljive
    // supstance prelaze u krv. Delovi: usta, jednjak, zeludac, jetra, gusteraca, tanko, debelo.
    varenje(s, m) {
      const W = 320, H = 250;
      vel(s, W, H);
      put(s, 'M128,8 C128,30 118,40 96,48 C78,56 74,70 74,96 L74,246 M192,8 C192,30 202,40 224,48 C242,56 246,70 246,96 L246,246', { stroke: '#3b5068', 'stroke-width': 2 });
      const org = (d, b, o = {}) => el(s, 'path', { d, fill: b, stroke: o.s || '#0b1826', 'stroke-width': o.w || 1.5, ...o.a });
      const usta = put(s, 'M150,18 C155,22 165,22 170,18', { stroke: '#fd79a8', 'stroke-width': 3, 'stroke-linecap': 'round' });
      const jednjak = put(s, 'M160,22 C160,50 160,70 172,96', { stroke: '#fab1a0', 'stroke-width': 7, 'stroke-linecap': 'round' });
      const jetra = org('M86,96 C100,80 150,82 166,92 C170,104 158,118 140,124 C120,128 96,126 88,116 C84,110 84,102 86,96Z', '#a0522d', { s: '#cd7f5a' });
      const zeludac = org('M170,92 C182,86 204,92 210,108 C214,124 204,138 184,140 C170,141 160,136 152,132 C162,128 172,124 176,116 C178,108 172,100 170,92Z', '#e17055', { s: '#fab1a0' });
      const gusteraca = org('M134,142 C150,136 176,138 198,146 C186,152 154,152 134,148Z', '#fdcb6e', { s: '#ffeaa7' });
      const debelo = put(s, 'M120,232 L104,226 C98,210 98,170 100,156 C120,150 200,150 222,156 C226,180 226,212 220,226 L178,232 L166,242', { stroke: '#c0855a', 'stroke-width': 11, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', opacity: 0.9 });
      const tankoPts = [[152, 132], [146, 158], [200, 162], [204, 174], [120, 176], [118, 188], [204, 190], [204, 202], [120, 204], [118, 216], [190, 218]];
      const tanko = put(s, glatkaKriva(tankoPts, false), { stroke: '#f8a5c2', 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
      const krv = put(s, 'M232,160 L232,230', { stroke: B.krv, 'stroke-width': 3, 'stroke-dasharray': '2 3', opacity: 0.6 });
      // putanja zalogaja
      const putanja = [[160, 12], [160, 22], [160, 50], [164, 78], [172, 96], [186, 104], [196, 118], [186, 130], [166, 132], [152, 132], ...tankoPts.slice(1), [120, 232], [104, 226], [100, 190], [100, 156], [160, 152], [222, 156], [224, 200], [220, 226], [178, 232], [166, 244]];
      const zal = kr(s, 160, 12, 6, { fill: '#e1b866', stroke: '#fff', 'stroke-width': 1 });
      const upijeno = Array.from({ length: 6 }, () => kr(s, 0, 0, 2.6, { fill: B.secer }));
      const delovi = [
        { id: 'usta', naziv: '~usta', ax: 170, ay: 18, lx: 214, ly: 16, sjaj: sjaj(usta) },
        { id: 'jednjak', naziv: '~jednjak', ax: 161, ay: 52, lx: 214, ly: 52, sjaj: sjaj(jednjak) },
        { id: 'zeludac', naziv: '~želudac', ax: 206, ay: 110, lx: 254, ly: 96, sjaj: sjaj(zeludac) },
        { id: 'jetra', naziv: '~jetra', ax: 96, ay: 104, lx: 64, ly: 90, sjaj: sjaj(jetra) },
        { id: 'gusteraca', naziv: '~gušterača', ax: 140, ay: 145, lx: 64, ly: 136, sjaj: sjaj(gusteraca) },
        { id: 'tanko', naziv: '~tanko crevo', ax: 200, ay: 190, lx: 250, ly: 190, a: 'start', v: 10, sjaj: sjaj(tanko) },
        { id: 'debelo', naziv: '~debelo crevo', ax: 100, ay: 222, lx: 52, ly: 242, a: 'middle', v: 10, sjaj: sjaj(debelo) },
      ];
      const nat = natpisi(s, m, delovi);
      const T = 9;
      // udeo putanje: brže kroz jednjak, zastoj u želucu, sporo kroz creva
      const deo = (f) => (f < 0.12 ? (f / 0.12) * 0.13 : f < 0.3 ? 0.13 + ((f - 0.12) / 0.18) * 0.07 : 0.2 + ((f - 0.3) / 0.7) * 0.8);
      return {
        trajanje: T, pauza: 0.8,
        kadar(t) {
          const f = ogr(t / T, 0, 1), u = deo(f);
          let [x, y] = na(putanja, u);
          if (f > 0.12 && f < 0.3) { x += 3 * Math.sin(t * 14); y += 2 * Math.cos(t * 11); } // želudac meša hranu
          at(zal, { cx: x, cy: y, r: f2(6 - 3 * ogr((u - 0.2) / 0.5, 0, 1)) });
          zal.style.opacity = u > 0.985 ? 0 : 1;
          const uTanko = u > 0.21 && u < 0.6;
          upijeno.forEach((c, i) => {
            const k = (t * 0.9 + i / 6) % 1;
            if (!uTanko) { c.style.display = 'none'; return; }
            c.style.display = '';
            at(c, { cx: lerp(x, 232, k), cy: lerp(y, 160 + i * 12, k) });
            c.style.opacity = f2(1 - k);
          });
          at(krv, { 'stroke-dashoffset': f2(t * 10) });
          nat.kadar(t);
        },
      };
    },

    // Izlučivanje: bubrezi prečišćavaju krv, mokraća teče mokraćovodima u bešiku, pa kroz mokraćnu cev.
    // Delovi: bubreg, mokracovod, besika, cev.
    mokraca(s, m) {
      const W = 320, H = 236;
      vel(s, W, H);
      put(s, 'M160,10 L160,150', { stroke: B.krv, 'stroke-width': 6, opacity: 0.8 });
      put(s, 'M150,10 L150,150', { stroke: '#5f7fd1', 'stroke-width': 6, opacity: 0.8 });
      for (const sx of [-1, 1]) {
        put(s, `M${sx > 0 ? 160 : 150},${sx > 0 ? 62 : 70} L${155 + sx * 52},${sx > 0 ? 62 : 70}`, { stroke: sx > 0 ? B.krv : '#5f7fd1', 'stroke-width': 4, opacity: 0.8 });
        put(s, `M${sx > 0 ? 150 : 160},${sx > 0 ? 70 : 62} L${155 + sx * 52},${sx > 0 ? 70 : 62}`, { stroke: sx > 0 ? '#5f7fd1' : B.krv, 'stroke-width': 4, opacity: 0.8 });
      }
      const bub = (cx, sx) => el(s, 'path', { d: `M${cx},30 C${cx + sx * 34},26 ${cx + sx * 40},70 ${cx + sx * 34},96 C${cx + sx * 28},116 ${cx},114 ${cx - sx * 2},96 C${cx + sx * 8},84 ${cx + sx * 8},62 ${cx - sx * 2},48 C${cx - sx * 6},38 ${cx - sx * 6},31 ${cx},30Z`, fill: '#a0522d', stroke: '#cd7f5a', 'stroke-width': 2 });
      const bL = bub(92, -1), bD = bub(218, 1);
      const movL = put(s, 'M98,96 C104,130 128,150 144,170', { stroke: '#ffeaa7', 'stroke-width': 4, 'stroke-linecap': 'round' });
      const movD = put(s, 'M212,96 C206,130 182,150 166,170', { stroke: '#ffeaa7', 'stroke-width': 4, 'stroke-linecap': 'round' });
      const besika = el(s, 'path', { d: 'M132,170 C132,150 188,150 188,170 C188,196 172,206 160,206 C148,206 132,196 132,170Z', fill: 'rgba(253,203,110,.12)', stroke: '#fdcb6e', 'stroke-width': 2.4 });
      const nivo = el(s, 'rect', { x: 133, y: 206, width: 54, height: 0, fill: 'rgba(253,203,110,.55)' });
      const klip = el(s, 'clipPath', { id: 'bes' + Math.random().toString(36).slice(2, 7) });
      el(klip, 'path', { d: 'M132,170 C132,150 188,150 188,170 C188,196 172,206 160,206 C148,206 132,196 132,170Z' });
      nivo.setAttribute('clip-path', `url(#${klip.id})`);
      const cev = put(s, 'M160,206 L160,232', { stroke: '#ffeaa7', 'stroke-width': 4 });
      const kapi = Array.from({ length: 8 }, (_, i) => ({ c: kr(s, 0, 0, 3, { fill: '#fdcb6e' }), p: i % 2 ? [[212, 96], [206, 128], [182, 150], [166, 170]] : [[98, 96], [104, 128], [128, 150], [144, 170]], f: i / 8 }));
      const izlaz = kr(s, 160, 210, 3, { fill: '#fdcb6e' });
      const delovi = [
        { id: 'bubreg', naziv: '~bubreg', ax: 70, ay: 70, lx: 40, ly: 118, a: 'middle', sjaj: sjaj(bL, bD) },
        { id: 'mokracovod', naziv: '~mokraćovod', ax: 112, ay: 136, lx: 54, ly: 170, a: 'middle', sjaj: sjaj(movL, movD) },
        { id: 'besika', naziv: '~mokraćna bešika', ax: 186, ay: 180, lx: 222, ly: 168, a: 'start', v: 10, sjaj: sjaj(besika) },
        { id: 'cev', naziv: '~mokraćna cev', ax: 162, ay: 222, lx: 222, ly: 222, a: 'start', v: 10, sjaj: sjaj(cev) },
      ];
      const nat = natpisi(s, m, delovi);
      if (m.natpisi !== false && !lista(m.istakni).length) tx(s, 155, 160, '', {});
      const T = 7;
      return {
        trajanje: T, pauza: 0.4,
        kadar(t) {
          const f = t / T, puni = f < 0.75, n = puni ? f / 0.75 : 1 - (f - 0.75) / 0.25;
          const h = 46 * glatko(n);
          at(nivo, { y: f2(206 - h), height: f2(h) });
          kapi.forEach((k) => {
            const u = (t * 0.6 + k.f) % 1;
            const [x, y] = na(k.p, u);
            at(k.c, { cx: x, cy: y });
            k.c.style.opacity = puni ? f2(Math.min(1, (1 - u) * 5)) : 0;
          });
          const iz = !puni ? ((t * 2.5) % 1) : -1;
          izlaz.style.display = iz < 0 ? 'none' : '';
          if (iz >= 0) at(izlaz, { cy: 208 + iz * 26 });
          nat.kadar(t);
        },
      };
    },

    // Oko: zenica se sužava na jakoj, a širi na slaboj svetlosti. boja (dužice), natpisi.
    oko(s, m) {
      const W = 320, H = 190;
      vel(s, W, H);
      const pozad = el(s, 'rect', { x: 0, y: 0, width: W, height: H, fill: '#000', opacity: 0 });
      const sijalica = el(s, 'g');
      kr(sijalica, 40, 50, 14, { fill: '#ffd166' });
      el(sijalica, 'rect', { x: 34, y: 63, width: 12, height: 10, rx: 2, fill: '#8fa3b8' });
      const zraci = [0, 1, 2, 3].map((i) => lin(sijalica, 58, 44 + i * 8, 100, 62 + i * 10, '#ffd166', 2, '5 6'));
      const cx = 190, cy = 100;
      el(s, 'path', { d: `M${cx - 100},${cy} C${cx - 50},${cy - 62} ${cx + 50},${cy - 62} ${cx + 100},${cy} C${cx + 50},${cy + 62} ${cx - 50},${cy + 62} ${cx - 100},${cy}Z`, fill: '#f5f6fa', stroke: '#dfe6e9', 'stroke-width': 2 });
      const duz = m.boja && /^#[0-9a-f]{3,8}$/i.test(m.boja) ? m.boja : '#4f8a5c';
      kr(s, cx, cy, 40, { fill: duz });
      for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; lin(s, cx + 14 * Math.cos(a), cy + 14 * Math.sin(a), cx + 38 * Math.cos(a), cy + 38 * Math.sin(a), 'rgba(0,0,0,.18)', 1.2); }
      const zen = kr(s, cx, cy, 14, { fill: '#0b0b0b' });
      kr(s, cx + 12, cy - 14, 6, { fill: '#fff', opacity: 0.85 });
      put(s, `M${cx - 100},${cy} C${cx - 50},${cy - 62} ${cx + 50},${cy - 62} ${cx + 100},${cy}`, { stroke: '#2d3436', 'stroke-width': 4 });
      const stanje = tx(s, W - 10, 18, '', { a: 'end', v: 13, b: C.zuta });
      if (m.natpisi !== false) {
        lin(s, cx, cy + 8, cx + 64, cy + 68, '#9fb3c8', 1.2);
        tx(s, cx + 68, cy + 72, '~zenica', { a: 'start', v: 11 });
        lin(s, cx - 30, cy + 20, cx - 74, cy + 70, '#9fb3c8', 1.2);
        tx(s, cx - 78, cy + 74, '~dužica', { a: 'end', v: 11 });
      }
      const T = 6;
      return {
        kadar(t) {
          const f = (t % T) / T, jako = f < 0.5;
          const u = jako ? glatko(f / 0.18) : glatko((f - 0.5) / 0.18);
          const r = jako ? lerp(26, 8, u) : lerp(8, 26, u);
          at(zen, { r: f2(r) });
          sijalica.style.opacity = jako ? 1 : 0.15;
          zraci.forEach((z, i) => { z.style.display = jako ? '' : 'none'; at(z, { 'stroke-dashoffset': f2(-t * 24 - i * 3) }); });
          at(pozad, { opacity: jako ? 0 : 0.35 });
          postaviTekst(stanje, jako ? '~jaka svetlost' : '~slaba svetlost');
        },
      };
    },

    // Mišići ruke: pri savijanju u laktu biceps (pregibač) se grči, a triceps (opružač) opušta, i obrnuto.
    // stanja (podrazumevano true) – piše „zgrčen“/„opušten“; nazivi: 'imena' (biceps/triceps) ili 'slova' (A/B).
    ruka(s, m) {
      const W = 320, H = 240;
      vel(s, W, H);
      const rame = [116, 34], lakat = [116, 150];
      const slova = m.nazivi === 'slova';
      el(s, 'rect', { x: 104, y: 14, width: 24, height: 22, rx: 8, fill: '#3b5068' });
      const kost1 = lin(s, rame[0], rame[1], lakat[0], lakat[1], B.kost, 9);
      kr(s, lakat[0], lakat[1], 7, { fill: B.kost });
      const podl = el(s, 'g');
      lin(podl, 0, 0, 96, 0, B.kost, 7);
      lin(podl, 0, 5, 92, 5, '#c8d6e5', 4);
      kr(podl, 108, 2, 13, { fill: B.koza, stroke: '#e0a080', 'stroke-width': 1.5 });
      const lopta = emo(podl, '⚽', 20);
      poz(lopta, 110, -14);
      const biceps = el(s, 'path', { fill: B.misic, stroke: '#ff9f80', 'stroke-width': 1.5, opacity: 0.92 });
      const triceps = el(s, 'path', { fill: B.misicO, stroke: '#ffc9b5', 'stroke-width': 1.5, opacity: 0.92 });
      const nB = tx(s, 0, 0, slova ? 'A' : '~biceps', { v: 12, b: '#fff' });
      const nT = tx(s, 0, 0, slova ? 'B' : '~triceps', { v: 12, b: '#fff' });
      const sB = m.stanja === false ? null : tx(s, 0, 0, '', { v: 11, a: 'end' });
      const sT = m.stanja === false ? null : tx(s, 0, 0, '', { v: 11, a: 'end' });
      // vreteno mišića između dve tačke, debljina zavisi od dužine (kraći = deblji)
      const vreteno = (p1, p2, L0, strana) => {
        const dx = p2[0] - p1[0], dy = p2[1] - p1[1], L = Math.hypot(dx, dy), nx = -dy / L * strana, ny = dx / L * strana;
        const d = ogr(20 + (L0 - L) * 0.7, 16, 46);
        const m1 = [p1[0] + dx * 0.35 + nx * d, p1[1] + dy * 0.35 + ny * d], m2 = [p1[0] + dx * 0.68 + nx * d * 0.9, p1[1] + dy * 0.68 + ny * d * 0.9];
        return { d: `M${f2(p1[0])},${f2(p1[1])} C${f2(m1[0])},${f2(m1[1])} ${f2(m2[0])},${f2(m2[1])} ${f2(p2[0])},${f2(p2[1])} C${f2(p1[0] + dx * 0.68 - nx * d * 0.2)},${f2(p1[1] + dy * 0.68 - ny * d * 0.2)} ${f2(p1[0] + dx * 0.35 - nx * d * 0.2)},${f2(p1[1] + dy * 0.35 - ny * d * 0.2)} ${f2(p1[0])},${f2(p1[1])}Z`, c: [p1[0] + dx * 0.5 + nx * d * 0.35, p1[1] + dy * 0.5 + ny * d * 0.35], L };
      };
      const T = 5;
      return {
        kadar(t) {
          const f = (t % T) / T;
          const sav = f < 0.5 ? glatko(f / 0.3) : 1 - glatko((f - 0.5) / 0.3);
          const ug = lerp(62, -55, sav); // ugao podlaktice (stepeni, 0 = vodoravno napred)
          const a = ug * Math.PI / 180;
          podl.setAttribute('transform', `translate(${lakat[0]} ${lakat[1]}) rotate(${f2(ug)})`);
          const hvB = [lakat[0] + 26 * Math.cos(a), lakat[1] + 26 * Math.sin(a)];
          const hvT = [lakat[0] - 12 * Math.cos(a) + 2, lakat[1] - 12 * Math.sin(a) + 4];
          const vb = vreteno([rame[0] + 6, rame[1] + 10], hvB, 120, -1);
          const vt = vreteno([rame[0] - 8, rame[1] + 10], hvT, 120, 1);
          at(biceps, { d: vb.d, fill: sav > 0.5 ? B.misic : B.misicO });
          at(triceps, { d: vt.d, fill: sav > 0.5 ? B.misicO : B.misic });
          at(nB, { x: f2(vb.c[0] + 4), y: f2(vb.c[1]) });
          at(nT, { x: f2(vt.c[0] - 2), y: f2(vt.c[1]) });
          if (sB) {
            at(sB, { x: 300, y: 70 }); postaviTekst(sB, `~${slova ? 'A' : 'biceps'}: ${sav > 0.5 ? 'zgrčen' : 'opušten'}`);
            at(sT, { x: 300, y: 92 }); postaviTekst(sT, `~${slova ? 'B' : 'triceps'}: ${sav > 0.5 ? 'opušten' : 'zgrčen'}`);
            sB.setAttribute('fill', sav > 0.5 ? '#ff7675' : '#9fb3c8');
            sT.setAttribute('fill', sav > 0.5 ? '#9fb3c8' : '#ff7675');
          }
        },
      };
    },

    // Preobražaj (metamorfoza). tip: 'leptir' (jaje → gusenica → lutka → leptir), 'zaba' (jaje → punoglavac →
    // punoglavac sa nogama → žaba), 'skakavac' (nepotpun: jaje → larva → odrasli). skrij: indeks stadijuma za „?“.
    preobrazaj(s, m) {
      const tip = izbor(m.tip, ['leptir', 'zaba', 'skakavac'], 'leptir');
      const W = 320, H = 236;
      vel(s, W, H);
      const cx = 160, cy = 118, R = 78;
      const ST = {
        leptir: ['~jaje', '~gusenica', '~lutka', '~leptir'],
        zaba: ['~jaja', '~punoglavac', '~punoglavac sa nogama', '~žaba'],
        skakavac: ['~jaje', '~larva', '~odrasli skakavac'],
      }[tip];
      const n = ST.length, skrij = lista(m.skrij);
      const mesta = ST.map((_, i) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [cx + R * Math.cos(a), cy + R * 0.86 * Math.sin(a)]; });
      // strelice u krugu
      for (let i = 0; i < n; i++) {
        const a1 = -Math.PI / 2 + ((i + 0.28) / n) * Math.PI * 2, a2 = -Math.PI / 2 + ((i + 0.72) / n) * Math.PI * 2;
        const p = [];
        for (let k = 0; k <= 10; k++) { const a = lerp(a1, a2, k / 10); p.push([cx + R * Math.cos(a), cy + R * 0.86 * Math.sin(a)]); }
        put(s, 'M' + p.map((q) => `${f2(q[0])},${f2(q[1])}`).join(' L'), { stroke: '#3b5068', 'stroke-width': 2.5 });
        const [x1, y1] = p[9], [x2, y2] = p[10];
        strelica(s, '#3b5068', 2.5).set(x1, y1, x2 + (x2 - x1) * 0.6, y2 + (y2 - y1) * 0.6);
      }
      const sjaji = mesta.map(([x, y]) => kr(s, x, y, 30, { fill: C.zuta, opacity: 0 }));
      const crtez = mesta.map(([x, y], i) => {
        const g = el(s, 'g');
        g.setAttribute('transform', `translate(${f2(x)} ${f2(y)})`);
        const lik = el(g, 'g');
        if (tip === 'leptir') {
          if (i === 0) { el(lik, 'path', { d: 'M-24,8 C-10,-14 14,-14 24,6 C10,16 -10,16 -24,8Z', fill: '#2d8a47' }); for (const [x0, y0] of [[-6, 0], [2, -2], [9, 1], [-1, 6]]) el(lik, 'ellipse', { cx: x0, cy: y0, rx: 2.6, ry: 3.4, fill: '#f5f6fa' }); }
          if (i === 1) lik.dataset.gusenica = '1';
          if (i === 2) { lin(lik, 0, -24, 0, -16, '#8b6b4a', 2); el(lik, 'path', { d: 'M0,-16 C9,-12 10,4 4,16 C2,20 -2,20 -4,16 C-10,4 -9,-12 0,-16Z', fill: '#7cb36b', stroke: '#4e7d43', 'stroke-width': 1.5 }); lin(lik, -6, -2, 6, -2, '#4e7d43', 1); lin(lik, -5, 6, 5, 6, '#4e7d43', 1); }
          if (i === 3) lik.dataset.leptir = '1';
        } else if (tip === 'zaba') {
          if (i === 0) for (const [x0, y0] of [[-10, -6], [0, -9], [10, -5], [-5, 3], [6, 4], [-13, 6], [14, 6], [0, 12]]) { kr(lik, x0, y0, 5.5, { fill: 'rgba(223,230,233,.35)', stroke: '#dfe6e9', 'stroke-width': 0.8 }); kr(lik, x0, y0, 2, { fill: '#2d3436' }); }
          if (i === 1 || i === 2) lik.dataset.punoglavac = String(i);
          if (i === 3) poz(emo(lik, '🐸', 36), 0, 0);
        } else {
          if (i === 0) for (const [x0, y0] of [[-6, 0], [0, -2], [6, 0], [-3, 6], [3, 6]]) el(lik, 'ellipse', { cx: x0, cy: y0, rx: 2.4, ry: 5, fill: '#e1b866', transform: `rotate(20 ${x0} ${y0})` });
          if (i === 1) poz(emo(lik, '🦗', 20), 0, 0);
          if (i === 2) poz(emo(lik, '🦗', 38), 0, 0);
        }
        const skriven = skrij.includes(i);
        const nat = m.natpisi === false && !skriven ? null : tx(s, x, y + (i === 0 ? -40 : 40) + (n === 3 && i > 0 ? 0 : 0), skriven ? '?' : ST[i], { v: skriven ? 16 : 11, b: skriven ? C.zuta : C.bela });
        return { g, lik, nat };
      });
      // pokretni likovi: gusenica, leptir, punoglavci
      const gus = crtez.find((c) => c.lik.dataset.gusenica);
      const gusKr = gus ? Array.from({ length: 7 }, (_, k) => kr(gus.lik, 0, 0, k === 6 ? 6 : 5, { fill: k === 6 ? '#2d8a47' : '#55b96a', stroke: '#2d8a47', 'stroke-width': 1 })) : [];
      const lep = crtez.find((c) => c.lik.dataset.leptir);
      let krila = null;
      if (lep) {
        krila = [-1, 1].map((sx) => { const g = el(lep.lik, 'g'); el(g, 'path', { d: `M0,-2 C${sx * 10},-26 ${sx * 30},-22 ${sx * 26},-4 C${sx * 22},4 ${sx * 8},2 0,0Z`, fill: '#f0932b', stroke: '#2d3436', 'stroke-width': 1.5 }); el(g, 'path', { d: `M0,1 C${sx * 16},4 ${sx * 20},18 ${sx * 10},20 C${sx * 4},20 0,10 0,1Z`, fill: '#f6b93b', stroke: '#2d3436', 'stroke-width': 1.5 }); kr(g, sx * 18, -14, 2.5, { fill: '#fff' }); return g; });
        el(lep.lik, 'ellipse', { cx: 0, cy: 2, rx: 2.5, ry: 12, fill: '#2d3436' });
        put(lep.lik, 'M0,-9 C-3,-16 -6,-20 -8,-22 M0,-9 C3,-16 6,-20 8,-22', { stroke: '#2d3436', 'stroke-width': 1.2 });
      }
      const pun = crtez.filter((c) => c.lik.dataset.punoglavac).map((c) => {
        const noge = c.lik.dataset.punoglavac === '2';
        const rep = put(c.lik, '', { stroke: '#2d3436', 'stroke-width': 4, 'stroke-linecap': 'round' });
        el(c.lik, 'ellipse', { cx: -8, cy: 0, rx: 11, ry: 8.5, fill: noge ? '#4e6b3a' : '#2d3436' });
        kr(c.lik, -13, -3, 1.8, { fill: '#dfe6e9' });
        if (noge) put(c.lik, 'M0,4 L6,12 L10,12 M-4,5 L-2,13 L2,14', { stroke: '#4e6b3a', 'stroke-width': 2.2, 'stroke-linecap': 'round' });
        return { rep, noge };
      });
      const T = n * 1.6;
      return {
        kadar(t) {
          const akt = Math.floor((t % T) / 1.6), u = ((t % T) % 1.6) / 1.6;
          sjaji.forEach((e, i) => at(e, { opacity: i === akt ? f2(0.18 * Math.sin(u * Math.PI)) : 0 }));
          crtez.forEach((c, i) => c.lik.setAttribute('transform', `scale(${f2(i === akt ? 1 + 0.12 * Math.sin(u * Math.PI) : 1)})`));
          gusKr.forEach((c, k) => at(c, { cx: f2(-18 + k * 6), cy: f2(-3 * Math.abs(Math.sin(t * 3 - k * 0.6)) + 4) }));
          if (krila) { const z = 0.35 + 0.65 * Math.abs(Math.cos(t * 5)); krila.forEach((g) => g.setAttribute('transform', `scale(${f2(z)} 1)`)); }
          pun.forEach((p) => {
            const q = [];
            for (let k = 0; k <= 6; k++) q.push([2 + k * 4, Math.sin(t * 8 - k * 0.9) * (k * 0.9)]);
            at(p.rep, { d: glatkaKriva(q, false) });
          });
        },
      };
    },

    // Klijanje semena pasulja: korenak raste nadole, stabaoce nagore, otvaraju se klicini listići pa pravi listovi.
    // Delovi: korenak, stabaoce, klicini, listovi. skrij/istakni rade kao kod drugih scena.
    klijanje(s, m) {
      const W = 320, H = 236;
      vel(s, W, H);
      const TLO = 120;
      el(s, 'rect', { x: 0, y: TLO, width: W, height: H - TLO, fill: B.zemlja });
      const r = slucajni(3);
      for (let i = 0; i < 40; i++) kr(s, r() * W, TLO + 6 + r() * (H - TLO - 6), 1 + r() * 1.5, { fill: B.zemlja2 });
      const dan = tx(s, 10, 18, '', { a: 'start', v: 13, b: C.zuta });
      const koren = put(s, '', { stroke: '#f5f0e1', 'stroke-width': 4, 'stroke-linecap': 'round' });
      const bocni = put(s, '', { stroke: '#e8dcc0', 'stroke-width': 1.6, 'stroke-linecap': 'round' });
      const stablo = put(s, '', { stroke: '#9bd27a', 'stroke-width': 5, 'stroke-linecap': 'round' });
      const seme = el(s, 'g');
      const kL = el(seme, 'path', { d: 'M0,0 C-22,-4 -30,10 -24,20 C-18,28 -4,26 0,18Z', fill: '#f3e3c3', stroke: '#c9a46a', 'stroke-width': 1.5 });
      const kD = el(seme, 'path', { d: 'M0,0 C22,-4 30,10 24,20 C18,28 4,26 0,18Z', fill: '#f3e3c3', stroke: '#c9a46a', 'stroke-width': 1.5 });
      const ljuska = el(s, 'path', { d: 'M160,134 C130,128 126,160 140,166 C150,170 170,170 180,166 C194,160 190,128 160,134Z', fill: '#8e3b46', stroke: '#5e2530', 'stroke-width': 1.5 });
      const listovi = [-1, 1].map((sx) => el(s, 'path', { d: `M0,0 C${sx * 8},-14 ${sx * 30},-18 ${sx * 38},-8 C${sx * 30},4 ${sx * 10},6 0,0Z`, fill: B.list, stroke: B.list2, 'stroke-width': 1.4 }));
      const delovi = [
        { id: 'korenak', naziv: '~korenak', ax: 160, ay: 200, lx: 226, ly: 206, a: 'start', sjaj: sjaj(koren) },
        { id: 'stabaoce', naziv: '~stabaoce', ax: 160, ay: 100, lx: 226, ly: 104, a: 'start', sjaj: sjaj(stablo) },
        { id: 'klicini', naziv: '~klicini listići', ax: 140, ay: 66, lx: 104, ly: 86, a: 'end', sjaj: sjaj(kL, kD) },
        { id: 'listovi', naziv: '~listovi (iz pupoljčića)', ax: 188, ay: 32, lx: 236, ly: 22, a: 'middle', v: 10 },
      ];
      const natG = el(s, 'g');
      const T = 8;
      let nat = null;
      return {
        trajanje: T, pauza: 2,
        kadar(t, novo) {
          if (novo || !nat) { natG.replaceChildren(); nat = null; }
          const f = ogr(t / T, 0, 1);
          postaviTekst(dan, `~dan ${1 + Math.min(10, Math.floor(f * 11))}`);
          const k = glatko(f / 0.45); // koren
          at(koren, { d: `M160,150 C${f2(160 - 6 * k)},${f2(150 + 30 * k)} ${f2(160 + 4 * k)},${f2(150 + 60 * k)} 160,${f2(150 + 78 * k)}` });
          const kb = glatko((f - 0.25) / 0.35);
          at(bocni, { d: kb > 0 ? `M158,${f2(180)} l${f2(-26 * kb)},${f2(12 * kb)} M162,195 l${f2(24 * kb)},${f2(10 * kb)} M159,208 l${f2(-18 * kb)},${f2(8 * kb)}` : '' });
          const st = glatko((f - 0.15) / 0.45); // stabaoce: prvo savijeno (kuka), pa se ispravlja
          const vrh = 140 - 92 * st, kuka = 1 - glatko((f - 0.45) / 0.2);
          at(stablo, { d: `M160,148 C160,${f2(lerp(148, vrh, 0.6))} ${f2(160 + 18 * kuka * st)},${f2(vrh + 14 * kuka)} ${f2(160 + 10 * kuka * st)},${f2(vrh + 10 * kuka)}` });
          const pucanje = glatko((f - 0.08) / 0.15);
          ljuska.style.opacity = f2(1 - glatko((f - 0.3) / 0.15));
          ljuska.setAttribute('transform', `translate(${f2(pucanje * 3)} ${f2(pucanje * 6)})`);
          const sx = 160 + 10 * kuka * st, sy = lerp(150, vrh + 24, glatko((f - 0.2) / 0.4));
          seme.setAttribute('transform', `translate(${f2(sx)} ${f2(sy)}) rotate(${f2(lerp(0, 180, glatko((f - 0.35) / 0.25)))})`);
          const otv = glatko((f - 0.55) / 0.15);
          kL.setAttribute('transform', `rotate(${f2(-otv * 50)})`);
          kD.setAttribute('transform', `rotate(${f2(otv * 50)})`);
          const lv = glatko((f - 0.68) / 0.25);
          listovi.forEach((l, i) => { l.style.display = lv > 0 ? '' : 'none'; l.setAttribute('transform', `translate(160 ${f2(vrh + 4)}) scale(${f2(lv)}) rotate(${i ? -18 : 18})`); });
          if (!nat && f > 0.9) {
            // natpisi tek kad je biljka izrasla (tačke se vezuju za konačan izgled)
            const d = delovi.map((x) => ({ ...x }));
            d[0].ay = 210; d[1].ay = 96; d[2].ax = 150; d[2].ay = 66; d[3].ax = 186; d[3].ay = 44;
            nat = natpisi(natG, m, d);
          }
          if (nat) nat.kadar(t);
        },
      };
    },

    // Cvet: prašnici (muški deo), tučak (ženski deo: žig, stubić, plodnik), latice, čašica. Pčela prenosi polen,
    // polenova cevčica raste do semenog zametka (oprasivanje: false – bez toga). Delovi: latica, casica, prasnik, tucak, plodnik, polen.
    cvet(s, m) {
      const W = 320, H = 240;
      vel(s, W, H);
      const cx = 160, OS = 196;
      put(s, `M${cx},${OS} L${cx},236`, { stroke: B.stablo, 'stroke-width': 7 });
      el(s, 'path', { d: `M${cx},214 C${cx + 26},200 ${cx + 52},206 ${cx + 64},216 C${cx + 44},226 ${cx + 20},224 ${cx},214Z`, fill: B.list, stroke: B.list2, 'stroke-width': 1.4 });
      const casica = [-1, 1].map((sx) => el(s, 'path', { d: `M${cx},${OS} C${cx + sx * 20},${OS - 2} ${cx + sx * 40},${OS - 14} ${cx + sx * 46},${OS - 30} C${cx + sx * 30},${OS - 26} ${cx + sx * 12},${OS - 16} ${cx},${OS - 8}Z`, fill: '#3fae5a', stroke: '#2d8a47', 'stroke-width': 1.4 }));
      const latice = [-1, 1].map((sx) => el(s, 'path', { d: `M${cx + sx * 16},${OS - 14} C${cx + sx * 60},${OS - 40} ${cx + sx * 100},${OS - 110} ${cx + sx * 80},${OS - 150} C${cx + sx * 60},${OS - 160} ${cx + sx * 40},${OS - 110} ${cx + sx * 26},${OS - 60}Z`, fill: 'rgba(253,121,168,.75)', stroke: '#e84393', 'stroke-width': 1.6 }));
      const plodnik = el(s, 'path', { d: `M${cx},${OS - 6} C${cx - 22},${OS - 8} ${cx - 22},${OS - 44} ${cx - 6},${OS - 50} L${cx + 6},${OS - 50} C${cx + 22},${OS - 44} ${cx + 22},${OS - 8} ${cx},${OS - 6}Z`, fill: '#55b96a', stroke: '#2d8a47', 'stroke-width': 1.6 });
      const zametak = el(s, 'ellipse', { cx, cy: OS - 26, rx: 5, ry: 7, fill: '#dfe6e9', stroke: '#b2bec3', 'stroke-width': 1 });
      const stubic = put(s, `M${cx},${OS - 50} L${cx},${OS - 120}`, { stroke: '#55b96a', 'stroke-width': 6 });
      const zig = el(s, 'ellipse', { cx, cy: OS - 124, rx: 11, ry: 5, fill: '#78e08f', stroke: '#2d8a47', 'stroke-width': 1.4 });
      const prasnici = [-1, 1].flatMap((sx) => [0, 1].map((k) => {
        const x2 = cx + sx * (26 + k * 16), y2 = OS - 96 + k * 18;
        const g = el(s, 'g');
        put(g, `M${cx + sx * 8},${OS - 10} C${cx + sx * 14},${OS - 50} ${x2},${y2 + 30} ${x2},${y2}`, { stroke: '#f5f6fa', 'stroke-width': 2 });
        const k2 = el(g, 'ellipse', { cx: x2, cy: y2 - 4, rx: 5, ry: 8, fill: '#fdcb6e', stroke: '#e1b866', 'stroke-width': 1.2 });
        return { g, k: k2, x: x2, y: y2 - 4 };
      }));
      const opr = m.oprasivanje !== false;
      const pcela = opr ? emo(s, '🐝', 24) : null;
      const zrna = opr ? Array.from({ length: 6 }, () => kr(s, 0, 0, 2.6, { fill: '#ffd32a', stroke: '#e1b866', 'stroke-width': 0.6 })) : [];
      const cevcica = opr ? put(s, '', { stroke: '#ffd32a', 'stroke-width': 1.8, 'stroke-dasharray': '3 2' }) : null;
      const delovi = [
        { id: 'latica', naziv: '~latica', ax: cx - 74, ay: OS - 120, lx: 62, ly: 80, sjaj: sjaj(...latice) },
        { id: 'prasnik', naziv: '~prašnik', ax: prasnici[1].x - 5, ay: prasnici[1].y, lx: 64, ly: 132, sjaj: sjaj(...prasnici.map((p) => p.k)) },
        { id: 'casica', naziv: '~čašica', ax: cx - 40, ay: OS - 24, lx: 64, ly: OS - 4, sjaj: sjaj(...casica) },
        { id: 'tucak', naziv: '~tučak', ax: cx + 2, ay: OS - 90, lx: 268, ly: 66, sjaj: sjaj(zig, stubic, plodnik) },
        { id: 'zig', naziv: '~žig', ax: cx + 10, ay: OS - 124, lx: 268, ly: 34, skriven: true, sjaj: sjaj(zig) },
        { id: 'plodnik', naziv: '~plodnik', ax: cx + 14, ay: OS - 26, lx: 268, ly: 168, sjaj: sjaj(plodnik) },
      ];
      const nat = natpisi(s, m, delovi);
      const T = 9;
      return {
        trajanje: opr ? T : undefined, pauza: 1.5,
        kadar(t) {
          nat.kadar(t);
          if (!opr) return;
          const f = t / T;
          // pčela: dolazi s leve strane, sleće na prašnik, pa na žig, pa odlazi
          const pts = [[-20, 30], [prasnici[1].x - 4, prasnici[1].y - 14], [prasnici[1].x - 4, prasnici[1].y - 14], [cx, OS - 140], [cx, OS - 140], [340, 20]];
          const [x, y] = na(pts, ogr(f / 0.5, 0, 1));
          poz(pcela, x + 2 * Math.sin(t * 20), y + 2 * Math.cos(t * 17), x > cx);
          zrna.forEach((z, i) => {
            const nos = f > 0.15 && f < 0.3, pao = f >= 0.3;
            z.style.display = f > 0.15 ? '' : 'none';
            if (nos) at(z, { cx: x - 6 + (i % 3) * 5, cy: y + 8 + Math.floor(i / 3) * 4 });
            else if (pao) at(z, { cx: cx - 8 + (i % 3) * 7, cy: OS - 128 + Math.floor(i / 3) * 4 });
          });
          const c = glatko((f - 0.5) / 0.3);
          at(cevcica, { d: c > 0 ? `M${cx + 1},${OS - 124} L${cx + 1},${f2(OS - 124 + c * 92)}` : '' });
          at(zametak, { fill: f > 0.82 ? '#ffd32a' : '#dfe6e9' });
        },
      };
    },

    // Lanac ishrane: clanovi [{e:'🌿', o:'~trava'}, …] (do 5) sa strelicama (ko koga jede); energija putuje lancem.
    // uloge: true – ispod piše proizvođač/potrošač; razlagac: {e:'🍄', o:'~gljive'}; skrij: indeks člana za „?“.
    lanac(s, m) {
      const cl = niz(m.clanovi).slice(0, 5);
      if (!cl.length) cl.push({ e: '🌿', o: '~trava' }, { e: '🐇', o: '~zec' }, { e: '🦊', o: '~lisica' });
      const raz = m.razlagac && typeof m.razlagac === 'object' ? m.razlagac : null;
      const W = 320, H = raz ? 214 : 140;
      vel(s, W, H);
      const n = cl.length, dx = (W - 68) / Math.max(1, n - 1), y = 58;
      const xs = cl.map((_, i) => (n === 1 ? W / 2 : 34 + i * dx));
      const skrij = lista(m.skrij);
      for (let i = 0; i < n - 1; i++) { put(s, `M${f2(xs[i] + 22)},${y} L${f2(xs[i + 1] - 22)},${y}`, { stroke: '#3b5068', 'stroke-width': 3 }); strelica(s, '#5d7a96', 3).set(xs[i + 1] - 34, y, xs[i + 1] - 21, y); }
      const sjaji = xs.map((x) => kr(s, x, y, 25, { fill: C.zuta, opacity: 0 }));
      cl.forEach((c, i) => {
        kr(s, xs[i], y, 21, { fill: '#13263a', stroke: '#3b5068', 'stroke-width': 2 });
        if (skrij.includes(i)) tx(s, xs[i], y + 1, '?', { v: 22, b: C.zuta });
        else poz(emo(s, String(c.e || '❓'), 26), xs[i], y + 1);
        const ime = skrij.includes(i) ? '' : c.o || '';
        if (ime) tx(s, xs[i], y + 36, ime, { v: n > 4 ? 10 : 11 });
        if (m.uloge) tx(s, xs[i], y + 52, i === 0 ? '~proizvođač' : '~potrošač', { v: 9.5, b: i === 0 ? '#55efc4' : '#fab1a0' });
      });
      const iskra = kr(s, 0, 0, 5, { fill: C.zuta, stroke: '#fff', 'stroke-width': 1 });
      let rz = null;
      if (raz) {
        const ry = 168;
        for (let i = 0; i < n; i++) put(s, `M${f2(xs[i])},${y + (m.uloge ? 60 : 44)} L${f2(lerp(xs[i], W / 2, 0.75))},${ry - 26}`, { stroke: '#5d7a96', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' });
        kr(s, W / 2, ry, 21, { fill: '#13263a', stroke: '#3b5068', 'stroke-width': 2 });
        poz(emo(s, String(raz.e || '🍄'), 26), W / 2, ry + 1);
        tx(s, W / 2 + 30, ry, raz.o || '~razlagači', { a: 'start', v: 11 });
        if (m.uloge) tx(s, W / 2 - 30, ry, '~razlagač', { a: 'end', v: 9.5, b: '#a29bfe' });
        rz = true;
      }
      const T = n * 1.1;
      return {
        kadar(t) {
          const f = (t % T) / T * (n - 1 || 1), i = Math.min(n - 2, Math.floor(f)), u = f - i;
          if (n > 1) at(iskra, { cx: f2(lerp(xs[i] + 22, xs[i + 1] - 22, glatko(u))), cy: y - 1 });
          sjaji.forEach((e, k) => at(e, { opacity: k === Math.round(f) ? 0.22 : 0 }));
        },
      };
    },

    // Rast biljke prema uticaju: tip 'svetlost' (stablo se savija ka prozoru; objasni: true – senovita strana
    // raste brže) ili 'koren' (seme položeno na bok: koren se savija nadole, stablo nagore).
    tropizam(s, m) {
      const tip = izbor(m.tip, ['svetlost', 'koren'], 'svetlost');
      const W = 320, H = 224;
      vel(s, W, H);
      const dan = tx(s, 10, 18, '', { a: 'start', v: 13, b: C.zuta });
      const T = 7;
      if (tip === 'svetlost') {
        el(s, 'rect', { x: 262, y: 26, width: 50, height: 120, fill: 'rgba(255,234,167,.3)', stroke: '#8fa3b8', 'stroke-width': 4 });
        lin(s, 287, 26, 287, 146, '#8fa3b8', 2); lin(s, 262, 86, 312, 86, '#8fa3b8', 2);
        const zraci = [0, 1, 2, 3].map((i) => lin(s, 258, 40 + i * 28, 150, 70 + i * 24, '#ffd166', 2, '6 8'));
        tx(s, 287, 162, '~svetlost', { v: 11, b: '#ffd166' });
        el(s, 'path', { d: 'M78,182 L142,182 L134,216 L86,216Z', fill: '#c0723a', stroke: '#8e4f24', 'stroke-width': 2 });
        el(s, 'rect', { x: 76, y: 178, width: 68, height: 8, rx: 2, fill: '#5d4330' });
        const st = put(s, '', { stroke: B.stablo, 'stroke-width': 6, 'stroke-linecap': 'round' });
        const lv = [0, 1, 2].map(() => el(s, 'path', { d: 'M0,0 C6,-12 22,-14 30,-6 C22,4 8,4 0,0Z', fill: B.list, stroke: B.list2, 'stroke-width': 1.3 }));
        const obj = m.objasni ? [tx(s, 0, 0, '~brže raste', { v: 10, b: '#fab1a0', a: 'end' }), tx(s, 0, 0, '~sporije', { v: 10, b: '#ffd166', a: 'start' })] : null;
        const crtice = m.objasni ? [put(s, '', { stroke: '#fab1a0', 'stroke-width': 1.5 }), put(s, '', { stroke: '#ffd166', 'stroke-width': 1.5 })] : null;
        return {
          trajanje: T, pauza: 1.6,
          kadar(t) {
            const f = ogr(t / T, 0, 1), b = glatko(f);
            postaviTekst(dan, `~dan ${1 + Math.min(8, Math.floor(f * 9))}`);
            zraci.forEach((z, i) => at(z, { 'stroke-dashoffset': f2(t * 22 + i * 5) }));
            const p0 = [110, 180], p1 = [110, 130], p2 = [110 + 30 * b, 90 - 6 * b], p3 = [110 + 70 * b, 52 + 10 * b];
            at(st, { d: `M${p0} C${f2(p1[0])},${f2(p1[1])} ${f2(p2[0])},${f2(p2[1])} ${f2(p3[0])},${f2(p3[1])}` });
            const ug = Math.atan2(p3[1] - p2[1], p3[0] - p2[0]) * 180 / Math.PI;
            lv[0].setAttribute('transform', `translate(${f2(p3[0])} ${f2(p3[1])}) rotate(${f2(ug)})`);
            lv[1].setAttribute('transform', `translate(110 128) rotate(${f2(-150 + 40 * b)})`);
            lv[2].setAttribute('transform', `translate(${f2(110 + 8 * b)} 100) rotate(${f2(-20 + 10 * b)})`);
            if (obj) {
              at(obj[0], { x: f2(100 + 6 * b), y: 112 }); at(obj[1], { x: f2(122 + 18 * b), y: 132 });
              at(crtice[0], { d: `M${f2(104 + 8 * b)},96 l-6,0 M${f2(104 + 4 * b)},104 l-6,0 M${f2(104 + 2 * b)},120 l-6,0` });
              at(crtice[1], { d: `M${f2(118 + 14 * b)},96 l4,0 M${f2(116 + 8 * b)},106 l4,0` });
            }
          },
        };
      }
      // koren i stablo položenog semena
      el(s, 'rect', { x: 40, y: 40, width: 240, height: 170, rx: 10, fill: 'rgba(93,67,48,.55)', stroke: '#8fa3b8', 'stroke-width': 2 });
      strelica(s, C.zuta, 3).set(300, 70, 300, 150);
      tx(s, 296, 166, '~Zemljina teža', { v: 10, b: C.zuta, a: 'end' });
      const kor = put(s, '', { stroke: '#f5f0e1', 'stroke-width': 4, 'stroke-linecap': 'round' });
      const st = put(s, '', { stroke: '#9bd27a', 'stroke-width': 5, 'stroke-linecap': 'round' });
      el(s, 'ellipse', { cx: 150, cy: 124, rx: 22, ry: 15, fill: '#8e3b46', stroke: '#5e2530', 'stroke-width': 1.5 });
      if (m.natpisi !== false) { tx(s, 92, 56, '~stablo raste nagore', { v: 10, a: 'start', b: '#9bd27a' }); tx(s, 60, 200, '~koren raste nadole', { v: 10, a: 'start', b: '#f5f0e1' }); }
      return {
        trajanje: T, pauza: 1.6,
        kadar(t) {
          const f = ogr(t / T, 0, 1), k = glatko(f);
          postaviTekst(dan, `~dan ${1 + Math.min(6, Math.floor(f * 7))}`);
          at(kor, { d: `M170,126 C${f2(170 + 40 * k)},126 ${f2(186 + 30 * k)},${f2(130 + 20 * k)} ${f2(190 + 26 * k)},${f2(130 + 66 * k)}` });
          at(st, { d: `M130,122 C${f2(130 - 30 * k)},122 ${f2(110 - 16 * k)},${f2(118 - 10 * k)} ${f2(110 - 14 * k)},${f2(118 - 56 * k)}` });
        },
      };
    },

    // Prirodno odabiranje: grabljivica lakše vidi plen koji se ne uklapa u podlogu, pa se iz generacije
    // u generaciju menja udeo boja. pozadina ('#rrggbb'), boje: [{b:'#4caf50', o:'~zeleni'}, {b:'#8d5524', o:'~smeđi'}],
    // grabljivac ('🐦'), plen: 'skakavac' | 'mis' | 'moljac'.
    odabiranje(s, m) {
      const W = 320, H = 236;
      vel(s, W, H);
      const hex = (v, pod) => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v : pod);
      const poz0 = hex(m.pozadina, '#3d8b40');
      const bj = niz(m.boje).slice(0, 2);
      while (bj.length < 2) bj.push([{ b: '#55c25a', o: '~zeleni' }, { b: '#8d5524', o: '~smeđi' }][bj.length]);
      const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
      const dist = (a, b) => { const x = rgb(a), y = rgb(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
      const kam = dist(hex(bj[0].b, '#55c25a'), poz0) <= dist(hex(bj[1].b, '#8d5524'), poz0) ? 0 : 1; // koja boja se uklapa
      el(s, 'rect', { x: 8, y: 26, width: W - 16, height: 150, rx: 8, fill: poz0 });
      const r = slucajni(9);
      for (let i = 0; i < 60; i++) { const x = 14 + r() * (W - 28), y = 40 + r() * 130; lin(s, x, y, x + (r() - 0.5) * 6, y - 6 - r() * 6, 'rgba(0,0,0,.18)', 1.5); }
      const N = 20, mesta = [];
      while (mesta.length < N) { const x = 24 + r() * (W - 48), y = 44 + r() * 120; if (mesta.every((p) => Math.hypot(p[0] - x, p[1] - y) > 22)) mesta.push([x, y]); }
      const vrsta = izbor(m.plen, ['skakavac', 'mis', 'moljac'], 'skakavac');
      const telo = mesta.map(([x, y], i) => {
        const g = el(s, 'g');
        g.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2((r() - 0.5) * 50)})`);
        let o;
        if (vrsta === 'moljac') o = el(g, 'path', { d: 'M0,-3 L-11,6 L0,3 L11,6Z', stroke: 'rgba(0,0,0,.35)', 'stroke-width': 0.8 });
        else if (vrsta === 'mis') { o = el(g, 'ellipse', { rx: 8, ry: 5, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 0.8 }); put(g, 'M8,0 C12,0 14,4 17,3', { stroke: 'rgba(0,0,0,.4)', 'stroke-width': 1 }); }
        else { o = el(g, 'ellipse', { rx: 9, ry: 3.6, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 0.8 }); put(g, 'M-2,2 L-7,7 M2,2 L6,8 M7,-1 L12,-6', { stroke: 'rgba(0,0,0,.45)', 'stroke-width': 1 }); }
        return { g, o };
      });
      const ptica = emo(s, String(m.grabljivac || '🐦'), 26);
      const gen = tx(s, 12, 14, '', { a: 'start', v: 12, b: C.zuta });
      // trake udela
      const tr = bj.map((b, i) => {
        const y = 192 + i * 20;
        tx(s, 14, y, b.o || '', { a: 'start', v: 11 });
        el(s, 'rect', { x: 92, y: y - 6, width: 200, height: 12, rx: 3, fill: '#13263a' });
        return { r: el(s, 'rect', { x: 92, y: y - 6, width: 0, height: 12, rx: 3, fill: hex(b.b, '#888') }), n: tx(s, 298, y, '', { a: 'start', v: 11 }) };
      });
      // tok generacija (broj jedinki boje koja se uklapa)
      const GEN = [10, 14, 17], JEDE = [[6, 1], [4, 1], [3, 0]];
      const TG = 4.6;
      const raspored = (k) => Array.from({ length: N }, (_, i) => ((i * 7) % N < k ? kam : 1 - kam));
      return {
        trajanje: TG * 3, pauza: 1.5,
        kadar(t) {
          const gi = Math.min(2, Math.floor(t / TG)), u = t - gi * TG;
          const boje = raspored(GEN[gi]);
          postaviTekst(gen, `~generacija ${gi + 1}`);
          // ko je pojeden u ovoj generaciji: prvo upadljivi, pa jedan uklopljen
          const upadljivi = boje.map((b, i) => (b !== kam ? i : -1)).filter((i) => i >= 0);
          const uklopljeni = boje.map((b, i) => (b === kam ? i : -1)).filter((i) => i >= 0);
          const plen = [...upadljivi.slice(0, JEDE[gi][0]), ...uklopljeni.slice(0, JEDE[gi][1])];
          const tJ = (j) => 0.6 + j * 0.42;
          let px = -30, py = 20;
          telo.forEach((d, i) => {
            const j = plen.indexOf(i);
            const pojeden = j >= 0 && u > tJ(j) + 0.3;
            at(d.o, { fill: boje[i] === 0 ? hex(bj[0].b, '#55c25a') : hex(bj[1].b, '#8d5524') });
            d.g.style.opacity = pojeden ? 0 : u < 0.4 && gi > 0 ? f2(u / 0.4) : 1;
          });
          const j = plen.findIndex((_, k) => u < tJ(k) + 0.42);
          if (j >= 0 && u >= 0.6 - 0.42) {
            const cilj = mesta[plen[j]], pre = j > 0 ? mesta[plen[j - 1]] : [-20, 10], k = glatko(ogr((u - tJ(j) + 0.42) / 0.42, 0, 1));
            px = lerp(pre[0], cilj[0], k); py = lerp(pre[1], cilj[1], k) - 10;
          } else if (u > 0.6) { const k = ogr((u - tJ(plen.length)) / 0.6, 0, 1); const p = mesta[plen[plen.length - 1]]; px = lerp(p[0], 360, k); py = lerp(p[1], -20, k); }
          poz(ptica, px, py);
          const prez = boje.filter((b, i) => !(plen.indexOf(i) >= 0 && u > tJ(plen.indexOf(i)) + 0.3));
          const n0 = prez.filter((b) => b === 0).length, n1 = prez.length - n0;
          [n0, n1].forEach((nn, i) => { at(tr[i].r, { width: f2((nn / N) * 200) }); postaviTekst(tr[i].n, String(nn)); });
        },
      };
    },

    // Ogledi: tip 'krecna-voda' (izdahnuti vazduh muti krečnu vodu), 'sveca' (sveća se gasi u teglici sa
    // proklijalim semenima), 'zvono' (miš pod staklenim zvonom sa biljkom i bez nje).
    ogled(s, m) {
      const tip = izbor(m.tip, ['krecna-voda', 'sveca', 'zvono'], 'krecna-voda');
      const W = 320, H = 230;
      vel(s, W, H);
      const T = 8;
      const nat = m.natpisi !== false;
      if (tip === 'krecna-voda') {
        const case_ = [90, 230].map((x, i) => {
          const tecnost = el(s, 'rect', { x: x - 38, y: 110, width: 76, height: 90, fill: i ? 'rgba(223,230,233,.25)' : 'rgba(116,185,255,.25)' });
          const mutno = el(s, 'rect', { x: x - 38, y: 110, width: 76, height: 90, fill: '#f5f6fa', opacity: 0 });
          put(s, `M${x - 40},70 L${x - 40},202 L${x + 40},202 L${x + 40},70`, { stroke: '#b2bec3', 'stroke-width': 3 });
          put(s, `M${x + 20},28 L${x + 6},190`, { stroke: '#fd79a8', 'stroke-width': 5, 'stroke-linecap': 'round' });
          if (nat) tx(s, x, 216, i ? '~krečna voda' : '~voda iz česme', { v: 11 });
          const mehuri = Array.from({ length: 6 }, (_, k) => ({ c: kr(s, 0, 0, 2.5 + (k % 3), { fill: 'none', stroke: '#dfe6e9', 'stroke-width': 1.2 }), f: k / 6 }));
          return { x, mutno, mehuri, i };
        });
        if (nat) tx(s, 160, 16, '~duvamo izdahnuti vazduh kroz slamčicu', { v: 11, b: C.zuta });
        return {
          trajanje: T, pauza: 1.5,
          kadar(t) {
            const f = ogr(t / T, 0, 1);
            case_.forEach((c) => {
              if (c.i) at(c.mutno, { opacity: f2(0.85 * glatko((f - 0.1) / 0.7)) });
              c.mehuri.forEach((mh, k) => {
                const u = (t * 0.9 + mh.f) % 1;
                at(mh.c, { cx: f2(c.x + 6 + Math.sin(u * 12 + k) * 4), cy: f2(190 - u * 80) });
                mh.c.style.opacity = f2(1 - u);
              });
            });
          },
        };
      }
      if (tip === 'sveca') {
        const tegle = [90, 230].map((x, i) => {
          put(s, `M${x - 42},92 L${x - 42},204 C${x - 42},210 ${x + 42},210 ${x + 42},204 L${x + 42},92`, { stroke: '#b2bec3', 'stroke-width': 3 });
          el(s, 'rect', { x: x - 46, y: 84, width: 30, height: 8, rx: 2, fill: '#8fa3b8', transform: `rotate(-24 ${x - 46} 92)` });
          for (let k = 0; k < 8; k++) {
            const sx = x - 30 + (k % 4) * 20, sy = 196 - Math.floor(k / 4) * 9;
            el(s, 'ellipse', { cx: sx, cy: sy, rx: 8, ry: 5, fill: '#e8d7b0', stroke: '#b59b6a', 'stroke-width': 1 });
            if (i) { put(s, `M${sx + 4},${sy - 3} C${sx + 8},${sy - 10} ${sx + 4},${sy - 16} ${sx + 9},${sy - 20}`, { stroke: '#f5f0e1', 'stroke-width': 1.6 }); el(s, 'ellipse', { cx: sx + 10, cy: sy - 22, rx: 3.5, ry: 2, fill: '#9bd27a' }); }
          }
          if (nat) tx(s, x, 220, i ? '~proklijala semena' : '~suva semena', { v: 11 });
          const g = el(s, 'g');
          lin(g, 0, -70, 0, -14, '#8fa3b8', 2);
          el(g, 'rect', { x: -4, y: -14, width: 8, height: 22, rx: 2, fill: '#f5f6fa' });
          const plamen = el(g, 'path', { d: 'M0,-28 C6,-20 6,-14 0,-12 C-6,-14 -6,-20 0,-28Z', fill: '#ffb142' });
          const dim = put(g, '', { stroke: '#8fa3b8', 'stroke-width': 2, opacity: 0 });
          return { x, i, g, plamen, dim };
        });
        return {
          trajanje: T, pauza: 1.5,
          kadar(t) {
            const f = ogr(t / T, 0, 1), sp = glatko(f / 0.3);
            tegle.forEach((d) => {
              d.g.setAttribute('transform', `translate(${d.x} ${f2(lerp(70, 150, sp))})`);
              const gasi = d.i ? glatko((f - 0.35) / 0.25) : 0;
              const tr = 1 + 0.12 * Math.sin(t * 17 + d.i);
              d.plamen.setAttribute('transform', `scale(${f2((1 - gasi) * tr)})`);
              d.plamen.style.display = gasi >= 1 ? 'none' : '';
              d.dim.style.opacity = gasi >= 1 ? 0.8 : 0;
              at(d.dim, { d: `M0,-14 C${f2(4 * Math.sin(t * 3))},-24 ${f2(-4 * Math.sin(t * 3))},-34 0,-44` });
            });
          },
        };
      }
      // zvono
      const sunce = el(s, 'g'); kr(sunce, 160, 22, 12, { fill: '#ffd166' });
      const zvona = [86, 234].map((x, i) => {
        el(s, 'rect', { x: x - 60, y: 196, width: 120, height: 8, rx: 3, fill: '#8fa3b8' });
        put(s, `M${x - 52},196 L${x - 52},96 C${x - 52},58 ${x + 52},58 ${x + 52},96 L${x + 52},196`, { stroke: '#b2bec3', 'stroke-width': 3, fill: 'rgba(223,230,233,.06)' });
        el(s, 'rect', { x: x - 6, y: 48, width: 12, height: 12, rx: 3, fill: '#b2bec3' });
        const mis = emo(s, '🐁', 30);
        if (i) poz(emo(s, '🪴', 40), x + 22, 172);
        el(s, 'rect', { x: x - 40, y: 82, width: 80, height: 8, rx: 3, fill: '#13263a' });
        const traka = el(s, 'rect', { x: x - 40, y: 82, width: 80, height: 8, rx: 3, fill: B.kiseonik });
        if (nat) tx(s, x, 74, '~kiseonik', { v: 10, b: B.kiseonik });
        if (nat) tx(s, x, 218, i ? '~miš i biljka' : '~samo miš', { v: 11 });
        return { x, i, mis, traka };
      });
      return {
        trajanje: T, pauza: 1.5,
        kadar(t) {
          const f = ogr(t / T, 0, 1);
          zvona.forEach((z) => {
            const o2 = z.i ? 0.85 + 0.1 * Math.sin(t * 2) : 1 - glatko(f / 0.75);
            at(z.traka, { width: f2(80 * o2) });
            const umoran = !z.i && o2 < 0.15;
            poz(z.mis, z.x - (z.i ? 14 : 0) + (umoran ? 0 : 3 * Math.sin(t * 6)), 182, false, umoran ? 80 : 0);
            z.mis.style.opacity = umoran ? 0.55 : 1;
          });
        },
      };
    },

    // Reakcija biljke na dodir: tip 'mimoza' (listići se sklapaju, list se spušta) ili 'muholovka' (klopka se zatvara).
    dodir(s, m) {
      const tip = izbor(m.tip, ['mimoza', 'muholovka'], 'mimoza');
      const W = 320, H = 220;
      vel(s, W, H);
      const prst = emo(s, '👆', 30);
      if (tip === 'mimoza') {
        put(s, 'M40,220 L40,150', { stroke: '#7a5a3f', 'stroke-width': 6 });
        const list = el(s, 'g');
        put(list, 'M0,0 C10,-30 30,-40 60,-46', { stroke: B.stablo, 'stroke-width': 3 }); // drška
        put(list, 'M60,-46 L262,-58', { stroke: B.stablo, 'stroke-width': 2.4 });
        const parovi = Array.from({ length: 11 }, (_, i) => {
          const x = 72 + i * 18.5, y = -46 - (x - 60) * 0.06;
          return [-1, 1].map((sx) => { const e = el(list, 'ellipse', { rx: 4, ry: 11, fill: B.list, stroke: B.list2, 'stroke-width': 1 }); return { e, x, y, sx }; });
        });
        const T = 9;
        return {
          trajanje: T, pauza: 0.6,
          kadar(t) {
            const prstU = glatko(t / 1.2), nazad = glatko((t - 1.6) / 0.6);
            poz(prst, lerp(300, 266, prstU) + 20 * nazad, lerp(20, 80, prstU) - 60 * nazad);
            const pad = glatko((t - 2.6) / 0.6) * (1 - glatko((t - 6) / 2.5));
            list.setAttribute('transform', `translate(40 150) rotate(${f2(pad * 28)})`);
            parovi.forEach((par, i) => {
              const k = glatko((t - 1.3 - (10 - i) * 0.09) / 0.35) * (1 - glatko((t - 5.5 - i * 0.1) / 2));
              par.forEach(({ e, x, y, sx }) => {
                const ug = lerp(0, sx * 70, k);
                e.setAttribute('transform', `translate(${f2(x)} ${f2(y + sx * lerp(11, 4, k))}) rotate(${f2(ug)})`);
              });
            });
          },
        };
      }
      // muholovka
      put(s, 'M160,220 L160,168', { stroke: B.stablo, 'stroke-width': 6 });
      el(s, 'path', { d: 'M160,190 C120,186 90,196 70,214 C100,214 130,206 160,198Z', fill: B.list, stroke: B.list2, 'stroke-width': 1.3 });
      const rez = [-1, 1].map((sx) => {
        const g = el(s, 'g');
        el(g, 'path', { d: `M0,0 C${sx * 18},-6 ${sx * 44},-30 ${sx * 44},-62 C${sx * 30},-72 ${sx * 10},-60 0,-40Z`, fill: '#c0392b', stroke: B.list2, 'stroke-width': 3 });
        for (let k = 0; k < 7; k++) { const u = k / 6, x = lerp(sx * 44, sx * 6, u) + sx * 2, y = lerp(-62, -44, u) - 2; lin(g, x, y, x + sx * 10, y - 9, '#9bd27a', 1.6); }
        return g;
      });
      const muva = emo(s, '🪰', 20);
      const T = 6;
      return {
        trajanje: T, pauza: 1.5,
        kadar(t) {
          const dolazi = glatko(t / 1.6);
          poz(muva, lerp(300, 162, dolazi) + 3 * Math.sin(t * 25) * (1 - dolazi), lerp(30, 118, dolazi) + 3 * Math.cos(t * 23) * (1 - dolazi));
          prst.style.display = 'none';
          const zatv = glatko((t - 2.2) / 0.18);
          rez.forEach((g, i) => g.setAttribute('transform', `translate(160 168) rotate(${f2((i ? 1 : -1) * lerp(-28, 34, zatv) * -1)})`));
        },
      };
    },

    // Oplođenje: spermatozoidi plivaju ka jajnoj ćeliji, jedan ulazi, jedra se spajaju (polovina naslednog
    // materijala od svakog roditelja) i zigot se deli. blizanci: true – posle prve deobe ćelije se razdvajaju.
    oplodjenje(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      const ex = 206, ey = 112, ER = 58;
      const r = slucajni(4);
      const jajna = el(s, 'g');
      for (let i = 0; i < 30; i++) { const a = (i / 30) * Math.PI * 2; kr(jajna, ex + (ER + 7) * Math.cos(a), ey + (ER + 7) * Math.sin(a), 4, { fill: 'rgba(250,177,160,.35)' }); }
      const opna = kr(jajna, ex, ey, ER, { fill: 'rgba(250,177,160,.22)', stroke: '#fab1a0', 'stroke-width': 2.5 });
      const jZ = kr(s, ex + 10, ey - 6, 13, { fill: '#fd79a8', opacity: 0.85 });
      const jM = kr(s, 0, 0, 7, { fill: '#74b9ff', opacity: 0.9 });
      const sp = Array.from({ length: 7 }, (_, i) => {
        const g = el(s, 'g');
        const rep = put(g, '', { stroke: '#dfe6e9', 'stroke-width': 1.4 });
        el(g, 'ellipse', { cx: 0, cy: 0, rx: 5, ry: 3.4, fill: '#dfe6e9' });
        const y0 = 30 + i * 26 + r() * 8, a = Math.atan2(ey - y0, ex - 10);
        const cilj = [ex - ER * Math.cos(a) * 1.02, ey - ER * Math.sin(a) * 1.02 + (i - 3) * 4];
        return { g, rep, y0, cilj, kas: i === 3 ? 0 : 0.25 + r() * 0.5 };
      });
      const delovi = m.natpisi === false ? null : [tx(s, ex, ey + ER + 22, '~jajna ćelija', { v: 11 }), tx(s, 50, 16, '~spermatozoidi', { v: 11 })];
      const status = tx(s, W - 10, 16, '', { a: 'end', v: 12, b: C.zuta });
      const deca = [0, 1].map(() => el(s, 'g'));
      deca.forEach((g) => { kr(g, 0, 0, 1, { fill: 'rgba(253,121,168,.35)', stroke: '#e84393', 'stroke-width': 0.05 }); kr(g, 0, 0, 0.3, { fill: '#a29bfe' }); });
      const bl = !!m.blizanci, T = bl ? 10 : 8.5;
      return {
        trajanje: T, pauza: 1.5,
        kadar(t) {
          sp.forEach((d, i) => {
            const u = glatko(ogr((t - d.kas) / 2.6, 0, 1));
            const pobednik = i === 3;
            let x = lerp(-10, d.cilj[0], u), y = lerp(d.y0, d.cilj[1], u);
            if (pobednik && t > 2.8) { const k = glatko((t - 2.8) / 0.8); x = lerp(d.cilj[0], ex - ER + 8, k); y = d.cilj[1]; }
            const ug = Math.atan2(d.cilj[1] - d.y0, d.cilj[0] + 10);
            d.g.setAttribute('transform', `translate(${f2(x)} ${f2(y)}) rotate(${f2(ug * 180 / Math.PI)})`);
            const q = []; for (let k = 0; k <= 8; k++) q.push([-5 - k * 3.4, Math.sin(t * 16 - k * 0.8) * k * 0.55]);
            at(d.rep, { d: 'M' + q.map((p) => `${f2(p[0])},${f2(p[1])}`).join(' L') });
            d.g.style.opacity = pobednik ? (t > 3.4 ? 0 : 1) : f2(1 - glatko((t - 3.4) / 0.8));
          });
          // jedra se spajaju
          const sp1 = glatko((t - 3.4) / 1.2);
          jM.style.display = t > 3.3 && sp1 < 0.98 ? '' : 'none';
          at(jM, { cx: f2(lerp(ex - ER + 12, ex, sp1)), cy: f2(lerp(ey, ey, sp1)) });
          at(jZ, { cx: f2(lerp(ex + 10, ex, sp1)), cy: f2(lerp(ey - 6, ey, sp1)), fill: sp1 >= 1 ? '#a29bfe' : '#fd79a8' });
          at(opna, { stroke: t > 3.3 && t < 3.8 ? C.zuta : '#fab1a0' });
          const deo = glatko((t - 5.4) / 1.2);
          const raz = bl ? glatko((t - 7) / 1.6) : 0;
          jZ.style.display = deo > 0 ? 'none' : '';
          jajna.style.opacity = f2(1 - 0.75 * raz);
          deca.forEach((g, i) => {
            g.style.display = deo > 0 ? '' : 'none';
            const sx = i ? 1 : -1, R = lerp(ER * 0.9, ER * 0.55, deo);
            g.setAttribute('transform', `translate(${f2(ex + sx * lerp(0, ER * 0.45, deo) + sx * raz * 50)} ${ey}) scale(${f2(R)})`);
          });
          postaviTekst(status, t < 3.3 ? '' : t < 5.2 ? '~oplođenje' : bl && t > 7.2 ? '~jednojajčani blizanci' : '~zigot se deli');
        },
      };
    },

    // Riba sa perajima: delovi ledjno, repno, podrepno, grudno, trbusno, skrge, bocna (bočna linija), krljusti.
    // parna: true – parna peraja (grudna, trbušna) jednom bojom, neparna drugom.
    riba(s, m) {
      const W = 320, H = 200;
      vel(s, W, H);
      const g = el(s, 'g');
      const parna = m.parna, bP = parna ? '#74b9ff' : '#e1b866', bN = parna ? '#fd79a8' : '#e1b866';
      const peraje = (d, b) => el(g, 'path', { d, fill: b, stroke: '#b8860b', 'stroke-width': 1.2, opacity: 0.9 });
      const ledjno = peraje('M128,62 C140,30 178,26 200,52 L190,64Z', bN);
      const podrepno = peraje('M196,132 C206,150 222,152 232,140 L222,128Z', bN);
      const trbusno = peraje('M150,138 C150,158 162,166 172,160 L166,138Z', bP);
      const repG = el(g, 'g');
      const repno = el(repG, 'path', { d: 'M248,100 C262,78 282,58 300,52 C292,76 292,124 300,148 C282,142 262,122 248,100Z', fill: bN, stroke: '#b8860b', 'stroke-width': 1.2, opacity: 0.9 });
      const telo = el(g, 'path', { d: 'M40,100 C56,62 120,52 180,60 C220,66 244,86 252,100 C244,114 220,134 180,140 C120,148 56,138 40,100Z', fill: '#e8a33d', stroke: '#b8860b', 'stroke-width': 2 });
      const kl = el(g, 'g', { opacity: 0.35 });
      for (let x = 110; x < 236; x += 13) for (let y = 74; y < 132; y += 11) put(kl, `M${x},${y} a6,6 0 0,0 0,10`, { stroke: '#8a5a12', 'stroke-width': 1 });
      const skrge = put(g, 'M92,72 C106,88 106,114 92,130', { stroke: '#b8860b', 'stroke-width': 3 });
      const bocna = put(g, 'M98,96 C140,92 190,94 248,100', { stroke: '#5d3a0a', 'stroke-width': 1.6, 'stroke-dasharray': '2 4' });
      const grudnoG = el(g, 'g');
      const grudno = el(grudnoG, 'path', { d: 'M0,0 C10,8 26,14 34,10 C28,4 14,-2 0,0Z', fill: bP, stroke: '#b8860b', 'stroke-width': 1.2 });
      kr(g, 64, 90, 8, { fill: '#fff' }); kr(g, 66, 90, 4, { fill: '#111' });
      put(g, 'M40,102 C44,104 48,104 52,102', { stroke: '#8a5a12', 'stroke-width': 2 });
      const mehuri = [0, 1, 2].map(() => kr(s, 0, 0, 3, { fill: 'none', stroke: '#9fd3ff', 'stroke-width': 1.2 }));
      const delovi = [
        { id: 'ledjno', naziv: '~leđno peraje', ax: 170, ay: 40, lx: 214, ly: 22, sjaj: sjaj(ledjno) },
        { id: 'repno', naziv: '~repno peraje', ax: 294, ay: 136, lx: 308, ly: 158, a: 'end', sjaj: sjaj(repno) },
        { id: 'grudno', naziv: '~grudno peraje', ax: 120, ay: 120, lx: 88, ly: 178, a: 'middle', sjaj: sjaj(grudno) },
        { id: 'trbusno', naziv: '~trbušno peraje', ax: 160, ay: 158, lx: 176, ly: 192, a: 'middle', sjaj: sjaj(trbusno) },
        { id: 'podrepno', naziv: '~podrepno peraje', ax: 218, ay: 146, lx: 264, ly: 176, a: 'middle', sjaj: sjaj(podrepno) },
        { id: 'skrge', naziv: '~škržni poklopac', ax: 102, ay: 80, lx: 60, ly: 30, a: 'middle', sjaj: sjaj(skrge) },
        { id: 'bocna', naziv: '~bočna linija', ax: 200, ay: 96, lx: 260, ly: 92, skriven: true, sjaj: sjaj(bocna) },
        { id: 'krljusti', naziv: '~krljušti', ax: 150, ay: 100, lx: 150, ly: 100, skriven: true },
      ];
      const nat = natpisi(s, m, delovi);
      if (parna) { tx(s, 10, 192, '~parna', { a: 'start', v: 10, b: bP }); tx(s, 60, 192, '~neparna', { a: 'start', v: 10, b: bN }); }
      return {
        kadar(t) {
          repG.setAttribute('transform', `rotate(${f2(10 * Math.sin(t * 4))} 248 100)`);
          grudnoG.setAttribute('transform', `translate(108 116) rotate(${f2(15 + 18 * Math.sin(t * 5))})`);
          g.setAttribute('transform', `translate(0 ${f2(3 * Math.sin(t * 1.6))})`);
          mehuri.forEach((c, i) => { const u = (t * 0.5 + i / 3) % 1; at(c, { cx: f2(34 - u * 10 + Math.sin(u * 9) * 3), cy: f2(96 - u * 90) }); c.style.opacity = f2(1 - u); });
          nat.kadar(t);
        },
      };
    },

    // Svetlosni mikroskop: zrak svetlosti ide od ogledala kroz preparat, objektiv i cev do okulara.
    // Delovi: okular, cev, objektiv, stocic, ogledalo, veliki, mali (zavrtnji), rucica, postolje.
    mikroskop(s, m) {
      const W = 320, H = 236;
      vel(s, W, H);
      const met = '#8fa3b8', tam = '#5d7a96';
      const postolje = el(s, 'path', { d: 'M96,214 L230,214 L222,228 L104,228Z', fill: tam, stroke: met, 'stroke-width': 2 });
      const rucica = el(s, 'path', { d: 'M126,214 L126,196 C104,180 100,120 120,76 L136,70 L140,84 C124,118 124,170 142,190 L142,214Z', fill: tam, stroke: met, 'stroke-width': 2 });
      const stocic = el(s, 'rect', { x: 128, y: 144, width: 104, height: 9, rx: 2, fill: '#3b5068', stroke: met, 'stroke-width': 2 });
      el(s, 'rect', { x: 170, y: 140, width: 26, height: 4, fill: '#dfe6e9', opacity: 0.8 });
      lin(s, 150, 141, 166, 141, met, 2); lin(s, 200, 141, 216, 141, met, 2);
      const ogledalo = el(s, 'ellipse', { cx: 183, cy: 186, rx: 16, ry: 5, fill: '#dfe6e9', stroke: met, 'stroke-width': 2, transform: 'rotate(-12 183 186)' });
      lin(s, 183, 191, 183, 210, met, 3);
      const cev = el(s, 'rect', { x: 172, y: 40, width: 22, height: 62, fill: '#3b5068', stroke: met, 'stroke-width': 2 });
      put(s, 'M136,74 L172,62', { stroke: met, 'stroke-width': 8 });
      el(s, 'rect', { x: 162, y: 100, width: 42, height: 10, rx: 4, fill: tam, stroke: met, 'stroke-width': 2 });
      const objektivi = [[174, 110, 10, 22], [190, 110, 8, 16], [160, 108, 8, 12]].map(([x, y, w, h], i) => el(s, 'rect', { x, y, width: w, height: h, rx: 2, fill: i ? '#3b5068' : '#5d7a96', stroke: met, 'stroke-width': 1.5, transform: i === 2 ? `rotate(25 ${x} ${y})` : i === 1 ? `rotate(-20 ${x} ${y})` : '' }));
      const okular = el(s, 'rect', { x: 175, y: 22, width: 16, height: 20, rx: 2, fill: '#5d7a96', stroke: met, 'stroke-width': 2 });
      const veliki = kr(s, 128, 128, 13, { fill: tam, stroke: met, 'stroke-width': 2 });
      const mali = kr(s, 128, 128, 6, { fill: '#3b5068', stroke: met, 'stroke-width': 2 });
      const crteVel = lin(s, 128, 128, 128, 116, met, 2);
      const zrak = put(s, 'M183,186 L183,110 M183,102 L183,22', { stroke: '#ffeaa7', 'stroke-width': 3, 'stroke-dasharray': '6 6', opacity: 0.9 });
      poz(emo(s, '👁️', 20), 183, 10);
      const delovi = [
        { id: 'okular', naziv: '~okular', ax: 191, ay: 30, lx: 236, ly: 26, sjaj: sjaj(okular) },
        { id: 'cev', naziv: '~cev (tubus)', ax: 194, ay: 70, lx: 236, ly: 64, sjaj: sjaj(cev) },
        { id: 'objektiv', naziv: '~objektiv', ax: 186, ay: 124, lx: 236, ly: 104, sjaj: sjaj(...objektivi) },
        { id: 'stocic', naziv: '~stočić', ax: 230, ay: 148, lx: 252, ly: 144, sjaj: sjaj(stocic) },
        { id: 'ogledalo', naziv: '~ogledalo', ax: 198, ay: 184, lx: 248, ly: 184, sjaj: sjaj(ogledalo) },
        { id: 'veliki', naziv: '~veliki zavrtanj', ax: 116, ay: 122, lx: 88, ly: 104, sjaj: sjaj(veliki) },
        { id: 'mali', naziv: '~mali zavrtanj', ax: 124, ay: 132, lx: 88, ly: 150, sjaj: sjaj(mali) },
        { id: 'rucica', naziv: '~ručica', ax: 112, ay: 170, lx: 88, ly: 182, sjaj: sjaj(rucica) },
        { id: 'postolje', naziv: '~postolje', ax: 110, ay: 222, lx: 84, ly: 222, sjaj: sjaj(postolje) },
      ];
      const nat = natpisi(s, m, delovi);
      return {
        kadar(t) {
          at(zrak, { 'stroke-dashoffset': f2(t * 30) });
          const a = Math.sin(t * 0.8) * 1.4;
          at(crteVel, { x2: f2(128 + 12 * Math.sin(a)), y2: f2(128 - 12 * Math.cos(a)) });
          nat.kadar(t);
        },
      };
    },

    // Stubičasti grafik: stavke [{o:'~slon', v:70, e:'🐘', b:0}], jedinica ('~god.'), naslov, max.
    stubici(s, m) {
      const st = niz(m.stavke).slice(0, 7);
      const W = 320, n = Math.max(1, st.length), H = 34 + n * 32 + 8;
      vel(s, W, H);
      if (m.naslov) tx(s, W / 2, 14, m.naslov, { v: 11, b: '#9fb3c8' });
      const max = br(m.max, Math.max(1, ...st.map((x) => +x.v || 0)));
      const BOJE = ['#74b9ff', '#fd79a8', '#55efc4', '#ffeaa7', '#a29bfe', '#fab1a0', '#81ecec'];
      const x0 = 112, x1 = W - 74;
      const trake = st.map((d, i) => {
        const y = 34 + i * 32;
        if (d.e) poz(emo(s, String(d.e), 20), 14, y + 10);
        tx(s, d.e ? 28 : 8, y + 10, d.o || '', { a: 'start', v: 11 });
        el(s, 'rect', { x: x0, y: y + 2, width: x1 - x0, height: 16, rx: 4, fill: '#13263a' });
        const b = Number.isInteger(d.b) ? BOJE[d.b % 7] : typeof d.b === 'string' ? d.b : BOJE[i % 7];
        const r = el(s, 'rect', { x: x0, y: y + 2, width: 0, height: 16, rx: 4, fill: b });
        const v = tx(s, x0, y + 10, '', { a: 'start', v: 11, b });
        return { r, v, d, i };
      });
      return {
        trajanje: 1 + n * 0.25 + 1, pauza: 3,
        kadar(t) {
          trake.forEach(({ r, v, d, i }) => {
            const u = glatko((t - i * 0.25) / 1);
            const w = ((+d.v || 0) / max) * (x1 - x0) * u;
            at(r, { width: f2(Math.max(0, w)) });
            at(v, { x: f2(x0 + w + 5) });
            const jed = m.jedinica && !d.t ? String(m.jedinica) : '', vr = d.t ?? String(d.v).replace('.', ',');
            postaviTekst(v, u > 0.02 ? (jed.startsWith('~') ? `~${vr} ${jed.slice(1)}` : `${vr}${jed ? ' ' + jed : ''}`) : '');
          });
        },
      };
    },

    // Kretanje vode kroz biljku: koren upija vodu, ona se penje kroz stablo i isparava kroz otvore na listovima.
    transpiracija(s, m) {
      const W = 320, H = 230;
      vel(s, W, H);
      el(s, 'rect', { x: 0, y: 168, width: W, height: H - 168, fill: B.zemlja });
      kr(s, 290, 30, 16, { fill: '#ffd166' });
      for (const d of ['M160,168 C156,186 146,198 128,210', 'M160,168 C164,190 176,200 196,210', 'M160,170 L160,222', 'M150,190 C140,192 128,190 118,196'])
        put(s, d, { stroke: '#e8d5b7', 'stroke-width': 2.2, 'stroke-linecap': 'round' });
      put(s, 'M160,168 L160,60', { stroke: B.stablo, 'stroke-width': 7, 'stroke-linecap': 'round' });
      const listovi = [[160, 130, -1], [160, 104, 1], [160, 80, -1], [160, 62, 1]];
      for (const [x, y, sx] of listovi) el(s, 'path', { d: `M${x},${y} C${x + sx * 14},${y - 22} ${x + sx * 46},${y - 26} ${x + sx * 62},${y - 14} C${x + sx * 46},${y + 4} ${x + sx * 18},${y + 6} ${x},${y}Z`, fill: B.list, stroke: B.list2, 'stroke-width': 1.3 });
      const kapi = Array.from({ length: 9 }, (_, i) => {
        const [lx, ly, sx] = listovi[i % 4];
        return { c: kr(s, 0, 0, 3.2, { fill: B.voda, stroke: '#9fd3ff', 'stroke-width': 0.8 }), p: [[i % 2 ? 128 : 196, 210], [160, 176], [160, ly + 2], [lx + sx * 34, ly - 10]], f: i / 9 };
      });
      const para = Array.from({ length: 8 }, (_, i) => { const [lx, ly, sx] = listovi[i % 4]; return { e: put(s, '', { stroke: '#dfe6e9', 'stroke-width': 1.6, 'stroke-linecap': 'round' }), x: lx + sx * (24 + (i % 3) * 12), y: ly - 12, f: i / 8 }; });
      if (m.natpisi !== false) { tx(s, 300, 186, '~voda iz zemljišta', { a: 'end', v: 11, b: '#74b9ff' }); tx(s, 300, 74, '~vodena para', { a: 'end', v: 11, b: '#dfe6e9' }); }
      return {
        kadar(t) {
          kapi.forEach((k) => { const u = (t * 0.22 + k.f) % 1; const [x, y] = na(k.p, u); at(k.c, { cx: x, cy: y }); k.c.style.opacity = f2(Math.min(1, (1 - u) * 6)); });
          para.forEach((p) => { const u = (t * 0.4 + p.f) % 1, y = p.y - u * 34; at(p.e, { d: `M${p.x},${f2(y)} c3,-4 -3,-8 0,-12` }); p.e.style.opacity = f2(Math.sin(u * Math.PI) * 0.9); });
        },
      };
    },

    // Piramida ishrane (odozdo): žitarice; voće i povrće; mleko, meso, riba i jaja; masti i slatkiši.
    // skrij: indeks nivoa (0 = dno) za „?“.
    piramida(s, m) {
      const W = 320, H = 228;
      vel(s, W, H);
      const NIV = [
        { o: '~žitarice i hleb', e: '🍞🌾🥔🍝', b: '#e1b866' },
        { o: '~voće i povrće', e: '🍎🥕🥦🍐', b: '#55b96a' },
        { o: '~mleko, meso, jaja', e: '🥛🧀🐟🥚', b: '#74b9ff' },
        { o: '~masti i slatkiši', e: '🍬🧈', b: '#fd79a8' },
      ];
      const skrij = lista(m.skrij);
      const vrh = [104, 12], dno = 214, L = 14, D = 194, h = (dno - vrh[1]) / 4;
      const xl = (y) => lerp(vrh[0], L, (y - vrh[1]) / (dno - vrh[1])), xd = (y) => lerp(vrh[0], D, (y - vrh[1]) / (dno - vrh[1]));
      const nivoi = NIV.map((n, i) => {
        const y2 = dno - i * h, y1 = y2 - h;
        const g = el(s, 'g');
        el(g, 'path', { d: `M${f2(xl(y2))},${y2} L${f2(xd(y2))},${y2} L${f2(xd(y1))},${f2(y1)} L${f2(xl(y1))},${f2(y1)}Z`, fill: n.b, opacity: 0.85, stroke: '#0b1826', 'stroke-width': 2 });
        const t = el(g, 'text', { x: 104, y: f2(y1 + h * 0.62), 'font-size': i === 3 ? 14 : 17, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
        t.textContent = i === 3 ? n.e : n.e;
        const sk = skrij.includes(i);
        tx(g, 200, f2(y1 + h / 2), sk ? '?' : n.o, { a: 'start', v: sk ? 16 : 10.5, b: sk ? C.zuta : C.bela });
        return g;
      });
      tx(s, 300, 20, '~najmanje', { a: 'end', v: 10, b: '#9fb3c8' });
      tx(s, 300, 222, '~najviše', { a: 'end', v: 10, b: '#9fb3c8' });
      return {
        trajanje: 3.2, pauza: 3,
        kadar(t) { nivoi.forEach((g, i) => { const u = glatko((t - i * 0.6) / 0.6); g.style.opacity = f2(u); g.setAttribute('transform', `translate(0 ${f2((1 - u) * -12)})`); }); },
      };
    },

    // ─────────── 6. razred ───────────
    // Jednoćelijski organizmi i kolonija. tip: 'ameba' (lažnom nožicom obuhvata hranu; kontraktilna vakuola
    // izbacuje vodu), 'papucica' (treplje), 'euglena' (bič, očna mrlja, hloroplasti; pliva ka svetlu),
    // 'volvoks' (kolonija u obliku šuplje lopte sa kćerkama kolonijama).
    // Delovi – ameba: membrana, jedro, nozica, kontraktilna, hranljiva; papucica: treplje, usta, jedro, kontraktilna;
    // euglena: bic, ocna, hloroplast, jedro; volvoks: jedinka, kcerka.
    protist(s, m) {
      const tip = izbor(m.tip, ['ameba', 'papucica', 'euglena', 'volvoks'], 'ameba');
      const W = 320, H = 220;
      vel(s, W, H);
      const delovi = [];
      let kadar = () => {};
      if (tip === 'ameba') {
        const cx = 140, cy = 112, R = 58;
        const telo = el(s, 'path', { fill: 'rgba(162,155,254,.22)', stroke: '#a29bfe', 'stroke-width': 2 });
        const hrana = kr(s, 0, 0, 7, { fill: '#55efc4', stroke: '#00b894', 'stroke-width': 1.5 });
        const hv = [[118, 136, 9], [158, 84, 7]].map(([x, y, r]) => { const g = el(s, 'g'); kr(g, x, y, r, { fill: 'rgba(255,234,167,.25)', stroke: '#fdcb6e', 'stroke-width': 1.3 }); kr(g, x + 1, y, r * 0.4, { fill: '#55efc4', opacity: 0.6 }); return g; });
        const novaV = kr(s, 0, 0, 11, { fill: 'rgba(255,234,167,.25)', stroke: '#fdcb6e', 'stroke-width': 1.3, opacity: 0 });
        const jed = kr(s, 128, 104, 13, { fill: B.jedro, stroke: '#dcd6ff', 'stroke-width': 2 });
        const kv = kr(s, 100, 80, 6, { fill: 'rgba(116,185,255,.45)', stroke: '#74b9ff', 'stroke-width': 1.5 });
        const kapi = [0, 1, 2].map(() => kr(s, 0, 0, 2.2, { fill: '#74b9ff', opacity: 0 }));
        const zrnca = Array.from({ length: 14 }, (_, i) => kr(s, 0, 0, 1.4, { fill: '#dcd6ff', opacity: 0.6, 'data-i': i }));
        const r0 = slucajni(11), zr = zrnca.map(() => [r0() * 6.28, 12 + r0() * 36, r0() * 6]);
        delovi.push(
          { id: 'membrana', naziv: '~membrana', ax: 140, ay: 54, lx: 150, ly: 18, a: 'middle', sjaj: sjaj(telo) },
          { id: 'jedro', naziv: '~jedro', ax: 124, ay: 112, lx: 30, ly: 150, sjaj: sjaj(jed) },
          { id: 'kontraktilna', naziv: '~kontraktilna vakuola', ax: 98, ay: 78, lx: 18, ly: 34, a: 'start', sjaj: sjaj(kv) },
          { id: 'hranljiva', naziv: '~hranljiva vakuola', ax: 118, ay: 140, lx: 60, ly: 200, a: 'middle', sjaj: sjaj(hv[0].firstChild) },
          { id: 'nozica', naziv: '~lažna nožica', ax: 226, ay: 112, lx: 300, ly: 170, a: 'end', sjaj: sjaj(telo) },
        );
        const T = 7;
        kadar = (t) => {
          const u = (t % T) / T;
          const ispruzi = glatko(u / 0.4) * (1 - glatko((u - 0.62) / 0.25)); // nožica raste pa se povlači
          const hx = lerp(262, 172, glatko((u - 0.42) / 0.3)), hy = lerp(114, 118, glatko((u - 0.42) / 0.3));
          const p = [];
          for (let i = 0; i < 40; i++) {
            const a = (i / 40) * Math.PI * 2;
            const d = Math.atan2(Math.sin(a), Math.cos(a));
            const izb = Math.exp(-(d * d) / 0.18) * 62 * ispruzi + (Math.exp(-((d - 0.55) ** 2) / 0.05) + Math.exp(-((d + 0.55) ** 2) / 0.05)) * 26 * ispruzi;
            const r = R * (1 + 0.06 * Math.sin(3 * a + t * 1.3) + 0.04 * Math.sin(5 * a - t)) + izb;
            p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
          }
          at(telo, { d: glatkaKriva(p) });
          const unutra = u > 0.55;
          at(hrana, { cx: f2(hx), cy: f2(hy), r: unutra ? f2(lerp(7, 4, glatko((u - 0.6) / 0.3))) : 7 });
          at(novaV, { cx: f2(hx), cy: f2(hy), opacity: unutra ? 1 : 0 });
          // kontraktilna vakuola: puni se, pa se isprazni napolje
          const kvU = (t % 3) / 3, rr = kvU < 0.85 ? 3 + 7 * kvU / 0.85 : 10 * (1 - (kvU - 0.85) / 0.15);
          at(kv, { r: f2(Math.max(0.5, rr)) });
          kapi.forEach((k, i) => { const v = kvU > 0.85 ? (kvU - 0.85) / 0.15 : 0; at(k, { cx: f2(100 - 22 * v - i * 4), cy: f2(80 - 22 * v + i * 5), opacity: f2(v ? 1 - v * 0.6 : 0) }); });
          zrnca.forEach((z, i) => { const [a, r, f] = zr[i]; at(z, { cx: f2(cx + 4 + r * Math.cos(a + t * 0.25 + f)), cy: f2(cy + r * 0.8 * Math.sin(a + t * 0.25 + f)) }); });
        };
      } else if (tip === 'papucica') {
        const g = el(s, 'g');
        const N = 56, ob = [];
        for (let i = 0; i < N; i++) {
          const a = (i / N) * Math.PI * 2;
          const uv = Math.sin(a) > 0 ? 1 - 0.22 * Math.exp(-((Math.cos(a) - 0.05) ** 2) / 0.05) : 1; // udubljenje – ćelijska usta
          ob.push([160 + 112 * Math.cos(a), 108 + 40 * Math.sin(a) * uv * (1 - 0.18 * Math.cos(a))]);
        }
        const trep = ob.map(() => lin(g, 0, 0, 0, 0, '#81ecec', 1.3));
        const telo = el(g, 'path', { d: glatkaKriva(ob), fill: 'rgba(129,236,236,.16)', stroke: '#81ecec', 'stroke-width': 2 });
        const usta = put(g, 'M150,140 C158,128 170,126 176,132', { stroke: '#fdcb6e', 'stroke-width': 3, 'stroke-linecap': 'round' });
        const jed = el(g, 'ellipse', { cx: 176, cy: 100, rx: 20, ry: 13, fill: B.jedro, stroke: '#dcd6ff', 'stroke-width': 2 });
        kr(g, 196, 92, 4, { fill: B.jedarce });
        const kvs = [[88, 96], [234, 100]].map(([x, y]) => {
          const k = el(g, 'g');
          for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; lin(k, x, y, x + 11 * Math.cos(a), y + 11 * Math.sin(a), '#74b9ff', 1.5); }
          return { k, c: kr(k, x, y, 5, { fill: 'rgba(116,185,255,.5)', stroke: '#74b9ff', 'stroke-width': 1.5 }), x, y };
        });
        for (const [x, y] of [[120, 118], [210, 122], [140, 92]]) kr(g, x, y, 5, { fill: 'rgba(255,234,167,.3)', stroke: '#fdcb6e', 'stroke-width': 1 });
        delovi.push(
          { id: 'treplje', naziv: '~treplje', ax: 106, ay: 72, lx: 60, ly: 26, a: 'middle', sjaj: sjaj(...trep.slice(30, 40)) },
          { id: 'usta', naziv: '~ćelijska usta', ax: 164, ay: 132, lx: 150, ly: 196, a: 'middle', sjaj: sjaj(usta) },
          { id: 'jedro', naziv: '~jedro', ax: 182, ay: 98, lx: 232, ly: 30, a: 'middle', sjaj: sjaj(jed) },
          { id: 'kontraktilna', naziv: '~kontraktilna vakuola', ax: 234, ay: 108, lx: 312, ly: 186, a: 'end', sjaj: sjaj(kvs[1].c) },
        );
        kadar = (t) => {
          ob.forEach((p, i) => {
            const a = (i / N) * Math.PI * 2, nx = Math.cos(a), ny = Math.sin(a) * 2.6, L = Math.hypot(nx, ny);
            const ugao = 0.6 * Math.sin(i * 0.55 - t * 9);
            const dx = (nx / L) * Math.cos(ugao) - (ny / L) * Math.sin(ugao), dy = (nx / L) * Math.sin(ugao) + (ny / L) * Math.cos(ugao);
            at(trep[i], { x1: f2(p[0]), y1: f2(p[1]), x2: f2(p[0] + dx * 8), y2: f2(p[1] + dy * 8) });
          });
          kvs.forEach((k, i) => { const v = ((t + i * 1.2) % 2.4) / 2.4; k.k.setAttribute('transform', `translate(${k.x} ${k.y}) scale(${f2(v < 0.8 ? 0.5 + v * 0.7 : 1.06 - (v - 0.8) * 4)}) translate(${-k.x} ${-k.y})`); });
          g.setAttribute('transform', `translate(${f2(8 * Math.sin(t * 0.5))} ${f2(3 * Math.sin(t * 0.9))}) rotate(${f2(3 * Math.sin(t * 0.5))} 160 108)`);
        };
      } else if (tip === 'euglena') {
        const sun = el(s, 'g');
        kr(sun, 22, 24, 12, { fill: '#ffd166' });
        for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283; lin(sun, 22 + 16 * Math.cos(a), 24 + 16 * Math.sin(a), 22 + 21 * Math.cos(a), 24 + 21 * Math.sin(a), '#ffd166', 2); }
        const g = el(s, 'g');
        const bic = put(g, '', { stroke: '#81ecec', 'stroke-width': 2.4, 'stroke-linecap': 'round' });
        const telo = el(g, 'path', { d: 'M96,110 C112,84 170,78 220,96 C240,104 250,112 262,124 C244,128 226,132 206,134 C160,140 110,134 96,110Z', fill: 'rgba(85,239,196,.16)', stroke: '#55efc4', 'stroke-width': 2 });
        const hl = [[130, 104], [150, 118], [172, 100], [190, 120], [212, 108], [140, 124], [230, 120]].map(([x, y], i) => el(g, 'ellipse', { cx: x, cy: y, rx: 8, ry: 4.4, transform: `rotate(${(i * 37) % 90 - 30} ${x} ${y})`, fill: B.hloro, stroke: '#7bed9f', 'stroke-width': 1 }));
        const jed = kr(g, 176, 112, 11, { fill: B.jedro, stroke: '#dcd6ff', 'stroke-width': 2 });
        const oko = kr(g, 108, 104, 4.5, { fill: '#ff4d4d', stroke: '#ff9f9f', 'stroke-width': 1.2 });
        delovi.push(
          { id: 'bic', naziv: '~bič', ax: 60, ay: 96, lx: 40, ly: 160, a: 'middle', sjaj: sjaj(bic) },
          { id: 'ocna', naziv: '~očna mrlja', ax: 108, ay: 104, lx: 110, ly: 46, a: 'middle', sjaj: sjaj(oko) },
          { id: 'hloroplast', naziv: '~hloroplasti', ax: 212, ay: 108, lx: 250, ly: 56, a: 'middle', sjaj: sjaj(...hl) },
          { id: 'jedro', naziv: '~jedro', ax: 176, ay: 120, lx: 196, ly: 186, a: 'middle', sjaj: sjaj(jed) },
        );
        kadar = (t) => {
          let d = 'M98,106';
          for (let i = 1; i <= 14; i++) { const x = 98 - i * 5.4, y = 106 - i * 1.6 + Math.sin(i * 0.7 - t * 10) * (2 + i * 0.7); d += ` L${f2(x)},${f2(y)}`; }
          at(bic, { d });
          g.setAttribute('transform', `translate(${f2(6 * Math.sin(t * 0.8))} ${f2(3 * Math.sin(t * 1.3))}) rotate(${f2(-6 + 4 * Math.sin(t * 0.8))} 170 110)`);
          sun.style.opacity = f2(0.75 + 0.25 * talas(t, 0.4));
        };
      } else {
        const cx = 160, cy = 110, R = 88;
        el(s, 'circle', { cx, cy, r: R, fill: 'rgba(85,239,196,.07)', stroke: 'rgba(85,239,196,.35)', 'stroke-width': 1.5 });
        const rr = slucajni(3);
        const tacke3 = Array.from({ length: 150 }, () => { const z = rr() * 2 - 1, a = rr() * 6.283, q = Math.sqrt(1 - z * z); return [q * Math.cos(a), z, q * Math.sin(a)]; });
        const jed = tacke3.map(() => kr(s, 0, 0, 2.6, { fill: '#2ecc71' }));
        const kc = [[-34, -18, 26, 0], [30, 24, 22, 2], [16, -40, 16, 4], [-26, 38, 18, 1]].map(([dx, dy, r, f]) => {
          const g = el(s, 'g');
          const okv = kr(g, 0, 0, r, { fill: 'rgba(46,204,113,.12)', stroke: '#2ecc71', 'stroke-width': 1.2 });
          const pts = Array.from({ length: 14 }, (_, i) => kr(g, 0, 0, 1.7, { fill: '#55efc4' }));
          return { g, okv, pts, dx, dy, r, f };
        });
        const istJed = kr(s, 0, 0, 4.5, { fill: 'none', stroke: '#2ecc71', 'stroke-width': 1.5 });
        delovi.push(
          { id: 'jedinka', naziv: '~jedinka (ćelija)', ax: 238, ay: 70, lx: 300, ly: 18, a: 'end', sjaj: sjaj(istJed) },
          { id: 'kcerka', naziv: '~kćerka kolonija', ax: 118, ay: 88, lx: 20, ly: 30, a: 'start', sjaj: sjaj(kc[0].okv) },
        );
        kadar = (t) => {
          const ug = t * 0.5, cs = Math.cos(ug), sn = Math.sin(ug);
          tacke3.forEach(([x, y, z], i) => {
            const X = x * cs + z * sn, Z = -x * sn + z * cs;
            at(jed[i], { cx: f2(cx + R * X), cy: f2(cy + R * y), r: f2(1.6 + 1.2 * (Z + 1) / 2), opacity: f2(0.35 + 0.65 * (Z + 1) / 2) });
          });
          at(istJed, { cx: f2(cx + R * 0.88 * Math.cos(-0.6)), cy: f2(cy + R * 0.88 * Math.sin(-0.6)) });
          kc.forEach((k) => {
            const x = cx + k.dx * Math.cos(ug * 0.6 + k.f) - 0, y = cy + k.dy;
            k.g.setAttribute('transform', `translate(${f2(x)} ${f2(y)})`);
            k.pts.forEach((p, i) => { const a = (i / 14) * 6.283 + t * 0.8; at(p, { cx: f2(k.r * 0.85 * Math.cos(a)), cy: f2(k.r * 0.85 * Math.sin(a) * 0.9) }); });
          });
        };
      }
      const nat = natpisi(s, m, delovi);
      return { kadar(t) { kadar(t); nat.kadar(t); } };
    },

    // Gljiva. tip: 'pecurka' (micelijum u zemlji, plodno telo – šešir, listići, drška – i spore koje padaju)
    // ili 'budj' (hlebna buđ: hife na hlebu i crne sporangije pune spora).
    // Delovi – pecurka: sesir, listici, drska, micelijum, hife; budj: sporangija, hife, spore.
    gljiva(s, m) {
      const tip = izbor(m.tip, ['pecurka', 'budj'], 'pecurka');
      const W = 320, H = 226;
      vel(s, W, H);
      const delovi = [];
      const r = slucajni(9);
      if (tip === 'pecurka') {
        const tlo = 150;
        el(s, 'rect', { x: 0, y: tlo, width: W, height: H - tlo, fill: B.zemlja });
        for (let i = 0; i < 26; i++) kr(s, r() * W, tlo + 8 + r() * 66, 1.5 + r() * 2, { fill: B.zemlja2 });
        // micelijum: razgranate hife
        const hife = [], duz = [];
        const grana = (x, y, a, d, n) => {
          if (n <= 0 || d < 8) return;
          const x2 = x + d * Math.cos(a), y2 = ogr(y + d * Math.sin(a), tlo + 6, H - 6);
          hife.push(put(s, `M${f2(x)},${f2(y)} Q${f2((x + x2) / 2 + (r() - 0.5) * 10)},${f2((y + y2) / 2 + (r() - 0.5) * 10)} ${f2(x2)},${f2(y2)}`, { stroke: '#f1e9da', 'stroke-width': 1.2, opacity: 0.85 }));
          duz.push(Math.hypot(x2 - x, y2 - y) * 1.15 + 2);
          grana(x2, y2, a + 0.5 + r() * 0.3, d * 0.78, n - 1);
          grana(x2, y2, a - 0.5 - r() * 0.3, d * 0.78, n - 1);
        };
        grana(160, tlo + 4, Math.PI * 0.62, 34, 5);
        grana(160, tlo + 4, Math.PI * 0.38, 34, 5);
        grana(160, tlo + 4, Math.PI * 0.5, 26, 4);
        hife.forEach((h, i) => at(h, { 'stroke-dasharray': f2(duz[i] + 1), 'stroke-dashoffset': f2(duz[i] + 1) }));
        const telo = el(s, 'g');
        const drska = el(telo, 'path', { d: `M150,${tlo} C148,128 150,104 152,88 L168,88 C170,104 172,128 170,${tlo}Z`, fill: '#f5ecd7', stroke: '#c8b48c', 'stroke-width': 1.5 });
        const listici = el(telo, 'g');
        for (let x = 102; x <= 218; x += 6) lin(listici, x, 86, 160 + (x - 160) * 0.35, 92, '#c8a97e', 1);
        const listiciObris = put(telo, 'M98,86 C130,96 190,96 222,86', { stroke: '#c8a97e', 'stroke-width': 2 });
        const sesir = el(telo, 'path', { d: 'M96,86 C100,44 136,30 160,30 C184,30 220,44 224,86 C190,80 130,80 96,86Z', fill: '#c0713b', stroke: '#8e4e22', 'stroke-width': 2 });
        for (const [x, y] of [[130, 52], [176, 46], [200, 66], [150, 68]]) kr(telo, x, y, 3, { fill: '#e3a06b', opacity: 0.7 });
        const spore = Array.from({ length: 16 }, () => ({ e: kr(s, 0, 0, 1.6, { fill: '#e8dccb' }), x: 104 + r() * 112, f: r(), v: 0.6 + r() * 0.5, w: (r() - 0.5) * 40 }));
        const jedna = hife[3] || hife[0];
        delovi.push(
          { id: 'sesir', naziv: '~šešir', ax: 190, ay: 44, lx: 268, ly: 24, a: 'middle', sjaj: sjaj(sesir) },
          { id: 'listici', naziv: '~listići', ax: 206, ay: 88, lx: 280, ly: 110, a: 'middle', sjaj: sjaj(listiciObris) },
          { id: 'drska', naziv: '~drška', ax: 166, ay: 128, lx: 236, ly: 140, a: 'start', sjaj: sjaj(drska) },
          { id: 'micelijum', naziv: '~micelijum', ax: 110, ay: 196, lx: 30, ly: 214, a: 'start', sjaj: sjaj(...hife) },
          { id: 'hife', naziv: '~hife', ax: 228, ay: 192, lx: 300, ly: 214, a: 'end', skriven: true, sjaj: sjaj(jedna) },
          { id: 'spore', naziv: '~spore', ax: 120, ay: 120, lx: 44, ly: 100, a: 'middle', skriven: true },
        );
        const nat = natpisi(s, m, delovi);
        return {
          kadar(t) {
            hife.forEach((h, i) => at(h, { 'stroke-dashoffset': f2((duz[i] + 1) * (1 - glatko(t / 2.2))) }));
            const u = glatko((t - 1.6) / 1.4);
            telo.setAttribute('transform', `translate(160 ${tlo}) scale(${f2(0.2 + 0.8 * u)} ${f2(Math.max(0.01, u))}) translate(-160 ${-tlo})`);
            telo.style.opacity = f2(Math.min(1, u * 3));
            spore.forEach((p) => {
              const k = t < 3 ? -1 : ((t - 3) * 0.35 * p.v + p.f) % 1;
              at(p.e, { cx: f2(p.x + k * p.w), cy: f2(92 + k * 56), opacity: k < 0 ? 0 : f2(1 - k) });
            });
            nat.kadar(t);
          },
        };
      }
      // hlebna buđ
      el(s, 'path', { d: 'M20,170 C20,150 40,146 60,148 L262,148 C284,146 302,150 302,170 L302,210 L20,210Z', fill: '#d9a066', stroke: '#a86b34', 'stroke-width': 2 });
      for (let i = 0; i < 40; i++) kr(s, 30 + r() * 262, 156 + r() * 48, 1 + r() * 2.2, { fill: '#c08850', opacity: 0.8 });
      const korenje = [], niti = [], glave = [];
      const xs = [70, 104, 138, 172, 206, 240, 268];
      xs.forEach((x, i) => {
        const h = 54 + ((i * 37) % 40);
        for (let k = -1; k <= 1; k += 2) korenje.push(put(s, `M${x},150 q${k * 8},10 ${k * 14},22`, { stroke: '#f1e9da', 'stroke-width': 1.2, opacity: 0.8 }));
        niti.push(put(s, `M${x},150 C${x - 6},${150 - h * 0.4} ${x + 6},${150 - h * 0.7} ${x},${150 - h}`, { stroke: '#f1e9da', 'stroke-width': 1.6 }));
        glave.push({ x, y: 150 - h, e: kr(s, x, 150 - h, 8, { fill: '#2d3436', stroke: '#636e72', 'stroke-width': 1.5 }) });
      });
      lin(s, 60, 150, 280, 150, '#f1e9da', 1.4);
      const spore = Array.from({ length: 22 }, () => ({ e: kr(s, 0, 0, 1.5, { fill: '#b2bec3' }), g: Math.floor(r() * 7), f: r(), a: r() * 6.28 }));
      delovi.push(
        { id: 'sporangija', naziv: '~sporangija', ax: glave[1].x + 6, ay: glave[1].y - 4, lx: 70, ly: 18, a: 'middle', sjaj: sjaj(...glave.map((g) => g.e)) },
        { id: 'hife', naziv: '~hife', ax: 240, ay: 120, lx: 300, ly: 64, a: 'end', sjaj: sjaj(...niti) },
        { id: 'spore', naziv: '~spore', ax: 200, ay: 40, lx: 250, ly: 18, a: 'middle', skriven: true },
        { id: 'micelijum', naziv: '~micelijum', ax: 160, ay: 164, lx: 160, ly: 200, a: 'middle', skriven: true, sjaj: sjaj(...korenje) },
      );
      const nat = natpisi(s, m, delovi);
      return {
        kadar(t) {
          const rast = glatko(t / 2);
          niti.forEach((n, i) => n.style.opacity = f2(rast));
          glave.forEach((g) => at(g.e, { r: f2(8 * glatko((t - 1.4) / 1)), cy: g.y }));
          spore.forEach((p) => {
            const G = glave[p.g], k = t < 2.6 ? -1 : ((t - 2.6) * 0.3 + p.f) % 1;
            at(p.e, { cx: f2(G.x + Math.cos(p.a) * 40 * k + 12 * k), cy: f2(G.y - 14 * k + Math.sin(p.a) * 18 * k), opacity: k < 0 ? 0 : f2(1 - k) });
          });
          nat.kadar(t);
        },
      };
    },

    // Srce i krvotok kičmenjaka. tip: 'sisar' (2 pretkomore + 2 komore, dva kruga: plućni i telesni),
    // 'zaba' (2 pretkomore + 1 komora – krv se meša), 'riba' (1 pretkomora + 1 komora, jedan krug kroz škrge).
    // Plavo – krv siromašna kiseonikom, crveno – bogata kiseonikom. Delovi: pretkomora, komora. broj: true – piše broj šupljina.
    srce(s, m) {
      const tip = izbor(m.tip, ['sisar', 'zaba', 'riba'], 'sisar');
      const W = 320, H = 232;
      vel(s, W, H);
      const PL = '#74b9ff', CR = '#ff6b6b', LJ = '#b07cd8';
      const kut = (x, y, w, h, b, n) => { const e = el(s, 'rect', { x, y, width: w, height: h, rx: 10, fill: b, 'fill-opacity': 0.28, stroke: b, 'stroke-width': 2.2 }); if (n) tx(s, x + w / 2, y + h / 2, n, { v: 9, b: '#cfd8e3' }); return e; };
      const gLin = el(s, 'g');
      const okvir = (x, y, w, h, n, b) => { el(s, 'rect', { x, y, width: w, height: h, rx: 8, fill: '#13263a', stroke: b || '#3b5068', 'stroke-width': 1.5 }); tx(s, x + w / 2, y + h / 2, n, { v: 11 }); };
      let put0, boje, kom = [], pk = [], broj;
      if (tip === 'riba') {
        okvir(232, 92, 70, 34, '~škrge', CR);
        okvir(120, 196, 80, 28, '~telo');
        pk = [kut(70, 96, 46, 40, PL)];
        kom = [kut(126, 90, 60, 52, PL)];
        put0 = [[50, 210], [50, 116], [92, 116], [156, 116], [210, 116], [232, 109], [302, 109], [312, 109], [312, 210], [200, 210], [120, 210], [50, 210]];
        boje = [PL, PL, PL, PL, PL, CR, CR, CR, CR, CR, PL];
        broj = 2;
      } else {
        okvir(110, 8, 100, 28, '~pluća', CR);
        okvir(110, 198, 100, 28, '~telo');
        pk = [kut(108, 70, 48, 40, PL), kut(164, 70, 48, 40, CR)];
        if (tip === 'sisar') { kom = [kut(108, 116, 48, 56, PL), kut(164, 116, 48, 56, CR)]; broj = 4; }
        else { kom = [kut(108, 116, 104, 56, LJ)]; broj = 3; }
        // desna pretkomora → (desna) komora → plućna arterija → pluća → plućne vene → leva pretkomora → leva komora → aorta → telo → šuplje vene
        const kx1 = tip === 'sisar' ? 132 : 140, kx2 = tip === 'sisar' ? 188 : 180;
        put0 = [[132, 90], [kx1, 144], [80, 144], [80, 22], [110, 22], [210, 22], [244, 22], [244, 90], [188, 90], [kx2, 144], [262, 144], [262, 212], [210, 212], [110, 212], [56, 212], [56, 90], [132, 90]];
        const sr = tip === 'sisar' ? PL : LJ, sc = tip === 'sisar' ? CR : LJ;
        boje = [PL, sr, sr, sr, CR, CR, CR, CR, CR, sc, sc, sc, PL, PL, PL, PL];
      }
      const linije = [];
      for (let i = 0; i < put0.length - 1; i++) linije.push(lin(gLin, put0[i][0], put0[i][1], put0[i + 1][0], put0[i + 1][1], boje[i], 3));
      // tačka na putu sa bojom segmenta
      let Luk = 0; const dd = [0];
      for (let i = 1; i < put0.length; i++) { Luk += Math.hypot(put0[i][0] - put0[i - 1][0], put0[i][1] - put0[i - 1][1]); dd.push(Luk); }
      const tacka = (u) => { const c = (u % 1) * Luk; let i = 1; while (i < dd.length - 1 && dd[i] < c) i++; const k = (c - dd[i - 1]) / (dd[i] - dd[i - 1] || 1); return [lerp(put0[i - 1][0], put0[i][0], k), lerp(put0[i - 1][1], put0[i][1], k), boje[i - 1]]; };
      const kapi = Array.from({ length: 22 }, (_, i) => ({ e: kr(s, 0, 0, 3.6, { stroke: '#0b1826', 'stroke-width': 1 }), f: i / 22 }));
      const delovi = [
        { id: 'pretkomora', naziv: pk.length > 1 ? '~pretkomore' : '~pretkomora', ax: tip === 'riba' ? 92 : 156, ay: tip === 'riba' ? 98 : 72, lx: tip === 'riba' ? 40 : 312, ly: tip === 'riba' ? 40 : 58, a: tip === 'riba' ? 'middle' : 'end', sjaj: sjaj(...pk) },
        { id: 'komora', naziv: kom.length > 1 ? '~komore' : '~komora', ax: tip === 'riba' ? 170 : 160, ay: tip === 'riba' ? 140 : 168, lx: tip === 'riba' ? 170 : 312, ly: tip === 'riba' ? 170 : 184, a: tip === 'riba' ? 'middle' : 'end', sjaj: sjaj(...kom) },
      ];
      const nat = natpisi(s, m, delovi);
      if (m.broj) tx(s, 8, 14, `~šupljina u srcu: ${broj}`, { a: 'start', v: 11, b: C.zuta });
      const sve = [...pk, ...kom].map((e) => ({ e, x: +e.getAttribute('x') + +e.getAttribute('width') / 2, y: +e.getAttribute('y') + +e.getAttribute('height') / 2 }));
      return {
        kadar(t) {
          const f = (t * 1.1) % 1;
          sve.forEach((k, i) => { const jeP = i < pk.length; const v = jeP ? Math.max(0, Math.sin(f * 6.28)) : Math.max(0, Math.sin((f - 0.25) * 6.28)); k.e.setAttribute('transform', `translate(${k.x} ${k.y}) scale(${f2(1 - 0.08 * v)}) translate(${-k.x} ${-k.y})`); });
          kapi.forEach((k) => { const [x, y, b] = tacka(k.f + t * 0.07); at(k.e, { cx: f2(x), cy: f2(y), fill: b }); });
          nat.kadar(t);
        },
      };
    },

    // Transportni sistem: tip 'zatvoreni' (krv kruži samo kroz srce i krvne sudove) ili 'otvoreni' (srce –
    // leđni sud – izbacuje hemolimfu među organe, pa se ona vraća kroz otvore). Delovi: srce, sudovi, organi.
    krvotok(s, m) {
      const tip = izbor(m.tip, ['zatvoreni', 'otvoreni'], 'zatvoreni');
      const W = 320, H = 200;
      vel(s, W, H);
      const telo = el(s, 'path', { d: 'M24,100 C24,46 90,24 160,24 C230,24 296,46 296,100 C296,154 230,176 160,176 C90,176 24,154 24,100Z', fill: 'rgba(250,177,160,.08)', stroke: '#fab1a0', 'stroke-width': 2 });
      const organi = [[90, 112, 26, 18], [160, 120, 30, 20], [230, 112, 26, 18]].map(([x, y, rx, ry]) => el(s, 'ellipse', { cx: x, cy: y, rx, ry, fill: '#2a3f55', stroke: '#5d7a96', 'stroke-width': 1.5 }));
      const delovi = [];
      const r = slucajni(4);
      if (tip === 'zatvoreni') {
        const pts = [[160, 52], [250, 52], [262, 70], [262, 140], [240, 150], [80, 150], [58, 140], [58, 70], [70, 52], [160, 52]];
        const sudovi = el(s, 'polyline', { points: tacke(pts), fill: 'none', stroke: '#c0392b', 'stroke-width': 7, 'stroke-linejoin': 'round', opacity: 0.55 });
        // kapilari kroz organe
        const kap = [];
        for (const x of [90, 160, 230]) for (let k = -1; k <= 1; k++) kap.push(put(s, `M${x + k * 8},150 C${x + k * 14},${130} ${x - k * 10},${100} ${x + k * 6},52`, { stroke: '#e17055', 'stroke-width': 1.3, opacity: 0.8 }));
        const srce = el(s, 'ellipse', { cx: 160, cy: 52, rx: 16, ry: 12, fill: '#e74c3c', stroke: '#ff9f9f', 'stroke-width': 2 });
        const kapi = Array.from({ length: 26 }, (_, i) => ({ e: kr(s, 0, 0, 2.8, { fill: '#ff6b6b' }), f: i / 26 }));
        delovi.push(
          { id: 'srce', naziv: '~srce', ax: 160, ay: 42, lx: 160, ly: 10, a: 'middle', sjaj: sjaj(srce) },
          { id: 'sudovi', naziv: '~krvni sudovi', ax: 262, ay: 110, lx: 312, ly: 190, a: 'end', sjaj: sjaj(sudovi) },
          { id: 'organi', naziv: '~organi', ax: 90, ay: 112, lx: 40, ly: 190, a: 'middle', sjaj: sjaj(...organi) },
        );
        const nat = natpisi(s, m, delovi);
        return {
          kadar(t) {
            const v = Math.max(0, Math.sin(t * 7));
            srce.setAttribute('transform', `translate(160 52) scale(${f2(1 + 0.15 * v)}) translate(-160 -52)`);
            kapi.forEach((k) => { const [x, y] = na(pts, (k.f + t * 0.06) % 1); at(k.e, { cx: f2(x), cy: f2(y) }); });
            nat.kadar(t);
          },
        };
      }
      const sud = el(s, 'path', { d: 'M54,58 L266,58', stroke: '#fdcb6e', 'stroke-width': 9, 'stroke-linecap': 'round', fill: 'none', opacity: 0.6 });
      for (const x of [110, 160, 210]) kr(s, x, 58, 3, { fill: '#0b1826' });
      const hem = Array.from({ length: 44 }, () => ({ e: kr(s, 0, 0, 2.6, { fill: '#c8e66b', opacity: 0.85 }), f: r(), x: 40 + r() * 240, y: 70 + r() * 90, s: r() }));
      delovi.push(
        { id: 'srce', naziv: '~srce (leđni sud)', ax: 230, ay: 58, lx: 300, ly: 14, a: 'end', sjaj: sjaj(sud) },
        { id: 'hemolimfa', naziv: '~hemolimfa', ax: 130, ay: 150, lx: 60, ly: 192, a: 'middle' },
        { id: 'organi', naziv: '~organi', ax: 230, ay: 112, lx: 270, ly: 192, a: 'middle', sjaj: sjaj(...organi) },
      );
      const nat = natpisi(s, m, delovi);
      return {
        kadar(t) {
          at(sud, { 'stroke-width': f2(8 + 3 * Math.max(0, Math.sin(t * 5))) });
          hem.forEach((h) => {
            const u = (h.f + t * 0.09) % 1;
            let x, y;
            if (u < 0.35) { const k = u / 0.35; x = lerp(266, 54, k); y = 58; } // kroz leđni sud ka glavi
            else if (u < 0.5) { const k = (u - 0.35) / 0.15; x = lerp(54, h.x, k); y = lerp(58, h.y, k); } // izliva se među organe
            else if (u < 0.85) { const k = (u - 0.5) / 0.35; x = h.x + 14 * Math.sin(k * 6 + h.s * 6); y = h.y + 8 * Math.cos(k * 5 + h.s * 4); } // lagano struji
            else { const k = (u - 0.85) / 0.15; x = lerp(h.x, 110 + Math.round(h.s * 2) * 50, k); y = lerp(h.y, 60, k); } // vraća se kroz otvore
            at(h.e, { cx: f2(x), cy: f2(y) });
          });
          nat.kadar(t);
        },
      };
    },

    // Disanje životinja. tip: 'skrge' (voda ulazi na usta, prolazi preko škrga i izlazi ispod škržnog poklopca),
    // 'traheje' (insekt: vazduh ulazi kroz otvore – stigme – u razgranate cevčice), 'koza' (kišna glista:
    // gasovi prolaze kroz vlažnu kožu), 'kese' (ptica: vazdušne kese i pluća – vazduh kroz pluća ide u jednom smeru).
    // Delovi – skrge: usta, skrge, poklopac; traheje: stigme, traheje; koza: koza, kapilari; kese: pluca, kese.
    disanje(s, m) {
      const tip = izbor(m.tip, ['skrge', 'traheje', 'koza', 'kese'], 'skrge');
      const W = 320, H = 210;
      vel(s, W, H);
      const delovi = [];
      const r = slucajni(6);
      let kadar = () => {};
      const O2 = '#74b9ff', CO2 = '#b2bec3';
      if (tip === 'skrge') {
        el(s, 'path', { d: 'M20,104 C30,48 110,30 190,36 L320,40 L320,176 L190,178 C110,182 30,160 20,104Z', fill: '#e8a33d', stroke: '#b8860b', 'stroke-width': 2 });
        kr(s, 64, 82, 9, { fill: '#fff' }); kr(s, 66, 82, 4.5, { fill: '#111' });
        const usta = el(s, 'path', { d: 'M18,104 C24,98 34,98 40,104 C34,110 24,110 18,104Z', fill: '#0b1826', stroke: '#8a5a12', 'stroke-width': 2 });
        const sk = [];
        for (let i = 0; i < 4; i++) {
          const x = 128 + i * 15;
          const g = el(s, 'g');
          put(g, `M${x},62 C${x + 12},90 ${x + 12},124 ${x},152`, { stroke: '#c0392b', 'stroke-width': 3 });
          for (let y = 66; y < 150; y += 6) lin(g, x + 6 * Math.sin(((y - 62) / 90) * Math.PI), y, x + 6 * Math.sin(((y - 62) / 90) * Math.PI) + 9, y + 2, '#ff7675', 1.6);
          sk.push(g.firstChild);
        }
        const pokl = put(s, 'M118,52 C150,74 156,132 118,166', { stroke: '#8a5a12', 'stroke-width': 4, 'stroke-linecap': 'round' });
        const voda = Array.from({ length: 24 }, (_, i) => ({ e: kr(s, 0, 0, 2.6, { fill: O2 }), f: i / 24, y: 70 + r() * 76 }));
        delovi.push(
          { id: 'usta', naziv: '~usta', ax: 22, ay: 106, lx: 26, ly: 160, a: 'middle', sjaj: sjaj(usta) },
          { id: 'skrge', naziv: '~škrge', ax: 160, ay: 100, lx: 250, ly: 22, a: 'middle', sjaj: sjaj(...sk) },
          { id: 'poklopac', naziv: '~škržni poklopac', ax: 132, ay: 150, lx: 210, ly: 198, a: 'middle', sjaj: sjaj(pokl) },
        );
        kadar = (t) => {
          voda.forEach((v) => {
            const u = (v.f + t * 0.16) % 1;
            let x, y;
            if (u < 0.35) { const k = u / 0.35; x = lerp(-4, 100, k); y = lerp(104, v.y, k); }
            else if (u < 0.7) { const k = (u - 0.35) / 0.35; x = lerp(100, 190, k); y = v.y; }
            else { const k = (u - 0.7) / 0.3; x = lerp(190, 214, k); y = lerp(v.y, v.y > 108 ? 196 : 22, k); }
            const posle = u > 0.55; // posle škrga voda je predala kiseonik
            at(v.e, { cx: f2(x), cy: f2(y), fill: posle ? CO2 : O2, r: posle ? 2 : 2.6 });
          });
          at(pokl, { d: `M118,52 C${f2(150 + 6 * Math.sin(t * 4))},74 ${f2(156 + 6 * Math.sin(t * 4))},132 118,166` });
        };
      } else if (tip === 'traheje') {
        const g = el(s, 'g');
        el(g, 'ellipse', { cx: 48, cy: 105, rx: 22, ry: 20, fill: '#6d4c41', stroke: '#a1887f', 'stroke-width': 2 });
        el(g, 'ellipse', { cx: 96, cy: 105, rx: 30, ry: 26, fill: '#6d4c41', stroke: '#a1887f', 'stroke-width': 2 });
        el(g, 'ellipse', { cx: 200, cy: 105, rx: 96, ry: 40, fill: '#6d4c41', stroke: '#a1887f', 'stroke-width': 2 });
        for (let i = 0; i < 3; i++) for (const k of [-1, 1]) put(g, `M${84 + i * 14},${105 + k * 22} l${-14 + i * 6},${k * 34} l${-8},${k * 14}`, { stroke: '#a1887f', 'stroke-width': 3, 'stroke-linejoin': 'round' });
        const glavne = [put(g, 'M70,92 L290,92', { stroke: '#dff9fb', 'stroke-width': 3 }), put(g, 'M70,118 L290,118', { stroke: '#dff9fb', 'stroke-width': 3 })];
        const tr = [...glavne];
        const stig = [];
        const pts = [];
        for (let i = 0; i < 6; i++) {
          const x = 120 + i * 30;
          for (const [y0, y1, ys] of [[92, 70, 66], [118, 140, 144]]) {
            stig.push(kr(g, x, ys, 3.4, { fill: '#0b1826', stroke: '#ffeaa7', 'stroke-width': 1.5 }));
            tr.push(put(g, `M${x},${ys} L${x},${y0}`, { stroke: '#dff9fb', 'stroke-width': 2 }));
            for (const d of [-1, 1]) tr.push(put(g, `M${x},${(y0 + 105) / 2} l${d * 9},${(105 - y0) / 4}`, { stroke: '#dff9fb', 'stroke-width': 1, opacity: 0.8 }));
            pts.push([[x, ys - 10], [x, ys], [x, y0], [x + 14, y0], [x + 18, 105]]);
          }
        }
        const vaz = pts.map((p, i) => ({ e: kr(g, 0, 0, 2.4, { fill: O2 }), p, f: (i * 0.137) % 1 }));
        delovi.push(
          { id: 'stigme', naziv: '~otvori (stigme)', ax: 150, ay: 66, lx: 150, ly: 22, a: 'middle', sjaj: sjaj(...stig) },
          { id: 'traheje', naziv: '~traheje', ax: 240, ay: 118, lx: 260, ly: 190, a: 'middle', sjaj: sjaj(...tr) },
        );
        kadar = (t) => {
          vaz.forEach((v) => { const u = (v.f + t * 0.3) % 1; const [x, y] = na(v.p, u); at(v.e, { cx: f2(x), cy: f2(y), opacity: f2(Math.min(1, (1 - u) * 4)) }); });
          g.setAttribute('transform', `translate(0 ${f2(1.5 * Math.sin(t * 2))})`);
        };
      } else if (tip === 'koza') {
        const telo = el(s, 'path', { d: 'M20,80 C60,60 260,60 300,80 L300,140 C260,160 60,160 20,140Z', fill: '#d98c8c', stroke: '#f3b3b3', 'stroke-width': 3 });
        for (let x = 40; x < 300; x += 22) put(s, `M${x},68 C${x - 4},100 ${x - 4},120 ${x},152`, { stroke: '#b86b6b', 'stroke-width': 1.5 });
        const kap = [];
        for (const y of [86, 134]) kap.push(put(s, `M24,${y} C100,${y + (y < 100 ? 6 : -6)} 220,${y + (y < 100 ? 6 : -6)} 296,${y}`, { stroke: '#c0392b', 'stroke-width': 2.5 }));
        const sluz = Array.from({ length: 10 }, (_, i) => kr(s, 30 + i * 28, 70 - (i % 2) * 3, 2.5, { fill: '#a5d8ff', opacity: 0.6 }));
        const g = Array.from({ length: 16 }, (_, i) => ({ e: kr(s, 0, 0, 3, { stroke: '#0b1826', 'stroke-width': 1 }), x: 30 + (i % 8) * 36 + r() * 10, gore: i < 8, ok: i % 2 === 0, f: r() }));
        delovi.push(
          { id: 'koza', naziv: '~vlažna koža', ax: 120, ay: 64, lx: 120, ly: 22, a: 'middle', sjaj: sjaj(telo) },
          { id: 'kapilari', naziv: '~krvni sudovi', ax: 230, ay: 132, lx: 250, ly: 190, a: 'middle', sjaj: sjaj(...kap) },
        );
        kadar = (t) => {
          g.forEach((c) => {
            const u = (c.f + t * 0.25) % 1;
            const yS = c.gore ? 34 : 186, yK = c.gore ? 88 : 132;
            const [y1, y2] = c.ok ? [yS, yK] : [yK, yS];
            at(c.e, { cx: f2(c.x + 4 * Math.sin(u * 6)), cy: f2(lerp(y1, y2, u)), fill: c.ok ? O2 : CO2, opacity: f2(Math.min(1, u * 5, (1 - u) * 5)) });
          });
          sluz.forEach((e, i) => e.style.opacity = f2(0.3 + 0.4 * talas(t + i * 0.3, 0.5)));
        };
      } else {
        el(s, 'path', { d: 'M40,120 C40,70 100,50 170,52 C240,54 280,80 290,120 C280,160 230,176 170,176 C100,176 40,166 40,120Z', fill: 'rgba(223,230,233,.08)', stroke: '#dfe6e9', 'stroke-width': 2 });
        el(s, 'path', { d: 'M40,110 C24,96 12,92 4,96 C12,104 22,112 40,118Z', fill: '#dfe6e9', opacity: 0.5 });
        put(s, 'M20,96 C40,96 60,100 100,110', { stroke: '#dff9fb', 'stroke-width': 3 });
        const pl = el(s, 'ellipse', { cx: 140, cy: 108, rx: 26, ry: 14, fill: '#ff7675', stroke: '#ff9f9f', 'stroke-width': 2 });
        const kesaZ = el(s, 'ellipse', { cx: 222, cy: 128, rx: 46, ry: 30, fill: 'rgba(116,185,255,.18)', stroke: '#74b9ff', 'stroke-width': 2 });
        const kesaP = el(s, 'ellipse', { cx: 92, cy: 136, rx: 28, ry: 20, fill: 'rgba(116,185,255,.18)', stroke: '#74b9ff', 'stroke-width': 2 });
        const p1 = [[20, 96], [100, 110], [176, 116], [222, 128]], p2 = [[222, 128], [166, 108], [114, 106], [92, 136], [60, 110], [20, 98]];
        const vaz = Array.from({ length: 14 }, (_, i) => ({ e: kr(s, 0, 0, 2.6, { fill: O2 }), f: i / 14 }));
        delovi.push(
          { id: 'pluca', naziv: '~pluća', ax: 140, ay: 96, lx: 150, ly: 24, a: 'middle', sjaj: sjaj(pl) },
          { id: 'kese', naziv: '~vazdušne kese', ax: 240, ay: 154, lx: 250, ly: 200, a: 'middle', sjaj: sjaj(kesaZ, kesaP) },
        );
        kadar = (t) => {
          const udah = 0.5 + 0.5 * Math.sin(t * 2);
          at(kesaZ, { rx: f2(38 + 10 * udah), ry: f2(24 + 7 * udah) });
          at(kesaP, { rx: f2(22 + 7 * (1 - udah)), ry: f2(16 + 5 * (1 - udah)) });
          vaz.forEach((v) => { const u = (v.f + t * 0.12) % 1; const [x, y] = u < 0.5 ? na(p1, u * 2) : na(p2, (u - 0.5) * 2); at(v.e, { cx: f2(x), cy: f2(y), fill: u < 0.62 ? O2 : CO2 }); });
        };
      }
      const nat = natpisi(s, m, delovi);
      return { kadar(t) { kadar(t); nat.kadar(t); } };
    },

    // Zubi sisara (bočno): sekutići, očnjaci, pretkutnjaci, kutnjaci; vilica se otvara i zatvara.
    // tip: 'covek' | 'mesojed' (dugi očnjaci, sečivasti kutnjaci) | 'biljojed' (bez očnjaka, široki kutnjaci).
    // Delovi: sekutici, ocnjaci, pretkutnjaci, kutnjaci.
    zubi(s, m) {
      const tip = izbor(m.tip, ['covek', 'mesojed', 'biljojed'], 'covek');
      const W = 320, H = 200;
      vel(s, W, H);
      const BOJE = { sekutici: '#ffeaa7', ocnjaci: '#fab1a0', pretkutnjaci: '#81ecec', kutnjaci: '#a29bfe' };
      const raspored = {
        covek: [['sekutici', 2], ['ocnjaci', 1], ['pretkutnjaci', 2], ['kutnjaci', 3]],
        mesojed: [['sekutici', 3], ['ocnjaci', 1], ['pretkutnjaci', 4], ['kutnjaci', 2]],
        biljojed: [['sekutici', 3], [null, 1], ['pretkutnjaci', 3], ['kutnjaci', 3]],
      }[tip];
      const gorG = el(s, 'g'), donG = el(s, 'g');
      el(gorG, 'path', { d: 'M24,92 C24,60 60,40 140,40 L300,46 L300,92Z', fill: '#2a3f55', stroke: '#5d7a96', 'stroke-width': 2 });
      el(donG, 'path', { d: 'M24,108 C26,140 70,160 140,160 L300,150 L300,108Z', fill: '#2a3f55', stroke: '#5d7a96', 'stroke-width': 2 });
      const grupe = { sekutici: [], ocnjaci: [], pretkutnjaci: [], kutnjaci: [] };
      let x = 30;
      for (const [vr, n] of raspored) {
        for (let i = 0; i < n; i++) {
          if (!vr) { x += 26; continue; }
          const sir = vr === 'kutnjaci' ? (tip === 'biljojed' ? 30 : 26) : vr === 'pretkutnjaci' ? 22 : vr === 'ocnjaci' ? 18 : 15;
          const vis = vr === 'ocnjaci' ? (tip === 'mesojed' ? 34 : 20) : vr === 'sekutici' ? 18 : 14;
          for (const [gg, y0, sm] of [[gorG, 92, 1], [donG, 108, -1]]) {
            let d;
            if (vr === 'ocnjaci') d = `M${x},${y0} L${x + sir},${y0} L${x + sir * 0.55},${y0 + sm * vis}Z`;
            else if (vr === 'sekutici') d = `M${x},${y0} L${x + sir},${y0} L${x + sir - 2},${y0 + sm * vis} L${x + 2},${y0 + sm * vis}Z`;
            else if (tip === 'mesojed' && vr !== 'sekutici') d = `M${x},${y0} L${x + sir},${y0} L${x + sir * 0.8},${y0 + sm * vis} L${x + sir * 0.55},${y0 + sm * (vis - 5)} L${x + sir * 0.3},${y0 + sm * vis}Z`;
            else d = `M${x},${y0} L${x + sir},${y0} L${x + sir},${y0 + sm * vis} L${x + sir * 0.66},${y0 + sm * (vis - 3)} L${x + sir * 0.33},${y0 + sm * vis} L${x},${y0 + sm * (vis - 3)}Z`;
            grupe[vr].push(el(gg, 'path', { d, fill: BOJE[vr], stroke: '#0b1826', 'stroke-width': 1.2 }));
          }
          x += sir + 3;
        }
      }
      const sred = (v) => { const e = grupe[v]; if (!e.length) return null; const b = e.map((q) => q.getAttribute('d').match(/M([\d.]+)/)[1]); return (+b[0] + +b[b.length - 1]) / 2 + 8; };
      const delovi = [];
      const lab = [['sekutici', '~sekutići', 18], ['ocnjaci', '~očnjaci', 18], ['pretkutnjaci', '~pretkutnjaci', 190], ['kutnjaci', '~kutnjaci', 190]];
      lab.forEach(([id, n, ly], i) => { const xx = sred(id); if (xx === null) return; delovi.push({ id, naziv: n, ax: xx, ay: ly < 100 ? 96 : 112, lx: ogr(xx + (i % 2 ? 14 : -10), 30, 290), ly, a: 'middle', sjaj: sjaj(...grupe[id]) }); });
      if (tip === 'biljojed') tx(s, 112, 100, '~bezubi prostor', { v: 9, b: '#9fb3c8' });
      const nat = natpisi(s, m, delovi);
      return {
        kadar(t) {
          const u = Math.max(0, Math.sin(t * 1.6));
          donG.setAttribute("transform", `rotate(${f2(-8 * u)} 300 108)`);
          gorG.setAttribute("transform", `rotate(${f2(4 * u)} 300 92)`);
          nat.kadar(t);
        },
      };
    },

    // Nasledni materijal pri deobi. tip: 'telesna' (deoba telesne ćelije: 2 ćelije sa istim hromozomima)
    // ili 'polna' (nastanak polnih ćelija: 4 ćelije sa polovinom naslednog materijala, različite kombinacije).
    // Crveno – hromozomi od majke, plavo – od oca.
    hromozomi(s, m) {
      const tip = izbor(m.tip, ['telesna', 'polna'], 'telesna');
      const W = 320, H = 210;
      vel(s, W, H);
      const CR = '#ff7675', PL = '#74b9ff';
      const cel = [0, 1, 2, 3].map(() => el(s, 'ellipse', { fill: 'rgba(250,177,160,.08)', stroke: '#fab1a0', 'stroke-width': 1.8 }));
      // hromozomi: [boja, dužina, par] – svaki ima dve sestrinske niti
      const hr = [[CR, 34, 0], [PL, 34, 0], [CR, 20, 1], [PL, 20, 1]].map(([b, L, par]) => ({ b, L, par, n: [lin(s, 0, 0, 0, 0, b, 5), lin(s, 0, 0, 0, 0, b, 5)], c: kr(s, 0, 0, 2.6, { fill: '#fff' }) }));
      const natpis = tx(s, W / 2, H - 10, '', { v: 11, b: C.zuta });
      // kadrovi: položaj [x, y] svake niti (8 niti: hromozom*2 + sestra), ćelije [cx, cy, rx, ry]
      const pocetak = [[136, 86], [176, 92], [148, 126], [182, 124]];
      const K = [];
      const dupl = (P, d) => P.flatMap(([x, y]) => [[x - d, y], [x + d, y]]);
      K.push({ n: dupl(pocetak, 0), c: [[160, 105, 70, 62]], t: '~ćelija: 4 hromozoma' });
      K.push({ n: dupl(pocetak, 4), c: [[160, 105, 70, 62]], t: '~hromozomi se udvostruče' });
      if (tip === 'telesna') {
        K.push({ n: dupl([[160, 58], [160, 98], [160, 132], [160, 158]], 4), c: [[160, 105, 72, 62]], t: '~poređaju se u sredini' });
        K.push({ n: [-18, -6, 6, 18].flatMap((o) => [[78 + o, 100], [242 + o, 100]]), c: [[78, 102, 58, 62], [242, 102, 58, 62]], t: '~2 ćelije – isti nasledni materijal' });
      } else {
        K.push({ n: dupl([[150, 74], [170, 74], [150, 130], [170, 130]], 4), c: [[160, 105, 72, 62]], t: '~parovi hromozoma se poređaju' });
        K.push({ n: [[80, 74], [240, 74], [240, 130], [80, 130]].flatMap(([x, y]) => [[x - 4, y], [x + 4, y]]), c: [[80, 105, 52, 66], [240, 105, 52, 66]], t: '~parovi se razdvoje' });
        K.push({ n: [[38, 48], [122, 48], [282, 48], [198, 48], [198, 82], [282, 82], [38, 82], [122, 82]], c: [[38, 64, 32, 46], [282, 64, 32, 46], [122, 64, 32, 46], [198, 64, 32, 46]], t: '~4 polne ćelije – pola naslednog materijala' });
      }
      const DUR = 1.8, T = (K.length - 1) * DUR;
      return {
        trajanje: T, pauza: 2.5,
        kadar(t) {
          const i = Math.min(K.length - 2, Math.floor(t / DUR)), u = glatko((t - i * DUR - 0.5) / (DUR - 0.5));
          const A = K[i], Bk = K[i + 1];
          const kraj = t >= T;
          hr.forEach((h, j) => {
            [0, 1].forEach((s2) => {
              const k = j * 2 + s2;
              const p = kraj ? Bk.n[k] : [lerp(A.n[k][0], Bk.n[k][0], u), lerp(A.n[k][1], Bk.n[k][1], u)];
              at(h.n[s2], { x1: f2(p[0]), y1: f2(p[1] - h.L / 2), x2: f2(p[0]), y2: f2(p[1] + h.L / 2) });
            });
            const p0 = h.n[0], p1 = h.n[1];
            const dx = Math.abs(+p0.getAttribute('x1') - +p1.getAttribute('x1'));
            at(h.c, { cx: f2((+p0.getAttribute('x1') + +p1.getAttribute('x1')) / 2), cy: f2((+p0.getAttribute('y1') + +p0.getAttribute('y2')) / 2), opacity: dx > 1 && dx < 12 ? 1 : 0 });
          });
          cel.forEach((c, j) => {
            const a = A.c[j % A.c.length], b = Bk.c[j % Bk.c.length];
            const vid = j < Math.max(A.c.length, Bk.c.length);
            const q = kraj ? b : a.map((v, z) => lerp(v, b[z], u));
            at(c, { cx: f2(q[0]), cy: f2(q[1]), rx: f2(q[2]), ry: f2(q[3]) });
            c.style.display = vid ? '' : 'none';
          });
          postaviTekst(natpis, (u > 0.5 || kraj ? Bk : A).t);
        },
      };
    },

    // Ćelijsko disanje u mitohondriji: šećer i kiseonik ulaze, izlaze ugljen-dioksid i voda i oslobađa se energija.
    // skrij: ['secer' | 'kiseonik' | 'ugljen-dioksid' | 'voda' | 'energija'] – umesto naziva „?“. jednacina: false – bez jednačine.
    mitohondrija(s, m) {
      const W = 320, H = 210;
      vel(s, W, H);
      const skrij = lista(m.skrij);
      const ime = (id, n) => (skrij.includes(id) ? '?' : n);
      el(s, 'ellipse', { cx: 160, cy: 96, rx: 78, ry: 46, fill: 'rgba(253,203,110,.18)', stroke: B.mito, 'stroke-width': 3 });
      put(s, 'M96,96 C100,70 108,70 112,96 C116,122 124,122 128,96 C132,70 140,70 144,96 C148,122 156,122 160,96 C164,70 172,70 176,96 C180,122 188,122 192,96 C196,70 204,70 208,96 C212,122 220,122 224,96', { stroke: '#e17055', 'stroke-width': 2.5 });
      tx(s, 160, 156, '~mitohondrija', { v: 10, b: '#9fb3c8' });
      const tok = (pts, b, n, rr) => Array.from({ length: n }, (_, i) => ({ g: cestica(s, b, '', rr), pts, f: i / n }));
      const sve = [
        ...tok([[10, 50], [70, 70], [120, 92]], B.secer, 3, 4.5),
        ...tok([[10, 140], [70, 120], [120, 102]], B.kiseonik, 3, 4.5),
        ...tok([[200, 92], [250, 70], [310, 50]], B.ugljen, 3, 4.5),
        ...tok([[200, 102], [250, 120], [310, 140]], B.voda, 3, 4),
      ];
      const munje = [0, 1, 2].map((i) => { const g = emo(s, '⚡', 18); return g; });
      tx(s, 12, 34, ime('secer', '~šećer'), { a: 'start', v: 11, b: B.secer });
      tx(s, 12, 160, ime('kiseonik', '~kiseonik'), { a: 'start', v: 11, b: B.kiseonik });
      tx(s, 308, 34, ime('ugljen-dioksid', '~ugljen-dioksid'), { a: 'end', v: 11, b: B.ugljen });
      tx(s, 308, 160, ime('voda', '~voda'), { a: 'end', v: 11, b: '#74b9ff' });
      tx(s, 160, 18, ime('energija', '~energija'), { v: 12, b: C.zuta });
      const bez = (id, n) => ime(id, n).replace(/^~/, '');
      if (m.jednacina !== false) tx(s, 160, 190, `~${bez('secer', '~šećer')} + ${bez('kiseonik', '~kiseonik')} → ${bez('ugljen-dioksid', '~ugljen-dioksid')} + ${bez('voda', '~voda')} + ${bez('energija', '~energija')}`, { v: 9.5, b: '#cfd8e3' });
      return {
        kadar(t) {
          for (const c of sve) { const u = (t * 0.3 + c.f) % 1; const [x, y] = na(c.pts, u); c.g.setAttribute('transform', `translate(${f2(x)} ${f2(y)})`); c.g.style.opacity = f2(Math.min(1, u * 6, (1 - u) * 6)); }
          munje.forEach((g, i) => { const u = (t * 0.6 + i / 3) % 1; poz(g, 130 + i * 30, 70 - u * 40); g.style.opacity = f2(Math.sin(u * Math.PI)); });
        },
      };
    },

    // Spratovnost u listopadnoj šumi: visoko drveće, nisko drveće, žbunje, zeljaste biljke, prizemni sprat
    // (mahovine, gljive, stelja). Svetlost slabi naniže. Delovi (istakni): drvece, nisko, zbunje, zeljaste, prizemni.
    spratovi(s, m) {
      const W = 320, H = 226;
      vel(s, W, H);
      const r = slucajni(8);
      const zraci = [0, 1, 2, 3].map((i) => lin(s, 20 + i * 52, -10, 60 + i * 52, 200, '#ffd166', 16));
      el(s, 'rect', { x: 0, y: 200, width: 214, height: 26, fill: B.zemlja });
      const g = {};
      const kruna = (gg, x, y, rx, ry, b) => el(gg, 'ellipse', { cx: x, cy: y, rx, ry, fill: b, stroke: '#1e6b3a', 'stroke-width': 1.5 });
      g.drvece = el(s, 'g');
      for (const [x, y, rx] of [[40, 34, 40], [120, 28, 44], [190, 36, 34]]) { el(g.drvece, 'rect', { x: x - 4, y: y + 10, width: 8, height: 200 - y - 10, fill: '#6d4c41' }); kruna(g.drvece, x, y, rx, 24, '#27ae60'); }
      g.nisko = el(s, 'g');
      for (const [x, y] of [[80, 92], [160, 96]]) { el(g.nisko, 'rect', { x: x - 3, y, width: 6, height: 200 - y, fill: '#8d6e63' }); kruna(g.nisko, x, y, 22, 15, '#2ecc71'); }
      g.zbunje = el(s, 'g');
      for (const x of [26, 112, 196]) for (let k = 0; k < 3; k++) kruna(g.zbunje, x + (k - 1) * 12, 150 - (k === 1 ? 6 : 0), 13, 11, '#55b96a');
      g.zeljaste = el(s, 'g');
      for (let i = 0; i < 14; i++) { const x = 8 + i * 15 + r() * 6; put(g.zeljaste, `M${f2(x)},200 C${f2(x - 2)},188 ${f2(x + 3)},182 ${f2(x + 1)},176`, { stroke: '#7bed9f', 'stroke-width': 2 }); if (i % 3 === 0) kr(g.zeljaste, x + 1, 175, 3, { fill: i % 2 ? '#fdcb6e' : '#fd79a8' }); }
      g.prizemni = el(s, 'g');
      for (let i = 0; i < 18; i++) kr(g.prizemni, 6 + i * 11.5, 199, 4, { fill: '#2d8a47' });
      for (const x of [60, 140]) { el(g.prizemni, 'rect', { x: x - 1.5, y: 192, width: 3, height: 7, fill: '#f5ecd7' }); el(g.prizemni, 'path', { d: `M${x - 6},193 C${x - 6},186 ${x + 6},186 ${x + 6},193Z`, fill: '#c0713b' }); }
      const ns = [['drvece', '~visoko drveće', 30], ['nisko', '~nisko drveće', 94], ['zbunje', '~žbunje', 146], ['zeljaste', '~zeljaste biljke', 178], ['prizemni', '~prizemni sprat', 204]];
      const ist = lista(m.istakni), pokazi = m.natpisi ?? !ist.length;
      const okv = {};
      ns.forEach(([id, n, y]) => {
        const je = ist.includes(id);
        lin(s, 218, y, 228, y, je ? C.zuta : '#5d7a96', 1.5);
        if (je) { kr(s, 240, y, 10, { fill: C.zuta }); tx(s, 240, y + 0.5, '?', { v: 14, b: C.pozadina, obrub: false }); okv[id] = g[id]; }
        else if (pokazi) tx(s, 232, y, n, { a: 'start', v: 10.5 });
      });
      const listovi = [g.drvece, g.nisko, g.zbunje];
      return {
        kadar(t) {
          zraci.forEach((z, i) => { z.style.opacity = f2(0.08 + 0.06 * Math.sin(t + i)); });
          listovi.forEach((e, i) => e.setAttribute('transform', `translate(${f2(1.5 * Math.sin(t * 1.2 + i))} 0)`));
          for (const id in okv) okv[id].style.opacity = f2(0.55 + 0.45 * talas(t, 0.8));
        },
      };
    },

    // Ekološka piramida (piramida ishrane): proizvođači na dnu, potrošači I, II i III reda iznad; ukupna masa
    // opada naviše, a na svaki sledeći nivo prelazi samo mali deo energije. nivoi: [{e:'🌾', o:'~trava'}, …] (odozdo,
    // 3–4); skrij: indeks nivoa za „?“; energija: true – strelice sa „10%“.
    ekopiramida(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      const pod = [{ e: '🌾🌿', o: '~proizvođači' }, { e: '🐇🐛', o: '~potrošači 1. reda' }, { e: '🦊🐸', o: '~potrošači 2. reda' }, { e: '🦅', o: '~potrošači 3. reda' }];
      const nv = niz(m.nivoi).length ? niz(m.nivoi).slice(0, 4) : pod;
      const n = nv.length, skrij = lista(m.skrij);
      const dno = 206, vrh = 14, h = (dno - vrh) / n, L = 14, D = 206, cx = (L + D) / 2;
      const boje = ['#27ae60', '#f39c12', '#e67e22', '#c0392b'];
      const xl = (y) => lerp(cx, L, (y - vrh) / (dno - vrh)), xd = (y) => lerp(cx, D, (y - vrh) / (dno - vrh));
      const gr = nv.map((c, i) => {
        const y2 = dno - i * h, y1 = y2 - h;
        const g = el(s, 'g');
        el(g, 'path', { d: `M${f2(xl(y2))},${f2(y2)} L${f2(xd(y2))},${f2(y2)} L${f2(xd(y1))},${f2(y1)} L${f2(xl(y1))},${f2(y1)}Z`, fill: boje[i], opacity: 0.8, stroke: '#0b1826', 'stroke-width': 2 });
        const sk = skrij.includes(i);
        const t = el(g, 'text', { x: cx, y: f2(y1 + h * 0.56), 'font-size': i === n - 1 ? 15 : 17, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
        t.textContent = sk ? '' : c.e || '';
        if (sk) tx(g, cx, y1 + h * 0.56, '?', { v: 18, b: C.zuta });
        tx(g, 216, f2(y1 + h / 2), sk ? '?' : c.o || '', { a: 'start', v: sk ? 15 : 10, b: sk ? C.zuta : C.bela });
        return g;
      });
      if (m.energija) for (let i = 0; i < n - 1; i++) { const y = dno - (i + 1) * h; tx(s, 22, y, '10%', { a: 'start', v: 9, b: C.zuta }); strelica(s, C.zuta, 2).set(16, y + 10, 16, y - 10); }
      return {
        trajanje: n * 0.7 + 0.5, pauza: 3,
        kadar(t) { gr.forEach((g, i) => { const u = glatko((t - i * 0.6) / 0.6); g.style.opacity = f2(u); g.setAttribute('transform', `translate(0 ${f2((1 - u) * -10)})`); }); },
      };
    },

    // Linijski grafik koji se iscrtava: serije [{o:'~zečevi', b:'#74b9ff', v:[…]}, …] (do 3), x: ['2010', …] (oznake),
    // naslov, jedinica (natpis uz y-osu), max, min.
    krive(s, m) {
      const W = 320, H = 210;
      vel(s, W, H);
      const ser = niz(m.serije).slice(0, 3).map((x, i) => ({ o: x.o || '', b: x.b || ['#74b9ff', '#ff7675', '#55efc4'][i], v: niz(x.v).map((v) => br(v, 0)) }));
      if (!ser.length) return { kadar() {} };
      const N = Math.max(...ser.map((x) => x.v.length));
      const sve = ser.flatMap((x) => x.v);
      const mx = br(m.max, Math.max(...sve) * 1.1 || 1), mn = br(m.min, Math.min(0, ...sve));
      const x0 = 40, x1 = 308, y0 = 172, y1 = m.naslov ? 34 : 16;
      lin(s, x0, y0, x1, y0, '#5d7a96', 1.5); lin(s, x0, y0, x0, y1 - 6, '#5d7a96', 1.5);
      const X = (i) => x0 + 8 + (i * (x1 - x0 - 16)) / Math.max(1, N - 1), Y = (v) => y0 - ((v - mn) / (mx - mn || 1)) * (y0 - y1);
      const oznaka = (v) => (mx - mn < 8 ? v.toFixed(1).replace('.', ',') : String(Math.round(v)));
      for (let k = 0; k <= 4; k++) { const v = mn + ((mx - mn) * k) / 4, y = Y(v); lin(s, x0 - 3, y, x1, y, '#22384d', 1); tx(s, x0 - 5, y, oznaka(v), { a: 'end', v: 8.5, b: '#9fb3c8' }); }
      const xo = niz(m.x);
      const korak = Math.ceil(N / 7);
      xo.forEach((o, i) => { if (i % korak === 0 || i === N - 1) tx(s, X(i), y0 + 11, String(o), { v: 8.5, b: '#9fb3c8' }); });
      if (m.naslov) tx(s, W / 2, 12, m.naslov, { v: 11, b: C.zuta });
      if (m.jedinica) tx(s, x0 + 4, y1 - 8, m.jedinica, { a: 'start', v: 9, b: '#9fb3c8' });
      const linije = ser.map((x) => {
        const pts = x.v.map((v, i) => [X(i), Y(v)]);
        let Lk = 0; for (let i = 1; i < pts.length; i++) Lk += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        const e = el(s, 'polyline', { points: tacke(pts), fill: 'none', stroke: x.b, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-dasharray': f2(Lk + 2), 'stroke-dashoffset': f2(Lk + 2) });
        const tt = kr(s, pts[0][0], pts[0][1], 4, { fill: x.b, stroke: '#0b1826', 'stroke-width': 1.5 });
        return { e, Lk, pts, tt };
      });
      ser.forEach((x, i) => { lin(s, 50 + i * 92, 196, 66 + i * 92, 196, x.b, 3); tx(s, 70 + i * 92, 196, x.o, { a: 'start', v: 10 }); });
      return {
        trajanje: 3.5, pauza: 3,
        kadar(t) {
          const u = glatko(t / 3.2);
          linije.forEach((l) => {
            at(l.e, { 'stroke-dashoffset': f2((l.Lk + 2) * (1 - u)) });
            const [x, y] = na(l.pts, u);
            at(l.tt, { cx: f2(x), cy: f2(y) });
          });
        },
      };
    },

    // Drvo života: od zajedničkog pretka granaju se bakterije, arheje i eukarioti (jednoćelijski eukarioti, alge,
    // biljke, gljive, životinje). Delovi (istakni): predak, bakterije, arheje, eukarioti, jednocelijski, biljke, gljive, zivotinje.
    drvo(s, m) {
      const W = 320, H = 228;
      vel(s, W, H);
      const ist = lista(m.istakni), pokazi = m.natpisi ?? !ist.length;
      const grane = [
        { id: 'predak', d: 'M160,214 L160,176', b: '#dfe6e9', k: 0 },
        { id: 'bakterije', d: 'M160,176 C130,160 70,140 50,92', b: '#55efc4', k: 1, x: 44, y: 76, e: '🦠', n: '~bakterije' },
        { id: 'arheje', d: 'M160,176 C150,150 116,120 112,92', b: '#fdcb6e', k: 1, x: 112, y: 76, e: '🔥', n: '~arheje' },
        { id: 'eukarioti', d: 'M160,176 C180,154 214,140 220,118', b: '#a29bfe', k: 1, x: 168, y: 140, n: '~eukarioti', bezE: true },
        { id: 'jednocelijski', d: 'M220,118 C200,100 176,82 168,62', b: '#81ecec', k: 2, x: 166, y: 46, e: '🔬', n: '~jednoćelijski' },
        { id: 'biljke', d: 'M220,118 C214,90 206,60 214,30', b: '#2ecc71', k: 2, x: 214, y: 16, e: '🌳', n: '~biljke' },
        { id: 'gljive', d: 'M220,118 C240,96 256,74 260,52', b: '#e1b866', k: 2, x: 262, y: 38, e: '🍄', n: '~gljive' },
        { id: 'zivotinje', d: 'M220,118 C250,112 280,100 298,84', b: '#ff7675', k: 2, x: 300, y: 70, e: '🦊', n: '~životinje' },
      ];
      const el2 = grane.map((g) => {
        const e = put(s, g.d, { stroke: g.b, 'stroke-width': g.k === 0 ? 7 : g.k === 1 ? 5 : 3.5, 'stroke-linecap': 'round', 'stroke-dasharray': 400, 'stroke-dashoffset': 400 });
        return e;
      });
      kr(s, 160, 214, 7, { fill: '#dfe6e9' });
      const oz = grane.map((g, i) => {
        const gg = el(s, 'g');
        const je = ist.includes(g.id);
        if (g.id === 'predak') { if (je) { kr(gg, 186, 210, 10, { fill: C.zuta }); tx(gg, 186, 210.5, '?', { v: 14, b: C.pozadina, obrub: false }); } else if (pokazi) tx(gg, 172, 212, '~zajednički predak', { a: 'start', v: 10 }); return gg; }
        if (!g.bezE) poz(emo(gg, je ? '❓' : g.e, 18), g.x, g.y + (g.k === 1 ? 0 : 0));
        if (je) { kr(gg, g.x, g.y + (g.bezE ? 0 : 18), 9, { fill: C.zuta }); tx(gg, g.x, g.y + (g.bezE ? 0.5 : 18.5), '?', { v: 13, b: C.pozadina, obrub: false }); }
        else if (pokazi) tx(gg, ogr(g.x, 30, 290), g.y + (g.bezE ? 0 : 18), g.n, { v: 9.5, b: g.b, a: g.x > 280 ? 'end' : g.x < 40 ? 'start' : 'middle' });
        gg.style.opacity = 0;
        return gg;
      });
      return {
        trajanje: 3.4, pauza: 3,
        kadar(t) {
          grane.forEach((g, i) => {
            const u = glatko((t - g.k * 0.9) / 1);
            at(el2[i], { 'stroke-dashoffset': f2(400 * (1 - u)) });
            oz[i].style.opacity = f2(g.id === 'predak' ? 1 : glatko((t - g.k * 0.9 - 0.7) / 0.4));
            if (ist.includes(g.id)) at(el2[i], { stroke: talas(t, 0.8) > 0.5 && u >= 1 ? C.zuta : g.b });
          });
        },
      };
    },

    // Istorija Zemlje sažeta u jedan dan (24 sata): kazaljka obilazi sat, a događaji se pojavljuju.
    // skrij: indeks(i) događaja za „?“ (0 Zemlja, 1 prve ćelije, 2 kiseonik, 3 ćelije sa jedrom, 4 višećelijski,
    // 5 biljke na kopnu, 6 dinosaurusi, 7 čovek).
    satZemlje(s, m) {
      const W = 320, H = 216;
      vel(s, W, H);
      const skrij = lista(m.skrij);
      const cx = 96, cy = 108, R = 84;
      el(s, 'circle', { cx, cy, r: R, fill: '#13263a', stroke: '#5d7a96', 'stroke-width': 3 });
      for (let h = 0; h < 24; h++) { const a = (h / 24) * 6.283 - Math.PI / 2; lin(s, cx + (R - (h % 6 ? 6 : 12)) * Math.cos(a), cy + (R - (h % 6 ? 6 : 12)) * Math.sin(a), cx + R * Math.cos(a), cy + R * Math.sin(a), '#9fb3c8', h % 6 ? 1 : 2.5); }
      for (const h of [0, 6, 12, 18]) { const a = (h / 24) * 6.283 - Math.PI / 2; tx(s, cx + (R - 22) * Math.cos(a), cy + (R - 22) * Math.sin(a), String(h || 24), { v: 10, b: '#9fb3c8' }); }
      // [sat u danu (4,6 milijardi godina = 24 h), emodži, naziv, pre koliko]
      const D = [[0, '🌋', '~Zemlja nastaje', '4,6 mlrd.'], [4.2, '🦠', '~prve ćelije', '3,8 mlrd.'], [11.5, 'O₂', '~kiseonik u vazduhu', '2,4 mlrd.'], [13.6, '🔬', '~ćelije sa jedrom', '2 mlrd.'], [20.9, '🧽', '~višećelijski', '600 mil.'], [21.5, '🌱', '~biljke na kopnu', '470 mil.'], [22.8, '🦕', '~dinosaurusi', '230 mil.'], [23.998, '🚶', '~čovek', '300 hilj.']];
      const sektor = el(s, 'path', { fill: 'rgba(116,185,255,.16)' });
      const kaz = lin(s, cx, cy, cx, cy - R + 8, C.zuta, 3);
      kr(s, cx, cy, 5, { fill: C.zuta });
      const vreme = tx(s, cx, cy + 30, '', { v: 11, b: C.zuta });
      const tackice = D.map(([h], i) => { const a = (h / 24) * 6.283 - Math.PI / 2; return kr(s, cx + (R - 3) * Math.cos(a), cy + (R - 3) * Math.sin(a), 4, { fill: C.zuta, opacity: 0 }); });
      const redovi = D.map(([h, e, n, pre], i) => {
        const g = el(s, 'g');
        const y = 16 + i * 26;
        const sk = skrij.includes(i);
        if (sk) tx(g, 196, y, '?', { v: 16, b: C.zuta }); else poz(emo(g, e, 15), 196, y);
        tx(g, 210, y - 5, sk ? '?' : n, { a: 'start', v: 9.5 });
        tx(g, 210, y + 7, `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')} · ${pre}`, { a: 'start', v: 8, b: '#9fb3c8' });
        g.style.opacity = 0;
        return g;
      });
      const T = 9;
      return {
        trajanje: T + 0.5, pauza: 3,
        kadar(t) {
          const u = Math.min(1, t / T), h = 24 * (1 - Math.pow(1 - u, 1.6));
          const a = (h / 24) * 6.283 - Math.PI / 2;
          at(kaz, { x2: f2(cx + (R - 10) * Math.cos(a)), y2: f2(cy + (R - 10) * Math.sin(a)) });
          const vel2 = h / 24 > 0.5 ? 1 : 0;
          at(sektor, { d: h <= 0.01 ? '' : `M${cx},${cy} L${cx},${cy - R} A${R},${R} 0 ${vel2} 1 ${f2(cx + R * Math.cos(a))},${f2(cy + R * Math.sin(a))}Z` });
          postaviTekst(vreme, `${String(Math.floor(h) % 25).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')}`);
          D.forEach(([hh], i) => { const vid = h >= hh - 0.001; redovi[i].style.opacity = vid ? 1 : 0.12; tackice[i].style.opacity = vid ? 1 : 0; });
        },
      };
    },

    // Petrijeva šolja. tip: 'plesan' (oko plesni penicilijum bakterije ne rastu – Flemingovo otkriće),
    // 'disk' (antibiogram: oko pločica različitih antibiotika prazni krugovi različite veličine),
    // 'otpornost' (antibiotik ubija osetljive bakterije, a otporne preživljavaju i razmnožavaju se).
    antibiotik(s, m) {
      const tip = izbor(m.tip, ['plesan', 'disk', 'otpornost'], 'plesan');
      const W = 320, H = 214;
      vel(s, W, H);
      const cx = tip === 'otpornost' ? 92 : 160, cy = 106, R = tip === 'otpornost' ? 82 : 92;
      el(s, 'circle', { cx, cy, r: R + 6, fill: 'none', stroke: '#b2bec3', 'stroke-width': 3, opacity: 0.6 });
      el(s, 'circle', { cx, cy, r: R, fill: 'rgba(253,203,110,.16)', stroke: '#dfe6e9', 'stroke-width': 1.5 });
      const r = slucajni(21);
      const tacka = () => { for (;;) { const x = cx + (r() * 2 - 1) * R, y = cy + (r() * 2 - 1) * R; if (Math.hypot(x - cx, y - cy) < R - 6) return [x, y]; } };
      if (tip === 'plesan' || tip === 'disk') {
        const zone = tip === 'plesan' ? [[cx + 30, cy - 20, 40]] : [[cx - 46, cy - 34, 30], [cx + 44, cy - 30, 16], [cx, cy + 44, 8]];
        const kol = Array.from({ length: 170 }, () => { const [x, y] = tacka(); const ok = zone.every(([zx, zy, zr]) => Math.hypot(x - zx, y - zy) > zr + 3); return { e: kr(s, x, y, 0, { fill: '#f5f6fa', opacity: 0.85 }), ok, f: r() }; });
        const zr = zone.map(([x, y, rr]) => el(s, 'circle', { cx: x, cy: y, r: rr, fill: 'none', stroke: C.zuta, 'stroke-width': 1.2, 'stroke-dasharray': '3 3', opacity: 0 }));
        if (tip === 'plesan') {
          const pl = el(s, 'g');
          for (let i = 0; i < 18; i++) { const a = (i / 18) * 6.283; put(pl, `M${cx + 30},${cy - 20} l${f2(13 * Math.cos(a))},${f2(13 * Math.sin(a))}`, { stroke: '#7bed9f', 'stroke-width': 2 }); }
          kr(pl, cx + 30, cy - 20, 9, { fill: '#2ecc71', stroke: '#27ae60', 'stroke-width': 1.5 });
          tx(s, 300, 24, '~plesan', { a: 'end', v: 10, b: '#7bed9f' });
          lin(s, 262, 28, cx + 40, cy - 28, '#7bed9f', 1);
          tx(s, 20, 200, '~kolonije bakterija', { a: 'start', v: 10, b: '#dfe6e9' });
        } else {
          zone.forEach(([x, y], i) => { kr(s, x, y, 6, { fill: '#fff', stroke: '#b2bec3', 'stroke-width': 1 }); tx(s, x, y + 0.5, 'ABC'[i], { v: 8, b: C.pozadina, obrub: false }); });
          tx(s, 300, 204, '~pločice sa antibioticima', { a: 'end', v: 9.5, b: '#dfe6e9' });
        }
        return {
          trajanje: 4, pauza: 3,
          kadar(t) {
            kol.forEach((k) => at(k.e, { r: k.ok ? f2(2.6 * glatko((t - k.f * 2) / 1.2)) : f2(2.2 * glatko((t - k.f * 2) / 1.2) * (1 - glatko((t - 2.4) / 0.8))) }));
            zr.forEach((z) => z.style.opacity = f2(glatko((t - 3) / 0.6)));
          },
        };
      }
      // otpornost – 3 talasa: rast, antibiotik, preživele otporne se razmnože
      const N = 60;
      const bak = Array.from({ length: N }, (_, i) => { const [x, y] = tacka(); return { e: kr(s, x, y, 3.2, { stroke: '#0b1826', 'stroke-width': 0.8 }), otp: i % 15 === 0 }; });
      const kap = el(s, 'circle', { cx, cy, r: R, fill: 'rgba(116,185,255,.0)' });
      const lg = el(s, 'g');
      kr(lg, 192, 40, 5, { fill: '#ff7675' }); tx(lg, 202, 40, '~osetljive', { a: 'start', v: 10 });
      kr(lg, 192, 60, 5, { fill: '#a29bfe' }); tx(lg, 202, 60, '~otporne', { a: 'start', v: 10 });
      const faza = tx(s, 188, 100, '', { a: 'start', v: 10.5, b: C.zuta });
      const brO = tx(s, 188, 124, '', { a: 'start', v: 10, b: '#9fb3c8' });
      return {
        trajanje: 9, pauza: 2.5,
        kadar(t) {
          const ab = t > 2.5 && t < 5.5;
          at(kap, { fill: ab ? 'rgba(116,185,255,.16)' : 'rgba(116,185,255,0)' });
          let ziv = 0, otp = 0;
          bak.forEach((b, i) => {
            let vid, boja = b.otp ? '#a29bfe' : '#ff7675';
            if (t < 2.5) vid = 1;
            else if (t < 5.5) vid = b.otp ? 1 : 1 - glatko((t - 2.8) / 1.5);
            else { vid = b.otp ? 1 : glatko((t - 6 - (i % 7) * 0.3) / 0.6); boja = '#a29bfe'; }
            at(b.e, { fill: boja, opacity: f2(vid), r: f2(3.2 * Math.max(0.2, vid)) });
            if (vid > 0.5) { ziv++; if (boja === '#a29bfe') otp++; }
          });
          postaviTekst(faza, t < 2.5 ? '~1. bakterije rastu' : t < 5.5 ? '~2. antibiotik' : '~3. otporne se množe');
          postaviTekst(brO, `~otpornih: ${otp} od ${ziv}`);
        },
      };
    },

    // Širenje zarazne bolesti kapljicama: bolesna osoba kija, kapljice lete do oko 2 m i zaraze one koji su blizu,
    // a oni dalje šire zarazu. zastita: true – maske i razmak (kapljice ne stižu daleko, zarazi se mnogo manje ljudi).
    zaraza(s, m) {
      const W = 320, H = 210;
      vel(s, W, H);
      const zas = !!m.zastita;
      const ljudi = [];
      for (let red = 0; red < 3; red++) for (let k = 0; k < 6; k++) ljudi.push({ x: 34 + k * 50 + (red % 2) * 14, y: 40 + red * 56 });
      const izvor = 7;
      const dom = zas ? 52 : 62;
      // ko koga zarazi: talasi od izvora
      const kada = ljudi.map(() => Infinity);
      kada[izvor] = 0;
      for (let talas2 = 0; talas2 < (zas ? 2 : 4); talas2++) ljudi.forEach((p, i) => { if (kada[i] !== talas2 * 2.2) return; ljudi.forEach((q, j) => { if (kada[j] === Infinity && Math.hypot(p.x - q.x, p.y - q.y) < dom) kada[j] = (talas2 + 1) * 2.2; }); });
      const fig = ljudi.map((p) => { const g = emo(s, '🙂', 22); poz(g, p.x, p.y); return g; });
      const oblaci = ljudi.map((p) => el(s, 'circle', { cx: p.x, cy: p.y, r: 0, fill: 'rgba(116,185,255,.18)', stroke: 'rgba(116,185,255,.5)', 'stroke-width': 1, 'stroke-dasharray': '2 3' }));
      const br2 = tx(s, 8, 200, '', { a: 'start', v: 11, b: C.zuta });
      if (zas) tx(s, 312, 200, '~maske i razmak', { a: 'end', v: 10, b: '#9fb3c8' });
      return {
        trajanje: 10, pauza: 2.5,
        kadar(t) {
          let n = 0;
          ljudi.forEach((p, i) => {
            const k = kada[i];
            const bol = t >= k;
            if (bol) n++;
            const lice = bol ? (t - k < 2 ? '🤧' : '🤒') : zas ? '😷' : '🙂';
            const tt = fig[i].firstChild; if (tt.textContent !== lice) tt.textContent = lice;
            const u = bol ? (t - k) / 1.6 : -1;
            at(oblaci[i], { r: u > 0 && u < 1 ? f2(dom * glatko(u)) : 0, opacity: u > 0 && u < 1 ? f2(1 - u * 0.7) : 0 });
          });
          postaviTekst(br2, `~zaraženih: ${n} od ${ljudi.length}`);
        },
      };
    },

    // Građa kože (presek): pokožica, krzno, potkožno masno tkivo, dlaka, lojna i znojna žlezda, krvni sudovi.
    // Znoj izlazi na površinu. opekotina: 1 | 2 | 3 – stepen opekotine (crvenilo, plik, oštećenje dubokih slojeva).
    // Delovi: pokozica, krzno, potkozno, dlaka, lojna, znojna, sudovi.
    koza(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      const op = ogr(Math.round(br(m.opekotina, 0)), 0, 3);
      const pok = el(s, 'path', { d: 'M0,40 C60,34 120,46 180,38 C240,30 290,42 320,38 L320,64 L0,64Z', fill: '#f3c6a5', stroke: '#d9a47f', 'stroke-width': 1.5 });
      const krz = el(s, 'rect', { x: 0, y: 64, width: W, height: 82, fill: '#f0a6a0', stroke: '#d98080', 'stroke-width': 1.5 });
      const potk = el(s, 'rect', { x: 0, y: 146, width: W, height: 74, fill: '#f8e3a1', stroke: '#d9c27a', 'stroke-width': 1.5 });
      for (let i = 0; i < 12; i++) el(s, 'ellipse', { cx: 14 + i * 27, cy: 172 + (i % 2) * 22, rx: 12, ry: 10, fill: '#fdeeb8', stroke: '#e0c66e', 'stroke-width': 1 });
      const sudovi = put(s, 'M0,128 C60,118 100,138 160,126 C220,114 260,134 320,124', { stroke: '#e74c3c', 'stroke-width': 3 });
      put(s, 'M0,136 C60,128 100,146 160,134 C220,124 260,142 320,132', { stroke: '#3b6fd4', 'stroke-width': 3 });
      const dlaka = put(s, 'M78,140 C76,100 74,60 70,8', { stroke: '#4a3426', 'stroke-width': 3.5, 'stroke-linecap': 'round' });
      el(s, 'ellipse', { cx: 79, cy: 132, rx: 7, ry: 12, fill: 'none', stroke: '#8a6a4a', 'stroke-width': 1.5 });
      const lojna = el(s, 'ellipse', { cx: 96, cy: 96, rx: 9, ry: 7, fill: '#fdcb6e', stroke: '#c49a3a', 'stroke-width': 1.5 });
      lin(s, 89, 94, 79, 90, '#c49a3a', 1.5);
      const znojna = put(s, 'M230,156 C220,150 222,142 232,142 C242,142 244,150 234,154 C226,158 226,148 232,148 M232,142 C232,120 236,90 232,40', { stroke: '#74b9ff', 'stroke-width': 2.5 });
      const kapi = [0, 1, 2].map(() => kr(s, 0, 0, 2.6, { fill: '#74b9ff' }));
      let plik = null;
      if (op) {
        const dub = op === 1 ? 64 : op === 2 ? 110 : 190;
        el(s, 'rect', { x: 130, y: 36, width: 70, height: dub - 36, fill: op === 3 ? 'rgba(45,52,54,.75)' : 'rgba(231,76,60,.35)' });
        if (op === 2) plik = el(s, 'path', { d: 'M138,40 C140,14 190,14 192,40Z', fill: 'rgba(255,234,167,.55)', stroke: '#fdcb6e', 'stroke-width': 1.5 });
        if (m.natpisi !== false) tx(s, 165, 210, `~opekotina ${op}. stepena`, { v: 11, b: C.zuta });
      }
      const delovi = [
        { id: 'pokozica', naziv: '~pokožica', ax: 30, ay: 50, lx: 20, ly: 18, a: 'start', sjaj: sjaj(pok) },
        { id: 'krzno', naziv: '~krzno', ax: 20, ay: 96, lx: 6, ly: 96, a: 'start', skriven: !!op, sjaj: sjaj(krz) },
        { id: 'potkozno', naziv: '~potkožno masno tkivo', ax: 40, ay: 170, lx: 6, ly: 206, a: 'start', skriven: !!op, sjaj: sjaj(potk) },
        { id: 'dlaka', naziv: '~dlaka', ax: 72, ay: 20, lx: 110, ly: 12, a: 'start', sjaj: sjaj(dlaka) },
        { id: 'lojna', naziv: '~lojna žlezda', ax: 104, ay: 96, lx: 150, ly: 84, a: 'start', skriven: !!op, sjaj: sjaj(lojna) },
        { id: 'znojna', naziv: '~znojna žlezda', ax: 238, ay: 150, lx: 314, ly: 200, a: 'end', skriven: !!op, sjaj: sjaj(znojna) },
        { id: 'sudovi', naziv: '~krvni sudovi', ax: 290, ay: 128, lx: 314, ly: 100, a: 'end', skriven: !!op, sjaj: sjaj(sudovi) },
      ];
      const nat = natpisi(s, m, delovi);
      return {
        kadar(t) {
          kapi.forEach((k, i) => { const u = (t * 0.4 + i / 3) % 1; at(k, { cx: f2(232 + Math.sin(u * 8) * 1.5), cy: f2(lerp(140, 30, u)), r: f2(u > 0.8 ? 2.6 + (u - 0.8) * 10 : 2.4), opacity: f2(u > 0.92 ? (1 - u) * 12 : 1) }); });
          if (plik) plik.style.opacity = f2(0.75 + 0.25 * talas(t, 0.6));
          nat.kadar(t);
        },
      };
    },

    // ─────────── 8. razred ───────────
    // Enzim po modelu „ključ i brava“: supstrat ulazi u aktivni centar, nastaje kompleks enzim–supstrat, pa se
    // oslobađaju proizvodi, a enzim ostaje isti. Delovi: enzim, centar, supstrat, proizvod.
    // tip: 'energija' – grafik energije reakcije bez enzima i sa enzimom; skrij: 'aktivacija' – umesto naziva „?“.
    enzim(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      if (m.tip === 'energija') {
        const x0 = 34, y0 = 186, x1 = 306;
        lin(s, x0, y0, x1, y0, '#5d7a96', 1.5); lin(s, x0, y0, x0, 18, '#5d7a96', 1.5);
        tx(s, x0 + 4, 12, '~energija', { a: 'start', v: 9.5, b: '#9fb3c8' });
        tx(s, x1, y0 + 12, '~tok reakcije', { a: 'end', v: 9.5, b: '#9fb3c8' });
        const kriva = (vrh) => { const p = []; for (let i = 0; i <= 60; i++) { const u = i / 60, x = 50 + u * 240; const y = lerp(120, 160, glatko((u - 0.45) / 0.3)) - vrh * Math.exp(-((u - 0.5) ** 2) / 0.018); p.push([x, y]); } return p; };
        const bez = kriva(92), sa = kriva(42);
        const L = (p) => { let d = 0; for (let i = 1; i < p.length; i++) d += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return d; };
        const lb = L(bez), ls = L(sa);
        const eb = el(s, 'polyline', { points: tacke(bez), fill: 'none', stroke: '#ff7675', 'stroke-width': 3, 'stroke-dasharray': `${f2(lb)}`, 'stroke-dashoffset': f2(lb) });
        const es = el(s, 'polyline', { points: tacke(sa), fill: 'none', stroke: '#55efc4', 'stroke-width': 3, 'stroke-dasharray': `${f2(ls)}`, 'stroke-dashoffset': f2(ls) });
        tx(s, 62, 108, '~reaktanti', { a: 'start', v: 9.5 });
        tx(s, 292, 172, '~proizvod', { a: 'end', v: 9.5 });
        tx(s, 196, 34, '~bez enzima', { a: 'start', v: 10, b: '#ff7675' });
        tx(s, 196, 84, '~sa enzimom', { a: 'start', v: 10, b: '#55efc4' });
        const sk = lista(m.skrij).includes('aktivacija');
        const zag = el(s, 'g');
        strelica(zag, C.zuta, 2).set(170, 120, 170, 32);
        tx(zag, 164, 76, sk ? '?' : '~energija aktivacije', { a: 'end', v: sk ? 16 : 9.5, b: C.zuta });
        zag.style.opacity = 0;
        const loptaB = kr(s, 0, 0, 5, { fill: '#ff7675' }), loptaS = kr(s, 0, 0, 5, { fill: '#55efc4' });
        return {
          trajanje: 5.5, pauza: 3,
          kadar(t) {
            const ub = glatko(t / 4.5), us = glatko(t / 2.6);
            at(eb, { 'stroke-dashoffset': f2(lb * (1 - ub)) }); at(es, { 'stroke-dashoffset': f2(ls * (1 - us)) });
            const [xb, yb] = na(bez, ub), [xs, ys] = na(sa, us);
            at(loptaB, { cx: f2(xb), cy: f2(yb) }); at(loptaS, { cx: f2(xs), cy: f2(ys) });
            zag.style.opacity = f2(glatko((t - 2.8) / 0.8));
          },
        };
      }
      const enz = el(s, 'path', { d: 'M70,200 L70,132 Q70,112 90,112 L132,112 L160,146 L188,112 L230,112 Q250,112 250,132 L250,200 Z', fill: 'rgba(162,155,254,.3)', stroke: '#a29bfe', 'stroke-width': 3 });
      const centar = put(s, 'M132,112 L160,146 L188,112', { stroke: '#a29bfe', 'stroke-width': 3 });
      const sup = el(s, 'g');
      const pl = el(sup, 'polygon', { points: '-27,0 0,33 0,-24 -27,-24', fill: '#ffeaa7', stroke: '#fdcb6e', 'stroke-width': 2 });
      const pd = el(sup, 'polygon', { points: '27,0 0,33 0,-24 27,-24', fill: '#ffeaa7', stroke: '#fdcb6e', 'stroke-width': 2 });
      const veza = lin(sup, 0, -24, 0, 33, '#e17055', 3);
      const plus = [0, 1, 2].map((i) => { const g = emo(s, '✨', 12); g.style.opacity = 0; return g; });
      const delovi = [
        { id: 'enzim', naziv: '~enzim', ax: 200, ay: 170, lx: 300, ly: 196, a: 'end', sjaj: sjaj(enz) },
        { id: 'centar', naziv: '~aktivni centar', ax: 172, ay: 130, lx: 304, ly: 140, a: 'end', sjaj: sjaj(centar) },
        { id: 'supstrat', naziv: '~supstrat', ax: 54, ay: 40, lx: 20, ly: 16, a: 'start', skriven: false },
        { id: 'proizvod', naziv: '~proizvodi', ax: 270, ay: 40, lx: 304, ly: 16, a: 'end' },
      ];
      const nat = natpisi(s, m, delovi);
      return {
        trajanje: 6, pauza: 1,
        kadar(t) {
          const u1 = glatko(t / 2);
          let x = lerp(54, 160, u1), y = lerp(40, 112, u1), rot = lerp(-40, 0, u1);
          const razd = glatko((t - 3.2) / 2);
          poz(sup, x, y, false, rot);
          at(pl, { transform: `translate(${f2(-razd * 95)} ${f2(-razd * 80)}) rotate(${f2(-razd * 30)})` });
          at(pd, { transform: `translate(${f2(razd * 110)} ${f2(-razd * 80)}) rotate(${f2(razd * 30)})` });
          veza.style.opacity = t < 3.2 ? 1 : 0;
          const kompleks = t > 2 && t < 3.4;
          at(enz, { fill: kompleks ? 'rgba(253,203,110,.25)' : 'rgba(162,155,254,.3)' });
          plus.forEach((g, i) => { poz(g, 140 + i * 20, 104 - (t - 2) * 12); g.style.opacity = kompleks ? f2(Math.sin(((t - 2) / 1.4) * Math.PI)) : 0; });
          nat.kadar(t);
        },
      };
    },

    // Nervna ćelija: impuls putuje od kratkih nastavaka kroz telo i nervno vlakno do završetaka.
    // mijelin: true – vlakno sa mijelinskim omotačem, impuls „skače“ od čvora do čvora.
    // Delovi: dendriti, telo, jedro, akson, mijelin (samo uz mijelin), zavrsetak.
    neuron(s, m) {
      const W = 320, H = 200;
      vel(s, W, H);
      const mij = !!m.mijelin;
      const g = el(s, 'g');
      const dend = el(g, 'g');
      const r = slucajni(5);
      const grane = [];
      for (let i = 0; i < 6; i++) {
        const a = Math.PI * (0.55 + (i / 5) * 0.9);
        const x1 = 62 + 22 * Math.cos(a), y1 = 100 + 22 * Math.sin(a), x2 = 62 + 52 * Math.cos(a), y2 = 100 + 52 * Math.sin(a);
        put(dend, `M${f2(x1)},${f2(y1)} Q${f2((x1 + x2) / 2 + (r() - 0.5) * 14)},${f2((y1 + y2) / 2 + (r() - 0.5) * 14)} ${f2(x2)},${f2(y2)}`, { stroke: '#fab1a0', 'stroke-width': 3 });
        const a2 = a + (r() - 0.5) * 0.9;
        put(dend, `M${f2(x2)},${f2(y2)} L${f2(x2 + 16 * Math.cos(a2))},${f2(y2 + 16 * Math.sin(a2))} M${f2(x2)},${f2(y2)} L${f2(x2 + 14 * Math.cos(a - 0.5))},${f2(y2 + 14 * Math.sin(a - 0.5))}`, { stroke: '#fab1a0', 'stroke-width': 2 });
        grane.push([x2, y2]);
      }
      const telo = el(g, 'path', { d: mrlja(62, 100, 26, 0, 3, 14, 0.8), fill: 'rgba(250,177,160,.35)', stroke: '#fab1a0', 'stroke-width': 2.5 });
      const jed = kr(g, 60, 100, 9, { fill: B.jedro, stroke: '#dcd6ff', 'stroke-width': 1.5 });
      const akson = put(g, 'M86,100 L262,100', { stroke: '#fab1a0', 'stroke-width': 4 });
      const zav = el(g, 'g');
      const kraj = [[296, 70], [304, 100], [296, 130]];
      kraj.forEach(([x, y]) => { put(zav, `M262,100 Q280,${(100 + y) / 2} ${x},${y}`, { stroke: '#fab1a0', 'stroke-width': 2.5 }); kr(zav, x, y, 5, { fill: '#fab1a0' }); });
      const omotaci = [];
      const cvorovi = [92];
      if (mij) for (let i = 0; i < 5; i++) { const x = 98 + i * 33; omotaci.push(el(g, 'rect', { x, y: 91, width: 27, height: 18, rx: 8, fill: 'rgba(255,234,167,.55)', stroke: '#fdcb6e', 'stroke-width': 1.5 })); cvorovi.push(x + 30); }
      const impuls = kr(s, 0, 0, 7, { fill: C.zuta, opacity: 0.9 });
      const sjajI = kr(s, 0, 0, 14, { fill: 'rgba(255,234,167,.25)' });
      const delovi = [
        { id: 'dendriti', naziv: '~kratki nastavci', ax: grane[0][0], ay: grane[0][1], lx: 14, ly: 186, a: 'start', sjaj: sjaj(...dend.children) },
        { id: 'telo', naziv: '~telo ćelije', ax: 70, ay: 80, lx: 40, ly: 16, a: 'start', sjaj: sjaj(telo) },
        { id: 'jedro', naziv: '~jedro', ax: 60, ay: 104, lx: 128, ly: 150, a: 'start', sjaj: sjaj(jed) },
        { id: 'akson', naziv: '~nervno vlakno', ax: 180, ay: 100, lx: 170, ly: 52, a: 'middle', sjaj: sjaj(akson) },
        ...(mij ? [{ id: 'mijelin', naziv: '~mijelinski omotač', ax: 210, ay: 108, lx: 215, ly: 162, a: 'middle', sjaj: sjaj(...omotaci) }] : []),
        { id: 'zavrsetak', naziv: '~završeci', ax: 300, ay: 132, lx: 312, ly: 180, a: 'end', sjaj: sjaj(...zav.children) },
      ];
      const nat = natpisi(s, m, delovi);
      return {
        kadar(t) {
          const u = (t % 3.2) / 3.2;
          let x, y = 100;
          if (u < 0.2) { const k = u / 0.2; x = lerp(grane[2][0], 62, k); y = lerp(grane[2][1], 100, k); }
          else if (!mij) x = lerp(62, 300, glatko((u - 0.2) / 0.75));
          else { const k = Math.min(1, (u - 0.2) / 0.7), i = Math.min(cvorovi.length - 1, Math.floor(k * cvorovi.length)); x = k >= 1 ? 300 : cvorovi[i]; }
          at(impuls, { cx: f2(x), cy: f2(y) }); at(sjajI, { cx: f2(x), cy: f2(y), r: f2(12 + 4 * Math.sin(t * 12)) });
          at(telo, { d: mrlja(62, 100, 26, t, 3, 14, 0.8) });
          nat.kadar(t);
        },
      };
    },

    // Sinapsa: impuls stiže do završetka vlakna, kesice (vezikule) izbacuju neurotransmiter u sinaptičku pukotinu,
    // on se vezuje za receptore sledeće ćelije i u njoj nastaje novi impuls.
    // Delovi: zavrsetak, vezikule, pukotina, receptori, sledeca.
    sinapsa(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      const pukot = el(s, 'rect', { x: 70, y: 116, width: 180, height: 24, fill: 'rgba(116,185,255,.06)', stroke: 'rgba(116,185,255,.25)', 'stroke-width': 1, 'stroke-dasharray': '4 3' });
      const zav = el(s, 'path', { d: 'M135,0 L135,36 C78,46 78,114 160,114 C242,114 242,46 185,36 L185,0', fill: 'rgba(250,177,160,.22)', stroke: '#fab1a0', 'stroke-width': 3 });
      const sled = el(s, 'path', { d: 'M40,142 L280,142 L280,220 L40,220 Z', fill: 'rgba(129,236,236,.12)', stroke: '#81ecec', 'stroke-width': 3 });
      const recX = [100, 130, 160, 190, 220];
      const rec = recX.map((x) => put(s, `M${x - 7},136 L${x - 7},142 M${x + 7},136 L${x + 7},142 M${x - 7},142 L${x + 7},142`, { stroke: '#55efc4', 'stroke-width': 3 }));
      const vezPos = [[128, 72], [160, 64], [192, 72], [142, 94], [176, 94], [160, 84]];
      const vez = vezPos.map(([x, y]) => { const gg = el(s, 'g'); kr(gg, 0, 0, 9, { fill: 'rgba(253,203,110,.25)', stroke: '#fdcb6e', 'stroke-width': 1.5 }); [[-3, -2], [3, -1], [0, 3]].forEach(([a, b]) => kr(gg, a, b, 1.8, { fill: '#fd79a8' })); poz(gg, x, y); return { gg, x, y }; });
      const r = slucajni(3);
      const nt = Array.from({ length: 18 }, (_, i) => ({ c: kr(s, 0, 0, 2.6, { fill: '#fd79a8', opacity: 0 }), x0: 120 + r() * 80, cilj: recX[i % 5], d: r() * 0.4 }));
      const imp = kr(s, 160, 0, 7, { fill: C.zuta });
      const imp2 = kr(s, 0, 0, 7, { fill: C.zuta, opacity: 0 });
      const delovi = [
        { id: 'zavrsetak', naziv: '~završetak vlakna', ax: 200, ay: 30, lx: 312, ly: 14, a: 'end', sjaj: sjaj(zav) },
        { id: 'vezikule', naziv: '~kesice (vezikule)', ax: 202, ay: 72, lx: 312, ly: 60, a: 'end', sjaj: sjaj(...vez.map((v) => v.gg.firstChild)) },
        { id: 'pukotina', naziv: '~sinaptička pukotina', ax: 68, ay: 128, lx: 8, ly: 100, a: 'start', sjaj: sjaj(pukot) },
        { id: 'receptori', naziv: '~receptori', ax: 228, ay: 138, lx: 312, ly: 118, a: 'end', sjaj: sjaj(...rec) },
        { id: 'sledeca', naziv: '~sledeća ćelija', ax: 60, ay: 190, lx: 8, ly: 206, a: 'start', sjaj: sjaj(sled) },
      ];
      const nat = natpisi(s, m, delovi);
      return {
        trajanje: 5.2, pauza: 1.2,
        kadar(t) {
          at(imp, { cy: f2(lerp(0, 40, glatko(t / 0.8))), opacity: t < 1 ? 1 : 0 });
          const sp = glatko((t - 0.8) / 0.8);
          vez.forEach((v) => poz(v.gg, v.x, lerp(v.y, 108, sp * (v.y > 80 ? 1 : 0.6)), false, 0, t > 1.7 ? Math.max(0.2, 1 - (t - 1.7) * 2) : 1));
          nt.forEach((n) => {
            const k = ogr((t - 1.7 - n.d) / 1.4, 0, 1);
            at(n.c, { cx: f2(lerp(n.x0, n.cilj, k)), cy: f2(lerp(110, 134, k)), opacity: k > 0 && t < 4.3 ? 1 : 0 });
          });
          const pr = t > 3.2;
          rec.forEach((e) => at(e, { stroke: pr ? C.zuta : '#55efc4' }));
          const k2 = ogr((t - 3.4) / 1.6, 0, 1);
          at(imp2, { cx: f2(lerp(160, 270, k2)), cy: 180, opacity: k2 > 0 && k2 < 1 ? 1 : 0 });
          nat.kadar(t);
        },
      };
    },

    // Refleksni luk (refleks povlačenja): receptor u koži → osetno vlakno → siva masa kičmene moždine
    // (umetnuta ćelija) → pokretačko vlakno → mišić (efektor), ruka se povlači od plamena.
    // Delovi: receptor, osetno, mozdina, umetnuta, pokretacko, misic.
    refleks(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      const cx = 238, cy = 70;
      const mozd = el(s, 'ellipse', { cx, cy, rx: 52, ry: 42, fill: 'rgba(223,230,233,.12)', stroke: '#dfe6e9', 'stroke-width': 2 });
      const siva = el(s, 'path', { d: `M${cx},${cy - 6} C${cx - 18},${cy - 34} ${cx - 34},${cy - 24} ${cx - 22},${cy - 4} C${cx - 34},${cy + 14} ${cx - 26},${cy + 34} ${cx},${cy + 8} C${cx + 26},${cy + 34} ${cx + 34},${cy + 14} ${cx + 22},${cy - 4} C${cx + 34},${cy - 24} ${cx + 18},${cy - 34} ${cx},${cy - 6}Z`, fill: 'rgba(178,190,195,.45)', stroke: '#b2bec3', 'stroke-width': 1.5 });
      const ruka = el(s, 'g');
      el(ruka, 'path', { d: 'M20,150 Q60,138 112,142 L118,160 Q60,166 20,170 Z', fill: B.koza, stroke: '#e0a17e', 'stroke-width': 2 });
      const mis = el(ruka, 'ellipse', { cx: 70, cy: 152, rx: 30, ry: 8, fill: B.misic, stroke: '#ff7675', 'stroke-width': 1.5 });
      const rec = kr(ruka, 30, 168, 4, { fill: '#74b9ff', stroke: '#0b1826' });
      const plamen = emo(s, '🔥', 26); poz(plamen, 30, 196);
      const osP = [[30, 168], [120, 176], [170, 120], [cx - 40, cy - 22], [cx - 14, cy - 14]];
      const umP = [[cx - 14, cy - 14], [cx - 2, cy + 2], [cx + 12, cy + 14]];
      const poP = [[cx + 12, cy + 14], [cx - 20, cy + 36], [160, 130], [100, 152]];
      const osetno = el(s, 'polyline', { points: tacke(osP), fill: 'none', stroke: '#74b9ff', 'stroke-width': 3, 'stroke-linejoin': 'round' });
      kr(s, cx - 40, cy - 22, 7, { fill: 'rgba(116,185,255,.4)', stroke: '#74b9ff' });
      const umetnuta = el(s, 'polyline', { points: tacke(umP), fill: 'none', stroke: C.zuta, 'stroke-width': 3 });
      const pokret = el(s, 'polyline', { points: tacke(poP), fill: 'none', stroke: '#ff7675', 'stroke-width': 3, 'stroke-linejoin': 'round' });
      const imp = kr(s, 0, 0, 6, { fill: C.zuta });
      const mozak = el(s, 'g'); const sv = tx(mozak, 300, 196, '~„Au, vruće!“', { a: 'end', v: 11, b: C.zuta }); mozak.style.opacity = 0;
      const delovi = [
        { id: 'receptor', naziv: '~receptor', ax: 30, ay: 168, lx: 8, ly: 124, a: 'start', sjaj: sjaj(rec) },
        { id: 'osetno', naziv: '~osetno vlakno', ax: 120, ay: 176, lx: 150, ly: 206, a: 'middle', sjaj: sjaj(osetno) },
        { id: 'mozdina', naziv: '~kičmena moždina', ax: cx + 40, ay: cy - 26, lx: 314, ly: 12, a: 'end', sjaj: sjaj(mozd) },
        { id: 'umetnuta', naziv: '~umetnuta ćelija', ax: cx + 2, ay: cy + 4, lx: 314, ly: 128, a: 'end', sjaj: sjaj(umetnuta, siva) },
        { id: 'pokretacko', naziv: '~pokretačko vlakno', ax: 196, ay: 115, lx: 190, ly: 154, a: 'start', sjaj: sjaj(pokret) },
        { id: 'misic', naziv: '~mišić (efektor)', ax: 70, ay: 146, lx: 8, ly: 104, a: 'start', sjaj: sjaj(mis) },
      ];
      const nat = natpisi(s, m, delovi);
      const put3 = [...osP, ...umP.slice(1), ...poP.slice(1)];
      return {
        trajanje: 5, pauza: 1.5,
        kadar(t) {
          const u = ogr((t - 0.4) / 2.6, 0, 1);
          const [x, y] = na(put3, u);
          at(imp, { cx: f2(x), cy: f2(y), opacity: u > 0 && u < 1 ? 1 : 0 });
          const pov = glatko((t - 3) / 0.6);
          ruka.setAttribute('transform', `translate(${f2(pov * 28)} ${f2(-pov * 22)})`);
          at(mis, { rx: f2(30 - pov * 6), ry: f2(8 + pov * 3) });
          mozak.style.opacity = f2(glatko((t - 3.8) / 0.5));
          nat.kadar(t);
        },
      };
    },

    // Žlezde sa unutrašnjim lučenjem u telu čoveka; hormoni (tačkice) odlaze u krv.
    // Delovi: hipofiza, epifiza, stitna, grudna, gusteraca, nadbubrezna, polne.
    zlezde(s, m) {
      const W = 320, H = 240;
      vel(s, W, H);
      const telo = el(s, 'g');
      kr(telo, 100, 34, 26, { fill: 'rgba(243,198,165,.18)', stroke: '#9fb3c8', 'stroke-width': 2 });
      el(telo, 'path', { d: 'M90,58 L110,58 L112,72 C150,74 158,90 156,120 L150,206 C150,222 132,226 126,214 L118,150 L100,150 L82,150 L74,214 C68,226 50,222 50,206 L44,120 C42,90 50,74 88,72Z', fill: 'rgba(243,198,165,.18)', stroke: '#9fb3c8', 'stroke-width': 2 });
      const Z = {};
      Z.hipofiza = kr(s, 100, 42, 4, { fill: '#fd79a8', stroke: '#fff', 'stroke-width': 1 });
      Z.epifiza = kr(s, 108, 30, 3.5, { fill: '#a29bfe', stroke: '#fff', 'stroke-width': 1 });
      Z.stitna = el(s, 'path', { d: 'M92,66 C86,60 86,74 93,74 L107,74 C114,74 114,60 108,66 Z', fill: '#e17055', stroke: '#fff', 'stroke-width': 1 });
      Z.grudna = el(s, 'ellipse', { cx: 100, cy: 92, rx: 9, ry: 7, fill: '#fdcb6e', stroke: '#fff', 'stroke-width': 1 });
      Z.gusteraca = el(s, 'path', { d: 'M82,128 C96,120 118,122 126,126 C120,134 98,134 82,132Z', fill: '#ffeaa7', stroke: '#fff', 'stroke-width': 1 });
      Z.nadbubrezna = el(s, 'g');
      for (const x of [76, 124]) { el(Z.nadbubrezna, 'ellipse', { cx: x, cy: 120, rx: 6, ry: 9, fill: 'rgba(192,57,43,.45)' }); el(Z.nadbubrezna, 'path', { d: `M${x - 6},111 L${x},103 L${x + 6},111Z`, fill: '#55efc4', stroke: '#fff', 'stroke-width': 1 }); }
      Z.polne = el(s, 'g');
      for (const x of [84, 116]) kr(Z.polne, x, 150, 5, { fill: '#74b9ff', stroke: '#fff', 'stroke-width': 1 });
      const sj = (e) => (e.tagName === 'g' ? sjaj(...e.children) : sjaj(e));
      const delovi = [
        { id: 'hipofiza', naziv: '~hipofiza', ax: 100, ay: 42, lx: 196, ly: 32, a: 'start', sjaj: sj(Z.hipofiza) },
        { id: 'epifiza', naziv: '~epifiza', ax: 108, ay: 30, lx: 196, ly: 12, a: 'start', sjaj: sj(Z.epifiza) },
        { id: 'stitna', naziv: '~štitna žlezda', ax: 108, ay: 70, lx: 196, ly: 62, a: 'start', sjaj: sj(Z.stitna) },
        { id: 'grudna', naziv: '~grudna žlezda (timus)', ax: 106, ay: 92, lx: 196, ly: 90, a: 'start', sjaj: sj(Z.grudna) },
        { id: 'nadbubrezna', naziv: '~nadbubrežne žlezde', ax: 128, ay: 106, lx: 196, ly: 116, a: 'start', sjaj: sj(Z.nadbubrezna) },
        { id: 'gusteraca', naziv: '~gušterača', ax: 120, ay: 128, lx: 196, ly: 142, a: 'start', sjaj: sj(Z.gusteraca) },
        { id: 'polne', naziv: '~polne žlezde', ax: 116, ay: 152, lx: 196, ly: 172, a: 'start', sjaj: sj(Z.polne) },
      ];
      const nat = natpisi(s, m, delovi);
      const izv = [[100, 42], [108, 30], [100, 70], [100, 92], [104, 128], [76, 112], [116, 150]];
      const r = slucajni(9);
      const hor = Array.from({ length: 14 }, (_, i) => ({ c: kr(s, 0, 0, 1.8, { fill: C.zuta, opacity: 0 }), p: izv[i % izv.length], a: r() * 6.28, f: r() }));
      return {
        kadar(t) {
          hor.forEach((h) => { const u = (t * 0.35 + h.f) % 1; at(h.c, { cx: f2(h.p[0] + Math.cos(h.a) * u * 26), cy: f2(h.p[1] + Math.sin(h.a) * u * 18), opacity: f2(Math.sin(u * Math.PI) * 0.9) }); });
          nat.kadar(t);
        },
      };
    },

    // Mozak čoveka (bočno). Delovi: veliki, medjumozak, srednji, mali, produzena (moždano stablo).
    // tip: 'reznjevi' – režnjevi kore velikog mozga: ceoni, temeni, potiljacni, slepoocni.
    mozak(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      const rez = m.tip === 'reznjevi';
      const id = 'mz' + Math.floor(Math.random() * 1e9);
      const def = el(s, 'defs'); const cp = el(def, 'clipPath', { id });
      const OB = 'M40,104 C30,50 90,14 160,16 C232,18 262,56 258,100 C256,128 236,136 214,134 C200,150 178,148 168,136 C130,148 70,150 48,130 C42,122 40,114 40,104Z';
      el(cp, 'path', { d: OB });
      const mali = el(s, 'g');
      el(mali, 'ellipse', { cx: 222, cy: 150, rx: 40, ry: 22, fill: 'rgba(253,203,110,.3)', stroke: '#fdcb6e', 'stroke-width': 2 });
      for (let i = 0; i < 4; i++) put(mali, `M${190 + i * 4},${140 + i * 5} Q222,${130 + i * 9} ${256 - i * 3},${142 + i * 5}`, { stroke: '#fdcb6e', 'stroke-width': 1 });
      const stablo = el(s, 'path', { d: 'M158,124 C164,150 168,180 172,214 L192,214 C188,180 186,150 184,124Z', fill: 'rgba(129,236,236,.25)', stroke: '#81ecec', 'stroke-width': 2 });
      const produzena = el(s, 'path', { d: 'M169,178 C170,190 171,202 172,214 L192,214 C190,202 189,190 188,178Z', fill: 'rgba(85,239,196,.35)', stroke: '#55efc4', 'stroke-width': 2 });
      const veliki = el(s, 'g');
      const kor = el(veliki, 'path', { d: OB, fill: 'rgba(253,121,168,.22)', stroke: '#fd79a8', 'stroke-width': 2.5 });
      const lob = {};
      if (rez) {
        const gc = el(veliki, 'g', { 'clip-path': `url(#${id})` });
        lob.ceoni = el(gc, 'polygon', { points: '0,0 150,0 128,108 40,124 0,140', fill: 'rgba(116,185,255,.55)' });
        lob.temeni = el(gc, 'polygon', { points: '150,0 232,0 224,96 128,108', fill: 'rgba(85,239,196,.55)' });
        lob.potiljacni = el(gc, 'polygon', { points: '232,0 320,0 320,150 214,140 224,96', fill: 'rgba(253,203,110,.6)' });
        lob.slepoocni = el(gc, 'polygon', { points: '40,124 128,108 224,96 214,150 40,160', fill: 'rgba(253,121,168,.55)' });
        put(veliki, OB, { stroke: '#fff', 'stroke-width': 2 });
      }
      const r = slucajni(4);
      for (let i = 0; i < 9; i++) { const x = 60 + r() * 180, y = 34 + r() * 80; put(veliki, `M${f2(x)},${f2(y)} q${f2(8 + r() * 10)},${f2(-6 + r() * 12)} ${f2(18 + r() * 12)},${f2(-4 + r() * 8)}`, { stroke: 'rgba(255,255,255,.35)', 'stroke-width': 1.5 }); }
      const medju = el(s, 'ellipse', { cx: 160, cy: 110, rx: 16, ry: 9, fill: 'rgba(162,155,254,.5)', stroke: '#a29bfe', 'stroke-width': 1.5, opacity: rez ? 0 : 1 });
      const delovi = rez ? [
        { id: 'ceoni', naziv: '~čeoni režanj', ax: 76, ay: 70, lx: 8, ly: 14, a: 'start', sjaj: sjaj(lob.ceoni) },
        { id: 'temeni', naziv: '~temeni režanj', ax: 186, ay: 40, lx: 200, ly: 8, a: 'start', sjaj: sjaj(lob.temeni) },
        { id: 'potiljacni', naziv: '~potiljačni režanj', ax: 246, ay: 92, lx: 314, ly: 60, a: 'end', sjaj: sjaj(lob.potiljacni) },
        { id: 'slepoocni', naziv: '~slepoočni režanj', ax: 120, ay: 128, lx: 8, ly: 186, a: 'start', sjaj: sjaj(lob.slepoocni) },
      ] : [
        { id: 'veliki', naziv: '~veliki mozak', ax: 110, ay: 50, lx: 8, ly: 14, a: 'start', sjaj: sjaj(kor) },
        { id: 'medjumozak', naziv: '~međumozak', ax: 152, ay: 112, lx: 8, ly: 168, a: 'start', sjaj: sjaj(medju) },
        { id: 'mali', naziv: '~mali mozak', ax: 240, ay: 158, lx: 314, ly: 196, a: 'end', sjaj: sjaj(...mali.children) },
        { id: 'stablo', naziv: '~moždano stablo', ax: 182, ay: 150, lx: 314, ly: 108, a: 'end', sjaj: sjaj(stablo) },
        { id: 'produzena', naziv: '~produžena moždina', ax: 172, ay: 200, lx: 8, ly: 206, a: 'start', sjaj: sjaj(produzena) },
      ];
      const nat = natpisi(s, m, delovi);
      const iskre = Array.from({ length: 10 }, () => ({ c: kr(s, 0, 0, 2.2, { fill: C.zuta, opacity: 0 }), x: 60 + r() * 180, y: 30 + r() * 90, f: r() }));
      return {
        kadar(t) {
          iskre.forEach((k) => { const u = (t * 0.7 + k.f) % 1; at(k.c, { cx: k.x, cy: k.y, opacity: f2(u < 0.3 ? Math.sin((u / 0.3) * Math.PI) : 0) }); });
          nat.kadar(t);
        },
      };
    },

    // Povratna sprega: nivo šećera u krvi posle obroka raste, gušterača luči insulin i nivo pada; kad padne
    // ispod normale, luči glukagon i nivo raste. Traka – normalan nivo.
    sprega(s, m) {
      const W = 320, H = 200;
      vel(s, W, H);
      const x0 = 30, x1 = 306, yS = 100;
      el(s, 'rect', { x: x0, y: yS - 16, width: x1 - x0, height: 32, fill: 'rgba(85,239,196,.12)' });
      tx(s, x1, yS - 22, '~normalan nivo', { a: 'end', v: 9, b: '#55efc4' });
      lin(s, x0, 176, x1, 176, '#5d7a96', 1.5); lin(s, x0, 176, x0, 20, '#5d7a96', 1.5);
      tx(s, x0, 188, '~šećer u krvi', { a: 'start', v: 9, b: '#9fb3c8' });
      tx(s, x1, 188, '~vreme', { a: 'end', v: 9, b: '#9fb3c8' });
      const N = 120, pts = [];
      const nivo = (u) => { const t = u * 12; return yS - 62 * Math.exp(-((t - 2) ** 2) / 1.2) + 46 * Math.exp(-((t - 6.4) ** 2) / 1.3) - 50 * Math.exp(-((t - 9.4) ** 2) / 1) + 6 * Math.sin(t * 3); };
      for (let i = 0; i <= N; i++) pts.push([x0 + 6 + (i / N) * (x1 - x0 - 12), nivo(i / N)]);
      let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      const kriva = el(s, 'polyline', { points: tacke(pts), fill: 'none', stroke: '#74b9ff', 'stroke-width': 3, 'stroke-dasharray': f2(L + 2), 'stroke-dashoffset': f2(L + 2) });
      const tacka = kr(s, 0, 0, 5, { fill: '#74b9ff', stroke: '#0b1826', 'stroke-width': 1.5 });
      const dog = [[0.12, '🍞', '~obrok', '#fdcb6e'], [0.24, '💉', '~insulin', '#55efc4'], [0.5, '🏃', '~glad', '#fdcb6e'], [0.6, '⬆️', '~glukagon', '#fd79a8'], [0.78, '🍎', '~obrok', '#fdcb6e'], [0.88, '💉', '~insulin', '#55efc4']];
      const ozn = dog.map(([u, e, o, b], i) => { const g = el(s, 'g'); const x = x0 + 6 + u * (x1 - x0 - 12); const gore = i % 2 === 0; poz(emo(g, e, 13), x, gore ? 20 : 162); tx(g, x, gore ? 34 : 148, o, { v: 9, b }); g.style.opacity = 0; return { g, u }; });
      return {
        trajanje: 7, pauza: 2.5,
        kadar(t) {
          const u = Math.min(1, t / 6.6);
          at(kriva, { 'stroke-dashoffset': f2((L + 2) * (1 - u)) });
          const [x, y] = na(pts, u); at(tacka, { cx: f2(x), cy: f2(y) });
          ozn.forEach((o) => { o.g.style.opacity = u >= o.u ? 1 : 0; });
        },
      };
    },

    // Kruženje materije. tip: 'voda' (isparavanje, transpiracija, kondenzacija, padavine, oticanje),
    // 'ugljenik' (fotosinteza, disanje, ishrana, razlaganje, sagorevanje), 'azot' (fiksacija, munja, amonifikacija,
    // nitrifikacija, usvajanje, denitrifikacija). istakni: id procesa – strelica treperi, umesto naziva „?“.
    kruzenje(s, m) {
      const W = 320, H = 230;
      vel(s, W, H);
      const tip = izbor(m.tip, ['voda', 'ugljenik', 'azot'], 'voda');
      const ist = lista(m.istakni), pokazi = m.natpisi ?? true;
      const cv = [], ve = [];
      if (tip === 'voda') {
        el(s, 'path', { d: 'M0,200 Q80,192 150,200 L150,230 L0,230Z', fill: 'rgba(46,134,222,.55)' });
        el(s, 'path', { d: 'M150,230 L150,200 L210,120 L250,170 L280,110 L320,180 L320,230Z', fill: '#5d4330' });
        el(s, 'path', { d: 'M150,212 C190,206 214,190 236,176', stroke: '#74b9ff', 'stroke-width': 4, fill: 'none' });
        poz(emo(s, '☀️', 28), 34, 30);
        const oblak = emo(s, '☁️', 46); poz(oblak, 190, 44);
        poz(emo(s, '🌳', 34), 112, 178);
        cv.push(['oblak', 190, 44]);
        ve.push(
          { id: 'isparavanje', o: '~isparavanje', p: [[60, 194], [80, 130], [168, 56]], b: '#74b9ff', lx: 46, ly: 120 },
          { id: 'transpiracija', o: '~transpiracija', p: [[116, 160], [130, 110], [176, 62]], b: '#55efc4', lx: 128, ly: 140, a: 'start' },
          { id: 'kondenzacija', o: '~kondenzacija', p: [[150, 30], [190, 20], [228, 30]], b: '#dfe6e9', lx: 190, ly: 8 },
          { id: 'padavine', o: '~padavine', p: [[230, 60], [246, 96], [262, 124]], b: '#74b9ff', lx: 270, ly: 70, a: 'start' },
          { id: 'oticanje', o: '~oticanje', p: [[236, 176], [200, 196], [150, 212], [100, 206]], b: '#2e86de', lx: 226, ly: 216 },
        );
      } else if (tip === 'ugljenik') {
        el(s, 'rect', { x: 0, y: 180, width: 320, height: 50, fill: B.zemlja });
        const C2 = (x, y, e, o, v = 30) => { poz(emo(s, e, v), x, y); tx(s, x, y + v / 2 + 8, o, { v: 9.5 }); };
        C2(160, 24, '☁️', 'CO₂', 34); tx(s, 192, 48, '~u vazduhu', { a: 'start', v: 9 });
        C2(56, 150, '🌳', '', 44); C2(160, 156, '🐇', '', 30); C2(268, 150, '🏭', '', 36); C2(160, 206, '🍄', '', 22);
        tx(s, 160, 222, '~razlagači', { v: 9 });
        ve.push(
          { id: 'fotosinteza', o: '~fotosinteza', p: [[140, 36], [70, 60], [56, 120]], b: '#55efc4', lx: 44, ly: 70, a: 'middle' },
          { id: 'disanje', o: '~disanje', p: [[160, 138], [160, 90], [160, 50]], b: '#b2bec3', lx: 166, ly: 96, a: 'start' },
          { id: 'ishrana', o: '~ishrana', p: [[80, 158], [118, 162], [144, 160]], b: '#fdcb6e', lx: 110, ly: 178 },
          { id: 'razlaganje', o: '~razlaganje', p: [[176, 200], [214, 180], [214, 90], [178, 44]], b: '#a29bfe', lx: 222, ly: 120, a: 'start' },
          { id: 'sagorevanje', o: '~sagorevanje', p: [[268, 128], [262, 70], [186, 30]], b: '#ff7675', lx: 290, ly: 90, a: 'middle' },
        );
      } else {
        el(s, 'rect', { x: 0, y: 132, width: 320, height: 98, fill: B.zemlja });
        tx(s, 120, 18, 'N₂', { v: 12, a: 'end' }); tx(s, 126, 18, '~u vazduhu (78%)', { v: 10, a: 'start' });
        poz(emo(s, '⚡', 22), 272, 52);
        poz(emo(s, '🫘', 30), 52, 110);
        poz(emo(s, '🐄', 26), 200, 108);
        tx(s, 70, 176, 'NH₃', { v: 12, b: '#fdcb6e' }); tx(s, 250, 176, 'NO₃⁻', { v: 12, b: '#55efc4' });
        ve.push(
          { id: 'fiksacija', o: '~azotofiksatori', p: [[110, 26], [60, 60], [52, 150]], b: '#74b9ff', lx: 10, ly: 70, a: 'start' },
          { id: 'munja', o: '~munja', p: [[272, 64], [282, 110], [262, 160]], b: C.zuta, lx: 312, ly: 112, a: 'end' },
          { id: 'nitrifikacija', o: '~nitrifikatori', p: [[96, 182], [160, 196], [226, 182]], b: '#55efc4', lx: 160, ly: 212 },
          { id: 'usvajanje', o: '~biljke usvajaju', p: [[240, 162], [160, 150], [82, 126]], b: '#55efc4', lx: 160, ly: 142 },
          { id: 'ishrana', o: '~ishrana', p: [[76, 100], [130, 96], [184, 104]], b: '#fdcb6e', lx: 130, ly: 86 },
          { id: 'denitrifikacija', o: '~razlagači', p: [[214, 92], [226, 60], [210, 28]], b: '#a29bfe', lx: 234, ly: 44, a: 'start' },
        );
      }
      const sv = ve.map((v) => {
        const je = ist.includes(v.id);
        const p = el(s, 'polyline', { points: tacke(v.p), fill: 'none', stroke: v.b, 'stroke-width': je ? 4 : 2.5, 'stroke-dasharray': '7 5', opacity: 0.85, 'stroke-linejoin': 'round' });
        const n = v.p.length, [xa, ya] = v.p[n - 2], [xb, yb] = v.p[n - 1];
        strelica(s, v.b, je ? 3.5 : 2.5).set(xa + (xb - xa) * 0.6, ya + (yb - ya) * 0.6, xb, yb);
        if (je) { kr(s, v.lx, v.ly, 10, { fill: C.zuta }); tx(s, v.lx, v.ly + 0.5, '?', { v: 14, b: C.pozadina, obrub: false }); }
        else if (pokazi) tx(s, v.lx, v.ly, v.o, { v: 9.5, a: v.a || 'middle', b: v.b === '#b2bec3' ? C.bela : v.b });
        const kap = [0, 1, 2].map(() => kr(s, 0, 0, 3, { fill: v.b }));
        return { p, v, kap, je, s0: je ? sjaj(p) : null };
      });
      return {
        kadar(t) {
          sv.forEach(({ v, kap, je, s0 }, j) => {
            kap.forEach((k, i) => { const u = (t * 0.28 + i / 3 + j * 0.13) % 1; const [x, y] = na(v.p, u); at(k, { cx: f2(x), cy: f2(y), opacity: f2(Math.min(1, u * 5, (1 - u) * 5)) }); });
            if (je) s0(talas(t, 0.8));
          });
        },
      };
    },

    // Simbioza. tip: 'lisaj' (gljiva i alge: alge daju šećer, gljiva vodu i minerale), 'mikoriza' (hife gljive
    // oko korena drveta), 'kvrzice' (kvržice sa bakterijama na korenu mahunarke vezuju azot iz vazduha).
    // Delovi – lisaj: gljiva, alge, podloga; mikoriza: koren, hife; kvrzice: koren, kvrzice.
    simbioza(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      const tip = izbor(m.tip, ['lisaj', 'mikoriza', 'kvrzice'], 'lisaj');
      const r = slucajni(6);
      const tokovi = [];
      let delovi = [];
      if (tip === 'lisaj') {
        el(s, 'rect', { x: 0, y: 176, width: 320, height: 44, fill: '#636e72' });
        const hife = el(s, 'g');
        for (let i = 0; i < 26; i++) { const x = 20 + r() * 280, y = 40 + r() * 130; put(hife, `M${f2(x)},${f2(y)} q${f2(-20 + r() * 40)},${f2(-12 + r() * 24)} ${f2(-30 + r() * 60)},${f2(-14 + r() * 28)}`, { stroke: '#dfe6e9', 'stroke-width': 2 }); }
        for (let i = 0; i < 8; i++) put(hife, `M${30 + i * 36},170 L${26 + i * 36},186`, { stroke: '#dfe6e9', 'stroke-width': 2 });
        el(s, 'path', { d: 'M10,46 C80,30 240,30 310,46', stroke: '#dfe6e9', 'stroke-width': 6, fill: 'none' });
        const alge = el(s, 'g');
        for (let i = 0; i < 16; i++) kr(alge, 26 + i * 18 + r() * 6, 74 + r() * 24, 6, { fill: '#27ae60', stroke: '#55efc4', 'stroke-width': 1.5 });
        tokovi.push({ p: [[90, 84], [110, 120], [130, 150]], b: '#ffeaa7', o: '~šećer' }, { p: [[210, 176], [200, 130], [190, 92]], b: '#74b9ff', o: '~voda i minerali' });
        delovi = [
          { id: 'alge', naziv: '~alge', ax: 280, ay: 84, lx: 312, ly: 18, a: 'end', sjaj: sjaj(...alge.children) },
          { id: 'gljiva', naziv: '~hife gljive', ax: 60, ay: 140, lx: 8, ly: 18, a: 'start', sjaj: sjaj(...hife.children) },
          { id: 'podloga', naziv: '~kamen', ax: 280, ay: 196, lx: 312, ly: 208, a: 'end' },
        ];
      } else if (tip === 'mikoriza') {
        el(s, 'rect', { x: 0, y: 40, width: 320, height: 180, fill: B.zemlja });
        el(s, 'rect', { x: 146, y: 0, width: 28, height: 50, fill: '#6d4c41' });
        const koren = el(s, 'g');
        const kor = [[160, 50, 160, 120], [160, 80, 90, 150], [160, 80, 240, 150], [160, 120, 120, 200], [160, 120, 210, 200], [90, 150, 50, 190], [240, 150, 290, 186]];
        kor.forEach(([a, b, c, d], i) => put(koren, `M${a},${b} Q${(a + c) / 2 + (i % 2 ? 10 : -10)},${(b + d) / 2} ${c},${d}`, { stroke: '#d6a46c', 'stroke-width': i < 3 ? 7 : 4, 'stroke-linecap': 'round' }));
        const hife = el(s, 'g');
        for (let i = 0; i < 40; i++) { const [a, b, c, d] = kor[i % kor.length], u = r(); const x = lerp(a, c, u), y = lerp(b, d, u); put(hife, `M${f2(x)},${f2(y)} q${f2(-24 + r() * 48)},${f2(-14 + r() * 30)} ${f2(-40 + r() * 80)},${f2(-10 + r() * 40)}`, { stroke: 'rgba(255,255,255,.75)', 'stroke-width': 1.2 }); }
        tokovi.push({ p: [[40, 210], [70, 180], [96, 152]], b: '#74b9ff', o: '~voda i minerali' }, { p: [[234, 150], [258, 166], [282, 184]], b: '#ffeaa7', o: '~šećer' });
        delovi = [
          { id: 'koren', naziv: '~koren', ax: 160, ay: 100, lx: 312, ly: 60, a: 'end', sjaj: sjaj(...koren.children) },
          { id: 'hife', naziv: '~hife gljive', ax: 120, ay: 182, lx: 8, ly: 60, a: 'start', sjaj: sjaj(...hife.children) },
        ];
      } else {
        el(s, 'rect', { x: 0, y: 60, width: 320, height: 160, fill: B.zemlja });
        poz(emo(s, '🌱', 40), 160, 36);
        const koren = el(s, 'g');
        const kor = [[160, 60, 160, 200], [160, 90, 80, 170], [160, 90, 240, 170], [160, 130, 100, 210], [160, 130, 220, 210]];
        kor.forEach(([a, b, c, d]) => put(koren, `M${a},${b} Q${(a + c) / 2},${(b + d) / 2 + 10} ${c},${d}`, { stroke: '#d6a46c', 'stroke-width': 4, 'stroke-linecap': 'round' }));
        const kv = el(s, 'g');
        for (let i = 0; i < 14; i++) { const [a, b, c, d] = kor[i % kor.length], u = 0.3 + r() * 0.6; kr(kv, lerp(a, c, u) + (r() - 0.5) * 6, lerp(b, d, u) + 4, 4.5 + r() * 2, { fill: '#fab1a0', stroke: '#e17055', 'stroke-width': 1.2 }); }
        tokovi.push({ p: [[30, 70], [40, 120], [86, 160]], b: '#74b9ff', o: 'N₂' }, { p: [[160, 70], [176, 110], [208, 160]], b: '#ffeaa7', o: '~šećer' });
        delovi = [
          { id: 'koren', naziv: '~koren', ax: 160, ay: 180, lx: 312, ly: 210, a: 'end', sjaj: sjaj(...koren.children) },
          { id: 'kvrzice', naziv: '~kvržice sa bakterijama', ax: 90, ay: 166, lx: 8, ly: 210, a: 'start', sjaj: sjaj(...kv.children) },
        ];
      }
      const tk = tokovi.map((x) => { put(s, `M${x.p.map((p) => p.join(',')).join(' L')}`, { stroke: x.b, 'stroke-width': 1.5, 'stroke-dasharray': '4 4', opacity: 0.6 }); const n = x.p.length; tx(s, x.p[n - 1][0], x.p[n - 1][1] + 12, x.o, { v: 9.5, b: x.b }); return { ...x, k: [0, 1, 2].map(() => kr(s, 0, 0, 3.2, { fill: x.b })) }; });
      const nat = natpisi(s, m, delovi);
      return {
        kadar(t) {
          tk.forEach((x, j) => x.k.forEach((k, i) => { const u = (t * 0.3 + i / 3 + j * 0.17) % 1; const [px, py] = na(x.p, u); at(k, { cx: f2(px), cy: f2(py), opacity: f2(Math.min(1, u * 5, (1 - u) * 5)) }); }));
          nat.kadar(t);
        },
      };
    },

    // Sukcesija: gola stena → lišajevi i mahovine (pionirska zajednica) → trave → žbunje → šuma (klimaks).
    // skrij: indeks stadijuma (0–4) za „?“.
    sukcesija(s, m) {
      const W = 320, H = 200;
      vel(s, W, H);
      const skrij = lista(m.skrij);
      const r = slucajni(2);
      const nazivi = [['~gola stena', ''], ['~lišajevi', '~(pionirska)'], ['~trave', ''], ['~žbunje', ''], ['~šuma', '~(klimaks)']];
      const pan = nazivi.map((n, i) => {
        const g = el(s, 'g');
        const x = 4 + i * 63;
        el(g, 'rect', { x, y: 18, width: 59, height: 132, rx: 6, fill: '#13263a', stroke: '#22384d' });
        el(g, 'path', { d: `M${x},150 L${x},${138 - i * 2} Q${x + 30},${130 - i * 3} ${x + 59},${138 - i * 2} L${x + 59},150Z`, fill: i ? B.zemlja2 : '#7f8c8d' });
        if (i === 0) for (let k = 0; k < 3; k++) el(g, 'ellipse', { cx: x + 14 + k * 16, cy: 138, rx: 10, ry: 7, fill: '#95a5a6' });
        if (i >= 1) for (let k = 0; k < 8; k++) kr(g, x + 6 + r() * 47, 132 + r() * 6, 2.5, { fill: ['#fdcb6e', '#55efc4', '#b2bec3'][k % 3] });
        if (i >= 2) for (let k = 0; k < 9; k++) { const xx = x + 5 + k * 6; put(g, `M${xx},136 q-2,-10 1,-18`, { stroke: '#7bed9f', 'stroke-width': 2 }); }
        if (i >= 3) for (const dx of [14, 44]) kr(g, x + dx, 118, 11, { fill: '#55b96a', stroke: '#1e6b3a' });
        if (i >= 4) { for (const dx of [20, 42]) { el(g, 'rect', { x: x + dx - 2, y: 64, width: 5, height: 70, fill: '#6d4c41' }); el(g, 'ellipse', { cx: x + dx, cy: 58, rx: 16, ry: 26, fill: '#27ae60', stroke: '#1e6b3a' }); } }
        const sk = skrij.includes(i);
        tx(g, x + 29.5, 164, sk ? '?' : n[0], { v: sk ? 16 : 9.5, b: sk ? C.zuta : C.bela });
        if (n[1] && !sk) tx(g, x + 29.5, 178, n[1], { v: 8.5, b: '#9fb3c8' });
        if (i < 4) strelica(s, C.zuta, 2).set(x + 56, 10, x + 70, 10);
        g.style.opacity = 0;
        return g;
      });
      return {
        trajanje: 5, pauza: 3,
        kadar(t) { pan.forEach((g, i) => { g.style.opacity = f2(glatko((t - i * 0.9) / 0.6)); }); },
      };
    },

    // Efekat staklene bašte: sunčevi zraci greju tlo, tlo zrači toplotu, a gasovi (CO₂, metan, vodena para) je deo
    // vraćaju. pojacan: true – više gasova, manje toplote odlazi u svemir, termometar raste.
    staklena(s, m) {
      const W = 320, H = 220;
      vel(s, W, H);
      const poj = !!m.pojacan;
      poz(emo(s, '☀️', 30), 30, 26);
      el(s, 'path', { d: 'M0,70 Q160,50 320,70', stroke: 'rgba(116,185,255,.5)', 'stroke-width': poj ? 22 : 12, fill: 'none' });
      const r = slucajni(8);
      for (let i = 0; i < (poj ? 40 : 14); i++) { const x = 8 + r() * 304; kr(s, x, 62 - Math.abs(x - 160) * 0.04 + (r() - 0.5) * (poj ? 16 : 8), 2.4, { fill: '#b2bec3' }); }
      tx(s, 8, 92, 'CO₂, CH₄, H₂O', { a: 'start', v: 8.5, b: '#b2bec3' });
      tx(s, 312, 92, '~gasovi staklene bašte', { a: 'end', v: 9, b: '#74b9ff' });
      el(s, 'path', { d: 'M0,190 Q160,174 320,190 L320,220 L0,220Z', fill: '#2d8a47' });
      const zr = [0, 1, 2].map(() => lin(s, 0, 0, 0, 0, C.zuta, 3));
      const tp = [0, 1, 2, 3].map(() => put(s, '', { stroke: '#ff7675', 'stroke-width': 2.5 }));
      const term = el(s, 'g');
      el(term, 'rect', { x: 290, y: 110, width: 10, height: 60, rx: 5, fill: '#13263a', stroke: '#dfe6e9', 'stroke-width': 1.5 });
      kr(term, 295, 174, 8, { fill: '#ff7675' });
      const stub = el(term, 'rect', { x: 292.5, y: 150, width: 5, height: 24, fill: '#ff7675' });
      const tlab = tx(s, 284, 120, '', { a: 'end', v: 10, b: '#ff7675' });
      const talasP = (x, y0, y1, faza) => { let d = `M${f2(x)},${y0}`; for (let y = y0; y >= y1; y -= 4) d += ` L${f2(x + 5 * Math.sin((y + faza) / 5))},${y}`; return d; };
      return {
        kadar(t) {
          zr.forEach((z, i) => { const u = (t * 0.5 + i / 3) % 1; const x = 60 + i * 70; at(z, { x1: f2(x - 30 + u * 30), y1: f2(30 + u * 140 - 20), x2: f2(x - 22 + u * 30), y2: f2(30 + u * 140), opacity: f2(Math.min(1, (1 - u) * 6)) }); });
          tp.forEach((p, i) => {
            const u = (t * 0.4 + i / 4) % 1;
            const x = 70 + i * 60;
            const zarobljen = poj ? i !== 3 : i % 2 === 0;
            const yv = 180 - u * 150;
            const y = zarobljen && yv < 76 ? 76 + (76 - yv) : yv;
            at(p, { d: talasP(x, f2(y + 22), f2(y), t * 30), opacity: f2(Math.min(1, (1 - u) * 4)) });
          });
          const h = poj ? Math.min(46, 24 + t * 4) : 24;
          at(stub, { y: f2(174 - h), height: f2(h) });
          postaviTekst(tlab, `${(15 + (h - 24) / 10).toFixed(1).replace('.', ',')} °C`);
        },
      };
    },

    // Jaje kopnenih kičmenjaka (gmizavci, ptice) sa omotačima. Delovi: ljuska, horion, amnion, alantois, zumance, embrion.
    jaje(s, m) {
      const W = 320, H = 210;
      vel(s, W, H);
      const ljuska = el(s, 'ellipse', { cx: 140, cy: 105, rx: 120, ry: 92, fill: '#f5ecd7', stroke: '#dfe6e9', 'stroke-width': 4 });
      const horion = el(s, 'ellipse', { cx: 140, cy: 105, rx: 110, ry: 82, fill: 'rgba(250,177,160,.25)', stroke: '#e17055', 'stroke-width': 2 });
      const alantois = el(s, 'ellipse', { cx: 196, cy: 74, rx: 42, ry: 30, fill: 'rgba(162,155,254,.45)', stroke: '#a29bfe', 'stroke-width': 2 });
      const zum = el(s, 'ellipse', { cx: 130, cy: 150, rx: 54, ry: 30, fill: '#fdcb6e', stroke: '#e1a82c', 'stroke-width': 2 });
      const amnion = el(s, 'ellipse', { cx: 118, cy: 82, rx: 46, ry: 36, fill: 'rgba(116,185,255,.45)', stroke: '#74b9ff', 'stroke-width': 2 });
      const emb = el(s, 'path', { d: 'M100,76 C100,58 132,56 136,76 C140,96 120,106 108,98 C100,92 112,84 118,90', stroke: '#ff7675', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' });
      put(s, 'M120,100 C124,116 128,126 130,128', { stroke: '#e17055', 'stroke-width': 2 });
      const mehur = [0, 1, 2].map(() => kr(s, 0, 0, 3, { fill: 'rgba(223,230,233,.8)' }));
      const delovi = [
        { id: 'ljuska', naziv: '~ljuska', ax: 254, ay: 120, lx: 316, ly: 150, a: 'end', sjaj: sjaj(ljuska) },
        { id: 'horion', naziv: '~horion', ax: 240, ay: 140, lx: 316, ly: 186, a: 'end', sjaj: sjaj(horion) },
        { id: 'alantois', naziv: '~alantois', ax: 220, ay: 60, lx: 316, ly: 22, a: 'end', sjaj: sjaj(alantois) },
        { id: 'amnion', naziv: '~amnion', ax: 86, ay: 64, lx: 8, ly: 14, a: 'start', sjaj: sjaj(amnion) },
        { id: 'embrion', naziv: '~zametak', ax: 104, ay: 70, lx: 8, ly: 50, a: 'start', sjaj: sjaj(emb) },
        { id: 'zumance', naziv: '~žumančana kesa', ax: 92, ay: 160, lx: 8, ly: 202, a: 'start', sjaj: sjaj(zum) },
      ];
      const nat = natpisi(s, m, delovi);
      return {
        kadar(t) {
          const p = 1 + 0.04 * Math.max(0, Math.sin(t * 7));
          emb.setAttribute('transform', `translate(118 82) scale(${f2(p)}) translate(-118 -82)`);
          mehur.forEach((k, i) => { const u = (t * 0.35 + i / 3) % 1; at(k, { cx: f2(210 + i * 10 + u * 40), cy: f2(40 - u * 30 + i * 8), opacity: f2(Math.sin(u * Math.PI)) }); });
          nat.kadar(t);
        },
      };
    },

    // Izlazak na kopno: riba → riba šakoperka (mesnata peraja) → vodozemac → gmizavac (jaje sa ljuskom).
    // skrij: indeks (0–3) za „?“.
    kopno(s, m) {
      const W = 320, H = 190;
      vel(s, W, H);
      const skrij = lista(m.skrij);
      el(s, 'rect', { x: 0, y: 100, width: 150, height: 90, fill: 'rgba(46,134,222,.45)' });
      el(s, 'path', { d: 'M150,100 Q200,96 320,92 L320,190 L150,190Z', fill: '#7a5a3f' });
      el(s, 'path', { d: 'M150,100 Q160,140 170,190', stroke: '#c2a25a', 'stroke-width': 3, fill: 'none' });
      const sk = (g, x, y) => { kr(g, x, y, 15, { fill: C.zuta }); tx(g, x, y + 0.5, '?', { v: 18, b: C.pozadina, obrub: false }); };
      const fig = [
        (g) => poz(emo(g, '🐟', 30), 38, 132),
        (g) => {
          el(g, 'ellipse', { cx: 110, cy: 124, rx: 26, ry: 10, fill: '#8395a7', stroke: '#c8d6e5', 'stroke-width': 1.5 });
          el(g, 'path', { d: 'M84,124 L70,114 L72,134Z', fill: '#8395a7' });
          for (const [x, y, a] of [[118, 134, 30], [100, 134, 30]]) el(g, 'ellipse', { cx: x, cy: y + 4, rx: 8, ry: 4, fill: '#576574', transform: `rotate(${a} ${x} ${y + 4})` });
          kr(g, 128, 120, 2, { fill: '#0b1826' });
        },
        (g) => poz(emo(g, '🐸', 30), 206, 80),
        (g) => poz(emo(g, '🦎', 32), 280, 74),
      ];
      const naz = ['~riba', '~šakoperka', '~vodozemac', '~gmizavac'];
      const xs = [38, 110, 206, 280];
      const gr = fig.map((f, i) => {
        const g = el(s, 'g');
        if (skrij.includes(i) && i !== 1) sk(g, xs[i], i < 2 ? 132 : 78); else f(g);
        tx(g, xs[i], 170, skrij.includes(i) ? '?' : naz[i], { v: skrij.includes(i) ? 16 : 10, b: skrij.includes(i) ? C.zuta : C.bela });
        g.style.opacity = 0;
        return g;
      });
      tx(s, 8, 14, '~voda', { a: 'start', v: 9, b: '#74b9ff' }); tx(s, 312, 14, '~kopno', { a: 'end', v: 9, b: '#d6a46c' });
      const str = [0, 1, 2].map((i) => { const a = strelica(s, C.zuta, 2).set(xs[i] + 18, 40, xs[i + 1] - 18, 40); a.g.style.opacity = 0; return a.g; });
      return {
        trajanje: 4.5, pauza: 3,
        kadar(t) { gr.forEach((g, i) => { g.style.opacity = f2(glatko((t - i) / 0.6)); }); str.forEach((g, i) => { g.style.opacity = f2(glatko((t - i - 0.7) / 0.4)); }); },
      };
    },

    // Grčenje mišića: niti aktina klize preko niti miozina, pa se deo mišićnog vlakna skraćuje.
    kontrakcija(s, m) {
      const W = 320, H = 180;
      vel(s, W, H);
      const zl = lin(s, 0, 30, 0, 150, '#dfe6e9', 5), zd = lin(s, 0, 30, 0, 150, '#dfe6e9', 5);
      const akt = [], mio = [];
      for (let i = 0; i < 4; i++) { const y = 42 + i * 32; akt.push([lin(s, 0, y, 0, y, '#74b9ff', 3), lin(s, 0, y, 0, y, '#74b9ff', 3)]); }
      for (let i = 0; i < 3; i++) { const y = 58 + i * 32; mio.push(el(s, 'rect', { x: 110, y: y - 5, width: 100, height: 10, rx: 5, fill: '#e17055' })); for (let k = 0; k < 8; k++) lin(s, 114 + k * 12, y - 9, 120 + k * 12, y - 5, '#fab1a0', 1.5), lin(s, 114 + k * 12, y + 9, 120 + k * 12, y + 5, '#fab1a0', 1.5); }
      tx(s, 40, 168, '~aktin', { v: 10, b: '#74b9ff' }); tx(s, 160, 168, '~miozin', { v: 10, b: '#e17055' });
      const st = tx(s, 160, 14, '', { v: 11, b: C.zuta });
      return {
        kadar(t) {
          const u = 0.5 - 0.5 * Math.cos(t * 1.4);
          const xl = lerp(30, 76, u), xd = lerp(290, 244, u);
          at(zl, { x1: f2(xl), x2: f2(xl) }); at(zd, { x1: f2(xd), x2: f2(xd) });
          akt.forEach(([a, b], i) => { const y = 42 + i * 32; at(a, { x1: f2(xl), y1: y, x2: f2(xl + 90), y2: y }); at(b, { x1: f2(xd), y1: y, x2: f2(xd - 90), y2: y }); });
          postaviTekst(st, u > 0.6 ? '~zgrčen' : u < 0.4 ? '~opušten' : '');
        },
      };
    },

    // Matične ćelije: matična ćelija se deli – jedna ćerka ostaje matična (samoobnavljanje), a druge se
    // diferenciraju u nervnu, mišićnu, masnu ćeliju i crveno krvno zrnce.
    maticne(s, m) {
      const W = 320, H = 210;
      vel(s, W, H);
      const cx = 80, cy = 105;
      const mat = el(s, 'g'); kr(mat, 0, 0, 20, { fill: 'rgba(162,155,254,.4)', stroke: '#a29bfe', 'stroke-width': 2.5 }); kr(mat, 0, 0, 8, { fill: B.jedro }); poz(mat, cx, cy);
      tx(s, cx, cy + 34, '~matična ćelija', { v: 10 });
      const kopija = el(s, 'g'); kr(kopija, 0, 0, 14, { fill: 'rgba(162,155,254,.4)', stroke: '#a29bfe', 'stroke-width': 2 }); kr(kopija, 0, 0, 5, { fill: B.jedro });
      const sam = tx(s, 40, 26, '~samoobnavljanje', { v: 9.5, b: '#a29bfe' });
      const cilj = [
        { y: 30, o: '~nervna', crt: (g) => { kr(g, 0, 0, 8, { fill: 'rgba(250,177,160,.5)', stroke: '#fab1a0', 'stroke-width': 2 }); lin(g, 8, 0, 40, 0, '#fab1a0', 2.5); for (const a of [2.2, 2.8, 3.6, 4.1]) lin(g, 0, 0, 16 * Math.cos(a), 16 * Math.sin(a), '#fab1a0', 2); } },
        { y: 80, o: '~mišićna', crt: (g) => { el(g, 'ellipse', { cx: 14, cy: 0, rx: 26, ry: 6, fill: B.misic, stroke: '#ff7675' }); kr(g, 14, 0, 2.5, { fill: B.jedro }); } },
        { y: 130, o: '~masna', crt: (g) => { kr(g, 6, 0, 14, { fill: 'rgba(255,234,167,.6)', stroke: '#fdcb6e', 'stroke-width': 2 }); kr(g, -4, -9, 3, { fill: B.jedro }); } },
        { y: 180, o: '~crveno krvno zrnce', crt: (g) => { el(g, 'ellipse', { cx: 6, cy: 0, rx: 14, ry: 9, fill: '#e74c3c', stroke: '#ff7675', 'stroke-width': 1.5 }); el(g, 'ellipse', { cx: 6, cy: 0, rx: 6, ry: 3.5, fill: '#c0392b' }); } },
      ];
      const ce = cilj.map((c) => { const g = el(s, 'g'); const pom = el(s, 'g'); kr(pom, 0, 0, 12, { fill: 'rgba(162,155,254,.35)', stroke: '#a29bfe', 'stroke-width': 1.5 }); c.crt(g); poz(g, 230, c.y); const t2 = tx(s, 262 + (c.o === '~nervna' ? 14 : 0), c.y, c.o, { a: 'start', v: 9.5 }); const a = strelica(s, '#5d7a96', 1.5).set(cx + 26, cy, 210, c.y); return { g, pom, t2, c, a: a.g }; });
      return {
        trajanje: 6, pauza: 2,
        kadar(t) {
          const d = glatko((t - 0.3) / 0.8);
          poz(kopija, lerp(cx, 40, d), lerp(cy, 56, d)); kopija.style.opacity = f2(d); sam.style.opacity = f2(d);
          ce.forEach((x, i) => {
            const u = glatko((t - 1.2 - i * 0.9) / 0.9);
            poz(x.pom, lerp(cx, 230, u), lerp(cy, x.c.y, u));
            x.pom.style.opacity = f2(u > 0 && u < 1 ? 1 : 0);
            x.g.style.opacity = f2(u >= 1 ? 1 : 0); x.t2.style.opacity = x.g.style.opacity; x.a.style.opacity = f2(u > 0 ? 0.7 : 0);
          });
        },
      };
    },
  };

  function prikazi(k, m) {
    const f = Object.hasOwn(SCENE, m.scena) ? SCENE[m.scena] : null;
    if (!f || !A.el) return () => {};
    const d = document.createElement('div');
    d.className = 'medij-svg medij-fizika';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'fizika');
    d.appendChild(svg);
    const sc = f(svg, m || {});
    k.appendChild(d); // tek gotov crtež ulazi u stranicu (preslovljavanje natpisa ide jednom)
    return pokreni(svg, sc);
  }

  const API = { prikazi, SCENE: Object.keys(SCENE) };
  if (typeof window !== 'undefined') window.Biologija = API;
  if (typeof module !== 'undefined') module.exports = { SCENE: Object.keys(SCENE) };
})();
