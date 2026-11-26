// Državno takmičenje iz matematike učenika osnovnih škola, 29. 4. 2017. (DMS)
// https://dms.rs/wp-content/uploads/2017/04/zadaci-2017.pdf (samo postavke – rešenja su naša, provereni računom)
module.exports = {
  godina: '2016/17', nivo: 'drzavno', datum: '29. 4. 2017.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Broj takmičara na opštinskom takmičenju je trocifren broj sa ciframa $a, b, c$. Prvu nagradu je dobilo ${3|25}$ takmičara, i Vera je primetila da je taj broj jednak jednom od dvocifrenih brojeva $ab$, $bc$ ili $ac$ (zapisanih ciframa). Koliko je bilo takmičara?',
      ['$125$', '$150$', '$175$', '$250$'],
      [
        '${3|25}$ takmičara mora biti ceo broj, pa je broj takmičara deljiv sa $25$: završava se sa $00$, $25$, $50$ ili $75$.',
        'Pri tom je ${3|25}$ broja dvocifreno: broj je između $84$ i $825$.',
        K('Proverom svih kandidata samo $125$ radi: ${3|25} · 125 = 15$, a $15$ je baš „$ac$“ (cifre $1$ i $5$).', [], C.tabela([['~broj', 100, 125, 150, 175, 200, 225], ['3/25 · broj', 12, 15, 18, 21, 24, 27], ['ab, bc, ac', '10, 0, 10', '12, 25, 15', '15, 50, 10', '17, 75, 15', '20, 0, 20', '22, 25, 25']], { istakni: [[0, 2], [1, 2]] })),
        'Bilo je $125$ takmičara.',
      ]);
    Z(6, 2, 3,
      'Marko je prešao put automobilom u četiri etape. U prvoj je za petinu ukupnog vremena prešao četvrtinu puta. U drugoj, od $120 km$, vozio je brzinom jednakom srednjoj brzini u poslednje dve etape. U trećoj je prešao dve trećine puta preostalog posle prve dve etape za $102$ minuta, a preostalih $72 km$ u četvrtoj za tačno jedan sat. Koliki je put i koliko je trajao?',
      ['$448 km$ za $5 h 15 min$', '$448 km$ za $4 h 12 min$', '$336 km$ za $5 h 15 min$', '$420 km$ za $5 h$'],
      [
        'Četvrta etapa ($72 km$) je trećina puta posle prve dve etape, pa je taj ostatak $216 km$, a treća etapa $144 km$.',
        'Poslednje dve etape: $216 km$ za $102 + 60 = 162$ minuta $= 2,7 h$ – srednja brzina $80 km/h$. Druga etapa: $120 km$ brzinom $80 km/h$ – $1,5 h$.',
        'Put: ${S|4} + 120 + 216 = S$ ⇒ ${3S|4} = 336$ ⇒ $S = 448 km$.',
        K('Vreme: posle prve etape prošle su ${4|5}$ vremena: $1,5 + 1,7 + 1 = 4,2 h$, pa je ukupno $4,2 : {4|5} = 5,25 h = 5 h 15 min$.', [], C.tabela([['~etapa', '1.', '2.', '3.', '4.'], ['~put (km)', 112, 120, 144, 72], ['~vreme', '63 min', '90 min', '102 min', '60 min']])),
      ]);
    D(6, 3, 3,
      'Dokaži da je u svakom trapezu koji nije paralelogram razlika dužina osnovica veća od razlike dužina krakova.',
      [
        'Neka je $ABCD$ trapez sa $AB = a$, $CD = c$, $BC = b$, $AD = d$.',
        K('Povucimo kroz $C$ pravu paralelnu sa $AD$; ona seče $AB$ u $E$. $AECD$ je paralelogram: $CE = d$, $AE = c$, pa je $EB = a − c$.', ['t']),
        'U trouglu $EBC$ (pravi trougao, jer trapez nije paralelogram) stranice su $a − c$, $b$, $d$. Nejednakost trougla: svaka stranica je veća od razlike druge dve: $a − c > |b − d|$.',
      ],
      G({ A: [0, 0, 225], B: [9, 0, -45], C: [6, 3, 45], D: [2, 3, 135], E: [4, 0, -90] },
        [{ p: 'ABCD' }, { d: 'CE', isp: 1, k: 1 }, { p: 'EBC', id: 't', b: 2, k: 1 }]));
    // VI.4: trougao A(0, 0), B(8, 0), C(1,6; 5,2); upisana kružnica I(2,6; 1,92); tačke izračunate (AE = BD = AF = 1,4)
    D(6, 4, 3,
      'Upisana kružnica trougla $ABC$ dodiruje stranice $BC$ i $AC$ redom u tačkama $P$ i $Q$. Prava koja sadrži središte stranice $AB$ i paralelna je sa $PQ$ seče prave $BC$ i $AC$ redom u tačkama $D$ i $E$. Dokaži da je $AE = BD$.',
      [
        K('Tangentne duži iz iste tačke su jednake: $CP = CQ$. Trougao $CPQ$ je jednakokrak, pa je $∡CPQ = ∡CQP$.', ['cpq']),
        K('Prava $DE$ je paralelna sa $PQ$, pa su uglovi trougla $CDE$ kod $D$ i $E$ jednaki uglovima kod $P$ i $Q$ (saglasni uglovi): $∡CDE = ∡CED$.', ['cde']),
        K('Neka je $M$ središte stranice $AB$ (kroz njega prolazi $DE$). Kroz $A$ povucimo pravu paralelnu sa $BC$; ona seče pravu $DE$ u tački $F$.', ['af']),
        K('Trouglovi $AMF$ i $BMD$ su podudarni (USU): $AM = MB$, $∡AMF = ∡BMD$ (unakrsni) i $∡MAF = ∡MBD$ (naizmenični, jer je $AF ∥ BD$). Zato je $AF = BD$.', ['amf', 'bmd']),
        K('Prava $DE$ seče paralelne prave $AF$ i $CD$, pa je $∡AFE = ∡CDE$, a $∡AEF = ∡CED$ (to je isti ugao). Pošto je $∡CDE = ∡CED$, trougao $AEF$ ima jednake uglove kod $E$ i $F$ – jednakokrak je: $AE = AF$.', ['aef']),
        'Dakle $AE = AF = BD$. ∎ (Uz to se lako vidi i koliko iznose: $CD = CE$, pa je $AE = BD = {BC − AC|2}$.)',
      ],
      G({ A: [0, 0, 160], B: [8, 0, -30], C: [1.6, 5.2, 90], P: [3.81, 3.41, 30], Q: [0.76, 2.48, 170], I: [2.6, 1.92, 0], M: [4, 0, -90], D: [6.91, 0.88, 20], E: [-0.41, -1.34, 225], F: [1.09, -0.88, -60] },
        [{ p: 'ABC', prazno: 1 }, { kr: 'I', r: 1.92 }, { tacka: 'I' }, { tacka: 'P' }, { tacka: 'Q' }, { d: 'PQ', isp: 1 }, { d: 'ED' }, { d: 'AE', isp: 1 }, { tacka: 'M' },
          { p: 'CPQ', id: 'cpq', b: 4, k: 1, kraj: 3 }, { p: 'CDE', id: 'cde', b: 4, k: 2, kraj: 3 },
          { d: 'AF', id: 'af', b: 2, k: 3 }, { p: 'AMF', id: 'amf', b: 1, k: 4, kraj: 5 }, { p: 'BMD', id: 'bmd', b: 1, k: 4, kraj: 5 },
          { p: 'AEF', id: 'aef', b: 3, k: 5 }]));
    Z(6, 5, 2,
      'Iz skupa $\\{1, 2, 3, 4, 5\\}$ biraju se tri broja i njima se popunjava tablica $3 × 3$ tako da u svakoj vrsti i svakoj koloni budu različiti brojevi. Na koliko načina?',
      ['$120$', '$60$', '$12$', '$360$'],
      [
        'Tri broja biramo na ${5 · 4 · 3|6} = 10$ načina.',
        'Sa tri izabrana broja: prvu vrstu popunjavamo na $3! = 6$ načina. Druga vrsta je ciklični pomeraj prve (u bilo kom smeru) – $2$ načina, a treća je tada određena.',
        K('Tablica po izboru brojeva: $6 · 2 = 12$ („latinski kvadrati“ reda $3$).', [], C.tabela([['1', '2', '3'], ['2', '3', '1'], ['3', '1', '2']], { zaglavlje: false })),
        'Ukupno $10 · 12 = 120$.',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 3,
      'Nad katetama $AC = b$ i $BC = a$ pravouglog trougla $ABC$ kao prečnicima konstruisane su kružnice $k_{1}$ i $k_{2}$. Prava $p$ dodiruje obe kružnice u tačkama $M$ i $N$. Kolika je duž $MN$?',
      ['$√{{ab|2}}$', '$√{ab}$', '${a + b|2}$', '${√{a² + b²}|2}$'],
      [
        'Centri su središta kateta, a rastojanje centara je srednja linija trougla: ${c|2} = {√{a² + b²}|2}$. Poluprečnici su ${a|2}$ i ${b|2}$.',
        K('Za zajedničku spoljašnju tangentu (kružnice se seku – u $C$ i u podnožju visine) pomerimo $MN$ paralelno do centra manje kružnice: pravougli trougao sa hipotenuzom ${c|2}$ i katetom ${|a − b||2}$.', []),
        '$MN² = {a² + b²|4} − {(a − b)²|4} = {2ab|4} = {ab|2}$.',
        '$MN = √{{ab|2}}$.',
      ]);
    Z(7, 2, 2,
      'Za realan broj $a > 1$ važi $a − √a = {1|a} + {1|√a}$. Koliko je $a + {1|a}$?',
      ['$3$', '$2$', '$√5$', '$4$'],
      [
        'Prebacimo: $a − {1|a} = √a + {1|√a}$.',
        'Leva strana je razlika kvadrata: $a − {1|a} = (√a − {1|√a})(√a + {1|√a})$.',
        'Skratimo sa $√a + {1|√a} > 0$: $√a − {1|√a} = 1$.',
        'Kvadriramo: $a − 2 + {1|a} = 1$, pa je $a + {1|a} = 3$.',
      ]);
    Z(7, 3, 3,
      'Koji četvorocifreni potpuni kvadrati imaju osobinu da postoji cifra $k > 0$ takva da je broj čije su cifre redom $a − k, b − k, c − k, d − k$ takođe potpun kvadrat?',
      ['$3136$ i $4489$', 'samo $3136$', '$1156$ i $2025$', '$4489$ i $5625$'],
      [
        'Oduzimanje $k$ od svake cifre (bez pozajmica) smanjuje broj za $1111k$: $n² − m² = 1111k = 11 · 101 · k$, tj. $(n − m)(n + m) = 11 · 101 · k$.',
        'Kako je $n + m < 200$, a $101$ je prost, mora $n + m = 101$, i $n − m = 11k$.',
        K('$n − m = 11k$ i $n + m = 101$ – iste parnosti, pa je $k$ neparno; $k = 1$: $n = 56$, $m = 45$; $k = 3$: $n = 67$, $m = 34$; $k = 5$: $n = 78$, $m = 23$ (ali $78² = 6084$ ima cifru $0 < 5$ – ne ide).', [], C.tabela([['k', 1, 3, 5], ['n²', 3136, 4489, 6084], ['m²', 2025, 1156, '—']])),
        'Rešenja: $3136 = 56²$ ($k = 1$ daje $2025 = 45²$) i $4489 = 67²$ ($k = 3$ daje $1156 = 34²$).',
      ]);
    Z(7, 4, 2,
      'Zbir tupih uglova konveksnog mnogougla je $2017°$. Koliko stranica ima taj mnogougao?',
      ['$14$', '$13$', '$15$', '$12$'],
      [
        'Konveksan mnogougao ima najviše $3$ ugla koja nisu tupa (zbir spoljašnjih je $360°$). Ti uglovi su između $0°$ i $90°$, pa je njihov zbir manji od $270°$ i veći od $0$.',
        'Zbir svih uglova $(n − 2) · 180°$ je između $2017°$ i $2017° + 270°$: $(n − 2) · 180 ∈ (2017, 2287)$ ⇒ $n − 2 = 12$, $n = 14$.',
        K('Tada nepravi (ne-tupi) uglovi imaju zbir $2160° − 2017° = 143°$ – npr. dva ugla, a ostalih $12$ tupih (svaki oko $168°$).', [], C.tabela([['n', 13, 14, 15], ['(n − 2) · 180°', '1980°', '2160°', '2340°'], ['~ostatak', '−37°', '143°', '323°']], { istakni: [[1, 2], [2, 2]] })),
      ]);
    D(7, 5, 3,
      'Ekipe $A$ i $B$ igraju sa gomilom od $2017$ bombona, naizmenično, a počinje ekipa $A$. U jednom potezu se ili uzme jedna bombona sa neke gomile, ili se neka gomila podeli na dve ili više manjih gomila sa jednakim brojem bombona. Pobeđuje ekipa koja uzme poslednju bombonu. Dokaži da ekipa $B$ ima pobedničku strategiju.',
      [
        '$2017$ je prost broj, pa se gomila može podeliti samo na $2017$ gomila po $1$ bombonu.',
        'Ako $A$ to uradi, ostaje $2017$ pojedinačnih bombona; $B$ uzima prvu, i pošto ih je neparno mnogo, $B$ uzima i poslednju.',
        'Ako $A$ uzme jednu bombonu, ostaje $2016$: $B$ deli gomilu na dve po $1008$. Dalje $B$ „ogleda“ svaki potez ekipe $A$ na drugoj gomili (isto uzimanje ili isto deljenje) – stanje posle poteza ekipe $B$ je uvek simetrično.',
        'Zato $B$ uvek ima odgovor i uzima poslednju bombonu.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Reši sistem ${x + y|xyz} = {1|6}$, ${y + z|xyz} = {4|15}$, ${z + x|xyz} = {7|30}$.',
      ['$(2, 3, 5)$ i $(−2, −3, −5)$', 'samo $(2, 3, 5)$', '$(3, 2, 5)$ i $(−3, −2, −5)$', '$(1, 6, 15)$'],
      [
        'Smena $u = {1|x}$, $v = {1|y}$, $w = {1|z}$: ${x + y|xyz} = {1|yz} + {1|xz} = vw + uw$. Sistem: $uw + vw = {1|6}$, $uv + uw = {4|15}$, $uv + vw = {7|30}$.',
        'Saberemo: $2(uv + vw + wu) = {5 + 8 + 7|30} = {2|3}$, pa je $uv + vw + wu = {1|3}$. Odatle $uv = {1|6}$, $vw = {1|15}$, $wu = {1|10}$.',
        '$(uvw)² = {1|6} · {1|15} · {1|10} = {1|900}$, pa je $uvw = ±{1|30}$.',
        K('$u = {uvw|vw} = ±{1|2}$, $v = ±{1|3}$, $w = ±{1|5}$: $(x, y, z) = (2, 3, 5)$ ili $(−2, −3, −5)$.', [], C.tabela([['', 'u = 1/x', 'v = 1/y', 'w = 1/z'], ['+', '1/2', '1/3', '1/5'], ['−', '−1/2', '−1/3', '−1/5']])),
      ]);
    // VIII.2: osnovna ivica 4, bočna 8 (H = √{176/3} ≈ 7,66); E deli SB u odnosu SE : EB = √5 : 1
    Z(8, 2, 3,
      'Neka je $ABCS$ pravilna trostrana piramida sa osnovom $ABC$, kojoj su bočne ivice dva puta duže od osnovne ivice, i neka je $E$ tačka bočne ivice $BS$. Nagibni ugao ravni $ACE$ prema osnovi jednak je polovini nagibnog ugla bočne strane prema osnovi. U kom odnosu ravan $ACE$ deli zapreminu piramide?',
      ['$1 : √5$', '$1 : 2$', '$1 : √3$', '$1 : 3$'],
      [
        K('Neka je osnovna ivica $a$, bočna $2a$, a $M$ središte ivice $AC$. U osnovi je $MB ⊥ AC$ (visina jednakostraničnog trougla), a u bočnoj strani $ACS$ je $MS ⊥ AC$ (visina jednakokrakog trougla). Zato je nagibni ugao bočne strane prema osnovi $φ = ∡SMB$.', ['ms', 'mb']),
        K('Tačka $E$ leži u ravni $SMB$, koja je normalna na $AC$, pa je i $ME ⊥ AC$. Nagibni ugao ravni $ACE$ je zato $∡EMB = {φ|2}$: duž $ME$ je simetrala ugla $SMB$.', ['me'],
          G({ M: [0, 0, 225], B: [3.46, 0, -45], S: [1.15, 7.66, 90], E: [2.75, 2.37, 0] },
            [{ p: 'MBS', prazno: 1 }, { d: 'ME', b: 2 }, { u: 'SME', o: 'φ/2', b: 3, r: 40 }, { u: 'EMB', o: 'φ/2', b: 2, r: 30 }])),
        K('Dužine u trouglu $SMB$: $MB = {a√3|2}$ i $MS = √{(2a)² − ({a|2})²} = √{{15a²|4}} = {a√15|2}$.', [],
          G({ M: [0, 0, 225], B: [3.46, 0, -45], S: [1.15, 7.66, 90], E: [2.75, 2.37, 0] },
            [{ p: 'MBS', prazno: 1 }, { d: 'ME', b: 2 }, { d: 'MB', o: 'a√3/2', b: 1 }, { d: 'MS', o: 'a√15/2', b: 1, os: -1 }])),
        K('Simetrala ugla trougla deli naspramnu stranicu u odnosu susednih stranica: $SE : EB = MS : MB = √15 : √3 = √5 : 1$.', [],
          G({ M: [0, 0, 225], B: [3.46, 0, -45], S: [1.15, 7.66, 90], E: [2.75, 2.37, 0] },
            [{ p: 'MBS', prazno: 1 }, { d: 'ME', b: 2 }, { d: 'SE', o: '√5', b: 3 }, { d: 'EB', o: '1', b: 3 }])),
        K('Ravan $ACE$ deli piramidu na piramide $EABC$ i $EACS$. Piramida $EABC$ ima istu osnovu kao cela, a visinu manju u odnosu $EB : SB = 1 : (1 + √5)$. Zato je $V_{EABC} = {V|1 + √5}$, a $V_{EACS} = V − V_{EABC} = {√5 · V|1 + √5}$.', ['donji']),
        'Ravan $ACE$ deli zapreminu piramide u odnosu $V_{EABC} : V_{EACS} = 1 : √5$.',
      ],
      C.piramidaOsnova([[-2, -1.15], [0, 2.31], [2, -1.15]], [0, 0, 7.66],
        [{ p: 'ACE', b: 1, id: 'presek' }, { tacka: 'E' },
          { d: 'MS', id: 'ms', b: 3, k: 1 }, { d: 'MB', id: 'mb', b: 3, isp: 1, k: 1 }, { d: 'ME', id: 'me', b: 2, isp: 1, k: 2 },
          { p: 'ABC', id: 'donji', b: 4, k: 5 }],
        { theta: 50, phi: 25, velicina: 260, T3: { M: [0, -1.15, 0], E: [0, 1.6, 2.37] } }));
    // VIII.3: 2^{2016} ima tačno 607 cifara (provereno računom)
    D(8, 3, 3,
      'Neka je $N$ najmanji prirodan broj koji ima tačno $2017$ delilaca (u skupu prirodnih brojeva). Dokaži da $N$ ima bar $605$ cifara.',
      [
        'Ako je $N = p_{1}^{k_{1}} · p_{2}^{k_{2}} · … · p_{m}^{k_{m}}$ rastavljanje na proste činioce, broj delilaca je $(k_{1} + 1)(k_{2} + 1)…(k_{m} + 1)$: delilac za svaki prost činilac bira eksponent od $0$ do $k_{i}$.',
        '$2017$ je prost broj, pa se ne može napisati kao proizvod dva činioca veća od $1$. Zato $N$ ima samo jedan prost činilac: $N = p^{2016}$.',
        'Najmanji takav broj je $N = 2^{2016}$ (za svaki drugi prost broj $p > 2$ je $p^{2016} > 2^{2016}$).',
        K('$2^{10} = 1024 > 1000 = 10³$, pa je $2^{2010} = (2^{10})^{201} > (10³)^{201} = 10^{603}$.', [], C.tabela([['~stepen', '2^10', '2^2010', '2^2016'], ['~poređenje', '1024 > 10³', '> 10^603', '> 64 · 10^603']])),
        'Zato je $N = 2^{6} · 2^{2010} > 64 · 10^{603} > 10 · 10^{603} = 10^{604}$. Najmanji broj sa $605$ cifara je $10^{604}$, pa $N$ ima bar $605$ cifara. ∎',
        'Zanimljivo: $2^{2016}$ ima tačno $607$ cifara.',
      ]);
    // VIII.4: kvadrat stranice 6; M = (1,5; 1,5), N = (4, 4)
    D(8, 4, 3,
      'Na stranici $AB$ kvadrata $ABCD$ je tačka $E$, a na stranici $CD$ tačka $F$, tako da je $AE : EB = 1 : 2$ i $CF : FD = 1 : 1$. Duži $BF$ i $DE$ seku dijagonalu $AC$ redom u tačkama $N$ i $M$. Dokaži da su trouglovi $AME$ i $CFN$ slični.',
      [
        K('Neka je stranica kvadrata $a$: $AE = {a|3}$, $CF = {a|2}$, dijagonala $AC = a√2$. Dijagonala polovi prave uglove kvadrata, pa je $∡MAE = ∡FCN = 45°$.', ['u1', 'u2']),
        K('$AE ∥ CD$, pa su trouglovi $AME$ i $CMD$ slični (jednaki uglovi uz paralelne prave): $AM : MC = AE : CD = {a|3} : a = 1 : 3$. Zato je $AM = {AC|4} = {a√2|4}$.', ['ame', 'cmd']),
        K('$CF ∥ AB$, pa su trouglovi $CNF$ i $ANB$ slični: $CN : NA = CF : AB = 1 : 2$. Zato je $CN = {AC|3} = {a√2|3}$.', ['cnf', 'anb']),
        'Stranice uz ugao od $45°$: ${AM|CF} = {a√2|4} : {a|2} = {√2|2}$ i ${AE|CN} = {a|3} : {a√2|3} = {1|√2} = {√2|2}$.',
        K('Trouglovi $AME$ i $CFN$ imaju jednak ugao ($45°$), a stranice uz njega su u istom odnosu – slični su (stav SUS), sa parovima temena $A ↔ C$, $M ↔ F$, $E ↔ N$. ∎', ['ame', 'cnf']),
      ],
      G({ A: [0, 0, 225], B: [6, 0, -45], C: [6, 6, 45], D: [0, 6, 135], E: [2, 0, -90], F: [3, 6, 90], M: [1.5, 1.5, 160], N: [4, 4, -20] },
        [{ p: 'ABCD', prazno: 1 }, { d: 'AC' }, { d: 'DE' }, { d: 'BF' }, { tacka: 'M' }, { tacka: 'N' },
          { u: 'EAM', o: '45°', b: 3, k: 1, id: 'u1', r: 30 }, { u: 'FCN', o: '45°', b: 3, k: 1, id: 'u2', r: 30 },
          { p: 'AME', id: 'ame', b: 1, k: 2 }, { p: 'CMD', id: 'cmd', b: 4, k: 2, kraj: 3 },
          { p: 'CNF', id: 'cnf', b: 2, k: 3 }, { p: 'ANB', id: 'anb', b: 4, k: 3, kraj: 4 }]));
    Z(8, 5, 3,
      'Na $2018$ kartica su brojevi $0, 1, …, 2017$, poređane u red proizvoljno. Igrači $A$ (počinje) i $B$ naizmenično uzimaju jednu od dve krajnje kartice. Pobeđuje onaj sa većim zbirom. Ko ima pobedničku strategiju?',
      ['Igrač $A$', 'Igrač $B$', 'Niko', 'Zavisi od rasporeda'],
      [
        'Označimo mesta u redu brojevima $1$–$2018$ i obojimo neparna i parna mesta. Krajnje kartice su na mestima različite parnosti.',
        'Igrač $A$ može uzeti sve kartice na neparnim mestima: uzme prvu (neparno mesto), tada su oba kraja na parnim mestima – $B$ mora uzeti parnu, čime se otvara nova neparna, i tako dalje. Isto može uzeti i sve parne.',
        'Zbir svih kartica je ${2017 · 2018|2} = 2 035 153$ – neparan, pa zbirovi na parnim i neparnim mestima nisu jednaki.',
        '$A$ unapred izračuna oba zbira i uzme veći skup – pobeđuje igrač $A$.',
      ]);
  },
};
