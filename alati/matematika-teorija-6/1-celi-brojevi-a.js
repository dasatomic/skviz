// Lekcije 1–4: skup celih brojeva i brojevna prava, suprotni brojevi i apsolutna vrednost,
// poređenje i sabiranje celih brojeva. Pitanja su sopstvenim rečima, po gradivu Matematike 6
// (Arhiknjiga); crteži su medij „geo“ (brojevna prava sa skokovima, termometar, zgrada sa liftom…).
module.exports = ({ L, Q, U, S, G, O, bez, r, skok, krug, termometar, proveri }) => {
  const g = (e, velicina = 320) => G(O, e, { ...bez, velicina });
  const M = (x) => (x < 0 ? '−' + Math.abs(x) : String(x)); // broj sa pravim minusom

  // brojevna prava od..do; tacke = [[vrednost, natpis, boja]]; brojevi: false → vidi se samo 0
  // (na dugoj pravoj, npr. od −240 do 20, sve visine se množe sa u = raspon/12, da natpisi ne padnu na osu)
  const jed = (od, doo) => Math.max(1, (doo - od) / 12);
  function bp(od, doo, tacke = [], { podela = 1, svaki, brojevi = true, e = [], velicina = 320 } = {}) {
    const u = jed(od, doo);
    const el = [{ osa: [od, doo], podela, ...(svaki ? { svaki } : {}), ...(brojevi ? {} : { brojevi: 0 }) }];
    if (!brojevi && od <= 0 && doo >= 0) el.push({ tx: '0', at: [0, r(-0.75 * u)] });
    for (const [v, natpis, b = 1, dod = {}] of tacke) {
      el.push({ tx: '●', at: [r(v), 0.02], b, ...dod });
      if (natpis) el.push({ tx: natpis, at: [r(v), r(0.6 * u)], b, vel: 17, ...dod });
    }
    // bez tačke O u t: granice crteža određuje sama prava (i kad ne sadrži nulu)
    return G({}, [...el, ...e], { velicina });
  }
  // rastojanje od nule (apsolutna vrednost) kao debela linija ispod ose
  const odNule = (v, { b = 2, o, k, y = -1.5, u = 1 } = {}) => ({ lin: [[0, r(y * u)], [v, r(y * u)]], b, debljina: 5, crtaj: 1, ...(o ? { o, oAt: [r(v / 2), r((y - 0.6) * u)] } : {}), ...(k !== undefined ? { k } : {}) });
  // skok na dugoj pravoj: visina i natpis srazmerni jedinici u
  const sk = (a, b, x = {}, u = 1) => {
    const h = (x.h ?? Math.min(1.6, 0.35 + Math.abs(b - a) * 0.25 / u)) * u;
    const s0 = skok(a, b, { ...x, h });
    if (s0.oAt) s0.oAt = [s0.oAt[0], r(h * (x.ispod ? -1 : 1) + (x.ispod ? -0.5 : 0.4) * u)];
    return s0;
  };
  // zgrada sa spratovima od..do (0 = prizemlje); istakni = { sprat: boja }
  function zgrada(od, doo, { istakni = {}, strelice = [], velicina = 220 } = {}) {
    const e = [];
    for (let s = od; s <= doo; s++) {
      const b = istakni[s] ?? (s < 0 ? 5 : 0);
      e.push({ lin: [[0, s], [3, s], [3, s + 0.9], [0, s + 0.9]], zatv: 1, b, id: s < 0 ? 'g' : s === 0 ? 'p' : 's', ...(istakni[s] !== undefined ? { gusto: 1 } : {}) });
      e.push({ tx: M(s), at: [-0.8, s + 0.3], vel: 16 });
    }
    e.push({ lin: [[-1.6, -0.05], [4.6, -0.05]], b: 2, debljina: 4 }); // površina zemlje
    for (const [a, b2, x = 3.6] of strelice) e.push({ lin: [[x, a + 0.45], [x, b2 + 0.45]], str: 1, b: 3, debljina: 3, crtaj: 1 });
    return g(e, velicina);
  }
  // termometri jedan do drugog: [[temperatura, natpis], …]
  function termometri(lista, { od = -20, doo = 20, korak = 10 } = {}) {
    const e = [];
    lista.forEach(([t, natpis], i) => {
      e.push(...termometar(t, { od, doo, korak, x: i * 3.6, b: t < 0 ? 0 : 1 }));
      if (natpis) e.push({ tx: natpis, at: [i * 3.6 + 0.4, od * 0.12 - 1.3], vel: 14 });
    });
    return g(e, lista.length > 1 ? 120 * lista.length : 150);
  }
  // skupovi N ⊂ N₀ ⊂ Z kao ugnežđeni krugovi, sa upisanim brojevima
  function skupovi({ n = [], n0 = [], z = [], b = {} } = {}) {
    const e = [
      krug(0, 0, 4.6, { b: 4, prazno: 1 }), krug(1.3, 0, 3.1, { b: 2, prazno: 1 }), krug(1.9, 0, 1.9, { b: 0, prazno: 1 }),
      { tx: 'ℤ', at: [-3.2, 3.4], vel: 22 }, { tx: 'ℕ₀', at: [-0.6, 2.4], vel: 20 }, { tx: 'ℕ', at: [1.9, 1.4], vel: 20 },
    ];
    const upis = (lista, x0, y0) => lista.forEach((v, i) => e.push({ tx: M(v), at: [r(x0 + (i % 2) * 1.1), r(y0 - Math.floor(i / 2) * 0.8)], vel: 16, ...(b[v] !== undefined ? { b: b[v] } : {}) }));
    upis(n, 1.4, 0.3); upis(n0, -1.0, 0.0); upis(z, -3.4, 1.0);
    return g(e, 260);
  }

  // ── provere ──
  proveri([-3, -2, -1, 0, 1, 2].length === 6, 'celi između −4 i 3');
  proveri(10 / (2 - -3) === 2, 'jedinična duž 2 cm');
  proveri([-2, -1, 0, 1, 2].length === 5, '|x| < 3');
  proveri(-3 + 6 === 3 && 5 + -4 === 1 && -5 + -3 === -8 && -47 + 12 === -35 && -134 + -87 === -221, 'zbirovi');
  proveri(-6 + 9 === 3 && -2 + 5 === 3, 'termometar i lift');
  proveri(-17 + 38 + -3 + 2 === 20, 'asocijativnost');
  proveri(1200 + 650 + -2100 === -250, 'novac');
  proveri([-3, -2, -1, 0].length === 4, '|x| ≤ 3 i x < 1');
  proveri([-4 + 9, 7 + -10, -1 + -2, -6 + 3].join() === '5,-3,-3,-3', 'uljez zbirova');

  // ══════════ 1. Skup celih brojeva i brojevna prava ══════════
  L('Skup celih brojeva i brojevna prava');
  Q(1, 'Kojim slovom se označava skup celih brojeva?',
    ['$Z$', '$N$', '$Q$', '$C$'],
    'Oznaka $Z$ dolazi od nemačke reči Zahlen, što znači „brojevi“. Skup celih brojeva sadrži prirodne brojeve, nulu i sve negativne cele brojeve.', 'skup',
    { mediji: bp(-5, 5) , medijiOdgovora: skupovi({ n: [1, 7], n0: [0], z: [-3, -8] }) });
  Q(1, 'Kom broju odgovara tačka $A$ na brojevnoj pravoj?',
    ['$−3$', '$3$', '$−2$', '$−4$'],
    'Tačka $A$ je tri jedinične duži levo od nule. Levo od nule su negativni brojevi, pa je to $−3$.', 'tačka',
    { mediji: bp(-5, 5, [[-3, 'A']], { brojevi: false, e: [{ tx: '1', at: [1, -0.75] }] }), medijiOdgovora: bp(-5, 5, [[-3, 'A']]) });
  Q(1, 'Koji broj je prethodnik broja $0$ u skupu celih brojeva?',
    ['$−1$', '$1$', '$0$', 'Nema prethodnika'],
    'U skupu $N_0$ nula nema prethodnika, ali u skupu $Z$ ga ima: to je $−1$. Svaki ceo broj ima i prethodnika i sledbenika.', 'prethodnik',
    { mediji: bp(-4, 4, [[0, '', 3]]), medijiOdgovora: bp(-4, 4, [[0, '', 3], [-1]], { e: [skok(0, -1, { o: '−1' })] }) });
  Q(1, 'Sa koje strane nule se na brojevnoj pravoj nalaze negativni brojevi?',
    ['Levo od nule', 'Desno od nule', 'Iznad nule', 'Sa obe strane nule'],
    'Pozitivni brojevi su desno, a negativni levo od koordinatnog početka $O$, koji odgovara nuli. Što je broj levlje, to je manji.', 'levo',
    { mediji: bp(-6, 6, [], { brojevi: false }), medijiOdgovora: bp(-6, 6, [], { e: [{ lin: [[-6, 0.3], [-0.2, 0.3]], b: 1, debljina: 6, crtaj: 1 }, { tx: '~negativni', at: [-3, 0.9], b: 1 }] }) });
  U(1, 'Koji broj je uljez – jedini ne pripada skupu prirodnih brojeva $N$?',
    ['$−4$', '$7$', '$1$', '$12$'],
    'Prirodni brojevi su $1, 2, 3, …$ – negativni brojevi nisu prirodni. Broj $−4$ jeste ceo broj, ali nije prirodan.',
    'Svaki prirodan broj je ceo, ali nije svaki ceo broj prirodan: $N ⊂ N_0 ⊂ Z$.', 'prirodan',
    { mediji: skupovi() });
  Q(1, 'Koliko stepeni pokazuje termometar?',
    ['$−5 °C$', '$5 °C$', '$−15 °C$', '$0 °C$'],
    'Stub termometra je ispod nule, na pola puta do $−10°$. Temperature ispod nule se pišu negativnim brojem.', 'termometar',
    { mediji: termometri([[-5]], { od: -15, doo: 15, korak: 5 }) });
  Q(2, 'Podzemna garaža je dva nivoa ispod prizemlja. Kojim brojem je označeno njeno dugme u liftu?',
    ['$−2$', '$2$', '$0$', '$−1$'],
    'Prizemlje je nula, spratovi iznad su pozitivni, a nivoi ispod zemlje negativni brojevi. Zgrada je kao uspravna brojevna prava.', 'garaža',
    { mediji: zgrada(-3, 3, { istakni: { 0: 3 } }), medijiOdgovora: zgrada(-3, 3, { istakni: { 0: 3, '-2': 1 }, strelice: [[0, -2]] }) });
  Q(2, 'Koliko celih brojeva ima između $−4$ i $3$ (bez njih samih)?',
    ['$6$', '$7$', '$8$', '$5$'],
    'To su $−3, −2, −1, 0, 1$ i $2$. Lako se zaboravi nula, ali i ona je ceo broj!', 'nula',
    { mediji: bp(-5, 4, [[-4, '', 4], [3, '', 4]]), medijiOdgovora: bp(-5, 4, [[-4, '', 4], [3, '', 4], [-3], [-2], [-1], [0, '', 3], [1], [2]]) });
  Q(2, 'Koji je najveći negativan ceo broj?',
    ['$−1$', '$0$', '$−100$', 'Ne postoji'],
    'Negativni brojevi su levo od nule, a najbliži nuli je $−1$. Nula nije negativna – ona nije ni pozitivna ni negativna.', 'negativan',
    { medijiOdgovora: bp(-5, 2, [[-1, '−1']], { e: [{ lin: [[-5, 0.3], [-0.2, 0.3]], b: 0, debljina: 6 }] }) });
  Q(2, 'Koji je najmanji ceo broj?',
    ['Ne postoji', '$−1$', '$0$', '$−1 000 000$'],
    'Svaki ceo broj ima prethodnika, pa za svaki broj postoji još manji. Zato skup $Z$ nema ni najmanji ni najveći element.', 'beskonačno',
    { mediji: bp(-6, 6, [], { e: [{ lin: [[-2, 0.5], [-6.5, 0.5]], str: 1, b: 1, debljina: 3, crtaj: 1, ponovi: 1 }, { tx: '…', at: [-7.2, 0.1], vel: 22 }] }) });
  Q(2, 'Koji broj je prethodnik broja $−7$?',
    ['$−8$', '$−6$', '$7$', '$−70$'],
    'Prethodnik je broj za jedan manji, dakle jedan korak ulevo. Kod negativnih brojeva to je broj sa većom cifrom: $−8$.', 'prethodnik',
    { mediji: bp(-10, -4, [[-7, '', 3]]), medijiOdgovora: bp(-10, -4, [[-7, '', 3], [-8, '', 1]], { e: [skok(-7, -8, { o: '−1' })] }) });
  S(2, 'Spoji situaciju sa celim brojem koji je opisuje.',
    [['$4°$ ispod nule', '$−4$'], ['Drugi sprat zgrade', '$2$'], ['Prvi podrum ispod prizemlja', '$−1$'], ['Prizemlje', '$0$'], ['Ronilac $30 m$ pod vodom', '$−30$']],
    'Negativni brojevi se u svakodnevnom životu koriste za temperaturu, spratove, dubine, dugove i gol-razliku.', 'sprat',
    { mediji: zgrada(-2, 2) });
  Q(2, 'Kako se označava skup negativnih celih brojeva?',
    ['$Z^{−}$', '$Z^{+}$', '$N_0$', '$N$'],
    'Skup $Z^{−} = \\{−1, −2, −3, …\\}$, a $Z^{+} = \\{1, 2, 3, …\\}$ je isto što i $N$. Nula ne pripada nijednom od njih.', 'negativan',
    { mediji: bp(-5, 5, [], { e: [{ lin: [[-5, 0.35], [-1, 0.35]], b: 0, debljina: 6 }, { lin: [[1, 0.35], [5, 0.35]], b: 1, debljina: 6 }] }) });
  Q(3, 'Tačkama $C$ i $D$ na brojevnoj pravoj odgovaraju brojevi $−3$ i $2$, a duž $CD$ je dugačka $10 cm$. Kolika je jedinična duž?',
    ['$2 cm$', '$10 cm$', '$5 cm$', '$1 cm$'],
    'Od $−3$ do $2$ ima $5$ jediničnih duži ($3$ do nule i još $2$). Kad $10 cm$ podelimo na $5$ delova, dobijamo $2 cm$.', 'duž',
    { mediji: bp(-4, 3, [[-3, 'C'], [2, 'D']], { brojevi: false, e: [{ lin: [[-3, -1.0], [2, -1.0]], b: 3, debljina: 3, o: '10 cm', oAt: [-0.5, -1.5] }] }) });
  Q(3, 'Koji je sledbenik najvećeg celog broja koji nije prirodan?',
    ['$1$', '$0$', '$−1$', '$2$'],
    'Celi brojevi koji nisu prirodni su $0, −1, −2, …$ – najveći među njima je $0$, a njegov sledbenik je $1$.', 'sledbenik',
    { medijiOdgovora: bp(-4, 3, [[0, '', 3], [1]], { e: [skok(0, 1, { o: '+1' })] }) });
  Q(3, 'Napisano je šest uzastopnih celih brojeva, od kojih su tačno tri negativna. Koji je najveći od njih?',
    ['$2$', '$3$', '$0$', '$1$'],
    'To su $−3, −2, −1, 0, 1, 2$. Nula nije negativna, pa posle tri negativna dolaze još tri broja: $0, 1$ i $2$.', 'uzastopni',
    { medijiOdgovora: bp(-5, 4, [[-3, '', 0], [-2, '', 0], [-1, '', 0], [0, '', 3], [1], [2]]) });
  Q(3, 'Koja godina je došla neposredno pre 1. godine nove ere?',
    ['1. godina pre n. e.', 'Nulta godina', '2. godina pre n. e.', '10. godina pre n. e.'],
    'U kalendaru nema nulte godine! Posle 1. godine pre nove ere odmah dolazi 1. godina nove ere – zato se godine p. n. e. ne poklapaju potpuno sa negativnim brojevima.', 'kalendar',
    { medijiOdgovora: g([{ lin: [[-3, 0], [3.2, 0]], b: 4, debljina: 2, str: 1 },
      ...[[-2, '~2. p. n. e.', 4], [-1, '~1. p. n. e.', 1], [1, '~1. n. e.', 1], [2, '~2. n. e.', 4]].flatMap(([x, t, b]) => [{ lin: [[x, -0.15], [x, 0.15]], b: 4, debljina: 2 }, { tx: t, at: [x, x % 2 ? -0.7 : -1.2], vel: 13, b }]),
      skok(-1, 1, { o: '~nema nulte godine', h: 1 })]) });

  // ══════════ 2. Suprotni brojevi i apsolutna vrednost broja ══════════
  L('Suprotni brojevi i apsolutna vrednost broja');
  Q(1, 'Koji broj je suprotan broju $7$?',
    ['$−7$', '$7$', '${1|7}$', '$0$'],
    'Suprotni brojevi su na istom rastojanju od nule, ali sa različitih strana. Zato su $7$ i $−7$ par suprotnih brojeva.', 'suprotan',
    { mediji: bp(-8, 8, [[7, '7']], { svaki: 2 }), medijiOdgovora: bp(-8, 8, [[7, '7'], [-7, '−7', 2]], { svaki: 2, e: [skok(7, -7, { h: 2, boja: 2 })] }) });
  Q(1, 'Koji broj je suprotan broju $−12$?',
    ['$12$', '$−12$', '$0$', '$−1$'],
    'Broj suprotan negativnom broju je pozitivan: $−(−12) = 12$. Dva minusa jedan do drugog se „poništavaju“.', 'suprotan',
    { medijiOdgovora: bp(-14, 14, [[-12, '−12', 0], [12, '12', 1]], { podela: 2, svaki: 2, e: [sk(-12, 12, { h: 0.9 }, jed(-14, 14))] }) });
  Q(1, 'Koji broj je sam sebi suprotan?',
    ['$0$', '$1$', '$−1$', 'Nijedan'],
    'Nula je jedini broj koji nije ni pozitivan ni negativan, pa je $−0 = 0$. Na brojevnoj pravoj ona je „ogledalo“ za sve ostale parove.', 'nula',
    { mediji: bp(-4, 4, [[-3, '', 2], [3, '', 2], [-1, '', 0], [1, '', 0]]) });
  Q(1, 'Kolika je apsolutna vrednost broja $−9$, tj. $|−9|$?',
    ['$9$', '$−9$', '$0$', '$18$'],
    'Apsolutna vrednost je rastojanje od nule, a rastojanje nikad nije negativno. Tačka $−9$ je $9$ jedinica udaljena od nule.', 'rastojanje',
    { mediji: bp(-10, 2, [[-9, '−9']], { e: [odNule(-9, { o: '?' })] }), medijiOdgovora: bp(-10, 2, [[-9, '−9']], { e: [odNule(-9, { o: '9' })] }) });
  Q(1, 'Šta je apsolutna vrednost celog broja?',
    ['Rastojanje tačke tog broja od nule', 'Broj suprotan datom broju', 'Broj za jedan veći od datog', 'Prethodnik datog broja'],
    'Matematičari kažu da je $|n|$ „udaljenost od nule“. Zato je apsolutna vrednost uvek pozitivna ili nula.', 'apsolutna',
    { mediji: bp(-6, 6, [[-4, '−4'], [4, '4']], { e: [odNule(-4, { b: 0 }), odNule(4, { b: 1 })] }) });
  Q(2, 'Čemu je jednak broj suprotan broju $−5$, tj. $−(−5)$?',
    ['$5$', '$−5$', '$0$', '$−10$'],
    'Zapis $−(−5)$ znači „broj suprotan broju $−5$“, a to je $5$. Zato negativan broj stavljamo u zagradu kad ispred njega pišemo minus.', 'zagrada',
    { mediji: bp(-6, 6, [[-5, '−5']]), medijiOdgovora: bp(-6, 6, [[-5, '−5', 0], [5, '5']], { e: [skok(-5, 5, { h: 1.6 })] }) });
  Q(2, 'Koliko celih brojeva ima apsolutnu vrednost $4$?',
    ['$2$', '$1$', '$4$', '$0$'],
    'To su $4$ i $−4$: oba su četiri jedinice udaljena od nule. Samo nula ima jednu jedinu „udaljenost“ – sebe.', 'dva',
    { medijiOdgovora: bp(-5, 5, [[-4, '−4', 0], [4, '4']], { e: [odNule(-4, { b: 0, o: '4' }), odNule(4, { b: 1, o: '4' })] }) });
  Q(2, 'Tačke $A$ i $B$ odgovaraju suprotnim brojevima i udaljene su $10$ jediničnih duži. Koji su to brojevi?',
    ['$5$ i $−5$', '$10$ i $−10$', '$10$ i $0$', '$20$ i $−20$'],
    'Nula je tačno na sredini između dva suprotna broja, pa je svaki od njih $10 : 2 = 5$ jedinica od nule.', 'sredina',
    { mediji: bp(-7, 7, [[-5, 'A'], [5, 'B']], { brojevi: false, e: [{ lin: [[-5, -1.1], [5, -1.1]], b: 3, debljina: 3, o: '10', oAt: [0, -1.6] }] }), medijiOdgovora: bp(-7, 7, [[-5, 'A'], [5, 'B']]) });
  U(2, 'Koji izraz je uljez – ima drugačiju vrednost od ostalih?',
    ['$−|−6|$', '$|−6|$', '$|6|$', '$−(−6)$'],
    'Prva tri koja nisu uljez su jednaka $6$, a $−|−6| = −6$: prvo izračunamo $|−6| = 6$, pa uzmemo suprotan broj.',
    'Minus ispred apsolutne vrednosti „ostaje napolju“ – apsolutna vrednost ne može da ga ukloni.', 'izraz',
    { medijiOdgovora: bp(-7, 7, [[-6, '−6', 1], [6, '6', 2]]) });
  Q(1, 'Koji broj ima apsolutnu vrednost $0$?',
    ['Samo $0$', '$0$ i $1$', '$1$ i $−1$', 'Nijedan broj'],
    'Rastojanje od nule je nula samo ako smo već u nuli. Za svaki drugi broj $|n| > 0$.', 'nula',
    { medijiOdgovora: bp(-3, 3, [[0, '0', 3]]) });
  S(2, 'Spoji izraz sa njegovom vrednošću.',
    [['$−(−8)$', '$8$'], ['$|−3|$', '$3$'], ['$−|5|$', '$−5$'], ['$−(+2)$', '$−2$'], ['$|0|$', '$0$']],
    'Kod $−|5|$ minus je ispred apsolutne vrednosti, pa rezultat ostaje negativan.', 'vrednost',
    { mediji: bp(-9, 9, [[-5, '', 0], [8, '', 1], [3, '', 2], [-2, '', 3]], { svaki: 3 }) });
  Q(3, 'Koliko ima celih brojeva čija je apsolutna vrednost manja od $3$?',
    ['$5$', '$3$', '$2$', '$6$'],
    'To su $−2, −1, 0, 1, 2$ – svi brojevi koji su manje od tri koraka udaljeni od nule. Nulu ne treba zaboraviti.', 'manja',
    { mediji: bp(-4, 4), medijiOdgovora: bp(-4, 4, [[-2], [-1], [0, '', 3], [1], [2]], { e: [odNule(-2.9, { b: 2 }), odNule(2.9, { b: 2 })] }) });
  Q(2, 'Koji broj je udaljeniji od nule: $−8$ ili $5$?',
    ['$−8$', '$5$', 'Jednako su udaljeni', 'Ne može se odrediti'],
    'Upoređujemo apsolutne vrednosti: $|−8| = 8$ i $|5| = 5$. Iako je $−8$ manji broj, udaljeniji je od nule.', 'udaljenost',
    { mediji: bp(-9, 6, [[-8, '−8', 0], [5, '5', 1]]), medijiOdgovora: bp(-9, 6, [[-8, '−8', 0], [5, '5', 1]], { e: [odNule(-8, { b: 0, o: '8', u: 1.25 }), odNule(5, { b: 1, o: '5', u: 1.25 })] }) });
  Q(3, 'Broj $a$ je negativan. Kakav je broj $−a$?',
    ['Pozitivan', 'Negativan', 'Jednak nuli', 'Zavisi od broja $a$'],
    'Kad $a$ leži levo od nule, njegov suprotan broj $−a$ leži desno. Na primer, za $a = −4$ je $−a = 4$. Zato „$−a$“ ne mora biti negativan broj!', 'suprotan',
    { mediji: bp(-6, 6, [[-4, 'a']], { brojevi: false }), medijiOdgovora: bp(-6, 6, [[-4, 'a', 0], [4, '−a', 1]], { brojevi: false, e: [skok(-4, 4, { h: 1.4 })] }) });
  Q(3, 'Za ceo broj $a$ važi $|a| = 7$, a tačka broja $a$ je levo od nule. Koliko je $a$?',
    ['$−7$', '$7$', '$0$', '$−14$'],
    'Apsolutnu vrednost $7$ imaju dva broja, $7$ i $−7$. Levo od nule je samo $−7$.', 'levo',
    { medijiOdgovora: bp(-8, 8, [[-7, 'a', 1], [7, '', 4]], { svaki: 7 }) });
  Q(3, 'Šta važi za svaki ceo broj $n$ (bez izuzetka)?',
    ['$|n| = |−n|$', '$|n| = −n$', '$|n| > 0$', '$−n < 0$'],
    'Suprotni brojevi su jednako udaljeni od nule. Ostale tvrdnje ne važe uvek: za $n = 0$ nije $|n| > 0$, a za $n = −3$ je $−n = 3 > 0$.', 'jednakost',
    { mediji: bp(-5, 5, [[-3, '−n', 0], [3, 'n', 1]], { brojevi: false, e: [odNule(-3, { b: 0 }), odNule(3, { b: 1 })] }) });

  // ══════════ 3. Poređenje celih brojeva ══════════
  L('Poređenje celih brojeva');
  Q(1, 'Koji broj je veći: $−3$ ili $2$?',
    ['$2$', '$−3$', 'Jednaki su', 'Ne mogu se porediti'],
    'Svaki pozitivan broj je veći od svakog negativnog. Na brojevnoj pravoj veći broj je uvek desno.', 'veći',
    { mediji: bp(-5, 5, [[-3, '−3', 0], [2, '2', 1]]) });
  Q(1, 'Koji znak treba staviti između brojeva: $−5$ ☐ $−2$?',
    ['$<$', '$>$', '$=$', '$≥$'],
    'Broj $−5$ je levo od $−2$, pa je manji. Iako je $5$ veće od $2$, kod negativnih brojeva je obrnuto.', 'znak',
    { mediji: bp(-6, 1, [[-5, '−5', 0], [-2, '−2', 1]]) });
  Q(1, 'Koji od brojeva $k$, $m$ i $n$ na slici je najmanji?',
    ['$k$', '$m$', '$n$', 'Svi su jednaki'],
    'Na brojevnoj pravoj brojevi rastu sleva nadesno, pa je najmanji onaj koji je najviše levo. Ovde je $k < m < n$.', 'najmanji',
    { mediji: bp(-6, 6, [[-5, 'k', 0], [-1, 'm', 2], [4, 'n', 1]], { brojevi: false }) });
  Q(1, 'Koji broj je veći od svakog negativnog broja, a manji od svakog pozitivnog?',
    ['$0$', '$1$', '$−1$', 'Takav ne postoji'],
    'Nula razdvaja negativne od pozitivnih brojeva. Ona nije ni pozitivna ni negativna.', 'nula',
    { mediji: bp(-5, 5, [], { brojevi: false, e: [{ lin: [[-5, 0.3], [-0.3, 0.3]], b: 0, debljina: 6 }, { lin: [[0.3, 0.3], [5, 0.3]], b: 1, debljina: 6 }, { tx: '?', at: [0, 0.7], vel: 22, b: 3 }] }) });
  Q(2, 'Gde je bilo hladnije?',
    ['Kopaonik', 'Novi Sad', 'Bilo je isto hladno', 'Ne može se odrediti'],
    'Važi $−11 < −4$, pa je na Kopaoniku bilo hladnije. Niža temperatura je manji broj – na termometru je stub niži.', 'hladnije',
    { mediji: termometri([[-4, '~Novi Sad'], [-11, '~Kopaonik']], { od: -15, doo: 10, korak: 5 }) });
  Q(2, 'Kako su poređani brojevi $−7$, $3$, $−1$ i $0$ od najmanjeg do najvećeg?',
    ['$−7 < −1 < 0 < 3$', '$−1 < −7 < 0 < 3$', '$0 < −1 < 3 < −7$', '$−7 < 0 < −1 < 3$'],
    'Čitamo brojevnu pravu sleva nadesno. Od negativnih brojeva manji je onaj koji je dalje od nule.', 'redosled',
    { medijiOdgovora: bp(-8, 4, [[-7, '−7'], [-1, '−1'], [0, '0', 3], [3, '3']]) });
  Q(2, 'Kad upoređujemo dva negativna broja, koji je veći?',
    ['Onaj sa manjom apsolutnom vrednošću', 'Onaj sa većom apsolutnom vrednošću', 'Onaj sa većom cifrom', 'Uvek onaj napisan prvi'],
    'Bliži nuli znači desnije, pa veći: $−2 > −9$ jer je $|−2| < |−9|$. Kod pozitivnih brojeva je obrnuto.', 'negativan',
    { mediji: bp(-10, 1, [[-9, '−9', 0], [-2, '−2', 1]], { e: [odNule(-9, { b: 0 }), odNule(-2, { b: 1, y: -2.1 })] }) });
  Q(2, 'Koji je najveći među brojevima $−15$, $−51$, $−5$ i $−50$?',
    ['$−5$', '$−51$', '$−50$', '$−15$'],
    'Svi su negativni, pa je najveći onaj najbliži nuli – to je $−5$. Broj $−51$ je najmanji.', 'najveći',
    { medijiOdgovora: bp(-55, 5, [[-51, '', 0], [-50, '', 0], [-15, '', 2], [-5, '', 1]], { podela: 5, svaki: 2 }) });
  Q(2, 'Koliko celih brojeva $x$ zadovoljava $−4 < x ≤ 2$?',
    ['$6$', '$7$', '$5$', '$8$'],
    'To su $−3, −2, −1, 0, 1, 2$. Znak $<$ isključuje $−4$, a znak $≤$ uključuje $2$.', 'nejednakost',
    { mediji: bp(-5, 3), medijiOdgovora: bp(-5, 3, [[-4, '○', 4], [-3], [-2], [-1], [0], [1], [2]]) });
  U(2, 'Koja nejednakost je uljez – jedina nije tačna?',
    ['$−9 > −2$', '$−9 < −2$', '$0 > −1$', '$−1 < 1$'],
    'Broj $−9$ je levo od $−2$, pa je manji: $−9 < −2$. Ostale tri nejednakosti su tačne.',
    'Trik za pamćenje: na termometru $−9°$ je hladnije od $−2°$ – manje toplote, manji broj.', 'nejednakost',
    { medijiOdgovora: bp(-10, 2, [[-9, '−9', 0], [-2, '−2', 1]]) });
  S(2, 'Spoji opis sa brojem.',
    [['Najveći negativan ceo broj', '$−1$'], ['Najmanji prirodan broj', '$1$'], ['Najmanji broj skupa $N_0$', '$0$'], ['Najveći ceo broj manji od $−5$', '$−6$']],
    'Skup $Z$ nema najmanji element, ali njegovi delovi ($N$, $N_0$, $Z^{−}$) imaju „krajeve“.', 'najveći',
    { mediji: bp(-7, 3) });
  Q(2, 'Koji nivo je niži: $−1$ ili $−3$?',
    ['$−3$', '$−1$', 'Isti su', 'Zavisi od zgrade'],
    'Na zgradi, kao na uspravnoj brojevnoj pravoj, manji broj je niže. Važi $−3 < −1$.', 'nivo',
    { mediji: zgrada(-3, 2, { istakni: { '-1': 2, '-3': 1 } }) });
  Q(3, 'Ronilka Ana je na dubini $12 m$, ronilac Boris na $20 m$, a galeb leti $8 m$ iznad mora. Koja nejednakost je tačna?',
    ['$−20 < −12 < 8$', '$−12 < −20 < 8$', '$8 < −12 < −20$', '$−20 < 8 < −12$'],
    'Dubine su negativni brojevi: Ana je na $−12$, Boris na $−20$. Ko je dublje, ima manji broj.', 'dubina',
    { mediji: g([{ lin: [[-2, 0], [4, 0], [4, -4.8], [-2, -4.8]], zatv: 1, b: 0 }, { lin: [[-2, 0], [4, 0]], b: 0, debljina: 3 },
      { tx: '●', at: [-0.5, -2.4], b: 3, vel: 22 }, { tx: '~Ana', at: [-0.5, -1.95], vel: 14 },
      { tx: '●', at: [1.8, -4.0], b: 1, vel: 22 }, { tx: '~Boris', at: [1.8, -3.55], vel: 14 },
      { tx: '~galeb', at: [0.8, 1.1], vel: 14 }], 220),
    medijiOdgovora: bp(-22, 10, [[-20, '~Boris', 0], [-12, '~Ana', 3], [8, '~galeb', 1]], { podela: 2, svaki: 2 }) });
  Q(3, 'Ako je $a < b < 0$, šta je sigurno tačno?',
    ['$|a| > |b|$', '$|a| < |b|$', '$−a < −b$', '$a > 0$'],
    'Oba broja su levo od nule, a $a$ je levlje – dakle dalje od nule. Zato $a$ ima veću apsolutnu vrednost.', 'poređenje',
    { mediji: bp(-6, 2, [[-5, 'a', 0], [-2, 'b', 1]], { brojevi: false }) });
  Q(3, 'Koliko celih brojeva $x$ istovremeno zadovoljava $|x| ≤ 3$ i $x < 1$?',
    ['$4$', '$3$', '$7$', '$6$'],
    'Uslov $|x| ≤ 3$ daje $−3, …, 3$, a uslov $x < 1$ ostavlja samo $−3, −2, −1, 0$.', 'uslov',
    { medijiOdgovora: bp(-4, 4, [[-3], [-2], [-1], [0], [1, '', 4], [2, '', 4], [3, '', 4]]) });
  Q(3, 'Ako je $−a > 0$, kakav je broj $a$?',
    ['Negativan', 'Pozitivan', 'Jednak nuli', 'Bilo koji ceo broj'],
    'Broj $−a$ je pozitivan, a njegov suprotan broj $a$ je onda negativan. Na primer, $a = −6$ daje $−a = 6 > 0$.', 'negativan',
    { medijiOdgovora: bp(-5, 5, [[-3, 'a', 0], [3, '−a', 1]], { brojevi: false }) });

  // ══════════ 4. Sabiranje celih brojeva ══════════
  L('Sabiranje celih brojeva');
  Q(1, 'Koliko je $−3 + 6$?',
    ['$3$', '$−9$', '$9$', '$−3$'],
    'Krenemo od $−3$ i pomerimo se $6$ koraka udesno: stižemo do $3$. Sabiranje pozitivnog broja je kretanje udesno.', 'zbir',
    { mediji: bp(-5, 5, [[-3, 'start', 3]]), medijiOdgovora: bp(-5, 5, [[-3, '', 3], [3, '3']], { e: [skok(-3, 3, { o: '+6' })] }) });
  Q(1, 'Koliko je $5 + (−4)$?',
    ['$1$', '$9$', '$−1$', '$−9$'],
    'Krenemo od $5$ i pomerimo se $4$ koraka ulevo. Sabiranje negativnog broja je kretanje ulevo.', 'ulevo',
    { mediji: bp(-2, 6, [[5, 'start', 3]]), medijiOdgovora: bp(-2, 6, [[5, '', 3], [1, '1']], { e: [skok(5, 1, { o: '−4' })] }) });
  Q(1, 'Koliko je $−5 + (−3)$?',
    ['$−8$', '$8$', '$−2$', '$2$'],
    'Oba sabirka su negativna, pa idemo samo ulevo: od $−5$ još $3$ koraka levo. Zbir dva negativna broja je negativan.', 'negativan',
    { medijiOdgovora: bp(-9, 1, [[-5, '', 3], [-8, '−8']], { e: [skok(-5, -8, { o: '−3' })] }) });
  Q(1, 'Kako se pravilno zapisuje zbir brojeva $4$ i $−7$?',
    ['$4 + (−7)$', '$4 + −7$', '$4 −+ 7$', '$(4) + −7$'],
    'Dva znaka računskih operacija ne pišemo jedan do drugog, pa negativan drugi sabirak stavljamo u zagradu.', 'zagrada',
    { medijiOdgovora: bp(-4, 5, [[4, '', 3], [-3, '−3']], { e: [skok(4, -3, { o: '−7' })] }) });
  Q(1, 'Koji broj je neutralni element sabiranja celih brojeva?',
    ['$0$', '$1$', '$−1$', 'Nema ga'],
    'Važi $a + 0 = 0 + a = a$ za svaki ceo broj $a$ – sabiranje nule je „skok od nula koraka“.', 'neutralni',
    { mediji: bp(-4, 4, [[-2, 'a', 3]], { brojevi: false }) });
  Q(2, 'Ujutru je bilo $−6 °C$, a do podneva je temperatura porasla za $9°$. Koliko je bilo u podne?',
    ['$3 °C$', '$15 °C$', '$−15 °C$', '$−3 °C$'],
    'Računamo $−6 + 9 = 3$: prvih $6°$ porasta nas dovodi do nule, a još $3°$ iznad nje.', 'temperatura',
    { mediji: termometri([[-6, '~jutro']], { od: -10, doo: 10, korak: 5 }), medijiOdgovora: termometri([[-6, '~jutro'], [3, '~podne']], { od: -10, doo: 10, korak: 5 }) });
  Q(2, 'Lift je na nivou $−2$ i popne se $5$ spratova. Na kom je spratu?',
    ['$3$', '$7$', '$−7$', '$−3$'],
    'Penjanje je sabiranje pozitivnog broja: $−2 + 5 = 3$. Dva sprata do prizemlja i još tri iznad.', 'lift',
    { mediji: zgrada(-3, 4, { istakni: { '-2': 3 } }), medijiOdgovora: zgrada(-3, 4, { istakni: { '-2': 3, 3: 1 }, strelice: [[-2, 3]] }) });
  Q(2, 'Kada sabiramo dva broja suprotnih znakova, koji znak ima zbir?',
    ['Znak sabirka sa većom apsolutnom vrednošću', 'Uvek znak plus', 'Uvek znak minus', 'Znak prvog sabirka'],
    'Na primer, $−9 + 4 = −5$, a $9 + (−4) = 5$. „Jači“ sabirak odlučuje o znaku, a apsolutne vrednosti se oduzimaju.', 'pravilo',
    { mediji: bp(-10, 5, [[-9, '−9', 0], [4, '4', 1]], { e: [odNule(-9, { b: 0 }), odNule(4, { b: 1 })] }) });
  Q(2, 'Koliko je $−47 + 12$?',
    ['$−35$', '$35$', '$−59$', '$59$'],
    'Znak je minus (jer je $|−47| > |12|$), a apsolutne vrednosti se oduzimaju: $47 − 12 = 35$. Zbir je $−35$.', 'zbir',
    { medijiOdgovora: bp(-50, 5, [[-47, '', 0], [-35, '−35', 1]], { podela: 5, svaki: 2, e: [sk(-47, -35, { o: '+12', h: 1 }, jed(-50, 5))] }) });
  Q(2, 'Koliko je $−134 + (−87)$?',
    ['$−221$', '$−47$', '$47$', '$221$'],
    'Sabirci su istog znaka, pa saberemo apsolutne vrednosti ($134 + 87 = 221$) i zadržimo zajednički znak minus.', 'znak',
    { medijiOdgovora: bp(-240, 20, [[-134, '', 0], [-221, '−221', 1]], { podela: 20, svaki: 2, e: [sk(-134, -221, { o: '−87', h: 1 }, jed(-240, 20)), { tx: '−134', at: [-134, r(-1.3 * jed(-240, 20))], b: 0, vel: 14 }] }) });
  S(2, 'Spoji zbir sa rezultatom.',
    [['$−8 + 3$', '$−5$'], ['$8 + (−3)$', '$5$'], ['$−8 + (−3)$', '$−11$'], ['$−3 + 8 + 3$', '$8$'], ['$−8 + 8$', '$0$']],
    'Zbir dva suprotna broja je uvek nula: $−8 + 8 = 0$. Zato se $−3$ i $3$ u četvrtom zbiru „poništavaju“.', 'zbir',
    { mediji: bp(-12, 9, [], { svaki: 2 }) });
  Q(2, 'Koje svojstvo sabiranja pokazuje jednakost $−4 + 9 = 9 + (−4)$?',
    ['Komutativnost', 'Asocijativnost', 'Neutralni element', 'Distributivnost'],
    'Komutativnost znači da sabirci smeju da zamene mesta. Na brojevnoj pravoj oba puta stižemo u $5$.', 'zamena',
    { mediji: bp(-5, 10, [[5, '5']], { e: [skok(0, -4, { boja: 0, o: '−4' }), skok(-4, 5, { boja: 0, o: '+9', h: 1.4 }), skok(0, 9, { boja: 2, ispod: true, o: '+9' }), skok(9, 5, { boja: 2, ispod: true, o: '−4' })] }) });
  U(3, 'Koji zbir je uljez – jedini ima drugačiji rezultat?',
    ['$−4 + 9$', '$7 + (−10)$', '$−1 + (−2)$', '$−6 + 3$'],
    'Zbir $−4 + 9 = 5$, a ostala tri zbira iznose $−3$.',
    'Pre računanja možeš da pogodiš znak: zbir je pozitivan kada „jači“ sabirak ima plus.', 'uljez',
    { medijiOdgovora: bp(-5, 6, [[5, '5', 1], [-3, '−3', 0]]) });
  Q(3, 'Koliki je zbir svih celih brojeva čija je apsolutna vrednost manja od $100$?',
    ['$0$', '$99$', '$−99$', '$4950$'],
    'Ti brojevi su $−99, …, −1, 0, 1, …, 99$ i dele se na parove suprotnih brojeva: $(−99) + 99 = 0$, $(−98) + 98 = 0$… Svaki par daje nulu.', 'parovi',
    { mediji: bp(-5, 5, [], { e: [1, 2, 3, 4].map((v) => skok(-v, v, { boja: v % 2 ? 1 : 2, h: 0.4 + v * 0.3 })) }) });
  Q(3, 'Mila ima $1 200$ dinara, od bake dobije još $650$, a planira kupovinu od $2 100$ dinara. Koliko joj nedostaje?',
    ['$250$ dinara', '$1 450$ dinara', '$750$ dinara', 'Ništa, ostaje joj $250$'],
    'Troškove računamo kao negativne prihode: $1 200 + 650 + (−2 100) = −250$. Negativan zbir znači da nedostaje $|−250| = 250$ dinara.', 'novac',
    { mediji: g([{ lin: [[-0.5, 0], [8, 0]], b: 4, debljina: 2 },
      { lin: [[0.3, 0], [2, 0], [2, 2.4], [0.3, 2.4]], zatv: 1, b: 2, gusto: 1 }, { tx: '1200', at: [1.15, 2.8], vel: 14 },
      { lin: [[2.6, 0], [4.3, 0], [4.3, 1.3], [2.6, 1.3]], zatv: 1, b: 2, gusto: 1 }, { tx: '650', at: [3.45, 1.7], vel: 14 },
      { lin: [[4.9, 0], [6.6, 0], [6.6, -4.2], [4.9, -4.2]], zatv: 1, b: 1, gusto: 1 }, { tx: '−2100', at: [5.75, -4.8], vel: 14 }], 260) });
  Q(3, 'Koliko je $−17 + 38 + (−3) + 2$?',
    ['$20$', '$−20$', '$60$', '$16$'],
    'Zgodno je grupisati: $(−17 + (−3)) + (38 + 2) = −20 + 40 = 20$. Asocijativnost i komutativnost dozvoljavaju da sabirke premeštamo i grupišemo.', 'grupisanje',
    { medijiOdgovora: bp(-25, 25, [[-20, '', 0], [20, '20', 1]], { podela: 5, svaki: 2, e: [sk(0, -20, { boja: 0, o: '−20', h: 0.7 }, jed(-25, 25)), sk(-20, 20, { h: 1.5, o: '+40' }, jed(-25, 25))] }) });
  Q(3, 'Zbir dva cela broja je negativan, a jedan sabirak je pozitivan. Šta važi za drugi sabirak?',
    ['Negativan je i ima veću apsolutnu vrednost', 'Pozitivan je i veći od prvog', 'Negativan je, a apsolutna vrednost mu je manja', 'Jednak je nuli'],
    'Da bi zbir bio negativan, „jači“ sabirak mora imati minus. Na primer, $3 + (−8) = −5$.', 'sabirak',
    { mediji: bp(-6, 4, [[3, '', 2]], { brojevi: false, e: [skok(3, -5, { o: '?' })] }) });
};
