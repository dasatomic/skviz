// Lekcije 25–28: mnogougao (pojam i dijagonale, uglovi, pravilni mnogouglovi, konstrukcija).
// Pitanja su sopstvenim rečima, po gradivu Matematike 7 (Arhiknjiga); crteži su medij „geo“.
module.exports = ({ L, Q, U, S, G, r, naKrugu, proveri }) => {
  const IME = 'ABCDEFGHIJKLMNOP';
  // temena pravilnog n-tougla na kružnici (počinje od dna, kao u pravilni())
  const tacke = (n, R = 3, poc) => Array.from({ length: n }, (_, i) => naKrugu([0, 0], R, (poc ?? -90 - 180 / n) + (360 * i) / n));

  // pravilni n-tougao; bezOznaka = obris bez imena temena (za veće n)
  function pol(n, { R = 3, b = 0, e = [], dod = {}, poc, bezOznaka = n > 12 } = {}) {
    const P = tacke(n, R, poc);
    const t = { O: [0, 0], ...dod };
    if (bezOznaka) return G(t, [{ lin: [...P, P[0]], zatv: 1, b, gusto: 1 }, ...e], { bezImena: ['O'], velicina: 240 });
    P.forEach((p, i) => { t[IME[i]] = p; });
    return G(t, [{ p: IME.slice(0, n), b }, ...e], { bezImena: ['O'], velicina: 240 });
  }

  // dijagonale n-tougla (sve, ili samo iz temena iz – indeks 0 = A); crtaj = animacija iscrtavanja
  function diag(n, { iz = null, b = 1, crtaj = true } = {}) {
    const par = [];
    for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      if (iz === null || i === iz || j === iz) par.push([i, j]);
    }
    return par.map(([i, j], k) => ({ d: IME[i] + IME[j], b, debljina: 2, ...(crtaj ? { crtaj: 1, kasni: 0.3 + k * 0.25, trajanje: 0.7 } : {}) }));
  }

  // pravilni n-tougao sa produženim stranicama (isprekidano) i uglovima:
  // unutra = { indeks: oznaka } unutrašnji uglovi, spolja = { indeks: oznaka } spoljašnji (za produžene stranice)
  function uglovi(n, { R = 3, poc, produzi = [], unutra = {}, spolja = {}, b = 0, e = [] } = {}) {
    const P = tacke(n, R, poc);
    const t = { O: [0, 0] };
    P.forEach((p, i) => { t[IME[i]] = p; });
    const el = [{ p: IME.slice(0, n), b }];
    for (const i of produzi) {
      const V = P[i], Pr = P[(i - 1 + n) % n];
      t['x' + i] = [r(V[0] + (V[0] - Pr[0]) * 0.6), r(V[1] + (V[1] - Pr[1]) * 0.6)];
      el.push({ d: IME[i] + 'x' + i, isp: 1, b: 2 });
    }
    for (const [k, o] of Object.entries(unutra)) {
      const i = Number(k);
      el.push({ u: IME[(i - 1 + n) % n] + IME[i] + IME[(i + 1) % n], o, b: 1 });
    }
    for (const [k, o] of Object.entries(spolja)) {
      const i = Number(k);
      el.push({ u: 'x' + i + IME[i] + IME[(i + 1) % n], o, b: 2 });
    }
    return G(t, [...el, ...e], { bezImena: ['O'], velicina: 240 });
  }

  // ose simetrije pravilnog n-tougla (n osa, kroz centar), iscrtavaju se
  const osi = (n, { R = 3, b = 1 } = {}) => Array.from({ length: n }, (_, k) => {
    const a = ((-90 + (180 * k) / n) * Math.PI) / 180, Lq = R + 0.5;
    return { lin: [[r(-Lq * Math.cos(a)), r(-Lq * Math.sin(a))], [r(Lq * Math.cos(a)), r(Lq * Math.sin(a))]], b, debljina: 1.8, crtaj: 1, kasni: 0.2 + k * 0.25, trajanje: 0.8 };
  });

  // kvadrati nad stranicama pravilnog šestougla (stranica = R) i obris 12-tougla od slobodnih temena
  function kvadrati(R) {
    const P = tacke(6, R), e = [], obris = [];
    for (let i = 0; i < 6; i++) {
      const A = P[i], B = P[(i + 1) % 6];
      const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], Lm = Math.hypot(M[0], M[1]);
      const v = [(R * M[0]) / Lm, (R * M[1]) / Lm];
      const A2 = [r(A[0] + v[0]), r(A[1] + v[1])], B2 = [r(B[0] + v[0]), r(B[1] + v[1])];
      e.push({ lin: [A, B, B2, A2], zatv: 1, b: 2, gusto: 1, crtaj: 1, kasni: 0.3 * i, trajanje: 0.8 });
      obris.push(A2, B2);
    }
    e.push({ lin: [...obris, obris[0]], zatv: 1, b: 0, prazno: 1 });
    return e;
  }

  // zvezda (petokraka): dijagonale petougla po redu 0-2-4-1-3
  function zvezda() {
    const P = tacke(5, 3), t = {};
    P.forEach((p, i) => { t[IME[i]] = p; });
    const red = [0, 2, 4, 1, 3];
    return G(t, red.map((k, i) => ({ d: IME[k] + IME[red[(i + 1) % 5]], b: 1, debljina: 3 })), { velicina: 240 });
  }

  // ── provere računa (gradnja pukne ako nije tačno) ──
  proveri((6 * 3) / 2 === 9, 'D6 = 9');
  proveri((7 * 4) / 2 === 14, 'D7 = 14');
  proveri((8 * 5) / 2 === 20, 'D8 = 20');
  proveri((20 * 17) / 2 === 170, 'D20 = 170');
  proveri((53 * 50) / 2 === 1325 && 1325 / 53 === 25, 'D53 = 1325, 25 puta više');
  proveri((12 * 9) / 2 === 54 && 54 / 12 === 4.5, 'D12 = 54');
  proveri((9 * 6) / 2 === 27 && 27 === 3 * 9, 'D9 = 27 = 3·9');
  proveri((6 * 3) / 2 === 9 && 9 - 5 === 4, 'D6 − D5 = 4');
  proveri(!Array.from({ length: 30 }, (_, k) => k + 3).some((n) => (n * (n - 3)) / 2 === 7), '7 nije broj dijagonala');
  proveri(!Array.from({ length: 30 }, (_, k) => k + 3).some((n) => (n * (n - 3)) / 2 === 15), '15 nije broj dijagonala');
  proveri((13 - 2) * 180 === 1980 && (7 - 2) * 180 === 900 && (8 - 2) * 180 === 1080 && (12 - 2) * 180 === 1800 && (20 - 2) * 180 === 3240, 'zbirovi uglova');
  proveri((10 - 2) * 180 === 4 * 360, 'n = 10: zbir unutrašnjih = 4·zbir spoljašnjih');
  proveri(360 / 40 === 9 && 360 / 15 === 24 && 360 / 9 === 40 && 360 / 12 === 30, 'spoljašnji i centralni uglovi');
  proveri((9 - 2) * 180 / 9 === 140 && (10 - 2) * 180 / 10 === 144 && ((6 - 2) * 180) / 6 === 120, 'unutrašnji uglovi');
  proveri((12 - 2) * 180 / 12 === 150, 'unutrašnji ugao 12-tougla');
  proveri(180 - 36 === 144 && (180 - 36) / 2 === 72, 'karakteristični trougao desetougla');
  proveri(Math.abs(Math.sqrt(3) / 2 - Math.cos(Math.PI / 6)) < 1e-9, 'apotema šestougla = R√3/2');

  // ══════════ 25. Pojam mnogougla i broj dijagonala ══════════
  L('Pojam mnogougla i broj dijagonala');
  Q(1, 'Kako se zove figura u ravni ograničena zatvorenom izlomljenom linijom bez samopreseka?',
    ['Mnogougao', 'Krug', 'Duž', 'Ugao'],
    'Reč mnogougao je prevod grčke reči poligon: poli znači „mnogo“, a gonia „ugao“.', 'mnogougao',
    { mediji: pol(5, { bezOznaka: true }) });
  Q(1, 'Koliko najmanje temena može imati mnogougao?',
    ['3', '2', '4', '1'],
    'Zatvorena linija sa dva temena je samo duž „tamo i nazad“, bez površine. Najmanji mnogougao je trougao.', 'trougao',
    { medijiOdgovora: pol(3) });
  Q(1, 'Kako se zove mnogougao čije se stranice seku, kao kod petokrake zvezde?',
    ['Zvezdast', 'Konveksan', 'Pravilan', 'Prost'],
    'Petokraka zvezda se može nacrtati u jednom potezu olovke, ali njene stranice se seku. U elementarnoj geometriji se podrazumeva prost mnogougao.', 'zvezdast',
    { mediji: zvezda() });
  Q(2, 'Koliko dijagonala ima šestougao?',
    ['9', '18', '6', '12'],
    'U šestouglu iz svakog temena ima po tri dijagonale, ali se svaka dijagonala broji dvaput. Zato se broj deli sa 2.', 'dijagonala',
    { mediji: pol(6), medijiOdgovora: pol(6, { e: diag(6) }),
      zanimljivost: 'U građevinarstvu se koriste trouglovi, a ne četvorouglovi, jer se trougao ne može deformisati bez promene dužina stranica.' });
  Q(2, 'Koliko dijagonala izlazi iz jednog temena osmougla?',
    ['5', '7', '6', '8'],
    'Iz temena ne vodi dijagonala do dva susedna temena, jer su to stranice. Zato je 8 − 3 = 5.', 'temeno',
    { mediji: pol(8, { e: [{ tacka: 'A', b: 1 }] }), medijiOdgovora: pol(8, { e: diag(8, { iz: 0 }) }),
      zanimljivost: 'Osmougao ima ukupno 20 dijagonala, pa je iz jednog temena 5 od 20 – tačno četvrtina.' });
  Q(1, 'Koliko dijagonala ima četvorougao?',
    ['2', '4', '1', '0'],
    'Četvorougao ima dve dijagonale. Svaka spaja dva nesusedna temena.', 'četvorougao',
    { mediji: pol(4), medijiOdgovora: pol(4, { e: diag(4) }),
      zanimljivost: 'Kvadrat ima dve dijagonale koje su jednake i seku se pod pravim uglom.' });
  Q(1, 'Koliko dijagonala ima trougao?',
    ['0', '3', '1', '2'],
    'Iz svakog temena trougla mogu da se povuku duži samo do susednih temena, a to su stranice.', 'trougao',
    { mediji: pol(3), medijiOdgovora: { vrsta: 'formula', tekst: '$D₃ = \\frac{3\\cdot(3-3)}{2} = 0$' },
      zanimljivost: 'Trougao je jedini mnogougao koji je uvek konveksan, jer ne može da ima udubljenje.' });
  Q(3, 'Mnogougao ima 14 dijagonala. Koliko ima temena?',
    ['7', '6', '8', '14'],
    'Broj dijagonala je $n(n − 3) : 2$. Za $n = 7$ dobijamo $7 · 4 : 2 = 14$.', 'sedmougao',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$Dₙ = \\frac{n\\cdot(n-3)}{2} = 14$, pa je $n = 7$' },
      zanimljivost: 'Mnogougao sa 15 dijagonala ne postoji, jer broj 15 nije među brojevima dijagonala nijednog mnogougla.' });
  Q(2, 'Koliko dijagonala ima dvadesetougao?',
    ['170', '190', '360', '18'],
    'Iz svakog od 20 temena ima 17 dijagonala: 20 · 17 : 2 = 170.', 'konveksan',
    { mediji: pol(20, { bezOznaka: true }),
      zanimljivost: 'Pravilni mnogouglovi su uvek konveksni, pa sve njihove dijagonale leže unutar mnogougla.' });
  Q(3, 'Koliko dijagonala ima mnogougao sa 53 temena?',
    ['1325', '2650', '2703', '1275'],
    'Iz svakog temena ima 50 dijagonala: 53 · 50 : 2 = 1325.', 'temena',
    { mediji: pol(53, { bezOznaka: true }),
      zanimljivost: 'Mnogougao sa 53 temena ima tačno 25 puta više dijagonala nego stranica.' });
  Q(2, 'Koji mnogougao ima 9 dijagonala?',
    ['Šestougao', 'Petougao', 'Sedmougao', 'Devetougao'],
    '$D₆ = 6 · 3 : 2 = 9$. Šestougao ima 9 dijagonala.', 'šestougao',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$D₆ = \\frac{6\\cdot 3}{2} = 9$' },
      zanimljivost: 'Brojevi dijagonala mnogouglova redom: 2, 5, 9, 14, 20, 27, 35, 44, 54 …' });
  Q(3, 'Konveksni mnogougao ima tačno 3 puta više dijagonala nego stranica. Koliko ima temena?',
    ['9', '6', '12', '27'],
    'Uslov je $n(n − 3) : 2 = 3n$, pa je $n − 3 = 6$ i $n = 9$. Devetougao ima 27 dijagonala, a $27 = 3 · 9$.', 'stranica',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$D₉ = \\frac{9\\cdot 6}{2} = 27 = 3\\cdot 9$' },
      zanimljivost: 'Kod petougla je broj dijagonala tačno jednak broju stranica (5 i 5).' });
  Q(2, 'Za koliko dijagonala šestougao ima više od petougla?',
    ['4', '5', '9', '3'],
    'Petougao ima 5, a šestougao 9 dijagonala. Razlika je 4.', 'dijagonala',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$D₆ − D₅ = 9 − 5 = 4$' },
      zanimljivost: 'Razlika broja dijagonala dva susedna mnogougla raste za jedan: 2, 3, 4, …' });
  Q(2, 'Kakav je mnogougao na crtežu, ako dijagonala $AC$ izlazi van njega?',
    ['Nekonveksan', 'Konveksan', 'Pravilan', 'Zvezdast'],
    'Duž $AC$ leži van mnogougla, pa mnogougao nije konveksan: nije ceo „ispunjen“ između dve svoje tačke.', 'konveksan',
    { mediji: G({ A: [0, 0], B: [4, 2], C: [0, 4], D: [1, 2] }, [{ p: 'ABCD', b: 0 }], { velicina: 240 }),
      medijiOdgovora: G({ A: [0, 0], B: [4, 2], C: [0, 4], D: [1, 2] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 2, isp: 1, debljina: 3 }], { velicina: 240 }),
      zanimljivost: 'Kod nekonveksnog mnogougla neke dijagonale izlaze van njega.' });
  U(2, 'Koji od ovih brojeva NIJE moguć broj dijagonala nekog mnogougla?',
    ['7', '9', '14', '20'],
    'Brojevi dijagonala su 2, 5, 9, 14, 20, 27 … Broj 7 se među njima ne pojavljuje, jer $n(n − 3) : 2 = 7$ nema rešenje među prirodnim brojevima.',
    'Broj dijagonala je uvek ceo broj, ali nisu svi celi brojevi mogući brojevi dijagonala.', 'dijagonala');

  // ══════════ 26. Uglovi mnogougla ══════════
  L('Uglovi mnogougla');
  Q(1, 'Koliki je zbir unutrašnjih uglova trougla?',
    ['180°', '360°', '90°', '270°'],
    'Zbir unutrašnjih uglova trougla je 180°, bez obzira na oblik trougla.', 'zbir',
    { mediji: pol(3), zanimljivost: 'Zbir uglova trougla je isti za oštrougli, tupougli i pravougli trougao.' });
  Q(1, 'Koliki je zbir unutrašnjih uglova četvorougla?',
    ['360°', '180°', '720°', '540°'],
    'Četvorougao se jednom dijagonalom deli na dva trougla, pa je zbir 2 · 180° = 360°.', 'četvorougao',
    { mediji: pol(4), zanimljivost: 'Zbir uglova važi i za nekonveksne četvorouglove, koji imaju udubljenje.' });
  Q(2, 'Koliki je zbir unutrašnjih uglova petougla?',
    ['540°', '360°', '720°', '600°'],
    'Iz jednog temena petougla povučene dijagonale dele ga na tri trougla: 3 · 180° = 540°.', 'petougao',
    { mediji: pol(5),
      medijiOdgovora: pol(5, { e: [{ p: 'ABC', b: 1 }, { p: 'ACD', b: 2 }, { p: 'ADE', b: 3 }, ...diag(5, { iz: 0, b: 1 })] }),
      zanimljivost: 'Petougao ima 5 unutrašnjih i 5 spoljašnjih uglova; zbir spoljašnjih je 360° bez obzira na broj stranica.' });
  Q(2, 'Iz jednog temena šestougla povučene su sve dijagonale. Koliko trouglova nastaje?',
    ['4', '3', '6', '5'],
    'Šestougao se deli na $n − 2 = 4$ trougla.', 'trougao',
    { mediji: pol(6, { e: [{ tacka: 'A', b: 1 }] }),
      medijiOdgovora: pol(6, { e: [{ p: 'ABC', b: 1 }, { p: 'ACD', b: 2 }, { p: 'ADE', b: 3 }, { p: 'AEF', b: 4 }, ...diag(6, { iz: 0, b: 1 })] }),
      zanimljivost: 'Računari crtaju složene oblike u 3D grafici baš tako: kao mrežu trouglova.' });
  Q(2, 'Koliki je zbir unutrašnjih uglova osmougla?',
    ['1080°', '1440°', '900°', '1260°'],
    'Zbir unutrašnjih uglova $n$-tougla je $(n − 2) · 180°$. Za $n = 8$ je $6 · 180° = 1080°$.', 'osmougao',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(8-2)\\cdot 180° = 1080°$' },
      zanimljivost: 'Reč oktagon dolazi od grčkih reči okto (osam) i gonia (ugao).' });
  Q(3, 'Koliko stranica ima mnogougao čiji je zbir unutrašnjih uglova 1980°?',
    ['13', '11', '12', '14'],
    'Iz $(n − 2) · 180° = 1980°$ sledi $n − 2 = 11$, pa je $n = 13$.', 'stranica',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(n-2)\\cdot 180° = 1980°$, pa je $n-2 = 11$ i $n = 13$' },
      zanimljivost: 'Mnogougao sa 13 stranica ima zbir spoljašnjih uglova i dalje 360°.' });
  Q(2, 'Koliki je zbir spoljašnjih uglova konveksnog mnogougla?',
    ['360°', '180°', '540°', 'Zavisi od broja stranica'],
    'Kad obilazimo konveksni mnogougao i na svakom temenu skrenemo za spoljašnji ugao, jedan krug završimo tačno: zbir je 360°.', 'spoljašnji',
    { mediji: pol(5),
      medijiOdgovora: uglovi(5, { produzi: [0, 1, 2, 3, 4], spolja: { 0: '72°', 1: '72°', 2: '72°', 3: '72°', 4: '72°' } }),
      zanimljivost: 'Spoljašnji ugao je ugao između stranice i produžetka susedne stranice.' });
  Q(1, 'Koliki je spoljašnji ugao pravilnog šestougla?',
    ['60°', '120°', '720°', '30°'],
    'Spoljašnji uglovi pravilnog šestougla su jednaki: 360° : 6 = 60°.', 'šestougao',
    { mediji: pol(6), medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{360°}{6} = 60°$' },
      zanimljivost: 'Ako šetaš oko šestougla i na svakom temenu skreneš, na kraju si obišao tačno ceo krug.' });
  Q(1, 'Koliki je zbir unutrašnjeg i spoljašnjeg ugla u istom temenu mnogougla?',
    ['180°', '360°', '90°', 'Jednaki su'],
    'Stranica i produžetak susedne stranice čine ispruženi ugao, pa je unutrašnji ugao sa spoljašnjim 180°.', 'ugao',
    { mediji: uglovi(5, { produzi: [4] }),
      medijiOdgovora: uglovi(5, { produzi: [4], unutra: { 4: 'α' }, spolja: { 4: 'α₁' } }),
      zanimljivost: 'Zato se spoljašnji ugao računa kao 180° minus unutrašnji ugao.' });
  Q(3, 'Zbir unutrašnjih uglova mnogougla je četiri puta veći od zbira spoljašnjih. Koliko temena ima?',
    ['10', '8', '9', '12'],
    'Iz $(n − 2) · 180° = 4 · 360°$ sledi $n − 2 = 8$, pa je $n = 10$.', 'temena',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(n-2)\\cdot 180° = 4\\cdot 360°$, pa je $n-2 = 8$ i $n = 10$' },
      zanimljivost: 'Desetougao ima 35 dijagonala.' });
  Q(2, 'Zbir unutrašnjih uglova mnogougla je 900°. Koliko ima stranica?',
    ['7', '5', '6', '9'],
    'Iz $(n − 2) · 180° = 900°$ sledi $n − 2 = 5$, pa je $n = 7$.', 'mnogougao',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(n-2)\\cdot 180° = 900°$, pa je $n-2 = 5$ i $n = 7$' },
      zanimljivost: 'Ako mnogouglu dodamo jedno teme, zbir unutrašnjih uglova poraste za 180°.' });
  Q(2, 'Koliki je zbir unutrašnjih uglova ovog nekonveksnog četvorougla?',
    ['360°', '180°', '540°', '270°'],
    'Ako dijagonalom $BD$ podelimo četvorougao, dobijamo dva trougla: 2 · 180° = 360°.', 'nekonveksan',
    { mediji: G({ A: [0, 0], B: [4, 2], C: [0, 4], D: [1, 2] }, [{ p: 'ABCD', b: 0 }], { velicina: 240 }),
      medijiOdgovora: G({ A: [0, 0], B: [4, 2], C: [0, 4], D: [1, 2] }, [{ p: 'ABD', b: 1 }, { p: 'BCD', b: 2 }, { d: 'BD', b: 3, isp: 1 }], { velicina: 240 }),
      zanimljivost: 'I za nekonveksne mnogouglove važi $(n − 2) · 180°$ za zbir unutrašnjih uglova.' });
  Q(2, 'Pravilni mnogougao ima spoljašnji ugao 40°. Koliko stranica ima?',
    ['9', '8', '10', '36'],
    'Broj stranica je 360° : 40° = 9.', 'pravilan',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{360°}{40°} = 9$' },
      zanimljivost: 'Sa spoljašnjim uglom 40° mnogougao „skrene“ za ceo krug u devet koraka.' });
  Q(2, 'Pravilni mnogougao ima spoljašnji ugao 15°. Koliko stranica ima?',
    ['24', '20', '18', '30'],
    'Broj stranica je 360° : 15° = 24.', 'stranica',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{360°}{15°} = 24$' },
      zanimljivost: 'Što je više stranica, to je spoljašnji ugao manji; kod kruga bi bio beskonačno mali.' });
  Q(2, 'Na crtežu su označena dva unutrašnja ugla trougla. Koliki je treći?',
    ['70°', '80°', '60°', '90°'],
    'Zbir je 180°, pa je treći ugao 180° − 50° − 60° = 70°.', 'unutrašnji',
    { mediji: (() => {
      // trougao sa uglovima 50° kod A i 60° kod B (treći se računa)
      const cc = (5 * Math.sin((60 * Math.PI) / 180)) / Math.sin((70 * Math.PI) / 180);
      const C = [r(cc * Math.cos((50 * Math.PI) / 180)), r(cc * Math.sin((50 * Math.PI) / 180))];
      const ang = (u, v) => (Math.acos((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))) * 180) / Math.PI;
      proveri(Math.abs(ang([5, 0], C) - 50) < 0.05 && Math.abs(ang([-5, 0], [C[0] - 5, C[1]]) - 60) < 0.05, 'trougao 50°, 60°');
      return G({ A: [0, 0], B: [5, 0], C }, [{ p: 'ABC', b: 0 }, { u: 'CAB', o: '50°', b: 1 }, { u: 'ABC', o: '60°', b: 2 }], { velicina: 260 });
    })(),
      medijiOdgovora: { vrsta: 'formula', tekst: '$180° - 50° - 60° = 70°$' },
      zanimljivost: 'Isti trik radi za svaki trougao: kad znamo dva ugla, treći se dobija odmah.' });
  S(2, 'Spoji pravilni mnogougao sa zbirom njegovih unutrašnjih uglova.',
    [['Petougao', '540°'], ['Osmougao', '1080°'], ['Dvanaestougao', '1800°'], ['Dvadesetougao', '3240°']],
    'Svaka nova stranica dodaje 180° zbiru unutrašnjih uglova.', 'uglovi');

  // ══════════ 27. Pravilni mnogouglovi ══════════
  L('Pravilni mnogouglovi');
  Q(1, 'Kako se zove mnogougao čije su sve stranice i svi unutrašnji uglovi jednaki?',
    ['Pravilan', 'Konveksan', 'Zvezdast', 'Jednakokraki'],
    'Pravilan mnogougao ima sve stranice i sve unutrašnje uglove jednake.', 'pravilan',
    { mediji: pol(6),
      zanimljivost: 'Pčelinje saće se sastoji od ćelija u obliku (približno) pravilnih šestouglova, koji se bez praznina slažu jedan uz drugi.' });
  Q(1, 'Je li pravougaonik pravilan četvorougao?',
    ['Nije, jer nisu sve stranice jednake', 'Jeste, jer su svi uglovi pravi', 'Jeste, jer ima četiri stranice', 'Nije, jer nema osu simetrije'],
    'Svi uglovi pravougaonika su po 90°, ali njegove stranice nisu jednake. Zato nije pravilan.', 'stranica',
    { mediji: G({ A: [0, 0], B: [5, 0], C: [5, 3], D: [0, 3] }, [{ p: 'ABCD', b: 0 }], { velicina: 260 }),
      zanimljivost: 'Pravougaonik ima dve ose simetrije, a kvadrat četiri.' });
  Q(2, 'Koliki je unutrašnji ugao pravilnog šestougla?',
    ['120°', '60°', '150°', '108°'],
    'Unutrašnji ugao je $(n − 2) · 180° : n = 4 · 180° : 6 = 120°$.', 'šestougao',
    { mediji: pol(6),
      medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{(6-2)\\cdot 180°}{6} = 120°$' },
      zanimljivost: 'Tri unutrašnja ugla pravilnog šestougla stanu tačno oko jedne tačke (3 · 120° = 360°).' });
  Q(2, 'Koliki je unutrašnji ugao pravilnog desetougla?',
    ['144°', '135°', '150°', '162°'],
    'Unutrašnji ugao je (10 − 2) · 180° : 10 = 144°.', 'desetougao',
    { mediji: pol(10),
      medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{(10-2)\\cdot 180°}{10} = 144°$' },
      zanimljivost: 'Unutrašnji ugao pravilnog desetougla iznosi četiri petine ispruženog ugla.' });
  Q(2, 'Unutrašnji ugao pravilnog mnogougla je 150°. Koliko stranica ima?',
    ['12', '10', '8', '15'],
    'Iz $(n − 2) · 180° = 150° · n$ sledi $30n = 360$, pa je $n = 12$.', 'krug',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(n-2)\\cdot 180° = 150°\\cdot n$, pa je $n = 12$' },
      zanimljivost: 'Kad unutrašnji ugao raste prema 180°, mnogougao liči sve više na krug.' });
  Q(2, 'Koliki je centralni ugao označen na crtežu pravilnog devetougla?',
    ['40°', '36°', '45°', '20°'],
    'Centralni ugao je 360° : 9 = 40°.', 'centralni',
    { mediji: pol(9, { e: [{ d: 'OA', b: 1 }, { d: 'OB', b: 1 }, { u: 'AOB', b: 2 }] }),
      medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{360°}{9} = 40°$' },
      zanimljivost: 'Svi centralni uglovi pravilnog mnogougla zajedno čine pun ugao: $n · (360° : n) = 360°$.' });
  Q(2, 'Koliko osa simetrije ima pravilni osmougao?',
    ['8', '4', '16', '6'],
    'Pravilni mnogougao ima onoliko osa simetrije koliko ima temena: $n = 8$.', 'osa',
    { mediji: pol(8), medijiOdgovora: pol(8, { e: osi(8) }),
      zanimljivost: 'Pravilni mnogougao sa parnim brojem temena ima osu kroz dva suprotna temena i osu kroz sredine dve suprotne stranice.' });
  Q(2, 'Koji pravilni mnogougao NE može sam da popuni ravan bez praznina?',
    ['Petougao', 'Trougao', 'Četvorougao', 'Šestougao'],
    'Unutrašnji ugao petougla je 108°, a 360° nije deljivo sa 108°. Trougao (60°), četvorougao (90°) i šestougao (120°) se slažu.', 'saće',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$360° : 108° = 3,33…$' },
      zanimljivost: 'Među pravilnim mnogouglovima ravan sami popunjavaju samo trougao, kvadrat i šestougao.' });
  Q(1, 'Koliko osa simetrije ima pravilni trougao?',
    ['3', '6', '1', '4'],
    'Svaka osa simetrije jednakostraničnog trougla je ujedno visina, simetrala i težišna duž.', 'osa',
    { mediji: pol(3), medijiOdgovora: pol(3, { e: osi(3) }),
      zanimljivost: 'Jednakostranični trougao ima tri ose simetrije, koje se seku u centru.' });
  Q(3, 'Može li se oko ovog romba opisati kružnica?',
    ['Ne, jer nije kvadrat', 'Da, jer su stranice jednake', 'Da, jer su dijagonale jednake', 'Da, jer je paralelogram'],
    'Oko romba može da se opiše kružnica samo ako je kvadrat. Ovaj romb nije kvadrat, pa njegova temena nisu na istoj kružnici.', 'kružnica',
    { mediji: G({ A: [-3, 0], B: [0, -1.7], C: [3, 0], D: [0, 1.7] }, [{ p: 'ABCD', b: 0 }], { velicina: 260 }),
      medijiOdgovora: G({ O: [0, 0], A: [-3, 0], B: [0, -1.7], C: [3, 0], D: [0, 1.7] }, [{ p: 'ABCD', b: 0 }, { kr: 'O', r: 3, b: 1 }], { bezImena: ['O'], velicina: 260 }),
      zanimljivost: 'Oko paralelograma se može opisati kružnica samo ako je pravougaonik.' });
  Q(2, 'Kako se zove tačka u kojoj se seku simetrale uglova pravilnog mnogougla?',
    ['Centar', 'Težište', 'Ortocentar', 'Teme'],
    'Simetrale uglova pravilnog mnogougla se seku u centru. To je centar i opisane i upisane kružnice.', 'centar',
    { mediji: pol(5, { e: [0, 1, 2, 3, 4].map((i) => ({ d: IME[i] + 'O', b: 2, isp: 1 })) }),
      zanimljivost: 'Ista tačka je centar opisane i centar upisane kružnice pravilnog mnogougla.' });
  Q(2, 'Koliki je spoljašnji ugao pravilnog dvanaestougla?',
    ['30°', '150°', '60°', '36°'],
    'Spoljašnji ugao je 360° : 12 = 30°.', 'spoljašnji',
    { mediji: pol(12), medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{360°}{12} = 30°$' },
      zanimljivost: 'Spoljašnji ugao je isti kao centralni ugao pravilnog mnogougla.' });
  Q(3, 'Unutrašnji ugao pravilnog mnogougla je četiri puta veći od njegovog spoljašnjeg ugla. Koliko stranica ima?',
    ['10', '5', '8', '9'],
    'Iz $α + α₁ = 180°$ i $α = 4α₁$ sledi $α₁ = 36°$, pa je $n = 360° : 36° = 10$.', 'odnos',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$α + α₁ = 180°$, $α = 4α₁$, pa je $α₁ = 36°$ i $n = 360° : 36° = 10$' },
      zanimljivost: 'Pravilni desetougao ima unutrašnji ugao 144° i spoljašnji 36°, pa je njihov odnos tačno 4 : 1.' });
  Q(1, 'Koliki je unutrašnji ugao pravilnog trougla?',
    ['60°', '90°', '120°', '45°'],
    'Zbir uglova trougla je 180°, a u pravilnom trouglu su svi jednaki: 180° : 3 = 60°.', 'trougao',
    { mediji: pol(3), medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{180°}{3} = 60°$' },
      zanimljivost: 'Visina pravilnog trougla deli ga na dva pravougla trougla sa uglovima 30° i 60°.' });
  Q(1, 'Koliki je unutrašnji ugao kvadrata?',
    ['90°', '45°', '180°', '60°'],
    'Kvadrat je pravilan četvorougao, pa je unutrašnji ugao (4 − 2) · 180° : 4 = 90°.', 'kvadrat',
    { mediji: pol(4), medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{(4-2)\\cdot 180°}{4} = 90°$' },
      zanimljivost: 'Kvadrati popunjavaju ravan bez praznina, kao polja šahovske table.' });
  U(1, 'Koji od ovih mnogouglova NIJE pravilan?',
    ['Pravougaonik', 'Jednakostranični trougao', 'Kvadrat', 'Pravilni šestougao'],
    'Pravougaonik ima sve uglove jednake (po 90°), ali njegove stranice nisu jednake.',
    'Vrata, prozori i kartice su skoro uvek pravougaonici: nisu pravilni, ali su im svi uglovi pravi.', 'uglovi');

  // ══════════ 28. Konstrukcija pravilnih mnogouglova ══════════
  L('Konstrukcija pravilnih mnogouglova');
  Q(1, 'Kad šestarom konstruišemo pravilni šestougao, njegova stranica je jednaka čemu?',
    ['Poluprečniku opisane kružnice', 'Prečniku opisane kružnice', 'Poluprečniku upisane kružnice', 'Dvostrukom poluprečniku'],
    'Stranica pravilnog šestougla jednaka je poluprečniku opisane kružnice, pa šestar „sam“ nanosi temena na kružnicu.', 'šestar',
    { mediji: G({ O: [0, 0], A: [3, 0] }, [{ kr: 'O', r: 3, b: 4 }, { tacka: 'A', b: 1 }], { bezImena: ['O'], velicina: 240 }),
      medijiOdgovora: pol(6, { e: [{ kr: 'O', r: 3, b: 4, crtaj: 1 }, { kr: 'A', r: 3, b: 2, crtaj: 1, kasni: 0.9 }, { kr: 'D', r: 3, b: 2, crtaj: 1, kasni: 1.3 }] }),
      zanimljivost: 'Šest lukova istog poluprečnika uklapa se tačno u kružnicu, pa dobijamo šest temena.' });
  Q(1, 'Ugao pri vrhu karakterističnog trougla je 120°. Koji mnogougao konstruišemo?',
    ['Jednakostranični trougao', 'Kvadrat', 'Šestougao', 'Osmougao'],
    'Karakteristični trougao ima dva kraka jednaka poluprečniku, a ugao 120° odgovara trouglu sa tri stranice (360° : 3).', 'trougao',
    { medijiOdgovora: pol(3, { e: [{ d: 'OA', b: 1 }, { d: 'OB', b: 1 }, { u: 'AOB', o: '120°', b: 2 }] }),
      zanimljivost: 'Karakteristični trougao je trougao čija su temena centar kružnice i dva susedna temena mnogougla.' });
  Q(2, 'Stranica kvadrata upisanog u kružnicu poluprečnika $R$ jednaka je:',
    ['$R√2$', '$R$', '$2R$', '$R√3$'],
    'Dijagonala kvadrata je prečnik $2R$, a stranica je $2R : √2 = R√2$.', 'kvadrat',
    { mediji: pol(4, { poc: 45, e: [{ kr: 'O', r: 3, b: 4 }] }),
      medijiOdgovora: pol(4, { poc: 45, e: [{ d: 'OA', o: 'R', b: 1 }, { d: 'OB', b: 1 }, { pu: 'AOB', b: 2 }, { d: 'AB', o: 'R√2', b: 2 }] }),
      zanimljivost: 'Dijagonala kvadrata upisanog u kružnicu jednaka je prečniku te kružnice.' });
  Q(1, 'Pravilni šestougao je upisan u kružnicu poluprečnika 4 cm. Kolika mu je stranica?',
    ['4 cm', '2 cm', '8 cm', '2√3 cm'],
    'Stranica pravilnog šestougla jednaka je poluprečniku opisane kružnice: 4 cm.', 'stranica',
    { mediji: G({ O: [0, 0], A: [4, 0] }, [{ kr: 'O', r: 4, b: 4 }, { d: 'OA', b: 1 }], { bezImena: ['O'], velicina: 240 }),
      medijiOdgovora: pol(6, { R: 4, e: [{ d: 'AB', o: '4 cm', b: 2 }] }),
      zanimljivost: 'Poluprečnik upisane kružnice šestougla je manji od stranice: 2√3 cm ≈ 3,46 cm.' });
  Q(2, 'Šestarom na kružnici redom nanosimo poluprečnik. Koliko puta treba to da uradimo da bismo se vratili na početnu tačku?',
    ['6', '4', '8', '12'],
    'Tetiva jednaka poluprečniku odgovara centralnom uglu 60°, pa je 360° : 60° = 6 koraka.', 'tetiva',
    { mediji: G({ O: [0, 0], A: [3, 0] }, [{ kr: 'O', r: 3, b: 4 }, { tacka: 'A', b: 1 }, { kr: 'A', r: 3, b: 2, crtaj: 1 }], { bezImena: ['O'], velicina: 240 }),
      medijiOdgovora: pol(6, { R: 3, e: [{ kr: 'O', r: 3, b: 4 }] }),
      zanimljivost: 'Tetiva jednaka poluprečniku odgovara centralnom uglu 60°, zato ih ima šest u punom krugu.' });
  Q(2, 'Pri konstrukciji pravilnog osmougla koristi se ugao od koliko stepeni?',
    ['45°', '30°', '60°', '22,5°'],
    'Centralni ugao osmougla je 360° : 8 = 45°, pa se njime konstruišu osnovni trouglovi.', 'osmougao',
    { mediji: pol(8, { e: [{ d: 'OA', b: 1 }, { d: 'OB', b: 1 }] }),
      medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{360°}{8} = 45°$' },
      zanimljivost: 'Ako kvadratu odsečemo četiri jednaka ugla tako da stranice budu jednake, dobijamo pravilni osmougao.' });
  Q(2, 'Nad svakom stranicom pravilnog šestougla konstruisan je kvadrat. Koji mnogougao čine slobodna temena kvadrata?',
    ['Dvanaestougao', 'Osmougao', 'Desetougao', 'Šestougao'],
    'Svaki kvadrat ima dva slobodna temena, pa dobijamo 6 · 2 = 12 temena dvanaestougla.', 'kvadrati',
    { mediji: pol(6, { bezOznaka: true }),
      medijiOdgovora: pol(6, { bezOznaka: true, e: kvadrati(3) }),
      zanimljivost: 'Procepi između kvadrata na temenima šestougla su jednakostranični trouglovi.' });
  U(3, 'Koji od ovih pravilnih mnogouglova NIJE moguće tačno konstruisati samo lenjirom i šestarom?',
    ['Sedmougao', 'Šestougao', 'Osmougao', 'Dvanaestougao'],
    'Pravilni sedmougao se ne može konstruisati samo lenjirom i šestarom. Šestougao, osmougao i dvanaestougao mogu.',
    'Vancel je 1837. godine dokazao da pravilni sedmougao ne može da se konstruiše samo lenjirom i šestarom.', 'lenjir',
    { medijiOdgovora: pol(7, { bezOznaka: true }) });
  Q(3, 'Karakteristični trougao pravilnog desetougla ima ugao pri vrhu 36°. Koliki su uglovi pri osnovici?',
    ['72°', '54°', '36°', '144°'],
    'Uglovi pri osnovici su $(180° − 36°) : 2 = 72°$.', 'osnovica',
    { mediji: pol(10, { e: [{ d: 'OA', b: 1 }, { d: 'OB', b: 1 }, { d: 'AB', b: 2 }] }),
      medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{180° - 36°}{2} = 72°$' },
      zanimljivost: 'Trougao sa uglovima 36°, 72° i 72° zove se zlatni trougao, a pojavljuje se i u pravilnom petouglu.' });
  Q(2, 'Kakav je karakteristični trougao pravilnog šestougla?',
    ['Jednakostranični', 'Jednakokraki pravougli', 'Jednakokraki tupougli', 'Raznostranični'],
    'Ugao pri vrhu je 360° : 6 = 60°, a kraci su jednaki poluprečniku, pa je trougao jednakostraničan.', 'šestougao',
    { medijiOdgovora: pol(6, { e: [{ d: 'OA', b: 1 }, { d: 'OB', b: 1 }, { u: 'AOB', o: '60°', b: 2 }] }),
      zanimljivost: 'Kad je poluprečnik jednak stranici, karakteristični trougao šestougla je jednakostraničan.' });
  Q(2, 'Ako je poluprečnik opisane kružnice pravilnog šestougla $R$, koliki je poluprečnik upisane kružnice?',
    ['$R√3/2$', '$R/2$', '$R√2/2$', '$R$'],
    'Poluprečnik upisane kružnice je visina karakterističnog trougla: $R · cos 30° = R√3/2$.', 'upisana',
    { mediji: pol(6, { e: [{ kr: 'O', r: 3, b: 4 }] }),
      medijiOdgovora: (() => {
        const P6 = tacke(6, 3);
        const M = [r((P6[0][0] + P6[1][0]) / 2), r((P6[0][1] + P6[1][1]) / 2)];
        return pol(6, { dod: { M }, e: [{ d: 'OA', o: 'R', b: 1 }, { d: 'OM', o: 'r', b: 2 }, { pu: 'OMB', b: 2 }] });
      })(),
      zanimljivost: 'Upisana kružnica šestougla dodiruje stranice u njihovim sredinama.' });
  Q(3, 'Stranica jednakostraničnog trougla upisanog u kružnicu poluprečnika $R$ jednaka je:',
    ['$R√3$', '$R$', '$R√2$', '$2R$'],
    'Karakteristični trougao ima ugao 120° pri vrhu i krake $R$, pa je stranica $R√3$.', 'tetiva',
    { mediji: pol(3, { e: [{ kr: 'O', r: 3, b: 4 }] }),
      medijiOdgovora: pol(3, { e: [{ d: 'OA', o: 'R', b: 1 }, { d: 'OB', o: 'R', b: 1 }, { u: 'AOB', o: '120°', b: 2 }] }),
      zanimljivost: 'Stranica jednakostraničnog trougla upisanog u krug je √3 puta veća od poluprečnika.' });
  Q(1, 'Šta je kružnica koja prolazi kroz sva temena pravilnog mnogougla?',
    ['Opisana', 'Upisana', 'Srednja', 'Dodirna'],
    'Kružnica koja prolazi kroz sva temena zove se opisana kružnica.', 'opisana',
    { medijiOdgovora: pol(5, { e: [{ kr: 'O', r: 3, b: 4 }] }),
      zanimljivost: 'Upisana kružnica dodiruje sve stranice mnogougla iznutra.' });
  Q(2, 'Nad stranicama pravilnog šestougla stranice 5 cm konstruisani su kvadrati. Kolika je stranica dvanaestougla od slobodnih temena?',
    ['5 cm', '5√2 cm', '10 cm', '5√3 cm'],
    'Stranica kvadrata je ujedno stranica dvanaestougla: 5 cm.', 'stranica',
    { mediji: pol(6, { R: 5 }),
      medijiOdgovora: pol(6, { R: 5, bezOznaka: true, e: kvadrati(5) }),
      zanimljivost: 'Stranice kvadrata i trouglova u procepima su iste, pa se stranice dvanaestougla nastavljaju jedna na drugu.' });
  S(2, 'Spoji pravilni mnogougao sa uglom pri vrhu njegovog karakterističnog trougla.',
    [['Trougao', '120°'], ['Kvadrat', '90°'], ['Šestougao', '60°'], ['Osmougao', '45°']],
    'Ugao pri vrhu karakterističnog trougla je centralni ugao: 360° podeljeno brojem stranica.', 'centralni');
};
