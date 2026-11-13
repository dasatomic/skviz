// Tema 5: Ugao (lekcije 5.1–5.6)
module.exports = ({ L, Z, K, G, O, bez, r, proveri, naKrugu, sat, uglomer, pica, luk, krug }) => {
  // zraci iz O pod datim uglovima (stepeni) – tačke A, B, C… na rastojanju R
  const zraci = (uglovi, R = 4, imena = 'ABCDEFGH') => { const t = { O: [0, 0] }; uglovi.forEach((u, i) => (t[imena[i]] = naKrugu([0, 0], R, u))); return t; };
  // sat sa obojenim uglom između kazaljki (od ugla a1 do a2, matematički smer, stepeni)
  const satUgao = (h, m, x = {}) => {
    const s = sat(h, m, x);
    const am = 90 - m * 6, ah = 90 - (h % 12) * 30 - m * 0.5;
    const [od, doo] = [Math.min(am, ah), Math.max(am, ah)];
    s.e.unshift({ lin: [[0, 0], ...luk(0, 0, 1.6, od, doo, 24)], zatv: 1, b: 2, gusto: 1, id: 'ug', k: x.kUgla ?? 1 });
    return s;
  };
  const ugaoTransverzale = (ug) => {
    // a: y = 2, b: y = −1, transverzala kroz P(1, 2) pod uglom `ug`
    const d = [Math.cos((ug * Math.PI) / 180), Math.sin((ug * Math.PI) / 180)];
    const P = [1, 2], t = 3 / d[1], Q = [r(P[0] - t * d[0]), -1];
    return { P, Q, C: [r(P[0] + 1.6 * d[0]), r(P[1] + 1.6 * d[1])], D: [r(Q[0] - 1.6 * d[0]), r(Q[1] - 1.6 * d[1])], pom: [r(Q[0] - P[0]), -3] };
  };

  // ════════════════ 5.1 Ugao, centralni ugao ════════════════
  L('Ugao, centralni ugao, jednakost uglova');

  Z(1, 'Iz tačke $O$ polaze tri poluprave $OA$, $OB$ i $OC$. Koliko konveksnih uglova (manjih od opruženog) određuju?',
    ['$3$', '$2$', '$6$', '$1$'],
    [K('Svaki par polupravih određuje jedan ugao: $∠AOB$, $∠BOC$, $∠AOC$.', ['u1', 'u2', 'u3']),
     K('Parova je $3$, pa i uglova ima $3$.')],
    G(zraci([10, 60, 130]), [{ d: 'OA' }, { d: 'OB' }, { d: 'OC' }, { u: 'AOB', b: 0, id: 'u1', k: 1, r: 26 }, { u: 'BOC', b: 1, id: 'u2', k: 1, r: 36 }, { u: 'AOC', b: 2, id: 'u3', k: 1, r: 50 }], { velicina: 200 }));

  Z(1, 'Koji deo punog ugla je opružen ugao?',
    ['polovina', 'četvrtina', 'trećina', 'ceo'],
    [K('Pun ugao je ceo krug oko temena, a opružen ugao čine dve suprotne poluprave – pola kruga.', ['o']),
     K('Opružen ugao je polovina punog ugla.')],
    G({ O: [0, 0], A: [4, 0], B: [-4, 0] }, [{ lin: [[0, 0], ...luk(0, 0, 3, 0, 360, 48)], zatv: 1, b: 4, prazno: 1 }, { lin: [[0, 0], ...luk(0, 0, 3, 0, 180, 24)], zatv: 1, b: 1, gusto: 1, crtaj: 1, id: 'o' }, { d: 'OA' }, { d: 'OB' }], { velicina: 180 }));

  Z(1, 'Velika kazaljka sata se pomeri sa $12$ na $4$. Koji deo punog ugla opisuje?',
    ['${1|3}$', '${1|4}$', '${2|3}$', '${1|2}$'],
    [K('Brojčanik ima $12$ jednakih delova; od $12$ do $4$ su $4$ dela: ${4|12}$.'),
     K('${4|12} = {1|3}$ punog ugla.', ['min'])],
    sat(12, 0, { okreniMin: -120, ponovi: 1 }));

  Z(1, 'Dve poluprave $Oa$ i $Ob$ sa zajedničkim početkom, koje nisu na istoj pravoj, određuju koliko uglova?',
    ['$2$ – konveksan i nekonveksan', '$1$', '$4$', 'beskonačno mnogo'],
    [K('Poluprave dele ravan na dva dela: manji (konveksan) i veći (nekonveksan) ugao.', ['m', 'v']),
     K('Zajedno daju pun ugao.')],
    G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 70) }, [{ d: 'OA' }, { d: 'OB' }, { lin: [[0, 0], ...luk(0, 0, 1.5, 0, 70, 12)], zatv: 1, b: 2, gusto: 1, id: 'm', k: 1 }, { lin: [[0, 0], ...luk(0, 0, 2.2, 70, 360, 48)], zatv: 1, b: 1, id: 'v', k: 1 }], { velicina: 180 }));

  Z(2, 'Kružnica je podeljena na $8$ jednakih lukova. Koji deo punog ugla je centralni ugao nad $3$ uzastopna luka?',
    ['${3|8}$', '${1|8}$', '${3|5}$', '${8|3}$'],
    [K('Jednakim lukovima odgovaraju jednaki centralni uglovi: svaki je ${1|8}$ punog ugla.'),
     K('Tri luka: ${3|8}$ punog ugla.', ['o'])],
    G(O, [...pica(8, 3, { R: 3, id: 'o', k: 2 }), ...pica(8, 0, { R: 3 })], { ...bez, velicina: 180 }));

  Z(2, 'Pica je presečena na $9$ jednakih parčadi (iz centra). Koliko stepeni ima centralni ugao jednog parčeta?',
    ['$40°$', '$36°$', '$20°$', '$45°$'],
    [K('Svih $9$ centralnih uglova zajedno čine pun ugao od $360°$.'),
     K('$360° : 9 = 40°$.')],
    G(O, pica(9, 1, { R: 3 }), { ...bez, velicina: 160 }));

  Z(2, 'Tačka $M$ je na slici. Da li pripada konveksnom uglu $∠AOB$?',
    ['ne, ona je u nekonveksnom uglu', 'da', 'da, na njegovom kraku', 'ne, ona je teme'],
    [K('Konveksni ugao $∠AOB$ je manji deo ravni između krakova (osenčen).', ['u']),
     K('Tačka $M$ je sa druge strane krakova – u nekonveksnom delu.')],
    G({ O: [0, 0], A: [4, 0.5], B: [1.5, 3.5], M: [-1.5, -1] }, [{ d: 'OA' }, { d: 'OB' }, { u: 'AOB', r: 50, b: 0, id: 'u', k: 1 }, { tacka: 'M' }], { velicina: 180 }));

  Z(3, 'Iz jedne tačke polazi $5$ polupravih (nikoje dve na istoj pravoj). Koliko konveksnih uglova određuju?',
    ['$10$', '$5$', '$20$', '$15$'],
    [K('Svaki par polupravih određuje jedan konveksan ugao (ako nisu suprotne).'),
     K('Prva je u paru sa $4$, druga sa još $3$ nove, …: $4 + 3 + 2 + 1 = 10$.')],
    G(zraci([0, 50, 110, 200, 290]), [{ d: 'OA', crtaj: 1 }, { d: 'OB', crtaj: 1, kasni: 0.4 }, { d: 'OC', crtaj: 1, kasni: 0.8 }, { d: 'OD', crtaj: 1, kasni: 1.2 }, { d: 'OE', crtaj: 1, kasni: 1.6 }], { velicina: 180 }));

  Z(2, 'Koji deo kruga zauzima isečak sa centralnim uglom od $90°$?',
    ['${1|4}$', '${1|2}$', '${1|9}$', '${1|3}$'],
    [K('Pun ugao je $360°$, a $90° = 360° : 4$.'),
     K('Isečak je ${1|4}$ kruga.', ['o'])],
    G(O, [...pica(4, 1, { R: 3, id: 'o' }), { tx: '90°', at: [1, 1] }], { ...bez, velicina: 150 }));

  Z(3, 'Za koliko vremena kazaljka za sate opiše ${1|12}$ punog ugla?',
    ['$1$ sat', '$5$ minuta', '$12$ sati', '$1$ minut'],
    [K('Kazaljka za sate obiđe pun krug za $12$ sati.'),
     K('${1|12}$ kruga – za $1$ sat (sa jednog broja na sledeći).', ['sat'])],
    sat(2, 0, { okreniSat: -30, okreniMin: -360, ponovi: 1 }));

  // ════════════════ 5.2 Prenošenje i nadovezivanje uglova ════════════════
  L('Prenošenje i nadovezivanje uglova');

  {
    const t = { ...zraci([0, 35, 50, 85], 4, 'ABPC'), Q: [7, 0], R: [11, 0], S: [r(7 + 4 * Math.cos((50 * Math.PI) / 180)), r(4 * Math.sin((50 * Math.PI) / 180))] };
    Z(1, 'Nadovežemo uglove od $35°$ i $50°$. Koliki je dobijeni ugao?',
      ['$85°$', '$15°$', '$75°$', '$95°$'],
      [K('Nadovezivanje: drugi ugao prenesemo tako da mu jedan krak leži na kraku prvog ugla.', ['d']),
       K('Novi ugao ima meru $35° + 50° = 85°$.', ['z'])],
      G(t, [{ d: 'OA' }, { d: 'OB' }, { u: 'AOB', o: '35°', b: 0, r: 40 }, { d: 'QR', b: 1 }, { d: 'QS', b: 1 }, { u: 'RQS', o: '50°', b: 1, r: 40 },
        { d: 'OA', b: 1, okreni: 35, oko: 'O', k: 1 }, { d: 'OP', b: 1, okreni: 35, oko: 'O', k: 1 }, { u: 'AOP', b: 1, r: 55, okreni: 35, oko: 'O', k: 1, id: 'd' }, { u: 'AOC', b: 3, r: 75, k: 2, id: 'z', o: '85°' }],
        { bezImena: ['A', 'B', 'P', 'C', 'Q', 'R', 'S', 'O'], velicina: 240 }));
  }

  Z(1, 'Tri jednaka ugla nadovezana jedan na drugi čine opružen ugao. Koliki je svaki?',
    ['$60°$', '$30°$', '$90°$', '$120°$'],
    [K('Opružen ugao ima $180°$.'),
     K('$180° : 3 = 60°$.', ['u'])],
    G(zraci([0, 60, 120, 180]), [{ d: 'OA' }, { d: 'OD' }, { d: 'OB', k: 1 }, { d: 'OC', k: 1 }, { u: 'AOB', b: 0, id: 'u', k: 1 }, { u: 'BOC', b: 1, id: 'u', k: 1 }, { u: 'COD', b: 2, id: 'u', k: 1 }], { velicina: 200 }));

  {
    // uglovi trougla „otkinu se“ i slože kod temena C
    const t = { A: [0, 0], B: [6, 0], C: [2, 3.5], E: [3, 5.25], F: [0, 5.25] };
    Z(2, 'Dva ugla trougla su $50°$ i $60°$. Ako „otkinemo“ sva tri ugla i nadovežemo ih, dobijamo opružen ugao. Koliki je treći ugao?',
      ['$70°$', '$110°$', '$80°$', '$60°$'],
      [K('Kroz $C$ povučemo pravu paralelnu sa $AB$ i translacijom prenesemo uglove kod $A$ i $B$ do temena $C$.', ['tr']),
       K('Ta dva ugla i ugao unakrsni uglu kod $C$ zajedno čine opružen ugao: zbir uglova trougla je $180°$.'),
       K('$180° − 50° − 60° = 70°$.')],
      G(t, [{ p: 'ABC', b: 4, prazno: 1 }, { u: 'BAC', o: '50°', b: 0 }, { u: 'CBA', o: '60°', b: 1 }, { u: 'ACB', o: '?', b: 2 },
        { lin: [[-2, 3.5], [6, 3.5]], b: 3, isp: 1, k: 1, id: 'tr' }, { d: 'CE', isp: 1, k: 1 }, { d: 'CF', isp: 1, k: 1 },
        { u: 'BAC', b: 0, k: 1, pomeri: [2, 3.5] }, { u: 'CBA', b: 1, k: 1, pomeri: [-4, 3.5] }, { u: 'ECF', b: 2, k: 1 }],
        { bezImena: ['A', 'B', 'C', 'E', 'F'], velicina: 200 }));
  }

  Z(1, 'Ugao od $47°$ prenesemo tri puta, nadovezujući ga. Koliki ugao dobijamo?',
    ['$141°$', '$121°$', '$50°$', '$94°$'],
    [K('Nadovezivanjem se mere uglova sabiraju: $47° + 47° + 47°$.'),
     K('$3 · 47° = 141°$.', ['u'])],
    G(zraci([0, 47, 94, 141]), [{ d: 'OA' }, { u: 'AOB', o: '47°', b: 0 }, { d: 'OB' }, { d: 'OC', k: 1 }, { d: 'OD', k: 1 }, { u: 'BOC', b: 0, k: 1, id: 'u' }, { u: 'COD', b: 0, k: 1, id: 'u' }], { velicina: 200 }));

  Z(2, 'Poluprava $OB$ je unutar ugla $∠AOC = 120°$, a $∠AOB = 45°$. Koliki je $∠BOC$?',
    ['$75°$', '$165°$', '$65°$', '$85°$'],
    [K('$∠AOC = ∠AOB + ∠BOC$.'),
     K('$∠BOC = 120° − 45° = 75°$.', ['x'])],
    G(zraci([0, 45, 120]), [{ d: 'OA' }, { d: 'OB' }, { d: 'OC' }, { u: 'AOB', o: '45°', b: 0, r: 30 }, { u: 'BOC', o: '?', b: 1, r: 40, id: 'x' }], { velicina: 200 }));

  Z(2, 'Pet jednakih uglova nadovezanih oko jedne tačke popunjava pun ugao. Koliki je svaki ugao?',
    ['$72°$', '$36°$', '$60°$', '$90°$'],
    [K('Pun ugao: $360°$.'),
     K('$360° : 5 = 72°$.', ['p'])],
    G(O, pica(5, [0, 1, 2, 3, 4], { R: 3, id: 'p', b: 0 }).map((e, i) => ({ ...e, b: i, kasni: 0.2 + i * 0.3, crtaj: 1 })), { ...bez, velicina: 160 }));

  Z(2, 'Oko tačke su nadovezana četiri ugla: $100°$, $80°$ i dva jednaka ugla. Koliki je svaki od ta dva?',
    ['$90°$', '$180°$', '$80°$', '$100°$'],
    [K('Svi zajedno čine pun ugao: $100° + 80° + x + x = 360°$.'),
     K('$2x = 180°$, pa je $x = 90°$.', ['x'])],
    G(zraci([0, 100, 180, 270]), [{ d: 'OA' }, { d: 'OB' }, { d: 'OC' }, { d: 'OD' }, { u: 'AOB', o: '100°', b: 0 }, { u: 'BOC', o: '80°', b: 1 }, { pu: 'COD', id: 'x', k: 2 }, { pu: 'DOA', id: 'x', k: 2 }, { tx: 'x', at: [-1.2, -1.2] }, { tx: 'x', at: [1.2, -1.2] }], { velicina: 180 }));

  Z(3, 'Ugao $∠AOB = 130°$. Unutar njega su poluprave $OC$ i $OD$ tako da je $∠AOC = ∠COD = ∠DOB$. Koliki je $∠AOD$?',
    ['$86°40\'$', '$65°$', '$43°20\'$', '$87°$'],
    [K('Ugao je podeljen na $3$ jednaka dela: $130° : 3 = 43°20\'$ (jer je $1° = 60\'$, a $10° = 600\'$, $600\' : 3 = 200\' = 3°20\'$).'),
     K('$∠AOD = 2 · 43°20\' = 86°40\'$.', ['ad'])],
    G(zraci([0, 130 / 3, 260 / 3, 130]), [{ d: 'OA' }, { d: 'OB' }, { d: 'OC', isp: 1 }, { d: 'OD', isp: 1 }, { u: 'AOD', b: 1, id: 'ad', k: 2, r: 50 }], { velicina: 200 }));

  Z(3, 'Kolika je zbir uglova kod temena kad se uglovi četvorougla „otkinu“ i nadovežu jedan na drugi?',
    ['$360°$', '$180°$', '$270°$', '$540°$'],
    [K('Dijagonala deli četvorougao na dva trougla.', ['d']),
     K('Uglovi svakog trougla daju $180°$, pa uglovi četvorougla daju $2 · 180° = 360°$ – pun ugao.')],
    G({ A: [0, 0], B: [5, 0], C: [6, 3.5], D: [1, 4] }, [{ p: 'ABCD' }, { u: 'DAB', b: 0 }, { u: 'ABC', b: 1 }, { u: 'BCD', b: 2 }, { u: 'CDA', b: 5 }, { d: 'AC', b: 3, isp: 1, k: 1, id: 'd' }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 200 }));

  // ════════════════ 5.3 Upoređivanje, vrste uglova ════════════════
  L('Upoređivanje uglova; vrste uglova');

  Z(1, 'Kakav je ugao od $135°$?',
    ['tup', 'oštar', 'prav', 'opružen'],
    [K('Oštar: manji od $90°$; prav: $90°$; tup: između $90°$ i $180°$; opružen: $180°$.'),
     K('$90° < 135° < 180°$ – tup ugao.')],
    G(zraci([0, 135]), [{ d: 'OA' }, { d: 'OB', okreni: 0 }, { u: 'AOB', b: 1, o: '135°' }], { bezImena: ['A', 'B'], velicina: 180 }));

  Z(1, 'Koliki je uporedni ugao ugla od $47°$?',
    ['$133°$', '$43°$', '$313°$', '$47°$'],
    [K('Uporedni uglovi imaju zajednički krak, a druga dva kraka su suprotne poluprave – zajedno čine opružen ugao.', ['p']),
     K('$180° − 47° = 133°$.')],
    G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 47), C: [-4, 0] }, [{ d: 'OA' }, { d: 'OB' }, { d: 'OC', crtaj: 1 }, { u: 'AOB', o: '47°', b: 0 }, { u: 'BOC', o: '?', b: 1, r: 30, id: 'p' }], { velicina: 200 }));

  Z(1, 'Koji od ovih uglova je oštar?',
    ['$89°$', '$90°$', '$91°$', '$180°$'],
    [K('Oštar ugao je manji od pravog ($90°$).'),
     K('Samo $89°$ je manji od $90°$.')]);

  Z(2, 'Jedan od dva uporedna ugla je $4$ puta veći od drugog. Koliki je manji?',
    ['$36°$', '$45°$', '$144°$', '$30°$'],
    [K('Zbir uporednih uglova je $180°$; manji je $1$ deo, veći $4$ dela – ukupno $5$ delova.'),
     K('Jedan deo: $180° : 5 = 36°$. Veći je $144°$.', ['m'])],
    G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 36), C: [-4, 0] }, [{ d: 'OA' }, { d: 'OB' }, { d: 'OC' }, { u: 'AOB', b: 0, id: 'm', o: 'x' }, { u: 'BOC', b: 1, r: 30, o: '4x' }], { velicina: 200 }));

  Z(2, 'Jedan od uporednih uglova je za $30°$ veći od drugog. Koliki je veći?',
    ['$105°$', '$75°$', '$120°$', '$150°$'],
    [K('Ako od zbira $180°$ oduzmemo razliku $30°$, ostaju dva jednaka ugla: $150° : 2 = 75°$ (manji).'),
     K('Veći: $75° + 30° = 105°$.')]);

  Z(2, 'Kakav ugao zaklapaju kazaljke sata u $4$ sata?',
    ['tup ($120°$)', 'oštar ($40°$)', 'prav', 'tup ($100°$)'],
    [K('Između dva susedna broja na satu je $360° : 12 = 30°$.'),
     K('Kad je tačno četiri sata, kazaljke dele $4$ takva dela: $4 · 30° = 120°$ – tup ugao.', ['ug'])],
    satUgao(4, 0));

  Z(2, 'Mogu li dva oštra ugla biti uporedni?',
    ['ne, njihov zbir je manji od $180°$', 'da, uvek', 'da, ako su jednaki', 'samo ako je jedan od $45°$'],
    [K('Zbir uporednih uglova mora biti $180°$.'),
     K('Dva oštra ugla zajedno imaju manje od $90° + 90° = 180°$ – ne mogu biti uporedni.')]);

  Z(3, 'Uporedni uglovi $α$ i $β$: $α$ je oštar. Šta je sigurno $β$?',
    ['tup', 'oštar', 'prav', 'opružen'],
    [K('$β = 180° − α$, a $α < 90°$.'),
     K('Zato je $β > 90°$, a manji je od $180°$ – tup ugao.')]);

  Z(3, 'Ugao je $5$ puta manji od svog uporednog ugla. Kakav je ugao koji je za $40°$ veći od njega?',
    ['oštar ($70°$)', 'prav', 'tup ($110°$)', 'oštar ($30°$)'],
    [K('$x + 5x = 180°$, pa je $x = 30°$.'),
     K('$30° + 40° = 70°$ – oštar ugao.')]);

  Z(1, 'Na slici je ugao $∠AOB$. Kakav je to ugao?',
    ['prav', 'oštar', 'tup', 'opružen'],
    [K('Krak $OB$ je normalan na $OA$ – na mreži ide tačno uspravno.', ['u']),
     K('To je prav ugao ($90°$).')],
    G({ O: [1, 1], A: [5, 1], B: [1, 4] }, [{ mreza: [0, 6, 0, 5], brojevi: 0 }, { d: 'OA', b: 0 }, { d: 'OB', b: 0 }, { pu: 'AOB', id: 'u', k: 1 }], { velicina: 180 }));

  // ════════════════ 5.4 Merenje uglova ════════════════
  L('Merenje uglova; sabiranje i oduzimanje uglova');

  Z(1, 'Kolika je mera ugla $∠AOB$ na uglomeru?',
    ['$130°$', '$50°$', '$120°$', '$140°$'],
    [K('Krak $OA$ je na podeoku $0°$, pa čitamo samo gde prolazi krak $OB$.'),
     K('$OB$ je jedan podeok ($10°$) posle $120°$: $130°$. (Greška $50°$ nastaje čitanjem od druge strane uglomera.)', ['u'])],
    G({ O: [0, 0], A: [6, 0], B: naKrugu([0, 0], 6, 130) }, [...uglomer({ R: 5 }), { d: 'OA', b: 1, debljina: 3 }, { d: 'OB', b: 1, debljina: 3 }, { u: 'AOB', b: 2, id: 'u', k: 2, r: 30 }], { bezImena: ['O', 'A', 'B'], velicina: 260 }));

  Z(1, 'Koliko minuta ima $2,5°$?',
    ['$150\'$', '$25\'$', '$250\'$', '$130\'$'],
    [K('$1° = 60\'$.'),
     K('$2,5° = 2,5 · 60\' = 150\'$.')]);

  Z(1, 'Za koliko stepeni se pomeri velika kazaljka za $1$ minut?',
    ['$6°$', '$1°$', '$30°$', '$12°$'],
    [K('Za $60$ minuta velika kazaljka napravi pun krug: $360°$.'),
     K('$360° : 60 = 6°$ za jedan minut.')],
    sat(12, 0, { okreniMin: -6, ponovi: 1 }));

  Z(2, 'Izračunaj: $37°45\' + 25°30\'$.',
    ['$63°15\'$', '$62°75\'$', '$62°15\'$', '$63°75\'$'],
    [K('Stepeni: $37° + 25° = 62°$; minuti: $45\' + 30\' = 75\'$.'),
     K('$75\' = 1°15\'$, pa je ukupno $63°15\'$.')]);

  Z(2, 'Izračunaj: $90° − 37°25\'$.',
    ['$52°35\'$', '$53°35\'$', '$52°75\'$', '$63°35\'$'],
    [K('Pozajmimo jedan stepen: $90° = 89°60\'$.'),
     K('$89°60\' − 37°25\' = 52°35\'$.')]);

  Z(2, 'Za koliko se pomeri mala kazaljka (za sate) za $1$ minut?',
    ['$30\'$', '$6°$', '$1°$', '$5\'$'],
    [K('Mala kazaljka za $1$ sat ($60$ min) pređe $30°$.'),
     K('Za $1$ minut: $30° : 60 = 0,5° = 30\'$.')]);

  Z(2, 'Izračunaj: $3 · 25°40\'$.',
    ['$77°$', '$75°120\'$', '$76°$', '$75°40\'$'],
    [K('$3 · 25° = 75°$ i $3 · 40\' = 120\'$.'),
     K('$120\' = 2°$, pa je $75° + 2° = 77°$.')]);

  Z(3, 'Koliki ugao zaklapaju kazaljke sata u $3:30$?',
    ['$75°$', '$90°$', '$60°$', '$105°$'],
    [K('Velika kazaljka je na $6$: $180°$ od $12$.'),
     K('Mala kazaljka nije na $3$ nego na pola puta između $3$ i $4$: $3 · 30° + 15° = 105°$ od $12$.'),
     K('Ugao: $180° − 105° = 75°$.', ['ug'])],
    satUgao(3, 30, { kUgla: 3 }));

  Z(3, 'Koliki ugao zaklapaju kazaljke u $10:10$?',
    ['$115°$', '$120°$', '$110°$', '$125°$'],
    [K('Velika kazaljka na $2$: $60°$ od $12$ (u smeru kazaljke).'),
     K('Mala: $10 · 30° + 10 · 0,5° = 305°$ od $12$, tj. $55°$ pre broja $12$.'),
     K('Ugao: $55° + 60° = 115°$.', ['ug'])],
    satUgao(10, 10, { kUgla: 3 }));

  Z(3, 'Podeli ugao od $100°$ na tri jednaka dela.',
    ['$33°20\'$', '$33°30\'$', '$33°33\'$', '$33°$'],
    [K('$100° : 3 = 33°$ i ostaje $1°$.'),
     K('$1° = 60\'$, a $60\' : 3 = 20\'$. Dakle $33°20\'$.')]);

  // ════════════════ 5.5 Ugao između dve prave, unakrsni uglovi ════════════════
  L('Ugao između dve prave; unakrsni uglovi');

  {
    const t = { O: [0, 0], A: naKrugu([0, 0], 4, 40), B: naKrugu([0, 0], 4, 180), C: naKrugu([0, 0], 4, 220), D: [4, 0] };
    Z(1, 'Dve prave se seku i jedan od uglova je $40°$. Koliki je njemu unakrsni ugao?',
      ['$40°$', '$140°$', '$50°$', '$320°$'],
      [K('Unakrsni uglovi imaju zajedničko teme, a kraci jednog su produžeci krakova drugog.'),
       K('Okretanjem za $180°$ oko $O$ jedan prelazi u drugi – jednaki su: $40°$.', ['u'])],
      G(t, [{ d: 'AC' }, { d: 'BD' }, { u: 'DOA', o: '40°', b: 0 }, { u: 'DOA', b: 1, okreni: 180, oko: 'O', k: 2, id: 'u' }], { bezImena: ['A', 'B', 'C', 'D', 'O'], velicina: 200 }));
  }

  Z(1, 'Dve prave se seku pod pravim uglom. Koliko je pravih uglova?',
    ['$4$', '$1$', '$2$', '$0$'],
    [K('Uporedni ugao pravog je $180° − 90° = 90°$, a unakrsni je jednak njemu.'),
     K('Sva četiri ugla su prava – prave su normalne.')],
    G({ O: [0, 0], A: [3, 0], B: [0, 3], C: [-3, 0], D: [0, -3] }, [{ d: 'AC' }, { d: 'BD' }, { pu: 'AOB' }, { pu: 'BOC', k: 2 }, { pu: 'COD', k: 2 }, { pu: 'DOA', k: 2 }], { bezImena: ['A', 'B', 'C', 'D', 'O'], velicina: 160 }));

  Z(2, 'Dve prave se seku. Zbir tri od četiri ugla koje grade je $300°$. Koliki je ugao između tih pravih?',
    ['$60°$', '$120°$', '$100°$', '$300°$'],
    [K('Sva četiri ugla čine pun ugao: četvrti je $360° − 300° = 60°$.'),
     K('Uglovi su $60°, 120°, 60°, 120°$. Ugao između pravih je manji od njih: $60°$.')]);

  Z(2, 'Dve prave se seku tako da je jedan ugao $4$ puta veći od susednog. Koliki je ugao između pravih?',
    ['$36°$', '$144°$', '$45°$', '$72°$'],
    [K('Susedni uglovi su uporedni: $x + 4x = 180°$, $x = 36°$.'),
     K('Ugao između pravih je manji od uglova: $36°$.')]);

  Z(2, 'Prave grade ugao od $130°$. Koliki je ugao između tih pravih?',
    ['$50°$', '$130°$', '$65°$', '$230°$'],
    [K('Ugao između dve prave je onaj od uglova koje grade koji nije veći od $90°$ (oštar ili prav).'),
     K('Uporedni ugao: $180° − 130° = 50°$.', ['m'])],
    G({ O: [0, 0], A: naKrugu([0, 0], 4, 130), B: [4, 0], C: naKrugu([0, 0], 4, 310), D: [-4, 0] }, [{ d: 'AC' }, { d: 'BD' }, { u: 'BOA', o: '130°', b: 1, r: 25 }, { u: 'AOD', b: 2, id: 'm', k: 2, r: 40 }], { bezImena: ['A', 'B', 'C', 'D', 'O'], velicina: 200 }));

  Z(2, 'Zbir dva unakrsna ugla je $150°$. Koliki je svaki od druga dva ugla?',
    ['$105°$', '$75°$', '$150°$', '$210°$'],
    [K('Unakrsni uglovi su jednaki: svaki je $150° : 2 = 75°$.'),
     K('Druga dva su im uporedni: $180° − 75° = 105°$.')]);

  Z(2, 'Razlika dva susedna ugla koje grade prave koje se seku je $40°$. Koliki je manji ugao?',
    ['$70°$', '$110°$', '$40°$', '$140°$'],
    [K('Susedni uglovi su uporedni: zbir $180°$, razlika $40°$.'),
     K('Manji: $(180° − 40°) : 2 = 70°$; veći: $110°$.')]);

  Z(3, 'Tri prave prolaze kroz jednu tačku i grade $6$ uglova. Dva susedna su $50°$ i $60°$. Koliki je treći ugao do njih?',
    ['$70°$', '$80°$', '$50°$', '$60°$'],
    [K('Tri susedna ugla zajedno čine opružen ugao (od jedne poluprave do njoj suprotne).'),
     K('$180° − 50° − 60° = 70°$. (Ostala tri ugla su unakrsni: $50°$, $60°$, $70°$.)', ['x'])],
    G(zraci([0, 50, 110, 180, 230, 290]), [{ d: 'AD' }, { d: 'BE' }, { d: 'CF' }, { u: 'AOB', o: '50°', b: 0 }, { u: 'BOC', o: '60°', b: 1 }, { u: 'COD', o: '?', b: 2, id: 'x' }], { bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'O'], velicina: 200 }));

  Z(3, 'Dve prave se seku. Jedan ugao je $x$, a njemu uporedni je $2x + 30°$. Koliki je $x$?',
    ['$50°$', '$30°$', '$60°$', '$75°$'],
    [K('$x + 2x + 30° = 180°$'),
     K('$3x = 150°$, $x = 50°$. Uporedni: $130°$.')]);

  Z(1, 'Dve prave se seku pod uglom od $65°$. Koji od ovih uglova NE nastaje pri tome?',
    ['$125°$', '$65°$', '$115°$', 'svi nastaju'],
    [K('Uglovi su: $65°$, uporedni $180° − 65° = 115°$, i unakrsni – opet $65°$ i $115°$.'),
     K('Ugao od $125°$ ne nastaje.')]);

  // ════════════════ 5.6 Uglovi na transverzali ════════════════
  L('Uglovi na transverzali');

  {
    const v = ugaoTransverzale(70);
    const t = { P: v.P, Q: v.Q, C: v.C, D: v.D, A: [4, 2], B: [v.Q[0] + 3, -1], a1: [-3, 2], a2: [5, 2], b1: [-3, -1], b2: [5, -1] };
    Z(1, 'Prave $a$ i $b$ su paralelne, a seče ih prava $c$. Ugao kod prave $a$ je $70°$. Koliki je njemu saglasan ugao kod prave $b$?',
      ['$70°$', '$110°$', '$20°$', '$140°$'],
      [K('Translacijom za vektor $\\vec{PQ}$ prava $a$ prelazi u $b$, a $c$ ostaje na sebi.'),
       K('Ugao „klizi“ duž transverzale i poklopi se sa saglasnim uglom – saglasni uglovi su jednaki: $70°$.', ['s'])],
      G(t, [{ d: 'a1a2', b: 0 }, { d: 'b1b2', b: 0 }, { d: 'CD', b: 1 }, { u: 'APC', o: '70°', b: 3, r: 26 }, { u: 'APC', b: 2, r: 26, pomeri: v.pom, k: 2, id: 's' }, { tx: 'a', at: [5.3, 2] }, { tx: 'b', at: [5.3, -1] }, { tx: 'c', at: [v.C[0] + 0.3, v.C[1]] }], { bezImena: ['P', 'Q', 'A', 'B', 'C', 'D', 'a1', 'a2', 'b1', 'b2'], velicina: 220 }));
  }
  {
    const v = ugaoTransverzale(55);
    const t = { P: v.P, Q: v.Q, C: v.C, D: v.D, A: [4, 2], B: [v.Q[0] + 3, -1], a1: [-3, 2], a2: [5, 2], b1: [-3, -1], b2: [5, -1] };
    Z(1, 'Na slici je $a ∥ b$. Ugao kod $P$ je $55°$. Koliki je naizmenični ugao kod $Q$?',
      ['$55°$', '$125°$', '$35°$', '$110°$'],
      [K('Naizmenični uglovi su između paralelnih pravih, sa raznih strana transverzale.'),
       K('Ugao kod $P$ je unakrsni sa uglom iznad prave $a$ (desno od $c$), a taj je saglasan sa uglom kod $Q$.', ['s']),
       K('Svi su jednaki: naizmenični ugao je $55°$.', ['n'])],
      G(t, [{ d: 'a1a2', b: 0 }, { d: 'b1b2', b: 0 }, { d: 'CD', b: 1 }, { u: 'a1PQ', o: '55°', b: 3, r: 26 }, { u: 'APC', b: 5, r: 26, k: 2, id: 's' }, { u: 'BQP', b: 2, r: 26, id: 'n', k: 3, o: '?' }, { tx: 'a', at: [5.3, 2] }, { tx: 'b', at: [5.3, -1] }], { bezImena: ['A', 'B', 'C', 'D', 'a1', 'a2', 'b1', 'b2'], velicina: 220 }));
  }
  {
    const v = ugaoTransverzale(70);
    const t = { P: v.P, Q: v.Q, C: v.C, D: v.D, A: [4, 2], B: [v.Q[0] + 3, -1], a1: [-3, 2], a2: [5, 2], b1: [-3, -1], b2: [5, -1] };
    Z(2, 'Prave $a ∥ b$ seče transverzala. Jedan od suprotnih uglova (sa iste strane transverzale, između pravih) je $70°$. Koliki je drugi?',
      ['$110°$', '$70°$', '$20°$', '$290°$'],
      [K('Drugi ugao je uporedan uglu koji je saglasan sa prvim.'),
       K('Zato je zbir suprotnih uglova $180°$: $180° − 70° = 110°$.', ['x'])],
      G(t, [{ d: 'a1a2', b: 0 }, { d: 'b1b2', b: 0 }, { d: 'CD', b: 1 }, { u: 'DPA', o: '110°', b: 3, r: 26, k: 2, id: 'x' }, { u: 'APD', b: 3, r: 26, kraj: 2, o: '?' }, { u: 'BQP', o: '70°', b: 2, r: 26 }], { bezImena: ['P', 'Q', 'A', 'B', 'C', 'D', 'a1', 'a2', 'b1', 'b2'], velicina: 220 }));
  }

  Z(2, 'Paralelne prave $a$ i $b$ seče transverzala; jedan od $8$ uglova je $50°$. Koliko od tih $8$ uglova ima $50°$?',
    ['$4$', '$2$', '$1$', '$8$'],
    [K('Kod svake presečne tačke: dva ugla od $50°$ (unakrsni) i dva od $130°$.'),
     K('Translacijom duž transverzale ista slika je i kod druge tačke: ukupno $4$ ugla od $50°$.')]);

  Z(2, 'Ako su saglasni uglovi $3x$ i $2x + 20°$, a prave paralelne, koliki je ugao?',
    ['$60°$', '$20°$', '$40°$', '$100°$'],
    [K('Saglasni uglovi kod paralelnih pravih su jednaki: $3x = 2x + 20°$.'),
     K('$x = 20°$, pa je ugao $3 · 20° = 60°$.')]);

  Z(1, 'Pri translaciji ugao od $37°$ prelazi u ugao od:',
    ['$37°$', '$74°$', '$143°$', 'zavisi od vektora'],
    [K('Translacija pomera sve tačke za isti vektor – kraci ostaju paralelni sami sebi.'),
     K('Mera ugla se ne menja: $37°$.', ['t'])],
    G({ O: [0, 0], A: [3, 0], B: naKrugu([0, 0], 3, 37) }, [{ d: 'OA' }, { d: 'OB' }, { u: 'AOB', o: '37°', b: 0 }, { d: 'OA', b: 1, pomeri: [4, 2], k: 1 }, { d: 'OB', b: 1, pomeri: [4, 2], k: 1 }, { u: 'AOB', b: 1, pomeri: [4, 2], k: 1, id: 't' }], { bezImena: ['A', 'B'], velicina: 200 }));

  Z(2, 'Prave $a$ i $b$ seče prava $c$, i naizmenični uglovi su jednaki. Šta važi za $a$ i $b$?',
    ['paralelne su', 'normalne su', 'seku se', 'ne može se zaključiti'],
    [K('Kad bi se $a$ i $b$ sekle, sa transverzalom bi gradile trougao, a tada naizmenični uglovi ne bi mogli biti jednaki.'),
     K('Jednaki naizmenični (ili saglasni) uglovi znače da su prave paralelne.')]);

  Z(3, 'Prave $a ∥ b$. Tačka $M$ je između njih; ugao između $a$ i $MA$ je $30°$, a između $b$ i $MB$ je $40°$ (vidi sliku). Koliki je $∠AMB$?',
    ['$70°$', '$10°$', '$110°$', '$140°$'],
    [K('Kroz $M$ povučemo pravu paralelnu sa $a$ i $b$.', ['p']),
     K('Ona deli $∠AMB$ na dva dela: naizmenični sa $30°$ i naizmenični sa $40°$.'),
     K('$∠AMB = 30° + 40° = 70°$.')],
    (() => {
      const M = [0, 0];
      const ug = (d) => (d * Math.PI) / 180;
      const Ap = [r(-2.5 / Math.tan(ug(30))), 2.5], Bp = [r(-2.5 / Math.tan(ug(40))), -2.5];
      return G({ M, A: Ap, B: Bp, X: [3, 2.5], Y: [3, -2.5], m1: [-5, 0], m2: [3, 0], a1: [-6, 2.5], b1: [-6, -2.5] },
        [{ d: 'a1X', b: 0 }, { d: 'b1Y', b: 0 }, { d: 'MA', b: 1 }, { d: 'MB', b: 1 }, { u: 'XAM', o: '30°', b: 3, r: 30 }, { u: 'YBM', o: '40°', b: 3, r: 30 }, { d: 'm1m2', b: 2, isp: 1, k: 1, id: 'p' }, { u: 'AMm1', b: 3, k: 2, r: 26 }, { u: 'm1MB', b: 5, k: 2, r: 34 }, { tx: 'a', at: [3.3, 2.5] }, { tx: 'b', at: [3.3, -2.5] }],
        { bezImena: ['X', 'Y', 'm1', 'm2', 'a1', 'b1'], velicina: 220 });
    })());

  Z(3, 'Suprotni uglovi na transverzali paralelnih pravih odnose se kao $2 : 3$. Koliki je veći?',
    ['$108°$', '$72°$', '$120°$', '$90°$'],
    [K('Suprotni uglovi imaju zbir $180°$; to je $2 + 3 = 5$ delova.'),
     K('Jedan deo: $36°$. Veći: $3 · 36° = 108°$.')]);

  // ════════════════ dopune ════════════════
  L('Prenošenje i nadovezivanje uglova');
  Z(1, 'Dva jednaka ugla nadovezana jedan na drugi čine prav ugao. Koliki je svaki?',
    ['$45°$', '$90°$', '$180°$', '$30°$'],
    [K('Prav ugao ima $90°$.'),
     K('$90° : 2 = 45°$.', ['u'])],
    G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 45), C: [0, 4] }, [{ d: 'OA' }, { d: 'OC' }, { pu: 'AOC' }, { d: 'OB', k: 1, crtaj: 1 }, { u: 'AOB', b: 0, k: 2, id: 'u', r: 40 }, { u: 'BOC', b: 1, k: 2, id: 'u', r: 46 }], { bezImena: ['A', 'B', 'C'], velicina: 180 }));

  L('Uglovi na transverzali');
  Z(1, 'Dve paralelne prave seče transverzala koja nije normalna na njih. Koliko različitih mera ima među $8$ nastalih uglova?',
    ['$2$', '$8$', '$4$', '$1$'],
    [K('Kod svake presečne tačke su dva para unakrsnih uglova: oštar i tup (uporedni).'),
     K('Translacijom duž transverzale isti uglovi su i kod druge tačke – samo dve različite mere (zbir im je $180°$).')]);
};
