// Tema 3: Ravnoteža tela – slaganje sila, moment sile i poluga, sila potiska, plivanje i tonjenje ($g = 10 m/s^{2}$)
module.exports = ({ L, Z, K, G, S, proveri, b, r, F, telo, tlo, T, mera }) => {
  const g = 10;
  // paralelogram (pravougaonik) sila iz tačke (0, 0): F1 vodoravno, F2 pod uglom; rezultanta se iscrtava u koraku k
  const zbir = (F1, F2, ug, { o1, o2, oR, k = 2, s = 0.6 } = {}) => {
    const u = (ug * Math.PI) / 180;
    const a = [F1 * s, 0], c = [F2 * s * Math.cos(u), F2 * s * Math.sin(u)], R = [a[0] + c[0], a[1] + c[1]];
    return [
      T('●', 0, 0, { b: 4 }),
      F(0, 0, a[0], a[1], { o: o1, b: 0 }), F(0, 0, c[0], c[1], { o: o2, b: 2, oAt: [r(c[0] - 0.7), r(c[1] + 0.3)] }),
      { lin: [a, R].map((p) => p.map(r)), b: 4, debljina: 1.5, isp: 1, k: k - 1 > 0 ? k - 1 : undefined, id: 'pg' },
      { lin: [c, R].map((p) => p.map(r)), b: 4, debljina: 1.5, isp: 1, k: k - 1 > 0 ? k - 1 : undefined, id: 'pg' },
      F(0, 0, R[0], R[1], { o: oR, b: 3, k, id: 'R', deb: 4.5, crtaj: 1, oAt: [r(R[0] + 0.5), r(R[1] + 0.4)] }),
    ];
  };

  // ════════════════ 10. Slaganje i razlaganje sila ════════════════
  L('Slaganje i razlaganje sila');
  Z(1, 'Dva dečaka guraju ormar u istom smeru, silama od $30 N$ i $20 N$. Kolika je rezultujuća sila?',
    ['$50 N$', '$10 N$', '$25 N$', '$600 N$'],
    [K('Sile istog pravca i smera se sabiraju.'),
     K('$R = 30 N + 20 N = 50 N$, u istom smeru.', [], S('sile', { sile: [{ F: 30, ugao: 0, o: '30 N' }, { F: 20, ugao: 0, o: '20 N' }], e: '🗄️', rezultanta: 'R = 50 N', kretanje: true }))],
    S('sile', { sile: [{ F: 30, ugao: 0, o: '30 N' }, { F: 20, ugao: 0, o: '20 N' }], e: '🗄️' }));

  Z(1, 'U nadvlačenju konopca jedna ekipa vuče silom $300 N$, a druga silom $200 N$ u suprotnom smeru. Kolika je rezultanta i na koju stranu?',
    ['$100 N$, ka jačoj ekipi', '$500 N$, ka jačoj ekipi', '$100 N$, ka slabijoj ekipi', '$0 N$'],
    [K('Sile istog pravca a suprotnog smera se oduzimaju: $R = 300 N − 200 N = 100 N$.'),
     K('Rezultanta ima smer veće sile – konopac (i obe ekipe) kreće ka jačoj ekipi.', [], S('sile', { sile: [{ F: 300, ugao: 180, o: '300 N' }, { F: 200, ugao: 0, o: '200 N' }], telo: '🪢', rezultanta: 'R = 100 N', kretanje: true }))],
    S('sile', { sile: [{ F: 300, ugao: 180, o: '300 N' }, { F: 200, ugao: 0, o: '200 N' }], telo: '🪢' }));

  proveri(Math.hypot(6, 8), 10);
  Z(2, 'Na telo deluju dve sile, $6 N$ i $8 N$, čiji su pravci normalni (zaklapaju ugao od $90°$). Kolika je rezultanta?',
    ['$10 N$', '$14 N$', '$2 N$', '$48 N$'],
    [K('Rezultanta je dijagonala pravougaonika koji grade sile (pravilo paralelograma).', ['pg']),
     K('Po Pitagorinoj teoremi: $R = √{6^{2} + 8^{2}} = √{36 + 64} = √{100} = 10 N$.', ['R'])],
    G(zbir(8, 6, 90, { o1: '8 N', o2: '6 N', oR: 'R = ?' }), { velicina: 220 }));

  Z(1, 'Na telo deluju tri sile duž iste prave: $10 N$ i $15 N$ udesno, a $40 N$ ulevo. Kolika je rezultanta?',
    ['$15 N$ ulevo', '$65 N$ ulevo', '$15 N$ udesno', '$25 N$ udesno'],
    [K('Udesno ukupno: $10 N + 15 N = 25 N$.'),
     K('Ulevo $40 N$ – veća. $R = 40 N − 25 N = 15 N$, ulevo.', [], S('sile', { sile: [{ F: 10, ugao: 0, o: '10 N' }, { F: 15, ugao: 0, o: '15 N' }, { F: 40, ugao: 180, o: '40 N' }], telo: 'm', rezultanta: 'R = 15 N', kretanje: true }))],
    S('sile', { sile: [{ F: 10, ugao: 0, o: '10 N' }, { F: 15, ugao: 0, o: '15 N' }, { F: 40, ugao: 180, o: '40 N' }], telo: 'm' }));

  Z(2, 'Na telo deluju dve sile, $7 N$ i $4 N$. U zavisnosti od ugla između njih, kolika može biti najveća, a kolika najmanja rezultanta?',
    ['$11 N$ i $3 N$', '$11 N$ i $0 N$', '$28 N$ i $3 N$', '$8,1 N$ i $3 N$'],
    [K('Najveća je kad su sile istog smera: $7 N + 4 N = 11 N$.'),
     K('Najmanja je kad su suprotnog smera: $7 N − 4 N = 3 N$.'),
     K('Za sve ostale uglove rezultanta je između $3 N$ i $11 N$ (za $90°$ je $√{65} ≈ 8,1 N$).', [], S('sile', { sile: [{ F: 7, ugao: 0, o: '7 N' }, { F: 4, ugao: 90, o: '4 N' }], rezultanta: 'R' }))]);

  Z(2, 'Telo miruje. Na njega deluju sila $25 N$ udesno, sila $10 N$ ulevo i još jedna sila duž iste prave. Kolika je i kog smera treća sila?',
    ['$15 N$ ulevo', '$15 N$ udesno', '$35 N$ ulevo', '$35 N$ udesno'],
    [K('Telo miruje ⇒ rezultanta svih sila je nula (ravnoteža).'),
     K('Prve dve daju $25 N − 10 N = 15 N$ udesno.'),
     K('Treća mora da je poništi: $15 N$ ulevo.', [], S('sile', { sile: [{ F: 25, ugao: 0, o: '25 N' }, { F: 10, ugao: 180, o: '10 N' }, { F: 15, ugao: 180, o: '15 N' }], telo: 'm', rezultanta: 'R = 0' }))],
    S('sile', { sile: [{ F: 25, ugao: 0, o: '25 N' }, { F: 10, ugao: 180, o: '10 N' }], telo: 'm' }));

  proveri(Math.sqrt(50 * 50 - 30 * 30), 40);
  Z(3, 'Silu od $50 N$ razložimo na dve međusobno normalne komponente. Jedna komponenta je $30 N$. Kolika je druga?',
    ['$40 N$', '$20 N$', '$80 N$', '$58 N$'],
    [K('Komponente su stranice pravougaonika, a data sila je njegova dijagonala.', ['pg']),
     K('$50^{2} = 30^{2} + F_{2}^{2}$ ⇒ $F_{2}^{2} = 2 500 − 900 = 1 600$ ⇒ $F_{2} = 40 N$.', ['R'])],
    G([T('●', 0, 0, { b: 4 }), F(0, 0, 10, 7.5, { o: '50 N', b: 3, deb: 4.5, oAt: [10.3, 8.4] }), F(0, 0, 10, 0, { o: '?', b: 0, k: 2, id: 'R', oAt: [5, -0.6] }), F(0, 0, 0, 7.5, { o: '30 N', b: 2, k: 1, id: 'pg', oAt: [-1.1, 3.8] }), { lin: [[10, 0], [10, 7.5]], b: 4, isp: 1, debljina: 1.5, k: 1, id: 'pg' }, { lin: [[0, 7.5], [10, 7.5]], b: 4, isp: 1, debljina: 1.5, k: 1, id: 'pg' }], { velicina: 220 }));

  Z(3, 'Dve sile od po $10 N$ deluju na telo i zaklapaju ugao od $120°$. Kolika je njihova rezultanta?',
    ['$10 N$', '$20 N$', '$0 N$', '$14,1 N$'],
    [K('Paralelogram dve jednake sile je romb, a dijagonala deli ugao od $120°$ na dva ugla od $60°$.', ['pg']),
     K('Dijagonala sa dve stranice romba gradi jednakostranične trouglove – pa je jednaka stranici: $R = 10 N$.', ['R'])],
    G(zbir(10, 10, 120, { o1: '10 N', o2: '10 N', oR: 'R = ?', s: 0.6 }), { velicina: 220 }));

  Z(1, 'Lampa težine $20 N$ visi na kablu sa plafona i miruje. Kolikom silom kabl drži lampu?',
    ['$20 N$', '$0 N$', '$10 N$', '$40 N$'],
    [K('Lampa miruje – sile su u ravnoteži: sila kabla naviše jednaka je težini naniže.', ['n']),
     K('Sila zatezanja kabla: $T = 20 N$.')],
    null,
    { crtez: G([{ lin: [[-2, 4], [2, 4]], b: 4, debljina: 4 }, { lin: [[0, 4], [0, 1]], b: 5, debljina: 2 }, T('💡', 0, 0.4, { vel: 40 }), F(0.7, 0.3, 0, -2, { o: 'Q = 20 N', b: 1 }), F(0.7, 1.2, 0, 2, { o: 'T = 20 N', b: 2, k: 1, id: 'n' })], { velicina: 180 }) });

  proveri((30 * g) / 2, 150);
  Z(2, 'Dete mase $30 kg$ sedi na ljuljašci koja visi o dva uspravna lanca. Kolika sila zateže svaki lanac? ($g = 10 m/s^{2}$)',
    ['$150 N$', '$300 N$', '$30 N$', '$15 N$'],
    [K('Težina deteta: $Q = 30 kg · 10 m/s^{2} = 300 N$.'),
     K('Dva lanca zajedno drže $300 N$; ako je dete na sredini, svaki drži pola: $150 N$.', ['l'])],
    null,
    { crtez: G([{ lin: [[-3, 5], [3, 5]], b: 4, debljina: 4 }, { lin: [[-1.5, 5], [-1.5, 0.6]], b: 5, debljina: 2 }, { lin: [[1.5, 5], [1.5, 0.6]], b: 5, debljina: 2 }, { lin: [[-1.8, 0.6], [1.8, 0.6]], b: 5, debljina: 5 }, T('🧒', 0, 1.4, { vel: 40 }), F(0, 0.4, 0, -2.4, { o: '300 N', b: 1 }), F(-1.5, 2.4, 0, 1.6, { o: '150 N', b: 2, k: 2, id: 'l', oAt: [-2.6, 3.6] }), F(1.5, 2.4, 0, 1.6, { o: '150 N', b: 2, k: 2, id: 'l', oAt: [2.6, 3.6] })], { velicina: 200 }) });

  // ════════════════ 11. Moment sile i poluga ════════════════
  L('Moment sile i poluga');
  Z(1, 'Ana gura vrata silom $10 N$ normalno na njih, na rastojanju $0,8 m$ od šarki. Koliki je moment sile?',
    ['$8 Nm$', '$12,5 Nm$', '$80 Nm$', '$10,8 Nm$'],
    [K('Moment sile = sila × krak: $M = F · d$.'),
     K('$M = 10 N · 0,8 m = 8 Nm$ (njutn-metar).')],
    G([T('●', 0, 0, { b: 3 }), T('~šarke', 0, -0.6, { vel: 12 }), { lin: [[0, 0], [4, 0]], b: 0, debljina: 8 }, F(3.2, -1.6, 0, 1.6, { o: '10 N', b: 1 }), mera(0, 0.6, 3.2, 0.6, '0,8 m', { k: 1 }), { l: 'O', r: 1.4, od: 0, do: 50, str: 1, b: 2, k: 2 }], { velicina: 240 }));

  proveri((30 * 2) / 40, 1.5);
  Z(1, 'Na klackalici sedi dete mase $30 kg$, na $2 m$ od oslonca. Na kom rastojanju sa druge strane treba da sedne dete mase $40 kg$ da bi klackalica bila u ravnoteži?',
    ['$1,5 m$', '$2,7 m$', '$2 m$', '$1 m$'],
    [K('Uslov ravnoteže poluge: momenti sa obe strane su jednaki: $m_{1} · d_{1} = m_{2} · d_{2}$ (težine su srazmerne masama).'),
     K('$30 kg · 2 m = 40 kg · d_{2}$ ⇒ $d_{2} = {60|40} m = 1,5 m$. Teže dete sedi bliže osloncu.', [], S('poluga', { levo: [{ m: 30, d: 2, e: '🧒' }], desno: [{ m: 40, d: 1.5, e: '👧' }], duzina: 2.4 }))],
    S('poluga', { levo: [{ m: 30, d: 2, e: '🧒' }], desno: [{ m: 40, d: 2.2, e: '👧', do: '?' }], ravnoteza: true, duzina: 2.4 }));

  proveri((600 * 0.2) / 1.2, 100);
  Z(2, 'Šipkom kao polugom podižemo kamen težine $600 N$. Kamen je na $0,2 m$ od oslonca, a mi pritiskamo drugi kraj na $1,2 m$ od oslonca. Kolikom najmanjom silom treba pritiskati?',
    ['$100 N$', '$3 600 N$', '$120 N$', '$500 N$'],
    [K('Ravnoteža poluge: $F · 1,2 m = 600 N · 0,2 m$.'),
     K('$F = {120 Nm|1,2 m} = 100 N$ – šest puta manje od težine kamena, jer je krak šest puta duži.', [], S('poluga', { levo: [{ F: '600 N', d: 0.2 }], desno: [{ F: '100 N', d: 1.2 }], duzina: 1.3 }))],
    S('poluga', { levo: [{ m: 60, d: 0.2, e: '🪨', o: '600 N' }], desno: [{ F: '?', d: 1.2 }], ravnoteza: true, duzina: 1.3 }));

  proveri(30 / 0.6, 50);
  Z(2, 'Da bi se odvrnuo zarđao zavrtanj, potreban je moment sile $30 Nm$. Kolika sila je potrebna ako koristimo ključ dužine $60 cm$?',
    ['$50 N$', '$18 N$', '$0,5 N$', '$1 800 N$'],
    [K('Krak u metrima: $60 cm = 0,6 m$.'),
     K('$F = {M|d} = {30 Nm|0,6 m} = 50 N$. Sa kraćim ključem ($25 cm$) trebalo bi čak $120 N$.')],
    G([T('🔩', 0, 0, { vel: 30 }), { lin: [[0, 0], [6, 0]], b: 4, debljina: 9 }, F(5.6, 2, 0, -1.8, { o: 'F = ?', b: 1 }), mera(0, -0.8, 5.6, -0.8, '60 cm'), { l: 'O', r: 1.5, od: 0, do: -60, str: 1, b: 2 }], { velicina: 240 }));

  proveri((80 * 1) / 20, 4);
  Z(2, 'Tata mase $80 kg$ sedi na klackalici na $1 m$ od oslonca. Na kom rastojanju sa druge strane treba da sedne dete mase $20 kg$ da bi klackalica bila u ravnoteži?',
    ['$4 m$', '$0,25 m$', '$1 m$', '$2 m$'],
    [K('$80 kg · 1 m = 20 kg · d$.'),
     K('$d = 4 m$ – dete četiri puta lakše mora da sedi četiri puta dalje.', [], S('poluga', { levo: [{ m: 80, d: 1, e: '🧔' }], desno: [{ m: 20, d: 4, e: '🧒' }], duzina: 4.4 }))],
    S('poluga', { levo: [{ m: 80, d: 1, e: '🧔' }], desno: [{ m: 20, d: 2.5, e: '🧒', do: '?' }], ravnoteza: true, duzina: 4.4 }));

  proveri((800 * 0.4) / 1.6, 200);
  Z(2, 'U građevinskim kolicima je teret težine $800 N$, na $0,4 m$ od ose točka. Ručke su na $1,6 m$ od ose točka. Kolikom silom treba podizati ručke?',
    ['$200 N$', '$3 200 N$', '$320 N$', '$500 N$'],
    [K('Oslonac je osa točka, a teret i sila su sa iste strane (poluga druge vrste).'),
     K('$F · 1,6 m = 800 N · 0,4 m$ ⇒ $F = {320|1,6} N = 200 N$.', ['F'])],
    G([T('●', 0, 0, { b: 3 }), T('🛞', 0, 0, { vel: 30 }), { lin: [[0, 0.6], [6.4, 1.6]], b: 4, debljina: 6 }, T('🧱', 1.6, 1.5, { vel: 28 }), F(1.6, 1, 0, -2, { o: '800 N', b: 1, oAt: [2.6, -0.7] }), F(6.4, 1.6, 0, 2, { o: 'F = ?', b: 2, k: 2, id: 'F' }), mera(0, -1.6, 1.6, -1.6, '0,4 m'), mera(0, -2.8, 6.4, -2.8, '1,6 m')], { velicina: 260 }));

  proveri((3 * 40 + 2 * 10) / 50, 2.8);
  Z(3, 'Leva strana poluge: teg $3 kg$ na $40 cm$ i teg $2 kg$ na $10 cm$ od oslonca. Koliki teg treba okačiti desno, na $50 cm$ od oslonca, da bi poluga bila u ravnoteži?',
    ['$2,8 kg$', '$5 kg$', '$3 kg$', '$2,2 kg$'],
    [K('Zbir momenata levo: $3 kg · 40 cm + 2 kg · 10 cm = 120 + 20 = 140$ (kg·cm).'),
     K('Desno: $m · 50 cm = 140$ ⇒ $m = 2,8 kg$.', [], S('poluga', { levo: [{ m: 3, d: 0.4, o: '3 kg' }, { m: 2, d: 0.1, o: '2 kg' }], desno: [{ m: 2.8, d: 0.5, o: '2,8 kg' }], duzina: 0.55 }))],
    S('poluga', { levo: [{ m: 3, d: 0.4, o: '3 kg', do: '40 cm' }, { m: 2, d: 0.1, o: '2 kg', do: '10 cm' }], desno: [{ m: 2, d: 0.5, o: '?', do: '50 cm' }], ravnoteza: true, duzina: 0.55 }));

  proveri(40 / (120 + 40), 0.25);
  Z(3, 'Na krajevima lake šipke dužine $1 m$ vise tereti od $120 N$ i $40 N$. Na kom rastojanju od težeg tereta treba postaviti oslonac da bi šipka bila u ravnoteži?',
    ['$25 cm$', '$75 cm$', '$33 cm$', '$50 cm$'],
    [K('Neka je oslonac na $x$ od težeg tereta; do lakšeg je onda $1 m − x$.'),
     K('$120 · x = 40 · (1 − x)$ ⇒ $160x = 40$ ⇒ $x = 0,25 m = 25 cm$.', [], S('poluga', { levo: [{ F: '120 N', d: 0.25 }], desno: [{ F: '40 N', d: 0.75 }], duzina: 0.8 })),
     K('Provera: $120 · 0,25 = 30$ i $40 · 0,75 = 30$ ✓.')],
    G([{ lin: [[0, 0], [10, 0]], b: 4, debljina: 6 }, F(0, 0, 0, -2.4, { o: '120 N', b: 1 }), F(10, 0, 0, -0.8, { o: '40 N', b: 1 }), mera(0, 0.7, 10, 0.7, '1 m'), T('▲ ?', 5, -0.9, { b: 3 })], { velicina: 260 }));

  proveri(8 / 0.2, 40);
  Z(2, 'Da bi se otvorila vrata, potreban je moment sile $8 Nm$. Kolika je potrebna sila ako guramo vrata na samo $20 cm$ od šarki?',
    ['$40 N$', '$1,6 N$', '$160 N$', '$8 N$'],
    [K('$F = {M|d} = {8 Nm|0,2 m} = 40 N$.'),
     K('Zato je kvaka daleko od šarki: na $80 cm$ bilo bi dovoljno samo $10 N$.')],
    G([T('●', 0, 0, { b: 3 }), T('~šarke', 0, -0.6, { vel: 12 }), { lin: [[0, 0], [4, 0]], b: 0, debljina: 8 }, F(0.8, -1.6, 0, 1.6, { o: 'F = ?', b: 1 }), F(3.2, -1.6, 0, 1.6, { o: '10 N', b: 2, k: 2 }), mera(0, 0.6, 0.8, 0.6, '20 cm')], { velicina: 240 }));

  proveri(12 / 40, 0.3);
  Z(2, 'Moment sile je $12 Nm$, a sila je $40 N$ i deluje normalno na krak. Koliki je krak sile?',
    ['$30 cm$', '$3 m$', '$480 cm$', '$3,3 cm$'],
    [K('$d = {M|F} = {12 Nm|40 N} = 0,3 m$.'),
     K('$0,3 m = 30 cm$.')]);

  // ════════════════ 12. Sila potiska. Arhimedov zakon ════════════════
  L('Sila potiska. Arhimedov zakon');
  proveri(1000 * g * 0.002, 20);
  Z(1, 'Telo zapremine $2 dm^{3}$ potpuno je potopljeno u vodu ($ρ = 1 000 kg/m^{3}$). Kolika je sila potiska? ($g = 10 m/s^{2}$)',
    ['$20 N$', '$2 N$', '$200 N$', '$20 000 N$'],
    [K('Arhimedov zakon: potisak je jednak težini istisnute tečnosti: $F_{p} = ρ · g · V$.'),
     K('$V = 2 dm^{3} = 0,002 m^{3}$ (ili: $2 dm^{3}$ vode = $2 l$ = $2 kg$).'),
     K('$F_{p} = 1 000 kg/m^{3} · 10 m/s^{2} · 0,002 m^{3} = 20 N$.')],
    S('tecnost', { tip: 'plivanje', tela: [{ ro: 2500, o: '2 dm³', b: 4 }], sile: true }));

  Z(1, 'Dinamometar pokazuje $12 N$ kada telo visi u vazduhu, a $8 N$ kada je telo potpuno potopljeno u vodu. Kolika je sila potiska?',
    ['$4 N$', '$20 N$', '$8 N$', '$1,5 N$'],
    [K('U vodi potisak „pomaže“ dinamometru da drži telo, pa on pokazuje manje.'),
     K('$F_{p} = 12 N − 8 N = 4 N$.')],
    S('tecnost', { tip: 'dinamometar', F1: 12, F2: 8 }));

  proveri(4 / (1000 * g), 0.0004);
  Z(2, 'Telo u vazduhu „teži“ $12 N$, a potopljeno u vodu $8 N$. Kolika je zapremina tela? ($ρ_{vode} = 1 000 kg/m^{3}$, $g = 10 m/s^{2}$)',
    ['$400 cm^{3}$', '$4 dm^{3}$', '$800 cm^{3}$', '$40 cm^{3}$'],
    [K('Potisak: $F_{p} = 12 N − 8 N = 4 N$.'),
     K('$V = {F_{p}|ρ g} = {4 N|1 000 · 10} m^{3} = 0,0004 m^{3}$.'),
     K('$0,0004 m^{3} = 0,4 dm^{3} = 400 cm^{3}$ (telo istisne $0,4 l$ vode, a ona teži $4 N$).')],
    S('tecnost', { tip: 'dinamometar', F1: 12, F2: 8 }));

  proveri(1.2 / 0.0004, 3000);
  Z(3, 'Telo mase $1,2 kg$ potopljeno u vodu istisne $0,4 l$ vode. Kolika je gustina tela? Od čega bi moglo biti napravljeno?',
    ['$3 000 kg/m^{3}$ – kamen', '$300 kg/m^{3}$ – pluta', '$480 kg/m^{3}$ – drvo', '$7 800 kg/m^{3}$ – gvožđe'],
    [K('Zapremina tela je jednaka zapremini istisnute vode: $V = 0,4 l = 0,0004 m^{3}$.'),
     K('$ρ = {m|V} = {1,2 kg|0,0004 m^{3}} = 3 000 kg/m^{3}$ – tri puta gušće od vode, kao kamen (granit i mermer imaju oko $2 700 kg/m^{3}$).')],
    S('tecnost', { tip: 'dinamometar', F1: 12, F2: 8 }));

  proveri(800 * g * 0.0005, 4);
  Z(2, 'Kamen zapremine $0,5 dm^{3}$ potopljen je u ulje gustine $800 kg/m^{3}$. Kolika je sila potiska? ($g = 10 m/s^{2}$)',
    ['$4 N$', '$5 N$', '$400 N$', '$0,4 N$'],
    [K('$V = 0,5 dm^{3} = 0,0005 m^{3}$.'),
     K('$F_{p} = ρ g V = 800 · 10 · 0,0005 N = 4 N$ – u vodi bi bilo $5 N$, ulje je ređe.', [], S('tecnost', { tip: 'dinamometar', F1: 13, F2: 9, tecnost: '~ulje' }))],
    S('tecnost', { tip: 'plivanje', tela: [{ ro: 2600, e: '🪨', b: 4 }], ro: 800, tecnost: '~ulje', boja: 3 }));

  proveri(7.8 * g - 1000 * g * (7.8 / 7800), 68);
  Z(2, 'Gvozdena kugla mase $7,8 kg$ (gustina gvožđa $7 800 kg/m^{3}$) leži na dnu bazena. Kolikom silom treba da je držimo da bi lebdela u vodi? ($g = 10 m/s^{2}$)',
    ['$68 N$', '$78 N$', '$10 N$', '$88 N$'],
    [K('Zapremina kugle: $V = {7,8 kg|7 800 kg/m^{3}} = 0,001 m^{3} = 1 dm^{3}$.'),
     K('Potisak: $F_{p} = 1 000 · 10 · 0,001 N = 10 N$; težina: $Q = 78 N$.'),
     K('Potrebna sila: $78 N − 10 N = 68 N$ – u vodi je kugla „lakša“ za $10 N$.')],
    S('tecnost', { tip: 'plivanje', tela: [{ ro: 7800, o: '~gvožđe', b: 5 }], sile: true }));

  proveri(1.3 * g * 0.01, 0.13);
  Z(3, 'Balon napunjen helijumom ima zapreminu $10 l$. Kolika sila potiska deluje na njega u vazduhu gustine $1,3 kg/m^{3}$? ($g = 10 m/s^{2}$)',
    ['$0,13 N$', '$13 N$', '$100 N$', '$1,3 N$'],
    [K('Arhimedov zakon važi i za gasove: $F_{p} = ρ_{vazduha} · g · V$.'),
     K('$V = 10 l = 0,01 m^{3}$: $F_{p} = 1,3 · 10 · 0,01 N = 0,13 N$.'),
     K('Helijum u balonu teži samo oko $0,02 N$, pa balon (ako je lagan) leti uvis.')],
    G([T('🎈', 0, 0, { vel: 60 }), { lin: [[0, -0.9], [0.2, -2.6]], b: 5, debljina: 1.5 }, F(0.9, 0, 0, 2.4, { o: 'Fp = ?', b: 2 }), F(-0.9, 0, 0, -0.6, { o: 'Q', b: 1, oAt: [-1.6, -0.6] })], { velicina: 160 }));

  proveri(((10 - 7) / (10 - 6)) * 1000, 750);
  Z(3, 'Telo visi na dinamometru: u vazduhu $10 N$, u vodi $6 N$, a u nepoznatoj tečnosti $7 N$. Kolika je gustina nepoznate tečnosti?',
    ['$750 kg/m^{3}$', '$1 333 kg/m^{3}$', '$700 kg/m^{3}$', '$857 kg/m^{3}$'],
    [K('Potisak u vodi: $10 − 6 = 4 N$; u tečnosti: $10 − 7 = 3 N$.'),
     K('Zapremina tela je ista, pa je potisak srazmeran gustini: ${ρ|1 000} = {3|4}$.'),
     K('$ρ = 750 kg/m^{3}$ (otprilike kao benzin).')],
    S('tecnost', { tip: 'dinamometar', F1: 10, F2: 7, tecnost: '~tečnost ?' }));

  Z(1, 'Isto jaje potopimo jednom u običnu, a jednom u slanu vodu (gušću). Gde je sila potiska na potopljeno jaje veća?',
    ['U slanoj vodi', 'U običnoj vodi', 'Isto je u obe', 'Potisak ne zavisi od tečnosti'],
    [K('$F_{p} = ρ g V$: zapremina jajeta je ista, a slana voda ima veću gustinu.'),
     K('Zato je potisak veći u slanoj vodi – jaje u dovoljno slanoj vodi čak ispliva.', [], S('tecnost', { tip: 'plivanje', tela: [{ ro: 1080, e: '🥚', b: 3 }], ro: 1100, tecnost: '~slana voda', sile: true }))]);

  proveri(1000 * g * 0.002, 20);
  Z(2, 'Lopta zapremine $4 dm^{3}$ pluta tako da je tačno polovina pod vodom. Kolika je sila potiska? ($g = 10 m/s^{2}$)',
    ['$20 N$', '$40 N$', '$10 N$', '$4 N$'],
    [K('Potisak zavisi samo od potopljenog dela: $V_{pot} = 2 dm^{3} = 0,002 m^{3}$.'),
     K('$F_{p} = 1 000 · 10 · 0,002 N = 20 N$. Lopta pluta, pa i ona teži tačno $20 N$.')],
    S('tecnost', { tip: 'plivanje', tela: [{ ro: 500, e: '⚽', b: 3 }], sile: true }));

  // ════════════════ 13. Plivanje i tonjenje tela ════════════════
  L('Plivanje i tonjenje tela');
  Z(1, 'Telo težine $15 N$ potpuno potopimo u vodu i pustimo. Najveća sila potiska (kad je potpuno pod vodom) je $20 N$. Šta će se desiti?',
    ['Isplivaće i plivaće delimično potopljeno', 'Potonuće', 'Lebdeće u vodi', 'Ostaće gde smo ga pustili, pa potonuti'],
    [K('Potisak ($20 N$) je veći od težine ($15 N$) – rezultanta ($5 N$) je naviše i telo izranja.'),
     K('Na površini se potopljeni deo smanjuje dok potisak ne postane $15 N$ – tada telo pliva ($3/4$ zapremine pod vodom).', [], S('tecnost', { tip: 'plivanje', tela: [{ ro: 750, o: '15 N', b: 2 }], sile: true }))]);

  proveri(600 / 1000, 0.6);
  Z(2, 'Drvena kocka gustine $600 kg/m^{3}$ pliva u vodi. Koji deo njene zapremine je pod vodom?',
    ['$60 %$', '$40 %$', '$100 %$', '$6 %$'],
    [K('Telo koje pliva: težina = potisak, tj. $ρ_{t} · V · g = ρ_{v} · V_{pot} · g$.'),
     K('${V_{pot}|V} = {ρ_{t}|ρ_{v}} = {600|1 000} = 0,6 = 60 %$.', [], S('tecnost', { tip: 'plivanje', tela: [{ ro: 600, o: '~drvo', b: 5 }], sile: true }))]);

  proveri(900 / 1000, 0.9);
  Z(2, 'Gustina leda je $900 kg/m^{3}$. Koliki deo ledenog bloka koji pliva u slatkoj vodi je ispod površine?',
    ['$90 %$', '$10 %$', '$50 %$', '$80 %$'],
    [K('${V_{pot}|V} = {ρ_{led}|ρ_{voda}} = {900|1 000} = 90 %$.'),
     K('Iznad vode viri samo desetina – otuda izraz „vrh ledenog brega“ (u gušćoj, slanoj morskoj vodi viri malo više).', [], S('tecnost', { tip: 'plivanje', tela: [{ ro: 900, e: '🧊', b: 0 }], sile: true }))]);

  proveri((300 * g) / (1000 * g), 0.3);
  Z(2, 'Čamac mase $300 kg$ pluta na jezeru. Kolika je zapremina vode koju istiskuje? ($ρ_{vode} = 1 000 kg/m^{3}$)',
    ['$0,3 m^{3}$', '$3 m^{3}$', '$300 m^{3}$', '$0,03 m^{3}$'],
    [K('Telo koje pliva istisne onoliko vode kolika mu je masa: $300 kg$ vode.'),
     K('$V = {300 kg|1 000 kg/m^{3}} = 0,3 m^{3}$ ($300 l$).')],
    S('tecnost', { tip: 'plivanje', tela: [{ ro: 300, e: '🚣', b: 3 }], sile: true }));

  proveri(1000 * g * 0.8 - 500 * g * 0.8, 4000);
  Z(3, 'Splav od drveta (gustina $500 kg/m^{3}$) ima zapreminu $0,8 m^{3}$. Koliki najveći teret (masu) može da nosi a da ne potone? ($ρ_{vode} = 1 000 kg/m^{3}$)',
    ['$400 kg$', '$800 kg$', '$500 kg$', '$4 000 kg$'],
    [K('Masa splava: $500 · 0,8 = 400 kg$.'),
     K('Kad je ceo pod vodom, istisne $0,8 m^{3}$ vode – $800 kg$. Potisak može da drži ukupno $800 kg$.'),
     K('Za teret ostaje $800 kg − 400 kg = 400 kg$.', [], S('tecnost', { tip: 'plivanje', tela: [{ ro: 500, o: '~splav', b: 5 }, { ro: 1000, o: '+400 kg', b: 1 }], sile: true }))]);

  proveri(10 * 250 / 1000, 2.5);
  Z(2, 'Kocka od plute, ivice $10 cm$ i gustine $250 kg/m^{3}$, pliva u vodi. Koliko duboko je potopljena?',
    ['$2,5 cm$', '$7,5 cm$', '$25 cm$', '$4 cm$'],
    [K('Potopljeni deo: ${ρ_{pluta}|ρ_{voda}} = {250|1 000} = {1|4}$ zapremine.'),
     K('Kocka je uspravna, pa je potopljena četvrtina visine: ${10 cm|4} = 2,5 cm$.', [], S('tecnost', { tip: 'plivanje', tela: [{ ro: 250, o: '~pluta', b: 3 }] }))]);

  Z(1, 'Telo lebdi u vodi (ne tone i ne izranja, ma gde ga postavili). Kolika je njegova gustina?',
    ['$1 000 kg/m^{3}$', '$0 kg/m^{3}$', '$500 kg/m^{3}$', 'Veća od $1 000 kg/m^{3}$'],
    [K('Telo lebdi kad je potisak potpuno potopljenog tela jednak njegovoj težini.'),
     K('To znači da mu je gustina jednaka gustini vode: $1 000 kg/m^{3}$ (kao riba ili podmornica).')],
    S('tecnost', { tip: 'plivanje', tela: [{ ro: 1000, e: '🐟', b: 0 }], sile: true }));

  proveri(0.75 * 1000, 750);
  Z(2, 'Telo pliva u vodi tako da su $3/4$ njegove zapremine pod vodom. Kolika je gustina tela?',
    ['$750 kg/m^{3}$', '$250 kg/m^{3}$', '$1 333 kg/m^{3}$', '$1 000 kg/m^{3}$'],
    [K('Kod plivanja: ${ρ_{t}|ρ_{v}} = {V_{pot}|V} = {3|4}$.'),
     K('$ρ_{t} = {3|4} · 1 000 kg/m^{3} = 750 kg/m^{3}$.')],
    S('tecnost', { tip: 'plivanje', tela: [{ ro: 750, o: '?', b: 2 }] }));

  proveri(1000 * g * 0.005 - 0.5 * g, 45);
  Z(3, 'Lopta za plažu mase $0,5 kg$ i zapremine $5 dm^{3}$. Kolikom silom treba da je držimo da bi bila potpuno pod vodom? ($g = 10 m/s^{2}$)',
    ['$45 N$', '$50 N$', '$5 N$', '$55 N$'],
    [K('Potisak potopljene lopte: $F_{p} = 1 000 · 10 · 0,005 N = 50 N$.'),
     K('Težina: $Q = 0,5 · 10 = 5 N$.'),
     K('Naša sila + težina = potisak: $F = 50 N − 5 N = 45 N$ – kao da držimo teg od $4,5 kg$!')],
    S('tecnost', { tip: 'plivanje', tela: [{ ro: 100, e: '🏐', b: 1 }], sile: true }));

  Z(1, 'Telo gustine $900 kg/m^{3}$ stavimo u ulje ($800 kg/m^{3}$) i u vodu ($1 000 kg/m^{3}$). Šta se dešava?',
    ['U ulju tone, a u vodi pliva', 'U ulju pliva, a u vodi tone', 'U obe tečnosti pliva', 'U obe tečnosti tone'],
    [K('Telo tone ako je gušće od tečnosti, a pliva ako je ređe.'),
     K('$900 > 800$ – u ulju tone.', [], S('tecnost', { tip: 'plivanje', tela: [{ ro: 900, o: '900', b: 3 }], ro: 800, tecnost: '~ulje', boja: 3, sile: true })),
     K('$900 < 1 000$ – u vodi pliva (pod vodom je $90 %$ tela).', [], S('tecnost', { tip: 'plivanje', tela: [{ ro: 900, o: '900', b: 3 }], sile: true }))]);
};
