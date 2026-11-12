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
