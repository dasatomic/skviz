// Tema 2: Osnovni pojmovi geometrije (lekcije 2.1–2.8)
module.exports = ({ L, Z, K, G, R, O, bez, r, proveri, naKrugu, pravilni, krug, papir, luk, skokovi }) => {
  const sveDuzi = (imena) => { const d = []; for (let i = 0; i < imena.length; i++) for (let j = i + 1; j < imena.length; j++) d.push(imena[i] + imena[j]); return d; };
  // prava kroz dve tačke, produžena preko krajeva (pomoćne tačke bez imena)
  const prava = (t, A, B, ime, x = {}, prod = 0.6) => {
    const [a, b] = [t[A], t[B]];
    const d = [b[0] - a[0], b[1] - a[1]];
    t[ime + '1'] = [r(a[0] - d[0] * prod), r(a[1] - d[1] * prod)];
    t[ime + '2'] = [r(b[0] + d[0] * prod), r(b[1] + d[1] * prod)];
    return { d: ime + '1' + ime + '2', ...x };
  };

  // ════════════════ 2.1 Tačke i prave ════════════════
  L('Tačke i prave; pripadanje i raspored');

  {
    const t = { A: [0, 0], B: [6, 1], C: [2, 5] };
    const e = [{ tacka: 'ABC' }, prava(t, 'A', 'B', 'p', { k: 1, b: 0, crtaj: 1 }), prava(t, 'B', 'C', 'q', { k: 1, b: 1, crtaj: 1, kasni: 0.6 }), prava(t, 'C', 'A', 's', { k: 1, b: 2, crtaj: 1, kasni: 1.2 })];
    Z(1, 'Tačke $A$, $B$ i $C$ ne pripadaju jednoj pravoj. Koliko različitih pravih određuju?',
      ['$3$', '$1$', '$6$', '$2$'],
      [K('Kroz svake dve tačke prolazi tačno jedna prava: $AB$, $BC$ i $CA$.'),
       K('Pošto tačke nisu na jednoj pravoj, te tri prave su različite: ukupno $3$.')],
      G(t, e, { bezImena: ['p1', 'p2', 'q1', 'q2', 's1', 's2'], velicina: 220 }));
  }
  {
    const t = { A: [0, 0, 270], B: [2, 0, 270], C: [3.5, 0, 270], D: [6, 0, 270], E: [7.5, 0, 270], l: [-1, 0], d: [8.5, 0] };
    const e = [{ d: 'ld', b: 4 }, { tacka: 'ABCDE' }];
    const boje = [0, 1, 2, 5];
    'ABCD'.split('').forEach((p, i) => 'ABCDE'.slice(i + 1).split('').forEach((q, j) => {
      const tt = (t[p][0] + t[q][0]) / 2, rr = (t[q][0] - t[p][0]) / 2;
      t['m' + p + q] = [tt, 0];
      e.push({ l: 'm' + p + q, r: rr, od: 0, do: 180, b: boje[i], k: 1, crtaj: 1, kasni: 0.2 + (i * 4 + j) * 0.25, trajanje: 0.6 });
    }));
    Z(1, 'Tačke $A$, $B$, $C$, $D$ i $E$ pripadaju jednoj pravoj. Koliko duži određuju?',
      ['$10$', '$5$', '$20$', '$4$'],
      [K('Iz $A$ polaze $4$ duži, iz $B$ još $3$ nove, iz $C$ $2$, iz $D$ $1$ (luk označava duž).'),
       K('$4 + 3 + 2 + 1 = 10$ duži. (Brojanje $5 · 4 = 20$ svaku duž broji dvaput.)')],
      G(t, e, { bezImena: ['l', 'd', ...Object.keys(t).filter((x) => x.startsWith('m'))], velicina: 280 }));
  }
  {
    const t = { A: [0, 0], B: [5, 0], C: [5.5, 4], D: [0.5, 4.5] };
    const e = [{ tacka: 'ABCD' }, ...sveDuzi('ABCD').map((d, i) => ({ d, b: i % 6, k: 1, crtaj: 1, kasni: 0.2 + i * 0.35 }))];
    Z(2, 'Četiri tačke su date tako da nikoje tri ne pripadaju jednoj pravoj. Koliko pravih određuju?',
      ['$6$', '$4$', '$12$', '$8$'],
      [K('Svaki par tačaka određuje jednu pravu: $AB, AC, AD, BC, BD, CD$.'),
       K('Ukupno $6$ pravih (svaka tačka je u paru sa $3$ druge: $4 · 3 : 2 = 6$).')],
      G(t, e, { velicina: 200 }));
  }
  Z(2, 'Tačke $A$, $B$ i $C$ pripadaju pravoj $p$. Koliko polupravih na pravoj $p$ imaju početak u nekoj od ovih tačaka?',
    ['$6$', '$3$', '$4$', '$9$'],
    [K('Svaka tačka deli pravu na dve poluprave (levo i desno).'),
     K('Tri tačke: $3 · 2 = 6$ polupravih.', ['pp'])],
    G({ A: [0, 0, 270], B: [3, 0, 270], C: [6, 0, 270], l: [-2, 0], d: [8, 0] }, [{ d: 'ld', b: 4 }, { tacka: 'ABC' }, ...[0, 3, 6].map((x, i) => ({ lin: [[x, 0.3 + i * 0.35], [8, 0.3 + i * 0.35]], b: i, str: 1, k: 2, id: 'pp', crtaj: 1, kasni: 0.2 + i * 0.5 })), ...[0, 3, 6].map((x, i) => ({ lin: [[x, -0.3 - i * 0.35], [-2, -0.3 - i * 0.35]], b: i, str: 1, k: 2, id: 'pp', crtaj: 1, kasni: 1.8 + i * 0.5 }))], { bezImena: ['l', 'd'], velicina: 260 }));

  {
    const t = { A: [0, 3], B: [3, 3], C: [6, 3], D: [1.5, 0], E: [5, 0], a1: [-1.5, 3], a2: [7.5, 3], b1: [-1.5, 0], b2: [7.5, 0] };
    const e = [{ d: 'a1a2', b: 0 }, { d: 'b1b2', b: 1 }, { tx: 'a', at: [-1.9, 3] }, { tx: 'b', at: [-1.9, 0] }, { tacka: 'ABCDE' }, ...['AD', 'AE', 'BD', 'BE', 'CD', 'CE'].map((d, i) => ({ d, b: 2, k: 2, crtaj: 1, kasni: 0.2 + i * 0.3 }))];
    Z(3, 'Prave $a$ i $b$ su paralelne. Tačke $A$, $B$, $C$ su na $a$, a $D$ i $E$ na $b$. Koliko različitih pravih određuje ovih $5$ tačaka?',
      ['$8$', '$10$', '$6$', '$7$'],
      [K('Tačke na istoj pravoj ne daju nove prave: sve tri na $a$ određuju samo pravu $a$, a $D$, $E$ samo pravu $b$ – to su $2$ prave.'),
       K('Svaka tačka sa $a$ i svaka sa $b$ daju po jednu novu pravu: $3 · 2 = 6$.'),
       K('Ukupno $2 + 6 = 8$ pravih.')],
      G(t, e, { bezImena: ['a1', 'a2', 'b1', 'b2'], velicina: 260 }));
  }
  {
    const t = pravilni(5, 3);
    const e = [{ tacka: 'ABCDE' }, ...sveDuzi('ABCDE').map((d, i) => ({ d, b: i % 6, k: 1, crtaj: 1, kasni: 0.2 + i * 0.25 }))];
    Z(3, 'Dato je $5$ tačaka od kojih nikoje tri nisu na jednoj pravoj. Koliko trouglova imaju temena u tim tačkama?',
      ['$10$', '$5$', '$60$', '$15$'],
      [K('Trougao je određen izborom $3$ tačke od $5$.'),
       K('Isto je kao izabrati $2$ tačke koje NISU temena – a parova ima koliko i duži: $10$.'),
       K('Dakle trouglova ima $10$.')],
      G(t, e, { velicina: 200 }));
  }
  Z(1, 'Prave $a$ i $b$ seku se u tački $O$. Šta je presek $a ∩ b$?',
    ['skup $\\{O\\}$', 'tačka $O$ i prava $a$', 'prazan skup', 'prava $b$'],
    [K('Presek čine zajedničke tačke obe prave.'),
     K('Dve različite prave koje se seku imaju tačno jednu zajedničku tačku: $a ∩ b = \\{O\\}$.', ['o'])],
    G({ O: [0, 0, 225], a1: [-4, -2], a2: [4, 2], b1: [-3, 3], b2: [3, -3] }, [{ d: 'a1a2', b: 0 }, { d: 'b1b2', b: 1 }, { tacka: 'O', id: 'o', k: 0 }, { tx: 'a', at: [4.3, 2.3] }, { tx: 'b', at: [3.3, -3.3] }], { bezImena: ['a1', 'a2', 'b1', 'b2'], velicina: 200 }));

  Z(2, 'Tačke $A$, $B$, $C$ su na pravoj, a $B$ je između $A$ i $C$. Šta je $AB ∪ BC$ (unija duži)?',
    ['duž $AC$', 'tačka $B$', 'prava $AC$', 'prazan skup'],
    [K('Duž $AB$ (plava) i duž $BC$ (roze) se nadovezuju u tački $B$.', ['ab', 'bc']),
     K('Zajedno pokrivaju sve tačke od $A$ do $C$: $AB ∪ BC = AC$. (Presek bi bio $\\{B\\}$.)')],
    G({ A: [0, 0], B: [3, 0], C: [7, 0] }, [{ d: 'AB', b: 0, id: 'ab', debljina: 5 }, { d: 'BC', b: 1, id: 'bc', debljina: 5 }, { tacka: 'ABC' }], { velicina: 240 }));

  Z(3, 'Na koliko najviše delova tri prave mogu da podele ravan?',
    ['$7$', '$6$', '$8$', '$4$'],
    [K('Jedna prava deli ravan na $2$ dela, dve prave koje se seku na $4$.'),
     K('Treća prava seče obe prave u dve različite tačke, pa prolazi kroz $3$ dela i svaki deli na dva: $4 + 3 = 7$.'),
     K('(Ako su sve tri paralelne – $4$ dela; ako prolaze kroz istu tačku – $6$.)')],
    G({ a1: [-4, -1], a2: [4, 1], b1: [-3, 3], b2: [3, -3], c1: [-1, -3.5], c2: [3.5, 3.5] }, [{ d: 'a1a2', b: 0, crtaj: 1 }, { d: 'b1b2', b: 1, crtaj: 1, kasni: 0.8 }, { d: 'c1c2', b: 2, crtaj: 1, kasni: 1.6 },
      ...[[1, 2.5], [-2.5, 0.5], [-1.5, -2.5], [2.5, -1.5], [3.2, 0.5], [0.2, -0.4], [-3, 2.5]].map(([x, y], i) => ({ tx: String(i + 1), at: [x, y], b: 3, k: 3 }))], { bezImena: ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'], velicina: 220 }));

  // ════════════════ 2.2 Odnosi pravih ════════════════
  L('Odnosi pravih u ravni');

  Z(1, 'Prave $a$ i $b$ su paralelne, a prava $c$ seče pravu $a$. Šta važi za prave $c$ i $b$?',
    ['$c$ seče i $b$', '$c$ je paralelna sa $b$', '$c$ i $b$ se poklapaju', 'ne može se odrediti'],
    [K('Kad bi $c$ bila paralelna sa $b$, kroz presečnu tačku $c$ i $a$ prolazile bi dve različite paralele sa $b$ – to je nemoguće.'),
     K('Zato $c$ seče i pravu $b$.', ['c'])],
    G({ a1: [-4, 1.5], a2: [4, 1.5], b1: [-4, -1.5], b2: [4, -1.5], c1: [-2, 3.5], c2: [2.5, -3.5] }, [{ d: 'a1a2', b: 0 }, { d: 'b1b2', b: 0 }, { d: 'c1c2', b: 1, id: 'c', crtaj: 1 }, { tx: 'a', at: [4.4, 1.5] }, { tx: 'b', at: [4.4, -1.5] }, { tx: 'c', at: [2.8, -3.6] }], { bezImena: ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'], velicina: 200 }));

  Z(1, 'Prave $a$ i $b$ su normalne, a prave $b$ i $c$ su takođe normalne. Kakve su prave $a$ i $c$?',
    ['paralelne', 'normalne', 'seku se pod uglom od $45°$', 'ne može se odrediti'],
    [K('Obe prave $a$ i $c$ su normalne na istu pravu $b$.'),
     K('Dve prave normalne na istu pravu su paralelne: $a ∥ c$.', ['a', 'c'])],
    G({ b1: [-4, 0], b2: [4, 0], a1: [-2, -3], a2: [-2, 3], c1: [2, -3], c2: [2, 3], P: [-2, 0], Q: [2, 0], X: [4, 0], Y: [2, 3] }, [{ d: 'b1b2', b: 1 }, { d: 'a1a2', b: 0, id: 'a' }, { d: 'c1c2', b: 2, id: 'c' }, { pu: 'XPa2' }, { pu: 'XQY' }, { tx: 'a', at: [-2.4, 3] }, { tx: 'b', at: [4.3, 0.3] }, { tx: 'c', at: [2.4, 3] }], { bezImena: ['P', 'Q', 'X', 'Y', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'], velicina: 200 }));

  Z(1, 'Koliko pravih paralelnih sa pravom $p$ prolazi kroz tačku $A$ koja ne pripada pravoj $p$?',
    ['tačno jedna', 'nijedna', 'dve', 'beskonačno mnogo'],
    [K('To je aksioma paralelnosti: kroz tačku van prave prolazi tačno jedna prava paralelna sa njom.'),
     K('Sve ostale prave kroz $A$ (sive) pre ili kasnije seku $p$.', ['q'])],
    G({ A: [0, 2], p1: [-4, 0], p2: [4, 0], q1: [-4, 2], q2: [4, 2], r1: [-3, 4], r2: [3, 0], s1: [3, 4], s2: [-3, 0] }, [{ d: 'p1p2', b: 0 }, { tx: 'p', at: [4.3, 0.3] }, { tacka: 'A' }, { d: 'r1r2', b: 4, isp: 1, k: 2 }, { d: 's1s2', b: 4, isp: 1, k: 2 }, { d: 'q1q2', b: 1, id: 'q', k: 1, crtaj: 1 }], { bezImena: ['p1', 'p2', 'q1', 'q2', 'r1', 'r2', 's1', 's2'], velicina: 200 }));

  Z(2, 'Prave $a ∥ b$, a prava $c$ je normalna na $a$. Kakav je odnos pravih $c$ i $b$?',
    ['$c ⊥ b$', '$c ∥ b$', '$c$ i $b$ se ne seku', 'seku se, ali nisu normalne'],
    [K('Prava $c$ seče $a$, pa seče i paralelnu pravu $b$.'),
     K('Pravi ugao sa $a$ „klizi“ duž $c$ do prave $b$ – i tamo je ugao prav: $c ⊥ b$.', ['u'])],
    G({ a1: [-4, 2], a2: [4, 2], b1: [-4, -1], b2: [4, -1], c1: [0, 3.5], c2: [0, -2.5], P: [0, 2], Q: [0, -1], X: [3, 2], Y: [3, -1] }, [{ d: 'a1a2', b: 0 }, { d: 'b1b2', b: 0 }, { d: 'c1c2', b: 1 }, { pu: 'XPc1' }, { pu: 'YQc1', id: 'u', k: 2 }, { tx: 'a', at: [4.4, 2] }, { tx: 'b', at: [4.4, -1] }, { tx: 'c', at: [0.4, 3.5] }], { bezImena: ['P', 'Q', 'X', 'Y', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'], velicina: 200 }));

  Z(2, 'Na kvadratnoj mreži su nacrtane prave $a$, $b$, $c$ i $d$. Koje dve su paralelne?',
    ['$a$ i $c$', '$a$ i $b$', '$b$ i $d$', '$c$ i $d$'],
    [K('Prava $a$: za $2$ kvadratića udesno ide $1$ nagore. Prava $c$: isto – $2$ udesno, $1$ nagore.', ['a', 'c']),
     K('Isti „nagib“ znači da su paralelne: $a ∥ c$. Prava $b$ ide $1$ udesno pa $2$ nagore, a $d$ je strmija.')],
    G({ O: [0, 0] }, [papir(0, 8, 0, 6), { lin: [[0, 0], [8, 4]], b: 0, id: 'a' }, { lin: [[0, 2], [8, 6]], b: 2, id: 'c' }, { lin: [[2, 0], [5, 6]], b: 1, id: 'b' }, { lin: [[5, 0], [7, 6]], b: 5, id: 'd' }, { tx: 'a', at: [7.6, 3.3] }, { tx: 'c', at: [6, 5.5] }, { tx: 'b', at: [4.5, 5.8] }, { tx: 'd', at: [7.1, 4.2] }], { ...bez, velicina: 240 }));

  Z(2, 'Na mreži kvadratića stranice $1 cm$ data je tačka $A$ i prava $p$. Koliko je rastojanje tačke $A$ od prave $p$?',
    ['$3 cm$', '$4 cm$', '$5 cm$', '$2 cm$'],
    [K('Rastojanje tačke od prave meri se po normali – najkraćom duži od tačke do prave.', ['n']),
     K('Normala iz $A$ na horizontalnu pravu $p$ je vertikalna: $3$ kvadratića, tj. $3 cm$. (Kose duži do $p$ su duže.)')],
    G({ A: [3, 4], N: [3, 1, 270], X: [5, 1], M: [7, 1] }, [papir(0, 8, 0, 5), { lin: [[0, 1], [8, 1]], b: 0 }, { tx: 'p', at: [7.8, 1.4] }, { tacka: 'A' }, { d: 'AN', b: 1, id: 'n', k: 1, crtaj: 1 }, { pu: 'ANX', k: 1 }, { d: 'AM', b: 4, isp: 1, k: 2 }], { bezImena: ['X', 'M', 'N'], velicina: 240 }));

  Z(2, 'Date su četiri prave: $a ∥ b$ i $c ∥ d$, a $a$ i $c$ se seku. U koliko tačaka se seku ove prave?',
    ['$4$', '$2$', '$6$', '$8$'],
    [K('Paralelne prave nemaju zajedničkih tačaka: parovi $a, b$ i $c, d$ ne daju preseke.'),
     K('Svaka od $a, b$ seče svaku od $c, d$: $2 · 2 = 4$ tačke – temena paralelograma.', ['p'])],
    G({ A: [0, 0], B: [5, 0], C: [7, 3], D: [2, 3], a1: [-2, 0], a2: [9, 0], b1: [-2, 3], b2: [9, 3], c1: [-1.33, -2], c2: [3.33, 5], d1: [3.67, -2], d2: [8.33, 5] }, [{ d: 'a1a2', b: 0 }, { d: 'b1b2', b: 0 }, { d: 'c1c2', b: 1 }, { d: 'd1d2', b: 1 }, { p: 'ABCD', b: 3, id: 'p', k: 2 }, { tacka: 'ABCD', k: 2 }], { bezImena: ['A', 'B', 'C', 'D', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'd1', 'd2'], velicina: 240 }));

  Z(3, 'Prave $a$ i $b$ su paralelne i obe ih seče prava $c$. Koliko polupravih (sa početkom u presečnim tačkama) određuju ove tri prave?',
    ['$8$', '$6$', '$4$', '$12$'],
    [K('Presečne tačke su dve: $M = a ∩ c$ i $N = b ∩ c$.'),
     K('Na pravoj $a$: tačka $M$ daje $2$ poluprave; na $b$: tačka $N$ daje $2$.'),
     K('Na pravoj $c$ su obe tačke: $2 + 2 = 4$ poluprave. Ukupno $2 + 2 + 4 = 8$.')],
    G({ M: [0, 2, 135], N: [2, -2, 315], a1: [-4, 2], a2: [5, 2], b1: [-4, -2], b2: [5, -2], c1: [-1, 4], c2: [3, -4] }, [{ d: 'a1a2', b: 0 }, { d: 'b1b2', b: 0 }, { d: 'c1c2', b: 1 }, { tacka: 'MN' }, { tx: 'a', at: [5.3, 2] }, { tx: 'b', at: [5.3, -2] }, { tx: 'c', at: [3.3, -4] }], { bezImena: ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'], velicina: 200 }));

  Z(3, 'Tri prave su međusobno paralelne, a još dve prave se seku i nisu paralelne ni sa jednom od njih. Koliko ukupno ima presečnih tačaka?',
    ['$7$', '$6$', '$10$', '$5$'],
    [K('Paralelne prave se međusobno ne seku.'),
     K('Svaka od $2$ „kose“ prave seče svaku od $3$ paralelne: $2 · 3 = 6$ tačaka.'),
     K('I dve kose prave se seku međusobno: još $1$. Ukupno $7$ (ako se ne seku baš na nekoj od paralela).')],
    G({ O: [0, 0] }, [{ lin: [[-5, 2], [5, 2]], b: 0 }, { lin: [[-5, 0], [5, 0]], b: 0 }, { lin: [[-5, -2], [5, -2]], b: 0 }, { lin: [[-4, -3.5], [3, 3.5]], b: 1, crtaj: 1 }, { lin: [[4, -3.5], [-1.5, 3.5]], b: 2, crtaj: 1, kasni: 1 }], { ...bez, velicina: 200 }));

  // ════════════════ 2.3 Merenje dužine ════════════════
  L('Merenje dužine i jednakost duži');

  Z(1, 'Koliko centimetara je $1 m 3 dm 5 cm$?',
    ['$135 cm$', '$1 035 cm$', '$13,5 cm$', '$1 305 cm$'],
    [K('$1 m = 100 cm$, $3 dm = 30 cm$.'),
     K('$100 + 30 + 5 = 135 cm$')]);

  Z(1, 'Na lenjiru je prikazana duž $AB$. Kolika je njena dužina?',
    ['$4 cm 8 mm$', '$7 cm 1 mm$', '$5 cm 2 mm$', '$4 cm 2 mm$'],
    [K('Tačka $A$ je na $2 cm 3 mm$, a tačka $B$ na $7 cm 1 mm$ – duž ne počinje od nule!'),
     K('$71 mm − 23 mm = 48 mm = 4 cm 8 mm$.', ['ab'])],
    G({ A: [2.3, 0.9, 90], B: [7.1, 0.9, 90] }, [{ osa: [0, 8], podela: 0.1, svaki: 10 }, { d: 'AB', b: 1, debljina: 5, id: 'ab' }, { tacka: 'AB' }], { velicina: 320 }));

  Z(1, 'Da li su duži $AB = 245 mm$ i $CD = 25 cm$ jednake?',
    ['ne, $CD$ je duža za $5 mm$', 'da, jednake su', 'ne, $AB$ je duža za $5 mm$', 'ne, $CD$ je duža za $5 cm$'],
    [K('Pretvaramo u iste jedinice: $25 cm = 250 mm$.'),
     K('$250 mm − 245 mm = 5 mm$: $CD$ je duža.')]);

  Z(1, 'Koliko milimetara je $3 m 1 dm 4 cm$?',
    ['$3 140 mm$', '$314 mm$', '$3 014 mm$', '$31 400 mm$'],
    [K('$1 m = 1 000 mm$, $1 dm = 100 mm$, $1 cm = 10 mm$.'),
     K('$3 000 + 100 + 40 = 3 140 mm$')]);

  Z(2, 'Visina koša u košarci je $10$ stopa, a jedna stopa je $305 mm$. Kolika je visina koša?',
    ['$3 m 5 cm$', '$3 m 50 cm$', '$30 m 5 cm$', '$3 m 5 mm$'],
    [K('$10 · 305 mm = 3 050 mm$.'),
     K('$3 050 mm = 3 000 mm + 50 mm = 3 m 5 cm$.')]);

  Z(2, 'Koje su dve duži jednake: $MN = 3 dm 4 mm$, $PQ = 34 cm$, $RS = 304 mm$?',
    ['$MN$ i $RS$', '$MN$ i $PQ$', '$PQ$ i $RS$', 'nijedne dve'],
    [K('Sve u milimetrima: $MN = 300 + 4 = 304 mm$, $PQ = 340 mm$, $RS = 304 mm$.'),
     K('Jednake su $MN$ i $RS$.')]);

  Z(2, 'Stranice trougla su $12 cm$, $85 mm$ i $1 dm 5 mm$. Koliki je obim trougla?',
    ['$31 cm$', '$102 cm$', '$30 cm 2 mm$', '$22 cm$'],
    [K('U milimetrima: $120 mm$, $85 mm$, $105 mm$.'),
     K('$O = 120 + 85 + 105 = 310 mm = 31 cm$.')]);

  Z(2, 'Na mreži kvadratića su nacrtane duži $a$, $b$, $c$ i $d$. Koje dve su sigurno jednake?',
    ['$a$ i $c$', '$a$ i $b$', '$b$ i $d$', 'sve četiri'],
    [K('Duž $a$ ima $3$ kvadratića horizontalno, $c$ ima $3$ kvadratića vertikalno – jednake su.', ['a', 'c']),
     K('Kosa duž $b$ (preko $3$ kvadratića) je duža od $3$ – kao dijagonala; $d$ ima samo $2$ kvadratića.'),
     K('Proveri prenošenjem: $c$ okrenuta oko kraja poklopi se sa $a$.', [], G({ P: [0, 4] }, [papir(0, 8, 0, 5), { lin: [[0, 4], [3, 4]], b: 0, debljina: 4 }, { lin: [[0, 4], [0, 1]], b: 2, debljina: 4, okreni: 90, oko: 'P' }], { bezImena: ['P'], velicina: 220 }))],
    G(O, [papir(0, 8, 0, 5), { lin: [[0, 4], [3, 4]], b: 0, debljina: 4, id: 'a' }, { lin: [[4, 1], [7, 4]], b: 1, debljina: 4, id: 'b' }, { lin: [[1, 0.5], [1, 3.5]], b: 2, debljina: 4, id: 'c' }, { lin: [[5, 0.5], [7, 0.5]], b: 5, debljina: 4, id: 'd' },
      { tx: 'a', at: [1.5, 4.4] }, { tx: 'b', at: [5.2, 3] }, { tx: 'c', at: [1.4, 2] }, { tx: 'd', at: [6, 0.9] }], { ...bez, velicina: 240 }));

  Z(3, 'Od komada platna dugog $1 632 cm$ odsecaju se jednaki komadi dok god je moguće. Koliki komadi daju najkraći ostatak?',
    ['$4 cm$', '$7 cm$', '$5 cm$', '$9 cm$'],
    [K('Ostatak je ostatak pri deljenju $1 632$ dužinom komada.'),
     K('$1 632 : 7$ → ostatak $1$; $: 5$ → ostatak $2$; $: 9$ → ostatak $3$ (zbir cifara $12$).'),
     K('$32$ je deljiv sa $4$, pa je $1 632$ deljiv sa $4$: ostatak $0$ – najkraći.')]);
  proveri(1632 % 7 === 1 && 1632 % 5 === 2 && 1632 % 9 === 3 && 1632 % 4 === 0, 'platno');

  Z(3, 'Dete pravi korake dužine $65 cm$. Koliko najmanje koraka treba da napravi da pređe $20 m$?',
    ['$31$', '$30$', '$32$', '$3$'],
    [K('$20 m = 2 000 cm$. $2 000 : 65 = 30$, ostatak $50$.'),
     K('Posle $30$ koraka pređe $1 950 cm$ – fali još $50 cm$, pa treba još jedan korak: $31$.')]);
  proveri(2000 - 30 * 65 === 50, 'koraci');

  // ════════════════ 2.4 Prenošenje i nadovezivanje duži ════════════════
  L('Prenošenje i nadovezivanje duži');

  Z(1, 'Date su duži $AB = 5 cm 3 mm$ i $CD = 4 cm 7 mm$. Kolika je dužina duži dobijene njihovim nadovezivanjem?',
    ['$10 cm$', '$11 cm$', '$9 cm$', '$6 mm$'],
    [K('$AB = 53 mm$, $CD = 47 mm$. Nadovezivanje = sabiranje dužina.', ['cd']),
     K('$53 + 47 = 100 mm = 10 cm$.')],
    G({ A: [0, 0], B: [5.3, 0], C: [0, -1.5], D: [4.7, -1.5], E: [5.3, 0], F: [10, 0] }, [{ d: 'AB', b: 0, debljina: 4 }, { d: 'CD', b: 1, debljina: 4, id: 'cd', pomeri: [5.3, 1.5], k: 1 }, { d: 'CD', b: 1, debljina: 4, kraj: 1 }, { tacka: 'AB' }], { bezImena: ['E', 'F'], velicina: 280 }));

  Z(1, 'Za koliko je duž $AB = 5 cm 3 mm$ duža od duži $CD = 4 cm 7 mm$?',
    ['$6 mm$', '$1 cm 4 mm$', '$1 cm 6 mm$', '$4 mm$'],
    [K('Prenosimo $CD$ šestarom na $AB$ od tačke $A$: ostaje deo $DB$.', ['ost']),
     K('$53 mm − 47 mm = 6 mm$.')],
    G({ A: [0, 0], B: [5.3, 0], D: [4.7, 0, 270] }, [{ d: 'AB', b: 0, debljina: 4 }, { l: 'A', r: 4.7, od: 0, do: 40, b: 4, k: 1, crtaj: 1 }, { d: 'AD', b: 1, debljina: 6, k: 1 }, { d: 'DB', b: 3, debljina: 6, k: 2, id: 'ost' }, { tacka: 'AB' }, { tacka: 'D', k: 1 }], { velicina: 260 }));

  {
    const t = { A: [0, 0], B: [3, 0], C: [3, 3], D: [0, 3] };
    Z(1, 'Stranica kvadrata je $3 cm$. Ako stranice nadovežemo jednu na drugu (kao da „odmotamo“ kvadrat), kolika je dobijena duž?',
      ['$12 cm$', '$9 cm$', '$6 cm$', '$3 cm$'],
      [K('Nadovezivanjem $4$ stranice dobijamo duž jednaku obimu kvadrata.'),
       K('„Odmotavanje“: $3 + 3 + 3 + 3 = 4 · 3 = 12 cm$.', [], G({ ...t, P: [3, 0], Q: [6, 0], R: [9, 0], S: [12, 0] }, [{ p: 'ABCD', prazno: 1, b: 4, isp: 1 }, { d: 'AB', b: 0, debljina: 4 }, { d: 'BC', b: 1, debljina: 4, okreni: -90, oko: 'B', kasni: 0.3 }, { d: 'CD', b: 2, debljina: 4, pomeri: [6, -3], kasni: 1.6 }, { d: 'DA', b: 5, debljina: 4, okreni: 90, oko: 'A', kasni: 2.4 }, { tx: '12 cm', at: [3, -1.3], b: 3 }], { bezImena: ['P', 'Q', 'R', 'S'], velicina: 300 }))],
      G(t, [{ p: 'ABCD' }, { d: 'AB', o: '3 cm' }], { velicina: 150 }));
  }

  Z(1, 'Šestar je otvoren $3 cm$. Ako ga $5$ puta uzastopno prenesemo duž prave počevši od tačke $A$, koliko je udaljen kraj od tačke $A$?',
    ['$15 cm$', '$8 cm$', '$18 cm$', '$12 cm$'],
    [K('Svako prenošenje dodaje duž od $3 cm$.'),
     K('$5 · 3 = 15 cm$.', ['s'])],
    G({ A: [0, 0, 270] }, [{ osa: [0, 16], podela: 1, svaki: 3 }, { tacka: 'A' }, ...skokovi(0, 3, 5, { h: 1.5, k: 1, id: 's', razmak: 0.5 })], { velicina: 300 }));

  Z(2, 'Izlomljena linija se sastoji od $5$ duži dužine $2 cm 5 mm$. Kolika je duž jednaka dužini te linije?',
    ['$12 cm 5 mm$', '$10 cm 25 mm$', '$7 cm 5 mm$', '$12 cm$'],
    [K('$2 cm 5 mm = 25 mm$; $5 · 25 mm = 125 mm$.'),
     K('$125 mm = 12 cm 5 mm$.')],
    G({ O: [0, 0] }, [{ lin: [[0, 0], [2, 1.5], [4.5, 1.5], [6.5, 0], [8.5, 1.5], [11, 1.5]], b: 0, debljina: 3, crtaj: 1, trajanje: 2 }], { ...bez, velicina: 260 }));

  Z(2, 'Tačke $A$ i $B$ su udaljene $8 cm$. Tačka $C$ je na duži $AB$ i $AC = 3 cm$, a $M$ je sredina duži $CB$. Koliko je $AM$?',
    ['$5 cm 5 mm$', '$4 cm$', '$5 cm$', '$2 cm 5 mm$'],
    [K('$CB = 8 − 3 = 5 cm$.', ['cb']),
     K('$M$ je sredina, pa je $CM = 5 : 2 = 2 cm 5 mm$.'),
     K('$AM = AC + CM = 3 cm + 2 cm 5 mm = 5 cm 5 mm$.', ['am'])],
    G({ A: [0, 0], B: [8, 0], C: [3, 0], M: [5.5, 0] }, [{ d: 'AB', b: 4 }, { d: 'CB', b: 1, debljina: 5, id: 'cb', k: 1 }, { d: 'AM', b: 2, debljina: 5, id: 'am', k: 3 }, { tacka: 'ABCM' }, { d: 'AC', o: '3 cm', b: 0 }], { velicina: 280 }));

  Z(2, 'Pravougaonik ima stranice $3 cm$ i $2 cm$. Kolika je duž jednaka obimu pravougaonika?',
    ['$10 cm$', '$5 cm$', '$6 cm$', '$12 cm$'],
    [K('Obim = zbir sve četiri stranice: $3 + 2 + 3 + 2$.'),
     K('$O = 2 · (3 + 2) = 10 cm$.')],
    G({ A: [0, 0], B: [3, 0], C: [3, 2], D: [0, 2] }, [{ p: 'ABCD' }, { d: 'AB', o: '3 cm' }, { d: 'BC', o: '2 cm' }, { lin: [[0, 0], [3, 0], [3, 2], [0, 2], [0, 0]], b: 1, crtaj: 1, trajanje: 2.5, ponovi: 1 }], { velicina: 160 }));

  Z(3, 'Tačke $A$, $B$, $C$, $D$ su tim redom na pravoj, $AB = CD$, $AD = 14 cm$ i $BC = 4 cm$. Kolika je duž $AB$?',
    ['$5 cm$', '$10 cm$', '$7 cm$', '$4 cm$'],
    [K('$AD = AB + BC + CD$, pa je $AB + CD = 14 − 4 = 10 cm$.'),
     K('Pošto je $AB = CD$: $AB = 10 : 2 = 5 cm$.', ['ab', 'cd'])],
    G({ A: [0, 0], B: [5, 0], C: [9, 0], D: [14, 0] }, [{ d: 'AD', b: 4 }, { d: 'AB', b: 1, debljina: 5, id: 'ab' }, { d: 'CD', b: 1, debljina: 5, id: 'cd' }, { d: 'BC', o: '4 cm', b: 0 }, { tacka: 'ABCD' }, { lin: [[0, -0.8], [14, -0.8]], b: 3, debljina: 1.5 }, { tx: '14 cm', at: [7, -1.4] }], { velicina: 300 }));

  Z(3, 'Tačke $A$, $B$, $C$, $D$ su tim redom na pravoj. $AC = 10 cm$, $BD = 12 cm$ i $AD = 16 cm$. Kolika je duž $BC$?',
    ['$6 cm$', '$4 cm$', '$2 cm$', '$8 cm$'],
    [K('Kad saberemo $AC + BD = 22 cm$, deo $BC$ je brojan dvaput.', ['bc']),
     K('$AD = AC + BD − BC$, pa je $BC = 22 − 16 = 6 cm$.')],
    G({ A: [0, 0], B: [4, 0], C: [10, 0], D: [16, 0] }, [{ d: 'AD', b: 4 }, { lin: [[0, 0.7], [10, 0.7]], b: 0, debljina: 4 }, { tx: '10', at: [5, 1.2] }, { lin: [[4, -0.7], [16, -0.7]], b: 1, debljina: 4 }, { tx: '12', at: [10, -1.3] }, { d: 'BC', b: 3, debljina: 6, id: 'bc', k: 1 }, { tacka: 'ABCD' }], { velicina: 300 }));

  // ════════════════ 2.5 Mnogougao ════════════════
  L('Mnogougao');

  Z(1, 'Koji od nacrtanih mnogouglova NIJE konveksan?',
    ['$2$', '$1$', '$3$', '$4$'],
    [K('Mnogougao je konveksan ako duž između bilo koje dve njegove tačke ostaje u njemu.'),
     K('Kod lika $2$ duž između dva „kraka“ izlazi napolje – on nije konveksan.', ['d'])],
    G({ O: [0, 0] }, [{ lin: [[0, 0], [3, 0], [3.5, 2], [1.5, 3.2], [-0.5, 2]], zatv: 1, b: 0 }, { tx: '1', at: [1.5, 1.4], vel: 20 },
      { lin: [[5, 0], [8.5, 0], [8.5, 3], [6.75, 1.2], [5, 3]], zatv: 1, b: 1 }, { tx: '2', at: [6.75, 0.5], vel: 20 }, { lin: [[5.3, 2.6], [8.2, 2.6]], b: 3, isp: 1, k: 2, id: 'd' },
      { lin: [[10, 0], [13, 0], [11.5, 3]], zatv: 1, b: 2 }, { tx: '3', at: [11.5, 1], vel: 20 },
      { lin: [[14.5, 0.5], [16, 0], [17.5, 0.5], [17.5, 2.5], [16, 3], [14.5, 2.5]], zatv: 1, b: 5 }, { tx: '4', at: [16, 1.5], vel: 20 }], { ...bez, velicina: 320 }));

  Z(1, 'Koliko dijagonala ima petougao?',
    ['$5$', '$10$', '$3$', '$2$'],
    [K('Iz svakog temena idu dijagonale ka $2$ nesusedna temena.'),
     K('$5 · 2 = 10$, ali je svaka dijagonala brojana dvaput: $10 : 2 = 5$.', ['dg'])],
    G(pravilni(5, 3), [{ p: 'ABCDE' }, ...['AC', 'AD', 'BD', 'BE', 'CE'].map((d, i) => ({ d, b: 1, k: 2, id: 'dg', crtaj: 1, kasni: 0.2 + i * 0.4 }))], { velicina: 180 }));

  Z(1, 'Stranice petougla su $3 cm$, $4 cm$, $25 mm$, $35 mm$ i $5 cm$. Koliki je obim?',
    ['$18 cm$', '$71 cm$', '$15 cm$', '$18 mm$'],
    [K('Sve u milimetrima: $30 + 40 + 25 + 35 + 50$.'),
     K('$= 180 mm = 18 cm$.')]);

  Z(2, 'Na koliko najviše delova tri prave mogu da podele krug (unutrašnjost kruga)?',
    ['$7$', '$6$', '$8$', '$9$'],
    [K('Svaka nova prava, koja seče sve prethodne unutar kruga u različitim tačkama, dodaje onoliko delova kroz koliko prolazi.'),
     K('$2 → 4 → 7$: treća prava prolazi kroz $3$ dela i deli svaki na dva.')],
    G({ O: [0, 0] }, [krug(0, 0, 4, { b: 4, prazno: 1 }), { lin: [[-3.9, -0.8], [3.9, 0.9]], b: 0, crtaj: 1 }, { lin: [[-2, 3.46], [1.6, -3.66]], b: 1, crtaj: 1, kasni: 0.8 }, { lin: [[-3.2, -2.4], [3.4, 2.1]], b: 2, crtaj: 1, kasni: 1.6, k: 1 }], { ...bez, velicina: 200 }));

  Z(2, 'Šta NE može biti presek kvadrata i prave?',
    ['dve odvojene duži', 'prazan skup', 'jedna tačka', 'jedna duž'],
    [K('Prava može da promaši kvadrat (prazan skup), da ga dodirne u temenu (tačka) ili da ga preseče (duž).', ['a', 'b', 'c']),
     K('Kvadrat je konveksan: ulazni i izlazni deo prave čine jednu duž, pa dve odvojene duži nisu moguće.')],
    G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [{ p: 'ABCD', b: 0 }, { lin: [[-1, 5.5], [6, 5.5]], b: 1, id: 'a', k: 1 }, { lin: [[2, 6], [6, 2]], b: 2, id: 'b', k: 1 }, { lin: [[-1, 1], [5, 3]], b: 5, id: 'c', k: 1 }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 180 }));

  Z(2, 'Koliko puta zatvorena izlomljena linija na slici (petokraka zvezda) seče samu sebe?',
    ['$5$', '$10$', '$4$', '$6$'],
    [K('Svaka „ivica“ zvezde seče dve druge, a svaki presek pripada dvema ivicama.'),
     K('$5 · 2 : 2 = 5$ tačaka samopresecanja – temena unutrašnjeg petougla.', ['p'])],
    (() => { const t = pravilni(5, 4, [0, 0], 90); const u = {}; [126, 54, -18, -90, -162].forEach((a, i) => (u['PQRST'[i]] = naKrugu([0, 0], 1.53, a))); return G({ ...t, ...u }, [{ lin: ['A', 'C', 'E', 'B', 'D', 'A'].map((n) => t[n]), b: 0, crtaj: 1, trajanje: 2.5 }, { tacka: 'PQRST', id: 'p', k: 2 }], { bezImena: ['A', 'B', 'C', 'D', 'E', 'P', 'Q', 'R', 'S', 'T'], velicina: 180 }); })());

  Z(2, 'Četiri jednaka kvadrata obima $36 cm$ složena su u niz, jedan do drugog. Koliki je obim dobijenog pravougaonika?',
    ['$90 cm$', '$144 cm$', '$72 cm$', '$108 cm$'],
    [K('Stranica jednog kvadrata: $36 : 4 = 9 cm$.'),
     K('Pravougaonik ima stranice $4 · 9 = 36 cm$ i $9 cm$.', ['k2', 'k3', 'k4']),
     K('$O = 2 · (36 + 9) = 90 cm$. (Unutrašnje stranice nisu deo obima!)')],
    G({ O: [0, 0] }, [0, 1, 2, 3].map((i) => ({ lin: [[i * 2.2, 0], [i * 2.2 + 2, 0], [i * 2.2 + 2, 2], [i * 2.2, 2]], zatv: 1, b: i, gusto: 1, id: 'k' + (i + 1), pomeri: [-i * 0.2, 0], kasni: 0.3 + i * 0.3 })), { ...bez, velicina: 280 }));

  Z(3, 'Koliko trouglova ima na slici?',
    ['$6$', '$3$', '$5$', '$4$'],
    [K('Iz temena $A$ idu dve duži do stranice $BC$ i dele je na $3$ dela.'),
     K('Svaki trougao je određen izborom $2$ tačke na $BC$ (od $4$: $B, D, E, C$).', ['t']),
     K('Parova od $4$ tačke ima $6$: $BD, BE, BC, DE, DC, EC$ – dakle $6$ trouglova.')],
    G({ A: [3, 5], B: [0, 0], C: [7, 0], D: [2.5, 0, 270], E: [4.5, 0, 270] }, [{ p: 'ABC', b: 0 }, { d: 'AD' }, { d: 'AE' }, { p: 'ADE', b: 1, id: 't', k: 2 }], { velicina: 200 }));

  Z(3, 'Koliko najviše temena može da ima mnogougao koji je presek dva trougla?',
    ['$6$', '$3$', '$4$', '$9$'],
    [K('Presek dva konveksna lika je konveksan, a svaka stranica preseka leži na nekoj stranici jednog od trouglova.'),
     K('Trouglovi imaju ukupno $6$ stranica, pa presek ima najviše $6$ stranica (temena).'),
     K('Primer: dva trougla kao „Davidova zvezda“ – presek je šestougao.', ['s'])],
    G({ ...pravilni(3, 3, [0, 0], 90), ...pravilni(3, 3, [0, 0], -90, 'DEF') }, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 1 }, { lin: luk(0, 0, 1.732, 0, 360, 6), zatv: 1, b: 3, gusto: 1, id: 's', k: 3 }], { bezImena: ['A', 'B', 'C', 'D', 'E', 'F'], velicina: 180 }));

  // ════════════════ 2.6 Kružnica i krug ════════════════
  L('Kružnica i krug; kružnica i prava');

  Z(1, 'Poluprečnik kruga je $2 cm 5 mm$. Koliki je prečnik?',
    ['$5 cm$', '$4 cm 10 mm$', '$1 cm 2 mm$', '$2 cm 5 mm$'],
    [K('Prečnik je dva poluprečnika – prolazi kroz centar, od kraja do kraja.', ['d']),
     K('$d = 2 · 25 mm = 50 mm = 5 cm$.')],
    G({ O: [0, 0, 90], A: [3, 0], B: [-3, 0] }, [{ kr: 'O', r: 3 }, { d: 'OA', o: '2 cm 5 mm', b: 0 }, { d: 'BA', b: 1, id: 'd', k: 1, crtaj: 1, debljina: 4 }], { velicina: 180 }));

  Z(1, 'Dve paralelne prave su na rastojanju $6 cm$. Koliki je poluprečnik kruga koji dodiruje obe prave?',
    ['$3 cm$', '$6 cm$', '$12 cm$', '$2 cm$'],
    [K('Prečnik takvog kruga je normalan na prave i spaja dodirne tačke – jednak je rastojanju pravih: $6 cm$.', ['d']),
     K('$r = 6 : 2 = 3 cm$. Krug može da „klizi“ između pravih, ali poluprečnik je uvek isti.', ['k'])],
    G({ O: [0, 0], a1: [-5, 3], a2: [5, 3], b1: [-5, -3], b2: [5, -3], T: [0, 3], S: [0, -3] }, [{ d: 'a1a2', b: 0 }, { d: 'b1b2', b: 0 }, { kr: 'O', r: 3, id: 'k', pomeri: [1.5, 0], ponovi: 1, k: 2 }, { d: 'TS', b: 1, id: 'd', k: 1, o: '6 cm' }], { bezImena: ['O', 'T', 'S', 'a1', 'a2', 'b1', 'b2'], velicina: 200 }));

  Z(1, 'Tačka $A$ je na rastojanju $4 cm$ od centra kruga $K(O, 5 cm)$. Gde se nalazi tačka $A$?',
    ['u krugu, ali ne na kružnici', 'na kružnici', 'van kruga', 'u centru kruga'],
    [K('Tačke kružnice su tačno $5 cm$ od centra. $OA = 4 cm < 5 cm$.'),
     K('Zato je $A$ unutar kruga (pripada krugu), ali ne i kružnici.', ['a'])],
    R(G({ O: [0, 0, 225], A: [4, 0, 90] }, [{ kr: 'O', r: 5, pun: 1 }, { d: 'OA', o: '4 cm', b: 1 }, { tacka: 'A', id: 'a', k: 0 }, { tacka: 'O' }], { velicina: 180 })));

  Z(2, 'Kružnice $k_{1}(O, 2 cm)$ i $k_{2}(O, 3 cm)$ imaju isti centar. Šta je presek ove dve kružnice?',
    ['prazan skup', 'tačka $O$', 'kružnica $k_{1}$', 'dve tačke'],
    [K('Svaka tačka kružnice $k_{1}$ je $2 cm$ od $O$, a svaka tačka $k_{2}$ je $3 cm$ od $O$.'),
     K('Nijedna tačka ne može biti istovremeno na $2$ i na $3 cm$ od $O$: presek je prazan. (Presek krugova bi bio ceo manji krug.)')],
    R(G({ O: [0, 0] }, [{ kr: 'O', r: 2, b: 0 }, { kr: 'O', r: 3, b: 1 }, { tacka: 'O' }], { velicina: 160 })));

  Z(2, 'Na kružnici su označene tri tačke $A$, $B$, $C$. Koliko lukova (sa krajevima u ovim tačkama) one određuju?',
    ['$6$', '$3$', '$9$', '$4$'],
    [K('Svaki par tačaka deli kružnicu na dva luka – kraći i duži.'),
     K('Parova je $3$ ($AB$, $BC$, $CA$), pa lukova ima $3 · 2 = 6$.', ['l'])],
    G({ O: [0, 0], A: [3, 0], B: naKrugu([0, 0], 3, 110), C: naKrugu([0, 0], 3, 220) }, [{ kr: 'O', r: 3, b: 4 }, { tacka: 'ABC' }, { l: 'O', r: 3.5, od: 0, do: 110, b: 1, crtaj: 1, str: 1, k: 2, id: 'l' }, { l: 'O', r: 3.9, od: 110, do: 360, b: 2, crtaj: 1, str: 1, k: 2, id: 'l', kasni: 1.2 }], { bezImena: ['O'], velicina: 180 }));

  Z(2, 'Dve kružnice poluprečnika $3 cm$ i $5 cm$ dodiruju se spolja. Koliko su udaljeni njihovi centri?',
    ['$8 cm$', '$2 cm$', '$15 cm$', '$4 cm$'],
    [K('Dodirna tačka je na duži koja spaja centre.', ['t']),
     K('$O_{1}O_{2} = 3 + 5 = 8 cm$. (Da se dodiruju iznutra, bilo bi $5 − 3 = 2 cm$.)')],
    R(G({ P: [0, 0], Q: [8, 0], T: [3, 0, 90] }, [{ kr: 'P', r: 3, b: 0 }, { kr: 'Q', r: 5, b: 1 }, { d: 'PQ', b: 3, isp: 1 }, { tacka: 'T', id: 't', k: 0 }, { tx: 'O₁', at: [0, -0.6] }, { tx: 'O₂', at: [8, -0.6] }], { bezImena: ['P', 'Q'], velicina: 220 })));

  Z(2, 'Rastojanje centra kruga od prave $p$ je $3 cm$, a poluprečnik je $4 cm$. Koliko zajedničkih tačaka imaju prava i kružnica?',
    ['$2$', '$1$', '$0$', '$4$'],
    [K('Upoređujemo rastojanje $d = 3 cm$ sa poluprečnikom $r = 4 cm$.'),
     K('$d < r$: prava ulazi u krug – to je sečica, sa $2$ zajedničke tačke. ($d = r$: tangenta, $1$ tačka; $d > r$: $0$.)', ['p']),
     K('Pomeranjem prave vidimo sva tri slučaja.', [], G({ O: [0, 0] }, [{ kr: 'O', r: 4, b: 4 }, { lin: [[-6, -5], [6, -5]], b: 1, pomeri: [0, 8], trajanje: 3, ponovi: 1 }, { tacka: 'O' }], { bezImena: ['O'], velicina: 180 }))],
    R(G({ O: [0, 0], N: [0, -3, 270], p1: [-6, -3], p2: [6, -3] }, [{ kr: 'O', r: 4, b: 4 }, { d: 'p1p2', b: 1, id: 'p' }, { d: 'ON', o: '3 cm', isp: 1 }, { tacka: 'O' }], { bezImena: ['O', 'N', 'p1', 'p2'], velicina: 180 })));

  Z(3, 'Tri kružnice poluprečnika $2 cm$, $3 cm$ i $4 cm$ dodiruju se spolja, svaka sa svakom. Koliki je obim trougla čija su temena njihovi centri?',
    ['$18 cm$', '$9 cm$', '$24 cm$', '$12 cm$'],
    [K('Stranice trougla spajaju centre kružnica koje se dodiruju: $2 + 3 = 5$, $3 + 4 = 7$, $2 + 4 = 6$.'),
     K('$O = 5 + 7 + 6 = 18 cm$ – dvostruki zbir poluprečnika.', ['t'])],
    (() => {
      // centri: A (r=2) i B (r=3) na 5 cm, C (r=4) na 6 od A i 7 od B
      const A = [0, 0], B = [5, 0], x = (36 - 49 + 25) / 10, C = [x, Math.sqrt(36 - x * x)];
      proveri(Math.abs(Math.hypot(C[0] - B[0], C[1] - B[1]) - 7) < 1e-9, 'tri kružnice');
      return G({ A, B, C: C.map(r) }, [{ kr: 'A', r: 2, b: 0 }, { kr: 'B', r: 3, b: 1 }, { kr: 'C', r: 4, b: 2 }, { p: 'ABC', b: 3, id: 't', k: 1, prazno: 1 }], { bezImena: ['A', 'B', 'C'], velicina: 220 });
    })());

  Z(3, 'Koliko zajedničkih tangenti imaju dve kružnice koje se dodiruju spolja?',
    ['$3$', '$2$', '$4$', '$1$'],
    [K('Dve „spoljne“ tangente dodiruju obe kružnice sa iste strane.', ['s']),
     K('Treća tangenta prolazi kroz dodirnu tačku, normalno na duž koja spaja centre.', ['u']),
     K('Ukupno $3$. (Kružnice koje se ne dodiruju i leže jedna van druge imaju $4$.)')],
    (() => {
      const R1 = 2, R2 = 3, d = 5;
      const ug = Math.asin((R2 - R1) / d); // ugao spoljne tangente
      const T = (c, R, s) => [r(c[0] - R * Math.sin(ug) * 1), r(c[1] + s * R * Math.cos(ug))];
      const e = [{ kr: 'P', r: R1, b: 0 }, { kr: 'Q', r: R2, b: 1 }];
      const linija = (s, id) => { const a = T([0, 0], R1, s), b = T([d, 0], R2, s); const dx = b[0] - a[0], dy = b[1] - a[1]; return { lin: [[r(a[0] - dx * 0.8), r(a[1] - dy * 0.8)], [r(b[0] + dx * 0.6), r(b[1] + dy * 0.6)]], b: 3, k: 1, id, crtaj: 1 }; };
      e.push(linija(1, 's'), linija(-1, 's'), { lin: [[2, -4], [2, 4]], b: 2, k: 2, id: 'u', crtaj: 1 });
      return G({ P: [0, 0], Q: [d, 0] }, e, { bezImena: ['P', 'Q'], velicina: 220 });
    })());

  Z(3, 'Koliko najviše jednakih novčića može da se poređa oko jednog takvog novčića tako da svaki dodiruje srednji (i da se ne preklapaju)?',
    ['$6$', '$4$', '$8$', '$5$'],
    [K('Centri dva susedna novčića i centar srednjeg čine trougao sa sve tri stranice jednake $2r$ – jednakostranični.'),
     K('Oko centra staje tačno $6$ takvih trouglova (svaki ugao je $60°$, a $6 · 60° = 360°$).', ['n'])],
    G({ O: [0, 0] }, [krug(0, 0, 1, { b: 3, gusto: 1 }), ...[0, 1, 2, 3, 4, 5].map((i) => { const c = naKrugu([0, 0], 2, 90 + i * 60); return krug(c[0], c[1], 1, { b: 0, gusto: 1, k: 1, id: 'n', crtaj: 1, kasni: 0.2 + i * 0.35 }); })], { ...bez, velicina: 180 }));

  // ════════════════ 2.7 Centralna simetrija ════════════════
  L('Centralna simetrija');

  Z(1, 'Koja tačka je centralno simetrična tački $A$ u odnosu na tačku $O$?',
    ['$R$', '$P$', '$Q$', '$S$'],
    [K('Slika $A\'$ je na pravoj $AO$, sa druge strane tačke $O$, i $OA\' = OA$.'),
     K('Od $A$ do $O$: $3$ kvadratića udesno i $2$ nadole. Isto toliko dalje od $O$: tačka $R$.', ['s']),
     K('Centralna simetrija je okret za $180°$ oko $O$.', ['ok'])],
    G({ O: [4, 3], A: [1, 5], P: [7, 3], Q: [4, 0], R: [7, 1], S: [6, 1] }, [papir(0, 8, 0, 6), { tacka: 'AOPQRS' }, { d: 'AR', b: 1, isp: 1, k: 2, id: 's' }, { d: 'OA', b: 3, okreni: 180, oko: 'O', k: 3, id: 'ok', debljina: 3 }], { velicina: 220 }));

  Z(1, 'Šta je centar simetrije pravougaonika $ABCD$?',
    ['presek njegovih dijagonala', 'teme $A$', 'sredina stranice $AB$', 'pravougaonik nema centar simetrije'],
    [K('Kad pravougaonik okrenemo za $180°$ oko preseka dijagonala, poklopi se sa samim sobom.', ['ok']),
     K('Teme $A$ prelazi u $C$, $B$ u $D$ – dijagonale se polove u centru.')],
    G({ A: [0, 0], B: [6, 0], C: [6, 3], D: [0, 3], S: [3, 1.5] }, [{ p: 'ABCD' }, { d: 'AC', isp: 1, k: 1 }, { d: 'BD', isp: 1, k: 1 }, { p: 'ABCD', b: 1, okreni: 180, oko: 'S', k: 1, id: 'ok', prazno: 1 }, { tacka: 'S', k: 1 }], { velicina: 200 }));

  Z(1, 'Rastojanje tačke $A$ od centra simetrije $O$ je $3 cm 5 mm$. Koliko je rastojanje tačke $A$ od njene slike $A\'$?',
    ['$7 cm$', '$3 cm 5 mm$', '$6 cm 10 mm$', '$1 cm 7 mm$'],
    [K('$O$ je sredina duži $AA\'$: $OA\' = OA = 3 cm 5 mm$.', ['s']),
     K('$AA\' = 2 · 35 mm = 70 mm = 7 cm$.')],
    G({ A: [0, 0], O: [3.5, 0, 90], X: [7, 0] }, [{ d: 'AO', o: '3 cm 5 mm', b: 0 }, { d: 'AO', b: 1, okreni: 180, oko: 'O', k: 1, id: 's' }, { tacka: 'AO' }, { tx: "A'", at: [7, 0.6], k: 1 }], { bezImena: ['X'], velicina: 240 }));

  Z(1, 'Koje se od ovih slova ne menja kad se okrene za $180°$ (ima centar simetrije)?',
    ['$N$', '$E$', '$K$', '$T$'],
    [K('Okretanjem za $180°$ slovo $N$ ponovo izgleda kao $N$ – centar je u sredini kose crte.', ['n']),
     K('$E$, $K$ i $T$ okrenuti naglavačke izgledaju drugačije.')],
    G({ S: [1, 1.5] }, [{ lin: [[0, 0], [0, 3], [2, 0], [2, 3]], b: 1, debljina: 6, okreni: 180, oko: 'S', k: 1, id: 'n', ponovi: 1 }, { tacka: 'S', k: 1 }], { bezImena: ['S'], velicina: 100 }));

  Z(2, 'Na kružnici $k(O, r)$ data je tetiva $AB$, a $CD$ je njena centralno simetrična slika u odnosu na $O$. Kakav je četvorougao $ABCD$?',
    ['pravougaonik', 'trapez koji nije pravougaonik', 'deltoid', 'trougao'],
    [K('$C$ je slika tačke $A$, a $D$ slika tačke $B$: dijagonale $AC$ i $BD$ su prečnici.', ['d']),
     K('Dijagonale su jednake (obe su prečnici) i polove se u $O$ – takav četvorougao je pravougaonik.', ['p'])],
    (() => { const t = { O: [0, 0], A: naKrugu([0, 0], 3, 150), B: naKrugu([0, 0], 3, 40) }; t.C = [-t.A[0], -t.A[1]]; t.D = [-t.B[0], -t.B[1]]; return G(t, [{ kr: 'O', r: 3, b: 4 }, { d: 'AB', b: 0, debljina: 4 }, { d: 'AB', b: 1, debljina: 4, okreni: 180, oko: 'O', k: 1 }, { d: 'AC', isp: 1, k: 1, id: 'd' }, { d: 'BD', isp: 1, k: 1, id: 'd' }, { p: 'ABCD', b: 2, k: 2, id: 'p' }, { tacka: 'O' }], { bezImena: ['O'], velicina: 180 }); })());

  Z(2, 'Prava $p$ prolazi kroz tačku $O$. Šta je slika prave $p$ pri centralnoj simetriji sa centrom $O$?',
    ['sama prava $p$', 'prava paralelna sa $p$', 'prava normalna na $p$', 'tačka $O$'],
    [K('Svaka tačka $A$ prave $p$ preslikava se u tačku $A\'$ na pravoj $AO$ – a to je baš $p$.'),
     K('Okretanjem za $180°$ oko svoje tačke prava se poklapa sama sa sobom.', ['p'])],
    G({ O: [0, 0], A: [2, 1], p1: [-5, -2.5], p2: [5, 2.5] }, [{ d: 'p1p2', b: 0 }, { d: 'p1p2', b: 1, okreni: 180, oko: 'O', k: 1, id: 'p', debljina: 4 }, { tacka: 'OA' }], { bezImena: ['p1', 'p2'], velicina: 200 }));

  Z(2, '$ABCD$ je paralelogram, $O$ presek dijagonala, a $E$ tačka na stranici $AB$. Kojoj stranici pripada tačka $F$, centralno simetrična tački $E$ u odnosu na $O$?',
    ['$CD$', '$BC$', '$AB$', '$AD$'],
    [K('Pri simetriji oko $O$: $A → C$ i $B → D$, pa stranica $AB$ prelazi u stranicu $CD$.', ['ab']),
     K('Zato je $F$ na $CD$.')],
    G({ A: [0, 0], B: [6, 0], C: [8, 3], D: [2, 3], O: [4, 1.5], E: [2, 0] }, [{ p: 'ABCD' }, { d: 'AC', isp: 1 }, { d: 'BD', isp: 1 }, { tacka: 'OE' }, { d: 'AB', b: 1, debljina: 4, okreni: 180, oko: 'O', k: 1, id: 'ab' }], { velicina: 220 }));

  Z(3, 'Tačka $A$ se preslika centralnom simetrijom oko $B$ u $A_{1}$, a zatim $A_{1}$ oko $C$ u $A_{2}$. Ako je $BC = 4 cm$, koliko je $AA_{2}$?',
    ['$8 cm$', '$4 cm$', '$16 cm$', 'zavisi od položaja tačke $A$'],
    [K('$B$ je sredina $AA_{1}$, a $C$ je sredina $A_{1}A_{2}$.'),
     K('U trouglu $AA_{1}A_{2}$ duž $BC$ spaja sredine dve stranice, pa je dvaput kraća od treće: $AA_{2} = 2 · BC$.', ['bc']),
     K('$AA_{2} = 2 · 4 = 8 cm$ – uvek, gde god da je $A$! (Dve centralne simetrije = translacija za $2 · BC$.)')],
    G({ A: [0, 3], B: [3, 2], C: [7, 2], X: [6, 1], Y: [8, 3] }, [{ tacka: 'ABC' }, { d: 'BC', b: 3, o: '4 cm', id: 'bc' }, { lin: [[0, 3], [6, 1]], b: 1, isp: 1, k: 1, crtaj: 1 }, { tx: 'A₁', at: [6, 0.4], k: 1 }, { lin: [[6, 1], [8, 3]], b: 2, isp: 1, k: 1, crtaj: 1, kasni: 1.2 }, { tx: 'A₂', at: [8.2, 3.5], k: 1 }, { lin: [[0, 3], [8, 3]], b: 0, k: 3, crtaj: 1 }], { bezImena: ['X', 'Y'], velicina: 220 }));

  Z(3, 'Figura se sastoji od dve paralelne prave. Koliko centara simetrije ima ova figura?',
    ['beskonačno mnogo', 'jedan', 'dva', 'nijedan'],
    [K('Svaka tačka $O$ na srednjoj pravoj (jednako udaljenoj od obe) je centar: okret za $180°$ oko nje zamenjuje prave.', ['s']),
     K('Takvih tačaka ima beskonačno mnogo – cela srednja prava.')],
    G({ O: [0, 0], a1: [-5, 1.5], a2: [5, 1.5], b1: [-5, -1.5], b2: [5, -1.5] }, [{ d: 'a1a2', b: 0 }, { d: 'b1b2', b: 1 }, { lin: [[-5, 0], [5, 0]], b: 3, isp: 1, k: 1, id: 's' }, { d: 'a1a2', b: 0, okreni: 180, oko: 'O', k: 1, ponovi: 1 }, { tacka: 'O', k: 1 }], { bezImena: ['O', 'a1', 'a2', 'b1', 'b2'], velicina: 200 }));

  // ════════════════ 2.8 Vektor i translacija ════════════════
  L('Vektor i translacija');

  Z(1, 'Dat je kvadrat $ABCD$. Koja jednakost vektora je tačna?',
    ['$\\vec{AB} = \\vec{DC}$', '$\\vec{AB} = \\vec{CD}$', '$\\vec{AB} = \\vec{BC}$', '$\\vec{AC} = \\vec{BD}$'],
    [K('Jednaki vektori imaju isti pravac, smer i intenzitet (dužinu).'),
     K('$\\vec{AB}$ i $\\vec{DC}$ su paralelni, iste dužine i oba idu „udesno“ ✓', ['ab', 'dc']),
     K('$\\vec{CD}$ ima suprotan smer, $\\vec{BC}$ drugi pravac, a $\\vec{AC}$ i $\\vec{BD}$ su dijagonale različitih pravaca.')],
    G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [{ p: 'ABCD', b: 4, prazno: 1 }, { d: 'AB', str: 1, b: 0, id: 'ab' }, { d: 'DC', str: 1, b: 0, id: 'dc', k: 2 }], { velicina: 160 }));

  Z(1, 'Da li su vektori $\\vec{AB}$ i $\\vec{BA}$ jednaki?',
    ['ne – iste su dužine i pravca, ali suprotnog smera', 'da – iste su dužine', 'da – leže na istoj pravoj', 'ne – različitih su dužina'],
    [K('Oba vektora leže na pravoj $AB$ i imaju istu dužinu.'),
     K('Ali $\\vec{AB}$ ide od $A$ ka $B$, a $\\vec{BA}$ obrnuto – smerovi su suprotni, pa vektori nisu jednaki.', ['ba'])],
    G({ A: [0, 0], B: [5, 0], P: [0, -0.8], Q: [5, -0.8] }, [{ d: 'AB', str: 1, b: 0 }, { d: 'QP', str: 1, b: 1, id: 'ba', k: 2, crtaj: 1 }, { tacka: 'AB' }], { bezImena: ['P', 'Q'], velicina: 220 }));

  Z(1, 'Trougao $ABC$ se translira za vektor $\\vec{v}$ (vidi sliku). Gde dolazi teme $A$?',
    ['$6$ kvadratića desno, $2$ nagore', '$3$ kvadratića desno, $2$ nagore', '$6$ kvadratića desno, $2$ nadole', '$2$ kvadratića desno, $6$ nagore'],
    [K('Translacija pomera svaku tačku za isti vektor: ovde $6$ kvadratića udesno i $2$ nagore.', ['v']),
     K('Ceo trougao „klizi“ bez okretanja – i teme $A$ ide $6$ desno i $2$ gore.', ['t'])],
    G({ A: [0, 0], B: [3, 0], C: [1, 2], M: [0, 4], N: [6, 6] }, [papir(0, 10, 0, 6), { p: 'ABC', b: 0 }, { d: 'MN', str: 1, b: 1, id: 'v' }, { tx: 'v', at: [2.6, 5.4], b: 1 }, { p: 'ABC', b: 2, pomeri: [6, 2], k: 2, id: 't', gusto: 1 }], { bezImena: ['M', 'N'], velicina: 240 }));

  Z(2, 'Tačka $S$ je sredina duži $AB$. Koji vektori su jednaki?',
    ['$\\vec{AS}$ i $\\vec{SB}$', '$\\vec{AS}$ i $\\vec{BS}$', '$\\vec{SA}$ i $\\vec{SB}$', '$\\vec{AS}$ i $\\vec{AB}$'],
    [K('$AS = SB$ (iste dužine), a oba vektora $\\vec{AS}$ i $\\vec{SB}$ idu od $A$ ka $B$.', ['as', 'sb']),
     K('$\\vec{BS}$ i $\\vec{SA}$ idu suprotno, a $\\vec{AB}$ je dvaput duži.')],
    G({ A: [0, 0], S: [3, 0], B: [6, 0] }, [{ d: 'AS', str: 1, b: 0, id: 'as', k: 1 }, { d: 'SB', str: 1, b: 0, id: 'sb', k: 1 }, { d: 'AB', b: 4, kraj: 1 }, { tacka: 'ASB' }], { velicina: 220 }));

  Z(2, 'Lik se prvo translira za $3$ kvadratića udesno i $1$ nagore, a zatim za $2$ kvadratića ulevo i $4$ nagore. Kojom jednom translacijom se dobija isto?',
    ['$1$ udesno, $5$ nagore', '$5$ udesno, $5$ nagore', '$1$ ulevo, $3$ nagore', '$5$ udesno, $3$ nagore'],
    [K('Horizontalno: $3$ udesno pa $2$ ulevo = $1$ udesno.'),
     K('Vertikalno: $1$ nagore pa $4$ nagore = $5$ nagore.', ['z'])],
    G({ A: [1, 0], B: [3, 0], C: [2, 1.5] }, [papir(0, 7, 0, 7), { p: 'ABC', b: 0 }, { p: 'ABC', b: 1, pomeri: [3, 1], prazno: 1, isp: 1, k: 1 }, { lin: [[1, 0], [4, 1]], str: 1, b: 1, k: 1, crtaj: 1 }, { lin: [[4, 1], [2, 5]], str: 1, b: 5, k: 1, crtaj: 1, kasni: 1 }, { lin: [[1, 0], [2, 5]], str: 1, b: 2, k: 2, id: 'z', crtaj: 1 }, { p: 'ABC', b: 2, pomeri: [1, 5], k: 2, gusto: 1 }], { bezImena: ['A', 'B', 'C'], velicina: 220 }));

  Z(2, 'Pravougaonik $ABCD$ sa stranicama $AB = 4 cm$ i $BC = 3 cm$ translira se za vektor $\\vec{AB}$. Koliki je obim lika koji čine pravougaonik i njegova slika zajedno?',
    ['$22 cm$', '$28 cm$', '$14 cm$', '$24 cm$'],
    [K('Slika počinje tamo gde se pravougaonik završava: $A → B$, pa se dodiruju duž stranice $BC$.', ['sl']),
     K('Zajedno čine pravougaonik $8 cm × 3 cm$: $O = 2 · (8 + 3) = 22 cm$.')],
    G({ A: [0, 0], B: [4, 0], C: [4, 3], D: [0, 3] }, [{ p: 'ABCD' }, { d: 'AB', o: '4 cm' }, { d: 'BC', o: '3 cm' }, { p: 'ABCD', b: 1, pomeri: [4, 0], k: 1, id: 'sl', gusto: 1 }], { velicina: 200 }));

  Z(2, 'Kružnica $k(O, r)$ translira se za vektor čija je dužina jednaka $r$. Koliko zajedničkih tačaka imaju kružnica i njena slika?',
    ['$2$', '$1$', '$0$', 'beskonačno mnogo'],
    [K('Centar slike $O\'$ je na rastojanju $r$ od $O$ – leži na prvoj kružnici.', ['c']),
     K('Rastojanje centara ($r$) je manje od zbira poluprečnika ($2r$), a veće od nule: kružnice se seku u $2$ tačke.')],
    G({ O: [0, 0], P: [3, 0] }, [{ kr: 'O', r: 3, b: 0 }, { d: 'OP', str: 1, b: 3 }, { kr: 'O', r: 3, b: 1, pomeri: [3, 0], k: 1, id: 'c' }], { bezImena: ['P'], velicina: 200 }));

  Z(3, 'Kvadrat $ABCD$ se translira za vektor $\\vec{AC}$. Šta je presek kvadrata i njegove slike?',
    ['samo tačka $C$', 'duž $BC$', 'pola kvadrata', 'četvrtina kvadrata'],
    [K('Teme $A$ prelazi u $C$, pa slika „počinje“ u temenu $C$ i ide dalje, gore-desno.', ['sl']),
     K('Kvadrat i slika se dodiruju samo u tački $C$.')],
    G({ A: [0, 0], B: [3, 0], C: [3, 3], D: [0, 3] }, [{ p: 'ABCD' }, { d: 'AC', str: 1, b: 3 }, { p: 'ABCD', b: 1, pomeri: [3, 3], k: 1, id: 'sl', gusto: 1 }], { velicina: 200 }));

  Z(3, 'Tačka $A$ se translira za vektor $\\vec{MN}$ (dužine $3 cm$) u $A_{1}$, pa se $A_{1}$ preslika centralnom simetrijom oko $A$. Koliko je rastojanje dobijene tačke $A_{2}$ od $A_{1}$?',
    ['$6 cm$', '$3 cm$', '$9 cm$', '$0 cm$'],
    [K('$AA_{1} = MN = 3 cm$.'),
     K('Centar simetrije je baš $A$: $A$ je sredina duži $A_{1}A_{2}$, pa je $A_{1}A_{2} = 2 · 3 = 6 cm$.', ['s'])],
    G({ A: [0, 0], M: [-1, 2], N: [2, 2] }, [{ d: 'MN', str: 1, b: 3, o: '3 cm' }, { tacka: 'A' }, { lin: [[0, 0], [3, 0]], str: 1, b: 1, k: 1, crtaj: 1 }, { tx: 'A₁', at: [3, -0.6], k: 1 }, { lin: [[3, 0], [-3, 0]], b: 2, isp: 1, k: 2, id: 's', crtaj: 1 }, { tx: 'A₂', at: [-3, -0.6], k: 2 }], { velicina: 200 }));

  Z(3, 'Koliko različitih vektora (koji nisu nula-vektor) određuju tri tačke koje nisu na istoj pravoj?',
    ['$6$', '$3$', '$9$', '$4$'],
    [K('Vektor ima početak i kraj: $\\vec{AB}$ i $\\vec{BA}$ su različiti.'),
     K('Početak biramo na $3$ načina, kraj na $2$: $3 · 2 = 6$ vektora.', ['v'])],
    G({ A: [0, 0], B: [5, 0], C: [2, 3.5] }, [{ tacka: 'ABC' }, ...[['A', 'B'], ['B', 'C'], ['C', 'A']].map(([p, q]) => ({ d: p + q, str: 1, b: 0, k: 2, id: 'v' }))], { velicina: 180 }));

  // ════════════════ dopune (deseti zadatak u lekciji) ════════════════
  L('Tačke i prave; pripadanje i raspored');
  Z(1, 'Tri prave se seku tako da nikoje dve nisu paralelne i sve tri ne prolaze kroz istu tačku. Koliko ima presečnih tačaka?',
    ['$3$', '$1$', '$6$', '$2$'],
    [K('Svake dve prave se seku u jednoj tački: parovi $ab$, $bc$, $ca$.', ['t']),
     K('Tačke su različite (prave ne prolaze kroz istu tačku): ukupno $3$ – temena trougla.')],
    G({ O: [0, 0] }, [{ lin: [[-4, -1], [4, 1]], b: 0 }, { lin: [[-3, 3], [2, -3]], b: 1 }, { lin: [[-1, -3], [3, 3]], b: 2 }, { tx: '●', at: [-0.33, -0.08], b: 3, k: 1, id: 't' }, { tx: '●', at: [1.53, 0.38], b: 3, k: 1, id: 't' }, { tx: '●', at: [0.38, -0.47], b: 3, k: 1, id: 't' }], { ...bez, velicina: 200 }));

  L('Odnosi pravih u ravni');
  Z(1, 'Stranice pravougaonika leže na četiri prave. Koliko parova paralelnih pravih ima među njima?',
    ['$2$', '$4$', '$1$', '$6$'],
    [K('Naspramne stranice pravougaonika su paralelne: $AB ∥ CD$ i $BC ∥ AD$.', ['a', 'b']),
     K('Dva para paralelnih pravih (ostali parovi su normalni).')],
    G({ A: [0, 0], B: [5, 0], C: [5, 3], D: [0, 3] }, [{ p: 'ABCD', b: 4, prazno: 1 }, { d: 'AB', b: 0, id: 'a', k: 1 }, { d: 'DC', b: 0, id: 'a', k: 1 }, { d: 'BC', b: 1, id: 'b', k: 1 }, { d: 'AD', b: 1, id: 'b', k: 1 }], { velicina: 180 }));

  L('Prenošenje i nadovezivanje duži');
  Z(1, 'Duž dužine $2 cm 4 mm$ nadovežemo samu na sebe $5$ puta. Kolika je dobijena duž?',
    ['$12 cm$', '$10 cm 20 mm$', '$10 cm 4 mm$', '$12 cm 4 mm$'],
    [K('$2 cm 4 mm = 24 mm$; $5 · 24 mm = 120 mm$.'),
     K('$120 mm = 12 cm$.', ['s'])],
    G({}, [{ osa: [0, 12.5], podela: 0.4, svaki: 5 }, ...skokovi(0, 2.4, 5, { h: 1, k: 2, id: 's', razmak: 0.5 })], { velicina: 300 }));

  L('Mnogougao');
  Z(1, 'Koliko dijagonala polazi iz jednog temena šestougla?',
    ['$3$', '$6$', '$9$', '$4$'],
    [K('Teme se ne spaja dijagonalom sa sobom i sa dva susedna temena (to su stranice).'),
     K('$6 − 3 = 3$ dijagonale.', ['d'])],
    G(pravilni(6, 3), [{ p: 'ABCDEF' }, ...['AC', 'AD', 'AE'].map((d, i) => ({ d, b: 1, k: 2, id: 'd', crtaj: 1, kasni: 0.2 + i * 0.4 }))], { velicina: 180 }));

  L('Centralna simetrija');
  Z(2, 'Koja od ovih figura NEMA centar simetrije?',
    ['jednakostranični trougao', 'kvadrat', 'krug', 'pravougaonik'],
    [K('Figura ima centar simetrije ako se okretanjem za $180°$ oko njega poklopi sama sa sobom.'),
     K('Okrenut trougao „gleda“ na drugu stranu – ne poklapa se. Kvadrat, krug i pravougaonik se poklapaju.', ['t'])],
    G({ ...pravilni(3, 2.5, [0, 0], 90), S: [0, 0] }, [{ p: 'ABC', b: 0 }, { p: 'ABC', b: 1, okreni: 180, oko: 'S', k: 2, id: 't', prazno: 1 }, { tacka: 'S', k: 2 }], { bezImena: ['A', 'B', 'C', 'S'], velicina: 160 }));
};
