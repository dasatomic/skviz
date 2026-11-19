// Tema 1 (prvi deo): celi brojevi – skup ℤ i brojevna prava, suprotni brojevi i apsolutna vrednost,
// poređenje, sabiranje (lekcije 1.1–1.4). Sopstveni brojevi, po gradivu Matematike 6 (Arhiknjiga).
module.exports = ({ L, Z, K, G, R, O, bez, r, skok, termometar, proveri }) => {
  const g = (e, velicina = 320) => G(O, e, { ...bez, velicina });
  const M = (x) => (x < 0 ? '−' + Math.abs(x) : String(x));
  const jed = (od, doo) => Math.max(1, (doo - od) / 12);

  // brojevna prava; tacke = [[vrednost, natpis, boja, { k, id }]]; brojevi: false → vidi se samo 0
  function bp(od, doo, tacke = [], { podela = 1, svaki, brojevi = true, e = [], velicina = 320 } = {}) {
    const u = jed(od, doo);
    const el = [{ osa: [od, doo], podela, ...(svaki ? { svaki } : {}), ...(brojevi ? {} : { brojevi: 0 }) }];
    if (!brojevi && od <= 0 && doo >= 0) el.push({ tx: '0', at: [0, r(-0.75 * u)] });
    for (const [v, natpis, b = 1, dod = {}] of tacke) {
      el.push({ tx: '●', at: [r(v), 0.02], b, ...dod });
      if (natpis) el.push({ tx: natpis, at: [r(v), r(0.6 * u)], b, vel: 17, ...dod });
    }
    // bez tačke O u t: granice crteža određuje sama prava (i kad ne sadrži nulu)
    return G({}, [...el, ...e], { velicina });
  }
  const sk = (a, b, x = {}, u = 1) => {
    const h = (x.h ?? Math.min(1.6, 0.35 + (Math.abs(b - a) * 0.25) / u)) * u;
    const s0 = skok(a, b, { ...x, h });
    if (s0.oAt) s0.oAt = [s0.oAt[0], r(h * (x.ispod ? -1 : 1) + (x.ispod ? -0.5 : 0.4) * u)];
    return s0;
  };
  const odNule = (v, { b = 2, o, k, id, y = -1.5, u = 1 } = {}) => ({ lin: [[0, r(y * u)], [v, r(y * u)]], b, debljina: 5, crtaj: 1, ...(o ? { o, oAt: [r(v / 2), r((y - 0.6) * u)] } : {}), ...(k !== undefined ? { k } : {}), ...(id ? { id } : {}) });
  function zgrada(od, doo, { istakni = {}, strelice = [], velicina = 240 } = {}) {
    const e = [];
    for (let s = od; s <= doo; s++) {
      const b = istakni[s] ?? (s < 0 ? 5 : 0);
      e.push({ lin: [[0, s], [3, s], [3, s + 0.9], [0, s + 0.9]], zatv: 1, b, id: s < 0 ? 'g' : s === 0 ? 'p' : 's', ...(istakni[s] !== undefined ? { gusto: 1 } : {}) });
      e.push({ tx: M(s), at: [-0.8, s + 0.3], vel: 16 });
    }
    e.push({ lin: [[-1.6, -0.05], [4.6, -0.05]], b: 2, debljina: 4 });
    strelice.forEach(([a, b2, x = 3.6, dod = {}], i) => e.push({ lin: [[x + i * 0.5, a + 0.45], [x + i * 0.5, b2 + 0.45]], str: 1, b: 3, debljina: 3, crtaj: 1, ...dod }));
    return g(e, velicina);
  }
  function termometri(lista, { od = -20, doo = 20, korak = 10 } = {}) {
    const e = [];
    lista.forEach(([t, natpis, dod = {}], i) => {
      e.push(...termometar(t, { od, doo, korak, x: i * 3.6, b: t < 0 ? 0 : 1, ...dod }));
      if (natpis) e.push({ tx: natpis, at: [i * 3.6 + 0.4, od * 0.12 - 1.3], vel: 14 });
    });
    return g(e, lista.length > 1 ? 120 * lista.length : 150);
  }

  // ════════════════ 1.1 Skup celih brojeva i brojevna prava ════════════════
  L('Skup celih brojeva i brojevna prava');

  Z(1, 'Koji su prethodnik i sledbenik broja $−9$?',
    ['$−10$ i $−8$', '$−8$ i $−10$', '$−10$ i $8$', '$−9$ i $−8$'],
    [K('Prethodnik je jedan korak ulevo: $−9 − 1 = −10$.', ['p']),
     K('Sledbenik je jedan korak udesno: $−8$. Kod negativnih brojeva prethodnik ima „veću cifru“, ali je manji broj.', ['s'])],
    bp(-12, -6, [[-9, '', 3]], { e: [skok(-9, -10, { id: 'p', k: 1, o: '−1' }), skok(-9, -8, { id: 's', k: 2, boja: 2, o: '+1' })] }));

  proveri([-14, 5, -26, 0, 91].filter((x) => x < 0).join() === '-14,-26', 'Z−');
  Z(1, 'Dat je skup $A = \\{−14, 5, −26, 0, 91\\}$. Koji njegovi elementi pripadaju skupu $Z^{−}$?',
    ['$−14$ i $−26$', '$−14$, $−26$ i $0$', '$5$ i $91$', '$0$, $5$ i $91$'],
    [K('Skup $Z^{−}$ čine negativni celi brojevi – oni sa znakom minus.', ['neg']),
     K('Nula nije ni pozitivna ni negativna, pa ne pripada ni $Z^{−}$ ni $Z^{+}$.', ['nula']),
     K('U $Z^{−}$ su $−14$ i $−26$, a u $Z^{+}$ su $5$ i $91$.')],
    R(g([{ lin: [[-6, -2], [-0.5, -2], [-0.5, 2], [-6, 2]], zatv: 1, b: 0, id: 'neg' }, { tx: 'ℤ⁻', at: [-3.2, 2.5], vel: 20 },
      { lin: [[0.5, -2], [6, -2], [6, 2], [0.5, 2]], zatv: 1, b: 1 }, { tx: 'ℤ⁺', at: [3.2, 2.5], vel: 20 },
      { tx: '−14', at: [-4.3, 0.4], vel: 18 }, { tx: '−26', at: [-2.2, -0.6], vel: 18 },
      { tx: '5', at: [2.2, 0.4], vel: 18 }, { tx: '91', at: [4.2, -0.6], vel: 18 },
      { tx: '0', at: [0, -2.9], vel: 20, b: 3, id: 'nula', k: 2 }], 280)));

  proveri([-5, -4, -3, -2, -1, 0, 1, 2, 3].length === 9, 'između −6 i 4');
  Z(1, 'Koliko celih brojeva ima između $−6$ i $4$ (bez njih samih)?',
    ['$9$', '$10$', '$11$', '$8$'],
    [K('Negativni: $−5, −4, −3, −2, −1$ – to je $5$ brojeva.', ['n']),
     K('Zatim $0$, pa pozitivni $1, 2, 3$.', ['z', 'p']),
     K('Ukupno $5 + 1 + 3 = 9$. (Greška $10$ nastaje kad se uračuna i jedan od krajeva, a $8$ kad se zaboravi nula.)')],
    bp(-7, 5, [[-6, '', 4], [4, '', 4],
      ...[-5, -4, -3, -2, -1].map((v) => [v, '', 0, { k: 1, id: 'n' }]), [0, '', 3, { k: 2, id: 'z' }], ...[1, 2, 3].map((v) => [v, '', 1, { k: 2, id: 'p' }])]));

  proveri(9 / (2 - -4) === 1.5, 'jedinična duž 1,5 cm');
  Z(2, 'Tačkama $C$ i $D$ na brojevnoj pravoj odgovaraju brojevi $−4$ i $2$. Duž $CD$ je dugačka $9 cm$. Kolika je jedinična duž?',
    ['$1,5 cm$', '$2 cm$', '$3 cm$', '$4,5 cm$'],
    [K('Od $−4$ do $0$ su $4$ jedinične duži, a od $0$ do $2$ još $2$.', ['l', 'd']),
     K('Duž $CD$ sadrži $4 + 2 = 6$ jediničnih duži.'),
     K('$9 cm : 6 = 1,5 cm$.')],
    bp(-5, 3, [[-4, 'C'], [2, 'D']], { e: [{ lin: [[-4, -1.5], [0, -1.5]], b: 0, debljina: 5, k: 1, id: 'l', o: '4', oAt: [-2, -2.1] }, { lin: [[0, -1.5], [2, -1.5]], b: 2, debljina: 5, k: 1, id: 'd', o: '2', oAt: [1, -2.1] }] }));

  Z(2, 'Tačka $A$ je $4$ jedinične duži levo od tačke $B$, a tački $B$ odgovara broj $−1$. Koji broj odgovara tački $A$?',
    ['$−5$', '$3$', '$−3$', '$5$'],
    [K('Levo znači ka manjim brojevima: od $−1$ idemo $4$ koraka ulevo.', ['s']),
     K('$−1 → −2 → −3 → −4 → −5$, pa je $A$ broj $−5$.')],
    bp(-7, 2, [[-1, 'B', 3], [-5, 'A', 1, { k: 2 }]], { e: [skok(-1, -5, { id: 's', k: 1, o: '~4 koraka' })] }));

  Z(2, 'Rukometni tim je postigao $23$ gola, a primio $31$. Kolika je njegova gol-razlika?',
    ['$−8$', '$8$', '$54$', '$−54$'],
    [K('Gol-razlika je „dati minus primljeni“. Tim je primio više nego što je dao.', ['p']),
     K('Primljeno je $8$ golova više, pa je gol-razlika negativna: $−8$.')],
    R(g([{ lin: [[0, 0], [2, 0], [2, 2.3], [0, 2.3]], zatv: 1, b: 2, gusto: 1 }, { tx: '~dato 23', at: [1, 2.7], vel: 14 },
      { lin: [[3, 0], [5, 0], [5, 3.1], [3, 3.1]], zatv: 1, b: 1, gusto: 1, id: 'p' }, { tx: '~primljeno 31', at: [4, 3.5], vel: 14 },
      { lin: [[3, 2.3], [5, 2.3]], b: 3, debljina: 2, isp: 1 }, { tx: '−8', at: [5.8, 2.6], vel: 18, b: 3, k: 2 }], 240)));

  Z(2, 'Koji je prethodnik najvećeg broja skupa $Z^{−}$?',
    ['$−2$', '$−1$', '$0$', '$1$'],
    [K('Skup $Z^{−} = \\{−1, −2, −3, …\\}$; najveći je onaj najbliži nuli: $−1$.', ['n']),
     K('Njegov prethodnik je jedan korak ulevo: $−2$.', ['s'])],
    R(bp(-5, 2, [[-1, '−1', 1, { id: 'n' }], [-2, '', 2, { k: 2 }]], { e: [{ lin: [[-5, 0.35], [-1, 0.35]], b: 0, debljina: 6 }, skok(-1, -2, { id: 's', k: 2, ispod: true })] })));

  proveri((64 / 2 - 1) + (64 / 2 + 1) === 64, 'n = 32');
  Z(3, 'Zbir prethodnika i sledbenika prirodnog broja $n$ je $64$. Koliki je $n$?',
    ['$32$', '$64$', '$31$', '$33$'],
    [K('Prethodnik je $n − 1$, a sledbenik $n + 1$; oni su jednako udaljeni od $n$ sa dve strane.', ['l', 'd']),
     K('Zato je njihov zbir $(n − 1) + (n + 1) = 2n$.'),
     K('$2n = 64$, pa je $n = 32$. Provera: $31 + 33 = 64$ ✓')],
    bp(29, 35, [[32, 'n', 3]], { brojevi: false, e: [skok(32, 31, { id: 'l', k: 1, o: '−1' }), skok(32, 33, { id: 'd', k: 1, boja: 2, o: '+1' })] }));

  Z(3, 'Napisano je šest uzastopnih celih brojeva, od kojih su tačno četiri negativna. Koji je najmanji od njih?',
    ['$−4$', '$−3$', '$−5$', '$−6$'],
    [K('Četiri negativna broja jedan za drugim koja vode do nule su $−4, −3, −2, −1$.', ['n']),
     K('Posle njih dolaze $0$ i $1$ (nula nije negativna) – ukupno šest brojeva.', ['o']),
     K('Najmanji je $−4$.')],
    R(bp(-6, 3, [...[-4, -3, -2, -1].map((v) => [v, '', 0, { id: 'n' }]), [0, '', 3, { id: 'o', k: 2 }], [1, '', 1, { id: 'o', k: 2 }]])));

  proveri(8 - -3 + 1 === 12, 'dugmad lifta');
  Z(3, 'Zgrada ima $3$ podzemne garaže, prizemlje i $8$ spratova. Dugmad lifta su označena celim brojevima. Koliko ima dugmadi?',
    ['$12$', '$11$', '$10$', '$13$'],
    [K('Garaže su $−3, −2, −1$ – tri dugmeta.', ['g']),
     K('Prizemlje je $0$ – jedno dugme (lako se zaboravi!).', ['p']),
     K('Spratovi $1$ do $8$ – osam dugmadi. Ukupno $3 + 1 + 8 = 12$.', ['s'])],
    zgrada(-3, 8, { velicina: 280 }));

  // ════════════════ 1.2 Suprotni brojevi i apsolutna vrednost ════════════════
  L('Suprotni brojevi i apsolutna vrednost broja');

  Z(1, 'Koji je broj suprotan broju $−15$ i kolika je apsolutna vrednost broja $−15$?',
    ['$15$ i $15$', '$−15$ i $15$', '$15$ i $−15$', '$−15$ i $−15$'],
    [K('Suprotan broj je sa druge strane nule, na istom rastojanju: $−(−15) = 15$.', ['s']),
     K('Apsolutna vrednost je rastojanje od nule: $|−15| = 15$.', ['a']),
     K('Oba odgovora su $15$ – ali to su različiti pojmovi: suprotan broju $15$ bio bi $−15$, a $|15|$ je i dalje $15$.')],
    bp(-18, 18, [[-15, '−15', 0]], { podela: 3, e: [sk(-15, 15, { id: 's', k: 1, h: 0.8 }, 3), odNule(-15, { id: 'a', k: 2, o: '15', u: 3 })] }));

  proveri(Math.abs(-8) + Math.abs(3) === 11, '|−8| + |3|');
  Z(1, 'Izračunaj $|−8| + |3|$.',
    ['$11$', '$5$', '$−5$', '$−11$'],
    [K('$|−8| = 8$ – tačka $−8$ je $8$ jedinica od nule.', ['a']),
     K('$|3| = 3$.', ['b']),
     K('$8 + 3 = 11$. Apsolutne vrednosti su uvek pozitivne (ili nula), pa je i zbir pozitivan.')],
    bp(-9, 5, [[-8, '−8', 0], [3, '3', 1]], { e: [odNule(-8, { b: 0, id: 'a', k: 1, o: '8', u: 1.2 }), odNule(3, { b: 1, id: 'b', k: 2, o: '3', u: 1.2 })] }));

  Z(1, 'Koliko je $−(−(−4))$?',
    ['$−4$', '$4$', '$0$', '$−12$'],
    [K('Kreni iznutra: $−(−4) = 4$ (suprotan broju $−4$).', ['a']),
     K('Spolja je još jedan minus: $−(4) = −4$.', ['b']),
     K('Pravilo: neparan broj minusa daje negativan broj, paran broj minusa – pozitivan.')],
    R(bp(-5, 5, [[-4, '−4', 0]], { e: [skok(-4, 4, { id: 'a', k: 1, h: 1.2 }), skok(4, -4, { id: 'b', k: 2, boja: 2, ispod: true, h: 1.2 })] })));

  Z(2, 'Koji celi brojevi imaju apsolutnu vrednost $6$?',
    ['$6$ i $−6$', 'Samo $6$', 'Samo $−6$', '$0$ i $6$'],
    [K('Tražimo tačke udaljene $6$ jedinica od nule.'),
     K('Desno od nule je $6$, a levo $−6$ – dva broja.', ['l', 'd'])],
    R(bp(-7, 7, [[-6, '−6', 0], [6, '6', 1]], { e: [odNule(-6, { b: 0, id: 'l', o: '6' }), odNule(6, { b: 1, id: 'd', o: '6' })] })));

  Z(2, 'Koliko jediničnih duži je rastojanje između tačaka koje odgovaraju brojevima $7$ i $−7$?',
    ['$14$', '$7$', '$0$', '$49$'],
    [K('Tačka $7$ je $7$ jedinica desno od nule.', ['d']),
     K('Tačka $−7$ je $7$ jedinica levo od nule.', ['l']),
     K('Ukupno $7 + 7 = 14$ jediničnih duži. (Odgovor $0$ bi bio „$7 + (−7)$“ – zbir, a ne rastojanje.)')],
    bp(-8, 8, [[-7, '−7', 0], [7, '7', 1]], { e: [odNule(-7, { b: 0, id: 'l', k: 2, o: '7' }), odNule(7, { b: 1, id: 'd', k: 1, o: '7' })] }));

  proveri(Math.abs(-20) - Math.abs(-13) === 7, '|−20| − |−13|');
  Z(2, 'Izračunaj $|−20| − |−13|$.',
    ['$7$', '$−7$', '$33$', '$−33$'],
    [K('$|−20| = 20$ i $|−13| = 13$.', ['a', 'b']),
     K('$20 − 13 = 7$.')],
    R(bp(-22, 2, [[-20, '−20', 0], [-13, '−13', 1]], { podela: 2, e: [odNule(-20, { b: 0, id: 'a', o: '20', u: 2 }), odNule(-13, { b: 1, id: 'b', o: '13', y: -2.8, u: 2 })] })));

  proveri([-4, -3, -2, -1, 0, 1, 2, 3, 4].length === 9, '|x| ≤ 4');
  Z(2, 'Koliko ima celih brojeva čija apsolutna vrednost nije veća od $4$?',
    ['$9$', '$8$', '$4$', '$5$'],
    [K('Uslov je $|x| ≤ 4$: brojevi udaljeni od nule najviše $4$ jedinice.'),
     K('Pozitivni $1, 2, 3, 4$ i negativni $−1, −2, −3, −4$ – to je $8$ brojeva.', ['pn']),
     K('I nula: $|0| = 0 ≤ 4$. Ukupno $9$.', ['z'])],
    R(bp(-6, 6, [...[-4, -3, -2, -1, 1, 2, 3, 4].map((v) => [v, '', v < 0 ? 0 : 1, { id: 'pn' }]), [0, '', 3, { id: 'z', k: 3 }]])));

  Z(3, 'Tačke $A$ i $B$ odgovaraju suprotnim brojevima, tačka $A$ je levo od $B$, a duž $AB$ sadrži $18$ jediničnih duži. Koji broj odgovara tački $A$?',
    ['$−9$', '$9$', '$−18$', '$18$'],
    [K('Suprotni brojevi su jednako udaljeni od nule, pa je nula tačno na sredini duži $AB$.', ['l', 'd']),
     K('Svaka polovina ima $18 : 2 = 9$ jediničnih duži.'),
     K('$A$ je levo od nule, pa je $A$ broj $−9$ (a $B$ je $9$).')],
    bp(-11, 11, [[-9, 'A', 0], [9, 'B', 1]], { brojevi: false, podela: 9, e: [{ lin: [[-9, -1.8], [0, -1.8]], b: 0, debljina: 5, id: 'l', k: 1, o: '9', oAt: [-4.5, -2.6] }, { lin: [[0, -1.8], [9, -1.8]], b: 1, debljina: 5, id: 'd', k: 1, o: '9', oAt: [4.5, -2.6] }, { tx: '18', at: [0, 1.4], vel: 16, b: 3 }, { lin: [[-9, 1], [9, 1]], b: 3, debljina: 2, isp: 1 }] }));

  proveri([2, 3, 4, 5].length * 2 === 8, '2 ≤ |x| ≤ 5');
  Z(3, 'Koliko celih brojeva $x$ zadovoljava $2 ≤ |x| ≤ 5$?',
    ['$8$', '$4$', '$10$', '$11$'],
    [K('Pozitivni: $2, 3, 4, 5$ – četiri broja.', ['p']),
     K('Svaki ima svog suprotnog sa istom apsolutnom vrednošću: $−2, −3, −4, −5$.', ['n']),
     K('Ukupno $8$. Brojevi $−1, 0, 1$ su preblizu nuli, jer im je $|x| < 2$.')],
    R(bp(-6, 6, [...[2, 3, 4, 5].map((v) => [v, '', 1, { id: 'p' }]), ...[-2, -3, -4, -5].map((v) => [v, '', 0, { id: 'n', k: 2 }]), [-1, '', 4], [0, '', 4], [1, '', 4]])));

  proveri(24 * 5 === 120, '12 cm');
  Z(3, 'Na brojevnoj pravoj jedinična duž je $5 mm$. Koliko su udaljene tačke koje odgovaraju brojevima $−12$ i $12$?',
    ['$12 cm$', '$6 cm$', '$24 cm$', '$0 cm$'],
    [K('Od $−12$ do $0$ je $12$ jediničnih duži, i od $0$ do $12$ još $12$: ukupno $24$.', ['l', 'd']),
     K('$24 · 5 mm = 120 mm$.'),
     K('$120 mm = 12 cm$.')],
    R(bp(-14, 14, [[-12, '−12', 0], [12, '12', 1]], { podela: 2, svaki: 2, e: [odNule(-12, { b: 0, id: 'l', o: '12', u: 2 }), odNule(12, { b: 1, id: 'd', o: '12', u: 2 })] })));

  // ════════════════ 1.3 Poređenje celih brojeva ════════════════
  L('Poređenje celih brojeva');

  Z(1, 'Kako izgledaju brojevi $−4$, $6$, $−9$, $0$ i $2$ poređani od najmanjeg do najvećeg?',
    ['$−9 < −4 < 0 < 2 < 6$', '$−4 < −9 < 0 < 2 < 6$', '$0 < 2 < −4 < 6 < −9$', '$−9 < −4 < 2 < 0 < 6$'],
    [K('Ucrtamo brojeve na brojevnu pravu.'),
     K('Čitamo sleva nadesno: $−9, −4, 0, 2, 6$.', ['t'])],
    R(bp(-10, 7, [[-9, '−9', 0, { id: 't' }], [-4, '−4', 0, { id: 't' }], [0, '0', 3, { id: 't' }], [2, '2', 1, { id: 't' }], [6, '6', 1, { id: 't' }]])));

  Z(1, 'Koji je najmanji od brojeva $−31$, $−13$, $0$ i $−30$?',
    ['$−31$', '$−13$', '$−30$', '$0$'],
    [K('Negativni brojevi su manji od nule; od njih je najmanji onaj sa najvećom apsolutnom vrednošću.'),
     K('$|−31| = 31$ je najveće, pa je $−31$ najmanji.', ['m'])],
    R(bp(-35, 5, [[-31, '', 0, { id: 'm' }], [-30, '', 2], [-13, '', 2], [0, '', 3]], { podela: 5, e: [{ tx: '−31', at: [-31, 2.7], vel: 16, b: 0 }] })));

  proveri([-4, -3, -2, -1, 0, 1, 2].length === 7, '−5 < x < 3');
  Z(2, 'Koliko celih brojeva $x$ zadovoljava $−5 < x < 3$?',
    ['$7$', '$8$', '$9$', '$6$'],
    [K('Krajevi $−5$ i $3$ ne ulaze (stroge nejednakosti).', ['kr']),
     K('To su $−4, −3, −2, −1, 0, 1, 2$ – sedam brojeva.', ['x'])],
    bp(-6, 4, [[-5, '○', 4, { id: 'kr' }], [3, '○', 4, { id: 'kr' }], ...[-4, -3, -2, -1, 0, 1, 2].map((v) => [v, '', 1, { id: 'x', k: 2 }])]));

  Z(2, 'Izmerene su temperature: Beograd $−2 °C$, Zlatibor $−9 °C$, Niš $1 °C$, Subotica $−5 °C$. Gde je bilo najhladnije?',
    ['Zlatibor', 'Subotica', 'Beograd', 'Niš'],
    [K('Najhladnije je tamo gde je temperatura najmanji broj.'),
     K('$−9 < −5 < −2 < 1$, pa je najhladnije bilo na Zlatiboru.', ['z'])],
    termometri([[-2, '~Beograd'], [-9, '~Zlatibor', { id: 'z' }], [1, '~Niš'], [-5, '~Subotica']], { od: -10, doo: 10, korak: 5 }));

  Z(2, 'Koji je najveći ceo broj koji je manji od $−7$?',
    ['$−8$', '$−6$', '$−7$', '$−70$'],
    [K('Brojevi manji od $−7$ su levo od njega: $−8, −9, −10, …$', ['l']),
     K('Najveći (najdesniji) od njih je $−8$.')],
    R(bp(-11, -5, [[-7, '−7', 3], [-8, '−8', 1]], { e: [{ lin: [[-7.3, 0.35], [-11, 0.35]], str: 1, b: 0, debljina: 4, id: 'l' }] })));

  Z(2, 'Koliko ima negativnih celih brojeva koji su veći od $−6$?',
    ['$5$', '$6$', '$4$', 'Beskonačno mnogo'],
    [K('Veći od $−6$ znači desno od $−6$.'),
     K('Negativni su samo do nule: $−5, −4, −3, −2, −1$ – pet brojeva.', ['x'])],
    bp(-7, 2, [[-6, '−6', 3], ...[-5, -4, -3, -2, -1].map((v) => [v, '', 1, { id: 'x', k: 2 }])]));

  Z(3, 'Za brojeve $a$ i $b$ važi $a < b < 0$, $|a| = 9$ i $|b| = 4$. Koji su to brojevi?',
    ['$a = −9$, $b = −4$', '$a = −4$, $b = −9$', '$a = 9$, $b = 4$', '$a = −9$, $b = 4$'],
    [K('Oba broja su negativna ($b < 0$), pa su $a = −9$ ili $9$ → $−9$, a $b = −4$.'),
     K('Provera: $−9 < −4 < 0$ ✓ – onaj sa većom apsolutnom vrednošću je levlje.', ['a', 'b'])],
    R(bp(-10, 2, [[-9, 'a', 0, { id: 'a' }], [-4, 'b', 1, { id: 'b' }]])));

  proveri([-1, 0, 1, 2, 3].length === 5, '|x| < 4 i x > −2');
  Z(3, 'Koliko celih brojeva $x$ istovremeno zadovoljava $|x| < 4$ i $x > −2$?',
    ['$5$', '$7$', '$6$', '$4$'],
    [K('$|x| < 4$ daje $−3, −2, −1, 0, 1, 2, 3$.', ['a']),
     K('Od njih uslov $x > −2$ ispunjavaju $−1, 0, 1, 2, 3$ – pet brojeva.', ['b'])],
    R(bp(-5, 5, [[-3, '', 4, { id: 'a' }], [-2, '', 4, { id: 'a' }], ...[-1, 0, 1, 2, 3].map((v) => [v, '', 1, { id: 'b' }])], { e: [{ lin: [[-3.5, -1.4], [3.5, -1.4]], b: 0, debljina: 4, id: 'a', o: '|x| < 4', oAt: [0, -2.1] }, { lin: [[-2, 1.2], [5, 1.2]], b: 2, debljina: 4, id: 'b', k: 2, o: 'x > −2', oAt: [1.5, 1.8] }] })));

  Z(3, 'Četiri ronioca su na dubinama $18 m$, $7 m$, $25 m$ i $12 m$. Koliko njih roni pliće od $15 m$, tj. iznad nivoa $−15 m$?',
    ['$2$', '$1$', '$3$', '$4$'],
    [K('Dubine pišemo kao negativne brojeve: $−18$, $−7$, $−25$, $−12$.'),
     K('Iznad nivoa $−15$ su brojevi veći od $−15$: $−7$ i $−12$.', ['x']),
     K('Dakle, dva ronioca.')],
    g([{ lin: [[0, 0], [8, 0], [8, -5.4], [0, -5.4]], zatv: 1, b: 0 }, { lin: [[0, 0], [8, 0]], b: 0, debljina: 3 },
      { lin: [[0, -3], [8, -3]], b: 3, debljina: 2, isp: 1 }, { tx: '−15 m', at: [9, -3.1], vel: 14, b: 3 },
      ...[[1.5, -18], [3.3, -7], [5.1, -25], [6.8, -12]].map(([x, d]) => ({ tx: '●', at: [x, r(d * 0.2)], b: 1, vel: 22, ...(d > -15 ? { id: 'x' } : {}) })),
      ...[[1.5, -18], [3.3, -7], [5.1, -25], [6.8, -12]].map(([x, d]) => ({ tx: M(d), at: [x + 0.85, r(d * 0.2 - 0.1)], vel: 13 }))], 280));

  Z(2, 'Gol-razlike četiri tima su: Orlovi $+3$, Vukovi $−3$, Sokolovi $−7$, Lavovi $0$. Koji tim je na tabeli poslednji?',
    ['Sokolovi', 'Vukovi', 'Lavovi', 'Orlovi'],
    [K('Poslednji je tim sa najmanjom gol-razlikom.'),
     K('$−7 < −3 < 0 < 3$: najmanji broj je $−7$ – Sokolovi.', ['s'])],
    R(bp(-8, 4, [[-7, '~Sokolovi', 0, { id: 's' }], [-3, '~Vukovi', 0], [0, '~Lavovi', 3], [3, '~Orlovi', 1]])));

  // ════════════════ 1.4 Sabiranje celih brojeva ════════════════
  L('Sabiranje celih brojeva');

  proveri(-7 + 4 === -3, '−7 + 4');
  Z(1, 'Izračunaj $−7 + 4$.',
    ['$−3$', '$3$', '$−11$', '$11$'],
    [K('Krenemo od $−7$ i pomerimo se $4$ koraka udesno.', ['s']),
     K('Stižemo do $−3$. Ili: znak je minus jer je $|−7| > |4|$, a $7 − 4 = 3$.')],
    bp(-9, 1, [[-7, '−7', 3], [-3, '', 1, { k: 2 }]], { e: [skok(-7, -3, { id: 's', k: 1, o: '+4' })] }));

  proveri(-6 + -9 === -15, '−6 + (−9)');
  Z(1, 'Izračunaj $−6 + (−9)$.',
    ['$−15$', '$15$', '$−3$', '$3$'],
    [K('Oba sabirka su negativna: idemo od $−6$ još $9$ koraka ulevo.', ['s']),
     K('Saberemo apsolutne vrednosti ($6 + 9 = 15$) i zadržimo znak minus: $−15$.')],
    bp(-17, 1, [[-6, '−6', 3], [-15, '−15', 1, { k: 2 }]], { svaki: 3, e: [sk(-6, -15, { id: 's', k: 1, o: '−9' }, jed(-17, 1))] }));

  proveri(12 + -20 === -8, '12 + (−20)');
  Z(1, 'Izračunaj $12 + (−20)$.',
    ['$−8$', '$8$', '$32$', '$−32$'],
    [K('Sabirci su suprotnih znakova, pa oduzimamo apsolutne vrednosti: $20 − 12 = 8$.', ['s']),
     K('Znak uzimamo od sabirka sa većom apsolutnom vrednošću ($−20$): rezultat je $−8$.')],
    bp(-10, 14, [[12, '12', 3], [-8, '', 1, { k: 2 }]], { podela: 2, e: [sk(12, -8, { id: 's', k: 1, o: '−20' }, jed(-10, 14))] }));

  proveri(-38 + 25 === -13, '−38 + 25');
  Z(2, 'Izračunaj $−38 + 25$.',
    ['$−13$', '$13$', '$−63$', '$63$'],
    [K('Suprotni znaci → oduzimamo: $38 − 25 = 13$.'),
     K('Veću apsolutnu vrednost ima $−38$, pa je zbir negativan: $−13$.', ['s'])],
    R(bp(-40, 5, [[-38, '', 0], [-13, '−13', 1]], { podela: 5, e: [sk(-38, -13, { id: 's', o: '+25', h: 1 }, jed(-40, 5)), { tx: '−38', at: [-38, r(-1.2 * jed(-40, 5))], b: 0, vel: 14 }] })));

  proveri(-145 + -58 === -203, '−145 + (−58)');
  Z(2, 'Izračunaj $−145 + (−58)$.',
    ['$−203$', '$−87$', '$87$', '$203$'],
    [K('Isti znaci → saberemo apsolutne vrednosti: $145 + 58 = 203$.'),
     K('Zajednički znak je minus: $−203$. (Greška $−87$ nastaje kad se apsolutne vrednosti oduzmu.)', ['s'])],
    R(bp(-220, 20, [[-145, '', 0], [-203, '−203', 1]], { podela: 20, svaki: 2, e: [sk(-145, -203, { id: 's', o: '−58', h: 1 }, jed(-220, 20)), { tx: '−145', at: [-145, r(-1.2 * jed(-220, 20))], b: 0, vel: 14 }] })));

  proveri(-9 + 13 === 4, 'temperatura');
  Z(2, 'U ponoć je bilo $−9 °C$, a do podneva je temperatura porasla za $13°$. Koliko je bilo u podne?',
    ['$4 °C$', '$−4 °C$', '$22 °C$', '$−22 °C$'],
    [K('Porast je sabiranje pozitivnog broja: $−9 + 13$.', ['p']),
     K('Prvih $9°$ nas dovodi do nule, a ostaje još $13 − 9 = 4°$ iznad nule: $4 °C$.', ['a'])],
    termometri([[-9, '~ponoć', { id: 'p' }], [4, '~podne', { k: 2, id: 'a' }]], { od: -10, doo: 10, korak: 5 }));

  proveri(-17 + 9 + -3 + 11 === 0, 'grupisanje');
  Z(2, 'Izračunaj $−17 + 9 + (−3) + 11$ (zgodnim grupisanjem).',
    ['$0$', '$−40$', '$40$', '$−6$'],
    [K('Grupišemo negativne: $−17 + (−3) = −20$.', ['n']),
     K('Grupišemo pozitivne: $9 + 11 = 20$.', ['p']),
     K('$−20 + 20 = 0$ – zbir suprotnih brojeva.')],
    R(g([{ lin: [[0, 0], [1.7, 0], [1.7, -1.7], [0, -1.7]], zatv: 1, b: 0, gusto: 1, id: 'n' }, { lin: [[1.9, 0], [2.2, 0], [2.2, -0.3], [1.9, -0.3]], zatv: 1, b: 0, gusto: 1, id: 'n' },
      { lin: [[3, 0], [3.9, 0], [3.9, 0.9], [3, 0.9]], zatv: 1, b: 1, gusto: 1, id: 'p' }, { lin: [[4.1, 0], [5.2, 0], [5.2, 1.1], [4.1, 1.1]], zatv: 1, b: 1, gusto: 1, id: 'p' },
      { lin: [[-0.4, 0], [5.6, 0]], b: 4, debljina: 2 },
      { tx: '−17', at: [0.85, -2.2], vel: 13 }, { tx: '−3', at: [2.05, -0.8], vel: 13 }, { tx: '9', at: [3.45, 1.3], vel: 13 }, { tx: '11', at: [4.65, 1.5], vel: 13 }], 260)));

  proveri(2500 + 3000 + 1800 + -9000 === -1700, 'rođendan');
  Z(3, 'Lena je dobila $2 500$, $3 000$ i $1 800$ dinara, a proslava košta $9 000$ dinara. Kakav je ishod?',
    ['Nedostaje $1 700$ dinara', 'Ostaje $1 700$ dinara', 'Nedostaje $16 300$ dinara', 'Ostaje $7 300$ dinara'],
    [K('Prihodi: $2 500 + 3 000 + 1 800 = 7 300$.', ['p']),
     K('Trošak je negativan prihod: $7 300 + (−9 000) = −1 700$.', ['t']),
     K('Zbir je negativan, pa novca nedostaje: $|−1 700| = 1 700$ dinara.')],
    g([{ lin: [[-0.4, 0], [6.4, 0]], b: 4, debljina: 2 },
      { lin: [[0.2, 0], [1.6, 0], [1.6, 1.25], [0.2, 1.25]], zatv: 1, b: 2, gusto: 1, id: 'p' }, { tx: '2500', at: [0.9, 1.6], vel: 13 },
      { lin: [[1.8, 0], [3.2, 0], [3.2, 1.5], [1.8, 1.5]], zatv: 1, b: 2, gusto: 1, id: 'p' }, { tx: '3000', at: [2.5, 1.85], vel: 13 },
      { lin: [[3.4, 0], [4.8, 0], [4.8, 0.9], [3.4, 0.9]], zatv: 1, b: 2, gusto: 1, id: 'p' }, { tx: '1800', at: [4.1, 1.25], vel: 13 },
      { lin: [[5, 0], [6.4, 0], [6.4, -4.5], [5, -4.5]], zatv: 1, b: 1, gusto: 1, id: 't' }, { tx: '−9000', at: [5.7, -4.95], vel: 13 }], 260));

  proveri(Array.from({ length: 23 }, (_, i) => i - 10).reduce((a, b) => a + b, 0) === 23, 'zbir od −10 do 12');
  Z(3, 'Koliki je zbir svih celih brojeva od $−10$ do $12$?',
    ['$23$', '$0$', '$12$', '$−23$'],
    [K('Brojevi $−10$ i $10$, $−9$ i $9$, …, $−1$ i $1$ su parovi suprotnih brojeva – svaki par daje $0$.', ['par']),
     K('Nula ne menja zbir.'),
     K('Ostaju samo $11$ i $12$: $11 + 12 = 23$.', ['ost'])],
    R(bp(-11, 13, [[11, '', 1, { id: 'ost' }], [12, '', 1, { id: 'ost' }]], { podela: 1, svaki: 2, e: [2, 5, 8, 10].map((v, i) => sk(-v, v, { boja: i % 2 ? 2 : 0, h: 0.4 + i * 0.25, id: 'par' }, jed(-11, 13))) })));

  proveri(-3 + 7 + -6 + 4 === 2, 'lift');
  Z(3, 'Lift kreće sa nivoa $−3$, popne se $7$ spratova, spusti $6$, pa popne još $4$. Na kom je spratu?',
    ['$2$', '$8$', '$−2$', '$20$'],
    [K('Penjanje je sabiranje pozitivnog, a spuštanje negativnog broja: $−3 + 7 + (−6) + 4$.'),
     K('$−3 + 7 = 4$; $4 + (−6) = −2$; $−2 + 4 = 2$.', ['a', 'b', 'c']),
     K('Lift je na drugom spratu.')],
    zgrada(-3, 5, { istakni: { '-3': 3 }, strelice: [[-3, 4, 3.6, { id: 'a', k: 2 }], [4, -2, 3.6, { id: 'b', k: 2 }], [-2, 2, 3.6, { id: 'c', k: 2 }]], velicina: 260 }));
};
