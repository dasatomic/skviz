// Lekcije 32–35: krug i kružnica, centralni i periferijski ugao, obim kruga i π, dužina kružnog luka.
module.exports = ({ L, Q, U, S, G, proveri, r, naKrugu, rad }) => {

  // ── pomoćni crteži (centar u koordinatnom početku; tačke na kružnici po uglovima, npr. { A: 0, B: 80 }) ──
  const na = (R, uglovi) => Object.fromEntries(Object.entries(uglovi).map(([k, u]) => [k, naKrugu([0, 0], R, u)]));
  // kružnica poluprečnika R, tačke na njoj i dodatni elementi; centar O se ne ispisuje osim ako je skriveO: false
  const kruz = (R, uglovi = {}, e = [], { skriveO = true, velicina = 240, T = {} } = {}) =>
    G({ O: [0, 0], ...na(R, uglovi), ...T }, [{ kr: 'O', r: R, b: 4 }, ...e], { ...(skriveO ? { bezImena: ['O'] } : {}), velicina });
  // kružni luk sa centrom O (stepeni, od → do, smer suprotan kazaljci)
  const lukE = (R, od, doo, x = {}) => ({ l: 'O', r: R, od, do: doo, b: 1, debljina: 3, ...x });
  // pravilni n-tougao upisan u krug R (bez imena temena – samo kontura)
  const mnogo = (n, R, x = {}) => ({ lin: Array.from({ length: n + 1 }, (_, i) => naKrugu([0, 0], R, -90 - 180 / n + (360 * i) / n)), zatv: 1, prazno: 1, b: 1, ...x });
  // tangenta u tački kružnice (R, ugao u stepenima): dodirna tačka T i krajnje tačke P, Q
  const tangenta = (R, ugao, d = 2) => {
    const T = naKrugu([0, 0], R, ugao), a = rad(ugao);
    return { T, P: [r(T[0] - d * Math.sin(a)), r(T[1] + d * Math.cos(a))], Q: [r(T[0] + d * Math.sin(a)), r(T[1] - d * Math.cos(a))] };
  };

  // provera računa (gradnja pukne ako ne važi)
  proveri(Math.abs(Math.hypot(25 / 13, 60 / 13) - 5) < 1e-9, 'dodirna tačka B na kružnici r = 5');
  proveri(Math.abs(Math.hypot(144 / 13, 60 / 13) - 12) < 1e-9, 'tangentna duž = 12');
  proveri(Math.abs(2 * 4 * Math.PI - 8 * Math.PI) < 1e-9 && Math.abs(90 * 2 / 180 - 1) < 1e-9, 'centralni i periferijski ugao');
  proveri(Math.abs(2 * 3 * 3.14 - 18.84) < 1e-9 && Math.abs(18.84 / 6.28 - 3) < 1e-9, 'obim 18,84 → r = 3');
  proveri(Math.abs(35 * 22 / 7 - 110) < 1e-9 && Math.abs(2 * 35 * 22 / 7 - 220) < 1e-9, 'obim 35 cm i točak');
  proveri(Math.abs(62.8 / 3.14 - 20) < 1e-9, 'obim 62,8 → d = 20');
  proveri(6 < 2 * Math.PI && 2 * Math.PI < 6.3 && 22 / 7 > Math.PI && 22 / 7 - Math.PI < 0.002, 'π između 3 i 22/7');
  proveri(Math.abs(4 * Math.PI - 8 * Math.PI * 90 / 180) < 1e-9 && Math.abs(90 * 4 * Math.PI / 180 - 2 * Math.PI) < 1e-9, 'luk 4π, 90°');
  proveri(Math.abs(6 * Math.PI * 90 / 180 - 3 * Math.PI) < 1e-9 && Math.abs(6 * Math.PI * 30 / 180 - Math.PI) < 1e-9, 'lukovi 3π i π');
  proveri(Math.abs(10 * 2 * Math.PI - 20 * Math.PI) < 1e-9 && 360 / 8 === 45 && 360 / 6 === 60, 'obrtaji i uglovi');

  // ════════ 32. Krug i kružnica ════════
  L('Krug i kružnica');
  Q(1, 'Koja je razlika između kružnice i kruga?',
    ['Kružnica je linija, a krug je i unutrašnjost koju ona ograničava', 'Krug je linija, a kružnica je unutrašnjost', 'Kružnica je polovina kruga', 'To su dva naziva za istu figuru'],
    'Kružnica je samo linija, kao obruč na biciklu. Krug je i sve što je unutra, kao palačinka ili tanjir.', 'kružnica',
    { medijiOdgovora: G({ O1: [-3, 0], O2: [3, 0] }, [{ kr: 'O1', r: 2, b: 1 }, { kr: 'O2', r: 2, b: 4, pun: 1, gusto: 1 }, { tx: '~kružnica', at: [-3, -3] }, { tx: '~krug', at: [3, -3] }], { bezImena: ['O1', 'O2'], velicina: 300 }) });
  Q(1, 'Kako se zove tačka iz koje su sve tačke kružnice jednako udaljene?',
    ['Centar kružnice', 'Krajnja tačka', 'Dodirna tačka', 'Presečna tačka'],
    'Kad kružnicu crtaš šestarom, igla stoji u centru, a olovka obilazi oko nje na istom rastojanju.', 'centar',
    { mediji: kruz(3, { A: 20, B: 110, C: 250 }),
      medijiOdgovora: kruz(3, { A: 20 }, [{ d: 'OA', b: 1, debljina: 3, o: 'r' }], { skriveO: false }) });
  Q(1, 'Prečnik kruga je 10 cm. Koliki je poluprečnik?',
    ['5 cm', '10 cm', '20 cm', '2,5 cm'],
    'Poluprečnik je polovina prečnika. Zato je prečnik uvek dva puta duži od poluprečnika.', 'poluprečnik',
    { mediji: kruz(5, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3, o: '10 cm' }]),
      medijiOdgovora: kruz(5, { A: 0 }, [{ d: 'OA', b: 1, debljina: 3, o: 'r = 5 cm' }], { skriveO: false }) });
  Q(1, 'Poluprečnik kruga je 7 cm. Koliki je prečnik?',
    ['14 cm', '7 cm', '3,5 cm', '49 cm'],
    'Najveći krug koji može da stane u kvadrat stranice $a$ ima prečnik baš $a$. Tako je i kod ručno nacrtanih krugova: prečnik je uvek dvostruko veći od poluprečnika.', 'prečnik',
    { mediji: kruz(7, { A: 0 }, [{ d: 'OA', b: 1, debljina: 3, o: '7 cm' }]),
      medijiOdgovora: kruz(7, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3, o: '14 cm' }]) });
  Q(2, 'Na crtežu su tri tetive kruga. Koja je najduža?',
    ['Prečnik', 'Poluprečnik', 'Tetiva bez centra', 'Tetiva blizu ruba'],
    'Tetiva je duž čija su krajnja tačka na kružnici. Najduža tetiva je ona koja prolazi kroz centar, to jest prečnik. Tetiva dužine jednake prečniku mora prolaziti kroz centar.', 'tetiva',
    { mediji: kruz(5, { A: 180, B: 0, C: 40, D: 130, E: 250, F: 290 }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }, { d: 'EF', b: 3, debljina: 3 }]),
      medijiOdgovora: kruz(5, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3, o: '~prečnik = 10 cm' }]) });
  Q(2, 'Tačka $M$ pripada krugu $K(O, 5)$ čiji je poluprečnik 5 cm. Koja nejednakost je tačna za rastojanje $OM$?',
    ['$OM \\le 5$ cm', '$OM \\ge 5$ cm', '$OM = 10$ cm', '$OM \\ne 5$ cm'],
    'Tačke kruga su bliže centru od poluprečnika ili jednako udaljene, pa je $OM \\le r$. Tačke koje su dalje od $r$ leže van kruga.', 'krug',
    { mediji: G({ O: [0, 0], M: [1.5, 1] }, [{ kr: 'O', r: 5, b: 4 }, { tacka: 'M', b: 1 }], { bezImena: ['O'], velicina: 240 }),
      medijiOdgovora: G({ O: [0, 0], M: [1.5, 1] }, [{ kr: 'O', r: 5, b: 4 }, { tacka: 'M', b: 1 }, { d: 'OM', b: 1, debljina: 3, o: '1,8 cm' }], { velicina: 240 }) });
  Q(2, 'Tangenta kruga zaklapa u tački dodira sa poluprečnikom ugao. Koliki je taj ugao?',
    ['90°', '45°', '60°', '30°'],
    'Tangenta je uvek normalna na poluprečnik u tački dodira. Zato je to prav ugao, kao ugao u uglu zida.', 'tangenta',
    { mediji: (() => { const t = tangenta(3, 60); return G({ O: [0, 0], P: t.P, Q: t.Q, T: t.T }, [{ kr: 'O', r: 3, b: 4 }, { d: 'PQ', b: 1, debljina: 3 }, { d: 'OT', b: 2, debljina: 2 }, { tacka: 'T', b: 2 }], { bezImena: ['O'], velicina: 260 }); })(),
      medijiOdgovora: (() => { const t = tangenta(3, 60); return G({ O: [0, 0], P: t.P, Q: t.Q, T: t.T }, [{ kr: 'O', r: 3, b: 4 }, { d: 'PQ', b: 1, debljina: 3 }, { d: 'OT', b: 2, debljina: 2 }, { tacka: 'T', b: 2 }, { pu: 'OTP' }], { velicina: 260 }); })() });
  Q(3, 'Iz tačke $A$ spolja, koja je od centra $O$ udaljena 13 cm, povučena je tangenta na kružnicu poluprečnika 5 cm. Kolika je dužina tangentne duži $AB$ (od $A$ do dodirne tačke $B$)?',
    ['12 cm', '8 cm', '18 cm', '25 cm'],
    'Trougao $OBA$ je pravougli sa hipotenuzom $OA = 13$ cm i katetom $OB = 5$ cm. Pitagorina teorema daje $AB^2 = 169 - 25 = 144$, pa je $AB = 12$ cm.', 'tangenta',
    { mediji: G({ O: [0, 0, 200], A: [13, 0], B: [25 / 13, 60 / 13] }, [{ kr: 'O', r: 5, b: 4 }, { d: 'OA', b: 1, debljina: 3, o: 'OA = 13 cm' }, { d: 'OB', b: 2, debljina: 2, o: 'r = 5 cm' }, { tacka: 'O' }], { velicina: 300 }),
      medijiOdgovora: G({ O: [0, 0, 200], A: [13, 0], B: [25 / 13, 60 / 13] }, [{ kr: 'O', r: 5, b: 4 }, { d: 'OA', b: 1, debljina: 3, o: 'OA = 13 cm' }, { d: 'OB', b: 2, debljina: 2 }, { d: 'AB', b: 3, debljina: 3, o: '12 cm' }, { pu: 'OBA' }, { tacka: 'O' }], { velicina: 300 }) });
  Q(2, 'Kolika je najveća moguća dužina tetive koja polazi iz tačke $A$ kruga poluprečnika 5 cm?',
    ['10 cm', '5 cm', '20 cm', '7,5 cm'],
    'Najduža tetiva iz jedne tačke kruga je prečnik koji prolazi kroz nju. Njen drugi kraj je tačka koja je centralno simetrična tački $A$.', 'prečnik',
    { mediji: kruz(5, { A: 180 }, [{ tacka: 'A', b: 1 }]),
      medijiOdgovora: kruz(5, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3, o: '10 cm' }]) });
  Q(2, 'Kružnice $k_1$ i $k_2$ imaju poluprečnike 3 cm i 2 cm, a centralno rastojanje $O_1O_2 = 5$ cm. Kakav je njihov međusobni položaj?',
    ['Dodiruju se spolja', 'Seku se u dve tačke', 'Jedna je unutar druge', 'Nemaju nijednu zajedničku tačku'],
    'Zbir poluprečnika je $3 + 2 = 5$ cm, i to je baš centralno rastojanje. Kružnice imaju tačno jednu zajedničku tačku, na spojnici centara.', 'dodir',
    { medijiOdgovora: G({ O1: [-3, 0], O2: [2, 0], D: [0, 0] }, [{ kr: 'O1', r: 3, b: 1 }, { kr: 'O2', r: 2, b: 4 }, { tacka: 'D', b: 2 }, { tx: 'd = 3 + 2 = 5 cm', at: [-0.8, -4] }], { bezImena: ['O1', 'O2'], velicina: 300 }) });
  Q(2, 'Kružnica $k_1$ ima poluprečnik 4 cm, a kružnica $k_2$ poluprečnik 1 cm. Centri su na rastojanju 3 cm. Kakav je njihov položaj?',
    ['Dodiruju se iznutra', 'Dodiruju se spolja', 'Seku se u dve tačke', 'Nemaju zajedničkih tačaka'],
    'Rastojanje centara je $4 - 1 = 3$ cm, što je razlika poluprečnika. Manja kružnica se dodiruje sa većom iznutra, u jednoj tački.', 'dodir',
    { medijiOdgovora: G({ O1: [0, 0], O2: [3, 0], D: [4, 0] }, [{ kr: 'O1', r: 4, b: 1 }, { kr: 'O2', r: 1, b: 2 }, { tacka: 'D', b: 2 }], { bezImena: ['O1', 'O2'], velicina: 300 }) });
  Q(3, 'Kružnice $k_1$ i $k_2$ imaju poluprečnike 5 cm i 2 cm, a centralno rastojanje im je 1 cm. Kakav je njihov položaj?',
    ['Jedna je unutar druge i ne dodiruju se', 'Dodiruju se iznutra', 'Seku se u dve tačke', 'Dodiruju se spolja'],
    'Rastojanje centara ($1$ cm) je manje od razlike poluprečnika ($5 - 2 = 3$ cm). Zato je manja kružnica cela unutar veće, bez dodira.', 'unutra',
    { medijiOdgovora: G({ O1: [0, 0], O2: [1, 0] }, [{ kr: 'O1', r: 5, b: 1 }, { kr: 'O2', r: 2, b: 2 }], { bezImena: ['O1', 'O2'], velicina: 300 }) });
  Q(1, 'Kakve su kružnice čiji se centri poklapaju, a poluprečnici su različiti?',
    ['Koncentrične', 'Podudarne', 'Dodirne spolja', 'Sečne'],
    'Ako kamen baci u mirnu vodu, talasi su kružnice sa zajedničkim centrom: tako su koncentrične.', 'centar',
    { medijiOdgovora: kruz(4, { A: 0 }, [{ kr: 'O', r: 2, b: 2 }]) });
  Q(1, 'Prava je od centra kružnice udaljena više od njenog poluprečnika. Koliko zajedničkih tačaka imaju prava i kružnica?',
    ['Nijednu', 'Jednu', 'Dve', 'Beskonačno mnogo'],
    'Prava koja je dalje od poluprečnika prolazi pored kružnice i ne dodiruje je, pa je presek prazan.', 'prava',
    { mediji: kruz(3, {}, [{ lin: [[-5, 4.5], [5, 4.5]], b: 2, debljina: 3 }]) });
  S(2, 'Spoji pojam i njegovu definiciju.',
    [['Tetiva', 'duž čiji su krajevi dve tačke kružnice'], ['Poluprečnik', 'duž od centra do tačke kružnice'], ['Tangenta', 'prava koja dodiruje kružnicu u jednoj tački'], ['Sečica', 'prava koja seče kružnicu u dve tačke']],
    'Tangenta i sečica su prave, a tetiva i poluprečnik su duži. Ako prava seče kružnicu, sečena duž na njoj je tetiva.', 'sečica');

  // ════════ 33. Centralni i periferijski ugao kruga ════════
  L('Centralni i periferijski ugao kruga');
  Q(1, 'Kako se zove ugao čije je teme u centru kruga?',
    ['Centralni ugao', 'Periferijski ugao', 'Pravi ugao', 'Tupi ugao'],
    'Centralni ugao je „iz sredine“ kruga. Kraci mu pokazuju na dva mesta na kružnici, a između njih je kružni luk.', 'centralni',
    { mediji: kruz(4, { A: 0, B: 80 }, [{ d: 'OA', b: 1, debljina: 3 }, { d: 'OB', b: 1, debljina: 3 }, { u: 'AOB', b: 1 }], { skriveO: false }) });
  Q(1, 'Kako se zove ugao čije je teme na kružnici, a kraci seku kružnicu?',
    ['Periferijski ugao', 'Centralni ugao', 'Oštri ugao', 'Ispruženi ugao'],
    'Periferijski ugao se „gleda“ sa oboda kruga. Zato je i ime dobio po periferiji, to jest spoljašnjem obodu.', 'periferija',
    { mediji: kruz(4, { A: 200, B: 340, C: 70 }, [{ d: 'CA', b: 1, debljina: 2.5 }, { d: 'CB', b: 1, debljina: 2.5 }, { u: 'ACB', b: 2 }]) });
  Q(2, 'Centralni ugao nad lukom $AB$ je $80°$. Koliki je periferijski ugao nad istim lukom?',
    ['40°', '80°', '160°', '20°'],
    'Periferijski ugao je dva puta manji od centralnog nad istim lukom: $80° : 2 = 40°$. Ovo važi za sve tačke na drugom delu kružnice.', 'periferija',
    { mediji: kruz(4, { A: 0, B: 80 }, [{ u: 'AOB', o: '80°', b: 1 }], { skriveO: false }),
      medijiOdgovora: kruz(4, { A: 0, B: 80, C: 240 }, [{ d: 'CA', b: 1 }, { d: 'CB', b: 1 }, { u: 'ACB', o: '40°', b: 2 }]) });
  Q(2, 'Periferijski ugao nad lukom $AB$ je $35°$. Koliki je centralni ugao nad istim lukom?',
    ['70°', '35°', '17,5°', '145°'],
    'Centralni ugao je dva puta veći od periferijskog nad istim lukom: $2 \\cdot 35° = 70°$.', 'centralni',
    { mediji: kruz(4, { A: 0, B: 70, C: 230 }, [{ d: 'CA', b: 1 }, { d: 'CB', b: 1 }, { u: 'ACB', o: '35°', b: 2 }]),
      medijiOdgovora: kruz(4, { A: 0, B: 70 }, [{ d: 'OA', b: 1 }, { d: 'OB', b: 1 }, { u: 'AOB', o: '70°', b: 1 }], { skriveO: false }) });
  Q(1, 'Tačke $A$, $B$ i $C$ su na kružnici i $AB$ je prečnik. Koliki je ugao $ACB$?',
    ['90°', '180°', '45°', '60°'],
    'Periferijski ugao nad prečnikom je prav. Ovo je Talesova teorema, koju pripisujemo Talesu iz Mileta.', 'prečnik',
    { mediji: kruz(4, { A: 180, B: 0, C: 60 }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CA', b: 1 }, { d: 'CB', b: 1 }]),
      medijiOdgovora: kruz(4, { A: 180, B: 0, C: 60 }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CA', b: 1 }, { d: 'CB', b: 1 }, { u: 'ACB', o: '90°', b: 2 }]) });
  Q(2, 'Tačka $C$ je unutar kruga čiji je prečnik $AB$, i ne leži na $AB$. Kakav je ugao $ACB$?',
    ['Tup', 'Oštar', 'Prav', 'Ispružen'],
    'Kad je teme unutar kruga, ugao je veći od periferijskog nad prečnikom, pa je tup. Kad je teme van kruga, ugao je oštar.', 'tup',
    { mediji: kruz(4, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CA', b: 1 }, { d: 'CB', b: 1 }], { T: { C: [1, 2] } }),
      medijiOdgovora: kruz(4, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CA', b: 1 }, { d: 'CB', b: 1 }, { u: 'ACB', o: '~tup ugao', b: 2 }], { T: { C: [1, 2] } }) });
  Q(3, 'Tačka $C$ je van kruga čiji je prečnik $AB$. Kakav je ugao $ACB$?',
    ['Oštar', 'Tup', 'Prav', 'Ispružen'],
    'Kad je teme van kruga, ugao je manji od pravog. Zato je oštar, jer je manji od periferijskog nad prečnikom.', 'oštar',
    { mediji: kruz(4, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CA', b: 1 }, { d: 'CB', b: 1 }], { T: { C: [-1, 5] } }),
      medijiOdgovora: kruz(4, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CA', b: 1 }, { d: 'CB', b: 1 }, { u: 'ACB', o: '~oštar ugao', b: 2 }], { T: { C: [-1, 5] } }) });
  Q(2, 'Četvorougao $ABCD$ je upisan u kružnicu. Koliki je zbir njegovih naspramnih uglova?',
    ['180°', '90°', '360°', '270°'],
    'Naspramni uglovi upisanog četvorougla su suplementni, jer čine dva periferijska ugla nad lukovima koji zajedno daju ceo krug.', 'suplementni',
    { mediji: kruz(4, {}, [{ lin: [20, 110, 200, 300].map((u) => naKrugu([0, 0], 4, u)).concat([naKrugu([0, 0], 4, 20)]), zatv: 1, prazno: 1, b: 1 }]) });
  Q(3, 'Tetive $AB$ i $CD$ su jednake i jednake su im centralni uglovi u istom krugu. Šta još važi za njihove lukove?',
    ['Jednaki su', 'Dvostruko duži', 'Normalni su', 'Paralelni su'],
    'Jednakim centralnim uglovima odgovaraju jednaki lukovi i jednake tetive. Ovo važi i obrnuto: jednake tetive daju jednake centralne uglove.', 'tetiva',
    { mediji: kruz(4, { A: 10, B: 60, C: 150, D: 200 }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }]) });
  Q(1, 'Pravilni osmougao je upisan u krug. Koliki je centralni ugao nad jednom njegovom stranicom?',
    ['45°', '60°', '135°', '22,5°'],
    'Pun ugao od $360°$ se deli na 8 jednakih delova: $360° : 8 = 45°$. Tako se računa za svaki pravilni mnogougao.', 'osmougao',
    { mediji: kruz(4, {}, [mnogo(8, 4)]) });
  Q(2, 'Pravilni šestougao $ABCDEF$ je upisan u krug. Koliki je periferijski ugao $ADB$ nad stranicom $AB$ iz temena $D$?',
    ['30°', '60°', '120°', '90°'],
    'Stranica šestougla vidi se iz centra pod uglom $60°$, pa je periferijski ugao iz suprotnog dela kruga polovina toga: $30°$.', 'šestougao',
    { mediji: G({ O: [0, 0], ...na(4, { A: 240, B: 300, C: 0, D: 60, E: 120, F: 180 }) }, [{ kr: 'O', r: 4, b: 4 }, { p: 'ABCDEF', b: 1, prazno: 1 }], { bezImena: ['O'], velicina: 260 }),
      medijiOdgovora: G({ O: [0, 0], ...na(4, { A: 240, B: 300, C: 0, D: 60, E: 120, F: 180 }) }, [{ kr: 'O', r: 4, b: 4 }, { p: 'ABCDEF', b: 1, prazno: 1 }, { d: 'DA', b: 2 }, { d: 'DB', b: 2 }, { u: 'ADB', o: '30°', b: 2 }], { bezImena: ['O'], velicina: 260 }) });
  Q(2, 'Koliko periferijskih uglova (sa temenom na kružnici) može da se nacrta nad istim lukom $AB$?',
    ['Beskonačno mnogo', 'Jedan', 'Dva', 'Četiri'],
    'Teme periferijskog ugla može biti bilo koja tačka kružnice, osim one koja pripada tom luku. Tačaka ima beskonačno mnogo.', 'periferija',
    { mediji: kruz(4, { A: 0, B: 90, C: 200, D: 260 }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CA', b: 2 }, { d: 'CB', b: 2 }, { d: 'DA', b: 3 }, { d: 'DB', b: 3 }]) });
  Q(3, 'Centralni ugao nad manjim lukom $AB$ je $100°$. Koliki je periferijski ugao nad većim lukom $AB$?',
    ['130°', '50°', '260°', '100°'],
    'Većem luku odgovara centralni ugao $360° - 100° = 260°$. Periferijski ugao nad njim je polovina toga, $130°$.', 'veći',
    { mediji: kruz(4, { A: 0, B: 100 }, [{ d: 'OA', b: 1 }, { d: 'OB', b: 1 }, { u: 'AOB', o: '100°', b: 1 }], { skriveO: false }),
      medijiOdgovora: kruz(4, { A: 0, B: 100, C: 50 }, [{ d: 'CA', b: 1 }, { d: 'CB', b: 1 }, { u: 'ACB', o: '130°', b: 2 }]) });
  Q(3, 'Ugao $AOB$ je $60°$, a $A$ i $B$ su na kružnici sa centrom $O$. Kakav je trougao $AOB$?',
    ['Jednakostranični', 'Pravougli', 'Tupougli', 'Raznostranični'],
    'Trougao $AOB$ je jednakokraki, sa kracima $OA = OB = r$ i uglom između njih $60°$. Zato su i ostali uglovi po $60°$.', 'trougao',
    { mediji: kruz(4, { A: 0, B: 60 }, [{ d: 'OA', b: 1 }, { d: 'OB', b: 1 }, { d: 'AB', b: 2, debljina: 3 }, { u: 'AOB', o: '60°', b: 1 }], { skriveO: false }) });
  Q(1, 'Periferijski ugao nad lukom je $25°$. Koliki je centralni ugao nad istim lukom?',
    ['50°', '25°', '12,5°', '100°'],
    'Centralni ugao je dva puta veći od periferijskog nad istim lukom, pa je $2 \\cdot 25° = 50°$.', 'centralni',
    { mediji: kruz(4, { A: 0, B: 50, C: 200 }, [{ d: 'CA', b: 1 }, { d: 'CB', b: 1 }, { u: 'ACB', o: '25°', b: 2 }]),
      medijiOdgovora: kruz(4, { A: 0, B: 50 }, [{ d: 'OA', b: 1 }, { d: 'OB', b: 1 }, { u: 'AOB', o: '50°', b: 1 }], { skriveO: false }) });
  S(2, 'Spoji pojam i njegovo svojstvo.',
    [['Centralni ugao', 'dva puta veći od periferijskog nad istim lukom'], ['Periferijski ugao', 'polovina centralnog nad istim lukom'], ['Ugao nad prečnikom', 'uvek prav (90°)']],
    'Svako od ovih svojstava važi za sve kružne lukove, bez obzira na poluprečnik kruga.', 'periferija');

  // ════════ 34. Obim kruga; broj π ════════
  L('Obim kruga; broj π');
  Q(1, 'Šta je broj $\\pi$?',
    ['Količnik obima i prečnika bilo kog kruga', 'Količnik površine i poluprečnika', 'Zbir obima i prečnika', 'Razlika obima i poluprečnika'],
    'Ma koliki bio krug, količnik obima i prečnika uvek je isti broj. Taj broj se zove $\\pi$.', 'obim',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\pi = \\frac{O}{d}$' } });
  Q(1, 'Koja je približna vrednost broja $\\pi$ na dve decimale?',
    ['3,14', '3,41', '3,04', '4,13'],
    'Broj π je iracionalan, pa se ne može tačno napisati decimalnim brojem. Za praktične račune dovoljno je 3,14, a pamti se i kao datum 14. mart (3/14).', 'iracionalan',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\pi \\approx 3,14$' } });
  Q(1, 'Prečnik kruga je 10 cm. Koliki je njegov obim?',
    ['$10\\pi$ cm', '$5\\pi$ cm', '$20\\pi$ cm', '$100\\pi$ cm'],
    'Obim je $O = d \\cdot \\pi = 10\\pi$ cm. Poluprečnik $5$ cm daje istu vrednost preko $O = 2r\\pi$.', 'obim',
    { mediji: kruz(5, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3, o: '10 cm' }]) });
  Q(1, 'Poluprečnik kruga je 1 cm. Koliki je njegov obim, ako je $\\pi \\approx 3,14$?',
    ['6,28 cm', '3,14 cm', '12,56 cm', '2 cm'],
    'Obim je $O = 2r\\pi = 2 \\cdot 1 \\cdot 3,14 = 6,28$ cm. Ako zaboraviš dvojku, dobiješ samo $\\pi r$, pa 3,14 cm.', 'obim',
    { mediji: kruz(1, { A: 0 }, [{ d: 'OA', b: 1, debljina: 3, o: 'r = 1 cm' }]) });
  Q(2, 'Obim kruga je 18,84 cm, a $\\pi \\approx 3,14$. Koliki je poluprečnik?',
    ['3 cm', '6 cm', '9 cm', '1,5 cm'],
    'Iz $O = 2r\\pi$ sledi $r = O : (2\\pi) = 18,84 : 6,28 = 3$ cm.', 'poluprečnik',
    { medijiOdgovora: kruz(3, { A: 0 }, [{ d: 'OA', b: 1, debljina: 3, o: 'r = 3 cm' }], { skriveO: false }) });
  Q(2, 'Prečnik kruga je 35 cm. Koliki je obim ako je $\\pi \\approx \\frac{22}{7}$?',
    ['110 cm', '70 cm', '55 cm', '35 cm'],
    'Obim je $35 \\cdot \\frac{22}{7} = 5 \\cdot 22 = 110$ cm. Sedmica se lepo skrati sa 35.', 'razlomak',
    { mediji: kruz(5, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3, o: '35 cm' }]) });
  Q(2, 'Koliko puta prečnik „stane“ u obim kruga?',
    ['Oko 3,14 puta', '2 puta', '4 puta', 'Oko 6,28 puta'],
    'Obim je tačno $\\pi$ prečnika, to jest približno 3,14 puta. Ispravljena kružnica pokazuje to: tri prečnika i još malo.', 'prečnik',
    { mediji: kruz(4, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3 }]),
      medijiOdgovora: G({}, [{ lin: [[0, -3], [6.2832, -3]], b: 1, debljina: 4, crtaj: 1, trajanje: 2 }, { lin: [[0, -2.6], [0, -3.4]], b: 4 }, { lin: [[2, -2.6], [2, -3.4]], b: 4 }, { lin: [[4, -2.6], [4, -3.4]], b: 4 }, { lin: [[6, -2.6], [6, -3.4]], b: 4 }, { lin: [[6.2832, -2.6], [6.2832, -3.4]], b: 4 }, { tx: 'd', at: [1, -4] }, { tx: 'd', at: [3, -4] }, { tx: 'd', at: [5, -4] }, { tx: 'O = π · d', at: [3.1, -5.2] }], { velicina: 340 }) });
  Q(1, 'Je li broj $\\pi$ racionalan ili iracionalan?',
    ['Iracionalan', 'Racionalan', 'Ceo broj', 'Prirodan broj'],
    'Iracionalni brojevi imaju beskonačan decimalni zapis bez periode. Decimale π nikad ne ulaze u periodu, pa on nije razlomak.', 'iracionalan',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\pi \\approx 3,14159265358979$' } });
  Q(2, 'Koji je od ovih razlomaka najbolja aproksimacija broja $\\pi$?',
    ['$\\frac{22}{7}$', '$\\frac{7}{22}$', '$\\frac{3}{7}$', '$\\frac{13}{4}$'],
    'Razlomak $\\frac{22}{7} \\approx 3,142857$ je poznat još od Arhimeda, koji je dokazao da je $\\pi$ manje od $\\frac{22}{7}$.', 'razlomak',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{22}{7} \\approx 3,142857$' } });
  Q(3, 'Pravilni šestougao je upisan u krug. Šta se dešava sa njegovim obimom kad mu povećavamo broj stranica?',
    ['Približava se obimu kruga', 'Postaje sve manji', 'Ostaje isti', 'Postaje veći od obima kruga'],
    'Arhimed je ovim putem računao π: upisani mnogougao je manji od kruga, a njegov obim se sve više približava obimu kruga kako mu rastu stranice.', 'arhimed',
    { mediji: kruz(4, {}, [mnogo(6, 4)]),
      medijiOdgovora: kruz(4, {}, [mnogo(12, 4, { b: 2 })]) });
  Q(3, 'Krug ima poluprečnik 1, pa je njegov obim $2\\pi$. Obim pravilnog šestougla upisanog u taj krug je 6. Šta sledi za $\\pi$?',
    ['$\\pi$ je veće od 3', '$\\pi$ je manje od 3', '$\\pi$ je tačno 3', '$\\pi$ je veće od 4'],
    'Obim kruga je veći od obima upisanog šestougla, pa je $2\\pi > 6$, odnosno $\\pi > 3$.', 'arhimed',
    { mediji: kruz(1, { A: 0 }, [mnogo(6, 1), { d: 'OA', b: 1, debljina: 3, o: 'r = 1' }], { velicina: 260 }),
      medijiOdgovora: kruz(1, { A: 0 }, [mnogo(6, 1), { d: 'OA', b: 1, debljina: 3, o: 'r = 1' }], { velicina: 260 }) });
  Q(2, 'Koliki je obim kruga poluprečnika 0,5 m, ako je $\\pi \\approx 3,14$?',
    ['3,14 m', '1,57 m', '0,785 m', '6,28 m'],
    'Obim je $2 \\cdot 0,5 \\cdot 3,14 = 3,14$ m. Jedinica ostaje metar, i to je ceo računa.', 'obim',
    { medijiOdgovora: kruz(2, { A: 0 }, [{ d: 'OA', b: 1, debljina: 3, o: 'r = 0,5 m' }], { skriveO: false }) });
  Q(3, 'Obim kruga je $12\\pi$ cm. Koliki je njegov prečnik?',
    ['12 cm', '6 cm', '24 cm', '$6\\pi$ cm'],
    'Iz $O = d\\pi$ sledi $d = O : \\pi = 12\\pi : \\pi = 12$ cm. Poluprečnik je tada 6 cm.', 'prečnik',
    { medijiOdgovora: kruz(2, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3, o: 'd = 12 cm' }]) });
  Q(3, 'Točak poluprečnika 35 cm se jednom okrene. Koliki put pređe, ako je $\\pi \\approx \\frac{22}{7}$?',
    ['220 cm', '110 cm', '35 cm', '70 cm'],
    'Točak se kotrlja tačno onoliko koliko iznosi obim. Ispravljeni obim je duž čija je dužina $2 \\cdot 35 \\cdot \\frac{22}{7} = 220$ cm.', 'točak',
    { mediji: G({ O: [0, 3.5], P: [0, 0] }, [{ kr: 'O', r: 3.5, b: 1 }, { d: 'OP', b: 2, debljina: 3 }, { lin: [[-6, 0], [6, 0]], b: 4, debljina: 2 }, { tacka: 'P', b: 2 }], { bezImena: ['O'], velicina: 300 }),
      medijiOdgovora: G({ A: [0, 0], B: [21.991, 0] }, [{ lin: [[0, 0], [21.991, 0]], b: 1, debljina: 4, crtaj: 1, trajanje: 2 }, { tacka: 'A', b: 2 }, { tacka: 'B', b: 2 }, { tx: 'O = 2rπ', at: [11, -2] }], { velicina: 300 }) });
  Q(2, 'Obim kruga je 62,8 cm, a $\\pi \\approx 3,14$. Koliki je prečnik?',
    ['20 cm', '10 cm', '31,4 cm', '200 cm'],
    'Prečnik je $d = O : \\pi = 62,8 : 3,14 = 20$ cm. Dvostruka vrednost poluprečnika daje istu dužinu.', 'prečnik',
    { medijiOdgovora: kruz(4, { A: 180, B: 0 }, [{ d: 'AB', b: 1, debljina: 3, o: 'd = 20 cm' }]) });
  S(2, 'Spoji oznaku sa njenim značenjem.',
    [['Obim kruga poluprečnika $r$', '$O = 2r\\pi$'], ['Obim kruga prečnika $d$', '$O = d\\pi$'], ['Broj $\\pi$', 'količnik obima i prečnika'], ['Približna vrednost $\\pi$', '$\\frac{22}{7}$']],
    'Sve tri formule su iste, samo zapisane preko poluprečnika ili prečnika.', 'obim');

  // ════════ 35. Dužina kružnog luka ════════
  L('Dužina kružnog luka');
  Q(1, 'Kolika je dužina polukružnog luka poluprečnika $r$?',
    ['$\\pi r$', '$2\\pi r$', '$\\pi r^{2}$', '$\\frac{\\pi r}{4}$'],
    'Polukrug je pola kruga, pa je i luk pola obima: $\\frac{2\\pi r}{2} = \\pi r$. Površina ($\\pi r^{2}$) je nešto drugo.', 'luk',
    { mediji: G({ O: [0, 0], A: [-4, 0], B: [4, 0] }, [lukE(4, 0, 180, { b: 1 }), { d: 'AB', b: 4, isp: 1 }], { bezImena: ['O'], velicina: 260 }) });
  Q(1, 'Kolika je dužina luka koji je četvrtina kruga poluprečnika $r$?',
    ['$\\frac{\\pi r}{2}$', '$\\pi r$', '$\\frac{\\pi r}{4}$', '$2\\pi r$'],
    'Četvrtina kruga ima centralni ugao $90°$, a dužina luka je $\\frac{r\\pi \\cdot 90}{180} = \\frac{\\pi r}{2}$.', 'četvrtina',
    { mediji: G({ O: [0, 0], A: [4, 0], B: [0, 4] }, [lukE(4, 0, 90, { b: 1 }), { d: 'OA', b: 4, isp: 1 }, { d: 'OB', b: 4, isp: 1 }], { bezImena: ['O'], velicina: 260 }) });
  Q(1, 'Luk ima centralni ugao $90°$ u krugu poluprečnika 4 cm. Kolika je dužina luka?',
    ['$2\\pi$ cm', '$4\\pi$ cm', '$\\pi$ cm', '$8\\pi$ cm'],
    'Dužina luka je $l = \\frac{r\\pi\\alpha}{180°} = \\frac{4\\pi \\cdot 90}{180} = 2\\pi$ cm.', 'luk',
    { mediji: G({ O: [0, 0], A: [4, 0], B: [0, 4] }, [lukE(4, 0, 90, { b: 1 }), { d: 'OA', b: 1, debljina: 3, o: 'r = 4 cm' }, { d: 'OB', b: 4, isp: 1 }], { bezImena: ['O'], velicina: 260 }) });
  Q(2, 'Luk je šestina kruga. Koliki je njegov centralni ugao?',
    ['60°', '30°', '90°', '36°'],
    'Pun krug ima $360°$, a šestina od toga je $360° : 6 = 60°$. Ista šestina važi i za dužinu luka.', 'šestina',
    { mediji: G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 60) }, [lukE(4, 0, 60, { b: 1 }), { d: 'OA', b: 4, isp: 1 }, { d: 'OB', b: 4, isp: 1 }], { bezImena: ['O'], velicina: 260 }) });
  Q(3, 'Luk ima centralni ugao $72°$ u krugu poluprečnika 5 cm. Koji je deo obima taj luk?',
    ['$\\frac{1}{5}$', '$\\frac{1}{72}$', '$\\frac{1}{4}$', '$\\frac{1}{3}$'],
    'Odnos je $\\frac{72°}{360°} = \\frac{1}{5}$, pa je luk peti deo obima. Dužina luka je tako $\\frac{1}{5}$ od $2 \\cdot 5\\pi$.', 'petina',
    { mediji: G({ O: [0, 0], A: [5, 0], B: naKrugu([0, 0], 5, 72) }, [lukE(5, 0, 72, { b: 1 }), { d: 'OA', b: 4, isp: 1 }, { d: 'OB', b: 4, isp: 1 }], { bezImena: ['O'], velicina: 260 }) });
  Q(3, 'Dužina luka je $4\\pi$ cm, a njegov centralni ugao $90°$. Koliki je poluprečnik kruga?',
    ['8 cm', '4 cm', '2 cm', '16 cm'],
    'Iz $l = \\frac{r\\pi\\alpha}{180°}$ sledi $4\\pi = \\frac{r\\pi \\cdot 90}{180}$, pa je $r = 8$ cm.', 'poluprečnik',
    { mediji: G({ O: [0, 0], A: [8, 0], B: naKrugu([0, 0], 8, 90) }, [lukE(8, 0, 90, { b: 1 }), { d: 'OA', b: 1, debljina: 3, o: 'r' }], { bezImena: ['O'], velicina: 260 }),
      medijiOdgovora: G({ O: [0, 0], A: [8, 0], B: naKrugu([0, 0], 8, 90) }, [lukE(8, 0, 90, { b: 1 }), { d: 'OA', b: 1, debljina: 3, o: 'r = 8 cm' }], { bezImena: ['O'], velicina: 260 }) });
  Q(1, 'Dva luka istog kruga imaju centralne uglove $60°$ i $120°$. Koji je duži?',
    ['Luk od 120°', 'Luk od 60°', 'Isti su', 'Zavisi od poluprečnika'],
    'Dužina luka je proporcionalna centralnom uglu. Dvostruki ugao daje dvostruku dužinu luka.', 'luk',
    { mediji: G({ O1: [-5, 0], O2: [5, 0] }, [{ l: 'O1', r: 3, od: 0, do: 60, b: 1, debljina: 4 }, { l: 'O2', r: 3, od: 0, do: 120, b: 2, debljina: 4 }], { bezImena: ['O1', 'O2'], velicina: 300 }) });
  Q(3, 'Dva luka istog kruga imaju centralne uglove $40°$ i $80°$. Koliki je odnos njihovih dužina?',
    ['1 : 2', '2 : 1', '1 : 4', '1 : 1'],
    'Dužine lukova se odnose kao centralni uglovi: $40 : 80 = 1 : 2$.', 'odnos',
    { mediji: G({ O1: [-5, 0], O2: [5, 0] }, [{ l: 'O1', r: 3, od: 0, do: 40, b: 1, debljina: 4 }, { l: 'O2', r: 3, od: 0, do: 80, b: 2, debljina: 4 }], { bezImena: ['O1', 'O2'], velicina: 300 }) });
  Q(3, 'Krug ima poluprečnik 180 cm. Kolika je dužina luka koji odgovara centralnom uglu od $1°$?',
    ['$\\pi$ cm', '$2\\pi$ cm', '$180\\pi$ cm', '$\\frac{\\pi}{180}$ cm'],
    'Dužina je $l = \\frac{180 \\cdot \\pi \\cdot 1}{180} = \\pi$ cm. Zato je dužina luka od jednog stepena jednaka broju π kad je poluprečnik 180 cm.', 'stepen',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$l = \\frac{r\\pi\\alpha}{180°} = \\frac{180\\pi \\cdot 1}{180} = \\pi$' } });
  Q(2, 'Obim kruga je 40 cm. Kolika je dužina luka koji odgovara centralnom uglu od $90°$?',
    ['10 cm', '20 cm', '40 cm', '4 cm'],
    'Luk od $90°$ je četvrtina kruga, pa je njegova dužina četvrtina obima: $40 : 4 = 10$ cm.', 'četvrtina',
    { mediji: kruz(4, { A: 45, B: 135 }, [{ l: 'O', r: 4, od: 45, do: 135, b: 1, debljina: 4, o: 'O = 40 cm' }], { skriveO: true }) });
  Q(2, 'Dužina luka je $3\\pi$ cm, a poluprečnik $6$ cm. Koliki je centralni ugao tog luka?',
    ['90°', '45°', '30°', '60°'],
    'Iz $3\\pi = \\frac{6\\pi \\cdot \\alpha}{180°}$ sledi $\\alpha = 90°$.', 'ugao',
    { mediji: kruz(6, { A: 0 }, [{ d: 'OA', b: 1, debljina: 3, o: 'r = 6 cm' }], { skriveO: false }),
      medijiOdgovora: G({ O: [0, 0], A: [6, 0], B: naKrugu([0, 0], 6, 90) }, [lukE(6, 0, 90, { b: 1 }), { d: 'OA', b: 1, debljina: 3, o: 'r = 6 cm' }, { d: 'OB', b: 4, isp: 1 }], { bezImena: ['O'], velicina: 260 }) });
  Q(3, 'Dužina luka je $\\pi$ cm, a njegov centralni ugao je $30°$. Koliki je poluprečnik kruga?',
    ['6 cm', '3 cm', '12 cm', '30 cm'],
    'Iz $\\pi = \\frac{r\\pi \\cdot 30}{180}$ sledi $r = \\frac{180}{30} = 6$ cm.', 'poluprečnik',
    { mediji: G({ O: [0, 0], A: [6, 0], B: naKrugu([0, 0], 6, 30) }, [lukE(6, 0, 30, { b: 1, o: 'l = π cm' }), { d: 'OA', b: 4, isp: 1 }, { d: 'OB', b: 4, isp: 1 }], { bezImena: ['O'], velicina: 260 }),
      medijiOdgovora: G({ O: [0, 0], A: [6, 0], B: naKrugu([0, 0], 6, 30) }, [lukE(6, 0, 30, { b: 1 }), { d: 'OA', b: 1, debljina: 3, o: 'r = 6 cm' }, { d: 'OB', b: 4, isp: 1 }], { bezImena: ['O'], velicina: 260 }) });
  Q(1, 'Kako se zove deo kružnice između dve njene tačke?',
    ['Kružni luk', 'Tetiva', 'Kružni isečak', 'Kružni prsten'],
    'Kružni luk je deo kružnice, a tetiva je samo duž koja spaja iste dve tačke. Luk ima dužinu, a duž se meri samo po pravoj.', 'luk',
    { mediji: G({ O: [0, 0], A: naKrugu([0, 0], 4, 20), B: naKrugu([0, 0], 4, 110) }, [{ kr: 'O', r: 4, b: 4 }, lukE(4, 20, 110, { b: 1, debljina: 4 }), { tacka: 'A', b: 2 }, { tacka: 'B', b: 2 }], { bezImena: ['O'], velicina: 260 }) });
  Q(2, 'Točak poluprečnika 1 m se okrene 10 puta. Koliki put je prešao?',
    ['$20\\pi$ m', '$10\\pi$ m', '$2\\pi$ m', '$100\\pi$ m'],
    'Jedan obrt je obim, $2\\pi$ m. Deset obrtaja daje $10 \\cdot 2\\pi = 20\\pi$ m.', 'obrt',
    { mediji: G({ O: [0, 1], P: [0, 0] }, [{ kr: 'O', r: 1, b: 1 }, { d: 'OP', b: 2, debljina: 3 }, { lin: [[-7, 0], [7, 0]], b: 4, debljina: 2 }, { tacka: 'P', b: 2 }], { bezImena: ['O'], velicina: 280 }) });
  S(2, 'Spoji deo kruga sa njegovim delom obima.',
    [['Četvrtina kruga', '$\\frac{O}{4}$'], ['Polukrug', '$\\frac{O}{2}$'], ['Šestina kruga', '$\\frac{O}{6}$'], ['Luk od $1°$', '$\\frac{O}{360}$']],
    'Svaki centralni ugao odgovara delu obima jednakom odnosu tog ugla prema punom uglu od $360°$.', 'luk');
};
