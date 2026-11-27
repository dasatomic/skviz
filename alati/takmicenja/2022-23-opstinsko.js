// Opštinsko takmičenje iz matematike učenika osnovnih škola, 4. 2. 2023. (DMS)
// https://dms.rs/wp-content/uploads/2023/02/Resenja-zadataka-1-1.pdf
module.exports = {
  godina: '2022/23', nivo: 'opstinsko', datum: '4. 2. 2023.',
  zadaci: ({ Z, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Koji su svi prosti brojevi $a$ takvi da važi $2 < {a|16} < 3$?',
      ['$37, 41, 43, 47$', '$37, 41, 43$', '$33, 37, 41, 43, 47$', '$31, 37, 41, 43, 47$'],
      [
        'Proširimo granice na imenilac $16$: $2 = {32|16}$ i $3 = {48|16}$. Uslov postaje ${32|16} < {a|16} < {48|16}$, tj. $32 < a < 48$.',
        'Tražimo proste brojeve između $32$ i $48$. Proveravamo neparne: $33 = 3 · 11$, $35 = 5 · 7$, $37$ prost, $39 = 3 · 13$, $41$ prost, $43$ prost, $45 = 5 · 9$, $47$ prost.',
        K('Traženi brojevi su $37, 41, 43$ i $47$.', [], C.brojevna(32, 48, [[37, '37', 1], [41, '41', 1], [43, '43', 1], [47, '47', 1]], { podela: 1, svaki: 4 })),
      ]);
    Z(5, 2, 1,
      'Dana je trebalo da ukuca u računar trocifren broj. Pri kucanju je ispred tog broja greškom ukucala cifru $6$ i tako dobila $31$ put veći broj. Koji broj je Dana trebalo da ukuca?',
      ['$200$', '$300$', '$150$', '$250$'],
      [
        'Neka je traženi trocifren broj $n$. Kad ispred njega dopišemo cifru $6$, dobijamo četvorocifren broj $6000 + n$ (cifra $6$ je na mestu hiljada).',
        'Uslov: $6000 + n = 31 · n$.',
        'Kako je $31 · n = n + 30 · n$, sledi $6000 = 30 · n$, pa je $n = 200$.',
        'Provera: $6200 = 31 · 200$ ✓.',
      ]);
    Z(5, 3, 2,
      'Stranice pravougaonika se razlikuju za $2 cm$. Ako svaku stranicu uvećamo za $3 cm$, površina se uveća za $105 cm²$. Koliki su obim i površina polaznog pravougaonika?',
      ['$O = 64 cm$, $P = 255 cm²$', '$O = 60 cm$, $P = 224 cm²$', '$O = 64 cm$, $P = 360 cm²$', '$O = 68 cm$, $P = 288 cm²$'],
      [
        'Neka su stranice $a$ i $b$, $a − b = 2$.',
        K('Uvećani pravougaonik ima dodatak od tri dela: traka $3 × a$, traka $3 × b$ i kvadratić $3 × 3$. Zato je $3a + 3b + 9 = 105$.', [], G({}, [C.pr(0, 0, 17, 15, 0), C.pr(17, 0, 3, 15, 1, { gusto: 1 }), C.pr(0, 15, 17, 3, 2, { gusto: 1 }), C.pr(17, 15, 3, 3, 3, { gusto: 1 }), { tx: 'a', at: [8.5, -1.2] }, { tx: 'b', at: [-1, 7.5] }, { tx: '3', at: [18.5, -1.2] }, { tx: '3', at: [-1, 16.5] }, { tx: '~a · b', at: [8.5, 7.5] }])),
        '$3a + 3b = 96$, pa je $a + b = 32$.',
        'Zbir $32$ i razlika $2$: $a = (32 + 2) : 2 = 17 cm$, $b = 15 cm$.',
        'Obim: $2 · (17 + 15) = 64 cm$, površina: $17 · 15 = 255 cm²$. Provera: $20 · 18 − 255 = 360 − 255 = 105$ ✓.',
      ]);
    Z(5, 4, 2,
      'Koliki je zbir prvih $450$ decimala u decimalnom zapisu razlomka ${11|7}$?',
      ['$2025$', '$2700$', '$1800$', '$2250$'],
      [
        'Podelimo: $11 : 7 = 1,571428571428…$ – decimale se ponavljaju u grupi od $6$ cifara: $571428$.',
        'Zbir cifara jedne grupe: $5 + 7 + 1 + 4 + 2 + 8 = 27$.',
        '$450 : 6 = 75$ – prvih $450$ decimala čini tačno $75$ celih grupa.',
        K('Zbir: $75 · 27 = 2025$.', [], C.tabela([['~decimala', '1.', '2.', '3.', '4.', '5.', '6.', '7.', '…'], ['~cifra', 5, 7, 1, 4, 2, 8, 5, '…']], { istakni: [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6]] })),
      ]);
    Z(5, 5, 3,
      'Koliko ima petocifrenih brojeva deljivih i sa $25$ i sa $3$ u čijem se zapisu koriste tačno $2$ različite cifre?',
      ['$22$', '$18$', '$20$', '$24$'],
      [
        'Deljiv sa $25$ ⇒ završava se sa $00$, $25$, $50$ ili $75$. Deljiv sa $3$ ⇒ zbir cifara deljiv sa $3$.',
        'Završetak $00$: druga cifra je neka $a ≠ 0$. Oblici: $aaa00$ (zbir $3a$ – uvek deljiv sa $3$, $9$ brojeva), $aa000$, $a0a00$, $a0000$ (zbirovi $2a$, $2a$, $a$ – treba $a ∈ \\{3, 6, 9\\}$, po $3$ broja). Ukupno $9 + 3 + 3 + 3 = 18$.',
        'Završetak $25$: cifre su samo $2$ i $5$. Ako broj ima $k$ petica ($1 ≤ k ≤ 4$) i $5 − k$ dvojki, zbir cifara je $5k + 2(5 − k) = 10 + 3k$ – pri deljenju sa $3$ uvek daje ostatak $1$. Nema takvih brojeva.',
        'Završetak $50$: cifre $5$ i $0$, prva cifra $5$; zbir je $5 ·$ (broj petica), deljiv sa $3$ samo za tri petice: $55050$ i $50550$ – $2$ broja.',
        'Završetak $75$: cifre $7$ i $5$, zbir $= 7k + 5(5 − k) = 25 + 2k$ za $k$ sedmica ($k$ od $1$ do $4$): deljivo sa $3$ za $k = 1$ ($55575$) i $k = 4$ ($77775$) – $2$ broja.',
        K('Ukupno: $18 + 0 + 2 + 2 = 22$.', [], C.tabela([['~završetak', '00', '25', '50', '75'], ['~brojeva', 18, 0, 2, 2]])),
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Dati su razlomci ${43|337}$ i ${6|47}$. Koji broj treba oduzeti i od brojioca i od imenioca manjeg razlomka da bi dobijeni razlomak bio jednak većem?',
      ['$−{1|41}$', '${1|41}$', '$1$', '$−1$'],
      [
        'Uporedimo razlomke: ${43|337} − {6|47} = {43 · 47 − 6 · 337|337 · 47} = {2021 − 2022|…} < 0$, pa je ${43|337}$ manji.',
        'Uslov: ${43 − x|337 − x} = {6|47}$.',
        'Unakrsno: $47(43 − x) = 6(337 − x)$, tj. $2021 − 47x = 2022 − 6x$.',
        '$−41x = 1$, pa je $x = −{1|41}$ (oduzimanje negativnog broja znači dodavanje ${1|41}$).',
      ]);
    Z(6, 2, 1,
      'Beli, crni i crveni žetoni poređani su u niz. Prvo su beli poređani u niz, zatim je između svaka dva bela stavljen po jedan crni. Na kraju je između svaka dva susedna žetona stavljen po jedan crveni. Koliko je bilo belih žetona ako je ukupno u nizu $397$ žetona?',
      ['$100$', '$99$', '$198$', '$132$'],
      [
        K('Između $n$ žetona u nizu ima $n − 1$ „razmaka“. Pogledaj početak niza: beli, crveni, crni, crveni, beli, …', [], G({}, ['⚪', '🔴', '⚫', '🔴', '⚪', '🔴', '⚫', '🔴', '⚪'].map((t, i) => ({ tx: t, at: [i * 1.2, 0], vel: 22 })))),
        'Crvenih je za jedan manje od svih belih i crnih zajedno. Ako je belih i crnih ukupno $m$, onda je $m + (m − 1) = 397$, pa je $m = 199$, a crvenih $198$.',
        'Crnih je za jedan manje od belih: $b + (b − 1) = 199$, pa je belih $b = 100$, a crnih $99$.',
        'Provera: $100 + 99 + 198 = 397$ ✓.',
      ]);
    Z(6, 3, 2,
      'U oštrouglom trouglu $ABC$ razlika uglova kod temena $A$ i $C$ je $50°$, a visine iz temena $A$ i $C$ seku se u tački $H$ tako da je $∡AHC = 110°$. Koliki su uglovi trougla?',
      ['$α = 80°$, $β = 70°$, $γ = 30°$', '$α = 70°$, $β = 90°$, $γ = 20°$', '$α = 75°$, $β = 80°$, $γ = 25°$', '$α = 80°$, $β = 60°$, $γ = 40°$'],
      [
        'Neka su $AD$ i $CE$ visine. Trouglovi $ADC$ i $AEC$ su pravougli.',
        K('U trouglu $AEC$ (prav ugao kod $E$): $∡ACE = 90° − α$. U trouglu $ADC$ (prav ugao kod $D$): $∡DAC = 90° − γ$.', ['t']),
        'U trouglu $AHC$: $∡AHC = 180° − (90° − α) − (90° − γ) = α + γ = 110°$.',
        'Iz $α + γ = 110°$ i $α − γ = 50°$: $α = 80°$, $γ = 30°$, pa je $β = 180° − 110° = 70°$.',
        'Lepo pravilo: ugao između dve visine jednak je zbiru uglova kod temena iz kojih su povučene (tačnije $180° − β$).',
      ],
      G({ A: [0, 0, 225], B: [4, 0, -45], C: [1.305, 7.404, 90], D: [3.532, 1.286, 0], E: [1.305, 0, -90], H: [1.305, 0.475, 160] },
        [{ p: 'ABC' }, { d: 'AD', b: 1 }, { d: 'CE', b: 1 }, { pu: 'ADB' }, { pu: 'CEB' }, { tacka: 'H' }, { p: 'AHC', id: 't', b: 2, k: 2 }]));
    Z(6, 4, 2,
      'Dat je broj $123456789$. Koliko najmanje cifara treba precrtati da bi preostali broj bio deljiv sa $36$?',
      ['$3$', '$2$', '$1$', '$4$'],
      [
        'Deljiv sa $36 = 4 · 9$ znači: deljiv sa $4$ (poslednje dve cifre) i sa $9$ (zbir cifara).',
        'Zbir svih cifara je $45$ – deljiv sa $9$. Ali završetak $89$ nije deljiv sa $4$, a nijedan završetak koji se završava neparnom cifrom $9$ nije paran – zato cifru $9$ moramo precrtati. Ostaje $12345678$ (zbir $36$).',
        'Završetak $78$ nije deljiv sa $4$. Ako precrtamo još samo jednu cifru, zbir ($36$ minus cifra) više nije deljiv sa $9$ – osim ako precrtamo $9$, koje više nema. Zato treba precrtati bar još dve cifre: ukupno bar $3$.',
        'Sa tri ide: precrtamo $9$, $7$ (završetak postaje $68 = 4 · 17$) i $2$ (zbir $45 − 9 − 7 − 2 = 27$). Ostaje $134568 = 36 · 3738$ ✓.',
      ]);
    Z(6, 5, 3,
      'U pravouglom trouglu $ABC$ ($∡ACB = 90°$) simetrale oštrih uglova seku naspramne katete u tačkama $A_{1}$ i $B_{1}$. Tačke $M$ i $N$ su podnožja normala iz $A_{1}$ i $B_{1}$ na hipotenuzu. Kolika je mera ugla $MCN$?',
      ['$45°$', '$30°$', '$60°$', 'zavisi od trougla'],
      [
        'Neka je $∡BAC = α$, $∡ABC = β$, $α + β = 90°$.',
        K('Trouglovi $ACA_{1}$ i $AMA_{1}$ su podudarni (USU: zajednička $AA_{1}$, jednaki uglovi ${α|2}$ kod $A$, i po $90° − {α|2}$ kod $A_{1}$), pa je $A_{1}C = A_{1}M$.', ['t1']),
        'Slično su podudarni $BCB_{1}$ i $BNB_{1}$, pa je $B_{1}C = B_{1}N$. Trouglovi $MCA_{1}$ i $NCB_{1}$ su jednakokraki.',
        'U pravouglom trouglu $MBA_{1}$ je $∡BA_{1}M = α$; to je spoljašnji ugao jednakokrakog trougla $MCA_{1}$, pa je $∡A_{1}CM = {α|2}$. Slično $∡B_{1}CN = {β|2}$.',
        '$∡MCN = 90° − {α|2} − {β|2} = 90° − {α + β|2} = 90° − 45° = 45°$ – za svaki pravougli trougao!',
      ],
      G({ C: [0, 0, 225], B: [4, 0, -45], A: [0, 3, 135], A1: [1.5, 0, -90], B1: [0, 1.333, 180], M: [2.4, 1.2, 45], N: [0.8, 2.4, 45] },
        [{ p: 'ABC' }, { pu: 'ACB' }, { d: 'AA1', b: 1 }, { d: 'BB1', b: 1 }, { d: 'A1M', isp: 1 }, { d: 'B1N', isp: 1 }, { d: 'CM', b: 2 }, { d: 'CN', b: 2 }, { u: 'MCN'.split('').reverse().join(''), o: '?', b: 3 }, { p: 'ACA1', id: 't1', b: 4, k: 2 }]));

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Odredi složen prirodan broj $s$ i prost broj $p$ takve da je ${32^{5} · 16^{4} · 8³|64²} = s^{p}$. Koja su sva rešenja?',
      ['$s = 4, p = 19$ i $s = 2^{19}, p = 2$', 'samo $s = 4, p = 19$', '$s = 2, p = 38$ i $s = 4, p = 19$', 'samo $s = 2^{19}, p = 2$'],
      [
        'Sve su stepeni dvojke: $32^{5} = 2^{25}$, $16^{4} = 2^{16}$, $8³ = 2^{9}$, $64² = 2^{12}$.',
        'Leva strana: $2^{25 + 16 + 9 − 12} = 2^{38}$.',
        '$s^{p} = 2^{38}$, pa je $s$ stepen dvojke, $s = 2^{m}$, i $m · p = 38 = 2 · 19$. Kako je $p$ prost: $p = 2$ ili $p = 19$.',
        '$p = 19$: $m = 2$, $s = 4$ – složen ✓. $p = 2$: $m = 19$, $s = 2^{19}$ – složen ✓. ($p = 38$ nije prost, a $s = 2$ nije složen.)',
      ]);
    Z(7, 2, 2,
      'Romb $ABCD$ ima stranicu $6 cm$ i ugao od $60°$ kod temena $A$. Iz temena $B$ konstruisane su visine romba $BE$ i $BF$. Koliki su obim i površina trougla $BEF$?',
      ['$O = 9√3 cm$, $P = {27√3|4} cm²$', '$O = 9√3 cm$, $P = 9√3 cm²$', '$O = 18 cm$, $P = {27√3|4} cm²$', '$O = 6√3 cm$, $P = {9√3|4} cm²$'],
      [
        K('Kraća dijagonala $BD$ deli romb na dva jednakostranična trougla $ABD$ i $CBD$ (stranica $6$, ugao $60°$).', ['t1', 't2']),
        'Visine romba iz $B$ su visine ovih trouglova: $BE = BF = {6√3|2} = 3√3 cm$, i one polove uglove kod $B$: $∡EBD = ∡FBD = 30°$.',
        'Zato je $∡EBF = 60°$, pa je jednakokraki trougao $BEF$ sa uglom $60°$ pri vrhu – jednakostraničan, stranice $3√3$.',
        'Obim: $9√3 cm$. Površina: ${(3√3)²√3|4} = {27√3|4} cm²$.',
      ],
      G({ A: [0, 0, 225], B: [6, 0, -45], C: [9, 5.196, 45], D: [3, 5.196, 135], E: [1.5, 2.598, 160], F: [6, 5.196, 90] },
        [{ p: 'ABCD' }, { u: 'BAD', o: '60°' }, { d: 'BE', b: 1 }, { d: 'BF', b: 1 }, { pu: 'BEA' }, { pu: 'BFC' }, { d: 'BD', isp: 1, k: 1 }, { p: 'ABD', id: 't1', b: 2, k: 1 }, { p: 'BCD', id: 't2', b: 4, k: 1 }, { p: 'BEF', b: 3, k: 3 }]));
    Z(7, 3, 2,
      'Prost broj $p$ i različiti celi brojevi $a$ i $b$ zadovoljavaju $p + |a · b| = 10$. Koliko rešenja postoji (rešenje je isto ako $a$ i $b$ zamene vrednosti)?',
      ['$20$', '$16$', '$40$', '$12$'],
      [
        'Iz $|a · b| = 10 − p$ sledi $p < 10$, a proizvod ne sme biti $0$ (onda bi bilo $p = 10$, nije prost). Prosti brojevi su $2, 3, 5, 7$, pa je $|ab| = 8, 7, 5, 3$.',
        '$|ab| = 8$: apsolutne vrednosti mogu biti $\\{1, 8\\}$ ili $\\{2, 4\\}$ (jer je $8 = 1 · 8 = 2 · 4$). Svaki par daje $4$ izbora znakova, npr. $(1, 8), (−1, 8), (1, −8), (−1, −8)$ – ukupno $8$ rešenja.',
        '$|ab| = 7$, $5$, $3$: samo par $\\{1, q\\}$ (prost $q$), sa po $4$ izbora znakova – po $4$ rešenja.',
        K('Ukupno $8 + 4 + 4 + 4 = 20$.', [], C.tabela([['p', 2, 3, 5, 7], ['|ab|', 8, 7, 5, 3], ['~parovi', '{1, 8}, {2, 4}', '{1, 7}', '{1, 5}', '{1, 3}'], ['~rešenja', 8, 4, 4, 4]])),
      ]);
    Z(7, 4, 2,
      'Stranica kvadrata $ABCD$ je $12 cm$. Tačke $M, N, P, Q$ su središta stranica $AB, BC, CD, DA$, a $R$ je proizvoljna tačka duži $MN$. Kolika je površina trougla $PQR$?',
      ['$36 cm²$', '$72 cm²$', '$18 cm²$', 'zavisi od položaja tačke $R$'],
      [
        K('Četvorougao $MNPQ$ (spaja središta stranica) je kvadrat: trouglovi $AMQ$, $BNM$, $CPN$, $DQP$ su podudarni jednakokrako-pravougli, pa su sve stranice jednake i svi uglovi pravi.', ['kv']),
        'Stranica kvadrata $MNPQ$: $√{6² + 6²} = 6√2 cm$.',
        'Prava $MN$ je paralelna sa $PQ$, pa je rastojanje svake tačke $R$ duži $MN$ od prave $PQ$ isto – jednako stranici kvadrata $MNPQ$, $6√2$.',
        'Površina: ${PQ · h|2} = {6√2 · 6√2|2} = 36 cm²$ – ne zavisi od položaja tačke $R$ (četvrtina kvadrata $ABCD$).',
      ],
      G({ A: [0, 0, 225], B: [12, 0, -45], C: [12, 12, 45], D: [0, 12, 135], M: [6, 0, -90], N: [12, 6, 0], P: [6, 12, 90], Q: [0, 6, 180], R: [9, 3, -45] },
        [{ p: 'ABCD' }, { d: 'MN' }, { p: 'PQR', b: 1 }, { p: 'MNPQ', id: 'kv', b: 2, k: 1, prazno: 1 }]));
    Z(7, 5, 2,
      'Nata redom zapisuje brojeve $1, −3, 5, −7, 9, −11, …$ (naizmenično menja znak, a apsolutne vrednosti su redom neparni brojevi). Na koliko načina može da prestane sa pisanjem tako da zbir svih zapisanih brojeva bude delilac broja $2023$?',
      ['$6$', '$3$', '$4$', '$12$'],
      [
        K('Pogledajmo zbirove: posle $1$ broja $1$, posle $2$: $−2$, posle $3$: $3$, posle $4$: $−4$, posle $5$: $5$… Posle neparnog broja $n$ članova zbir je $n$, a posle parnog $−n$.', [], C.tabela([['~članova', 1, 2, 3, 4, 5, 6, 7], ['~zbir', 1, '−2', 3, '−4', 5, '−6', 7]])),
        'Zašto: drugi i treći član daju $−3 + 5 = 2$, četvrti i peti $2$… pa svaki par posle prvog člana dodaje $2$.',
        '$2023 = 7 · 17²$ je neparan; delioci: $1, 7, 17, 119, 289, 2023$ (i negativni $−1, −7, …$).',
        'Zbir posle parnog broja članova je paran ($−2, −4, …$) – ne deli $2023$. Posle neparnog broja $n$ zbir je $n$, pa $n$ mora biti delilac: $n ∈ \\{1, 7, 17, 119, 289, 2023\\}$ – $6$ načina.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Na svakoj stranici kvadrata dato je $5$ tačaka (nijedna nije teme kvadrata). Koliko ima trouglova sa temenima u ovim tačkama?',
      ['$1100$', '$1140$', '$500$', '$600$'],
      [
        K('Ukupno je $20$ tačaka. Tri tačke se biraju na ${20 · 19 · 18|6} = 1140$ načina.', [], G({}, [C.pr(0, 0, 6, 6, 0, { prazno: 1 }), ...[1, 2, 3, 4, 5].flatMap((i) => [{ tx: '●', at: [i, -0.1], b: 1 }, { tx: '●', at: [i, 5.9], b: 1 }, { tx: '●', at: [0, i - 0.1], b: 1 }, { tx: '●', at: [6, i - 0.1], b: 1 }])])),
        'Tri tačke sa iste stranice su kolinearne – ne čine trougao. Na jednoj stranici takvih trojki ima ${5 · 4 · 3|6} = 10$, a stranica je $4$: $40$ „lažnih“ trojki.',
        'Trouglova: $1140 − 40 = 1100$.',
        'Drugi način: dva temena na istoj stranici ($4 · 10$ duži) i treće na drugoj ($15$ tačaka): $600$; sva tri na različitim stranicama ($4$ izbora stranica, $5³$): $500$. Ukupno $1100$.',
      ]);
    Z(8, 2, 2,
      'Dat je pravilan osmougao $ABCDEFGH$. Simetrala ugla $ABC$ i duž $AD$ seku se u tački $S$. Kolika je mera ugla $ASB$?',
      ['$67° 30\'$', '$45°$', '$72°$', '$56° 15\'$'],
      [
        K('Neka je $O$ centar. Centralni ugao $∡AOB = 360° : 8 = 45°$. Trougao $AOB$ je jednakokrak, pa je $∡OAB = ∡OBA = {180° − 45°|2} = 67° 30\'$.', ['t1']),
        'Trougao $AOD$: $OA = OD$ i $∡AOD = 3 · 45° = 135°$, pa je $∡OAD = {180° − 135°|2} = 22° 30\'$.',
        '$∡BAS = ∡BAO − ∡OAD = 67° 30\' − 22° 30\' = 45°$.',
        'Unutrašnji ugao osmougla je $135°$, pa simetrala daje $∡ABS = 67° 30\'$.',
        '$∡ASB = 180° − 45° − 67° 30\' = 67° 30\'$.',
      ],
      G({ A: [-1.531, -3.696, 250], B: [1.531, -3.696, 290], C: [3.696, -1.531, 0], D: [3.696, 1.531, 0], E: [1.531, 3.696, 90], F: [-1.531, 3.696, 90], G: [-3.696, 1.531, 180], H: [-3.696, -1.531, 180], O: [0, 0, 135], S: [0.634, -1.531, 135] },
        [{ p: 'ABCDEFGH' }, { d: 'AD' }, { d: 'BS', b: 1 }, { u: 'BSA'.split('').reverse().join(''), o: '?', b: 3 }, { tacka: 'O', k: 1 }, { p: 'AOB', id: 't1', b: 2, k: 1 }, { d: 'OD', isp: 1, k: 2 }]));
    Z(8, 3, 2,
      'Na kocku ivice $10 cm$ postavljena je pravilna četvorostrana prizma tako da su temena njene osnove središta ivica gornje strane kocke. Kolika je zapremina tog tela ako je visina prizme jednaka ivici kocke?',
      ['$1500 cm³$', '$2000 cm³$', '$1250 cm³$', '$1707 cm³$'],
      [
        'Zapremina kocke: $10³ = 1000 cm³$.',
        'Osnova prizme je kvadrat čija su temena središta ivica gornje strane kocke. Njegova stranica je srednja linija trougla od dve ivice i dijagonale strane: polovina dijagonale $10√2$, tj. $5√2 cm$.',
        'Površina osnove: $(5√2)² = 50 cm²$ – tačno polovina gornje strane kocke.',
        K('Zapremina prizme: $50 · 10 = 500 cm³$, a celog tela $1000 + 500 = 1500 cm³$.', [], C.prostor({ A: [0, 0, 0], B: [10, 0, 0], C: [10, 10, 0], D: [0, 10, 0], E: [0, 0, 10], F: [10, 0, 10], G: [10, 10, 10], H: [0, 10, 10], K: [5, 0, 10], L: [10, 5, 10], M: [5, 10, 10], N: [0, 5, 10], P: [5, 0, 20], Q: [10, 5, 20], R: [5, 10, 20], T: [0, 5, 20] },
          [{ d: 'AB' }, { d: 'BC' }, { d: 'CD', isp: 1 }, { d: 'DA', isp: 1 }, { d: 'AE' }, { d: 'BF' }, { d: 'CG' }, { d: 'DH', isp: 1 }, { p: 'EFGH', b: 0, prazno: 1 }, { p: 'KLMN', b: 1 }, { d: 'KP', b: 1 }, { d: 'LQ', b: 1 }, { d: 'MR', b: 1, isp: 1 }, { d: 'NT', b: 1 }, { p: 'PQRT', b: 1 }], { imena: false, bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T'] })),
      ]);
    Z(8, 4, 2,
      'Jaca, Cica i Mica kupile su materijal za haljine. Jaca je kupila za trećinu više od Cice, a Mica $1,6 m$ manje od Jace. Ako bi Jaca dala četvrtinu svog materijala Mici, a Cica trećinu svog materijala Mici, Mica bi imala koliko Jaca i Cica ukupno. Koliko je metara kupila Jaca?',
      ['$6,4 m$', '$4,8 m$', '$8 m$', '$5,6 m$'],
      [
        'Neka je Cica kupila $x$ metara. Jaca: ${4|3}x$, Mica: ${4|3}x − 1,6$.',
        'Posle davanja: Jaca ima ${3|4} · {4|3}x = x$, Cica ${2|3}x$, a Mica ${4|3}x − 1,6 + {1|3}x + {1|3}x = 2x − 1,6$ (dobila je ${1|4} · {4|3}x = {1|3}x$ od Jace i ${1|3}x$ od Cice).',
        'Uslov: $2x − 1,6 = x + {2|3}x$, tj. ${1|3}x = 1,6$, pa je $x = 4,8$.',
        K('Cica $4,8 m$, Jaca ${4|3} · 4,8 = 6,4 m$, Mica $6,4 − 1,6 = 4,8 m$.', [], C.stubici([['Jaca', 6.4], ['Cica', 4.8], ['Mica', 4.8]], { korakY: 2, maxY: 8, vrednosti: true, jedinica: ' m', istakni: [0] })),
      ]);
    Z(8, 5, 3,
      'Neka su $(x_{1}, y_{1}), …, (x_{n}, y_{n})$ svi parovi prirodnih brojeva koji zadovoljavaju jednačinu $8x + 3y = 2022$. Koliki je zbir $x_{1} + x_{2} + … + x_{n}$?',
      ['$10 710$', '$10 626$', '$7140$', '$3570$'],
      [
        '$3y$ i $2022 = 3 · 674$ su deljivi sa $3$, pa je i $8x$ deljivo sa $3$; kako su $8$ i $3$ uzajamno prosti, $x$ je deljiv sa $3$: $x = 3k$.',
        'Zamena: $24k + 3y = 2022$, tj. $8k + y = 674$, pa je $y = 674 − 8k$.',
        '$y ≥ 1$: $8k ≤ 673$, $k ≤ 84$; $x ≥ 1$: $k ≥ 1$. Dakle $k = 1, 2, …, 84$ – $84$ para.',
        K('Zbir: $3 · (1 + 2 + … + 84) = 3 · {84 · 85|2} = 3 · 3570 = 10 710$.', [], C.tabela([['k', 1, 2, 3, '…', 84], ['x = 3k', 3, 6, 9, '…', 252], ['y = 674 − 8k', 666, 658, 650, '…', 2]])),
      ]);
  },
};
