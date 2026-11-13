// Tema 4: Razlomci – prvi deo (lekcije 4.1–4.5)
module.exports = ({ L, Z, K, G, O, bez, r, proveri, traka, pica, skok, skokovi, sto, isti, nzs }) => {
  const pr = (x, y, w, h, x2 = {}) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((p) => p.map(r)), zatv: 1, ...x2 });
  const g = (e, vel = 240) => G(O, e, { ...bez, velicina: vel });
  // brojevna poluprava od a do b sa podeocima 1/n i natpisima celih brojeva
  const osa = (a, b, n, x = {}) => ({ osa: [a, b], podela: 1 / n, svaki: n, ...x });

  // ════════════════ 4.1 Pojam razlomka ════════════════
  L('Pojam razlomka');

  Z(1, 'Koji deo pice je obojen?',
    ['${3|8}$', '${3|5}$', '${5|8}$', '${8|3}$'],
    [K('Pica je podeljena na $8$ jednakih delova – to je imenilac.'),
     K('Obojena su $3$ dela – to je brojilac: ${3|8}$.', ['o'])],
    g(pica(8, 3, { id: 'o' }), 180));

  Z(1, 'Koji deo trake NIJE obojen?',
    ['${3|5}$', '${2|5}$', '${2|3}$', '${3|2}$'],
    [K('Traka ima $5$ jednakih delova, obojena su $2$.'),
     K('Neobojenih je $5 − 2 = 3$ od $5$: ${3|5}$.')],
    g(traka(5, 2, { w: 8 }), 260));

  Z(1, 'U korpi su $24$ jabuke. Koliko je ${3|4}$ jabuka?',
    ['$18$', '$6$', '$12$', '$32$'],
    [K('Jedna četvrtina: $24 : 4 = 6$ jabuka.', ['c']),
     K('Tri četvrtine: $3 · 6 = 18$ jabuka.')],
    g([...traka(4, 3, { w: 8, h: 1.2, k: 2 }), ...traka(4, 0, { w: 8, h: 1.2 }), ...[0, 1, 2, 3].map((i) => ({ tx: '6', at: [1 + i * 2, 0.6], k: 1, id: 'c' })), { lin: [[0, -0.4], [8, -0.4]], b: 3, debljina: 2 }, { tx: '24', at: [4, -0.9] }], 260));

  Z(2, '${2|5}$ nekog broja je $14$. Koji je to broj?',
    ['$35$', '$28$', '$70$', '${28|5}$'],
    [K('Dve petine su $14$, pa je jedna petina $14 : 2 = 7$.', ['p']),
     K('Ceo broj ima $5$ petina: $5 · 7 = 35$.')],
    g([...traka(5, 2, { w: 8, h: 1.2 }), { tx: '14', at: [3.2, 1.7], b: 1 }, { lin: [[0, 1.3], [3.2, 1.3]], b: 1, debljina: 2 }, ...[0, 1, 2, 3, 4].map((i) => ({ tx: '7', at: [0.8 + i * 1.6, 0.6], k: 1, id: 'p' })), { tx: '?', at: [4, -0.6] }], 260));

  Z(1, 'Nepravi razlomak ${7|4}$ zapiši kao mešoviti broj.',
    ['$1{3|4}$', '$7{1|4}$', '$1{4|7}$', '$3{1|4}$'],
    [K('$7$ četvrtina: $4$ četvrtine čine jednu celu picu.', ['c']),
     K('Ostaju još $3$ četvrtine: ${7|4} = 1{3|4}$.')],
    g([...pica(4, 4, { id: 'c' }), ...pica(4, 3, { cx: 7, b: 2 })], 240));

  Z(1, 'Koliko minuta je ${3|4}$ sata?',
    ['$45$ minuta', '$34$ minuta', '$75$ minuta', '$15$ minuta'],
    [K('Sat ima $60$ minuta; četvrtina sata je $60 : 4 = 15$ minuta.'),
     K('Tri četvrtine: $3 · 15 = 45$ minuta.')],
    g([...pica(4, 3, { R: 3 }), { tx: '12', at: [0, 3.5] }, { tx: '3', at: [3.5, -0.1] }, { tx: '6', at: [0, -3.7] }, { tx: '9', at: [-3.5, -0.1] }], 180));

  Z(2, 'Koliko ima pravih razlomaka sa imeniocem $7$ (brojilac je prirodan broj)?',
    ['$6$', '$7$', '$8$', 'beskonačno mnogo'],
    [K('Pravi razlomak je manji od $1$: brojilac je manji od imenioca.'),
     K('${1|7}, {2|7}, …, {6|7}$ – ukupno $6$.')]);

  Z(2, 'Mešoviti broj $2{3|5}$ zapiši kao razlomak.',
    ['${13|5}$', '${6|5}$', '${11|5}$', '${23|5}$'],
    [K('Dva cela su $2 · 5 = 10$ petina.', ['c']),
     K('$10 + 3 = 13$ petina: ${13|5}$.')],
    g([...traka(5, 5, { w: 5, id: 'c' }), ...traka(5, 5, { x: 5.5, w: 5, id: 'c' }), ...traka(5, 3, { x: 11, w: 5, b: 2 })], 300));

  Z(3, 'Kvadrat je podeljen dijagonalama na $4$ trougla, a jedan od njih je podeljen na pola. Koji deo kvadrata je obojen?',
    ['${1|8}$', '${1|5}$', '${1|4}$', '${1|6}$'],
    [K('Dijagonale dele kvadrat na $4$ jednaka trougla – svaki je ${1|4}$ kvadrata.', ['t']),
     K('Obojena je polovina jednog trougla: ${1|2}$ od ${1|4}$ je ${1|8}$ kvadrata. (Delova ima $5$, ali nisu jednaki!)'),
     K('Kvadrat bi se mogao podeliti na $8$ takvih delova.', [], g([pr(0, 0, 4, 4, { b: 4, prazno: 1 }), ...[[[0, 0], [2, 0]], [[2, 0], [4, 0]], [[4, 0], [4, 2]], [[4, 2], [4, 4]], [[4, 4], [2, 4]], [[2, 4], [0, 4]], [[0, 4], [0, 2]], [[0, 2], [0, 0]]].map(([a, b], i) => ({ lin: [a, b, [2, 2]], zatv: 1, b: i === 0 ? 1 : 4, gusto: i === 0 ? 1 : 0, prazno: i === 0 ? 0 : 1, crtaj: 1, kasni: 0.2 + i * 0.2 }))], 160))],
    g([pr(0, 0, 4, 4, { b: 4, prazno: 1 }), { lin: [[0, 0], [4, 4]], b: 4 }, { lin: [[0, 4], [4, 0]], b: 4 }, { lin: [[0, 0], [2, 0], [2, 2]], zatv: 1, b: 1, gusto: 1 }, { lin: [[2, 0], [2, 2]], b: 4 }, { lin: [[0, 0], [4, 0], [2, 2]], zatv: 1, b: 3, prazno: 1, k: 1, id: 't' }], 160));

  Z(3, 'Čokolada ima $24$ kockice. Ana je pojela ${1|3}$ čokolade, a Bojan ${1|4}$ čokolade. Koliko kockica je ostalo?',
    ['$10$', '$14$', '$17$', '$12$'],
    [K('${1|3}$ od $24$: $24 : 3 = 8$ kockica (Ana).', ['a']),
     K('${1|4}$ od $24$: $24 : 4 = 6$ kockica (Bojan).', ['b']),
     K('Ostalo: $24 − 8 − 6 = 10$ kockica.')],
    g([...Array(24)].map((_, i) => pr((i % 6) * 0.8, Math.floor(i / 6) * 0.8, 0.75, 0.75, { b: i < 8 ? 1 : i < 14 ? 2 : 3, gusto: 1, ...(i < 8 ? { k: 1, id: 'a' } : i < 14 ? { k: 2, id: 'b' } : {}) })).concat([...Array(24)].map((_, i) => pr((i % 6) * 0.8, Math.floor(i / 6) * 0.8, 0.75, 0.75, { b: 3, gusto: 1, kraj: i < 8 ? 1 : i < 14 ? 2 : 99 }))), 200));

  // ════════════════ 4.2 Razlomci na brojevnoj polupravoj ════════════════
  L('Razlomci na brojevnoj polupravoj');

  Z(1, 'Kom razlomku odgovara tačka $A$ na brojevnoj polupravoj?',
    ['${3|5}$', '${3|4}$', '${4|5}$', '${5|3}$'],
    [K('Duž od $0$ do $1$ podeljena je na $5$ jednakih delova – svaki je ${1|5}$.'),
     K('Do tačke $A$ ima $3$ takva dela: ${3|5}$.', ['s'])],
    G({ A: [0.6, 0, 90] }, [osa(0, 1.2, 5), { tacka: 'A' }, ...skokovi(0, 0.2, 3, { h: 0.12, k: 2, id: 's', razmak: 0.4 })], { velicina: 260 }));

  Z(1, 'Kojoj tački na slici odgovara broj ${5|2}$?',
    ['$R$', '$P$', '$Q$', '$S$'],
    [K('${5|2} = 2{1|2}$ – između $2$ i $3$, tačno na pola.'),
     K('To je tačka $R$.', ['s'])],
    G({ P: [0.5, 0, 90], Q: [1.5, 0, 90], R: [2.5, 0, 90], S: [3.5, 0, 90] }, [osa(0, 4, 2), { tacka: 'PQRS' }, ...skokovi(0, 0.5, 5, { h: 0.25, k: 2, id: 's', razmak: 0.35 })], { velicina: 280 }));

  Z(2, 'Kom razlomku odgovara tačka $B$?',
    ['${7|4}$', '${3|4}$', '${7|5}$', '${4|7}$'],
    [K('Svaki ceo deo podeljen je na $4$ jednaka dela – podeoci su četvrtine.'),
     K('Od nule do $B$: $4$ četvrtine do broja $1$, pa još $3$ – ukupno $7$ četvrtina: ${7|4} = 1{3|4}$.', ['s'])],
    G({ B: [1.75, 0, 90] }, [osa(0, 2.5, 4), { tacka: 'B' }, ...skokovi(0, 0.25, 7, { h: 0.12, k: 2, id: 's', razmak: 0.25 })], { velicina: 280 }));

  Z(2, 'Kom broju odgovara tačka koja je tačno na sredini između brojeva $3$ i $4$?',
    ['${7|2}$', '${3|4}$', '${7|4}$', '${4|3}$'],
    [K('Sredina između $3$ i $4$ je $3{1|2}$.', ['m']),
     K('$3{1|2} = {6|2} + {1|2} = {7|2}$.')],
    G({ M: [3.5, 0, 90] }, [osa(0, 5, 2), { tacka: 'M', k: 1, id: 'm' }, skok(3, 3.5, { h: 0.5, k: 1 }), skok(4, 3.5, { h: 0.5, k: 1, boja: 2 })], { velicina: 260 }));

  Z(2, 'Da li su tačke koje odgovaraju brojevima ${2|3}$ i ${4|3}$ jednako udaljene od tačke $1$?',
    ['da, obe su udaljene ${1|3}$', 'ne, ${4|3}$ je dalje', 'ne, ${2|3}$ je dalje', 'da, obe su udaljene ${2|3}$'],
    [K('$1 = {3|3}$. Od ${2|3}$ do ${3|3}$ je jedna trećina.', ['a']),
     K('Od ${3|3}$ do ${4|3}$ je takođe jedna trećina – jednako su udaljene.', ['b'])],
    G({ A: [2 / 3, 0, 90], B: [4 / 3, 0, 90] }, [osa(0, 2, 3), { tacka: 'AB' }, skok(2 / 3, 1, { h: 0.2, k: 1, id: 'a' }), skok(4 / 3, 1, { h: 0.2, k: 2, id: 'b', boja: 2 })], { bezImena: ['A', 'B'], velicina: 260 }));

  Z(2, 'Žaba skače po brojevnoj polupravoj od nule, svaki skok je dug ${3|4}$. Gde je posle $6$ skokova?',
    ['$4{1|2}$', '$4{3|4}$', '$6{3|4}$', '$3{1|2}$'],
    [K('$6$ skokova po ${3|4}$ je $6 · 3 = 18$ četvrtina: ${18|4}$.', ['s']),
     K('${18|4} = 4{2|4} = 4{1|2}$.')],
    G({}, [osa(0, 5, 4), ...skokovi(0, 0.75, 6, { h: 0.4, k: 1, id: 's', razmak: 0.45 })], { ...bez, velicina: 300 }));

  Z(2, 'Koliko ima tačaka između $0$ i $3$ (ne računajući $0$ i $3$) koje odgovaraju razlomcima sa imeniocem $4$?',
    ['$11$', '$12$', '$3$', '$9$'],
    [K('To su ${1|4}, {2|4}, …, {11|4}$ (jer je $3 = {12|4}$).'),
     K('Brojioci od $1$ do $11$: ukupno $11$ tačaka.', ['t'])],
    G({}, [osa(0, 3, 4), ...[...Array(11)].map((_, i) => ({ tx: '●', at: [(i + 1) / 4, 0.05], b: 1, k: 2, id: 't' }))], { ...bez, velicina: 280 }));

  Z(3, 'Na polupravoj podeljenoj na šestine, koliko podeoka ima između tačaka ${1|2}$ i ${5|3}$?',
    ['$7$', '$4$', '$6$', '$3$'],
    [K('U šestinama: ${1|2} = {3|6}$ i ${5|3} = {10|6}$.'),
     K('Od $3$ do $10$ šestina: $10 − 3 = 7$ koraka po ${1|6}$.', ['s'])],
    G({ A: [0.5, 0, 90], B: [5 / 3, 0, 90] }, [osa(0, 2, 6), { tacka: 'AB' }, ...skokovi(0.5, 1 / 6, 7, { h: 0.12, k: 2, id: 's', razmak: 0.3 })], { bezImena: ['A', 'B'], velicina: 280 }));

  Z(3, 'Koji od razlomaka ${7|8}$, ${4|5}$, ${9|10}$, ${2|3}$ je najbliži broju $1$?',
    ['${9|10}$', '${7|8}$', '${4|5}$', '${2|3}$'],
    [K('Gledamo koliko im fali do $1$: ${1|8}$, ${1|5}$, ${1|10}$, ${1|3}$.'),
     K('Najmanje fali ${9|10}$ – samo ${1|10}$ (manji deo jer je celina podeljena na više delova).', ['n'])],
    G({}, [osa(0.6, 1, 120, { svaki: 120, brojevi: 0 }), { tx: '1', at: [1, -0.04] }, ...[[7 / 8, '7/8', 0, 0.05], [4 / 5, '4/5', 2, 0.05], [9 / 10, '9/10', 1, -0.07], [2 / 3, '2/3', 5, 0.05]].map(([x, t, b, y]) => [{ tx: t, at: [x, y], b, ...(t === '9/10' ? { id: 'n' } : {}) }, { tx: '●', at: [x, 0], b }]).flat()], { ...bez, velicina: 300 }));

  // ════════════════ 4.3 Proširivanje, skraćivanje, upoređivanje ════════════════
  L('Proširivanje, skraćivanje i upoređivanje razlomaka');

  Z(1, 'Koji broj treba upisati: ${3|4} = {?|12}$?',
    ['$9$', '$11$', '$3$', '$4$'],
    [K('Imenilac se povećao $3$ puta ($4 · 3 = 12$) – proširujemo sa $3$.'),
     K('Svaku četvrtinu delimo na $3$ dela: brojilac $3 · 3 = 9$.', [], g([...pica(12, 9, { cx: 0 }), ...pica(4, 0, { cx: 0, b: 0 }).map((x) => ({ ...x, prazno: 1, b: 3, debljina: 4 }))], 160))],
    g(pica(4, 3), 160));

  Z(1, 'Skrati razlomak ${24|42}$ do kraja.',
    ['${4|7}$', '${12|21}$', '${8|14}$', '${2|3}$'],
    [K('$NZD(24, 42) = 6$.'),
     K('${24|42} = {24 : 6|42 : 6} = {4|7}$ (nesvodljiv: $4$ i $7$ su uzajamno prosti).')]);

  Z(1, 'Koji razlomak je jednak ${2|3}$?',
    ['${10|15}$', '${4|9}$', '${3|4}$', '${12|15}$'],
    [K('Proširujemo ${2|3}$ sa $5$: ${10|15}$ ✓'),
     K('${4|9}$: imenilac proširen sa $3$, brojilac sa $2$ ✗. ${12|15} = {4|5}$ ✗.')],
    g([...traka(3, 2, { w: 9 }), ...traka(15, 10, { y: -1.8, w: 9, k: 1 })], 260));

  Z(2, 'Uporedi ${5|6}$ i ${7|9}$.',
    ['${5|6} > {7|9}$', '${5|6} < {7|9}$', '${5|6} = {7|9}$', 'ne mogu se uporediti'],
    [K('$NZS(6, 9) = 18$: ${5|6} = {15|18}$, ${7|9} = {14|18}$.'),
     K('$15 > 14$, pa je ${5|6} > {7|9}$.', ['a'])],
    g([...traka(6, 5, { w: 9, id: 'a' }), ...traka(9, 7, { y: -1.8, w: 9, b: 2 })], 260));

  Z(2, 'Poređaj od najmanjeg: ${3|4}$, ${5|6}$, ${7|9}$.',
    ['${3|4} < {7|9} < {5|6}$', '${3|4} < {5|6} < {7|9}$', '${7|9} < {3|4} < {5|6}$', '${5|6} < {7|9} < {3|4}$'],
    [K('$NZS(4, 6, 9) = 36$.'),
     K('${3|4} = {27|36}$, ${5|6} = {30|36}$, ${7|9} = {28|36}$.'),
     K('$27 < 28 < 30$: ${3|4} < {7|9} < {5|6}$.')]);

  Z(2, 'Jedan radnik je uradio ${3|8}$ posla, a drugi ${5|12}$. Ko je uradio više?',
    ['drugi', 'prvi', 'jednako su uradili', 'ne može se odrediti'],
    [K('$NZS(8, 12) = 24$: ${3|8} = {9|24}$, ${5|12} = {10|24}$.'),
     K('$10 > 9$ – drugi je uradio više (za ${1|24}$ posla).')]);
  proveri(3 * 24 / 8 === 9 && 5 * 24 / 12 === 10, 'radnici');

  Z(2, 'Šta se dešava sa razlomkom ${1|2}$ ako brojiocu i imeniocu dodamo $1$?',
    ['poveća se na ${2|3}$', 'ostaje isti', 'smanji se', 'postaje $1$'],
    [K('${1 + 1|2 + 1} = {2|3}$.'),
     K('${1|2} = {3|6}$, ${2|3} = {4|6}$ – vrednost se promenila (povećala). Dodavanje nije isto što i proširivanje!')],
    g([...traka(2, 1, { w: 6 }), ...traka(3, 2, { y: -1.8, w: 6, k: 1 })], 220));

  Z(2, 'Koji razlomak sa imeniocem $12$ je između ${1|3}$ i ${1|2}$?',
    ['${5|12}$', '${3|12}$', '${7|12}$', '${4|12}$'],
    [K('${1|3} = {4|12}$, ${1|2} = {6|12}$.'),
     K('Između je ${5|12}$.', ['t'])],
    G({}, [osa(0, 1, 12, { svaki: 12 }), { tx: '1/3', at: [1 / 3, 0.12], b: 0 }, { tx: '1/2', at: [0.5, 0.12], b: 0 }, { tx: '●', at: [5 / 12, 0.0], b: 1, k: 2, id: 't' }], { ...bez, velicina: 280 }));

  Z(3, 'Koji je najveći od razlomaka ${10|11}$, ${11|12}$, ${12|13}$, ${13|14}$?',
    ['${13|14}$', '${10|11}$', '${11|12}$', 'svi su jednaki'],
    [K('Svakom fali tačno jedan deo do celog: ${1|11}$, ${1|12}$, ${1|13}$, ${1|14}$.'),
     K('Najmanje fali ${13|14}$ (jer je ${1|14}$ najmanji deo), pa je on najveći.')]);

  Z(3, 'Koliko ima razlomaka oblika ${1|n}$ koji su veći od ${1|7}$, a manji od ${1|2}$?',
    ['$4$', '$5$', '$6$', '$3$'],
    [K('${1|n}$ je veći što je $n$ manji. Treba $2 < n < 7$.'),
     K('$n = 3, 4, 5, 6$: četiri razlomka.')]);

  // ════════════════ 4.4 Decimalni zapis ════════════════
  L('Decimalni zapis razlomka');

  Z(1, 'Na boci piše $0,75 l$. Koji je to razlomak litra?',
    ['${3|4}$', '${7|5}$', '${75|10}$', '${1|75}$'],
    [K('$0,75 = {75|100}$.', ['s']),
     K('Skraćujemo sa $25$: ${3|4}$ litra.')],
    g([...sto(75, { id: 's' })], 160));

  Z(1, 'Zapiši ${3|5}$ u decimalnom zapisu.',
    ['$0,6$', '$0,35$', '$3,5$', '$0,53$'],
    [K('Proširimo do desetina: ${3|5} = {6|10}$.', ['d']),
     K('${6|10} = 0,6$.')],
    g([...traka(5, 3, { w: 10 }), ...traka(10, 6, { y: -1.8, w: 10, k: 1, id: 'd' })], 260));

  Z(1, 'Koliko metara je $80 cm$?',
    ['$0,8 m$', '$0,08 m$', '$8 m$', '$80,0 m$'],
    [K('$1 m = 100 cm$, pa je $80 cm = {80|100} m$.'),
     K('${80|100} = 0,80 = 0,8 m$.')]);

  Z(2, 'Zapiši ${7|20}$ u decimalnom zapisu.',
    ['$0,35$', '$0,72$', '$7,2$', '$0,7$'],
    [K('Proširimo sa $5$ do stotih delova: ${7|20} = {35|100}$.'),
     K('${35|100} = 0,35$ – $35$ kvadratića od $100$.', ['s'])],
    g(sto(35, { k: 2, id: 's' }), 160));

  Z(2, 'Zapiši ${5|8}$ u decimalnom zapisu.',
    ['$0,625$', '$0,58$', '$1,6$', '$0,85$'],
    [K('$8 · 125 = 1 000$, pa proširujemo sa $125$: ${5|8} = {625|1000}$.'),
     K('$= 0,625$. (Ili deljenjem: $5 : 8 = 0,625$.)')]);

  Z(2, 'Zapiši $0,0005$ kao skraćen razlomak.',
    ['${1|2000}$', '${5|1000}$', '${1|200}$', '${1|20}$'],
    [K('$0,0005 = {5|10000}$ (četiri decimale – desethiljaditi delovi).'),
     K('Skraćujemo sa $5$: ${1|2000}$.')]);

  Z(2, 'Koji je decimalni zapis razlomka ${2|9}$?',
    ['$0,222…$', '$0,29$', '$2,9$', '$0,2$'],
    [K('Delimo $2 : 9$: $20 : 9 = 2$ (ostatak $2$), pa opet $20 : 9 = 2$ …'),
     K('Ostatak se stalno ponavlja, pa se ponavlja i cifra $2$: $0,222… $ (periodičan zapis).')]);

  Z(3, 'Koliko cifara ima period decimalnog zapisa razlomka ${1|7}$?',
    ['$6$', '$1$', '$7$', '$3$'],
    [K('$1 : 7 = 0,142857142857…$'),
     K('Ostaci pri deljenju su $3, 2, 6, 4, 5, 1$, pa opet $3$ – posle $6$ koraka se ponavljaju.'),
     K('Period $142857$ ima $6$ cifara. (Kod ${1|3} = 0,333…$ period ima $1$ cifru.)')]);

  Z(3, 'Koliko metara je $1,3 cm$?',
    ['$0,013 m$', '$0,13 m$', '$13 m$', '$0,0013 m$'],
    [K('$1 cm = {1|100} m = 0,01 m$.'),
     K('$1,3 cm = 1,3 : 100 m = 0,013 m$ (zarez se pomera za dva mesta ulevo).')]);

  Z(1, 'Zapiši $74,3$ kao razlomak.',
    ['${743|10}$', '${743|100}$', '${74|3}$', '${7 430|10}$'],
    [K('Jedna decimala – desetine: $74,3 = 74 + {3|10}$.'),
     K('$= {740|10} + {3|10} = {743|10}$.')]);

  // ════════════════ 4.5 Upoređivanje i zaokrugljivanje ════════════════
  L('Upoređivanje i zaokrugljivanje decimalnih brojeva');

  Z(1, 'Koji je najmanji od brojeva $1,1$; $1,05$; $1,15$; $1,5$?',
    ['$1,05$', '$1,1$', '$1,15$', '$1,5$'],
    [K('Dopišemo nule da svi imaju dve decimale: $1,10$; $1,05$; $1,15$; $1,50$.'),
     K('Najmanji je $1,05$.', ['m'])],
    G({}, [osa(1, 1.6, 20, { svaki: 2 }), ...[[1.05, 1], [1.1, 0], [1.15, 2], [1.5, 5]].map(([x, b]) => ({ tx: '●', at: [x, 0.0], b, k: 2, id: x === 1.05 ? 'm' : 'x' }))], { ...bez, velicina: 280 }));

  Z(1, 'Koji je broj veći: $2,53$ ili $2,530$?',
    ['jednaki su', '$2,530$', '$2,53$', 'ne mogu se uporediti'],
    [K('Nula na kraju decimalnog dela ne menja vrednost: $2,530 = 2 + {530|1000} = 2 + {53|100} = 2,53$.')]);

  Z(1, 'Zaokrugli $7,245$ na dve decimale.',
    ['$7,25$', '$7,24$', '$7,2$', '$7,3$'],
    [K('Gledamo treću decimalu: $5$. Kad je $5$ ili više, zaokrugljujemo naviše.'),
     K('$7,245 ≈ 7,25$ (tačno je na sredini, a po pravilu ide naviše).', ['t'])],
    G({}, [osa(7.24, 7.25, 1000, { svaki: 5 }), { tx: '●', at: [7.245, 0], b: 1, id: 't' }, skok(7.245, 7.25, { h: 0.002, k: 2 })], { ...bez, velicina: 280 }));

  Z(1, 'Koji je najveći od brojeva $3$; $3,3$; $0,3$; $0,03$?',
    ['$3,3$', '$3$', '$0,3$', '$0,03$'],
    [K('Prvo upoređujemo cele delove: $3$ i $3,3$ imaju po $3$ cela, a $0,3$ i $0,03$ nula.'),
     K('$3,3 = 3,30 > 3,00$ – najveći je $3,3$.')]);

  Z(2, 'Zaokrugli $7,054321539$ na $6$ decimala.',
    ['$7,054322$', '$7,054321$', '$7,054320$', '$7,05432$'],
    [K('Šesta decimala je $1$ ($7,054321…$), a sedma je $5$.'),
     K('Sedma decimala je $5$ – šestu povećavamo: $7,054322$.')]);

  Z(2, 'Podeli $2 : 3$ i zaokrugli količnik na tri decimale.',
    ['$0,667$', '$0,666$', '$0,67$', '$1,5$'],
    [K('$2 : 3 = 0,6666…$'),
     K('Četvrta decimala je $6 ≥ 5$, pa je $0,667$.')]);

  Z(2, 'Tačka $T$ je na brojevnoj pravoj između $2,3$ i $2,4$ (deo je podeljen na $10$ jednakih delova). Koji broj joj odgovara?',
    ['$2,37$', '$2,7$', '$2,307$', '$2,47$'],
    [K('Između $2,3$ i $2,4$ je $10$ podeoka – svaki je $0,01$.'),
     K('$T$ je na sedmom podeoku: $2,30 + 0,07 = 2,37$.', ['s'])],
    G({ T: [2.37, 0, 90] }, [osa(2.3, 2.4, 100, { svaki: 10 }), { tacka: 'T' }, ...skokovi(2.3, 0.01, 7, { h: 0.006, k: 2, id: 's', razmak: 0.25 })], { velicina: 300 }));

  Z(2, 'Koliko ima brojeva sa tačno dve decimale između $3,4$ i $3,5$?',
    ['$9$', '$10$', '$11$', '$99$'],
    [K('To su $3,41; 3,42; …; 3,49$ (bez $3,40$ i $3,50$ – oni imaju jednu decimalu, a i granice nisu uključene).'),
     K('Ukupno $9$ brojeva.')]);

  Z(3, 'Koji je najveći broj sa dve decimale koji zaokrugljen na jednu decimalu daje $5,3$?',
    ['$5,34$', '$5,35$', '$5,39$', '$5,30$'],
    [K('Na $5,3$ se zaokrugljuju brojevi od $5,25$ do $5,34…$'),
     K('$5,35$ bi se zaokružio na $5,4$. Najveći sa dve decimale je $5,34$.')],
    G({}, [osa(5.2, 5.4, 100, { svaki: 10 }), { lin: [[5.25, 0.01], [5.3449, 0.01]], b: 2, debljina: 6, k: 1, crtaj: 1 }, { tx: '●', at: [5.34, 0.0], b: 1, k: 2 }], { ...bez, velicina: 300 }));

  Z(3, 'Trećina litra soka je najpribližnija kojoj količini?',
    ['$333 ml$', '$330 ml$', '$334 ml$', '$300 ml$'],
    [K('$1 l = 1 000 ml$, a $1 000 : 3 = 333,33… ml$.'),
     K('Najbliže je $333 ml$ (razlika samo $0,33 ml$; do $334$ je $0,67 ml$).')]);

  // ════════════════ dopune ════════════════
  L('Razlomci na brojevnoj polupravoj');
  Z(1, 'Kom razlomku sa imeniocem $3$ odgovara tačka $C$?',
    ['${7|3}$', '${2|3}$', '${5|3}$', '${3|7}$'],
    [K('Svaki ceo deo je podeljen na $3$ dela – trećine.'),
     K('Do $C$: $2$ cela ($6$ trećina) i još $1$ – ukupno ${7|3} = 2{1|3}$.', ['s'])],
    G({ C: [7 / 3, 0, 90] }, [osa(0, 3, 3), { tacka: 'C' }, ...skokovi(0, 1 / 3, 7, { h: 0.15, k: 2, id: 's', razmak: 0.25 })], { velicina: 280 }));
};
