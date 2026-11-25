// Valjak, kupa, lopta – deo o lopti i upisanim telima (8. razred): osnovni elementi, ravni preseci,
// površina i zapremina, upisana i opisana tela. Pitanja su sopstvenim rečima, po gradivu udžbenika
// (Matematika 8, 2. deo, str. 147–158); crteži su medij „geo“ i 3D pogled (prostor.js).
module.exports = ({ L, Q, U, S, G, proveri, prostor, elipsa3, kocka, valjak, kupa }) => {
  const rad = (u) => (u * Math.PI) / 180;
  const r = (x) => +(+x).toFixed(3);
  const V = (x = {}) => ({ velicina: 240, ...x });
  // tačka na krugu poluprečnika R (2D, ugao u stepenima; svaka takva tačka je na konturi lopte)
  const pt = (R, u) => [r(R * Math.cos(rad(u))), r(R * Math.sin(rad(u)))];
  const tx = (t, at, x = {}) => ({ tx: t, at, ...x });

  // ── crteži lopte u prostoru ──
  // lopta (centar O, poluprečnik R): kontura, ekvator (prednji pun, zadnji isprekidan)
  // x.T3 – dodatne tačke (2D ili 3D); x.imena – koja imena se vide (ostala se kriju)
  function sfera(R, e = [], x = {}) {
    const b = x.b ?? 0;
    const T3 = { O: [0, 0, 0], ...(x.T3 || {}) };
    const el = [{ kr: 'O', r: R, b, pun: 1 }, ...(x.ekvator === false ? [] : elipsa3([0, 0, 0], R, { b })), ...e];
    const skriveni = Object.keys(T3).filter((n) => !(x.imena || []).includes(n));
    return prostor(T3, el, { velicina: x.velicina || 240, bezImena: skriveni });
  }
  // presek lopte (R) ravni na visini d iznad centra: krug poluprečnika w = √(R² − d²) + vertikala od O
  function presek3(R, d, e = [], x = {}) {
    const w = Math.sqrt(R * R - d * d);
    const el = [
      ...elipsa3([0, 0, d], w, { b: 1 }),
      ...(d ? [{ lin3: [[0, 0, 0], [0, 0, d]], isp: 1, b: 0 }] : []),
      ...e,
    ];
    return sfera(R, el, { ekvator: false, ...x });
  }
  // 2D bočni pogled: lopta (centar O) i jedna ili više horizontalnih ravni na visinama ds
  // (presek je duž PQ; za jednu ravan i pravougli trougao OFQ sa oznakama x.R, x.d, x.w)
  function ravni(R, ds, x = {}) {
    const t = { O: [0, 0] };
    const el = [{ kr: 'O', r: R, b: 0, pun: 1 }];
    const skriveno = ['O'];
    ds.forEach((d, i) => {
      const s = i ? String(i + 1) : '';
      if (d > R + 1e-9) { el.push({ lin: [[-R - 1.5, d], [R + 1.5, d]], b: 4, isp: 1 }); return; }
      if (Math.abs(d - R) < 1e-9) { t['T' + s] = [0, d]; el.push({ lin: [[-R - 1.5, d], [R + 1.5, d]], b: 4, isp: 1 }, { tacka: 'T' + s }); skriveno.push('T' + s); return; }
      const w = Math.sqrt(R * R - d * d);
      const F = 'F' + s, P = 'P' + s, Q = 'Q' + s;
      t[F] = [0, d]; t[P] = [-w, d]; t[Q] = [w, d];
      skriveno.push(F, P, Q);
      el.push({ lin: [[-R - 1.5, d], [R + 1.5, d]], b: 4, isp: 1 });
      el.push({ d: P + Q, b: 3, debljina: 3 });
      if (ds.length === 1 && x.trougao !== false) {
        el.push({ lin: [[0, 0], [0, d], [w, d]], zatv: 1, b: 2, gusto: 1 }, { pu: 'O' + F + Q });
        if (x.R) el.push({ d: 'O' + Q, b: 0, o: x.R });
        if (x.d) el.push({ d: 'O' + F, isp: 1, b: 0, o: x.d });
        if (x.w) el.push({ d: F + Q, b: 3, o: x.w });
      }
    });
    return G(t, el, V({ bezImena: skriveno }));
  }
  // osni presek (aksijalni) valjka, kupe i lopte iste osnove i visine 2r: pravougaonik, trougao, krug
  function osni(R, { val = true, kup = false, lop = false, e = [] } = {}) {
    const el = [];
    if (val) el.push({ lin: [[-R, 0], [R, 0], [R, 2 * R], [-R, 2 * R]], zatv: 1, b: 0 });
    if (kup) el.push({ lin: [[-R, 0], [R, 0], [0, 2 * R]], zatv: 1, b: 1, gusto: 1 });
    if (lop) el.push({ kr: 'C', r: R, b: 2, pun: 1 });
    return G({ C: [0, R] }, [...el, ...e], V({ bezImena: ['C'] }));
  }
  // kvadrat ABCD (stranica a) sa centrom O; upisan = krug ivice a/2, opisan = krug kroz temena
  function kvadrat(a, { upisan = false, opisan = false, e = [], oznake = false } = {}) {
    const el = [{ p: 'ABCD', b: 0 }];
    if (upisan) el.push({ kr: 'O', r: a / 2, b: 2, debljina: 2.5 });
    if (opisan) el.push({ kr: 'O', r: (a * Math.SQRT2) / 2, b: 2, debljina: 2.5 });
    if (oznake) el.push({ d: 'AB', o: oznake });
    return G({ A: [0, 0], B: [a, 0], C: [a, a], D: [0, a], O: [a / 2, a / 2] }, [...el, ...e], V({ bezImena: ['A', 'B', 'C', 'D', 'O'] }));
  }
  // pravilna trostrana prizma (ivica a) gledana odozgo: trougao i upisani krug
  function trougaoOdozgo(a, { krug = true, oznaka = false, poluprecnik = false } = {}) {
    const h = (a * Math.sqrt(3)) / 2, ro = a / (2 * Math.sqrt(3));
    const t = { A: [0, 0], B: [a, 0], C: [a / 2, h], O: [a / 2, h / 3], M: [a / 2, 0] };
    const el = [{ p: 'ABC', b: 0 }];
    if (krug) el.push({ kr: 'O', r: r(ro), b: 2, debljina: 2.5 });
    if (oznaka) el.push({ d: 'AB', o: oznaka });
    if (poluprecnik) el.push({ d: 'OM', b: 1, debljina: 3, o: poluprecnik });
    return G(t, el, V({ bezImena: ['A', 'B', 'C', 'O', 'M'] }));
  }
  // pravilni šestougao upisan u krug R (pogled odozgo na prizmu u valjku)
  function sestougao(R, { krug = true, oznaka = false } = {}) {
    const T = {};
    const tacke = Array.from({ length: 6 }, (_, i) => pt(R, 60 * i));
    tacke.forEach((p, i) => { T[String.fromCharCode(65 + i)] = p; });
    const el = [{ lin: tacke.concat([tacke[0]]), zatv: 1, b: 0 }];
    if (krug) el.push({ kr: 'O', r: R, b: 2, debljina: 2.5 });
    if (oznaka) el.push({ d: 'AB', o: oznaka });
    return G({ ...T, O: [0, 0] }, el, V({ bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'O'] }));
  }
  // kocka sa upisanom ili opisanom loptom (centar O u sredini kocke, ivica a)
  const ime8 = ['A', 'B', 'C', 'D', 'A₁', 'B₁', 'C₁', 'D₁'];
  function kocke(a, e = [], x = {}) {
    return kocka(a, e, { ...x, T3: { O: [a / 2, a / 2, a / 2], ...(x.T3 || {}) }, bezImena: x.bezImena ?? [...ime8, 'O'] });
  }
  // dva kruga (lopte) jedan do drugog, za poređenje
  const dvaKruga = (R1, R2, x = {}) => G({ O1: [-R1 - 1, 0], O2: [R2 + 1, 0] }, [
    { kr: 'O1', r: R1, b: 1, pun: 1 }, { kr: 'O2', r: R2, b: 4, pun: 1 },
  ], V({ bezImena: ['O1', 'O2'], ...x }));

  // ── provere računa ──
  proveri(Math.sqrt(25 - 9) === 4 && Math.sqrt(169 - 25) === 12 && Math.sqrt(100 - 36) === 8, 'preseci: w = √(R² − d²)');
  proveri(Math.abs(Math.sqrt(36 - 16) - 2 * Math.sqrt(5)) < 1e-9 && Math.sqrt(100 - 75) === 5, 'R=6, d=4: w = 2√5; R=10, w=5');
  proveri(Math.sqrt(100 - 36) === 8 && Math.sqrt(100 - 64) === 6 && Math.sqrt(25 - 16) === 3, 'R=10: d=6 → 8; w=6 → d=8; R=5: w=3');
  proveri(Math.sqrt(9 + 16) === 5, 'pitagora 3-4-5');
  proveri(4 * 25 * Math.PI === 100 * Math.PI && 4 * 4 * Math.PI === 16 * Math.PI, 'površina lopte = 4 · veliki krug');
  proveri((4 / 3) * 27 * Math.PI === 36 * Math.PI && (4 / 3) * 216 === 288, 'V(r=3) = 36π; V = 288π → r = 6');
  proveri(Math.abs((4 * Math.PI * 6371 ** 2) / 1e6 - 510.07) < 0.05, 'Zemlja: površina ≈ 510 miliona km²');
  proveri(Math.abs(((4 / 3) * Math.PI * 6371 ** 3) / 1e9 - 1083.2) < 0.5, 'Zemlja: zapremina ≈ 1 083 milijardi km³');
  proveri(Math.abs(((4 / 3) * Math.PI * 2 ** 3) / (4 / 3 * Math.PI * 4 ** 3) - 1 / 8) < 1e-9, 'r = 2 i 4: zapremine 1 : 8');
  proveri(Math.abs(((4 / 3) * Math.PI * 2 ** 3) - (Math.PI / 6) * 4 ** 3) < 1e-9, 'lopta u kocki ivice 4: V = (π/6)·64 = 32π/3');
  proveri(Math.abs((4 / 3) * Math.PI * 3 ** 3 / 6 ** 3 - Math.PI / 6) < 1e-9, 'lopta u kocki ivice 6: π : 6');
  proveri(Math.abs((Math.PI * 3 * 3 * 6) / 6 ** 3 - Math.PI / 4) < 1e-9, 'valjak u kocki ivice 6: π : 4');
  proveri(Math.abs(Math.sqrt(3) - (6 * Math.sqrt(3)) / 6) < 1e-9, 'trougao ivice 6: r = a√3/6 = √3');
  proveri(Math.abs(Math.sqrt(2 * 2 + 2 * 2) / 2 - Math.sqrt(2)) < 1e-9, 'valjak opisan oko kocke ivice 2: r = √2');
  proveri(Math.abs(Math.PI * 5 * 5 * 10 - 250 * Math.PI) < 1e-9, 'valjak r=5, H=10: 250π');
  proveri(Math.abs((4 * Math.PI * 25) / (6 * Math.PI * 25) - 2 / 3) < 1e-9, 'površina lopte : valjak = 2 : 3');
  proveri(8 * (4 / 3) * Math.PI * 3 ** 3 === (4 / 3) * Math.PI * 6 ** 3, 'osam lopti r=3 od jedne r=6');

  // ════════════════ Lopta: osnovni elementi ════════════════
  L('Lopta: osnovni elementi');

  Q(1, 'Kako se zove tačka u sredini lopte, od koje su sve tačke njene površi jednako udaljene?',
    ['Centar lopte', 'Teme lopte', 'Vrh lopte', 'Krajnja tačka'],
    'Svaki prečnik lopte prolazi kroz centar, pa se svi prečnici seku u jednoj tački. Zato je lopta jednako „zaobljena“ iz svakog pravca.',
    'centar', { mediji: sfera(4, [{ tacka: 'O' }], { ekvator: false }) });

  Q(1, 'Duž koja spaja centar lopte sa tačkom na njenoj površi zove se…',
    ['poluprečnik', 'prečnik', 'tetiva', 'tangentna duž'],
    'Svi poluprečnici jedne lopte su jednaki, pa lopta izgleda jednako okrugla iz svakog pravca.', 'poluprečnik',
    { mediji: sfera(4, [{ d: 'OA', b: 1, debljina: 3 }], { T3: { A: pt(4, 25) }, imena: ['A'] }),
      medijiOdgovora: sfera(4, [{ d: 'OA', b: 1, debljina: 3, o: 'r' }], { T3: { A: pt(4, 25) }, imena: ['A'] }) });

  Q(1, 'Duž koja prolazi kroz centar lopte i spaja dve tačke njene površi zove se…',
    ['prečnik', 'poluprečnik', 'tetiva', 'stranica'],
    'Prečnik je najduža duž čiji su krajevi na površi lopte: svaka druga tetiva je kraća.', 'prečnik',
    { mediji: sfera(4, [{ d: 'AB', b: 1, debljina: 3 }], { T3: { A: pt(4, 180), B: pt(4, 0) }, imena: ['A', 'B'] }),
      medijiOdgovora: sfera(4, [{ d: 'AB', b: 1, debljina: 3, o: 'prečnik' }], { T3: { A: pt(4, 180), B: pt(4, 0) }, imena: ['A', 'B'] }) });

  Q(1, 'Lopta ima prečnik $18$ cm. Koliki joj je poluprečnik?',
    ['$9$ cm', '$18$ cm', '$36$ cm', '$4,5$ cm'],
    'Ako poluprečnik lopte prepolovimo, prečnik se prepolovi, a zapremina se smanji osam puta.', 'poluprečnik',
    { mediji: sfera(9, [{ d: 'AB', b: 1, debljina: 3, o: '18 cm' }], { T3: { A: pt(9, 180), B: pt(9, 0) }, imena: ['A', 'B'] }),
      medijiOdgovora: sfera(9, [{ d: 'OB', b: 1, debljina: 3, o: '9 cm' }], { T3: { A: pt(9, 180), B: pt(9, 0) }, imena: ['A', 'B'] }) });

  Q(2, 'Poluprečnik lopte na crtežu je $7$ cm. Koliki je prečnik?',
    ['$14$ cm', '$7$ cm', '$3,5$ cm', '$49$ cm'],
    'Prečnik je jedina duž kroz centar čiji su krajevi na površi, pa se po njemu lako proverava da li je lopta dobro izmerena.', 'prečnik',
    { mediji: sfera(7, [{ d: 'OA', b: 1, debljina: 3, o: '7 cm' }], { T3: { A: pt(7, 180) }, imena: ['A'] }),
      medijiOdgovora: sfera(7, [{ d: 'AB', b: 1, debljina: 3, o: '14 cm' }], { T3: { A: pt(7, 180), B: pt(7, 0) }, imena: ['A', 'B'] }) });

  Q(2, 'Koje dve tačke na površi lopte su najudaljenije jedna od druge?',
    ['krajevi prečnika', 'dve tačke na istoj kružnici', 'krajevi poluprečnika', 'susedne tačke'],
    'Svaka tetiva sfere je kraća od prečnika, jer ne prolazi kroz centar. Samo prečnik spaja dve tačke površi preko centra.', 'tetiva',
    { mediji: sfera(5, [{ tacka: 'A' }, { tacka: 'B' }, { tacka: 'C' }, { tacka: 'D' }], { T3: { A: pt(5, 200), B: pt(5, 20), C: pt(5, 110), D: pt(5, 70) }, imena: [] }) });

  Q(2, 'Koliko prečnika lopte prolazi kroz njen centar?',
    ['Beskonačno mnogo', 'Tačno četiri prečnika', 'Tri', 'Dva'],
    'Kroz centar lopte može da se povuče beskonačno mnogo pravih. Svaka od njih seče površ u dve tačke, pa je to prečnik.', 'prava',
    { mediji: sfera(4, [{ lin3: [[-4, 0, 0], [4, 0, 0]], b: 1, debljina: 2.5 }, { lin3: [[0, -4, 0], [0, 4, 0]], b: 1, debljina: 2.5 }, { lin3: [[0, 0, -4], [0, 0, 4]], b: 1, debljina: 2.5 }]) });

  Q(2, 'Tačka je od centra lopte poluprečnika $5$ cm udaljena $4$ cm. Gde se nalazi?',
    ['U unutrašnjosti lopte', 'Na površi lopte', 'Izvan lopte, blizu površi', 'U centru lopte'],
    'Lopta obuhvata sve tačke na rastojanju najviše r od centra. Površ su tačke na tačno r, a unutrašnjost sve tačke bliže centru.', 'centar',
    { mediji: sfera(5, [{ tacka: 'M' }], { T3: { M: pt(4, 40) }, imena: [] }) });

  Q(1, 'Tačka $P$ je na površi lopte sa centrom $O$. Koja tvrdnja je tačna?',
    ['$OP = r$', '$OP < r$', '$OP > r$', '$OP = 2r$'],
    'Sve tačke površi su na istom rastojanju od centra, a to je poluprečnik. Po toj osobini se sfera i definiše.', 'poluprečnik',
    { mediji: sfera(4, [{ d: 'OP', isp: 1, b: 0 }], { T3: { P: pt(4, 65) }, imena: [] }) });

  Q(2, 'Tačke $M$ i $N$ su na površi lopte. Koliki je odnos $OM : ON$, gde je $O$ centar?',
    ['$1 : 1$', '$1 : 2$', '$2 : 1$', 'zavisi od tačaka'],
    'Duži OM i ON su poluprečnici iste lopte. Trougao OMN je zato jednakokraki, a njegova dva kraka su jednaka.', 'odnos',
    { mediji: sfera(5, [{ d: 'OM', isp: 1, b: 0 }, { d: 'ON', isp: 1, b: 0 }, { tacka: 'M' }, { tacka: 'N' }], { T3: { M: pt(5, 30), N: pt(5, 150) }, imena: [] }) });

  Q(2, 'Šta je razlika između sfere i lopte?',
    ['Sfera je površ, a lopta i unutrašnjost', 'Lopta je površ, a sfera i njen unutrašnji deo', 'Sfera je ravan krug, a lopta je kocka', 'Lopta i sfera nemaju zajednički centar'],
    'Kad kažemo lopta, mislimo i na unutrašnjost; kad kažemo sfera, mislimo samo na površ. Fudbalska „lopta“ je zato zapravo sfera sa vazduhom unutra.', 'sfera',
    { mediji: dvaKruga(4, 4) });

  U(2, 'Koji pojam ne pripada lopti?',
    ['Izvodnica', 'Poluprečnik', 'Centar', 'Prečnik'],
    'Izvodnica je duž na omotaču valjka ili kupe. Lopta nema omotač koji bi se razvijao u ravan, pa ni izvodnicu.',
    'Lopta je jedino telo kod koga su sve tačke površi na istom rastojanju od centra.', 'lopta',
    { mediji: sfera(4) });

  S(2, 'Spoji pojam sa opisom:',
    [['centar lopte', 'tačka od koje su sve tačke sfere jednako udaljene'], ['poluprečnik', 'duž od centra do površi'], ['prečnik', 'duž kroz centar između dve tačke sfere'], ['sfera', 'površ svih tačaka na rastojanju r']],
    'Sfera je samo površ; lopta je sfera zajedno sa svim tačkama unutra.', 'sfera',
    { mediji: sfera(4) });

  Q(3, 'Lopta ima poluprečnik $5$ cm, a tačka $T$ je na rastojanju $13$ cm od centra. Koliko je najveće rastojanje od $T$ do tačaka lopte?',
    ['$18$ cm', '$8$ cm', '$13$ cm', '$26$ cm (dvostruko od 13)'],
    'Najdalja tačka lopte leži na pravoj TO, s druge strane centra. Rastojanje je zbir 13 i 5.', 'rastojanje',
    { mediji: sfera(5, [{ d: 'OT', isp: 1, b: 0, o: '13 cm' }, { tacka: 'T' }], { T3: { T: [13, 0] }, imena: [] }),
      medijiOdgovora: sfera(5, [{ d: 'TF', b: 1, debljina: 3, o: '18 cm' }, { d: 'OT', isp: 1, b: 0 }, { tacka: 'T' }], { T3: { T: [13, 0], F: [-5, 0] }, imena: [] }) });

  Q(3, 'Lopta ima poluprečnik $5$ cm, a tačka $T$ je na rastojanju $8$ cm od centra. Koliko je najmanje rastojanje od $T$ do tačaka lopte?',
    ['$3$ cm', '$13$ cm', '$5$ cm', '$8$ cm'],
    'Najbliža tačka lopte je na pravoj koja spaja tačku sa centrom. Od rastojanja 8 cm oduzmeš poluprečnik 5 cm.', 'rastojanje',
    { mediji: sfera(5, [{ d: 'OT', isp: 1, b: 0, o: '8 cm' }, { tacka: 'T' }], { T3: { T: [8, 0] }, imena: [] }),
      medijiOdgovora: sfera(5, [{ d: 'TF', b: 1, debljina: 3, o: '3 cm' }, { d: 'OT', isp: 1, b: 0 }, { tacka: 'T' }], { T3: { T: [8, 0], F: [5, 0] }, imena: [] }) });

  Q(3, 'Dve lopte imaju isti centar. Poluprečnici su $3$ cm i $5$ cm. Koliko je rastojanje između njihovih površi?',
    ['$2$ cm', '$8$ cm', '$5$ cm', '$2,5$ cm'],
    'Ovakve lopte se mogu zamisliti kao ljuske jedne u drugoj, kao matrjoške. Debljina ljuske je razlika poluprečnika.', 'ljuska',
    { mediji: G({ O: [0, 0], P: [3, 0], Q: [5, 0] }, [{ kr: 'O', r: 5, b: 4 }, { kr: 'O', r: 3, b: 1 }, { d: 'OQ', o: '5 cm', b: 0 }, { d: 'OP', o: '3 cm', b: 0 }, { tacka: 'P' }, { tacka: 'Q' }], V({ bezImena: ['O', 'P', 'Q'], velicina: 260 })) });

  Q(3, 'Tačke $A$ i $B$ su na površi lopte poluprečnika $5$ cm, a rastojanje $AB$ je $8$ cm. Koliko je rastojanje centra $O$ od prave $AB$?',
    ['$3$ cm', '$4$ cm', '$\\sqrt{39}$ cm', '$6$ cm'],
    'Normala iz centra polovi tetivu. Dobijaš pravougli trougao sa hipotenuzom 5 i katetom 4, pa je druga kateta 3.', 'normala',
    { mediji: G({ O: [0, 0], A: [-4, 3], B: [4, 3] }, [{ kr: 'O', r: 5, b: 4 }, { d: 'AB', o: '8 cm', b: 3, debljina: 3 }, { d: 'OA', b: 0 }, { tacka: 'A' }, { tacka: 'B' }], V({ bezImena: ['O', 'A', 'B'] })),
      medijiOdgovora: G({ O: [0, 0], A: [-4, 3], B: [4, 3], H: [0, 3] }, [{ kr: 'O', r: 5, b: 4 }, { d: 'AB', o: '8 cm', b: 3, debljina: 3 }, { d: 'OA', b: 0, o: '5 cm' }, { d: 'OH', b: 1, isp: 1, o: '3 cm' }, { pu: 'OHA' }, { tacka: 'A' }, { tacka: 'B' }], V({ bezImena: ['O', 'A', 'B', 'H'] })) });

  Q(1, 'Koliko tačaka lopte je na rastojanju tačno $r$ od centra?',
    ['Beskonačno mnogo', 'Tačno jedna, u centru', 'Dve', 'Nijedna'],
    'Sve tačke površi su na istom rastojanju od centra, pa ih ima beskonačno mnogo. Tačka u centru je na rastojanju 0.',
    'površina', { mediji: sfera(4, [], { imena: [] }) });

  // ════════════════ Ravni preseci lopte ════════════════
  L('Ravni preseci lopte');

  Q(1, 'Ravan je dalje od centra lopte nego što je njen poluprečnik. Šta je presek?',
    ['Prazan skup', 'Tačka', 'Krug', 'Elipsa ili krug'],
    'Ako ravan promašuje loptu, nijedna tačka lopte ne leži u njoj, pa je presek prazan skup.', 'presek',
    { mediji: ravni(4, [6]) });

  Q(1, 'Ravan dodiruje loptu u jednoj tački. Koliko zajedničkih tačaka imaju ravan i lopta?',
    ['Jednu', 'Nijednu', 'Dve', 'Beskonačno mnogo'],
    'Ravan koja dodiruje loptu je normalna na poluprečnik u dodirnoj tački. Rastojanje ravni od centra je tada jednako poluprečniku.', 'dodir',
    { mediji: ravni(4, [4], { trougao: false }) });

  Q(1, 'Ravan prolazi kroz centar lopte. Šta je presek?',
    ['Veliki krug', 'Mali krug', 'Tačka', 'Kružni isečak'],
    'Kada ravan sadrži centar, presek je krug najvećeg mogućeg poluprečnika. Zato se zove veliki krug lopte.', 'veliki',
    { mediji: ravni(4, [0], { trougao: false }) });

  Q(2, 'Lopta ima poluprečnik $5$ cm, a ravan je na rastojanju $3$ cm od centra. Koliki je poluprečnik preseka?',
    ['$4$ cm', '$2$ cm', '$8$ cm', '$4,5$ cm'],
    'Poluprečnik lopte, rastojanje ravni od centra i poluprečnik preseka čine pravougli trougao. Pitagorina teorema daje treću stranu.', 'krug',
    { mediji: ravni(5, [3], { R: '5 cm', d: '3 cm' }),
      medijiOdgovora: ravni(5, [3], { R: '5 cm', d: '3 cm', w: '4 cm' }) });

  Q(3, 'Lopta poluprečnika $13$ cm presečena je ravni koja je $5$ cm od centra. Koliki je obim preseka?',
    ['$24\\pi$ cm', '$12\\pi$ cm', '$26\\pi$ cm', '$12\\pi^{2}$ cm'],
    'Poluprečnik preseka dobiješ iz Pitagorine teoreme: 13 i 5 daju 12. Obim kruga je 2rπ, pa je 24π.', 'obim',
    { mediji: ravni(13, [5], { R: '13 cm', d: '5 cm' }),
      medijiOdgovora: ravni(13, [5], { R: '13 cm', d: '5 cm', w: '12 cm' }) });

  Q(2, 'Presek lopte i ravni je krug površine $9\\pi$ cm². Ako je poluprečnik lopte $5$ cm, koliko je rastojanje ravni od centra?',
    ['$4$ cm', '$3$ cm', '$\\sqrt{34}$ cm', '$8$ cm'],
    'Iz površine preseka dobiješ njegov poluprečnik: r² = 9, pa je r = 3. Zatim je d² = 25 − 9 = 16.', 'površina',
    { mediji: ravni(5, [4], { R: '5 cm' }) });

  Q(2, 'Ravan seče loptu po krugu. Kako se menja poluprečnik preseka ako se ravan pomera sve bliže centru?',
    ['Raste', 'Smanjuje se', 'Ostaje isti', 'Zavisi od lopte'],
    'Što je ravan bliže centru, to je presek veći. Kad ravan prođe kroz centar, presek je najveći mogući.', 'bliže',
    { mediji: ravni(5, [1, 4], { trougao: false }) });

  Q(2, 'Lopta poluprečnika 10 cm presečena je ravni na rastojanju 6 cm od centra. Koliki je poluprečnik preseka?',
    ['8 cm', '4 cm', '16 cm', '√136 cm'],
    'Trojka 6, 8, 10 je pravougla, pa se poluprečnik preseka dobija bez računanja korena.', 'trojka',
    { mediji: ravni(10, [6], { R: '10 cm', d: '6 cm' }),
      medijiOdgovora: ravni(10, [6], { R: '10 cm', d: '6 cm', w: '8 cm' }) });

  Q(2, 'Lopta ima poluprečnik $5$ cm, a ravan je na rastojanju $4$ cm od centra. Koliki je poluprečnik preseka?',
    ['$3$ cm', '$9$ cm', '$\\sqrt{41}$ cm', '$4$ cm'],
    'Trojka 3, 4, 5 je najpoznatija pitagorina trojka i često se pojavljuje u zadacima sa loptom.', 'trojka',
    { mediji: ravni(5, [4], { R: '5 cm', d: '4 cm' }) });

  Q(2, 'Ravan normalna na poluprečnik lopte seče loptu. Šta spaja centar lopte i centar preseka?',
    ['Normala na ravan', 'Tetiva lopte', 'Prečnik kruga preseka', 'Izvodnica'],
    'Duž od centra lopte do centra preseka je najkraća veza sa ravni i upravna je na nju.', 'normala',
    { mediji: presek3(5, 3) });

  U(2, 'Koji oblik NIJE moguć kao presek ravni i lopte?',
    ['Elipsa', 'Krug', 'Tačka', 'Prazan skup'],
    'Ravan i lopta uvek daju krug, tačku ili prazan skup. Elipsa nastaje kada ravan seče valjak koso.',
    'Elipsa je presek ravni i valjka, ne ravni i lopte.', 'elipsa',
    { mediji: presek3(5, 3) });

  Q(1, 'Koliko je površina velikog kruga lopte poluprečnika $4$ cm?',
    ['$16\\pi$ cm²', '$8\\pi$ cm²', '$4\\pi$ cm²', '$128\\pi$ cm²'],
    'Veliki krug je krug poluprečnika r, pa mu je površina r²π.', 'veliki',
    { mediji: sfera(4) });

  Q(2, 'Tri paralelne ravni, sve sa iste strane centra, seku loptu na rastojanjima 1 cm, 4 cm i 7 cm. Koji presek ima najveći poluprečnik?',
    ['Ravan na 1 cm', 'Ravan na 4 cm', 'Ravan na 7 cm', 'Sve tri su iste'],
    'Što je ravan bliže centru, to je krug veći. Najbliža ravan daje najveći presek.', 'bliže',
    { mediji: ravni(8, [1, 4, 7], { trougao: false }) });

  Q(3, 'Ravan je na rastojanju $3$ cm od centra lopte, a presek je krug poluprečnika $4$ cm. Kolika je površina velikog kruga te lopte?',
    ['$25\\pi$ cm²', '$16\\pi$ cm²', '$9\\pi$ cm²', '$50\\pi$ cm²'],
    'Poluprečnik lopte je 5 cm (3-4-5), pa je veliki krug 25π cm².', 'veliki',
    { mediji: ravni(5, [3], { d: '3 cm', w: '4 cm' }) });

  Q(3, 'Površina preseka lopte i ravni je četiri puta manja od površine velikog kruga. Poluprečnik lopte je $10$ cm. Koliko je rastojanje ravni od centra?',
    ['$5\\sqrt{3}$ cm', '$5$ cm', '$5\\sqrt{2}$ cm', '$\\sqrt{125}$ cm'],
    'Površina preseka je 25π, pa je poluprečnik preseka 5. Zatim je d² = 100 − 25 = 75.', 'presek',
    { mediji: sfera(10, [], { imena: [] }),
      medijiOdgovora: ravni(10, [8.66], { R: '10 cm', d: '5√3 cm', w: '5 cm' }) });

  Q(3, 'Ravan seče loptu poluprečnika $10$ cm po krugu površine $36\\pi$ cm². Koliko je rastojanje ravni od centra?',
    ['$8$ cm', '$6$ cm', '$\\sqrt{136}$ cm', '$4$ cm'],
    'Iz površine dobiješ poluprečnik preseka 6. Zatim je d² = 100 − 36 = 64.', 'površina',
    { mediji: ravni(10, [8], { R: '10 cm' }) });

  Q(3, 'Ravan seče loptu po krugu poluprečnika $4$ cm. Rastojanje ravni od centra je $3$ cm. Koliki je poluprečnik lopte?',
    ['$5$ cm', '$7$ cm', '$4$ cm', '$\\sqrt{7}$ cm'],
    'Iz pravouglog trougla: R² = 3² + 4² = 25, pa je R = 5.', 'Pitagora',
    { mediji: ravni(5, [3], { d: '3 cm', w: '4 cm' }),
      medijiOdgovora: ravni(5, [3], { R: '5 cm', d: '3 cm', w: '4 cm' }) });

  S(2, 'Spoji položaj ravni i lopte sa oblikom preseka:',
    [['ravan dalje od centra od poluprečnika', 'prazan skup'], ['ravan dodiruje loptu', 'tačka dodira'], ['ravan bliže centru od poluprečnika', 'krug'], ['ravan kroz centar', 'veliki krug']],
    'Od položaja ravni zavisi da li je presek prazan, tačka ili krug. Najveći krug nastaje kad ravan prolazi kroz centar.', 'presek',
    { mediji: ravni(4, [2]) });

  // ════════════════ Površina i zapremina lopte ════════════════
  L('Površina i zapremina lopte');

  Q(1, 'Kako se računa površina lopte poluprečnika $r$?',
    ['$P = 4r^{2}\\pi$', '$P = r^{2}\\pi$', '$P = 2r\\pi$', '$P = \\frac{4}{3}r^{3}\\pi$'],
    'Površina lopte je četiri puta veća od površine njenog velikog kruga. Arhimed je to dokazao pre više od 2000 godina.', 'površina',
    { mediji: sfera(3, [{ d: 'OA', b: 1, debljina: 3, o: 'r' }], { T3: { A: pt(3, 0) }, imena: ['A'] }) });

  Q(1, 'Kako se računa zapremina lopte poluprečnika $r$?',
    ['$V = \\frac{4}{3}r^{3}\\pi$', '$V = 4r^{2}\\pi$', '$V = \\frac{4}{3}r^{2}\\pi$', '$V = \\frac{4}{3}\\pi r^{2}$'],
    'Zapremina lopte raste sa kubom poluprečnika. Iz istog reda je i formula za površinu, ali sa kvadratom.', 'zapremina',
    { mediji: sfera(3) });

  Q(1, 'Lopta ima poluprečnik $2$ cm. Kolika joj je površina?',
    ['$16\\pi$ cm²', '$8\\pi$ cm²', '$4\\pi$ cm²', '$128\\pi$ cm²'],
    'Površina je 4r²π = 4 · 4 · π = 16π cm².', 'površina',
    { mediji: sfera(2, [{ d: 'OA', b: 1, debljina: 3, o: '2 cm' }], { T3: { A: pt(2, 0) }, imena: ['A'] }) });

  Q(2, 'Lopta ima poluprečnik $3$ cm. Kolika joj je zapremina?',
    ['$36\\pi$ cm³', '$27\\pi$ cm³', '$12\\pi$ cm³', '$108\\pi$ cm³'],
    'Zapremina je $4/3 · r³ · π = 4/3 · 27 · π = 36π$ cm³.', 'zapremina',
    { mediji: sfera(3, [{ d: 'OA', b: 1, debljina: 3, o: '3 cm' }], { T3: { A: pt(3, 0) }, imena: ['A'] }) });

  Q(2, 'Ako se poluprečnik lopte udvostruči, koliko puta se poveća njena površina?',
    ['4 puta', '2 puta', '8 puta', '16 puta'],
    'Površina raste sa kvadratom poluprečnika, pa se dvostruki poluprečnik pretvara u četiri puta veću površinu.', 'kvadrat',
    { mediji: dvaKruga(2, 4) });

  Q(2, 'Ako se poluprečnik lopte udvostruči, koliko puta se poveća njena zapremina?',
    ['8 puta', '4 puta', '2 puta', '6 puta više'],
    'Zapremina raste sa kubom poluprečnika: 2 na treći je 8. Zato se lopta dvostrukog poluprečnika napuni osam puta više vazduha.', 'kub',
    { mediji: dvaKruga(2, 4) });

  Q(3, 'Za farbanje lopte treba pokriti $100\\pi$ cm². Koliki je poluprečnik lopte?',
    ['5 cm', '10 cm', '25 cm', '50 cm'],
    'Iz $4r²π = 100π$ dobijamo $r² = 25$, pa je $r = 5$ cm.', 'površina',
    { mediji: sfera(5) });

  Q(3, 'Zapremina lopte je $288\\pi$ cm³. Koliki joj je poluprečnik?',
    ['6 cm', '12 cm', '8 cm', '4 cm'],
    'Iz $4/3 · r³ · π = 288π$ dobijamo $r³ = 216$, pa je $r = 6$ cm.', 'zapremina',
    { mediji: sfera(6) });

  Q(1, 'Velik krug lopte ima površinu $25\\pi$ cm². Kolika je površina lopte?',
    ['$100\\pi$ cm²', '$50\\pi$ cm²', '$25\\pi$ cm²', '$200\\pi$ cm²'],
    'Površina lopte je četiri velika kruga, pa je 4 · 25π = 100π cm².', 'veliki',
    { mediji: sfera(5) });

  Q(2, 'Zemlja je približno lopta poluprečnika 6 371 km. Kolika je približno njena površina?',
    ['510 miliona km²', '51 miliona km²', '5 100 miliona km²', '40 000 km²'],
    'Oko 71 % površine Zemlje prekriveno je vodom, pa kopno čini manje od trećine površine.', 'Zemlja',
    { mediji: sfera(4, [], { imena: [] }) });

  Q(3, 'Zemlja je približno lopta poluprečnika 6 371 km. Kolika je približno njena zapremina?',
    ['1 083 milijardi km³', '510 miliona km³', '1 083 miliona km³', '10 830 milijardi km³'],
    'Zapremina Zemlje je više od šest puta veća od zapremine Marsa.', 'Zemlja',
    { mediji: sfera(4, [], { imena: [] }) });

  Q(2, 'Lopta je upisana u valjak čija je visina jednaka prečniku lopte. Kako se odnose površina lopte i ukupna površina valjka?',
    ['2 : 3', '1 : 2', '3 : 2', '2 : 1,5'],
    'Valjak je poluprečnika r i visine 2r, pa mu je ukupna površina 6r²π. Površina lopte je 4r²π; odnos je 4 : 6.', 'Arhimed',
    { mediji: osni(3, { val: true, lop: true }) });

  S(2, 'Spoji veličinu i formulu za loptu poluprečnika r:',
    [['površina lopte', '$4r^{2}\\pi$'], ['zapremina lopte', '$\\frac{4}{3}r^{3}\\pi$'], ['površina velikog kruga', '$r^{2}\\pi$'], ['zapremina valjka opisanog oko lopte', '$2r^{3}\\pi$']],
    'Četiri velika kruga čine površinu lopte, a zapremina lopte je dve trećine zapremine valjka opisanog oko nje.', 'formule',
    { mediji: osni(3, { val: true, lop: true }) });

  Q(2, 'Lopta, valjak i kupa imaju iste poluprečnike i iste visine (visina valjka i kupe je 2r). Kako se odnose zapremine valjka : lopte : kupe?',
    ['3 : 2 : 1', '1 : 2 : 3', '2 : 3 : 1,5', '3 : 1 : 2'],
    'Ovo je Arhimedov rezultat: zapremina valjka je 2r³π, lopte 4/3 r³π, a kupe 2/3 r³π. Ako svi delovi podelimo sa 2/3 r³π, dobijemo 3 : 2 : 1.', 'Arhimed',
    { mediji: osni(3, { val: true, kup: true, lop: true }) });

  Q(2, 'Površina lopte i omotač valjka opisanog oko nje (visina valjka je 2r) odnose se kao:',
    ['jednake su', 'lopta je dvostruko veća', 'omotač je dvostruko veći', 'odnos je 2 : 3'],
    'Omotač valjka je 2πr · 2r = 4r²π, što je tačno površina lopte. Zato se Arhimed toliko radovao ovom rezultatu.', 'omotač',
    { mediji: osni(3, { val: true, lop: true }) });

  Q(3, 'Lopta poluprečnika 2 cm i lopta poluprečnika 4 cm. Kako se odnose njihove zapremine?',
    ['1 : 8', '1 : 4', '1 : 2', '1 : 16'],
    'Dvostruko veći poluprečnik znači osam puta veću zapreminu, ali samo četiri puta veću površinu.', 'zapremina',
    { mediji: dvaKruga(2, 4) });

  Q(3, 'Od metalne lopte poluprečnika 6 cm pravi se 8 jednakih manjih lopti od istog metala. Koliki je poluprečnik svake?',
    ['3 cm', '2 cm', '4 cm', '1,5 cm'],
    'Zapremina velike lopte je 8 puta veća od jedne male, pa je poluprečnik male 6 : 2 = 3 cm.', 'topljenje',
    { mediji: sfera(6) });

  U(2, 'Koja formula NIJE za zapreminu lopte?',
    ['$4r^{2}\\pi$', '$\\frac{4}{3}r^{3}\\pi$', '$\\frac{4 r^{3} \\pi}{3}$', '$\\frac{4}{3}\\pi r^{3}$'],
    '4r²π je formula za površinu lopte (četiri velika kruga), a ne za zapreminu. Ostale tri su iste formule zapisane drugačije.',
    'Površina lopte je 4r²π, a formule sa r²π računaju površine krugova.', 'formula',
    { mediji: sfera(3) });

  // ════════════════ Upisana i opisana tela ════════════════
  L('Upisana i opisana tela');

  Q(1, 'Lopta je upisana u kocku. Koje strane kocke ona dodiruje?',
    ['Sve strane kocke', 'Sva temena kocke', 'Sve ivice kocke', 'Samo gornju stranu'],
    'Lopta upisana u kocku dodiruje sredine svih šest strana. Zato je njen prečnik jednak ivici kocke.', 'upisana',
    { mediji: kocke(6, []), medijiOdgovora: kocke(6, [{ kr: 'O', r: 3, b: 2 }]) });

  Q(1, 'Lopta je opisana oko kocke. Šta leži na njoj?',
    ['Sva temena kocke', 'Središta strana', 'Sve ivice kocke', 'Samo jedno teme kocke'],
    'Prečnik opisane lopte je telesna dijagonala kocke: sva temena kocke leže na njenoj površi.', 'opisana',
    { mediji: kocke(6, []), medijiOdgovora: kocke(6, [{ kr: 'O', r: 3 * Math.sqrt(3), b: 2 }]) });

  Q(2, 'Kocka ivice $6$ cm je upisana u loptu. Koliki je poluprečnik lopte?',
    ['$3\\sqrt{3}$ cm', '$3$ cm', '$\\sqrt{108}$ cm', '$6$ cm'],
    'Telesna dijagonala kocke ivice a iznosi a√3, pa je za a = 6 jednaka 6√3. Ona je prečnik lopte, a poluprečnik je polovina.', 'dijagonala',
    { mediji: kocke(6, [{ d: 'AB', o: '6 cm', b: 0 }]), medijiOdgovora: kocke(6, [{ kr: 'O', r: 3 * Math.sqrt(3), b: 2 }, { d: 'OA₁', o: '3√3 cm', b: 1 }]) });

  Q(2, 'Lopta je upisana u kocku ivice $6$ cm. Koliki je poluprečnik lopte?',
    ['$3$ cm', '$6$ cm', '$1,5$ cm', '$12$ cm'],
    'Lopta upisana u kocku ima prečnik jednak ivici, pa je poluprečnik polovina ivice.', 'upisana',
    { mediji: kocke(6, [{ d: 'AB', o: '6 cm', b: 0 }]), medijiOdgovora: kocke(6, [{ kr: 'O', r: 3, b: 2 }, { d: 'OX', o: '3 cm', b: 1 }], { T3: { X: [0, 3, 3] }, bezImena: [...ime8, 'O', 'X'] }) });

  Q(3, 'Lopta je upisana u kocku. Koliki je odnos zapremine lopte i zapremine kocke?',
    ['$\\pi : 6$', '$\\pi : 4$', '$4\\pi : 3$', '$1 : 6$'],
    'Lopta ima poluprečnik a/2, pa je njena zapremina (4/3)(a/2)³π = πa³/6. Odnos sa kockom je π : 6.', 'odnos',
    { mediji: kocke(6, []), medijiOdgovora: kocke(6, [{ kr: 'O', r: 3, b: 2 }]) });

  Q(3, 'Valjak je upisan u kocku ivice $a$: osnova je krug upisan u kvadrat, a visina je $a$. Kakav je odnos zapremina valjka i kocke?',
    ['$\\pi : 4$', '$\\pi : 6$', '$\\pi : 2$', '$1 : 4\\pi$'],
    'Osnova valjka je krug poluprečnika a/2, pa je zapremina π(a/2)²a = πa³/4. Odnos sa kockom je π : 4.', 'valjak',
    { mediji: kvadrat(6, { upisan: true }) });

  Q(2, 'Kupa je upisana u valjak: ima istu osnovu i vrh u centru gornje osnove. Koliki je odnos zapremina kupe i valjka?',
    ['$1 : 3$', '$1 : 2$', '$2 : 3$', '$1 : 3π$'],
    'Zapremina kupe je trećina zapremine valjka iste osnove i visine.', 'kupa',
    { mediji: osni(3, { val: true, kup: true }) });

  Q(2, 'Osnova prizme je pravilni šestougao upisan u krug poluprečnika $4$ cm. Prizma je upisana u valjak iste visine. Kolika je ivica osnove prizme?',
    ['$4$ cm', '$2\\sqrt{3}$ cm', '$8$ cm', '$2$ cm'],
    'Kod pravilnog šestougla stranica je jednaka poluprečniku opisanog kruga. Šestougao se sastoji od šest jednakostraničnih trouglova.', 'šestougao',
    { mediji: sestougao(4), medijiOdgovora: sestougao(4, { oznaka: 'a = 4 cm' }) });

  Q(3, 'Valjak je upisan u pravilnu trostranu prizmu ivice $6$ cm. Koliki je poluprečnik valjka?',
    ['$\\sqrt{3}$ cm', '$3$ cm', '$2\\sqrt{3}$ cm', '$6$ cm'],
    'Krug upisan u jednakostranični trougao ima poluprečnik a√3/6, a za a = 6 to je √3 cm.', 'trougao',
    { mediji: trougaoOdozgo(6, { krug: true, oznaka: '6 cm' }), medijiOdgovora: trougaoOdozgo(6, { krug: true, oznaka: '6 cm', poluprecnik: 'r' }) });

  Q(2, 'Lopta poluprečnika $5$ cm je upisana u valjak čija je visina jednaka prečniku. Kolika je zapremina valjka?',
    ['$250\\pi$ cm³', '$125\\pi$ cm³', '$500\\pi$ cm³', '$1000\\pi$ cm³'],
    'Valjak ima poluprečnik 5 cm i visinu 10 cm, pa je zapremina 5² · π · 10 = 250π cm³.', 'valjak',
    { mediji: osni(5, { val: true, lop: true }) });

  S(2, 'Spoji telo i uslov njegovog upisivanja ili opisivanja:',
    [['lopta upisana u kocku', 'dodiruje sve strane kocke'], ['lopta opisana oko kocke', 'prolazi kroz sva temena'], ['valjak upisan u prizmu', 'krug upisan u osnovu prizme'], ['kupa upisana u piramidu', 'krug upisan u osnovu piramide']],
    'Kupa upisana u piramidu ima isti vrh kao piramida, a osnova joj je krug upisan u osnovu piramide.', 'upisana',
    { mediji: kvadrat(6, { upisan: true }) });

  U(2, 'Koja tvrdnja o lopti upisanoj u kocku NIJE tačna?',
    ['Njen prečnik je veći od ivice kocke', 'Dodiruje sve strane kocke', 'Njen prečnik je jednak ivici kocke', 'Njen centar je u centru kocke'],
    'Upisana lopta ima prečnik jednak ivici kocke, jer dodiruje dve suprotne strane. Ne može biti veća od kocke.',
    'Lopta upisana u kocku ima prečnik jednak ivici, a ne veći.', 'upisana',
    { mediji: kocke(6, []) });

  Q(2, 'Ravan paralelna sa stranom kocke prolazi kroz centar. Lopta je upisana u kocku. Kakav je presek kocke i lopte?',
    ['Kvadrat sa upisanim krugom', 'Trougao i kvadrat sa dva kruga', 'Dva kruga', 'Samo kvadrat'],
    'Kroz centar kocke ravan seče kocku po kvadratu, a loptu po velikom krugu, koji je upisan u taj kvadrat.', 'presek',
    { mediji: kocke(6, []), medijiOdgovora: kvadrat(6, { upisan: true }) });

  Q(2, 'Kocka ivice $2$ cm je upisana u loptu. Koliki je poluprečnik lopte?',
    ['$\\sqrt{3}$ cm', '$1$ cm', '$2$ cm', '$2\\sqrt{2}$ cm'],
    'Telesna dijagonala kocke ivice 2 je 2√3, pa je poluprečnik √3.', 'dijagonala',
    { mediji: kocke(2, [{ d: 'AB', o: '2 cm', b: 0 }]), medijiOdgovora: kocke(2, [{ kr: 'O', r: Math.sqrt(3), b: 2 }]) });

  Q(1, 'Lopta poluprečnika $2$ cm stane u kutiju oblika kocke. Kolika je najmanja ivica kocke?',
    ['$4$ cm', '$2$ cm', '$2\\sqrt{3}$ cm', '$8$ cm'],
    'Lopta u kutiji mora da stane u svakom pravcu: prečnik je najmanja ivica kocke.', 'kutija',
    { mediji: kvadrat(4, { upisan: true }) });

  Q(3, 'Valjak je opisan oko kocke ivice $2$ cm: osnova je krug kroz temena kvadrata, a visina je ivica kocke. Koliki je poluprečnik osnove valjka?',
    ['$\\sqrt{2}$ cm', '$1$ cm', '$2$ cm', '$2\\sqrt{2}$ cm'],
    'Krug opisan oko kvadrata ivice 2 ima poluprečnik dijagonale kvadrata podeljene sa 2: 2√2 / 2 = √2.', 'opisan',
    { mediji: kvadrat(2, { opisan: true }) });

  Q(1, 'Koji oblik ima Zemlja?',
    ['Skoro lopta, spljoštena', 'Savršena sfera bez odstupanja', 'Valjak sa ravnim osnovama', 'Kocka sa zaobljenim ivicama'],
    'Zemlja se okreće oko svoje ose, pa je ekvatorijalni prečnik oko 43 km veći od polarnog. Zato nije savršena lopta.', 'Zemlja',
    { mediji: sfera(4, [], { imena: [] }) });

  Q(3, 'Lopta je upisana u kocku ivice $4$ cm. Kolika je zapremina lopte?',
    ['$\\frac{32\\pi}{3}$ cm³', '$16\\pi$ cm³', '$\\frac{64\\pi}{3}$ cm³', '$\\frac{8\\pi}{3}$ cm³'],
    'Poluprečnik je 2 cm, pa je zapremina 4/3 · 8 · π = 32π/3 cm³. To je π/6 zapremine kocke (64 cm³).', 'zapremina',
    { mediji: kocke(4, [{ d: 'AB', o: '4 cm', b: 0 }]), medijiOdgovora: kocke(4, [{ kr: 'O', r: 2, b: 2 }]) });

  return undefined;
};
