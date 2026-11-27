// Opštinsko takmičenje iz matematike učenika osnovnih škola, 20. 2. 2022. (DMS)
// https://dms.rs/wp-content/uploads/2022/02/Resenja-opstinsko-2022.pdf
// VII razred, 3. zadatak: u postavci je greška (takav trapez ne postoji) – kao odgovor ide zvanično rešenje uz napomenu.
module.exports = {
  godina: '2021/22', nivo: 'opstinsko', datum: '20. 2. 2022.',
  zadaci: ({ Z, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Na slici je $E$ centar kružnice $k_{1}$, a $B$ centar kružnice $k_{2}$. Poluprečnik kružnice $k_{1}$ je $13 cm$, duž $AB$ ima $53 cm$, a izlomljena linija $DABC$ ima dužinu $1 m$. Kolika je duž $AF$?',
      ['$32 cm$', '$21 cm$', '$34 cm$', '$40 cm$'],
      [
        '$DA$ je prečnik kružnice $k_{1}$ (prolazi kroz centar $E$): $DA = 2 · 13 = 26 cm$.',
        '$BC$ je poluprečnik kružnice $k_{2}$ – označimo ga sa $r$. Izlomljena linija: $DA + AB + BC = 100 cm$, tj. $26 + 53 + r = 100$, pa je $r = 21 cm$.',
        K('$F$ je na kružnici $k_{2}$, pa je i $BF = r = 21 cm$. Zato je $AF = AB − BF = 53 − 21 = 32 cm$.', ['af']),
      ],
      G({ E: [0, 0, 200], A: [9.96, 8.36, 90], D: [-9.96, -8.36, 225], B: [62.16, -0.84, -45], F: [41.48, 2.81, 250], C: [58.51, 19.84, 90] },
        [{ kr: 'E', r: 13 }, { kr: 'B', r: 21 }, { d: 'DA' }, { d: 'AB' }, { d: 'BC' }, { tacka: 'E' }, { tacka: 'B' }, { tx: 'k₁', at: [-12, 11] }, { tx: 'k₂', at: [80, 18] }, { d: 'AF', id: 'af', b: 1, k: 3 }]));
    Z(5, 2, 1,
      'Dat je niz slova KOLIČNIKOSTATAKKOLIČNIKOSTATAKKOLIČNIKOSTATAK… Koje je $2022$. slovo u tom nizu?',
      ['A', 'T', 'K', 'S'],
      [
        'Ponavlja se grupa KOLIČNIKOSTATAK od $15$ slova (Č je jedno slovo).',
        '$2022 = 15 · 134 + 12$: posle $134$ cele grupe dolazi još $12$ slova, pa je traženo slovo $12$. slovo grupe.',
        K('Brojimo: K, O, L, I, Č, N, I, K, O, S, T, A – dvanaesto je A.', [], C.tabela([['~mesto', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], ['~slovo', 'K', 'O', 'L', 'I', 'Č', 'N', 'I', 'K', 'O', 'S', 'T', 'A', 'T', 'A', 'K']], { istakni: [[0, 12], [1, 12]] })),
      ]);
    Z(5, 3, 2,
      'Na pravoj $p$ date su tri tačke, a van nje još tri nekolinearne tačke. Koliko duži i koliko najviše pravih određuju ove tačke?',
      ['$15$ duži i $13$ pravih', '$15$ duži i $15$ pravih', '$12$ duži i $13$ pravih', '$15$ duži i $12$ pravih'],
      [
        'Duži: svaki par tačaka određuje jednu duž. Od $6$ tačaka parova ima ${6 · 5|2} = 15$.',
        'Prave: tačke $A, B, C$ na $p$ daju samo jednu pravu (to je $p$).',
        'Tačke $M, N, P$ (nekolinearne) daju $3$ prave. Svaka od $A, B, C$ sa svakom od $M, N, P$ daje pravu: $9$ pravih.',
        K('Najviše (kad se nijedne dve od tih pravih ne poklapaju): $1 + 3 + 9 = 13$ pravih.', [], G({ A: [0, 0, -90], B: [3, 0, -90], C: [6, 0, -90], M: [1, 2.5, 180], N: [4.5, 4.2, 90], P: [6.5, 2.8, 0], p1: [-1, 0], p2: [7.5, 0] },
          [{ d: 'p1p2', b: 1 }, ...['A', 'B', 'C', 'M', 'N', 'P'].map((n) => ({ tacka: n })), { p: 'MNP', b: 2, prazno: 1 }, ...['A', 'B', 'C'].flatMap((a) => ['M', 'N', 'P'].map((m) => ({ d: a + m, b: 4, isp: 1 })))])),
      ]);
    Z(5, 4, 2,
      'Dati su skupovi $A$, $B$ i $C$ takvi da je $A ∩ B ∩ C = ∅$. Skup $A \\ B$ ima $7$ elemenata, $C \\ B$ ima $8$ elemenata, $A ∩ C$ ima $2$ elementa, a $A ∪ B ∪ C$ ima $20$ elemenata. Koliko elemenata ima skup $B$?',
      ['$7$', '$5$', '$13$', '$9$'],
      [
        'Nacrtajmo Venov dijagram. Presek sva tri je prazan, pa je $A ∩ C$ ceo van $B$: neka u njemu ima $y$, u „samo $A$“ $x$, a u „samo $C$“ $z$ elemenata.',
        '$A ∩ C$ ima $2$: $y = 2$. $A \\ B$ (samo $A$ i $A ∩ C$): $x + y = 7$, pa $x = 5$. $C \\ B$: $y + z = 8$, pa $z = 6$.',
        K('Van skupa $B$ je $x + y + z = 13$ elemenata unije, pa skup $B$ ima $20 − 13 = 7$ elemenata.', [], G({}, [C.krug(-1.6, 1, 2.4, { b: 0, prazno: 1 }), C.krug(1.6, 1, 2.4, { b: 5, prazno: 1 }), C.krug(-2.6, -2.6, 2.4, { b: 2, prazno: 1 }), { tx: 'A', at: [-4.3, 3.2] }, { tx: 'B', at: [4.3, 3.2] }, { tx: 'C', at: [-5.4, -4.6] }, { tx: 'x = 5', at: [-1.6, 1.8] }, { tx: 'y = 2', at: [-2.5, -0.5] }, { tx: 'z = 6', at: [-3, -3.4] }, { tx: 'B: 7', at: [2.3, 1.2], b: 1 }])),
      ]);
    Z(5, 5, 3,
      'Za koliko parova cifara $(x, y)$ je proizvod trocifrenih brojeva $12x$ i $34y$ (zapisano ciframa) deljiv sa $15$?',
      ['$24$', '$30$', '$27$', '$20$'],
      [
        'Proizvod je deljiv sa $15 = 3 · 5$ ako je jedan od brojeva deljiv sa $5$ i jedan (isti ili drugi) sa $3$.',
        'Slučaj $x = 0$ ($120$ je deljiv sa $15$): $y$ bilo koja cifra – $10$ parova. Slučaj $x = 5$ ($125$ deljiv sa $5$, ne sa $3$): treba $3 | 34y$, tj. $3 | 7 + y$: $y ∈ \\{2, 5, 8\\}$ – $3$ para.',
        'Slučaj $y = 5$ ($345 = 15 · 23$): $x$ bilo koja cifra – $10$ parova. Slučaj $y = 0$ ($340$ deljiv sa $5$, ne sa $3$): treba $3 | 12x$, tj. $3 | 3 + x$: $x ∈ \\{0, 3, 6, 9\\}$ – $4$ para.',
        'Ako $12x$ i $34y$ nijedan nije deljiv sa $5$, proizvod nije deljiv sa $5$ – drugih rešenja nema.',
        K('Neki parovi su brojani dvaput: $(0, 0)$, $(0, 5)$ i $(5, 5)$. Ukupno $10 + 3 + 10 + 4 − 3 = 24$.', [], C.tabela([['~slučaj', 'x = 0', 'x = 5', 'y = 5', 'y = 0', '~ponovljeni'], ['~parova', 10, 3, 10, 4, '−3']])),
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Petina oštrog ugla $α$ pravouglog trougla $ABC$ jednaka je trećini oštrog ugla $β$. Kako se odnose dužine stranica trougla?',
      ['$c > a > b$', '$c > b > a$', '$a > c > b$', '$a = b < c$'],
      [
        '${α|5} = {β|3}$ znači $α = {5|3}β$, pa je $α > β$. (Konkretno, iz $α + β = 90°$: $β = 33° 45\'$, $α = 56° 15\'$.)',
        'U trouglu je naspram većeg ugla veća stranica: naspram $α$ je $a$, naspram $β$ je $b$, pa je $a > b$.',
        K('Hipotenuza $c$ je naspram pravog ugla – najveća. Dakle $c > a > b$.', [], G({ C: [0, 0, 225], B: [5, 0, -45], A: [0, 3.34, 135] }, [{ p: 'ABC' }, { pu: 'BCA' }, { u: 'CAB', o: 'α' }, { u: 'ABC', o: 'β' }, { d: 'BC', o: 'a' }, { d: 'CA', o: 'b' }, { d: 'AB', o: 'c' }])),
      ]);
    Z(6, 2, 2,
      'Koji je najmanji sedmocifreni broj oblika $17x679y$ ($x$ i $y$ su cifre) koji je deljiv sa $45$?',
      ['$1 716 795$', '$1 766 790$', '$1 706 790$', '$1 726 795$'],
      [
        '$45 = 5 · 9$: broj mora biti deljiv sa $5$ (poslednja cifra $y = 0$ ili $5$) i sa $9$ (zbir cifara).',
        'Zbir cifara: $1 + 7 + x + 6 + 7 + 9 + y = 30 + x + y$ treba da bude deljiv sa $9$, tj. $x + y ∈ \\{6, 15\\}$.',
        K('$y = 0$: $x = 6$, broj $1 766 790$. $y = 5$: $x + 5 ∈ \\{6, 15\\}$, pa $x = 1$, broj $1 716 795$.', [], C.tabela([['y', 0, 5], ['x', 6, 1], ['~broj', '1766790', '1716795']], { istakni: [[2, 2]] })),
        'Manji je $1 716 795$ (cifra hiljada $1 < 6$).',
      ]);
    Z(6, 3, 2,
      'Broj $2022$ napisan je kao proizvod pet različitih celih brojeva. Kolika je najmanja vrednost zbira tih pet brojeva?',
      ['$−342$', '$−338$', '$336$', '$−2024$'],
      [
        '$2022 = 2 · 3 · 337$ – tri prosta činioca. Pet različitih celih brojeva: dva od njih moraju biti $1$ i $−1$ (inače bismo imali premalo činilaca), a preostala tri su po apsolutnoj vrednosti $2, 3, 337$.',
        'Kako je $1 · (−1) = −1$, proizvod preostala tri mora biti $−2022$: neparan broj (jedan ili tri) od njih je negativan.',
        'Zbir je najmanji kad su sva tri negativna: $−2, −3, −337$.',
        'Zbir: $1 + (−1) + (−2) + (−3) + (−337) = −342$.',
      ]);
    Z(6, 4, 2,
      'Da li postoje prosti brojevi $p$ i $q$ takvi da je $13p + 3q = 2022$? Ako postoje, koji su?',
      ['Postoje: $p = 3$, $q = 661$', 'Ne postoje', 'Postoje: $p = 3$, $q = 663$', 'Postoje: $p = 2$, $q = 665$'],
      [
        '$2022$ je deljiv sa $3$ ($2 + 0 + 2 + 2 = 6$), a i $3q$ je deljiv sa $3$. Zato i $13p$ mora biti deljiv sa $3$, a kako su $13$ i $3$ uzajamno prosti, $3 | p$.',
        'Prost broj deljiv sa $3$ je samo $3$: $p = 3$. Tada $3q = 2022 − 39 = 1983$, pa je $q = 661$.',
        'Da li je $661$ prost? Dovoljno je proveriti proste do $√{661} < 26$: $2, 3, 5, 7, 11, 13, 17, 19, 23$ – nijedan ga ne deli. Jeste prost.',
        'Jedino rešenje: $p = 3$, $q = 661$.',
      ]);
    Z(6, 5, 3,
      'U trouglu $ABC$ je $∡BAC = 40°$, $∡ABC = 20°$ i $AB − BC = 10 cm$. Simetrala ugla $ACB$ seče $AB$ u tački $M$. Kolika je duž $CM$?',
      ['$10 cm$', '$5 cm$', '$20 cm$', '$10√2 cm$'],
      [
        K('Neka je $D$ tačka na $AB$ takva da je $BD = BC$. Trougao $CDB$ je jednakokrak sa uglom $20°$ kod $B$, pa je $∡BCD = ∡CDB = 80°$.', ['t1']),
        '$∡ACB = 180° − 40° − 20° = 120°$, pa je $∡ACD = 120° − 80° = 40° = ∡DAC$. Trougao $ACD$ je jednakokrak: $AD = CD$.',
        K('Simetrala daje $∡ACM = 60°$, pa je $∡DCM = 60° − 40° = 20°$; u trouglu $CDM$: $∡CDM = 80°$ (uporedan sa $100°$) i $∡CMD = 180° − 80° − 20° = 80°$. Zato je $CM = CD$.', ['t2']),
        '$CM = CD = AD = AB − BD = AB − BC = 10 cm$.',
      ],
      G({ A: [0, 0, 225], B: [9.7, 0, -45], C: [2.934, 2.463, 90], D: [2.5, 0, -100], M: [3.369, 0, -60] },
        [{ p: 'ABC' }, { u: 'BAC', o: '40°' }, { u: 'CBA', o: '20°' }, { d: 'CM', b: 1 }, { d: 'CD', k: 1 }, { p: 'CDB', id: 't1', b: 2, k: 1 }, { p: 'CDM', id: 't2', b: 4, k: 3 }]));

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Romb ima jednu dijagonalu $90 cm$, a površinu $5400 cm²$. Koliki je poluprečnik upisane kružnice romba?',
      ['$36 cm$', '$72 cm$', '$45 cm$', '$30 cm$'],
      [
        'Iz $P = {d_{1} · d_{2}|2}$: $5400 = {90 · d_{2}|2}$, pa je $d_{2} = 120 cm$.',
        'Dijagonale se polove pod pravim uglom: stranica je hipotenuza trougla sa katetama $45$ i $60$: $a = √{45² + 60²} = 75 cm$.',
        'Visina romba: $h = {P|a} = {5400|75} = 72 cm$.',
        K('Upisana kružnica dodiruje dve paralelne stranice, pa je njen prečnik jednak visini: $r = {h|2} = 36 cm$.', ['k']),
      ],
      G({ A: [-6, 0, 180], C: [6, 0, 0], B: [0, -4.5, -90], D: [0, 4.5, 90], O: [0, 0, -45] },
        [{ p: 'ABCD' }, { d: 'AC', isp: 1, o: '90' }, { d: 'BD', isp: 1 }, { kr: 'O', r: 3.6, id: 'k', b: 1, k: 4 }], { bezImena: ['O'] }));
    Z(7, 2, 2,
      'Dat je broj $x = {1|10} + {1|11} + {1|12} + … + {1|19}$. Kako su poređani po veličini brojevi $x$, $x²$, ${1|x}$, ${1|x²}$?',
      ['$x² < x < {1|x} < {1|x²}$', '$x < x² < {1|x²} < {1|x}$', '${1|x²} < {1|x} < x < x²$', '$x² < {1|x²} < x < {1|x}$'],
      [
        'Proceni $x$: svaki od $10$ sabiraka je najviše ${1|10}$, a samo prvi je baš jednak, pa je $x < 10 · {1|10} = 1$. Takođe $x > 0$.',
        'Za $0 < x < 1$: $x² = x · x < x$ (množenje brojem manjim od $1$ smanjuje).',
        '${1|x} > 1 > x$, i ${1|x²} = {1|x} · {1|x} > {1|x}$ (množenje brojem većim od $1$ povećava).',
        K('Poredak: $x² < x < {1|x} < {1|x²}$ (npr. $x ≈ 0,72$: $0,52 < 0,72 < 1,39 < 1,93$).', [], C.brojevna(0, 2, [[0.52, 'x²', 1], [0.72, 'x', 2], [1.39, '1/x', 3], [1.93, '1/x²', 4]], { podela: 0.5, svaki: 2 })),
      ]);
    // VII.3: crteži u razmeri 1 : 5 (A(0, 0), B(45, 0), D(31,18; 18), C(58,18; 18) u cm) – trapez koji se zaista dobije
    // iz AB, CD, AD i ugla od 150°; njegov krak BC je ≈ 22,3 cm, a ne 27 cm (greška u postavci).
    Z(7, 3, 2,
      'Obim trapeza je $135 cm$. Duži krak trapeza je dug $36 cm$ i zaklapa sa kraćom osnovicom ugao od $150°$. Kraći krak trapeza jednak je kraćoj osnovici i njegova dužina iznosi $60%$ dužine duže osnovice. Izračunaj površinu tog trapeza.',
      ['$648 cm²$', '$1296 cm²$', '$648√3 cm²$', '$486 cm²$'],
      [
        'Neka je $AB$ duža osnovica, $CD$ kraća, $AD = 36 cm$ duži krak, a $BC = CD$ kraći krak. Iz obima: $AB + 0,6 · AB + 0,6 · AB + 36 = 135$.',
        '$2,2 · AB = 99$, pa je $AB = 45 cm$ i $BC = CD = 0,6 · 45 = 27 cm$.',
        K('Ugao kraka $AD$ sa kraćom osnovicom je $∡ADC = 150°$, pa je ugao kod $A$ (na istom kraku) $180° − 150° = 30°$. Visina $DE$ sa krakom $AD$ gradi pravougli trougao $AED$ sa uglom od $30°$ – to je polovina jednakostraničnog trougla stranice $36$, pa je $DE = {AD|2} = 18 cm$.', [],
          G({ A: [0, 0, 225], E: [6.24, 0, -90], D: [6.24, 3.6, 90] },
            [{ p: 'AED', b: 3 }, { pu: 'AED' }, { u: 'EAD', o: '30°', r: 34 }, { d: 'AD', o: '36', os: -1 }, { d: 'DE', o: '18' }])),
        '$P = {AB + CD|2} · DE = {45 + 27|2} · 18 = 36 · 18 = 648 cm²$ – to je i zvanično rešenje.',
        K('Napomena: ovo je bila greška u postavci zadatka na takmičenju – takav trapez je nemoguće konstruisati. Iz trougla $AED$ je $AE = 18√3 ≈ 31,2 cm$, a razlika osnovica je samo $45 − 27 = 18 cm$. Zato bi teme $C$ moralo biti desno od $B$ (za oko $13,2 cm$), pa bi krak $BC$ bio $√{13,2² + 18²} ≈ 22,3 cm$, a ne $27 cm$. Sa krakom od $27 cm$ ugao kod $D$ ne bi mogao biti $150°$.', [],
          G({ A: [0, 0, 225], B: [9, 0, -45], C: [11.64, 3.6, 45], D: [6.24, 3.6, 135], E: [6.24, 0, -90] },
            [{ p: 'ABCD', prazno: 1 }, { d: 'DE', isp: 1 }, { u: 'ADC', o: '150°', r: 20 }, { d: 'AB', o: '45' }, { d: 'DC', o: '27', os: -1 }, { d: 'AD', o: '36', os: -1 }, { d: 'BC', o: '≈ 22,3 (a ne 27)', b: 1 }])),
      ]);
    Z(7, 4, 2,
      'U prodavnicu je stigla kutija olovaka sa planiranom (istom) cenom. Četvrtina olovaka prodata je po $5%$ višoj ceni, a polovina po $10%$ nižoj ceni od planirane. Po koliko procenata višoj ceni treba prodati ostatak da bi zarada bila kao planirana?',
      ['$15%$', '$5%$', '$10%$', '$20%$'],
      [
        'Neka je planirana zarada (cena svih olovaka) $x$. Ostatak je $1 − {1|4} − {1|2} = {1|4}$ olovaka; prodaje se po $(100 + y)%$ cene.',
        'Uslov: $1,05 · {x|4} + 0,9 · {x|2} + {100 + y|100} · {x|4} = x$.',
        'Podelimo sa $x$ i pomnožimo sa $400$: $105 + 180 + (100 + y) = 400$, tj. $385 + y = 400$.',
        K('$y = 15$: ostatak treba prodati po $15%$ višoj ceni.', [], C.tabela([['~deo olovaka', '1/4', '1/2', '1/4'], ['~cena (%)', 105, 90, '100 + y'], ['~doprinos (u 400-im)', 105, 180, '100 + y']])),
      ]);
    Z(7, 5, 3,
      'Koliko ima trocifrenih brojeva $abc$ (cifre $a, b, c$) takvih da je $√{abc + √c}$ prirodan broj?',
      ['$7$', '$3$', '$4$', '$10$'],
      [
        'Da bi izraz bio prirodan broj $n$, i $√c$ mora biti ceo: $c$ je cifra koja je potpun kvadrat, $c ∈ \\{0, 1, 4, 9\\}$. Tada je $n² = abc + √c$.',
        '$c = 1$: $n² = abc + 1$ se završava cifrom $2$; $c = 9$: $abc + 3$ se završava cifrom $2$. Nijedan kvadrat se ne završava cifrom $2$ – nema rešenja.',
        '$c = 0$: $n² = ab0$ je deljiv sa $10$, pa (kao kvadrat) i sa $100$: $100, 400, 900$.',
        '$c = 4$: $n² = ab4 + 2$ se završava sa $6$, pa se $n$ završava sa $4$ ili $6$, a $n² ≤ 1001$: $n ∈ \\{14, 16, 24, 26\\}$, brojevi $196 − 2 = 194$, $254$, $574$, $674$.',
        K('Ukupno $7$ brojeva: $100, 400, 900, 194, 254, 574, 674$.', [], C.tabela([['abc', 100, 400, 900, 194, 254, 574, 674], ['abc + √c', 100, 400, 900, 196, 256, 576, 676], ['n', 10, 20, 30, 14, 16, 24, 26]])),
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 1,
      'Tačke $A$ i $B$ su sa raznih strana ravni $α$, na rastojanjima $4 cm$ i $8 cm$ od nje. Kolika je duž $AB$ ako je njena ortogonalna projekcija na ravan dugačka $9 cm$?',
      ['$15 cm$', '$√{97} cm$', '$√{145} cm$', '$12 cm$'],
      [
        'Neka su $A\'$ i $B\'$ projekcije tačaka $A$ i $B$ na ravan; $A\'B\' = 9 cm$. Posmatrajmo ravan koja sadrži $A, B, A\', B\'$.',
        K('Pomerimo duž $A\'B\'$ paralelno do $A$: tačka $C$ na pravoj $BB\'$ sa $B\'C = 4 cm$ (sa strane tačke $A$). Tada je $AC = A\'B\' = 9 cm$ i $AC ⊥ BC$.', ['tr']),
        '$BC = BB\' + B\'C = 8 + 4 = 12 cm$ (tačke su sa raznih strana – rastojanja se sabiraju).',
        'Pitagora: $AB = √{9² + 12²} = √{225} = 15 cm$.',
      ],
      G({ A: [0, 4, 135], "A'": [0, 0, 225], "B'": [9, 0, -45], B: [9, -8, -45], C: [9, 4, 45], p1: [-2, 0], p2: [11, 0] },
        [{ d: 'p1p2', b: 4 }, { tx: 'α', at: [11.5, 0.4] }, { d: "AA'", o: '4' }, { d: "BB'", o: '8' }, { d: "A'B'", o: '9', b: 2 }, { d: 'AB', b: 1 }, { d: 'AC', isp: 1, k: 2 }, { d: "B'C", isp: 1, k: 2 }, { p: 'ACB', id: 'tr', b: 3, k: 2 }]));
    Z(8, 2, 1,
      'U ravni je dato $8$ tačaka, među kojima su tačno četiri trojke kolinearnih tačaka. Koliko pravih određuju ove tačke?',
      ['$20$', '$28$', '$24$', '$16$'],
      [
        'Da nema kolinearnih trojki, svaki par bi dao drugu pravu: ${8 · 7|2} = 28$ pravih.',
        'Tri kolinearne tačke daju samo $1$ pravu umesto $3$ – svaka trojka „gubi“ $2$ prave.',
        K('$28 − 4 · 2 = 20$ pravih. (Primer: $8$ tačaka na obodu mreže $3 × 3$ – četiri stranice su četiri trojke.)', [], G({}, [...[[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]].map(([x, y]) => ({ tx: '●', at: [x * 3, y * 3 - 0.1], b: 1 })), { lin: [[0, 0], [6, 0]], b: 2 }, { lin: [[0, 6], [6, 6]], b: 2 }, { lin: [[0, 0], [0, 6]], b: 2 }, { lin: [[6, 0], [6, 6]], b: 2 }])),
      ]);
    Z(8, 3, 2,
      'Za koji realan broj $a$ su jednačine $x · (2a − {2|3}) = a − {x|3} + 4$ i ${1|2} · ({1|2} − x) = x − {x + 1|2}$ ekvivalentne?',
      ['$a = {17|2}$', '$a = {17|4}$', '$a = 3$', '$a = {3|4}$'],
      [
        'Ekvivalentne jednačine imaju isti skup rešenja. Rešimo drugu (ne zavisi od $a$): ${1|4} − {x|2} = x − {x|2} − {1|2}$, tj. ${1|4} = x − {1|2}$, pa je $x = {3|4}$.',
        'Prva jednačina mora imati baš rešenje $x = {3|4}$: ${3|4}(2a − {2|3}) = a − {1|4} + 4$, tj. ${3|2}a − {1|2} = a + {15|4}$.',
        '${1|2}a = {17|4}$, pa je $a = {17|2}$.',
        'Provera da je to jedino rešenje prve: ona glasi $x(2a − {1|3}) = a + 4$, a za $a = {17|2}$ koeficijent $2a − {1|3} ≠ 0$ – jedinstveno rešenje $x = {3|4}$ ✓.',
      ]);
    Z(8, 4, 2,
      'Koliki je zbir svih rešenja jednačine $||x − √5| − √2| = √5$?',
      ['$2√5$', '$2√5 + 2√2$', '$0$', '$2√2$'],
      [
        'Spoljašnja apsolutna vrednost: $|x − √5| − √2 = √5$ ili $|x − √5| − √2 = −√5$.',
        'Drugi slučaj: $|x − √5| = √2 − √5 < 0$ – nemoguće.',
        'Prvi slučaj: $|x − √5| = √2 + √5$, pa je $x = √5 ± (√2 + √5)$: $x_{1} = 2√5 + √2$, $x_{2} = −√2$.',
        K('Zbir: $2√5 + √2 − √2 = 2√5$. (Rešenja su simetrična oko $√5$, pa je zbir $2 · √5$.)', [], C.brojevna(-2, 7, [[-1.414, '−√2', 1], [2.236, '√5', 4], [5.886, '2√5 + √2', 1]], { podela: 1, svaki: 1 })),
      ]);
    Z(8, 5, 3,
      'U trougao $ABC$ ($AB = 14 cm$, $BC = 13 cm$, $CA = 15 cm$) upisan je krug. Tangenta kruga paralelna sa $AB$ seče $BC$ i $AC$ u tačkama $M$ i $N$. Kolika je duž $MN$?',
      ['${14|3} cm$', '$7 cm$', '${28|3} cm$', '$4 cm$'],
      [
        'Heronov obrazac: $s = 21$, $P = √{21 · 7 · 8 · 6} = 84 cm²$. Visina na $AB$: $CD = {2P|AB} = 12 cm$.',
        'Poluprečnik upisanog kruga: $P = r · s$, pa je $r = {84|21} = 4 cm$.',
        K('Tangenta paralelna sa $AB$ je na rastojanju $2r = 8 cm$ od $AB$ (krug je između njih). Zato je visina malog trougla $NMC$: $CE = 12 − 8 = 4 cm$.', ['mn']),
        'Trouglovi $NMC$ i $ABC$ su slični: ${MN|AB} = {CE|CD} = {4|12}$, pa je $MN = {14|3} cm$.',
      ],
      G({ A: [0, 0, 225], B: [14, 0, -45], C: [5, 12, 90], I: [6.667, 4, 0], M: [8, 8, 0], N: [3.333, 8, 180], D: [5, 0, -90], E: [5, 8, 135] },
        [{ p: 'ABC' }, { kr: 'I', r: 4 }, { d: 'NM', id: 'mn', b: 1 }, { d: 'CD', isp: 1, k: 1 }, { pu: 'CDB', k: 1 }, { p: 'NMC', b: 2, k: 3 }], { bezImena: ['I'] }));
  },
};
