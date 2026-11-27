// Okružno takmičenje iz matematike učenika osnovnih škola, 18. 3. 2023. (DMS)
// https://dms.rs/wp-content/uploads/2023/03/Resenja-zadataka-2023-1.pdf
module.exports = {
  godina: '2022/23', nivo: 'okruzno', datum: '18. 3. 2023.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Elementi skupova $A$, $B$ i $C$ su redom slova reči SELEKCIJA, SEKCIJA i LEKCIJA. Koliko je $C ∩ (B \\ A)$?',
      ['$∅$ (prazan skup)', '$\\{L\\}$', '$\\{E, K, C, I, J, A\\}$', '$\\{S\\}$'],
      [
        'Skup sadrži svako slovo samo jednom: $A = \\{S, E, L, K, C, I, J, A\\}$, $B = \\{S, E, K, C, I, J, A\\}$, $C = \\{L, E, K, C, I, J, A\\}$.',
        K('$A \\ B$ su slova iz $A$ kojih nema u $B$: samo $L$. Zato je $C ∪ (A \\ B) = C ∪ \\{L\\} = C$ (jer je $L$ već u $C$).', [], C.tabela([['~slovo', 'S', 'E', 'L', 'K', 'C', 'I', 'J', 'A'], ['A', '✓', '✓', '✓', '✓', '✓', '✓', '✓', '✓'], ['B', '✓', '✓', '', '✓', '✓', '✓', '✓', '✓'], ['C', '', '✓', '✓', '✓', '✓', '✓', '✓', '✓']], { istakni: [[1, 3]] })),
        '$B \\ A$: svako slovo reči SEKCIJA nalazi se i u reči SELEKCIJA, pa je $B \\ A = ∅$.',
        'Presek bilo kog skupa sa praznim skupom je prazan: $C ∩ (B \\ A) = ∅$.',
      ]);
    Z(5, 2, 1,
      'Zbir uglova $α$, $β$ i $γ$ jednak je $180°$. Uglovi $α$ i $β$ su komplementni, a uglovi $5β$ i $γ$ suplementni. Kolike su mere uglova?',
      ['$α = 72°$, $β = 18°$, $γ = 90°$', '$α = 60°$, $β = 30°$, $γ = 90°$', '$α = 75°$, $β = 15°$, $γ = 90°$', '$α = 54°$, $β = 36°$, $γ = 90°$'],
      [
        'Komplementni: $α + β = 90°$. Iz $α + β + γ = 180°$ odmah sledi $γ = 90°$.',
        'Suplementni: $5β + γ = 180°$, pa je $5β = 90°$ i $β = 18°$.',
        '$α = 90° − 18° = 72°$.',
      ]);
    Z(5, 3, 1,
      'Koliki je zbir svih razlomaka ${a|b}$ ($a, b$ prirodni brojevi) kod kojih je $a < b$, a proizvod brojioca i imenioca je $30$?',
      ['${13|10}$', '${7|6}$', '${11|10}$', '${3|2}$'],
      [
        'Rastavimo $30$ na dva činioca, manji prvo: $30 = 1 · 30 = 2 · 15 = 3 · 10 = 5 · 6$.',
        K('Razlomci su ${1|30}, {2|15}, {3|10}, {5|6}$.', [], C.tabela([['a', 1, 2, 3, 5], ['b', 30, 15, 10, 6], ['~u 30-im', 1, 4, 9, 25]])),
        'Zajednički imenilac $30$: ${1 + 4 + 9 + 25|30} = {39|30} = {13|10} = 1,3$.',
      ]);
    Z(5, 4, 2,
      'Knjiga je numerisana tako da je broj štampan samo na parnim stranama ($2, 4, 6, …$). Poslednja numerisana strana ima broj $234$. Koliko je neparnih cifara ukupno odštampano?',
      ['$108$', '$100$', '$116$', '$83$'],
      [
        'Svi odštampani brojevi su parni, pa im je poslednja cifra uvek parna. Neparne cifre mogu biti samo na mestu desetica ili stotina.',
        'Jednocifreni ($2, 4, 6, 8$): nema neparnih cifara.',
        'Dvocifreni ($10$–$98$): neparna je cifra desetica kod brojeva koji počinju sa $1, 3, 5, 7, 9$ – po $5$ parnih brojeva u svakoj takvoj desetici: $5 · 5 = 25$.',
        'Od $100$ do $198$: cifra $1$ na mestu stotina kod svih $50$ brojeva, plus neparna cifra desetica opet $25$ puta: $75$.',
        K('Od $200$ do $234$: neparna je samo cifra desetica u $210, 212, 214, 216, 218$ i $230, 232, 234$ – $8$ puta. Ukupno $25 + 75 + 8 = 108$.', [], C.tabela([['~strane', '2–8', '10–98', '100–198', '200–234'], ['~neparnih cifara', 0, 25, 75, 8]])),
      ]);
    Z(5, 5, 2,
      'Osam jednakih kvadrata spojeno je u pravougaonik $2 × 4$ (dva reda po četiri). Zbir površina svih kvadrata koji se mogu uočiti na slici je $80 cm²$. Koliki je zbir površina svih pravougaonika koji nisu kvadrati, a mogu se uočiti na slici?',
      ['$240 cm²$', '$320 cm²$', '$208 cm²$', '$160 cm²$'],
      [
        K('Kvadrati na slici: $8$ malih i $3$ velika (svaki od $2 × 2$ mala). Po površini to je $8 + 3 · 4 = 20$ malih kvadrata.', [], G({}, [...[0, 1, 2, 3].flatMap((x) => [0, 1].map((y) => C.pr(x, y, 1, 1, 0, { prazno: 1 }))), C.pr(0, 0, 2, 2, 1, { gusto: 1 }), C.pr(1.05, 0.05, 1.9, 1.9, 2, { prazno: 1, debljina: 3 }), C.pr(2, 0, 2, 2, 3, { prazno: 1, debljina: 3 })])),
        '$20 · a² = 80$, pa je mali kvadrat površine $4 cm²$, stranice $2 cm$.',
        'Pravougaonici koji nisu kvadrati (u malim kvadratima): $1 × 2$: $10$ komada (6 vodoravnih + 4 uspravna); $1 × 3$: $4$; $1 × 4$: $2$; $2 × 3$: $2$; $2 × 4$: $1$.',
        'Površine: $10 · 8 + 4 · 12 + 2 · 16 + 2 · 24 + 1 · 32 = 80 + 48 + 32 + 48 + 32 = 240 cm²$.',
      ],
      G({}, [...[0, 1, 2, 3].flatMap((x) => [0, 1].map((y) => C.pr(x, y, 1, 1, 0, { prazno: 1 })))]));

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Izračunaj vrednost izraza $−(b − a) − (a + (−b)) + 4ab$ ako je $a = −2,5$ i $b = 5,5$.',
      ['$−55$', '$55$', '$−39$', '$−71$'],
      [
        'Prvo sredimo: $−(b − a) = −b + a$ i $−(a + (−b)) = −a + b$.',
        'Zbir: $−b + a − a + b + 4ab = 4ab$ – prva dva dela se potpuno poništavaju!',
        '$4ab = 4 · (−2,5) · 5,5 = −10 · 5,5 = −55$.',
      ]);
    Z(6, 2, 2,
      'Vrednost izraza $(1 + {1|2}) · (1 + {1|3}) · (1 + {1|4}) · … · (1 + {1|n})$ je $2023$. Koliko činilaca ima u ovom izrazu?',
      ['$4044$', '$4045$', '$4046$', '$2023$'],
      [
        'Svaki činilac zapišimo kao razlomak: $1 + {1|k} = {k + 1|k}$. Izraz je ${3|2} · {4|3} · {5|4} · … · {n + 1|n}$.',
        K('Svaki imenilac se skrati sa brojiocem prethodnog razlomka („teleskop“): ostaju samo prvi imenilac $2$ i poslednji brojilac $n + 1$.', [], C.tabela([['~činilac', '3/2', '4/3', '5/4', '…', '(n+1)/n'], ['~ostaje', '÷2', '', '', '', 'n + 1']])),
        '${n + 1|2} = 2023$, pa je $n + 1 = 4046$ i $n = 4045$.',
        'Činioci idu od $k = 2$ do $k = 4045$, pa ih ima $4045 − 1 = 4044$.',
      ]);
    Z(6, 3, 2,
      'U fudbalu pobeda donosi $3$ boda, nerešeno $1$, a poraz $0$. Jedna ekipa je odigrala $68$ utakmica i osvojila $170$ bodova. Koliko je najviše utakmica mogla da izgubi?',
      ['$10$', '$12$', '$11$', '$8$'],
      [
        'Neka je $x$ pobeda, $y$ nerešenih, $z$ poraza: $3x + y = 170$ i $x + y + z = 68$.',
        'Poraza je najviše kad je $x + y$ najmanje. Ako smanjimo pobede za $1$, nerešenih mora biti $3$ više – zbir $x + y$ raste za $2$. Zato treba što više pobeda.',
        '$170 = 3 · 56 + 2$: najviše $56$ pobeda, uz $2$ nerešene.',
        K('Poraza: $68 − 56 − 2 = 10$.', [], C.tabela([['~pobeda x', 56, 55, 54], ['~nerešeno y', 2, 5, 8], ['~poraza z', 10, 8, 6]], { istakni: [[0, 1], [1, 1], [2, 1]] })),
      ]);
    D(6, 4, 2,
      'Dokaži da među $26$ različitih neparnih prirodnih brojeva manjih od $100$ postoje bar dva čiji je zbir $100$.',
      [
        K('Neparnih brojeva manjih od $100$ ima $50$, i oni se dele u $25$ parova sa zbirom $100$: $\\{1, 99\\}, \\{3, 97\\}, …, \\{49, 51\\}$.', [], C.tabela([['1', '3', '5', '…', '47', '49'], ['99', '97', '95', '…', '53', '51']], { zaglavlje: false })),
        'Iz svakog para smemo uzeti najviše jedan broj, pa bez zbira $100$ možemo izabrati najviše $25$ brojeva (npr. $1, 3, …, 49$).',
        'Ako izaberemo $26$, po Dirihleovom principu dva su iz istog para – njihov zbir je $100$. ∎',
      ]);
    Z(6, 5, 2,
      'Dat je kvadrat $ABCD$. Neka je $E$ tačka na polupravoj $AB$ takva da je $∡AED = 22° 30\'$. Ako se duži $AC$ i $DE$ seku u tački $S$, kolika je mera ugla $BSE$?',
      ['$45°$', '$67° 30\'$', '$22° 30\'$', '$90°$'],
      [
        'U pravouglom trouglu $AED$: $∡EDA = 90° − 22° 30\' = 67° 30\'$.',
        'Dijagonala polovi ugao kvadrata: $∡DAS = 45°$. U trouglu $ADS$: $∡DSA = 180° − 45° − 67° 30\' = 67° 30\'$.',
        K('Uglovi kod $D$ i $S$ su jednaki, pa je trougao $ADS$ jednakokrak: $AS = AD = AB$.', ['t1']),
        K('Zato je i trougao $ABS$ jednakokrak, a ugao kod $A$ je $45°$: $∡ASB = ∡ABS = {180° − 45°|2} = 67° 30\'$.', ['t2']),
        'Uglovi $DSA$, $ASB$ i $BSE$ čine opružen ugao (tačke $D, S, E$ su na pravoj): $∡BSE = 180° − 67° 30\' − 67° 30\' = 45°$.',
      ],
      G({ A: [0, 0, 225], B: [4, 0, -90], C: [4, 4, 45], D: [0, 4, 135], E: [9.657, 0, -45], S: [2.828, 2.828, 90] },
        [{ p: 'ABCD' }, { d: 'AC' }, { d: 'DE' }, { d: 'BE' }, { d: 'BS', b: 1 }, { u: 'DEA'.split('').reverse().join(''), o: '22°30\'' }, { u: 'BSE'.split('').reverse().join(''), o: '?', b: 3 },
          { p: 'ADS', id: 't1', b: 2, k: 3 }, { p: 'ABS', id: 't2', b: 4, k: 4 }]));

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'Zbir četiri polinoma $P_{1}, P_{2}, P_{3}, P_{4}$ je $x^{4} − 2x³ + 4x² − 8x + 13$. $P_{1}$ je stepena $4$, $P_{2}$ stepena $3$, $P_{3}$ stepena $2$, $P_{4}$ stepena $1$. Svi koeficijenti u $P_{1}$ su međusobno jednaki, isto tako u $P_{2}$ i u $P_{3}$. Koliki je polinom $P_{4}$?',
      ['$−12x + 9$', '$−8x + 13$', '$−12x + 13$', '$−4x + 9$'],
      [
        'Neka su koeficijenti $P_{1}$ svi jednaki $a$, $P_{2}$ svi $b$, $P_{3}$ svi $c$, i $P_{4} = dx + e$.',
        K('Zbir po stepenima: $x^{4}$: $a$; $x³$: $a + b$; $x²$: $a + b + c$; $x$: $a + b + c + d$; slobodan član: $a + b + c + e$.', [], C.tabela([['', 'x⁴', 'x³', 'x²', 'x', '1'], ['P₁', 'a', 'a', 'a', 'a', 'a'], ['P₂', '', 'b', 'b', 'b', 'b'], ['P₃', '', '', 'c', 'c', 'c'], ['P₄', '', '', '', 'd', 'e'], ['~zbir', 1, '−2', 4, '−8', 13]])),
        'Iz kolone $x²$: $a + b + c = 4$.',
        'Kolona $x$: $4 + d = −8$, pa je $d = −12$. Slobodan član: $4 + e = 13$, pa je $e = 9$.',
        '$P_{4} = −12x + 9$. (Usput: $a = 1$, $b = −3$, $c = 6$.)',
      ]);
    Z(7, 2, 2,
      'Težišne duži koje odgovaraju katetama pravouglog trougla imaju dužine $√{52} cm$ i $√{73} cm$. Koliko je rastojanje između težišta i centra opisane kružnice tog trougla?',
      ['${5|3} cm$', '$5 cm$', '${10|3} cm$', '$2 cm$'],
      [
        'Neka su katete $a = BC$ i $b = AC$, hipotenuza $c$. Težišna duž iz $A$ na katetu $BC$ je hipotenuza pravouglog trougla sa katetama $b$ i ${a|2}$: $t_{a}² = b² + {a²|4}$. Slično $t_{b}² = a² + {b²|4}$. Jedna od njih je $73$, druga $52$.',
        'Saberemo: $125 = {5|4}(a² + b²)$, pa je $a² + b² = c² = 100$, $c = 10 cm$. (Katete su $6$ i $8$.)',
        K('Centar opisane kružnice pravouglog trougla je središte hipotenuze $O$, a $CO = {c|2} = 5$ je težišna duž iz temena pravog ugla – na njoj je i težište $T$.', ['co']),
        'Težište deli težišnu duž u odnosu $2 : 1$: $TO = {1|3} · CO = {5|3} cm$.',
      ],
      G({ C: [0, 0, 225], A: [6, 0, -45], B: [0, 8, 135], O: [3, 4, 45], T: [2, 2.667, 180] },
        [{ p: 'ABC' }, { pu: 'ACB' }, { tacka: 'O' }, { d: 'CO', id: 'co', b: 1, k: 3 }, { tacka: 'T', k: 3 }, { d: 'TO', b: 2, k: 4 }]));
    D(7, 3, 2,
      'Dijagonale $AC$ i $BD$ paralelograma $ABCD$ seku se u tački $O$. Tačka $E$ je težište trougla $ABD$, a na duži $OC$ je tačka $G$ takva da je $OG : GC = 1 : 2$. Dokaži da je četvorougao $EBGD$ paralelogram.',
      [
        '$O$ je središte $BD$, pa je $AO$ težišna duž trougla $ABD$ i težište $E$ leži na njoj: $AE : EO = 2 : 1$, tj. $EO = {1|3}AO$.',
        'Iz $OG : GC = 1 : 2$ je $OG = {1|3}OC$, a kako je $AO = OC$ (dijagonale paralelograma se polove), $OG = EO$.',
        K('Četvorougao $EBGD$ ima dijagonale $EG$ i $BD$ koje se seku u $O$ i polove: $EO = OG$, $BO = OD$. Četvorougao čije se dijagonale polove je paralelogram.', ['p']),
      ],
      G({ A: [0, 0, 225], B: [6, 0, -45], C: [8, 4, 45], D: [2, 4, 135], O: [4, 2, -90], E: [2.667, 1.333, 225], G: [5.333, 2.667, 60] },
        [{ p: 'ABCD' }, { d: 'AC', isp: 1 }, { d: 'BD', isp: 1 }, { tacka: 'O' }, { tacka: 'E' }, { tacka: 'G' }, { p: 'EBGD', id: 'p', b: 1, k: 3 }]));
    Z(7, 4, 2,
      'Prosti brojevi $p$ i $q$ zadovoljavaju $20p + 23q = 2023$. Koliko je $p + q$?',
      ['$92$', '$80$', '$102$', '$72$'],
      [
        'Prepišimo: $23q − 23 = 2000 − 20p$, tj. $23(q − 1) = 20(100 − p)$.',
        '$NZD(20, 23) = 1$, pa $23$ mora deliti $100 − p$: $100 − p ∈ \\{23, 46, 69, 92\\}$, tj. $p ∈ \\{77, 54, 31, 8\\}$.',
        'Jedini prost je $p = 31$. Tada $23(q − 1) = 20 · 69$, pa je $q − 1 = 60$, $q = 61$ – prost ✓.',
        'Provera: $20 · 31 + 23 · 61 = 620 + 1403 = 2023$ ✓. Zbir $p + q = 92$.',
      ]);
    Z(7, 5, 2,
      'Na proslavi $20%$ gostiju nosi plave pantalone, a od njih $60%$ nosi bele cipele. Među gostima bez plavih pantalona $30%$ nosi bele cipele. Koliki procenat gostiju sa belim cipelama nosi plave pantalone?',
      ['$33{1|3}%$', '$20%$', '$60%$', '$50%$'],
      [
        'Zamislimo $100$ gostiju (procenti postaju brojevi). Plave pantalone: $20$, ostali: $80$.',
        'Bele cipele među plavim pantalonama: $60%$ od $20 = 12$. Među ostalima: $30%$ od $80 = 24$.',
        K('Bele cipele nosi $12 + 24 = 36$ gostiju, od kojih $12$ ima plave pantalone.', [], C.stubici([['~plave + bele', 12], ['~ostali + bele', 24]], { korakY: 6, maxY: 24, vrednosti: true })),
        'Udeo: ${12|36} = {1|3} = 33{1|3}%$.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Za koje realne brojeve $m$ ($m ≠ {1|2}$, $m ≠ −2$) grafik linearne funkcije $(m + 2)x + (1 − 2m)y + 2 = 0$ na koordinatnim osama odseca odsečke jednakih dužina?',
      ['$m = −{1|3}$ ili $m = 3$', 'samo $m = 3$', '$m = {1|3}$ ili $m = −3$', 'samo $m = −{1|3}$'],
      [
        'Napišimo eksplicitno: $y = {m + 2|2m − 1}x + {2|2m − 1}$. Koeficijent pravca je $k = {m + 2|2m − 1}$.',
        'Prava odseca jednake dužine na osama (prolazi kroz $(t, 0)$ i $(0, ±t)$) tačno kad je nagib $k = 1$ ili $k = −1$.',
        '$k = 1$: $m + 2 = 2m − 1$, pa je $m = 3$. Prava: $5x − 5y + 2 = 0$, tj. $y = x + 0,4$.',
        K('$k = −1$: $m + 2 = −2m + 1$, pa je $m = −{1|3}$. Prava: ${5|3}x + {5|3}y + 2 = 0$, tj. $y = −x − 1,2$.', [], G({}, [{ mreza: [-2, 2, -2, 2], ose: ['x', 'y'] }, { lin: [[-2, -1.6], [1.6, 2]], b: 1, debljina: 3 }, { lin: [[-2, 0.8], [0.8, -2]], b: 2, debljina: 3 }])),
      ]);
    Z(8, 2, 3,
      'Osnovna ivica pravilne trostrane piramide je dužine $x$, a bočna strana zaklapa sa ravni osnove ugao od $60°$. Koliko je $x$, ako je merni broj površine piramide jednak mernom broju njene zapremine?',
      ['$18$', '$12$', '$6√3$', '$9$'],
      [
        'Neka je $T$ težište osnove (podnožje visine $H$), a $M$ središte ivice. Ugao bočne strane prema osnovi je $∡SMT = 60°$, pa je $∡MST = 30°$.',
        '$TM = {1|3}$ visine osnove $= {1|3} · {x√3|2} = {x√3|6}$. Kateta naspram $30°$: $SM = 2 · TM = {x√3|3}$, a $H = TM · √3 = {x|2}$.',
        'Površina: $P = {x²√3|4} + 3 · {1|2} · x · {x√3|3} = {x²√3|4} + {x²√3|2} = {3x²√3|4}$.',
        'Zapremina: $V = {1|3} · {x²√3|4} · {x|2} = {x³√3|24}$.',
        K('$P = V$: ${3x²√3|4} = {x³√3|24}$, pa je $x = 18$.', [], C.piramida(3, 6, 3, [{ d: 'ST', isp: 1, b: 1 }], { T3: { T: [0, 0, 0] } })),
      ]);
    Z(8, 3, 2,
      'Na šahovskom turniru $15$ igrača igra svako sa svakim po jedan meč. Pobeda donosi $3$ boda, nerešeno $1$, poraz $0$. Bilo je $30$ nerešenih mečeva, a dva najbolje plasirana igrača imala su ukupno petinu svih bodova. Da li su ta dva igrača mogla imati isti broj bodova?',
      ['Ne, jer su zajedno imali neparan broj bodova ($57$)', 'Da, po $28,5$ bodova', 'Da, po $57$ bodova', 'Ne, jer su zajedno imali $60$ bodova'],
      [
        'Broj mečeva: ${15 · 14|2} = 105$.',
        'Meč sa pobednikom donosi ukupno $3$ boda, nerešen $2$ boda. Pobeda je bilo $105 − 30 = 75$.',
        'Ukupno bodova: $75 · 3 + 30 · 2 = 225 + 60 = 285$. Petina: $57$.',
        'Kad bi imali isto, zbir bi bio paran ($2 · n$), a $57$ je neparan. Zato nisu mogli imati isti broj bodova.',
      ]);
    Z(8, 4, 2,
      'Na koliko načina se slova reči TOPOLOG mogu razmestiti tako da nikada dva ista slova nisu jedno pored drugog?',
      ['$240$', '$840$', '$120$', '$360$'],
      [
        'Reč ima $7$ slova: tri slova O i četiri različita T, P, L, G. Samo se O mogu ponavljati.',
        'Prvo poređajmo T, P, L, G: $4 · 3 · 2 · 1 = 24$ načina. Između i oko njih ima $5$ „mesta“: _ * _ * _ * _ * _.',
        K('Tri slova O stavljamo na tri različita od tih $5$ mesta (na istom mestu bi bila susedna): ${5 · 4 · 3|6} = 10$ načina.', [], C.tabela([['_', '*', '_', '*', '_', '*', '_', '*', '_'], ['O', 'T', '', 'P', 'O', 'L', '', 'G', 'O']], { zaglavlje: false, istakni: [[1, 0], [1, 4], [1, 8]] })),
        'Ukupno: $24 · 10 = 240$.',
        'Provera drugim načinom: svih rasporeda je ${7!|3!} = 840$; oduzmemo one sa bar jednim parom OO ($6! = 720$) i vratimo one sa OOO ($5! = 120$): $840 − 720 + 120 = 240$ ✓.',
      ]);
    D(8, 5, 3,
      'Dokaži da ne postoji pravougli trougao čije su katete prirodni brojevi, a hipotenuza $√{20222023} cm$.',
      [
        'Po Pitagorinoj teoremi trebalo bi $a² + b² = 20222023$.',
        K('Kvadrat prirodnog broja završava se samo ciframa $0, 1, 4, 5, 6, 9$. Zbir dva takva da bi se završavao cifrom $3$ mora biti $4 + 9$.', [], C.tabela([['~cifra broja', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ['~kvadrat se završava', 0, 1, 4, 9, 6, 5, 6, 9, 4, 1]], { istakni: [[1, 3], [1, 4], [1, 8], [1, 9]] })),
        'Dakle $a = 10p ± 2$ i $b = 10q ± 3$. Tada je $a² + b² = 100p² ± 40p + 4 + 100q² ± 60q + 9$.',
        'Iz $a² + b² = 20222023$: $100p² ± 40p + 100q² ± 60q = 20222010$, pa deljenjem sa $10$: $10p² ± 4p + 10q² ± 6q = 2022201$.',
        'Leva strana je parna, a desna neparna – nemoguće. Takav trougao ne postoji.',
      ]);
  },
};
