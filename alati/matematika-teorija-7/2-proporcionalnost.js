// Lekcije 6–9: približna vrednost, računske operacije sa korenima, funkcija direktne proporcionalnosti,
// produžena proporcija. Sve „u glavi“: zaokruživanje, poređenje korena, koeficijent k, odnosi delova.
module.exports = ({ L, Q, U, S, G, r, kruzni, proveri, pitanja }) => {
  const prvo = pitanja.length; // pitanja ove teme počinju odavde (nadji ispod traži samo među njima)
  // brojevna prava [od, do] sa tačkama [[vrednost, natpis, boja]]; svaka tačka ima ime P0, P1…
  const brojevna = (od, doo, tacke = [], { podela = 0.1, svaki = 1, velicina = 320 } = {}) => {
    const t = {}, h = 0.08 * (doo - od);
    const e = [{ osa: [od, doo], podela, svaki }];
    tacke.forEach(([v, nat, b = 1], i) => {
      const ime = 'P' + i;
      t[ime] = [r(v), 0];
      e.push({ tacka: ime, b }, { tx: nat, at: [r(v), r(h)], b });
    });
    return G(t, e, { bezImena: Object.keys(t), velicina });
  };
  // pravougaonik w × h (dole levo u (0,0)) sa natpisima stranica
  const pravougaonik = (w, h, { donja, leva, desna, gore, b = 1, velicina = 280 } = {}) => {
    const m = Math.max(w, h) * 0.13;
    const e = [{ lin: [[0, 0], [w, 0], [w, h], [0, h]], zatv: 1, gusto: 1, b }];
    if (donja) e.push({ tx: donja, at: [w / 2, r(-m)], b });
    if (leva) e.push({ tx: leva, at: [r(-m * 1.4), h / 2], b });
    if (desna) e.push({ tx: desna, at: [r(w + m * 1.4), h / 2], b });
    if (gore) e.push({ tx: gore, at: [w / 2, r(h + m)], b });
    return G({}, e, { velicina });
  };
  // traka (pravougaonik) podeljena na delove srazmerne brojevima; natpisi po delu
  const trakaDelova = (delovi, { natpisi = [], iznad = '', velicina = 340 } = {}) => {
    const suma = delovi.reduce((a, b) => a + b, 0);
    const e = [];
    let x = 0;
    delovi.forEach((d, i) => {
      const w = (10 * d) / suma;
      e.push({ lin: [[r(x), 0], [r(x + w), 0], [r(x + w), 1.2], [r(x), 1.2]], zatv: 1, gusto: 1, b: (i + 1) % 6 });
      if (natpisi[i]) e.push({ tx: natpisi[i], at: [r(x + w / 2), 0.6], vel: 16 });
      x += w;
    });
    if (iznad) e.push({ tx: iznad, at: [5, 1.55], vel: 18 });
    return G({}, e, { velicina });
  };
  // koordinatna ravan sa mrežom [x0, x1, y0, y1]; tačke [[ime, x, y]] (ime = velika slova → oznaka sama)
  const ravan = (mreza, { tacke = [], elementi = [], velicina = 300, podela = [1, 1] } = {}) => {
    const t = {}, e = [{ mreza, podela, brojevi: 1 }];
    tacke.forEach(([ime, x, y]) => { t[ime] = [x, y]; e.push({ tacka: ime, b: 1 }); });
    return G(t, [...e, ...elementi], { bezImena: [], velicina });
  };

  // ── 6. približna vrednost ──
  L('Približna vrednost');
  Q(1, 'Kako se zove razlika između tačnog broja i njegove približne vrednosti, uzeta bez znaka?',
    ['Apsolutna greška', 'Zaokružena razlika', 'Decimalni ostatak', 'Približni zbir'],
    'Za $\\pi \\approx 3,14$ apsolutna greška je manja od $0,002$, pa je 3,14 vrlo dobra približna vrednost broja π.', 'greška',
    { medijiOdgovora: brojevna(2.3, 2.4, [[2.37, '2,37'], [2.4, '2,4', 2]], { podela: 0.01, svaki: 10, velicina: 320 }) });
  Q(1, 'Koji ceo broj je bliži tački $M$ sa crteža?',
    ['5', '4', '6', '3'],
    'Tačka je na $4,7$. Od broja 5 udaljena je $0,3$, a od broja 4 čak $0,7$, pa je bliži broj 5.', 'bliži',
    { mediji: brojevna(3, 6, [[4.7, 'M']], { podela: 1, svaki: 1 }) });
  Q(1, 'Zaokruži broj $3,58$ na jednu decimalu. Koji je rezultat?',
    ['3,6', '3,5', '4', '3,7'],
    'Prva odbačena cifra je 8, veća od 5, pa se cifra 5 povećava za 1: $3,58 \\approx 3,6$.', 'decimala',
    { medijiOdgovora: brojevna(3.5, 3.6, [[3.58, '3,58']], { podela: 0.01, svaki: 10 }) });
  Q(2, 'Koja je približna vrednost broja $\\frac{1}{6}$ na jednu decimalu?',
    ['0,2', '0,1', '0,16', '0,17'],
    'Broj je $0,1666\\dots$. Prva odbačena cifra je 6, pa se 1 povećava za 1 i dobijamo $0,2$. Broj $0,16$ ima dve decimale.', 'razlomak',
    { mediji: brojevna(0, 0.3, [[1 / 6, '1/6']], { podela: 0.01, svaki: 10 }) });
  Q(2, 'Koliko je $\\sqrt{2}$ približno na jednu decimalu?',
    ['1,4', '1,5', '1,41', '1'],
    'Kako je $1,4^2 = 1,96 < 2$ i $1,5^2 = 2,25 > 2$, broj $\\sqrt{2}$ je između 1,4 i 1,5. Srednja vrednost $1,45^2 = 2,1025$ je veća od 2, pa je $\\sqrt{2}$ bliže 1,4.', 'koren',
    { medijiOdgovora: brojevna(1, 2, [[Math.SQRT2, '√2']], { podela: 0.1, svaki: 1 }) });
  Q(2, 'Koliko je apsolutna greška kad broj $0,96$ zaokružimo na jednu decimalu?',
    ['0,04', '0,06', '0,4', '1,04'],
    'Približna vrednost je $1,0$, a razlika je $|0,96 - 1,0| = 0,04$.', 'greška',
    { medijiOdgovora: brojevna(0.9, 1, [[0.96, '0,96']], { podela: 0.01, svaki: 10 }) });
  Q(2, 'Koliko je $\\sqrt{5}$ približno na jednu decimalu?',
    ['2,2', '2,3', '2,25', '2,5'],
    'Kako je $2,2^2 = 4,84$ i $2,3^2 = 5,29$, broj $\\sqrt{5}$ je između 2,2 i 2,3. Zatim, $2,25^2 = 5,0625 > 5$, pa je $\\sqrt{5}$ manje od 2,25 i bliže je 2,2.', 'koren',
    { mediji: brojevna(2, 3, [[Math.sqrt(5), '√5']], { podela: 0.1, svaki: 1 }) });
  Q(3, 'Koja tvrdnja je tačna za broj $\\sqrt{5}$?',
    ['$\\sqrt{5} < 2,25$', '$\\sqrt{5} > 2,3$', '$\\sqrt{5} = 2,25$', '$\\sqrt{5} > 2,25$'],
    'Kvadriranjem: $2,25^2 = 5,0625$, što je više od 5. Zato je $\\sqrt{5} < 2,25$. Broj $\\sqrt{5}$ nema konačan decimalni zapis.', 'koren', { medijiOdgovora: brojevna(2.2, 2.3, [[Math.sqrt(5), '√5', 1], [2.25, '2,25', 2]], { podela: 0.01, svaki: 5 }) });
  Q(3, 'Po pravilima iz udžbenika, broj $8,45$ se na jednu decimalu zaokružuje na:',
    ['8,4', '8,5', '8,45', '9'],
    'Odbačena cifra je 5, a iza nje nema drugih cifara različitih od nule. Cifra ispred nje je 4 (parna), pa ostaje $8,4$. Broj $8,35$ je drugačiji slučaj: ispred 5 je neparna 3, pa se zaokružuje na $8,4$.', 'pravilo',
    { medijiOdgovora: brojevna(8.4, 8.5, [[8.45, '8,45']], { podela: 0.01, svaki: 10 }) });
  Q(2, 'Broj $1,2998$ zaokružen na tri decimale je:',
    ['1,3', '1,299', '1,2', '1,31'],
    'Cifra 8 se zaokružuje na više: $1,2998 \\approx 1,300$, a to je isto što i $1,3$. Broj $1,299$ je samo odsečen, nije zaokružen.', 'zaokružiti');
  Q(2, 'Broj $45,58978$ zaokružen na dve decimale je:',
    ['45,59', '45,58', '45,6', '46'],
    'Posle druge decimale ide $978$. Prva odbačena cifra je 9, veća od 5, pa se 8 povećava na 9: dobijamo $45,59$.', 'decimala');
  Q(2, 'Koliko je $\\frac{2}{7}$ zaokruženo na dve decimale?',
    ['0,29', '0,28', '0,3', '0,286'],
    'Broj $\\frac{2}{7}$ je $0,2857\\dots$. Posle druge decimale stoji 5, a iza nje 7 (različito od nule), pa se 8 povećava na 9: $0,29$.', 'razlomak',
    { medijiOdgovora: brojevna(0.2, 0.3, [[2 / 7, '2/7']], { podela: 0.01, svaki: 10 }) });
  Q(3, 'Koliko je $0,0378$ zaokruženo na dve decimale?',
    ['0,04', '0,03', '0,038', '0,4'],
    'Dve decimale su mesta 0,01 i 0,02. Broj je $0,0378$, a odbačena cifra je 7, pa se 3 povećava na 4: $0,04$. Pazi na mesta decimala: $0,4$ je deset puta veće.', 'decimala', { medijiOdgovora: brojevna(0.03, 0.04, [[0.0378, '0,0378']], { podela: 0.001, svaki: 5 }) });
  Q(3, 'Koji je ceo broj najbliži zbiru $\\sqrt{2}+\\sqrt{3}$?',
    ['3', '2', '4', '5'],
    'Zbir je približno $1,41 + 1,73 = 3,14$, pa je najbliži ceo broj 3. Greška je misliti da je zbir jednak $\\sqrt{5}$, a to nije tačno.', 'zbir',
    { medijiOdgovora: brojevna(2, 4, [[Math.SQRT2 + Math.sqrt(3), '√2+√3']], { podela: 0.1, svaki: 5 }) });
  S(1, 'Spoji broj sa njegovom vrednošću zaokruženom na jednu decimalu.',
    [['3,14159', '3,1'], ['2,75', '2,8'], ['0,96', '1,0'], ['7,449', '7,4']],
    'Pri zaokruživanju gledamo prvu odbačenu cifru. Broj 2,75 je 2,8, jer je ispred pete cifre neparna 7.', 'zaokružiti');
  U(1, 'Koji od ovih brojeva NIJE zaokružen na dve decimale?',
    ['3,1', '3,14', '2,50', '7,09'],
    'Broj $3,1$ ima samo jednu decimalu. Ostali imaju po dve decimale.', 'Kalkulator često prikaže mnogo decimala, ali pri zaokruživanju sami biramo koliko ih čuvamo.', 'decimala');

  // ── 7. osnovne računske operacije i kvadratni koren ──
  L('Osnovne računske operacije i kvadratni koren');
  Q(1, 'Koji broj je suprotan broju $-\\sqrt{5}$?',
    ['$\\sqrt{5}$', '$-{1|√{5}}$', '$-5$', '${1|√{5}}$'],
    'Suprotan broj menja samo znak. Zbir $-\\sqrt{5} + \\sqrt{5}$ daje nulu.', 'suprotan',
    { mediji: brojevna(-3, 3, [[-Math.sqrt(5), '−√5']], { podela: 1, svaki: 1 }), medijiOdgovora: brojevna(-3, 3, [[-Math.sqrt(5), '−√5', 1], [Math.sqrt(5), '√5', 2]], { podela: 1, svaki: 1 }) });
  Q(2, 'Koji broj je recipročan broju $\\sqrt{2}$?',
    ['${1|√{2}}$', '$-\\sqrt{2}$', '$2\\sqrt{2}$', '${2|√{2}}$'],
    'Recipročan broj dobijamo kao $1$ podeljeno brojem: ${1|√{2}}$ (isto što i ${√{2}|2}$). Broj ${2|√{2}}$ je jednak $\\sqrt{2}$, a ne njegov recipročni broj.', 'recipročan');
  Q(1, 'Kolika je površina kvadrata čija je stranica $\\sqrt{3}$?',
    ['3', '√3', '6', '1,73'],
    'Površina kvadrata je stranica na kvadrat: $(\\sqrt{3})^2 = 3$.', 'kvadrat',
    { mediji: pravougaonik(1.732, 1.732, { gore: '√3', desna: '√3', velicina: 200 }) });
  Q(2, 'Kolika je površina pravougaonika sa stranicama $\\sqrt{2}$ i $\\sqrt{8}$?',
    ['4', '√10', '2√2', '6'],
    'Površina je $\\sqrt{2}\\cdot\\sqrt{8}$. Pod jednim korenom množimo brojeve: $\\sqrt{16} = 4$.', 'stranica',
    { mediji: pravougaonik(2.828, 1.414, { donja: '√8', desna: '√2' }), medijiOdgovora: pravougaonik(2.828, 1.414, { donja: '√8', desna: '√2', gore: '√2·√8 = √16 = 4' }) });
  Q(2, 'Dva kvadrata imaju površine 4 cm² i 9 cm². Kolika je stranica kvadrata čija je površina zbir te dve površine?',
    ['$\\sqrt{13}$ cm', '5 cm', '3,5 cm', '6,5 cm'],
    '$\\sqrt{13} \\approx 3,6$ cm. Stranice se ne sabiraju: $\\sqrt{4} + \\sqrt{9} = 5$ je stranica kvadrata površine 25, a ne 13.', 'koren',
    { mediji: G({}, [{ lin: [[0, 0], [2, 0], [2, 2], [0, 2]], zatv: 1, gusto: 1, b: 1 }, { tx: '4 cm²', at: [1, 1], vel: 16 }, { lin: [[2.6, 0], [5.6, 0], [5.6, 3], [2.6, 3]], zatv: 1, gusto: 1, b: 2 }, { tx: '9 cm²', at: [4.1, 1.5], vel: 16 }], { velicina: 300 }),
      medijiOdgovora: pravougaonik(3.606, 3.606, { gore: '√13 ≈ 3,6 cm', velicina: 200 }) });
  Q(1, 'Koliko je $(\\sqrt{5})^2$?',
    ['5', '√5', '25', '2,236'],
    'Kvadriranje poništava koren: $(\\sqrt{a})^2 = a$ za $a \\ge 0$.', 'kvadrat',
    { medijiOdgovora: pravougaonik(2.236, 2.236, { gore: '√5', desna: '√5', velicina: 200 }) });
  Q(2, 'Koliko je $\\sqrt{7}\\cdot\\sqrt{28}$?',
    ['14', '√35', '7', '28'],
    'Pod korenom množimo: $7\\cdot 28 = 196$, a $\\sqrt{196} = 14$, jer je $14^2 = 196$.', 'proizvod',
    { medijiOdgovora: pravougaonik(5.292, 2.646, { donja: '√28', desna: '√7', gore: '√7·√28 = √196 = 14' }) });
  Q(2, 'Izvuci što više ispred korena: $\\sqrt{48}$ je jednako:',
    ['$4\\sqrt{3}$', '$6\\sqrt{2}$', '$16\\sqrt{3}$', '$3\\sqrt{16}$'],
    'Broj $48 = 16\\cdot 3$, pa je $\\sqrt{48} = \\sqrt{16}\\cdot\\sqrt{3} = 4\\sqrt{3}$.', 'koren');
  Q(2, 'Koliko je $\\sqrt{2}+\\sqrt{8}$ zapisano kao $k\\sqrt{2}$?',
    ['3√2', '√10', '2√2', '4√2'],
    'Pošto je $\\sqrt{8} = 2\\sqrt{2}$, sabiramo: $\\sqrt{2} + 2\\sqrt{2} = 3\\sqrt{2}$.', 'zbir',
    { mediji: G({}, [{ lin: [[0, 0], [1.414, 0]], b: 1, debljina: 5 }, { lin: [[1.414, 0], [4.243, 0]], b: 2, debljina: 5 }, { tx: '√2', at: [0.7, 0.45], vel: 16, b: 1 }, { tx: '√8', at: [2.83, 0.45], vel: 16, b: 2 }], { velicina: 320 }) });
  Q(2, 'Racionalizuj: koji zapis je jednak ${1|√{7}}$ bez korena u imeniocu?',
    ['${√{7}|7}$', '${7|√{7}}$', '$\\frac{1}{7}$', '$\\sqrt{7}-1$'],
    'Brojilac i imenilac pomnožimo sa $\\sqrt{7}$: ${√{7}|√{7}·√{7}} = {√{7}|7}$. Imenilac je sada racionalan broj.', 'imenilac');
  Q(3, 'Zbir kojih dvaju brojeva je racionalan broj?',
    ['$\\sqrt{5}$ i $-\\sqrt{5}$', '$\\sqrt{2}$ i $\\sqrt{3}$', '$1$ i $\\sqrt{2}$', '$\\sqrt{2}$ i $\\sqrt{2}$'],
    'Zbir $\\sqrt{5} + (-\\sqrt{5}) = 0$ je racionalan. Zbir $\\sqrt{2}+\\sqrt{2} = 2\\sqrt{2}$ je iracionalan, kao i zbir $1 + \\sqrt{2}$.', 'iracionalan');
  Q(3, 'Da li je $\\sqrt{2}-\\sqrt{3}=\\sqrt{2-3}$?',
    ['Nije, jer ispod korena ne sme biti negativan broj', 'Jeste, jer je $2-3=-1$', 'Jeste, za sve brojeve', 'Samo ako su oba broja iracionalna'],
    'Levo je $\\sqrt{2}-\\sqrt{3} \\approx -0,3$, a $\\sqrt{-1}$ nema smisla u skupu realnih brojeva. Zato jednakost ne važi.', 'koren');
  Q(1, 'Koliko je $\\sqrt{0,25}$?',
    ['0,5', '0,25', '0,05', '0,125'],
    'Broj $0,5\\cdot 0,5 = 0,25$, pa je $\\sqrt{0,25} = 0,5$.', 'koren',
    { medijiOdgovora: pravougaonik(0.5, 0.5, { gore: '0,25 = 0,5²', velicina: 200 }) });
  Q(3, 'Pravougaonik ima stranice $\\sqrt{2}$ i $\\sqrt{3}$. Kolika je njegova površina, približno na jednu decimalu?',
    ['2,4', '2,5', '2,2', '2,7'],
    'Površina je $\\sqrt{6}$. Kako je $2,45^2 = 6,0025 > 6$, broj $\\sqrt{6}$ je manji od 2,45, pa je približno 2,4.', 'površina',
    { mediji: pravougaonik(1.732, 1.414, { donja: '√3', desna: '√2' }) });
  U(1, 'Koji od ovih zapisa NIJE jednak $\\sqrt{12}$?',
    ['$3\\sqrt{3}$', '$2\\sqrt{3}$', '$\\sqrt{4\\cdot 3}$', '$\\sqrt{48}:2$'],
    'Pošto je $12 = 4\\cdot 3$, važi $\\sqrt{12} = 2\\sqrt{3}\\approx 3,46$. Zapis $3\\sqrt{3}\\approx 5,2$ je veći.', 'Broj $3\\sqrt{3}$ je isto što i $\\sqrt{27}$, pa je veći od $\\sqrt{12}$ jer je 27 > 12.', 'koren');
  S(1, 'Spoji izraz sa njegovom vrednošću.',
    [['$\\sqrt{9}$', '3'], ['$(\\sqrt{7})^2$', '7'], ['$\\sqrt{50}$', '$5\\sqrt{2}$'], ['$\\sqrt{0,01}$', '0,1']],
    'Kvadriranje i koren se poništavaju za nenegativne brojeve. Pošto je $\\sqrt{50} = \\sqrt{25\\cdot 2}$, dobijamo $5\\sqrt{2}$.', 'koren');

  // ── 8. funkcija direktne proporcionalnosti ──
  L('Funkcija direktne proporcionalnosti');
  Q(1, 'Koji je koeficijent proporcionalnosti u funkciji $y = 3x$?',
    ['3', '$x$', '$\\frac{1}{3}$', '$-3$'],
    'Koeficijent $k$ je broj uz $x$ u obliku $y = k\\cdot x$. Ovde je $k = 3$.', 'koeficijent');
  Q(1, 'Koja tačka sa crteža pripada grafiku funkcije $y = 2x$?',
    ['Tačka A', 'Tačka B', 'Tačka C', 'Tačka D'],
    'Tačka $A(1, 2)$: za $x = 1$ dobijamo $y = 2\\cdot 1 = 2$. Ostale tačke ne zadovoljavaju $y = 2x$.', 'grafik',
    { mediji: ravan([-1, 4, -1, 6], { tacke: [['A', 1, 2], ['B', 2, 5], ['C', 3, 5], ['D', 0, 1]] }) });
  Q(1, 'Koliko je $y$ za $x = 4$, ako je $y = 2x$?',
    ['8', '6', '2', '4'],
    'Zamenimo: $y = 2\\cdot 4 = 8$. Zbir $2 + 4 = 6$ nije vrednost funkcije.', 'grafik',
    { medijiOdgovora: ravan([0, 5, 0, 9], { tacke: [['T', 4, 8]], elementi: [{ lin: [[0, 0], [4.5, 9]], b: 1, debljina: 3 }], velicina: 280 }) });
  Q(2, 'Prava $y = kx$ prolazi kroz tačku $(2, 6)$. Koliki je koeficijent $k$?',
    ['3', '12', '$\\frac{1}{3}$', '4'],
    'Zamenimo $x = 2$ i $y = 6$: $6 = k\\cdot 2$, pa je $k = 3$.', 'koeficijent',
    { mediji: ravan([0, 4, 0, 8], { tacke: [['T', 2, 6]] }),
      medijiOdgovora: ravan([0, 4, 0, 8], { tacke: [['T', 2, 6]], elementi: [{ lin: [[0, 0], [2.7, 8.1]], b: 1, debljina: 3 }] }) });
  Q(2, 'Prave $p$ i $q$ prolaze kroz koordinatni početak. Koja ima veći koeficijent $k$?',
    ['Prava $p$', 'Prava $q$', 'Jednaki su', 'Ne može se zaključiti'],
    'Strmija prava se za isti korak udesno više diže, pa ima veći koeficijent. Prava $p$ je $y = 3x$, a prava $q$ je $y = \\frac{1}{2}x$.', 'nagib',
    { mediji: ravan([0, 5, 0, 5], { elementi: [{ lin: [[0, 0], [1.5, 4.5]], b: 1, debljina: 3 }, { tx: 'p', at: [1.75, 4.8], vel: 18, b: 1 }, { lin: [[0, 0], [4.5, 2.25]], b: 2, debljina: 3 }, { tx: 'q', at: [4.7, 2.5], vel: 18, b: 2 }] }) });
  Q(2, 'Kolika je stranica kvadrata $x$ kad je njegov obim $y = 4x$ jednak 7?',
    ['1,75', '2,8', '7', '1,4'],
    'Iz $y = 4x$ sledi $x = \\frac{y}{4} = \\frac{7}{4} = 1,75$. Obim je uvek 4 puta veći od stranice.', 'obim',
    { mediji: ravan([0, 2.5, 0, 8.5], { podela: [0.5, 1], elementi: [{ lin: [[0, 0], [2.1, 8.4]], b: 1, debljina: 3 }] }),
      medijiOdgovora: ravan([0, 2.5, 0, 8.5], { podela: [0.5, 1], elementi: [{ lin: [[0, 0], [2.1, 8.4]], b: 1, debljina: 3 }, { lin: [[0, 7], [1.75, 7], [1.75, 0]], b: 2, isp: 1 }, { tacka: 'T', b: 2 }] }) });
  Q(3, 'Mama je na računu imala 0 dinara. Svaka čokolada koju kupi sinu košta 100 dinara, pa je stanje $y = -100x$. Koliko je stanje posle tri čokolade?',
    ['−300 din.', '300 din.', '−103 din.', '−30 din.'],
    'Zamenimo $x = 3$: $y = -100\\cdot 3 = -300$. Minus znači dug na računu.', 'koeficijent');
  Q(2, 'Kako izgleda grafik funkcije $y = -2x$?',
    ['Opadajuća prava kroz koordinatni početak', 'Rastuća prava kroz koordinatni početak', 'Prava paralelna sa x-osom', 'Prava koja ne prolazi kroz koordinatni početak'],
    'Za $k = -2 < 0$ prava se spušta: što je $x$ veće, $y$ je manje. Prolazi kroz $(0, 0)$ jer je $y = 0$ za $x = 0$.', 'nagib',
    { medijiOdgovora: ravan([-2, 3, -3, 3], { tacke: [['A', -1, 2], ['B', 1, -2]], elementi: [{ lin: [[-1.5, 3], [1.5, -3]], b: 1, debljina: 3 }] }) });
  Q(2, 'Za koje $k$ je funkcija $y = kx$ rastuća (kad $x$ raste, i $y$ raste)?',
    ['$k > 0$', '$k < 0$', '$k = 0$', '$k = -1$'],
    'Za pozitivan koeficijent prava ide uz brdo udesno. Za negativan ide nadole.', 'koeficijent', { medijiOdgovora: ravan([-3, 3, -3, 3], { elementi: [{ lin: [[-2, -2], [2, 2]], b: 1, debljina: 3 }, { tx: 'k > 0', at: [2, 2.4], vel: 16, b: 1 }, { lin: [[-2, 2], [2, -2]], b: 2, debljina: 3 }, { tx: 'k < 0', at: [-2, 2.4], vel: 16, b: 2 }] }) });
  Q(3, 'Zašto koeficijent $k$ u $y = kx$ ne sme biti jednak nuli?',
    ['Jer bi za svako $x$ bilo $y = 0$, pa veličine ne bi bile proporcionalne', 'Jer se ne može množiti nulom', 'Jer nula nije broj', 'Jer grafik bi tada bio kružnica'],
    'Kad bi $k = 0$, za svako $x$ dobili bismo $y = 0$. To je samo osa, bez proporcionalne zavisnosti, pa se to isključuje.', 'koeficijent',
    { medijiOdgovora: ravan([-1, 4, -1, 2], { elementi: [{ lin: [[-1, 0], [4, 0]], b: 1, debljina: 3 }, { tx: 'y = 0', at: [2, 0.4], vel: 16 }] }) });
  Q(1, 'Koliko je $y$ za $x = 1,5$ ako je $y = 2x$?',
    ['3', '2', '1,5', '4'],
    'Zamenimo: $y = 2\\cdot 1,5 = 3$.', 'grafik');
  Q(3, 'Put je nagiba 100 % (kao na slici). Pod kojim uglom ide prema horizontali?',
    ['45°', '100°', '30°', '60°'],
    'Nagib 100 % znači da se na svakih 1 m horizontalno popnemo za 1 m visine. Tada su katete jednake, pa je ugao kod osnove $45°$.', 'nagib',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [4, 4] }, [{ p: 'ABC', b: 1, gusto: 1 }, { pu: 'ABC' }, { d: 'AB', o: '1 m' }, { d: 'BC', o: '1 m' }], { bezImena: ['A', 'B', 'C'], velicina: 240 }),
      medijiOdgovora: G({ A: [0, 0], B: [4, 0], C: [4, 4] }, [{ p: 'ABC', b: 1, gusto: 1 }, { pu: 'ABC' }, { u: 'BAC', o: '45°' }, { d: 'AB', o: '1 m' }, { d: 'BC', o: '1 m' }], { bezImena: ['A', 'B', 'C'], velicina: 240 }) });
  Q(2, 'Nagib puta je 3 %. Koliki je koeficijent $k$ u tom slučaju?',
    ['0,03', '3', '0,3', '30'],
    'Procenat delimo sa 100: $3\\% = \\frac{3}{100} = 0,03$.', 'nagib');
  Q(2, 'Ako je $y = 3x$ i $x = -2$, koliko je $y$?',
    ['−6', '6', '−5', '−1'],
    'Zamenimo: $y = 3\\cdot(-2) = -6$.', 'koeficijent', { medijiOdgovora: ravan([-3, 1, -7, 1], { tacke: [['T', -2, -6]], elementi: [{ lin: [[-2.4, -7.2], [0.5, 1.5]], b: 1, debljina: 3 }] }) });
  Q(2, 'Kolika je vrednost $x$ kad je $y = 6$, a funkcija je $y = 2x$?',
    ['3', '12', '4', '8'],
    'Iz $6 = 2x$ sledi $x = 3$.', 'koeficijent');
  U(3, 'Koja od ovih funkcija NIJE direktne proporcionalnosti?',
    ['$y = 1 + x$', '$y = -x$', '$y = 3x$', '$y = \\frac{x}{2}$'],
    'Funkcija direktne proporcionalnosti ima oblik $y = k\\cdot x$, pa prolazi kroz koordinatni početak. Kod $y = 1 + x$ je za $x = 0$ vrednost $y = 1$.', 'Grafik svake funkcije direktne proporcionalnosti je prava kroz koordinatni početak. Ovde je $y=1+x$ pomeren za jedan gore.', 'proporcija');
  S(2, 'Spoji funkciju sa koeficijentom $k$.',
    [['$y = 2x$', 'k = 2'], ['$y = -x$', 'k = −1'], ['$y = \\frac{x}{3}$', 'k = $\\frac{1}{3}$'], ['$y = -0,5x$', 'k = −0,5']],
    'Koeficijent je broj uz $x$. Kod $y = \\frac{x}{3}$ je $k = \\frac{1}{3}$, jer je $\\frac{x}{3} = \\frac{1}{3}\\cdot x$.', 'koeficijent');

  // ── 9. produžena proporcija ──
  L('Produžena proporcija');
  Q(1, 'Koliki je odnos broja $a$ i broja $b$ ako je $a = 2$ i $b = 6$?',
    ['1 : 3', '3 : 1', '2 : 4', '1 : 2'],
    'Odnos $2 : 6$ skraćujemo sa 2: dobijamo $1 : 3$.', 'razmera', { medijiOdgovora: trakaDelova([1, 3], { natpisi: ['a = 2', 'b = 6'], iznad: 'a : b = 1 : 3', velicina: 340 }) });
  Q(1, 'Krug je podeljen u odnosu $1 : 2 : 3$. Koliki je ugao najvećeg dela?',
    ['180°', '120°', '90°', '60°'],
    'Ukupno je $1 + 2 + 3 = 6$ delova. Najveći deo ima 3 dela: $\\frac{3}{6}\\cdot 360° = 180°$.', 'razmera',
    { mediji: kruzni([['a', 1], ['b', 2], ['c', 3]], { natpisi: false }) });
  Q(1, 'Zbir uglova trougla je $180°$, a uglovi su u odnosu $1 : 2 : 3$. Koliki je najveći ugao?',
    ['90°', '60°', '120°', '180°'],
    'Ukupno je $6$ delova, pa je jedan deo $180° : 6 = 30°$. Najveći ugao ima 3 dela: $3\\cdot 30° = 90°$.', 'trougao');
  Q(2, 'Iznos od 120 treba podeliti u odnosu $1 : 2 : 3$. Koliki je najveći deo?',
    ['60', '20', '40', '120'],
    'Ukupno je $1 + 2 + 3 = 6$ delova, pa je jedan deo $120 : 6 = 20$. Najveći deo ima 3 dela: $3\\cdot 20 = 60$.', 'delovi',
    { mediji: trakaDelova([1, 2, 3], { iznad: '120', velicina: 340 }) });
  Q(1, 'Ako je $a : b = 2 : 3$ i $b : c = 3 : 5$, koliki je odnos $a : c$?',
    ['2 : 5', '2 : 3', '5 : 2', '3 : 5'],
    'Produžena proporcija je $a : b : c = 2 : 3 : 5$, pa je $a : c = 2 : 5$.', 'produžena');
  Q(2, 'Ako je $a : b : c = 2 : 3 : 5$ i $b = 9$, koliko je $a$?',
    ['6', '4', '15', '3'],
    'Jedan deo je $9 : 3 = 3$, pa je $a = 2\\cdot 3 = 6$.', 'produžena',
    { mediji: trakaDelova([2, 3, 5], { natpisi: ['a', 'b', 'c'], iznad: 'b = 9', velicina: 340 }) });
  Q(2, 'Ako je $a : b : c = 1 : 2 : 3$ i $b = 10$, koliko je $c$?',
    ['15', '5', '20', '30'],
    'Jedan deo je $10 : 2 = 5$, pa je $c = 3\\cdot 5 = 15$.', 'produžena',
    { medijiOdgovora: trakaDelova([1, 2, 3], { natpisi: ['a', 'b', 'c'], iznad: 'b = 10', velicina: 340 }) });
  Q(2, 'Pravougaonik ima odnos stranica $a : b = 1 : 4$ i obim 50 cm. Kolika je stranica $a$?',
    ['5 cm', '10 cm', '4 cm', '12,5 cm'],
    'Polovina obima je $a + b = 25$ cm. Iz $b = 4a$ sledi $5a = 25$, pa je $a = 5$ cm, a $b = 20$ cm.', 'obim',
    { mediji: pravougaonik(4, 1, { donja: 'b', leva: 'a', gore: 'O = 50 cm', velicina: 300 }) });
  Q(2, 'Ako je $x : y = 2 : 5$ i $y : z = 5 : 7$, koliko je $x : z$?',
    ['2 : 7', '7 : 2', '2 : 5', '5 : 7'],
    'Produžena proporcija je $x : y : z = 2 : 5 : 7$, pa je $x : z = 2 : 7$.', 'produžena');
  Q(2, 'Koji je zapis produžene proporcije za $a : b = 2 : 3$ i $b : c = 3 : 4$?',
    ['$a : b : c = 2 : 3 : 4$', '$a : b : c = 2 : 4 : 3$', '$a : b : c = 3 : 2 : 4$', '$a : b : c = 4 : 3 : 2$'],
    'Broj $b$ je u obe proporcije $3$, pa ga poklapamo: $a : b : c = 2 : 3 : 4$.', 'produžena');
  Q(3, 'Ako je $a : b = 2 : 3$ i $a : c = 1 : 4$, koliki je odnos $b : c$?',
    ['3 : 8', '2 : 8', '3 : 4', '8 : 3'],
    'Ako je $a = 2$, onda je $b = 3$, a $c = 4a = 8$. Zato je $b : c = 3 : 8$.', 'produžena',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$a : b : c = 2 : 3 : 8$' } });
  Q(3, 'Krug je podeljen na tri dela srazmerna $7 : 3 : 6$ (kao na slici). Koliki je ugao dela $c$?',
    ['135°', '157,5°', '67,5°', '90°'],
    'Ukupno je $7 + 3 + 6 = 16$ delova, pa je jedan deo $360° : 16 = 22,5°$. Deo $c$ ima 6 delova: $6\\cdot 22,5° = 135°$.', 'razmera',
    { mediji: kruzni([['a', 7], ['b', 3], ['c', 6]]) });
  Q(1, 'Ako je $a : b = 3 : 4$ i $a = 9$, koliko je $b$?',
    ['12', '3', '36', '15'],
    'Iz $9 : b = 3 : 4$ sledi $b = 9\\cdot\\frac{4}{3} = 12$.', 'razmera');
  Q(2, 'Deca dele 10 000 dinara u odnosu $2 : 3$. Koliko dobija prvo dete?',
    ['4000', '6000', '5000', '2000'],
    'Ukupno je $2 + 3 = 5$ delova, pa je jedan deo $10\\,000 : 5 = 2000$ dinara. Prvo dete dobija $2\\cdot 2000 = 4000$ dinara.', 'delovi',
    { mediji: trakaDelova([2, 3], { natpisi: ['2', '3'], iznad: '10 000 din.', velicina: 340 }) });
  Q(1, 'Odnos broja učenika dva odeljenja je $20 : 30$. Koji je to odnos u najprostijem obliku?',
    ['2 : 3', '3 : 2', '1 : 2', '2 : 5'],
    'Deljenjem oba broja sa 10 dobijamo $2 : 3$.', 'razmera', { medijiOdgovora: trakaDelova([2, 3], { natpisi: ['20 učenika', '30 učenika'], iznad: '20 : 30 = 2 : 3', velicina: 340 }) });
  Q(3, 'Koja je tačna jednakost za proporciju $a : b = c : d$?',
    ['$a\\cdot d = b\\cdot c$', '$a\\cdot b = c\\cdot d$', '$a\\cdot c = b\\cdot d$', '$a + d = b + c$'],
    'Spoljašnji članovi su $a$ i $d$, a unutrašnji $b$ i $c$. Proizvod spoljašnjih jednak je proizvodu unutrašnjih.', 'spoljašnji');
  S(1, 'Spoji odnos sa njemu jednakim odnosom.',
    [['2 : 3', '6 : 9'], ['3 : 4', '9 : 12'], ['5 : 2', '15 : 6'], ['1 : 4', '3 : 12']],
    'Odnos se ne menja kad i oba broja pomnožimo istim brojem: $2 : 3 = 6 : 9$.', 'razmera');
  U(2, 'Koja od ovih proporcija NIJE tačna za $a : b : c = 1 : 2 : 3$?',
    ['$a : b = 1 : 3$', '$a : c = 1 : 3$', '$b : c = 2 : 3$', '$a : b = 1 : 2$'],
    'Iz $a : b : c = 1 : 2 : 3$ sledi $a : b = 1 : 2$, a ne $1 : 3$. Odnosi $a : c = 1 : 3$ i $b : c = 2 : 3$ su tačni.', 'Iz jedne produžene proporcije mogu se pročitati svi parovi odnosa: $a : b$, $b : c$ i $a : c$.', 'produžena');

  // ── dopuna: crteži uz PITANJE (da ne odaju odgovor) i po jedna neočigledna činjenica u zanimljivosti ──
  const nadji = (kljuc) => {
    const p = pitanja.slice(prvo).filter((x) => x.pitanje.includes(kljuc));
    if (p.length !== 1) throw new Error(`pitanje „${kljuc}“ se pojavljuje ${p.length} puta`);
    return p[0];
  };
  const uzPitanje = (kljuc, crtez) => { nadji(kljuc).mediji = crtez; };
  const cinjenica = (kljuc, tekst) => { const p = nadji(kljuc); p.zanimljivost = `${p.zanimljivost} ${tekst}`; };

  // 6. približna vrednost: tačka na brojevnoj pravoj, „lupa“ na deo između dva cela ili dve decimale
  uzPitanje('Kako se zove razlika između tačnog', brojevna(2.3, 2.4, [[2.37, '2,37']], { podela: 0.01, svaki: 10 }));
  uzPitanje('Zaokruži broj $3,58$', brojevna(3.5, 3.6, [[3.58, '3,58']], { podela: 0.01, svaki: 10 }));
  uzPitanje('$√{2}$ približno', brojevna(1, 2, [[Math.SQRT2, '√2']], { podela: 0.1, svaki: 1 }));
  uzPitanje('Koliko je apsolutna greška kad broj', brojevna(0.9, 1, [[0.96, '0,96']], { podela: 0.01, svaki: 10 }));
  uzPitanje('Po pravilima iz udžbenika', brojevna(8.4, 8.5, [[8.45, '8,45']], { podela: 0.01, svaki: 10 }));
  uzPitanje('Koliko je ${2|7}$', brojevna(0.2, 0.3, [[2 / 7, '2/7']], { podela: 0.01, svaki: 10 }));
  // 7. koreni: pravougaonici i kvadrati sa stranicama-korenima
  uzPitanje('Koji broj je recipročan', brojevna(0, 2, [[Math.SQRT2, '√2']], { podela: 0.5, svaki: 1 }));
  uzPitanje('(√{5})^2', pravougaonik(2.236, 2.236, { gore: '√5', desna: '√5', velicina: 200 }));
  uzPitanje('√{7}·√{28}', pravougaonik(5.292, 2.646, { donja: '√28', desna: '√7' }));
  uzPitanje('√{0,25}', pravougaonik(0.5, 0.5, { gore: '√0,25', velicina: 200 }));
  // 8. proporcionalnost: grafik y = kx, tačke, nagib, račun na mreži
  uzPitanje('za $x = 4$', ravan([0, 5, 0, 9], { elementi: [{ lin: [[0, 0], [4.5, 9]], b: 1, debljina: 3 }] }));
  uzPitanje('za $x = 1,5$', ravan([0, 2.5, 0, 5], { elementi: [{ lin: [[0, 0], [2.25, 4.5]], b: 1, debljina: 3 }] }));
  uzPitanje('Ako je $y = 3x$ i', ravan([-3, 1, -7, 1], { elementi: [{ lin: [[-2.4, -7.2], [0.5, 1.5]], b: 1, debljina: 3 }] }));
  uzPitanje('Mama je na računu', ravan([0, 4, -400, 0], { podela: [1, 100], elementi: [{ lin: [[0, 0], [4, -400]], b: 1, debljina: 3 }] }));
  // 9. produžena proporcija: trake podeljene u razmeri
  uzPitanje('Ako je $a : b : c = 1 : 2 : 3$ i $b = 10$', trakaDelova([1, 2, 3], { natpisi: ['a', 'b', 'c'], iznad: 'b = 10', velicina: 340 }));
  uzPitanje('Ako je $a : b = 3 : 4$ i $a = 9$', trakaDelova([3, 4], { natpisi: ['a = 9', 'b'], velicina: 340 }));
  uzPitanje('Odnos broja učenika dva odeljenja', trakaDelova([2, 3], { natpisi: ['20 učenika', '30 učenika'], velicina: 340 }));

  // zanimljivosti: pitanja čija je zanimljivost bila samo ponovljeno objašnjenje dobijaju činjenicu
  cinjenica('Kako se zove razlika', 'Inženjeri uz svaki rezultat pišu i procenu greške, da bi znali koliko mu se može verovati.');
  cinjenica('Koji ceo broj je bliži tački', 'Tačka tačno na polovini između dva cela broja (npr. 4,5) jednako je daleko od oba, pa tu zaokruživanje nema pobednika.');
  cinjenica('Zaokruži broj $3,58$', 'Računari zapisuju decimalne brojeve u binarnom obliku, pa ni 0,1 nema tačan zapis; zato se greške zaokruživanja u dugim računima gomilaju.');
  cinjenica('vrednost broja ${1|6}', 'Razlomak ima konačan decimalni zapis samo ako imenilac posle skraćivanja ima činioce samo 2 i 5.');
  cinjenica('$√{2}$ približno', 'Stari Grci su dokazali da √2 nije razlomak, što je bilo šokantno, jer su verovali da se svi brojevi mogu zapisati razlomkom.');
  cinjenica('Koliko je apsolutna greška kad broj', 'Pri zaokruživanju na jednu decimalu greška nikad nije veća od 0,05.');
  cinjenica('$√{5}$ približno', 'Koren se može izračunati i bez kalkulatora: kvadriranjem sredine intervala proveravamo na koju stranu je tačna vrednost.');
  cinjenica('Koja tvrdnja je tačna za broj', 'Broj √5 nema konačan ni periodičan decimalni zapis, pa je iracionalan.');
  cinjenica('Po pravilima iz udžbenika', 'Ovakvo zaokruživanje zove se zaokruživanje na parnu cifru: tako se greške ne bi sabirale samo u jednom smeru.');
  cinjenica('Broj $1,2998$', 'Pri merenju i novcu piše se samo onoliko decimala koliko je pouzdano, a ne sve što kalkulator pokaže.');
  cinjenica('Broj $45,58978$', 'Odlučuje samo prva odbačena cifra, osim kad je tačno 5 bez ostalih cifara – tada važe pravila iz udžbenika.');
  cinjenica('Koliko je ${2|7}$', 'Razlomak 1/7 ima decimalni zapis 0,142857142857…, sa periodom od šest cifara.');
  cinjenica('Koliko je $0,0378$', 'Greška sa mestom decimale (0,4 umesto 0,04) najčešća je pri zaokruživanju, zato se mesta prebrajaju od zareza.');
  cinjenica('Koji je ceo broj najbliži', 'Zbir √2 + √3 ne može se zapisati jednostavnije, zato se njegova tačna vrednost čuva kao zbir.');
  cinjenica('Koji broj je suprotan broju', 'U jednačinama „prebacivanje na drugu stranu“ zapravo znači dodavanje suprotnog broja.');
  cinjenica('Koji broj je recipročan', 'Recipročan broj je važan i u fizici: brzina i vreme su obrnuto srazmerni pri stalnoj dužini puta.');
  cinjenica('Kolika je površina kvadrata čija', 'Odnos stranica papira A4 je √2: kad se list prepolovi, ostaje isti oblik.');
  cinjenica('Kolika je površina pravougaonika sa stranicama', 'Površina pravougaonika sa stranicama korenima je koren iz proizvoda, zato su kvadratni koreni tako korisni u geometriji.');
  cinjenica('Dva kvadrata imaju', 'Pitagorina teorema kaže da je kvadrat nad hipotenuzom zbir kvadrata nad katetama – ovde 4 + 9 = 13.');
  cinjenica('(√{5})^2', 'Kvadriranje i korenovanje su inverzne operacije, kao množenje i deljenje.');
  cinjenica('√{7}·√{28}', 'Proizvod 7 i 28 je 196 = 14 · 14, pa se rezultat lako prepozna kad se broj rastavi na činioce.');
  cinjenica('Izvuci što više', 'Trik: iz broja izvlačimo najveći kvadrat (16 iz 48), tako da ostatak pod korenom bude najmanji.');
  cinjenica('√{2}+√{8}', 'Koreni se sabiraju samo kad su istog „sastava“, zato se sve prvo svodi na isti broj pod korenom.');
  cinjenica('Racionalizuj', 'Pre kalkulatora deljenje sa iracionalnim brojem bilo je mukotrpno, pa se imenilac racionalisao da račun bude lakši.');
  cinjenica('Zbir kojih dvaju brojeva', 'I proizvod iracionalnih brojeva može biti racionalan: $√{2}·√{2} = 2$.');
  cinjenica('√{0,25}', 'Koren iz 0,0001 je 0,01: kad se broj pod korenom smanji 100 puta, koren se smanji 10 puta.');
  cinjenica('Pravougaonik ima stranice', 'Broj $√{6}$ je geometrijska sredina brojeva 2 i 3, jer je $√{2·3}$.');
  cinjenica('Da li je $√{2}-√{3}', 'Negativan broj pod kvadratnim korenom nema rešenja među realnim brojevima; u višim razredima uvode se kompleksni brojevi.');
  cinjenica('Koji je koeficijent proporcionalnosti', 'U fizici je koeficijent proporcionalnosti često stalna veličina, npr. sila i ubrzanje za istu masu.');
  cinjenica('Koja tačka sa crteža', 'Grafik y = 2x prolazi kroz koordinatni početak: za svaku tačku y je dvostruko veće od x.');
  cinjenica('za $x = 4$', 'Pri stalnoj brzini put je proporcionalan vremenu, to je najčešći primer proporcionalnosti u životu.');
  cinjenica('Prava $y = kx$ prolazi kroz', 'Količnik y/x je za sve tačke jedne prave isti, pa se proporcionalnost prepoznaje i iz tabele.');
  cinjenica('Prave $p$ i $q$', 'Koeficijent k je tangens ugla koji prava zaklapa sa x-osom (to se uči u srednjoj školi).');
  cinjenica('stranica kvadrata $x$ kad je njegov obim', 'Obim kvadrata je uvek 4 puta veći od stranice, pa je grafik ove veze uvek prava sa k = 4.');
  cinjenica('Mama je na računu', 'Stanje koje se menja po jednom pravilu je primer linearne funkcije; sve direktne proporcionalnosti prolaze kroz (0, 0).');
  cinjenica('Kako izgleda grafik funkcije', 'Nizbrdica je primer negativnog nagiba: što se dalje ide, to je niže.');
  cinjenica('Za koje $k$ je funkcija', 'Prava kroz koordinatni početak deli ravan na dva dela; znak k određuje u kom smeru prava ide.');
  cinjenica('Zašto koeficijent', 'Kad je k = 0, grafik je x-osa, jedina proporcionalna prava koja se ne penje ni ne spušta.');
  cinjenica('za $x = 1,5$', 'Dve tačke određuju pravu, pa se grafik proporcionalnosti može nacrtati iz samo dve tačke, npr. (0, 0) i (1, k).');
  cinjenica('Put je nagiba 100', 'Nagib u procentima i ugao u stepenima su različite mere: 100 % je 45°, a ne 100°.');
  cinjenica('Nagib puta je 3', 'Nagib se na putnim znacima obično piše u procentima, kao na slici u udžbeniku.');
  cinjenica('Ako je $y = 3x$ i', 'Kod proporcionalnosti negativno x daje negativno y, pa prava prolazi kroz treći kvadrant.');
  cinjenica('Koliki je odnos broja', 'Odnosi se mogu skraćivati kao razlomci: 2 : 6 i 1 : 3 su isti odnos zapisan drugačije.');
  cinjenica('Krug je podeljen u odnosu', 'Na satu minutna kazaljka ide 12 puta brže od časovne, pa je i to odnos.');
  cinjenica('Zbir uglova trougla', 'Trougao sa uglovima 30°, 60° i 90° je polovina jednakostraničnog trougla.');
  cinjenica('Iznos od 120', 'Deljenje dobiti u razmeri koristi se i danas pri podeli dobiti u firmama između partnera.');
  cinjenica('Ako je $a : b = 2 : 3$ i $b : c = 3 : 5$', 'Isti postupak se koristi u kartografiji kad se mape u različitim razmerama spajaju.');
  cinjenica('Ako je $a : b : c = 2 : 3 : 5$ i', 'Odnos 2 : 3 je i odnos stranica fotografije 10 × 15 cm.');
  cinjenica('Ako je $a : b : c = 1 : 2 : 3$ i', 'U muzici je odnos frekvencija 3 : 2 osnova čiste kvinte.');
  cinjenica('Pravougaonik ima odnos', 'Ako se dužina poveća 4 puta, obim se ne poveća 4 puta, jer je obim zbir stranica.');
  cinjenica('Ako je $x : y = 2 : 5$', 'Lančano spajanje razmera radi kao prenos u zupčanicima: od jednog do drugog.');
  cinjenica('Koji je zapis produžene proporcije', 'Recepti su često pisani kao produžena proporcija, npr. 1 : 2 : 3 za tri sastojka.');
  cinjenica('Ako je $a : b = 2 : 3$ i $a : c', 'Isti postupak koristi se u kartografiji kad se mape u različitim razmerama spajaju.');
  cinjenica('Krug je podeljen na tri dela', 'Sat ima 12 podela, pa je svaki deo 30°; podela kruga na 16 delova je ista ideja.');
  cinjenica('Ako je $a : b = 3 : 4$', 'Odnos 4 : 3 je odnos stranica starih televizora.');
  cinjenica('Deca dele 10 000', 'Ista metoda koristi se za raspodelu dobiti između partnera u firmi.');
  cinjenica('Odnos broja učenika', 'Najprostiji oblik dobija se deljenjem sa najvećim zajedničkim deliocem (ovde 10).');
  cinjenica('Koja je tačna jednakost za proporciju', 'Isto pravilo služi za jednačine: x : 3 = 4 : 6 daje x = 2.');

};
