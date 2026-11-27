// Okružno takmičenje iz matematike učenika osnovnih škola, 7. 3. 2020. (DMS, Bilten 2019/20)
// https://dms.rs/wp-content/uploads/2020/08/Bilten-2019-20.pdf
module.exports = {
  godina: '2019/20', nivo: 'okruzno', datum: '7. 3. 2020.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 2,
      'Na svakoj strani kocke napisan je po jedan prirodan broj; na tri vidljive strane su $5$, $10$ i $15$. Proizvodi brojeva na suprotnim stranama su jednaki. Koliki je najmanji mogući zbir svih šest brojeva?',
      ['$41$', '$60$', '$36$', '$45$'],
      [
        'Neka je zajednički proizvod $P$. Naspram $5$ je ${P|5}$, naspram $10$ je ${P|10}$, naspram $15$ je ${P|15}$ – svi moraju biti prirodni, pa je $P$ deljiv sa $5$, $10$ i $15$.',
        'Najmanji takav $P$ je $NZS(5, 10, 15) = 30$ (veći $P$ daje veće brojeve).',
        K('Naspram $15$ je $2$, naspram $10$ je $3$, naspram $5$ je $6$.', [], C.tabela([['~vidljivo', 5, 10, 15], ['~naspram', 6, 3, 2], ['~proizvod', 30, 30, 30]])),
        'Zbir: $5 + 10 + 15 + 6 + 3 + 2 = 41$.',
      ]);
    Z(5, 2, 2,
      'Koliko ima prirodnih brojeva manjih od $1000$ koji se završavaju nulom i jednaki su proizvodu $4$ različita prosta broja?',
      ['$10$', '$8$', '$12$', '$9$'],
      [
        'Broj se završava nulom ⇒ deljiv je sa $10 = 2 · 5$, pa su među četiri prosta broja $2$ i $5$.',
        'Preostala dva prosta broja $p < q$ (različita od $2$ i $5$) imaju proizvod $p · q < 100$ (jer $10 · pq < 1000$).',
        K('Parovi: $3 · 7, 3 · 11, 3 · 13, 3 · 17, 3 · 19, 3 · 23, 3 · 29, 3 · 31, 7 · 11, 7 · 13$ – deset parova.', [], C.tabela([['pq', 21, 33, 39, 51, 57, 69, 87, 93, 77, 91], ['~broj', 210, 330, 390, 510, 570, 690, 870, 930, 770, 910]])),
        'Ukupno $10$ brojeva.',
      ]);
    Z(5, 3, 1,
      'Prava $p$ prolazi kroz teme pravog ugla i sa njegovim kracima gradi uglove kao na slici: $α$ (između $p$ i jednog kraka), $x$ (između $p$ i drugog kraka) i $y$ (uporedni ugao uglu $α$ na pravoj $p$). Ako je $x + y = 163° 14\'$, kolika je mera uporednog ugla uglu $α$?',
      ['$126° 37\'$', '$53° 23\'$', '$116° 46\'$', '$136° 37\'$'],
      [
        'Sa slike: $x = 90° − α$ (dopunjava $α$ do pravog ugla) i $y = 180° − α$ (uporedni sa $α$).',
        '$90° − α + 180° − α = 163° 14\'$, tj. $2α = 270° − 163° 14\' = 106° 46\'$, pa je $α = 53° 23\'$.',
        'Uporedni ugao: $180° − 53° 23\' = 126° 37\'$ (to je upravo $y$).',
      ],
      G({ O: [0, 0, 225], A: [5, 0, 0], B: [0, 5, 90], P: [2.98, 4.01, 60], Q: [-2.98, -4.01, 240] },
        [{ d: 'OA' }, { d: 'OB' }, { d: 'PQ', b: 1 }, { pu: 'AOB' }, { u: 'AOP', o: 'α', r: 55, b: 2 }, { u: 'POB', o: 'x', r: 30 }, { u: 'AOQ', o: 'y', r: 40, b: 4 }], { bezImena: ['O', 'A', 'B', 'P', 'Q'] }));
    Z(5, 4, 2,
      'Odredi prirodan broj $n$ tako da važi ${3|n + 1} < {7|2020} < {3|n}$.',
      ['$865$', '$866$', '$864$', '$288$'],
      [
        'Okrenimo razlomke (svi su pozitivni, pa se znaci nejednakosti okreću): ${n + 1|3} > {2020|7} > {n|3}$.',
        'Pomnožimo sa $3$: $n + 1 > {6060|7} > n$.',
        K('${6060|7} = 865{5|7}$, pa je $n < 865{5|7} < n + 1$: $n = 865$.', [], C.brojevna(863, 868, [[865.71, '6060/7', 1], [865, 'n', 2], [866, 'n + 1', 2]], { podela: 1, svaki: 1 })),
      ]);
    Z(5, 5, 3,
      'U tačnom primeru sabiranja Nikola je jednake cifre zamenio istim slovom, a različite različitim, i dobio $M + A + T + E + M + A + T + I + K + A = EE$. Koja je najveća cifra koju može zameniti slovo $E$?',
      ['$6$', '$7$', '$8$', '$5$'],
      [
        '$EE = 11E$, pa sređena jednakost glasi $2M + 3A + 2T + E + I + K = 11E$, tj. $2M + 3A + 2T + I + K = 10E$.',
        'Da bi $E$ bio što veći, leva strana treba da bude što veća: najveću cifru $9$ dajemo slovu $A$ (množi se sa $3$), pa $8$ i $7$ slovima $M$ i $T$.',
        'Tada je $2M + 3A + 2T = 16 + 27 + 14 = 57$, a $I + K$ je najviše $6 + 5 = 11$ (cifre različite od $9, 8, 7$ i od $E$) – zbir najviše $68$, pa je $10E ≤ 68$ i $E ≤ 6$.',
        K('$E = 6$ je moguće: $57 + I + K = 60$ za $I = 1$, $K = 2$. Primer: $8 + 9 + 7 + 6 + 8 + 9 + 7 + 1 + 2 + 9 = 66$ ✓.', [], C.tabela([['M', 'A', 'T', 'E', 'I', 'K'], [8, 9, 7, 6, 1, 2]])),
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Zbir brojeva $a$, $b$, $c$ veći je od $a$ za ${5|2}$, od $b$ za ${59|6}$ i od $c$ za ${5|3}$. Koliki su brojevi $a$, $b$, $c$?',
      ['$a = 4{1|2}$, $b = −2{5|6}$, $c = 5{1|3}$', '$a = 4{1|2}$, $b = 2{5|6}$, $c = 5{1|3}$', '$a = 2{1|2}$, $b = 9{5|6}$, $c = 1{2|3}$', '$a = 5{1|2}$, $b = −1{5|6}$, $c = 6{1|3}$'],
      [
        'Uslovi: $b + c = {5|2}$, $a + c = {59|6}$, $a + b = {5|3}$.',
        'Saberemo: $2(a + b + c) = {15 + 59 + 10|6} = {84|6} = 14$, pa je $a + b + c = 7$.',
        '$a = 7 − {5|2} = 4{1|2}$, $b = 7 − {59|6} = −{17|6} = −2{5|6}$, $c = 7 − {5|3} = 5{1|3}$.',
        'Pazi: $b$ je negativan – zbir je veći od $b$ za više nego što iznosi sam zbir.',
      ]);
    Z(6, 2, 2,
      'Koliko ima nepodudarnih trouglova sa celobrojnim stranicama (u cm) obima $20 cm$?',
      ['$8$', '$10$', '$6$', '$12$'],
      [
        'Neka je $a ≤ b ≤ c$ i $a + b + c = 20$. Nejednakost trougla: $c < a + b = 20 − c$, pa je $c < 10$, tj. $c ≤ 9$. Takođe $c ≥ 7$ (najduža stranica je bar trećina obima, $≥ 6,7$).',
        K('$c = 9$: $(2, 9, 9), (3, 8, 9), (4, 7, 9), (5, 6, 9)$; $c = 8$: $(4, 8, 8), (5, 7, 8), (6, 6, 8)$; $c = 7$: $(6, 7, 7)$.', [], C.tabela([['c', 9, 9, 9, 9, 8, 8, 8, 7], ['b', 9, 8, 7, 6, 8, 7, 6, 7], ['a', 2, 3, 4, 5, 4, 5, 6, 6]])),
        'Ukupno $8$ trouglova.',
      ]);
    D(6, 3, 2,
      'Zbir dvocifrenih brojeva $ab$ i $cd$ (zapisanih ciframa) deljiv je sa $33$. Dokaži da je i četvorocifreni broj $abcd$ deljiv sa $33$.',
      [
        'Četvorocifreni broj je $100 · ab + cd$.',
        'Zapišimo: $100 · ab + cd = 99 · ab + (ab + cd)$.',
        '$99 · ab$ je deljiv sa $33$ ($99 = 3 · 33$), a $ab + cd$ je deljiv sa $33$ po uslovu. Zbir dva broja deljiva sa $33$ je deljiv sa $33$.',
        'Primer: $12 + 21 = 33$, a $1221 = 33 · 37$ ✓.',
      ]);
    Z(6, 4, 2,
      'Koliko ima sedmocifrenih palindroma (čitaju se isto sa obe strane, npr. $2014102$) čiji je proizvod cifara paran?',
      ['$8375$', '$9000$', '$625$', '$4500$'],
      [
        'Sedmocifreni palindrom ima oblik $abcdcba$ – određen je prvim četiri cifre $abcd$ ($a ≠ 0$): ukupno $9 · 10 · 10 · 10 = 9000$.',
        'Proizvod je neparan samo ako su sve cifre neparne: $5 · 5 · 5 · 5 = 625$ palindroma.',
        K('Paran proizvod: $9000 − 625 = 8375$.', [], C.tabela([['~svi', '~neparan proizvod', '~paran proizvod'], [9000, 625, 8375]])),
      ]);
    Z(6, 5, 3,
      'Tačka $D$ je na osnovici $BC$ jednakokrakog trougla $ABC$ tako da je $∡BAD = 2020\'$ (minuta), a $E$ je na kraku $AC$ tako da je $AE = AD$. Kolika je mera ugla $CDE$?',
      ['$16° 50\'$', '$33° 40\'$', '$20° 20\'$', '$10° 10\'$'],
      [
        'Neka su uglovi na osnovici $α$, uglovi na osnovici trougla $ADE$ $β$, i $∡CDE = x$.',
        K('U trouglu $DEC$: spoljašnji ugao kod $E$ je $∡AED = β = x + α$.', ['t1']),
        'U trouglu $ABD$: spoljašnji ugao kod $D$ je $∡ADC = α + 2020\'$, a to je $β + x$.',
        'Zamena: $α + 2020\' = x + α + x$, pa je $2x = 2020\'$ i $x = 1010\' = 16° 50\'$ – ne zavisi od $α$!',
      ],
      G({ B: [0, 0, 225], C: [10, 0, -45], A: [5, 5.959, 90], D: [4.339, 0, -90], E: [8.854, 1.366, 30] },
        [{ p: 'ABC' }, { d: 'AD' }, { d: 'DE', b: 1 }, { u: 'BAD', o: '2020\'' }, { u: 'EDC'.split('').reverse().join(''), o: 'x', b: 3 }, { p: 'DEC', id: 't1', b: 2, k: 2 }]));

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'Da li postoje prirodni brojevi $x$, $y$, $z$ takvi da je $4^{x} + 9^{y} = 11^{z}$?',
      ['Ne postoje', 'Postoje, npr. $x = y = z = 1$', 'Postoje beskonačno mnogo', 'Postoje samo za $z = 2$'],
      [
        K('Pogledajmo poslednje cifre: $4^{x}$ se završava sa $4$ ili $6$, $9^{y}$ sa $9$ ili $1$, a $11^{z}$ uvek sa $1$.', [], C.tabela([['~stepen', 1, 2, 3, 4], ['4ⁿ', 4, 6, 4, 6], ['9ⁿ', 9, 1, 9, 1], ['11ⁿ', 1, 1, 1, 1]])),
        'Zbir $4^{x} + 9^{y}$ se završava sa $4 + 9 → 3$, $4 + 1 → 5$, $6 + 9 → 5$ ili $6 + 1 → 7$ – nikad sa $1$.',
        'Zato takvi brojevi ne postoje.',
      ]);
    Z(7, 2, 2,
      'Koliko ima petocifrenih brojeva u čijem se zapisu pojavljuje bar jedna parna i bar jedna neparna cifra?',
      ['$84 375$', '$90 000$', '$87 500$', '$81 250$'],
      [
        'Svih petocifrenih: $90 000$. Oduzmemo one sa samo parnim i one sa samo neparnim ciframa.',
        'Samo parne: prva cifra $2, 4, 6, 8$ (ne $0$), ostale $5$ izbora: $4 · 5^{4} = 2500$.',
        'Samo neparne: $5^{5} = 3125$.',
        '$90 000 − 2500 − 3125 = 84 375$.',
      ]);
    Z(7, 3, 2,
      'Iz skupa $\\{2, 3, 4, 5\\}$ biraju se tri različita broja $p$, $q$, $r$. Na koliko načina se može postići da broj $p^{(q^{r})}$ bude deljiv sa $8$?',
      ['$12$', '$6$', '$18$', '$24$'],
      [
        'Broj deljiv sa $8 = 2³$ mora biti paran, pa osnova $p$ mora biti $2$ ili $4$.',
        'Izložilac $q^{r}$ je uvek bar $8$ (najmanji mogući je $2³ = 8$; npr. $3² = 9$), pa je $2^{q^{r}}$ deljiv sa $2³ = 8$, a $4^{q^{r}}$ tim pre.',
        K('Za svaki izbor $p$ ($2$ načina), $q$ i $r$ biramo redom od preostala tri broja: $3 · 2 = 6$. Ukupno $2 · 6 = 12$.', [], C.tabela([['p', 2, 4], ['(q, r)', '6 načina', '6 načina']])),
      ]);
    Z(7, 4, 2,
      'Prava $p$ dodiruje krugove $k_{1}$ (poluprečnik $3 cm$) i $k_{2}$ (poluprečnik $2 cm$) u tačkama $A$ i $B$ (zajednička spoljašnja tangenta), a prava $q$ u tačkama $C$ i $D$ (unutrašnja tangenta), kao na slici. Kolika je vrednost $AB² − CD²$?',
      ['$24 cm²$', '$20 cm²$', '$25 cm²$', '$12 cm²$'],
      [
        'Neka je $d = O_{1}O_{2}$ rastojanje centara. Poluprečnici do dodirnih tačaka normalni su na tangentu.',
        'Spoljašnja tangenta: pomerimo $AB$ paralelno do centra $O_{2}$ – dobija se pravougli trougao sa hipotenuzom $d$ i katetom $3 − 2 = 1$: $AB² = d² − 1²$.',
        'Unutrašnja tangenta: kateta je $3 + 2 = 5$: $CD² = d² − 5²$.',
        'Razlika: $AB² − CD² = (d² − 1) − (d² − 25) = 24 cm²$ – ne zavisi od rastojanja centara!',
      ],
      G({ O2: [0, 0, 225], O1: [7, 0, -45], B: [-0.286, 1.979, 135], A: [6.571, 2.969, 90], D: [1.429, -1.4, -60], C: [4.857, 2.1, 120] },
        [{ kr: 'O2', r: 2 }, { kr: 'O1', r: 3 }, { lin: [[-1.5, 1.81], [8.5, 3.25]], b: 1 }, { lin: [[0, -2.83], [6, 3.4]], b: 2 }, { tacka: 'A' }, { tacka: 'B' }, { tacka: 'C' }, { tacka: 'D' }, { tx: 'p', at: [8.8, 3.6] }, { tx: 'q', at: [-0.4, -2.9] }, { tx: 'k₁', at: [10.4, 2.3] }, { tx: 'k₂', at: [-2.4, 1.7] }],
        { bezImena: ['O1', 'O2'] }));
    Z(7, 5, 2,
      'U pravouglom trouglu $ABC$ (pravi ugao kod $C$) je $BC = 3AC$. Tačke $M$ i $N$ na kateti $BC$ dele je na tri jednaka dela ($BM = MN = NC$), a $K$ je središte hipotenuze $AB$. Kolika je mera ugla $MKN$?',
      ['$90°$', '$60°$', '$45°$', '$120°$'],
      [
        K('Neka je $L$ središte $BC$. $KL$ je srednja linija trougla $ABC$: $KL ∥ AC$, pa je $KL ⊥ BC$, i $KL = {AC|2}$.', ['kl']),
        'Kako je $BC = 3AC$, svaka trećina je $MN = AC$, a $L$ je središte $MN$: $ML = LN = {AC|2} = KL$.',
        'Trouglovi $LMK$ i $LNK$ su jednakokrako-pravougli: $∡MKL = ∡NKL = 45°$.',
        '$∡MKN = 45° + 45° = 90°$.',
      ],
      G({ C: [0, 0, 225], A: [0, 2, 135], B: [6, 0, -45], M: [4, 0, -90], N: [2, 0, -90], K: [3, 1, 90], L: [3, 0, -90] },
        [{ p: 'ABC' }, { pu: 'BCA' }, { d: 'KM', b: 1 }, { d: 'KN', b: 1 }, { d: 'KL', id: 'kl', isp: 1, k: 1 }, { p: 'KMN', b: 2, k: 3 }]));

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Manji dijagonalni presek pravilne šestostrane piramide je jednakostranični trougao obima $18√3 cm$. Kolika je zapremina piramide?',
      ['$108√6 cm³$', '$54√6 cm³$', '$108√2 cm³$', '$216√3 cm³$'],
      [
        'Manji dijagonalni presek prolazi kroz vrh i kraću dijagonalu osnove; njegova stranica je $6√3$ (trećina obima), a to je kraća dijagonala šestougla: $a√3 = 6√3$, pa je $a = 6 cm$.',
        'Bočna ivica je takođe $6√3$. Rastojanje temena od centra osnove je $a = 6$, pa je visina $H = √{(6√3)² − 6²} = √{108 − 36} = 6√2 cm$.',
        K('Osnova: $B = 6 · {6²√3|4} = 54√3$. Zapremina: $V = {1|3} · 54√3 · 6√2 = 108√6 cm³$.', [], C.piramida(6, 3, 4.24, [{ p: 'ACS', b: 1 }])),
      ]);
    Z(8, 2, 2,
      'Godina je „srećna“ ako su sve cifre njenog zapisa različite uzastopne cifre (npr. $2013$). Koliko ima srećnih godina u trećem milenijumu ($2001$–$3000$), i koja je prva posle $2013$?',
      ['$18$; prva sledeća je $2031$', '$24$; prva sledeća je $2031$', '$18$; prva sledeća je $2103$', '$6$; prva sledeća je $2031$'],
      [
        'Prva cifra je $2$. Četiri uzastopne cifre koje sadrže $2$: $\\{0, 1, 2, 3\\}$, $\\{1, 2, 3, 4\\}$, $\\{2, 3, 4, 5\\}$.',
        'Za svaki skup preostale tri cifre raspoređujemo na $3! = 6$ načina: ukupno $3 · 6 = 18$.',
        K('Posle $2013$ (cifre $0, 1, 2, 3$) sledeće po veličini su $2031$, $2103$, … – prva je $2031$.', [], C.tabela([['~cifre', '0, 1, 2, 3', '1, 2, 3, 4', '2, 3, 4, 5'], ['~najmanja', 2013, 2134, 2345], ['~godina', 6, 6, 6]])),
      ]);
    Z(8, 3, 2,
      'Kolika je zapremina pravilne osmostrane prizme čiji je najveći dijagonalni presek kvadrat stranice $12 cm$?',
      ['$864√2 cm³$', '$432√2 cm³$', '$1728 cm³$', '$576√2 cm³$'],
      [
        'Najveći dijagonalni presek sadrži najdužu dijagonalu osnove (prečnik opisanog kruga) i visinu: oba su $12 cm$.',
        K('Osnovu (pravilni osmougao) delimo na $4$ podudarna deltoida sa dijagonalama $6$ (poluprečnik) i $6√2$ (tetiva nad $90°$).', [], (() => { const t = C.pravilni(8, 6); return G({ ...t, O: [0, 0] }, [{ p: 'ABCDEFGH' }, { p: 'OBCD', b: 1 }, { p: 'ODEF', b: 2 }, { p: 'OFGH', b: 3 }, { p: 'OHAB', b: 4 }], { bezImena: [...Object.keys(t), 'O'] }); })()),
        'Površina deltoida ${6 · 6√2|2} = 18√2$; osnova $B = 4 · 18√2 = 72√2 cm²$.',
        'Zapremina: $V = 72√2 · 12 = 864√2 cm³$.',
      ]);
    Z(8, 4, 2,
      'Za koliko celih brojeva $m$ je broj ${m² + 2016|\\|m\\| + 2}$ takođe ceo?',
      ['$21$', '$22$', '$12$', '$20$'],
      [
        'Kako je $m² = |m|²$: $m² + 2016 = (|m| + 2)(|m| − 2) + 2020$, pa je izraz $|m| − 2 + {2020|\\|m\\| + 2}$.',
        'Ceo je tačno kad $|m| + 2$ deli $2020 = 2² · 5 · 101$. Delioci: $1, 2, 4, 5, 10, 20, 101, 202, 404, 505, 1010, 2020$; ali $|m| + 2 ≥ 2$, pa $1$ otpada.',
        K('$|m| + 2 = 2$ daje samo $m = 0$; svaki od ostalih $10$ delilaca daje dva broja $±m$.', [], C.tabela([['|m| + 2', 2, 4, 5, 10, 20, 101, 202, 404, 505, 1010, 2020], ['|m|', 0, 2, 3, 8, 18, 99, 200, 402, 503, 1008, 2018]])),
        'Ukupno $1 + 10 · 2 = 21$ ceo broj.',
      ]);
    Z(8, 5, 2,
      'Za koje proste brojeve $p$ i $q$ je broj $p² + q² + 1$ potpun kvadrat?',
      ['samo $p = q = 2$', '$p = q = 2$ i $p = 2, q = 3$', 'za sve parove prostih brojeva', 'ne postoje'],
      [
        'Ako su oba neparna: kvadrat neparnog broja daje ostatak $1$ pri deljenju sa $4$, pa $p² + q² + 1$ daje ostatak $3$ – a kvadrat daje ostatak $0$ ili $1$. Nemoguće.',
        'Ako je $p = 2$: $q² + 5 = n²$, tj. $(n − q)(n + q) = 5$, pa $n − q = 1$, $n + q = 5$: $q = 2$, $n = 3$.',
        K('Jedino rešenje: $p = q = 2$, $4 + 4 + 1 = 9 = 3²$.', [], C.tabela([['~ostatak : 4', 'p²', 'q²', '1', '~zbir'], ['~p, q neparni', 1, 1, 1, 3]])),
      ]);
  },
};
