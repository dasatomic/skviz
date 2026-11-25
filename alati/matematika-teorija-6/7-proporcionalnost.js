// Lekcije 28–32: koordinatni sistem, zavisnosti među veličinama, direktna i obrnuta proporcionalnost,
// razmera i proporcija. Pitanja su sopstvenim rečima, po gradivu Matematike 6 (Arhiknjiga); sve „u glavi“.
// Crteži (koordinatna ravan, tabele, grafikoni, trake razmere, razmernik) su iz alati/zadaci-6/7-proporcionalnost.js.
const { crtezi } = require('../zadaci-6/7-proporcionalnost');

module.exports = (A) => {
  const { L, Q, U, S, G, O, bez, r, proveri } = A;
  const { ravan, tabela, grafikon, linija, tackasti, hiperbola, trakaDelova, razmernik, unakrsno, nedelja } = crtezi(A);
  const jed = (a, b) => Math.abs(a - b) < 1e-9;
  const formula = (tekst) => ({ vrsta: 'formula', tekst });

  // ══════════ 28. Koordinatni sistem i prikaz tačaka ══════════
  L('Koordinatni sistem i prikaz tačaka');
  Q(1, 'Kako se zove vodoravna osa koordinatnog sistema?',
    ['Apscisna osa ($x$-osa)', 'Ordinatna osa ($y$-osa)', 'Koordinatni početak', 'Brojevna poluprava'],
    'Uspravna osa je ordinatna ($y$-osa). Reči apscisa i ordinata potiču iz latinskog: „abscissa“ znači „odsečena“, a „ordinata“ – „uređena“.', 'apscisa',
    { mediji: ravan([-4, 4, -3, 3], {}, { ose: ['?', 'y'] }) });
  Q(1, 'Koje su koordinate tačke $A$ sa slike?',
    ['$(3, 2)$', '$(2, 3)$', '$(3, −2)$', '$(−3, 2)$'],
    'Prvo se piše apscisa (koliko desno ili levo), pa ordinata (koliko gore ili dole). Zato je $(3, 2)$ sasvim druga tačka od $(2, 3)$.', 'koordinata',
    { mediji: ravan([-4, 4, -3, 3], { A: [3, 2] }), medijiOdgovora: ravan([-4, 4, -3, 3], { A: [3, 2] }, { projekcije: ['A'] }) });
  Q(1, 'Kako se zove tačka u kojoj se seku koordinatne ose?',
    ['Koordinatni početak', 'Jedinična tačka', 'Teme', 'Središte kvadranta'],
    'Koordinatni početak se obeležava slovom $O$ i ima koordinate $(0, 0)$. Od njega se meri koliko je svaka tačka levo, desno, gore ili dole.', 'početak',
    { mediji: G({ O: [0, 0] }, [{ mreza: [-4, 4, -3, 3], ose: ['x', 'y'] }, { tacka: 'O', b: 2 }, { tx: '?', at: [0.6, 0.6], b: 2, vel: 22 }], { bezImena: ['O'], velicina: 240 }) });
  Q(1, 'Po kom matematičaru se pravougli koordinatni sistem zove Dekartov?',
    ['Po Reneu Dekartu', 'Po Pjeru Fermau', 'Po Isaku Njutnu', 'Po Blezu Paskalu'],
    'Rene Dekart (1596–1650) je bio francuski filozof i matematičar. Na latinskom se zvao Cartesius, pa se koordinatni sistem zove i kartezijanski. Legenda kaže da je ideju dobio posmatrajući muvu na plafonu.', 'Dekart',
    { mediji: ravan([-4, 4, -3, 3], { A: [-2, 2], B: [3, -1] }) });
  Q(1, 'U kom kvadrantu se nalazi tačka $(−4, 3)$?',
    ['II kvadrant', 'I kvadrant', 'III kvadrant', 'IV kvadrant'],
    'Kvadranti se broje rimskim brojevima suprotno od kazaljke na satu, počev od gornjeg desnog. Za tačke II kvadranta apscisa je negativna, a ordinata pozitivna.', 'kvadrant',
    { mediji: ravan([-5, 5, -4, 4], {}, { kvadranti: true }), medijiOdgovora: ravan([-5, 5, -4, 4], { T: [-4, 3] }, { kvadranti: true, projekcije: ['T'] }) });
  Q(2, 'Kolika je ordinata svake tačke koja leži na $x$-osi?',
    ['$0$', '$1$', 'Jednaka je apscisi', 'Može biti bilo koja'],
    'Tačka na $x$-osi nije ni iznad ni ispod ose, pa joj je ordinata $0$: zapis je $(a, 0)$. Slično, tačka na $y$-osi ima zapis $(0, b)$.', 'ordinata',
    { mediji: G({ O: [0, 0], P: [-3, 0], Q: [2, 0], R: [4, 0] }, [{ mreza: [-4, 5, -3, 3], ose: ['x', 'y'] }, { tacka: 'PQR', b: 1 }], { bezImena: ['O'], velicina: 250 }) });
  Q(2, 'Koja tačka je simetrična tački $A(2, 3)$ u odnosu na $x$-osu?',
    ['$(2, −3)$', '$(−2, 3)$', '$(−2, −3)$', '$(3, 2)$'],
    'Kod osne simetrije u odnosu na $x$-osu apscisa ostaje ista, a ordinata menja znak – kao odraz u ogledalu jezera.', 'simetrija',
    { mediji: G({ O: [0, 0], A: [2, 3], M: [-4, 0], N: [4, 0] }, [{ mreza: [-4, 4, -4, 4], ose: ['x', 'y'] }, { d: 'MN', b: 2, debljina: 4 }, { tacka: 'A', b: 1 }], { bezImena: ['O', 'M', 'N'], velicina: 240 }),
      medijiOdgovora: G({ O: [0, 0], A: [2, 3], B: [2, -3] }, [{ mreza: [-4, 4, -4, 4], ose: ['x', 'y'] }, { tacka: 'A', b: 1 }, { tacka: 'B', b: 2 }, { d: 'AB', isp: 1, b: 3 }, { tx: "A′", at: [2.6, -3.1], b: 2 }], { bezImena: ['O', 'B'], velicina: 240 }) });
  Q(2, 'Koja tačka je simetrična tački $(−3, 1)$ u odnosu na $y$-osu?',
    ['$(3, 1)$', '$(−3, −1)$', '$(3, −1)$', '$(1, −3)$'],
    'Pri simetriji u odnosu na $y$-osu menja se samo znak apscise. Tačke $(−a, b)$ i $(a, b)$ su na istoj visini, sa dve strane $y$-ose.', 'simetrija',
    { mediji: G({ O: [0, 0], A: [-3, 1], M: [0, -2], N: [0, 3] }, [{ mreza: [-4, 4, -2, 3], ose: ['x', 'y'] }, { d: 'MN', b: 2, debljina: 4 }, { tacka: 'A', b: 1 }], { bezImena: ['O', 'M', 'N'], velicina: 240 }),
      medijiOdgovora: G({ O: [0, 0], A: [-3, 1], B: [3, 1] }, [{ mreza: [-4, 4, -2, 3], ose: ['x', 'y'] }, { tacka: 'A', b: 1 }, { tacka: 'B', b: 2 }, { d: 'AB', isp: 1, b: 3 }, { tx: "A′", at: [3.5, 1.4], b: 2 }], { bezImena: ['O', 'B'], velicina: 240 }) });
  Q(2, 'Koja tačka je centralno simetrična tački $(4, −1)$ u odnosu na koordinatni početak?',
    ['$(−4, 1)$', '$(4, 1)$', '$(−4, −1)$', '$(1, −4)$'],
    'Pri centralnoj simetriji u odnosu na $O$ obe koordinate menjaju znak. Isto se dobija ako tačku prvo odrazimo preko $x$-ose, pa preko $y$-ose.', 'centralna',
    { mediji: ravan([-5, 5, -3, 3], { A: [4, -1] }), medijiOdgovora: G({ O: [0, 0], A: [4, -1], B: [-4, 1] }, [{ mreza: [-5, 5, -3, 3], ose: ['x', 'y'] }, { tacka: 'A', b: 1 }, { tacka: 'B', b: 2 }, { d: 'AB', isp: 1, b: 3 }, { tacka: 'O', b: 3 }], { bezImena: ['O', 'B'], velicina: 250 }) });
  proveri(4 - -2 === 6, 'rastojanje −2 i 4');
  Q(2, 'Koliko je rastojanje između tačaka $A$ i $B$ sa slike?',
    ['$6$', '$2$', '$3$', '$−6$'],
    'Tačke imaju istu ordinatu, pa je rastojanje razlika apscisa bez znaka: $|4 − (−2)| = 6$. Rastojanje nikad nije negativno.', 'rastojanje',
    { mediji: ravan([-4, 5, -2, 4], { A: [-2, 3], B: [4, 3] }), medijiOdgovora: G({ O: [0, 0], A: [-2, 3], B: [4, 3] }, [{ mreza: [-4, 5, -2, 4], ose: ['x', 'y'] }, { tacka: 'AB', b: 1 }, { d: 'AB', b: 2, o: '6' }], { bezImena: ['O'], velicina: 260 }) });
  Q(2, 'U kom kvadrantu su obe koordinate tačaka negativne?',
    ['III kvadrant', 'I kvadrant', 'II kvadrant', 'IV kvadrant'],
    'Znaci koordinata po kvadrantima: I $(+, +)$, II $(−, +)$, III $(−, −)$, IV $(+, −)$.', 'kvadrant',
    { mediji: ravan([-5, 5, -4, 4], {}, { kvadranti: true }) });
  Q(3, 'Tačke $A(1, 1)$, $B(5, 1)$, $C(5, 4)$ i $D(1, 4)$ spojene redom daju:',
    ['Pravougaonik', 'Kvadrat', 'Romb', 'Trapez'],
    'Stranica $AB$ je duga $4$, a $BC$ je duga $3$; sve stranice su vodoravne ili uspravne, pa su uglovi pravi. Kvadrat bi imao sve četiri stranice jednake.', 'stranica',
    { mediji: ravan([0, 6, 0, 5], { A: [1, 1], B: [5, 1], C: [5, 4], D: [1, 4] }), medijiOdgovora: G({ O: [0, 0], A: [1, 1], B: [5, 1], C: [5, 4], D: [1, 4] }, [{ mreza: [0, 6, 0, 5], ose: ['x', 'y'] }, { p: 'ABCD', b: 2 }, { d: 'AB', o: '4' }, { d: 'BC', o: '3' }], { bezImena: ['O'], velicina: 250 }) });
  Q(3, 'Tačka $P$ je na $y$-osi, između III i IV kvadranta, na rastojanju $3$ od koordinatnog početka. Koje su njene koordinate?',
    ['$(0, −3)$', '$(−3, 0)$', '$(3, 0)$', '$(0, 3)$'],
    'Na $y$-osi je apscisa $0$. Granica III i IV kvadranta je donji deo $y$-ose, pa je ordinata negativna.', 'osa',
    { mediji: ravan([-4, 4, -4, 4], {}, { kvadranti: true }), medijiOdgovora: ravan([-4, 4, -4, 4], { P: [0, -3] }, { kvadranti: true }) });
  Q(3, 'Da li su tačke $(2, 5)$ i $(5, 2)$ ista tačka?',
    ['Ne – kod uređenog para redosled je važan', 'Da – imaju iste brojeve', 'Da – zbir koordinata im je isti', 'Ne – jedna je u II kvadrantu'],
    'Skupovi $\\{2, 5\\}$ i $\\{5, 2\\}$ su jednaki, ali uređeni parovi nisu. Tačke $(2, 5)$ i $(5, 2)$ su simetrične u odnosu na pravu $y = x$.', 'uređeni',
    { medijiOdgovora: G({ O: [0, 0], A: [2, 5], B: [5, 2], m: [0, 0], n: [6, 6] }, [{ mreza: [0, 6, 0, 6], ose: ['x', 'y'] }, { tacka: 'AB', b: 1 }, { d: 'mn', isp: 1, b: 4 }], { bezImena: ['O'], velicina: 240 }) });
  U(1, 'Koja tačka NIJE u II kvadrantu?',
    ['$(3, −2)$', '$(−1, 5)$', '$(−4, 2)$', '$(−0,5; 7)$'],
    'Tačka $(3, −2)$ ima pozitivnu apscisu i negativnu ordinatu – ona je u IV kvadrantu. Ostale imaju negativnu apscisu i pozitivnu ordinatu.',
    'Kad su koordinate decimalni brojevi, umesto zareza između njih piše se tačka-zarez: $(−0,5; 7)$.', 'kvadrant',
    { mediji: ravan([-5, 5, -4, 4], {}, { kvadranti: true }) });
  S(2, 'Spoji tačku sa mestom gde se nalazi.',
    [['$(−2, −5)$', 'III kvadrant'], ['$(3, 0)$', 'na $x$-osi'], ['$(0, −4)$', 'na $y$-osi'], ['$(1, 6)$', 'I kvadrant'], ['$(−7, 1)$', 'II kvadrant']],
    'Tačke na osama ne pripadaju nijednom kvadrantu. Koordinatni početak $(0, 0)$ je na obe ose.', 'kvadrant',
    { mediji: ravan([-5, 5, -4, 4], {}, { kvadranti: true }) });

  // ══════════ 29. Zavisnosti među veličinama ══════════
  L('Zavisnosti među veličinama');
  const vezba = [20, 40, 60, 95, 100, 120, 90];
  const dan = [[1, 9.1], [2, 10.3], [3, 12], [4, 13.6], [5, 15], [6, 15.6], [7, 15.2], [8, 13.9], [9, 12.4], [10, 10.8], [11, 9.4], [12, 8.8]];
  Q(1, 'Kada kažemo da su dve veličine zavisne?',
    ['Kada se promenom jedne menja i druga', 'Kada su uvek jednake', 'Kada imaju istu mernu jedinicu', 'Kada se obe izražavaju u metrima'],
    'Visina deteta zavisi od godina, a dužina dana od meseca u godini. Zavisnost možemo prikazati tabelom, histogramom, tačkastim dijagramom ili grafikonom.', 'zavisnost',
    { mediji: (() => { const g = grafikon({ x: [1, 12, 1], y: [8, 16, 2], W: 8, H: 4.5, ose: ['~mesec', '~h'] }); return g.crtez(linija(g, dan)); })() });
  Q(1, 'Histogram pokazuje koliko je minuta Sofija vežbala klavir. Kog dana je vežbala najviše?',
    ['U subotu', 'U nedelju', 'U petak', 'U četvrtak'],
    'Histogram je dijagram od stubića: što je stubić viši, to je veća vrednost. Odmah se vidi i najmanja vrednost – ponedeljak, samo $20$ minuta.', 'histogram',
    { mediji: nedelja(vezba) });
  Q(2, 'Prema istom histogramu, koliko je minuta Sofija vežbala u sredu?',
    ['$60$', '$40$', '$95$', '$80$'],
    'Vrh stubića se čita na uspravnoj osi. Treći stubić je sreda: dani idu redom od ponedeljka.', 'stubić',
    { mediji: nedelja(vezba) });
  {
    const g = grafikon({ x: [1, 5, 1], y: [0, 50, 10], W: 6, H: 5, ose: ['x', 'y'] });
    const t = [[1, 15], [2, 40], [3, 25], [4, 35], [5, 10]];
    Q(1, 'Kako se zove prikaz u kome su tačke iz tabele spojene dužima u izlomljenu liniju?',
      ['Grafikon', 'Tačkasti dijagram', 'Histogram', 'Tabela'],
      'Ako se tačke samo ucrtaju, dobija se tačkasti dijagram; kad se spoje dužima – grafikon. Grafikon lepo pokazuje kada vrednosti rastu, a kada opadaju.', 'grafikon',
      { mediji: g.crtez(tackasti(g, t)), medijiOdgovora: g.crtez(linija(g, t)) });
  }
  Q(2, 'Obim kvadrata $O$ zavisi od stranice $a$. Koji broj nedostaje u tabeli?',
    ['$20$', '$25$', '$9$', '$16$'],
    'Obim kvadrata je $O = 4a$. Obim raste jednako brzo kao stranica: dvostruko duža stranica daje dvostruko veći obim.', 'obim',
    { mediji: tabela([['a', 1, 2, 3, 5], ['O', 4, 8, 12, '?']], { istakni: ['1,4'] }) });
  const temp = [[6, 4], [8, 7], [10, 12], [12, 17], [14, 19], [16, 16], [18, 12], [20, 9]];
  {
    const g = grafikon({ x: [6, 20, 2], y: [0, 20, 5], W: 8, H: 5, ose: ['~h', '°C'] });
    Q(2, 'Grafikon pokazuje temperaturu vazduha tokom dana. U koliko časova je bilo najtoplije?',
      ['Oko $14$ časova', 'Oko $12$ časova', 'Oko $16$ časova', 'Oko $20$ časova'],
      'Najtoplije obično nije u podne, kad je Sunce najviše, nego oko dva sata kasnije – tlo i vazduh se zagrevaju sa zakašnjenjem.', 'temperatura',
      { mediji: g.crtez(linija(g, temp)) });
    proveri(17 - 7 === 10, 'porast temperature 8 → 12 h');
    Q(2, 'Na istom grafikonu: za koliko je porasla temperatura od $8$ do $12$ časova?',
      ['$10 °C$', '$5 °C$', '$17 °C$', '$12 °C$'],
      'Kad je bilo $8$ h, temperatura je bila $7 °C$, a u $12$ h čak $17 °C$. Što je deo grafikona strmiji, to se temperatura brže menja.', 'porast',
      { mediji: g.crtez(linija(g, temp)), medijiOdgovora: g.crtez([...linija(g, temp), { lin: [[g.X(8), g.Y(7)], [g.X(12), g.Y(7)], [g.X(12), g.Y(17)]], isp: 1, b: 2, debljina: 3 }]) });
  }
  Q(1, 'Koja veličina se obično nanosi na vodoravnu $x$-osu grafikona?',
    ['Nezavisna veličina', 'Zavisna veličina', 'Uvek vreme', 'Uvek ona koja je veća'],
    'Na $x$-osu ide veličina od koje druga zavisi (na primer mesec), a na $y$-osu zavisna (na primer temperatura). Ponekad je izbor proizvoljan.', 'nezavisna',
    { mediji: grafikon({ x: [0, 5, 1], y: [0, 5, 1], W: 5, H: 4, ose: ['?', 'y'] }).crtez() });
  U(2, 'Koji par veličina NIJE zavisan?',
    ['Broj cipela i ocena iz matematike', 'Masa kupljenog sira i cena', 'Stranica kvadrata i njegov obim', 'Broj radnika i trajanje posla'],
    'Veličina stopala ne utiče na ocenu iz matematike. U ostalim parovima promena jedne veličine menja drugu.',
    'Čak i kad dve veličine rastu zajedno, ne znači da jedna izaziva drugu: leti raste i prodaja sladoleda i broj opekotina od sunca, a uzrok je treća veličina – vrućina.', 'zavisnost');
  proveri([1, 2, 3, 4].every((x, i) => 2 * x + 1 === [3, 5, 7, 9][i]), 'y = 2x + 1');
  Q(3, 'U tabeli je zavisnost $y$ od $x$. Koje pravilo važi?',
    ['$y = 2x + 1$', '$y = x + 2$', '$y = 3x$', '$y = 2x − 1$'],
    'Provera za svaku kolonu: $2 · 1 + 1 = 3$, $2 · 2 + 1 = 5$, $2 · 4 + 1 = 9$. Pravilo $y = x + 2$ važi samo za $x = 1$.', 'pravilo',
    { mediji: tabela([['x', 1, 2, 3, 4], ['y', 3, 5, 7, 9]]) });
  {
    const g = grafikon({ x: [1, 12, 1], y: [8, 16, 2], W: 8, H: 4.5, ose: ['~mesec', '~h'] });
    Q(2, 'Grafikon pokazuje koliko sati traje dan (od izlaska do zalaska Sunca) u Beogradu tokom godine. U kom mesecu su dani najduži?',
      ['U junu', 'U julu', 'U avgustu', 'U maju'],
      'Najduži dan u godini je oko 21. juna (letnja dugodnevica), a najkraći oko 21. decembra. U martu i septembru dan i noć traju podjednako, po oko $12$ sati.', 'dan',
      { mediji: g.crtez(linija(g, dan)) });
  }
  {
    const g = grafikon({ x: [0, 60, 10], y: [0, 30, 10], W: 7, H: 4.5, ose: ['s', 'm'] });
    Q(3, 'Grafikon pokazuje visinu lifta u zavisnosti od vremena. Šta znači vodoravni deo grafikona?',
      ['Lift stoji na jednom spratu', 'Lift se kreće najbrže', 'Lift se spušta', 'Lift je u prizemlju'],
      'Vodoravna linija znači da se visina ne menja dok vreme teče. Deo koji ide nadole bi značio spuštanje.', 'lift',
      { mediji: g.crtez(linija(g, [[0, 0], [20, 20], [40, 20], [60, 30]], { tacke: false })) });
  }
  S(1, 'Spoji način prikazivanja zavisnosti sa opisom.',
    [['Tabela', 'brojevi u redovima i kolonama'], ['Histogram', 'stubići različite visine'], ['Tačkasti dijagram', 'samo ucrtane tačke'], ['Grafikon', 'tačke spojene dužima']],
    'Isti podaci mogu se prikazati na sva četiri načina. Tabela daje tačne brojeve, a crteži bolje pokazuju kako se vrednosti menjaju.', 'dijagram',
    { mediji: nedelja(vezba) });
  {
    const g = grafikon({ x: [1, 7, 1], y: [0, 120, 20], W: 7, H: 5, ose: ['~dan', 'min'] });
    const t = vezba.map((v, i) => [i + 1, v]);
    Q(2, 'Tačkasti dijagram pokazuje Sofijino vežbanje po danima ($1$ = ponedeljak). Koliko dana je vežbala tačno $100$ minuta ili više?',
      ['$2$', '$3$', '$1$', '$4$'],
      'Tačke na visini $100$ i iznad su peti dan ($100$) i šesti dan ($120$). Četvrtak sa $95$ minuta je ispod te granice.', 'tačka',
      { mediji: g.crtez(tackasti(g, t)), medijiOdgovora: g.crtez([...tackasti(g, t), { lin: [[0, g.Y(100)], [7, g.Y(100)]], b: 2, debljina: 2.5, isp: 1 }]) });
  }
  proveri(jed(7.5 / 3, 2.5), '7,5 : 3');
  Q(3, 'Obim jednakostraničnog trougla zavisi od stranice $x$ po pravilu $O = 3x$. Kolika je stranica ako je obim $7,5$ cm?',
    ['$2,5$ cm', '$22,5$ cm', '$4,5$ cm', '$2,25$ cm'],
    'Iz $3x = 7,5$ dobija se $x = 7,5 : 3 = 2,5$. Ista tabela može da se čita i „unazad“ – od obima do stranice.', 'stranica',
    { mediji: tabela([['x', 1, 2, '?'], ['O', 3, 6, '7,5']], { istakni: ['0,3'] }) });

  // ══════════ 30. Direktna proporcionalnost ══════════
  L('Direktna proporcionalnost');
  Q(1, 'Veličine $x$ i $y$ su direktno proporcionalne ako postoji broj $k ≠ 0$ takav da je:',
    ['$y = k · x$', '$y = k + x$', '$x · y = k$', '$y = x − k$'],
    'Broj $k$ je koeficijent proporcionalnosti. Kad se $x$ poveća dva, tri ili deset puta, isto toliko puta se poveća i $y$.', 'koeficijent',
    { mediji: tabela([['x', 1, 2, 3, 4], ['y', 'k', '2k', '3k', '4k']]) });
  Q(1, 'Kako izgleda grafik direktne proporcionalnosti?',
    ['Prava koja prolazi kroz koordinatni početak', 'Kriva koja se približava osama', 'Prava koja ne prolazi kroz $O$', 'Izlomljena linija'],
    'Za $x = 0$ je uvek $y = k · 0 = 0$, pa grafik prolazi kroz $(0, 0)$. Kriva koja se približava osama je grafik obrnute proporcionalnosti.', 'prava',
    { medijiOdgovora: G({ O: [0, 0], A: [2, 3] }, [{ mreza: [-3, 4, -4, 5], ose: ['x', 'y'] }, { lin: [[-2.5, -3.75], [3, 4.5]], b: 1, debljina: 3 }, { tacka: 'O', b: 2 }], { bezImena: ['O', 'A'], velicina: 240 }) });
  proveri(150 * 3 === 450, '3 kg po 150');
  Q(1, 'Kilogram paradajza košta $150$ dinara. Koliko koštaju $3$ kilograma?',
    ['$450$ dinara', '$153$ dinara', '$300$ dinara', '$500$ dinara'],
    'Cena je direktno proporcionalna masi: $y = 150x$, gde je $k = 150$ cena jednog kilograma.', 'cena',
    { mediji: tabela([['kg', 1, 2, 3], ['~din', 150, 300, '?']], { istakni: ['1,3'] }) });
  proveri(5 / 2 === 2.5 && 10 / 4 === 2.5 && 15 / 6 === 2.5, 'k = 2,5');
  Q(2, 'Koliki je koeficijent proporcionalnosti za tabelu sa slike?',
    ['$2,5$', '$3$', '$0,4$', '$5$'],
    'Koeficijent je količnik $k = y : x$, isti za svaku kolonu: $5 : 2 = 10 : 4 = 15 : 6 = 2,5$. Broj $0,4$ je obrnuti količnik $x : y$.', 'količnik',
    { mediji: tabela([['x', 2, 4, 6], ['y', 5, 10, 15]]) });
  Q(2, 'U školi će u ponedeljak izostati $10 %$ đaka. Ako je $x$ broj đaka, a $y$ broj odsutnih, koliki je koeficijent proporcionalnosti?',
    ['$0,1$', '$10$', '$1,1$', '$0,9$'],
    'Deset procenata je ${10|100} = 0,1$, pa je $y = 0,1 · x$. Broj $0,9$ bi bio koeficijent za đake koji su došli.', 'procenat',
    { mediji: A.G(O, A.sto(10, { a: 0.5 }), { ...bez, velicina: 160 }) });
  Q(2, 'Prodavnica daje popust od $20 %$. Kojom formulom se iz stare cene $x$ dobija nova cena $y$?',
    ['$y = 0,8 · x$', '$y = 0,2 · x$', '$y = x − 20$', '$y = 1,2 · x$'],
    'Posle popusta od $20 %$ plaća se $80 %$ cene. Formula $y = x − 20$ bi oduzela $20$ dinara, a ne $20$ procenata.', 'popust',
    { mediji: trakaDelova([80, 20], { natpisi: ['?', '20 %'], boje: [2, 1] }), medijiOdgovora: trakaDelova([80, 20], { natpisi: ['80 %', '20 %'], ispod: ['~plaćamo', '~popust'], boje: [2, 1] }) });
  proveri(120 / 4 * 7 === 210, '4 olovke 120 → 7 olovki 210');
  Q(2, 'Četiri olovke koštaju $120$ dinara. Koliko košta $7$ takvih olovaka?',
    ['$210$ dinara', '$123$ dinara', '$840$ dinara', '$180$ dinara'],
    'Jedna olovka košta $120 : 4 = 30$ dinara, pa $7$ olovaka košta $7 · 30 = 210$ dinara. Takav račun „preko jedinice“ radi kod svake direktne proporcionalnosti.', 'olovka',
    { mediji: trakaDelova([1, 1, 1, 1], { natpisi: ['✏️', '✏️', '✏️', '✏️'], iznad: '120', boje: [3, 3, 3, 3] }) });
  Q(2, 'Grafik direktne proporcionalnosti prolazi kroz tačku $A$. Koliko je $y$ za $x = 4$?',
    ['$6$', '$5$', '$4$', '$9$'],
    'Kad se $x$ udvostruči (sa $2$ na $4$), udvostruči se i $y$ (sa $3$ na $6$). Koeficijent je $k = {3|2} = 1,5$.', 'grafik',
    { mediji: G({ O: [0, 0], A: [2, 3] }, [{ mreza: [-1, 5, -1, 7], ose: ['x', 'y'] }, { lin: [[-0.6, -0.9], [4.6, 6.9]], b: 1, debljina: 3 }, { tacka: 'A', b: 2 }, { lin: [[2, 0], [2, 3], [0, 3]], isp: 1, b: 3 }], { bezImena: ['O'], velicina: 240 }),
      medijiOdgovora: G({ O: [0, 0], A: [2, 3], B: [4, 6] }, [{ mreza: [-1, 5, -1, 7], ose: ['x', 'y'] }, { lin: [[-0.6, -0.9], [4.6, 6.9]], b: 1, debljina: 3 }, { tacka: 'AB', b: 2 }, { lin: [[4, 0], [4, 6], [0, 6]], isp: 1, b: 3 }], { bezImena: ['O'], velicina: 240 }) });
  proveri(360 / 9 === 40 && 4 * 40 === 160 && 5 * 40 === 200, '360 u odnosu 4 : 5');
  Q(3, 'Deca od $4$ i $5$ godina dele $360$ dinara direktno proporcionalno godinama. Koliko dobija mlađe dete?',
    ['$160$ dinara', '$200$ dinara', '$180$ dinara', '$90$ dinara'],
    'Novac se deli na $4 + 5 = 9$ jednakih delova od po $40$ dinara. Mlađe dete dobija $4$ dela, a starije $5$ delova, tj. $200$ dinara.', 'deo',
    { mediji: trakaDelova([4, 5], { natpisi: ['4', '5'], jedinicni: true, iznad: '360' }), medijiOdgovora: trakaDelova([4, 5], { natpisi: ['160', '200'], jedinicni: true, iznad: '360' }) });
  U(2, 'Koji par $(x, y)$ NE pripada direktnoj proporcionalnosti $y = 3x$?',
    ['$(4, 13)$', '$(2, 6)$', '$(5, 15)$', '$(−1, −3)$'],
    'Za $x = 4$ trebalo bi $y = 12$, a ne $13$. Kod ostalih parova je $y$ tačno tri puta veće od $x$.',
    'Tačke svih parova direktne proporcionalnosti leže na jednoj pravoj kroz koordinatni početak – tačka $(4, 13)$ bi „iskočila“ iz nje.', 'par');
  Q(1, 'Ako se kod direktno proporcionalnih veličina $x$ poveća $3$ puta, šta se dešava sa $y$?',
    ['Poveća se $3$ puta', 'Smanji se $3$ puta', 'Poveća se za $3$', 'Ostaje isto'],
    'Tri puta više kupljenih kifli – tri puta veći račun. Kod obrnute proporcionalnosti bi se $y$ smanjilo $3$ puta.', 'puta',
    { mediji: trakaDelova([1, 1, 1], { natpisi: ['🥐', '🥐🥐', '🥐🥐🥐'], boje: [3, 3, 3] }) });
  proveri(jed(7 / 0.35, 20), '35 % od 20 = 7');
  Q(3, 'Vrednost $y$ je $35 %$ vrednosti $x$. Koliko je $x$ ako je $y = 7$?',
    ['$20$', '$2,45$', '$24,5$', '$42$'],
    'Iz $0,35 · x = 7$ sledi $x = 7 : 0,35 = 700 : 35 = 20$. Provera: $35 %$ od $20$ je $7$.', 'procenat',
    { mediji: trakaDelova([35, 65], { natpisi: ['35 %', '65 %'], ispod: ['7', ''], iznad: '?', boje: [1, 4] }) });
  {
    const g = { mreza: [-4, 4, -4, 4], ose: ['x', 'y'] };
    Q(2, 'Koja od linija na slici prikazuje direktnu proporcionalnost?',
      ['Linija $a$', 'Linija $b$', 'Linija $c$', 'Nijedna'],
      'Samo prava $a$ prolazi kroz koordinatni početak. Prava $b$ je paralelna sa njom, ali za $x = 0$ daje $y = 2$, a $c$ uopšte nije prava.', 'linija',
      { mediji: G(O, [g, { lin: [[-2.5, -3.75], [2.5, 3.75]], b: 1, debljina: 3, o: 'a', oAt: [2.9, 3.6] }, { lin: [[-3.5, -3.25], [1.3, 3.95]], b: 2, debljina: 3, o: 'b', oAt: [0.7, 3.9] }, hiperbola(4, 1.1, 3.9, { b: 3, o: 'c', oAt: [3.8, 1.5] })], { ...bez, velicina: 250 }) });
  }
  S(2, 'Spoji situaciju sa koeficijentom direktne proporcionalnosti.',
    [['Kilogram jabuka košta $80$ dinara', '$80$'], ['Popust od $25 %$ (nova cena)', '$0,75$'], ['$10 %$ od broja', '$0,1$'], ['Obim kvadrata i stranica', '$4$']],
    'Koeficijent je uvek količnik zavisne i nezavisne veličine $k = {y|x}$ – koliko $y$ dolazi na jednu jedinicu $x$.', 'koeficijent');
  Q(3, 'Kroz koje kvadrante prolazi grafik $y = −2x$?',
    ['Kroz II i IV', 'Kroz I i III', 'Kroz I i II', 'Kroz III i IV'],
    'Kad je $x$ pozitivno, $y$ je negativno (IV kvadrant), a kad je $x$ negativno, $y$ je pozitivno (II kvadrant). Kod pozitivnog $k$ grafik prolazi kroz I i III kvadrant.', 'kvadrant',
    { mediji: ravan([-4, 4, -4, 4], {}, { kvadranti: true }), medijiOdgovora: G(O, [{ mreza: [-4, 4, -4, 4], ose: ['x', 'y'] }, { lin: [[-2, 4], [2, -4]], b: 1, debljina: 3 }], { ...bez, velicina: 240 }) });

  // ══════════ 31. Obrnuta proporcionalnost ══════════
  L('Obrnuta proporcionalnost');
  Q(1, 'Veličine $x$ i $y$ su obrnuto proporcionalne ako je stalan njihov:',
    ['Proizvod $x · y$', 'Zbir $x + y$', 'Količnik $y : x$', 'Razlika $y − x$'],
    'Ako je $x · y = k$, onda je $y = {k|x}$. Stalan količnik je osobina direktne proporcionalnosti.', 'proizvod',
    { mediji: tabela([['x', 1, 2, 4, 8], ['y', 8, 4, 2, 1]]) });
  Q(1, 'Goran ima $1 000$ dinara za sok. Litar košta $100$ dinara. Koliko litara može da kupi?',
    ['$10$', '$100$', '$900$', '$20$'],
    'Cena litra i broj litara su obrnuto proporcionalni: $x · y = 1 000$. Ako je sok dvostruko skuplji, dobije se upola manje.', 'litar',
    { mediji: tabela([['~din/l', 50, 100, 200], ['~litara', 20, '?', 5]], { istakni: ['1,2'], w: 1.8 }) });
  proveri(180 / 3 === 60, '180 : 3');
  Q(2, 'Jedna kosilica pokosi teren za $180$ minuta. Za koliko minuta isti teren pokose $3$ jednake kosilice?',
    ['$60$', '$540$', '$177$', '$90$'],
    'Tri kosilice rade tri puta brže, pa je vreme tri puta kraće. Broj mašina i vreme rada su obrnuto proporcionalni.', 'kosilica',
    { mediji: trakaDelova([1, 1, 1], { natpisi: ['🚜', '🚜', '🚜'], iznad: '180 min', boje: [2, 2, 2] }) });
  Q(2, 'Ako se kod obrnuto proporcionalnih veličina $x$ poveća $2$ puta, šta se dešava sa $y$?',
    ['Smanji se $2$ puta', 'Poveća se $2$ puta', 'Smanji se za $2$', 'Ostaje isto'],
    'Proizvod mora da ostane isti: ako se jedan činilac udvostruči, drugi se mora prepoloviti.', 'puta',
    { mediji: G(O, [{ lin: [[0, 0], [2, 0], [2, 4], [0, 4]], zatv: 1, b: 0, gusto: 1 }, { lin: [[3, 0], [7, 0], [7, 2], [3, 2]], zatv: 1, b: 1, gusto: 1 }, { tx: '2', at: [1, -0.6] }, { tx: '4', at: [-0.5, 2] }, { tx: '4', at: [5, -0.6] }, { tx: '?', at: [7.5, 1], b: 1 }], { ...bez, velicina: 260 }) });
  {
    const hip = G(O, [{ mreza: [0, 8, 0, 8], ose: ['x', 'y'] }, hiperbola(8, 1, 8)], { ...bez, velicina: 240 });
    Q(2, 'Kako izgleda grafik obrnute proporcionalnosti (za pozitivne $x$)?',
      ['Kriva koja se sve više približava osama', 'Prava kroz koordinatni početak', 'Vodoravna prava', 'Prava koja opada'],
      'Ta kriva se zove hiperbola. Ona nikad ne dodiruje ose: $y$ nikad ne postane $0$, a $x$ ne sme biti $0$, jer se nulom ne deli.', 'hiperbola',
      { medijiOdgovora: hip });
  }
  proveri(2 * 10 === 20 && 4 * 5 === 20 && 5 * 4 === 20, 'k = 20');
  Q(2, 'Koliki je koeficijent obrnute proporcionalnosti za tabelu?',
    ['$20$', '$5$', '$12$', '$2$'],
    'Proizvod $x · y$ je u svakoj koloni isti: $2 · 10 = 4 · 5 = 5 · 4 = 20$.', 'koeficijent',
    { mediji: tabela([['x', 2, 4, 5], ['y', 10, 5, 4]]) });
  proveri(4 * 3 / 6 === 2, 'torta 4 · 3 / 6');
  Q(2, 'Četiri učenika pojedu tortu za $3$ dana. Za koliko dana bi istu tortu pojelo $6$ učenika (isto brzo)?',
    ['$2$', '$4{1|2}$', '$1$', '$5$'],
    'Torta „traje“ $4 · 3 = 12$ učeničkih dana. Podeljeno na $6$ učenika: $2$ dana. Odgovor $4{1|2}$ dobija se pogrešnim, „direktnim“ računom.', 'torta',
    { mediji: trakaDelova([3, 3, 3, 3], { natpisi: ['🎂', '🎂', '🎂', '🎂'], ispod: ['3', '3', '3', '3'], jedinicni: true, boje: [1, 1, 1, 1] }) });
  proveri(jed(3 * 12 / 8, 4.5), '3 · 12 / 8');
  Q(3, 'Tri radnika oberu voćnjak za $12$ sati. Za koliko sati bi ga obralo $8$ radnika?',
    ['$4{1|2}$ sata', '$32$ sata', '$7$ sati', '$4$ sata'],
    'Posao traje $3 · 12 = 36$ radnih sati. Na $8$ radnika: $36 : 8 = 4,5$ sata. Više radnika – manje vremena, pa odgovor mora biti manji od $12$.', 'radnik',
    { mediji: trakaDelova([1, 1, 1], { natpisi: ['👷', '👷', '👷'], iznad: '12 h', boje: [3, 3, 3] }) });
  Q(3, 'Mića ima $100$ olovaka i deli ih na jednake delove sa još $3$ druga. Koliko olovaka dobija svako?',
    ['$25$', '$33$', '$97$', '$20$'],
    'Olovke se dele na $4$ osobe (Mića i $3$ druga), pa je $100 : 4 = 25$. Broj osoba i broj olovaka po osobi su obrnuto proporcionalni.', 'olovka',
    { mediji: trakaDelova([1, 1, 1, 1], { natpisi: ['🙂', '🙂', '🙂', '🙂'], iznad: '100', boje: [4, 4, 4, 4] }) });
  U(2, 'U kom paru veličine nisu obrnuto proporcionalne?',
    ['Pređeni put i vreme pri stalnoj brzini', 'Broj radnika i trajanje posla', 'Brzina i vreme za isti put', 'Cena komada i broj komada za isti novac'],
    'Pri stalnoj brzini, za dvostruko duže vreme pređe se dvostruko veći put – to je direktna proporcionalnost.',
    'Obrnuta proporcionalnost je svuda oko nas: što više slavina puni bazen, kraće se puni; što je duži korak, manje ih treba do škole.', 'brzina');
  proveri(24 / 6 === 4, 'pravougaonik 24');
  Q(2, 'Svi pravougaonici na slici imaju površinu $24$. Ako je jedna stranica $6$, kolika je druga?',
    ['$4$', '$18$', '$3$', '$6$'],
    'Kod iste površine stranice su obrnuto proporcionalne: $a · b = 24$. Zato pravougaonici mogu biti „dugi i niski“ ili „kratki i visoki“.', 'površina',
    { mediji: A.kvadratici(0, 13, 0, 9, [
      { lin: [[0, 0], [12, 0], [12, 2], [0, 2]], zatv: 1, b: 1 },
      { lin: [[0, 3], [8, 3], [8, 6], [0, 6]], zatv: 1, b: 2 },
      { lin: [[9, 3], [12, 3], [12, 11], [9, 11]], zatv: 1, b: 3 },
    ]) });
  proveri(60 * 2 / 80 === 1.5, '60 km/h 2 h → 80 km/h');
  Q(3, 'Automobil brzinom $60$ km/h pređe put za $2$ sata. Za koliko bi isti put prešao brzinom $80$ km/h?',
    ['$1,5$ sat', '$2,5$ sata', '$1$ sat', '$2{2|3}$ sata'],
    'Put je $60 · 2 = 120$ km, pa je vreme $120 : 80 = 1,5$ sat. Za isti put, brzina i vreme su obrnuto proporcionalni.', 'brzina',
    { medijiOdgovora: tabela([['km/h', 40, 60, 80, 120], ['h', 3, 2, '1,5', 1]], { istakni: ['1,3'] }) });
  Q(1, 'Brojevi $x$ i $y$ se uvek razlikuju za $5$. Da li su obrnuto proporcionalni?',
    ['Ne', 'Da', 'Samo ako je $x > 5$', 'Samo za cele brojeve'],
    'Obrnuta proporcionalnost traži stalan proizvod, a ne stalnu razliku. Na primer $6 · 1 = 6$, a $10 · 5 = 50$.', 'razlika',
    { mediji: tabela([['x', 6, 7, 10], ['y', 1, 2, 5]]) });
  S(2, 'Spoji formulu sa vrstom zavisnosti.',
    [['$x · y = 12$', 'obrnuta proporcionalnost'], ['$y = 12x$', 'direktna proporcionalnost'], ['$y = x + 12$', 'nisu proporcionalne']],
    'Formula $y = x + 12$ opisuje zavisnost, ali ni količnik ni proizvod nisu stalni, pa nije proporcionalnost.', 'formula');
  proveri(12 / 3 === 4, 'y = 12/x, x = 3');
  Q(3, 'Grafik obrnute proporcionalnosti prolazi kroz tačku $A(2, 6)$. Koliko je $y$ za $x = 3$?',
    ['$4$', '$9$', '$5$', '$7$'],
    'Koeficijent je $k = 2 · 6 = 12$, pa je $y = 12 : 3 = 4$. Proizvod koordinata je isti za svaku tačku hiperbole.', 'hiperbola',
    { mediji: G({ O: [0, 0], A: [2, 6] }, [{ mreza: [0, 8, 0, 8], ose: ['x', 'y'] }, hiperbola(12, 1.6, 8), { tacka: 'A', b: 2 }, { lin: [[2, 0], [2, 6], [0, 6]], isp: 1, b: 3 }, { lin: [[3, 0], [3, 7.5]], isp: 1, b: 4 }], { bezImena: ['O'], velicina: 240 }),
      medijiOdgovora: G({ O: [0, 0], A: [2, 6], B: [3, 4] }, [{ mreza: [0, 8, 0, 8], ose: ['x', 'y'] }, hiperbola(12, 1.6, 8), { tacka: 'AB', b: 2 }, { lin: [[3, 0], [3, 4], [0, 4]], isp: 1, b: 3 }], { bezImena: ['O'], velicina: 240 }) });

  // ══════════ 32. Razmera i proporcija ══════════
  L('Razmera i proporcija');
  Q(1, 'Patike dužine $20$ cm i $28$ cm su u razmeri $20 : 28$. Kako glasi ta razmera skraćena?',
    ['$5 : 7$', '$2 : 8$', '$10 : 18$', '$7 : 5$'],
    'Razmera je količnik, pa se skraćuje kao razlomak: obe strane delimo sa $4$. Redosled je važan – $7 : 5$ je razmera mamine i Sandrine patike.', 'razmera',
    { mediji: trakaDelova([20, 28], { natpisi: ['20 cm', '28 cm'], boje: [0, 1] }), medijiOdgovora: trakaDelova([5, 7], { jedinicni: true, natpisi: ['5', '7'], boje: [0, 1] }) });
  Q(1, 'Kako se zove jednakost dve razmere, na primer ${20|28} = {25|35}$?',
    ['Proporcija', 'Razmera', 'Jednačina prvog stepena', 'Koeficijent'],
    'Reč proporcija potiče od latinskog „proportio“ – srazmera. Proporcije su koristili i stari graditelji i slikari da bi delovi građevine ili tela bili skladni.', 'proporcija',
    { mediji: formula('20 : 28 = 25 : 35') });
  Q(1, 'Ako je ${a|b} = {c|d}$, šta važi po pravilu unakrsnog množenja?',
    ['$a · d = b · c$', '$a · b = c · d$', '$a · c = b · d$', '$a + d = b + c$'],
    'Množi se „ukršteno“: brojilac levog razlomka sa imeniocem desnog i obrnuto. To je isto kao kad obe strane pomnožimo sa $b · d$.', 'unakrsno',
    { mediji: formula('a : b = c : d'), medijiOdgovora: unakrsno('a', 'b', 'c', 'd') });
  proveri(10 / 2 * 3 === 15, '2 : 3 = 10 : 15');
  Q(2, 'Dečaci i devojčice u odeljenju su u razmeri $2 : 3$. Ako ima $10$ dečaka, koliko ima devojčica?',
    ['$15$', '$11$', '$20$', '$25$'],
    'Jedan „deo“ je $10 : 2 = 5$ učenika, a devojčice imaju $3$ dela: $15$. Celo odeljenje ima $5$ delova, tj. $25$ učenika.', 'razmera',
    { mediji: trakaDelova([2, 3], { jedinicni: true, natpisi: ['~dečaci', '~devojčice'], ispod: ['10', '?'], boje: [0, 1] }) });
  proveri(1400 / 7 === 200 && 3 * 200 === 600, '1400 u razmeri 3 : 4');
  Q(2, 'Zoran i Milena dele $1 400$ dinara u razmeri $3 : 4$. Koliko dobija Zoran?',
    ['$600$ dinara', '$800$ dinara', '$700$ dinara', '$350$ dinara'],
    'Ukupno ima $3 + 4 = 7$ delova od po $200$ dinara. Zoran dobija $3$ dela ($600$), a Milena $4$ ($800$).', 'deo',
    { mediji: trakaDelova([3, 4], { jedinicni: true, natpisi: ['~Zoran', '~Milena'], iznad: '1 400', boje: [0, 1] }) });
  proveri(3 * 12 / 4 === 9, 'x/12 = 3/4');
  Q(2, 'Koliko je $x$ u proporciji ${x|12} = {3|4}$?',
    ['$9$', '$16$', '$4$', '$11$'],
    'Unakrsno: $4x = 3 · 12 = 36$, pa je $x = 9$. Može i napamet: ${3|4}$ od $12$ je $9$.', 'proporcija',
    { mediji: unakrsno('x', '12', '3', '4') });
  proveri(3 * 200000 / 100000 === 6, '3 cm na 1 : 200 000');
  Q(2, 'Na karti razmere $1 : 200 000$ dva grada su udaljena $3$ cm. Koliko su udaljeni u prirodi?',
    ['$6$ km', '$60$ km', '$600$ m', '$3$ km'],
    'Razmera $1 : 200 000$ znači da je $1$ cm na karti $200 000$ cm, tj. $2$ km u prirodi. Na karti se crta razmernik da bi se rastojanja čitala bez računanja.', 'karta',
    { mediji: G(O, [{ tx: '●', at: [0.5, 2.3], b: 1, vel: 18 }, { tx: '●', at: [3.5, 2.3], b: 1, vel: 18 }, { lin: [[0.5, 2.3], [3.5, 2.3]], isp: 1, b: 1 }, { tx: '3 cm', at: [2, 2.75] }], { ...bez, velicina: 240 }),
      medijiOdgovora: G(O, [...razmernik(3, 'km', { u: 1, korak: 2 }), { tx: '●', at: [0.5, 2.3], b: 1, vel: 18 }, { tx: '●', at: [3.5, 2.3], b: 1, vel: 18 }, { lin: [[0.5, 2.3], [3.5, 2.3]], isp: 1, b: 1 }, { tx: '3 cm', at: [2, 2.75] }], { ...bez, velicina: 240 }) });
  proveri(200 * 100000 / 1000000 === 20, '200 km na 1 : 1 000 000');
  Q(3, 'Karta je u razmeri $1 : 1 000 000$. Koliko je na karti dugačko rastojanje od $200$ km?',
    ['$20$ cm', '$2$ cm', '$200$ cm', '$2$ m'],
    '$1$ cm na karti je $1 000 000$ cm $= 10$ km. Zato $200$ km na karti zauzima $200 : 10 = 20$ cm.', 'karta',
    { medijiOdgovora: G(O, [...razmernik(3, 'km', { u: 1, korak: 10 })], { ...bez, velicina: 200 }) });
  proveri(400 / 50 === 8, 'soba 4 m na 1 : 50');
  Q(2, 'Soba je dugačka $4$ m. Koliko je dugačka na planu u razmeri $1 : 50$?',
    ['$8$ cm', '$2$ cm', '$80$ cm', '$20$ cm'],
    '$4$ m $= 400$ cm, a $400 : 50 = 8$ cm. Arhitekte crtaju planove stanova najčešće u razmeri $1 : 50$ ili $1 : 100$.', 'plan',
    { medijiOdgovora: G(O, [{ lin: [[0, 0], [8, 0], [8, 6], [0, 6]], zatv: 1, b: 0 }, { tx: '8 cm', at: [4, -0.7] }, { tx: '1 : 50', at: [4, 3], vel: 18 }], { ...bez, velicina: 200 }) });
  proveri(72 / 8 === 9 && 5 * 9 === 45 && 3 * 9 === 27, '72° u razmeri 5 : 3');
  Q(3, 'Ugao od $72°$ podeljen je na dva ugla u razmeri $5 : 3$. Koliki je veći ugao?',
    ['$45°$', '$27°$', '$40°$', '$36°$'],
    'Ima $5 + 3 = 8$ delova od po $72° : 8 = 9°$. Veći ugao ima $5$ delova: $45°$, a manji $3$ dela: $27°$.', 'ugao',
    { medijiOdgovora: G({ O: [0, 0], A: [5, 0], C: [r(5 * Math.cos(Math.PI * 27 / 180)), r(5 * Math.sin(Math.PI * 27 / 180))], B: [r(5 * Math.cos(Math.PI * 72 / 180)), r(5 * Math.sin(Math.PI * 72 / 180))] },
      [{ d: 'OA', b: 0 }, { d: 'OB', b: 0 }, { d: 'OC', b: 1, isp: 1 }, { u: 'AOC', o: '27°', b: 2 }, { u: 'COB', o: '45°', b: 1 }], { bezImena: ['O', 'A', 'B', 'C'], velicina: 220 }) });
  Q(3, 'Na pravoj su redom tačke $A$, $B$, $C$, $D$, pri čemu je $AB = 3$ cm, $BC = 4$ cm i $CD = 5$ cm. Kolika je razmera $AB : BD$?',
    ['$1 : 3$', '$3 : 4$', '$1 : 4$', '$3 : 5$'],
    'Duž $BD$ je $BC + CD = 9$ cm, pa je $AB : BD = 3 : 9 = 1 : 3$.', 'duž',
    { mediji: G({ A: [0, 0], B: [3, 0], C: [7, 0], D: [12, 0] }, [{ d: 'AB', b: 1, debljina: 5, o: '3' }, { d: 'BC', b: 2, debljina: 5, o: '4' }, { d: 'CD', b: 3, debljina: 5, o: '5' }, { tacka: 'ABCD', b: 4 }], { velicina: 320 }) });
  U(1, 'Koja razmera NIJE jednaka razmeri $2 : 3$?',
    ['$3 : 2$', '$4 : 6$', '$10 : 15$', '$6 : 9$'],
    'Razmera $3 : 2$ je obrnuta: ${3|2} ≠ {2|3}$. Ostale se skraćuju na $2 : 3$.',
    'Razmera $2 : 3$ je česta u prirodi i umetnosti; mnoge zastave (i srpska) imaju odnos visine i dužine $2 : 3$.', 'razmera',
    { mediji: trakaDelova([2, 3], { jedinicni: true, boje: [0, 1] }) });
  S(1, 'Spoji razmeru sa njenim skraćenim oblikom.',
    [['$12 : 18$', '$2 : 3$'], ['$15 : 5$', '$3 : 1$'], ['$8 : 20$', '$2 : 5$'], ['$9 : 12$', '$3 : 4$']],
    'Razmera se skraćuje deljenjem oba člana najvećim zajedničkim deliocem, kao razlomak.', 'skratiti');
  Q(2, 'Metodom „kormila“ (okretanjem) iz proporcije ${a|b} = {c|d}$ dobija se i proporcija:',
    ['${a|c} = {b|d}$', '${a|d} = {c|b}$', '${a|b} = {d|c}$', '${b|c} = {a|d}$'],
    'Kad se četiri člana rasporede u krug i „kormilo“ okreće za $90°$, dobijaju se četiri ispravne proporcije. Sve one daju isto unakrsno: $ad = bc$.', 'kormilo',
    { mediji: unakrsno('a', 'b', 'c', 'd') });
  proveri(324 / 180 * 300 === 540, 'kikiriki 300 g');
  Q(2, 'Za $180$ g kikirikija plaća se $324$ dinara. Koliko košta $300$ g?',
    ['$540$ dinara', '$444$ dinara', '$600$ dinara', '$194$ dinara'],
    'Proporcija ${x|300} = {324|180}$ daje $x = 1,8 · 300 = 540$. Cena jednog grama je $1,8$ dinara.', 'cena',
    { mediji: unakrsno('x', '300', '324', '180') });
  Q(1, 'Šta znači razmera $1 : 25$ na planu?',
    ['$1$ cm na planu je $25$ cm u stvarnosti', '$25$ cm na planu je $1$ cm u stvarnosti', '$1$ cm na planu je $25$ m u stvarnosti', 'Plan je $25$ puta veći od stvarnosti'],
    'Prvi broj je dužina na crtežu, a drugi u stvarnosti. Razmera $5 : 1$ bi značila uveličanje – tako se crtaju sitni delovi mašina.', 'plan',
    { mediji: G(O, [...razmernik(4, 'cm', { u: 1, korak: 25 }), { tx: '1 : 25', at: [2, 0.8], vel: 16 }], { ...bez, velicina: 240 }) });
  proveri(132 / 3 === 44 && 0.75 * 44 === 33 && 1.25 * 44 === 55, 'jabuke 33, 44, 55');
  Q(3, 'Ana, Branka i Ceca dele $132$ jabuke tako da je $a : b = 3 : 4$ i $b : c = 4 : 5$. Koliko jabuka dobija Branka?',
    ['$44$', '$33$', '$55$', '$48$'],
    'Brankin deo je u obe razmere $4$, pa je $a : b : c = 3 : 4 : 5$. Ukupno $12$ delova od po $11$ jabuka: Ana $33$, Branka $44$, Ceca $55$.', 'jabuka',
    { mediji: trakaDelova([3, 4, 5], { jedinicni: true, natpisi: ['~Ana', '~Branka', '~Ceca'], iznad: '132' }) });
};
