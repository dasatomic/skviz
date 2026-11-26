// Školsko takmičenje iz matematike učenika osnovnih škola, školska 2019/20. (DMS, Bilten 2019/20)
// https://dms.rs/wp-content/uploads/2020/08/Bilten-2019-20.pdf
module.exports = {
  godina: '2019/20', nivo: 'skolsko', datum: '2019.',
  zadaci: ({ Z, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Izračunaj vrednosti izraza $A$, $B$, $A : B$ i $A · B$, ako je $A = 840 : (200 − 12 · 15)$ i $B = 12 + 840 : 60 − 20$.',
      ['$A = 42$, $B = 6$, $A : B = 7$, $A · B = 252$', '$A = 42$, $B = 6$, $A : B = 7$, $A · B = 242$', '$A = 4,2$, $B = 6$, $A : B = 0,7$, $A · B = 25,2$', '$A = 42$, $B = −6$, $A : B = −7$, $A · B = −252$'],
      [
        '$A$: prvo zagrada – u njoj prvo množenje: $12 · 15 = 180$, $200 − 180 = 20$; zatim $840 : 20 = 42$.',
        '$B$: prvo deljenje $840 : 60 = 14$, pa $12 + 14 − 20 = 6$.',
        '$A : B = 42 : 6 = 7$ i $A · B = 42 · 6 = 252$.',
      ]);
    Z(5, 2, 1,
      'Koliko kocki ivice $4 cm$ treba staviti jednu na drugu da bi se dobio kvadar površine $352 cm²$?',
      ['$5$', '$4$', '$6$', '$11$'],
      [
        'Ako stavimo $n$ kocki, dobijamo kvadar $4 × 4 × 4n$. Njegove dve osnove su kvadrati $4 × 4$: ukupno $2 · 16 = 32 cm²$.',
        K('Omotač čine $4$ pravougaonika $4 × 4n$: $4 · 16n = 64n cm²$.', [], C.kocke(1, 1, 5)),
        '$32 + 64n = 352$, pa je $64n = 320$ i $n = 5$.',
      ]);
    Z(5, 3, 2,
      'Koji su najmanji i najveći četvorocifreni broj čija je cifra desetica $5$ i koji je deljiv sa $6$?',
      ['$1050$ i $9954$', '$1050$ i $9858$', '$1056$ i $9954$', '$1152$ i $9954$'],
      [
        'Deljiv sa $6$ znači: paran (poslednja cifra parna) i deljiv sa $3$ (zbir cifara deljiv sa $3$).',
        'Najmanji: počinjemo od $105?$: zbir $6 + ?$ deljiv sa $3$, $?$ parno – najmanje $? = 0$: broj $1050$ ✓.',
        K('Najveći: počinjemo od $995?$: zbir $23 + ?$ deljiv sa $3$ traži $? ∈ \\{1, 4, 7\\}$, a od njih je paran samo $4$: broj $9954 = 6 · 1659$ ✓.', [], C.tabela([['?', 0, 2, 4, 6, 8], ['~zbir 23 + ?', 23, 25, 27, 29, 31], ['~deljiv sa 3?', '~ne', '~ne', '~da', '~ne', '~ne']], { istakni: [[0, 3], [1, 3], [2, 3]] })),
        'Napomena: u zvaničnom rešenju piše $9858$, ali $9954$ je veći, ima cifru desetica $5$ i deljiv je sa $6$ – pravi odgovor je $9954$.',
      ]);
    Z(5, 4, 2,
      'Ako brojeve $293$ i $671$ podelimo istim prirodnim brojem, dobijamo redom ostatke $7$ i $8$. Koji je delilac?',
      ['$13$', '$11$', '$17$', '$26$'],
      [
        'Ako $293$ pri deljenju sa $d$ daje ostatak $7$, onda je $293 − 7 = 286$ deljivo sa $d$. Slično, $671 − 8 = 663$ je deljivo sa $d$.',
        K('Rastavimo: $286 = 2 · 11 · 13$ i $663 = 3 · 13 · 17$. Zajednički delioci: $1$ i $13$.', [], C.tabela([['286', 2, 11, 13], ['663', 3, 13, 17]], { zaglavlje: false, istakni: [[0, 3], [1, 2]] })),
        'Delilac mora biti veći od ostatka $8$, pa je $d = 13$. Provera: $293 = 13 · 22 + 7$ ✓, $671 = 13 · 51 + 8$ ✓.',
      ]);
    Z(5, 5, 1,
      'Marko ima toliko dana koliko njegov otac nedelja, i toliko meseci koliko njegov deda godina. Sva trojica ukupno imaju $100$ godina. Koliko godina ima svaki?',
      ['Marko $5$, otac $35$, deda $60$', 'Marko $4$, otac $28$, deda $68$', 'Marko $5$, otac $30$, deda $65$', 'Marko $6$, otac $42$, deda $52$'],
      [
        'Nedelja ima $7$ dana: ako Marko ima $x$ godina, otac ima $7$ puta više – $7x$ godina.',
        'Godina ima $12$ meseci: deda ima $12$ puta više godina od Marka – $12x$.',
        K('$x + 7x + 12x = 20x = 100$, pa je $x = 5$: Marko $5$, otac $35$, deda $60$.', [], C.stubici([['Marko', 5], ['otac', 35], ['deda', 60]], { korakY: 20, maxY: 60, vrednosti: true })),
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Prva dva člana niza su $3{1|2}$ i $1{1|4}$, a svaki sledeći je dva puta manji od zbira prethodna dva člana. Kolika je vrednost četvrtog člana?',
      ['$1{13|16}$', '$2{3|8}$', '$1{5|8}$', '$2{1|16}$'],
      [
        'Svaki sledeći član je polovina zbira prethodna dva (njihova aritmetička sredina).',
        'Treći: ${1|2}(3{1|2} + 1{1|4}) = {1|2} · 4{3|4} = {19|8} = 2{3|8}$.',
        K('Četvrti: ${1|2}(1{1|4} + 2{3|8}) = {1|2} · 3{5|8} = {29|16} = 1{13|16}$.', [], C.brojevna(1, 4, [[3.5, '1.', 1], [1.25, '2.', 1], [2.375, '3.', 2], [1.8125, '4.', 3]], { podela: 0.5, svaki: 2 })),
      ]);
    Z(6, 2, 2,
      'U magičnom kvadratu $3 × 3$ zbirovi u svim vrstama, kolonama i dijagonalama su jednaki. Dato je: gore levo ${1|6}$, u sredini ${5|12}$, dole u sredini ${1|4}$, dole desno ${2|3}$. Koji broj je u gornjem desnom polju?',
      ['${1|2}$', '${1|3}$', '${7|12}$', '${3|4}$'],
      [
        'U magičnom kvadratu $3 × 3$ magični zbir je tri puta veći od broja u centru: $S = 3 · {5|12} = {5|4}$. (Provera dijagonalom: ${1|6} + {5|12} + {2|3} = {2 + 5 + 8|12} = {15|12}$ ✓.)',
        'Donja vrsta: $x + {1|4} + {2|3} = {5|4}$, pa je dole levo ${1|3}$. Srednja kolona: gore u sredini $= {5|4} − {5|12} − {1|4} = {7|12}$.',
        'Gornja vrsta: ${1|6} + {7|12} + z = {5|4}$, pa je gore desno $z = {15 − 2 − 7|12} = {1|2}$.',
        K('Ostala polja: levo u sredini ${3|4}$, desno u sredini ${1|12}$.', [], C.tabela([['1/6', '7/12', '1/2'], ['3/4', '5/12', '1/12'], ['1/3', '1/4', '2/3']], { zaglavlje: false, istakni: [[0, 2]] })),
      ]);
    Z(6, 3, 1,
      'Dve prave se seku i obrazuju četiri ugla. Zbir unakrsnih oštrih uglova je za polovinu pravog ugla manji od jednog od tupih uglova. Koliki su ti uglovi?',
      ['$45°$, $135°$, $45°$, $135°$', '$30°$, $150°$, $30°$, $150°$', '$60°$, $120°$, $60°$, $120°$', '$36°$, $144°$, $36°$, $144°$'],
      [
        'Unakrsni uglovi su jednaki; oštar ugao $α$ i tup ugao su uporedni: tup je $180° − α$.',
        'Zbir oštrih: $2α$. Uslov: $2α + 45° = 180° − α$.',
        K('$3α = 135°$, $α = 45°$: uglovi su $45°, 135°, 45°, 135°$.', [], G({ O: [0, 0, 270], A: [5, 5], B: [-5, -5], P: [-6, 0], Q: [6, 0] }, [{ d: 'AB' }, { d: 'PQ' }, { u: 'QOA', o: '45°', b: 1 }, { u: 'AOP', o: '135°', b: 2 }], { bezImena: ['O', 'A', 'B', 'P', 'Q'] })),
      ]);
    Z(6, 4, 1,
      'Na takmičenju je $14$ učenika rešilo sve zadatke, $32%$ je rešilo neke zadatke, a $12%$ nije rešilo nijedan. Koliko je učenika učestvovalo?',
      ['$25$', '$30$', '$50$', '$20$'],
      [
        'Ostali (koji su rešili sve) čine $100% − 32% − 12% = 56%$ učenika.',
        K('$56%$ svih je $14$ učenika: $0,56x = 14$, pa je $x = 14 : 0,56 = 25$.', [], G({}, [C.pr(0, 0, 56, 6, 1, { gusto: 1 }), C.pr(56, 0, 32, 6, 2, { gusto: 1 }), C.pr(88, 0, 12, 6, 4, { gusto: 1 }), { tx: '56% = 14', at: [28, 2.6] }, { tx: '32%', at: [72, 2.6] }, { tx: '12%', at: [94, 2.6] }])),
        'Provera: $32%$ od $25$ je $8$, $12%$ je $3$; $14 + 8 + 3 = 25$ ✓.',
      ]);
    Z(6, 5, 2,
      'Dati su skupovi $A = \\{−3, −2, 1, 3, 5\\}$ i $B = \\{−1, 0, 1, 2\\}$. Uporedi broj elemenata skupova $C = \\{|a| + |b| : a ∈ A, b ∈ B\\}$ i $D = \\{|a + b| : a ∈ A, b ∈ B\\}$.',
      ['$D$ ima jedan element više od $C$', '$C$ ima jedan element više od $D$', 'Imaju isti broj elemenata', '$D$ ima dva elementa više'],
      [
        '$|a| ∈ \\{3, 2, 1, 3, 5\\} = \\{1, 2, 3, 5\\}$, $|b| ∈ \\{1, 0, 1, 2\\} = \\{0, 1, 2\\}$. Zbirovi $|a| + |b|$: od $1$ do $7$ – $C = \\{1, 2, 3, 4, 5, 6, 7\\}$, $7$ elemenata.',
        K('Za $D$ računamo sve $|a + b|$: npr. $|1 + (−1)| = 0$ – nula se pojavljuje! Dobija se $D = \\{0, 1, 2, 3, 4, 5, 6, 7\\}$, $8$ elemenata.', [], C.tabela([['a \\ b', '−1', 0, 1, 2], ['−3', 4, 3, 2, 1], ['−2', 3, 2, 1, 0], [1, 0, 1, 2, 3], [3, 2, 3, 4, 5], [5, 4, 5, 6, 7]])),
        '$D$ ima jedan element više (nulu).',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'Pravougaonik je razložen na $5$ kvadrata kao na slici (najveći je osenčen). Koji procenat površine pravougaonika zauzima osenčeni kvadrat?',
      ['$62,5%$', '$60%$', '$50%$', '$65%$'],
      [
        'Neka su stranice kvadrata od najvećeg do najmanjeg $a, b, c, d$ (dva najmanja su jednaka). Sa slike: $c = 2d$, $b = c + d = 3d$, $a = b + c = 5d$.',
        'Pravougaonik je $a × (a + b) = 5d × 8d$, površine $40d²$; osenčeni kvadrat $25d²$.',
        '${25|40} = {5|8} = 62,5%$.',
      ],
      G({}, [C.pr(3, 0, 5, 5, 1, { gusto: 1 }), C.pr(0, 2, 3, 3, 0, { prazno: 1 }), C.pr(0, 0, 2, 2, 0, { prazno: 1 }), C.pr(2, 0, 1, 1, 0, { prazno: 1 }), C.pr(2, 1, 1, 1, 0, { prazno: 1 })]));
    Z(7, 2, 2,
      'Između kojih uzastopnih celih brojeva se nalazi broj $x$ ako važi $2018 : (1 + {1|1 + {1|x}}) = 2019$?',
      ['$−1$ i $0$', '$0$ i $1$', '$−2$ i $−1$', '$2018$ i $2019$'],
      [
        'Iz jednačine: $1 + {1|1 + {1|x}} = {2018|2019}$, pa je ${1|1 + {1|x}} = {2018|2019} − 1 = −{1|2019}$.',
        'Okrenemo: $1 + {1|x} = −2019$, tj. ${1|x} = −2020$.',
        'Dakle $x = −{1|2020}$ – između $−1$ i $0$.',
      ]);
    Z(7, 3, 1,
      'Izračunaj vrednost izraza ${√6 − √{24} + √{150}|√{12}} · √2$.',
      ['$4$', '$2$', '$2√2$', '$8$'],
      [
        'Izvucimo $√6$: $√{24} = √{4 · 6} = 2√6$ i $√{150} = √{25 · 6} = 5√6$, pa je brojilac $√6 − 2√6 + 5√6 = 4√6$.',
        '$√{12} = 2√3$, pa je razlomak ${4√6|2√3} = 2√2$.',
        '$2√2 · √2 = 2 · 2 = 4$.',
      ]);
    Z(7, 4, 2,
      'Reši jednačinu $√{(x − 2)²} = x + 5$.',
      ['$x = −{3|2}$', '$x = −{7|2}$', 'nema rešenja', '$x = {3|2}$'],
      [
        'Ključno: $√{(x − 2)²} = |x − 2|$ (koren iz kvadrata je apsolutna vrednost, ne sam broj!).',
        '$x ≥ 2$: $x − 2 = x + 5$ – nemoguće.',
        K('$x < 2$: $2 − x = x + 5$, pa je $2x = −3$ i $x = −{3|2}$ (manje od $2$ ✓). Provera: $|−3,5| = 3,5 = −1,5 + 5$ ✓.', [], G({}, [{ mreza: [-6, 6, -1, 9], ose: ['x', 'y'] }, { lin: [[-6, 8], [2, 0], [6, 4]], b: 1, debljina: 3 }, { lin: [[-6, -1], [4, 9]], b: 2, debljina: 3 }, { tx: '●', at: [-1.5, 3.4], b: 3 }])),
      ]);
    Z(7, 5, 3,
      'Površina konveksnog četvorougla $ABCD$ je $20 cm²$. Tačke $K, L, M, N$ su na pravama $AB, BC, CD, DA$ tako da su $B, C, D, A$ redom središta duži $AK, BL, CM, DN$. Kolika je površina četvorougla $KLMN$?',
      ['$100 cm²$', '$80 cm²$', '$60 cm²$', '$40 cm²$'],
      [
        K('Posmatrajmo trougao $BKL$: osnovica $BK = AB$, a visina iz $L$ je dvostruka visina iz $C$ (jer je $BL = 2BC$). Zato je $P_{BKL} = 2P_{ABC}$.', ['t1']),
        'Na isti način: $P_{CLM} = 2P_{BCD}$, $P_{DMN} = 2P_{CDA}$, $P_{ANK} = 2P_{DAB}$.',
        'Zbir četiri trougla: $2(P_{ABC} + P_{CDA}) + 2(P_{BCD} + P_{DAB}) = 2 · 20 + 2 · 20 = 80 cm²$.',
        '$P_{KLMN} = P_{ABCD} + 80 = 100 cm²$ – pet puta veća od $ABCD$.',
      ],
      G({ A: [0, 0, 225], B: [4, 0, -45], C: [5, 3, 0], D: [1, 4, 135], K: [8, 0, -45], L: [6, 6, 45], M: [-3, 5, 135], N: [-1, -4, 225] },
        [{ p: 'ABCD', b: 1 }, { p: 'KLMN', prazno: 1 }, { d: 'AK', isp: 1 }, { d: 'BL', isp: 1 }, { d: 'CM', isp: 1 }, { d: 'DN', isp: 1 }, { p: 'BKL', id: 't1', b: 2, k: 1 }, { p: 'CLM', b: 3, k: 2 }, { p: 'DMN', b: 4, k: 2 }, { p: 'ANK', b: 5, k: 2 }]));

    // ───────── VIII razred ─────────
    Z(8, 1, 1,
      'Pravougaonik ima stranice $5 cm$ i $14 cm$. Osenčena figura je deo pravougaonika između dve četvrtine kruga poluprečnika $5 cm$ (jedna sa centrom u donjem levom, druga u gornjem desnom temenu, kao na slici). Koliki je obim osenčene figure?',
      ['$(5π + 18) cm$', '$(10π + 18) cm$', '$(5π + 28) cm$', '$(2,5π + 18) cm$'],
      [
        'Granicu osenčene figure čine dva luka (četvrtine kružnica) i dve duži.',
        'Četvrtina kružnice poluprečnika $5$: ${1|4} · 2 · 5π = {5π|2}$. Dva luka: $5π$.',
        'Duži su delovi dužih stranica: $14 − 5 = 9 cm$ svaka, ukupno $18 cm$.',
        'Obim: $5π + 18 ≈ 33,7 cm$.',
      ],
      G({}, [C.pr(0, 0, 14, 5, 4, { prazno: 1 }), { lin: [[5, 0], ...C.luk(0, 0, 5, 0, 90, 24), [0, 5], [9, 5], ...C.luk(14, 5, 5, 180, 270, 24), [14, 0]], zatv: 1, b: 1, gusto: 1 }]));
    Z(8, 2, 1,
      'Milašinu nedostaje $600$ dinara za kupovinu $4$ sulundara, a Radašinu $600$ dinara za kupovinu $5$ sulundara. Ako se udruže, nedostajaće im $600$ dinara za kupovinu $6$ sulundara. Kolika je cena sulundara?',
      ['$200$ dinara', '$150$ dinara', '$300$ dinara', '$600$ dinara'],
      [
        'Zajedno im nedostaje $600 + 600 = 1200$ dinara za $4 + 5 = 9$ sulundara.',
        'Sa istim novcem nedostaje im $600$ dinara za $6$ sulundara.',
        'Razlika: $3$ sulundara koštaju $1200 − 600 = 600$ dinara, pa je cena $200$ dinara. (Milašin ima $200$, Radašin $400$ dinara.)',
      ]);
    Z(8, 3, 1,
      'Tačke $A$, $B$ i $C$ dele kružnicu na tri luka čije se dužine odnose kao $3 : 4 : 5$. Koliki su unutrašnji uglovi trougla $ABC$?',
      ['$45°$, $60°$, $75°$', '$30°$, $40°$, $50°$', '$90°$, $120°$, $150°$', '$36°$, $48°$, $96°$'],
      [
        'Lukovi su $3t, 4t, 5t$ i zajedno čine $360°$: centralni uglovi su $90°, 120°, 150°$.',
        'Unutrašnji ugao trougla je periferijski ugao nad suprotnim lukom – polovina centralnog.',
        K('Uglovi su $45°$, $60°$ i $75°$ (zbir $180°$ ✓).', [], G({ O: [0, 0, 0], A: [4, 0, 0], B: [0, 4, 90], C: [-3.464, -2, 210] }, [{ kr: 'O', r: 4 }, { p: 'ABC', b: 1 }, { d: 'OA', isp: 1 }, { d: 'OB', isp: 1 }, { d: 'OC', isp: 1 }, { u: 'AOB', o: '90°' }, { u: 'BOC', o: '150°' }, { u: 'COA', o: '120°' }], { bezImena: ['O'] })),
      ]);
    Z(8, 4, 2,
      'U pravougli trougao $ABC$ sa katetama $AC = 4 cm$ i $BC = 3 cm$ upisan je kvadrat čije dve stranice leže na katetama, a jedno teme na hipotenuzi. Na kolike odsečke teme kvadrata deli hipotenuzu?',
      ['${20|7} cm$ i ${15|7} cm$', '$3 cm$ i $2 cm$', '${12|7} cm$ i ${23|7} cm$', '$2,5 cm$ i $2,5 cm$'],
      [
        K('Neka je stranica kvadrata $a$, a teme na hipotenuzi $N$. Mali trougao kod $A$ (sa katetom $4 − a$ i stranicom kvadrata $a$) sličan je trouglu $ABC$: ${a|4 − a} = {3|4}$, pa je $4a = 12 − 3a$, $a = {12|7}$.', ['kv']),
        'Hipotenuza: $AB = 5$. Odsečak $AN = x$ je hipotenuza malog trougla kod $A$: ${x|5} = {a|3}$, pa $x = {5a|3} = {20|7}$.',
        'Odsečak $BN = y$: ${y|5} = {a|4}$, pa $y = {5a|4} = {15|7}$. Provera: ${20 + 15|7} = 5$ ✓.',
      ],
      G({ C: [0, 0, 225], A: [4, 0, -45], B: [0, 3, 135], N: [1.714, 1.714, 45], P: [1.714, 0, -90], Q: [0, 1.714, 180] },
        [{ p: 'ABC' }, { pu: 'ACB' }, { p: 'CPNQ', id: 'kv', b: 1 }], { bezImena: ['P', 'Q'] }));
    Z(8, 5, 2,
      'Središta stranica pravilnog šestougla su temena novog šestougla. Koliki je odnos površina većeg i manjeg šestougla?',
      ['$4 : 3$', '$2 : 1$', '$√3 : 1$', '$3 : 2$'],
      [
        'Neka je stranica većeg šestougla $a$. Stranica manjeg je udaljenost središta dve susedne stranice – polovina kraće dijagonale: $b = {a√3|2}$.',
        'Pravilni šestouglovi su slični, pa se površine odnose kao kvadrati stranica: ${a²|b²} = {a²|{3a²|4}} = {4|3}$.',
        K('Odnos površina je $4 : 3$.', [], (() => {
          const v = Array.from({ length: 6 }, (_, i) => C.naKrugu([0, 0], 4, 60 * i));
          const m = v.map((p, i) => [(p[0] + v[(i + 1) % 6][0]) / 2, (p[1] + v[(i + 1) % 6][1]) / 2]);
          return G({}, [{ lin: v, zatv: 1, prazno: 1 }, { lin: m, zatv: 1, b: 1, gusto: 1 }]);
        })()),
      ]);
  },
};
