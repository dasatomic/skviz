// Razlomci, decimalni brojevi, procenti, razmera
const { skokovi } = require('../zadaci-5/osnova.js');

module.exports = ({ T, Q, U, S, A, F, G, proveri, pr, polja, torta, kruzni, kuglica }) => {
  T('Razlomci, decimalni brojevi i procenti');
  const O = { O: [0, 0] }, bez = { bezImena: ['O'] };

  Q(1, 'Koji deo kruga je obojen?', ['${3|8}$', '${3|5}$', '${5|8}$', '${1|3}$'],
    'Imenilac (dole) kaže na koliko JEDNAKIH delova je celina podeljena, a brojilac (gore) koliko delova uzimamo. Reč „razlomak“ dolazi od „razlomiti“ – kao kad se razlomi čokolada.',
    'razlomak', { mediji: G(O, torta(8, [1, null, 1, null, null, 1, null, null]), { ...bez, velicina: 220 }) });

  Q(1, 'Koji deo pravougaonika je obojen?', ['${1|2}$', '${2|3}$', '${6|10}$', '${1|3}$'],
    'Obojeno je 6 od 12 kvadratića: ${6|12} = {1|2}$. Nije važno što obojeni delovi nisu jedan do drugog – važno je koliko ih je.',
    'polovina', { mediji: G(O, polja(4, 3, (i, j) => ((i * 7 + j * 5) % 4 < 2 ? 0 : undefined)), { ...bez, velicina: 230 }) });
  proveri(Array.from({ length: 12 }, (_, k) => ((k % 4) * 7 + Math.floor(k / 4) * 5) % 4 < 2).filter(Boolean).length === 6, 'polovina');

  // 2/3 trake = koliko dvanaestina
  {
    const gore = [pr(0, 2, 4, 1.2, { b: 0, gusto: 1 }), pr(4, 2, 4, 1.2, { b: 0, gusto: 1 }), pr(8, 2, 4, 1.2, { b: 5, prazno: 1 })];
    Q(2, 'Gornja traka je podeljena na trećine, a donja na dvanaestine. Koliko dvanaestina je isto što i ${2|3}$?', ['8', '6', '4', '9'],
      '${2|3} = {2 · 4|3 · 4} = {8|12}$ – kad se brojilac i imenilac pomnože istim brojem, razlomak ostaje isti, samo su delovi sitniji. Tako se razlomci „proširuju“.',
      'trećina', {
        mediji: G(O, [...gore, ...Array.from({ length: 12 }, (_, i) => pr(i, 0, 1, 1.2, { b: 5, prazno: 1 }))], { ...bez, velicina: 300 }),
        medijiOdgovora: G(O, [...gore,
          ...Array.from({ length: 12 }, (_, i) => pr(i, 0, 1, 1.2, i < 8 ? { b: 0, gusto: 1 } : { b: 5, prazno: 1 })),
          { lin: [[4, 3.5], [4, -0.3]], b: 3, debljina: 2, crtaj: 1, kasni: 0.3 }, { lin: [[8, 3.5], [8, -0.3]], b: 3, debljina: 2, crtaj: 1, kasni: 0.8 },
          { tx: '2 · 4 = 8', at: [6, -1.0], b: 3 },
        ], { ...bez, velicina: 300 }),
      });
  }

  proveri(2 / 3 > 5 / 8 && 5 / 8 > 3 / 5 && 3 / 5 > 4 / 7, 'poređenje');
  Q(2, 'Koji od ovih razlomaka je najveći?', ['${2|3}$', '${5|8}$', '${3|5}$', '${4|7}$'],
    'Svi su malo veći od polovine, pa se gleda za koliko: ${2|3}$ je za ${1|6}$ veći od pola, ${5|8}$ za ${1|8}$, ${3|5}$ za ${1|10}$, a ${4|7}$ za ${1|14}$. Najveći „višak“ ima ${2|3}$.',
    'razlomak', {
      medijiOdgovora: G(O, [[2, 3, 1], [5, 8, 0], [3, 5, 2], [4, 7, 4]].flatMap(([a, b, c], k) => [
        ...Array.from({ length: b }, (_, i) => pr((i * 12) / b, (3 - k) * 1.5, 12 / b, 1, i < a ? { b: c, gusto: 1 } : { b: 5, prazno: 1 })),
      ]), { ...bez, velicina: 300 }),
    });

  Q(1, 'Koji broj je označen tačkom $A$?', ['${5|4}$', '${5|8}$', '${3|4}$', '${4|5}$'],
    'Svaka jedinica je podeljena na 4 dela, pa je jedan podeok ${1|4}$. Tačka $A$ je 5 podeoka od nule: ${5|4} = 1{1|4} = 1,25$. Razlomak veći od 1 može da se zapiše i kao mešoviti broj.',
    'četvrtina', {
      mediji: G({ A: [1.25, 0, 90] }, [{ osa: [0, 2], podela: 0.25, svaki: 4 }, { tacka: 'A', b: 1 }], { velicina: 300 }),
      medijiOdgovora: G({ A: [1.25, 0, 90] }, [{ osa: [0, 2], podela: 0.25, svaki: 4 }, ...skokovi(0, 0.25, 5, { h: 0.2, boja: 2, razmak: 0.5 }), { tacka: 'A', b: 1 }], { velicina: 300 }),
    });

  Q(2, 'Koliko je ${1|2} + {1|3}$?', ['${5|6}$', '${2|5}$', '${2|6}$', '${1|5}$'],
    'Ne sabiraju se imenioci! Prvo se oba razlomka „iseku“ na jednake delove – šestine: ${3|6} + {2|6} = {5|6}$. Odgovor ${2|5}$ je manji i od same polovine, pa ne može biti tačan.',
    'zbir', {
      medijiOdgovora: G({ O: [0, 0], P: [7, 0], R: [14, 0] }, [
        ...torta(6, [0, 0, 0, null, null, null], { c: 'O', R: 2.5 }), ...torta(6, [null, null, null, 1, 1, null], { c: 'P', R: 2.5 }), ...torta(6, [0, 0, 0, 1, 1, null], { c: 'R', R: 2.5 }),
        { tx: '+', at: [3.5, 0], vel: 24 }, { tx: '=', at: [10.5, 0], vel: 24 },
      ], { bezImena: ['O', 'P', 'R'], velicina: 300 }),
    });

  Q(2, 'Koliko je ${2|3}$ od ${3|4}$?', ['${1|2}$', '${5|7}$', '${6|7}$', '${8|9}$'],
    '„Od“ znači množenje: ${2|3} · {3|4} = {6|12} = {1|2}$. Na slici: pravougaonik je podeljen na četvrtine (uspravno) i trećine (vodoravno); ${3|4}$ su tri kolone, a ${2|3}$ od njih – dva reda u tim kolonama: preklop ima 6 od 12 polja.',
    'proizvod', {
      medijiOdgovora: G(O, polja(4, 3, (i, j) => (i < 3 && j < 2 ? 1 : i < 3 ? 0 : j < 2 ? 4 : undefined)), { ...bez, velicina: 200 }),
    });

  Q(1, 'Koliko puta polovina staje u 3?', ['6', '1,5', '3,5', '${1|6}$'],
    '$3 : {1|2} = 3 · 2 = 6$ – deliti razlomkom znači množiti njegovom recipročnom vrednošću. Tri pice isečene na polovine daju 6 parčića.',
    'polovina', { medijiOdgovora: G({ O: [0, 0], P: [9, 0], R: [18, 0] }, [...torta(2, [0, 2], { c: 'O' }), ...torta(2, [4, 1], { c: 'P' }), ...torta(2, [3, 5], { c: 'R' })], { bezImena: ['O', 'P', 'R'], velicina: 300 }) });

  Q(1, 'Koji decimalni broj prikazuje obojeni deo kvadrata od 100 polja?', ['0,37', '3,7', '0,037', '0,63'],
    'Celina je 100 polja, a obojeno je 37 – to je 37 stotih: ${37|100} = 0,37$. Na isti način je 37% isto što i 0,37.',
    'stoti', { mediji: G(O, polja(10, 10, (i, j) => (9 - j) * 10 + i < 37 ? 0 : undefined, { prazno: 4 }), { ...bez, velicina: 220 }) });

  Q(1, 'Koji od ovih brojeva je najveći?', ['0,7', '0,65', '0,699', '0,07'],
    'Decimalni brojevi se porede cifru po cifru, od desetih: 0,7 ima 7 desetih, a ostali manje. Duži zapis ne znači veći broj – 0,7 = 0,700 > 0,699.',
    'decimala', {
      medijiOdgovora: G(O, [['0,7', 0.7, 3], ['0,699', 0.699, 0], ['0,65', 0.65, 2], ['0,07', 0.07, 1]].flatMap(([t, v, b], i) => [
        { ...pr(0, -i * 1.3, v * 12, 0.9, { b, gusto: 1 }), crtaj: 1, kasni: 0.2 + 0.3 * i },
        { tx: t, at: [-1.6, -i * 1.3 + 0.45] },
      ]).concat([{ lin: [[8.4, 1.3], [8.4, -4.2]], b: 5, isp: 1 }]), { ...bez, velicina: 300 }),
    });
  proveri(0.7 > 0.699 && 0.699 > 0.65 && 0.65 > 0.07, 'decimale');

  Q(1, 'Kako se 0,25 zapisuje razlomkom?', ['${1|4}$', '${2|5}$', '${1|25}$', '${25|10}$'],
    '$0,25 = {25|100}$, a kad se skrati sa 25 dobija se ${1|4}$. Zato četvrt sata ima 15 minuta: ${1|4}$ od 60.',
    'četvrtina', {
      medijiOdgovora: G(O, [
        ...polja(10, 10, (i, j) => (i < 5 && j >= 5 ? 0 : undefined), { prazno: 4 }),
        { lin: [[5, -0.3], [5, 10.3]], b: 3, debljina: 4, crtaj: 1, kasni: 0.3 }, { lin: [[-0.3, 5], [10.3, 5]], b: 3, debljina: 4, crtaj: 1, kasni: 0.9 },
      ], { ...bez, velicina: 220 }),
    });

  Q(1, 'Kako se razlomak ${1|3}$ zapisuje decimalno?', ['0,333…', '0,3', '0,13', '3,3'],
    'Kad se 1 deli sa 3, ostatak je uvek 1, pa se trojka ponavlja zauvek: 0,333… = 0,(3). Broj 0,3 je za malo manji – to je ${3|10}$.',
    'trećina');

  Q(3, 'Koliko je 0,999… (devetke se ponavljaju beskonačno)?', ['Tačno 1', 'Malo manje od 1', '0,99', 'Tačno 0,999'],
    'Pošto je ${1|3}$ = 0,333…, kad se pomnoži sa 3: ${3|3}$ = 0,999…, a ${3|3}$ = 1. Između 0,999… i 1 ne postoji nijedan broj, pa su to dva zapisa istog broja.',
    'decimala', { mediji: F('0,999… = ?'), medijiOdgovora: F('3 · 0,333… = 0,999… = 1') });

  Q(1, 'Koliko procenata kvadrata je obojeno?', ['40%', '4%', '60%', '25%'],
    'Kvadrat ima 100 polja, a obojeno je 40: 40 od 100 je 40%. Reč „procenat“ dolazi od latinskog „per centum“ – „na sto“.',
    'procenat', { mediji: G(O, polja(10, 10, (i, j) => (i < 4 ? 2 : undefined), { prazno: 4 }), { ...bez, velicina: 220 }) });

  {
    const d = kruzni([['~Peške', 50], ['~Autobus', 25], ['~Bicikl', 15], ['~Auto', 10]]);
    Q(1, 'Dijagram pokazuje kako 40 učenika dolazi u školu. Koliko njih dolazi peške?', ['20', '50', '25', '10'],
      'Peške dolazi polovina kruga, tj. 50%, a polovina od 40 je 20. Kružni dijagram je zgodan za delove celine – ugao isečka je srazmeran udelu (polovina = 180°).',
      'dijagram', { mediji: d });
  }

  Q(1, 'Patike koštaju 8.000 dinara. Na sniženju su 25% jeftinije. Kolika je nova cena?', ['6.000 dinara', '7.750 dinara', '2.000 dinara', '6.500 dinara'],
    '25% je četvrtina: 8.000 : 4 = 2.000 dinara popusta, pa je nova cena 6.000. Brže: plaća se 75% cene, tj. ${3|4}$ od 8.000.',
    'popust', {
      medijiOdgovora: G(O, [
        ...[0, 1, 2].flatMap((i) => [pr(i * 3, 0, 3, 1.4, { b: 0, gusto: 1 }), { tx: '2.000', at: [i * 3 + 1.5, 0.7] }]),
        { ...pr(9, 0, 3, 1.4, { b: 1, gusto: 1 }), pomeri: [1.2, -2.4], kasni: 0.6, trajanje: 1.4 }, { tx: '2.000', at: [10.5, 0.7], pomeri: [1.2, -2.4], kasni: 0.6, trajanje: 1.4 },
        { tx: '−25%', at: [11.7, -2.9], b: 1 }, { tx: '6.000 = 75%', at: [4.5, -0.8], b: 3 }, { tx: '8.000 = 100%', at: [6, 2.1] },
      ], { ...bez, velicina: 300 }),
    });
  proveri(8000 * 0.75 === 6000, 'patike');

  Q(2, 'Cena je porasla sa 400 na 500 dinara. Za koliko procenata je poskupelo?', ['25%', '20%', '100%', '10%'],
    'Povećanje je 100 dinara, a procenat se računa od STARE cene: ${100|400} = 25%$. Ako bi cena pala nazad sa 500 na 400, to bi bilo pojeftinjenje od samo 20%!',
    'procenat', {
      medijiOdgovora: G(O, [
        ...[0, 1, 2, 3].flatMap((i) => [pr(i * 2.4, 0, 2.4, 1.4, { b: 0, gusto: 1 }), { tx: '100', at: [i * 2.4 + 1.2, 0.7] }]),
        { ...pr(9.6, 0, 2.4, 1.4, { b: 1, gusto: 1 }), crtaj: 1, kasni: 0.5 }, { tx: '+100', at: [10.8, 0.7] },
        { tx: '400 = 100%', at: [4.8, -0.8] }, { tx: '+25%', at: [10.8, -0.8], b: 1 },
      ], { ...bez, velicina: 300 }),
    });
  proveri(100 / 400 === 0.25 && 100 / 500 === 0.2, 'poskupljenje');

  proveri(5000 * 0.8 === 4000, 'stara cena');
  Q(3, 'Posle sniženja od 20% bicikl košta 4.000 dinara. Kolika je bila cena pre sniženja?', ['5.000 dinara', '4.800 dinara', '4.200 dinara', '5.200 dinara'],
    'Česta greška: dodati 20% na 4.000 (= 4.800) – ali 20% se računalo od veće, stare cene. Provera: 20% od 5.000 je 1.000, a 5.000 − 1.000 = 4.000.',
    'cena', {
      resenjeCrtez: G(O, [
        ...[0, 1, 2, 3, 4].map((i) => pr(i * 2.4, 0, 2.4, 1.4, { b: 5, prazno: 1 })),
        { tx: '~stara cena = 100%', at: [6, 2.1] },
        ...[0, 1, 2, 3].map((i) => ({ ...pr(i * 2.4, 0, 2.4, 1.4, { b: 0, gusto: 1 }), k: 1, ...(i ? {} : { id: 'plati' }) })),
        { tx: '4.000 = 80%', at: [4.8, -0.8], k: 1, b: 0 },
        ...[0, 1, 2, 3].map((i) => ({ tx: '1.000', at: [i * 2.4 + 1.2, 0.7], k: 2 })),
        { ...pr(9.6, 0, 2.4, 1.4, { b: 1, gusto: 1 }), k: 3, id: 'popust' }, { tx: '1.000', at: [10.8, 0.7], k: 3 }, { tx: '20%', at: [10.8, -0.8], k: 3, b: 1 },
      ], { ...bez, velicina: 300 }),
      resenje: [
        { t: 'Posle sniženja od 20% plaća se 100% − 20% = 80% stare cene – to su 4 od 5 jednakih delova.' },
        { t: '4.000 dinara su 4 dela, pa jedan deo (20%) vredi 4.000 : 4 = 1.000 dinara.' },
        { t: 'Stara cena ima svih 5 delova: 5 · 1.000 = 5.000 dinara.', i: ['popust'] },
      ],
    });

  Q(2, 'Na planu stana (razmera 1 : 100) soba je pravougaonik 4 cm × 3 cm. Kolika je stvarna površina sobe?', ['12 m²', '1,2 m²', '120 m²', '7 m²'],
    'Razmera 1 : 100 znači da je 1 cm na planu 100 cm = 1 m u stvarnosti. Soba je 4 m × 3 m = 12 m². Pazi: površina se ne množi sa 100, već sa 100 · 100 = 10.000.',
    'razmera', {
      mediji: G({ A: [0, 0], B: [4, 0], C: [4, 3], D: [0, 3] }, [{ p: 'ABCD', b: 3 }, { d: 'AB', o: '4 cm' }, { d: 'BC', o: '3 cm' }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 220 }),
      medijiOdgovora: G({ A: [0, 0], B: [4, 0], C: [4, 3], D: [0, 3] }, [...polja(4, 3, (i, j) => [3, 2][(i + j) % 2]), { d: 'AB', o: '4 m' }, { d: 'BC', o: '3 m' }, { tx: '1 m²', at: [0.5, 2.5], vel: 13 }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 220 }),
    });

  Q(1, 'Za 8 palačinki potrebna su 2 jajeta. Koliko jaja treba za 20 palačinki?', ['5', '4', '6', '10'],
    'Jedno jaje je za 4 palačinke, pa za 20 palačinki treba 20 : 4 = 5 jaja. Količine u receptu su upravno srazmerne – kad se jedna udvostruči, i druga se udvostruči.',
    'recept', {
      medijiOdgovora: G(O, Array.from({ length: 5 }, (_, g) => [
        ...[[0, 0], [1, 0], [0, 1], [1, 1]].map(([i, j]) => kuglica(g * 3 + i, j + 1.6, 3, 0.42)),
        { tx: '🥚', at: [g * 3 + 0.5, 0], vel: 22 },
      ]).flat(), { ...bez, velicina: 300 }),
    });
  proveri((20 / 8) * 2 === 5, 'palačinke');

  S(1, 'Spoji razlomak sa procentom', [['${1|2}$', '50%'], ['${1|4}$', '25%'], ['${3|4}$', '75%'], ['${1|5}$', '20%'], ['${1|10}$', '10%']],
    'Procenat je razlomak sa imeniocem 100: ${1|5} = {20|100}$ = 20%. Zgodno je napamet znati ove parove – mnogo se koriste u prodavnici.',
    'procenat');

  U(2, 'Koji broj NIJE jednak ostalima?', ['${5|3}$', '${3|5}$', '0,6', '60%'],
    '${3|5}$, 0,6 i 60% su isti broj zapisan na tri načina. ${5|3}$ je obrnut razlomak – veći je od 1 (1,666…).',
    'Recipročna vrednost broja je „naopako okrenut“ razlomak: ${3|5}$ i ${5|3}$ pomnoženi daju tačno 1.',
    'razlomak');

  Q(3, 'Koji broj je TAČNO na sredini između ${1|4}$ i ${1|2}$?', ['${3|8}$', '${1|3}$', '${2|5}$', '${3|4}$'],
    '${1|4} = {2|8}$, a ${1|2} = {4|8}$, pa je sredina ${3|8}$. Brojevi ${1|3}$ i ${2|5}$ su takođe između, ali ne na sredini. Između bilo koja dva razlomka uvek postoji sredina – i zato ih ima beskonačno mnogo.',
    'sredina', { medijiOdgovora: G({ A: [0.25, 0, 90], B: [0.375, 0, 90], C: [0.5, 0, 90] }, [{ osa: [0, 1], podela: 0.125, svaki: 8 }, { tacka: 'AC', b: 0 }, { tacka: 'B', b: 1 }], { velicina: 300 }) });

  Q(3, 'Koliko je ${1|2} + {1|4} + {1|8} + {1|16}$ + … ako se sabiranje nastavi beskonačno?', ['Tačno 1', 'Beskonačno', 'Tačno 2', '${15|16}$'],
    'Svaki sabirak popunjava polovinu preostalog praznog dela kvadrata, pa zbir prilazi celini koliko god hoćeš blizu. Grci su se oko ovoga mučili (Zenonov paradoks o Ahileju i kornjači), a danas kažemo da je zbir beskonačnog niza tačno 1.',
    'polovina', { medijiOdgovora: A('geometrijski-red') });

  Q(2, 'Koliko je 1,2 : 0,3?', ['4', '0,4', '40', '0,04'],
    'Deljenik i delilac mogu da se pomnože istim brojem: 1,2 : 0,3 = 12 : 3 = 4. Provera: 4 · 0,3 = 1,2. Kad se deli brojem manjim od 1, rezultat je VEĆI od deljenika.',
    'količnik', {
      medijiOdgovora: G(O, [{ osa: [0, 1.2], podela: 0.1, svaki: 3 },
        ...skokovi(0, 0.3, 4, { h: 0.18, boja: 2, razmak: 0.6 }),
        ...[1, 2, 3, 4].map((n) => ({ tx: String(n), at: [0.15 + 0.3 * (n - 1), 0.32], b: 2 })),
      ], { ...bez, velicina: 300 }),
    });
  proveri(Math.abs(1.2 / 0.3 - 4) < 1e-9, '1,2 : 0,3');

  Q(2, 'Na kolo sreće je 8 jednakih polja. Koji deo kruga zauzimaju plava polja?', ['${3|8}$', '${3|5}$', '${1|3}$', '${5|8}$'],
    'Plavih polja ima 3 od 8, ali nisu jedno do drugog – svejedno je ${3|8}$. Ako se kolo zavrti, verovatnoća da stane na plavo je takođe ${3|8}$.',
    'kolo', { mediji: G(O, torta(8, [0, 1, 3, 0, 2, 5, 0, 1]), { ...bez, velicina: 220 }) });
};
