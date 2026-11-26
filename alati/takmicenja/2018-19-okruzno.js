// Okružno takmičenje iz matematike učenika osnovnih škola, 23. 3. 2019. (DMS)
// https://dms.rs/wp-content/uploads/2019/03/Konacne-postavke-okruzno.pdf (samo postavke – rešenja su naša, provereni računom)
module.exports = {
  godina: '2018/19', nivo: 'okruzno', datum: '23. 3. 2019.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 2,
      'Napiši jedan za drugim, u rastućem poretku, bez razmaka, prvih $13$ prostih brojeva. U dobijenom broju precrtaj deset cifara tako da ostane najveći mogući paran broj. Koji je to broj?',
      ['$779232931374$', '$779329313741$', '$977232931374$', '$779232931372$'],
      [
        K('Prvih $13$ prostih brojeva: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41$ – zapis ima $22$ cifre. Posle brisanja $10$ ostaje $12$ cifara.', [], C.tabela([['2', '3', '5', '7', '1', '1', '1', '3', '1', '7', '1', '9', '2', '3', '2', '9', '3', '1', '3', '7', '4', '1']], { zaglavlje: false, istakni: [[0, 3], [0, 9], [0, 11], [0, 12], [0, 13], [0, 14], [0, 15], [0, 16], [0, 17], [0, 18], [0, 19], [0, 20]] })),
        'Broj mora biti paran: poslednja ostavljena cifra mora biti parna. Poslednja parna cifra u nizu je $4$ (iz $41$), pa iza nje brišemo $1$ i završavamo sa $4$.',
        'Sad biramo cifre redom „pohlepno“: svaka sledeća cifra treba da bude što veća, ali tako da posle nje ostane dovoljno cifara. Prva cifra: među prvim ciframa (do mesta gde još ostaje $11$ cifara) najveća je $7$ (iz $7$). Druga: najveća dostupna je opet $7$ (iz $17$). Treća: $9$ (iz $19$).',
        'Ostalo je tačno onoliko cifara koliko treba: $2, 3, 2, 9, 3, 1, 3, 7, 4$. Rezultat: $779232931374$.',
      ]);
    Z(5, 2, 1,
      'Uglovi $AOB$ i $BOC$ su susedni. Simetrala ugla $AOB$ gradi sa polupravom $OC$ ugao od $75°$, a simetrala ugla $BOC$ gradi sa polupravom $OA$ prav ugao. Koliki je ugao $AOC$?',
      ['$110°$', '$100°$', '$120°$', '$105°$'],
      [
        'Neka je $∡AOB = 2x$ i $∡BOC = 2y$. Simetrala ugla $AOB$ je na $x$ od $OB$, pa sa $OC$ gradi ugao $x + 2y = 75°$.',
        'Simetrala ugla $BOC$ sa $OA$ gradi $2x + y = 90°$.',
        K('Saberemo: $3(x + y) = 165°$, $x + y = 55°$, pa je $∡AOC = 2x + 2y = 110°$ (uz to $x = 35°$, $y = 20°$).', [], G({ O: [0, 0, 270], A: [6, 0], B: [4.6, 3.86], C: [2.05, 5.64] }, [{ d: 'OA' }, { d: 'OB' }, { d: 'OC' }, { u: 'AOB', o: '70°', b: 1 }, { u: 'BOC', o: '40°', b: 2 }], { bezImena: ['O'] })),
      ]);
    Z(5, 3, 2,
      'Kada se $12$ rastavi na proste činioce, $12 = 2 · 2 · 3$, zbir činilaca je $2 + 2 + 3 = 7$. Koliko ima prirodnih brojeva kod kojih je ovako određen zbir prostih činilaca jednak $12$?',
      ['$7$', '$6$', '$5$', '$8$'],
      [
        'Tražimo sve načine da $12$ zapišemo kao zbir prostih brojeva (redosled nije bitan); svaki takav zbir daje tačno jedan broj (proizvod sabiraka).',
        K('Rastavljanja broja $12$ na proste sabirke:', [], C.tabela([['~sabirci', '5 + 7', '2 + 3 + 7', '2 + 5 + 5', '2 + 2 + 3 + 5', '3 + 3 + 3 + 3', '2 + 2 + 2 + 3 + 3', '2 · 6 puta'], ['~broj', 35, 42, 50, 60, 81, 72, 64]])),
        'Proveru vršimo po najvećem sabirku: $11$ ne ide ($1$ nije prost), $7$: $7 + 5$, $7 + 3 + 2$; $5$: $5 + 5 + 2$, $5 + 3 + 2 + 2$; samo $3$ i $2$: $3 + 3 + 3 + 3$, $3 + 3 + 2 + 2 + 2$, $2 · 6$.',
        'Ukupno $7$ brojeva: $35, 42, 50, 60, 64, 72, 81$.',
      ]);
    Z(5, 4, 2,
      'Na letnjoj školi je $100$ učenika; svako ima bar jedan od talenata (pevanje, ples, gluma), neki i više, ali niko sva tri. Tačno $42$ nemaju talenat za pevanje, $65$ za ples, a $29$ za glumu. Koliko učenika ima više talenata?',
      ['$64$', '$36$', '$32$', '$44$'],
      [
        'Talentovanih: pevača $100 − 42 = 58$, plesača $100 − 65 = 35$, glumaca $100 − 29 = 71$. Zbir: $164$.',
        'U tom zbiru učenik sa jednim talentom je brojan jednom, a sa dva talenta dvaput (tri nema).',
        K('Ako je $j$ učenika sa jednim, a $d$ sa dva talenta: $j + d = 100$ i $j + 2d = 164$, pa je $d = 64$.', [], C.stubici([['~pevanje', 58], ['~ples', 35], ['~gluma', 71]], { korakY: 20, maxY: 80, vrednosti: true })),
      ]);
    Z(5, 5, 2,
      'Pravougaonik je pomoću dve duži (jedne vodoravne i jedne uspravne) podeljen na četiri manja pravougaonika. Zbir obima svih pravougaonika koji se mogu uočiti na slici je $768 cm$. Koliki je obim najvećeg pravougaonika?',
      ['$128 cm$', '$192 cm$', '$85,3 cm$', '$96 cm$'],
      [
        K('a) Uspravnih linija ima $3$ (dve stranice i jedna duž) – biramo levu i desnu na $3$ načina; isto vodoravno: ukupno $3 · 3 = 9$ pravougaonika.', [], G({}, [C.pr(0, 0, 3, 2, 0, { prazno: 1 }), C.pr(3, 0, 5, 2, 0, { prazno: 1 }), C.pr(0, 2, 3, 2, 0, { prazno: 1 }), C.pr(3, 2, 5, 2, 0, { prazno: 1 }), { tx: 'a₁', at: [1.5, -0.6] }, { tx: 'a₂', at: [5.5, -0.6] }, { tx: 'b₁', at: [-0.6, 1] }, { tx: 'b₂', at: [-0.6, 3] }])),
        'Neka je ceo pravougaonik $a × b$, $a = a_{1} + a_{2}$, $b = b_{1} + b_{2}$. Širina pravougaonika je $a_{1}$, $a_{2}$ ili $a$ – svaka sa po $3$ visine; zbir svih širina je $3(a_{1} + a_{2} + a) = 6a$, a visina $6b$.',
        'Zbir obima: $2(6a + 6b) = 12(a + b) = 768$, pa je $a + b = 64$.',
        'Obim najvećeg: $2(a + b) = 128 cm$.',
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Proizvod četiri uzastopna cela broja je petocifreni broj čije su prve četiri cifre $9302$. Koji su to brojevi?',
      ['$16, 17, 18, 19$ ili $−19, −18, −17, −16$', 'samo $16, 17, 18, 19$', '$15, 16, 17, 18$', '$17, 18, 19, 20$'],
      [
        'Proizvod je između $93 020$ i $93 029$. Četiri uzastopna broja su približno jednaka, pa je svaki blizu broja čiji je četvrti stepen oko $93 000$ – to je oko $17,5$ (jer $17² = 289$, $289² ≈ 83 500$, a $18^{4} = 104 976$).',
        K('$16 · 17 · 18 · 19 = 93 024$ ✓ (a $15 · 16 · 17 · 18 = 73 440$, $17 · 18 · 19 · 20 = 116 280$).', [], C.tabela([['~brojevi', '15–18', '16–19', '17–20'], ['~proizvod', 73440, 93024, 116280]], { istakni: [[1, 2]] })),
        'Celi brojevi mogu biti i negativni: proizvod četiri negativna broja je pozitivan, pa i $(−19)(−18)(−17)(−16) = 93 024$.',
        'Rešenja: $16, 17, 18, 19$ ili $−19, −18, −17, −16$.',
      ]);
    Z(6, 2, 1,
      'Racionalni brojevi ${1|2}, x, y, {1909|2018}$ poređani su od najmanjeg do najvećeg, a razlike svaka dva susedna su jednake. Kolika je njihova aritmetička sredina?',
      ['${1459|2018}$', '${1909|4036}$', '${1|2}$', '${2918|2018}$'],
      [
        'Brojevi čine niz sa jednakim razmacima, pa su simetrično raspoređeni oko sredine: $x$ i $y$ su jednako udaljeni od sredine kao i krajnji.',
        'Zato je aritmetička sredina sva četiri jednaka sredini prvog i poslednjeg: ${1|2}({1|2} + {1909|2018})$.',
        K('${1|2} = {1009|2018}$, pa je sredina ${1009 + 1909|2 · 2018} = {2918|4036} = {1459|2018}$.', [], C.brojevna(0.4, 1, [[0.5, '1/2', 1], [0.6487, 'x', 2], [0.7973, 'y', 2], [0.946, '1909/2018', 1], [0.7230, 'sredina', 3]], { podela: 0.1, svaki: 1 })),
      ]);
    Z(6, 3, 3,
      'Treba konstruisati trougao $ABC$ sa poluprečnikom opisane kružnice $R = 5 cm$, stranicom $AB = 7 cm$ i visinom $h_{c} = 4 cm$. Gde se nalazi teme $C$?',
      ['U preseku opisane kružnice i prave paralelne sa $AB$ na rastojanju $4 cm$', 'Na simetrali duži $AB$, na rastojanju $5 cm$ od $AB$', 'U centru opisane kružnice', 'Na kružnici sa centrom $A$ poluprečnika $4 cm$'],
      [
        'Analiza: temena $A$ i $B$ su na opisanoj kružnici poluprečnika $5$. Konstruišemo duž $AB = 7$, a centar $O$ je presek kružnica poluprečnika $5$ oko $A$ i $B$ (na simetrali duži $AB$).',
        '$C$ je na opisanoj kružnici, a i na rastojanju $h_{c} = 4$ od prave $AB$ – na jednoj od dve prave paralelne sa $AB$.',
        K('Rastojanje centra od $AB$ je $√{25 − 12,25} ≈ 3,57$. Prava na istoj strani (rastojanje od centra $0,43 < 5$) seče kružnicu u dve tačke – dva simetrična (podudarna) trougla; prava sa druge strane je predaleko ($7,57 > 5$).', [], G({ A: [-3.5, 0, 225], B: [3.5, 0, -45], O: [0, 3.571, 180], C: [4.982, 4, 45] },
          [{ kr: 'O', r: 5, b: 4 }, { p: 'ABC', b: 1 }, { lin: [[-6, 4], [6, 4]], isp: 1, b: 2 }, { tacka: 'O' }, { lin: [[4.982, 4], [4.982, 0]], isp: 1 }])),
        'Zadatak ima rešenje, jedinstveno do na podudarnost.',
      ]);
    Z(6, 4, 3,
      'U pravouglom trouglu $ABC$ (prav ugao kod $C$) je $BC < CA$. Tačke $D$, $E$, $F$ na hipotenuzi su podnožje visine, presek simetrale pravog ugla i središte hipotenuze. Ako je jedan od uglova $∡BCD$, $∡DCE$, $∡ECF$, $∡FCA$ dvaput veći od nekog drugog, koliki su uglovi trougla?',
      ['$30°, 60°, 90°$ ili $15°, 75°, 90°$', 'samo $30°, 60°, 90°$', '$45°, 45°, 90°$', '$22° 30\', 67° 30\', 90°$ ili $30°, 60°, 90°$'],
      [
        'Neka je $∡A = α < 45°$ (jer je $BC < CA$). Iz pravouglog trougla $BCD$: $∡BCD = 90° − ∡B = α$.',
        '$∡BCE = 45°$, pa je $∡DCE = 45° − α$. Težišna duž na hipotenuzu je polovina hipotenuze: $FC = FA$, pa je $∡FCA = α$, i $∡ECF = 45° − α$.',
        K('Četiri ugla su $α$, $45° − α$, $45° − α$, $α$. Dvaput veći: $α = 2(45° − α)$ daje $α = 30°$; ili $45° − α = 2α$ daje $α = 15°$.', [], G({ C: [0, 0, 225], A: [6, 0, -45], B: [0, 3.464, 135], D: [1.5, 2.598, 60], E: [2.196, 2.196, 45], F: [3, 1.732, 30] },
          [{ p: 'ABC' }, { pu: 'ACB'.split('').reverse().join('') }, { d: 'CD', b: 1 }, { d: 'CE', b: 2 }, { d: 'CF', b: 3 }])),
        'Trouglovi: $30°, 60°, 90°$ ili $15°, 75°, 90°$.',
      ]);
    Z(6, 5, 3,
      'Aca je napisao $60$ brojeva (ne obavezno različitih). Bora je za svaka dva izračunao proizvod; tačno $600$ proizvoda je negativno. Koliko je nula moglo biti među Acinim brojevima?',
      ['$5$, $10$ ili $11$', 'samo $10$', '$0$ ili $10$', '$5$ ili $10$'],
      [
        'Proizvod je negativan tačno kad je jedan broj negativan, a drugi pozitivan. Ako ima $n$ negativnih i $p$ pozitivnih, negativnih proizvoda je $n · p = 600$.',
        'Nula: $z = 60 − n − p$, pa mora $n + p ≤ 60$.',
        K('Rastavljanja $600 = n · p$ sa $n + p ≤ 60$: $20 · 30$ ($z = 10$), $15 · 40$ ($z = 5$), $24 · 25$ ($z = 11$). Ostala ($12 · 50$, $10 · 60$…) imaju zbir veći od $60$.', [], C.tabela([['n · p', '20 · 30', '15 · 40', '24 · 25', '12 · 50'], ['n + p', 50, 55, 49, 62], ['~nula', 10, 5, 11, '—']])),
        'Nula je moglo biti $5$, $10$ ili $11$.',
      ]);

    // ───────── VII razred ─────────
    D(7, 1, 2,
      'Za cele brojeve $x, y, z, t$ važi $9x − 42y = 21z − 49t$. Dokaži da je proizvod $xt$ deljiv sa $21$.',
      [
        'Prebacimo: $9x + 49t = 21z + 42y = 21(z + 2y)$ – desna strana je deljiva sa $3$ i sa $7$.',
        'Deljivost sa $7$: $49t$ je deljivo sa $7$, pa i $9x$; kako su $9$ i $7$ uzajamno prosti, $7 | x$.',
        'Deljivost sa $3$: $9x$ je deljivo sa $3$, pa i $49t$; kako su $49$ i $3$ uzajamno prosti, $3 | t$.',
        'Zato je $21 = 3 · 7$ delilac proizvoda $xt$.',
      ]);
    Z(7, 2, 2,
      'Koliko delilaca broja $4^{2019} · 19^{4}$ je jednako četvrtom stepenu nekog prirodnog broja?',
      ['$2020$', '$1010$', '$2019$', '$4040$'],
      [
        '$4^{2019} · 19^{4} = 2^{4038} · 19^{4}$. Delioci su oblika $2^{i} · 19^{j}$ sa $0 ≤ i ≤ 4038$, $0 ≤ j ≤ 4$.',
        'Delilac je četvrti stepen tačno kad su $i$ i $j$ deljivi sa $4$.',
        K('$i ∈ \\{0, 4, …, 4036\\}$ – $1010$ mogućnosti; $j ∈ \\{0, 4\\}$ – $2$ mogućnosti.', [], C.tabela([['~izložilac', 'i (od 2)', 'j (od 19)'], ['~mogućnosti', '0, 4, …, 4036', '0, 4'], ['~broj', 1010, 2]])),
        'Ukupno $1010 · 2 = 2020$.',
      ]);
    Z(7, 3, 1,
      'Realni brojevi $x ≠ y$ zadovoljavaju $y(x² + 2019) = x(y² + 2019)$. Koliko je $xy$?',
      ['$2019$', '$−2019$', '$1$', '$0$'],
      [
        'Raspakujemo: $x²y + 2019y = xy² + 2019x$, tj. $x²y − xy² − 2019x + 2019y = 0$.',
        'Grupišemo: $xy(x − y) − 2019(x − y) = (x − y)(xy − 2019) = 0$.',
        'Kako je $x ≠ y$, mora $xy = 2019$.',
      ]);
    Z(7, 4, 3,
      'Stranica $AB$ konveksnog četvorougla $ABCD$ je dva puta duža od naspramne stranice $CD$. Dijagonala $BD$ normalna je na $AD$, a dijagonala $AC$ normalna na $BC$. Koliki je (oštar) ugao između dijagonala?',
      ['$60°$', '$45°$', '$30°$', '$90°$'],
      [
        '$∡ADB = 90°$ i $∡ACB = 90°$ – po Talesovoj teoremi $C$ i $D$ leže na kružnici nad prečnikom $AB$, sa centrom $O$ u središtu $AB$.',
        'Poluprečnik je $r = {AB|2} = CD$. Trougao $OCD$ ima sve stranice $r$ – jednakostraničan, pa je $∡COD = 60°$.',
        K('Neka se dijagonale seku u $P$. U trouglu $APD$ (prav ugao kod $D$): $∡DAC = {1|2}∡DOC = 30°$ (periferijski nad tetivom $CD$), pa je $∡APD = 90° − 30° = 60°$.', [], G({ A: [-4, 0, 180], B: [4, 0, 0], C: [1.035, 3.864, 60], D: [-2.828, 2.828, 135], O: [0, 0, -90], P: [-1.195, 2.152, 250] },
          [{ kr: 'O', r: 4, b: 4, isp: 1 }, { p: 'ABCD' }, { d: 'AC', b: 1 }, { d: 'BD', b: 1 }, { pu: 'BDA'.split('').reverse().join('') }, { pu: 'ACB'.split('').reverse().join('') }, { p: 'OCD', b: 2 }, { u: 'DPA'.split('').reverse().join(''), o: '?', b: 3 }])),
        'Oštar ugao između dijagonala je $60°$.',
      ]);
    Z(7, 5, 3,
      'Tačke su raspoređene u mrežu $6 × 6$, sa rastojanjem $1$ između susednih (vodoravno i uspravno). Koliko ima duži dužine $5$ sa krajevima u datim tačkama?',
      ['$36$', '$12$', '$28$', '$44$'],
      [
        'Duž dužine $5$ ima „pomeraj“ $(Δx, Δy)$ sa $Δx² + Δy² = 25$: $(5, 0)$, $(0, 5)$, $(3, 4)$ ili $(4, 3)$ (do na znak).',
        'Vodoravne $(5, 0)$: u svakom od $6$ redova jedna – $6$. Uspravnih – $6$.',
        K('Kose $(3, 4)$: početak može biti u $3 × 2 = 6$ položaja (po $x$ od $0$ do $2$, po $y$ od $0$ do $1$), a duž može biti nagnuta „gore“ ili „dole“ – $12$. Isto za $(4, 3)$ – $12$.', [], G({}, [...Array.from({ length: 36 }, (_, i) => ({ tx: '●', at: [i % 6, Math.floor(i / 6) - 0.1], b: 4 })), { lin: [[0, 0], [3, 4]], b: 1, debljina: 3 }, { lin: [[1, 5], [5, 2]], b: 2, debljina: 3 }, { lin: [[0, 5], [5, 5]], b: 3, debljina: 3 }])),
        'Ukupno $6 + 6 + 12 + 12 = 36$.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Izračunaj $A = √{3 − 2√2} + √{5 − 2√6} + √{7 − 2√{12}} + √{9 − 2√{20}} + … + √{31 − 2√{240}}$.',
      ['$3$', '$4$', '$√{15}$', '$15$'],
      [
        'Ključni obrazac: $2k + 1 − 2√{k(k + 1)} = (√{k + 1} − √k)²$, jer je $(√{k + 1})² + (√k)² = 2k + 1$.',
        K('Zato je $√{2k + 1 − 2√{k(k + 1)}} = √{k + 1} − √k$ (pozitivno). Sabirci: $√2 − 1$, $√3 − √2$, $√4 − √3$, …', [], C.tabela([['k', 1, 2, 3, 4, '…', 15], ['2k + 1', 3, 5, 7, 9, '…', 31], ['k(k + 1)', 2, 6, 12, 20, '…', 240], ['~sabirak', '√2 − 1', '√3 − √2', '2 − √3', '√5 − 2', '…', '4 − √15']])),
        'Poslednji: $240 = 15 · 16$, pa je $k = 15$. Zbir je teleskopski: $√{16} − √1 = 4 − 1 = 3$.',
      ]);
    Z(8, 2, 2,
      'Kolika je zapremina pravilne šestostrane piramide čiji je najveći dijagonalni presek jednakokrako-pravougli trougao sa katetom $8 cm$?',
      ['$64√6 cm³$', '$128√6 cm³$', '$64√3 cm³$', '$32√6 cm³$'],
      [
        'Najveći dijagonalni presek sadrži dve naspramne bočne ivice i najdužu dijagonalu osnove $AD = 2a$. Katete su bočne ivice $8$, hipotenuza $AD = 8√2$, pa je $a = 4√2 cm$.',
        'Visina je visina tog trougla na hipotenuzu: $H = {AD|2} = 4√2 cm$.',
        K('Osnova: $B = 6 · {a²√3|4} = 6 · {32√3|4} = 48√3$. Zapremina: $V = {1|3} · 48√3 · 4√2 = 64√6 cm³$.', [], C.piramida(6, 2.83, 2.83, [{ p: 'ADS', b: 1 }])),
        'Površina (drugi deo): bočna strana ima visinu $√{64 − 8} = 2√{14}$, površinu $8√7$; $P = 48√3 + 48√7 = 48(√3 + √7) cm²$.',
      ]);
    Z(8, 3, 2,
      'Koliko ima celobrojnih rešenja jednačine $20|x| + 19|y| = 2019$?',
      ['$24$', '$6$', '$12$', '$20$'],
      [
        'Prvo nenegativna rešenja $a = |x|$, $b = |y|$: $20a + 19b = 2019$. Gledamo ostatke pri deljenju sa $19$: $20a$ daje isti ostatak kao $a$, a $2019 = 19 · 106 + 5$.',
        'Zato $a$ daje ostatak $5$: $a ∈ \\{5, 24, 43, 62, 81, 100\\}$ (uz $20a ≤ 2019$).',
        K('Odgovarajući $b$: $101, 81, 61, 41, 21, 1$ – svi pozitivni.', [], C.tabela([['|x|', 5, 24, 43, 62, 81, 100], ['|y|', 101, 81, 61, 41, 21, 1]])),
        'Svaki par sa $a, b > 0$ daje $4$ rešenja (znakovi $x$ i $y$): $6 · 4 = 24$.',
      ]);
    D(8, 4, 2,
      'Trougao $ABC$ je jednakokrako-pravougli sa pravim uglom kod $C$, a $D$ i $E$ su tačke na kateti $AC$ takve da je $CD = {1|3}AC$ i $CE = {1|2}AC$. Dokaži da je $∡CBD = ∡ABE$.',
      [
        'Neka je $AC = BC = 6$: $CD = 2$, $CE = 3$.',
        '$∡CBD$: u pravouglom trouglu $BCD$ odnos kateta je ${CD|BC} = {2|6} = {1|3}$.',
        K('Za $∡ABE$: spustimo normalu iz $E$ na $AB$, podnožje $G$. Trougao $AGE$ je jednakokrako-pravougli (ugao $45°$ kod $A$), pa je $EG = AG = {AE|√2} = {3|√2}$, a $BG = AB − AG = 6√2 − {3|√2} = {9|√2}$.', ['g'], G({ C: [0, 0, 225], A: [6, 0, -45], B: [0, 6, 135], D: [2, 0, -90], E: [3, 0, -90], G: [4.5, 1.5, 45] }, [{ p: 'ABC' }, { pu: 'ACB' }, { d: 'BD', b: 1 }, { d: 'BE', b: 2 }, { d: 'EG', isp: 1, id: 'g' }, { pu: 'EGB' }, { p: 'EGB', b: 2 }, { p: 'DCB', b: 1 }])),
        'Pravougli trouglovi $EGB$ i $DCB$ imaju katete u istom odnosu: ${EG|BG} = {3|9} = {1|3}$ i ${CD|CB} = {2|6} = {1|3}$ – slični su.',
        'Zato su odgovarajući uglovi jednaki: $∡GBE = ∡CBD$, tj. $∡ABE = ∡CBD$ (oba oko $18,4°$).',
      ]);
    Z(8, 5, 3,
      'Na fudbalskom prvenstvu je $18$ ekipa; u svakom kolu $9$ utakmica (pobeda $3$ boda, nerešeno po $1$, poraz $0$). Posle $6$ kola nikoje dve ekipe nemaju isti broj bodova. Koliko je bilo nerešenih utakmica?',
      ['$8$', '$9$', '$6$', '$10$'],
      [
        'Odigrano je $6 · 9 = 54$ utakmice. Svaka sa pobednikom donosi $3$ boda, nerešena $2$: ukupno $3 · 54 − d = 162 − d$ bodova ($d$ – broj nerešenih).',
        K('Posle $6$ utakmica ekipa može imati od $0$ do $18$ bodova – ali $17$ je nemoguće (traži $5$ pobeda i $2$ nerešena, tj. $7$ utakmica). Mogućih vrednosti ima tačno $18$: $0, 1, …, 16, 18$.', [], C.tabela([['~bodovi', 16, 17, 18], ['~kako', '5 pob. + 1 ner.', '~nemoguće', '6 pobeda']], { istakni: [[1, 2]] })),
        '$18$ ekipa sa različitim bodovima zauzima baš sve te vrednosti: zbir $0 + 1 + … + 16 + 18 = 136 + 18 = 154$.',
        '$162 − d = 154$, pa je $d = 8$ nerešenih utakmica.',
      ]);
  },
};
