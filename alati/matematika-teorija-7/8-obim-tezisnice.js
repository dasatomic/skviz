// Lekcije 29–31: obim i površina mnogougla, ortocentar i težište trougla, složenije primene stavova podudarnosti.
// Crteži su geometrijski tačni (koordinate u cm); računi su provereni funkcijom proveri.
module.exports = ({ L, Q, U, S, G, proveri, r, pravilni }) => {
  // ── pomoćne funkcije za koordinate ──
  const sr = (a, b) => [r((a[0] + b[0]) / 2), r((a[1] + b[1]) / 2)];
  const tez = (...ps) => [r(ps.reduce((s, p) => s + p[0], 0) / ps.length), r(ps.reduce((s, p) => s + p[1], 0) / ps.length)];
  // podnožje normale iz tačke P na pravu AB
  const podnozje = (P, A, B) => {
    const dx = B[0] - A[0], dy = B[1] - A[1];
    const t = ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / (dx * dx + dy * dy);
    return [r(A[0] + t * dx), r(A[1] + t * dy)];
  };
  // presek pravih AB i CD
  const presek = (A, B, C, D) => {
    const [x1, y1] = A, [x2, y2] = B, [x3, y3] = C, [x4, y4] = D;
    const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    const a = x1 * y2 - y1 * x2, b = x3 * y4 - y3 * x4;
    return [r((a * (x3 - x4) - (x1 - x2) * b) / d), r((a * (y3 - y4) - (y1 - y2) * b) / d)];
  };
  const sve = (t) => Object.keys(t);
  // oznake stranica mnogougla sa spoljne strane (temena u nizu, npr. 'ABCDEF')
  const oznakeStr = (t, niz, tekst, f = 1.22) => {
    const c = tez(...niz.split('').map((n) => t[n]));
    return niz.split('').map((n, i) => {
      const m = sr(t[n], t[niz[(i + 1) % niz.length]]);
      return { tx: tekst[i], at: [r(c[0] + (m[0] - c[0]) * f), r(c[1] + (m[1] - c[1]) * f)] };
    });
  };
  // trouglovi od centra O do svake stranice šestougla (boje po redu)
  const SESTI = 'ABCDEF';
  const odCentra = (t, n) => Array.from({ length: n }, (_, i) => ({ p: 'O' + SESTI[i] + SESTI[(i + 1) % n], b: i }));

  // ══════════════════ 29. Obim i površina mnogougla ══════════════════
  L('Obim i površina mnogougla');

  const sh = pravilni(6, 3);
  Q(1, 'Koliki je obim pravilnog šestougla čija je stranica $a$?',
    ['$6a$', '$5a$', '$3a$', '$6a^{2}$'],
    'Obim je zbir dužina svih stranica, a šestougao ima šest jednakih stranica, pa je obim $6a$. Izraz $6a^{2}$ bi bio površina, a obim se meri u jedinicama dužine (cm), ne u cm².', 'obim',
    { mediji: G(sh, [{ p: SESTI, b: 0 }, oznakeStr(sh, SESTI, Array(6).fill('a'))], { bezImena: sve(sh), velicina: 240 }) });

  Q(1, 'Pravilni šestougao se podeli dužima od centra do svakog temena. Na koliko jednakih delova se podeli?',
    ['6', '3', '5', '12'],
    'Svaka duž od centra do temena odvaja po jedan trougao, pa ih ima šest. Svi su jednakostranični: dve stranice su poluprečnici, a ugao u centru je $360° : 6 = 60°$.', 'trougao',
    { mediji: G({ ...sh, O: [0, 0] }, [{ p: SESTI, b: 0 }], { bezImena: sve(sh), velicina: 240 }),
      medijiOdgovora: G({ ...sh, O: [0, 0] }, [odCentra(sh, 6), { tacka: 'O', b: 1 }], { bezImena: sve(sh), velicina: 240 }) });

  const trEq = { P: [-1, 0], Q: [1, 0], R: [0, r(Math.sqrt(3))], M: [0, 0] };
  Q(1, 'Jednakostranični trougao ima stranicu $2$ cm. Kolika mu je površina?',
    ['$\\sqrt{3}$ cm²', '$2\\sqrt{3}$ cm²', '$2$ cm²', '$3$ cm²'],
    'Visina tog trougla je $\\sqrt{3}$ cm, pa je površina $\\frac{2 \\cdot \\sqrt{3}}{2} = \\sqrt{3}$ cm². Zanimljivo je da je broj za površinu isti kao broj za visinu – za stranicu $2$ to je slučajnost.', 'površina',
    { mediji: G(trEq, [{ p: 'PQR', b: 0 }, { d: 'PQ', o: '2 cm', b: 1, debljina: 3 }], { bezImena: sve(trEq), velicina: 240 }),
      medijiOdgovora: G(trEq, [{ p: 'PQR', b: 0 }, { d: 'RM', isp: 1, o: '√3 cm' }, { pu: 'RMQ' }, { tx: 'P = √3 cm²', at: [0.5, 0.45] }], { bezImena: ['M'], velicina: 240 }) });

  const sh2 = { ...pravilni(6, 2), O: [0, 0] };
  Q(2, 'Pravilni šestougao ima stranicu 2 cm. Kolika mu je površina?',
    ['$6\\sqrt{3}$ cm²', '$12$ cm²', '$12\\sqrt{3}$ cm²', '$4\\sqrt{3}$ cm²'],
    'Šestougao se sastoji od šest jednakostraničnih trouglova stranice 2 cm, a svaki ima površinu $\\sqrt{3}$ cm². Ukupno je $6 \\cdot \\sqrt{3}$ cm². Saće pčela je od šestouglova jer se takvi likovi slažu bez praznina.', 'šestougao',
    { mediji: G(sh2, [{ p: SESTI, b: 0 }, { d: 'AB', o: '2 cm', b: 1, debljina: 3 }], { bezImena: ['O', ...sve(sh2).filter((k) => k !== 'O')], velicina: 240 }),
      medijiOdgovora: G(sh2, [odCentra(sh2, 6), ...SESTI.split('').map((n, i) => ({ tx: '√3', at: tez(sh2.O, sh2[n], sh2[SESTI[(i + 1) % 6]]) }))], { bezImena: ['O', ...SESTI.split('')], velicina: 240 }) });

  const sh5 = { ...pravilni(6, 3), O: [0, 0] };
  Q(3, 'Koja formula daje površinu pravilnog šestougla čija je stranica $a$?',
    ['$\\frac{3a^{2}\\sqrt{3}}{2}$', '$a^{2}\\sqrt{3}$', '$6a^{2}$', '$\\frac{a^{2}\\sqrt{3}}{4} \\cdot 6 \\cdot 2$'],
    'Šestougao se deli na šest jednakostraničnih trouglova, a svaki ima površinu $\\frac{a^{2}\\sqrt{3}}{4}$. Zato je $P = 6 \\cdot \\frac{a^{2}\\sqrt{3}}{4} = \\frac{3a^{2}\\sqrt{3}}{2}$. Kad se sabere šest jednakih trouglova, jedinica se ne sme zaboraviti na nijednom koraku.', 'površina',
    { mediji: G(sh5, [{ p: SESTI, b: 0 }, { d: 'AB', o: 'a', b: 1, debljina: 3 }], { bezImena: sve(sh5), velicina: 240 }),
      medijiOdgovora: G(sh5, [odCentra(sh5, 6), ...SESTI.split('').map((n, i) => ({ tx: 'P₁', at: tez(sh5.O, sh5[n], sh5[SESTI[(i + 1) % 6]]) }))], { bezImena: ['O', ...SESTI.split('')], velicina: 240 }) });

  // mreža: lik sastavljen od dva pravougaonika (4×1 i 2×2)
  const tL = { A: [0, 0], B: [4, 0], C: [4, 1], D: [2, 1], E: [2, 3], F: [0, 3] };
  Q(1, 'Lik na karirani mreži ima stranice po linijama mreže, a jedan kvadratić je $1$ cm². Kolika je površina obojenog lika?',
    ['8 cm²', '6 cm²', '10 cm²', '7 cm²'],
    'Lik se sastoji od dva pravougaonika: $4 \\cdot 1 = 4$ i $2 \\cdot 2 = 4$. Ukupno je 8 kvadratića. Isti lik bi na mreži sa kvadratićima od 2 cm imao površinu četiri puta veću, $32$ cm².', 'mreža',
    { mediji: G(tL, [{ mreza: [0, 5, 0, 4], brojevi: 0 }, { p: 'ABCDEF', b: 0 }], { bezImena: sve(tL), velicina: 260 }),
      medijiOdgovora: G(tL, [{ mreza: [0, 5, 0, 4], brojevi: 0 },
        { lin: [[0, 0], [4, 0], [4, 1], [0, 1]], zatv: 1, b: 1, gusto: 1 },
        { lin: [[0, 1], [2, 1], [2, 3], [0, 3]], zatv: 1, b: 2, gusto: 1 },
        { tx: '4', at: [2, 0.5] }, { tx: '4', at: [1, 2] }], { bezImena: sve(tL), velicina: 260 }) });

  Q(2, 'Na karirani mreži je obojen pravougli trougao sa katetama duž linija mreže (4 i 3 kvadratića). Koliko kvadratića ima njegova površina?',
    ['6', '12', '7', '5'],
    'Trougao je polovina pravougaonika $4 \\cdot 3 = 12$ kvadratića, jer ga dijagonala deli na dva podudarna dela. Zato je površina $6$ kvadratića.', 'mreža',
    { mediji: G({}, [{ mreza: [0, 5, 0, 4], brojevi: 0 }, { lin: [[0, 0], [4, 0], [0, 3]], zatv: 1, b: 0, gusto: 1 }], { velicina: 260 }),
      medijiOdgovora: G({}, [{ mreza: [0, 5, 0, 4], brojevi: 0 }, { lin: [[0, 0], [4, 0], [4, 3], [0, 3], [0, 0]], isp: 1, b: 4 }, { lin: [[0, 0], [4, 0], [0, 3]], zatv: 1, b: 0, gusto: 1 }, { lin: [[4, 0], [0, 3]], b: 1, debljina: 3 }], { velicina: 260 }) });

  const tP = { A: [0, 0], B: [6, 0], C: [8, 4], D: [2, 4] };
  Q(2, 'Paralelogram $ABCD$ ima površinu $24$ cm². Dijagonala $AC$ ga deli na dva trougla. Kolika je površina trougla $ABC$?',
    ['12 cm²', '24 cm² (cela figura)', '8 cm²', '6 cm²'],
    'Dijagonala deli paralelogram na dva podudarna trougla (imaju jednake sve tri stranice), pa je svaki polovina ukupne površine: $24 : 2 = 12$ cm².', 'dijagonala',
    { mediji: G(tP, [{ p: 'ABCD', b: 0 }, { d: 'AC', isp: 1, b: 1 }], { velicina: 260 }),
      medijiOdgovora: G(tP, [{ p: 'ABC', b: 1 }, { p: 'ACD', b: 2 }, { tx: '12 cm²', at: tez(tP.A, tP.B, tP.C) }, { tx: '12 cm²', at: tez(tP.A, tP.C, tP.D) }], { velicina: 260 }) });

  // konveksan četvorougao: dijagonala AC deli ga na trouglove površina 6 i 9
  const tK = { A: [0, 0], B: [4, 0], C: [5, 3], D: [-1, 3] };
  proveri(Math.abs(Math.abs((tK.B[0] - tK.A[0]) * (tK.C[1] - tK.A[1]) - (tK.B[1] - tK.A[1]) * (tK.C[0] - tK.A[0])) / 2 - 6) < 1e-9, 'ABC = 6');
  proveri(Math.abs(Math.abs((tK.C[0] - tK.A[0]) * (tK.D[1] - tK.A[1]) - (tK.C[1] - tK.A[1]) * (tK.D[0] - tK.A[0])) / 2 - 9) < 1e-9, 'ACD = 9');
  Q(3, 'Konveksan četvorougao $ABCD$ dijagonala $AC$ deli na dva trougla. Površina trougla $ABC$ je $6$ cm², a trougla $ACD$ je $9$ cm². Kolika je površina četvorougla?',
    ['15 cm²', '54 cm²', '3 cm²', '12 cm² (6 + 6)'],
    'Površina četvorougla je zbir površina dva trougla: $6 + 9 = 15$ cm². Greška je množiti ($6 \\cdot 9 = 54$), jer se površine sabiraju, ne množe.', 'četvorougao',
    { mediji: G(tK, [{ p: 'ABCD', b: 0 }, { d: 'AC', isp: 1, b: 1 }], { velicina: 260 }),
      medijiOdgovora: G(tK, [{ p: 'ABC', b: 1 }, { p: 'ACD', b: 2 }, { tx: '6 cm²', at: tez(tK.A, tK.B, tK.C) }, { tx: '9 cm²', at: tez(tK.A, tK.C, tK.D) }], { velicina: 260 }) });

  Q(2, 'Stranice petougla su $2$ dm, $15$ cm, $12$ cm, $3$ cm i $35$ mm. Koliki je obim petougla?',
    ['53,5 cm', '50,5 cm', '5,35 cm', '62,5 cm'],
    'Sve dužine treba izraziti u istoj jedinici: $2$ dm $= 20$ cm, a $35$ mm $= 3{,}5$ cm. Zbir je $20 + 15 + 12 + 3 + 3{,}5 = 53{,}5$ cm. Obim se računa tek kad su sve mere u istim jedinicama.', 'obim');

  const krugU = { O: [0, 0], ...pravilni(6, 3) };
  const rr = r((3 * Math.sqrt(3)) / 2);
  Q(3, 'Mnogougao ima upisanu kružnicu poluprečnika $r$, površinu $P$ i obim $O$. Koja jednakost važi?',
    ['$2P = r \\cdot O$', '$P = r \\cdot O$', '$P = 2 \\cdot r \\cdot O$', '$O = r \\cdot P$'],
    'Mnogougao se iz centra deli na trouglove čija je visina $r$, a osnovice su stranice. Zbir površina je $P = \\frac{r \\cdot O}{2}$, pa je $2P = r \\cdot O$. Ovo važi za svaki mnogougao sa upisanom kružnicom, ne samo za pravilne.', 'kružnica',
    { mediji: G(krugU, [{ p: SESTI, b: 0 }, { kr: 'O', r: rr, b: 1 }], { bezImena: ['O', ...SESTI.split('')], velicina: 240 }),
      medijiOdgovora: G(krugU, [odCentra(krugU, 6), { kr: 'O', r: rr, b: 1 }, ...SESTI.split('').map((n, i) => ({ tx: 'r', at: sr(krugU[n], krugU[SESTI[(i + 1) % 6]]).map((v, j) => r(v * 0.5)) }))], { bezImena: ['O', ...SESTI.split('')], velicina: 240 }) });

  const sh4 = { ...pravilni(6, 4), O: [0, 0] };
  Q(2, 'Pravilni šestougao ima stranicu 4 cm. Kolika je njegova najduža dijagonala?',
    ['8 cm', '4√3 cm', '6 cm', '4 cm'],
    'Najduža dijagonala prolazi kroz centar, pa je jednaka prečniku opisane kružnice, a poluprečnik je jednak stranici: $2 \\cdot 4 = 8$ cm. Kratka dijagonala je $4\\sqrt{3}$ cm.', 'dijagonala',
    { mediji: G(sh4, [{ p: SESTI, b: 0 }], { bezImena: sve(sh4), velicina: 240 }),
      medijiOdgovora: G(sh4, [{ p: SESTI, b: 0 }, { d: 'AD', b: 1, debljina: 3, o: '8 cm' }], { bezImena: ['O'], velicina: 240 }) });

  Q(2, 'Plac oblika kvadrata stranice 15 m ogradi se sa tri reda žice. Koliko je metara žice potrebno?',
    ['180 m', '45 m', '90 m', '60 m'],
    'Svaki red žice ide oko cele ograde, a obim kvadrata je $4 \\cdot 15 = 60$ m. Tri reda znače $3 \\cdot 60 = 180$ m. Ako se zaboravi jedan red, rezultat je 60 m.', 'ograda',
    { mediji: G({ P: [0, 0], Q: [6, 0], R: [6, 6], S: [0, 6] }, [{ p: 'PQRS', b: 0 }, { d: 'PQ', o: '15 m', b: 1, debljina: 3 }], { bezImena: sve({ P: 0, Q: 0, R: 0, S: 0 }), velicina: 240 }),
      medijiOdgovora: G({ P: [0, 0], Q: [6, 0], R: [6, 6], S: [0, 6] }, [{ p: 'PQRS', b: 0 }, { lin: [[-0.5, -0.5], [6.5, -0.5], [6.5, 6.5], [-0.5, 6.5]], zatv: 1, isp: 1, b: 2, prazno: 1 }, { lin: [[-1, -1], [7, -1], [7, 7], [-1, 7]], zatv: 1, isp: 1, b: 3, prazno: 1 }, { lin: [[-1.5, -1.5], [7.5, -1.5], [7.5, 7.5], [-1.5, 7.5]], zatv: 1, isp: 1, b: 4, prazno: 1 }, { tx: '4 · 15 · 3 = 180 m', at: [3, -2.6] }], { bezImena: sve({ P: 0, Q: 0, R: 0, S: 0 }), velicina: 260 }) });

  // pravougaonik 5×1 i kvadrat 3×3 – isti obim, različita površina
  Q(2, 'Pravougaonik stranica $5$ cm i $1$ cm i kvadrat stranice $3$ cm imaju isti obim. Koji lik ima veću površinu?',
    ['Kvadrat', 'Pravougaonik', 'Jednaka je', 'Ne može se odrediti'],
    'Obim pravougaonika je $2 \\cdot (5 + 1) = 12$ cm, a kvadrata $4 \\cdot 3 = 12$ cm. Površine su $5$ cm² i $9$ cm². Među pravougaonicima istog obima, kvadrat ima najveću površinu.', 'kvadrat',
    { mediji: G({}, [{ lin: [[0, 0], [5, 0], [5, 1], [0, 1]], zatv: 1, b: 1, gusto: 1 }, { lin: [[7, 0], [10, 0], [10, 3], [7, 3]], zatv: 1, b: 2, gusto: 1 }], { velicina: 260 }),
      medijiOdgovora: G({}, [{ lin: [[0, 0], [5, 0], [5, 1], [0, 1]], zatv: 1, b: 1, gusto: 1 }, { lin: [[7, 0], [10, 0], [10, 3], [7, 3]], zatv: 1, b: 2, gusto: 1 }, { tx: '5 cm²', at: [2.5, -0.9] }, { tx: '9 cm²', at: [8.5, 1.5] }], { velicina: 260 }) });

  const pet = pravilni(5, 3);
  Q(1, 'Iz jednog temena petougla povučemo sve dijagonale. Na koliko se trouglova petougao tako podeli?',
    ['3', '5', '2', '4'],
    'Iz jednog temena petougla mogu se povući dve dijagonale, a one dele petougao na tri trougla. Opšte pravilo: mnogougao sa $n$ stranica se iz jednog temena deli na $n - 2$ trougla.', 'dijagonala',
    { mediji: G(pet, [{ p: 'ABCDE', b: 0 }], { bezImena: [], velicina: 240 }),
      medijiOdgovora: G(pet, [{ p: 'ABC', b: 0 }, { p: 'ACD', b: 1 }, { p: 'ADE', b: 2 }, { d: 'AC', isp: 1, b: 4 }, { d: 'AD', isp: 1, b: 4 }, { tx: '1', at: tez(pet.A, pet.B, pet.C) }, { tx: '2', at: tez(pet.A, pet.C, pet.D) }, { tx: '3', at: tez(pet.A, pet.D, pet.E) }], { velicina: 240 }) });

  S(2, 'Spoji lik sa formulom za površinu.',
    [['Pravougaonik', '$a \\cdot b$'], ['Kvadrat', '$a^{2}$'], ['Jednakostranični trougao', '$\\frac{a^{2}\\sqrt{3}}{4}$'], ['Pravilni šestougao', '$\\frac{3a^{2}\\sqrt{3}}{2}$']],
    'Pravilni mnogougao se može podeliti na jednake trouglove iz centra, pa se površina računa preko njih.', 'površina');

  // ── dodatna teža pitanja (težina 3) ──
  L('Obim i površina mnogougla');
  {
    const hexT = { ...pravilni(6, 1), O: [0, 0] };
    const trT = { P: [3, 0], Q: [5, 0], R: [4, r(Math.sqrt(3))], S: [4, 0], T: [4.5, r(Math.sqrt(3) / 2)], U: [3.5, r(Math.sqrt(3) / 2)] };
    const svi = { ...hexT, ...trT };
    const tri = (t, a, b, c, tx) => ({ tx, at: tez(t[a], t[b], t[c]) });
    Q(3, 'Pravilni šestougao stranice $a$ i jednakostranični trougao stranice $2a$ imaju isti obim. Koliki je odnos njihovih površina (šestougao : trougao)?',
      ['3 : 2', '2 : 3', '1 : 1', '6 : 1'],
      'Šestougao se deli na šest jednakostraničnih trouglova stranice $a$, a veći trougao na četiri takva. Površine su u odnosu $6 : 4$, to jest $3 : 2$. Figure istog obima mogu imati različite površine.', 'površina',
      { mediji: G(svi, [{ p: SESTI, b: 0 }, { p: 'PQR', b: 1 }], { bezImena: sve(svi), velicina: 320 }),
        medijiOdgovora: G({ ...svi, O: [0, 0] }, [odCentra(hexT, 6),
          { p: 'PSU', b: 1 }, { p: 'SQT', b: 1 }, { p: 'UTR', b: 1 }, { p: 'STU', b: 2 },
          tri(svi, 'P', 'S', 'U', 'P₁'), tri(svi, 'S', 'Q', 'T', 'P₁'), tri(svi, 'U', 'T', 'R', 'P₁'), tri(svi, 'S', 'T', 'U', 'P₁'),
          ...SESTI.split('').map((n, i) => tri(svi, 'O', n, SESTI[(i + 1) % 6], 'P₁'))], { bezImena: sve(svi), velicina: 320 }) });
  }

  // ══════════════════ 30. Ortocentar i težište trougla ══════════════════
  L('Ortocentar i težište trougla');

  // oštrougli trougao
  const oA = { A: [-3, -1], B: [3, -1], C: [0.5, 3] };
  const oD = podnozje(oA.C, oA.A, oA.B), oE = podnozje(oA.A, oA.B, oA.C), oF = podnozje(oA.B, oA.A, oA.C);
  const oH = presek(oA.A, oE, oA.B, oF);
  const oc = { ...oA, D: oD, E: oE, F: oF, H: oH };
  Q(1, 'Gde se nalazi ortocentar oštrouglog trougla?',
    ['Unutar trougla', 'Van trougla', 'Na jednoj od stranica', 'U jednom od temena'],
    'Ortocentar je presek visina. Kod oštrouglog trougla sve tri visine seku se unutar trougla. Visina je duž iz temena normalna na naspramnu stranicu.', 'ortocentar',
    { mediji: G(oA, [{ p: 'ABC', b: 0 }], { velicina: 260 }),
      medijiOdgovora: G(oc, [{ p: 'ABC', b: 0 }, { d: 'CD', isp: 1, b: 1 }, { d: 'AE', isp: 1, b: 2 }, { d: 'BF', isp: 1, b: 3 }, { pu: 'CDB' }, { pu: 'AEC' }, { pu: 'BFA' }, { tacka: 'H', b: 2 }], { velicina: 260 }) });

  // pravougli trougao
  const pr = { C: [0, 0], A: [4, 0], B: [0, 3] };
  Q(2, 'Gde je ortocentar pravouglog trougla?',
    ['U temenu pravog ugla', 'Na središtu hipotenuze', 'Van trougla', 'U težištu'],
    'Dve katete su visine iz naspramnih temena, pa se seku u temenu pravog ugla. Zato je ortocentar pravouglog trougla upravo teme sa pravim uglom.', 'ortocentar',
    { mediji: G(pr, [{ p: 'ABC', b: 0 }, { pu: 'ACB' }], { velicina: 240 }),
      medijiOdgovora: G(pr, [{ p: 'ABC', b: 0 }, { pu: 'ACB' }, { tacka: 'C', b: 2 }, { tx: 'H = C', at: [-0.9, -0.9] }], { velicina: 240 }) });

  // tupougli trougao
  const tu = { A: [-4, 0], B: [4, 0], C: [1, 3] };
  const tuH = presek(tu.A, podnozje(tu.A, tu.B, tu.C), tu.B, podnozje(tu.B, tu.A, tu.C));
  proveri(Math.abs(tuH[0] - 1) < 0.01 && Math.abs(tuH[1] - 5) < 0.01, 'ortocentar tupouglog trougla (1, 5)');
  Q(2, 'Gde leži ortocentar tupouglog trougla?',
    ['Van trougla', 'Unutar trougla', 'U središtu najduže stranice', 'Poklapa se sa težištem'],
    'Kod tupouglog trougla visine ne seku stranice unutar trougla, nego se njihovi produžeci seku van njega. Zanimljivo: ako se uzmu ortocentar i tri temena, svaka od te četiri tačke je ortocentar trougla koji čine ostale tri.', 'ortocentar',
    { mediji: G(tu, [{ p: 'ABC', b: 0 }], { velicina: 260 }),
      medijiOdgovora: G({ ...tu, H: tuH }, [{ p: 'ABC', b: 0 }, { d: 'AH', isp: 1, b: 1 }, { d: 'BH', isp: 1, b: 2 }, { d: 'CH', isp: 1, b: 3 }, { tacka: 'H', b: 2 }], { velicina: 260 }) });

  // težišne duži jednakostraničnog … (oštrougli trougao sa težišnim dužima)
  const tT = { A: [0, 0], B: [6, 0], C: [2, 4] };
  const tDd = sr(tT.B, tT.C), tEe = sr(tT.A, tT.C), tFf = sr(tT.A, tT.B);
  const tTT = tez(tT.A, tT.B, tT.C);
  Q(1, 'Kako se zove tačka u kojoj se seku sve težišne duži trougla?',
    ['Težište', 'Ortocentar', 'Centar upisane kružnice', 'Centar opisane kružnice'],
    'Težišna duž spaja teme sa središtem naspramne stranice. Tri težišne duži seku se u jednoj tački, koja se zove težište.', 'težište',
    { mediji: G(tT, [{ p: 'ABC', b: 0 }], { velicina: 240 }),
      medijiOdgovora: G({ ...tT, D: tDd, E: tEe, F: tFf, T: tTT }, [{ p: 'ABC', b: 0 }, { d: 'AD', isp: 1, b: 1 }, { d: 'BE', isp: 1, b: 2 }, { d: 'CF', isp: 1, b: 3 }, { tacka: 'T', b: 2 }], { velicina: 240 }) });

  // koja duž je težišna (tri nacrtane duži)
  Q(2, 'Na crtežu su nacrtane tri duži. Koja od njih je težišna duž trougla?',
    ['Duž 1', 'Duž 2', 'Duž 3', 'Nijedna'],
    'Težišna duž spaja teme sa središtem naspramne stranice. Duž 1 ide od temena $C$ do sredine $AB$ (tačka $(3, 0)$). Duž 2 je visina iz $C$ (normalna je na $AB$), a duž 3 je visina iz $B$ – obe su normalne na stranicu, pa nisu težišne.', 'težišna',
    { mediji: G(tT, [{ p: 'ABC', b: 0 }, { lin: [[2, 4], [3, 0]], b: 1, debljina: 2.5 }, { lin: [[2, 4], [2, 0]], b: 2, debljina: 2.5 }, { lin: [[6, 0], [1.2, 2.4]], b: 3, debljina: 2.5 }, { tx: '1', at: [3.1, 1.0] }, { tx: '2', at: [1.7, 1.0] }, { tx: '3', at: [4.2, 1.4] }], { bezImena: sve(tT), velicina: 240 }),
      medijiOdgovora: G(tT, [{ p: 'ABC', b: 0 }, { lin: [[2, 4], [3, 0]], b: 1, debljina: 4 }, { lin: [[2, 4], [2, 0]], b: 2, debljina: 1.5, isp: 1 }, { lin: [[6, 0], [1.2, 2.4]], b: 3, debljina: 1.5, isp: 1 }, { tx: '~težišna', at: [3.6, 2.2] }], { velicina: 240 }) });

  // težište deli težišnu duž 2 : 1 (9 cm)
  const tUu = { A: [0, 0], B: [6, 0], C: [3, 9] };
  const tUT = tez(tUu.A, tUu.B, tUu.C);
  Q(2, 'Težišna duž je duga 9 cm. Kolika je dužina od temena do težišta, po toj duži?',
    ['6 cm', '3 cm', '4,5 cm', '9 cm'],
    'Težište deli težišnu duž u odnosu $2 : 1$, računajući od temena. Zato je deo od temena $\\frac{2}{3}$ cele duži: $\\frac{2}{3} \\cdot 9 = 6$ cm. Težište se ponaša kao „ravnotežna tačka“: ploču u obliku trougla možemo da ravnotežimo na vrhu olovke postavljene baš u težištu.', 'težište',
    { mediji: G(tUu, [{ p: 'ABC', b: 0 }, { lin: [[3, 9], [3, 0]], b: 1, debljina: 2.5 }, { tx: '9 cm', at: [3.4, 4.6] }], { velicina: 240 }),
      medijiOdgovora: G({ ...tUu, T: tUT }, [{ p: 'ABC', b: 0 }, { lin: [[3, 9], [3, 0]], b: 1, debljina: 2.5 }, { tacka: 'T', b: 2 }, { tx: '6 cm', at: [3.4, 6.5] }, { tx: '3 cm', at: [3.4, 1.4] }], { velicina: 240 }) });

  // težište: teme–težište 4 cm, cela težišna duž
  const tV = { A: [0, 0], B: [6, 0], C: [1.2, 9.6] };
  const tVT = tez(tV.A, tV.B, tV.C);
  const tVM = sr(tV.B, tV.C);
  proveri(Math.abs(Math.hypot(tVM[0], tVM[1]) - 6) < 1e-9, 'težišna duž iz A je 6');
  Q(2, 'Rastojanje od temena $A$ do težišta je $4$ cm. Kolika je cela težišna duž iz temena $A$?',
    ['6 cm', '2 cm', '8 cm', '12 cm'],
    'Od temena do težišta je $\\frac{2}{3}$ težišne duži. Ako je to 4 cm, cela duž je $4 : \\frac{2}{3} = 6$ cm. Od težišta do sredine stranice ostaje još 2 cm.', 'težišna',
    { mediji: G(tV, [{ p: 'ABC', b: 0 }, { lin: [[0, 0], tVM], b: 1, debljina: 2.5 }, { tx: '4 cm', at: [0.8, 2.9] }], { velicina: 240 }),
      medijiOdgovora: G({ ...tV, M: tVM, T: tVT }, [{ p: 'ABC', b: 0 }, { d: 'AM', b: 1, debljina: 2.5 }, { tacka: 'T', b: 2 }, { tx: '4 cm', at: [0.5, 2.0] }, { tx: '2 cm', at: [3.4, 3.9] }], { bezImena: ['M'], velicina: 240 }) });

  // težište uvek unutar trougla (tupougli)
  Q(1, 'Gde se uvek nalazi težište trougla?',
    ['Uvek unutar trougla', 'Uvek van trougla', 'Uvek na jednoj stranici', 'Uvek u temenu tupog ugla'],
    'Težište je presek težišnih duži i uvek leži unutar trougla, bez obzira na to da li je trougao oštrougli, pravougli ili tupougli. Deli svaku težišnu duž u odnosu $2 : 1$.', 'težište',
    { mediji: G(tu, [{ p: 'ABC', b: 0 }], { velicina: 260 }),
      medijiOdgovora: G({ ...tu, D: sr(tu.B, tu.C), E: sr(tu.A, tu.C), F: sr(tu.A, tu.B), T: tez(tu.A, tu.B, tu.C) }, [{ p: 'ABC', b: 0 }, { d: 'AD', isp: 1, b: 1 }, { d: 'BE', isp: 1, b: 2 }, { d: 'CF', isp: 1, b: 3 }, { tacka: 'T', b: 2 }], { velicina: 260 }) });

  // jednakostranični: sve četiri tačke se poklapaju
  const jed = { A: [-3, 0], B: [3, 0], C: [0, r(3 * Math.sqrt(3))] };
  Q(2, 'Koje značajne tačke trougla se poklapaju u jednakostraničnom trouglu?',
    ['Sve četiri', 'Samo dve od četiri tačke', 'Samo tri od četiri tačke', 'Nijedna, sve su različite tačke'],
    'U jednakostraničnom trouglu visina je i težišna duž i simetrala, pa se težište, ortocentar i centri upisane i opisane kružnice poklapaju u jednoj tački.', 'ortocentar',
    { mediji: G(jed, [{ p: 'ABC', b: 0 }], { velicina: 240 }),
      medijiOdgovora: G({ ...jed, D: sr(jed.B, jed.C), E: sr(jed.A, jed.C), F: sr(jed.A, jed.B), T: tez(jed.A, jed.B, jed.C) }, [{ p: 'ABC', b: 0 }, { d: 'AD', isp: 1, b: 1 }, { d: 'BE', isp: 1, b: 2 }, { d: 'CF', isp: 1, b: 3 }, { tacka: 'T', b: 2 }], { velicina: 240 }) });

  Q(3, 'Ako se u trouglu ortocentar i težište poklapaju, koji je to trougao?',
    ['Jednakostraničan', 'Jednakokraki (ali ne jednakostraničan)', 'Pravougli', 'Tupougli'],
    'Ako su ortocentar i težište isti, visina iz svakog temena je ujedno i težišna duž, pa je trougao jednakostraničan. Dokaz se vodi preko podudarnosti trouglova koje visine prave na osnovnici.', 'ortocentar');

  // pravougli trougao: centar opisane kružnice je središte hipotenuze
  const pk = { C: [0, 0], A: [6, 0], B: [0, 8], M: [3, 4] };
  Q(2, 'Gde je centar opisane kružnice pravouglog trougla?',
    ['Sredina hipotenuze', 'U temenu pravog ugla, gde se seku katete', 'U težištu trougla, gde se seku težišnice', 'Van trougla, na produžetku katete'],
    'Kružnica nad hipotenuzom prolazi kroz oba kraja hipotenuze i kroz teme pravog ugla (Talesova teorema). Njen centar je zato na sredini hipotenuze, a poluprečnik je polovina hipotenuze.', 'kružnica',
    { mediji: G(pk, [{ p: 'ABC', b: 0 }, { kr: 'M', r: 5, b: 1 }], { bezImena: ['M'], velicina: 260 }),
      medijiOdgovora: G(pk, [{ p: 'ABC', b: 0 }, { kr: 'M', r: 5, b: 1 }, { tacka: 'M', b: 2 }, { tx: 'AB = 10 cm', at: [-1.5, -2.2] }], { bezImena: [], velicina: 260 }) });

  // presek simetrala unutrašnjih uglova (centar upisane kružnice)
  const tS = { A: [0, 0], B: [6, 0], C: [2, 4] };
  const ta = Math.hypot(tS.B[0] - tS.C[0], tS.B[1] - tS.C[1]), tb = Math.hypot(tS.C[0] - tS.A[0], tS.C[1] - tS.A[1]), tc = Math.hypot(tS.B[0] - tS.A[0], tS.B[1] - tS.A[1]);
  const pod3 = (x, y, z, w) => [r((x[0] * z + y[0] * w) / (z + w)), r((x[1] * z + y[1] * w) / (z + w))];
  const sD = pod3(tS.B, tS.C, tb, tc), sE = pod3(tS.C, tS.A, tc, ta), sF = pod3(tS.A, tS.B, ta, tb);
  const sI = presek(tS.A, sD, tS.B, sE);
  proveri(Math.abs(sI[0] - presek(tS.C, sF, tS.A, sD)[0]) < 0.01 && Math.abs(sI[1] - presek(tS.C, sF, tS.A, sD)[1]) < 0.01, 'simetrale se seku u jednoj tački');
  Q(2, 'Presek simetrala unutrašnjih uglova trougla je:',
    ['Centar upisane kružnice', 'Centar opisane kružnice trougla', 'Težište trougla, presek težišnih duži', 'Ortocentar, presek visina trougla'],
    'Simetrala ugla je jednako udaljena od njegovih krakova. Presek sve tri simetrale je tačka jednako udaljena od sve tri stranice, pa je to centar kružnice koja se upisuje u trougao.', 'simetrala',
    { mediji: G(tS, [{ p: 'ABC', b: 0 }], { velicina: 240 }),
      medijiOdgovora: G({ ...tS, D: sD, E: sE, F: sF, I: sI }, [{ p: 'ABC', b: 0 }, { d: 'AD', isp: 1, b: 1 }, { d: 'BE', isp: 1, b: 2 }, { d: 'CF', isp: 1, b: 3 }, { tacka: 'I', b: 2 }], { velicina: 240 }) });

  // visina: definicija
  Q(1, 'Šta je visina trougla iz jednog temena?',
    ['Normala iz temena na naspramnu stranicu', 'Duž od temena do središta suprotne stranice, koja deli trougao na dva jednaka dela', 'Duž koja polovi ugao kod temena i seče naspramnu stranicu', 'Duž koja spaja središta dve stranice i prolazi kroz treće teme'],
    'Visina je normala iz temena na pravu koja sadrži naspramnu stranicu. Kod tupouglog trougla podnožje može da padne na produžetak stranice, van duži.', 'visina');

  S(2, 'Spoji značajnu tačku trougla sa osobinom kojom je određena.',
    [['Ortocentar', 'presek visina'], ['Težište', 'presek težišnih duži'], ['Centar upisane kružnice', 'presek simetrala uglova'], ['Centar opisane kružnice', 'presek simetrala stranica']],
    'Trougao ima četiri značajne tačke. U jednakostraničnom trouglu sve četiri se poklapaju.', 'ortocentar');

  // težišna duž trougla i težište za zadatak sa 14 pitanja: dopuna
  Q(2, 'Težište trougla deli težišnu duž tako da je deo od temena dvostruko duži od dela do središta stranice. Koliko je rastojanje težišta od središta stranice ako je težišna duž $12$ cm?',
    ['4 cm', '6 cm', '8 cm', '2 cm'],
    'Ukupno $12$ cm se deli na $2 + 1 = 3$ jednaka dela. Od težišta do središta stranice je jedan deo: $12 : 3 = 4$ cm. Deo od temena je $8$ cm.', 'težište',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [4, 12], M: [4, 0] }, [{ p: 'ABC', b: 0 }, { lin: [[4, 12], [4, 0]], b: 1, debljina: 2.5 }, { tx: '12 cm', at: [4.4, 6] }], { bezImena: ['M'], velicina: 240 }),
      medijiOdgovora: G({ A: [0, 0], B: [8, 0], C: [4, 12], M: [4, 0], T: [4, 4] }, [{ p: 'ABC', b: 0 }, { lin: [[4, 12], [4, 0]], b: 1, debljina: 2.5 }, { tacka: 'T', b: 2 }, { tx: '8 cm', at: [4.4, 8.5] }, { tx: '4 cm', at: [4.4, 1.6] }], { bezImena: ['M'], velicina: 240 }) });

  // ── dodatna teža pitanja (težina 3) ──
  L('Ortocentar i težište trougla');
  {
    const hC = { C: [0, 0], A: [4, 0], B: [0, 3] };
    Q(3, 'Ortocentar trougla $ABC$ pada u teme $C$. Koliki je zbir uglova kod temena $A$ i $B$?',
      ['90°', '180°', '60°', '45°'],
      'Ortocentar je u temenu $C$, pa visine iz $A$ i iz $B$ prolaze kroz $C$. Zato je $AC \\perp BC$, a ugao kod $C$ je prav. Zbir ostala dva ugla je $180° - 90° = 90°$.', 'ortocentar',
      { mediji: G(hC, [{ p: 'ABC', b: 0 }], { velicina: 240 }),
        medijiOdgovora: G(hC, [{ p: 'ABC', b: 0 }, { pu: 'ACB' }, { tacka: 'C', b: 2 }, { tx: '∠A + ∠B = 90°', at: [-1.2, 1.4] }], { velicina: 240 }) });

    const tM = { A: [0, 0], B: [6, 0], C: [8.4, 10.8] };
    const mM = sr(tM.B, tM.C);
    const tT2 = [r((2 * mM[0]) / 3), r((2 * mM[1]) / 3)];
    proveri(Math.abs(Math.hypot(mM[0], mM[1]) - 9) < 1e-9 && Math.abs(Math.hypot(mM[0] - tT2[0], mM[1] - tT2[1]) - 3) < 0.01, 'AM = 9, TM = 3');
    Q(3, 'Težište $T$ trougla $ABC$ deli težišnu duž $AM$ ($M$ je središte stranice $BC$). Ako je $TM = 3$ cm, kolika je cela težišna duž $AM$?',
      ['9 cm', '6 cm', '3 cm', '12 cm'],
      'Težište deli težišnu duž u odnosu $2 : 1$ računajući od temena. Deo $TM$ je jedan deo, pa je $AM = 3 \\cdot TM = 9$ cm. Deo od temena $AT$ je dvostruko duži, $6$ cm.', 'težište',
      { mediji: G({ ...tM, M: mM, T: tT2 }, [{ p: 'ABC', b: 0 }, { d: 'AM', isp: 1, b: 1 }, { d: 'TM', o: '3 cm', b: 2, debljina: 3 }], { velicina: 260 }),
        medijiOdgovora: G({ ...tM, M: mM, T: tT2 }, [{ p: 'ABC', b: 0 }, { d: 'AM', b: 1, debljina: 2.5 }, { tacka: 'T', b: 2 }, { tx: 'AT = 6 cm', at: [1.2, 2.2] }, { tx: 'TM = 3 cm', at: [6.2, 4.6] }], { velicina: 260 }) });

    const tS6 = { A: [0, 0], B: [6, 0], C: [2, 4] };
    const tS = { ...tS6, D: sr(tS6.B, tS6.C), E: sr(tS6.A, tS6.C), F: sr(tS6.A, tS6.B), T: tez(tS6.A, tS6.B, tS6.C) };
    const sest = [['A', 'T', 'F'], ['T', 'F', 'B'], ['B', 'T', 'D'], ['T', 'D', 'C'], ['C', 'T', 'E'], ['E', 'T', 'A']];
    Q(3, 'Površina trougla $ABC$ je $12$ cm². Tri težišne duži dele ga na šest manjih trouglova. Kolika je površina jednog od njih?',
      ['2 cm²', '3 cm²', '1 cm²', '4 cm²'],
      'Svaka težišna duž deli trougao na dva dela iste površine (iste osnovice i iste visine), pa su tri težišne duži podelile trougao na šest jednakih delova: $12 : 6 = 2$ cm².', 'težište',
      { mediji: G(tS6, [{ p: 'ABC', b: 0 }], { velicina: 240 }),
        medijiOdgovora: G(tS, [...sest.map((x, i) => ({ p: x.join(''), b: i })), { d: 'AD', isp: 1, b: 1 }, { d: 'BE', isp: 1, b: 1 }, { d: 'CF', isp: 1, b: 1 },
          ...sest.map((x) => { const c = tez(tS[x[0]], tS[x[1]], tS[x[2]]); return { tx: '2 cm²', at: [r(c[0] + (c[0] - tS.T[0]) * 0.6), r(c[1] + (c[1] - tS.T[1]) * 0.6)] }; })], { bezImena: ['D', 'E', 'F', 'T'], velicina: 240 }) });
  }

  // ══════════════════ 31. Složenije primene stavova podudarnosti ══════════════════
  L('Složenije primene stavova podudarnosti');

  // jednake visine ⇒ jednakokraki
  const jk = { A: [0, 0], B: [6, 0], C: [3, 4] };
  const jkE = podnozje(jk.A, jk.B, jk.C), jkD = podnozje(jk.B, jk.A, jk.C);
  const jkH = r(2 * 12 / 5);
  proveri(jkH === 4.8, 'visina 4,8');
  Q(2, 'Trouglu $ABC$ su visine iz temena $A$ i $B$ jednake. Kakav je trougao?',
    ['Jednakokraki', 'Raznostraničan', 'Pravougli', 'Tupougli'],
    'Površina je $P = \\frac{a \\cdot h_a}{2} = \\frac{b \\cdot h_b}{2}$, pa su jednake visine povučene na stranice jednake dužine: $a = b$. Isto se dokazuje i podudarnošću pravouglih trouglova $ABB_1$ i $BAA_1$ po stavu SSU.', 'visina',
    { mediji: G(jk, [{ p: 'ABC', b: 0 }], { velicina: 240 }),
      medijiOdgovora: G({ ...jk, E: jkE, D: jkD }, [{ p: 'ABC', b: 0 }, { d: 'AE', isp: 1, b: 1, o: '4,8' }, { d: 'BD', isp: 1, b: 2, o: '4,8' }, { pu: 'AEC' }, { pu: 'BDA' }], { velicina: 240 }) });

  Q(1, 'Koje tri stranice jednoznačno određuju trougao (do na podudarnost)?',
    ['Tri stranice', 'Tri ugla', 'Samo dve stranice', 'Dva ugla'],
    'Ako su poznate tri stranice, trougao je jedinstven (stav SSS). Tri ugla određuju samo oblik, ali ne i veličinu: trouglovi mogu biti različito veliki.', 'podudarnost');

  // SSS
  const sss1 = { P: [0, 0], Q: [5, 0], R: [0.5, 3.968] };
  const sss2 = { S: [8, 0], T: [13, 0], U: [8.5, 3.968] };
  Q(1, 'Dva trougla imaju redom jednake stranice $4$ cm, $5$ cm i $6$ cm. Po kom stavu su podudarna?',
    ['SSS', 'SUS', 'USU', 'SSU'],
    'Jednake su sve tri stranice, pa važi stav SSS (strana, strana, strana). Stavovi SUS i USU traže par uglova, a ovde ih nema.', 'podudarnost',
    { mediji: G({ ...sss1, ...sss2 }, [{ p: 'PQR', b: 0 }, { p: 'STU', b: 0 }, { d: 'PQ', o: '5 cm', b: 1 }, { d: 'PR', o: '4 cm', b: 2 }, { d: 'QR', o: '6 cm', b: 3 }, { d: 'ST', o: '5 cm', b: 1 }, { d: 'SU', o: '4 cm', b: 2 }, { d: 'TU', o: '6 cm', b: 3 }], { bezImena: sve({ ...sss1, ...sss2 }), velicina: 300 }) });

  // SUS
  const sus1 = { A: [0, 0], B: [5, 0], C: [r(7 * Math.cos(Math.PI * 40 / 180)), r(7 * Math.sin(Math.PI * 40 / 180))] };
  const sus2 = { D: [8, 0], E: [13, 0], F: [r(8 + 7 * Math.cos(Math.PI * 40 / 180)), r(7 * Math.sin(Math.PI * 40 / 180))] };
  Q(2, 'U trouglovima $ABC$ i $DEF$ važi $AB = DE = 5$ cm, $AC = DF = 7$ cm i $\\angle A = \\angle D = 40°$. Po kom stavu su podudarni?',
    ['SUS', 'SSS', 'USU', 'SSU'],
    'Dve stranice su jednake, a ugao između njih je jednak. To je stav SUS (strana, ugao, strana). Ugao mora da bude baš između datih stranica, inače ne važi.', 'podudarnost',
    { mediji: G({ ...sus1, ...sus2 }, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 0 }, { d: 'AB', o: '5 cm', b: 1 }, { d: 'AC', o: '7 cm', b: 2 }, { u: 'BAC', o: '40°', b: 3 }, { d: 'DE', o: '5 cm', b: 1 }, { d: 'DF', o: '7 cm', b: 2 }, { u: 'EDF', o: '40°', b: 3 }], { bezImena: sve({ ...sus1, ...sus2 }), velicina: 300 }) });

  // USU
  const usuA = [r(3.553), r(4.235)];
  const usu1 = { B: [0, 0], C: [6, 0], A: usuA };
  const usu2 = { E: [10, 0], F: [16, 0], D: [13.553, 4.235] };
  Q(2, 'Trouglovi $ABC$ i $DEF$ imaju $BC = EF = 6$ cm, $\\angle B = \\angle E = 50°$ i $\\angle C = \\angle F = 60°$. Po kom stavu su podudarni?',
    ['USU', 'SUS', 'SSU', 'SSS'],
    'Imaju po jednaku stranicu i na njenim krajevima jednake uglove, pa je to stav USU (ugao, strana, ugao). Stranica $BC$ je baš između uglova $B$ i $C$.', 'podudarnost',
    { mediji: G({ ...usu1, ...usu2 }, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 0 }, { d: 'BC', o: '6 cm', b: 1 }, { d: 'EF', o: '6 cm', b: 1 }, { u: 'ABC', o: '50°', b: 3 }, { u: 'BCA', o: '60°', b: 4 }, { u: 'DEF', o: '50°', b: 3 }, { u: 'EFD', o: '60°', b: 4 }], { bezImena: sve({ ...usu1, ...usu2 }), velicina: 300 }) });

  // isti uglovi, različite veličine
  const sl1 = { A: [0, 0], B: [4, 0], C: [1, 3] };
  const sl2 = { D: [6, 0], E: [12, 0], F: [7.5, 4.5] };
  Q(2, 'Dva trougla imaju jednake sva tri ugla. Da li su obavezno podudarna?',
    ['Ne, samo su slični (različite veličine)', 'Da, po stavu SSS, jer su sve stranice jednake', 'Da, po stavu USU (jednaki su uglovi)', 'Da, jer imaju iste uglove i iste visine'],
    'Jednaki uglovi znače da su trouglovi slični, ali ne i podudarni: jedan može biti 1,5 puta veći od drugog. Za podudarnost treba bar jedna stranica sa jednakim dužinama.', 'slični',
    { mediji: G({ ...sl1, ...sl2 }, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 0 }], { bezImena: sve({ ...sl1, ...sl2 }), velicina: 300 }) });

  // težišna duž iz pravog ugla = polovina hipotenuze
  const pH = { A: [-5, 0], B: [5, 0], C: [3, 4], M: [0, 0] };
  proveri(Math.hypot(3, 4) === 5, 'C je na kružnici poluprečnika 5 (pravi ugao kod C)');
  Q(2, 'Pravougli trougao $ABC$ ima pravi ugao kod temena $C$. Težišna duž iz $C$ je 5 cm. Kolika je hipotenuza $AB$?',
    ['10 cm', '5 cm', '2,5 cm', '7,5 cm'],
    'Težišna duž iz pravog ugla je polovina hipotenuze, jer je teme $C$ na kružnici nad prečnikom $AB$, a centar te kružnice je sredina $AB$. Zato je $AB = 2 \\cdot 5 = 10$ cm.', 'hipotenuza',
    { mediji: G(pH, [{ p: 'ABC', b: 0 }, { lin: [[3, 4], [0, 0]], b: 1, debljina: 2.5 }, { tx: '5 cm', at: [1.9, 2.6] }, { pu: 'ACB' }], { bezImena: ['M'], velicina: 260 }),
      medijiOdgovora: G(pH, [{ p: 'ABC', b: 0 }, { kr: 'M', r: 5, b: 1 }, { lin: [[3, 4], [0, 0]], b: 1, debljina: 2.5 }, { d: 'AB', o: '10 cm', b: 2, debljina: 2 }, { pu: 'ACB' }], { bezImena: ['M'], velicina: 260 }) });

  // težišna duž = polovina stranice ⇒ pravougli
  const pT = { A: [-3, 0], B: [3, 0], C: [1.8, 2.4], M: [0, 0] };
  proveri(Math.abs(Math.hypot(1.8, 2.4) - 3) < 1e-9, 'težišna CM = AB/2 = 3');
  Q(1, 'Težišna duž $CM$ trougla $ABC$ jednaka je polovini stranice $AB$. Kakav je trougao?',
    ['Pravougli', 'Oštrougli', 'Tupougli', 'Jednakokraki'],
    'Ako je težišna duž jednaka polovini stranice na koju pada, teme $C$ je na kružnici nad $AB$ kao prečnikom, pa je ugao kod $C$ prav (obrnuta Talesova teorema).', 'pravougli',
    { mediji: G(pT, [{ p: 'ABC', b: 0 }, { lin: [[1.8, 2.4], [0, 0]], b: 1, debljina: 2.5 }, { tx: 'CM', at: [0.6, 1.8] }], { bezImena: ['M'], velicina: 260 }),
      medijiOdgovora: G(pT, [{ p: 'ABC', b: 0 }, { kr: 'M', r: 3, b: 1 }, { lin: [[1.8, 2.4], [0, 0]], b: 1, debljina: 2.5 }, { pu: 'ACB' }], { bezImena: ['M'], velicina: 260 }) });

  // nejednakost za težišnu duž
  const tn = { B: [0, 0], C: [6, 0], A: [1, 4] };
  const tnM = sr(tn.B, tn.C);
  const tnD = [r(2 * tnM[0] - tn.A[0]), r(2 * tnM[1] - tn.A[1])];
  const tnTa = Math.hypot(tn.A[0] - tnM[0], tn.A[1] - tnM[1]);
  const tnBc = Math.hypot(tn.A[0] - tn.C[0], tn.A[1] - tn.C[1]) + Math.hypot(tn.A[0] - tn.B[0], tn.A[1] - tn.B[1]);
  proveri(tnTa < tnBc / 2, 't_a < (b+c)/2');
  Q(3, 'Za težišnu duž $t_a$ iz temena $A$ trougla sa stranicama $b = AC$ i $c = AB$ važi:',
    ['$t_a < \\frac{b + c}{2}$', '$t_a > b + c$', '$t_a = \\frac{b + c}{2}$', '$t_a < \\frac{b - c}{2}$'],
    'Produžimo težišnu duž za njenu dužinu do tačke $D$. Tada je $AD = 2t_a$, a iz nejednakosti trougla u $\\triangle ABD$ sledi $2t_a < b + c$. Zato je $t_a < \\frac{b+c}{2}$.', 'nejednakost',
    { mediji: G(tn, [{ p: 'ABC', b: 0 }], { velicina: 260 }),
      medijiOdgovora: G({ ...tn, M: tnM, D: tnD }, [{ p: 'ABC', b: 0 }, { d: 'AD', isp: 1, b: 1 }, { d: 'BD', isp: 1, b: 2 }, { tx: 'AD = 2t_a', at: [4.2, -1.8] }], { bezImena: ['M'], velicina: 260 }) });

  // simetrala ugla: jednaka rastojanja od krakova
  const sm = { O: [0, 0], K: [5.196, 3], L: [5.196, -3], P: [4, 0], F: [3, 1.732], G: [3, -1.732] };
  Q(2, 'Tačka $P$ leži na simetrali ugla. Kako su njena rastojanja od dva kraka ugla?',
    ['Jednaka su', 'Jedno je dvostruko veće', 'Zavise od veličine ugla', 'Jedno je nula'],
    'Trouglovi $OPF$ i $OPG$ imaju zajedničku hipotenuzu $OP$ i jednake oštre uglove kod $O$, pa su podudarni i $PF = PG$. Na tome se zasniva konstrukcija simetrale ugla šestarom.', 'simetrala',
    { mediji: G(sm, [{ d: 'OK', b: 1, debljina: 2.5 }, { d: 'OL', b: 1, debljina: 2.5 }, { tacka: 'P', b: 2 }], { bezImena: ['O', 'K', 'L', 'F', 'G'], velicina: 260 }),
      medijiOdgovora: G(sm, [{ d: 'OK', b: 1, debljina: 2.5 }, { d: 'OL', b: 1, debljina: 2.5 }, { d: 'OP', b: 2, isp: 1 }, { d: 'PF', b: 3, debljina: 2, o: '2 cm' }, { d: 'PG', b: 3, debljina: 2, o: '2 cm' }, { pu: 'PFO' }, { pu: 'PGO' }, { tacka: 'P', b: 2 }], { bezImena: ['O', 'K', 'L'], velicina: 260 }) });

  // deltoid: dijagonala AC je osa simetrije
  const dl = { A: [0, 4], B: [-2, 0], C: [0, -2], D: [2, 0] };
  Q(2, 'U deltoidu $ABCD$ je $AB = AD$ i $CB = CD$. Koja dijagonala deli deltoid na dva podudarna trougla?',
    ['Dijagonala $AC$', 'Dijagonala $BD$', 'Nijedna od dijagonala', 'Obe dijagonale'],
    'Trouglovi $ABC$ i $ADC$ imaju jednake sve tri stranice ($AB = AD$, $CB = CD$, $AC$ zajednička), pa su podudarni po stavu SSS. Dijagonala $BD$ to ne daje, jer je $AB \\neq CB$.', 'deltoid',
    { mediji: G(dl, [{ p: 'ABCD', b: 0 }], { velicina: 260 }),
      medijiOdgovora: G(dl, [{ p: 'ABC', b: 1 }, { p: 'ADC', b: 2 }, { d: 'AC', b: 3, debljina: 2.5 }, { tx: 'ABC ≅ ADC', at: [0.9, 1.6] }], { velicina: 260 }) });

  // jednakokraki: visina iz vrha je i težišna duž (SSU)
  const jv = { A: [-4, 0], B: [4, 0], C: [0, 5], N: [0, 0] };
  Q(2, 'Trougao $ABC$ je jednakokraki sa osnovicom $AB$ ($AC = BC$). Visina $CN$ deli osnovicu na dva jednaka dela. Zašto?',
    ['Pravougli trouglovi $ACN$ i $BCN$ su podudarni (SSU)', 'Trouglovi su slični, ali nisu podudarni, jer im se razlikuju uglovi', 'Osnovica je duža od kraka, pa se visina pomera u stranu', 'Visina je uvek jednaka polovini osnovice trougla'],
    'Pravougli trouglovi $ACN$ i $BCN$ imaju jednake hipotenuze $AC = BC$ i zajedničku katetu $CN$, pa je $AN = BN$ po stavu SSU za pravougle trouglove.', 'osnovica',
    { mediji: G(jv, [{ p: 'ABC', b: 0 }], { bezImena: ['N'], velicina: 240 }),
      medijiOdgovora: G(jv, [{ p: 'ACN', b: 1 }, { p: 'BCN', b: 2 }, { d: 'CN', isp: 1, b: 3 }, { pu: 'CNA' }, { pu: 'CNB' }, { tx: 'SSU', at: [-2, 1.4] }, { tx: 'SSU', at: [2, 1.4] }], { bezImena: ['N'], velicina: 240 }) });

  // pravougli trougao sa katetom polovinom hipotenuze: ugao 30°
  const k30 = { B: [0, 0], A: [0, 5], C: [8.66, 0] };
  Q(2, 'Pravougli trougao $ABC$ ima pravi ugao kod $B$. Kateta $AB$ je $5$ cm, a hipotenuza $AC$ je $10$ cm. Koliki je ugao kod temena $C$?',
    ['30°', '60°', '45°', '90°'],
    'Naspram katete koja je polovina hipotenuze leži ugao od $30°$. Ugao kod $A$ je tada $60°$, a zbir uglova je $180°$.', 'ugao',
    { mediji: G(k30, [{ p: 'ABC', b: 0 }, { pu: 'ABC' }, { d: 'AB', o: '5 cm', b: 1, debljina: 2 }, { d: 'AC', o: '10 cm', b: 2, debljina: 2 }], { velicina: 260 }),
      medijiOdgovora: G(k30, [{ p: 'ABC', b: 0 }, { pu: 'ABC' }, { u: 'BCA', o: '30°', b: 3 }, { u: 'CAB', o: '60°', b: 4 }], { velicina: 260 }) });

  S(2, 'Spoji stav podudarnosti sa uslovom koji ga određuje.',
    [['SSS', 'tri jednake stranice'], ['SUS', 'dve stranice i ugao između njih'], ['USU', 'dva ugla i stranica između njih'], ['SSU (pravougli)', 'hipotenuza i jedna kateta']],
    'Za pravougle trouglove važi i stav SSU: ako su jednake hipotenuza i jedna kateta, trouglovi su podudarni.', 'podudarnost');

  // ── dodatna teža pitanja (težina 3) ──
  L('Složenije primene stavova podudarnosti');
  {
    const ej = { A: [0, 0], B: [2, 0], C: [1, r(Math.sqrt(3))], D: [4, 0], E: [7, 0], F: [5.5, r((3 * Math.sqrt(3)) / 2)] };
    Q(3, 'Koji od ovih uslova NIJE stav podudarnosti trouglova?', ['SSS', 'SUS', 'USU', 'UUU'],
      'Tri jednaka ugla određuju samo oblik trougla, ne i veličinu. Jednakostranični trouglovi stranica $2$ i $3$ imaju iste uglove, a nisu podudarni. Svaki stav podudarnosti mora da sadrži bar jednu stranicu.', 'podudarnost',
      { mediji: G(ej, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 1 }, { u: 'BAC', o: '60°' }, { u: 'ABC', o: '60°' }, { u: 'ACB', o: '60°' }, { u: 'EDF', o: '60°' }, { u: 'DEF', o: '60°' }, { u: 'DFE', o: '60°' }], { bezImena: sve(ej), velicina: 300 }) });

    const sa = { A: [0, 0], B: [r(5 * Math.cos(Math.PI / 6)), 2.5] };
    const xc1 = r(5 * Math.cos(Math.PI / 6) + Math.sqrt(2.75)), xc2 = r(5 * Math.cos(Math.PI / 6) - Math.sqrt(2.75));
    proveri(Math.abs(Math.hypot(xc1 - sa.B[0], sa.B[1]) - 3) < 0.01 && Math.abs(Math.hypot(xc2 - sa.B[0], sa.B[1]) - 3) < 0.01, 'obe tačke C su na 3 cm od B');
    const t1 = { ...sa, C: [xc1, 0] }, t2 = { ...sa, D: [xc2, 0] };
    Q(3, 'Dva trougla imaju stranice $5$ cm i $3$ cm i ugao $30°$ naspram stranice $3$ cm, a ugao između stranica nije dat. Da li su ta dva trougla obavezno podudarna?',
      ['Ne, mogu postojati dva različita trougla', 'Da, po stavu SSU', 'Da, po stavu SUS', 'Da, po stavu USU'],
      'Kad je dati ugao naspram manje od dve dane stranice, dve stranice i ugao ne određuju trougao jednoznačno. Obe tačke $C$ su na tačno $3$ cm od $B$, a obe daju trougao sa uglom $30°$ kod $A$.', 'ugao',
      { mediji: G(t1, [{ p: 'ABC', b: 0 }, { d: 'AB', o: '5 cm', b: 1 }, { d: 'BC', o: '3 cm', b: 2 }, { u: 'BAC', o: '30°', b: 3 }], { velicina: 300 }),
        medijiOdgovora: G({ ...t1, ...t2 }, [{ p: 'ABC', b: 0 }, { p: 'ABD', b: 2 }, { d: 'AB', o: '5 cm', b: 1 }, { tx: '3 cm', at: [4.3, 0.5] }], { velicina: 300 }) });
  }

  return undefined;
};
