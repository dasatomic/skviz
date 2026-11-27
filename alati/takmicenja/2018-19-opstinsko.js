// Opštinsko takmičenje iz matematike učenika osnovnih škola, 2. 3. 2019. (DMS)
// https://dms.rs/wp-content/uploads/2019/03/Opstinsko-takmicenje-OS-2019.pdf (samo postavke – rešenja su naša, provereni računom)
module.exports = {
  godina: '2018/19', nivo: 'opstinsko', datum: '2. 3. 2019.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 2,
      'Ana, Beca i Veca su merile ivice drvenog kvadra. Svaka je izmerila tri ivice iz istog temena i još po jednu ivicu iz nekog drugog temena, pa sabrala četiri dužine. Dobile su $29 cm$, $31 cm$ i $32 cm$. Kolika je površina kvadra?',
      ['$348 cm²$', '$288 cm²$', '$432 cm²$', '$174 cm²$'],
      [
        'Neka su dužina, širina i visina $a, b, c$. Tri ivice iz jednog temena su baš $a, b, c$ (po jedna od svake vrste), pa je svaki zbir $a + b + c$ plus još jedna ivica.',
        'Dodatne ivice su $29 − s$, $31 − s$, $32 − s$ ($s = a + b + c$) – tri različita broja, a svaka ivica kvadra ima dužinu $a$, $b$ ili $c$. Zato su dodatne ivice baš $a$, $b$, $c$ (u nekom redu).',
        'Saberemo sva tri zbira: $3s + (a + b + c) = 4s = 29 + 31 + 32 = 92$, pa je $s = 23$, a ivice su $29 − 23 = 6$, $31 − 23 = 8$, $32 − 23 = 9$.',
        K('Površina: $P = 2(6 · 8 + 6 · 9 + 8 · 9) = 2(48 + 54 + 72) = 348 cm²$.', [], C.kvadar(9, 6, 8)),
      ]);
    Z(5, 2, 1,
      'Koliko ima parova $(p, n)$, gde je $p$ prost broj, a $n$ prirodan broj, takvih da je ${p|15} = {2019|n}$?',
      ['$3$', '$2$', '$4$', '$1$'],
      [
        'Unakrsno: $p · n = 15 · 2019$.',
        'Rastavimo: $15 · 2019 = 3 · 5 · 3 · 673$ ($673$ je prost). Prost broj $p$ mora biti jedan od prostih činilaca: $3$, $5$ ili $673$.',
        K('Za svaki $p$ dobijamo $n = {30 285|p}$.', [], C.tabela([['p', 3, 5, 673], ['n', 10095, 6057, 45]])),
        'Tri para: $(3, 10095)$, $(5, 6057)$, $(673, 45)$.',
      ]);
    Z(5, 3, 3,
      'Zapisani su redom prirodni brojevi od $1$ do $10 000$ bez razmaka. Koliko se puta u tom nizu pojavljuje niz cifara $2019$?',
      ['$3$', '$1$', '$2$', '$4$'],
      [
        'Niz $2019$ može biti unutar jednog broja ili preći preko granice dva uzastopna broja.',
        'Unutar jednog broja: samo sam broj $2019$ (brojeva sa pet cifara do $10 000$ ima samo jedan, $10000$).',
        'Preko granice: $2019$ se deli na kraj jednog broja i početak sledećeg kao $2|019$, $20|19$ ili $201|9$.',
        K('$2|019$ – nemoguće (broj ne počinje nulom). $20|19$ – broj se završava sa $20$, a sledeći (za $1$ veći, završava se sa $21$) počinje sa $19$: samo $1920 | 1921$. $201|9$ – broj se završava sa $201$, a sledeći počinje sa $9$: samo $9201 | 9202$.', [], C.tabela([['~gde', '1920 | 1921', '2019', '9201 | 9202'], ['~zapis', '19201921', '2019', '92019202']])),
        'Ukupno $3$ puta.',
      ]);
    Z(5, 4, 2,
      'Koja su dva najmanja prirodna broja čiji je zbir cifara jednak $2019$?',
      ['$399…9$ i $4899…9$ ($224$, odnosno $223$ devetke)', '$399…9$ i $499…9$', '$2019$ i $2028$', '$99…93$ i $99…94$'],
      [
        'Da bi broj bio mali, treba što manje cifara – a to znači što više devetki. $2019 = 9 · 224 + 3$: najmanje cifara je $225$ (jedna cifra $3$ i $224$ devetke).',
        'Najmanji: manja cifra ide napred: $3$ pa $224$ devetke: $399…9$.',
        'Sledeći po veličini: sa $225$ cifara i prvom cifrom $3$ drugih ne ima (ostatak mora biti sve devetke). Prva cifra $4$: ostatak ($224$ cifre) ima zbir $2015 = 223 · 9 + 8$ – najmanje je $8$ pa $223$ devetke.',
        'Drugi najmanji: $4899…9$ (posle $4$ i $8$ ide $223$ devetke).',
      ]);
    Z(5, 5, 1,
      'Koliko ima trocifrenih brojeva deljivih sa $9$ kojima su sve cifre prosti brojevi?',
      ['$4$', '$3$', '$6$', '$7$'],
      [
        'Proste cifre su $2, 3, 5, 7$. Zbir tri takve cifre je između $6$ i $21$, a mora biti deljiv sa $9$: $9$ ili $18$.',
        'Zbir $9$: $2 + 2 + 5$ ili $3 + 3 + 3$. Zbir $18$: od cifara $2, 3, 5, 7$ ne može ($7 + 7 + 4$, $7 + 5 + 6$… treća cifra nije prosta).',
        K('Brojevi: $225, 252, 522$ i $333$ – četiri.', [], C.tabela([['~cifre', '2, 2, 5', '3, 3, 3'], ['~brojevi', '225, 252, 522', 333]])),
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Koliko ima trouglova obima $49$ čije su dužine stranica prosti brojevi?',
      ['$5$', '$4$', '$6$', '$3$'],
      [
        'Neka je $a ≤ b ≤ c$, $a + b + c = 49$. Ako je $a = 2$: $b + c = 47$, a nejednakost trougla $c < 2 + b$ (uz $b ≤ c$) daje $c = b$ ili $c = b + 1$; zbir $47$ je neparan, pa $b = 23$, $c = 24$ – nije prost. Dakle sve stranice su neparni prosti brojevi.',
        'Nejednakost trougla: $c < a + b = 49 − c$, pa je $c ≤ 24$, a $c ≥ 17$ (najveća je bar trećina). Prosti $c$: $17, 19, 23$.',
        K('Proverom: $(3, 23, 23)$, $(7, 19, 23)$, $(13, 13, 23)$, $(11, 19, 19)$, $(13, 17, 19)$.', [], C.tabela([['c', 23, 23, 23, 19, 19], ['b', 23, 19, 13, 19, 17], ['a', 3, 7, 13, 11, 13]])),
        'Za $c = 17$: $a + b = 32$ sa $a ≤ b ≤ 17$ – $b = 17$ daje $a = 15$ (nije prost), pa nema. Ukupno $5$.',
      ]);
    Z(6, 2, 1,
      'Ako je $a + b = −0,7$, kako su po veličini poređane vrednosti izraza $|a + b − 0,5|$, $|−2 − a − b|$ i $|a + 0,3 + b − 1|$?',
      ['$|a + b − 0,5| < |−2 − a − b| < |a + 0,3 + b − 1|$', '$|−2 − a − b| < |a + b − 0,5| < |a + 0,3 + b − 1|$', '$|a + 0,3 + b − 1| < |−2 − a − b| < |a + b − 0,5|$', 'sva tri su jednaka'],
      [
        'Svaki izraz zavisi samo od zbira $a + b = −0,7$.',
        '$|−0,7 − 0,5| = |−1,2| = 1,2$; $|−2 − (a + b)| = |−2 + 0,7| = 1,3$; $|(a + b) + 0,3 − 1| = |−1,4| = 1,4$.',
        K('Poredak: $1,2 < 1,3 < 1,4$.', [], C.brojevna(1, 1.5, [[1.2, '1,2', 1], [1.3, '1,3', 2], [1.4, '1,4', 3]], { podela: 0.1, svaki: 1 })),
      ]);
    Z(6, 3, 3,
      'U jednakokrakom trouglu $ABC$ sa kracima $AB$ i $AC$ simetrala kraka $AC$ i simetrala ugla $BCA$ seku se u tački koja pripada kraku $AB$. Koliki su uglovi trougla?',
      ['$∡A = 36°$, $∡B = ∡C = 72°$', '$∡A = 90°$, $∡B = ∡C = 45°$', '$∡A = 60°$, $∡B = ∡C = 60°$', '$∡A = 108°$, $∡B = ∡C = 36°$'],
      [
        'Neka je $P$ ta tačka na $AB$, ugao kod $A$ $α$, uglovi na osnovici $β$.',
        K('$P$ je na simetrali duži $AC$, pa je $PA = PC$: trougao $APC$ je jednakokrak i $∡PCA = ∡PAC = α$.', ['t']),
        '$CP$ je simetrala ugla $C$: $∡PCA = {β|2}$. Dakle $α = {β|2}$, tj. $β = 2α$.',
        '$α + 2β = 180°$: $α + 4α = 180°$, $α = 36°$, $β = 72°$ – to je „zlatni trougao“.',
      ],
      G({ B: [0, 0, 225], C: [2, 0, -45], A: [1, 3.078, 90], P: [0.382, 1.176, 180], m: [1.5, 1.539], s1: [0.047, 1.067], s2: [1.947, 1.684] },
        [{ p: 'ABC' }, { d: 'CP', b: 1 }, { d: 's1s2', isp: 1, b: 4 }, { pu: 'PmC' }, { tacka: 'P' }, { p: 'APC', id: 't', b: 2, k: 2 }]));
    D(6, 4, 2,
      'Na olimpijadi učestvuje $2019$ takmičara. Dokaži da postoji zemlja iz koje je došlo najmanje $64$ takmičara ili da na olimpijadi učestvuju takmičari iz najmanje $33$ zemlje.',
      [
        'Pretpostavimo suprotno: iz svake zemlje je najviše $63$ takmičara, a zemalja je najviše $32$.',
        'Tada je takmičara najviše $32 · 63 = 2016 < 2019$ – kontradikcija.',
        'Zato je ili neka zemlja dovela bar $64$ takmičara, ili ima bar $33$ zemlje. (Druge tvrdnje ne moraju da važe: npr. $2019$ zemalja po jedan takmičar.)',
      ]);
    Z(6, 5, 3,
      'Na koliko se načina broj $450$ može predstaviti kao proizvod šest različitih celih brojeva čija apsolutna vrednost nije veća od $6$? (Redosled činilaca nije bitan.)',
      ['$4$', '$2$', '$6$', '$8$'],
      [
        '$450 = 2 · 3² · 5²$. Činioci su različiti, sa apsolutnom vrednošću do $6$, i nijedan nije $0$. Dve petice moraju biti iz $5$ i $−5$ (jedini brojevi deljivi sa $5$).',
        'Ostaje četiri različita broja iz $\\{±1, ±2, ±3, ±4, ±6\\}$ sa proizvodom $±18$ (znak tako da ukupan proizvod bude pozitivan; $5 · (−5) = −25$, pa ostatak mora dati $−18$).',
        K('Proverom svih mogućnosti dobijaju se tačno četiri rastavljanja:', [], C.tabela([['(−5) · 5 ·', '1 · 3 · 6 · (−1)'], ['(−5) · 5 ·', '(−3) · (−2) · (−1) · 3'], ['(−5) · 5 ·', '(−3) · 1 · 2 · 3'], ['(−5) · 5 ·', '(−6) · (−3) · (−1) · 1']], { zaglavlje: false })),
        'Npr. $(−5) · 5 · (−6) · (−3) · (−1) · 1 = −25 · (−18) = 450$ ✓. Odgovor: $4$.',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Odredi prirodan broj $n$ tako da važi a) ${3 · 5^{9} + 2 · 5^{9}|5^{6}} = 5^{n}$; b) ${3^{12} · 9^{11} : 27^{10}|3^{n}} = 3$.',
      ['a) $n = 4$, b) $n = 3$', 'a) $n = 3$, b) $n = 4$', 'a) $n = 4$, b) $n = 4$', 'a) $n = 9$, b) $n = 3$'],
      [
        'a) $3 · 5^{9} + 2 · 5^{9} = 5 · 5^{9} = 5^{10}$, pa je ${5^{10}|5^{6}} = 5^{4}$: $n = 4$.',
        'b) $9^{11} = 3^{22}$, $27^{10} = 3^{30}$: $3^{12} · 3^{22} : 3^{30} = 3^{4}$.',
        '${3^{4}|3^{n}} = 3^{4 − n} = 3^{1}$, pa je $n = 3$.',
      ]);
    Z(7, 2, 2,
      'Koji su najmanji i najveći prirodan broj $x$ za koje je broj $a = √{66 − √{x + 1}}$ takođe prirodan?',
      ['$x = 3$ i $x = 4224$', '$x = 0$ i $x = 4225$', '$x = 3$ i $x = 4355$', '$x = 8$ i $x = 4224$'],
      [
        'Neka je $a = k$ (prirodan). Tada $√{x + 1} = 66 − k²$ – ceo broj, pa je $x + 1$ potpun kvadrat: $√{x + 1} = m$, $m = 66 − k²$, $x = m² − 1$.',
        'Uslovi: $x ≥ 1$ ⇒ $m ≥ 2$; $k ≥ 1$. Moguće $k = 1, …, 8$ ($9² = 81 > 64$).',
        K('$m = 66 − k²$: $65, 62, 57, 50, 41, 30, 17, 2$.', [], C.tabela([['k', 1, 2, 3, 4, 5, 6, 7, 8], ['m = 66 − k²', 65, 62, 57, 50, 41, 30, 17, 2], ['x = m² − 1', 4224, 3843, 3248, 2499, 1680, 899, 288, 3]], { istakni: [[2, 1], [2, 8]] })),
        'Najmanji $x = 2² − 1 = 3$ (tada $a = √{66 − 2} = 8$), najveći $x = 65² − 1 = 4224$ (tada $a = √{66 − 65} = 1$).',
      ]);
    Z(7, 3, 2,
      'Koliko treba da bude razlomaka u izrazu ${x² · x³|x} · {x³ · x^{4}|x²} · {x^{4} · x^{5}|x³} · …$ da bi njegova vrednost bila $x^{2010}$?',
      ['$60$', '$62$', '$57$', '$670$'],
      [
        '$k$-ti razlomak je ${x^{k + 1} · x^{k + 2}|x^{k}} = x^{k + 3}$: prvi $x^{4}$, drugi $x^{5}$, treći $x^{6}$…',
        'Proizvod $n$ razlomaka: $x^{4 + 5 + … + (n + 3)}$. Zbir izložilaca: $(1 + 2 + … + n) + 3n = {n(n + 1)|2} + 3n$.',
        '${n(n + 1)|2} + 3n = 2010$ ⇒ $n² + 7n − 4020 = 0$.',
        K('Probamo: $n = 60$: $1830 + 180 = 2010$ ✓. Dakle $60$ razlomaka.', [], C.tabela([['n', 58, 59, 60, 61], ['n(n+1)/2 + 3n', 1885, 1947, 2010, 2074]], { istakni: [[1, 3]] })),
      ]);
    Z(7, 4, 2,
      'U pravougaoniku $ABCD$ ($AB = 10 cm$, $BC = 7 cm$) smešten je pravougaonik $A\'B\'C\'D\'$ ($A\'B\' = 4 cm$, $B\'C\' = 3 cm$) sa paralelnim stranicama (vidi sliku). Šta je veće – zbir površina trapeza $ABB\'A\'$ i $CDD\'C\'$ ili zbir površina trapeza $ADD\'A\'$ i $BCC\'B\'$?',
      ['Zbir $ADD\'A\'$ i $BCC\'B\'$ ($30 cm²$ prema $28 cm²$)', 'Zbir $ABB\'A\'$ i $CDD\'C\'$', 'Jednaki su', 'Zavisi od položaja unutrašnjeg pravougaonika'],
      [
        'Trapezi $ABB\'A\'$ i $CDD\'C\'$ imaju osnovice $10$ i $4$, a zbir njihovih visina je $7 − 3 = 4$ (rastojanja od $AB$ i $CD$).',
        K('Zbir površina: ${10 + 4|2} · h_{1} + {10 + 4|2} · h_{2} = 7 · 4 = 28 cm²$ – ne zavisi od položaja!', ['t1', 't2']),
        K('Trapezi $ADD\'A\'$ i $BCC\'B\'$: osnovice $7$ i $3$, zbir visina $10 − 4 = 6$: ${7 + 3|2} · 6 = 30 cm²$.', ['t3', 't4']),
        'Veći je zbir $ADD\'A\'$ i $BCC\'B\'$. Provera: $28 + 30 = 58 = 70 − 12$ ✓.',
      ],
      G({ A: [0, 0, 225], B: [10, 0, -45], C: [10, 7, 45], D: [0, 7, 135], "A'": [3, 2, 225], "B'": [7, 2, -45], "C'": [7, 5, 45], "D'": [3, 5, 135] },
        [{ p: 'ABCD', prazno: 1 }, { p: "A'B'C'D'", prazno: 1 }, { d: "AA'" }, { d: "BB'" }, { d: "CC'" }, { d: "DD'" },
          { p: "ABB'A'", id: 't1', b: 1, k: 2 }, { p: "CDD'C'", id: 't2', b: 1, k: 2 }, { p: "ADD'A'", id: 't3', b: 2, k: 3 }, { p: "BCC'B'", id: 't4', b: 2, k: 3 }]));
    Z(7, 5, 3,
      'Na svakoj stranici trougla izabrane su četiri tačke, različite od temena. Koliko ima četvorouglova čija su temena neke od $12$ izabranih tačaka?',
      ['$396$', '$495$', '$399$', '$384$'],
      [
        'Četiri tačke od $12$ biramo na ${12 · 11 · 10 · 9|24} = 495$ načina.',
        'Četvorougao ne nastaje ako su bar tri izabrane tačke na istoj stranici (kolinearne).',
        K('Tačno tri na jednoj stranici i četvrta na drugoj: $3 · 4 · 8 = 96$ ($3$ stranice, $4$ načina za trojku, $8$ tačaka za četvrtu). Sve četiri na jednoj stranici: $3$.', [], C.tabela([['~sve četvorke', '~3 kolinearne', '~4 kolinearne', '~četvorouglova'], [495, 96, 3, 396]])),
        'Ostale četvorke ($495 − 99 = 396$) daju po tačno jedan konveksan četvorougao (tačke na obodu trougla su u konveksnom položaju).',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Reši jednačinu $√{x² − 3x + {9|4}} = 1 + √{4 − 2√3}$.',
      ['$x = {3|2} ± √3$', '$x = {3|2} + √3$', '$x = {5|2}$ ili $x = {1|2}$', '$x = {3|2} ± (2 − √3)$'],
      [
        'Leva strana: $x² − 3x + {9|4} = (x − {3|2})²$, pa je $√{(x − {3|2})²} = |x − {3|2}|$.',
        'Desna: $4 − 2√3 = 3 − 2√3 + 1 = (√3 − 1)²$, pa je $√{4 − 2√3} = √3 − 1$ (pozitivno). Desna strana: $1 + √3 − 1 = √3$.',
        K('$|x − {3|2}| = √3$, pa je $x = {3|2} + √3 ≈ 3,23$ ili $x = {3|2} − √3 ≈ −0,23$.', [], C.brojevna(-1, 4, [[-0.232, '3/2 − √3', 1], [1.5, '3/2', 4], [3.232, '3/2 + √3', 1]], { podela: 1, svaki: 1 })),
      ]);
    D(8, 2, 2,
      'Dokaži da je broj $S = 1 + 7 + 7² + 7³ + … + 7^{2018}$ deljiv sa $19$.',
      [
        'Sabiraka ima $2019$ – deljivo sa $3$.',
        K('Grupišemo po tri: $1 + 7 + 49 = 57 = 3 · 19$, i svaka sledeća trojka je ta ista pomnožena stepenom: $7³(1 + 7 + 49)$, $7^{6}(1 + 7 + 49)$, …', [], C.tabela([['~trojka', '1 + 7 + 7²', '7³(1 + 7 + 7²)', '…', '7²⁰¹⁶(1 + 7 + 7²)'], ['~vrednost', '57', '7³ · 57', '…', '7²⁰¹⁶ · 57']])),
        '$S = 57 · (1 + 7³ + 7^{6} + … + 7^{2016})$, a $57 = 3 · 19$. Ostatak je $0$.',
      ]);
    Z(8, 3, 2,
      'Površina omotača pravilne šestostrane prizme je $648 cm²$, a dijagonala bočne strane je $15 cm$. Kolika je površina prizme?',
      ['$648 + 243√3 cm²$ ili $648 + 432√3 cm²$', 'samo $648 + 243√3 cm²$', 'samo $648 + 432√3 cm²$', '$648 + 486√3 cm²$'],
      [
        'Neka je ivica osnove $a$, visina $H$. Omotač: $6aH = 648$, pa je $aH = 108$. Dijagonala bočne strane (pravougaonik $a × H$): $a² + H² = 225$.',
        '$(a + H)² = 225 + 216 = 441$, pa je $a + H = 21$; $(a − H)² = 225 − 216 = 9$, pa je $|a − H| = 3$.',
        K('Dva rešenja: $a = 9, H = 12$ ili $a = 12, H = 9$.', [], C.tabela([['a', 9, 12], ['H', 12, 9], ['2B = 3a²√3', '243√3', '432√3']])),
        'Površina $P = 2B + M = 2 · {3a²√3|2} + 648$: $648 + 243√3 cm²$ ili $648 + 432√3 cm²$.',
      ]);
    D(8, 4, 2,
      'Dokaži da je proizvod četiri uzastopna neparna prirodna broja uvećan za $16$ jednak kvadratu prirodnog broja.',
      [
        'Pomnožimo krajnje i srednje: $k(k + 6) = k² + 6k$ i $(k + 2)(k + 4) = k² + 6k + 8$.',
        'Smena $t = k² + 6k$: proizvod $+ 16$ je $t(t + 8) + 16 = t² + 8t + 16 = (t + 4)²$.',
        K('Dakle to je kvadrat broja $k² + 6k + 4$.', [], C.tabela([['k', 1, 3, 5], ['~proizvod + 16', '105 + 16 = 121', '945 + 16 = 961', '3465 + 16 = 3481'], ['k² + 6k + 4', 11, 31, 59]])),
      ]);
    Z(8, 5, 3,
      'Kružnice $k_{1}$ i $k_{2}$ jednakih poluprečnika, sa centrima $A$ i $B$, seku se u tačkama $C$ i $D$. Poluprave $AC$ i $AD$ seku $k_{2}$ još u tačkama $E$ i $F$. Ako je $∡CAD = 75°$, koliki je $∡EBF$?',
      ['$135°$', '$150°$', '$105°$', '$120°$'],
      [
        '$AC = BC$ (jednaki poluprečnici), pa je trougao $ABC$ jednakokrak: $∡CAB = ∡CBA = {75°|2} = 37° 30\'$ (prava $AB$ je osa simetrije), i $∡ACB = 105°$.',
        K('Trougao $BCE$ je jednakokrak ($BC = BE$). Ugao $∡BCE$ je uporedan sa $∡ACB$: $180° − 105° = 75°$, pa je $∡CBE = 180° − 2 · 75° = 30°$.', ['t1']),
        'Simetrično $∡DBF = 30°$, a $∡CBD = 2 · 37° 30\' = 75°$.',
        '$∡EBF = 30° + 75° + 30° = 135°$.',
      ],
      G({ A: [0, 0, 180], B: [6.347, 0, 0], C: [3.173, 2.435, 120], D: [3.173, -2.435, 240], E: [4.816, 3.696, 90], F: [4.816, -3.696, -90] },
        [{ kr: 'A', r: 4 }, { kr: 'B', r: 4, b: 2 }, { d: 'AE' }, { d: 'AF' }, { d: 'BE', b: 1 }, { d: 'BF', b: 1 }, { d: 'BC', isp: 1 }, { d: 'BD', isp: 1 }, { d: 'AB', isp: 1 }, { u: 'CAD', r: 26 }, { tx: '75°', at: [1.55, 0.55], vel: 13 }, { tx: 'k₁', at: [-3.4, 3.2] }, { tx: 'k₂', at: [9.8, 3.2], b: 2 }, { p: 'BCE', id: 't1', b: 3, k: 2 }]));
  },
};
