// Prirodni brojevi, deljivost, prosti brojevi, brojevni sistemi
const { skok, skokovi, venn, upisi } = require('../zadaci-5/osnova.js');

module.exports = ({ T, Q, U, S, A, F, G, proveri, pr, polja, kuglica, naKrugu, r }) => {
  T('Prirodni brojevi i deljivost');
  const O = { O: [0, 0] }, bez = { bezImena: ['O'] };

  // pravougaonici od 12 kockica
  {
    const a = 0.55, e = [];
    e.push(...polja(12, 1, () => 0, { x0: 0, y0: 5.2, a }));
    e.push(...polja(6, 2, () => 2, { x0: 0, y0: 3.0, a }));
    e.push(...polja(4, 3, () => 4, { x0: 0, y0: 0, a }));
    Q(3, 'Od 12 kvadrata mogu da se slože pravougaonici 1 × 12, 2 × 6 i 3 × 4. Od koliko kvadrata može da se složi SAMO jedan dugačak red?',
      ['13', '15', '16', '21'],
      'Brojevi od kojih se može složiti samo jedan red su prosti brojevi – imaju tačno dva delioca: 1 i sebe. Od 15 kockica ide 3 × 5, od 16 čak 2 × 8 i 4 × 4, a od 21 ide 3 × 7.',
      'prost', {
        mediji: G({ O: [0, 0] }, e, { bezImena: ['O'] }), autor: 'Miroslav Antonić',
        medijiOdgovora: G(O, [
          ...polja(13, 1, () => 2, { x0: 0, y0: 6.4, a }), { tx: '13', at: [-0.7, 6.65], b: 2 },
          ...polja(5, 3, () => 0, { x0: 0, y0: 3.6, a }), { tx: '15 = 3 · 5', at: [1.375, 3.1] },
          ...polja(4, 4, () => 4, { x0: 4.2, y0: 3.6, a }), { tx: '16 = 4 · 4', at: [5.3, 3.1] },
          ...polja(7, 3, () => 1, { x0: 0, y0: 0.6, a }), { tx: '21 = 3 · 7', at: [1.925, 0.1] },
        ], { ...bez, velicina: 280 }),
      });
  }

  // prosti brojevi do 20
  {
    const prosti = [2, 3, 5, 7, 11, 13, 17, 19];
    const e = polja(5, 4, (i, j) => (prosti.includes((3 - j) * 5 + i + 1) ? 2 : undefined));
    for (let j = 0; j < 4; j++) for (let i = 0; i < 5; i++) e.push({ tx: String((3 - j) * 5 + i + 1), at: [i + 0.5, j + 0.45] });
    Q(1, 'Koliko ima prostih brojeva manjih od 20?', ['8', '7', '9', '10'],
      'Prosti brojevi manji od 20 su 2, 3, 5, 7, 11, 13, 17 i 19. Broj 1 nije prost (ima samo jedan delilac), a 2 je jedini paran prost broj. Ovakvim precrtavanjem sadržalaca (Eratostenovo sito) prosti brojevi se traže već 2.200 godina.',
      'prost', { medijiOdgovora: G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 260 }) });
  }

  proveri(477 % 9 === 0 && [0, 1, 2, 3, 4, 5, 6, 8, 9].every((c) => (400 + c * 10 + 7) % 9 !== 0), '4_7 deljiv sa 9');
  Q(2, 'Broj 4▢7 je deljiv sa 9. Koja cifra je u kvadratiću?', ['7', '2', '5', '9'],
    'Broj je deljiv sa 9 kad mu je zbir cifara deljiv sa 9: 4 + 7 + 7 = 18. Isto pravilo važi i za 3 – zato što je 10 = 9 + 1, pa svaka desetica, stotina i hiljada daje ostatak 1 pri deljenju sa 9.',
    'cifra', { mediji: F('4 ▢ 7'), medijiOdgovora: F('4 + 7 + 7 = 18 = 2 · 9') });

  Q(1, 'Koji od ovih brojeva je deljiv sa 4?', ['1.316', '1.318', '1.322', '1.310'],
    'Dovoljno je pogledati poslednje dve cifre: 16 je deljivo sa 4, pa je i 1.316. Stotine su uvek deljive sa 4, jer je 100 = 4 · 25.',
    'deljiv', { medijiOdgovora: F('1.316 = 13 · 100 + 16 = 4 · 325 + 4 · 4') });
  proveri(1316 % 4 === 0 && [1318, 1322, 1310].every((x) => x % 4 !== 0) && 1300 === 4 * 325, 'deljiv sa 4');

  Q(3, 'Pod sobe 12 × 18 dm treba popločati jednakim kvadratnim pločicama, bez sečenja. Kolika je stranica NAJVEĆE takve pločice?',
    ['6 dm', '3 dm', '2 dm', '9 dm'],
    'Stranica mora da deli i 12 i 18, a tražimo najveću – to je najveći zajednički delilac, NZD(12, 18) = 6. Biće potrebno 2 · 3 = 6 pločica.',
    'pločica', {
      autor: 'Miroslav Antonić',
      mediji: G({ A: [0, 0], B: [18, 0], C: [18, 12], D: [0, 12] }, [{ p: 'ABCD', b: 3 }, { d: 'AB', o: '18 dm' }, { d: 'DA', o: '12 dm', os: -1 }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 260 }),
      medijiOdgovora: G({ A: [0, 0], B: [18, 0], C: [18, 12], D: [0, 12] }, [
        ...polja(3, 2, (i, j) => [0, 2, 4][(i + j) % 3], { a: 6 }),
        ...[3, 9, 15].flatMap((x) => [3, 9].map((y) => ({ tx: '6 × 6', at: [x, y] }))),
        { d: 'AB', o: '18 = 3 · 6' }, { tx: '12 = 2 · 6', at: [-4.4, 6] },
      ], { bezImena: ['A', 'B', 'C', 'D'], velicina: 260 }),
    });
  proveri([6, 3, 2].every((a) => 12 % a === 0 && 18 % a === 0) && 12 % 9 !== 0 && [7, 8, 9, 10, 11, 12].every((a) => 12 % a || 18 % a), 'NZD 12 i 18');

  proveri(36 % 12 === 0 && 36 % 18 === 0, 'NZS 12 i 18');
  Q(3, 'Dva autobusa kreću sa iste stanice u 8:00. Prvi polazi na svakih 12 minuta, a drugi na svakih 18. Kada će prvi sledeći put opet krenuti zajedno?',
    ['U 8:36', 'U 8:30', 'U 8:54', 'U 9:00'],
    'Traži se najmanji zajednički sadržalac: NZS(12, 18) = 36. Prvi polazi u 8:12, 8:24, 8:36…, a drugi u 8:18, 8:36… Isti račun objašnjava zašto se zupčanici na biciklu „poklope“ tek posle mnogo okretaja.',
    'autobus', {
      autor: 'Miroslav Antonić',
      medijiOdgovora: G({ X: [36, 0, 90] }, [
        { osa: [0, 36], podela: 6 },
        ...skokovi(0, 12, 3, { boja: 1, h: 5, kasni: 0.3, razmak: 0.8 }),
        ...skokovi(0, 18, 2, { boja: 2, h: 6, ispod: true, kasni: 0.6, razmak: 1.1 }),
        { tacka: 'X', b: 3 }, { tx: '8:00', at: [-3.4, 0] }, { tx: '8:36', at: [39.6, 0], b: 3 },
        { tx: '12', at: [6, 5.6], b: 1 }, { tx: '18', at: [9, -7.4], b: 2 },
      ], { bezImena: ['X'], velicina: 320 }),
    });

  Q(3, 'Koji od ovih brojeva ima NEPARAN broj delilaca?', ['36', '24', '30', '40'],
    'Delioci se javljaju u parovima: 36 = 1 · 36 = 2 · 18 = 3 · 12 = 4 · 9 = 6 · 6. Samo kod kvadrata jedan „par“ čini isti broj (6 · 6), pa se broji jednom – zato samo kvadrati imaju neparan broj delilaca (36 ih ima 9).',
    'delilac', {
      medijiOdgovora: (() => {
        const d = [1, 2, 3, 4, 6, 9, 12, 18, 36], x = (n) => d.indexOf(n) * 1.4;
        const e = d.map((n) => ({ tx: String(n), at: [x(n), 0], vel: 18, ...(n === 6 ? { b: 3 } : {}) }));
        [[1, 36, 1], [2, 18, 2], [3, 12, 4], [4, 9, 5]].forEach(([a, b, c], i) => {
          const h = 0.9 + 0.75 * (3 - i);
          e.push({ lin: Array.from({ length: 17 }, (_, k) => { const t = k / 16; return [r(x(a) + (x(b) - x(a)) * t), r(0.5 + 4 * h * t * (1 - t))]; }), b: c, debljina: 2.5, crtaj: 1, kasni: 0.3 + 0.5 * i });
        });
        e.push({ lin: Array.from({ length: 17 }, (_, k) => naKrugu([x(6), 0.1], 0.6, (360 * k) / 16).map(r)), zatv: 1, prazno: 1, b: 3, crtaj: 1, kasni: 2.3 });
        e.push({ tx: '6 · 6', at: [x(6), -1.2], b: 3 });
        return G(O, e, { ...bez, velicina: 320 });
      })(),
    });
  proveri(Array.from({ length: 36 }, (_, i) => i + 1).filter((i) => 36 % i === 0).length === 9 && [24, 30, 40].every((n) => Array.from({ length: n }, (_, i) => i + 1).filter((i) => n % i === 0).length === 8), 'delioci 36');

  // drvo rastavljanja broja 60
  {
    const e = [];
    const cvor = (t, x, y, b) => e.push({ tx: t, at: [x, y], ...(b !== undefined ? { b } : {}) });
    const grana = (a, b) => e.push({ lin: [[a[0], a[1] - 0.35], [b[0], b[1] + 0.4]], b: 5, debljina: 2 });
    grana([0, 4], [-2, 2]); grana([0, 4], [2, 2]); grana([-2, 2], [-3, 0]); grana([-2, 2], [-1, 0]); grana([2, 2], [1, 0]); grana([2, 2], [3, 0]);
    cvor('60', 0, 4); cvor('6', -2, 2); cvor('10', 2, 2); cvor('2', -3, 0, 2); cvor('3', -1, 0, 2); cvor('2', 1, 0, 2); cvor('5', 3, 0, 2);
    proveri(2 * 2 * 3 * 5 === 60, '60');
    Q(2, 'Kako se broj 60 rastavlja na proste činioce?', ['$2^{2} · 3 · 5$', '$2 · 3 · 10$', '$2^{3} · 3 · 5$', '$2 · 3^{2} · 5$'],
      'Svaki prirodan broj veći od 1 rastavlja se na proste činioce na samo jedan način (do na redosled) – to je osnovni stav aritmetike. Drvo može da krene i od 60 = 4 · 15 ili 60 = 2 · 30, ali na kraju uvek ostaju isti listovi: 2, 2, 3 i 5.',
      'činilac', { medijiOdgovora: G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 240 }) });
  }

  // zbir dva neparna broja – tačkice u parovima
  {
    const e = [];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) e.push(kuglica(i, j, 0, 0.35));
    e.push(kuglica(0, 2, 1, 0.35));
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) e.push(kuglica(4 + i, j, 4, 0.35));
    e.push({ ...kuglica(5, 3, 1, 0.35), pomeri: [-4, -1], kasni: 0.8, trajanje: 1.6 });
    e.push({ tx: '5', at: [0.5, -1.1] }, { tx: '+', at: [2.5, 1] }, { tx: '7', at: [4.5, -1.1] });
    Q(1, 'Zbir dva neparna broja je uvek…', ['paran', 'neparan', 'deljiv sa 4', 'prost'],
      'Neparan broj je „parovi + jedna tačkica viška“. Kad se saberu dva neparna broja, dve viška tačkice naprave novi par – i ništa ne ostaje. Zato je, na primer, 5 + 7 = 12 paran.',
      'paran', { medijiOdgovora: G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 220 }) });
  }

  Q(1, 'Koliko vredi cifra 7 u broju 3.725.104?', ['700.000', '70.000', '7.000.000', '7.000'],
    'U našem (dekadnom) sistemu vrednost cifre zavisi od mesta: svako mesto ulevo vredi 10 puta više. Ovaj zapis smo preuzeli od indijskih matematičara preko Arapa – zato se zove i „arapske cifre“.',
    'cifra', {
      mediji: F('3.725.104'),
      medijiOdgovora: G(O, [
        // „H“ i „S“ bi pismo ostavilo latinicom (hemijski simboli) – nevidljivi razmak (\u200b) ih pretvara u Х i С
        ...['~M', '~SH', '~DH', '~H\u200b', '~S\u200b', '~D', '~J'].flatMap((m, i) => [
          pr(i * 1.6, 1.4, 1.6, 1.2, { b: i === 1 ? 3 : 5, ...(i === 1 ? { gusto: 1 } : { prazno: 1 }) }), { tx: m, at: [i * 1.6 + 0.8, 2.0] },
          pr(i * 1.6, 0, 1.6, 1.4, { b: i === 1 ? 3 : 5, prazno: 1 }), { tx: '3725104'[i], at: [i * 1.6 + 0.8, 0.7], vel: 22, ...(i === 1 ? { b: 3 } : {}) },
        ]),
        { tx: '7 · 100.000 = 700.000', at: [5.6, -1.0], b: 3 },
      ], { ...bez, velicina: 320 }),
    });

  Q(1, 'Koji broj je označen tačkom $M$ na brojevnoj pravoj?', ['35', '30', '37', '40'],
    'Između 30 i 40 je još samo jedna crtica, pa je razmak između dve susedne crtice 5. Pre nego što pročitaš brojevnu pravu, uvek prvo proveri koliko vredi jedan razmak.',
    'prava', {
      mediji: G({ M: [35, 0, 90] }, [{ osa: [0, 50], podela: 5, svaki: 2 }, { tacka: 'M', b: 1 }], { velicina: 320 }),
      medijiOdgovora: G({ M: [35, 0, 90] }, [{ osa: [0, 50], podela: 5, svaki: 2 }, skok(30, 35, { h: 4, boja: 2, o: '+5' }), skok(35, 40, { h: 4, boja: 2, o: '+5', kasni: 1.1 }), { tacka: 'M', b: 1 }], { velicina: 320 }),
    });

  Q(1, 'Koliko je 4.651 zaokruženo na stotine?', ['4.700', '4.600', '4.650', '5.000'],
    'Gleda se cifra desetica: 5 ili više – zaokružuje se naviše. Broj 4.650 je tačno na sredini, a 4.651 je već prešao sredinu: do 4.700 mu fali 49, a do 4.600 ima čak 51.',
    'stotina', { medijiOdgovora: G({ M: [4651, 0, 90] }, [{ osa: [4600, 4700], podela: 10, svaki: 5 }, skok(4651, 4700, { h: 14, boja: 2, o: '49' }), skok(4651, 4600, { h: 14, boja: 1, o: '51', ispod: true, kasni: 1.2 }), { tacka: 'M', b: 3 }], { bezImena: ['M'], velicina: 320 }) });

  // neparni brojevi daju kvadrat
  {
    const e = polja(5, 5, (i, j) => [3, 1, 2, 0, 4][Math.max(i, 4 - j)]);
    proveri([1, 3, 5, 7, 9, 11, 13, 15, 17, 19].reduce((a, b) => a + b) === 100, 'neparni');
    Q(2, 'Slika prikazuje 1 + 3 + 5 + 7 + 9 (svaka boja je jedan sabirak). Koliki je zbir prvih 10 neparnih brojeva (1 + 3 + … + 19)?',
      ['100', '90', '110', '121'],
      'Svaki sledeći neparni broj dodaje „ugao“ oko kvadrata, pa zbir prvih $n$ neparnih brojeva uvek daje kvadrat $n · n$. Za 10 sabiraka to je 10 · 10 = 100 – bez ijednog sabiranja!',
      'kvadrat', { mediji: G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 220 }), medijiOdgovora: A('neparni-kvadrat') });
  }

  Q(3, 'Broj je deljiv i sa 4 i sa 6. Sa kojim brojem je SIGURNO deljiv?', ['Sa 12', 'Sa 24', 'Sa 10', 'Sa 8'],
    'Broj 12 je deljiv i sa 4 i sa 6, a nije deljiv sa 24 ni sa 8. Pravilo „pomnoži delioce“ važi samo kad oni nemaju zajednički činilac (npr. 3 i 4 → 12); ovde se uzima NZS(4, 6) = 12.',
    'deljiv', {
      medijiOdgovora: G({ X: [12, 0, 90], Y: [24, 0, 90] }, [
        { osa: [0, 24], podela: 2 },
        ...skokovi(0, 4, 6, { boja: 1, h: 2.2, kasni: 0.3, razmak: 0.5 }),
        ...skokovi(0, 6, 4, { boja: 2, h: 3, ispod: true, kasni: 0.5, razmak: 0.7 }),
        { tacka: 'XY', b: 3 }, { tx: '+4', at: [2, 2.8], b: 1 }, { tx: '+6', at: [3, -3.6], b: 2 },
      ], { bezImena: ['X', 'Y'], velicina: 320 }),
    });
  proveri(12 % 4 === 0 && 12 % 6 === 0 && 12 % 24 && 12 % 8 && 12 % 10, '4 i 6');

  // dvojni sistem – sijalice
  {
    const e = [];
    [1, 0, 1, 1].forEach((u, i) => {
      e.push(u ? kuglica(i * 2, 0, 3, 0.7) : { lin: Array.from({ length: 16 }, (_, k) => [i * 2 + 0.7 * Math.cos((k * Math.PI) / 8), 0.7 * Math.sin((k * Math.PI) / 8)]), zatv: 1, b: 5, prazno: 1 });
      e.push({ tx: String(u), at: [i * 2, 0] }, { tx: String(8 >> i), at: [i * 2, -1.35], b: 4 });
    });
    proveri(parseInt('1011', 2) === 11, '1011');
    Q(3, 'Računari pamte brojeve sijalicama: upaljena = 1, ugašena = 0, a mesta vrede 8, 4, 2 i 1. Koji broj je zapisan kao 1011?',
      ['11', '13', '7', '1.011'],
      'U dvojnom (binarnom) sistemu svako mesto vredi duplo više od prethodnog: 8 + 2 + 1 = 11. Sa samo 10 „sijalica“ može se zapisati svaki broj od 0 do 1.023 – i zato je 1 KB = 1.024 bajta.',
      'računar', { mediji: G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 260 }), medijiOdgovora: G({ O: [0, 0] }, [...e, { tx: '8 + 0 + 2 + 1 = 11', at: [3, -2.7], b: 3, vel: 20 }], { bezImena: ['O'], velicina: 260 }) });
  }

  proveri(100 % 7 === 2, '100 dana');
  Q(2, 'Danas je ponedeljak. Koji dan će biti za 100 dana?', ['Sreda', 'Utorak', 'Četvrtak', 'Nedelja'],
    'Svakih 7 dana dan u nedelji se ponavlja, pa je bitan samo ostatak: 100 = 14 · 7 + 2. Dva dana posle ponedeljka je sreda. Ovakvo „računanje u krug“ zove se računanje po modulu – kao kazaljke na satu.',
    'ostatak', {
      medijiOdgovora: (() => {
        const dani = ['~Pon', '~Uto', '~Sre', '~Čet', '~Pet', '~Sub', '~Ned'], ug = (i) => 90 - (360 * i) / 7;
        const e = dani.map((d, i) => ({ tx: d, at: naKrugu([0, 0], 3.6, ug(i)).map(r), vel: 16, ...(i === 0 ? { b: 0 } : i === 2 ? { b: 3 } : {}) }));
        e.push({ lin: Array.from({ length: 49 }, (_, k) => naKrugu([0, 0], 4.6, (360 * k) / 48).map(r)), zatv: 1, b: 5, prazno: 1 });
        e.push({ lin: Array.from({ length: 17 }, (_, k) => naKrugu([0, 0], 2.5, ug(0) - 8 - ((ug(0) - ug(2) - 16) * k) / 16).map(r)), b: 3, str: 1, crtaj: 1, kasni: 0.5, debljina: 3 });
        e.push({ tx: '100 = 14 · 7 + 2', at: [0, -2.0], vel: 15 }, { tx: '+2', at: naKrugu([0, 0], 1.7, (ug(0) + ug(2)) / 2).map(r), b: 3 });
        return G(O, e, { ...bez, velicina: 240 });
      })(),
    });

  S(2, 'Spoji broj sa brojem njegovih delilaca', [['7', '2 delioca'], ['9', '3 delioca'], ['8', '4 delioca'], ['12', '6 delilaca']],
    '9 ima delioce 1, 3 i 9; 8 ima 1, 2, 4 i 8; a 12 čak 1, 2, 3, 4, 6 i 12. Brojevi sa mnogo delilaca, poput 12 i 60, zgodni su za deljenje – zato brojčanik ima 12 sati, a sat 60 minuta.',
    'delilac', { autor: 'Miroslav Antonić' });

  U(2, 'Koji od ovih brojeva NIJE prost?', ['51', '53', '59', '61'],
    '51 = 3 · 17 (zbir cifara 5 + 1 = 6 je deljiv sa 3), a 53, 59 i 61 su prosti.',
    '51 izgleda „prosto“, pa je to jedna od najčešćih zamki. Postoji beskonačno mnogo prostih brojeva – to je još Euklid dokazao pre 2.300 godina.',
    'prost', { medijiOdgovora: F('51 = 3 · 17') });
  proveri(51 === 3 * 17 && [53, 59, 61].every((n) => [2, 3, 5, 7].every((d) => n % d)), 'prosti 53, 59, 61');

  Q(3, 'Koliko ima brojeva od 1 do 100 koji su deljivi sa 2 ili sa 3?', ['67', '83', '50', '66'],
    'Sa 2 je deljivo 50 brojeva, sa 3 njih 33, ali brojevi deljivi sa 6 (njih 16) su tako izbrojani dva puta: 50 + 33 − 16 = 67. Ovo „dodaj pa oduzmi preklop“ je princip uključenja i isključenja.',
    'deljiv', {
      medijiOdgovora: (() => {
        const v = venn({ R: 3, d: 3.2, imena: ['', ''], presek: true, samoA: true, samoB: true });
        return G(O, [...v.e, ...upisi(['34'], v.mesta.A, { vel: 22 }), ...upisi(['16'], v.mesta.AB, { vel: 22 }), ...upisi(['17'], v.mesta.B, { vel: 22 }),
          { tx: '2, 4, 6…', at: [-2.6, 3.5] }, { tx: '3, 6, 9…', at: [2.6, 3.5] }, { tx: '34 + 16 + 17 = 67', at: [0, -3.8], b: 3 }], { ...bez, velicina: 280 });
      })(),
    });
  proveri(50 - 16 === 34 && 33 - 16 === 17, 'venn 2 i 3');
  proveri(Array.from({ length: 100 }, (_, i) => i + 1).filter((x) => x % 2 === 0 || x % 3 === 0).length === 67, '67');

  Q(1, 'Koji je najveći trocifreni broj deljiv sa 5?', ['995', '999', '990', '1.000'],
    'Broj je deljiv sa 5 ako mu je poslednja cifra 0 ili 5. Od 999 naniže, prvi takav je 995. Broj 1.000 je deljiv sa 5, ali je četvorocifren.',
    'cifra');
};
