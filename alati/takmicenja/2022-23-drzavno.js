// Državno takmičenje iz matematike učenika osnovnih škola, 13. 5. 2023. (DMS)
// https://dms.rs/wp-content/uploads/2023/05/Postavke-i-resenja.pdf
module.exports = {
  godina: '2022/23', nivo: 'drzavno', datum: '13. 5. 2023.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    const sub = (n) => String(n).replace(/\d/g, (c) => '₀₁₂₃₄₅₆₇₈₉'[c]);

    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Reši jednačinu $2023 · {27{2|2023} − 17{1|2023}|20 : 0,01 − 1{1|3}x} = {2,023 : 0,0001 + 1|148}$.',
      ['$x = 1389$', '$x = 1852$', '$x = 1500$', '$x = 1111$'],
      [
        'Brojilac levog razlomka: $27{2|2023} − 17{1|2023} = 10{1|2023} = {20 231|2023}$. Pomnoženo sa $2023$ daje $20 231$.',
        'Desna strana: $2,023 : 0,0001 = 20 230$ (deljenje sa $0,0001$ = množenje sa $10 000$), pa je brojilac $20 231$.',
        'Imenilac levo: $20 : 0,01 = 2000$, pa je leva strana ${20 231|2000 − {4|3}x}$, a desna ${20 231|148}$.',
        'Isti brojioci ⇒ isti imenioci: $2000 − {4|3}x = 148$, tj. ${4|3}x = 1852$.',
        '$x = 1852 · {3|4} = 1389$.',
      ]);
    Z(6, 2, 3,
      'Treba konstruisati trougao $ABC$ obima $14 cm$ sa uglovima $α = 52° 30\'$ i $β = 67° 30\'$. Produžimo $AB$ preko $A$ do $A_{1}$ i preko $B$ do $B_{1}$ tako da je $AA_{1} = AC$ i $BB_{1} = BC$. Koliki su uglovi trougla $A_{1}B_{1}C$ kod $A_{1}$ i $B_{1}$?',
      ['$26° 15\'$ i $33° 45\'$', '$52° 30\'$ i $67° 30\'$', '$63° 45\'$ i $56° 15\'$', '$13° 7\'30\'\'$ i $16° 52\'30\'\'$'],
      [
        'Tada je $A_{1}B_{1} = A_{1}A + AB + BB_{1} = AC + AB + BC = 14 cm$ – obim postaje jedna duž.',
        'Trougao $A_{1}AC$ je jednakokrak ($AA_{1} = AC$), a njegov spoljašnji ugao kod $A$ je $α$. Zato su uglovi na osnovici po ${α|2}$: $∡AA_{1}C = 26° 15\'$.',
        'Slično $∡BB_{1}C = {β|2} = 33° 45\'$.',
        K('Konstrukcija: duž $A_{1}B_{1} = 14 cm$, uglovi $26° 15\'$ i $33° 45\'$ (polovina polovine od $105°$ i $135°$) daju $C$; temena $A$ i $B$ su preseci simetrala duži $A_{1}C$ i $B_{1}C$ sa pravom $A_{1}B_{1}$.', [], G({ A1: [0, 0, 225], B1: [14, 0, -45], C: [8.055, 3.972, 90], A: [5.007, 0, -90], B: [9.701, 0, -90] },
          [{ d: 'A1B1' }, { d: 'A1C', isp: 1 }, { d: 'B1C', isp: 1 }, { p: 'ABC', b: 1 }, { u: 'B1A1C', o: 'α/2' }, { u: 'CB1A1', o: 'β/2' }])),
      ]);
    Z(6, 3, 3,
      'Koji trocifreni brojevi imaju osobinu: ako im se bilo koje dve cifre zamene bilo kojim ciframa (treća cifra ostaje na svom mestu), dobijeni trocifreni broj nikad nije deljiv sa $113$?',
      ['$840, 847, 880, 887$', '$800, 808, 880, 888$', '$840, 880$', '$847, 887, 848, 888$'],
      [
        K('Trocifreni umnošci broja $113$: $113, 226, 339, 452, 565, 678, 791, 904$.', [], C.tabela([['~stotine', 1, 2, 3, 4, 5, 6, 7, 9], ['~desetice', 1, 2, 3, 5, 6, 7, 9, 0], ['~jedinice', 3, 6, 9, 2, 5, 8, 1, 4]])),
        'Ako ostavimo samo jednu cifru na mestu, a ostale dve menjamo, moći ćemo da dobijemo umnožak od $113$ – osim ako ta cifra ne postoji na tom mestu ni u jednom umnošku.',
        'Na mestu stotina u umnošcima nema cifre $8$ (nulu ne razmatramo). Na mestu desetica nema $4$ i $8$. Na mestu jedinica nema $0$ i $7$.',
        'Traženi broj mora na SVAKOM mestu imati takvu „nemoguću“ cifru (jer bilo koja cifra može ostati fiksna): stotine $8$, desetice $4$ ili $8$, jedinice $0$ ili $7$.',
        'Brojevi: $840, 847, 880, 887$.',
      ]);
    D(6, 4, 3,
      'U jednakokrakom trouglu $ABC$ ($AC = BC$) ugao pri vrhu je $108°$. Simetrala ugla $BAC$ seče stranicu $BC$ u tački $E$, a $CD$ je visina na osnovicu. Dokaži da je $AE = 2CD$.',
      [
        'Uglovi na osnovici: ${180° − 108°|2} = 36°$, pa simetrala daje $∡CAE = 18°$ i $∡AEC = 180° − 108° − 18° = 54°$.',
        K('Neka $AE$ seče $CD$ u $O$. Visina $CD$ je i simetrala ugla $C$: $∡OCE = 54°$. Trougao $OCE$ ima dva ugla od $54°$, pa je $OC = OE$.', ['t1']),
        K('Neka je $F$ središte $AE$; $DF$ je srednja linija trougla $ABE$, pa je $DF ∥ BE$ i $∡ODF = ∡OFD = 54°$: trougao $OFD$ je jednakokrak, $OF = OD$.', ['t2']),
        '$CD = OC + OD = OE + OF = EF$.',
        '$F$ je središte $AE$, pa je $AE = 2 · EF = 2 · CD$.',
      ],
      G({ C: [0, 2.939, 90], A: [-4.045, 0, 225], B: [4.045, 0, -45], D: [0, 0, -90], E: [1.545, 1.816, 30], O: [0, 1.314, 160], F: [-1.25, 0.908, 110] },
        [{ p: 'ABC' }, { d: 'CD', isp: 1 }, { d: 'AE', b: 1 }, { pu: 'CDB' }, { p: 'OCE', id: 't1', b: 2, k: 2 }, { d: 'DF', k: 3 }, { p: 'OFD', id: 't2', b: 4, k: 3 }]));
    D(6, 5, 3,
      'Neka su $n − 1$ i $n + 1$ prosti brojevi i $n > 18$. Dokaži da broj $n$ ima bar $8$ različitih prirodnih delilaca.',
      [
        'Prosti $n ± 1$ veći od $3$ su neparni, pa je $n$ paran.',
        'Od tri uzastopna broja $n − 1, n, n + 1$ jedan je deljiv sa $3$; to nisu prosti $n ± 1$ (veći od $3$), pa $3 | n$. Dakle $6 | n$.',
        'Ako $n$ ima još neki prost činilac $p$, delioci su bar $1, 2, 3, 6, p, 2p, 3p, 6p$ – osam.',
        K('Inače je $n = 2^{a} · 3^{b}$ sa $(a + 1)(b + 1)$ delilaca; manje od $8$ daju samo $n = 6, 12, 18$ – a $n > 18$. Najmanje $8$ se i dostiže: $n = 30$ ($29$ i $31$ prosti).', [], C.tabela([['~delioci broja 30', 1, 2, 3, 5, 6, 10, 15, 30]])),
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'Izračunaj vrednost izraza $1 − n + n² − n³ + … − n^{99} + {n^{100}|1 + n}$ za $n = 1370$. (Znaci se naizmenično menjaju.)',
      ['${1|1371}$', '$1371$', '${1370|1371}$', '$0$'],
      [
        'Zapišimo svaki član kao razlomak sa imeniocem $1 + n$: $1 = {1 + n|1 + n}$, $n = {n + n²|1 + n}$, $n² = {n² + n³|1 + n}$, …, $n^{99} = {n^{99} + n^{100}|1 + n}$.',
        'Brojilac zbira: $(1 + n) − (n + n²) + (n² + n³) − … − (n^{99} + n^{100}) + n^{100}$.',
        'Susedni članovi se poništavaju („teleskop“): ostaje samo $1$.',
        'Vrednost je ${1|1 + n} = {1|1371}$.',
      ]);
    Z(7, 2, 2,
      'Koliko rešenja u skupu celih brojeva ima jednačina $x² − xy + 2x − 3y = 6$?',
      ['$4$', '$2$', '$6$', '$8$'],
      [
        'Izdvojimo $y$: $x² + 2x − 6 = y(x + 3)$. Za $x = −3$ leva strana je $−3 ≠ 0$, pa $x ≠ −3$.',
        '$y = {x² + 2x − 6|x + 3} = x − 1 − {3|x + 3}$ (jer je $(x + 3)(x − 1) = x² + 2x − 3$).',
        '$y$ je ceo tačno kad $x + 3$ deli $3$: $x + 3 ∈ \\{−3, −1, 1, 3\\}$, tj. $x ∈ \\{−6, −4, −2, 0\\}$.',
        K('Rešenja: $(−6, −6)$, $(−4, −2)$, $(−2, −6)$, $(0, −2)$ – četiri.', [], C.tabela([['x + 3', '−3', '−1', 1, 3], ['x', '−6', '−4', '−2', 0], ['y', '−6', '−2', '−6', '−2']])),
      ]);
    Z(7, 3, 3,
      'Dat je skup $M = \\{1, 2, 3, …, 2023\\}$. Koliko ima tročlanih podskupova skupa $M$ kod kojih je jedan element jednak zbiru druga dva?',
      ['$1011² = 1 022 121$', '$1010 · 1011 = 1 021 110$', '$2023 · 1011$', '${2023 · 2022|2}$'],
      [
        'Podskup je oblika $\\{a, b, a + b\\}$ sa $1 ≤ a < b$ i $a + b ≤ 2023$.',
        'Iz $2a < a + b ≤ 2023$: $a ≤ 1011$.',
        'Za fiksno $a$, $b$ ide od $a + 1$ do $2023 − a$: to je $2023 − 2a$ mogućnosti.',
        K('Zbir: $(2023 − 2) + (2023 − 4) + … + (2023 − 2022) = 2021 + 2019 + … + 1$ – zbir prvih $1011$ neparnih brojeva.', [], C.tabela([['a', 1, 2, 3, '…', 1010, 1011], ['~mogućnosti za b', 2021, 2019, 2017, '…', 3, 1]])),
        'Zbir prvih $k$ neparnih brojeva je $k²$, pa je odgovor $1011² = 1 022 121$.',
      ]);
    Z(7, 4, 3,
      'Najkraća dijagonala pravilnog dvanaestougla $A_{1}A_{2}…A_{12}$ ima dužinu $√{6 − √3} cm$. Kolika je površina petougla $A_{1}A_{4}A_{5}A_{6}A_{9}$?',
      ['${33|4} cm²$', '${27|4} cm²$', '$9 cm²$', '${6 + √3|4} cm²$'],
      [
        'Neka je $O$ centar, $r$ poluprečnik. Centralni ugao je $30°$, pa je trougao $A_{1}OA_{3}$ jednakokrak sa uglom $60°$ – jednakostraničan: najkraća dijagonala je $r$. Dakle $r² = 6 − √3$.',
        K('Petougao razbijemo iz centra: $P = P(A_{1}A_{4}O) + P(A_{4}A_{5}A_{6}O) + P(A_{6}A_{9}O) + P(A_{9}A_{1}O)$.', ['pet']),
        'Trouglovi $A_{1}A_{4}O$ i $A_{6}A_{9}O$: ugao $90°$ kod $O$, katete $r$ – površine po ${r²|2}$. Deltoid $OA_{4}A_{5}A_{6}$: dijagonale $OA_{5} = r$ i $A_{4}A_{6} = r$ (normalne) – površina ${r²|2}$.',
        'Trougao $A_{9}OA_{1}$: ugao $120°$ kod $O$ i kraci $r$ – površina kao jednakostraničan trougao stranice $r$: ${r²√3|4}$.',
        'Ukupno: ${3r²|2} + {r²√3|4} = r² · {6 + √3|4} = {(6 − √3)(6 + √3)|4} = {36 − 3|4} = {33|4} cm²$.',
      ],
      (() => {
        const t = { O: [0, 0, 135] };
        for (let i = 1; i <= 12; i++) t['A' + sub(i)] = [...C.naKrugu([0, 0], 4, -60 + 30 * (i - 1)), -60 + 30 * (i - 1)];
        return G(t, [{ p: Array.from({ length: 12 }, (_, i) => 'A' + sub(i + 1)).join(''), prazno: 1 }, { p: 'A₁A₄A₅A₆A₉', b: 1 },
          { d: 'OA₁', isp: 1, k: 2 }, { d: 'OA₄', isp: 1, k: 2 }, { d: 'OA₅', isp: 1, k: 2 }, { d: 'OA₆', isp: 1, k: 2 }, { d: 'OA₉', isp: 1, k: 2 }, { p: 'A₁A₄O', id: 'pet', b: 2, k: 3 }, { p: 'A₆A₉O', b: 2, k: 3 }, { p: 'OA₄A₅A₆', b: 3, k: 3 }, { p: 'A₉OA₁', b: 4, k: 4 }], { bezImena: ['O'] });
      })());
    D(7, 5, 3,
      'U četvorouglu $ABCD$ dijagonale su normalne i seku se u tački $S$. Neka su $M, N, P, Q$ podnožja normala iz $S$ na $AB, BC, CD, DA$. Dokaži da je ${1|SM²} + {1|SP²} = {1|SN²} + {1|SQ²}$.',
      [
        'Pomoćno tvrđenje: u pravouglom trouglu sa katetama $a, b$ i visinom $h$ na hipotenuzu važi ${1|h²} = {1|a²} + {1|b²}$.',
        'Dokaz: dvostruka površina je $ab = ch$, pa je ${1|h²} = {c²|a²b²} = {a² + b²|a²b²} = {1|b²} + {1|a²}$.',
        K('Trouglovi $SAB, SBC, SCD, SDA$ su pravougli (prav ugao kod $S$), a $SM, SN, SP, SQ$ su njihove visine na hipotenuze.', ['m']),
        '${1|SM²} + {1|SP²} = {1|SA²} + {1|SB²} + {1|SC²} + {1|SD²} = {1|SN²} + {1|SQ²}$ – oba zbira daju isto.',
      ],
      G({ S: [0, 0, -135], A: [-3, 0, 180], B: [0, -2, -90], C: [4, 0, 0], D: [0, 3, 90], M: [-0.923, -1.385, -135], N: [0.8, -1.6, -45], P: [1.44, 1.92, 45], Q: [-1.5, 1.5, 135] },
        [{ p: 'ABCD' }, { d: 'AC', isp: 1 }, { d: 'BD', isp: 1 }, { d: 'SM', b: 1, id: 'm' }, { d: 'SN', b: 2 }, { d: 'SP', b: 1 }, { d: 'SQ', b: 2 }, { pu: 'SMB' }, { pu: 'SNC' }, { pu: 'SPD' }, { pu: 'SQA' }]));

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Kolika je najmanja vrednost izraza $(x − 1)(x − 3)(x − 4)(x − 6) + 2023$ i za koje $x$ se dostiže?',
      ['$2014$, za $x = {7 ± √{13}|2}$', '$2023$, za $x = 1$', '$2014$, za $x = {7|2}$', '$2005$, za $x = {7 ± √{13}|2}$'],
      [
        'Pomnožimo prvu i četvrtu, i drugu i treću zagradu (zbirovi $1 + 6 = 3 + 4 = 7$ su isti!): $(x² − 7x + 6)(x² − 7x + 12) + 2023$.',
        'Smena $t = x² − 7x + 9$ (sredina između $6$ i $12$): izraz je $(t − 3)(t + 3) + 2023 = t² − 9 + 2023 = t² + 2014$.',
        'Kvadrat je $≥ 0$, pa je izraz $≥ 2014$, sa jednakošću za $t = 0$.',
        '$x² − 7x + 9 = 0$: $(x − {7|2})² = {49|4} − 9 = {13|4}$, pa je $x = {7 ± √{13}|2}$ – realna rešenja postoje, pa je minimum zaista $2014$.',
      ]);
    Z(8, 2, 2,
      'Koliki je ostatak pri deljenju broja $2^{223} + 2022^{2023}$ sa $7$?',
      ['$1$', '$2$', '$6$', '$3$'],
      [
        K('Stepeni dvojke daju ostatke $2, 4, 1, 2, 4, 1, …$ (period $3$), jer je $2³ = 8 = 7 + 1$.', [], C.tabela([['n', 1, 2, 3, 4, 5, 6], ['2ⁿ : 7', 2, 4, 1, 2, 4, 1]])),
        '$223 = 3 · 74 + 1$, pa je $2^{223} = (2³)^{74} · 2$ i daje ostatak $1 · 2 = 2$.',
        '$2022 = 7 · 289 − 1$ daje „ostatak $−1$“, pa $2022^{2023}$ daje $(−1)^{2023} = −1$, tj. ostatak $6$.',
        'Zbir: $2 + (−1) = 1$. Ostatak je $1$.',
      ]);
    Z(8, 3, 3,
      'Data je kocka $ABCDA_{1}B_{1}C_{1}D_{1}$ ivice $1 cm$. Tačka $P$ na prostornoj dijagonali $AC_{1}$ je takva da je $BP ⊥ AC_{1}$. Kolika je zapremina piramide $ABCDP$?',
      ['${1|9} cm³$', '${1|3} cm³$', '${1|6} cm³$', '${2|9} cm³$'],
      [
        'Trougao $ABC_{1}$ je pravougli (prav ugao kod $B$, jer je $AB$ normalna na ravan $BCC_{1}B_{1}$) sa $AB = 1$, $BC_{1} = √2$, $AC_{1} = √3$.',
        '$BP$ je visina na hipotenuzu: $BP = {1 · √2|√3} = {√6|3}$, a $AP = {AB²|AC_{1}} = {1|√3} = {√3|3}$ – trećina dijagonale.',
        'Neka je $P_{1}$ projekcija $P$ na osnovu; $P_{1}$ je na $AC$. Trouglovi $AP_{1}P$ i $ACC_{1}$ su slični sa koeficijentom ${AP|AC_{1}} = {1|3}$, pa je visina $PP_{1} = {1|3} cm$.',
        K('Zapremina: $V = {1|3} · 1 · {1|3} = {1|9} cm³$.', [], C.kocka(3, [{ d: 'AC₁', isp: 1, b: 1 }, { d: 'PA', b: 2 }, { d: 'PB', b: 2 }, { d: 'PC', b: 2 }, { d: 'PD', b: 2, isp: 1 }, { tacka: 'P' }], { T3: { P: [1, 1, 1] } })),
        'Površina (drugi deo): $1 + 2 · {√2|6} + 2 · {√5|6} = {3 + √2 + √5|3} cm²$.',
      ]);
    Z(8, 4, 3,
      'Brojeve $1, 2, …, 10$ treba rasporediti u $10$ krugova (kao na slici: gornji krug ima dve strelice ka dva kruga; levi od njih ima dve strelice, i svaki od tih krugova još po jednu; desni ima tri strelice ka tri kruga), tako da svaka strelica pokazuje od većeg ka manjem broju. Na koliko načina?',
      ['$4536$', '$756$', '$1260$', '$9072$'],
      [
        'Gornji krug $a$ mora imati najveći broj $10$.',
        'Za desno podstablo ($b$ sa tri „deteta“ $c, d, e$) biramo $4$ broja od preostalih $9$: ${9 · 8 · 7 · 6|4 · 3 · 2 · 1} = 126$ načina. Ostalih $5$ idu levo.',
        'Desno: najveći od četiri ide u $b$, ostala tri u $c, d, e$ bilo kojim redom: $3! = 6$.',
        'Levo: najveći od pet ide u $f$; od preostala $4$ biramo $2$ za lanac $g → h$: $6$ načina; oba lanca imaju jednoznačan raspored (veći gore).',
        K('Ukupno: $126 · 6 · 6 = 4536$.', [], G({}, [
          ...[[4, 6, 'a', 1], [2, 4, 'f', 2], [6, 4, 'b', 3], [1, 2, 'g', 2], [3, 2, 'i', 2], [1, 0, 'h', 2], [3, 0, 'j', 2], [5, 2, 'c', 3], [6, 2, 'd', 3], [7, 2, 'e', 3]].flatMap(([x, y, t, b]) => [{ lin: C.luk(x, y, 0.4, 0, 360, 24), zatv: 1, b, prazno: 1 }, { tx: t, at: [x, y - 0.15] }]),
          ...[[[4, 6], [2, 4]], [[4, 6], [6, 4]], [[2, 4], [1, 2]], [[2, 4], [3, 2]], [[1, 2], [1, 0]], [[3, 2], [3, 0]], [[6, 4], [5, 2]], [[6, 4], [6, 2]], [[6, 4], [7, 2]]].map(([p, q]) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); const u = [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; return { lin: [[p[0] + u[0] * 0.45, p[1] + u[1] * 0.45], [q[0] - u[0] * 0.45, q[1] - u[1] * 0.45]], str: 1 }; })])),
      ],
      G({}, [
        ...[[4, 6], [2, 4], [6, 4], [1, 2], [3, 2], [1, 0], [3, 0], [5, 2], [6, 2], [7, 2]].map(([x, y]) => ({ lin: C.luk(x, y, 0.4, 0, 360, 24), zatv: 1, prazno: 1 })),
        ...[[[4, 6], [2, 4]], [[4, 6], [6, 4]], [[2, 4], [1, 2]], [[2, 4], [3, 2]], [[1, 2], [1, 0]], [[3, 2], [3, 0]], [[6, 4], [5, 2]], [[6, 4], [6, 2]], [[6, 4], [7, 2]]].map(([p, q]) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); const u = [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; return { lin: [[p[0] + u[0] * 0.45, p[1] + u[1] * 0.45], [q[0] - u[0] * 0.45, q[1] - u[1] * 0.45]], str: 1 }; })]));
    D(8, 5, 3,
      'Na prečniku $AB$ kruga izabrana je proizvoljna tačka $C$. Tačke $P$ i $Q$ na kružnici, sa iste strane prečnika $AB$, izabrane su tako da je $∡ACP = ∡PCQ = ∡QCB = 60°$. Dokaži da dužina tetive $PQ$ ne zavisi od izbora tačke $C$.',
      [
        'Neka je $Q\'$ tačka simetrična tački $Q$ u odnosu na prečnik $AB$ (i ona je na kružnici).',
        'Po simetriji $∡BCQ\' = ∡BCQ = 60° = ∡ACP$ – to su unakrsni uglovi, pa su $P$, $C$, $Q\'$ na jednoj pravoj.',
        'Trougao $CQQ\'$ je jednakokrak sa uglom $120°$ kod $C$, pa je $∡CQ\'Q = 30°$. To je periferijski ugao nad tetivom $PQ$.',
        K('Centralni ugao nad $PQ$ je dvostruk: $∡POQ = 60°$, pa je trougao $OPQ$ jednakostraničan i $PQ = r$.', ['t']),
      ],
      G({ O: [0, 0, -90], A: [-4, 0, 180], B: [4, 0, 0], C: [-1, 0, -90], P: [-2.703, 2.949, 135], Q: [1.203, 3.815, 60], "Q'": [1.203, -3.815, -60] },
        [{ kr: 'O', r: 4 }, { d: 'AB' }, { d: 'CP' }, { d: 'CQ' }, { d: 'PQ', b: 1 }, { u: 'PCA'.split('').reverse().join(''), o: '60°' }, { u: 'BCQ'.split('').reverse().join(''), o: '60°' },
          { d: "CQ'", isp: 1, k: 1 }, { d: "QQ'", isp: 1, k: 3 }, { p: 'OPQ', id: 't', b: 2, k: 4 }]));
  },
};
