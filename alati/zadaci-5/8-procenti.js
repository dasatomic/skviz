// Tema 8: Razlomci – treći deo: procenti, razmera, aritmetička sredina (lekcije 8.1–8.2)
module.exports = ({ L, Z, K, G, O, bez, r, proveri, sto, traka, stubici, kruzni }) => {
  const g = (e, vel = 200) => G(O, e, { ...bez, velicina: vel });
  const jed = (a, b) => Math.abs(a - b) < 1e-9;
  // stubičasti dijagram sa isprekidanom linijom proseka (pojavljuje se u koraku k)
  const saProsekom = (podaci, prosek, k, x = {}) => {
    const d = stubici(podaci, x);
    const n = podaci.length, W = Math.max(8, n * 1.6), sy = (x.visina || 6) / (x.maxY ?? Math.max(...podaci.map((p) => p[1])));
    d.e.push({ lin: [[0, r(prosek * sy)], [W, r(prosek * sy)]], b: 1, debljina: 3, k, crtaj: 1, id: 'pr' });
    return d;
  };

  // ════════════════ 8.1 Procenti ════════════════
  L('Procenti i primena procenata');

  Z(1, 'Koliko procenata mreže je obojeno?',
    ['$37 %$', '$63 %$', '$3,7 %$', '$73 %$'],
    [K('Mreža ima $100$ kvadratića, a „procenat“ znači „od sto“.'),
     K('Obojeno je $37$ kvadratića: $37 %$.')],
    g(sto(37), 170));

  Z(1, 'Koliko je $25 %$ od $80$?',
    ['$20$', '$25$', '$320$', '$55$'],
    [K('$25 % = {25|100} = {1|4}$.'),
     K('${1|4}$ od $80$: $80 : 4 = 20$.', ['c'])],
    g([...traka(4, 1, { w: 8, k: 1, id: 'c' }), ...traka(4, 0, { w: 8 }), { tx: '80', at: [4, -0.6] }], 240));

  Z(1, 'Razlomak ${3|4}$ zapisan u procentima je:',
    ['$75 %$', '$34 %$', '$0,75 %$', '$43 %$'],
    [K('Proširimo do stotih delova: ${3|4} = {75|100}$.'),
     K('$= 75 %$.', ['s'])],
    g(sto(75, { k: 2, id: 's' }), 170));

  Z(2, 'Patike koštaju $2 400$ dinara, a na sniženju su $15 %$ jeftinije. Kolika je nova cena?',
    ['$2 040$ din', '$360$ din', '$2 385$ din', '$2 760$ din'],
    [K('$15 %$ od $2 400$: $2 400 : 100 · 15 = 24 · 15 = 360$ dinara.'),
     K('Nova cena: $2 400 − 360 = 2 040$ dinara (to je $85 %$ stare cene).')]);

  Z(2, 'Karta za bioskop od $1 500$ dinara poskupi za $10 %$. Kolika je nova cena?',
    ['$1 650$ din', '$1 510$ din', '$150$ din', '$1 600$ din'],
    [K('$10 %$ od $1 500$ je $150$.'),
     K('Nova cena: $1 500 + 150 = 1 650$ dinara.')]);

  Z(2, 'Od $24$ učenika, $18$ je rešilo zadatak. Koliko je to procenata?',
    ['$75 %$', '$18 %$', '$6 %$', '$80 %$'],
    [K('Deo: ${18|24} = {3|4}$.'),
     K('${3|4} = {75|100} = 75 %$.')]);

  Z(2, '$20 %$ nekog broja je $14$. Koji je to broj?',
    ['$70$', '$2,8$', '$28$', '$34$'],
    [K('$20 % = {1|5}$: petina broja je $14$.'),
     K('Ceo broj: $5 · 14 = 70$.', ['t'])],
    g([...traka(5, 1, { w: 8 }), { tx: '14', at: [0.8, 0.6] }, ...[1, 2, 3, 4].map((i) => ({ tx: '14', at: [0.8 + i * 1.6, 0.6], k: 2, id: 't' }))], 240));

  Z(2, 'Na kružnom dijagramu je prikazano koji sport vole učenici jednog razreda ($40$ učenika). Fudbal $40 %$, košarka $25 %$, odbojka $20 %$, ostalo $15 %$. Koliko učenika voli odbojku?',
    ['$8$', '$20$', '$10$', '$6$'],
    [K('$20 %$ od $40$ je ${1|5}$ od $40$.'),
     K('$40 : 5 = 8$ učenika.', ['k2'])],
    kruzni([['~fudbal', 40], ['~košarka', 25], ['~odbojka', 20], ['~ostalo', 15]]));

  Z(3, 'Cena se snizi za $20 %$, a zatim nova cena još za $10 %$. Za koliko procenata je ukupno snižena prvobitna cena?',
    ['$28 %$', '$30 %$', '$32 %$', '$2 %$'],
    [K('Uzmimo cenu $100$ dinara. Posle $20 %$: $80$ dinara.'),
     K('$10 %$ od $80$ je $8$: nova cena $72$ dinara.'),
     K('Ukupno sniženje: $100 − 72 = 28$ dinara, tj. $28 %$ (a ne $30 %$ – drugi popust se računa od manje cene).')]);

  Z(3, 'Koliko je $0,5 %$ od $2 000$?',
    ['$10$', '$100$', '$1 000$', '$1$'],
    [K('$1 %$ od $2 000$ je $20$.'),
     K('$0,5 %$ je pola toga: $10$.')]);

  // ════════════════ 8.2 Razmera; aritmetička sredina ════════════════
  L('Razmera; aritmetička sredina');

  Z(1, 'Skrati razmeru $12 : 18$.',
    ['$2 : 3$', '$3 : 2$', '$6 : 9$', '$4 : 6$'],
    [K('$NZD(12, 18) = 6$.'),
     K('$12 : 18 = 2 : 3$ (kao razlomak ${12|18} = {2|3}$).')]);

  Z(1, 'Ocene učenika su $4, 5, 3, 5, 4$. Kolika je aritmetička sredina?',
    ['$4,2$', '$4$', '$21$', '$4,5$'],
    [K('Zbir: $4 + 5 + 3 + 5 + 4 = 21$.'),
     K('Sredina: $21 : 5 = 4,2$ – „poravnati“ stubići.', ['pr'])],
    saProsekom([['1', 4], ['2', 5], ['3', 3], ['4', 5], ['5', 4]], 4.2, 2, { maxY: 5 }));

  Z(1, 'Temperature u podne četiri dana bile su $12°$, $15°$, $9°$ i $14°$. Kolika je prosečna temperatura?',
    ['$12,5°$', '$12°$', '$50°$', '$13°$'],
    [K('Zbir: $12 + 15 + 9 + 14 = 50$.'),
     K('Prosek: $50 : 4 = 12,5°$.', ['pr'])],
    saProsekom([['~P', 12], ['~U', 15], ['~S', 9], ['~Č', 14]], 12.5, 2, { korakY: 5, maxY: 15 }));

  Z(2, 'Na karti razmere $1 : 50 000$ dva mesta su udaljena $4 cm$. Kolika je stvarna udaljenost?',
    ['$2 km$', '$200 m$', '$20 km$', '$12 500 m$'],
    [K('$1 cm$ na karti je $50 000 cm$ u prirodi, tj. $500 m$.'),
     K('$4 cm$ → $4 · 500 m = 2 000 m = 2 km$.')]);

  Z(2, 'Podeli $35$ jabuka na dva dela u razmeri $2 : 5$. Koliki je veći deo?',
    ['$25$', '$10$', '$14$', '$21$'],
    [K('Ukupno je $2 + 5 = 7$ jednakih delova: jedan deo je $35 : 7 = 5$.', ['t']),
     K('Veći deo: $5 · 5 = 25$ (manji $10$).')],
    g([...traka(7, 2, { w: 7 }), ...traka(7, [2, 3, 4, 5, 6], { w: 7, b: 2 }), ...[...Array(7)].map((_, i) => ({ tx: '5', at: [0.5 + i, 0.6], k: 1, id: 't' })), { tx: '35', at: [3.5, -0.6] }], 240));

  Z(2, 'Ocene na prva četiri testa su $5$, $3$, $5$ i $4$. Koju ocenu treba dobiti na petom da prosek bude tačno $4$?',
    ['$3$', '$4$', '$5$', '$2$'],
    [K('Za prosek $4$ od $5$ ocena zbir mora biti $5 · 4 = 20$.'),
     K('Do sada: $5 + 3 + 5 + 4 = 17$. Treba još $20 − 17 = 3$.')]);

  Z(2, 'Sok i voda se mešaju u razmeri $1 : 4$. Koliko se dobije napitka od $2 l$ soka?',
    ['$10 l$', '$8 l$', '$6 l$', '$2,5 l$'],
    [K('Na $1$ deo soka idu $4$ dela vode: na $2 l$ soka – $8 l$ vode.'),
     K('Napitak: $2 + 8 = 10 l$.')]);

  Z(2, 'Aritmetička sredina tri broja je $20$. Dva broja su $18$ i $25$. Koji je treći?',
    ['$17$', '$20$', '$23$', '$43$'],
    [K('Zbir tri broja: $3 · 20 = 60$.'),
     K('Treći: $60 − 18 − 25 = 17$.')]);

  Z(3, 'Stranice pravougaonika su u razmeri $3 : 2$, a obim je $40 cm$. Kolika je površina?',
    ['$96 cm²$', '$24 cm²$', '$384 cm²$', '$100 cm²$'],
    [K('Polovina obima: $a + b = 20 cm$, a to je $3 + 2 = 5$ delova po $4 cm$.'),
     K('$a = 12 cm$, $b = 8 cm$, $P = 12 · 8 = 96 cm²$.', ['p'])],
    G({ A: [0, 0], B: [6, 0], C: [6, 4], D: [0, 4] }, [{ p: 'ABCD', b: 0 }, { lin: [[2, -0.25], [2, 0.25]], b: 3, k: 1 }, { lin: [[4, -0.25], [4, 0.25]], b: 3, k: 1 }, { lin: [[5.75, 2], [6.25, 2]], b: 3, k: 1 }, { d: 'AB', o: '~3 dela' }, { d: 'BC', o: '~2 dela' }, { p: 'ABCD', b: 2, gusto: 1, k: 2, id: 'p' }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 200 }));

  Z(3, 'Prosek pet brojeva je $10$. Kad im dodamo još jedan broj, prosek postane $11$. Koji broj je dodat?',
    ['$16$', '$11$', '$21$', '$1$'],
    [K('Zbir pet brojeva: $5 · 10 = 50$.'),
     K('Zbir šest brojeva: $6 · 11 = 66$. Dodat je $66 − 50 = 16$.')]);
};
