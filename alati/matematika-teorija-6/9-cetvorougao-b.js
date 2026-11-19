// Lekcije 38–42: konstrukcija paralelograma, operacije sa vektorima, trapez, konstrukcija trapeza, deltoid.
// Pitanja su sopstvenim rečima, po gradivu Matematike 6 (Arhiknjiga); crteži su medij „geo“.
// Konstrukcije se „iscrtavaju“ (crtaj + kasni), vektori se nadovezuju pomeranjem (pomeri).
module.exports = ({ L, Q, U, S, G, r, rad, proveri }) => {
  const sr = (P, Q2) => [r((P[0] + Q2[0]) / 2), r((P[1] + Q2[1]) / 2)];
  const plus = (P, v) => [r(P[0] + v[0]), r(P[1] + v[1])];
  const dist = (P, Q2) => Math.hypot(P[0] - Q2[0], P[1] - Q2[1]);
  const ugaoTacke = (C, P) => (Math.atan2(P[1] - C[1], P[0] - C[0]) * 180) / Math.PI;
  // luk šestara oko tačke P kroz tačku X (±raspon stepeni), iscrtava se
  const sestar = (ime, C, X, { raspon = 18, b = 3, kasni = 0.3, k, id } = {}) => {
    const u = ugaoTacke(C, X);
    return { l: ime, r: r(dist(C, X)), od: r(u - raspon), do: r(u + raspon), b, crtaj: 1, kasni, trajanje: 0.7, ...(k !== undefined ? { k } : {}), ...(id ? { id } : {}) };
  };

  // ── likovi ──
  // paralelogram ABCD: AB = a, AD = b, ugao kod A
  const tPar = (a, b, ug) => {
    const D = [r(b * Math.cos(rad(ug))), r(b * Math.sin(rad(ug)))];
    return { A: [0, 0], B: [a, 0], C: plus(D, [a, 0]), D };
  };
  // trapez ABCD: AB = a (donja osnovica), CD = b, visina h, D je pomeren za x udesno od A
  const tTrap = (a, b, h, x) => ({ A: [0, 0], B: [a, 0], C: [r(x + b), h], D: [r(x), h] });
  // deltoid ABCD sa osom BD: AB = BC, CD = DA; A(−s, 0), C(s, 0), B(0, −p), D(0, q)
  const tDelt = (s, p, q) => ({ A: [-s, 0], B: [0, -p], C: [s, 0], D: [0, q] });

  // rešetka (karirani papir) [x0, x1] × [y0, y1]
  const resetka = (x0, x1, y0, y1) => {
    const e = [];
    for (let x = x0; x <= x1; x++) e.push({ lin: [[x, y0], [x, y1]], b: 4, debljina: 0.5 });
    for (let y = y0; y <= y1; y++) e.push({ lin: [[x0, y], [x1, y]], b: 4, debljina: 0.5 });
    return e;
  };
  // vektor kao strelica od tačke P za v, sa natpisom
  const vek = (P, v, { b = 1, o, oAt, ...dod } = {}) => ({
    lin: [P, plus(P, v)], str: 1, b, debljina: 3.2,
    ...(o ? { o, oAt: oAt || [r(P[0] + v[0] / 2 - Math.sign(v[1] || 0.001) * 0.35), r(P[1] + v[1] / 2 + Math.sign(v[0] || -0.001) * 0.35)] } : {}), ...dod,
  });
  const papirG = (x0, x1, y0, y1, e, vel = 240) => G({ o: [x0, y0] }, [resetka(x0, x1, y0, y1), e], { velicina: vel });

  // ════════════════ 38. Konstrukcija paralelograma ════════════════
  L('Konstrukcija paralelograma');
  {
    const t = tPar(5, 3, 55);
    const zad = [{ p: 'ABCD', b: 0 }, { d: 'AB', o: 'a' }, { d: 'AD', o: 'b' }, { u: 'DAB', o: 'α', b: 1 }];
    Q(1, 'Koliko je međusobno nezavisnih elemenata (stranica, dijagonala, uglova) potrebno za konstrukciju paralelograma?',
      ['tri', 'dva', 'četiri', 'jedan'],
      'Dijagonala deli paralelogram na dva podudarna trougla, pa se konstrukcija svodi na trougao – a za trougao trebaju tri elementa.', 'element',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }], { velicina: 220 }), medijiOdgovora: G(t, zad, { velicina: 220 }) });
    Q(1, 'Na konstrukciju koje figure se najčešće svodi konstrukcija paralelograma?',
      ['trougla', 'kruga', 'kvadrata', 'trapeza'],
      'Dijagonala $BD$ deli paralelogram na trouglove $ABD$ i $CDB$, koji su podudarni. Kad se konstruiše jedan, četvrto teme se lako dodaje.', 'trougao',
      { mediji: G(t, [{ p: 'ABCD', b: 4, prazno: 1 }, { p: 'ABD', b: 1, gusto: 1 }, { p: 'CDB', b: 2 }, { d: 'BD', b: 3, crtaj: 1, kasni: 0.3 }], { velicina: 220 }) });
    Q(2, 'Paralelogram je zadat stranicama $AB$, $AD$ i uglom $α$ između njih. Koji trougao se prvo konstruiše?',
      ['$ABD$, po stavu SUS', '$ABC$, po stavu SSS', '$ABD$, po stavu SSS', '$ACD$, po stavu USU'],
      'Poznate su dve stranice i ugao između njih – to je tačno stav SUS za trougao $ABD$. Zatim teme $C$ dobijamo pomoću dve kružnice.', 'stranica',
      { mediji: G(t, zad, { velicina: 220 }), medijiOdgovora: G(t, [...zad, { p: 'ABD', b: 1, gusto: 1 }, { d: 'BD', b: 3, crtaj: 1 }], { velicina: 220 }) });
    // teme C u preseku kružnica
    const tc = { ...t };
    Q(2, 'Konstruisana su temena $A$, $B$ i $D$ paralelograma $ABCD$. Gde se nalazi teme $C$?',
      ['u preseku kružnica $k(B, AD)$ i $k(D, AB)$', 'u preseku kružnica $k(A, AB)$ i $k(D, AD)$', 'na sredini duži $BD$', 'u preseku kružnica $k(B, AB)$ i $k(D, AD)$'],
      'Naspramne stranice paralelograma su jednake: $BC = AD$ i $DC = AB$. Zato je $C$ na rastojanju $AD$ od $B$ i na rastojanju $AB$ od $D$.', 'kružnica',
      { mediji: G(tc, [{ d: 'AB', b: 0 }, { d: 'AD', b: 0 }, { tacka: 'ABD' }], { bezImena: ['C'], velicina: 220 }),
        medijiOdgovora: G(tc, [{ d: 'AB', b: 0 }, { d: 'AD', b: 0 }, sestar('B', t.B, t.C, { b: 2 }), sestar('D', t.D, t.C, { b: 5, kasni: 1.1 }), { d: 'BC', b: 1, crtaj: 1, kasni: 1.9 }, { d: 'DC', b: 1, crtaj: 1, kasni: 2.3 }, { tacka: 'ABDC' }], { velicina: 220 }) });
    Q(1, 'Zašto podaci „$AB = 6 cm$ i $CD = 6 cm$“ ne mogu biti dva od tri podatka za konstrukciju paralelograma?',
      ['naspramne stranice su uvek jednake', 'stranice paralelograma su sve jednake', 'te dve stranice nisu paralelne', 'dužina $6 cm$ je prevelika'],
      'Drugi podatak ne donosi ništa novo: iz $AB = 6 cm$ već znamo i $CD = 6 cm$. Podaci za konstrukciju moraju biti nezavisni.', 'podatak',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '6 cm', b: 1 }, { d: 'CD', o: '6 cm', b: 1 }], { velicina: 220 }) });
    // pravougaonik i romb – dva elementa
    const tp = { A: [0, 0], B: [5, 0], C: [5, 3], D: [0, 3] };
    Q(1, 'Koliko je elemenata dovoljno za konstrukciju pravougaonika?',
      ['dva', 'tri', 'jedan', 'četiri'],
      'Uglovi pravougaonika su već poznati (svi su pravi), pa su dovoljne npr. dve susedne stranice ili stranica i dijagonala.', 'dovoljno',
      { mediji: G(tp, [{ p: 'ABCD', b: 0 }, { pu: 'DAB' }, { pu: 'ABC' }, { pu: 'BCD' }, { pu: 'CDA' }], { velicina: 200 }),
        medijiOdgovora: G(tp, [{ p: 'ABCD', b: 0 }, { pu: 'DAB' }, { d: 'AB', o: 'a', b: 1 }, { d: 'BC', o: 'b', b: 2 }], { velicina: 200 }) });
    const tk = { A: [-3, 0], C: [3, 0], B: [0, -3], D: [0, 3], O: [0, 0] };
    Q(1, 'Kvadrat se konstruiše iz dijagonale $AC$. Šta se crta posle nje?',
      ['simetrala duži $AC$', 'simetrala ugla $A$', 'kružnica sa centrom $A$', 'prava paralelna sa $AC$'],
      'Dijagonale kvadrata su jednake, normalne i polove se. Na simetrali duži $AC$ temena $B$ i $D$ su na istom rastojanju od $O$ kao $A$ i $C$.', 'kvadrat',
      { mediji: G(tk, [{ d: 'AC', b: 1 }, { tacka: 'AC' }], { bezImena: ['O', 'B', 'D'], velicina: 200 }),
        medijiOdgovora: G({ ...tk, s1: [0, -4], s2: [0, 4] }, [{ d: 'AC', b: 1 }, sestar('A', tk.A, [0, 3.5], { raspon: 14, b: 4 }), sestar('A', tk.A, [0, -3.5], { raspon: 14, b: 4 }), sestar('C', tk.C, [0, 3.5], { raspon: 14, b: 4, kasni: 0.9 }), sestar('C', tk.C, [0, -3.5], { raspon: 14, b: 4, kasni: 0.9 }), { d: 's1s2', b: 3, isp: 1 }, { kr: 'O', r: 3, b: 2, crtaj: 1, kasni: 1.8 }, { p: 'ABCD', b: 0, prazno: 1, crtaj: 1, kasni: 2.6 }, { tacka: 'ABCD' }], { bezImena: ['O'], velicina: 200 }) });
    // romb: dijagonala je simetrala ugla
    const tr = { A: [0, 0], C: [8, 0], B: [4, -2.2], D: [4, 2.2] };
    Q(2, 'Romb je zadat dužom dijagonalom $AC$ i uglom kod $A$. Zašto teme $C$ tražimo na simetrali tog ugla?',
      ['dijagonala romba polovi njegov ugao', 'dijagonale romba su jednake', 'svi uglovi romba su jednaki', 'teme $C$ je centar romba'],
      'U rombu je dijagonala ujedno i simetrala ugla. Kada nađemo $C$, simetrala duži $AC$ seče krake ugla u temenima $B$ i $D$.', 'romb',
      { mediji: G({ ...tr, x: [9, -4.95], y: [9, 4.95] }, [{ d: 'Ax', b: 0 }, { d: 'Ay', b: 0 }, { u: 'xAy', o: 'α', b: 1, r: 34 }, { d: 'AC', b: 2, isp: 1 }, { tacka: 'AC' }], { bezImena: ['B', 'D'], velicina: 230 }),
        medijiOdgovora: G({ ...tr, x: [9, -4.95], y: [9, 4.95], s1: [4, -3.2], s2: [4, 3.2] }, [{ d: 'Ax', b: 0 }, { d: 'Ay', b: 0 }, { u: 'CAD', b: 1, r: 40 }, { u: 'BAC', b: 5, r: 40 }, { d: 'AC', b: 2 }, { d: 's1s2', b: 3, isp: 1, crtaj: 1 }, { p: 'ABCD', b: 0, crtaj: 1, kasni: 1.2 }, { tacka: 'ABCD' }], { velicina: 230 }) });
    proveri(Math.abs(Math.atan2(2.2, 4) - Math.atan2(4.95, 9)) < 0.01, 'krak kroz D');
    // romb iz dijagonala
    const td = { A: [-3.5, 0], C: [3.5, 0], B: [0, -2], D: [0, 2], O: [0, 0] };
    Q(2, 'Romb je zadat dijagonalama $7 cm$ i $4 cm$. Kako se dobijaju njegova temena?',
      ['dijagonale se crtaju normalno, tako da se polove', 'dijagonale se crtaju jedna u produžetku druge', 'dijagonale se crtaju tako da imaju zajednički kraj', 'dijagonale se crtaju paralelno'],
      'Dijagonale romba se seku pod pravim uglom i polove se. Krajevi tako nacrtanih dijagonala su temena romba – sve četiri stranice ispadnu jednake.', 'dijagonala',
      { mediji: G(td, [{ d: 'AC', b: 1, o: '7 cm', na: 0.22 }, { d: 'BD', b: 2, o: '4 cm', na: 0.85 }], { bezImena: ['O', 'A', 'B', 'C', 'D'], velicina: 200 }),
        medijiOdgovora: G(td, [{ d: 'AC', b: 1, crtaj: 1 }, { d: 'BD', b: 2, crtaj: 1, kasni: 0.9 }, { pu: 'COD' }, { p: 'ABCD', b: 0, crtaj: 1, kasni: 1.8 }], { bezImena: ['O'], velicina: 200 }) });
    // pravougaonik i opisana kružnica
    const to = { A: [0, 0], B: [8, 0], C: [8, 6], D: [0, 6], O: [4, 3] };
    proveri(dist(to.O, to.A) === 5 && dist(to.A, to.C) === 10, 'dijagonala 10');
    Q(2, 'Oko pravougaonika je opisana kružnica poluprečnika $5 cm$. Kolika je dijagonala pravougaonika?',
      ['$10 cm$', '$5 cm$', '$2,5 cm$', '$15 cm$'],
      'Dijagonale pravougaonika su jednake i polove se, pa je presek dijagonala $O$ jednako udaljen od sva četiri temena – to je centar opisane kružnice. Dijagonala je prečnik.', 'prečnik',
      { mediji: G(to, [{ p: 'ABCD', b: 0 }, { kr: 'O', r: 5, b: 2 }, { tacka: 'O' }, { d: 'OB', o: '5 cm', b: 3 }], { velicina: 210 }),
        medijiOdgovora: G(to, [{ p: 'ABCD', b: 0 }, { kr: 'O', r: 5, b: 2 }, { d: 'AC', b: 1, crtaj: 1 }, { d: 'BD', b: 1, crtaj: 1, kasni: 0.9 }, { tacka: 'O' }], { velicina: 210 }) });
    // stranica i dijagonale → trougao ABO
    const xo = (25 - 4 + 36) / 12, yo = Math.sqrt(25 - xo * xo);
    const tb = { A: [0, 0], B: [6, 0], O: [r(xo), r(yo)], C: [r(2 * xo), r(2 * yo)], D: [r(2 * xo - 6), r(2 * yo)] };
    proveri(Math.abs(dist(tb.O, tb.B) - 2) < 0.01 && Math.abs(dist(tb.A, tb.C) - 10) < 0.01, 'AO = 5, BO = 2');
    Q(3, 'Paralelogram ima stranicu $AB = 6 cm$ i dijagonale $AC = 10 cm$ i $BD = 4 cm$. Koji trougao se konstruiše prvi?',
      ['$ABO$ sa stranicama $6$, $5$ i $2 cm$', '$ABC$ sa stranicama $6$, $10$ i $4 cm$', '$ABD$ sa stranicama $6$, $4$ i $10 cm$', '$ABO$ sa stranicama $6$, $10$ i $4 cm$'],
      'Dijagonale paralelograma se polove, pa je $AO = 5 cm$ i $BO = 2 cm$. Trougao $ABO$ se konstruiše po stavu SSS, a $C$ i $D$ su na produžecima $AO$ i $BO$.', 'polovina',
      { mediji: G(tb, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1, isp: 1 }, { d: 'BD', b: 2, isp: 1 }, { tacka: 'O' }], { velicina: 230 }),
        medijiOdgovora: G(tb, [{ p: 'ABO', b: 1, gusto: 1 }, { d: 'AO', o: '5 cm' }, { d: 'BO', o: '2 cm' }, { d: 'AB', o: '6 cm' }, { d: 'OC', b: 1, isp: 1, crtaj: 1, kasni: 0.6 }, { d: 'OD', b: 2, isp: 1, crtaj: 1, kasni: 1.2 }, { p: 'ABCD', b: 0, prazno: 1, crtaj: 1, kasni: 1.9 }], { velicina: 230 }) });
    // dijagonale i ugao između njih
    const tu = { O: [0, 0], A: [-3, 0], C: [3, 0], B: [r(4 * Math.cos(rad(-120))), r(4 * Math.sin(rad(-120)))], D: [r(-4 * Math.cos(rad(-120))), r(-4 * Math.sin(rad(-120)))] };
    Q(3, 'Paralelogram je zadat dijagonalama $6 cm$ i $8 cm$ i uglom od $60°$ između njih. Koji trougao može prvi da se konstruiše?',
      ['$AOB$: $3 cm$, $4 cm$ i ugao $60°$', '$ABC$: $6 cm$, $8 cm$ i ugao $60°$', '$AOB$: $6 cm$, $8 cm$ i ugao $60°$', '$ABD$: $3 cm$, $8 cm$ i ugao $60°$'],
      'Polovine dijagonala su $3 cm$ i $4 cm$, a ugao između njih je dat – trougao $AOB$ po stavu SUS. Ostala temena su na produžecima preko tačke $O$.', 'ugao',
      { mediji: G(tu, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1 }, { d: 'BD', b: 2 }, { u: 'AOB', o: '60°', b: 3 }], { velicina: 220 }),
        medijiOdgovora: G(tu, [{ p: 'AOB', b: 1, gusto: 1 }, { d: 'AO', o: '3 cm' }, { d: 'OB', o: '4 cm' }, { u: 'BOA', o: '60°', b: 3 }, { d: 'OC', b: 1, crtaj: 1, kasni: 0.6 }, { d: 'OD', b: 2, crtaj: 1, kasni: 1.1 }, { p: 'ABCD', b: 0, prazno: 1, crtaj: 1, kasni: 1.7 }], { velicina: 220 }) });
    proveri(Math.abs(Math.acos(((tu.A[0] * tu.B[0]) + tu.A[1] * tu.B[1]) / (3 * 4)) * 180 / Math.PI - 60) < 0.1, 'ugao AOB = 60°');
    // tri tačke → tri paralelograma
    const t3 = { A: [0, 0], B: [4, 0], C: [1, 3] };
    Q(3, 'Date su tri tačke $A$, $B$ i $C$ koje nisu na istoj pravoj. Koliko ima paralelograma kojima su to tri temena?',
      ['tri', 'jedan', 'dva', 'četiri'],
      'Četvrto teme može biti naspram $A$, naspram $B$ ili naspram $C$ – svaki put druga duž postaje dijagonala. Zato postoje tri paralelograma.', 'teme',
      { mediji: G(t3, [{ tacka: 'ABC', b: 3 }], { velicina: 200 }),
        medijiOdgovora: G({ ...t3, P: [5, 3], R: [-3, 3], T: [3, -3] }, [{ p: 'ABPC', b: 0, crtaj: 1, kasni: 0.2 }, { p: 'ABCR', b: 1, crtaj: 1, kasni: 1.0 }, { p: 'ATBC', b: 2, crtaj: 1, kasni: 1.8 }, { tacka: 'ABC', b: 3 }], { bezImena: ['P', 'R', 'T'], velicina: 220 }) });
    // koordinate
    const tg = { A: [1, 1], B: [5, 1], C: [7, 4], D: [3, 4] };
    proveri(tg.D[0] === tg.A[0] + tg.C[0] - tg.B[0] && tg.D[1] === tg.A[1] + tg.C[1] - tg.B[1], 'D = A + C − B');
    Q(2, 'Tačke $A(1, 1)$, $B(5, 1)$ i $C(7, 4)$ su temena paralelograma $ABCD$. Koje su koordinate temena $D$?',
      ['$D(3, 4)$', '$D(1, 4)$', '$D(3, 5)$', '$D(11, 4)$'],
      'Od $B$ do $C$ se ide $2$ udesno i $3$ nagore. Isti put vodi od $A$ do $D$: $D(1 + 2, 1 + 3) = (3, 4)$.', 'koordinata',
      { mediji: G({ ...tg }, [{ mreza: [0, 8, 0, 5] }, { d: 'AB', b: 0 }, { d: 'BC', b: 0 }, { tacka: 'ABC', b: 1 }], { bezImena: ['D'], velicina: 240 }),
        medijiOdgovora: G({ ...tg }, [{ mreza: [0, 8, 0, 5] }, { p: 'ABCD', b: 0 }, { lin: [tg.A, tg.D], str: 1, b: 2, crtaj: 1, debljina: 3 }, { tacka: 'ABCD', b: 1 }], { velicina: 240 }) });
    const tq = { A: [1, 1], B: [4, 1], C: [4, 4], D: [1, 4] };
    Q(1, 'Tačke $A(1, 1)$ i $B(4, 1)$ su susedna temena kvadrata $ABCD$ koji leži iznad $AB$. Koje su koordinate temena $C$ i $D$?',
      ['$C(4, 4)$ i $D(1, 4)$', '$C(4, 3)$ i $D(1, 3)$', '$C(1, 4)$ i $D(4, 4)$', '$C(4, 5)$ i $D(1, 5)$'],
      'Stranica kvadrata je $AB = 3$, pa su $C$ i $D$ za $3$ više od $B$ i $A$. Redosled temena ide u krug: $A → B → C → D$.', 'kvadrat',
      { mediji: G({ A: tq.A, B: tq.B }, [{ mreza: [0, 6, 0, 5] }, { d: 'AB', b: 0 }, { tacka: 'AB', b: 1 }], { velicina: 220 }),
        medijiOdgovora: G(tq, [{ mreza: [0, 6, 0, 5] }, { p: 'ABCD', b: 0, crtaj: 1 }, { tacka: 'ABCD', b: 1 }], { velicina: 220 }) });
    U(2, 'Koji skup podataka NIJE dovoljan za konstrukciju paralelograma?',
      ['dve susedne stranice', 'dve stranice i ugao između njih', 'stranica i obe dijagonale', 'dijagonale i ugao između njih'],
      'Dve stranice su samo dva podatka – mogu da „zatvore“ bezbroj različitih paralelograma (kao zglobni ram koji se krivi). Potreban je i treći, npr. ugao.',
      'Ram od četiri letvice spojene ekserima nije čvrst: lako se iskrivi. Zato se na kapije stavlja kosa letvica – ona pravi trouglove.', 'letvica',
      { mediji: G(t, [{ p: 'ABCD', b: 0, prazno: 1 }, { lin: (() => { const t2 = tPar(5, 3, 85); return [t2.A, t2.B, t2.C, t2.D]; })(), zatv: 1, b: 1, prazno: 1, isp: 1 }, { d: 'AB', o: '5 cm' }, { d: 'AD', o: '3 cm' }], { velicina: 200 }) });
    S(2, 'Spoji podatke za konstrukciju paralelograma sa trouglom koji se prvi konstruiše.',
      [['$a$, $b$ i ugao $α$', 'trougao $ABD$ (SUS)'], ['$a$ i obe dijagonale', 'trougao $ABO$ (SSS)'], ['dijagonale i ugao između njih', 'trougao $AOB$ (SUS)'], ['$a$, ugao $α$ i dijagonala $BD$', 'trougao $ABD$ (SSU)']],
      'U svim slučajevima se koristi to što se dijagonale paralelograma polove i što su naspramne stranice jednake.', 'trougao');
  }

  // ════════════════ 39. Operacije sa vektorima ════════════════
  L('Operacije sa vektorima');
  {
    const tv = { A: [0, 0], B: [4, 2], p1: [-1.5, -0.75], p2: [5.5, 2.75] };
    Q(1, 'Čime je potpuno određen vektor?',
      ['pravcem, smerom i intenzitetom', 'samo dužinom', 'početnom tačkom i dužinom', 'pravcem i dužinom'],
      'Pravac je prava na kojoj vektor leži, smer kaže „odakle–kuda“, a intenzitet je dužina. Dva vektora su jednaka ako se poklapaju u sve tri osobine.', 'vektor',
      { mediji: G(tv, [{ d: 'p1p2', b: 4, isp: 1 }, { d: 'AB', str: 1, b: 1, debljina: 3.5 }, { tacka: 'A' }, { tx: 'p', at: [5.3, 3.3] }], { velicina: 220 }) });
    Q(1, 'Kako se zove dužina vektora $\\vec{AB}$?',
      ['intenzitet', 'pravac', 'smer', 'koordinata'],
      'Intenzitet se piše $|\\vec{AB}|$. U fizici je to npr. jačina sile ili iznos brzine.', 'intenzitet',
      { mediji: G(tv, [{ d: 'AB', str: 1, b: 1, debljina: 3.5 }, { tacka: 'A' }], { velicina: 200 }) });
    // vetar
    Q(1, 'Zašto se brzina vetra predstavlja vektorom, a ne samo brojem?',
      ['važni su i pravac i smer duvanja', 'zato što vetar duva u krug', 'zato što je brzina vetra uvek ista', 'zato što se brzina meri u metrima'],
      'Podatak „$10 m/s$“ ne kaže odakle vetar duva. Meteorolozi zato koriste ružu vetrova – strane sveta određuju pravac i smer.', 'vetar',
      { mediji: G({ o: [0, 0] }, [{ lin: [[0, -3], [0, 3]], b: 4, debljina: 1.5 }, { lin: [[-3, 0], [3, 0]], b: 4, debljina: 1.5 }, { tx: '~S', at: [0, 3.5] }, { tx: '~J', at: [0, -3.6] }, { tx: '~I', at: [3.5, 0] }, { tx: '~Z', at: [-3.5, 0] }, { lin: [[-2, 1.6], [1.8, -1.4]], str: 1, b: 1, debljina: 4, crtaj: 1, ponovi: 1 }], { velicina: 190 }) });
    // nadovezivanje
    const a = [3, 1], b = [1, 2];
    Q(1, 'Vektor $\\vec{b}$ nadovežemo na vektor $\\vec{a}$ (početak $\\vec{b}$ u kraj $\\vec{a}$). Gde počinje vektor $\\vec{a} + \\vec{b}$?',
      ['u početku vektora $\\vec{a}$', 'u kraju vektora $\\vec{a}$', 'u kraju vektora $\\vec{b}$', 'u sredini vektora $\\vec{a}$'],
      'Zbir ide od početka prvog do kraja drugog vektora – kao da smo prešli oba puta, jedan za drugim.', 'zbir',
      { mediji: papirG(0, 6, 0, 4, [vek([1, 0.5], a, { o: 'a' }), vek([0.5, 1.5], b, { b: 2, o: 'b', pomeri: [3.5, 0], kasni: 0.6 })]),
        medijiOdgovora: papirG(0, 6, 0, 4, [vek([1, 0.5], a, { o: 'a' }), vek([4, 1.5], b, { b: 2, o: 'b' }), vek([1, 0.5], [4, 3], { b: 3, o: 'a + b', oAt: [2.2, 2.6], crtaj: 1 })]) });
    const tt = { A: [0, 0], B: [5, 0], C: [3, 3.5] };
    Q(1, 'Koliki je zbir $\\vec{AB} + \\vec{BC}$?',
      ['$\\vec{AC}$', '$\\vec{CA}$', '$\\vec{BA}$', '$\\vec{0}$'],
      'Kraj prvog vektora je početak drugog. Zbir ide od $A$ (početak prvog) do $C$ (kraj drugog) – to je pravilo trougla.', 'trougao',
      { mediji: G(tt, [{ d: 'AB', str: 1, b: 1 }, { d: 'BC', str: 1, b: 2 }], { velicina: 200 }),
        medijiOdgovora: G(tt, [{ d: 'AB', str: 1, b: 1 }, { d: 'BC', str: 1, b: 2 }, { d: 'AC', str: 1, b: 3, crtaj: 1, debljina: 3.5 }], { velicina: 200 }) });
    Q(1, 'Šta važi za suprotne vektore $\\vec{a}$ i $−\\vec{a}$?',
      ['isti pravac i intenzitet, suprotan smer', 'isti smer, suprotan pravac', 'različit pravac, isti intenzitet', 'isti pravac i smer, različit intenzitet'],
      'Suprotni vektori liče na suprotne brojeve $8$ i $−8$: iste su „veličine“, ali okrenuti na suprotne strane.', 'suprotan',
      { mediji: papirG(0, 6, 0, 3, [vek([1, 2], [4, 0], { o: 'a' }), vek([5, 1], [-4, 0], { b: 2, o: '−a', oAt: [3, 0.55] })]) });
    Q(1, 'Koliki je zbir $\\vec{a} + (−\\vec{a})$?',
      ['nula-vektor $\\vec{0}$', 'vektor $2\\vec{a}$', 'vektor $−2\\vec{a}$', 'broj $0$'],
      'Posle puta „tamo pa nazad“ vraćamo se u početnu tačku: $\\vec{AB} + \\vec{BA} = \\vec{AA} = \\vec{0}$. Nula-vektor ima intenzitet $0$.', 'nula',
      { mediji: G({ A: [0, 0], B: [5, 0], A1: [0, -0.6], B1: [5, -0.6] }, [{ d: 'AB', str: 1, b: 1 }, { d: 'B1A1', str: 1, b: 2, crtaj: 1, kasni: 0.8 }, { tacka: 'A' }], { bezImena: ['A1', 'B1'], velicina: 220 }) });
    // zbir na mreži
    proveri(a[0] + b[0] === 4 && a[1] + b[1] === 3, 'a + b = (4, 3)');
    Q(2, 'Na kariranom papiru je $\\vec{a}$: $3$ udesno i $1$ nagore, a $\\vec{b}$: $1$ udesno i $2$ nagore. Kakav je vektor $\\vec{a} + \\vec{b}$?',
      ['$4$ udesno i $3$ nagore', '$4$ udesno i $1$ nagore', '$2$ udesno i $1$ nadole', '$3$ udesno i $2$ nagore'],
      'Kad se vektori nadovežu, pomeranja se sabiraju posebno vodoravno ($3 + 1$) i posebno uspravno ($1 + 2$).', 'mreža',
      { mediji: papirG(0, 7, 0, 4, [vek([0.5, 0.5], a, { o: 'a' }), vek([5, 1], b, { b: 2, o: 'b' })]),
        medijiOdgovora: papirG(0, 7, 0, 4, [vek([0.5, 0.5], a, { o: 'a' }), vek([5, 1], b, { b: 2, o: 'b', pomeri: [-1.5, 0.5], kasni: 0.3 }), vek([0.5, 0.5], [4, 3], { b: 3, o: 'a + b', oAt: [1.8, 2.6], crtaj: 1, kasni: 1.6 })]) });
    // pravilo paralelograma
    const tpp = { O: [0, 0], A: [4, 0], C: [1.5, 2.5], B: [5.5, 2.5] };
    Q(2, 'Vektori $\\vec{a} = \\vec{OA}$ i $\\vec{b} = \\vec{OC}$ imaju zajednički početak i određuju paralelogram $OABC$. Šta predstavlja vektor $\\vec{a} + \\vec{b}$?',
      ['dijagonalu $\\vec{OB}$', 'dijagonalu $\\vec{CA}$', 'stranicu $\\vec{AB}$', 'stranicu $\\vec{CB}$'],
      'Pošto je $\\vec{OC} = \\vec{AB}$, važi $\\vec{OA} + \\vec{OC} = \\vec{OA} + \\vec{AB} = \\vec{OB}$. To je pravilo paralelograma.', 'pravilo',
      { mediji: G(tpp, [{ d: 'OA', str: 1, b: 1, o: 'a' }, { d: 'OC', str: 1, b: 2, o: 'b' }, { d: 'AB', b: 4, isp: 1 }, { d: 'CB', b: 4, isp: 1 }], { velicina: 220 }),
        medijiOdgovora: G(tpp, [{ d: 'OA', str: 1, b: 1, o: 'a' }, { d: 'OC', str: 1, b: 2, o: 'b' }, { d: 'OC', str: 1, b: 2, pomeri: [4, 0] }, { d: 'CB', b: 4, isp: 1 }, { d: 'OB', str: 1, b: 3, crtaj: 1, kasni: 1.6, debljina: 3.5 }], { velicina: 220 }) });
    Q(2, 'U paralelogramu $OABC$ je $\\vec{OA} = \\vec{a}$ i $\\vec{OC} = \\vec{b}$. Šta predstavlja vektor $\\vec{CA}$?',
      ['razliku $\\vec{a} − \\vec{b}$', 'zbir $\\vec{a} + \\vec{b}$', 'razliku $\\vec{b} − \\vec{a}$', 'vektor $2\\vec{a}$'],
      'Od $C$ do $A$ stižemo preko $O$: $\\vec{CO} + \\vec{OA} = −\\vec{b} + \\vec{a}$. Jedna dijagonala paralelograma je zbir, a druga razlika vektora.', 'razlika',
      { mediji: G(tpp, [{ p: 'OABC', b: 4, prazno: 1 }, { d: 'OA', str: 1, b: 1, o: 'a' }, { d: 'OC', str: 1, b: 2, o: 'b' }, { d: 'CA', str: 1, b: 3, debljina: 3.5 }], { velicina: 220 }),
        medijiOdgovora: G(tpp, [{ p: 'OABC', b: 4, prazno: 1 }, { d: 'CO', str: 1, b: 2, crtaj: 1 }, { d: 'OA', str: 1, b: 1, crtaj: 1, kasni: 1 }, { d: 'CA', str: 1, b: 3, debljina: 3.5 }], { velicina: 220 }) });
    // množenje brojem
    Q(2, 'Šta važi za vektor $−3\\vec{a}$ u poređenju sa vektorom $\\vec{a}$?',
      ['isti pravac, suprotan smer, $3$ puta duži', 'isti pravac i smer, $3$ puta duži', 'suprotan smer, $3$ puta kraći', 'drugi pravac, $3$ puta duži'],
      'Broj $3$ menja intenzitet ($|−3\\vec{a}| = 3 · |\\vec{a}|$), a znak minus okreće smer. Pravac ostaje isti.', 'smer',
      { mediji: papirG(0, 8, 0, 3, [vek([0.5, 2], [2, 0], { o: 'a' })]),
        medijiOdgovora: papirG(0, 8, 0, 3, [vek([0.5, 2], [2, 0], { o: 'a' }), vek([7, 0.8], [-6, 0], { b: 2, o: '−3a', oAt: [4, 1.35], crtaj: 1 })]) });
    Q(2, 'Na slici su vektor $\\vec{a}$ i vektori $\\vec{p}$, $\\vec{q}$, $\\vec{r}$, $\\vec{s}$. Koji od njih je $2\\vec{a}$?',
      ['$\\vec{q}$', '$\\vec{p}$', '$\\vec{r}$', '$\\vec{s}$'],
      'Vektor $2\\vec{a}$ ima isti pravac i smer kao $\\vec{a}$ i dvaput je duži: $\\vec{a}$ ide $2$ udesno i $1$ nagore, pa $2\\vec{a}$ ide $4$ udesno i $2$ nagore.', 'dvostruki',
      { mediji: papirG(0, 11, 0, 5, [vek([0.5, 0.5], [2, 1], { o: 'a' }), vek([4, 0.5], [3, 2], { b: 2, o: 'p' }), vek([6.5, 2.5], [4, 2], { b: 3, o: 'q' }), vek([4.5, 4.5], [-4, -2], { b: 5, o: 'r' }), vek([8, 0.5], [2, 2], { b: 0, o: 's' })], 260) });
    Q(2, 'Kako se zove svojstvo $\\vec{a} + \\vec{b} = \\vec{b} + \\vec{a}$?',
      ['komutativnost', 'asocijativnost', 'distributivnost', 'simetričnost'],
      'Na paralelogramu se to vidi odmah: do suprotnog temena se stiže i „donjim“ i „gornjim“ putem – rezultat je ista dijagonala.', 'svojstvo',
      { mediji: G(tpp, [{ d: 'OA', str: 1, b: 1, o: 'a' }, { d: 'AB', str: 1, b: 2, o: 'b' }, { d: 'OC', str: 1, b: 2 }, { d: 'CB', str: 1, b: 1 }, { d: 'OB', str: 1, b: 3, crtaj: 1, kasni: 0.5 }], { velicina: 220 }) });
    // srednja linija trougla
    const ts = { A: [0, 0], B: [6, 0], C: [2, 4] };
    const Mx = sr(ts.A, ts.C), Nx = sr(ts.B, ts.C);
    Q(2, 'Srednja linija trougla spaja sredine dve stranice. Kakva je u odnosu na treću stranicu?',
      ['paralelna i dvaput kraća', 'normalna i dvaput kraća', 'paralelna i iste dužine', 'paralelna i triput kraća'],
      'Vektorima se dokazuje da je $\\vec{MN} = {1|2}\\vec{AB}$, a jednakost vektora znači isti pravac (paralelnost) i polovinu dužine.', 'linija',
      { mediji: G({ ...ts, M: Mx, N: Nx }, [{ p: 'ABC', b: 0 }, { d: 'MN', b: 1, debljina: 3.5 }, { tacka: 'MN', b: 1 }], { velicina: 210 }),
        medijiOdgovora: G({ ...ts, M: Mx, N: Nx }, [{ p: 'ABC', b: 0 }, { d: 'MN', b: 1, debljina: 3.5 }, { d: 'MN', b: 2, pomeri: [-1, -2], kasni: 0.5 }, { d: 'MN', b: 2, pomeri: [2, -2], kasni: 1.2 }], { velicina: 210 }) });
    proveri(2 * (4 + 5 + 7) === 32, 'obim 32');
    Q(2, 'Srednje linije trougla su $4 cm$, $5 cm$ i $7 cm$. Koliki je obim trougla?',
      ['$32 cm$', '$16 cm$', '$8 cm$', '$64 cm$'],
      'Svaka stranica je dvaput duža od srednje linije naspram nje: $8 + 10 + 14 = 32 cm$. Obim trougla srednjih linija je uvek polovina obima trougla.', 'obim',
      { mediji: G({ ...ts, M: Mx, N: Nx, P: sr(ts.A, ts.B) }, [{ p: 'ABC', b: 0, prazno: 1 }, { p: 'MNP', b: 1 }, { d: 'MN', o: '7 cm' }, { d: 'NP', o: '4 cm' }, { d: 'PM', o: '5 cm' }], { bezImena: ['M', 'N', 'P'], velicina: 220 }) });
    Q(3, 'Na koliko podudarnih trouglova srednje linije dele svaki trougao?',
      ['četiri', 'tri', 'dva', 'šest'],
      'Sva četiri mala trougla imaju stranice ${a|2}$, ${b|2}$ i ${c|2}$, pa su podudarna po stavu SSS. Svaki je četvrtina velikog trougla.', 'četiri',
      { mediji: G({ ...ts, M: Mx, N: Nx, P: sr(ts.A, ts.B) }, [{ p: 'ABC', b: 0 }, { d: 'MN', b: 1 }, { d: 'NP', b: 1 }, { d: 'PM', b: 1 }], { bezImena: ['M', 'N', 'P'], velicina: 210 }),
        medijiOdgovora: G({ ...ts, M: Mx, N: Nx, P: sr(ts.A, ts.B) }, [{ p: 'APM', b: 1, gusto: 1 }, { p: 'PBN', b: 2, gusto: 1 }, { p: 'MNC', b: 3, gusto: 1 }, { p: 'MPN', b: 5, gusto: 1 }], { bezImena: ['M', 'N', 'P'], velicina: 210 }) });
    // sredine stranica četvorougla
    const tc4 = { A: [0, 0], B: [6, -1], C: [7, 3], D: [1.5, 4.5] };
    const E = sr(tc4.A, tc4.B), F = sr(tc4.B, tc4.C), Gt = sr(tc4.C, tc4.D), H = sr(tc4.D, tc4.A);
    proveri(Math.abs((F[0] - E[0]) - (Gt[0] - H[0])) < 1e-9 && Math.abs((F[1] - E[1]) - (Gt[1] - H[1])) < 1e-9, 'EF = HG');
    Q(3, 'Sredine stranica bilo kog četvorougla spojimo redom. Kakav četvorougao uvek dobijamo?',
      ['paralelogram', 'pravougaonik', 'romb', 'trapez'],
      'Duži $EF$ i $HG$ su srednje linije trouglova $ABC$ i $ACD$ sa zajedničkom stranicom $AC$: obe su paralelne sa $AC$ i jednake ${AC|2}$.', 'sredina',
      { mediji: G({ ...tc4, E, F, G: Gt, H }, [{ p: 'ABCD', b: 0 }, { tacka: 'EFGH', b: 1 }], { velicina: 220 }),
        medijiOdgovora: G({ ...tc4, E, F, G: Gt, H }, [{ p: 'ABCD', b: 0, prazno: 1 }, { d: 'AC', b: 4, isp: 1 }, { p: 'EFGH', b: 1, crtaj: 1 }, { tacka: 'EFGH', b: 1 }], { velicina: 220 }) });
    Q(3, 'Koliki je zbir $\\vec{AB} + \\vec{BC} + \\vec{CD} + \\vec{DA}$ za bilo koji četvorougao $ABCD$?',
      ['$\\vec{0}$', '$\\vec{AC}$', '$2\\vec{AB}$', '$\\vec{BD}$'],
      'Vektori se redom nadovezuju i put se završava u tački $A$, gde je i počeo. Vektor od $A$ do $A$ je nula-vektor.', 'krug',
      { mediji: G(tc4, [{ d: 'AB', str: 1, b: 1, crtaj: 1, kasni: 0.2, trajanje: 0.6 }, { d: 'BC', str: 1, b: 2, crtaj: 1, kasni: 0.8, trajanje: 0.6 }, { d: 'CD', str: 1, b: 3, crtaj: 1, kasni: 1.4, trajanje: 0.6 }, { d: 'DA', str: 1, b: 5, crtaj: 1, kasni: 2.0, trajanje: 0.6 }], { velicina: 220 }) });
    const tpa = { A: [0, 0], B: [5, 0], C: [6.5, 3], D: [1.5, 3] };
    U(3, 'Dat je paralelogram $ABCD$. Koji zbir NIJE jednak vektoru $\\vec{AC}$?',
      ['$\\vec{AB} + \\vec{CB}$', '$\\vec{AB} + \\vec{BC}$', '$\\vec{AD} + \\vec{DC}$', '$\\vec{AB} + \\vec{AD}$'],
      'Vektor $\\vec{CB}$ je suprotan vektoru $\\vec{BC}$, pa je $\\vec{AB} + \\vec{CB} = \\vec{AB} − \\vec{AD} = \\vec{DB}$ – to je druga dijagonala.',
      'Fizičari slažu sile baš po pravilu paralelograma: dve sile iz iste tačke zamenjuje jedna – dijagonala.', 'sila',
      { mediji: G(tpa, [{ p: 'ABCD', b: 0 }, { d: 'AC', str: 1, b: 3, debljina: 3.5 }], { velicina: 220 }) });
    S(2, 'Spoji izraze sa vektorima koji su im jednaki.',
      [['$\\vec{a} + (−\\vec{a})$', '$\\vec{0}$'], ['$\\vec{AB} + \\vec{BC}$', '$\\vec{AC}$'], ['$\\vec{a} + \\vec{a} + \\vec{a}$', '$3\\vec{a}$'], ['$\\vec{a} − \\vec{b}$', '$\\vec{a} + (−\\vec{b})$']],
      'Računanje sa vektorima liči na računanje sa celim brojevima: oduzimanje je dodavanje suprotnog, a množenje brojem je ponovljeno sabiranje.', 'vektor');
  }

  // ════════════════ 40. Trapez ════════════════
  L('Trapez');
  {
    const t = tTrap(7, 3.5, 3, 1.5);
    const tj = tTrap(7, 3, 3, 2); // jednakokraki
    const tp = tTrap(6, 3.5, 3, 0); // pravougli
    Q(1, 'Koji četvorougao ima tačno jedan par paralelnih stranica?',
      ['trapez', 'paralelogram', 'deltoid', 'romb'],
      'Reč trapez dolazi od grčke reči za „stočić“. Paralelogram ima dva para paralelnih stranica, pa nije trapez.', 'trapez',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }], { velicina: 220 }) });
    Q(1, 'Kako se zovu paralelne stranice trapeza?',
      ['osnovice', 'kraci', 'dijagonale', 'visine'],
      'Osnovice trapeza su uvek različite dužine – da su jednake, četvorougao bi bio paralelogram.', 'osnovica',
      { mediji: G(t, [{ p: 'ABCD', b: 4, prazno: 1 }, { d: 'AB', b: 1, debljina: 4 }, { d: 'DC', b: 1, debljina: 4 }], { velicina: 220 }) });
    Q(1, 'Kako se zovu stranice trapeza koje nisu paralelne?',
      ['kraci', 'osnovice', 'katete', 'tetive'],
      'Kraci trapeza se obično obeležavaju sa $c$ i $d$, a osnovice sa $a$ i $b$. Produženi kraci (ako nisu paralelni) seku se u jednoj tački.', 'krak',
      { mediji: G(t, [{ p: 'ABCD', b: 4, prazno: 1 }, { d: 'BC', b: 2, debljina: 4 }, { d: 'AD', b: 2, debljina: 4 }], { velicina: 220 }) });
    Q(1, 'Kakvi su uglovi trapeza koji leže na istom kraku?',
      ['suplementni (zbir $180°$)', 'jednaki', 'komplementni (zbir $90°$)', 'uvek pravi'],
      'Osnovice su paralelne, a krak ih seče kao transverzala. Uglovi $α$ i $δ$ su „suprotni“ uglovi uz transverzalu, pa im je zbir $180°$.', 'krak',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }, { u: 'BAD', o: 'α', b: 1 }, { u: 'ADC', o: 'δ', b: 2 }, { d: 'AD', b: 3, debljina: 4 }], { velicina: 220 }) });
    proveri(180 - 65 === 115, 'δ = 115°');
    Q(2, 'U trapezu $ABCD$ ($AB ∥ CD$) ugao kod temena $A$ je $65°$. Koliki je ugao kod temena $D$?',
      ['$115°$', '$65°$', '$25°$', '$295°$'],
      'Uglovi kod $A$ i $D$ su na istom kraku $AD$, pa je $δ = 180° − 65° = 115°$.', 'ugao',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }, { u: 'BAD', o: '65°', b: 1 }, { u: 'ADC', o: '?', b: 2 }], { velicina: 220 }) });
    proveri(180 - 50 === 130 && 180 - 117 === 63, 'ostali uglovi');
    Q(3, 'Dva ugla trapeza koja NISU na istom kraku su $50°$ i $117°$. Koliki su preostala dva ugla?',
      ['$130°$ i $63°$', '$50°$ i $117°$', '$140°$ i $53°$', '$96°$ i $97°$'],
      'Svaki od ova dva ugla ima „para“ na svom kraku: $180° − 50° = 130°$ i $180° − 117° = 63°$. Provera: $50 + 117 + 130 + 63 = 360$.', 'zbir',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }, { u: 'CBA', o: '50°', b: 1 }, { u: 'ADC', o: '117°', b: 2 }], { velicina: 220 }) });
    Q(1, 'Kakav je trapez čija su oba kraka jednaka?',
      ['jednakokraki', 'pravougli', 'jednakostranični', 'raznostrani'],
      'Jednakokraki trapez dobijamo kad od jednakokrakog trougla „odsečemo“ vrh pravom paralelnom sa osnovicom.', 'kraci',
      { mediji: G(tj, [{ p: 'ABCD', b: 0 }, { d: 'BC', o: 'c', b: 2 }, { d: 'AD', o: 'c', b: 2 }], { velicina: 220 }) });
    Q(2, 'U jednakokrakom trapezu ugao na dužoj osnovici je $70°$. Koliki je ugao na kraćoj osnovici?',
      ['$110°$', '$70°$', '$20°$', '$140°$'],
      'U jednakokrakom trapezu su uglovi na istoj osnovici jednaki, a uglovi na kraku suplementni: $180° − 70° = 110°$.', 'ugao',
      { mediji: G(tj, [{ p: 'ABCD', b: 0 }, { u: 'BAD', o: '70°', b: 1 }, { u: 'CBA', o: '70°', b: 1 }, { u: 'DCB', o: '?', b: 2 }], { velicina: 220 }) });
    Q(2, 'Šta važi za dijagonale jednakokrakog trapeza?',
      ['jednake su', 'polove se', 'normalne su', 'paralelne su'],
      'Trouglovi $ABD$ i $BAC$ su podudarni (SUS: zajednička osnovica, jednaki kraci i uglovi na osnovici), pa je $AC = BD$. Ali dijagonale se ne polove!', 'dijagonala',
      { mediji: G(tj, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1, crtaj: 1 }, { d: 'BD', b: 2, crtaj: 1, kasni: 0.8 }], { velicina: 220 }),
        medijiOdgovora: G(tj, [{ p: 'ABD', b: 1, gusto: 1 }, { p: 'BAC', b: 2 }, { d: 'AC', b: 2, debljina: 4 }, { d: 'BD', b: 1, debljina: 4 }], { velicina: 220 }) });
    Q(1, 'Koliko pravih uglova ima pravougli trapez?',
      ['tačno dva', 'tačno jedan', 'četiri', 'tri'],
      'Kad je jedan krak normalan na jednu osnovicu, normalan je i na drugu (osnovice su paralelne). Zato su pravi uglovi uvek u paru.', 'pravi',
      { mediji: G(tp, [{ p: 'ABCD', b: 0 }], { velicina: 210 }), medijiOdgovora: G(tp, [{ p: 'ABCD', b: 0 }, { pu: 'BAD' }, { pu: 'ADC' }], { velicina: 210 }) });
    Q(2, 'Krak pravouglog trapeza koji je normalan na osnovice je ujedno i njegova…',
      ['visina', 'dijagonala', 'srednja linija', 'osa simetrije'],
      'Visina trapeza je rastojanje između pravih na kojima leže osnovice. U pravouglom trapezu je to baš kraći krak.', 'visina',
      { mediji: G(tp, [{ p: 'ABCD', b: 0 }, { pu: 'BAD' }, { d: 'AD', b: 1, debljina: 4 }], { velicina: 210 }) });
    // srednja linija trapeza
    const M = sr(t.A, t.D), N = sr(t.B, t.C);
    proveri((10 + 6) / 2 === 8, 'm = 8');
    Q(2, 'Osnovice trapeza su $10 cm$ i $6 cm$. Kolika je srednja linija trapeza?',
      ['$8 cm$', '$16 cm$', '$4 cm$', '$2 cm$'],
      'Srednja linija spaja sredine krakova, paralelna je osnovicama i jednaka je polovini njihovog zbira: ${10 + 6|2} = 8 cm$.', 'sredina',
      { mediji: G({ ...t, M, N }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '10 cm' }, { d: 'DC', o: '6 cm' }, { tacka: 'MN', b: 1 }, { d: 'MN', b: 1, isp: 1 }], { velicina: 220 }),
        medijiOdgovora: G({ ...t, M, N }, [{ p: 'ABCD', b: 0 }, { d: 'MN', b: 1, o: '8 cm', crtaj: 1, debljina: 3.5 }], { velicina: 220 }) });
    proveri(2 * 8 - 5 === 11, 'a = 11');
    Q(2, 'Kraća osnovica trapeza je $5 cm$, a srednja linija $8 cm$. Kolika je duža osnovica?',
      ['$11 cm$', '$13 cm$', '$6,5 cm$', '$3 cm$'],
      'Zbir osnovica je dvostruka srednja linija: $a + 5 = 16$, pa je $a = 11 cm$.', 'osnovica',
      { mediji: G({ ...t, M, N }, [{ p: 'ABCD', b: 0 }, { d: 'DC', o: '5 cm' }, { d: 'MN', b: 1, o: '8 cm' }, { d: 'AB', o: '?', b: 2 }], { velicina: 220 }) });
    // dijagonale seku srednju liniju
    const tt = tTrap(8, 4, 4, 1.5);
    const Mt = sr(tt.A, tt.D), Nt = sr(tt.B, tt.C);
    const Et = [r(Mt[0] + 2), Mt[1]], Ft = [r(Mt[0] + 4), Mt[1]];
    proveri(Math.abs((Et[1] - tt.A[1]) * (tt.C[0] - tt.A[0]) - (Et[0] - tt.A[0]) * (tt.C[1] - tt.A[1])) < 1e-6, 'E na AC');
    proveri(Math.abs((Ft[1] - tt.B[1]) * (tt.D[0] - tt.B[0]) - (Ft[0] - tt.B[0]) * (tt.D[1] - tt.B[1])) < 1e-6, 'F na BD');
    Q(3, 'Osnovice trapeza su $8 cm$ i $4 cm$. Dijagonale seku srednju liniju u tačkama $E$ i $F$. Kolika je duž $EF$?',
      ['$2 cm$', '$4 cm$', '$6 cm$', '$1 cm$'],
      '$ME$ je srednja linija trougla $ACD$ (${4|2} = 2$), a $MF$ srednja linija trougla $ABD$ (${8|2} = 4$). Dakle $EF = 4 − 2 = 2 cm$ – uvek polovina razlike osnovica.', 'razlika',
      { mediji: G({ ...tt, M: Mt, N: Nt, E: Et, F: Ft }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 4 }, { d: 'BD', b: 4 }, { d: 'MN', b: 1 }, { d: 'AB', o: '8 cm' }, { d: 'DC', o: '4 cm' }, { tacka: 'EF', b: 2 }], { bezImena: ['M', 'N'], velicina: 230 }),
        medijiOdgovora: G({ ...tt, M: Mt, N: Nt, E: Et, F: Ft }, [{ p: 'ABCD', b: 0, prazno: 1 }, { p: 'ACD', b: 5 }, { d: 'ME', b: 3, debljina: 4, o: '2' }, { d: 'EF', b: 2, debljina: 5, o: '2' }, { tacka: 'EF', b: 2 }], { velicina: 230 }) });
    // osa simetrije
    Q(2, 'Koliko osa simetrije ima jednakokraki trapez?',
      ['jednu', 'dve', 'nijednu', 'četiri'],
      'Osa prolazi kroz sredine osnovica. Jednakokraki trapez nije centralnosimetričan – posle okretanja za $180°$ duža osnovica bi bila gore.', 'simetrija',
      { mediji: G(tj, [{ p: 'ABCD', b: 0 }], { velicina: 210 }),
        medijiOdgovora: G({ ...tj, s1: [3.5, -1], s2: [3.5, 4], m1: [3.5, 0], m2: [3.5, 3] }, [{ p: 'ABCD', b: 4, prazno: 1 }, { d: 's1s2', b: 3, isp: 1 }, { p: 'Am1m2D', b: 1, gusto: 1 }, { p: 'Am1m2D', b: 2, odrazi: 's1s2', kasni: 0.6 }], { velicina: 210 }) });
    proveri(230 / 2 === 115 && 180 - 115 === 65, '65°');
    Q(3, 'Zbir dva tupa ugla jednakokrakog trapeza je $230°$. Koliki je njegov oštar ugao?',
      ['$65°$', '$115°$', '$50°$', '$130°$'],
      'Tupi uglovi su na kraćoj osnovici i jednaki su: $230° : 2 = 115°$. Oštar ugao je na istom kraku: $180° − 115° = 65°$.', 'oštar',
      { mediji: G(tj, [{ p: 'ABCD', b: 0 }, { u: 'DCB', b: 2 }, { u: 'ADC', b: 2 }, { u: 'BAD', o: '?', b: 1 }], { velicina: 220 }) });
    proveri(180 / 4 === 45 && 3 * 45 === 135, '45 i 135');
    Q(3, 'Tup ugao pravouglog trapeza je $3$ puta veći od oštrog. Koliki su ti uglovi?',
      ['$45°$ i $135°$', '$30°$ i $90°$', '$60°$ i $180°$', '$36°$ i $108°$'],
      'Oštar i tup ugao su na istom (kosom) kraku, pa je njihov zbir $180°$: $x + 3x = 180°$, $x = 45°$.', 'pravougli',
      { mediji: G(tTrap(6, 3, 3, 0), [{ p: 'ABCD', b: 0 }, { pu: 'BAD' }, { pu: 'ADC' }, { u: 'CBA', o: 'x', b: 1 }, { u: 'DCB', o: '3x', b: 2 }], { velicina: 210 }) });
    U(1, 'Koji od ovih četvorouglova NIJE trapez?',
      ['romb', 'jednakokraki trapez', 'pravougli trapez', 'četvorougao sa samo $AB ∥ CD$'],
      'Romb je paralelogram – ima dva para paralelnih stranica, a trapez ima tačno jedan.',
      'U nekim zemljama (npr. u Americi) trapez se definiše sa „bar jednim“ parom paralelnih stranica, pa je tamo i paralelogram trapez. Kod nas važi „tačno jedan“.', 'romb');
    S(2, 'Spoji vrstu trapeza sa osobinom koja je za nju karakteristična.',
      [['jednakokraki trapez', 'dijagonale su jednake'], ['pravougli trapez', 'jedan krak je visina'], ['svaki trapez', 'uglovi na kraku su suplementni'], ['srednja linija trapeza', 'polovina zbira osnovica']],
      'Jednakokraki trapez se može upisati u kružnicu, jer su mu zbirovi naspramnih uglova $180°$.', 'trapez');
  }

  // ════════════════ 41. Konstrukcija trapeza ════════════════
  L('Konstrukcija trapeza');
  {
    // osnovice 7 i 3, kraci 4,5 i 3,5 → paralelogram AECD i trougao EBC
    const h = Math.sqrt(11.25);
    const t = { A: [0, 0], E: [3, 0], B: [7, 0], C: [4, r(h)], D: [1, r(h)] };
    proveri(Math.abs(dist(t.B, t.C) - 4.5) < 0.01 && Math.abs(dist(t.E, t.C) - 3.5) < 0.01 && Math.abs(dist(t.A, t.D) - 3.5) < 0.01, 'stranice EBC');
    Q(1, 'Koliko je međusobno nezavisnih elemenata potrebno za konstrukciju trapeza?',
      ['četiri', 'tri', 'dva', 'pet'],
      'Trapez se razlaže na trougao i paralelogram (ili dva trougla). Potrebno je jedan element više nego za paralelogram, jer osnovice nisu jednake.', 'element',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }], { bezImena: ['E'], velicina: 220 }) });
    Q(2, 'Trapez $ABCD$ sa osnovicama $7 cm$ i $3 cm$ i kracima $BC = 4,5 cm$, $AD = 3,5 cm$ podelimo duži $CE$, paralelnom sa krakom $AD$. Kolike su stranice trougla $EBC$?',
      ['$4 cm$, $4,5 cm$ i $3,5 cm$', '$7 cm$, $4,5 cm$ i $3,5 cm$', '$3 cm$, $4,5 cm$ i $3,5 cm$', '$4 cm$, $4,5 cm$ i $3 cm$'],
      '$AECD$ je paralelogram, pa je $AE = DC = 3 cm$ i $CE = AD = 3,5 cm$. Ostaje $EB = 7 − 3 = 4 cm$. Trougao $EBC$ se konstruiše po stavu SSS.', 'paralela',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }, { d: 'EC', b: 3, isp: 1, crtaj: 1 }, { tacka: 'E' }], { velicina: 230 }),
        medijiOdgovora: G(t, [{ p: 'AECD', b: 1, gusto: 1 }, { p: 'EBC', b: 2, gusto: 1 }, { d: 'EB', o: '4' }, { d: 'BC', o: '4,5' }, { d: 'EC', o: '3,5' }], { velicina: 230 }) });
    // AB, AD, α, β
    const ta = { A: [0, 0], B: [6, 0], D: [1.5, 2.598], C: [r(6 - 2.598), 2.598], y: [2.5, 4.33], z: [6 - 4, 4] };
    proveri(Math.abs(dist(ta.A, ta.D) - 3) < 0.01, 'AD = 3');
    Q(2, 'Zadati su osnovica $AB$, krak $AD$ i uglovi $α$ i $β$. Kako se dobija teme $C$?',
      ['u preseku kraka ugla $β$ i paralele sa $AB$ kroz $D$', 'u preseku kružnica $k(B, AD)$ i $k(D, AB)$', 'na simetrali duži $AB$', 'u preseku dijagonala'],
      'Osnovica $CD$ mora biti paralelna sa $AB$, pa $C$ leži na pravoj kroz $D$ paralelnoj sa $AB$. Istovremeno je na kraku ugla $β$.', 'paralela',
      { mediji: G(ta, [{ d: 'AB', b: 0 }, { d: 'Ay', b: 4 }, { d: 'Bz', b: 4 }, { u: 'BAy', o: 'α', b: 1 }, { u: 'zBA', o: 'β', b: 2 }, { tacka: 'D' }], { bezImena: ['C'], velicina: 230 }),
        medijiOdgovora: G({ ...ta, p1: [0, 2.598], p2: [7, 2.598] }, [{ d: 'AB', b: 0 }, { d: 'Ay', b: 4 }, { d: 'Bz', b: 4 }, { d: 'p1p2', b: 3, isp: 1 }, { p: 'ABCD', b: 1, crtaj: 1, kasni: 0.8 }, { tacka: 'DC' }], { velicina: 230 }) });
    proveri(Math.abs(Math.atan2(2.598, 2.598) * 180 / Math.PI - 45) < 0.1, 'β = 45°');
    // dve visine
    const tv = { A: [0, 0], B: [8, 0], C: [6, 3], D: [2, 3], E: [2, 0], F: [6, 0] };
    Q(2, 'Visine iz temena $D$ i $C$ dele trapez na tri dela. Koja su to?',
      ['dva pravougla trougla i pravougaonik', 'tri trougla', 'dva paralelograma i trougao', 'dva kvadrata i trougao'],
      'Visine $DE$ i $CF$ su normalne na osnovice i međusobno paralelne, pa je $EFCD$ pravougaonik, a sa strane ostaju pravougli trouglovi $AED$ i $FBC$.', 'visina',
      { mediji: G(tv, [{ p: 'ABCD', b: 0 }, { d: 'DE', b: 3, isp: 1, crtaj: 1 }, { d: 'CF', b: 3, isp: 1, crtaj: 1, kasni: 0.8 }], { velicina: 230 }),
        medijiOdgovora: G(tv, [{ p: 'AED', b: 1, gusto: 1 }, { p: 'EFCD', b: 2, gusto: 1 }, { p: 'FBC', b: 5, gusto: 1 }, { pu: 'DEA' }, { pu: 'BFC' }], { velicina: 230 }) });
    // dijagonale → trougao AEC
    const td = { A: [0, 0], B: [5, 0], E: [7, 0], C: [3.2, 2.5], D: [1.2, 2.5] };
    Q(2, 'Trapez je zadat osnovicama $5 cm$ i $2 cm$ i dijagonalama. Osnovicu $AB$ produžimo za $BE = CD$. Kolika je stranica $AE$ trougla $AEC$?',
      ['$7 cm$', '$5 cm$', '$3 cm$', '$10 cm$'],
      '$BECD$ je paralelogram, pa je $CE = BD$ – druga dijagonala je „premeštena“. Trougao $AEC$ ima stranice $AE = a + b$, $AC$ i $CE = BD$.', 'dijagonala',
      { mediji: G(td, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1 }, { d: 'BD', b: 2 }, { d: 'BE', b: 3, isp: 1 }, { d: 'CE', b: 2, isp: 1 }], { velicina: 230 }),
        medijiOdgovora: G(td, [{ p: 'AEC', b: 1, gusto: 1 }, { p: 'ABCD', b: 0, prazno: 1 }, { d: 'BD', b: 2, pomeri: [2, 0], kasni: 0.4 }, { d: 'AE', o: '5 + 2 = 7', b: 3 }], { velicina: 230 }) });
    // pravougli trapez
    const tpr = { A: [0, 0], E: [4, 0], B: [6, 0], C: [4, 3], D: [0, 3] };
    Q(2, 'Pravougli trapez ima osnovice $6 cm$ i $4 cm$ i kraći krak $3 cm$. Kakav trougao $EBC$ ostaje kad se odvoji pravougaonik $AECD$?',
      ['pravougli, sa katetama $2 cm$ i $3 cm$', 'pravougli, sa katetama $6 cm$ i $3 cm$', 'jednakokraki, sa kracima $3 cm$', 'pravougli, sa katetama $4 cm$ i $3 cm$'],
      'U pravougaoniku je $AE = DC = 4 cm$, pa je $EB = 6 − 4 = 2 cm$. Visina $CE$ jednaka je kraćem kraku, $3 cm$. Trougao $EBC$ se konstruiše po stavu SUS.', 'kateta',
      { mediji: G(tpr, [{ p: 'ABCD', b: 0 }, { pu: 'BAD' }, { d: 'CE', b: 3, isp: 1 }], { velicina: 220 }),
        medijiOdgovora: G(tpr, [{ p: 'AECD', b: 1, gusto: 1 }, { p: 'EBC', b: 2, gusto: 1 }, { pu: 'BEC' }, { d: 'EB', o: '2' }, { d: 'EC', o: '3' }], { velicina: 220 }) });
    // jednakokraki: osnovice 7 i 5, krak 4
    const hj = Math.sqrt(16 - 1);
    const tj = { A: [0, 0], E: [5, 0], B: [7, 0], C: [6, r(hj)], D: [1, r(hj)] };
    proveri(Math.abs(dist(tj.E, tj.C) - 4) < 0.01 && Math.abs(dist(tj.B, tj.C) - 4) < 0.01, 'EC = BC = 4');
    Q(2, 'Jednakokraki trapez ima osnovice $7 cm$ i $5 cm$ i krak $4 cm$. Kakav je trougao $EBC$, ako je $CE ∥ AD$?',
      ['jednakokraki, stranica $2$, $4$ i $4 cm$', 'jednakostranični, stranica $4 cm$', 'pravougli, kateta $2$ i $4 cm$', 'jednakokraki, stranica $7$, $4$ i $4 cm$'],
      '$CE = AD = 4 cm$ (paralelogram $AECD$) i $BC = 4 cm$, pa je trougao jednakokraki. Osnovica mu je $EB = 7 − 5 = 2 cm$.', 'osnovica',
      { mediji: G(tj, [{ p: 'ABCD', b: 0 }, { d: 'EC', b: 3, isp: 1 }], { velicina: 220 }),
        medijiOdgovora: G(tj, [{ p: 'AECD', b: 4 }, { p: 'EBC', b: 2, gusto: 1 }, { d: 'EC', o: '4' }, { d: 'BC', o: '4' }, { d: 'EB', o: '2' }], { velicina: 220 }) });
    // ne postoji
    proveri(1 + 2 < 4, 'trougao 4, 1, 2 ne postoji');
    Q(3, 'Postoji li trapez sa osnovicama $8 cm$ i $4 cm$ i kracima $1 cm$ i $2 cm$?',
      ['ne – trougao sa stranicama $4$, $1$ i $2 cm$ ne postoji', 'da – svaka četiri broja daju trapez', 'da – samo mora biti jednakokraki', 'ne – kraci moraju biti jednaki'],
      'Razlika osnovica ($4 cm$) i kraci čine trougao $EBC$. Po nejednakosti trougla mora biti $1 + 2 > 4$, a to ne važi.', 'nejednakost',
      { mediji: G({ A: [0, 0], E: [4, 0], B: [8, 0] }, [{ d: 'AB', b: 0 }, { tacka: 'E' }, { l: 'E', r: 1, od: 0, do: 180, b: 1, crtaj: 1 }, { l: 'B', r: 2, od: 90, do: 180, b: 2, crtaj: 1, kasni: 0.8 }], { velicina: 230 }) });
    // produženi kraci pod 60°
    const s3 = Math.sqrt(3);
    const tz = { A: [0, 0], B: [7, 0], V: [3.5, r(3.5 * s3)], D: [1.5, r(1.5 * s3)], C: [5.5, r(1.5 * s3)] };
    proveri(Math.abs(dist(tz.C, tz.D) - 4) < 0.01 && Math.abs(dist(tz.A, tz.D) - 3) < 0.01, 'krak 3');
    Q(3, 'Produženi kraci jednakokrakog trapeza seku se pod uglom od $60°$. Osnovice su $7 cm$ i $4 cm$. Koliki je krak?',
      ['$3 cm$', '$4 cm$', '$7 cm$', '$5,5 cm$'],
      'Uglovi na osnovici velikog trougla su po $60°$, pa su oba trougla (veliki i mali iznad trapeza) jednakostranična: stranice $7$ i $4 cm$. Krak je $7 − 4 = 3 cm$.', 'produžetak',
      { mediji: G(tz, [{ p: 'ABCD', b: 0 }, { d: 'DV', b: 4, isp: 1 }, { d: 'CV', b: 4, isp: 1 }, { u: 'DVC', o: '60°', b: 1 }, { d: 'AB', o: '7 cm' }, { d: 'DC', o: '4 cm' }], { velicina: 220 }),
        medijiOdgovora: G(tz, [{ p: 'ABV', b: 1 }, { p: 'DCV', b: 2, gusto: 1 }, { d: 'AD', b: 3, debljina: 5, o: '3 cm' }], { velicina: 220 }) });
    Q(1, 'Zašto se kod konstrukcije trapeza kroz teme $D$ povlači prava paralelna sa $AB$?',
      ['jer je osnovica $CD$ paralelna sa $AB$', 'jer je krak $AD$ paralelan sa $AB$', 'jer je dijagonala paralelna sa $AB$', 'jer je $D$ središte trapeza'],
      'Osnovice trapeza su paralelne, pa teme $C$ mora biti na toj paraleli. Paralela se konstruiše lenjirom i trouglom ili šestarom.', 'osnovica',
      { mediji: G({ A: [0, 0], B: [6, 0], D: [1.5, 2.5], p1: [-0.5, 2.5], p2: [7, 2.5] }, [{ d: 'AB', b: 0 }, { d: 'AD', b: 0 }, { d: 'p1p2', b: 3, isp: 1, crtaj: 1 }, { tacka: 'D' }], { velicina: 220 }) });
    Q(2, 'Koliko elemenata je dovoljno za konstrukciju jednakokrakog trapeza?',
      ['tri', 'četiri', 'dva', 'pet'],
      'Jednakokraki trapez „zna“ sam po sebi da su mu kraci jednaki (i uglovi na osnovici), pa je potreban jedan podatak manje nego za proizvoljan trapez.', 'krak',
      { mediji: G(tTrap(7, 3, 3, 2), [{ p: 'ABCD', b: 0 }, { d: 'BC', b: 2, o: 'c' }, { d: 'AD', b: 2, o: 'c' }], { velicina: 210 }) });
    proveri(9 - 6 === 3, 'krak 3 (jednakostranični trougao)');
    Q(3, 'Trapez ima osnovice $9 cm$ i $6 cm$ i oba ugla na dužoj osnovici po $60°$. Koliki su kraci?',
      ['po $3 cm$', 'po $6 cm$', 'po $9 cm$', 'po $1,5 cm$'],
      'Trougao $EBC$ ($CE ∥ AD$) ima dva ugla od $60°$, pa je jednakostraničan, sa stranicom $EB = 9 − 6 = 3 cm$. Trapez je jednakokraki.', 'trougao',
      { mediji: G({ A: [0, 0], B: [9, 0], C: [7.5, 2.598], D: [1.5, 2.598] }, [{ p: 'ABCD', b: 0 }, { u: 'BAD', o: '60°', b: 1 }, { u: 'CBA', o: '60°', b: 1 }, { d: 'AB', o: '9 cm' }, { d: 'DC', o: '6 cm' }], { velicina: 220 }),
        medijiOdgovora: G({ A: [0, 0], B: [9, 0], C: [7.5, 2.598], D: [1.5, 2.598], E: [6, 0] }, [{ p: 'ABCD', b: 0, prazno: 1 }, { p: 'AECD', b: 4 }, { p: 'EBC', b: 2, gusto: 1 }, { d: 'EB', o: '3' }, { d: 'BC', o: '3' }], { velicina: 220 }) });
    {
      // jednakokraki trapez: b = 3, δ = 105°, dijagonala AC
      const td = { A: [0, 0], B: [6, 0], C: [4.5, 2.5], D: [1.5, 2.5] };
      Q(2, 'Jednakokraki trapez je zadat kraćom osnovicom $CD$, dijagonalom $AC$ i tupim uglom $δ$ kod temena $D$. Koji trougao se konstruiše prvi?',
        ['$ACD$, po stavu SSU', '$ABC$, po stavu SUS', '$ABD$, po stavu SSS', '$ACD$, po stavu USU'],
        'U trouglu $ACD$ poznate su stranice $CD$ i $AC$ i ugao $δ$ naspram veće od njih ($AC$) – to je stav SSU. Teme $B$ je u preseku kružnica $k(D, AC)$ (dijagonale su jednake) i $k(C, AD)$ (kraci su jednaki).', 'dijagonala',
        { mediji: G(td, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1, o: 'd' }, { d: 'DC', o: 'b' }, { u: 'ADC', o: 'δ', b: 2 }], { velicina: 220 }),
          medijiOdgovora: G(td, [{ p: 'ACD', b: 1, gusto: 1 }, sestar('D', td.D, td.B, { b: 2, kasni: 0.5 }), sestar('C', td.C, td.B, { b: 5, kasni: 1.2 }), { d: 'AB', b: 0, crtaj: 1, kasni: 2 }, { d: 'CB', b: 0, crtaj: 1, kasni: 2.3 }, { tacka: 'B' }], { velicina: 220 }) });
      proveri(Math.abs(dist(td.A, td.C) - dist(td.B, td.D)) < 1e-9, 'jednake dijagonale');
    }
    U(2, 'Na koje delove se trapez NE razlaže pri konstrukciji?',
      ['na dva kvadrata', 'na paralelogram i trougao', 'na dva trougla (dijagonalom)', 'na pravougaonik i dva pravougla trougla'],
      'Trapez se razlaže povlačenjem paralele sa krakom, dijagonale ili visina. Dva kvadrata bi zajedno dala pravougaonik, a ne trapez.',
      'Razlaganje na poznate figure je jedna od najvažnijih ideja u geometriji: tako ćemo računati i površinu trapeza.', 'deo');
    S(3, 'Spoji podatke o trapezu sa trouglom koji se konstruiše prvi.',
      [['$a$, $b$, $c$, $d$ (osnovice i kraci)', 'trougao $EBC$ sa stranicama $a − b$, $c$, $d$'], ['$a$, $b$ i obe dijagonale', 'trougao $AEC$ sa stranicom $a + b$'], ['$a$, krak $d$ i uglovi $α$, $β$', 'trougao određen sa $AB$ i uglovima, pa paralela kroz $D$'], ['krak, $α$ i ugao kod $D$ uz visinu', 'pravougli trougao $AED$ (USU)']],
      'Svaka konstrukcija trapeza počinje od jednog trougla, a ostatak se dobija paralelnim pravama i kružnicama.', 'trougao');
  }

  // ════════════════ 42. Deltoid ════════════════
  L('Deltoid');
  {
    const t = tDelt(2.5, 1.6, 4.5);
    const O = [0, 0];
    Q(1, 'Kako se zove četvorougao koji ima dva para jednakih susednih stranica?',
      ['deltoid', 'paralelogram', 'trapez', 'pravougaonik'],
      'Deltoid je dobio ime po grčkom slovu Δ (delta). Zbog oblika ga često zovu i „zmaj“.', 'deltoid',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }], { velicina: 200 }),
        medijiOdgovora: G(t, [{ p: 'ABCD', b: 0 }, { d: 'AB', b: 1, debljina: 4 }, { d: 'BC', b: 1, debljina: 4 }, { d: 'CD', b: 2, debljina: 4 }, { d: 'DA', b: 2, debljina: 4 }], { velicina: 200 }) });
    Q(1, 'Pod kojim uglom se seku dijagonale deltoida?',
      ['pod pravim uglom', 'pod uglom od $60°$', 'pod uglom od $45°$', 'zavisi od deltoida'],
      'Temena $B$ i $D$ su jednako udaljena od $A$ i $C$, pa oba leže na simetrali duži $AC$. Zato je prava $BD$ normalna na $AC$.', 'normala',
      { mediji: G({ ...t, O }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1 }, { d: 'BD', b: 2 }], { bezImena: ['O'], velicina: 200 }),
        medijiOdgovora: G({ ...t, O }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1 }, { d: 'BD', b: 2 }, { pu: 'COD' }], { bezImena: ['O'], velicina: 200 }) });
    Q(2, 'U deltoidu $ABCD$ je $AB = BC$ i $CD = DA$. Koja dijagonala polovi drugu?',
      ['$BD$ polovi $AC$', '$AC$ polovi $BD$', 'polove se međusobno', 'nijedna ne polovi drugu'],
      'Dijagonala $BD$ leži na simetrali duži $AC$, pa prolazi kroz njenu sredinu: $AO = OC$. Obrnuto ne važi – $O$ nije sredina $BD$.', 'polovina',
      { mediji: G({ ...t, O }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1 }, { d: 'BD', b: 2 }, { tacka: 'O' }], { velicina: 200 }),
        medijiOdgovora: G({ ...t, O }, [{ p: 'ABCD', b: 0 }, { d: 'AO', b: 1, o: 'x', debljina: 4 }, { d: 'OC', b: 1, o: 'x', debljina: 4 }, { d: 'BD', b: 2 }, { pu: 'COD' }], { velicina: 200 }) });
    Q(2, 'Od kojih trouglova se sastoji deltoid $ABCD$ ($AB = BC$, $CD = DA$) podeljen dijagonalom $AC$?',
      ['od dva jednakokraka trougla sa zajedničkom osnovicom', 'od dva podudarna pravougla trougla', 'od dva jednakostranična trougla', 'od četiri podudarna trougla'],
      'Trouglovi $ABC$ i $CDA$ su jednakokraki, a $AC$ im je zajednička osnovica. Deltoid je kao „dva šešira“ – mali i veliki – zalepljena osnovicama.', 'osnovica',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 3, crtaj: 1 }], { velicina: 200 }),
        medijiOdgovora: G(t, [{ p: 'ABC', b: 1, gusto: 1 }, { p: 'CDA', b: 2, gusto: 1 }], { velicina: 200 }) });
    Q(2, 'Koliko osa simetrije ima deltoid koji nije romb?',
      ['jednu', 'dve', 'nijednu', 'četiri'],
      'Osa simetrije je dijagonala $BD$: presavijanjem preko nje $A$ pada na $C$. Romb (kao poseban deltoid) ima dve ose.', 'osa',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }], { velicina: 200 }),
        medijiOdgovora: G({ ...t, s1: [0, -2.5], s2: [0, 5.3] }, [{ p: 'ABCD', b: 4, prazno: 1 }, { d: 's1s2', b: 3, isp: 1 }, { p: 'ABD', b: 1, gusto: 1 }, { p: 'ABD', b: 2, odrazi: 's1s2', kasni: 0.6 }], { bezImena: ['s1', 's2'], velicina: 200 }) });
    Q(1, 'Koji predmet najčešće ima oblik deltoida?',
      ['papirni zmaj', 'točak bicikla', 'ploča stola', 'vrata ormara'],
      'Papirni zmaj ima dva kraća i dva duža štapa, a ukršteni štapovi – dijagonale – stoje pod pravim uglom, baš kao kod deltoida.', 'zmaj',
      { mediji: G({ ...tDelt(2, 1.5, 4.5), r1: [0, -1.5], r2: [0.6, -2.6], r3: [-0.4, -3.6], r4: [0.4, -4.6] }, [{ p: 'ABCD', b: 1, gusto: 1 }, { d: 'AC', b: 4 }, { d: 'BD', b: 4 }, { lin: [[0, -1.5], [0.6, -2.6], [-0.4, -3.6], [0.4, -4.6]], b: 3, debljina: 2 }], { bezImena: ['A', 'B', 'C', 'D', 'r1', 'r2', 'r3', 'r4'], velicina: 170 }) });
    // uglovi
    proveri((360 - 40 - 120) / 2 === 100, '100°');
    const tu = tDelt(3, 3 / Math.tan(rad(20)), 3 / Math.tan(rad(60)));
    proveri(Math.abs(2 * Math.atan(3 / tu.B[1] * -1) * 180 / Math.PI - 40) < 0.1, 'β = 40°');
    Q(2, 'Uglovi deltoida između jednakih stranica su $40°$ i $120°$. Koliki su preostala dva ugla?',
      ['po $100°$', 'po $80°$', '$40°$ i $120°$', '$60°$ i $140°$'],
      'Preostala dva ugla grade nejednake stranice i oni su jednaki: $(360° − 40° − 120°) : 2 = 100°$.', 'ugao',
      { mediji: G(tu, [{ p: 'ABCD', b: 0 }, { u: 'ABC', o: '40°', b: 1, r: 30 }, { u: 'CDA', o: '120°', b: 2 }, { u: 'DAB', o: '?', b: 3 }, { u: 'BCD', o: '?', b: 3 }], { velicina: 200 }) });
    Q(2, 'U deltoidu $ABCD$ ($AB = BC$, $CD = DA$) ugao kod temena $A$ je $95°$. Koliki je ugao kod temena $C$?',
      ['$95°$', '$85°$', '$190°$', '$265°$'],
      'Uglovi kod $A$ i $C$ nalaze se između nejednakih stranica, a takvi uglovi deltoida su jednaki – oni se preklope presavijanjem preko ose $BD$.', 'jednak',
      { mediji: G(t, [{ p: 'ABCD', b: 0 }, { u: 'DAB', o: '95°', b: 1 }, { u: 'BCD', o: '?', b: 2 }], { velicina: 200 }) });
    // koordinate
    Q(2, 'Tačke $A(−2, 0)$, $B(0, −3)$ i $C(5, 0)$ su temena deltoida $ABCD$ čija je osa $AC$. Koje su koordinate temena $D$?',
      ['$D(0, 3)$', '$D(5, 3)$', '$D(0, 5)$', '$D(3, 0)$'],
      'Osa deltoida je $AC$ (na $x$-osi), pa je $D$ odraz tačke $B$ preko $x$-ose: $D(0, 3)$. Tada je $AB = AD$ i $CB = CD$.', 'odraz',
      { mediji: G({ A: [-2, 0], B: [0, -3], C: [5, 0] }, [{ mreza: [-3, 6, -4, 4] }, { d: 'AB', b: 0 }, { d: 'BC', b: 0 }, { tacka: 'ABC', b: 1 }], { velicina: 230 }),
        medijiOdgovora: G({ A: [-2, 0], B: [0, -3], C: [5, 0], D: [0, 3] }, [{ mreza: [-3, 6, -4, 4] }, { p: 'ABCD', b: 0 }, { d: 'AB', b: 2, odrazi: 'AC', kasni: 0.4 }, { d: 'BC', b: 2, odrazi: 'AC', kasni: 0.4 }, { tacka: 'ABCD', b: 1 }], { velicina: 230 }) });
    // upisani krug
    {
      const s = 2.5, p = 1.6, q = 4.5;
      // centar (0, y) jednako udaljen od pravih AB i AD
      const rast = (y, P1, P2) => Math.abs((P2[1] - P1[1]) * 0 - (P2[0] - P1[0]) * y + P2[0] * P1[1] - P2[1] * P1[0]) / dist(P1, P2);
      let lo = -p, hi = q;
      for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (rast(m, t.A, t.B) < rast(m, t.A, t.D)) lo = m; else hi = m; }
      const yc = r(lo), rr = r(rast(lo, t.A, t.B));
      proveri(Math.abs(rast(lo, t.A, t.B) - rast(lo, t.A, t.D)) < 1e-6 && s > 0, 'upisani krug');
      Q(3, 'Može li se u svaki (konveksan) deltoid upisati krug koji dodiruje sve četiri stranice?',
        ['da – centar je na dijagonali $BD$', 'ne – samo u kvadrat', 'ne – samo u romb', 'da – centar je u preseku dijagonala'],
        'Centar je na osi simetrije $BD$, u tački koja je jednako udaljena od stranica $AB$ i $AD$ (na simetrali ugla $A$). Po simetriji je isto udaljena i od $CB$ i $CD$.', 'krug',
        { mediji: G(t, [{ p: 'ABCD', b: 0 }], { velicina: 200 }),
          medijiOdgovora: G({ ...t, S: [0, yc] }, [{ p: 'ABCD', b: 0 }, { d: 'BD', b: 4, isp: 1 }, { kr: 'S', r: rr, b: 2, crtaj: 1 }, { tacka: 'S', b: 2 }], { velicina: 200 }) });
    }
    // tri jednaka ugla
    const tt = tDelt(3, 3 / Math.tan(rad(50)), 3 / Math.tan(rad(30)));
    proveri(Math.abs((Math.atan(tt.D[1] / 3) + Math.atan(-tt.B[1] / 3)) * 180 / Math.PI - 100) < 0.1, 'α = 100°');
    Q(3, 'Postoji li deltoid čija su tri unutrašnja ugla jednaka?',
      ['da – npr. $100°$, $100°$, $100°$ i $60°$', 'ne – tada bi bio kvadrat', 'ne – zbir uglova to ne dozvoljava', 'da – ali samo $90°$, $90°$, $90°$ i $90°$'],
      'Dva ugla deltoida su ionako jednaka. Ako je i jedan od preostala dva isti, npr. po $100°$, četvrti je $360° − 300° = 60°$.', 'tri',
      { mediji: G(tt, [{ p: 'ABCD', b: 0 }], { velicina: 200 }),
        medijiOdgovora: G(tt, [{ p: 'ABCD', b: 0 }, { u: 'DAB', o: '100°', b: 1 }, { u: 'BCD', o: '100°', b: 1 }, { u: 'ABC', o: '100°', b: 1 }, { u: 'CDA', o: '60°', b: 2 }], { velicina: 200 }) });
    // dva prava ugla
    const tpr = tDelt(3, 1.8, 5);
    proveri(Math.abs(1.8 * 5 - 9) < 1e-9, 'p·q = s² → α = 90°');
    Q(2, 'Mogu li dva ugla deltoida biti prava?',
      ['da – dva jednaka ugla kod $A$ i $C$', 'ne – deltoid nema pravih uglova', 'da – ali samo ako je kvadrat', 'ne – zbir bi bio veći od $360°$'],
      'Uglovi između nejednakih stranica su jednaki i oba mogu biti po $90°$. Preostala dva tada imaju zbir $180°$, npr. $64°$ i $116°$.', 'pravi',
      { mediji: G(tpr, [{ p: 'ABCD', b: 0 }], { velicina: 190 }),
        medijiOdgovora: G(tpr, [{ p: 'ABCD', b: 0 }, { pu: 'DAB' }, { pu: 'BCD' }], { velicina: 190 }) });
    Q(3, 'Dva ugla deltoida su $110°$ i $120°$. Koliko ima različitih deltoida sa tim uglovima (gledano po uglovima)?',
      ['tri', 'jedan', 'dva', 'četiri'],
      'Ili su $110°$ jednaki uglovi (pa je četvrti $20°$), ili su $120°$ jednaki (četvrti $10°$), ili su $110°$ i $120°$ različiti, a preostala dva po $65°$.', 'mogućnost',
      { medijiOdgovora: (() => {
        // tri deltoida sa vodoravnom osom: ugao β levo, δ desno (oba između jednakih stranica)
        const dl = (beta, delta, y0, b, o) => {
          const s0 = 1, p = s0 / Math.tan(rad(beta / 2)), q = s0 / Math.tan(rad(delta / 2));
          return [{ lin: [[0, y0], [r(p), r(y0 + s0)], [r(p + q), y0], [r(p), r(y0 - s0)]], zatv: 1, b }, { tx: o, at: [r(p + q + 0.3), y0], vel: 13 }];
        };
        proveri(110 + 110 + 120 + 20 === 360 && 120 + 120 + 110 + 10 === 360 && 110 + 120 + 65 + 65 === 360, 'tri deltoida');
        return G({ o: [0, 0] }, [dl(120, 20, 0, 1, ''), dl(110, 10, -3, 2, ''), dl(110, 120, -6, 5, ''), { tx: '110°, 110°, 120°, 20°', at: [5, 1.4] }, { tx: '120°, 120°, 110°, 10°', at: [5, -1.6] }, { tx: '110°, 120°, 65°, 65°', at: [5, -4.6] }], { velicina: 260 });
      })() });
    U(2, 'Šta od ovoga NIJE osobina svakog deltoida?',
      ['dijagonale su jednake', 'dijagonale su normalne', 'jedna dijagonala polovi drugu', 'dva naspramna ugla su jednaka'],
      'Dijagonale deltoida su u opštem slučaju različite dužine – na crtežu „zmaja“ je uspravna dijagonala mnogo duža.',
      'Deltoid i romb imaju normalne dijagonale, pa im se površina računa istom formulom: polovina proizvoda dijagonala.', 'dijagonala',
      { mediji: G({ ...t, O: [0, 0] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1 }, { d: 'BD', b: 2 }], { bezImena: ['O'], velicina: 200 }) });
    S(2, 'Spoji četvorougao sa osobinom njegovih dijagonala.',
      [['paralelogram', 'polove se'], ['pravougaonik', 'jednake su i polove se'], ['deltoid', 'normalne su, jedna polovi drugu'], ['jednakokraki trapez', 'jednake su, ali se ne polove']],
      'Kvadrat ima „sve“: dijagonale su mu jednake, normalne i polove se.', 'dijagonala');
  }
};
