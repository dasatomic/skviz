// Opštinsko takmičenje iz matematike učenika osnovnih škola, 10. 2. 2024. (DMS)
// https://dms.rs/wp-content/uploads/2024/02/Postavke-i-resenja-zadataka-sajt.pdf (skeniran PDF)
module.exports = {
  godina: '2023/24', nivo: 'opstinsko', datum: '10. 2. 2024.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Za koliko prirodnih brojeva $x$ je tačna nejednakost ${701|1011} < {13 · x|2022} < {601|674}$?',
      ['$31$', '$30$', '$32$', '$29$'],
      [
        'Svedimo sva tri razlomka na isti imenilac $2022$: $2022 = 2 · 1011 = 3 · 674$.',
        '${701|1011} = {1402|2022}$ i ${601|674} = {1803|2022}$. Nejednakost postaje $1402 < 13x < 1803$.',
        '$13x > 1402$: kako je $13 · 107 = 1391$ i $13 · 108 = 1404$, mora $x ≥ 108$.',
        '$13x < 1803$: kako je $13 · 138 = 1794$ i $13 · 139 = 1807$, mora $x ≤ 138$.',
        K('Dakle $x ∈ \\{108, 109, …, 138\\}$ – to je $138 − 108 + 1 = 31$ broj.', [], C.interval(1380, 1820, { a: 1404, b: 1794, ukljA: true, ukljB: true, podela: 20, svaki: 5, e: [{ tx: '~13 · 108', at: [1404, 50] }, { tx: '~13 · 138', at: [1794, 50] }] })),
      ]);
    Z(5, 2, 1,
      'Dato je nekoliko uzastopnih prostih brojeva. Proizvod najmanjeg i najvećeg od njih je $589$. Koliki je zbir svih tih brojeva?',
      ['$102$', '$50$', '$73$', '$121$'],
      [
        'Rastavimo $589$ na proste činioce. Probamo redom: nije deljiv sa $2, 3, 5, 7, 11, 13, 17$, a $589 = 19 · 31$.',
        'Proizvod dva prosta broja može biti samo $19 · 31$ (jer $1$ nije prost broj), pa je najmanji broj $19$, a najveći $31$.',
        K('Svi prosti brojevi od $19$ do $31$: $19, 23, 29, 31$ (brojevi $21, 25, 27$ su složeni).', [], C.brojevna(18, 32, [[19, '19', 1], [23, '23', 2], [29, '29', 2], [31, '31', 1]], { podela: 1, svaki: 2 })),
        'Zbir: $19 + 23 + 29 + 31 = 102$.',
      ]);
    Z(5, 3, 2,
      'Na duži $AB$ date su tačke $P$, $Q$ i $R$ (raspored $A − P − Q − R − B$). Udaljenost između središta duži $PQ$ i $QR$ je $8 cm$, a između središta duži $AP$ i $RB$ je $22 cm$. Kolika je dužina duži $AB$?',
      ['$28 cm$', '$30 cm$', '$36 cm$', '$44 cm$'],
      [
        'Neka su $X, Y, Z, T$ redom središta duži $AP$, $PQ$, $QR$ i $RB$.',
        '$YZ = YQ + QZ = 8 cm$. Kako je $PQ = 2 · YQ$ i $QR = 2 · QZ$, dobijamo $PR = PQ + QR = 2 · (YQ + QZ) = 16 cm$.',
        '$XT = XP + PR + RT = 22 cm$, pa je $XP + RT = 22 − 16 = 6 cm$.',
        '$AP + RB = 2 · XP + 2 · RT = 2 · 6 = 12 cm$.',
        K('$AB = AP + PR + RB = 12 + 16 = 28 cm$.', [], G({ A: [0, 0, 270], X: [2, 0, 270], P: [4, 0, 270], Y: [7, 0, 270], Q: [10, 0, 270], Z: [15, 0, 270], R: [20, 0, 270], T: [24, 0, 270], B: [28, 0, 270] },
          [{ d: 'AB' }, ...['A', 'P', 'Q', 'R', 'B'].map((n) => ({ tacka: n })), ...['X', 'Y', 'Z', 'T'].map((n) => ({ tacka: n, b: 1 })), { lin: [[7, -1.2], [15, -1.2]], b: 2, debljina: 3 }, { tx: '8 cm', at: [11, -2.2] }, { lin: [[2, 1.2], [24, 1.2]], b: 3, debljina: 3 }, { tx: '22 cm', at: [13, 2] }], { velicina: 560 })),
      ]);
    Z(5, 4, 2,
      'Prirodni brojevi od $1$ do $2024$ napisani su jedan iza drugog u niz: $123456789101112…20232024$. Koja cifra se nalazi tačno u sredini tog niza?',
      ['$1$', '$2$', '$5$', '$0$'],
      [
        K('Prebrojimo cifre: jednocifrenih brojeva ima $9$, dvocifrenih $90$, trocifrenih $900$, a četvorocifrenih od $1000$ do $2024$ ima $1025$.', [], C.tabela([['~brojevi', '1–9', '10–99', '100–999', '1000–2024'], ['~koliko', 9, 90, 900, 1025], ['~cifara', 9, 180, 2700, 4100]])),
        'Ukupno cifara: $9 + 180 + 2700 + 4100 = 6989$ – neparan broj, pa je sredina tačno $3495$. cifra ($3494$ cifre levo i $3494$ desno).',
        'Jedno-, dvo- i trocifreni brojevi zauzimaju $9 + 180 + 2700 = 2889$ cifara. Do $3495$. mesta treba još $3495 − 2889 = 606$ cifara iz četvorocifrenih brojeva.',
        '$606 = 4 · 151 + 2$: prvih $151$ četvorocifrenih brojeva ($1000$–$1150$) potroši $604$ cifre, a tražena je $2$. cifra $152$. četvorocifrenog broja – to je broj $1151$.',
        'Druga cifra broja $1151$ je $1$.',
      ]);
    Z(5, 5, 2,
      'Torta ima oblik kocke ivice $4 dm$. Gornja strana i sve bočne strane premazane su šlagom (donja nije). Torta je isečena na $64$ parčeta oblika kocke ivice $1 dm$. Koliko ima parčića koji: a) nemaju premazanu stranu; b) imaju jednu premazanu stranu; v) imaju dve premazane strane?',
      ['a) $12$, b) $28$, v) $20$', 'a) $8$, b) $24$, v) $24$', 'a) $12$, b) $24$, v) $24$', 'a) $16$, b) $28$, v) $16$'],
      [
        K('Posmatrajmo kocku po redovima (spratovima) odozdo: 1., 2., 3. i 4. (gornji) red. Svaki red ima $4 · 4 = 16$ kockica.', [], C.kocke(4, 4, 4)),
        'a) Bez šlaga su unutrašnje kockice (ne dodiruju bočne strane) u 1., 2. i 3. redu – u svakom redu $2 · 2 = 4$, ukupno $12$. (Donja strana nema šlag, pa i unutrašnje kockice prvog reda ostaju bez šlaga.)',
        'b) Jednu stranu sa šlagom imaju kockice na bočnim stranama koje nisu na ivicama, u redovima 1–3: na svakoj od $4$ bočne strane $3 · 2 = 6$, ukupno $24$; i $4$ unutrašnje kockice gornjeg reda. Ukupno $28$.',
        'v) Dve strane: kockice na $4$ uspravne ivice u redovima 1–3: $4 · 3 = 12$; i srednje kockice gornjih ivica: $4 · 2 = 8$. Ukupno $20$.',
        'Provera: $4$ gornja ugla imaju tri strane sa šlagom; $12 + 28 + 20 + 4 = 64$ ✓.',
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Ako je $A = 2 − 4 · ({1|8} − {1|2})$ i $B = −121,2 : 12 − 12{1|2} · 1,2$, izračunaj ${\\|A + B\\||9}$.',
      ['$2,4$', '$−2,4$', '$3,2$', '$1,6$'],
      [
        '$A$: u zagradi ${1|8} − {4|8} = −{3|8}$, pa je $A = 2 − 4 · (−{3|8}) = 2 + {3|2} = 3,5$.',
        '$B$: $−121,2 : 12 = −10,1$ i $12{1|2} · 1,2 = 12,5 · 1,2 = 15$, pa je $B = −10,1 − 15 = −25,1$.',
        '$A + B = 3,5 + (−25,1) = −21,6$, a apsolutna vrednost $|−21,6| = 21,6$.',
        '${21,6|9} = 2,4$.',
      ]);
    D(6, 2, 2,
      'Kroz središte $S$ dijagonale $BD$ pravougaonika $ABCD$ konstruisana je prava $p$ koja seče stranice $AB$ i $CD$ u tačkama $P$ i $Q$. Dokaži da je $SP = SQ$.',
      [
        'Posmatrajmo trouglove $SDQ$ i $SBP$.',
        '$∡SDQ = ∡SBP$ – naizmenični uglovi kod paralelnih pravih $AB$ i $CD$ sa transverzalom $BD$.',
        '$∡DSQ = ∡BSP$ – unakrsni uglovi.',
        K('$BS = SD$ jer je $S$ središte dijagonale. Po stavu USU trouglovi $SDQ$ i $SBP$ su podudarni, pa je $SP = SQ$.', ['t1', 't2']),
        'Drugim rečima: središte pravougaonika (presek dijagonala) je centar simetrije – svaka prava kroz njega seče pravougaonik u dve simetrične tačke.',
      ],
      G({ A: [0, 0, 225], B: [8, 0, -45], C: [8, 4, 45], D: [0, 4, 135], S: [4, 2, 0], P: [5, 0, -90], Q: [3, 4, 90], p1: [5.6, -1.2], p2: [2.4, 5.2] },
        [{ p: 'ABCD' }, { d: 'BD' }, { d: 'p1p2' }, { tacka: 'S' }, { p: 'SDQ', id: 't1', b: 2, k: 4 }, { p: 'SBP', id: 't2', b: 4, k: 4 }]));
    Z(6, 3, 1,
      'Dat je razlomak ${2023|2024}$. Koji broj treba oduzeti od brojioca i dodati imeniocu, da bi se posle skraćivanja dobio razlomak $−{3|4}$?',
      ['$14 164$', '$10 120$', '$12 145$', '$−14 164$'],
      [
        'Neka je traženi broj $x$. Uslov: ${2023 − x|2024 + x} = −{3|4}$ (uz $2024 + x ≠ 0$).',
        'Unakrsno: $4(2023 − x) = −3(2024 + x)$, tj. $8092 − 4x = −6072 − 3x$.',
        '$8092 + 6072 = 4x − 3x$, pa je $x = 14 164$.',
        'Provera: ${2023 − 14 164|2024 + 14 164} = {−12 141|16 188} = −{3|4}$ ✓ (oba broja su deljiva sa $4047$).',
      ]);
    Z(6, 4, 2,
      'Na stranicama $AB$, $AC$ i $BC$ trougla $ABC$ izabrane su redom tačke $D$, $E$ i $F$ takve da je $AD = AE$ i $BD = BF$. Ako je $∡EDF = 40°$, kolika je mera ugla $ACB$?',
      ['$100°$', '$80°$', '$140°$', '$110°$'],
      [
        K('Trouglovi $DEA$ i $FDB$ su jednakokraki ($AD = AE$, $BD = BF$). Neka je $∡ADE = x$ i $∡BDF = y$.', ['t1', 't2']),
        'U jednakokrakom trouglu $ADE$ uglovi na osnovici $DE$ su jednaki: $x = {180° − α|2}$. Slično u trouglu $BDF$: $y = {180° − β|2}$.',
        'Kod tačke $D$ uglovi $x$, $40°$ i $y$ čine opružen ugao: $x + y = 140°$.',
        '${180° − α|2} + {180° − β|2} = 140°$, tj. $360° − (α + β) = 280°$, pa je $α + β = 80°$.',
        '$γ = ∡ACB = 180° − 80° = 100°$.',
      ],
      G({ A: [0, 0, 225], B: [10, 0, -45], C: [1.736, 3.008, 90], D: [2.5, 0, -90], E: [1.25, 2.165, 160], F: [2.953, 2.565, 45] },
        [{ p: 'ABC' }, { d: 'DE' }, { d: 'DF' }, { u: 'EDF'.split('').reverse().join(''), o: '40°', b: 1 },
          { p: 'ADE', id: 't1', b: 2, k: 1 }, { p: 'BDF'.split('').reverse().join(''), id: 't2', b: 4, k: 1 }]));
    Z(6, 5, 3,
      'Koji je najmanji prirodan broj deljiv sa $4$, čiji je zbir cifara jednak $2024$?',
      ['$199…988$ ($223$ devetke između $1$ i $88$)', '$899…99$ ($224$ devetke posle $8$)', '$199…996$ ($224$ devetke između $1$ i $6$)', '$799…98$ ($223$ devetke)'],
      [
        'Da bi broj bio što manji, treba da ima što manje cifara – a to znači što više devetki. $2024 = 224 · 9 + 8$, pa bi najmanji broj bez uslova deljivosti imao $225$ cifara: $8$ i $224$ devetke.',
        'Ali broj od $225$ cifara sa zbirom $2024$ mora biti sastavljen od devetki i jedne osmice, a poslednje dve cifre su tada $89$, $98$ ili $99$ – nijedan nije deljiv sa $4$. Zato traženi broj ima bar $226$ cifara.',
        'Da bi broj od $226$ cifara bio najmanji, prva cifra je $1$. Ostalih $225$ cifara imaju zbir $2023 = 223 · 9 + 16$: to su $223$ devetke i još dve cifre sa zbirom $16$ – $9 + 7$ ili $8 + 8$.',
        K('Poslednje dve cifre određuju deljivost sa $4$: od $79, 97, 88, 99, 89, 98$ samo je $88$ deljiv sa $4$. Najmanji raspored: $1$, pa $223$ devetke, pa $88$.', [], C.tabela([['~završetak', 79, 97, 88, 89, 98, 99], ['~deljiv sa 4?', '~ne', '~ne', '~da', '~ne', '~ne', '~ne']], { istakni: [[0, 3], [1, 3]] })),
        'Traženi broj je $199…988$ sa $223$ devetke: zbir $1 + 223 · 9 + 8 + 8 = 2024$ ✓.',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Ceo broj $a$ i prirodan broj $n$ zadovoljavaju $a^{n} = {0,125^{4} · (−4,5)^{6} · (−0,375)^{6} · 125|2,25^{9} · 0,5^{18}}$. Kolika je vrednost desne strane (tj. $a^{n}$)?',
      ['$125$', '$25$', '$625$', '$5$'],
      [
        'Pretvorimo decimale u razlomke sa osnovama $2, 3, 5$: $0,125 = {1|8} = {1|2³}$, $4,5 = {9|2}$, $0,375 = {3|8}$, $2,25 = {9|4}$, $0,5 = {1|2}$.',
        'Paran izložilac briše minus: $0,125^{4} = {1|2^{12}}$, $(−4,5)^{6} = {3^{12}|2^{6}}$, $(−0,375)^{6} = {3^{6}|2^{18}}$, $125 = 5³$.',
        'Imenilac: $2,25^{9} = {3^{18}|2^{18}}$ i $0,5^{18} = {1|2^{18}}$, pa je imenilac ${3^{18}|2^{36}}$.',
        'Brojilac: ${3^{18} · 5³|2^{36}}$. Deljenjem: ${3^{18} · 5³|2^{36}} · {2^{36}|3^{18}} = 5³ = 125$.',
        'Dakle $a^{n} = 125$; zvanično rešenje: $a = 5$, $n = 3$. (Pazi: i $a = 125$, $n = 1$ zadovoljava jednakost.)',
      ]);
    Z(7, 2, 2,
      'Na koliko načina se broj $2024$ može prikazati kao proizvod tri različita prirodna broja? Redosled činilaca nije bitan.',
      ['$14$', '$12$', '$16$', '$10$'],
      [
        'Rastavimo: $2024 = 2³ · 11 · 23$. Prebrajamo trojke $a < b < c$ sa $a · b · c = 2024$, redom po najmanjem činiocu $a$.',
        '$a = 1$: $b · c = 2024$, $b < c$: $2 · 1012$, $4 · 506$, $8 · 253$, $11 · 184$, $22 · 92$, $23 · 88$, $44 · 46$ – $7$ načina.',
        '$a = 2$: $b · c = 1012$, $2 < b < c$: $4 · 253$, $11 · 92$, $22 · 46$, $23 · 44$ – $4$ načina.',
        '$a = 4$: $b · c = 506$, $4 < b < c$: $11 · 46$, $22 · 23$ – $2$ načina. $a = 8$: $b · c = 253 = 11 · 23$ – $1$ način. $a ≥ 11$ ne ide ($11 · 12 · 13 > 2024$).',
        K('Ukupno $7 + 4 + 2 + 1 = 14$.', [], C.tabela([['a', '~proizvodi b · c', '~broj'], [1, '2·1012, 4·506, 8·253, 11·184, 22·92, 23·88, 44·46', 7], [2, '4·253, 11·92, 22·46, 23·44', 4], [4, '11·46, 22·23', 2], [8, '11·23', 1]])),
      ]);
    Z(7, 3, 2,
      'Stranice trougla $ABC$ su $AB = 21 cm$, $BC = 17 cm$, $AC = 10 cm$. U unutrašnjosti trougla data je tačka $M$ čije je rastojanje od stranice $AB$ jednako $2 cm$, a od stranice $BC$ jednako $4 cm$. Koliko je rastojanje tačke $M$ od stranice $AC$?',
      ['$5,8 cm$', '$6 cm$', '$4,2 cm$', '$5 cm$'],
      [
        'Površinu računamo Heronovim obrascem: poluobim $s = {21 + 17 + 10|2} = 24$, pa je $P = √{24 · 3 · 7 · 14} = √{7056} = 84 cm²$.',
        K('Spojimo $M$ sa temenima: trougao se deli na trouglove $ABM$, $BCM$, $CAM$, a njihove visine su upravo rastojanja tačke $M$ od stranica.', ['t1', 't2', 't3']),
        '${21 · 2|2} + {17 · 4|2} + {10 · x|2} = 84$, tj. $21 + 34 + 5x = 84$.',
        '$5x = 29$, pa je $x = 5,8 cm$.',
      ],
      G({ A: [0, 0, 225], B: [21, 0, -45], C: [6, 8, 90], M: [8.75, 2, -60], H1: [8.75, 0], H2: [10.63, 5.53], H3: [4.11, 5.48] },
        [{ p: 'ABC' }, { tacka: 'M' }, { d: 'MH1', o: '2' }, { d: 'MH2', o: '4' }, { d: 'MH3', o: 'x', b: 1 }, { pu: 'MH1A' },
          { p: 'ABM', id: 't1', b: 2, k: 2 }, { p: 'BCM', id: 't2', b: 3, k: 2 }, { p: 'CAM', id: 't3', b: 4, k: 2 }],
        { bezImena: ['H1', 'H2', 'H3'] }));
    Z(7, 4, 2,
      'Koliki je zbir svih prirodnih brojeva manjih od $1000$ čiji je proizvod sa brojem $7$ jednak kubu nekog prirodnog broja?',
      ['$441$', '$49$', '$392$', '$1764$'],
      [
        'Neka je $7x = y³$. Leva strana je deljiva sa $7$, pa je i $y³$ deljivo sa $7$; kako je $7$ prost, i $y$ je deljiv sa $7$: $y = 7k$.',
        '$7x = 343k³$, pa je $x = 49k³$.',
        'Uslov $x < 1000$: $k = 1$ daje $49$, $k = 2$ daje $392$, a $k = 3$ daje $1323 > 1000$.',
        'Brojevi su $49$ ($7 · 49 = 343 = 7³$) i $392$ ($7 · 392 = 2744 = 14³$). Zbir: $441$.',
      ]);
    Z(7, 5, 2,
      'Neka je $D$ tačka hipotenuze $AB$ pravouglog trougla $ABC$ takva da je $CA = CD = √5$ i $CB = 2√5$. Kolika je površina trougla $BCD$?',
      ['$3$', '$5$', '$2$', '$4$'],
      [
        'Hipotenuza: $AB = √{5 + 20} = 5$. Površina trougla $ABC$: ${√5 · 2√5|2} = 5$.',
        'Neka je $E$ podnožje visine iz $C$ na $AB$. Iz $P = {AB · CE|2}$: $5 = {5 · CE|2}$, pa je $CE = 2$.',
        K('Trougao $ACD$ je jednakokrak ($CA = CD$), pa visina $CE$ polovi osnovicu $AD$: $AE = ED = √{5 − 4} = 1$, $AD = 2$.', ['t1']),
        '$BD = AB − AD = 3$. Obim trougla $BCD$: $3 + 2√5 + √5 = 3 + 3√5$.',
        'Površina trougla $BCD$: ${BD · CE|2} = {3 · 2|2} = 3$ (ili $5 − P_{ACD} = 5 − {2 · 2|2} = 3$).',
      ],
      G({ C: [0, 0, 225], A: [0, 2.236, 135], B: [4.472, 0, -45], E: [0.894, 1.789, 90], D: [1.789, 1.342, 45] },
        [{ p: 'ABC' }, { pu: 'ACB' }, { d: 'CD' }, { d: 'CE', isp: 1, k: 2 }, { pu: 'CEA', k: 2 }, { p: 'ACD', id: 't1', b: 2, k: 3 }, { p: 'BCD', b: 4, k: 5 }]));

    // ───────── VIII razred ─────────
    Z(8, 1, 1,
      'Izračunaj vrednost izraza ${2^{7n + 3} · 2^{6n − 5}|2^{12n} : 2^{9n}} : {2^{7n − 9} · 2^{5n − 4}|2^{2n − 3} · 2³} − 3 · 2³$.',
      ['$2024$', '$2048$', '$2000$', '$1024$'],
      [
        'Pri množenju stepena iste osnove izložioci se sabiraju, a pri deljenju oduzimaju.',
        'Prvi razlomak: brojilac $2^{13n − 2}$, imenilac $2^{3n}$, pa je razlomak $2^{10n − 2}$.',
        'Drugi razlomak: brojilac $2^{12n − 13}$, imenilac $2^{2n}$, pa je razlomak $2^{10n − 13}$.',
        'Količnik: $2^{(10n − 2) − (10n − 13)} = 2^{11} = 2048$ – broj $n$ potpuno nestaje!',
        '$2048 − 3 · 8 = 2048 − 24 = 2024$.',
      ]);
    Z(8, 2, 2,
      'Osnovna ivica pravilne šestostrane prizme četiri puta je kraća od njene visine, a zbir visine i osnovne ivice je $30 cm$. Kolika je zapremina prizme?',
      ['$1296√3 cm³$', '$864√3 cm³$', '$1296 cm³$', '$648√3 cm³$'],
      [
        'Neka je ivica $a$, visina $H = 4a$. Tada je $a + 4a = 30$, pa je $a = 6 cm$ i $H = 24 cm$.',
        K('Osnova je pravilan šestougao – šest jednakostraničnih trouglova stranice $6$: $B = 6 · {6²√3|4} = 54√3 cm²$.', [], (() => { const t = C.pravilni(6, 3); return G({ ...t, O: [0, 0] }, [{ p: 'ABCDEF' }, ...'ABCDEF'.split('').map((n, i) => ({ p: 'O' + n + 'ABCDEF'[(i + 1) % 6], b: i % 2 ? 2 : 4 }))], { bezImena: ['O'] }); })()),
        'Omotač: $M = 6 · a · H = 6 · 6 · 24 = 864 cm²$, pa je površina $P = 2B + M = 108√3 + 864 = 108(√3 + 8) cm²$.',
        K('Zapremina: $V = B · H = 54√3 · 24 = 1296√3 cm³$.', [], C.prizma(6, 3, 12)),
      ]);
    Z(8, 3, 2,
      'Raja, Gaja i Vlaja dele klikere. Prvo Raja uzme trećinu svih klikera, Gaja jednu trećinu ostatka i Vlaja jednu trećinu klikera preostalih posle Raje i Gaje. Ostatak klikera podele na jednake delove. Ukoliko je Gaja dobio $130$ klikera, koliko je klikera bilo pre deobe?',
      ['$405$', '$390$', '$486$', '$351$'],
      [
        'Neka je klikera bilo $x$. Raja uzima ${1|3}x$, ostaje ${2|3}x$.',
        'Gaja uzima ${1|3} · {2|3}x = {2|9}x$, ostaje ${4|9}x$. Vlaja uzima ${1|3} · {4|9}x = {4|27}x$, ostaje ${8|27}x$.',
        'Ostatak dele na tri jednaka dela: svako dobija ${8|81}x$.',
        'Gaja ukupno: ${2|9}x + {8|81}x = {18 + 8|81}x = {26|81}x = 130$, pa je $x = 130 · {81|26} = 405$.',
        K('Provera: Raja $135 + 40$, Gaja $90 + 40 = 130$ ✓, Vlaja $60 + 40$; zbir $175 + 130 + 100 = 405$ ✓.', [], C.stubici([['Raja', 175], ['Gaja', 130], ['Vlaja', 100]], { korakY: 50, maxY: 200, vrednosti: true, istakni: [1] })),
      ]);
    Z(8, 4, 2,
      'Vanja u kasici ima samo novčiće od $2$ i $5$ dinara (dovoljno za svaku kombinaciju). Na koliko načina može da plati loptu od $2024$ dinara koristeći samo novčiće iz kasice?',
      ['$203$', '$202$', '$405$', '$101$'],
      [
        'Neka je $x$ broj novčića od $2$, a $y$ od $5$ dinara: $2x + 5y = 2024$, $x, y ≥ 0$ celi.',
        '$5y = 2024 − 2x = 2(1012 − x)$ je paran, pa je $y$ paran: $y = 2k$, $k ≥ 0$.',
        'Tada je $2x = 2024 − 10k$, tj. $x = 1012 − 5k$. Uslov $x ≥ 0$: $k ≤ 202,4$, pa je $k ∈ \\{0, 1, …, 202\\}$.',
        K('Svako $k$ daje jedno plaćanje – ukupno $203$ načina.', [], C.tabela([['k', 0, 1, 2, '…', 202], ['~petica y = 2k', 0, 2, 4, '…', 404], ['~dvojki x', 1012, 1007, 1002, '…', 2]])),
      ]);
    Z(8, 5, 3,
      'Dve kružnice poluprečnika $r$ dodiruju se spolja. Iz centra jedne kružnice konstruisane su tangente na drugu kružnicu (vidi sliku). Kolika je površina osenčene figure (između tangenti i dve kružnice)?',
      ['$r²(√3 − {π|2})$', '$r²(2√3 − π)$', '$r²(√3 − {π|3})$', '$r²({π|2} − 1)$'],
      [
        K('Neka su $O_{1}$, $O_{2}$ centri i $A$, $B$ dodirne tačke tangenti sa drugom kružnicom. Pravougli trouglovi $O_{1}O_{2}A$ i $O_{1}O_{2}B$ (pravi ugao u dodirnoj tački) su podudarni, a $AO_{1}BO_{2}$ je deltoid.', ['d']),
        'U trouglu $O_{1}O_{2}A$ hipotenuza je $O_{1}O_{2} = 2r$, a kateta $O_{2}A = r$ – polovina hipotenuze, pa je $∡AO_{1}O_{2} = 30°$ i $∡AO_{2}O_{1} = 60°$. Druga kateta: $O_{1}A = r√3$.',
        'Površina deltoida: $2 · {r · r√3|2} = r²√3$.',
        'Od deltoida oduzmemo dva kružna isečka: isečak prve kružnice sa uglom $2 · 30° = 60°$ (površina ${1|6}r²π$) i isečak druge kružnice sa uglom $2 · 60° = 120°$ (površina ${1|3}r²π$).',
        'Osenčeno: $r²√3 − {1|6}r²π − {1|3}r²π = r²√3 − {1|2}r²π = r²(√3 − {π|2})$ (≈ $0,16r²$).',
      ],
      G({ O1: [0, 0, 225], O2: [4, 0, -45], A: [3, 1.732, 90], B: [3, -1.732, -90], t1: [6.5, 3.753], t2: [6.5, -3.753] },
        [{ kr: 'O1', r: 2 }, { kr: 'O2', r: 2 }, { d: 'O1t1' }, { d: 'O1t2' }, { tacka: 'O1' }, { tacka: 'O2' },
          { lin: [[1.732, 1], [3, 1.732], ...C.luk(4, 0, 2, 120, 180, 12), ...C.luk(0, 0, 2, 0, 30, 8)], zatv: 1, b: 1, gusto: 1 },
          { lin: [[1.732, -1], [3, -1.732], ...C.luk(4, 0, 2, 240, 180, 12), ...C.luk(0, 0, 2, 0, -30, 8)], zatv: 1, b: 1, gusto: 1 },
          { p: 'AO1BO2', id: 'd', b: 2, k: 1, prazno: 1 }, { d: 'O2A', k: 1 }, { d: 'O2B', k: 1 }, { pu: 'O1AO2', k: 1 }]));
  },
};
