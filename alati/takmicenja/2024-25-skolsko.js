// Školsko takmičenje iz matematike učenika osnovnih škola, 13. 12. 2024. (DMS – zajednički zadaci za sve škole)
// https://dms.rs/skolsko-24-25-mat/ (Postavke-skolsko-24_25.pdf, Resenja-skolsko-24_25.pdf)
module.exports = {
  godina: '2024/25', nivo: 'skolsko', datum: '13. 12. 2024.',
  zadaci: ({ Z, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Izračunaj $x$, $y$ i $z$ ako je: $x = 48 − 8 · 5$, $y = 200 − 80 : x + 25$ i $z = 40 · (208 : x − 16)$. Koliko je $z$?',
      ['$400$', '$640$', '$8$', '$1600$'],
      [
        'Redosled računskih operacija: prvo množenje i deljenje, pa sabiranje i oduzimanje; zagrade pre svega.',
        '$x = 48 − 8 · 5 = 48 − 40 = 8$.',
        '$y = 200 − 80 : 8 + 25 = 200 − 10 + 25 = 215$ (pazi: $80 : 8$ se računa pre oduzimanja).',
        '$z = 40 · (208 : 8 − 16) = 40 · (26 − 16) = 40 · 10 = 400$.',
      ]);
    Z(5, 2, 1,
      'Na koliko jednakih delova treba podeliti duž $AB = 96 cm$, tako da rastojanje od središta prvog dela (čiji je jedan kraj tačka $A$) do središta duži $AB$ bude jednako $45 cm$?',
      ['$16$', '$32$', '$15$', '$8$'],
      [
        K('Neka je $S$ središte duži $AB$, a $A_{1}$ središte prvog dela $AC$. Tada je $AS = 96 : 2 = 48 cm$.', ['s']),
        'Tačka $A_{1}$ je između $A$ i $S$, a $A_{1}S = 45 cm$, pa je $AA_{1} = 48 − 45 = 3 cm$.',
        '$A_{1}$ je središte prvog dela, pa je taj deo dvostruko duži: $AC = 2 · 3 = 6 cm$.',
        'Broj delova: $96 : 6 = 16$.',
      ],
      G({ A: [0, 0, 270], B: [16, 0, 270], S: [8, 0, 270], C: [1, 0, 270], A1: [0.5, 0, 90] },
        [{ d: 'AB' }, { tacka: 'S', id: 's' }, { tacka: 'A1' }, { tacka: 'C' }, { d: 'A1S', b: 1, o: '45 cm', k: 2 }]));
    Z(5, 3, 2,
      'Odredi cifre $a$ i $b$ i prirodan broj $n$ tako da je $90 · n$ jednako šestocifrenom broju čije su cifre redom $1, 5, a, 1, 5, b$. Koliko je $n$?',
      ['$1735$', '$1725$', '$1745$', '$1635$'],
      [
        'Broj $90 · n$ je deljiv sa $90 = 10 · 9$, pa mora biti deljiv i sa $10$ i sa $9$.',
        'Deljiv sa $10$ ⇒ poslednja cifra je $0$: $b = 0$. Broj je $15a150$.',
        'Deljiv sa $9$ ⇒ zbir cifara $1 + 5 + a + 1 + 5 + 0 = 12 + a$ deljiv je sa $9$. Kako je $a$ cifra, $12 + a = 18$, pa je $a = 6$.',
        'Broj je $156 150$, pa je $n = 156 150 : 90 = 1735$.',
      ]);
    Z(5, 4, 2,
      'Koliki je zbir svih prirodnih brojeva koji pri deljenju sa $6$ daju isti količnik i ostatak?',
      ['$105$', '$126$', '$84$', '$70$'],
      [
        'Deljenje sa ostatkom: broj $= 6 · q + r$, gde je ostatak $r$ manji od $6$: $r ∈ \\{0, 1, 2, 3, 4, 5\\}$.',
        'Količnik je jednak ostatku: $q = r$, pa je broj $6 · q + q = 7 · q$.',
        K('Za $q = 0$ dobijamo $0$, koji nije prirodan broj. Ostaju $q = 1, 2, 3, 4, 5$: brojevi $7, 14, 21, 28, 35$ (npr. $35 = 6 · 5 + 5$ ✓).', [], C.tabela([['q = r', 1, 2, 3, 4, 5], ['6 · q + r', 7, 14, 21, 28, 35]], { sirina: [2.4, 1.2] })),
        'Zbir: $7 + 14 + 21 + 28 + 35 = 105$.',
      ]);
    Z(5, 5, 2,
      'Dati su skupovi $A = \\{1, 2, 3, 4, 5\\}$, $B = \\{1, 4, 6\\}$, $C = \\{1, 6, 7, 8\\}$ i $D = \\{2, 5, 6, 7\\}$. Koji skup $P$ ispunjava uslove: $P ⊂ A$, $(B ∪ C) ∩ P = ∅$, $(A ∩ D) \\ P = ∅$ i $\\{3\\} \\ P = \\{3\\}$?',
      ['$\\{2, 5\\}$', '$\\{2, 3, 5\\}$', '$\\{2, 4, 5\\}$', '$\\{1, 2, 5\\}$'],
      [
        '$(B ∪ C) ∩ P = ∅$: nijedan element skupa $B ∪ C = \\{1, 4, 6, 7, 8\\}$ nije u $P$.',
        '$\\{3\\} \\ P = \\{3\\}$: kad iz $\\{3\\}$ izbacimo elemente od $P$, ostaje $3$ – znači $3 ∉ P$.',
        '$(A ∩ D) \\ P = ∅$: svi elementi skupa $A ∩ D = \\{2, 5\\}$ moraju biti u $P$.',
        K('Kako je $P ⊂ A = \\{1, 2, 3, 4, 5\\}$, a $1, 3, 4$ ne smeju biti u $P$, dok $2$ i $5$ moraju, jedina mogućnost je $P = \\{2, 5\\}$.', [], C.tabela([['~element', 1, 2, 3, 4, 5], ['~u P?', '~ne', '~da', '~ne', '~ne', '~da']], { sirina: [2.2, 1.2], istakni: [[1, 2], [1, 5]] })),
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Izračunaj vrednost izraza $|1 − 2| + |2 − 3| + |3 − 4| + … + |2023 − 2024| + |2024 − 2025|$.',
      ['$2024$', '$−2024$', '$2025$', '$0$'],
      [
        'Svaki sabirak je apsolutna vrednost razlike dva uzastopna broja: $|1 − 2| = |−1| = 1$, $|2 − 3| = 1$, … – svaki je jednak $1$.',
        'Sabiraka ima onoliko koliko ima prvih brojeva u zagradama: od $1$ do $2024$, dakle $2024$.',
        'Zbir je $2024 · 1 = 2024$. (Bez apsolutnih vrednosti zbir bi bio $−2024$ – zato apsolutna vrednost menja sve.)',
      ]);
    Z(6, 2, 1,
      'Kada se polovini nepoznatog broja doda $28$, dobija se ${2|3}$ broja $−258$. Koji je nepoznati broj?',
      ['$−400$', '$−200$', '$−288$', '$400$'],
      [
        'Neka je nepoznati broj $x$. Uslov: ${1|2}x + 28 = {2|3} · (−258)$.',
        'Desna strana: ${2|3} · (−258) = −172$ (jer je $258 : 3 = 86$, a $2 · 86 = 172$).',
        '${1|2}x = −172 − 28 = −200$, pa je $x = −400$.',
        'Provera: ${1|2} · (−400) + 28 = −200 + 28 = −172$ ✓.',
      ]);
    Z(6, 3, 1,
      'Jedan unutrašnji ugao jednakokrakog tupouglog trougla je tri puta veći od drugog unutrašnjeg ugla tog trougla. Koje su mere unutrašnjih uglova?',
      ['$36°$, $36°$, $108°$', '$30°$, $30°$, $120°$', '$20°$, $20°$, $140°$', '$36°$, $72°$, $72°$'],
      [
        'Uglovi na osnovici jednakokrakog trougla su jednaki; označimo ih sa $α$.',
        'Trougao je tupougli, a dva tupa ugla ne mogu postojati u trouglu – zato je tup ugao pri vrhu, a uglovi na osnovici su oštri.',
        'Ugao koji je tri puta veći od drugog mora biti ugao pri vrhu (dva jednaka ugla na osnovici se ne razlikuju): ugao pri vrhu je $3α$.',
        K('$α + α + 3α = 180°$, tj. $5α = 180°$, pa je $α = 36°$. Uglovi su $36°$, $36°$ i $108°$ (tup ✓).', [], G({ A: [0, 0, 225], B: [8, 0, -45], C: [4, 2.906, 90] }, [{ p: 'ABC' }, { u: 'CAB', o: '36°' }, { u: 'ABC'.split('').reverse().join(''), o: '36°' }, { u: 'BCA'.split('').reverse().join(''), o: '108°', b: 1 }])),
        'Pazi: $20°, 20°, 140°$ ima tup ugao, ali $140°$ je $7$ puta veći od $20°$.',
      ]);
    Z(6, 4, 2,
      'Koji su najmanji i najveći petocifreni broj kome su sve cifre različite, a deljiv je sa $9$?',
      ['$10 269$ i $98 730$', '$10 125$ i $98 765$', '$12 348$ i $98 721$', '$10 269$ i $98 721$'],
      [
        'Broj je deljiv sa $9$ ako mu je zbir cifara deljiv sa $9$.',
        'Petocifreni broj sa različitim ciframa ima zbir cifara najmanje $1 + 0 + 2 + 3 + 4 = 10$, a najviše $9 + 8 + 7 + 6 + 5 = 35$. Mogući zbirovi deljivi sa $9$ su $18$ i $27$.',
        'Najmanji: počinje sa $1, 0, 2$ (najmanje moguće), a preostale dve cifre treba da daju $18 − 3 = 15$: najmanja moguća četvrta cifra je $6$ (uz $9$), pa je broj $10 269$.',
        'Najveći: počinje sa $9, 8, 7$, a preostale dve cifre daju $27 − 24 = 3$: najveća četvrta je $3$ (uz $0$), pa je broj $98 730$.',
        'Za najveći zbir $36$ nema mesta ($35$ je maksimum), a $98 7xx$ sa zbirom $18$ bi bio manji – zato je $98 730$ najveći.',
      ]);
    Z(6, 5, 2,
      'U trouglu $ABC$ simetrale spoljašnjih uglova kod temena $C$ i $B$ seku se u tački $D$. Kolika je mera ugla $BDC$, ako je $∡BAC = 65°$?',
      ['$57° 30\'$', '$122° 30\'$', '$65°$', '$32° 30\'$'],
      [
        'Neka su unutrašnji uglovi $α, β, γ$, a spoljašnji $β_{1} = 180° − β$ i $γ_{1} = 180° − γ$. Simetrale dele spoljašnje uglove na pola.',
        'U trouglu $BCD$ uglovi kod $B$ i $C$ su ${β_{1}|2}$ i ${γ_{1}|2}$, pa je $∡BDC = 180° − {β_{1} + γ_{1}|2}$.',
        'Zbir spoljašnjih uglova trougla je $360°$: $α_{1} + β_{1} + γ_{1} = 360°$, a $α_{1} = 180° − 65° = 115°$, pa je $β_{1} + γ_{1} = 245°$.',
        K('${β_{1} + γ_{1}|2} = 122° 30\'$, pa je $∡BDC = 180° − 122° 30\' = 57° 30\'$.', [], G({ A: [0, 0, 225], B: [5, 0, -90], C: [2.234, 4.791, 135], D: [7.909, 5.039, 45], X: [9, 0], Y: [3.6, 7.7] }, [{ p: 'ABC' }, { d: 'BX', isp: 1 }, { d: 'CY', isp: 1 }, { d: 'BD', b: 1 }, { d: 'CD', b: 1 }, { u: 'CAB', o: '65°' }, { u: 'BDC', o: 'δ', b: 2 }])),
        'Opšta formula: $∡BDC = 90° − {α|2}$, ovde $90° − 32° 30\' = 57° 30\'$.',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Izračunaj vrednost izraza $24 · √{{13|36} + 3} + 2 · √{4 · (−0,36)²} − (−0,6)² + 8 · ({3|4})²$.',
      ['$49,58$', '$48,14$', '$50,3$', '$45,08$'],
      [
        'Prvi sabirak: ${13|36} + 3 = {13 + 108|36} = {121|36}$, pa je $√{{121|36}} = {11|6}$ i $24 · {11|6} = 44$.',
        'Drugi: $√{4 · (−0,36)²} = 2 · |−0,36| = 0,72$, pa je $2 · 0,72 = 1,44$.',
        'Treći: $(−0,6)² = 0,36$ (kvadrat negativnog broja je pozitivan), a ispred je minus: $−0,36$.',
        'Četvrti: $8 · {9|16} = 4,5$.',
        'Ukupno: $44 + 1,44 − 0,36 + 4,5 = 49,58 = {2479|50}$.',
      ]);
    Z(7, 2, 1,
      'Date su tačke $A(−2, −2)$, $B(−1, 3)$ i $C(3, 1)$. Kolika je površina trougla $ABC$?',
      ['$11$', '$25$', '$14$', '$12,5$'],
      [
        K('Opišimo oko trougla kvadrat $AEFG$ sa stranicama paralelnim osama: $x$ od $−2$ do $3$, $y$ od $−2$ do $3$. Stranica mu je $5$, a površina $25$.', ['kv']),
        'Od kvadrata oduzmemo tri pravougla trougla: $AEC$ sa katetama $5$ i $3$ (površina $7,5$), $BFC$ sa katetama $4$ i $2$ (površina $4$), $BGA$ sa katetama $1$ i $5$ (površina $2,5$).',
        'Površina trougla: $25 − (7,5 + 4 + 2,5) = 25 − 14 = 11$.',
      ],
      G({ A: [-2, -2, 225], B: [-1, 3, 90], C: [3, 1, 0], E: [3, -2, -45], F: [3, 3, 45], G: [-2, 3, 135] },
        [{ mreza: [-3, 4, -3, 4], ose: ['x', 'y'] }, { p: 'ABC', b: 1 }, { p: 'AEFG', id: 'kv', isp: 1, k: 1, prazno: 1 }, { p: 'AEC', k: 2, b: 2 }, { p: 'BFC', k: 2, b: 3 }, { p: 'BGA', k: 2, b: 4 }]));
    Z(7, 3, 1,
      'Filip je, igrajući košarku, nakon niza od $40$ šuteva imao uspešnost $65%$. Nakon još $10$ šuteva uspešnost se smanjila na $60%$. Koliko je koševa Filip pogodio u poslednjih $10$ šuteva?',
      ['$4$', '$6$', '$5$', '$3$'],
      [
        'Posle $40$ šuteva pogodio je $65%$ od $40$: $0,65 · 40 = 26$ koševa.',
        'Posle $50$ šuteva pogodio je $60%$ od $50$: $0,6 · 50 = 30$ koševa.',
        K('U poslednjih $10$ šuteva: $30 − 26 = 4$ koša.', [], C.stubici([['~posle 40', 26], ['~posle 50', 30]], { korakY: 5, maxY: 30, vrednosti: true })),
        'Pazi: procenat se ne oduzima od procenta ($65% − 60% = 5%$ ne znači ništa ovde) – uvek računaj broj koševa.',
      ]);
    Z(7, 4, 2,
      'Da li je vrednost izraza $√{12 + √{12 + √{12}}}$ veća ili manja od $4$?',
      ['Manja od $4$', 'Veća od $4$', 'Jednaka $4$', 'Jednaka $2√3$'],
      [
        'Pretpostavimo da je izraz veći od $4$ i kvadrirajmo (obe strane su pozitivne, pa se znak nejednakosti ne menja): $12 + √{12 + √{12}} > 16$, tj. $√{12 + √{12}} > 4$.',
        'Ponovo kvadriramo: $12 + √{12} > 16$, tj. $√{12} > 4$.',
        'Još jednom: $12 > 16$ – netačno! Zato je pretpostavka pogrešna.',
        'Ide i „odozdo“: $√{12} < 4$, pa $12 + √{12} < 16$, $√{12 + √{12}} < 4$, pa $12 + √{12 + √{12}} < 16$ i ceo izraz $< 4$. Vrednost je manja od $4$ (oko $3,99$).',
      ]);
    Z(7, 5, 2,
      'Broj $2,220242024…$ (grupa cifara $2024$ se beskonačno ponavlja posle prve decimale) predstavi u obliku ${m|n}$, gde su $m$ i $n$ uzajamno prosti prirodni brojevi. Koliko je $n$?',
      ['$4545$', '$49 995$', '$9999$', '$99 990$'],
      [
        'Neka je $x = 2,2 2024 2024…$. Pomerimo zarez tako da period počne odmah: $10x = 22,2024 2024…$',
        'Pomerimo za još jedan ceo period ($4$ cifre): $100 000x = 222 024,2024 2024…$',
        'Oduzmimo: periodi se poništavaju: $100 000x − 10x = 222 024 − 22$, tj. $99 990x = 222 002$.',
        '$x = {222 002|99 990} = {111 001|49 995}$; brojilac i imenilac su još deljivi sa $11$: $= {10 091|4545}$.',
        '$4545 = 3² · 5 · 101$, a $10 091$ nije deljiv ni sa $3$, ni sa $5$, ni sa $101$ – razlomak se dalje ne skraćuje. Dakle $m = 10 091$, $n = 4545$.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 1,
      'Koliko je središte duži $AB$ udaljeno od ravni $β$, ako su tačke $A$ i $B$ sa iste strane ravni i od nje udaljene $7 cm$ i $15 cm$?',
      ['$11 cm$', '$4 cm$', '$22 cm$', '$8 cm$'],
      [
        K('Neka su $A_{1}$, $B_{1}$, $S_{1}$ normalne projekcije tačaka $A$, $B$ i središta $S$ na ravan. Duži $AA_{1}$, $SS_{1}$, $BB_{1}$ su normalne na ravan, pa su međusobno paralelne.', ['tr']),
        'Četvorougao $A_{1}B_{1}BA$ je pravougli trapez sa osnovicama $AA_{1} = 7 cm$ i $BB_{1} = 15 cm$, a $SS_{1}$ spaja središta krakova – to je srednja linija trapeza.',
        'Srednja linija je polovina zbira osnovica: $SS_{1} = {7 + 15|2} = 11 cm$.',
      ],
      G({ A: [0, 7, 135], B: [8, 15, 45], S: [4, 11, 135], A1: [0, 0, 270], B1: [8, 0, 270], S1: [4, 0, 270], p1: [-2, 0], p2: [10, 0] },
        [{ d: 'p1p2' }, { tx: 'β', at: [9.6, 0.7] }, { d: 'AB' }, { d: 'AA1', o: '7' }, { d: 'BB1', o: '15' }, { d: 'SS1', isp: 1, b: 1, k: 1 }, { p: 'A1B1BA', id: 'tr', b: 2, k: 2 }]));
    Z(8, 2, 1,
      'Obim jednakokrakog trougla čiji je krak za $2 cm$ duži od osnovice je $22 cm$, a obim njemu sličnog trougla je $33 cm$. Koliki je krak većeg trougla?',
      ['$12 cm$', '$9 cm$', '$11 cm$', '$13 cm$'],
      [
        'Neka je osnovica $a$, a krak $b = a + 2$. Obim: $a + 2b = a + 2a + 4 = 3a + 4 = 22$, pa je $a = 6 cm$, $b = 8 cm$.',
        K('Sličan trougao je takođe jednakokrak, a obimi sličnih trouglova odnose se kao odgovarajuće stranice: koeficijent sličnosti je ${33|22} = {3|2}$.', [], G({ A: [0, 0, 225], B: [6, 0, -45], C: [3, 7.42, 90], P: [9, 0, 225], Q: [18, 0, -45], R: [13.5, 11.12, 90] }, [{ p: 'ABC' }, { d: 'AB', o: '6' }, { d: 'BC', o: '8' }, { p: 'PQR', b: 1 }, { d: 'PQ', o: '9' }, { d: 'QR', o: '12' }], { bezImena: ['A', 'B', 'C', 'P', 'Q', 'R'] })),
        'Stranice većeg trougla: osnovica $6 · {3|2} = 9 cm$, krak $8 · {3|2} = 12 cm$. Provera: $9 + 12 + 12 = 33$ ✓.',
      ]);
    Z(8, 3, 2,
      'Koliki je zbir svih rešenja jednačine $||2025 − 2x| − 2024| = 2023$?',
      ['$4050$', '$2025$', '$2024$', '$4047$'],
      [
        'Spoljna apsolutna vrednost: $|2025 − 2x| − 2024 = 2023$ ili $|2025 − 2x| − 2024 = −2023$.',
        'Prvi slučaj: $|2025 − 2x| = 4047$, tj. $2025 − 2x = ±4047$: $x = −1011$ ili $x = 3036$.',
        'Drugi slučaj: $|2025 − 2x| = 1$, tj. $2025 − 2x = ±1$: $x = 1012$ ili $x = 1013$.',
        K('Zbir: $−1011 + 3036 + 1012 + 1013 = 4050$.', [], C.brojevna(-1500, 3500, [[-1011, '−1011', 1], [1012, '1012 i 1013', 2], [1013, '', 2], [3036, '3036', 1]], { podela: 500, svaki: 2 })),
        'Lepa prečica: rešenja dolaze u parovima simetričnim oko ${2025|2}$, pa je zbir $4 · {2025|2} = 4050$.',
      ]);
    Z(8, 4, 2,
      'Šta je veće: $5 − 3√3$ ili $2√6 − 2√7$?',
      ['$5 − 3√3$', '$2√6 − 2√7$', 'Jednaki su', 'Ne može se odrediti bez kalkulatora'],
      [
        'Zapišimo sve pod korenom: $5 = √{25}$, $3√3 = √{27}$, $2√6 = √{24}$, $2√7 = √{28}$. Upoređujemo $√{25} − √{27}$ i $√{24} − √{28}$.',
        'Pošto je $√{25} > √{24}$ i $−√{27} > −√{28}$ (jer je $√{27} < √{28}$), sabiranjem ovih nejednakosti dobijamo $√{25} − √{27} > √{24} − √{28}$.',
        K('Dakle $5 − 3√3 > 2√6 − 2√7$. (Oba broja su negativna: $≈ −0,196$ i $≈ −0,393$.)', [], C.tabela([['√25', '>', '√24'], ['−√27', '>', '−√28'], ['√25 − √27', '>', '√24 − √28']], { sirina: [3, 1, 3], zaglavlje: false, istakni: [[2, 0], [2, 1], [2, 2]] })),
      ]);
    Z(8, 5, 2,
      'Dat je skup $S = \\{1, 2, 3, 4, 5, 6, 7\\}$. Koliko ima podskupova skupa $S$ čiji je proizvod najmanjeg i najvećeg elementa jednak $6$?',
      ['$17$', '$16$', '$18$', '$32$'],
      [
        'Broj $6$ kao proizvod dva različita elementa skupa: $6 = 1 · 6 = 2 · 3$. (Jednočlani podskup bi dao kvadrat elementa – $6$ nije kvadrat.)',
        'Najmanji $2$, najveći $3$: između njih nema drugih brojeva, pa je jedini takav podskup $\\{2, 3\\}$.',
        'Najmanji $1$, najveći $6$: podskup sadrži $1$ i $6$, ne sadrži $7$, a za svaki od brojeva $2, 3, 4, 5$ biramo da li je u podskupu ili nije – $2^{4} = 16$ mogućnosti.',
        'Ukupno $16 + 1 = 17$ podskupova.',
      ]);
  },
};
