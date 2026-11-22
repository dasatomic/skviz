// Lekcije 21–24: algebarski izrazi i brojevna vrednost, polinomi i operacije, kvadrat binoma
// i razlika kvadrata, rastavljanje polinoma na činioce (teorija i pojmovi, bez računa na papiru).
module.exports = ({ L, Q, U, S, G, proveri, r, bez, O }) => {

  // pravougaonik (x0, y0) širine w i visine h; „gusto“ = popunjen, „prazno“ = samo obrub
  const pravougaonik = (x0, y0, w, h, b = 1, x = {}) => ({
    lin: [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], zatv: 1, b, gusto: 1, ...x,
  });
  const kvadrat = (x0, y0, a, b = 1, x = {}) => pravougaonik(x0, y0, a, a, b, x);

  // ── 21. algebarski izrazi; brojevna vrednost izraza ──
  L('Algebarski izrazi; brojevna vrednost izraza');
  Q(1, 'Koji od ovih izraza je algebarski (ima slovo koje predstavlja broj)?',
    ['$2a + 7b$', '$2 + 7 = 9$', '$\\sqrt{25} + 4$', '$(3 \\cdot 5)$'],
    'Algebarski izraz povezuje brojeve i slova (promenljive) znacima operacija. Slova zamenjuju brojeve koje još ne znamo ili koji mogu da se menjaju. Izrazi bez slova su brojevni.', 'slovo',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$2a+7b$ – slova zamenjuju brojeve' } });
  Q(1, 'Kolika je brojevna vrednost izraza $2x + 3$ za $x = 4$?',
    ['11', '9', '14', '7'],
    'Zameniš $x$ brojem 4 i izračunaš: $2 \\cdot 4 + 3 = 8 + 3 = 11$. Prvo množenje, pa sabiranje.', 'vrednost',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$2\\cdot4+3=11$' } });
  Q(2, 'Kolika je brojevna vrednost izraza $x^{2}$ za $x = -3$?',
    ['9', '−9', '6', '−6'],
    'Stepen se računa pre znaka: $(-3)^{2} = (-3)\\cdot(-3) = 9$. Ali $-3^{2}$ (bez zagrada) znači $-(3^{2}) = -9$, što je druga stvar. Zato je uvek bitno gde stoje zagrade.', 'stepen',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(-3)^{2}=9$, ali $-3^{2}=-9$' } });
  Q(3, 'Za koje vrednosti $x$ izraz $5 : (x^{2} - 4)$ nema smisla?',
    ['$x = 2$ i $x = -2$', 'samo $x = 0$', 'samo $x = 4$', 'nijedna vrednost'],
    'Imenilac $x^{2} - 4$ je nula za $x^{2} = 4$, dakle za $x = 2$ i za $x = -2$. Oba broja moraju da se izuzmu, jer je $2^{2} = (-2)^{2} = 4$.', 'imenilac',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$x^{2}-4=0 \\Rightarrow x=±2$' } });
  Q(1, 'Koliki je obim pravougaonika sa stranicama $a$ i $b$?',
    ['$2 \\cdot (a + b)$', '$a \\cdot b$', '$a + b$', '$2a \\cdot b$'],
    'Obim je zbir svih stranica: dve stranice $a$ i dve stranice $b$, dakle $2a + 2b = 2(a + b)$. Površina je $a \\cdot b$, a to je druga veličina.', 'obim',
    { mediji: G(O, [pravougaonik(0, 0, 6, 3.5, 1, { id: 'p' }), { tx: 'a', at: [3, -0.6], vel: 22 }, { tx: 'b', at: [6.6, 1.75], vel: 22 }], { ...bez, velicina: 300 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '$O=2a+2b=2(a+b)$' } });
  Q(2, 'Pravougaonik ima stranice $a$ i $a + 2$ (crtež). Koji izraz daje njegovu površinu?',
    ['$a \\cdot (a + 2)$', '$a + (a + 2)$', '$2a + 2$', '$a^{2} + 2$'],
    'Površina pravougaonika je proizvod stranica: $P = a \\cdot (a+2)$. Zbir stranica bi dao obim (a ne površinu), a $2a+2$ je obim kad su stranice $a$ i $1$.', 'površina',
    { mediji: G(O, [pravougaonik(0, 0, 6, 3.5, 1, { id: 'p' }), { tx: 'a', at: [3, -0.6], vel: 22 }, { tx: 'a + 2', at: [6.9, 1.75], vel: 20 }], { ...bez, velicina: 300 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '$P=a\\cdot(a+2)$' } });
  Q(2, 'Kolika je brojevna vrednost izraza $a \\cdot (a + 2)$ za $a = 3$?',
    ['15', '11', '13', '9'],
    'Zameniš $a$ sa 3: $3 \\cdot (3 + 2) = 3 \\cdot 5 = 15$. Zbir u zagradi se računa prvo. Ako bi se zagrada zanemarila, dobio bi se $3 \\cdot 3 + 2 = 11$.', 'zagrada',
    { medijiOdgovora: G(O, [pravougaonik(0, 0, 5, 3, 1), { tx: '3', at: [2.5, -0.6], vel: 20 }, { tx: '5', at: [5.6, 1.5], vel: 20 }], { ...bez, velicina: 260 }) });
  U(2, 'Koji od ovih izraza NIJE racionalni algebarski izraz?',
    ['$\\sqrt{x} + 4$', '$2x - 7$', '$\\frac{x + 1}{3}$', '$x^{2} \\cdot y$'],
    'Koren od promenljive $\\sqrt{x}$ nije racionalan izraz: za njega ne važe samo osnovne operacije sa brojem i slovom. Ostali izrazi sadrže samo sabiranje, oduzimanje, množenje i deljenje (sa brojem ili izrazom bez slova u imeniocu).',
    'Kad se izraz ne sastoji samo od sabiranja, oduzimanja, množenja i deljenja, razlikuje se od racionalnog; koren od slova je tipičan primer.', 'racionalan');
  S(2, 'Spoji izraz sa njegovim rečima:',
    [['$a + b$', 'zbir brojeva $a$ i $b$'], ['$a - b$', 'razlika brojeva $a$ i $b$'], ['$a \\cdot b$', 'proizvod brojeva $a$ i $b$'], ['$a : b$', 'količnik brojeva $a$ i $b$']],
    'Slova su skraćenica za cele rečenice: „zbir kvadrata dva broja“ je samo $a^{2} + b^{2}$, a „kvadrat zbira“ je $(a + b)^{2}$ – to nije isto! Slova za nepoznate je u 16. veku uveo Fransoa Vijet.', 'rečnik');

  Q(2, 'Pravougaonik ima stranice $a$ i $a + 2$ (crtež). Koliki je njegov obim za $a = 3$?',
    ['16', '15', '8', '11'],
    'Obim je $2(a + (a+2)) = 2(2a + 2)$. Za $a = 3$ stranice su 3 i 5, pa je obim $2 \\cdot (3 + 5) = 16$. Površina bi bila $15$, pa to nije odgovor.', 'obim',
    { mediji: G(O, [pravougaonik(0, 0, 5, 3, 1), { tx: 'a', at: [2.5, -0.6], vel: 22 }, { tx: 'a + 2', at: [5.9, 1.5], vel: 20 }], { ...bez, velicina: 300 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '$O=2\\cdot(3+5)=16$' } });

  Q(2, 'Obojeni lik je pravougaonik sa izrezanim uglom (crtež). Kolika mu je površina?',
    ['$ab - cd$', '$ab + cd$', '$a + b - c - d$', '$2(a + b)$'],
    'Površina je cela pravougaonik $ab$ minus izrezani deo $cd$: $ab - cd$. Ako bi se izrezani deo sabirao, dobilo bi se $ab + cd$, što je greška.', 'izrez',
    { mediji: G(O, [{ lin: [[0, 0], [5, 0], [5, 2], [3, 2], [3, 3], [0, 3]], zatv: 1, b: 1, gusto: 1 }, { tx: 'a', at: [2.5, -0.6], vel: 20 }, { tx: 'b', at: [-0.6, 1.5], vel: 20 }, { tx: 'c', at: [4, 2.4], vel: 18 }, { tx: 'd', at: [2.6, 2.5], vel: 18 }], { ...bez, velicina: 300 }) });
  Q(2, 'Na crtežu su prva tri koraka niza. Koji izraz daje broj kockica u n-tom koraku?',
    ['$2n - 1$', '$2n + 1$', '$n^{2}$', '$3n$'],
    'Korak 1 ima 1 kockicu, korak 2 ima 3, korak 3 ima 5. Dakle broj kockica je $2n - 1$. Izraz $n^{2}$ daje 1, 4, 9, što je drugi niz.', 'niz',
    { mediji: G(O, [pravougaonik(0, 0, 1, 1, 1), pravougaonik(2, 0, 1, 1, 1), pravougaonik(3, 0, 1, 1, 1), pravougaonik(2, 1, 1, 1, 1), pravougaonik(5, 0, 1, 1, 1), pravougaonik(6, 0, 1, 1, 1), pravougaonik(7, 0, 1, 1, 1), pravougaonik(5, 1, 1, 1, 1), pravougaonik(5, 2, 1, 1, 1)], { ...bez, velicina: 300 }) });
  Q(2, 'Dva pravougaonika stoje jedan do drugog, iste visine (crtež). Kolika je ukupna površina?',
    ['$c(a + b)$', '$ab + c$', '$a + b + c$', '$2c(a + b)$'],
    'Oba imaju visinu $c$, pa je ukupna površina $ca + cb = c(a + b)$. Izraz $2c(a + b)$ bi bio površina dva ovakva para, a $ab + c$ meša površinu i dužinu.', 'zbir',
    { mediji: G(O, [pravougaonik(0, 0, 3, 2, 1), pravougaonik(3, 0, 2, 2, 2), { tx: 'a', at: [1.5, -0.6], vel: 20 }, { tx: 'b', at: [4, -0.6], vel: 20 }, { tx: 'c', at: [-0.6, 1], vel: 20 }], { ...bez, velicina: 300 }) });
  Q(2, 'Lik je pravougaonik kome je odsečen jedan ugao (crtež). Koliki mu je obim?',
    ['$2(a + b)$', '$2(a + b) - c - d$', '$ab - cd$', '$2(a + b) + c + d$'],
    'Odsečeni ugao ne menja obim: spoljašnji obris ide duž istih pravaca kao kod celog pravougaonika $a$ i $b$, pa je obim $2(a + b)$. Površina se smanjuje, obim ne.', 'obim',
    { mediji: G(O, [{ lin: [[0, 0], [5, 0], [5, 2], [3, 2], [3, 3], [0, 3]], zatv: 1, b: 1, gusto: 1 }, { tx: 'a', at: [2.5, -0.6], vel: 20 }, { tx: 'b', at: [-0.6, 1.5], vel: 20 }], { ...bez, velicina: 300 }) });
  Q(2, 'Tabela pokazuje vrednosti nekog izraza za $x = 1, 2, 3, 4$. Koji izraz daje te vrednosti?',
    ['$2x + 1$', '$x + 2$', '$3x$', '$x^{2}$'],
    'Za $x = 1$ dobija se $3$, za $x = 2$ dobija se $5$, za $x = 3$ dobija se $7$, a za $x = 4$ dobija se $9$. Brojevi rastu za 2, a $2x + 1$ daje upravo te vrednosti.', 'tabela',
    { mediji: G(O, [{ tx: 'x', at: [-1.2, 1], vel: 18, b: 1 }, { tx: '1', at: [0, 1], vel: 18 }, { tx: '2', at: [1.5, 1], vel: 18 }, { tx: '3', at: [3, 1], vel: 18 }, { tx: '4', at: [4.5, 1], vel: 18 }, { tx: '~izraz', at: [-1.2, 0], vel: 16, b: 2 }, { tx: '?', at: [0, 0], vel: 18 }, { tx: '?', at: [1.5, 0], vel: 18 }, { tx: '?', at: [3, 0], vel: 18 }, { tx: '?', at: [4.5, 0], vel: 18 }], { ...bez, velicina: 300 }) });

  // pločica sa oznakom (algebarske pločice: x², x, 1); niz pločica u redu od x0
  const plocica = (x0, y0, oznaka, b, { w = 1.2, h = 1.2, vel = 18 } = {}) => [
    pravougaonik(x0, y0, w, h, b),
    { tx: oznaka, at: [x0 + w / 2, y0 + h / 2 - 0.12], vel, b: 5 },
  ];
  const red = (niz, x0 = 0, y0 = 0, razmak = 1.4) => niz.flatMap((p, i) => plocica(x0 + i * razmak, y0, p[0], p[1], p[2] || {}));

  // ── 22. polinomi; operacije sa polinomima ──
  L('Polinomi; operacije sa polinomima');
  Q(1, 'Kako se zove izraz koji je proizvod brojeva i promenljivih, npr. $-3x^{2}y$?',
    ['Monom', 'Binom', 'Trinom', 'Razlomak'],
    'Monom je izraz koji čine konstante i promenljive povezane množenjem, bez sabiranja i oduzimanja. Binom je zbir dva monoma, a trinom zbir tri nesrodna monoma.', 'monom',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$-3x^{2}y$ je monom' } });
  Q(2, 'Koliki je stepen monoma $-3x^{2}y$?',
    ['3', '2', '6', '4'],
    'Stepen monoma je zbir izložilaca promenljivih: $x^{2}$ daje 2, a $y$ (koje je $y^{1}$) daje 1, pa je ukupno $2 + 1 = 3$. Broj $-3$ nema promenljivu, pa ne ulazi u stepen.', 'stepen',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$2+1=3$' } });
  Q(1, 'Koji par monoma je sličan (razlikuju se samo u koeficijentu)?',
    ['$4ab$ i $7ab$', '$4a$ i $4a^{2}$', '$2x$ i $2y$', '$3xy$ i $3x^{2}$'],
    'Slični monomi imaju iste promenljive sa istim izložiocima, a razlikuju se samo u koeficijentu. $4ab$ i $7ab$ su slični, a $4a$ i $4a^{2}$ nisu jer je različit stepen od $a$.', 'slični',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$4ab+7ab=11ab$' } });
  Q(1, 'Koliko je $3x + 5x$?',
    ['$8x$', '$15x$', '$8x^{2}$', '$3x^{2} + 5$'],
    'Slični monomi se sabiraju tako što se saberu koeficijenti, a promenljivi deo ostaje: $3x + 5x = 8x$. Ovo je isto kao kad sabereš 3 kruške i 5 kruški – dobiješ 8 kruški.', 'sabiranje',
    { mediji: G(O, [...red([['x', 0], ['x', 0], ['x', 0]], 0, 0), ...red([['x', 0], ['x', 0], ['x', 0], ['x', 0], ['x', 0]], 6, 0)], { ...bez, velicina: 300 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '$3x+5x=8x$' } });
  Q(1, 'Koji je zbir polinoma $(x^{2} + 2x + 3) + (-3x^{2} + x - 2)$?',
    ['$-2x^{2} + 3x + 1$', '$-2x^{2} + 3x + 5$', '$4x^{2} + 3x + 1$', '$-2x^{2} + x + 1$'],
    'Slični monomi se sabiraju: $x^{2} - 3x^{2} = -2x^{2}$, $2x + x = 3x$ i $3 + (-2) = 1$. Konstante se sabiraju posebno, a znak se pazi.', 'zbir',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(x^{2}-3x^{2})+(2x+x)+(3-2)=-2x^{2}+3x+1$' } });
  U(2, 'Koji od ovih izraza NIJE jednak $5x$?',
    ['$5x^{2}$', '$2x + 3x$', '$x \\cdot 5$', '$10x - 5x$'],
    'Izraz $5x^{2}$ ima $x$ na kvadrat, pa nije isti kao $5x$. Ostali su jednaki: $2x+3x=5x$, $x\\cdot5=5x$, $10x-5x=5x$.',
    'Greška sa stepenom je česta: $x^{2}$ i $x$ nisu slični monomi, pa se ne mogu sabrati ni izjednačiti.', 'slični');
  Q(1, 'Koji izraz daje površinu pravougaonika sa stranicama $x$ i $2x - 1$ (crtež)?',
    ['$2x^{2} - x$', '$2x^{2} + x$', '$2x - 1$', '$2x^{2} - 1$'],
    'Površina je proizvod stranica: $x \\cdot (2x - 1) = 2x^{2} - x$. Svaki član u zagradi se množi sa $x$, to je zakon distributivnosti.', 'raspodela',
    { mediji: G(O, [pravougaonik(0, 0, 4, 3, 1), { tx: 'x', at: [2, -0.6], vel: 22 }, { tx: '2x − 1', at: [4.9, 1.5], vel: 18 }], { ...bez, velicina: 300 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '$x\\cdot(2x-1)=2x^{2}-x$' } });
  Q(2, 'Koliki je proizvod binoma $(x + 2)(x + 3)$?',
    ['$x^{2} + 5x + 6$', '$x^{2} + 5x + 5$', '$x^{2} + 6x + 5$', '$x^{2} + 5x + 9$'],
    'Svaki sa svakim: $x \\cdot x + x \\cdot 3 + 2 \\cdot x + 2 \\cdot 3 = x^{2} + 5x + 6$. Greška je dodati $2 + 3$ kao slobodan član ili zameniti $2 \\cdot 3$ sa $5$.', 'svaki',
    { mediji: G(O, [pravougaonik(0, 0, 5, 6, 1), { tx: 'x + 2', at: [2.5, -0.6], vel: 20 }, { tx: 'x + 3', at: [5.9, 3], vel: 20 }], { ...bez, velicina: 300 }),
      medijiOdgovora: G(O, [
        pravougaonik(0, 0, 3, 3, 1), pravougaonik(3, 0, 2, 3, 2), pravougaonik(0, 3, 3, 3, 3), pravougaonik(3, 3, 2, 3, 4),
        { tx: 'x²', at: [1.5, 1.5], vel: 18, b: 5 }, { tx: '2x', at: [4, 1.5], vel: 18, b: 5 }, { tx: '3x', at: [1.5, 4.5], vel: 18, b: 5 }, { tx: '6', at: [4, 4.5], vel: 18, b: 5 },
      ], { ...bez, velicina: 300 }) });
  Q(3, 'Koji je stepen polinoma $x^{3} + 2x^{2}y^{2} - 5$?',
    ['4', '3', '5', '2'],
    'Stepen polinoma je najveći stepen među njegovim monomima. Monom $2x^{2}y^{2}$ ima stepen $2 + 2 = 4$, što je veće od 3 kod $x^{3}$. Slobodan član $-5$ ima stepen 0.', 'stepen',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$x^{3}\\to3$, $2x^{2}y^{2}\\to4$, stepen polinoma je 4' } });
  S(2, 'Spoji monom sa njegovim stepenom:',
    [['$5ab$', 'stepen 2'], ['$x^{3}$', 'stepen 3'], ['$7$', 'stepen 0'], ['$-2x^{2}y^{3}$', 'stepen 5']],
    'Konstanta nema promenljive, pa joj je stepen 0. Za $-2x^{2}y^{3}$ se sabiraju izložioci: $2 + 3 = 5$.', 'stepen');


  Q(2, 'Koji polinom prikazuju pločice na crtežu?',
    ['$x^{2} + 2x + 3$', '$x^{2} + 3x + 2$', '$2x^{2} + x + 3$', '$x^{2} + 2x + 2$'],
    'Jedna velika pločica je $x^{2}$, dve srednje su $x$, a tri male su $1$. Zbir je $x^{2} + 2x + 3$. Pločice se ne menjaju kad ih slažeš, samo ih brojiš.', 'pločice',
    { mediji: G(O, [...plocica(0, 0, 'x²', 1, { w: 2, h: 2 }), ...plocica(2.4, 0, 'x', 2, { w: 1.2, h: 2 }), ...plocica(3.8, 0, 'x', 2, { w: 1.2, h: 2 }), ...plocica(0, 2.4, '1', 3, { w: 1, h: 1 }), ...plocica(1.2, 2.4, '1', 3, { w: 1, h: 1 }), ...plocica(2.4, 2.4, '1', 3, { w: 1, h: 1 })], { ...bez, velicina: 300 }) });
  Q(2, 'Dva pravougaonika su spojena (crtež: širine $x$ i $2$, visina $x + 3$). Koliki je ukupan zbir površina?',
    ['$x^{2} + 5x + 6$', '$x^{2} + 5x + 5$', '$x^{2} + 3x + 6$', '$x^{2} + 6x + 5$'],
    'Prvi pravougaonik je $x(x + 3) = x^{2} + 3x$, drugi je $2(x + 3) = 2x + 6$. Zbir je $x^{2} + 5x + 6$. Greška je zaboraviti jedan od pomnoženih članova.', 'zbir',
    { mediji: G(O, [pravougaonik(0, 0, 2, 5, 1), pravougaonik(2, 0, 2, 5, 2), { tx: 'x', at: [1, -0.6], vel: 20 }, { tx: '2', at: [3, -0.6], vel: 20 }, { tx: 'x + 3', at: [-0.6, 2.5], vel: 18 }], { ...bez, velicina: 300 }) });
  Q(2, 'Veći kvadrat ima stranicu $x$, manji stranicu $1$ (crtež). Kolika je razlika njihovih površina?',
    ['$x^{2} - 1$', '$x^{2} + 1$', '$x - 1$', '$(x - 1)^{2}$'],
    'Razlika površina je $x^{2} - 1^{2} = x^{2} - 1$. Razlika stranica $x - 1$ nije razlika površina, pa je to česta greška.', 'razlika',
    { mediji: G(O, [kvadrat(0, 0, 3, 1), kvadrat(3.6, 0, 1, 2), { tx: 'x', at: [1.5, -0.6], vel: 20 }, { tx: '1', at: [4.1, -0.6], vel: 18 }], { ...bez, velicina: 300 }) });
  Q(2, 'Pravougaonik ima stranice $x + 2$ i $3$ (crtež). Koja mu je površina?',
    ['$3x + 6$', '$3x + 2$', '$x + 6$', '$3x + 5$'],
    'Svaki član u zagradi množi se sa 3: $3(x + 2) = 3x + 6$. Greška je dodati samo 3 umesto da se pomnoži sa oba člana.', 'površina',
    { mediji: G(O, [pravougaonik(0, 0, 4, 2, 1), { tx: 'x + 2', at: [2, -0.6], vel: 20 }, { tx: '3', at: [4.6, 1], vel: 20 }], { ...bez, velicina: 300 }) });
  Q(2, 'Pravougaonik ima stranice $x$ i $x + 3$ (crtež). Koliki mu je obim?',
    ['$4x + 6$', '$2x + 3$', '$4x + 3$', '$2x + 6$'],
    'Obim je zbir svih stranica: $2(x + (x + 3)) = 2(2x + 3) = 4x + 6$. Greška je računati samo jednu stranicu dva puta.', 'obim',
    { mediji: G(O, [pravougaonik(0, 0, 2, 5, 1), { tx: 'x', at: [1, -0.6], vel: 20 }, { tx: 'x + 3', at: [-0.6, 2.5], vel: 18 }], { ...bez, velicina: 300 }) });

  // ── 23. kvadrat binoma i razlika kvadrata ──
  L('Kvadrat binoma i razlika kvadrata');
  Q(1, 'Koliko je $(a + b)^{2}$ kad se razvije?',
    ['$a^{2} + 2ab + b^{2}$', '$a^{2} + b^{2}$', '$a^{2} + ab + b^{2}$', '$a^{2} + 4ab + b^{2}$'],
    'Kvadrat zbira ima tri člana: $a^{2}$, dvostruki proizvod $2ab$ i $b^{2}$. Srednji član je dvostruk, jer se oba pravougaonika $ab$ pojavljuju u kvadratu.', 'kvadrat',
    { mediji: G(O, [pravougaonik(0, 0, 5, 5, 1, { id: 'k' }), { tx: 'a + b', at: [2.5, -0.6], vel: 20 }, { tx: 'a + b', at: [5.9, 2.5], vel: 20 }], { ...bez, velicina: 300 }),
      medijiOdgovora: G(O, [
        pravougaonik(0, 0, 3, 3, 4), pravougaonik(3, 0, 2, 3, 2), pravougaonik(0, 3, 3, 2, 3), pravougaonik(3, 3, 2, 2, 5),
        { tx: 'a²', at: [1.5, 1.5], vel: 18, b: 5 }, { tx: 'ab', at: [4, 1.5], vel: 18, b: 5 }, { tx: 'ab', at: [1.5, 4], vel: 18, b: 5 }, { tx: 'b²', at: [4, 4], vel: 18, b: 5 },
      ], { ...bez, velicina: 300 }) });
  Q(2, 'Kvadrat ima stranice $a + b$ = 5 (a = 3, b = 2), kao na crtežu. Kolika mu je površina?',
    ['25', '13', '11', '36'],
    'Površina kvadrata je stranica na kvadrat: $(a+b)^{2} = 5^{2} = 25$. Ako se računa samo $a^{2} + b^{2} = 9 + 4 = 13$, izostaje dvostruki proizvod $2ab = 12$.', 'površina',
    { mediji: G(O, [pravougaonik(0, 0, 5, 5, 1, { id: 'k' }), { tx: 'a', at: [1.5, -0.6], vel: 20 }, { tx: 'b', at: [3.9, -0.6], vel: 20 }, { tx: 'a', at: [5.6, 4], vel: 20 }, { tx: 'b', at: [5.6, 1.5], vel: 20 }], { ...bez, velicina: 300 }),
      medijiOdgovora: G(O, [
        pravougaonik(0, 0, 3, 3, 4), pravougaonik(3, 0, 2, 3, 2), pravougaonik(0, 3, 3, 2, 3), pravougaonik(3, 3, 2, 2, 5),
        { tx: '9', at: [1.5, 1.5], vel: 18, b: 5 }, { tx: '6', at: [4, 1.5], vel: 18, b: 5 }, { tx: '6', at: [1.5, 4], vel: 18, b: 5 }, { tx: '4', at: [4, 4], vel: 18, b: 5 },
      ], { ...bez, velicina: 300 }) });
  Q(3, 'Kolika je vrednost $(x + 3)^{2}$ za $x = 1$?',
    ['16', '10', '13', '12'],
    '$(1 + 3)^{2} = 4^{2} = 16$. Greška je računati $1^{2} + 3^{2} = 10$, jer se zaboravlja dvostruki proizvod $2 \\cdot 1 \\cdot 3 = 6$.', 'zagrada',
    { mediji: G(O, [pravougaonik(0, 0, 4, 4, 1), { tx: 'x + 3', at: [2, -0.6], vel: 20 }, { tx: 'x + 3', at: [4.6, 2], vel: 20 }], { ...bez, velicina: 260 }), medijiOdgovora: { vrsta: 'formula', tekst: '$(1+3)^{2}=16$, a $1^{2}+3^{2}=10$ nije tačno' } });
  Q(2, 'Koji je tačan razvoj izraza $(x - 4)^{2}$?',
    ['$x^{2} - 8x + 16$', '$x^{2} - 16$', '$x^{2} - 8x - 16$', '$x^{2} + 8x + 16$'],
    'Kvadrat razlike: $x^{2} - 2 \\cdot x \\cdot 4 + 4^{2} = x^{2} - 8x + 16$. Minus ulazi samo u srednji član, a slobodan član je $4^{2} = 16$, uvek pozitivan.', 'razlika',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(x-4)^{2}=x^{2}-8x+16$' } });
  Q(3, 'Koji je tačan razvoj izraza $(2a + 1)^{2}$?',
    ['$4a^{2} + 4a + 1$', '$4a^{2} + 1$', '$2a^{2} + 4a + 1$', '$4a^{2} + 2a + 1$'],
    '$(2a)^{2} = 4a^{2}$, srednji član je $2 \\cdot 2a \\cdot 1 = 4a$, a poslednji $1^{2} = 1$. Najčešća greška je izostaviti srednji član $4a$.', 'kvadrat',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(2a+1)^{2}=4a^{2}+4a+1$' } });
  U(2, 'Koji izraz NIJE jednak $(a + b)^{2}$?',
    ['$a^{2} + b^{2}$', '$a^{2} + 2ab + b^{2}$', '$(a + b)(a + b)$', '$(b + a)^{2}$'],
    'Izraz $a^{2} + b^{2}$ izostavlja dvostruki proizvod $2ab$. Ostali su jednaki: $(a+b)(a+b)$ i $(b+a)^{2}$ su isti proizvod, a $a^{2}+2ab+b^{2}$ je razvijen oblik.',
    'Kvadrat zbira nije zbir kvadrata: to je najčešća greška u ovoj lekciji.', 'kvadrat');
  Q(1, 'Koji je rezultat $(a - b)(a + b)$?',
    ['$a^{2} - b^{2}$', '$a^{2} + b^{2}$', '$a^{2} + 2ab + b^{2}$', '$a^{2} - 2ab + b^{2}$'],
    'Množenjem zbira i razlike dobija se razlika kvadrata: srednji članovi $ab$ i $-ab$ se poništavaju, pa ostaje $a^{2} - b^{2}$. Ovo je formula za razliku kvadrata.', 'razlika',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(a-b)(a+b)=a^{2}-b^{2}$' } });
  Q(3, 'Koliko je $(x - 3)(x + 3)$?',
    ['$x^{2} - 9$', '$x^{2} - 6$', '$x^{2} + 9$', '$x^{2} - 6x + 9$'],
    'Razlika kvadrata: $x^{2} - 3^{2} = x^{2} - 9$. Članovi $3x$ i $-3x$ se poništavaju. Ako bi se pomnožilo kao kvadrat binoma, dobio bi se pogrešan izraz $x^{2} - 6x + 9$.', 'razlika',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(x-3)(x+3)=x^{2}-9$' } });
  Q(3, 'Koliko je $73^{2}$ napamet?',
    ['5329', '4900', '5309', '5929'],
    '$73 = 70 + 3$, pa je $73^{2} = 70^{2} + 2 \\cdot 70 \\cdot 3 + 3^{2} = 4900 + 420 + 9 = 5329$. Ako se zaboravi srednji član, dobija se $4909$, a ne $5329$.', 'trik',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(70+3)^{2}=4900+420+9=5329$' } });
  Q(2, 'Kvadrat stranice $a$ ima iz njega izrezan mali kvadrat stranice $b$ (crtež). Koji izraz daje površinu ostatka?',
    ['$a^{2} - b^{2}$', '$a^{2} + b^{2}$', '$(a - b)^{2}$', '$2ab$'],
    'Površina ostatka je celi kvadrat minus izrezani: $a^{2} - b^{2}$. Ako se ostatak preslaže u pravougaonik $(a - b)(a + b)$, dobija se ista površina.', 'razlika',
    { mediji: G(O, [{ lin: [[0, 0], [5, 0], [5, 3], [3, 3], [3, 5], [0, 5]], zatv: 1, b: 1, gusto: 1 }, { tx: 'a', at: [2.5, -0.6], vel: 20 }, { tx: 'a', at: [-0.6, 2.5], vel: 20 }], { ...bez, velicina: 300 }),
      medijiOdgovora: { vrsta: 'formula', tekst: '$a^{2}-b^{2}=(a-b)(a+b)$' } });
  S(2, 'Spoji izraz sa nazivom:',
    [['$(a+b)^{2}$', 'kvadrat zbira'], ['$(a-b)^{2}$', 'kvadrat razlike'], ['$a^{2}-b^{2}$', 'razlika'], ['$(a+b)(a-b)$', 'proizvod zbira i razlike']],
    'Ova četiri izraza su osnovne formule iz ove lekcije. Zapamti da kvadrat zbira i kvadrat razlike imaju srednji član $2ab$, dok razlika kvadrata nema srednji član.', 'formula');


  const mreza = (x0, n) => Array.from({ length: n * n }, (_, k) => pravougaonik(x0 + (k % n), Math.floor(k / n), 1, 1, 1));
  Q(2, 'Kvadrat ima stranicu $a + b$ (crtež). Kolika mu je površina za $a = 2$ i $b = 1$?',
    ['$9$', '$5$', '$6$', '$4$'],
    'Stranica je $2 + 1 = 3$, pa je površina $3^{2} = 9$. Ako bi se računalo $a^{2} + b^{2} = 5$, izostao bi dvostruki proizvod $2ab = 4$.', 'kvadrat',
    { mediji: G(O, [kvadrat(0, 0, 5, 1), { tx: 'a + b', at: [2.5, -0.6], vel: 20 }, { tx: 'a + b', at: [5.6, 2.5], vel: 20 }], { ...bez, velicina: 300 }) });
  Q(2, 'Iz kvadrata stranice $a$ odsečen je mali kvadrat stranice $b$ u uglu (crtež). Koje su stranice pravougaonika koji dobijemo preslagivanjem ostatka?',
    ['$a - b$ i $a + b$', '$a$ i $b$', '$a + b$ i $a + b$', '$a - b$ i $a - b$'],
    'Ostatak se preseče i preslaže u pravougaonik sa stranicama $a - b$ i $a + b$. Površina ostaje ista: $(a - b)(a + b) = a^{2} - b^{2}$.', 'ostatak',
    { mediji: G(O, [{ lin: [[0, 0], [5, 0], [5, 3], [3, 3], [3, 5], [0, 5]], zatv: 1, b: 1, gusto: 1 }, { tx: 'a', at: [2.5, -0.6], vel: 20 }, { tx: 'a', at: [-0.6, 2.5], vel: 20 }], { ...bez, velicina: 300 }) });
  Q(2, 'Na crtežu su prva tri kvadrata od kockica (1, 4, 9). Koliko kockica ima n-ti kvadrat?',
    ['$n^{2}$', '$2n$', '$n + 1$', '$2n + 1$'],
    'Brojevi $1, 4, 9$ su $1^{2}, 2^{2}, 3^{2}$, pa n-ti kvadrat ima $n^{2}$ kockica. Izraz $2n + 1$ bi dao 3, 5, 7, što je niz razlika, a ne kvadrata.', 'kvadrati',
    { mediji: G(O, [...mreza(0, 1), ...mreza(2, 2), ...mreza(5, 3)], { ...bez, velicina: 300 }) });
  Q(2, 'Pravougaonik ima stranice $a + b$ i $a - b$ (crtež). Kolika mu je površina?',
    ['$a^{2} - b^{2}$', '$a^{2} + b^{2}$', '$a^{2} - 2ab + b^{2}$', '$2a$'],
    'Površina je $(a + b)(a - b) = a^{2} - b^{2}$, to je razlika kvadrata. Izraz $a^{2} - 2ab + b^{2}$ je kvadrat razlike i ne važi za ovaj pravougaonik.', 'razlika',
    { mediji: G(O, [pravougaonik(0, 0, 5, 2, 1), { tx: 'a + b', at: [2.5, -0.6], vel: 20 }, { tx: 'a − b', at: [5.6, 1], vel: 20 }], { ...bez, velicina: 300 }) });

  // ── 24. rastavljanje polinoma na činioce ──
  L('Rastavljanje polinoma na činioce');
  Q(1, 'Šta znači rastaviti polinom na činioce?',
    ['Napisati ga kao proizvod polinoma', 'Napisati ga kao zbir monoma', 'Podeliti ga nekim brojem', 'Naći mu stepen'],
    'Rastaviti na činioce znači zapisati izraz kao proizvod (množenje) jednostavnijih izraza. Proizvod je obrnuto od razvijanja zagrada: $x(x+2) = x^{2}+2x$ razvijeno, a $x^{2}+2x = x(x+2)$ rastavljeno.', 'proizvod',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$x^{2}+2x=x\\cdot(x+2)$' } });
  Q(3, 'Rastavi $4a^{2} - 25$ na činioce.',
    ['$(2a - 5)(2a + 5)$', '$(4a - 5)(a + 5)$', '$(2a - 5)^{2}$', '$(4a - 5)(4a + 5)$'],
    '$4a^{2} = (2a)^{2}$ i $25 = 5^{2}$, pa je razlika kvadrata $(2a - 5)(2a + 5)$. Ako bi se pisalo $(4a-5)(4a+5)$, dobilo bi se $16a^{2}-25$.', 'razlika',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$4a^{2}-25=(2a)^{2}-5^{2}=(2a-5)(2a+5)$' } });
  Q(3, 'Rastavi $x^{2} + 5x + 6$ na činioce.',
    ['$(x + 2)(x + 3)$', '$(x + 1)(x + 6)$', '$(x - 2)(x - 3)$', '$(x + 5)(x + 1)$'],
    'Treba dva broja čiji je zbir 5, a proizvod 6: to su 2 i 3. Zato je $(x + 2)(x + 3)$. Provera: $x \\cdot x + 2x + 3x + 6 = x^{2} + 5x + 6$.', 'činilac',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$2+3=5$, $2\\cdot3=6$, pa $x^{2}+5x+6=(x+2)(x+3)$' } });
  // pravougaonik stranica x + 2 i x + 1 podeljen na x², 2x, x i 2
  Q(2, 'Pravougaonik na crtežu ima stranice $x + 2$ i $x + 1$. Koji polinom je njegova površina?',
    ['$x^{2} + 3x + 2$', '$x^{2} + 2x + 1$', '$x^{2} + 3x + 3$', '$x^{2} + 2x + 2$'],
    'Površina je proizvod stranica: $(x+2)(x+1)$. Množenjem svaki sa svakim dobija se $x^{2} + x + 2x + 2 = x^{2} + 3x + 2$. Rastavljanje ide obrnuto, od $x^{2} + 3x + 2$ do $(x+1)(x+2)$.', 'stranice',
    { mediji: G(O, [pravougaonik(0, 0, 4, 3, 1), { tx: 'x + 2', at: [2, -0.6], vel: 20 }, { tx: 'x + 1', at: [4.6, 1.5], vel: 20 }], { ...bez, velicina: 300 }),
      medijiOdgovora: G(O, [
        pravougaonik(0, 0, 2, 2, 4), pravougaonik(2, 0, 2, 2, 2), pravougaonik(0, 2, 2, 1, 3), pravougaonik(2, 2, 2, 1, 5),
        { tx: 'x²', at: [1, 1], vel: 18, b: 5 }, { tx: '2x', at: [3, 1], vel: 18, b: 5 }, { tx: 'x', at: [1, 2.5], vel: 18, b: 5 }, { tx: '2', at: [3, 2.5], vel: 18, b: 5 },
      ], { ...bez, velicina: 300 }) });
  U(2, 'Koji od ovih izraza NIJE rastavljen na činioce (nije proizvod)?',
    ['$x^{2} - 4$', '$3(x + 1)$', '$2a(b - 1)$', '$(x + 5)(x - 1)$'],
    '$x^{2} - 4$ je zbir (razlika) članova, a ne proizvod. Ostali su proizvodi činilaca. Ipak, $x^{2}-4$ se može rastaviti: $(x-2)(x+2)$.',
    'Izraz može biti rastavljen tek kad se zapiše kao proizvod, pa je ovo pitanje o tome da li je već rastavljen.', 'proizvod');
  Q(3, 'Rastavi $x^{4} - 16$ na činioce do kraja.',
    ['$(x - 2)(x + 2)(x^{2} + 4)$', '$(x - 4)(x + 4)$', '$(x^{2} - 4)^{2}$', '$(x - 2)^{2}(x + 2)^{2}$'],
    'Prvo $x^{4} - 16 = (x^{2})^{2} - 4^{2} = (x^{2} - 4)(x^{2} + 4)$, a zatim $x^{2} - 4 = (x - 2)(x + 2)$. Zbir $x^{2}+4$ se ne može dalje rastaviti na realne činioce.', 'razlika',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$x^{4}-16=(x-2)(x+2)(x^{2}+4)$' } });
  Q(3, 'Koja su rešenja jednačine $x^{2} - 9 = 0$?',
    ['$x = 3$ i $x = -3$', '$x = 9$', '$x = 3$ samo', '$x = 0$ i $x = 9$'],
    'Rastavljanjem: $(x-3)(x+3) = 0$, pa je $x = 3$ ili $x = -3$. Oba su rešenja, jer je $3^{2} = (-3)^{2} = 9$.', 'rešenje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(x-3)(x+3)=0 \\Rightarrow x=3$ ili $x=-3$' } });
  Q(3, 'Koja su rešenja jednačine $x(x - 4) = 0$?',
    ['$x = 0$ i $x = 4$', '$x = 4$ samo', '$x = -4$ i $x = 0$', '$x = 0$ samo'],
    'Proizvod je nula kad je bar jedan činilac nula: $x = 0$ ili $x - 4 = 0$, pa je $x = 4$. Oba rešenja važe.', 'rešenje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$x(x-4)=0 \\Rightarrow x=0$ ili $x=4$' } });
  S(2, 'Spoji polinom sa njegovim rastavljenim oblikom:',
    [['$x^{2} - 1$', '$(x - 1)(x + 1)$'], ['$x^{2} + 2x$', '$x(x + 2)$'], ['$2x + 4$', '$2(x + 2)$'], ['$x^{2} - 4x + 4$', '$(x - 2)^{2}$']],
    'Za svaki par se proverava razvijanjem: $(x-1)(x+1)=x^{2}-1$, $x(x+2)=x^{2}+2x$, $2(x+2)=2x+4$, $(x-2)^{2}=x^{2}-4x+4$.', 'faktori');

  Q(2, 'Površina pravougaonika je $x^{2} + 4x + 3$, a stranice nisu date (crtež). Koje su stranice?',
    ['$x + 1$ i $x + 3$', '$x + 2$ i $x + 2$', '$x + 3$ i $x + 3$', '$x + 1$ i $x + 2$'],
    'Rastavljanjem: $x^{2} + 4x + 3 = (x + 1)(x + 3)$, jer je zbir brojeva 4, a njihov proizvod 3. Provera: $(x+1)(x+3) = x^{2} + 4x + 3$.', 'stranice',
    { mediji: G(O, [pravougaonik(0, 0, 4, 3, 1), { tx: '?', at: [2, -0.6], vel: 20 }, { tx: '?', at: [4.6, 1.5], vel: 20 }], { ...bez, velicina: 300 }) });
  Q(2, 'Pločice $x^{2}$, $x$, $2x$ i $2$ slažu se u pravougaonik (crtež). Koje su stranice?',
    ['$x + 1$ i $x + 2$', '$x + 2$ i $x + 2$', '$x + 1$ i $x + 3$', '$x + 3$ i $x + 2$'],
    'Stranice su $x + 1$ i $x + 2$, jer je $(x + 1)(x + 2) = x^{2} + 3x + 2$. Pločice se slažu tako da se stranice ne vide direktno, nego se broje.', 'pločice',
    { mediji: G(O, [...plocica(0, 0, 'x²', 1, { w: 2, h: 2 }), ...plocica(0, 2, 'x', 2, { w: 2, h: 1 }), ...plocica(2, 0, '2x', 3, { w: 2, h: 2 }), ...plocica(2, 2, '2', 4, { w: 2, h: 1 })], { ...bez, velicina: 300 }) });
  Q(3, 'Kvadrat stranice $x$ ima odsečen kvadrat stranice $3$ u uglu (crtež). Koje su stranice pravougaonika koji dobijemo preslagivanjem ostatka?',
    ['$x - 3$ i $x + 3$', '$x - 3$ i $x - 3$', '$x + 3$ i $x + 3$', '$x$ i $3$'],
    'Površina ostatka je $x^{2} - 9 = (x - 3)(x + 3)$, pa su stranice $x - 3$ i $x + 3$. To je ista formula za razliku kvadrata.', 'ostatak',
    { mediji: G(O, [{ lin: [[0, 0], [5, 0], [5, 2], [2, 2], [2, 5], [0, 5]], zatv: 1, b: 1, gusto: 1 }, { tx: 'x', at: [2.5, -0.6], vel: 20 }, { tx: 'x', at: [-0.6, 2.5], vel: 20 }, { tx: '3', at: [3.6, 3.6], vel: 18 }], { ...bez, velicina: 300 }) });
  Q(2, 'Kvadrat ima površinu $x^{2} + 6x + 9$ (crtež, stranica nije data). Kolika mu je stranica?',
    ['$x + 3$', '$x + 6$', '$x + 9$', '$x - 3$'],
    'Površina kvadrata je stranica na kvadrat, pa je $x^{2} + 6x + 9 = (x + 3)^{2}$, a stranica je $x + 3$.', 'stranica',
    { mediji: G(O, [kvadrat(0, 0, 4, 1), { tx: '?', at: [2, -0.6], vel: 20 }, { tx: '?', at: [4.6, 2], vel: 20 }], { ...bez, velicina: 300 }) });
  Q(2, 'Kvadrat je složen od pločica $x^{2}$, dve pločice $2x$ i pločice $4$ (crtež). Koja mu je stranica?',
    ['$x + 2$', '$x + 4$', '$2x + 2$', '$x^{2} + 2$'],
    'Pločice se slažu u kvadrat stranice $x + 2$, jer je $(x + 2)^{2} = x^{2} + 4x + 4$. Konstantni deo $4$ je $2 \\cdot 2$.', 'kvadrat',
    { mediji: G(O, [...plocica(0, 0, 'x²', 1, { w: 2, h: 2 }), ...plocica(0, 2, '2x', 2, { w: 2, h: 2 }), ...plocica(2, 0, '2x', 2, { w: 2, h: 2 }), ...plocica(2, 2, '4', 3, { w: 2, h: 2 })], { ...bez, velicina: 300 }) });
  Q(3, 'Pravougaonik ima površinu $x^{2} + x - 2$ (crtež, stranice nisu date). Koje su stranice?',
    ['$x - 1$ i $x + 2$', '$x + 1$ i $x - 2$', '$x - 2$ i $x - 1$', '$x + 2$ i $x + 2$'],
    'Rastavljanje: $x^{2} + x - 2 = (x - 1)(x + 2)$, jer je zbir $-1 + 2 = 1$, a proizvod $-2$. Provera: $x^{2} + 2x - x - 2 = x^{2} + x - 2$.', 'stranice',
    { mediji: G(O, [pravougaonik(0, 0, 4, 3, 1), { tx: '?', at: [2, -0.6], vel: 20 }, { tx: '?', at: [4.6, 1.5], vel: 20 }], { ...bez, velicina: 300 }) });
  Q(2, 'Pravougaonik je podeljen na dva dela: prvi ima širinu $a$, drugi širinu $b$, a visina je $x$ (crtež, visina nije označena). Koji je zajednički činilac površine $ax + bx$?',
    ['$x$', '$a$', '$b$', '$a + b$'],
    'Visina $x$ je zajednička za oba dela, pa je $ax + bx = x(a + b)$. Zajednički činilac je $x$.', 'činilac',
    { mediji: G(O, [pravougaonik(0, 0, 2, 2, 1), pravougaonik(2, 0, 1.5, 2, 2), { tx: 'a', at: [1, -0.6], vel: 20 }, { tx: 'b', at: [2.75, -0.6], vel: 20 }], { ...bez, velicina: 300 }) });

};
