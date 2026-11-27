// Državno takmičenje iz matematike učenika osnovnih škola, 11. 5. 2024. (DMS)
// https://dms.rs/wp-content/uploads/2024/05/Postavke-i-resenja-zadataka-2024.pdf
module.exports = {
  godina: '2023/24', nivo: 'drzavno', datum: '11. 5. 2024.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'U tri suda nalivena je voda. Ako ${1|2}$ vode iz prvog suda prelijemo u drugi, zatim ${1|3}$ vode koja se sada nalazi u drugom sudu prelijemo u treći, i na kraju ${1|4}$ vode iz trećeg suda prelijemo u prvi, u svakom sudu će biti po $6$ litara. Koliko je litara bilo na početku u prvom, drugom i trećem sudu?',
      ['$8$, $5$ i $5$ litara', '$6$, $6$ i $6$ litara', '$8$, $6$ i $4$ litara', '$4$, $9$ i $5$ litara'],
      [
        'Ovakvi zadaci se najlakše rešavaju **unazad** – od kraja ka početku. Na kraju je u sudovima $6, 6, 6$ litara (ukupno $18$ – ta količina se nikad ne menja).',
        'Poslednje prelivanje: iz trećeg je preliveno ${1|4}$, pa je u njemu ostalo ${3|4}$ vode. Ako je pre toga u trećem bilo $c$ litara: ${3|4}c = 6$, pa je $c = 8$. Prelivena su $2$ litra u prvi, pa je pre toga stanje bilo $4, 6, 8$.',
        'Drugo prelivanje: iz drugog je prelivena trećina, ostale su dve trećine: ${2|3}b = 6$, $b = 9$. Prelivena su $3$ litra u treći, pa je pre toga stanje bilo $4, 9, 5$.',
        'Prvo prelivanje: iz prvog je prelivena polovina, ostala je polovina: ${1|2}a = 4$, $a = 8$. Prelivena su $4$ litra u drugi, pa je na početku bilo $8, 5, 5$.',
        K('Provera unapred: $8, 5, 5$ → $4, 9, 5$ → $4, 6, 8$ → $6, 6, 6$ ✓.', [], C.tabela([['~stanje', '~1. sud', '~2. sud', '~3. sud'], ['~početak', 8, 5, 5], ['~posle ½ iz 1.', 4, 9, 5], ['~posle ⅓ iz 2.', 4, 6, 8], ['~posle ¼ iz 3.', 6, 6, 6]], { istakni: [[1, 1], [1, 2], [1, 3]] })),
      ]);
    D(6, 2, 3,
      'Neka je $M$ tačka na kateti $BC$ pravouglog trougla $ABC$ (prav ugao kod $C$), takva da je $BM = 2MC$. Ako je $K$ središte hipotenuze $AB$, dokaži da je $∡BAM = ∡MKC$.',
      [
        'Neka je $L$ središte duži $BM$. Tada je $BL = LM = MC$ (duž $BC$ je podeljena na tri jednaka dela).',
        K('U trouglu $MAB$ duž $LK$ spaja središta stranica $BM$ i $BA$ – to je srednja linija, pa je $LK ∥ MA$. Zato je $∡BKL = ∡BAM$ (uglovi sa paralelnim kracima).', ['lk']),
        'Ostaje da dokažemo $∡BKL = ∡MKC$. Središte hipotenuze je jednako udaljeno od sva tri temena: $KB = KC = KA$. Zato je trougao $BKC$ jednakokrak i $∡LBK = ∡MCK$.',
        K('Trouglovi $LBK$ i $MCK$: $BL = CM$, $BK = CK$ i $∡LBK = ∡MCK$ – podudarni po stavu SUS.', ['t1', 't2']),
        'Iz podudarnosti $∡BKL = ∡CKM$, pa je $∡BAM = ∡BKL = ∡MKC$.',
      ],
      G({ C: [0, 0, -45], B: [0, 6, 45], A: [-5, 0, 225], M: [0, 2, 0], K: [-2.5, 3, 135], L: [0, 4, 0] },
        [{ p: 'ABC' }, { pu: 'ACB' }, { d: 'AM' }, { tacka: 'K' }, { d: 'KC', k: 3 }, { d: 'KM', k: 4 }, { tacka: 'L', k: 1 },
          { d: 'LK', id: 'lk', b: 1, k: 2 }, { p: 'LBK', id: 't1', b: 2, k: 4 }, { p: 'MCK', id: 't2', b: 4, k: 4 }]));
    D(6, 3, 2,
      'Preduzeće za dostavu hrane ima $50$ dostavljača. Prve isporuke su u $8:00$, sledeće na svakih sat vremena ($9:00$, $10:00$, …), a poslednja u $18:00$. Jednog dana svaki dostavljač je u neka $4$ termina dostavljao hranu. Dokaži da je u nekom terminu bar $19$ dostavljača dostavljalo hranu.',
      [
        'Prebrojimo termine: od $8:00$ do $18:00$ to je $11$ termina.',
        'Svi dostavljači zajedno rade $50 · 4 = 200$ „dostavljač-termina“.',
        'Dirihleov princip: kad bismo u svaki od $11$ termina stavili najviše $18$ dostavljača, pokrili bismo najviše $11 · 18 = 198 < 200$. Zato bar jedan termin ima bar $19$ dostavljača.',
        K('Ravnomernije od toga ne može: $200 = 11 · 18 + 2$, pa dva termina imaju po $19$, a ostali po $18$.', [], C.stubici([['8', 19], ['9', 19], ['10', 18], ['11', 18], ['12', 18], ['13', 18], ['14', 18], ['15', 18], ['16', 18], ['17', 18], ['18', 18]], { korakY: 5, maxY: 20, istakni: [0, 1] })),
      ]);
    Z(6, 4, 3,
      'Cifre $a, b, c$ (ne obavezno različite) zadovoljavaju $0,abab… + 0,abcabc… = {33|37}$ (zapis $0,abab…$ znači periodičan decimalni broj sa periodom od cifara $a, b$). Koliko je $a + b + c$?',
      ['$15$', '$14$', '$12$', '$18$'],
      [
        'Periodičan broj sa periodom od dve cifre je taj dvocifreni broj podeljen sa $99$: $0,abab… = {10a + b|99}$. Slično, sa periodom od tri cifre: $0,abcabc… = {100a + 10b + c|999}$.',
        'Pomnožimo jednačinu ${10a + b|99} + {100a + 10b + c|999} = {33|37}$ sa $NZS(99, 999, 37) = 10 989$: $111(10a + b) + 11(100a + 10b + c) = 9801$, tj. $2210a + 221b + 11c = 9801$.',
        'Pošto su $b$ i $c$ najviše $9$: $221b + 11c ≤ 1989 + 99 = 2088$, pa je $2210a ≥ 9801 − 2088 = 7713$ i $2210a ≤ 9801$. Jedina cifra: $a = 4$ ($8840$).',
        'Ostaje $221b + 11c = 961$. Opet procena: $221b ≥ 961 − 99 = 862$ i $221b ≤ 961$, pa je $b = 4$ ($884$), a onda $11c = 77$, $c = 7$.',
        'Provera: $0,4444… + 0,447447… = 0,891891… = {33|37}$ ✓. Zbir cifara: $4 + 4 + 7 = 15$.',
      ]);
    Z(6, 5, 3,
      'Neka je $M$ tačka na stranici $AB$ kvadrata $ABCD$ takva da je $∡ADM = 20°$, a $N$ tačka na stranici $BC$ takva da je $CN = DM − AM$. Kolika je mera ugla $MDN$?',
      ['$35°$', '$45°$', '$30°$', '$40°$'],
      [
        K('Pomoćna tačka: neka je $K$ na pravoj $AB$, sa druge strane tačke $A$ (raspored $K − A − M − B$), tako da je $AK = CN$.', ['k']),
        K('Trouglovi $ADK$ i $CDN$ su podudarni (SUS): $AD = CD$, $AK = CN$, oba imaju prav ugao (kod $A$ i kod $C$). Zato je $∡ADK = ∡CDN$.', ['t1', 't2']),
        '$MK = AM + AK = AM + CN = AM + (DM − AM) = DM$, pa je trougao $DMK$ jednakokrak sa osnovicom $DK$.',
        'U pravouglom trouglu $ADM$: $∡DMA = 90° − 20° = 70°$. U jednakokrakom $DMK$ uglovi na osnovici su $∡MKD = ∡MDK = {180° − 70°|2} = 55°$.',
        '$∡ADK = ∡MDK − ∡ADM = 55° − 20° = 35°$, pa je i $∡CDN = 35°$.',
        'Konačno: $∡MDN = 90° − ∡ADM − ∡CDN = 90° − 20° − 35° = 35°$.',
      ],
      G({ A: [0, 0, 225], B: [4, 0, -45], C: [4, 4, 45], D: [0, 4, 135], M: [1.456, 0, -90], N: [4, 1.199, 0], K: [-2.801, 0, -90] },
        [{ p: 'ABCD' }, { d: 'DM' }, { d: 'DN' }, { u: 'ADM', o: '20°' }, { u: 'MDN', o: '?', b: 1 },
          { d: 'KA', id: 'k', b: 1, isp: 1, k: 1 }, { d: 'DK', k: 2 }, { p: 'KAD', id: 't1', b: 2, k: 2 }, { p: 'NCD', id: 't2', b: 2, k: 2 }, { p: 'DMK', b: 4, k: 3 }]));

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Koliko cifara ima u zapisu proizvoda $8^{5} · 5^{10} · 15^{5}$?',
      ['$18$', '$15$', '$20$', '$17$'],
      [
        'Rastavimo sve na proste činioce: $8^{5} = (2³)^{5} = 2^{15}$ i $15^{5} = 3^{5} · 5^{5}$.',
        'Proizvod: $2^{15} · 5^{10} · 3^{5} · 5^{5} = 2^{15} · 5^{15} · 3^{5}$.',
        'Uparimo dvojke i petice: $2^{15} · 5^{15} = 10^{15}$, a $3^{5} = 243$. Proizvod je $243 · 10^{15}$ = $243$ i iza toga $15$ nula.',
        'Broj cifara: $3 + 15 = 18$.',
      ]);
    Z(7, 2, 2,
      'U pravouglom trouglu $ABC$ sa katetama $AC = 6 cm$ i $BC = 8 cm$ konstruisana je visina $CH$. U trouglove $AHC$ i $BCH$ upisane su kružnice koje visinu $CH$ dodiruju u tačkama $M$ i $N$. Kolika je dužina duži $MN$?',
      ['$0,4 cm$', '$0,2 cm$', '$1,2 cm$', '$2,8 cm$'],
      [
        'Hipotenuza: $AB = √{6² + 8²} = 10 cm$. Iz površine $AC · BC = AB · CH$: $CH = {48|10} = 4,8 cm$.',
        'Pitagora u trouglovima $AHC$ i $BCH$: $AH = √{36 − 23,04} = 3,6 cm$ i $BH = √{64 − 23,04} = 6,4 cm$.',
        K('Oba mala trougla su pravougla (prav ugao kod $H$). Dodirne tačke na $CH$ udaljene su od $H$ tačno za poluprečnik: $HM = r_{1}$ i $HN = r_{2}$ (od $H$, centra i dve dodirne tačke nastaje kvadrat). Zato je $MN = |r_{2} − r_{1}|$.', ['k1', 'k2']),
        'Za pravougli trougao sa katetama $p, q$ i hipotenuzom $s$: površina je ${p · q|2} = {r · (p + q + s)|2}$. Trougao $AHC$: $3,6 · 4,8 = r_{1} · (3,6 + 4,8 + 6)$, pa je $r_{1} = {17,28|14,4} = 1,2 cm$.',
        'Trougao $BCH$: $6,4 · 4,8 = r_{2} · (6,4 + 4,8 + 8)$, pa je $r_{2} = {30,72|19,2} = 1,6 cm$. (Kraće: kod pravouglog trougla $r = {p + q − s|2}$.)',
        '$MN = 1,6 − 1,2 = 0,4 cm$.',
      ],
      G({ C: [0, 0, 225], A: [6, 0, -45], B: [0, 8, 135], H: [3.84, 2.88, 45], M: [2.88, 2.16, -60], N: [2.56, 1.92, 150], O1: [3.6, 1.2, 0], O2: [1.6, 3.2, 180] },
        [{ p: 'ABC' }, { pu: 'ACB' }, { d: 'CH', b: 1 }, { pu: 'CHA' }, { kr: 'O1', r: 1.2, id: 'k1', b: 2, k: 3 }, { kr: 'O2', r: 1.6, id: 'k2', b: 4, k: 3 }, { tacka: 'M', k: 3 }, { tacka: 'N', k: 3 }],
        { bezImena: ['O1', 'O2'] }));
    Z(7, 3, 3,
      'Odredi sve prirodne brojeve $n ≥ 4$ za koje ${3n² − 2n + 50|3n − 2}$ NIJE prirodan broj, a ${n³ − 3|n − 3}$ JESTE prirodan broj. Koliko ima takvih $n$?',
      ['$6$', '$8$', '$2$', '$4$'],
      [
        'Prvi razlomak: $3n² − 2n = n(3n − 2)$, pa je ${3n² − 2n + 50|3n − 2} = n + {50|3n − 2}$. On je prirodan tačno kad $3n − 2$ deli $50$.',
        'Delioci broja $50$: $1, 2, 5, 10, 25, 50$. Uz $n ≥ 4$ ($3n − 2 ≥ 10$): $3n − 2 = 10$ daje $n = 4$, $3n − 2 = 25$ daje $n = 9$, a $50$ ne daje ceo $n$. Zato treba $n ≠ 4$ i $n ≠ 9$.',
        'Drugi razlomak: delimo $n³ − 3$ sa $n − 3$: $n³ − 3 = (n − 3)(n² + 3n + 9) + 24$, pa je ${n³ − 3|n − 3} = n² + 3n + 9 + {24|n − 3}$.',
        'On je prirodan kad $n − 3$ deli $24$: $n − 3 ∈ \\{1, 2, 3, 4, 6, 8, 12, 24\\}$, tj. $n ∈ \\{4, 5, 6, 7, 9, 11, 15, 27\\}$.',
        K('Izbacimo $4$ i $9$: $n ∈ \\{5, 6, 7, 11, 15, 27\\}$ – ukupno $6$ brojeva.', [], C.tabela([['n', 4, 5, 6, 7, 9, 11, 15, 27], ['~(n − 3) deli 24', '~da', '~da', '~da', '~da', '~da', '~da', '~da', '~da'], ['~(3n − 2) deli 50', '~da', '~ne', '~ne', '~ne', '~da', '~ne', '~ne', '~ne']], { istakni: [[0, 2], [0, 3], [0, 4], [0, 6], [0, 7], [0, 8]] })),
      ]);
    D(7, 4, 3,
      'Dat je trougao $ABC$ u kome je $∡BCA = 60°$. Simetrala ugla $BAC$ seče stranicu $BC$ u tački $D$, a simetrala ugla $ABC$ stranicu $AC$ u tački $E$. Dokaži da je $AB = AE + BD$.',
      [
        'Neka je $I$ presek simetrala (centar upisane kružnice) i $F$ tačka na $AB$ takva da je $AF = AE$. Treba još pokazati da je $BF = BD$.',
        'Neka je $∡A = α$, $∡B = β$; tada je $α + β = 120°$, tj. ${α|2} + {β|2} = 60°$.',
        'Trouglovi $AFI$ i $AEI$ su podudarni (SUS: $AF = AE$, zajednička $AI$, jednaki uglovi ${α|2}$ kod $A$), pa je $∡AFI = ∡AEI$. Iz trougla $BEC$: $∡BEC = 120° − {β|2}$, pa je $∡AEI = 60° + {β|2}$, a time i $∡AFI = 60° + {β|2}$ i $∡BFI = 120° − {β|2}$.',
        'Iz trougla $ADC$: $∡ADC = 120° − {α|2}$, pa je $∡BDI = 60° + {α|2} = 60° + 60° − {β|2} = 120° − {β|2} = ∡BFI$.',
        'Trouglovi $BFI$ i $BDI$ imaju zajedničku stranicu $BI$ i jednake uglove (kod $B$ po ${β|2}$, kod $F$ i $D$), pa su podudarni (USU): $BF = BD$. Dakle $AB = AF + FB = AE + BD$.',
      ]);
    Z(7, 5, 3,
      'Na koliko načina možemo brojeve iz skupa $\\{2, 3, 4, 5, 6, 7, 8, 9\\}$ obojiti crvenom, zelenom ili plavom bojom, tako da svaki broj bude obojen bojom različitom od boja svih njegovih pravih delilaca (iz tog skupa)?',
      ['$432$', '$216$', '$648$', '$144$'],
      [
        K('Zapišimo ko koga deli: $2 | 4$, $2 | 6$, $2 | 8$, $4 | 8$, $3 | 6$, $3 | 9$. Brojevi $5$ i $7$ nisu povezani ni sa kim.', [], C.tabela([['~broj', 4, 6, 8, 9], ['~pravi delioci', '2', '2, 3', '2, 4', '3']])),
        'Brojevi $2, 4, 8$ moraju imati tri različite boje (svaka dva su u odnosu „deli“): $3 · 2 · 1 = 6$ načina.',
        'Broj $3$: nema delilaca u skupu, ali $6$ i $9$ zavise od njega. Broj $6$ mora biti različit od $2$ i od $3$. Lakše je ići ovim redom: $6$ biramo različito od $2$ – $2$ načina; zatim $3$ različito od $6$ – $2$ načina; zatim $9$ različito od $3$ – $2$ načina.',
        'Brojevi $5$ i $7$: svaki bilo kojom bojom – $3 · 3 = 9$ načina.',
        'Ukupno: $6 · 2 · 2 · 2 · 9 = 432$.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Koliki je ostatak pri deljenju broja $19^{61} + 87^{87}$ sa $44$?',
      ['$18$', '$19$', '$20$', '$43$'],
      [
        'Radimo sa ostacima pri deljenju sa $44$. Kako je $87 = 2 · 44 − 1$, broj $87$ daje „ostatak $−1$“: $87^{87}$ daje isti ostatak kao $(−1)^{87} = −1$, tj. ostatak $43$.',
        'Za $19$ tražimo stepen blizak umnošku od $44$: $19² = 361 = 8 · 44 + 9$; $19^{4}$ daje ostatak $9² = 81 → 37 ≡ −7$; $19^{5}$ daje $−7 · 19 = −133 = −3 · 44 − 1$, tj. ostatak $−1$!',
        'Zato $19^{60} = (19^{5})^{12}$ daje $(−1)^{12} = 1$, a $19^{61}$ daje $19$.',
        'Zbir: $19 + (−1) = 18$. Ostatak je $18$.',
      ]);
    Z(8, 2, 3,
      'U koordinatnoj ravni data je tačka $T(2, 4)$. Kroz $T$ prolaze prave $p$ i $q$. Prava $p$ seče $x$-osu u $A$, a $y$-osu u $D$; prava $q$ seče $x$-osu u $B$, a $y$-osu u $C$. Trouglovi $ABT$ i $CDT$ su jednakokraki sa osnovicama $AB$ i $CD$, a $P_{ABT} : P_{CDT} = 9 : 4$. Koje su jednačine pravih $p$ i $q$?',
      ['$p: y = {4|3}x + {4|3}$, $q: y = −{4|3}x + {20|3}$', '$p: y = 2x$, $q: y = −2x + 8$', '$p: y = {3|4}x + {5|2}$, $q: y = −{3|4}x + {11|2}$', '$p: y = {4|3}x + 4$, $q: y = −{4|3}x + 4$'],
      [
        'Trougao $ABT$ je jednakokrak sa osnovicom $AB$ na $x$-osi, pa podnožje visine $N(2, 0)$ polovi $AB$. Ako je $AB = a$, visina je $TN = 4$, pa je $P_{ABT} = 2a$.',
        'Slično, trougao $CDT$ ima osnovicu na $y$-osi, podnožje visine $M(0, 4)$ polovi $CD$; ako je $CD = b$, visina je $TM = 2$, pa je $P_{CDT} = b$.',
        'Iz $2a : b = 9 : 4$ sledi $b = {8|9}a$.',
        'Prava $q$ prolazi kroz $C$, $T$ i $B$. Trouglovi $CMT$ i $TNB$ su slični (paralelne stranice), pa je ${CM|MT} = {TN|NB}$: ${b/2|2} = {4|a/2}$, tj. $ab = 32$. Sa $b = {8|9}a$: $a² = 36$, $a = 6$.',
        K('$A(−1, 0)$ i $B(5, 0)$. Prava $p$ kroz $A$ i $T$: nagib ${4 − 0|2 − (−1)} = {4|3}$, pa $y = {4|3}x + {4|3}$. Prava $q$ kroz $T$ i $B$: nagib ${0 − 4|5 − 2} = −{4|3}$, pa $y = −{4|3}x + {20|3}$.', [], G({ T: [2, 4, 90], A: [-1, 0, 225], B: [5, 0, -45], D: [0, 1.333, 180], C: [0, 6.667, 180], N: [2, 0, -90], M: [0, 4, 180] },
          [{ mreza: [-2, 6, -1, 7], ose: ['x', 'y'] }, { p: 'ABT', b: 1 }, { p: 'CDT', b: 2 }, { d: 'TN', isp: 1 }, { d: 'TM', isp: 1 }, { d: 'AT' }, { d: 'TB' }])),
        'Provera: $D(0, {4|3})$ i $C(0, {20|3})$, $CD = {16|3} = {8|9} · 6$ ✓, $P_{ABT} = 12$, $P_{CDT} = {16|3}$, odnos $12 : {16|3} = 9 : 4$ ✓.',
      ]);
    Z(8, 3, 3,
      'Na koliko načina možemo svako teme pravilnog osmougla obojiti plavom ili crvenom bojom tako da ne postoje četiri temena iste boje koja su temena pravougaonika?',
      ['$128$', '$256$', '$112$', '$144$'],
      [
        K('Četiri temena osmougla čine pravougaonik tačno kad su njegove dijagonale prečnici opisane kružnice. Osmougao ima $4$ prečnika (spajaju naspramna temena), a svaka dva prečnika daju pravougaonik.', [], (() => { const t = C.pravilni(8, 4); return G(t, [{ p: 'ABCDEFGH' }, { d: 'AE', b: 1 }, { d: 'BF', b: 2 }, { d: 'CG', b: 3 }, { d: 'DH', b: 4 }, { p: 'BCFG', b: 2, k: 0 }], { bezImena: Object.keys(t) }); })()),
        'Prečnik je „jednobojan“ ako su mu oba kraja iste boje. Zabranjeno je da dva prečnika budu jednobojna u ISTOJ boji (to bi bio jednobojan pravougaonik).',
        'Zato najviše dva prečnika smeju biti jednobojna, i to u različitim bojama (jedan plav, jedan crven). Raznobojan prečnik se boji na $2$ načina (koji kraj je plav).',
        '0 jednobojnih: $2^{4} = 16$. Jedan jednobojan: izbor prečnika $4$, boja $2$, ostali $2³$: $4 · 2 · 8 = 64$.',
        'Dva jednobojna: izbor para $6$, boje (jedan plav, drugi crven) $2$ načina, ostala dva $2²$: $6 · 2 · 4 = 48$.',
        'Ukupno: $16 + 64 + 48 = 128$ (od svih $2^{8} = 256$ bojenja).',
      ]);
    D(8, 4, 3,
      'Prirodni brojevi $a, b, c$ ($a ≠ b$) zadovoljavaju ${a|b} = {a² + c²|b² + c²}$. Dokaži da $a² + b² + c²$ nije prost broj.',
      [
        'Unakrsno množenje: $a(b² + c²) = b(a² + c²)$, tj. $ab² − a²b = bc² − ac²$, odnosno $ab(b − a) = c²(b − a)$.',
        'Kako je $a ≠ b$, skratimo sa $b − a$: $c² = ab$.',
        'Sada: $a² + b² + c² = a² + b² + ab = (a + b)² − ab = (a + b)² − c² = (a + b − c)(a + b + c)$.',
        'Da bi proizvod bio prost, manji činilac mora biti $1$: $a + b − c = 1$, tj. $a + b = c + 1$.',
        'Ali po nejednakosti aritmetičke i geometrijske sredine $a + b ≥ 2√{ab} = 2c$, pa je $c + 1 ≥ 2c$, tj. $c = 1$. Tada $ab = 1$ daje $a = b = 1$ – suprotno uslovu $a ≠ b$. Dakle broj nikad nije prost. (Primer: $a = 1, b = 4, c = 2$: $1 + 16 + 4 = 21 = 3 · 7$.)',
      ]);
    Z(8, 5, 3,
      'Tačke $P$ i $Q$ su na stranicama $DE$ i $EF$ pravilnog šestougla $ABCDEF$, tako da je $EP + EQ$ jednako stranici šestougla. Duži $BP$ i $CQ$ seku se u tački $R$. Kolika je mera ugla $BRC$?',
      ['$60°$', '$90°$', '$120°$', '$45°$'],
      [
        'Iz $EP + EQ = ED$ sledi $DP = ED − EP = EQ$.',
        K('Trouglovi $BDP$ i $CEQ$: kod pravilnog šestougla je $BD ⊥ DE$ i $CE ⊥ EF$ (ugao šestougla $120°$ minus $30°$), i $BD = CE$ (kraće dijagonale), $DP = EQ$. Pravougli trouglovi sa jednakim katetama su podudarni, pa je $∡BPD = ∡CQE$.', ['t1', 't2']),
        'U četvorouglu $PRQE$: $∡EQR + ∡EPR = ∡BPD + ∡BPE = 180°$ (uporedni uglovi kod $P$). Zbir naspramnih uglova je $180°$, pa je četvorougao tetivan.',
        'Zato je $∡PRQ = 180° − ∡PEQ = 180° − 120° = 60°$, a $∡BRC = ∡PRQ$ (unakrsni) $= 60°$.',
        'Deo b) zadatka: četvorouglovi $BCDP$ i $CDEQ$ su podudarni, pa $P_{BRC} = P_{BCDP} − P_{CDPR} = P_{CDEQ} − P_{CDPR} = P_{PRQE}$ – površine trougla $BCR$ i četvorougla $PRQE$ su jednake.',
      ],
      G({ A: [-2, -3.464, 225], B: [2, -3.464, -45], C: [4, 0, 0], D: [2, 3.464, 45], E: [-2, 3.464, 135], F: [-4, 0, 180], P: [-0.5, 3.464, 90], Q: [-3.25, 1.299, 180], R: [0.525, 0.623, -60] },
        [{ p: 'ABCDEF' }, { d: 'BP' }, { d: 'CQ' }, { u: 'CRB'.split('').reverse().join(''), o: '?', b: 1 },
          { p: 'BDP', id: 't1', b: 2, k: 2 }, { p: 'CEQ', id: 't2', b: 4, k: 2 }, { p: 'PRQE', b: 3, k: 3 }]));
  },
};
