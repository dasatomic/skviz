// Tema 2: Trougao (lekcije 9–13: osnovni elementi, unutrašnji i spoljašnji uglovi,
// odnos stranica i uglova, nejednakosti trougla). Zadaci sopstvenim rečima i brojevima,
// po gradivu Matematike 6 (Arhiknjiga). Crteži trougla (izUglova, izStranica, tr, zbir180,
// spoljasnji360, stapici) se izvoze i za teoriju: alati/matematika-teorija-6/3-trougao.js.

// ── crteži trougla (geometrijski verni: uglovi i stranice odgovaraju koordinatama) ──
function crtezi({ G, r }) {
  const rad = (u) => (u * Math.PI) / 180;
  const plus = (p, q, k = 1) => [r(p[0] + q[0] * k), r(p[1] + q[1] * k)];
  const minus = (p, q) => [p[0] - q[0], p[1] - q[1]];
  // produžetak: tačka iza temena V, na pravoj WV (k = deo dužine WV)
  const iza = (W, V, k = 0.55) => plus(V, minus(V, W), k);

  // temena A(0,0), B(c,0) i C iz uglova α (kod A) i β (kod B)
  function izUglova(al, be, c = 6) {
    const b = (c * Math.sin(rad(be))) / Math.sin(rad(al + be));
    return [[0, 0], [c, 0], [r(b * Math.cos(rad(al))), r(b * Math.sin(rad(al)))]];
  }
  // temena iz stranica: BC = a, CA = b, AB = c
  function izStranica(a, b, c) {
    const x = (b * b - a * a + c * c) / (2 * c);
    return [[0, 0], [c, 0], [r(x), r(Math.sqrt(Math.max(0, b * b - x * x)))]];
  }

  // trougao: P = [A, B, C]; uglovi = { A: 'α' | { o, b, id, k } }, stranice = { a: '5 cm' | { o, id, b, k } }
  // (stranica a je naspram A …); pu = teme pravog ugla; t = dodatne tačke; e = dodatni elementi
  function tr(P, { imena = 'ABC', uglovi = {}, stranice = {}, pu, b = 0, e = [], t = {}, velicina = 240, bez = [], id, gusto } = {}) {
    const [A, B, C] = imena;
    const T = { [A]: P[0], [B]: P[1], [C]: P[2], ...t };
    const el = [{ p: imena, b, ...(id ? { id } : {}), ...(gusto ? { gusto: 1 } : {}) }];
    const nasp = { a: B + C, b: C + A, c: A + B };
    for (const [s, o] of Object.entries(stranice)) el.push({ d: nasp[s] || s, ...(typeof o === 'object' ? o : { o }) });
    const boje = { [A]: 1, [B]: 2, [C]: 3 };
    for (const [v, o] of Object.entries(uglovi)) {
      const i = imena.indexOf(v);
      el.push({ u: imena[(i + 2) % 3] + v + imena[(i + 1) % 3], b: boje[v], ...(typeof o === 'object' ? o : o ? { o } : {}) });
    }
    if (pu) { const i = imena.indexOf(pu); el.push({ pu: imena[(i + 2) % 3] + pu + imena[(i + 1) % 3] }); }
    return G(T, [...el, ...e], { velicina, ...(bez.length ? { bezImena: bez } : {}) });
  }

  // dokaz da je zbir uglova 180°: prava p kroz C paralelna sa AB, uglovi α i β klize do C
  // (translacija za AC i BC), a γ se okreće (unakrsni ugao); animacija se ponavlja
  function zbir180(P, { oznake = ['α', 'β', 'γ'], ponovi = 1, velicina = 260 } = {}) {
    const [A, B, C] = P;
    const t = { A, B, C: [C[0], C[1], 200], m: [r(C[0] - 3.5), C[1]], n: [r(C[0] + 3.5), C[1]], x: iza(A, C, 0.45), y: iza(B, C, 0.45) };
    return G(t, [
      { p: 'ABC', b: 0 },
      { d: 'mn', b: 4, isp: 1 }, { tx: 'p', at: [r(C[0] + 3.7), r(C[1] + 0.3)] },
      { d: 'Cx', b: 4, isp: 1 }, { d: 'Cy', b: 4, isp: 1 },
      { u: 'CAB', b: 1, o: oznake[0] }, { u: 'ABC', b: 2, o: oznake[1] }, { u: 'BCA', b: 3, o: oznake[2] },
      { u: 'CAB', b: 1, r: 38, o: oznake[0], pomeri: minus(C, A).map(r), kasni: 0.4, trajanje: 1.4, ponovi },
      { u: 'ABC', b: 2, r: 38, o: oznake[1], pomeri: minus(C, B).map(r), kasni: 1.0, trajanje: 1.4, ponovi },
      { u: 'BCA', b: 3, r: 38, okreni: 180, oko: 'C', kasni: 1.6, trajanje: 1.4, ponovi },
    ], { velicina });
  }

  // spoljašnji uglovi (svaka stranica produžena u istom smeru obilaska) i njihovo slaganje
  // u pun ugao oko tačke Q (zbir 360°)
  function spoljasnji360(P, { oznake = ['α₁', 'β₁', 'γ₁'], slozi = true, ponovi = 1, velicina = 280 } = {}) {
    const [A, B, C] = P;
    const Q = [r(Math.max(A[0], B[0], C[0]) + 3.2), r((A[1] + B[1] + C[1]) / 3)];
    const t = { A, B, C, x: iza(C, A, 0.5), y: iza(A, B, 0.45), z: iza(B, C, 0.5), q: Q };
    const e = [{ p: 'ABC', b: 0 }, { d: 'Ax', b: 4, isp: 1 }, { d: 'By', b: 4, isp: 1 }, { d: 'Cz', b: 4, isp: 1 },
      { u: 'xAB', b: 1, o: oznake[0] }, { u: 'yBC', b: 2, o: oznake[1] }, { u: 'zCA', b: 3, o: oznake[2] }];
    if (slozi) {
      e.push({ u: 'xAB', b: 1, r: 34, pomeri: minus(Q, A).map(r), kasni: 0.4, trajanje: 1.4, ponovi },
        { u: 'yBC', b: 2, r: 34, pomeri: minus(Q, B).map(r), kasni: 1.0, trajanje: 1.4, ponovi },
        { u: 'zCA', b: 3, r: 34, pomeri: minus(Q, C).map(r), kasni: 1.6, trajanje: 1.4, ponovi });
    }
    return G(t, e, { velicina, bezImena: ['q'] });
  }

  // tri štapića: osnovica c (AB), iz A štapić b, iz B štapić a; podižu se dok se ne spoje
  // (ako trougao postoji), inače ostaju razmaknuti ili leže na osnovici
  function stapici(a, b, c, { natpisi = true, ponovi = 1, velicina = 280, animacija = true } = {}) {
    let al, be;
    if (a + b > c && a + c > b && b + c > a) {
      al = (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
      be = (Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180) / Math.PI;
    } else if (a + b === c) { al = 0; be = 0; } else { al = 62; be = 62; }
    if (!animacija) {
      // tri štapića jedan ispod drugog (još nesklopljena) – crtež ne odaje da li se spajaju
      const D = Math.max(a, b, c), y = [0, -0.9, -1.8];
      const st = [[c, 0], [b, 1], [a, 2]].map(([d, bb], i) => [{ lin: [[0, y[i]], [d, y[i]]], b: bb, debljina: 6 }, ...(natpisi ? [{ tx: `${String(d).replace('.', ',')} cm`, at: [r(D + 1.2), y[i]], b: bb }] : [])]);
      return G({ O: [0, 0] }, st.flat(), { velicina, bezImena: ['O'] });
    }
    const t = { A: [0, 0], B: [c, 0], p: [b, 0], q: [c - a, 0] };
    const ug = animacija ? { kasni: 0.4, trajanje: 1.6, ponovi } : {};
    const e = [
      { d: 'AB', b: 0, debljina: 6 },
      { d: 'Ap', b: 1, debljina: 6, ...(al ? { okreni: r(al), oko: 'A', ...ug } : {}) },
      { d: 'Bq', b: 2, debljina: 6, ...(be ? { okreni: r(-be), oko: 'B', ...ug } : {}) },
    ];
    if (natpisi) e.push({ tx: `${String(c).replace('.', ',')}`, at: [c / 2, -0.7], b: 0 }, { tx: `${String(b).replace('.', ',')}`, at: [-0.7, 0.9], b: 1 }, { tx: `${String(a).replace('.', ',')}`, at: [c + 0.7, 0.9], b: 2 });
    return G(t, e, { velicina, bezImena: ['A', 'B'] });
  }

  return { rad, plus, minus, iza, izUglova, izStranica, tr, zbir180, spoljasnji360, stapici };
}

module.exports = (A) => {
  const { L, Z, K, G, R, r, proveri, naKrugu } = A;
  const { iza, izUglova, izStranica, tr, minus } = crtezi(A);
  const kombinacije = (niz, k) => (k === 0 ? [[]] : niz.flatMap((x, i) => kombinacije(niz.slice(i + 1), k - 1).map((c) => [x, ...c])));
  const postoji = ([a, b, c]) => a + b > c && a + c > b && b + c > a;

  // ════════════════ 2.1 Osnovni elementi trougla ════════════════
  L('Osnovni elementi trougla');

  proveri(Math.abs(4.7 + 5.3 + 6.8 - 16.8) < 1e-9, 'obim 16,8');
  Z(1, 'Stranice trougla $ABC$ su $a = 4,7 cm$, $b = 5,3 cm$ i $c = 6,8 cm$. Koliki je obim trougla?',
    ['$16,8 cm$', '$15,8 cm$', '$10 cm$', '$17,6 cm$'],
    [K('Obim trougla je zbir dužina sve tri stranice: $O = a + b + c$.', ['tr']),
     K('$O = 4,7 cm + 5,3 cm + 6,8 cm = 10 cm + 6,8 cm = 16,8 cm$')],
    tr(izStranica(4.7, 5.3, 6.8), { stranice: { a: '4,7 cm', b: '5,3 cm', c: '6,8 cm' }, id: 'tr' }));

  proveri(13.5 / 3 === 4.5, 'jednakostranični 13,5 : 3');
  Z(1, 'Obim jednakostraničnog trougla je $13,5 cm$. Kolika je njegova stranica?',
    ['$4,5 cm$', '$6,75 cm$', '$4,05 cm$', '$3,5 cm$'],
    [K('Jednakostranični trougao ima tri jednake stranice, pa je $O = 3 · a$.', ['a', 'b', 'c']),
     K('$a = 13,5 cm : 3 = 4,5 cm$')],
    tr(izStranica(4.5, 4.5, 4.5), { stranice: { a: { o: 'a', id: 'a' }, b: { o: 'a', id: 'b' }, c: { o: 'a', id: 'c' } } }));

  proveri(15 + (15 - 4) + (15 + 7) === 48, 'obim DEF 48');
  Z(2, 'U trouglu $DEF$ stranica $e$ je $15 cm$. Stranica $d$ je za $4 cm$ kraća, a stranica $f$ za $7 cm$ duža od $e$. Koliki je obim trougla?',
    ['$48 cm$', '$45 cm$', '$41 cm$', '$37 cm$'],
    [K('$d = 15 cm − 4 cm = 11 cm$', ['d']),
     K('$f = 15 cm + 7 cm = 22 cm$', ['f']),
     K('$O = d + e + f = 11 cm + 15 cm + 22 cm = 48 cm$')],
    tr(izStranica(11, 15, 22), { imena: 'DEF', stranice: { a: { o: 'd', id: 'd' }, b: { o: '15 cm', id: 'e' }, c: { o: 'f', id: 'f' } } }));

  proveri(Math.abs((42.6 - 2.4 - 4.8) / 3 - 11.8) < 1e-9, 'a = 11,8');
  Z(2, 'Obim trougla je $42,6 cm$. Stranica $a$ je najkraća, a svaka sledeća je za $2,4 cm$ duža od prethodne. Kolika je najduža stranica?',
    ['$16,6 cm$', '$14,2 cm$', '$11,8 cm$', '$19 cm$'],
    [K('Sve stranice izrazimo preko $a$: $b = a + 2,4 cm$, $c = a + 4,8 cm$.', ['b', 'c']),
     K('$a + (a + 2,4) + (a + 4,8) = 42,6$, pa je $3a + 7,2 = 42,6$ i $3a = 35,4$.'),
     K('$a = 11,8 cm$, $b = 14,2 cm$, $c = 16,6 cm$. Provera: $11,8 + 14,2 + 16,6 = 42,6$ ✓', ['c'])],
    tr(izStranica(11.8, 14.2, 16.6), { stranice: { a: { o: 'a', id: 'a' }, b: { o: 'a + 2,4', id: 'b' }, c: { o: 'a + 4,8', id: 'c' } } }));

  proveri((34 - 10) / 2 === 12, 'krak 12');
  Z(2, 'Obim jednakokrakog trougla je $34 cm$, a osnovica je $10 cm$. Koliki je krak?',
    ['$12 cm$', '$24 cm$', '$8 cm$', '$14 cm$'],
    [K('Jednakokraki trougao ima dva jednaka kraka $b$: $O = a + 2b$.', ['b1', 'b2']),
     K('$2b = 34 cm − 10 cm = 24 cm$'),
     K('$b = 24 cm : 2 = 12 cm$')],
    tr(izStranica(12, 12, 10), { stranice: { c: '10 cm', a: { o: 'b', id: 'b1' }, b: { o: 'b', id: 'b2' } } }));

  proveri(16 + 17 + 18 === 51, 'uzastopni 16, 17, 18');
  Z(2, 'Dužine stranica trougla (u centimetrima) su tri uzastopna prirodna broja, a obim je $51 cm$. Koje su to dužine?',
    ['$16$, $17$ i $18 cm$', '$15$, $17$ i $19 cm$', '$17$, $17$ i $17 cm$', '$16$, $18$ i $20 cm$'],
    [K('Uzastopni brojevi: $n$, $n + 1$, $n + 2$. Zbir: $3n + 3 = 51$.'),
     K('$3n = 48$, $n = 16$. Stranice su $16$, $17$ i $18 cm$.'),
     K('Brže: srednji broj je trećina obima, $51 : 3 = 17$.')],
    R(tr(izStranica(16, 17, 18), { stranice: { a: '16 cm', b: '17 cm', c: '18 cm' } })));

  proveri(19 + 21 + 23 === 63, 'neparni 19, 21, 23');
  Z(3, 'Dužine stranica trougla (u centimetrima) su tri uzastopna neparna broja, a obim je $63 cm$. Kolika je najkraća stranica?',
    ['$19 cm$', '$21 cm$', '$20 cm$', '$17 cm$'],
    [K('Uzastopni neparni brojevi razlikuju se za $2$: $n$, $n + 2$, $n + 4$.'),
     K('$3n + 6 = 63$, $3n = 57$, $n = 19$.'),
     K('Stranice su $19$, $21$ i $23 cm$ – srednja je opet trećina obima: $63 : 3 = 21$.')],
    R(tr(izStranica(19, 21, 23), { stranice: { a: '19 cm', b: '21 cm', c: '23 cm' } })));

  const sest = 'MNPQRS'.split('');
  const tSest = Object.fromEntries(sest.map((n, i) => [n, naKrugu([0, 0], 3, 90 + 60 * i)]));
  proveri(kombinacije(sest, 3).length === 20, 'C(6,3) = 20');
  Z(2, 'Na kružnici je označeno $6$ tačaka. Koliko ima trouglova čija su temena neke tri od tih tačaka?',
    ['$20$', '$18$', '$120$', '$6$'],
    [K('Trougao biramo kao skup od tri tačke. Prvu tačku biramo na $6$, drugu na $5$, treću na $4$ načina: $6 · 5 · 4 = 120$.'),
     K('Ali isti trougao (npr. $MNP$) dobijamo u $3 · 2 · 1 = 6$ redosleda ($MNP$, $MPN$, $NMP$ …).', ['t1']),
     K('Zato je trouglova $120 : 6 = 20$.')],
    G({ O: [0, 0], ...tSest }, [{ kr: 'O', r: 3, b: 4 }, { tacka: sest.join(''), b: 1 }, { p: 'MNP', b: 2, k: 2, id: 't1' }], { bezImena: ['O'], velicina: 220 }));

  proveri(8 + 9 + 11 === 28 && 28 / 2 - 11 === 3, 'AM = 3');
  Z(3, 'U trouglu $ABC$ je $AB = 8 cm$, $BC = 9 cm$ i $CA = 11 cm$. Tačka $M$ na stranici $AB$ deli obim na dva jednaka dela (put $C → A → M$ jednak je putu $C → B → M$). Koliko je $AM$?',
    ['$3 cm$', '$4 cm$', '$5 cm$', '$2 cm$'],
    [K('Obim je $8 + 9 + 11 = 28 cm$, pa je svaki deo $14 cm$.'),
     K('Put $C → A → M$: $CA + AM = 14$, pa je $AM = 14 − 11 = 3 cm$.', ['p1']),
     K('Provera, drugi put: $CB + BM = 9 + 5 = 14 cm$ ✓', ['p2'])],
    tr(izStranica(9, 11, 8), { stranice: { a: '9 cm', b: '11 cm', c: { o: '8 cm', na: 0.72 } }, t: { M: [3, 0, -110] },
      e: [{ tacka: 'M', b: 1 }, { d: 'CA', b: 1, debljina: 5, k: 2, id: 'p1' }, { d: 'AM', b: 1, debljina: 5, k: 2, id: 'p1' }, { d: 'CB', b: 2, debljina: 5, k: 3, id: 'p2' }, { d: 'BM', b: 2, debljina: 5, k: 3, id: 'p2' }] }));

  proveri(4 * 1 + 2 * 6 === 16, '2 i 4 tačke na paralelama: 16');
  Z(3, 'Na pravoj $a$ su $2$ tačke, a na pravoj $b$, paralelnoj sa $a$, još $4$ tačke. Koliko ima trouglova čija su temena neke tri od tih tačaka?',
    ['$16$', '$8$', '$20$', '$12$'],
    [K('Tri tačke sa iste prave ne čine trougao. Zato trougao ima dva temena na jednoj, a jedno na drugoj pravoj.'),
     K('Oba temena na $a$ (jedan par) i jedno na $b$: $1 · 4 = 4$ trougla.', ['ta']),
     K('Dva temena na $b$ (parova ima $6$) i jedno na $a$: $6 · 2 = 12$ trouglova.', ['tb']),
     K('Ukupno $4 + 12 = 16$.')],
    G({ P: [-1.5, 2], Q: [1.5, 2], K: [-3, 0], L: [-1, 0], M: [1, 0], N: [3, 0], a1: [-4, 2], a2: [4, 2], b1: [-4, 0], b2: [4, 0] },
      [{ d: 'a1a2', b: 4 }, { d: 'b1b2', b: 4 }, { tx: 'a', at: [4.4, 2] }, { tx: 'b', at: [4.4, 0] },
       { tacka: 'PQKLMN', b: 1 }, { p: 'PQM', b: 2, k: 2, id: 'ta' }, { p: 'KNP', b: 3, k: 3, id: 'tb' }], { velicina: 260 }));

  // ════════════════ 2.2 Unutrašnji uglovi trougla ════════════════
  L('Unutrašnji uglovi trougla');

  proveri(180 - 73 - 48 === 59, 'γ = 59');
  Z(1, 'U trouglu $ABC$ je $α = 73°$ i $β = 48°$. Koliki je ugao $γ$?',
    ['$59°$', '$69°$', '$121°$', '$49°$'],
    [K('Zbir unutrašnjih uglova trougla je $180°$: $α + β + γ = 180°$.'),
     K('$γ = 180° − (73° + 48°) = 180° − 121° = 59°$', ['g'])],
    tr(izUglova(73, 48), { uglovi: { A: '73°', B: '48°', C: { o: 'γ', id: 'g' } } }));

  proveri(90 - 27 === 63, 'α = 63');
  Z(1, 'U pravouglom trouglu jedan oštar ugao je $27°$. Koliki je drugi oštar ugao?',
    ['$63°$', '$73°$', '$153°$', '$53°$'],
    [K('Pravi ugao je $90°$, pa je zbir dva oštra ugla $180° − 90° = 90°$.'),
     K('Drugi oštar ugao: $90° − 27° = 63°$', ['x'])],
    tr(izUglova(27, 63), { pu: 'C', uglovi: { A: '27°', B: { o: '?', id: 'x' } } }));

  proveri(54 + 36 === 90 && 54 - 36 === 18, '54 i 36');
  Z(2, 'Oštri uglovi pravouglog trougla razlikuju se za $18°$. Koliki su?',
    ['$54°$ i $36°$', '$72°$ i $18°$', '$99°$ i $81°$', '$58°$ i $40°$'],
    [K('$α + β = 90°$ i $α = β + 18°$.'),
     K('$(β + 18°) + β = 90°$, pa je $2β = 72°$ i $β = 36°$.', ['b']),
     K('$α = 36° + 18° = 54°$', ['a'])],
    tr(izUglova(54, 36), { pu: 'C', uglovi: { A: { o: 'β + 18°', id: 'a' }, B: { o: 'β', id: 'b' } } }));

  proveri((90 - 25) / 2 === 32.5, 'β = 32°30′');
  Z(2, 'Jedan oštar ugao pravouglog trougla je za $25°$ veći od drugog. Koliki je manji oštar ugao?',
    ['$32°30′$', '$32°50′$', '$65°$', '$57°30′$'],
    [K('$β + (β + 25°) = 90°$, pa je $2β = 65°$.'),
     K('$65°$ nije deljivo sa $2$ bez ostatka: $65° = 64°60′$.'),
     K('$β = 64°60′ : 2 = 32°30′$, a drugi ugao je $57°30′$.', ['b'])],
    tr(izUglova(57.5, 32.5), { pu: 'C', uglovi: { B: { o: 'β', id: 'b' }, A: 'β + 25°' } }));

  proveri(180 / 9 === 20 && 5 * 20 === 100, 'x, 3x, 5x');
  Z(2, 'Uglovi trougla su $x$, $3x$ i $5x$. Koliki je najveći ugao?',
    ['$100°$', '$60°$', '$90°$', '$120°$'],
    [K('$x + 3x + 5x = 180°$, pa je $9x = 180°$ i $x = 20°$.'),
     K('Uglovi su $20°$, $60°$ i $100°$ – najveći je $5x = 100°$, trougao je tupougli.', ['g'])],
    R(tr(izUglova(60, 20), { uglovi: { A: '60°', B: '20°', C: { o: '100°', id: 'g' } } })));

  proveri(2 * 40 + 40 + 40 + 20 === 180, 'α = 2β, γ = β + 20');
  Z(2, 'U trouglu je $α = 2β$, a $γ = β + 20°$. Koliki je ugao $α$?',
    ['$80°$', '$40°$', '$60°$', '$90°$'],
    [K('Sve izrazimo preko $β$: $2β + β + (β + 20°) = 180°$.'),
     K('$4β + 20° = 180°$, $4β = 160°$, $β = 40°$.'),
     K('$α = 2 · 40° = 80°$, $γ = 60°$. Provera: $80° + 40° + 60° = 180°$ ✓', ['a'])],
    tr(izUglova(80, 40), { uglovi: { A: { o: '2β', id: 'a' }, B: 'β', C: 'β + 20°' } }));

  // 180° − (38°45′ + 71°30′) = 180° − 110°15′ = 69°45′
  proveri(180 * 60 - (38 * 60 + 45 + 71 * 60 + 30) === 69 * 60 + 45, 'γ = 69°45′');
  Z(2, 'U trouglu je $α = 38°45′$ i $β = 71°30′$. Koliki je ugao $γ$?',
    ['$69°45′$', '$70°15′$', '$69°15′$', '$110°15′$'],
    [K('$α + β = 38°45′ + 71°30′ = 109°75′ = 110°15′$'),
     K('$180° = 179°60′$, pa je $γ = 179°60′ − 110°15′ = 69°45′$', ['g'])],
    tr(izUglova(38.75, 71.5), { uglovi: { A: '38°45′', B: '71°30′', C: { o: 'γ', id: 'g' } } }));

  // CD je simetrala ugla γ; α = 50°, β = 60° ⇒ γ = 70°, ∠ACD = 35°, ∠ADC = 95°
  {
    const P = izUglova(50, 60, 6);
    const A0 = P[0], C0 = P[2];
    // D na AB tako da je ∠ACD = 35°: u trouglu ACD, ∠ADC = 95°, AD = AC·sin35°/sin95°
    const AC = Math.hypot(C0[0] - A0[0], C0[1] - A0[1]);
    const AD = (AC * Math.sin((35 * Math.PI) / 180)) / Math.sin((95 * Math.PI) / 180);
    proveri(180 - 50 - 60 === 70 && 180 - 50 - 35 === 95, '∠ADC = 95°');
    Z(3, 'U trouglu $ABC$ je $α = 50°$ i $β = 60°$. Simetrala ugla $γ$ seče stranicu $AB$ u tački $D$. Koliki je ugao $∠ADC$?',
      ['$95°$', '$85°$', '$70°$', '$100°$'],
      [K('$γ = 180° − (50° + 60°) = 70°$', ['g']),
       K('Simetrala deli $γ$ na pola: $∠ACD = 35°$.', ['g1']),
       K('U trouglu $ADC$: $∠ADC = 180° − (50° + 35°) = 95°$', ['d'])],
      tr(P, { t: { D: [r(AD), 0, -90] }, uglovi: { A: '50°', B: '60°' },
        e: [{ d: 'CD', b: 4, isp: 1 }, { u: 'BCA', b: 3, k: 1, kraj: 2, id: 'g', o: '70°', r: 34 }, { u: 'DCA', b: 5, k: 2, id: 'g1', o: '35°' }, { u: 'ADC', b: 1, k: 3, id: 'd', o: '?' }] }));
  }

  proveri(180 / 9 * 2 === 40 && 180 / 9 * 4 === 80, '2:3:4');
  Z(3, 'Uglovi trougla odnose se kao $2 : 3 : 4$. Koliki je najmanji ugao?',
    ['$40°$', '$20°$', '$60°$', '$45°$'],
    [K('Uglovi su $2k$, $3k$ i $4k$: $9k = 180°$, pa je $k = 20°$.'),
     K('Uglovi: $40°$, $60°$ i $80°$. Najmanji je $40°$ – trougao je oštrougli.', ['a'])],
    R(tr(izUglova(40, 60), { uglovi: { A: { o: '40°', id: 'a' }, B: '60°', C: '80°' } })));

  proveri(180 - 64 - 52 === 64, 'γ = 64');
  {
    const P = izUglova(64, 52);
    const C = P[2];
    Z(3, 'Kroz teme $C$ trougla $ABC$ povučena je prava $p ∥ AB$. Prava $p$ i stranica $CB$ grade ugao od $52°$ (kao na slici), a $α = 64°$. Koliki je ugao $γ$?',
      ['$64°$', '$52°$', '$76°$', '$116°$'],
      [K('Ugao između $p$ i $CB$ i ugao $β$ su naizmenični uglovi (transverzala $CB$ seče paralele $p$ i $AB$), pa je $β = 52°$.', ['b', 'n']),
       K('$γ = 180° − (64° + 52°) = 64°$', ['g'])],
      tr(P, { t: { m: [r(C[0] - 3), C[1]], n: [r(C[0] + 3), C[1]] }, uglovi: { A: '64°', B: { o: 'β', id: 'b', k: 1 }, C: { o: '?', id: 'g' } },
        e: [{ d: 'mn', b: 4 }, { tx: 'p', at: [r(C[0] + 3.3), r(C[1] + 0.3)] }, { u: 'nCB', b: 2, o: '52°', id: 'n' }] }));
  }

  // ════════════════ 2.3 Spoljašnji uglovi trougla ════════════════
  L('Spoljašnji uglovi trougla');

  // spoljašnji ugao kod temena (produžena stranica iz drugog temena)
  const spolj = (P, { kod = 'C', od = 'B', uglovi = {}, o, id = 's', b = 5, k, e = [], ...x } = {}) => {
    const i = 'ABC'.indexOf(kod), j = 'ABC'.indexOf(od);
    const druga = 'ABC'[3 - i - j];
    const X = iza(P[j], P[i], 0.6);
    return tr(P, { ...x, uglovi, t: { ...(x.t || {}), x: X }, e: [{ d: kod + 'x', b: 4, isp: 1 }, { u: 'x' + kod + druga, b, ...(o ? { o } : {}), id, ...(k ? { k } : {}) }, ...e] });
  };

  proveri(64 + 71 === 135, 'γ1 = 135');
  Z(1, 'U trouglu $ABC$ je $α = 64°$ i $β = 71°$. Koliki je spoljašnji ugao kod temena $C$?',
    ['$135°$', '$45°$', '$125°$', '$145°$'],
    [K('Spoljašnji ugao jednak je zbiru dva nesusedna unutrašnja ugla: $γ₁ = α + β$.', ['s']),
     K('$γ₁ = 64° + 71° = 135°$ (ili: $γ = 45°$, pa $γ₁ = 180° − 45° = 135°$).')],
    spolj(izUglova(64, 71), { kod: 'C', od: 'B', uglovi: { A: '64°', B: '71°' }, o: 'γ₁' }));

  Z(1, 'Spoljašnji ugao kod temena $A$ je $112°$. Koliki je unutrašnji ugao $α$?',
    ['$68°$', '$78°$', '$112°$', '$58°$'],
    [K('Unutrašnji i spoljašnji ugao kod istog temena su uporedni: $α + α₁ = 180°$.', ['s', 'a']),
     K('$α = 180° − 112° = 68°$')],
    spolj(izUglova(68, 55), { kod: 'A', od: 'B', o: '112°', uglovi: { A: { o: 'α', id: 'a' } } }));

  proveri(180 - 150 === 30 && 180 - 48 - 30 === 102, 'β = 102');
  Z(2, 'U trouglu $ABC$ je $α = 48°$, a spoljašnji ugao kod $C$ je $γ₁ = 150°$. Koliki je ugao $β$?',
    ['$102°$', '$78°$', '$132°$', '$98°$'],
    [K('$γ = 180° − 150° = 30°$', ['s']),
     K('$β = 180° − (48° + 30°) = 102°$ (ili $β = γ₁ − α = 150° − 48°$).', ['b'])],
    spolj(izUglova(48, 102, 5), { kod: 'C', od: 'A', o: '150°', uglovi: { A: '48°', B: { o: 'β', id: 'b' } } }));

  proveri(360 - 125 - 140 === 95 && 180 - 95 === 85, 'γ = 85');
  Z(2, 'Dva spoljašnja ugla trougla su $125°$ i $140°$. Koliki je unutrašnji ugao kod trećeg temena?',
    ['$85°$', '$95°$', '$75°$', '$105°$'],
    [K('Zbir spoljašnjih uglova trougla je $360°$: treći spoljašnji je $360° − 125° − 140° = 95°$.'),
     K('Unutrašnji ugao uz njega: $180° − 95° = 85°$.'),
     K('Provera: unutrašnji uglovi su $55°$, $40°$ i $85°$ – zbir $180°$ ✓')],
    R(crtezi(A).spoljasnji360(izUglova(55, 40), { oznake: ['125°', '140°', '95°'], slozi: false })));

  proveri(360 / 12 === 30 && 3 * 30 === 90 && 180 - 90 === 90, '3y, 4y, 5y spoljašnji');
  Z(2, 'Spoljašnji uglovi trougla su $3y$, $4y$ i $5y$. Koliki je najveći unutrašnji ugao?',
    ['$90°$', '$150°$', '$75°$', '$60°$'],
    [K('$3y + 4y + 5y = 360°$, pa je $12y = 360°$ i $y = 30°$.'),
     K('Spoljašnji uglovi: $90°$, $120°$, $150°$. Unutrašnji: $90°$, $60°$, $30°$.'),
     K('Najveći unutrašnji ugao je uz najmanji spoljašnji: $90°$. Trougao je pravougli.')],
    R(spolj(izUglova(90, 60), { kod: 'A', od: 'B', o: '90°', pu: 'A', uglovi: { B: '60°', C: '30°' } })));

  proveri(180 / 9 * 2 === 40 && 180 - 40 === 140, '2y, 3y, 4y unutrašnji');
  Z(2, 'Unutrašnji uglovi trougla su $2y$, $3y$ i $4y$. Koliki je najveći spoljašnji ugao?',
    ['$140°$', '$100°$', '$80°$', '$160°$'],
    [K('$9y = 180°$, $y = 20°$: unutrašnji uglovi su $40°$, $60°$ i $80°$.'),
     K('Najveći spoljašnji ugao je uz najmanji unutrašnji: $180° − 40° = 140°$.', ['s'])],
    R(spolj(izUglova(40, 60), { kod: 'A', od: 'B', o: '140°', uglovi: { A: '40°', B: '60°', C: '80°' } })));

  proveri(180 / 5 === 36 && 180 - 70 - 36 === 74, 'β = β₁/4');
  Z(2, 'U trouglu je spoljašnji ugao $γ₁ = 110°$, a unutrašnji ugao $β$ je četiri puta manji od svog spoljašnjeg ugla $β₁$. Koliki je ugao $α$?',
    ['$74°$', '$36°$', '$70°$', '$84°$'],
    [K('$β₁ = 4β$, a $β + β₁ = 180°$, pa je $5β = 180°$ i $β = 36°$.', ['b']),
     K('$γ = 180° − 110° = 70°$'),
     K('$α = 180° − (36° + 70°) = 74°$', ['a'])],
    R(tr(izUglova(74, 36), { uglovi: { A: { o: '74°', id: 'a' }, B: { o: '36°', id: 'b' }, C: '70°' } })));

  proveri((180 - 70) / 2 === 55 && 180 - 45 - 55 === 80, 'x = 55');
  Z(3, 'Na slici je kod temena $B$ unutrašnji ugao $x$, a spoljašnji $x + 70°$. Ugao kod $A$ je $45°$. Koliki je ugao kod $C$?',
    ['$80°$', '$55°$', '$70°$', '$90°$'],
    [K('Uporedni uglovi: $x + (x + 70°) = 180°$, pa je $2x = 110°$ i $x = 55°$.', ['b', 's']),
     K('Ugao kod $C$: $180° − (45° + 55°) = 80°$', ['g'])],
    spolj(izUglova(45, 55), { kod: 'B', od: 'A', o: 'x + 70°', uglovi: { A: '45°', B: { o: 'x', id: 'b' }, C: { o: '?', id: 'g' } } }));

  // simetrale spoljašnjih uglova kod A i B seku se pod uglom 90° − γ/2
  {
    const al = 60, be = 70, ga = 50;
    const P = izUglova(al, be, 5);
    proveri(90 - ga / 2 === 65, 'φ = 90 − γ/2 = 65');
    // pravci simetrala spoljašnjih uglova (spoljašnji kod A: između AC i produžetka BA)
    const dA = [Math.cos(rad(al + (180 - al) / 2)), Math.sin(rad(al + (180 - al) / 2))];
    const dB = [Math.cos(rad(180 - be - (180 - be) / 2)), Math.sin(rad(180 - be - (180 - be) / 2))];
    // presek E = A + s·dA = B + u·dB
    const det = dA[0] * -dB[1] - dA[1] * -dB[0];
    const s = ((P[1][0] - P[0][0]) * -dB[1] - (P[1][1] - P[0][1]) * -dB[0]) / det;
    const E = [r(P[0][0] + s * dA[0]), r(P[0][1] + s * dA[1])];
    Z(3, 'Simetrale spoljašnjih uglova kod temena $A$ i $B$ trougla $ABC$ seku se u tački $E$ pod uglom $∠AEB = 65°$. Koliki je ugao $γ$?',
      ['$50°$', '$65°$', '$25°$', '$130°$'],
      [K('U trouglu $ABE$ uglovi kod $A$ i $B$ su polovine spoljašnjih uglova: ${α₁|2}$ i ${β₁|2}$.', ['ea', 'eb']),
       K('$α₁ + β₁ = (180° − α) + (180° − β) = 360° − (α + β) = 180° + γ$.'),
       K('$65° = 180° − {180° + γ|2} = 90° − {γ|2}$, pa je ${γ|2} = 25°$ i $γ = 50°$.')],
      tr(P, { t: { E: [E[0], E[1], -90], x: iza(P[2], P[0], 0.6), y: iza(P[2], P[1], 0.6) }, uglovi: { C: { o: '?', id: 'g' } },
        e: [{ d: 'Ax', b: 4, isp: 1 }, { d: 'By', b: 4, isp: 1 }, { d: 'AE', b: 1 }, { d: 'BE', b: 2 }, { u: 'AEB', b: 5, o: '65°', r: 30 },
          { u: 'BAx', b: 1, r: 14, k: 1 }, { u: 'yBA', b: 2, r: 14, k: 1 }, { u: 'EAB', b: 1, id: 'ea', k: 1 }, { u: 'ABE', b: 2, id: 'eb', k: 1 }], velicina: 220 }));
  }
  function rad(u) { return (u * Math.PI) / 180; }

  proveri(4 * 45 === 180 && 180 - 90 === 90 && 45 + 45 + 90 === 180, 'α₁ = 2γ, β₁ = 3γ');
  Z(3, 'U trouglu je spoljašnji ugao $α₁ = 2γ$, a spoljašnji ugao $β₁ = 3γ$. Koliki je unutrašnji ugao $α$?',
    ['$90°$', '$45°$', '$135°$', '$60°$'],
    [K('Treći spoljašnji ugao je $γ₁ = 180° − γ$. Zbir spoljašnjih: $2γ + 3γ + (180° − γ) = 360°$.'),
     K('$4γ = 180°$, pa je $γ = 45°$.'),
     K('$α₁ = 90°$, pa je $α = 180° − 90° = 90°$; $β₁ = 135°$, $β = 45°$. Provera: $90° + 45° + 45° = 180°$ ✓', ['a'])],
    R(tr(izUglova(90, 45), { pu: 'A', uglovi: { A: { o: '90°', id: 'a' }, B: '45°', C: '45°' } })));

  // ════════════════ 2.4 Odnos stranica i uglova u trouglu ════════════════
  L('Odnos stranica i uglova u trouglu');

  // jednakokraki trougao sa osnovicom AB i uglom pri vrhu C
  const jk = (vrh, x = {}) => tr(izUglova((180 - vrh) / 2, (180 - vrh) / 2, 5), x);

  proveri((180 - 56) / 2 === 62, '62');
  Z(1, 'Ugao pri vrhu jednakokrakog trougla je $56°$. Koliki je ugao na osnovici?',
    ['$62°$', '$124°$', '$56°$', '$72°$'],
    [K('Uglovi na osnovici jednakokrakog trougla su jednaki: $56° + 2β = 180°$.', ['a', 'b']),
     K('$2β = 124°$, $β = 62°$')],
    jk(56, { uglovi: { C: '56°', A: { o: 'β', id: 'a' }, B: { o: 'β', id: 'b' } }, stranice: { a: { o: '', b: 1 }, b: { o: '', b: 1 } } }));

  proveri(180 - 2 * 47 === 86, '86');
  Z(1, 'Ugao na osnovici jednakokrakog trougla je $47°$. Koliki je ugao pri vrhu?',
    ['$86°$', '$133°$', '$94°$', '$43°$'],
    [K('Oba ugla na osnovici su po $47°$.', ['b']),
     K('Ugao pri vrhu: $180° − 2 · 47° = 180° − 94° = 86°$', ['c'])],
    jk(86, { uglovi: { A: '47°', B: { o: '', id: 'b' }, C: { o: '?', id: 'c' } } }));

  proveri(180 - 64 - 48 === 68, 'γ = 68');
  Z(2, 'U trouglu $ABC$ je $α = 64°$ i $β = 48°$. Kako su poređane stranice po dužini?',
    ['$c > a > b$', '$a > b > c$', '$a > c > b$', '$b > a > c$'],
    [K('$γ = 180° − (64° + 48°) = 68°$'),
     K('Naspram većeg ugla je veća stranica: $γ > α > β$, pa je $c > a > b$.', ['c', 'a', 'b'])],
    R(tr(izUglova(64, 48), { uglovi: { A: '64°', B: '48°', C: '68°' }, stranice: { c: { o: 'c', id: 'c', b: 3 }, a: { o: 'a', id: 'a', b: 1 }, b: { o: 'b', id: 'b', b: 2 } } })));

  proveri(3 * 50 + 30 === 180 && 80 + 50 + 50 === 180, 'vrh 80');
  Z(2, 'Ugao pri vrhu jednakokrakog trougla je za $30°$ veći od ugla na osnovici. Koliki je ugao pri vrhu?',
    ['$80°$', '$50°$', '$70°$', '$100°$'],
    [K('Ugao na osnovici je $x$, pri vrhu $x + 30°$: $x + x + (x + 30°) = 180°$.'),
     K('$3x = 150°$, $x = 50°$. Ugao pri vrhu je $80°$.', ['c'])],
    jk(80, { uglovi: { A: 'x', B: 'x', C: { o: 'x + 30°', id: 'c' } } }));

  proveri(180 - 110 === 70 && (180 - 70) / 2 === 55, 'osnovica 55');
  Z(2, 'Spoljašnji ugao kod vrha jednakokrakog trougla je $110°$. Koliki su uglovi na osnovici?',
    ['$55°$', '$70°$', '$35°$', '$110°$'],
    [K('Ugao pri vrhu: $180° − 110° = 70°$.', ['c']),
     K('Uglovi na osnovici: $(180° − 70°) : 2 = 55°$. Može i brže: spoljašnji ugao je zbir dva jednaka unutrašnja, $110° : 2 = 55°$.')],
    spolj(izUglova(55, 55, 5), { kod: 'C', od: 'A', o: '110°', uglovi: { C: { o: '', id: 'c' }, A: '?', B: '?' } }));

  proveri(180 - 130 === 50 && 180 - 100 === 80, 'vrh 80');
  Z(2, 'Spoljašnji ugao na osnovici jednakokrakog trougla je $130°$. Koliki je ugao pri vrhu?',
    ['$80°$', '$50°$', '$65°$', '$100°$'],
    [K('Unutrašnji ugao na osnovici: $180° − 130° = 50°$ – takav je i drugi ugao na osnovici.', ['b']),
     K('Ugao pri vrhu: $180° − 2 · 50° = 80°$', ['c'])],
    spolj(izUglova(50, 50, 5), { kod: 'B', od: 'A', o: '130°', uglovi: { B: { o: '', id: 'b' }, C: { o: '?', id: 'c' } } }));

  Z(2, 'Uglovi pravouglog trougla su $30°$, $60°$ i $90°$, a hipotenuza je $13 cm$. Kolika je kraća kateta?',
    ['$6,5 cm$', '$13 cm$', '$26 cm$', '$4,3 cm$'],
    [K('Dva takva trougla zajedno čine jednakostranični trougao (preslikavanje preko duže katete).', ['od']),
     K('Kraća kateta je polovina stranice jednakostraničnog trougla, tj. polovina hipotenuze: $13 : 2 = 6,5 cm$.', ['k'])],
    G({ A: [0, 3.464], C: [0, 0], B: [2, 0], B1: [-2, 0] }, [{ p: 'ACB', b: 0 }, { pu: 'BCA' }, { u: 'CAB', b: 1, o: '30°' }, { u: 'ABC', b: 2, o: '60°' }, { d: 'AB', o: '13 cm' },
      { p: 'ACB', b: 2, odrazi: 'AC', k: 1, id: 'od' }, { d: 'CB', b: 3, debljina: 5, k: 2, id: 'k' }], { velicina: 220, bezImena: ['B1'] }));

  proveri(180 - 2 * 58 === 64 && 64 > 58, 'osnovica duža');
  Z(3, 'U trouglu $ABC$ je $AC = BC$ i $∠ABC = 58°$. Šta je duže, osnovica $AB$ ili krak?',
    ['Osnovica $AB$', 'Krak', 'Jednaki su', 'Ne može se znati'],
    [K('Trougao je jednakokraki sa osnovicom $AB$, pa je i $∠BAC = 58°$, a $γ = 180° − 116° = 64°$.', ['c']),
     K('Osnovica $AB$ je naspram ugla od $64°$, a krak naspram ugla od $58°$.'),
     K('Naspram većeg ugla je veća stranica: osnovica je duža od kraka.', ['ab'])],
    R(jk(64, { uglovi: { A: '58°', B: '58°', C: { o: '64°', id: 'c' } }, stranice: { c: { o: '', b: 3, debljina: 5, id: 'ab' } } })));

  {
    // jednakostranični ABC, D na produžetku AB preko B, BD = BC ⇒ ∠BDC = 30°
    const S3 = Math.sqrt(3);
    proveri(180 - 60 === 120 && (180 - 120) / 2 === 30, '∠BDC = 30');
    Z(3, 'Trougao $ABC$ je jednakostranični. Na produžetku stranice $AB$ preko $B$ je tačka $D$ takva da je $BD = BC$. Koliki je ugao $∠BDC$?',
      ['$30°$', '$60°$', '$45°$', '$120°$'],
      [K('Spoljašnji ugao jednakostraničnog trougla kod $B$ je $180° − 60° = 120°$: $∠CBD = 120°$.', ['s']),
       K('Trougao $BCD$ je jednakokraki ($BD = BC$), pa su uglovi kod $C$ i $D$ jednaki.', ['bd']),
       K('$∠BDC = (180° − 120°) : 2 = 30°$', ['d'])],
      G({ A: [0, 0], B: [4, 0], C: [2, r(2 * S3)], D: [8, 0] }, [{ p: 'ABC', b: 0 }, { d: 'BD', b: 4, id: 'bd' }, { d: 'CD', b: 4 },
        { u: 'CAB', b: 1, o: '60°' }, { u: 'CBD', b: 5, k: 1, id: 's', o: '120°' }, { u: 'BDC', b: 2, o: '?', id: 'd' }], { velicina: 260 }));
  }

  proveri(18 / 3 === 6 && 2 * 6 === 12, 'hip 12');
  Z(3, 'U pravouglom trouglu sa uglom od $30°$ zbir hipotenuze i kraće katete je $18 cm$. Kolika je hipotenuza?',
    ['$12 cm$', '$9 cm$', '$6 cm$', '$13,5 cm$'],
    [K('Kraća kateta (naspram ugla od $30°$) je polovina hipotenuze: ako je kateta $x$, hipotenuza je $2x$.', ['k', 'h']),
     K('$x + 2x = 18 cm$, $x = 6 cm$; hipotenuza je $12 cm$.')],
    G({ A: [0, 3.464], C: [0, 0], B: [2, 0] }, [{ p: 'ACB', b: 0 }, { pu: 'BCA' }, { u: 'CAB', b: 1, o: '30°' }, { d: 'CB', b: 3, o: 'x', id: 'k' }, { d: 'AB', b: 2, o: '2x', id: 'h', k: 1 }], { velicina: 220 }));

  // ════════════════ 2.5 Nejednakosti trougla ════════════════
  L('Nejednakosti trougla');
  const { stapici } = crtezi(A);

  proveri(postoji([4, 6, 9]) && !postoji([3, 5, 9]) && !postoji([2, 7, 9]) && !postoji([4, 5, 9]), 'trojke');
  Z(1, 'Od kojih duži se može napraviti trougao?',
    ['$4 cm$, $6 cm$, $9 cm$', '$3 cm$, $5 cm$, $9 cm$', '$2 cm$, $7 cm$, $9 cm$', '$4 cm$, $5 cm$, $9 cm$'],
    [K('Dovoljno je proveriti da li je zbir dve kraće duži veći od najduže.'),
     K('$4 + 6 = 10 > 9$ ✓; $3 + 5 = 8 < 9$; $2 + 7 = 9$ (to je duž, ne trougao); $4 + 5 = 9$.'),
     K('Samo od $4$, $6$ i $9 cm$ štapići se spajaju u trougao.')],
    R(stapici(9, 4, 6)));

  proveri(Math.abs(6.2 - 3.9 - 2.3) < 1e-9 && Math.abs(6.2 + 3.9 - 10.1) < 1e-9, 'granice c');
  Z(1, 'Dve stranice trougla su $6,2 cm$ i $3,9 cm$. U kojim granicama je treća stranica $c$?',
    ['$2,3 cm < c < 10,1 cm$', '$3,9 cm < c < 6,2 cm$', '$0 cm < c < 10,1 cm$', '$2,3 cm < c < 6,2 cm$'],
    [K('Treća stranica je manja od zbira druge dve: $c < 6,2 + 3,9 = 10,1 cm$.'),
     K('I veća od njihove razlike: $c > 6,2 − 3,9 = 2,3 cm$.')],
    stapici(6.2, 3.9, 8, { natpisi: false }));

  proveri(!postoji([5, 5, 12]) && postoji([12, 12, 5]) && 12 + 12 + 5 === 29, 'krak 12');
  Z(2, 'Dve stranice jednakokrakog trougla su $5 cm$ i $12 cm$. Koliki je obim trougla?',
    ['$29 cm$', '$22 cm$', '$17 cm$', '$29 cm$ ili $22 cm$'],
    [K('Ako bi krak bio $5 cm$: $5 + 5 = 10 < 12$ – štapići se ne spajaju, takav trougao ne postoji.'),
     K('Zato je krak $12 cm$, a osnovica $5 cm$: $O = 12 + 12 + 5 = 29 cm$.')],
    R(stapici(5, 5, 12)));

  {
    const n = Array.from({ length: 30 }, (_, i) => i + 1).filter((c) => postoji([7, 11, c])).length;
    proveri(n === 13, '13 mogućnosti');
    Z(2, 'Dve stranice trougla su $7 cm$ i $11 cm$, a treća (u cm) je prirodan broj. Koliko ima mogućnosti za treću stranicu?',
      ['$13$', '$11$', '$17$', '$14$'],
      [K('$11 − 7 < c < 11 + 7$, tj. $4 < c < 18$.'),
       K('Prirodni brojevi od $5$ do $17$: ima ih $17 − 5 + 1 = 13$.')],
      stapici(7, 11, 12, { natpisi: false }));
  }

  {
    const tr14 = [];
    for (let a = 1; a <= 14; a++) for (let b = a; b <= 14; b++) { const c = 14 - a - b; if (c >= b && postoji([a, b, c])) tr14.push([a, b, c]); }
    proveri(tr14.length === 4, 'obim 14: 4 trougla');
    Z(2, 'Stranice trougla (u cm) su prirodni brojevi, a obim je $14 cm$. Koliko ima takvih (različitih) trouglova?',
      ['$4$', '$3$', '$5$', '$6$'],
      [K('Svaka stranica mora biti manja od polovine obima, tj. manja od $7 cm$ (inače druge dve nisu duže od nje).'),
       K('Najduža stranica $6$: $(6, 6, 2)$, $(6, 5, 3)$, $(6, 4, 4)$.'),
       K('Najduža stranica $5$: $(5, 5, 4)$. Manje od $5$ ne može (ukupno bi bilo manje od $14$). Ukupno $4$.')],
      R(stapici(5, 4, 5)));
  }

  proveri(3 * 6 - 2 === 16 && postoji([6, 6, 4]), 'krak 6');
  Z(2, 'Obim jednakokrakog trougla je $16 cm$, a osnovica je za $2 cm$ kraća od kraka. Kolika je osnovica?',
    ['$4 cm$', '$6 cm$', '$5 cm$', '$8 cm$'],
    [K('Krak je $k$, osnovica $k − 2$: $k + k + (k − 2) = 16$.'),
     K('$3k = 18$, $k = 6 cm$, osnovica $4 cm$.'),
     K('Provera nejednakosti trougla: $6 + 4 > 6$ ✓')],
    jk(70, { stranice: { a: 'k', b: 'k', c: 'k − 2' } }));

  {
    const st = [3, 4, 6, 7, 10];
    const sv = kombinacije(st, 3).filter((t) => postoji(t));
    proveri(sv.length === 5, `od 3,4,6,7,10: ${sv.length}`);
    Z(2, 'Imamo pet štapića dužina $3$, $4$, $6$, $7$ i $10 cm$. Koliko različitih trouglova možemo složiti od po tri štapića?',
      ['$5$', '$4$', '$10$', '$6$'],
      [K('Od pet štapića tri biramo na $10$ načina. Za svaku trojku proveravamo da li je zbir dva kraća veći od najdužeg.'),
       K('Ne mogu: $(3, 4, 7)$, $(3, 4, 10)$, $(3, 6, 10)$, $(3, 7, 10)$, $(4, 6, 10)$.'),
       K('Mogu: $(3, 4, 6)$, $(3, 6, 7)$, $(4, 6, 7)$, $(4, 7, 10)$, $(6, 7, 10)$ – ukupno $5$.')],
      stapici(7, 4, 10, { natpisi: true }));
  }

  {
    const n = [];
    for (let k = 1; k < 25; k++) { const o = 25 - 2 * k; if (o > 0 && postoji([k, k, o])) n.push(k); }
    proveri(n.length === 6 && n[0] === 7 && n[5] === 12, 'obim 25: krak 7..12');
    Z(3, 'Koliko ima jednakokrakih trouglova obima $25 cm$ čije su stranice (u cm) prirodni brojevi?',
      ['$6$', '$12$', '$5$', '$7$'],
      [K('Krak $k$, osnovica $25 − 2k$. Osnovica mora biti pozitivna: $k < 12,5$, pa $k ≤ 12$.'),
       K('Nejednakost trougla: $k + k > 25 − 2k$, tj. $4k > 25$, pa je $k ≥ 7$.'),
       K('$k$ može biti $7, 8, 9, 10, 11, 12$ – ukupno $6$ trouglova.')],
      R(jk(2 * Math.asin(5.5 / 7) * 180 / Math.PI, { stranice: { a: '7', b: '7', c: '11' } })));
  }

  proveri(!postoji([4, 4, 9]) && postoji([4, 9, 9]) && 4 + 9 + 9 === 22, 'obim 22');
  Z(3, 'Dve stranice jednakokrakog trougla su $4 cm$ i $9 cm$. Koliki je njegov obim?',
    ['$22 cm$', '$17 cm$', '$13 cm$', '$26 cm$'],
    [K('Treća stranica jednaka je jednoj od datih: $4$ ili $9 cm$.'),
     K('Stranice $4$, $4$, $9$: $4 + 4 = 8 < 9$ – ne postoji.'),
     K('Stranice $4$, $9$, $9$: postoji, obim je $22 cm$.')],
    R(stapici(9, 9, 4)));

  proveri(8 + 5 - 1 === 12 && 8 + 5 + 12 === 25 && !postoji([8, 5, 13]), 'max 12');
  Z(3, 'Dve stranice trougla su $8 cm$ i $5 cm$, a treća (u cm) je prirodan broj. Koliki najveći obim može imati trougao?',
    ['$25 cm$', '$26 cm$', '$24 cm$', '$13 cm$'],
    [K('Treća stranica je manja od $8 + 5 = 13 cm$, pa je najviše $12 cm$.'),
     K('Najveći obim: $8 + 5 + 12 = 25 cm$. (Sa $13 cm$ bi štapići legli u duž – to nije trougao.)')],
    stapici(8, 5, 12, { natpisi: true }));
};

module.exports.crtezi = crtezi;
