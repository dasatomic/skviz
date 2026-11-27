// Opštinsko takmičenje iz matematike učenika osnovnih škola, 24. 2. 2018. (DMS)
// https://dms.rs/wp-content/uploads/2018/03/Zadaci-op-mat.pdf (samo postavke – rešenja su naša, provereni računom)
module.exports = {
  godina: '2017/18', nivo: 'opstinsko', datum: '24. 2. 2018.',
  zadaci: ({ Z, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Pera je množio prirodne brojeve $x$ i $y$ ($x, y > 1$) i dobio $473$. Nastavnik je utvrdio da je rezultat pogrešan, jer je Pera u jednom od brojeva zamenio redosled cifara. Koliko je zaista $x · y$?',
      ['$374$', '$473$', '$341$', '$434$'],
      [
        'Rastavimo $473$: $473 = 11 · 43$ ($11$ i $43$ su prosti), pa je Pera množio $11$ i $43$ (drugog rastavljanja sa oba činioca većim od $1$ nema).',
        'Promena redosleda cifara broja $11$ ne menja ništa, pa je Pera pogrešno zapisao broj $34$ kao $43$.',
        'Tačan proizvod: $11 · 34 = 374$. (Zanimljivo: i rezultat je dobijen „okretanjem“ cifara – jer množenje sa $11$ ovde ne pravi prenos.)',
      ]);
    Z(5, 2, 2,
      'Koje cifre treba ukloniti iz broja $127912345$ da bi se dobio najveći mogući broj deljiv sa $6$?',
      ['drugu cifru $2$ (iz $12$) i poslednju cifru $5$', 'samo poslednju cifru $5$', 'cifre $1$ i $5$', 'cifre $7$ i $5$'],
      [
        'Deljiv sa $6$: paran (poslednja cifra parna) i zbir cifara deljiv sa $3$. Da bi broj bio najveći, treba ukloniti što manje cifara, a od preostalih brisati one koje „najmanje štete“.',
        'Poslednja cifra $5$ je neparna – mora se ukloniti (ili još više cifara posle parne). Tada je broj $12791234$, zbir cifara $34 − 5 = 29$ – daje ostatak $2$ pri deljenju sa $3$.',
        'Treba ukloniti još jednu cifru sa ostatkom $2$ (cifre $2$ ili $5$): uklanjamo prvu dvojku (u $12…$), jer posle nje dolazi veća cifra $7$ – broj raste najviše.',
        K('Ostaje $1791234$: zbir cifara $27$, paran ✓. (Uklanjanjem druge dvojke dobili bismo manji broj $1279134$.)', [], C.tabela([['1', '2', '7', '9', '1', '2', '3', '4', '5']], { zaglavlje: false, istakni: [[0, 1], [0, 8]] })),
      ]);
    Z(5, 3, 2,
      'Dva kvadra su sastavljena od $7$, odnosno $11$ jednakih kocki. Površine kvadara se razlikuju za $256 cm²$. Kolika je površina jedne kocke?',
      ['$96 cm²$', '$16 cm²$', '$64 cm²$', '$128 cm²$'],
      [
        '$7$ i $11$ su prosti, pa su kvadri „štapovi“ $1 × 1 × 7$ i $1 × 1 × 11$ kocki.',
        'Neka je ivica kocke $a$. Kvadar od $n$ kocki: dve osnove $2a²$ i omotač $4 · n · a²$. Za $7$: $30a²$, za $11$: $46a²$.',
        K('Razlika: $16a² = 256$, pa je $a² = 16$, $a = 4 cm$, a površina kocke $6 · 16 = 96 cm²$.', [], C.kocke(1, 1, 7)),
      ]);
    Z(5, 4, 3,
      'Dva trocifrena broja imaju svih $6$ cifara različitih. Prva cifra drugog broja jednaka je dvostrukoj poslednjoj cifri prvog. Koji je najmanji mogući zbir ta dva broja?',
      ['$537$', '$450$', '$461$', '$579$'],
      [
        'Zbir je najmanji kad su cifre stotina što manje. Prvi broj počinje sa $1$, a drugi počinje cifrom $2c$, gde je $c$ poslednja cifra prvog.',
        'Ako bi drugi počinjao sa $2$, bilo bi $c = 1$ – ali $1$ je već prva cifra prvog. Sa $c = 0$ drugi bi počinjao nulom. Zato drugi počinje sa $4$ ($c = 2$).',
        K('Prvi broj: $1 ? 2$ sa najmanjom srednjom cifrom $0$: $102$. Drugi: $4 ? ?$ od preostalih cifara $3, 5, 6, …$: najmanje $435$.', [], C.tabela([['~prvi', 1, 0, 2], ['~drugi', 4, 3, 5]], { istakni: [[0, 3], [1, 1]] })),
        'Zbir: $102 + 435 = 537$. (Npr. prva cifra drugog $= 6$ daje već zbir veći od $600$.)',
      ]);
    Z(5, 5, 2,
      'Neka je $A$ skup prirodnih brojeva manjih od $2018$ deljivih sa $4$, $B$ – deljivih sa $6$, a $C$ – deljivih sa $15$. Koliko elemenata ima skup $A \\ (A ∩ B ∩ C)$?',
      ['$471$', '$504$', '$436$', '$33$'],
      [
        '$A$: $4, 8, …, 2016$ – $2016 : 4 = 504$ elementa.',
        '$A ∩ B ∩ C$: deljivi i sa $4$, $6$ i $15$, tj. sa $NZS(4, 6, 15) = 60$: $60, …, 1980$ – $33$ elementa.',
        K('$A \\ (A ∩ B ∩ C)$: $504 − 33 = 471$.', [], (() => { const v = C.venn({ imena: ['A', 'B ∩ C'], presek: true }); return G({}, [...v.e, ...C.upisi(['471'], v.mesta.A), ...C.upisi(['33'], v.mesta.AB)]); })()),
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'U razredu ima $64$ učenika. Može li se $2018$ bombona podeliti tako da svaki učenik dobije različit broj bombona i nijedan ne ostane bez bombona?',
      ['Ne može', 'Može, na jedan način', 'Može, na više načina', 'Može samo ako jedan dobije $0$'],
      [
        'Najmanji mogući broj bombona za $64$ učenika sa različitim pozitivnim brojevima je $1 + 2 + … + 64$.',
        '$1 + 2 + … + 64 = {64 · 65|2} = 2080$.',
        '$2080 > 2018$ – bombona nema dovoljno. Ne može.',
      ]);
    Z(6, 2, 2,
      'Kvadrati $ABCD$ i $A_{1}B_{1}C_{1}D_{1}$ su osno simetrični u odnosu na pravu $s$ (vidi sliku). Obim kvadrata $ABCD$ je $24 cm$, a obim pravougaonika $AA_{1}D_{1}D$ je $34 cm$. Koliki je obim pravougaonika $AEFD$ ($E$ i $F$ su na pravoj $s$)?',
      ['$23 cm$', '$22 cm$', '$24 cm$', '$28 cm$'],
      [
        'Stranica kvadrata: $24 : 4 = 6 cm$. Pravougaonik $AA_{1}D_{1}D$ ima visinu $6$, pa je $2(AA_{1} + 6) = 34$ i $AA_{1} = 11 cm$.',
        K('Prava $s$ je osa simetrije, pa je $A$ simetrično $A_{1}$: $s$ prolazi kroz središte duži $AA_{1}$. Zato je $AE = {11|2} = 5,5 cm$.', ['s']),
        'Obim $AEFD$: $2(5,5 + 6) = 23 cm$.',
      ],
      G({ A: [0, 0, 225], B: [6, 0, -45], C: [6, 6, 45], D: [0, 6, 135], A1: [11, 0, -45], B1: [5, 0, 225], C1: [5, 6, 135], D1: [11, 6, 45], E: [5.5, 0, -90], F: [5.5, 6, 90], s1: [5.5, -1], s2: [5.5, 7] },
        [{ p: 'ABCD', prazno: 1 }, { p: 'A1D1C1B1', prazno: 1 }, { d: 's1s2', isp: 1, b: 1, id: 's' }, { tacka: 'EF' }, { tx: 's', at: [5.85, 6.9], b: 1 }, { p: 'AEFD', b: 2, k: 2 }], { bezImena: ['s1', 's2'] }));
    Z(6, 3, 2,
      'Tačka $S$ je centar kruga upisanog u trougao $ABC$, $AC = 13 cm$, $BC = 14 cm$. Prava kroz $S$ paralelna sa $AB$ seče $AC$ i $BC$ u tačkama $P$ i $Q$. Koliki je obim trougla $CPQ$?',
      ['$27 cm$', '$13,5 cm$', '$41 cm$', 'ne može se odrediti bez $AB$'],
      [
        K('$AS$ je simetrala ugla $A$: $∡PAS = ∡SAB$, a $∡SAB = ∡ASP$ (naizmenični uglovi, $PQ ∥ AB$). Zato je trougao $APS$ jednakokrak: $PS = PA$.', ['t1']),
        K('Na isti način je trougao $BQS$ jednakokrak: $QS = QB$.', ['t2']),
        'Obim $CPQ$: $CP + PS + SQ + QC = CP + PA + QB + QC = CA + CB = 13 + 14 = 27 cm$.',
      ],
      G({ A: [0, 0, 225], B: [15, 0, -45], C: [6.6, 11.2, 90], S: [7, 4, -90], P: [2.357, 4, 180], Q: [12, 4, 0] },
        [{ p: 'ABC' }, { d: 'PQ', b: 1 }, { tacka: 'S' }, { d: 'AS', isp: 1 }, { d: 'BS', isp: 1 }, { p: 'APS', id: 't1', b: 2, k: 1 }, { p: 'BQS', id: 't2', b: 4, k: 2 }]));
    Z(6, 4, 2,
      'Koji je broj veći: ${2017|2018} + {2018|2017}$ ili ${17|18} + {18|17}$?',
      ['${17|18} + {18|17}$', '${2017|2018} + {2018|2017}$', 'jednaki su', 'ne može se odrediti'],
      [
        'Oba izraza su oblika $x + {1|x}$ za $x$ malo veće od $1$: ${2018|2017} = 1 + {1|2017}$ i ${18|17} = 1 + {1|17}$.',
        'Izračunajmo višak iznad $2$: ${2018|2017} + {2017|2018} − 2 = {(2018 − 2017)²|2017 · 2018} = {1|2017 · 2018}$, a ${18|17} + {17|18} − 2 = {1|17 · 18}$.',
        K('${1|306} > {1|4 070 306}$, pa je ${17|18} + {18|17}$ veći. (Što je $x$ dalje od $1$, to je $x + {1|x}$ veće.)', [], C.tabela([['x', '18/17', '2018/2017'], ['x + 1/x − 2', '1/306', '1/4070306']], { istakni: [[1, 1]] })),
      ]);
    Z(6, 5, 2,
      'Koja su četiri najmanja uzastopna prirodna broja takva da je prvi deljiv sa $2$, drugi sa $3$, treći sa $5$ i četvrti sa $7$?',
      ['$158, 159, 160, 161$', '$8, 9, 10, 11$', '$68, 69, 70, 71$', '$218, 219, 220, 221$'],
      [
        'Neka su brojevi $n, n + 1, n + 2, n + 3$. Uslovi: $n$ paran, $n + 1$ deljiv sa $3$, $n + 2$ deljiv sa $5$, $n + 3$ deljiv sa $7$.',
        'Kako je $n$ paran, a $n + 2$ deljiv sa $5$, broj $n + 2$ je deljiv sa $10$: $n ∈ \\{8, 18, 28, …\\}$. Od njih je $n + 1$ deljivo sa $3$ za $n = 8, 38, 68, …$ (korak $30$).',
        K('Proveravamo $n + 3$ deljivo sa $7$: $11, 41, 71, 101, 131, 161$ – prvi deljiv je $161 = 7 · 23$.', [], C.tabela([['n', 8, 38, 68, 98, 128, 158], ['n + 3', 11, 41, 71, 101, 131, 161], ['~: 7?', '~ne', '~ne', '~ne', '~ne', '~ne', '~da']], { istakni: [[0, 6], [1, 6], [2, 6]] })),
        'Brojevi: $158, 159, 160, 161$.',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'Izračunaj vrednost izraza $({9^{10} · (−4)^{25} · 18^{100}|8^{50} · (−3)^{220}})^{2017} + ({12^{100} · 3^{100}|(−6)^{200}})^{2018}$.',
      ['$0$', '$2$', '$−2$', '$1$'],
      [
        'Prvi razlomak: $9^{10} = 3^{20}$, $(−4)^{25} = −2^{50}$, $18^{100} = 2^{100} · 3^{200}$; brojilac $−2^{150} · 3^{220}$. Imenilac: $8^{50} = 2^{150}$, $(−3)^{220} = 3^{220}$. Razlomak je $−1$.',
        'Drugi: $12^{100} · 3^{100} = 36^{100} = 6^{200}$, a $(−6)^{200} = 6^{200}$. Razlomak je $1$.',
        '$(−1)^{2017} + 1^{2018} = −1 + 1 = 0$.',
      ]);
    Z(7, 2, 2,
      'Na slici je jednakokraki trapez $ABCD$ sa $AB = 12 cm$ i krakom $AD = 5 cm$. Površina trougla $ABC$ je tri puta veća od površine trougla $ACD$. Koliki su obim i površina trapeza?',
      ['$O = 26 cm$, $P = 24 cm²$', '$O = 26 cm$, $P = 48 cm²$', '$O = 28 cm$, $P = 36 cm²$', '$O = 24 cm$, $P = 32 cm²$'],
      [
        'Trouglovi $ABC$ i $ACD$ imaju istu visinu (visinu trapeza), pa se površine odnose kao osnovice: $AB = 3 · CD$, tj. $CD = 4 cm$.',
        K('Projekcija kraka: ${12 − 4|2} = 4$, pa je visina $h = √{5² − 4²} = 3 cm$.', [], G({ A: [0, 0, 225], B: [12, 0, -45], C: [8, 3, 45], D: [4, 3, 135], E: [4, 0, -90] }, [{ p: 'ABCD' }, { d: 'AC', isp: 1 }, { d: 'DE', isp: 1, o: '3' }, { pu: 'DEB' }])),
        'Površina: ${12 + 4|2} · 3 = 24 cm²$, obim $12 + 4 + 5 + 5 = 26 cm$.',
      ],
      G({ A: [0, 0, 225], B: [12, 0, -45], C: [8, 3, 45], D: [4, 3, 135] }, [{ p: 'ABCD' }, { d: 'AC' }, { d: 'AB', o: '12cm' }, { d: 'AD', o: '5cm' }]));
    Z(7, 3, 2,
      'Kolika je poslednja cifra zbira $1^{1} + 2^{2} + 3^{3} + 4^{4} + 5^{5} + 6^{6} + 7^{7} + 8^{8} + 9^{9} + 10^{10}$?',
      ['$7$', '$5$', '$3$', '$1$'],
      [
        'Poslednja cifra stepena zavisi od poslednje cifre osnove i ponavlja se sa periodom $4$.',
        K('Poslednje cifre: $1^{1} → 1$, $2² → 4$, $3³ → 7$, $4^{4} → 6$, $5^{5} → 5$, $6^{6} → 6$, $7^{7} → 3$ ($7 → 7, 9, 3, 1$; $7 = 4 + 3$), $8^{8} → 6$ ($8 → 8, 4, 2, 6$), $9^{9} → 9$, $10^{10} → 0$.', [], C.tabela([['n', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], ['~kraj nⁿ', 1, 4, 7, 6, 5, 6, 3, 6, 9, 0]])),
        'Zbir poslednjih cifara: $1 + 4 + 7 + 6 + 5 + 6 + 3 + 6 + 9 + 0 = 47$ – poslednja cifra je $7$.',
      ]);
    Z(7, 4, 2,
      'Ako je $A = 1 · 2 + 3 · 4 + 5 · 6 + … + 2017 · 2018$ i $B = 2 · 3 + 4 · 5 + 6 · 7 + … + 2018 · 2019$, kolika je vrednost ${B − A|1010}$?',
      ['$2018$', '$1009$', '$2019$', '$4036$'],
      [
        'Oba zbira imaju po $1009$ sabiraka. Oduzimamo član po član: $2k(2k + 1) − (2k − 1) · 2k = 2k · 2 = 4k$.',
        K('$B − A = 4(1 + 2 + … + 1009) = 4 · {1009 · 1010|2} = 2 · 1009 · 1010$.', [], C.tabela([['k', 1, 2, 3, '…', 1009], ['~član B', '2·3', '4·5', '6·7', '…', '2018·2019'], ['~član A', '1·2', '3·4', '5·6', '…', '2017·2018'], ['~razlika', 4, 8, 12, '…', 4036]])),
        '${B − A|1010} = 2 · 1009 = 2018$.',
      ]);
    Z(7, 5, 3,
      'Kružnica čiji je prečnik srednja linija paralelna hipotenuzi $AB$ pravouglog trougla $ABC$ seče hipotenuzu u tačkama $M$ i $N$. Ako su katete $AC = 6 cm$ i $BC = 8 cm$, kolika je duž $MN$?',
      ['$1,4 cm$', '$2,8 cm$', '$1 cm$', '$2,4 cm$'],
      [
        'Hipotenuza: $AB = 10 cm$. Srednja linija paralelna sa $AB$ ima dužinu $5$, pa je poluprečnik kružnice $2,5 cm$.',
        'Visina iz $C$ na $AB$: $h = {6 · 8|10} = 4,8 cm$. Srednja linija polovi visinu, pa je centar kružnice udaljen od $AB$ za $2,4 cm$.',
        K('$MN$ je tetiva na rastojanju $2,4$ od centra: polovina tetive je $√{2,5² − 2,4²} = √{0,49} = 0,7$, pa je $MN = 1,4 cm$.', [], G({ C: [0, 0, 225], A: [0, 6, 135], B: [8, 0, -45], P: [0, 3, 180], Q: [4, 0, -90], O: [2, 1.5, 0] }, [{ p: 'ABC' }, { pu: 'ACB'.split('').reverse().join('') }, { d: 'PQ', b: 1 }, { kr: 'O', r: 2.5, b: 2 }], { bezImena: ['O', 'P', 'Q'] })),
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 1,
      'Koliki je zbir svih rešenja jednačine $||1 − 2 · 3| − |4 · 5 − 6x|| = 7$?',
      ['${20|3}$', '$4$', '${16|3}$', '$0$'],
      [
        '$|1 − 6| = 5$, pa je jednačina $|5 − |20 − 6x|| = 7$.',
        '$5 − |20 − 6x| = 7$ daje $|20 − 6x| = −2$ – nemoguće. $5 − |20 − 6x| = −7$ daje $|20 − 6x| = 12$.',
        K('$20 − 6x = 12$ ⇒ $x = {4|3}$; $20 − 6x = −12$ ⇒ $x = {16|3}$. Zbir: ${20|3}$ (simetrično oko ${10|3}$).', [], C.brojevna(0, 6, [[1.333, '4/3', 1], [3.333, '10/3', 4], [5.333, '16/3', 1]], { podela: 1, svaki: 1 })),
      ]);
    Z(8, 2, 1,
      'Izračunaj vrednost izraza $(1 + √2 + √3)² − 2 · (√2 + √3 + √6)$.',
      ['$6$', '$0$', '$4$', '$6 + 2√6$'],
      [
        'Kvadrat zbira tri sabirka: $(a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ca$.',
        '$(1 + √2 + √3)² = 1 + 2 + 3 + 2√2 + 2√6 + 2√3$.',
        'Oduzimamo $2√2 + 2√3 + 2√6$: ostaje $1 + 2 + 3 = 6$.',
      ]);
    Z(8, 3, 2,
      'U unutrašnjosti kvadrata $ABCD$ konstruisan je polukrug nad prečnikom $AB$. Tačka $E$ na stranici $BC$ je takva da je $DE$ tangenta polukruga. U kojoj razmeri $E$ deli stranicu $BC$ ($BE : EC$)?',
      ['$1 : 3$', '$1 : 2$', '$1 : 1$', '$2 : 3$'],
      [
        'Neka je stranica $2$. Prave $DA$ i $CB$ su takođe tangente polukruga (normalne na prečnik u njegovim krajevima).',
        K('Tangentne duži iz iste tačke su jednake: $DT = DA = 2$ i $ET = EB = x$ ($T$ – dodirna tačka). Zato je $DE = 2 + x$.', ['t']),
        'Pitagora u trouglu $DCE$: $DE² = DC² + CE²$: $(2 + x)² = 4 + (2 − x)²$, tj. $4 + 4x = 4 + 4 − 4x$, pa je $x = {1|2}$.',
        '$BE = {1|2}$, $EC = {3|2}$: razmera $1 : 3$.',
      ],
      G({ A: [0, 0, 225], B: [4, 0, -45], C: [4, 4, 45], D: [0, 4, 135], E: [4, 1, 0], O: [2, 0, -90], T: [3.2, 1.6, 60] },
        [{ p: 'ABCD', prazno: 1 }, { l: 'O', r: 2, od: 0, do: 180, b: 1, pun: 1 }, { d: 'DE', b: 2 }, { d: 'OT', isp: 1, id: 't', k: 2 }, { tacka: 'T', k: 2 }], { bezImena: ['O'] }));
    Z(8, 4, 3,
      'Pravilna šestostrana prizma sa svim ivicama $4 cm$ presečena je ravni koja sadrži dužu dijagonalu jedne osnove i njoj paralelnu osnovnu ivicu druge osnove. Kolika je površina preseka?',
      ['$12√7 cm²$', '$24√3 cm²$', '$12√3 cm²$', '$8√7 cm²$'],
      [
        'Neka je duža dijagonala donje osnove $AD = 8$, a paralelna gornja ivica $B\'C\'$ (dužine $4$). Presek je trapez $AB\'C\'D$.',
        'Visina trapeza je rastojanje pravih $AD$ i $B\'C\'$: vodoravno, od dijagonale (kroz centar) do ivice $BC$ je $2√3$ (visina jednakostraničnog trougla stranice $4$), a uspravno $4$ (visina prizme).',
        K('$h = √{(2√3)² + 4²} = √{28} = 2√7 cm$.', [], C.prizma(6, 2, 2, [{ p: 'AB₁C₁D', b: 1 }])),
        'Površina: ${8 + 4|2} · 2√7 = 12√7 cm²$.',
      ]);
    Z(8, 5, 3,
      'U jednakosti $(A + B)(C + D)(E + F)(G + H) = 5005$ slova treba zameniti brojevima $1, 2, …, 8$ (različita slova – različiti brojevi). Na koliko načina?',
      ['$768$', '$384$', '$96$', '$48$'],
      [
        '$5005 = 5 · 7 · 11 · 13$. Svaki zbir dva različita broja od $1$ do $8$ je između $3$ i $15$, pa su četiri zbira baš $5, 7, 11, 13$ (njihov zbir $36 = 1 + … + 8$ ✓).',
        K('Podele brojeva $1$–$8$ na parove sa zbirovima $5, 7, 11, 13$: $\\{1, 4\\}, \\{2, 5\\}, \\{3, 8\\}, \\{6, 7\\}$ i $\\{2, 3\\}, \\{1, 6\\}, \\{4, 7\\}, \\{5, 8\\}$ – tačno dve.', [], C.tabela([['~zbir', 5, 7, 11, 13], ['~podela 1', '1, 4', '2, 5', '3, 8', '6, 7'], ['~podela 2', '2, 3', '1, 6', '4, 7', '5, 8']])),
        'Za svaku podelu: parove raspoređujemo na četiri zagrade na $4! = 24$ načina, a u svakoj zagradi dva broja na $2$ načina: $24 · 2^{4} = 384$.',
        'Ukupno $2 · 384 = 768$.',
      ]);
  },
};
