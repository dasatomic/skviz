// Tema 6 (prvi deo): četvorougao – osnovni elementi, unutrašnji i spoljašnji uglovi, paralelogram,
// vrste paralelograma (lekcije 6.1–6.5). Sopstveni brojevi, po gradivu Matematike 6 (Arhiknjiga).
// Pomoćni crteži četvorouglova (`crtezi`) koristi i teorija: alati/matematika-teorija-6/8-cetvorougao-a.js
const { G, r } = require('./osnova');

// ════════════════ pomoćni crteži četvorougla ════════════════
const rad = (u) => (u * Math.PI) / 180;
const step = (u) => (u * 180) / Math.PI;
// tačka na rastojanju d od P u smeru ug (stepeni)
const tacka = (P, ug, d) => [r(P[0] + d * Math.cos(rad(ug))), r(P[1] + d * Math.sin(rad(ug)))];
const sred = (P, Q) => [r((P[0] + Q[0]) / 2), r((P[1] + Q[1]) / 2)];
const duzina = (P, Q) => Math.hypot(Q[0] - P[0], Q[1] - P[1]);
// presek pravih: P + t·(cos a, sin a) i Q + s·(cos b, sin b)
function presek(P, a, Q, b) {
  const u = [Math.cos(rad(a)), Math.sin(rad(a))], v = [Math.cos(rad(b)), Math.sin(rad(b))];
  const det = -u[0] * v[1] + v[0] * u[1];
  const dx = Q[0] - P[0], dy = Q[1] - P[1];
  const t = (-dx * v[1] + v[0] * dy) / det;
  return [r(P[0] + t * u[0]), r(P[1] + t * u[1])];
}
// presek duži PQ i RS (kao pravih)
function presekDuzi(P, Q, R, S) {
  return presek(P, step(Math.atan2(Q[1] - P[1], Q[0] - P[0])), R, step(Math.atan2(S[1] - R[1], S[0] - R[0])));
}
// ugao PVQ u stepenima (provera vernosti crteža)
function ugao(P, V, Q) {
  const a = Math.atan2(P[1] - V[1], P[0] - V[0]), b = Math.atan2(Q[1] - V[1], Q[0] - V[0]);
  let d = Math.abs(step(a - b)) % 360;
  return d > 180 ? 360 - d : d;
}
// četvorougao ABCD (suprotno od kazaljke) sa zadatim uglovima α, β, δ (γ = 360° − ostali)
function cetv4(alfa, beta, delta, { a = 6, d = 3.5 } = {}) {
  const A = [0, 0], B = [a, 0], D = tacka(A, alfa, d);
  const C = presek(D, alfa + 180 + delta, B, 180 - beta);
  return { A, B, C, D };
}
// paralelogram: AB = a, AD = d, ugao kod A
function paral(a, d, alfa) {
  const A = [0, 0], B = [a, 0], D = tacka(A, alfa, d);
  return { A, B, C: [r(B[0] + D[0]), r(B[1] + D[1])], D };
}
// crtice jednakosti na duži PQ (n crtica)
function crtice(P, Q, n = 1, x = {}) {
  const L = duzina(P, Q), ux = (Q[0] - P[0]) / L, uy = (Q[1] - P[1]) / L;
  const M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], h = 0.2, kor = 0.14;
  return Array.from({ length: n }, (_, i) => {
    const o = (i - (n - 1) / 2) * kor;
    const c = [M[0] + ux * o, M[1] + uy * o];
    return { lin: [[r(c[0] - uy * h), r(c[1] + ux * h)], [r(c[0] + uy * h), r(c[1] - ux * h)]], b: 3, debljina: 2.2, ...x };
  });
}
// strelice paralelnosti (kao „>“ na sredini duži)
function paralelno(P, Q, n = 1, x = {}) {
  const L = duzina(P, Q), ux = (Q[0] - P[0]) / L, uy = (Q[1] - P[1]) / L;
  const M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], h = 0.2;
  return Array.from({ length: n }, (_, i) => {
    const c = [M[0] + ux * (i * 0.22 - ((n - 1) * 0.11)), M[1] + uy * (i * 0.22 - ((n - 1) * 0.11))];
    const vrh = [c[0] + ux * 0.12, c[1] + uy * 0.12];
    return { lin: [[r(vrh[0] - ux * h - uy * h), r(vrh[1] - uy * h + ux * h)], [r(vrh[0]), r(vrh[1])], [r(vrh[0] - ux * h + uy * h), r(vrh[1] - uy * h - ux * h)]], b: 2, debljina: 2.2, ...x };
  });
}
// četvorougao iz tačaka T = { A, B, C, D } sa uglovima, spoljašnjim uglovima, dijagonalama i stranicama.
// uglovi: { A: 'α' ili { o, b, k, id } }, spolja: { B: 'β₁' }, stranice: { AB: '5 cm' }, dijag: true | 'AC' | 'BD'
function cetv(T, { imena = 'ABCD', uglovi = {}, spolja = {}, stranice = {}, dijag = false, kDijag, O = false, e = [], b = 0, velicina = 240, bez = [], t: dodT = {}, prazno = false, produzi = 0.45 } = {}) {
  const im = imena.split('');
  const t = { ...T, ...dodT };
  const el = [{ p: imena, b, id: 'lik', ...(prazno ? { prazno: 1 } : {}) }];
  const opc = (v) => (typeof v === 'string' ? { o: v } : v);
  const dg = dijag === true ? [im[0] + im[2], im[1] + im[3]] : dijag ? [dijag] : [];
  dg.forEach((d, i) => el.push({ d, b: i ? 2 : 1, isp: 1, id: d, ...(kDijag !== undefined ? { k: kDijag } : {}) }));
  if (O) { t.O = presekDuzi(t[im[0]], t[im[2]], t[im[1]], t[im[3]]); el.push({ tacka: 'O', b: 3 }); }
  for (const [s, v] of Object.entries(stranice)) el.push({ d: s, id: s, ...opc(v) });
  for (const [V, v] of Object.entries(uglovi)) {
    const i = im.indexOf(V);
    el.push({ u: im[(i + 3) % 4] + V + im[(i + 1) % 4], b: 1, id: 'u' + V, ...opc(v) });
  }
  for (const [V, v] of Object.entries(spolja)) {
    const i = im.indexOf(V), P = t[im[(i + 3) % 4]], X = t[V], L = duzina(P, X);
    const ime = 'x' + i;
    t[ime] = [r(X[0] + ((X[0] - P[0]) / L) * L * produzi), r(X[1] + ((X[1] - P[1]) / L) * L * produzi)];
    const o = opc(v);
    el.push({ d: V + ime, isp: 1, b: 4, ...(o.k !== undefined ? { k: o.k } : {}) });
    el.push({ u: ime + V + im[(i + 1) % 4], b: 2, id: 's' + V, ...o });
  }
  return G(t, [...el, ...e], { velicina, bezImena: bez });
}

const crtezi = { rad, tacka, sred, duzina, presek, presekDuzi, ugao, cetv4, paral, crtice, paralelno, cetv };

module.exports = ({ L, Z, K, G: G6, proveri }) => {
  const blizu = (x, y) => Math.abs(x - y) < 0.6;
  // provera vernosti crteža: uglovi četvorougla T su α, β, γ, δ
  const verno = (T, uglovi, opis) => {
    const { A, B, C, D } = T;
    const u = [ugao(D, A, B), ugao(A, B, C), ugao(B, C, D), ugao(C, D, A)];
    proveri(u.every((x, i) => blizu(x, uglovi[i])), 'crtež: ' + opis + ' ' + u.map((x) => x.toFixed(1)).join(', '));
  };

  // ════════════════ 6.1 Osnovni elementi četvorougla ════════════════
  L('Osnovni elementi četvorougla');
  {
    const T = cetv4(80, 75, 110, { a: 6, d: 4 });
    proveri(4 + 5 + 6 + 7 === 22, 'obim 22');
    Z(1, 'Stranice četvorougla $ABCD$ su $AB = 7 cm$, $BC = 5 cm$, $CD = 4 cm$ i $DA = 6 cm$. Koliki je obim?',
      ['$22 cm$', '$20 cm$', '$24 cm$', '$18 cm$'],
      [K('Obim četvorougla je zbir dužina sve četiri stranice: $O = AB + BC + CD + DA$.', ['AB', 'BC', 'CD', 'DA']),
       K('$O = 7 cm + 5 cm + 4 cm + 6 cm = 22 cm$')],
      cetv(T, { stranice: { AB: '7 cm', BC: '5 cm', CD: '4 cm', DA: '6 cm' } }));
  }
  {
    proveri(30 / 4 === 7.5, '30 : 4');
    const T = { A: [0, 0], B: [5, 0], C: [7.4, 4.4], D: [2.4, 4.4] }; // romb (sve stranice 5)
    Z(1, 'Sve četiri stranice četvorougla su jednake, a obim mu je $30 cm$. Kolika je jedna stranica?',
      ['$7,5 cm$', '$7 cm$', '$15 cm$', '$6 cm$'],
      [K('Jednake stranice označimo sa $a$. Tada je $O = a + a + a + a = 4a$.', ['AB', 'BC', 'CD', 'DA']),
       K('$4a = 30 cm$, pa je $a = 30 cm : 4 = 7,5 cm$.', [], cetv(T, { stranice: { AB: '7,5 cm', BC: '7,5 cm', CD: '7,5 cm', DA: '7,5 cm' } }))],
      cetv(T, { stranice: { AB: 'a', BC: 'a', CD: 'a', DA: 'a' }, e: [...crtice(T.A, T.B), ...crtice(T.B, T.C), ...crtice(T.C, T.D), ...crtice(T.D, T.A)] }));
  }
  {
    proveri((24 - 5 - 7) / 2 === 6, '24 − 12 = 12, 12 : 2 = 6');
    const T = cetv4(85, 95, 100, { a: 7, d: 5 });
    Z(2, 'Obim četvorougla je $24 cm$. Dve stranice su $5 cm$ i $7 cm$, a preostale dve su jednake. Kolika je svaka od njih?',
      ['$6 cm$', '$12 cm$', '$7 cm$', '$5,5 cm$'],
      [K('Nepoznatu stranicu označimo sa $x$: $O = x + x + 5 cm + 7 cm$.', ['BC', 'DA']),
       K('$24 cm = 2x + 12 cm$, pa je $2x = 12 cm$.'),
       K('$x = 12 cm : 2 = 6 cm$. (Odgovor $12 cm$ je zbir obe nepoznate stranice.)')],
      cetv(T, { stranice: { AB: '7 cm', CD: '5 cm', BC: 'x', DA: 'x' }, e: [...crtice(T.B, T.C), ...crtice(T.D, T.A)] }));
  }
  {
    proveri(7 + 8 + 9 + 10 === 34, 'uzastopni 7–10');
    const T = cetv4(75, 80, 115, { a: 6.5, d: 5 });
    Z(2, 'Dužine stranica četvorougla (u centimetrima) su četiri uzastopna prirodna broja, a obim je $34 cm$. Kolika je najduža stranica?',
      ['$10 cm$', '$9 cm$', '$11 cm$', '$8,5 cm$'],
      [K('Stranice su $n$, $n + 1$, $n + 2$ i $n + 3$, pa je obim $4n + 6$.'),
       K('$4n + 6 = 34$, $4n = 28$, $n = 7$.'),
       K('Stranice su $7$, $8$, $9$ i $10 cm$; najduža je $10 cm$. Provera: $7 + 8 + 9 + 10 = 34$ ✓', ['AB'])],
      cetv(T, { stranice: { AB: { o: '10 cm', k: 3 }, BC: { o: '9 cm', k: 3 }, CD: { o: '8 cm', k: 3 }, DA: { o: '7 cm', k: 3 } } }));
  }
  {
    proveri(42 / 14 === 3 && 2 * 3 === 6, 'razmera 2:3:4:5');
    const T = cetv4(80, 70, 120, { a: 7, d: 3 });
    Z(2, 'Stranice četvorougla odnose se kao $2 : 3 : 4 : 5$, a obim je $42 cm$. Kolika je najkraća stranica?',
      ['$6 cm$', '$3 cm$', '$7 cm$', '$8 cm$'],
      [K('Stranice su $2k$, $3k$, $4k$ i $5k$, pa je obim $14k$.'),
       K('$14k = 42 cm$, pa je $k = 3 cm$.'),
       K('Stranice su $6$, $9$, $12$ i $15 cm$. Najkraća je $2 · 3 cm = 6 cm$.', ['DA'])],
      cetv(T, { stranice: { AB: '5k', BC: '4k', CD: '3k', DA: '2k' } }));
  }
  {
    // dva podudarna trougla 4, 6, 7 spojena duž stranice 6
    proveri(2 * (4 + 7) === 22 && 2 * (6 + 7) === 26 && 2 * (4 + 6) === 20, 'obimi spojenih trouglova');
    const A = [0, 0], C = [6, 0];
    const x = (16 - 49 + 36) / 12, y = Math.sqrt(16 - x * x); // AB = 4, CB = 7
    const B = [r(x), r(-y)], D = [r(6 - x), r(y)];
    proveri(blizu(duzina(A, B), 4) && blizu(duzina(C, B), 7) && blizu(duzina(C, D), 4), 'trouglovi 4, 6, 7');
    Z(2, 'Dva podudarna trougla sa stranicama $4 cm$, $6 cm$ i $7 cm$ spojena su duž stranice od $6 cm$ (kao na slici). Koliki je obim dobijenog četvorougla?',
      ['$22 cm$', '$34 cm$', '$26 cm$', '$28 cm$'],
      [K('Zajednička stranica $AC$ je unutra – postaje dijagonala i ne ulazi u obim.', ['AC']),
       K('Obim čine ostale stranice oba trougla: $4 + 7 + 4 + 7$.', ['AB', 'BC', 'CD', 'DA']),
       K('$O = 22 cm$. (Odgovor $34 cm$ bi bio zbir obima dva trougla.)')],
      G({ A, B, C, D }, [
        { lin: [A, B, C], zatv: 1, b: 0, gusto: 1 }, { lin: [A, C, D], zatv: 1, b: 2, gusto: 1 },
        { d: 'AB', o: '4 cm', id: 'AB' }, { d: 'BC', o: '7 cm', id: 'BC' }, { d: 'CD', o: '4 cm', id: 'CD' }, { d: 'DA', o: '7 cm', id: 'DA' },
        { d: 'AC', o: '6 cm', b: 3, id: 'AC', debljina: 3 },
      ], { velicina: 240 }));
  }
  {
    // ABD: AB = 5, AD = 4, BD = 6; BCD jednakostraničan (BD = 6)
    const B = [0, 0], D = [6, 0];
    const x = (25 - 16 + 36) / 12, A = [r(x), r(-Math.sqrt(25 - x * x))], C = [3, r(3 * Math.sqrt(3))];
    proveri(blizu(duzina(A, D), 4) && blizu(duzina(B, C), 6) && 5 + 6 + 6 + 4 === 21, 'obim 21');
    Z(2, 'U četvorouglu $ABCD$ je $AB = 5 cm$, $DA = 4 cm$, a dijagonala $BD = 6 cm$ deli ga na trougao $ABD$ i jednakostranični trougao $BCD$. Koliki je obim četvorougla?',
      ['$21 cm$', '$27 cm$', '$15 cm$', '$23 cm$'],
      [K('Trougao $BCD$ je jednakostraničan, pa je $BC = CD = BD = 6 cm$.', ['BC', 'CD']),
       K('Dijagonala $BD$ nije stranica četvorougla – ne ulazi u obim.', ['BD']),
       K('$O = AB + BC + CD + DA = 5 + 6 + 6 + 4 = 21 cm$')],
      G({ A, B, C, D }, [
        { p: 'ABCD', b: 0 }, { lin: [B, C, D], zatv: 1, b: 2, gusto: 1 },
        { d: 'AB', o: '5 cm', id: 'AB' }, { d: 'DA', o: '4 cm', id: 'DA' }, { d: 'BD', o: '6 cm', isp: 1, b: 1, id: 'BD' },
        { d: 'BC', id: 'BC', o: '6 cm', k: 1 }, { d: 'CD', id: 'CD', o: '6 cm', k: 1 },
        ...crtice(B, C), ...crtice(C, D), ...crtice(B, D),
      ], { velicina: 240 }));
  }
  {
    proveri(3 + 5 + 6 === 14 && 13 < 14, 'najduža stranica < 14');
    // izlomljena linija 3, 5, 6 i najduža stranica x
    const A = [0, 0], X = [13, 0];
    Z(3, 'Stranice četvorougla su $3 cm$, $5 cm$, $6 cm$ i $x$ cm, gde je $x$ prirodan broj i najduža stranica. Koliko najviše može biti $x$?',
      ['$13$', '$14$', '$8$', '$6$'],
      [K('Najkraći put između dva temena je duž. Zato najduža stranica mora biti kraća od zbira ostale tri.'),
       K('$x < 3 + 5 + 6 = 14$', ['lom']),
       K('Najveći prirodan broj manji od $14$ je $13$. Za $x = 14$ bi se izlomljena linija „ispravila“ i četvorougla ne bi bilo.')],
      G({ A, X }, [
        { d: 'AX', o: 'x', b: 1, debljina: 3 },
        { lin: [[0, 0], [1.8, 2.4], [6.6, 3.9], [13, 0]], b: 2, debljina: 3, id: 'lom' },
        { tx: '3', at: [0.3, 1.6] }, { tx: '5', at: [4.1, 3.9] }, { tx: '6', at: [10.3, 2.6] },
      ], { velicina: 300, bezImena: ['A', 'X'] }));
  }
  {
    proveri(4 * 7 + 12 === 40 && 7 + 6 === 13, 'a = 7, d = 13');
    const T = cetv4(70, 75, 120, { a: 7, d: 6.5 });
    Z(3, 'Obim četvorougla je $40 cm$. Druga stranica je $2 cm$ duža od prve, treća $2 cm$ duža od druge, a četvrta $2 cm$ duža od treće. Kolika je četvrta stranica?',
      ['$13 cm$', '$12 cm$', '$10 cm$', '$11 cm$'],
      [K('Ako je prva stranica $a$, ostale su $a + 2$, $a + 4$ i $a + 6$.'),
       K('$4a + 12 = 40$, pa je $4a = 28$ i $a = 7 cm$.'),
       K('Četvrta stranica: $7 + 6 = 13 cm$. Provera: $7 + 9 + 11 + 13 = 40$ ✓', ['DA'])],
      cetv(T, { stranice: { AB: 'a + 6', BC: 'a', CD: 'a + 2', DA: 'a + 4' }, e: [] }));
  }
  {
    proveri(4 * 9 === 36, 'kvadrat 9');
    const A = [0, 0], B = [9, 0], C = [9, 9], D = [0, 9];
    Z(3, 'Dva podudarna jednakokraka pravougla trougla sa katetama od $9 cm$ složena su tako da obrazuju kvadrat. Koliki je obim kvadrata?',
      ['$36 cm$', '$18 cm$', '$27 cm$', '$54 cm$'],
      [K('Trouglove spajamo duž hipotenuze – ona postaje dijagonala kvadrata.', ['AC']),
       K('Stranice kvadrata su katete, po $9 cm$.', ['t2']),
       K('$O = 4 · 9 cm = 36 cm$')],
      G({ A, B, C, D }, [
        { lin: [A, B, C], zatv: 1, b: 0, gusto: 1 },
        { lin: [A, C, D].map(([x, y]) => [x - 2.5, y + 2.5]), zatv: 1, b: 2, gusto: 1, id: 't2', pomeri: [2.5, -2.5], kasni: 0.6, trajanje: 1.6 },
        { d: 'AC', b: 3, isp: 1, id: 'AC' }, { d: 'AB', o: '9 cm' }, { d: 'BC', o: '9 cm' }, { pu: 'ABC' },
      ], { velicina: 220 }));
  }

  // ════════════════ 6.2 Unutrašnji uglovi četvorougla ════════════════
  L('Unutrašnji uglovi četvorougla');
  {
    proveri(360 - (85 + 95 + 110) === 70, 'δ = 70');
    const T = cetv4(85, 95, 70, { a: 6, d: 4 });
    verno(T, [85, 95, 110, 70], 'α=85');
    Z(1, 'U četvorouglu $ABCD$ je $α = 85°$, $β = 95°$ i $γ = 110°$. Koliki je ugao $δ$?',
      ['$70°$', '$80°$', '$110°$', '$75°$'],
      [K('Zbir unutrašnjih uglova četvorougla je $360°$.', ['uA', 'uB', 'uC', 'uD']),
       K('$δ = 360° − (85° + 95° + 110°) = 360° − 290° = 70°$', ['uD'])],
      cetv(T, { uglovi: { A: '85°', B: '95°', C: '110°', D: 'δ' } }));
  }
  {
    proveri(360 - 3 * 100 === 60, 'δ = 60');
    const T = cetv4(100, 100, 60, { a: 5, d: 4.5 });
    verno(T, [100, 100, 100, 60], '100,100,100');
    Z(1, 'Tri unutrašnja ugla četvorougla su po $100°$. Koliki je četvrti ugao?',
      ['$60°$', '$100°$', '$80°$', '$90°$'],
      [K('Zbir tri poznata ugla: $3 · 100° = 300°$.', ['uA', 'uB', 'uC']),
       K('Četvrti ugao: $360° − 300° = 60°$', ['uD'])],
      cetv(T, { uglovi: { A: '100°', B: '100°', C: '100°', D: '?' } }));
  }
  {
    // dijagonala BD: ∠ABD = 40°, ∠DBC = 55°, ∠ADB = 60°, ∠BDC = 45°
    const B = [0, 0], D = [6, 0];
    const A = presek(B, -40, D, 180 + 60), C = presek(B, 55, D, 180 - 45);
    proveri(180 - 40 - 60 === 80 && 180 - 55 - 45 === 80, 'α = γ = 80');
    proveri(blizu(ugao(D, A, B), 80) && blizu(ugao(B, C, D), 80), 'crtež α, γ');
    Z(2, 'Dijagonala $BD$ deli ugao kod $B$ na uglove od $40°$ i $55°$, a ugao kod $D$ na uglove od $60°$ i $45°$ (kao na slici). Koliki je ugao kod temena $A$?',
      ['$80°$', '$95°$', '$100°$', '$85°$'],
      [K('Dijagonala deli četvorougao na dva trougla. Posmatramo trougao $ABD$.', ['t1']),
       K('U njemu su poznata dva ugla: $40°$ kod $B$ i $60°$ kod $D$.', ['u1', 'u2']),
       K('$∠A = 180° − (40° + 60°) = 80°$', ['uA'])],
      G({ A, B, C, D }, [
        { p: 'ABCD', b: 0 }, { lin: [A, B, D], zatv: 1, b: 2, id: 't1' }, { d: 'BD', b: 1, isp: 1 },
        { u: 'ABD', o: '40°', b: 1, id: 'u1' }, { u: 'DBC', o: '55°', b: 2 }, { u: 'BDA', o: '60°', b: 1, id: 'u2' }, { u: 'CDB', o: '45°', b: 2 },
        { u: 'DAB', o: '80°', b: 3, k: 3, id: 'uA' },
      ], { velicina: 240 }));
  }
  {
    proveri(360 / 12 === 30 && 4 * 30 === 120, '2:3:3:4');
    const T = cetv4(60, 90, 120, { a: 6, d: 3.4 });
    verno(T, [60, 90, 90, 120], '60,90,90,120');
    Z(2, 'Unutrašnji uglovi četvorougla odnose se kao $α : β : γ : δ = 2 : 3 : 3 : 4$. Koliki je ugao $δ$?',
      ['$120°$', '$90°$', '$108°$', '$100°$'],
      [K('Uglovi su $2k$, $3k$, $3k$ i $4k$, a zbir im je $12k = 360°$.'),
       K('$k = 30°$, pa je $α = 60°$, $β = γ = 90°$.', ['uA', 'uB', 'uC']),
       K('$δ = 4 · 30° = 120°$', ['uD'])],
      cetv(T, { uglovi: { A: '2k', B: '3k', C: '3k', D: '4k' } }));
  }
  {
    proveri(5 * 64 + 40 === 360 && 2 * 64 === 128, 'β = 64');
    const T = cetv4(128, 64, 74, { a: 6, d: 3 });
    verno(T, [128, 64, 94, 74], '128,64,94,74');
    Z(2, 'U četvorouglu je $α = 2β$, $γ = β + 30°$ i $δ = β + 10°$. Koliki je ugao $α$?',
      ['$128°$', '$64°$', '$94°$', '$120°$'],
      [K('Sve uglove izrazimo preko $β$: $2β + β + (β + 30°) + (β + 10°) = 360°$.'),
       K('$5β + 40° = 360°$, $5β = 320°$, $β = 64°$.', ['uB']),
       K('$α = 2 · 64° = 128°$ (a $γ = 94°$, $δ = 74°$; zbir $360°$ ✓)', ['uA'])],
      cetv(T, { uglovi: { A: 'α', B: 'β', C: 'γ', D: 'δ' } }));
  }
  {
    proveri(4 * 72 + 6 * 12 === 360 && 72 + 36 === 108, 'razlika 12°');
    const T = cetv4(72, 84, 108, { a: 6, d: 4 });
    verno(T, [72, 84, 96, 108], '72..108');
    Z(2, 'Unutrašnji uglovi četvorougla su $α$, $β$, $γ$, $δ$ i svaki je za $12°$ veći od prethodnog. Koliki je najveći ugao?',
      ['$108°$', '$96°$', '$120°$', '$102°$'],
      [K('Ako je $α = x$, onda su ostali $x + 12°$, $x + 24°$ i $x + 36°$.'),
       K('$4x + 72° = 360°$, pa je $4x = 288°$ i $x = 72°$.', ['uA']),
       K('Najveći: $δ = 72° + 36° = 108°$. Uglovi su $72°$, $84°$, $96°$, $108°$.', ['uD'])],
      cetv(T, { uglovi: { A: 'x', B: { o: '84°', k: 3 }, C: { o: '96°', k: 3 }, D: { o: '108°', k: 3 } } }));
  }
  {
    // AB = BC, CD = DA: simetričan oko BD; ∠B = 50°, ∠D = 110°
    const B = [0, 0], D = [6, 0];
    const A = presek(B, -25, D, 180 + 55), C = presek(B, 25, D, 180 - 55);
    proveri((360 - 50 - 110) / 2 === 100 && blizu(ugao(D, A, B), 100), 'α = γ = 100');
    Z(3, 'U četvorouglu $ABCD$ je $AB = BC$ i $CD = DA$, $∠B = 50°$ i $∠D = 110°$. Koliki je ugao kod temena $A$?',
      ['$100°$', '$110°$', '$50°$', '$80°$'],
      [K('Trouglovi $ABD$ i $CBD$ su podudarni (SSS: $AB = CB$, $AD = CD$, $BD$ zajednička), pa je $∠A = ∠C$.', ['t1', 't2']),
       K('$∠A + ∠C = 360° − (50° + 110°) = 200°$'),
       K('$∠A = ∠C = 200° : 2 = 100°$', ['uA', 'uC'])],
      G({ A, B, C, D }, [
        { lin: [A, B, D], zatv: 1, b: 0, id: 't1' }, { lin: [C, B, D], zatv: 1, b: 2, id: 't2' }, { p: 'ABCD', prazno: 1, b: 0 },
        { d: 'BD', isp: 1, b: 4, k: 1 },
        { u: 'ABC', o: '50°', b: 1 }, { u: 'CDA', o: '110°', b: 1 },
        { u: 'DAB', o: '?', b: 3, id: 'uA' }, { u: 'BCD', b: 3, id: 'uC' },
        ...crtice(A, B), ...crtice(B, C), ...crtice(C, D, 2), ...crtice(D, A, 2),
      ], { velicina: 240 }));
  }
  {
    proveri(360 - 180 === 3 * 60 && 2 * 60 === 120, '60, 120');
    const A = [0, 0], B = [6, 0], C = [6, 3], D = presek(A, 60, C, 180);
    proveri(blizu(ugao(B, C, D), 90) && blizu(ugao(C, D, A), 120), 'pravougli trapez');
    Z(3, 'Dva unutrašnja ugla četvorougla su prava, a treći je dva puta veći od četvrtog. Koliki je najveći ugao tog četvorougla?',
      ['$120°$', '$90°$', '$135°$', '$60°$'],
      [K('Dva prava ugla zajedno imaju $180°$, pa za preostala dva ostaje $360° − 180° = 180°$.', ['p1', 'p2']),
       K('Ako je manji ugao $x$, veći je $2x$: $3x = 180°$, $x = 60°$.', ['uA']),
       K('Veći ugao je $120°$ – veći od pravog, pa je on najveći.', ['uD'])],
      G({ A, B, C, D }, [{ p: 'ABCD', b: 0 }, { pu: 'ABC', id: 'p1' }, { pu: 'BCD', id: 'p2' }, { u: 'DAB', o: 'x', b: 1, id: 'uA' }, { u: 'CDA', o: '2x', b: 2, id: 'uD' }], { velicina: 240 }));
  }
  {
    proveri(72 + 90 + 144 + 54 === 360, 'δ = 54');
    const T = cetv4(72, 90, 54, { a: 4, d: 6 });
    verno(T, [72, 90, 144, 54], '72,90,144,54');
    Z(2, 'U četvorouglu je $α = 72°$, ugao $β$ je za $18°$ veći od $α$, a $γ = 2α$. Koliki je ugao $δ$?',
      ['$54°$', '$72°$', '$36°$', '$64°$'],
      [K('$β = 72° + 18° = 90°$', ['uB']),
       K('$γ = 2 · 72° = 144°$', ['uC']),
       K('$δ = 360° − (72° + 90° + 144°) = 360° − 306° = 54°$', ['uD'])],
      cetv(T, { uglovi: { A: '72°', B: 'β', C: 'γ', D: 'δ' } }));
  }
  {
    // α = 70, β = 90, γ = 110, δ = 90; simetrale uglova A i B seku se u S
    const T = cetv4(70, 90, 90, { a: 6, d: 4.2 });
    verno(T, [70, 90, 110, 90], '70,90,110,90');
    const S = presek(T.A, 35, T.B, 180 - 45);
    proveri(blizu(ugao(T.A, S, T.B), 100) && 180 - (160 / 2) === 100, '∠ASB = 100');
    Z(3, 'U četvorouglu $ABCD$ je $γ = 110°$ i $δ = 90°$. Simetrale uglova kod $A$ i $B$ seku se u tački $S$. Koliki je ugao $ASB$?',
      ['$100°$', '$80°$', '$110°$', '$90°$'],
      [K('$α + β = 360° − (110° + 90°) = 160°$', ['uC', 'uD']),
       K('Simetrale polove uglove, pa u trouglu $ABS$ uglovi kod $A$ i $B$ imaju zbir ${α|2} + {β|2} = 80°$.', ['tS']),
       K('$∠ASB = 180° − 80° = 100°$', ['uS'])],
      cetv(T, { uglovi: { C: '110°', D: { o: '90°', b: 1 } }, t: { S }, e: [
        { d: 'AS', b: 2, debljina: 2 }, { d: 'BS', b: 2, debljina: 2 }, { lin: [T.A, T.B, S], zatv: 1, b: 2, id: 'tS', k: 2 },
        { u: 'BAS', b: 4, r: 30 }, { u: 'SAD', b: 4, r: 30 }, { u: 'SBA', b: 4, r: 30 }, { u: 'CBS', b: 4, r: 30 },
        { u: 'ASB', o: '100°', b: 3, k: 3, id: 'uS' },
      ] }));
  }

  // ════════════════ 6.3 Spoljašnji uglovi četvorougla ════════════════
  L('Spoljašnji uglovi četvorougla');
  {
    proveri(180 - 64 === 116, 'α₁ = 116');
    const T = cetv4(64, 95, 100, { a: 6, d: 4 });
    Z(1, 'Unutrašnji ugao četvorougla kod temena $A$ je $64°$. Koliki je spoljašnji ugao kod tog temena?',
      ['$116°$', '$26°$', '$296°$', '$64°$'],
      [K('Spoljašnji ugao je uporedan unutrašnjem: zajedno čine opružen ugao.', ['uA', 'sA']),
       K('$α_{1} = 180° − 64° = 116°$', ['sA'])],
      cetv(T, { uglovi: { A: '64°' }, spolja: { A: 'α₁' }, produzi: 0.6 }));
  }
  {
    proveri(360 - (85 + 95 + 100) === 80, 'četvrti spoljašnji 80');
    const T = cetv4(95, 85, 100, { a: 6, d: 4 });
    verno(T, [95, 85, 80, 100], 'spolj. 85,95,100,80');
    Z(1, 'Tri spoljašnja ugla četvorougla su $85°$, $95°$ i $100°$. Koliki je četvrti spoljašnji ugao?',
      ['$80°$', '$100°$', '$90°$', '$180°$'],
      [K('Zbir spoljašnjih uglova svakog četvorougla je $360°$.', ['sA', 'sB', 'sC', 'sD']),
       K('$360° − (85° + 95° + 100°) = 360° − 280° = 80°$', ['sD'])],
      cetv(T, { spolja: { A: '85°', B: '95°', C: '100°', D: '?' }, produzi: 0.4, velicina: 230 }));
  }
  {
    proveri(180 - 120 === 60 && 360 - (78 + 96 + 60) === 126 && 180 - 126 === 54, 'δ₁ = 54');
    const T = cetv4(78, 96, 126, { a: 6, d: 4 });
    verno(T, [78, 96, 60, 126], '78,96,60,126');
    Z(2, 'U četvorouglu $ABCD$ je $α = 78°$, $β = 96°$, a spoljašnji ugao kod $C$ je $γ_{1} = 120°$. Koliki je spoljašnji ugao $δ_{1}$?',
      ['$54°$', '$126°$', '$60°$', '$66°$'],
      [K('$γ = 180° − 120° = 60°$', ['uC']),
       K('$δ = 360° − (78° + 96° + 60°) = 126°$', ['uD']),
       K('$δ_{1} = 180° − 126° = 54°$', ['sD'])],
      cetv(T, { uglovi: { A: '78°', B: '96°', C: { o: '60°', k: 1 }, D: { o: '126°', k: 2 } }, spolja: { C: '120°', D: { o: 'δ₁', k: 0 } }, produzi: 0.45 }));
  }
  {
    proveri(360 - 300 === 60 && 180 - 60 === 120, 'unutrašnji 120');
    const T = cetv4(80, 80, 120, { a: 5.5, d: 4 });
    verno(T, [80, 80, 80, 120], '80,80,80,120');
    Z(2, 'Tri spoljašnja ugla četvorougla su po $100°$. Koliki je unutrašnji ugao kod četvrtog temena?',
      ['$120°$', '$60°$', '$80°$', '$100°$'],
      [K('Četvrti spoljašnji ugao: $360° − 3 · 100° = 60°$.', ['sD']),
       K('Unutrašnji ugao uz njega: $180° − 60° = 120°$.', ['uD'])],
      cetv(T, { spolja: { A: '100°', B: '100°', C: '100°', D: { o: '60°', k: 1 } }, uglovi: { D: { o: '?', b: 3 } }, produzi: 0.4, velicina: 230 }));
  }
  {
    proveri(180 - 75 === 105 && 180 - 105 === 75 && 360 - (105 + 75 + 80) === 100, 'δ = 100');
    const T = cetv4(105, 75, 100, { a: 6, d: 4 });
    verno(T, [105, 75, 80, 100], '105,75,80,100');
    Z(2, 'U četvorouglu $ABCD$ spoljašnji uglovi kod $A$ i $B$ su $α_{1} = 75°$ i $β_{1} = 105°$, a $γ = 80°$. Koliki je unutrašnji ugao $δ$?',
      ['$100°$', '$80°$', '$105°$', '$75°$'],
      [K('$α = 180° − 75° = 105°$ i $β = 180° − 105° = 75°$', ['uA', 'uB']),
       K('$δ = 360° − (105° + 75° + 80°) = 100°$', ['uD'])],
      cetv(T, { spolja: { A: '75°', B: '105°' }, uglovi: { A: { o: '105°', k: 1 }, B: { o: '75°', k: 1 }, C: '80°', D: 'δ' }, produzi: 0.4 }));
  }
  {
    proveri(360 / 12 === 30 && 180 - 120 === 60, 'spolj. 2:3:3:4');
    const T = cetv4(120, 90, 60, { a: 5, d: 3.6 });
    verno(T, [120, 90, 90, 60], '120,90,90,60');
    Z(2, 'Spoljašnji uglovi četvorougla odnose se kao $2 : 3 : 3 : 4$. Koliki je najmanji unutrašnji ugao?',
      ['$60°$', '$30°$', '$90°$', '$120°$'],
      [K('Spoljašnji uglovi su $2k$, $3k$, $3k$, $4k$, a zbir im je $12k = 360°$, pa je $k = 30°$.'),
       K('Spoljašnji uglovi: $60°$, $90°$, $90°$, $120°$.', ['sA', 'sB', 'sC', 'sD']),
       K('Najmanji unutrašnji ugao je uz najveći spoljašnji: $180° − 120° = 60°$.', ['uD'])],
      cetv(T, { spolja: { A: '2k', B: '3k', C: '3k', D: '4k' }, uglovi: { D: { o: '60°', k: 3, b: 3 } }, produzi: 0.4, velicina: 230 }));
  }
  {
    proveri(4 * 75 + 60 === 360 && 180 - 75 === 105, 'spolj. 75..105');
    const T = cetv4(105, 95, 75, { a: 5.5, d: 4.5 });
    verno(T, [105, 95, 85, 75], '105,95,85,75');
    Z(3, 'Spoljašnji uglovi četvorougla redom su $α_{1}$, $β_{1}$, $γ_{1}$, $δ_{1}$ i svaki je za $10°$ veći od prethodnog. Koliki je najveći unutrašnji ugao?',
      ['$105°$', '$75°$', '$95°$', '$115°$'],
      [K('$α_{1} = x$, pa je $x + (x + 10°) + (x + 20°) + (x + 30°) = 360°$.'),
       K('$4x + 60° = 360°$, $x = 75°$: spoljašnji su $75°$, $85°$, $95°$, $105°$.', ['sA']),
       K('Najveći unutrašnji je uz najmanji spoljašnji: $α = 180° − 75° = 105°$.', ['uA'])],
      cetv(T, { spolja: { A: 'x', B: 'x+10°', C: 'x+20°', D: 'x+30°' }, uglovi: { A: { o: '105°', k: 3, b: 3 } }, produzi: 0.4, velicina: 230 }));
  }
  {
    proveri(180 / 4 === 45 && (360 - 45) / 3 === 105, 'α = 45, ostali 105');
    const T = cetv4(45, 105, 105, { a: 6, d: 5 });
    verno(T, [45, 105, 105, 105], '45,105,105,105');
    Z(3, 'Spoljašnji ugao kod temena $A$ tri puta je veći od unutrašnjeg ugla kod $A$, a ostala tri unutrašnja ugla su jednaka. Koliki je svaki od njih?',
      ['$105°$', '$135°$', '$45°$', '$115°$'],
      [K('$α + α_{1} = 180°$ i $α_{1} = 3α$, pa je $4α = 180°$ i $α = 45°$.', ['uA', 'sA']),
       K('Za ostala tri ugla ostaje $360° − 45° = 315°$.'),
       K('Svaki je $315° : 3 = 105°$.', ['uB', 'uC', 'uD'])],
      cetv(T, { uglovi: { A: 'α', B: 'x', C: 'x', D: 'x' }, spolja: { A: '3α' }, produzi: 0.5 }));
  }
  {
    proveri(180 - 110 === 70 && 180 - 70 === 110 && (360 - 180) / 2 === 90, 'β = δ = 90');
    const T = cetv4(70, 90, 90, { a: 6, d: 4.2 });
    verno(T, [70, 90, 110, 90], '70,90,110,90');
    Z(2, 'Spoljašnji uglovi četvorougla $ABCD$ kod $A$ i $C$ su $110°$ i $70°$, a unutrašnji uglovi $β$ i $δ$ su jednaki. Koliki je ugao $β$?',
      ['$90°$', '$110°$', '$70°$', '$100°$'],
      [K('$α = 180° − 110° = 70°$, $γ = 180° − 70° = 110°$', ['uA', 'uC']),
       K('$β + δ = 360° − (70° + 110°) = 180°$'),
       K('Pošto su jednaki: $β = δ = 90°$.', ['uB', 'uD'])],
      cetv(T, { spolja: { A: '110°', C: '70°' }, uglovi: { A: { o: '70°', k: 1 }, C: { o: '110°', k: 1 }, B: 'β', D: 'δ' }, produzi: 0.45 }));
  }
  {
    proveri(360 - 250 === 110 && 180 - 110 === 70, 'unutrašnji 70');
    const T = cetv4(70, 100, 95, { a: 6, d: 4.5 });
    Z(3, 'Zbir tri spoljašnja ugla četvorougla je $250°$. Koliki je unutrašnji ugao kod četvrtog temena?',
      ['$70°$', '$110°$', '$20°$', '$80°$'],
      [K('Zbir sva četiri spoljašnja ugla je $360°$, pa je četvrti spoljašnji $360° − 250° = 110°$.', ['sA']),
       K('Unutrašnji ugao uz njega je $180° − 110° = 70°$.', ['uA'])],
      cetv(T, { spolja: { A: { o: '110°', k: 1 } }, uglovi: { A: { o: '?', b: 3 } }, produzi: 0.6 }));
  }

  // ════════════════ 6.4 Paralelogram ════════════════
  L('Paralelogram');
  const P = (alfa, a = 6, d = 3.6) => paral(a, d, alfa);
  {
    proveri(180 - 58 === 122, 'β = 122');
    const T = P(58);
    Z(1, 'Oštar ugao paralelograma je $58°$. Koliki je njegov tup ugao?',
      ['$122°$', '$58°$', '$132°$', '$302°$'],
      [K('Susedni uglovi paralelograma su suplementni: $α + β = 180°$.', ['uA', 'uB']),
       K('$β = 180° − 58° = 122°$', ['uB'])],
      cetv(T, { uglovi: { A: '58°', B: 'β' }, e: [...paralelno(T.A, T.B), ...paralelno(T.D, T.C), ...paralelno(T.A, T.D, 2), ...paralelno(T.B, T.C, 2)] }));
  }
  {
    proveri(2 * (8 + 5) === 26, 'obim 26');
    const T = P(65, 7, 4.2);
    Z(1, 'Susedne stranice paralelograma su $8 cm$ i $5 cm$. Koliki je obim paralelograma?',
      ['$26 cm$', '$13 cm$', '$40 cm$', '$21 cm$'],
      [K('Naspramne stranice paralelograma su jednake: $CD = 8 cm$, $DA = 5 cm$.', ['CD', 'DA']),
       K('$O = 2 · (8 cm + 5 cm) = 2 · 13 cm = 26 cm$')],
      cetv(T, { stranice: { AB: '8 cm', BC: '5 cm', CD: { o: '8 cm', k: 1 }, DA: { o: '5 cm', k: 1 } } }));
  }
  {
    proveri(150 / 2 === 75 && 180 - 75 === 105, 'zbir 150');
    const T = P(75);
    Z(2, 'Zbir dva ugla paralelograma je $150°$. Koliki je tup ugao paralelograma?',
      ['$105°$', '$150°$', '$75°$', '$115°$'],
      [K('Dva susedna ugla imaju zbir $180°$. Pošto je zbir $150°$, to su dva naspramna – jednaka – ugla.', ['uA', 'uC']),
       K('Svaki je $150° : 2 = 75°$.'),
       K('Tup ugao: $180° − 75° = 105°$', ['uB', 'uD'])],
      cetv(T, { uglovi: { A: 'α', C: 'α', B: { o: '105°', k: 3, b: 2 }, D: { o: '105°', k: 3, b: 2 } } }));
  }
  {
    proveri((180 - 50) / 2 === 65 && 65 + 50 === 115, 'razlika 50');
    const T = P(65);
    Z(2, 'Razlika dva ugla paralelograma je $50°$. Koliki je oštar ugao?',
      ['$65°$', '$50°$', '$130°$', '$75°$'],
      [K('Naspramni uglovi su jednaki (razlika $0°$), pa su to dva susedna ugla: $α + β = 180°$ i $β − α = 50°$.', ['uA', 'uB']),
       K('$2α = 180° − 50° = 130°$, pa je $α = 65°$ (a $β = 115°$).')],
      cetv(T, { uglovi: { A: 'α', B: 'α + 50°' } }));
  }
  {
    proveri(180 / 3 === 60, 'polovina');
    const T = P(60);
    Z(2, 'Jedan ugao paralelograma jednak je polovini drugog. Koliki je manji ugao?',
      ['$60°$', '$90°$', '$45°$', '$120°$'],
      [K('Uglovi nisu jednaki, pa su susedni: $α + 2α = 180°$.', ['uA', 'uB']),
       K('$3α = 180°$, $α = 60°$; drugi ugao je $120°$.')],
      cetv(T, { uglovi: { A: 'α', B: '2α' } }));
  }
  {
    proveri(34 / 2 === 17 && (17 + 3) / 2 === 10, 'stranice 10 i 7');
    const T = P(70, 7, 4.9);
    Z(2, 'Obim paralelograma je $34 cm$, a jedna stranica je za $3 cm$ duža od druge. Kolika je duža stranica?',
      ['$10 cm$', '$7 cm$', '$15,5 cm$', '$18,5 cm$'],
      [K('Polovina obima je zbir dve susedne stranice: $a + b = 17 cm$.', ['AB', 'BC']),
       K('$a = b + 3 cm$, pa je $2b + 3 cm = 17 cm$, $b = 7 cm$.'),
       K('Duža stranica: $a = 10 cm$.')],
      cetv(T, { stranice: { AB: 'b + 3', BC: 'b' } }));
  }
  {
    proveri(8 + 14 / 2 + 10 / 2 === 20, 'obim ABO');
    const T = P(50, 8, 5);
    Z(2, 'U paralelogramu $ABCD$ je $AB = 8 cm$, a dijagonale su $AC = 14 cm$ i $BD = 10 cm$; seku se u tački $O$. Koliki je obim trougla $ABO$?',
      ['$20 cm$', '$32 cm$', '$24 cm$', '$15 cm$'],
      [K('Dijagonale paralelograma se polove: $AO = 14 : 2 = 7 cm$ i $BO = 10 : 2 = 5 cm$.', ['AC', 'BD']),
       K('$O_{ABO} = 8 + 7 + 5 = 20 cm$', ['tO'])],
      cetv(T, { dijag: true, O: true, stranice: { AB: '8 cm' }, e: [
        { lin: [T.A, T.B, presekDuzi(T.A, T.C, T.B, T.D)], zatv: 1, b: 2, gusto: 1, id: 'tO', k: 2 },
        ...crtice(T.A, presekDuzi(T.A, T.C, T.B, T.D), 1, { k: 1 }), ...crtice(presekDuzi(T.A, T.C, T.B, T.D), T.C, 1, { k: 1 }),
        ...crtice(T.B, presekDuzi(T.A, T.C, T.B, T.D), 2, { k: 1 }), ...crtice(presekDuzi(T.A, T.C, T.B, T.D), T.D, 2, { k: 1 }),
      ] }));
  }
  {
    // visine iz D (tup ugao kod D): DE ⊥ AB, DF ⊥ BC; ∠EDF = 70° = α
    const T = P(70, 6, 4);
    const E = [T.D[0], 0];
    // F = podnožje normale iz D na pravu BC
    const ux = Math.cos(rad(70)), uy = Math.sin(rad(70));
    const tt = (T.D[0] - T.B[0]) * ux + (T.D[1] - T.B[1]) * uy;
    const F = [r(T.B[0] + tt * ux), r(T.B[1] + tt * uy)];
    proveri(blizu(ugao(E, T.D, F), 70) && 180 - 70 === 110, '∠EDF = 70');
    Z(3, 'Visine paralelograma povučene iz temena tupog ugla grade ugao od $70°$. Koliki je tup ugao paralelograma?',
      ['$110°$', '$70°$', '$140°$', '$120°$'],
      [K('Posmatramo četvorougao $EBFD$: uglovi kod $E$ i $F$ su pravi, kod $D$ je $70°$.', ['q']),
       K('Ugao kod $B$: $β = 360° − (90° + 90° + 70°) = 110°$.', ['uB']),
       K('Tup ugao paralelograma je $110°$ (a oštar $70°$ – jednak je uglu između visina).')],
      cetv(T, { t: { E, F }, e: [
        { d: 'DE', b: 2, isp: 1 }, { d: 'DF', b: 2, isp: 1 }, { pu: 'DEB' }, { pu: 'DFB' },
        { u: 'EDF', o: '70°', b: 3 }, { lin: [E, T.B, F, T.D], zatv: 1, b: 2, id: 'q', k: 1 },
        { u: 'ABC', o: 'β', b: 1, id: 'uB', k: 2 },
      ] }));
  }
  {
    proveri(2 * 35 === 70 && 180 - 70 === 110, 'β = 110');
    const T = P(70, 5, 5);
    Z(3, 'U paralelogramu $ABCD$ dijagonala $AC$ je simetrala ugla $BAD$, a $∠BAC = 35°$. Koliki je ugao $β$?',
      ['$110°$', '$70°$', '$145°$', '$35°$'],
      [K('Simetrala deli ugao na dva jednaka dela: $α = 2 · 35° = 70°$.', ['uA']),
       K('Susedni uglovi su suplementni: $β = 180° − 70° = 110°$.', ['uB']),
       K('Zanimljivo: takav paralelogram je romb – sve stranice su mu jednake.')],
      cetv(T, { dijag: 'AC', uglovi: { B: { o: 'β', b: 2 } }, e: [{ u: 'BAC', o: '35°', b: 1, r: 34 }, { u: 'CAD', b: 1, r: 34 }, { u: 'DAB', b: 3, r: 22, k: 1, id: 'uA' }] }));
  }
  {
    // MNPQ, dijagonale normalne (romb), ∠MNQ = 40° → ∠N = 80°, ∠M = 100°
    const M = [0, 0], N = tacka([0, 0], 0, 5), Q = tacka(M, 100, 5), Pt = [r(N[0] + Q[0]), r(N[1] + Q[1])];
    proveri(blizu(ugao(M, N, Q), 40) && 180 - 80 === 100, 'romb 80/100');
    Z(3, 'Dijagonale paralelograma $MNPQ$ seku se pod pravim uglom, a $∠MNQ = 40°$. Koliki je ugao kod temena $M$?',
      ['$100°$', '$80°$', '$40°$', '$140°$'],
      [K('Kad su dijagonale paralelograma normalne, on je romb – a dijagonale romba polove njegove uglove.', ['NQ']),
       K('Ugao kod $N$: $2 · 40° = 80°$.', ['uN']),
       K('Ugao kod $M$: $180° − 80° = 100°$.', ['uM'])],
      G({ M, N, P: Pt, Q, S: presekDuzi(M, Pt, N, Q) }, [
        { p: 'MNPQ', b: 0 }, { d: 'MP', b: 1, isp: 1 }, { d: 'NQ', b: 2, isp: 1, id: 'NQ' }, { pu: 'MSN' },
        { u: 'MNQ', o: '40°', b: 1, r: 22 }, { u: 'MNP', b: 3, r: 44, k: 2, id: 'uN', o: '80°' }, { u: 'QMN', o: '?', b: 3, id: 'uM' },
      ], { velicina: 240, bezImena: ['S'] }));
  }

  // ════════════════ 6.5 Vrste paralelograma ════════════════
  L('Vrste paralelograma');
  const pravoug = (a, b) => ({ A: [0, 0], B: [a, 0], C: [a, b], D: [0, b] });
  {
    proveri(10 / 2 === 5, 'r = 5');
    const T = pravoug(8, 6);
    Z(1, 'Dijagonala pravougaonika je $10 cm$. Koliki je poluprečnik kružnice opisane oko pravougaonika?',
      ['$5 cm$', '$10 cm$', '$20 cm$', '$2,5 cm$'],
      [K('Dijagonale pravougaonika su jednake i polove se, pa je $OA = OB = OC = OD$.', ['AC', 'BD']),
       K('Centar opisane kružnice je presek dijagonala, a poluprečnik je polovina dijagonale: $r = 10 : 2 = 5 cm$.', ['kr'])],
      cetv(T, { dijag: true, O: true, stranice: { AC: { o: '10 cm', na: 0.3 } }, e: [{ kr: 'O', r: 5, b: 3, id: 'kr', k: 2, crtaj: 1 }] }));
  }
  {
    proveri(36 / 4 === 9, 'romb 9');
    const T = paral(5, 5, 60);
    Z(1, 'Obim romba je $36 cm$. Kolika je stranica romba?',
      ['$9 cm$', '$18 cm$', '$12 cm$', '$6 cm$'],
      [K('Sve četiri stranice romba su jednake: $O = 4a$.', ['AB', 'BC', 'CD', 'DA']),
       K('$a = 36 cm : 4 = 9 cm$')],
      cetv(T, { stranice: { AB: 'a', BC: 'a', CD: 'a', DA: 'a' }, e: [...crtice(T.A, T.B), ...crtice(T.B, T.C), ...crtice(T.C, T.D), ...crtice(T.D, T.A)] }));
  }
  {
    // ugao između dijagonala 50° (naspram kraće stranice BC) → ∠BAC = 25°
    const a = 6, b = r(6 * Math.tan(rad(25)));
    const T = pravoug(a, b);
    const O = sred(T.A, T.C);
    proveri(blizu(ugao(T.B, O, T.C), 50) && (180 - 50) / 2 === 65 && 90 - 65 === 25, '∠BAC = 25');
    Z(2, 'Dijagonale pravougaonika $ABCD$ grade oštar ugao od $50°$. Koliki ugao gradi dijagonala $AC$ sa dužom stranicom $AB$?',
      ['$25°$', '$65°$', '$50°$', '$40°$'],
      [K('Polovine dijagonala su jednake, pa je trougao $BOC$ jednakokraki: $∠OBC = ∠OCB = (180° − 50°) : 2 = 65°$.', ['tO']),
       K('U pravouglom trouglu $ABC$: $∠BAC = 90° − 65° = 25°$.', ['uA'])],
      cetv(T, { dijag: true, O: true, velicina: 260, e: [
        { u: 'BOC', o: '50°', b: 3, r: 18 }, { lin: [T.B, T.C, O], zatv: 1, b: 2, id: 'tO', k: 1 },
        { u: 'OCB', o: '65°', b: 1, k: 1 }, { pu: 'ABC' }, { u: 'BAC', o: '25°', b: 3, k: 2, id: 'uA', r: 40 },
      ] }));
  }
  {
    // romb: visina DE i dijagonala DB grade 20° → ∠DBA = 70°, β = 140°, α = 40°
    const T = paral(5, 5, 40);
    const E = [T.D[0], 0];
    proveri(blizu(ugao(E, T.D, T.B), 20) && 180 - 140 === 40, 'α = 40');
    Z(2, 'U rombu $ABCD$ visina $DE$ (na stranicu $AB$) i dijagonala $DB$ grade ugao od $20°$. Koliki je oštar ugao romba?',
      ['$40°$', '$70°$', '$20°$', '$50°$'],
      [K('U pravouglom trouglu $DEB$: $∠DBE = 90° − 20° = 70°$.', ['t']),
       K('Dijagonala romba polovi ugao kod $B$, pa je $β = 2 · 70° = 140°$.', ['uB']),
       K('Oštar ugao: $α = 180° − 140° = 40°$.', ['uA'])],
      cetv(T, { dijag: 'BD', t: { E }, e: [
        { d: 'DE', b: 2, isp: 1 }, { pu: 'DEB' }, { u: 'EDB', o: '20°', b: 3, r: 30 },
        { lin: [T.D, E, T.B], zatv: 1, b: 2, id: 't', k: 1 }, { u: 'DBA', b: 1, k: 1, o: '70°', r: 30 }, { u: 'CBD', b: 1, k: 2, id: 'uB', r: 30 }, { u: 'DAB', b: 3, k: 3, id: 'uA', o: '40°' },
      ] }));
  }
  {
    // romb sa oštrim uglom 64°: duža dijagonala AC gradi sa stranicom 32°
    const T = paral(5, 5, 64);
    proveri(2 * 32 === 64 && 180 - 64 === 116, 'tup 116');
    Z(2, 'Duža dijagonala romba gradi sa stranicom ugao od $32°$. Koliki je tup ugao romba?',
      ['$116°$', '$64°$', '$148°$', '$122°$'],
      [K('Duža dijagonala spaja temena oštrih uglova i polovi ih: oštar ugao je $2 · 32° = 64°$.', ['uA']),
       K('Tup ugao: $180° − 64° = 116°$.', ['uB'])],
      cetv(T, { dijag: 'AC', uglovi: { B: { o: '?', b: 2 } }, e: [{ u: 'BAC', o: '32°', b: 1, r: 36 }, { u: 'DAB', b: 3, r: 22, id: 'uA', k: 1, o: '64°' }] }));
  }
  {
    proveri(36 / 4 === 9 && 9 / 2 === 4.5, 'upisana 4,5');
    const T = pravoug(6, 6);
    Z(2, 'Obim kvadrata je $36 cm$. Koliki je poluprečnik kružnice upisane u kvadrat?',
      ['$4,5 cm$', '$9 cm$', '$3 cm$', '$6 cm$'],
      [K('Stranica kvadrata: $a = 36 cm : 4 = 9 cm$.', ['AB']),
       K('Upisana kružnica dodiruje sve četiri stranice; centar je presek dijagonala, a prečnik je jednak stranici.', ['kr']),
       K('$r = 9 cm : 2 = 4,5 cm$')],
      cetv(T, { dijag: true, kDijag: 2, O: true, t: { M: [3, 0] }, stranice: { AB: { o: '9 cm', k: 1 } }, e: [{ kr: 'O', r: 3, b: 3, id: 'kr', k: 2, crtaj: 1 }, { d: 'OM', b: 3, o: 'r', k: 3 }], bez: ['M'], velicina: 220 }));
  }
  {
    // simetrala ugla BAC seče BD pod 70° → ∠OAM = 20°, ∠BAO = 40°, α = 80°, β = 100°
    const T = paral(5, 5, 80);
    const Oc = presekDuzi(T.A, T.C, T.B, T.D);
    const Mt = presek(T.A, 20, T.B, step(Math.atan2(T.D[1] - T.B[1], T.D[0] - T.B[0])));
    proveri(blizu(ugao(T.A, Mt, Oc), 70) && 2 * 2 * 20 === 80 && 180 - 80 === 100, 'β = 100');
    Z(3, 'U rombu $ABCD$ dijagonale se seku u tački $O$. Simetrala ugla $BAC$ seče dijagonalu $BD$ u tački $M$ pod uglom $AMO = 70°$. Koliki je ugao $β$?',
      ['$100°$', '$80°$', '$140°$', '$110°$'],
      [K('Dijagonale romba su normalne, pa je trougao $AMO$ pravougli: $∠OAM = 90° − 70° = 20°$.', ['t']),
       K('$AM$ je simetrala ugla $BAC$: $∠BAC = 40°$. Dijagonala $AC$ polovi $α$: $α = 80°$.', ['uA']),
       K('$β = 180° − 80° = 100°$', ['uB'])],
      cetv(T, { dijag: true, O: true, t: { M: Mt }, e: [
        { d: 'AM', b: 3, debljina: 2.5 }, { pu: 'AOB' }, { u: 'AMO', o: '70°', b: 3, r: 18 },
        { lin: [T.A, Mt, Oc], zatv: 1, b: 2, id: 't', k: 1 }, { u: 'DAB', o: '80°', b: 1, k: 2, id: 'uA', r: 16 }, { u: 'ABC', o: 'β', b: 2, id: 'uB' },
      ] }));
  }
  {
    // pravougaonik sa dijagonalom 12 i uglom 60° između dijagonala → kraća stranica 6
    const b = 6, a = r(6 * Math.sqrt(3));
    const T = pravoug(a, b);
    const O = sred(T.A, T.C);
    proveri(blizu(ugao(T.B, O, T.C), 60), '∠BOC = 60');
    Z(2, 'Dijagonala pravougaonika je $12 cm$, a dijagonale se seku pod uglom od $60°$. Kolika je kraća stranica pravougaonika?',
      ['$6 cm$', '$12 cm$', '$3 cm$', '$8 cm$'],
      [K('Polovine dijagonala su po $6 cm$: $OB = OC = 6 cm$.', ['tO']),
       K('Trougao $BOC$ je jednakokraki sa uglom od $60°$ između krakova, pa su i ostala dva ugla po $60°$ – jednakostraničan je.'),
       K('Kraća stranica: $BC = OB = 6 cm$.', ['BC'])],
      cetv(T, { dijag: true, O: true, stranice: { BC: { o: '6 cm', k: 3, b: 3 } }, velicina: 260, e: [
        { u: 'BOC', o: '60°', b: 3, r: 18 }, { lin: [T.B, T.C, O], zatv: 1, b: 2, id: 'tO', k: 1 }, ...crtice(O, T.B, 1, { k: 1 }), ...crtice(O, T.C, 1, { k: 1 }),
      ] }));
  }
  {
    // pravougaonik AB = 10, AD = 6; simetrala ugla A seče CD u E → DE = 6, EC = 4
    const T = pravoug(10, 6);
    const E = [6, 6];
    proveri(10 - 6 === 4, 'EC = 4');
    Z(3, 'U pravougaoniku $ABCD$ je $AB = 10 cm$ i $AD = 6 cm$. Simetrala ugla kod $A$ seče stranicu $CD$ u tački $E$. Kolika je duž $EC$?',
      ['$4 cm$', '$6 cm$', '$5 cm$', '$3 cm$'],
      [K('Simetrala pravog ugla gradi sa stranicom $AD$ ugao od $45°$, pa je u pravouglom trouglu $AED$ i $∠AED = 45°$.', ['t']),
       K('Trougao $AED$ je jednakokraki: $DE = AD = 6 cm$.', ['DE']),
       K('$EC = DC − DE = 10 cm − 6 cm = 4 cm$', ['EC'])],
      cetv(T, { t: { E }, stranice: { AB: '10 cm', DA: '6 cm' }, velicina: 280, e: [
        { d: 'AE', b: 3 }, { u: 'BAE', o: '45°', b: 1, r: 30 }, { u: 'EAD', o: '45°', b: 1, r: 30 },
        { lin: [T.A, E, T.D], zatv: 1, b: 2, id: 't', k: 1 }, { d: 'DE', o: '6 cm', b: 2, id: 'DE', k: 2 }, { d: 'EC', o: '?', b: 3, id: 'EC' },
      ] }));
  }
  {
    proveri(4 * 7 === 28, 'romb 60° → stranica = kraća dijagonala');
    const T = paral(5, 5, 60);
    Z(3, 'Oštar ugao romba je $60°$, a kraća dijagonala je $7 cm$. Koliki je obim romba?',
      ['$28 cm$', '$14 cm$', '$21 cm$', '$56 cm$'],
      [K('Kraća dijagonala $BD$ deli romb na dva trougla. Trougao $ABD$ je jednakokraki ($AB = AD$) sa uglom $60°$ – dakle jednakostraničan.', ['t']),
       K('Stranica romba jednaka je kraćoj dijagonali: $a = 7 cm$.'),
       K('$O = 4 · 7 cm = 28 cm$')],
      cetv(T, { dijag: 'BD', uglovi: { A: '60°' }, stranice: { BD: { o: '7 cm', b: 2, isp: 1 } }, e: [{ lin: [T.A, T.B, T.D], zatv: 1, b: 2, id: 't', k: 1 }, ...crtice(T.A, T.B), ...crtice(T.D, T.A)] }));
  }
};

module.exports.crtezi = crtezi;
