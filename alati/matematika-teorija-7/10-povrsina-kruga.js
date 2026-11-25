// Lekcije 36–38: površina kruga, kružni isečak i prsten, rotacija (udžbenik Matematika 7, str. 183–206).
module.exports = ({ L, Q, U, S, G, proveri, r, naKrugu, luk, pica, pravilni }) => {
  const Z0 = [0, 0];
  // provere računa (gradnja puca ako neki broj nije tačan)
  const blizu = (a, b) => Math.abs(a - b) < 1e-9;
  const rot = ([x, y], deg) => { const f = (deg * Math.PI) / 180; return [x * Math.cos(f) - y * Math.sin(f), x * Math.sin(f) + y * Math.cos(f)]; };
  const jednako = (p, q) => Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9;
  proveri(blizu((16 * Math.PI * 30) / 360, (4 * Math.PI) / 3), 'isečak 30° r=4');
  proveri(blizu((36 * Math.PI * 120) / 360, 12 * Math.PI), 'isečak 120° r=6');
  proveri(blizu((225 * Math.PI * 72) / 360, 45 * Math.PI), 'isečak 72° r=15');
  proveri(blizu((2 * 12 * Math.PI) / (8 * Math.PI), 3), 'r = 2P/l');
  proveri(blizu((8 * Math.PI * 3) / 2, 12 * Math.PI), 'l·r/2');
  proveri(blizu(Math.PI * (7.5 ** 2 - 5.5 ** 2), 26 * Math.PI), 'prsten 11π/15π');
  proveri(blizu(Math.PI * (5 ** 2 - 3 ** 2), 16 * Math.PI), 'prsten 5 i 3');
  proveri(blizu(Math.PI * (10 ** 2 - 8 ** 2), 36 * Math.PI), 'prsten 10 i 8');
  proveri(blizu((40 / 2) ** 2 * Math.PI / 8, 50 * Math.PI), 'pica 40 cm na 8');
  proveri(blizu(Math.sqrt(2) ** 2 * Math.PI, 2 * Math.PI), 'poluprečnik √2 za površinu 2π');
  proveri(blizu(2 * Math.PI * 3, 6 * Math.PI), 'obim kruga r=3');
  proveri(blizu(Math.PI * 3 ** 2, 9 * Math.PI), 'površina kruga r=3');
  proveri(blizu(Math.PI * 2 ** 2, 4 * Math.PI), 'površina kruga r=2');
  proveri(blizu((2 * Math.SQRT2) ** 2, 8), 'kvadrat upisan u krug r=2 ima površinu 8');
  proveri(blizu(4 * Math.PI - 8, Math.PI * 2 ** 2 - 8), 'krug minus kvadrat r=2');
  proveri(blizu(3 ** 2 + 4 ** 2, 5 ** 2), 'trougao 3-4-5');
  proveri(jednako(rot([2, 0], 90), [0, 2]), 'rot (2,0) +90');
  proveri(jednako(rot([1, 1], 90), [-1, 1]), 'rot (1,1) +90');
  proveri(jednako(rot([2, -2], -90), [-2, -2]), 'rot (2,-2) −90');
  proveri(jednako(rot([1, Math.sqrt(3)], 60), [-1, Math.sqrt(3)]), 'rot (1,√3) +60');
  proveri(jednako(rot([2, -2], 135), [0, 2 * Math.SQRT2]), 'rot (2,-2) +135');
  proveri(jednako(rot(rot([1, 0], 90), 90), [-1, 0]), 'dve rotacije po 90°');
  proveri(jednako(rot([1, 0], -90), [0, -1]), 'rot (1,0) −90');
  proveri(jednako(rot([2, 2], 90), [-2, 2]), 'rot (2,2) +90');
  const opts = (x = {}) => ({ bezImena: ['O'], velicina: 230, ...x });

  // ── crteži ──
  // krug poluprečnika R sa poluprečnikom OA (oznaka „r“)
  const krugR = (R) => G({ O: Z0, A: naKrugu(Z0, R, 30) }, [
    { kr: 'O', r: R, b: 1 },
    { d: 'OA', b: 0, o: 'r' },
  ], opts());
  // krug sa prečnikom AB (oznaka prečnika)
  const precnik = (R, oznaka) => G({ O: Z0, A: [-R, 0], B: [R, 0] }, [
    { kr: 'O', r: R, b: 1 },
    { d: 'AB', b: 0, o: oznaka },
  ], opts());
  // kvadrat sa upisanim krugom (poluprečnik = polovina stranice); pun = obojen krug
  const kvadratKrug = (pun) => G({ O: Z0, A: [-2, -2], B: [2, -2], C: [2, 2], D: [-2, 2] }, [
    { p: 'ABCD', b: 4, prazno: 1 },
    { kr: 'O', r: 2, b: 1, ...(pun ? { pun: 1, gusto: 1 } : {}) },
  ], opts());
  // nekoliko koncentričnih krugova, bez oznaka
  const koncentricni = (poluprecnici) => G({ O: Z0 }, poluprecnici.map((R, i) => ({ kr: 'O', r: R, b: i % 6 })), opts());
  // približan pravougaonik od n naizmenično obojenih isečaka poluprečnika R (stranice πR i R)
  const pravougaonik = (n, R) => {
    const b = (2 * Math.PI * R) / n, e = [];
    for (let j = 0; j < n / 2; j++) {
      e.push({ lin: [[j * b, 0], [(j + 1) * b, 0], [(j + 0.5) * b, R]].map((p) => p.map(r)), zatv: 1, b: 1, gusto: 1 });
      e.push({ lin: [[(j + 0.5) * b, R], [(j + 1.5) * b, R], [(j + 1) * b, 0]].map((p) => p.map(r)), zatv: 1, b: 4, prazno: 1 });
    }
    return e;
  };
  // Arhimedov način: pravilni šestougao upisan i opisan oko kruga poluprečnika 3
  const arhimedov = () => {
    const unutra = pravilni(6, 3), spolja = pravilni(6, 3 / Math.cos(Math.PI / 6), Z0, undefined, 'GHIJKL');
    return G({ ...unutra, ...spolja, O: Z0 }, [
      { p: 'ABCDEF', b: 1, gusto: 1 },
      { p: 'GHIJKL', b: 0, prazno: 1 },
      { kr: 'O', r: 3, b: 4 },
    ], { bezImena: [...'ABCDEFGHIJKL', 'O'], velicina: 250 });
  };
  // kružni isečak od ugla od do doo (stepeni), sa oznakom ugla
  const isecak = (R, od, doo, o) => G({ O: Z0 }, [
    { is: 'O', r: R, od, do: doo, b: 1, gusto: 1, ...(o ? { o } : {}) },
    { kr: 'O', r: R, b: 1 },
  ], opts());
  // kružni odsečak: luk od ugla od do doo i tetiva između krajeva luka
  const odsecak = (R, od, doo) => G({ O: Z0 }, [
    { lin: luk(0, 0, R, od, doo, 40), zatv: 1, b: 1, gusto: 1 },
    { kr: 'O', r: R, b: 1 },
  ], opts());
  // kružni prsten: spoljašnji poluprečnik R, unutrašnji r0
  const prsten = (R, r0) => G({ O: Z0 }, [
    { is: 'O', r: R, r0, od: 0, do: 360, b: 1, gusto: 1 },
  ], opts());
  // pravilna zvezda sa deset temena (A…J), naizmenično spoljašnja (R) i unutrašnja (r0)
  const zvezda = (R, r0) => {
    const ime = 'ABCDEFGHIJ', t = { O: Z0 };
    for (let i = 0; i < 10; i++) t[ime[i]] = naKrugu(Z0, i % 2 ? r0 : R, 90 - 36 * i);
    return { t, ime };
  };
  // mreža sa koordinatnim osama i tačkama (za rotaciju u koordinatnom sistemu)
  const mreza = (tacke, e = [], x = {}) => G({ O: Z0, ...tacke }, [{ mreza: [-3, 3, -3, 3] }, ...e], opts(x));

  // ════════════════════════════════════════════════════════════
  // 36. POVRŠINA KRUGA
  // ════════════════════════════════════════════════════════════
  L('Površina kruga');
  Q(1, 'Kako se računa površina kruga poluprečnika $r$?',
    ['$P = r^{2}\\pi$', '$P = 2r\\pi$', '$P = 2r^{2}\\pi$', '$P = r\\pi$'],
    'Površina raste sa kvadratom poluprečnika, a obim samo sa prvim stepenom. Zato veći krugovi brzo „nadoknade“ površinu.',
    'površina', { mediji: krugR(3) });
  Q(1, 'Poluprečnik kruga se udvostruči. Koliko puta se poveća njegova površina?',
    ['4 puta', '2 puta', '3 puta', '8 puta'],
    'Obim se u istom slučaju poveća samo dva puta. Površina je srazmerna kvadratu poluprečnika, pa raste brže.',
    'kvadrat', { medijiOdgovora: koncentricni([1, 2]) });
  Q(2, 'Pica prečnika $40$ cm isečena je na 8 jednakih parčića. Kolika je površina jednog parčeta?',
    ['50π cm²', '25π cm²', '100π cm²', '400π cm²'],
    'Pica prečnika 40 cm ima četiri puta veću površinu od pice prečnika 20 cm, iako joj je prečnik samo dvostruko veći.',
    'pica', { mediji: G({}, pica(8, [0], { R: 3 }), { velicina: 230 }) });
  Q(2, 'Krug je upisan u kvadrat. Koji deo kvadrata zauzima krug?',
    ['Oko 78,5 %', 'Oko 50 %, tj. polovina', 'Oko 90 %, skoro sve', 'Oko 25 %, četvrtina'],
    'Odnos je $\\frac{\\pi}{4}$ i ne zavisi od veličine kruga: mali i veliki krug upisan u kvadrat zauzimaju isti deo svog kvadrata.',
    'odnos', { mediji: kvadratKrug(false), medijiOdgovora: kvadratKrug(true) });
  Q(3, 'Obim kruga je 12,56 cm. Kolika je njegova površina?',
    ['12,56 cm²', '6,28 cm²', '25,12 cm²', '3,14 cm²'],
    'Krug poluprečnika 2 cm ima brojčano jednak obim i površinu (oba su $4\\pi$). Za ostale poluprečnike to nije slučaj.',
    'obim', { medijiOdgovora: krugR(2) });
  Q(1, 'Prečnik kruga je 10 cm. Kolika je njegova površina?',
    ['25π cm²', '10π cm²', '5π cm²', '100π cm²'],
    'Ako se u formulu umesto poluprečnika uvrsti prečnik, površina ispadne četiri puta veća. Zato uvek proveri šta formula traži.',
    'prečnik', { mediji: precnik(5, '10 cm'), medijiOdgovora: krugR(5) });
  Q(2, 'Poluprečnik kruga se smanji dva puta. Koliko puta mu se smanji površina?',
    ['4 puta', '2 puta', '√2 puta', '8 puta'],
    'Ista pravila važe i za lopte: kad im se poluprečnik prepolovi, površina postane četiri puta manja, a zapremina osam puta manja.',
    'smanjenje', { medijiOdgovora: koncentricni([2, 1]) });
  Q(2, 'Krug je upisan u kvadrat stranice 6 cm. Kolika je površina kruga?',
    ['9π cm²', '36π cm²', '18π cm²', '3π cm²'],
    'Krug upisan u kvadrat zauzima oko 78,5 % njegove površine, pa je površina ovog kruga oko 28,3 cm², a ne 36 cm² kao kvadrata.',
    'stranica', { mediji: kvadratKrug(false), medijiOdgovora: krugR(3) });
  Q(2, 'Površina kruga je $16\\pi$ cm². Koliki je njegov poluprečnik?',
    ['4 cm', '8 cm', '2 cm', '√8 cm'],
    'Kad se površina udvostruči, poluprečnik se poveća za √2 puta, a ne dva puta.',
    'koren', { medijiOdgovora: krugR(4) });
  Q(3, 'Površina kruga je $2\\pi$ cm². Koliki je poluprečnik?',
    ['√2 cm', '2 cm', '1 cm', 'π/2 cm'],
    'Broj $\\sqrt{2}$ je iracionalan: ne može se zapisati kao razlomak, a ipak se lako nacrta kao dijagonala kvadrata stranice 1.',
    'iracionalan', { medijiOdgovora: krugR(Math.SQRT2) });
  Q(3, 'Kako je Arhimed približno izračunao površinu kruga?',
    ['Upisivao i opisivao mnogouglove sa sve više stranica', 'Merio je obim kruga i delio ga sa dva', 'Presecao krug na dva dela i slagao ih u traku', 'Crtao kvadrate sve manjih stranica dok nisu stali u krug'],
    'Pomoću 96-tougla Arhimed je dobio granice $3\\frac{10}{71} < \\pi < 3\\frac{1}{7}$. Što ima više stranica, mnogougao je bliži krugu.',
    'arhimed', { medijiOdgovora: arhimedov() });
  Q(2, 'Krug je isečen na mnogo jednakih isečaka, koje smo naizmenično složili kao na slici. Dobijen je približno pravougaonik. Čemu je približno jednaka njegova duža strana?',
    ['Polovini obima, tj. $\\pi r$', 'Celom obimu kruga, tj. $2\\pi r$', 'Poluprečniku, tj. $r$', 'Prečniku kruga, tj. $2r$'],
    'Što su isečci sitniji, pravougaonik je bliži pravom. Ovu ideju „sečenja i slaganja“ koristili su Arhimed, a kasnije Njutn i Lajbnic.',
    'strana', {
      mediji: G({}, pica(16, [0, 2, 4, 6, 8, 10, 12, 14], { R: 3 }), { velicina: 230 }),
      medijiOdgovora: G({}, [...pravougaonik(16, 3),
        { tx: 'πr', at: [(Math.PI * 3) / 2, -0.9] },
        { tx: 'r', at: [Math.PI * 3 + 0.5, 1.5] }], { velicina: 300 }),
    });
  U(1, 'Koja formula NIJE formula za površinu kruga?',
    ['P = 2rπ', 'P = r²π', 'P = d²π/4', 'P = O²/(4π)'],
    'Formula P = 2rπ je za obim kruga. Površina se meri u kvadratnim jedinicama, pa mora imati kvadrat (r² ili d²).',
    'Obim se meri u cm, a površina u cm², pa se po jedinicama može proveriti koja formula pripada kojoj veličini.',
    'formula', { mediji: krugR(3) });
  S(1, 'Spoji prečnik ili poluprečnik sa površinom kruga.',
    [['poluprečnik 1 cm', 'π cm²'], ['poluprečnik 2 cm', '4π cm²'], ['poluprečnik 3 cm', '9π cm²'], ['prečnik 8 cm', '16π cm²']],
    'Prečnik je dvostruko veći od poluprečnika, ali površina kruga nije dvostruko veća, jer zavisi od kvadrata poluprečnika.',
    'kružnica', { mediji: koncentricni([1, 2, 3, 4]) });
  Q(2, 'Obim kruga je $6\\pi$ cm. Kolika je njegova površina?',
    ['9π cm²', '6π cm²', '3π cm²', '36π cm²'],
    'Od svih likova sa istim obimom krug ima najveću površinu. To je poznato kao izoperimetrijski problem.',
    'radijus', { medijiOdgovora: krugR(3) });
  Q(3, 'Kvadrat ima površinu 16 cm². Kolika je površina najvećeg kruga koji stane u njega?',
    ['4π cm²', '8π cm²', '16π cm²', '2π cm²'],
    'Najveći krug u kvadratu dodiruje sve četiri stranice, pa mu je poluprečnik polovina stranice.',
    'upisan', { mediji: kvadratKrug(false), medijiOdgovora: kvadratKrug(true) });

  // ════════════════════════════════════════════════════════════
  // 37. POVRŠINA KRUŽNOG ISEČKA I KRUŽNOG PRSTENA
  // ════════════════════════════════════════════════════════════
  L('Površina kružnog isečka i kružnog prstena');
  Q(1, 'Na slici je obojen jedan deo kruga. Kako se zove?',
    ['Kružni odsečak', 'Kružni isečak', 'Polukrug, tj. polovina kruga', 'Kružni prsten'],
    'Odsečak se dobija kad se od isečka sa istim lukom oduzme trougao koji čine dva poluprečnika i tetiva.',
    'odsečak', { mediji: odsecak(3, 40, 130) });
  Q(1, 'Koliki je centralni ugao polukruga?',
    ['180°', '90°', '360°', '120°'],
    'Minutna kazaljka za pola sata pređe upravo polukrug.',
    'ugao', { medijiOdgovora: isecak(3, 0, 180, '180°') });
  Q(2, 'Kolika je površina kružnog isečka sa centralnim uglom 90° ako je poluprečnik 2 cm?',
    ['π cm²', '2π cm²', '4π cm²', 'π/2 cm²'],
    'Površina isečka od 90° je četvrtina površine celog kruga, a ne četvrtina poluprečnika.',
    'isečak', { mediji: isecak(2, 0, 90, '90°') });
  Q(2, 'Kružni isečak ima poluprečnik 6 cm i centralni ugao 120°. Kolika mu je površina?',
    ['12π cm²', '24π cm²', '6π cm²', '36π cm²'],
    'Isečak od 120° je trećina kruga, ali zato njegov luk nije trećina obima već trećina kruga po uglu.',
    'luk', { mediji: isecak(6, 0, 120, '120°') });
  Q(2, 'Kružni luk dužine $4\\pi$ cm pripada isečku poluprečnika 6 cm. Kolika je površina tog isečka?',
    ['12π cm²', '24π cm²', '6π cm²', '4π cm²'],
    'Formula $P_i = \\frac{l \\cdot r}{2}$ je kao za trougao sa osnovicom $l$ i visinom $r$. Zato se isečak lako „ispravi“ u trougao.',
    'dužina', { medijiOdgovora: isecak(3, 20, 140, 'r') });
  Q(3, 'Površina kružnog isečka je 12π cm², a dužina njegovog luka 4π cm. Koliki je poluprečnik kruga?',
    ['6 cm', '3 cm', '2 cm', '12 cm'],
    'Iz površine i dužine luka poluprečnik se dobija bez ugla: $r = \\frac{2P}{l}$.',
    'visina', { medijiOdgovora: isecak(3, 0, 120, 'r') });
  Q(1, 'Kružni isečak ima centralni ugao 45°. Koji je to deo kruga?',
    ['Osmina kruga', 'Četvrtina kruga', 'Šestina kruga', 'Petina kruga'],
    'Ugao od 45° je polovina pravog ugla, pa je isečak polovina četvrtine kruga.',
    'osmina', { mediji: isecak(4, 0, 45, '45°') });
  Q(2, 'Iz kruga poluprečnika 5 cm izrezan je koncentrični krug poluprečnika 3 cm. Kolika je površina preostalog kružnog prstena?',
    ['16π cm²', '34π cm²', '4π cm²', '8π cm²'],
    'Prsten se može „odmotati“ u približni pravougaonik čija je jedna stranica $\\pi(R+r)$, a druga širina prstena $R-r$.',
    'prsten', { mediji: prsten(5, 3) });
  Q(1, 'Kako se računa površina kružnog prstena sa spoljašnjim poluprečnikom $R$ i unutrašnjim $r$?',
    ['$P = \\pi(R^{2} - r^{2})$', '$P = \\pi(R - r)^{2}$', '$P = \\pi R^{2} - r^{2}$', '$P = \\pi(R^{2} + r^{2})/2$'],
    'Razlika $R^{2}-r^{2}$ se može zapisati kao $(R-r)(R+r)$, što često olakšava račun.',
    'prsten', { mediji: prsten(4, 2) });
  Q(2, 'Prsten je širine 2 cm, a spoljašnji poluprečnik mu je 10 cm. Kolika mu je površina?',
    ['36π cm²', '4π cm²', '20π cm²', '40π cm²'],
    'Dva prstena iste širine imaju površine koje rastu sa prosečnim poluprečnikom, jer je $R^{2}-r^{2}=(R-r)(R+r)$.',
    'širina', { mediji: prsten(10, 8) });
  Q(3, 'Unutrašnji obim kružnog prstena je $11\\pi$ cm, a spoljašnji $15\\pi$ cm. Kolika je površina prstena?',
    ['26π cm²', '4π cm²', '52π cm²', '13π cm²'],
    'Obim ima samo prvi stepen poluprečnika, a površina drugi. Zato iz obima prvo nađemo poluprečnike, pa tek onda površinu.',
    'obim', { medijiOdgovora: prsten(7.5, 5.5) });
  Q(2, 'Polukrug je nad prečnikom 8 cm. Kolika mu je površina?',
    ['8π cm²', '16π cm²', '4π cm²', '32π cm²'],
    'Hipokrat sa Hiosa je pokazao da zbir dva „mesečeva srpa“ nad katetama pravouglog trougla ima istu površinu kao trougao.',
    'polukrug', {
      mediji: G({ O: Z0, A: [-4, 0], B: [4, 0] }, [
        { is: 'O', r: 4, od: 0, do: 180, b: 1, gusto: 1 },
        { d: 'AB', b: 4, o: '8 cm' },
      ], opts({ velicina: 240 })),
    });
  Q(3, 'Periferijski ugao nad lukom je 36°, a poluprečnik kruga je 15 cm. Kolika je površina kružnog isečka nad tim lukom?',
    ['45π cm²', '36π cm²', '90π cm²', '18π cm²'],
    'Periferijski ugao nad istim lukom ima isti iznos sa svake tačke tog dela kruga, a centralni je dvostruko veći.',
    'tetiva', {
      mediji: (() => {
        const A = naKrugu(Z0, 15, 90), B = naKrugu(Z0, 15, 18), C = naKrugu(Z0, 15, 230);
        return G({ O: Z0, A, B, C }, [
          { kr: 'O', r: 15, b: 1 },
          { d: 'CA', b: 1 },
          { d: 'CB', b: 1 },
          { u: 'ACB', o: '36°', b: 0 },
        ], opts());
      })(),
      medijiOdgovora: G({ O: Z0 }, [
        { is: 'O', r: 15, od: 18, do: 90, b: 1, gusto: 1, o: '72°' },
        { kr: 'O', r: 15, b: 1 },
      ], opts()),
    });
  S(1, 'Spoji centralni ugao sa delom kruga koji čini kružni isečak.',
    [['centralni ugao 90°', 'četvrtina kruga'], ['centralni ugao 180°', 'polovina kruga'], ['centralni ugao 60°', 'šestina kruga'], ['centralni ugao 120°', 'trećina kruga']],
    'Pun ugao ima 360°, pa je jedan stepen zapravo 1/360 kruga.',
    'četvrtina', { mediji: isecak(3, 0, 90) });
  U(2, 'Koja tvrdnja o kružnom isečku NIJE tačna?',
    ['Dvostruki ugao daje četiri puta veću površinu isečka', 'Površina isečka raste pravo srazmerno sa centralnim uglom', 'Polukrug je isečak čiji je centralni ugao jednak 180°', 'Kružni prsten je razlika površina dva koncentrična kruga'],
    'Površina isečka je srazmerna uglu: dvostruki ugao daje dvostruku površinu.',
    'Za dvostruki poluprečnik površina bi bila četiri puta veća, jer zavisi od kvadrata poluprečnika.',
    'proporcija', {
      mediji: G({ O: Z0, P: [8, 0] }, [
        { is: 'O', r: 3, od: 0, do: 60, b: 1, gusto: 1, o: '60°' },
        { is: 'P', r: 3, od: 0, do: 120, b: 2, gusto: 1, o: '120°' },
      ], opts({ bezImena: ['O', 'P'], velicina: 260 })),
    });
  Q(3, 'U krug poluprečnika 2 cm upisan je kvadrat. Kolika je površina oblasti između kruga i kvadrata?',
    ['4π − 8 cm²', '8π − 8 cm²', '4π − 4 cm²', '8π − 4 cm²'],
    'Dijagonala kvadrata upisanog u krug jednaka je prečniku, pa je stranica kvadrata $2\\sqrt{2}$ cm.',
    'oblast', {
      mediji: G({ O: Z0, A: [2, 0], B: [0, 2], C: [-2, 0], D: [0, -2] }, [
        { kr: 'O', r: 2, b: 1 },
        { p: 'ABCD', b: 0, prazno: 1 },
      ], opts({ bezImena: ['O', 'A', 'B', 'C', 'D'] })),
      medijiOdgovora: G({ O: Z0, A: [2, 0], B: [0, 2], C: [-2, 0], D: [0, -2] }, [
        { kr: 'O', r: 2, b: 1 },
        { p: 'ABCD', b: 2, gusto: 1 },
      ], opts({ bezImena: ['O', 'A', 'B', 'C', 'D'] })),
    });

  // ════════════════════════════════════════════════════════════
  // 38. ROTACIJA
  // ════════════════════════════════════════════════════════════
  L('Rotacija');
  Q(1, 'Koji ugao rotacije odgovara rotaciji suprotno od kretanja kazaljke na satu?',
    ['Pozitivan ugao, α > 0', 'Negativan ugao, α < 0', 'Ugao 0°', 'Ugao veći od 360°'],
    'Reč rotacija potiče od latinskog „rotatio“, što znači okretanje ili obrtanje.',
    'rotacija', {
      medijiOdgovora: G({ O: Z0, A: [3, 0], B: [0, -3], C: [-3, 0] }, [
        { l: 'O', r: 3, od: 0, do: 90, str: 1, b: 1, o: 'α > 0' },
        { l: 'O', r: 3, od: 180, do: 270, str: -1, b: 4, o: 'α < 0' },
      ], opts({ bezImena: ['O'] })),
    });
  Q(1, 'Tačka $A(2, 0)$ rotira se oko koordinatnog početka $O$ za 90° u pozitivnom smeru. Koje su koordinate nove tačke?',
    ['(0, 2)', '(0, −2)', '(−2, 0)', '(2, 1)'],
    'Pozitivan smer je suprotan kretanju kazaljke na satu. Tačka sa koordinatama $(x, y)$ prelazi u $(-y, x)$.',
    'ravan', {
      mediji: mreza({ A: [2, 0] }, [{ d: 'OA', b: 4 }]),
      medijiOdgovora: mreza({ A: [2, 0], A1: [0, 2] }, [
        { l: 'O', r: 2, od: 0, do: 90, str: 1, b: 1, o: '90°' },
        { d: 'OA1', b: 1 },
        { tacka: 'A1', b: 1 },
      ]),
    });
  Q(2, 'Tačka $(1, 1)$ rotira se oko $O$ za 90°. Koje su koordinate nove tačke?',
    ['(−1, 1)', '(1, −1)', '(−1, −1)', '(1, 1)'],
    'Rotacija za 90° u pozitivnom smeru menja $(x, y)$ u $(-y, x)$.',
    'koordinate', {
      mediji: mreza({ P: [1, 1] }, [{ d: 'OP', b: 4 }, { tacka: 'P', b: 1 }]),
      medijiOdgovora: mreza({ P: [1, 1], Q: [-1, 1] }, [
        { l: 'O', r: Math.SQRT2, od: 45, do: 135, str: 1, b: 1 },
        { d: 'OQ', b: 1 },
        { tacka: 'Q', b: 1 },
      ]),
    });
  Q(2, 'Tačka $B(2, -2)$ rotira se oko $O$ za −90°. Koje su koordinate nove tačke?',
    ['(−2, −2)', '(2, 2)', '(−2, 2)', '(2, −2)'],
    'Rotacija za −90° (u smeru kazaljke) menja $(x, y)$ u $(y, -x)$.',
    'negativan', {
      mediji: mreza({ B: [2, -2] }, [{ d: 'OB', b: 4 }, { tacka: 'B', b: 1 }]),
      medijiOdgovora: mreza({ B: [2, -2], Q: [-2, -2] }, [
        { l: 'O', r: 2.83, od: -135, do: -45, str: -1, b: 1 },
        { d: 'OQ', b: 1 },
        { tacka: 'Q', b: 1 },
      ]),
    });
  Q(2, 'Rotacija za 180° oko tačke $O$ je isto što i:',
    ['centralna simetrija u odnosu na O', 'osna simetrija u odnosu na pravu OA', 'translacija za vektor OA', 'rotacija za 90° oko tačke O'],
    'Pri rotaciji za 180° tačka $O$ ostaje na mestu, a svaka tačka i njena slika su simetrične u odnosu na $O$.',
    'simetrija', {
      mediji: G({ O: Z0, A: [1, -1], B: [3, 0], C: [1.5, 2.5] }, [
        { p: 'ABC', b: 1, gusto: 1 },
        { tacka: 'O', b: 0 },
      ], { velicina: 240 }),
      medijiOdgovora: G({ O: Z0, A: [1, -1], B: [3, 0], C: [1.5, 2.5] }, [
        { p: 'ABC', b: 4, prazno: 1, isp: 1 },
        { p: 'ABC', b: 1, gusto: 1, okreni: 180, oko: 'O' },
        { tacka: 'O', b: 0 },
      ], { velicina: 240 }),
    });
  Q(1, 'Duž $AB$ rotira se oko tačke $O$. Kakva duž se dobija?',
    ['Podudarna duž, iste dužine', 'Duž dvostruko veća', 'Duž pod pravim uglom', 'Duž koja je polovina originalne'],
    'Rotacija čuva rastojanja, pa su krajevi nove duži jednako udaljeni kao i kod stare.',
    'duž', {
      mediji: G({ O: Z0, A: [-3, -1], B: [1, 2] }, [
        { d: 'AB', b: 1, debljina: 3 },
        { tacka: 'O', b: 0 },
      ], { velicina: 240 }),
      medijiOdgovora: G({ O: Z0, A: [-3, -1], B: [1, 2] }, [
        { d: 'AB', b: 4, isp: 1 },
        { d: 'AB', b: 2, okreni: 120, oko: 'O', debljina: 3 },
        { tacka: 'O', b: 0 },
      ], { velicina: 240 }),
    });
  Q(2, 'Pri rotaciji trougla se ne menja:',
    ['Dužine stranica i uglovi', 'Položaj svih temena u ravni', 'Koordinate svih temena', 'Dužine stranica, ali ne i uglovi'],
    'Rotacija je podudarno preslikavanje, pa se svi uglovi i sve stranice čuvaju.',
    'trougao', {
      mediji: G({ O: Z0, A: [2, 1], B: [4, 1], C: [2, 3] }, [
        { p: 'ABC', b: 1, gusto: 1 },
        { tacka: 'O', b: 0 },
      ], { velicina: 240 }),
      medijiOdgovora: G({ O: Z0, A: [2, 1], B: [4, 1], C: [2, 3] }, [
        { p: 'ABC', b: 4, prazno: 1, isp: 1 },
        { p: 'ABC', b: 2, gusto: 1, okreni: 60, oko: 'O' },
        { tacka: 'O', b: 0 },
      ], { velicina: 240 }),
    });
  Q(2, 'Pravilni šestougao se pri punom obrtu oko svog centra poklopi sam sa sobom koliko puta?',
    ['6 puta (na svakih 60°)', '3 puta (na svakih 120°)', '12 puta (na svakih 30°)', '5 puta (na svakih 72°)'],
    'Pčelinje saće je od šestouglova, jer se oni lepo slažu bez praznina, a svaki šestougao se poklapa sa sobom na svakih 60°.',
    'šestougao', {
      mediji: G({ ...pravilni(6, 3), O: Z0 }, [
        { p: 'ABCDEF', b: 1, gusto: 1 },
        { tacka: 'O', b: 0 },
      ], opts({ bezImena: ['A', 'B', 'C', 'D', 'E', 'F'] })),
      medijiOdgovora: G({ ...pravilni(6, 3), O: Z0 }, [
        { p: 'ABCDEF', b: 4, prazno: 1, isp: 1 },
        { p: 'ABCDEF', b: 1, gusto: 1, okreni: 60, oko: 'O' },
      ], opts({ bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'O'] })),
    });
  Q(3, 'Pravilna peterokraka zvezda poklopi se sama sa sobom pri rotaciji oko svog centra. Koji je najmanji ugao rotacije?',
    ['72°', '36°', '60°', '90°'],
    'Petougao i petokraka zvezda imaju istu rotacionu simetriju: poklapaju se na svakih 72°.',
    'zvezda', {
      mediji: (() => { const z = zvezda(3, 1.146); return G(z.t, [{ p: z.ime, b: 1, gusto: 1 }], opts({ bezImena: [...z.ime, 'O'], velicina: 240 })); })(),
      medijiOdgovora: (() => { const z = zvezda(3, 1.146); return G(z.t, [
        { p: z.ime, b: 4, prazno: 1, isp: 1 },
        { p: z.ime, b: 1, gusto: 1, okreni: 72, oko: 'O' },
      ], opts({ bezImena: [...z.ime, 'O'], velicina: 240 })); })(),
    });
  Q(3, 'Tačka $A(1, \\sqrt{3})$ rotira se oko $O$ za 60°. Koje su koordinate nove tačke?',
    ['(−1, √3)', '($−√3$, 1)', '(1, −√3)', '(0, 2)'],
    'Tačka $(1, \\sqrt{3})$ je na udaljenosti 2 od $O$, a rotacija ne menja udaljenost od centra. Nova tačka je na istoj kružnici, za 60° dalje.',
    'udaljenost', {
      mediji: mreza({ A: naKrugu(Z0, 2, 60) }, [{ d: 'OA', b: 4 }, { tacka: 'A', b: 1 }]),
      medijiOdgovora: mreza({ A: naKrugu(Z0, 2, 60), A1: naKrugu(Z0, 2, 120) }, [
        { l: 'O', r: 2, od: 60, do: 120, str: 1, b: 1, o: '60°' },
        { d: 'OA1', b: 1 },
        { tacka: 'A1', b: 1 },
      ]),
    });
  Q(3, 'Krug poluprečnika 3 cm rotira se oko tačke koja pripada njegovom obimu. Kolika je površina slike tog kruga?',
    ['9π cm²', '18π cm²', '3π cm²', '6π cm²'],
    'Kad se krug rotira oko tačke na obimu, centar opiše luk. Tačka na obimu pri kotrljanju opisuje krivu koja se zove cikloida.',
    'centar', {
      mediji: G({ O: Z0, C: [0, -3] }, [
        { kr: 'O', r: 3, b: 1 },
        { d: 'OC', b: 4, o: 'r' },
        { tacka: 'C', b: 0 },
      ], opts({ bezImena: ['O'] })),
      medijiOdgovora: G({ O: Z0, C: [0, -3] }, [
        { kr: 'O', r: 3, b: 4, prazno: 1, isp: 1 },
        { kr: 'O', r: 3, b: 1, okreni: 90, oko: 'C' },
        { tacka: 'C', b: 0 },
      ], opts({ bezImena: ['O'] })),
    });
  Q(2, 'Pravougli trougao sa katetama 3 cm i 4 cm rotiran je oko pravog ugla za 90°. Kolika je površina slike?',
    ['6 cm²', '12 cm²', '7 cm²', '5 cm²'],
    'Rotacija čuva dužine i uglove, pa i površinu. Trougao sa stranicama 3, 4 i 5 često se pripisuje starim Egipćanima.',
    'katete', {
      mediji: G({ A: Z0, B: [4, 0], C: [0, 3] }, [
        { p: 'ABC', b: 1, gusto: 1 },
        { pu: 'BAC', b: 0 },
        { d: 'AB', b: 0, o: '4 cm' },
        { d: 'AC', b: 0, o: '3 cm' },
      ], { velicina: 240 }),
      medijiOdgovora: G({ A: Z0, B: [4, 0], C: [0, 3] }, [
        { p: 'ABC', b: 4, prazno: 1, isp: 1 },
        { p: 'ABC', b: 2, gusto: 1, okreni: 90, oko: 'A' },
      ], { velicina: 240 }),
    });
  U(1, 'Koja tvrdnja o rotaciji NIJE tačna?',
    ['Pri rotaciji se duž preslikava u duž različite dužine', 'Centar rotacije se preslikava u samog sebe, tačka ostaje na mestu', 'Rotacija za 360° je identično preslikavanje, slika je ista figura', 'Rotacija za 180° je centralna simetrija u odnosu na centar rotacije'],
    'Rotacija čuva rastojanja, pa je slika duži podudarna sa originalom, tj. iste je dužine.',
    'Rotacija je povratna: rotacija za −α vraća figuru tačno na početno mesto.',
    'podudarnost', {
      mediji: G({ O: Z0, A: [1, 0], B: [2, 1] }, [
        { d: 'AB', b: 4, isp: 1 },
        { d: 'AB', b: 2, okreni: 90, oko: 'O' },
      ], opts({ bezImena: ['O'] })),
    });
  S(1, 'Spoji pojam iz rotacije sa njegovim opisom.',
    [['centar rotacije', 'tačka koja ostaje na mestu'], ['ugao rotacije α', 'koliko se figura zakrenula'], ['pozitivan smer', 'suprotno od kazaljke na satu'], ['rotacija za −90°', 'u smeru kazaljke na satu']],
    'Svaka tačka osim centra rotacije opisuje kružni luk oko njega.',
    'smer');
  Q(2, 'Tačka $A(1, 0)$ rotira se oko $O$ za 90°, pa još jednom za 90° u istom smeru. Gde je konačno?',
    ['(−1, 0)', '(0, −1)', '(1, 0)', '(0, 1)'],
    'Dve rotacije za po 90° daju rotaciju za 180°, a to je centralna simetrija u odnosu na $O$.',
    'obrtanje', {
      mediji: mreza({ A: [1, 0] }, [{ d: 'OA', b: 4 }, { tacka: 'A', b: 1 }]),
      medijiOdgovora: mreza({ A: [1, 0], A1: [0, 1], A2: [-1, 0] }, [
        { l: 'O', r: 1, od: 0, do: 90, str: 1, b: 1 },
        { l: 'O', r: 1, od: 90, do: 180, str: 1, b: 2 },
        { tacka: 'A2', b: 1 },
      ]),
    });
  Q(2, 'Tačka $A(2, 2)$ rotira se oko $O$ u pozitivnom smeru i pređe u tačku $(-2, 2)$. Koliki je ugao rotacije?',
    ['90°', '−90°', '180°', '45°'],
    'Tačka $(2, 2)$ je na pravoj $y = x$, a $(-2, 2)$ na pravoj $y = -x$, pa je ugao između njih 90°.',
    'pravac', { mediji: mreza({ A: [2, 2] }, [{ d: 'OA', b: 4 }, { tacka: 'A', b: 1 }]), medijiOdgovora: mreza({ A: [2, 2], A1: [-2, 2] }, [{ d: 'OA', b: 4 }, { d: 'OA1', b: 1 }, { tacka: 'A1', b: 1 }]) });

  void proveri;
};
