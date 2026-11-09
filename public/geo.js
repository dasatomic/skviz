// Geometrijski crteži za matematičke zadatke (medij „geo“).
// Crtež se opisuje tačkama i elementima, a rešenje zadatka ga prikazuje korak po korak
// (elementi sa `k: n` pojavljuju se od n-tog koraka, a korak ističe elemente iz `i`).
//
//   { "vrsta": "geo",
//     "t": { "A": [0, 0], "B": [4, 0], "C": [4, 3, 45] },   // x, y (y nagore); treći broj = smer oznake u stepenima
//     "e": [
//       { "p": "ABC", "id": "tr" },                // mnogougao (popunjen)
//       { "d": "AB", "o": "4 cm" },                // duž sa oznakom; "isp": 1 = isprekidana; "os": -1 = oznaka sa druge strane; "na": 0.7 = mesto oznake duž duži
//       { "pu": "ABC" },                           // pravi ugao kod B
//       { "u": "BAC", "o": "37°" },                // ugao kod A
//       { "kr": "O", "r": 5 }  ili  { "kr": "O", "kroz": "A" }, // kružnica
//       { "l": "O", "r": 5, "od": 0, "do": 90 },  // kružni luk (stepeni, matematički smer)
//       { "tx": "h", "at": [2, 1] },               // slobodan tekst; "~tekst" se preslovljava
//       { "tacka": "M" },                          // istaknuta tačka (kružić)
//       { "osa": [-1, 5] },                        // brojevna prava
//       { "mreza": [-1, 6, -1, 5] }                // koordinatna ravan
//     ] }
// Zajednička polja elemenata: "id", "k" (korak od kog se vidi), "b" (boja 0–5), "isp" (isprekidano).
(function () {
  'use strict';
  const BOJE = ['#74b9ff', '#fd79a8', '#55efc4', '#ffeaa7', '#a29bfe', '#fab1a0'];
  const IME = /[A-Z][0-9₀-₉']*|[a-z][0-9]*/g;
  const imena = (s) => (Array.isArray(s) ? s : String(s).match(IME) || []);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function crtajGeo(m, { korak = 0, istakni = [], prevod = (x) => x } = {}) {
    const T = m.t || {};
    const ist = new Set(istakni || []);
    const sve = (m.e || []).filter((e) => (e.k || 0) <= korak);
    // ── granice crteža ──
    const xs = [], ys = [];
    const dodaj = (x, y) => { xs.push(x); ys.push(y); };
    const koriscene = new Set();
    for (const e of sve) {
      for (const kljuc of ['p', 'd', 'u', 'pu', 'tacka']) if (e[kljuc]) imena(e[kljuc]).forEach((n) => koriscene.add(n));
      if (e.kr) koriscene.add(e.kr);
    }
    for (const n of Object.keys(T)) dodaj(T[n][0], T[n][1]);
    const poluprecnik = (e) => e.r ?? (e.kroz && T[e.kroz] && T[e.c] ? Math.hypot(T[e.kroz][0] - T[e.c][0], T[e.kroz][1] - T[e.c][1]) : 1);
    for (const e of sve) {
      if (e.kr || e.l) {
        const c = T[e.kr || e.l]; if (!c) continue;
        const r = poluprecnik({ ...e, c: e.kr || e.l });
        if (e.kr) { dodaj(c[0] - r, c[1] - r); dodaj(c[0] + r, c[1] + r); }
        else for (let a = e.od ?? 0; a <= (e.do ?? 360); a += 5) dodaj(c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180));
      }
      if (e.at) dodaj(e.at[0], e.at[1]);
      if (e.osa) { dodaj(e.osa[0], 0); dodaj(e.osa[1], 0); }
      if (e.mreza) { dodaj(e.mreza[0], e.mreza[2]); dodaj(e.mreza[1], e.mreza[3]); }
    }
    if (!xs.length) dodaj(0, 0);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const raspon = Math.max(x1 - x0, y1 - y0, 1e-6);
    const s = (m.velicina || 300) / raspon;
    const PAD = 44;
    const W = (x1 - x0) * s + 2 * PAD, H = (y1 - y0) * s + 2 * PAD + (sve.some((e) => e.osa) ? 18 : 0);
    const P = (x, y) => [PAD + (x - x0) * s, PAD + (y1 - y) * s];
    const Pn = (n) => (T[n] ? P(T[n][0], T[n][1]) : [0, 0]);
    // težište svih tačaka – oznake se odmiču od njega
    const tez = (() => {
      const n = Object.keys(T).filter((k) => koriscene.has(k));
      if (!n.length) return [W / 2, H / 2];
      const pts = n.map(Pn);
      return [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
    })();
    const f = (v) => +v.toFixed(1);
    const klasa = (e) => `${ist.has(e.id) ? 'ist' : ''} ${korak > 0 && e.k === korak ? 'novo' : ''}`.trim();
    const boja = (e, pod = '#fff') => (e.b !== undefined ? BOJE[e.b % BOJE.length] : pod);
    const tekst = (x, y, t, e, dod = '') => {
      const prevesti = String(t).startsWith('~');
      const sadrzaj = prevesti ? prevod(String(t).slice(1)) : t;
      // oznaka ne sme da izađe iz crteža
      const pola = [...String(sadrzaj)].length * 4.6 + 3;
      x = Math.max(pola, Math.min(W - pola, x));
      y = Math.max(14, Math.min(H - 4, y));
      return `<text x="${f(x)}" y="${f(y)}" class="oznaka ${klasa(e)}" ${prevesti ? '' : 'data-lat'} ${dod}>${esc(sadrzaj)}</text>`;
    };
    let dno = '', sredina = '', vrh = '';

    for (const e of sve) {
      const kl = klasa(e);
      const crt = e.isp ? ' stroke-dasharray="7 6"' : '';
      if (e.mreza) {
        const [a, b, c, d] = e.mreza;
        for (let x = Math.ceil(a); x <= b; x++) { const [X, Y1] = P(x, c), [, Y2] = P(x, d); dno += `<line x1="${f(X)}" y1="${f(Y1)}" x2="${f(X)}" y2="${f(Y2)}" class="mreza${x === 0 ? ' osa' : ''}"/>`; if (x) dno += `<text x="${f(X)}" y="${f(P(0, 0)[1] + 15)}" class="broj" data-lat>${x}</text>`; }
        for (let y = Math.ceil(c); y <= d; y++) { const [X1, Y] = P(a, y), [X2] = P(b, y); dno += `<line x1="${f(X1)}" y1="${f(Y)}" x2="${f(X2)}" y2="${f(Y)}" class="mreza${y === 0 ? ' osa' : ''}"/>`; if (y) dno += `<text x="${f(P(0, 0)[0] - 9)}" y="${f(Y + 5)}" class="broj" data-lat>${y}</text>`; }
        dno += `<text x="${f(P(0, 0)[0] - 9)}" y="${f(P(0, 0)[1] + 15)}" class="broj" data-lat>0</text>`;
      } else if (e.osa) {
        const [a, b] = e.osa;
        const [X1, Y] = P(a, 0), [X2] = P(b, 0);
        dno += `<line x1="${f(X1 - 10)}" y1="${f(Y)}" x2="${f(X2 + 14)}" y2="${f(Y)}" class="brojevna"/><path d="M${f(X2 + 14)},${f(Y)} l-9,-5 v10 z" fill="#fff"/>`;
        for (let x = Math.ceil(a); x <= b; x++) { const [X] = P(x, 0); dno += `<line x1="${f(X)}" y1="${f(Y - 6)}" x2="${f(X)}" y2="${f(Y + 6)}" class="brojevna"/><text x="${f(X)}" y="${f(Y + 22)}" class="broj" data-lat>${x}</text>`; }
      } else if (e.p) {
        const pts = imena(e.p).map(Pn);
        const c = boja(e, BOJE[0]);
        dno += `<polygon points="${pts.map((p) => p.map(f).join(',')).join(' ')}" fill="${c}" fill-opacity="${e.prazno ? 0 : 0.2}" stroke="${c}" stroke-width="2.5" stroke-linejoin="round" class="lik ${kl}"${crt}/>`;
        if (e.o) { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length; vrh += tekst(cx, cy + 5, e.o, e); }
      } else if (e.d) {
        const [a, b] = imena(e.d).map(Pn);
        sredina += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${boja(e)}" stroke-width="2.5" stroke-linecap="round" class="duz ${kl}"${crt}/>`;
        if (e.o) {
          const na = e.na ?? 0.5; // gde je oznaka duž duži (0–1)
          const mx = a[0] + (b[0] - a[0]) * na, my = a[1] + (b[1] - a[1]) * na;
          const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
          let nx = -dy / L, ny = dx / L;
          if ((mx + nx - tez[0]) ** 2 + (my + ny - tez[1]) ** 2 < (mx - nx - tez[0]) ** 2 + (my - ny - tez[1]) ** 2) { nx = -nx; ny = -ny; }
          if (e.os === -1) { nx = -nx; ny = -ny; }
          const duz = String(e.o).length;
          const pom = 12 + Math.abs(nx) * duz * 3.6;
          vrh += tekst(mx + nx * pom, my + ny * pom + 5, e.o, e);
        }
      } else if (e.u || e.pu) {
        const [p, v, q] = imena(e.u || e.pu).map(Pn);
        const u1 = Math.atan2(p[1] - v[1], p[0] - v[0]), u2 = Math.atan2(q[1] - v[1], q[0] - v[0]);
        let raz = u2 - u1;
        while (raz <= -Math.PI) raz += 2 * Math.PI;
        while (raz > Math.PI) raz -= 2 * Math.PI;
        const pola = u1 + raz / 2;
        const c = boja(e, '#ffeaa7');
        if (e.pu) {
          const r = 12;
          const a = [v[0] + r * Math.cos(u1), v[1] + r * Math.sin(u1)], b = [v[0] + r * Math.cos(u2), v[1] + r * Math.sin(u2)];
          const d = [a[0] + b[0] - v[0], a[1] + b[1] - v[1]];
          sredina += `<path d="M${f(a[0])},${f(a[1])} L${f(d[0])},${f(d[1])} L${f(b[0])},${f(b[1])}" fill="none" stroke="${c}" stroke-width="2" class="ugao ${kl}"/>`;
          sredina += `<circle cx="${f(v[0] + 6 * Math.SQRT2 * Math.cos(pola))}" cy="${f(v[1] + 6 * Math.SQRT2 * Math.sin(pola))}" r="1.8" fill="${c}"/>`;
        } else {
          const r = e.r || 22;
          const a = [v[0] + r * Math.cos(u1), v[1] + r * Math.sin(u1)], b = [v[0] + r * Math.cos(u2), v[1] + r * Math.sin(u2)];
          sredina += `<path d="M${f(v[0])},${f(v[1])} L${f(a[0])},${f(a[1])} A${r},${r} 0 0 ${raz > 0 ? 1 : 0} ${f(b[0])},${f(b[1])} Z" fill="${c}" fill-opacity=".25" stroke="${c}" stroke-width="2" class="ugao ${kl}"/>`;
          if (e.o) { const ro = r + 16 + String(e.o).length * 2; vrh += tekst(v[0] + ro * Math.cos(pola), v[1] + ro * Math.sin(pola) + 5, e.o, e); }
        }
      } else if (e.kr || e.l) {
        const c0 = Pn(e.kr || e.l);
        const r = poluprecnik({ ...e, c: e.kr || e.l }) * s;
        const c = boja(e, '#a29bfe');
        if (e.kr) sredina += `<circle cx="${f(c0[0])}" cy="${f(c0[1])}" r="${f(r)}" fill="none" stroke="${c}" stroke-width="2.2" class="krug ${kl}"${crt}/>`;
        else {
          const a1 = ((e.od ?? 0) * Math.PI) / 180, a2 = ((e.do ?? 90) * Math.PI) / 180;
          const A = [c0[0] + r * Math.cos(a1), c0[1] - r * Math.sin(a1)], B = [c0[0] + r * Math.cos(a2), c0[1] - r * Math.sin(a2)];
          sredina += `<path d="M${f(A[0])},${f(A[1])} A${f(r)},${f(r)} 0 ${a2 - a1 > Math.PI ? 1 : 0} 0 ${f(B[0])},${f(B[1])}" fill="none" stroke="${c}" stroke-width="2.2" class="krug ${kl}"${crt || ' stroke-dasharray="5 5"'}/>`;
        }
      } else if (e.tx !== undefined) {
        const [x, y] = P(e.at[0], e.at[1]);
        vrh += tekst(x, y + 5, e.tx, e, e.b !== undefined ? `fill="${boja(e)}"` : '');
      }
      if (e.tacka) for (const n of imena(e.tacka)) { const [x, y] = Pn(n); vrh += `<circle cx="${f(x)}" cy="${f(y)}" r="4.5" fill="${boja(e, '#ffeaa7')}" class="${kl}"/>`; }
    }
    // imena tačaka (velika slova; mala slova su pomoćne tačke bez oznake)
    for (const n of Object.keys(T)) {
      if (!koriscene.has(n) || !/^[A-Z]/.test(n) || (m.bezImena || []).includes(n)) continue;
      const [x, y] = Pn(n);
      let ug;
      if (T[n][2] !== undefined) ug = (-T[n][2] * Math.PI) / 180;
      else ug = Math.atan2(y - tez[1], x - tez[0]);
      if (!isFinite(ug) || (Math.abs(x - tez[0]) < 0.5 && Math.abs(y - tez[1]) < 0.5)) ug = -Math.PI / 2;
      vrh += `<text x="${f(x + 15 * Math.cos(ug))}" y="${f(y + 15 * Math.sin(ug) + 5)}" class="ime-tacke" data-lat>${esc(n)}</text>`;
    }
    return `<svg viewBox="0 0 ${f(W)} ${f(H)}" class="geo" xmlns="http://www.w3.org/2000/svg">${dno}${sredina}${vrh}</svg>`;
  }

  window.Geo = { crtajGeo };
})();
