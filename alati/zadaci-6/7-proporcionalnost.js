// Tema 5: Zavisne veličine i proporcionalnost (lekcije 5.1–5.5): koordinatni sistem, zavisnosti među
// veličinama, direktna i obrnuta proporcionalnost, razmera i proporcija. Sopstveni brojevi, po gradivu
// udžbenika Matematika 6 (Arhiknjiga). Pomoćni crteži (crtezi) se dele sa teorijom
// (alati/matematika-teorija-6/7-proporcionalnost.js).

// ── pomoćni crteži teme (dobijaju zajedničke alate iz alati/zadaci-6/osnova.js) ──
function crtezi({ G, r, O, bez, stubici }) {
  // koordinatna ravan [x0, x1] × [y0, y1] sa imenovanim tačkama { A: [x, y] }
  // projekcije: imena tačaka čije se normale na ose crtaju isprekidano (od koraka kProj)
  function ravan([x0, x1, y0, y1], tacke = {}, { e = [], velicina = 280, projekcije = [], kProj, bojaProj = 3, bezImena = [], kvadranti = false, ose = ['x', 'y'], bojeTacaka = {}, kTacaka = {} } = {}) {
    const el = [{ mreza: [x0, x1, y0, y1], ose }];
    if (kvadranti) {
      const sx = Math.max(1.5, x1 / 2), sy = Math.max(1.5, y1 / 2);
      el.push({ tx: 'I', at: [r(sx), r(sy)], vel: 22, b: 4 }, { tx: 'II', at: [r(-Math.max(1.5, -x0 / 2)), r(sy)], vel: 22, b: 4 },
        { tx: 'III', at: [r(-Math.max(1.5, -x0 / 2)), r(-Math.max(1.5, -y0 / 2))], vel: 22, b: 4 }, { tx: 'IV', at: [r(sx), r(-Math.max(1.5, -y0 / 2))], vel: 22, b: 4 });
    }
    for (const n of projekcije) {
      const [x, y] = tacke[n];
      el.push({ lin: [[x, 0], [x, y], [0, y]], isp: 1, b: bojaProj, debljina: 2, ...(kProj !== undefined ? { k: kProj } : {}) });
    }
    for (const n of Object.keys(tacke)) if (/^[A-Z]/.test(n)) el.push({ tacka: n, b: bojeTacaka[n] ?? 1, ...(kTacaka[n] !== undefined ? { k: kTacaka[n] } : {}) });
    return G({ O: [0, 0], ...tacke }, [...el, ...e], { bezImena: ['O', ...bezImena], velicina });
  }

  // tabela vrednosti: redovi = [['x', 1, 2, 3], ['y', 2, 4, '?']]; reči dobijaju ~ (preslovljavanje)
  function tabela(redovi, { w = 1.6, h = 0.9, istakni = [], velicina = 300, boje = {} } = {}) {
    const tr = (c) => { c = String(c); return /[A-Za-zČĆŠĐŽčćšđž]{2,}/.test(c) && !c.startsWith('~') ? '~' + c : c; };
    const n = Math.max(...redovi.map((x) => x.length)), m = redovi.length, e = [];
    redovi.forEach((red, i) => {
      const y0 = (m - i - 1) * h;
      red.forEach((c, j) => {
        const kljuc = `${i},${j}`;
        if (istakni.includes(kljuc)) e.push({ lin: [[j * w, y0], [(j + 1) * w, y0], [(j + 1) * w, y0 + h], [j * w, y0 + h]], zatv: 1, b: 1, gusto: 1 });
        e.push({ tx: tr(c), at: [r(j * w + w / 2), r(y0 + h / 2 - 0.1)], vel: 16, ...(j === 0 ? { b: 3 } : {}), ...(boje[kljuc] !== undefined ? { b: boje[kljuc] } : {}) });
      });
    });
    for (let i = 0; i <= m; i++) e.push({ lin: [[0, i * h], [n * w, i * h]], b: 4, debljina: 1.5 });
    for (let j = 0; j <= n; j++) e.push({ lin: [[j * w, 0], [j * w, m * h]], b: 4, debljina: j === 1 ? 2.5 : 1.5 });
    return G(O, e, { ...bez, velicina });
  }

  // grafikon u sopstvenoj razmeri: x = [x0, x1, korak], y = [y0, y1, korak]; tacke = [[x, y], …]
  // vraća { crtez(dodatni elementi), X, Y } – X/Y pretvaraju vrednosti u koordinate crteža
  function grafikon({ x: [x0, x1, kx], y: [y0, y1, ky], W = 8, H = 5, ose = ['x', 'y'], natpisX, natpisY, velicina = 300 }) {
    const X = (v) => r(((v - x0) / (x1 - x0)) * W), Y = (v) => r(((v - y0) / (y1 - y0)) * H);
    const e = [{ mreza: [0, W, 0, H], podela: [r((kx * W) / (x1 - x0)), r((ky * H) / (y1 - y0))], brojevi: 0, ose }];
    for (let v = x0; v <= x1 + 1e-9; v += kx) e.push({ tx: natpisX ? natpisX(v) : String(+v.toFixed(2)).replace('.', ','), at: [X(v), -0.42], vel: 13, b: 4 });
    for (let v = y0; v <= y1 + 1e-9; v += ky) if (v !== y0 || x0 === x1) e.push({ tx: natpisY ? natpisY(v) : String(+v.toFixed(2)).replace('.', ','), at: [-0.5, r(Y(v) - 0.12)], vel: 13, b: 4 });
    const crtez = (dod = []) => G(O, [...e, ...dod], { ...bez, velicina });
    return { crtez, X, Y };
  }
  // izlomljena linija kroz tačke grafikona (i tačkice na njima)
  const linija = (g, tacke, { b = 1, tacke: sTackama = true, ...x } = {}) => [
    { lin: tacke.map(([a, c]) => [g.X(a), g.Y(c)]), str: 0, b, debljina: 3, ...x },
    ...(sTackama ? tacke.map(([a, c]) => ({ tx: '●', at: [g.X(a), g.Y(c)], b, vel: 14, ...(x.k !== undefined ? { k: x.k } : {}) })) : []),
  ];
  // samo tačke (tačkasti dijagram)
  const tackasti = (g, tacke, { b = 1, ...x } = {}) => tacke.map(([a, c]) => ({ tx: '●', at: [g.X(a), g.Y(c)], b, vel: 16, ...x }));
  // grafik obrnute proporcionalnosti y = k/x za x od a do b (u koordinatama ravni)
  const hiperbola = (k, a, b, x = {}) => ({ lin: Array.from({ length: 41 }, (_, i) => { const t = a + ((b - a) * i) / 40; return [r(t), r(k / t)]; }), b: 1, debljina: 3, ...x });

  // traka podeljena na delove srazmerne brojevima (razmera, podela), natpisi po delu
  function trakaDelova(delovi, { natpisi = [], ispod = [], iznad = '', w = 10, jedinicni = false, velicina = 340, k, boje } = {}) {
    const suma = delovi.reduce((a, b) => a + b, 0);
    const e = [];
    let x = 0;
    delovi.forEach((d, i) => {
      const s = (w * d) / suma;
      const b = boje ? boje[i] : (i + 1) % 6;
      if (jedinicni) {
        for (let j = 0; j < d; j++) e.push({ lin: [[r(x + (s * j) / d), 0], [r(x + (s * (j + 1)) / d), 0], [r(x + (s * (j + 1)) / d), 1.2], [r(x + (s * j) / d), 1.2]], zatv: 1, gusto: 1, b });
      } else e.push({ lin: [[r(x), 0], [r(x + s), 0], [r(x + s), 1.2], [r(x), 1.2]], zatv: 1, gusto: 1, b });
      if (natpisi[i]) e.push({ tx: natpisi[i], at: [r(x + s / 2), 0.5], vel: 16 });
      if (ispod[i]) e.push({ tx: ispod[i], at: [r(x + s / 2), -0.6], vel: 16, b, ...(k !== undefined ? { k } : {}) });
      x += s;
    });
    if (iznad) e.push({ tx: iznad, at: [w / 2, 1.75], vel: 17 });
    return G(O, e, { ...bez, velicina });
  }

  // razmernik karte: n podeoka dužine u (na crtežu), podeok vredi `korak` jedinica (npr. 2 km)
  function razmernik(n, natpis, { u = 1.5, x = 0, y = 0, korak = 1 } = {}) {
    const e = [{ lin: [[x, y], [r(x + n * u), y]], b: 0, debljina: 3 }];
    for (let i = 0; i <= n; i++) {
      e.push({ lin: [[r(x + i * u), y - 0.15], [r(x + i * u), y + 0.15]], b: 0, debljina: 2 });
      e.push({ tx: i === n ? `${i * korak} ${natpis}` : String(i * korak), at: [r(x + i * u), y - 0.55], vel: 13 });
    }
    for (let i = 0; i < n; i += 2) e.push({ lin: [[r(x + i * u), y], [r(x + (i + 1) * u), y]], b: 3, debljina: 6 });
    return e;
  }

  // unakrsno množenje: a/b = c/d sa strelicama (iscrtavaju se) a→d i c→b
  function unakrsno(a, b, c, d, { velicina = 220 } = {}) {
    return G(O, [
      { tx: a, at: [0, 0.75], vel: 26 }, { lin: [[-0.5, 0.35], [0.5, 0.35]], b: 0, debljina: 2 }, { tx: b, at: [0, -0.35], vel: 26 },
      { tx: '=', at: [1.25, 0.05], vel: 26 },
      { tx: c, at: [2.5, 0.75], vel: 26 }, { lin: [[2, 0.35], [3, 0.35]], b: 0, debljina: 2 }, { tx: d, at: [2.5, -0.35], vel: 26 },
      { lin: [[0.35, 0.95], [2.15, -0.15]], str: 1, b: 1, debljina: 2.5, crtaj: 1, kasni: 0.4, trajanje: 0.9 },
      { lin: [[2.15, 0.95], [0.35, -0.15]], str: 1, b: 2, debljina: 2.5, crtaj: 1, kasni: 1.4, trajanje: 0.9 },
    ], { ...bez, velicina });
  }

  // nedeljni histogram (dani pon–ned) – stubici sa preslovljenim nazivima dana
  const DANI = ['~pon', '~uto', '~sre', '~čet', '~pet', '~sub', '~ned'];
  const nedelja = (vrednosti, x = {}) => stubici(vrednosti.map((v, i) => [DANI[i], v]), { korakY: 20, maxY: 120, visina: 5, ...x });

  return { ravan, tabela, grafikon, linija, tackasti, hiperbola, trakaDelova, razmernik, unakrsno, nedelja, DANI };
}

module.exports = (A) => {
  const { L, Z, K, G, R, O, bez, r, proveri } = A;
  const { ravan, tabela, grafikon, linija, tackasti, hiperbola, trakaDelova, razmernik, nedelja } = crtezi(A);
  const jed = (a, b) => Math.abs(a - b) < 1e-9;

  // ════════════════ 5.1 Koordinatni sistem i prikaz tačaka ════════════════
  L('Koordinatni sistem i prikaz tačaka');

  Z(1, 'Koje su koordinate tačke $A$ sa slike?',
    ['$A(−3, 2)$', '$A(2, −3)$', '$A(3, 2)$', '$A(−3, −2)$'],
    [K('Iz tačke $A$ spustimo normalu na $x$-osu: seče je u $−3$. To je apscisa (prva koordinata).'),
     K('Normala na $y$-osu seče je u $2$. To je ordinata (druga koordinata).'),
     K('Prvo se piše $x$, pa $y$: $A(−3, 2)$. Redosled je važan – $(2, −3)$ je sasvim druga tačka.')],
    ravan([-5, 5, -4, 4], { A: [-3, 2] }, { projekcije: ['A'], kProj: 1 }));

  Z(1, 'U kom kvadrantu se nalazi tačka $M(−2,5; −4)$?',
    ['u III kvadrantu', 'u II kvadrantu', 'u IV kvadrantu', 'na $y$-osi'],
    [K('Apscisa $−2,5$ je negativna: tačka je levo od $y$-ose.'),
     K('Ordinata $−4$ je negativna: tačka je ispod $x$-ose.'),
     K('Levo i dole – to je III kvadrant (obe koordinate negativne).')],
    R(ravan([-5, 5, -5, 4], { M: [-2.5, -4] }, { kvadranti: true, projekcije: ['M'] })));

  proveri(4 - -3 === 7, 'rastojanje A(−3,2) B(4,2)');
  Z(2, 'Koliko je rastojanje između tačaka $A(−3, 2)$ i $B(4, 2)$?',
    ['$7$', '$1$', '$4$', '$−7$'],
    [K('Obe tačke imaju istu ordinatu $2$, pa leže na pravoj paralelnoj $x$-osi.'),
     K('Rastojanje je apsolutna vrednost razlike apscisa: $|4 − (−3)| = |7| = 7$.', ['ab']),
     K('Greška $1$ nastaje kad se zaboravi da je $−(−3) = +3$. Rastojanje nikad nije negativno.')],
    G({ O: [0, 0], A: [-3, 2], B: [4, 2] }, [{ mreza: [-5, 5, -2, 4], ose: ['x', 'y'] }, { tacka: 'A', b: 1 }, { tacka: 'B', b: 1 }, { d: 'AB', b: 2, id: 'ab', k: 2, o: '7' }], { bezImena: ['O'], velicina: 280 }));

  proveri(jed(3 - -1.5, 4.5), 'rastojanje 3 i −1,5');
  Z(2, 'Koliko je rastojanje između tačaka $T_1(2, 3)$ i $T_2(2, −1{1|2})$?',
    ['$4{1|2}$', '$1{1|2}$', '$3$', '$5{1|2}$'],
    [K('Apscise su iste ($2$), pa su tačke jedna iznad druge.'),
     K('Rastojanje: $|3 − (−1{1|2})| = 3 + 1{1|2} = 4{1|2}$.', ['t'])],
    G({ O: [0, 0], T: [2, 3], S: [2, -1.5] }, [{ mreza: [-2, 4, -3, 4], ose: ['x', 'y'] }, { tacka: 'TS', b: 1 }, { tx: 'T₁', at: [2.55, 3.1], b: 1 }, { tx: 'T₂', at: [2.55, -1.6], b: 1 }, { d: 'TS', b: 2, id: 't', k: 2 }], { bezImena: ['O', 'T', 'S'], velicina: 240 }));

  Z(2, 'Tačka $B$ je centralno simetrična tački $A(−2, 3)$ u odnosu na koordinatni početak. Koje su koordinate tačke $B$?',
    ['$B(2, −3)$', '$B(−2, −3)$', '$B(2, 3)$', '$B(−3, 2)$'],
    [K('Kod simetrije u odnosu na tačku $O$ obe koordinate menjaju znak: $(a, b) → (−a, −b)$.'),
     K('$A(−2, 3) → B(2, −3)$. Duž $AB$ prolazi kroz $O$, a $O$ joj je središte.', ['ab'])],
    R(G({ O: [0, 0], A: [-2, 3], B: [2, -3] }, [{ mreza: [-4, 4, -4, 4], ose: ['x', 'y'] }, { tacka: 'A', b: 1 }, { tacka: 'B', b: 2, k: 2 }, { d: 'AB', isp: 1, b: 3, id: 'ab', k: 2 }, { tacka: 'O', b: 3 }], { bezImena: ['O'], velicina: 260 })));

  proveri(2 * (5 + 3) === 16, 'obim pravougaonika 5 × 3');
  Z(2, 'Temena pravougaonika su $A(−2, −1)$, $B(3, −1)$, $C(3, 2)$ i $D(−2, 2)$. Koliki je njegov obim (jedinica je dužina kvadratića)?',
    ['$16$', '$15$', '$8$', '$10$'],
    [K('Stranica $AB$ je vodoravna: $|3 − (−2)| = 5$.', ['ab']),
     K('Stranica $BC$ je uspravna: $|2 − (−1)| = 3$.', ['bc']),
     K('Obim: $2 · (5 + 3) = 16$. (Greška $15$ je površina $5 · 3$.)')],
    G({ O: [0, 0], A: [-2, -1], B: [3, -1], C: [3, 2], D: [-2, 2] }, [{ mreza: [-4, 5, -3, 4], ose: ['x', 'y'] }, { p: 'ABCD', b: 0 }, { d: 'AB', b: 1, id: 'ab', k: 1, o: '5' }, { d: 'BC', b: 2, id: 'bc', k: 2, o: '3' }], { bezImena: ['O'], velicina: 280 }));

  proveri(4 * 4 === 16, 'površina kvadrata stranice 4');
  Z(2, 'Kvadrat ima temena $(−2, −2)$, $(2, −2)$, $(2, 2)$ i $(−2, 2)$. Kolika mu je površina?',
    ['$16$', '$4$', '$8$', '$64$'],
    [K('Stranica: od $−2$ do $2$ ima $|2 − (−2)| = 4$ jedinice.'),
     K('Površina: $4 · 4 = 16$ kvadratića. Koordinatni početak je centar kvadrata, a svaki kvadrant sadrži četvrtinu: $4$ kvadratića.', ['kv'])],
    R(G({ O: [0, 0], A: [-2, -2], B: [2, -2], C: [2, 2], D: [-2, 2] }, [{ mreza: [-3, 3, -3, 3], ose: ['x', 'y'] }, { p: 'ABCD', b: 2, id: 'kv' }], { bezImena: ['O', 'A', 'B', 'C', 'D'], velicina: 240 })));

  Z(2, 'Spoji redom tačke $A(−3, 0)$, $B(0, 4)$, $C(3, 0)$ i $D(0, −4)$. Koji četvorougao se dobija?',
    ['romb', 'kvadrat', 'trapez', 'pravougaonik'],
    [K('Tačke $A$ i $C$ su na $x$-osi, simetrične u odnosu na $O$; isto $B$ i $D$ na $y$-osi.'),
     K('Dijagonale $AC = 6$ i $BD = 8$ se seku pod pravim uglom i polove se: to je romb.', ['d']),
     K('Nije kvadrat, jer dijagonale nisu jednake ($6 ≠ 8$).')],
    G({ O: [0, 0], A: [-3, 0], B: [0, 4], C: [3, 0], D: [0, -4] }, [{ mreza: [-4, 4, -5, 5], ose: ['x', 'y'] }, { tacka: 'ABCD', b: 1 }, { p: 'ABCD', b: 2, k: 1 }, { d: 'AC', b: 3, id: 'd', k: 2 }, { d: 'BD', b: 3, id: 'd', k: 2 }], { bezImena: ['O'], velicina: 260 }));

  Z(3, 'Tačka $P$ je simetrična tački $A(3, −2)$ u odnosu na $x$-osu, a tačka $Q$ je simetrična tački $P$ u odnosu na $y$-osu. Koje su koordinate tačke $Q$?',
    ['$Q(−3, 2)$', '$Q(3, 2)$', '$Q(−3, −2)$', '$Q(2, −3)$'],
    [K('Simetrija u odnosu na $x$-osu menja znak ordinate: $P(3, 2)$.', ['p']),
     K('Simetrija u odnosu na $y$-osu menja znak apscise: $Q(−3, 2)$.', ['q']),
     K('Dve osne simetrije zajedno daju centralnu simetriju u odnosu na $O$: $A(3, −2) → Q(−3, 2)$.', ['aq'])],
    R(G({ O: [0, 0], A: [3, -2], P: [3, 2], Q: [-3, 2] }, [{ mreza: [-4, 4, -3, 3], ose: ['x', 'y'] }, { tacka: 'A', b: 1 }, { d: 'AP', isp: 1, b: 2 }, { tacka: 'P', b: 2, id: 'p' }, { d: 'PQ', isp: 1, b: 3, k: 2 }, { tacka: 'Q', b: 3, id: 'q', k: 2 }, { d: 'AQ', isp: 1, b: 4, id: 'aq', k: 3 }], { bezImena: ['O'], velicina: 260 })));

  Z(3, 'Tri temena pravougaonika su $A(−1, −2)$, $B(4, −2)$ i $C(4, 1)$. Koje su koordinate četvrtog temena $D$?',
    ['$D(−1, 1)$', '$D(1, −1)$', '$D(4, −1)$', '$D(−2, 1)$'],
    [K('$AB$ je vodoravna, a $BC$ uspravna – u temenu $B$ je pravi ugao.'),
     K('$D$ mora biti iznad $A$ (ista apscisa $−1$) i levo od $C$ (ista ordinata $1$).', ['d']),
     K('$D(−1, 1)$.')],
    G({ O: [0, 0], A: [-1, -2], B: [4, -2], C: [4, 1], D: [-1, 1] }, [{ mreza: [-3, 5, -3, 3], ose: ['x', 'y'] }, { tacka: 'ABC', b: 1 }, { d: 'AB', b: 0 }, { d: 'BC', b: 0 }, { tacka: 'D', b: 2, k: 2, id: 'd' }, { d: 'CD', isp: 1, b: 2, k: 2 }, { d: 'DA', isp: 1, b: 2, k: 2 }], { bezImena: ['O', ...[]], velicina: 260 }));

  // ════════════════ 5.2 Zavisnosti među veličinama ════════════════
  L('Zavisnosti među veličinama');
  const vezba = [20, 40, 60, 95, 100, 120, 90];
  proveri(vezba.reduce((a, b) => a + b, 0) === 525 && 525 / 7 === 75, 'zbir vežbanja 525, prosek 75');

  Z(1, 'Histogram pokazuje koliko je minuta Sofija vežbala klavir svakog dana u nedelji. Koliko je ukupno vežbala za vikend?',
    ['$210$ minuta', '$120$ minuta', '$190$ minuta', '$220$ minuta'],
    [K('Subota: $120$ minuta, nedelja: $90$ minuta.', ['s5', 's6']),
     K('Ukupno: $120 + 90 = 210$ minuta, tj. $3$ sata i $30$ minuta.')],
    nedelja(vezba));

  Z(1, 'Obim kvadrata $O$ zavisi od stranice $a$. Kolika je vrednost koja nedostaje u tabeli?',
    ['$28$', '$11$', '$14$', '$49$'],
    [K('Obim kvadrata je $O = 4 · a$: za $a = 1$ je $4$, za $a = 2$ je $8$…'),
     K('Za $a = 7$: $O = 4 · 7 = 28$. ($49$ je površina, a ne obim.)')],
    tabela([['a', 1, 2, 3, 7], ['O', 4, 8, 12, '?']], { istakni: ['1,4'] }));

  const temp = [[6, 4], [8, 7], [10, 12], [12, 17], [14, 19], [16, 16], [18, 12], [20, 9]];
  proveri(19 - 9 === 10, 'pad temperature 14h → 20h');
  {
    const g = grafikon({ x: [6, 20, 2], y: [0, 20, 5], W: 8, H: 5, ose: ['~h', '°C'] });
    Z(2, 'Grafikon pokazuje temperaturu vazduha tokom jednog dana. Za koliko stepeni je temperatura pala od $14$ do $20$ časova?',
      ['$10 °C$', '$9 °C$', '$19 °C$', '$7 °C$'],
      [K('U $14$ h temperatura je bila $19 °C$ (najviša tačka grafikona).', ['t14']),
       K('U $20$ h bila je $9 °C$.', ['t20']),
       K('Pad: $19 − 9 = 10 °C$.')],
      g.crtez([...linija(g, temp), { tx: '●', at: [g.X(14), g.Y(19)], b: 2, vel: 20, id: 't14', k: 1 }, { tx: '●', at: [g.X(20), g.Y(9)], b: 2, vel: 20, id: 't20', k: 2 }]));
  }

  proveri([1, 2, 3, 4].every((x, i) => 3 * x + 1 === [4, 7, 10, 13][i]) && 3 * 10 + 1 === 31, 'y = 3x + 1');
  Z(2, 'U tabeli je prikazana zavisnost $y$ od $x$. Koliko je $y$ kad je $x = 10$?',
    ['$31$', '$34$', '$30$', '$40$'],
    [K('Kad se $x$ poveća za $1$, $y$ se poveća za $3$: $4, 7, 10, 13$…'),
     K('Pravilo: $y = 3x + 1$ (provera: $3 · 4 + 1 = 13$ ✓).'),
     K('Za $x = 10$: $y = 3 · 10 + 1 = 31$.')],
    tabela([['x', 1, 2, 3, 4, 10], ['y', 4, 7, 10, 13, '?']], { istakni: ['1,5'], w: 1.4 }));

  Z(2, 'Koliko dana u nedelji je Sofija vežbala klavir duže od jednog i po sata?',
    ['$3$', '$4$', '$2$', '$5$'],
    [K('Jedan i po sat je $90$ minuta. Tražimo stubiće više od crte $90$.'),
     K('Više od $90$: četvrtak ($95$), petak ($100$), subota ($120$). Nedelja je tačno $90$, a ne više.', ['s3', 's4', 's5'])],
    (() => { const d = nedelja(vezba); const y = r(90 * 5 / 120); d.e.push({ lin: [[0, y], [11.2, y]], b: 1, debljina: 2.5 }, { tx: '90', at: [11.8, r(y - 0.1)], b: 1 }); return d; })());

  const put = [[0, 0], [1, 15], [2, 30], [3, 30], [4, 50]];
  {
    const g = grafikon({ x: [0, 4, 1], y: [0, 50, 10], W: 7, H: 5, ose: ['~h', 'km'] });
    Z(2, 'Grafikon prikazuje put koji je biciklista prešao u zavisnosti od vremena. Koliko je dugo biciklista odmarao?',
      ['$1$ sat', '$2$ sata', '$30$ minuta', '$3$ sata'],
      [K('Dok biciklista stoji, pređeni put se ne menja – grafikon je vodoravan.', ['odmor']),
       K('Vodoravni deo traje od $2$ h do $3$ h: odmor je trajao $1$ sat (na $30$-om kilometru).')],
      g.crtez([...linija(g, put), { lin: [[g.X(2), g.Y(30)], [g.X(3), g.Y(30)]], b: 2, debljina: 6, id: 'odmor', k: 1 }]));
    proveri(50 - 30 === 20, 'poslednji sat 20 km');
    Z(2, 'Sa istog grafikona: koliko kilometara je biciklista prešao u poslednjem satu vožnje?',
      ['$20$ km', '$50$ km', '$15$ km', '$30$ km'],
      [K('U $3$ h je bio na $30$ km, a u $4$ h na $50$ km.', ['p']),
       K('U poslednjem satu: $50 − 30 = 20$ km – brže nego na početku ($15$ km na sat).')],
      g.crtez([...linija(g, put), { lin: [[g.X(3), g.Y(30)], [g.X(4), g.Y(30)], [g.X(4), g.Y(50)]], isp: 1, b: 2, debljina: 3, id: 'p', k: 1 }]));
  }

  proveri([-2, -1, 0, 1, 2].every((x, i) => 1 - 2 * x === [5, 3, 1, -1, -3][i]) && 1 - 2 * -4 === 9, 'y = 1 − 2x');
  Z(3, 'U tabeli je zavisnost $y$ od $x$. Koliko je $y$ za $x = −4$?',
    ['$9$', '$−7$', '$7$', '$−9$'],
    [K('Kad se $x$ poveća za $1$, $y$ se smanji za $2$. Za $x = 0$ je $y = 1$.'),
     K('Pravilo: $y = 1 − 2x$ (provera: $1 − 2 · 2 = −3$ ✓).'),
     K('Za $x = −4$: $y = 1 − 2 · (−4) = 1 + 8 = 9$.')],
    tabela([['x', '−2', '−1', '0', '1', '2', '−4'], ['y', '5', '3', '1', '−1', '−3', '?']], { istakni: ['1,6'], w: 1.25 }));

  Z(3, 'Kolika je prosečna dužina vežbanja klavira tokom te nedelje (u minutima)?',
    ['$75$', '$70$', '$90$', '$60$'],
    [K('Zbir: $20 + 40 + 60 + 95 + 100 + 120 + 90 = 525$ minuta.'),
     K('Prosek: $525 : 7 = 75$ minuta.', ['pr'])],
    (() => { const d = nedelja(vezba); d.e.push({ lin: [[0, r(75 * 5 / 120)], [11.2, r(75 * 5 / 120)]], b: 1, debljina: 3, crtaj: 1, k: 2, id: 'pr' }); return d; })());

  proveri(jed(19.5 / 3, 6.5), '19,5 : 3 = 6,5');
  Z(3, 'Obim $O$ jednakostraničnog trougla zavisi od dužine stranice $x$. Kolika je stranica ako je obim $19,5$ cm?',
    ['$6,5$ cm', '$58,5$ cm', '$9,75$ cm', '$6$ cm'],
    [K('Jednakostranični trougao ima tri jednake stranice: $O = 3x$.'),
     K('$3x = 19,5$, pa je $x = 19,5 : 3 = 6,5$ cm.')],
    tabela([['x', 1, 2, 5, '?'], ['O', 3, 6, 15, '19,5']], { istakni: ['0,4'] }));

  // ════════════════ 5.3 Direktna proporcionalnost ════════════════
  L('Direktna proporcionalnost');

  proveri(150 * 3.5 === 525, '150 · 3,5');
  {
    const g = grafikon({ x: [0, 4, 1], y: [0, 600, 150], W: 6, H: 5, ose: ['kg', '~din'] });
    Z(1, 'Kilogram paradajza košta $150$ dinara. Koliko košta $3,5$ kg?',
      ['$525$ dinara', '$450$ dinara', '$153,5$ dinara', '$600$ dinara'],
      [K('Cena $y$ je direktno proporcionalna masi $x$: $y = 150 · x$.'),
       K('$y = 150 · 3,5 = 525$ dinara.', ['m']),
       K('Grafik je prava kroz koordinatni početak: dvostruko više paradajza – dvostruko veća cena.')],
      g.crtez([{ lin: [[0, 0], [g.X(4), g.Y(600)]], b: 1, debljina: 3 }, { lin: [[g.X(3.5), 0], [g.X(3.5), g.Y(525)], [0, g.Y(525)]], isp: 1, b: 2, k: 2, id: 'm' }, { tx: '525', at: [-0.6, g.Y(525)], b: 2, k: 2 }, { tx: '3,5', at: [g.X(3.5), -0.85], b: 2 }]));
  }

  Z(1, 'U direktnoj proporcionalnosti $y = 5x$ je $y = 240$. Koliko je $x$?',
    ['$48$', '$1 200$', '$235$', '$45$'],
    [K('$5x = 240$'),
     K('$x = 240 : 5 = 48$. Provera: $5 · 48 = 240$ ✓')],
    R(tabela([['x', 1, 2, 10, 48], ['y', 5, 10, 50, 240]], { istakni: ['0,4'] })));

  proveri(7 * 3 === 21, '9 bombona = 3 · 3 bombone');
  Z(2, 'Tri bombone koštaju $7$ dinara. Koliko košta $9$ bombona?',
    ['$21$ dinar', '$13$ dinara', '$63$ dinara', '$27$ dinara'],
    [K('Bombona je $3$ puta više ($9 : 3 = 3$).'),
     K('Zato je i cena $3$ puta veća: $7 · 3 = 21$ dinar. (Greška $13$: dodato $6$ umesto množenja.)')],
    trakaDelova([1, 1, 1], { natpisi: ['🍬🍬🍬', '🍬🍬🍬', '🍬🍬🍬'], ispod: ['7', '7', '7'], k: 1, boje: [1, 1, 1] }));

  proveri(234 / 6 === 39 && 390 / 39 === 10, '6 svezaka 234 din, 390 → 10');
  Z(2, 'Šest svezaka košta $234$ dinara. Koliko se istih svezaka može kupiti za $390$ dinara?',
    ['$10$', '$9$', '$12$', '$8$'],
    [K('Jedna sveska: $234 : 6 = 39$ dinara.'),
     K('Za $390$ dinara: $390 : 39 = 10$ svezaka.'),
     K('Provera proporcijom: ${6|234} = {10|390}$, jer je $6 · 390 = 2 340 = 234 · 10$ ✓')],
    R(tabela([['~sveske', 1, 6, 10], ['~dinari', 39, 234, 390]], { istakni: ['0,3'], w: 1.8 })));

  proveri(jed((15 / 14) * 16, 120 / 7), '14 dinja 15 kg → 16 dinja 120/7 kg');
  Z(2, 'Četrnaest jednakih dinja teži $15$ kg. Koliko teži $16$ takvih dinja?',
    ['${120|7}$ kg', '${120|9}$ kg', '$17$ kg', '${110|7}$ kg'],
    [K('Jedna dinja: ${15|14}$ kg.'),
     K('$16$ dinja: $16 · {15|14} = {240|14} = {120|7}$ kg, tj. $17{1|7}$ kg.'),
     K('Greška $17$ kg: dve dinje više ne znači dva kilograma više.')]);

  proveri(32000 * 0.625 === 20000, 'popust 37,5 % na 32 000');
  Z(2, 'Prodavnica daje popust od $37,5 %$. Kolika je cena na sniženju za aparat koji inače košta $32 000$ dinara?',
    ['$20 000$ dinara', '$12 000$ dinara', '$31 962,5$ dinara', '$28 000$ dinara'],
    [K('Posle popusta ostaje $100 % − 37,5 % = 62,5 % = 0,625$ cene.'),
     K('Nova cena $y$ je direktno proporcionalna staroj $x$: $y = 0,625 · x$.'),
     K('$y = 0,625 · 32 000 = 20 000$ dinara. ($12 000$ je iznos popusta.)')],
    trakaDelova([62.5, 37.5], { natpisi: ['62,5 %', '37,5 %'], ispod: ['~plaćamo', '~popust'], boje: [2, 1] }));

  proveri(540 / 18 === 30 && 7 * 30 === 210 && 11 * 30 === 330, 'podela 540 u odnosu 7 : 11');
  Z(3, 'Anka ima $7$, a Branka $11$ godina. Treba da podele $540$ dinara direktno proporcionalno svojim godinama. Koliko dobija Anka?',
    ['$210$ dinara', '$330$ dinara', '$270$ dinara', '$77$ dinara'],
    [K('Novac delimo na $7 + 11 = 18$ jednakih delova.'),
     K('Jedan deo: $540 : 18 = 30$ dinara.'),
     K('Anka dobija $7 · 30 = 210$, a Branka $11 · 30 = 330$ dinara. Provera: $210 + 330 = 540$ ✓')],
    trakaDelova([7, 11], { natpisi: ['~Anka', '~Branka'], ispod: ['7 · 30', '11 · 30'], jedinicni: true, k: 2 }));

  proveri(44 / 2.75 === 16 && 16 * 1.75 === 28, 'AM = 16, BM = 28');
  Z(3, 'Tačka $M$ deli duž $AB$ dužine $44$ cm tako da je $BM = 1,75 · AM$. Kolika je duž $AM$?',
    ['$16$ cm', '$28$ cm', '$25,1$ cm', '$22$ cm'],
    [K('Ako je $AM = x$, onda je $BM = 1,75x$, a cela duž $x + 1,75x = 2,75x$.'),
     K('$2,75x = 44$, pa je $x = 16$ cm.', ['am']),
     K('$BM = 1,75 · 16 = 28$ cm. Provera: $16 + 28 = 44$ ✓')],
    G({ A: [0, 0], M: [4, 0], B: [11, 0] }, [{ d: 'AM', b: 1, debljina: 5, id: 'am', o: 'x' }, { d: 'MB', b: 2, debljina: 5, o: '1,75x' }, { tacka: 'AMB', b: 3 }, { tx: '44 cm', at: [5.5, -1] }], { velicina: 320 }));

  proveri(6 / 4 * 10 === 15, 'y = 1,5 x, x = 10');
  {
    Z(2, 'Na slici je grafik direktne proporcionalnosti koji prolazi kroz tačku $A$. Koliko je $y$ za $x = 10$?',
      ['$15$', '$12$', '${20|3}$', '$16$'],
      [K('Sa grafika: $A(4, 6)$, pa je $k = {y|x} = {6|4} = 1,5$.', ['a']),
       K('$y = 1,5 · x$, za $x = 10$: $y = 15$. (Greška $12$: dodato $6$ na $6$.)')],
      G({ O: [0, 0], A: [4, 6] }, [{ mreza: [-1, 7, -1, 9], ose: ['x', 'y'] }, { lin: [[-0.6, -0.9], [6, 9]], b: 1, debljina: 3 }, { tacka: 'A', b: 2, id: 'a' }, { lin: [[4, 0], [4, 6], [0, 6]], isp: 1, b: 3, k: 1 }], { bezImena: ['O'], velicina: 260 }));
  }

  proveri(jed(6.3 / 0.35, 18), '35 % od 18 = 6,3');
  Z(3, 'Vrednost $y$ je jednaka $35 %$ vrednosti $x$. Koliko je $x$ ako je $y = 6,3$?',
    ['$18$', '$2,205$', '$22,05$', '$1,8$'],
    [K('$y = 0,35 · x$ – direktna proporcionalnost sa $k = 0,35$.'),
     K('$0,35 · x = 6,3$, pa je $x = 6,3 : 0,35 = 630 : 35 = 18$.'),
     K('Provera: $35 %$ od $18$ je $0,35 · 18 = 6,3$ ✓ ($2,205$ je $35 %$ od $6,3$ – pogrešan smer.)')],
    R(trakaDelova([35, 65], { natpisi: ['35 %', '65 %'], ispod: ['6,3', ''], iznad: 'x = 18', boje: [1, 4] })));

  // ════════════════ 5.4 Obrnuta proporcionalnost ════════════════
  L('Obrnuta proporcionalnost');

  Z(1, 'Goran ima $1 000$ dinara za sok. Koliko litara može da kupi ako litar košta $250$ dinara?',
    ['$4$ litra', '$5$ litara', '$25$ litara', '$750$ litara'],
    [K('Broj litara $y$ i cena litra $x$ su obrnuto proporcionalni: $x · y = 1 000$.'),
     K('$y = 1 000 : 250 = 4$ litra. Što je sok skuplji, manje ga dobijemo.')],
    R(tabela([['~din/l', 50, 100, 200, 250], ['~litara', 20, 10, 5, 4]], { istakni: ['1,4'], w: 1.7 })));

  proveri(180 / 5 === 36, '180 : 5');
  Z(1, 'Jedna kosilica pokosi teren za $180$ minuta. Za koliko minuta isti teren pokosi $5$ jednakih kosilica?',
    ['$36$ minuta', '$900$ minuta', '$175$ minuta', '$45$ minuta'],
    [K('Pet kosilica radi pet puta brže – broj kosilica i vreme su obrnuto proporcionalni.'),
     K('$180 : 5 = 36$ minuta.')],
    trakaDelova([1, 1, 1, 1, 1], { natpisi: ['🚜', '🚜', '🚜', '🚜', '🚜'], ispod: ['36', '36', '36', '36', '36'], iznad: '180 min', k: 2, boje: [2, 2, 2, 2, 2] }));

  Z(2, 'Za sklapanje jednog automobila potrebno je $96$ sati rada. Koliko sati traje sklapanje ako istovremeno radi $8$ radnika?',
    ['$12$ sati', '$768$ sati', '$88$ sati', '$16$ sati'],
    [K('Ukupan rad je uvek $96$ sati, samo se deli na više radnika.'),
     K('$96 : 8 = 12$ sati.')],
    R(trakaDelova([1, 1, 1, 1, 1, 1, 1, 1], { ispod: Array(8).fill('12'), iznad: '96 h', boje: Array(8).fill(3) })));

  proveri(4 * 3 / 6 === 2, '4 učenika 3 dana → 6 učenika 2 dana');
  Z(2, 'Četiri učenika pojedu tortu za $3$ dana. Za koliko dana bi istu tortu, jedući istim tempom, pojelo $6$ učenika?',
    ['$2$ dana', '$4{1|2}$ dana', '$1$ dan', '$5$ dana'],
    [K('Torta „traje“ $4 · 3 = 12$ učeničkih dana.'),
     K('Za $6$ učenika: $12 : 6 = 2$ dana. Više učenika – manje dana (obrnuta proporcionalnost).'),
     K('Greška $4{1|2}$ nastaje kad se računa kao da je proporcionalnost direktna.')],
    R(trakaDelova([2, 2, 2, 2, 2, 2], { ispod: Array(6).fill('2'), iznad: '~torta = 4 · 3 = 12 učeničkih dana', jedinicni: true, boje: Array(6).fill(1) })));

  proveri(36 / 6 === 6 && 4 * 9 === 36, 'x·y = 36');
  Z(2, 'Veličine $x$ i $y$ iz tabele su obrnuto proporcionalne. Koliko je $y$ za $x = 6$?',
    ['$6$', '$18$', '$12$', '$7$'],
    [K('Proizvod je stalan: $2 · 18 = 4 · 9 = 12 · 3 = 36$, pa je $k = 36$.'),
     K('Za $x = 6$: $y = 36 : 6 = 6$.')],
    tabela([['x', 2, 4, 6, 12], ['y', 18, 9, '?', 3]], { istakni: ['1,3'] }));

  proveri(12 / 4 === 3, 'y = 12/x, x = 4');
  Z(2, 'Na slici je grafik obrnute proporcionalnosti koji prolazi kroz tačku $A(2, 6)$. Koliko je $y$ za $x = 4$?',
    ['$3$', '$12$', '$8$', '$4$'],
    [K('$k = x · y = 2 · 6 = 12$, pa je $y = {12|x}$.', ['a']),
     K('Za $x = 4$: $y = 12 : 4 = 3$. Kad se $x$ udvostruči, $y$ se prepolovi.', ['b'])],
    G({ O: [0, 0], A: [2, 6], B: [4, 3] }, [{ mreza: [-1, 9, -1, 9], ose: ['x', 'y'] }, hiperbola(12, 1.4, 8.5), { tacka: 'A', b: 2, id: 'a' }, { lin: [[2, 0], [2, 6], [0, 6]], isp: 1, b: 3 }, { tacka: 'B', b: 3, id: 'b', k: 2 }, { lin: [[4, 0], [4, 3], [0, 3]], isp: 1, b: 3, k: 2 }], { bezImena: ['O'], velicina: 260 }));

  proveri(24 / 4 / 3 === 2 && (60 / 5) / 2 === 6 && 6 - 3 === 3, 'pogoni');
  Z(3, 'Fabrika ima $3$ jednaka pogona koji zajedno naprave $24$ automobila za $4$ dana. Koliko pogona treba dodati da bi se $60$ automobila napravilo za $5$ dana?',
    ['$3$', '$6$', '$2$', '$4$'],
    [K('Za $4$ dana $3$ pogona naprave $24$ auta, pa je to $24 : 4 = 6$ auta dnevno, tj. $2$ auta dnevno po pogonu.'),
     K('Potrebno je $60 : 5 = 12$ auta dnevno, a za to treba $12 : 2 = 6$ pogona.'),
     K('Već postoje $3$ pogona, pa treba dodati još $6 − 3 = 3$. (Odgovor $6$ je ukupan broj pogona.)')],
    R(tabela([['~pogoni', 1, 3, 6], ['~auta dnevno', 2, 6, 12]], { istakni: ['0,3'], w: 2.2 })));

  proveri(4 * 9 / 6 === 6, '4 radnika 9 h → 6 radnika 6 h');
  Z(3, 'Četiri radnika oberu voćnjak za $9$ sati. Za koliko sati bi isti voćnjak obralo $6$ radnika, ako svi rade jednako brzo?',
    ['$6$ sati', '$13{1|2}$ sati', '$7$ sati', '$4$ sata'],
    [K('Ukupan posao: $4 · 9 = 36$ radnih sati.'),
     K('Za $6$ radnika: $36 : 6 = 6$ sati.'),
     K('Proporcijom: ${x|9} = {4|6}$, jer više radnika znači manje sati. ($13{1|2}$ je pogrešan, „direktan“ smer.)')],
    R(trakaDelova([1, 1, 1, 1, 1, 1], { ispod: Array(6).fill('6 h'), iznad: '~36 radnih sati', boje: Array(6).fill(2) })));

  proveri(90 * 4 / 120 === 3, '90 km/h 4 h → 120 km/h 3 h');
  Z(2, 'Vozeći brzinom $90$ km/h, autobus pređe put za $4$ sata. Za koliko sati bi isti put prešao brzinom $120$ km/h?',
    ['$3$ sata', '$5{1|3}$ sata', '$2$ sata', '$3{1|2}$ sata'],
    [K('Dužina puta: $90 · 4 = 360$ km.'),
     K('Brzina i vreme su obrnuto proporcionalni (za isti put): $360 : 120 = 3$ sata.')],
    R((() => { const g = grafikon({ x: [0, 4, 1], y: [0, 360, 90], W: 6, H: 5, ose: ['~h', 'km'] }); return g.crtez([{ lin: [[0, 0], [g.X(4), g.Y(360)]], b: 1, debljina: 3, o: '90 km/h', oAt: [g.X(3.3), g.Y(220)] }, { lin: [[0, 0], [g.X(3), g.Y(360)]], b: 2, debljina: 3, o: '120 km/h', oAt: [g.X(1.2), g.Y(250)] }]); })()));

  proveri(36 / 6 === 6 && 36 / 18 === 2, 'površina 36: 6 × 6 → 18 × 2');
  Z(3, 'Pravougaonik ima stranice $6$ cm i $6$ cm. Koliko treba da bude druga stranica ako se jedna stranica poveća $3$ puta, a površina ostane ista?',
    ['$2$ cm', '$18$ cm', '$3$ cm', '$12$ cm'],
    [K('Površina je $6 · 6 = 36$ cm² i ne menja se: stranice su obrnuto proporcionalne ($a · b = 36$).'),
     K('Nova prva stranica: $3 · 6 = 18$ cm, pa je druga $36 : 18 = 2$ cm – tri puta manja.', ['n'])],
    G(O, [{ lin: [[0, 0], [6, 0], [6, 6], [0, 6]], zatv: 1, b: 0, gusto: 1 }, { tx: '6', at: [3, -0.6] }, { tx: '6', at: [-0.6, 3] },
      { lin: [[0, -4], [18, -4], [18, -2], [0, -2]], zatv: 1, b: 2, k: 2, id: 'n' }, { tx: '18', at: [9, -4.6], k: 2 }, { tx: '2', at: [-0.6, -3], k: 2 }], { ...bez, velicina: 340 }));

  // ════════════════ 5.5 Razmera i proporcija ════════════════
  L('Razmera i proporcija');

  proveri(12 / 3 * 4 === 16, '3 : 4 = 12 : 16');
  Z(1, 'U odeljenju je broj dečaka prema broju devojčica u razmeri $3 : 4$. Ako ima $12$ dečaka, koliko ima devojčica?',
    ['$16$', '$13$', '$9$', '$28$'],
    [K('Proporcija: ${3|4} = {12|x}$.'),
     K('Unakrsno množenje: $3x = 4 · 12 = 48$, pa je $x = 16$.'),
     K('Na traci: jedan deo je $12 : 3 = 4$ učenika, devojčica ima $4$ dela, tj. $16$.')],
    trakaDelova([3, 4], { natpisi: ['~dečaci', '~devojčice'], ispod: ['12', '?'], jedinicni: true, boje: [0, 1] }));

  proveri(4.5 * 200000 === 900000, '4,5 cm na karti 1 : 200 000 = 9 km');
  Z(1, 'Karta je urađena u razmeri $1 : 200 000$. Rastojanje između dva mesta na karti je $4,5$ cm. Koliko je to rastojanje u prirodi?',
    ['$9$ km', '$90$ km', '$0,9$ km', '$4,5$ km'],
    [K('$1$ cm na karti je $200 000$ cm $= 2$ km u prirodi.'),
     K('$4,5 · 2 = 9$ km.')],
    G(O, [...razmernik(3, 'km', { u: 1, korak: 2 }), { tx: '●', at: [0.5, 2.5], b: 1, vel: 18 }, { tx: '●', at: [5, 2.5], b: 1, vel: 18 }, { lin: [[0.5, 2.5], [5, 2.5]], isp: 1, b: 1 }, { tx: '4,5 cm', at: [2.75, 2.9] }, { tx: '1 : 200 000', at: [1.5, 0.6], vel: 14 }], { ...bez, velicina: 280 }));

  proveri(150 * 100000 / 1000000 === 15, '150 km na 1 : 1 000 000');
  Z(2, 'Na karti u razmeri $1 : 1 000 000$, koliko je dugačka duž koja predstavlja $150$ km?',
    ['$15$ cm', '$150$ cm', '$1,5$ cm', '$1 500$ cm'],
    [K('$1$ cm na karti je $1 000 000$ cm $= 10 000$ m $= 10$ km.'),
     K('$150 : 10 = 15$ cm.', ['d'])],
    R(G(O, [...razmernik(3, 'km', { u: 1, korak: 10 }), { lin: [[0, 1.6], [15, 1.6]], b: 1, debljina: 4, id: 'd' }, { tx: '15 cm = 150 km', at: [7.5, 2.1] }, { tx: '1 : 1 000 000', at: [1.5, 0.6], vel: 14 }], { ...bez, velicina: 320 })));

  proveri(1800 / 9 === 200 && 4 * 200 === 800 && 5 * 200 === 1000, '1800 u razmeri 4 : 5');
  Z(2, 'Brat i sestra dele $1 800$ dinara u razmeri $4 : 5$. Koliko dobija onaj koji dobija manje?',
    ['$800$ dinara', '$1 000$ dinara', '$900$ dinara', '$360$ dinara'],
    [K('Ukupno $4 + 5 = 9$ jednakih delova.'),
     K('Jedan deo: $1 800 : 9 = 200$ dinara.'),
     K('Manji deo: $4 · 200 = 800$, veći: $5 · 200 = 1 000$ dinara.')],
    trakaDelova([4, 5], { ispod: ['4 · 200', '5 · 200'], jedinicni: true, k: 2, iznad: '1 800' }));

  proveri(140 / 7 === 20 && 3 * 20 === 60 && 4 * 20 === 80, '140 u razmeri 3 : 4');
  Z(2, 'Poglavlje udžbenika ima $140$ zadataka u dve lekcije, a brojevi zadataka su u razmeri $3 : 4$. Koliko zadataka ima u svakoj lekciji?',
    ['$60$ i $80$', '$70$ i $70$', '$40$ i $100$', '$56$ i $84$'],
    [K('$3 + 4 = 7$ delova, jedan deo je $140 : 7 = 20$ zadataka.'),
     K('Lekcije: $3 · 20 = 60$ i $4 · 20 = 80$. Provera: ${60|80} = {3|4}$ ✓')],
    R(trakaDelova([3, 4], { ispod: ['60', '80'], jedinicni: true, iznad: '140' })));

  proveri(120 / 8 === 15 && 3 * 15 === 45 && 5 * 15 === 75, '120° u razmeri 3 : 5');
  Z(2, 'Ugao od $120°$ podeljen je polupravom na dva ugla u razmeri $3 : 5$. Koliki je manji ugao?',
    ['$45°$', '$75°$', '$40°$', '$36°$'],
    [K('$3 + 5 = 8$ delova, jedan deo je $120° : 8 = 15°$.'),
     K('Manji ugao: $3 · 15° = 45°$, veći: $5 · 15° = 75°$.', ['u1'])],
    G({ O: [0, 0], A: [5, 0], C: [r(5 * Math.cos(Math.PI / 4)), r(5 * Math.sin(Math.PI / 4))], B: [r(5 * Math.cos((2 * Math.PI) / 3)), r(5 * Math.sin((2 * Math.PI) / 3))] },
      [{ d: 'OA', b: 0 }, { d: 'OB', b: 0 }, { d: 'OC', b: 1, isp: 1 }, { u: 'AOC', o: '?', b: 1, id: 'u1' }, { u: 'COB', b: 2 }, { tx: '120°', at: [-0.2, -0.9] }],
      { bezImena: ['A', 'B', 'C'], velicina: 260 }));

  proveri(180 / 9 === 20 && 2 * 20 === 40 && 3 * 20 === 60 && 4 * 20 === 80, '180 u razmeri 2 : 3 : 4');
  Z(3, 'Tri drugarice dele $180$ oraha. Ana i Bojana dele u razmeri $2 : 3$, a Bojana i Ceca u razmeri $3 : 4$. Koliko oraha dobija Ceca?',
    ['$80$', '$60$', '$40$', '$90$'],
    [K('Bojanin deo je u obe razmere „$3$“, pa je $a : b : c = 2 : 3 : 4$.'),
     K('$2 + 3 + 4 = 9$ delova, jedan deo je $180 : 9 = 20$ oraha.'),
     K('Ana $40$, Bojana $60$, Ceca $4 · 20 = 80$ oraha. Provera: $40 + 60 + 80 = 180$ ✓')],
    trakaDelova([2, 3, 4], { natpisi: ['~Ana', '~Bojana', '~Ceca'], ispod: ['40', '60', '80'], jedinicni: true, k: 3 }));

  proveri(500 / 50 === 10 && 400 / 50 === 8, 'soba 5 × 4 m u razmeri 1 : 50');
  Z(2, 'Soba je dugačka $5$ m i široka $4$ m. Koje su njene dimenzije na planu u razmeri $1 : 50$?',
    ['$10$ cm i $8$ cm', '$20$ cm i $16$ cm', '$1$ cm i $0,8$ cm', '$25$ cm i $20$ cm'],
    [K('Na planu je sve $50$ puta manje. Pretvorimo u centimetre: $5$ m $= 500$ cm, $4$ m $= 400$ cm.'),
     K('$500 : 50 = 10$ cm i $400 : 50 = 8$ cm. ($20$ i $16$ cm bi bilo u razmeri $1 : 25$.)')],
    R(G(O, [{ lin: [[0, 0], [10, 0], [10, 8], [0, 8]], zatv: 1, b: 0 }, { tx: '10 cm', at: [5, -0.8] }, { tx: '8 cm', at: [11.4, 4] }, { tx: '1 : 50', at: [5, 4], vel: 18 }], { ...bez, velicina: 240 })));

  Z(3, 'Na pravoj su redom tačke $A$, $B$ i $C$, i važi $AB : BC = 4 : 3$. Kolika je razmera $AC : BC$?',
    ['$7 : 3$', '$4 : 7$', '$3 : 7$', '$7 : 4$'],
    [K('Neka je $AB = 4$ dela i $BC = 3$ dela.'),
     K('Tada je $AC = AB + BC = 7$ delova, pa je $AC : BC = 7 : 3$.', ['ac'])],
    G({ A: [0, 0], B: [8, 0], C: [14, 0], a: [0, -0.9], c: [14, -0.9] }, [{ d: 'AB', b: 1, debljina: 5, o: '4' }, { d: 'BC', b: 2, debljina: 5, o: '3' }, { tacka: 'ABC', b: 3 }, { d: 'ac', b: 3, id: 'ac', k: 2, str: 1, o: '7' }], { velicina: 320 }));

  proveri((6 + 8 + 10) * 3 === 72, 'obim 24 cm na 1 : 300 000 = 72 km');
  Z(3, 'Na karti razmere $1 : 300 000$ mesta $A$, $B$ i $C$ su udaljena $AB = 6$ cm, $BC = 8$ cm i $CA = 10$ cm. Koliki je zbir ta tri rastojanja u prirodi?',
    ['$72$ km', '$7,2$ km', '$24$ km', '$720$ km'],
    [K('Na karti: $6 + 8 + 10 = 24$ cm.'),
     K('$1$ cm na karti $= 300 000$ cm $= 3$ km u prirodi.'),
     K('$24 · 3 = 72$ km.')],
    G({ A: [0, 0], B: [6, 0], C: [6, 8] }, [{ p: 'ABC', b: 0, prazno: 1 }, { d: 'AB', o: '6 cm' }, { d: 'BC', o: '8 cm' }, { d: 'CA', o: '10 cm' }, { tacka: 'ABC', b: 1 }], { velicina: 220 }));
};

module.exports.crtezi = crtezi;
