// Okružno takmičenje iz matematike učenika osnovnih škola, 25. 3. 2018. (DMS)
// https://dms.rs/wp-content/uploads/2018/03/Postavke-okr18.pdf (samo postavke – rešenja su naša, provereni računom)
module.exports = {
  godina: '2017/18', nivo: 'okruzno', datum: '25. 3. 2018.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Koja se cifra nalazi na $2018$. mestu posle zapete u decimalnom zapisu broja ${18|7}$?',
      ['$7$', '$5$', '$1$', '$4$'],
      [
        'Podelimo: $18 : 7 = 2,571428571428…$ – posle zapete se ponavlja grupa od $6$ cifara: $571428$.',
        '$2018 = 6 · 336 + 2$: posle $336$ celih grupa dolazi $2$. cifra grupe.',
        K('Druga cifra grupe $571428$ je $7$.', [], C.tabela([['~mesto u grupi', 1, 2, 3, 4, 5, 6], ['~cifra', 5, 7, 1, 4, 2, 8]], { istakni: [[0, 2], [1, 2]] })),
      ]);
    Z(5, 2, 2,
      'Na koliko načina je moguće ispred i iza broja $2018$ dopisati po jednu cifru tako da se dobije šestocifreni broj deljiv sa $36$?',
      ['$3$', '$2$', '$4$', '$5$'],
      [
        'Broj $a2018b$ treba da bude deljiv sa $4$ i sa $9$ ($36 = 4 · 9$), a $a ≠ 0$.',
        'Sa $4$: poslednje dve cifre $8b$ deljive sa $4$: $80, 84, 88$, tj. $b ∈ \\{0, 4, 8\\}$.',
        'Sa $9$: zbir $a + 2 + 0 + 1 + 8 + b = a + b + 11$ deljiv sa $9$: $a + b = 7$ ili $16$.',
        K('$b = 0$: $a = 7$; $b = 4$: $a = 3$; $b = 8$: $a = 8$. Brojevi $720180$, $320184$, $820188$ – tri načina.', [], C.tabela([['b', 0, 4, 8], ['a', 7, 3, 8], ['~broj', 720180, 320184, 820188]])),
      ]);
    Z(5, 3, 2,
      'Zbir dužina neke dve stranice pravougaonika je $14 cm$, a zbir dužina neke tri njegove stranice je $19 cm$. Koliki može biti obim pravougaonika?',
      ['$24$, $26$ ili $28 cm$', 'samo $28 cm$', '$24$ ili $28 cm$', '$26$ ili $33 cm$'],
      [
        'Neka su stranice $a$ i $b$. „Dve stranice“: $a + b$, $2a$ ili $2b$. „Tri stranice“: $2a + b$ ili $a + 2b$.',
        '$a + b = 14$ i $2a + b = 19$: $a = 5$, $b = 9$, obim $28$.',
        '$2a = 14$ ($a = 7$) i $2a + b = 19$: $b = 5$, obim $24$; $2a = 14$ i $a + 2b = 19$: $b = 6$, obim $26$.',
        K('Ostali slučajevi su simetrični. Mogući obimi: $24$, $26$ ili $28 cm$.', [], C.tabela([['~dve', 'a + b = 14', '2a = 14', '2a = 14'], ['~tri', '2a + b = 19', '2a + b = 19', 'a + 2b = 19'], ['a, b', '5, 9', '7, 5', '7, 6'], ['~obim', 28, 24, 26]])),
      ]);
    Z(5, 4, 2,
      'Na stolu je deset papira, na svakom po jedan prirodan broj; zbir svih je $20 182 019$. Mogu li se papiri podeliti u dve grupe tako da je u svakoj grupi najveći broj jednak zbiru ostalih brojeva u toj grupi?',
      ['Ne mogu', 'Mogu, uvek', 'Mogu samo ako su svi brojevi jednaki', 'Mogu, ako je u svakoj grupi po pet papira'],
      [
        'Ako je u grupi najveći broj $m$ jednak zbiru ostalih, onda je zbir cele grupe $m + m = 2m$ – paran broj.',
        'Tada bi zbir obe grupe bio zbir dva parna broja – paran.',
        'Ali $20 182 019$ je neparan. Zato podela nije moguća.',
      ]);
    Z(5, 5, 3,
      'Dat je broj $123456789101112…5960$ (redom zapisani brojevi od $1$ do $60$). Koji je najveći, a koji najmanji broj koji se dobija brisanjem $100$ cifara?',
      ['najveći $99999785960$, najmanji $10000012340$', 'najveći $99999785960$, najmanji $10000123450$', 'najveći $99999859860$, najmanji $10000012340$', 'najveći $99999785960$, najmanji $00000123450$'],
      [
        'Cifara ima $9 + 51 · 2 = 111$; posle brisanja ostaje $11$ cifara.',
        'Najveći: biramo cifre redom, svaki put najveću moguću, ali tako da posle nje ostane dovoljno cifara. Prve devetke dolaze iz $9, 19, 29, 39, 49$; zatim iz $50…59$ uzimamo $7$ i $8$ (posle $8$ moraju ostati baš $59, 60$), pa $5, 9, 6, 0$: $99999785960$.',
        'Najmanji: prva cifra ne sme biti $0$ – najmanja je $1$ (sa početka). Zatim što više nula: nule iz $10, 20, 30, 40, 50$, pa cifre $1, 2, 3, 4$ iz $51, 52, 53, 54$ i na kraju $0$ iz $60$.',
        K('Najmanji: $10000012340$.', [], C.tabela([['~najveći', '9', '9', '9', '9', '9', '7', '8', '5', '9', '6', '0'], ['~najmanji', '1', '0', '0', '0', '0', '0', '1', '2', '3', '4', '0']], { zaglavlje: false })),
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Miloš je napisao $100$ brojeva. Prvi je $2$, drugi $3$, a svaki (osim prvog i poslednjeg) jednak je zbiru njemu prethodnog i njemu sledećeg broja. Koliki je zbir svih $100$ brojeva?',
      ['$4$', '$0$', '$5$', '$100$'],
      [
        'Iz $a_{n} = a_{n − 1} + a_{n + 1}$ sledi $a_{n + 1} = a_{n} − a_{n − 1}$: svaki sledeći je razlika prethodna dva.',
        K('Niz: $2, 3, 1, −2, −3, −1, 2, 3, …$ – ponavlja se na svakih $6$, a zbir jedne šestorke je $0$.', [], C.tabela([['n', 1, 2, 3, 4, 5, 6, 7, 8], ['~broj', 2, 3, 1, '−2', '−3', '−1', 2, 3]])),
        '$100 = 6 · 16 + 4$: $16$ šestorki daje $0$, a ostaju $2 + 3 + 1 + (−2) = 4$.',
      ]);
    Z(6, 2, 2,
      'Sabiraju se uzastopni prirodni brojevi deljivi sa $3$: $3 + 6 + 9 + 12 + …$ Koliko takvih brojeva treba sabrati da bi zbir bio $100$ puta veći od najvećeg sabirka?',
      ['$199$', '$200$', '$100$', '$198$'],
      [
        'Zbir prvih $n$: $3(1 + 2 + … + n) = {3n(n + 1)|2}$, a najveći sabirak je $3n$.',
        '${3n(n + 1)|2} = 100 · 3n$ ⇒ ${n + 1|2} = 100$ ⇒ $n = 199$.',
        'Provera: zbir $3 · {199 · 200|2} = 59 700 = 100 · 597$ ✓.',
      ]);
    Z(6, 3, 3,
      'Treba konstruisati jednakokraki trougao sa uglom pri vrhu od $105°$, ako je visina koja odgovara kraku $4 cm$. Sa čim počinje konstrukcija?',
      ['Pravouglim trouglom sa katetom $4 cm$ (visina) i naspramnim uglom od $37° 30\'$ (ugao na osnovici)', 'Jednakostraničnim trouglom stranice $4 cm$', 'Krakom dužine $4 cm$ i uglom od $105°$', 'Pravouglim trouglom sa hipotenuzom $4 cm$ i uglom od $75°$'],
      [
        'Uglovi na osnovici: ${180° − 105°|2} = 37° 30\'$. Visina iz temena $B$ na krak $AC$ pada van trougla (ugao kod $A$ je tup).',
        K('Pravougli trougao $BHC$ ($H$ – podnožje visine) ima katetu $BH = 4 cm$ i ugao kod $C$ od $37° 30\'$ (to je i ugao trougla). Taj trougao konstruišemo prvi; ugao $37° 30\'$ je polovina od $75° = 45° + 30°$ (konstruktivno).', ['bhc']),
        'Teme $A$ je na pravoj $CH$, u preseku sa simetralom duži $BC$ (jer je $AB = AC$).',
        'Provera: spoljašnji ugao kod $A$ (između $AB$ i produžetka) je $75°$, pa u trouglu $ABH$ važi $∡BAH = 75°$ ✓.',
      ],
      G({ A: [0, 0, -60], C: [4.141, 0, -45], B: [-1.072, 4, 90], H: [-1.072, 0, -90] },
        [{ p: 'ABC' }, { d: 'HA', isp: 1 }, { d: 'BH', o: '4', b: 1 }, { pu: 'BHA'.split('').reverse().join('') }, { p: 'BHC', id: 'bhc', b: 2, k: 2 }]));
    Z(6, 4, 2,
      'Na hipotenuzi $AB$ pravouglog trougla $ABC$ (prav ugao kod $C$) je tačka $M$ takva da je $BM = BC$, a na kateti $CA$ tačka $N$ takva da je $CN = CP$, gde je $P$ podnožje visine iz $C$. Koliki je ugao $CNM$?',
      ['$90°$', '$45°$', '$60°$', 'zavisi od trougla'],
      [
        'Neka je $∡B = β$. Trougao $BCM$ je jednakokrak: $∡BCM = ∡BMC = 90° − {β|2}$.',
        'U pravouglom trouglu $BCP$: $∡BCP = 90° − β$. Zato je $∡PCM = (90° − {β|2}) − (90° − β) = {β|2}$, a $∡MCN = 90° − ∡BCM = {β|2}$.',
        K('Trouglovi $CPM$ i $CNM$: zajednička $CM$, $CP = CN$, $∡PCM = ∡NCM$ – podudarni (SUS).', ['t1', 't2']),
        'Zato je $∡CNM = ∡CPM = 90°$.',
      ],
      G({ C: [0, 0, 225], B: [3, 0, -45], A: [0, 4, 135], P: [1.92, 1.44, 45], M: [1.2, 2.4, 45], N: [0, 2.4, 180] },
        [{ p: 'ABC' }, { pu: 'BCA' }, { d: 'CP', isp: 1 }, { d: 'CM' }, { d: 'MN', b: 1 }, { p: 'CPM', id: 't1', b: 2, k: 3 }, { p: 'CNM', id: 't2', b: 4, k: 3 }]));
    Z(6, 5, 2,
      'Na koliko načina se broj $2018$ može predstaviti kao proizvod tačno tri različita cela broja (redosled nije bitan)?',
      ['$5$', '$4$', '$7$', '$3$'],
      [
        '$2018 = 2 · 1009$ ($1009$ je prost). Tri različita cela broja – po apsolutnoj vrednosti $1, 2, 1009$ ili $1, 1, 2018$ (tada su jedinice $1$ i $−1$).',
        K('Proizvod je pozitivan, pa je broj negativnih činilaca paran.', [], C.tabela([['1 · 2 · 1009'], ['(−1) · (−2) · 1009'], ['(−1) · 2 · (−1009)'], ['1 · (−2) · (−1009)'], ['1 · (−1) · (−2018)']], { zaglavlje: false })),
        'Za $1, 2, 1009$: $4$ načina (nijedan ili dva minusa); za $1, 1, 2018$ mora biti $1, −1$ i $−2018$: $1$ način. Ukupno $5$.',
      ]);

    // ───────── VII razred ─────────
    D(7, 1, 3,
      'Neka je $H$ ortocentar i $O$ centar opisane kružnice oštrouglog trougla $ABC$, a $M$ druga presečna tačka prave $AO$ sa opisanom kružnicom. Dokaži da trouglovi $BCM$ i $BCH$ imaju jednake površine.',
      [
        '$AM$ je prečnik, pa su uglovi $ABM$ i $ACM$ pravi (nad prečnikom).',
        'Zato je $MC ⊥ AC$, a i $BH ⊥ AC$ (visina): $BH ∥ MC$. Slično $MB ⊥ AB$ i $CH ⊥ AB$: $CH ∥ MB$.',
        K('Četvorougao $BHCM$ ima naspramne stranice paralelne – paralelogram.', ['p']),
        'Dijagonala $BC$ deli paralelogram na dva podudarna trougla, $BCH$ i $BCM$ – površine su jednake.',
      ],
      G({ A: [0, 0, 225], B: [6, 0, -45], C: [2, 4.5, 90], O: [3, 1.361, 200], H: [2, 1.778, 180], M: [6, 2.722, 0] },
        [{ p: 'ABC' }, { kr: 'O', r: 3.294, b: 4, isp: 1 }, { d: 'AM', isp: 1 }, { tacka: 'H' }, { p: 'BHCM', id: 'p', b: 1, k: 3 }, { d: 'BC', b: 2, k: 4 }]));
    Z(7, 2, 1,
      'Da li je broj $√{3 − 2√2} + √{5 − 2√6} + √{7 − 2√{12}}$ racionalan?',
      ['Da, jednak je $1$', 'Ne, iracionalan je', 'Da, jednak je $2$', 'Da, jednak je $0$'],
      [
        'Svaki koren je razlika korena: $3 − 2√2 = (√2 − 1)²$, $5 − 2√6 = (√3 − √2)²$, $7 − 2√{12} = (2 − √3)²$.',
        K('Zbir: $(√2 − 1) + (√3 − √2) + (2 − √3) = 1$ – racionalan.', [], C.tabela([['~koren', '√(3−2√2)', '√(5−2√6)', '√(7−2√12)'], ['~vrednost', '√2 − 1', '√3 − √2', '2 − √3']])),
      ]);
    Z(7, 3, 2,
      'Broj $2³ · 4^{5} · 6^{7}$: a) koliko ima delilaca; b) koliko među njima ima onih koji su kub prirodnog broja?',
      ['a) $168$, b) $21$', 'a) $96$, b) $12$', 'a) $168$, b) $14$', 'a) $160$, b) $21$'],
      [
        'Rastavimo: $4^{5} = 2^{10}$, $6^{7} = 2^{7} · 3^{7}$, pa je broj $2^{20} · 3^{7}$.',
        'a) Delioci $2^{i} · 3^{j}$, $0 ≤ i ≤ 20$, $0 ≤ j ≤ 7$: $21 · 8 = 168$.',
        K('b) Kub: $i$ i $j$ deljivi sa $3$: $i ∈ \\{0, 3, …, 18\\}$ ($7$), $j ∈ \\{0, 3, 6\\}$ ($3$): $21$.', [], C.tabela([['', '~izbori', '~za kub'], ['i (2)', '0–20: 21', '0,3,…,18: 7'], ['j (3)', '0–7: 8', '0,3,6: 3']])),
      ]);
    Z(7, 4, 3,
      'Dat je konveksan četvorougao sa normalnim dijagonalama. Da li obavezno postoji konveksan četvorougao sa bar dva prava ugla čije su stranice (u nekom poretku) jednake stranicama datog?',
      ['Da, uvek', 'Ne, nikad', 'Samo ako je dati četvorougao romb', 'Samo ako je deltoid'],
      [
        'Neka dijagonale seku u $S$ i dele se na delove $p, q$ i $r, s$. Stranice su hipotenuze pravouglih trouglova: $a² = p² + r²$, $b² = r² + q²$, $c² = q² + s²$, $d² = s² + p²$.',
        'Odatle $a² + c² = b² + d²$ (zbirovi kvadrata naspramnih stranica su jednaki).',
        K('Uzmimo pravougli trougao sa katetama $a, c$ i hipotenuzom $√{a² + c²}$ i drugi sa katetama $b, d$ i istom hipotenuzom. Spojimo ih po hipotenuzi (sa raznih strana) – nastaje konveksan četvorougao sa stranicama $a, c, b, d$ i dva prava ugla.', [], G({ P: [0, 0, 225], Q: [5, 0, -45], R: [1.8, 2.4, 90], T: [3.2, -2.4, -90] }, [{ p: 'PRQT', b: 1 }, { d: 'PQ', isp: 1 }, { pu: 'PRQ' }, { pu: 'QTP' }], { bezImena: ['P', 'Q', 'R', 'T'] })),
        'Dakle, takav četvorougao uvek postoji.',
      ]);
    Z(7, 5, 2,
      'Poslednja cifra broja $n² + 2n$ je $4$ ($n$ prirodan). Kolika je cifra desetica tog broja?',
      ['$2$', '$4$', '$7$', '$1$'],
      [
        'Dodajmo $1$: $n² + 2n + 1 = (n + 1)²$ se završava cifrom $5$.',
        'Kvadrat koji se završava sa $5$ ima osnovu koja se završava sa $5$, a svaki takav kvadrat se završava sa $25$ ($15² = 225$, $25² = 625$…).',
        K('Zato se $n² + 2n = (n + 1)² − 1$ završava sa $24$: cifra desetica je $2$.', [], C.tabela([['n', 4, 14, 24], ['n² + 2n', 24, 224, 624]])),
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 1,
      'Na tabli je nekoliko pozitivnih realnih brojeva; svaki je jednak devetini zbira ostalih. Koliko je brojeva napisano?',
      ['$10$', '$9$', '$8$', '$11$'],
      [
        'Neka je zbir svih $S$. Za svaki broj $x$: $x = {S − x|9}$, tj. $9x = S − x$, pa je $x = {S|10}$.',
        'Svi brojevi su jednaki ${S|10}$, a njihov zbir je $S$ – zato ih ima $10$.',
      ]);
    Z(8, 2, 2,
      'Za koje cele brojeve $n$ je broj ${2n + 1|3n − 1}$ takođe ceo?',
      ['$n = 0$ i $n = 2$', 'samo $n = 2$', '$n = 0$, $n = 2$ i $n = −1$', 'ni za jedan'],
      [
        'Ako $3n − 1$ deli $2n + 1$, deli i $3(2n + 1) − 2(3n − 1) = 5$. Dakle $3n − 1 ∈ \\{±1, ±5\\}$.',
        K('$3n − 1 = 1, −1, 5, −5$ daje $n = {2|3}, 0, 2, −{4|3}$ – celi su $n = 0$ i $n = 2$.', [], C.tabela([['3n − 1', 1, '−1', 5, '−5'], ['n', '2/3', 0, 2, '−4/3'], ['~vrednost', '—', '−1', 1, '—']])),
        'Provera: $n = 0$: ${1|−1} = −1$ ✓; $n = 2$: ${5|5} = 1$ ✓.',
      ]);
    Z(8, 3, 3,
      'Pravilna četvorostrana prizma i pravilna četvorostrana piramida imaju jednake osnove, površine i zapremine. Površina osnove je $100 cm²$. Kolike su visine ta dva tela?',
      ['prizma $4 cm$, piramida $12 cm$', 'prizma $12 cm$, piramida $4 cm$', 'prizma $3 cm$, piramida $9 cm$', 'prizma $5 cm$, piramida $15 cm$'],
      [
        'Ivica osnove $a = 10 cm$. Zapremine: $100 H_{1} = {100 H_{2}|3}$, pa je $H_{2} = 3H_{1}$.',
        'Površina prizme: $200 + 4 · 10 · H_{1} = 200 + 40H_{1}$. Piramide: $100 + 4 · {10 · h_{s}|2}$, gde je bočna visina $h_{s} = √{H_{2}² + 5²}$.',
        '$200 + 40H_{1} = 100 + 20√{9H_{1}² + 25}$ ⇒ $5 + 2H_{1} = √{9H_{1}² + 25}$ ⇒ $25 + 20H_{1} + 4H_{1}² = 9H_{1}² + 25$ ⇒ $5H_{1}² = 20H_{1}$, $H_{1} = 4$.',
        K('Prizma $4 cm$, piramida $12 cm$. Provera: $P = 360$ za oba ($h_{s} = 13$), $V = 400$ za oba ✓.', [], C.piramida(4, 2, 2.4)),
      ]);
    Z(8, 4, 3,
      'Prava kroz središte $M$ kraka $AD$ trapeza $ABCD$ deli trapez na dva dela jednakih površina i seče drugi krak u $N$. Koliki je odnos $BN : NC$ ako su osnovice $AB = a$ i $CD = b$?',
      ['$b : a$', '$a : b$', '$1 : 1$', '$(a + b) : b$'],
      [
        'Neka je visina $h$ i $BN = t · BC$. Tačka $M$ je na visini ${h|2}$, a $N$ na visini $th$.',
        'Površina dela $ABNM$ (npr. preko koordinata ili razbijanjem na trouglove) je ${h|4}(a + t(a + b))$.',
        'Mora biti polovina trapeza: ${h|4}(a + t(a + b)) = {(a + b)h|4}$, pa je $t(a + b) = b$, $t = {b|a + b}$.',
        K('$BN : NC = {b|a + b} : {a|a + b} = b : a$.', [], G({ A: [0, 0, 225], B: [8, 0, -45], C: [5, 4, 45], D: [1, 4, 135], M: [0.5, 2, 180], N: [7, 1.333, 0] }, [{ p: 'ABCD' }, { d: 'MN', b: 1 }, { p: 'ABNM', b: 2 }, { d: 'AB', o: 'a' }, { d: 'DC', o: 'b' }])),
      ]);
    Z(8, 5, 2,
      'Da li se za neki prirodan broj $n$ zbir $1 + 2 + … + n$ može završavati sa $2018$?',
      ['Ne može', 'Može, za $n = 2018$', 'Može, za beskonačno mnogo $n$', 'Može samo za paran $n$'],
      [
        'Zbir je ${n(n + 1)|2}$. Ako se završava sa $2018$, onda se $n(n + 1)$ (dvostruki zbir) završava sa $4036$, pa i sa $36$.',
        'Proizvod dva uzastopna broja se završava cifrom $6$ samo ako se $n$ završava sa $2$ ili $7$ ($2 · 3 = 6$, $7 · 8 = 56$).',
        K('Proverom: $n(n + 1)$ tada se završava sa $06$ ili $56$ – nikad sa $36$.', [], C.tabela([['n', 2, 7, 12, 17, 22, 27, 32], ['n(n + 1)', 6, 56, 156, 306, 506, 756, 1056]])),
        'Zato zbir ne može da se završava sa $2018$.',
      ]);
  },
};
