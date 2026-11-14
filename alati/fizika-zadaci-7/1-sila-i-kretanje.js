// Tema 1: Sila i kretanje – brzina i ubrzanje, Drugi i Treći Njutnov zakon, ravnomerno promenljivo kretanje, grafici
module.exports = ({ L, Z, K, G, S, proveri, b, r, F, telo, tlo, T, mera, grafik, stubovi }) => {
  // v–t grafik sa trouglom Δt, Δv (za ubrzanje kao nagib)
  const nagib = (g, [t1, v1], [t2, v2], { kdt = 1, kdv = 2, idt = 'dt', idv = 'dv', odt, odv } = {}) => [
    { lin: [g.P(t1, v1), g.P(t2, v1)], b: 3, debljina: 2.5, isp: 1, k: kdt, id: idt },
    T(odt ?? `Δt = ${b(t2 - t1)} s`, ...[(g.P(t1, v1)[0] + g.P(t2, v1)[0]) / 2, g.P(t1, v1)[1] + (v2 > v1 ? -0.4 : 0.4)], { k: kdt, id: idt, b: 3, vel: 13 }),
    { lin: [g.P(t2, v1), g.P(t2, v2)], b: 1, debljina: 2.5, isp: 1, k: kdv, id: idv },
    T(odv ?? `Δv = ${b(Math.abs(v2 - v1))} m/s`, g.P(t2, v1)[0] + 1.4, (g.P(t2, v1)[1] + g.P(t2, v2)[1]) / 2, { k: kdv, id: idv, b: 1, vel: 13 }),
  ];

  // ════════════════ 1. Srednja brzina i ubrzanje ════════════════
  L('Srednja brzina i ubrzanje');
  {
    proveri((25 - 10) / 5, 3);
    const g = grafik({ xmax: 6, ymax: 30, yk: 5 });
    Z(1, 'Automobil za $5 s$ poveća brzinu sa $10 m/s$ na $25 m/s$. Koliko je njegovo ubrzanje?',
      ['$3 m/s^{2}$', '$5 m/s^{2}$', '$2 m/s^{2}$', '$7 m/s^{2}$'],
      [K('Promena brzine: $Δv = v − v_{0} = 25 m/s − 10 m/s = 15 m/s$.', ['dv']),
       K('Ubrzanje je promena brzine u jedinici vremena: $a = {Δv|Δt} = {15 m/s|5 s} = 3 m/s^{2}$.', ['dt', 'dv']),
       K('To znači da brzina svake sekunde poraste za $3 m/s$: $10 → 13 → 16 → 19 → 22 → 25$ m/s.', ['tacke'])],
      S('kretanje', { tela: [{ e: '🚗', v: 10, a: 3 }], duzina: 90, podeok: 10, vektor: true, sat: true }),
      { crtez: G([g.e, g.linija([[0, 10], [5, 25]]), nagib(g, [0, 10], [5, 25], { kdt: 2, kdv: 1 }), [1, 2, 3, 4, 5].map((t) => g.tacka(t, 10 + 3 * t, { k: 3, id: 'tacke' }))], { velicina: 300 }) });
  }
  proveri(1200 / 240, 5);
  Z(1, 'Biciklista pređe $1,2 km$ za $4 min$. Kolika je njegova srednja brzina?',
    ['$5 m/s$', '$0,3 m/s$', '$300 m/s$', '$18 m/s$'],
    [K('Pretvaramo u osnovne jedinice: $s = 1,2 km = 1 200 m$, $t = 4 min = 240 s$.'),
     K('Srednja brzina: $v_{sr} = {s|t} = {1 200 m|240 s} = 5 m/s$.'),
     K('Za proveru: $5 m/s = 5 · 3,6 km/h = 18 km/h$ – uobičajena brzina bicikla (zato je „$18 m/s$“ zamka: to su km/h).')],
    S('kretanje', { tela: [{ e: '🚴', v: 5 }], duzina: 1200, podeok: 200, jedinica: 'm', tempo: 60, trag: 30 }));

  {
    proveri((2 * 90 + 60) / 3, 80);
    const g = grafik({ xmax: 3.5, ymax: 100, xk: 0.5, yk: 20, x: 't (h)', y: 'v (km/h)' });
    Z(2, 'Autobus vozi $2 h$ brzinom $90 km/h$, a zatim još $1 h$ brzinom $60 km/h$. Kolika je srednja brzina na celom putu?',
      ['$80 km/h$', '$75 km/h$', '$70 km/h$', '$85 km/h$'],
      [K('Put u prvom delu: $s_{1} = 90 km/h · 2 h = 180 km$.', ['s1']),
       K('Put u drugom delu: $s_{2} = 60 km/h · 1 h = 60 km$.', ['s2']),
       K('Srednja brzina = ukupan put / ukupno vreme: $v_{sr} = {180 km + 60 km|3 h} = {240 km|3 h} = 80 km/h$.', ['sr']),
       K('Nije $75 km/h$ (prosek brzina), jer je autobus duže vozio brže – brža deonica „vredi“ dvostruko.')],
      S('kretanje', { tela: [{ e: '🚌', faze: [{ t: 2, v: 90, o: '90 km/h' }, { t: 1, v: 60, o: '60 km/h' }] }], duzina: 240, podeok: 20, jedinica: 'km', jedVreme: 'h', tempo: 0.8, natpisi: 3, sat: true, trag: 0.5 }),
      { crtez: G([g.e, g.povrs([[0, 90], [2, 90]], { k: 1, id: 's1', b: 0 }), g.povrs([[2, 60], [3, 60]], { k: 2, id: 's2', b: 1 }), g.linija([[0, 90], [2, 90], [2, 60], [3, 60]]),
        g.tekst('180 km', 1, 45, { k: 1, id: 's1' }), g.tekst('60 km', 2.5, 30, { k: 2, id: 's2' }),
        { lin: [g.P(0, 80), g.P(3, 80)], b: 3, debljina: 2.5, isp: 1, k: 3, id: 'sr' }, g.tekst('~srednja: 80', 3.1, 86, { k: 3, id: 'sr', b: 3 })], { velicina: 300 }) });
  }

  proveri((2 * 60 * 40) / (60 + 40), 48);
  Z(3, 'Automobil je prvu polovinu puta prešao brzinom $60 km/h$, a drugu polovinu brzinom $40 km/h$. Kolika je srednja brzina na celom putu?',
    ['$48 km/h$', '$50 km/h$', '$45 km/h$', '$52 km/h$'],
    [K('Neka je ceo put, na primer, $s = 120 km$ (svaki broj daje isti rezultat). Polovine su po $60 km$.'),
     K('Vremena: $t_{1} = {60 km|60 km/h} = 1 h$, $t_{2} = {60 km|40 km/h} = 1,5 h$.'),
     K('$v_{sr} = {120 km|1 h + 1,5 h} = {120 km|2,5 h} = 48 km/h$.'),
     K('Manje je od $50 km/h$ jer sporiju polovinu vozi duže – srednja brzina „naginje“ ka sporijoj.')],
    S('kretanje', { tela: [{ e: '🚗', faze: [{ t: 1, v: 60, o: '60 km/h' }, { t: 1.5, v: 40, o: '40 km/h' }] }], duzina: 120, podeok: 20, jedinica: 'km', jedVreme: 'h', tempo: 0.6, natpisi: 3, sat: false, trag: 0.25 }));

  proveri(20 / 40, 0.5);
  Z(1, 'Voz koji ide brzinom $20 m/s$ ravnomerno koči i zaustavi se za $40 s$. Kolika je veličina njegovog usporenja?',
    ['$0,5 m/s^{2}$', '$2 m/s^{2}$', '$800 m/s^{2}$', '$0,05 m/s^{2}$'],
    [K('Brzina se promeni sa $20 m/s$ na $0$: $Δv = 0 − 20 m/s = −20 m/s$.'),
     K('$a = {Δv|Δt} = {−20 m/s|40 s} = −0,5 m/s^{2}$.'),
     K('Znak „−“ znači da brzina opada (usporavanje). Veličina usporenja je $0,5 m/s^{2}$: svake sekunde voz izgubi $0,5 m/s$.')],
    S('kretanje', { tela: [{ e: '🚆', v: 20, a: -0.5, okreni: true }], duzina: 400, podeok: 50, tempo: 10, vektor: true, sat: true, trag: 5 }));

  proveri(108 / 3.6 / 10, 3);
  Z(2, 'Automobil ubrza od $0$ do $108 km/h$ za $10 s$. Koliko je njegovo ubrzanje?',
    ['$3 m/s^{2}$', '$10,8 m/s^{2}$', '$30 m/s^{2}$', '$0,3 m/s^{2}$'],
    [K('Brzinu pretvaramo u m/s (delimo sa $3,6$): $108 km/h = {108|3,6} m/s = 30 m/s$.'),
     K('$a = {Δv|Δt} = {30 m/s|10 s} = 3 m/s^{2}$.'),
     K('Pazi: „$10,8$“ se dobija kad se zaboravi pretvaranje km/h u m/s.')],
    S('kretanje', { tela: [{ e: '🏎️', v: 0, a: 3 }], duzina: 150, podeok: 25, vektor: true, sat: true }));

  {
    proveri(72 / 3.6 / 2, 10);
    Z(3, 'Gepard za $2 s$ iz mirovanja dostigne brzinu $72 km/h$. Koliko je njegovo srednje ubrzanje? (Uporedi ga sa ubrzanjem slobodnog pada $g ≈ 10 m/s^{2}$.)',
      ['$10 m/s^{2}$ – kao $g$', '$36 m/s^{2}$ – više od $g$', '$20 m/s^{2}$ – dvaput više od $g$', '$5 m/s^{2}$ – pola od $g$'],
      [K('$72 km/h = {72|3,6} m/s = 20 m/s$.'),
       K('$a = {20 m/s|2 s} = 10 m/s^{2}$.'),
       K('Gepard ubrzava otprilike kao telo koje slobodno pada – brže od skoro svakog automobila!')],
      S('kretanje', { tela: [{ e: '🐆', v: 0, a: 10, okreni: true }, { e: '🚗', v: 0, a: 3.5 }], duzina: 40, podeok: 5, vektor: true, sat: true }));
  }

  {
    proveri(1200 / (400 + 300 + 300), 1.2);
    Z(3, 'Ana ide do prodavnice udaljene $600 m$ brzinom $1,5 m/s$, u prodavnici se zadrži $5 min$, pa se vrati kući brzinom $2 m/s$. Kolika je srednja brzina za ceo izlazak (od polaska do povratka)?',
      ['$1,2 m/s$', '$1,75 m/s$', '$1,7 m/s$', '$0,6 m/s$'],
      [K('Odlazak: $t_{1} = {600 m|1,5 m/s} = 400 s$.'),
       K('Povratak: $t_{2} = {600 m|2 m/s} = 300 s$; zadržavanje $t_{3} = 5 min = 300 s$.'),
       K('Ukupno: put $s = 1 200 m$, vreme $t = 400 s + 300 s + 300 s = 1 000 s$.', ['t']),
       K('$v_{sr} = {1 200 m|1 000 s} = 1,2 m/s$. (Bez zadržavanja bi bilo $1 200 m : 700 s ≈ 1,7 m/s$.)')],
      null,
      { crtez: G([...stubovi([['~odlazak', 400, 0], ['~kupovina', 300, 4], ['~povratak', 300, 2]], { jedinica: 's', vis: 3.5, sir: 2, razmak: 0.6 }), T('t = 1 000 s', 4, 4.6, { k: 3, id: 't', b: 3 })], { velicina: 260 }) });
  }

  proveri(3 / 1.5, 2);
  Z(1, 'Lift krene iz mirovanja i za $1,5 s$ dostigne brzinu $3 m/s$. Koliko je ubrzanje lifta?',
    ['$2 m/s^{2}$', '$4,5 m/s^{2}$', '$0,5 m/s^{2}$', '$1,5 m/s^{2}$'],
    [K('$Δv = 3 m/s − 0 = 3 m/s$, $Δt = 1,5 s$.'),
     K('$a = {3 m/s|1,5 s} = 2 m/s^{2}$.')],
    S('dizanje', { visina: 4, e: '🛗', vreme: 1.5 }));

  proveri((12 - 0) / 4, 3);
  {
    const g = grafik({ xmax: 6, ymax: 15, yk: 3 });
    Z(2, 'Na grafiku je prikazano kako se menjala brzina trkača na startu. Koliko je njegovo ubrzanje u prve $4 s$?',
      ['$3 m/s^{2}$', '$12 m/s^{2}$', '$4 m/s^{2}$', '$0,33 m/s^{2}$'],
      [K('Sa grafika: za $Δt = 4 s$ brzina poraste od $0$ do $12 m/s$.', ['dt', 'dv']),
       K('$a = {Δv|Δt} = {12 m/s|4 s} = 3 m/s^{2}$.'),
       K('Posle $4 s$ linija je vodoravna: brzina se više ne menja, ubrzanje je $0$.', ['ravno'])],
      G([g.e, g.linija([[0, 0], [4, 12], [6, 12]], { crtaj: false }), g.proj(4, 12, { k: 1 }), nagib(g, [0, 0], [4, 12], { kdt: 1, kdv: 1 }), { lin: [g.P(4, 12), g.P(6, 12)], b: 2, debljina: 5, k: 3, id: 'ravno' }], { velicina: 300 }));
  }

  // ════════════════ 2. Drugi Njutnov zakon ════════════════
  L('Drugi Njutnov zakon');
  proveri(6 / 2, 3);
  Z(1, 'Na kolica mase $2 kg$ deluje stalna sila od $6 N$ (trenje zanemarujemo). Koliko je ubrzanje kolica?',
    ['$3 m/s^{2}$', '$12 m/s^{2}$', '$4 m/s^{2}$', '$0,33 m/s^{2}$'],
    [K('Drugi Njutnov zakon: $a = {F|m}$.'),
     K('$a = {6 N|2 kg} = 3 m/s^{2}$ (jer je $1 N = 1 kg · m/s^{2}$).')],
    S('sile', { sile: [{ F: 6, ugao: 0, o: '6 N' }], telo: '2 kg', kretanje: true }));

  proveri(50 * 0.4, 20);
  Z(1, 'Kolika sila treba da deluje na sanke mase $50 kg$ da bi dobile ubrzanje $0,4 m/s^{2}$? (Trenje zanemari.)',
    ['$20 N$', '$125 N$', '$200 N$', '$50,4 N$'],
    [K('$F = m · a$.'),
     K('$F = 50 kg · 0,4 m/s^{2} = 20 N$.')],
    S('sile', { sile: [{ F: 20, ugao: 0, o: 'F = ?' }], e: '🛷', kretanje: true }));

  proveri(15 / 3, 5);
  Z(1, 'Sila od $15 N$ daje telu ubrzanje $3 m/s^{2}$. Kolika je masa tela?',
    ['$5 kg$', '$45 kg$', '$0,2 kg$', '$12 kg$'],
    [K('Iz $F = m · a$ sledi $m = {F|a}$.'),
     K('$m = {15 N|3 m/s^{2}} = 5 kg$.')]);

  {
    proveri((30 - 10) / 4, 5);
    Z(2, 'Na telo mase $4 kg$ deluju dve sile duž istog pravca: $30 N$ udesno i $10 N$ ulevo. Koliko je ubrzanje tela i u kom smeru?',
      ['$5 m/s^{2}$ udesno', '$10 m/s^{2}$ udesno', '$7,5 m/s^{2}$ udesno', '$2,5 m/s^{2}$ ulevo'],
      [K('Sile suprotnog smera se oduzimaju: rezultanta $R = 30 N − 10 N = 20 N$, u smeru veće sile – udesno.', [], S('sile', { sile: [{ F: 30, ugao: 0, o: '30 N' }, { F: 10, ugao: 180, o: '10 N' }], telo: '4 kg', rezultanta: 'R = 20 N', kretanje: true })),
       K('$a = {R|m} = {20 N|4 kg} = 5 m/s^{2}$, udesno.')],
      S('sile', { sile: [{ F: 30, ugao: 0, o: '30 N' }, { F: 10, ugao: 180, o: '10 N' }], telo: '4 kg' }));
  }

  proveri(1200 * (20 / 10), 2400);
  Z(2, 'Automobil mase $1 200 kg$ iz mirovanja za $10 s$ dostigne brzinu $20 m/s$. Kolika je rezultujuća sila na automobil?',
    ['$2 400 N$', '$24 000 N$', '$600 N$', '$12 000 N$'],
    [K('Prvo ubrzanje: $a = {Δv|Δt} = {20 m/s|10 s} = 2 m/s^{2}$.'),
     K('Zatim sila: $F = m · a = 1 200 kg · 2 m/s^{2} = 2 400 N$.')],
    S('kretanje', { tela: [{ e: '🚙', v: 0, a: 2 }], duzina: 100, podeok: 10, vektor: true, sat: true }));

  proveri(2 * 6 / 3, 4);
  Z(2, 'Ista sila daje telu mase $2 kg$ ubrzanje $6 m/s^{2}$. Koliko ubrzanje bi ta sila dala telu mase $3 kg$?',
    ['$4 m/s^{2}$', '$9 m/s^{2}$', '$6 m/s^{2}$', '$3 m/s^{2}$'],
    [K('Sila: $F = m_{1} · a_{1} = 2 kg · 6 m/s^{2} = 12 N$.'),
     K('Novo ubrzanje: $a_{2} = {F|m_{2}} = {12 N|3 kg} = 4 m/s^{2}$.'),
     K('Veća masa – manje ubrzanje: masa je $1,5$ put veća, ubrzanje $1,5$ put manje.')],
    S('kretanje', { tela: [{ v: 0, a: 6, o: '2 kg', b: 0 }, { v: 0, a: 4, o: '3 kg', b: 1 }], duzina: 30, podeok: 5, sat: false }));

  proveri((0.4 * 15) / 0.02, 300);
  Z(3, 'Fudbaler šutira loptu mase $0,4 kg$ koja je mirovala. Udarac traje $0,02 s$, a lopta odleti brzinom $15 m/s$. Kolikom srednjom silom je delovao na loptu?',
    ['$300 N$', '$6 N$', '$30 N$', '$3 000 N$'],
    [K('Ubrzanje lopte za vreme udarca: $a = {15 m/s|0,02 s} = 750 m/s^{2}$.'),
     K('$F = m · a = 0,4 kg · 750 m/s^{2} = 300 N$ – kao da na loptu pritisne teg od $30 kg$, ali samo dve stotinke sekunde.')],
    S('kretanje', { tela: [{ e: '⚽', v: 15 }], duzina: 30, podeok: 5, vektor: true }));

  proveri((12 - 3) / 3 * 4, 12);
  Z(3, 'Kolica mase $3 kg$ vučemo silom $12 N$, a sila trenja je $3 N$. Kolika je brzina kolica posle $4 s$ ako su krenula iz mirovanja?',
    ['$12 m/s$', '$16 m/s$', '$3 m/s$', '$20 m/s$'],
    [K('Rezultujuća sila: $R = 12 N − 3 N = 9 N$.', [], S('sile', { sile: [{ F: 12, ugao: 0, o: '12 N' }, { F: 3, ugao: 180, o: 'Ftr = 3 N' }], telo: '3 kg', rezultanta: 'R = 9 N', kretanje: true })),
     K('Ubrzanje: $a = {R|m} = {9 N|3 kg} = 3 m/s^{2}$.'),
     K('Brzina: $v = a · t = 3 m/s^{2} · 4 s = 12 m/s$. ($16 m/s$ bi bilo bez trenja.)')],
    S('sile', { sile: [{ F: 12, ugao: 0, o: '12 N' }, { F: 3, ugao: 180, o: 'Ftr' }], telo: '3 kg' }));

  proveri(4 * 6, 24); proveri(24 / (4 + 2), 4);
  Z(3, 'Sila daje kolicima ubrzanje $6 m/s^{2}$. Kada na kolica stavimo teg od $2 kg$, ista sila im daje ubrzanje $4 m/s^{2}$. Kolika je masa kolica?',
    ['$4 kg$', '$2 kg$', '$6 kg$', '$8 kg$'],
    [K('Sila je ista: $F = m · 6 = (m + 2 kg) · 4$.'),
     K('$6m = 4m + 8$ ⇒ $2m = 8$ ⇒ $m = 4 kg$.'),
     K('Provera: $F = 4 kg · 6 m/s^{2} = 24 N$ i $24 N : 6 kg = 4 m/s^{2}$ ✓.')],
    S('kretanje', { tela: [{ e: '🛒', v: 0, a: 6, o: 'm' }, { e: '🛒', v: 0, a: 4, o: 'm + 2 kg' }], duzina: 30, podeok: 5, sat: false }));

  Z(2, 'Kako se promeni ubrzanje tela ako se sila koja na njega deluje udvostruči, a masa tela prepolovi?',
    ['Poveća se $4$ puta', 'Poveća se $2$ puta', 'Ostane isto', 'Poveća se $8$ puta'],
    [K('$a = {F|m}$: dvostruko veća sila daje $2$ puta veće ubrzanje.'),
     K('Dvostruko manja masa daje još $2$ puta veće ubrzanje.'),
     K('Ukupno: $a_{novo} = {2F|m/2} = 4 · {F|m}$ – ubrzanje je $4$ puta veće.')]);

  // ════════════════ 3. Treći Njutnov zakon ════════════════
  L('Treći Njutnov zakon');
  proveri(120 / 40, 3); proveri(120 / 60, 2);
  Z(1, 'Dečak ($40 kg$) i devojčica ($60 kg$) stoje na ledu i odgurnu se rukama. Dečak gura devojčicu silom $120 N$. Kolika ubrzanja dobijaju (prvo dečak, pa devojčica)?',
    ['$3 m/s^{2}$ i $2 m/s^{2}$', '$2 m/s^{2}$ i $3 m/s^{2}$', '$0$ i $2 m/s^{2}$', '$1,2 m/s^{2}$ i $1,2 m/s^{2}$'],
    [K('Po Trećem Njutnovom zakonu i devojčica gura dečaka silom iste jačine, $120 N$, u suprotnom smeru.'),
     K('Dečak: $a_{1} = {120 N|40 kg} = 3 m/s^{2}$.'),
     K('Devojčica: $a_{2} = {120 N|60 kg} = 2 m/s^{2}$. Sile su jednake, ali lakši dobija veće ubrzanje.')],
    S('reakcija', { tip: 'klizaci', levo: { e: '🧒', m: 40, o: '40 kg' }, desno: { e: '👧', m: 60, o: '60 kg' }, brzine: true }));

  Z(1, 'Knjiga mase $2 kg$ miruje na stolu. Kolikom silom i u kom smeru sto deluje na knjigu? ($g = 10 m/s^{2}$)',
    ['$20 N$ naviše', '$20 N$ naniže', '$2 N$ naviše', '$0 N$'],
    [K('Knjiga pritiska sto svojom težinom: $Q = m · g = 2 kg · 10 m/s^{2} = 20 N$ naniže.', ['q']),
     K('Po Trećem Njutnovom zakonu sto deluje na knjigu silom iste jačine u suprotnom smeru: $N = 20 N$ naviše.', ['n'])],
    null,
    { crtez: G([tlo(-3, 3, 0), telo(-1.2, 0, 2.4, 1, { tx: '📕', b: 0 }), F(0.6, 0, 0, -2, { o: 'Q = 20 N', b: 1, k: 1, id: 'q' }), F(-0.6, 1, 0, 2, { o: 'N = 20 N', b: 2, k: 2, id: 'n' })], { velicina: 200 }) });

  proveri(2 * 3 / 6, 1);
  Z(2, 'Dvoja kolica, mase $2 kg$ i $6 kg$, razdvoji sabijena opruga između njih. Lakša kolica dobiju ubrzanje $3 m/s^{2}$. Koliko ubrzanje dobiju teža?',
    ['$1 m/s^{2}$', '$9 m/s^{2}$', '$3 m/s^{2}$', '$0,33 m/s^{2}$'],
    [K('Opruga gura oba kolica silom iste jačine: $F = 2 kg · 3 m/s^{2} = 6 N$.'),
     K('Teža kolica: $a = {6 N|6 kg} = 1 m/s^{2}$.'),
     K('Masa je $3$ puta veća – ubrzanje $3$ puta manje.')],
    S('reakcija', { tip: 'klizaci', levo: { e: '🛒', m: 2, o: '2 kg' }, desno: { e: '🛒', m: 6, o: '6 kg' } }));

  proveri(150 / 75, 2);
  Z(2, 'Dečak mase $75 kg$ (zajedno sa skejtom) odgurne se od zida silom $150 N$. Koliko ubrzanje dobija dok se gura? (Trenje zanemari.)',
    ['$2 m/s^{2}$', '$0$ – zid se ne pomera', '$4 m/s^{2}$', '$150 m/s^{2}$'],
    [K('Dečak deluje na zid silom $150 N$, a zid na dečaka – istom silom u suprotnom smeru. Ta sila ga pokreće.', ['n']),
     K('$a = {F|m} = {150 N|75 kg} = 2 m/s^{2}$.')],
    null,
    { crtez: G([{ lin: [[4, 0], [4, 4]], b: 4, debljina: 6 }, tlo(-4, 4, 0), T('🛹', 1.6, 0.7, { vel: 30 }), T('🧍', 1.6, 2.3, { vel: 46 }), F(2.6, 2.6, 1.3, 0, { o: '150 N', b: 3 }), F(4, 2, -2.2, 0, { o: '150 N', b: 1, k: 1, id: 'n' })], { velicina: 220 }) });

  Z(2, 'Jabuka mase $0,2 kg$ pada sa grane. Kolikom silom jabuka privlači Zemlju? ($g = 10 m/s^{2}$)',
    ['$2 N$', '$0 N$', '$0,2 N$', 'Zanemarljivo, skoro $0 N$'],
    [K('Zemlja privlači jabuku silom $Q = 0,2 kg · 10 m/s^{2} = 2 N$.'),
     K('Po Trećem Njutnovom zakonu i jabuka privlači Zemlju silom od $2 N$ (prema jabuci).'),
     K('Zemlja se ipak „ne pomera“: njeno ubrzanje $2 N : 6 · 10^{24} kg$ je neverovatno malo.')],
    S('pad', { tip: 'slobodan', visina: 3, sat: false, brzina: false }));

  proveri((30000 - 20000) / 2000, 5);
  Z(3, 'Raketa mase $2 000 kg$ diže se uspravno. Izlazni gasovi guraju raketu silom $30 000 N$. Koliko je ubrzanje rakete? ($g = 10 m/s^{2}$)',
    ['$5 m/s^{2}$', '$15 m/s^{2}$', '$10 m/s^{2}$', '$25 m/s^{2}$'],
    [K('Raketa izbacuje gas nadole, a gas (Treći Njutnov zakon) gura raketu naviše silom $30 000 N$.'),
     K('Težina rakete: $Q = 2 000 kg · 10 m/s^{2} = 20 000 N$, naniže.', ['q']),
     K('Rezultanta: $R = 30 000 N − 20 000 N = 10 000 N$ naviše.', ['r']),
     K('$a = {R|m} = {10 000 N|2 000 kg} = 5 m/s^{2}$.')],
    S('reakcija', { tip: 'raketa' }),
    { crtez: G([T('🚀', 0, 0, { vel: 54 }), F(0.9, 0.3, 0, 3, { o: '30 000 N', b: 2 }), F(-0.9, -0.3, 0, -2, { o: 'Q = 20 000 N', b: 1, k: 2, id: 'q' }), F(2.6, 0, 0, 1, { o: 'R', b: 3, k: 3, id: 'r', deb: 5 })], { velicina: 200 }) });

  proveri(0.6 / 0.1, 6);
  Z(2, 'Magnet mase $0,1 kg$ i gvozdena kuglica mase $0,3 kg$ leže na glatkom stolu i privlače se silom $0,6 N$. Koliko je ubrzanje magneta?',
    ['$6 m/s^{2}$', '$2 m/s^{2}$', '$1,5 m/s^{2}$', '$0,6 m/s^{2}$'],
    [K('I kuglica privlači magnet silom od $0,6 N$ (Treći Njutnov zakon) – privlačenje je uzajamno.'),
     K('Magnet: $a = {0,6 N|0,1 kg} = 6 m/s^{2}$; kuglica: $a = {0,6 N|0,3 kg} = 2 m/s^{2}$.')],
    S('magnet', { tip: 'polovi', polovi: 'NS' }));

  proveri(3 * 2, 6);
  Z(3, 'Dvoja kolica se odgurnu jedna od drugih. Za isto vreme kolica A (mase $3 kg$) pređu dvostruko duži put od kolica B. Kolika je masa kolica B?',
    ['$6 kg$', '$1,5 kg$', '$3 kg$', '$12 kg$'],
    [K('Kolica kreću iz mirovanja, pa je pređeni put srazmeran ubrzanju ($s = {a t^{2}|2}$): $a_{A} = 2 a_{B}$.'),
     K('Sile su jednake (Treći Njutnov zakon): $m_{A} · a_{A} = m_{B} · a_{B}$.'),
     K('$3 kg · 2a_{B} = m_{B} · a_{B}$ ⇒ $m_{B} = 6 kg$.')],
    S('reakcija', { tip: 'klizaci', levo: { e: '🛒', m: 3, o: 'A: 3 kg' }, desno: { e: '🛒', m: 6, o: 'B: ?' } }));

  proveri(60 * (10 + 2), 720);
  Z(3, 'Čovek mase $60 kg$ stoji u liftu koji kreće naviše ubrzanjem $2 m/s^{2}$. Kolikom silom čovek pritiska pod lifta? ($g = 10 m/s^{2}$)',
    ['$720 N$', '$600 N$', '$480 N$', '$120 N$'],
    [K('Na čoveka deluju: sila teže $Q = 600 N$ naniže i sila poda $N$ naviše. Rezultanta daje ubrzanje naviše.'),
     K('$N − Q = m · a$ ⇒ $N = 600 N + 60 kg · 2 m/s^{2} = 720 N$.'),
     K('Po Trećem Njutnovom zakonu čovek pritiska pod istom silom: $720 N$ – vaga u liftu bi pokazala „$72 kg$“.')],
    S('dizanje', { visina: 6, e: '🧍', sile: true, F: 'N', Fg: 'Q' }));

  Z(1, 'Kutija pritiska sto silom od $50 N$ naniže. Kojom silom sto deluje na kutiju?',
    ['$50 N$ naviše', '$50 N$ naniže', '$0 N$', '$100 N$ naviše'],
    [K('Treći Njutnov zakon: sile kojima dva tela deluju jedno na drugo jednake su po jačini, a suprotnog smera.'),
     K('Sto deluje na kutiju silom $50 N$ naviše.')]);

  // ════════════════ 4. Brzina kod ravnomerno promenljivog kretanja ════════════════
  L('Brzina kod ravnomerno promenljivog kretanja');
  proveri(2 * 6, 12);
  Z(1, 'Telo kreće iz mirovanja sa stalnim ubrzanjem $2 m/s^{2}$. Kolika je njegova brzina posle $6 s$?',
    ['$12 m/s$', '$3 m/s$', '$36 m/s$', '$8 m/s$'],
    [K('Iz mirovanja: $v = a · t$.'),
     K('$v = 2 m/s^{2} · 6 s = 12 m/s$.')],
    S('kretanje', { tela: [{ e: '🛵', v: 0, a: 2 }], duzina: 40, podeok: 5, vektor: true, sat: true }));

  proveri(4 + 0.5 * 8, 8);
  Z(1, 'Biciklista vozi brzinom $4 m/s$, a zatim $8 s$ ubrzava ubrzanjem $0,5 m/s^{2}$. Kolika je njegova brzina na kraju?',
    ['$8 m/s$', '$4 m/s$', '$4,5 m/s$', '$12 m/s$'],
    [K('$v = v_{0} + a · t$.'),
     K('$v = 4 m/s + 0,5 m/s^{2} · 8 s = 4 m/s + 4 m/s = 8 m/s$.')],
    S('kretanje', { tela: [{ e: '🚴', v: 4, a: 0.5 }], duzina: 50, podeok: 10, vektor: true, sat: true }));

  proveri(20 / 4, 5);
  Z(1, 'Automobil vozi brzinom $20 m/s$ i počne da koči usporenjem $4 m/s^{2}$. Za koje vreme će se zaustaviti?',
    ['$5 s$', '$80 s$', '$0,2 s$', '$16 s$'],
    [K('Pri zaustavljanju je krajnja brzina $0$: $0 = v_{0} − a · t$.'),
     K('$t = {v_{0}|a} = {20 m/s|4 m/s^{2}} = 5 s$.'),
     K('Brzina po sekundama: $20 → 16 → 12 → 8 → 4 → 0$ m/s.', [], S('kretanje', { tela: [{ e: '🚗', v: 20, a: -4 }], duzina: 60, podeok: 10, vektor: true, sat: true, trag: 1, tragNatpis: true }))],
    S('kretanje', { tela: [{ e: '🚗', v: 20, a: -4 }], duzina: 60, podeok: 10, vektor: true, sat: false }));

  proveri((72 / 3.6 - 36 / 3.6) / 0.5, 20);
  Z(2, 'Motociklista vozi brzinom $36 km/h$ i počne da ubrzava ubrzanjem $0,5 m/s^{2}$. Posle koliko vremena će mu brzina biti $72 km/h$?',
    ['$20 s$', '$72 s$', '$10 s$', '$40 s$'],
    [K('U m/s: $36 km/h = 10 m/s$, $72 km/h = 20 m/s$.'),
     K('$v = v_{0} + a · t$ ⇒ $t = {v − v_{0}|a} = {20 m/s − 10 m/s|0,5 m/s^{2}} = 20 s$.')],
    S('kretanje', { tela: [{ e: '🏍️', v: 10, a: 0.5 }], duzina: 300, podeok: 50, vektor: true, tempo: 4 }));

  proveri(15 - 2 * 3, 9);
  Z(2, 'Kamion vozi brzinom $15 m/s$ i koči usporenjem $2 m/s^{2}$. Kolika je njegova brzina posle $3 s$ kočenja?',
    ['$9 m/s$', '$21 m/s$', '$6 m/s$', '$13 m/s$'],
    [K('Kod usporavanja: $v = v_{0} − a · t$.'),
     K('$v = 15 m/s − 2 m/s^{2} · 3 s = 15 m/s − 6 m/s = 9 m/s$.')],
    S('kretanje', { tela: [{ e: '🚚', v: 15, a: -2 }], duzina: 60, podeok: 10, vektor: true, sat: true }));

  proveri(54 / 3.6 / 10, 1.5);
  Z(2, 'Trolejbus krene sa stanice i za $10 s$ dostigne brzinu $54 km/h$. Koliko je njegovo ubrzanje?',
    ['$1,5 m/s^{2}$', '$5,4 m/s^{2}$', '$0,15 m/s^{2}$', '$15 m/s^{2}$'],
    [K('$54 km/h = {54|3,6} m/s = 15 m/s$.'),
     K('$a = {v|t} = {15 m/s|10 s} = 1,5 m/s^{2}$.')],
    S('kretanje', { tela: [{ e: '🚎', v: 0, a: 1.5 }], duzina: 80, podeok: 10, vektor: true, sat: true }));

  proveri((4.2 - 0.6) / 1.2, 3);
  Z(2, 'Kuglica se kotrlja niz žleb: početna brzina joj je $0,6 m/s$, a ubrzanje $1,2 m/s^{2}$. Posle koliko sekundi će njena brzina biti $4,2 m/s$?',
    ['$3 s$', '$3,5 s$', '$4 s$', '$0,5 s$'],
    [K('$t = {v − v_{0}|a}$.'),
     K('$t = {4,2 m/s − 0,6 m/s|1,2 m/s^{2}} = {3,6|1,2} s = 3 s$.'),
     K('$3,5 s$ bi se dobilo kad se zaboravi početna brzina ($4,2 : 1,2$).')],
    S('energija', { tip: 'staza' }));

  proveri(12 / 2, 6);
  Z(3, 'Automobil A kreće iz mirovanja sa ubrzanjem $2 m/s^{2}$ u trenutku kada pored njega prolazi automobil B stalnom brzinom $12 m/s$. Posle koliko sekundi će imati jednake brzine?',
    ['$6 s$', '$12 s$', '$24 s$', '$3 s$'],
    [K('Brzina automobila A raste: $v_{A} = 2 m/s^{2} · t$; brzina B je stalno $12 m/s$.'),
     K('$2 · t = 12$ ⇒ $t = 6 s$.', ['p']),
     K('Pazi: tada ga A još nije stigao – B je do tada prešao više puta (to se vidi kao površina ispod grafika).', ['pa', 'pb'])],
    S('kretanje', { tela: [{ e: '🚗', v: 0, a: 2, o: 'A' }, { e: '🚙', v: 12, o: 'B' }], duzina: 150, podeok: 25, vektor: true, sat: false }),
    { crtez: (() => { const g = grafik({ xmax: 10, ymax: 20, xk: 2, yk: 4 }); return G([g.e, g.linija([[0, 0], [10, 20]], { b: 0, o: 'A', oAt: [9.6, 21.5] }), g.linija([[0, 12], [10, 12]], { b: 1, o: 'B', oAt: [9.6, 13.6] }), g.proj(6, 12, { k: 2, id: 'p' }), g.tacka(6, 12, { k: 2, id: 'p' }), g.povrs([[0, 12], [6, 12]], { k: 3, id: 'pb', b: 1 }), g.povrs([[0, 0], [6, 12]], { k: 3, id: 'pa', b: 0 })], { velicina: 300 }); })() });

  proveri((25 - 0.5 * 30) * 3.6, 36);
  Z(3, 'Voz ide brzinom $25 m/s$ i počne da koči usporenjem $0,5 m/s^{2}$. Kolika je njegova brzina posle $30 s$, izražena u km/h?',
    ['$36 km/h$', '$10 km/h$', '$54 km/h$', '$18 km/h$'],
    [K('$v = v_{0} − a · t = 25 m/s − 0,5 m/s^{2} · 30 s = 25 m/s − 15 m/s = 10 m/s$.'),
     K('U km/h množimo sa $3,6$: $10 m/s = 36 km/h$.')],
    S('kretanje', { tela: [{ e: '🚆', v: 25, a: -0.5 }], duzina: 600, podeok: 100, vektor: true, tempo: 10 }));

  proveri((16 - 7) / (5 - 2), 3); proveri(7 - 3 * 2, 1);
  Z(3, 'Telo se kreće ravnomerno ubrzano. U trenutku $2 s$ ima brzinu $7 m/s$, a u trenutku $5 s$ brzinu $16 m/s$. Kolika je bila njegova početna brzina (u trenutku $0 s$)?',
    ['$1 m/s$', '$0 m/s$', '$3 m/s$', '$7 m/s$'],
    [K('Ubrzanje: $a = {16 m/s − 7 m/s|5 s − 2 s} = {9|3} m/s^{2} = 3 m/s^{2}$.', ['dt', 'dv']),
     K('Za $2 s$ pre trenutka $2 s$ brzina je bila manja za $2 s · 3 m/s^{2} = 6 m/s$.'),
     K('$v_{0} = 7 m/s − 6 m/s = 1 m/s$.', ['v0'])],
    null,
    { crtez: (() => { const g = grafik({ xmax: 6, ymax: 20, yk: 4 }); return G([g.e, g.linija([[2, 7], [5, 16]]), g.tacka(2, 7), g.tacka(5, 16), nagib(g, [2, 7], [5, 16], { kdt: 1, kdv: 1 }), g.linija([[0, 1], [2, 7]], { k: 3, id: 'v0', b: 3 }), g.tacka(0, 1, { k: 3, id: 'v0' })], { velicina: 300 }); })() });

  // ════════════════ 5. Grafik zavisnosti brzine od vremena ════════════════
  L('Grafik zavisnosti brzine od vremena');
  {
    const g = grafik({ xmax: 6, ymax: 15, yk: 3 });
    Z(1, 'Na grafiku je zavisnost brzine skejtera od vremena. Koliko je njegovo ubrzanje?',
      ['$3 m/s^{2}$', '$12 m/s^{2}$', '$4 m/s^{2}$', '$0,33 m/s^{2}$'],
      [K('Za $Δt = 4 s$ brzina poraste za $Δv = 12 m/s$.', ['dt', 'dv']),
       K('$a = {Δv|Δt} = {12 m/s|4 s} = 3 m/s^{2}$ – to je „strmina“ (nagib) prave.')],
      G([g.e, g.linija([[0, 0], [5, 15]], { crtaj: false }), g.proj(4, 12), nagib(g, [0, 0], [4, 12])], { velicina: 300 }));
  }
  {
    const g = grafik({ xmax: 6, ymax: 10, yk: 2 });
    Z(1, 'Brzina automobila u zavisnosti od vremena prikazana je grafikom. Kako se kreće automobil i koliko je njegovo ubrzanje?',
      ['Ravnomerno, $a = 0$', 'Ubrzano, $a = 8 m/s^{2}$', 'Miruje, $a = 0$', 'Ubrzano, $a = 1,6 m/s^{2}$'],
      [K('Linija je vodoravna: brzina je sve vreme $8 m/s$ – ne menja se.'),
       K('Kretanje je ravnomerno pravolinijsko, a ubrzanje $a = {Δv|Δt} = {0|5 s} = 0$.'),
       K('Površina ispod grafika je pređeni put: $8 m/s · 5 s = 40 m$.', ['pov'])],
      G([g.e, g.linija([[0, 8], [5, 8]], { crtaj: false }), g.povrs([[0, 8], [5, 8]], { k: 3, id: 'pov' })], { velicina: 300 }));
  }
  {
    const g = grafik({ xmax: 6, ymax: 25, yk: 5 });
    proveri(20 / 5, 4);
    Z(2, 'Grafik prikazuje brzinu automobila pri kočenju. Kolika je veličina usporenja?',
      ['$4 m/s^{2}$', '$20 m/s^{2}$', '$5 m/s^{2}$', '$0,25 m/s^{2}$'],
      [K('Brzina opadne sa $20 m/s$ na $0$ za $5 s$.', ['dt', 'dv']),
       K('$a = {0 − 20 m/s|5 s} = −4 m/s^{2}$: usporenje je $4 m/s^{2}$.'),
       K('Prava „pada“ – zato je ubrzanje negativno.')],
      G([g.e, g.linija([[0, 20], [5, 0]], { crtaj: false }), { lin: [g.P(0, 0), g.P(0, 20)], b: 1, debljina: 3, isp: 1, k: 1, id: 'dv' }, T('Δv = 20 m/s', 1.6, 2.4, { k: 1, id: 'dv', b: 1, vel: 13 }), { lin: [g.P(0, 0), g.P(5, 0)], b: 3, debljina: 4, k: 1, id: 'dt' }, T('Δt = 5 s', 3.4, 0.5, { k: 1, id: 'dt', b: 3, vel: 13 })], { velicina: 300 }));
  }
  {
    const g = grafik({ xmax: 6, ymax: 12, yk: 2 });
    proveri((10 / 2) / (10 / 5), 2.5);
    Z(2, 'Na grafiku su brzine dva tela, A i B. Koliko je puta ubrzanje tela B veće od ubrzanja tela A?',
      ['$2,5$ puta', '$2$ puta', '$5$ puta', '$0,4$ puta'],
      [K('Telo A: $a_{A} = {10 m/s|5 s} = 2 m/s^{2}$.', ['a']),
       K('Telo B: $a_{B} = {10 m/s|2 s} = 5 m/s^{2}$.', ['bb']),
       K('$a_{B} : a_{A} = 5 : 2 = 2,5$. Strmija prava – veće ubrzanje.')],
      G([g.e, g.linija([[0, 0], [5, 10]], { crtaj: false, b: 0, o: 'A', oAt: [5.3, 10.6] }), g.linija([[0, 0], [2, 10], [6, 10]], { crtaj: false, b: 1, o: 'B', oAt: [1.6, 11] }), g.proj(5, 10, { k: 1, id: 'a', b: 0 }), g.proj(2, 10, { k: 2, id: 'bb', b: 1 })], { velicina: 300 }));
  }
  {
    const g = grafik({ xmax: 10, ymax: 8, yk: 2, xk: 1 });
    proveri(6 / 2, 3);
    Z(2, 'Grafik prikazuje vožnju lifta: ubrzavanje, ravnomerno kretanje i usporavanje. Koliko je usporenje lifta na kraju vožnje?',
      ['$3 m/s^{2}$', '$2 m/s^{2}$', '$6 m/s^{2}$', '$1,5 m/s^{2}$'],
      [K('Od $3 s$ do $7 s$ brzina je stalna ($6 m/s$) – ravnomerno kretanje.'),
       K('Na kraju brzina padne sa $6 m/s$ na $0$ za $Δt = 9 s − 7 s = 2 s$.', ['dt', 'dv']),
       K('Usporenje: ${6 m/s|2 s} = 3 m/s^{2}$. (Na početku je ubrzanje bilo $6 : 3 = 2 m/s^{2}$.)')],
      G([g.e, g.linija([[0, 0], [3, 6], [7, 6], [9, 0]], { crtaj: false }), { lin: [g.P(7, 0), g.P(7, 6)], b: 1, debljina: 3, isp: 1, k: 2, id: 'dv' }, T('6 m/s', g.P(7, 3)[0] - 0.9, g.P(7, 3)[1], { k: 2, id: 'dv', b: 1, vel: 13 }), { lin: [g.P(7, 0), g.P(9, 0)], b: 3, debljina: 4, k: 2, id: 'dt' }, T('2 s', g.P(8, 0)[0], 0.45, { k: 2, id: 'dt', b: 3, vel: 13 })], { velicina: 300 }));
  }
  {
    const g = grafik({ xmax: 10, ymax: 8, yk: 2, xk: 1 });
    proveri((3 * 6) / 2 + 4 * 6 + (2 * 6) / 2, 9 + 24 + 6);
    Z(3, 'Grafik prikazuje vožnju lifta. Koliki put je lift prešao za celu vožnju (od $0$ do $9 s$)?',
      ['$39 m$', '$54 m$', '$24 m$', '$45 m$'],
      [K('Pređeni put jednak je površini ispod grafika $v(t)$. Delimo je na tri dela.'),
       K('Ubrzavanje (trougao): $s_{1} = {3 s · 6 m/s|2} = 9 m$.', ['p1']),
       K('Ravnomerno (pravougaonik): $s_{2} = 4 s · 6 m/s = 24 m$.', ['p2']),
       K('Usporavanje (trougao): $s_{3} = {2 s · 6 m/s|2} = 6 m$.', ['p3']),
       K('Ukupno: $s = 9 m + 24 m + 6 m = 39 m$ – lift je prošao oko $13$ spratova.')],
      G([g.e, g.povrs([[0, 0], [3, 6]], { k: 2, id: 'p1', b: 0 }), g.povrs([[3, 6], [7, 6]], { k: 3, id: 'p2', b: 2 }), g.povrs([[7, 6], [9, 0]], { k: 4, id: 'p3', b: 1 }), g.linija([[0, 0], [3, 6], [7, 6], [9, 0]], { crtaj: false }),
        g.tekst('9 m', 2.1, 2, { k: 2, id: 'p1' }), g.tekst('24 m', 5, 3, { k: 3, id: 'p2' }), g.tekst('6 m', 7.6, 2, { k: 4, id: 'p3' })], { velicina: 300 }));
  }
  {
    const g = grafik({ xmax: 7, ymax: 16, yk: 2 });
    proveri(2 + 2 * 3, 8);
    Z(2, 'Grafik prikazuje brzinu tela koje ravnomerno ubrzava. Kolika je brzina tela u trenutku $t = 3 s$?',
      ['$8 m/s$', '$6 m/s$', '$9 m/s$', '$7 m/s$'],
      [K('Početna brzina (presek sa osom $v$) je $2 m/s$, a za $6 s$ brzina naraste na $14 m/s$.', ['v0']),
       K('Ubrzanje: $a = {14 − 2|6} m/s^{2} = 2 m/s^{2}$.'),
       K('$v(3 s) = 2 m/s + 2 m/s^{2} · 3 s = 8 m/s$ – čita se i direktno sa grafika.', ['p'])],
      G([g.e, g.linija([[0, 2], [6, 14]], { crtaj: false }), g.tacka(0, 2, { k: 1, id: 'v0' }), g.tacka(6, 14, { k: 1, id: 'v0' }), g.proj(3, 8, { k: 3, id: 'p' }), g.tacka(3, 8, { k: 3, id: 'p' })], { velicina: 300 }));
  }
  {
    const g = grafik({ xmax: 9, ymax: 30, yk: 5, xk: 1 });
    proveri(4 + 3 * 8, 28);
    Z(3, 'Grafik prikazuje brzinu tela u prve $3 s$. Ako se telo i dalje kreće isto ovako, kolika će mu biti brzina u trenutku $t = 8 s$?',
      ['$28 m/s$', '$24 m/s$', '$32 m/s$', '$13 m/s$'],
      [K('Sa grafika: $v_{0} = 4 m/s$, a svake sekunde brzina poraste za $3 m/s$ (od $4$ do $13 m/s$ za $3 s$).', ['dt', 'dv']),
       K('$v = v_{0} + a · t = 4 m/s + 3 m/s^{2} · 8 s = 28 m/s$.'),
       K('Produžena prava prolazi kroz tačku $(8 s, 28 m/s)$.', ['dalje'])],
      G([g.e, g.linija([[0, 4], [3, 13]], { crtaj: false }), nagib(g, [0, 4], [3, 13], { kdt: 1, kdv: 1 }), { lin: [g.P(3, 13), g.P(8, 28)], b: 0, debljina: 3, isp: 1, k: 3, id: 'dalje' }, g.proj(8, 28, { k: 3, id: 'dalje' }), g.tacka(8, 28, { k: 3, id: 'dalje' })], { velicina: 300 }));
  }
  {
    const g = grafik({ xmax: 8, ymax: 16, yk: 2, xk: 1 });
    proveri(10 * 5 - (2 * 5 * 5) / 2, 25);
    Z(3, 'Automobil A kreće iz mirovanja sa ubrzanjem $2 m/s^{2}$ kada pored njega prođe automobil B stalnom brzinom $10 m/s$. Za koliko je B prešao više od A do trenutka kada su im brzine jednake?',
      ['$25 m$', '$50 m$', '$0 m$', '$10 m$'],
      [K('Brzine su jednake kada je $2 · t = 10$, tj. u $t = 5 s$.', ['p']),
       K('Put automobila B (pravougaonik): $10 m/s · 5 s = 50 m$.', ['pb']),
       K('Put automobila A (trougao): ${5 s · 10 m/s|2} = 25 m$.', ['pa']),
       K('Razlika: $50 m − 25 m = 25 m$ – to je beli trougao između pravih.')],
      G([g.e, g.povrs([[0, 10], [5, 10]], { k: 2, id: 'pb', b: 1 }), g.povrs([[0, 0], [5, 10]], { k: 3, id: 'pa', b: 0 }), g.linija([[0, 0], [8, 16]], { crtaj: false, b: 0, o: 'A', oAt: [7.6, 15.4] }), g.linija([[0, 10], [8, 10]], { crtaj: false, b: 1, o: 'B', oAt: [7.6, 11] }), g.proj(5, 10, { k: 1, id: 'p' })], { velicina: 300 }));
  }
  {
    const g = grafik({ xmax: 6, ymax: 12, yk: 2 });
    Z(1, 'Na grafiku su brzine tri tela: A, B i C. Koje telo usporava?',
      ['C', 'A', 'B', 'Nijedno'],
      [K('A: brzina raste – telo ubrzava.', ['a']),
       K('B: brzina je stalna – ravnomerno kretanje.', ['bb']),
       K('C: brzina opada od $10 m/s$ ka $2 m/s$ – telo usporava.', ['c'])],
      G([g.e, g.linija([[0, 2], [5, 10]], { crtaj: false, b: 0, o: 'A', oAt: [5.4, 10.4], id: 'a' }), g.linija([[0, 6], [5, 6]], { crtaj: false, b: 2, o: 'B', oAt: [5.4, 6.4], id: 'bb' }), g.linija([[0, 10], [5, 2]], { crtaj: false, b: 1, o: 'C', oAt: [5.4, 2.4], id: 'c' })], { velicina: 300 }));
  }

  // ════════════════ 6. Pređeni put kod ravnomerno promenljivog kretanja ════════════════
  L('Pređeni put kod ravnomerno promenljivog kretanja');
  proveri((2 * 25) / 2, 25);
  Z(1, 'Telo kreće iz mirovanja sa ubrzanjem $2 m/s^{2}$. Koliki put pređe za $5 s$?',
    ['$25 m$', '$10 m$', '$50 m$', '$5 m$'],
    [K('Iz mirovanja: $s = {a · t^{2}|2}$.'),
     K('$s = {2 m/s^{2} · (5 s)^{2}|2} = {2 · 25|2} m = 25 m$.'),
     K('Tragovi na svake sekunde pokazuju da se rastojanja povećavaju: $1, 3, 5, 7, 9$ m – zbir je $25 m$.', [], S('kretanje', { tela: [{ e: '🛴', v: 0, a: 2 }], duzina: 30, podeok: 5, sat: true, trag: 1, tragNatpis: true }))],
    S('kretanje', { tela: [{ e: '🛴', v: 0, a: 2 }], duzina: 30, podeok: 5, natpisi: 99, vektor: true, sat: false }));

  proveri(((10 + 20) / 2) * 4, 60);
  {
    const g = grafik({ xmax: 5, ymax: 25, yk: 5 });
    Z(1, 'Automobil za $4 s$ ravnomerno ubrza sa $10 m/s$ na $20 m/s$. Koliki put pređe za to vreme?',
      ['$60 m$', '$80 m$', '$120 m$', '$40 m$'],
      [K('Srednja brzina kod ravnomerno promenljivog kretanja: $v_{sr} = {v_{0} + v|2} = {10 + 20|2} m/s = 15 m/s$.', ['sr']),
       K('$s = v_{sr} · t = 15 m/s · 4 s = 60 m$ – to je površina trapeza ispod grafika.', ['pov'])],
      S('kretanje', { tela: [{ e: '🚗', v: 10, a: 2.5 }], duzina: 70, podeok: 10, natpisi: 99, vektor: true, sat: false }),
      { crtez: G([g.e, g.povrs([[0, 10], [4, 20]], { k: 2, id: 'pov' }), g.linija([[0, 10], [4, 20]]), { lin: [g.P(0, 15), g.P(4, 15)], b: 3, debljina: 2.5, isp: 1, k: 1, id: 'sr' }, T('~srednja: 15', g.P(4, 15)[0] + 1.1, g.P(4, 15)[1], { k: 1, id: 'sr', b: 3, vel: 13 }), g.tekst('60 m', 2, 6, { k: 2, id: 'pov' })], { velicina: 300 }) });
  }

  proveri((20 / 2) * 5, 50);
  Z(2, 'Automobil vozi brzinom $20 m/s$ i ravnomerno koči $5 s$, do zaustavljanja. Koliki je zaustavni put?',
    ['$50 m$', '$100 m$', '$4 m$', '$25 m$'],
    [K('Srednja brzina pri kočenju: $v_{sr} = {20 m/s + 0|2} = 10 m/s$.'),
     K('$s = v_{sr} · t = 10 m/s · 5 s = 50 m$.'),
     K('$100 m$ bi prešao da je sve vreme vozio $20 m/s$.', [], S('kretanje', { tela: [{ e: '🚗', v: 20, a: -4 }], duzina: 60, podeok: 10, vektor: true, sat: true, trag: 1 }))],
    S('kretanje', { tela: [{ e: '🚗', v: 20, a: -4 }], duzina: 60, podeok: 10, natpisi: 99, vektor: true, sat: false }));

  proveri((2 * 18) / 9, 4);
  Z(2, 'Telo iz mirovanja pređe $18 m$ za $3 s$ krećući se ravnomerno ubrzano. Koliko je ubrzanje?',
    ['$4 m/s^{2}$', '$6 m/s^{2}$', '$2 m/s^{2}$', '$12 m/s^{2}$'],
    [K('Iz $s = {a · t^{2}|2}$ sledi $a = {2s|t^{2}}$.'),
     K('$a = {2 · 18 m|(3 s)^{2}} = {36|9} m/s^{2} = 4 m/s^{2}$.'),
     K('$6 m/s^{2}$ je zamka: to je $18 : 3$ (srednja brzina u m/s, ne ubrzanje).')],
    S('kretanje', { tela: [{ e: '🛷', v: 0, a: 4 }], duzina: 20, podeok: 2, vektor: true }));

  {
    proveri((2 * 9) / 2 - (2 * 4) / 2, 5);
    const g = grafik({ xmax: 4, ymax: 8, yk: 2 });
    Z(3, 'Telo kreće iz mirovanja sa ubrzanjem $2 m/s^{2}$. Koliki put pređe samo tokom treće sekunde kretanja?',
      ['$5 m$', '$9 m$', '$6 m$', '$4 m$'],
      [K('Za prve $3 s$: $s_{3} = {2 · 3^{2}|2} m = 9 m$.', ['s3']),
       K('Za prve $2 s$: $s_{2} = {2 · 2^{2}|2} m = 4 m$.', ['s2']),
       K('U trećoj sekundi (od $2 s$ do $3 s$): $9 m − 4 m = 5 m$ – površina trapeza između $t = 2 s$ i $t = 3 s$.', ['treca'])],
      S('kretanje', { tela: [{ e: '🛴', v: 0, a: 2 }], duzina: 10, podeok: 1, natpisi: 99, vektor: true, sat: false }),
      { crtez: G([g.e, g.povrs([[0, 0], [3, 6]], { k: 1, id: 's3', b: 0 }), g.povrs([[0, 0], [2, 4]], { k: 2, id: 's2', b: 1 }), g.povrs([[2, 4], [3, 6]], { k: 3, id: 'treca', b: 2, gusto: 1 }), g.linija([[0, 0], [4, 8]])], { velicina: 300 }) });
  }

  proveri(2 * 9, 18);
  Z(3, 'Telo koje kreće iz mirovanja i ravnomerno ubrzava pređe u prvoj sekundi $2 m$. Koliki put pređe za prve $3 s$?',
    ['$18 m$', '$6 m$', '$10 m$', '$12 m$'],
    [K('Iz mirovanja $s = {a t^{2}|2}$: put raste sa kvadratom vremena.'),
     K('Za $3$ puta duže vreme put je $3^{2} = 9$ puta veći: $s = 9 · 2 m = 18 m$.'),
     K('Po sekundama: $2 m$, $6 m$, $10 m$ (odnos $1 : 3 : 5$) – zbir $18 m$.')],
    S('kretanje', { tela: [{ v: 0, a: 4, b: 3 }], duzina: 20, podeok: 2, natpisi: 99, sat: true, trag: 1 }));

  proveri((60 / 2) * 30, 900);
  Z(2, 'Avion pri poletanju iz mirovanja ravnomerno ubrzava i za $30 s$ dostigne brzinu $60 m/s$. Kolika najmanje mora biti dužina piste?',
    ['$900 m$', '$1 800 m$', '$450 m$', '$2 km$'],
    [K('Srednja brzina: $v_{sr} = {0 + 60 m/s|2} = 30 m/s$.'),
     K('$s = 30 m/s · 30 s = 900 m$.')],
    S('kretanje', { tela: [{ e: '✈️', v: 0, a: 2 }], duzina: 1000, podeok: 100, natpisi: 99, tempo: 6, vektor: true, sat: false }));

  proveri(16 / ((6 + 2) / 2), 4);
  Z(2, 'Biciklista na putu od $16 m$ ravnomerno uspori sa $6 m/s$ na $2 m/s$. Koliko je trajalo usporavanje?',
    ['$4 s$', '$2 s$', '$8 s$', '$2,7 s$'],
    [K('Srednja brzina: $v_{sr} = {6 m/s + 2 m/s|2} = 4 m/s$.'),
     K('$t = {s|v_{sr}} = {16 m|4 m/s} = 4 s$.')],
    S('kretanje', { tela: [{ e: '🚴', v: 6, a: -1 }], duzina: 20, podeok: 2, vektor: true, trajanje: 4.3, sat: false }));

  proveri(10 * (72 / 36) ** 2, 40);
  Z(3, 'Pri brzini $36 km/h$ automobil ima zaustavni put $10 m$. Koliki će biti zaustavni put pri brzini $72 km/h$ (isto usporenje)?',
    ['$40 m$', '$20 m$', '$10 m$', '$80 m$'],
    [K('Pri zaustavljanju $v^{2} = 2 · a · s$, pa je zaustavni put $s = {v^{2}|2a}$ – srazmeran kvadratu brzine.'),
     K('Brzina je $2$ puta veća ⇒ put je $2^{2} = 4$ puta veći: $4 · 10 m = 40 m$.'),
     K('Zato je brza vožnja opasna: dvostruko brže – četiri puta duže kočenje!')],
    S('kretanje', { tela: [{ e: '🚗', v: 10, a: -5, o: '36 km/h' }, { e: '🚗', v: 20, a: -5, o: '72 km/h' }], duzina: 45, podeok: 5, natpisi: 99, vektor: true, sat: false }));

  proveri(Math.sqrt(2 * 3 * 24), 12);
  Z(3, 'Skijaš kreće iz mirovanja niz padinu sa ubrzanjem $3 m/s^{2}$. Kolika mu je brzina pošto pređe $24 m$?',
    ['$12 m/s$', '$72 m/s$', '$8 m/s$', '$144 m/s$'],
    [K('Veza brzine i puta: $v^{2} = v_{0}^{2} + 2 · a · s$, a $v_{0} = 0$.'),
     K('$v^{2} = 2 · 3 m/s^{2} · 24 m = 144 m^{2}/s^{2}$.'),
     K('$v = √{144} m/s = 12 m/s$ (zamka: $144$ je $v^{2}$, ne $v$).')],
    S('kretanje', { tela: [{ e: '⛷️', v: 0, a: 3 }], duzina: 25, podeok: 5, vektor: true }));
};
