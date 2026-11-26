// Državno takmičenje iz matematike učenika osnovnih škola, 11. 5. 2019. (DMS)
// https://dms.rs/wp-content/uploads/2019/05/Postavke-zadataka-2019-drzavno.pdf (samo postavke – rešenja su naša, provereni računom)
module.exports = {
  godina: '2018/19', nivo: 'drzavno', datum: '11. 5. 2019.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Stranice jednakokrakog trougla su $a = 265 − 7x$, $b = 81 + x$ i $c = 115 + 3x$, gde je $x$ racionalan broj. Koliki najviše može biti obim tog trougla?',
      ['$416$', '$392$', '$512$', '$461$'],
      [
        'Obim: $a + b + c = 461 − 3x$. Trougao je jednakokrak – neke dve stranice su jednake; proverimo sva tri slučaja (i nejednakost trougla!).',
        '$a = b$: $265 − 7x = 81 + x$, $x = 23$: stranice $104, 104, 184$ – trougao postoji ($208 > 184$), obim $392$.',
        '$a = c$: $265 − 7x = 115 + 3x$, $x = 15$: stranice $160, 96, 160$ – postoji, obim $416$.',
        K('$b = c$: $81 + x = 115 + 3x$, $x = −17$: stranice $384, 64, 64$ – ne postoji ($64 + 64 < 384$).', [], C.tabela([['~slučaj', 'a = b', 'a = c', 'b = c'], ['x', 23, 15, '−17'], ['~stranice', '104, 104, 184', '160, 96, 160', '384, 64, 64'], ['~obim', 392, 416, '—']], { istakni: [[3, 2]] })),
        'Najveći mogući obim je $416$.',
      ]);
    Z(6, 2, 3,
      'Prirodni brojevi $a, b, c, d$ su takvi da je $NZD(a, b) = 24$, $NZD(b, c) = 36$, $NZD(c, d) = 54$ i $70 < NZD(d, a) < 100$. Koliko je $NZD(d, a)$?',
      ['$78$', '$72$', '$84$', '$96$'],
      [
        'Gledamo stepene dvojke i trojke. $24 = 2³ · 3$, $36 = 2² · 3²$, $54 = 2 · 3³$.',
        'Dvojke: $8 | b$, a $NZD(b, c)$ ima tačno $2²$, pa $c$ ima tačno $2²$. $NZD(c, d)$ ima tačno $2^{1}$, pa $d$ ima tačno $2^{1}$. Kako $8 | a$, $NZD(d, a)$ ima tačno $2^{1}$.',
        'Trojke: $9 | b$ (iz $NZD(b, c)$), a $NZD(a, b)$ ima tačno $3^{1}$, pa $a$ ima tačno $3^{1}$; $27 | d$. Zato $NZD(d, a)$ ima tačno $3^{1}$.',
        K('$NZD(d, a) = 6 · m$, gde $m$ nije deljiv ni sa $2$ ni sa $3$. Između $70$ i $100$: $6m ∈ \\{72, 78, 84, 90, 96\\}$, a samo $m = 13$ odgovara.', [], C.tabela([['6m', 72, 78, 84, 90, 96], ['m', 12, 13, 14, 15, 16], ['~uzajamno prost sa 6?', '~ne', '~da', '~ne', '~ne', '~ne']], { istakni: [[0, 2], [1, 2], [2, 2]] })),
        '$NZD(d, a) = 78$ (npr. $a = 24 · 13$, $d = 54 · 13$).',
      ]);
    Z(6, 3, 2,
      'Stranice trougla $ABC$ su tri uzastopna prirodna broja. Neka je $R$ središte stranice $BC$ i neka je simetrala ugla $BCA$ normalna na duž $AR$. Kolike su stranice trougla?',
      ['$AB = 3$, $BC = 4$, $CA = 2$', '$AB = 4$, $BC = 3$, $CA = 2$', '$AB = 5$, $BC = 6$, $CA = 4$', '$AB = 3$, $BC = 2$, $CA = 4$'],
      [
        K('U trouglu $ACR$ simetrala ugla $C$ je normalna na naspramnu stranicu $AR$ – tada je trougao $ACR$ jednakokrak: $CA = CR$ (simetrala je i visina samo u jednakokrakom trouglu).', ['t']),
        '$CR = {BC|2}$, pa je $BC = 2 · CA$.',
        'Tri uzastopna broja od kojih je jedan dvostruko veći od drugog: $1, 2, 3$ ($2 = 2 · 1$, ali trougao $1, 2, 3$ ne postoji) ili $2, 3, 4$ ($4 = 2 · 2$).',
        'Dakle $CA = 2$, $BC = 4$, $AB = 3$.',
      ],
      G({ C: [0, 0, 225], B: [4, 0, -45], A: [0.875, 1.984, 90], R: [2, 0, -90] }, [{ p: 'ABC' }, { d: 'AR' }, { d: 'CA', o: '2' }, { d: 'CB', o: '4' }, { p: 'ACR', id: 't', b: 2, k: 1 }]));
    Z(6, 4, 2,
      'Svaki od brojeva $a_{1}, a_{2}, …, a_{10}$ jednak je $1$ ili $−1$. Da li je moguće da važi $a_{1}a_{2} + a_{2}a_{3} + … + a_{9}a_{10} + a_{10}a_{1} = 0$?',
      ['Nije moguće', 'Moguće je, npr. naizmenično $1, −1$', 'Moguće je samo ako su svi jednaki', 'Moguće je na tačno $10$ načina'],
      [
        'Svaki od $10$ proizvoda je $1$ ili $−1$. Da bi zbir bio $0$, tačno $5$ proizvoda mora biti $−1$.',
        'Pomnožimo svih $10$ proizvoda: svaki $a_{i}$ se javlja tačno dvaput, pa je proizvod $(a_{1} a_{2} … a_{10})² = 1$.',
        K('Ali proizvod deset brojeva od kojih je pet jednako $−1$ je $(−1)^{5} = −1$. Kontradikcija – nije moguće.', [], C.tabela([['~broj (−1) među proizvodima', 0, 2, 4, 5, 6], ['~proizvod svih', 1, 1, 1, '−1', 1]], { istakni: [[1, 4]] })),
        '(Naizmenično $1, −1$ daje zbir $−10$, a ne $0$.)',
      ]);
    Z(6, 5, 3,
      'Iz tablice $2 × 5$ uklonjeno je donje levo polje. U preostalih $9$ polja treba rasporediti brojeve $1, 2, …, 9$ tako da je zbir u svakoj koloni, počev od druge, za jedan veći od zbira u prethodnoj koloni. Na koliko načina je to moguće?',
      ['$32$', '$16$', '$24$', '$48$'],
      [
        'Neka je zbir prve kolone (jedno polje) $s$; zbirovi kolona su $s, s + 1, s + 2, s + 3, s + 4$, ukupno $5s + 10 = 1 + 2 + … + 9 = 45$, pa je $s = 7$.',
        'U prvoj koloni je $7$. Ostale kolone imaju zbirove $8, 9, 10, 11$ i dele ostatak $\\{1, 2, 3, 4, 5, 6, 8, 9\\}$ na parove.',
        K('Par sa zbirom $8$ može biti $(2, 6)$ ili $(3, 5)$ (ne $(1, 7)$ – $7$ je zauzet, ni $(4, 4)$). Za $(2, 6)$: zbir $11$ – $(3, 8)$ (jer $(2, 9)$ i $(5, 6)$ koriste zauzete); zatim $9 = 4 + 5$ i $10 = 1 + 9$ ✓. Za $(3, 5)$: $11 = 2 + 9$, $9 = 1 + 8$, $10 = 4 + 6$ ✓.', [], C.tabela([['~zbir', 8, 9, 10, 11], ['~podela 1', '2 + 6', '4 + 5', '1 + 9', '3 + 8'], ['~podela 2', '3 + 5', '1 + 8', '4 + 6', '2 + 9']])),
        'Postoje tačno te dve podele na parove. U svakoj od četiri kolone dva broja mogu zameniti mesta (gore/dole): $2^{4} = 16$ rasporeda po podeli.',
        'Ukupno $2 · 16 = 32$ načina.',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Ako je $√{49 − x²} − √{25 − x²} = 3$, kolika je vrednost izraza $√{49 − x²} + √{25 − x²}$?',
      ['$8$', '$3$', '$24$', '$7$'],
      [
        'Neka je $p = √{49 − x²}$ i $q = √{25 − x²}$. Razlika kvadrata: $(p − q)(p + q) = p² − q² = (49 − x²) − (25 − x²) = 24$.',
        'Kako je $p − q = 3$: $3(p + q) = 24$, pa je $p + q = 8$.',
        'Usput: $p = 5,5$, $q = 2,5$, a $x² = 49 − 30,25 = 18,75$ – rešenje postoji.',
      ]);
    Z(7, 2, 2,
      'Na koliko načina se broj $2019$ može predstaviti kao zbir (dva ili više) uzastopnih celih brojeva?',
      ['$7$', '$3$', '$6$', '$8$'],
      [
        'Ako $k$ uzastopnih brojeva počinje od $a$: zbir je $ka + {k(k − 1)|2} = 2019$, tj. $k(2a + k − 1) = 4038 = 2 · 3 · 673$.',
        'Brojevi $k$ i $2a + k − 1$ su različite parnosti, a njihov proizvod je $4038$. Za svaki delilac $k ≥ 2$ broja $4038$ dobijamo ceo $a$ (proverom parnosti uvek uspeva, jer $4038$ ima tačno jednu dvojku).',
        K('Delioci $k ≥ 2$: $2, 3, 6, 673, 1346, 2019, 4038$ – sedam načina (celi brojevi smeju biti negativni!).', [], C.tabela([['k', 2, 3, 6, 673, 1346, 2019, 4038], ['~od', 1009, 672, 334, '−333', '−671', '−1008', '−2018'], ['~do', 1010, 674, 339, 339, 674, 1010, 2019]])),
        'Npr. $2019 = 1009 + 1010 = 672 + 673 + 674$, a $k = 673$: od $−333$ do $339$ (negativni se poništavaju sa pozitivnima).',
      ]);
    D(7, 3, 3,
      'U oštrouglom trouglu $ABC$ tačke $D$ i $E$ su podnožja visina iz $C$ i $A$, pri čemu je $AD = BC$. Ako je $F$ podnožje normale iz $D$ na duž $AE$, dokaži da je poluprava $BF$ simetrala ugla $ABC$.',
      [
        'Neka je $∡B = β$.',
        K('Pravougli trouglovi $AFD$ (prav ugao kod $F$) i $CDB$ (prav ugao kod $D$): hipotenuze $AD = BC$, a oštri uglovi $∡FAD = 90° − β$ (iz trougla $ABE$) i $∡DCB = 90° − β$ (iz trougla $BCD$) – podudarni su.', ['t1', 't2']),
        'Iz podudarnosti: $DF = DB$, pa je trougao $DFB$ jednakokrak: $∡DFB = ∡DBF$.',
        '$DF ⊥ AE$ i $BC ⊥ AE$, pa je $DF ∥ BC$, i $∡DFB = ∡FBC$ (naizmenični uglovi).',
        'Dakle $∡DBF = ∡FBC$ – poluprava $BF$ polovi ugao $ABC$.',
      ]);
    Z(7, 4, 3,
      'Dat je pravougli trougao $ABC$ sa pravim uglom kod $C$ i $∡BAC = 20°$. Na hipotenuzi $AB$ su tačke $O$ i $D$ takve da je $D$ središte duži $OB$, a krug sa centrom $O$ i poluprečnikom $OD$ dodiruje stranicu $AC$. Koliki je ugao $BCD$?',
      ['$35°$', '$30°$', '$40°$', '$45°$'],
      [
        K('Neka krug dodiruje $AC$ u tački $T$: $OT ⊥ AC$, $OT = OD = DB = r$. Kako je i $BC ⊥ AC$, četvorougao $OTCB$ je trapez sa osnovicama $OT ∥ BC$.', ['tr']),
        '$D$ je središte kraka $OB$, pa srednja linija kroz $D$ (paralelna osnovicama, dakle normalna na $AC$) polovi i krak $TC$ – njeno podnožje je središte $TC$. Zato je $D$ jednako udaljeno od $T$ i $C$: $DT = DC$.',
        'U trouglu $AOT$: $∡AOT = 90° − 20° = 70°$, pa je $∡TOD = 110°$. Trougao $ODT$ je jednakokrak ($OD = OT$): $∡OTD = 35°$, pa $∡DTC = 90° − 35° = 55°$.',
        'Trougao $DTC$ je jednakokrak: $∡DCT = 55°$, pa je $∡BCD = 90° − 55° = 35°$.',
      ],
      G({ A: [0, 0, 225], C: [10, 0, -45], B: [10, 3.64, 45], O: [5.938, 2.161, 120], D: [7.969, 2.9, 110], T: [5.938, 0, -90] },
        [{ p: 'ABC' }, { pu: 'ACB'.split('').reverse().join('') }, { kr: 'O', r: 2.161, b: 4 }, { d: 'CD', b: 1 }, { u: 'BAC'.split('').reverse().join(''), o: '20°' },
          { d: 'OT', isp: 1, k: 1 }, { p: 'OTCB', id: 'tr', b: 2, k: 1, prazno: 1 }, { d: 'DT', b: 3, k: 2 }]));
    Z(7, 5, 3,
      'Prirodan broj je „dobar“ ako se u njegovom rastavljanju na proste činioce svaki činilac pojavljuje sa neparnim izložiocem (npr. $17$, $35 = 5 · 7$, $54 = 2 · 3³$). Koliki je najveći broj $n$ takav da postoji $n$ uzastopnih dobrih brojeva?',
      ['$7$', '$3$', '$8$', '$15$'],
      [
        'Među bilo kojih $8$ uzastopnih brojeva jedan daje ostatak $4$ pri deljenju sa $8$ – on je deljiv sa $4$, a ne sa $8$, pa sadrži tačno $2²$ (paran izložilac). Taj broj nije dobar. Zato je $n ≤ 7$.',
        K('Sedam uzastopnih dobrih brojeva postoji: $29, 30, 31, 32, 33, 34, 35$.', [], C.tabela([['~broj', 29, 30, 31, 32, 33, 34, 35], ['~rastavljanje', '29', '2·3·5', '31', '2⁵', '3·11', '2·17', '5·7']])),
        'Odgovor: $n = 7$.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Koji prirodan broj $n$ čini zbir $1^{2016} + 2^{2017} + 3^{2018} + 4^{2019} + 5^{2020} + n$ deljivim sa $13$, a vrednost $|n − 2019|$ najmanjom mogućom?',
      ['$2016$', '$2019$', '$2029$', '$2003$'],
      [
        K('Ostaci stepena pri deljenju sa $13$ ponavljaju se sa periodom $12$ (npr. $2^{12}$ daje ostatak $1$). Izložioci: $2017 = 12 · 168 + 1$, $2018 → 2$, $2019 → 3$, $2020 → 4$.', [], C.tabela([['~sabirak', '1²⁰¹⁶', '2²⁰¹⁷', '3²⁰¹⁸', '4²⁰¹⁹', '5²⁰²⁰'], ['~kao', '1', '2¹', '3²', '4³', '5⁴'], ['~ostatak : 13', 1, 2, 9, 12, 1]])),
        'Zbir ostataka: $1 + 2 + 9 + 12 + 1 = 25$, tj. ostatak $12$. Zato $n$ mora davati ostatak $1$ pri deljenju sa $13$.',
        'Brojevi sa ostatkom $1$ oko $2019$: $2016 = 13 · 155 + 1$ (udaljen $3$) i $2029$ (udaljen $10$). Najbliži: $n = 2016$.',
      ]);
    Z(8, 2, 2,
      'Ako je ${1|1 + x_{1}} + {1|1 + x_{2}} + … + {1|1 + x_{2019}} = 2019$ (nijedan $x_{i}$ nije $0$ ni $−1$), kolika je vrednost izraza ${1|1 + {1|x_{1}}} + {1|1 + {1|x_{2}}} + … + {1|1 + {1|x_{2019}}}$?',
      ['$0$', '$2019$', '$1$', '$−2019$'],
      [
        'Sredimo jedan sabirak: ${1|1 + {1|x}} = {1|{x + 1|x}} = {x|x + 1}$.',
        'Trik: ${x|x + 1} = 1 − {1|x + 1}$.',
        'Zbir: $2019 − ({1|1 + x_{1}} + … + {1|1 + x_{2019}}) = 2019 − 2019 = 0$.',
      ]);
    Z(8, 3, 3,
      'Data je kocka $ABCDA\'B\'C\'D\'$ ivice $4 cm$, a $M$ je središte ivice $AB$. Kolika je površina preseka ravni $MC\'D$ i kocke?',
      ['$18 cm²$', '$12√2 cm²$', '$8√5 cm²$', '$24 cm²$'],
      [
        'Ravan sadrži $D$ i $C\'$ – dijagonalu strane $DCC\'D\'$. Naspramna strana $ABB\'A\'$ je paralelna, pa ravan nju seče po pravoj paralelnoj sa $DC\'$ kroz $M$.',
        'Ta paralela iz $M$ (pravac $DC\'$ ide „$4$ desno, $4$ gore“) stiže do središta $N$ ivice $BB\'$. Presek je četvorougao $DMNC\'$ – trapez ($MN ∥ DC\'$).',
        K('Dužine: $MN = 2√2$, $DC\' = 4√2$, kraci $DM = NC\' = √{4² + 2²} = 2√5$ – jednakokraki trapez.', [], C.kocka(4, [{ p: 'DMNC₁', b: 1 }, { tacka: 'M' }, { tacka: 'N' }], { T3: { M: [2, 0, 0], N: [4, 0, 2] } })),
        'Visina trapeza: polurazlika osnovica je ${4√2 − 2√2|2} = √2$, pa je $h = √{20 − 2} = 3√2$.',
        'Površina: ${2√2 + 4√2|2} · 3√2 = 3√2 · 3√2 = 18 cm²$.',
      ]);
    D(8, 4, 3,
      'U kružnicu $k$ upisan je pravougli trougao $ABC$ sa pravim uglom kod $C$. Neka je $K$ središte luka $BC$ koji ne sadrži $A$, $N$ središte duži $AC$, a $M$ druga presečna tačka prave $KN$ i kružnice $k$. Tangente na $k$ u tačkama $A$ i $C$ seku se u tački $E$. Dokaži da je ugao $EMK$ prav.',
      [
        'Neka je $O$ centar ($AB$ je prečnik). $E$ je jednako udaljena od $A$ i $C$ (tangentne duži), pa $E$, $N$, $O$ leže na simetrali duži $AC$: $EO ⊥ AC$.',
        '$K$ je središte luka $BC$, pa $OK ⊥ BC$, tj. $OK ∥ AC$. Zato je $∡EOK = 90°$.',
        'Trougao $EAO$ je pravougli (tangenta ⊥ poluprečnik), a $AN$ mu je visina na hipotenuzu: $NA² = NE · NO$. Za tetive $AC$ i $MK$ kroz $N$: $NA · NC = NM · NK$. Kako je $NA = NC$: $NM · NK = NE · NO$.',
        'Zato tačke $E, M, O, K$ leže na jednoj kružnici, pa je $∡EMK = ∡EOK = 90°$ (periferijski uglovi nad istim lukom $EK$).',
      ]);
    Z(8, 5, 3,
      'Na stranama kocke napisani su brojevi $1, 2, …, 6$ (svaki po jednom). U svakom temenu napisan je zbir tri broja sa strana koje se sustižu u tom temenu. Kolika je najveća moguća vrednost najmanjeg od tih osam zbirova?',
      ['$9$', '$10$', '$8$', '$11$'],
      [
        'Teme sadrži po jednu stranu iz svakog para naspramnih strana. Najmanji zbir je zbir manjih brojeva iz tri para.',
        'Broj $1$ je uvek manji u svom paru, pa je najmanji zbir $1 + p + p\'$, gde su $p, p\'$ manji brojevi iz druga dva para. Neka su ta četiri broja $w < x < y < z$: zbir manjih je najviše $w + y$ (uparivanje $(w, x)$, $(y, z)$; druga uparivanja daju $w + x$).',
        K('Najveće $w + y$: od $\\{2, …, 6\\}$ izbacimo partnera jedinice. Izbacimo li $2$, ostaje $3, 4, 5, 6$ i $w + y = 3 + 5 = 8$; inače je $w = 2$ i $w + y ≤ 2 + 5 = 7$. Dakle najmanji zbir je najviše $1 + 8 = 9$.', [], C.tabela([['~partner od 1', 2, 3, 4, 5, 6], ['~ostaje', '3,4,5,6', '2,4,5,6', '2,3,5,6', '2,3,4,6', '2,3,4,5'], ['w + y', 8, 7, 7, 6, 6], ['~najmanji zbir', 9, 8, 8, 7, 7]], { istakni: [[3, 1]] })),
        'Konkretno: parovi $(1, 2)$, $(3, 4)$, $(5, 6)$ daju najmanji zbir $1 + 3 + 5 = 9$ ✓. Odgovor: $9$.',
      ]);
  },
};
