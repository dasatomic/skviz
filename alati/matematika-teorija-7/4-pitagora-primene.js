// Lekcije 14–17: primene Pitagorine teoreme na paralelogram, romb, deltoid i trapez, konstrukcije
// tačaka na brojevnoj pravoj koje odgovaraju kvadratnim korenima, i rastojanje u koordinatnoj ravni.
// Sve se rešava u glavi; crteži uz pitanje i uz odgovor su geometrijski tačni (proveri ispod).
module.exports = ({ L, Q, U, S, G, proveri, r, bez }) => {
  const s2 = Math.SQRT2, s3 = Math.sqrt(3), s5 = Math.sqrt(5), s7 = Math.sqrt(7);
  const jednako = (a, b) => Math.abs(a - b) < 1e-9;
  // imena tačaka koja se ne ispisuju (pomoćne tačke: podnožja visina, središta…)
  const SKRIVENO = (...imena) => ({ bezImena: imena, velicina: 260 });

  // ── četvorouglovi ──
  const ROMB = { A: [-4, 0], B: [0, -3], C: [4, 0], D: [0, 3] };            // dijagonale 8 i 6, stranica 5
  const ROMBO = { ...ROMB, O: [0, 0] };
  proveri(jednako(Math.hypot(4, 3), 5), 'romb 8×6: stranica 5');
  const DELTOID = { A: [0, 3], B: [-2, 0], C: [0, -4], D: [2, 0], O: [0, 0] };  // AB = AD = √13, CB = CD = √20
  const PAR60 = { A: [0, 0], B: [6, 0], C: [8, r(2 * s3)], D: [2, r(2 * s3)] };  // ugao kod A = 60°
  proveri(jednako(Math.hypot(2, 2 * s3), 4), 'paralelogram 60°: AD = 4');
  const PAR85 = { A: [0, 0], B: [8, 0], C: [11, 4], D: [3, 4] };             // stranice 8 i 5
  proveri(jednako(Math.hypot(3, 4), 5), 'paralelogram 8×5');
  const PAR643 = { A: [0, 0], B: [6, 0], C: [6 + s7, 3], D: [s7, 3], F: [s7, 0] };  // AD = 4, visina 3
  proveri(jednako(Math.hypot(s7, 3), 4), 'paralelogram 6×4, visina 3');

  // ── trapezi ──
  const TRAP = { A: [0, 0], B: [9, 0], C: [6, 4], D: [2, 4] };                // opšti trapez
  const TRAP_10_4 = { A: [0, 0], B: [10, 0], C: [7, 4], D: [3, 4], M: [1.5, 2], N: [8.5, 2], E: [3, 0] };  // jednakokraki, krak 5, visina 4
  proveri(jednako(Math.hypot(3, 4), 5), 'trapez 10/4: krak 5');
  const TRAP_8_4_5 = { A: [0, 0], B: [8, 0], C: [5, 5], D: [1, 5], E: [1, 0] };  // visina 5
  const TRAP_10_2 = { A: [0, 0], B: [10, 0], C: [6, 3], D: [4, 3], E: [4, 0] };  // krak 5, visina 3
  proveri(jednako(Math.hypot(4, 3), 5), 'trapez 10/2: krak 5');
  const TRAP_PRAV = { A: [0, 0], B: [9, 0], C: [5, 3], D: [0, 3], F: [5, 0] };   // pravougli, kosi krak 5
  proveri(jednako(Math.hypot(4, 3), 5), 'pravougli trapez: kosi krak 5');
  const TRAP_12_6 = { A: [0, 0], B: [12, 0], C: [9, 3], D: [3, 3], E: [3, 0] };  // P = 27 pri visini 3
  proveri(jednako((12 + 6) * 3 / 2, 27), 'trapez 12/6 visina 3');
  const TRAP_14_8 = { A: [0, 0], B: [14, 0], C: [11, 4], D: [3, 4] };            // obim 14+8+2·5 = 32
  const TRAP_14_4 = { A: [0, 0], B: [14, 0], C: [9, 12], D: [5, 12] };           // krak 13, visina 12
  proveri(jednako(Math.hypot(5, 12), 13), 'trapez 14/4: krak 13');
  proveri(jednako(Math.hypot(9, 12), 15), 'trapez 14/4: dijagonala 15');

  // ── pomoćni crteži ──
  // pravougli trougao konstrukcije: O(0,0), P(a,0), Q(a,b), pravi ugao kod P
  const trougao = (a, b, { op, pq, oq } = {}) => {
    const e = [{ p: 'OPQ', b: 0 }, { pu: 'OPQ' }];
    if (op) e.push({ d: 'OP', o: op, b: 1 });
    if (pq) e.push({ d: 'PQ', o: pq, b: 2 });
    if (oq) e.push({ d: 'OQ', o: oq, b: 3 });
    return G({ O: [0, 0], P: [a, 0], Q: [a, b] }, e, SKRIVENO('O', 'P', 'Q'));
  };
  // Teodorova spirala: P1 = (1,0), svaka sledeća tačka je 1 jedinica normalno na OP (OP_k = √k)
  const spirala = (n) => {
    const imena = 'BCDEFGHI';
    const t = { O: [0, 0] };
    const e = [{ d: 'OB', o: '1', b: 3, crtaj: 1, kasni: 0.2 }];
    let P = [1, 0];
    t[imena[0]] = P;
    for (let k = 1; k < n; k++) {
      const d = Math.sqrt(k);
      const Q = [r(P[0] - P[1] / d), r(P[1] + P[0] / d)];
      const ime = imena[k], pret = imena[k - 1];
      t[ime] = Q;
      e.push({ d: pret + ime, b: 2, debljina: 2, crtaj: 1, kasni: 0.2 + 0.5 * k });
      e.push({ d: 'O' + ime, o: `√${k + 1}`, b: 3, crtaj: 1, kasni: 0.7 + 0.5 * k });
      P = Q;
    }
    return G(t, e, SKRIVENO(...imena.split('').slice(0, n)));
  };
  // brojevna prava sa tačkama [[ime, vrednost], …]; podrazumevano svaki ceo broj ima oznaku
  const prava = (a, b, tacke = [], x = {}) => G(
    Object.fromEntries(tacke.map(([ime, v]) => [ime, [v, 0]])),
    [{ osa: [a, b], ...x }, ...tacke.map(([ime]) => ({ tacka: ime, b: 1 }))],
    { bezImena: [], velicina: 320 });
  // koordinatna mreža sa tačkama; tacke = { ime: [x, y] }
  const mreza = (t, e, lim, x = {}) => G(t, [{ mreza: lim, ...(x.podela ? { podela: x.podela } : {}) }, ...e],
    { bezImena: x.bez || [], velicina: 300 });
  const tacke = (imena) => imena.map((ime) => ({ tacka: ime, b: 1 }));

  // ════════════ 14. Primena Pitagorine teoreme na paralelogram, romb i deltoid ════════════
  L('Primena Pitagorine teoreme na paralelogram, romb i deltoid');

  Q(2, 'Koji četvorougao je prikazan na crtežu?',
    ['Deltoid', 'Romb', 'Paralelogram', 'Trapez'],
    'Deltoid ima dva para susednih stranica jednakih dužina, ali njegove naspramne stranice nisu paralelne. Ime dolazi od grčkog slova delta (Δ), jer podseća na njegov oblik.', 'deltoid',
    { mediji: G(DELTOID, [{ p: 'ABCD', b: 0 }], SKRIVENO('O')),
      medijiOdgovora: G(DELTOID, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 3, debljina: 3 }, { d: 'BD', b: 4, debljina: 3 }, { pu: 'BOA' }], SKRIVENO('O')) });

  Q(1, 'Kako se seku dijagonale romba?',
    ['Normalno i polove se', 'Normalno, ali se ne polove', 'Jednake, ali se ne seku', 'Paralelne jedna drugoj'],
    'Dijagonale romba seku se pod pravim uglom i u tački preseka se polove. Romb se dijagonalama deli na četiri podudarna pravougla trougla.', 'dijagonala',
    { mediji: G(ROMB, [{ p: 'ABCD', b: 0 }], SKRIVENO()),
      medijiOdgovora: G(ROMBO, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 3, debljina: 3 }, { d: 'BD', b: 4, debljina: 3 }, { pu: 'AOB' }], SKRIVENO('O')) });

  Q(2, 'U paralelogramu ABCD ugao kod temena A iznosi 60°. Koliki je ugao kod temena C?',
    ['60°', '120°', '30°', '90°'],
    'Naspramni uglovi paralelograma su jednaki. Iz jednog ugla paralelograma odmah znaš i ostala tri, jer su susedni uglovi dopunski do 180°.', 'uglovi',
    { mediji: G(PAR60, [{ p: 'ABCD', b: 0 }, { u: 'DAB', o: '60°', b: 2 }, { u: 'BCD', o: '?', b: 1 }], { ...bez, velicina: 240 }) });

  Q(1, 'Stranice paralelograma su 8 cm i 5 cm. Koliki mu je obim?',
    ['26 cm', '13 cm', '40 cm', '20 cm'],
    'Naspramne stranice paralelograma su jednake, pa obim dobijemo kad dve susedne stranice saberemo i pomnožimo sa dva.', 'obim',
    { mediji: G(PAR85, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '8 cm', b: 1 }, { d: 'BC', o: '5 cm', b: 2 }], SKRIVENO()) });

  Q(2, 'Površina romba je 24 cm², a jedna dijagonala 6 cm. Kolika je druga dijagonala?',
    ['8 cm', '12 cm', '4 cm', '18 cm'],
    'Površina romba je polovina proizvoda dijagonala. Ista formula važi i za deltoid, a ne samo za romb.', 'povrsina',
    { mediji: G(ROMB, [{ p: 'ABCD', b: 0 }, { d: 'BD', o: '6 cm', na: 0.8, b: 3, debljina: 3 }, { d: 'AC', o: '?', na: 0.2, b: 1, debljina: 3 }], SKRIVENO()) });

  Q(2, 'Dijagonale romba su 6 cm i 8 cm. Kolika je stranica romba?',
    ['5 cm', '7 cm', '10 cm', '14 cm'],
    'Dijagonale se polove i seku pod pravim uglom, pa je stranica romba hipotenuza pravouglog trougla čije katete su polovine dijagonala.', 'romb',
    { mediji: G(ROMB, [{ p: 'ABCD', b: 0 }, { d: 'AC', o: '8 cm', na: 0.2, b: 3, debljina: 3 }, { d: 'BD', o: '6 cm', na: 0.8, b: 3, debljina: 3 }], SKRIVENO()),
      medijiOdgovora: G(ROMBO, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 3, debljina: 3 }, { d: 'BD', b: 3, debljina: 3 }, { pu: 'AOB' }, { d: 'AB', o: '5 cm', b: 4, debljina: 3 }], SKRIVENO('O')) });

  Q(1, 'Koliko parova jednakih susednih stranica ima deltoid?',
    ['Dva para', 'Jedan par', 'Nijedan par', 'Četiri para'],
    'Ako su sve četiri stranice deltoida jednake, on je romb. Romb je dakle poseban slučaj deltoida.', 'deltoid',
    { medijiOdgovora: G(DELTOID, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: 'a', b: 1 }, { d: 'AD', o: 'a', b: 1 }, { d: 'BC', o: 'b', b: 2 }, { d: 'CD', o: 'b', b: 2 }], SKRIVENO('O')) });

  Q(3, 'U deltoidu ABCD (AB = AD i CB = CD) jedna dijagonala deli drugu na dva jednaka dela. Koja je to?',
    ['Dijagonala AC', 'Dijagonala BD', 'Nijedna', 'Obe'],
    'Deltoid je simetričan u odnosu na jednu dijagonalu, a romb u odnosu na obe. Kvadrat ima četiri ose simetrije.', 'deltoid',
    { mediji: G(DELTOID, [{ p: 'ABCD', b: 0 }], SKRIVENO('O')),
      medijiOdgovora: G(DELTOID, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 3, debljina: 3 }, { d: 'BD', b: 4, debljina: 3 }, { d: 'BO', o: '2', b: 1 }, { d: 'OD', o: '2', b: 1 }, { pu: 'AOB' }], SKRIVENO('O')) });

  Q(3, 'Paralelogram ima stranice 6 cm i 4 cm, a visina koja odgovara stranici 6 cm je 3 cm. Kolika mu je površina?',
    ['18 cm²', '24 cm²', '12 cm²', '9 cm²'],
    'Površina paralelograma je osnovica puta visina, ali ne puta susednu stranicu. Paralelogram je „iskošen“ pravougaonik iste osnovice i visine.', 'povrsina',
    { mediji: G(PAR643, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '6 cm', b: 1 }, { d: 'BC', o: '4 cm', b: 2 }, { d: 'DF', o: '3 cm', isp: 1, b: 3 }], SKRIVENO('F')) });

  Q(2, 'Kvadrat je poseban slučaj kojih četvorouglova?',
    ['Romba i pravougaonika', 'Trapeza i deltoida', 'Deltoida i paralelograma', 'Trapeza i romba'],
    'Kvadrat ima sve četiri stranice jednake (romb) i sve uglove prave (pravougaonik). Ima četiri ose simetrije: dve dijagonale i dve prave kroz središta naspramnih stranica.', 'kvadrat');

  Q(1, 'Romb ima obim 20 cm. Kolika je dužina jedne stranice?',
    ['5 cm', '10 cm', '4 cm', '20 cm'],
    'Obim romba je četiri puta veći od stranice, jer su sve četiri stranice jednake.', 'romb',
    { mediji: G(ROMB, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '?', b: 3 }], SKRIVENO()) });

  Q(2, 'U paralelogramu ABCD ugao kod temena A je α, a ugao kod temena B je β. Koliki je zbir α + β?',
    ['180°', '360°', '90°', '270°'],
    'Isto pravilo važi i za trapez: uglovi uz isti krak su dopunski do 180°, jer su osnovice paralelne.', 'uglovi',
    { mediji: G(PAR60, [{ p: 'ABCD', b: 0 }, { u: 'DAB', o: 'α', b: 2 }, { u: 'ABC', o: 'β', b: 1 }], { ...bez, velicina: 240 }) });

  U(2, 'Koji od ovih četvorouglova ne spada u grupu paralelograma?',
    ['Deltoid', 'Romb', 'Pravougaonik', 'Kvadrat'],
    'Deltoid nema dva para paralelnih stranica. Romb, pravougaonik i kvadrat su posebni slučajevi paralelograma.',
    'Svaki paralelogram ima centar simetrije – tačku preseka dijagonala.', 'simetrija');

  S(1, 'Spoji četvorougao sa njegovim svojstvom.',
    [['Romb', 'Sve stranice su jednake'], ['Deltoid', 'Dva para jednakih susednih stranica'], ['Paralelogram', 'Dva para paralelnih stranica'], ['Pravougaonik', 'Četiri prava ugla']],
    'Kvadrat je istovremeno romb i pravougaonik, pa ima sva ta svojstva.', 'svojstvo');

  Q(3, 'U rombu ABCD tačka O je presek dijagonala. Kakav je trougao AOB?',
    ['Pravougli', 'Jednakokraki', 'Jednakostranični', 'Tupougli'],
    'Trojka 3, 4, 5 je najpoznatija Pitagorina trojka. Po predanju, graditelji su s užetom sa čvorovima na razmaku 3, 4 i 5 dobijali pravi ugao.', 'trougao',
    { mediji: G(ROMBO, [{ p: 'ABCD', b: 0 }, { tacka: 'O', b: 1 }], SKRIVENO()),
      medijiOdgovora: G(ROMBO, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 3 }, { d: 'BD', b: 3 }, { pu: 'AOB' }, { d: 'AO', o: '4 cm', b: 1 }, { d: 'OB', o: '3 cm', b: 2 }, { d: 'AB', o: '5 cm', b: 4 }], SKRIVENO()) });

  // ════════════ 15. Primena Pitagorine teoreme na trapez ════════════
  L('Primena Pitagorine teoreme na trapez');

  Q(1, 'Koliko pari paralelnih stranica ima trapez?',
    ['Tačno jedan', 'Dva', 'Nijedan', 'Tri'],
    'Trapez ima tačno jedan par paralelnih stranica. Reč „trapez“ dolazi od grčke reči za sto, jer oblik podseća na stolić.', 'trapez',
    { mediji: G(TRAP, [{ p: 'ABCD', b: 0 }], SKRIVENO()) });

  Q(1, 'Kako se zovu paralelne stranice trapeza?',
    ['Osnovice', 'Kraci', 'Dijagonale', 'Visine'],
    'Paralelne stranice trapeza su osnovice. Ostale dve stranice su kraci.', 'osnovica',
    { medijiOdgovora: G(TRAP, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: 'a', b: 1 }, { d: 'DC', o: 'b', b: 1 }, { d: 'AD', o: 'c', b: 2 }, { d: 'BC', o: 'd', b: 2 }], SKRIVENO()) });

  Q(2, 'Osnovice trapeza su 10 cm i 4 cm. Kolika je dužina srednje linije?',
    ['7 cm', '6 cm', '14 cm', '3 cm'],
    'Srednja linija je paralelna osnovicama, a njena dužina je polovina zbira osnovica.', 'srednja',
    { mediji: G(TRAP_10_4, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '10 cm', b: 1 }, { d: 'DC', o: '4 cm', b: 2 }], SKRIVENO('E', 'M', 'N')),
      medijiOdgovora: G(TRAP_10_4, [{ p: 'ABCD', b: 0 }, { d: 'MN', o: '7 cm', b: 3, debljina: 3 }], SKRIVENO('E', 'M', 'N')) });

  Q(2, 'Trapez ima osnovice 8 cm i 4 cm i visinu 5 cm. Kolika mu je površina?',
    ['30 cm²', '60 cm²', '15 cm²', '20 cm²'],
    'Površina trapeza je polovina zbira osnovica pomnožena visinom.', 'povrsina',
    { mediji: G(TRAP_8_4_5, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '8 cm', b: 1 }, { d: 'DC', o: '4 cm', b: 2 }, { d: 'DE', o: '5 cm', isp: 1, os: -1, b: 3 }], SKRIVENO('E')) });

  Q(2, 'Jednakokraki trapez ima osnovice 10 cm i 2 cm, a krak 5 cm. Kolika mu je visina?',
    ['3 cm', '4 cm', '6 cm', '8 cm'],
    'Visina jednakokrakog trapeza odseca na većoj osnovici deo jednak polovini razlike osnovica. Krak, visina i taj deo čine pravougli trougao.', 'visina',
    { mediji: G(TRAP_10_2, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '10 cm', b: 1 }, { d: 'DC', o: '2 cm', b: 2 }, { d: 'AD', o: '5 cm', b: 3 }, { d: 'BC', o: '5 cm', b: 3 }, { d: 'DE', o: '?', isp: 1, b: 4 }], SKRIVENO('E')) });

  Q(3, 'Pravougli trapez ima osnovice 9 cm i 5 cm, a krak normalan na osnovice je 3 cm. Kolika je dužina kosog kraka?',
    ['5 cm', '4 cm', '6 cm', '7 cm'],
    'Kosi krak, visina i razlika osnovica (4 cm) čine pravougli trougao, čija je hipotenuza kosi krak.', 'pravougli',
    { mediji: G(TRAP_PRAV, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '9 cm', b: 1 }, { d: 'DC', o: '5 cm', b: 2 }, { d: 'AD', o: '3 cm', b: 3 }, { d: 'BC', o: '?', b: 4 }, { pu: 'DAB' }, { pu: 'ADC' }], SKRIVENO('F')),
      medijiOdgovora: G(TRAP_PRAV, [{ p: 'ABCD', b: 0 }, { d: 'BC', o: '5 cm', b: 3, debljina: 3 }, { d: 'CF', o: '3 cm', isp: 1, b: 2 }, { d: 'BF', o: '4 cm', b: 1 }, { pu: 'CFB' }], SKRIVENO('F')) });

  Q(3, 'Koja tvrdnja o jednakokrakom trapezu je tačna?',
    ['Kraci su jednake dužine', 'Osnovice su jednake dužine', 'Sva četiri ugla su prava', 'Dijagonale se polove'],
    'Jednakokraki trapez je simetričan u odnosu na pravu koja spaja središta osnovica, pa su mu kraci jednaki. Dijagonale su takođe jednake.', 'trapez',
    { medijiOdgovora: G(TRAP_10_4, [{ p: 'ABCD', b: 0 }, { d: 'AD', o: 'c', b: 3 }, { d: 'BC', o: 'c', b: 3 }, { d: 'AB', o: 'a', b: 1 }, { d: 'DC', o: 'b', b: 2 }], SKRIVENO('E', 'M', 'N')) });

  Q(2, 'Trapez ima osnovice 12 cm i 6 cm, a površinu 27 cm². Kolika mu je visina?',
    ['3 cm', '9 cm', '6 cm', '4,5 cm'],
    'Površina je zbir osnovica podeljen sa dva, pomnožen visinom. Visinu dobijemo kad površinu podelimo srednjom linijom.', 'visina',
    { mediji: G(TRAP_12_6, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '12 cm', b: 1 }, { d: 'DC', o: '6 cm', b: 2 }, { d: 'DE', o: 'h = ?', isp: 1, os: -1, b: 3 }], SKRIVENO('E')) });

  Q(1, 'Koja linija spaja središta krakova trapeza?',
    ['Srednja linija', 'Visina', 'Dijagonala', 'Simetrala'],
    'Srednja linija je paralelna osnovicama i deli trapez na dva manja trapeza.', 'srednja',
    { mediji: G(TRAP_10_4, [{ p: 'ABCD', b: 0 }, { tacka: 'M', b: 1 }, { tacka: 'N', b: 1 }], SKRIVENO('E')),
      medijiOdgovora: G(TRAP_10_4, [{ p: 'ABCD', b: 0 }, { d: 'MN', b: 3, debljina: 3 }], SKRIVENO('E')) });

  U(2, 'Koji od ovih četvorouglova NIJE trapez?',
    ['Paralelogram', 'Pravougli trapez', 'Jednakokraki trapez', 'Trapez sa nejednakim krakovima'],
    'Trapez ima tačno jedan par paralelnih stranica. Paralelogram ima dva para, pa po ovom udžbeniku nije trapez.',
    'Formula za površinu trapeza daje tačan rezultat i za paralelogram, jer su mu osnovice jednake.', 'trapez');

  Q(2, 'Jednakokraki trapez ima osnovice 14 cm i 8 cm, a krak 5 cm. Koliki mu je obim?',
    ['32 cm', '27 cm', '22 cm', '36 cm'],
    'Obim je zbir svih stranica. Kraci su jednaki, pa se krak uzima dva puta.', 'obim',
    { mediji: G(TRAP_14_8, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '14 cm', b: 1 }, { d: 'DC', o: '8 cm', b: 2 }, { d: 'AD', o: '5 cm', b: 3 }, { d: 'BC', o: '5 cm', b: 3 }], SKRIVENO()) });

  Q(3, 'Srednja linija trapeza je 7 cm, a visina 4 cm. Kolika je površina trapeza?',
    ['28 cm²', '14 cm²', '11 cm²', '56 cm²'],
    'Površina trapeza jednaka je površini pravougaonika čija je jedna stranica srednja linija, a druga visina.', 'povrsina',
    { mediji: G(TRAP_10_4, [{ p: 'ABCD', b: 0 }, { d: 'MN', o: '7 cm', b: 3, debljina: 3 }, { d: 'DE', o: '4 cm', na: 0.85, isp: 1, os: -1, b: 2 }], SKRIVENO('E', 'M', 'N')) });

  Q(3, 'Jednakokraki trapez ima osnovice 14 cm i 4 cm, a krak 13 cm. Kolika je dužina dijagonale?',
    ['15 cm', '13 cm', '12 cm', '17 cm'],
    'Dijagonala je hipotenuza pravouglog trougla čije katete su visina i polovina zbira osnovica.', 'dijagonala',
    { mediji: G(TRAP_14_4, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '14 cm', b: 1 }, { d: 'DC', o: '4 cm', b: 2 }, { d: 'AD', o: '13 cm', b: 3 }, { d: 'BC', o: '13 cm', b: 3 }, { d: 'AC', o: '?', isp: 1, b: 4 }], SKRIVENO()) });

  S(1, 'Spoji vrstu trapeza ili pojam sa njegovim svojstvom.',
    [['Jednakokraki trapez', 'Kraci su jednake dužine'], ['Pravougli trapez', 'Ima dva prava ugla'], ['Trapez', 'Tačno jedan par paralelnih stranica'], ['Srednja linija', 'Spaja središta krakova']],
    'Srednja linija je uvek paralelna osnovicama, pa je to svojstvo koje se najlakše pamti.', 'trapez');

  Q(1, 'Koliko dijagonala ima trapez?',
    ['2', '1', '3', '4'],
    'Dijagonale spajaju naspramna temena. Svaki četvorougao ima dve dijagonale.', 'dijagonala',
    { mediji: G(TRAP, [{ p: 'ABCD', b: 0 }], SKRIVENO()) });

  // ════════════ 16. Konstrukcije tačaka na brojevnoj pravoj koje odgovaraju kvadratnim korenima ════════════
  L('Konstrukcije tačaka na brojevnoj pravoj koje odgovaraju kvadratnim korenima');

  Q(1, 'Čime se dužina dobijena konstrukcijom prenosi na brojevnu pravu?',
    ['Šestarom', 'Lenjirom', 'Uglomerom', 'Trouglom'],
    'Šestar „uhvati“ dužinu i prenese je na brojevnu pravu bez merenja. Lenjir služi samo za crtanje pravih.', 'sestar',
    { medijiOdgovora: G({ O: [0, 0], A: [s2, 0] }, [{ osa: [-2, 3] }, { kr: 'O', r: s2, b: 3, crtaj: 1 }, { tacka: 'A', b: 1 }], SKRIVENO('O')) });

  Q(1, 'Pravougli trougao ima katete $√{3}$ i $1$. Kolika mu je hipotenuza?',
    ['2', '$√{2}$', '$√{3}$', '3'],
    'Za katete $√{n}$ i $1$ hipotenuza je $√{n+1}$, jer je zbir kvadrata kateta jednak $n + 1$.', 'hipotenuza',
    { mediji: trougao(s3, 1, { op: '√3', pq: '1', oq: '?' }) });

  Q(1, 'Teodorova spirala nastaje nadovezivanjem pravouglih trouglova. Koja dužina sledi posle $√{5}$?',
    ['$√{6}$', '$√{7}$', '$√{10}$', '$√{26}$'],
    'Svaka sledeća dužina je hipotenuza trougla čije su katete prethodna dužina i 1. Ako je prethodna $√{5}$, sledeća je $√{6}$.', 'spirala',
    { medijiOdgovora: spirala(7) });

  Q(2, 'Koje katete daju hipotenuzu $√{5}$?',
    ['1 i 2', '2 i 2', '1 i 3', '1 i 4'],
    'Zbir kvadrata kateta mora biti $5 = 1^{2} + 2^{2}$, pa su katete 1 i 2.', 'kateta',
    { mediji: prava(0, 3, [['A', s5]]) });

  Q(3, 'Kako se broj 13 zapisuje kao zbir kvadrata, da bi se konstruisalo $√{13}$?',
    ['$3^{2} + 2^{2}$', '$2^{2} + 2^{2}$', '$1^{2} + 3^{2}$', '$4^{2} - 3^{2}$'],
    'Kad broj zapišemo kao zbir kvadrata dva prirodna broja, ti brojevi su katete pravouglog trougla čija je hipotenuza taj koren.', 'kateta',
    { medijiOdgovora: trougao(3, 2, { op: '3', pq: '2', oq: '√13' }) });

  Q(2, 'Između kojih celih brojeva je tačka $√{12}$ na brojevnoj pravoj?',
    ['3 i 4', '2 i 3', '6 i 7', '1 i 2'],
    'Broj 12 je između 9 (3²) i 16 (4²), pa je i njegov koren između 3 i 4.', 'koren',
    { mediji: prava(0, 5, [['A', Math.sqrt(12)]]) });

  Q(3, 'Između kojih celih brojeva je tačka $1 + √{2}$?',
    ['2 i 3', '1 i 2', '3 i 4', '0 i 1'],
    'Pošto je $√{2}$ između 1 i 2, zbir $1 + √{2}$ je između 2 i 3.', 'zbir',
    { mediji: prava(-1, 4, [['A', 1 + s2]]) });

  Q(2, 'Koja tačka je bliža nuli: $√{2}$ ili 1,5?',
    ['$√{2}$', '1,5', 'Podjednako su udaljene', 'Ne može se zaključiti'],
    '$√{2}$ je približno 1,414, pa je manje od 1,5. Na crtežu se razlika vidi ako je podela dovoljno fina.', 'rastojanje',
    { mediji: prava(0, 2, [['A', s2], ['B', 1.5]], { podela: 0.1, svaki: 10 }) });

  U(1, 'Koji od ovih brojeva NIJE kvadratni koren prirodnog broja?',
    ['2,5', '$√{2}$', '$√{7}$', '$√{10}$'],
    'Kvadratni koren prirodnog broja je $√{n}$, na primer $√{2}$, $√{7}$ ili $√{10}$. Broj 2,5 nije takav, jer mu je kvadrat 6,25, što nije prirodan broj.',
    'Za svaki prirodan broj $n$ tačka $√{n}$ može da se konstruiše pravouglim trouglom.', 'koren');

  S(2, 'Spoji broj sa katetama pravouglog trougla čija je hipotenuza taj broj.',
    [['$√{2}$', 'katete 1 i 1'], ['$√{5}$', 'katete 1 i 2'], ['$√{10}$', 'katete 1 i 3'], ['$√{13}$', 'katete 2 i 3']],
    'Hipotenuza trougla sa katetama 2 i 3 je $√{13}$, jer je $2^{2} + 3^{2} = 13$.', 'hipotenuza');

  Q(3, 'Za konstrukciju $√{12}$ koristimo trougao sa hipotenuzom 4 i katetom 2. Kolika je druga kateta?',
    ['$√{12}$', '$√{8}$', '$√{16}$', '$√{20}$'],
    'Kvadrat druge katete dobija se kao razlika kvadrata hipotenuze i kvadrata prve katete.', 'kateta',
    { mediji: trougao(Math.sqrt(12), 2, { op: '?', pq: '2', oq: '4' }) });

  Q(2, 'Hipotenuza pravouglog trougla je $√{10}$, a jedna kateta 1. Kolika je druga kateta?',
    ['3', '$√{11}$', '5', '9'],
    'Kvadrat druge katete je $10 - 1 = 9$, pa je kateta 3.', 'hipotenuza',
    { mediji: trougao(3, 1, { op: '?', pq: '1', oq: '√10' }) });

  Q(3, 'Koja dužina se konstruiše neposredno pre $√{7}$ u nizu Teodorove spirale?',
    ['$√{6}$', '$√{8}$', '$√{5}$', '$√{3}$'],
    'Za $√{7}$ potrebna je hipotenuza trougla sa katetama $√{6}$ i $1$, jer je $6 + 1 = 7$.', 'spirala');

  Q(1, 'Koja tačka na brojevnoj pravoj je simetrična tački $√{2}$ u odnosu na nulu?',
    ['$-√{2}$', '$√{2}$', '$-2$', '$2√{2}$'],
    'Simetrične tačke u odnosu na nulu imaju suprotne znake, a isto rastojanje od nule.', 'simetrija',
    { mediji: prava(-3, 3, [['A', s2]]) });

  Q(2, 'Između kojih celih brojeva je tačka A na brojevnoj pravoj?',
    ['2 i 3', '1 i 2', '3 i 4', '7 i 8'],
    'Broj 7 je između 4 i 9, pa je $√{7}$ između 2 i 3, jer je $2^{2} = 4$, a $3^{2} = 9$.', 'brojevna',
    { mediji: prava(0, 4, [['A', s7]]) });

  // ════════════ 17. Rastojanje između dve tačke u koordinatnoj ravni ════════════
  L('Rastojanje između dve tačke u koordinatnoj ravni');

  Q(1, 'Koliko je rastojanje tačke $A(0, 0)$ od tačke $B(3, 4)$?',
    ['5', '7', '$√{7}$', '25'],
    'Katete su 3 i 4, a rastojanje je hipotenuza: $√{3^{2} + 4^{2}} = 5$.', 'koordinatna',
    { mediji: mreza({ A: [0, 0], B: [3, 4] }, tacke(['A', 'B']), [-1, 4, -1, 5]),
      medijiOdgovora: mreza({ A: [0, 0], B: [3, 4], E: [3, 0] }, [{ p: 'AEB', b: 0 }, { pu: 'AEB' }, { d: 'AE', o: '3', b: 1 }, { d: 'EB', o: '4', b: 2 }, { d: 'AB', o: '5', b: 3, debljina: 3 }, ...tacke(['A', 'B'])], [-1, 4, -1, 5], { bez: ['E'] }) });

  Q(1, 'Tačke $A(3, -1)$ i $B(3, 6)$ leže na pravoj paralelnoj y-osi. Koliko je rastojanje između njih?',
    ['7', '5', '4', '9'],
    'Kad su x-koordinate jednake, rastojanje je razlika y-koordinata: $6 - (-1) = 7$.', 'rastojanje',
    { mediji: mreza({ A: [3, -1], B: [3, 6] }, tacke(['A', 'B']), [-1, 5, -2, 7]) });

  Q(2, 'Koliko je rastojanje tačke $O(0, 0)$ od tačke $B(5, 12)$?',
    ['13', '17', '7', '$√{119}$'],
    'Trojka 5, 12, 13 je druga po redu poznata Pitagorina trojka, posle 3, 4, 5.', 'trojka',
    { mediji: mreza({ O: [0, 0], B: [5, 12] }, [{ tacka: 'O', b: 1 }, { tacka: 'B', b: 2 }], [-1, 6, -1, 13], { podela: [1, 2] }) });

  Q(2, 'Koja formula daje rastojanje između tačaka $A(x_{A}, y_{A})$ i $B(x_{B}, y_{B})$?',
    ['$AB = √{(x_{B} - x_{A})^{2} + (y_{B} - y_{A})^{2}}$', '$AB = √{(x_{B} - x_{A})^{2} · (y_{B} - y_{A})^{2}}$', '$AB = √{(x_{B} + x_{A})^{2} + (y_{B} + y_{A})^{2}}$', '$AB = (x_{B} - x_{A}) + (y_{B} - y_{A})$'],
    'Formula je Pitagorina teorema za pravougli trougao čije su katete razlike koordinata.', 'formula');

  Q(2, 'Između kojih celih brojeva je rastojanje tačke $O$ i tačke $A(2, 3)$?',
    ['3 i 4', '2 i 3', '4 i 5', '1 i 2'],
    'Rastojanje je $√{2^{2} + 3^{2}} = √{13}$. Broj 13 je između 9 i 16, pa je $√{13}$ između 3 i 4.', 'rastojanje',
    { mediji: mreza({ O: [0, 0], A: [2, 3] }, tacke(['A', 'O']), [-1, 4, -1, 4]) });

  Q(1, 'Tačke $A(2, 5)$ i $B(6, 5)$ leže na istoj vodoravnoj pravoj. Koliko je rastojanje između njih?',
    ['4', '7', '3', '8'],
    'Kad su y-koordinate jednake, rastojanje je razlika x-koordinata.', 'rastojanje',
    { mediji: mreza({ A: [2, 5], B: [6, 5] }, tacke(['A', 'B']), [0, 8, 3, 7]) });

  Q(2, 'Kolika je obim trougla ABC ako je $A(0, 0)$, $B(6, 0)$ i $C(0, 8)$?',
    ['24', '14', '48', '20'],
    'Trougao je pravougli kod A, a stranica BC je hipotenuza. Stranice su 6, 8 i 10.', 'obim',
    { mediji: mreza({ A: [0, 0], B: [6, 0], C: [0, 8] }, [{ p: 'ABC', b: 0 }, ...tacke(['A', 'B', 'C'])], [-1, 7, -1, 9]),
      medijiOdgovora: mreza({ A: [0, 0], B: [6, 0], C: [0, 8] }, [{ p: 'ABC', b: 0 }, { d: 'AB', o: '6', b: 1 }, { d: 'AC', o: '8', b: 2 }, { d: 'BC', o: '10', b: 3, debljina: 3 }, { pu: 'BAC' }], [-1, 7, -1, 9]) });

  Q(2, 'Trougao ABC je pravougli sa pravim uglom kod C. Ako je $C(0, 0)$, $A(12, 0)$ i $B(0, 5)$, kolika je hipotenuza?',
    ['13', '17', '7', '60'],
    'Hipotenuza je stranica naspram pravog ugla, pa je duža od obe katete.', 'hipotenuza',
    { mediji: mreza({ C: [0, 0], A: [12, 0], B: [0, 5] }, [{ p: 'ACB', b: 0 }, { pu: 'ACB' }, ...tacke(['A', 'B', 'C'])], [-1, 13, -1, 6]) });

  Q(3, 'Koja tačka je najbliža koordinatnom početku?',
    ['$B(2, 2)$', '$A(3, -4)$', '$C(-1, 3)$', '$D(0, 4)$'],
    'Rastojanje od početka računa se iz obe koordinate. Velika vrednost jedne koordinate ne znači veliko rastojanje.', 'rastojanje',
    { mediji: mreza({ A: [3, -4], B: [2, 2], C: [-1, 3], D: [0, 4], O: [0, 0] }, [{ tacka: 'O', b: 1 }, ...tacke(['A', 'B', 'C', 'D'])], [-2, 4, -5, 5], { bez: ['O'] }) });

  Q(2, 'Kakav je trougao $A(-3, 0)$, $B(3, 0)$, $C(0, 4)$?',
    ['Jednakokraki', 'Jednakostranični', 'Pravougli', 'Raznostranični'],
    'Stranice AC i BC su po 5, a AB je 6. Dve jednake stranice znače jednakokraki trougao.', 'krak',
    { mediji: mreza({ A: [-3, 0], B: [3, 0], C: [0, 4] }, [{ p: 'ABC', b: 0 }, ...tacke(['A', 'B', 'C'])], [-5, 5, -1, 6]),
      medijiOdgovora: mreza({ A: [-3, 0], B: [3, 0], C: [0, 4] }, [{ p: 'ABC', b: 0 }, { d: 'AC', o: '5', b: 2 }, { d: 'BC', o: '5', b: 3 }, { d: 'AB', o: '6', b: 1 }], [-5, 5, -1, 6]) });

  S(2, 'Spoji tačku sa njenim rastojanjem od koordinatnog početka.',
    [['$A(3, 4)$', '5'], ['$B(6, 8)$', '10'], ['$C(1, 1)$', '$√{2}$'], ['$D(0, 7)$', '7']],
    'Rastojanje tačke $(x, y)$ od početka je $√{x^{2} + y^{2}}$, pa zavisi od obe koordinate.', 'koordinata');

  U(2, 'Koja tačka NIJE na istom rastojanju od O kao tačka $(5, 0)$?',
    ['$(4, 4)$', '$(3, 4)$', '$(-5, 0)$', '$(0, -5)$'],
    'Tačke $(3, 4)$, $(-5, 0)$ i $(0, -5)$ su od $O$ udaljene 5 jedinica. Tačka $(4, 4)$ je udaljena $√{32}$, što je oko 5,66.',
    'Skup svih tačaka na istom rastojanju od jedne tačke je kružnica.', 'kruznica');

  Q(3, 'Tačka B je na rastojanju 5 od koordinatnog početka, ima x-koordinatu 3 i pozitivnu y-koordinatu. Kolika je njena y-koordinata?',
    ['4', '2', '$√{34}$', '8'],
    'Ovo je obrnut zadatak: iz rastojanja i jedne koordinate traži se druga, a to je ista Pitagorina teorema.', 'koordinata',
    { medijiOdgovora: mreza({ O: [0, 0], B: [3, 4], E: [3, 0] }, [{ d: 'OB', o: '5', b: 3, debljina: 3 }, { d: 'OE', o: '3', b: 1 }, { d: 'EB', o: '4', b: 2 }, { pu: 'OEB' }, ...tacke(['B'])], [-1, 5, -1, 6], { bez: ['O', 'E'] }) });

  Q(3, 'Koliko je rastojanje tačaka $A(-4, 1)$ i $B(4, 16)$?',
    ['17', '23', '7', '15'],
    'Razlike koordinata su 8 i 15, a to je poznata Pitagorina trojka 8, 15, 17.', 'trojka');

  Q(2, 'Koliko je rastojanje tačaka $A(-1, -2)$ i $B(5, 6)$?',
    ['10', '14', '48', '2'],
    'Razlike koordinata su 6 i 8, pa je rastojanje hipotenuza pravouglog trougla sa katetama 6 i 8. To je dvostruka trojka 3, 4, 5.', 'rastojanje',
    { mediji: mreza({ A: [-1, -2], B: [5, 6] }, tacke(['A', 'B']), [-2, 6, -3, 7]) });

  proveri(jednako(Math.hypot(3, 4), 5) && jednako(Math.hypot(8, 15), 17), 'trojke 3-4-5 i 8-15-17');
  proveri(jednako(Math.hypot(6, 8), 10), 'trojka 6-8-10');
  return null;
};
