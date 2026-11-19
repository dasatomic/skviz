// Tema 3 (drugi deo): Racionalni brojevi – deljenje, izrazi, jednačine i nejednačine (lekcije 3.6–3.9)
// Pomoćni crteži ove teme (vaga/klackalica, drvo izraza, zrak rešenja na brojevnoj pravoj) su u
// module.exports.crtezi – koristi ih i teorija (alati/matematika-teorija-6/5-racionalni-b.js).

// ── razlomci za proveru računa: [brojilac, imenilac] ──
const nzd = (a, b) => (b ? nzd(b, a % b) : Math.abs(a));
const F = (a, b = 1) => { const d = nzd(a, b) * Math.sign(b); return [a / d, b / d]; };
const plus = (x, y) => F(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
const minus = (x, y) => F(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
const puta = (x, y) => F(x[0] * y[0], x[1] * y[1]);
const kroz = (x, y) => F(x[0] * y[1], x[1] * y[0]);
const je = (x, y) => x[0] * y[1] === x[1] * y[0];
const razlomci = { F, plus, minus, puta, kroz, je };

function crtezi(A) {
  const { G, O, bez, r, krug } = A;
  const g = (e, vel = 280) => G(O, e, { ...bez, velicina: vel });
  const pr = (x, y, w, h, x2 = {}) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((p) => p.map(r)), zatv: 1, ...x2 });

  // ── vaga (klackalica): levo/desno su nizovi predmeta: 'x', '3', '−2', '2/3·x' ili { t, b, id, k, kraj, pomeri, prazno }
  // nagib: 0 ravnoteža (jednačina), 1 – leva strana teža (dole), −1 – desna teža; natpis iznad (npr. '/ − 3')
  function vaga(levo, desno, { nagib = 0, natpis, znak, k, vel = 320 } = {}) {
    const n = nagib * 0.7;
    const yL = -n, yD = n, X = 4.8;
    const kx = k !== undefined ? { k } : {};
    const e = [
      { lin: [[0, 0], [0.9, -1.7], [-0.9, -1.7]], zatv: 1, b: 4, gusto: 1, ...kx },
      { lin: [[-1.7, -1.7], [1.7, -1.7]], b: 4, debljina: 4, ...kx },
      { lin: [[-X, yL], [X, yD]], b: 5, debljina: 5, ...kx },
    ];
    let vrh = 1;
    const tas = (stvari, xe, ye) => {
      e.push({ lin: [[xe, ye], [xe, ye + 0.35]], b: 4, debljina: 3, ...kx }, { ...pr(xe - 2.4, ye + 0.35, 4.8, 0.22, { b: 4, gusto: 1 }), ...kx });
      // raspored u redove (najviše 4,2 jedinice širine)
      const st = stvari.map((s) => (typeof s === 'string' ? { t: s } : s)).map((s) => ({ ...s, w: Math.max(1.1, 0.36 * [...s.t].length + 0.5) }));
      const redovi = [[]];
      let sir = 0;
      for (const s of st) {
        if (sir + s.w > 4.6 && redovi.at(-1).length) { redovi.push([]); sir = 0; }
        redovi.at(-1).push(s); sir += s.w + 0.08;
      }
      redovi.forEach((red, ri) => {
        const ukupno = red.reduce((a, s) => a + s.w + 0.08, -0.08);
        let x = xe - ukupno / 2;
        const y = ye + 0.6 + ri * 1.2;
        vrh = Math.max(vrh, y + 1.1);
        for (const s of red) {
          const boja = s.b ?? (/[a-z]/.test(s.t) ? 1 : /^[−-]/.test(s.t) ? 4 : 3);
          const dod = { ...(s.id ? { id: s.id } : {}), ...(s.k !== undefined ? { k: s.k } : kx), ...(s.kraj !== undefined ? { kraj: s.kraj } : {}), ...(s.pomeri ? { pomeri: s.pomeri, kasni: s.kasni ?? 0.6, trajanje: 1.2 } : {}) };
          e.push(pr(x, y, s.w, 1.1, { b: boja, ...(s.prazno ? { prazno: 1 } : { gusto: 1 }), ...dod }));
          e.push({ tx: s.t, at: [r(x + s.w / 2), r(y + 0.38)], vel: 19, ...dod });
          x += s.w + 0.08;
        }
      });
    };
    tas(levo, -X, yL);
    tas(desno, X, yD);
    if (znak) e.push({ tx: znak, at: [0, 0.55], vel: 24, b: 3, ...kx });
    if (natpis) e.push({ tx: natpis, at: [0, r(Math.max(vrh, 1.8) + 0.4)], vel: 18, b: 2, ...kx });
    return g(e, vel);
  }

  // ── drvo izraza: čvor je tekst (list) ili { op, l, r, v (vrednost), k (korak vrednosti), id }
  function drvo(koren, { dx = 1.5, dy = 1.6, vel = 280 } = {}) {
    const e = [];
    let list = 0;
    const raspored = (c, d) => {
      if (typeof c === 'string') return { c, x: list++ * dx, y: -d * dy };
      const L = raspored(c.l, d + 1), D = raspored(c.r, d + 1);
      return { c, x: (L.x + D.x) / 2, y: -d * dy, L, D };
    };
    const crtaj = (n) => {
      if (n.L) {
        for (const p of [n.L, n.D]) e.push({ lin: [[r(n.x), r(n.y)], [r(p.x), r(p.y)]], b: 4, debljina: 2 });
        crtaj(n.L); crtaj(n.D);
        const id = n.c.id ? { id: n.c.id } : {};
        e.push(krug(r(n.x), r(n.y), 0.42, { b: 1, gusto: 1, ...id }));
        e.push({ tx: n.c.op, at: [r(n.x), r(n.y - 0.12)], vel: 19, ...id });
        if (n.c.v !== undefined) e.push({ tx: '= ' + n.c.v, at: [r(n.x + 0.62 + 0.12 * n.c.v.length), r(n.y + 0.25)], b: 2, vel: 17, ...(n.c.k !== undefined ? { k: n.c.k } : {}) });
      } else {
        const w = Math.max(0.8, 0.28 * [...n.c].length + 0.35);
        e.push(pr(r(n.x - w / 2), r(n.y - 0.42), w, 0.8, { b: 3, gusto: 1 }));
        e.push({ tx: n.c, at: [r(n.x), r(n.y - 0.12)], vel: 16 });
      }
    };
    crtaj(raspored(koren, 0));
    return g(e, vel);
  }

  // ── brojevna prava sa skupom rešenja nejednačine: zrak od x ulevo/udesno, ○ (bez x) ili ● (sa x)
  const osa = (a, b, n = 1, x = {}) => ({ osa: [a, b], podela: 1 / n, svaki: n, ...x });
  const zrak = (x, levo, ukljuceno, od, doo, x2 = {}) => [
    { lin: [[x, 0.3], [levo ? od - 0.3 : doo + 0.3, 0.3]], b: 2, debljina: 5, str: 1, crtaj: 1, ...x2 },
    { tx: ukljuceno ? '●' : '○', at: [x, 0.2], b: 2, vel: 22, ...x2 },
  ];
  const tacke = (lista, x2 = {}) => lista.map((v) => ({ tx: '●', at: [v, 0.02], b: 1, ...x2 }));
  const natpisi = (lista, x2 = {}) => lista.map(([v, t]) => ({ tx: t, at: [v, 0.85], b: 3, vel: 15, ...x2 }));

  // dvojni razlomak a/b nad c/d: glavna crta duža i deblja; boje = spoljašnji (a, d) i unutrašnji (b, c) članovi
  function dvojni(a, b, c, d, { boje = false, glavna = false } = {}) {
    const sp = boje ? { b: 1 } : {}, un = boje ? { b: 2 } : {};
    return g([
      { tx: a, at: [0, 2.2], vel: 24, ...sp }, { lin: [[-0.8, 1.8], [0.8, 1.8]], b: 4, debljina: 2 }, { tx: b, at: [0, 1.05], vel: 24, ...un },
      { lin: [[-1.6, 0.6], [1.6, 0.6]], b: glavna ? 1 : 4, debljina: 5, ...(glavna ? { id: 'g' } : {}) },
      { tx: c, at: [0, -0.1], vel: 24, ...un }, { lin: [[-0.8, -0.6], [0.8, -0.6]], b: 4, debljina: 2 }, { tx: d, at: [0, -1.35], vel: 24, ...sp },
      ...(glavna ? [{ tx: '← glavna', at: [3.1, 0.45], vel: 16, b: 1 }] : []),
    ], 170);
  }

  return { g, pr, vaga, drvo, osa, zrak, tacke, natpisi, dvojni };
}

module.exports = (A) => {
  const { L, Z, K, R, proveri, skokovi, traka } = A;
  const { g, vaga, drvo, osa, zrak, tacke, dvojni } = crtezi(A);

  // ════════════════ 3.6 Deljenje racionalnih brojeva ════════════════
  L('Deljenje racionalnih brojeva');

  Z(1, 'Izračunaj: $(−{3|4}) : {3|8}$.',
    ['$−2$', '$2$', '$−{9|32}$', '$−{1|2}$'],
    [K('Deljenje je množenje recipročnim brojem: $(−{3|4}) : {3|8} = (−{3|4}) · {8|3}$.'),
     K('$= −{3 · 8|4 · 3} = −{24|12} = −2$. Znak: minus kroz plus daje minus.'),
     K('Na brojevnoj pravoj: od $0$ do $−{3|4}$ staju tačno dva koraka dužine ${3|8}$ – ali se ide ulevo, pa je rezultat $−2$.', ['s'])],
    R(g([osa(-1, 0.5, 8, { svaki: 2 }), ...skokovi(0, -0.375, 2, { boja: 1, id: 's', h: 0.35 })], 300)));
  proveri(je(kroz(F(-3, 4), F(3, 8)), F(-2)), '−3/4 : 3/8');

  Z(1, 'Koliko puta ${2|5}$ staje u $−4$? Izračunaj $−4 : {2|5}$.',
    ['$−10$', '$10$', '$−{8|5}$', '$−1{3|5}$'],
    [K('$−4 : {2|5} = −4 · {5|2} = −{20|2} = −10$.'),
     K('Deset koraka po ${2|5}$ ulevo od nule stiže tačno do $−4$.', ['s'])],
    R(g([osa(-4, 0.4, 5, { svaki: 5 }), ...skokovi(0, -0.4, 10, { boja: 2, id: 's', razmak: 0.3, h: 0.5 })], 320)));
  proveri(je(kroz(F(-4), F(2, 5)), F(-10)), '−4 : 2/5');

  Z(1, 'Koji je broj recipročan broju $−1,25$?',
    ['$−{4|5}$', '${4|5}$', '$1,25$', '$−{5|4}$'],
    [K('$−1,25 = −{125|100} = −{5|4}$.'),
     K('Recipročan broj ima zamenjen brojilac i imenilac, a znak ostaje isti: $−{4|5}$.'),
     K('Provera: $(−{5|4}) · (−{4|5}) = 1$ ✓ (recipročni brojevi daju proizvod $1$, ne $0$ – to su suprotni brojevi). Oba broja su na istoj, negativnoj strani nule.', ['b'])],
    R(A.brojevna(-2, 0.5, [[-1.25, '−5/4'], [-0.8, '−4/5', 2, { id: 'b' }]], { podela: 0.25, svaki: 4 })));
  proveri(je(puta(F(-5, 4), F(-4, 5)), F(1)), 'recipročni −5/4');

  Z(2, 'Izračunaj: $2{1|3} : (−{7|9})$.',
    ['$−3$', '$3$', '$−{49|27}$', '$−{1|3}$'],
    [K('Mešoviti broj pretvaramo u razlomak: $2{1|3} = {7|3}$.'),
     K('${7|3} : (−{7|9}) = {7|3} · (−{9|7}) = −{63|21} = −3$.'),
     K('Slika: ${7|9}$ staje u ${7|3} = {21|9}$ tačno tri puta; znaci su različiti, pa je količnik $−3$.', ['s'])],
    R(g([osa(0, 2.5, 9, { svaki: 9 }), ...A.skokovi(0, 7 / 9, 3, { boja: 2, id: 's', h: 0.5 })], 300)));
  proveri(je(kroz(F(7, 3), F(-7, 9)), F(-3)), '2 1/3 : (−7/9)');

  Z(2, 'Izračunaj: $(−2,4) : (−0,6)$.',
    ['$4$', '$−4$', '$0,4$', '$1,44$'],
    [K('Minus kroz minus daje plus.'),
     K('$2,4 : 0,6 = 24 : 6 = 4$ (pomnožili smo deljenik i delilac sa $10$).'),
     K('Četiri dela od po $0,6$ čine $2,4$.', ['s'])],
    R(g([osa(-2.4, 0.2, 5, { svaki: 5 }), ...skokovi(0, -0.6, 4, { boja: 1, id: 's' })], 320)));
  proveri(Math.abs(-2.4 / -0.6 - 4) < 1e-9, '−2,4 : −0,6');

  Z(2, 'Izračunaj dvojni razlomak: ${−{5|6}|{10|9}}$.',
    ['$−{3|4}$', '$−{4|3}$', '$−{25|27}$', '${3|4}$'],
    [K('Dvojni razlomak je deljenje: $(−{5|6}) : {10|9}$.'),
     K('Spoljašnji članovi idu u brojilac, unutrašnji u imenilac: $−{5 · 9|6 · 10} = −{45|60}$.'),
     K('Skraćujemo sa $15$: $−{3|4}$.')],
    R(dvojni('−5', '6', '10', '9', { boje: true })));
  proveri(je(kroz(F(-5, 6), F(10, 9)), F(-3, 4)), 'dvojni −5/6 / 10/9');

  Z(2, 'Za koji broj $x$ je količnik $(−18) : x$ jednak ${3|2}$?',
    ['$x = −12$', '$x = 12$', '$x = −27$', '$x = −{1|12}$'],
    [K('Delilac = deljenik : količnik: $x = (−18) : {3|2}$.'),
     K('$x = −18 · {2|3} = −12$. Provera: $(−18) : (−12) = {3|2}$ ✓', [], vaga(['−18 : (−12)'], ['3/2']))],
    vaga(['−18 : x'], ['3/2']));
  proveri(je(kroz(F(-18), F(-12)), F(3, 2)), '−18 : −12');

  Z(2, 'Izračunaj: ${[(−24) : 6] : (−2)} : (−{1|2})$.',
    ['$−4$', '$4$', '$−1$', '$−16$'],
    [K('Prvo najdublja zagrada: $(−24) : 6 = −4$.', ['a']),
     K('Zatim $(−4) : (−2) = 2$.', ['b']),
     K('Na kraju $2 : (−{1|2}) = 2 · (−2) = −4$. (Deliti sa ${1|2}$ znači udvostručiti.)', ['c'])],
    drvo({ op: ':', id: 'c', v: '−4', k: 3, l: { op: ':', id: 'b', v: '2', k: 2, l: { op: ':', id: 'a', v: '−4', k: 1, l: '−24', r: '6' }, r: '−2' }, r: '−1/2' }));
  proveri(je(kroz(kroz(kroz(F(-24), F(6)), F(-2)), F(-1, 2)), F(-4)), 'lanac deljenja');

  Z(3, 'Bokal ima $1,8$ l soka. Sipamo ga u čaše od po ${3|10}$ l. Koliko čaša možemo napuniti?',
    ['$6$', '$5$', '$54$', '$0,54$'],
    [K('Tražimo koliko puta ${3|10}$ staje u $1,8$: $1,8 : {3|10} = {18|10} · {10|3}$.'),
     K('$= {18|3} = 6$ čaša.', ['c'])],
    R(g([...traka(6, 6, { w: 9, h: 1.2, id: 'c' }), { tx: '1,8 l', at: [4.5, 1.8], vel: 18 }, ...[0, 1, 2, 3, 4, 5].map((i) => ({ tx: '0,3', at: [0.75 + i * 1.5, 0.45], vel: 14 }))], 300)));
  proveri(je(kroz(F(18, 10), F(3, 10)), F(6)), '1,8 : 0,3');

  Z(3, 'Proizvod dva broja je $−{4|9}$. Jedan činilac je $1{1|3}$. Koliki je drugi?',
    ['$−{1|3}$', '$−{16|27}$', '$−3$', '${1|3}$'],
    [K('Nepoznati činilac = proizvod : poznati činilac.'),
     K('$1{1|3} = {4|3}$, pa je $x = (−{4|9}) : {4|3} = −{4|9} · {3|4} = −{12|36} = −{1|3}$.'),
     K('Provera: ${4|3} · (−{1|3}) = −{4|9}$ ✓', [], vaga(['x'], ['−1/3']))],
    vaga(['4/3 · x'], ['−4/9']));
  proveri(je(puta(F(4, 3), F(-1, 3)), F(-4, 9)), 'činilac −1/3');

  // ════════════════ 3.7 Izrazi sa racionalnim brojevima ════════════════
  L('Izrazi sa racionalnim brojevima');

  Z(1, 'Izračunaj: $2 + (3 − 7) : {1|4}$.',
    ['$−14$', '$−1$', '$−4$', '$18$'],
    [K('Prvo zagrada: $3 − 7 = −4$.', ['a']),
     K('Zatim deljenje: $(−4) : {1|4} = −4 · 4 = −16$.', ['b']),
     K('Na kraju sabiranje: $2 + (−16) = −14$. (Greška $−1$ nastaje kad se saberu $2$ i $−4$ pre deljenja.)', ['c'])],
    drvo({ op: '+', id: 'c', v: '−14', k: 3, l: '2', r: { op: ':', id: 'b', v: '−16', k: 2, l: { op: '−', id: 'a', v: '−4', k: 1, l: '3', r: '7' }, r: '1/4' } }));
  proveri(je(plus(F(2), kroz(minus(F(3), F(7)), F(1, 4))), F(-14)), '2 + (3−7):1/4');

  Z(1, 'Izračunaj: $−{1|2} + {1|2} · (−6)$.',
    ['$−3{1|2}$', '$0$', '$−{1|2}$', '$2{1|2}$'],
    [K('Množenje ima prednost: ${1|2} · (−6) = −3$.', ['a']),
     K('$−{1|2} + (−3) = −3{1|2}$. (Ko prvo sabere, dobije $0 · (−6) = 0$ – pogrešno.)', ['b'])],
    drvo({ op: '+', id: 'b', v: '−3½', k: 2, l: '−1/2', r: { op: '·', id: 'a', v: '−3', k: 1, l: '1/2', r: '−6' } }));
  proveri(je(plus(F(-1, 2), puta(F(1, 2), F(-6))), F(-7, 2)), '−1/2 + 1/2·(−6)');

  Z(1, 'Kolika je vrednost izraza $3x − {1|2}$ za $x = −{1|2}$?',
    ['$−2$', '$−1$', '$1$', '$−3{1|2}$'],
    [K('Zamenimo $x$: $3 · (−{1|2}) = −{3|2}$.', ['a']),
     K('$−{3|2} − {1|2} = −{4|2} = −2$.', ['b'])],
    drvo({ op: '−', id: 'b', v: '−2', k: 2, l: { op: '·', id: 'a', v: '−3/2', k: 1, l: '3', r: 'x = −½' }, r: '1/2' }, { dx: 1.8 }));
  proveri(je(minus(puta(F(3), F(-1, 2)), F(1, 2)), F(-2)), '3x − 1/2');

  Z(2, 'Primeni distributivnost: ${3|7} · (−5) + {4|7} · (−5)$.',
    ['$−5$', '$5$', '$−{5|7}$', '$−10$'],
    [K('Zajednički činilac $(−5)$ izvlačimo ispred zagrade: $({3|7} + {4|7}) · (−5)$.', ['z']),
     K('${3|7} + {4|7} = 1$, pa je rezultat $1 · (−5) = −5$.')],
    g([...traka(7, [0, 1, 2], { w: 7, h: 1, b: 1 }), ...traka(7, [3, 4, 5, 6], { w: 7, h: 1, b: 2 }).filter((x) => x.gusto), { tx: '3/7 + 4/7 = 1 ceo', at: [3.5, 1.6], vel: 17, k: 1, id: 'z' }], 260));
  proveri(je(plus(puta(F(3, 7), F(-5)), puta(F(4, 7), F(-5))), F(-5)), 'distributivnost');

  Z(2, 'Izračunaj: $[({2|3} : {5|7}) : {14|15}]$.',
    ['$1$', '${4|9}$', '${7|5}$', '${14|15}$'],
    [K('U zagradi: ${2|3} : {5|7} = {2|3} · {7|5} = {14|15}$.', ['a']),
     K('${14|15} : {14|15} = 1$ – svaki broj (osim nule) podeljen samim sobom daje $1$.', ['b'])],
    drvo({ op: ':', id: 'b', v: '1', k: 2, l: { op: ':', id: 'a', v: '14/15', k: 1, l: '2/3', r: '5/7' }, r: '14/15' }));
  proveri(je(kroz(kroz(F(2, 3), F(5, 7)), F(14, 15)), F(1)), '[(2/3 : 5/7) : 14/15]');

  Z(2, 'Razliku brojeva $3$ i $5$ podeli njihovim proizvodom.',
    ['$−{2|15}$', '${2|15}$', '$−{15|2}$', '$−{8|15}$'],
    [K('Razlika: $3 − 5 = −2$; proizvod: $3 · 5 = 15$.'),
     K('$(−2) : 15 = −{2|15}$.')],
    drvo({ op: ':', l: { op: '−', l: '3', r: '5' }, r: { op: '·', l: '3', r: '5' } }));
  proveri(je(kroz(minus(F(3), F(5)), puta(F(3), F(5))), F(-2, 15)), '(3−5):(3·5)');

  Z(2, 'Mira ima $1 500$ dinara, Saša $400$ dinara manje od Mire, a Jovan $200$ dinara više od polovine onoga što imaju Mira i Saša zajedno. Koliko imaju svo troje?',
    ['$4 100$ dinara', '$3 900$ dinara', '$2 600$ dinara', '$4 300$ dinara'],
    [K('Saša: $1 500 − 400 = 1 100$ dinara.', ['s']),
     K('Jovan: ${1|2} · (1 500 + 1 100) + 200 = 1 300 + 200 = 1 500$ dinara.', ['j']),
     K('Zajedno: $1 500 + 1 100 + 1 500 = 4 100$ dinara.')],
    R(g([{ lin: [[0, 2], [5, 2], [5, 2.8], [0, 2.8]], zatv: 1, b: 0, gusto: 1 }, { tx: 'Mira 1 500', at: [2.5, 2.25], vel: 15 },
      { lin: [[0, 1], [3.667, 1], [3.667, 1.8], [0, 1.8]], zatv: 1, b: 2, gusto: 1, id: 's' }, { tx: 'Saša 1 100', at: [1.83, 1.25], vel: 15 },
      { lin: [[0, 0], [5, 0], [5, 0.8], [0, 0.8]], zatv: 1, b: 1, gusto: 1, id: 'j' }, { tx: 'Jovan 1 500', at: [2.5, 0.25], vel: 15 }], 260)));
  proveri(1500 + 1100 + ((1500 + 1100) / 2 + 200) === 4100, 'Mira, Saša, Jovan');

  Z(3, 'Prvi broj je dva puta veći od drugog, a dva puta manji od trećeg. Zbir sva tri je $−42$. Koji je prvi broj?',
    ['$−12$', '$−6$', '$−24$', '$−14$'],
    [K('Neka je drugi broj $a$. Tada je prvi $2a$, a treći $4a$.', ['d']),
     K('$a + 2a + 4a = 7a = −42$, pa je $a = −6$.'),
     K('Prvi broj je $2 · (−6) = −12$ (treći je $−24$). Provera: $−12 − 6 − 24 = −42$ ✓')],
    R(g([...traka(7, [0], { w: 7, h: 0.9, b: 2, id: 'd' }), ...traka(7, [1, 2], { w: 7, h: 0.9, b: 1 }).filter((x) => x.gusto), ...traka(7, [3, 4, 5, 6], { w: 7, h: 0.9, b: 3 }).filter((x) => x.gusto),
      { tx: 'drugi', at: [0.5, 1.4], vel: 14 }, { tx: 'prvi', at: [2, 1.4], vel: 14 }, { tx: 'treći', at: [5, 1.4], vel: 14 }, { tx: 'ukupno −42', at: [3.5, -0.6], vel: 16 }], 280)));
  proveri(-6 + -12 + -24 === -42, 'tri broja');

  Z(3, 'Koliko puta je zbir brojeva $2,5$ i ${5|3}$ veći od njihove razlike?',
    ['$5$ puta', '$3$ puta', '$4$ puta', '${25|6}$ puta'],
    [K('$2,5 = {5|2}$. Zbir: ${5|2} + {5|3} = {15|6} + {10|6} = {25|6}$.'),
     K('Razlika: ${15|6} − {10|6} = {5|6}$.'),
     K('${25|6} : {5|6} = {25|6} · {6|5} = 5$ puta: razlika staje u zbir tačno pet puta.', ['r'])],
    R(g([...traka(25, 25, { w: 10, h: 0.8, b: 1 }), { tx: 'zbir 25/6', at: [5, 1.3], vel: 15 }, ...traka(5, 5, { w: 10, h: 0.8, y: -1.4, b: 2, id: 'r' }), ...[0, 1, 2, 3, 4].map((i) => ({ tx: '5/6', at: [1 + 2 * i, -1.15], vel: 14 }))], 300)));
  proveri(je(kroz(plus(F(5, 2), F(5, 3)), minus(F(5, 2), F(5, 3))), F(5)), 'zbir/razlika');

  Z(3, 'Izračunaj vrednost izraza $(x − 1) : y$ za $x = −{1|3}$ i $y = −{2|3}$.',
    ['$2$', '$−2$', '${8|9}$', '$1$'],
    [K('$x − 1 = −{1|3} − 1 = −{4|3}$.', ['a']),
     K('$(−{4|3}) : (−{2|3}) = {4|3} · {3|2} = 2$ (minus kroz minus je plus).', ['b'])],
    drvo({ op: ':', id: 'b', v: '2', k: 2, l: { op: '−', id: 'a', v: '−4/3', k: 1, l: 'x', r: '1' }, r: 'y' }));
  proveri(je(kroz(minus(F(-1, 3), F(1)), F(-2, 3)), F(2)), '(x−1):y');

  // ════════════════ 3.8 Jednačine sa jednom nepoznatom ════════════════
  L('Jednačine sa jednom nepoznatom');

  Z(1, 'Reši jednačinu: $x + {3|4} = −{1|4}$.',
    ['$x = −1$', '$x = {1|2}$', '$x = −{1|2}$', '$x = 1$'],
    [K('Vaga je u ravnoteži. Skidamo ${3|4}$ sa obe strane: $/ − {3|4}$.', ['m'], vaga(['x', { t: '3/4', id: 'm', pomeri: [0, 2.2] }], ['−1/4', { t: '−3/4', b: 4, k: 0 }], { natpis: '/ − 3/4' })),
     K('Levo ostaje samo $x$: $x = −{1|4} − {3|4} = −{4|4} = −1$.', [], vaga(['x'], ['−1'])),
     K('Provera: $−1 + {3|4} = −{1|4}$ ✓')],
    vaga(['x', '3/4'], ['−1/4']));
  proveri(je(plus(F(-1), F(3, 4)), F(-1, 4)), 'x + 3/4 = −1/4');

  Z(1, 'Reši jednačinu: $x − 2,5 = −4$.',
    ['$x = −1,5$', '$x = −6,5$', '$x = 1,5$', '$x = 6,5$'],
    [K('Dodajemo $2,5$ na obe strane: $/ + 2,5$.', ['d'], vaga(['x', '−2,5', { t: '2,5', id: 'd', k: 0 }], ['−4', { t: '2,5', id: 'd' }], { natpis: '/ + 2,5' })),
     K('$x = −4 + 2,5 = −1,5$.', [], vaga(['x'], ['−1,5'])),
     K('Provera: $−1,5 − 2,5 = −4$ ✓')],
    vaga(['x', '−2,5'], ['−4']));
  proveri(Math.abs(-1.5 - 2.5 - -4) < 1e-9, 'x − 2,5 = −4');

  Z(1, 'Reši jednačinu: $−{2|3}x = 6$.',
    ['$x = −9$', '$x = −4$', '$x = 9$', '$x = −{1|9}$'],
    [K('Da bi levo ostalo samo $x$, množimo obe strane recipročnim brojem: $/ · (−{3|2})$.'),
     K('$x = 6 · (−{3|2}) = −9$.', [], vaga(['x'], ['−9'])),
     K('Provera: $−{2|3} · (−9) = 6$ ✓')],
    vaga(['−2/3 · x'], ['6']));
  proveri(je(puta(F(-2, 3), F(-9)), F(6)), '−2/3 x = 6');

  Z(2, 'Reši jednačinu: $x : (−{3|5}) = 2$.',
    ['$x = −{6|5}$', '$x = −{10|3}$', '$x = {6|5}$', '$x = −{3|10}$'],
    [K('Nepoznat deljenik = količnik · delilac: $/ · (−{3|5})$.'),
     K('$x = 2 · (−{3|5}) = −{6|5} = −1{1|5}$.'),
     K('Provera: $(−{6|5}) : (−{3|5}) = {6|5} · {5|3} = 2$ ✓')],
    vaga(['x : (−3/5)'], ['2']));
  proveri(je(kroz(F(-6, 5), F(-3, 5)), F(2)), 'x : (−3/5) = 2');

  Z(2, 'Reši jednačinu: $2x + 3 = −5$.',
    ['$x = −4$', '$x = −1$', '$x = 1$', '$x = −16$'],
    [K('Skidamo $3$ sa obe strane: $/ − 3$. Levo ostaje $2x$, desno $−5 − 3 = −8$.', ['m'], vaga(['x', 'x', { t: '3', id: 'm', pomeri: [0, 2.4] }], ['−5', { t: '−3', id: 'm' }], { natpis: '/ − 3' })),
     K('Dve kutije $x$ teže $−8$, pa jedna teži $−8 : 2 = −4$: $/ : 2$.', ['x'], vaga([{ t: 'x', id: 'x' }, 'x'], ['−8'], { natpis: '/ : 2' })),
     K('$x = −4$. Provera: $2 · (−4) + 3 = −5$ ✓', [], vaga(['x'], ['−4']))],
    vaga(['x', 'x', '3'], ['−5']));
  proveri(2 * -4 + 3 === -5, '2x + 3 = −5');

  Z(2, 'Reši jednačinu: $−{3|4} − z = {1|2}$.',
    ['$z = −1{1|4}$', '$z = 1{1|4}$', '$z = −{1|4}$', '$z = {1|4}$'],
    [K('Nepoznati umanjilac: $/ + z − {1|2}$, pa je $−{3|4} − {1|2} = z$.'),
     K('$z = −{3|4} − {2|4} = −{5|4} = −1{1|4}$.'),
     K('Provera: $−{3|4} − (−{5|4}) = {2|4} = {1|2}$ ✓', [], vaga(['−3/4', '−(−5/4)'], ['1/2']))],
    vaga(['−3/4', '−z'], ['1/2']));
  proveri(je(minus(F(-3, 4), F(-5, 4)), F(1, 2)), '−3/4 − z = 1/2');

  Z(2, 'Za koji broj $x$ važi $0 · x = 5$?',
    ['ni za jedan – nema rešenja', 'za $x = 5$', 'za $x = 0$', 'za svaki broj $x$'],
    [K('Bilo koji broj pomnožen nulom daje $0$, a ne $5$.'),
     K('Zato jednačina $0 · x = 5$ nema rešenje: vaga nikad nije u ravnoteži. (Jednačina $0 · x = 0$ bi, naprotiv, važila za svaki broj.)')],
    R(vaga(['0 · x'], ['5'], { nagib: -1, znak: '≠' })));

  Z(3, 'Reši jednačinu: ${x − 1|2} − 3x = 2$.',
    ['$x = −1$', '$x = 1$', '$x = −{3|5}$', '$x = −{1|5}$'],
    [K('Množimo obe strane sa $2$ da nestane razlomak: $x − 1 − 6x = 4$.'),
     K('Sređujemo levu stranu: $−5x − 1 = 4$, pa $/ + 1$: $−5x = 5$.'),
     K('$/ : (−5)$: $x = −1$. Provera: ${−2|2} − 3 · (−1) = −1 + 3 = 2$ ✓')],
    vaga(['(x − 1)/2', '−3x'], ['2']));
  proveri(je(minus(kroz(F(-1 - 1), F(2)), puta(F(3), F(-1))), F(2)), '(x−1)/2 − 3x = 2');

  Z(3, 'Treba presuti $4,5$ l vode iz kofe u flaše od $0,7$ l. Koliko je najmanje flaša potrebno?',
    ['$7$', '$6$', '$6{3|7}$', '$65$'],
    [K('$f · 0,7 = 4,5$, pa je $f = 4,5 : 0,7 = {45|7} = 6{3|7}$.'),
     K('Šest flaša nije dovoljno (ostaje ${3|7}$ flaše vode), a flaše ne možemo deliti – treba $7$ flaša.', ['f'])],
    R(g([...traka(7, [0, 1, 2, 3, 4, 5], { w: 9.1, h: 1.3, b: 0 }), ...traka(7, [6], { w: 9.1, h: 1.3, b: 1, id: 'f' }).filter((x) => x.gusto), { tx: '6 pune + 3/7 sedme', at: [4.55, 2], vel: 17 }], 300)));
  proveri(je(kroz(F(45, 10), F(7, 10)), F(45, 7)), '4,5 : 0,7');

  Z(3, 'Zamislila sam broj, oduzela od njega ${1|3}$, razliku podelila sa $−2$ i dobila ${5|6}$. Koji sam broj zamislila?',
    ['$−1{1|3}$', '$1{1|3}$', '$−2$', '$−{1|3}$'],
    [K('Jednačina: $(x − {1|3}) : (−2) = {5|6}$.'),
     K('Idemo unazad: $x − {1|3} = {5|6} · (−2) = −{5|3}$.'),
     K('$x = −{5|3} + {1|3} = −{4|3} = −1{1|3}$. Provera: $(−{4|3} − {1|3}) : (−2) = −{5|3} : (−2) = {5|6}$ ✓')],
    vaga(['(x − 1/3) : (−2)'], ['5/6']));
  proveri(je(kroz(minus(F(-4, 3), F(1, 3)), F(-2)), F(5, 6)), 'zamišljen broj');

  // ════════════════ 3.9 Nejednačine sa jednom nepoznatom ════════════════
  L('Nejednačine sa jednom nepoznatom');

  Z(1, 'Reši nejednačinu: $x + 1 ≤ −3$.',
    ['$x ≤ −4$', '$x ≤ −2$', '$x ≥ −4$', '$x < −4$'],
    [K('Oduzimamo $1$ sa obe strane – znak nejednakosti ostaje isti: $x ≤ −3 − 1$.'),
     K('$x ≤ −4$: pun kružić na $−4$ (i $−4$ je rešenje) i sve levo od njega.', ['z'])],
    R(g([osa(-7, 1), ...zrak(-4, true, true, -7, 1, { id: 'z' })], 300)));

  Z(1, 'Koji od brojeva nije rešenje nejednačine $x − 7 < −11$?',
    ['$−4$', '$−5$', '$−10$', '$−4,5$'],
    [K('$x < −11 + 7$, tj. $x < −4$.', ['z']),
     K('Broj $−4$ nije manji od samog sebe – prazan kružić. Brojevi $−4,5$, $−5$ i $−10$ jesu levo od $−4$.')],
    R(g([osa(-11, 0), ...zrak(-4, true, false, -11, 0, { id: 'z' }), ...tacke([-10, -5, -4.5], { b: 3 })], 300)));

  Z(1, 'Reši nejednačinu: $1 − x ≥ 5$.',
    ['$x ≤ −4$', '$x ≥ −4$', '$x ≥ 4$', '$x ≤ 4$'],
    [K('Dodamo $x$ i oduzmemo $5$ na obe strane (bez množenja negativnim brojem): $1 − 5 ≥ x$.'),
     K('$−4 ≥ x$, tj. $x ≤ −4$.', ['z']),
     K('Provera brojem $−5$: $1 − (−5) = 6 ≥ 5$ ✓; brojem $0$: $1 ≥ 5$ ✗.')],
    R(g([osa(-8, 2), ...zrak(-4, true, true, -8, 2, { id: 'z' })], 300)));

  Z(2, 'Reši nejednačinu: $−2x > 6$.',
    ['$x < −3$', '$x > −3$', '$x > 3$', '$x < 3$'],
    [K('Delimo obe strane sa $−2$. Deljenje negativnim brojem okreće znak – vaga „klacne“ na drugu stranu.', [], vaga(['x'], ['−3'], { nagib: -1, znak: '<', natpis: '/ : (−2)' })),
     K('$x < −3$. Provera: za $x = −4$ je $−2 · (−4) = 8 > 6$ ✓', ['z'], g([osa(-7, 2), ...zrak(-3, true, false, -7, 2, { id: 'z' })], 300))],
    vaga(['−2x'], ['6'], { nagib: 1, znak: '>' }));

  Z(2, 'Koliko celih brojeva zadovoljava nejednačinu $−3 < x ≤ 2$?',
    ['$5$', '$6$', '$4$', '$7$'],
    [K('Brojevi veći od $−3$ (bez $−3$), a najviše $2$ (sa $2$).', ['z']),
     K('To su $−2, −1, 0, 1, 2$ – ukupno $5$.', ['t'])],
    R(g([osa(-5, 4), { lin: [[-3, 0.3], [2, 0.3]], b: 2, debljina: 5, crtaj: 1, id: 'z' }, { tx: '○', at: [-3, 0.2], b: 2, vel: 22 }, { tx: '●', at: [2, 0.2], b: 2, vel: 22 }, ...tacke([-2, -1, 0, 1, 2], { k: 2, id: 't' })], 300)));

  Z(2, 'Reši nejednačinu: ${3|5}x ≤ {1|2}$.',
    ['$x ≤ {5|6}$', '$x ≥ {5|6}$', '$x ≤ {3|10}$', '$x ≤ {6|5}$'],
    [K('Množimo obe strane pozitivnim brojem ${5|3}$ – znak ostaje isti.'),
     K('$x ≤ {1|2} · {5|3} = {5|6}$.', ['z'])],
    R(g([osa(-1, 2, 6), ...zrak(5 / 6, true, true, -1, 2, { id: 'z' })], 300)));
  proveri(je(puta(F(1, 2), F(5, 3)), F(5, 6)), '3/5 x ≤ 1/2');

  Z(2, 'Koji je najmanji ceo broj koji zadovoljava $−{1|2}x < 2$?',
    ['$−3$', '$−4$', '$−5$', '$4$'],
    [K('Množimo sa $−2$ (negativan broj!) – znak se okreće: $x > −4$.', ['z']),
     K('Celi brojevi veći od $−4$: $−3, −2, −1, …$ – najmanji je $−3$.', ['t'])],
    R(g([osa(-7, 2), ...zrak(-4, false, false, -7, 2, { id: 'z' }), ...tacke([-3], { k: 2, id: 't' })], 300)));

  Z(3, 'Reši nejednačinu: $−0,4x + {1|5} < 1,5$.',
    ['$x > −3{1|4}$', '$x < −3{1|4}$', '$x > 3{1|4}$', '$x > −4{1|4}$'],
    [K('$/ − {1|5}$: $−0,4x < 1,5 − 0,2 = 1,3$.'),
     K('$/ : (−0,4)$ – delimo negativnim brojem, znak se okreće: $x > 1,3 : (−0,4) = −3,25$.'),
     K('$x > −3{1|4}$.', ['z'])],
    R(g([osa(-6, 1, 4, { svaki: 4 }), ...zrak(-3.25, false, false, -6, 1, { id: 'z' })], 320)));
  proveri(Math.abs(1.3 / -0.4 - -3.25) < 1e-9, '1,3 : (−0,4)');

  Z(3, 'Lift nosi najviše $600$ kg. U njemu je već $3$ osobe od po $75$ kg. Koliko se najviše sanduka od po $40$ kg može utovariti?',
    ['$9$', '$10$', '$15$', '$9,375$'],
    [K('$225 + 40s ≤ 600$, pa je $40s ≤ 375$.', [], vaga(['225', '40s'], ['600'], { nagib: -1, znak: '≤' })),
     K('$s ≤ 375 : 40 = 9,375$. Sanduk se ne deli, pa je najviše $9$ sanduka.', ['t'], g([osa(0, 11), ...zrak(9.375, true, true, 0, 11, { id: 'z' }), ...tacke([1, 2, 3, 4, 5, 6, 7, 8, 9], { id: 't' })], 300))]);
  proveri(3 * 75 + 9 * 40 <= 600 && 3 * 75 + 10 * 40 > 600, 'lift');

  Z(3, 'Za koje cele brojeve $x$ važi $−1 ≤ {x + 3|2} < 1$?',
    ['$−5, −4, −3, −2$', '$−5, −4, −3, −2, −1$', '$−4, −3, −2$', '$−2, −1, 0, 1$'],
    [K('Množimo sve tri strane sa $2$: $−2 ≤ x + 3 < 2$.'),
     K('Oduzmemo $3$: $−5 ≤ x < −1$.', ['z']),
     K('Celi brojevi: $−5, −4, −3, −2$ ($−5$ jeste, $−1$ nije).', ['t'])],
    R(g([osa(-7, 1), { lin: [[-5, 0.3], [-1, 0.3]], b: 2, debljina: 5, crtaj: 1, id: 'z' }, { tx: '●', at: [-5, 0.2], b: 2, vel: 22 }, { tx: '○', at: [-1, 0.2], b: 2, vel: 22 }, ...tacke([-5, -4, -3, -2], { k: 3, id: 't' })], 300)));
  for (const x of [-5, -4, -3, -2]) proveri(-1 <= (x + 3) / 2 && (x + 3) / 2 < 1, 'dvostruka ' + x);
  proveri(!(-1 <= (-1 + 3) / 2 && (-1 + 3) / 2 < 1) && !(-1 <= (-6 + 3) / 2), 'granice dvostruke');
};

module.exports.crtezi = crtezi;
module.exports.razlomci = razlomci;
