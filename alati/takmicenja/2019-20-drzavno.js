// Državno takmičenje iz matematike učenika osnovnih škola, 29. 8. 2020. (DMS, Bilten 2019/20)
// https://dms.rs/wp-content/uploads/2020/08/Bilten-2019-20.pdf
module.exports = {
  godina: '2019/20', nivo: 'drzavno', datum: '29. 8. 2020.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Otac daje džeparac trojici sinova. Najstariji dobija trećinu ukupnog iznosa i još $30$ dinara, srednji trećinu ostatka i još $30$ dinara, a najmlađi preostalih $430$ dinara. Koliko dobijaju najstariji i srednji sin?',
      ['$390$ i $260$ dinara', '$360$ i $240$ dinara', '$390$ i $230$ dinara', '$420$ i $260$ dinara'],
      [
        'Neka je ukupan iznos $S$. Najstariji: $x = {S|3} + 30$. Ostatak: $S − x = {2S|3} − 30$.',
        'Srednji: $y = {1|3}({2S|3} − 30) + 30 = {2S|9} + 20$.',
        '$x + y + 430 = S$: ${3S + 2S|9} + 50 + 430 = S$, pa je ${4S|9} = 480$ i $S = 1080$.',
        K('Najstariji $360 + 30 = 390$, srednji $240 + 20 = 260$ dinara. Provera: $390 + 260 + 430 = 1080$ ✓.', [], C.stubici([['~najstariji', 390], ['~srednji', 260], ['~najmlađi', 430]], { korakY: 100, maxY: 450, vrednosti: true })),
      ]);
    D(6, 2, 2,
      'U dve istovetne kutije nalazi se ukupno $61$ kuglica. Svaka kuglica je obojena jednom od pet boja, a postoje kuglice dve različite mase – lakše i teže. Dokaži da postoje bar $4$ kuglice iste boje i iste mase u istoj kutiji.',
      [
        'Dirihleov princip, korak po korak:',
        'Dve kutije, $61 = 2 · 30 + 1$ kuglica: u nekoj kutiji je bar $31$.',
        '$5$ boja, $31 = 5 · 6 + 1$: među njima bar $7$ iste boje.',
        K('$2$ mase, $7 = 2 · 3 + 1$: među tih $7$ bar $4$ iste mase. Dakle uvek postoje $4$ kuglice iste boje i mase u istoj kutiji (a više od toga nije garantovano).', [], C.tabela([['~„kutije“', 2, 5, 2], ['~predmeta', 61, 31, 7], ['~bar u jednoj', 31, 7, 4]])),
      ]);
    Z(6, 3, 2,
      'Neka su $a_{1}, a_{2}, …, a_{n}$ svi pozitivni delioci broja $2020$. Koliki je količnik zbira tih brojeva i zbira njihovih recipročnih vrednosti, ${a_{1} + a_{2} + … + a_{n}|{1|a_{1}} + {1|a_{2}} + … + {1|a_{n}}}$?',
      ['$2020$', '$√{2020}$', '$1$', '$12$'],
      [
        'Delioci dolaze u parovima: ako je $a$ delilac, onda je i ${2020|a}$ delilac. Zato je skup $\\{a_{1}, …, a_{n}\\}$ isti kao skup $\\{{2020|a_{1}}, …, {2020|a_{n}}\\}$.',
        K('Zbir delilaca zato možemo napisati kao ${2020|a_{1}} + … + {2020|a_{n}} = 2020 · ({1|a_{1}} + … + {1|a_{n}})$.', [], C.tabela([['a', 1, 2, 4, 5, 10, 20], ['2020 : a', 2020, 1010, 505, 404, 202, 101]])),
        'Količnik je tačno $2020$ (važi za svaki broj $N$: količnik je $N$).',
      ]);
    Z(6, 4, 3,
      'Na stranici $AB$ trougla $ABC$ (koji nije pravougli) date su tačke $M, N, P, Q$ (tim redom od $A$ ka $B$) tako da $CM, CN, CP, CQ$ dele ugao $ACB$ na pet jednakih delova. Uglovi trougla $CMN$ jednaki su uglovima trougla $ABC$. Koliki su uglovi trougla $ABC$?',
      ['$22° 30\'$, $45°$, $112° 30\'$', '$18°$, $72°$, $90°$', '$30°$, $45°$, $105°$', '$20°$, $40°$, $120°$'],
      [
        'Neka je svaki od pet delova ugla $C$ jednak $φ$; ugao $∡MCN = φ$ mora biti jednak nekom uglu trougla $ABC$.',
        '1) Ako je $∡ABC = φ$: spoljašnji ugao $∡MNC$ trougla $NBC$ je $4φ$ – to bi bio ugao $A$; $φ + 4φ + 5φ = 180°$ daje $φ = 18°$ i $∡C = 90°$ – trougao bi bio pravougli. Otpada.',
        '2) Ako je $∡BAC = φ$: spoljašnji ugao $∡CMN$ trougla $AMC$ je $2φ$ – to je ugao $B$. Iz $φ + 2φ + 5φ = 180°$: $φ = 22° 30\'$.',
        K('Uglovi: $∡A = 22° 30\'$, $∡B = 45°$, $∡C = 112° 30\'$.', [], G({ A: [0, 0, 225], B: [8, 0, -45], C: [5.657, 2.343, 90], M: [3.314, 0, -90], N: [4.686, 0, -90], P: [5.657, 0, -90], Q: [6.627, 0, -90] },
          [{ p: 'ABC' }, { d: 'CM' }, { d: 'CN' }, { d: 'CP' }, { d: 'CQ' }, { p: 'CMN', b: 1 }, { u: 'BAC', o: 'φ' }, { u: 'CBA', o: '2φ' }])),
      ]);
    D(6, 5, 3,
      'Trouglovi $ABC$ i $A_{1}B_{1}C_{1}$ su jednakokrako-pravougli sa hipotenuzama $AB$ i $A_{1}B_{1}$, pri čemu je tačka $A_{1}$ na duži $AC$, $B_{1}$ na duži $AB$ i $C_{1}$ na duži $BC$. Dokaži da je $AA_{1} = 2CC_{1}$.',
      [
        'Neka je $D$ podnožje normale iz $B_{1}$ na $BC$ i $CC_{1} = x$.',
        K('Trouglovi $CA_{1}C_{1}$ i $DC_{1}B_{1}$ su podudarni (pravougli, hipotenuze $C_{1}A_{1} = C_{1}B_{1}$, i jednaki uglovi jer je $∡A_{1}C_{1}B_{1} = 90°$): $DB_{1} = CC_{1} = x$ i $CA_{1} = DC_{1}$.', ['t1', 't2']),
        'Trougao $DB_{1}B$ je jednakokrako-pravougli (ugao $45°$ kod $B$), pa je $DB = DB_{1} = x$.',
        '$AA_{1} = AC − CA_{1} = BC − DC_{1} = DB + CC_{1} = 2x$. Dakle $AA_{1} = 2CC_{1}$.',
      ],
      G({ C: [0, 0, 225], A: [4, 0, -45], B: [0, 4, 135], A1: [1, 0, -90], B1: [1.5, 2.5, 45], C1: [0, 1.5, 180], D: [0, 2.5, 180] },
        [{ p: 'ABC' }, { pu: 'ACB' }, { p: 'A1B1C1', b: 1 }, { pu: 'A1C1B1' }, { d: 'B1D', isp: 1, k: 1 }, { p: 'CA1C1', id: 't1', b: 2, k: 2 }, { p: 'DC1B1', id: 't2', b: 4, k: 2 }]));

    // ───────── VII razred ─────────
    D(7, 1, 2,
      'U pravougaoniku $ABCD$ je $AB = √2 cm$ i $BC = 1 cm$. Tačka $M$ je središte duži $AB$, a $E$ presek dijagonale $AC$ i duži $DM$. Dokaži da je ugao $CED$ prav.',
      [
        'Pitagora: $AC = √{2 + 1} = √3$, $DM = √{1 + {1|2}} = {√6|2}$.',
        K('Neka je $S$ presek dijagonala. $DM$ i $AS$ su težišne duži trougla $ABD$, pa je $E$ njegovo težište.', ['t']),
        'Težište deli težišne duži u odnosu $2 : 1$: $DE = {2|3}DM = {√6|3}$, $AE = {2|3}AS = {1|3}AC = {√3|3}$.',
        '$AE² + DE² = {3|9} + {6|9} = 1 = AD²$ – po obrnutoj Pitagorinoj teoremi ugao $AED$ je prav, pa je i $∡CED = 90°$.',
      ],
      G({ A: [0, 0, 225], B: [1.414, 0, -45], C: [1.414, 1, 45], D: [0, 1, 135], M: [0.707, 0, -90], E: [0.471, 0.333, -60] },
        [{ p: 'ABCD' }, { d: 'AC' }, { d: 'DM' }, { tacka: 'E' }, { d: 'BD', isp: 1, k: 2 }, { p: 'ABD', id: 't', b: 4, k: 2, prazno: 1 }, { pu: 'CED', k: 4 }]));
    Z(7, 2, 2,
      'Razlomak ${100^{n} + 10^{n}|100^{n} + 4 · 10^{n}}$ ($n$ prirodan) svedi na oblik ${p|q}$ sa uzajamno prostim $p$ i $q$.',
      ['${10^{n} + 1|10^{n} + 4}$', '${1|4}$', '${10^{n}|10^{n} + 3}$', '${11|14}$'],
      [
        '$100^{n} = (10^{n})²$, pa je brojilac $10^{n}(10^{n} + 1)$, a imenilac $10^{n}(10^{n} + 4)$. Skratimo sa $10^{n}$.',
        'Da li ${10^{n} + 1|10^{n} + 4}$ može dalje da se skrati? Zajednički delilac $d$ deli i razliku $(10^{n} + 4) − (10^{n} + 1) = 3$, pa je $d = 1$ ili $d = 3$.',
        K('Brojevi $10^{n} + 1$ i $10^{n} + 4$ imaju zbir cifara $2$ i $5$ – nisu deljivi sa $3$. Zato je razlomak neskrativ: $p = 10^{n} + 1$, $q = 10^{n} + 4$.', [], C.tabela([['n', 1, 2, 3], ['p', 11, 101, 1001], ['q', 14, 104, 1004]])),
      ]);
    Z(7, 3, 2,
      'Na svakoj strani kocke napisan je prirodan broj. U svakom temenu napisan je proizvod tri broja sa strana koje se sustižu u tom temenu. Zbir osam proizvoda je $175$. Koliki je zbir brojeva na stranama kocke?',
      ['$17$', '$15$', '$19$', '$35$'],
      [
        'Neka su na suprotnim stranama $a$ i $b$, $c$ i $d$, $e$ i $f$. Temena: $ace, acf, ade, adf, bce, bcf, bde, bdf$.',
        'Njihov zbir se lepo rastavlja: $(a + b)(c + d)(e + f) = 175$.',
        K('Svaki činilac je bar $2$ (zbir dva prirodna broja). Jedino rastavljanje $175 = 5 · 5 · 7$ na tri činioca veća od $1$.', [], C.tabela([['a + b', 'c + d', 'e + f'], [5, 5, 7]], { zaglavlje: false })),
        'Zbir na stranama: $5 + 5 + 7 = 17$.',
      ]);
    Z(7, 4, 2,
      'Ako je ${1|a + 2019} + {1|b + 2019} + {1|c + 2019} = {3|2020}$, kolika je vrednost izraza ${a|a + 2019} + {b|b + 2019} + {c|c + 2019}$?',
      ['${3|2020}$', '$3$', '${6057|2020}$', '$1$'],
      [
        'Trik: ${a|a + 2019} = 1 − {2019|a + 2019}$. Isto za $b$ i $c$.',
        'Zbir: $3 − 2019 · ({1|a + 2019} + {1|b + 2019} + {1|c + 2019}) = 3 − 2019 · {3|2020}$.',
        '$= {3 · 2020 − 3 · 2019|2020} = {3|2020}$.',
      ]);
    D(7, 5, 3,
      'Svaka od $13$ pravih, od kojih nijedna nije paralelna stranicama kvadrata, deli kvadrat na dva četvorougla čije se površine odnose kao $3 : 5$. Dokaži da se neke četiri od tih pravih seku u jednoj tački.',
      [
        'Prava seče dve naspramne stranice i deli kvadrat na dva trapeza iste visine (stranice kvadrata).',
        'Površine trapeza jednake visine odnose se kao njihove srednje linije, pa prava deli srednju liniju kvadrata (onu koju seče) u odnosu $3 : 5$.',
        K('Kvadrat ima $2$ srednje linije, a na svakoj $2$ tačke koje je dele u odnosu $3 : 5$ – ukupno $4$ tačke, i svaka prava prolazi kroz jednu od njih.', [], G({}, [C.pr(0, 0, 8, 8, 0, { prazno: 1 }), { lin: [[0, 4], [8, 4]], isp: 1, b: 4 }, { lin: [[4, 0], [4, 8]], isp: 1, b: 4 }, ...[[3, 4], [5, 4], [4, 3], [4, 5]].map(([x, y]) => ({ tx: '●', at: [x, y - 0.1], b: 1 })), { lin: [[2, 0], [4, 8]], b: 2 }, { lin: [[4, 0], [2, 8]], b: 2 }])),
        'Dirihleov princip: $13 = 4 · 3 + 1$ pravih kroz $4$ tačke ⇒ kroz neku tačku prolaze bar $4$ prave.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 3,
      'Koje su poslednje dve cifre broja $7^{7^{7}}$?',
      ['$43$', '$07$', '$49$', '$01$'],
      [
        'Poslednje dve cifre su ostatak pri deljenju sa $100$. Stepeni sedmice: $7, 49, 343 → 43, 7^{4} = 2401 → 01$ – period je $4$.',
        K('Zato je važno samo koji ostatak daje izložilac $7^{7}$ pri deljenju sa $4$: $7 = 8 − 1$ daje „ostatak $−1$“, pa $7^{7}$ daje $(−1)^{7} = −1$, tj. ostatak $3$ pri deljenju sa $4$.', [], C.tabela([['k', 1, 2, 3, 4, 5], ['7ᵏ : 100', '07', 49, 43, '01', '07']], { istakni: [[1, 3]] })),
        'Dakle $7^{7^{7}} = 7^{4m + 3}$ ima iste poslednje dve cifre kao $7³ = 343$: $43$.',
      ]);
    Z(8, 2, 3,
      'Prirodni brojevi $x, y, z$ su takvi da je i ${y + x√2|z + y√2}$ prirodan broj. Kolika je najmanja moguća vrednost količnika ${x + z|y}$?',
      ['$2$', '$1$', '$√2$', '$3$'],
      [
        'Neka je ${y + x√2|z + y√2} = k$: $y + x√2 = kz + ky√2$, tj. $(y − kz) + (x − ky)√2 = 0$.',
        'Kako je $√2$ iracionalan, oba dela moraju biti $0$: $y = kz$ i $x = ky$. Odatle je $xz = ky · {y|k} = y²$.',
        'Nejednakost aritmetičke i geometrijske sredine: $x + z ≥ 2√{xz} = 2y$, pa je ${x + z|y} ≥ 2$.',
        'Jednakost za $x = z$ (tada $k = 1$, $x = y = z$): npr. $x = y = z = 1$. Najmanja vrednost je $2$.',
      ]);
    Z(8, 3, 3,
      'Trostrana piramida $ABCD$ ima ivice $AB = 5$, $AC = 3$, $BC = 4$, $BD = 4$, $AD = 3$ i $CD = {12|5}√2$ (u cm). Ravan kroz $AB$ normalna na $CD$ seče $CD$ u $M$; ravan kroz $CD$ normalna na $AB$ seče $AB$ u $N$. Kolika je duž $MN$?',
      ['${6√2|5} cm$', '${12|5} cm$', '${6|5} cm$', '${12√2|5} cm$'],
      [
        'Trouglovi $ABC$ i $ABD$ su pravougli ($3, 4, 5$) sa hipotenuzom $AB$, i podudarni.',
        'Trouglovi $ACD$ ($AC = AD = 3$) i $BCD$ ($BC = BD = 4$) su jednakokraki sa osnovicom $CD$; ravan kroz $AB$ normalna na $CD$ seče je u središtu $M$.',
        'Visine iz pravog ugla na hipotenuzu $AB$ u oba trougla padaju u istu tačku $N$ i jednake su: $CN = DN = {3 · 4|5} = {12|5}$.',
        'Trougao $CDN$ je jednakokrak, a $MN$ njegova visina: $MN = √{({12|5})² − ({6√2|5})²} = √{{144 − 72|25}} = {6√2|5} cm$.',
      ]);
    D(8, 4, 3,
      'Trougao $ABC$ ima tup ugao kod temena $A$, a $D$ je podnožje visine iz $A$. Kružnica sa centrom $D$ koja sadrži tačku $A$ seče prave $AB$ i $AC$ redom u tačkama $M$ i $N$. Dokaži da je $AB · AM = AC · AN$.',
      [
        'Neka je $E$ druga tačka preseka prave $AD$ sa kružnicom – $AE$ je prečnik.',
        'Ugao $AME$ je nad prečnikom – prav. Pravougli trouglovi $ABD$ i $AEM$ imaju zajednički oštar ugao kod $A$, pa su slični: ${AB|AE} = {AD|AM}$, tj. $AB · AM = AD · AE$.',
        'Isto iz sličnosti $ACD$ i $AEN$: $AC · AN = AD · AE$.',
        'Zato je $AB · AM = AC · AN$ (obe strane su jednake $AD · AE$).',
      ]);
    Z(8, 5, 3,
      'Za koje prirodne brojeve $n$ je moguće neke od brojeva $1, 2, …, n$ povećati za $1$, a sve ostale smanjiti za $1$, tako da im proizvod ostane nepromenjen?',
      ['za sve $n$ osim $1$ i $3$', 'samo za parne $n$', 'samo za $n ≥ 5$', 'za sve $n$'],
      [
        'Parni $n$: delimo na parove $(1, 2), (3, 4), …$; manji povećamo, veći smanjimo – svaki par se zameni istim parom obrnutim redom, proizvod se ne menja.',
        '$n = 1$: $1$ postaje $2$ ili $0$ – nemoguće. $n = 3$: proverom svih $8$ mogućnosti nijedna ne daje proizvod $6$.',
        K('$n = 5$: $1 + 1, 2 − 1, 3 − 1, 4 + 1, 5 + 1$ daje $2, 1, 2, 5, 6$ – proizvod $120 = 5!$ ✓.', [], C.tabela([['~broj', 1, 2, 3, 4, 5], ['~promena', '+1', '−1', '−1', '+1', '+1'], ['~novi', 2, 1, 2, 5, 6]])),
        'Neparni $n ≥ 5$: prvih pet kao gore, ostale u parove. Dakle moguće je za sve $n$ osim $1$ i $3$.',
      ]);
  },
};
