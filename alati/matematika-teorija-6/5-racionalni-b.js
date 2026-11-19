// Lekcije 19–22: deljenje racionalnih brojeva, izrazi, jednačine i nejednačine (Matematika 6, tema 3, drugi deo).
// Pitanja su sopstvenim rečima, „u glavi“; crteži su medij „geo“: vaga (klackalica) za jednačine i nejednačine,
// drvo izraza za redosled računskih operacija, skokovi po brojevnoj pravoj za deljenje, zrak rešenja nejednačine.
// Pomoćni crteži su zajednički sa zadacima: alati/zadaci-6/5-racionalni-b.js (crtezi, razlomci).
const Z6 = require('../zadaci-6/5-racionalni-b');

module.exports = (A) => {
  const { L, Q, U, S, proveri, skokovi, traka, termometar, krug, r } = A;
  const { g, pr, vaga, drvo, osa, zrak, tacke, dvojni } = Z6.crtezi(A);
  const { F, plus, minus, puta, kroz, je } = Z6.razlomci;
  const formula = (tekst) => ({ vrsta: 'formula', tekst });

  // tablica znakova za množenje/deljenje: redovi = znak prvog broja, kolone = znak drugog; poznato = { '+-': '−', … }
  function znaci(op, poznato = {}, istakni) {
    const e = [];
    const polje = (x, y, t, b, gust) => [pr(x, y, 1.6, 1.2, { b, ...(gust ? { gusto: 1 } : { prazno: 1 }) }), { tx: t, at: [r(x + 0.8), r(y + 0.42)], vel: 22 }];
    e.push({ tx: op, at: [0.8, 1.62], vel: 24, b: 3 });
    e.push(...polje(1.7, 1.2, '+', 4, true), ...polje(3.4, 1.2, '−', 4, true));
    e.push(...polje(0, 0, '+', 4, true), ...polje(0, -1.3, '−', 4, true));
    [['+', '+', 1.7, 0], ['+', '-', 3.4, 0], ['-', '+', 1.7, -1.3], ['-', '-', 3.4, -1.3]].forEach(([a, b, x, y]) => {
      const t = (poznato[a + b] ?? '?').replace('-', '−');
      e.push(...polje(x, y, t, istakni === a + b ? 1 : t === '?' ? 5 : t === '+' ? 2 : 0, t !== '?'));
    });
    return g(e, 200);
  }
  const SVI = { '++': '+', '+-': '−', '-+': '−', '--': '+' };

  // ugnežđene zagrade (obične u uglastim u vitičastim)
  const zagrade = () => g([
    pr(0, 0, 9, 3.4, { b: 4, gusto: 1 }), { tx: '{', at: [0.4, 1.45], vel: 30 }, { tx: '}', at: [8.6, 1.45], vel: 30 },
    pr(1, 0.5, 7, 2.4, { b: 0, gusto: 1 }), { tx: '[', at: [1.4, 1.45], vel: 30 }, { tx: ']', at: [7.6, 1.45], vel: 30 },
    pr(2, 1, 5, 1.4, { b: 1, gusto: 1 }), { tx: '(', at: [2.4, 1.45], vel: 30 }, { tx: ')', at: [6.6, 1.45], vel: 30 },
    { tx: '?', at: [4.5, 1.45], vel: 22 },
  ], 260);

  // ══════════ 19. Deljenje racionalnih brojeva ══════════
  L('Deljenje racionalnih brojeva');
  proveri(je(puta(F(-2, 7), F(-7, 2)), F(1)), 'recipročni −2/7');
  Q(1, 'Koji je broj recipročan broju $−{2|7}$?',
    ['$−{7|2}$', '${7|2}$', '${2|7}$', '$−{2|7}$'],
    'Recipročan broj negativnog broja je takođe negativan – jer samo minus puta minus daje $+1$. Suprotan broj (${2|7}$) je nešto sasvim drugo: sa njim je zbir $0$, a ne proizvod $1$.', 'recipročan',
    { mediji: formula('$−{2|7} · ? = 1$') });
  Q(1, 'Koji od ovih brojeva nema sebi recipročan broj?',
    ['$0$', '$1$', '$−1$', '${1|2}$'],
    'Nula pomnožena bilo čim daje $0$, nikad $1$. Brojevi $1$ i $−1$ su jedini koji su sami sebi recipročni.', 'nula',
    { mediji: A.brojevna(-2, 2, [[-1, '−1'], [0, '0'], [0.5, '½'], [1, '1']], { podela: 0.5, svaki: 2 }) });
  Q(1, 'Kakav je znak količnika dva negativna broja?',
    ['Pozitivan', 'Negativan', 'Zavisi od toga koji je veći', 'Količnik je uvek nula'],
    'Pravila znakova za deljenje ista su kao za množenje: isti znaci daju plus, različiti minus. Indijski matematičar Bramagupta je još 628. godine zapisao da je „dug podeljen dugom – imovina“.', 'znak',
    { mediji: znaci(':', { '++': '+', '+-': '−', '-+': '−' }), medijiOdgovora: znaci(':', SVI, '--') });
  Q(1, 'Koliko je $(−12) : 3$?',
    ['$−4$', '$4$', '$−36$', '$−9$'],
    'Deljenje je obrnuto množenje: tražimo broj koji pomnožen sa $3$ daje $−12$. To je $−4$, jer je $3 · (−4) = −12$.', 'količnik',
    { mediji: A.brojevna(-12, 1, [[-12, '−12']], { svaki: 3 }), medijiOdgovora: g([osa(-12, 1, 1, { svaki: 3 }), ...skokovi(0, -4, 3, { boja: 1, h: 0.9 })], 300) });
  proveri(-12 / 3 === -4, '−12 : 3');
  Q(1, 'Šta se dobije kad se broj podeli sa $−1$?',
    ['Njemu suprotan broj', 'Njemu recipročan broj', 'Isti taj broj', 'Uvek broj $−1$'],
    'Deljenje sa $−1$ samo menja znak: $7 : (−1) = −7$, a $(−7) : (−1) = 7$. Na brojevnoj pravoj to je skok na drugu stranu nule, na isto rastojanje.', 'suprotan',
    { mediji: A.brojevna(-5, 5, [[3, '3']]), medijiOdgovora: A.brojevna(-5, 5, [[3, '3'], [-3, '−3', 2]], { e: [{ lin: [[3, 0.25], [0, 1.3], [-3, 0.25]], b: 2, str: 1, crtaj: 1 }] }) });
  Q(2, 'Deliti brojem ${1|2}$ isto je što i…',
    ['množiti brojem $2$', 'deliti brojem $2$', 'množiti brojem ${1|2}$', 'oduzeti ${1|2}$'],
    'Polovina staje u svaki ceo dva puta, pa $3 : {1|2} = 6$. Zato deljenje razlomkom „povećava“ broj kad je razlomak manji od $1$.', 'polovina',
    { mediji: g([osa(0, 3, 2, { svaki: 2 }), ...skokovi(0, 0.5, 6, { boja: 2, h: 0.45, razmak: 0.4 }), { tx: '3 : ½ = ?', at: [1.5, 1.4], vel: 18 }], 300) });
  proveri(je(kroz(F(3), F(1, 2)), F(6)), '3 : 1/2');
  Q(2, 'Koliko je $(−{3|4}) : {1|4}$?',
    ['$−3$', '$3$', '$−{3|16}$', '$−{1|3}$'],
    'Četvrtina staje u tri četvrtine tačno tri puta, a znak je minus jer su znaci različiti. Kod razlomaka sa istim imeniocem dovoljno je podeliti brojioce: $(−3) : 1 = −3$.', 'četvrtina',
    { mediji: A.brojevna(-1, 0.5, [[-0.75, '−3/4']], { podela: 0.25, svaki: 2 }), medijiOdgovora: g([osa(-1, 0.5, 4, { svaki: 2 }), ...skokovi(0, -0.25, 3, { boja: 1, h: 0.3 })], 300) });
  proveri(je(kroz(F(-3, 4), F(1, 4)), F(-3)), '−3/4 : 1/4');
  Q(2, 'Kako se zove najduža, srednja razlomačka crta u dvojnom razlomku?',
    ['Glavna razlomačka crta', 'Sporedna razlomačka crta', 'Unutrašnja razlomačka crta', 'Srednja deobna crta'],
    'Glavnu crtu treba pisati dužu i deblju od sporednih – inače se ne zna šta je brojilac, a šta imenilac, i ${{1|2}|4}$ se lako pobrka sa ${1|{2|4}}$ (to su ${1|8}$ i $2$!).', 'crta',
    { mediji: dvojni('a', 'b', 'c', 'd'), medijiOdgovora: dvojni('a', 'b', 'c', 'd', { glavna: true }) });
  proveri(je(kroz(F(1, 2), F(4)), F(1, 8)) && je(kroz(F(1), F(2, 4)), F(2)), 'dvojni zamka');
  Q(2, 'Čemu je jednak dvojni razlomak ${{a|b}|{c|d}}$ ($b$, $c$, $d$ različiti od nule)?',
    ['${a · d|b · c}$', '${a · c|b · d}$', '${b · c|a · d}$', '${a · b|c · d}$'],
    'Pravilo „spoljašnji gore, unutrašnji dole“: proizvod krajnjih članova ($a$ i $d$) ide u brojilac, a srednjih ($b$ i $c$) u imenilac. To je isto što i ${a|b} · {d|c}$.', 'dvojni',
    { mediji: dvojni('a', 'b', 'c', 'd'), medijiOdgovora: dvojni('a', 'b', 'c', 'd', { boje: true }) });
  Q(2, 'Koliko je ${{6|5}|{3|10}}$?',
    ['$4$', '${9|25}$', '${1|4}$', '${18|50}$'],
    'Spoljašnji: $6 · 10 = 60$, unutrašnji: $5 · 3 = 15$, a $60 : 15 = 4$. Provera: četiri puta ${3|10}$ je ${12|10} = {6|5}$.', 'razlomak',
    { mediji: dvojni('6', '5', '3', '10'), medijiOdgovora: dvojni('6', '5', '3', '10', { boje: true }) });
  proveri(je(kroz(F(6, 5), F(3, 10)), F(4)), '6/5 : 3/10');
  Q(2, 'Za koji broj $a$ važi $a : a = a$?',
    ['$a = 1$', '$a = 0$', '$a = −1$', 'Za svaki broj $a$'],
    'Svaki broj različit od nule podeljen samim sobom daje $1$, pa mora biti $a = 1$. Za $a = −1$ dobija se $(−1) : (−1) = 1$, a ne $−1$, a nulom se ne deli.', 'jedan',
    { mediji: formula('$a : a = a$') });
  U(2, 'Koji par nije par recipročnih brojeva?',
    ['$−{2|3}$ i ${3|2}$', '$−5$ i $−{1|5}$', '$0,25$ i $4$', '$1{1|2}$ i ${2|3}$'],
    'Proizvod $−{2|3} · {3|2} = −1$, a ne $1$. Recipročni brojevi uvek imaju isti znak.',
    'Recipročan broj se zove i inverzni broj za množenje; u kalkulatoru ga daje taster $1/x$ ili $x^{−1}$.', 'recipročan');
  Q(3, 'Koliko je puta $5 : {1|10}$ veće od $5 : 10$?',
    ['$100$ puta', '$10$ puta', 'Jednaki su', '$50$ puta'],
    '$5 : {1|10} = 50$ (desetina staje u petici pedeset puta), a $5 : 10 = {1|2}$. Količnik $50 : {1|2} = 100$.', 'deljenje',
    { mediji: g([...traka(10, 10, { w: 9, h: 1, b: 2 }), { tx: '1 ceo = 10 desetina', at: [4.5, 1.6], vel: 16 }], 260) });
  proveri(je(kroz(kroz(F(5), F(1, 10)), kroz(F(5), F(10))), F(100)), '100 puta');
  S(3, 'Spoji količnik sa njegovom vrednošću.',
    [['$(−8) : 4$', '$−2$'], ['$(−8) : (−4)$', '$2$'], ['$8 : (−{1|2})$', '$−16$'], ['$(−{1|2}) : (−8)$', '${1|16}$']],
    'Kad deljenik i delilac zamene mesta, dobija se recipročan količnik: $8 : {1|2} = 16$, a ${1|2} : 8 = {1|16}$.', 'količnik');
  proveri(je(kroz(F(8), F(-1, 2)), F(-16)) && je(kroz(F(-1, 2), F(-8)), F(1, 16)), 'spoji deljenje');
  Q(3, 'Zašto se nijedan broj ne može podeliti nulom?',
    ['Jer nijedan broj pomnožen nulom ne daje, npr., $5$', 'Jer je rezultat uvek nula', 'Jer bi rezultat bio negativan', 'Jer nula nema znak'],
    'Kad bi $5 : 0$ bilo neki broj $k$, moralo bi da važi $k · 0 = 5$, a to je nemoguće. Zato kalkulator na $5 : 0$ javlja grešku.', 'nula',
    { mediji: formula('$5 : 0 = k ⇔ k · 0 = 5$') });

  // ══════════ 20. Izrazi sa racionalnim brojevima ══════════
  L('Izrazi sa racionalnim brojevima');
  Q(1, 'Šta se u izrazu bez zagrada računa prvo?',
    ['Množenje i deljenje', 'Sabiranje i oduzimanje', 'Sve redom, sleva nadesno', 'Ono što je najlakše'],
    'Množenje i deljenje „vežu jače“ od sabiranja i oduzimanja. U drvetu izraza operacija koja se računa poslednja nalazi se na vrhu.', 'redosled',
    { mediji: formula('$2 + 3 · 4$'), medijiOdgovora: drvo({ op: '+', v: '14', l: '2', r: { op: '·', v: '12', l: '3', r: '4' } }) });
  Q(1, 'Koliko je $−2 + 3 · 4$?',
    ['$10$', '$4$', '$−14$', '$−20$'],
    'Prvo $3 · 4 = 12$, pa $−2 + 12 = 10$. Ko sabere prvo, dobije $1 · 4 = 4$. Ovakvi zadaci redovno izazivaju rasprave na internetu – zato je pametno pisati zagrade i kad nisu obavezne.', 'izraz',
    { mediji: drvo({ op: '+', l: '−2', r: { op: '·', l: '3', r: '4' } }) });
  proveri(-2 + 3 * 4 === 10, '−2 + 3·4');
  Q(1, 'Kojim redom se oslobađamo zagrada?',
    ['Obične ( ), pa uglaste [ ], pa vitičaste { }', 'Vitičaste { }, pa uglaste [ ], pa obične ( )', 'Uglaste [ ], pa obične ( ), pa vitičaste { }', 'Sleva nadesno, bez obzira na vrstu'],
    'Zagrade se računaju „iznutra ka spolja“, kao kad otvaraš babuške. Obične su najdublje, pa ih rešavamo prve.', 'zagrada',
    { mediji: zagrade() });
  Q(1, 'Kako se zove izraz u kome se pojavljuje slovo, npr. $3x − 2$?',
    ['Izraz sa promenljivom', 'Jednačina', 'Nejednačina', 'Dvojni razlomak'],
    'Izraz nije jednačina – nema znak „=“. Izraz $3x − 2$ ima različitu vrednost za svako $x$: za $x = 1$ to je $1$, za $x = −1$ to je $−5$.', 'promenljiva',
    { mediji: drvo({ op: '−', l: { op: '·', l: '3', r: 'x' }, r: '2' }) });
  Q(1, 'Koja je poslednja operacija u izrazu $5 − 2 · (−3)$?',
    ['Oduzimanje', 'Množenje', 'Promena znaka', 'Deljenje'],
    'Prvo se množi: $2 · (−3) = −6$, a na kraju oduzima: $5 − (−6) = 11$. Poslednja operacija je na vrhu drveta izraza.', 'operacija',
    { mediji: formula('$5 − 2 · (−3)$'), medijiOdgovora: drvo({ op: '−', v: '11', l: '5', r: { op: '·', v: '−6', l: '2', r: '−3' } }) });
  proveri(5 - 2 * -3 === 11, '5 − 2·(−3)');
  Q(2, 'Koliko je $(−6) : 2 · 3$?',
    ['$−9$', '$−1$', '$9$', '$−36$'],
    'Množenje i deljenje su ravnopravni, pa se računaju sleva nadesno: $(−6) : 2 = −3$, pa $−3 · 3 = −9$. Greška $−1$ nastaje kad se prvo pomnoži $2 · 3$.', 'sleva',
    { mediji: formula('$(−6) : 2 · 3$'), medijiOdgovora: drvo({ op: '·', v: '−9', l: { op: ':', v: '−3', l: '−6', r: '2' }, r: '3' }) });
  proveri((-6 / 2) * 3 === -9, '(−6):2·3');
  Q(2, 'Kolika je vrednost izraza $2x − 1$ za $x = −{1|2}$?',
    ['$−2$', '$0$', '$−3$', '$2$'],
    'Umesto $x$ upisujemo $−{1|2}$: $2 · (−{1|2}) − 1 = −1 − 1 = −2$. Kad zamenjuješ negativan broj, stavi ga u zagradu da ne „pojedeš“ minus.', 'vrednost',
    { mediji: drvo({ op: '−', l: { op: '·', l: '2', r: 'x = −½' }, r: '1' }, { dx: 1.8 }) });
  proveri(je(minus(puta(F(2), F(-1, 2)), F(1)), F(-2)), '2x − 1');
  Q(2, 'Koliko je ${2|5} · 7 + {3|5} · 7$?',
    ['$7$', '$14$', '${7|5}$', '${42|25}$'],
    'Zakon distributivnosti: $({2|5} + {3|5}) · 7 = 1 · 7 = 7$. Dva dela koja čine ceo pomnožena istim brojem daju taj broj.', 'zakon',
    { mediji: g([...traka(5, [0, 1], { w: 8, h: 1.2, b: 1 }), ...traka(5, [2, 3, 4], { w: 8, h: 1.2, b: 2 }).filter((x) => x.gusto), { tx: '2/5', at: [1.6, 1.8], vel: 17, b: 1 }, { tx: '3/5', at: [5.6, 1.8], vel: 17, b: 2 }], 260) });
  proveri(je(plus(puta(F(2, 5), F(7)), puta(F(3, 5), F(7))), F(7)), 'distributivnost 7');
  Q(2, 'Koji izraz odgovara rečenici: „Zbir brojeva $−3$ i $5$ pomnoži njihovom razlikom“?',
    ['$(−3 + 5) · (−3 − 5)$', '$−3 + 5 · (−3 − 5)$', '$(−3 + 5) · 5 − 3$', '$−3 + 5 · 5 − 3$'],
    'Kad se ceo zbir množi, mora biti u zagradi. Vrednost je $2 · (−8) = −16$.', 'zagrada',
    { medijiOdgovora: drvo({ op: '·', v: '−16', l: { op: '+', v: '2', l: '−3', r: '5' }, r: { op: '−', v: '−8', l: '−3', r: '5' } }) });
  proveri((-3 + 5) * (-3 - 5) === -16, 'zbir puta razlika');
  U(2, 'Koji izraz nema vrednost $2$?',
    ['$(−4) : (−2) · (−1)$', '$(−4) : (−2)$', '$(−1) · (−2)$', '$6 + (−4)$'],
    'Sleva nadesno: $(−4) : (−2) = 2$, pa $2 · (−1) = −2$. Ostali izrazi daju $2$.',
    'Stari Egipćani su znali samo razlomke sa brojiocem $1$ (osim ${2|3}$), pa su ${3|4}$ pisali kao ${1|2} + {1|4}$.', 'vrednost');
  proveri((-4 / -2) * -1 === -2 && -4 / -2 === 2 && -1 * -2 === 2 && 6 + -4 === 2, 'uljez izrazi');
  S(2, 'Spoji izraz sa njegovom vrednošću.',
    [['$−3 · 2 + 1$', '$−5$'], ['$−3 · (2 + 1)$', '$−9$'], ['$(−3 + 2) · 1$', '$−1$'], ['$−3 + 2 · 4$', '$5$']],
    'Isti brojevi i iste operacije, a druge zagrade – i rezultat je potpuno drugi.', 'zagrada');
  proveri(-3 * 2 + 1 === -5 && -3 * (2 + 1) === -9 && (-3 + 2) * 1 === -1 && -3 + 2 * 4 === 5, 'spoji izraze');
  Q(2, 'Hleb košta $70$ dinara. Mama je kupila $3$ hleba i platila sa $500$ dinara. Koji izraz daje kusur?',
    ['$500 − 3 · 70$', '$(500 − 3) · 70$', '$500 − 3 + 70$', '$3 · 70 − 500$'],
    'Kusur je $500 − 210 = 290$ dinara. Izraz $3 · 70 − 500$ daje $−290$ – to bi značilo da mama duguje novac.', 'kusur',
    { medijiOdgovora: drvo({ op: '−', v: '290', l: '500', r: { op: '·', v: '210', l: '3', r: '70' } }) });
  Q(3, 'Koliko je $[(−2) · 3 + 4] : (−{1|2})$?',
    ['$4$', '$−4$', '$−1$', '$1$'],
    'U zagradi: $−6 + 4 = −2$. Deljenje sa $−{1|2}$ isto je što i množenje sa $−2$: $(−2) · (−2) = 4$.', 'zagrada',
    { mediji: drvo({ op: ':', l: { op: '+', l: { op: '·', l: '−2', r: '3' }, r: '4' }, r: '−1/2' }) });
  proveri(je(kroz(F(-2 * 3 + 4), F(-1, 2)), F(4)), '[(−2)·3+4]:(−1/2)');
  Q(3, 'Koliko je ${1|2} − {1|2} : {1|2}$?',
    ['$−{1|2}$', '$0$', '${1|2}$', '$1$'],
    'Deljenje ima prednost: ${1|2} : {1|2} = 1$, pa je ${1|2} − 1 = −{1|2}$. Ko prvo oduzme, dobije $0 : {1|2} = 0$.', 'prednost',
    { mediji: formula('$½ − ½ : ½$'), medijiOdgovora: drvo({ op: '−', v: '−1/2', l: '1/2', r: { op: ':', v: '1', l: '1/2', r: '1/2' } }) });
  proveri(je(minus(F(1, 2), kroz(F(1, 2), F(1, 2))), F(-1, 2)), '1/2 − 1/2:1/2');
  Q(3, 'Koji par brojeva ima jednak zbir i proizvod?',
    ['$3$ i ${3|2}$', '$2$ i ${1|2}$', '$3$ i ${1|3}$', '$4$ i ${1|2}$'],
    '$3 + {3|2} = 4{1|2}$ i $3 · {3|2} = 4{1|2}$. Takvih parova ima beskonačno mnogo, npr. $2$ i $2$, ili $5$ i ${5|4}$.', 'zbir',
    { mediji: formula('$a + b = a · b$') });
  proveri(je(plus(F(3), F(3, 2)), puta(F(3), F(3, 2))) && je(plus(F(5), F(5, 4)), puta(F(5), F(5, 4))), 'zbir = proizvod');
  proveri(!je(plus(F(2), F(1, 2)), puta(F(2), F(1, 2))) && !je(plus(F(3), F(1, 3)), puta(F(3), F(1, 3))) && !je(plus(F(4), F(1, 2)), puta(F(4), F(1, 2))), 'netačni parovi');
  Q(3, 'Za koju vrednost $x$ izraz $x : (x − 1)$ nema vrednost?',
    ['$x = 1$', '$x = 0$', '$x = −1$', 'Ima vrednost za svako $x$'],
    'Za $x = 1$ delilac je $1 − 1 = 0$, a nulom se ne deli. Za $x = 0$ izraz postoji i jednak je $0 : (−1) = 0$.', 'delilac',
    { mediji: drvo({ op: ':', l: 'x', r: { op: '−', l: 'x', r: '1' } }) });

  // ══════════ 21. Jednačine sa jednom nepoznatom ══════════
  L('Jednačine sa jednom nepoznatom');
  Q(1, 'Šta je rešenje jednačine?',
    ['Broj koji, zamenjen umesto nepoznate, daje tačnu jednakost', 'Broj koji stoji desno od znaka „=“', 'Svaki broj veći od nule', 'Slovo $x$'],
    'Vaga u ravnoteži je dobra slika jednačine: rešenje je ona težina kutije $x$ pri kojoj su tasovi tačno izjednačeni. Znak „=“ izmislio je Velšanin Robert Rekord 1557. godine, jer „ništa nije jednakije od dve paralelne crte“.', 'rešenje',
    { mediji: vaga(['x', '2'], ['5']) });
  Q(1, 'Za koje $x$ je vaga u ravnoteži: $x + 4 = 1$?',
    ['$x = −3$', '$x = 3$', '$x = 5$', '$x = −5$'],
    'Sa obe strane skinemo $4$: $x = 1 − 4 = −3$. U skupu prirodnih brojeva ova jednačina ne bi imala rešenje – tek negativni brojevi je „spasavaju“.', 'kutija',
    { mediji: vaga(['x', '4'], ['1']), medijiOdgovora: vaga(['x'], ['−3']) });
  proveri(-3 + 4 === 1, 'x + 4 = 1');
  Q(1, 'Šta smemo da uradimo sa jednačinom, a da „vaga“ ostane u ravnoteži?',
    ['Da istom broju dodamo obe strane', 'Da broj dodamo samo levoj strani', 'Da samo levu stranu pomnožimo sa $2$', 'Da obe strane pomnožimo nulom pa podelimo'],
    'Šta god uradiš jednoj strani, uradi i drugoj – pa vaga ostaje u ravnoteži. Zapisuje se kratko, npr. „$/ + 5$“.', 'ravnoteža',
    { mediji: vaga(['x', '−2'], ['7']), medijiOdgovora: vaga(['x', '−2', '5'], ['7', '5'], { natpis: '/ + 5' }) });
  Q(1, 'Reši jednačinu $7 − x = 10$.',
    ['$x = −3$', '$x = 3$', '$x = 17$', '$x = −17$'],
    'Nepoznati umanjilac: $x = 7 − 10 = −3$. Provera: $7 − (−3) = 10$ ✓. Oduzimanje negativnog broja povećava rezultat.', 'umanjilac',
    { mediji: vaga(['7', '−x'], ['10']) });
  proveri(7 - -3 === 10, '7 − x = 10');
  Q(1, 'Koji matematičar je prvi označavao nepoznate poslednjim slovima abecede ($x$, $y$, $z$)?',
    ['Rene Dekart', 'Pitagora', 'Euklid', 'Isak Njutn'],
    'U knjizi „Geometrija“ iz 1637. Dekart je poznate veličine označavao prvim slovima ($a$, $b$, $c$), a nepoznate poslednjim ($x$, $y$, $z$). Tako je ostalo do danas.', 'Dekart',
    { mediji: vaga(['x', 'y'], ['z']) });
  Q(2, 'Reši jednačinu $−{1|3}x = 2$.',
    ['$x = −6$', '$x = 6$', '$x = −{2|3}$', '$x = 1{2|3}$'],
    'Obe strane množimo recipročnim brojem $−3$: $x = 2 · (−3) = −6$. Provera: $−{1|3} · (−6) = 2$ ✓.', 'činilac',
    { mediji: vaga(['−1/3 · x'], ['2']), medijiOdgovora: vaga(['x'], ['−6']) });
  proveri(je(puta(F(-1, 3), F(-6)), F(2)), '−1/3 x = 2');
  Q(2, 'Reši jednačinu $x : 4 = −{3|4}$.',
    ['$x = −3$', '$x = −{3|16}$', '$x = 3$', '$x = −{1|3}$'],
    'Nepoznati deljenik = količnik · delilac: $x = −{3|4} · 4 = −3$. Na vagi: obe strane pomnožimo sa $4$ („$/ · 4$“).', 'deljenik',
    { mediji: vaga(['x : 4'], ['−3/4']), medijiOdgovora: vaga(['x'], ['−3'], { natpis: '/ · 4' }) });
  proveri(je(kroz(F(-3), F(4)), F(-3, 4)), 'x : 4 = −3/4');
  Q(2, 'Kojim brojem nikad ne smemo da pomnožimo ili podelimo obe strane jednačine?',
    ['Nulom', 'Brojem $−1$', 'Brojem ${1|2}$', 'Brojem $100$'],
    'Deljenje nulom nije dozvoljeno, a množenjem nulom svaka jednačina postaje $0 = 0$ i rešenje se „izgubi“. Ako ti se to desi u računu – vrati se i traži grešku.', 'nula',
    { mediji: vaga(['3x'], ['12'], { natpis: '/ : ?' }) });
  Q(2, 'Koliko rešenja ima jednačina $0 · x = 0$?',
    ['Beskonačno mnogo – svaki broj', 'Nijedno', 'Tačno jedno: $x = 0$', 'Dva: $0$ i $1$'],
    'Svaki broj pomnožen nulom daje $0$, pa je svaki broj rešenje. Jednačina $0 · x = 3$ je suprotan slučaj – nema nijedno rešenje.', 'beskonačno',
    { mediji: formula('$0 · x = 0$'), medijiOdgovora: g([osa(-5, 5), { lin: [[-5.4, 0.3], [5.4, 0.3]], b: 2, debljina: 5, crtaj: 1 }], 300) });
  Q(2, 'Temperatura je ujutru bila $4 °C$, a uveče $−3 °C$. Kako se promenila?',
    ['Pala je za $7 °C$', 'Pala je za $1 °C$', 'Porasla je za $7 °C$', 'Pala je za $3 °C$'],
    'Jednačina $4 + x = −3$ daje $x = −3 − 4 = −7$: promena je $−7$, tj. pad za $7$ stepeni. Najveći zabeleženi dnevni pad temperature (u Montani, SAD, 1916) bio je čak oko $56 °C$ za jedan dan!', 'temperatura',
    { mediji: g([...termometar(4, { od: -10, doo: 10, korak: 5, x: 0, b: 1 }), ...termometar(-3, { od: -10, doo: 10, korak: 5, x: 4, b: 0 }), { tx: 'ujutru', at: [0.6, -2], vel: 14 }, { tx: 'uveče', at: [4.6, -2], vel: 14 }], 220) });
  proveri(4 + -7 === -3, 'temperatura');
  U(2, 'Koja jednačina ima drugačije rešenje od ostalih?',
    ['$3 − x = 1$', '$x + 3 = 1$', '$2x = −4$', '$x : (−2) = 1$'],
    'Jednačina $3 − x = 1$ ima rešenje $x = 2$, a ostale tri imaju rešenje $x = −2$.',
    'Jednačine koje imaju isto rešenje zovu se ekvivalentne. Svaki korak „vage“ pravi novu, ekvivalentnu jednačinu, sve jednostavniju.', 'rešenje');
  proveri(3 - 2 === 1 && -2 + 3 === 1 && 2 * -2 === -4 && -2 / -2 === 1, 'uljez jednačine');
  S(2, 'Spoji jednačinu sa njenim rešenjem.',
    [['$x + 5 = 2$', '$−3$'], ['$x − 5 = 2$', '$7$'], ['$5x = 2$', '${2|5}$'], ['$x : 5 = 2$', '$10$']],
    'Iste brojke, a četiri različite operacije – i četiri različita rešenja. Uvek proveri: zameni rešenje u jednačinu.', 'rešenje');
  Q(3, 'Reši jednačinu $2x + 1 = x − 3$.',
    ['$x = −4$', '$x = −2$', '$x = 4$', '$x = −{2|3}$'],
    'Sa obe strane skinemo po jednu kutiju $x$: $x + 1 = −3$, pa $x = −4$. Provera: $2 · (−4) + 1 = −7$ i $−4 − 3 = −7$ ✓.', 'kutija',
    { mediji: vaga(['x', 'x', '1'], ['x', '−3']), medijiOdgovora: vaga(['x', '1'], ['−3'], { natpis: '/ − x' }) });
  proveri(2 * -4 + 1 === -4 - 3, '2x + 1 = x − 3');
  Q(3, 'Ako je $−x = 4$, koliko je $x$?',
    ['$x = −4$', '$x = 4$', '$x = {1|4}$', '$x = −{1|4}$'],
    '$−x$ je isto što i $(−1) · x$. Množenjem obe strane sa $−1$ dobijamo $x = −4$. Ova jednačina zbunjuje jer se „minus“ lako previdi.', 'suprotan',
    { mediji: vaga(['−x'], ['4']) });
  Q(3, 'Zagonetka sa Diofantovog groba: detinjstvo mu je trajalo šestinu života, mladost dvanaestinu, oženio se posle još sedmine, a sin mu se rodio pet godina kasnije. Sin je poživeo pola očevog veka, a otac je umro četiri godine posle sina. Koliko je godina živeo Diofant?',
    ['$84$', '$72$', '$60$', '$90$'],
    'Jednačina ${x|6} + {x|12} + {x|7} + 5 + {x|2} + 4 = x$ ima rešenje $x = 84$. Lako je i bez računa: broj mora biti deljiv sa $6$, $12$, $7$ i $2$, a takav je samo $84$ od ponuđenih.', 'Diofant',
    { mediji: g([...[[14, 0, '1/6'], [7, 1, '1/12'], [12, 2, '1/7'], [5, 3, '5 g.'], [42, 4, '1/2'], [4, 5, '4 g.']].reduce((acc, [d, b, t], i) => { const x0 = acc.x; acc.e.push(pr(r(x0 / 7), 0, r(d / 7), 1.2, { b, gusto: 1 })); acc.e.push({ tx: t, at: [r((x0 + d / 2) / 7), i % 2 ? -0.75 : 1.65], vel: 14 }); acc.x += d; return acc; }, { x: 0, e: [] }).e, { tx: '? godina', at: [6, 3], vel: 17, b: 3 }, { lin: [[0, 2.5], [12, 2.5]], b: 3, debljina: 1.5 }], 300) });
  proveri(84 / 6 + 84 / 12 + 84 / 7 + 5 + 84 / 2 + 4 === 84 && 84 % 6 === 0 && 72 % 7 !== 0 && 60 % 7 !== 0 && 90 % 7 !== 0, 'Diofant 84');

  // ══════════ 22. Nejednačine sa jednom nepoznatom ══════════
  L('Nejednačine sa jednom nepoznatom');
  Q(1, 'Šta znači prazan kružić ○ na kraju skupa rešenja na brojevnoj pravoj?',
    ['Taj broj ne pripada skupu rešenja', 'Taj broj pripada skupu rešenja', 'Na tom mestu je nula', 'Tu prestaje brojevna prava'],
    'Prazan kružić stoji uz znake $<$ i $>$, a pun kružić ● uz $≤$ i $≥$. Na slici je skup rešenja $x > 2$.', 'kružić',
    { mediji: g([osa(-3, 6), ...zrak(2, false, false, -3, 6)], 300) });
  Q(1, 'Koji skup rešenja je nacrtan na brojevnoj pravoj?',
    ['$x ≤ −1$', '$x < −1$', '$x ≥ −1$', '$x > −1$'],
    'Zrak ide ulevo – manji brojevi, a kružić je pun – i $−1$ je rešenje. Znake $≤$ i $≥$ prvi je upotrebio francuski naučnik Pjer Buger 1734. godine.', 'zrak',
    { mediji: g([osa(-5, 3), ...zrak(-1, true, true, -5, 3)], 300) });
  Q(1, 'Šta se dešava sa znakom nejednakosti kad obe strane pomnožiš negativnim brojem?',
    ['Okreće se ($<$ postaje $>$)', 'Ostaje isti', 'Postaje znak $=$', 'Nestaje'],
    'Primer: $2 < 5$, a posle množenja sa $−1$: $−2 > −5$. Na brojevnoj pravoj se slika „preslika“ preko nule, pa veći broj postaje manji. Vaga „klacne“ na drugu stranu.', 'znak',
    { mediji: vaga(['5'], ['2'], { nagib: 1, znak: '>' }), medijiOdgovora: vaga(['−5'], ['−2'], { nagib: -1, znak: '<', natpis: '/ · (−1)' }) });
  proveri(-5 < -2, '−5 < −2');
  Q(1, 'Menja li se znak nejednakosti kad obema stranama dodaš $−5$?',
    ['Ne menja se', 'Menja se', 'Menja se samo ako je $x$ negativno', 'Postaje znak $≥$'],
    'Sabiranje i oduzimanje istog broja na obe strane nikad ne menja znak – vaga ostaje nagnuta na istu stranu. Znak menjaju samo množenje i deljenje negativnim brojem.', 'dodavanje',
    { mediji: vaga(['x', '5'], ['3'], { nagib: 1, znak: '>' }), medijiOdgovora: vaga(['x'], ['−2'], { nagib: 1, znak: '>', natpis: '/ + (−5)' }) });
  Q(2, 'Koji od označenih brojeva je rešenje nejednačine $x > −2$?',
    ['$−1$', '$−2$', '$−3$', '$−2,5$'],
    'Veći od $−2$ su brojevi desno od njega na brojevnoj pravoj. $−2$ nije rešenje jer nije veći od samog sebe.', 'veći',
    { mediji: A.brojevna(-4, 2, [[-3, '', 3], [-2.5, '', 3], [-2, '', 3], [-1, '', 3]], { podela: 0.5, svaki: 1 }), medijiOdgovora: g([osa(-4, 2, 2, { svaki: 2 }), ...zrak(-2, false, false, -4, 2), ...tacke([-1], { b: 1 })], 300) });
  Q(2, 'Reši nejednačinu $−x < 3$.',
    ['$x > −3$', '$x < −3$', '$x > 3$', '$x < 3$'],
    'Množimo sa $−1$ i okrećemo znak: $x > −3$. Provera: $x = 0$ daje $0 < 3$ ✓, a $x = −5$ daje $5 < 3$ ✗.', 'okretanje',
    { mediji: vaga(['−x'], ['3'], { nagib: -1, znak: '<' }), medijiOdgovora: g([osa(-6, 3), ...zrak(-3, false, false, -6, 3)], 300) });
  Q(2, 'Reši nejednačinu $3x ≥ −6$.',
    ['$x ≥ −2$', '$x ≤ −2$', '$x ≥ 2$', '$x ≥ −3$'],
    'Delimo sa pozitivnim brojem $3$ – znak ostaje isti: $x ≥ −2$. Minus na desnoj strani ne utiče na znak – važno je samo čime delimo.', 'deljenje',
    { mediji: vaga(['3x'], ['−6'], { nagib: 1, znak: '≥' }), medijiOdgovora: g([osa(-5, 3), ...zrak(-2, false, true, -5, 3)], 300) });
  Q(2, 'Koliko prirodnih brojeva zadovoljava nejednačinu $x < 4$?',
    ['$3$', '$4$', '$5$', 'Beskonačno mnogo'],
    'To su $1$, $2$ i $3$. Kad bismo gledali cele brojeve, rešenja bi bilo beskonačno mnogo: i $0$, $−1$, $−2$…', 'prirodni',
    { mediji: g([osa(-3, 6), ...zrak(4, true, false, -3, 6)], 300), medijiOdgovora: g([osa(-3, 6), ...zrak(4, true, false, -3, 6), ...tacke([1, 2, 3])], 300) });
  Q(2, 'Koliko celih brojeva zadovoljava nejednačinu $x < 4$?',
    ['Beskonačno mnogo', '$4$', '$3$', '$7$'],
    'Celi brojevi idu ulevo bez kraja: $3, 2, 1, 0, −1, −2, …$ Zato skup rešenja ucrtavamo kao zrak sa strelicom.', 'celi',
    { mediji: g([osa(-6, 6), ...zrak(4, true, false, -6, 6)], 300) });
  Q(2, 'Ko je prvi upotrebio znake $<$ i $>$?',
    ['Tomas Heriot', 'Rene Dekart', 'Gotfrid Lajbnic', 'Pitagora'],
    'Engleski matematičar i astronom Tomas Heriot; znaci su objavljeni u njegovoj knjizi 1631, deset godina posle njegove smrti. Heriot je među prvima posmatrao Mesec teleskopom – čak pre Galileja.', 'znak',
    { mediji: vaga(['7'], ['3'], { nagib: 1, znak: '>' }) });
  U(2, 'Koji broj nije rešenje nejednačine $2x − 1 < 5$?',
    ['$3$', '$2$', '$−3$', '$2,9$'],
    'Rešenje je $x < 3$. Za $x = 3$ dobija se $5 < 5$, što nije tačno.',
    'Granica skupa rešenja je rešenje odgovarajuće jednačine $2x − 1 = 5$, tj. $x = 3$ – zato se granica i nalazi tako što se reši jednačina.', 'granica',
    { mediji: g([osa(-4, 5), ...tacke([-3, 2, 2.9, 3], { b: 3 })], 300) });
  proveri(2 * 3 - 1 === 5 && 2 * 2 - 1 < 5 && 2 * -3 - 1 < 5 && 2 * 2.9 - 1 < 5, 'uljez nejednačine');
  S(2, 'Spoji nejednačinu sa njenim skupom rešenja.',
    [['$x + 2 > 0$', '$x > −2$'], ['$−x > 2$', '$x < −2$'], ['$2x < 0$', '$x < 0$'], ['$−2x < 0$', '$x > 0$']],
    'Kod $−x > 2$ i $−2x < 0$ deli se negativnim brojem, pa se znak okreće.', 'rešenje');
  Q(3, 'Koji su celi brojevi rešenja dvostruke nejednačine $−2 ≤ x < 1$?',
    ['$−2, −1, 0$', '$−1, 0$', '$−2, −1, 0, 1$', '$−1, 0, 1$'],
    'Levi kraj je uključen (≤, pun kružić), a desni nije (<, prazan kružić).', 'interval',
    { mediji: g([osa(-4, 3), { lin: [[-2, 0.3], [1, 0.3]], b: 2, debljina: 5 }, { tx: '●', at: [-2, 0.2], b: 2, vel: 22 }, { tx: '○', at: [1, 0.2], b: 2, vel: 22 }], 300), medijiOdgovora: g([osa(-4, 3), { lin: [[-2, 0.3], [1, 0.3]], b: 2, debljina: 5 }, { tx: '●', at: [-2, 0.2], b: 2, vel: 22 }, { tx: '○', at: [1, 0.2], b: 2, vel: 22 }, ...tacke([-2, -1, 0])], 300) });
  Q(3, 'Reši nejednačinu $−{x|3} ≥ 1$.',
    ['$x ≤ −3$', '$x ≥ −3$', '$x ≥ 3$', '$x ≤ −{1|3}$'],
    'Množimo obe strane sa $−3$ i okrećemo znak: $x ≤ −3$. Provera: $x = −6$ daje $2 ≥ 1$ ✓.', 'okretanje',
    { mediji: vaga(['−x/3'], ['1'], { nagib: 1, znak: '≥' }), medijiOdgovora: g([osa(-6, 2), ...zrak(-3, true, true, -6, 2)], 300) });
  Q(3, 'Imaš $1 000$ dinara i već si potrošio $300$ na kokice. Ulaznica košta $250$ dinara. Koliko najviše ulaznica možeš da kupiš?',
    ['$2$', '$3$', '$4$', '$2,8$'],
    '$300 + 250u ≤ 1 000$ daje $u ≤ 2,8$. Pošto se kupuju cele ulaznice, najviše su $2$ (tri bi koštale $750$, a ostalo je samo $700$).', 'ulaznica',
    { mediji: vaga(['300', '250·u'], ['1 000'], { nagib: -1, znak: '≤' }), medijiOdgovora: g([osa(0, 4, 5, { svaki: 5 }), ...zrak(2.8, true, true, 0, 4), ...tacke([1, 2])], 300) });
  proveri(300 + 2 * 250 <= 1000 && 300 + 3 * 250 > 1000, 'ulaznice');
  Q(3, 'Koji je od brojeva $−3$ i $−5$ veći, i zašto?',
    ['$−3$, jer je desno od $−5$ na brojevnoj pravoj', '$−5$, jer je $5 > 3$', 'Jednaki su po apsolutnoj vrednosti', '$−5$, jer je dalje od nule'],
    'Od dva negativna broja veći je onaj koji je bliži nuli. Dug od $3$ dinara je „bolji“ od duga od $5$ dinara.', 'veći',
    { mediji: A.brojevna(-6, 1, [[-5, '−5', 3], [-3, '−3', 3]]) });
};
