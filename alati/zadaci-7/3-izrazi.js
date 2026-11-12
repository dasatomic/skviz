// Tema 3: Celi algebarski izrazi (lekcije 3.1–3.7)
module.exports = ({ L, Z, K, G, r, proveri, kocke }) => {
  // površinski model množenja: kolone = [['x', 3], ['3', 1.2]] (natpis, širina), redovi = [['x', 3], …] (odozgo nadole),
  // natpisi[i][j] = sadržaj polja (red i, kolona j); polja imaju id „c<i><j>“
  // kNatpisi / kStrane: od kog koraka se vide natpisi u poljima / na stranama (da crtež u pitanju ne oda odgovor)
  const model = (kolone, redovi, natpisi, { boje, k, kNatpisi = 0, kStrane = 0 } = {}) => {
    const e = [];
    const W = kolone.reduce((a, c) => a + c[1], 0), H = redovi.reduce((a, c) => a + c[1], 0);
    let y = H;
    redovi.forEach(([rn, h], i) => {
      let x = 0;
      kolone.forEach(([kn, w], j) => {
        const el = { lin: [[x, y], [x + w, y], [x + w, y - h], [x, y - h]], zatv: 1, b: boje ? boje[i][j] : (i + j) % 2 ? 2 : i ? 1 : 0, id: `c${i}${j}` };
        if (k && k[i] && k[i][j]) el.k = k[i][j];
        e.push(el, { tx: natpisi[i][j], at: [x + w / 2, y - h / 2 - 0.1], k: Math.max(el.k || 0, kNatpisi) });
        if (i === 0) e.push({ tx: kn, at: [x + w / 2, H + 0.35], k: kStrane });
        x += w;
      });
      e.push({ tx: rn, at: [-0.45, y - h / 2 - 0.1], k: kStrane });
      y -= h;
    });
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 260 });
  };
  // ciklus (poslednje cifre, period) po krugu
  const ciklus = (vrednosti, istaknuto) => {
    const e = [{ kr: 'O', r: 3, b: 4 }];
    vrednosti.forEach((c, i) => {
      const u = 90 - (i * 360) / vrednosti.length;
      e.push({ tx: String(c), at: [r(3 * Math.cos((u * Math.PI) / 180)), r(3 * Math.sin((u * Math.PI) / 180) - 0.15)], ...(i === istaknuto ? { b: 1, k: 3 } : {}) });
    });
    e.push({ l: 'O', r: 2, od: 30, do: 150, b: 3, str: -1, pun: 1 });
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 200 });
  };

  // ════════════════ 3.1 Stepenovanje prirodnim brojem ════════════════
  L('Stepenovanje prirodnim brojem');

  Z(1, 'Koliko je $2⁵$?',
    ['$32$', '$10$', '$25$', '$16$'],
    [K('Stepen $2⁵$ je proizvod pet činilaca jednakih $2$: $2 · 2 · 2 · 2 · 2$.'),
     K('$2 · 2 = 4$, $4 · 2 = 8$, $8 · 2 = 16$, $16 · 2 = 32$.'),
     K('Česte greške: $2 · 5 = 10$ (množenje osnove i izložioca) i $5² = 25$ (zamena mesta).')]);

  Z(1, 'Kolika je zapremina kocke ivice $4 cm$?',
    ['$64 cm³$', '$12 cm³$', '$16 cm³$', '$48 cm³$'],
    [K('Zapremina kocke je $V = a³ = a · a · a$.'),
     K('$V = 4³ = 4 · 4 · 4 = 64 cm³$'),
     K('Na slici: kocka se sastoji od $4$ sloja sa po $4 · 4 = 16$ kockica, tj. $64$ kockice od $1 cm³$. Zato se $a³$ čita „$a$ na kub“.')],
    kocke(4));

  Z(1, 'Koliko je $0,1³$?',
    ['$0,001$', '$0,3$', '$0,01$', '$0,0001$'],
    [K('$0,1³ = 0,1 · 0,1 · 0,1$.'),
     K('$1 · 1 · 1 = 1$, a ukupno ima $1 + 1 + 1 = 3$ decimale: $0,001$.')]);

  Z(2, 'Koliko je $(−{1|2})³$?',
    ['$−{1|8}$', '${1|8}$', '$−{1|6}$', '$−{3|2}$'],
    [K('$(−{1|2})³ = (−{1|2}) · (−{1|2}) · (−{1|2})$.'),
     K('Tri negativna činioca daju negativan proizvod (neparan izložilac čuva znak).'),
     K('$−{1 · 1 · 1|2 · 2 · 2} = −{1|8}$')]);

  Z(2, 'Koliko je $(−1)^{2025} + (−1)^{2026}$?',
    ['$0$', '$−2$', '$2$', '$1$'],
    [K('Stepen broja $−1$ je $1$ kad je izložilac paran, a $−1$ kad je neparan.'),
     K('$2025$ je neparan: $(−1)^{2025} = −1$. $2026$ je paran: $(−1)^{2026} = 1$.'),
     K('$−1 + 1 = 0$')]);

  Z(2, 'Koliko je $3⁴ − 4³$?',
    ['$17$', '$0$', '$−17$', '$1$'],
    [K('$3⁴ = 3 · 3 · 3 · 3 = 81$'),
     K('$4³ = 4 · 4 · 4 = 64$'),
     K('$81 − 64 = 17$. Zamena osnove i izložioca menja rezultat!')]);

  Z(2, 'Jedna bakterija se deli na dve svakih $20$ minuta. Koliko bakterija nastane od jedne posle $3$ sata?',
    ['$512$', '$18$', '$256$', '$1024$'],
    [K('U $3$ sata ima $180 : 20 = 9$ deljenja.'),
     K('Posle svakog deljenja broj bakterija se udvostruči: $1 → 2 → 4 → 8 → …$ Posle $n$ deljenja ima ih $2ⁿ$.'),
     K('$2⁹ = 512$. (Za još jedan sat bilo bi ih $2^{12} = 4096$ – zato je stepen „eksplozivan“ rast.)')]);

  Z(3, 'Kojom cifrom se završava broj $7^{2026}$?',
    ['$9$', '$7$', '$3$', '$1$'],
    [K('Posmatramo poslednje cifre stepena broja $7$: $7¹ = 7$, $7² = 49$, $7³ = 343$, $7⁴ = 2401$, $7⁵ = 16807$…'),
     K('Poslednje cifre se ponavljaju u krug: $7, 9, 3, 1, 7, 9, 3, 1, …$ – period je $4$.'),
     K('$2026 = 4 · 506 + 2$, pa $7^{2026}$ ima istu poslednju cifru kao $7²$ – to je $9$.')],
    ciklus([7, 9, 3, 1], 1));

  Z(3, 'Kocka $4 × 4 × 4$ složena je od $64$ male kockice, pa je cela spolja obojena. Koliko malih kockica nema nijednu obojenu stranu?',
    ['$8$', '$27$', '$16$', '$0$'],
    [K('Neobojene su samo kockice koje nisu na površini – one čine unutrašnju kocku.'),
     K('Sa svake strane skinemo po jedan sloj: unutrašnja kocka ima ivicu $4 − 2 = 2$.'),
     K('$2³ = 8$ kockica. (Za kocku $n × n × n$: $(n − 2)³$.)', [], kocke(2, 2, 2, { boja: 4, istakni: 4 }))],
    kocke(4));

  Z(3, 'List papira debeo $0,1 mm$ presavijemo na pola $10$ puta. Kolika je debljina dobijenog „paketa“?',
    ['$102,4 mm$', '$1 mm$', '$2 mm$', '$10,24 mm$'],
    [K('Svakim savijanjem broj slojeva se udvostruči: posle $10$ savijanja ima $2^{10}$ slojeva.'),
     K('$2^{10} = 1024$ sloja.'),
     K('$1024 · 0,1 mm = 102,4 mm ≈ 10 cm$ – deblje od knjige! (Greška $1 mm$ je $10 · 0,1$ – sabiranje umesto udvostručavanja.)')]);

  // ════════════════ 3.2 Operacije sa stepenima ════════════════
  L('Operacije sa stepenima; stepen proizvoda i količnika');

  Z(1, 'Koliko je $a³ · a⁵$?',
    ['$a⁸$', '$a^{15}$', '$2a⁸$', '$a²$'],
    [K('$a³ · a⁵ = (a · a · a) · (a · a · a · a · a)$ – ukupno $3 + 5 = 8$ činilaca.'),
     K('Pri množenju stepena iste osnove izložioci se sabiraju: $aᵐ · aⁿ = a^{m + n}$, pa je $a³ · a⁵ = a⁸$.')]);

  Z(1, 'Koliko je $x^{12} : x⁴$ (za $x ≠ 0$)?',
    ['$x⁸$', '$x³$', '$x^{16}$', '$8x$'],
    [K('Pri deljenju stepena iste osnove izložioci se oduzimaju: $xᵐ : xⁿ = x^{m − n}$.'),
     K('$x^{12} : x⁴ = x^{12 − 4} = x⁸$ (četiri činioca $x$ se skrate).')]);

  Z(1, 'Ivica kocke se udvostruči. Koliko puta se poveća njena zapremina?',
    ['$8$ puta', '$2$ puta', '$4$ puta', '$6$ puta'],
    [K('Nova zapremina: $(2a)³ = 2³ · a³ = 8a³$ – stepen proizvoda je proizvod stepena.'),
     K('Na slici: u kocku dvostruke ivice staje $2 · 2 · 2 = 8$ prvobitnih kocki.')],
    kocke(2));

  Z(2, 'Koliko je $(2a²b)³$?',
    ['$8a⁶b³$', '$6a⁶b³$', '$8a⁵b³$', '$2a⁶b³$'],
    [K('Stepenujemo svaki činilac: $(2a²b)³ = 2³ · (a²)³ · b³$.'),
     K('$2³ = 8$; $(a²)³ = a^{2 · 3} = a⁶$ (stepen stepena – izložioci se množe).'),
     K('$(2a²b)³ = 8a⁶b³$. Greška $6$ nastaje kad se $2$ pomnoži sa $3$ umesto da se stepenuje.')]);

  Z(2, 'Koliko je ${2^{10} · 2⁵|2^{12}}$?',
    ['$8$', '$2$', '$4$', '$64$'],
    [K('Brojilac: $2^{10} · 2⁵ = 2^{15}$.'),
     K('$2^{15} : 2^{12} = 2³ = 8$')]);

  Z(2, 'Koliko je $5⁷ · 2⁷$?',
    ['$10⁷$', '$10^{14}$', '$7^{10}$', '$10^{49}$'],
    [K('Isti izložilac: $aⁿ · bⁿ = (a · b)ⁿ$.'),
     K('$5⁷ · 2⁷ = (5 · 2)⁷ = 10⁷ = 10 000 000$')]);

  Z(2, 'Koliko je $({3|4})² · ({4|3})³$?',
    ['${4|3}$', '${3|4}$', '$1$', '${16|9}$'],
    [K('Rastavimo $({4|3})³ = ({4|3})² · {4|3}$.'),
     K('$({3|4})² · ({4|3})² = ({3|4} · {4|3})² = 1² = 1$'),
     K('Ostaje $1 · {4|3} = {4|3}$.')]);

  Z(3, 'Koji je broj veći: $2^{30}$ ili $3^{20}$?',
    ['$3^{20}$', '$2^{30}$', 'jednaki su', 'ne može se odrediti bez računara'],
    [K('Svedemo na isti izložilac $10$: $2^{30} = (2³)^{10} = 8^{10}$.'),
     K('$3^{20} = (3²)^{10} = 9^{10}$.'),
     K('$9 > 8$, pa je $9^{10} > 8^{10}$, tj. $3^{20} > 2^{30}$.')]);

  Z(3, 'Koliko je ${4⁵ · 8³|16⁴}$?',
    ['$8$', '$2$', '$16$', '$4$'],
    [K('Sve osnove napišemo kao stepene broja $2$: $4 = 2²$, $8 = 2³$, $16 = 2⁴$.'),
     K('$4⁵ = 2^{10}$, $8³ = 2⁹$, $16⁴ = 2^{16}$.'),
     K('${2^{10} · 2⁹|2^{16}} = 2^{10 + 9 − 16} = 2³ = 8$')]);

  Z(3, 'Koliko je polovina broja $2^{100}$?',
    ['$2^{99}$', '$2^{50}$', '$1^{100}$', '$1^{50}$'],
    [K('Polovina je deljenje sa $2 = 2¹$.'),
     K('$2^{100} : 2¹ = 2^{99}$'),
     K('$2^{50}$ je mnogo manji – to je koren broja $2^{100}$, a ne polovina. Polovina od $2^{100}$ je i dalje ogroman broj!')]);

  // ════════════════ 3.3 Stepenovanje dekadne jedinice celim brojem ════════════════
  L('Stepenovanje dekadne jedinice celim brojem');

  Z(1, 'Koliko je $10^{−3}$?',
    ['$0,001$', '$−1000$', '$0,0001$', '$−30$'],
    [K('Negativan izložilac znači recipročnu vrednost: $10^{−3} = {1|10³}$.'),
     K('${1|1000} = 0,001$ – jedinica je na trećem decimalnom mestu.')]);

  Z(1, 'Koliko je $3,2 · 10⁴$?',
    ['$32 000$', '$3200$', '$320 000$', '$0,00032$'],
    [K('Množenje sa $10⁴$ pomera decimalni zarez $4$ mesta udesno.'),
     K('$3,2 → 32 → 320 → 3200 → 32 000$')]);

  Z(1, 'Jedan nanometar je milijarditi deo metra. Kako se to zapisuje stepenom?',
    ['$1 nm = 10^{−9} m$', '$1 nm = 10⁹ m$', '$1 nm = 10^{−6} m$', '$1 nm = 10^{−12} m$'],
    [K('Milijarda je $1 000 000 000 = 10⁹$ (devet nula).'),
     K('Milijarditi deo: ${1|10⁹} = 10^{−9}$. Poređenja radi: $1 mm = 10^{−3} m$, $1 μm = 10^{−6} m$.')]);

  Z(2, 'Kako se u naučnom zapisu piše broj $0,00045$?',
    ['$4,5 · 10^{−4}$', '$45 · 10^{−5}$', '$4,5 · 10⁴$', '$4,5 · 10^{−5}$'],
    [K('Naučni zapis: $a · 10ⁿ$, gde je $1 ≤ a < 10$. Ovde je $a = 4,5$.'),
     K('Od $4,5$ do $0,00045$ zarez se pomera $4$ mesta ulevo, pa je $n = −4$.'),
     K('$0,00045 = 4,5 · 10^{−4}$. ($45 · 10^{−5}$ je ista vrednost, ali to nije naučni zapis jer je $45 > 10$.)')]);

  {
    // skala veličina u metrima (izložioci)
    const t = { O: [-9, 0] }, e = [{ osa: [-9, 12], podela: 1, svaki: 3, brojevi: 0 }];
    const sup = (n) => (n < 0 ? '⁻' : '') + [...String(Math.abs(n))].map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
    for (let n = -9; n <= 12; n += 3) e.push({ tx: '10' + sup(n), at: [n, -1.4] });
    const obj = [[-5.15, '~zrnce krvi', 1, 1], [0.24, '~čovek', 2, 0], [7.1, '~Zemlja', 3, 0], [11.18, '~do Sunca', 4, 0]];
    obj.forEach(([x, nat, b, k], i) => { t['p' + i] = [x, 0]; e.push({ tacka: 'p' + i, b, k, id: 'o' + i }, { tx: nat, at: [x, i % 2 ? -2.6 : 1.3], b, k }); });
    Z(2, 'Prečnik crvenog krvnog zrnca je oko $0,000007 m$. Kako se to zapisuje u naučnom zapisu?',
      ['$7 · 10^{−6} m$', '$7 · 10^{−5} m$', '$7 · 10⁶ m$', '$0,7 · 10^{−5} m$'],
      [K('Zarez treba pomeriti $6$ mesta udesno da bi se dobilo $7$: $0,000007 → 7$.'),
       K('Zato je $0,000007 = 7 · 10^{−6} m$ ($7$ mikrometara).', ['o0']),
       K('Na skali veličina (svaki podeok je deset puta više): zrnce, čovek ($≈ 1,7 m$), Zemlja ($≈ 1,3 · 10⁷ m$) i rastojanje do Sunca ($1,5 · 10^{11} m$).')],
      G(t, e, { bezImena: ['O'], velicina: 340 }));
  }

  Z(2, 'Rastojanje od Zemlje do Sunca je oko $150 000 000 km$. Kako se to piše u naučnom zapisu?',
    ['$1,5 · 10⁸ km$', '$15 · 10⁷ km$', '$1,5 · 10⁷ km$', '$1,5 · 10⁹ km$'],
    [K('$150 000 000$: posle cifara $15$ sledi $7$ nula, pa broj ima $9$ cifara.'),
     K('Zarez iz $1,5$ pomeramo $8$ mesta udesno: $1,5 · 10⁸ = 150 000 000$.')]);

  Z(2, 'Koliko je $10⁵ · 10^{−8}$?',
    ['$10^{−3}$', '$10^{−40}$', '$10^{13}$', '$10³$'],
    [K('Izložioci se sabiraju: $5 + (−8) = −3$.'),
     K('$10⁵ · 10^{−8} = 10^{−3} = 0,001$')]);

  Z(3, 'Koliko je $(4 · 10⁵) · (3 · 10^{−2})$ u naučnom zapisu?',
    ['$1,2 · 10⁴$', '$12 · 10³$', '$1,2 · 10³$', '$7 · 10³$'],
    [K('Grupišemo: $(4 · 3) · (10⁵ · 10^{−2}) = 12 · 10³$.'),
     K('$12$ nije između $1$ i $10$: $12 = 1,2 · 10¹$.'),
     K('$1,2 · 10¹ · 10³ = 1,2 · 10⁴ = 12 000$')]);

  Z(3, 'Koliko je ${6 · 10⁸|2 · 10^{−3}}$?',
    ['$3 · 10^{11}$', '$3 · 10⁵$', '$3 · 10^{−11}$', '$4 · 10^{11}$'],
    [K('$6 : 2 = 3$'),
     K('$10⁸ : 10^{−3} = 10^{8 − (−3)} = 10^{11}$ – deljenje negativnim izložiocem povećava izložilac.'),
     K('Rezultat: $3 · 10^{11}$.')]);

  Z(3, 'Svetlost prelazi $3 · 10⁵ km$ u sekundi. Rastojanje do Meseca je oko $3,84 · 10⁵ km$. Koliko svetlosti treba da stigne od Meseca do Zemlje?',
    ['oko $1,28 s$', 'oko $0,78 s$', 'oko $12,8 s$', 'oko $1,28 min$'],
    [K('Vreme = put : brzina $= {3,84 · 10⁵|3 · 10⁵} s$.'),
     K('Stepeni $10⁵$ se skrate: $3,84 : 3 = 1,28$.'),
     K('Svetlost sa Meseca stiže za oko $1,28 s$. (Sa Sunca joj treba oko $8$ minuta!)')]);

  // ════════════════ 3.4 Algebarski izrazi; brojevna vrednost ════════════════
  L('Algebarski izrazi; brojevna vrednost izraza');

  Z(1, 'Kolika je vrednost izraza $3x² − 2x$ za $x = −2$?',
    ['$16$', '$8$', '$−16$', '$40$'],
    [K('Zamenimo $x = −2$ (sa zagradama!): $3 · (−2)² − 2 · (−2)$.'),
     K('$(−2)² = 4$, pa je $3 · 4 = 12$; $−2 · (−2) = +4$.'),
     K('$12 + 4 = 16$')]);

  Z(1, 'Koji izraz predstavlja „zbir kvadrata brojeva $a$ i $b$“?',
    ['$a² + b²$', '$(a + b)²$', '$2a + 2b$', '$a²b²$'],
    [K('Prvo kvadriramo svaki broj ($a²$ i $b²$), pa ih saberemo: $a² + b²$.'),
     K('$(a + b)²$ je „kvadrat zbira“ – nešto drugo. Npr. za $a = 1$, $b = 2$: $1 + 4 = 5$, a $(1 + 2)² = 9$.')]);

  Z(1, 'Stranice pravougaonika su $a$ i $a + 3$ (u cm). Koji izraz predstavlja njegov obim?',
    ['$4a + 6$', '$2a + 3$', '$4a + 3$', '$a² + 3a$'],
    [K('$O = 2 · (a + (a + 3))$', ['pr']),
     K('$= 2 · (2a + 3) = 4a + 6$'),
     K('$a² + 3a$ je površina, a ne obim.')],
    G({ A: [0, 0], B: [5, 0], C: [5, 2], D: [0, 2] }, [{ p: 'ABCD', id: 'pr' }, { d: 'AB', o: 'a + 3' }, { d: 'BC', o: 'a' }], { bezImena: ['A', 'B', 'C', 'D'] }));

  Z(2, 'Figura je sastavljena od kvadrata stranice $x$ i pravougaonika sa stranicama $x$ i $3$. Koji izraz predstavlja njenu površinu?',
    ['$x² + 3x$', '$x² + 3$', '$4x + 3$', '$(x + 3)²$'],
    [K('Kvadrat: $x · x = x²$.', ['c00']),
     K('Pravougaonik: $x · 3 = 3x$.', ['c01']),
     K('Ukupno $x² + 3x$ – to je isto što i $x(x + 3)$, površina pravougaonika sa stranicama $x$ i $x + 3$.')],
    model([['x', 3], ['3', 2]], [['x', 3]], [['x²', '3x']], { kNatpisi: 1 }));

  Z(2, 'Kolika je vrednost izraza $(a − b)² − a² + b²$ za $a = 3$ i $b = −2$?',
    ['$20$', '$−4$', '$6$', '$30$'],
    [K('$a − b = 3 − (−2) = 5$, pa je $(a − b)² = 25$.'),
     K('$a² = 9$, $b² = (−2)² = 4$.'),
     K('$25 − 9 + 4 = 20$')]);

  {
    // nizovi kvadrata od šibica: 1, 2, 3 kvadrata
    const e = [];
    const sib = (x1, y1, x2, y2, k) => e.push({ lin: [[x1, y1], [x2, y2]], b: 3, debljina: 4, k });
    [[0, 1], [2.5, 2], [6, 3]].forEach(([x0, n]) => {
      for (let i = 0; i <= n; i++) sib(x0 + i, 0, x0 + i, 1);
      for (let i = 0; i < n; i++) { sib(x0 + i, 0, x0 + i + 1, 0); sib(x0 + i, 1, x0 + i + 1, 1); }
      e.push({ tx: String(3 * n + 1), at: [x0 + n / 2, -0.55] });
    });
    Z(2, 'Od šibica se slaže niz kvadrata u jednom redu (kao na slici). Koliko šibica treba za $20$ kvadrata?',
      ['$61$', '$80$', '$60$', '$81$'],
      [K('Prvi kvadrat traži $4$ šibice, a svaki sledeći još $3$ (dele jednu stranicu sa prethodnim).'),
       K('Za $n$ kvadrata: $4 + 3(n − 1) = 3n + 1$ šibica. Provera na slici: $4, 7, 10$ ✓'),
       K('Za $n = 20$: $3 · 20 + 1 = 61$. (Greška $80 = 4 · 20$ – zajedničke stranice se računaju dvaput.)')],
      G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 320 }));
  }

  Z(2, 'Vožnja taksijem košta $200$ dinara na početku i $85$ dinara po pređenom kilometru. Koliko košta vožnja od $12 km$?',
    ['$1220$ dinara', '$1020$ dinara', '$3420$ dinara', '$1185$ dinara'],
    [K('Cena za $x$ kilometara: $C = 200 + 85x$.'),
     K('$C = 200 + 85 · 12 = 200 + 1020 = 1220$ dinara.'),
     K('Greška $3420$: $(200 + 85) · 12$ – start se plaća samo jednom.')]);

  Z(3, 'Ako je $a + b = 7$ i $a · b = 10$, koliko je $a²b + ab²$?',
    ['$70$', '$17$', '$49$', '$490$'],
    [K('Izvučemo zajednički činilac $ab$: $a²b + ab² = ab(a + b)$.'),
     K('$ab(a + b) = 10 · 7 = 70$ – ne moramo ni da znamo koliki su $a$ i $b$ (inače $5$ i $2$).')]);

  Z(3, 'Koliko je $x + x² + x³ + … + x^{100}$ za $x = −1$?',
    ['$0$', '$100$', '$−100$', '$1$'],
    [K('Neparni stepeni broja $−1$ su $−1$, a parni su $1$.'),
     K('Sabirci su $−1 + 1 − 1 + 1 − … + 1$: ukupno $50$ parova $(−1 + 1) = 0$.'),
     K('Zbir je $0$.')]);

  Z(3, 'Zbir dvocifrenog broja i broja zapisanog istim ciframa obrnutim redom (npr. $47 + 74$) uvek je deljiv sa:',
    ['$11$', '$10$', '$9$', '$2$'],
    [K('Dvocifreni broj sa ciframa $a$ (desetice) i $b$ (jedinice) je $10a + b$; obrnuti je $10b + a$.'),
     K('Zbir: $10a + b + 10b + a = 11a + 11b = 11(a + b)$.'),
     K('Zbir je uvek deljiv sa $11$. Primer: $47 + 74 = 121 = 11 · 11$ ✓')]);

  // ════════════════ 3.5 Polinomi; operacije sa polinomima ════════════════
  L('Polinomi; operacije sa polinomima');

  Z(1, 'Sredi polinom $3x² − 5x + 2x² + 7x$.',
    ['$5x² + 2x$', '$7x²$', '$5x² − 12x$', '$5x⁴ + 2x²$'],
    [K('Grupišemo slične monome: $(3x² + 2x²) + (−5x + 7x)$.'),
     K('$5x² + 2x$. Pri sabiranju sličnih monoma izložilac se ne menja!')]);

  Z(1, 'Kog je stepena polinom $4x³ − x⁵ + 2$?',
    ['petog', 'trećeg', 'četvrtog', 'osmog'],
    [K('Stepen polinoma je najveći stepen nekog njegovog monoma (koji nije nula).'),
     K('Monomi su stepena $3$, $5$ i $0$; najveći je $5$ – polinom je petog stepena.')]);

  Z(1, 'Koliko je $(2a + 3) + (5a − 7)$?',
    ['$7a − 4$', '$7a + 10$', '$3a − 4$', '$7a + 4$'],
    [K('Zagrade sa znakom $+$ ispred samo izostavimo: $2a + 3 + 5a − 7$.'),
     K('$2a + 5a = 7a$, $3 − 7 = −4$, pa je zbir $7a − 4$.')]);

  Z(2, 'Koliko je $(3x² − 2x + 1) − (x² − 5x + 4)$?',
    ['$2x² + 3x − 3$', '$2x² − 7x − 3$', '$2x² + 3x + 5$', '$4x² − 7x + 5$'],
    [K('Minus ispred zagrade menja znak svakom članu u zagradi: $3x² − 2x + 1 − x² + 5x − 4$.'),
     K('$3x² − x² = 2x²$; $−2x + 5x = 3x$; $1 − 4 = −3$.'),
     K('Rezultat: $2x² + 3x − 3$.')]);

  Z(2, 'Koliko je $2a(3a + 4)$?',
    ['$6a² + 8a$', '$6a + 8$', '$5a² + 6a$', '$6a² + 4$'],
    [K('Monom množimo svakim članom zagrade: $2a · 3a + 2a · 4$.', ['c00', 'c01']),
     K('$2a · 3a = 6a²$, $2a · 4 = 8a$.'),
     K('$6a² + 8a$. Na slici: pravougaonik $2a × (3a + 4)$ se sastoji od dva dela.')],
    model([['3a', 3.6], ['4', 2]], [['2a', 2.4]], [['6a²', '8a']], { kNatpisi: 1 }));

  Z(2, 'Koliko je $(x + 3)(x + 5)$?',
    ['$x² + 8x + 15$', '$x² + 15$', '$x² + 8x + 8$', '$2x + 8$'],
    [K('Svaki član prvog binoma množimo svakim članom drugog: $x · x + x · 5 + 3 · x + 3 · 5$.', ['c00', 'c01', 'c10', 'c11']),
     K('$x² + 5x + 3x + 15 = x² + 8x + 15$'),
     K('Na slici: pravougaonik sa stranicama $x + 3$ i $x + 5$ se deli na četiri dela – zato je greška $x² + 15$ (zaboravljena dva srednja dela).')],
    model([['x', 3], ['5', 2]], [['x', 3], ['3', 1.4]], [['x²', '5x'], ['3x', '15']], { kNatpisi: 1 }));

  Z(2, 'Koliko je $(2x − 1)(x + 4)$?',
    ['$2x² + 7x − 4$', '$2x² − 4$', '$2x² + 9x − 4$', '$2x² + 7x + 4$'],
    [K('$2x · x + 2x · 4 − 1 · x − 1 · 4$'),
     K('$2x² + 8x − x − 4$'),
     K('$2x² + 7x − 4$')]);

  Z(3, 'Koliko je $(x² − 2x + 3)(x + 1)$?',
    ['$x³ − x² + x + 3$', '$x³ − 2x² + 3x + 1$', '$x³ − x² − x + 3$', '$x³ + x² + x + 3$'],
    [K('Svaki član trinoma množimo sa $x$, pa sa $1$: $x³ − 2x² + 3x$ i $x² − 2x + 3$.'),
     K('Saberemo: $x³ + (−2x² + x²) + (3x − 2x) + 3$.'),
     K('$x³ − x² + x + 3$. Provera za $x = 1$: $(1 − 2 + 3) · 2 = 4$ i $1 − 1 + 1 + 3 = 4$ ✓')]);

  Z(3, 'Pravougaonik ima stranice $x + 2$ i $x + 5$, a kvadrat stranicu $x + 3$. Za koliko je površina pravougaonika veća od površine kvadrata?',
    ['$x + 1$', '$1$', '$x² + 1$', '$2x + 1$'],
    [K('Pravougaonik: $(x + 2)(x + 5) = x² + 7x + 10$.'),
     K('Kvadrat: $(x + 3)(x + 3) = x² + 6x + 9$.'),
     K('Razlika: $x² + 7x + 10 − x² − 6x − 9 = x + 1$. Zanimljivo – razlika zavisi od $x$!')]);

  Z(3, 'Dati su polinomi $P = x² + 3x − 1$ i $Q = 2x² − x + 4$. Koliko je $2P − Q$?',
    ['$7x − 6$', '$4x² + 5x + 2$', '$7x + 2$', '$5x − 6$'],
    [K('$2P = 2x² + 6x − 2$'),
     K('$2P − Q = 2x² + 6x − 2 − 2x² + x − 4$'),
     K('$= 7x − 6$ (kvadrati se ponište).')]);

  // ════════════════ 3.6 Kvadrat binoma i razlika kvadrata ════════════════
  L('Kvadrat binoma i razlika kvadrata');

  Z(1, 'Koliko je $(x + 4)²$?',
    ['$x² + 8x + 16$', '$x² + 16$', '$x² + 4x + 16$', '$2x + 8$'],
    [K('$(a + b)² = a² + 2ab + b²$, pa je $(x + 4)² = x² + 2 · x · 4 + 4²$.'),
     K('$= x² + 8x + 16$', ['c01', 'c10']),
     K('Na slici: kvadrat stranice $x + 4$ čine kvadrat $x²$, dva pravougaonika po $4x$ i kvadrat $16$. Greška $x² + 16$ izostavlja pravougaonike.')],
    model([['x', 3], ['4', 1.8]], [['x', 3], ['4', 1.8]], [['x²', '4x'], ['4x', '16']], { boje: [[0, 2], [2, 1]], kNatpisi: 2 }));

  Z(1, 'Koliko je $(a − 3)²$?',
    ['$a² − 6a + 9$', '$a² − 9$', '$a² + 9$', '$a² − 6a − 9$'],
    [K('$(a − b)² = a² − 2ab + b²$.'),
     K('$(a − 3)² = a² − 2 · a · 3 + 3² = a² − 6a + 9$ (poslednji član je uvek pozitivan).')]);

  Z(1, 'Koliko je $(y − 5)(y + 5)$?',
    ['$y² − 25$', '$y² + 25$', '$y² − 10y + 25$', '$y² − 10$'],
    [K('Razlika kvadrata: $(a − b)(a + b) = a² − b²$.'),
     K('$(y − 5)(y + 5) = y² − 5² = y² − 25$. Srednji članovi $5y$ i $−5y$ se poništavaju.')]);

  Z(2, 'Izračunaj $51²$ pomoću kvadrata binoma.',
    ['$2601$', '$2501$', '$2551$', '$2611$'],
    [K('$51 = 50 + 1$, pa je $51² = (50 + 1)²$.'),
     K('$= 50² + 2 · 50 · 1 + 1² = 2500 + 100 + 1 = 2601$', ['c00', 'c01', 'c10', 'c11']),
     K('Greška $2501$ zaboravlja dvostruki proizvod $100$.')],
    model([['50', 4], ['1', 0.8]], [['50', 4], ['1', 0.8]], [['2500', '50'], ['50', '1']], { boje: [[0, 2], [2, 1]], kNatpisi: 2 }));

  Z(2, 'Izračunaj $49 · 51$ pomoću razlike kvadrata.',
    ['$2499$', '$2501$', '$2500$', '$2401$'],
    [K('$49 = 50 − 1$ i $51 = 50 + 1$.'),
     K('$(50 − 1)(50 + 1) = 50² − 1² = 2500 − 1 = 2499$')]);

  Z(2, 'Koliko je $(2x + 3y)²$?',
    ['$4x² + 12xy + 9y²$', '$4x² + 9y²$', '$2x² + 12xy + 3y²$', '$4x² + 6xy + 9y²$'],
    [K('$(2x)² = 4x²$, $(3y)² = 9y²$.'),
     K('Dvostruki proizvod: $2 · 2x · 3y = 12xy$.'),
     K('$(2x + 3y)² = 4x² + 12xy + 9y²$')]);

  Z(2, 'Koliko je $103² − 97²$?',
    ['$1200$', '$36$', '$600$', '$12$'],
    [K('Razlika kvadrata: $a² − b² = (a − b)(a + b)$.'),
     K('$(103 − 97)(103 + 97) = 6 · 200 = 1200$ – bez kvadriranja velikih brojeva!')]);

  Z(3, 'Ako je $a + b = 8$ i $ab = 15$, koliko je $a² + b²$?',
    ['$34$', '$64$', '$49$', '$30$'],
    [K('$(a + b)² = a² + 2ab + b²$, pa je $a² + b² = (a + b)² − 2ab$.'),
     K('$a² + b² = 8² − 2 · 15 = 64 − 30 = 34$'),
     K('Provera: $a = 3$, $b = 5$ daju $9 + 25 = 34$ ✓')]);

  Z(3, 'Koliko je $(x + 1)² − (x − 1)²$?',
    ['$4x$', '$2$', '$0$', '$2x²$'],
    [K('$(x + 1)² = x² + 2x + 1$, a $(x − 1)² = x² − 2x + 1$.'),
     K('Razlika: $x² + 2x + 1 − x² + 2x − 1 = 4x$.'),
     K('Brže, razlikom kvadrata: $((x + 1) − (x − 1))((x + 1) + (x − 1)) = 2 · 2x = 4x$.')]);

  {
    // razlika kvadrata: iz kvadrata 9 izrežemo kvadrat 4, a traku okrenemo uz ostatak
    const a = 9, b = 4;
    Z(2, 'Iz ugla kvadratne ploče stranice $9 dm$ izrezan je kvadrat stranice $4 dm$. Kolika je površina ostatka?',
      ['$65 dm²$', '$25 dm²$', '$77 dm²$', '$45 dm²$'],
      [K('Ostatak: $9² − 4² = 81 − 16 = 65 dm²$.', ['ost1', 'ost2']),
       K('Lepše, razlikom kvadrata: ostatak se razreže na dve trake. Gornja traka ($5 × 4$) se okrene i prisloni uz donju ($9 × 5$)…', ['ost2']),
       K('…i dobija se pravougaonik $(9 + 4) × (9 − 4) = 13 × 5 = 65 dm²$. To je slika formule $a² − b² = (a + b)(a − b)$.', ['nov'])],
      G({ A: [0, 0], B: [a, 0], C: [a, a], D: [0, a], e: [a - b, a - b], f: [a, a - b], g: [a - b, a], h: [0, a - b], q: [a + b, 0], s: [a + b, a - b], P: [a / 2, (a - 2 * b) / 2] },
        [{ p: 'ABCD', prazno: 1, isp: 1, b: 5 }, { p: 'efCg', b: 5, prazno: 1, isp: 1, o: '16' }, { p: 'ABfh', b: 0, id: 'ost1' }, { p: 'hegD', b: 1, id: 'ost2' }, { tx: '9 × 5', at: [a / 2, (a - b) / 2], k: 2 }, { tx: '5 × 4', at: [(a - b) / 2, a - b / 2], k: 2 },
         { d: 'AB', o: '9 dm' }, { d: 'fC', o: '4' },
         { p: 'hegD', b: 1, okreni: -90, oko: 'P', k: 2, gusto: 1 }, { p: 'Bqsf', b: 2, prazno: 1, id: 'nov', k: 3 }, { lin: [[0, -1.4], [a + b, -1.4]], b: 3, k: 3, o: '9 + 4 = 13', oAt: [(a + b) / 2, -2.1] }],
        { bezImena: ['A', 'B', 'C', 'D', 'P'], velicina: 300 }));
  }

  // ════════════════ 3.7 Rastavljanje polinoma na činioce ════════════════
  L('Rastavljanje polinoma na činioce');

  Z(1, 'Rastavi na činioce: $6x + 9$.',
    ['$3(2x + 3)$', '$6(x + 9)$', '$3(2x + 9)$', '$9(x + 1)$'],
    [K('Najveći zajednički činilac brojeva $6$ i $9$ je $3$.'),
     K('$6x + 9 = 3 · 2x + 3 · 3 = 3(2x + 3)$. Provera množenjem: $3 · 2x + 3 · 3$ ✓')]);

  Z(1, 'Rastavi na činioce: $x² − 49$.',
    ['$(x − 7)(x + 7)$', '$(x − 7)²$', '$(x − 49)(x + 1)$', '$x(x − 49)$'],
    [K('$49 = 7²$, pa je ovo razlika kvadrata: $x² − 7²$.'),
     K('$a² − b² = (a − b)(a + b)$, pa je $x² − 49 = (x − 7)(x + 7)$.')]);

  Z(1, 'Rastavi na činioce: $a² + 5a$.',
    ['$a(a + 5)$', '$5a(a + 1)$', '$a(a + 5a)$', '$(a + 5)²$'],
    [K('Oba člana sadrže $a$: $a² = a · a$ i $5a = 5 · a$.'),
     K('$a² + 5a = a(a + 5)$')]);

  Z(2, 'Rastavi na činioce: $x² + 10x + 25$.',
    ['$(x + 5)²$', '$(x + 25)(x + 1)$', '$x(x + 10) + 25$', '$(x − 5)(x + 5)$'],
    [K('Prvi član je $x²$, poslednji $25 = 5²$, a srednji $10x = 2 · x · 5$.', ['c01', 'c10']),
     K('To je razvijen kvadrat binoma: $x² + 2 · x · 5 + 5² = (x + 5)²$.'),
     K('Na slici: pločice $x²$, dve trake $5x$ i kvadrat $25$ slažu se tačno u kvadrat stranice $x + 5$.')],
    model([['x', 3], ['5', 2]], [['x', 3], ['5', 2]], [['x²', '5x'], ['5x', '25']], { boje: [[0, 2], [2, 1]], kStrane: 3 }));

  Z(2, 'Rastavi na činioce: $4a² − 9b²$.',
    ['$(2a − 3b)(2a + 3b)$', '$(4a − 9b)(a + b)$', '$(2a − 3b)²$', '$(4a − 3b)(a + 3b)$'],
    [K('$4a² = (2a)²$ i $9b² = (3b)²$ – razlika kvadrata.'),
     K('$(2a)² − (3b)² = (2a − 3b)(2a + 3b)$')]);

  Z(2, 'Rastavi na činioce: $3x² − 12$.',
    ['$3(x − 2)(x + 2)$', '$3(x² − 12)$', '$(3x − 2)(x + 6)$', '$3(x − 4)²$'],
    [K('Prvo izvučemo zajednički činilac $3$: $3(x² − 4)$.'),
     K('$x² − 4 = (x − 2)(x + 2)$ – razlika kvadrata.'),
     K('$3x² − 12 = 3(x − 2)(x + 2)$. Rastavljanje je potpuno tek kad se nijedan činilac ne može dalje rastaviti.')]);

  Z(2, 'Rastavi na činioce: $ax + ay + 2x + 2y$.',
    ['$(x + y)(a + 2)$', '$(a + x)(2 + y)$', '$a(x + y) + 2$', '$(x + 2)(a + y)$'],
    [K('Grupišemo: $a(x + y) + 2(x + y)$.', ['c00', 'c01', 'c10', 'c11']),
     K('Zajednički činilac je $(x + y)$: $(x + y)(a + 2)$.'),
     K('Slika: pravougaonik sa stranicama $a + 2$ i $x + y$ ima baš ova četiri dela.')],
    model([['x', 3], ['y', 2]], [['a', 2.6], ['2', 1.4]], [['ax', 'ay'], ['2x', '2y']], { kStrane: 2 }));

  Z(3, 'Za svaki ceo broj $n$, broj $n³ − n$ je deljiv sa:',
    ['$6$', '$4$', '$5$', '$9$'],
    [K('$n³ − n = n(n² − 1) = n(n − 1)(n + 1) = (n − 1) · n · (n + 1)$.'),
     K('To je proizvod tri uzastopna cela broja: bar jedan je paran, a tačno jedan je deljiv sa $3$.'),
     K('Zato je proizvod deljiv sa $2 · 3 = 6$. Primeri: $2³ − 2 = 6$, $3³ − 3 = 24$, $4³ − 4 = 60$ ✓ ($6$ nije deljivo sa $4$, $5$ ni $9$.)')]);

  Z(3, 'Koja su rešenja jednačine $x² − 6x = 0$?',
    ['$x = 0$ ili $x = 6$', 'samo $x = 6$', '$x = 6$ ili $x = −6$', '$x = √{6}$'],
    [K('Rastavimo levu stranu: $x(x − 6) = 0$.'),
     K('Proizvod je nula ako je bar jedan činilac nula: $x = 0$ ili $x − 6 = 0$.'),
     K('Rešenja: $x = 0$ i $x = 6$. (Deljenjem sa $x$ izgubili bismo rešenje $x = 0$!)')]);

  Z(3, 'Koliko je $2026² − 2025²$?',
    ['$4051$', '$1$', '$2026$', '$4050$'],
    [K('Razlika kvadrata: $(2026 − 2025)(2026 + 2025)$.'),
     K('$= 1 · 4051 = 4051$'),
     K('Uopšte, razlika kvadrata dva uzastopna broja jednaka je njihovom zbiru: $(n + 1)² − n² = 2n + 1$.')]);
};
