// Tema 7: Površina trougla i četvorougla (lekcije 7.1–7.6, u kvizu 43–48).
// Sopstveni brojevi; crteži su medij „geo“: karirani papir, „seci i premesti“, okrenute kopije, opisani pravougaonik.
module.exports = ({ L, Z, K, G, proveri }) => {
  const sh = (P) => Math.abs(P.reduce((s, [x, y], i) => { const [x2, y2] = P[(i + 1) % P.length]; return s + x * y2 - x2 * y; }, 0)) / 2;
  const blizu = (a, b) => Math.abs(a - b) < 1e-9;
  const V = ({ t, ...x } = {}) => ({ velicina: 250, ...x });
  // karirani papir
  const kv = (x0, x1, y0, y1) => {
    const e = [];
    for (let x = x0; x <= x1; x++) e.push({ lin: [[x, y0], [x, y1]], b: 4, debljina: 0.6 });
    for (let y = y0; y <= y1; y++) e.push({ lin: [[x0, y], [x1, y]], b: 4, debljina: 0.6 });
    return e;
  };
  const lik = (pts, x = {}) => ({ lin: pts, zatv: 1, b: 1, ...x });
  const pr = (x, y, w, h, o = {}) => lik([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], o);
  const tx = (t, at, x = {}) => ({ tx: t, at, ...x });

  // ════════════════ 7.1 Pojam površine; merenje površine ════════════════
  L('Pojam površine; merenje površine');

  proveri(5 * 2 + 2 * 2 === 14 && sh([[0, 0], [5, 0], [5, 2], [2, 2], [2, 4], [0, 4]]) === 14, 'L-figura 14');
  Z(1, 'Stranica kvadratića mreže je $1 cm$. Kolika je površina figure?',
    ['$14 cm²$', '$20 cm²$', '$18 cm²$', '$10 cm²$'],
    [K('Figuru razložimo na dva pravougaonika. Donji: $5 · 2 = 10 cm²$.', ['d']),
     K('Gornji: $2 · 2 = 4 cm²$.', ['g']),
     K('$P = 10 + 4 = 14 cm²$. Provera: pravougaonik $5 × 4 = 20$ bez isečenog dela $3 × 2 = 6$ daje isto.', [], G({}, [...kv(0, 6, 0, 5), pr(0, 0, 5, 4, { b: 4, prazno: 1, isp: 1 }), lik([[0, 0], [5, 0], [5, 2], [2, 2], [2, 4], [0, 4]], { gusto: 1 }), pr(2, 2, 3, 2, { b: 3, gusto: 1 }), tx('20 − 6', [2.5, 1])], V()))],
    G({}, [...kv(0, 6, 0, 5), lik([[0, 0], [5, 0], [5, 2], [2, 2], [2, 4], [0, 4]], { b: 1 }), pr(0, 0, 5, 2, { b: 2, prazno: 1, id: 'd', k: 1 }), pr(0, 2, 2, 2, { b: 3, prazno: 1, id: 'g', k: 2 })], V()));

  proveri(3 * 100 === 300, '3 m² = 300 dm²');
  Z(1, 'Koliko kvadratnih decimetara ima $3 m²$?',
    ['$300 dm²$', '$30 dm²$', '$3 000 dm²$', '$3 dm²$'],
    [K('Kvadrat stranice $1 m = 10 dm$ podeljen je na $10$ redova po $10$ kvadratića od $1 dm²$.', ['m1']),
     K('Zato je $1 m² = 100 dm²$, a $3 m² = 3 · 100 dm² = 300 dm²$.'),
     K('Pri prelazu na sledeću manju jedinicu površine množimo sa $100$ (zarez dva mesta udesno).')],
    G({}, [...kv(0, 10, 0, 10).map((e) => ({ ...e, id: 'm1' })), pr(0, 0, 10, 10, { b: 0, prazno: 1 }), pr(11, 0, 10, 10, { b: 0, gusto: 1 }), pr(22, 0, 10, 10, { b: 0, gusto: 1 }),
      tx('1 m²', [16, 5], { vel: 20 }), tx('1 m²', [27, 5], { vel: 20 }), tx('10 dm', [5, -1]), tx('10 dm', [-1.6, 5])], V({ velicina: 330 })));

  proveri(25000 / 10000 === 2.5, '25 000 m² = 2,5 ha');
  Z(1, 'Koliko hektara ima njiva površine $25 000 m²$?',
    ['$2,5 ha$', '$25 ha$', '$250 ha$', '$0,25 ha$'],
    [K('Hektar je kvadrat stranice $100 m$: $1 ha = 100 · 100 m² = 10 000 m²$.', ['h1']),
     K('$25 000 : 10 000 = 2,5$, pa njiva ima $2,5 ha$ – dva cela hektara i još pola.', ['h1', 'h2', 'h3'])],
    G({}, [pr(0, 0, 4, 4, { b: 2, gusto: 1, id: 'h1' }), pr(4, 0, 4, 4, { b: 2, gusto: 1, id: 'h2', k: 2 }), pr(8, 0, 2, 4, { b: 2, gusto: 1, id: 'h3', k: 2 }), pr(0, 0, 10, 4, { b: 0, prazno: 1, k: 2 }), { lin: [[0, 0], [10, 4]], b: 0, debljina: 0.01 },
      tx('100 m', [2, -0.6]), tx('100 m', [-1.4, 2]), tx('1 ha', [2, 2], { vel: 20 })], V({ velicina: 300 })));

  proveri((3 * 10000) / 60 === 500, '3 ha na 60 parcela');
  Z(2, 'Livadu od $3 ha$ treba podeliti na $60$ jednakih parcela. Kolika je jedna parcela?',
    ['$500 m²$', '$50 m²$', '$5 000 m²$', '$5 a$ i $50 m²$'],
    [K('Prvo pretvorimo u kvadratne metre: $3 ha = 3 · 10 000 m² = 30 000 m²$.'),
     K('Delimo na $60$ delova: $30 000 : 60 = 500 m²$.', ['p']),
     K('To je baš $5$ ari ($1 a = 100 m²$).')],
    G({}, [...Array.from({ length: 60 }, (_, i) => pr((i % 10) * 0.8, Math.floor(i / 10) * 0.8, 0.8, 0.8, { b: 2, prazno: 1 })), pr(0, 4, 0.8, 0.8, { b: 1, gusto: 1, id: 'p', k: 2 }), tx('3 ha', [4, 5.4], { vel: 20 })], V({ velicina: 280 })));

  proveri((6 * 4) / 2 === 12, 'pravougli trougao 6 i 4');
  Z(2, 'Stranica kvadratića je $1 cm$. Kolika je površina trougla?',
    ['$12 cm²$', '$24 cm²$', '$10 cm²$', '$14 cm²$'],
    [K('Dopunimo trougao do pravougaonika $6 × 4$: on ima $24$ kvadratića.', ['pr']),
     K('Dijagonala deli pravougaonik na dva podudarna trougla, pa je trougao pola: $24 : 2 = 12 cm²$.', ['tr'])],
    G({}, [...kv(0, 7, 0, 5), pr(0, 0, 6, 4, { b: 4, prazno: 1, isp: 1, id: 'pr', k: 1 }), lik([[0, 0], [6, 0], [6, 4]], { b: 2, gusto: 1, k: 1 }), lik([[0, 0], [6, 4], [0, 4]], { b: 1, id: 'tr' })], V()));

  proveri(5 * 3 === 15, 'paralelogram na mreži');
  Z(2, 'Stranica kvadratića je $1 cm$. Kolika je površina paralelograma?',
    ['$15 cm²$', '$21 cm²$', '$18 cm²$', '$16 cm²$'],
    [K('Odsečemo pravougli trougao sa leve strane (ispod visine)…', ['t']),
     K('…i premestimo ga na desnu stranu. Dobili smo pravougaonik $5 × 3$.', ['t2']),
     K('$P = 5 · 3 = 15 cm²$ – isto kao osnovica puta visina.')],
    G({}, [...kv(0, 8, 0, 4), lik([[2, 0], [5, 0], [7, 3], [2, 3]], { b: 1, gusto: 1 }), lik([[0, 0], [2, 0], [2, 3]], { b: 2, gusto: 1, id: 't', kraj: 2 }),
      lik([[0, 0], [2, 0], [2, 3]], { b: 2, gusto: 1, id: 't2', k: 2, pomeri: [5, 0], kasni: 0.3 }), lik([[0, 0], [5, 0], [7, 3], [2, 3]], { b: 0, prazno: 1 })], V()));

  proveri(sh([[0, 0], [9, 0], [7, 4], [3, 4]]) === 26 && 16 + 6 + 4 === 26, 'trapez na mreži 26');
  Z(2, 'Stranica kvadratića je $1 cm$. Kolika je površina trapeza?',
    ['$26 cm²$', '$36 cm²$', '$22 cm²$', '$30 cm²$'],
    [K('Pravougaonik u sredini: $4 · 4 = 16 cm²$.', ['s']),
     K('Levi trougao je pola pravougaonika $3 × 4$: $6 cm²$. Desni je pola $2 × 4$: $4 cm²$.', ['l', 'd']),
     K('$P = 16 + 6 + 4 = 26 cm²$')],
    G({}, [...kv(0, 9, 0, 5), lik([[0, 0], [9, 0], [7, 4], [3, 4]], { b: 0 }), pr(3, 0, 4, 4, { b: 1, gusto: 1, id: 's', k: 1 }), lik([[0, 0], [3, 0], [3, 4]], { b: 2, gusto: 1, id: 'l', k: 2 }), lik([[7, 0], [9, 0], [7, 4]], { b: 3, gusto: 1, id: 'd', k: 2 })], V()));

  proveri(sh([[0, 2], [6, 0], [4, 5]]) === 13 && 30 - 6 - 5 - 6 === 13, 'trougao u pravougaoniku 6×5');
  Z(3, 'Stranica kvadratića je $1 cm$. Kolika je površina trougla čija su temena u čvorovima mreže?',
    ['$13 cm²$', '$15 cm²$', '$17 cm²$', '$11 cm²$'],
    [K('Trougao „upakujemo“ u pravougaonik $6 × 5 = 30 cm²$.', ['pr']),
     K('Oko trougla ostaju tri pravougla trougla: ${6 · 2|2} = 6$, ${2 · 5|2} = 5$ i ${4 · 3|2} = 6 cm²$.', ['t1', 't2', 't3']),
     K('$P = 30 − (6 + 5 + 6) = 13 cm²$')],
    G({}, [...kv(0, 6, 0, 5), pr(0, 0, 6, 5, { b: 4, prazno: 1, isp: 1, id: 'pr', k: 1 }), lik([[0, 0], [6, 0], [0, 2]], { b: 3, gusto: 1, id: 't1', k: 2 }), lik([[6, 0], [6, 5], [4, 5]], { b: 3, gusto: 1, id: 't2', k: 2 }), lik([[0, 2], [4, 5], [0, 5]], { b: 3, gusto: 1, id: 't3', k: 2 }), lik([[0, 2], [6, 0], [4, 5]], { b: 1 })], V()));

  proveri(0.35 * 100 * 100 === 3500, '0,35 km² = 3 500 a');
  Z(3, 'Koliko ari ima $0,35 km²$?',
    ['$3 500 a$', '$35 a$', '$350 a$', '$35 000 a$'],
    [K('Od $km²$ do ara su dva koraka: $1 km² = 100 ha$ i $1 ha = 100 a$.', ['s1', 's2']),
     K('$0,35 km² = 0,35 · 100 ha = 35 ha$.', ['s1']),
     K('$35 ha = 35 · 100 a = 3 500 a$. (Ukupno smo pomnožili sa $10 000$.)', ['s2'])],
    G({}, [tx('km²', [0, 0], { vel: 22 }), tx('ha', [4, 0], { vel: 22 }), tx('a', [8, 0], { vel: 22 }), tx('m²', [12, 0], { vel: 22 }),
      { lin: [[0.6, 0.5], [2, 1.1], [3.4, 0.5]], str: 1, b: 1, id: 's1' }, { lin: [[4.6, 0.5], [6, 1.1], [7.4, 0.5]], str: 1, b: 1, id: 's2' }, { lin: [[8.6, 0.5], [10, 1.1], [11.4, 0.5]], str: 1, b: 1 },
      tx('· 100', [2, 1.6]), tx('· 100', [6, 1.6]), tx('· 100', [10, 1.6])], V({ velicina: 300 })));

  proveri(6 * 2 + 2 * 4 === 20, 'slovo T');
  Z(1, 'Stranica kvadratića je $1 dm$. Kolika je površina slova T na slici?',
    ['$20 dm²$', '$24 dm²$', '$16 dm²$', '$12 dm²$'],
    [K('Gornja greda: $6 · 2 = 12 dm²$.', ['g']),
     K('Stub: $2 · 4 = 8 dm²$.', ['s']),
     K('$P = 12 + 8 = 20 dm²$')],
    G({}, [...kv(0, 7, 0, 7), lik([[0, 4], [6, 4], [6, 6], [0, 6]], { b: 1, gusto: 1, id: 'g' }), lik([[2, 0], [4, 0], [4, 4], [2, 4]], { b: 1, gusto: 1, id: 's' })], V()));

  // ════════════════ 7.2 Površina pravougaonika i kvadrata ════════════════
  L('Površina pravougaonika i kvadrata');
  const P4 = (a, b, oa, ob, e = [], x = {}) => G({ A: [0, 0], B: [a, 0], C: [a, b], D: [0, b] }, [{ p: 'ABCD', b: 0 }, ...(oa ? [{ d: 'AB', o: oa }] : []), ...(ob ? [{ d: 'BC', o: ob }] : []), ...e], V(x));

  proveri(12 * 18 === 216 && 2 * (12 + 18) === 60, 'pravougaonik 12 × 18');
  Z(1, 'Stranice pravougaonika su $18 cm$ i $12 cm$. Kolika je njegova površina?',
    ['$216 cm²$', '$60 cm²$', '$108 cm²$', '$30 cm²$'],
    [K('$P = a · b = 18 cm · 12 cm$'),
     K('$= 216 cm²$. (Broj $60$ je obim, $2 · (18 + 12)$, i meri se u centimetrima.)')],
    P4(9, 6, '18 cm', '12 cm'));

  proveri(10 / 4 === 2.5 && 2.5 * 2.5 === 6.25, 'obim 1 dm');
  Z(1, 'Obim kvadrata je $1 dm$. Kolika mu je površina?',
    ['$6,25 cm²$', '$25 cm²$', '$100 cm²$', '$2,5 cm²$'],
    [K('$1 dm = 10 cm$, pa je stranica $a = 10 : 4 = 2,5 cm$.', ['a']),
     K('$P = a² = 2,5 · 2,5 = 6,25 cm²$. ($100 cm²$ bi bila površina kvadrata stranice $1 dm$.)')],
    P4(5, 5, '', '', [{ tx: '?', at: [2.5, -0.5], kraj: 1 }, { tx: 'O = 1 dm', at: [2.5, 2.5], vel: 20 }, { d: 'AB', id: 'a', k: 1, b: 1, debljina: 4, o: '2,5 cm' }]));

  proveri(2 * (20 + 16) === 72 && 20 - 16 === 4 && 20 * 16 === 320, 'obim 72');
  Z(2, 'Obim pravougaonika je $72 cm$, a stranice mu se razlikuju za $4 cm$. Kolika je površina?',
    ['$320 cm²$', '$324 cm²$', '$288 cm²$', '$72 cm²$'],
    [K('Zbir dve susedne stranice je pola obima: $a + b = 36 cm$.'),
     K('Ako se razlikuju za $4$: $b + 4 + b = 36$, pa je $b = 16 cm$ i $a = 20 cm$.', ['r']),
     K('$P = 20 · 16 = 320 cm²$. ($324$ je površina kvadrata istog obima – uvek malo veća.)')],
    P4(10, 8, 'a', 'b', [{ lin: [[8, 0.15], [10, 0.15]], b: 1, debljina: 5, id: 'r', k: 2, o: '4 cm', oAt: [9, 0.8] }]));

  proveri(9 * 16 === 144 && 12 * 12 === 144 && 4 * 12 === 48 && 2 * (9 + 16) === 50, 'kvadrat = 9 × 16');
  Z(2, 'Kvadrat ima istu površinu kao pravougaonik $9 cm × 16 cm$. Koliki je obim kvadrata?',
    ['$48 cm$', '$50 cm$', '$144 cm$', '$52 cm$'],
    [K('Površina: $9 · 16 = 144 cm²$.'),
     K('Stranica kvadrata je broj koji pomnožen sam sobom daje $144$: $a = 12 cm$.', ['kv']),
     K('$O = 4 · 12 = 48 cm$ – manje od obima pravougaonika ($50 cm$).')],
    G({}, [...kv(0, 30, 0, 12).map((e) => ({ ...e, debljina: 0.3 })), pr(0, 0, 16, 9, { b: 1 }), pr(18, 0, 12, 12, { b: 0, id: 'kv', k: 2 }), tx('16 cm', [8, -0.9]), tx('9 cm', [-1.6, 4.5])], V({ velicina: 330 })));

  proveri(36 * 20 === 720 && 40 - 4 === 36 && 24 - 4 === 20, 'igralište u bazenu');
  Z(2, 'Bazen je dug $40 m$ i širok $24 m$. Igralište za vaterpolo je obeleženo tako da su mu ivice $2 m$ od ivica bazena. Kolika je površina igrališta?',
    ['$720 m²$', '$836 m²$', '$960 m²$', '$800 m²$'],
    [K('Sa svake strane se oduzima po $2 m$, dakle po $4 m$ od dužine i od širine.', ['ig']),
     K('Igralište: $36 m × 20 m$.'),
     K('$P = 36 · 20 = 720 m²$. (Greška $836$: oduzeto samo po $2 m$ – $38 · 22$.)')],
    G({ a: [0, 0], b: [40, 0], c: [40, 24], d: [0, 24], e: [2, 2], f: [38, 2], g: [38, 22], h: [2, 22] },
      [{ p: 'abcd', b: 0, gusto: 1 }, { p: 'efgh', b: 2, gusto: 1, id: 'ig' }, { d: 'ab', o: '40 m' }, { d: 'bc', o: '24 m' }, tx('2 m', [22, 23]), { lin: [[20, 22], [20, 24]], b: 3, debljina: 2 }], V({ velicina: 300 })));

  proveri(40 * 30 === 1200 && 2.5 * 2 === 5 && 1200 / 5 === 240, 'pločice 25 × 20');
  Z(2, 'Pod sobe $4 m × 3 m$ treba popločati pločicama $25 cm × 20 cm$. Koliko pločica treba?',
    ['$240$', '$24$', '$2 400$', '$120$'],
    [K('Sve u decimetre: pod je $40 dm × 30 dm = 1 200 dm²$.'),
     K('Pločica: $2,5 dm × 2 dm = 5 dm²$.', ['pl']),
     K('$1 200 : 5 = 240$ pločica. Provera po redovima: $400 : 25 = 16$ pločica u redu, $300 : 20 = 15$ redova, $16 · 15 = 240$.')],
    G({}, [pr(0, 0, 8, 6, { b: 0, prazno: 1 }), ...Array.from({ length: 16 }, (_, i) => pr(i * 0.5, 0, 0.5, 0.4, { b: 1, prazno: 1 })), pr(0, 0, 0.5, 0.4, { b: 1, gusto: 1, id: 'pl' }), tx('4 m', [4, -0.6]), tx('3 m', [8.7, 3])], V()));

  proveri((8 + 2) ** 2 - 8 ** 2 === 36 && 4 * 8 === 32, 'kvadrat +2 → +36');
  Z(3, 'Kad se stranica kvadrata produži za $2 cm$, površina se poveća za $36 cm²$. Koliki je obim početnog kvadrata?',
    ['$32 cm$', '$40 cm$', '$36 cm$', '$64 cm$'],
    [K('Povećanje čine dve trake $a × 2$ i kvadratić $2 × 2$.', ['t1', 't2', 'm']),
     K('$2a + 2a + 4 = 36$, pa je $4a = 32$.'),
     K('Obim početnog kvadrata je baš $4a = 32 cm$ (stranica $8 cm$). Provera: $10² − 8² = 100 − 64 = 36$.')],
    G({}, [pr(0, 0, 8, 8, { b: 0, gusto: 1 }), pr(8, 0, 2, 8, { b: 1, gusto: 1, id: 't1' }), pr(0, 8, 8, 2, { b: 1, gusto: 1, id: 't2' }), pr(8, 8, 2, 2, { b: 2, gusto: 1, id: 'm' }), tx('a', [4, -0.6]), tx('2', [9, -0.6]), tx('a', [4, 4])], V()));

  proveri(11 * 14 - 9 * 12 === 46 && 9 * 12 === 108, 'stranice +2 → +46');
  Z(3, 'Stranice pravougaonika se razlikuju za $3 cm$. Kad se obe produže za $2 cm$, površina se poveća za $46 cm²$. Kolika je bila površina?',
    ['$108 cm²$', '$154 cm²$', '$90 cm²$', '$130 cm²$'],
    [K('Povećanje čine dve trake ($b × 2$ i $a × 2$) i kvadratić $2 × 2$: $2b + 2a + 4 = 46$.', ['t1', 't2', 'm']),
     K('Zato je $a + b = 21$, a pošto je $a = b + 3$: $b = 9 cm$, $a = 12 cm$.'),
     K('$P = 12 · 9 = 108 cm²$. Provera: $14 · 11 − 108 = 154 − 108 = 46$ ✓')],
    G({}, [pr(0, 0, 12, 9, { b: 0, gusto: 1 }), pr(12, 0, 2, 9, { b: 1, gusto: 1, id: 't1' }), pr(0, 9, 12, 2, { b: 1, gusto: 1, id: 't2' }), pr(12, 9, 2, 2, { b: 2, gusto: 1, id: 'm' }), tx('a', [6, -0.8]), tx('b', [-0.8, 4.5]), tx('2', [13, -0.8])], V()));

  proveri(200 * 20 * 10 === 40000 && 40000 / 625 === 64, 'zamena pločica');
  Z(3, 'Za pod je potrebno $200$ pločica $20 cm × 10 cm$. Koliko kvadratnih pločica $25 cm × 25 cm$ treba za isti pod?',
    ['$64$', '$80$', '$128$', '$160$'],
    [K('Površina poda: $200 · 20 · 10 = 40 000 cm²$.', ['m']),
     K('Velika pločica: $25 · 25 = 625 cm²$.', ['v']),
     K('$40 000 : 625 = 64$ pločice.')],
    G({}, [...Array.from({ length: 8 }, (_, i) => pr((i % 4) * 2, Math.floor(i / 4) * 1, 2, 1, { b: 1, prazno: 1, id: 'm' })), pr(10, 0, 2.5, 2.5, { b: 2, gusto: 1, id: 'v' }), tx('20 × 10', [4, 2.6]), tx('25 × 25', [11.25, 3.2])], V({ velicina: 300 })));

  proveri(10 * 6 - 3 * 3 === 51, 'pravougaonik sa rupom');
  Z(2, 'Iz pravougaonika $10 cm × 6 cm$ isečen je kvadrat stranice $3 cm$. Kolika je površina ostatka?',
    ['$51 cm²$', '$57 cm²$', '$54 cm²$', '$47 cm²$'],
    [K('Pravougaonik: $10 · 6 = 60 cm²$.', ['pr']),
     K('Isečeni kvadrat: $3 · 3 = 9 cm²$.', ['rupa']),
     K('$P = 60 − 9 = 51 cm²$. (Greška $54$: oduzeto $3 · 2$ umesto $3 · 3$.)')],
    G({}, [...[[0, 0, 4, 6], [7, 0, 3, 6], [4, 0, 3, 1.5], [4, 4.5, 3, 1.5]].map(([x, y, w, h]) => pr(x, y, w, h, { b: 0, gusto: 1, id: 'pr' })), pr(0, 0, 10, 6, { b: 0, prazno: 1 }), pr(4, 1.5, 3, 3, { b: 5, prazno: 1, isp: 1, id: 'rupa' }), tx('10 cm', [5, -0.7]), tx('6 cm', [10.9, 3]), tx('3 cm', [5.5, 5])], V()));

  // ════════════════ 7.3 Površina paralelograma ════════════════
  L('Površina paralelograma');
  // paralelogram: osnovica a, visina h, pomak s; visina iz D sa podnožjem e
  const PG = (a, h, s, e = [], x = {}) => G({ A: [0, 0], B: [a, 0], C: [a + s, h], D: [s, h], e: [s, 0], f: [a + s, 0], ...(x.t || {}) }, [{ p: 'ABCD', b: 0 }, ...e], V(x));

  proveri(12 * 5 === 60, 'paralelogram 12 i 5');
  Z(1, 'Stranica paralelograma je $12 cm$, a visina na nju $5 cm$. Kolika je površina?',
    ['$60 cm²$', '$30 cm²$', '$34 cm²$', '$17 cm²$'],
    [K('Odsečemo trougao kod $A$ i premestimo ga uz $B$: dobijamo pravougaonik $12 × 5$.', ['t']),
     K('$P = a · h = 12 · 5 = 60 cm²$')],
    PG(12, 5, 3, [{ d: 'AB', o: '12 cm' }, { d: 'De', isp: 1, b: 3, o: '5 cm' }, { pu: 'DeB' }, { p: 'AeD', b: 1, gusto: 1, id: 't', k: 1, pomeri: [12, 0] }, { p: 'BfC', b: 1, prazno: 1, isp: 1, k: 1 }], { bezImena: [] }));

  proveri(15 * 8 === 120 && 120 / 10 === 12 && 6 ** 2 + 8 ** 2 === 100, 'druga visina');
  Z(2, 'Stranice paralelograma su $a = 15 cm$ i $b = 10 cm$, a visina $h_{a} = 8 cm$. Kolika je visina $h_{b}$?',
    ['$12 cm$', '$8 cm$', '$18,75 cm$', '$5,3 cm$'],
    [K('Površina preko stranice $a$: $P = 15 · 8 = 120 cm²$.', ['ha']),
     K('Ista površina preko stranice $b$: $120 = 10 · h_{b}$.', ['hb']),
     K('$h_{b} = 120 : 10 = 12 cm$. Kraćoj stranici odgovara duža visina.')],
    G({ A: [0, 0], B: [15, 0], C: [21, 8], D: [6, 8], e: [6, 0], F: [5.4, 7.2] },
      [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '15 cm' }, { d: 'AD', o: '10 cm', os: -1 }, { d: 'De', isp: 1, b: 3, o: '8 cm', id: 'ha' }, { pu: 'DeB' }, { d: 'BF', isp: 1, b: 1, id: 'hb', k: 2 }, { pu: 'BFD', k: 2 }], V({ bezImena: ['F'], velicina: 300 })));

  proveri(2 * (20 + 10) === 60 && 20 * 9 === 180 && 180 / 10 === 18, 'obim 60, a = 2b');
  Z(2, 'Obim paralelograma je $60 cm$, a duža stranica je dva puta duža od kraće. Visina na dužu stranicu je $9 cm$. Kolika je visina na kraću?',
    ['$18 cm$', '$4,5 cm$', '$9 cm$', '$36 cm$'],
    [K('$a = 2b$, pa je obim $2b + 2b + b + b = 6b = 60$, odnosno $b = 10 cm$ i $a = 20 cm$.'),
     K('$P = a · h_{a} = 20 · 9 = 180 cm²$.', ['ha']),
     K('$h_{b} = P : b = 180 : 10 = 18 cm$.', ['hb'])],
    G({ A: [0, 0], B: [20, 0], C: [24.36, 9], D: [4.36, 9], e: [4.36, 0], F: [3.8, 7.85] },
      [{ p: 'ABCD', b: 0 }, { d: 'AB', o: 'a = 2b' }, { d: 'AD', o: 'b' }, { d: 'De', isp: 1, b: 3, o: '9 cm', id: 'ha' }, { pu: 'DeB' }, { d: 'BF', isp: 1, b: 1, id: 'hb', k: 3 }, { pu: 'BFA', k: 3 }], V({ bezImena: ['F'], velicina: 320 })));

  proveri(3 - (-3) === 6 && 3 - -1 === 4 && 6 * 4 === 24, 'paralelogram u koordinatnoj ravni');
  Z(2, 'Tačke $A(−3, −1)$, $B(3, −1)$ i $C(5, 3)$ su temena paralelograma $ABCD$. Gde je teme $D$ i kolika je površina?',
    ['$D(−1, 3)$, $P = 24$', '$D(−1, 3)$, $P = 30$', '$D(1, 3)$, $P = 24$', '$D(−3, 3)$, $P = 20$'],
    [K('$\\vec{AB}$ ide $6$ udesno. Teme $D$ je $6$ levo od $C$: $D(5 − 6, 3) = D(−1, 3)$.', ['dc']),
     K('Osnovica $AB = 6$, a visina je razlika y-koordinata: $3 − (−1) = 4$.', ['h']),
     K('$P = 6 · 4 = 24$ kvadratića.')],
    G({ O: [0, 0], A: [-3, -1], B: [3, -1], C: [5, 3], D: [-1, 3], e: [-1, -1] },
      [{ mreza: [-4, 6, -2, 4] }, { d: 'AB', b: 1 }, { d: 'BC', b: 1 }, { p: 'ABCD', b: 1, k: 1 }, { d: 'DC', b: 3, id: 'dc', k: 1 }, { d: 'De', isp: 1, b: 3, id: 'h', k: 2, o: '4' }], V({ bezImena: ['O'], velicina: 280, t: {} })));

  proveri(10 / 2 === 5 && 10 * 5 === 50, 'romb 10, 30°');
  Z(2, 'Romb ima stranicu $10 cm$ i oštar ugao $30°$. Kolika mu je površina?',
    ['$50 cm²$', '$100 cm²$', '$25 cm²$', '$30 cm²$'],
    [K('Visina $DE$ je kateta naspram ugla od $30°$ u pravouglom trouglu $AED$.', ['tr']),
     K('Taj trougao je pola jednakostraničnog trougla stranice $10 cm$, pa je $h = 10 : 2 = 5 cm$.', ['jt']),
     K('$P = a · h = 10 · 5 = 50 cm²$')],
    G({ A: [0, 0], B: [10, 0], C: [18.66, 5], D: [8.66, 5], E: [8.66, 0], f: [8.66, -5] },
      [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '10 cm' }, { u: 'BAD', o: '30°', b: 1 }, { p: 'AED', b: 2, gusto: 1, id: 'tr', k: 1 }, { p: 'ADf', b: 4, prazno: 1, isp: 1, id: 'jt', k: 2 }, { d: 'DE', isp: 1, b: 3, o: 'h' }, { pu: 'DEB' }], V({ velicina: 300 })));

  proveri(8 / 2 === 4 && 12 * 4 === 48, 'paralelogram 150°');
  Z(3, 'U paralelogramu $ABCD$ je $AB = 12 cm$, $BC = 8 cm$ i $∠ABC = 150°$. Kolika je površina?',
    ['$48 cm²$', '$96 cm²$', '$72 cm²$', '$24 cm²$'],
    [K('Susedni ugao kod $A$ je $180° − 150° = 30°$.', ['u']),
     K('Visina iz $D$ je naspram ugla od $30°$ u trouglu sa hipotenuzom $AD = 8 cm$, pa je $h = 4 cm$.', ['h']),
     K('$P = AB · h = 12 · 4 = 48 cm²$')],
    G({ A: [0, 0], B: [12, 0], C: [18.93, 4], D: [6.93, 4], e: [6.93, 0] },
      [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '12 cm' }, { d: 'BC', o: '8 cm' }, { u: 'CBA', o: '150°', b: 1 }, { u: 'BAD', o: '30°', b: 2, id: 'u', k: 1 }, { d: 'De', isp: 1, b: 3, o: '4 cm', id: 'h', k: 2 }, { pu: 'DeB', k: 2 }], V({ velicina: 300 })));

  proveri(48 / 4 === 12 && 12 * 7 === 84, 'romb obim 48');
  Z(1, 'Obim romba je $48 cm$, a visina $7 cm$. Kolika mu je površina?',
    ['$84 cm²$', '$336 cm²$', '$42 cm²$', '$144 cm²$'],
    [K('Sve četiri stranice romba su jednake: $a = 48 : 4 = 12 cm$.'),
     K('$P = a · h = 12 · 7 = 84 cm²$', ['h'])],
    PG(6, 3.5, 4.87, [{ d: 'De', isp: 1, b: 3, o: '7 cm', id: 'h' }, { pu: 'DeB' }], { bezImena: ['A', 'B', 'C', 'D'] }));

  proveri(16 * 3 === 12 * 4, 'hₐ : h_b = 3 : 4');
  Z(2, 'Stranice paralelograma su $16 cm$ i $12 cm$. U kojoj su razmeri visine $h_{a} : h_{b}$ (gde je $a = 16 cm$)?',
    ['$3 : 4$', '$4 : 3$', '$1 : 1$', '$9 : 16$'],
    [K('Površina je ista preko obe stranice: $16 · h_{a} = 12 · h_{b}$.'),
     K('Podelimo sa $4$: $4 · h_{a} = 3 · h_{b}$, pa je $h_{a} : h_{b} = 3 : 4$.'),
     K('Visine su obrnuto srazmerne stranicama: duža stranica – kraća visina.', ['ha', 'hb'])],
    G({ A: [0, 0], B: [16, 0], C: [22, 10.392], D: [6, 10.392], e: [6, 0], F: [4, 6.928] },
      [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '16 cm' }, { d: 'AD', o: '12 cm' }, { d: 'De', isp: 1, b: 3, id: 'ha', k: 3 }, { pu: 'DeB', k: 3 }, { d: 'BF', isp: 1, b: 1, id: 'hb', k: 3 }, { pu: 'BFA', k: 3 }], V({ bezImena: ['F'], velicina: 280 })));

  proveri(72 / 2 === 36, 'trougao ABM = pola paralelograma');
  Z(3, 'Paralelogram $ABCD$ ima površinu $72 cm²$. Tačka $M$ je sredina stranice $CD$. Kolika je površina trougla $ABM$?',
    ['$36 cm²$', '$18 cm²$', '$24 cm²$', '$48 cm²$'],
    [K('Trougao $ABM$ ima osnovicu $AB$ kao i paralelogram…', ['ab']),
     K('…a visina mu je ista – rastojanje između pravih $AB$ i $CD$.', ['h']),
     K('$P_{ABM} = {AB · h|2} = {72|2} = 36 cm²$. Položaj tačke $M$ na $CD$ nije bitan.')],
    G({ A: [0, 0], B: [8, 0], C: [11, 4], D: [3, 4], M: [7, 4], e: [7, 0] },
      [{ p: 'ABCD', b: 4, prazno: 1 }, { p: 'ABM', b: 1, gusto: 1 }, { d: 'AB', b: 2, debljina: 4, id: 'ab', k: 1 }, { d: 'Me', isp: 1, b: 3, id: 'h', k: 2 }, { pu: 'MeB', k: 2 }], V()));

  proveri(8 * 6 === 48 && 48 / 12 === 4, 'iste površine');
  Z(2, 'Pravougaonik $8 cm × 6 cm$ i paralelogram sa osnovicom $12 cm$ imaju istu površinu. Kolika je visina paralelograma?',
    ['$4 cm$', '$6 cm$', '$2 cm$', '$8 cm$'],
    [K('$P = 8 · 6 = 48 cm²$.', ['pr']),
     K('Za paralelogram: $12 · h = 48$, pa je $h = 48 : 12 = 4 cm$.', ['h'])],
    G({ a: [0, 0], b: [8, 0], c: [8, 6], d: [0, 6], A: [10, 0], B: [22, 0], C: [25, 4], D: [13, 4], e: [13, 0] },
      [{ p: 'abcd', b: 1, id: 'pr' }, { d: 'ab', o: '8 cm' }, { d: 'bc', o: '6 cm' }, { p: 'ABCD', b: 0 }, { d: 'AB', o: '12 cm' }, { d: 'De', isp: 1, b: 3, o: 'h = ?', id: 'h' }, { pu: 'DeB' }], V({ bezImena: ['A', 'B', 'C', 'D'], velicina: 320 })));

  // ════════════════ 7.4 Površina trougla ════════════════
  L('Površina trougla');

  proveri((14 * 9) / 2 === 63, 'trougao 14 i 9');
  Z(1, 'Stranica trougla je $14 cm$, a visina na nju $9 cm$. Kolika je površina?',
    ['$63 cm²$', '$126 cm²$', '$23 cm²$', '$46 cm²$'],
    [K('Trougao je pola paralelograma sa istom osnovicom i visinom (kopija okrenuta oko sredine stranice).', ['kop']),
     K('$P = {a · h|2} = {14 · 9|2} = {126|2} = 63 cm²$')],
    G({ A: [0, 0], B: [14, 0], C: [4, 9], c: [4, 0], m: [9, 4.5] }, [{ p: 'ABC', b: 0 }, { p: 'ABC', b: 1, gusto: 1, id: 'kop', k: 1, okreni: 180, oko: 'm', trajanje: 1.8 }, { d: 'AB', o: '14 cm' }, { d: 'Cc', isp: 1, b: 3, o: '9 cm' }, { pu: 'CcB' }], V({ velicina: 300 })));

  proveri((9 * 12) / 2 === 54, 'pravougli 9 i 12');
  Z(1, 'Katete pravouglog trougla su $9 cm$ i $12 cm$. Kolika mu je površina?',
    ['$54 cm²$', '$108 cm²$', '$21 cm²$', '$42 cm²$'],
    [K('Kateta $AC$ je visina na katetu $AB$, pa je trougao pola pravougaonika $12 × 9$.', ['pr']),
     K('$P = {12 · 9|2} = 54 cm²$')],
    G({ A: [0, 0], B: [12, 0], C: [0, 9], d: [12, 9] }, [{ p: 'ABdC', b: 4, prazno: 1, isp: 1, id: 'pr', k: 1 }, { p: 'ABC', b: 0 }, { pu: 'BAC' }, { d: 'AB', o: '12 cm' }, { d: 'AC', o: '9 cm' }], V()));

  proveri((2 * 45) / 10 === 9, 'visina iz površine');
  Z(2, 'Površina trougla je $45 cm²$, a stranica $b = 10 cm$. Kolika je visina $h_{b}$?',
    ['$9 cm$', '$4,5 cm$', '$35 cm$', '$18 cm$'],
    [K('$P = {b · h_{b}|2}$, pa je $2P = b · h_{b}$: $90 = 10 · h_{b}$.'),
     K('$h_{b} = 90 : 10 = 9 cm$. (Greška $4,5$: zaboravljeno množenje sa $2$.)', ['h'])],
    G({ A: [0, 0], C: [10, 0], B: [3, 9], b: [3, 0] }, [{ p: 'ACB', b: 0 }, { d: 'AC', o: '10 cm' }, { d: 'Bb', isp: 1, b: 3, o: '?', id: 'h' }, { pu: 'BbC' }, { tx: '45 cm²', at: [4.5, 3], vel: 18 }], V()));

  proveri(sh([[-2, -1], [4, -1], [1, 4]]) === 15, 'trougao u koordinatnoj ravni 15');
  Z(2, 'Kolika je površina trougla sa temenima $A(−2, −1)$, $B(4, −1)$ i $C(1, 4)$?',
    ['$15$', '$30$', '$12$', '$18$'],
    [K('Stranica $AB$ je vodoravna: $AB = 4 − (−2) = 6$.', ['ab']),
     K('Visina iz $C$: $4 − (−1) = 5$.', ['h']),
     K('$P = {6 · 5|2} = 15$ kvadratića.')],
    G({ O: [0, 0], A: [-2, -1], B: [4, -1], C: [1, 4], c: [1, -1] }, [{ mreza: [-3, 5, -2, 5] }, { p: 'ABC', b: 1 }, { d: 'AB', b: 2, debljina: 4, id: 'ab', k: 1, o: '6' }, { d: 'Cc', isp: 1, b: 3, id: 'h', k: 2, o: '5' }], V({ bezImena: ['O'], velicina: 280 })));

  proveri(sh([[0, 0], [6, 2], [2, 6]]) === 16 && 36 - 6 - 8 - 6 === 16, 'senčeni trougao u kvadratu');
  Z(2, 'Kvadrat $ABCD$ ima stranicu $6 cm$. Na $BC$ je tačka $E$ ($BE = 2 cm$), a na $CD$ tačka $F$ ($DF = 2 cm$). Kolika je površina trougla $AEF$?',
    ['$16 cm²$', '$18 cm²$', '$20 cm²$', '$12 cm²$'],
    [K('Od kvadrata ($36 cm²$) oduzimamo tri pravougla trougla.'),
     K('$ABE$: ${6 · 2|2} = 6$; $ECF$: ${4 · 4|2} = 8$; $FDA$: ${2 · 6|2} = 6$.', ['t1', 't2', 't3']),
     K('$P = 36 − (6 + 8 + 6) = 16 cm²$')],
    G({ A: [0, 0], B: [6, 0], C: [6, 6], D: [0, 6], E: [6, 2], F: [2, 6] },
      [{ p: 'ABCD', b: 4, prazno: 1 }, { p: 'ABE', b: 3, gusto: 1, id: 't1', k: 2 }, { p: 'ECF', b: 3, gusto: 1, id: 't2', k: 2 }, { p: 'FDA', b: 3, gusto: 1, id: 't3', k: 2 }, { p: 'AEF', b: 1, gusto: 1 }, { d: 'BE', o: '2 cm' }, { d: 'DF', o: '2 cm' }], V()));

  proveri((12 / 5) * 20 === 48 && (16 * 12) / 2 === 96 && blizu((2 * 96) / 20, 9.6), 'pravougli obim 48');
  Z(3, 'Obim pravouglog trougla je $48 cm$. Katete su $a = {4|5}c$ i $b = {3|5}c$, gde je $c$ hipotenuza. Kolika je visina na hipotenuzu?',
    ['$9,6 cm$', '$12 cm$', '$10 cm$', '$4,8 cm$'],
    [K('$a + b + c = {4|5}c + {3|5}c + {5|5}c = {12|5}c = 48$, pa je $c = 20 cm$.'),
     K('$a = 16 cm$, $b = 12 cm$, a površina preko kateta: ${16 · 12|2} = 96 cm²$.', ['k']),
     K('Preko hipotenuze: ${20 · h_{c}|2} = 96$, pa je $h_{c} = {192|20} = 9,6 cm$.', ['hc'])],
    G({ A: [0, 0], B: [20, 0], C: [12.8, 9.6], c: [12.8, 0] }, [{ p: 'ABC', b: 0 }, { pu: 'BCA' }, { d: 'AB', o: 'c' }, { d: 'AC', o: 'a', b: 1, id: 'k', debljina: 3 }, { d: 'BC', o: 'b', b: 1, id: 'k', debljina: 3 }, { d: 'Cc', isp: 1, b: 3, o: 'h', id: 'hc', k: 3 }, { pu: 'CcB', k: 3 }], V({ velicina: 300 })));

  proveri((10 * 10) / 2 === 50, 'jednakokrako pravougli P = 50');
  Z(2, 'Jednakokrako-pravougli trougao ima površinu $50 cm²$. Kolika mu je kateta?',
    ['$10 cm$', '$25 cm$', '$5 cm$', '$7 cm$'],
    [K('Dva takva trougla čine kvadrat čija je stranica kateta.', ['kop']),
     K('Kvadrat ima površinu $2 · 50 = 100 cm²$, pa je kateta $10 cm$ ($10 · 10 = 100$).')],
    G({ A: [0, 0], B: [5, 0], C: [0, 5], d: [5, 5], m: [2.5, 2.5] }, [{ p: 'ABC', b: 1, gusto: 1 }, { pu: 'BAC' }, { p: 'ABC', b: 2, gusto: 1, id: 'kop', k: 1, okreni: 180, oko: 'm' }, { tx: '50 cm²', at: [1.6, 1.6], vel: 16 }], V({ bezImena: ['d'] })));

  proveri(18 / 3 === 6 && 18 / 2 === 9 && 18 - 6 - 9 === 3 && (3 * 10) / 2 === 15, 'trouglovi AKC, KMC, MBC');
  Z(3, 'U trouglu $ABC$ je $AB = 18 cm$, a visina iz $C$ je $10 cm$. Tačke $K$ i $M$ su na $AB$ tako da je $AK = {1|3}AB$ i $MB = {1|2}AB$. Kolika je površina trougla $KMC$?',
    ['$15 cm²$', '$30 cm²$', '$45 cm²$', '$90 cm²$'],
    [K('$AK = 18 : 3 = 6 cm$, $MB = 18 : 2 = 9 cm$, pa je $KM = 18 − 6 − 9 = 3 cm$.', ['km']),
     K('Svi trouglovi sa vrhom $C$ i osnovicom na $AB$ imaju istu visinu $10 cm$.', ['h']),
     K('$P_{KMC} = {3 · 10|2} = 15 cm²$ (a $AKC$ ima $30$, $MBC$ $45$; zbir je $90$ ✓).')],
    G({ A: [0, 0], B: [18, 0], C: [7, 10], K: [6, 0], M: [9, 0], c: [7, 0] },
      [{ p: 'AKC', b: 4, prazno: 1 }, { p: 'KMC', b: 1, gusto: 1 }, { p: 'MBC', b: 4, prazno: 1 }, { d: 'KM', b: 2, debljina: 4, id: 'km', k: 1, o: '3 cm' }, { d: 'Cc', isp: 1, b: 3, id: 'h', o: '10 cm' }, { pu: 'CcB' }], V({ velicina: 300 })));

  proveri((21 * 8) / 2 === 84 && 24 * 14 * 7 * 3 === 84 * 84, 'trougao 10, 17, 21');
  Z(2, 'Stranice trougla su $10 cm$, $17 cm$ i $21 cm$, a površina mu je $84 cm²$. Kolika je visina na najdužu stranicu?',
    ['$8 cm$', '$4 cm$', '$16,8 cm$', '$9,9 cm$'],
    [K('$P = {a · h_{a}|2}$, pa je $h_{a} = {2P|a}$.'),
     K('Za najdužu stranicu: $h = {2 · 84|21} = {168|21} = 8 cm$.', ['h']),
     K('Najdužoj stranici uvek odgovara najkraća visina.')],
    G({ A: [0, 0], B: [21, 0], C: [6, 8], c: [6, 0] }, [{ p: 'ABC', b: 0 }, { d: 'AB', o: '21 cm' }, { d: 'AC', o: '10 cm' }, { d: 'BC', o: '17 cm' }, { d: 'Cc', isp: 1, b: 3, o: '?', id: 'h' }, { pu: 'CcB' }], V({ velicina: 300 })));

  proveri(2 * 10 === 20 && (20 * 8) / 2 === 80, 'CM = c/2');
  Z(3, 'U pravouglom trouglu $ABC$ (pravi ugao kod $C$) tačka $M$ je sredina hipotenuze, $CM = 10 cm$, a visina na hipotenuzu je $8 cm$. Kolika je površina?',
    ['$80 cm²$', '$40 cm²$', '$160 cm²$', '$100 cm²$'],
    [K('Pravougli trougao i njegova kopija okrenuta oko $M$ čine pravougaonik; $M$ je presek njegovih dijagonala.', ['kop']),
     K('Dijagonale pravougaonika su jednake i polove se, pa je $AM = BM = CM = 10 cm$ i $c = 20 cm$.'),
     K('$P = {c · h_{c}|2} = {20 · 8|2} = 80 cm²$')],
    G({ A: [0, 0], B: [20, 0], C: [4, 8], M: [10, 0], c: [4, 0] },
      [{ p: 'ABC', b: 0 }, { pu: 'BCA' }, { p: 'ABC', b: 2, prazno: 1, isp: 1, id: 'kop', k: 1, okreni: 180, oko: 'M' }, { d: 'CM', b: 1, o: '10 cm' }, { d: 'Cc', isp: 1, b: 3, o: '8 cm' }, { pu: 'CcB' }], V({ velicina: 300 })));

  // ════════════════ 7.5 Površina trapeza ════════════════
  L('Površina trapeza');
  // trapez ABCD sa visinom iz D (podnožje d) i srednjom linijom nm
  const TR = (a, b, s, h, e = [], x = {}) => G({ A: [0, 0], B: [a, 0], C: [s + b, h], D: [s, h], d: [s, 0], n: [s / 2, h / 2], m: [(a + s + b) / 2, h / 2], q: [(a + s + b) / 2, h / 2], ...(x.t || {}) }, [{ p: 'ABCD', b: 0 }, ...e], V(x));

  proveri((11 + 7) / 2 === 9 && 9 * 5 === 45, 'trapez 11, 7, 5');
  Z(1, 'Osnovice trapeza su $11 cm$ i $7 cm$, a visina $5 cm$. Kolika je površina?',
    ['$45 cm²$', '$90 cm²$', '$77 cm²$', '$23 cm²$'],
    [K('Srednja linija: $m = {11 + 7|2} = 9 cm$.', ['m']),
     K('$P = m · h = 9 · 5 = 45 cm²$. (Greška $90$: zbir osnovica puta visina, bez deljenja sa $2$.)')],
    TR(11, 7, 2, 5, [{ d: 'AB', o: '11 cm' }, { d: 'DC', o: '7 cm' }, { d: 'Dd', isp: 1, b: 3, o: '5 cm' }, { pu: 'DdB' }, { d: 'nm', b: 2, debljina: 3, id: 'm', k: 1, o: '9 cm' }], { bezImena: [] }));

  proveri(96 / 6 === 16 && 2 * 16 - 19 === 13, 'kraća osnovica');
  Z(2, 'Površina trapeza je $96 cm²$, visina $6 cm$, a duža osnovica $19 cm$. Kolika je kraća osnovica?',
    ['$13 cm$', '$16 cm$', '$3 cm$', '$10 cm$'],
    [K('Srednja linija: $m = P : h = 96 : 6 = 16 cm$.', ['m']),
     K('$a + b = 2m = 32 cm$.'),
     K('$b = 32 − 19 = 13 cm$')],
    TR(19, 13, 3, 6, [{ d: 'AB', o: '19 cm' }, { d: 'DC', o: '?' }, { d: 'Dd', isp: 1, b: 3, o: '6 cm' }, { pu: 'DdB' }, { d: 'nm', b: 2, debljina: 3, id: 'm', k: 1, o: '16 cm' }], { velicina: 300 }));

  proveri((15 - 7) / 2 === 4 && ((15 + 7) / 2) * 4 === 44, 'jednakokraki 45°');
  Z(2, 'Jednakokraki trapez ima osnovice $15 cm$ i $7 cm$, a uglove na dužoj osnovici od $45°$. Kolika je površina?',
    ['$44 cm²$', '$88 cm²$', '$22 cm²$', '$60 cm²$'],
    [K('Visine iz $D$ i $C$ odsecaju dva podudarna trougla, svaki sa katetom ${15 − 7|2} = 4 cm$ na osnovici.', ['t1', 't2']),
     K('Trouglovi su jednakokrako-pravougli (uglovi $45°$), pa je i visina $h = 4 cm$.', ['h']),
     K('$P = {15 + 7|2} · 4 = 11 · 4 = 44 cm²$')],
    G({ A: [0, 0], B: [15, 0], C: [11, 4], D: [4, 4], d: [4, 0], c: [11, 0] },
      [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '15 cm' }, { d: 'DC', o: '7 cm' }, { u: 'BAD', o: '45°', b: 1 }, { u: 'CBA', o: '45°', b: 1 }, { p: 'AdD', b: 2, gusto: 1, id: 't1', k: 1 }, { p: 'cBC', b: 2, gusto: 1, id: 't2', k: 1 }, { d: 'Dd', isp: 1, b: 3, id: 'h', k: 2, o: '4 cm' }, { d: 'Cc', isp: 1, b: 3, k: 1 }], V({ velicina: 300 })));

  proveri(3 + 5 === 8 && ((3 + 8) / 2) * 5 === 27.5, 'pravougli trapez 45°');
  Z(2, 'Pravougli trapez ima kraću osnovicu $3 cm$, visinu $5 cm$ i oštar ugao od $45°$. Kolika je površina?',
    ['$27,5 cm²$', '$40 cm²$', '$20 cm²$', '$55 cm²$'],
    [K('Visina iz $C$ odseca jednakokrako-pravougli trougao: njegove katete su obe po $5 cm$.', ['t']),
     K('Duža osnovica: $3 + 5 = 8 cm$.'),
     K('$P = {3 + 8|2} · 5 = 5,5 · 5 = 27,5 cm²$')],
    G({ A: [0, 0], B: [8, 0], C: [3, 5], D: [0, 5], c: [3, 0] },
      [{ p: 'ABCD', b: 0 }, { pu: 'BAD' }, { pu: 'ADC' }, { d: 'DC', o: '3 cm' }, { d: 'AD', o: '5 cm' }, { u: 'CBA', o: '45°', b: 1 }, { p: 'cBC', b: 2, gusto: 1, id: 't', k: 1 }, { d: 'Cc', isp: 1, b: 3, k: 1 }, { d: 'cB', o: '5 cm', k: 1 }], V()));

  proveri(((18 + 10) / 2) * 12 === 168, 'pravougli MNPQ');
  Z(2, 'Pravougli trapez $MNPQ$ ima osnovice $MN = 18 cm$ i $PQ = 10 cm$, a krak $NP = 12 cm$ normalan je na osnovice. Kolika je površina?',
    ['$168 cm²$', '$336 cm²$', '$216 cm²$', '$120 cm²$'],
    [K('Krak $NP$ je normalan na osnovice, pa je on visina: $h = 12 cm$.', ['h']),
     K('$P = {18 + 10|2} · 12 = 14 · 12 = 168 cm²$')],
    G({ M: [0, 0], N: [18, 0], P: [18, 12], Q: [8, 12] }, [{ p: 'MNPQ', b: 0 }, { pu: 'MNP' }, { d: 'MN', o: '18 cm' }, { d: 'PQ', o: '10 cm' }, { d: 'NP', o: '12 cm', b: 3, id: 'h' }], V()));

  proveri(150 / ((18 + 12) / 2) === 10, 'visina trapeza');
  Z(2, 'Osnovice trapeza su $18 cm$ i $12 cm$, a površina $150 cm²$. Kolika je visina?',
    ['$10 cm$', '$5 cm$', '$15 cm$', '$25 cm$'],
    [K('Srednja linija: $m = {18 + 12|2} = 15 cm$.', ['m']),
     K('$h = P : m = 150 : 15 = 10 cm$', ['h'])],
    TR(9, 6, 1.5, 5, [{ d: 'AB', o: '18 cm' }, { d: 'DC', o: '12 cm' }, { d: 'Dd', isp: 1, b: 3, o: '?', id: 'h' }, { pu: 'DdB' }, { d: 'nm', b: 2, debljina: 3, id: 'm', k: 1, o: '15 cm' }, { tx: '150 cm²', at: [4.5, 1], vel: 16 }], { bezImena: ['A', 'B', 'C', 'D'] }));

  proveri((26 + 10) / 2 === 18 && ((26 + 18) / 2) * 6 === 132 && ((18 + 10) / 2) * 6 === 84 && 132 * 7 === 84 * 11, 'srednja linija deli 11 : 7');
  Z(3, 'Osnovice trapeza su $26 cm$ i $10 cm$, a visina $12 cm$. U kojoj razmeri srednja linija deli njegovu površinu (donji deo : gornji)?',
    ['$11 : 7$', '$1 : 1$', '$13 : 5$', '$9 : 5$'],
    [K('Srednja linija: $m = {26 + 10|2} = 18 cm$; oba nova trapeza imaju visinu $6 cm$.', ['m']),
     K('Donji: ${26 + 18|2} · 6 = 132 cm²$; gornji: ${18 + 10|2} · 6 = 84 cm²$.', ['d', 'g']),
     K('$132 : 84 = 11 : 7$ (podelimo sa $12$). Ukupno $216 cm²$ ✓')],
    G({ A: [0, 0], B: [26, 0], C: [18, 12], D: [8, 12], n: [4, 6], m: [22, 6], e: [8, 0] },
      [{ p: 'ABmn', b: 1, gusto: 1, id: 'd', k: 2 }, { p: 'nmCD', b: 2, gusto: 1, id: 'g', k: 2 }, { p: 'ABCD', b: 0, prazno: 1 }, { d: 'AB', o: '26 cm' }, { d: 'DC', o: '10 cm' }, { d: 'De', isp: 1, b: 3, o: '12 cm' }, { pu: 'DeB' }, { d: 'nm', b: 3, debljina: 3, id: 'm', k: 1, o: '18 cm' }], V({ velicina: 300 })));

  proveri(8 * 5 - ((4 + 2) / 2) * 3 === 31, 'pravougaonik bez trapeza');
  Z(3, 'Iz pravougaonika $8 cm × 5 cm$ isečen je pravougli trapez sa osnovicama $4 cm$ i $2 cm$ i visinom $3 cm$ (vidi sliku). Kolika je površina ostatka?',
    ['$31 cm²$', '$28 cm²$', '$34 cm²$', '$22 cm²$'],
    [K('Pravougaonik: $8 · 5 = 40 cm²$.', ['pr']),
     K('Trapez: ${4 + 2|2} · 3 = 9 cm²$.', ['tr']),
     K('$P = 40 − 9 = 31 cm²$')],
    G({ a: [0, 0], b: [8, 0], c: [8, 5], d: [0, 5], e: [4, 5], f: [8, 2], g: [6, 2] },
      [{ lin: [[0, 0], [8, 0], [8, 2], [6, 2], [4, 5], [0, 5]], zatv: 1, b: 0, gusto: 1 }, { p: 'abcd', b: 0, prazno: 1, id: 'pr' }, { lin: [[4, 5], [8, 5], [8, 2], [6, 2]], zatv: 1, b: 5, prazno: 1, isp: 1, id: 'tr' }, { d: 'ab', o: '8 cm' }, { d: 'da', o: '5 cm' }, { d: 'ec', o: '4 cm' }, { d: 'fc', o: '3 cm' }, { d: 'gf', o: '2 cm' }], V()));

  proveri(80 - 80 / 4 === 60, 'trapez ABNM');
  Z(3, 'Trougao $ABC$ ima površinu $80 cm²$, a $M$ i $N$ su sredine stranica $AC$ i $BC$. Kolika je površina trapeza $ABNM$?',
    ['$60 cm²$', '$40 cm²$', '$20 cm²$', '$70 cm²$'],
    [K('Srednja linija $MN$ i duži iz $M$ i $N$ do sredine $AB$ dele trougao na četiri podudarna trougla.', ['t']),
     K('Mali trougao $MNC$ je četvrtina: $80 : 4 = 20 cm²$.', ['c']),
     K('$P_{ABNM} = 80 − 20 = 60 cm²$ (tri četvrtine).')],
    G({ A: [0, 0], B: [10, 0], C: [4, 7], M: [2, 3.5], N: [7, 3.5], k: [5, 0] },
      [{ p: 'ABNM', b: 1, gusto: 1 }, { p: 'MNC', b: 4, prazno: 1, id: 'c' }, { d: 'Mk', b: 3, isp: 1, k: 1, id: 't' }, { d: 'Nk', b: 3, isp: 1, k: 1, id: 't' }, { d: 'MN', b: 2 }], V()));

  proveri(sh([[0, 0], [10, 0], [7, 4], [2, 4]]) === 30, 'trapez na mreži 30');
  Z(1, 'Stranica kvadratića je $1 cm$. Kolika je površina trapeza?',
    ['$30 cm²$', '$60 cm²$', '$40 cm²$', '$26 cm²$'],
    [K('Sa slike: osnovice $10 cm$ i $5 cm$, visina $4 cm$.', ['a', 'b', 'h']),
     K('$P = {10 + 5|2} · 4 = 7,5 · 4 = 30 cm²$')],
    G({ A: [0, 0], B: [10, 0], C: [7, 4], D: [2, 4], d: [2, 0] }, [...kv(0, 10, 0, 5), { p: 'ABCD', b: 1 }, { d: 'AB', b: 2, debljina: 4, id: 'a', k: 1 }, { d: 'DC', b: 2, debljina: 4, id: 'b', k: 1 }, { d: 'Dd', b: 3, isp: 1, id: 'h', k: 1 }], V({ bezImena: ['A', 'B', 'C', 'D'] })));

  // ════════════════ 7.6 Površina četvorougla sa normalnim dijagonalama ════════════════
  L('Površina četvorougla sa normalnim dijagonalama');
  // četvorougao A(−l, 0), C(d, 0), B(0, −g), D(0, gg) sa opisanim pravougaonikom (k ≥ 1) i trouglovima okrenutim oko sredina stranica
  const NO = (l, d, g, gg, e = [], { korak = 1, x = {} } = {}) => G({ A: [-l, 0], C: [d, 0], B: [0, -g], D: [0, gg], O: [0, 0], e: [-l, -g], f: [d, -g], h: [d, gg], k: [-l, gg], s: [-l / 2, -g / 2], u: [d / 2, -g / 2], v: [d / 2, gg / 2], w: [-l / 2, gg / 2] },
    [{ p: 'efhk', b: 4, prazno: 1, isp: 1, id: 'pr', k: korak }, { p: 'ABCD', b: 0 }, ...[['AOB', 's'], ['BOC', 'u'], ['COD', 'v'], ['DOA', 'w']].map(([p, o], i) => ({ p, b: 2, gusto: 1, okreni: 180, oko: o, k: korak, kasni: 0.4 + 0.4 * i, trajanje: 1 })),
      { d: 'AC', b: 1, isp: 1, id: 'd1' }, { d: 'BD', b: 3, isp: 1, id: 'd2' }, { pu: 'COD' }, ...e], V({ bezImena: ['O'], ...x }));

  proveri((14 * 9) / 2 === 63, 'romb 14 i 9');
  Z(1, 'Dijagonale romba su $14 cm$ i $9 cm$. Kolika je površina?',
    ['$63 cm²$', '$126 cm²$', '$23 cm²$', '$46 cm²$'],
    [K('Oko romba opišemo pravougaonik $14 × 9$; svaki deo romba ima „blizanca“ van njega.', ['pr']),
     K('$P = {d_{1} · d_{2}|2} = {14 · 9|2} = 63 cm²$')],
    NO(3.5, 3.5, 2.25, 2.25, [{ d: 'AC', b: 1, isp: 1, o: '14 cm', na: 0.75 }, { d: 'BD', b: 3, isp: 1, o: '9 cm', na: 0.25 }]));

  proveri((12 * 12) / 2 === 72, 'kvadrat dijagonale 12');
  Z(1, 'Dijagonala kvadrata je $12 cm$. Kolika je površina kvadrata?',
    ['$72 cm²$', '$144 cm²$', '$36 cm²$', '$48 cm²$'],
    [K('Dijagonale kvadrata su jednake i normalne.'),
     K('$P = {d · d|2} = {12 · 12|2} = 72 cm²$. ($144$ bi bila površina kvadrata stranice $12 cm$.)', ['pr'])],
    NO(3, 3, 3, 3, [{ d: 'AC', b: 1, isp: 1, o: '12 cm', na: 0.75 }], { korak: 2 }));

  proveri((64 * 25) / 2 === 800 && 800 / 100 === 8, 'plac 8 a');
  Z(2, 'Plac ima oblik deltoida sa dijagonalama $64 m$ i $25 m$. Koliko ari ima plac?',
    ['$8 a$', '$80 a$', '$16 a$', '$800 a$'],
    [K('$P = {64 · 25|2} = {1 600|2} = 800 m²$.'),
     K('$1 a = 100 m²$, pa je $800 m² = 8 a$.')],
    NO(1.6, 4.8, 2.5, 2.5, [{ d: 'AC', b: 1, isp: 1, o: '64 m', na: 0.7 }, { d: 'BD', b: 3, isp: 1, o: '25 m', na: 0.25 }], { x: { velicina: 280 } }));

  proveri((14 * 14) / 2 === 98, 'kvadrat u krugu r = 7');
  Z(2, 'Oko kvadrata je opisan krug poluprečnika $7 cm$. Kolika je površina kvadrata?',
    ['$98 cm²$', '$49 cm²$', '$196 cm²$', '$28 cm²$'],
    [K('Centar kruga je presek dijagonala kvadrata, a dijagonala je prečnik: $d = 2 · 7 = 14 cm$.', ['d']),
     K('$P = {d · d|2} = {14 · 14|2} = 98 cm²$')],
    G({ O: [0, 0], A: [7, 0], B: [0, 7], C: [-7, 0], D: [0, -7] }, [{ kr: 'O', r: 7, b: 4 }, { p: 'ABCD', b: 0 }, { d: 'OA', o: '7 cm', b: 1 }, { d: 'AC', isp: 1, b: 3, id: 'd', k: 1 }, { d: 'BD', isp: 1, b: 3, k: 1 }], V()));

  proveri(20 / 4 === 5 && (8 * 6) / 2 === 24 && blizu(24 / 5, 4.8), 'visina romba');
  Z(3, 'Obim romba je $20 cm$, a dijagonale su mu $8 cm$ i $6 cm$. Kolika je visina romba?',
    ['$4,8 cm$', '$6 cm$', '$4 cm$', '$9,6 cm$'],
    [K('Stranica: $a = 20 : 4 = 5 cm$.'),
     K('Površina preko dijagonala: ${8 · 6|2} = 24 cm²$.', ['d1', 'd2']),
     K('$P = a · h$, pa je $h = 24 : 5 = 4,8 cm$.', ['h'])],
    G({ A: [-4, 0], B: [0, -3], C: [4, 0], D: [0, 3], O: [0, 0], e: [-2.88, -0.84] },
      [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1, isp: 1, o: '8 cm', id: 'd1', na: 0.75 }, { d: 'BD', b: 3, isp: 1, o: '6 cm', id: 'd2', na: 0.25 }, { pu: 'COD' }, { d: 'De', b: 2, isp: 1, id: 'h', k: 3 }, { pu: 'DeB', k: 3 }], V({ bezImena: ['O'] })));

  proveri((18 * 11) / 2 === 99, 'deltoid 18 i 11');
  Z(2, 'Dijagonale deltoida su $18 cm$ i $11 cm$. Kolika je površina?',
    ['$99 cm²$', '$198 cm²$', '$29 cm²$', '$49,5 cm²$'],
    [K('Dijagonale deltoida su normalne, pa je on pola pravougaonika $18 × 11$.', ['pr']),
     K('$P = {18 · 11|2} = {198|2} = 99 cm²$')],
    NO(2, 7, 2.75, 2.75, [{ d: 'AC', b: 1, isp: 1, o: '18 cm', na: 0.7 }, { d: 'BD', b: 3, isp: 1, o: '11 cm', na: 0.25 }], { x: { velicina: 280 } }));

  proveri(24 / 2 === 12 && 16 / 2 === 8 && (12 * 8) / 2 === 48, 'romb u pravougaoniku 24 × 16');
  Z(3, 'Pravougaonik je $24 cm × 16 cm$, a $O$ mu je centar. Na pravama kroz $O$ paralelnim stranicama uočene su tačke $M$, $N$, $P$, $Q$ – svaka na pola puta od $O$ do odgovarajuće stranice. Kolika je površina četvorougla $MNPQ$?',
    ['$48 cm²$', '$96 cm²$', '$192 cm²$', '$24 cm²$'],
    [K('Rastojanja od $O$ do stranica su $12 cm$ i $8 cm$, pa su $OM = OP = 6 cm$ i $ON = OQ = 4 cm$.'),
     K('$MNPQ$ je romb sa dijagonalama $MP = 12 cm$ i $NQ = 8 cm$, koje su normalne.', ['d1', 'd2']),
     K('$P = {12 · 8|2} = 48 cm²$')],
    G({ a: [-12, -8], b: [12, -8], c: [12, 8], d: [-12, 8], O: [0, 0, 30], M: [-6, 0], N: [0, -4], P: [6, 0], Q: [0, 4], x1: [-12, 0], x2: [12, 0], y1: [0, -8], y2: [0, 8] },
      [{ p: 'abcd', b: 4, prazno: 1 }, { d: 'x1x2', b: 4, isp: 1 }, { d: 'y1y2', b: 4, isp: 1 }, { p: 'MNPQ', b: 1, gusto: 1 }, { tacka: 'O' }, { d: 'MP', b: 1, id: 'd1', k: 2 }, { d: 'NQ', b: 3, id: 'd2', k: 2 }, { d: 'ab', o: '24 cm' }, { d: 'bc', o: '16 cm' }], V({ velicina: 300 })));

  proveri(sh([[1, 3], [5, 0], [9, 3], [5, 10]]) === 40, 'deltoid u koordinatnoj ravni 40');
  Z(3, 'Kolika je površina četvorougla sa temenima $A(1, 3)$, $B(5, 0)$, $C(9, 3)$ i $D(5, 10)$?',
    ['$40$', '$80$', '$30$', '$45$'],
    [K('Dijagonala $AC$ je vodoravna (na pravoj $y = 3$): $AC = 9 − 1 = 8$.', ['d1']),
     K('Dijagonala $BD$ je uspravna (na pravoj $x = 5$): $BD = 10 − 0 = 10$. Zato su normalne.', ['d2']),
     K('$P = {8 · 10|2} = 40$ kvadratića.')],
    G({ O: [0, 0], A: [1, 3], B: [5, 0], C: [9, 3], D: [5, 10] }, [{ mreza: [-1, 10, -1, 11] }, { p: 'ABCD', b: 1 }, { d: 'AC', b: 3, isp: 1, id: 'd1', k: 1 }, { d: 'BD', b: 2, isp: 1, id: 'd2', k: 2 }], V({ bezImena: ['O'], velicina: 270 })));

  proveri((15 * 8) / 2 === 60, 'duži 15 i 8');
  Z(2, 'Duž $AB = 15 cm$ seče duž $CD = 8 cm$ i normalna je na nju. Kolika je površina četvorougla $ACBD$?',
    ['$60 cm²$', '$120 cm²$', '$23 cm²$', '$30 cm²$'],
    [K('Duž $AB$ deli četvorougao na trouglove $ABC$ i $ABD$ sa zajedničkom osnovicom $AB$.', ['t1', 't2']),
     K('Zbir njihovih visina je $CD = 8 cm$: $P = {15 · h_{1}|2} + {15 · h_{2}|2} = {15 · 8|2}$.'),
     K('$P = 60 cm²$ – formula za normalne dijagonale.')],
    G({ A: [-4, 0], B: [11, 0], C: [0, -5], D: [0, 3], O: [0, 0] },
      [{ p: 'ABC', b: 1, gusto: 1, id: 't1', k: 1 }, { p: 'ABD', b: 2, gusto: 1, id: 't2', k: 1 }, { p: 'ACBD', b: 0, prazno: 1 }, { d: 'AB', b: 1, isp: 1, o: '15 cm', na: 0.7 }, { d: 'CD', b: 3, isp: 1, o: '8 cm', na: 0.25 }, { pu: 'BOD' }], V({ bezImena: ['O'], velicina: 280 })));

  proveri(24 / 3 === 8 && (8 * 10) / 2 === 40, 'četvorougao MBND');
  Z(3, 'Dijagonale romba $ABCD$ su $AC = 24 cm$ i $BD = 10 cm$. Tačke $M$ i $N$ dele $AC$ na tri jednaka dela. Kolika je površina četvorougla $MBND$?',
    ['$40 cm²$', '$80 cm²$', '$120 cm²$', '$60 cm²$'],
    [K('$MN = 24 : 3 = 8 cm$.', ['mn']),
     K('Dijagonale četvorougla $MBND$ su $MN$ i $BD$ – i one su normalne.', ['bd']),
     K('$P = {8 · 10|2} = 40 cm²$ – tačno trećina romba ($120 cm²$).')],
    G({ A: [-12, 0], B: [0, -5], C: [12, 0], D: [0, 5], M: [-4, 0], N: [4, 0], O: [0, 0] },
      [{ p: 'ABCD', b: 4, prazno: 1 }, { p: 'MBND', b: 1, gusto: 1 }, { d: 'AC', b: 4, isp: 1 }, { d: 'MN', b: 2, debljina: 4, id: 'mn', k: 1 }, { d: 'BD', b: 3, isp: 1, id: 'bd', k: 2 }, { pu: 'COD' }], V({ bezImena: ['O'], velicina: 300 })));
};
