// Lekcije 23–27: geometrijske konstrukcije, osnovne konstrukcije trougla, podudarnost trouglova,
// stavovi podudarnosti i njihove primene (tema 4 udžbenika Matematika 6, Arhiknjiga).
// Pitanja su sopstvenim rečima; crteži su medij „geo“ (konstrukcije se iscrtavaju, podudarni
// trouglovi se preklapaju), pomoćne funkcije su zajedničke sa zadacima (alati/zadaci-6/6-podudarnost.js).
const C = require('../zadaci-6/6-podudarnost').crtezi;

module.exports = ({ L, Q, U, S, G, r, proveri }) => {
  const { rad, naPravcu, kroz, sred, okreniT, odraziT, pomeriT, noga, presek, sss, sus, usu, opisana, upisana,
    crt, lukovi, sestar, lenjir, simetralaEl, simetralaUglaEl, par } = C;

  // ── česti crteži ──
  // trougao ABC sa dodatnim elementima
  const tr = (T, e = [], x = {}) => G(T, [{ p: 'ABC', b: 0 }, ...e], { velicina: 240, ...x });
  // ugao xOy zadate veličine (kraci kao duži), sa oznakom
  const ugaoXOY = (u, { o, e = [], t = {} } = {}) => {
    const T = { O: [0, 0], x: [5, 0], y: naPravcu([0, 0], u, 5), ...t };
    return G(T, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Oy', b: 0, debljina: 3 }, { u: 'xOy', r: 34, b: 1, ...(o ? { o } : {}) }, ...e], { velicina: 240 });
  };
  // konstrukcija ugla od 60° (luk iz O, luk istog poluprečnika iz B, krak kroz presek)
  const konstr60 = ({ sim = false } = {}) => {
    const O = [0, 0], B = [4, 0], Cc = naPravcu(O, 60, 4);
    const T = { O, B, C: Cc, x: [6, 0], c: naPravcu(O, 60, 6) };
    const e = [{ d: 'Ox', b: 0, debljina: 3 }, { l: 'O', r: 4, od: -8, do: 75, crtaj: 1, b: 4 },
      { l: 'B', r: 4, od: 105, do: 135, crtaj: 1, kasni: 1.1, b: 4 }, { tacka: 'B', b: 3 }, { tacka: 'C', b: 3 },
      lenjir(O, T.c, { kasni: 2, b: 0, debljina: 3 }), { u: 'BOC', r: 46, b: 1, o: '60°' }];
    if (sim) {
      const s = simetralaUglaEl(T, 'O', 'B', 'C', { kasni: 2.8, boja: 2, r1: 2.2 });
      return G({ ...T, ...s.t }, [...e, ...s.e, { u: 'xOs', r: 0 }].filter((x) => !x.u || x.u !== 'xOs'), { velicina: 260, bezImena: ['O', 'B', 'C'] });
    }
    return G(T, e, { velicina: 260, bezImena: ['B', 'C'] });
  };
  // dva podudarna trougla (drugi je okrenut za `ug` i pomeren za `v`); vraća tačke
  const dva = (a, b, c, ug = 0, v = [8, 0], imena = 'DEF') => {
    const [A, B, Cc] = sss(a, b, c);
    const Z0 = sred(A, B);
    const sl = [A, B, Cc].map((P) => pomeriT(okreniT(P, Z0, ug), v));
    return { A, B, C: Cc, [imena[0]]: sl[0], [imena[1]]: sl[1], [imena[2]]: sl[2] };
  };

  proveri(30 * 2 === 60 && 45 + 22.5 === 67.5 && 60 + 15 === 75, 'konstrukcije uglova');

  // ══════════ 23. Geometrijske konstrukcije ══════════
  L('Geometrijske konstrukcije');
  Q(1, 'Koje alate smemo da koristimo u geometrijskoj konstrukciji?',
    ['Šestar i običan lenjir', 'Uglomer i šestar', 'Uglomer i lenjir sa podelom', 'Samo trougaoni lenjir'],
    'Pravilo „samo šestar i lenjir“ potiče od starogrčkih matematičara. Lenjirom se samo povlače prave kroz dve tačke – njegova podela se ne koristi za merenje.', 'šestar',
    { mediji: konstr60() });
  Q(1, 'Šta se konstruiše na crtežu?',
    ['Simetrala duži', 'Simetrala ugla', 'Paralelna prava', 'Ugao od 60°'],
    'Simetrala duži je prava normalna na duž kroz njeno središte. Svaka njena tačka je jednako udaljena od oba kraja duži.', 'simetrala',
    { mediji: G({ A: [0, 0], B: [6, 0] }, [{ d: 'AB', b: 0, debljina: 3 }, ...simetralaEl({ A: [0, 0], B: [6, 0] }, 'A', 'B')], { velicina: 260 }) });
  {
    const T = { A: [0, 0], B: [6, 0] };
    Q(1, 'Kod konstrukcije simetrale duži $AB$ luci iz $A$ i $B$ moraju imati isti poluprečnik. Kakav mora biti taj poluprečnik?',
      ['Veći od polovine duži $AB$', 'Jednak polovini duži $AB$', 'Manji od polovine duži $AB$', 'Jednak trećini duži $AB$'],
      'Ako je poluprečnik manji od polovine duži, luci se ne seku; ako je tačno polovina, dodiruju se samo u središtu, pa ne dobijamo dve tačke kroz koje bismo povukli pravu.', 'poluprečnik',
      { mediji: G(T, [{ d: 'AB', b: 0, debljina: 3 }, { l: 'A', r: 2.2, od: -70, do: 70, crtaj: 1, b: 4 }, { l: 'B', r: 2.2, od: 110, do: 250, crtaj: 1, kasni: 0.9, b: 4 }, { tx: '?', at: [3, 1.2], vel: 26, b: 3 }], { velicina: 260 }),
        medijiOdgovora: G(T, [{ d: 'AB', b: 0, debljina: 3 }, ...simetralaEl(T, 'A', 'B')], { velicina: 260 }) });
  }
  {
    const A = [0, 0], B = [6, 0], Cc = [2, 3.6], D = noga(Cc, A, B);
    Q(1, 'Kako se zove duž $CD$ na crtežu?',
      ['Visina trougla', 'Težišna duž', 'Simetrala ugla', 'Srednja linija'],
      'Visina je najkraće rastojanje temena od prave naspramne stranice. Obeležava se slovom h sa indeksom stranice na koju je spuštena – ovde je $CD = h_{c}$.', 'visina',
      { mediji: tr({ A, B, C: Cc, D: [D[0], D[1], -90] }, [{ d: 'CD', b: 1, debljina: 3 }, { pu: 'CDB' }]) });
  }
  {
    const A = [0, 0], B = [6, 0], Cc = [2.4, 4];
    const T = { A, B, C: Cc, a1: noga(A, B, Cc), b1: noga(B, A, Cc), c1: noga(Cc, A, B) };
    Q(1, 'Koliko visina ima svaki trougao?',
      ['$3$', '$1$', '$2$', '$6$'],
      'Iz svakog temena se može spustiti normala na pravu naspramne stranice. Sve tri visine (ili njihove prave) seku se u jednoj tački – ortocentru, o kome se uči u 7. razredu.', 'visina',
      { mediji: tr(T), medijiOdgovora: tr(T, [{ d: 'Aa1', b: 1, crtaj: 1, kasni: 0.2 }, { d: 'Bb1', b: 2, crtaj: 1, kasni: 0.9 }, { d: 'Cc1', b: 3, crtaj: 1, kasni: 1.6 }, { pu: 'Aa1C' }, { pu: 'Bb1A' }, { pu: 'Cc1B' }]) });
  }
  {
    const A = [0, 0], B = [6, 0], Cc = [7.6, 2.6];
    const D = noga(A, B, Cc);
    const T = { A, B, C: Cc, D: [D[0], D[1], 90] };
    Q(2, 'U tupouglom trouglu $ABC$ (tup ugao kod $B$) povučena je visina iz temena $A$. Gde je njeno podnožje?',
      ['Na produžetku stranice $BC$', 'Na sredini stranice $BC$', 'U temenu $B$', 'Unutar stranice $BC$'],
      'Zato je visina definisana kao normala na pravu koja sadrži naspramnu stranicu. U tupouglom trouglu dve visine su van trougla, a sve tri se seku u tački van trougla.', 'podnožje',
      { mediji: tr(T, [{ u: 'CBA', b: 1, o: 'tup' }]), medijiOdgovora: tr(T, [{ d: 'BD', b: 4, isp: 1 }, { d: 'AD', b: 1, debljina: 3, crtaj: 1 }, { pu: 'ADC' }]) });
  }
  {
    const T = { C: [0, 0, 225], B: [5, 0], A: [0, 3.5] };
    Q(2, 'U pravouglom trouglu $ABC$ prav ugao je kod $C$. Šta je visina iz temena $A$ na stranicu $BC$?',
      ['Kateta $AC$', 'Kateta $BC$', 'Hipotenuza $AB$', 'Polovina hipotenuze'],
      'Kateta $AC$ je već normalna na $BC$, pa je ona sama visina $h_{a}$. Isto tako je $BC = h_{b}$ – u pravouglom trouglu dve visine su katete.', 'kateta',
      { mediji: tr(T, [{ pu: 'BCA' }]), medijiOdgovora: tr(T, [{ pu: 'BCA' }, { d: 'AC', b: 1, debljina: 5 }]) });
  }
  Q(1, 'Koja figura se koristi za konstrukciju ugla od $60°$?',
    ['Jednakostranični trougao', 'Kvadrat', 'Jednakokraki pravougli trougao', 'Pravougaonik'],
    'Luk iz temena i luk istog poluprečnika iz preseka grade trougao sa tri jednake stranice, a svi uglovi jednakostraničnog trougla su po $60°$.', 'trougao',
    { mediji: ugaoXOY(60, { o: '60°' }), medijiOdgovora: konstr60() });
  {
    const O = [0, 0], B = [4, 0], Cc = naPravcu(O, 60, 4);
    const T = { O, B, C: Cc, x: [6, 0], c: naPravcu(O, 60, 6) };
    const s = simetralaUglaEl(T, 'O', 'B', 'C', { kasni: 0.3, boja: 2, r1: 2.4 });
    Q(2, 'Kako se konstruiše ugao od $30°$?',
      ['Simetralom ugla od $60°$', 'Simetralom ugla od $90°$', 'Kao razlika $90°$ i $45°$', 'Kao polovina ugla od $45°$'],
      'Simetrala ugla od $60°$ daje dva ugla od $30°$. Ugao od $30°$ se dobija i kao razlika $90° − 60°$ – konstrukcija često može na više načina.', 'polovina',
      { mediji: ugaoXOY(30, { o: '30°' }), medijiOdgovora: G({ ...T, ...s.t }, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Oc', b: 0, debljina: 3 }, { u: 'BOC', r: 50, b: 1, o: '60°' }, ...s.e], { velicina: 260, bezImena: ['B', 'C'] }) });
  }
  {
    const O = [0, 0], T = { O, x: [5, 0], y: [0, 5], a: naPravcu(O, 45, 5.2), b: naPravcu(O, 22.5, 5.4), c: naPravcu(O, 11.25, 5.5) };
    U(2, 'Koji ugao je uljez – ne može se dobiti polovljenjem pravog ugla (jednom ili više puta)?',
      ['$30°$', '$45°$', '$22°30′$', '$11°15′$'],
      'Polovljenjem pravog ugla dobijamo redom $45°$, $22°30′$, $11°15′$ … Ugao od $30°$ se dobija iz ugla od $60°$, a ne iz pravog ugla.',
      'Polovljenje se može nastaviti unedogled: posle deset koraka ugao je manji od desetine stepena.', 'polovljenje',
      { mediji: G(T, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Oy', b: 0, debljina: 3 }, { pu: 'xOy' }, { d: 'Oa', b: 1, crtaj: 1 }, { d: 'Ob', b: 2, crtaj: 1, kasni: 0.9 }, { d: 'Oc', b: 3, crtaj: 1, kasni: 1.6 }], { velicina: 240 }) });
  }
  S(2, 'Spoji ugao sa načinom na koji se konstruiše.',
    [['$60°$', 'jednakostranični trougao'], ['$90°$', 'normala na pravu'], ['$45°$', 'polovina pravog ugla'], ['$120°$', 'dva ugla od $60°$'], ['$15°$', 'polovina ugla od $30°$']],
    'Kombinovanjem uglova od $60°$ i $90°$, nadovezivanjem i polovljenjem dobija se mnogo uglova: $75° = 60° + 15°$, $105° = 90° + 15°$, $135° = 90° + 45°$, $150° = 180° − 30°$.', 'ugao',
    { mediji: ugaoXOY(120, { o: '120°' }) });
  {
    const O = [0, 0], T = { O, x: [5, 0], a: naPravcu(O, 60, 5), y: naPravcu(O, 75, 5) };
    Q(2, 'Kako se može konstruisati ugao od $75°$?',
      ['Kao zbir $60°$ i $15°$', 'Kao zbir $45°$ i $15°$', 'Kao razlika $90°$ i $30°$', 'Kao polovina ugla od $120°$'],
      'Netačni predlozi svi daju $60°$! Ugao od $75°$ može i kao $90° − 15°$ ili kao polovina ugla od $150°$.', 'zbir',
      { mediji: ugaoXOY(75, { o: '75°' }), medijiOdgovora: G(T, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Oy', b: 0, debljina: 3 }, { d: 'Oa', b: 4, isp: 1 }, { u: 'xOa', r: 30, b: 1, o: '60°' }, { u: 'aOy', r: 50, b: 2, o: '15°' }], { velicina: 240 }) });
  }
  Q(3, 'Koji od ovih uglova NE može da se konstruiše samo šestarom i lenjirom?',
    ['$20°$', '$15°$', '$105°$', '$165°$'],
    'Ugao od $20°$ je trećina ugla od $60°$, a tek 1837. godine Pjer Vancel je dokazao da se proizvoljan ugao ne može podeliti na tri jednaka dela šestarom i lenjirom. Grci su to pokušavali više od 2000 godina.', 'trisekcija',
    { mediji: ugaoXOY(20, { o: '?' }) });
  {
    const A = [0, 3], M = [-2.646, 0], P = [2.646, 0];
    const T = { A, M: [M[0], M[1], -100], P: [P[0], P[1], -80], a1: [-5, 0], a2: [5, 0], q: [0, -3] };
    Q(2, 'Prvi korak konstrukcije normale iz tačke $A$ na pravu $a$ je kružnica sa centrom $A$. Šta ona mora da učini?',
      ['Da seče pravu $a$ u dve tačke', 'Da dodiruje pravu $a$', 'Da prolazi kroz središte prave', 'Da bude manja od prave'],
      'Tačka $A$ je jednako udaljena od dve presečne tačke, pa pripada simetrali duži između njih – a ta simetrala je baš tražena normala.', 'normala',
      { mediji: G({ A, a1: T.a1, a2: T.a2 }, [{ d: 'a1a2', b: 0, debljina: 2.5 }, { tx: 'a', at: [4.8, 0.4] }, { tacka: 'A', b: 1 }], { velicina: 260 }),
        medijiOdgovora: G(T, [{ d: 'a1a2', b: 0, debljina: 2.5 }, { tx: 'a', at: [4.8, 0.4] }, { tacka: 'A', b: 1 }, { l: 'A', r: 4, od: 200, do: 340, crtaj: 1, b: 4 },
          { tacka: 'M', b: 3 }, { tacka: 'P', b: 3 }, sestar(T, 'M', 4, T.q, { kasni: 1.2 }), sestar(T, 'P', 4, T.q, { kasni: 1.7 }), lenjir(A, T.q, { kasni: 2.4, pro: 0.1 })], { velicina: 260 }) });
  }
  {
    const O = [0, 0], T = { O, x: [5, 0], a: naPravcu(O, 45, 5), y: naPravcu(O, 67.5, 5) };
    Q(3, 'Kako se može konstruisati ugao od $67°30′$?',
      ['Kao zbir $45°$ i $22°30′$', 'Kao zbir $60°$ i $15°$', 'Kao razlika $90°$ i $30°$', 'Kao zbir $45°$ i $15°$'],
      '$67°30′$ je i polovina ugla od $135°$, odnosno $90° − 22°30′$. Ugao od $30′$ je pola stepena – stepen ima $60$ minuta.', 'minut',
      { mediji: ugaoXOY(67.5, { o: '67°30′' }), medijiOdgovora: G(T, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Oy', b: 0, debljina: 3 }, { d: 'Oa', b: 4, isp: 1 }, { u: 'xOa', r: 30, b: 1, o: '45°' }, { u: 'aOy', r: 52, b: 2, o: '22°30′' }], { velicina: 240 }) });
  }
  {
    const A = [0, 0], B = [6, 0], Cc = [-2.2, 3];
    const T = { A, B, C: Cc, a1: noga(A, B, Cc), b1: noga(B, A, Cc), c1: noga(Cc, A, B) };
    Q(3, 'Koliko visina tupouglog trougla leži van trougla?',
      ['$2$', '$1$', '$3$', '$0$'],
      'Van trougla su visine iz temena oštrih uglova – njihova podnožja su na produžecima stranica. Visina iz temena tupog ugla je unutar trougla.', 'tupougli',
      { mediji: tr(T, [{ u: 'BAC', b: 1, o: 'tup' }]),
        medijiOdgovora: tr(T, [{ d: 'Ab1', b: 4, isp: 1 }, { d: 'Ac1', b: 4, isp: 1 }, { d: 'Aa1', b: 1, crtaj: 1 }, { d: 'Bb1', b: 2, crtaj: 1, kasni: 0.8 }, { d: 'Cc1', b: 3, crtaj: 1, kasni: 1.4 }, { pu: 'Bb1C' }, { pu: 'Cc1B' }, { pu: 'Aa1B' }]) });
  }

  // ══════════ 24. Osnovne konstrukcije trougla ══════════
  L('Osnovne konstrukcije trougla');
  {
    const [A, B, Cc] = sss(5, 4, 6);
    Q(1, 'Koliko osnovnih elemenata ima trougao?',
      ['$6$', '$3$', '$4$', '$9$'],
      'Osnovni elementi su tri stranice ($a$, $b$, $c$) i tri unutrašnja ugla ($α$, $β$, $γ$). Da bi trougao bio određen, dovoljno je znati pravilno izabrana tri od njih.', 'element',
      { mediji: tr({ A, B, C: Cc }, [{ d: 'BC', o: 'a' }, { d: 'CA', o: 'b' }, { d: 'AB', o: 'c' }, { u: 'BAC', b: 1, o: 'α' }, { u: 'CBA', b: 2, o: 'β' }, { u: 'ACB', b: 3, o: 'γ' }]) });
  }
  {
    const A = [0, 0], B = [5, 0];
    const T = { A, B, 'C₁': naPravcu(A, 45, 4), 'C₂': naPravcu(A, 100, 4) };
    Q(1, 'Koliko najmanje elemenata trougla mora biti poznato da bi trougao bio potpuno određen?',
      ['$3$', '$2$', '$4$', '$6$'],
      'Sa samo dve stranice trougao još „klati“ – ugao između njih može biti bilo koji. Tek treći, dobro izabran element određuje oblik i veličinu.', 'tri',
      { mediji: G(T, [{ p: 'ABC₁', b: 0 }, { p: 'ABC₂', b: 2, prazno: 1 }, { d: 'AB', o: '5 cm' }, { d: 'AC₁', o: '4 cm' }, { d: 'AC₂', o: '4 cm' }], { velicina: 240 }) });
  }
  {
    const [A, B, Cc] = sss(5, 4, 6);
    Q(1, 'Na crtežu su istaknuti elementi za koje kažemo da su dati u konstrukciji. Kako se ovaj slučaj kratko označava?',
      ['SUS', 'USU', 'SSS', 'SSU'],
      'S je stranica, U je ugao. SUS: dve stranice i ugao između njih – kao šarka između dva kraka koja se zaključa.', 'stranica',
      { mediji: tr({ A, B, C: Cc }, [{ d: 'AB', b: 1, debljina: 5 }, { d: 'AC', b: 1, debljina: 5 }, { u: 'BAC', b: 2, r: 30 }]) });
    Q(1, 'Na crtežu su istaknuti dati elementi. Koji je to slučaj konstrukcije?',
      ['USU', 'SUS', 'SSS', 'SSU'],
      'Na krajevima date duži se konstruišu oba ugla, a kraci se seku u trećem temenu. Zbir ta dva ugla mora biti manji od $180°$.', 'nalegli',
      { mediji: tr({ A, B, C: Cc }, [{ d: 'AB', b: 1, debljina: 5 }, { u: 'BAC', b: 2, r: 30 }, { u: 'CBA', b: 2, r: 30 }]) });
  }
  S(2, 'Spoji oznaku sa podacima koji su dati za konstrukciju trougla.',
    [['SUS', 'dve stranice i ugao između njih'], ['USU', 'stranica i dva nalegla ugla'], ['SSS', 'sve tri stranice'], ['SSU', 'dve stranice i ugao naspram veće']],
    'Ista četiri slučaja kasnije postaju četiri stava podudarnosti trouglova: ako su ti podaci jednaki, trouglovi su podudarni.', 'stav');
  {
    const [A, B, Cc] = sus(4, 60, 5);
    Q(1, 'Pre crtanja se nacrta skica i obeleže dati podaci, pa se smišlja redosled koraka. Kako se zove taj deo konstrukcijskog zadatka?',
      ['Analiza', 'Dokaz', 'Diskusija', 'Provera'],
      'Konstrukcijski zadatak ima delove: analizu (skica i plan), konstrukciju, dokaz da je dobijeno ono što se traži i diskusiju (koliko rešenja ima i kada).', 'analiza',
      { mediji: G({ A, B, C: Cc }, [{ p: 'ABC', b: 4, prazno: 1, isp: 1 }, { d: 'AB', o: '5 cm', b: 1 }, { d: 'AC', o: '4 cm', b: 1 }, { u: 'BAC', o: '60°', b: 2 }], { velicina: 240 }) });
  }
  {
    const A = [0, 0], B = [5, 0], T = { A, B, a: naPravcu(A, 100, 4.5), b: naPravcu(B, 180 - 85, 4.5) };
    Q(2, 'Zadata je stranica i dva nalegla ugla, $100°$ i $85°$. Zašto se trougao ne može konstruisati?',
      ['Zbir uglova je veći od $180°$', 'Jedan ugao je tup', 'Uglovi nisu jednaki', 'Stranica je prekratka'],
      'Kraci uglova se seku samo ako je zbir dva ugla manji od $180°$. Ovde je $100° + 85° = 185°$, pa se kraci „razilaze“. Trougao sa jednim tupim uglom postoji, ali ne i sa dva.', 'zbir',
      { mediji: G(T, [{ d: 'AB', b: 0, debljina: 3 }, { d: 'Aa', b: 1, crtaj: 1 }, { d: 'Bb', b: 2, crtaj: 1, kasni: 0.8 }, { u: 'BAa', o: '100°', b: 1, r: 18 }, { u: 'bBA', o: '85°', b: 2, r: 26 }], { velicina: 240 }) });
  }
  {
    const T = { A: [0, 0], B: [8, 0] };
    Q(2, 'Pri konstrukciji trougla sa stranicama $3 cm$, $4 cm$ i $8 cm$ luci se ne seku. Koji uslov nije ispunjen?',
      ['Zbir dve kraće stranice mora biti veći od najduže', 'Sve stranice moraju biti različite', 'Najduža stranica mora biti bar dvaput duža', 'Stranice moraju biti parni brojevi'],
      'To je nejednakost trougla: $3 + 4 = 7 < 8$. Duž između dve tačke je najkraći put, pa „zaobilaznica“ preko trećeg temena mora biti duža.', 'nejednakost',
      { mediji: G(T, [{ d: 'AB', b: 0, debljina: 3, o: '8 cm' }, { l: 'A', r: 3, od: 0, do: 100, crtaj: 1, b: 1, o: '3 cm' }, { l: 'B', r: 4, od: 80, do: 180, crtaj: 1, kasni: 1, b: 2, o: '4 cm' }], { velicina: 280 }) });
  }
  {
    const A = [0, 0], B = [6, 0], Cc = presek(A, 5, B, 4, 1);
    const T = { A, B, C: Cc, m: [0, -1.5], n: [5, -1.5], p: [0, -2.5], q: [4, -2.5] };
    Q(2, 'Konstruiše se trougao kome su date sve tri stranice. Gde je treće teme $C$, kad je duž $AB$ već nacrtana?',
      ['U preseku dve kružnice (lukova)', 'Na simetrali duži $AB$', 'Na produžetku duži $AB$', 'U središtu duži $AB$'],
      'Teme $C$ je za $b$ udaljeno od $A$ i za $a$ od $B$, pa leži i na kružnici $k(A, b)$ i na kružnici $k(B, a)$ – dakle u njihovom preseku.', 'presek',
      { mediji: G(T, [{ d: 'AB', b: 0, debljina: 3 }, { d: 'mn', b: 1, debljina: 3, o: 'b' }, { d: 'pq', b: 2, debljina: 3, o: 'a' }], { velicina: 260, bezImena: ['C'] }),
        medijiOdgovora: G(T, [{ d: 'AB', b: 0, debljina: 3 }, { d: 'mn', b: 1, debljina: 3, o: 'b' }, { d: 'pq', b: 2, debljina: 3, o: 'a' },
          sestar(T, 'A', 5, Cc, { b: 1, raspon: 25 }), sestar(T, 'B', 4, Cc, { b: 2, raspon: 25, kasni: 1 }), { p: 'ABC', b: 3, prazno: 1, k: 0 }, { tacka: 'C', b: 3 }], { velicina: 260 }) });
  }
  {
    const A = [0, 0], B = [6, 0];
    const T = { A, B, 'C₁': presek(A, 5, B, 4, 1), 'C₂': presek(A, 5, B, 4, -1) };
    Q(2, 'Kružnice $k(A, b)$ i $k(B, a)$ seku se u dve tačke, sa obe strane duži $AB$. Koliko različitih (nepodudarnih) trouglova se dobija?',
      ['Jedan – dva dobijena su podudarna', 'Dva različita trougla', 'Nijedan trougao', 'Četiri trougla'],
      'Dva dobijena trougla su simetrična u odnosu na pravu $AB$ – presavijanjem se poklapaju. Zato se kaže da zadatak ima jedno rešenje.', 'simetrija',
      { mediji: G(T, [{ d: 'AB', b: 0, debljina: 3 }, { kr: 'A', r: 5, b: 1 }, { kr: 'B', r: 4, b: 2 }, { tacka: 'C₁', b: 3 }, { tacka: 'C₂', b: 3 }], { velicina: 240 }),
        medijiOdgovora: G(T, [{ kr: 'A', r: 5, b: 1 }, { kr: 'B', r: 4, b: 2 }, { p: 'ABC₂', b: 5, prazno: 1 }, { p: 'ABC₁', b: 3, odrazi: 'AB', kasni: 0.5 }], { velicina: 240 }) });
  }
  {
    const A = [0, 0], Cc = naPravcu(A, 40, 4), kos = Math.cos(rad(40)), dis = 64 * kos * kos - 28;
    const t1 = (8 * kos - Math.sqrt(dis)) / 2, t2 = (8 * kos + Math.sqrt(dis)) / 2;
    proveri(dis > 0 && t1 > 0, 'dva preseka');
    const T = { A, C: Cc, x: [6.5, 0], 'B₁': [r(t1), 0, -90], 'B₂': [r(t2), 0, -90] };
    Q(3, 'Dati su $AC = 4 cm$, $BC = 3 cm$ i ugao kod $A$ (naspram kraće stranice $BC$). Kružnica oko $C$ poluprečnika $3 cm$ seče krak ugla kao na crtežu. Koliko različitih trouglova $ABC$ postoji?',
      ['$2$', '$1$', '$0$', '$3$'],
      'Zato stav SSU traži ugao naspram veće stranice: tada kružnica seče krak samo u jednoj tački i trougao je jednoznačno određen.', 'dvosmislen',
      { mediji: G(T, [{ d: 'Ax', b: 0, debljina: 2.5 }, { d: 'AC', b: 0, debljina: 3, o: '4 cm' }, { u: 'xAC', b: 1, r: 26 }, { kr: 'C', r: 3, b: 4, crtaj: 1 }, { tacka: 'B₁', b: 3 }, { tacka: 'B₂', b: 3 }], { velicina: 260 }),
        medijiOdgovora: G(T, [{ p: 'AB₂C', b: 3, prazno: 1 }, { p: 'AB₁C', b: 2 }, { kr: 'C', r: 3, b: 4 }, { u: 'B₁AC', b: 1, r: 26 }], { velicina: 260 }) });
  }
  {
    const [A, B, Cc] = usu(6, 30, 30);
    Q(2, 'Konstruiše se jednakokraki trougao sa osnovicom $6 cm$ i uglom pri vrhu od $120°$. Koliki ugao treba konstruisati na krajevima osnovice?',
      ['$30°$', '$60°$', '$120°$', '$45°$'],
      'Uglovi na osnovici su jednaki: $(180° − 120°) : 2 = 30°$. Tako se zadatak svodi na konstrukciju po USU.', 'osnovica',
      { mediji: G({ A, B, C: Cc }, [{ p: 'ABC', b: 4, prazno: 1, isp: 1 }, { d: 'AB', o: '6 cm', b: 1 }, { u: 'BCA', o: '120°', b: 2 }, ...crt({ A, B, C: Cc }, 'AC', 1), ...crt({ A, B, C: Cc }, 'BC', 1)], { velicina: 260 }) });
  }
  Q(1, 'Pravougli trougao se konstruiše kada su date obe katete. Po kom slučaju (stavu)?',
    ['SUS', 'SSS', 'USU', 'SSU'],
    'Prav ugao je između kateta, pa su date dve stranice i ugao između njih. Prav ugao se konstruiše kao normala.', 'kateta',
    { mediji: G({ C: [0, 0], B: [4, 0], A: [0, 3] }, [{ p: 'ABC', b: 0 }, { pu: 'BCA' }, { d: 'BC', o: '4 cm', b: 1, debljina: 4 }, { d: 'CA', o: '3 cm', b: 1, debljina: 4 }], { velicina: 220 }) });
  {
    const T = { A: [0, 0], B: [2.5, 0], C: [0.9, 1.6], D: [4, 0], E: [9, 0], F: [5.8, 3.2] };
    Q(2, 'Koji od ovih podataka NE određuje trougao jednoznačno?',
      ['Sva tri ugla', 'Sve tri stranice', 'Stranica i dva nalegla ugla', 'Dve stranice i ugao između njih'],
      'Trouglovi sa istim uglovima mogu biti različite veličine – jedan je „uvećana kopija“ drugog. Takve trouglove zovemo slični, a o njima se uči u 8. razredu.', 'uglovi',
      { medijiOdgovora: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, ...lukovi('BAC', 1, 1), ...lukovi('EDF', 1, 1), ...lukovi('CBA', 2, 3), ...lukovi('FED', 2, 3)], { velicina: 280, bezImena: ['A', 'B', 'C', 'D', 'E', 'F'] }) });
  }
  {
    const T = { a: [0, 2], b: [4, 2], c: [0, 1], d: [5, 1], e: [0, 0], f: [9, 0] };
    const T2 = { A: [0, 0], B: [9, 0] };
    proveri(4 + 5 === 9, '4 + 5 = 9');
    Q(3, 'Pokušava se konstrukcija trougla sa stranicama $4 cm$, $5 cm$ i $9 cm$. Šta se dešava?',
      ['Luci se dodiruju na duži – trougla nema', 'Dobija se pravougli trougao', 'Dobijaju se dva različita trougla', 'Dobija se jednakokraki trougao'],
      'Pošto je $4 + 5 = 9$, luci se sreću baš na duži od $9 cm$ i „trougao“ je spljošten u duž. Nejednakost trougla traži da zbir bude strogo veći.', 'duž',
      { mediji: G(T, [{ d: 'ab', b: 1, debljina: 5, o: '4 cm' }, { d: 'cd', b: 2, debljina: 5, o: '5 cm' }, { d: 'ef', b: 0, debljina: 5, o: '9 cm' }], { velicina: 260 }),
        medijiOdgovora: G(T2, [{ d: 'AB', b: 0, debljina: 3, o: '9 cm' }, { l: 'A', r: 4, od: -40, do: 40, crtaj: 1, b: 1 }, { l: 'B', r: 5, od: 150, do: 210, crtaj: 1, kasni: 0.9, b: 2 }, { tx: '●', at: [4, 0], b: 3 }], { velicina: 280 }) });
  }
  Q(2, 'Leti se na nebu vidi „Letnji trougao“ od tri sjajne zvezde. Koje su to zvezde?',
    ['Vega, Deneb i Altair', 'Sirijus, Vega i Polarnica', 'Betelgez, Rigel i Sirijus', 'Polarnica, Deneb i Antares'],
    'Ove tri zvezde pripadaju sazvežđima Lira, Labud i Orao. Između njih se pruža Mlečni put, pa je trougao dobar putokaz za posmatranje neba.', 'zvezda',
    { mediji: G({ A: [0, 0], B: [5, 1], C: [1.5, 5] }, [{ p: 'ABC', b: 4, prazno: 1, isp: 1 }, { tx: '★', at: [0, 0], vel: 30, b: 3 }, { tx: '★', at: [5, 1], vel: 26, b: 3 }, { tx: '★', at: [1.5, 5], vel: 34, b: 3 }], { velicina: 220, bezImena: ['A', 'B', 'C'] }) });

  // ══════════ 25. Podudarnost trouglova ══════════
  L('Podudarnost trouglova');
  {
    const T = dva(5, 4, 6, 0, [7, 0.5]);
    Q(1, 'Kada kažemo da su dva trougla podudarna?',
      ['Kada se jedan može preneti tako da se poklopi sa drugim', 'Kada imaju isti obim', 'Kada imaju jednake uglove', 'Kada su oba jednakokraka'],
      'Podudarni trouglovi mogu biti na različitim mestima i različito okrenuti, ali se ne razlikuju ni po obliku ni po veličini – kao dva lista istog papira.', 'poklapanje',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }], { velicina: 280 }),
        medijiOdgovora: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2, prazno: 1 }, { p: 'ABC', b: 2, pomeri: [7, 0.5], kasni: 0.4 }], { velicina: 280 }) });
  }
  {
    const T = dva(5, 4, 6, 25, [7, 0]);
    Q(1, 'Kojim znakom se zapisuje da su trouglovi podudarni, kao „$△ABC$ ? $△DEF$“?',
      ['$≅$', '$=$', '$∼$', '$≈$'],
      'Znak $≅$ je spoj znaka $∼$ (isti oblik) i znaka $=$ (ista veličina). Znak $∼$ se koristi za slične trouglove, koji imaju isti oblik, a mogu biti različite veličine.', 'podudaran',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, { tx: '?', at: [5.6, 1.4], vel: 30, b: 3 }], { velicina: 280 }) });
  }
  {
    const T = dva(5, 4, 6, 0, [7, 0]);
    Q(1, 'Koliko parova jednakih osnovnih elemenata imaju dva podudarna trougla?',
      ['$6$', '$3$', '$4$', '$2$'],
      'Jednake su tri stranice i tri ugla. Ipak, da bismo dokazali podudarnost, dovoljno je proveriti tri dobro izabrana para – to kažu stavovi podudarnosti.', 'šest',
      { mediji: par(T, 'ABC', 'DEF', { stranice: [['AB', 'DE', 1], ['BC', 'EF', 2], ['CA', 'FD', 3]], uglovi: [['BAC', 'EDF', 1], ['CBA', 'FED', 2], ['ACB', 'DFE', 3]] }) });
  }
  {
    const T = dva(5, 4, 6, 140, [8, 2.5]);
    Q(2, 'Važi $△ABC ≅ △DEF$. Koja stranica trougla $DEF$ je jednaka stranici $BC$?',
      ['$EF$', '$DE$', '$DF$', '$CF$'],
      'Redosled slova u zapisu govori koja temena odgovaraju: $A → D$, $B → E$, $C → F$. Zato $BC$ odgovara $EF$, ma kako trouglovi bili okrenuti.', 'redosled',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, { d: 'BC', b: 1, debljina: 5 }], { velicina: 280 }) });
    Q(2, 'Važi $△ABC ≅ △DEF$. Koji ugao trougla $DEF$ je jednak uglu kod temena $B$?',
      ['$∠E$', '$∠D$', '$∠F$', '$∠C$'],
      'Temena se uparuju po mestu u zapisu: drugo slovo $B$ odgovara drugom slovu $E$. Na crtežu to nije uvek očigledno jer trougao može biti okrenut.', 'teme',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, { u: 'CBA', b: 1 }], { velicina: 280 }) });
  }
  {
    const T = dva(5, 4, 6, 120, [8, 2]);
    const Z0 = sred(T.A, T.B);
    Q(1, 'Dva trougla na crtežu su podudarna, ali različito okrenuta. Da li je to moguće?',
      ['Da, razlikuju se samo po položaju', 'Ne, moraju biti isto okrenuti', 'Samo ako su jednakostranični', 'Samo ako im je jedno teme zajedničko'],
      'Trougao možemo pomerati, okretati, pa i preslikati u ogledalu – dužine stranica i veličine uglova se pri tome ne menjaju.', 'položaj',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }], { velicina: 280 }),
        medijiOdgovora: G({ ...T, z: pomeriT(Z0, [8, 2]) }, [{ p: 'ABC', b: 0 }, { lin: [T.A, T.B, T.C].map((P) => pomeriT(P, [8, 2])), zatv: 1, b: 0, prazno: 1, isp: 1 }, { p: 'DEF', b: 2, okreni: -120, oko: 'z', kasni: 0.3 }], { velicina: 280 }) });
  }
  {
    const [A, B, Cc] = sss(4, 5, 6);
    const M = [7, -1], N = [7, 5];
    const T = { A, B, C: Cc, D: odraziT(A, M, N), E: odraziT(B, M, N), F: odraziT(Cc, M, N), m: M, n: N };
    Q(2, 'Trougao $DEF$ je slika trougla $ABC$ u ogledalu (osna simetrija). Da li su podudarni?',
      ['Da – presavijanjem preko ose se poklapaju', 'Ne – okrenuti su na suprotne strane', 'Samo ako je trougao jednakokraki', 'Samo ako je osa paralelna sa stranicom'],
      'Osna simetrija čuva dužine i uglove. Zato svaka figura i njena slika u ogledalu jesu podudarne, iako ih u ravni samo klizanjem ne možemo poklopiti.', 'ogledalo',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, { d: 'mn', b: 4, isp: 1 }], { velicina: 280 }),
        medijiOdgovora: G(T, [{ p: 'DEF', b: 2, prazno: 1 }, { d: 'mn', b: 4, isp: 1 }, { p: 'ABC', b: 0, odrazi: 'mn', kasni: 0.4 }], { velicina: 280 }) });
  }
  {
    const T = { A: [0, 0], B: [4, 0], C: [1.6, 3], D: [6, 0], E: [10, 0], F: [6, 3] };
    Q(2, 'Mogu li oštrougli i pravougli trougao biti podudarni?',
      ['Ne, jer im se uglovi razlikuju', 'Da, ako imaju isti obim', 'Da, ako im je jedna stranica ista', 'Samo ako su oba jednakokraka'],
      'Podudarni trouglovi imaju sve uglove jednake. Pravougli ima ugao od $90°$, a oštrougli nijedan – zato ne mogu biti podudarni. Isto važi i za par tupougli–oštrougli.', 'ugao',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, { pu: 'EDF' }], { velicina: 280, bezImena: ['A', 'B', 'C', 'D', 'E', 'F'] }) });
  }
  {
    const h = Math.sqrt(3) / 2;
    const T = { A: [0, 0], B: [5, 0], C: [2.5, r(5 * h)], D: [6.5, 0], E: [12.5, 0], F: [9.5, r(6 * h)] };
    Q(2, 'Dva jednakostranična trougla imaju stranice $5 cm$ i $6 cm$. Da li su podudarni?',
      ['Ne, stranice im nisu jednake', 'Da, svi uglovi su im po $60°$', 'Da, oba su pravilna', 'Samo ako su isto okrenuti'],
      'Isti uglovi ne znače podudarnost – potrebna je i ista veličina. Svi jednakostranični trouglovi su slični, ali su podudarni samo oni sa istom stranicom.', 'veličina',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, { d: 'AB', o: '5 cm' }, { d: 'DE', o: '6 cm' }], { velicina: 300, bezImena: ['A', 'B', 'C', 'D', 'E', 'F'] }) });
  }
  {
    // tangram (kvadrat 4×4)
    const del = [
      [[0, 0], [4, 0], [2, 2], 1], [[0, 0], [2, 2], [0, 4], 0], [[0, 4], [1, 3], [3, 3], [2, 4], 4],
      [[1, 3], [2, 2], [3, 3], 2], [[2, 2], [3, 1], [4, 2], [3, 3], 5], [[3, 1], [4, 0], [4, 2], 3], [[2, 4], [4, 4], [4, 2], 0],
    ];
    const pov = (pts) => Math.abs(pts.reduce((s, p, i) => s + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0)) / 2;
    proveri(del.reduce((s, d) => s + pov(d.filter((x) => Array.isArray(x))), 0) === 16, 'tangram pokriva kvadrat');
    Q(2, 'Tangram je slagalica od sedam delova. Koliko parova podudarnih trouglova ima među njima?',
      ['$2$', '$1$', '$3$', '$5$'],
      'Tangram ima $5$ trouglova: dva velika (podudarna), jedan srednji i dva mala (podudarna). Uz njih su kvadrat i paralelogram. Od ovih sedam delova može se složiti više od $6000$ figura.', 'tangram',
      { mediji: G({}, del.map((d) => ({ lin: d.filter((x) => Array.isArray(x)), zatv: 1, gusto: 1, b: d.at(-1) })), { velicina: 220 }) });
  }
  {
    const T = { A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], s: [2, 2] };
    Q(3, 'Kvadrat je dijagonalom podeljen na dva trougla. Kakvi su ti trouglovi?',
      ['Podudarni jednakokraki pravougli', 'Podudarni jednakostranični', 'Nepodudarni pravougli', 'Podudarni tupougli'],
      'Okretanjem za $180°$ oko centra kvadrata jedan trougao prelazi u drugi. Svaki ima prav ugao i dve jednake katete – stranice kvadrata.', 'dijagonala',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'CDA', b: 2 }], { velicina: 200 }),
        medijiOdgovora: G(T, [{ p: 'CDA', b: 2, prazno: 1 }, { p: 'ABC', b: 0, okreni: 180, oko: 's', kasni: 0.4 }, { pu: 'CDA' }], { velicina: 200, bezImena: ['s'] }) });
  }
  {
    const T = { ...dva(5, 4, 6, 0, [6.5, 0]) };
    const [K0, L0, M0] = [T.A, T.B, T.C].map((P) => pomeriT(okreniT(P, [0, 0], 200), [20, 3]));
    Object.assign(T, { K: K0, L: L0, M: M0 });
    Q(2, 'Važi $△ABC ≅ △DEF$ i $△DEF ≅ △KLM$. Šta važi za trouglove $ABC$ i $KLM$?',
      ['Podudarni su', 'Nisu podudarni', 'Podudarni su samo ako su pravougli', 'Ne može se znati'],
      'Ako se $ABC$ poklapa sa $DEF$, a $DEF$ sa $KLM$, onda se $ABC$ poklapa i sa $KLM$. Ovo svojstvo se zove tranzitivnost – ima ga i jednakost brojeva.', 'lanac',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, { p: 'KLM', b: 3 }], { velicina: 300 }) });
  }
  {
    const T = dva(5, 4, 6, 180, [12, 0]);
    Q(3, 'Zašto je važno kojim redom pišemo temena u zapisu $△ABC ≅ △DEF$?',
      ['Redosled kazuje koja temena odgovaraju jedno drugom', 'Redosled kazuje koji trougao je veći', 'Redosled kazuje smer okretanja', 'Nije važno – redosled je proizvoljan'],
      'Zapis $△ABC ≅ △EDF$ bi tvrdio nešto drugo: da je $AB = ED$ i $BC = DF$. Zato se temena pišu tako da odgovarajuća budu na istim mestima.', 'zapis',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }], { velicina: 280 }) });
  }
  {
    const T = dva(5, 4, 6, 70, [8, 1]);
    U(2, 'Koja tvrdnja je uljez – ne mora da važi za podudarne trouglove?',
      ['Imaju isti položaj u ravni', 'Imaju jednake obime', 'Imaju jednake površine', 'Imaju jednake odgovarajuće uglove'],
      'Podudarni trouglovi mogu biti bilo gde i bilo kako okrenuti. Obim, površina, stranice i uglovi su im jednaki.',
      'Kad fabrika pravi iste delove, ona pravi podudarne figure – zato rezervni deo odgovara na mesto starog.', 'položaj',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }], { velicina: 280 }) });
  }
  {
    // obojeni trougao i četiri kandidata; podudaran je trougao 3 (okrenut za 150°)
    const [A, B, Cc] = sss(3, 2.4, 3.6);
    const kand = [
      sss(3, 2.7, 3.6, { A: [4.6, 2.6] }),
      sss(3.4, 2.4, 3.6, { A: [9.2, 2.6] }),
      sss(3, 2.4, 3.6, { A: [8.4, 0.4], fi: 150 }),
      sss(3, 2.4, 3.2, { A: [10, -2.2] }),
    ];
    const T = { A, B, C: Cc };
    const e = [{ p: 'ABC', b: 1 }];
    kand.forEach((pts, i) => {
      const t = ['a', 'b', 'c'].map((x) => x + (i + 1));
      pts.forEach((P, j) => { T[t[j]] = P; });
      e.push({ p: t.join(''), b: 0, prazno: 1 }, { tx: String(i + 1), at: [r((pts[0][0] + pts[1][0] + pts[2][0]) / 3), r((pts[0][1] + pts[1][1] + pts[2][1]) / 3)], vel: 20, b: 3 });
    });
    // centar rotacije za 150° koja ABC prevodi u trougao 3: (I − R)·Z = pomeraj
    const cs = Math.cos(rad(150)), sn = Math.sin(rad(150)), [tx, ty] = [8.4, 0.4];
    const det = (1 - cs) * (1 - cs) + sn * sn;
    const z = [r(((1 - cs) * tx - sn * ty) / det), r((sn * tx + (1 - cs) * ty) / det)];
    proveri(Math.hypot(okreniT(B, z, 150)[0] - T.b3[0], okreniT(B, z, 150)[1] - T.b3[1]) < 0.02, 'centar rotacije');
    Q(2, 'Koji od numerisanih trouglova je podudaran sa obojenim?',
      ['Trougao 3', 'Trougao 1', 'Trougao 2', 'Trougao 4'],
      'Trougao 3 je samo okrenut. Ostali se od obojenog razlikuju po jednoj stranici – na oko teško primetno, ali pri preklapanju se ne poklope.', 'poređenje',
      { mediji: G(T, e, { velicina: 340, bezImena: ['A', 'B', 'C'] }),
        medijiOdgovora: G({ ...T, z }, [...e, { p: 'ABC', b: 1, okreni: 150, oko: 'z', kasni: 0.4, trajanje: 2 }], { velicina: 340, bezImena: ['A', 'B', 'C'] }) });
  }
  {
    const T = dva(5, 4, 6, 0, [7, 0]);
    Q(1, 'Šta u svakodnevnom govoru znači reč „podudaranje“, na primer „naša interesovanja se podudaraju“?',
      ['Poklapanje, slaganje', 'Razlikovanje', 'Uvećavanje', 'Okretanje'],
      'U geometriji je značenje isto: podudarne figure se potpuno poklapaju. Na latinskom se to kaže „congruens“, pa je i znak $≅$ u mnogim jezicima „kongruencija“.', 'poklapanje',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, { p: 'ABC', b: 0, pomeri: [7, 0], kasni: 0.6, prazno: 1, ponovi: 1 }], { velicina: 280, bezImena: ['A', 'B', 'C', 'D', 'E', 'F'] }) });
  }

  // ══════════ 26. Stavovi podudarnosti trouglova ══════════
  L('Stavovi podudarnosti trouglova');
  {
    const T = dva(5, 3.6, 5.6, 35, [8, 0.5]);
    Q(1, 'Jednakim brojem crtica i lukova označeni su jednaki elementi. Po kom stavu su trouglovi podudarni?',
      ['SUS', 'SSS', 'USU', 'SSU'],
      'Stav SUS: dva trougla su podudarna ako imaju jednake po dve stranice i ugao između njih. Pazi – ugao mora biti baš između tih stranica.', 'stav',
      { mediji: par(T, 'ABC', 'DEF', { stranice: [['AB', 'DE', 1], ['AC', 'DF', 2]], uglovi: [['BAC', 'EDF', 1]] }) });
    Q(1, 'Jednakim brojem crtica označene su jednake stranice. Po kom stavu su trouglovi podudarni?',
      ['SSS', 'SUS', 'USU', 'SSU'],
      'Stav SSS: ako su sve tri stranice jednake, jednaki su i svi uglovi. Zato je trougao „krut“ – rešetke mostova i dizalica grade se od trouglova.', 'krutost',
      { mediji: par(T, 'ABC', 'DEF', { stranice: [['AB', 'DE', 1], ['BC', 'EF', 2], ['CA', 'FD', 3]] }) });
    Q(1, 'Jednakim brojem crtica i lukova označeni su jednaki elementi. Po kom stavu su trouglovi podudarni?',
      ['USU', 'SUS', 'SSS', 'SSU'],
      'Stav USU: jednaka stranica i dva ugla koja na njoj leže. Ako znamo dva ugla, znamo i treći, pa je dovoljno i da je stranica naspram jednog od njih jednaka.', 'nalegli',
      { mediji: par(T, 'ABC', 'DEF', { stranice: [['AB', 'DE', 1]], uglovi: [['BAC', 'EDF', 1], ['CBA', 'FED', 2]] }) });
  }
  {
    // SSU: AB najduža, ugao kod C naspram nje
    const T = dva(4, 3.6, 6, 200, [10, 3]);
    Q(2, 'Jednako označeni su elementi oba trougla: dve stranice i ugao naspram duže od njih. Po kom stavu su trouglovi podudarni?',
      ['SSU', 'SUS', 'USU', 'SSS'],
      'Stav SSU: dve stranice i ugao naspram veće od njih. Ako bi ugao bio naspram manje stranice, mogla bi postojati dva različita trougla.', 'naspram',
      { mediji: par(T, 'ABC', 'DEF', { stranice: [['AB', 'DE', 1], ['BC', 'EF', 2]], uglovi: [['ACB', 'DFE', 1]] }) });
  }
  {
    const T = { A: [0, 0], B: [2.5, 0], C: [0.9, 1.8], D: [4, 0], E: [9, 0], F: [7.2, 3.6] };
    Q(2, 'Trouglovi na crtežu imaju jednake sva tri ugla. Da li su sigurno podudarni?',
      ['Ne moraju biti – mogu biti različite veličine', 'Da, po stavu UUU', 'Da, jer im je i obim isti', 'Da, ako su oba oštrougla'],
      'UUU nije stav podudarnosti. Trouglovi sa istim uglovima su slični – kao fotografija i njeno uvećanje.', 'sličnost',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, ...lukovi('BAC', 1, 1), ...lukovi('EDF', 1, 1), ...lukovi('CBA', 2, 3), ...lukovi('FED', 2, 3), ...lukovi('ACB', 3, 5), ...lukovi('DFE', 3, 5)], { velicina: 300, bezImena: ['A', 'B', 'C', 'D', 'E', 'F'] }) });
  }
  {
    const T = { A: [0, 0], B: [6, 0], C: [3, 5], D: [3, 0, -90] };
    Q(2, 'U jednakokrakom trouglu $ABC$ ($AC = BC$) povučena je simetrala ugla pri vrhu $C$. Po kom stavu su trouglovi $ADC$ i $BDC$ podudarni?',
      ['SUS', 'SSS', 'USU', 'SSU'],
      'Kraci $AC = BC$, uglovi kod $C$ su jednaki (simetrala), a $DC$ je zajednička. Iz podudarnosti sledi $AD = BD$: simetrala ugla pri vrhu polovi osnovicu.', 'simetrala',
      { mediji: G(T, [{ p: 'ADC', b: 0 }, { p: 'BDC', b: 2 }, ...crt(T, 'AC', 1), ...crt(T, 'BC', 1), ...lukovi('ACD', 1, 1, { r: 30 }), ...lukovi('DCB', 1, 1, { r: 30 })], { velicina: 240 }) });
    Q(3, 'U jednakokrakom trouglu $ABC$ ($AC = BC$) povučena je visina $CD$. Po kom stavu su trouglovi $ADC$ i $BDC$ podudarni?',
      ['SSU', 'SUS', 'SSS', 'USU'],
      'Jednaki su kraci $AC = BC$ i zajednička stranica $CD$, a prav ugao kod $D$ je naspram kraka – veće stranice (krak je hipotenuza). Zato visina polovi osnovicu.', 'visina',
      { mediji: G(T, [{ p: 'ADC', b: 0 }, { p: 'BDC', b: 2 }, ...crt(T, 'AC', 1), ...crt(T, 'BC', 1), { pu: 'ADC' }, { pu: 'CDB' }], { velicina: 240 }) });
  }
  {
    const T = { P: [0, 0, 0], N: [-2.4, -1], R: [2.4, 1], M: [-2.0, 2.2], S: [2.0, -2.2] };
    Q(2, 'Na crtežu je $NP = RP$ i $∠N = ∠R$, a uglovi kod $P$ su unakrsni. Po kom stavu je $△MNP ≅ △SRP$?',
      ['USU', 'SUS', 'SSS', 'SSU'],
      'Unakrsni uglovi su uvek jednaki – to je čest „skriveni“ podatak u dokazima. Zajedno sa stranicom $NP = RP$ i uglovima kod $N$ i $R$ daje USU.', 'unakrsni',
      { mediji: G(T, [{ p: 'MNP', b: 0 }, { p: 'SRP', b: 2 }, ...crt(T, 'NP', 1), ...crt(T, 'RP', 1), { u: 'PNM', b: 1 }, { u: 'PRS', b: 1 }, { u: 'NPM', b: 3, r: 18 }, { u: 'RPS', b: 3, r: 18 }], { velicina: 260 }) });
  }
  {
    const [A, B, Cc] = usu(5, 40, 50);
    const T = { A, B, C: Cc, D: pomeriT(okreniT(A, [0, 0], 180), [12, 3]), E: pomeriT(okreniT(B, [0, 0], 180), [12, 3]), F: pomeriT(okreniT(Cc, [0, 0], 180), [12, 3]) };
    Q(2, 'Dva pravougla trougla imaju jednake hipotenuze i po jedan oštar ugao. Po kom stavu su podudarni?',
      ['USU', 'SUS', 'SSS', 'SSU'],
      'Drugi oštar ugao je u oba trougla $90°$ minus dati, pa su jednaka oba ugla na hipotenuzi – to je stav USU.', 'hipotenuza',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, { pu: 'ACB' }, { pu: 'DFE' }, ...crt(T, 'AB', 1), ...crt(T, 'DE', 1), ...lukovi('BAC', 1, 1), ...lukovi('EDF', 1, 1)], { velicina: 300 }) });
  }
  {
    const A = [0, 0], Cc = naPravcu(A, 40, 4), kos = Math.cos(rad(40)), dis = 64 * kos * kos - 28;
    const t1 = (8 * kos - Math.sqrt(dis)) / 2, t2 = (8 * kos + Math.sqrt(dis)) / 2;
    const T = { A, C: Cc, B: [r(t1), 0, -90], D: [r(t2), 0, -90] };
    Q(3, 'Trouglovi $ABC$ i $ADC$ imaju zajedničku stranicu $AC$, isti ugao kod $A$ i $CB = CD$, ali ugao kod $A$ je naspram kraće stranice. Da li su podudarni?',
      ['Ne – zato SSU traži ugao naspram veće', 'Da, po stavu SSU', 'Da, po stavu SUS', 'Da, po stavu SSS'],
      'Crtež je kontraprimer: tri para jednakih elemenata, a trouglovi su različiti. Jedan kontraprimer je dovoljan da obori tvrđenje.', 'primer',
      { mediji: G(T, [{ p: 'ADC', b: 2, prazno: 1 }, { p: 'ABC', b: 0 }, ...crt(T, 'CB', 1), ...crt(T, 'CD', 1), { u: 'BAC', b: 1, r: 26 }, { kr: 'C', r: 3, b: 4, isp: 1 }], { velicina: 260 }) });
  }
  Q(1, 'Šta znači znak $⇒$ u zapisu dokaza podudarnosti?',
    ['„Iz toga sledi“', '„Jednako je“', '„Podudarno je“', '„Paralelno je“'],
    'Dokaz se piše kao niz od tri jednakosti, pa stav u zagradi i znak $⇒$: „iz ovih jednakosti, po stavu SUS, sledi da su trouglovi podudarni“.', 'dokaz',
    { mediji: { vrsta: 'formula', tekst: 'AB = DE, ∠A = ∠D, AC = DF (SUS) ⇒ △ABC ≅ △DEF' } });
  S(2, 'U dokazima se uz svaku jednakost piše razlog. Spoji jednakost sa razlogom.',
    [['$OA = OB$ (centar kružnice $O$)', 'poluprečnici kružnice'], ['$∠AOC = ∠BOD$ (prave se seku u $O$)', 'unakrsni uglovi'], ['$DC = DC$', 'zajednička stranica'], ['$AC = BC$ u jednakokrakom trouglu', 'kraci trougla'], ['$AB = CD$ u pravougaoniku $ABCD$', 'naspramne stranice']],
    'Dobar dokaz ne preskače korake: svaka jednakost mora imati razlog – podatak iz zadatka ili ranije poznato svojstvo figure.', 'razlog');
  U(1, 'Koji je uljez – NIJE stav podudarnosti trouglova?',
    ['UUU', 'SSS', 'SUS', 'USU'],
    'Tri jednaka ugla ne garantuju istu veličinu trougla. Stavovi podudarnosti su SUS, USU, SSS i SSU.',
    'U svakom stavu bar jedan od tri podatka mora biti stranica – ona „zaključava“ veličinu trougla.', 'stav',
    { mediji: G({ A: [0, 0], B: [2.5, 0], C: [0.9, 1.8], D: [4, 0], E: [9, 0], F: [7.2, 3.6] }, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }], { velicina: 260, bezImena: ['A', 'B', 'C', 'D', 'E', 'F'] }) });
  {
    const T = { A: [0, 0], B: [2.2, -2.6], C: [7, 0], D: [2.2, 2.6] };
    Q(2, 'U četvorouglu $ABCD$ je $AB = AD$ i $CB = CD$. Po kom stavu je $△ABC ≅ △ADC$?',
      ['SSS', 'SUS', 'USU', 'SSU'],
      'Treća stranica $AC$ je zajednička. Takav četvorougao se zove deltoid – kao zmaj od papira – a iz podudarnosti sledi da je $AC$ njegova osa simetrije.', 'deltoid',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'ADC', b: 2 }, { d: 'AC', b: 4, isp: 1 }, ...crt(T, 'AB', 1), ...crt(T, 'AD', 1), ...crt(T, 'CB', 2, { b: 5 }), ...crt(T, 'CD', 2, { b: 5 })], { velicina: 260 }) });
  }
  {
    const O = [0, 0], T = { O: [0, 0, -90], A: naPravcu(O, 165, 4), B: naPravcu(O, 110, 4), C: naPravcu(O, 55, 4) };
    Q(3, 'Tačke $A$, $B$, $C$ su na kružnici sa centrom $O$ i $AB = BC$. Dokazuje se $△OAB ≅ △OCB$ po SSS. Koja stranica je zajednička za oba trougla?',
      ['$OB$', '$OA$', '$OC$', '$AC$'],
      'U dokazu se koriste: $OA = OC$ (poluprečnici), $AB = CB$ (dato) i zajednička stranica $OB$. Odatle sledi i da $OB$ polovi ugao $AOC$.', 'zajednička',
      { mediji: G(T, [{ kr: 'O', r: 4, b: 4 }, { p: 'OAB', b: 0 }, { p: 'OCB', b: 2 }, ...crt(T, 'AB', 1), ...crt(T, 'BC', 1)], { velicina: 240 }) });
  }
  {
    const T = { C: [0, 0], B: [4, 0], A: [0, 3], F: [9, 0], E: [9, 4], D: [6, 0] };
    Q(3, 'Dva pravougla trougla imaju jednake hipotenuze i po jednu jednaku katetu. Da li su podudarni?',
      ['Da, po SSU – prav ugao je naspram hipotenuze', 'Ne moraju biti podudarni', 'Da, po stavu SUS', 'Da, ali samo ako su jednakokraki'],
      'Hipotenuza je najduža stranica pravouglog trougla, a prav ugao je naspram nje – zato je ovo slučaj SSU sa uglom naspram veće stranice.', 'hipotenuza',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 2 }, { pu: 'BCA' }, { pu: 'DFE' }, ...crt(T, 'AB', 1), ...crt(T, 'DE', 1), ...crt(T, 'BC', 2, { b: 5 }), ...crt(T, 'EF', 2, { b: 5 })], { velicina: 280, bezImena: ['A', 'B', 'C', 'D', 'E', 'F'] }) });
  }

  // ══════════ 27. Primene stavova podudarnosti ══════════
  L('Primene stavova podudarnosti');
  {
    const T = { A: [0, 0], B: [6, 0], M: [3, 3.5], s: [3, 0], m: [3, -1], n: [3, 4.8] };
    Q(1, 'Tačka $M$ je na simetrali duži $AB$. Od čega je ona jednako udaljena?',
      ['Od krajeva duži $A$ i $B$', 'Od središta duži i od $A$', 'Od prave $AB$ i od $B$', 'Ni od čega posebno'],
      'Trouglovi $ASM$ i $BSM$ ($S$ je središte) podudarni su po SUS, pa je $MA = MB$. Važi i obrnuto: tačka jednako udaljena od $A$ i $B$ je na simetrali.', 'simetrala',
      { mediji: G(T, [{ d: 'AB', b: 0, debljina: 3 }, { d: 'mn', b: 1 }, { pu: 'Bsn' }, { tacka: 'M', b: 3 }, { d: 'MA', b: 2, isp: 1 }, { d: 'MB', b: 2, isp: 1 }], { velicina: 240 }) });
  }
  {
    const O = [0, 0], T = { O, x: [6, 0], y: naPravcu(O, 64, 6), M: naPravcu(O, 32, 4.4) };
    T.P = noga(T.M, O, T.x); T.Q = noga(T.M, O, T.y);
    Q(1, 'Tačka $M$ je na simetrali ugla $xOy$. Od čega je ona jednako udaljena?',
      ['Od oba kraka ugla', 'Od temena i jednog kraka', 'Od temena $O$ i simetrale', 'Samo od kraka $Ox$'],
      'Rastojanje tačke od prave meri se po normali. Trouglovi $OPM$ i $OQM$ su podudarni (USU), pa je $MP = MQ$.', 'krak',
      { mediji: G(T, [{ d: 'Ox', b: 0, debljina: 3 }, { d: 'Oy', b: 0, debljina: 3 }, { d: 'OM', b: 1 }, { d: 'MP', b: 2, isp: 1 }, { d: 'MQ', b: 2, isp: 1 }, { pu: 'OPM' }, { pu: 'MQO' }], { velicina: 260, bezImena: ['P', 'Q'] }) });
  }
  {
    const A = [0, 0], B = [6, 0], Cc = [2, 3.8];
    const { O, R: Rk } = opisana(A, B, Cc), { S: Si, r: rk } = upisana(A, B, Cc);
    const T = { A, B, C: Cc, O, S: Si };
    Q(1, 'Kako se nalazi centar kružnice opisane oko trougla?',
      ['U preseku simetrala stranica', 'U preseku simetrala uglova', 'U preseku visina', 'Na sredini najduže stranice'],
      'Centar je jednako udaljen od sva tri temena, pa mora biti na sve tri simetrale stranica. Dovoljno je konstruisati dve – treća prolazi kroz istu tačku.', 'opisana',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { kr: 'O', r: Rk, b: 1 }], { velicina: 240, bezImena: ['O'] }),
        medijiOdgovora: G(T, [{ p: 'ABC', b: 0 }, ...simetralaEl(T, 'A', 'B', { boja: 2 }), ...simetralaEl(T, 'B', 'C', { kasni: 2.8, boja: 3 }), { kr: 'O', r: Rk, b: 1 }, { tacka: 'O', b: 1 }], { velicina: 240 }) });
    const sa = simetralaUglaEl(T, 'A', 'B', 'C', { boja: 2, duz: 0.7 }), sb = simetralaUglaEl(T, 'B', 'C', 'A', { kasni: 2.6, boja: 3, duz: 0.75 });
    Q(1, 'Kako se nalazi centar kružnice upisane u trougao?',
      ['U preseku simetrala uglova', 'U preseku simetrala stranica', 'U preseku visina', 'U središtu najduže stranice'],
      'Centar upisane kružnice je jednako udaljen od sve tri stranice, a takve tačke leže na simetralama uglova.', 'upisana',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { kr: 'S', r: rk, b: 1 }], { velicina: 240, bezImena: ['S'] }),
        medijiOdgovora: G({ ...T, ...sa.t, v1: sb.t.u1, v2: sb.t.u2 }, [{ p: 'ABC', b: 0 }, ...sa.e, ...sb.e.map((x) => (x.l === 'u1' ? { ...x, l: 'v1' } : x.l === 'u2' ? { ...x, l: 'v2' } : x)), { kr: 'S', r: rk, b: 1 }, { tacka: 'S', b: 1 }], { velicina: 240 }) });
  }
  S(2, 'Spoji pojam sa njegovim svojstvom.',
    [['opisana kružnica', 'prolazi kroz sva tri temena'], ['upisana kružnica', 'dodiruje sve tri stranice'], ['simetrala duži', 'tačke jednako udaljene od krajeva'], ['simetrala ugla', 'tačke jednako udaljene od krakova']],
    'Oba centra se dobijaju iz istog principa: tražimo tačku jednako udaljenu od tri temena (opisana) ili od tri stranice (upisana).', 'kružnica',
    { mediji: (() => { const A = [0, 0], B = [6, 0], Cc = [2.2, 4]; const o = opisana(A, B, Cc), u = upisana(A, B, Cc); return G({ A, B, C: Cc, O: o.O, S: u.S }, [{ p: 'ABC', b: 0 }, { kr: 'O', r: o.R, b: 1 }, { kr: 'S', r: u.r, b: 2 }], { velicina: 240, bezImena: ['O', 'S'] }); })() });
  {
    const T = { C: [0, 0, 225], B: [5, 0], A: [0, 3.6] };
    const M = sred(T.A, T.B);
    Q(2, 'Gde je centar kružnice opisane oko pravouglog trougla?',
      ['U središtu hipotenuze', 'U temenu pravog ugla', 'Na sredini duže katete', 'Van trougla'],
      'Zato je hipotenuza prečnik opisane kružnice. Obrnuto: svaki trougao čije je jedno teme na kružnici, a naspramna stranica prečnik, je pravougli (Talesova teorema).', 'hipotenuza',
      { mediji: tr(T, [{ pu: 'BCA' }]), medijiOdgovora: tr({ ...T, O: [M[0], M[1], 45] }, [{ pu: 'BCA' }, { tacka: 'O', b: 1 }, { kr: 'O', kroz: 'C', b: 1, crtaj: 1 }, { d: 'OC', b: 2, isp: 1 }]) });
  }
  {
    const A = [0, 0], B = [7, 0], Cc = [1.8, 1.6];
    const { O, R: Rk } = opisana(A, B, Cc);
    const T = { A, B, C: Cc, O };
    Q(2, 'Gde se nalazi centar kružnice opisane oko tupouglog trougla?',
      ['Van trougla', 'U unutrašnjosti trougla', 'Na najdužoj stranici', 'U temenu tupog ugla'],
      'Kod oštrouglog trougla centar opisane kružnice je unutra, kod pravouglog na hipotenuzi, a kod tupouglog van trougla – iza najduže stranice.', 'tupougli',
      { mediji: tr(T, [{ u: 'ACB', b: 1, o: 'tup', r: 16 }], { velicina: 260 }), medijiOdgovora: G(T, [{ p: 'ABC', b: 0 }, { kr: 'O', r: Rk, b: 1, crtaj: 1 }, { tacka: 'O', b: 1 }, { d: 'OA', b: 2, isp: 1 }, { d: 'OB', b: 2, isp: 1 }, { d: 'OC', b: 2, isp: 1 }], { velicina: 260 }) });
    const { S: Si, r: rk } = upisana(A, B, Cc);
    Q(2, 'Gde je centar kružnice upisane u tupougli trougao?',
      ['Uvek u unutrašnjosti trougla', 'Van trougla', 'Na najdužoj stranici', 'U temenu tupog ugla'],
      'Upisana kružnica dodiruje sve tri stranice iznutra, pa je i njen centar uvek unutra – kod svakog trougla, ma kakvi bili uglovi.', 'unutra',
      { mediji: tr(T, [{ u: 'ACB', b: 1, o: 'tup', r: 16 }], { velicina: 260 }), medijiOdgovora: G({ A, B, C: Cc, S: Si }, [{ p: 'ABC', b: 0 }, { kr: 'S', r: rk, b: 1, crtaj: 1 }, { tacka: 'S', b: 1 }], { velicina: 260 }) });
  }
  {
    const A = [0, 0], B = [6, 0], Cc = [4, 3.6];
    const { O, R: Rk } = opisana(A, B, Cc);
    const T = { A, B, C: Cc, O };
    Q(2, 'Koliko simetrala stranica je dovoljno konstruisati da bi se našao centar opisane kružnice?',
      ['$2$', '$3$', '$1$', '$4$'],
      'Ako je tačka na simetrali $AB$ i na simetrali $BC$, onda je $OA = OB$ i $OB = OC$, pa je i $OA = OC$ – automatski je i na trećoj simetrali.', 'dve',
      { mediji: tr(T, [], { bezImena: ['O'] }), medijiOdgovora: G(T, [{ p: 'ABC', b: 0 }, ...simetralaEl(T, 'A', 'B', { boja: 2 }), ...simetralaEl(T, 'B', 'C', { kasni: 2.8, boja: 3 }), { kr: 'O', r: Rk, b: 1, k: 0 }], { velicina: 240 }) });
  }
  {
    const Tt = [0, 0], N = [6, 0], Lp = [2, 4.5];
    const { O } = opisana(Tt, N, Lp);
    Q(2, 'Tri drugarice stoje u temenima trougla. Četvrta želi da stane tako da bude jednako udaljena od sve tri. Gde treba da stane?',
      ['U preseku simetrala stranica', 'U preseku simetrala uglova', 'Na sredini najduže stranice', 'U temenu najvećeg ugla'],
      'To je centar opisane kružnice. Da je htela da bude jednako udaljena od stranica (linija između drugarica), stala bi u centar upisane kružnice – u opštem slučaju to su različite tačke.', 'drugarica',
      { mediji: G({ A: Tt, B: N, C: Lp, V: O }, [{ p: 'ABC', b: 4, prazno: 1, isp: 1 }, { tx: '👧', at: Tt, vel: 28 }, { tx: '👧', at: N, vel: 28 }, { tx: '👧', at: Lp, vel: 28 }, { tx: '❓', at: [O[0], O[1] - 0.2], vel: 24 }], { velicina: 240, bezImena: ['A', 'B', 'C', 'V'] }) });
  }
  {
    const A = [0, 0], B = [6, 0], Cc = [3, r(3 * Math.sqrt(3))];
    const { O, R: Rk } = opisana(A, B, Cc), { r: rk } = upisana(A, B, Cc);
    Q(3, 'Šta važi za centre opisane i upisane kružnice jednakostraničnog trougla?',
      ['Poklapaju se', 'Opisani je van trougla', 'Upisani je na jednoj stranici', 'Udaljeni su za pola stranice'],
      'U jednakostraničnom trouglu simetrala svake stranice je i simetrala naspramnog ugla, pa obe vrste pravih idu kroz istu tačku. Poluprečnik opisane je tada dvaput veći od upisane.', 'centar',
      { mediji: tr({ A, B, C: Cc }), medijiOdgovora: G({ A, B, C: Cc, O }, [{ p: 'ABC', b: 0 }, { kr: 'O', r: Rk, b: 1, crtaj: 1 }, { kr: 'O', r: rk, b: 2, crtaj: 1, kasni: 1 }, { tacka: 'O', b: 3 }], { velicina: 240 }) });
    proveri(Math.abs(Rk - 2 * rk) < 0.02, 'R = 2r u jednakostraničnom');
  }
  {
    const A = [0, 0], B = [3, 1.5], O = [4, -1];
    const T = { A, B, O, 'A₁': okreniT(A, O, 180), 'B₁': okreniT(B, O, 180) };
    Q(2, 'Duž $AB$ preslikana je centralnom simetrijom (oko tačke $O$) u duž $A₁B₁$. Šta važi za njihove dužine?',
      ['Jednake su (dokaz preko SUS)', '$A₁B₁$ je dvaput duža', '$A₁B₁$ je upola kraća', 'Zavisi od položaja tačke $O$'],
      'Trouglovi $AOB$ i $A₁OB₁$: $OA = OA₁$, $OB = OB₁$ i unakrsni uglovi kod $O$ – SUS. Zato centralna simetrija čuva dužine, a figura i njena slika su podudarne.', 'centralna',
      { mediji: G(T, [{ d: 'AB', b: 0, debljina: 4 }, { tacka: 'O', b: 3 }, { d: 'AA₁', b: 4, isp: 1 }, { d: 'BB₁', b: 4, isp: 1 }, { d: 'A₁B₁', b: 2, debljina: 4 }], { velicina: 260 }),
        medijiOdgovora: G(T, [{ d: 'A₁B₁', b: 2, debljina: 4 }, { tacka: 'O', b: 3 }, { p: 'AOB', b: 1 }, { p: 'A₁OB₁', b: 2 }, { d: 'AB', b: 0, debljina: 4, okreni: 180, oko: 'O', kasni: 0.4, trajanje: 1.8 }], { velicina: 260 }) });
  }
  {
    const T = { C: [0, 0], A: [r(7.2 * Math.cos(rad(30))), 0], B: [0, 3.6], b: [0, -3.6] };
    Q(3, 'U pravouglom trouglu jedan oštar ugao je $30°$. Kolika je kateta naspram tog ugla?',
      ['Polovina hipotenuze', 'Trećina hipotenuze', 'Jednaka hipotenuzi', 'Polovina druge katete'],
      'Kad trougao „preslikamo u ogledalu“ preko duže katete, dobija se jednakostranični trougao (uglovi $60°$, $60°$, $60°$). Kratka kateta je polovina njegove stranice, a ta stranica je hipotenuza.', 'polovina',
      { mediji: G(T, [{ p: 'ABC', b: 0 }, { pu: 'ACB' }, { u: 'CAB', o: '30°', b: 1, r: 34 }], { velicina: 240, bezImena: ['b'] }),
        medijiOdgovora: G(T, [{ p: 'ABC', b: 0 }, { pu: 'ACB' }, { u: 'CAB', o: '30°', b: 1, r: 34 }, { p: 'ABC', b: 2, prazno: 1, odrazi: 'AC', kasni: 0.4 }, { d: 'BC', b: 3, debljina: 5 }], { velicina: 240, bezImena: ['b'] }) });
  }
  {
    const T = { A: [0, 0, 200], T: [0, 5.2], O: [3, 0, 80], C: [6, 0, 20], D: [6, -5.2], r1: [-1, 0.5], r2: [7, 0.5], r3: [-1, 4.4], r4: [7, 4.4] };
    Q(3, 'Širina reke $AT$ meri se na suvom: $AO = OC$, uglovi kod $A$ i $C$ su pravi, a $D$ je tačka iz koje se drvo $T$ i štap $O$ vide u pravoj liniji. Po kom stavu je $△OAT ≅ △OCD$?',
      ['USU', 'SUS', 'SSS', 'SSU'],
      'Jednaki su stranica $OA = OC$, pravi uglovi kod $A$ i $C$ i unakrsni uglovi kod $O$ – stranica i dva nalegla ugla. Zato je $AT = CD$. Ovako su se merile širine reka još u starom veku.', 'reka',
      { mediji: G(T, [{ lin: [T.r1, T.r2, T.r4, T.r3], zatv: 1, b: 0 }, { tx: '~reka', at: [5.8, 2.6], b: 0 }, { tx: '🌳', at: [0, 5.6], vel: 22 },
        { p: 'OAT', b: 1 }, { p: 'OCD', b: 2 }, { pu: 'OAT' }, { pu: 'OCD' }, ...crt(T, 'AO', 1), ...crt(T, 'OC', 1), { u: 'TOA', b: 3, r: 18 }, { u: 'DOC', b: 3, r: 18 }], { velicina: 260 }) });
  }
  U(2, 'Koja tvrdnja je uljez – nije tačna?',
    ['Centar upisane kružnice može biti van trougla', 'Centar opisane kružnice može biti van trougla', 'Simetrale stranica seku se u jednoj tački', 'Simetrale uglova seku se u jednoj tački'],
    'Upisana kružnica je uvek unutar trougla, pa je i njen centar uvek unutra. Centar opisane je van trougla kod tupouglih trouglova.',
    'I visine (tačnije, prave na kojima leže) seku se u jednoj tački, a seku se i težišne duži – trougao ima mnogo „značajnih tačaka“.', 'tvrdnja');
  {
    const A = [0, 0], B = [6, 0], Cc = [1.5, 4];
    const { S: Si, r: rk } = upisana(A, B, Cc);
    const M = noga(Si, A, B);
    const T = { A, B, C: Cc, S: Si, M: [M[0], M[1], -90] };
    Q(3, 'Kako se dobija poluprečnik upisane kružnice kada je njen centar $S$ već konstruisan?',
      ['Normalom iz $S$ na jednu stranicu', 'Spajanjem $S$ sa jednim temenom', 'Kao polovina najkraće stranice', 'Spajanjem $S$ sa središtem stranice'],
      'Kružnica dodiruje stranicu u podnožju normale iz centra. To podnožje u opštem slučaju nije središte stranice – samo kod jednakostraničnog trougla jeste.', 'normala',
      { mediji: G({ A, B, C: Cc, S: Si }, [{ p: 'ABC', b: 0 }, { tacka: 'S', b: 1 }], { velicina: 240 }),
        medijiOdgovora: G(T, [{ p: 'ABC', b: 0 }, { tacka: 'S', b: 1 }, { d: 'SM', b: 2, debljina: 3, crtaj: 1 }, { pu: 'SMB' }, { kr: 'S', r: rk, b: 1, crtaj: 1, kasni: 1 }], { velicina: 240 }) });
  }
  {
    const O = [0, 0], T = { O: [0, 0, -90], A: naPravcu(O, 200, 4), B: naPravcu(O, 140, 4), C: naPravcu(O, 50, 4), D: naPravcu(O, -10, 4) };
    Q(2, 'U kružnici sa centrom $O$ centralni uglovi $AOB$ i $COD$ su jednaki. Šta važi za tetive $AB$ i $CD$?',
      ['Jednake su (trouglovi su podudarni po SUS)', 'Tetiva $AB$ je duža', 'Paralelne su', 'Normalne su jedna na drugu'],
      'Važi i obrnuto: jednakim tetivama odgovaraju jednaki centralni uglovi (stav SSS). Na tome počiva podela kružnice na jednake delove, npr. kod brojčanika sata.', 'tetiva',
      { mediji: G(T, [{ kr: 'O', r: 4, b: 4 }, { p: 'AOB', b: 0 }, { p: 'COD', b: 2 }, ...lukovi('BOA', 1, 1), ...lukovi('DOC', 1, 1)], { velicina: 240 }) });
  }
};
