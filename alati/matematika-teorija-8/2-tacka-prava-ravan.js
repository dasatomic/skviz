// Tačka, prava, ravan — 8. razred: teorija „u glavi“ uz crteže (lekcije 2.1–2.8 iz udžbenika, 1. deo).
// Kvadar ABCDA₁B₁C₁D₁ (kvadar(4, 3, 2.5)) je „laboratorija“: ivice i strane se ističu bojom i debljinom,
// a ravni i prave koje nisu na kvadru crtaju se preko prostor/ravanZ/ravan. Ne koristi se papir ni račun,
// osim jednostavnih brojeva (3-4-5, 5-12-13, 30°, 45°, 60°).
module.exports = ({ L, Q, U, S, G, r, proveri, kvadar, prostor, ravanZ, ravan }) => {

  // ── pomoćni crteži ──
  const KV = (e = [], x = {}) => kvadar(4, 3, 2.5, e, x);            // kvadar ABCDA₁B₁C₁D₁
  const H = (d, b = 1) => ({ d, b, debljina: 4 });                   // istaknuta ivica
  const SP = (p, b = 2) => ({ p, b, gusto: 1 });                     // istaknuta strana (ili ravan kroz tačke)
  const ISP = (d, b = 0) => ({ d, b, debljina: 2, isp: 1 });         // nevidljiva / isprekidana ivica
  const PRAVA2 = (P, Q, ime, b = 0, k = 1.2) => {                    // prava kroz P i Q u ravni (2D)
    const dx = Q[0] - P[0], dy = Q[1] - P[1], d = Math.hypot(dx, dy);
    const A = [r(P[0] - (dx / d) * k), r(P[1] - (dy / d) * k)], B = [r(Q[0] + (dx / d) * k), r(Q[1] + (dy / d) * k)];
    return [{ lin: [A, B], b, debljina: 2 }, { tx: ime, at: [r(B[0] + 0.15), r(B[1] + 0.15)], b, vel: 18 }];
  };
  const PRAVA3 = (P, Q, ime, b = 0) => {                             // prava kroz dve tačke u prostoru (kao lin3)
    const dx = Q[0] - P[0], dy = Q[1] - P[1], dz = Q[2] - P[2], d = Math.hypot(dx, dy, dz), k = 1.2;
    const A = [P[0] - (dx / d) * k, P[1] - (dy / d) * k, P[2] - (dz / d) * k];
    const B = [Q[0] + (dx / d) * k, Q[1] + (dy / d) * k, Q[2] + (dz / d) * k];
    return [{ lin3: [A, B], b, debljina: 2 }, { tx: ime, at3: B, b, vel: 18 }];
  };
  const NORMALA = (A, P, b = 2) => ({ lin3: [A, P], b, debljina: 2.5, str: 0 }); // normala (vertikalna duž)
  const V = (x, y, z) => [x, y, z];

  // ════════════════ 2.1 Odnos tačke i prave; određenost prave ════════════════
  L('Odnos tačke i prave; određenost prave');

  Q(1, 'Kroz koliko različitih tačaka je jednoznačno određena prava?',
    ['Kroz dve', 'Kroz jednu', 'Kroz tri', 'Kroz četiri'],
    'Euklid je pravu opisao kao „dužinu bez širine“ koja se pruža u oba smera bez kraja. Ta prava nema ni početak ni kraj, pa je jedini „oslonac“ za nju dovoljno dve tačke.', 'prava',
    { mediji: G({ A: [0.6, 0.9], B: [3.4, 2.2] }, [...PRAVA2([0.6, 0.9], [3.4, 2.2], 'p')], { velicina: 220 }) });

  Q(1, 'Kroz tačku $A$ na crtežu povučeno je nekoliko pravih. Koliko se pravih ukupno može povući kroz $A$?',
    ['Beskonačno mnogo', 'Tačno jedna', 'Tačno dve', 'Nijedna'],
    'Skup svih pravih koje prolaze kroz istu tačku zove se pramen pravih. Tek druga tačka na pravoj izdvaja jednu od njih.', 'pramen',
    { mediji: G({ A: [0, 0] }, [
      ...PRAVA2([0, 0], [3, 0.2], 'a'), ...PRAVA2([0, 0], [2, 2], 'b'), ...PRAVA2([0, 0], [0.5, 2.6], 'c'), ...PRAVA2([0, 0], [-2, 1.4], 'd'),
      { tacka: 'A' },
    ], { velicina: 220 }) });

  Q(1, 'Kako se zovu tri tačke koje leže na jednoj pravoj?',
    ['Kolinearne', 'Komplanarne', 'Podudarne', 'Paralelne'],
    'Kad tri tačke pripadaju jednoj pravoj, kažemo da su kolinearne. Ako su ih četiri i više u istoj ravni, one su komplanarne.', 'kolinearne',
    { mediji: G({ A: [0.5, 1.4], B: [2, 1.4], C: [3.5, 1.4] }, [...PRAVA2([0.5, 1.4], [3.5, 1.4], 'p')], { velicina: 220 }),
      medijiOdgovora: G({ A: [0.5, 1.4], B: [2, 1.4], C: [3.5, 1.4] }, [...PRAVA2([0.5, 1.4], [3.5, 1.4], 'p'), { tx: '~kolinearne', at: [2, 0.4], b: 2, vel: 16 }], { velicina: 220 }) });

  Q(2, 'Dati su četiri tačke $A$, $B$, $C$, $D$ u ravni, pri čemu nikoje tri nisu na istoj pravoj. Koliko pravih one određuju?',
    ['6', '4', '8', '12'],
    'Svaka prava je određena parom tačaka: $\\frac{4 \\cdot 3}{2}=6$. To su četiri stranice i dve dijagonale četvorougla.', 'stranica',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [4.6, 3], D: [0.8, 3.4] }, [{ p: 'ABCD', b: 0 }], { velicina: 240 }),
      medijiOdgovora: G({ A: [0, 0], B: [4, 0], C: [4.6, 3], D: [0.8, 3.4] }, [
        { d: 'AB', b: 2, debljina: 3 }, { d: 'BC', b: 2, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }, { d: 'DA', b: 2, debljina: 3 },
        { d: 'AC', b: 4, debljina: 3 }, { d: 'BD', b: 4, debljina: 3 }], { velicina: 240 }) });

  Q(1, 'Dve različite prave imaju dve zajedničke tačke. Šta je tačno?',
    ['Poklapaju se', 'Seku se pod pravim uglom', 'Paralelne su', 'Mimoilazne su'],
    'Ako dve prave imaju dve različite zajedničke tačke, obe prolaze kroz te dve tačke. A kroz dve tačke prolazi tačno jedna prava, pa se prave poklapaju.', 'poklapanje',
    { mediji: G({ A: [0.6, 0.6], B: [3.4, 2.0] }, [...PRAVA2([0.6, 0.6], [3.4, 2.0], 'a'), { tacka: 'A' }, { tacka: 'B' }], { velicina: 220 }) });

  Q(2, 'Tačka $A$ pripada pravoj $p$, a tačka $B$ ne pripada pravoj $p$. Kako se to ispravno zapisuje?',
    ['$A \\in p$ i $B \\notin p$', '$A \\subset p$ i $B \\in p$', '$p \\in A$ i $B \\notin p$', '$A = p$ i $B \\in p$'],
    'Pripadanje tačke pravoj zapisuje se znakom $\\in$, a nepripadanje znakom $\\notin$. Znak $\\subset$ važi za skup u skupu, a ne za tačku.', 'pripadanje',
    { mediji: G({ A: [1.2, 1.1], B: [2.6, 2.4] }, [...PRAVA2([0.2, 0.3], [3.6, 1.4], 'p'), { tx: 'A', at: [1.2, 1.1] }], { velicina: 220 }) });

  Q(1, 'Ako su $A$ i $B$ različite tačke prave $p$, šta je tačno?',
    ['Prava $p$ je jedina prava koja prolazi kroz $A$ i $B$', 'Kroz $A$ i $B$ prolaze tri prave', 'Prava $p$ je kraća od duži $AB$', 'Duž $AB$ ne pripada pravoj $p$'],
    'Dve različite tačke određuju tačno jednu pravu. Konop zategnut između dva klina je trag takve prave, zato ga zidari koriste za proveru ravnih zidova.', 'prava',
    { mediji: G({ A: [0.8, 0.8], B: [3.2, 2.2] }, [...PRAVA2([0.8, 0.8], [3.2, 2.2], 'p'), { d: 'AB', b: 2, debljina: 3 }], { velicina: 220 }) });

  Q(1, 'Duž je deo prave ograničen dvema tačkama. Koliko krajnjih tačaka ima duž $AB$?',
    ['Dve', 'Jednu', 'Nijednu', 'Beskonačno mnogo'],
    'Prava nema krajeve, a polupravu ograničava samo jedna tačka. Duž ima dva kraja, pa se zato ne može produžiti u beskonačnost.', 'duž',
    { mediji: G({ A: [0.6, 0.8], B: [3.4, 1.8] }, [{ d: 'AB', b: 2, debljina: 3 }], { velicina: 220 }) });

  Q(3, 'Koliko najviše pravih određuju $5$ tačaka u ravni, ako nikoje tri nisu kolinearne?',
    ['10', '5', '15', '20'],
    'Svaki par tačaka daje po jednu pravu: $\\frac{5 \\cdot 4}{2}=10$. Isti broj se dobija ako prebrojimo sve stranice i dijagonale petougla.', 'petougao',
    { mediji: G({ A: [0, 0.8], B: [1.6, 2.4], C: [3.6, 2.6], D: [4.2, 0.6], E: [2, -0.4] }, [{ p: 'ABCDE', b: 0 }], { velicina: 240 }) });

  Q(3, 'Tri različite tačke $A$, $B$, $C$ leže na pravoj $p$, a tačka $D$ nije na njoj. Koliko pravih određuju ove četiri tačke?',
    ['4', '3', '6', '2'],
    'Tri tačke na pravoj određuju samo pravu $p$. Svaka od ostale tri tačke određuje sa tačkom $D$ po jednu novu pravu: $1+3=4$.', 'kolinearne',
    { mediji: G({ A: [0.6, 1.2], B: [2, 1.2], C: [3.4, 1.2], D: [2.2, 3.2] }, [...PRAVA2([0.6, 1.2], [3.4, 1.2], 'p'), { tacka: 'ABCD' }], { velicina: 240 }),
      medijiOdgovora: G({ A: [0.6, 1.2], B: [2, 1.2], C: [3.4, 1.2], D: [2.2, 3.2] }, [...PRAVA2([0.6, 1.2], [3.4, 1.2], 'p'),
        { d: 'DA', b: 2, debljina: 3 }, { d: 'DB', b: 2, debljina: 3 }, { d: 'DC', b: 2, debljina: 3 }, { tacka: 'ABCD' }], { velicina: 240 }) });

  U(2, 'Koji pojam NE opisuje položaj tačke u odnosu na pravu?',
    ['Mimoilaznost', 'Pripadanje', 'Van prave', 'Na pravoj'],
    'Mimoilaznost je odnos između dve prave u prostoru. Tačka može da pripada pravoj ili da joj ne pripada.',
    'Euklid je pre više od 2 000 godina tačku opisao kao „ono što nema delova“ – tačka nema ni dužinu ni širinu, samo položaj.', 'pripada',
    { mediji: G({ A: [1.2, 1.4], B: [2.6, 1.4], C: [1.9, 2.6] }, [...PRAVA2([0.6, 1.4], [3.2, 1.4], 'p')], { velicina: 220 }) });

  Q(3, 'Koliko najviše preseka imaju tri prave u ravni, ako nikoje dve nisu paralelne i nikoje tri nisu kroz istu tačku?',
    ['3', '2', '6', '1'],
    'Svake dve prave se seku u jednoj tački, a broj parova od tri prave je $\\frac{3 \\cdot 2}{2}=3$.', 'presek',
    { mediji: G({ A: [0, 0] }, [...PRAVA2([-0.6, 0.2], [3.2, 2.0], 'a'), ...PRAVA2([-0.2, 2.6], [3.4, 0.2], 'b'), ...PRAVA2([0.4, -0.6], [1.6, 3.2], 'c')], { velicina: 240 }) });

  S(2, 'Spoji pojam sa njegovim značenjem.',
    [['tri kolinearne tačke', 'leže na jednoj pravoj'], ['dve različite tačke', 'određuju tačno jednu pravu'], ['tačka van prave', 'ne pripada joj']],
    'Ove tri veze su osnovni rečnik za sve što sledi u ovoj temi.', 'kolinearne',
    { mediji: G({ A: [0.6, 1.3], B: [2, 1.3], C: [3.4, 1.3], D: [2.2, 2.8] }, [...PRAVA2([0.6, 1.3], [3.4, 1.3], 'p')], { velicina: 220 }) });

  Q(1, 'Koja tvrdnja o duži $AB$ i pravoj $AB$ je tačna?',
    ['Duž $AB$ ima krajeve $A$ i $B$', 'Prava $AB$ ima krajeve $A$ i $B$', 'Duž $AB$ nema krajeve', 'Prava $AB$ ima dužinu'],
    'Duž je ograničen deo prave između dve tačke. Prava se pruža beskonačno u oba smera, pa nema krajeva i nema dužinu.', 'duž',
    { mediji: G({ A: [1, 1.2], B: [3, 1.8] }, [...PRAVA2([1, 1.2], [3, 1.8], 'p'), { d: 'AB', b: 2, debljina: 4 }], { velicina: 220 }) });

  Q(3, 'Koliko pravih određuju $6$ tačaka u ravni, ako nikoje tri nisu na istoj pravoj?',
    ['15', '12', '30', '6'],
    'Broj parova od šest tačaka je $\\frac{6 \\cdot 5}{2}=15$. Dvostruko računanje (30) broji svaku pravu dva puta.', 'parovi',
    { mediji: G({ A: [0, 0], B: [1.8, 0.4], C: [3.2, 1.6], D: [3, 3.4], E: [1.4, 3.8], F: [-0.4, 2] }, [{ p: 'ABCDEF', b: 0 }], { velicina: 240 }) });

  // ════════════════ 2.2 Odnos tačke, prave i ravni; određenost ravni ════════════════
  L('Odnos tačke, prave i ravni; određenost ravni');

  Q(1, 'Koliko tačaka jednoznačno određuje ravan, ako nikoje tri nisu na istoj pravoj?',
    ['Tri', 'Dve', 'Jedna', 'Četiri'],
    'Tri tačke koje ne leže na istoj pravoj određuju tačno jednu ravan. Zato je stolica sa tri noge uvek stabilna.', 'ravan',
    { mediji: G({ A: [0.6, 0.6], B: [3.2, 0.9], C: [1.6, 2.6] }, [{ p: 'ABC', b: 2, gusto: 1 }], { velicina: 220 }) });

  Q(1, 'Zašto stolica sa tri noge uvek stoji stabilno, a sto sa četiri noge može da se klima na neravnom podu?',
    ['Tri nekolinearne tačke uvek leže u jednoj ravni', 'Tri noge su uvek jednake dužine', 'Četiri noge su teže', 'Stolica je uvek na ravnom podu'],
    'Vrhovi tri noge su tri tačke koje nisu na istoj pravoj, pa leže u jednoj ravni. Vrhovi četiri noge ne moraju biti u jednoj ravni, pa jedna noga može da „visi“.', 'tronožac',
    { mediji: prostor({ A: V(0, 0, 0), B: V(3, 0, 0), C: V(1.5, 2.6, 0), D: V(1.5, 0.9, 1.2) },
      [ravanZ(-1, 4, -1, 3.4, 0, { ime: 'π' }), { d: 'AD', b: 0 }, { d: 'BD', b: 0 }, { d: 'CD', b: 0 }, { d: 'AB', b: 0 }, { d: 'BC', b: 0 }, { d: 'CA', b: 0 }], { velicina: 260 }) });

  Q(1, 'Koliko ravni prolazi kroz dve različite tačke?',
    ['Beskonačno mnogo', 'Tačno jedna', 'Tačno dve', 'Nijedna'],
    'Kroz dve tačke prolazi jedna prava, a kroz nju beskonačno mnogo ravni, kao listovi knjige oko kičme.', 'listovi',
    { mediji: prostor({ A: V(0, 0, 0), B: V(2.5, 1.4, 1.8) }, [{ d: 'AB', b: 2, debljina: 3 }], { velicina: 240 }) });

  Q(1, 'Koliko ravni prolazi kroz pravu $p$ i tačku $M$ koja pripada pravoj $p$?',
    ['Beskonačno mnogo', 'Tačno jedna', 'Nijedna', 'Dve'],
    'Tačka na pravoj ne određuje dodatni uslov, pa kroz pravu prolazi beskonačno mnogo ravni. Jednoznačnost nastaje tek kad uzmemo tačku van prave.', 'ravan',
    { mediji: prostor({ P1: V(0, 0, 0), P2: V(4, 0, 0), M: V(2, 0, 0) }, [{ d: 'P1P2', b: 2, debljina: 3 }], { velicina: 240, T3: {} }),
      medijiOdgovora: prostor({ P1: V(0, 0, 0), P2: V(4, 0, 0), M: V(2, 0, 0) }, [{ d: 'P1P2', b: 2, debljina: 3 }, ravan([[0, 0, 0], [4, 0, 0], [4.5, 2.4, 1.6], [0.5, 2.4, 1.6]], { ime: 'α', b: 4 })], { velicina: 240 }) });

  Q(1, 'Koliko ravni određuju prava $p$ i tačka $A$ van nje?',
    ['Tačno jedna', 'Beskonačno mnogo', 'Dve', 'Nijedna'],
    'Dve tačke prave i tačka A van nje čine tri nekolinearne tačke. Te tri tačke određuju tačno jednu ravan koja sadrži pravu $p$.', 'ravan',
    { mediji: prostor({ P1: V(0, 0, 0), P2: V(4, 0, 0), A: V(1.5, 1.9, 1.5) }, [...PRAVA3([0, 0, 0], [4, 0, 0], 'p', 2), { tacka: 'A' }], { velicina: 240 }),
      medijiOdgovora: prostor({ P1: V(0, 0, 0), P2: V(4, 0, 0), A: V(1.5, 1.9, 1.5) }, [...PRAVA3([0, 0, 0], [4, 0, 0], 'p', 2), ravan([[0, 0, 0], [4, 0, 0], [5.5, 1.9, 1.5], [1.5, 1.9, 1.5]], { ime: 'α', b: 4 }), { d: 'P1A', b: 1, debljina: 3 }, { d: 'P2A', b: 1, debljina: 3 }, { tacka: 'A' }], { velicina: 240, bezImena: ['P1', 'P2'] }) });

  Q(2, 'Četiri tačke $A$, $B$, $C$, $D$ nisu u istoj ravni. Koliko najviše različitih ravni one određuju?',
    ['4', '6', '3', '1'],
    'Svake tri od četiri tačke (koje nisu kolinearne) određuju po jednu ravan. Broj trojki od četiri tačke je $\\frac{4 \\cdot 3 \\cdot 2}{3 \\cdot 2}=4$.', 'trojke',
    { mediji: prostor({ A: V(0, 0, 0), B: V(3.5, 0.4, 0), C: V(1.4, 2.8, 0), D: V(1.8, 0.9, 2.6) }, [
      { d: 'AB', b: 0 }, { d: 'AC', b: 0 }, { d: 'BC', b: 0 }, { d: 'AD', b: 0 }, { d: 'BD', b: 0 }, { d: 'CD', b: 0 }], { velicina: 240 }) });

  Q(2, 'Koliko ravni određuju tačke $A$, $B$ i $C_1$ kvadra $ABCDA_1B_1C_1D_1$?',
    ['Tačno jednu', 'Beskonačno mnogo', 'Nijednu', 'Tri'],
    'Tačke $A$, $B$ i $C_1$ nisu na istoj pravoj, pa jednoznačno određuju jednu ravan.', 'ravan',
    { mediji: KV([], { T3: {} }), medijiOdgovora: KV([{ p: 'ABC₁', b: 2, gusto: 1 }, { d: 'AC₁', b: 1, debljina: 3 }]) });

  Q(2, 'Koja tačka kvadra $ABCDA_1B_1C_1D_1$ NE pripada ravni $ABC$?',
    ['$D_1$', '$D$', '$C$', '$B$'],
    'Ravan ABC je donja strana kvadra, pa joj pripadaju A, B, C i D. Teme D₁ je na gornjoj strani.', 'strana',
    { mediji: KV([{ p: 'ABCD', b: 2, gusto: 1 }]), medijiOdgovora: KV([{ p: 'ABCD', b: 2, gusto: 1 }, { tacka: 'D₁' }]) });

  Q(3, 'Koja ravan je određena tačkama $A$, $C$ i $C_1$ kvadra $ABCDA_1B_1C_1D_1$?',
    ['Ravan $ACC_1A_1$', 'Ravan $ABC$', 'Ravan $BCC_1$', 'Ravan $BDD_1$'],
    'Tačke A, C i C₁ određuju ravan dijagonalnog preseka ACC₁A₁. Ona sadrži i teme A₁, jer je pravougaonik.', 'dijagonala',
    { mediji: KV([{ d: 'AC', b: 1, debljina: 3 }, { d: 'CC₁', b: 1, debljina: 3 }, { d: 'AC₁', b: 1, debljina: 3 }]),
      medijiOdgovora: KV([{ p: 'ACC₁A₁', b: 2, gusto: 1 }]) });

  Q(1, 'Kroz jednu tačku, koliko ravni možemo da provučemo?',
    ['Beskonačno mnogo', 'Tačno jednu', 'Tačno dve', 'Nijednu'],
    'Ravan može da prolazi kroz tačku na bezbroj načina, kao što lepeza sadrži bezbroj pravaca kroz jednu tačku.', 'ravan',
    { mediji: prostor({ A: V(0, 0, 0) }, [{ tacka: 'A' }], { velicina: 200 }) });

  U(2, 'Koja tvrdnja o ravni NIJE tačna?',
    ['Dve tačke jednoznačno određuju ravan', 'Tri nekolinearne tačke određuju ravan', 'Prava i tačka van nje određuju ravan', 'Dve paralelne prave određuju ravan'],
    'Dve tačke određuju samo pravu, a kroz nju prolazi beskonačno mnogo ravni. Ostale tri tvrdnje su tačne.',
    'Zato se vrata ne klimaju iako stoje samo na dve šarke: šarke određuju pravu, a ravan vrata „traži“ još jednu tačku – bravu ili štok.', 'ravan',
    { mediji: prostor({ A: V(0, 0, 0), B: V(2.6, 0.8, 1.1) }, [{ d: 'AB', b: 2, debljina: 3 }], { velicina: 220 }) });

  Q(3, 'Dve paralelne prave $a$ i $b$ leže u ravni. Koliko različitih ravni ukupno može da sadrži obe?',
    ['Tačno jednu', 'Nijednu', 'Beskonačno mnogo', 'Dve'],
    'Dve različite paralelne prave određuju tačno jednu ravan, jer kroz njih ne prolazi nijedna tačka koja bi bila van ravni koju one određuju.', 'paralelne',
    { mediji: prostor({ A: V(0, 0, 0), B: V(4, 0, 0), C: V(0, 2, 0), D: V(4, 2, 0) }, [...PRAVA3([0, 0, 0], [4, 0, 0], 'a', 0), ...PRAVA3([0, 2, 0], [4, 2, 0], 'b', 0)], { velicina: 240 }) });

  S(2, 'Spoji skup tačaka sa brojem ravni koje one određuju.',
    [['tri nekolinearne tačke', 'tačno jedna ravan'], ['tri tačke na istoj pravoj', 'beskonačno mnogo ravni'], ['dve različite tačke', 'beskonačno mnogo ravni kroz pravu']],
    'Tri nekolinearne tačke ne ostavljaju slobodu, dok tri tačke na pravoj i dve tačke ostavljaju bezbroj ravni.', 'ravan',
    { mediji: KV([{ p: 'ABC', b: 2, gusto: 1 }]) });

  Q(1, 'Koja figura u prostoru leži cela u jednoj ravni?',
    ['Krug', 'Kocka', 'Kvadar', 'Lopta'],
    'Krug je ravna figura, pa cela leži u jednoj ravni. Kocka, kvadar i lopta su tela i ne mogu da stanu u jednu ravan.', 'krug',
    { medijiOdgovora: G({ O: [0, 0] }, [{ kr: 'O', r: 2.2, b: 2 }], { velicina: 220 }) });

  Q(1, 'Koji predmet najbolje modeluje ravan?',
    ['Tabla', 'Ivica stola', 'Vrh olovke', 'Konac'],
    'Ravan nema debljinu i beskonačno se pruža, a površina table je njen najbliži model u učionici.', 'ravan',
    { mediji: G({ A: [0, 0], B: [3, 0.6], C: [3.6, 2.6], D: [0.6, 2.0] }, [{ p: 'ABCD', b: 0 }], { velicina: 220 }) });

  // ════════════════ 2.3 Međusobni odnosi pravih ════════════════
  L('Međusobni odnosi pravih');

  Q(1, 'Kako se zovu dve prave iste ravni koje nemaju nijednu zajedničku tačku?',
    ['paralelne', 'mimoilazne', 'normalne', 'podudarne'],
    'Dve prave u istoj ravni ili se seku ili su paralelne. Mimoilazne prave postoje samo u prostoru, jer ne leže u istoj ravni.', 'paralelne',
    { mediji: G({ A: [0, 0] }, [...PRAVA2([0, 0], [3.6, 0.4], 'a'), ...PRAVA2([0, 1.6], [3.6, 2.0], 'b')], { velicina: 240 }) });

  Q(1, 'Koliko zajedničkih tačaka imaju dve paralelne prave u ravni?',
    ['Nijednu', 'Jednu', 'Dve', 'Beskonačno mnogo'],
    'Paralelne prave se ne seku, pa nemaju nijednu zajedničku tačku. Prave koje se poklapaju imaju beskonačno mnogo zajedničkih tačaka.', 'paralelne',
    { mediji: G({ A: [0, 0] }, [...PRAVA2([0, 0], [3.6, 0.4], 'a'), ...PRAVA2([0, 1.6], [3.6, 2.0], 'b')], { velicina: 240 }) });

  Q(1, 'Prava $a$ je paralelna sa $b$, a $b$ sa $c$. U kakvom su odnosu $a$ i $c$?',
    ['Paralelne su', 'Seku se', 'Mimoilazne su', 'Normalne su'],
    'Paralelnost je tranzitivna: ako su $a \\parallel b$ i $b \\parallel c$, onda je $a \\parallel c$. Zato se $a$ i $c$ ne seku.', 'tranzitivno',
    { mediji: G({ A: [0, 0] }, [...PRAVA2([0, 0], [3.6, 0.2], 'a'), ...PRAVA2([0, 1.2], [3.6, 1.4], 'b'), ...PRAVA2([0, 2.4], [3.6, 2.6], 'c')], { velicina: 240 }) });

  Q(3, 'Kroz tačku $A$ van prave $p$, u istoj ravni sa njom, koliko pravih možemo povući paralelno sa $p$?',
    ['Tačno jednu', 'Beskonačno mnogo', 'Nijednu', 'Tačno dve'],
    'Ovo je Euklidov postulat o paralelama: kroz tačku van prave prolazi tačno jedna prava paralelna datoj. Sve ostale prave kroz $A$ seku $p$.', 'paralelne',
    { mediji: G({ A: [1.6, 2.2] }, [...PRAVA2([0, 0], [3.6, 0.2], 'p'), { tacka: 'A' }], { velicina: 240 }),
      medijiOdgovora: G({ A: [1.6, 2.2] }, [...PRAVA2([0, 0], [3.6, 0.2], 'p'), ...PRAVA2([0.4, 2.2], [3.0, 2.2], 'q', 2), { tacka: 'A' }], { velicina: 240 }) });

  Q(3, 'Kroz tačku $A$ van prave $p$ u prostoru, koliko pravih možemo povući paralelno sa $p$?',
    ['Tačno jednu', 'Beskonačno mnogo', 'Nijednu', 'Tačno dve'],
    'I u prostoru važi isto: kroz tačku van prave prolazi tačno jedna prava paralelna sa njom. Sve prave kroz $A$ paralelne sa $p$ leže u jednoj ravni, ali je samo jedna od njih paralelna sa $p$.', 'prostor',
    { mediji: prostor({ A: V(1, 1.2, 2.2), P1: V(0, 0, 0), P2: V(4, 0, 0) }, [...PRAVA3([0, 0, 0], [4, 0, 0], 'p', 2), { tacka: 'A' }], { velicina: 240 }) });

  Q(1, 'Dve prave se seku pod pravim uglom. Kako se zovu?',
    ['Normalne', 'Paralelne', 'Podudarne', 'Mimoilazne'],
    'Normalne prave su prave koje se seku pod uglom od 90°. Ovo je naziv za njihov položaj, a ne za dužinu.', 'normalne',
    { mediji: G({ A: [0.4, 0], m: [2, 0], n: [0.4, 2] }, [...PRAVA2([-2, 0], [2.4, 0], 'a'), ...PRAVA2([0.4, -1.6], [0.4, 2.4], 'b'), { pu: 'mAn' }], { velicina: 220, bezImena: ['A'] }) });

  Q(1, 'Koja je od ivica kvadra sa $AB$ u istoj ravni i paralelna?',
    ['$DC$', '$CC_1$', '$AA_1$', '$BC$'],
    'Ivice AB i DC leže na istoj donjoj strani i ne seku se, pa su paralelne. Ivice AA₁ i BC se seku u temenima $A$ odnosno $B$.', 'paralelne',
    { mediji: KV([H('AB'), ISP('DC')]), medijiOdgovora: KV([H('AB'), H('DC', 2)]) });

  Q(2, 'Kakav je položaj ivica $AB$ i $AA_1$ kvadra?',
    ['Seku se u temenu $A$', 'Paralelne su', 'Mimoilazne su', 'Normalne su u prostoru bez preseka'],
    'Ivice AB i AA₁ imaju zajedničko teme A, pa se seku. Pravi ugao između njih ne znači da su mimoilazne.', 'teme',
    { mediji: KV([H('AB'), H('AA₁', 2)]) });

  Q(3, 'Kakav je položaj ivica $AB$ i $A_1D_1$ kvadra?',
    ['Mimoilazne su', 'Paralelne su', 'Seku se', 'Normalne su u ravni'],
    'Ivica AB leži u donjoj ravni, a A₁D₁ u gornjoj. Nisu paralelne (različiti smerovi) i nemaju zajedničku tačku, pa su mimoilazne.', 'mimoilazne',
    { mediji: KV([H('AB'), H('A₁D₁', 2)]) });

  Q(3, 'Kakav je položaj dijagonala $AC$ i $BD$ osnove kvadra?',
    ['Seku se u jednoj tački', 'Paralelne su', 'Mimoilazne su', 'Poklapaju se'],
    'Dijagonale pravougaonika se seku u središtu. One leže u istoj ravni osnove, pa ne mogu biti mimoilazne.', 'dijagonala',
    { mediji: KV([H('AC'), H('BD', 2)]), medijiOdgovora: KV([H('AC'), H('BD', 2), { tacka: 'O' }], { T3: { O: [2, 1.5, 0] } }) });

  Q(3, 'Koliko parova paralelnih ivica ima kvadar?',
    ['18', '12', '6', '9'],
    'Kvadar ima po četiri ivice u svakom od tri pravca. Parova u jednom pravcu ima $\\frac{4 \\cdot 3}{2}=6$, pa ukupno $3 \\cdot 6=18$.', 'pravci',
    { mediji: KV([]) });

  U(2, 'Koja ivica kvadra NIJE mimoilazna sa ivicom $AB$?',
    ['$DC$', '$CC_1$', '$DD_1$', '$B_1C_1$'],
    '$DC$ je paralelna sa $AB$, pa su one u istoj ravni. $CC_1$, $DD_1$ i $B_1C_1$ su mimoilazne sa AB.',
    'Kvadar ima 12 ivica, a svaka od njih je mimoilazna sa tačno 4 druge. Zato kvadar ima 24 para mimoilaznih ivica.', 'mimoilazne',
    { mediji: KV([H('AB')]), medijiOdgovora: KV([H('AB'), H('DC', 2)]) });

  S(2, 'Spoji par ivica kvadra sa njihovim odnosom.',
    [['$AB$ i $DC$', 'paralelne'], ['$AB$ i $BC$', 'seku se'], ['$AB$ i $CC_1$', 'mimoilazne']],
    'U istom kvadru postoje sva tri odnosa: paralelnost, presek i mimoilaznost.', 'paralelne',
    { mediji: KV([H('AB')]) });

  Q(1, 'Koje prave NE leže u istoj ravni?',
    ['Mimoilazne', 'Paralelne', 'Koje se seku', 'Podudarne'],
    'Mimoilazne prave su jedini par pravih koji ne može biti u istoj ravni. Paralelne, prave koje se seku i podudarne uvek mogu.', 'mimoilazne',
    { mediji: KV([H('AB'), H('CC₁', 2)]) });

  Q(1, 'Dve prave koje se seku nalaze se…',
    ['uvek u jednoj ravni', 'nikad u istoj ravni', 'u istoj ravni samo kad su normalne', 'u dve paralelne ravni'],
    'Dve prave koje se seku određuju jednu ravan, jer tri tačke (dve na jednoj i jedna na drugoj pravoj) nisu kolinearne.', 'presek',
    { mediji: G({ A: [0, 0] }, [...PRAVA2([-2, -1], [2.2, 1.4], 'a'), ...PRAVA2([-1.6, 1.8], [1.8, -1.2], 'b')], { velicina: 220 }) });

  // ════════════════ 2.4 Mimoilazne prave; presek pravih ════════════════
  L('Mimoilazne prave; presek pravih');

  Q(1, 'Kako se zovu prave u prostoru koje nisu paralelne, a ipak se ne seku?',
    ['mimoilazne', 'normalne', 'podudarne', 'kose'],
    'Mimoilazne prave ne leže u istoj ravni. Da leže, morale bi se seći ili biti paralelne.', 'mimoilazne',
    { mediji: KV([H('AB'), H('A₁D₁', 2)]) });

  Q(1, 'Prave na crtežu su mimoilazne. Koliko zajedničkih tačaka imaju?',
    ['Nijednu', 'Jednu', 'Dve', 'Beskonačno mnogo'],
    'Mimoilazne prave se ne seku, pa nemaju zajedničku tačku. Razlika od paralelnih je u tome što paralelne leže u istoj ravni.', 'mimoilazne',
    { mediji: KV([H('AB'), H('CC₁', 2)]) });

  Q(2, 'Koja je od ivica kvadra mimoilazna sa ivicom $AB$?',
    ['$CC_1$', '$DC$', '$AA_1$', '$BC$'],
    'DC je paralelna sa AB, a AA₁ i BC se seku sa AB u temenima. Samo CC₁ nema ni zajedničku tačku ni zajednički pravac sa AB.', 'mimoilazne',
    { mediji: KV([H('AB')]), medijiOdgovora: KV([H('AB'), H('CC₁', 2)]) });

  Q(2, 'Koliko ivica kvadra je mimoilazno sa datom ivicom $AB$?',
    ['4', '2', '3', '6'],
    'Ivica AB ima tri paralelne ivice, četiri ivice koje je seku u temenima, a preostale četiri su mimoilazne: CC₁, DD₁, A₁D₁ i B₁C₁.', 'mimoilazne',
    { mediji: KV([H('AB')]) });

  Q(1, 'Kakav je položaj ivica $AA_1$ i $CC_1$ kvadra?',
    ['Paralelne su', 'Seku se', 'Mimoilazne su', 'Normalne su u prostoru'],
    'Obe ivice su vertikalne, pa su paralelne. Njihove donje tačke A i C su u istoj ravni osnove, a ne u istoj tački.', 'vertikalne',
    { mediji: KV([H('AA₁'), H('CC₁', 2)]) });

  Q(2, 'Dve prave su mimoilazne. Da li postoji ravan koja sadrži obe?',
    ['Ne, nijedna ravan ne sadrži obe', 'Da, tačno jedna', 'Da, beskonačno mnogo', 'Da, tačno dve'],
    'Mimoilazne prave po definiciji ne leže u istoj ravni, pa nijedna ravan ne može da ih sadrži obe.', 'ravan',
    { mediji: KV([H('AB'), H('CC₁', 2)]) });

  Q(3, 'Koliko mimoilaznih parova ivica ima kvadar?',
    ['24', '18', '12', '36'],
    'Od svih ${12 \\cdot 11|2} = 66$ parova ivica, 18 su paralelni, a 24 se seku u nekom temenu (3 para u svakom od 8 temena). Ostaje $66-18-24=24$ mimoilaznih parova.', 'parovi',
    { mediji: KV([]) });

  Q(3, 'Koja tačka je presek dijagonala $AC$ i $BD$ osnove kvadra?',
    ['Središte osnove', 'Teme $B$', 'Presek nije tačka', 'Teme $D$'],
    'Dijagonale pravougaonika se seku u središtu, koje je jednako udaljeno od sva četiri temena.', 'presek',
    { mediji: KV([H('AC'), H('BD', 2)]), medijiOdgovora: KV([H('AC'), H('BD', 2), { tacka: 'O' }], { T3: { O: [2, 1.5, 0] } }) });

  Q(1, 'Koja tvrdnja o dve prave koje se seku je tačna?',
    ['Leže u jednoj ravni', 'Mimoilazne su', 'Nemaju zajedničku tačku', 'Uvek su normalne'],
    'Dve prave koje se seku određuju jednu ravan, jer tri tačke (dve na jednoj i jedna na drugoj pravoj) nisu kolinearne.', 'presek',
    { mediji: KV([H('AB'), H('AC', 2)]) });

  Q(2, 'Ivice AA₁ i CC₁ kvadra su paralelne. Kakav je položaj ivice $BB_1$ i ivice $DD_1$?',
    ['Paralelne su', 'Mimoilazne su', 'Seku se', 'Normalne su'],
    'Sve četiri vertikalne ivice su međusobno paralelne. Zato su i BB₁ i DD₁ paralelne.', 'vertikalne',
    { mediji: KV([H('BB₁'), H('DD₁', 2)]) });

  Q(2, 'Koja je od ivica kvadra normalna na ivicu $AB$ i mimoilazna sa njom?',
    ['$CC_1$', '$BC$', '$DC$', '$AD$'],
    'CC₁ je vertikalna, pa je normalna na AB, a nema zajedničku tačku sa AB. BC i AD se seku, a DC je paralelna.', 'normalne',
    { mediji: KV([H('AB'), H('CC₁', 2)]) });

  Q(3, 'Ako prave $a$ i $b$ imaju tačno jednu zajedničku tačku, a prava $c$ je mimoilazna sa $a$, šta važi za $c$ i $b$?',
    ['Mogu biti paralelne, seći se ili biti mimoilazne', 'Uvek su paralelne', 'Uvek se seku', 'Uvek su normalne'],
    'Prava $c$ može da bude paralelna sa $b$, da seče $b$ (tada leži u ravni sa njom i ne seče $a$) ili da bude mimoilazna sa $b$. Odnos nije unapred određen.', 'prave',
    { mediji: KV([H('AB'), H('AC', 2), H('CC₁', 2)]) });

  Q(1, 'Koja ivica kvadra seče ivicu $AB$ u temenu $B$?',
    ['$BB_1$', '$CC_1$', '$DD_1$', '$A_1D_1$'],
    'BB₁ ima zajedničko teme B sa AB, pa se seku. CC₁, DD₁ i A₁D₁ su mimoilazne sa AB ili paralelne.', 'teme',
    { mediji: KV([H('AB')]), medijiOdgovora: KV([H('AB'), H('BB₁', 2)]) });

  Q(1, 'Šta je presek dve prave koje se seku?',
    ['Tačka', 'Duž', 'Prava', 'Ravan'],
    'Dve različite prave imaju najviše jednu zajedničku tačku. Kad se seku, presek je tačno ta tačka.', 'presek',
    { mediji: G({ C: [1.8, 1.2] }, [...PRAVA2([0, 0.6], [3.6, 1.8], 'a'), ...PRAVA2([0.2, 2.6], [3.4, -0.2], 'b')], { velicina: 220 }) });

  Q(2, 'Koliko ivica kvadra je mimoilazno sa ivicom $AA_1$?',
    ['4', '3', '2', '6'],
    'Ivice AB, AD, A₁B₁ i A₁D₁ se seku sa AA₁; BB₁, CC₁ i DD₁ su paralelne; preostale četiri (BC, CD, B₁C₁, C₁D₁) su mimoilazne.', 'mimoilazne',
    { mediji: KV([H('AA₁')]) });

  // ════════════════ 2.5 Odnosi prave i ravni; normala na ravan ════════════════
  L('Odnos prave i ravni; normala na ravan');

  Q(1, 'Prava i ravan nemaju zajedničkih tačaka. Kakav je njihov položaj?',
    ['Prava je paralelna sa ravni', 'Prava prodire ravan', 'Prava pripada ravni', 'Prava je normalna na ravan'],
    'Ako prava i ravan nemaju zajedničku tačku, prava je paralelna sa ravni, u oznaci $p \\parallel \\alpha$.', 'paralelna',
    { mediji: prostor({ A: V(0, 0, 0), B: V(4, 0, 0), C: V(0, 3, 0), D: V(4, 3, 0), P1: V(0, 0, 2), P2: V(4, 1, 2) },
      [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'α' }), ...PRAVA3([0, 0, 2], [4, 1, 2], 'p', 2)], { velicina: 260 }) });

  Q(2, 'Prava ima sa ravnom tačno jednu zajedničku tačku. Kako se ta tačka zove?',
    ['Tačka prodora', 'Središte', 'Teme', 'Tačka preseka dijagonala'],
    'Prava koja ima jednu zajedničku tačku sa ravni prodire ravan, a ta tačka se zove tačka prodora.', 'prodor',
    { mediji: prostor({ P1: V(0, 0, -2), P2: V(3, 1.5, 3), M: V(1.5, 0.75, 0.5) }, [ravanZ(-0.5, 4, -0.5, 3, 0, { ime: 'α' }), ...PRAVA3([0, -0.3, -2], [3, 1.5, 3], 'p', 2), { tacka: 'M' }], { velicina: 260 }) });

  Q(2, 'Prava ima sa ravni dve različite zajedničke tačke. Šta važi?',
    ['Prava pripada ravni', 'Prava prodire ravan', 'Prava je paralelna sa ravni', 'Prava je normalna na ravan'],
    'Ako dve tačke prave pripadaju ravni, cela prava pripada ravni, jer je ravan određena i njima.', 'pripada',
    { mediji: prostor({ A: V(0.5, 0.5, 0), B: V(3, 2.4, 0) }, [ravanZ(-0.5, 4, -0.5, 3.5, 0, { ime: 'α' }), ...PRAVA3([0.5, 0.5, 0], [3, 2.4, 0], 'p', 2)], { velicina: 260 }) });

  Q(2, 'Ivica $AA_1$ kvadra i ravan $ABC$ (donja strana). Kakav je odnos prave i ravni?',
    ['Normalna je na ravan', 'Paralelna je sa ravni', 'Pripada ravni', 'Prodire ravan pod uglom 45°'],
    'Ivica AA₁ je normalna na donju stranu, jer je normalna na dve različite prave u ravni koje prolaze kroz A, na primer AB i AD.', 'normala',
    { mediji: KV([H('AA₁'), SP('ABC', 3)]), medijiOdgovora: KV([H('AA₁'), SP('ABC', 3), { pu: 'BAA₁' }, { pu: 'DAA₁' }]) });

  Q(3, 'Kada je prava normalna na ravan?',
    ['Kad je normalna na dve različite prave te ravni koje prolaze kroz tačku prodora',
      'Kad je normalna na jednu pravu te ravni',
      'Kad je paralelna sa jednom pravom te ravni',
      'Kad ne seče nijednu pravu te ravni'],
    'Dovoljan uslov je da prava bude normalna na dve različite prave ravni koje prolaze kroz tačku prodora. Jedna prava nije dovoljna, jer se mnoge prave mogu postaviti pod pravi ugao.', 'normala',
    { mediji: prostor({ A: V(0, 0, 0), B: V(4, 0.8, 0), C: V(0, 3, 0), N: V(0, 0, 0) }, [ravanZ(-1, 4.5, -1, 4, 0, { ime: 'α' }), NORMALA(V(0, 0, 2.4), V(0, 0, 0))], { velicina: 260 }) });

  Q(2, 'Koliko pravih kroz tačku $A$ van ravni $\\alpha$ je normalno na $\\alpha$?',
    ['Tačno jedna', 'Beskonačno mnogo', 'Nijedna', 'Dve'],
    'Kroz tačku van ravni postoji jedinstvena normala na ravan. Ona prodire ravan u tački koja je njena normalna projekcija.', 'normala',
    { mediji: prostor({ A: V(1.2, 0.8, 2.4) }, [ravanZ(-1, 4, -1, 3, 0, { ime: 'α' }), { tacka: 'A' }], { velicina: 260 }) });

  Q(3, 'Koliko pravih kroz tačku $A$ na ravni $\\alpha$ je normalno na $\\alpha$?',
    ['Tačno jedna', 'Beskonačno mnogo', 'Nijedna', 'Tri'],
    'Normala u tački ravni je jedinstvena: samo jedna prava kroz A je normalna na sve prave ravni α.', 'normala',
    { mediji: prostor({ A: V(1.5, 1.2, 0) }, [ravanZ(-1, 4, -1, 3, 0, { ime: 'α' }), { tacka: 'A' }], { velicina: 260 }) });

  Q(2, 'Tačka $A$ je van ravni $\\alpha$. Koliko pravih kroz $A$ je paralelno sa ravni $\\alpha$?',
    ['Beskonačno mnogo', 'Tačno jedna', 'Nijedna', 'Dve'],
    'Sve prave kroz A koje su paralelne sa α leže u ravni kroz A paralelnoj sa α. Tu ravan ispunjava beskonačno mnogo pravih.', 'paralelna',
    { mediji: prostor({ A: V(1.5, 1.2, 2) }, [ravanZ(-1, 4, -1, 3, 0, { ime: 'α' }), { tacka: 'A' }], { velicina: 260 }) });

  Q(2, 'Vrata su uspravna na podu, a šarke su vertikalne. Koji je odnos ravni vrata i ravni poda?',
    ['Normalne su (seku se pod pravim uglom)', 'Paralelne su', 'Poklapaju se', 'Mimoilazne su'],
    'Uspravna vrata su normalna na pod: ravan vrata seče pod pravim uglom, a vertikalna šarka je normalna na ravan poda.', 'vrata',
    { mediji: prostor({ A: V(0, 0, 0), B: V(4, 0, 0), C: V(0, 3, 0), D: V(4, 3, 0) }, [ravanZ(-1, 5, -1, 4, 0, { ime: 'pod' }), ravan([[0, 0, 0], [4, 0, 0], [4, 0, 2.6], [0, 0, 2.6]], { ime: 'vrata', b: 4 })], { velicina: 260 }) });

  Q(1, 'Ivica $AA_1$ kvadra i ravan $BCC_1B_1$. Šta je tačno?',
    ['Paralelne su', 'Seku se u tački', 'Prava pripada ravni', 'Normalne su'],
    'Ivica AA₁ je paralelna sa ravni BCC₁B₁ (ravan sadrži ivicu $BB₁$, koja je paralelna sa $AA₁$), pa nemaju zajedničkih tačaka.', 'paralelna',
    { mediji: KV([H('AA₁'), SP('BCC₁B₁', 3)]) });

  Q(3, 'Prava $AD_1$ kvadra i ravan $ABCD$. Kakav je njihov položaj?',
    ['Prodire ravan u tački A', 'Paralelne su', 'Pripada ravni', 'Normalne su'],
    'Prava AD₁ ima zajedničku tačku A sa donjom ravni (D₁ je iznad). Tačka prodora je A, a prava nije normalna jer nije upravna na ivice donje strane.', 'prodor',
    { mediji: KV([H('AD₁'), SP('ABCD', 3)]), medijiOdgovora: KV([H('AD₁'), SP('ABCD', 3), { tacka: 'A' }]) });

  Q(1, 'Koliko zajedničkih tačaka imaju prava i ravan koja joj je paralelna?',
    ['Nijednu', 'Jednu', 'Dve', 'Beskonačno mnogo'],
    'Paralelna prava i ravan nemaju zajedničku tačku. Kad bi imale bar jednu, prava bi bila u ravni ili bi je prodirala.', 'paralelna',
    { mediji: prostor({ A: V(0, 0, 0), B: V(4, 0, 0), P1: V(0, 0, 2), P2: V(4, 1, 2) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'α' }), ...PRAVA3([0, 0, 2], [4, 1, 2], 'p', 2)], { velicina: 260 }) });

  U(2, 'Koji uslov NE garantuje da je prava normalna na ravan?',
    ['Normalna je na jednu pravu te ravni', 'Normalna je na dve različite prave te ravni koje prolaze kroz tačku prodora', 'Normalna je na sve prave te ravni koje prolaze kroz tačku prodora', 'Normalna je na dve prave te ravni koje se seku u tački prodora'],
    'Normalnost na jednu pravu ne garantuje normalnost na ravan, jer prava može biti normalna na jednu, a koso prema ostalim pravama ravni.',
    'Stolari proveravaju da li je stub uspravan pomoću dva uglomera postavljena u dva različita pravca – baš zato što jedan pravac nije dovoljan.', 'normala',
    { mediji: prostor({ A: V(0, 0, 0) }, [ravanZ(-1, 4, -1, 3, 0, { ime: 'α' }), NORMALA(V(0, 0, 2), V(0, 0, 0))], { velicina: 240 }) });

  S(2, 'Spoji odnos prave i ravni sa njegovim značenjem.',
    [['nemaju zajedničku tačku', 'paralelne su'], ['imaju tačno jednu zajedničku tačku', 'prava prodire ravan'], ['prava seče ravan pod pravim uglom', 'normalna je na ravan']],
    'Tri osnovna odnosa prave i ravni: paralelnost, prodiranje i normalnost.', 'normala',
    { mediji: KV([H('AA₁')]) });

  Q(1, 'Koliko zajedničkih tačaka ima prava koja pripada ravni?',
    ['Beskonačno mnogo', 'Jednu', 'Dve', 'Nijednu'],
    'Kad prava pripada ravni, sve njene tačke su zajedničke sa ravni, a to je beskonačno mnogo tačaka.', 'pripada',
    { mediji: prostor({ P1: V(0, 0, 0), P2: V(4, 1, 0) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'α' }), ...PRAVA3([0, 0, 0], [4, 1, 0], 'p', 2)], { velicina: 260 }) });

  // ════════════════ 2.6 Odnosi dve ravni ════════════════
  L('Odnosi dve ravni');

  Q(1, 'Dve ravni koje nemaju zajedničkih tačaka zovu se…',
    ['paralelne', 'normalne', 'podudarne', 'seku se'],
    'Dve ravni bez zajedničkih tačaka su paralelne, kao pod i plafon u učionici (ako plafon nije kos).', 'ravni',
    { mediji: prostor({ A: V(0, 0, 0), B: V(4, 0, 0), C: V(0, 3, 0), D: V(4, 3, 0) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'α' }), ravanZ(-0.5, 4.5, -0.5, 3.5, 2.5, { ime: 'β' })], { velicina: 260 }) });

  Q(1, 'Koliko zajedničkih tačaka imaju dve paralelne ravni?',
    ['Nijednu', 'Jednu', 'Dve', 'Beskonačno mnogo'],
    'Paralelne ravni nemaju zajedničku tačku, pa se ne seku ni u jednoj tački. Ako se poklapaju, one su iste ravni.', 'ravni',
    { mediji: prostor({ A: V(0, 0, 0) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'α' }), ravanZ(-0.5, 4.5, -0.5, 3.5, 2.5, { ime: 'β' })], { velicina: 260 }) });

  Q(2, 'Ako dve različite ravni imaju dve različite zajedničke tačke, šta još imaju zajedničko?',
    ['Pravu koja prolazi kroz te tačke', 'Samo te dve tačke', 'Trougao', 'Ništa više'],
    'Obe ravni sadrže prave kroz dve zajedničke tačke, a kroz dve tačke prolazi jedna prava. Ta prava je njihov presek.', 'presek',
    { mediji: prostor({ A: V(0.4, 0.2, 0), B: V(3.6, 2.6, 0), C: V(0.4, 0.2, 2.5), D: V(3.6, 2.6, 2.5) }, [
      ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'α' }), ravan([[0.4, 0.2, 0], [3.6, 2.6, 0], [3.6, 2.6, 2.5], [0.4, 0.2, 2.5]], { ime: 'β', b: 4 })], { velicina: 260 }) });

  Q(1, 'Koliko međusobnih položaja mogu imati dve različite ravni?',
    ['Dva', 'Tri', 'Četiri', 'Jedan'],
    'Dve različite ravni mogu da se seku po pravoj ili da budu paralelne. Treći slučaj – poklapanje – važi samo kad je to ista ravan.', 'položaj',
    { mediji: prostor({ A: V(0, 0, 0) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'α' })], { velicina: 240 }) });

  Q(2, 'Pod učionice i zid učionice. Kakav je njihov međusobni odnos?',
    ['Seku se po pravoj', 'Paralelne su', 'Poklapaju se', 'Imaju tačno jednu zajedničku tačku'],
    'Pod i zid se seku po ivici koja je njihova zajednička prava. Zato se seku, a ne da su paralelni.', 'zid',
    { mediji: prostor({ A: V(0, 0, 0) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'pod' }), ravan([[-0.5, -0.5, 0], [4.5, -0.5, 0], [4.5, -0.5, 3], [-0.5, -0.5, 3]], { ime: 'zid', b: 4 })], { velicina: 260 }) });

  Q(3, 'Ravni $ABCD$ i $ABB_1A_1$ kvadra seku se po pravoj…',
    ['$AB$', '$AD$', '$BB_1$', '$CD$'],
    'Obe ravni sadrže teme A i B, pa je njihov presek prava AB. Prava AD pripada samo ravni ABCD.', 'presek',
    { mediji: KV([SP('ABCD', 2), SP('ABB₁A₁', 3)]), medijiOdgovora: KV([SP('ABCD', 2), SP('ABB₁A₁', 3), H('AB', 1)]) });

  Q(3, 'Ravni $ABC$ i $BCC_1$ kvadra seku se po pravoj…',
    ['$BC$', '$AC_1$', '$CC_1$', '$AB$'],
    'Obe ravni sadrže tačke B i C, pa je njihov presek prava BC. Ravan BCC₁ je bočna strana kvadra koja ima ivicu BC.', 'presek',
    { mediji: KV([SP('ABC', 2), SP('BCC₁B₁', 3)]), medijiOdgovora: KV([SP('ABC', 2), SP('BCC₁B₁', 3), H('BC', 1)]) });

  Q(1, 'Ravni $ABCD$ i $A_1B_1C_1D_1$ kvadra. Kakav je njihov odnos?',
    ['Paralelne su', 'Seku se po pravoj', 'Normalne su', 'Poklapaju se'],
    'Naspramne strane kvadra su paralelne, jer nemaju zajedničku tačku.', 'naspramne',
    { mediji: KV([SP('ABCD', 2), SP('A₁B₁C₁D₁', 3)]) });

  Q(1, 'Ravni osnove $ABCD$ i bočne strane $ABB_1A_1$ kvadra. Kakav je njihov odnos?',
    ['Normalne su', 'Paralelne su', 'Poklapaju se', 'Imaju samo jednu zajedničku tačku'],
    'Bočna strana je normalna na osnovu, jer je seče pod pravim uglom duž ivice AB.', 'normalne',
    { mediji: KV([SP('ABCD', 2), SP('ABB₁A₁', 3)]) });

  Q(3, 'Ravan $\\gamma$ seče ravan $\\alpha$ po pravoj $p$, a ravan $\\alpha$ je paralelna sa $\\beta$. Kakav je odnos ravni $\\gamma$ i $\\beta$?',
    ['Seku se po pravoj paralelnoj sa $p$', 'Paralelne su', 'Poklapaju se', 'Normalne su'],
    'Ako bi γ bila paralelna sa β, bila bi paralelna i sa α, što je u suprotnosti sa presekom p. Zato γ seče β, a presek je prava paralelna sa p.', 'paralelne',
    { mediji: prostor({ A: V(0, 0, 0) }, [ravanZ(-1, 4, -1, 3, 0, { ime: 'α' }), ravanZ(-1, 4, -1, 3, 2, { ime: 'β' }), ravan([[0, -1, -1], [3, 4, 3], [3, 4, 3.5], [0, -1, -0.5]], { ime: 'γ', b: 4 })], { velicina: 260 }) });

  Q(3, 'Ravan $ABC$ kvadra i ravan $A_1B_1C_1$ (gornja strana kvadra). Šta je presek?',
    ['Nema preseka, ravni su paralelne', 'Prava $AC$', 'Prava $BB_1$', 'Tačka $C$'],
    'Ravni ABC i A₁B₁C₁ su naspramne, pa su paralelne i nemaju zajedničkih tačaka.', 'presek',
    { mediji: KV([SP('ABC', 2), SP('A₁B₁C₁', 3)]) });

  Q(2, 'Ravni $ABC$ i $ACC_1A_1$ kvadra. Koja je njihova presečna prava?',
    ['$AC$', '$BC$', '$AA_1$', '$CC_1$'],
    'Obe ravni sadrže tačke A i C, pa je njihov presek prava AC.', 'presek',
    { mediji: KV([SP('ABC', 2), SP('ACC₁A₁', 3)]), medijiOdgovora: KV([SP('ABC', 2), SP('ACC₁A₁', 3), H('AC', 1)]) });

  U(2, 'Koji odnos dve ravni NE postoji?',
    ['Imaju tačno jednu zajedničku tačku', 'Seku se po pravoj', 'Paralelne su', 'Poklapaju se'],
    'Dve različite ravni nemaju tačno jednu zajedničku tačku: ili nemaju nijednu, ili imaju pravu, ili se poklapaju.',
    'Kad dve ravni imaju bar jednu zajedničku tačku, a nisu iste, imaju i celu pravu – kao dva lista knjige koja se spajaju po rubu.', 'ravni',
    { mediji: prostor({ A: V(0, 0, 0) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'α' })], { velicina: 240 }) });

  S(2, 'Spoji dve ravni sa njihovim odnosom.',
    [['poklapaju se', 'beskonačno mnogo zajedničkih tačaka'], ['paralelne su', 'nemaju zajedničkih tačaka'], ['seku se', 'imaju zajedničku pravu']],
    'Svaki par ravni u prostoru je u jednom od ova tri odnosa.', 'ravni',
    { mediji: KV([SP('ABCD', 2), SP('A₁B₁C₁D₁', 3)]) });

  Q(2, 'Dve ravni se seku pod pravim uglom. Kako se zovu?',
    ['Normalne', 'Paralelne', 'Podudarne', 'Mimoilazne'],
    'Ravni koje se seku pod pravim uglom zovu se normalne. Npr. zid i pod sobe su međusobno normalni.', 'normalne',
    { mediji: KV([SP('ABCD', 2), SP('ABB₁A₁', 3)]) });

  // ════════════════ 2.7 Normalna projekcija tačke, prave i duži na ravan ════════════════
  L('Normalna projekcija tačke, prave i duži na ravan');

  Q(1, 'Šta je normalna projekcija tačke na ravan?',
    ['tačka', 'duž', 'prava', 'ravan'],
    'Normalna (ortogonalna) projekcija tačke je uvek tačka: to je podnožje normale iz te tačke na ravan.', 'projekcija',
    { mediji: prostor({ A: V(1.5, 1.2, 2.2) }, [ravanZ(-0.5, 4, -0.5, 3, 0, { ime: 'π' }), NORMALA(V(1.5, 1.2, 2.2), V(1.5, 1.2, 0), 2)], { velicina: 260 }) });

  Q(1, 'Kolika je normalna projekcija tačke koja pripada ravni?',
    ['Ona sama', 'Tačka u beskonačnosti', 'Središte ravni', 'Prodor normale'],
    'Tačka koja pripada ravni je sama svoja projekcija, jer je već na ravni.', 'projekcija',
    { mediji: prostor({ A: V(1.5, 1.2, 0) }, [ravanZ(-0.5, 4, -0.5, 3, 0, { ime: 'π' })], { velicina: 240 }) });

  Q(2, 'Kvadar $ABCDA_1B_1C_1D_1$. Koja je normalna projekcija tačke $C_1$ na ravan osnove $ABCD$?',
    ['$C$', '$B$', '$D$', '$A_1$'],
    'Normala iz C₁ na donju stranu pada u teme C, jer je ivica CC₁ normalna na osnovu.', 'projekcija',
    { mediji: KV([SP('ABCD', 3)]), medijiOdgovora: KV([SP('ABCD', 3), ISP('C₁C', 1), { tacka: 'C' }]) });

  Q(2, 'Kolika je normalna projekcija duži $AC_1$ kvadra na ravan osnove $ABCD$?',
    ['Duž $AC$', 'Duž $AC_1$', 'Duž $AB$', 'Duž $A_1C$'],
    'Projekcija teme C₁ je C, a projekcija A je A. Zato je projekcija duži AC₁ duž AC.', 'projekcija',
    { mediji: KV([H('AC₁', 2), SP('ABCD', 3)]), medijiOdgovora: KV([H('AC₁', 2), H('AC', 1), ISP('C₁C', 1)]) });

  Q(3, 'Kvadar ima dimenzije $4$ cm, $3$ cm i $2{,}5$ cm. Kolika je dužina normalne projekcije dijagonale $AC_1$ na osnovu?',
    ['5 cm', '2,5 cm', '7 cm', '4 cm'],
    'Projekcija AC₁ na osnovu je dijagonala osnove AC, a $AC^2=4^2+3^2=25$, pa je $AC=5$ cm.', 'Pitagora',
    { mediji: KV([H('AC₁', 2)]), medijiOdgovora: KV([H('AC₁', 2), H('AC', 1)]) });

  Q(2, 'Kakva je moguća normalna projekcija duži na ravan?',
    ['Duž ili tačka', 'Samo tačka', 'Samo duž iste dužine', 'Uvek duž duža od polazne'],
    'Ako je duž normalna na ravan, njena projekcija je tačka. U ostalim slučajevima je duž, kraća ili iste dužine.', 'projekcija',
    { mediji: prostor({ A: V(1, 1, 2.2), B: V(1, 1, 0.2) }, [ravanZ(-0.5, 4, -0.5, 3, 0, { ime: 'π' }), { d: 'AB', b: 2, debljina: 3 }], { velicina: 240 }) });

  Q(2, 'Duž je paralelna sa ravni. Kakva je njena normalna projekcija?',
    ['Duž iste dužine', 'Tačka', 'Kraća duž', 'Duža duž'],
    'Duž paralelna sa ravni i njena projekcija su paralelne i iste dužine, jer je četvorougao između njih pravougaonik.', 'paralelna',
    { mediji: prostor({ A: V(0.5, 0.5, 2), B: V(3.5, 2.2, 2) }, [ravanZ(-0.5, 4, -0.5, 3.4, 0, { ime: 'π' }), { d: 'AB', b: 2, debljina: 3 }], { velicina: 240 }) });

  Q(2, 'Duž je normalna na ravan. Kakva je njena normalna projekcija?',
    ['Tačka', 'Duž iste dužine', 'Duž kraća od nje', 'Prava'],
    'Ako je duž normalna na ravan, sve njene tačke padaju u istu tačku na ravni, pa je projekcija tačka.', 'normalna',
    { mediji: prostor({ A: V(1, 1, 2.6), B: V(1, 1, 0.5) }, [ravanZ(-0.5, 4, -0.5, 3, 0, { ime: 'π' }), { d: 'AB', b: 2, debljina: 3 }], { velicina: 240 }) });

  Q(3, 'Duž je koso postavljena prema ravni i nije paralelna ni normalna na nju. Koja je tačna tvrdnja o njenoj projekciji?',
    ['Kraća je od same duži', 'Duža je od same duži', 'Iste je dužine', 'Jednaka je nuli'],
    'Projekcija je kateta pravouglog trougla čija je hipotenuza sama duž, pa je uvek kraća od nje.', 'hipotenuza',
    { mediji: prostor({ A: V(0.5, 0.5, 0.2), B: V(3.6, 2.4, 2.8) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'π' }), { d: 'AB', b: 2, debljina: 3 }], { velicina: 240 }) });

  Q(3, 'Tačka $A$ je na rastojanju 8 cm od ravni, a tačka $B$ na rastojanju 2 cm, obe sa iste strane. Duž $AB$ je 10 cm. Kolika je dužina njene normalne projekcije?',
    ['8 cm', '6 cm', '10 cm', '4 cm'],
    'Razlika visina je 6 cm, a $\\sqrt{10^2-6^2}=8$ cm (3-4-5 trojka u dvostrukom obliku: 6-8-10).', 'Pitagora',
    { mediji: prostor({ A: V(0.5, 0.6, 2.8), B: V(3.4, 2.4, 0.8) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'π' }), { d: 'AB', b: 2, debljina: 3 }], { velicina: 240 }) });

  Q(2, 'Koja tačka je normalna projekcija tačke $D_1$ kvadra na ravan bočne strane $ABB_1A_1$?',
    ['$A_1$', '$B_1$', '$D$', '$A$'],
    'Ravan ABB₁A₁ je prednja strana kvadra. Normala iz D₁ na nju je D₁ spušten na tu ravan: ivica A₁D₁ je normalna na tu ravan, pa pada u A₁.', 'projekcija',
    { mediji: KV([SP('ABB₁A₁', 3), { tacka: 'D₁' }]), medijiOdgovora: KV([SP('ABB₁A₁', 3), ISP('A₁D₁', 1), { tacka: 'A₁' }]) });

  Q(2, 'Tačka $A$ je na rastojanju 5 cm od ravni $\\alpha$. Koliko je rastojanje od $A$ do ravni $\\alpha$ jednako?',
    ['Dužini normale iz $A$ do njenog prodora', 'Dužini duži od $A$ do najdaljeg temena', 'Nuli', 'Polovini dužine duži $AB$'],
    'Rastojanje tačke od ravni je dužina normale iz te tačke do ravni, odnosno do njene normalne projekcije.', 'rastojanje',
    { mediji: prostor({ A: V(1.5, 1.2, 2.4) }, [ravanZ(-0.5, 4, -0.5, 3, 0, { ime: 'α' }), { tacka: 'A' }], { velicina: 240 }),
      medijiOdgovora: prostor({ A: V(1.5, 1.2, 2.4), N: V(1.5, 1.2, 0) }, [ravanZ(-0.5, 4, -0.5, 3, 0, { ime: 'α' }), NORMALA(V(1.5, 1.2, 2.4), V(1.5, 1.2, 0), 2), { tacka: 'A' }], { velicina: 240 }) });

  Q(3, 'Kvadrat $ABCD$ leži u ravni paralelnoj sa ravni $\\pi$. Kakva je njegova normalna projekcija?',
    ['Kvadrat iste veličine', 'Duž', 'Pravougaonik', 'Tačka'],
    'Ako je ravan figure paralelna sa ravni projekcije, projekcija je figura podudarna sa njom.', 'podudaran',
    { mediji: prostor({ A: V(0.5, 0.5, 2), B: V(2.5, 0.5, 2), C: V(2.5, 2.5, 2), D: V(0.5, 2.5, 2) }, [ravanZ(-0.5, 4, -0.5, 3.5, 0, { ime: 'π' }), { p: 'ABCD', b: 2, gusto: 1 }], { velicina: 240 }) });

  S(2, 'Spoji duž sa njenom normalnom projekcijom.',
    [['duž paralelna sa ravni', 'duž iste dužine'], ['duž normalna na ravan', 'tačka'], ['duž koso prema ravni', 'kraća duž']],
    'Ova tri slučaja pokrivaju sve moguće položaje duži prema ravni.', 'projekcija',
    { mediji: prostor({ A: V(0.5, 0.5, 2), B: V(3.5, 2.2, 2) }, [ravanZ(-0.5, 4, -0.5, 3.4, 0, { ime: 'π' }), { d: 'AB', b: 2, debljina: 3 }], { velicina: 240 }) });

  U(2, 'Koja tvrdnja o normalnoj projekciji duži NIJE tačna?',
    ['Projekcija je uvek duža od same duži', 'Projekcija duži normalne na ravan je tačka', 'Projekcija duži paralelne sa ravni je jednake dužine', 'Projekcija je kraća ili jednaka duži'],
    'Projekcija nikad nije duža od same duži. Ostale tri tvrdnje su tačne.',
    'Senka je projekcija štapa na zemlju, ali normalna samo kad zraci padaju okomito (Sunce tačno iznad glave); tad je senka tačka. Uveče, kad zraci padaju koso, senka može biti mnogo duža – ali to nije normalna projekcija.', 'projekcija',
    { mediji: prostor({ A: V(0.5, 0.5, 2), B: V(3.5, 2.2, 2) }, [ravanZ(-0.5, 4, -0.5, 3.4, 0, { ime: 'π' })], { velicina: 240 }) });

  Q(3, 'Normalna projekcija tačke $D_1$ kvadra na ravan $ABCD$ je tačka…',
    ['$D$', '$A$', '$C_1$', '$B_1$'],
    'Ivica DD₁ je normalna na osnovu ABCD, pa je projekcija D₁ u D.', 'projekcija',
    { mediji: KV([SP('ABCD', 3), { tacka: 'D₁' }]), medijiOdgovora: KV([SP('ABCD', 3), ISP('DD₁', 1), { tacka: 'D' }]) });

  Q(3, 'Ravan ABCD kvadra i tačka $D_1$. Koja je rastojanje D₁ od ravni ABCD?',
    ['Jednako visini kvadra', 'Jednako dijagonali osnove', 'Jednako ivici AB', 'Jednako nuli'],
    'Rastojanje tačke od ravni je dužina normale, a DD₁ je normalna na osnovu i jednaka je visini kvadra.', 'visina',
    { mediji: KV([SP('ABCD', 3), H('DD₁', 2)]) });

  // ════════════════ 2.8 Normalna projekcija prave; ugao između prave i ravni ════════════════
  L('Normalna projekcija prave; ugao između prave i ravni');

  Q(1, 'Prava je paralelna sa ravni. Kakva je njena normalna projekcija?',
    ['Prava paralelna sa njom', 'Tačka', 'Prava normalna na nju', 'Polupravi'],
    'Prava paralelna sa ravni se projektuje u pravu koja je njoj paralelna i iste dužine ako je posmatramo kao duž.', 'projekcija',
    { mediji: prostor({ P1: V(0, 0, 2), P2: V(4, 1, 2) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'π' }), ...PRAVA3([0, 0, 2], [4, 1, 2], 'p', 2)], { velicina: 260 }) });

  Q(1, 'Prava pripada ravni. Kakva je njena normalna projekcija?',
    ['Ona sama', 'Tačka', 'Normalna na ravan', 'Prava kraća od nje'],
    'Svaka tačka prave koja pripada ravni je sama svoja projekcija, pa je i cela prava svoja projekcija.', 'projekcija',
    { mediji: prostor({ P1: V(0, 0, 0), P2: V(4, 1, 0) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'π' }), ...PRAVA3([0, 0, 0], [4, 1, 0], 'p', 2)], { velicina: 260 }) });

  Q(2, 'Prava je normalna na ravan. Kakva je njena normalna projekcija?',
    ['Tačka (njen prodor)', 'Prava paralelna sa ravni', 'Duž iste dužine', 'Ravan'],
    'Normalna prava se projektuje u jednu tačku, u kojoj ona prodire ravan.', 'prodor',
    { mediji: prostor({ P1: V(1.5, 1, 2.6), P2: V(1.5, 1, 0) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'π' }), ...PRAVA3([1.5, 1, 2.6], [1.5, 1, -0.5], 'p', 2)], { velicina: 260 }) });

  Q(2, 'Projekcija kose prave koja seče ravan (nije normalna) je…',
    ['prava koja prolazi kroz tačku prodora', 'tačka', 'duž iste dužine', 'prava paralelna sa ravni'],
    'Kosa prava seče ravan u tački prodora, a njena projekcija je prava koja takođe prolazi kroz tu tačku.', 'prodor',
    { mediji: prostor({ P1: V(0, 0, -2), P2: V(3, 1.5, 3) }, [ravanZ(-0.5, 4, -0.5, 3, 0, { ime: 'π' }), ...PRAVA3([0, -0.3, -2], [3, 1.5, 3], 'p', 2)], { velicina: 260 }) });

  Q(2, 'Kako se definiše ugao između prave i ravni, ako prava nije normalna na ravan?',
    ['Ugao između prave i njene normalne projekcije na ravan', 'Ugao između prave i normale', 'Zbir uglova prave sa ravni', 'Ugao između prave i tačke prodora'],
    'Ugao između prave i ravni je ugao između prave i njene projekcije na tu ravan. Zato ne zavisi od izbora tačke na pravoj.', 'ugao',
    { mediji: prostor({ P1: V(0, 0, 0), P2: V(3, 1.5, 2.2) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'π' }), ...PRAVA3([0, 0, 0], [3, 1.5, 2.2], 'p', 2)], { velicina: 260 }) });

  Q(2, 'Koliki je ugao između prave i ravni kad je prava normalna na ravan?',
    ['90°', '0°', '45°', '180°'],
    'Normalna prava sa ravni zaklapa pravi ugao, jer je normalna na sve prave ravni kroz tačku prodora.', 'pravi',
    { mediji: prostor({ P1: V(1.5, 1, 2.6), P2: V(1.5, 1, 0) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'π' }), ...PRAVA3([1.5, 1, 2.6], [1.5, 1, -0.5], 'p', 2)], { velicina: 260 }) });

  Q(2, 'Koliki je ugao između prave i ravni kad je prava paralelna sa ravni?',
    ['0°', '90°', '45°', '180°'],
    'Paralelna prava je sama svoja projekcija (po pravcu), pa ugao između nje i njene projekcije je nula.', 'nula',
    { mediji: prostor({ P1: V(0, 0, 2), P2: V(4, 1, 2) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'π' }), ...PRAVA3([0, 0, 2], [4, 1, 2], 'p', 2)], { velicina: 260 }) });

  Q(3, 'Kvadar $4$ cm, $3$ cm i $12$ cm (osnova sa dijagonalom 5 cm, visina 12 cm). Koliki je tangens ugla koji dijagonala tela $AC_1$ zaklapa sa osnovom?',
    ['$\\frac{12}{5}$', '$\\frac{5}{12}$', '$\\frac{12}{13}$', '$\\frac{13}{5}$'],
    'Ugao $C₁AC$ ima naspramnu katetu $CC₁ = 12$ i naleglu katetu $AC = 5$, pa je tangens $\\frac{12}{5}$.', 'tangens',
    { mediji: KV([H('AC₁', 2)]), medijiOdgovora: KV([H('AC₁', 2), H('AC', 1), ISP('C₁C', 1)]) });

  Q(3, 'Duž dužine 6 cm zaklapa sa ravni ugao od 30°. Kolika je dužina njene normalne projekcije?',
    ['$3\\sqrt{3}$ cm', '3 cm', '$6\\sqrt{3}$ cm', '$\\sqrt{3}$ cm'],
    'Duž, njena projekcija i normala čine pravougli trougao sa uglovima od 30° i 60° – polovinu jednakostraničnog trougla stranice 6 cm. Normala je naspram ugla od 30°, pa je pola duži (3 cm), a projekcija je visina tog trougla: ${6\\sqrt{3}|2} = 3\\sqrt{3}$ cm.', 'projekcija',
    { mediji: prostor({ P1: V(0, 0, 0), P2: V(5.2, 0, 3) }, [ravanZ(-0.5, 6, -1, 2, 0, { ime: 'π' }), ...PRAVA3([0, 0, 0], [5.2, 0, 3], 'p', 2)], { velicina: 260 }) });

  Q(2, 'Duž dužine 10 cm zaklapa sa ravni ugao od 60°. Kolika je dužina njene normalne projekcije?',
    ['5 cm', '5√3 cm', '10 cm', '8 cm'],
    'Duž, projekcija i normala čine polovinu jednakostraničnog trougla stranice 10 cm. Projekcija leži naspram ugla od 30° (kod gornjeg kraja duži), pa je dva puta kraća od duži: 5 cm.', 'polovina',
    { mediji: prostor({ P1: V(0, 0, 0), P2: V(5, 0, 8.66) }, [ravanZ(-0.5, 6, -1, 2, 0, { ime: 'π' }), ...PRAVA3([0, 0, 0], [5, 0, 8.66], 'p', 2)], { velicina: 260 }) });

  Q(3, 'Tačka na pravoj je na rastojanju 6 cm od tačke prodora, a prava zaklapa sa ravni ugao 45°. Na kojoj je visini ta tačka iznad ravni?',
    ['$3\\sqrt{2}$ cm', '6 cm', '$3\\sqrt{3}$ cm', '$6\\sqrt{2}$ cm'],
    'Kod ugla od 45° pravougli trougao je jednakokraki – polovina kvadrata čija je dijagonala 6 cm. Visina je stranica tog kvadrata: ${6|\\sqrt{2}} = 3\\sqrt{2}$ cm.', 'kvadrat',
    { mediji: prostor({ P1: V(0, 0, 0), P2: V(4.2, 0, 4.2) }, [ravanZ(-0.5, 6, -1, 2, 0, { ime: 'π' }), ...PRAVA3([0, 0, 0], [4.2, 0, 4.2], 'p', 2)], { velicina: 260 }) });

  Q(2, 'Što je prava strmija prema ravni (bliža normali), šta se dešava s njenom projekcijom?',
    ['Postaje kraća', 'Postaje duža', 'Ostaje iste dužine', 'Postaje paralelna sa ravni'],
    'Duž, projekcija i normala čine pravougli trougao: $d^{2} = p^{2} + h^{2}$. Duž $d$ je ista, pa kad visina $h$ raste, projekcija $p$ se smanjuje. Kad je ugao 90°, projekcija je tačka.', 'strmija',
    { mediji: prostor({ P1: V(0, 0, 0), P2: V(4, 0.5, 1.5) }, [ravanZ(-0.5, 6, -1, 2, 0, { ime: 'π' }), ...PRAVA3([0, 0, 0], [4, 0.5, 1.5], 'p', 2)], { velicina: 260 }) });

  Q(2, 'Vrata na šarkama su uspravna na podu. Koliki je ugao između ravni vrata i poda?',
    ['90°', '0°', '45°', '180°'],
    'Uspravna vrata sa podom zaklapaju pravi ugao, jer su normalna na pod.', 'vrata',
    { mediji: prostor({ A: V(0, 0, 0), B: V(4, 0, 0), C: V(0, 3, 0), D: V(4, 3, 0) }, [ravanZ(-0.5, 5, -1, 4, 0, { ime: 'pod' }), ravan([[0, 0, 0], [4, 0, 0], [4, 0, 2.6], [0, 0, 2.6]], { ime: 'vrata', b: 4 })], { velicina: 260 }) });

  S(2, 'Spoji položaj prave prema ravni sa uglom koji zaklapa.',
    [['prava normalna na ravan', 'ugao 90°'], ['prava paralelna sa ravni', 'ugao 0°'], ['kosa prava prema ravni', 'ugao između 0° i 90°']],
    'Ugao između prave i ravni uvek je između 0° i 90°, uključujući krajeve.', 'ugao',
    { mediji: prostor({ P1: V(0, 0, 0), P2: V(3, 1.5, 2.2) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'π' }), ...PRAVA3([0, 0, 0], [3, 1.5, 2.2], 'p', 2)], { velicina: 260 }) });

  U(2, 'Koji ugao NE može biti ugao između prave i ravni?',
    ['180°', '0°', '90°', '45°'],
    'Ugao između prave i ravni je između 0° i 90°. Ugao od 180° nije ugao prave prema ravni.',
    'Nagib puta se ne izražava u stepenima nego u procentima: znak „10%“ znači da se put na 100 m podigne 10 m, što je ugao od samo oko 5,7°.', 'ugao',
    { mediji: prostor({ P1: V(0, 0, 0), P2: V(3, 1.5, 2.2) }, [ravanZ(-0.5, 4.5, -0.5, 3.5, 0, { ime: 'π' })], { velicina: 240 }) });
};
