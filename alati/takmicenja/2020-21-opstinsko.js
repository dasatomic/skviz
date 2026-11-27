// Opštinsko takmičenje iz matematike učenika osnovnih škola, 28. 2. 2021. (DMS)
// https://dms.rs/wp-content/uploads/2021/02/Postavke-i-resenja-opstinsko.pdf
module.exports = {
  godina: '2020/21', nivo: 'opstinsko', datum: '28. 2. 2021.',
  zadaci: ({ Z, G, K, ...C }) => {
    const sest = Array.from({ length: 6 }, (_, i) => C.naKrugu([0, 0], 3, 90 + 60 * i));
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Dato je $6$ tačaka među kojima nikoje tri nisu kolinearne. Koliko je duži, a koliko trouglova određeno ovim tačkama?',
      ['$15$ duži i $20$ trouglova', '$30$ duži i $20$ trouglova', '$15$ duži i $120$ trouglova', '$12$ duži i $18$ trouglova'],
      [
        'Duži: svaka od $6$ tačaka spaja se sa $5$ ostalih – $6 · 5 = 30$, ali je svaka duž brojana dvaput (iz oba kraja): $30 : 2 = 15$.',
        K('Trouglovi: tri tačke biramo redom na $6 · 5 · 4 = 120$ načina, ali svaki trougao je brojan $3 · 2 · 1 = 6$ puta (redosled temena): $120 : 6 = 20$.', [], G({}, [...sest.flatMap((p, i) => sest.slice(i + 1).map((q) => ({ lin: [p, q], b: 4 }))), { lin: [sest[0], sest[2], sest[4]], zatv: 1, b: 1, gusto: 1 }, ...sest.map((p) => ({ tx: '●', at: [p[0], p[1] - 0.1], b: 3 }))])),
        'Primetimo: svaki trougao ima $3$ temena, a uslov „nikoje tri nisu kolinearne“ garantuje da svaka trojka zaista daje trougao.',
      ]);
    Z(5, 2, 2,
      'Dati su skupovi $A = \\{n ∈ N \\| n < 2021, 7 | n\\}$, $B = \\{n ∈ N \\| n < 2021, 21 | n\\}$, $C = \\{n ∈ N \\| n < 2021, 84 | n\\}$. Koliko elemenata ima skup $A \\ (B \\ C)$?',
      ['$216$', '$192$', '$264$', '$240$'],
      [
        '$A$: umnošci broja $7$ manji od $2021$: $7, 14, …, 2016$ ($2016 = 7 · 288$) – $288$ elemenata.',
        '$B$: umnošci od $21$: $21, …, 2016$ ($2016 = 21 · 96$) – $96$. $C$: umnošci od $84$: $84, …, 2016$ ($2016 = 84 · 24$) – $24$.',
        K('Svaki umnožak od $84$ je umnožak od $21$, a svaki umnožak od $21$ je umnožak od $7$: $C ⊂ B ⊂ A$. Zato $B \\ C$ ima $96 − 24 = 72$ elementa.', [], G({}, [C.krug(0, 0, 4, { b: 0, prazno: 1 }), C.krug(0.8, 0, 2.6, { b: 2, gusto: 1 }), C.krug(1.4, 0, 1.2, { b: 3, prazno: 1 }), { tx: 'A', at: [-3, 2.8] }, { tx: 'B \\ C', at: [-0.6, 0] }, { tx: 'C', at: [1.4, 0] }])),
        '$A \\ (B \\ C)$: iz $A$ izbacujemo tih $72$: $288 − 72 = 216$.',
      ]);
    Z(5, 3, 2,
      'Ana je zamislila četvorocifren broj. Lana je obrisala cifru jedinica, pa je preostali trocifreni broj pomnožila obrisanom cifrom i dobila $2020$. Koji broj je Ana mogla da zamisli?',
      ['$4045$ ili $5054$', 'samo $4045$', 'samo $5054$', '$4045$, $5054$ ili $10102$'],
      [
        'Trocifren broj puta jednocifrena cifra daje $2020$, pa je cifra delilac broja $2020 = 2² · 5 · 101$: jednocifreni delioci su $1, 2, 4, 5$.',
        K('Proveravamo: $2020 : 1 = 2020$ i $2020 : 2 = 1010$ – nisu trocifreni. $2020 : 4 = 505$ ✓ i $2020 : 5 = 404$ ✓.', [], C.tabela([['~obrisana cifra', 1, 2, 4, 5], ['~preostali broj', 2020, 1010, 505, 404], ['~trocifren?', '~ne', '~ne', '~da', '~da']], { istakni: [[1, 3], [1, 4]] })),
        'Anin broj je trocifreni broj sa dopisanom cifrom: $5054$ (jer $505 · 4$) ili $4045$ (jer $404 · 5$).',
      ]);
    Z(5, 4, 1,
      'Kolika je razlika najmanjeg neparnog četvorocifrenog broja čiji je zbir cifara $4$ i najvećeg parnog trocifrenog broja čiji je proizvod cifara $16$?',
      ['$191$', '$181$', '$189$', '$211$'],
      [
        'Najmanji četvorocifreni broj uopšte sa zbirom cifara $4$: prva cifra najmanja moguća ($1$), a ostatak zbira ($3$) stavimo na poslednje mesto: $1003$. On je i neparan ✓.',
        K('Najveći paran trocifreni sa proizvodom cifara $16$: skupovi cifara su $\\{1, 2, 8\\}$, $\\{1, 4, 4\\}$, $\\{2, 2, 4\\}$. Najveći parni rasporedi: $812$, $414$, $422$ – najveći je $812$.', [], C.tabela([['~cifre', '1, 2, 8', '1, 4, 4', '2, 2, 4'], ['~najveći paran', 812, 414, 422]], { istakni: [[1, 1]] })),
        'Razlika: $1003 − 812 = 191$.',
      ]);
    Z(5, 5, 2,
      'Šta sve može biti presek dve poluprave?',
      ['poluprava, duž, tačka ili prazan skup', 'samo tačka ili prazan skup', 'prava, poluprava, duž ili tačka', 'poluprava, tačka ili prazan skup'],
      [
        'Ako poluprave leže na istoj pravoj i usmerene su isto – presek je ona koja je „kraća“: poluprava.',
        'Na istoj pravoj, suprotno usmerene i preklapaju se – presek je duž (između njihovih početaka). Suprotno usmerene sa zajedničkim početkom – tačka; suprotno usmerene „okrenute leđima“ – prazan skup.',
        K('Na različitim pravama: presek je jedna tačka ili prazan skup. Ukupno: poluprava, duž, tačka ili prazan skup (prava nikad – poluprava nema dva beskonačna kraja).', [], G({}, [
          { lin: [[0, 3], [5, 3]], b: 0, str: 1 }, { lin: [[1.5, 3.3], [5, 3.3]], b: 1, str: 1 }, { tx: '~poluprava', at: [2.5, 2.2] },
          { lin: [[7, 3], [12, 3]], b: 0, str: 1 }, { lin: [[10, 3.3], [7.5, 3.3]], b: 1, str: 1 }, { lin: [[8, 3.6], [10, 3.6]], b: 2, debljina: 4 }, { tx: '~duž', at: [9.5, 2.2] },
          { lin: [[0, -1], [4, 1]], b: 0, str: 1 }, { lin: [[0, 1], [4, -1]], b: 1, str: 1 }, { tx: '●', at: [2, -0.1], b: 2 }, { tx: '~tačka', at: [2, -2] },
          { lin: [[8.5, 0], [7, 0]], b: 0, str: 1 }, { lin: [[10, 0], [12, 0]], b: 1, str: 1 }, { tx: '~prazan skup', at: [9.5, -2] }])),
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Izračunaj vrednosti izraza a) $a − (b − c)$ i b) $a − b + c$, ako je $a = −5 + 1$, $b = −6 − 1$, $c = |−7|$.',
      ['a) $10$, b) $10$', 'a) $−4$, b) $10$', 'a) $10$, b) $−4$', 'a) $−18$, b) $10$'],
      [
        'Prvo vrednosti: $a = −4$, $b = −7$, $c = |−7| = 7$.',
        K('a) $b − c = −7 − 7 = −14$, pa je $a − (b − c) = −4 − (−14) = −4 + 14 = 10$.', [], C.brojevna(-8, 8, [[-4, 'a', 1], [-7, 'b', 2], [7, 'c', 3]], { podela: 1, svaki: 2 })),
        'b) $a − b + c = −4 − (−7) + 7 = −4 + 7 + 7 = 10$. Isti rezultat – i nije slučajno: $a − (b − c) = a − b + c$ (minus ispred zagrade menja znakove).',
      ]);
    Z(6, 2, 1,
      'Trougao $ABC$ je jednakokrak ($AC = BC$), a $D$ je središte osnovice $AB$. Obim trougla $ABC$ je $50 cm$, a obim trougla $ADC$ je $40 cm$. Kolika je duž $CD$?',
      ['$15 cm$', '$10 cm$', '$25 cm$', '$20 cm$'],
      [
        'Neka je $AB = a$, $AC = BC = b$, $CD = h$. Obim $ABC$: $a + 2b = 50$, pa je ${a|2} + b = 25$.',
        K('Obim $ADC$: $AD + DC + CA = {a|2} + h + b = 40$.', ['t']),
        'Oduzmemo: $h = 40 − 25 = 15 cm$. (Trouglovi $ADC$ i $BDC$ zajedno „pokrivaju“ obim $ABC$ plus dvaput $CD$: $2 · 40 = 50 + 2h$.)',
      ],
      G({ A: [0, 0, 225], B: [16, 0, -45], C: [8, 15, 90], D: [8, 0, -90] }, [{ p: 'ABC' }, { d: 'CD', isp: 1, o: 'h' }, { d: 'AC', o: 'b' }, { d: 'BC', o: 'b' }, { d: 'AD', o: 'a/2' }, { pu: 'CDB' }, { p: 'ADC', id: 't', b: 1, k: 2 }]));
    Z(6, 3, 1,
      'Petar je dobio kutiju bombona. Prvog dana je pojeo četvrtinu bombona, a drugog dana četvrtinu ostatka. Koliko je bombona dobio ako je na kraju drugog dana ostalo $9$?',
      ['$16$', '$12$', '$24$', '$36$'],
      [
        'Posle prvog dana ostaju ${3|4}$ bombona. Drugog dana pojede ${1|4}$ ostatka, pa ostaju ${3|4}$ ostatka: ${3|4} · {3|4} = {9|16}$ svih bombona.',
        K('${9|16}$ svih je $9$ bombona, pa je ${1|16}$ jedna bombona, a ukupno $16$.', [], G({}, [...C.traka(16, [0, 1, 2, 3], { w: 16, h: 1.2, b: 1, y: 1.6 }), { tx: '~1. dan: 4', at: [2, 3.4] }, ...C.traka(16, [4, 5, 6], { w: 16, h: 1.2, b: 3 }), { tx: '~2. dan: 3', at: [5.5, -0.6] }, { tx: '~ostaje 9', at: [12, -0.6] }])),
        'Provera: $16 − 4 = 12$, $12 − 3 = 9$ ✓.',
      ]);
    Z(6, 4, 2,
      'Dve stranice trougla $ABC$ su $a = 5,6 cm$ i $b = 12,8 cm$, a treća je ceo broj centimetara. Kolika je najmanja, a kolika najveća vrednost obima?',
      ['$26,4 cm$ i $36,4 cm$', '$25,4 cm$ i $37,4 cm$', '$26,4 cm$ i $37,4 cm$', '$25,6 cm$ i $36,8 cm$'],
      [
        'Nejednakost trougla: treća stranica je veća od razlike, a manja od zbira druge dve: $12,8 − 5,6 < c < 12,8 + 5,6$, tj. $7,2 < c < 18,4$.',
        K('Celi brojevi u tom intervalu: $8, 9, …, 18$.', [], C.interval(6, 20, { a: 7.2, b: 18.4, e: [{ tx: '8', at: [8, 1] }, { tx: '18', at: [18, 1] }] })),
        'Najmanji obim: $5,6 + 12,8 + 8 = 26,4 cm$. Najveći: $5,6 + 12,8 + 18 = 36,4 cm$.',
      ]);
    Z(6, 5, 2,
      'Koliko ima prostih brojeva manjih od $1000$ čiji je zbir cifara $4$?',
      ['$4$', '$5$', '$3$', '$6$'],
      [
        'Prost broj veći od $2$ je neparan, pa mu je poslednja cifra neparna. (Broj sa zbirom cifara $4$ nije deljiv sa $3$ – to ne smeta.)',
        'Jednocifreni: $4$ – nije prost. Dvocifreni sa zbirom $4$ i neparnim krajem: $13$, $31$ – oba prosta.',
        K('Trocifreni sa zbirom $4$ i neparnim krajem: $103, 121, 211, 301$. Ali $121 = 11 · 11$ i $301 = 7 · 43$ su složeni.', [], C.tabela([['~broj', 13, 31, 103, 121, 211, 301], ['~prost?', '~da', '~da', '~da', '11 · 11', '~da', '7 · 43']], { istakni: [[1, 1], [1, 2], [1, 3], [1, 5]] })),
        'Prosti su $13, 31, 103, 211$ – ukupno $4$.',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'U četvorouglu $ABCD$ je $AB ⊥ AD$ i $∡ABC = 45°$. Ako je $AB = 15 cm$, $BC = 3√2 cm$ i $AD = 8 cm$, kolika je stranica $CD$?',
      ['$13 cm$', '$12 cm$', '$√{145} cm$', '$15 cm$'],
      [
        K('Neka je $E$ podnožje normale iz $C$ na $AB$. Trougao $EBC$ je jednakokrako-pravougli (ugao $45°$), a hipotenuza je $3√2$, pa je $EB = EC = 3 cm$.', ['t1']),
        '$AE = AB − EB = 12 cm$. Neka je $F$ podnožje normale iz $C$ na $AD$: $AECF$ je pravougaonik, pa je $CF = AE = 12 cm$ i $AF = EC = 3 cm$.',
        '$DF = AD − AF = 8 − 3 = 5 cm$.',
        K('Pitagora u trouglu $CFD$: $CD = √{12² + 5²} = √{169} = 13 cm$.', ['t2']),
      ],
      G({ A: [0, 0, 225], B: [15, 0, -45], C: [12, 3, 45], D: [0, 8, 135], E: [12, 0, -90], F: [0, 3, 180] },
        [{ p: 'ABCD' }, { pu: 'BAD' }, { u: 'CBA', o: '45°' }, { p: 'EBC', id: 't1', b: 2, k: 1 }, { d: 'CE', isp: 1, k: 1 }, { d: 'CF', isp: 1, k: 2 }, { p: 'CFD', id: 't2', b: 4, k: 4 }]));
    Z(7, 2, 1,
      'Televizori u prodavnici imaju razmeru dužine i širine ekrana $7 : 4$. Ako je dijagonala Perinog televizora $10√{65} cm$, kolike su dužina i širina ekrana?',
      ['$70 cm$ i $40 cm$', '$56 cm$ i $32 cm$', '$84 cm$ i $48 cm$', '$35 cm$ i $20 cm$'],
      [
        'Neka su dužina i širina $7t$ i $4t$. Pitagora: $(7t)² + (4t)² = (10√{65})²$, tj. $65t² = 6500$.',
        '$t² = 100$, $t = 10$.',
        K('Dužina $70 cm$, širina $40 cm$.', [], G({}, [C.pr(0, 0, 7, 4, 0), { lin: [[0, 0], [7, 4]], b: 1 }, { tx: '7t', at: [3.5, -0.6] }, { tx: '4t', at: [7.6, 2] }, { tx: '10√65', at: [3.2, 2.5], b: 1 }])),
      ]);
    Z(7, 3, 1,
      'Nikola je zamislio realan broj. Proizvod njegovog kvadrata i kvadrata njegove trostruke vrednosti je $36$. Zbir zamišljenog broja i njegove apsolutne vrednosti je $0$. Koji je to broj?',
      ['$−√2$', '$√2$', '$−2$', '$−4$'],
      [
        'Uslov: $x² · (3x)² = 36$, tj. $9x^{4} = 36$, $x^{4} = 4$, pa je $x² = 2$ i $x = ±√2$.',
        '$x + |x| = 0$ znači $|x| = −x$, a to važi samo za $x ≤ 0$.',
        'Zato je $x = −√2$.',
      ]);
    Z(7, 4, 1,
      'Cena kaputa u dve prodavnice bila je jednaka. U jednoj je povećana za $8%$, a u drugoj smanjena za $8%$. Kolika je prvobitna cena ako je razlika novih cena $1200$ dinara?',
      ['$7500$ dinara', '$15 000$ dinara', '$6000$ dinara', '$9600$ dinara'],
      [
        'Neka je prvobitna cena $x$. Nove cene: $1,08x$ i $0,92x$.',
        'Razlika: $1,08x − 0,92x = 0,16x = 1200$, pa je $x = 7500$ dinara.',
        K('Provera: $8100 − 6900 = 1200$ ✓.', [], C.stubici([['~poskupljeno', 8100], ['~prvobitno', 7500], ['~pojeftinjeno', 6900]], { korakY: 2000, maxY: 9000, vrednosti: true })),
      ]);
    Z(7, 5, 2,
      'Dat je trapez sa osnovicama $50 cm$ i $14 cm$ i kracima $25 cm$ i $29 cm$. Kolika je površina trapeza?',
      ['$640 cm²$', '$720 cm²$', '$576 cm²$', '$800 cm²$'],
      [
        K('Neka je $E$ tačka na $AB$ takva da je $CE ∥ DA$. Tada je $AECD$ paralelogram: $AE = 14$, $EC = DA = 29$, pa trougao $EBC$ ima stranice $29$, $36$ ($= 50 − 14$) i $25$.', ['t']),
        'Heronov obrazac: $s = 45$, $P = √{45 · 16 · 9 · 20} = √{129 600} = 360 cm²$.',
        'Visina trougla na $EB$ je i visina trapeza: $h = {2 · 360|36} = 20 cm$.',
        'Površina trapeza: ${50 + 14|2} · 20 = 640 cm²$.',
      ],
      G({ A: [0, 0, 225], B: [50, 0, -45], C: [35, 20, 45], D: [21, 20, 135], E: [14, 0, -90] },
        [{ p: 'ABCD' }, { d: 'CE', isp: 1, k: 1 }, { p: 'EBC', id: 't', b: 2, k: 1 }]));

    // ───────── VIII razred ─────────
    Z(8, 1, 1,
      'Reši jednačinu ${1|2} · ({1|2} · ({1|2} · ({1|2}x − 1) − 1) − 1) − 1 = 2$.',
      ['$x = 62$', '$x = 30$', '$x = 46$', '$x = 64$'],
      [
        'Rešavamo „spolja ka unutra“: u svakom koraku dodamo $1$, pa pomnožimo sa $2$.',
        K('$… − 1 = 2$ ⇒ spoljna zagrada puta ${1|2}$ je $3$ ⇒ zagrada je $6$; zatim $6 + 1 = 7$, $14$; $15$, $30$; $31$, $62$.', [], C.tabela([['~korak', 1, 2, 3, 4], ['~+1', 3, 7, 15, 31], ['~·2', 6, 14, 30, 62]])),
        'Dakle ${1|2}x = 31$, $x = 62$. Provera: $31 − 1 = 30$, $15 − 1 = 14$, $7 − 1 = 6$, $3 − 1 = 2$ ✓.',
      ]);
    Z(8, 2, 1,
      'Ako se neki broj podeli drugim, dobije se količnik $2$ i ostatak $5$. Ako se zbir ta dva broja podeli njihovom razlikom, dobije se količnik $2$ i ostatak $7$. Koliki je zbir tih brojeva?',
      ['$41$', '$29$', '$46$', '$36$'],
      [
        'Neka je delilac $x$; deljenik je $2x + 5$ (uz $x > 5$).',
        'Zbir: $3x + 5$, razlika: $x + 5$. Uslov: $3x + 5 = 2(x + 5) + 7$, tj. $x = 12$.',
        'Brojevi su $29$ i $12$, zbir $41$. Provera: $41 = 2 · 17 + 7$ ✓ (i $7 < 17$).',
      ]);
    Z(8, 3, 2,
      'Duž $AB$ vidi se iz tačaka $C$ i $D$ pod uglom od $30°$, a duž $CD$ vidi se iz tačaka $A$ i $B$ pod uglom od $60°$. Kolika je duž $AB$ ako je $CD = 10√3 cm$?',
      ['$10 cm$', '$10√3 cm$', '$20 cm$', '$5√3 cm$'],
      [
        'Duž $AB$ se iz $C$ i $D$ vidi pod istim uglom, pa $A, B, C, D$ leže na jednoj kružnici (periferijski uglovi nad istom tetivom).',
        K('Centralni ugao nad $AB$ je dvostruki periferijski: $∡AOB = 60°$, pa je trougao $AOB$ jednakostraničan i $AB = r$.', ['ab']),
        'Centralni ugao nad $CD$ je $120°$, pa je $CD = r√3$ (trougao $COD$ je jednakokrak sa uglom $120°$).',
        '$r√3 = 10√3$ ⇒ $r = 10$, pa je $AB = 10 cm$.',
      ],
      G({ O: [0, 0, 90], A: [-2, -3.464, 225], B: [2, -3.464, -45], C: [-2, 3.464, 135], D: [4, 0, 0] },
        [{ kr: 'O', r: 4, k: 1 }, { d: 'AB', b: 1, id: 'ab' }, { d: 'CD', b: 2 }, { d: 'CA', isp: 1 }, { d: 'CB', isp: 1 }, { d: 'DA', isp: 1 }, { d: 'DB', isp: 1 }, { u: 'BCA', o: '30°', r: 40 }, { u: 'ADB', o: '30°', r: 40 }, { u: 'DAC', o: '60°', r: 18 }, { u: 'DBC', o: '60°', r: 18 }, { d: 'OA', k: 2 }, { d: 'OB', k: 2 }, { d: 'OC', k: 3 }, { d: 'OD', k: 3 }]));
    Z(8, 4, 2,
      'Reši jednačinu $|x + |2x − |3x||| = 2021$.',
      ['$x = {2021|2}$ ili $x = −{2021|4}$', 'samo $x = {2021|2}$', '$x = ±{2021|2}$', '$x = {2021|2}$ ili $x = −{2021|6}$'],
      [
        'Unutrašnja apsolutna vrednost zavisi od znaka $x$: posmatramo dva slučaja.',
        '$x ≥ 0$: $|3x| = 3x$, pa $|2x − 3x| = |−x| = x$, i jednačina je $|x + x| = 2x = 2021$: $x = {2021|2}$.',
        '$x < 0$: $|3x| = −3x$, pa $|2x + 3x| = |5x| = −5x$, i jednačina je $|x − 5x| = |−4x| = −4x = 2021$: $x = −{2021|4}$.',
        K('Oba rešenja zadovoljavaju uslove svojih slučajeva.', [], C.brojevna(-600, 1100, [[-505.25, '−2021/4', 1], [1010.5, '2021/2', 2]], { podela: 100, svaki: 5 })),
      ]);
    Z(8, 5, 2,
      'Paralelne prave $a$ i $b$ su mimoilazne sa pravom $c$. Tačke $A$, $B$, $C$ pripadaju redom pravama $a$, $b$, $c$. Koliko najviše ravni određuju ove tri prave i tri tačke?',
      ['$6$', '$4$', '$7$', '$5$'],
      [
        'Ravan određuju: dve paralelne prave, prava i tačka van nje, ili tri nekolinearne tačke. Dve mimoilazne prave ne određuju ravan.',
        'Prave $a$ i $b$: ravan $(a, b)$. Prava i tačka sa druge prave: $(a, C)$, $(b, C)$, $(c, A)$, $(c, B)$. Ravni $(a, B)$ i $(b, A)$ su ista ravan $(a, b)$.',
        K('Tri tačke: $(A, B, C)$. Ukupno najviše $6$ različitih ravni.', [], C.tabela([['~ravan', '(a, b)', '(a, C)', '(b, C)', '(c, A)', '(c, B)', '(A, B, C)']])),
      ]);
  },
};
