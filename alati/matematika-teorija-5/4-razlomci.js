// Lekcije 21–25: pojam razlomka, brojevna poluprava, proširivanje/skraćivanje, decimalni zapis, upoređivanje.
module.exports = ({ L, Q, U, S, G, r, traka, pica, sto, O, bez, dec }) => {

  // dve trake jedna ispod druge (za upoređivanje/proširivanje razlomaka)
  const dveTrake = (a, b, { o1 = '', o2 = '' } = {}) =>
    G(O, [...traka(a.n, a.m, { y: 0 }), ...traka(b.n, b.m, { y: -2, b: 2 }),
      ...(o1 ? [{ tx: o1, at: [9.5, 0.6], vel: 16, b: 1 }] : []), ...(o2 ? [{ tx: o2, at: [9.5, -1.7], vel: 16, b: 2 }] : [])], { ...bez, velicina: 320 });
  // tačka na brojevnoj polupravoj
  const naPolupravoj = (x, oznaka, { b = 1 } = {}) =>
    G(O, [{ osa: [0, 1], podela: 0.25, svaki: 4 }, { lin: [[x, -0.06], [x, 0.06]], b, debljina: 4 }, { tx: oznaka, at: [x, 0.3], vel: 15, b }], { ...bez, velicina: 320 });

  // ── 21. pojam razlomka ──
  L('Pojam razlomka');
  Q(1, 'Šta pokazuje imenilac razlomka?',
    ['Na koliko jednakih delova je podeljena celina', 'Koliko delova uzimamo', 'Koliko je velik brojilac', 'Koliko celina imamo'],
    'Imenilac (donji broj) govori na koliko jednakih delova smo podelili celinu. U razlomku $\\frac{3}{4}$ imenilac je 4.', 'imenilac',
    { mediji: dveTrake({ n: 4, m: 1 }, { n: 4, m: 3 }, { o1: '1/4', o2: '3/4' }) });
  Q(1, 'Šta pokazuje brojilac razlomka?',
    ['Koliko jednakih delova uzimamo', 'Na koliko delova je podeljena celina', 'Koliko celina imamo', 'Veličinu imenioca'],
    'Brojilac (gornji broj) govori koliko delova uzimamo. U razlomku $\\frac{3}{4}$ uzimamo 3 od 4 jednaka dela.', 'brojilac',
    { mediji: dveTrake({ n: 4, m: 1 }, { n: 4, m: 3 }, { o1: '1/4', o2: '3/4' }) });
  Q(1, 'Kako se zove broj IZNAD razlomačke crte?',
    ['Brojilac', 'Imenilac', 'Količnik', 'Delilac'],
    'Brojilac je gornji broj – on „broji“ koliko delova uzimamo. Ispod crte je imenilac koji „imenuje“ na koliko delova je podeljeno.', 'brojilac',
    { medijiOdgovora: G(O, [...traka(4, 3), { tx: 'brojilac', at: [2, 1.9], vel: 14, b: 1 }, { tx: 'imenilac', at: [2, -0.4], vel: 14, b: 2 }], { ...bez, velicina: 320 }) });
  Q(1, 'Kako se zove broj ISPOD razlomačke crte?',
    ['Imenilac', 'Brojilac', 'Količnik', 'Ostatak'],
    'Imenilac je donji broj – on daje ime delovima (polovine, trećine, četvrtine…). Imenilac nikada nije nula.', 'imenilac',
    { medijiOdgovora: G(O, [...traka(4, 3), { tx: 'brojilac', at: [2, 1.9], vel: 14, b: 1 }, { tx: 'imenilac', at: [2, -0.4], vel: 14, b: 2 }], { ...bez, velicina: 320 }) });
  Q(2, 'Koji razlomak je prikazan na traci?',
    ['$\\frac{3}{8}$', '$\\frac{5}{8}$', '$\\frac{3}{5}$', '$\\frac{8}{3}$'],
    'Traka je podeljena na 8 jednakih delova, a obojena su 3. Zato je prikazan razlomak $\\frac{3}{8}$: brojilac 3, imenilac 8.', 'razlomak',
    { mediji: G(O, traka(8, 3), { ...bez, velicina: 320 }) });
  Q(2, 'Koji razlomak je prikazan na krugu (pici)?',
    ['$\\frac{2}{6}$', '$\\frac{4}{6}$', '$\\frac{2}{4}$', '$\\frac{2}{5}$'],
    'Krug je podeljen na 6 jednakih isečaka, a obojena su 2. Prikazan je razlomak $\\frac{2}{6}$ (dve šestine).', 'razlomak',
    { mediji: G(O, pica(6, 2), { ...bez, velicina: 260 }) });
  Q(3, 'Koji razlomak je prikazan na traci?',
    ['$\\frac{5}{6}$', '$\\frac{1}{6}$', '$\\frac{5}{7}$', '$\\frac{6}{5}$'],
    'Traka je podeljena na 6 delova, obojeno je 5, pa je to $\\frac{5}{6}$ – samo jedan deo fali do cele.', 'razlomak',
    { mediji: G(O, traka(6, 5), { ...bez, velicina: 320 }) });

  // ── 22. razlomci na brojevnoj polupravoj ──
  L('Razlomci na brojevnoj polupravoj');
  Q(1, 'Gde se na brojevnoj polupravoj nalazi razlomak $\\frac{1}{2}$?',
    ['Tačno na polovini između 0 i 1', 'Na samom početku (u 0)', 'Na samom kraju (u 1)', 'Desno od 1'],
    'Razlomak $\\frac{1}{2}$ je na polovini duži od 0 do 1. Brojevna poluprava počinje u 0 i ide udesno.', 'razlomak',
    { medijiOdgovora: naPolupravoj(0.5, '1/2') });
  Q(2, 'Kako se na polupravoj predstavlja $\\frac{3}{4}$?',
    ['Duž od 0 do 1 podeliš na 4 dela i uzmeš 3. podeljak', 'Podeliš na 3 dela i uzmeš 4.', 'Staviš tačku na 1', 'Staviš tačku na 0'],
    'Imenilac 4 kaže: podeli duž od 0 do 1 na 4 jednaka dela. Brojilac 3 kaže: stani na trećem podeljku.', 'razlomak',
    { medijiOdgovora: G(O, [{ osa: [0, 1], podela: 0.25, svaki: 4 }, { lin: [[0.75, -0.06], [0.75, 0.06]], b: 1, debljina: 4 }, { tx: '3/4', at: [0.75, 0.28], vel: 16 }], { ...bez, velicina: 320 }) });
  Q(2, 'Tačka je na trećem podeljku duži od 0 do 1, podeljene na 5 jednakih delova. Koji je to razlomak?',
    ['$\\frac{3}{5}$', '$\\frac{5}{3}$', '$\\frac{2}{5}$', '$\\frac{3}{4}$'],
    'Podela na 5 delova daje imenilac 5, a treći podeljak daje brojilac 3 – dakle $\\frac{3}{5}$.', 'razlomak',
    { medijiOdgovora: G(O, [{ osa: [0, 1], podela: 0.2, svaki: 5 }, { lin: [[0.6, -0.06], [0.6, 0.06]], b: 1, debljina: 4 }, { tx: '3/5', at: [0.6, 0.3], vel: 16 }], { ...bez, velicina: 320 }) });
  Q(2, 'Šta je veće na brojevnoj polupravoj: $\\frac{1}{2}$ ili $\\frac{1}{4}$?',
    ['$\\frac{1}{2}$ – nalazi se desno', '$\\frac{1}{4}$ – nalazi se desno', 'Jednaki su', 'Ne može se uporediti'],
    'Na brojevnoj pravoj, broj koji je više udesno je veći. Polovina je desno od četvrtine, pa je $\\frac{1}{2} > \\frac{1}{4}$.', 'razlomak',
    { medijiOdgovora: G(O, [{ osa: [0, 1], podela: 0.25, svaki: 4 }, { lin: [[0.25, -0.06], [0.25, 0.06]], b: 2, debljina: 4 }, { lin: [[0.5, -0.06], [0.5, 0.06]], b: 1, debljina: 4 }, { tx: '1/4', at: [0.25, 0.3], vel: 14, b: 2 }, { tx: '1/2', at: [0.5, 0.3], vel: 14, b: 1 }], { ...bez, velicina: 320 }) });
  Q(2, 'Koji broj odgovara POČETNOJ tački brojevne poluprave?',
    ['0', '1', '−1', '2'],
    'Početna tačka (ishodište $O$) po dogovoru dobija broj 0. Udesno se zatim ređaju 1, 2, 3…, a razlomci leže na jediničnim dužima između celih brojeva.', 'poluprava',
    { mediji: G({ O: [0, 0] }, [{ osa: [0, 3], podela: 0.5, svaki: 2 }, { tacka: 'O', b: 1 }, { tx: 'O', at: [0, 0.55], vel: 15 }], { ...bez, velicina: 320 }) });

  // ── 23. proširivanje, skraćivanje, upoređivanje ──
  L('Proširivanje, skraćivanje i upoređivanje razlomaka');
  Q(1, 'Šta znači PROŠIRITI razlomak?',
    ['Pomnožiti brojilac i imenilac istim brojem', 'Podeliti brojilac i imenilac istim brojem', 'Sabrati im isti broj', 'Samo povećati brojilac'],
    'Proširivanje: brojilac i imenilac pomnožimo istim brojem (različitim od nule). Vrednost razlomka se ne menja: $\\frac{1}{2}=\\frac{3}{6}$.', 'proširivanje',
    { medijiOdgovora: dveTrake({ n: 2, m: 1 }, { n: 6, m: 3 }, { o1: '1/2', o2: '3/6' }) });
  Q(1, 'Šta znači SKRATITI razlomak?',
    ['Podeliti brojilac i imenilac istim brojem', 'Pomnožiti brojilac i imenilac istim brojem', 'Oduzeti im isti broj', 'Samo smanjiti imenilac'],
    'Skraćivanje: brojilac i imenilac podelimo istim brojem. Vrednost ostaje ista: $\\frac{6}{8}=\\frac{3}{4}$ (podelili smo sa 2).', 'skraćivanje',
    { medijiOdgovora: dveTrake({ n: 8, m: 6 }, { n: 4, m: 3 }, { o1: '6/8', o2: '3/4' }) });
  Q(1, 'Proširi razlomak $\\frac{1}{2}$ brojem 3. Šta dobijaš?',
    ['$\\frac{3}{6}$', '$\\frac{2}{3}$', '$\\frac{4}{6}$', '$\\frac{1}{6}$'],
    'Množimo i brojilac i imenilac sa 3: $\\frac{1\\cdot3}{2\\cdot3}=\\frac{3}{6}$. Razlomak je isti, samo je zapisan sitnijim delovima.', 'proširivanje',
    { medijiOdgovora: dveTrake({ n: 2, m: 1 }, { n: 6, m: 3 }, { o1: '1/2', o2: '3/6' }) });
  Q(1, 'Skrati razlomak $\\frac{6}{8}$. Šta dobijaš?',
    ['$\\frac{3}{4}$', '$\\frac{2}{3}$', '$\\frac{6}{4}$', '$\\frac{4}{3}$'],
    'Oba broja delimo sa 2: $\\frac{6:2}{8:2}=\\frac{3}{4}$. Razlomak $\\frac{3}{4}$ se ne može dalje skratiti – to je najprostiji oblik.', 'skraćivanje',
    { medijiOdgovora: dveTrake({ n: 8, m: 6 }, { n: 4, m: 3 }, { o1: '6/8', o2: '3/4' }) });
  Q(2, 'Koji razlomak je veći: $\\frac{3}{4}$ ili $\\frac{1}{4}$?',
    ['$\\frac{3}{4}$', '$\\frac{1}{4}$', 'Jednaki su', 'Ne može se uporediti'],
    'Kad su imenioci isti, veći je razlomak sa većim brojiocem: 3 dela je više od 1 dela, pa je $\\frac{3}{4} > \\frac{1}{4}$.', 'upoređivanje',
    { medijiOdgovora: dveTrake({ n: 4, m: 3 }, { n: 4, m: 1 }, { o1: '3/4', o2: '1/4' }) });
  Q(2, 'Koji razlomak je veći: $\\frac{1}{2}$ ili $\\frac{1}{3}$?',
    ['$\\frac{1}{2}$', '$\\frac{1}{3}$', 'Jednaki su', 'Ne može se uporediti'],
    'Kad su brojioci isti, veći je razlomak sa MANJIM imeniocem: polovina je veći deo od trećine, pa je $\\frac{1}{2} > \\frac{1}{3}$.', 'upoređivanje',
    { medijiOdgovora: dveTrake({ n: 2, m: 1 }, { n: 3, m: 1 }, { o1: '1/2', o2: '1/3' }) });
  Q(3, 'Šta je veće: $\\frac{2}{3}$ ili $\\frac{3}{5}$?',
    ['$\\frac{2}{3}$', '$\\frac{3}{5}$', 'Jednaki su', 'Ne može se uporediti'],
    'Svedemo na zajednički imenilac: $\\frac{2}{3}=\\frac{10}{15}$, a $\\frac{3}{5}=\\frac{9}{15}$. Pošto je $10 > 9$, veći je $\\frac{2}{3}$.', 'upoređivanje',
    { medijiOdgovora: dveTrake({ n: 3, m: 2 }, { n: 5, m: 3 }, { o1: '2/3', o2: '3/5' }) });

  S(2, 'Spoji razlomak sa decimalnim zapisom.',
    [['$\\frac{1}{10}$', '$0,\\!1$'], ['$\\frac{3}{100}$', '$0,\\!03$'], ['$\\frac{1}{2}$', '$0,\\!5$'], ['$\\frac{7}{10}$', '$0,\\!7$']],
    'Decimalni zapis je samo drugi način da zapišemo razlomak sa imeniocem 10, 100, 1000…', 'decimala');

  // ── 24. decimalni zapis razlomka ──
  L('Decimalni zapis razlomka');
  Q(1, 'Kako se zove zapis razlomka pomoću zareza?',
    ['Decimalni zapis', 'Rimski zapis', 'Prost zapis', 'Slovni zapis'],
    'Decimalni zapis koristi zarez: $\\frac{1}{10}=0,\\!1$. Cifre desno od zareza zovu se decimale.', 'decimala',
    { mediji: G(O, [...sto(10), { tx: '0,1', at: [3, 7.3], vel: 16, b: 1 }], { ...bez, velicina: 260 }) });
  Q(1, 'Kako decimalno zapisuješ razlomak $\\frac{1}{10}$?',
    ['$0,\\!1$', '$1,\\!0$', '$0,\\!01$', '$10$'],
    '$\\frac{1}{10}$ je jedna desetina, a to je $0,\\!1$ – prvo mesto desno od zareza su desetinke.', 'decimala',
    { medijiOdgovora: G(O, [...traka(10, 1), { tx: '0,1', at: [4.5, 1.6], vel: 16, b: 1 }], { ...bez, velicina: 320 }) });
  Q(1, 'Kako decimalno zapisuješ razlomak $\\frac{7}{10}$?',
    ['$0,\\!7$', '$7,\\!0$', '$0,\\!07$', '$0,\\!007$'],
    'Sedam desetina = $0,\\!7$. Cifra 7 je na prvom decimalnom mestu – mestu desetinki.', 'decimala',
    { medijiOdgovora: G(O, [...traka(10, 7), { tx: '0,7', at: [4.5, 1.6], vel: 16, b: 1 }], { ...bez, velicina: 320 }) });
  Q(2, 'Kako decimalno zapisuješ razlomak $\\frac{3}{100}$?',
    ['$0,\\!03$', '$0,\\!3$', '$3,\\!0$', '$0,\\!003$'],
    'Tri stotinke = $0,\\!03$. Stotinke su na drugom decimalnom mestu, pa 3 mora da stigne tamo – zato ispred ide nula.', 'decimala',
    { medijiOdgovora: G(O, [...sto(3), { tx: '0,03', at: [3, 7.3], vel: 16, b: 1 }], { ...bez, velicina: 260 }) });
  Q(2, 'Koji razlomak je zapisan kao $0,\\!5$?',
    ['$\\frac{5}{10}=\\frac{1}{2}$', '$\\frac{5}{100}$', '$\\frac{1}{5}$', '$\\frac{5}{1000}$'],
    '$0,\\!5$ je pet desetina: $\\frac{5}{10}$, a to se skrati na $\\frac{1}{2}$. Polovina i $0,\\!5$ su isti broj.', 'decimala',
    { medijiOdgovora: G(O, [...traka(10, 5), { tx: '0,5', at: [4.5, 1.6], vel: 16, b: 1 }], { ...bez, velicina: 320 }) });
  Q(2, 'U broju $0,\\!37$, koja je cifra desetinki, a koja stotinki?',
    ['Desetinke 3, stotinke 7', 'Desetinke 7, stotinke 3', 'Obe su desetinke', 'Obe su stotinke'],
    'Prvo decimalno mesto su desetinke (3), drugo su stotinke (7): $0,\\!37 = \\frac{3}{10}+\\frac{7}{100}$.', 'decimala',
    { medijiOdgovora: G(O, [...sto(37), { tx: '3', at: [2.7, 7.3], vel: 16, b: 1 }, { tx: '7', at: [3.3, 7.3], vel: 16, b: 2 }], { ...bez, velicina: 260 }) });
  Q(3, 'Koliko decimalnih mesta ima broj $0,\\!075$?',
    ['3', '2', '4', '1'],
    'Decimale su sve cifre desno od zareza: 0, 7 i 5 – ukupno 3 decimalna mesta (hiljaditinke).', 'decimala',
    { medijiOdgovora: G(O, [{ tx: '0 , 0 7 5', at: [0, 0.6], vel: 24 }, { tx: 'desetinke stotinke hiljaditinke', at: [0, -0.5], vel: 11, b: 4 }], { ...bez, velicina: 300 }) });

  // ── 25. upoređivanje i zaokrugljivanje decimalnih brojeva ──
  L('Upoređivanje i zaokrugljivanje decimalnih brojeva');
  Q(1, 'Šta je veće: $0,\\!5$ ili $0,\\!45$?',
    ['$0,\\!5$', '$0,\\!45$', 'Jednaki su', 'Ne može se uporediti'],
    'Dopišemo nulu da imaju isti broj decimala: $0,\\!50$ i $0,\\!45$. Pošto je $50 > 45$, veći je $0,\\!5$.', 'decimala',
    { medijiOdgovora: G(O, [...sto(50), ...sto(45, { x0: 7, b: 2 }), { tx: '0,5', at: [3, 7.3], vel: 16, b: 1 }, { tx: '0,45', at: [10, 7.3], vel: 16, b: 2 }], { ...bez, velicina: 320 }) });
  Q(2, 'Zaokrugli broj $3,\\!78$ na jednu decimalu.',
    ['$3,\\!8$', '$3,\\!7$', '$3,\\!78$', '$4$'],
    'Gledamo cifru iza prve decimale: to je 8, a 8 je veće ili jednako 5, pa prvu decimalu povećavamo: $3,\\!8$.', 'približno',
    { medijiOdgovora: G(O, [{ osa: [3.7, 3.8], podela: 0.01, svaki: 10 }, { lin: [[3.78, -0.06], [3.78, 0.06]], b: 1, debljina: 4 }, { tx: '3,78', at: [3.78, 0.3], vel: 13 }, { tx: '3,8', at: [3.8, 0.6], vel: 15, b: 2 }], { ...bez, velicina: 320 }) });
  Q(2, 'Zaokrugli broj $2,\\!34$ na jednu decimalu.',
    ['$2,\\!3$', '$2,\\!4$', '$2,\\!34$', '$2$'],
    'Cifra iza prve decimale je 4, a 4 je manje od 5, pa prva decimala ostaje ista: $2,\\!3$.', 'približno',
    { medijiOdgovora: G(O, [{ osa: [2.3, 2.4], podela: 0.01, svaki: 10 }, { lin: [[2.34, -0.06], [2.34, 0.06]], b: 1, debljina: 4 }, { tx: '2,34', at: [2.34, 0.3], vel: 13 }, { tx: '2,3', at: [2.3, 0.6], vel: 15, b: 2 }], { ...bez, velicina: 320 }) });
  Q(2, 'Zaokrugli broj $6,\\!5$ na ceo broj.',
    ['7', '6', '6,5', '10'],
    'Cifra iza zareza je 5, pa broj zaokrugljujemo naviše: $6,\\!5 \\approx 7$.', 'približno',
    { medijiOdgovora: G(O, [{ osa: [6, 7], podela: 0.1, svaki: 10 }, { lin: [[6.5, -0.06], [6.5, 0.06]], b: 1, debljina: 4 }, { tx: '6,5', at: [6.5, 0.3], vel: 14 }, { tx: '7', at: [7, 0.6], vel: 16, b: 2 }], { ...bez, velicina: 300 }) });
  Q(3, 'Poređaj od najmanjeg ka najvećem: $0,\\!7$, $0,\\!17$, $0,\\!07$.',
    ['$0,\\!07 < 0,\\!17 < 0,\\!7$', '$0,\\!7 < 0,\\!17 < 0,\\!07$', '$0,\\!17 < 0,\\!07 < 0,\\!7$', 'Svi su jednaki'],
    'Dopišemo nule da svi imaju po dve decimale: $0,\\!70$, $0,\\!17$, $0,\\!07$. Redom od najmanjeg: $0,\\!07$, pa $0,\\!17$, pa $0,\\!70$.', 'decimala',
    { medijiOdgovora: G(O, [{ osa: [0, 1], podela: 0.1, svaki: 5 }, { lin: [[0.07, -0.06], [0.07, 0.06]], b: 1, debljina: 4 }, { lin: [[0.17, -0.06], [0.17, 0.06]], b: 2, debljina: 4 }, { lin: [[0.7, -0.06], [0.7, 0.06]], b: 3, debljina: 4 }, { tx: '0,07', at: [0.07, 0.3], vel: 13, b: 1 }, { tx: '0,17', at: [0.17, 0.3], vel: 13, b: 2 }, { tx: '0,7', at: [0.7, 0.3], vel: 13, b: 3 }], { ...bez, velicina: 320 }) });
  Q(3, 'U broju $12,\\!347$, koja cifra je na mestu stotinki?',
    ['4', '3', '7', '2'],
    'Decimale redom: 3 je na mestu desetinki, 4 na mestu stotinki, 7 na mestu hiljaditinki. Dakle, cifra stotinki je 4.', 'decimala',
    { medijiOdgovora: G(O, [{ tx: '1 2 , 3 4 7', at: [0, 0.7], vel: 24 }, { tx: 'desetinke', at: [1.2, -0.3], vel: 11, b: 1 }, { tx: 'stotinke', at: [2.4, -0.3], vel: 11, b: 2 }, { tx: 'hiljaditinke', at: [3.8, -0.3], vel: 11, b: 3 }], { ...bez, velicina: 300 }) });

};
