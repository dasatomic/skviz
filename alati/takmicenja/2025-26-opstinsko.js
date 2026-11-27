// Opštinsko takmičenje iz matematike učenika osnovnih škola, 7. 2. 2026. (DMS)
// https://dms.rs/wp-content/uploads/2026/02/Zadaci-opstinsko-25_26-RESENJA.pdf
module.exports = {
  godina: '2025/26', nivo: 'opstinsko', datum: '7. 2. 2026.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Skup $A$ čine prirodni brojevi pete i šeste desetice deljivi sa $6$. Skup $B$ čine prirodni brojevi deljivi sa $9$, koji su veći od $35$ i manji od $65$. Koji je skup $A ∪ B$?',
      ['$\\{36, 42, 45, 48, 54, 60, 63\\}$', '$\\{36, 42, 45, 48, 54, 60, 63, 66\\}$', '$\\{42, 45, 48, 54, 60, 63\\}$', '$\\{54\\}$'],
      [
        'Peta desetica su brojevi od $41$ do $50$, a šesta od $51$ do $60$. Među njima su deljivi sa $6$: $42 = 6 · 7$, $48 = 6 · 8$, $54 = 6 · 9$ i $60 = 6 · 10$. Zato je $A = \\{42, 48, 54, 60\\}$.',
        'Brojevi deljivi sa $9$ su $9, 18, 27, 36, 45, 54, 63, 72, …$ Između $35$ i $65$ su $36, 45, 54$ i $63$, pa je $B = \\{36, 45, 54, 63\\}$.',
        'Presek su elementi koji su u oba skupa: $A ∩ B = \\{54\\}$ (jedini broj deljiv i sa $6$ i sa $9$, tj. sa $18$, u tom delu).',
        K('Unija sadrži sve elemente oba skupa, a zajednički element $54$ pišemo samo jednom: $A ∪ B = \\{36, 42, 45, 48, 54, 60, 63\\}$ – ukupno $4 + 4 − 1 = 7$ elemenata.', [], (() => { const v = C.venn({ imena: ['A', 'B'], presek: true }); return G({}, [...v.e, ...C.upisi([42, 48, 60], v.mesta.A), ...C.upisi([36, 45, 63], v.mesta.B), ...C.upisi([54], v.mesta.AB)]); })()),
        'Pazi: šesta desetica se završava brojem $60$, pa $66$ ne pripada skupu $A$.',
      ]);
    Z(5, 2, 2,
      'Koliko ima razlomaka oblika ${x|506}$ ($x$ je prirodan broj) koji su veći od ${1|4}$, a manji od ${1|2}$?',
      ['$126$', '$127$', '$125$', '$253$'],
      [
        'Proširimo granice tako da imaju imenilac $506$ (ili njegov dvostruki): ${1|2} = {253|506}$, pa iz ${x|506} < {253|506}$ dobijamo $x < 253$, tj. $x ≤ 252$.',
        'Za donju granicu: $506$ nije deljiv sa $4$, pa uzmimo zajednički imenilac $1012$: ${1|4} = {253|1012}$ i ${x|506} = {2x|1012}$.',
        'Uslov ${2x|1012} > {253|1012}$ znači $2x > 253$, tj. $x > 126,5$. Pošto je $x$ prirodan broj, $x ≥ 127$.',
        K('Dakle $x ∈ \\{127, 128, …, 252\\}$. Brojeva od $127$ do $252$ ima $252 − 127 + 1 = 126$.', [], C.interval(110, 265, { a: 127, b: 252, ukljA: true, ukljB: true, podela: 10, svaki: 5, e: [{ tx: '¼', at: [126.5, 30], b: 1 }, { tx: '½', at: [253, 30], b: 1 }, { tx: '~brojilac x', at: [190, -25] }] })),
        'Odgovor: $126$ razlomaka. (Česta greška: $x = 126$ daje ${126|506} < {1|4}$, jer je $4 · 126 = 504 < 506$.)',
      ]);
    Z(5, 3, 1,
      'Odredi najmanji i najveći petocifreni prirodan broj deljiv sa $2026$. Koliki je njihov zbir?',
      ['$109 404$', '$107 378$', '$111 430$', '$99 274$'],
      [
        'Najmanji petocifreni broj je $10 000$. Množimo $2026$ redom: $4 · 2026 = 8104 < 10 000$, a $5 · 2026 = 10 130 > 10 000$.',
        'Zato je najmanji petocifreni broj deljiv sa $2026$ broj $10 130$.',
        'Najveći petocifreni broj je $99 999$. Kako je $50 · 2026 = 101 300 > 99 999$, a $49 · 2026 = 99 274 < 100 000$, najveći je $99 274$.',
        K('Traženi zbir je $10 130 + 99 274 = 109 404$.', [], C.brojevna(8000, 10500, [[8104, '4·2026', 4], [10000, '', 0], [10130, '5·2026', 1]], { podela: 500, svaki: 1 })),
      ]);
    Z(5, 4, 2,
      'Pravougaona terasa popločana je kvadratnim pločicama stranice $40 cm$. Upotrebljeno je tačno $600$ pločica, bez preklapanja i lomljenja pločica i bez praznina između njih. Svaka strana terase duža je od $2 m$. Koliki najveći obim može imati ta terasa?',
      ['$84,8 m$', '$96,8 m$', '$40,8 m$', '$62,4 m$'],
      [
        'Neka je duž jedne strane terase $x$ pločica, a duž druge $y$ pločica. Tada je $x · y = 600$.',
        'Svaka strana je duža od $2 m = 200 cm$, pa je $40 · x > 200$ i $40 · y > 200$, odnosno $x > 5$ i $y > 5$ – oba broja su bar $6$.',
        'Rastavimo $600 = 2 · 2 · 2 · 3 · 5 · 5$ i napišimo sve parove činilaca u kojima su oba bar $6$: $6 · 100$, $8 · 75$, $10 · 60$, $12 · 50$, $15 · 40$, $20 · 30$, $24 · 25$.',
        K('Obim je $2 · (x + y) · 40 cm$, pa je najveći kad je zbir $x + y$ najveći. Najveći zbir je $6 + 100 = 106$.', [], C.tabela([['x', 6, 8, 10, 12, 15, 20, 24], ['y', 100, 75, 60, 50, 40, 30, 25], ['x + y', 106, 83, 70, 62, 55, 50, 49]], { istakni: [[0, 1], [1, 1], [2, 1]], sirina: [1.6, 1.2] })),
        'Tada su strane terase $6 · 40 cm = 2,4 m$ i $100 · 40 cm = 40 m$, a obim je $2 · (2,4 m + 40 m) = 84,8 m$.',
        'Pazi: $5 · 120$ bi dalo još veći obim ($100 m$), ali tada bi jedna strana bila tačno $2 m$, a ona mora biti duža od $2 m$.',
      ]);
    Z(5, 5, 2,
      'Date su dve paralelne prave $a$ i $b$. Na pravoj $a$ date su tačke $A, B, C, D, E$, a na pravoj $b$ tačke $M, N, P$. Koliko četvorouglova određuju ove tačke?',
      ['$30$', '$13$', '$15$', '$60$'],
      [
        'Prvo prebrojmo duži. Na pravoj $a$: $AB, AC, AD, AE, BC, BD, BE, CD, CE, DE$ – to je $10$ duži (svaka od $5$ tačaka sa $4$ ostale daje $5 · 4 = 20$, a svaku duž smo brojali dvaput: $20 : 2 = 10$).',
        'Na pravoj $b$ su duži $MN, MP, NP$ – ukupno $3$.',
        'Četvorougao ne može imati tri temena na istoj pravoj (tada ta tri ne bi bila temena „pravog“ četvorougla), pa mora imati tačno dva temena na pravoj $a$ i dva na pravoj $b$.',
        'Zato je svaki četvorougao određen jednom duži na pravoj $a$ i jednom duži na pravoj $b$ (to su njegove dve paralelne stranice – četvorougao je trapez), i obrnuto: svaki takav par duži daje tačno jedan četvorougao.',
        'Broj četvorouglova: $10 · 3 = 30$.',
      ],
      G({ A: [0, 3, 90], B: [2, 3, 90], C: [4, 3, 90], D: [6, 3, 90], E: [8, 3, 90], M: [1.5, 0, -90], N: [4, 0, -90], P: [6.5, 0, -90], a1: [-1, 3], a2: [9, 3], b1: [-1, 0], b2: [9, 0] },
        [{ d: 'a1a2' }, { d: 'b1b2' }, { tx: 'a', at: [9.3, 3.3] }, { tx: 'b', at: [9.3, 0.3] },
          { tacka: 'A' }, { tacka: 'B' }, { tacka: 'C' }, { tacka: 'D' }, { tacka: 'E' }, { tacka: 'M' }, { tacka: 'N' }, { tacka: 'P' },
          { p: 'BDPN', k: 4, b: 2 }]));

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Poređaj po veličini, od najvećeg do najmanjeg, racionalne brojeve:\n$A = 8 · (−{1|2} + {1|3}) : 4,5$; $B = 8 · (−{1|2}) + {1|3} : 4,5$;\n$C = 8 · (−{1|2} + {1|3} : 4,5)$; $D = (8 · (−{1|2}) + {1|3}) : 4,5$.',
      ['$A > D > C > B$', '$A > C > D > B$', '$D > A > C > B$', '$B > C > D > A$'],
      [
        'Isti brojevi, ali različite zagrade – zato se redosled računanja razlikuje. Imaj na umu: $4,5 = {9|2}$, pa je deljenje sa $4,5$ isto što i množenje sa ${2|9}$.',
        '$A$: prvo zagrada $−{1|2} + {1|3} = −{3|6} + {2|6} = −{1|6}$; zatim $8 · (−{1|6}) = −{4|3}$; i na kraju $−{4|3} · {2|9} = −{8|27}$.',
        '$B$: množenje i deljenje pre sabiranja: $8 · (−{1|2}) = −4$ i ${1|3} : 4,5 = {1|3} · {2|9} = {2|27}$, pa je $B = −4 + {2|27} = −{108|27} + {2|27} = −{106|27}$.',
        '$C$: u zagradi prvo deljenje ${1|3} : 4,5 = {2|27}$, pa $−{1|2} + {2|27} = −{27|54} + {4|54} = −{23|54}$; zatim $C = 8 · (−{23|54}) = −{92|27}$.',
        '$D$: u zagradi $−4 + {1|3} = −{11|3}$, pa $D = −{11|3} · {2|9} = −{22|27}$.',
        K('Svi brojevi su negativni sa istim imeniocem $27$: $A = −{8|27}$, $D = −{22|27}$, $C = −{92|27}$, $B = −{106|27}$. Kod negativnih brojeva veći je onaj čija je apsolutna vrednost manja, pa je $A > D > C > B$.', [], C.brojevna(-4, 0, [[-0.296, 'A', 1], [-0.815, 'D', 2], [-3.407, 'C', 3], [-3.926, 'B', 5]], { podela: 1 })),
      ]);
    Z(6, 2, 1,
      'Spoljašnji ugao kod temena $A$ trougla $ABC$ meri $132°$, a mere unutrašnjih uglova kod temena $B$ i $C$ se razlikuju za $12°$. Koje su mere unutrašnjih uglova trougla?',
      ['$48°$, $72°$ i $60°$', '$48°$, $66°$ i $66°$', '$42°$, $75°$ i $63°$', '$48°$, $84°$ i $48°$'],
      [
        'Unutrašnji i spoljašnji ugao kod istog temena su uporedni, pa je $α = 180° − 132° = 48°$.',
        K('Spoljašnji ugao kod $A$ jednak je zbiru dva unutrašnja nesusedna ugla: $β + γ = 132°$. (Isto dobijamo i iz $β + γ = 180° − α = 132°$.)', [], G({ A: [0, 0, 270], B: [6, 0, -45], C: [4.41, 4.9, 90], X: [-3, 0, 270] }, [{ p: 'ABC' }, { d: 'AX', isp: 1 }, { u: 'CAX', o: '132°', b: 1 }, { u: 'BAC', o: 'α' }, { u: 'ABC'.split('').reverse().join(''), o: 'β' }, { u: 'BCA'.split('').reverse().join(''), o: 'γ' }])),
        'Znamo i razliku: $β − γ = 12°$. Saberimo ove dve jednakosti: $2β = 132° + 12° = 144°$, pa je $β = 72°$.',
        'Tada je $γ = 132° − 72° = 60°$. Provera: $48° + 72° + 60° = 180°$ ✓, a $72° − 60° = 12°$ ✓.',
        'Uglovi su $48°$, $72°$ i $60°$ (uglovi kod $B$ i $C$ mogu biti i obrnutim redom – uslov kaže samo da se razlikuju za $12°$).',
      ]);
    Z(6, 3, 2,
      'Na koliko načina se broj $2026$ može prikazati kao proizvod tri cela broja (ne obavezno različita)? Redosled činilaca nije bitan.',
      ['$7$', '$4$', '$3$', '$8$'],
      [
        'Rastavimo $2026$ na proste činioce: $2026 = 2 · 1013$, a $1013$ je prost broj (nije deljiv ni sa jednim prostim brojem do $31$, a $32² = 1024 > 1013$).',
        'Pošto $2026$ ima samo dva prosta činioca, u proizvodu tri cela broja bar jedan činilac mora biti $1$ ili $−1$.',
        'Bez znakova (samo apsolutne vrednosti) postoje dva rastavljanja: $1 · 1 · 2026$ i $1 · 2 · 1013$.',
        'Sada dodajemo znakove – proizvod je pozitivan, pa je broj negativnih činilaca $0$ ili $2$. Za $1 · 1 · 2026$: $1 · 1 · 2026$, $(−1) · (−1) · 2026$, $1 · (−1) · (−2026)$ – to su $3$ načina (dva minusa na dve jedinice ili na jedinicu i $2026$).',
        'Za $1 · 2 · 1013$ (tri različita broja) minus može biti na bilo koja dva ili ni na jednom: $1 · 2 · 1013$, $(−1) · (−2) · 1013$, $1 · (−2) · (−1013)$, $(−1) · 2 · (−1013)$ – to su $4$ načina.',
        K('Ukupno $3 + 4 = 7$ načina.', [], C.tabela([['1 · 1 · 2026'], ['(−1) · (−1) · 2026'], ['1 · (−1) · (−2026)'], ['1 · 2 · 1013'], ['(−1) · (−2) · 1013'], ['1 · (−2) · (−1013)'], ['(−1) · 2 · (−1013)']], { sirina: 6, visina: 0.9, zaglavlje: false, istakni: [[0, 0], [1, 0], [2, 0]] })),
      ]);
    Z(6, 4, 2,
      'U trouglu $ABC$ ($BC > AC$) konstruisane su prave koje sadrže tačke $A$ i $B$ i normalne su na simetralu ugla $ACB$. One seku prave $BC$ i $AC$, redom, u tačkama $S$ i $T$. Ako je $AT = 4 cm$ i $CS = 6 cm$, kolika je dužina stranice $BC$?',
      ['$10 cm$', '$8 cm$', '$12 cm$', '$14 cm$'],
      [
        'Neka prave $AS$ i $BT$ seku simetralu ugla $C$ u tačkama $M$ i $N$. Posmatrajmo trouglove $AMC$ i $SMC$.',
        K('Oba su pravougla (pravi ugao kod $M$), imaju zajedničku stranicu $CM$ i jednake uglove kod $C$ ($∡ACM = ∡SCM$ – simetrala polovi ugao). Po stavu USU su podudarni, pa je $CA = CS = 6 cm$.', ['t1']),
        K('Na isti način su podudarni i trouglovi $TNC$ i $BNC$ (pravi ugao kod $N$, zajednička stranica $CN$, jednaki uglovi kod $C$), pa je $CT = CB$.', ['t2']),
        'Tačka $T$ leži na pravoj $AC$ iza tačke $A$ (jer je $CT = CB > CA$), pa je $CT = CA + AT = 6 cm + 4 cm = 10 cm$.',
        'Zato je $BC = CT = 10 cm$.',
        'Lepa ideja: prava normalna na simetralu ugla „odseca“ od krakova jednake duži – simetrala ugla je osa simetrije ugla.',
      ],
      G({ C: [0, 0, 225], A: [6, 0, -60], B: [7.07, 7.07, 45], S: [4.24, 4.24, 120], T: [10, 0, -45], M: [5.12, 2.12, -20], N: [8.54, 3.54, 0], q: [11, 4.56] },
        [{ d: 'CA', o: '6 cm', k: 2 }, { d: 'CB' }, { d: 'AB' }, { d: 'Cq', isp: 1 }, { d: 'AT', b: 1, o: '4 cm' },
          { d: 'AS', b: 3 }, { d: 'BT', b: 3 }, { pu: 'AMC', k: 1 }, { pu: 'BNC', k: 1 },
          { p: 'ACS', id: 't1', k: 2, b: 2 }, { p: 'TCB', id: 't2', k: 3, b: 4 }]));
    Z(6, 5, 2,
      'Odredi sve cele brojeve $x$ za koje je broj ${−17|\\|x + 1\\| − 2}$ takođe ceo. Koliko ima takvih brojeva?',
      ['$6$', '$8$', '$4$', '$3$'],
      [
        'Razlomak je ceo broj samo ako je imenilac $|x + 1| − 2$ delilac broja $−17$. Delioci broja $17$ (prost broj) su $1, −1, 17, −17$.',
        'Dakle $|x + 1| − 2 ∈ \\{1, −1, 17, −17\\}$, odnosno $|x + 1| ∈ \\{3, 1, 19, −15\\}$.',
        '$|x + 1| = 3$: $x + 1 = 3$ ili $x + 1 = −3$, pa je $x = 2$ ili $x = −4$.',
        '$|x + 1| = 1$: $x + 1 = ±1$, pa je $x = 0$ ili $x = −2$.',
        '$|x + 1| = 19$: $x + 1 = ±19$, pa je $x = 18$ ili $x = −20$.',
        '$|x + 1| = −15$ nema rešenja, jer apsolutna vrednost nikad nije negativna.',
        K('Rešenja su $x ∈ \\{−20, −4, −2, 0, 2, 18\\}$ – ukupno $6$ celih brojeva.', [], C.brojevna(-22, 20, [[-20, '−20', 1], [-4, '−4', 1], [-2, '−2', 2], [0, '0', 2], [2, '2', 1], [18, '18', 1]], { podela: 2, svaki: 5 })),
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Mera oštrog ugla jednakokrakog trapeza je $60°$, a krak je dužine $6 cm$. Kolika je površina trapeza ako je kraća osnovica jednaka kraku?',
      ['$27√3 cm²$', '$54√3 cm²$', '$36√3 cm²$', '$27 cm²$'],
      [
        K('Neka je $a$ duža osnovica, $b = 6 cm$ kraća, $c = 6 cm$ krak i $h$ visina. Iz temena $D$ spustimo visinu na osnovicu $AB$; dobijamo pravougli trougao $AED$ sa uglom $60°$ kod $A$.', ['tr']),
        'U pravouglom trouglu sa uglovima $30°$ i $60°$ kateta naspram ugla od $30°$ je polovina hipotenuze: $AE = {c|2} = 3 cm$. Druga kateta je visina jednakostraničnog trougla stranice $c$: $h = {c√3|2} = 3√3 cm$.',
        'Kod jednakokrakog trapeza je $AE = {a − b|2}$, pa je $a = b + 2 · AE = 6 + 6 = 12 cm$.',
        'Površina trapeza: $P = {a + b|2} · h = {12 + 6|2} · 3√3 = 9 · 3√3 = 27√3 cm²$.',
        'Zanimljivo: takav trapez se sastoji od tri jednakostranična trougla stranice $6 cm$, pa je i $P = 3 · {6²√3|4} = 27√3 cm²$.',
      ],
      G({ A: [0, 0, 225], B: [12, 0, -45], C: [9, 5.2, 45], D: [3, 5.2, 135], E: [3, 0, -90] },
        [{ p: 'ABCD' }, { d: 'DA', o: '6' }, { d: 'DC', o: '6' }, { u: 'BAD', o: '60°' },
          { d: 'DE', isp: 1, o: 'h', k: 1 }, { pu: 'AED', k: 1 }, { p: 'AED', id: 'tr', b: 2, k: 1 }]));
    Z(7, 2, 2,
      'Odredi realan broj $x$ koji je rešenje jednačine ${2025^{2025} + 2025^{2026}|2026^{2026}} = x^{2025}$.',
      ['${2025|2026}$', '${2026|2025}$', '${1|2026}$', '$2025$'],
      [
        'Izvucimo zajednički činilac u brojiocu: $2025^{2026} = 2025 · 2025^{2025}$, pa je $2025^{2025} + 2025^{2026} = 2025^{2025} · (1 + 2025) = 2026 · 2025^{2025}$.',
        'Skratimo sa imeniocem: $2026^{2026} = 2026 · 2026^{2025}$, pa je leva strana ${2026 · 2025^{2025}|2026 · 2026^{2025}} = {2025^{2025}|2026^{2025}} = ({2025|2026})^{2025}$.',
        'Jednačina glasi $x^{2025} = ({2025|2026})^{2025}$. Izložilac $2025$ je neparan, pa stepenovanje čuva znak i poredak: različiti brojevi imaju različite neparne stepene.',
        'Zato je jedino rešenje $x = {2025|2026}$.',
      ]);
    Z(7, 3, 2,
      'Koliko trocifrenih prirodnih brojeva ima sledeću osobinu: kada se od tog broja oduzme trocifren prirodan broj koji ima iste cifre kao i polazni, ali u obrnutom redosledu, dobija se broj $495$?',
      ['$40$', '$4$', '$50$', '$36$'],
      [
        'Neka su cifre broja redom $a$, $b$, $c$; tada broj vredi $100a + 10b + c$. Broj sa obrnutim ciframa vredi $100c + 10b + a$, i on mora biti trocifren, pa je $c ≠ 0$.',
        'Razlika: $(100a + 10b + c) − (100c + 10b + a) = 99a − 99c = 99(a − c)$. Cifra desetica $b$ se potpuno poništava!',
        'Uslov $99(a − c) = 495$ daje $a − c = 5$.',
        K('Mogući parovi $(a, c)$ sa $c ≥ 1$: $(6, 1), (7, 2), (8, 3), (9, 4)$ – to su $4$ para.', [], C.tabela([['a', 6, 7, 8, 9], ['c', 1, 2, 3, 4], ['b', '0–9', '0–9', '0–9', '0–9'], ['~brojeva', 10, 10, 10, 10]], { sirina: [2.2, 1.4] })),
        'Cifra $b$ može biti bilo koja od $10$ cifara ($0$–$9$), pa traženih brojeva ima $4 · 10 = 40$. Na primer $601 − 106 = 495$ ✓, $752 − 257 = 495$ ✓ i $994 − 499 = 495$ ✓.',
      ]);
    Z(7, 4, 3,
      'U trouglu $ABC$ za dužine stranica važi $a : b : c = 7 : 15 : 20$. Ako je površina trougla $378 cm²$, kolika je dužina najkraće visine tog trougla?',
      ['$12,6 cm$', '$16,8 cm$', '$36 cm$', '$18 cm$'],
      [
        'Zapišimo stranice preko jednog broja $k > 0$: $a = 7k$, $b = 15k$, $c = 20k$.',
        'Površinu računamo Heronovim obrascem $P = √{s(s − a)(s − b)(s − c)}$, gde je $s$ poluobim: $s = {7k + 15k + 20k|2} = 21k$.',
        '$s − a = 14k$, $s − b = 6k$, $s − c = k$, pa je $P = √{21k · 14k · 6k · k} = √{1764k^{4}} = 42k²$.',
        'Iz $42k² = 378$ dobijamo $k² = 9$, tj. $k = 3 cm$. Stranice su $a = 21 cm$, $b = 45 cm$, $c = 60 cm$.',
        K('Pošto je $P = {c · h_{c}|2}$ za svaku stranicu, najkraća visina odgovara najdužoj stranici $c$.', [], G({ A: [0, 0, 225], B: [60, 0, -45], C: [43.2, 12.6, 90], D: [43.2, 0, -90] }, [{ p: 'ABC' }, { d: 'AB', o: '60' }, { d: 'BC', o: '21' }, { d: 'CA', o: '45' }, { d: 'CD', isp: 1, b: 1, o: 'h_c' }, { pu: 'CDB' }])),
        '$h_{c} = {2P|c} = {2 · 378|60} = 12,6 cm$.',
        'Bez Heronovog obrasca: visina na $c$ deli $c$ na delove $x$ i $20k − x$; iz $(7k)² − x² = (15k)² − (20k − x)²$ dobijamo $x = 1,4k$ i $h_{c} = 4,2k$, pa opet $P = 42k²$.',
      ]);
    Z(7, 5, 2,
      'U jednoj posudi nalazi se porcija smutija u kojoj je $75%$ mase jogurt, a ostalo je voće. Kuvar iz te porcije najpre odvoji $40$ grama smutija i skloni ga sa strane, a zatim u ono što je ostalo u posudi doda $40$ grama čistog voća. Posle toga u novoj mešavini voće čini $40%$ ukupne mase. Kolika je bila masa porcije smutija pre ovih izmena?',
      ['$200 g$', '$160 g$', '$240 g$', '$120 g$'],
      [
        'Neka je masa smutija $x$ grama. U njemu je ${3|4}x$ jogurta i ${1|4}x$ voća.',
        'Odvojenih $40 g$ ima isti sastav, pa u posudi ostaje ${1|4}(x − 40) = {1|4}x − 10$ grama voća.',
        'Posle dodavanja $40 g$ voća masa je opet $x$ grama ($x − 40 + 40$), a voća ima ${1|4}x − 10 + 40 = {1|4}x + 30$ grama.',
        K('Voće čini $40% = {2|5}$ mase: ${2|5}x = {1|4}x + 30$. Pomnožimo sa $20$: $8x = 5x + 600$, pa je $x = 200$.', [], G({}, [...C.traka(4, 1, { x: 0, y: 3, w: 10, h: 1.2, b: 2 }), { tx: '~pre: voće ¼ (25%)', at: [5, 4.8] }, ...C.traka(5, 2, { x: 0, y: 0, w: 10, h: 1.2, b: 2 }), { tx: '~posle: voće ⅖ (40%)', at: [5, 1.8] }])),
        'Provera: od $200 g$ (voća $50 g$) odvojimo $40 g$ – ostaje $160 g$ sa $40 g$ voća; dodamo $40 g$ voća – $200 g$ sa $80 g$ voća, a $80 : 200 = 40%$ ✓.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 1,
      'Odredi sve realne brojeve $x$ koji zadovoljavaju obe nejednačine: ${x|6} − {1 − x|4} ≤ {1 + x|3} + {x − 2|24}$ i ${x − 3|3} − {x + 1|6} − {1 − 3x|2} > 5$.',
      ['$4 < x ≤ 12$', '$4 ≤ x < 12$', '$x ≤ 12$', '$x > 4$'],
      [
        'Prvu nejednačinu pomnožimo sa $24$ (pozitivan broj – znak se ne menja): $4x − 6(1 − x) ≤ 8(1 + x) + (x − 2)$.',
        'Sredimo: $4x − 6 + 6x ≤ 8 + 8x + x − 2$, tj. $10x − 6 ≤ 9x + 6$, pa je $x ≤ 12$.',
        'Drugu pomnožimo sa $6$: $2(x − 3) − (x + 1) − 3(1 − 3x) > 30$. Pazi na minus ispred zagrada!',
        'Sredimo: $2x − 6 − x − 1 − 3 + 9x > 30$, tj. $10x − 10 > 30$, pa je $x > 4$.',
        K('Oba uslova zajedno: $4 < x ≤ 12$, tj. $x ∈ (4, 12]$. Broj $12$ jeste rešenje (prva je „≤“), a $4$ nije (druga je stroga).', [], C.interval(0, 15, { a: 4, b: 12, ukljA: false, ukljB: true })),
      ]);
    Z(8, 2, 1,
      'U pravouglom trouglu čija je površina $96 cm²$, hipotenuza i duža kateta su u odnosu $5 : 4$. Kolika je površina njemu sličnog trougla čija je hipotenuza dužine $15 cm$?',
      ['$54 cm²$', '$72 cm²$', '$48 cm²$', '$60 cm²$'],
      [
        'Neka je hipotenuza $c = 5k$, a duža kateta $b = 4k$. Po Pitagorinoj teoremi druga kateta je $a = √{(5k)² − (4k)²} = √{9k²} = 3k$.',
        'Površina: $P = {a · b|2} = {3k · 4k|2} = 6k² = 96$, pa je $k² = 16$ i $k = 4 cm$. Stranice su $12 cm$, $16 cm$ i $20 cm$.',
        'Sličan trougao ima hipotenuzu $15 cm$, pa je koeficijent sličnosti ${15|20} = {3|4}$. Njegove katete su $12 · {3|4} = 9 cm$ i $16 · {3|4} = 12 cm$.',
        K('Površina: $P_{1} = {9 · 12|2} = 54 cm²$.', [], G({ A: [0, 0, 225], B: [16, 0, -45], C: [0, 12, 135], P: [20, 0, 225], Q: [32, 0, -45], R: [20, 9, 135] }, [{ p: 'ABC', b: 0 }, { d: 'AB', o: '16' }, { d: 'AC', o: '12' }, { d: 'BC', o: '20' }, { pu: 'BAC' }, { p: 'PQR', b: 1 }, { d: 'PQ', o: '12' }, { d: 'PR', o: '9' }, { d: 'QR', o: '15' }, { pu: 'QPR' }], { bezImena: ['A', 'B', 'C', 'P', 'Q', 'R'] })),
        'Kraće: površine sličnih likova odnose se kao kvadrat koeficijenta sličnosti: $P_{1} = ({3|4})² · 96 = {9|16} · 96 = 54 cm²$.',
      ]);
    Z(8, 3, 2,
      'Duža dijagonala pravilne šestostrane prizme, dužine $10√2 cm$, nagnuta je prema ravni osnove pod uglom od $45°$. Kolika je površina te prizme?',
      ['$75(4 + √3) cm²$', '$75(2 + √3) cm²$', '$300 + 25√3 cm²$', '$150(2 + √3) cm²$'],
      [
        'Neka je osnovna ivica $a$, a visina $H$. Duža dijagonala prizme je npr. $AD\'$, gde je $AD$ duža dijagonala šestougla u osnovi.',
        K('Tačka $D$ je normalna projekcija tačke $D\'$ na ravan osnove, pa je ugao između $AD\'$ i osnove upravo $∡D\'AD = 45°$. Trougao $ADD\'$ je pravougli (prav ugao kod $D$) i jednakokraki.', [], C.prizma(6, 5, 10, [{ d: 'AD₁', b: 1 }, { d: 'AD', b: 2 }, { d: 'DD₁', b: 3 }, { u: 'DAD₁', o: '45°' }])),
        'Hipotenuza je $AD\' = 10√2 cm$, pa su katete $AD = DD\' = 10 cm$ (kod jednakokrakog pravouglog trougla hipotenuza je kateta puta $√2$).',
        'Duža dijagonala pravilnog šestougla je $2a$ (šestougao se sastoji od $6$ jednakostraničnih trouglova), pa je $2a = 10$, $a = 5 cm$, a visina $H = DD\' = 10 cm$.',
        'Baza: $B = 6 · {a²√3|4} = {3a²√3|2} = {75√3|2} cm²$. Omotač: $M = 6aH = 6 · 5 · 10 = 300 cm²$.',
        'Površina: $P = 2B + M = 75√3 + 300 = 75(4 + √3) cm²$.',
      ]);
    D(8, 4, 2,
      'Neka je $x = 202620252024$. Dokaži da je broj $x² − 2x − 3$ deljiv sa $15$, ali nije deljiv sa $2025$.',
      [
        'Prvo rastavimo: $x² − 2x − 3 = x² − 3x + x − 3 = x(x − 3) + (x − 3) = (x − 3)(x + 1)$.',
        'Zbir cifara broja $x = 202620252024$ je $2+0+2+6+2+0+2+5+2+0+2+4 = 27$, pa je $x$ deljiv sa $3$, pa čak i sa $9$. Zato je i $x − 3$ deljiv sa $3$, a time i $N$.',
        'Broj $x$ se završava cifrom $4$, pa se $x + 1$ završava cifrom $5$ – deljiv je sa $5$. Zato je i $N$ deljiv sa $5$.',
        'Deljiv sa $3$ i sa $5$ (uzajamno prosti) ⇒ $N$ je deljiv sa $15$.',
        'Za $2025 = 81 · 25$: dovoljno je pokazati da $N$ nije deljiv sa $9$. Kako je $x$ deljiv sa $9$, i $x(x − 2)$ je deljiv sa $9$, pa $N = x(x − 2) − 3$ daje ostatak $9 − 3 = 6$ pri deljenju sa $9$.',
        'Broj koji nije deljiv sa $9$ ne može biti deljiv ni sa $2025$ (jer je $2025$ deljiv sa $9$). Dakle: deljiv sa $15$, a nije sa $2025$.',
      ]);
    Z(8, 5, 3,
      'Ana, Beba i Ceca igraju igru sa žetonima: svaka u svom potezu stavlja žetone na sto, koji je na početku prazan. Ana uvek dodaje po $2$ žetona, Beba po $3$, a Ceca po $5$ žetona. Kada su sve tri odigrale ukupno $102$ poteza, na stolu je bilo $305$ žetona. Na koliko načina ovo može da se uradi, ako je svaka odigrala bar jedan potez? Redosled poteza nije bitan.',
      ['$33$', '$34$', '$32$', '$17$'],
      [
        'Neka su $a, b, c$ brojevi Aninih, Bebinih i Cecinih poteza. Tada je $a + b + c = 102$ i $2a + 3b + 5c = 305$.',
        'Udvostručimo prvu jednačinu: $2a + 2b + 2c = 204$ i oduzmimo je od druge: $b + 3c = 305 − 204 = 101$.',
        K('Za svako $c = k$ dobijamo $b = 101 − 3k$. Da bi $b ≥ 1$ i $c ≥ 1$: $k ≥ 1$ i $3k ≤ 100$, tj. $k ∈ \\{1, 2, …, 33\\}$ – to su $33$ mogućnosti.', [], C.tabela([['k = c', 1, 2, 3, '…', 32, 33], ['b = 101 − 3k', 98, 95, 92, '…', 5, 2], ['a = 2k + 1', 3, 5, 7, '…', 65, 67]], { sirina: [3.2, 1.1] })),
        'Proverimo i Anu: $a = 102 − b − c = 102 − (101 − 3k) − k = 2k + 1 ≥ 3$, pa je $a$ uvek prirodan broj – nijedna mogućnost ne otpada.',
        'Dakle ima $33$ načina. Na primer $k = 1$: $a = 3, b = 98, c = 1$ ($6 + 294 + 5 = 305$ ✓), a $k = 33$: $a = 67, b = 2, c = 33$ ($134 + 6 + 165 = 305$ ✓).',
      ]);
  },
};
