// Sličnost – teorija 8. razreda (1. tema, udžbenik Matematika 8, 1. deo, str. 11–36):
// proporcionalnost duži, Talesova teorema, konstrukcije (podela duži, četvrta proporcionala),
// sličnost trouglova, stavovi sličnosti, pravougli trougao (visina, katete), primene (senke, reke, Zemlja).
// Pitanja su sopstvena; crteži su medij „geo“ (paralelne prave, trouglovi u raznim položajima, konstrukcije u koracima).
module.exports = ({ L, Q, U, S, G: G0, r, proveri, rad }) => {
  // svaka imenovana tačka dobija malu tačku (inače crtež ne ispisuje ime ako ga nijedan element ne koristi)
  const G = (T, e = [], x = {}) => G0(T, [...e, ...Object.keys(T).filter((n) => !(x.bezImena || []).includes(n)).map((n) => ({ tacka: n, b: 3 }))], x);
  const GO = { velicina: 260 };
  const rr = (x) => +(+x).toFixed(3);
  const jedinicni = (ug) => [Math.cos(rad(ug)), Math.sin(rad(ug))];
  // presek prave P + t·v sa polupravom s·u (u jedinični vektor, poluprava iz O): tačka s·u
  const presek = (P, v, u) => {
    const det = u[0] * v[1] - u[1] * v[0];
    const s = (v[1] * P[0] - v[0] * P[1]) / det;
    return [rr(s * u[0]), rr(s * u[1])];
  };
  // male crtice za podelu duži PQ na n jednakih delova
  const podeoci = (P, Q, n, b = 4) => Array.from({ length: n - 1 }, (_, i) => {
    const t = (i + 1) / n, x = P[0] + (Q[0] - P[0]) * t, y = P[1] + (Q[1] - P[1]) * t;
    const dl = Math.hypot(Q[0] - P[0], Q[1] - P[1]), nx = (-(Q[1] - P[1]) / dl) * 0.22, ny = ((Q[0] - P[0]) / dl) * 0.22;
    return { lin: [[rr(x - nx), rr(y - ny)], [rr(x + nx), rr(y + ny)]], b, debljina: 2 };
  });
  const tr = (T, ime, e = [], x = {}) => G(T, [{ p: ime, b: 0 }, ...e], { velicina: 240, ...x });

  // Talesov crtež: krakovi ugla u O (x-osa i poluprava pod uglom 35°), paralelne prave kroz tačke na x-osi.
  // parovi: [[x, 'ime na prvom kraku', 'ime na drugom kraku'], …]; razmera OA : OA₁ je ista kao OB : OB₁.
  const TH = 35, VP = [-0.5, 1], UR = jedinicni(TH);
  function talesov(parovi, { e = [], t = {}, velicina = 280, bez = false } = {}) {
    const T = { O: [0, 0], ...t };
    const el = [{ lin: [[0, 0], [10, 0]], b: 5, debljina: 2 }, { lin: [[0, 0], [9 * UR[0], 9 * UR[1]]], b: 5, debljina: 2 }];
    parovi.forEach(([x, n1, n2], i) => {
      const P = [x, 0], B = presek(P, VP, UR);
      T[n1] = P; T[n2] = B;
      el.push({ lin: [[rr(x + 0.35), -0.7], [rr(B[0] - 0.35), rr(B[1] + 0.7)]], b: 1 + i, debljina: 3 });
    });
    return G(T, [...el, ...e], { velicina, ...(bez ? { bezImena: ['O'] } : {}) });
  }
  // dve paralelne prave kroz tačke koje su istim redom na dve transverzale (za pitanja „3 paralelne prave“)
  function tri(ys, p, q, { imena = ['A', 'B', 'C'], imena2 = ['A₁', 'B₁', 'C₁'], e = [] } = {}) {
    const T = {};
    const el = ys.map((y, i) => ({ lin: [[-1, y], [9, y]], b: 4, debljina: 2 }));
    const na = (P0, P1, y) => [rr(P0[0] + ((P1[0] - P0[0]) * (y - P0[1])) / (P1[1] - P0[1])), y];
    el.push({ lin: [p[0], p[1]], b: 1, debljina: 3 }, { lin: [q[0], q[1]], b: 2, debljina: 3 });
    ys.forEach((y, i) => { T[imena[i]] = na(p[0], p[1], y); T[imena2[i]] = na(q[0], q[1], y); });
    return G(T, [...el, ...e], { velicina: 280 });
  }

  // ════════ 1. Proporcionalnost duži ════════
  L('Proporcionalnost duži');
  Q(1, 'Duži na crtežu su nacrtane u tačnoj razmeri. Koji odnos $AB : CD$ pokazuje crtež?',
    ['$3 : 2$', '$2 : 3$', '$3 : 4$', '$5 : 2$'],
    'Razmera ne zavisi od jedinice mere: $1 m : 50 cm = 100 cm : 50 cm = 2 : 1$. Važno je da obe dužine izrazimo u istoj jedinici.',
    'razmera',
    { mediji: G({ A: [0, 3], B: [6, 3], C: [0, 0], D: [4, 0] }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }], GO) });
  Q(1, 'Ako je $a : b = 5 : 2$, koja duž je duža?',
    ['Duž $a$', 'Duž $b$', 'Obe su jednake', 'Odnos zavisi od jedinice mere'],
    'Razmera je bez jedinice: ako su dužine izražene istom jedinicom, veći broj u razmeri pripada dužoj duži. Ovde $5 > 2$, pa je $a$ duža.',
    'razmera',
    { mediji: G({ P: [0, 3], Q: [5, 3], R: [0, 0], S: [2, 0] }, [{ d: 'PQ', o: 'a', b: 1, debljina: 3 }, { d: 'RS', o: 'b', b: 2, debljina: 3 }], GO) });
  Q(1, 'Ako je $a : b = c : d$, koja jednakost je tačna?',
    ['$a · d = b · c$', '$a · b = c · d$', '$a + d = b + c$', '$a · c = b · d$'],
    'Proporcija se čita „unakrsno“: iz $\\frac{a}{b} = \\frac{c}{d}$ množenjem sa $b · d$ dobijamo $a · d = b · c$. Ostale jednakosti nisu posledica proporcije.',
    'proporcija',
    { mediji: G({ A: [0, 4], B: [2, 4], C: [0, 2], D: [3, 2], E: [0, 0], F: [4, 0], H: [0, -2], K: [6, -2] },
      [{ d: 'AB', o: 'a', b: 1, debljina: 3 }, { d: 'CD', o: 'b', b: 2, debljina: 3 }, { d: 'EF', o: 'c', b: 3, debljina: 3 }, { d: 'HK', o: 'd', b: 4, debljina: 3 }],
      { velicina: 260, bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'K'] }) });
  Q(1, 'Duž $MN$ je $21 cm$, a tačka $P$ deli je tako da je $MP : PN = 2 : 5$. Kolika je duž $MP$?',
    ['$6 cm$', '$15 cm$', '$7 cm$', '$4 cm$'],
    'Razmera $2 : 5$ deli duž na $2 + 5 = 7$ jednakih delova. Jedan deo je $21 : 7 = 3 cm$, pa je $MP = 2 · 3 = 6 cm$, a $PN = 15 cm$.',
    'razmera',
    { mediji: G({ M: [0, 0], N: [7, 0], P: [2, 0] }, [{ lin: [[0, 0], [7, 0]], b: 1, debljina: 3 }, ...podeoci([0, 0], [7, 0], 7), { tacka: 'P', b: 3 }], { ...GO, bezImena: ['P'] }) });
  Q(2, 'Tačka $T$ deli duž $AB$ u razmeri $AT : TB = 3 : 4$. Koji deo duži $AB$ je duž $AT$?',
    ['$\\frac{3}{7}$', '$\\frac{3}{4}$', '$\\frac{4}{7}$', '$\\frac{1}{2}$'],
    'Duž se deli na $3 + 4 = 7$ delova, a $AT$ zauzima $3$ od njih. Odnos $\\frac{3}{4}$ je odnos dva dela, a ne deo cele duži.',
    'razmera',
    { mediji: G({ A: [0, 0], B: [7, 0], T: [3, 0] }, [{ d: 'AB', b: 1, debljina: 3 }, { tacka: 'T', b: 3 }], GO),
      medijiOdgovora: G({ A: [0, 0], B: [7, 0], T: [3, 0] }, [{ lin: [[0, 0], [7, 0]], b: 1, debljina: 3 }, ...podeoci([0, 0], [7, 0], 7), { lin: [[0, 0], [3, 0]], b: 2, debljina: 6 }, { tacka: 'T', b: 3 }], GO) });
  Q(2, 'Duži na crtežu su u razmeri $5 : 3$, a duža je od kraće za $8 cm$. Koliko je dugačka duža duž?',
    ['$20 cm$', '$15 cm$', '$12 cm$', '$40 cm$'],
    'Neka su duži $5x$ i $3x$. Razlika $5x − 3x = 2x = 8 cm$, pa je $x = 4 cm$ i duža duž je $5x = 20 cm$. Provera: kraća je $12 cm$, a $20 − 12 = 8$.',
    'razmera',
    { mediji: G({ P: [0, 3], Q: [5, 3], R: [0, 0], S: [3, 0] }, [{ d: 'PQ', o: 'a', b: 1, debljina: 3 }, { d: 'RS', o: 'b', b: 2, debljina: 3 }], GO),
      medijiOdgovora: G({ P: [0, 3], Q: [5, 3], R: [0, 0], S: [3, 0] }, [{ d: 'PQ', o: 'a', b: 1, debljina: 3 }, { d: 'RS', o: 'b', b: 2, debljina: 3 }, ...podeoci([0, 3], [5, 3], 5, 3), ...podeoci([0, 0], [3, 0], 3, 3)], GO) });
  Q(2, 'Duž $AB$ je podeljena na tri dela u razmeri $1 : 2 : 3$, kao na crtežu. Najduži deo ima $12 cm$. Koliko je duga cela duž $AB$?',
    ['$24 cm$', '$12 cm$', '$36 cm$', '$18 cm$'],
    'Delovi su $x$, $2x$ i $3x$; najduži je $3x = 12 cm$, pa je $x = 4 cm$. Cela duž je $x + 2x + 3x = 6x = 24 cm$.',
    'razmera',
    { mediji: G({ A: [0, 0], B: [6, 0], M: [1, 0], N: [3, 0] }, [{ lin: [[0, 0], [6, 0]], b: 1, debljina: 3 }, ...podeoci([0, 0], [6, 0], 6), { tacka: 'M', b: 3 }, { tacka: 'N', b: 3 }], GO) });
  Q(2, 'Dva mesta su na karti razmere $1 : 200 000$ udaljena $7{,}5 cm$. Koliko su udaljena u stvarnosti?',
    ['$15 km$', '$1{,}5 km$', '$150 km$', '$7{,}5 km$'],
    '$1 cm$ na karti je $200 000 cm = 2 km$ u prirodi. Zato je $7{,}5 · 2 = 15 km$. Pazi na jedinice: $100 000 cm$ je $1 km$.',
    'karta',
    { mediji: G({ K: [0, 0], L: [6, 2] }, [{ d: 'KL', b: 1, isp: 1, debljina: 3 }, { tx: '~karta', at: [2.4, 1.9], b: 3 }], GO) });
  Q(1, 'Na planu parcele dužina je $10 cm$, a u prirodi je ista dužina $40 m$. Kolika je razmera plana?',
    ['$1 : 400$', '$1 : 4$', '$1 : 40$', '$1 : 4000$'],
    '$40 m = 4000 cm$, pa je razmera $10 : 4000 = 1 : 400$. Zapamti: razmera se računa u istim jedinicama.',
    'razmera',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [4, 2.5], D: [0, 2.5] }, [{ p: 'ABCD', b: 2 }, { tx: '~plan', at: [1.2, 1.1], b: 3 }], GO) });
  Q(2, 'Da li su duži $0{,}6 m$ i $90 cm$ samerljive?',
    ['Da, jer je njihov odnos racionalan broj $\\frac{2}{3}$', 'Ne, jer je $0{,}6 m$ decimalan broj', 'Ne, jer je jedna duž u metrima, a druga u centimetrima', 'Da, jer su obe kraće od jednog metra'],
    'Samerljive su duži kod kojih je odnos racionalan broj. $60 cm : 90 cm = \\frac{2}{3}$, pa su samerljive. Duži se mogu porediti kad se izraze u istoj jedinici.',
    'samerljive',
    { mediji: G({ A: [0, 2], B: [6, 2], C: [0, 0], D: [9, 0] }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }], GO) });
  Q(1, 'Kolika je razmera dijagonale i stranice kvadrata?',
    ['$\\sqrt{2}$', '$2$', '$\\frac{1}{2}$', '$\\sqrt{3}$'],
    'Pitagorejcima se pripisuje otkriće da $\\sqrt{2}$ nije racionalan broj. Zato odnos dijagonale i stranice kvadrata nije racionalan broj: ove duži nisu samerljive.',
    'dijagonala',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 3, isp: 1 }], GO),
      medijiOdgovora: G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 3, o: 'a√2', isp: 1 }, { d: 'AB', b: 1, o: 'a' }], GO) });
  Q(3, 'Kružnica prečnika $d$ „ispravi“ se u duž dužine $O$. Da li su duži $O$ i $d$ samerljive?',
    ['Ne, jer $π$ nije racionalan broj', 'Da, jer je $O = d · π$ i $π$ je racionalan', 'Da, jer su obe duži iste dužine kruga', 'Ne, jer je $O$ veće od $d$ za četiri puta'],
    'Obim kruga je $O = d · π$. Broj $π$ nije racionalan, pa odnos $O : d = π$ nije racionalan broj i duži nisu samerljive.',
    'obim',
    { mediji: G({ C: [0, 0] }, [{ kr: 'C', r: 1.2, b: 1, debljina: 3 }, { lin: [[-1.6, -2.4], [5.9, -2.4]], b: 3, debljina: 3 }, { tx: '~O', at: [1.6, -2.0] }, { tx: '~d', at: [-0.2, 1.6] }], { velicina: 260, bezImena: ['C'] }) });
  U(2, 'Tri para duži su samerljiva, a jedan par nije. Koji par NIJE samerljiv?',
    ['$\\sqrt{2}$ cm i $1$ cm', '$2$ cm i $5$ cm', '$\\sqrt{8}$ cm i $\\sqrt{2}$ cm', '$0{,}5$ m i $75$ cm'],
    'Samerljive su $2$ i $5$ cm (odnos $\\frac{2}{5}$), $\\sqrt{8}$ i $\\sqrt{2}$ (odnos $2$), $50$ i $75$ cm (odnos $\\frac{2}{3}$). Samo odnos $\\sqrt{2} : 1$ nije racionalan broj.',
    'Samerljive duži moraju imati racionalan odnos. Ako bi bile samerljive, $\\sqrt{2}$ bi bio racionalan broj.',
    'samerljive',
    { mediji: { vrsta: 'formula', tekst: '$\\frac{a}{b}$ je racionalan broj?' } });
  Q(3, 'Duž $a$ je $1{,}5$ puta duža od duži $b$. Koji je odnos $b : a$?',
    ['$2 : 3$', '$3 : 2$', '$1 : 2$', '$3 : 1$'],
    'Ako je $a = 1{,}5 · b = \\frac{3}{2} b$, onda je $b : a = 1 : \\frac{3}{2} = 2 : 3$. Obrnuta razmera se dobija zamenom mesta brojevima.',
    'razmera',
    { mediji: G({ P: [0, 3], Q: [6, 3], R: [0, 0], S: [4, 0] }, [{ d: 'PQ', o: 'a', b: 1, debljina: 3 }, { d: 'RS', o: 'b', b: 2, debljina: 3 }], GO) });
  Q(3, 'Koliki je odnos obima kvadrata i njegove dijagonale?',
    ['$2\\sqrt{2}$', '$\\frac{1}{4}$', '$\\sqrt{2}$', '$2$'],
    'Ako je stranica $a$, obim je $4a$, a dijagonala $a\\sqrt{2}$. Odnos je $\\frac{4a}{a\\sqrt{2}} = \\frac{4}{\\sqrt{2}} = 2\\sqrt{2}$.',
    'dijagonala',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [{ p: 'ABCD', b: 4 }, { d: 'BD', b: 2, isp: 1 }], GO) });

  Q(1, 'Kolika je razmera duži $2 m$ i $50 cm$, zapisana u najprostijem obliku?',
    ['$4 : 1$', '$2 : 1$', '$1 : 4$', '$5 : 2$'],
    'Obe duži izražavamo u centimetrima: $200 : 50 = 4 : 1$. Razmera se ne menja kad obe dužine pomnožimo istim brojem.',
    'razmera',
    { mediji: G({ A: [0, 2], B: [8, 2], C: [0, 0], D: [2, 0] }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }], GO) });

  // ════════ 2. Talesova teorema ════════
  L('Talesova teorema');
  Q(1, 'Paralelne prave $AB$ i $A_1B_1$ seku krake ugla sa temenom $O$ (crtež). Koja proporcija je tačna?',
    ['$\\frac{OA}{OA_1} = \\frac{AB}{A_1B_1}$', '$\\frac{OA}{AA_1} = \\frac{AB}{A_1B_1}$', '$\\frac{OA}{OA_1} = \\frac{A_1B_1}{AB}$', '$\\frac{OB}{OA} = \\frac{OA_1}{OB_1}$'],
    'Ovo je Talesova teorema: paralelne prave na kracima ugla odsecaju proporcionalne odsečke. Odsečak $OA$ prema $OA_1$ jednak je odnosu $AB$ prema $A_1B_1$.',
    'proporcija',
    { mediji: talesov([[4, 'A', 'B'], [6, 'A₁', 'B₁']]) });
  Q(1, 'Dve paralelne prave seku krake ugla. Šta važi za odsečke na jednom i na drugom kraku?',
    ['Odsečci su proporcionalni', 'Odsečci su uvek jednaki', 'Odsečci su normalni jedan na drugi', 'Odsečci su jednaki samo kod pravog ugla'],
    'Ako su paralelne prave na jednom kraku odsekle jednake odsečke, jednaki su i na drugom kraku. Opšte pravilo je proporcionalnost, a jednakost je poseban slučaj.',
    'proporcija',
    { mediji: talesov([[2, 'A', 'B'], [4, 'A₁', 'B₁'], [6, 'A₂', 'B₂']]) });
  Q(1, 'Trapez $ABCD$ ima osnovice $AB$ i $CD$. Kraci $AD$ i $BC$ polove se tačkama $M$ i $N$: $M$ je središte kraka $AD$, a $N$ središte kraka $BC$. Ako je $AB = 16 cm$ i $CD = 8 cm$, kolika je duž $MN$?',
    ['$12 cm$', '$24 cm$', '$8 cm$', '$6 cm$'],
    'Srednja linija trapeza jednaka je polovini zbira osnovica: $MN = \\frac{16 + 8}{2} = 12 cm$. Talesova teorema objašnjava zašto je tako: $M$ i $N$ su središta krakova.',
    'srednja',
    { mediji: G({ A: [0, 0], B: [16, 0], C: [12, 4], D: [4, 4], M: [2, 2], N: [14, 2] }, [{ p: 'ABCD', b: 0 }, { d: 'MN', b: 2, isp: 1 }], GO) });
  Q(2, 'Na kracima ugla je $OA = 4 cm$ i $OA_1 = 6 cm$. Duž $AB = 5 cm$ leži na pravoj paralelnoj sa $A_1B_1$. Kolika je duž $A_1B_1$?',
    ['$7{,}5 cm$', '$5 cm$ ili $4{,}5 cm$', '$6 cm$ ili $8 cm$', '$8{,}33 cm$'],
    'Iz $\\frac{OA}{OA_1} = \\frac{AB}{A_1B_1}$ sledi $\\frac{4}{6} = \\frac{5}{A_1B_1}$, pa je $A_1B_1 = \\frac{5 · 6}{4} = 7{,}5 cm$.',
    'proporcija',
    { mediji: talesov([[4, 'A', 'B'], [6, 'A₁', 'B₁']]) });
  Q(1, 'Na jednom kraku ugla je $OA : OA_1 = 2 : 5$. Ako je duž $AB = 4 cm$, kolika je $A_1B_1$?',
    ['$10 cm$', '$4 cm$', '$2{,}5 cm$', '$20 cm$'],
    'Odnos odsečaka na prvom kraku jednak je odnosu $AB : A_1B_1$, pa je $4 : A_1B_1 = 2 : 5$, odakle je $A_1B_1 = 10 cm$.',
    'proporcija',
    { mediji: talesov([[2, 'A', 'B'], [5, 'A₁', 'B₁']]) });
  Q(2, 'Tri paralelne prave seku prvu transverzalu tako da je $AB = 3 cm$, $BC = 5 cm$, a na drugoj transverzali $A_1B_1 = 6 cm$. Kolika je duž $B_1C_1$?',
    ['$10 cm$', '$9 cm$ ili $8 cm$', '$8 cm$ ili $12 cm$', '$6 cm$ ili $5 cm$'],
    'Paralelne prave odsecaju na obe transverzale proporcionalne odsečke: $AB : BC = A_1B_1 : B_1C_1$, tj. $3 : 5 = 6 : B_1C_1$. Zato je $B_1C_1 = 10 cm$.',
    'sečica',
    { mediji: tri([0, 3, 8], [[0.2, -1], [1.8, 9]], [[5.2, -1], [6.8, 9]]) });
  Q(2, 'Na stranicama $AC$ i $BC$ trougla $ABC$ date su tačke $D$ i $E$ tako da je $DE \\parallel AB$. Ako je $CD = 6 cm$, $DA = 4 cm$ i $AB = 15 cm$, kolika je duž $DE$?',
    ['$9 cm$', '$10 cm$', '$6 cm$', '$7{,}5 cm$'],
    'Iz paralelnosti sledi $\\frac{CD}{CA} = \\frac{DE}{AB}$. Kako je $CA = 10 cm$, $\\frac{6}{10} = \\frac{DE}{15}$, pa je $DE = 9 cm$.',
    'paralelne',
    { mediji: tr({ A: [0, 0], B: [10, 0], C: [6, 6], D: [2.4, 2.4], E: [8.4, 2.4] }, 'ABC', [{ d: 'DE', b: 2, debljina: 3 }], { bezImena: [] }) });
  Q(2, 'U trapezu $ABCD$ ($AB \\parallel CD$) dijagonale se seku u tački $P$. Koja tvrdnja je tačna?',
    ['$\\frac{AP}{PC} = \\frac{AB}{CD}$', '$\\frac{AP}{AC} = \\frac{AB}{CD}$', '$\\frac{AB}{AD} = \\frac{CD}{BC}$', '$\\frac{AP}{PB} = \\frac{CD}{AB}$'],
    'Trouglovi $APB$ i $CPD$ su slični (uglovi kod $P$ su jednaki, a $AB \\parallel CD$), pa je $AP : PC = AB : CD$. Odnos $AP : AC$ nije isto što i $AP : PC$.',
    'dijagonale',
    { mediji: G({ A: [0, 0], B: [6, 0], C: [4, 3], D: [1, 3], P: [2.667, 2] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1, isp: 1 }, { d: 'BD', b: 2, isp: 1 }], GO) });
  Q(3, 'U trapezu $ABCD$ ($AB \\parallel CD$) je $AB = 12 cm$, $CD = 4 cm$, a dijagonale se seku u $P$. Ako je $AC = 16 cm$, kolika je duž $PC$?',
    ['$4 cm$', '$12 cm$', '$16 cm$', '$3 cm$'],
    'Odnos $AP : PC = AB : CD = 12 : 4 = 3 : 1$, pa je $PC = \\frac{1}{4} AC = 4 cm$.',
    'dijagonale',
    { mediji: G({ A: [0, 0], B: [12, 0], C: [8, 3], D: [4, 3], P: [6, 2.25] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1, isp: 1 }, { d: 'BD', b: 2, isp: 1 }], GO) });
  Q(3, 'Odsečci na prvom kraku su $OA : OA_1 = 2 : 5$, a na drugom kraku duž $OB_1 = 12 cm$. Kolika je duž $OB$?',
    ['$4{,}8 cm$', '$12 cm$ ili $6 cm$', '$5 cm$ ili $2 cm$', '$30 cm$ ili $10 cm$'],
    'Paralelne prave daju $\\frac{OB}{OB_1} = \\frac{OA}{OA_1} = \\frac{2}{5}$, pa je $OB = \\frac{2}{5} · 12 = 4{,}8 cm$.',
    'proporcija',
    { mediji: talesov([[2, 'A', 'B'], [5, 'A₁', 'B₁']]) });
  U(2, 'Koja proporcija NIJE tačna za paralelne prave $AB \\parallel A_1B_1$ koje seku krake ugla?',
    ['$\\frac{OA}{OA_1} = \\frac{A_1B_1}{AB}$', '$\\frac{OA}{OA_1} = \\frac{AB}{A_1B_1}$', '$\\frac{OA}{OB} = \\frac{OA_1}{OB_1}$', '$\\frac{OA}{AA_1} = \\frac{OB}{BB_1}$'],
    'Odnos $OA : OA_1$ jednak je $AB : A_1B_1$, a ne obrnutom odnosu. Ostale tri su tačne: iz paralelnosti sledi $OA : OA_1 = OB : OB_1$, a odatle i ostale.',
    'Obrtanje razlomka menja smer odnosa. Kad se zamene brojilac i imenilac jedne strane, dobija se netačna proporcija.',
    'proporcija',
    { mediji: talesov([[2, 'A', 'B'], [5, 'A₁', 'B₁']]) });
  Q(1, 'Kako se zove teorema koja kaže da paralelne prave na kracima ugla odsecaju proporcionalne odsečke?',
    ['Talesova teorema', 'Pitagorina teorema', 'Teorema o zbiru uglova', 'Euklidova teorema o visini'],
    'Talesu iz Mileta (oko 600. godine p. n. e.) pripisuje se i tvrdnja da je ugao nad prečnikom kruga prav. Ta tvrdnja je srodna, ali nije ista kao teorema o proporcionalnim odsečcima.',
    'Talesova',
    { mediji: talesov([[3, 'A', 'B'], [6, 'A₁', 'B₁']]) });
  Q(2, 'Na jednom kraku ugla su $OA = 3 cm$ i $OA_1 = 4 cm$, a duž $AB$ na paralelnoj pravoj je $6 cm$. Kolika je duž $A_1B_1$?',
    ['$8 cm$', '$4{,}5 cm$', '$9 cm$', '$6 cm$'],
    'Iz $\\frac{OA}{OA_1} = \\frac{AB}{A_1B_1}$ dobijamo $\\frac{3}{4} = \\frac{6}{A_1B_1}$, pa je $A_1B_1 = 8 cm$.',
    'proporcija',
    { mediji: talesov([[3, 'A', 'B'], [4, 'A₁', 'B₁']]) });
  Q(1, 'Odsečci na jednom kraku ugla su jednaki ($AB = BC$). Šta važi za odsečke koje paralelne prave odsecaju na drugom kraku?',
    ['Takođe su jednaki', 'Dvostruko su veći', 'Zavise od veličine ugla', 'Uvek su različiti'],
    'Iz proporcionalnosti sledi da su jednaki odnosi jednakih odsečaka: ako je $AB = BC$, onda je i $A_1B_1 = B_1C_1$. Talesova teorema važi za bilo koji ugao.',
    'jednaki',
    { mediji: tri([0, 3, 6], [[0.2, -1], [1.8, 7]], [[5.2, -1], [6.4, 7]]) });
  S(2, 'Spoji pojam sa njegovim značenjem u vezi sa Talesovom teoremom.',
    [['paralelne prave na kracima ugla', 'odsecaju proporcionalne odsečke'], ['srednja linija trapeza', 'polovina zbira osnovica'], ['dijagonale trapeza', 'seku se u razmeri osnovica'], ['konstrukcija podele duži', 'nanošenje jednakih odsečaka']],
    'Srednja linija trapeza ima dužinu $\\frac{a + b}{2}$, gde su $a$ i $b$ osnovice. Dijagonale trapeza se seku tako da su odnosi odsečaka jednaki odnosu osnovica.',
    'proporcija',
    { mediji: talesov([[2, 'A', 'B'], [4, 'A₁', 'B₁']]) });

  Q(2, 'Ako je odnos odsečaka $OA : OA_1 = 3 : 2$, kakav je odnos paralelnih duži $AB : A_1B_1$?',
    ['$3 : 2$', '$2 : 3$', '$3 : 5$', '$1 : 2$'],
    'Paralelne prave daju $AB : A_1B_1 = OA : OA_1$, pa je odnos $3 : 2$. Odnos bi bio $2 : 3$ samo da su odsečci zamenili mesta.',
    'paralelne',
    { mediji: talesov([[3, 'A', 'B'], [2, 'A₁', 'B₁']]) });

  // ════════ 3. Primena Talesove teoreme u konstrukcijama ════════
  // podela duži AB na n jednakih delova: pomoćna poluprava iz A, jednaki odsečci, paralele A_iB_i ∥ A_nB
  const IND = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
  function podela(n, { ticks = true, paralele = null, ugao = 50 } = {}) {
    const A = [0, 0], B = [10, 0], u = jedinicni(ugao), Zn = [rr(7 * u[0]), rr(7 * u[1])];
    const T = { A, B };
    const el = [{ lin: [A, B], b: 1, debljina: 3 }, { lin: [A, Zn], b: 0, debljina: 2, crtaj: 1, kasni: 0.2, trajanje: 1.2 }];
    if (ticks) {
      for (let i = 1; i <= n; i++) T['A' + IND[i]] = [rr(7 * i / n * u[0]), rr(7 * i / n * u[1])];
      el.push({ lin: [T['A' + IND[n]], B], b: 4, isp: 1, kasni: 1.2, crtaj: 1 });
    }
    for (let i = 1; ticks && i < n; i++) {
      T['B' + IND[i]] = [rr(10 * i / n), 0];
      if (!paralele || paralele.includes(i)) el.push({ lin: [T['A' + IND[i]], T['B' + IND[i]]], b: 2, isp: 1, kasni: 1.8 + 0.3 * i, crtaj: 1 });
    }
    return G(T, el, { velicina: 280, ...(ticks ? {} : { bezImena: ['A', 'B'] }) });
  }

  L('Primena Talesove teoreme u konstrukcijama');
  Q(1, 'Duž $AB$ treba podeliti na $5$ jednakih delova. Koliko jednakih odsečaka nanosimo na pomoćnu polupravu iz temena $A$?',
    ['$5$', '$4$', '$6$', '$10$'],
    'Na polupravoj nanosimo onoliko jednakih odsečaka koliko će delova imati duž. Tačka $A_5$ je peta po redu, pa spajamo $A_5$ sa $B$.',
    'poluprava',
    { mediji: podela(5, { ticks: false }), medijiOdgovora: podela(5) });
  Q(1, 'Duž $AB = 10 cm$ podeljena je na $5$ jednakih delova. Kolika je dužina jednog dela?',
    ['$2 cm$', '$5 cm$', '$1 cm$', '$10 cm$'],
    'Deo je $10 : 5 = 2 cm$. Podela nije uvek ovako lepa, ali konstrukcija daje isti rezultat bez merenja.',
    'podela',
    { mediji: G({ A: [0, 0], B: [10, 0] }, [{ lin: [[0, 0], [10, 0]], b: 1, debljina: 3 }], { velicina: 280 }), medijiOdgovora: podela(5) });
  Q(2, 'Pri podeli duži $AB$ na jednake delove povlačimo prave kroz tačke pomoćne poluprave. Čemu su te prave paralelne?',
    ['Pravoj koja spaja kraj poluprave sa $B$', 'Duži $AB$, a prolaze kroz njeno središte i $O$', 'Normalne su na $AB$ kroz sve deobne tačke', 'Simetrali ugla kod temena $A$ i pravom uglu'],
    'Talesova teorema kaže da paralele koje prolaze kroz deobne tačke na pomoćnoj polupravoj odsecaju jednake odsečke na $AB$ kad su odsečci na polupravoj jednaki.',
    'paralela',
    { mediji: podela(5, { paralele: [] }), medijiOdgovora: podela(5) });
  Q(2, 'Duž $AB$ treba podeliti u razmeri $2 : 5$. Koliko jednakih odsečaka nanosimo na pomoćnu polupravu?',
    ['$7$', '$5$', '$2$', '$10$'],
    'Razmera $2 : 5$ znači $2 + 5 = 7$ jednakih delova. Na polupravoj nanosimo $7$ odsečaka i spajamo kraj sedmog sa $B$.',
    'razmera',
    { mediji: podela(7, { ticks: false }), medijiOdgovora: podela(7) });
  Q(2, 'Tačka $M$ deli $AB$ u razmeri $AM : MB = 5 : 2$. Kroz koju tačku pomoćne poluprave povlačimo paralelu sa pravom $A_7B$?',
    ['Kroz petu tačku $A_5$', 'Kroz drugu tačku $A_2$', 'Kroz šestu tačku $A_6$', 'Kroz sedmu tačku $A_7$'],
    'Odsečci na polupravoj su $AA_5 : A_5A_7 = 5 : 2$, pa paralela kroz $A_5$ sa $A_7B$ seče $AB$ u tački $M$ koja deli duž u razmeri $5 : 2$.',
    'paralela',
    { mediji: podela(7, { paralele: [] }), medijiOdgovora: podela(7, { paralele: [5] }) });
  Q(1, 'Dato je $a$. Konstruiši duž $x$ tako da je $a : x = 3 : 2$. Prvi način: koliko jednakih odsečaka nanosimo na polupravu $Oq$ da dobijemo deobu na $3 + 2$ dela?',
    ['$5$', '$3$', '$2$', '$7$'],
    'Kod proporcije $a : x = 3 : 2$ zbir brojeva u razmeri je $3 + 2 = 5$. Na polupravu $Oq$ nanosimo $5$ jednakih odsečaka, a dužinu $a$ nanosimo na drugu polupravu.',
    'šestar',
    { mediji: { vrsta: 'formula', tekst: '$a : x = 3 : 2$' } });
  Q(2, 'Kako se zove konstrukcija duži $x$ iz proporcije $a : b = c : x$?',
    ['Konstrukcija četvrte proporcionale', 'Konstrukcija simetrale duži i središta', 'Konstrukcija normale na pravu iz tačke', 'Konstrukcija tangente kruga iz tačke'],
    'Četvrta geometrijska proporcionala je duž $x$ koja se dobija kad su poznate tri od četiri duži u proporciji. Naziv dolazi od toga što je četvrta u nizu $a, b, c, x$.',
    'četvrta',
    { mediji: { vrsta: 'formula', tekst: '$a : b = c : x$' } });
  {
    // četvrta proporcionala: OA = a, AC = c na Op; OB = b na Oq; prava kroz C paralelna AB seče Oq u S; BS = x
    const O = [0, 0], A = [4, 0], C = [7, 0], u = jedinicni(30), B = [rr(6 * u[0]), rr(6 * u[1])];
    const v = [B[0] - A[0], B[1] - A[1]], Sp = presek(C, v, u);
    const osnova = { O, A, C, B };
    Q(2, 'Pri konstrukciji iz $a : b = c : x$ duži $a$ i $c$ nanesemo na polupravu $Op$, a $b$ na polupravu $Oq$ (crtež). Koja duž je rešenje $x$?',
      ['Duž $BS$', 'Duž $OS$', 'Duž $AC$', 'Duž $OB$'],
      'Prava kroz $C$ paralelna sa $AB$ odseca na $Oq$ tačku $S$. Iz Talesove teoreme $OA : OB = AC : BS$, pa je $BS$ tražena četvrta proporcionala $x$.',
      'proporcija',
      { mediji: G(osnova, [{ lin: [[0, 0], [10, 0]], b: 5, debljina: 2 }, { lin: [[0, 0], [11 * u[0], 11 * u[1]]], b: 5, debljina: 2 }, { d: 'OA', o: 'a', b: 1, debljina: 3 }, { d: 'AC', o: 'c', b: 3, debljina: 3 }, { d: 'OB', o: 'b', b: 2, debljina: 3 }], { velicina: 280 }),
        medijiOdgovora: G({ ...osnova, S: Sp }, [{ lin: [[0, 0], [10, 0]], b: 5, debljina: 2 }, { lin: [[0, 0], [11 * u[0], 11 * u[1]]], b: 5, debljina: 2 }, { d: 'AB', b: 1, debljina: 2 }, { lin: [[rr(C[0] - 0.4 * v[0]), rr(C[1] - 0.4 * v[1])], [rr(Sp[0] + 0.2 * v[0]), rr(Sp[1] + 0.2 * v[1])]], b: 3, debljina: 2, isp: 1 }, { d: 'BS', b: 2, debljina: 4 }, { tacka: 'S', b: 3 }], { velicina: 280 }) });
  }
  Q(3, 'U proporciji $a : b = c : x$ je $a = 4$, $b = 6$, $c = 5$. Koliko je $x$?',
    ['$7{,}5$', '$6{,}5$', '$8$', '$5{,}5$'],
    'Iz $\\frac{a}{b} = \\frac{c}{x}$ sledi $x = \\frac{b · c}{a} = \\frac{6 · 5}{4} = 7{,}5$. Provera: $4 : 6 = 5 : 7{,}5$ (oba odnosa su $\\frac{2}{3}$).',
    'proporcija',
    { mediji: { vrsta: 'formula', tekst: '$a : b = c : x$' } });
  Q(2, 'Zašto konstrukcija podele duži na jednake delove daje tačne tačke?',
    ['Jer paralelne prave odsecaju proporcionalne odsečke', 'Jer su paralelne prave normalne na pomoćnu polupravu, pa se seku', 'Jer su trouglovi podudarni po stavu SSS, a odsečci jednaki po dužini', 'Jer je zbir uglova u trouglu $180°$, pa su odsečci jednaki'],
    'Ovo je Talesova teorema u konstrukciji: jednaki odsečci na jednom kraku daju jednake odsečke na drugom kraku, pa se duž deli na jednake delove bez merenja.',
    'šestar',
    { mediji: podela(5) });
  Q(1, 'Šta prvo konstruišemo kad delimo duž $AB$ na jednake delove?',
    ['Pomoćnu polupravu iz temena $A$', 'Simetralu duži $AB$ sa središtem u $A$', 'Normalu iz temena $B$ na duž $AB$', 'Krug čiji je poluprečnik jednak duži $AB$'],
    'Pomoćna poluprava iz jednog kraja duži omogućava da nanesemo jednake odsečke bez merenja duži.',
    'poluprava',
    { mediji: G({ A: [0, 0], B: [10, 0] }, [{ lin: [[0, 0], [10, 0]], b: 1, debljina: 3 }], { velicina: 280 }) });
  U(2, 'Koji korak NIJE deo konstrukcije podele duži na jednake delove?',
    ['Merenje duži $AB$ lenjirom sa podelom', 'Nanošenje jednakih odsečaka na pomoćnu polupravu', 'Povlačenje paralela kroz deobne tačke', 'Spajanje poslednje tačke poluprave sa krajem $B$'],
    'Konstrukcija se radi šestarom i lenjirom bez merenja: jednaki odsečci se nanose šestarom, a paralele daju deobne tačke na $AB$.',
    'Duž se u konstrukciji deli bez lenjira sa podelom, samo šestarom i pravom linijom.',
    'šestar',
    { mediji: podela(5) });
  S(2, 'Spoji zadatak sa odgovarajućim korakom konstrukcije.',
    [['podela duži na $5$ delova', 'pet jednakih odsečaka na polupravoj'], ['razmera $2 : 5$', 'sedam jednakih odsečaka'], ['četvrta proporcionala', 'konstrukcija $x$ iz $a : b = c : x$'], ['paralela kroz deobnu tačku', 'prava paralelna sa spojnicom poslednje tačke i $B$']],
    'Svaka konstrukcija deobe duži svodi se na jednake odsečke na pomoćnoj polupravoj i paralele koje ih prenose na duž.',
    'podela',
    { mediji: podela(5) });
  Q(3, 'Duž $AB = 9 cm$ treba podeliti u razmeri $1 : 2$. Kolika je duž od $A$ do tačke deobe?',
    ['$3 cm$', '$6 cm$', '$4{,}5 cm$', '$1{,}5 cm$'],
    'Razmera $1 : 2$ deli duž na $1 + 2 = 3$ dela. Deo od $A$ je $9 : 3 = 3 cm$.',
    'razmera',
    { mediji: G({ A: [0, 0], B: [9, 0] }, [{ lin: [[0, 0], [9, 0]], b: 1, debljina: 3 }], { velicina: 280 }) });
  Q(1, 'Duž $AB$ je podeljena na $4$ jednaka dela. Koliko deobnih tačaka ima između $A$ i $B$?',
    ['$3$', '$4$', '$5$', '$2$'],
    'Za $4$ dela potrebne su $3$ unutrašnje tačke deobe. Krajevi $A$ i $B$ se ne računaju.',
    'podela',
    { mediji: podela(4, { ticks: false }), medijiOdgovora: podela(4) });
  Q(3, 'Duž $x$ treba konstruisati tako da je $x = \\frac{3}{2} · a$, gde je $a = 4 cm$. Koliko je $x$?',
    ['$6 cm$', '$4{,}5 cm$', '$8 cm$', '$2{,}67 cm$'],
    'Iz $a : x = 2 : 3$ sledi $x = \\frac{3}{2} · a = \\frac{3}{2} · 4 = 6 cm$. Odnos $3 : 2$ se konstruiše podelom na $5$ delova.',
    'šestar',
    { mediji: { vrsta: 'formula', tekst: '$x = \\frac{3}{2} · a$' } });

  // ════════ 4. Sličnost trouglova ════════
  // trougao po stranicama: BC = a, CA = b, AB = c (B u koordinatnom početku, C na x-osi)
  const tri3 = (a, b, c) => {
    const x = (c * c + a * a - b * b) / (2 * a), y = Math.sqrt(c * c - x * x);
    return { B: [0, 0], C: [a, 0], A: [rr(x), rr(y)] };
  };
  // slika trougla: rotacija za ugao, uvećanje k i pomeraj v; imena se preslikavaju (map: stara → nova)
  const slika = (T, k, ug, v = [0, 0], map = {}) => {
    const f = rad(ug), c = Math.cos(f), s = Math.sin(f), out = {};
    for (const [ime, [x, y]] of Object.entries(T)) out[map[ime] || ime] = [rr(k * (x * c - y * s) + v[0]), rr(k * (x * s + y * c) + v[1])];
    return out;
  };
  const MAPA = { A: 'A₁', B: 'B₁', C: 'C₁' };
  const T1 = { A: [0, 0], B: [4, 0], C: [1, 3] };
  const T2 = slika(T1, 2 / 3, 30, [9, 1], MAPA);
  const dvaTrougla = (ta, tb, x = {}) => G({ ...ta, ...tb }, [{ p: 'ABC', b: 0 }, { p: 'A₁B₁C₁', b: 2 }], { velicina: 280, ...x });
  // dva trougla u istom crtežu; drugi (tri3 oblik, imena A, B, C) se preslikava u imena nb
  const dvaTr = (Ta, Tb, nb, dx) => { const sh = slika(Tb, 1, 0, [dx, 0], { A: nb[0], B: nb[1], C: nb[2] }); return G({ ...Ta, ...sh }, [{ p: 'ABC', b: 0 }, { p: nb.join(''), b: 2 }], { velicina: 280 }); };

  L('Sličnost trouglova');
  Q(1, 'Kako se zovu dva trougla koja imaju međusobno jednake uglove?',
    ['Slični trouglovi', 'Podudarni trouglovi', 'Jednakokraki trouglovi', 'Jednakostranični trouglovi'],
    'Slični trouglovi mogu biti različite veličine i položaja, ali im je oblik isti. Podudarni trouglovi su slični sa koeficijentom $1$.',
    'slični',
    { mediji: dvaTrougla(T1, T2) });
  Q(1, 'Trouglovi $ABC$ i $A_1B_1C_1$ su slični i $\\angle A = \\angle A_1$. Koja stranica je odgovarajuća stranici $BC$?',
    ['$B_1C_1$', '$A_1B_1$', '$A_1C_1$', '$AB$'],
    'Odgovarajuće stranice leže naspram jednakih uglova. Stranica $BC$ leži naspram ugla $A$, a $B_1C_1$ naspram ugla $A_1$.',
    'parovi',
    { mediji: dvaTrougla(T1, T2) });
  Q(2, 'Trouglovi $ABC$ i $A_1B_1C_1$ su slični. Ako je $AB = 6 cm$ i $A_1B_1 = 4 cm$, koliki je koeficijent sličnosti $k = \\frac{AB}{A_1B_1}$?',
    ['$\\frac{3}{2}$', '$\\frac{2}{3}$', '$2$', '$\\frac{1}{2}$'],
    'Koeficijent sličnosti je odnos odgovarajućih stranica: $k = \\frac{6}{4} = \\frac{3}{2}$. Svaka stranica prvog trougla je $\\frac{3}{2}$ puta veća od odgovarajuće stranice drugog.',
    'koeficijent',
    { mediji: dvaTrougla(T1, T2) });
  Q(2, 'Trouglovi $ABC$ i $A_1B_1C_1$ su slični sa koeficijentom $k = \\frac{3}{2}$. Ako je $A_1C_1 = 8 cm$, kolika je stranica $AC$?',
    ['$12 cm$', '$5{,}3 cm$', '$16 cm$', '$4 cm$'],
    'Odgovarajuća stranica prvog trougla je $k$ puta veća: $AC = \\frac{3}{2} · 8 = 12 cm$.',
    'koeficijent',
    { mediji: dvaTrougla(T1, T2) });
  Q(1, 'Obim trougla $ABC$ je $18 cm$, a koeficijent sličnosti sa trouglom $A_1B_1C_1$ je $k = \\frac{2}{3}$. Koliki je obim trougla $A_1B_1C_1$?',
    ['$27 cm$', '$12 cm$', '$18 cm$', '$36 cm$'],
    'Odnos obima sličnih trouglova jednak je koeficijentu sličnosti: $O_{ABC} : O_{A_1B_1C_1} = k = \\frac{2}{3}$. Zato je $O_{A_1B_1C_1} = 18 · \\frac{3}{2} = 27 cm$.',
    'obim',
    { mediji: dvaTrougla(slika(T1, 2 / 3, 0, [0, 0]), slika(T1, 1, 30, [9, 1], MAPA)) });
  Q(2, 'Trougao ima uglove $50°$, $60°$ i $70°$. Koji trougao je sličan njemu?',
    ['Trougao sa uglovima $70°$, $50°$ i $60°$', 'Trougao sa uglovima $50°$, $60°$ i $80°$', 'Trougao sa uglovima $60°$, $60°$ i $60°$', 'Trougao sa uglovima $40°$, $60°$ i $80°$'],
    'Slični trouglovi imaju jednake uglove, samo u drugom redosledu. Zbir uglova je uvek $180°$, pa treba proveriti da su svi uglovi isti.',
    'uglovi',
    { mediji: tr({ A: [0, 0], B: [5, 0], C: [2, 3.5] }, 'ABC') });
  Q(2, 'Stranice trougla su $3 cm$, $4 cm$ i $5 cm$, a stranice drugog $6 cm$, $8 cm$ i $10 cm$. Da li su slični?',
    ['Da, jer su odnosi stranica jednaki ($2$)', 'Ne, jer su različitog obima i različitog oblika', 'Ne, jer je jedan trougao pravougli, a drugi nije', 'Da, samo ako su uglovi po $90°$'],
    'Odnosi odgovarajućih stranica su $6 : 3 = 8 : 4 = 10 : 5 = 2$. Tri para stranica su proporcionalna, pa su trouglovi slični.',
    'stranice',
    { mediji: G({ A: [0, 0], B: [3, 0], C: [0, 4], D: [9, 0], E: [9, 8] }, [{ p: 'ABC', b: 0 }, { p: 'DBE', b: 1 }], { velicina: 280 }) });
  Q(1, 'Trouglovi $ABC$ i $A_1B_1C_1$ su slični, pri čemu je $A_1B_1C_1$ dvostruko manji od $ABC$ i zarotiran. Koliki je koeficijent $k = \\frac{AB}{A_1B_1}$?',
    ['$2$', '$\\frac{1}{2}$', '$4$', '$1$'],
    'Slika je zarotirana, ali to ne menja sličnost. Odnos stranica $AB : A_1B_1 = 2$, pa je $k = 2$.',
    'rotacija',
    { mediji: dvaTrougla(T1, slika(T1, 0.5, 40, [7, 0], MAPA)) });
  Q(1, 'Ako su dva trougla slična, koliko parova odgovarajućih uglova je jednako?',
    ['Sva tri', 'Dva', 'Samo jedan', 'Nijedan'],
    'Slični trouglovi imaju sva tri para odgovarajućih uglova jednaka. Razlikuju se samo po veličini stranica.',
    'uglovi',
    { mediji: dvaTrougla(T1, T2) });
  S(2, 'Spoji pojam sa njegovim značenjem.',
    [['slični trouglovi', 'jednaki odgovarajući uglovi'], ['koeficijent sličnosti', 'odnos odgovarajućih stranica'], ['odnos obima sličnih trouglova', 'jednak koeficijentu sličnosti'], ['odgovarajuće stranice', 'naspram jednakih uglova']],
    'Kod sličnih trouglova sve odgovarajuće dužine (stranice, visine, težišne duži, obimi) srazmerne su istim koeficijentom.',
    'sličnost',
    { mediji: dvaTrougla(T1, T2) });
  U(2, 'Koji trougao NIJE sličan trouglu sa stranicama $3$, $4$ i $5$?',
    ['Trougao sa stranicama $6$, $8$ i $11$', 'Trougao sa stranicama $9$, $12$ i $15$', 'Trougao sa stranicama $6$, $8$ i $10$', 'Trougao sa stranicama $1{,}5$, $2$ i $2{,}5$'],
    'Odnosi $6 : 3 = 2$, $8 : 4 = 2$, ali $11 : 5 = 2{,}2$. Ostali imaju stalan odnos ($3$, $2$ i $\\frac{1}{2}$).',
    'Sve stranice moraju imati isti odnos. Ako bar jedan odnos ne odgovara ostalima, trouglovi nisu slični.',
    'stranice',
    { mediji: G({ A: [0, 0], B: [3, 0], C: [0, 4] }, [{ p: 'ABC', b: 0 }], { velicina: 260 }) });
  Q(3, 'Trouglovi $ABC$ i $A_1B_1C_1$ su slični, $AB = 6 cm$, $BC = 9 cm$, $CA = 12 cm$ i $A_1B_1 = 4 cm$. Kolika je stranica $B_1C_1$?',
    ['$6 cm$', '$4 cm$', '$13{,}5 cm$', '$9 cm$'],
    'Koeficijent je $k = \\frac{6}{4} = \\frac{3}{2}$. Stranica $B_1C_1 = \\frac{BC}{k} = \\frac{9}{3/2} = 6 cm$.',
    'koeficijent',
    { mediji: dvaTrougla(T1, slika(T1, 2 / 3, 0, [8, 0], MAPA)) });
  Q(2, 'Trougao $ABC$ ima uglove $47°$, $77°$ i $56°$, a trougao $PQR$ ima uglove $77°$, $56°$ i $47°$. Da li su slični?',
    ['Da, jer imaju tri jednaka ugla', 'Ne, jer nemaju jednake stranice', 'Ne, jer nisu iste veličine', 'Da, samo ako su pravougli'],
    'Ugao $47°$ je odgovarajući sa $47°$, $77°$ sa $77°$, a $56°$ sa $56°$. Dva trougla sa jednakim uglovima su slična po definiciji.',
    'uglovi',
    { mediji: G({ A: [0, 0], B: [6, 0], C: [2, 4], P: [9, 0], Q: [13, 0], R: [10, 4] }, [{ p: 'ABC', b: 0 }, { p: 'PQR', b: 1 }], { velicina: 280 }) });
  Q(3, 'Stranice jednog trougla su $8$, $16$ i $20$, a drugog $20$, $25$ i $10$. Da li su trouglovi slični?',
    ['Da, jer je $8 : 10 = 16 : 20 = 20 : 25 = 4 : 5$', 'Ne, jer je $16 : 25$ različito od $8 : 20$', 'Ne, jer se ne slaže najduža stranica sa najkraćom', 'Ne, jer nisu pravougli ni jednakokraki trouglovi'],
    'Sortiramo stranice: $8 : 10 = 16 : 20 = 20 : 25 = 4 : 5$. Najkraća odgovara najkraćoj, pa su proporcionalne i trouglovi su slični.',
    'stranice',
    { mediji: dvaTr(tri3(16, 20, 8), tri3(20, 25, 10), ['A₁', 'B₁', 'C₁'], 30) });
  Q(3, 'Trougao $ABC$ ima stranice $AB = 6$, $BC = 15$, $AC = 12$, a trougao $PQR$ ima $PQ = 8$, $QR = 15$, $PR = 20$. Da li su slični?',
    ['Ne, jer odnosi stranica nisu jednaki', 'Da, jer su najkraće stranice jednake i obimi bliski', 'Da, jer su obimi jednaki pa su trouglovi slični', 'Ne, jer su uglovi različiti i nisu jednaki'],
    'Odnosi $6 : 8 = 3 : 4$, ali $12 : 15 = 4 : 5$ i $15 : 20 = 3 : 4$. Odnosi nisu isti, pa trouglovi nisu slični. Obimi su $33$ i $43$, pa ni to nije tačno.',
    'stranice',
    { mediji: dvaTr(tri3(15, 12, 6), tri3(15, 20, 8), ['P', 'Q', 'R'], 14) });
  Q(1, 'Kako se pravilno zapisuje sličnost trouglova $ABC$ i $A_1B_1C_1$?',
    ['$\\triangle ABC \\sim \\triangle A_1B_1C_1$', '$\\triangle ABC = \\triangle A_1B_1C_1$', '$\\triangle ABC \\cong \\triangle A_1B_1C_1$', '$\\angle ABC \\sim \\angle A_1B_1C_1$'],
    'Znak $\\sim$ označava sličnost, a $\\cong$ podudarnost (jednake veličine i oblik). Znak $=$ označava jednakost površina, ne oblika.',
    'sličnost',
    { mediji: dvaTrougla(T1, T2) });

  // ════════ 5. Stavovi sličnosti trouglova ════════
  // dva trougla jedan pored drugog (drugi se preslikava u imena A₁B₁C₁ i pomera za dx)
  const dvaSlicna = (Ta, Tb, { dx = 12, k = 1, ug = 0 } = {}) => dvaTrougla(Ta, slika(Tb, k, ug, [dx, 0], MAPA));

  L('Stavovi sličnosti trouglova');
  Q(1, 'Kada su dva trougla slična po prvom stavu sličnosti (UU)?',
    ['Kada imaju po dva jednaka ugla', 'Kada imaju jednake sve stranice', 'Kada imaju jednake obime', 'Kada imaju jednu jednaku stranicu'],
    'Ako dva trougla imaju po dva jednaka ugla, treći su takođe jednaki (zbir je $180°$), pa su slični po definiciji.',
    'stav',
    { mediji: dvaSlicna(T1, T2) });
  Q(1, 'Kako se skraćeno zove drugi stav sličnosti?',
    ['SUS (stranica-ugao-stranica)', 'UU (ugao-ugao)', 'SSS (stranica-stranica-stranica)', 'UUS'],
    'Drugi stav traži dve proporcionalne stranice i jednak ugao između njih. Zato je ugao „zahvaćen“ stranicama.',
    'stranica',
    { mediji: dvaSlicna(tri3(8, 10, 4), tri3(4, 5, 2)) });
  Q(2, 'Osnovice $AB$ i $CD$ trapeza $ABCD$ seku se dijagonalama u tački $P$. Trouglovi $ABP$ i $CDP$ su slični po kom stavu?',
    ['UU', 'SUS', 'SSS', 'Nisu slični'],
    'Uglovi $\\angle PAB = \\angle PCD$ i $\\angle PBA = \\angle PDC$ su naizmenični uglovi kod paralelnih pravih $AB$ i $CD$, pa je stav UU.',
    'trapez',
    { mediji: G({ A: [0, 0], B: [6, 0], C: [4, 3], D: [1, 3], P: [2.667, 2] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1, isp: 1 }, { d: 'BD', b: 2, isp: 1 }], GO) });
  Q(2, 'Dva pravougla trougla imaju katete $10 cm$ i $24 cm$, odnosno $25 cm$ i $60 cm$. Da li su slični?',
    ['Da, jer su katete proporcionalne, a pravi uglovi jednaki', 'Ne, jer je $10 : 25$ različito od $24 : 60$, a hipotenuze nisu poznate', 'Ne, jer hipotenuze nisu poznate, pa se sličnost ne može videti', 'Ne, jer su različite površine dva pravougla trougla'],
    'Odnosi kateta su $10 : 25 = 24 : 60 = 2 : 5$, a pravi uglovi između kateta su jednaki. To je stav SUS.',
    'katete',
    { mediji: G({ A: [0, 0], B: [10, 0], C: [0, 24], D: [16, 0], E: [41, 0], F: [16, 60] }, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }], { velicina: 280 }) });
  Q(2, 'Trougao ima stranice $4 cm$, $8 cm$ i $10 cm$, a drugi trougao $14 cm$, $28 cm$ i $35 cm$. Koja tvrdnja je tačna?',
    ['Slični su, jer su odnosi stranica jednaki ($2 : 7$)', 'Nisu slični, jer nisu jednake stranice i uglovi', 'Podudarni su, jer imaju iste stranice i obime', 'Slični su samo ako imaju pravi ugao između stranica'],
    'Odnosi odgovarajućih stranica su $4 : 14 = 8 : 28 = 10 : 35 = 2 : 7$. To je treći stav sličnosti (SSS).',
    'stranice',
    { mediji: dvaSlicna(tri3(8, 10, 4), tri3(28, 35, 14), { dx: 34 }) });
  Q(2, 'Stranice trougla su $5$, $6$ i $7$, a drugog $15$, $18$ i $21$. Da li su trouglovi slični?',
    ['Da, odnosi stranica su jednaki ($1 : 3$)', 'Ne, jer je $6 : 21$ različito od $5 : 15$ i obimi', 'Ne, jer su različiti obimi trouglova i površine', 'Da, ali samo ako su uglovi pravi i stranice jednake'],
    'Najkraće, srednje i najduže stranice se sparuju: $5 : 15 = 6 : 18 = 7 : 21 = 1 : 3$. Zato su slični po stavu SSS.',
    'stranice',
    { mediji: dvaSlicna(tri3(6, 7, 5), tri3(18, 21, 15), { dx: 30 }) });
  Q(2, 'Dva jednakokraka trougla imaju ugao pri vrhu $40°$. Da li su slični?',
    ['Da, po stavu $UU$ (uglovi $40°$, $70°$, $70°$)', 'Ne, jer su različite osnovice trouglova i kraci', 'Ne, jer im se razlikuju kraci, a uglovi su različiti', 'Da, jer su oba jednakokraka sa istim osnovicama'],
    'Osnovni uglovi su $(180° − 40°) : 2 = 70°$ kod oba trougla. Dva para jednakih uglova daju sličnost po stavu UU.',
    'uglovi',
    { mediji: dvaSlicna(tri3(4, 4, 3), tri3(8, 8, 6), { dx: 9 }) });
  Q(2, 'Prvi pravougli trougao ima oštar ugao $30°$, a drugi pravougli trougao ima oštar ugao $60°$. Da li su slični?',
    ['Da, jer su oba pravougla i oštri uglovi se slažu', 'Ne, jer je jedan oštar ugao manji od drugog', 'Ne, jer nemaju jednake stranice ni katete', 'Da, jer su oba oštra ugla po $90°$ kod oba trougla'],
    'Uglovi prvog trougla su $90°$, $30°$, $60°$, a drugog $90°$, $60°$, $30°$. Svi su jednaki, pa su trouglovi slični.',
    'pravougli',
    { mediji: dvaSlicna(tri3(2, 3.464, 4), tri3(2, 3.464, 4), { dx: 8 }) });
  Q(2, 'Kad su dva trougla slična po stavu SUS, koji ugao mora biti jednak?',
    ['Ugao između te dve stranice', 'Ugao naspram najkraće stranice trougla', 'Bilo koji od tri ugla u trouglu', 'Ugao naspram najduže stranice trougla'],
    'SUS traži dve proporcionalne stranice i jednak ugao koji ih zahvata. Ugao van tih stranica ne određuje sličnost.',
    'ugao',
    { mediji: dvaSlicna(tri3(8, 6, 7), tri3(16, 12, 14), { dx: 24 }) });
  Q(3, 'Prava paralelna sa stranicom $BC$ trougla $ABC$ seče $AB$ u tački $D$, a $AC$ u tački $E$. Po kom stavu su trouglovi $ADE$ i $ABC$ slični?',
    ['$UU$ (uglovi na paralelnim pravama su jednaki)', '$SSS$ (sve tri stranice proporcionalne)', '$SUS$ (dve stranice i ugao između njih)', 'Nisu slični jer nemaju jednake uglove'],
    'Ugao kod $A$ je zajednički, a $\\angle ADE = \\angle ABC$ kao odgovarajući uglovi na paralelnim pravama $DE$ i $BC$. Zato je stav UU.',
    'paralela',
    { mediji: G({ A: [4, 7], B: [0, 0], C: [10, 0], D: [2, 3.5], E: [7, 3.5] }, [{ p: 'ABC', b: 0 }, { d: 'DE', b: 2, debljina: 3 }], GO) });
  Q(3, 'Stranice trougla su $6$, $9$ i $12$, a stranice drugog $4$, $6$ i $8$. Koliki je koeficijent sličnosti (prvi prema drugom)?',
    ['$\\frac{3}{2}$', '$\\frac{2}{3}$', '$\\frac{3}{4}$', '$\\frac{1}{2}$'],
    'Odnosi odgovarajućih stranica su $6 : 4 = 9 : 6 = 12 : 8 = \\frac{3}{2}$. Zato je koeficijent $\\frac{3}{2}$.',
    'koeficijent',
    { mediji: dvaSlicna(tri3(9, 12, 6), tri3(6, 8, 4), { dx: 14 }) });
  Q(3, 'Katete pravouglog trougla su $6$ i $8$. Drugi pravougli trougao ima katete $9$ i $x$ i slican je prvom. Koliko je $x$?',
    ['$12$', '$10$', '$9$', '$16$'],
    'Odnos kateta mora biti isti: $6 : 9 = 8 : x$, pa je $\\frac{6}{9} = \\frac{8}{x}$, a odatle $x = 12$.',
    'katete',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [0, 6], D: [14, 0], E: [26, 0], F: [14, 9] }, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 1 }], { velicina: 280 }) });
  U(2, 'Koji par trouglova NIJE sličan?',
    ['Trougao sa uglovima $40°$, $60°$, $80°$ i trougao sa uglovima $50°$, $60°$, $70°$', 'Trougao sa uglovima $30°$, $60°$, $90°$ i trougao sa uglovima $30°$, $60°$, $90°$', 'Trougao sa stranicama $2$, $2$, $3$ i trougao sa stranicama $4$, $4$, $6$', 'Pravougli trougao sa katetama $3$ i $4$ i pravougli trougao sa katetama $6$ i $8$'],
    'Trouglovi $40°, 60°, 80°$ i $50°, 60°, 70°$ imaju samo jedan par jednakih uglova ($60°$), pa nisu slični. Ostali parovi imaju proporcionalne stranice ili jednake uglove.',
    'Dva trougla su slična tek kad sve tri odgovarajuće dužine imaju isti odnos ili kad imaju dva jednaka ugla.',
    'uglovi',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [1, 3] }, [{ p: 'ABC', b: 0 }], { velicina: 240 }) });
  Q(1, 'Dva trougla su slična, a odnos njihovih odgovarajućih stranica je $3 : 5$. Koliki je odnos njihovih obima?',
    ['$3 : 5$', '$9 : 25$', '$5 : 3$', '$6 : 10$'],
    'Odnos obima sličnih trouglova jednak je koeficijentu sličnosti, dakle $3 : 5$. Površine bi se odnosile kao $9 : 25$.',
    'obim',
    { mediji: dvaSlicna(tri3(6, 8, 5), tri3(6, 8, 5), { dx: 12, k: 5 / 3 }) });
  Q(3, 'Iz temena $C$ trougla $ABC$ na stranicu $AB$ povučena je duž $CD$ tako da je $\\angle ACD = \\angle B$. Po kom stavu su trouglovi $ACD$ i $ABC$ slični?',
    ['UU', 'SUS', 'SSS', 'Nisu slični'],
    'Ugao kod $A$ je zajednički, a $\\angle ACD = \\angle B$. Dva jednaka ugla daju stav UU. Iz toga sledi $AC^{2} = AD · AB$.',
    'ugao',
    { mediji: G({ A: [0, 0], B: [10, 0], C: [3, 6], D: [3.6, 0] }, [{ p: 'ABC', b: 0 }, { d: 'CD', b: 2, debljina: 3 }], GO) });
  S(2, 'Spoji naziv stava sličnosti sa uslovom koji ga čini.',
    [['stav UU', 'dva para jednakih uglova'], ['stav SUS', 'dve proporcionalne stranice i jednak ugao između njih'], ['stav SSS', 'tri para proporcionalnih stranica'], ['pravougli trougao', 'jedan ugao je $90°$']],
    'Za dva pravougla trougla dovoljan je još jedan par jednakih oštrih uglova ili proporcionalne katete, jer je pravi ugao već jednak.',
    'stav',
    { mediji: dvaSlicna(T1, T2) });

  // ════════ 6. Primena sličnosti na pravougli trougao ════════
  // pravougli trougao ABC (prav ugao kod C): odsečci na hipotenuzi p (uz B) i q (uz A), c = p + q, h = √(pq);
  // crtež se gradi iz samih p i q, pa su dužine uvek u istom odnosu kao u tekstu
  const prav2 = (p, q, e = [], x = {}) => {
    const c = p + q, h = Math.sqrt(p * q), mx = (u, v) => [r((u[0] + v[0]) / 2), r((u[1] + v[1]) / 2)];
    const T = { A: [0, 0], B: [r(c), 0], C: [r(q), r(h)], D: [r(q), 0] };
    const k = c * 0.07, labele = [{ tx: 'p', at: [r((q + c) / 2), -k], b: 3 }, { tx: 'q', at: [r(q / 2), -k], b: 3 }, { tx: 'h', at: [r(q + c * 0.03), r(h / 2)], b: 3 }, { tx: 'a', at: [r((c + q) / 2 + c * 0.03), r(h / 2)], b: 3 }, { tx: 'b', at: [r(q / 2 - c * 0.04), r(h / 2 + k)], b: 3 }];
    return G(T, [{ p: 'ABC', b: 0 }, { pu: 'ACB' }, { d: 'CD', b: 1, debljina: 3 }, ...e.filter((el) => !el.tx), ...labele], { velicina: 260, ...x });
  };

  L('Primena sličnosti na pravougli trougao');
  Q(1, 'Visina $h$ iz temena pravog ugla deli hipotenuzu na odsečke $p$ i $q$ (crtež). Koja veza važi?',
    ['$h^{2} = p · q$', '$h = p + q$', '$h^{2} = p + q$', '$h = p · q$'],
    'Visina je geometrijska sredina odsečaka na hipotenuzi, pa je $h^{2} = p · q$. Iz nje sledi $h = \\sqrt{p · q}$.',
    'visina',
    { mediji: prav2(18, 32, [{ d: 'CD', b: 1, debljina: 3 }, { tx: 'p', at: [6.2, -1.1], b: 3 }, { tx: 'q', at: [1.2, -1.1], b: 3 }, { tx: 'h', at: [2.9, 1.9], b: 3 }]) });
  Q(2, 'Kateta $a$ leži uz odsečak $p$ na hipotenuzi. Koja jednakost važi?',
    ['$a^{2} = p · c$', '$a^{2} = p · q$', '$a = p + c$', '$a^{2} = c · q$'],
    'Trouglovi $ABC$ i $CBD$ su slični (stav UU), pa je $a : p = c : a$, odakle $a^{2} = p · c$. Tako je i $b^{2} = q · c$.',
    'kateta',
    { mediji: prav2(18, 32, [{ tx: 'a', at: [7.4, 2.4], b: 3 }, { tx: 'p', at: [6.2, -1.1], b: 3 }, { tx: 'c', at: [4.8, -1.1], b: 3 }]) });
  Q(2, 'Visina iz temena pravog ugla deli hipotenuzu na odsečke $p = 18 cm$ i $q = 32 cm$. Kolika je visina $h$?',
    ['$24 cm$', '$25 cm$', '$20 cm$', '$28 cm$'],
    'Iz $h^{2} = p · q = 18 · 32 = 576$ sledi $h = 24 cm$. Hipotenuza je $c = 50 cm$.',
    'visina',
    { mediji: prav2(18, 32, [{ tx: 'p', at: [6.2, -1.1], b: 3 }, { tx: 'q', at: [1.2, -1.1], b: 3 }]) });
  Q(2, 'Visina iz temena pravog ugla deli hipotenuzu na odsečke $p = 18 cm$ i $q = 32 cm$. Kolika je kateta $a$ (uz odsečak $p$)?',
    ['$30 cm$', '$40 cm$', '$24 cm$', '$36 cm$'],
    'Iz $a^{2} = p · c = 18 · 50 = 900$ sledi $a = 30 cm$. Kateta $b$ je $\\sqrt{32 · 50} = 40 cm$.',
    'kateta',
    { mediji: prav2(18, 32, [{ tx: 'a', at: [7.4, 2.4], b: 3 }, { tx: 'p', at: [6.2, -1.1], b: 3 }]) });
  Q(1, 'Sabiranjem jednakosti $a^{2} = p · c$ i $b^{2} = q · c$ dobijamo novi dokaz koje teoreme?',
    ['Pitagorine teoreme', 'Talesove teoreme', 'Teoreme o zbiru uglova', 'Teoreme o simetrali ugla'],
    'Zbir je $a^{2} + b^{2} = (p + q) · c = c · c = c^{2}$. To je Pitagorina teorema, dokazana bez merenja, samo preko sličnosti.',
    'Pitagora',
    { mediji: { vrsta: 'formula', tekst: '$a^{2} + b^{2} = p · c + q · c = (p + q) · c = c^{2}$' } });
  Q(1, 'Kolika je geometrijska sredina brojeva $4$ i $9$?',
    ['$6$', '$13$', '$5$', '$36$'],
    'Geometrijska sredina brojeva $a$ i $b$ je $\\sqrt{ab}$, pa je $\\sqrt{4 · 9} = \\sqrt{36} = 6$. Aritmetička sredina bi bila $6{,}5$.',
    'sredina',
    { mediji: { vrsta: 'formula', tekst: '$\\sqrt{ab}$' } });
  Q(2, 'Pri konstrukciji duži $\\sqrt{3}$ cm uzeli smo $p = 1 cm$ i $q = 3 cm$ na hipotenuzi. Kolika je hipotenuza $c$?',
    ['$4 cm$', '$3 cm$', '$2 cm$', '$6 cm$'],
    'Hipotenuza je $c = p + q = 1 + 3 = 4 cm$. Visina je $h = \\sqrt{p · q} = \\sqrt{3}$ cm.',
    'šestar',
    { mediji: G({ A: [0, 0], D: [1, 0], B: [4, 0], S: [2, 0], C: [1, 1.732] }, [{ l: 'S', r: 2, od: 0, do: 180, b: 1, debljina: 2 }, { d: 'CD', b: 2, debljina: 3 }, { pu: 'CDA' }], { velicina: 260 }) });
  Q(3, 'Kateta $a = 15 cm$, a hipotenuza $c = 25 cm$. Kolika je projekcija $p$ katete na hipotenuzu?',
    ['$9 cm$', '$10 cm$', '$15 cm$', '$16 cm$'],
    'Iz $a^{2} = p · c$ sledi $p = \\frac{a^{2}}{c} = \\frac{225}{25} = 9 cm$. Druga projekcija je $25 − 9 = 16 cm$.',
    'projekcija',
    { mediji: prav2(9, 16, [{ tx: 'a', at: [7.4, 2.4], b: 3 }, { tx: 'p', at: [6.2, -1.1], b: 3 }]) });
  Q(2, 'Katete pravouglog trougla su $9 cm$ i $12 cm$. Kolika je visina iz temena pravog ugla?',
    ['$7{,}2 cm$', '$4{,}5 cm$', '$9 cm$', '$6 cm$'],
    'Visina na hipotenuzu je $h = \\frac{a · b}{c}$, pa je $h = \\frac{9 · 12}{15} = 7{,}2 cm$. Hipotenuza je $\\sqrt{81 + 144} = 15 cm$.',
    'visina',
    { mediji: G({ A: [0, 0], B: [12, 0], C: [0, 9] }, [{ p: 'ABC', b: 0 }, { pu: 'BAC' }, { tx: 'a', at: [-0.8, 4.5], b: 3 }, { tx: 'b', at: [6, -0.9], b: 3 }], GO) });
  Q(3, 'Visina koja odgovara hipotenuzi je $12 cm$, a manja kateta $15 cm$. Kolika je hipotenuza?',
    ['$25 cm$', '$20 cm$', '$27 cm$', '$30 cm$'],
    'Iz $h = \\frac{a · b}{c}$ i $c^{2} = a^{2} + b^{2}$ dobijamo drugu katetu $b = 20 cm$ (jer je $15 · 20 = 300 = 12 · 25$). Hipotenuza je $c = 25 cm$.',
    'hipotenuza',
    { mediji: G({ A: [0, 0], B: [20, 0], C: [0, 15], D: [7.2, 9.6] }, [{ p: 'ABC', b: 0 }, { pu: 'BAC' }, { d: 'AD', b: 1, debljina: 3 }, { tx: 'a', at: [-1.1, 7.5], b: 3 }, { tx: 'h', at: [3.4, 4.6], b: 3 }], GO) });
  Q(1, 'Kateta $a = 6 cm$ leži uz odsečak $p = 3 cm$ na hipotenuzi. Kolika je hipotenuza $c$?',
    ['$12 cm$', '$9 cm$', '$18 cm$', '$4 cm$'],
    'Iz $a^{2} = p · c$ sledi $c = \\frac{a^{2}}{p} = \\frac{36}{3} = 12 cm$.',
    'hipotenuza',
    { mediji: prav2(3, 9, [{ tx: 'a', at: [7.4, 2.4], b: 3 }, { tx: 'p', at: [6.2, -1.1], b: 3 }]) });
  Q(3, 'Visina iz temena pravog ugla je $h = 6 cm$, a odsečak $p = 4 cm$ uz katetu $a$. Koliki je odsečak $q$?',
    ['$9 cm$', '$8 cm$', '$10 cm$', '$12 cm$'],
    'Iz $h^{2} = p · q$ sledi $q = \\frac{h^{2}}{p} = \\frac{36}{4} = 9 cm$.',
    'odsečak',
    { mediji: prav2(4, 9, [{ tx: 'h', at: [2.9, 1.9], b: 3 }, { tx: 'p', at: [6.2, -1.1], b: 3 }, { tx: 'q', at: [1.2, -1.1], b: 3 }]) });
  Q(1, 'Odsečci na hipotenuzi su $p = 2 cm$ i $q = 8 cm$. Kolika je hipotenuza?',
    ['$10 cm$', '$6 cm$', '$16 cm$', '$4 cm$'],
    'Hipotenuza je zbir odsečaka: $c = p + q = 2 + 8 = 10 cm$. Visina je tada $h = \\sqrt{16} = 4 cm$.',
    'zbir',
    { mediji: prav2(2, 8, [{ tx: 'p', at: [6.2, -1.1], b: 3 }, { tx: 'q', at: [1.2, -1.1], b: 3 }]) });
  U(2, 'Koja jednakost NIJE tačna za pravougli trougao sa visinom $h$ na hipotenuzu?',
    ['$h = p + q$', '$h^{2} = p · q$', '$a^{2} = p · c$', '$b^{2} = q · c$'],
    'Visina je geometrijska sredina odsečaka, a ne njihov zbir. Zbir odsečaka je hipotenuza $c = p + q$.',
    'Zbir odsečaka je hipotenuza, a visina je njihova geometrijska sredina.',
    'visina',
    { mediji: prav2(18, 32, [{ tx: 'h', at: [2.9, 1.9], b: 3 }]) });
  S(2, 'Spoji oznaku sa relacijom u pravouglom trouglu.',
    [['kateta $a$ uz odsečak $p$', '$a^{2} = p · c$'], ['kateta $b$ uz odsečak $q$', '$b^{2} = q · c$'], ['visina $h$', '$h^{2} = p · q$'], ['$\\sqrt{ab}$', 'geometrijska sredina brojeva $a$ i $b$']],
    'Geometrijska sredina je najčešće tražena veličina pri konstrukcijama: duž $\\sqrt{3}$ se dobija kao visina nad odsečcima $1$ i $3$.',
    'sredina',
    { mediji: prav2(9, 16) });

  Q(2, 'Katete pravouglog trougla su $b = 20 cm$ i $a$, a odsečak $q = 16 cm$ na hipotenuzi leži uz katetu $b$. Kolika je hipotenuza $c$?',
    ['$25 cm$', '$20 cm$', '$36 cm$', '$12 cm$'],
    'Iz $b^{2} = q · c$ sledi $c = \\frac{b^{2}}{q} = \\frac{400}{16} = 25 cm$.',
    'hipotenuza',
    { mediji: prav2(9, 16, [{ tx: 'b', at: [6, -1.1], b: 3 }, { tx: 'q', at: [1.2, -1.1], b: 3 }]) });

  // ════════ 7. Primena sličnosti ════════
  // štap ili stub visine h sa senkom dužine s (podnožje na x-osi; sunčev zrak je isprekidan)
  const stub = (x0, h, s, { b = 1 } = {}) => [{ lin: [[x0, 0], [x0, h]], b, debljina: 3 }, { lin: [[x0, 0], [x0 + s, 0]], b: 3, debljina: 4 }, { lin: [[x0, h], [x0 + s, 0]], b: 2, isp: 1 }];

  L('Primena sličnosti');
  Q(1, 'Štap visine $1 m$ baca senku dužine $60 cm$. Koliku senku baca stub visine $5 m$ u isto vreme?',
    ['$3 m$', '$2{,}5 m$', '$12 m$', '$0{,}3 m$'],
    'Odnos visine i senke je isti za sve predmete u istom trenutku: $\\frac{1}{0{,}6} = \\frac{5}{x}$, pa je $x = 3 m$.',
    'senka',
    { mediji: G({}, [...stub(0, 1, 0.6), ...stub(4, 5, 3)], { velicina: 280 }) });
  Q(2, 'Stub visine $6 m$ baca senku dužine $2{,}4 m$. Hrast u isto vreme baca senku dužine $5{,}2 m$. Kolika je visina hrasta?',
    ['$13 m$', '$12 m$', '$2{,}6 m$', '$15 m$'],
    'Iz $\\frac{6}{2{,}4} = \\frac{h}{5{,}2}$ sledi $h = \\frac{6 · 5{,}2}{2{,}4} = 13 m$.',
    'senka',
    { mediji: G({}, [...stub(0, 6, 2.4), ...stub(4, 13, 5.2)], { velicina: 280 }) });
  Q(2, 'Milica je visoka $180 cm$ i baca senku $120 cm$. Nikola u isto vreme baca senku $140 cm$. Koliko je visok Nikola?',
    ['$210 cm$', '$168 cm$', '$180 cm$', '$195 cm$'],
    'Iz $\\frac{180}{120} = \\frac{h}{140}$ sledi $h = \\frac{180 · 140}{120} = 210 cm$.',
    'senka',
    { mediji: G({}, [...stub(0, 1.8, 1.2), ...stub(4, 2.1, 1.4)], { velicina: 280 }) });
  Q(2, 'Anđelija je visoka $1{,}72 m$. Ogledalo je na zemlji tako da u njemu vidi vrh bora. Ogledalo je $3$ puta bliže boru nego Anđeliji. Kolika je visina bora?',
    ['$5{,}16 m$', '$0{,}57 m$', '$4{,}5 m$', '$6{,}2 m$'],
    'Svetlosni zrak se odbija pod istim uglom, pa su trouglovi slični: $\\frac{h_b}{h_A} = \\frac{l_b}{l_A} = 3$. Zato je $h_b = 3 · 1{,}72 = 5{,}16 m$.',
    'ogledalo',
    { mediji: G({ A: [0, 0], O: [1, 0], T: [4, 0], P: [0, 1.72], V: [4, 5.16] }, [{ lin: [[-0.5, 0], [5, 0]], b: 4, debljina: 2 }, { lin: [[0, 0], [0, 1.72]], b: 1, debljina: 3 }, { lin: [[4, 0], [4, 5.16]], b: 2, debljina: 3 }, { lin: [[0, 1.72], [1, 0]], b: 3, isp: 1 }, { lin: [[1, 0], [4, 5.16]], b: 3, isp: 1 }], { velicina: 280, bezImena: ['A', 'O', 'T', 'P', 'V'] }) });
  Q(2, 'Talesov štap visine $1 m$ baca senku $2 m$. Senka piramide, merena od podnožja, je $40 m$ duga. Koliko je visoka piramida (zanemarimo osnovicu)?',
    ['$20 m$', '$40 m$', '$80 m$', '$10 m$'],
    'Odnos visine i senke je isti: $\\frac{1}{2} = \\frac{h}{40}$, pa je $h = 20 m$.',
    'Talesova',
    { mediji: G({}, [...stub(0, 1, 2), ...stub(4, 20, 40)], { velicina: 280 }) });
  Q(1, 'Pri merenju širine reke štapom i kanapom izmerena je duž $CD = 25 m$. Kolika je širina reke $BC$, ako je ona dva puta veća od $CD$?',
    ['$50 m$', '$25 m$', '$12{,}5 m$', '$100 m$'],
    'Po opisu metode širina reke je dva puta veća od rastojanja tačaka $C$ i $D$, pa je $BC = 2 · 25 = 50 m$.',
    'reka',
    { mediji: G({ C: [2, 0], D: [4, 0], B: [2, 4] }, [{ lin: [[-1, 0], [6, 0]], b: 4, debljina: 2 }, { lin: [[-1, 4], [6, 4]], b: 4, debljina: 2 }, { d: 'BC', b: 1, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }, { d: 'DB', b: 3, isp: 1 }], { velicina: 280 }) });
  Q(3, 'Eratosten je izmerio da je u jednom trenutku ugao sunčevih zraka $7°$, a dužina luka između dva grada $700 km$. Koliki je obim Zemlje po tom računu?',
    ['$36\\,000 km$', '$40\\,000 km$', '$3\\,600 km$', '$49\\,000 km$'],
    'Ugao $7°$ je $\\frac{7}{360}$ obima, pa je $O = \\frac{360}{7} · 700 = 36\\,000 km$.',
    'obim',
    { mediji: G({ O: [0, 0] }, [{ kr: 'O', r: 5, b: 1, debljina: 2 }, { lin: [[0, 0], [5, 0]], b: 3, debljina: 2 }, { lin: [[0, 0], [5 * Math.cos(0.4), 5 * Math.sin(0.4)]], b: 3, debljina: 2 }, { l: 'O', r: 2.6, od: 0, do: 23, b: 2, debljina: 3 }], { velicina: 260, bezImena: ['O'] }) });
  Q(1, 'Dvorište je na planu nacrtano u razmeri $1 : 500$. Stvarne dimenzije dvorišta su $20 m$ i $15 m$. Kolika je dužina na planu za dužinu $20 m$?',
    ['$4 cm$', '$40 cm$', '$0{,}4 cm$', '$2 cm$'],
    'Dužina $20 m = 2000 cm$ na planu je $2000 : 500 = 4 cm$.',
    'razmera',
    { mediji: G({ A: [0, 0], B: [8, 0], C: [8, 6], D: [0, 6] }, [{ p: 'ABCD', b: 2 }, { tx: '~plan', at: [3.6, 2.8], b: 3 }], GO) });
  Q(2, 'Bandera visine $5 m$ baca senku $0{,}9 m$, a zgrada u isto vreme baca senku $4{,}5 m$. Kolika je visina zgrade?',
    ['$25 m$', '$22{,}5 m$', '$27 m$', '$20 m$'],
    'Iz $\\frac{5}{0{,}9} = \\frac{h}{4{,}5}$ sledi $h = \\frac{5 · 4{,}5}{0{,}9} = 25 m$.',
    'senka',
    { mediji: G({}, [...stub(0, 1, 0.18), ...stub(4, 5, 0.9)], { velicina: 280 }) });
  U(1, 'Koji zaključak NIJE tačan?',
    ['Senka predmeta je tokom celog dana iste dužine', 'Sunčevi zraci su paralelni, pa su trouglovi slični', 'U podne je senka najkraća', 'Odnos visine i senke je isti za sve predmete u istom trenutku'],
    'Senka se menja tokom dana: najkraća je u podne, kad je Sunce najviše, a najduža ujutru i uveče.',
    'Senka se menja tokom dana jer se položaj Sunca na nebu menja.',
    'senka',
    { mediji: G({}, stub(0, 1, 1.4), { velicina: 240 }) });
  S(2, 'Spoji primer merenja sa onim što se njime određuje.',
    [['Talesova senka', 'visina piramide preko senke štapa'], ['štap i kanap', 'širina reke'], ['Eratosten', 'obim Zemlje iz ugla i luka'], ['bor i ogledalo', 'visina bora iz odnosa dužina']],
    'Sličnost trouglova omogućava da se visine i dužine koje ne možemo izmeriti direktno izračunaju iz lako merljivih veličina.',
    'primena',
    { mediji: G({}, stub(0, 1, 1), { velicina: 240 }) });
  Q(1, 'Koji ugao je jednak pri odbijanju svetlosti od ogledala?',
    ['Upadni ugao je jednak odbojnom', 'Upadni ugao je dvostruko veći od odbojnog', 'Ugao odbijanja je uvek prav', 'Ogledalo ne menja uglove'],
    'Zakon odbijanja: upadni i odbojni ugao su jednaki. Zbog toga trouglovi u primeru sa ogledalom imaju jednake uglove i slični su.',
    'odbijanje',
    { mediji: G({ O: [0, 0], A: [-3, 3], B: [3, 3] }, [{ lin: [[-4, 0], [4, 0]], b: 4, debljina: 2 }, { lin: [[-3, 3], [0, 0]], b: 1, debljina: 3 }, { lin: [[0, 0], [3, 3]], b: 2, debljina: 3, isp: 1 }], { velicina: 260, bezImena: ['O', 'A', 'B'] }) });
  Q(2, 'Štap visine $80 cm$ baca senku $1 m$. Koliko je drvo čija je senka $12 m$?',
    ['$9{,}6 m$', '$15 m$ (ili $12 m$)', '$8 m$ (ili $7{,}5 m$)', '$12 m$ (ili $13 m$)'],
    'Iz $\\frac{0{,}8}{1} = \\frac{h}{12}$ sledi $h = 9{,}6 m$.',
    'senka',
    { mediji: G({}, [...stub(0, 0.8, 1), ...stub(3, 9.6, 12)], { velicina: 280 }) });
  Q(1, 'Zašto je Talesu senka bila dobar način za merenje visine?',
    ['Sunčevi zraci su gotovo paralelni', 'Sunce tada miruje na nebu iznad grada', 'Zemlja je ravna pa senka uvek pada pravo', 'Senke su uvek jednake dužine tokom dana'],
    'Zbog velike udaljenosti Sunca njegovi zraci su praktično paralelni, pa se pravougli trouglovi (štap sa senkom, predmet sa senkom) slažu po stavu UU.',
    'senka',
    { mediji: G({}, stub(0, 1, 0.8), { velicina: 240 }) });
  Q(3, 'Zašto je Eratosten za merenje u Asuanu izabrao letnju dugodnevnicu u podne?',
    ['Jer je tada u Asuanu Sunce bilo u zenitu', 'Jer je tada bila najveća oblačnost u Egiptu', 'Jer je tada Sunce najdalje od Zemlje, pa zraci kasne', 'Jer je tada senka u Aleksandriji bila najduža'],
    'U tom trenutku su zraci u Asuanu padali okomito na tlo, a u Aleksandriji su bili nagnuti pod uglom od $7°$. Upoređivanjem je merio ugao.',
    'zenit',
    { mediji: G({}, [...stub(0, 1, 0), { lin: [[2, 4], [0, 0]], b: 2, str: 1 }], { velicina: 240 }) });
  Q(3, 'Talesov štap visine $1 m$ baca senku $2 m$. Senka piramide, merena od podnožja, je $140 m$, a osnovica piramide je $20 m$. Kolika je visina piramide?',
    ['$75 m$', '$70 m$', '$80 m$', '$140 m$'],
    'Talesova senka je dugačka do vrha senke, pa iznosi $140 + \\frac{20}{2} = 150 m$. Iz $\\frac{1}{2} = \\frac{h}{150}$ sledi $h = 75 m$.',
    'Talesova',
    { mediji: G({}, [...stub(0, 1, 2), ...stub(4, 75, 150)], { velicina: 280 }) });
};
