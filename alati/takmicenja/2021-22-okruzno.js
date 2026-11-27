// Okružno takmičenje iz matematike učenika osnovnih škola, 12. 3. 2022. (DMS)
// https://dms.rs/wp-content/uploads/2022/03/Okruzno-2022-OS.pdf
module.exports = {
  godina: '2021/22', nivo: 'okruzno', datum: '12. 3. 2022.',
  zadaci: ({ Z, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Uglovi $α$ i $β$ su suplementni, a uglovi $β$ i $γ$ komplementni. Zbir uglova $α$ i $γ$ je $123°$. Koliki su uglovi $α$, $β$ i $γ$?',
      ['$α = 106° 30\'$, $β = 73° 30\'$, $γ = 16° 30\'$', '$α = 106°$, $β = 74°$, $γ = 17°$', '$α = 113° 30\'$, $β = 66° 30\'$, $γ = 9° 30\'$', '$α = 101° 30\'$, $β = 78° 30\'$, $γ = 21° 30\'$'],
      [
        'Uslovi: $α + β = 180°$, $β + γ = 90°$, $α + γ = 123°$.',
        'Saberimo sve tri jednakosti: $2(α + β + γ) = 393°$, pa je $α + β + γ = 196° 30\'$.',
        'Oduzmemo svaku od zbira: $γ = 196° 30\' − 180° = 16° 30\'$, $α = 196° 30\' − 90° = 106° 30\'$, $β = 196° 30\' − 123° = 73° 30\'$.',
        'Provera: $106° 30\' + 73° 30\' = 180°$ ✓, $73° 30\' + 16° 30\' = 90°$ ✓, $106° 30\' + 16° 30\' = 123°$ ✓.',
      ]);
    Z(5, 2, 2,
      'Koliko ima tročlanih podskupova skupa $A = \\{{1|11}, {2|11}, …, {10|11}\\}$ u kojima je zbir najmanjeg i najvećeg elementa jednak $1$?',
      ['$20$', '$30$', '$15$', '$10$'],
      [
        'Zbir najmanjeg i najvećeg je $1 = {11|11}$, pa su brojioci tog para zbira $11$: $(1, 10), (2, 9), (3, 8), (4, 7), (5, 6)$.',
        'Treći element mora biti strogo između njih (inače ne bi bili najmanji i najveći).',
        K('Između $1$ i $10$ ima $8$ brojilaca, između $2$ i $9$: $6$, između $3$ i $8$: $4$, između $4$ i $7$: $2$, između $5$ i $6$: $0$.', [], C.tabela([['~par brojilaca', '1, 10', '2, 9', '3, 8', '4, 7', '5, 6'], ['~treći element', 8, 6, 4, 2, 0]])),
        'Ukupno: $8 + 6 + 4 + 2 = 20$ podskupova.',
      ]);
    Z(5, 3, 1,
      'Vanja je zamislila tri broja. NZD prvog i drugog je $12$, prvog i trećeg $8$, a drugog i trećeg $20$. Koji su najmanji prirodni brojevi koje je mogla da zamisli?',
      ['$24$, $60$, $40$', '$12$, $20$, $8$', '$24$, $60$, $120$', '$48$, $60$, $40$'],
      [
        'Prvi broj je deljiv sa $12$ i sa $8$, drugi sa $12$ i sa $20$, treći sa $8$ i sa $20$.',
        K('Najmanji takvi: $NZS(12, 8) = 24$, $NZS(12, 20) = 60$, $NZS(8, 20) = 40$.', [], C.tabela([['~broj', '~deljiv sa', 'NZS'], ['~prvi', '12 i 8', 24], ['~drugi', '12 i 20', 60], ['~treći', '8 i 20', 40]])),
        'Provera: $NZD(24, 60) = 12$ ✓, $NZD(24, 40) = 8$ ✓, $NZD(60, 40) = 20$ ✓.',
      ]);
    Z(5, 4, 2,
      'Ukupno $24$ osobe podelile su $48$ kroasana. Svako dete dobilo je po $8$ kroasana, svaka žena po $2$, a svaki muškarac po $1$. Koliko ima rešenja (ako je bilo dece, žena i muškaraca – svakog bar jedno)?',
      ['$3$', '$2$', '$4$', '$1$'],
      [
        'Neka je dece $D$, žena $Ž$, muškaraca $M$: $8D + 2Ž + M = 48$ i $D + Ž + M = 24$.',
        'Oduzmemo: $7D + Ž = 24$. Kako je $Ž ≥ 1$: $7D ≤ 23$, pa $D ∈ \\{1, 2, 3\\}$.',
        K('Rešenja: $D = 1, Ž = 17, M = 6$; $D = 2, Ž = 10, M = 12$; $D = 3, Ž = 3, M = 18$ – tri rešenja.', [], C.tabela([['~dece', 1, 2, 3], ['~žena', 17, 10, 3], ['~muškaraca', 6, 12, 18], ['~kroasana', 48, 48, 48]])),
      ]);
    Z(5, 5, 3,
      'Koliko ima trojki prostih brojeva $(a, b, c)$ takvih da je $4a + 5b + 6c = 96$?',
      ['$4$', '$3$', '$2$', '$5$'],
      [
        '$4a$, $6c$ i $96$ su parni, pa je i $5b$ paran, tj. $b$ je paran – jedini paran prost broj je $b = 2$.',
        'Ostaje $4a + 6c = 86$, tj. $2a + 3c = 43$. Pošto je $a ≥ 2$: $3c ≤ 39$, $c ≤ 13$.',
        K('Probamo proste $c$: $c = 3 → a = 17$ ✓; $c = 7 → a = 11$ ✓; $c = 11 → a = 5$ ✓; $c = 13 → a = 2$ ✓; za $c = 2$ i $c = 5$ broj $43 − 3c$ je neparan.', [], C.tabela([['c', 2, 3, 5, 7, 11, 13], ['2a = 43 − 3c', 37, 34, 28, 22, 10, 4], ['a', '—', 17, 14, 11, 5, 2], ['~prost?', '', '~da', '~ne', '~da', '~da', '~da']])),
        'Četiri trojke: $(17, 2, 3)$, $(11, 2, 7)$, $(5, 2, 11)$, $(2, 2, 13)$.',
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Koliko ima petocifrenih brojeva sa svim različitim ciframa kod kojih je zbir prve i poslednje cifre $8$?',
      ['$2352$', '$3024$', '$2016$', '$2688$'],
      [
        '(Deo a: brojeva deljivih sa $10$ sa različitim ciframa ima $9 · 8 · 7 · 6 = 3024$.)',
        K('Par (prva, poslednja) sa zbirom $8$, prva $≠ 0$, cifre različite: $(1, 7), (2, 6), (3, 5), (5, 3), (6, 2), (7, 1), (8, 0)$ – $7$ parova. ($4 + 4$ otpada – iste cifre.)', [], C.tabela([['~prva', 1, 2, 3, 5, 6, 7, 8], ['~poslednja', 7, 6, 5, 3, 2, 1, 0]])),
        'Za tri srednje cifre ostaje $8$ neiskorišćenih cifara: $8 · 7 · 6 = 336$ načina.',
        'Ukupno: $7 · 336 = 2352$.',
      ]);
    Z(6, 2, 2,
      'Zbir dva broja i njihovog zbira je ${40|21}$. Koji su sabirci, ako je apsolutna vrednost jednog četiri puta veća od apsolutne vrednosti drugog?',
      ['${16|21}$ i ${4|21}$, ili ${80|63}$ i $−{20|63}$', 'samo ${16|21}$ i ${4|21}$', '${32|21}$ i ${8|21}$', '${16|21}$ i $−{4|21}$'],
      [
        'Ako su sabirci $a$ i $b$: $a + b + (a + b) = {40|21}$, pa je $a + b = {20|21}$.',
        '$|a| = 4|b|$ daje dve mogućnosti: $a = 4b$ ili $a = −4b$.',
        '$a = 4b$: $5b = {20|21}$, $b = {4|21}$, $a = {16|21}$.',
        '$a = −4b$: $−3b = {20|21}$, $b = −{20|63}$, $a = {80|63}$. Provera: ${80|63} − {20|63} = {60|63} = {20|21}$ ✓.',
      ]);
    Z(6, 3, 3,
      'U trouglu $ABC$ ugao između simetrala spoljašnjih uglova kod temena $B$ i $C$ jednak je unutrašnjem uglu kod $A$ i za $7°$ je veći od unutrašnjeg ugla kod $C$. Kako se odnose dužine stranica trougla?',
      ['$b > a > c$', '$a > b > c$', '$c > a > b$', '$b > c > a$'],
      [
        'Neka se simetrale spoljašnjih uglova kod $B$ i $C$ seku u $S$. Poznato je (i lako se izvodi iz zbira uglova trougla $BSC$): $∡BSC = 90° − {α|2}$.',
        'Uslov $∡BSC = α$: $90° − {α|2} = α$, pa je $α = 60°$. Zvanično rešenje do toga dolazi sistemom $5α + β = 367°$, $2α + β = 187°$.',
        'Tada je $γ = α − 7° = 53°$ i $β = 180° − 60° − 53° = 67°$.',
        K('Naspram većeg ugla je veća stranica: $β > α > γ$, pa je $b > a > c$.', [], G({ A: [0, 0, 225], B: [5, 0, -45], C: [2.882, 4.991, 135], S: [8.093, 4.672, 0] },
          [{ p: 'ABC' }, { d: 'BS', b: 1, isp: 1 }, { d: 'CS', b: 1, isp: 1 }, { u: 'BAC', o: '60°' }, { u: 'ACB', o: '53°' }, { u: 'CBA', o: '67°' }, { u: 'CSB', o: 'α', b: 3 }])),
      ]);
    Z(6, 4, 2,
      'Neka je $n$ najmanji prirodan broj deljiv sa $60$ koji se zapisuje samo ciframa $0$ i $7$. Koliko delilaca ima broj $n$?',
      ['$72$', '$36$', '$48$', '$24$'],
      [
        '$60 = 3 · 4 · 5$. Deljiv sa $5$: poslednja cifra $0$. Deljiv sa $4$: poslednje dve cifre deljive sa $4$ – od $00$ i $70$ samo $00$.',
        'Deljiv sa $3$: zbir cifara (sve su $7$ ili $0$) je $7 · k$, deljiv sa $3$ ⇒ bar tri sedmice. Najmanji: $77 700$.',
        K('Rastavimo: $77 700 = 777 · 100 = 3 · 7 · 37 · 2² · 5²$.', [], C.tabela([['~prost činilac', 2, 3, 5, 7, 37], ['~izložilac', 2, 1, 2, 1, 1], ['~izbora', 3, 2, 3, 2, 2]])),
        'Broj delilaca: $(2 + 1)(1 + 1)(2 + 1)(1 + 1)(1 + 1) = 3 · 2 · 3 · 2 · 2 = 72$.',
      ]);
    Z(6, 5, 2,
      'U Petrovom odeljenju ima $n$ učenika. Svaki je sakupio bar jedan album, a najviše od svih, $8$ albuma, sakupio je Petar. Koja je najmanja vrednost $n$ za koju sigurno postoji bar $5$ učenika sa istim brojem albuma?',
      ['$30$', '$29$', '$33$', '$41$'],
      [
        'Petar ima $8$ albuma i jedini je sa najviše – ostali imaju od $1$ do $7$ albuma: $7$ „kutija“.',
        K('Najgori slučaj: u svakoj od $7$ kutija po $4$ učenika – nijednih pet sa istim brojem. To je $7 · 4 + 1 = 29$ učenika (sa Petrom).', [], C.stubici([['1', 4], ['2', 4], ['3', 4], ['4', 4], ['5', 4], ['6', 4], ['7', 4], ['8', 1]], { korakY: 1, maxY: 5, istakni: [7] })),
        'Sa $30$ učenika ($29$ osim Petra), po Dirihleovom principu neka kutija ima bar $5$: $29 > 7 · 4$. Odgovor: $n = 30$.',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'Uporedi razlomke ${3^{2021} + 2|3^{2022} + 2}$ i ${3^{2022} + 2|3^{2023} + 2}$.',
      ['Prvi je veći', 'Drugi je veći', 'Jednaki su', 'Ne može se odrediti'],
      [
        'Za pozitivne brojeve: ${a|b} > {c|d}$ tačno kad je $ad > bc$. Neka je $a = 3^{2021} + 2$, $b = c = 3^{2022} + 2$, $d = 3^{2023} + 2$.',
        '$ad = 3^{4044} + 2 · 3^{2021} + 2 · 3^{2023} + 4 = 3^{4044} + 20 · 3^{2021} + 4$ (jer je $3^{2023} = 9 · 3^{2021}$).',
        '$bc = (3^{2022} + 2)² = 3^{4044} + 4 · 3^{2022} + 4 = 3^{4044} + 12 · 3^{2021} + 4$.',
        '$ad > bc$, pa je prvi razlomak veći. (Intuicija: oba su blizu ${1|3}$, ali dodatak $2$ više „pomaže“ manjim brojevima.)',
      ]);
    Z(7, 2, 2,
      'Kolika je poslednja cifra zbira $1^{2022} + 2^{2022} + 3^{2022} + … + 2021^{2022}$?',
      ['$1$', '$5$', '$0$', '$6$'],
      [
        'Poslednja cifra stepena zavisi od poslednje cifre osnove i ponavlja se sa periodom $4$ (ili kraće). $2022 = 4 · 505 + 2$, pa se stepen $2022$ ponaša kao kvadrat.',
        K('Poslednje cifre: $1 → 1$, $2 → 4$, $3 → 9$, $4 → 6$, $5 → 5$, $6 → 6$, $7 → 9$, $8 → 4$, $9 → 1$, $0 → 0$. Zbir u jednoj desetici: $45$ – završava se sa $5$.', [], C.tabela([['~cifra', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0], ['~kraj stepena', 1, 4, 9, 6, 5, 6, 9, 4, 1, 0]])),
        'Od $1$ do $2020$ ima $202$ desetice: $202 · 5 = 1010$ – završava se sa $0$.',
        'Ostaje $2021^{2022}$, koji se završava sa $1$. Poslednja cifra zbira je $1$.',
      ]);
    Z(7, 3, 1,
      'Dve drugarice i tri druga kupili su $5$ karata za susedna sedišta u jednom redu. Na koliko načina mogu da sednu tako da drugarice sede jedna do druge?',
      ['$48$', '$24$', '$120$', '$96$'],
      [
        'Zamislimo drugarice kao jedan „blok“. Tada raspoređujemo $4$ celine (blok + tri druga) na $4$ mesta: $4 · 3 · 2 · 1 = 24$ načina.',
        'Unutar bloka drugarice mogu da zamene mesta: $2$ načina.',
        K('Ukupno: $24 · 2 = 48$.', [], C.tabela([['~sedište', 1, 2, 3, 4, 5], ['~primer', '♀', '♀', '♂', '♂', '♂'], ['~primer', '♂', '♀', '♀', '♂', '♂']], { istakni: [[1, 1], [1, 2], [2, 2], [2, 3]] })),
      ]);
    Z(7, 4, 2,
      'Dat je trapez $ABCD$ sa osnovicama $AB = 5 cm$ i $CD = 3 cm$. Dijagonala $AC$ je normalna na krak $BC$, a dijagonala $BD$ polovi ugao kod temena $B$. Kolika je visina trapeza?',
      ['$2,4 cm$', '$3 cm$', '$2 cm$', '$2,5 cm$'],
      [
        'Uglovi $ABD$ i $BDC$ su jednaki (naizmenični kod paralelnih osnovica). Kako $BD$ polovi ugao $B$, i $∡CBD = ∡ABD$.',
        K('Zato je u trouglu $BCD$: $∡CBD = ∡CDB$, pa je jednakokrak: $BC = CD = 3 cm$.', ['t1']),
        'Trougao $ABC$ je pravougli (prav ugao kod $C$): $AC = √{5² − 3²} = 4 cm$.',
        K('Visina trapeza jednaka je visini trougla $ABC$ na hipotenuzu $AB$: $h = {AC · BC|AB} = {4 · 3|5} = 2,4 cm$.', ['h']),
      ],
      G({ A: [0, 0, 225], B: [5, 0, -45], C: [3.2, 2.4, 45], D: [0.2, 2.4, 135], E: [3.2, 0, -90] },
        [{ p: 'ABCD' }, { d: 'AC', isp: 1 }, { d: 'BD', isp: 1 }, { pu: 'ACB' }, { p: 'BCD', id: 't1', b: 2, k: 2 }, { d: 'CE', id: 'h', b: 1, k: 4 }, { pu: 'CEB', k: 4 }]));
    Z(7, 5, 3,
      'Neka je $M$ presek simetrale ugla kod temena $A$ i stranice $BC$ trougla $ABC$. Centar upisane kružnice trougla $AMB$ je ujedno centar opisane kružnice trougla $ABC$. Koliki su uglovi trougla $ABC$?',
      ['$α = 72°$, $β = 36°$, $γ = 72°$', '$α = 60°$, $β = 60°$, $γ = 60°$', '$α = 36°$, $β = 72°$, $γ = 72°$', '$α = 90°$, $β = 45°$, $γ = 45°$'],
      [
        'Neka je $O$ taj zajednički centar. $AM$ polovi $α$: $∡CAM = ∡MAB = {α|2}$. $O$ je centar upisane kružnice trougla $AMB$, pa $AO$ polovi ugao $MAB$: $∡MAO = ∡OAB = {α|4}$.',
        'Trouglovi $OAB$, $OBC$, $OCA$ su jednakokraki (kraci su poluprečnici opisane kružnice). Iz $OAB$: $∡OBA = {α|4}$; $BO$ polovi ugao $ABM$ (centar upisane), pa je i $∡OBC = {α|4}$, a iz $OBC$: $∡OCB = {α|4}$.',
        'Zato je $β = {α|4} + {α|4} = {α|2}$, a iz trougla $OCA$: $∡OCA = ∡OAC = {α|2} + {α|4}$, pa je $γ = {α|4} + {3α|4} = α$.',
        'Zbir: $α + {α|2} + α = 180°$, tj. ${5α|2} = 180°$, pa je $α = 72°$, $β = 36°$, $γ = 72°$ – „zlatni“ trougao.',
      ],
      G({ A: [0, 0, 225], C: [2, 0, -45], B: [1, 3.078, 90], O: [1, 1.376, 180], M: [1.618, 1.176, 0] },
        [{ p: 'ABC' }, { d: 'AM', b: 1 }, { tacka: 'O' }, { kr: 'O', r: 1.701, b: 2, isp: 1 }, { d: 'OA', isp: 1 }, { d: 'OB', isp: 1 }, { d: 'OC', isp: 1 }]));

    // ───────── VIII razred ─────────
    Z(8, 1, 1,
      'Osnova prave četvorostrane prizme je romb stranice $12 cm$ sa oštrim uglom $60°$. Kolika je zapremina prizme ako je visina jednaka polovini duže dijagonale romba?',
      ['$1296 cm³$', '$1296√3 cm³$', '$432√3 cm³$', '$864 cm³$'],
      [
        'Kraća dijagonala deli romb na dva jednakostranična trougla stranice $12$: $B = 2 · {12²√3|4} = 72√3 cm²$.',
        'Duža dijagonala je dvostruka visina jednakostraničnog trougla: $d_{1} = 2 · {12√3|2} = 12√3 cm$, pa je visina prizme $H = 6√3 cm$.',
        K('$V = B · H = 72√3 · 6√3 = 72 · 6 · 3 = 1296 cm³$.', [], C.prizmaOsnova([[0, 0], [4, 0], [6, 3.464], [2, 3.464]], 3.464)),
      ]);
    Z(8, 2, 2,
      'Koliko ima šestocifrenih brojeva deljivih sa $5$, zapisanih ciframa $1, 2, 3, 4, 5, 6$ (svaka tačno jednom), u kojima cifre $1$ i $2$ nisu jedna do druge?',
      ['$72$', '$120$', '$48$', '$96$'],
      [
        'Deljiv sa $5$ ⇒ poslednja cifra je $5$. Ostale cifre $1, 2, 3, 4, 6$ raspoređujemo na prvih $5$ mesta: $5! = 120$ načina.',
        K('Rasporedi gde su $1$ i $2$ susedni: „blok“ $12$ ili $21$ + tri cifre = $4$ celine: $4! = 24$, puta $2$ za redosled u bloku = $48$.', [], C.tabela([['~primer', 3, 1, 2, 4, 6, 5], ['~primer', 2, 1, 6, 3, 4, 5]], { zaglavlje: false, istakni: [[0, 2], [0, 3], [1, 1], [1, 2]] })),
        'Traženih: $120 − 48 = 72$.',
      ]);
    Z(8, 3, 3,
      'Osnova trostrane piramide $ABCS$ je jednakokrako-pravougli trougao $ABC$ sa pravim uglom kod $B$. Vrh $S$ se projektuje u središte $D$ ivice $AC$. Bočna strana $ACS$ je pravougli trougao sa pravim uglom kod $S$, a $SD = √2 cm$. Kolika je površina piramide?',
      ['$2(2 + √3) cm²$', '$4 + √3 cm²$', '$2(1 + √3) cm²$', '$8 cm²$'],
      [
        '$S$ se projektuje u središte $AC$, pa je $SA = SC$: trougao $ACS$ je jednakokrako-pravougli sa visinom $SD = √2$, pa je $AC = 2√2$, a $SA = SC = 2$.',
        'Trougao $ABC$ ima hipotenuzu $AC = 2√2$, pa su katete $AB = BC = 2$. Trouglovi $ABC$ i $ACS$ su podudarni (oba jednakokrako-pravougla sa hipotenuzom $2√2$): površine po $2 cm²$.',
        '$BD = {AC|2} = √2$ (središte hipotenuze), a $SD ⊥ BD$, pa je $SB = √{2 + 2} = 2$.',
        K('Trouglovi $ABS$ i $BCS$ imaju sve stranice $2$ – jednakostranični, površine po ${2²√3|4} = √3$. Ukupno: $P = 2 + 2 + √3 + √3 = 2(2 + √3) cm²$.', [], C.piramidaOsnova([[2, 0], [0, 0], [0, 2]], [1, 1, 1.414], [{ d: 'SD', isp: 1, b: 1 }], { T3: { D: [1, 1, 0] } })),
      ]);
    Z(8, 4, 2,
      'Koliko celobrojnih rešenja $(x, y)$ ima jednačina $y^{4} + x = xy + 8$?',
      ['$4$', '$2$', '$8$', '$3$'],
      [
        'Prepišimo: $x(y − 1) = y^{4} − 8$. Za $y = 1$: $0 = −7$ – nemoguće, pa je $y ≠ 1$.',
        '$x = {y^{4} − 8|y − 1} = {y^{4} − 1 − 7|y − 1} = (y² + 1)(y + 1) − {7|y − 1}$.',
        '$x$ je ceo tačno kad $y − 1$ deli $7$: $y − 1 ∈ \\{−7, −1, 1, 7\\}$, tj. $y ∈ \\{−6, 0, 2, 8\\}$.',
        K('Rešenja: $(−184, −6)$, $(8, 0)$, $(8, 2)$, $(584, 8)$ – četiri.', [], C.tabela([['y', '−6', 0, 2, 8], ['x', '−184', 8, 8, 584]])),
      ]);
    Z(8, 5, 3,
      'Da li je moguće brojeve $3, 3², …, 3^{n}$ podeliti u tri grupe (ne obavezno jednake veličine) tako da proizvod elemenata svake grupe bude isti, za a) $n = 2022$; b) $n = 2023$?',
      ['a) da, b) ne', 'a) ne, b) da', 'a) da, b) da', 'a) ne, b) ne'],
      [
        'Proizvod svih brojeva je $3^{1 + 2 + … + n} = 3^{{n(n + 1)|2}}$. Ako su tri proizvoda jednaka ($A$), onda je $A³ = 3^{{n(n + 1)|2}}$, pa ${n(n + 1)|2}$ mora biti deljivo sa $3$.',
        'b) $n = 2023$: ${2023 · 2024|2} = 2023 · 1012$ – ni $2023$ ni $1012$ nisu deljivi sa $3$. Nemoguće.',
        K('a) $n = 2022$: izložioce $1, …, 2022$ delimo u šestorke $\\{1, …, 6\\}, \\{7, …, 12\\}, …$; u svakoj su zbirovi prvog i šestog, drugog i petog, trećeg i četvrtog isti – po jedan par ide u svaku grupu.', [], C.tabela([['~grupa 1', '1 + 6', '7 + 12', '…'], ['~grupa 2', '2 + 5', '8 + 11', '…'], ['~grupa 3', '3 + 4', '9 + 10', '…']])),
        'Zbirovi izložilaca u grupama su jednaki, pa su i proizvodi jednaki. Dakle a) da, b) ne.',
      ]);
  },
};
