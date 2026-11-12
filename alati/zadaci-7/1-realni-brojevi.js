// Tema 1: Realni brojevi (lekcije 1.1–1.9)
module.exports = ({ L, Z, K, G, r, proveri, kocke, prava }) => {
  // kvadrat stranice a sa mrežom n×n polja (kvadrat broja kao površina)
  const kvMreza = (n, oznaka, x = {}) => {
    const e = [{ mreza: [0, n, 0, n], brojevi: 0 }, { p: 'ABCD', b: 0, o: oznaka }];
    return G({ A: [0, 0], B: [n, 0], C: [n, n], D: [0, n] }, e, { bezImena: ['A', 'B', 'C', 'D'], ...x });
  };
  // jedinični kvadrat podeljen na n×n delova, osenčeno m×m (razlomak na kvadrat)
  const deoKvadrata = (n, m, x = {}) => {
    const e = [];
    for (let i = 1; i < n; i++) e.push({ lin: [[i / n, 0], [i / n, 1]], b: 5, debljina: 1 }, { lin: [[0, i / n], [1, i / n]], b: 5, debljina: 1 });
    e.push({ lin: [[0, 1 - m / n], [m / n, 1 - m / n], [m / n, 1], [0, 1]], zatv: 1, gusto: 1, b: 1, id: 'deo', k: 1 });
    e.push({ lin: [[0, 0], [1, 0], [1, 1], [0, 1]], zatv: 1, prazno: 1, b: 0 });
    e.push({ tx: '1', at: [0.5, -0.09] }, { tx: '1', at: [1.07, 0.5] });
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 240, ...x });
  };
  // brojevna prava sa obeleženim tačkama: tacke = [[x, natpis, boja, k], …]
  const brojevna = (od, doo, tacke, x = {}) => {
    const t = { O: [od, 0] }, e = [{ osa: [od, doo], podela: x.podela, svaki: x.svaki, brojevi: x.brojevi }];
    tacke.forEach(([v, nat, b = 1, k = 0], i) => {
      const ime = 'p' + i;
      t[ime] = [v, 0];
      e.push({ tacka: ime, b, k, id: 't' + i }, { tx: nat, at: [v, (x.visinaNatpisa || 0.09 * (doo - od)) * (i % 2 && x.naizmenicno ? -1.7 : 1)], b, k });
    });
    return G(t, [...e, ...(x.dodatno || [])], { bezImena: ['O'], velicina: x.velicina || 330 });
  };
  // traka podeljena na delove (produžena proporcija): delovi = [2, 3, 5], natpisi = ['a', 'b', 'c']
  const traka = (delovi, natpisi, { vrednost, k = 1 } = {}) => {
    const e = [];
    let y = 0;
    delovi.forEach((d, j) => {
      for (let i = 0; i < d; i++) e.push({ lin: [[i, y], [i + 1, y], [i + 1, y + 0.8], [i, y + 0.8]], zatv: 1, gusto: 1, b: j % 6, id: 'tr' + j });
      e.push({ tx: natpisi[j], at: [-0.6, y + 0.32] });
      if (vrednost) for (let i = 0; i < d; i++) e.push({ tx: String(vrednost), at: [i + 0.5, y + 0.3], k });
      y -= 1.15;
    });
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 300 });
  };

  // ════════════════ 1.1 Kvadrat racionalnog broja ════════════════
  L('Kvadrat racionalnog broja');

  Z(1, 'Koliko je $(−7)²$?',
    ['$49$', '$−49$', '$14$', '$−14$'],
    [K('Kvadrat broja je proizvod tog broja sa samim sobom: $(−7)² = (−7) · (−7)$.'),
     K('Proizvod dva negativna broja je pozitivan: $(−7) · (−7) = 49$.'),
     K('Zato se kaže „kvadrat“: kvadrat stranice $7$ ima $7 · 7 = 49$ jediničnih polja. Kvadrat bilo kog broja različitog od nule je pozitivan.', [], kvMreza(7, '49'))]);

  Z(1, 'Koliko je $(−{2|3})²$?',
    ['${4|9}$', '$−{4|9}$', '${4|6}$', '${2|9}$'],
    [K('Kvadriramo i brojilac i imenilac: $(−{2|3})² = {(−2)²|3²} = {4|9}$.'),
     K('Na slici: jedinični kvadrat podelimo na $3 · 3 = 9$ delova; kvadrat stranice ${2|3}$ zauzima $2 · 2 = 4$ od njih.', ['deo']),
     K('Znak minus nestaje jer je $(−{2|3}) · (−{2|3})$ proizvod dva negativna broja. Česta greška je ${4|6}$ – imenilac se takođe kvadrira!')],
    deoKvadrata(3, 2));

  Z(1, 'Koliko je $0,3²$?',
    ['$0,09$', '$0,9$', '$0,6$', '$0,009$'],
    [K('$0,3² = 0,3 · 0,3$. Množimo kao cele brojeve: $3 · 3 = 9$.'),
     K('Činioci imaju po jednu decimalu, pa proizvod ima dve: $0,09$.'),
     K('Slika: jedinični kvadrat podeljen na $100$ polja, a kvadrat stranice $0,3$ pokriva $3 · 3 = 9$ polja, tj. ${9|100} = 0,09$.', ['deo'])],
    deoKvadrata(10, 3));

  Z(2, 'Koliko je $−3² + (−3)²$?',
    ['$0$', '$18$', '$−18$', '$9$'],
    [K('Pazi na zagrade! U izrazu $−3²$ kvadrira se samo $3$, a minus ostaje ispred: $−3² = −(3 · 3) = −9$.'),
     K('U izrazu $(−3)²$ kvadrira se ceo broj $−3$: $(−3)² = (−3) · (−3) = 9$.'),
     K('$−3² + (−3)² = −9 + 9 = 0$')]);

  Z(2, 'Kolika je površina kvadrata stranice $2,5 cm$?',
    ['$6,25 cm²$', '$4,25 cm²$', '$5 cm²$', '$10 cm²$'],
    [K('$P = a² = 2,5² = 2,5 · 2,5$.'),
     K('Rastavimo stranicu na $2 + 0,5$. Kvadrat se deli na: kvadrat $2 · 2 = 4$, dva pravougaonika $2 · 0,5 = 1$ i mali kvadrat $0,5 · 0,5 = 0,25$.', ['v', 'p1', 'p2', 'm']),
     K('$P = 4 + 1 + 1 + 0,25 = 6,25 cm²$. (Greška $4,25$ nastaje kad se zaborave dva pravougaonika – kao da je $(2 + 0,5)² = 2² + 0,5²$.)')],
    G({ A: [0, 0], B: [2.5, 0], C: [2.5, 2.5], D: [0, 2.5], e: [2, 0], f: [2, 2.5], g: [0, 2], h: [2.5, 2], s: [2, 2] },
      [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '2,5 cm' }, { p: 'Aesg', b: 0, id: 'v', o: '4', k: 2 }, { p: 'eBhs', b: 2, id: 'p1', o: '1', k: 2 }, { p: 'gsfD', b: 2, id: 'p2', o: '1', k: 2 }, { p: 'shCf', b: 1, id: 'm', k: 2 }],
      { bezImena: ['A', 'B', 'C', 'D'] }));

  Z(2, 'Izračunaj: $(−0,2)² · 50 − (−{1|2})² · 8$.',
    ['$0$', '$4$', '$−4$', '$1$'],
    [K('$(−0,2)² = 0,04$, pa je $0,04 · 50 = 2$.'),
     K('$(−{1|2})² = {1|4}$, pa je ${1|4} · 8 = 2$.'),
     K('$2 − 2 = 0$. Oba kvadrata su pozitivna, bez obzira na znak osnove.')]);

  Z(2, 'Stranica kvadrata se poveća $3$ puta. Koliko puta se poveća njegova površina?',
    ['$9$ puta', '$3$ puta', '$6$ puta', '$27$ puta'],
    [K('Ako je stranica bila $a$, sada je $3a$.'),
     K('Nova površina: $(3a)² = 3a · 3a = 9a²$.'),
     K('Na slici: u veliki kvadrat staje tačno $3 · 3 = 9$ malih kvadrata. Površina se poveća $9$ puta.', ['mali'])],
    G({ A: [0, 0], B: [3, 0], C: [3, 3], D: [0, 3], e: [1, 0], f: [1, 1], g: [0, 1] },
      [{ mreza: [0, 3, 0, 3], brojevi: 0 }, { p: 'ABCD', b: 0, prazno: 1 }, { p: 'Aefg', b: 1, gusto: 1, id: 'mali', o: 'a' }, { d: 'AB', o: '3a' }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 220 }));

  Z(3, 'Dati su brojevi $a = 0,5²$, $b = (−0,7)²$ i $c = −0,6²$. Kako su poređani?',
    ['$c < a < b$', '$a < b < c$', '$c < b < a$', '$a < c < b$'],
    [K('$a = 0,5 · 0,5 = 0,25$', ['t0']),
     K('$b = (−0,7) · (−0,7) = 0,49$ – kvadrat negativnog broja je pozitivan.', ['t1']),
     K('$c = −(0,6 · 0,6) = −0,36$ – ovde se kvadrira samo $0,6$, a minus ostaje.', ['t2']),
     K('Na brojevnoj pravoj: $−0,36 < 0,25 < 0,49$, tj. $c < a < b$.')],
    brojevna(-0.5, 0.6, [[0.25, 'a', 1, 1], [0.49, 'b', 2, 2], [-0.36, 'c', 3, 3]], { podela: 0.1, svaki: 5, visinaNatpisa: 0.1 }));

  Z(3, 'Izračunaj $(1{1|2})² − ({1|2})²$.',
    ['$2$', '$1$', '$2{1|4}$', '$1{1|2}$'],
    [K('$(1{1|2})² = ({3|2})² = {9|4}$, a $({1|2})² = {1|4}$.'),
     K('${9|4} − {1|4} = {8|4} = 2$'),
     K('Na slici: iz kvadrata stranice $1{1|2}$ izrežemo kvadrat stranice ${1|2}$. Ostatak su dva pravougaonika: $1 · 1{1|2} = 1{1|2}$ i ${1|2} · 1 = {1|2}$, ukupno $2$.', ['ost1', 'ost2', 'iz'])],
    G({ A: [0, 0], B: [1.5, 0], C: [1.5, 1.5], D: [0, 1.5], e: [1, 1], f: [1.5, 1], g: [1, 1.5], h: [1, 0] },
      [{ p: 'ABCD', prazno: 1 }, { p: 'efCg', b: 1, gusto: 1, id: 'iz', o: '¼' }, { p: 'AhgD', b: 2, id: 'ost1', k: 3 }, { p: 'hBfe', b: 4, id: 'ost2', k: 3 }, { d: 'AB', o: '1½' }, { d: 'fC', o: '½' }],
      { bezImena: ['A', 'B', 'C', 'D'], velicina: 220 }));

  Z(3, 'Oko kvadratne bašte stranice $12 m$ napravljena je staza širine $1 m$ (sa spoljne strane). Kolika je površina staze?',
    ['$52 m²$', '$48 m²$', '$49 m²$', '$26 m²$'],
    [K('Bašta sa stazom je kvadrat stranice $12 + 1 + 1 = 14 m$ – staza je sa obe strane!', ['vel']),
     K('Površina velikog kvadrata: $14² = 196 m²$; površina bašte: $12² = 144 m²$.', ['basta']),
     K('Staza: $196 − 144 = 52 m²$. (Greška $48 m²$ nastaje kad se zaborave četiri ugaona kvadratića $1 m · 1 m$: $4 · 12 = 48$.)', ['vel'])],
    G({ A: [0, 0], B: [14, 0], C: [14, 14], D: [0, 14], E: [1, 1], F: [13, 1], H: [13, 13], I: [1, 13] },
      [{ p: 'ABCD', b: 3, id: 'vel', gusto: 1 }, { p: 'EFHI', b: 2, id: 'basta', o: '~bašta' }, { d: 'EF', o: '12 m' }, { tx: '1 m', at: [7, 0.45] }],
      { bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I'] }));

  // ════════════════ 1.2 Jednačina x² = a ════════════════
  L('Rešavanje jednačine x² = a');

  Z(1, 'Koja su rešenja jednačine $x² = 49$?',
    ['$x = 7$ ili $x = −7$', 'samo $x = 7$', '$x = 24,5$', 'nema rešenja'],
    [K('Tražimo brojeve čiji je kvadrat $49$. Jedan je $7$, jer je $7² = 49$.', ['t0']),
     K('Ali i $(−7)² = 49$! Jednačina $x² = a$ za $a > 0$ ima dva rešenja: $x = √{a}$ i $x = −√{a}$.', ['t1']),
     K('Na brojevnoj pravoj rešenja su simetrična u odnosu na nulu – oba su udaljena $7$ od nule.')],
    brojevna(-8, 8, [[7, '7', 1, 1], [-7, '−7', 2, 2]], { svaki: 7 }));

  Z(1, 'Koliko rešenja ima jednačina $x² = −16$ u skupu realnih brojeva?',
    ['nijedno', 'dva: $4$ i $−4$', 'jedno: $−4$', 'dva: $8$ i $−8$'],
    [K('Kvadrat svakog realnog broja je pozitivan ili nula: $x² ≥ 0$.'),
     K('Na primer, $4² = 16$ i $(−4)² = 16$ – nijedan kvadrat nije negativan.'),
     K('Zato ne postoji realan broj čiji je kvadrat $−16$: jednačina nema rešenja.')]);

  Z(1, 'Rešenja jednačine $x² = {9|25}$ su:',
    ['$x = {3|5}$ ili $x = −{3|5}$', '$x = {3|25}$ ili $x = −{3|25}$', 'samo $x = {3|5}$', '$x = {9|5}$ ili $x = −{9|5}$'],
    [K('$({3|5})² = {9|25}$, a takođe i $(−{3|5})² = {9|25}$.'),
     K('Korenujemo i brojilac i imenilac: $√{{9|25}} = {√{9}|√{25}} = {3|5}$.'),
     K('Rešenja su $x = {3|5}$ i $x = −{3|5}$.')]);

  Z(2, 'Reši jednačinu $4x² − 1 = 0$.',
    ['$x = {1|2}$ ili $x = −{1|2}$', '$x = {1|4}$ ili $x = −{1|4}$', '$x = 2$ ili $x = −2$', 'samo $x = {1|2}$'],
    [K('Prebacimo $1$ na desnu stranu: $4x² = 1$.'),
     K('Podelimo sa $4$: $x² = {1|4}$.'),
     K('$x = {1|2}$ ili $x = −{1|2}$. Provera: $4 · {1|4} − 1 = 0$ ✓')]);

  Z(2, 'Reši jednačinu $(x − 3)² = 16$.',
    ['$x = 7$ ili $x = −1$', '$x = 7$ ili $x = −7$', '$x = 19$ ili $x = −13$', 'samo $x = 7$'],
    [K('Broj $x − 3$ ima kvadrat $16$, pa je $x − 3 = 4$ ili $x − 3 = −4$.'),
     K('Iz $x − 3 = 4$ sledi $x = 7$; iz $x − 3 = −4$ sledi $x = −1$.', ['t0', 't1']),
     K('Na brojevnoj pravoj: oba rešenja su udaljena $4$ od broja $3$.')],
    brojevna(-2, 8, [[3, '3', 3], [7, '7', 1, 2], [-1, '−1', 2, 2]], { dodatno: [] }));

  Z(2, 'Površina kvadratnog stolnjaka je $1,21 m²$. Kolika je njegova stranica?',
    ['$1,1 m$', '$0,11 m$', '$1,21 m$', '$0,605 m$'],
    [K('$a² = 1,21$, pa je $a = 1,1$ ili $a = −1,1$.'),
     K('Dužina ne može biti negativna, pa je $a = 1,1 m$.'),
     K('Provera: $1,1 · 1,1 = 1,21$ ✓ (Greška $0,605$ – deljenje sa $2$ umesto korenovanja.)')]);

  Z(2, 'Za koji broj $x$ važi $2x² + 7 = 57$?',
    ['$x = 5$ ili $x = −5$', '$x = 25$', '$x = 5$', '$x = √{32}$ ili $x = −√{32}$'],
    [K('$2x² = 57 − 7 = 50$'),
     K('$x² = 25$'),
     K('$x = 5$ ili $x = −5$')]);

  Z(3, 'Reši jednačinu $(2x + 1)² = 49$.',
    ['$x = 3$ ili $x = −4$', '$x = 3$ ili $x = −3$', '$x = 24$', '$x = 3$ ili $x = 4$'],
    [K('$2x + 1 = 7$ ili $2x + 1 = −7$.'),
     K('Prvi slučaj: $2x = 6$, $x = 3$.'),
     K('Drugi slučaj: $2x = −8$, $x = −4$.'),
     K('Provera: $(2 · 3 + 1)² = 7² = 49$ ✓, $(2 · (−4) + 1)² = (−7)² = 49$ ✓')]);

  Z(3, 'Pravougaonik ima stranice $8 cm$ i $18 cm$. Kolika je stranica kvadrata koji ima istu površinu?',
    ['$12 cm$', '$13 cm$', '$26 cm$', '$72 cm$'],
    [K('Površina pravougaonika: $P = 8 · 18 = 144 cm²$.', ['pr']),
     K('Za kvadrat: $a² = 144$, pa je $a = 12 cm$ (negativno rešenje odbacujemo).', ['kv']),
     K('Iako su iste površine, obimi su različiti: pravougaonik $52 cm$, kvadrat $48 cm$. (Greška $13 cm$ je polovina zbira $8 + 18$.)')],
    G({ A: [0, 0], B: [18, 0], C: [18, 8], D: [0, 8], E: [0, 10], F: [12, 10], H: [12, 22], I: [0, 22] },
      [{ p: 'ABCD', id: 'pr', o: '144 cm²' }, { d: 'AB', o: '18 cm' }, { d: 'BC', o: '8 cm' }, { p: 'EFHI', b: 1, id: 'kv', o: 'a²' }, { d: 'IE', o: 'a' }],
      { bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I'] }));

  Z(1, 'Rešenje jednačine $x² = 0$ je:',
    ['samo $x = 0$', '$x = 0$ ili $x = 1$', 'nema rešenja', 'svaki realan broj'],
    [K('Proizvod $x · x$ je nula samo ako je $x = 0$.'),
     K('Za $a > 0$ jednačina $x² = a$ ima dva rešenja, za $a = 0$ jedno ($x = 0$), a za $a < 0$ nijedno.')]);

  // ════════════════ 1.3 Kvadratni koren ════════════════
  L('Kvadratni koren');

  Z(1, 'Koliko je $√{81} + √{16}$?',
    ['$13$', '$√{97}$', '$65$', '$97$'],
    [K('$√{81} = 9$ jer je $9² = 81$ (i $9 ≥ 0$).'),
     K('$√{16} = 4$ jer je $4² = 16$.'),
     K('$9 + 4 = 13$. Pazi: $√{81} + √{16} ≠ √{81 + 16}$!')]);

  Z(1, 'Koliko je $√{0,64}$?',
    ['$0,8$', '$0,08$', '$0,32$', '$8$'],
    [K('Tražimo nenegativan broj čiji je kvadrat $0,64$.'),
     K('$0,8 · 0,8 = 0,64$ ✓, pa je $√{0,64} = 0,8$.'),
     K('Pravilo: koren ima upola manje decimala od broja pod korenom ($0,64$ ima dve, pa $0,8$ ima jednu).')]);

  Z(1, 'Koliko je $√{(−5)²}$?',
    ['$5$', '$−5$', '$5$ ili $−5$', 'nije definisano'],
    [K('Prvo izračunamo ono pod korenom: $(−5)² = 25$.'),
     K('$√{25} = 5$ – kvadratni koren je uvek nenegativan.'),
     K('Uopšte: $√{a²} = |a|$, apsolutna vrednost broja $a$.')]);

  Z(2, 'Koliko je $√{{49|144}}$?',
    ['${7|12}$', '${7|72}$', '${49|12}$', '${7|144}$'],
    [K('Koren razlomka = koren brojioca kroz koren imenioca: $√{{49|144}} = {√{49}|√{144}}$.'),
     K('$√{49} = 7$, $√{144} = 12$, pa je rezultat ${7|12}$.'),
     K('Provera: $({7|12})² = {49|144}$ ✓')]);

  Z(2, 'Koliko je $√{1{9|16}}$?',
    ['$1{1|4}$', '$1{3|4}$', '$1{3|16}$', '${5|16}$'],
    [K('Mešoviti broj pretvorimo u razlomak: $1{9|16} = {16 + 9|16} = {25|16}$.'),
     K('$√{{25|16}} = {5|4} = 1{1|4}$'),
     K('Česta greška: $1{3|4}$ – ne smeju se posebno korenovati ceo deo i razlomak!')]);

  Z(2, 'Koliko je $√{9 + 16} − (√{9} + √{16})$?',
    ['$−2$', '$0$', '$2$', '$12$'],
    [K('$√{9 + 16} = √{25} = 5$', ['c']),
     K('$√{9} + √{16} = 3 + 4 = 7$', ['a', 'b']),
     K('$5 − 7 = −2$. Koren zbira NIJE zbir korena. Na slici: hipotenuza ($5$) je kraća od zbira kateta ($3 + 4 = 7$).')],
    G({ C: [0, 0], A: [4, 0], B: [0, 3] }, [{ p: 'ABC' }, { pu: 'ACB' }, { d: 'CA', o: '√16 = 4', id: 'b' }, { d: 'CB', o: '√9 = 3', id: 'a' }, { d: 'AB', o: '√25 = 5', id: 'c', b: 3 }], { bezImena: ['A', 'B', 'C'] }));

  Z(2, 'Površina kvadrata je $2,89 dm²$. Koliki je njegov obim?',
    ['$6,8 dm$', '$11,56 dm$', '$1,7 dm$', '$0,68 dm$'],
    [K('$a = √{2,89}$. Kako je $17² = 289$, to je $1,7² = 2,89$, pa je $a = 1,7 dm$.'),
     K('$O = 4a = 4 · 1,7 = 6,8 dm$')]);

  Z(3, 'Koliko je $√{0,0016} · √{2500}$?',
    ['$2$', '$0,2$', '$20$', '$0,02$'],
    [K('$√{0,0016} = 0,04$ jer je $0,04² = 0,0016$ (četiri decimale → dve).'),
     K('$√{2500} = 50$ jer je $50² = 2500$.'),
     K('$0,04 · 50 = 2$. Isto se dobija i kao $√{0,0016 · 2500} = √{4} = 2$.')]);

  Z(3, 'Šahovska tabla ($8 × 8$ polja) ima površinu $1600 cm²$. Kolika je stranica jednog polja?',
    ['$5 cm$', '$40 cm$', '$25 cm$', '$20 cm$'],
    [K('Stranica cele table: $√{1600} = 40 cm$.', ['tabla']),
     K('Duž jedne stranice nalazi se $8$ polja: $40 : 8 = 5 cm$.', ['polje']),
     K('Drugi način: tabla ima $64$ polja, svako površine $1600 : 64 = 25 cm²$, a $√{25} = 5 cm$. (Greška $25 cm$ je površina, ne stranica.)')],
    G({ A: [0, 0], B: [8, 0], C: [8, 8], D: [0, 8], e: [0, 7], f: [1, 7], g: [1, 8] },
      [{ mreza: [0, 8, 0, 8], brojevi: 0 }, { p: 'ABCD', prazno: 1, id: 'tabla' }, { p: 'efgD', b: 1, gusto: 1, id: 'polje' }, { tx: '1600 cm²', at: [4, 4] }],
      { bezImena: ['A', 'B', 'C', 'D'], velicina: 240 }));

  Z(3, 'Za koji broj $x$ važi $√{x − 3} = 5$?',
    ['$x = 28$', '$x = 8$', '$x = 22$', '$x = 13$'],
    [K('Koren je $5$, pa je broj pod korenom $5² = 25$: $x − 3 = 25$.'),
     K('$x = 25 + 3 = 28$'),
     K('Provera: $√{28 − 3} = √{25} = 5$ ✓')]);

  // ════════════════ 1.4 Iracionalni brojevi i brojevna prava ════════════════
  L('Iracionalni brojevi i brojevna prava');

  Z(1, 'Koji od ovih brojeva je iracionalan?',
    ['$√{7}$', '$√{{4|9}}$', '$0,25$', '$−{3|5}$'],
    [K('Racionalni brojevi se mogu zapisati kao razlomak celih brojeva: $0,25 = {1|4}$, $−{3|5}$, a $√{{4|9}} = {2|3}$.'),
     K('$7$ nije kvadrat nijednog racionalnog broja ($2² = 4$, $3² = 9$), pa $√{7}$ nije racionalan – on je iracionalan.'),
     K('Koren prirodnog broja je racionalan samo ako je taj broj potpun kvadrat ($1, 4, 9, 16, …$).')]);

  Z(1, 'Između koja dva uzastopna cela broja se nalazi $√{30}$?',
    ['$5$ i $6$', '$15$ i $16$', '$4$ i $5$', '$29$ i $31$'],
    [K('Tražimo kvadrate oko $30$: $5² = 25$ i $6² = 36$.'),
     K('$25 < 30 < 36$, pa je $√{25} < √{30} < √{36}$, tj. $5 < √{30} < 6$.', ['t0']),
     K('Pošto je $30$ bliže $25$, i $√{30} ≈ 5,48$ je bliže broju $5$.')],
    brojevna(4, 7, [[5.477, '√30', 1, 2]], { podela: 0.5, svaki: 2 }));

  Z(1, 'Na brojevnoj pravoj označene su tačke $A$, $B$, $C$ i $D$. Koja od njih odgovara broju $√{3}$?',
    ['$C$', '$A$', '$B$', '$D$'],
    [K('$1² = 1 < 3 < 4 = 2²$, pa je $1 < √{3} < 2$.'),
     K('$1,7² = 2,89 < 3 < 3,24 = 1,8²$, pa je $√{3} ≈ 1,73$ – između $1,7$ i $1,8$.', ['t2']),
     K('Tačka $A$ je oko $−1,4$ ($−√{2}$), $B$ oko $1,4$ ($√{2}$), a $D$ oko $2,2$ ($√{5}$).')],
    brojevna(-2, 3, [[-1.414, 'A', 0], [1.414, 'B', 0], [1.732, 'C', 0], [2.236, 'D', 0]], { podela: 0.5, svaki: 2, naizmenicno: 1 }));

  Z(2, 'Koliko celih brojeva ima između $−√{10}$ i $√{17}$?',
    ['$8$', '$7$', '$9$', '$6$'],
    [K('$3² = 9 < 10 < 16 = 4²$, pa je $3 < √{10} < 4$, tj. $−4 < −√{10} < −3$ ($−√{10} ≈ −3,16$).', ['t0']),
     K('$4² = 16 < 17 < 25 = 5²$, pa je $4 < √{17} < 5$ ($√{17} ≈ 4,12$).', ['t1']),
     K('Celi brojevi između: $−3, −2, −1, 0, 1, 2, 3, 4$ – ukupno $8$.')],
    brojevna(-5, 6, [[-3.162, '−√10', 1, 1], [4.123, '√17', 2, 2]]));

  Z(2, 'Poređaj brojeve $2√{3}$, $3√{2}$ i $√{17}$ od najmanjeg do najvećeg.',
    ['$2√{3} < √{17} < 3√{2}$', '$√{17} < 2√{3} < 3√{2}$', '$3√{2} < √{17} < 2√{3}$', '$2√{3} < 3√{2} < √{17}$'],
    [K('Unesemo činilac pod koren: $2√{3} = √{4 · 3} = √{12}$, a $3√{2} = √{9 · 2} = √{18}$.'),
     K('Sada poredimo brojeve pod korenom: $12 < 17 < 18$.'),
     K('Dakle $2√{3} < √{17} < 3√{2}$ (približno $3,46 < 4,12 < 4,24$).', ['t0', 't1', 't2'])],
    brojevna(3, 5, [[3.464, '2√3', 1, 3], [4.123, '√17', 2, 3], [4.243, '3√2', 3, 3]], { podela: 0.1, svaki: 5, naizmenicno: 1, visinaNatpisa: 0.22 }));

  Z(2, 'Na brojevnoj pravoj nacrtan je pravougaonik sa stranicama $3$ (od $0$ do $3$) i $1$. Luk sa centrom u $0$, poluprečnika jednakog dijagonali pravougaonika, seče pozitivni deo prave u tački $M$. Koji broj odgovara tački $M$?',
    ['$√{10}$', '$4$', '$√{8}$', '$√{3}$'],
    [K('Dijagonala pravougaonika je hipotenuza pravouglog trougla sa katetama $3$ i $1$.', ['dij']),
     K('$d² = 3² + 1² = 9 + 1 = 10$, pa je $d = √{10}$.'),
     K('Luk prenosi dužinu dijagonale na pravu: $M = √{10} ≈ 3,16$ – malo desno od $3$.', ['luk'])],
    G({ O: [0, 0], A: [3, 0], B: [3, 1], D: [0, 1], M: [3.162, 0, -60] },
      [{ osa: [-1, 4] }, { p: 'OABD', b: 0 }, { d: 'OB', b: 3, id: 'dij' }, { l: 'O', r: 3.162, od: 0, do: 18.4, b: 3, id: 'luk', k: 3 }, { tacka: 'M', b: 1 }], { bezImena: ['O', 'A', 'B', 'D'] }));

  Z(2, 'Koje tvrđenje je tačno?',
    ['Zbir racionalnog i iracionalnog broja je uvek iracionalan', 'Proizvod dva iracionalna broja je uvek iracionalan', 'Zbir dva iracionalna broja je uvek iracionalan', 'Kvadrat iracionalnog broja je uvek iracionalan'],
    [K('Proizvod: $√{2} · √{2} = 2$ – racionalan, pa druga tvrdnja ne važi.'),
     K('Zbir: $√{2} + (−√{2}) = 0$ – racionalan. Kvadrat: $(√{3})² = 3$ – racionalan.'),
     K('Kad bi $q + i$ (racionalan + iracionalan) bio racionalan broj $s$, onda bi $i = s − q$ bio racionalan (razlika racionalnih) – kontradikcija. Zato je prva tvrdnja tačna.')]);

  Z(3, 'Koliko ima prirodnih brojeva $n$ za koje važi $3 < √{n} < 4$?',
    ['$6$', '$7$', '$8$', '$1$'],
    [K('Kvadriramo (svi brojevi su pozitivni): $9 < n < 16$.'),
     K('To su $n = 10, 11, 12, 13, 14, 15$.'),
     K('Ukupno $6$ brojeva. ($9$ i $16$ ne ulaze jer je $√{9} = 3$ i $√{16} = 4$, a nejednakosti su stroge.)')]);

  Z(3, 'Koji je najmanji prirodan broj $n$ za koji je $√{n} > 7,5$?',
    ['$57$', '$56$', '$8$', '$64$'],
    [K('Kvadriramo obe strane: $n > 7,5² = 56,25$.'),
     K('Najmanji prirodan broj veći od $56,25$ je $57$.'),
     K('Provera: $√{56} ≈ 7,48 < 7,5$, a $√{57} ≈ 7,55 > 7,5$ ✓')]);

  Z(3, 'Od brojeva $√{1}, √{2}, √{3}, …, √{50}$ koliko njih je racionalno?',
    ['$7$', '$5$', '$25$', '$8$'],
    [K('$√{n}$ je racionalan samo ako je $n$ potpun kvadrat prirodnog broja.'),
     K('Kvadrati do $50$: $1, 4, 9, 16, 25, 36, 49$ ($8² = 64 > 50$).'),
     K('Racionalnih je $7$, a ostalih $43$ su iracionalni.')]);

  // ════════════════ 1.5 Decimalni zapisi ════════════════
  L('Decimalni zapisi racionalnih i iracionalnih brojeva');

  Z(1, 'Kako se zapisuje razlomak ${3|8}$ u decimalnom obliku?',
    ['$0,375$', '$0,38$', '$0,(375)$', '$0,83$'],
    [K('Delimo $3 : 8$: $30 : 8 = 3$ (ostatak $6$), $60 : 8 = 7$ (ostatak $4$), $40 : 8 = 5$ (ostatak $0$).'),
     K('Deljenje se završilo, pa je zapis konačan: ${3|8} = 0,375$.'),
     K('Zapis je konačan jer je $8 = 2 · 2 · 2$ – imenilac nema drugih prostih činilaca osim $2$ i $5$.')]);

  Z(1, 'Kako se zapisuje razlomak ${2|3}$ u decimalnom obliku?',
    ['$0,(6)$', '$0,6$', '$0,67$', '$0,(3)$'],
    [K('$2 : 3$: $20 : 3 = 6$ (ostatak $2$), pa opet $20 : 3 = 6$ (ostatak $2$)…'),
     K('Ostatak se ponavlja, pa se i cifra $6$ ponavlja beskonačno: ${2|3} = 0,666… = 0,(6)$.'),
     K('$0,67$ je samo približna vrednost (zaokruženo na dve decimale).')]);

  Z(1, 'Koji je decimalni zapis broja ${5|11}$?',
    ['$0,(45)$', '$0,45$', '$0,4(5)$', '$0,(54)$'],
    [K('$50 : 11 = 4$ (ostatak $6$), $60 : 11 = 5$ (ostatak $5$), $50 : 11 = 4$ (ostatak $6$)…'),
     K('Ostaci se smenjuju $6, 5, 6, 5…$, pa se ponavljaju cifre $45$: ${5|11} = 0,454545… = 0,(45)$.')]);

  Z(2, 'Koji od ovih razlomaka ima beskonačan periodičan decimalni zapis?',
    ['${7|12}$', '${7|20}$', '${9|25}$', '${3|16}$'],
    [K('Skraćen razlomak ima konačan decimalni zapis tačno onda kada imenilac nema prostih činilaca osim $2$ i $5$.'),
     K('$20 = 2² · 5$, $25 = 5²$, $16 = 2⁴$ – ovi daju konačne zapise: $0,35$; $0,36$; $0,1875$.'),
     K('$12 = 2² · 3$ sadrži činilac $3$, pa je ${7|12} = 0,58333… = 0,58(3)$ periodičan.')]);

  Z(2, 'Koliko je $0,(3) + 0,(6)$?',
    ['$1$', '$0,9$', '$1,(1)$', '$0,99$'],
    [K('$0,(3) = {1|3}$ i $0,(6) = {2|3}$.'),
     K('${1|3} + {2|3} = {3|3} = 1$'),
     K('Zanimljivo: sabiranjem cifara dobijamo $0,999…$, što je baš jednako $1$.')]);

  Z(2, 'Koji razlomak je jednak broju $0,(45)$?',
    ['${5|11}$', '${9|20}$', '${4|9}$', '${5|9}$'],
    [K('Neka je $x = 0,4545…$. Period ima dve cifre, pa množimo sa $100$: $100x = 45,4545…$'),
     K('Oduzmemo: $100x − x = 45,4545… − 0,4545…$, tj. $99x = 45$.'),
     K('$x = {45|99} = {5|11}$. (${9|20} = 0,45$ je konačan decimalni broj, a ne periodičan.)')]);

  {
    // cifre perioda broja 1/7 raspoređene po krugu
    const cifre = [1, 4, 2, 8, 5, 7];
    const t = { O: [0, 0] }, e = [{ kr: 'O', r: 3, b: 4 }];
    cifre.forEach((c, i) => {
      const u = 90 - i * 60;
      e.push({ tx: String(c), at: [r(3 * Math.cos((u * Math.PI) / 180)), r(3 * Math.sin((u * Math.PI) / 180) - 0.12)], b: i === 1 ? 1 : undefined, k: i === 1 ? 2 : 0 });
      e.push({ tx: `${i + 1}.`, at: [r(4.1 * Math.cos((u * Math.PI) / 180)), r(4.1 * Math.sin((u * Math.PI) / 180) - 0.12)] });
    });
    e.push({ l: 'O', r: 2.2, od: 100, do: 440 - 300, b: 3, str: -1, pun: 1 });
    Z(2, 'Koja cifra je na $20.$ decimalnom mestu broja ${1|7}$?',
      ['$4$', '$1$', '$2$', '$8$'],
      [K('${1|7} = 0,142857142857… = 0,(142857)$ – period ima $6$ cifara, koje se ponavljaju u krug.'),
       K('$20 = 3 · 6 + 2$: posle tri cela perioda ($18$ decimala) dolazi druga cifra perioda.'),
       K('Druga cifra perioda je $4$.')],
      G(t, e, { bezImena: ['O'], velicina: 220 }));
  }

  Z(3, 'Koji razlomak je jednak broju $0,1(6)$?',
    ['${1|6}$', '${16|99}$', '${16|90}$', '${1|16}$'],
    [K('Neka je $x = 0,1666…$. Pomerimo zarez da period počne odmah: $10x = 1,666…$, a $100x = 16,666…$'),
     K('$100x − 10x = 16,666… − 1,666…$, tj. $90x = 15$.'),
     K('$x = {15|90} = {1|6}$. Provera: $1 : 6 = 0,1666…$ ✓')]);

  Z(3, 'Koji od ovih brojeva je iracionalan?',
    ['$0,1010010001…$ (broj nula između jedinica stalno raste)', '$0,(10)$', '$0,1010$', '${10|99}$'],
    [K('$0,1010$ je konačan decimalni broj – racionalan (${101|1000}$).'),
     K('$0,(10) = 0,101010…$ je periodičan, pa je racionalan: baš je jednak ${10|99}$.'),
     K('U broju $0,1010010001…$ nijedan niz cifara se ne ponavlja zauvek (nule se stalno produžavaju), pa zapis nije ni konačan ni periodičan – broj je iracionalan.')]);

  Z(3, 'Koliko cifara ima period decimalnog zapisa broja ${1|13}$?',
    ['$6$', '$12$', '$13$', '$2$'],
    [K('Delimo $1 : 13$ i pratimo ostatke: $10, 9, 12, 3, 4, 1, …$ (cifre $0, 7, 6, 9, 2, 3$).'),
     K('Posle šestog koraka ostatak je ponovo $1$ – kao na početku, pa se sve ponavlja.'),
     K('${1|13} = 0,(076923)$ – period ima $6$ cifara. (Period je uvek kraći od imenioca, jer različitih ostataka ima najviše $12$.)')]);

  // ════════════════ 1.6 Približna vrednost ════════════════
  L('Približna vrednost');

  Z(1, 'Zaokruži broj $3,14159$ na dve decimale.',
    ['$3,14$', '$3,15$', '$3,1$', '$3,141$'],
    [K('Gledamo treću decimalu: $3,14|159$ – ona je $1$.'),
     K('Pošto je $1 < 5$, druga decimala ostaje ista: $3,14159 ≈ 3,14$.')]);

  Z(1, 'Zaokruži broj $0,0476$ na dve decimale.',
    ['$0,05$', '$0,04$', '$0,048$', '$0,5$'],
    [K('Treća decimala je $7 ≥ 5$, pa drugu decimalu ($4$) povećavamo za $1$.'),
     K('$0,0476 ≈ 0,05$ (broj je bliži $0,05$ nego $0,04$).')]);

  Z(2, 'Zaokruži broj $2,456$ na jednu decimalu i odredi apsolutnu grešku.',
    ['$2,5$; greška $0,044$', '$2,4$; greška $0,056$', '$2,5$; greška $0,056$', '$2,46$; greška $0,004$'],
    [K('$2,456$ je između $2,4$ i $2,5$.'),
     K('Rastojanja: $|2,456 − 2,4| = 0,056$, a $|2,5 − 2,456| = 0,044$. Bliže je $2,5$.', ['t0', 't1']),
     K('$2,456 ≈ 2,5$, a apsolutna greška je $Δ = 0,044$.')],
    brojevna(2.4, 2.5, [[2.4, '2,4', 4], [2.456, '2,456', 1], [2.5, '2,5', 4]], { podela: 0.01, svaki: 100, brojevi: 0, visinaNatpisa: 0.012, naizmenicno: 1 }));

  Z(2, 'Bez kalkulatora zaokruži $√{5}$ na jednu decimalu.',
    ['$2,2$', '$2,3$', '$2,5$', '$2,1$'],
    [K('$2,2² = 4,84 < 5$ i $2,3² = 5,29 > 5$, pa je $2,2 < √{5} < 2,3$.'),
     K('Proverimo sredinu: $2,25² = 5,0625 > 5$, pa je $√{5} < 2,25$ – bliže $2,2$.', ['t1']),
     K('$√{5} ≈ 2,2$ (tačnije $2,236…$).', ['t0'])],
    brojevna(2.2, 2.3, [[2.236, '√5', 1, 3], [2.25, '2,25', 3, 2]], { podela: 0.01, svaki: 5, visinaNatpisa: 0.012 }));

  Z(2, 'Broj $π = 3,14159…$ zamenjen je približnom vrednošću $3,14$. Kolika je apsolutna greška?',
    ['oko $0,0016$', 'oko $0,016$', 'oko $0,14$', 'oko $0,0006$'],
    [K('Apsolutna greška: $Δ = |π − 3,14|$.'),
     K('$3,14159… − 3,14 = 0,00159… ≈ 0,0016$')]);

  Z(2, 'Razlomak ${2|3}$ zamenjen je brojem $0,67$. Kolika je apsolutna greška?',
    ['${1|300}$', '${1|100}$', '${3|100}$', '${1|30}$'],
    [K('$Δ = |{2|3} − {67|100}|$. Zajednički imenilac je $300$.'),
     K('${2|3} = {200|300}$, ${67|100} = {201|300}$.'),
     K('$Δ = {201 − 200|300} = {1|300} ≈ 0,0033$')]);

  Z(2, 'Dužina olovke zaokružena na ceo centimetar iznosi $24 cm$. Koja od ovih dužina NE može biti stvarna dužina olovke?',
    ['$24,5 cm$', '$23,5 cm$', '$24,49 cm$', '$23,8 cm$'],
    [K('Na $24$ se zaokružuju brojevi od $23,5$ (uključujući) do $24,5$ (bez njega).'),
     K('$23,5 → 24$, $23,8 → 24$, $24,49 → 24$ (prva decimala $4 < 5$).'),
     K('$24,5$ se zaokružuje na $25$ – ne može biti stvarna dužina.')],
    brojevna(23, 25, [[23.5, '23,5', 2], [24.5, '24,5', 1]], { podela: 0.1, svaki: 10, dodatno: [{ lin: [[23.5, 0.08], [24.5, 0.08]], b: 2, debljina: 6 }] }));

  Z(3, 'Marko je $√{2}$ zaokružio na $1,4$, pa izračunao $1,4² · 100$. Koliko se njegov rezultat razlikuje od tačne vrednosti $(√{2})² · 100$?',
    ['za $4$', 'za $0$', 'za $0,4$', 'za $40$'],
    [K('Tačno: $(√{2})² · 100 = 2 · 100 = 200$.'),
     K('Markov račun: $1,4² = 1,96$, pa je $1,96 · 100 = 196$.'),
     K('Razlika je $200 − 196 = 4$. Mala greška zaokruživanja ($0,014…$) naraste kad se broj kvadrira i množi – zato se zaokružuje tek na kraju računa.')]);

  Z(3, 'Zaokruži $√{11}$ na dve decimale.',
    ['$3,32$', '$3,31$', '$3,3$', '$3,33$'],
    [K('$3,31² = 10,9561 < 11 < 11,0224 = 3,32²$, pa je $3,31 < √{11} < 3,32$.'),
     K('Sredina: $3,315² = 10,989… < 11$, pa je $√{11} > 3,315$ – bliže $3,32$.', ['t0']),
     K('$√{11} ≈ 3,32$ (tačnije $3,3166…$).')],
    brojevna(3.31, 3.32, [[3.3166, '√11', 1, 2], [3.315, '3,315', 3, 1]], { podela: 0.001, svaki: 5, visinaNatpisa: 0.0012, naizmenicno: 1 }));

  Z(3, 'Koji je najmanji broj koji se zaokružen na jednu decimalu zapisuje kao $5,3$?',
    ['$5,25$', '$5,2$', '$5,3$', '$5,249$'],
    [K('Na $5,3$ se zaokružuju brojevi koji su bliži $5,3$ nego $5,2$ i $5,4$.'),
     K('Granica između $5,2$ i $5,3$ je sredina $5,25$; po pravilu se $5,25$ zaokružuje naviše, na $5,3$.'),
     K('$5,249$ se zaokružuje na $5,2$. Najmanji je $5,25$.')]);

  // ════════════════ 1.7 Računske operacije i koren ════════════════
  L('Osnovne računske operacije i kvadratni koren');

  Z(1, 'Koliko je $√{2} · √{8}$?',
    ['$4$', '$√{10}$', '$16$', '$2√{2}$'],
    [K('Proizvod korena je koren proizvoda: $√{2} · √{8} = √{2 · 8} = √{16}$.'),
     K('$√{16} = 4$')]);

  Z(1, 'Koliko je $√{72} : √{2}$?',
    ['$6$', '$36$', '$√{70}$', '$3√{2}$'],
    [K('Količnik korena je koren količnika: $√{72} : √{2} = √{72 : 2} = √{36}$.'),
     K('$√{36} = 6$')]);

  Z(2, 'Delimičnim korenovanjem izraz $√{75}$ postaje:',
    ['$5√{3}$', '$3√{5}$', '$25√{3}$', '$5√{15}$'],
    [K('Rastavimo $75$ tako da jedan činilac bude potpun kvadrat: $75 = 25 · 3$.'),
     K('$√{75} = √{25 · 3} = √{25} · √{3} = 5√{3}$'),
     K('Provera: $(5√{3})² = 25 · 3 = 75$ ✓')]);

  Z(2, 'Koliko je $3√{2} + 5√{2} − √{2}$?',
    ['$7√{2}$', '$8√{2}$', '$7√{6}$', '$7$'],
    [K('Sve sabirke imaju isti koren $√{2}$ – sabiraju se kao „slični“ članovi (kao $3a + 5a − a$).'),
     K('$(3 + 5 − 1)√{2} = 7√{2}$')]);

  Z(2, 'Koliko je $√{12} + √{27}$?',
    ['$5√{3}$', '$√{39}$', '$6√{3}$', '$13√{3}$'],
    [K('Koreni se ne sabiraju direktno ($√{12} + √{27} ≠ √{39}$). Prvo ih uprostimo.'),
     K('$√{12} = √{4 · 3} = 2√{3}$, $√{27} = √{9 · 3} = 3√{3}$.'),
     K('$2√{3} + 3√{3} = 5√{3}$')]);

  Z(2, 'Koliko je $(√{5})² + (2√{3})²$?',
    ['$17$', '$11$', '$25$', '$√{17}$'],
    [K('$(√{5})² = 5$'),
     K('$(2√{3})² = 2² · (√{3})² = 4 · 3 = 12$ – kvadrira se i činilac $2$!'),
     K('$5 + 12 = 17$')]);

  Z(2, 'Koji je broj veći: $2√{7}$ ili $3√{3}$?',
    ['$2√{7}$', '$3√{3}$', 'jednaki su', 'ne može se odrediti bez kalkulatora'],
    [K('Unesemo činioce pod koren: $2√{7} = √{4 · 7} = √{28}$, a $3√{3} = √{9 · 3} = √{27}$.'),
     K('$28 > 27$, pa je $√{28} > √{27}$, tj. $2√{7} > 3√{3}$.')]);

  Z(3, 'Koliko je $√{50} − √{18} + √{8}$?',
    ['$4√{2}$', '$√{40}$', '$2√{10}$', '$6√{2}$'],
    [K('$√{50} = 5√{2}$, $√{18} = 3√{2}$, $√{8} = 2√{2}$.'),
     K('$5√{2} − 3√{2} + 2√{2} = 4√{2} ≈ 5,66$')]);

  Z(3, 'Stranice pravougaonika su $√{18} cm$ i $√{8} cm$. Kolike su mu površina i obim?',
    ['$P = 12 cm²$, $O = 10√{2} cm$', '$P = 12 cm²$, $O = 2√{26} cm$', '$P = 144 cm²$, $O = 10√{2} cm$', '$P = 12 cm²$, $O = 52 cm$'],
    [K('$P = √{18} · √{8} = √{144} = 12 cm²$', ['pr']),
     K('$√{18} = 3√{2}$, $√{8} = 2√{2}$.', ['a', 'b']),
     K('$O = 2(3√{2} + 2√{2}) = 2 · 5√{2} = 10√{2} cm ≈ 14,1 cm$')],
    G({ A: [0, 0], B: [4.243, 0], C: [4.243, 2.828], D: [0, 2.828] }, [{ p: 'ABCD', id: 'pr' }, { d: 'AB', o: '√18 cm', id: 'a' }, { d: 'BC', o: '√8 cm', id: 'b' }], { bezImena: ['A', 'B', 'C', 'D'] }));

  Z(3, 'Koliko je $√{2} · (√{8} + √{18})$?',
    ['$10$', '$2√{13}$', '$26$', '$5√{2}$'],
    [K('Pomnožimo svaki sabirak: $√{2} · √{8} + √{2} · √{18}$.'),
     K('$√{16} + √{36} = 4 + 6 = 10$')]);

  // ════════════════ 1.8 Funkcija direktne proporcionalnosti ════════════════
  L('Funkcija direktne proporcionalnosti');

  Z(1, 'Data je funkcija $y = 3x$. Kolika je vrednost $y$ za $x = −2$?',
    ['$−6$', '$6$', '$1$', '$−5$'],
    [K('Zamenimo $x = −2$: $y = 3 · (−2)$.'),
     K('$y = −6$. Tačka $(−2, −6)$ leži na grafiku.', ['m'])],
    G({ O: [0, 0], M: [-2, -6] }, [{ mreza: [-3, 3, -7, 7], ose: ['x', 'y'] }, prava(3, 0, -2.3, 2.3, { id: 'graf' }), { tacka: 'M', id: 'm', k: 2, b: 1 }], { bezImena: ['O'], velicina: 260 }));

  Z(1, 'Veličina $y$ je direktno proporcionalna veličini $x$, i za $x = 4$ je $y = 12$. Koliko je $y$ za $x = 7$?',
    ['$21$', '$15$', '$28$', '$84$'],
    [K('Direktna proporcionalnost: $y = k · x$. Iz $12 = k · 4$ sledi $k = 3$.'),
     K('Za $x = 7$: $y = 3 · 7 = 21$.'),
     K('Provera količnikom: ${12|4} = {21|7} = 3$ ✓ (Greška $15$: dodato $3$ umesto množenja.)')]);

  Z(1, 'Koja od ovih tačaka pripada grafiku funkcije $y = −2x$?',
    ['$(3, −6)$', '$(−6, 3)$', '$(2, 4)$', '$(−1, −2)$'],
    [K('Tačka $(x, y)$ pripada grafiku ako važi $y = −2x$.'),
     K('$(3, −6)$: $−2 · 3 = −6$ ✓. $(−6, 3)$: $−2 · (−6) = 12 ≠ 3$. $(2, 4)$: $−4 ≠ 4$. $(−1, −2)$: $2 ≠ −2$.'),
     K('Grafik je prava kroz koordinatni početak; tačka $(3, −6)$ leži na njoj.', ['m'])],
    G({ O: [0, 0], M: [3, -6] }, [{ mreza: [-4, 4, -7, 7], ose: ['x', 'y'] }, prava(-2, 0, -3.5, 3.5, { id: 'graf', k: 3 }), { tacka: 'M', id: 'm', k: 3, b: 3 }], { bezImena: ['O'], velicina: 260 }));

  Z(2, 'Na slici je grafik funkcije direktne proporcionalnosti. Koja je to funkcija?',
    ['$y = {3|2}x$', '$y = {2|3}x$', '$y = 3x$', '$y = x + 1$'],
    [K('Grafik prolazi kroz koordinatni početak i kroz tačku $A(2, 3)$.', ['a']),
     K('Za $y = kx$: $3 = k · 2$, pa je $k = {3|2}$.'),
     K('Funkcija je $y = {3|2}x$. (Kod $y = {2|3}x$ za $x = 2$ bilo bi $y = {4|3}$, a $y = x + 1$ ne prolazi kroz $(0, 0)$.)')],
    G({ O: [0, 0], A: [2, 3], a: [2, 0] }, [{ mreza: [-4, 4, -5, 5], ose: ['x', 'y'] }, prava(1.5, 0, -3.3, 3.3, { id: 'graf' }), { tacka: 'A', id: 'a', b: 3 }, { d: 'Aa', isp: 1, k: 1 }], { bezImena: ['O'], velicina: 260 }));

  Z(2, 'Za $5 kg$ jabuka plaćeno je $600$ dinara. Koliko košta $3,5 kg$ jabuka?',
    ['$420$ dinara', '$360$ dinara', '$500$ dinara', '$2100$ dinara'],
    [K('Cena je direktno proporcionalna masi: $c = k · m$. Cena jednog kilograma: $k = 600 : 5 = 120$ dinara.'),
     K('$c = 120 · 3,5 = 420$ dinara.', ['m']),
     K('Grafik cene je prava kroz koordinatni početak: dupla masa – dupla cena.')],
    G({ O: [0, 0], M: [3.5, 4.2], A: [5, 6] },
      [{ mreza: [0, 6, 0, 7], brojevi: 0, ose: ['kg', '~din'] }, prava(1.2, 0, 0, 5.8), { tacka: 'A', b: 2 }, { tx: '600', at: [-0.5, 6] }, { tx: '5', at: [5, -0.45] },
       { tacka: 'M', id: 'm', k: 2, b: 3 }, { lin: [[3.5, 0], [3.5, 4.2], [0, 4.2]], isp: 1, b: 3, k: 2 }, { tx: '420', at: [-0.5, 4.2], k: 2, b: 3 }, { tx: '3,5', at: [3.5, -0.45], b: 3 }],
      { bezImena: ['O', 'A', 'M'], velicina: 260 }));

  Z(2, 'Automobil troši $6,5$ litara goriva na $100 km$. Koliko goriva potroši na putu od $340 km$?',
    ['$22,1$ litara', '$2,21$ litara', '$52,3$ litara', '$34$ litra'],
    [K('Potrošnja je direktno proporcionalna pređenom putu. Na $1 km$: $6,5 : 100 = 0,065$ litara.'),
     K('Na $340 km$: $0,065 · 340 = 22,1$ litara.'),
     K('Drugi način: $340 km$ je $3,4$ puta više od $100 km$, pa je $6,5 · 3,4 = 22,1$.')]);

  Z(2, 'Grafik funkcije $y = kx$ prolazi kroz tačku $A(−4, 10)$. Koliko je $k$?',
    ['$−{5|2}$', '${5|2}$', '$−{2|5}$', '$6$'],
    [K('Koordinate tačke $A$ zadovoljavaju jednačinu: $10 = k · (−4)$.'),
     K('$k = {10|−4} = −{5|2} = −2,5$'),
     K('Negativan koeficijent: grafik „pada“ – prolazi kroz II i IV kvadrant.', ['graf'])],
    G({ O: [0, 0], A: [-4, 10] }, [{ mreza: [-5, 5, -11, 11], podela: 2, ose: ['x', 'y'] }, prava(-2.5, 0, -4.4, 4.4, { id: 'graf' }), { tacka: 'A', b: 3 }], { bezImena: ['O'], velicina: 240 }));

  Z(3, 'Tačke $A(2, a)$ i $B(b, −9)$ leže na grafiku funkcije $y = −3x$. Koliko je $a + b$?',
    ['$−3$', '$3$', '$−9$', '$−15$'],
    [K('Za tačku $A$: $a = −3 · 2 = −6$.'),
     K('Za tačku $B$: $−9 = −3 · b$, pa je $b = 3$.'),
     K('$a + b = −6 + 3 = −3$')]);

  Z(3, 'Na mapi razmere $1 : 250 000$ rastojanje između dva grada je $6,4 cm$. Koliko je stvarno rastojanje?',
    ['$16 km$', '$1,6 km$', '$160 km$', '$25,6 km$'],
    [K('Razmera $1 : 250 000$ znači da $1 cm$ na mapi odgovara $250 000 cm$ u prirodi.'),
     K('$6,4 · 250 000 = 1 600 000 cm$.'),
     K('$1 600 000 cm = 16 000 m = 16 km$ (jer je $1 km = 100 000 cm$).')]);

  Z(3, 'Tačka $P$ na grafiku funkcije $y = 2x$ ima apscisu $3$. Neka je $Q$ njena projekcija na $x$-osu, a $O$ koordinatni početak. Kolika je površina trougla $OPQ$?',
    ['$9$', '$18$', '$6$', '$12$'],
    [K('Ordinata tačke $P$: $y = 2 · 3 = 6$, pa je $P(3, 6)$ i $Q(3, 0)$.', ['p']),
     K('Trougao $OPQ$ je pravougli sa katetama $OQ = 3$ i $PQ = 6$.', ['tr']),
     K('$P = {3 · 6|2} = 9$')],
    G({ O: [0, 0, 225], P: [3, 6], Q: [3, 0, -45] },
      [{ mreza: [-1, 5, -1, 7], ose: ['x', 'y'] }, prava(2, 0, -0.5, 3.4), { p: 'OQP', b: 2, id: 'tr', k: 2 }, { pu: 'OQP', k: 2 }, { tacka: 'P', id: 'p', b: 3, k: 1 }],
      { velicina: 240 }));

  // ════════════════ 1.9 Produžena proporcija ════════════════
  L('Produžena proporcija');

  Z(1, 'Broj $50$ treba podeliti na tri dela u razmeri $2 : 3 : 5$. Koliki je najveći deo?',
    ['$25$', '$20$', '$10$', '$30$'],
    [K('Ukupno delova: $2 + 3 + 5 = 10$.', ['tr0', 'tr1', 'tr2']),
     K('Jedan deo vredi $50 : 10 = 5$.'),
     K('Delovi su $2 · 5 = 10$, $3 · 5 = 15$ i $5 · 5 = 25$. Najveći je $25$.', ['tr2'])],
    traka([2, 3, 5], ['a', 'b', 'c'], { vrednost: 5, k: 2 }));

  Z(1, 'Uglovi trougla su u razmeri $1 : 2 : 3$. Koliki je najveći ugao?',
    ['$90°$', '$60°$', '$120°$', '$108°$'],
    [K('Zbir uglova trougla je $180°$, a delova ima $1 + 2 + 3 = 6$.'),
     K('Jedan deo: $180° : 6 = 30°$. Uglovi su $30°$, $60°$ i $90°$.', ['u1', 'u2', 'u3']),
     K('Najveći ugao je $90°$ – trougao je pravougli.')],
    G({ A: [0, 0], B: [6, 0], C: [1.5, 2.598] }, [{ p: 'ABC' }, { u: 'BAC', o: 'α', id: 'u2', r: 26 }, { u: 'CBA', o: 'β', id: 'u1', r: 40 }, { u: 'ACB', o: 'γ', id: 'u3', r: 18 }]));

  Z(1, 'Razmera $12 : 18 : 30$ zapisana skraćeno je:',
    ['$2 : 3 : 5$', '$4 : 6 : 15$', '$1 : 2 : 3$', '$6 : 9 : 10$'],
    [K('Tražimo najveći zajednički delilac brojeva $12$, $18$ i $30$: to je $6$.'),
     K('$12 : 6 = 2$, $18 : 6 = 3$, $30 : 6 = 5$, pa je $12 : 18 : 30 = 2 : 3 : 5$.')]);

  Z(2, 'Obim trougla je $36 cm$, a stranice su u razmeri $3 : 4 : 5$. Kolika je površina trougla?',
    ['$54 cm²$', '$108 cm²$', '$45 cm²$', '$60 cm²$'],
    [K('$3 + 4 + 5 = 12$ delova, jedan deo je $36 : 12 = 3 cm$. Stranice: $9 cm$, $12 cm$, $15 cm$.', ['a', 'b', 'c']),
     K('$9² + 12² = 81 + 144 = 225 = 15²$ – trougao je pravougli (obrnuta Pitagorina teorema).', ['pu']),
     K('Katete su $9 cm$ i $12 cm$: $P = {9 · 12|2} = 54 cm²$.')],
    G({ C: [0, 0], A: [12, 0], B: [0, 9] }, [{ p: 'ABC' }, { pu: 'ACB', k: 2, id: 'pu' }, { d: 'CA', o: '4k', id: 'b' }, { d: 'CB', o: '3k', id: 'a' }, { d: 'AB', o: '5k', id: 'c' }], { bezImena: ['A', 'B', 'C'] }));

  Z(2, 'Ako je $a : b = 2 : 3$ i $b : c = 4 : 5$, onda je $a : b : c$ jednako:',
    ['$8 : 12 : 15$', '$2 : 3 : 5$', '$2 : 12 : 5$', '$8 : 3 : 5$'],
    [K('Broj $b$ se javlja u obe razmere: jednom kao $3$, drugi put kao $4$. Izjednačimo ga – NZS$(3, 4) = 12$.'),
     K('$a : b = 2 : 3 = 8 : 12$ (puta $4$), a $b : c = 4 : 5 = 12 : 15$ (puta $3$).'),
     K('Spojimo: $a : b : c = 8 : 12 : 15$.')]);

  Z(2, 'Tri drugara uložila su $400$, $600$ i $1000$ dinara u zajedničku kupovinu, a zatim zaradila $3000$ dinara. Zaradu dele srazmerno ulozima. Koliko dobija onaj koji je uložio $600$ dinara?',
    ['$900$ dinara', '$1000$ dinara', '$600$ dinara', '$1500$ dinara'],
    [K('Razmera uloga: $400 : 600 : 1000 = 2 : 3 : 5$.', ['tr0', 'tr1', 'tr2']),
     K('$2 + 3 + 5 = 10$ delova; jedan deo je $3000 : 10 = 300$ dinara.'),
     K('Drugi drug dobija $3 · 300 = 900$ dinara (ostali $600$ i $1500$).', ['tr1'])],
    traka([2, 3, 5], ['I', 'II', 'III'], { vrednost: 300, k: 2 }));

  Z(2, 'U leguri su bakar, cink i kalaj u razmeri $7 : 2 : 1$. Koliko bakra ima u $4 kg$ legure?',
    ['$2,8 kg$', '$0,4 kg$', '$0,8 kg$', '$4 kg$'],
    [K('Ukupno $7 + 2 + 1 = 10$ delova; jedan deo je $4 kg : 10 = 0,4 kg$.'),
     K('Bakar: $7 · 0,4 = 2,8 kg$ (cink $0,8 kg$, kalaj $0,4 kg$).')]);

  Z(3, 'Za brojeve $x$, $y$ i $z$ važi $x : y : z = 3 : 4 : 6$ i $2x + y − z = 12$. Koliko je $z$?',
    ['$18$', '$6$', '$24$', '$12$'],
    [K('Zapišemo $x = 3k$, $y = 4k$, $z = 6k$.'),
     K('$2 · 3k + 4k − 6k = 4k = 12$, pa je $k = 3$.'),
     K('$z = 6 · 3 = 18$ (a $x = 9$, $y = 12$). Provera: $18 + 12 − 18 = 12$ ✓')]);

  Z(3, 'Ivice kvadra su u razmeri $1 : 2 : 3$, a zbir dužina svih ivica je $72 cm$. Kolika je zapremina kvadra?',
    ['$162 cm³$', '$6 cm³$', '$48 cm³$', '$1296 cm³$'],
    [K('Kvadar ima po $4$ ivice svake dužine: $4(a + b + c) = 72$, pa je $a + b + c = 18 cm$.'),
     K('$1 + 2 + 3 = 6$ delova, jedan deo $18 : 6 = 3 cm$. Ivice: $3 cm$, $6 cm$, $9 cm$.'),
     K('$V = 3 · 6 · 9 = 162 cm³$. Slika: kvadar od $1 · 2 · 3 = 6$ kocki ivice $3 cm$, svaka zapremine $27 cm³$: $6 · 27 = 162$.')],
    kocke(1, 2, 3));

  Z(3, 'Uglovi četvorougla su u razmeri $2 : 3 : 4 : 6$. Koliki je najmanji ugao?',
    ['$48°$', '$24°$', '$36°$', '$60°$'],
    [K('Zbir uglova četvorougla je $360°$ (dijagonala ga deli na dva trougla).'),
     K('$2 + 3 + 4 + 6 = 15$ delova; jedan deo je $360° : 15 = 24°$.'),
     K('Uglovi: $48°$, $72°$, $96°$, $144°$. Najmanji je $48°$.')]);
};
