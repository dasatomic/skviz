// Lekcije 18–20: stepenovanje prirodnim brojem, operacije sa stepenima, stepenovanje dekadne jedinice.
module.exports = ({ L, Q, U, S, G, r, sto, kocke, stubici, skok, O, bez, proveri }) => {

  // provera računa (gradnja pukne ako neka tvrdnja nije tačna)
  proveri(2 ** 10 === 1024, '2^10');
  proveri(3 ** 4 + 3 ** 5 === 4 * 3 ** 4, '3^4 + 3^5 = 4 · 3^4');
  proveri(Math.abs(2 ** 64 / 1e19 - 1.8447) < 0.001, '2^64 ≈ 1,8 · 10^19');
  proveri(Math.abs(2 ** 63 / 1e18 - 9.22) < 0.01, '2^63 ≈ 9,2 · 10^18');
  proveri(Math.floor(Math.log10(2 ** 100)) + 1 === 31, '2^100 ima 31 cifru');
  proveri(Math.floor(Math.log10(3 ** 60)) + 1 === 29, '3^60 ima 29 cifara');
  proveri(Math.abs(Math.log10(3 ** 60) - 28.63) < 0.01 && Math.abs(Math.log10(2 ** 100) - 30.1) < 0.01, 'log 3^60 i 2^100');
  proveri(2 ** 100 > 3 ** 60 && 6 ** 30 < 3 ** 60, 'poređenje 2^100, 3^60, 6^30');
  proveri(2 ** 30 > 1e9, '2^30 > milijarde');
  proveri(Math.abs((2 / 3) ** 2 - 4 / 9) < 1e-12, '(2/3)^2 = 4/9');
  proveri(1 / 2 ** 10 < 0.001, '(1/2)^10 < 1/1000');
  proveri(Math.abs(5 ** 3 - 125) === 0 && Math.abs(2 ** 3 * 2 ** 2 - 2 ** 5) === 0, '2^3·2^2 = 2^5');
  proveri(2 ** 2 ** 3 === 256 && (2 ** 2) ** 3 === 64, '2^(2^3) = 256, (2^2)^3 = 64');
  proveri((-2) ** 3 * 3 ** 3 === -216 && (-2 * 3) ** 3 === -216, '(−2)^3·3^3 = (−6)^3');
  proveri(10 ** 5 * 10 ** -3 > 99.9999 && 10 ** 5 * 10 ** -3 < 100.0001, '10^5 · 10^-3 = 100');
  proveri(Math.abs(1e7 * 1e-10 - 1e-3) < 1e-12 && Math.abs(1e-3 / 1e-10 - 1e7) < 1, 'atom / milimetar = 10^7');
  proveri(1000 / 0.01 === 1e5, '1 km / 1 cm = 10^5');
  proveri(Math.abs(6371 * 1000 - 6.371e6) < 1e-3 && Math.abs(696000 * 1000 - 6.96e8) < 1e-3, 'poluprečnici u metrima');
  proveri(Math.abs(Math.pow(696000 / 6371, 3) / 1e6 - 1.3) < 0.05, 'Sunce ≈ 1,3 miliona Zemalja');
  proveri(Math.abs(0.0000052 - 5.2e-6) < 1e-12 && Math.abs(0.000052 - 5.2e-5) < 1e-12, 'naučni zapisi malih brojeva');
  proveri(8562 === 8.562 * 10 ** 3 && 2.5 * 10 ** 3 === 2500, 'naučni zapis, 2,5 · 10^3');

  // ── pomoćni crteži (medij „geo“) ──
  // mreža w×h jediničnih kvadratića; ob(i, j) vraća boju kvadratića ili null (prazan)
  const mreza = (w, h, { ob = () => 1, x0 = 0, y0 = 0 } = {}) => {
    const e = [];
    for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) {
      const c = ob(i, j), x = x0 + i, y = y0 + j;
      const p = [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]];
      e.push(c == null ? { lin: p, zatv: 1, b: 4, prazno: 1 } : { lin: p, zatv: 1, b: c, gusto: 1 });
    }
    return e;
  };
  // red kvadratića sa oznakom u svakom; boje[i] (null = prazan), donji[i] = tekst ispod, natpis = tekst ispod celog reda
  const niz = (oznake, { boje = [], donji = [], natpis = '' } = {}) => {
    const e = [];
    oznake.forEach((t, i) => {
      const c = boje[i] === undefined ? 1 : boje[i], x = i;
      const p = [[x, 0], [x + 1, 0], [x + 1, 1], [x, 1]];
      e.push(c == null ? { lin: p, zatv: 1, b: 4, prazno: 1 } : { lin: p, zatv: 1, b: c, gusto: 1 });
      e.push({ tx: String(t), at: [x + 0.5, 0.35], vel: String(t).length > 2 ? 15 : 22 });
      if (donji[i] !== undefined) e.push({ tx: String(donji[i]), at: [x + 0.5, -0.6], vel: 18 });
    });
    if (natpis) e.push({ tx: natpis, at: [oznake.length / 2, -1.5], vel: 18 });
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 340 });
  };
  const kvadrat = (a) => G({ O: [0, 0] }, mreza(a, a), { bezImena: ['O'], velicina: 220 });
  // kvadrat stranice 4 sa oznakom uz stranicu (bez mreže – površinu tek treba izračunati)
  const kvadratOkvir = (oznaka) => G({ O: [0, 0] }, [
    { lin: [[0, 0], [4, 0], [4, 4], [0, 4]], zatv: 1, b: 1, prazno: 1 },
    { tx: oznaka, at: [2, -0.6], vel: 20 },
  ], { bezImena: ['O'], velicina: 200 });
  // kocka sa oznakom ivice
  const kockaOkvir = (oznaka) => {
    const g = kocke(1);
    g.e.push({ tx: oznaka, at: [0.65, -0.2], vel: 20 });
    return g;
  };
  // brojevna prava (ili prava eksponenata) sa tačkama [položaj, natpis, boja]
  const osa = (od, doo, tacke = [], { podela = 1, svaki = 1 } = {}) => {
    const t = {}, e = [{ osa: [od, doo], podela, svaki }];
    const imena = 'ABCDEFGH';
    tacke.forEach(([x, natpis, b = 1], i) => {
      t[imena[i]] = [x, 0];
      e.push({ tacka: imena[i], b }, { tx: natpis, at: [x, 1.4], vel: 18 });
    });
    return G(t, e, { bezImena: Object.keys(t), velicina: 340 });
  };
  // prava sa skokovima (eksponenti: + ide iznad, − ispod ose)
  const skokovi = (osaArgs, tacke, lukovi) => {
    const g = osa(...osaArgs, tacke);
    lukovi.forEach(([a, b, opts]) => g.e.push(skok(a, b, { ...(opts || {}), ispod: a > b })));
    return g;
  };

  // ── 18. stepenovanje prirodnim brojem ──
  L('Stepenovanje prirodnim brojem');
  Q(1, 'Šta znači zapis $a^{n}$ kad je $n$ prirodan broj?',
    ['Proizvod $n$ činilaca, a svaki je $a$', 'Zbir $n$ sabiraka, a svaki je $a$', 'Proizvod $a$ činilaca, a svaki je $n$', 'Zbir $a$ sabiraka, a svaki je $n$'],
    'Zapis $a^{n}$ je skraćeno $a \\cdot a \\cdot \\dots \\cdot a$ sa $n$ jednakih činilaca. Broj $a$ je osnova, a $n$ izložilac.', 'stepen',
    { medijiOdgovora: niz(['a', 'a', 'a', 'a', 'a'], { natpis: '~pet činilaca (broj 5 je ovde izložilac)' }) });
  Q(1, 'Kvadrat na slici ima stranicu 4 cm. Kolika mu je površina?',
    ['16 cm²', '8 cm²', '4 cm²', '12 cm²'],
    'Drugi stepen zovemo kvadrat, a treći kub – po kvadratu i kocki čija je stranica osnova.', 'kvadrat',
    { mediji: kvadratOkvir('4 cm'), medijiOdgovora: kvadrat(4) });
  Q(1, 'Ivica kocke je 3 cm. Kolika je njena zapremina u cm³?',
    ['27 cm³', '9 cm³', '6 cm³', '81 cm³'],
    'Kocka ivice 10 cm ima zapreminu 1000 cm³, a površinu samo 600 cm²: zapremina raste mnogo brže od površine.', 'kocka',
    { mediji: kockaOkvir('3 cm'), medijiOdgovora: kocke(3) });
  Q(2, 'Koja je vrednost izraza $-2^{4}$?',
    ['−16', '16', '−8', '−32'],
    'Minus ispred stepena odnosi se na ceo rezultat, a zagrada ga menja: zato je $-2^{4}$ različito od $(-2)^{4}$.', 'zagrada',
    { medijiOdgovora: osa(-20, 20, [[-16, '−2⁴'], [16, '(−2)⁴']], { podela: 4, svaki: 2 }) });
  Q(2, 'Koliko je $(-1)^{101}$?',
    ['−1', '1', '101', '0'],
    'Pravilo znaka: paran broj minusa daje plus, neparan minus. Zato znak proizvoda zavisi samo od broja negativnih činilaca.', 'znak',
    { mediji: niz(['(−1)¹', '(−1)²', '(−1)³', '(−1)⁴', '…'], { donji: ['−1', '1', '−1', '1', '?'] }),
      medijiOdgovora: niz(['(−1)¹', '(−1)²', '(−1)³', '(−1)⁴', '(−1)⁵'], { donji: ['−1', '1', '−1', '1', '−1'] }) });
  Q(3, 'Na šahovsku tablu stavljamo zrna pirinča: na prvo polje 1 zrno, na drugo 2, na treće 4 i tako dalje, uvek dvostruko više. Koliko zrna ide na sedmo polje?',
    ['64', '128', '49', '14'],
    'Na celoj tabli (64 polja) bi bilo $2^{64}-1$ zrna, oko $1,8 \\cdot 10^{19}$.', 'tabla',
    { mediji: niz(['1', '2', '4', '?']),
      medijiOdgovora: niz(['1', '2', '4', '8', '16', '32', '64'], { boje: [1, 1, 1, 1, 1, 1, 2] }) });
  Q(1, 'Koliko je $2^{10}$?',
    ['1024', '2048', '512', '1020'],
    'U računarstvu „kilo“ zato često znači 1024, a ne 1000: $2^{10}$ je skoro $10^{3}$.', 'bajt',
    { mediji: niz(Array(10).fill('2')),
      medijiOdgovora: niz(['2', '4', '8', '16', '32', '64', '128', '256', '512', '1024']) });
  Q(2, 'Svaki stubić na slici je dvostruko viši od prethodnog. Kolika je vrednost petog stubića?',
    ['32', '24', '20', '64'],
    'Rast koji se udvostručuje u svakom koraku zove se eksponencijalni: posle 30 udvostručavanja vrednost naraste više od milijarde puta.', 'rast',
    { mediji: (() => {
        const g = stubici([['1', 2], ['2', 4], ['3', 8], ['4', 16], ['5', 32]], { vrednosti: true, sirina: 10, maxY: 32, korakY: 8 });
        g.e = g.e.filter((e) => e.id !== 's4' && e.tx !== '32');
        g.e.push({ tx: '?', at: [9, 3], vel: 40 });
        return g;
      })(),
      medijiOdgovora: stubici([['1', 2], ['2', 4], ['3', 8], ['4', 16], ['5', 32]], { vrednosti: true, sirina: 10, maxY: 32, korakY: 8 }) });
  Q(3, 'Koji je najveći broj?',
    ['$2^{10}$', '$10^{3}$', '$3^{6}$', '$5^{4}$'],
    'Broj $2^{10}$ veći je od $10^{3}$ samo za 24, pa se u mnogim računima može zaokružiti na hiljadu.', 'hiljada',
    { medijiOdgovora: stubici([['2¹⁰', 1024], ['10³', 1000], ['3⁶', 729], ['5⁴', 625]], { vrednosti: true, sirina: 10, maxY: 1024, korakY: 256 }) });
  Q(3, 'Koja tvrdnja važi za svaki realan broj $a$?',
    ['$(-a)^{2} = a^{2}$', '$(-a)^{3} = a^{3}$', '$-a^{2} = (-a)^{2}$', '$(-a)^{4} = -a^{4}$'],
    'Nula je jedini broj koji je jednak svom suprotnom: $-a = a$ važi samo za $a = 0$.', 'suprotan',
    { mediji: osa(-4, 4, [[-3, '−a'], [3, 'a']]),
      medijiOdgovora: osa(-4, 4, [[-3, '(−3)² = 9'], [3, '3² = 9']]) });
  Q(3, 'Zbir $3^{4} + 3^{5}$ može se zapisati kao:',
    ['$4 \\cdot 3^{4}$', '$3^{9}$', '$6^{4}$', '$3^{8}$'],
    'Stepeni se ne sabiraju kao izložioci: $3^{4} + 3^{5}$ nije $3^{9}$, a to je čest dečji račun.', 'zbir',
    { medijiOdgovora: niz(['3⁴', '3⁴', '3⁴', '3⁴'], { natpis: '~3⁵ = 3 · 3⁴, pa je zbir 4 · 3⁴' }) });
  U(2, 'Koji izraz NIJE jednak broju 81?',
    ['$-3^{4}$', '$(-3)^{4}$', '$3^{4}$', '$9^{2}$'],
    '$-3^{4} = -81$, jer se minus odnosi na ceo $3^{4}$. Ostali izrazi jednaki su $81$.',
    'Zagrada menja rezultat: $(-3)^{4}$ i $-3^{4}$ razlikuju se samo po zagradi, a rezultati su $81$ i $-81$.', 'zagrada');
  Q(3, 'Koji je veći broj: $2^{100}$ ili $3^{60}$?',
    ['$2^{100}$', '$3^{60}$', 'Jednaki su', '$6^{30}$'],
    'Broj $2^{100}$ ima 31 cifru, a $3^{60}$ ima 29 cifara.', 'cifra',
    { medijiOdgovora: osa(28, 31, [[28.63, '3⁶⁰ ≈ 4,2 · 10²⁸'], [30.1, '2¹⁰⁰ ≈ 1,3 · 10³⁰']]) });
  Q(2, 'Stranica kvadrata se udvostruči (sa $a$ na $2a$). Koliko puta se poveća njegova površina?',
    ['4 puta', '2 puta', '8 puta', '3 puta'],
    'Ako se dužina poveća 10 puta, površina poraste 100 puta, a zapremina kocke 1000 puta.', 'površina',
    { mediji: G({ O: [0, 0] }, [
        { lin: [[0, 0], [2, 0], [2, 2], [0, 2]], zatv: 1, b: 1, prazno: 1 }, { tx: 'a', at: [1, -0.6], vel: 20 },
        { lin: [[3, 0], [7, 0], [7, 4], [3, 4]], zatv: 1, b: 2, prazno: 1 }, { tx: '2a', at: [5, -0.6], vel: 20 },
      ], { bezImena: ['O'], velicina: 300 }),
      medijiOdgovora: G({ O: [0, 0] }, [...mreza(2, 2, { ob: () => 2 }), ...mreza(4, 4, { x0: 5 })], { bezImena: ['O'], velicina: 300 }) });
  Q(3, 'Ivicu kocke udvostručimo. Koliko puta se poveća njena zapremina?',
    ['8 puta', '4 puta', '6 puta', '2 puta'],
    'Kad se ivica udvostruči, površina se poveća samo 4 puta, a zapremina 8 puta.', 'zapremina',
    { mediji: kockaOkvir('a'), medijiOdgovora: kocke(2) });
  S(2, 'Spoji izraz sa njegovom vrednošću',
    [['$(-2)^{4}$', '16'], ['$(-2)^{3}$', '−8'], ['$(-1)^{99}$', '−1'], ['$0^{5}$', '0']],
    'Nula na svakom prirodnom stepenu ostaje nula, a jedinica ostaje jedinica.', 'vrednost');

  // ── 19. operacije sa stepenima; stepen proizvoda i količnika ──
  L('Operacije sa stepenima; stepen proizvoda i količnika');
  Q(1, 'Koliko je $a^{3} \\cdot a^{4}$?',
    ['$a^{7}$', '$a^{12}$', '$a^{1}$', '$2a^{7}$'],
    'Pravilo važi i za promenljive: $x \\cdot x^{9} = x^{10}$, jer je $x = x^{1}$.', 'proizvod',
    { mediji: niz(['a', 'a', 'a', 'a', 'a', 'a', 'a'], { boje: [1, 1, 1, 2, 2, 2, 2] }),
      medijiOdgovora: niz(['a', 'a', 'a', 'a', 'a', 'a', 'a'], { boje: [1, 1, 1, 2, 2, 2, 2], natpis: '~tri i četiri činioca: ukupno sedam' }) });
  Q(1, 'Koliko je $2^{3} \\cdot 2^{2}$?',
    ['32', '64', '20', '16'],
    'Kad se osnove slažu, izložioci se sabiraju: $2^{3} \\cdot 2^{2} = 2^{5}$, a ne $2^{6}$.', 'izložilac',
    { mediji: niz(['2', '2', '2', '2', '2'], { boje: [1, 1, 1, 2, 2] }),
      medijiOdgovora: niz(['2', '2', '2', '2', '2'], { boje: [1, 1, 1, 2, 2], natpis: '2³ · 2² = 2⁵ = 32' }) });
  U(2, 'Koji izraz NIJE jednak $a^{5}$?',
    ['$a^{3} \\cdot a^{3}$', '$a^{2} \\cdot a^{3}$', '$a^{10} : a^{5}$', '$(a^{5})^{1}$'],
    '$a^{3} \\cdot a^{3} = a^{6}$, a ostali su redom $a^{5}$, $a^{5}$ i $a^{5}$.',
    'Pri množenju stepena iste osnove izložioci se sabiraju, a pri deljenju oduzimaju.', 'sabiranje');
  Q(2, 'Koliko je $(2^{3})^{2}$?',
    ['64', '32', '256', '36'],
    'Stepen stepena se računa tako što se izložioci množe: $(10^{2})^{3} = 10^{6}$, milion.', 'eksponent',
    { mediji: niz(['2', '2', '2', '2', '2', '2'], { boje: [1, 1, 1, 2, 2, 2] }),
      medijiOdgovora: niz(['2', '2', '2', '2', '2', '2'], { boje: [1, 1, 1, 2, 2, 2], natpis: '(2³)² = 2⁶ = 64' }) });
  Q(1, 'Koliko je $2^{5} : 2^{2}$?',
    ['8', '32', '4', '10'],
    'Pri deljenju stepena iste osnove izložioci se oduzimaju: $2^{5} : 2^{2} = 2^{5-2}$.', 'količnik',
    { mediji: niz(['2', '2', '2', '2', '2'], { boje: [2, 2, 1, 1, 1] }),
      medijiOdgovora: niz(['2', '2', '2', '2', '2'], { boje: [null, null, 1, 1, 1], natpis: '2⁵ : 2² = 2³ = 8' }) });
  Q(1, 'Koliko je $x^{10} : x$ za $x \\neq 0$?',
    ['$x^{9}$', '$x^{10}$', '$x^{5}$', '$x^{11}$'],
    'Deljenje sa $x$ je kao skraćivanje: od deset činilaca $x$ jedan „nestane“.', 'skraćivanje',
    { mediji: niz(Array(10).fill('x'), { boje: [2, 1, 1, 1, 1, 1, 1, 1, 1, 1] }),
      medijiOdgovora: niz(Array(10).fill('x'), { boje: [null, 1, 1, 1, 1, 1, 1, 1, 1, 1], natpis: 'x¹⁰ : x = x⁹' }) });
  Q(2, 'Koliko je $(2 \\cdot 5)^{3}$?',
    ['1000', '250', '133', '30'],
    'Za $(2 \\cdot 5)^{n}$ uvek dobijamo $10^{n}$: jedinicu sa $n$ nula.', 'osnova',
    { mediji: niz(['2·5', '2·5', '2·5']),
      medijiOdgovora: niz(['10', '10', '10'], { natpis: '(2 · 5)³ = 10 · 10 · 10 = 1000' }) });
  Q(3, 'Koliko je $2^{2^{3}}$?',
    ['256', '64', '512', '2048'],
    'Stepen se računa odozgo: $2^{2^{3}} = 2^{8} = 256$, a ne $4^{3} = 64$.', 'odozgo',
    { medijiOdgovora: niz(['2', '2', '2', '2', '2', '2', '2', '2'], { natpis: '2³ = 8, pa je 2⁸ = 256' }) });
  Q(3, 'Koliko je $(-2)^{3} \\cdot 3^{3}$?',
    ['−216', '216', '−36', '−6'],
    'Stepeni istog izložioca mogu se spojiti u jedan: $(-2)^{3} \\cdot 3^{3} = (-2 \\cdot 3)^{3}$.', 'mnozenje',
    { mediji: niz(['(−2)', '(−2)', '(−2)', '3', '3', '3'], { boje: [1, 1, 1, 2, 2, 2] }),
      medijiOdgovora: niz(['−6', '−6', '−6'], { natpis: '(−2)³ · 3³ = (−2 · 3)³ = (−6)³ = −216' }) });
  Q(2, 'Koja je vrednost izraza $(\\frac{2}{3})^{2}$?',
    ['$\\frac{4}{9}$', '$\\frac{4}{6}$', '$\\frac{2}{9}$', '$\\frac{4}{3}$'],
    'Stepen razlomka: i brojilac i imenilac se dižu na stepen. Zato je $(\\frac{1}{2})^{10} = \\frac{1}{1024}$, što je manje od hiljaditog dela.', 'razlomak',
    { medijiOdgovora: G({ O: [0, 0] }, mreza(3, 3, { ob: (i, j) => (i < 2 && j < 2 ? 1 : null) }), { bezImena: ['O'], velicina: 220 }) });
  Q(3, 'Uprosti izraz $\\frac{(x^{2})^{10} \\cdot (x^{4})^{5}}{(x^{5})^{7}}$ za $x \\neq 0$.',
    ['$x^{5}$', '$x^{35}$', '$x^{20}$', '$x^{45}$'],
    'Brojilac je $x^{40}$, imenilac $x^{35}$; razlika izložilaca je $5$. Zapis stepena sa izložiocem uveo je Dekart 1637. godine – pre njega se pisalo $xxxxx$ ili rečima.', 'brojilac',
    { medijiOdgovora: skokovi([30, 42], [[35, 'x³⁵'], [40, 'x⁴⁰']], [[35, 40, { kasni: 0.3 }]]) });
  S(2, 'Spoji pravilo sa izrazom',
    [['$a^{n} \\cdot a^{m}$', '$a^{n+m}$'], ['$a^{n} : a^{m}$', '$a^{n-m}$'], ['$(a^{n})^{m}$', '$a^{n \\cdot m}$'], ['$(a \\cdot b)^{n}$', '$a^{n} \\cdot b^{n}$']],
    'Zbir $a^{n} + a^{n}$ nije $a^{2n}$, nego $2 \\cdot a^{n}$.', 'pravilo');
  Q(2, 'Ako je $a \\cdot b = 6$, koliko je $a^{2} \\cdot b^{2}$?',
    ['36', '12', '144', '48'],
    'Stepen proizvoda je proizvod stepena: $a^{2} \\cdot b^{2} = (a \\cdot b)^{2}$, a ne $2 \\cdot a \\cdot b$.', 'proizvod',
    { medijiOdgovora: G({ O: [0, 0] }, mreza(6, 6), { bezImena: ['O'], velicina: 240 }) });
  Q(1, 'Koliko je $2^{3} + 2^{3}$?',
    ['16', '64', '32', '12'],
    'Zbir dva jednaka stepena je $2 \\cdot 2^{3} = 2^{4}$, a ne $2^{6}$.', 'zbir',
    { mediji: niz(['2³', '2³'], { boje: [1, 1] }),
      medijiOdgovora: niz(['2³', '2³'], { boje: [1, 1], natpis: '2³ + 2³ = 2 · 2³ = 2⁴ = 16' }) });
  Q(3, 'Koliko je $(\\frac{2}{5})^{3}$?',
    ['$\\frac{8}{125}$', '$\\frac{6}{15}$', '$\\frac{8}{15}$', '$\\frac{2}{125}$'],
    'Stepen razlomka računa se za brojilac i imenilac: $5^{3} = 125$, a ne $5 \\cdot 3 = 15$.', 'imenilac',
    { medijiOdgovora: kocke(5) });

  // ── 20. stepenovanje dekadne jedinice celim brojem ──
  L('Stepenovanje dekadne jedinice celim brojem');
  Q(1, 'Koliko je $10^{0}$?',
    ['1', '0', '10', '0,1'],
    'Izložilac $0$ dobijamo iz pravila deljenja: $10^{3} : 10^{3} = 10^{0}$, a to je $1$.', 'dekada',
    { mediji: niz(['10³', '10²', '10¹', '10⁰'], { donji: ['1000', '100', '10', '?'] }),
      medijiOdgovora: niz(['10³', '10²', '10¹', '10⁰'], { donji: ['1000', '100', '10', '1'] }) });
  Q(1, 'Koliko nula ima broj $10^{6}$?',
    ['6', '5', '7', '60'],
    'Bilion je $10^{12}$, pa ima dvanaest nula.', 'nula',
    { medijiOdgovora: niz(['1', '0', '0', '0', '0', '0', '0'], { natpis: '~jedinica i šest nula' }) });
  Q(1, 'Koliko je $10^{-3}$ zapisano kao decimalni broj?',
    ['0,001', '0,01', '0,0001', '1000'],
    'Decimalni zapis broja $10^{-n}$ ima tačno $n$ decimala: zarez se od jedinice pomeri $n$ mesta ulevo.', 'decimala',
    { medijiOdgovora: niz(['0', ',', '0', '0', '1'], { natpis: '1 / 1000 = 0,001' }) });
  Q(2, 'Koliko je $10^{5} \\cdot 10^{-3}$?',
    ['100', '1000', '0,01', '10 000'],
    'Množenje sa $10^{-3}$ isto je što i deljenje sa $10^{3}$: $10^{5} : 10^{3} = 10^{2}$.', 'skok',
    { mediji: osa(-4, 6, [[5, '10⁵'], [-3, '10⁻³']], { svaki: 2 }),
      medijiOdgovora: skokovi([-4, 6], [[2, '10²']], [[0, 5], [5, 2]]) });
  Q(3, 'Koliko je $10^{4} : 10^{5}$?',
    ['0,1', '10', '0,0001', '1'],
    'Svaka dekadna jedinica manja od jedinice je razlomak: $10^{-1} = \\frac{1}{10}$.', 'desetina',
    { mediji: osa(-2, 6, [[4, '10⁴'], [5, '10⁵']], { svaki: 2 }),
      medijiOdgovora: skokovi([-2, 6], [[4, '10⁴'], [-1, '10⁻¹']], [[0, 4], [4, -1]]) });
  Q(2, 'Koji je naučni zapis broja $8562$?',
    ['$8,562 \\cdot 10^{3}$', '$85,62 \\cdot 10^{2}$', '$0,8562 \\cdot 10^{4}$', '$8562 \\cdot 10^{0}$'],
    'Naučni zapis ima jednu cifru ispred zareza, a stepen 10 pokazuje koliko je zarez pomeren. Kalkulatori ga prikazuju kao „8,562E3“.', 'zarez',
    { mediji: niz(['8', '5', '6', '2']),
      medijiOdgovora: niz(['8', ',', '5', '6', '2'], { natpis: '~zarez se pomeri 3 mesta ulevo, pa je 10³' }) });
  Q(3, 'Koji je naučni zapis broja $0,0000052$?',
    ['$5,2 \\cdot 10^{-6}$', '$5,2 \\cdot 10^{-5}$', '$52 \\cdot 10^{-8}$', '$0,52 \\cdot 10^{-4}$'],
    'Mnogi kalkulatori ovaj broj prikazuju kao „5,2E-6“, što je isti zapis.', 'kalkulator',
    { medijiOdgovora: niz(['5', ',', '2'], { natpis: '~zarez treba da se pomeri 6 mesta udesno' }) });
  U(1, 'Koji naziv NIJE vezan za $10^{6}$?',
    ['mikro', 'mega', 'milion', 'oznaka M'],
    '$10^{-6}$ je mikro (milioniti deo), a mega, milion i oznaka M znače $10^{6}$.',
    'Prefiks „giga“ znači milijardu, odnosno $10^{9}$.', 'prefiks');
  S(2, 'Spoji prefiks sa vrednošću',
    [['kilo', '$10^{3}$'], ['mili', '$10^{-3}$'], ['deka', '$10^{1}$'], ['centi', '$10^{-2}$']],
    'Prefiks „hekto“ znači $10^{2}$, a „tera“ znači $10^{12}$.', 'kilogram');
  Q(2, 'Koliko puta je 1 km duži od 1 cm?',
    ['100 000', '10 000', '1 000 000', '1 000'],
    'Odnos između kilometra i milimetra je $10^{6}$, odnosno milion puta.', 'odnos',
    { mediji: osa(-3, 4, [[-2, '1 cm = 10⁻² m'], [3, '1 km = 10³ m']]),
      medijiOdgovora: skokovi([-3, 4], [[-2, '1 cm'], [3, '1 km']], [[-2, 3]]) });
  Q(2, 'Poluprečnik Zemlje je oko 6371 km. Koji je njegov naučni zapis u metrima?',
    ['$6,371 \\cdot 10^{6}$ m', '$6,371 \\cdot 10^{3}$ m', '$6,371 \\cdot 10^{9}$ m', '$6,371 \\cdot 10^{-3}$ m'],
    'Obim Zemlje po ekvatoru je oko $4 \\cdot 10^{4}$ km.', 'poluprečnik',
    { medijiOdgovora: niz(['6', '3', '7', '1'], { natpis: '~6371 km = 6,371 · 10³ km = 6,371 · 10⁶ m' }) });
  Q(3, 'Poluprečnik Sunca je oko 696 000 km. Koliko je to metara u naučnom zapisu?',
    ['$6,96 \\cdot 10^{8}$ m', '$6,96 \\cdot 10^{5}$ m', '$6,96 \\cdot 10^{9}$ m', '$6,96 \\cdot 10^{7}$ m'],
    'Sunce je toliko veliko da bi u njega stalo oko $1,3$ miliona Zemalja.', 'sunce',
    { medijiOdgovora: niz(['6', '9', '6', '0', '0', '0', '0', '0', '0'], { natpis: '~696 000 km = 696 000 000 m = 6,96 · 10⁸ m' }) });
  Q(3, 'Veličina atoma je reda $10^{-10}$ m. Koliko puta je atom manji od milimetra?',
    ['10 miliona puta', '10 hiljada puta', 'sto miliona puta', 'hiljadu puta'],
    'Ako bismo milimetar uvećali do 10 km, atom bi bio veličine oko 1 mm.', 'atom',
    { mediji: osa(-11, -2, [[-10, '~atom'], [-3, '~1 mm']]),
      medijiOdgovora: osa(-11, -2, [[-10, '~atom'], [-3, '~milimetar']]) });
  Q(1, 'Koliko je $2,5 \\cdot 10^{3}$?',
    ['2 500', '25 000', '250', '2 050'],
    'Množenje sa $10^{3}$ pomera zarez tri mesta udesno.', 'pomeranje',
    { medijiOdgovora: niz(['2', '5', '0', '0'], { natpis: '~zarez pomeren 3 mesta udesno' }) });
  Q(2, 'Crtež prikazuje 10 od 100 jednakih delova kvadrata. Koji stepen broja 10 pokazuje tu vrednost?',
    ['$10^{-1}$', '$10^{-2}$', '$10^{1}$', '$10^{-3}$'],
    'Stoti deo je $10^{-2}$, pa je deset stotih delova isto što i $10^{-1}$.', 'stotina',
    { mediji: G({ O: [0, 0] }, sto(10), { bezImena: ['O'], velicina: 240 }),
      medijiOdgovora: G({ O: [0, 0] }, sto(1), { bezImena: ['O'], velicina: 240 }) });

  return undefined;
};
