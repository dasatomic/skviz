// Geometrija ravni: uglovi, prave, trouglovi, četvorouglovi, površine na mreži, simetrija i transformacije
module.exports = ({ T, Q, U, S, A, F, G, proveri, r, S3, rad, naKrugu, pravilni }) => {
  T('Geometrija ravni');
  const ug = (u, R = 5) => naKrugu([0, 0], R, u);
  // presek pravih kroz p1 sa uglom a1 i p2 sa uglom a2 (stepeni)
  const presek = (p1, a1, p2, a2) => {
    const [c1, s1, c2, s2] = [Math.cos(rad(a1)), Math.sin(rad(a1)), Math.cos(rad(a2)), Math.sin(rad(a2))];
    const t = ((p2[0] - p1[0]) * s2 - (p2[1] - p1[1]) * c2) / (c1 * s2 - s1 * c2);
    return [r(p1[0] + t * c1), r(p1[1] + t * s1)];
  };
  // trougao sa uglovima α (kod A) i β (kod B) nad osnovicom dužine a
  const trougao = (alfa, beta, a = 6) => ({ A: [0, 0], B: [a, 0], C: presek([0, 0], alfa, [a, 0], 180 - beta) });

  S(1, 'Spoji ugao sa njegovim imenom', [['35°', 'oštar'], ['90°', 'prav'], ['145°', 'tup'], ['180°', 'opružen'], ['360°', 'pun']],
    'Opružen ugao izgleda kao prava linija – kraci su mu suprotni. Stepen kao mera ugla potiče od Vavilonaca, koji su računali u šezdesetinama; 360 je zgodno jer ima čak 24 delioca.',
    'ugao');

  Q(1, 'Koliko stepeni otprilike ima ovaj ugao?', ['135°', '45°', '90°', '180°'],
    'Ugao je veći od pravog (90°), a manji od opruženog (180°) – tup je. Tačno je na pola puta između njih: 90° + 45° = 135°.',
    'ugao', { mediji: G({ O: [0, 0], A: [5, 0], B: ug(135) }, [{ d: 'OA' }, { d: 'OB' }, { u: 'AOB', r: 30 }], { bezImena: ['O', 'A', 'B'], velicina: 240 }) });

  Q(1, 'Prav ugao je podeljen na dva dela. Jedan ima 35°. Koliki je drugi ugao α?', ['55°', '145°', '65°', '45°'],
    '90° − 35° = 55°. Dva ugla koja zajedno čine prav ugao zovu se komplementni. Zato u pravouglom trouglu dva oštra ugla uvek daju zbir 90°.',
    'ugao', { mediji: G({ O: [0, 0], A: [5, 0], B: ug(35), C: [0, 5] }, [{ d: 'OA' }, { d: 'OB' }, { d: 'OC' }, { pu: 'AOC', b: 5 }, { u: 'AOB', o: '35°', r: 40 }, { u: 'BOC', o: 'α', r: 40, b: 1 }], { bezImena: ['O', 'A', 'B', 'C'], velicina: 230 }) });

  Q(1, 'Koliki je ugao α na slici?', ['52°', '62°', '128°', '42°'],
    'Dva ugla na pravoj liniji (uporedni uglovi) zajedno daju opružen ugao: 180° − 128° = 52°. Takvi uglovi su suplementni.',
    'ugao', { mediji: G({ O: [0, 0], A: [-5, 0], B: [5, 0], C: ug(128) }, [{ d: 'AB' }, { d: 'OC' }, { u: 'BOC', o: '128°', r: 30 }, { u: 'COA', o: 'α', r: 40, b: 1 }], { bezImena: ['O', 'A', 'B', 'C'], velicina: 260 }) });

  Q(1, 'Dve prave se seku. Koliki je ugao α?', ['40°', '140°', '50°', '320°'],
    'Naspramni (unakrsni) uglovi su uvek jednaki. Oba su uporedna sa istim uglom od 140°, pa moraju biti isti: 180° − 140° = 40°.',
    'unakrsni', { mediji: G({ O: [0, 0], A: [5, 0], C: [-5, 0], B: ug(40), D: ug(220) }, [{ d: 'AC' }, { d: 'BD' }, { u: 'AOB', o: '40°', r: 40 }, { u: 'COD', o: 'α', r: 40, b: 1 }], { bezImena: ['O', 'A', 'B', 'C', 'D'], velicina: 240 }) });

  {
    const Qt = [r(3 / Math.tan(rad(65))), 3];
    const t = { P: [0, 0], Q: Qt, A: [-4, 0], B: [5, 0], C: [-4, 3], D: [5, 3], E: [r(-0.5 * Qt[0]), -1.5], F: [r(1.5 * Qt[0]), 4.5] };
    Q(2, 'Gornja i donja prava su paralelne. Koliki je ugao α?', ['115°', '65°', '25°', '125°'],
      'Ugao od 65° se „prenosi“ gore: ugao između prave i gornje paralelne prave udesno je takođe 65° (saglasni uglovi). Ugao α je uporedan sa njim: 180° − 65° = 115°.',
      'paralelna', { mediji: G(t, [{ d: 'AB' }, { d: 'CD' }, { d: 'EF', b: 4 }, { u: 'BPQ', o: '65°', r: 34 }, { u: 'FQC', o: 'α', r: 30, b: 1 }], { bezImena: Object.keys(t), velicina: 260 }) });
  }

  {
    const t = trougao(50, 70);
    t.D = [r(t.C[0] + 0.7 * t.C[0]), r(t.C[1] + 0.7 * t.C[1])];
    proveri(Math.abs(Math.atan2(t.C[1], t.C[0] - 6) * 180 / Math.PI - 110) < 0.01, 'spoljašnji');
    Q(2, 'Stranica $AC$ je produžena. Koliki je spoljašnji ugao α?', ['120°', '60°', '110°', '130°'],
      'Spoljašnji ugao trougla jednak je zbiru dva unutrašnja ugla koja nisu uz njega: 50° + 70° = 120°. Unutrašnji ugao kod $C$ je 60°, a α je uporedan sa njim: 180° − 60°.',
      'spoljašnji', { mediji: G(t, [{ p: 'ABC', b: 0 }, { d: 'CD', isp: 1 }, { u: 'BAC', o: '50°' }, { u: 'CBA', o: '70°' }, { u: 'DCB', o: 'α', b: 1, r: 26 }], { bezImena: ['D'], velicina: 240 }) });
  }

  {
    const t = trougao(48, 67);
    proveri(180 - 48 - 67 === 65, 'treći ugao');
    Q(1, 'Dva ugla trougla su 48° i 67°. Koliki je treći ugao?', ['65°', '75°', '55°', '115°'],
      'Zbir uglova u trouglu je uvek 180°: 180° − 48° − 67° = 65°. Animacija pokazuje zašto: tri „otkinuta“ ugla uvek se slože u opružen ugao.',
      'ugao', { mediji: G(t, [{ p: 'ABC', b: 0 }, { u: 'BAC', o: '48°' }, { u: 'CBA', o: '67°' }, { u: 'ACB', o: '?', b: 1 }], { velicina: 240 }), medijiOdgovora: A('zbir-uglova') });
  }

  {
    const t = { A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], E: [2, r(4 + 2 * S3)] };
    proveri(Math.abs(Math.atan2(t.E[1], t.E[0]) * 180 / Math.PI - 75) < 0.01, 'kvadrat i trougao');
    Q(3, 'Nad stranicom kvadrata $ABCD$ spolja je nacrtan jednakostranični trougao $DCE$. Koliki je ugao $AEB$?', ['30°', '15°', '45°', '60°'],
      'Trougao $ADE$ je jednakokraki ($AD = DE$), a ugao kod $D$ je 90° + 60° = 150°. Zato su uglovi uz osnovicu po (180° − 150°) : 2 = 15°. Ugao $AEB$ = 60° − 15° − 15° = 30°.',
      'kvadrat', { mediji: G(t, [{ p: 'ABCD', b: 0 }, { p: 'DCE', b: 2 }, { d: 'AE', isp: 1 }, { d: 'BE', isp: 1 }, { u: 'AEB', o: '?', b: 1, r: 34 }], { velicina: 220 }) });
  }

  U(2, 'Koji trougao NE MOŽE da postoji?', ['Sa dva prava ugla', 'Pravougli jednakokraki', 'Tupougli raznostranični', 'Oštrougli jednakokraki'],
    'Dva prava ugla već daju 180°, pa za treći ugao ne ostaje ništa – kraci bi bili paralelni i nikad se ne bi sreli.',
    'Na površini lopte ovo je moguće! Trougao sa temenom na Severnom polu i dva temena na ekvatoru ima dva prava ugla (i ne samo dva).',
    'trougao');

  Q(2, 'Od kojih duži NE MOŽE da se napravi trougao?', ['3, 4 i 8 cm', '5, 5 i 9 cm', '4, 5 i 6 cm', '2, 3 i 4 cm'],
    'Zbir bilo koje dve stranice mora biti veći od treće: 3 + 4 = 7 < 8, pa se kraće duži „ne dohvate“. To je nejednakost trougla – i razlog zašto je prečica preko livade kraća od puta oko nje.',
    'trougao');

  Q(1, 'Kako se zove ovaj četvorougao?', ['Trapez', 'Paralelogram', 'Romb', 'Deltoid'],
    'Trapez ima jedan par paralelnih stranica (osnovice). Ovaj je jednakokraki – kraci su mu jednaki, kao kod abažura ili kofe gledane sa strane.',
    'trapez', { mediji: G({ A: [0, 0], B: [7, 0], C: [5, 3.2], D: [2, 3.2] }, [{ p: 'ABCD', b: 2 }], { velicina: 240 }) });

  Q(2, 'Kako se zove ovaj četvorougao?', ['Deltoid', 'Romb', 'Trapez', 'Paralelogram'],
    'Deltoid ima dva para jednakih SUSEDNIH stranica, a dijagonale su mu normalne. Oblik zmaja od papira je deltoid – na engleskom se i zove „kite“ (zmaj).',
    'deltoid', { mediji: G({ A: [0, 0], B: [3, 2.2], C: [0, 6.5], D: [-3, 2.2] }, [{ p: 'ABCD', b: 4 }, { d: 'AC', isp: 1, b: 5 }, { d: 'BD', isp: 1, b: 5 }], { velicina: 200 }) });

  U(1, 'Koji četvorougao NEMA dva para paralelnih stranica?', ['Trapez', 'Romb', 'Pravougaonik', 'Kvadrat'],
    'Romb, pravougaonik i kvadrat su paralelogrami – imaju dva para paralelnih stranica. Trapez ima samo jedan par.',
    'Kvadrat je istovremeno i romb i pravougaonik – ima jednake stranice kao romb i prave uglove kao pravougaonik.',
    'trapez');

  Q(2, 'Kod kog četvorougla su dijagonale UVEK jednake i normalne jedna na drugu?', ['Kvadrat', 'Romb', 'Pravougaonik', 'Paralelogram'],
    'Pravougaonik ima jednake dijagonale (ali ne normalne), romb ima normalne (ali ne jednake). Samo kvadrat ima oba svojstva – jer je i romb i pravougaonik.',
    'dijagonala', { medijiOdgovora: G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], S: [2, 2, -90] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1 }, { d: 'BD', b: 1 }, { pu: 'CSD', b: 3 }], { bezImena: ['S'], velicina: 200 }) });

  Q(2, 'Da li je svaki kvadrat romb?', ['Da – ima 4 jednake stranice', 'Ne – romb nema prave uglove', 'Ne – kvadrat je pravougaonik', 'Samo ako je stranica 1 cm'],
    'Romb je svaki četvorougao sa 4 jednake stranice, a kvadrat to ispunjava. Obrnuto ne važi: romb je kvadrat samo ako ima prave uglove. Isto kao: svaki pas je životinja, ali nije svaka životinja pas.',
    'romb');

  {
    const t = { A: [1, 1], B: [7, 1], C: [3, 5], H: [3, 1] };
    Q(1, 'Svako polje mreže je 1 cm². Kolika je površina trougla $ABC$?', ['12 cm²', '24 cm²', '10 cm²', '20 cm²'],
      'Osnovica je 6, a visina 4 polja. Površina trougla je polovina pravougaonika iste osnovice i visine: 6 · 4 : 2 = 12 cm². Nije važno gde je treće teme – samo koliko je visoko.',
      'površina', { mediji: G(t, [{ mreza: [0, 8, 0, 6], brojevi: 0 }, { p: 'ABC', b: 1 }], { bezImena: ['H'], velicina: 240 }), medijiOdgovora: A('povrsina-trougla') });
  }

  Q(2, 'Svako polje mreže je 1 cm². Kolika je površina paralelograma $ABCD$?', ['15 cm²', '18 cm²', '7,5 cm²', '16 cm²'],
    'Odseci trougao sa jedne strane i premesti ga na drugu – dobije se pravougaonik 5 × 3 = 15 cm². Kosa stranica se ne množi; računa se osnovica puta VISINA.',
    'površina', { mediji: G({ A: [1, 1], B: [6, 1], C: [8, 4], D: [3, 4] }, [{ mreza: [0, 9, 0, 5], brojevi: 0 }, { p: 'ABCD', b: 2 }], { velicina: 240 }), medijiOdgovora: A('paralelogram') });

  {
    const L = [[0, 0], [5, 0], [5, 2], [2, 2], [2, 4], [0, 4]];
    const m = (x) => [{ mreza: [-0.5, 5.5, -0.5, 4.5], brojevi: 0 }, { lin: L.map(([a, b]) => [a, b]), zatv: 1, b: x }];
    Q(1, 'Svako polje mreže je 1 cm². Kolika je površina ovog lika?', ['14 cm²', '20 cm²', '18 cm²', '12 cm²'],
      'Lik se može podeliti na pravougaonike 5 × 2 i 2 × 2: 10 + 4 = 14 cm². Ili: ceo pravougaonik 5 × 4 = 20, minus „isečeni“ ugao 3 × 2 = 6.',
      'površina', { mediji: G({ O: [0, 0] }, m(0), { bezImena: ['O'], velicina: 220 }) });
    Q(3, 'Stranica polja mreže je 1 cm. Koliki je OBIM ovog lika?', ['18 cm', '14 cm', '16 cm', '20 cm'],
      'Iznenađenje: obim je isti kao kod celog pravougaonika 5 × 4 (18 cm)! Dve „uvučene“ stranice ugla samo su pomerene unutra, a ukupna dužina vodoravnih i uspravnih ivica se ne menja. Površina se smanjila, a obim nije.',
      'obim', { mediji: G({ O: [0, 0] }, m(4), { bezImena: ['O'], velicina: 220 }) });
  }

  Q(2, 'Svako polje mreže je 1 cm². Kolika je površina trapeza $ABCD$?', ['16 cm²', '24 cm²', '12 cm²', '32 cm²'],
    'Površina trapeza = (zbir osnovica) : 2 · visina = (6 + 2) : 2 · 4 = 16 cm². Dva ista trapeza okrenuta jedan uz drugi daju paralelogram osnovice 8 i visine 4 – a pola od 32 je 16.',
    'trapez', { mediji: G({ A: [1, 1], B: [7, 1], C: [5, 5], D: [3, 5] }, [{ mreza: [0, 8, 0, 6], brojevi: 0 }, { p: 'ABCD', b: 3 }], { velicina: 240 }) });

  {
    const t = pravilni(6, 4, [0, 0], 0);
    const ose = [0, 30, 60, 90, 120, 150].map((u, i) => ({ lin: [naKrugu([0, 0], 5, u), naKrugu([0, 0], 5, u + 180)], b: 1, isp: 1, debljina: 2 }));
    Q(2, 'Koliko osa simetrije ima pravilan šestougao?', ['6', '3', '12', '2'],
      'Tri ose prolaze kroz naspramna temena, a tri kroz sredine naspramnih stranica. Pravilan mnogougao sa n stranica uvek ima tačno n osa simetrije.',
      'simetrija', { mediji: G(t, [{ p: 'ABCDEF', b: 3 }], { bezImena: Object.keys(t), velicina: 200 }), medijiOdgovora: G({ ...t, O: [0, 0] }, [{ p: 'ABCDEF', b: 3 }, ...ose], { bezImena: [...Object.keys(t), 'O'], velicina: 200 }) });
  }

  Q(1, 'Koje slovo ima i vodoravnu i uspravnu osu simetrije?', ['$H$', '$A$', '$E$', '$T$'],
    '$A$ i $T$ imaju samo uspravnu osu, $E$ samo vodoravnu, a $H$ obe. Slova sa obe ose izgledaju isto i u ogledalu i naopako – takva su još $O$, $X$ i $I$.',
    'simetrija');

  Q(1, 'Tačka $A(2, 3)$ se preslikava osnom simetrijom u odnosu na x-osu. Koje su koordinate slike?', ['(2, −3)', '(−2, 3)', '(−2, −3)', '(3, 2)'],
    'x-osa je „ogledalo“: tačka ostaje iznad istog mesta, samo prelazi na drugu stranu – y menja znak. Slika je jednako daleko od ose kao i original.',
    'simetrija', { medijiOdgovora: G({ A: [2, 3, 0], B: [2, -3, 0] }, [{ mreza: [-4, 4, -4, 4], ose: ['x', 'y'] }, { d: 'AB', isp: 1, b: 3 }, { tacka: 'A', b: 0 }, { tacka: 'B', b: 1 }], { velicina: 220 }) });

  {
    const t = { A: [-2, -2], B: [2, -2], C: [2, 2], D: [-2, 2], O: [0, 0], e: [-0.8, -2], f: [-2, -0.8] };
    Q(1, 'Kvadrat se okreće oko svog centra. Za koliko NAJMANJE stepeni treba da se okrene da bi izgledao isto kao na početku?', ['90°', '45°', '180°', '360°'],
      'Posle četvrtine kruga (90°) svako teme dođe na mesto susednog, pa kvadrat izgleda isto. Kvadrat ima rotacionu simetriju reda 4; pravilan petougao bi se poklopio posle 72°.',
      'rotacija', {
        mediji: G(t, [{ p: 'ABCD', b: 0 }, { tacka: 'O' }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 180 }),
        medijiOdgovora: G(t, [{ p: 'ABCD', b: 5, prazno: 1, isp: 1 }, { p: 'Aef', b: 5, prazno: 1, isp: 1 }, { p: 'ABCD', b: 1, okreni: 90, oko: 'O', trajanje: 2.5 }, { p: 'Aef', b: 3, gusto: 1, okreni: 90, oko: 'O', trajanje: 2.5 }, { tacka: 'O' }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 180 }),
      });
  }

  Q(3, 'Koji lik je centralno simetričan, a NEMA nijednu osu simetrije?', ['Kosi paralelogram', 'Jednakokraki trapez', 'Jednakostranični trougao', 'Deltoid'],
    'Paralelogram (koji nije romb ni pravougaonik) okrenut za 180° oko preseka dijagonala poklapa se sa sobom, ali nijedna prava ga ne deli na dve slike u ogledalu. Trapez i deltoid imaju osu, a trougao nema centar simetrije.',
    'simetrija');

  Q(2, 'Trougao $ABC$ je pomeren (translacijom) u $A′B′C′$. Za koliko polja je pomeren?', ['3 udesno, 2 nagore', '2 udesno, 3 nagore', '3 udesno, 3 nagore', '5 udesno, 2 nagore'],
    'Gleda se samo jedno teme: $A(1, 1)$ je prešlo u $A′(4, 3)$ – to je 3 polja udesno i 2 nagore. Pri translaciji se sve tačke pomere za isti vektor, pa lik ostaje isti i isto okrenut.',
    'vektor', { mediji: G({ A: [1, 1], B: [3, 1], C: [1, 3], "A'": [4, 3], "B'": [6, 3], "C'": [4, 5] }, [{ mreza: [0, 7, 0, 6], brojevi: 0 }, { p: 'ABC', b: 0 }, { p: "A'B'C'", b: 1 }], { velicina: 230 }) });

  Q(1, 'Koliko pravih prolazi kroz dve različite tačke?', ['Tačno jedna', 'Tačno dve', 'Beskonačno mnogo', 'Nijedna'],
    'Ovo je jedna od Euklidovih aksioma – tvrdnji koje se ne dokazuju, već prihvataju. Kroz JEDNU tačku, međutim, prolazi beskonačno mnogo pravih.',
    'prava');

  {
    const t = { A: [0, 0], B: [5, 0.5], C: [4, 4], D: [0.5, 3.5] };
    Q(2, 'Date su 4 tačke, od kojih nikoje tri nisu na istoj pravoj. Koliko različitih pravih one određuju?', ['6', '4', '8', '12'],
      'Svaki par tačaka daje jednu pravu: $AB$, $AC$, $AD$, $BC$, $BD$, $CD$ – to je 4 · 3 : 2 = 6. Deli se sa 2 jer je prava $AB$ isto što i $BA$.',
      'prava', { mediji: G(t, [{ tacka: 'ABCD', b: 3 }], { velicina: 180 }), medijiOdgovora: G(t, [{ d: 'AB' }, { d: 'AC', b: 1 }, { d: 'AD' }, { d: 'BC' }, { d: 'BD', b: 1 }, { d: 'CD' }, { tacka: 'ABCD', b: 3 }], { velicina: 180 }) });
  }

  {
    const t = pravilni(5, 4);
    const e = [];
    const im = Object.keys(t);
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) e.push({ d: im[i] + im[j], b: j === i + 1 || (i === 0 && j === 4) ? 0 : 1 });
    Q(2, 'Petoro prijatelja se pozdravi tako da se svako rukuje sa svakim tačno jednom. Koliko je bilo rukovanja?', ['10', '20', '25', '5'],
      'Svako se rukuje sa 4 druga: 5 · 4 = 20, ali je tako svako rukovanje brojano dvaput, pa je 10. Na crtežu: 5 stranica + 5 dijagonala petougla.',
      'rukovanje', { medijiOdgovora: G(t, [...e, { tacka: im.join(''), b: 3 }], { bezImena: im, velicina: 200 }) });
  }

  Q(1, 'Kako se zove prava koja je normalna na duž i prolazi kroz njeno središte?', ['Simetrala duži', 'Težišna duž', 'Visina', 'Dijagonala'],
    'Svaka tačka simetrale je jednako udaljena od oba kraja duži. Zato se, na primer, mesto za česmu jednako udaljenu od dve kuće traži baš na simetrali.',
    'simetrala', { medijiOdgovora: G({ A: [0, 0], B: [6, 0], S: [3, 0, -45], M: [3, 3.5], N: [3, -1.5] }, [{ d: 'AB' }, { d: 'MN', b: 1 }, { pu: 'BSM', b: 3 }, { tacka: 'S' }], { bezImena: ['M', 'N'], velicina: 200 }) });

  Q(3, 'Koji od ovih uglova NE MOŽE da se konstruiše samo lenjirom i šestarom?', ['20°', '15°', '75°', '105°'],
    'Lenjirom i šestarom dobijaju se 60° i 90°, a zatim njihove polovine, zbirovi i razlike: 15° = 60° − 45°, 75° = 45° + 30°, 105° = 60° + 45°. Ugao od 20° bi zahtevao deljenje 60° na tri dela.',
    'šestar');

  {
    const t = { A: [0, 0], B: [7, 0], C: [2, 5] };
    // centar opisanog kruga
    const [ax, ay] = t.A, [bx, by] = t.B, [cx, cy] = t.C;
    const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
    const ox = ((ax ** 2 + ay ** 2) * (by - cy) + (bx ** 2 + by ** 2) * (cy - ay) + (cx ** 2 + cy ** 2) * (ay - by)) / d;
    const oy = ((ax ** 2 + ay ** 2) * (cx - bx) + (bx ** 2 + by ** 2) * (ax - cx) + (cx ** 2 + cy ** 2) * (bx - ax)) / d;
    t.O = [r(ox), r(oy), -60];
    const sim = (p, q) => {
      const m = [(t[p][0] + t[q][0]) / 2, (t[p][1] + t[q][1]) / 2];
      const dx = ox - m[0], dy = oy - m[1], L = Math.hypot(dx, dy);
      return { lin: [[r(m[0] - (dx / L) * 1.2), r(m[1] - (dy / L) * 1.2)], [r(ox + (dx / L) * 0.8), r(oy + (dy / L) * 0.8)]], b: 1, isp: 1, debljina: 2 };
    };
    Q(2, 'Centar kruga opisanog oko trougla je presek…', ['simetrala stranica', 'simetrala uglova', 'visina trougla', 'težišnih duži'],
      'Centar opisanog kruga je jednako udaljen od sva tri temena, a tačke jednako udaljene od dva temena leže na simetrali stranice. Presek simetrala uglova je centar UPISANOG kruga.',
      'krug', { medijiOdgovora: G(t, [{ p: 'ABC', b: 0 }, { kr: 'O', kroz: 'A', b: 3 }, sim('A', 'B'), sim('B', 'C'), sim('C', 'A'), { tacka: 'O', b: 1 }], { velicina: 220 }) });
  }

  {
    const t = { A: [0, 0], B: [7, 0], C: [2, 5.5] };
    const sr = (p, q) => [r((t[p][0] + t[q][0]) / 2), r((t[p][1] + t[q][1]) / 2)];
    Object.assign(t, { a: sr('B', 'C'), b: sr('A', 'C'), c: sr('A', 'B'), T: [r(3), r(5.5 / 3), -80] });
    Q(3, 'U kom odnosu težište deli svaku težišnu duž trougla (od temena ka sredini stranice)?', ['2 : 1', '1 : 1', '3 : 1', '3 : 2'],
      'Težište je uvek dva puta dalje od temena nego od sredine naspramne stranice. Trougao od kartona izrezan po meri može se balansirati na vrhu olovke baš u težištu.',
      'težište', { medijiOdgovora: G(t, [{ p: 'ABC', b: 0 }, { d: 'Aa', b: 1 }, { d: 'Bb', b: 1 }, { d: 'Cc', b: 1 }, { tacka: 'T', b: 3 }], { velicina: 220 }) });
  }

  Q(2, 'Koliko ukupno trouglova ima na slici?', ['6', '3', '4', '5'],
    'Iz vrha polaze 4 linije, a svaka dva od njih (sa delom osnovice) čine jedan trougao: 3 mala, 2 srednja (od po dva mala) i 1 veliki – ukupno 6. Kod ovakvih zadataka pomaže brojanje po veličini.',
    'trougao', { mediji: G({ V: [3, 5], A: [0, 0], B: [2, 0], C: [4, 0], D: [6, 0] }, [{ p: 'VAD', b: 4 }, { d: 'VB' }, { d: 'VC' }], { bezImena: ['V', 'A', 'B', 'C', 'D'], velicina: 220 }) });
};
