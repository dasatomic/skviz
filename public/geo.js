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
//       { "osa": [-1, 5] },                        // brojevna prava; "podela": 0.1 = razmak podeoka, "svaki": 5 = broj na svakom 5. podeoku
//       { "mreza": [-1, 6, -1, 5] },               // koordinatna ravan; "ose": ["x", "y"] = imena osa
//       { "is": "O", "r": 5, "od": 0, "do": 90 },  // popunjen kružni isečak; "r0": 3 = isečak prstena (360° = ceo prsten)
//       { "lin": [[0, 0], [1, 2], …] },            // izlomljena linija / grafik (koordinate); "zatv": 1 = popunjen lik
//       { "kr": "O", "r": 5, "pun": 1 }            // popunjen krug
//     ] }
// Zajednička polja elemenata: "id", "k" (korak od kog se vidi), "kraj" (korak od kog se više ne vidi), "b" (boja 0–5), "isp" (isprekidano).
// Strelica: "str": 1 na duži ili luku (vrh na kraju).
// Animirana rotacija: { "p": "ABC", "okreni": 90, "oko": "O" } – lik se crta na početnom mestu i okreće
// (pozitivan ugao = suprotno od kazaljke na satu) do novog položaja, pri svakom prikazu koraka.
// Ostale animacije (na bilo kom elementu):
//   "pomeri": [dx, dy]  – lik klizi za vektor (translacija, „prenošenje“ duži)
//   "odrazi": "MN"      – lik se presavija preko prave MN (osna simetrija) i ostaje kao odraz
//                         (natpis „o“ ostaje na mestu – oznake odraza dodaj kao posebne elemente)
//   "crtaj": 1          – linija/luk/krug/lik se „iscrtava“ (šestar, skokovi po brojevnoj pravoj)
//   "kasni": 0.8        – početak animacije u sekundama (za redosled), "trajanje": 1.6
//   "ponovi": 1         – animacija se ponavlja (uz pauzu), npr. kazaljke sata uz pitanje
(function () {
  'use strict';
  const BOJE = ['#74b9ff', '#fd79a8', '#55efc4', '#ffeaa7', '#a29bfe', '#fab1a0'];
  const IME = /[A-Z][0-9₀-₉']*|[a-z][0-9]*/g;
  const imena = (s) => (Array.isArray(s) ? s : String(s).match(IME) || []);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function crtajGeo(m, { korak = 0, istakni = [], prevod = (x) => x } = {}) {
    const T = m.t || {};
    const ist = new Set(istakni || []);
    const sve = (m.e || []).filter((e) => (e.k || 0) <= korak && !(e.kraj <= korak));
    // ── granice crteža ──
    const xs = [], ys = [];
    const dodaj = (x, y) => { xs.push(x); ys.push(y); };
    const koriscene = new Set();
    for (const e of sve) {
      for (const kljuc of ['p', 'd', 'u', 'pu', 'tacka']) if (e[kljuc]) imena(e[kljuc]).forEach((n) => koriscene.add(n));
      for (const kljuc of ['kr', 'is', 'oko']) if (e[kljuc]) koriscene.add(e[kljuc]);
    }
    for (const n of Object.keys(T)) dodaj(T[n][0], T[n][1]);
    const poluprecnik = (e) => e.r ?? (e.kroz && T[e.kroz] && T[e.c] ? Math.hypot(T[e.kroz][0] - T[e.c][0], T[e.kroz][1] - T[e.c][1]) : 1);
    for (const e of sve) {
      if (e.kr || e.l || e.is) {
        const c = T[e.kr || e.l || e.is]; if (!c) continue;
        const r = poluprecnik({ ...e, c: e.kr || e.l || e.is });
        if (e.kr) { dodaj(c[0] - r, c[1] - r); dodaj(c[0] + r, c[1] + r); }
        else for (let a = e.od ?? 0; a <= (e.do ?? 360); a += 5) dodaj(c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180));
        if (e.is && !e.r0) dodaj(c[0], c[1]);
      }
      if (e.okreni && T[e.oko]) {
        // rotirani lik takođe mora da stane u crtež
        const [ox, oy] = T[e.oko], fi = (e.okreni * Math.PI) / 180;
        for (const n of imena(e.p || e.d || '')) if (T[n]) {
          const dx = T[n][0] - ox, dy = T[n][1] - oy;
          dodaj(ox + dx * Math.cos(fi) - dy * Math.sin(fi), oy + dx * Math.sin(fi) + dy * Math.cos(fi));
        }
      }
      if ((e.pomeri || e.odrazi) && !e.okreni) {
        // pomereni ili odraženi lik takođe mora da stane u crtež
        const pts = [...(e.u || e.pu ? [imena(e.u || e.pu)[1]] : imena(e.p || e.d || '')).filter((n) => T[n]).map((n) => T[n]), ...(e.lin || []), ...(e.at ? [e.at] : [])];
        for (const [x, y] of pts) {
          if (e.pomeri) dodaj(x + e.pomeri[0], y + e.pomeri[1]);
          const [m1, m2] = imena(e.odrazi || '').map((n) => T[n]);
          if (m1 && m2) {
            const dx = m2[0] - m1[0], dy = m2[1] - m1[1], L2 = dx * dx + dy * dy || 1;
            const t = ((x - m1[0]) * dx + (y - m1[1]) * dy) / L2, px = m1[0] + t * dx, py = m1[1] + t * dy;
            dodaj(2 * px - x, 2 * py - y);
          }
        }
      }
      if (e.lin) for (const [x, y] of e.lin) dodaj(x, y);
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
    // element koji se „iscrtava“ ne dobija i „novo“ (CSS animacija bi u Chrome-u zaustavila iscrtavanje)
    const klasa = (e) => `${ist.has(e.id) ? 'ist' : ''} ${korak > 0 && e.k === korak && !(e.crtaj && !e.isp) ? 'novo' : ''}`.trim();
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
    const broj = (x) => String(+x.toFixed(4)).replace('.', ',').replace('-', '−');
    // vrh strelice u tački b, usmeren od a ka b
    const strelica = (a, b, c) => {
      const u = Math.atan2(b[1] - a[1], b[0] - a[0]), l = 11, s = 0.45;
      const p1 = [b[0] - l * Math.cos(u - s), b[1] - l * Math.sin(u - s)], p2 = [b[0] - l * Math.cos(u + s), b[1] - l * Math.sin(u + s)];
      return `<path d="M${f(b[0])},${f(b[1])} L${f(p1[0])},${f(p1[1])} L${f(p2[0])},${f(p2[1])} Z" fill="${c}"/>`;
    };
    // animacije lika: rotacija oko tačke, pomeranje, presavijanje preko prave
    // (u SVG-u y ide nadole, pa je matematički pozitivan ugao negativan)
    const vreme = (e, pod = 1.6) => {
      const dur = e.trajanje || pod, kas = e.kasni ?? 0.25;
      // „ponovi“: animacija traje dur, pa pauza, pa ispočetka
      if (!e.ponovi) return { attr: `begin="${kas}s" dur="${dur}s" fill="freeze"`, kt: '0;1', ks: '0.45 0 0.25 1', vr: (a, b) => `${a};${b}` };
      const uk = dur + 1.8, t1 = +(dur / uk).toFixed(3);
      return { attr: `begin="${kas}s" dur="${uk}s" repeatCount="indefinite"`, kt: `0;${t1};1`, ks: '0.45 0 0.25 1;0 0 1 1', vr: (a, b) => `${a};${b};${b}` };
    };
    const anim = (e, svg) => {
      if (e.okreni && T[e.oko]) {
        const [cx, cy] = Pn(e.oko).map(f), v = vreme(e);
        return `<g transform="rotate(${-e.okreni} ${cx} ${cy})"><animateTransform attributeName="transform" type="rotate" values="${v.vr(`0 ${cx} ${cy}`, `${-e.okreni} ${cx} ${cy}`)}" ${v.attr} calcMode="spline" keyTimes="${v.kt}" keySplines="${v.ks}"/>${svg}</g>`;
      }
      if (e.pomeri) {
        const dx = f(e.pomeri[0] * s), dy = f(-e.pomeri[1] * s), v = vreme(e);
        return `<g transform="translate(${dx} ${dy})"><animateTransform attributeName="transform" type="translate" values="${v.vr('0 0', `${dx} ${dy}`)}" ${v.attr} calcMode="spline" keyTimes="${v.kt}" keySplines="${v.ks}"/>${svg}</g>`;
      }
      const [m1, m2] = imena(e.odrazi || '').map((n) => T[n] && Pn(n));
      // natpis se ne presavija (bio bi u ogledalu) – oznake odraza idu kao posebni elementi
      if (m1 && m2 && !svg.startsWith('<text')) {
        // presavijanje: u koordinatama prave (x duž prave) skaliramo y od 1 do −1
        const ug = f((Math.atan2(m2[1] - m1[1], m2[0] - m1[0]) * 180) / Math.PI), v = vreme(e);
        return `<g transform="translate(${f(m1[0])} ${f(m1[1])}) rotate(${ug})"><g transform="scale(1 -1)"><animateTransform attributeName="transform" type="scale" values="${v.vr('1 1', '1 -1')}" ${v.attr} calcMode="spline" keyTimes="${v.kt}" keySplines="${v.ks}"/><g transform="rotate(${-ug}) translate(${f(-m1[0])} ${f(-m1[1])})">${svg}</g></g></g>`;
      }
      return svg;
    };
    // „crtaj“: potez se iscrtava (pathLength=1, pomera se početak crtkanja); vrh strelice se pojavljuje na kraju
    const crtanje = (e) => {
      if (!e.crtaj || e.isp) return { a: '', anim: '', kraj: '' };
      const dur = e.trajanje || 1.2, kas = e.kasni ?? 0.25;
      const ponovi = e.ponovi ? ` repeatCount="indefinite"` : '';
      const uk = e.ponovi ? dur + 1.8 : dur;
      const kt = e.ponovi ? `keyTimes="0;${(dur / uk).toFixed(3)};1"` : '';
      return {
        a: ' pathLength="1" stroke-dasharray="1 1"',
        anim: `<animate attributeName="stroke-dashoffset" values="${e.ponovi ? '1;0;0' : '1;0'}" ${kt} begin="${kas}s" dur="${uk}s" fill="freeze"${ponovi}/>`,
        kraj: e.ponovi ? `<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;${((dur * 0.9) / uk).toFixed(3)};${(dur / uk).toFixed(3)};1" begin="${kas}s" dur="${uk}s" repeatCount="indefinite"/>`
          : `<animate attributeName="opacity" values="0;1" begin="${(kas + dur * 0.9).toFixed(2)}s" dur="0.2s" fill="freeze"/>`,
        // dok animacija ne počne, potez je sakriven
        poc: ' stroke-dashoffset="1"',
      };
    };
    // ubacuje <animate> u prvi element (koji se završava sa "/>")
    const saAnim = (svg, an) => (an ? svg.replace(/\/>/, `>${an}</${svg.match(/^<(\w+)/)[1]}>`) : svg);
    const strelicaA = (a, b, c, cr) => (cr.kraj ? strelica(a, b, c).replace('/>', ` opacity="0">${cr.kraj}</path>`) : strelica(a, b, c));

    for (const e of sve) {
      const kl = klasa(e);
      const cr = crtanje(e);
      const crt = e.isp ? ' stroke-dasharray="7 6"' : cr.a ? cr.a + cr.poc : '';
      if (e.mreza) {
        const [a, b, c, d] = e.mreza;
        const [ox, oy] = P(Math.min(Math.max(0, a), b), Math.min(Math.max(0, c), d));
        // podela: razmak linija mreže (ili [po x, po y] – za grafike sa različitim razmerama osa)
        const [k, ky] = Array.isArray(e.podela) ? e.podela : [e.podela || 1, e.podela || 1];
        for (let x = Math.ceil(a / k) * k; x <= b + 1e-9; x += k) { const [X, Y1] = P(x, c), [, Y2] = P(x, d); const nula = Math.abs(x) < 1e-9; dno += `<line x1="${f(X)}" y1="${f(Y1)}" x2="${f(X)}" y2="${f(Y2)}" class="mreza${nula ? ' osa' : ''}"/>`; if (!nula && e.brojevi !== 0) dno += `<text x="${f(X)}" y="${f(oy + 15)}" class="broj" data-lat>${broj(x)}</text>`; }
        for (let y = Math.ceil(c / ky) * ky; y <= d + 1e-9; y += ky) { const [X1, Y] = P(a, y), [X2] = P(b, y); const nula = Math.abs(y) < 1e-9; dno += `<line x1="${f(X1)}" y1="${f(Y)}" x2="${f(X2)}" y2="${f(Y)}" class="mreza${nula ? ' osa' : ''}"/>`; if (!nula && e.brojevi !== 0) dno += `<text x="${f(ox - 9)}" y="${f(Y + 5)}" class="broj" data-lat>${broj(y)}</text>`; }
        if (e.brojevi !== 0) dno += `<text x="${f(ox - 9)}" y="${f(oy + 15)}" class="broj" data-lat>0</text>`;
        if (e.ose) {
          const [X2] = P(b, 0), [, Y2] = P(0, d);
          const ime = (t) => (String(t).startsWith('~') ? esc(prevod(String(t).slice(1))) : esc(t));
          const lat = (t) => (String(t).startsWith('~') ? '' : 'data-lat');
          dno += `<text x="${f(X2 + 14)}" y="${f(oy + 5)}" class="ime-ose" ${lat(e.ose[0])}>${ime(e.ose[0])}</text><text x="${f(ox)}" y="${f(Y2 - 10)}" class="ime-ose" ${lat(e.ose[1])}>${ime(e.ose[1])}</text>`;
        }
      } else if (e.osa) {
        const [a, b] = e.osa;
        const k = e.podela || 1, svaki = e.svaki || 1;
        const [X1, Y] = P(a, 0), [X2] = P(b, 0);
        dno += `<line x1="${f(X1 - 10)}" y1="${f(Y)}" x2="${f(X2 + 14)}" y2="${f(Y)}" class="brojevna"/><path d="M${f(X2 + 14)},${f(Y)} l-9,-5 v10 z" fill="#fff"/>`;
        const n = Math.round((b - a) / k);
        for (let i = 0; i <= n; i++) {
          const x = a + i * k, [X] = P(x, 0), glavni = Math.round(x / k) % svaki === 0;
          dno += `<line x1="${f(X)}" y1="${f(Y - (glavni ? 6 : 3.5))}" x2="${f(X)}" y2="${f(Y + (glavni ? 6 : 3.5))}" class="brojevna"/>`;
          if (glavni && e.brojevi !== 0) dno += `<text x="${f(X)}" y="${f(Y + 22)}" class="broj" data-lat>${broj(x)}</text>`;
        }
      } else if (e.p) {
        const pts = imena(e.p).map(Pn);
        const c = boja(e, BOJE[0]);
        dno += anim(e, saAnim(`<polygon points="${pts.map((p) => p.map(f).join(',')).join(' ')}" fill="${c}" fill-opacity="${e.prazno ? 0 : e.gusto ? 0.55 : 0.2}" stroke="${c}" stroke-width="2.5" stroke-linejoin="round" class="lik ${kl}"${crt}/>`, cr.anim));
        if (e.o) { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length; vrh += anim(e, tekst(cx, cy + 5, e.o, e)); }
      } else if (e.lin) {
        const pts = e.lin.map(([x, y]) => P(x, y));
        const c = boja(e, BOJE[0]);
        const tacke = pts.map((p) => p.map(f).join(',')).join(' ');
        if (e.zatv) dno += anim(e, saAnim(`<polygon points="${tacke}" fill="${c}" fill-opacity="${e.prazno ? 0 : e.gusto ? 0.55 : 0.2}" stroke="${c}" stroke-width="2.5" stroke-linejoin="round" class="lik ${kl}"${crt}/>`, cr.anim));
        else sredina += anim(e, saAnim(`<polyline points="${tacke}" fill="none" stroke="${c}" stroke-width="${e.debljina || 3}" stroke-linejoin="round" stroke-linecap="round" class="duz ${kl}"${crt}/>`, cr.anim));
        if (e.str && pts.length > 1) sredina += anim(e, strelicaA(pts[pts.length - 2], pts[pts.length - 1], c, cr));
        if (e.o) {
          const [x, y] = e.oAt ? P(e.oAt[0], e.oAt[1]) : pts[pts.length - 1];
          const t = tekst(x + (e.oAt ? 0 : 14), y - (e.oAt ? -5 : 8), e.o, e, e.b !== undefined ? `fill="${c}"` : '');
          vrh += anim(e, cr.kraj ? t.replace(/^<text /, '<text opacity="0" ').replace('</text>', cr.kraj + '</text>') : t);
        }
      } else if (e.is) {
        const c0 = Pn(e.is);
        const r = poluprecnik({ ...e, c: e.is }) * s, r0 = (e.r0 || 0) * s;
        const c = boja(e, '#a29bfe');
        const a1 = ((e.od ?? 0) * Math.PI) / 180, a2 = ((e.do ?? 360) * Math.PI) / 180;
        const tacka = (rr, a) => [c0[0] + rr * Math.cos(a), c0[1] - rr * Math.sin(a)];
        let d;
        if (a2 - a1 >= 2 * Math.PI - 1e-6) {
          // ceo krug ili prsten (dva polukruga, unutrašnji obrnuto – „rupa“)
          d = `M${f(c0[0] + r)},${f(c0[1])} A${f(r)},${f(r)} 0 1 0 ${f(c0[0] - r)},${f(c0[1])} A${f(r)},${f(r)} 0 1 0 ${f(c0[0] + r)},${f(c0[1])} Z`;
          if (r0) d += ` M${f(c0[0] + r0)},${f(c0[1])} A${f(r0)},${f(r0)} 0 1 1 ${f(c0[0] - r0)},${f(c0[1])} A${f(r0)},${f(r0)} 0 1 1 ${f(c0[0] + r0)},${f(c0[1])} Z`;
        } else {
          const vel = a2 - a1 > Math.PI ? 1 : 0;
          const [A, B] = [tacka(r, a1), tacka(r, a2)];
          d = `M${f(A[0])},${f(A[1])} A${f(r)},${f(r)} 0 ${vel} 0 ${f(B[0])},${f(B[1])}`;
          if (r0) { const [C, D] = [tacka(r0, a2), tacka(r0, a1)]; d += ` L${f(C[0])},${f(C[1])} A${f(r0)},${f(r0)} 0 ${vel} 1 ${f(D[0])},${f(D[1])} Z`; }
          else d += ` L${f(c0[0])},${f(c0[1])} Z`;
        }
        dno += anim(e, `<path d="${d}" fill="${c}" fill-opacity="${e.prazno ? 0 : e.gusto ? 0.6 : 0.3}" fill-rule="evenodd" stroke="${c}" stroke-width="2.2" stroke-linejoin="round" class="lik ${kl}"${e.isp ? crt : ''}/>`);
        if (e.o) {
          const sr = (a1 + a2) / 2, ro = e.r0 ? (r + r0) / 2 : r * (e.oR ?? 0.6);
          const [x, y] = a2 - a1 >= 2 * Math.PI - 1e-6 ? tacka(ro, Math.PI / 2) : tacka(ro, sr);
          vrh += anim(e, tekst(x, y + 5, e.o, e));
        }
      } else if (e.d) {
        const [a, b] = imena(e.d).map(Pn);
        sredina += anim(e, `${saAnim(`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${boja(e)}" stroke-width="${e.debljina || 2.5}" stroke-linecap="round" class="duz ${kl}"${crt}/>`, cr.anim)}${e.str ? strelicaA(a, b, boja(e), cr) : ''}`);
        if (e.o) {
          const na = e.na ?? 0.5; // gde je oznaka duž duži (0–1)
          const mx = a[0] + (b[0] - a[0]) * na, my = a[1] + (b[1] - a[1]) * na;
          const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
          let nx = -dy / L, ny = dx / L;
          if ((mx + nx - tez[0]) ** 2 + (my + ny - tez[1]) ** 2 < (mx - nx - tez[0]) ** 2 + (my - ny - tez[1]) ** 2) { nx = -nx; ny = -ny; }
          if (e.os === -1) { nx = -nx; ny = -ny; }
          const duz = String(e.o).length;
          const pom = 12 + Math.abs(nx) * duz * 3.6;
          vrh += anim(e, tekst(mx + nx * pom, my + ny * pom + 5, e.o, e));
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
          sredina += anim(e, `<path d="M${f(a[0])},${f(a[1])} L${f(d[0])},${f(d[1])} L${f(b[0])},${f(b[1])}" fill="none" stroke="${c}" stroke-width="2" class="ugao ${kl}"/><circle cx="${f(v[0] + 6 * Math.SQRT2 * Math.cos(pola))}" cy="${f(v[1] + 6 * Math.SQRT2 * Math.sin(pola))}" r="1.8" fill="${c}"/>`);
        } else {
          const r = e.r || 22;
          const a = [v[0] + r * Math.cos(u1), v[1] + r * Math.sin(u1)], b = [v[0] + r * Math.cos(u2), v[1] + r * Math.sin(u2)];
          sredina += anim(e, `<path d="M${f(v[0])},${f(v[1])} L${f(a[0])},${f(a[1])} A${r},${r} 0 0 ${raz > 0 ? 1 : 0} ${f(b[0])},${f(b[1])} Z" fill="${c}" fill-opacity=".25" stroke="${c}" stroke-width="2" class="ugao ${kl}"/>`);
          if (e.o) { const ro = r + 16 + String(e.o).length * 2; vrh += anim(e, tekst(v[0] + ro * Math.cos(pola), v[1] + ro * Math.sin(pola) + 5, e.o, e)); }
        }
      } else if (e.kr || e.l) {
        const c0 = Pn(e.kr || e.l);
        const r = poluprecnik({ ...e, c: e.kr || e.l }) * s;
        const c = boja(e, '#a29bfe');
        if (e.kr) sredina += anim(e, saAnim(`<circle cx="${f(c0[0])}" cy="${f(c0[1])}" r="${f(r)}" fill="${e.pun ? c : 'none'}" fill-opacity="${e.gusto ? 0.55 : 0.2}" stroke="${c}" stroke-width="2.2" class="krug ${kl}"${crt}/>`, cr.anim));
        else {
          const a1 = ((e.od ?? 0) * Math.PI) / 180, a2 = ((e.do ?? 90) * Math.PI) / 180;
          const A = [c0[0] + r * Math.cos(a1), c0[1] - r * Math.sin(a1)], B = [c0[0] + r * Math.cos(a2), c0[1] - r * Math.sin(a2)];
          // luk se crta od manjeg ka većem uglu; strelica na kraju „do“ (ili na početku ako je "str": -1)
          // luk koji se iscrtava ide od „od“ ka „do“ (ili obrnuto uz "str": -1)
          const [S, E, sw] = e.str === -1 && cr.a ? [B, A, 1] : [A, B, 0];
          sredina += anim(e, saAnim(`<path d="M${f(S[0])},${f(S[1])} A${f(r)},${f(r)} 0 ${a2 - a1 > Math.PI ? 1 : 0} ${sw} ${f(E[0])},${f(E[1])}" fill="none" stroke="${c}" stroke-width="${e.pun ? 3.5 : 2.2}" class="krug ${kl}"${crt || (e.pun || e.str ? '' : ' stroke-dasharray="5 5"')}/>`, cr.anim));
          if (e.str === 1) { const a0 = a2 - 0.08; sredina += anim(e, strelicaA([c0[0] + r * Math.cos(a0), c0[1] - r * Math.sin(a0)], B, c, cr)); }
          if (e.str === -1) { const a0 = a1 + 0.08; sredina += anim(e, strelicaA([c0[0] + r * Math.cos(a0), c0[1] - r * Math.sin(a0)], A, c, cr)); }
          if (e.o) { const sr = (a1 + a2) / 2, ro = r + 16; vrh += anim(e, tekst(c0[0] + ro * Math.cos(sr), c0[1] - ro * Math.sin(sr) + 5, e.o, e, `fill="${c}"`)); }
        }
      } else if (e.tx !== undefined) {
        const [x, y] = P(e.at[0], e.at[1]);
        vrh += anim(e, tekst(x, y + 5, e.tx, e, `${e.b !== undefined ? `fill="${boja(e)}"` : ''}${e.vel ? ` style="font-size:${e.vel}px"` : ''}`));
      }
      if (e.tacka) for (const n of imena(e.tacka)) { const [x, y] = Pn(n); vrh += anim(e, `<circle cx="${f(x)}" cy="${f(y)}" r="4.5" fill="${boja(e, '#ffeaa7')}" class="${kl}"/>`); }
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
