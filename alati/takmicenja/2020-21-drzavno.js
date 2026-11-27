// Državno takmičenje iz matematike učenika osnovnih škola, 16. 5. 2021. (DMS)
// https://dms.rs/wp-content/uploads/2021/05/Bilten-sajt.pdf (postavke), https://dms.rs/wp-content/uploads/2022/05/Resenja-drzavno-21.pdf
module.exports = {
  godina: '2020/21', nivo: 'drzavno', datum: '16. 5. 2021.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── VI razred ─────────
    D(6, 1, 2,
      'U raznostraničan trougao $ABC$ upisan je krug sa centrom $O$. Kroz $O$ su povučene prave $p ∥ AC$ i $q ∥ BC$; prava $p$ seče stranicu $AB$ u tački $M$, a prava $q$ u tački $N$. Dokaži da je obim trougla $OMN$ jednak dužini stranice $AB$.',
      [
        'Centar upisanog kruga leži na simetralama uglova, pa $AO$ polovi ugao $A$: $∡MAO = ∡CAO$.',
        K('Kako je $OM ∥ AC$, uglovi $∡AOM$ i $∡CAO$ su naizmenični – jednaki. Zato je $∡MAO = ∡AOM$, i trougao $AOM$ je jednakokrak: $AM = OM$.', ['t1']),
        K('Na isti način ($ON ∥ BC$, $BO$ simetrala) trougao $BON$ je jednakokrak: $BN = ON$.', ['t2']),
        'Obim: $OM + MN + NO = AM + MN + NB = AB$.',
      ],
      G({ A: [0, 0, 225], B: [8, 0, -45], C: [2.5, 5, 90], O: [3.079, 1.903, 90], M: [2.127, 0, -90], N: [5.171, 0, -90] },
        [{ p: 'ABC' }, { kr: 'O', r: 1.903, b: 4, isp: 1 }, { d: 'OM', b: 1 }, { d: 'ON', b: 1 }, { d: 'AO', isp: 1, k: 2 }, { d: 'BO', isp: 1, k: 3 }, { p: 'AOM', id: 't1', b: 2, k: 2 }, { p: 'BON', id: 't2', b: 3, k: 3 }]));
    Z(6, 2, 2,
      'a) Postoje li četiri različita prirodna broja takva da je zbir svaka tri od njih prost broj? b) Postoji li pet takvih brojeva?',
      ['a) da, b) ne', 'a) ne, b) ne', 'a) da, b) da', 'a) ne, b) da'],
      [
        'a) Da – npr. $1, 3, 7, 9$: zbirovi trojki su $11, 13, 17, 19$ – svi prosti.',
        'b) Gledamo ostatke pri deljenju sa $3$: svaki broj daje ostatak $0$, $1$ ili $2$.',
        K('Ako među pet brojeva postoje sva tri ostatka, ta tri broja imaju zbir deljiv sa $3$ ($0 + 1 + 2 = 3$). Ako ne postoje, brojevi imaju najviše dva ostatka, pa po Dirihleovom principu bar tri imaju isti ostatak – i njihov zbir je deljiv sa $3$.', [], C.tabela([['~ostaci tri broja', '0, 1, 2', '0, 0, 0', '1, 1, 1', '2, 2, 2'], ['~zbir : 3', 0, 0, 0, 0]])),
        'Zbir veći od $3$ deljiv sa $3$ nije prost (a zbir tri različita prirodna broja je bar $6$). Zato pet takvih brojeva ne postoji.',
      ]);
    D(6, 3, 2,
      'Zbir cifara prirodnog broja $n$ jednak je zbiru cifara broja $5n$. Dokaži da je $n$ deljiv sa $9$.',
      [
        'Svaki broj daje isti ostatak pri deljenju sa $9$ kao i zbir njegovih cifara.',
        'Ako $n$ i $5n$ imaju isti zbir cifara, onda daju isti ostatak pri deljenju sa $9$.',
        K('Uporedimo ostatke: ako $n$ daje ostatak $r ≠ 0$, $5n$ daje ostatak $5r$ (mod $9$) – a to se uvek razlikuje od $r$.', [], C.tabela([['~ostatak n', 1, 2, 3, 4, 5, 6, 7, 8], ['~ostatak 5n', 5, 1, 6, 2, 7, 3, 8, 4]])),
        'Zato je jedina mogućnost $r = 0$: $n$ je deljiv sa $9$. (Primer: $n = 18$: $5n = 90$, oba imaju zbir cifara $9$.)',
      ]);
    Z(6, 4, 3,
      'Koliko različitih rešenja ima brojevni rebus (ista slova – iste cifre, različita slova – različite cifre): $ABBCB + BCADA = DBDDD$?',
      ['$32$', '$16$', '$28$', '$36$'],
      [
        'Na mestu desetica hiljada: $A + B = D$ (nema prenosa, jer je rezultat petocifren i počinje sa $D$, a na mestu stotina hiljada nema ničega). Dakle $A + B ≤ 9$.',
        'Jedinice: $B + A = D$ – bez prenosa. Desetice: $C + D = D$, pa je $C = 0$ (ne može biti prenos iz jedinica). Stotine: $B + A = D$ ✓, hiljade: $B + C = B$ ✓.',
        'Uslovi: $C = 0$, $A, B ≥ 1$ (prve cifre), $A ≠ B$, $A + B = D$, i $D ≠ A, B, 0$ – to automatski važi.',
        K('Brojimo uređene parove $(A, B)$ sa $A ≠ B$ i $A + B = D ≤ 9$.', [], C.tabela([['D', 3, 4, 5, 6, 7, 8, 9], ['~parova (A, B)', 2, 2, 4, 4, 6, 6, 8]])),
        'Ukupno $2 + 2 + 4 + 4 + 6 + 6 + 8 = 32$ rešenja (npr. $A = 1$, $B = 2$, $D = 3$: $12202 + 20131 = 32333$).',
      ]);
    Z(6, 5, 3,
      'U trouglu $ABC$ je $∡BAC = 45°$. Tačka $M$ na stranici $AC$ je takva da je $MC = 2AM$ i $∡ABM = 15°$. Kolika je mera ugla $ACB$?',
      ['$75°$', '$60°$', '$70°$', '$80°$'],
      [
        K('Neka je $D$ podnožje normale iz $C$ na $MB$. U trouglu $ABM$: $∡AMB = 180° − 45° − 15° = 120°$, pa je $∡CMD = 60°$.', ['t1']),
        'Trougao $MCD$ je polovina jednakostraničnog: $DM = {MC|2} = AM$. Trougao $AMD$ je jednakokrak sa uglom $120°$ kod $M$, pa je $∡MAD = ∡MDA = 30°$.',
        'Kako je $∡MCD = 30° = ∡MAD$, trougao $ADC$ je jednakokrak: $AD = CD$. Takođe $∡DAB = 45° − 30° = 15° = ∡ABD$, pa je $AD = BD$.',
        K('Dakle $CD = BD$: pravougli trougao $BDC$ je jednakokrak, $∡DCB = 45°$.', ['t2']),
        '$∡ACB = ∡MCD + ∡DCB = 30° + 45° = 75°$.',
      ],
      G({ A: [0, 0, 225], B: [6, 0, -45], C: [3.804, 3.804, 90], M: [1.268, 1.268, 135], D: [3, 0.804, -60] },
        [{ p: 'ABC' }, { d: 'BM' }, { u: 'BAC', o: '45°' }, { u: 'MBA', o: '15°' }, { d: 'CD', isp: 1, k: 1 }, { pu: 'CDM', k: 1 }, { p: 'MCD', id: 't1', b: 2, k: 1 }, { d: 'AD', isp: 1, k: 2 }, { p: 'BDC', id: 't2', b: 4, k: 4 }]));

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'Koliki je ostatak pri deljenju broja $25 · 3^{2021}$ brojem $4 · 3^{2020}$?',
      ['$3^{2021}$', '$1$', '$3$', '$4 · 3^{2019}$'],
      [
        '$25 · 3^{2021} = 75 · 3^{2020}$. Delimo sa $4 · 3^{2020}$: $75 = 4 · 18 + 3$.',
        '$75 · 3^{2020} = 18 · (4 · 3^{2020}) + 3 · 3^{2020}$.',
        'Ostatak je $3 · 3^{2020} = 3^{2021}$ – i on je zaista manji od delioca $4 · 3^{2020}$.',
        'Pazi: ostatak nije $3$! Kod deljenja „velikih“ brojeva sa zajedničkim činiocem i ostatak se množi tim činiocem.',
      ]);
    Z(7, 2, 3,
      'Neka je $ABCDEF$ pravilni šestougao stranice $1 cm$, a $X$, $Y$, $Z$ središta stranica $AB$, $CD$, $EF$. Koliki su obim i površina šestougla koji je presek trouglova $ACE$ i $XYZ$?',
      ['$O = {9 + 3√3|4} cm$, $P = {15√3|32} cm²$', '$O = {9 + 3√3|4} cm$, $P = {3√3|8} cm²$', '$O = 3 cm$, $P = {15√3|32} cm²$', '$O = {9 + 3√3|4} cm$, $P = {9√3|16} cm²$'],
      [
        K('Trouglovi $ACE$ i $XYZ$ su jednakostranični; njihov presek je šestougao $MNPQRS$.', ['h']),
        'Duž $XY$ je srednja linija trapeza $ABCD$: $XY = {AD + BC|2} = {2 + 1|2} = {3|2}$. Površina trougla $XYZ$: ${(3/2)²√3|4} = {9√3|16}$.',
        'Od trougla $XYZ$ „odsecamo“ tri mala ugla (oko $X$, $Y$, $Z$). Kod $Y$: $YQ = {1|2}$ (srednja linija trougla $ECD$), $∡QYP = 60°$ i $YP = {1|4}$ – mali trougao ima stranice ${1|2}$ i ${1|4}$ sa uglom $60°$ između, površine ${1|2} · {1|2} · {1|4} · {√3|2} = {√3|32}$.',
        'Površina preseka: ${9√3|16} − 3 · {√3|32} = {18√3 − 3√3|32} = {15√3|32} cm²$. (Obim: ${9 + 3√3|4} cm$.)',
      ],
      G({ A: [-2, -3.464, 225], B: [2, -3.464, -45], C: [4, 0, 0], D: [2, 3.464, 45], E: [-2, 3.464, 135], F: [-4, 0, 180], X: [0, -3.464, -90], Y: [3, 1.732, 30], Z: [-3, 1.732, 150] },
        [{ p: 'ABCDEF', prazno: 1 }, { p: 'ACE', b: 1, prazno: 1 }, { p: 'XYZ', b: 2, prazno: 1 },
          { lin: [[-2, 0], [-0.5, -2.598], [1, -1.732], [2.5, 0.866], [1, 1.732], [-2, 1.732]], zatv: 1, b: 3, gusto: 1, id: 'h' }]));
    Z(7, 3, 1,
      'Za koje cele brojeve $n$ je broj $n³ − 2n² + 2n − 4$ prost?',
      ['samo $n = 3$', '$n = 3$ i $n = 1$', 'samo $n = 1$', 'ni za jedan'],
      [
        'Rastavimo grupisanjem: $n²(n − 2) + 2(n − 2) = (n² + 2)(n − 2)$.',
        'Proizvod je prost samo ako je jedan činilac $1$ (ili $−1$ uz negativan drugi – ali proizvod mora biti pozitivan prost). Kako je $n² + 2 ≥ 2$, mora $n − 2 = 1$, tj. $n = 3$.',
        K('Za $n = 3$: $(9 + 2) · 1 = 11$ – prost ✓. (Za $n = 1$: $3 · (−1) = −3$ – negativan, nije prost.)', [], C.tabela([['n', 0, 1, 2, 3, 4], ['(n² + 2)(n − 2)', '−4', '−3', 0, 11, 36]], { istakni: [[1, 4]] })),
      ]);
    Z(7, 4, 2,
      'Da li se prirodni brojevi od $1$ do $15$ mogu podeliti u skupove $A$ (dva broja) i $B$ (trinaest brojeva) tako da zbir brojeva iz $B$ bude jednak proizvodu brojeva iz $A$?',
      ['Ne', 'Da, $A = \\{10, 10\\}$', 'Da, $A = \\{7, 13\\}$', 'Da, na tačno jedan način'],
      [
        'Zbir svih brojeva od $1$ do $15$ je $120$. Ako su $x < y$ u skupu $A$, zbir skupa $B$ je $120 − x − y$.',
        'Uslov: $xy = 120 − x − y$, tj. $xy + x + y + 1 = 121$, odnosno $(x + 1)(y + 1) = 121 = 11²$.',
        K('Rastavljanja broja $121$: $1 · 121$ (tada $x = 0$ – nije prirodan) ili $11 · 11$ (tada $x = y = 10$ – nisu različiti).', [], C.tabela([['(x+1)(y+1)', '1 · 121', '11 · 11'], ['x, y', '0, 120', '10, 10'], ['~moguće?', '~ne', '~ne']])),
        'Podela ne postoji.',
      ]);
    Z(7, 5, 3,
      'Stranice trougla $ABC$ su $AB = 125 cm$, $AC = 117 cm$, $BC = 120 cm$. Simetrala ugla $A$ seče $BC$ u $L$, simetrala ugla $B$ seče $AC$ u $K$. Neka su $M$ i $N$ podnožja normala iz $C$ na $BK$ i $AL$. Kolika je duž $MN$?',
      ['$56 cm$', '$58,5 cm$', '$60 cm$', '$62,5 cm$'],
      [
        K('Produžimo $CM$ i $CN$ do preseka sa $AB$ u tačkama $P$ i $Q$.', ['pq']),
        '$BM$ je simetrala ugla $B$ i normalna na $CP$, pa je trougao $CBP$ jednakokrak ($BP = BC = 120$) i $M$ je središte $CP$. Slično, $AQ = AC = 117$ i $N$ je središte $CQ$.',
        '$PQ = BP + AQ − AB = 120 + 117 − 125 = 112 cm$.',
        '$MN$ je srednja linija trougla $PQC$: $MN = {PQ|2} = 56 cm$.',
      ],
      G({ A: [0, 0, 225], B: [125, 0, -45], C: [59.656, 100.65, 90], L: [91.248, 51.988, 0], K: [30.437, 51.352, 180], M: [32.327, 50.325, -30], N: [88.329, 50.325, 210], P: [5, 0, -90], Q: [117, 0, -90] },
        [{ p: 'ABC' }, { d: 'AL', isp: 1 }, { d: 'BK', isp: 1 }, { d: 'CP', b: 1, k: 1, id: 'pq' }, { d: 'CQ', b: 1, k: 1 }, { d: 'MN', b: 2 }, { tacka: 'M' }, { tacka: 'N' }]));

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Uglovi na većoj osnovici trapeza su po $60°$, a obim je $200 cm$. Kolika treba da bude veća osnovica da bi površina trapeza bila najveća?',
      ['$75 cm$', '$50 cm$', '$100 cm$', '$66{2|3} cm$'],
      [
        'Trapez je jednakokrak sa kracima $c$; zbog uglova od $60°$ projekcija svakog kraka na osnovicu je ${c|2}$, pa je $a = b + c$ ($b$ manja osnovica). Visina $h = {c√3|2}$.',
        'Obim: $a + b + 2c = 2b + 3c = 200$, pa je $b = {200 − 3c|2}$.',
        'Površina: $P = {a + b|2} · h = {2b + c|2} · {c√3|2} = (100 − c) · {c√3|2}$.',
        K('$c(100 − c) = 2500 − (c − 50)²$ je najveće za $c = 50$. Tada $b = 25$, a $a = 75 cm$ (i $P = 1250√3 cm²$).', [], G({ A: [0, 0, 225], B: [75, 0, -45], C: [50, 43.3, 45], D: [25, 43.3, 135] }, [{ p: 'ABCD' }, { u: 'BAD'.split('').reverse().join(''), o: '60°' }, { u: 'CBA', o: '60°' }, { d: 'AB', o: '75' }, { d: 'DC', o: '25' }, { d: 'AD', o: '50' }])),
      ]);
    Z(8, 2, 3,
      'Pravilna šestostrana prizma ima osnovnu ivicu $1 cm$ i visinu $2 cm$. Koliko ima trouglova čija su temena temena prizme, a sve stranice različite dužine?',
      ['$168$', '$220$', '$172$', '$156$'],
      [
        'Prizma ima $12$ temena; trojki ima ${12 · 11 · 10|6} = 220$. (Nikoje tri nisu kolinearne.)',
        K('Od nekog temena $A$ ostala temena su udaljena: $1, 1, √3, √3, 2, 2, √5, √5, √7, √7, 2√2$ – vrednosti se ponavljaju u parovima.', [], C.tabela([['~rastojanje', 1, '√3', 2, '√5', '√7', '2√2'], ['~temena', 2, 2, 2, 2, 2, 1]])),
        'Jednakokraki trougao sa vrhom $A$ nastaje od dva temena jednako udaljena od $A$. Proverom se dobija: svako teme je vrh tačno $4$ jednakokraka trougla koji nisu jednakostranični, i teme jednog jednakostraničnog trougla (stranice $√3$, temena svako drugo teme osnove).',
        'Trouglova sa bar dve jednake stranice: $12 · 4 + 4 = 52$ (jednakostraničnih ima $4$: po dva u svakoj osnovi).',
        'Raznostranih: $220 − 52 = 168$.',
      ]);
    Z(8, 3, 3,
      'Za koje trojke prostih brojeva $(a, b, c)$, do na redosled, važi $abc < ab + bc + ca$?',
      ['$\\{2, 2, p\\}$ za svaki prost $p$, $\\{2, 3, 3\\}$ i $\\{2, 3, 5\\}$', 'samo $\\{2, 2, 2\\}$ i $\\{2, 3, 5\\}$', '$\\{2, 3, p\\}$ za svaki prost $p$', 'samo $\\{2, 2, p\\}$'],
      [
        'Neka je $a ≤ b ≤ c$. Ako je $a ≥ 3$, onda $ab + bc + ca ≤ 3bc ≤ abc$ – nemoguće. Zato je $a = 2$.',
        'Nejednakost postaje $2bc < 2b + bc + 2c$, tj. deljenjem sa $2bc$: ${1|b} + {1|c} > {1|2}$.',
        'Ako je $b ≥ 5$, onda ${1|b} + {1|c} ≤ {2|5} < {1|2}$. Dakle $b = 2$ ili $b = 3$.',
        K('$b = 2$: ${1|2} + {1|c} > {1|2}$ – važi za svaki prost $c$. $b = 3$: ${1|c} > {1|6}$, tj. $c < 6$: $c = 3$ ili $c = 5$.', [], C.tabela([['b', 2, 3, 3], ['c', '~bilo koji prost', 3, 5], ['abc', '4c', 18, 30], ['ab + bc + ca', '4 + 4c', 21, 31]])),
        'Rešenja (do na redosled): $\\{2, 2, p\\}$, $\\{2, 3, 3\\}$, $\\{2, 3, 5\\}$.',
      ]);
    D(8, 4, 3,
      'Tačke $A$ i $B$ su na kružnici $k_{1}(C, r)$ i nisu dijametralno suprotne. Prava $p$ sadrži $C$ i paralelna je sa $AB$, a prava $q$ sadrži $A$ i paralelna je sa $BC$. Neka je $D$ presečna tačka prave $q$ i kružnice $k_{2}(A, AB)$. Dokaži da se prave $p$ i $DB$ seku na kružnici $k_{1}$.',
      [
        'Neka je $F$ presek pravih $p$ i $DB$.',
        'Trouglovi $ABD$ i $CFB$ imaju međusobno paralelne stranice ($AB ∥ CF$, $AD ∥ CB$, a $DB$ je zajednička prava), pa su slični.',
        'Trougao $ABD$ je jednakokrak ($AB = AD$, poluprečnici $k_{2}$), pa je i trougao $CFB$ jednakokrak: $CF = CB = r$.',
        'Dakle $F$ je na rastojanju $r$ od $C$ – na kružnici $k_{1}$. (Isto važi i za drugi presek $q$ sa $k_{2}$.)',
      ]);
    Z(8, 5, 3,
      'Da li postoje cifre $a$ i $b$ ($a ≠ 0$) takve da je dvanaestocifreni broj $abbaabbaabba$ kvadrat prirodnog broja?',
      ['Ne postoje', 'Da, $a = 1$, $b = 0$', 'Da, za $a = b$', 'Da, tačno jedan par'],
      [
        'Broj je četvorocifreni blok $abba$ ponovljen tri puta: $abbaabbaabba = abba · 100010001$.',
        K('$100010001 = 3 · 7 · 13 · 37 · 9901$: deljiv je sa $3, 7, 13, 37$, ali nijednim od njihovih kvadrata.', [], C.tabela([['~prost', 3, 7, 13, 37, 9901], ['~u 100010001', '¹', '¹', '¹', '¹', '¹']])),
        'Da bi proizvod bio potpun kvadrat, svaki prost činilac mora imati paran izložilac – zato $abba$ mora biti deljiv sa $3 · 7 · 13 · 37 = 10101$.',
        'Ali $abba$ je četvorocifren, a $10101$ je petocifren – nemoguće. Takve cifre ne postoje.',
      ]);
  },
};
