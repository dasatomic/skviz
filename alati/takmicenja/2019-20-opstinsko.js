// Opštinsko takmičenje iz matematike učenika osnovnih škola, školska 2019/20. (DMS, Bilten 2019/20)
// https://dms.rs/wp-content/uploads/2020/01/opstinsko-zadaci.pdf, rešenja u https://dms.rs/wp-content/uploads/2020/08/Bilten-2019-20.pdf
module.exports = {
  godina: '2019/20', nivo: 'opstinsko', datum: '2020.',
  zadaci: ({ Z, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 2,
      'U zapisu $AB + ABB + CBBC = BCDC$ zameni svako slovo cifrom (ista slova istom cifrom, različita različitim) tako da sabiranje bude tačno. Koliki je zbir $BCDC$?',
      ['$5494$', '$5484$', '$4594$', '$5594$'],
      [
        'Slova $A$, $B$, $C$ su prve cifre nekih brojeva, pa nisu $0$.',
        'Jedinice: $B + B + C$ se završava cifrom $C$, tj. $2B$ se završava nulom: $B = 5$ (jer $B ≠ 0$), uz prenos $1$.',
        'Hiljade: rezultat je četvorocifren i počinje sa $B = 5$, a sabirak $CBBC$ je jedini četvorocifren: $C = 4$ (uz prenos $1$ iz stotina) ili $C = 5$ – ali $C ≠ B$, pa $C = 4$.',
        K('Desetice: $A + 5 + 5 + 1$ (prenos) $= D + 10 · (\\text{prenos})$; stotine: $A + 5 + 1 = 14$ (da bi hiljade dale $5$). Odatle $A = 8$, i iz desetica $D = 9$.', [], C.tabela([['', '', '', '8', '5'], ['', '', '8', '5', '5'], ['+', '4', '5', '5', '4'], ['', '5', '4', '9', '4']], { zaglavlje: false, istakni: [[3, 1], [3, 2], [3, 3], [3, 4]] })),
        'Provera: $85 + 855 + 4554 = 5494$ ✓.',
      ]);
    Z(5, 2, 1,
      'Spajanjem dva jednaka kvadra nastala je kocka površine $384 cm²$. Kolika je površina jednog kvadra?',
      ['$256 cm²$', '$192 cm²$', '$224 cm²$', '$288 cm²$'],
      [
        'Kocka ima $6$ jednakih strana: $6a² = 384$, pa je $a² = 64$ i $a = 8 cm$.',
        'Kocka je presečena na pola, pa je svaki kvadar $8 × 8 × 4$.',
        K('Površina kvadra: $2 · 8 · 8 + 2 · 8 · 4 + 2 · 8 · 4 = 128 + 64 + 64 = 256 cm²$.', [], C.kocke(2, 2, 1)),
        'Primeti: $2 · 256 = 512 > 384$ – pri spajanju „nestaju“ dve dodirne strane $8 × 8$.',
      ]);
    Z(5, 3, 2,
      'Date su tačke $A, B, C, D, E$. Tačke $A, B, C$ su kolinearne, $A, D, E$ su kolinearne, i nikoje $4$ nisu kolinearne. Koliko pravih i koliko trouglova određuju ovih pet tačaka?',
      ['$6$ pravih i $8$ trouglova', '$10$ pravih i $10$ trouglova', '$8$ pravih i $6$ trouglova', '$6$ pravih i $10$ trouglova'],
      [
        'Da nema kolinearnih trojki: ${5 · 4|2} = 10$ pravih i ${5 · 4 · 3|6} = 10$ trouglova.',
        'Svaka kolinearna trojka daje $1$ pravu umesto $3$ (gubimo $2$) i ne daje trougao (gubimo $1$).',
        K('Pravih: $10 − 2 · 2 = 6$. Trouglova: $10 − 2 = 8$.', [], G({ A: [0, 0, 180], B: [3, 1.5, 90], C: [6, 3, 90], D: [3, -1.5, -90], E: [6, -3, -90] }, [{ d: 'AC', b: 1 }, { d: 'AE', b: 2 }, { tacka: 'A' }, { tacka: 'B' }, { tacka: 'C' }, { tacka: 'D' }, { tacka: 'E' }, { d: 'BD', isp: 1 }, { d: 'BE', isp: 1 }, { d: 'CD', isp: 1 }, { d: 'CE', isp: 1 }])),
      ]);
    Z(5, 4, 3,
      'Skupovi $A$, $B$, $C$ zadovoljavaju: $A ∪ B ∪ C = \\{1, 2, …, 9\\}$, $A ∩ B = \\{5, 6, 7\\}$, $A \\ C = \\{1, 2, 6, 7\\}$, $B \\ (A ∪ C) = \\{8, 9\\}$, $B ∩ C = \\{3, 5\\}$. Koliko ima rešenja (trojki skupova)?',
      ['$2$', '$1$', '$4$', '$3$'],
      [
        'Iz $A ∩ B = \\{5, 6, 7\\}$ i $B ∩ C = \\{3, 5\\}$: $5$ je u sva tri, $6, 7$ u $A$ i $B$ (ne u $C$ – potvrđuje $A \\ C$), $3$ u $B$ i $C$ (ne u $A$).',
        '$A \\ C = \\{1, 2, 6, 7\\}$: $1, 2$ su u $A$, a ne u $C$; ne mogu biti u $B$ (inače bi bili u $A ∩ B$). $8, 9$ su samo u $B$.',
        K('Ostaje broj $4$: nije u $B$ ($B \\ (A ∪ C)$ i preseci ga ne sadrže), nije u $A \\ C$, pa je u $C$ – a može, ali ne mora biti u $A$.', [], C.tabela([['~broj', 1, 2, 3, 4, 5, 6, 7, 8, 9], ['A', '✓', '✓', '', '?', '✓', '✓', '✓', '', ''], ['B', '', '', '✓', '', '✓', '✓', '✓', '✓', '✓'], ['C', '', '', '✓', '✓', '✓', '', '', '', '']], { istakni: [[1, 4]] })),
        'Dva rešenja: $B = \\{3, 5, 6, 7, 8, 9\\}$, $C = \\{3, 4, 5\\}$, i $A = \\{1, 2, 5, 6, 7\\}$ ili $A = \\{1, 2, 4, 5, 6, 7\\}$.',
      ]);
    Z(5, 5, 2,
      'Razlika dva prosta broja je jednocifren broj $d > 0$. Koji jednocifren broj NE može biti takva razlika?',
      ['$7$', '$9$', '$1$', '$8$'],
      [
        K('Proverimo redom: $1 = 3 − 2$, $2 = 5 − 3$, $3 = 5 − 2$, $4 = 11 − 7$, $5 = 7 − 2$, $6 = 11 − 5$, $8 = 11 − 3$, $9 = 11 − 2$.', [], C.tabela([['d', 1, 2, 3, 4, 5, 6, 7, 8, 9], ['~primer', '3−2', '5−3', '5−2', '11−7', '7−2', '11−5', '—', '11−3', '11−2']], { istakni: [[1, 7]] })),
        'A $7$? Neparna razlika nastaje samo kao razlika neparnog i parnog broja. Jedini paran prost broj je $2$, pa bi bilo $p − 2 = 7$, $p = 9$ – a $9$ nije prost.',
        'Dakle $d$ može biti svaki jednocifren broj osim $7$.',
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Osnovica $AB$ jednakokrakog trougla $ABC$ je $10 cm$, a ugao na osnovici je $72°$. Simetrala ugla $BAC$ seče krak $BC$ u tački $D$. Kolika je dužina izlomljene linije $BADC$?',
      ['$30 cm$', '$20 cm$', '$25 cm$', '$10 + 10√5 cm$'],
      [
        'Ugao pri vrhu: $180° − 2 · 72° = 36°$. Simetrala deli ugao $A$ na dva po $36°$.',
        K('Trougao $ABD$: uglovi $36°$ (kod $A$), $72°$ (kod $B$), pa je kod $D$ $72°$ – jednakokrak: $AD = AB = 10 cm$.', ['t1']),
        K('Trougao $ADC$: uglovi $36°$ kod $A$ i $36°$ kod $C$ – jednakokrak: $DC = DA = 10 cm$.', ['t2']),
        '$BA + AD + DC = 10 + 10 + 10 = 30 cm$.',
      ],
      G({ A: [0, 0, 225], B: [10, 0, -45], C: [5, 15.39, 90], D: [8.09, 5.878, 0] },
        [{ p: 'ABC' }, { d: 'AD', b: 1 }, { u: 'CBA', o: '72°' }, { p: 'ABD', id: 't1', b: 2, k: 2 }, { p: 'ADC', id: 't2', b: 4, k: 3 }]));
    Z(6, 2, 2,
      'Ceo broj je „kul“ ako je za jedan veći od broja deljivog sa $3$ (oblik $3k + 1$). Koliki je zbir svih kul brojeva između $−300$ i $300$?',
      ['$−100$', '$0$', '$100$', '$200$'],
      [
        'Kul brojevi između $−300$ i $300$: od $−299$ ($= 3 · (−100) + 1$) do $298$ ($= 3 · 99 + 1$), sa korakom $3$ – ukupno $200$ brojeva.',
        K('Uparimo prvi i poslednji, drugi i pretposlednji…: $−299 + 298 = −1$, $−296 + 295 = −1$, …', [], C.tabela([['~levo', '−299', '−296', '−293', '…', '−2'], ['~desno', 298, 295, 292, '…', 1], ['~zbir', '−1', '−1', '−1', '…', '−1']])),
        '$100$ parova, svaki sa zbirom $−1$: ukupno $−100$.',
      ]);
    Z(6, 3, 3,
      'Sve cifre petocifrenog broja $abcde$ ($a ≠ 0$, $e ≠ 0$) su različite, a zbir cifara je $10$. Kada se broj sabere sa brojem zapisanim istim ciframa obrnutim redom, dobija se broj sa svim jednakim ciframa. Koliko ima takvih brojeva?',
      ['$4$', '$2$', '$6$', '$8$'],
      [
        'Pet različitih cifara sa zbirom $10$: najmanji mogući zbir $0 + 1 + 2 + 3 + 4 = 10$ – dakle cifre su baš $0, 1, 2, 3, 4$.',
        'Oba broja imaju zbir cifara $10$; sabiranjem bez prenosa dobija se broj sa zbirom cifara $20$ i jednakim ciframa – petocifren: $44444$. (Šestocifren sa jednakim ciframa bi imao zbir deljiv sa $6$.)',
        'Srednja cifra: $c + c = 4$, pa $c = 2$. Krajevi: $a + e = 4$ i $b + d = 4$, bez nule na kraju i na početku: $\\{a, e\\} = \\{1, 3\\}$, $\\{b, d\\} = \\{0, 4\\}$.',
        K('Brojevi: $14203$, $10243$, $30241$, $34201$ – četiri.', [], C.tabela([['~broj', 14203, 10243, 30241, 34201], ['~obrnut', 30241, 34201, 14203, 10243], ['~zbir', 44444, 44444, 44444, 44444]])),
      ]);
    Z(6, 4, 2,
      'Mikša je radio $6$ testova (svaki se boduje celim brojem od $0$ do $100$). Na prvih $5$ imao je isti broj poena, a na šestom više. Prosek je $72$. Koliko poena je mogao da osvoji na poslednjem testu?',
      ['$77, 82, 87, 92$ ili $97$', 'samo $97$', '$72$ ili $77$', '$78, 84, 90$ ili $96$'],
      [
        'Ako je na prvih pet po $x$, a na šestom $y$: $5x + y = 6 · 72 = 432$, i $y > x$.',
        'Iz $y > x$ i proseka $72$: $y > 72 > x$. Takođe $y = 432 − 5x$ mora davati ostatak $2$ pri deljenju sa $5$ (kao $432$).',
        K('$y ≤ 100$ i $y > 72$, oblika $5k + 2$: $77, 82, 87, 92, 97$ (tada $x = 71, 70, 69, 68, 67$).', [], C.tabela([['y', 77, 82, 87, 92, 97], ['x', 71, 70, 69, 68, 67]])),
      ]);
    Z(6, 5, 3,
      'U trouglu je jedan unutrašnji ugao jednak nekom spoljašnjem uglu tog trougla. Jedan od preostala dva spoljašnja ugla je pet puta veći od nekog od preostala dva unutrašnja ugla. Koji su mogući unutrašnji uglovi?',
      ['$90°, 22° 30\', 67° 30\'$ ili $90°, 30°, 60°$', 'samo $90°, 30°, 60°$', '$90°, 18°, 72°$ ili $90°, 30°, 60°$', 'samo $90°, 22° 30\', 67° 30\'$'],
      [
        'Spoljašnji ugao je jednak zbiru dva nesusedna unutrašnja, pa je veći od svakog od njih. Zato unutrašnji ugao može biti jednak spoljašnjem samo kod istog temena – a tada su oba $90°$: trougao je pravougli, $γ = γ_{1} = 90°$.',
        'Slučaj $α_{1} = 5β$ (spoljašnji kod $A$, unutrašnji kod $B$): $α_{1} = β + γ = β + 90°$, pa $5β = β + 90°$, $β = 22° 30\'$, $α = 67° 30\'$.',
        'Slučaj $α_{1} = 5α$ (isto teme): $α + α_{1} = 180°$, pa $6α = 180°$, $α = 30°$, $β = 60°$.',
        'Ostali slučajevi su simetrični. Rešenja: unutrašnji $90°, 67° 30\', 22° 30\'$ (spoljašnji $90°, 112° 30\', 157° 30\'$) ili $90°, 30°, 60°$ (spoljašnji $90°, 150°, 120°$).',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'Između koja dva uzastopna prirodna broja se nalazi vrednost izraza $√{2019 + √5 + √{10} + √{17}}$?',
      ['$45$ i $46$', '$44$ i $45$', '$46$ i $47$', '$2019$ i $2020$'],
      [
        'Procenimo korene: $2 < √5 < 3$, $3 < √{10} < 4$, $4 < √{17} < 5$.',
        'Zato je $2019 + 9 < 2019 + √5 + √{10} + √{17} < 2019 + 12$, tj. broj pod korenom je između $2028$ i $2031$.',
        K('$45² = 2025 < 2028$ i $46² = 2116 > 2031$, pa je vrednost izraza između $45$ i $46$.', [], C.brojevna(2020, 2120, [[2025, '45²', 2], [2028, '', 1], [2031, '', 1], [2116, '46²', 2]], { podela: 10, svaki: 5 })),
      ]);
    Z(7, 2, 2,
      'Stranice trougla $ABC$ su $AB = 14 cm$, $BC = 15 cm$, $CA = 13 cm$. Tačka $S$ na stranici $AB$ jednako je udaljena od stranica $AC$ i $BC$. Kolika je površina trougla $ABC$ i koliko je rastojanje tačke $S$ od stranica $AC$ i $BC$?',
      ['$P = 84 cm²$, $6 cm$', '$P = 84 cm²$, $12 cm$', '$P = 84 cm²$, $5,6 cm$', '$P = 72 cm²$, $4 cm$'],
      [
        'Površina (Heron): $s = 21$, $P = √{21 · 7 · 6 · 8} = 84 cm²$.',
        K('Neka je $h$ traženo rastojanje. Duž $CS$ deli trougao na $ASC$ i $BSC$ sa visinama $h$ na stranice $AC$ i $BC$.', ['t1', 't2']),
        '$84 = {13h|2} + {15h|2} = 14h$, pa je $h = 6 cm$.',
        'Tačka $S$ je presek simetrale ugla $C$ sa $AB$ (jednako udaljena od krakova ugla).',
      ],
      G({ A: [0, 0, 225], B: [14, 0, -45], C: [5, 12, 90], S: [6.5, 0, -90] },
        [{ p: 'ABC' }, { d: 'CS', isp: 1 }, { p: 'ASC', id: 't1', b: 2, k: 2 }, { p: 'BSC', id: 't2', b: 4, k: 2 }]));
    Z(7, 3, 2,
      'Kameni ugalj u jami sadrži $2%$ vode, a posle nekoliko dana izvan jame $6%$ vode. Za koliko se povećala masa uglja, ako je iz jame izvađeno $1000 t$?',
      ['$42{26|47} t$', '$40 t$', '$41{1|3} t$', '$60 t$'],
      [
        'Suva materija se ne menja: u $1000 t$ ima $98% = 980 t$ suvog uglja.',
        'Posle upijanja vlage suva materija čini $94%$ mase: $0,94 · m = 980$, pa je $m = {980|0,94} = {98 000|94} = 1042{26|47} t$.',
        K('Povećanje: $42{26|47} t ≈ 42,55 t$ (a ne $40 t$, kao da bi se procenti samo sabrali!).', [], G({}, [C.pr(0, 0, 98, 4, 0, { gusto: 1 }), C.pr(98, 0, 2, 4, 1, { gusto: 1 }), { tx: '~980 t suvo', at: [49, 1.6] }, C.pr(0, -6, 98, 4, 0, { gusto: 1 }), C.pr(98, -6, 6.26, 4, 1, { gusto: 1 }), { tx: '~980 t = 94%', at: [49, -4.4] }])),
      ]);
    Z(7, 4, 2,
      'Na slici je pravougli trapez $ABCD$ ($AD ⊥ AB$, $AD = DC = 10 cm$). Površina trougla $ACD$ je pet puta manja od površine trougla $ABC$. Koliki su obim i površina trapeza?',
      ['$O = 10(7 + √{17}) cm$, $P = 300 cm²$', '$O = 10(7 + √{17}) cm$, $P = 250 cm²$', '$O = 110 cm$, $P = 300 cm²$', '$O = 10(7 + √{17}) cm$, $P = 600 cm²$'],
      [
        'Trouglovi $ACD$ i $ABC$ imaju jednake visine (visinu trapeza), pa se površine odnose kao osnovice: $AB = 5 · CD = 50 cm$.',
        'Površina trapeza: ${50 + 10|2} · 10 = 300 cm²$.',
        K('Za obim: $E$ podnožje normale iz $C$ na $AB$, $EB = 40$, pa $BC = √{40² + 10²} = 10√{17}$, a obim $10(7 + √{17}) cm$.', [], G({ A: [0, 0, 225], B: [50, 0, -45], C: [10, 10, 90], D: [0, 10, 135], E: [10, 0, -90] }, [{ p: 'ABCD' }, { d: 'AC', isp: 1 }, { d: 'CE', isp: 1 }, { pu: 'CEB' }])),
      ],
      G({ A: [0, 0, 225], B: [50, 0, -45], C: [10, 10, 90], D: [0, 10, 135] }, [{ p: 'ABCD' }, { d: 'AC', isp: 1 }, { d: 'AD', o: '10cm' }, { d: 'DC', o: '10cm' }, { pu: 'BAD' }]));
    Z(7, 5, 2,
      'Koji je najmanji trocifren prirodan broj $n$ za koji je zbir cifara njegovog zbira cifara jednak $9$?',
      ['$108$', '$900$', '$189$', '$117$'],
      [
        'Broj i njegov zbir cifara daju isti ostatak pri deljenju sa $9$. Ako je „zbir cifara zbira cifara“ $9$, onda je $n$ deljiv sa $9$.',
        'Najmanji trocifreni deljiv sa $9$ je $108$: zbir cifara $9$, a zbir cifara broja $9$ je $9$ ✓.',
        'Manji trocifreni brojevi ($100$–$107$) nisu deljivi sa $9$, pa ne mogu imati to svojstvo.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Koliko prirodnih brojeva $n$ zadovoljava ${n(200 − 19n)|(n − 2)²(n − 4)^{2020}} > 0$?',
      ['$8$', '$10$', '$9$', '$7$'],
      [
        'Razlomak je definisan za $n ≠ 2$ i $n ≠ 4$; tada je imenilac pozitivan (paran stepen).',
        '$n > 0$, pa je razlomak pozitivan tačno kad je $200 − 19n > 0$, tj. $n < {200|19} ≈ 10,5$: $n ≤ 10$.',
        K('Od $1, …, 10$ izbacimo $2$ i $4$: $n ∈ \\{1, 3, 5, 6, 7, 8, 9, 10\\}$ – $8$ brojeva.', [], C.brojevna(0, 11, [[1, '', 1], [3, '', 1], [5, '', 1], [6, '', 1], [7, '', 1], [8, '', 1], [9, '', 1], [10, '', 1], [2, '✗', 4], [4, '✗', 4]], { podela: 1, svaki: 1 })),
      ]);
    Z(8, 2, 2,
      'Kolika je površina kruga upisanog u kružni isečak površine $150π cm²$ sa centralnim uglom $60°$?',
      ['$100π cm²$', '$75π cm²$', '$50π cm²$', '$225π cm²$'],
      [
        'Isečak od $60°$ je šestina kruga, pa je ceo krug $900π$: poluprečnik $R = 30 cm$.',
        K('Centar upisanog kruga $I$ je na simetrali ugla, a krug dodiruje krak isečka. Trougao od centra isečka $F$, centra $I$ i dodirne tačke ima ugao $30°$ kod $F$, pa je $FI = 2r$.', ['k']),
        'Krug dodiruje i luk: $FI + r = R$, tj. $3r = 30$, $r = 10 cm$.',
        'Površina: $100π cm²$.',
      ],
      G({ F: [0, 0, 225], I: [17.32, 10, 0], x1: [30, 0], x2: [15, 25.98] }, [{ is: 'F', r: 30, od: 0, do: 60, b: 4 }, { u: 'x1Fx2', o: '60°', r: 30 }, { kr: 'I', r: 10, b: 1, id: 'k', k: 0 }, { d: 'FI', isp: 1, k: 2 }, { lin: [[17.32, 10], [17.32, 0]], b: 2, k: 2 }], { bezImena: ['F', 'I'] }));
    Z(8, 3, 2,
      'Koliko celobrojnih rešenja $(x, y)$ ima jednačina $||2x − 4| − 6| + |7 − |1 − y|| = 0$?',
      ['$4$', '$2$', '$8$', '$1$'],
      [
        'Zbir dve apsolutne vrednosti je $0$ samo ako su obe $0$: $|2x − 4| = 6$ i $|1 − y| = 7$.',
        '$2x − 4 = ±6$: $x = 5$ ili $x = −1$.',
        '$1 − y = ±7$: $y = −6$ ili $y = 8$.',
        'Kombinacije: $(5, −6), (5, 8), (−1, −6), (−1, 8)$ – četiri rešenja.',
      ]);
    Z(8, 4, 2,
      'Za koje vrednosti realnog broja $m$ jednačina ${3x + 4m|4} − {3mx|2} = m − {x − 1|4}$ ima negativno rešenje?',
      ['$m > {2|3}$', '$m < {2|3}$', '$m > −{2|3}$', '$m ≠ {2|3}$'],
      [
        'Pomnožimo sa $4$: $3x + 4m − 6mx = 4m − x + 1$. Članovi $4m$ se skrate: $3x − 6mx + x = 1$, tj. $x(4 − 6m) = 1$.',
        'Za $m = {2|3}$ dobija se $0 = 1$ – nema rešenja. Inače je $x = {1|4 − 6m} = {1|2(2 − 3m)}$.',
        'Negativno rešenje: imenilac negativan, $2 − 3m < 0$, tj. $m > {2|3}$.',
      ]);
    Z(8, 5, 2,
      'Koliki je najmanji mogući zbir četiri unutrašnja ugla konveksnog sedmougla kome su svi uglovi celi brojevi stepeni?',
      ['$363°$', '$360°$', '$366°$', '$540°$'],
      [
        'Zbir uglova sedmougla je $(7 − 2) · 180° = 900°$.',
        'Zbir četiri ugla je najmanji kad je zbir preostala tri najveći. U konveksnom mnogouglu svaki ugao je manji od $180°$, a celobrojan – najviše $179°$.',
        'Najveći zbir tri ugla: $3 · 179° = 537°$. Najmanji zbir četiri: $900° − 537° = 363°$ (npr. uglovi $179°, 179°, 179°, 90°, 91°, 91°, 91°$).',
      ]);
  },
};
