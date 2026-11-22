// Lekcije 1–5: kvadrat racionalnog broja, x² = a, kvadratni koren, iracionalni brojevi, decimalni zapisi.
// Pitanja su teorija i razumevanje (bez računa na papiru); crteži uz pitanje su kvadrati, brojevne prave,
// parabole, trouglovi, kvadratne mreže i trake razlomaka.
module.exports = ({ L, Q, U, S, G, r, krug, traka, proveri }) => {

  // ── pomoćni crteži ──
  // kvadratna mreža n×m kockica (a = stranica kockice); ob = obojene kockice [kolona, red], nat = natpisi { 'kol,red': tekst }
  const polje = (n, m, { ob = [], nat = {}, a = 1 } = {}) => {
    const e = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
      const x = i * a, y = j * a;
      const ok = ob.some(([p, q]) => p === i && q === j);
      e.push({ lin: [[x, y], [x + a, y], [x + a, y + a], [x, y + a]].map((p) => p.map(r)), zatv: 1, b: ok ? 1 : 4, ...(ok ? { gusto: 1 } : { prazno: 1 }) });
      if (nat[`${i},${j}`] !== undefined) e.push({ tx: nat[`${i},${j}`], at: [r(x + a / 2), r(y + a / 2)], vel: 16, b: 1 });
    }
    return G({}, e, { velicina: 260 });
  };
  // kvadrat stranice a (bez mreže); dole = oznaka stranice, sredina = oznaka površine
  const kvadrat = (a, { dole, sredina, velicina = 240 } = {}) => {
    const e = [{ lin: [[0, 0], [a, 0], [a, a], [0, a]].map((p) => p.map(r)), zatv: 1, b: 1, prazno: 1 }];
    if (dole) e.push({ tx: dole, at: [r(a / 2), r(-0.45 * a)], vel: 16, b: 1 });
    if (sredina) e.push({ tx: sredina, at: [r(a / 2), r(a / 2)], vel: 16, b: 1 });
    return G({}, e, { velicina });
  };
  // isti kvadrat podeljen na delove (dimenzije sa oznakama površine)
  const razlozen = (a, b, delovi) => {
    const e = [];
    for (const [x0, y0, x1, y1, oznaka, boja] of delovi) {
      e.push({ lin: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map((p) => p.map(r)), zatv: 1, b: boja, gusto: 1 });
      e.push({ tx: oznaka, at: [r((x0 + x1) / 2), r((y0 + y1) / 2)], vel: 16, b: 1 });
    }
    return G({}, e, { velicina: 260 });
  };
  // brojevna prava [a, b]; tacke = [[x, oznaka, gore, boja]] – oznaka iznad (gore) ili ispod prave
  const prava = (a, b, tacke = [], { podela = 1, svaki = 1, velicina = 320 } = {}) => {
    const t = {};
    // oznake su blizu prave, srazmerno njenom rasponu (da uzak deo prave ne bi bio sitan na crtežu)
    const dy = Math.min(0.75, (b - a) * 0.2);
    const e = [{ osa: [a, b], podela, svaki }];
    tacke.forEach(([x, ozn, gore = true, boja = 1], i) => {
      const ime = 'abcdefgh'[i];
      t[ime] = [r(x), 0];
      e.push({ tacka: ime, b: boja });
      e.push({ tx: ozn, at: [r(x), gore ? dy : -dy * 1.1], vel: 18, b: boja });
    });
    return G(t, e, { velicina });
  };
  // parabola y = x² na mreži [x0, x1] × [y0, y1]; a = prava y = a (isprekidana); tacke = [[x, y, natpis]]
  const parabola = ({ x0 = -3, x1 = 3, y0 = -1, y1 = 10, a, tacke = [], podela = 1, brojevi = true, velicina = 300 } = {}) => {
    const e = [{ mreza: [x0, x1, y0, y1], podela, ...(brojevi ? {} : { brojevi: 0 }) }];
    const pts = [];
    for (let k = 0; k <= 60; k++) { const x = x0 + ((x1 - x0) * k) / 60; pts.push([r(x), r(x * x)]); }
    e.push({ lin: pts, b: 0, debljina: 3 });
    if (a !== undefined) e.push({ lin: [[x0, a], [x1, a]], isp: 1, b: 2 });
    for (const [x, y, nat, boja = 2] of tacke) {
      e.push({ tx: '●', at: [x, y], vel: 22, b: boja });
      if (nat != null) e.push({ tx: nat, at: [x, y0 + (y1 - y0) * 0.08], vel: 16, b: boja });
    }
    return G({}, e, { velicina });
  };
  // trougao sa pravim uglom kod A, katete AB = AC = 1 (hipotenuza BC)
  const trougao = (katete, hipotenuza, { b = 1 } = {}) => G(
    { A: [0, 0], B: [katete, 0], C: [0, katete] },
    [{ p: 'ABC', b, gusto: 1 }, { pu: 'BAC' }, { d: 'AB', o: String(katete).replace('.', ','), b }, { d: 'AC', o: String(katete).replace('.', ','), b }, { d: 'BC', o: hipotenuza, b: 2 }],
    { bezImena: ['A', 'B', 'C'], velicina: 240 });
  // kvadrat sa temenima u čvorovima mreže 3×3 (površina 5): (1,0), (3,1), (2,3), (0,2)
  const nagnut = (n, { trouglovi = false } = {}) => {
    const e = [{ lin: [[1, 0], [3, 1], [2, 3], [0, 2]], zatv: 1, b: 1, gusto: 1 }];
    for (let i = 0; i <= 3; i++) e.push({ lin: [[i, 0], [i, 3]], b: 4, debljina: 1 }, { lin: [[0, i], [3, i]], b: 4, debljina: 1 });
    if (trouglovi) {
      // četiri pravougla trougla u uglovima kvadrata 3×3 (svaki površine 1)
      const T4 = [[[1, 0], [3, 0], [3, 1]], [[3, 1], [3, 3], [2, 3]], [[2, 3], [0, 3], [0, 2]], [[0, 2], [0, 0], [1, 0]]];
      T4.forEach((t, i) => e.push({ lin: t, zatv: 1, b: 2, gusto: 1, id: 'tr' + i }));
      e.push({ lin: [[0, 0], [3, 0], [3, 3], [0, 3]], zatv: 1, b: 4, prazno: 1, debljina: 2 });
    }
    return G({}, e, { velicina: 240 });
  };

  // Qz(težina, pitanje, odgovori, [objašnjenje], zanimljivost, pojam, { mediji… }): ako su dva teksta pre pojma,
  // spajaju se u jedno polje zanimljivost (objašnjenje tačnog odgovora + neočigledna činjenica)
  const Qz = (t, p, o, ...ost) => {
    const x = typeof ost[ost.length - 1] === 'object' ? ost.pop() : {};
    const [zan, rec] = ost.length === 3 ? [ost[0] + ' ' + ost[1], ost[2]] : ost;
    return Q(t, p, o, zan, rec, x);
  };

  // provere računa (gradnja pukne ako nije tačno)
  proveri(Math.sqrt(5) > 2.2 && Math.sqrt(5) < 2.3, '√5 ≈ 2,236');
  proveri(Math.sqrt(2) > 1.4 && Math.sqrt(2) < 1.5, '√2 ≈ 1,414');
  proveri(Math.sqrt(10) > 3 && Math.sqrt(10) < 4, '√10 ≈ 3,16');
  proveri(Math.abs(Math.sqrt(3) - 1.7 - 0.032) < 0.001, '√3 − 1,7 ≈ 0,032');
  proveri(Math.sqrt(3) > 1.65 && Math.sqrt(3) < 1.75, '√3 ≈ 1,73');
  proveri(Math.abs(22 / 7 - Math.PI) < Math.abs(3.14 - Math.PI), '22/7 je bliže π od 3,14');
  proveri(Math.abs(0.07 * 0.07 - 0.0049) < 1e-12, '0,07² = 0,0049');
  proveri(Math.abs(1 / 7 - 0.142857142857) < 1e-9, '1/7 = 0,(142857)');
  proveri(Math.abs(5 / 12 - 0.41666666) < 1e-6, '5/12 = 0,41(6)');
  proveri(Math.abs(45 / 99 - 5 / 11) < 1e-12, '0,(45) = 5/11');

  // ── 1. Kvadrat racionalnog broja ──
  L('Kvadrat racionalnog broja');
  Qz(1, 'Kolika je površina kvadrata čija je stranica $\\frac{1}{2}$ dm? Površina je u dm².',
    ['$\\frac{1}{4}$ dm²', '$\\frac{1}{2}$ dm²', '$\\frac{1}{8}$ dm²', '$\\frac{1}{3}$ dm²'],
    'Površina kvadrata je stranica na kvadrat: $\\frac{1}{2}\\cdot\\frac{1}{2}=\\frac{1}{4}$ dm². Kvadrat čija je stranica manja dva puta ima površinu manju četiri puta.',
    'Kad stranicu prepolovimo, površina se ne prepolovi nego se smanji četiri puta.', 'kvadrat',
    { mediji: kvadrat(0.5, { dole: '1/2 dm', sredina: 'P = ?' }),
      medijiOdgovora: polje(2, 2, { ob: [[0, 0]], nat: { '0,0': '1/4 dm²' } }) });
  Qz(1, 'Koliko je kvadrat broja $-4$?',
    ['16', '−16', '8', '−8'],
    'Kvadrat broja je broj pomnožen samim sobom: $(-4)\\cdot(-4)=16$. Minus puta minus daje plus.',
    'Kvadrat svakog broja, i pozitivnog i negativnog, nikad nije negativan.', 'kvadrat',
    { medijiOdgovora: { vrsta: 'formula', tekst: '(−4) · (−4) = 16' } });
  Qz(1, 'Kolika je površina kvadrata čija je stranica $0,3$ dm?',
    ['0,09 dm²', '0,6 dm²', '0,9 dm²', '0,03 dm²'],
    'Kvadriramo: $0,3\\cdot0,3=0,09$ dm². Površina je manja od stranice, jer je stranica manja od jedan.',
    'Pri množenju se brojevi decimala sabiraju: jedna decimala plus jedna decimala daje dve.', 'kvadrat',
    { mediji: kvadrat(0.3, { dole: '0,3 dm', sredina: 'P = ?' }),
      medijiOdgovora: { vrsta: 'formula', tekst: '0,3 · 0,3 = 0,09 dm²' } });
  Qz(1, 'Koliko je $-4^{2}$?',
    ['−16', '16', '−8', '−4'],
    'Bez zagrada se stepen odnosi samo na broj 4: $-4^{2}=-(4\\cdot4)=-16$. Zato je $(-4)^{2}$ nešto drugo.',
    'Zagrade menjaju rezultat: $(-4)^{2}$ i $-4^{2}$ nisu isti broj.', 'zagrade',
    { medijiOdgovora: { vrsta: 'formula', tekst: '−4² = −(4 · 4) = −16' } });
  S(1, 'Spoji broj sa njegovim kvadratom.',
    [['$\\frac{3}{4}$', '$\\frac{9}{16}$'], ['$-0,1$', '$0,01$'], ['$\\frac{2}{5}$', '$\\frac{4}{25}$'], ['$-7$', '$49$']],
    'Brojevi $x$ i $-x$ imaju isti kvadrat: $(-7)^{2}=7^{2}=49$.', 'kvadrat');
  Qz(2, 'Kom broju je kvadrat veći od njega?',
    ['$-\\frac{1}{2}$', '$\\frac{1}{2}$', '$1$', '$0$'],
    'Kvadrat negativnog broja je pozitivan, pa je uvek veći od njega: $(-\\frac{1}{2})^{2}=\\frac{1}{4}>-\\frac{1}{2}$. Za $\\frac{1}{2}$ kvadrat je manji, a za $0$ i $1$ je jednak.',
    'Brojevi 0 i 1 su jedini pozitivni brojevi jednaki svojim kvadratima. Svi brojevi između 0 i 1 imaju manji kvadrat.', 'negativan',
    { medijiOdgovora: { vrsta: 'formula', tekst: '(−1/2)² = 1/4, a 1/4 > −1/2' } });
  Qz(2, 'Ako je $0<x<1$, koja nejednakost je tačna?',
    ['$x^{2}<x$', '$x^{2}>x$', '$x^{2}=x$', '$x^{2}>1$'],
    'Kad broj $x<1$ pomnožimo pozitivnim brojem $x$, dobijamo $x\\cdot x<1\\cdot x$, pa je $x^{2}<x$.',
    'Broj između 0 i 1 je pri kvadriranju još manji: 0,6 postaje 0,36.', 'nejednakost',
    { medijiOdgovora: prava(0, 1, [[0.6, 'x', true, 1], [0.36, 'x²', false, 2]], { podela: 0.1, svaki: 10 }) });
  Qz(2, 'Kolika je površina kvadrata čija je stranica $\\frac{2}{3}$ dm? Površina je u dm².',
    ['$\\frac{4}{9}$ dm²', '$\\frac{4}{6}$ dm²', '$\\frac{2}{9}$ dm²', '$\\frac{4}{3}$ dm²'],
    'Kvadriramo i brojilac i imenilac: $(\\frac{2}{3})^{2}=\\frac{2\\cdot2}{3\\cdot3}=\\frac{4}{9}$.',
    'Kvadrat razlomka nije „dvostruki“ razlomak: brojilac i imenilac se oba kvadriraju.', 'imenilac',
    { mediji: kvadrat(2 / 3, { dole: '2/3 dm', sredina: 'P = ?' }),
      medijiOdgovora: { vrsta: 'formula', tekst: '(2/3)² = 2·2 / 3·3 = 4/9 dm²' } });
  Qz(2, 'Na mreži 3 × 3 kvadratić je stranice $\\frac{1}{3}$ dm. Kolika je površina jednog kvadratića?',
    ['$\\frac{1}{9}$ dm²', '$\\frac{1}{3}$ dm²', '$\\frac{1}{6}$ dm²', '$\\frac{1}{81}$ dm²'],
    'Stranica kvadratića je $\\frac{1}{3}$ dm, pa mu je površina $\\frac{1}{3}\\cdot\\frac{1}{3}=\\frac{1}{9}$ dm².',
    'Mreža 3 × 3 ima devet jednakih kvadratića, pa je svaki deo cele površine.', 'kvadrat',
    { mediji: polje(3, 3), medijiOdgovora: polje(3, 3, { ob: [[0, 0]], nat: { '0,0': '1/9' } }) });
  Qz(2, 'Kvadrat ima stranicu 1,5 dm. Kolika mu je površina?',
    ['2,25 dm²', '3 dm²', '1,5 dm²', '0,225 dm²'],
    'Površina je $1,5\\cdot1,5=2,25$ dm². Ako kvadrat podelimo na četiri dela (1 + 0,5 + 0,5 + 0,25), dobijemo isti zbir.',
    'Dvostruka stranica daje četiri puta veću površinu, a ne dva puta veću.', 'kvadrat',
    { mediji: kvadrat(1.5, { dole: '1,5 dm', sredina: 'P = ?' }),
      medijiOdgovora: razlozen(1.5, 1.5, [[0, 0, 1, 1, '1', 1], [1, 0, 1.5, 1, '0,5', 2], [0, 1, 1, 1.5, '0,5', 3], [1, 1, 1.5, 1.5, '0,25', 4]]) });
  Qz(2, 'Kolika je površina kvadrata čija je stranica $1,1$ dm?',
    ['1,21 dm²', '1,11 dm²', '2,2 dm²', '1,10 dm²'],
    '$1,1\\cdot1,1=1,21$. Kvadrat se ne računa tako što se broju doda 0,01: decimale se množe.',
    'Za brojeve veće od 1 kvadrat je veći od broja: $1,1^{2}>1,1$.', 'kvadrat',
    { mediji: kvadrat(1.1, { dole: '1,1 dm', sredina: 'P = ?' }),
      medijiOdgovora: { vrsta: 'formula', tekst: '1,1 · 1,1 = 1,21 dm²' } });
  Qz(2, 'Mreža 5 × 5 ima kvadratiće jednake stranice. Obojen je kvadrat stranice 2 kvadratića. Kolika je površina obojenog dela ako je cela mreža 1 dm²?',
    ['$\\frac{4}{25}$ dm²', '$\\frac{2}{5}$ dm²', '$\\frac{4}{5}$ dm²', '$\\frac{2}{25}$ dm²'],
    'Stranica obojenog dela je $\\frac{2}{5}$ cele stranice, pa je površina $(\\frac{2}{5})^{2}=\\frac{4}{25}$ dm². Od 25 kvadratića obojeno je 4.',
    'Kvadrat razlomka je kvadrat i brojioca i imenioca, pa je $\\frac{2}{5}$ kvadrirano $\\frac{4}{25}$.', 'mreza',
    { mediji: polje(5, 5), medijiOdgovora: polje(5, 5, { ob: [[0, 0], [1, 0], [0, 1], [1, 1]], nat: { '0,0': '4/25' } }) });
  Qz(3, 'Koja cifra NE može biti poslednja cifra kvadrata celog broja?',
    ['2', '4', '5', '9'],
    'Kvadrati celih brojeva se završavaju cifrom 0, 1, 4, 5, 6 ili 9 ($2^{2}=4$, $5^{2}=25$, $3^{2}=9$).',
    'Zato se broj koji se završava cifrom 2, 3, 7 ili 8 nikad ne može dobiti kao kvadrat celog broja.', 'cifra');
  Qz(3, 'Koliko je $(-\\frac{3}{4})^{2}$?',
    ['$\\frac{9}{16}$', '$-\\frac{9}{16}$', '$\\frac{3}{8}$', '$-\\frac{3}{8}$'],
    'Množimo broj sam sa sobom: $(-\\frac{3}{4})\\cdot(-\\frac{3}{4})=\\frac{9}{16}$. Rezultat je pozitivan.',
    'Kvadrat je uvek nenegativan, i za negativne razlomke.', 'razlomak',
    { medijiOdgovora: { vrsta: 'formula', tekst: '(−3/4) · (−3/4) = 9/16' } });
  Qz(3, 'Koji je najmanji broj među ovim?',
    ['$-3^{2}$', '$-2$', '$(-3)^{2}$', '$3^{2}$'],
    '$-3^{2}=-9$, a $-2$ je veće od $-9$. Ostala dva su pozitivna (9).',
    'Minus ispred kvadrata menja znak rezultata: $-3^{2}$ je negativan broj, a $(-3)^{2}$ pozitivan.', 'stepen');
  Qz(3, 'Na brojevnoj pravoj su tačke A i B. Čiji kvadrat je veći?',
    ['Kvadrat broja u tački A', 'Kvadrat broja u tački B', 'Jednaki su', 'Ne može se odrediti'],
    'Tačka A je $-5$, a tačka B je $-2$. Kvadriramo: $(-5)^{2}=25$, a $(-2)^{2}=4$, pa je $25>4$. Veći kvadrat ima tačka A.',
    'Kod negativnih brojeva važi obrnuto: što je broj dalje od nule, to mu je kvadrat veći.', 'obrnuto',
    { mediji: prava(-6, 0, [[-5, 'A', true, 1], [-2, 'B', false, 2]]),
      medijiOdgovora: { vrsta: 'formula', tekst: '(−5)² = 25, (−2)² = 4, 25 > 4' } });

  Qz(2, 'Kvadrat je sastavljen od kockica, a stranica ima 4 kockice. Koliko kockica ima ceo kvadrat?',
    ['16', '8', '4', '12'],
    'Kvadrat broja je broj pomnožen samim sobom: $4\\cdot4=16$ kockica. Ima 4 reda, a u svakom redu 4 kockice.',
    'Kvadrat od kockica stranice $n$ ima $n^{2}$ kockica.', 'kockica',
    { mediji: polje(4, 4), medijiOdgovora: { vrsta: 'formula', tekst: '4 · 4 = 16 kockica' } });

  // ── 2. Rešavanje jednačine x² = a ──
  L('Rešavanje jednačine x² = a');
  Qz(1, 'Na slici su parabola $y=x^{2}$ i prava $y=0$. Koliko rešenja ima jednačina $x^{2}=0$?',
    ['Jedno', 'Dva', 'Nijedno', 'Beskonačno mnogo'],
    'Jedino nula ima kvadrat jednak nuli, pa je rešenje samo $x=0$. Parabola samo dodiruje x-osu u jednoj tački.',
    'Nula je jedini broj čiji je kvadrat nula.', 'nula',
    { mediji: parabola({ a: 0 }),
      medijiOdgovora: parabola({ a: 0, tacke: [[0, 0, '0', 2]] }) });
  Qz(1, 'Na slici su parabola $y=x^{2}$ i prava $y=9$. Koliko rešenja ima jednačina $x^{2}=9$?',
    ['Dva', 'Jedno', 'Nijedno', 'Četiri'],
    'Rešenja su $x=3$ i $x=-3$: oba broja imaju kvadrat 9.',
    'Pozitivni i negativni broj istog apsolutnog iznosa imaju isti kvadrat.', 'kvadrat',
    { mediji: parabola({ a: 9, y1: 10 }),
      medijiOdgovora: parabola({ a: 9, y1: 10, tacke: [[-3, 9, null, 2], [3, 9, null, 2]] }) });
  Qz(1, 'Na slici su parabola $y=x^{2}$ i prava $y=-4$. Koliko rešenja ima jednačina $x^{2}=-4$?',
    ['Nijedno', 'Dva', 'Jedno', 'Četiri'],
    'Kvadrat nijednog realnog broja nije negativan, pa jednačina nema rešenja. Parabola je cela iznad x-ose, a prava ispod nje.',
    'Parabola $y=x^{2}$ nikad ne ide ispod x-ose, pa sa njom nema preseka.', 'negativan',
    { mediji: parabola({ a: -4, y0: -5 }),
      medijiOdgovora: parabola({ a: -4, y0: -5 }) });
  Qz(1, 'Koji su koreni jednačine $x^{2}=1$?',
    ['$x=±1$', '$x=1$', '$x=-1$', '$x=0$ i $x=1$'],
    'Brojevi $1$ i $-1$ imaju kvadrat $1$, a nijedan drugi broj ne. Zato je $x=±1$, dva rešenja.',
    'Brojevi 0 i 1 su jedini jednaki svojim kvadratima; jednačina $x^{2}=1$ nije isto što i $x^{2}=x$.', 'jedinica',
    { medijiOdgovora: parabola({ a: 1, tacke: [[-1, 1, null, 2], [1, 1, null, 2]] }) });
  Qz(2, 'Na slici je zumirana parabola $y=x^{2}$ i prava $y=\\frac{1}{4}$. Koji je skup rešenja jednačine $x^{2}=\\frac{1}{4}$?',
    ['$\\{-\\frac{1}{2}, \\frac{1}{2}\\}$', '$\\{\\frac{1}{4}\\}$', '$\\{-\\frac{1}{4}, \\frac{1}{4}\\}$', '$\\{\\frac{1}{2}\\}$'],
    '$(\\frac{1}{2})^{2}=\\frac{1}{4}$ i $(-\\frac{1}{2})^{2}=\\frac{1}{4}$, pa su rešenja dva suprotna broja $±\\frac{1}{2}$.',
    'Ako je $a=b^{2}$, rešenja jednačine $x^{2}=a$ su dva suprotna broja $b$ i $-b$.', 'skup',
    { mediji: parabola({ x0: -1, x1: 1, y0: -0.2, y1: 1.2, a: 0.25, podela: [0.5, 0.25] }),
      medijiOdgovora: parabola({ x0: -1, x1: 1, y0: -0.2, y1: 1.2, a: 0.25, podela: [0.5, 0.25], tacke: [[-0.5, 0.25, null, 2], [0.5, 0.25, null, 2]] }) });
  Qz(2, 'Na slici su parabola $y=x^{2}$ i prava $y=5$. Koja su rešenja jednačine $x^{2}-5=0$?',
    ['$x=±\\sqrt{5}$', '$x=\\sqrt{5}$', '$x=±5$', '$x=±2,5$'],
    'Jednačinu prepišemo kao $x^{2}=5$. Rešenja su $x=±\\sqrt{5}$: dva suprotna broja, a $\\sqrt{5}$ nije ceo broj.',
    'Rešenja su iracionalni brojevi, jer 5 nije potpun kvadrat.', 'koren',
    { mediji: parabola({ a: 5, y1: 10 }),
      medijiOdgovora: { vrsta: 'formula', tekst: 'x² = 5, pa je x = ±√5 (dva rešenja)' } });
  U(2, 'Koja jednačina je uljez, tj. NEMA rešenja među realnim brojevima?',
    ['$x^{2}=-9$', '$x^{2}=0$', '$x^{2}=9$', '$x^{2}=\\frac{9}{4}$'],
    'Kvadrat realnog broja nikad nije negativan, pa $x^{2}=-9$ nema rešenja. Ostale imaju jedno ili dva rešenja.',
    'Jednačina $x^{2}=-9$ je jedina bez rešenja, a $x^{2}=0$ ima samo jedno rešenje.', 'kvadrat');
  Qz(2, 'Na slici je parabola $y=x^{2}$. Za koje vrednosti $a$ prava $y=a$ seče parabolu u dve tačke?',
    ['$a>0$', '$a<0$', '$a=0$', '$a\\ge0$'],
    'Za $a>0$ prava seče parabolu u dve tačke ($x=±\\sqrt{a}$). Za $a=0$ je samo jedna tačka, a za $a<0$ nema preseka.',
    'Parabola $y=x^{2}$ je simetrična i njen vrh je u nuli.', 'presek',
    { mediji: parabola({ y1: 10 }),
      medijiOdgovora: parabola({ a: 2, y1: 10, tacke: [[-1.414, 2, null, 2], [1.414, 2, null, 2]] }) });
  Qz(2, 'Kvadrat na slici ima površinu 36 cm². Koja jednačina opisuje njegovu stranicu $x$?',
    ['$x^{2}=36$', '$2x=36$', '$4x=36$', '$x^{2}=18$'],
    'Površina kvadrata je stranica na kvadrat, pa je $x\\cdot x=36$, tj. $x^{2}=36$.',
    'Kad stranicu udvostručimo, površina se učetvorostruči.', 'kvadrat',
    { mediji: kvadrat(1, { dole: 'x', sredina: 'P = 36 cm²' }),
      medijiOdgovora: { vrsta: 'formula', tekst: 'x · x = 36, pa je x = 6 cm' } });
  Qz(2, 'Koji skup je rešenje jednačine $x^{2}=16$?',
    ['$\\{-4, 4\\}$', '$\\{4\\}$', '$\\{16\\}$', '$\\{-16, 16\\}$'],
    '$4^{2}=16$ i $(-4)^{2}=16$, pa su rešenja $-4$ i $4$.',
    'Jednačina $x^{2}=0,01$ ima dva rešenja, a $x^{2}=-1$ nijedno, jer je kvadrat realnog broja nenegativan.', 'skup');
  Qz(2, 'Koja su rešenja jednačine $x^{2}=\\frac{49}{16}$?',
    ['$x=±\\frac{7}{4}$', '$x=±\\frac{49}{8}$', '$x=±\\frac{49}{4}$', '$x=±\\frac{4}{7}$'],
    '$\\frac{49}{16}=(\\frac{7}{4})^{2}$, pa je $x=±\\frac{7}{4}$.',
    'Korenujemo brojilac i imenilac posebno: $\\sqrt{49}=7$, $\\sqrt{16}=4$.', 'razlomak',
    { medijiOdgovora: { vrsta: 'formula', tekst: '49/16 = (7/4)², pa je x = ±7/4' } });
  Qz(3, 'Koja su rešenja jednačine $(x-5)^{2}=49$?',
    ['$x=12$ i $x=-2$', '$x=7$ i $x=-7$', '$x=-12$ i $x=2$', '$x=5$ i $x=-5$'],
    'Ako je kvadrat jednak 49, onda je $x-5=7$ ili $x-5=-7$. Zato je $x=12$ ili $x=-2$.',
    'Zagrada se ne briše: broj 5 se mora dodati ili oduzeti posle korenovanja.', 'zagrada',
    { medijiOdgovora: prava(-3, 13, [[-2, '−2', true, 2], [12, '12', false, 1]], { velicina: 340 }) });
  Qz(3, 'Za koje vrednosti $a$ jednačina $x^{2}=a$ ima tačno jedno rešenje?',
    ['$a=0$', '$a=1$', '$a<0$', '$a>0$'],
    'Samo za $a=0$ je rešenje jedno: $x=0$. Za $a<0$ nema rešenja, a za $a>0$ ima dva.',
    'To je jedina tačka dodira parabole i x-ose.', 'jedno',
    { medijiOdgovora: parabola({ a: 0, tacke: [[0, 0, null, 2]] }) });
  Qz(2, 'Za $a>0$ koja tvrdnja je tačna za rešenja jednačine $x^{2}=a$?',
    ['Dva: $±\\sqrt{a}$', 'Jedno: $\\sqrt{a}$', 'Jedno: $-\\sqrt{a}$', 'Nema rešenja'],
    'Za $a>0$ rešenja su dva suprotna broja: $x_{1}=-\\sqrt{a}$ i $x_{2}=\\sqrt{a}$.',
    'Kvadratni koren je uvek nenegativan, pa je jedan koren pozitivan, a drugi negativan.', 'koren');
  Qz(3, 'Koja jednačina ima rešenja $x=±\\frac{2}{3}$?',
    ['$x^{2}=\\frac{4}{9}$', '$x^{2}=\\frac{2}{3}$', '$3x^{2}=2$', '$x^{2}=\\frac{2}{9}$'],
    '$(\\frac{2}{3})^{2}=\\frac{4}{9}$, pa je $x^{2}=\\frac{4}{9}$. Jednačina $3x^{2}=2$ daje $x^{2}=\\frac{2}{3}$.',
    'Broj $\\frac{4}{9}$ je kvadrat broja $\\frac{2}{3}$, ali $\\frac{2}{3}$ nije kvadrat od $\\frac{2}{3}$.', 'kvadrat',
    { medijiOdgovora: parabola({ x0: -1, x1: 1, y0: -0.2, y1: 1.2, a: 4 / 9, podela: [0.5, 0.25], tacke: [[-2 / 3, 4 / 9, null, 2], [2 / 3, 4 / 9, null, 2]] }) });

  Qz(2, 'Na slici su parabola $y=x^{2}$ i prava $y=2$. Koliko rešenja ima jednačina $x^{2}=2$?',
    ['Dva', 'Jedno', 'Nijedno', 'Četiri'],
    'Rešenja su $x=±\\sqrt{2}$, dva suprotna broja. Oba su iracionalna, pa se ne mogu napisati kao razlomci.',
    'Broj $\\sqrt{2}$ nije racionalan: to je dokazao Hipas, a dokaz se i danas uči u sedmom razredu.', 'iracionalan',
    { mediji: parabola({ a: 2, y1: 10 }), medijiOdgovora: parabola({ a: 2, y1: 10, tacke: [[-1.414, 2, null, 2], [1.414, 2, null, 2]] }) });

  // ── 3. Kvadratni koren ──
  L('Kvadratni koren');
  Qz(1, 'Kvadrat ima površinu 81 cm². Kolika mu je stranica?',
    ['9 cm', '8 cm', '7 cm', '40,5 cm'],
    'Stranica je $\\sqrt{81}=9$ cm, jer je $9\\cdot9=81$.',
    'Kvadratno polje površine 81 m² ima stranicu 9 m. Koren iz površine daje stranicu.', 'koren',
    { mediji: kvadrat(1, { dole: '?', sredina: 'P = 81 cm²' }),
      medijiOdgovora: { vrsta: 'formula', tekst: '√81 = 9, jer je 9 · 9 = 81' } });
  Qz(1, 'Koliko je $\\sqrt{0}$?',
    ['0', '1', 'Ne postoji', '10'],
    'Koren iz nule je nula, jer je $0\\cdot0=0$.',
    'Jedini brojevi jednaki svom korenu su 0 i 1.', 'koren');
  Qz(1, 'Koliko je $\\sqrt{-4}$?',
    ['Ne postoji', '2', '−2', '±2'],
    'Nijedan realni broj nema kvadrat −4, jer je kvadrat uvek nenegativan. Zato koren iz negativnog broja ne postoji.',
    'U višim razredima se uvodi imaginarni broj $i$ za koji važi $i^{2}=-1$.', 'koren');
  Qz(1, 'Kvadrat ima površinu 0,09 dm². Kolika mu je stranica?',
    ['0,3 dm', '0,9 dm', '0,03 dm', '0,09 dm'],
    'Stranica je $\\sqrt{0,09}=0,3$ dm, jer je $0,3\\cdot0,3=0,09$.',
    'Reč „koren“ na latinskom je „radix“, pa se kvadratni koren označava slovom r.', 'koren',
    { mediji: kvadrat(1, { dole: '?', sredina: 'P = 0,09 dm²' }),
      medijiOdgovora: { vrsta: 'formula', tekst: '√0,09 = 0,3, jer je 0,3 · 0,3 = 0,09' } });
  Qz(1, 'Kvadrat ima površinu $\\frac{16}{25}$ dm². Kolika mu je stranica?',
    ['$\\frac{4}{5}$ dm', '$\\frac{8}{5}$ dm', '$\\frac{4}{25}$ dm', '$\\frac{16}{5}$ dm'],
    'Stranica je $\\sqrt{\\frac{16}{25}}=\\frac{\\sqrt{16}}{\\sqrt{25}}=\\frac{4}{5}$ dm.',
    'Ako su brojilac i imenilac potpuni kvadrati, koren se računa za svaki posebno.', 'koren',
    { mediji: kvadrat(1, { dole: '?', sredina: 'P = 16/25 dm²' }),
      medijiOdgovora: { vrsta: 'formula', tekst: '√(16/25) = 4/5, jer je (4/5)² = 16/25' } });
  Qz(2, 'Koliko je $\\sqrt{(-3)^{2}}$?',
    ['3', '−3', '9', '±3'],
    '$(-3)^{2}=9$, a $\\sqrt{9}=3$. Koren je uvek nenegativan.',
    'Koren iz kvadrata daje apsolutnu vrednost: $\\sqrt{a^{2}}=|a|$.', 'apsolutna',
    { medijiOdgovora: { vrsta: 'formula', tekst: '(−3)² = 9, √9 = 3 = |−3|' } });
  Qz(2, 'Kvadrat A ima površinu 9 cm², a kvadrat B površinu 16 cm². Kolika je stranica kvadrata čija je površina jednaka zbiru površina kvadrata A i B?',
    ['5 cm', '7 cm', '25 cm', '$\\sqrt{7}$ cm'],
    'Zbir površina je $9+16=25$ cm², a $\\sqrt{25}=5$ cm. Zbir korena nije koren zbira: $\\sqrt{9}+\\sqrt{16}=7$ nije tačno.',
    'Ovaj odnos (3, 4, 5) je poznat kao Pitagorina trojka i važi za pravougli trougao.', 'trojka',
    { mediji: G({}, [
        { lin: [[0, 0], [3, 0], [3, 3], [0, 3]].map((p) => p.map(r)), zatv: 1, b: 1, prazno: 1 },
        { tx: 'A: 9 cm²', at: [1.5, 1.5], vel: 16, b: 1 },
        { lin: [[3.6, 0], [7.6, 0], [7.6, 4], [3.6, 4]], zatv: 1, b: 2, prazno: 1 },
        { tx: 'B: 16 cm²', at: [5.6, 2], vel: 16, b: 2 },
      ], { velicina: 300 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '9 + 16 = 25, a √25 = 5 cm' } });
  Qz(2, 'Kvadrat je nacrtan na mreži, a njegova temena su u čvorovima mreže. Kolika mu je površina ako je kvadratić 1 cm²?',
    ['5 cm²', '4 cm²', '6 cm²', '8 cm²'],
    'Veliki kvadrat ima površinu 9 cm². Od njega treba oduzeti četiri jednaka pravougla trougla površine po 1 cm²: $9-4=5$ cm².',
    'Kvadrat površine 5 nema celobrojnu stranicu, jer 5 nije potpun kvadrat.', 'kvadrat',
    { mediji: nagnut(3), medijiOdgovora: nagnut(3, { trouglovi: true }) });
  Qz(2, 'Kvadrat je nacrtan na mreži, a njegova temena su u čvorovima mreže. Kolika je stranica tog kvadrata?',
    ['$\\sqrt{5}$ cm', '$\\sqrt{3}$ cm', '$2,5$ cm', '$\\sqrt{2}+1$ cm'],
    'Stranica je hipotenuza pravouglog trougla sa katetama 2 i 1: $\\sqrt{2^{2}+1^{2}}=\\sqrt{5}$ cm.',
    'Površina je 5, pa je stranica koren iz 5.', 'stranica',
    { mediji: nagnut(3),
      medijiOdgovora: G({ A: [0, 0], B: [2, 0], C: [0, 1] }, [{ p: 'ABC', b: 1, gusto: 1 }, { pu: 'BAC' }, { d: 'AB', o: '2', b: 1 }, { d: 'AC', o: '1', b: 1 }, { d: 'BC', o: '√5', b: 2 }], { bezImena: ['A', 'B', 'C'], velicina: 240 }) });
  Qz(2, 'Koliki je koren iz razlomka $\\frac{36}{16}$?',
    ['$\\frac{3}{2}$', '$\\frac{9}{4}$', '$\\frac{4}{3}$', '$\\frac{2}{3}$'],
    '$\\sqrt{36}=6$ i $\\sqrt{16}=4$, pa je $\\sqrt{\\frac{36}{16}}=\\frac{6}{4}=\\frac{3}{2}$.',
    'Razlomak se korenuje tako što se brojilac i imenilac korene posebno, ako su oba potpuni kvadrati.', 'razlomak',
    { mediji: kvadrat(1, { dole: '?', sredina: 'P = 36/16 cm²' }),
      medijiOdgovora: { vrsta: 'formula', tekst: '√(36/16) = √36 / √16 = 6/4 = 3/2' } });
  Qz(2, 'Kolika je stranica kvadrata čija je površina $0,0049$ cm²?',
    ['0,07 cm', '0,7 cm', '0,49 cm', '0,007 cm'],
    '$\\sqrt{0,0049}=0,07$ cm, jer je $0,07\\cdot0,07=0,0049$.',
    'Kad se decimalni broj kvadrira, broj decimala se udvostruči: 0,07 ima dve, a 0,0049 četiri.', 'koren',
    { mediji: kvadrat(1, { dole: '?', sredina: 'P = 0,0049 cm²' }),
      medijiOdgovora: { vrsta: 'formula', tekst: '0,07 · 0,07 = 0,0049, pa je √0,0049 = 0,07' } });
  S(3, 'Spoji koren sa njegovom vrednošću.',
    [['$\\sqrt{49}$', '7'], ['$\\sqrt{0,25}$', '0,5'], ['$\\sqrt{\\frac{1}{9}}$', '$\\frac{1}{3}$'], ['$\\sqrt{2,25}$', '1,5']],
    'Koren razlomka je razlomak korena: $\\sqrt{\\frac{1}{9}}=\\frac{\\sqrt{1}}{\\sqrt{9}}=\\frac{1}{3}$.', 'koren');
  Qz(3, 'Koja tvrdnja je tačna za nenegativne brojeve $a$ i $b$?',
    ['$\\sqrt{a\\cdot b}=\\sqrt{a}\\cdot\\sqrt{b}$', '$\\sqrt{a+b}=\\sqrt{a}+\\sqrt{b}$', '$\\sqrt{a^{2}}=a$ za svaki broj $a$', '$\\sqrt{a}+\\sqrt{a}=\\sqrt{2a}$'],
    'Koren proizvoda je proizvod korena, a koren zbira nije zbir korena: $\\sqrt{9+16}=5$, a $\\sqrt{9}+\\sqrt{16}=7$.',
    'Koren iz kvadrata daje $|a|$, pa za negativno $a$ nije $a$; i $\\sqrt{a}+\\sqrt{a}=2\\sqrt{a}$.', 'proizvod');
  Qz(3, 'Koliko je $\\sqrt{(2-5)^{2}}$?',
    ['3', '−3', '7', '9'],
    '$2-5=-3$, pa je $(-3)^{2}=9$, a $\\sqrt{9}=3$.',
    'Najpre se računa razlika u zagradi, pa tek onda kvadrira i koreni.', 'zagrada');
  Qz(3, 'Koliko je $\\sqrt{\\frac{1}{4}}+\\sqrt{\\frac{9}{4}}$?',
    ['2', '$\\sqrt{\\frac{10}{4}}$', '$\\frac{1}{2}$', '$\\frac{5}{2}$'],
    '$\\sqrt{\\frac{1}{4}}=\\frac{1}{2}$ i $\\sqrt{\\frac{9}{4}}=\\frac{3}{2}$, pa je zbir $\\frac{1}{2}+\\frac{3}{2}=2$.',
    'Greška je sabrati razlomke pod korenom i zatim korenovati: $\\frac{1}{4}+\\frac{9}{4}=\\frac{5}{2}$.', 'zbir');

  // ── 4. Iracionalni brojevi i brojevna prava ──
  L('Iracionalni brojevi i brojevna prava');
  Qz(1, 'Na brojevnoj pravoj su tačke A, B, C i D. Koja od njih je iracionalan broj?',
    ['A', 'B', 'C', 'D'],
    '$\\sqrt{2}\\approx1,41$ nije razlomak. Tačke B i D su $\\frac{1}{2}$ i $\\frac{3}{2}$, a C je $2=\\sqrt{4}$.',
    'Hipas iz Metaponta je u 5. veku pre nove ere dokazao da $\\sqrt{2}$ nije racionalan. Po jednom predanju je zbog toga bačen u more.', 'iracionalan',
    { mediji: prava(0, 2.5, [[1.414, 'A', true, 1], [0.5, 'B', false, 2], [2, 'C', true, 3], [1.5, 'D', false, 4]]) });
  Qz(1, 'Koji skup čine brojevi koji se mogu napisati u obliku razlomka $\\frac{p}{q}$?',
    ['Racionalni brojevi', 'Iracionalni brojevi', 'Prirodni brojevi', 'Realni brojevi'],
    'Racionalni brojevi su oni koji se mogu napisati kao razlomak $\\frac{p}{q}$ sa celim $p$ i $q\\neq0$.',
    'Reč ratio na latinskom znači razlomak ili odnos, pa su racionalni brojevi „odnosi“ celih brojeva.', 'racionalan');
  Qz(1, 'Koji je odnos skupova racionalnih brojeva $\\mathbb{Q}$ i iracionalnih brojeva $I$?',
    ['Nemaju zajedničkih elemenata', 'Jedan je deo drugog', 'Imaju tačno jedan zajednički element', 'Svi iracionalni su racionalni'],
    'Svaki broj je ili racionalan ili iracionalan, ali ne oba: $\\mathbb{Q}\\cap I=\\varnothing$.',
    'Zajedno čine skup realnih brojeva $\\mathbb{R}$.', 'disjunktni');
  const skupovi = () => G({}, [
    krug(0, 0, 1, { b: 1, prazno: 1 }), krug(0, 0, 2, { b: 2, prazno: 1 }), krug(0, 0, 3, { b: 3, prazno: 1 }), krug(0, 0, 4, { b: 4, prazno: 1 }),
    { tx: 'N', at: [0, 0], vel: 16, b: 1 }, { tx: 'Z', at: [0, 1.5], vel: 16, b: 2 }, { tx: 'Q', at: [0, 2.5], vel: 16, b: 3 }, { tx: 'R', at: [0, 3.5], vel: 16, b: 4 },
  ], { velicina: 260 });
  Qz(1, 'Na slici su skupovi N, Z, Q i R. U koji je najmanji od njih spao broj $-\\frac{3}{4}$?',
    ['$\\mathbb{Q}$', '$\\mathbb{Z}$', '$\\mathbb{N}$', '$\\mathbb{R}$'],
    'Broj $-\\frac{3}{4}$ nije ceo, pa nije u $\\mathbb{Z}$ ni u $\\mathbb{N}$. Razlomak je racionalan, pa spada u $\\mathbb{Q}$.',
    'Prirodni brojevi su u celim, celi u racionalnim, a racionalni u realnim: $\\mathbb{N}⊂\\mathbb{Z}⊂\\mathbb{Q}⊂\\mathbb{R}$.', 'podskup',
    { mediji: skupovi() });
  Qz(2, 'Na brojevnoj pravoj su tačke A, B, C i D. Koja tačka je $\\sqrt{5}$?',
    ['B', 'A', 'C', 'D'],
    '$\\sqrt{5}\\approx2,24$, pa je to tačka malo desno od 2, a levo od 2,5. To je tačka B.',
    'Tačka $\\sqrt{2}$ je blizu 1,4, a $\\sqrt{10}$ je blizu 3,2.', 'tacka',
    { mediji: prava(0, 4, [[1.414, 'A', true, 1], [2.236, 'B', false, 2], [2.5, 'C', true, 3], [3.162, 'D', false, 4]]),
      medijiOdgovora: { vrsta: 'formula', tekst: '2² = 4 < 5 < 9 = 3², pa je √5 između 2 i 3' } });
  Qz(2, 'Između kojih celih brojeva leži $\\sqrt{10}$?',
    ['3 i 4', '2 i 3', '4 i 5', '9 i 10'],
    '$3^{2}=9<10<16=4^{2}$, pa je $3<\\sqrt{10}<4$.',
    'Broj $\\sqrt{10}$ je bliže 3 nego 4, jer je $3,16$ blizu 3.', 'celi',
    { medijiOdgovora: prava(2, 5, [[3.162, '√10', true, 1]]) });
  Qz(2, 'Koja je dužina hipotenuze jednakokrakog pravouglog trougla sa katetama 1?',
    ['$\\sqrt{2}$', '$2$', '$\\frac{1}{2}$', '$\\sqrt{3}$'],
    'Po Pitagorinoj teoremi: $1^{2}+1^{2}=2$, pa je hipotenuza $\\sqrt{2}$. To je i dijagonala kvadrata stranice 1.',
    'Dijagonala kvadrata stranice 1 je iste dužine kao hipotenuza, pa je $\\sqrt{2}$ prva dužina koja se ne može izraziti razlomkom.', 'hipotenuza',
    { mediji: trougao(1, '?'),
      medijiOdgovora: trougao(1, '√2') });
  U(2, 'Koji broj je uljez, tj. NIJE iracionalan?',
    ['$\\frac{22}{7}$', '$\\sqrt{3}$', '$\\sqrt{5}$', '$\\pi$'],
    '$\\frac{22}{7}$ je razlomak, pa je racionalan. Brojevi $\\sqrt{3}$, $\\sqrt{5}$ i $\\pi$ su iracionalni.',
    'Broj $\\frac{22}{7}$ je dobra približna vrednost za $\\pi$, ali nije jednak njemu.', 'razlomak');
  Qz(2, 'Koja tvrdnja je tačna?',
    ['Zbir racionalnog i iracionalnog broja je uvek iracionalan', 'Zbir dva iracionalna broja je uvek iracionalan', 'Proizvod dva iracionalna broja je uvek iracionalan', 'Količnik dva iracionalna broja je uvek iracionalan'],
    'Ako bi zbir $r+i$ bio racionalan, onda bi $i$ bio $(r+i)-r$, što je racionalno. Kontradikcija.',
    'Zbir $\\sqrt{2}+(-\\sqrt{2})=0$ je racionalan, pa zbir dva iracionalna nije uvek iracionalan.', 'zbir');
  Qz(3, 'Da li je proizvod dva iracionalna broja uvek iracionalan?',
    ['Ne: $\\sqrt{2}\\cdot\\sqrt{2}=2$', 'Da, uvek je iracionalan', 'Samo ako su oba pozitivna', 'Ne, nikad nije iracionalan'],
    'Proizvod $\\sqrt{2}\\cdot\\sqrt{2}=2$ je racionalan, pa tvrdnja nije uvek tačna.',
    'Proizvod $\\sqrt{8}\\cdot\\sqrt{2}=\\sqrt{16}=4$ je opet racionalan.', 'proizvod',
    { medijiOdgovora: { vrsta: 'formula', tekst: '√2 · √2 = 2 (racionalan!)' } });
  Qz(3, 'Na brojevnoj pravoj su tačke A, B, C i D. Koja je tačka $-\\sqrt{2}$?',
    ['A', 'B', 'C', 'D'],
    '$-\\sqrt{2}\\approx-1,41$ je između $-2$ i $-1$, na istoj udaljenosti od nule kao $\\sqrt{2}$. Tačka B je $-\\frac{1}{2}$, C je $0,6$, a D je $1,5$.',
    'Negativni brojevi su na brojevnoj pravoj simetrični pozitivnim: $-\\sqrt{2}$ je na istom rastojanju od nule kao $\\sqrt{2}$.', 'simetrija',
    { mediji: prava(-2, 2, [[-1.414, 'A', true, 1], [-0.5, 'B', false, 2], [0.6, 'C', true, 3], [1.5, 'D', false, 4]]) });
  Qz(3, 'Koliko je $\\sqrt{8}+\\sqrt{2}$ u najjednostavnijem obliku?',
    ['$3\\sqrt{2}$', '$\\sqrt{10}$', '$2\\sqrt{5}$', '$4\\sqrt{2}$'],
    '$\\sqrt{8}=2\\sqrt{2}$, pa je $2\\sqrt{2}+\\sqrt{2}=3\\sqrt{2}$.',
    'Broj $\\sqrt{8}$ se rastavlja na $\\sqrt{4}\\cdot\\sqrt{2}$, pa se izvlači potpun kvadrat ispred korena.', 'koren');
  S(2, 'Spoji koren sa približnom vrednošću na dve decimale.',
    [['$\\sqrt{16}$', '4'], ['$\\sqrt{2}$', '1,41'], ['$\\sqrt{0,25}$', '0,5'], ['$\\sqrt{7}$', '2,65']],
    '$\\sqrt{7}=2,6457\\dots$, pa se na dve decimale zaokružuje na 2,65.', 'koren');
  Qz(2, 'Na brojevnoj pravoj su tačke A, B, C i D. Koja je tačka $\\sqrt{7}$?',
    ['A', 'B', 'C', 'D'],
    '$\\sqrt{7}\\approx2,65$, jer je $2^{2}=4<7<9=3^{2}$. Tačka A je 2,65, B je 2,5, C je 3, a D je $\\sqrt{8}\\approx2,83$.',
    'Blizu su tačke $\\sqrt{7}$ i $\\sqrt{8}$, pa se razlikuju tek u drugoj decimali.', 'tacka',
    { mediji: prava(2, 3.5, [[2.646, 'A', true, 1], [2.5, 'B', false, 2], [3, 'C', true, 3], [2.828, 'D', false, 4]]) });
  Qz(2, 'Kvadrat je nacrtan na mreži, a njegova temena su u čvorovima mreže. Njegova površina je 2. Kolika mu je stranica?',
    ['$\\sqrt{2}$', '2', '$\\sqrt{3}$', '1,5'],
    'Stranica je hipotenuza pravouglog trougla sa katetama 1 i 1: $\\sqrt{1^{2}+1^{2}}=\\sqrt{2}$, a površina je 2.',
    'Kvadrat nagnut u odnosu na mrežu ima stranicu koja se ne može izraziti razlomkom.', 'stranica',
    { mediji: G({}, [{ mreza: [-2, 2, -1, 3], brojevi: 0 }, { lin: [[0, 0], [1, 1], [0, 2], [-1, 1]], zatv: 1, b: 1, gusto: 1 }], { velicina: 260 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '1² + 1² = 2, pa je stranica √2' } });
  Qz(3, 'Koji broj je najbliži $\\pi$ među ovim brojevima?',
    ['$\\frac{22}{7}$', '3,14', '3,1', '$\\sqrt{10}$'],
    '$\\frac{22}{7}\\approx3,142857$ je za oko 0,0013 od π, a 3,14 je za oko 0,0016 od π. Zato je 22/7 bliže.',
    'Razlomak 22/7 je stara i vrlo dobra aproksimacija broja π.',
    'razlomak',
    { medijiOdgovora: { vrsta: 'formula', tekst: '|22/7 − π| ≈ 0,0013, a |3,14 − π| ≈ 0,0016' } });

  // kvadrat stranice 1 sa dijagonalom (sa === true) ili bez nje
  const kvadratDijagonala = (sa) => G({ A: [0, 0], B: [1, 0], C: [1, 1], D: [0, 1] }, [
    { p: 'ABCD', b: 1 }, { d: 'AB', o: '1', b: 1 }, { d: 'BC', o: '1', b: 1 },
    ...(sa ? [{ d: 'AC', o: '√2', b: 2, debljina: 3 }] : []),
  ], { bezImena: ['A', 'B', 'C', 'D'], velicina: 240 });
  Qz(2, 'Kvadrat stranice 1 ima dijagonalu. Kolika je dužina dijagonale?',
    ['$\\sqrt{2}$', '2', '$\\sqrt{3}$', '1,5'],
    'Dijagonala deli kvadrat na dva jednakokraka pravougla trougla sa katetama 1: $d^{2}=1^{2}+1^{2}=2$, pa je $d=\\sqrt{2}$.',
    'Dijagonala kvadrata stranice 1 nije izmerljiva razlomkom: njena dužina je iracionalan broj.', 'dijagonala',
    { mediji: kvadratDijagonala(false), medijiOdgovora: kvadratDijagonala(true) });

  // ── 5. Decimalni zapisi racionalnih i iracionalnih brojeva ──
  L('Decimalni zapisi racionalnih i iracionalnih brojeva');
  Qz(1, 'Koji je decimalni zapis razlomka $\\frac{3}{8}$?',
    ['0,375', '0,38', '0,83', '0,3'],
    '$3:8=0,375$. Množenjem: $\\frac{3}{8}=\\frac{375}{1000}$.',
    'Razlomak sa imeniocem 8 = 2³ ima konačan decimalni zapis, jer je imenilac stepen dvojke.',
    'deljenje', { mediji: G({}, traka(8, 3, { w: 8, h: 1.2 }), { velicina: 300 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '3 : 8 = 0,375' } });
  Qz(1, 'Koji je decimalni zapis broja $\\frac{1}{3}$?',
    ['$0,(3)$', '$0,3$', '$0,33$', '$0,13$'],
    '$1:3=0,333\\dots$, cifra 3 se periodično ponavlja, pa je $0,(3)$.',
    'Periodični zapis se piše tako što se period stavi u zagrade: 0,(3).', 'periodican',
    { mediji: G({}, traka(3, 1, { w: 8, h: 1.2 }), { velicina: 300 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '1 : 3 = 0,3333… = 0,(3)' } });
  Qz(1, 'Koji od ovih brojeva ima beskonačan decimalni zapis koji NIJE periodičan?',
    ['$0,1010010001\\dots$', '$0,(12)$', '$0,125$', '$2,(3)$'],
    'Kod $0,1010010001\\dots$ broj nula između jedinica raste, pa nema perioda. Zato je iracionalan.',
    'Racionalni brojevi imaju konačan ili periodičan decimalni zapis.', 'periodican');
  Qz(2, 'Koji je decimalni zapis razlomka $\\frac{5}{12}$?',
    ['$0,41(6)$', '$0,416$', '$0,4(12)$', '$0,41(2)$'],
    '$5:12=0,41666\\dots$: cifra 4 nije u periodu, a period je 6.',
    'Ako imenilac ima činilac osim 2 i 5 (ovde 3), period ne počinje odmah posle zareza.', 'period',
    { mediji: G({}, traka(12, 5, { w: 8, h: 1.2 }), { velicina: 300 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '5 : 12 = 0,41666… = 0,41(6)' } });
  Qz(2, 'Koji razlomak odgovara decimalnom zapisu $0,(45)$?',
    ['$\\frac{5}{11}$', '$\\frac{45}{100}$', '$\\frac{4}{9}$', '$\\frac{9}{20}$'],
    '$0,(45)=\\frac{45}{99}=\\frac{5}{11}$. Period dužine 2 daje dve devetke u imeniocu.',
    'Svaki periodični zapis sa periodom dužine $k$ je razlomak sa $k$ devetki u imeniocu.', 'razlomak',
    { medijiOdgovora: { vrsta: 'formula', tekst: 'x = 0,4545…, 100x − x = 45, x = 45/99 = 5/11' } });
  Qz(2, 'Koliko je $0,(9)$?',
    ['1', '0,9', '0', '9'],
    '$x=0,(9)$: $10x-x=9$, pa je $9x=9$ i $x=1$.',
    '$0,(9)=1$: dva različita decimalna zapisa za isti broj.', 'devetka',
    { medijiOdgovora: { vrsta: 'formula', tekst: '10x − x = 9,999… − 0,999… = 9, pa je x = 1' } });
  U(2, 'Koji od ovih brojeva NEMA periodičan decimalni zapis?',
    ['$\\sqrt{2}$', '$\\frac{1}{7}$', '$\\frac{5}{6}$', '$0,(3)$'],
    '$\\sqrt{2}$ je iracionalan, pa je decimalni zapis beskonačan i neperiodičan. Ostali su racionalni.',
    'Iracionalni broj ima beskonačan decimalni zapis koji se ne ponavlja.', 'periodican');
  S(2, 'Spoji periodični decimalni zapis sa razlomkom.',
    [['$0,(3)$', '$\\frac{1}{3}$'], ['$0,(6)$', '$\\frac{2}{3}$'], ['$0,375$', '$\\frac{3}{8}$'], ['$0,4(6)$', '$\\frac{7}{15}$']],
    '$0,4(6)=0,4666\\dots=\\frac{7}{15}$.', 'razlomak');
  Qz(2, 'Koliko decimala ima konačan decimalni zapis razlomka $\\frac{3}{16}$?',
    ['4', '3', '2', '6'],
    '$3:16=0,1875$, pa su to četiri decimale.',
    'Razlomak sa imeniocem 2⁴ = 16 ima tačno četiri decimale, jer je zapis konačan.', 'decimale',
    { mediji: G({}, traka(16, 3, { w: 8, h: 1.2 }), { velicina: 300 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '3 : 16 = 0,1875' } });
  Qz(2, 'Zaokruži broj $\\sqrt{3}$ na jednu decimalu. Koji je rezultat?',
    ['1,7', '1,8', '1,73', '2'],
    '$\\sqrt{3}\\approx1,73$, a 1,73 je bliže 1,7 nego 1,8.',
    'Pravilo: ako je cifra posle one koju zaokružujemo 5 ili više, broj se zaokružuje na gore (1,75 → 1,8).', 'zaokruzi',
    { mediji: prava(1.6, 1.9, [[1.732, '√3', true, 1]], { podela: 0.1, svaki: 1 }) });
  Qz(3, 'Kolika je apsolutna greška približne vrednosti $1,7$ broja $\\sqrt{3}$?',
    ['0,032', '0,1', '0,068', '0,32'],
    '$|\\sqrt{3}-1,7|\\approx|1,7320508-1,7|=0,0320508\\dots\\approx0,032$.',
    'Apsolutna greška je rastojanje između tačnog broja i približne vrednosti, pa je uvek pozitivna.', 'greska',
    { mediji: prava(1.6, 1.8, [[1.7, '1,7', false, 2], [1.732, '√3', true, 1]], { podela: 0.1, svaki: 1 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '|√3 − 1,7| = 0,0320508… ≈ 0,032' } });
  Qz(3, 'Na brojevnoj pravoj je označen broj $\\frac{1}{3}$. Koji je njegov zapis zaokružen na dve decimale?',
    ['0,33', '0,34', '0,3', '0,333'],
    '$\\frac{1}{3}=0,3333\\dots$, pa je na dve decimale $0,33$ (treća cifra je 3, pa se ne zaokružuje na gore).',
    'Zaokruživanje se radi tako što se gleda prva cifra iza one koju ostavljamo.', 'zaokruzi',
    { mediji: prava(0.3, 0.4, [[0.333, '1/3', true, 1]], { podela: 0.01, svaki: 10 }) });
  Qz(2, 'Koja tvrdnja je tačna?',
    ['Svaki decimalni broj sa konačno mnogo cifara je racionalan', 'Svaki broj sa beskonačno mnogo cifara je iracionalan', 'Svaki broj čiji zapis nije periodičan je racionalan', 'Broj sa periodičnim zapisom je uvek ceo broj'],
    'Konačan decimalni zapis je razlomak sa imeniocem 10, 100, 1000…, pa je racionalan.',
    'Broj $\\frac{1}{3}$ ima beskonačno mnogo cifara, a racionalan je.', 'konacan');
  Qz(3, 'Koji je decimalni zapis razlomka $\\frac{1}{11}$?',
    ['$0,(09)$', '$0,(11)$', '$0,(1)$', '$0,1(1)$'],
    '$1:11=0,090909\\dots$, pa je period $09$.',
    'Razlomak $\\frac{2}{11}$ je $0,(18)$, pa se razlomci sa imeniocem 11 pišu sa periodom od dve cifre.', 'period');

  Qz(3, 'Na brojevnoj pravoj je zumirana oblast od 3,14 do 3,15. Koji je zapis broja π zaokružen na tri decimale?',
    ['3,142', '3,141', '3,14', '3,15'],
    'π = 3,14159…: četvrta decimala je 5, pa se treća decimala 1 zaokružuje na gore: 3,142.',
    'Ako se broj jednostavno skrati bez zaokruživanja, dobija se 3,141; to je greška koja se često pravi.', 'decimale',
    { mediji: prava(3.14, 3.15, [[3.14159, 'π', true, 1]], { podela: 0.001, svaki: 10 }) });
};
