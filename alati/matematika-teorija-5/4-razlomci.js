// Lekcije 21–25: pojam razlomka, brojevna poluprava, proširivanje/skraćivanje, decimalni zapis, upoređivanje.
module.exports = ({ L, Q, U, S, G, r, traka, pica, osa, O, bez, dec }) => {

  // ── 21. pojam razlomka ──
  L('Pojam razlomka');
  Q(1, 'Šta pokazuje imenilac razlomka?',
    ['Na koliko jednakih delova je podeljena celina', 'Koliko delova uzimamo', 'Koliko je velik brojilac', 'Koliko celina imamo'],
    'Imenilac (donji broj) govori na koliko jednakih delova smo podelili celinu. U razlomku $\\frac{3}{4}$ imenilac je 4.', 'imenilac');
  Q(1, 'Šta pokazuje brojilac razlomka?',
    ['Koliko jednakih delova uzimamo', 'Na koliko delova je podeljena celina', 'Koliko celina imamo', 'Veličinu imenioca'],
    'Brojilac (gornji broj) govori koliko delova uzimamo. U razlomku $\\frac{3}{4}$ uzimamo 3 od 4 jednaka dela.', 'brojilac');
  Q(1, 'Kako se zove broj IZNAD razlomačke crte?',
    ['Brojilac', 'Imenilac', 'Količnik', 'Delilac'],
    'Brojilac je gornji broj – on „broji“ koliko delova uzimamo. Ispod crte je imenilac koji „imenuje“ na koliko delova je podeljeno.', 'brojilac');
  Q(1, 'Kako se zove broj ISPOD razlomačke crte?',
    ['Imenilac', 'Brojilac', 'Količnik', 'Ostatak'],
    'Imenilac je donji broj – on daje ime delovima (polovine, trećine, četvrtine…). Imenilac nikada nije nula.', 'imenilac');
  Q(2, 'Koji razlomak je prikazan na traci?',
    ['$\\frac{3}{8}$', '$\\frac{5}{8}$', '$\\frac{3}{5}$', '$\\frac{8}{3}$'],
    'Traka je podeljena na 8 jednakih delova, a obojena su 3. Zato je prikazan razlomak $\\frac{3}{8}$: brojilac 3, imenilac 8.', 'razlomak',
    { mediji: G(O, traka(8, 3), { ...bez, velicina: 320 }) });
  Q(2, 'Koji razlomak je prikazan na krugu (pici)?',
    ['$\\frac{2}{6}$', '$\\frac{4}{6}$', '$\\frac{2}{4}$', '$\\frac{1}{3}$'],
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
    'Razlomak $\\frac{1}{2}$ je na polovini duži od 0 do 1. Brojevna poluprava počinje u 0 i ide udesno.', 'razlomak');
  Q(2, 'Kako se na polupravoj predstavlja $\\frac{3}{4}$?',
    ['Duž od 0 do 1 podeliš na 4 dela i uzmeš 3. podeljak', 'Podeliš na 3 dela i uzmeš 4.', 'Staviš tačku na 1', 'Staviš tačku na 0'],
    'Imenilac 4 kaže: podeli duž od 0 do 1 na 4 jednaka dela. Brojilac 3 kaže: stani na trećem podeljku.', 'razlomak',
    { mediji: G(O, [{ osa: [0, 1], podela: 0.25, svaki: 4 }, { lin: [[0.75, -0.06], [0.75, 0.06]], b: 1, debljina: 4 }, { tx: '3/4', at: [0.75, 0.28], vel: 16 }], { ...bez, velicina: 320 }) });
  Q(2, 'Tačka je na trećem podeljku duži od 0 do 1, podeljene na 5 jednakih delova. Koji je to razlomak?',
    ['$\\frac{3}{5}$', '$\\frac{5}{3}$', '$\\frac{2}{5}$', '$\\frac{3}{4}$'],
    'Podela na 5 delova daje imenilac 5, a treći podeljak daje brojilac 3 – dakle $\\frac{3}{5}$.', 'razlomak');
  Q(2, 'Šta je veće na brojevnoj polupravoj: $\\frac{1}{2}$ ili $\\frac{1}{4}$?',
    ['$\\frac{1}{2}$ – nalazi se desno', '$\\frac{1}{4}$ – nalazi se desno', 'Jednaki su', 'Ne može se uporediti'],
    'Na brojevnoj pravoj, broj koji je više udesno je veći. Polovina je desno od četvrtine, pa je $\\frac{1}{2} > \\frac{1}{4}$.', 'razlomak');
  Q(2, 'Koji broj odgovara POČETNOJ tački brojevne poluprave?',
    ['0', '1', '−1', 'Zavisi od toga ko crta'],
    'Početna tačka (ishodište O) po dogovoru dobija broj 0. Udesno se zatim ređaju 1, 2, 3…, a razlomci leže na jediničnim dužima između celih brojeva.', 'poluprava',
    { mediji: G({ O: [0, 0] }, [{ osa: [0, 3], podela: 0.5, svaki: 2 }, { tacka: 'O', b: 1 }, { tx: 'O', at: [0, 0.55], vel: 15 }], { ...bez, velicina: 320 }) });

  // ── 23. proširivanje, skraćivanje, upoređivanje ──
  L('Proširivanje, skraćivanje i upoređivanje razlomaka');
  Q(1, 'Šta znači PROŠIRITI razlomak?',
    ['Pomnožiti brojilac i imenilac istim brojem', 'Podeliti brojilac i imenilac istim brojem', 'Sabrati im isti broj', 'Samo povećati brojilac'],
    'Proširivanje: brojilac i imenilac pomnožimo istim brojem (različitim od nule). Vrednost razlomka se ne menja: $\\frac{1}{2}=\\frac{3}{6}$.', 'proširivanje', { mediji: { vrsta: 'formula', tekst: '$\\frac{1}{2}=\\frac{1\\cdot3}{2\\cdot3}=\\frac{3}{6}$' } });
  Q(1, 'Šta znači SKRATITI razlomak?',
    ['Podeliti brojilac i imenilac istim brojem', 'Pomnožiti brojilac i imenilac istim brojem', 'Oduzeti im isti broj', 'Samo smanjiti imenilac'],
    'Skraćivanje: brojilac i imenilac podelimo istim brojem. Vrednost ostaje ista: $\\frac{6}{8}=\\frac{3}{4}$ (podelili smo sa 2).', 'skraćivanje', { mediji: { vrsta: 'formula', tekst: '$\\frac{6}{8}=\\frac{6:2}{8:2}=\\frac{3}{4}$' } });
  Q(1, 'Proširi razlomak $\\frac{1}{2}$ brojem 3. Šta dobijaš?',
    ['$\\frac{3}{6}$', '$\\frac{2}{3}$', '$\\frac{4}{6}$', '$\\frac{1}{6}$'],
    'Množimo i brojilac i imenilac sa 3: $\\frac{1\\cdot3}{2\\cdot3}=\\frac{3}{6}$. Razlomak je isti, samo je zapisan sitnijim delovima.', 'proširivanje');
  Q(1, 'Skrati razlomak $\\frac{6}{8}$. Šta dobijaš?',
    ['$\\frac{3}{4}$', '$\\frac{2}{3}$', '$\\frac{6}{4}$', '$\\frac{4}{3}$'],
    'Oba broja delimo sa 2: $\\frac{6:2}{8:2}=\\frac{3}{4}$. Razlomak $\\frac{3}{4}$ se ne može dalje skratiti – to je najprostiji oblik.', 'skraćivanje');
  Q(2, 'Koji razlomak je veći: $\\frac{3}{4}$ ili $\\frac{1}{4}$?',
    ['$\\frac{3}{4}$', '$\\frac{1}{4}$', 'Jednaki su', 'Ne može se uporediti'],
    'Kad su imenioci isti, veći je razlomak sa većim brojiocem: 3 dela je više od 1 dela, pa je $\\frac{3}{4} > \\frac{1}{4}$.', 'upoređivanje');
  Q(2, 'Koji razlomak je veći: $\\frac{1}{2}$ ili $\\frac{1}{3}$?',
    ['$\\frac{1}{2}$', '$\\frac{1}{3}$', 'Jednaki su', 'Ne može se uporediti'],
    'Kad su brojioci isti, veći je razlomak sa MANJIM imeniocem: polovina je veći deo od trećine, pa je $\\frac{1}{2} > \\frac{1}{3}$.', 'upoređivanje');
  Q(3, 'Šta je veće: $\\frac{2}{3}$ ili $\\frac{3}{5}$?',
    ['$\\frac{2}{3}$', '$\\frac{3}{5}$', 'Jednaki su', 'Ne može se uporediti'],
    'Svedemo na zajednički imenilac: $\\frac{2}{3}=\\frac{10}{15}$, a $\\frac{3}{5}=\\frac{9}{15}$. Pošto je $10 > 9$, veći je $\\frac{2}{3}$.', 'upoređivanje');

  S(2, 'Spoji razlomak sa decimalnim zapisom.',
    [['$\\frac{1}{10}$', '$0,\\!1$'], ['$\\frac{3}{100}$', '$0,\\!03$'], ['$\\frac{1}{2}$', '$0,\\!5$'], ['$\\frac{7}{10}$', '$0,\\!7$']],
    'Decimalni zapis je samo drugi način da zapišemo razlomak sa imeniocem 10, 100, 1000…', 'decimala');

  // ── 24. decimalni zapis razlomka ──
  L('Decimalni zapis razlomka');
  Q(1, 'Kako se zove zapis razlomka pomoću zareza?',
    ['Decimalni zapis', 'Rimski zapis', 'Prost zapis', 'Slovni zapis'],
    'Decimalni zapis koristi zarez: $\\frac{1}{10}=0,\\!1$. Cifre desno od zareza zovu se decimale.', 'decimala');
  Q(1, 'Kako decimalno zapisuješ razlomak $\\frac{1}{10}$?',
    ['$0,\\!1$', '$1,\\!0$', '$0,\\!01$', '$10$'],
    '$\\frac{1}{10}$ je jedna desetina, a to je $0,\\!1$ – prvo mesto desno od zareza su desetinke.', 'decimala', { mediji: { vrsta: 'formula', tekst: '$\\frac{1}{10}=0,\\!1$' } });
  Q(1, 'Kako decimalno zapisuješ razlomak $\\frac{7}{10}$?',
    ['$0,\\!7$', '$7,\\!0$', '$0,\\!07$', '$0,\\!007$'],
    'Sedam desetina = $0,\\!7$. Cifra 7 je na prvom decimalnom mestu – mestu desetinki.', 'decimala', { mediji: { vrsta: 'formula', tekst: '$\\frac{7}{10}=0,\\!7$' } });
  Q(2, 'Kako decimalno zapisuješ razlomak $\\frac{3}{100}$?',
    ['$0,\\!03$', '$0,\\!3$', '$3,\\!0$', '$0,\\!003$'],
    'Tri stotinke = $0,\\!03$. Stotinke su na drugom decimalnom mestu, pa 3 mora da stigne tamo – zato ispred ide nula.', 'decimala', { mediji: { vrsta: 'formula', tekst: '$\\frac{3}{100}=0,\\!03$' } });
  Q(2, 'Koji razlomak je zapisan kao $0,\\!5$?',
    ['$\\frac{5}{10}=\\frac{1}{2}$', '$\\frac{5}{100}$', '$\\frac{1}{5}$', '$\\frac{5}{1000}$'],
    '$0,\\!5$ je pet desetina: $\\frac{5}{10}$, a to se skrati na $\\frac{1}{2}$. Polovina i $0,\\!5$ su isti broj.', 'decimala');
  Q(2, 'U broju $0,\\!37$, koja je cifra desetinki, a koja stotinki?',
    ['Desetinke 3, stotinke 7', 'Desetinke 7, stotinke 3', 'Obe su desetinke', 'Obe su stotinke'],
    'Prvo decimalno mesto su desetinke (3), drugo su stotinke (7): $0,\\!37 = \\frac{3}{10}+\\frac{7}{100}$.', 'decimala');
  Q(3, 'Koliko decimalnih mesta ima broj $0,\\!075$?',
    ['3', '2', '4', '1'],
    'Decimale su sve cifre desno od zareza: 0, 7 i 5 – ukupno 3 decimalna mesta (hiljaditinke).', 'decimala');

  // ── 25. upoređivanje i zaokrugljivanje decimalnih brojeva ──
  L('Upoređivanje i zaokrugljivanje decimalnih brojeva');
  Q(1, 'Šta je veće: $0,\\!5$ ili $0,\\!45$?',
    ['$0,\\!5$', '$0,\\!45$', 'Jednaki su', 'Ne može se uporediti'],
    'Dopišemo nulu da imaju isti broj decimala: $0,\\!50$ i $0,\\!45$. Pošto je $50 > 45$, veći je $0,\\!5$.', 'decimala');
  Q(2, 'Zaokrugli broj $3,\\!78$ na jednu decimalu.',
    ['$3,\\!8$', '$3,\\!7$', '$3,\\!78$', '$4$'],
    'Gledamo cifru iza prve decimale: to je 8, a 8 je veće ili jednako 5, pa prvu decimalu povećavamo: $3,\\!8$.', 'približno');
  Q(2, 'Zaokrugli broj $2,\\!34$ na jednu decimalu.',
    ['$2,\\!3$', '$2,\\!4$', '$2,\\!34$', '$2$'],
    'Cifra iza prve decimale je 4, a 4 je manje od 5, pa prva decimala ostaje ista: $2,\\!3$.', 'približno');
  Q(2, 'Zaokrugli broj $6,\\!5$ na ceo broj.',
    ['7', '6', '6,5', '10'],
    'Cifra iza zareza je 5, pa broj zaokrugljujemo naviše: $6,\\!5 \\approx 7$.', 'približno');
  Q(3, 'Poređaj od najmanjeg ka najvećem: $0,\\!7$, $0,\\!17$, $0,\\!07$.',
    ['$0,\\!07 < 0,\\!17 < 0,\\!7$', '$0,\\!7 < 0,\\!17 < 0,\\!07$', '$0,\\!17 < 0,\\!07 < 0,\\!7$', 'Svi su jednaki'],
    'Upišemo iste brojeve decimala: $0,\\!70$, $0,\\!17$, $0,\\!07$. Redom od najmanjeg: $0,\\!07$, pa $0,\\!17$, pa $0,\\!70$.', 'decimala');
  Q(3, 'U broju $12,\\!347$, koja cifra je na mestu stotinki?',
    ['4', '3', '7', '2'],
    'Decimale redom: 3 su desetinke, 4 su stotinke, 7 su hiljaditinke. Dakle, stotinke su cifra 4.', 'decimala');

};
