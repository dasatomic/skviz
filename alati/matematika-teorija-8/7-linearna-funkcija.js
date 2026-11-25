// Lekcije 6.1–6.9 (2. deo udžbenika, „Linearna funkcija“): pojam funkcije, y = kx + n, primeri,
// grafik, karakteristične prave, nule i znak, rast i opadanje, implicitni oblik, čitanje grafika.
// Pitanja su sopstvenim rečima i sopstvenim brojevima; crteži su medij „geo“ (koordinatne ravni,
// dijagrami preslikavanja, tabele). Oznake osa su 'x' i 'y'; reči na osama idu sa „~“.
// Crteži uz pitanja ne smeju da odaju odgovor: kad je odgovor broj, osa je bez brojeva (brojevi: 0)
// a brojevi se vide tek u medijiOdgovora.
module.exports = ({ L, Q, U, S, G, proveri, r }) => {
  const V = (x = {}) => ({ velicina: 240, ...x });

  // ── pomoćni crteži ──
  // koordinatna ravan [x0,x1]×[y0,y1]; o: { t: imenovane tačke, brojevi: 0, ose, podela, bez, velicina }
  const ravan = (x0, x1, y0, y1, e = [], o = {}) => G(o.t || {}, [{
    mreza: [x0, x1, y0, y1], ose: o.ose || ['x', 'y'],
    ...(o.brojevi === 0 ? { brojevi: 0 } : {}), ...(o.podela ? { podela: o.podela } : {}),
  }, ...e], V({ velicina: o.velicina || 240, ...(o.bez ? { bezImena: o.bez } : {}) }));
  // prava y = kx + n, isečena na pravougaoniku [X0,X1]×[Y0,Y1]
  const pr = (k, n, X0, X1, Y0, Y1, o = {}) => {
    let a = X0, b = X1;
    if (k !== 0) { const p = (Y0 - n) / k, q = (Y1 - n) / k; a = Math.max(X0, Math.min(p, q)); b = Math.min(X1, Math.max(p, q)); }
    return { lin: [[r(a), r(k * a + n)], [r(b), r(k * b + n)]], b: 1, debljina: 3, ...o };
  };
  // duž ili deo prave između dve tačke
  const dz = (p, q, o = {}) => ({ lin: [p, q], b: 1, debljina: 3, ...o });
  // strelica od p ka q
  const str = (p, q, o = {}) => ({ lin: [p, q], str: 1, b: 1, debljina: 2.5, ...o });
  const tx = (t, at, o = {}) => ({ tx: t, at, ...o });
  const tk = (n, o = {}) => ({ tacka: n, b: 1, ...o });
  // trougao nagiba: vodoravna kateta 1 od tačke (x0, n), uspravna k; labele = [oznaka1, oznakak]
  const nagib = (k, n, o = {}) => {
    const x0 = o.x0 ?? 0;
    return [
      { lin: [[x0, n], [x0 + 1, n], [x0 + 1, r(n + k)]], b: 2, debljina: 2.5 },
      ...(o.labele ? [tx(o.labele[0], [r(x0 + 0.5), r(n - 0.45)]), tx(o.labele[1], [r(x0 + 1.45), r(n + k / 2)])] : []),
    ];
  };
  // elipsa (kontura) sa centrom (cx, cy)
  const elipsa = (cx, cy, rx, ry, o = {}) => {
    const p = [];
    for (let i = 0; i <= 48; i++) { const a = (2 * Math.PI * i) / 48; p.push([r(cx + rx * Math.cos(a)), r(cy + ry * Math.sin(a))]); }
    return { lin: p, zatv: 1, prazno: 1, b: 4, debljina: 2, ...o };
  };
  // dijagram preslikavanja: skup A (levo), skup B (desno); veze = [[i, j], …] su indeksi elemenata
  const preslik = (A, B, veze, o = {}) => {
    const t = {}, e = [];
    const y = (i, m) => ((m - 1) / 2 - i) * 0.9;
    const ryA = Math.max(0.6, ((A.length - 1) * 0.9) / 2 + 0.5), ryB = Math.max(0.6, ((B.length - 1) * 0.9) / 2 + 0.5);
    e.push(elipsa(-2, 0, 1.1, ryA), elipsa(2, 0, 1.1, ryB));
    e.push(tx('A', [-2, r(ryA + 0.35)], { b: 1 }), tx('B', [2, r(ryB + 0.35)], { b: 1 }));
    A.forEach((s, i) => { t['a' + i] = [-2, r(y(i, A.length))]; e.push(tk('a' + i), tx(String(s), [-2.6, r(y(i, A.length))])); });
    B.forEach((s, i) => { t['b' + i] = [2, r(y(i, B.length))]; e.push(tk('b' + i), tx(String(s), [2.6, r(y(i, B.length))])); });
    for (const [i, j] of veze) e.push(str([-1.88, r(y(i, A.length))], [1.88, r(y(j, B.length))], { b: o.b ?? 1 }));
    return G(t, e, V({ velicina: 250, bezImena: Object.keys(t) }));
  };
  // tabela: redovi = [['x', '0', '1'], ['y', '1', '3']]
  const tabela = (redovi) => {
    const e = [], w = 1.7, h = 0.7, n = redovi.length, m = redovi[0].length;
    for (let i = 0; i <= n; i++) e.push({ lin: [[0, -i * h], [m * w, -i * h]], b: 4, debljina: 1.2 });
    for (let j = 0; j <= m; j++) e.push({ lin: [[j * w, 0], [j * w, -n * h]], b: 4, debljina: 1.2 });
    redovi.forEach((red, i) => red.forEach((c, j) => e.push(tx(c, [r(j * w + w / 2), r(-i * h - h / 2 - 0.1)]))));
    return G({}, e, V({ velicina: 240 }));
  };
  const parab = (xs, f, o = {}) => ({ lin: xs.map((x) => [x, r(f(x))]), b: 1, debljina: 3, ...o });
  const rang = (a, b, c) => { const o = []; for (let x = a; x <= b + 1e-9; x += c) o.push(r(x)); return o; };

  // provere računa (gradnja pukne ako ne važi)
  proveri(3 * 3 - 5 === 4 && 3 * 4 - 6 === 6, 'vrednosti funkcija');
  proveri(3 * 2 - 2 === 4 && 3 * 0 - 2 === -2 && 3 * 3 - 2 === 7, 'f(x) = 3x − 2');
  proveri(2 * 3 + 1 === 7 && -3 * 2 + 1 === -5, 'y = 2x + 1');
  proveri(15 * 0 + 0 === 0 && 300 - 2 * 15 === 270 && 300 - 2 * 150 === 0, 'sveća');
  proveri(1000 - 25 * 40 === 0 && 80 - 2 * 10 === 60, 'bazen i voda');
  proveri(500 * 8 + 1000 === 5000 && 15 + 5 * 2 === 25, 'krojač i telefon');
  proveri(2 + 6 * 3 === 20 && 120 * 3 - 80 === 280 && 40000 + 500 * 3 === 41500, 'taksi i primeri');
  proveri((5 - 1) / (3 - 1) === 2 && 2 * 3 + (-2) === 4, 'nagib kroz dve tačke');
  proveri(3 * 4 - 6 === 6 && 3 * 3 + 2 === 11 && 2 * 3 - 8 + 4 === 2, 'računi grafika');
  proveri(2 * 3 - 5 === 1 && 0.5 * 4 - 2 === 0 && 2 * 0 - 4 === -4, 'presek sa osama');
  proveri(1 + 0.5 * 4 === 3 && 300 - 2 * 60 === 180 && -2 * 4 + 6 === -2, 'čitanje grafika');
  proveri(3 * 2 - 6 === 0 && 2 * 0 + 3 === 3 && 2 * 3 - 4 === 2, 'prave i tačke');
  proveri(2 * 3 - 3 === 3 && 6 * 3 - 6 === 12, 'sistem za x = 3');
  proveri(-4 * 3 + 12 === 0 && -2 * 4 + 8 === 0 && 2 * 0 + 1 === 1, 'nule');
  proveri(6 - 3 * 1 - 6 + 3 === 0 && 2 - 5 + 3 === 0, 'prava 2 − 5 + n');
  proveri(3 * 3 - 5 - 4 === 0 && 1 + 2 - 3 === 0 && 2 * 1 + 2 - 4 === 0, 'implicitni oblik');
  proveri(3 * 2 - 6 === 0 && 6 - 6 === 0 && 2 * 3 + 3 * 0 - 6 === 0, 'presek x-ose');
  proveri(2 * 1 + 2 - 4 === 0 && (2 * 0 + 2) === 2, 'tačka na pravoj');
  proveri(5 * 1 - 4 === 1 && 2 * 0 + 2 > 0 && -2 * 0 + 8 > 0, 'znak');
  proveri(3 * 4 - 6 === 6 && 3 * 2 - 6 === 0, 'nula i vrednost');
  proveri(1000 * 10 - 3000 === 7000 && 1000 * 4 - 3000 === 1000, 'prihod malina');

  // ════════════════ 6.1 Pojam funkcije ════════════════
  L('Pojam funkcije');

  Q(1, 'Funkcija je pravilo koje svakoj vrednosti $x$ pridružuje…',
    ['tačno jednu vrednost $y$', 'dve ili više vrednosti $y$', 'nijednu vrednost $y$', 'bilo koju vrednost $x$'],
    'Reč „funkcija“ potiče od latinske reči functio, što znači izvršavanje posla. Kao automat za sok: za svaki novčić izbaci tačno jednu flašicu.', 'funkcija',
    { mediji: preslik([1, 2, 3], [2, 4, 6], [[0, 0], [1, 1], [2, 2]]) });

  Q(2, 'Da li je ovo preslikavanje funkcija?',
    ['Ne, jer element 1 ima dve slike', 'Da, jer svaki element ima bar jednu sliku', 'Ne, jer skup $B$ ima više elemenata', 'Da, jer broj strelica odgovara broju elemenata'],
    'Funkcija mora da dodeli tačno jednu sliku svakom elementu, ali više elemenata može imati istu sliku. Zato strelice iz različitih elemenata smeju da stignu u isti element skupa $B$.', 'preslikati',
    { mediji: preslik([1, 2, 3], [2, 4, 6], [[0, 0], [0, 1], [1, 1], [2, 2]]) });

  Q(3, 'Da li je $y = x²$ funkcija po $x$?',
    ['Da, jer za svako $x$ postoji tačno jedno $y$', 'Ne, jer grafik nije prava linija', 'Ne, jer dva različita $x$ daju isto $y$', 'Da, jer grafik liči na krug'],
    'Grafik funkcije ne mora biti prava linija. Parabola $y = x²$ je funkcija, jer za svaki broj $x$ postoji tačno jedan kvadrat. Ono što nije dozvoljeno je da jedno $x$ ima dva različita $y$.', 'parabola',
    { mediji: ravan(-3, 3, -1, 7, [parab([-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5], (x) => x * x)], { brojevi: 0 }) });

  Q(2, 'Na crtežu je prava $x = 2$. Da li je ona grafik funkcije?',
    ['Ne, za $x = 2$ prava ima beskonačno mnogo vrednosti $y$', 'Da, jer je to prava linija', 'Da, jer prolazi kroz tačku $(2, 0)$', 'Ne, jer seče $x$-osu'],
    'Ovo je jedan od najčešćih pogrešnih zaključaka: prava je prava linija, ali nije grafik funkcije. Za $x = 2$ sve tačke prave imaju istu apscisu, a različite ordinate.', 'vertikalna',
    { mediji: ravan(-4, 4, -4, 4, [dz([2, -4], [2, 4], { b: 1, debljina: 3 }), tx('x = 2', [2.4, 3.5])], { brojevi: 0 }) });

  Q(1, 'Funkcija je $f(x) = 3x − 2$. Kolika je vrednost $f(2)$?',
    ['4', '3', '8', '−4'],
    'Oznaka $f(2)$ čita se „f od dva“ i znači: vrednost funkcije $f$ za $x = 2$. Računamo $3 · 2 − 2 = 4$. Vrednost $f(2)$ nije isto što i $f$ pomnoženo sa 2.', 'vrednost',
    { mediji: tabela([['x', '0', '1', '2', '3'], ['f(x)', '−2', '1', '?', '7']]) });

  Q(2, 'Funkcija je data tabelom. Koja formula joj odgovara?',
    ['$y = 2x − 1$', '$y = 2x + 1$', '$y = −2x − 1$', '$y = x − 2$'],
    'Dovoljno je proveriti jednu vrednost: za $x = 0$ je $y = −1$, što odgovara i prvoj i trećoj formuli, pa treba proveriti još jednu vrednost. Proveri i ostale vrednosti – tako se najbrže otklanjaju lažne formule.', 'tabela',
    { mediji: tabela([['x', '−1', '0', '1', '2'], ['y', '−3', '−1', '1', '3']]) });

  Q(2, 'Tabela: $x = 1, 2, 3$ i $f(x) = 5, 5, 8$. Da li je to funkcija?',
    ['Da, dve različite vrednosti $x$ mogu imati istu vrednost $f(x)$', 'Ne, jer se vrednost 5 ponavlja', 'Ne, jer $f(3)$ nije jednako $f(1)$', 'Da, jer su sve vrednosti različite'],
    'Ponavljanje vrednosti $y$ nije problem; problem je samo kad jedno $x$ ima dve vrednosti. Zato je tabela funkcija, iako se broj 5 pojavljuje dva puta.', 'slika',
    { mediji: tabela([['x', '1', '2', '3'], ['f(x)', '5', '5', '8']]) });

  Q(1, 'Kako se zove skup svih vrednosti $x$ za koje je funkcija definisana?',
    ['oblast definisanosti', 'skup vrednosti funkcije', 'skup nula funkcije', 'skup grafika'],
    'Oblast definisanosti je skup dozvoljenih ulaza. Kod $y = \\frac{1}{x}$ broj $0$ ne pripada oblasti definisanosti, jer deljenje nulom nije moguće.', 'oblast',
    { mediji: preslik([1, 2, 3, 4], [2, 4, 6], [[0, 0], [1, 1], [2, 2]]) });

  Q(1, 'Koja promenljiva je zavisna u $y = 3x + 1$?',
    ['$y$', '$x$', '$3$', '$1$'],
    'Zavisna promenljiva zavisi od izbora nezavisne: mi biramo $x$, a $y$ se računa iz $x$. Zato se kaže da $y$ „zavisi“ od $x$.', 'zavisna',
    { mediji: tabela([['x', '0', '1', '2'], ['y', '1', '4', '7']]) });

  Q(1, 'Koji je grafik funkcije $y = 2$?',
    ['prava paralelna sa $x$-osom', 'prava paralelna sa $y$-osom', 'prava koja prolazi kroz koordinatni početak', 'prava koja seče $x$-osu u tački $2$'],
    'Vrednost $y$ ne menja se kad se menja $x$, pa su sve tačke na istoj visini. Takva prava je paralelna sa $x$-osom. Ona nikad ne seče $x$-osu.', 'paralelna',
    { mediji: ravan(-4, 4, -1, 5, [pr(0, 2, -4, 4, -1, 5, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Telefonski račun za poziv od $t$ minuta je $c = 15 + 5t$ dinara. Koja promenljiva je zavisna?',
    ['cena $c$', 'trajanje $t$', 'oba su nezavisna', 'nijedna'],
    'Cenu računamo iz trajanja, zato je cena zavisna promenljiva. Trajanje biramo sami, pa je nezavisna. Tabela pokazuje isti zakon: svaki minut poveća cenu za 5 dinara.', 'račun',
    { mediji: tabela([['t (min)', '1', '2', '3'], ['c (din)', '20', '25', '30']]) });

  Q(3, 'Date su funkcije $f(x) = x + 2$ i $g(x) = 2x − 1$. Koliko je $f(3) + g(2)$?',
    ['8', '7', '9', '6'],
    'Oznake $f$ i $g$ su dogovor. Oznaku $f(x)$ uveo je Ojler u 18. veku, a nazivi funkcija mogu biti bilo koja slova. Računamo $f(3) = 5$ i $g(2) = 3$.', 'zbir',
    { mediji: ravan(-2, 6, -3, 7, [pr(1, 2, -2, 6, -3, 7, { b: 1 }), pr(2, -1, -2, 6, -3, 7, { b: 2 }), tx('f', [5.3, 6.6], { b: 1 }), tx('g', [4.2, 7.1], { b: 2 })], { brojevi: 0 }) });

  Q(3, 'Za koje $x$ je vrednost funkcije $f(x) = 3x − 5$ jednaka $4$?',
    ['$x = 3$', '$x = 9$', '$x = −3$', '$x = \\frac{1}{3}$'],
    'Iz $3x − 5 = 4$ je $3x = 9$, pa je $x = 3$. Ako zaboravimo da podelimo sa 3, dobijamo $x = 9$.', 'jednačina',
    { mediji: ravan(-1, 5, -6, 6, [pr(3, -5, -1, 5, -6, 6, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Funkcija $f$ zadovoljava $f(2) = 7$. Koja tvrdnja je tačna?',
    ['Za $x = 2$ funkcija daje $y = 7$', 'Za $y = 2$ funkcija daje $x = 7$', 'Za $x = 7$ funkcija daje vrednost $2$', 'Broj $7$ je nezavisna promenljiva'],
    'Oznaka $f(2) = 7$ znači da je $x = 2$ ulaz, a $y = 7$ izlaz. Zamena uloga $x$ i $y$ je najčešća greška pri čitanju ove oznake.', 'argument',
    { mediji: preslik([2], [7], [[0, 0]]) });

  U(2, 'Koja od ovih zavisnosti NIJE funkcija po $x$?',
    ['$x = y²$', '$y = x + 1$', '$y = 2x$', '$y = |x|$'],
    'Kod $x = y²$ za $x = 4$ dobijamo $y = 2$ i $y = −2$, dakle dve vrednosti. Ostale su funkcije: svakom $x$ odgovara tačno jedno $y$.', 'Grafik $x = y²$ nije funkcija $y = f(x)$, ali jeste funkcija po $y$: za svako $y$ postoji tačno jedno $x$.', 'parabola',
    { mediji: ravan(-1, 7, -3, 3, [{ lin: [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5].map((y) => [r(y * y), y]), b: 1, debljina: 3 }], { brojevi: 0 }) });

  S(1, 'Poveži pojam i njegovo značenje',
    [['funkcija', 'svakom $x$ odgovara tačno jedno $y$'], ['nezavisna promenljiva', '$x$ u zapisu $y = f(x)$'], ['zavisna promenljiva', '$y$ u zapisu $y = f(x)$'], ['oblast definisanosti', 'skup svih dozvoljenih vrednosti $x$']],
    'Pojmovi se najlakše pamte uz primer: u $y = 3x + 1$ biramo $x$, a $y$ se izračunava.', 'pojmovi',
    { mediji: tabela([['x', '0', '1', '2'], ['y', '1', '4', '7']]) });

  // ════════════════ 6.2 Linearna funkcija y = kx + n ════════════════
  L('Linearna funkcija y = kx + n');

  Q(1, 'U linearnoj funkciji $y = kx + n$, šta predstavlja $n$?',
    ['odsečak na $y$-osi', 'koeficijent pravca', 'nulu funkcije', 'vrednost za $x = 1$'],
    'Slobodan član $n$ je vrednost $y$ kad je $x = 0$, pa je to tačka u kojoj grafik seče $y$-osu. Taj odsečak se često zove „početna vrednost“.', 'odsečak',
    { mediji: ravan(-3, 3, -1, 7, [pr(2, 3, -3, 3, -1, 7, { b: 1 })], { brojevi: 0 }), medijiOdgovora: ravan(-3, 3, -1, 7, [pr(2, 3, -3, 3, -1, 7, { b: 1 }), tk('N', { b: 3 })], { t: { N: [0, 3] }, bez: ['N'] }) });

  Q(1, 'Kako se zove broj $k$ u $y = kx + n$?',
    ['koeficijent pravca (nagib)', 'slobodan član', 'odsečak na $y$-osi', 'nula funkcije'],
    'Koeficijent $k$ pokazuje koliko se $y$ promeni kad $x$ poraste za 1. Zato je to nagib prave: što je veće $|k|$, to je grafik strmiji.', 'nagib',
    { mediji: ravan(-1, 4, -1, 6, nagib(2, 1, { labele: ['1', '?'] }), { brojevi: 0 }) });

  Q(1, 'Grafik funkcije $y = kx + n$ prolazi kroz tačku $(0, −2)$. Koliko je $n$?',
    ['−2', '2', '0', '−1'],
    'Tačka na $y$-osi ima apscisu $0$, pa je $y = n$. Zato je $n$ upravo ordinata te tačke, bez obzira na $k$.', 'tačka',
    { mediji: ravan(-3, 3, -5, 4, [pr(3, -2, -3, 3, -5, 4, { b: 1 })], { brojevi: 0 }) });

  Q(1, 'Koja funkcija ima $k = −3$ i $n = 5$?',
    ['$y = −3x + 5$', '$y = 5x − 3$', '$y = 3x − 5$', '$y = −5x + 3$'],
    'Prvo se piše koeficijent uz $x$, pa slobodan član: $y = kx + n$. Zamena $k = −3$ i $n = 5$ daje $y = −3x + 5$.', 'zamena',
    { mediji: ravan(-1, 4, -2, 8, nagib(-3, 5, { labele: ['1', '?'] }), { brojevi: 0 }) });

  Q(2, 'U kojoj tački grafik funkcije $y = −2x + 6$ seče $y$-osu?',
    ['$(0, 6)$', '$(6, 0)$', '$(0, −2)$', '$(−2, 6)$'],
    'Presek sa $y$-osom ima $x = 0$, pa je $y = n = 6$. Tačka $(6, 0)$ bi bila presek sa $x$-osom, a ne sa $y$-osom.', 'odsečak',
    { mediji: ravan(-1, 5, -2, 8, [pr(-2, 6, -1, 5, -2, 8, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Kad se u $y = kx + n$ poveća $k$ (za $k > 0$), a $n$ ostane isto, šta se dešava sa grafikom?',
    ['postaje strmiji', 'pomera se naniže', 'postaje horizontalan', 'seče $x$-osu bliže nuli'],
    'Nagib puta meri se procentom: nagib $10\\%$ znači da se na 100 m puta penjemo 10 m. Put sa nagibom $20\\%$ je dva puta strmiji. Pomeranje sa $n$ nema veze sa strminom.', 'strmina',
    { mediji: ravan(-3, 3, -2, 6, [pr(1, 1, -3, 3, -2, 6, { b: 1 }), pr(3, 1, -3, 3, -2, 6, { b: 2 }), tx('a', [2.2, 3.4]), tx('b', [1.2, 5.6], { b: 2 })], { brojevi: 0 }) });

  Q(2, 'Koja je jednačina prave sa $k = −1$ i $n = 3$?',
    ['$y = −x + 3$', '$y = x − 3$', '$y = 3x − 1$', '$y = −3x + 1$'],
    'Koeficijent $k$ je broj uz $x$, a $n$ je slobodan član. Zato $k = −1$ daje $−x$, a $n = 3$ daje $+3$ na kraju.', 'jednačina',
    { mediji: ravan(-1, 4, -2, 6, nagib(-1, 3, { labele: ['1', '?'] }), { brojevi: 0 }) });

  Q(2, 'Funkcija $y = −x + n$ prolazi kroz tačku $(2, 1)$. Koliko je $n$?',
    ['3', '1', '−1', '2'],
    'Zamenimo $x = 2$ i $y = 1$: $1 = −2 + n$, pa je $n = 3$. Provera: za $x = 2$ je $y = −2 + 3 = 1$.', 'zamena',
    { mediji: ravan(-2, 5, -3, 6, [pr(-1, 3, -2, 5, -3, 6, { b: 1 }), tk('M', { b: 1 })], { t: { M: [2, 1] }, bez: ['M'] , brojevi: 0 }),
      medijiOdgovora: ravan(-2, 5, -3, 6, [pr(-1, 3, -2, 5, -3, 6, { b: 1 }), tk('M', { b: 1 })], { t: { M: [2, 1] }, bez: ['M'] }) });

  Q(3, 'Prava $y = kx + n$ prolazi kroz tačke $(1, 4)$ i $(3, 8)$. Koliko je $k$?',
    ['2', '4', '−2', '$\\frac{1}{2}$'],
    'Koeficijent je količnik promene $y$ i promene $x$: $k = \\frac{8 − 4}{3 − 1} = \\frac{4}{2} = 2$. Tako se nagib računa iz bilo koje dve tačke prave.', 'nagib',
    { mediji: ravan(0, 4, 2, 9, [dz([1, 4], [3, 8], { b: 1 }), tk('A', { b: 1 }), tk('B', { b: 1 })], { t: { A: [1, 4], B: [3, 8] }, brojevi: 0 }),
      medijiOdgovora: ravan(0, 4, 2, 9, [dz([1, 4], [3, 8], { b: 1 }), tk('A', { b: 1 }), tk('B', { b: 1 }), dz([1, 4], [3, 4], { b: 2, isp: 1 }), dz([3, 4], [3, 8], { b: 2, isp: 1 }), tx('2', [2, 3.5]), tx('4', [3.3, 6])], { t: { A: [1, 4], B: [3, 8] }, brojevi: 0 }) });

  Q(3, 'Prava ima $k = 3$ i $n = −6$. Kolika je vrednost $y$ za $x = 4$?',
    ['6', '18', '−6', '−18'],
    'Zamenimo: $y = 3 · 4 − 6 = 12 − 6 = 6$. Ako zaboravimo slobodan član, dobijamo 12, a ako zamenimo znak $n$, dobijamo 18.', 'vrednost',
    { mediji: ravan(-1, 6, -8, 8, nagib(3, -6, { labele: ['1', '3'] }), { brojevi: 0 }) });

  Q(3, 'Prava prolazi kroz tačku $(0, 3)$ i ima $k = −2$. U kojoj tački seče $x$-osu?',
    ['$(\\frac{3}{2}, 0)$', '$(−\\frac{3}{2}, 0)$', '$(3, 0)$', '$(0, 3)$'],
    'Presek sa $x$-osom: $y = 0$ pa $0 = −2x + 3$, odakle je $x = \\frac{3}{2}$. Tačka $(0, 3)$ je presek sa $y$-osom, pa nije tačna.', 'presek',
    { mediji: ravan(-1, 4, -2, 6, [pr(-2, 3, -1, 4, -2, 6, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Funkcija $y = −5x + n$ prolazi kroz tačku $(1, 0)$. Koliko je $n$?',
    ['5', '−5', '0', '−1'],
    'Iz $0 = −5 · 1 + n$ dobijamo $n = 5$. Tačka $(1, 0)$ je presek sa $x$-osom, pa se $n$ dobija kad se $x$ zameni sa 1.', 'zamena',
    { mediji: ravan(-1, 3, -2, 7, [pr(-5, 5, -1, 3, -2, 7, { b: 1 }), tk('M', { b: 1 })], { t: { M: [1, 0] }, bez: ['M'], brojevi: 0 }) });

  Q(1, 'Koja je funkcija sa $k = 1$ i $n = 0$?',
    ['$y = x$', '$y = 1$', '$y = 0$', '$y = x + 1$'],
    'Kad je $k = 1$ i $n = 0$, dobijamo $y = 1 · x + 0 = x$. To je prava koja prolazi kroz koordinatni početak pod uglom od 45° u odnosu na osu $x$.', 'jedinica',
    { mediji: ravan(-3, 3, -1, 6, nagib(1, 0, { labele: ['1', '1'] }), { brojevi: 0 }) });

  Q(3, 'Prava ima $k = 2$ i seče $x$-osu u tački $x = 3$. Koliko je $n$?',
    ['−6', '6', '−3', '3'],
    'Na $x$-osi je $y = 0$, pa je $0 = 2 · 3 + n$ i $n = −6$. Prava se tada seče sa $y$-osom u tački $(0, −6)$.', 'presek',
    { mediji: ravan(-1, 6, -8, 4, [pr(2, -6, -1, 6, -8, 4, { b: 1 }), tk('X', { b: 1 })], { t: { X: [3, 0] }, bez: ['X'], brojevi: 0 }) });

  U(2, 'Koja od ovih funkcija NIJE linearna?',
    ['$y = x²$', '$y = 3x − 2$', '$y = −x$', '$y = \\frac{1}{2}x + 4$'],
    'Linearna funkcija ima oblik $y = kx + n$, gde je $x$ na prvom stepenu. Kod $y = x²$ promenljiva je na drugom stepenu, pa grafik nije prava linija.', 'Reč „linearna“ dolazi od latinske reči linea, što znači linija. Zato grafik linearne funkcije uvek bude prava.', 'oblik',
    { mediji: ravan(-3, 3, -1, 8, [parab([-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5], (x) => x * x)], { brojevi: 0 }) });

  S(2, 'Poveži oznaku i njeno značenje u $y = kx + n$',
    [['$k$', 'koeficijent pravca'], ['$n$', 'odsečak na $y$-osi'], ['$k = 0$', 'konstantna funkcija'], ['$n = 0$', 'prolazi kroz koordinatni početak']],
    'Dva parametra opisuju celu pravu: $k$ određuje nagib, a $n$ visinu gde prava seče $y$-osu.', 'oznake',
    { mediji: ravan(-1, 4, -2, 6, nagib(2, 1, { labele: ['1', '?'] }), { brojevi: 0 }) });

  // ════════════════ 6.3 Primeri linearnih funkcija ════════════════
  L('Primeri linearnih funkcija');

  Q(1, 'Taksi naplaćuje start 150 dinara i 60 dinara po kilometru. Koja funkcija daje cenu $c$ za $x$ kilometara?',
    ['$c = 60x + 150$', '$c = 150x + 60$', '$c = 60x$', '$c = 150x$'],
    'Start je fiksni deo, pa je to slobodan član $n$. Cena po kilometru je koeficijent $k$. Bez starta bi grafik prolazio kroz koordinatni početak.', 'taksi',
    { mediji: ravan(0, 10, 0, 800, [dz([0, 150], [10, 750], { b: 1 })], { ose: ['~km', '~din'], podela: [1, 200] }) });

  Q(1, 'Sveća dužine 30 cm gori 2 mm za svaki minut. Koja funkcija daje dužinu $d$ u milimetrima posle $t$ minuta?',
    ['$d = 300 − 2t$', '$d = 300 + 2t$', '$d = 30 − 2t$', '$d = 2t$'],
    'Sveća počinje sa 300 mm, pa je slobodan član $300$. Svaki minut skrati je za 2 mm, pa je koeficijent $−2$. Posle 150 minuta sveća je potpuno dogorela.', 'sveća',
    { mediji: ravan(0, 150, 0, 300, [dz([0, 300], [150, 0], { b: 1 })], { ose: ['~min', '~mm'], podela: [30, 60] }) });

  Q(2, 'Bazen ima 1000 litara vode, a iz njega istekne 25 litara za minut. Koja funkcija daje količinu vode $V$ posle $t$ minuta?',
    ['$V = 1000 − 25t$', '$V = 1000 + 25t$', '$V = 25t$', '$V = 25 − 1000t$'],
    'Voda se troši, pa je koeficijent negativan: $−25$. Početna količina je slobodan član $1000$. Posle 40 minuta bazen je prazan.', 'bazen',
    { mediji: ravan(0, 40, 0, 1000, [dz([0, 1000], [40, 0], { b: 1 })], { ose: ['~min', '~l'], podela: [5, 200] }) });

  Q(2, 'Voda se hladi $2 °C$ svakog minuta, a počinje sa $80 °C$. Kolika je temperatura posle $10$ minuta?',
    ['$60 °C$', '$70 °C$', '$80 °C$', '$20 °C$'],
    'Posle $10$ minuta voda je izgubila $2 · 10 = 20$ stepeni, pa je $80 − 20 = 60 °C$. Ovakav pad temperature je linearan samo dok se voda ne približi temperaturi okoline.', 'hlađenje',
    { mediji: ravan(0, 30, 0, 90, [dz([0, 80], [30, 20], { b: 1 })], { ose: ['~min', '~°C'], podela: [5, 20], brojevi: 0 }),
      medijiOdgovora: ravan(0, 30, 0, 90, [dz([0, 80], [30, 20], { b: 1 })], { ose: ['~min', '~°C'], podela: [5, 20] }) });

  Q(2, 'Krojač naplaćuje 500 dinara po košulji i 1000 dinara fiksnog troška. Koliko košta izrada 8 košulja?',
    ['5 000 din', '4 000 din', '4 500 din', '9 000 din'],
    'Funkcija je $c = 500n + 1000$, pa je za $n = 8$: $c = 4000 + 1000 = 5000$ dinara. Ako zaboravimo fiksni trošak, dobijamo 4000 dinara.', 'krojač',
    { mediji: tabela([['košulja (n)', '1', '2', '3', '4'], ['cena (din)', '1500', '2000', '2500', '3000']]) });

  Q(2, 'Obim jednakostraničnog trougla stranice $a$ je $O = 3a$. Kakva je to funkcija?',
    ['linearna, sa $k = 3$ i $n = 0$', 'linearna, sa $k = 3$ i $n = 3$', 'linearna, sa $k = 0$ i $n = 3$', 'nije linearna'],
    'Obim je $3 · a$, pa je $k = 3$. Slobodan član nema, jer je obim nula kad nema stranice. Ovo je linearna funkcija sa grafikom koji prolazi kroz koordinatni početak.', 'obim',
    { mediji: G({ A: [0, 0], B: [2, 0], C: [1, 1.7] }, [{ lin: [[0, 0], [2, 0], [1, 1.73], [0, 0]], b: 1, debljina: 3 }, tx('a', [1, -0.35])], V({ bezImena: ['A', 'B', 'C'] })) });

  Q(1, 'Biciklista vozi stalnom brzinom $4$ m/s. Koja funkcija daje put $s$ posle $t$ sekundi?',
    ['$s = 4t$', '$s = t + 4$', '$s = 4t²$', '$s = 4 + t$'],
    'Pri stalnoj brzini put je srazmeran vremenu: $s = v · t$. Zato je to direktna proporcionalnost, a to je poseban slučaj linearne funkcije sa $n = 0$.', 'brzina',
    { mediji: ravan(0, 8, 0, 32, [dz([0, 0], [8, 32], { b: 1 })], { ose: ['~s', '~m'], podela: [2, 8] }) });

  Q(2, 'Površina kvadrata stranice $a$ je $P = a²$. Da li je to linearna funkcija?',
    ['Ne, jer se $a$ nalazi na drugom stepenu', 'Da, jer je to kvadrat', 'Da, jer $P$ raste kad $a$ raste', 'Ne, jer kvadrat ima četiri strane'],
    'Površina raste kad raste stranica, ali brže nego linearno: udvostručenjem stranice površina se učetvorostruči. Zato nije linearna funkcija.', 'kvadrat',
    { mediji: G({}, [{ lin: [[0, 0], [2, 0], [2, 2], [0, 2]], zatv: 1, prazno: 1, b: 1, debljina: 3 }, tx('a', [1, -0.35]), tx('a', [2.35, 1])], V({})) });

  Q(3, 'Telefonska pretplata je 300 dinara, a svaki minut razgovora košta 10 dinara. Posle koliko minuta račun iznosi 500 dinara?',
    ['20 min', '30 min', '50 min', '200 min'],
    'Račun je $y = 300 + 10t$. Iz $500 = 300 + 10t$ dobijamo $10t = 200$, pa je $t = 20$ minuta. Broj 200 je samo razlika računa, a ne vreme.', 'pretplata',
    { mediji: ravan(0, 40, 0, 800, [dz([0, 300], [40, 700], { b: 1 })], { ose: ['~min', '~din'], podela: [10, 200] , brojevi: 0 }),
      medijiOdgovora: ravan(0, 40, 0, 800, [dz([0, 300], [40, 700], { b: 1 })], { ose: ['~min', '~din'], podela: [10, 200] }) });

  Q(2, 'Knjiga ima 300 stranica, a čita se po 20 stranica dnevno. Koja funkcija daje broj preostalih stranica $s$ posle $x$ dana?',
    ['$s = 300 − 20x$', '$s = 20 − 300x$', '$s = 300 + 20x$', '$s = 300x − 20$'],
    'Preostale stranice se smanjuju za 20 dnevno, pa je koeficijent $−20$. Na početku ih ima 300, pa je to slobodan član.', 'knjiga',
    { mediji: ravan(0, 15, 0, 300, [dz([0, 300], [15, 0], { b: 1 })], { ose: ['~dan', '~str'], podela: [1, 50] }) });

  Q(2, 'Fiksna plata je 40 000 dinara, a svaki prodati artikal donosi još 500 dinara. Kolika je plata posle 3 prodata artikla?',
    ['41 500 din', '40 500 din', '41 000 din', '43 500 din'],
    'Plata je $p = 40000 + 500n$. Za $n = 3$ dobijamo $40000 + 1500 = 41500$ dinara. Iz tabele se vidi da svaki artikal dodaje isti iznos.', 'plata',
    { mediji: tabela([['artikli (n)', '0', '1', '2', '3'], ['plata (din)', '40 000', '40 500', '41 000', '?']]) });

  Q(1, 'Koji je primer linearne funkcije?',
    ['cena $c = 80x$ dinara za $x$ kilograma jabuka', 'površina $P = x²$', 'put $s = 3t²$ pri ubrzanju', 'broj ptica $n = 2^x$'],
    'Cena jabuka raste za isti iznos po kilogramu, što je linearno. Ostali primeri imaju kvadrate ili stepene promenljive, pa nisu linearni.', 'primer',
    { mediji: tabela([['kg (x)', '1', '2', '3'], ['cena (din)', '80', '160', '240']]) });

  Q(3, 'Biciklista je na početku 2 km od kuće, a udaljava se po 6 km na sat. Posle koliko sati je 20 km od kuće?',
    ['3 h', '2 h', '18 h', '3,5 h'],
    'Udaljenost je $d = 2 + 6t$. Iz $20 = 2 + 6t$ je $6t = 18$, pa je $t = 3$ sata. Ako zaboravimo početnih 2 km, dobijamo $20 : 6 ≈ 3{,}3$ h.', 'udaljenost',
    { mediji: ravan(0, 6, 0, 40, [dz([0, 2], [6, 38], { b: 1 })], { ose: ['~h', '~km'], podela: [1, 10] , brojevi: 0 }),
      medijiOdgovora: ravan(0, 6, 0, 40, [dz([0, 2], [6, 38], { b: 1 })], { ose: ['~h', '~km'], podela: [1, 10] }) });

  Q(3, 'Voće se kupuje po 120 dinara za kilogram, a na celu porudžbinu je popust 80 dinara. Koliko košta $3$ kg?',
    ['280 din', '360 din', '440 din', '200 din'],
    'Funkcija je $c = 120x − 80$. Za $x = 3$ je $c = 360 − 80 = 280$ dinara. Popust se oduzima jednom, a ne po kilogramu.', 'popust',
    { mediji: ravan(0, 6, -100, 700, [dz([0, -80], [6, 640], { b: 1 })], { ose: ['~kg', '~din'], podela: [1, 200] , brojevi: 0 }),
      medijiOdgovora: ravan(0, 6, -100, 700, [dz([0, -80], [6, 640], { b: 1 })], { ose: ['~kg', '~din'], podela: [1, 200] }) });

  U(2, 'Koja od ovih veličina NIJE primer linearne funkcije?',
    ['površina kruga $P = r²π$ u zavisnosti od poluprečnika', 'put $s = 5t$ pri stalnoj brzini', 'cena $c = 200 + 30x$', 'ostatak novca $n = 1000 − 40t$'],
    'Površina kruga zavisi od kvadrata poluprečnika, pa nije linearna. Ostale tri zavise od promenljive na prvom stepenu.', 'Kružnica se ne može zapisati kao funkcija $y = f(x)$, jer jednom $x$ odgovaraju dve tačke kruga.', 'kružnica',
    { mediji: G({ O: [0, 0] }, [{ kr: 'O', r: 1.5, b: 1, debljina: 3 }], V({ bezImena: ['O'] })) });

  S(3, 'Poveži veličinu iz primera sa koeficijentom ili slobodnim članom',
    [['start u taksiju', 'slobodan član $n$'], ['cena po kilometru', 'koeficijent $k$'], ['dužina sveće na početku', 'vrednost $y$ za $x = 0$'], ['količina vode u bazenu', 'funkcija opada']],
    'U svakom primeru prvo se pročita početno stanje, a zatim promena po jedinici.', 'primeri',
    { mediji: ravan(0, 10, 0, 800, [dz([0, 150], [10, 750], { b: 1 })], { ose: ['~km', '~din'], podela: [1, 200] }) });

  // ════════════════ 6.4 Grafik linearne funkcije ════════════════
  L('Grafik linearne funkcije');

  Q(1, 'Šta je grafik linearne funkcije?',
    ['prava linija', 'parabola', 'kružnica', 'kriva bez pravila'],
    'Grafik linearne funkcije je skup svih tačaka $(x, y)$ čije koordinate zadovoljavaju jednačinu. Za takve tačke uvek se dobija prava linija.', 'prava',
    { mediji: ravan(-4, 4, -3, 5, [pr(1, 1, -4, 4, -3, 5, { b: 1 })], { brojevi: 0 }) });

  Q(1, 'Koja tačka pripada grafiku funkcije $y = 2x − 1$?',
    ['$(2, 3)$', '$(2, 5)$', '$(0, 2)$', '$(−1, 2)$'],
    'Tačka pripada grafiku ako njene koordinate zadovoljavaju jednačinu: za $x = 2$ je $y = 4 − 1 = 3$. Ostale tačke ne zadovoljavaju jednačinu.', 'tačka',
    { mediji: ravan(-3, 4, -6, 6, [pr(2, -1, -3, 4, -6, 6, { b: 1 })], { brojevi: 0 }) });

  Q(1, 'Koliko je najmanje tačaka potrebno za crtanje grafika linearne funkcije?',
    ['2', '1', '3', '4'],
    'Kroz dve različite tačke prolazi tačno jedna prava. Treća tačka služi samo kao provera da nismo pogrešili u računu.', 'crtanje',
    { mediji: ravan(-4, 4, -4, 4, [pr(-1, 1, -4, 4, -4, 4, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Grafik funkcije $y = −x + 2$ prolazi kroz $(0, 2)$. Koja je još jedna tačka tog grafika?',
    ['$(1, 1)$', '$(1, 3)$', '$(2, 1)$', '$(−1, 1)$'],
    'Za $x = 1$ je $y = −1 + 2 = 1$, pa je $(1, 1)$ tačka grafika. Tačka $(2, 1)$ bi dala $y = 0$, pa nije na pravoj.', 'koordinate',
    { mediji: ravan(-3, 4, -2, 6, [pr(-1, 2, -3, 4, -2, 6, { b: 1 }), tk('P', { b: 3 })], { t: { P: [0, 2] }, bez: ['P'] }) });

  Q(2, 'Koje su tačke preseka grafika $y = 3x − 6$ sa koordinatnim osama?',
    ['$(2, 0)$ i $(0, −6)$', '$(−2, 0)$ i $(0, 6)$', '$(6, 0)$ i $(0, 3)$', '$(1, 0)$ i $(0, −3)$'],
    'Sa $x$-osom: $y = 0$, pa je $3x = 6$ i $x = 2$. Sa $y$-osom: $x = 0$, pa je $y = −6$. Obe tačke se čitaju iz jednačine bez crtanja.', 'presek',
    { mediji: ravan(-3, 4, -8, 6, [pr(3, -6, -3, 4, -8, 6, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Tačka $A(a, 7)$ pripada grafiku funkcije $y = 2x + 1$. Koliko je $a$?',
    ['3', '6', '4', '−3'],
    'Iz $7 = 2a + 1$ sledi $2a = 6$, pa je $a = 3$. Vrednost $7$ je ordinata, a traži se apscisa.', 'apscisa',
    { mediji: ravan(-3, 5, -3, 9, [pr(2, 1, -3, 5, -3, 9, { b: 1 })], { brojevi: 0 }), medijiOdgovora: ravan(-3, 5, -3, 9, [pr(2, 1, -3, 5, -3, 9, { b: 1 }), tk('A', { b: 1 }), dz([3, 0], [3, 7], { b: 2, isp: 1 }), dz([0, 7], [3, 7], { b: 2, isp: 1 })], { t: { A: [3, 7] }, bez: ['A'] }) });

  Q(2, 'Grafik funkcije $y = kx$ prolazi kroz tačku $(2, −6)$. Koliko je $k$?',
    ['−3', '3', '−4', '−12'],
    'Iz $−6 = k · 2$ je $k = −3$. Grafik $y = kx$ uvek prolazi kroz koordinatni početak, pa je dovoljna jedna tačka da se nađe $k$.', 'koeficijent',
    { mediji: ravan(-4, 4, -8, 8, [pr(-3, 0, -4, 4, -8, 8, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Koja tvrdnja o grafiku $y = 3x$ je tačna?',
    ['Prolazi kroz koordinatni početak $(0, 0)$', 'Seče $y$-osu u tački $(0, 3)$', 'Paralelan je sa $x$-osom', 'Prolazi kroz tačku $(3, 1)$'],
    'Za $x = 0$ je $y = 0$, pa grafik prolazi kroz $(0, 0)$. Tačka $(0, 3)$ bi važila samo za $y = 3x + 3$.', 'početak',
    { mediji: ravan(-3, 3, -6, 6, [pr(3, 0, -3, 3, -6, 6, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Tačka $(4, 1)$ pripada grafiku koje funkcije?',
    ['$y = \\frac{1}{2}x − 1$', '$y = 2x + 1$', '$y = x + 1$', '$y = 3x − 2$'],
    'Za $x = 4$ prva funkcija daje $y = 2 − 1 = 1$, pa tačka pripada njenom grafiku. Ostale daju 9, 5 i 10.', 'pripadanje',
    { mediji: ravan(0, 6, -2, 5, [tk('T', { b: 1 })], { t: { T: [4, 1] }, bez: ['T'], brojevi: 0 }) });

  Q(3, 'Grafik seče $x$-osu u tački $(4, 0)$ i prolazi kroz tačku $(0, −2)$. Koja je to funkcija?',
    ['$y = \\frac{1}{2}x − 2$', '$y = −\\frac{1}{2}x − 2$', '$y = 2x − 2$', '$y = \\frac{1}{2}x + 4$'],
    'Slobodan član je $n = −2$ (presek sa $y$-osom). Iz $0 = k · 4 − 2$ dobijamo $k = \\frac{1}{2}$. Provera: $\\frac{1}{2} · 4 − 2 = 0$.', 'tačke',
    { mediji: ravan(-2, 6, -3, 2, [tk('C', { b: 1 }), tk('D', { b: 1 })], { t: { C: [4, 0], D: [0, -2] }, bez: [], brojevi: 0 }) });

  Q(2, 'Koliko je $y$ za $x = 5$ ako grafik prolazi kroz tačke $(1, 2)$ i $(3, 6)$?',
    ['10', '8', '12', '16'],
    'Nagib je $k = \\frac{6 − 2}{3 − 1} = 2$. Iz $2 = 2 · 1 + n$ dobijamo $n = 0$, pa je $y = 2x$ i za $x = 5$ je $y = 10$.', 'tačke',
    { mediji: ravan(0, 6, 0, 14, [dz([1, 2], [3, 6], { b: 1 }), tk('A', { b: 1 }), tk('B', { b: 1 })], { t: { A: [1, 2], B: [3, 6] }, brojevi: 0 }) });

  Q(2, 'Grafik linearne funkcije $y = kx + n$ prolazi kroz $(2, 1)$ i $(3, 4)$. Koliko je $n$?',
    ['−5', '5', '−3', '3'],
    'Nagib je $k = 3$. Iz $1 = 3 · 2 + n$ dobijamo $n = −5$. Provera za $x = 3$: $3 · 3 − 5 = 4$.', 'odsečak',
    { mediji: ravan(0, 4, -2, 6, [dz([2, 1], [3, 4], { b: 1 }), tk('A', { b: 1 }), tk('B', { b: 1 })], { t: { A: [2, 1], B: [3, 4] }, brojevi: 0 }) });

  Q(2, 'Grafik $y = 2x + 3$ seče $x$-osu u tački $(−\\frac{3}{2}, 0)$. Koja tačka je presek grafika sa $y$-osom?',
    ['$(0, 3)$', '$(−\\frac{3}{2}, 0)$', '$(3, 0)$', '$(0, −3)$'],
    'Presek sa $y$-osom je tačka čija je apscisa $0$, pa je to $(0, n) = (0, 3)$. Tačka $(−\\frac{3}{2}, 0)$ je presek sa $x$-osom.', 'presek',
    { mediji: ravan(-4, 3, -3, 7, [pr(2, 3, -4, 3, -3, 7, { b: 1 })], { brojevi: 0 }) });

  Q(3, 'Grafik $y = kx + 2$ prolazi kroz tačku $(−2, 6)$. Koliko je $k$?',
    ['−2', '2', '4', '−4'],
    'Zamenimo: $6 = k · (−2) + 2$, pa je $−2k = 4$ i $k = −2$. Provera: $−2 · (−2) + 2 = 6$.', 'zamena',
    { mediji: ravan(-4, 3, -2, 9, [pr(-2, 2, -4, 3, -2, 9, { b: 1 })], { brojevi: 0 }) });

  U(2, 'Koja tačka NIJE na pravoj $y = 3x − 4$?',
    ['$(2, 1)$', '$(1, −1)$', '$(0, −4)$', '$(3, 5)$'],
    'Tačke $(1, −1)$, $(0, −4)$ i $(3, 5)$ zadovoljavaju jednačinu. Za $(2, 1)$ je $3 · 2 − 4 = 2$, a ne 1, pa tačka nije na pravoj.', 'Da bi tačka pripadala grafiku, dovoljno je da njene koordinate zamene $x$ i $y$ u jednačinu. To je najbrža provera.', 'tačka',
    { mediji: ravan(-2, 4, -6, 7, [pr(3, -4, -2, 4, -6, 7, { b: 1 })], { brojevi: 0 }) });

  S(2, 'Poveži pojam sa njegovim značenjem u grafiku',
    [['presek sa $x$-osom', 'tačka $(x, 0)$'], ['presek sa $y$-osom', 'tačka $(0, n)$'], ['tačka grafika', 'uređeni par koji zadovoljava jednačinu'], ['za crtanje dovoljno', 'dve tačke']],
    'Dve tačke sa osa obično su najbrži način za crtanje prave.', 'grafik',
    { mediji: ravan(-4, 4, -3, 5, [pr(1, 1, -4, 4, -3, 5, { b: 1 })], { brojevi: 0 }) });

  // ════════════════ 6.5 Neke karakteristike linearne funkcije i njihovi grafici ════════════════
  L('Neke karakteristike linearne funkcije i njihovi grafici');

  Q(1, 'Kakav je grafik funkcije $y = 4$ u odnosu na $x$-osu?',
    ['paralelan je sa $x$-osom', 'paralelan je sa $y$-osom', 'seče $x$-osu pod pravim uglom', 'prolazi kroz koordinatni početak'],
    'Konstantna funkcija $y = n$ je horizontalna prava na visini $n$. Ona je paralelna sa $x$-osom, a sa $y$-osom se seče u tački $(0, n)$.', 'vodoravna',
    { mediji: ravan(-4, 4, -2, 6, [pr(0, 4, -4, 4, -2, 6, { b: 1 })], { brojevi: 0 }) });

  Q(1, 'Kada je grafik linearne funkcije paralelan sa $x$-osom?',
    ['kada je $k = 0$', 'kada je $n = 0$', 'kada je $k = 1$', 'kada je $k = −1$'],
    'Ako je koeficijent $k = 0$, funkcija je $y = n$ i njen grafik je horizontalan. Slobodan član $n$ samo pomera pravu gore ili dole.', 'konstanta',
    { mediji: ravan(-4, 4, -2, 6, [pr(0, 2, -4, 4, -2, 6, { b: 1 })], { brojevi: 0 }) });

  Q(1, 'Koja prava prolazi kroz koordinatni početak?',
    ['$y = 5x$', '$y = 5x + 1$', '$y = 5$', '$y = 5x − 1$'],
    'Prava prolazi kroz koordinatni početak samo ako je slobodan član $n = 0$. Zato je $y = 5x$ jedina takva prava.', 'početak',
    { mediji: ravan(-3, 3, -6, 6, [pr(5, 0, -3, 3, -6, 6, { b: 1 }), pr(5, 1, -3, 3, -6, 6, { b: 2 }), pr(5, -1, -3, 3, -6, 6, { b: 3 }), tx('a', [-0.9, -5.2], { b: 1 }), tx('b', [-1.7, -3.3], { b: 2 }), tx('c', [-0.2, -5.2], { b: 3 })], { brojevi: 0 }) });

  Q(2, 'Prave $y = 2x + 3$ i $y = −2x + 3$ seku se u tački…',
    ['$(0, 3)$', '$(3, 0)$', '$(−3, 0)$', '$(2, 3)$'],
    'Obe prave imaju slobodan član $3$, pa je $(0, 3)$ presek. Izjednačimo $2x + 3 = −2x + 3$: dobijamo $x = 0$.', 'presek',
    { mediji: ravan(-4, 4, -2, 8, [pr(2, 3, -4, 4, -2, 8, { b: 1 }), pr(-2, 3, -4, 4, -2, 8, { b: 2 })], { brojevi: 0 }) });

  Q(2, 'Koliko zajedničkih tačaka imaju prave $y = 2x + 1$ i $y = 2x − 3$?',
    ['nijednu', 'jednu', 'dve', 'beskonačno mnogo'],
    'Prave imaju isti koeficijent $k = 2$, pa su paralelne i nikad se ne seku. Zato nemaju zajedničku tačku.', 'paralelne',
    { mediji: ravan(-4, 4, -6, 6, [pr(2, 1, -4, 4, -6, 6, { b: 1 }), pr(2, -3, -4, 4, -6, 6, { b: 2 }), tx('a', [3.3, 7.2], { b: 1 }), tx('b', [3.3, 1.2], { b: 2 })], { brojevi: 0 }) });

  Q(3, 'Prave $y = −x + 4$ i $y = 2x − 2$ seku se u tački…',
    ['$(2, 2)$', '$(2, −2)$', '$(−2, 2)$', '$(3, 1)$'],
    'Izjednačimo: $−x + 4 = 2x − 2$, pa je $3x = 6$ i $x = 2$. Tada je $y = −2 + 4 = 2$. Provera u drugoj jednačini: $2 · 2 − 2 = 2$.', 'presek',
    { mediji: ravan(-2, 5, -3, 7, [pr(-1, 4, -2, 5, -3, 7, { b: 1 }), pr(2, -2, -2, 5, -3, 7, { b: 2 })], { brojevi: 0 }) });

  Q(2, 'Kada linearna funkcija prolazi kroz koordinatni početak?',
    ['kada je $n = 0$', 'kada je $k = 0$', 'kada je $n = 1$', 'kada je $k = n$'],
    'Za $x = 0$ je $y = n$, pa grafik prolazi kroz $(0, 0)$ samo ako je $n = 0$. Koeficijent $k$ određuje nagib, ali ne i položaj preseka sa $y$-osom.', 'početak',
    { mediji: ravan(-3, 3, -6, 6, [pr(2, 0, -3, 3, -6, 6, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Prava $y = kx + 2$ je paralelna sa $y = 3x − 5$. Koliko je $k$?',
    ['3', '2', '−3', '5'],
    'Paralelne prave imaju isti koeficijent pravca, pa je $k = 3$. Slobodni članovi mogu biti različiti.', 'paralelne',
    { mediji: ravan(-3, 3, -8, 6, [pr(3, -5, -3, 3, -8, 6, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Kakav je položaj grafika $y = 2x + 3$ i $y = −x + 3$?',
    ['seku se u tački $(0, 3)$', 'paralelni su', 'poklapaju se', 'seku se u tački $(3, 0)$'],
    'Koeficijenti $k$ su različiti (2 i −1), pa se prave seku. Obe prolaze kroz $(0, 3)$, što je njihov presek.', 'položaj',
    { mediji: ravan(-4, 4, -3, 9, [pr(2, 3, -4, 4, -3, 9, { b: 1 }), pr(-1, 3, -4, 4, -3, 9, { b: 2 })], { brojevi: 0 }) });

  Q(3, 'Za koju vrednost $a$ su grafici $y = ax + 1$ i $y = 3x − 2$ paralelni?',
    ['$a = 3$', '$a = −3$', '$a = 1$', '$a = −2$'],
    'Paralelnost znači jednak koeficijent: $a = 3$. Slobodni članovi $1$ i $−2$ su različiti, pa se prave ne poklapaju.', 'paralelnost',
    { mediji: ravan(-3, 3, -8, 6, [pr(3, -2, -3, 3, -8, 6, { b: 2 }), tx('b', [2.2, 4.4], { b: 2 })], { brojevi: 0 }) });

  Q(3, 'Prava je paralelna sa $y = −2x + 5$ i prolazi kroz $(0, 1)$. Koja je to prava?',
    ['$y = −2x + 1$', '$y = 2x + 1$', '$y = −2x − 1$', '$y = −x + 1$'],
    'Paralelna prava ima isti $k = −2$, a kroz $(0, 1)$ prolazi kad je $n = 1$. Dobijamo $y = −2x + 1$.', 'tačka',
    { mediji: ravan(-2, 4, -4, 8, [pr(-2, 5, -2, 4, -4, 8, { b: 2 }), tx('a', [3.2, -1.8], { b: 2 })], { brojevi: 0 }) });

  Q(2, 'Grafici funkcija $y = 4$ i $y = 0$ (osa $x$) su…',
    ['paralelni', 'seku se u tački $(4, 0)$', 'poklapaju se', 'seku se u tački $(0, 4)$'],
    'Obe prave su horizontalne, pa im je $k = 0$. Različiti slobodni članovi 4 i 0 znače da su paralelne.', 'vodoravne',
    { mediji: ravan(-4, 4, -2, 6, [pr(0, 4, -4, 4, -2, 6, { b: 1 }), pr(0, 0, -4, 4, -2, 6, { b: 2 }), tx('a', [3, 4.6], { b: 1 }), tx('b', [3, 0.6], { b: 2 })], { brojevi: 0 }) });

  Q(2, 'Za prave $y = 2x$ i $y = 2x − 5$ tačno je da…',
    ['su paralelne i nemaju zajedničku tačku', 'seku se u koordinatnom početku', 'seku se u tački $(0, −5)$', 'poklapaju se'],
    'Obe prave imaju $k = 2$, pa su paralelne. Prava $y = 2x$ prolazi kroz koordinatni početak, a $y = 2x − 5$ ne prolazi.', 'paralelne',
    { mediji: ravan(-4, 4, -8, 8, [pr(2, 0, -4, 4, -8, 8, { b: 1 }), pr(2, -5, -4, 4, -8, 8, { b: 2 })], { brojevi: 0 }) });

  Q(3, 'Koja vrednost $n$ u $y = 3x + n$ čini da prava prolazi kroz presek pravih $y = x$ i $y = 6 − x$?',
    ['−6', '6', '3', '−3'],
    'Presek pravih $y = x$ i $y = 6 − x$ je $(3, 3)$. Iz $3 = 3 · 3 + n$ dobijamo $n = −6$.', 'presek',
    { mediji: ravan(-1, 7, -2, 7, [pr(1, 0, -1, 7, -2, 7, { b: 1 }), pr(-1, 6, -1, 7, -2, 7, { b: 2 })], { brojevi: 0 }) });

  U(2, 'Koja od ovih funkcija NE pripada grupi pravih $y = 4x + n$ koje su međusobno paralelne?',
    ['$y = −4x + 1$', '$y = 4x + 1$', '$y = 4x − 3$', '$y = 4x + 7$'],
    'Prave $y = 4x + 1$, $y = 4x − 3$ i $y = 4x + 7$ imaju isti koeficijent $k = 4$, pa su paralelne. Prava $y = −4x + 1$ ima $k = −4$.', 'Paralelne prave se nikad ne seku, a imaju isti pravac: zato im je koeficijent $k$ jednak.', 'paralelne',
    { mediji: ravan(-4, 4, -8, 8, [pr(-4, 1, -4, 4, -8, 8, { b: 2 }), pr(4, 1, -4, 4, -8, 8, { b: 1 }), pr(4, -3, -4, 4, -8, 8, { b: 1 })], { brojevi: 0 }) });

  S(2, 'Poveži funkcije sa njihovim osobinama',
    [['$y = 5$', 'paralelna sa $x$-osom'], ['$y = 2x$', 'prolazi kroz koordinatni početak'], ['$y = 3x + 1$ i $y = 3x − 2$', 'paralelne prave'], ['$y = x$ i $y = −x$', 'seku se u koordinatnom početku']],
    'Ove osobine se vide i bez crtanja: $k$ govori o paralelnosti, $n = 0$ o koordinatnom početku.', 'osobine',
    { mediji: ravan(-4, 4, -4, 6, [pr(0, 5, -4, 4, -4, 6, { b: 1 }), pr(1, 0, -4, 4, -4, 6, { b: 2 }), pr(-1, 0, -4, 4, -4, 6, { b: 3 })], { brojevi: 0 }) });

  // ════════════════ 6.6 Nule i znak linearne funkcije ════════════════
  L('Nule i znak linearne funkcije');

  Q(1, 'Šta je nula funkcije?',
    ['$y = 0$', '$x = 0$', '$y = 1$', '$x = 1$'],
    'Nula je vrednost nezavisne promenljive za koju zavisna promenljiva postaje nula. Grafički, to je presek grafika sa $x$-osom.', 'nula',
    { mediji: ravan(-1, 5, -3, 5, [pr(1, -2, -1, 5, -3, 5, { b: 1 })], { brojevi: 0 }) });

  Q(1, 'Gde grafik funkcije $y = 2x − 6$ seče $x$-osu?',
    ['3', '−3', '6', '−6'],
    'Iz $0 = 2x − 6$ je $2x = 6$, pa je $x = 3$. Tačka preseka je $(3, 0)$.', 'nula',
    { mediji: ravan(-1, 6, -7, 7, [pr(2, -6, -1, 6, -7, 7, { b: 1 })], { brojevi: 0 }) });

  Q(1, 'Gde grafik funkcije $y = x − 4$ seče $x$-osu?',
    ['u tački $(4, 0)$', 'u tački $(0, −4)$', 'u tački $(0, 4)$', 'u tački $(−4, 0)$'],
    'Na $x$-osi je $y = 0$, pa je $x − 4 = 0$ i $x = 4$. Tačka $(0, −4)$ je presek sa $y$-osom.', 'presek',
    { mediji: ravan(-2, 6, -5, 3, [pr(1, -4, -2, 6, -5, 3, { b: 1 })], { brojevi: 0 }) });

  Q(3, 'Kolika je nula funkcije $y = \\frac{1}{3}x + 6$?',
    ['$x = −18$', '$x = 18$', '$x = −6$', '$x = 6$'],
    'Iz $0 = \\frac{1}{3}x + 6$ dobijamo $\\frac{1}{3}x = −6$, pa je $x = −18$. Provera: $\\frac{1}{3} · (−18) + 6 = 0$.', 'razlomak',
    { mediji: ravan(-22, 4, -3, 8, [pr(1 / 3, 6, -22, 4, -3, 8, { b: 1 })], { brojevi: 0, podela: [5, 2] }) });

  Q(2, 'Koja funkcija NEMA nulu?',
    ['$y = 4$', '$y = 4x$', '$y = 4x − 8$', '$y = x + 4$'],
    'Konstantna funkcija $y = 4$ nikad nije nula, jer je $y$ uvek jednako 4. Ostale tri seku $x$-osu u tačkama $0$, $2$ i $−4$.', 'konstanta',
    { mediji: ravan(-4, 4, -2, 6, [pr(0, 4, -4, 4, -2, 6, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Za koju vrednost $a$ je $x = 7$ nula funkcije $y = (a − 2)x − 21$?',
    ['5', '3', '7', '−5'],
    'Mora važiti $0 = (a − 2) · 7 − 21$, pa je $7a − 14 = 21$, odnosno $7a = 35$ i $a = 5$. Broj 3 bi bio $a − 2$, a ne sam $a$.', 'nula',
    { mediji: ravan(-2, 10, -4, 4, [tk('N', { b: 3 })], { t: { N: [7, 0] }, bez: ['N'], brojevi: 0 }) });

  Q(2, 'Za koje vrednosti $x$ je grafik funkcije $y = x − 2$ iznad $x$-ose?',
    ['$x > 2$', '$x < 2$', '$x > −2$', '$x < −2$'],
    'Funkcija je pozitivna kad je grafik iznad $x$-ose, a to je za $x$ desno od nule $x = 2$.', 'znak',
    { mediji: ravan(-2, 5, -4, 4, [pr(1, -2, -2, 5, -4, 4, { b: 1 })], { brojevi: 0 }),
      medijiOdgovora: ravan(-2, 5, -4, 4, [pr(1, -2, -2, 5, -4, 4, { b: 1 }), dz([2, 0], [5, 3], { b: 2, debljina: 5 })], { brojevi: 0 }) });

  Q(3, 'Za koje $x$ je funkcija $y = −2x + 8$ negativna?',
    ['$x > 4$', '$x < 4$', '$x > −4$', '$x < −4$'],
    'Nula je $x = 4$. Pošto je $k < 0$, funkcija opada: desno od nule je ispod $x$-ose, pa je negativna.', 'opadanje',
    { mediji: ravan(0, 6, -4, 10, [pr(-2, 8, 0, 6, -4, 10, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Funkcija $y = −x + 3$ za $x = 5$ je…',
    ['negativna', 'pozitivna', 'jednaka nuli', 'konstantna'],
    'Za $x = 5$ je $y = −5 + 3 = −2$. Vrednost je ispod $x$-ose, pa je negativna.', 'vrednost',
    { mediji: ravan(-2, 6, -4, 5, [pr(-1, 3, -2, 6, -4, 5, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Na crtežu je grafik funkcije $y = x − 1$. Za koje $x$ je funkcija negativna?',
    ['$x < 1$', '$x > 1$', '$x < −1$', '$x > −1$'],
    'Negativna je kad je grafik ispod $x$-ose, a to je levo od nule $x = 1$. Tamo je $y < 0$, na primer za $x = 0$ je $y = −1$.', 'deo',
    { mediji: ravan(-3, 4, -4, 4, [pr(1, -1, -3, 4, -4, 4, { b: 1 })], { brojevi: 0 }),
      medijiOdgovora: ravan(-3, 4, -4, 4, [pr(1, -1, -3, 4, -4, 4, { b: 1 }), dz([-3, -4], [1, 0], { b: 2, debljina: 5 })], { brojevi: 0 }) });

  Q(2, 'Gde grafik funkcije $y = 2x + 4$ seče $x$-osu?',
    ['$(−2, 0)$', '$(2, 0)$', '$(0, 4)$', '$(−4, 0)$'],
    'Iz $2x + 4 = 0$ je $x = −2$. Tačka $(0, 4)$ je presek sa $y$-osom, a ne sa $x$-osom.', 'presek',
    { mediji: ravan(-5, 3, -3, 7, [pr(2, 4, -5, 3, -3, 7, { b: 1 })], { brojevi: 0 }) });

  Q(3, 'Nula funkcije $y = kx + 6$ je $x = 3$. Koliko je $k$?',
    ['−2', '2', '−3', '−6'],
    'Iz $0 = 3k + 6$ je $3k = −6$, pa je $k = −2$. Negativan koeficijent znači da funkcija opada.', 'nula',
    { mediji: ravan(-2, 6, -4, 10, [pr(-2, 6, -2, 6, -4, 10, { b: 1 })], { brojevi: 0 }) });

  Q(1, 'Koja je nula funkcije $y = −5x$?',
    ['0', '5', '−5', '1'],
    'Grafik prolazi kroz koordinatni početak, pa je nula $x = 0$. Ovo je poseban slučaj: $n = 0$ daje nulu u koordinatnom početku.', 'početak',
    { mediji: ravan(-3, 3, -8, 8, [pr(-5, 0, -3, 3, -8, 8, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Koja je nula funkcije $y = −\\frac{2}{3}x + 4$?',
    ['6', '−6', '$\\frac{8}{3}$', '4'],
    'Iz $0 = −\\frac{2}{3}x + 4$ dobijamo $\\frac{2}{3}x = 4$, pa je $x = 6$. Broj 4 je slobodan član, a ne nula.', 'razlomak',
    { mediji: ravan(-2, 8, -2, 6, [pr(-2 / 3, 4, -2, 8, -2, 6, { b: 1 })], { brojevi: 0 }) });

  U(2, 'Koja od ovih funkcija NEMA nulu $x = 2$?',
    ['$y = 3x − 4$', '$y = x − 2$', '$y = 2x − 4$', '$y = −5x + 10$'],
    'Nula $y = 3x − 4$ je $x = \\frac{4}{3}$. Ostale tri imaju nulu u $x = 2$: $x − 2 = 0$, $2x − 4 = 0$ i $−5x + 10 = 0$.', 'Rešiti jednačinu $2x − 4 = 0$ isto je što i naći nulu funkcije $y = 2x − 4$.', 'nula',
    { mediji: ravan(-2, 6, -6, 8, [pr(3, -4, -2, 6, -6, 8, { b: 1 })], { brojevi: 0 }) });

  S(3, 'Poveži pojam nule i znaka funkcije',
    [['nula funkcije', 'presek sa $x$-osom'], ['$y > 0$', 'deo grafika iznad $x$-ose'], ['$y < 0$', 'deo grafika ispod $x$-ose'], ['$y = 4$ (konstantna)', 'nema nule']],
    'Znak se čita sa grafika: iznad $x$-ose je pozitivno, ispod negativno, a na $x$-osi je nula.', 'znak',
    { mediji: ravan(-4, 4, -4, 4, [pr(1, 0, -4, 4, -4, 4, { b: 1 })], { brojevi: 0 }) });

  // ════════════════ 6.7 Rast i opadanje linearne funkcije ════════════════
  L('Rast i opadanje linearne funkcije');

  Q(1, 'Kada je funkcija $y = kx + n$ rastuća?',
    ['$k > 0$', '$k < 0$', '$k = 0$', '$n > 0$'],
    'Rastuća funkcija: kad $x$ poraste, $y$ takođe poraste. To važi kad je koeficijent $k$ pozitivan. Slobodan član $n$ ne utiče na rast.', 'rast',
    { mediji: ravan(-3, 3, -3, 5, [pr(1, 0, -3, 3, -3, 5, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Koja od ovih funkcija opada?',
    ['$y = −3x + 2$', '$y = 3x + 2$', '$y = 2$', '$y = \\frac{1}{3}x$'],
    'Opadajuća funkcija ima negativan koeficijent. Kod $y = −3x + 2$ je $k = −3$, pa kad $x$ raste, $y$ se smanjuje.', 'opadanje',
    { mediji: ravan(-3, 3, -6, 8, [pr(-3, 2, -3, 3, -6, 8, { b: 1 })], { brojevi: 0 }) });

  Q(1, 'Kako se menja $y$ kad $x$ raste kod rastuće funkcije?',
    ['$y$ takođe raste', '$y$ opada', '$y$ ostaje isto', '$y$ menja znak'],
    'Rast znači da su promene $x$ i $y$ istog smera. Ako je koeficijent $k$ pozitivan, obe vrednosti rastu zajedno.', 'smer',
    { mediji: ravan(-1, 4, -1, 6, [pr(1, 1, -1, 4, -1, 6, { b: 1 }), tk('P', { b: 1 }), tk('Q', { b: 1 })], { t: { P: [0, 1], Q: [2, 3] }, bez: ['P', 'Q'], brojevi: 0 }) });

  Q(2, 'Za koje $a$ je funkcija $y = (a − 2)x + 1$ rastuća?',
    ['$a > 2$', '$a < 2$', '$a = 2$', '$a > 0$'],
    'Funkcija raste ako je koeficijent $a − 2$ pozitivan, dakle $a > 2$. Za $a = 2$ funkcija je konstantna.', 'koeficijent',
    { mediji: ravan(-3, 3, -2, 6, [pr(1, 1, -3, 3, -2, 6, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Kada je linearna funkcija konstantna?',
    ['kada je $k = 0$', 'kada je $n = 0$', 'kada je $k = 1$', 'kada je $k < 0$'],
    'Ako je $k = 0$, ostaje samo $y = n$, pa se $y$ ne menja kad se menja $x$. Grafik je horizontalna prava.', 'konstantna',
    { mediji: ravan(-3, 3, -2, 6, [pr(0, 2, -3, 3, -2, 6, { b: 1 })], { brojevi: 0 }) });

  Q(1, 'Funkcija $y = 5 − 2x$ je…',
    ['opadajuća', 'rastuća', 'konstantna', 'nije linearna'],
    'Ovo je linearna funkcija sa $k = −2$, jer se članovi mogu preurediti: $y = −2x + 5$. Negativan koeficijent znači opadanje.', 'preurediti',
    { mediji: ravan(-2, 5, -4, 8, [pr(-2, 5, -2, 5, -4, 8, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Koja tvrdnja o funkciji $y = −\\frac{1}{2}x + 3$ je tačna?',
    ['opada, jer je $k < 0$', 'raste, jer je $n > 0$', 'opada, jer je $n > 0$', 'raste, jer je $k < 0$'],
    'Rast ili opadanje zavisi samo od znaka $k$. Ovde je $k = −\\frac{1}{2} < 0$, pa funkcija opada. Slobodan član $3$ ne određuje smer.', 'znak',
    { mediji: ravan(-2, 8, -2, 7, [pr(-1 / 2, 3, -2, 8, -2, 7, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Na crtežu su prave $a$ i $b$. Kakvi su znaci koeficijenata $k_a$ i $k_b$?',
    ['$k_a > 0$, $k_b < 0$', '$k_a < 0$, $k_b > 0$', '$k_a > 0$, $k_b > 0$', '$k_a = 0$, $k_b < 0$'],
    'Prava $a$ raste (ide od levo dole ka desno gore), pa je $k_a > 0$. Prava $b$ opada, pa je $k_b < 0$.', 'prave',
    { mediji: ravan(-4, 4, -5, 5, [pr(1, 0, -4, 4, -5, 5, { b: 1 }), pr(-1, 0, -4, 4, -5, 5, { b: 2 }), tx('a', [3.3, 4.2], { b: 1 }), tx('b', [3.3, -4.2], { b: 2 })], { brojevi: 0 }) });

  Q(2, 'Za funkcije $y = 3x + 2$ i $y = 3x − 1$ tačno je da…',
    ['obe rastu, a paralelne su', 'obe opadaju, a seku se', 'prva raste, a druga opada', 'obe su konstantne'],
    'Oba koeficijenta su $k = 3 > 0$, pa obe rastu. Isti koeficijent znači da su prave paralelne.', 'paralelne',
    { mediji: ravan(-3, 3, -6, 8, [pr(3, 2, -3, 3, -6, 8, { b: 1 }), pr(3, -1, -3, 3, -6, 8, { b: 2 })], { brojevi: 0 }) });

  Q(3, 'Za koje $m$ funkcija $y = 4 − (m + 2)x$ raste?',
    ['$m < −2$', '$m > −2$', '$m < 2$', '$m > 2$'],
    'Koeficijent je $−(m + 2)$. Da bi bio pozitivan, mora biti $m + 2 < 0$, odnosno $m < −2$.', 'uslov',
    { mediji: ravan(-3, 3, -2, 6, [pr(1, 1, -3, 3, -2, 6, { b: 1 })], { brojevi: 0 }) });

  Q(3, 'Funkcija $y = (1 − 2m)x + 3$ je opadajuća. Koji uslov važi za $m$?',
    ['$m > \\frac{1}{2}$', '$m < \\frac{1}{2}$', '$m > 2$', '$m < −\\frac{1}{2}$'],
    'Opadanje znači $1 − 2m < 0$, pa je $2m > 1$ i $m > \\frac{1}{2}$. Ako je $m$ manje od polovine, funkcija raste.', 'uslov',
    { mediji: ravan(-3, 3, -2, 6, [pr(-1, 3, -3, 3, -2, 6, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Za $y = 2x$ i $y = −2x$, kad $x$ raste, koja tvrdnja je tačna?',
    ['$y = 2x$ raste, a $y = −2x$ opada', 'obe rastu', 'obe opadaju', '$y = −2x$ raste'],
    'Koeficijenti su $2$ i $−2$, pa je prva rastuća, a druga opadajuća. Obe prolaze kroz koordinatni početak.', 'prave',
    { mediji: ravan(-3, 3, -6, 6, [pr(2, 0, -3, 3, -6, 6, { b: 1 }), pr(-2, 0, -3, 3, -6, 6, { b: 2 })], { brojevi: 0 }) });

  Q(2, 'Kad $x$ poraste za 2, koliko se promeni $y$ kod funkcije $y = 3x − 1$?',
    ['6', '3', '2', '−6'],
    'Promena $y$ je $k$ puta promena $x$: $3 · 2 = 6$. Konstantni član ne utiče na promenu.', 'promena',
    { mediji: ravan(-1, 4, -4, 10, [pr(3, -1, -1, 4, -4, 10, { b: 1 })], { brojevi: 0 }) });

  Q(3, 'Prava ima $k = −4$ i prolazi kroz tačku $(1, 2)$. Koliko je $n$?',
    ['6', '−6', '2', '−2'],
    'Iz $2 = −4 · 1 + n$ dobijamo $n = 6$. Provera: $y = −4x + 6$ za $x = 1$ daje $2$.', 'odsečak',
    { mediji: ravan(-1, 4, -6, 10, [pr(-4, 6, -1, 4, -6, 10, { b: 1 })], { brojevi: 0 }) });

  U(2, 'Koja od ovih funkcija NIJE opadajuća?',
    ['$y = 2x − 1$', '$y = −3x + 4$', '$y = −x$', '$y = −\\frac{1}{4}x + 2$'],
    'Funkcija $y = 2x − 1$ ima pozitivan koeficijent $k = 2$, pa raste. Ostale tri imaju negativan koeficijent i opadaju.', 'Rast i opadanje opisuju, na primer, zagrevanje i hlađenje: porast temperature tokom vremena je rast funkcije.', 'rast',
    { mediji: ravan(-3, 3, -6, 6, [pr(2, -1, -3, 3, -6, 6, { b: 1 })], { brojevi: 0 }) });

  S(3, 'Poveži znak koeficijenta sa osobinom funkcije',
    [['$k > 0$', 'funkcija raste'], ['$k < 0$', 'funkcija opada'], ['$k = 0$', 'funkcija je konstantna'], ['$n$', 'ne utiče na rast ili opadanje']],
    'Rast ili opadanje zavisi samo od koeficijenta uz $x$, a ne od slobodnog člana.', 'rast',
    { mediji: ravan(-3, 3, -4, 6, [pr(1, 0, -3, 3, -4, 6, { b: 1 }), pr(-1, 0, -3, 3, -4, 6, { b: 2 })], { brojevi: 0 }) });

  // ════════════════ 6.8 Implicitni oblik linearne funkcije ════════════════
  L('Implicitni oblik linearne funkcije');

  Q(1, 'Implicitni (opšti) oblik linearne funkcije je…',
    ['$ax + by + c = 0$', '$y = kx + n$', '$y = ax²$', '$x = y$'],
    'Eksplicitni oblik je $y = kx + n$ (y je sam na jednoj strani). Implicitni je $ax + by + c = 0$, gde $y$ nije izražen posebno.', 'implicitni',
    { mediji: ravan(-2, 4, -2, 6, [pr(-1, 2, -2, 4, -2, 6, { b: 1 })], { brojevi: 0 }) });

  Q(1, 'Kakav je oblik zapisa $y = 3x − 5$?',
    ['eksplicitni', 'implicitni', 'parabolični', 'kružni'],
    'Kad je $y$ izraženo direktno preko $x$, zapis je eksplicitan. Ta reč potiče od latinskog explicitus, što znači jasno izraženo.', 'eksplicitni',
    { mediji: ravan(-2, 4, -9, 8, [pr(3, -5, -2, 4, -9, 8, { b: 1 })], { brojevi: 0 }) });

  Q(3, 'Izrazi $2x + y − 4 = 0$ u eksplicitnom obliku.',
    ['$y = −2x + 4$', '$y = 2x − 4$', '$y = 2x + 4$', '$y = −2x − 4$'],
    'Prebacimo $2x − 4$ na drugu stranu: $y = −2x + 4$. Svaki član pri prebacivanju menja znak.', 'sređivanje',
    { mediji: ravan(-1, 4, -3, 7, [pr(-2, 4, -1, 4, -3, 7, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Napiši $y = 3x − 5$ u implicitnom obliku.',
    ['$3x − y − 5 = 0$', '$3x + y − 5 = 0$', '$3x − y + 5 = 0$', '$3x + y + 5 = 0$'],
    'Sve članove prebacimo na jednu stranu: $3x − 5 − y = 0$, odnosno $3x − y − 5 = 0$. Provera: za $x = 2$ je $y = 1$ i $6 − 1 − 5 = 0$.', 'implicitni',
    { mediji: ravan(-2, 4, -9, 8, [pr(3, -5, -2, 4, -9, 8, { b: 1 })], { brojevi: 0 }) });

  Q(3, 'Koji je koeficijent $k$ u zapisu $3x − 2y + 6 = 0$?',
    ['$\\frac{3}{2}$', '$−\\frac{3}{2}$', '$3$', '$−3$'],
    'Izrazimo $y$: $2y = 3x + 6$, pa je $y = \\frac{3}{2}x + 3$. Koeficijent je $k = \\frac{3}{2}$. Broj 3 je koeficijent uz $x$ u implicitnom obliku, a ne $k$.', 'koeficijent',
    { mediji: ravan(-4, 4, -2, 9, [pr(3 / 2, 3, -4, 4, -2, 9, { b: 1 })], { brojevi: 0 }) });

  Q(3, 'Koji je eksplicitni oblik jednačine $x + 2y − 6 = 0$?',
    ['$y = −\\frac{1}{2}x + 3$', '$y = \\frac{1}{2}x + 3$', '$y = −\\frac{1}{2}x − 3$', '$y = 2x − 6$'],
    'Iz $2y = −x + 6$ dobijamo $y = −\\frac{1}{2}x + 3$. Pri deljenju sa 2 svi članovi se dele sa 2.', 'eksplicitni',
    { mediji: ravan(-2, 8, -2, 6, [pr(-1 / 2, 3, -2, 8, -2, 6, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Prava paralelna sa $y$-osom koja prolazi kroz $x = 3$ u implicitnom obliku glasi…',
    ['$x − 3 = 0$', '$y − 3 = 0$', '$3x = 0$', '$x + 3 = 0$'],
    'Ako je $b = 0$, zapis je $ax + c = 0$. Za $x = 3$ to je $x − 3 = 0$. Vertikalna prava nije grafik funkcije $y = f(x)$.', 'vertikalna',
    { mediji: ravan(-2, 6, -3, 3, [dz([3, -3], [3, 3], { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Prava $y − 2 = 0$ je…',
    ['paralelna sa $x$-osom', 'paralelna sa $y$-osom', 'prolazi kroz koordinatni početak', 'seče $y$-osu u tački $(0, −2)$'],
    'Iz $y − 2 = 0$ je $y = 2$. To je horizontalna prava na visini 2, paralelna sa $x$-osom.', 'vodoravna',
    { mediji: ravan(-4, 4, -2, 6, [dz([-4, 2], [4, 2], { b: 1 })], { brojevi: 0 }) });

  Q(3, 'Gde seče $x$-osu prava $2x + 3y − 6 = 0$?',
    ['$(3, 0)$', '$(6, 0)$', '$(0, 2)$', '$(−3, 0)$'],
    'Na $x$-osi je $y = 0$, pa je $2x − 6 = 0$ i $x = 3$. Tačka $(0, 2)$ je presek sa $y$-osom.', 'presek',
    { mediji: ravan(-2, 6, -2, 4, [pr(-2 / 3, 2, -2, 6, -2, 4, { b: 1 })], { brojevi: 0 }) });

  Q(3, 'Kolika je vrednost $n$ ako prava $x − y + n = 0$ prolazi kroz $(2, 5)$?',
    ['3', '−3', '7', '−7'],
    'Zamenimo: $2 − 5 + n = 0$, pa je $n = 3$. Provera: $2 − 5 + 3 = 0$.', 'zamena',
    { mediji: ravan(-2, 6, -4, 8, [pr(1, 3, -2, 6, -4, 8, { b: 1 }), tk('K', { b: 3 })], { t: { K: [2, 5] }, bez: ['K'], brojevi: 0 }) });

  Q(2, 'Koja tvrdnja o pravoj $x = 2$ je tačna?',
    ['paralelna je sa $y$-osom', 'paralelna je sa $x$-osom', 'prolazi kroz koordinatni početak', 'seče $y$-osu u tački $(0, 2)$'],
    'Sve tačke prave $x = 2$ imaju apscisu 2, pa je prava paralelna sa $y$-osom. Ona seče $x$-osu u tački $(2, 0)$.', 'vertikalna',
    { mediji: ravan(-2, 6, -3, 3, [dz([2, -3], [2, 3], { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Zapiši u implicitnom obliku linearnu funkciju sa $k = −1$ i $n = 10$.',
    ['$x + y − 10 = 0$', '$x − y + 10 = 0$', '$x + y + 10 = 0$', '$−x + y − 10 = 0$'],
    'Iz $y = −x + 10$ prebacimo sve na levu stranu: $x + y − 10 = 0$. Provera za $x = 0$: $y = 10$ i $0 + 10 − 10 = 0$.', 'implicitni',
    { mediji: ravan(-2, 12, -2, 12, [pr(-1, 10, -2, 12, -2, 12, { b: 1 })], { brojevi: 0 }) });

  Q(2, 'Da li tačka $(1, 2)$ pripada pravoj $2x + y − 4 = 0$?',
    ['Da, jer je $2 · 1 + 2 − 4 = 0$', 'Ne, jer je $2 · 1 + 2 − 4 = 1$', 'Ne, jer je $2 · 1 + 2 − 4 = −2$', 'Da, jer je $2 · 1 + 2 + 4 = 8$'],
    'Tačka pripada pravoj ako njene koordinate zadovoljavaju jednačinu. Uvrstimo $x = 1$ i $y = 2$: dobijamo 0, pa tačka leži na pravoj.', 'pripadanje',
    { mediji: ravan(-2, 5, -3, 6, [pr(-2, 4, -2, 5, -3, 6, { b: 1 }), tk('T', { b: 3 })], { t: { T: [1, 2] }, bez: ['T'], brojevi: 0 }) });

  Q(1, 'Koja je jednačina prave $y = 4$ u implicitnom obliku?',
    ['$y − 4 = 0$', '$x − 4 = 0$', '$4y = 0$', '$y + 4 = 0$'],
    'Prebacimo 4 na levu stranu: $y − 4 = 0$. Ta jednačina nema $x$, pa je prava paralelna sa $x$-osom.', 'implicitni',
    { mediji: ravan(-4, 4, -2, 6, [dz([-4, 4], [4, 4], { b: 1 })], { brojevi: 0 }) });

  U(2, 'Koji zapis NIJE u implicitnom obliku linearne funkcije?',
    ['$y = 2x − 3$', '$2x + y − 3 = 0$', '$x − 2y + 4 = 0$', '$5x − 1 = 0$'],
    'Zapis $y = 2x − 3$ je eksplicitni oblik. Ostala tri su oblika $ax + by + c = 0$, a $5x − 1 = 0$ je poseban slučaj kad je $b = 0$.', 'Reč implicitni potiče od latinskog implicitus, što znači nešto što nije direktno izraženo.', 'implicitni',
    { mediji: ravan(-2, 4, -6, 6, [pr(2, -3, -2, 4, -6, 6, { b: 1 })], { brojevi: 0 }) });

  S(2, 'Poveži oblik zapisa sa primerom',
    [['$y = kx + n$', 'eksplicitni oblik'], ['$ax + by + c = 0$', 'implicitni oblik'], ['$x − 3 = 0$', 'prava paralelna sa $y$-osom'], ['$y − 2 = 0$', 'prava paralelna sa $x$-osom']],
    'Sva četiri zapisa opisuju prave: eksplicitni je pogodan za crtanje, a implicitni za nule i preseke.', 'oblici',
    { mediji: ravan(-2, 4, -2, 6, [pr(1, 0, -2, 4, -2, 6, { b: 1 })], { brojevi: 0 }) });

  // ════════════════ 6.9 „Čitanje“ grafika linearne funkcije ════════════════
  L('Čitanje grafika linearne funkcije');

  Q(1, 'Na grafiku prave $y = \\frac{1}{2}x + 2$ koja je nula funkcije?',
    ['−4', '4', '2', '−2'],
    'Nula je presek sa $x$-osom. Na grafiku se vidi da prava seče $x$-osu levo od $y$-ose, u tački sa apscisom $−4$. Provera: $\\frac{1}{2} · (−4) + 2 = 0$.', 'nula',
    { mediji: ravan(-6, 4, -3, 5, [pr(1 / 2, 2, -6, 4, -3, 5, { b: 1 })], { ose: ['x', 'y'], podela: [1, 1] }) });

  Q(1, 'Sa grafika prave $y = −x + 3$ pročitaj slobodan član $n$.',
    ['3', '−3', '1', '−1'],
    'Slobodan član je vrednost $y$ kad je $x = 0$, a to je tačka u kojoj prava seče $y$-osu. Na grafiku je to visina 3.', 'odsečak',
    { mediji: ravan(-2, 5, -2, 6, [pr(-1, 3, -2, 5, -2, 6, { b: 1 })], { ose: ['x', 'y'], podela: [1, 1] }) });

  Q(2, 'Za koju vrednost $x$ je $y = 3$ na grafiku prave $y = \\frac{1}{2}x + 2$?',
    ['2', '3', '6', '1'],
    'Iz $3 = \\frac{1}{2}x + 2$ je $\\frac{1}{2}x = 1$, pa je $x = 2$. Na grafiku se vidi da prava na visini 3 dolazi do $x = 2$.', 'čitanje',
    { mediji: ravan(-2, 8, -2, 7, [pr(1 / 2, 2, -2, 8, -2, 7, { b: 1 })], { ose: ['x', 'y'], podela: [1, 1] }) });

  Q(2, 'Za koje $x$ je $y > 0$ na grafiku prave $y = x − 2$?',
    ['$x > 2$', '$x < 2$', '$x > 0$', '$x < −2$'],
    'Vrednost $y$ je pozitivna kad je grafik iznad $x$-ose, a to je desno od nule $x = 2$.', 'znak',
    { mediji: ravan(-2, 6, -4, 4, [pr(1, -2, -2, 6, -4, 4, { b: 1 })], { ose: ['x', 'y'], podela: [1, 1] }) });

  Q(3, 'Količina soka u rezervoaru: $y = 100 − 3x$ litara posle $x$ dana. Posle koliko dana ostane 28 litara?',
    ['24', '28', '12', '33'],
    'Iz $28 = 100 − 3x$ je $3x = 72$, pa je $x = 24$. Na grafiku se vidi da je to tačka gde linija prolazi kroz visinu 28.', 'rezervoar',
    { mediji: ravan(0, 36, 0, 100, [dz([0, 100], [33, 1], { b: 1 })], { ose: ['~dana', '~l'], podela: [6, 20] , brojevi: 0 }),
      medijiOdgovora: ravan(0, 36, 0, 100, [dz([0, 100], [33, 1], { b: 1 })], { ose: ['~dana', '~l'], podela: [6, 20] }) });

  Q(3, 'Prihod od berača malina je $P = 1000x − 3000$ evra. Koliko berača treba da prihod bude 7000 evra?',
    ['10', '7', '4', '13'],
    'Iz $7000 = 1000x − 3000$ dobijamo $1000x = 10000$, pa je $x = 10$. Na grafiku se to vidi na apscisi 10.', 'prihod',
    { mediji: ravan(0, 12, -4, 10, [dz([0, -3], [12, 9], { b: 1 })], { ose: ['~berača', '~hilj.'], podela: [1, 2] , brojevi: 0 }),
      medijiOdgovora: ravan(0, 12, -4, 10, [dz([0, -3], [12, 9], { b: 1 })], { ose: ['~berača', '~hilj.'], podela: [1, 2] }) });

  Q(2, 'Cena vožnje taksijem je $c = 60x + 150$ dinara. Koliko košta vožnja 4 km?',
    ['390 din', '240 din', '150 din', '450 din'],
    'Za $x = 4$ je $c = 240 + 150 = 390$ dinara. Vrednost 240 bi bila samo cena po kilometrima, bez starta.', 'taksi',
    { mediji: ravan(0, 10, 0, 800, [dz([0, 150], [10, 750], { b: 1 })], { ose: ['~km', '~din'], podela: [1, 200] , brojevi: 0 }),
      medijiOdgovora: ravan(0, 10, 0, 800, [dz([0, 150], [10, 750], { b: 1 })], { ose: ['~km', '~din'], podela: [1, 200] }) });

  Q(2, 'Sveća na grafiku: koliko milimetara ostane posle 60 minuta?',
    ['180 mm', '240 mm', '120 mm', '60 mm'],
    'Dužina je $300 − 2 · 60 = 180$ mm. Sa grafika se čita visina na apscisi 60 min.', 'sveća',
    { mediji: ravan(0, 150, 0, 300, [dz([0, 300], [150, 0], { b: 1 })], { ose: ['~min', '~mm'], podela: [30, 60] }) });

  Q(3, 'Grafik funkcije $y = x + 1$. Za koje $x$ važi $−2 < y < 4$?',
    ['$−3 < x < 3$', '$−2 < x < 4$', '$−1 < x < 5$', '$−4 < x < 2$'],
    'Ako je $−2 < x + 1 < 4$, oduzmemo 1 i dobijamo $−3 < x < 3$. Sa grafika čitamo: između visina $−2$ i $4$ prava pokriva apscise od $−3$ do $3$.', 'interval',
    { mediji: ravan(-6, 6, -4, 6, [pr(1, 1, -6, 6, -4, 6, { b: 1 })], { ose: ['x', 'y'], podela: [1, 1] }) });

  Q(1, 'Za grafik $y = −2x + 4$, kolika je vrednost $y$ za $x = 1$?',
    ['2', '6', '−2', '4'],
    'Sa grafika čitamo visinu prave iznad apscise 1. Računski: $−2 · 1 + 4 = 2$.', 'vrednost',
    { mediji: ravan(-2, 4, -3, 7, [pr(-2, 4, -2, 4, -3, 7, { b: 1 })], { ose: ['x', 'y'], podela: [1, 1] }) });

  Q(2, 'Sa grafika prave $y = 2x − 4$: za koje $x$ je $y = 0$?',
    ['$x = 2$', '$x = −2$', '$x = 4$', '$x = 0$'],
    'Tačka gde prava seče $x$-osu je nula funkcije. Ovde je $2x − 4 = 0$ za $x = 2$.', 'nula',
    { mediji: ravan(-2, 6, -6, 6, [pr(2, -4, -2, 6, -6, 6, { b: 1 })], { ose: ['x', 'y'], podela: [1, 1] }) });

  Q(3, 'Sa grafika čitamo da je za $x = 2$ vrednost $y = 1$, a za $x = 6$ vrednost $y = 5$. Koliko je $n$?',
    ['−1', '1', '3', '−3'],
    'Nagib je $k = \\frac{5 − 1}{6 − 2} = 1$. Iz $1 = 1 · 2 + n$ dobijamo $n = −1$. Grafik prolazi kroz $(0, −1)$.', 'čitanje',
    { mediji: ravan(-2, 8, -3, 7, [dz([2, 1], [6, 5], { b: 1 }), tk('A', { b: 1 }), tk('B', { b: 1 })], { t: { A: [2, 1], B: [6, 5] }, bez: [], ose: ['x', 'y'], podela: [1, 1] }) });

  Q(3, 'Sa grafika vidimo da se $y$ smanji za 2 kad $x$ poraste za 1, a za $x = 0$ je $y = 3$. Koja je funkcija?',
    ['$y = −2x + 3$', '$y = 2x + 3$', '$y = −2x − 3$', '$y = −3x + 2$'],
    'Koeficijent je $k = −2$, jer se $y$ smanjuje za 2 po jedinici $x$, a slobodan član je $n = 3$.', 'čitanje',
    { mediji: ravan(-2, 4, -4, 8, [pr(-2, 3, -2, 4, -4, 8, { b: 1 })], { ose: ['x', 'y'], podela: [1, 1] }) });

  Q(2, 'Koliko je $y$ za $x = −2$ kod grafika $y = \\frac{3}{2}x + 1$?',
    ['−2', '−4', '2', '4'],
    'Računamo $\\frac{3}{2} · (−2) + 1 = −3 + 1 = −2$. Na grafiku se vidi da je tačka na visini $−2$ levo od $y$-ose.', 'vrednost',
    { mediji: ravan(-4, 4, -5, 7, [pr(3 / 2, 1, -4, 4, -5, 7, { b: 1 })], { ose: ['x', 'y'], podela: [1, 1] }) });

  U(2, 'Koja tačka NE pripada grafiku $y = 2x − 1$ sa slike?',
    ['$(0, −3)$', '$(1, 1)$', '$(2, 3)$', '$(3, 5)$'],
    'Za $x = 0$ je $y = −1$, pa tačka $(0, −3)$ nije na grafiku. Ostale tri zadovoljavaju jednačinu: $2 · 1 − 1 = 1$, $2 · 2 − 1 = 3$, $2 · 3 − 1 = 5$.', 'Očitavanje sa crteža nije uvek tačno: kad vrednost nije ceo broj, proveri je računom.', 'čitanje',
    { mediji: ravan(-2, 4, -4, 7, [pr(2, -1, -2, 4, -4, 7, { b: 1 })], { ose: ['x', 'y'], podela: [1, 1] }) });

  S(3, 'Poveži deo grafika sa rešenjem nejednačine',
    [['presek sa $x$-osom', 'nula funkcije'], ['presek sa $y$-osom', 'slobodan član $n$'], ['deo iznad $x$-ose', 'rešenje $y > 0$'], ['deo između $y = −2$ i $y = 2$', 'rešenje $−2 < y < 2$']],
    'Čitanje grafika je nacrtani odgovor na pitanje: kad je $y$ veće, manje ili između zadatih vrednosti.', 'čitanje',
    { mediji: ravan(-4, 4, -4, 4, [pr(1, 0, -4, 4, -4, 4, { b: 1 })], { ose: ['x', 'y'], podela: [1, 1] }) });
};
