// Okružno takmičenje iz matematike učenika osnovnih škola, 16. 3. 2024. (DMS)
// https://dms.rs/wp-content/uploads/2024/03/Resenja-zadataka.pdf
module.exports = {
  godina: '2023/24', nivo: 'okruzno', datum: '16. 3. 2024.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Izračunaj razliku ${232323|242424} − {23|24}$.',
      ['$0$', '${1|24}$', '${10100|242424}$', '${1|10101}$'],
      [
        'Primetimo obrazac: $232323 = 23 · 10101$ (jer $23 · 10101 = 230000 + 2300 + 23$) i isto tako $242424 = 24 · 10101$.',
        'Zato je ${232323|242424} = {23 · 10101|24 · 10101} = {23|24}$ – razlomak se skraćuje sa $10101$.',
        'Razlika je ${23|24} − {23|24} = 0$.',
      ]);
    Z(5, 2, 1,
      'Uglovi $α$ i $β$ su komplementni, a uglovi $α$ i $9β$ su suplementni. Kolike su mere uglova $α$ i $β$?',
      ['$α = 78° 45\'$, $β = 11° 15\'$', '$α = 80°$, $β = 10°$', '$α = 78° 15\'$, $β = 11° 45\'$', '$α = 81°$, $β = 9°$'],
      [
        K('Komplementni: $α + β = 90°$. Suplementni: $α + 9β = 180°$.', [], G({ O: [0, 0, 270], A: [6, 0], B: [1.17, 5.88], X: [0, 6] }, [{ d: 'OA' }, { d: 'OX', isp: 1 }, { d: 'OB', b: 1 }, { u: 'AOB', o: 'α' }, { u: 'BOX', o: 'β', b: 2 }], { bezImena: ['O', 'A', 'B', 'X'] })),
        'Oduzmimo prvu jednakost od druge: $8β = 90°$, pa je $β = 90° : 8 = 11,25° = 11° 15\'$ (jer je $0,25° = 15\'$).',
        '$α = 90° − 11° 15\' = 78° 45\'$.',
        'Provera: $78° 45\' + 9 · 11° 15\' = 78° 45\' + 101° 15\' = 180°$ ✓.',
      ]);
    Z(5, 3, 1,
      'Dat je pravougaonik $ABCD$ čiji je obim $40 cm$. Na stranici $AB$ data je tačka $M$ takva da je duž $AM$ za $5 cm$ kraća od duži $BC$. Ako je duž $MB$ tri puta duža od duži $AM$, kolika je površina pravougaonika?',
      ['$96 cm²$', '$84 cm²$', '$100 cm²$', '$75 cm²$'],
      [
        'Neka je $AM = x$. Tada je $MB = 3x$, pa je $AB = 4x$, i $BC = x + 5$.',
        'Obim: $2 · (AB + BC) = 2 · (4x + x + 5) = 10x + 10 = 40$, pa je $x = 3 cm$.',
        '$AB = 12 cm$, $BC = 8 cm$, a površina $12 · 8 = 96 cm²$.',
      ],
      G({ A: [0, 0, 225], B: [12, 0, -45], C: [12, 8, 45], D: [0, 8, 135], M: [3, 0, -90] },
        [{ p: 'ABCD' }, { tacka: 'M' }, { d: 'AM', b: 1, o: 'x', k: 1 }, { d: 'MB', b: 2, o: '3x', k: 1 }, { d: 'BC', o: 'x + 5', k: 1 }]));
    Z(5, 4, 2,
      'Na ekranu računara ispisana je rečenica TASA SA SINOM I ĆERKOM IDE U BIOSKOP. Svaki put kada pritisnemo „+“, računar premesti prvo slovo svake reči na poslednje mesto te reči (posle prvog pritiska: ASAT AS INOMS I ERKOMĆ DEI U IOSKOPB). Koliko najmanje puta treba pritisnuti „+“ da bismo ponovo dobili polaznu rečenicu?',
      ['$420$', '$5040$', '$840$', '$29$'],
      [
        'Posmatrajmo svaku reč posebno. Reč od $4$ slova (TASA) vraća se u početni oblik posle $4$, $8$, $12$, … pritisaka: ASAT, SATA, ATAS, TASA.',
        K('Uopšte, reč sa $n$ slova vraća se posle svakih $n$ pritisaka. Dužine reči su $4, 2, 5, 1, 6, 3, 1, 7$.', [], C.tabela([['~reč', 'TASA', 'SA', 'SINOM', 'I', 'ĆERKOM', 'IDE', 'U', 'BIOSKOP'], ['~slova', 4, 2, 5, 1, 6, 3, 1, 7]], { sirina: [1.6, 2] })),
        'Cela rečenica se vraća kad se sve reči istovremeno vrate – broj pritisaka mora biti deljiv sa svim dužinama. Najmanji takav broj je $NZS(1, 2, 3, 4, 5, 6, 7)$.',
        '$NZS = 2² · 3 · 5 · 7 = 420$ (u njemu su $4 = 2²$ i $6 = 2 · 3$ već sadržani).',
        'Napomena: TASA se, zbog ponovljenog slova A, ne vraća ranije ($2$ pritiska daju SATA), pa nema prečice. Odgovor: $420$.',
      ]);
    Z(5, 5, 2,
      'Maja je krenula od kuće brojeći korake: $10$ koraka napred pa $3$ nazad, $10$ napred pa $2$ nazad, $10$ napred pa $1$ nazad, i taj postupak stalno ponavlja. Koliko koraka Maja mora da napravi da bi se od kuće udaljila $2038$ koraka?',
      ['$3056$', '$3048$', '$3060$', '$3024$'],
      [
        K('Jedan ceo postupak: udaljava se $(10 − 3) + (10 − 2) + (10 − 1) = 24$ koraka, a napravi $10 + 3 + 10 + 2 + 10 + 1 = 36$ koraka.', [], C.brojevna(0, 26, [[7, '+7', 1], [15, '+15', 2], [24, '+24', 3]], { podela: 1, svaki: 5, e: [C.skok(0, 10, { boja: 1 }), C.skok(10, 7, { boja: 5, ispod: true, kasni: 1 }), C.skok(7, 17, { boja: 2, kasni: 1.8 }), C.skok(17, 15, { boja: 5, ispod: true, kasni: 2.7 }), C.skok(15, 25, { boja: 3, kasni: 3.5 }), C.skok(25, 24, { boja: 5, ispod: true, kasni: 4.4 })] })),
        '$2038 = 84 · 24 + 22$. Posle $84$ cela postupka udaljena je $2016$ koraka i napravila je $84 · 36 = 3024$ koraka.',
        'Treba još $22$ koraka udaljenosti. Prvi deo novog postupka: $10$ napred, $3$ nazad ($+7$, $13$ koraka); drugi: $10$ napred, $2$ nazad (ukupno $+15$, još $12$ koraka); zatim još $7$ koraka napred: $15 + 7 = 22$ ✓.',
        'Ovih koraka je $13 + 12 + 7 = 32$, pa je ukupno $3024 + 32 = 3056$.',
        'Pazi: Maja je udaljenost $2038$ dostigla prvi put baš tada – ranije, posle $10$ koraka napred u drugom delu, bila je na $2016 + 7 + 10 = 2033$, a još nije dostigla $2038$.',
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Izračunaj vrednost izraza $(−2{1|4}) : (−3) − ((−{3|4} : {9|10} − 1{4|5} · {15|9} + 1{5|6}) − (−3 − {1|8})) · 4$.',
      ['$−{15|4}$', '${15|4}$', '$−{21|4}$', '$−{9|2}$'],
      [
        'Prvi deo: $(−{9|4}) : (−3) = {9|4} · {1|3} = {3|4}$ (količnik dva negativna broja je pozitivan).',
        'U unutrašnjoj zagradi: $−{3|4} : {9|10} = −{3|4} · {10|9} = −{5|6}$ i $1{4|5} · {15|9} = {9|5} · {15|9} = 3$. Zato je zagrada $−{5|6} − 3 + {11|6} = {6|6} − 3 = −2$.',
        'Druga mala zagrada: $−3 − {1|8} = −{25|8}$, a oduzimamo je: $−2 − (−{25|8}) = −2 + {25|8} = {9|8}$.',
        'Množenje sa $4$: ${9|8} · 4 = {9|2}$.',
        'Ceo izraz: ${3|4} − {9|2} = {3|4} − {18|4} = −{15|4}$.',
      ]);
    Z(6, 2, 2,
      'Na slici je deo paralelograma $ABCD$: kroz teme $A$ prolazi prava $p$, stranica $AD$ sa njom gradi ugao $120°$, a prava kroz $C$ seče pravu $p$ u tački $F$ pod uglom od $40°$ i sa stranicom $CD$ gradi ugao od $160°$ (kao na slici). Koliki su uglovi paralelograma?',
      ['$80°$ i $100°$', '$60°$ i $120°$', '$70°$ i $110°$', '$40°$ i $140°$'],
      [
        K('Neka prava $FC$ seče stranicu $AD$ u tački $E$. Ugao $FAE$ je uporedan uglu od $120°$, pa je $∡FAE = 60°$.', ['t1']),
        'U trouglu $AEF$: $∡AEF = 180° − 40° − 60° = 80°$. Ugao $DEC$ je unakrsni, pa je i $∡DEC = 80°$.',
        'Ugao kod $C$ između $CE$ i $CD$ je uporedan uglu od $160°$: $∡ECD = 20°$.',
        K('U trouglu $DEC$: $∡EDC = 180° − 80° − 20° = 80°$. To je ugao paralelograma kod $D$.', ['t2']),
        'Naspramni uglovi paralelograma su jednaki, a susedni su suplementni: $∡ADC = ∡ABC = 80°$ i $∡DAB = ∡BCD = 100°$.',
      ],
      G({ A: [0, 0, -90], B: [6.4, 2.33, -30], C: [4.4, 5.79, 90], D: [-2, 3.46, 135], F: [-2.5, 0, -90], E: [-0.82, 1.41, 160], P1: [-4, 0], P2: [8, 0], X: [5.55, 6.75] },
        [{ d: 'P1P2' }, { tx: 'p', at: [7.6, 0.45] }, { d: 'AD' }, { d: 'DC' }, { d: 'FX' }, { d: 'AB', isp: 1 }, { d: 'BC', isp: 1 },
          { u: 'P2AD', o: '120°' }, { u: 'AFC', o: '40°' }, { u: 'DCX', o: '160°' },
          { p: 'AEF', id: 't1', b: 2, k: 1 }, { p: 'DEC', id: 't2', b: 4, k: 4 }], { bezImena: ['P1', 'P2', 'X'] }));
    Z(6, 3, 2,
      'Marko izvlači iz šešira kuglice sa brojevima $0, 5, 8$ i $10$. Izvukao je jednak broj kuglica sa brojevima $8$ i $10$, i nekoliko kuglica sa brojem $5$. Kuglica sa brojem $0$ ima četvrtina od ukupnog broja izvučenih kuglica. Koliko je kuglica Marko izvukao ako je zbir svih brojeva na njima $99$?',
      ['$20$', '$15$', '$16$', '$24$'],
      [
        'Neka je izvučeno po $x$ kuglica sa $8$ i sa $10$, i $y$ kuglica sa $5$. Zbir: $8x + 10x + 5y = 18x + 5y = 99$.',
        '$5y = 99 − 18x$ mora biti deljivo sa $5$, a $x$ je između $0$ i $5$ (jer $18 · 6 > 99$). Proveravamo: $99 − 18x$ za $x = 0, 1, 2, 3, 4, 5$ je $99, 81, 63, 45, 27, 9$ – sa $5$ je deljivo samo $45$.',
        'Dakle $x = 3$ i $y = 9$: kuglica sa brojevima različitim od nule ima $3 + 3 + 9 = 15$.',
        K('Kuglice sa nulom čine četvrtinu svih, pa ostale čine $\{3|4\}$ svih: $15 = \{3|4\}$ ukupnog broja, pa je ukupno $20$ kuglica (od toga $5$ sa nulom).', [], G({}, [...C.traka(4, 3, { w: 10, h: 1.4, b: 2 }), { tx: '15', at: [3.75, 2] }, { tx: '5', at: [8.75, 2] }, { tx: '~kuglice 5, 8, 10', at: [3.75, -0.8] }, { tx: '~nule', at: [8.75, -0.8] }])),
      ]);
    Z(6, 4, 3,
      'Treba konstruisati pravougli trougao čiji jedan oštar ugao ima meru $22° 30\'$, a zbir kateta je $10,5 cm$. Ključni korak: produžimo katetu $AC$ preko $C$ do tačke $D$ tako da je $CD = BC$. Koji trougao tada možemo odmah konstruisati?',
      ['Trougao $ABD$ sa $AD = 10,5 cm$, $∡D = 45°$, $∡A = 22° 30\'$', 'Trougao $BCD$ sa uglovima $45°$, $45°$, $90°$ i stranicom $10,5 cm$', 'Trougao $ABC$ sa hipotenuzom $10,5 cm$', 'Trougao $ABD$ sa $AD = 10,5 cm$, $∡D = 90°$, $∡A = 22° 30\'$'],
      [
        'Ovo je zadatak konstrukcije – rešava se analizom. Neka je $ABC$ traženi trougao sa pravim uglom kod $C$ i $∡CAB = 22° 30\'$.',
        'Produžimo $AC$ preko $C$ i odredimo $D$ tako da je $CD = CB$. Tada je $AD = AC + CD = AC + CB = 10,5 cm$ – zbir kateta postaje jedna duž!',
        'Trougao $DCB$ je jednakokrako-pravougli (pravi ugao kod $C$), pa je $∡BDC = 45°$.',
        'Zato trougao $ABD$ ima poznatu stranicu $AD = 10,5 cm$ i dva nalegla ugla: $45°$ kod $D$ i $22° 30\'$ kod $A$ – konstruišemo ga po stavu USU.',
        'Konstrukcija: duž $AD$, poluprave iz $D$ pod $45°$ i iz $A$ pod $22° 30\'$ (polovina od $45°$, simetrala!) seku se u $B$. Teme $C$ je presek duži $AD$ i simetrale duži $BD$ (ili podnožje normale iz $B$ na $AD$).',
      ],
      null);
    Z(6, 5, 2,
      'Odredi sve cele brojeve $x$ za koje je $\{202|3 − \\|1 + x\\|\}$ ceo broj. Koliko ih ima?',
      ['$12$', '$16$', '$8$', '$6$'],
      [
        'Izraz je ceo broj kad je $3 − |1 + x|$ delilac broja $202 = 2 · 101$: $3 − |1 + x| ∈ \{±1, ±2, ±101, ±202\}$.',
        'Odatle $|1 + x| = 3 − d$ za svaki delilac $d$: za $d = −202, −101, −2, −1, 1, 2$ dobijamo $|1 + x| = 205, 104, 5, 4, 2, 1$; za $d = 101$ i $d = 202$ apsolutna vrednost bi bila negativna – nema rešenja.',
        'Svaka pozitivna vrednost $|1 + x| = m$ daje dva rešenja $x = m − 1$ i $x = −m − 1$.',
        K('Rešenja: $204, −206$; $103, −105$; $4, −6$; $3, −5$; $1, −3$; $0, −2$ – ukupno $12$ celih brojeva.', [], C.brojevna(-210, 210, [[-206, '', 1], [-105, '', 1], [-6, '', 2], [-5, '', 2], [-3, '', 2], [-2, '', 2], [0, '', 2], [1, '', 2], [3, '', 2], [4, '', 2], [103, '', 1], [204, '', 1]], { podela: 50, svaki: 2 })),
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Dat je polinom $P_{1}(x) = x^{4} − x³ + 2x² − 5x + 6$. Zbir polinoma $P_{1}(x)$ i $P_{2}(x)$ jednak je $x^{5} − x² − 2$. Koliko je $P_{1}(x) + 2P_{3}(x)$, ako su $P_{2}(x)$ i $P_{3}(x)$ suprotni polinomi?',
      ['$−2x^{5} + 3x^{4} − 3x³ + 8x² − 15x + 22$', '$2x^{5} − x^{4} + x³ − 4x² + 5x − 10$', '$−2x^{5} + x^{4} − x³ + 4x² − 5x + 10$', '$−x^{5} + 2x^{4} − 2x³ + 5x² − 10x + 14$'],
      [
        '$P_{2}(x) = (x^{5} − x² − 2) − P_{1}(x) = x^{5} − x^{4} + x³ − 3x² + 5x − 8$ (svakom članu od $P_{1}$ menjamo znak).',
        'Suprotni polinom ima sve koeficijente sa suprotnim znakom: $P_{3}(x) = −x^{5} + x^{4} − x³ + 3x² − 5x + 8$.',
        '$2P_{3}(x) = −2x^{5} + 2x^{4} − 2x³ + 6x² − 10x + 16$.',
        '$P_{1}(x) + 2P_{3}(x) = −2x^{5} + (1 + 2)x^{4} + (−1 − 2)x³ + (2 + 6)x² + (−5 − 10)x + (6 + 16) = −2x^{5} + 3x^{4} − 3x³ + 8x² − 15x + 22$.',
      ]);
    D(7, 2, 2,
      'Dati su izrazi $a = 3^{2022} − 3^{2021} + 3^{2020}$, $b = 14√2 · 3^{2020}$ i $c = 3^{2021} − 3^{2022} + 3^{2023}$. Dokaži da $a$, $b$ i $c$ mogu biti dužine stranica pravouglog trougla.',
      [
        'Izvucimo zajedničke činioce: $a = 3^{2020}(9 − 3 + 1) = 7 · 3^{2020}$.',
        '$c = 3^{2021}(1 − 3 + 9) = 7 · 3^{2021} = 21 · 3^{2020}$. Najduža je $c$ (jer je $b = 14√2 · 3^{2020} ≈ 19,8 · 3^{2020}$).',
        '$a² + b² = 49 · 3^{4040} + 392 · 3^{4040} = 441 · 3^{4040}$ (jer je $(14√2)² = 196 · 2 = 392$).',
        '$c² = 441 · 3^{4040}$. Dakle $a² + b² = c²$, pa po obrnutoj Pitagorinoj teoremi $a, b, c$ jesu stranice pravouglog trougla (sa hipotenuzom $c$).',
        'Odnos stranica je $7 : 14√2 : 21 = 1 : 2√2 : 3$ – „pomnoženi“ trougao $1, 2√2, 3$.',
      ]);
    Z(7, 3, 2,
      'Pravougli trougao $ABC$ ima katete $AC = 12 cm$ i $BC = 5 cm$. Polukrug sa centrom na stranici $AC$ dodiruje katetu $BC$ u tački $C$, a hipotenuzu $AB$ u tački $D$. Koliki je poluprečnik tog polukruga?',
      ['$\{10|3\} cm$', '$2 cm$', '$\{5|2\} cm$', '$\{12|5\} cm$'],
      [
        'Po Pitagorinoj teoremi: $AB = √{12² + 5²} = √{169} = 13 cm$. Površina trougla: $\{12 · 5|2\} = 30 cm²$.',
        K('Neka je $S$ centar polukruga, $r$ poluprečnik: $SC = SD = r$, i $SD ⊥ AB$ (poluprečnik je normalan na tangentu u dodirnoj tački).', ['r']),
        'Podelimo trougao $ABC$ dužom $SB$ na trouglove $SCB$ i $SAB$. Visina trougla $SCB$ na $BC$ je $SC = r$, a visina trougla $SAB$ na $AB$ je $SD = r$.',
        'Površine: $\{5 · r|2\} + \{13 · r|2\} = 9r = 30$, pa je $r = \{10|3\} cm$.',
      ],
      G({ C: [0, 0, 225], A: [12, 0, -45], B: [0, 5, 135], S: [3.33, 0, -90], D: [4.62, 3.08, 60] },
        [{ p: 'ABC' }, { pu: 'ACB' }, { l: 'S', r: 3.33, od: 0, do: 180, pun: 1 }, { tacka: 'S' }, { tacka: 'D' }, { d: 'SD', id: 'r', b: 1, o: 'r', k: 2 }, { d: 'SB', isp: 1, k: 3 }]));
    Z(7, 4, 2,
      'Koliko ima prirodnih brojeva $n$ većih od $2$, a manjih od $2024$, takvih da je vrednost izraza $6^{n} + 7^{n} + 8^{n} − 789$ deljiva sa $10$?',
      ['$505$', '$506$', '$504$', '$1010$'],
      [
        'Broj je deljiv sa $10$ ako se završava nulom, pa se $6^{n} + 7^{n} + 8^{n}$ mora završavati cifrom $9$ (jer se $789$ završava sa $9$).',
        '$6^{n}$ se uvek završava sa $6$. Poslednje cifre: $7^{n}$ → $7, 9, 3, 1$ (period $4$), $8^{n}$ → $8, 4, 2, 6$ (period $4$).',
        K('Zbirovi poslednjih cifara za $n = 1, 2, 3, 4$ (mod $4$): $6 + 7 + 8 = 21 → 1$; $6 + 9 + 4 = 19 → 9$; $6 + 3 + 2 = 11 → 1$; $6 + 1 + 6 = 13 → 3$.', [], C.tabela([['~n daje ostatak (: 4)', 1, 2, 3, 0], ['6ⁿ', 6, 6, 6, 6], ['7ⁿ', 7, 9, 3, 1], ['8ⁿ', 8, 4, 2, 6], ['~zbir završava', 1, 9, 1, 3]], { sirina: [3.6, 1.2], istakni: [[4, 2]] })),
        'Cifra $9$ je samo kad $n$ daje ostatak $2$ pri deljenju sa $4$. Uz $2 < n < 2024$: $n ∈ \{6, 10, 14, …, 2022\}$.',
        'Takvih ima $\{2022 − 6|4\} + 1 = 504 + 1 = 505$.',
      ]);
    Z(7, 5, 3,
      'Tačka $M$ je središte stranice $AB$ trougla $ABC$, a $T$ je njegovo težište. Ako je trougao $AMT$ jednakostraničan sa stranicom $1 cm$, kolike su stranice trougla $ABC$?',
      ['$AB = 2 cm$, $AC = √7 cm$, $BC = √{13} cm$', '$AB = 2 cm$, $AC = √3 cm$, $BC = √7 cm$', '$AB = 2 cm$, $AC = 3 cm$, $BC = √{13} cm$', '$AB = 2 cm$, $AC = √{13} cm$, $BC = √7 cm$'],
      [
        '$M$ je središte $AB$, pa je $AB = 2 · AM = 2 cm$. Težište deli težišnu duž u odnosu $2 : 1$, pa je $CM = 3 · TM = 3 cm$.',
        K('Neka je $D$ podnožje normale iz $C$ na pravu $AB$. Ugao $CMD$ je ugao $AMT = 60°$, pa je trougao $DMC$ polovina jednakostraničnog trougla stranice $3$.', ['tr']),
        '$DM = \{3|2\} cm$, $CD = \{3√3|2\} cm$. Tačka $D$ je sa iste strane kao $A$: $AD = \{3|2\} − 1 = \{1|2\} cm$, a $BD = \{3|2\} + 1 = \{5|2\} cm$.',
        'Pitagora: $AC² = AD² + CD² = \{1|4\} + \{27|4\} = 7$, pa je $AC = √7 cm$.',
        '$BC² = BD² + CD² = \{25|4\} + \{27|4\} = 13$, pa je $BC = √{13} cm$.',
      ],
      G({ A: [0, 0, 225], B: [2, 0, -45], M: [1, 0, -90], T: [0.5, 0.866, 160], C: [-0.5, 2.598, 90], D: [-0.5, 0, 225] },
        [{ p: 'ABC' }, { p: 'AMT', b: 2 }, { d: 'CM' }, { d: 'DA', isp: 1, k: 2 }, { d: 'CD', isp: 1, k: 2 }, { pu: 'CDM', k: 2 }, { p: 'CDM', id: 'tr', b: 4, k: 2 }]));

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'U prostoru je dato $n$ tačaka od kojih nikoje tri nisu kolinearne. One određuju tačno $2024$ različite ravni. Koliko je $n$?',
      ['$24$', '$23$', '$22$', '$46$'],
      [
        'Svake tri nekolinearne tačke određuju ravan. Ako nikoje $4$ tačke nisu u istoj ravni, sve trojke daju različite ravni – tada je broj ravni najveći: $\{n(n − 1)(n − 2)|6\}$.',
        '(Ako bi neke $4$ ili više tačaka bile u istoj ravni, ravni bi bilo manje – za $2024$ ravni bi trebalo još više tačaka. Zvanično rešenje traži broj tačaka u opštem položaju.)',
        '$\{n(n − 1)(n − 2)|6\} = 2024$, tj. $n(n − 1)(n − 2) = 12 144 = 2^{4} · 3 · 11 · 23$.',
        'Proizvod tri uzastopna broja: probamo oko $∛{12 144} ≈ 23$: $24 · 23 · 22 = 12 144$ ✓. Dakle $n = 24$.',
      ]);
    Z(8, 2, 1,
      'Odredi linearnu funkciju $y = kx + n$ čiji grafik sadrži tačku $A(0, 4)$ i sa pozitivnim delovima koordinatnih osa obrazuje trougao površine $6$.',
      ['$y = −\{4|3\}x + 4$', '$y = −\{3|4\}x + 4$', '$y = \{4|3\}x + 4$', '$y = −3x + 4$'],
      [
        'Tačka $A(0, 4)$ je presek sa $y$-osom, pa je $n = 4$: $y = kx + 4$.',
        'Neka grafik seče pozitivni deo $x$-ose u $B(a, 0)$, $a > 0$. Trougao $OAB$ je pravougli sa katetama $4$ i $a$: površina $\{4 · a|2\} = 2a = 6$, pa je $a = 3$.',
        'Tačka $B(3, 0)$ je na grafiku: $0 = 3k + 4$, pa je $k = −\{4|3\}$.',
        'Funkcija: $y = −\{4|3\}x + 4$ (opadajuća – inače ne bi sekla pozitivan deo $x$-ose).',
      ],
      G({ O: [0, 0, 225], A: [0, 4, 180], B: [3, 0, -90] }, [{ mreza: [-1, 5, -1, 5], ose: ['x', 'y'] }, { tacka: 'A' }, { p: 'OAB', b: 2, k: 2 }, { lin: [[-0.75, 5], [3.75, -1]], b: 1, k: 3 }]));
    Z(8, 3, 2,
      'Sa koliko nula se završava zbir $98! + 99! + 100!$? ($n!$ je proizvod svih prirodnih brojeva od $1$ do $n$.)',
      ['$26$', '$22$', '$24$', '$23$'],
      [
        'Izvucimo $98!$: $99! = 98! · 99$ i $100! = 98! · 99 · 100$, pa je zbir $98! · (1 + 99 + 9900) = 98! · 10 000$.',
        'Proverimo: $1 + 99 + 99 · 100 = 1 + 99 + 9900 = 10 000 = 10^{4}$. Dakle zbir je $98! · 10^{4}$ – završava se sa $4$ nule više od broja $98!$.',
        'Broj nula na kraju $98!$ jednak je broju petica u rastavljanju na proste činioce (dvojki ima mnogo više). Brojeva do $98$ deljivih sa $5$ ima $19$, a deljivih sa $25$ ima $3$ (oni daju po još jednu peticu): ukupno $22$ petice.',
        'Zato se $98!$ završava sa $22$ nule, a zbir sa $22 + 4 = 26$ nula.',
      ]);
    Z(8, 4, 3,
      'Odredi sve prirodne brojeve $a$ i $b$ takve da je $a² − a = 4b² − 2b + 2024$. Koliko je $a + b$?',
      ['$1519$', '$192$', '$141,5$', '$1013$'],
      [
        'Prebacimo sve na levu stranu: $a² − 4b² − (a − 2b) = 2024$, tj. $(a − 2b)(a + 2b) − (a − 2b) = (a − 2b)(a + 2b − 1) = 2024$.',
        'Zbir činilaca je $2a − 1$ – neparan, pa su činioci različite parnosti. Takođe $0 < a − 2b < a + 2b − 1$.',
        '$2024 = 2³ · 11 · 23$. Rastavljanja na neparan i paran činilac (manji prvi): $1 · 2024$, $8 · 253$, $11 · 184$, $23 · 88$.',
        K('$a − 2b = 1$, $a + 2b − 1 = 2024$: $2a = 2026$, $a = 1013$, $b = 506$ ✓. Ostali: $a − 2b = 8$ daje $b = 61,5$; $a − 2b = 11$ daje $b = 43,5$; $a − 2b = 23$ daje $b = 16,5$ – nisu prirodni.', [], C.tabela([['a − 2b', 1, 8, 11, 23], ['a + 2b − 1', 2024, 253, 184, 88], ['a', 1013, '131', '98', '56'], ['b', 506, '61,5', '43,5', '16,5']], { sirina: [2.4, 1.5], istakni: [[0, 1], [1, 1], [2, 1], [3, 1]] })),
        'Jedino rešenje $(a, b) = (1013, 506)$, pa je $a + b = 1519$. Provera: $1013 · 1012 = 1 025 156$ i $4 · 506² − 2 · 506 + 2024 = 1 024 144 − 1012 + 2024 = 1 025 156$ ✓.',
      ]);
    Z(8, 5, 3,
      'Data je pravilna šestostrana piramida $ABCDEFS$ sa vrhom $S$. Visina i osnovna ivica su dužine $4 cm$. Piramida je presečena ravnima $BDS$ i $DFS$. Kolika je zapremina nastale četvorostrane piramide $ABDFS$?',
      ['$\{64√3|3\} cm³$', '$32√3 cm³$', '$16√3 cm³$', '$\{32√3|3\} cm³$'],
      [
        K('Osnova nove piramide je četvorougao $ABDF$. $AB = AF = 4 cm$ (ivice šestougla), a $BD = DF = 4√3 cm$ (kraće dijagonale šestougla) – to je deltoid.', [], C.piramida(6, 4, 4, [{ p: 'ABDF', b: 1 }, { d: 'SB', b: 2 }, { d: 'SD', b: 2 }, { d: 'SF', b: 2 }])),
        'Dijagonale deltoida: $AD = 2 · 4 = 8 cm$ (duža dijagonala šestougla) i $BF = 4√3 cm$, i one su normalne. Površina: $B = \{8 · 4√3|2\} = 16√3 cm²$.',
        'Visina je ista kao kod polazne piramide, $H = 4 cm$: $V = \{1|3\} · 16√3 · 4 = \{64√3|3\} cm³$ – tačno dve trećine zapremine cele piramide.',
        'Za površinu (drugi deo zadatka): bočna ivica $SB = √{4² + 4²} = 4√2$; visina trougla $ABS$ na $AB$ je $√{32 − 4} = 2√7$, a trougla $BDS$ na $BD$ je $√{32 − 12} = 2√5$.',
        'Omotač: $2 · \{4 · 2√7|2\} + 2 · \{4√3 · 2√5|2\} = 8√7 + 8√{15}$, pa je površina $P = 16√3 + 8√7 + 8√{15} = 8(2√3 + √7 + √{15}) cm²$.',
      ]);
  },
};
