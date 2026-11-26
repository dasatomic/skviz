// Državno takmičenje iz matematike učenika osnovnih škola, 14. 5. 2022. (DMS)
// https://dms.rs/wp-content/uploads/2022/05/Drzavno-2022-zadaci-i-resenja.pdf
module.exports = {
  godina: '2021/22', nivo: 'drzavno', datum: '14. 5. 2022.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Prodavac ima ukupno $227$ komada jabuka, krušaka i mandarina. Prvi kupac je kupio ${2|3}$ svih jabuka, ${3|10}$ svih krušaka i ${5|7}$ svih mandarina. Drugi kupac je kupio ${1|11}$ svih jabuka, ${1|4}$ svih krušaka i ${1|5}$ svih mandarina. Koliko je jabuka, krušaka i mandarina prodavac imao pre kupovine?',
      ['$132$ jabuke, $60$ krušaka, $35$ mandarina', '$99$ jabuka, $80$ krušaka, $48$ mandarina', '$132$ jabuke, $40$ krušaka, $55$ mandarina', '$165$ jabuka, $20$ krušaka, $42$ mandarina'],
      [
        'Kupuje se ceo broj komada, pa broj jabuka $x$ mora biti deljiv sa $3$ i sa $11$, tj. sa $33$; broj krušaka $y$ sa $10$ i $4$, tj. sa $20$; broj mandarina $z$ sa $7$ i $5$, tj. sa $35$.',
        'Neka je $x = 33a$, $y = 20b$, $z = 35c$: $33a + 20b + 35c = 227$.',
        '$20b$ se završava nulom, $35c$ sa $0$ ili $5$. Ako se $35c$ završava nulom, $33a$ bi se završavao sa $7$, tj. $a$ sa $9$ – ali već $33 · 9 > 227$. Zato se $35c$ završava sa $5$, $33a$ sa $2$, $a$ sa $4$: $a = 4$.',
        'Tada $20b + 35c = 95$, tj. $4b + 7c = 19$: jedino $b = 3$, $c = 1$.',
        K('Prodavac je imao $132$ jabuke, $60$ krušaka i $35$ mandarina.', [], C.tabela([['', '~jabuke', '~kruške', '~mandarine'], ['~ukupno', 132, 60, 35], ['~1. kupac', '⅔ → 88', '³⁄₁₀ → 18', '⁵⁄₇ → 25'], ['~2. kupac', '¹⁄₁₁ → 12', '¼ → 15', '⅕ → 7']])),
      ]);
    D(6, 2, 2,
      'Dokaži da je ${1|3 · 6} + {1|6 · 9} + {1|9 · 12} + … + {1|2019 · 2022} < {1|9}$.',
      [
        'Izvucimo ${1|9}$: ${1|3k · 3(k + 1)} = {1|9} · {1|k(k + 1)}$, pa je zbir ${1|9}({1|1 · 2} + {1|2 · 3} + … + {1|673 · 674})$.',
        'Ključni trik: ${1|k(k + 1)} = {1|k} − {1|k + 1}$ (proveri: ${k + 1 − k|k(k + 1)}$).',
        K('Zbir u zagradi je „teleskopski“: $(1 − {1|2}) + ({1|2} − {1|3}) + … + ({1|673} − {1|674}) = 1 − {1|674}$.', [], C.tabela([['k', 1, 2, 3, '…', 673], ['1/k − 1/(k+1)', '1 − ½', '½ − ⅓', '⅓ − ¼', '…', '1/673 − 1/674']])),
        'Zbir je ${1|9} · {673|674} = {673|6066}$, i to je manje od ${1|9}$ jer je ${673|674} < 1$.',
      ]);
    Z(6, 3, 2,
      'U trouglu $ABC$ je $∡B = 80°$. Tačka $D$ na stranici $BC$ je takva da je $∡BDA = 70°$ i $AB + BD = AC$. Kolika je mera ugla $ACB$?',
      ['$40°$', '$30°$', '$50°$', '$35°$'],
      [
        'Iz trougla $ABD$: $∡BAD = 180° − 80° − 70° = 30°$.',
        K('Neka je $E$ tačka prave $CB$, iza $B$ (raspored $C − B − E$), sa $BE = BA$. Trougao $ABE$ je jednakokrak, a spoljašnji ugao kod $B$ je $80°$, pa je $∡BAE = ∡BEA = 40°$.', ['t1']),
        '$∡EAD = 40° + 30° = 70° = ∡EDA$, pa je i trougao $AED$ jednakokrak: $EA = ED$.',
        K('$ED = EB + BD = AB + BD = AC$. Dakle $AE = AC$ – trougao $AEC$ je jednakokrak, pa je $∡ACB = ∡AEC = 40°$.', ['t2']),
      ],
      G({ B: [0, 0, -90], C: [6, 0, -45], A: [0.773, 4.385, 90], D: [2.37, 0, -90], E: [-4.453, 0, 225] },
        [{ p: 'ABC' }, { d: 'AD' }, { u: 'ABD'.split('').reverse().join(''), o: '80°' }, { u: 'BDA'.split('').reverse().join(''), o: '70°' }, { d: 'EB', isp: 1, k: 2 }, { p: 'ABE', id: 't1', b: 2, k: 2 }, { p: 'AEC', id: 't2', b: 4, k: 4 }]));
    Z(6, 4, 3,
      'Data su četiri prirodna broja. Sve nenegativne razlike ovih brojeva uzimaju samo vrednosti $0, 2, 3, 5$. Zbir dva veća broja je tri puta veći od zbira dva manja. Koji su to brojevi?',
      ['$2, 2, 5, 7$ ili $1, 3, 6, 6$', 'samo $2, 2, 5, 7$', 'samo $1, 3, 6, 6$', '$1, 3, 4, 6$'],
      [
        'Neka su brojevi $a ≤ b ≤ c ≤ d$. Najveća razlika je $d − a = 5$. Neke razlike su $0$, pa su neka dva broja jednaka.',
        'Slučaj $a = b < c < d$: $d = a + 5$, a $3(a + b) = c + d$ daje $6a = c + a + 5$, tj. $c − a = 4a − 5$. Razlika $c − a$ mora biti $2$ ili $3$, pa je $4a = 7$ ili $8$ – samo $a = 2$, $c = 5$, $d = 7$: brojevi $2, 2, 5, 7$ (razlike $0, 3, 5, 2$ ✓).',
        'Slučaj $b = c$: $3(a + b) = a + b + 5$ – nemoguće ($a + b$ bi bio $2,5$).',
        'Slučaj $c = d$: $3(a + b) = 2(a + 5)$, tj. $4b = (b − a) + 10$ ⇒ $b − a = 2$, $b = 3$, $a = 1$: brojevi $1, 3, 6, 6$ (razlike $2, 5, 3, 0$ ✓).',
        K('Dva rešenja: $2, 2, 5, 7$ i $1, 3, 6, 6$.', [], C.brojevna(0, 8, [[2, '2, 2', 1], [5, '5', 1], [7, '7', 1], [1, '1', 2], [3, '3', 2], [6, '6, 6', 2]], { podela: 1, svaki: 1 })),
      ]);
    D(6, 5, 3,
      'U trouglu $ABC$ važi $BC = 2AC$. Tačka $D$ na stranici $BC$ je takva da je $∡CAD = ∡ABC$. Simetrala spoljašnjeg ugla kod temena $C$ seče polupravu $AD$ u tački $E$. Dokaži da je $AE = AB$.',
      [
        'Neka je $M$ središte $BC$: tada je $CM = MB = AC$, pa je trougao $ACM$ jednakokrak.',
        'Neka je $∡ACB = γ$. U jednakokrakom $ACM$: $∡AMC = ∡CAM = 90° − {γ|2}$, pa je $∡AMB = 90° + {γ|2}$.',
        'Spoljašnji ugao kod $C$ je $180° − γ$, a simetrala ga polovi: $∡ACE = γ + {180° − γ|2} = 90° + {γ|2} = ∡AMB$.',
        'Trouglovi $ACE$ i $BMA$: $AC = BM$, $∡ACE = ∡BMA$ i $∡CAE = ∡CAD = ∡ABC = ∡MBA$. Podudarni su (USU), pa je $AE = BA$.',
      ]);

    // ───────── VII razred ─────────
    D(7, 1, 2,
      'Cifra desetica kvadrata nekog prirodnog broja je neparna. Dokaži da je cifra jedinica tog kvadrata jednaka $6$.',
      [
        'Neka je $n = 10y + x$ ($x$ cifra jedinica). Tada $n² = 100y² + 20xy + x²$.',
        '$100y²$ ne utiče na poslednje dve cifre, a $20xy$ doprinosi parnu cifru deseticama. Zato je cifra desetica od $n²$ neparna tačno kad je neparna cifra desetica od $x²$.',
        K('Kvadrati cifara: $0, 1, 4, 9, 16, 25, 36, 49, 64, 81$ – neparna desetica samo kod $16$ ($x = 4$) i $36$ ($x = 6$).', [], C.tabela([['x', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ['x²', '00', '01', '04', '09', 16, 25, 36, 49, 64, 81]], { istakni: [[1, 5], [1, 7]] })),
        'U oba slučaja $x²$ se završava sa $6$, pa i $n²$. (Primer: $14² = 196$, $16² = 256$.)',
      ]);
    Z(7, 2, 3,
      'U trapez $ABCD$ upisana je kružnica koja dužu osnovicu $AB$ dodiruje u tački $G$, tako da je $AG = 15 cm$ i $BG = 10 cm$, a kraća osnovica je $CD = 8 cm$. Kolika je površina trapeza?',
      ['$132√3 cm²$', '$132 cm²$', '$66√3 cm²$', '$264 cm²$'],
      [
        'Tangentne duži iz iste tačke su jednake. Neka kružnica dodiruje $AD$, $CD$, $BC$ u $E$, $J$, $I$ i neka je $DJ = x$. Tada: $DE = x$, $CJ = CI = 8 − x$, $AE = AG = 15$, $BI = BG = 10$.',
        K('Kraci: $DA = x + 15$, $CB = 18 − x$. Neka su $DF$ i $CH$ visine: $AF = 15 − x$, $BH = 10 − (8 − x) = 2 + x$.', ['h']),
        'Visine su jednake: $DA² − AF² = CB² − BH²$: $(15 + x)² − (15 − x)² = (18 − x)² − (2 + x)²$, tj. $60x = 20 · (16 − 2x)$, pa je $x = {16|5} = 3,2$.',
        'Visina: $h² = 60x = 192$, $h = 8√3 cm$ (to je i prečnik upisane kružnice).',
        'Površina: ${25 + 8|2} · 8√3 = 132√3 cm²$.',
      ],
      G({ A: [0, 0, 225], B: [25, 0, -45], C: [19.8, 13.856, 45], D: [11.8, 13.856, 135], G: [15, 0, -90], O: [15, 6.928, 0], F: [11.8, 0, -90] },
        [{ p: 'ABCD' }, { kr: 'O', r: 6.928, b: 1 }, { tacka: 'G' }, { d: 'DF', id: 'h', isp: 1, k: 2 }, { pu: 'DFB', k: 2 }], { bezImena: ['O'] }));
    Z(7, 3, 2,
      'Koliko parova celih brojeva $(m, n)$ zadovoljava $3(m² + n²) − 7(m + n) = −4$?',
      ['$3$', '$2$', '$4$', '$1$'],
      [
        'Pomnožimo sa $12$ i dopunimo do kvadrata: $36m² − 84m + 36n² − 84n = −48$, tj. $(6m − 7)² + (6n − 7)² = 49 + 49 − 48 = 50$.',
        '$50$ kao zbir dva kvadrata: $1 + 49$, $49 + 1$, $25 + 25$.',
        K('$6m − 7 ∈ \\{±1\\}$ i $6n − 7 ∈ \\{±7\\}$: celo rešenje samo $m = 1$ ($6 − 7 = −1$) i $n = 0$ ($−7$). Simetrično $(0, 1)$. Za $±5$: $6m − 7 = 5$ daje $m = 2$, pa $(2, 2)$.', [], C.tabela([['m', 1, 0, 2], ['n', 0, 1, 2], ['6m − 7', '−1', '−7', 5], ['6n − 7', '−7', '−1', 5]])),
        'Tri rešenja: $(1, 0)$, $(0, 1)$, $(2, 2)$.',
      ]);
    D(7, 4, 3,
      'U unutrašnjosti pravilnog šestougla stranice $2 cm$ date su $193$ tačke, od kojih nikoje tri nisu kolinearne, obojene u $4$ boje. Dokaži da postoje tri istobojne tačke koje su temena trougla površine ne veće od ${√3|4} cm²$.',
      [
        'Dirihleov princip: $193 = 4 · 48 + 1$, pa neka boja ima bar $49$ tačaka.',
        K('Podelimo šestougao na $6$ jednakostraničnih trouglova stranice $2$, a svaki od njih na $4$ trougla stranice $1$ – ukupno $24$ mala trougla.', [], (() => {
          const v = Array.from({ length: 6 }, (_, i) => C.naKrugu([0, 0], 2, 60 * i));
          const e = [{ lin: v, zatv: 1, b: 0, prazno: 1 }];
          for (let i = 0; i < 6; i++) {
            const a = v[i], b = v[(i + 1) % 6];
            const m1 = [a[0] / 2, a[1] / 2], m2 = [b[0] / 2, b[1] / 2], m3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
            e.push({ lin: [[0, 0], a], b: 4 }, { lin: [m1, m2, m3], zatv: 1, b: 4, prazno: 1 });
          }
          e.push({ lin: [[0, 0], [v[0][0] / 2, v[0][1] / 2], [v[1][0] / 2, v[1][1] / 2]], zatv: 1, b: 1, gusto: 1 });
          return G({}, e);
        })()),
        '$49 = 24 · 2 + 1$, pa u nekom malom trouglu leže bar $3$ tačke te boje.',
        'Trougao sa temenima u tim tačkama leži u malom trouglu, pa mu je površina najviše ${1²√3|4} = {√3|4} cm²$.',
      ]);
    D(7, 5, 3,
      'U unutrašnjosti jednakokrakog trougla $ABC$ ($AC = BC$) data je tačka $M$ takva da je $∡AMB = 2∡ACB$. Na duži $AM$ je tačka $N$ takva da je $∡CNM = ∡ACB$. Dokaži da je $CN = BM + MN$.',
      [
        'Neka je $K$ presek prave $BM$ i duži $CN$, a $γ = ∡ACB$.',
        'Ugao $NMB$ (uporedan sa $∡AMB = 2γ$) je spoljašnji ugao trougla $KMN$: iz $∡KNM = γ$ sledi $∡NKM = γ$, pa je trougao $KMN$ jednakokrak: $MN = MK$.',
        'Neka je $∡BCK = x$; iz uglova se dobija $∡CAN = x$. Trouglovi $BCK$ i $CAN$ imaju $BC = CA$, $∡BCK = ∡CAN$ i $∡CKB = ∡ANC$, pa su podudarni (USU).',
        'Zato je $CN = BK = BM + MK = BM + MN$.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Realni brojevi $x, y, z$ (različiti od $0$) zadovoljavaju $x + y + z = 2025$ i $xy + yz + zx = xyz$. Kolika je vrednost izraza ${x + y|z} + {y + z|x} + {z + x|y}$?',
      ['$2022$', '$2025$', '$2028$', '$6075$'],
      [
        'Zajednički imenilac $xyz$: brojilac je $xy(x + y) + yz(y + z) + zx(z + x)$.',
        'Zamenimo $x + y = 2025 − z$ itd.: $xy(2025 − z) + yz(2025 − x) + zx(2025 − y) = 2025(xy + yz + zx) − 3xyz$.',
        'Iz uslova $xy + yz + zx = xyz$: brojilac je $2025xyz − 3xyz = 2022xyz$.',
        'Vrednost: ${2022xyz|xyz} = 2022$.',
      ]);
    Z(8, 2, 2,
      'Koje ostatke pri deljenju sa $11$ daju brojevi oblika $n^{5}$ ($n$ prirodan)?',
      ['$0$, $1$ i $10$', '$0$ i $1$', 'svih $11$ ostataka', '$0$, $1$, $5$ i $10$'],
      [
        K('Zgodno je raditi sa ostacima od $−5$ do $5$: $(±1)^{5} = ±1$, $(±2)^{5} = ±32 ≡ ∓1$, $(±3)^{5} = ±243 ≡ ±1$, $(±4)^{5} = ±1024 ≡ ±1$, $(±5)^{5} = ±3125 ≡ ±1$.', [], C.tabela([['~ostatak n', '−5', '−4', '−3', '−2', '−1', 0, 1, 2, 3, 4, 5], ['~ostatak n⁵', '−1', '−1', '−1', 1, '−1', 0, 1, '−1', 1, 1, 1]])),
        'Dakle $n^{5}$ daje ostatak $0$, $1$ ili $−1$, tj. $10$.',
        'Deo b): $x^{5} + y^{5} + z^{5}$ daje ostatak od $−3$ do $3$, a broj $20222022$ daje ostatak $4$ pri deljenju sa $11$ – zato jednačina $x^{5} + y^{5} + z^{5} = 20222022$ nema rešenja u prirodnim brojevima.',
      ]);
    Z(8, 3, 3,
      'Data je pravilna trostrana prizma $ABCA\'B\'C\'$. Tačka $D$ na ivici $AA\'$ deli je u odnosu $AD : DA\' = 4 : 1$. Tačke $E$ i $F$ su simetrične temenima $B\'$ i $C\'$ u odnosu na pravu $BC$. U kom odnosu ravan $DEF$ deli zapreminu prizme?',
      ['$64 : 1151$', '$16 : 1199$', '$1 : 9$', '$64 : 1215$'],
      [
        'Neka je ivica $a$, visina $H$; zapremina prizme ${a²√3|4} H$. Ravan $DEF$ seče prizmu u trostranoj piramidi $DAMN$ ($M$ na $AB$, $N$ na $AC$).',
        'Neka je $K$ simetrična $A\'$ u odnosu na $A$ (ispod osnove): $KA = H$, a trougao $KEF$ je podudaran trouglu $ABC$ (pomeren za $H$ nadole).',
        'Trouglovi $DKE$ i $DAM$ su slični: ${AM|KE} = {AD|KD} = {{4|5}H|{9|5}H} = {4|9}$, pa je stranica jednakostraničnog trougla $AMN$: ${4|9}a$.',
        'Zapremina piramide: $V_{1} = {1|3} · {(4a/9)²√3|4} · {4H|5} = {64|1215} · {a²√3|4}H$.',
        'Ostatak: $(1 − {64|1215})V = {1151|1215}V$. Odnos $V_{1} : V_{2} = 64 : 1151$.',
      ]);
    Z(8, 4, 2,
      'Date su tačke $A(0, 4)$ i $B(−1, 5)$. Na pravoj $y = −x$ odredi tačku $P$ tako da zbir $AP + BP$ bude najmanji.',
      ['$P(−{5|2}, {5|2})$', '$P(−2, 2)$', '$P(−{1|2}, {1|2})$', '$P(−{4|3}, {4|3})$'],
      [
        'Tačke $A$ i $B$ su sa iste strane prave $p: y = −x$. Odrazimo $A$ preko $p$: preslikavanje $(x, y) ↦ (−y, −x)$ daje $A\'(−4, 0)$.',
        'Za svaku tačku $P$ na pravoj $AP = A\'P$, pa je $AP + PB = A\'P + PB ≥ A\'B$, sa jednakošću kad je $P$ na duži $A\'B$.',
        'Prava $A\'B$: nagib ${5 − 0|−1 + 4} = {5|3}$, pa $y = {5|3}(x + 4)$.',
        K('Presek sa $y = −x$: $−x = {5|3}x + {20|3}$, tj. $x = −{5|2}$, $y = {5|2}$. $P(−{5|2}, {5|2})$.', [], G({ A: [0, 4, 0], B: [-1, 5, 90], "A'": [-4, 0, 225], P: [-2.5, 2.5, 180] },
          [{ mreza: [-5, 2, -1, 6], ose: ['x', 'y'] }, { lin: [[-5, 5], [1, -1]], b: 4 }, { d: "A'B", b: 1 }, { d: 'AP', b: 2 }, { d: "AA'", isp: 1 }, { tacka: 'P' }])),
      ]);
    Z(8, 5, 3,
      'Sedmorica gusara dele zlatnike: svako, kad je na redu, uzima onoliko zlatnika koliki je zbir cifara broja zlatnika koji su tada preostali. Svako uzima tačno dva puta i na kraju ne ostane nijedan zlatnik. Svi su dobili isto, osim glavnog gusara koji je dobio više. Koliko je zlatnika bilo?',
      ['$135$', '$126$', '$144$', '$117$'],
      [
        'Broj i njegov zbir cifara daju isti ostatak pri deljenju sa $9$, pa broj umanjen za zbir cifara je deljiv sa $9$. Posle prvog uzimanja svi preostali brojevi su deljivi sa $9$, i svako (osim možda prvog) uzima broj deljiv sa $9$.',
        'Poslednji gusar uzima sve što je ostalo, a to mora biti jednako zbiru cifara: jedini takav broj deljiv sa $9$ je $9$.',
        K('Unazad, u drugom krugu svako uzima po $9$: pre drugog kruga je $63$. U prvom krugu: od $63$ naviše svaki korak dodaje zbir cifara, i to izlazi $72, 81, 99, 108, 117, 126, 135$ (između $81$ i $99$ nema $90$, jer $99 − 18 = 81$).', [], C.tabela([['~gusar', 1, 2, 3, 4, 5, 6, 7], ['~pre 1. uzimanja', 135, 126, 117, 108, 99, 81, 72], ['~uzeo u 1. krugu', 9, 9, 9, 9, 18, 9, 9], ['~uzeo u 2. krugu', 9, 9, 9, 9, 9, 9, 9]], { istakni: [[2, 5]] })),
        'Bilo je $135$ zlatnika. Glavni gusar je peti po redu i dobio je $27$, a ostali po $18$.',
      ]);
  },
};
