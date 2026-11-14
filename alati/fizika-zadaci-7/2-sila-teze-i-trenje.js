// Tema 2: Kretanje pod dejstvom sile teže i sile otpora – slobodno padanje, hitac naviše i naniže, trenje ($g = 10 m/s^{2}$)
module.exports = ({ L, Z, K, G, S, proveri, b, r, F, telo, tlo, T, mera, grafik }) => {
  const g = 10;
  // visinski crtež: lenjir od 0 do h (m), telo na vrhu, strelica brzine
  const visina = (h, { k = 1, id = 'h', o, telo: e = '🪨' } = {}) => [
    tlo(-2.5, 2.5, 0), T(e, 0, 5.4, { vel: 30 }), { lin: [[-1.6, 0], [-1.6, 5]], b: 3, debljina: 2, isp: 1 },
    ...[0, 1].map((i) => ({ lin: [[-1.85, i * 5], [-1.35, i * 5]], b: 3, debljina: 2 })), T(o || `h = ${b(h)} m`, -1.6, 2.5, { b: 3, k, id }),
  ];

  // ════════════════ 7. Slobodno padanje ════════════════
  L('Slobodno padanje');
  proveri(g * 3, 30);
  Z(1, 'Kamen slobodno pada $3 s$. Kolika je njegova brzina na kraju pada? ($g = 10 m/s^{2}$)',
    ['$30 m/s$', '$3,3 m/s$', '$45 m/s$', '$15 m/s$'],
    [K('Slobodno padanje je ravnomerno ubrzano kretanje bez početne brzine, sa ubrzanjem $g$: $v = g · t$.'),
     K('$v = 10 m/s^{2} · 3 s = 30 m/s$ – svake sekunde brzina poraste za $10 m/s$.', [], S('pad', { tip: 'slobodan', visina: 45, strob: 1 }))],
    S('pad', { tip: 'slobodan', visina: 45, brzina: false, strob: 1 }));

  proveri((g * 2 * 2) / 2, 20);
  Z(1, 'Dečak pusti kamenčić u bunar i posle $2 s$ ga čuje kako udara u vodu. Kolika je dubina do vode? (Kretanje zvuka zanemari, $g = 10 m/s^{2}$.)',
    ['$20 m$', '$40 m$', '$10 m$', '$5 m$'],
    [K('Put pri slobodnom padu: $h = {g · t^{2}|2}$.'),
     K('$h = {10 m/s^{2} · (2 s)^{2}|2} = {10 · 4|2} m = 20 m$.', [], S('pad', { tip: 'slobodan', visina: 20, strob: 0.5 }))],
    S('pad', { tip: 'vakuum', levo: '~vazduh', desno: '~vakuum', e1: '🪶', e2: '🪨' }));

  proveri(Math.sqrt((2 * 80) / g), 4);
  Z(2, 'Za koje vreme telo slobodno padne sa visine $80 m$? ($g = 10 m/s^{2}$)',
    ['$4 s$', '$8 s$', '$16 s$', '$2,8 s$'],
    [K('Iz $h = {g t^{2}|2}$ sledi $t^{2} = {2h|g}$.'),
     K('$t^{2} = {2 · 80 m|10 m/s^{2}} = 16 s^{2}$, pa je $t = 4 s$. (Zamka: $16$ je $t^{2}$.)'),
     K('Provera po sekundama: $5 + 15 + 25 + 35 = 80 m$.', [], S('pad', { tip: 'slobodan', visina: 80, strob: 1 }))],
    null, { crtez: G(visina(80, { k: 0 }), { velicina: 150 }) });

  proveri(Math.sqrt(2 * g * 45), 30);
  Z(2, 'Kolikom brzinom udari u zemlju telo koje slobodno padne sa visine $45 m$? ($g = 10 m/s^{2}$)',
    ['$30 m/s$', '$900 m/s$', '$450 m/s$', '$15 m/s$'],
    [K('Veza brzine i visine: $v^{2} = 2 · g · h$.'),
     K('$v^{2} = 2 · 10 m/s^{2} · 45 m = 900 m^{2}/s^{2}$ ⇒ $v = 30 m/s$.'),
     K('Isto se dobija preko vremena: $t = 3 s$, $v = g t = 30 m/s$ (oko $108 km/h$!).', [], S('pad', { tip: 'slobodan', visina: 45, strob: 1 }))],
    G(visina(45, { k: 0 }), { velicina: 150 }));

  proveri(45 - 20, 25);
  Z(3, 'Telo slobodno pada sa visine $45 m$. Koliki put pređe u poslednjoj sekundi pada? ($g = 10 m/s^{2}$)',
    ['$25 m$', '$15 m$', '$45 m$', '$20 m$'],
    [K('Vreme pada: $t = √{2h : g} = √{90 : 10} s = 3 s$.'),
     K('Za prve $2 s$ telo padne $h_{2} = {10 · 2^{2}|2} m = 20 m$.'),
     K('U poslednjoj (trećoj) sekundi: $45 m − 20 m = 25 m$. Po sekundama: $5$, $15$, $25$ m.', [], S('pad', { tip: 'slobodan', visina: 45, strob: 1 }))],
    S('pad', { tip: 'slobodan', visina: 45, brzina: false, sat: false, strob: 99 }));

  proveri(1.6 * 5, 8);
  Z(2, 'Na Mesecu je ubrzanje slobodnog pada $1,6 m/s^{2}$. Kolika je brzina kamena koji je na Mesecu slobodno padao $5 s$?',
    ['$8 m/s$', '$50 m/s$', '$1,6 m/s$', '$20 m/s$'],
    [K('$v = g_{M} · t = 1,6 m/s^{2} · 5 s = 8 m/s$.'),
     K('Na Zemlji bi za isto vreme dostigao $50 m/s$ – Mesec privlači oko $6$ puta slabije.')],
    S('klatno', { klatna: [{ l: 1, o: '~Zemlja' }, { l: 1, g: 0.16, o: '~Mesec' }], ugao: 25 }));

  proveri(Math.sqrt((2 * 80) / g) / Math.sqrt((2 * 20) / g), 2);
  Z(2, 'Telo sa visine $20 m$ slobodno pada $2 s$. Za koje vreme bi slobodno palo sa visine $80 m$?',
    ['$4 s$', '$8 s$', '$2 s$', '$16 s$'],
    [K('Visina raste sa kvadratom vremena: $h = {g t^{2}|2}$.'),
     K('Visina je $4$ puta veća, a $4 = 2^{2}$ – vreme je samo $2$ puta duže: $4 s$.')],
    S('pad', { tip: 'slobodan', visina: 80, brzina: false, sat: false, strob: 99 }));

  proveri(((10 + 40) / 2) * ((40 - 10) / g), 75);
  Z(3, 'Za vreme slobodnog pada brzina kamena poraste sa $10 m/s$ na $40 m/s$. Koliki put je kamen prešao za to vreme? ($g = 10 m/s^{2}$)',
    ['$75 m$', '$150 m$', '$90 m$', '$30 m$'],
    [K('Vreme: $t = {40 m/s − 10 m/s|10 m/s^{2}} = 3 s$.'),
     K('Srednja brzina: ${10 + 40|2} m/s = 25 m/s$, pa je $s = 25 m/s · 3 s = 75 m$.', ['pov']),
     K('Provera: $v^{2} − v_{0}^{2} = 2gs$ ⇒ $1 600 − 100 = 20 · 75$ ✓.')],
    null,
    { crtez: (() => { const gg = grafik({ xmax: 5, ymax: 50, yk: 10 }); return G([gg.e, gg.linija([[0, 0], [5, 50]], { b: 4 }), gg.proj(1, 10, { k: 1 }), gg.proj(4, 40, { k: 1 }), gg.povrs([[1, 10], [4, 40]], { k: 2, id: 'pov' }), gg.tekst('75 m', 3, 12, { k: 2, id: 'pov' })], { velicina: 300 }); })() });

  Z(1, 'Uže lifta pukne i lift sa čovekom mase $50 kg$ slobodno pada. Kolikom silom čovek tada pritiska pod lifta (koliko bi pokazala vaga)?',
    ['$0 N$ – bestežinsko stanje', '$500 N$', '$50 N$', '$1 000 N$'],
    [K('I čovek i lift padaju sa istim ubrzanjem $g$ – pod „beži“ ispod čoveka isto koliko čovek pada.'),
     K('Čovek uopšte ne pritiska pod: težina je $0 N$ – to je bestežinsko stanje (kao kod astronauta u orbiti).'),
     K('Sila Zemljine teže ($500 N$) i dalje deluje – ona je ta koja ih ubrzava!')],
    S('orbita', { tip: 'njutn' }));

  proveri((g * 9) / 2 - (g * 4) / 2, 25);
  Z(3, 'Sa istog mesta pustimo dve kuglice, drugu $1 s$ posle prve. Koliko je rastojanje između njih $2 s$ posle puštanja druge kuglice? ($g = 10 m/s^{2}$, nijedna još nije pala na tlo.)',
    ['$25 m$', '$5 m$', '$10 m$', '$45 m$'],
    [K('Prva kuglica tada pada već $3 s$: $h_{1} = {10 · 3^{2}|2} m = 45 m$.', ['h1']),
     K('Druga pada $2 s$: $h_{2} = {10 · 2^{2}|2} m = 20 m$.', ['h2']),
     K('Rastojanje: $45 m − 20 m = 25 m$. Ono stalno raste, jer je prva kuglica uvek brža za $10 m/s$.')],
    null,
    { crtez: G([T('●', -1, 0, { b: 1 }), T('●', 1, 0, { b: 2 }), { lin: [[-1, 0], [-1, -4.5]], b: 1, debljina: 2, isp: 1, k: 1, id: 'h1' }, T('●', -1, -4.5, { b: 1, k: 1, id: 'h1', vel: 22 }), T('45 m', -2.1, -2.2, { b: 1, k: 1, id: 'h1' }),
      { lin: [[1, 0], [1, -2]], b: 2, debljina: 2, isp: 1, k: 2, id: 'h2' }, T('●', 1, -2, { b: 2, k: 2, id: 'h2', vel: 22 }), T('20 m', 2, -1, { b: 2, k: 2, id: 'h2' }), mera(0, -2, 0, -4.5, '25 m', { k: 3 })], { velicina: 200 }) });

  // ════════════════ 8. Hitac naviše i hitac naniže ════════════════
  L('Hitac naviše i hitac naniže');
  proveri(20 / g, 2);
  Z(1, 'Lopta je bačena uvis brzinom $20 m/s$. Posle koliko vremena dostiže najvišu tačku? ($g = 10 m/s^{2}$)',
    ['$2 s$', '$4 s$', '$200 s$', '$10 s$'],
    [K('Pri penjanju brzina opada za $10 m/s$ svake sekunde: $v = v_{0} − g t$.'),
     K('U najvišoj tački je $v = 0$: $t = {v_{0}|g} = {20 m/s|10 m/s^{2}} = 2 s$.', [], S('pad', { tip: 'navise', v0: 20, strob: 0.5 }))],
    S('pad', { tip: 'navise', v0: 20, sat: false, brojevi: false }));

  proveri((20 * 20) / (2 * g), 20);
  Z(1, 'Do koje visine se popne lopta bačena uvis brzinom $20 m/s$? (Otpor vazduha zanemari, $g = 10 m/s^{2}$.)',
    ['$20 m$', '$40 m$', '$10 m$', '$2 m$'],
    [K('Penjanje traje $t = 20 : 10 = 2 s$, a srednja brzina je ${20 + 0|2} = 10 m/s$.'),
     K('$h = 10 m/s · 2 s = 20 m$. Isto daje i $h = {v_{0}^{2}|2g} = {400|20} m$.', [], S('pad', { tip: 'navise', v0: 20, strob: 0.5 }))],
    G(visina(20, { o: 'h = ?', telo: '⚽' }), { velicina: 150 }));

  proveri((2 * 15) / g, 3);
  Z(2, 'Žongler baci lopticu uvis brzinom $15 m/s$. Posle koliko vremena će mu se loptica vratiti u ruku? ($g = 10 m/s^{2}$)',
    ['$3 s$', '$1,5 s$', '$15 s$', '$6 s$'],
    [K('Penjanje: $t_{1} = {15|10} s = 1,5 s$.'),
     K('Spuštanje sa iste visine traje isto koliko i penjanje: $t_{2} = 1,5 s$.'),
     K('Ukupno: $3 s$. Loptica se vraća brzinom $15 m/s$, istom kojom je bačena.', [], S('pad', { tip: 'navise', v0: 15, strob: 0.5 }))],
    S('pad', { tip: 'navise', v0: 15, sat: false, brojevi: false }));

  proveri(25 - g * 1, 15);
  Z(2, 'Kamen je bačen vertikalno uvis brzinom $25 m/s$. Kolika je njegova brzina posle $1 s$? ($g = 10 m/s^{2}$)',
    ['$15 m/s$, naviše', '$35 m/s$, naviše', '$10 m/s$, naniže', '$25 m/s$, naviše'],
    [K('$v = v_{0} − g · t = 25 m/s − 10 m/s = 15 m/s$.'),
     K('Brzina je pozitivna – kamen se još penje (vrh dostiže tek posle $2,5 s$).', [], S('pad', { tip: 'navise', v0: 25, strob: 0.5 }))],
    S('pad', { tip: 'navise', v0: 25, sat: false, brojevi: false }));

  proveri(5 + g * 2, 25);
  Z(2, 'Sa vrha zgrade kamen je bačen vertikalno naniže brzinom $5 m/s$. Kolika je njegova brzina posle $2 s$? ($g = 10 m/s^{2}$)',
    ['$25 m/s$', '$20 m/s$', '$15 m/s$', '$10 m/s$'],
    [K('Kod hica naniže brzina raste: $v = v_{0} + g t$.'),
     K('$v = 5 m/s + 10 m/s^{2} · 2 s = 25 m/s$.')],
    S('pad', { tip: 'nanize', v0: 5, visina: 40, brojevi: false, sat: true }));

  proveri(5 * 2 + (g * 4) / 2, 30);
  Z(2, 'Kamen je bačen vertikalno naniže brzinom $5 m/s$. Koliki put pređe za prve $2 s$? ($g = 10 m/s^{2}$)',
    ['$30 m$', '$20 m$', '$10 m$', '$50 m$'],
    [K('$h = v_{0} t + {g t^{2}|2}$.'),
     K('$h = 5 m/s · 2 s + {10 · 2^{2}|2} m = 10 m + 20 m = 30 m$. ($20 m$ bi bio slobodan pad bez početne brzine.)', [], S('pad', { tip: 'nanize', v0: 5, visina: 30, strob: 1 }))],
    S('pad', { tip: 'nanize', v0: 5, visina: 50, sat: false, brojevi: false }));

  proveri(Math.sqrt(2 * g * 45), 30);
  Z(3, 'Kolikom brzinom treba baciti loptu vertikalno uvis da bi se popela do visine $45 m$? ($g = 10 m/s^{2}$)',
    ['$30 m/s$', '$45 m/s$', '$9,5 m/s$', '$900 m/s$'],
    [K('Penjanje je „obrnut“ slobodan pad: lopta mora krenuti onom brzinom kojom bi pala sa $45 m$.'),
     K('$v_{0}^{2} = 2 g h = 2 · 10 · 45 = 900$ ⇒ $v_{0} = 30 m/s$.', [], S('pad', { tip: 'navise', v0: 30, strob: 1 }))],
    G(visina(45, { telo: '🏐' }), { velicina: 150 }));

  proveri(25 * 4 - (g * 16) / 2, 20);
  Z(3, 'Lopta je bačena uvis brzinom $25 m/s$. Na kojoj visini se nalazi posle $4 s$? ($g = 10 m/s^{2}$)',
    ['$20 m$, pada naniže', '$100 m$', '$31,25 m$, u vrhu', '$180 m$'],
    [K('$h = v_{0} t − {g t^{2}|2} = 25 · 4 − {10 · 16|2} = 100 − 80 = 20 m$.'),
     K('Brzina: $v = 25 − 10 · 4 = −15 m/s$ – lopta već pada (najviša tačka $31,25 m$ bila je u $2,5 s$).', ['h']),
     K('Na istoj visini od $20 m$ lopta je bila i u $1 s$ – jednom na putu gore, jednom dole.', ['t1'])],
    S('pad', { tip: 'navise', v0: 25, sat: false, brzina: false, strob: 99 }),
    { crtez: (() => { const gg = grafik({ xmax: 5, ymax: 35, yk: 5, y: 'h (m)' }); const pts = Array.from({ length: 21 }, (_, i) => { const t = i / 4; return [t, 25 * t - 5 * t * t]; }); return G([gg.e, gg.linija(pts), gg.proj(4, 20, { k: 1 }), gg.tacka(4, 20, { k: 1, b: 1 }), gg.tacka(2.5, 31.25, { k: 2, id: 'h' }), gg.tekst('31,25 m', 2.5, 34, { k: 2, id: 'h' }), gg.proj(1, 20, { k: 3, id: 't1' })], { velicina: 300 }); })() });

  Z(1, 'Kamen je bačen vertikalno uvis. Kolike su njegova brzina i ubrzanje u najvišoj tački putanje?',
    ['$v = 0$, $a = 10 m/s^{2}$ naniže', '$v = 0$, $a = 0$', '$v = v_{0}$, $a = 10 m/s^{2}$ naniže', '$v = 0$, $a = 10 m/s^{2}$ naviše'],
    [K('U najvišoj tački kamen se za trenutak zaustavi: $v = 0$.'),
     K('Ali sila Zemljine teže deluje i tada – ubrzanje je stalno $g = 10 m/s^{2}$, naniže. Zato kamen odmah kreće nazad.')],
    S('pad', { tip: 'navise', v0: 20, sat: false }));

  proveri(Math.sqrt(10 * 10 + 2 * g * 40), 30);
  Z(3, 'Sa visine $40 m$ kamen je bačen vertikalno naniže brzinom $10 m/s$. Kolikom brzinom udari u tlo? ($g = 10 m/s^{2}$)',
    ['$30 m/s$', '$28,3 m/s$', '$20 m/s$', '$50 m/s$'],
    [K('Veza brzina i puta: $v^{2} = v_{0}^{2} + 2 g h$.'),
     K('$v^{2} = 10^{2} + 2 · 10 · 40 = 100 + 800 = 900$ ⇒ $v = 30 m/s$.'),
     K('Pad traje $t = {30 − 10|10} s = 2 s$. ($28,3 m/s$ bi bilo bez početne brzine: $√{800}$.)', [], S('pad', { tip: 'nanize', v0: 10, visina: 40, strob: 0.5 }))],
    G(visina(40), { velicina: 150 }));

  // ════════════════ 9. Sila trenja ════════════════
  L('Sila trenja');
  proveri(0.3 * 20 * g, 60);
  Z(1, 'Sanduk mase $20 kg$ klizi po podu. Koeficijent trenja klizanja je $0,3$. Kolika je sila trenja? ($g = 10 m/s^{2}$)',
    ['$60 N$', '$6 N$', '$600 N$', '$200 N$'],
    [K('Na vodoravnoj podlozi sila kojom telo pritiska podlogu jednaka je težini: $N = m g = 20 kg · 10 m/s^{2} = 200 N$.', ['n']),
     K('$F_{tr} = μ · N = 0,3 · 200 N = 60 N$.', ['tr'])],
    S('sile', { sile: [{ F: 80, ugao: 0, o: 'F' }, { F: 60, ugao: 180, o: 'Ftr = ?' }], telo: '20 kg', kretanje: true }),
    { crtez: G([tlo(-4, 4, 0), telo(-1, 0, 2, 1.4, { tx: '20 kg' }), F(0, 0, 0, -2, { o: 'N = 200 N', b: 1, k: 1, id: 'n' }), F(-1, 0.3, -2.4, 0, { o: 'Ftr = 60 N', b: 3, k: 2, id: 'tr' }), F(1, 0.7, 2.4, 0, { o: 'F', b: 2 })], { velicina: 220 }) });

  Z(1, 'Dete vuče sanke stalnom brzinom silom od $40 N$ (paralelno sa tlom). Kolika je sila trenja?',
    ['$40 N$', '$0 N$', '$80 N$', '$20 N$'],
    [K('Stalna brzina znači da je ubrzanje $0$, pa je rezultanta sila jednaka nuli (Prvi Njutnov zakon).'),
     K('Vučna sila i trenje se poništavaju: $F_{tr} = 40 N$.', [], S('sile', { sile: [{ F: 40, ugao: 0, o: '40 N' }, { F: 40, ugao: 180, o: 'Ftr = 40 N' }], e: '🛷' }))],
    S('sile', { sile: [{ F: 40, ugao: 0, o: '40 N' }], e: '🛷' }));

  proveri(15 / (5 * g), 0.3);
  Z(2, 'Kutiju mase $5 kg$ vučemo po stolu stalnom brzinom silom $15 N$. Koliki je koeficijent trenja? ($g = 10 m/s^{2}$)',
    ['$0,3$', '$3$', '$0,33$', '$0,15$'],
    [K('Stalna brzina ⇒ $F_{tr} = 15 N$. Pritisak na podlogu: $N = 5 kg · 10 m/s^{2} = 50 N$.'),
     K('$μ = {F_{tr}|N} = {15 N|50 N} = 0,3$. Koeficijent trenja nema jedinicu.')],
    S('sile', { sile: [{ F: 15, ugao: 0, o: '15 N' }, { F: 15, ugao: 180, o: 'Ftr' }], telo: '5 kg' }));

  proveri((50 - 0.2 * 10 * g) / 10, 3);
  Z(2, 'Na telo mase $10 kg$ na podu deluje vodoravna sila $50 N$. Koeficijent trenja je $0,2$. Koliko je ubrzanje tela? ($g = 10 m/s^{2}$)',
    ['$3 m/s^{2}$', '$5 m/s^{2}$', '$7 m/s^{2}$', '$2 m/s^{2}$'],
    [K('Trenje: $F_{tr} = μ m g = 0,2 · 10 kg · 10 m/s^{2} = 20 N$.'),
     K('Rezultanta: $R = 50 N − 20 N = 30 N$.', [], S('sile', { sile: [{ F: 50, ugao: 0, o: '50 N' }, { F: 20, ugao: 180, o: '20 N' }], telo: '10 kg', rezultanta: 'R = 30 N', kretanje: true })),
     K('$a = {R|m} = {30 N|10 kg} = 3 m/s^{2}$.')],
    S('sile', { sile: [{ F: 50, ugao: 0, o: '50 N' }, { F: 20, ugao: 180, o: 'Ftr' }], telo: '10 kg' }));

  proveri(0.05 * g, 0.5);
  Z(2, 'Hokejaški pak klizi po ledu; koeficijent trenja je $0,05$. Koliko je usporenje paka? ($g = 10 m/s^{2}$)',
    ['$0,5 m/s^{2}$', '$0,05 m/s^{2}$', '$5 m/s^{2}$', '$50 m/s^{2}$'],
    [K('Jedina sila duž kretanja je trenje: $F_{tr} = μ m g$.'),
     K('$a = {F_{tr}|m} = {μ m g|m} = μ g = 0,05 · 10 m/s^{2} = 0,5 m/s^{2}$ – masa se skrati!')],
    S('kretanje', { tela: [{ e: '🏒', v: 6, a: -0.5, podloga: 'led', staza: '~led' }], duzina: 40, podeok: 5, vektor: true, tempo: 3 }));

  proveri((10 * 10) / (2 * 0.1 * g), 50);
  Z(3, 'Pak dobije brzinu $10 m/s$ i klizi po ledu dok se ne zaustavi. Koeficijent trenja je $0,1$. Koliki put pređe? ($g = 10 m/s^{2}$)',
    ['$50 m$', '$100 m$', '$10 m$', '$5 m$'],
    [K('Usporenje: $a = μ g = 0,1 · 10 = 1 m/s^{2}$.'),
     K('Vreme klizanja: $t = {10 m/s|1 m/s^{2}} = 10 s$, srednja brzina $5 m/s$.'),
     K('$s = 5 m/s · 10 s = 50 m$ (ili $s = {v_{0}^{2}|2a} = {100|2} m$).')],
    S('kretanje', { tela: [{ e: '🏒', v: 10, a: -1, podloga: 'led' }], duzina: 60, podeok: 10, natpisi: 99, vektor: true, tempo: 4, sat: false }));

  proveri(0.2 * 2 * g, 4);
  Z(3, 'Kutija mase $2 kg$ leži na stolu. Najveća sila trenja mirovanja je $0,2 · m g$. Na kutiju deluje vodoravna sila od $3 N$. Šta se dešava? ($g = 10 m/s^{2}$)',
    ['Miruje; trenje je $3 N$', 'Miruje; trenje je $4 N$', 'Kreće se ubrzanjem $1,5 m/s^{2}$', 'Kreće se ubrzanjem $0,5 m/s^{2}$'],
    [K('Najveća sila trenja mirovanja: $0,2 · 2 kg · 10 m/s^{2} = 4 N$.'),
     K('Sila od $3 N$ je manja od $4 N$, pa kutija ne kreće.', [], S('sile', { sile: [{ F: 3, ugao: 0, o: '3 N' }, { F: 3, ugao: 180, o: 'Ftr = 3 N' }], e: '📦' })),
     K('Trenje mirovanja je tada tačno onoliko koliko treba za ravnotežu: $3 N$ (ne $4 N$ – to je samo granica).')],
    S('sile', { sile: [{ F: 3, ugao: 0, o: '3 N' }], e: '📦' }));

  proveri(0.4 * 20 * g, 80);
  Z(2, 'Ormar guramo stalnom brzinom; koeficijent trenja je $0,4$. Za koliko treba povećati silu ako u ormar stavimo knjige mase $20 kg$? ($g = 10 m/s^{2}$)',
    ['Za $80 N$', 'Za $200 N$', 'Za $8 N$', 'Ne treba je menjati'],
    [K('Trenje je srazmerno sili kojom telo pritiska podlogu – sa knjigama ona je veća za $20 kg · 10 m/s^{2} = 200 N$.'),
     K('Trenje (a time i potrebna sila) poraste za $0,4 · 200 N = 80 N$.')],
    S('sile', { sile: [{ F: 50, ugao: 0, o: 'F' }, { F: 50, ugao: 180, o: 'Ftr' }], e: '🗄️' }));

  proveri((20 * 20) / (2 * 0.1 * g), 200); proveri((20 * 20) / (2 * 0.5 * g), 40);
  Z(3, 'Automobil vozi $20 m/s$ i naglo koči (točkovi klize). Na suvom asfaltu koeficijent trenja je $0,5$, a na ledu $0,1$. Koliki je zaustavni put na ledu? ($g = 10 m/s^{2}$)',
    ['$200 m$', '$40 m$', '$100 m$', '$20 m$'],
    [K('Usporenje je $a = μ g$: na asfaltu $5 m/s^{2}$, na ledu samo $1 m/s^{2}$.'),
     K('Zaustavni put $s = {v^{2}|2a}$. Na asfaltu: ${400|10} = 40 m$.'),
     K('Na ledu: ${400|2} = 200 m$ – pet puta duže! Zato zimi treba voziti sporije.')],
    S('kretanje', { tela: [{ e: '🚗', v: 20, a: -5, podloga: 'asfalt', staza: '~asfalt' }, { e: '🚗', v: 20, a: -1, podloga: 'led', staza: '~led' }], duzina: 200, podeok: 25, natpisi: 99, tempo: 4, sat: false }));

  Z(1, 'Teška kutija mase $30 kg$ miruje na vodoravnom podu i niko je ne gura. Kolika sila trenja deluje na nju?',
    ['$0 N$', '$300 N$', '$μ · 300 N$', 'Zavisi od vrste poda'],
    [K('Trenje se javlja tek kada nešto pokušava da pokrene telo (ili kad se telo kreće).'),
     K('Ako na kutiju ne deluje nijedna vodoravna sila, nema čemu trenje da se suprotstavlja: $F_{tr} = 0$.')]);
};
