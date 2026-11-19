// Tema 6 (drugi deo): konstrukcija paralelograma, operacije sa vektorima, trapez, konstrukcija trapeza, deltoid
// (lekcije 6.6–6.10 udžbenika Matematika 6, Arhiknjiga). Sopstveni brojevi; crtež uz svaki zadatak.
module.exports = ({ L, Z, K, G, R, r, rad, proveri }) => {
  const sr = (P, Q) => [r((P[0] + Q[0]) / 2), r((P[1] + Q[1]) / 2)];
  const plus = (P, v) => [r(P[0] + v[0]), r(P[1] + v[1])];
  const dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
  const ugaoTacke = (C, P) => (Math.atan2(P[1] - C[1], P[0] - C[0]) * 180) / Math.PI;
  const sestar = (ime, C, X, { raspon = 18, b = 3, kasni = 0.3, k, id } = {}) => {
    const u = ugaoTacke(C, X);
    return { l: ime, r: r(dist(C, X)), od: r(u - raspon), do: r(u + raspon), b, crtaj: 1, kasni, trajanje: 0.7, ...(k !== undefined ? { k } : {}), ...(id ? { id } : {}) };
  };
  const tPar = (a, b, ug) => {
    const D = [r(b * Math.cos(rad(ug))), r(b * Math.sin(rad(ug)))];
    return { A: [0, 0], B: [a, 0], C: plus(D, [a, 0]), D };
  };
  const tTrap = (a, b, h, x) => ({ A: [0, 0], B: [a, 0], C: [r(x + b), h], D: [r(x), h] });
  const tDelt = (s, p, q) => ({ A: [-s, 0], B: [0, -p], C: [s, 0], D: [0, q] });
  const resetka = (x0, x1, y0, y1) => {
    const e = [];
    for (let x = x0; x <= x1; x++) e.push({ lin: [[x, y0], [x, y1]], b: 4, debljina: 0.5 });
    for (let y = y0; y <= y1; y++) e.push({ lin: [[x0, y], [x1, y]], b: 4, debljina: 0.5 });
    return e;
  };
  const vek = (P, v, { b = 1, o, oAt, ...dod } = {}) => ({
    lin: [P, plus(P, v)], str: 1, b, debljina: 3.2,
    ...(o ? { o, oAt: oAt || [r(P[0] + v[0] / 2 - Math.sign(v[1] || 0.001) * 0.35), r(P[1] + v[1] / 2 + Math.sign(v[0] || -0.001) * 0.35)] } : {}), ...dod,
  });
  const papirG = (x0, x1, y0, y1, e, vel = 240) => G({ o: [x0, y0] }, [resetka(x0, x1, y0, y1), e], { velicina: vel });

  // ════════════════ 6.6 Konstrukcija paralelograma ════════════════
  L('Konstrukcija paralelograma');
  {
    const t = tPar(5, 3, 40);
    proveri(180 - 40 === 140, 'β = 140°');
    Z(1, 'Konstruiše se paralelogram $ABCD$ sa $AB = 5 cm$, $AD = 3 cm$ i $α = 40°$. Koliki su uglovi $β$, $γ$ i $δ$?',
      ['$140°$, $40°$, $140°$', '$40°$, $140°$, $40°$', '$140°$, $140°$, $40°$', '$50°$, $40°$, $50°$'],
      [K('Prvo se konstruiše trougao $ABD$ (SUS): duž $AB$, ugao $40°$ i na kraku $AD = 3 cm$.', ['abd']),
       K('Teme $C$ je u preseku kružnica $k(B, 3 cm)$ i $k(D, 5 cm)$.', ['luk']),
       K('Susedni uglovi paralelograma su suplementni: $β = 180° − 40° = 140°$.', ['b']),
       K('Naspramni uglovi su jednaki: $γ = α = 40°$, $δ = β = 140°$.', ['g'])],
      G(t, [{ d: 'AB', o: '5 cm', b: 0 }, { d: 'AD', o: '3 cm', b: 0 }, { u: 'DAB', o: '40°', b: 1 },
        { p: 'ABD', b: 1, gusto: 1, k: 1, id: 'abd' },
        sestar('B', t.B, t.C, { k: 2, id: 'luk' }), sestar('D', t.D, t.C, { k: 2, id: 'luk', b: 5, kasni: 0.9 }),
        { d: 'BC', b: 0, k: 2, crtaj: 1, kasni: 1.6 }, { d: 'DC', b: 0, k: 2, crtaj: 1, kasni: 1.9 },
        { u: 'ABC', o: '140°', b: 2, k: 3, id: 'b' }, { u: 'BCD', o: '40°', b: 1, k: 4, id: 'g' }, { u: 'CDA', o: '140°', b: 2, k: 4, id: 'g' }], { velicina: 320 }));

    const to = { A: [0, 0], B: [6, 0], C: [6, 8], D: [0, 8], O: [3, 4] };
    proveri(dist(to.O, to.A) === 5, 'r = 5');
    Z(1, 'Pravougaonik ima stranicu $6 cm$, a poluprečnik opisane kružnice je $5 cm$. Kolika je dijagonala pravougaonika?',
      ['$10 cm$', '$5 cm$', '$11 cm$', '$12 cm$'],
      [K('Dijagonale pravougaonika su jednake i polove se, pa je presek $O$ jednako udaljen od sva četiri temena.', ['d']),
       K('Zato je $O$ centar opisane kružnice, a dijagonala je njen prečnik: $2 · 5 = 10 cm$.', ['kr'])],
      G(to, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '6 cm' }, { kr: 'O', r: 5, b: 2, id: 'kr' }, { d: 'OB', o: '5 cm', b: 3 }, { d: 'AC', b: 1, k: 1, id: 'd', crtaj: 1 }, { d: 'BD', b: 1, k: 1, id: 'd', crtaj: 1, kasni: 0.8 }, { tacka: 'O' }], { velicina: 220 }));

    proveri(10 / 2 === 5 && 6 / 2 === 3 && 5 + 3 > 7, 'AO = 5, BO = 3');
    const xo = (25 - 9 + 49) / 14, yo = Math.sqrt(25 - xo * xo);
    const tb = { A: [0, 0], B: [7, 0], O: [r(xo), r(yo)], C: [r(2 * xo), r(2 * yo)], D: [r(2 * xo - 7), r(2 * yo)] };
    proveri(Math.abs(dist(tb.O, tb.B) - 3) < 0.01, 'BO = 3');
    Z(2, 'Paralelogram ima stranicu $AB = 7 cm$ i dijagonale $AC = 10 cm$ i $BD = 6 cm$. Kolike su stranice trougla $ABO$ ($O$ je presek dijagonala) koji se konstruiše prvi?',
      ['$7 cm$, $5 cm$ i $3 cm$', '$7 cm$, $10 cm$ i $6 cm$', '$7 cm$, $5 cm$ i $6 cm$', '$3,5 cm$, $5 cm$ i $3 cm$'],
      [K('Dijagonale paralelograma se polove: $AO = 10 : 2 = 5 cm$, $BO = 6 : 2 = 3 cm$.', ['ao']),
       K('Trougao $ABO$ ima stranice $7$, $5$ i $3 cm$ i konstruiše se po stavu SSS (postoji, jer je $5 + 3 > 7$).', ['abo']),
       K('Temena $C$ i $D$ su na produžecima $AO$ i $BO$ preko tačke $O$, za još $5 cm$ i $3 cm$.', ['pr'])],
      G(tb, [{ p: 'ABCD', b: 0, prazno: 1, k: 3, id: 'pr' }, { d: 'AB', o: '7 cm', b: 0 }, { p: 'ABO', b: 1, gusto: 1, k: 2, id: 'abo' }, { d: 'AO', b: 1, o: '5', k: 1, id: 'ao' }, { d: 'BO', b: 2, o: '3', k: 1, id: 'ao' }, { d: 'OC', b: 1, isp: 1, k: 3, crtaj: 1, id: 'pr' }, { d: 'OD', b: 2, isp: 1, k: 3, crtaj: 1, kasni: 0.7, id: 'pr' }, { tacka: 'O', k: 1 }], { velicina: 240 }));

    proveri(!(3 + 2 > 8), 'trougao 8, 3, 2 ne postoji');
    Z(2, 'Da li postoji paralelogram sa stranicom $8 cm$ i dijagonalama $6 cm$ i $4 cm$?',
      ['ne – trougao $8$, $3$, $2 cm$ ne postoji', 'da – postoji tačno jedan', 'da – ima ih beskonačno mnogo', 'ne – dijagonale moraju biti jednake'],
      [K('Polovine dijagonala su $3 cm$ i $2 cm$; sa stranicom $8 cm$ one treba da čine trougao $ABO$.'),
       K('Nejednakost trougla: $3 + 2 = 5 < 8$. Lukovi oko $A$ i $B$ se ne seku, pa trougla nema.', ['l']),
       K('Zato takav paralelogram ne postoji.')],
      G({ A: [0, 0], B: [8, 0] }, [{ d: 'AB', o: '8 cm', b: 0 }, { l: 'A', r: 3, od: -10, do: 90, b: 1, crtaj: 1, k: 2, id: 'l' }, { l: 'B', r: 2, od: 90, do: 190, b: 2, crtaj: 1, kasni: 0.8, k: 2, id: 'l' }, { tacka: 'AB' }], { velicina: 240 }));

    const tg = { A: [-2, -1], B: [3, -1], C: [5, 2], D: [0, 2] };
    proveri(tg.D[0] === tg.A[0] + tg.C[0] - tg.B[0] && tg.D[1] === tg.A[1] + tg.C[1] - tg.B[1], 'D = A + C − B');
    Z(2, 'U koordinatnoj ravni su date tačke $A(−2, −1)$, $B(3, −1)$ i $C(5, 2)$. Koje su koordinate tačke $D$, ako je $ABCD$ paralelogram?',
      ['$D(0, 2)$', '$D(−2, 2)$', '$D(10, 2)$', '$D(0, 3)$'],
      [K('Naspramne stranice paralelograma su paralelne i jednake, pa je $\\vec{AD} = \\vec{BC}$.'),
       K('Od $B$ do $C$: $2$ udesno i $3$ nagore.', ['bc']),
       K('Isto od $A$: $D(−2 + 2, −1 + 3) = D(0, 2)$.', ['ad'])],
      G(tg, [{ mreza: [-3, 6, -2, 3] }, { d: 'AB', b: 0 }, { d: 'BC', b: 0, id: 'bc' }, { tacka: 'ABC', b: 1 }, { lin: [tg.B, tg.C], str: 1, b: 2, k: 2, debljina: 3.5 }, { lin: [tg.A, tg.D], str: 1, b: 2, k: 3, crtaj: 1, id: 'ad', debljina: 3.5 }, { d: 'CD', b: 0, k: 3, crtaj: 1, kasni: 1 }, { tacka: 'D', b: 1, k: 3 }], { bezImena: [], velicina: 260 }));

    const tq = { A: [1, 1], B: [4, 2], C: [3, 5], D: [0, 4] };
    proveri(tq.C[0] - tq.B[0] === -(tq.B[1] - tq.A[1]) && tq.C[1] - tq.B[1] === tq.B[0] - tq.A[0], 'AB ⊥ BC, jednake');
    Z(3, 'Tačke $A(1, 1)$ i $B(4, 2)$ su susedna temena kvadrata $ABCD$ koji leži levo od prave $AB$ (gledano od $A$ ka $B$). Koje su koordinate temena $C$?',
      ['$C(3, 5)$', '$C(5, 5)$', '$C(4, 5)$', '$C(5, −1)$'],
      [K('Od $A$ do $B$ idemo $3$ udesno i $1$ nagore.', ['ab']),
       K('Stranica $BC$ je iste dužine i normalna na $AB$: okrećemo „korak“ za $90°$ – $1$ ulevo i $3$ nagore.', ['bc']),
       K('$C(4 − 1, 2 + 3) = C(3, 5)$, a $D(0, 4)$.', ['kv'])],
      G(tq, [{ mreza: [-1, 6, 0, 6] }, { d: 'AB', b: 0, id: 'ab' }, { tacka: 'AB', b: 1 }, { lin: [tq.B, tq.C], str: 1, b: 2, k: 2, id: 'bc', crtaj: 1, debljina: 3.5 }, { p: 'ABCD', b: 0, k: 3, id: 'kv' }, { tacka: 'CD', b: 1, k: 3 }], { velicina: 240 }));

    const tp = { A: [4, 3], B: [4, -1], C: [-2, -1], D: [-2, 3] };
    Z(1, 'Tačke $A(4, 3)$, $B(4, −1)$ i $C(−2, −1)$ su temena pravougaonika $ABCD$. Koje su koordinate temena $D$?',
      ['$D(−2, 3)$', '$D(−2, −3)$', '$D(3, −2)$', '$D(4, −2)$'],
      [K('Stranica $AB$ je uspravna, a $BC$ vodoravna.', ['s']),
       K('Teme $D$ je „iznad“ $C$ (ista $x$-koordinata kao $C$) i „levo od“ $A$ (ista $y$-koordinata kao $A$): $D(−2, 3)$.', ['d'])],
      G(tp, [{ mreza: [-3, 5, -2, 4] }, { d: 'AB', b: 0, id: 's' }, { d: 'BC', b: 0, id: 's' }, { tacka: 'ABC', b: 1 }, { d: 'CD', b: 2, k: 2, isp: 1, crtaj: 1 }, { d: 'DA', b: 2, k: 2, isp: 1, crtaj: 1, kasni: 0.6 }, { tacka: 'D', b: 1, k: 2, id: 'd' }], { velicina: 240 }));

    const s3 = Math.sqrt(3);
    const tr = { A: [0, 0], B: [r(2.5 * s3), -2.5], C: [r(5 * s3), 0], D: [r(2.5 * s3), 2.5] };
    proveri(Math.abs(dist(tr.A, tr.B) - 5) < 0.01 && Math.abs(dist(tr.B, tr.D) - 5) < 0.01, 'romb stranice 5, BD = 5');
    Z(2, 'Ugao romba je $60°$, a njegova kraća dijagonala $5 cm$. Koliki je obim romba?',
      ['$20 cm$', '$10 cm$', '$15 cm$', '$25 cm$'],
      [K('Kraća dijagonala $BD$ deli romb na dva jednakokraka trougla sa uglom $60°$ između krakova.', ['t']),
       K('Jednakokraki trougao sa uglom $60°$ na vrhu ima i uglove na osnovici po $60°$ – jednakostraničan je. Zato je stranica romba $5 cm$.', ['t']),
       K('$O = 4 · 5 = 20 cm$.')],
      G(tr, [{ p: 'ABCD', b: 0 }, { u: 'BAD', o: '60°', b: 1, r: 30 }, { d: 'BD', o: '5 cm', b: 2 }, { p: 'ABD', b: 1, gusto: 1, k: 1, id: 't' }], { velicina: 220 }));

    const tu = { O: [0, 0], A: [-3, 0], C: [3, 0], B: [-2, r(-2 * s3)], D: [2, r(2 * s3)] };
    Z(3, 'Dijagonale paralelograma su $6 cm$ i $8 cm$ i seku se pod uglom od $60°$. Koliki su uglovi $∠AOB$ i $∠BOC$ ($O$ je presek dijagonala)?',
      ['$60°$ i $120°$', '$60°$ i $60°$', '$30°$ i $150°$', '$90°$ i $90°$'],
      [K('Kada se dve prave seku, nastaju dva para unakrsnih uglova. Jedan ugao je zadat: $∠AOB = 60°$.', ['u1']),
       K('$∠AOB$ i $∠BOC$ su naporedni, pa je $∠BOC = 180° − 60° = 120°$.', ['u2']),
       K('Trougao $AOB$ ($3 cm$, $4 cm$, $60°$) konstruiše se po stavu SUS, a $C$ i $D$ na produžecima.', ['pr'])],
      G(tu, [{ d: 'AC', b: 1 }, { d: 'BD', b: 2 }, { u: 'BOA', o: '60°', b: 3, id: 'u1' }, { u: 'COB', o: '120°', b: 5, k: 2, id: 'u2' }, { p: 'ABCD', b: 0, prazno: 1, k: 3, crtaj: 1, id: 'pr' }, { d: 'AO', o: '3 cm' }, { d: 'OB', o: '4 cm' }], { velicina: 220 }));
    proveri(Math.abs(dist(tu.O, tu.B) - 4) < 0.01, 'OB = 4');

    const ts = tPar(5, 3, 60);
    proveri(180 - 60 === 120, '∠ABC = 120°');
    Z(2, 'Konstruiše se paralelogram $ABCD$ sa $AB = 5 cm$, $∠BAD = 60°$ i dijagonalom $AC = 7 cm$. Trougao $ABC$ može da se konstruiše odmah. Koliki je ugao $∠ABC$?',
      ['$120°$', '$60°$', '$30°$', '$90°$'],
      [K('Uglovi kod $A$ i $B$ su susedni uglovi paralelograma, pa su suplementni.'),
       K('$∠ABC = 180° − 60° = 120°$. Trougao $ABC$: $AB = 5 cm$, $AC = 7 cm$ i ugao $120°$ naspram $AC$ – stav SSU.', ['abc']),
       K('Četvrto teme $D$ je u preseku kružnica $k(A, BC)$ i $k(C, AB)$.', ['luk'])],
      G(ts, [{ d: 'AB', o: '5 cm', b: 0 }, { u: 'DAB', o: '60°', b: 1 }, { d: 'AD', b: 4, isp: 1 }, { d: 'AC', o: '7 cm', b: 2, k: 2 }, { p: 'ABC', b: 2, gusto: 1, k: 2, id: 'abc' }, { u: 'ABC', o: '120°', b: 3, k: 2 }, sestar('A', ts.A, ts.D, { k: 3, id: 'luk' }), sestar('C', ts.C, ts.D, { k: 3, id: 'luk', b: 5, kasni: 0.9 }), { p: 'ABCD', b: 0, prazno: 1, k: 3, crtaj: 1, kasni: 1.6 }], { bezImena: ['C', 'D'], velicina: 240 }));
    proveri(Math.abs(dist(ts.A, ts.C) - 7) < 0.01, 'AC = 7 za AD = 3');
  }

  // ════════════════ 6.7 Operacije sa vektorima ════════════════
  L('Operacije sa vektorima');
  {
    const a = [3, 2], b = [2, -1];
    proveri(a[0] + b[0] === 5 && a[1] + b[1] === 1, 'a + b = (5, 1)');
    Z(1, 'Na kariranom papiru vektor $\\vec{a}$ ide $3$ kvadratića udesno i $2$ nagore, a $\\vec{b}$ $2$ udesno i $1$ nadole. Kakav je vektor $\\vec{a} + \\vec{b}$?',
      ['$5$ udesno i $1$ nagore', '$5$ udesno i $3$ nagore', '$1$ udesno i $3$ nagore', '$5$ udesno i $1$ nadole'],
      [K('Vektor $\\vec{b}$ nadovežemo na $\\vec{a}$: početak $\\vec{b}$ stavimo u kraj $\\vec{a}$.', ['b']),
       K('Zbir ide od početka $\\vec{a}$ do kraja $\\vec{b}$.', ['z']),
       K('Vodoravno $3 + 2 = 5$ udesno, uspravno $2 − 1 = 1$ nagore.')],
      papirG(0, 8, 0, 4, [vek([0.5, 0.5], a, { o: 'a' }), vek([5, 3], b, { b: 2, o: 'b', kraj: 1 }), vek([5, 3], b, { b: 2, o: 'b', k: 1, pomeri: [-1.5, -0.5], id: 'b' }), vek([0.5, 0.5], [5, 1], { b: 3, o: 'a + b', oAt: [3, 0.6], k: 2, crtaj: 1, id: 'z' })]));

    const tl = { A: [0, 0], B: [2, 2], C: [5, 2.5], D: [6.5, 0.5], E: [9, 1.5] };
    Z(1, 'Čemu je jednak zbir $\\vec{AB} + \\vec{BC} + \\vec{CD} + \\vec{DE}$?',
      ['$\\vec{AE}$', '$\\vec{EA}$', '$\\vec{AD}$', '$\\vec{0}$'],
      [K('Vektori su već nadovezani: svaki počinje gde se prethodni završava.', ['v']),
       K('Zbir ide od početka prvog ($A$) do kraja poslednjeg ($E$): $\\vec{AE}$.', ['ae'])],
      G(tl, [{ d: 'AB', str: 1, b: 1, id: 'v' }, { d: 'BC', str: 1, b: 2, id: 'v' }, { d: 'CD', str: 1, b: 5, id: 'v' }, { d: 'DE', str: 1, b: 0, id: 'v' }, { d: 'AE', str: 1, b: 3, k: 2, id: 'ae', crtaj: 1, debljina: 3.5 }], { velicina: 260 }));

    proveri(2 * 3 === 6, '|−2a| = 6');
    Z(1, 'Intenzitet vektora $\\vec{a}$ je $3 cm$. Koliki je intenzitet vektora $−2\\vec{a}$?',
      ['$6 cm$', '$−6 cm$', '$1 cm$', '$5 cm$'],
      [K('$|k\\vec{a}| = |k| · |\\vec{a}|$, a intenzitet (dužina) nikad nije negativan.'),
       K('$|−2\\vec{a}| = 2 · 3 = 6 cm$. Znak minus samo okreće smer.', ['m'])],
      papirG(0, 8, 0, 3, [vek([0.5, 2], [3, 0], { o: 'a' }), vek([7, 0.8], [-6, 0], { b: 2, o: '−2a', oAt: [4, 1.35], k: 2, crtaj: 1, id: 'm' })]));

    const tp = { A: [0, 0], B: [5, 0], C: [6.5, 3], D: [1.5, 3] };
    Z(2, 'Dat je paralelogram $ABCD$. Čemu je jednak zbir $\\vec{AB} + \\vec{AD}$?',
      ['$\\vec{AC}$', '$\\vec{BD}$', '$\\vec{DB}$', '$\\vec{CA}$'],
      [K('Naspramne stranice su jednaki vektori: $\\vec{AD} = \\vec{BC}$.', ['bc']),
       K('$\\vec{AB} + \\vec{AD} = \\vec{AB} + \\vec{BC} = \\vec{AC}$ – pravilo paralelograma.', ['ac'])],
      G(tp, [{ p: 'ABCD', b: 4, prazno: 1 }, { d: 'AB', str: 1, b: 1 }, { d: 'AD', str: 1, b: 2 }, { d: 'AD', str: 1, b: 2, pomeri: [5, 0], k: 1, id: 'bc' }, { d: 'AC', str: 1, b: 3, k: 2, crtaj: 1, id: 'ac', debljina: 3.5 }], { velicina: 240 }));

    Z(2, 'Dat je paralelogram $ABCD$. Čemu je jednaka razlika $\\vec{AB} − \\vec{AD}$?',
      ['$\\vec{DB}$', '$\\vec{BD}$', '$\\vec{AC}$', '$\\vec{CA}$'],
      [K('$\\vec{AB} − \\vec{AD} = \\vec{AB} + \\vec{DA}$, jer je $\\vec{DA} = −\\vec{AD}$.', ['da']),
       K('Zamenimo redosled: $\\vec{DA} + \\vec{AB} = \\vec{DB}$ (od $D$ preko $A$ do $B$).', ['db'])],
      G(tp, [{ p: 'ABCD', b: 4, prazno: 1 }, { d: 'AB', str: 1, b: 1 }, { d: 'AD', str: 1, b: 2, kraj: 1 }, { d: 'DA', str: 1, b: 2, k: 1, id: 'da', crtaj: 1 }, { d: 'DB', str: 1, b: 3, k: 2, crtaj: 1, id: 'db', debljina: 3.5 }], { velicina: 240 }));

    const ts = { A: [0, 0], B: [7, 0], C: [2.5, 4] };
    const M = sr(ts.A, ts.C), N = sr(ts.B, ts.C), P = sr(ts.A, ts.B);
    proveri(2 * (4 + 6 + 7) === 34, 'obim 34');
    Z(2, 'Srednje linije trougla su $4 cm$, $6 cm$ i $7 cm$. Koliki je obim trougla?',
      ['$34 cm$', '$17 cm$', '$68 cm$', '$24 cm$'],
      [K('Srednja linija je paralelna jednoj stranici i dvaput je kraća od nje ($\\vec{MN} = {1|2}\\vec{AB}$).', ['mn']),
       K('Stranice trougla su $8 cm$, $12 cm$ i $14 cm$.', ['abc']),
       K('$O = 8 + 12 + 14 = 34 cm$ (dvostruki obim trougla srednjih linija: $2 · 17$).')],
      G({ ...ts, M, N, P }, [{ p: 'ABC', b: 0, id: 'abc' }, { p: 'MNP', b: 1 }, { d: 'MN', o: '7', id: 'mn' }, { d: 'NP', o: '4' }, { d: 'PM', o: '6' }, { d: 'MN', b: 2, k: 1, pomeri: [-2.5, -2] }], { bezImena: ['M', 'N', 'P'], velicina: 240 }));
    proveri(Math.abs(dist(M, N) * 2 - dist(ts.A, ts.B)) < 1e-9, 'MN = AB/2');

    proveri((8 + 10 + 12) / 2 === 15, 'obim 15');
    Z(2, 'Stranice trougla su $8 cm$, $10 cm$ i $12 cm$. Koliki je obim trougla čija su temena sredine stranica tog trougla?',
      ['$15 cm$', '$30 cm$', '$60 cm$', '$10 cm$'],
      [K('Stranice novog trougla su srednje linije – svaka je polovina jedne stranice: $4$, $5$ i $6 cm$.', ['m']),
       K('$O = 4 + 5 + 6 = 15 cm$ – polovina obima velikog trougla.')],
      G({ ...ts, M, N, P }, [{ p: 'ABC', b: 0 }, { p: 'MNP', b: 1, gusto: 1, k: 1, id: 'm', crtaj: 1 }, { tacka: 'MNP', b: 1 }], { bezImena: ['M', 'N', 'P'], velicina: 240 }));

    const a2 = [2, 1], b2 = [-1, 2];
    proveri(a2[0] - b2[0] === 3 && a2[1] - b2[1] === -1, 'a − b = (3, −1)');
    Z(2, 'Vektor $\\vec{a}$ ide $2$ kvadratića udesno i $1$ nagore, a $\\vec{b}$ $1$ ulevo i $2$ nagore. Kakav je vektor $\\vec{a} − \\vec{b}$?',
      ['$3$ udesno i $1$ nadole', '$1$ udesno i $3$ nagore', '$3$ udesno i $1$ nagore', '$1$ ulevo i $1$ nadole'],
      [K('Oduzeti $\\vec{b}$ znači dodati suprotan vektor $−\\vec{b}$: $1$ udesno i $2$ nadole.', ['mb']),
       K('Nadovežemo $−\\vec{b}$ na $\\vec{a}$.', ['mb2']),
       K('Vodoravno $2 + 1 = 3$ udesno, uspravno $1 − 2 = −1$, tj. $1$ nadole.', ['z'])],
      papirG(0, 7, 0, 4, [vek([0.5, 1.5], a2, { o: 'a' }), vek([5.5, 1], b2, { b: 2, o: 'b' }), vek([5, 3.5], [1, -2], { b: 5, o: '−b', k: 1, id: 'mb' }), vek([5, 3.5], [1, -2], { b: 5, k: 2, pomeri: [-2.5, -1.5], id: 'mb2' }), vek([0.5, 1.5], [3, -1], { b: 3, o: 'a − b', oAt: [1.6, 0.6], k: 3, crtaj: 1, id: 'z' })]));

    const tc = { A: [0, 0], B: [7, -1], C: [8, 4], D: [1, 5] };
    const E = sr(tc.A, tc.B), F = sr(tc.B, tc.C), Gt = sr(tc.C, tc.D), H = sr(tc.D, tc.A);
    proveri((10 / 2 + 6 / 2) * 2 === 16, 'obim 16');
    Z(3, 'Dijagonale četvorougla $ABCD$ su $AC = 10 cm$ i $BD = 6 cm$. Koliki je obim četvorougla čija su temena sredine stranica $ABCD$?',
      ['$16 cm$', '$32 cm$', '$8 cm$', '$30 cm$'],
      [K('$EF$ i $HG$ su srednje linije trouglova $ABC$ i $ACD$, pa su paralelne sa $AC$ i jednake ${AC|2} = 5 cm$.', ['ac']),
       K('$FG$ i $EH$ su srednje linije trouglova $BCD$ i $ABD$: jednake ${BD|2} = 3 cm$.', ['bd']),
       K('$EFGH$ je paralelogram sa obimom $2 · (5 + 3) = 16 cm$ – koliko je zbir dijagonala.', ['p'])],
      G({ ...tc, E, F, G: Gt, H }, [{ p: 'ABCD', b: 0, prazno: 1 }, { d: 'AC', b: 1, isp: 1, id: 'ac' }, { d: 'BD', b: 2, isp: 1, id: 'bd' }, { tacka: 'EFGH', b: 3 }, { d: 'EF', b: 1, k: 1, id: 'ac', debljina: 3.5 }, { d: 'HG', b: 1, k: 1, id: 'ac', debljina: 3.5 }, { d: 'FG', b: 2, k: 2, id: 'bd', debljina: 3.5 }, { d: 'EH', b: 2, k: 2, id: 'bd', debljina: 3.5 }, { p: 'EFGH', b: 3, k: 3, id: 'p' }], { velicina: 240 }));
    proveri(Math.abs(dist(E, F) - dist(tc.A, tc.C) / 2) < 1e-9, 'EF = AC/2');

    const tm = { T: [0, 0], A: [5, 1], B: [2, 4] };
    const Mm = sr(tm.A, tm.B), S2 = plus(tm.A, [2, 4]);
    Z(3, 'Tačka $M$ je sredina duži $AB$, a $T$ tačka van nje. Čemu je jednak zbir $\\vec{TA} + \\vec{TB}$?',
      ['$2\\vec{TM}$', '$\\vec{TM}$', '$\\vec{AB}$', '${1|2}\\vec{TM}$'],
      [K('Po pravilu paralelograma, $\\vec{TA} + \\vec{TB}$ je dijagonala $\\vec{TS}$ paralelograma $TASB$.', ['s']),
       K('Dijagonale paralelograma se polove: druga dijagonala $AB$ seče $TS$ u svojoj sredini $M$.', ['m']),
       K('Dakle $TS = 2 · TM$, tj. $\\vec{TA} + \\vec{TB} = 2\\vec{TM}$.', ['tm'])],
      G({ ...tm, M: Mm, S: S2 }, [{ d: 'TA', str: 1, b: 1 }, { d: 'TB', str: 1, b: 2 }, { d: 'AB', b: 4 }, { tacka: 'M', b: 3 }, { d: 'AS', b: 4, isp: 1, k: 1 }, { d: 'BS', b: 4, isp: 1, k: 1 }, { d: 'TS', str: 1, b: 3, k: 1, id: 's', crtaj: 1 }, { d: 'TM', b: 5, debljina: 5, k: 2, id: 'm' }, { d: 'TM', b: 5, debljina: 5, k: 3, pomeri: [Mm[0], Mm[1]], id: 'tm' }], { velicina: 220 }));
    proveri(Math.abs(S2[0] - 2 * Mm[0]) < 1e-9 && Math.abs(S2[1] - 2 * Mm[1]) < 1e-9, 'S = 2M');
  }

  // ════════════════ 6.8 Trapez ════════════════
  L('Trapez');
  {
    const t = tTrap(7, 3.5, 3, 1.5);
    proveri(180 - 65 === 115, 'δ');
    Z(1, 'U trapezu $ABCD$ ($AB ∥ CD$) je $α = 65°$. Koliki je ugao $δ$?',
      ['$115°$', '$65°$', '$25°$', '$135°$'],
      [K('Uglovi $α$ i $δ$ leže na istom kraku $AD$.', ['k']),
       K('Krak je transverzala dve paralelne prave, pa su ti uglovi suplementni: $δ = 180° − 65° = 115°$.', ['d'])],
      G(t, [{ p: 'ABCD', b: 0 }, { u: 'BAD', o: '65°', b: 1 }, { d: 'AD', b: 3, debljina: 4, k: 1, id: 'k' }, { u: 'ADC', o: '115°', b: 2, k: 2, id: 'd' }], { velicina: 230 }));

    const M = sr(t.A, t.D), N = sr(t.B, t.C);
    proveri((10 + 6) / 2 === 8, 'm = 8');
    Z(1, 'Osnovice trapeza su $AB = 10 cm$ i $CD = 6 cm$. Kolika je srednja linija trapeza?',
      ['$8 cm$', '$16 cm$', '$4 cm$', '$2 cm$'],
      [K('Srednja linija $MN$ spaja sredine krakova i paralelna je osnovicama.', ['mn']),
       K('$m = {a + b|2} = {10 + 6|2} = 8 cm$.')],
      G({ ...t, M, N }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '10 cm' }, { d: 'DC', o: '6 cm' }, { tacka: 'MN', b: 1 }, { d: 'MN', b: 1, k: 1, id: 'mn', crtaj: 1, debljina: 3.5 }], { velicina: 230 }));

    proveri(48 + 105 !== 180 && 180 - 48 === 132 && 180 - 105 === 75, 'uglovi');
    Z(2, 'Dva unutrašnja ugla trapeza su $48°$ i $105°$. Koliki su preostala dva ugla?',
      ['$132°$ i $75°$', '$48°$ i $105°$', '$42°$ i $15°$', '$103,5°$ i $103,5°$'],
      [K('$48° + 105° ≠ 180°$, pa ova dva ugla nisu na istom kraku. Neka je $β = 48°$ i $δ = 105°$.'),
       K('$γ = 180° − β = 180° − 48° = 132°$', ['g']),
       K('$α = 180° − δ = 180° − 105° = 75°$. Provera: $75 + 48 + 132 + 105 = 360$ ✓', ['a'])],
      G(t, [{ p: 'ABCD', b: 0 }, { u: 'CBA', o: '48°', b: 1 }, { u: 'ADC', o: '105°', b: 1 }, { u: 'DCB', o: '132°', b: 2, k: 2, id: 'g' }, { u: 'BAD', o: '75°', b: 2, k: 3, id: 'a' }], { velicina: 230 }));

    const tj = tTrap(7, 3, 3, 2);
    proveri(230 / 2 === 115 && 180 - 115 === 65, '115 i 65');
    Z(2, 'Zbir dva ugla jednakokrakog trapeza na kraćoj osnovici je $230°$. Koliki su svi uglovi trapeza?',
      ['$65°$, $65°$, $115°$, $115°$', '$115°$, $115°$, $115°$, $15°$', '$50°$, $50°$, $130°$, $130°$', '$65°$, $115°$, $65°$, $115°$'],
      [K('U jednakokrakom trapezu uglovi na istoj osnovici su jednaki: $γ = δ = 230° : 2 = 115°$.', ['g']),
       K('Uglovi na kraku su suplementni: $α = β = 180° − 115° = 65°$.', ['a'])],
      G(tj, [{ p: 'ABCD', b: 0 }, { d: 'BC', b: 2, o: 'c' }, { d: 'AD', b: 2, o: 'c' }, { u: 'DCB', o: '115°', b: 1, k: 1, id: 'g' }, { u: 'ADC', o: '115°', b: 1, k: 1, id: 'g' }, { u: 'BAD', o: '65°', b: 3, k: 2, id: 'a' }, { u: 'CBA', o: '65°', b: 3, k: 2, id: 'a' }], { velicina: 230 }));

        proveri(180 / 6 === 30 && 5 * 30 === 150, '30 i 150');
    Z(2, 'Tup ugao pravouglog trapeza je $5$ puta veći od oštrog. Koliki su oštar i tup ugao?',
      ['$30°$ i $150°$', '$36°$ i $180°$', '$15°$ i $75°$', '$45°$ i $135°$'],
      [K('Pravi uglovi su uz krak $AD$. Oštar $β$ i tup $γ$ leže na kosom kraku $BC$, pa je $β + γ = 180°$.', ['bc']),
       K('$β + 5β = 180°$, $6β = 180°$, $β = 30°$.'),
       K('$γ = 5 · 30° = 150°$.', ['g'])],
      G({ A: [0, 0], B: [6, 0], C: [r(6 - 2 * Math.sqrt(3)), 2], D: [0, 2] }, [{ p: 'ABCD', b: 0 }, { pu: 'BAD' }, { pu: 'ADC' }, { d: 'BC', b: 3, debljina: 4, k: 1, id: 'bc' }, { u: 'CBA', o: 'β', b: 1 }, { u: 'DCB', o: '5β', b: 2, id: 'g' }], { velicina: 230 }));
    proveri(Math.abs(Math.atan2(2, 2 * Math.sqrt(3)) * 180 / Math.PI - 30) < 0.1, 'crtež 30°');

    proveri(2 * 9 - 13 === 5, 'b = 5');
    Z(2, 'Duža osnovica trapeza je $13 cm$, a srednja linija $9 cm$. Kolika je kraća osnovica?',
      ['$5 cm$', '$4 cm$', '$11 cm$', '$22 cm$'],
      [K('$m = {a + b|2}$, pa je $a + b = 2m = 18 cm$.', ['mn']),
       K('$b = 18 − 13 = 5 cm$.', ['b'])],
      G({ ...tTrap(6.5, 2.5, 3, 2), M: [1, 1.5], N: [5.5, 1.5] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '13 cm' }, { d: 'MN', b: 1, o: '9 cm', id: 'mn' }, { d: 'DC', o: '?', b: 2, id: 'b' }], { velicina: 230 }));

    const s3 = Math.sqrt(3);
    const t7 = { A: [0, 0], B: [16, 0], C: [13, r(3 * s3)], D: [3, r(3 * s3)], E: [13, 0] };
    proveri(Math.abs(dist(t7.B, t7.C) - 6) < 0.01, 'krak 6');
    Z(2, 'Jednakokraki trapez ima osnovice $16 cm$ i $10 cm$, a oštar ugao $60°$. Koliki je obim trapeza?',
      ['$38 cm$', '$32 cm$', '$44 cm$', '$35 cm$'],
      [K('Visina $CE$ odseca pravougli trougao $EBC$, a $EB = (16 − 10) : 2 = 3 cm$.', ['eb']),
       K('U trouglu $EBC$ je $∠B = 60°$, pa je $∠BCE = 30°$. Kateta naspram $30°$ je pola hipotenuze: $BC = 2 · 3 = 6 cm$.', ['ebc']),
       K('$O = 16 + 10 + 6 + 6 = 38 cm$.')],
      G(t7, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '16 cm' }, { d: 'DC', o: '10 cm' }, { u: 'CBA', o: '60°', b: 1 }, { d: 'CE', b: 3, isp: 1, k: 1, crtaj: 1 }, { pu: 'BEC', k: 1 }, { d: 'EB', b: 3, debljina: 5, o: '3', k: 1, id: 'eb' }, { p: 'EBC', b: 2, gusto: 1, k: 2, id: 'ebc' }, { u: 'ECB', o: '30°', b: 5, k: 2 }], { velicina: 250 }));

    const t8 = { A: [0, 0], B: [20, 0], C: [13, 7], D: [0, 7], E: [13, 0] };
    proveri(20 - 13 === 7, 'h = 7');
    Z(3, 'Pravougli trapez ima osnovice $AB = 20 cm$ i $CD = 13 cm$, a oštar ugao $45°$. Kolika je visina trapeza?',
      ['$7 cm$', '$13 cm$', '$3,5 cm$', '$20 cm$'],
      [K('Visina $CE$ deli trapez na pravougaonik $AECD$ i pravougli trougao $EBC$.', ['ebc']),
       K('$AE = CD = 13 cm$, pa je $EB = 20 − 13 = 7 cm$.', ['eb']),
       K('U trouglu $EBC$ je $∠B = 45°$, pa i $∠BCE = 45°$ – trougao je jednakokraki: $CE = EB = 7 cm$.', ['ce'])],
      G(t8, [{ p: 'ABCD', b: 0 }, { pu: 'BAD' }, { pu: 'ADC' }, { u: 'CBA', o: '45°', b: 1 }, { d: 'AB', o: '20 cm' }, { d: 'DC', o: '13 cm' }, { d: 'CE', b: 3, isp: 1, k: 1, crtaj: 1 }, { p: 'EBC', b: 2, gusto: 1, k: 1, id: 'ebc' }, { d: 'EB', b: 3, debljina: 5, o: '7', k: 2, id: 'eb' }, { d: 'CE', b: 5, debljina: 5, o: '7', k: 3, id: 'ce' }], { velicina: 250 }));

    const t9 = tTrap(14, 8, 5, 3);
    const M9 = sr(t9.A, t9.D), N9 = sr(t9.B, t9.C), E9 = [r(M9[0] + 4), M9[1]], F9 = [r(M9[0] + 7), M9[1]];
    proveri(Math.abs((E9[1]) * (t9.C[0]) - (E9[0]) * (t9.C[1])) < 1e-6, 'E na AC');
    proveri(Math.abs((F9[1] - 0) * (t9.D[0] - 14) - (F9[0] - 14) * (t9.D[1] - 0)) < 1e-6, 'F na BD');
    Z(3, 'Osnovice trapeza su $14 cm$ i $8 cm$. Dijagonale seku srednju liniju $MN$ u tačkama $E$ i $F$. Kolika je duž $EF$?',
      ['$3 cm$', '$4 cm$', '$7 cm$', '$11 cm$'],
      [K('$ME$ je srednja linija trougla $ACD$: $ME = {8|2} = 4 cm$.', ['me']),
       K('$MF$ je srednja linija trougla $ABD$: $MF = {14|2} = 7 cm$.', ['mf']),
       K('$EF = MF − ME = 7 − 4 = 3 cm$ (polovina razlike osnovica).', ['ef'])],
      G({ ...t9, M: M9, N: N9, E: E9, F: F9 }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 4 }, { d: 'BD', b: 4 }, { d: 'MN', b: 1 }, { d: 'AB', o: '14 cm' }, { d: 'DC', o: '8 cm' }, { tacka: 'EF', b: 2 }, { p: 'ACD', b: 5, k: 1, id: 'me' }, { d: 'ME', b: 5, debljina: 5, k: 1, id: 'me' }, { p: 'ABD', b: 3, k: 2, kraj: 3, id: 'mf' }, { d: 'MF', b: 3, debljina: 5, k: 2, id: 'mf' }, { d: 'EF', b: 2, debljina: 6, k: 3, id: 'ef', o: '3 cm' }], { velicina: 250 }));

    const t10 = { A: [0, 0], B: [11, 0], C: [7, r(4 * Math.sqrt(3))], D: [0, r(4 * Math.sqrt(3))], E: [7, 0] };
    proveri(Math.abs(dist(t10.B, t10.C) - 8) < 0.01 && 11 - 4 === 7, 'BC = 8, CD = 7');
    Z(3, 'U pravouglom trapezu $ABCD$ je $AB = 11 cm$, krak $BC = 8 cm$, a visina $CE$ gradi sa krakom $BC$ ugao $∠BCE = 30°$. Kolika je kraća osnovica $CD$?',
      ['$7 cm$', '$4 cm$', '$3 cm$', '$8 cm$'],
      [K('U pravouglom trouglu $EBC$ je kateta $EB$ naspram ugla od $30°$, pa je jednaka polovini hipotenuze: $EB = 8 : 2 = 4 cm$.', ['eb']),
       K('$AECD$ je pravougaonik, pa je $CD = AE = AB − EB = 11 − 4 = 7 cm$.', ['ae'])],
      G(t10, [{ p: 'ABCD', b: 0 }, { pu: 'BAD' }, { d: 'AB', o: '11 cm' }, { d: 'BC', o: '8 cm' }, { d: 'CE', b: 3, isp: 1 }, { pu: 'BEC' }, { u: 'ECB', o: '30°', b: 1 }, { d: 'EB', b: 2, debljina: 5, o: '4', k: 1, id: 'eb' }, { p: 'AECD', b: 2, gusto: 1, k: 2, id: 'ae' }], { velicina: 240 }));
  }

  // ════════════════ 6.9 Konstrukcija trapeza ════════════════
  L('Konstrukcija trapeza');
  {
    const h = Math.sqrt(11.25);
    const t = { A: [0, 0], E: [3, 0], B: [7, 0], C: [4, r(h)], D: [1, r(h)] };
    proveri(Math.abs(dist(t.B, t.C) - 4.5) < 0.01 && Math.abs(dist(t.E, t.C) - 3.5) < 0.01, 'EBC');
    Z(1, 'Konstruiše se trapez sa osnovicama $AB = 7 cm$, $CD = 3 cm$ i kracima $BC = 4,5 cm$, $AD = 3,5 cm$. Na $AB$ je tačka $E$ takva da je $AE = 3 cm$. Kolike su stranice trougla $EBC$?',
      ['$4 cm$, $4,5 cm$, $3,5 cm$', '$7 cm$, $4,5 cm$, $3,5 cm$', '$4 cm$, $4,5 cm$, $3 cm$', '$3 cm$, $4,5 cm$, $3,5 cm$'],
      [K('$EB = 7 − 3 = 4 cm$.', ['eb']),
       K('$AECD$ je paralelogram ($AE = DC$, $AE ∥ DC$), pa je $CE = AD = 3,5 cm$.', ['p']),
       K('Trougao $EBC$ (SSS) se konstruiše prvi, a $D$ je u preseku kružnica $k(C, 3 cm)$ i $k(A; 3,5 cm)$.', ['luk'])],
      G(t, [{ d: 'AB', o: '7 cm', b: 0 }, { tacka: 'E' }, { d: 'EB', b: 3, debljina: 5, k: 1, id: 'eb' }, { p: 'AECD', b: 1, gusto: 1, k: 2, id: 'p' }, { p: 'EBC', b: 2, gusto: 1, k: 2 }, sestar('C', t.C, t.D, { k: 3, id: 'luk' }), sestar('A', t.A, t.D, { k: 3, id: 'luk', b: 5, kasni: 0.9 }), { p: 'ABCD', b: 0, prazno: 1, k: 3, crtaj: 1, kasni: 1.6 }], { bezImena: ['C', 'D'], velicina: 240 }));

    const tp = { A: [0, 0], E: [4, 0], B: [6, 0], C: [4, 3], D: [0, 3] };
    Z(1, 'Pravougli trapez ima osnovice $6 cm$ i $4 cm$ i kraći krak $3 cm$. Kolike su katete pravouglog trougla $EBC$ koji se konstruiše prvi ($CE$ je visina)?',
      ['$2 cm$ i $3 cm$', '$6 cm$ i $3 cm$', '$4 cm$ i $3 cm$', '$2 cm$ i $4 cm$'],
      [K('$AECD$ je pravougaonik: $AE = 4 cm$, pa je $EB = 6 − 4 = 2 cm$.', ['eb']),
       K('Visina $CE$ je jednaka kraćem kraku $AD = 3 cm$. Trougao $EBC$: katete $2 cm$ i $3 cm$ (SUS).', ['ebc'])],
      G(tp, [{ p: 'ABCD', b: 0 }, { pu: 'BAD' }, { d: 'AB', o: '6 cm' }, { d: 'DC', o: '4 cm' }, { d: 'AD', o: '3 cm' }, { d: 'CE', b: 3, isp: 1, k: 1, crtaj: 1 }, { d: 'EB', b: 3, debljina: 5, k: 1, id: 'eb' }, { p: 'EBC', b: 2, gusto: 1, k: 2, id: 'ebc' }, { pu: 'BEC', k: 2 }], { velicina: 220 }));

    const td = { A: [0, 0], B: [5, 0], E: [7, 0], C: [3.2, 2.5], D: [1.2, 2.5] };
    proveri(5 + 2 === 7, 'AE = 7');
    Z(2, 'Trapez ima osnovice $AB = 5 cm$ i $CD = 2 cm$ i dijagonale $AC = 4,5 cm$ i $BD = 4 cm$. Produžimo $AB$ preko $B$ za $BE = CD$. Kolike su stranice trougla $AEC$?',
      ['$7 cm$, $4,5 cm$, $4 cm$', '$5 cm$, $4,5 cm$, $4 cm$', '$7 cm$, $4,5 cm$, $2 cm$', '$3 cm$, $4,5 cm$, $4 cm$'],
      [K('$BECD$ je paralelogram ($BE = DC$, $BE ∥ DC$), pa je $CE = BD = 4 cm$.', ['ce']),
       K('$AE = AB + BE = 5 + 2 = 7 cm$, a $AC = 4,5 cm$.', ['ae']),
       K('Trougao $AEC$ (SSS): $7 cm$, $4,5 cm$ i $4 cm$; zatim $D$ kao četvrto teme paralelograma $BECD$.')],
      R(G(td, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1 }, { d: 'BD', b: 2 }, { d: 'BE', b: 3, isp: 1 }, { d: 'BD', b: 2, pomeri: [2, 0], k: 1, id: 'ce' }, { d: 'AE', b: 3, debljina: 5, k: 2, id: 'ae' }, { p: 'AEC', b: 1, gusto: 1, k: 3 }], { velicina: 240 })));

    proveri(!(2 + 3 > 9 - 4), 'ne postoji');
    Z(2, 'Da li postoji trapez sa osnovicama $9 cm$ i $4 cm$ i kracima $2 cm$ i $3 cm$?',
      ['ne – trougao $5$, $2$, $3 cm$ ne postoji', 'da – postoji tačno jedan', 'da – ima ih beskonačno mnogo', 'ne – kraci moraju biti jednaki'],
      [K('Paralela sa krakom kroz $C$ odseca trougao $EBC$ sa stranicama $a − b = 5 cm$, $2 cm$ i $3 cm$.'),
       K('Nejednakost trougla: $2 + 3 = 5$ nije veće od $5$ – lukovi se samo dodiruju na duži $EB$.', ['l']),
       K('Trougla nema, pa nema ni trapeza.')],
      G({ E: [0, 0], B: [5, 0] }, [{ d: 'EB', o: '5 cm', b: 0 }, { l: 'E', r: 3, od: 0, do: 120, b: 1, crtaj: 1, k: 2, id: 'l' }, { l: 'B', r: 2, od: 60, do: 180, b: 2, crtaj: 1, kasni: 0.8, k: 2, id: 'l' }, { tacka: 'EB' }], { velicina: 220 }));

    const s3 = Math.sqrt(3);
    const tj = { A: [0, 0], B: [9, 0], C: [7.5, r(1.5 * s3)], D: [1.5, r(1.5 * s3)], E: [6, 0] };
    proveri(Math.abs(dist(tj.B, tj.C) - 3) < 0.01 && 9 + 6 + 3 + 3 === 21, 'obim 21');
    Z(2, 'Trapez ima osnovice $9 cm$ i $6 cm$, a oba ugla na dužoj osnovici su po $60°$. Koliki je obim trapeza?',
      ['$21 cm$', '$18 cm$', '$27 cm$', '$24 cm$'],
      [K('Povucimo $CE ∥ AD$; $AECD$ je paralelogram, pa je $EB = 9 − 6 = 3 cm$.', ['eb']),
       K('Trougao $EBC$ ima uglove $60°$ kod $E$ i kod $B$ – jednakostraničan je: $BC = CE = 3 cm$, a $AD = CE = 3 cm$.', ['ebc']),
       K('$O = 9 + 6 + 3 + 3 = 21 cm$.')],
      G(tj, [{ p: 'ABCD', b: 0 }, { u: 'BAD', o: '60°', b: 1 }, { u: 'CBA', o: '60°', b: 1 }, { d: 'AB', o: '9 cm' }, { d: 'DC', o: '6 cm' }, { d: 'EC', b: 3, isp: 1, k: 1, crtaj: 1 }, { d: 'EB', b: 3, debljina: 5, k: 1, id: 'eb' }, { p: 'EBC', b: 2, gusto: 1, k: 2, id: 'ebc' }], { velicina: 240 }));

    const tz = { A: [0, 0], B: [7, 0], V: [3.5, r(3.5 * s3)], D: [1.5, r(1.5 * s3)], C: [5.5, r(1.5 * s3)] };
    proveri(7 + 4 + 3 + 3 === 17, 'obim 17');
    Z(3, 'Produženi kraci jednakokrakog trapeza $MNPQ$ seku se pod uglom od $60°$. Osnovice su $7 cm$ i $4 cm$. Koliki je obim trapeza?',
      ['$17 cm$', '$22 cm$', '$14 cm$', '$19 cm$'],
      [K('Kraci i duža osnovica čine jednakokraki trougao sa uglom $60°$ na vrhu – uglovi na osnovici su $(180° − 60°) : 2 = 60°$, pa je trougao jednakostraničan, stranice $7 cm$.', ['v']),
       K('Mali trougao iznad kraće osnovice je takođe jednakostraničan, stranice $4 cm$.', ['m']),
       K('Krak je $7 − 4 = 3 cm$, pa je $O = 7 + 4 + 3 + 3 = 17 cm$.', ['k'])],
      G({ M: tz.A, N: tz.B, P: tz.C, Q: tz.D, V: tz.V }, [{ p: 'MNPQ', b: 0 }, { d: 'QV', b: 4, isp: 1 }, { d: 'PV', b: 4, isp: 1 }, { u: 'QVP', o: '60°', b: 1 }, { d: 'MN', o: '7 cm' }, { d: 'QP', o: '4 cm' }, { p: 'MNV', b: 1, k: 1, id: 'v' }, { p: 'QPV', b: 2, gusto: 1, k: 2, id: 'm' }, { d: 'MQ', b: 3, debljina: 5, o: '3', k: 3, id: 'k' }, { d: 'NP', b: 3, debljina: 5, o: '3', k: 3, id: 'k' }], { bezImena: ['V'], velicina: 220 }));

    const ta = { A: [0, 0], B: [6, 0], C: [r(6 - 2.598), 2.598], D: [1.5, 2.598] };
    proveri(180 - 60 === 120 && 180 - 45 === 135, 'δ = 120, γ = 135');
    Z(2, 'Konstruiše se trapez $ABCD$ ($AB ∥ CD$) sa $AB = 6 cm$, $AD = 3 cm$, $α = 60°$ i $β = 45°$. Koliki su uglovi $γ$ i $δ$?',
      ['$γ = 135°$, $δ = 120°$', '$γ = 120°$, $δ = 135°$', '$γ = 45°$, $δ = 60°$', '$γ = 60°$, $δ = 45°$'],
      [K('Konstrukcija: $AB$, uglovi kod $A$ i $B$, na kraku iz $A$ tačka $D$ ($AD = 3 cm$), pa paralela sa $AB$ kroz $D$ seče drugi krak u $C$.', ['par']),
       K('Uglovi na kraku su suplementni: $δ = 180° − 60° = 120°$, $γ = 180° − 45° = 135°$.', ['u'])],
      G({ ...ta, p1: [0, 2.598], p2: [7, 2.598] }, [{ d: 'AB', o: '6 cm', b: 0 }, { d: 'AD', o: '3 cm', b: 0 }, { u: 'BAD', o: '60°', b: 1 }, { u: 'CBA', o: '45°', b: 1 }, { d: 'BC', b: 0 }, { d: 'p1p2', b: 3, isp: 1, k: 1, crtaj: 1, id: 'par' }, { d: 'DC', b: 0, k: 1 }, { u: 'ADC', o: '120°', b: 2, k: 2, id: 'u' }, { u: 'DCB', o: '135°', b: 2, k: 2, id: 'u' }], { bezImena: ['C'], velicina: 240 }));
    proveri(Math.abs(dist(ta.A, ta.D) - 3) < 0.01, 'AD = 3');

    const tv = { A: [0, 0], E: [r(2.5 * s3), 0], D: [r(2.5 * s3), 2.5], B: [11, 0], C: [r(11 - 2.5 * s3), 2.5] };
    proveri(Math.abs(dist(tv.A, tv.D) - 5) < 0.01, 'AD = 5');
    Z(3, 'Trapez ima osnovicu $AB = 11 cm$, krak $AD = 5 cm$ i ugao $α = 30°$. Kolika je visina trapeza?',
      ['$2,5 cm$', '$5 cm$', '$10 cm$', '$5,5 cm$'],
      [K('Visina $DE$ iz temena $D$ odseca pravougli trougao $AED$ sa uglom $30°$ kod $A$.', ['aed']),
       K('Kateta $DE$ je naspram ugla od $30°$, pa je jednaka polovini hipotenuze $AD$: $DE = 5 : 2 = 2,5 cm$.', ['de'])],
      G(tv, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '11 cm' }, { d: 'AD', o: '5 cm' }, { u: 'BAD', o: '30°', b: 1 }, { d: 'DE', b: 3, isp: 1, k: 1, crtaj: 1 }, { pu: 'DEA', k: 1 }, { p: 'AED', b: 2, gusto: 1, k: 1, id: 'aed' }, { d: 'DE', b: 5, debljina: 5, o: '2,5', k: 2, id: 'de' }], { velicina: 240 }));

    const tq = tTrap(7, 3, 3, 2);
    proveri(180 - 105 === 75, 'α = 75');
    Z(1, 'Jednakokraki trapez ima tup ugao $δ = 105°$. Koliki su uglovi $α$ i $β$ na dužoj osnovici?',
      ['$α = β = 75°$', '$α = β = 105°$', '$α = 75°$, $β = 105°$', '$α = β = 52,5°$'],
      [K('$α$ i $δ$ su na istom kraku: $α = 180° − 105° = 75°$.', ['a']),
       K('U jednakokrakom trapezu su uglovi na istoj osnovici jednaki: $β = α = 75°$.', ['b'])],
      G(tq, [{ p: 'ABCD', b: 0 }, { u: 'ADC', o: '105°', b: 1 }, { u: 'BAD', o: '75°', b: 2, k: 1, id: 'a' }, { u: 'CBA', o: '75°', b: 2, k: 2, id: 'b' }], { velicina: 230 }));

    const tk = { A: [0, 0], B: [6, 0], C: [5, 3], D: [1, 3] };
    Z(2, 'Date su tačke $A(0, 0)$, $B(6, 0)$ i $C(5, 3)$. Tačka $D$ je takva da je $ABCD$ trapez sa osnovicom $CD = 4$ ($CD ∥ AB$). Koje su koordinate tačke $D$?',
      ['$D(1, 3)$', '$D(9, 3)$', '$D(1, 0)$', '$D(0, 3)$'],
      [K('$CD ∥ AB$, a $AB$ je na $x$-osi, pa $D$ ima istu $y$-koordinatu kao $C$: $3$.', ['p']),
       K('Od $C$ idemo $4$ ulevo (prema $A$, da bi temena išla redom): $D(5 − 4, 3) = D(1, 3)$.', ['d'])],
      G({ ...tk, p1: [-1, 3], p2: [7, 3] }, [{ mreza: [-1, 7, -1, 4] }, { d: 'AB', b: 0 }, { d: 'BC', b: 0 }, { tacka: 'ABC', b: 1 }, { d: 'p1p2', b: 3, isp: 1, k: 1, crtaj: 1, id: 'p' }, { d: 'CD', b: 2, debljina: 4, k: 2, crtaj: 1, id: 'd' }, { d: 'DA', b: 0, k: 2 }, { tacka: 'D', b: 1, k: 2 }], { bezImena: ['p1', 'p2'], velicina: 240 }));
  }

  // ════════════════ 6.10 Deltoid ════════════════
  L('Deltoid');
  {
    const ug = (beta, delta, s = 3) => tDelt(s, s / Math.tan(rad(beta / 2)), s / Math.tan(rad(delta / 2)));
    const t1 = ug(40, 130);
    proveri((360 - 40 - 130) / 2 === 95, '95°');
    Z(1, 'Uglovi deltoida između jednakih stranica su $40°$ i $130°$. Koliki su preostala dva ugla?',
      ['po $95°$', 'po $85°$', '$40°$ i $130°$', 'po $190°$'],
      [K('Preostala dva ugla (između nejednakih stranica) su jednaka: $α = γ$.', ['ag']),
       K('$2α + 40° + 130° = 360°$, $2α = 190°$, $α = 95°$.')],
      G(t1, [{ p: 'ABCD', b: 0 }, { u: 'ABC', o: '40°', b: 1, r: 30 }, { u: 'CDA', o: '130°', b: 1 }, { u: 'DAB', o: 'α', b: 2, k: 1, id: 'ag' }, { u: 'BCD', o: 'α', b: 2, k: 1, id: 'ag' }], { velicina: 220 }));

    Z(1, 'U koordinatnoj ravni su tačke $A(−2, 0)$, $B(0, −3)$ i $C(5, 0)$. Koje su koordinate tačke $D$, ako je $ABCD$ deltoid sa osom simetrije $AC$?',
      ['$D(0, 3)$', '$D(0, −3)$', '$D(3, 0)$', '$D(5, 3)$'],
      [K('Osa deltoida je dijagonala $AC$ – leži na $x$-osi.', ['os']),
       K('$D$ je odraz tačke $B$ preko $x$-ose: $D(0, 3)$. Tada je $AB = AD$ i $CB = CD$.', ['od'])],
      G({ A: [-2, 0], B: [0, -3], C: [5, 0], D: [0, 3] }, [{ mreza: [-3, 6, -4, 4] }, { d: 'AB', b: 0 }, { d: 'BC', b: 0 }, { d: 'AC', b: 3, isp: 1, k: 1, id: 'os' }, { d: 'AB', b: 2, odrazi: 'AC', k: 2, id: 'od' }, { d: 'BC', b: 2, odrazi: 'AC', k: 2, id: 'od' }, { tacka: 'ABC', b: 1 }, { tacka: 'D', b: 1, k: 2 }], { bezImena: ['D'], velicina: 240 }));

    const t3 = { A: [0, 0], B: [3, -2], C: [7, 0], D: [3, 2] };
    proveri(dist(t3.A, t3.B) === dist(t3.A, t3.D) && dist(t3.C, t3.B) === dist(t3.C, t3.D), 'deltoid');
    Z(2, 'Date su tačke $A(0, 0)$, $B(3, −2)$ i $C(7, 0)$. Koje su koordinate tačke $D$, ako je $ABCD$ deltoid?',
      ['$D(3, 2)$', '$D(4, 2)$', '$D(3, −2)$', '$D(7, 2)$'],
      [K('$A$ i $C$ su na $x$-osi, a $B$ nije na simetrali duži $AC$ (to je $x = 3,5$). Zato $AC$ mora biti osa: $AB = AD$, $CB = CD$.', ['os']),
       K('$D$ je odraz tačke $B$ preko $x$-ose: $D(3, 2)$.', ['d'])],
      G(t3, [{ mreza: [-1, 8, -3, 3] }, { d: 'AB', b: 0 }, { d: 'BC', b: 0 }, { tacka: 'ABC', b: 1 }, { d: 'AC', b: 3, isp: 1, k: 1, id: 'os' }, { d: 'AB', b: 2, odrazi: 'AC', k: 2, id: 'd' }, { d: 'BC', b: 2, odrazi: 'AC', k: 2, id: 'd' }, { tacka: 'D', b: 1, k: 2 }], { bezImena: ['D'], velicina: 240 }));

    const t4 = tDelt(3, 4, 7.416);
    proveri(dist(t4.A, t4.B) === 5 && Math.abs(dist(t4.A, t4.D) - 8) < 0.01 && 2 * (5 + 8) === 26, 'obim 26');
    Z(1, 'U deltoidu $ABCD$ je $AB = BC = 5 cm$ i $CD = DA = 8 cm$. Koliki je obim deltoida?',
      ['$26 cm$', '$13 cm$', '$40 cm$', '$21 cm$'],
      [K('Deltoid ima dva para jednakih susednih stranica: $2 · 5$ i $2 · 8$.', ['s']),
       K('$O = 2 · (5 + 8) = 26 cm$.')],
      G(t4, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '5 cm', b: 1, id: 's' }, { d: 'BC', b: 1, id: 's' }, { d: 'DA', o: '8 cm', b: 2, id: 's' }, { d: 'CD', b: 2, id: 's' }], { velicina: 200 }));

    proveri(30 / 2 - 6 === 9, 'druga stranica 9');
    Z(2, 'Obim deltoida je $30 cm$, a jedna njegova stranica je $6 cm$. Kolike su ostale stranice?',
      ['$6 cm$, $9 cm$ i $9 cm$', '$8 cm$, $8 cm$ i $8 cm$', '$6 cm$, $6 cm$ i $12 cm$', '$9 cm$, $9 cm$ i $12 cm$'],
      [K('Uz stranicu od $6 cm$ postoji još jedna iste dužine: $O = 2 · (6 + x)$.', ['a']),
       K('$6 + x = 15$, pa je $x = 9 cm$. Stranice su $6$, $6$, $9$ i $9 cm$.', ['b'])],
      G(tDelt(3, 5.196, 8.485), [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '6 cm', b: 1 }, { d: 'BC', b: 1, k: 1, id: 'a', o: '6' }, { d: 'CD', b: 2, k: 2, id: 'b', o: '9' }, { d: 'DA', b: 2, k: 2, id: 'b', o: '9' }], { velicina: 200 }));
    proveri(Math.abs(Math.hypot(3, 5.196) - 6) < 0.01 && Math.abs(Math.hypot(3, 8.485) - 9) < 0.01, 'crtež 6 i 9');

    const t6 = ug(80, 60);
    proveri((360 - 80 - 60) / 2 === 110, '110');
    Z(2, 'U deltoidu $ABCD$ ($AB = BC$, $CD = DA$) je $β = 80°$ i $δ = 60°$. Koliki je ugao $α$?',
      ['$110°$', '$220°$', '$80°$', '$100°$'],
      [K('$α$ i $γ$ su uglovi između nejednakih stranica, pa su jednaki.', ['ag']),
       K('$2α = 360° − 80° − 60° = 220°$, $α = 110°$.')],
      G(t6, [{ p: 'ABCD', b: 0 }, { u: 'ABC', o: '80°', b: 1 }, { u: 'CDA', o: '60°', b: 1 }, { u: 'DAB', o: 'α', b: 2, id: 'ag' }, { u: 'BCD', o: 'α', b: 2, k: 1, id: 'ag' }], { velicina: 220 }));

    const t7 = ug(100, 60);
    proveri(360 - 3 * 100 === 60, '60');
    Z(3, 'Tri unutrašnja ugla deltoida su jednaka i iznose po $100°$. Koliki je četvrti ugao?',
      ['$60°$', '$100°$', '$80°$', '$160°$'],
      [K('Zbir uglova svakog četvorougla je $360°$.'),
       K('Četvrti ugao: $360° − 3 · 100° = 60°$. (Dva od tri jednaka ugla su $α$ i $γ$, a treći je $β$.)', ['d'])],
      G(t7, [{ p: 'ABCD', b: 0 }, { u: 'DAB', o: '100°', b: 1 }, { u: 'BCD', o: '100°', b: 1 }, { u: 'ABC', o: '100°', b: 1 }, { u: 'CDA', o: '60°', b: 2, k: 2, id: 'd' }], { velicina: 220 }));

    proveri(110 + 110 + 120 + 20 === 360 && 120 + 120 + 110 + 10 === 360 && 110 + 120 + 2 * 65 === 360, 'tri slučaja');
    const dl = (beta, delta, y0, b, k) => {
      const p = 1 / Math.tan(rad(beta / 2)), q = 1 / Math.tan(rad(delta / 2));
      return { lin: [[0, y0], [r(p), r(y0 + 1)], [r(p + q), y0], [r(p), r(y0 - 1)]], zatv: 1, b, k, id: 'd' + k };
    };
    Z(3, 'Dva ugla deltoida su $110°$ i $120°$. Koliko ima različitih mogućnosti za preostala dva ugla?',
      ['tri', 'jednu', 'dve', 'četiri'],
      [K('Jednaki su uglovi $α = γ$. Ako je $α = γ = 110°$, četvrti ugao je $360° − 220° − 120° = 20°$.', ['d1']),
       K('Ako je $α = γ = 120°$, četvrti je $360° − 240° − 110° = 10°$.', ['d2']),
       K('Ako su $110°$ i $120°$ baš $β$ i $δ$, onda je $α = γ = (360° − 230°) : 2 = 65°$. Ukupno tri mogućnosti.', ['d3'])],
R(G({ o: [0, 0] }, [dl(120, 20, 0, 1, 1), dl(110, 10, -3, 2, 2), dl(110, 120, -6, 5, 3), { tx: '110°, 110°, 120°, 20°', at: [5, 1.4], k: 1 }, { tx: '120°, 120°, 110°, 10°', at: [5, -1.6], k: 2 }, { tx: '110°, 120°, 65°, 65°', at: [5, -4.6], k: 3 }], { velicina: 260 })));

    const t9 = tDelt(3, 1.8, 5);
    proveri(Math.abs(Math.atan(1.8 / 3) + Math.atan(5 / 3) - Math.PI / 2) < 1e-9, 'α = 90°');
    proveri(360 - 90 - 90 - 50 === 130, 'δ = 130');
    Z(2, 'U deltoidu su uglovi $α$ i $γ$ (između nejednakih stranica) pravi, a $β = 50°$. Koliki je ugao $δ$?',
      ['$130°$', '$50°$', '$90°$', '$140°$'],
      [K('$α = γ = 90°$, zbir svih uglova je $360°$.', ['p']),
       K('$δ = 360° − 90° − 90° − 50° = 130°$.')],
      G(ug(50, 130), [{ p: 'ABCD', b: 0 }, { pu: 'DAB', id: 'p' }, { pu: 'BCD', id: 'p' }, { u: 'ABC', o: '50°', b: 1 }, { u: 'CDA', o: '?', b: 2 }], { velicina: 220 }));

    // ∠ABO = 25°, ∠ADO = 50° → α = 65° + 40° = 105°
    const t10 = ug(50, 100, 4);
    proveri((90 - 25) + (90 - 50) === 105, 'α = 105');
    Z(3, 'U deltoidu $ABCD$ ($AB = BC$, $CD = DA$) dijagonale se seku u tački $O$. Ako je $∠ABO = 25°$ i $∠ADO = 50°$, koliki je ugao $α = ∠DAB$?',
      ['$105°$', '$75°$', '$115°$', '$90°$'],
      [K('Dijagonale deltoida su normalne, pa su trouglovi $ABO$ i $ADO$ pravougli (prav ugao kod $O$).', ['pu']),
       K('$∠BAO = 90° − 25° = 65°$ i $∠DAO = 90° − 50° = 40°$.', ['u']),
       K('$α = 65° + 40° = 105°$.')],
      G({ ...t10, O: [0, 0] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 4 }, { d: 'BD', b: 4 }, { u: 'ABO', o: '25°', b: 1, r: 34 }, { u: 'ODA', o: '50°', b: 1, r: 30 }, { pu: 'AOB', k: 1, id: 'pu' }, { u: 'BAO', o: '65°', b: 2, k: 2, id: 'u', r: 40 }, { u: 'OAD', o: '40°', b: 5, k: 2, id: 'u', r: 16 }], { velicina: 300 }));
  }
};
