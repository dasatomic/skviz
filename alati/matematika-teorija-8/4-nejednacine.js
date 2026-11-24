// Lekcije 3.10–3.14 (drugi deo poglavlja „Linearne jednačine i nejednačine“): nejednačine i skup rešenja
// (intervali), ekvivalentne nejednačine, linearna nejednačina, rešavanje i primene.
// Crteži: intervali na brojevnoj pravoj (zrak, otvoren/zatvoren kraj, presek uslova), vage sa nagibom
// (nejednačina kao vaga koja nije u ravnoteži), grafik kx + n sa delom iznad/ispod x-ose, brojevna prava
// sa celim brojevima, stubići i pravougaonici za primene. Pitanja su sopstvenim rečima i sa sopstvenim brojevima.
const { interval, terazije } = require('../zadaci-8/prostor');
const { brojevna } = require('../zadaci-6/osnova');
const { stubici } = require('../zadaci-7/osnova');

module.exports = ({ L, Q, U, S, G, proveri }) => {

  // ── pomoćni crteži ──
  // više uslova na istoj brojevnoj pravoj, jedan iznad drugog (prvi je dole); u = { a, b?, levo?, ukljA?, ukljB?, boja? }
  // bez b: zrak od a (ulevo uz levo: true, inače udesno)
  function uslovi(lista, od, doo, velicina = 320) {
    const el = [{ osa: [od, doo], podela: 1 }];
    const h0 = 0.3 * Math.max(1, (doo - od) / 12);
    lista.forEach((u, i) => {
      const y = h0 * (i + 1);
      const b = u.boja ?? i + 1;
      const kraj = u.b === undefined ? (u.levo ? od - 0.3 : doo + 0.3) : u.b;
      el.push({ lin: [[u.a, y], [kraj, y]], b, debljina: 5 });
      el.push({ tx: u.ukljA ? '●' : '○', at: [u.a, y - 0.05], b, vel: 20 });
      if (u.b !== undefined) el.push({ tx: u.ukljB ? '●' : '○', at: [u.b, y - 0.05], b, vel: 20 });
    });
    return G(od <= 0 && doo >= 0 ? { O: [0, 0] } : {}, el, { bezImena: ['O'], velicina });
  }
  // deo prave y = kx + n iznad (ili ispod) x-ose; istakni: crta se taj deo podebljano
  function pravaX(k, n, { iznad = true, istakni = false, od = -5, doo = 5, velicina = 260 } = {}) {
    const f = (x) => k * x + n;
    const yv = [f(od), f(doo), 0];
    const my = [Math.min(...yv) - 0.8, Math.max(...yv) + 0.8];
    const x0 = -n / k;
    const e = [
      { mreza: [od - 0.5, doo + 0.5, my[0], my[1]], ose: ['x', 'y'] },
      { lin: [[od, f(od)], [doo, f(doo)]], b: 1, debljina: 2 },
    ];
    if (istakni) {
      const deo = (k > 0) === iznad ? [[x0, 0], [doo, f(doo)]] : [[od, f(od)], [x0, 0]];
      e.push({ lin: deo, b: 2, debljina: 6 });
    }
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina });
  }
  // pravougaonik sa stranicama (oznake kao tekst)
  const pravoug = (a, b, oa, ob) => G({ A: [0, 0], B: [a, 0], C: [a, b], D: [0, b] },
    [{ p: 'ABCD', b: 0 }, { d: 'AB', o: oa }, { d: 'BC', o: ob }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 220 });
  // kvadrat sa stranicom x
  const kvadrat = () => G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] },
    [{ p: 'ABCD', b: 0 }, { d: 'AB', o: 'x' }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 200 });

  // provera računa (gradnja pukne ako ne važi)
  proveri(4 * -3 - 3 < 6 * -3 + 5 && !(4 * -4 - 3 < 6 * -4 + 5), 'x > −4 za 4x − 3 < 6x + 5');
  proveri(3 * (-4 - 1) === 4 * -4 + 1, 'granica x = −4 za 3(x − 1) ≥ 4x + 1');
  proveri(14 / 3 > 4 && 14 / 3 < 5 && -3 * -5 > 12 && -3 * -4 === 12 && 7 - 3 * 2 === 1, '3x − 5 < 9, −3x > 12, 7 − 3x > 1');
  proveri(-2 * -4 > 6 && !(-2 * -3 > 6), 'granica x = −3 za −2x > 6');
  proveri(150 + 40 * 8 <= 500 && 150 + 40 * 9 > 500, 'taksi: 8 km, ne 9 km');
  proveri(25 * 5 + 15 * 5 === 200 && 25 * 6 + 15 * 4 > 200, 'sveske: najviše 5');
  proveri(Math.abs((80 * 88 + 40 * 16) / (88 + 40) - 60) < 1e-9, 'mešavina: granica x = 88 l');
  proveri(4 * 4 - 7 < 10 && 4 * 4.25 - 7 === 10, 'x < 4,25 → najveći ceo 4');
  proveri(3 + 4 + 3 + 4 === 14 && 14 / 4 === 3.5 && 3 + 4 + 3 + 3 < 14, 'ocene: četvrta mora biti bar 4');
  proveri(12 + 13 + 14 === 39 && 39 < 40 && 13 + 14 + 15 > 40, 'tri uzastopna: 14');
  proveri(300 + 20 * 10 === 500 && 300 + 20 * 11 > 500, 'gigabajti: 10');
  proveri((-1 - 2) * (-1 + 2) > (-1 - 1) * (-1 + 3) && !((0 - 2) * (0 + 2) > (0 - 1) * (0 + 3)), 'nejednačina (x−2)(x+2) > (x−1)(x+3) za x < −1/2');
  proveri((-0.5 - 2) * (-0.5 + 2) === (-0.5 - 1) * (-0.5 + 3), 'granica x = −1/2');

  // ════════ 3.10. Nejednačine ════════
  L('Nejednačine');
  Q(1, 'Koja nejednačina ima prikazan skup rešenja na brojevnoj pravoj?',
    ['$x ≤ 2$', '$x < 2$', '$x ≥ 2$', '$x > 2$'],
    'Puna tačka znači da broj pripada skupu, prazan kružić da ne pripada. Zrak koji ide ulevo opisuje manje od ili jednako.', 'zrak',
    { mediji: interval(-3, 6, { a: 2, levo: true, ukljA: true }) });
  Q(1, 'Vaga je nagnuta na levu stranu. Koji znak nejednakosti važi između izraza $A$ i $B$?',
    ['$A > B$', '$A < B$', '$A = B$', '$A ≤ B$'],
    'Vaga koja nije u ravnoteži prikazuje nejednačinu. Teža strana ima veću vrednost. Znak nejednakosti pokazuje ka manjem izrazu, kao ugao koji „gleda“ manji broj.', 'vaga',
    { mediji: terazije([{ tx: 'A', b: 1 }], [{ tx: 'B', b: 2 }], { nagib: 1 }) });
  Q(1, 'Koji od ponuđenih brojeva je rešenje nejednačine $x + 2 > 5$?',
    ['$4$', '$3$', '$2$', '$1$'],
    'Ako je $x = 3$, leva strana je tačno 5, a nejednakost je stroga. Zato 3 nije rešenje, a brojevi veći od 3 jesu.', 'rešenje',
    { mediji: brojevna(0, 7, []) });
  Q(1, 'Koji je skup rešenja prikazan na crtežu?',
    ['$(−2, 4]$', '$[−2, 4)$', '$(−2, 4)$', '$[−2, 4]$'],
    'Zagrada ( ili ) znači da kraj ne pripada skupu, a uglasta [ ili ] da pripada. Ista oznaka važi i za beskonačnost, kod nje je uvek okrugla zagrada.', 'interval',
    { mediji: interval(-3, 5, { a: -2, b: 4, ukljB: true }) });
  Q(2, 'Koji je zapis skupa rešenja zraka prikazanog na crtežu?',
    ['$(−∞, 3)$', '$(−∞, 3]$', '$(3, ∞)$', '$[3, ∞)$'],
    'Simbol ∞ nije broj, pa se uz njega uvek piše okrugla zagrada. Simbol −∞ je beskonačnost ulevo, a ∞ udesno.', 'beskonačno',
    { mediji: interval(-2, 6, { a: 3, levo: true }) });
  Q(2, 'Koji je najmanji ceo broj u skupu rešenja prikazanom na crtežu?',
    ['$−2$', '$−3$', '$−1$', '$0$'],
    'Krajevi ovog intervala nisu celi brojevi, pa se gleda ceo broj koji je tačno u intervalu. Najmanji je prvi ceo broj desno od levog kraja, a levi kraj −2,5 nije ceo broj.', 'najmanji',
    { mediji: interval(-4, 3, { a: -2.5, b: 1, ukljA: true, ukljB: true }) });
  Q(2, 'Crtež prikazuje dva uslova, jedan ispod drugog: dole zrak udesno od −1 (bez tačke na −1), a gore zrak ulevo od 4 (sa tačkom na 4). Koji je skup koji zadovoljava oba uslova?',
    ['$(−1, 4]$', '$(−1, 4)$', '$[−1, 4]$', '$(−∞, 4]$'],
    'Presek dva uslova je deo na kome se preklapaju oba crteža. Levi kraj je iz prvog uslova, a desni iz drugog.', 'presek',
    { mediji: uslovi([{ a: -1, boja: 1 }, { a: 4, levo: true, ukljA: true, boja: 2 }], -4, 6) });
  Q(2, 'Koliko celih brojeva ima u skupu rešenja nejednačine $−3 < x ≤ 2$?',
    ['5', '4', '6', '3'],
    'Celi brojevi u skupu su −2, −1, 0, 1 i 2. Broj −3 ne pripada, a broj 2 pripada.', 'celi',
    { mediji: interval(-4, 3, { a: -3, b: 2, ukljB: true }) });
  Q(3, 'Koji je najveći ceo broj u skupu rešenja nejednačine $x ≤ −1$?',
    ['−1', '−2', '−4', '−3'],
    'Svi brojevi manji od −1 i sam −1 pripadaju skupu. Najveći je sam kraj −1, jer on pripada skupu (znak ≤).', 'najveći',
    { mediji: interval(-5, 3, { a: -1, levo: true, ukljA: true }) });
  Q(1, 'Koji zapis odgovara rečenici: broj $x$ je veći od −3, a manji ili jednak 5?',
    ['$−3 < x ≤ 5$', '$−3 ≤ x < 5$', '$−5 < x ≤ 3$', '$3 < x ≤ 5$'],
    'Stroga nejednakost važi za levi kraj, a nestroga za desni. Zapis u intervalu je (−3, 5].', 'spoj',
    { mediji: brojevna(-6, 6, [[-3, '−3', 1], [5, '5', 2]]), medijiOdgovora: interval(-6, 7, { a: -3, b: 5, ukljB: true }) });
  U(1, 'Koji zapis NIJE nejednačina?',
    ['$7 + x$', '$7 + x > 2$', '$x ≤ 7$', '$3 < 5$'],
    'Izraz $7 + x$ nema znak nejednakosti (<, >, ≤, ≥), pa je samo izraz. Ostali zapisi imaju znak nejednakosti.',
    'Znak nejednakosti ne mora da bude između promenljivih: i $3 < 5$ je nejednakost, ali bez nepoznate.', 'izraz', { mediji: interval(-3, 9, { a: 7, levo: true, ukljA: true }) });
  S(2, 'Poveži znak nejednakosti sa rečima koje ga opisuju.',
    [['$<$', 'manje od'], ['$≤$', 'manje ili jednako'], ['$>$', 'veće od'], ['$≥$', 'veće ili jednako']],
    'Znak ≤ sastavljen je od znaka < i znaka jednakosti, pa obuhvata i graničnu vrednost.', 'znak', { mediji: brojevna(0, 6, [[2, 'a', 1], [4, 'b', 2]]) });
  Q(3, 'Na brojevnoj pravoj su tačke 3 i 5 istaknute. Koji je skup rešenja nejednačine $3 ≤ x < 5$?',
    ['$[3, 5)$', '$(3, 5]$', '$[3, 5]$', '$(3, 5)$'],
    'Tačka 3 je zatvoren kraj jer je znak ≤, a tačka 5 je otvoren kraj jer je znak <.', 'kraj',
    { mediji: interval(1, 7, { a: 3, b: 5, ukljA: true }) });

  Q(3, 'Kakav je presek skupova $(−∞, −2)$ i $(1, 5)$?',
    ['prazan skup', '$(1, 5)$', '$(−∞, −2)$', '$(−2, 1)$'],
    'Prvi skup su brojevi manji od −2, a drugi brojevi između 1 i 5. Nijedan broj nije u oba, pa je presek prazan.', 'presek',
    { mediji: uslovi([{ a: -2, levo: true, boja: 1 }, { a: 1, b: 5, boja: 2 }], -5, 6) });
  Q(1, 'Koji je najmanji prirodni broj u skupu rešenja nejednačine $x ≥ 2$?',
    ['2', '1', '3', '0'],
    'Broj 2 pripada skupu jer je znak ≥, a broj 1 nije u skupu jer je manji od 2.', 'prirodan',
    { mediji: interval(-1, 6, { a: 2, ukljA: true }) });
  Q(1, 'Kod kog zapisa broj 3 pripada skupu rešenja?',
    ['$x ≥ 3$', '$x > 3$', '$x < 3$', '$x ≠ 3$'],
    'Kod znaka ≥ granični broj pripada skupu, a kod > i < ne pripada. Zapis $x ≠ 3$ isključuje baš taj broj.', 'granica',
    { mediji: brojevna(0, 6, [[3, '3', 2]]) });

  // ════════ 3.11. Ekvivalentne nejednačine ════════
  L('Ekvivalentne nejednačine');
  Q(1, 'Ako obema stranama nejednačine dodamo isti broj, šta se dešava sa znakom nejednakosti?',
    ['ostaje isti', 'menja se u suprotan', 'nestaje', 'postaje znak jednakosti'],
    'Ako dodamo isti teg na obe posude vage, vaga ostaje nagnuta na istu stranu. Zato je sabiranje istog broja ekvivalentna transformacija.', 'sabiranje',
    { mediji: terazije(['x', 3], [8], { nagib: 1 }), medijiOdgovora: terazije(['x', 3, { tx: '5', b: 3 }], [8, { tx: '5', b: 3 }], { nagib: 1 }) });
  Q(1, 'Ako obe strane nejednačine pomnožimo POZITIVNIM brojem 2, šta se dešava sa znakom nejednakosti?',
    ['ostaje isti', 'okreće se', 'briše se', 'postaje ≠'],
    'Množenje pozitivnim brojem čuva redosled brojeva na brojevnoj pravoj, pa znak ostaje isti.', 'pozitivan',
    { mediji: terazije(['x'], [3], { nagib: 1 }), medijiOdgovora: terazije(['x', 'x'], [3, 3], { nagib: 1 }) });
  Q(1, 'Ako obe strane nejednačine $x > 3$ pomnožimo NEGATIVNIM brojem −1, koja nejednakost se dobija?',
    ['$−x < −3$', '$−x > −3$', '$−x > 3$', '$−x = −3$'],
    'Pri množenju negativnim brojem znak se okreće: od $x > 3$ dobijamo $−x < −3$. Na vagi se teža strana zamenjuje lakšom.', 'negativan',
    { mediji: terazije(['x'], [3], { nagib: 1 }), medijiOdgovora: terazije([{ tx: '−x', b: 1 }], [{ tx: '−3', b: 2 }], { nagib: -1 }) });
  Q(2, 'Kada su dve nejednačine ekvivalentne?',
    ['kad imaju isti skup rešenja', 'kad imaju isti znak', 'kad imaju isti broj članova', 'kad su obe linearne'],
    'Nejednačine su ekvivalentne ako svaki broj koji reši jednu rešava i drugu, i obrnuto. Zapis može biti potpuno drugačiji.', 'ekvivalent',
    { mediji: interval(-1, 6, { a: 2, b: 5, ukljA: true, ukljB: true }) });
  Q(2, 'Koja nejednačina je ekvivalentna sa $x + 3 > 7$?',
    ['$x > 4$', '$x > 10$', '$x < 4$', '$x ≥ 4$'],
    'Ako sa obe strane oduzmemo 3, dobijamo $x > 4$. Zapis sa ≥ bi uključio broj 4, a on ne zadovoljava nejednakost.', 'oduzimanje',
    { mediji: terazije([{ tx: 'x + 3', b: 1 }], [{ tx: '7', b: 3 }], { nagib: 1 }), medijiOdgovora: interval(0, 8, { a: 4 }) });
  Q(2, 'Koja nejednačina je ekvivalentna sa $2x < 8$?',
    ['$x < 4$', '$x < 6$', '$x > 4$', '$x ≤ 4$'],
    'Deljenjem obe strane pozitivnim brojem 2 dobijamo $x < 4$. Broj $4$ ne pripada skupu, jer je $2 · 4 = 8$, a nejednakost je stroga.', 'deljenje',
    { mediji: terazije(['x', 'x'], [8], { nagib: -1 }), medijiOdgovora: interval(-2, 6, { a: 4, levo: true }) });
  Q(2, 'Da li je nejednačina $x > 2$ ekvivalentna sa $x^{2} > 4$?',
    ['Ne, jer je −3 rešenje druge, a nije prve', 'Da, jer je $2^{2} = 4$', 'Da, jer su obe nejednačine pozitivne', 'Ne, jer $x^{2}$ nikad nije veće od 4'],
    'Kvadriranjem se gubi informacija o znaku. Broj −3 zadovoljava $x^{2} > 4$, ali ne zadovoljava $x > 2$.', 'kvadrat',
    { mediji: interval(-5, 5, { a: 2 }), medijiOdgovora: uslovi([{ a: 2 }, { a: -2, levo: true, boja: 2 }], -5, 5) });
  Q(3, 'Koja nejednačina je ekvivalentna sa $3 − x < 5$?',
    ['$x > −2$', '$x < −2$', '$x > 2$', '$x < 8$'],
    'Ako oduzmemo 3 sa obe strane, dobijamo $−x < 2$. Deljenjem sa −1 znak se okreće: $x > −2$.', 'znak',
    { mediji: terazije([3, { tx: '−x', b: 1 }], [5], { nagib: -1 }), medijiOdgovora: interval(-5, 4, { a: -2 }) });
  Q(2, 'Koja nejednačina je ekvivalentna sa $\\frac{x}{3} ≤ 2$?',
    ['$x ≤ 6$', '$x ≥ 6$', '$x ≤ \\frac{2}{3}$', '$x ≤ 5$'],
    'Množenjem obe strane pozitivnim brojem 3 dobijamo $x ≤ 6$. Množenje je ekvivalentna transformacija kad je broj pozitivan.', 'razlomak',
    { mediji: terazije([{ tx: 'x : 3', b: 1 }], [{ tx: '2', b: 3 }], { nagib: -1 }), medijiOdgovora: interval(0, 8, { a: 6, levo: true, ukljA: true }) });
  Q(3, 'Ako je $a < b$ i $b < c$, koja nejednakost je tačna?',
    ['$a < c$', '$a > c$', '$a = c$', '$c < a$'],
    'Ovo je osobina prelaza: ako je prvi broj manji od drugog, a drugi manji od trećeg, onda je prvi manji od trećeg.', 'poredak',
    { mediji: brojevna(0, 6, [[1, 'a', 1], [3, 'b', 2], [5, 'c', 3]]) });
  Q(3, 'Ako je $a < b$ i $c < 0$, koja nejednakost je tačna?',
    ['$ac > bc$', '$ac < bc$', '$ac = bc$', '$a + c > b + c$'],
    'Množenje negativnim brojem c okreće znak. Dodavanje c na obe strane ne menja znak, pa je $a + c < b + c$.', 'okretanje',
    { mediji: brojevna(-4, 3, [[-2, 'a', 1], [1, 'b', 2]]) });
  U(2, 'Koja nejednačina NIJE ekvivalentna sa $x > 5$?',
    ['$x^{2} > 25$', '$x − 5 > 0$', '$5 < x$', '$2x > 10$'],
    'Za $x = −6$ važi $x^{2} > 25$ (jer je 36 > 25), ali $x > 5$ ne važi. Ostale nejednačine imaju isti skup rešenja.',
    'Kvadriranje nije ekvivalentna transformacija, jer dodaje rešenja sa negativnim znakom.', 'ekvivalent', { mediji: interval(0, 9, { a: 5 }) });
  S(2, 'Poveži nejednačinu sa ekvivalentnom nejednačinom.',
    [['$x + 2 < 5$', '$x < 3$'], ['$3x > 6$', '$x > 2$'], ['$−x < 4$', '$x > −4$'], ['$−2x ≥ 6$', '$x ≤ −3$']],
    'Pri deljenju ili množenju negativnim brojem znak se okreće, kao u trećem i četvrtom paru.', 'parovi', { mediji: terazije([{ tx: 'x + 2', b: 1 }], [{ tx: '5', b: 3 }], { nagib: -1 }) });
  Q(1, 'Ako od nejednačine $x − 5 > 2$ dodamo 5 na obe strane, šta dobijamo?',
    ['$x > 7$', '$x > 3$', '$x > −3$', '$x < 7$'],
    'Dodavanjem 5 sa obe strane leva strana postaje $x$, a desna $2 + 5 = 7$. Znak ostaje isti.', 'dodavanje',
    { mediji: terazije([{ tx: 'x − 5', b: 1 }], [{ tx: '2', b: 3 }], { nagib: 1 }), medijiOdgovora: terazije([{ tx: 'x', b: 1 }], [{ tx: '7', b: 3 }], { nagib: 1 }) });
  Q(2, 'Ako je $x < 2$, koja je nejednačina ekvivalentna sa njom posle dodavanja 7 na obe strane?',
    ['$x + 7 < 9$', '$x + 7 > 9$', '$x − 7 < 9$', '$x + 7 < 2$'],
    'Na obe strane dodajemo 7: leva strana je $x + 7$, desna $2 + 7 = 9$. Znak ostaje isti.', 'dodavanje',
    { mediji: interval(-2, 5, { a: 2, levo: true }) });

  Q(1, 'Koja nejednačina je ekvivalentna sa $x ≥ 2$?',
    ['$2 ≤ x$', '$2 ≥ x$', '$x ≤ 2$', '$x > 2$'],
    'Zamena strana menja znak, pa je $2 ≤ x$ isto što i $x ≥ 2$. Zapis $2 ≥ x$ bi značio $x ≤ 2$.', 'zamena',
    { mediji: interval(-1, 5, { a: 2, ukljA: true }) });
  Q(2, 'Koja nejednačina je ekvivalentna sa $−x > 4$?',
    ['$x < −4$', '$x > −4$', '$x < 4$', '$x > 4$'],
    'Množenjem obe strane sa −1 znak se okreće, pa je $x < −4$.', 'okretanje',
    { mediji: terazije([{ tx: '−x', b: 1 }], [{ tx: '4', b: 3 }], { nagib: 1 }), medijiOdgovora: interval(-6, 2, { a: -4, levo: true }) });

  // ════════ 3.12. Linearna nejednačina ════════
  L('Linearna nejednačina');
  Q(1, 'Koja od ovih nejednačina je linearna po $x$?',
    ['$3x − 5 > 2$', '$x^{2} + 1 > 0$', '$\\frac{1}{x} < 2$', '$x^{2} < 9$'],
    'Linearna nejednačina ima nepoznatu samo na prvom stepenu i nema je u imeniocu.', 'linearna',
    { mediji: terazije([{ tx: '3x − 5', b: 1 }], [{ tx: '2', b: 3 }], { nagib: 1 }) });
  U(1, 'Koja od ovih NIJE linearna nejednačina po $x$?',
    ['$x^{2} + 1 > 0$', '$2x − 3 ≤ 5$', '$4 − x < 0$', '$7 > 3x$'],
    'Kod $x^{2}$ nepoznata je na drugom stepenu, pa nejednačina nije linearna. Ostale imaju $x$ samo na prvom stepenu.',
    'Stepen nepoznate određuje da li je nejednačina linearna, a ne broj članova.', 'stepen', { mediji: terazije([{ tx: 'x²', b: 1 }], [{ tx: '1', b: 3 }], { nagib: 1 }) });
  Q(1, 'Kakav je opšti oblik linearne nejednačine po $x$?',
    ['$ax + b < 0$', '$ax^{2} + b < 0$', '$ax + by < 0$', '$x < y^{2}$'],
    'Opšti oblik je $ax + b$ sa poznatim realnim brojevima $a$ i $b$, i jednim od znakova <, >, ≤, ≥.', 'oblik', { mediji: terazije([{ tx: 'ax + b', b: 1 }], [{ tx: '0', b: 3 }], { nagib: -1 }) });
  Q(2, 'Koja je linearna nejednačina čiji je skup rešenja $x > 2$?',
    ['$3x > 6$', '$3x < 6$', '$3x > 9$', '$−3x > −6$'],
    'Deljenjem sa 3 dobijamo $x > 2$. Ostale nejednačine daju drugačije skupove: $x > 3$ ili $x < 2$.', 'rešenje',
    { mediji: interval(-1, 6, { a: 2 }), medijiOdgovora: terazije([{ tx: '3x', b: 1 }], [{ tx: '6', b: 3 }], { nagib: 1 }) });
  Q(1, 'Koji je koeficijent uz $x$ u nejednačini $5 − 2x ≥ 1$?',
    ['−2', '2', '5', '−5'],
    'Koeficijent je broj ispred nepoznate, uz znak. Član $−2x$ ima koeficijent −2, a broj 5 je slobodan član.', 'koeficijent',
    { mediji: terazije([5, { tx: '−2x', b: 1 }], [1], { nagib: 1 }) });
  Q(1, 'Koji je slobodan član u nejednačini $3x + 7 < 0$?',
    ['7', '3', '−7', '0'],
    'Slobodan član je broj bez nepoznate, a ovde je to 7. Broj 3 je koeficijent uz $x$.', 'slobodan',
    { mediji: terazije([{ tx: '3x + 7', b: 1 }], [{ tx: '0', b: 3 }], { nagib: -1 }) });
  Q(2, 'Za koje $x$ je prava $y = −x + 2$ iznad x-ose, tj. za koje je $−x + 2 > 0$?',
    ['$x < 2$', '$x > 2$', '$x > −2$', '$x < −2$'],
    'Prava je iznad x-ose kad joj je y pozitivno. Ona prelazi x-osu u tački $x = 2$ i ide naniže udesno.', 'iznad',
    { mediji: pravaX(-1, 2), medijiOdgovora: pravaX(-1, 2, { istakni: true }) });
  Q(2, 'Na crtežu je prava $y = 2x − 3$. Za koje $x$ je ona ISPOD x-ose?',
    ['$x < 1{,}5$', '$x > 1{,}5$', '$x < −1{,}5$', '$x > −1{,}5$'],
    'Ispod x-ose je deo gde je $2x − 3 < 0$, tj. $x < 1{,}5$. Zato je leva strana prave ispod x-ose.', 'ispod',
    { mediji: pravaX(2, -3), medijiOdgovora: pravaX(2, -3, { iznad: false, istakni: true }) });
  Q(2, 'Koji zapis je linearna nejednačina sa koeficijentom 4 uz $x$ i slobodnim članom −7?',
    ['$4x − 7 < 0$', '$4x^{2} − 7 < 0$', '$4 − 7x < 0$', '$x − 7 < 4$'],
    'Linearna nejednačina ima oblik $ax + b < 0$. Ovde je $a = 4$, $b = −7$. Ostali zapisi imaju kvadrat, drugi koeficijent ili pogrešan slobodan član.', 'koeficijent', { mediji: terazije([{ tx: '4x', b: 1 }], [{ tx: '7', b: 3 }], { nagib: -1 }) });
  Q(3, 'Za koju vrednost $a$ koeficijent uz $x$ u nejednačini $(a − 2)x > 4$ postaje nula?',
    ['$a = 2$', '$a = 0$', '$a = 4$', '$a = −2$'],
    'Koeficijent je $a − 2$. On je nula kad je $a = 2$, a tada nejednačina postaje $0 · x > 4$.', 'koeficijent',
    { mediji: terazije([{ tx: '(a − 2)x', b: 1 }], [{ tx: '4', b: 3 }], { nagib: 1 }) });
  Q(3, 'Za koju vrednost parametra $a$ nejednačina $ax > −6$ ima rešenje $x < 2$?',
    ['$a = −3$', '$a = 3$', '$a = −6$', '$a = 6$'],
    'Deljenjem sa $a$ dobijamo $x > −6/a$ za $a > 0$, a za $a < 0$ znak se okreće: $x < −6/a$. Za $a = −3$ je $−6/a = 2$, pa je $x < 2$.', 'parametar', { mediji: terazije([{ tx: 'ax', b: 1 }], [{ tx: '−6', b: 3 }], { nagib: 1 }) });
  Q(3, 'Koji je skup rešenja nejednačine $0 · x > 5$ u skupu realnih brojeva?',
    ['Nijedan broj (prazan skup)', 'Jedan broj', 'Beskonačno mnogo brojeva', 'Pet brojeva'],
    'Za svaki broj $x$ leva strana je 0, a 0 nije veće od 5. Zato nejednačina nema rešenja.', 'prazan',
    { mediji: terazije([{ tx: '0 · x', b: 1 }], [{ tx: '5', b: 3 }], { nagib: -1 }) });
  Q(3, 'Koji je skup rešenja nejednačine $0 · x < 5$?',
    ['$S = ℝ$', '$S = ∅$', '$x = 0$', '$x < 5$'],
    'Leva strana je uvek 0, a 0 je manje od 5 za svaki realan broj $x$. Zato su rešenja svi realni brojevi.', 'realni', { mediji: brojevna(-2, 6, []) });
  Q(3, 'Za koje realne brojeve $x$ je nejednačina $x + 2 > x − 3$ tačna?',
    ['za svaki realan broj $x$', 'ni za jedan', 'samo za $x > 5$', 'samo za pozitivne $x$'],
    'Nepoznata se sa obe strane poništava i ostaje $2 > −3$, što je uvek tačno. Skup rešenja je ceo skup realnih brojeva.', 'identitet', { mediji: brojevna(-3, 3, []) });
  S(2, 'Poveži nejednačinu sa vrstom: linearna ili nije.',
    [['$2x − 1 < 3$', 'linearna'], ['$x^{2} > 4$', 'x na drugom stepenu'], ['$\\frac{1}{x} ≤ 2$', 'x u imeniocu'], ['$5 < 7$', 'nema nepoznate']],
    'Samo prva nejednačina ima $x$ samo na prvom stepenu i van imenioca, pa je jedina linearna.', 'linearna', { mediji: terazije([{ tx: 'x²', b: 1 }], [{ tx: '4', b: 3 }], { nagib: 1 }) });

  Q(1, 'Koliko nepoznatih ima nejednačina $2x + 3y > 5$?',
    ['2', '1', '3', '5'],
    'Nepoznate su $x$ i $y$. Zato se ova nejednačina ne svodi na linearnu po jednoj nepoznatoj.', 'nepoznata',
    { mediji: terazije([{ tx: '2x + 3y', b: 1 }], [{ tx: '5', b: 3 }], { nagib: 1 }) });

  // ════════ 3.13. Rešavanje linearnih nejednačina ════════
  L('Rešavanje linearnih nejednačina');
  Q(1, 'Reši nejednačinu $x + 3 > 7$.',
    ['$x > 4$', '$x > 10$', '$x < 4$', '$x > −4$'],
    'Prebacimo 3 na desnu stranu sa suprotnim znakom: $x > 7 − 3 = 4$.', 'prenos',
    { mediji: terazije([{ tx: 'x + 3', b: 1 }], [{ tx: '7', b: 3 }], { nagib: 1 }), medijiOdgovora: terazije(['x'], [{ tx: '4', b: 3 }], { nagib: 1 }) });
  Q(1, 'Kako se član prebacuje sa jedne strane nejednačine na drugu?',
    ['uz suprotan znak', 'bez promene znaka', 'uz isti znak', 'tako što se množi sa 2'],
    'Prebacivanje člana je ekvivalentna transformacija: sabiranje istog broja s obe strane, pa njegov znak postaje suprotan.', 'prenos',
    { mediji: terazije(['x', 3], [9], { nagib: 1 }), medijiOdgovora: terazije(['x'], [9, { tx: '−3', b: 2 }], { nagib: 1 }) });
  Q(2, 'Vaga pokazuje nejednačinu $4x − 3 < 6x + 5$. Koji skup rešenja će se pojaviti na brojevnoj pravoj?',
    ['$x > −4$', '$x < −4$', '$x > 4$', '$x < 4$'],
    'Prebacimo $4x$ desno, a $5$ levo: $−8 < 2x$, pa je $x > −4$. Nepoznate je zgodno skupljati na stranu gde je koeficijent veći – tako izbegnemo deljenje negativnim brojem.', 'rešavanje',
    { mediji: terazije([{ tx: '4x − 3', b: 1 }], [{ tx: '6x + 5', b: 2 }], { nagib: -1 }), medijiOdgovora: interval(-7, 2, { a: -4 }) });
  Q(2, 'Koji skup rešenja ima nejednačina $3(x − 1) ≥ 4x + 1$?',
    ['$x ≤ −4$', '$x ≥ −4$', '$x ≤ 4$', '$x ≥ 4$'],
    'Posle množenja zagrade je $3x − 3 ≥ 4x + 1$, pa je $−4 ≥ x$. Zapis „$−4 ≥ x$“ čitamo s desna: $x ≤ −4$, a granica je uključena jer je znak ≥.', 'zagrada',
    { mediji: terazije([{ tx: '3(x − 1)', b: 1 }], [{ tx: '4x + 1', b: 2 }], { nagib: -1 }), medijiOdgovora: interval(-7, 2, { a: -4, levo: true, ukljA: true }) });
  Q(2, 'Koji skup rešenja ima nejednačina $−3x > 12$?',
    ['$x < −4$', '$x > −4$', '$x < 4$', '$x > 4$'],
    'Delimo sa $−3$, pa se znak okreće: $x < −4$. Provera: za $x = −5$ je $−3 \\cdot (−5) = 15 > 12$.', 'okretanje',
    { mediji: terazije([{ tx: '−3x', b: 1 }], [{ tx: '12', b: 3 }], { nagib: 1 }), medijiOdgovora: interval(-7, 2, { a: -4, levo: true }) });
  Q(2, 'Zašto se znak nejednakosti okrene pri rešavanju $−2x > 6$?',
    ['Delimo negativnim brojem', 'Delimo pozitivnim brojem', 'Sabiramo negativan broj', 'Oduzimamo 6 sa obe strane'],
    'Kad obe strane delimo ili množimo negativnim brojem, redosled brojeva se obrće, pa se znak nejednakosti okreće.', 'negativan',
    { mediji: terazije([{ tx: '−2x', b: 1 }], [{ tx: '6', b: 3 }], { nagib: 1 }) });
  Q(3, 'Reši nejednačinu $\\frac{x}{2} − 1 ≤ \\frac{x}{3}$.',
    ['$x ≤ 6$', '$x ≥ 6$', '$x ≤ 3$', '$x ≤ −6$'],
    'Množenjem sa 6 dobijamo $3x − 6 ≤ 2x$, pa je $x ≤ 6$.', 'razlomci',
    { mediji: terazije([{ tx: 'x/2 − 1', b: 1 }], [{ tx: 'x/3', b: 2 }], { nagib: -1 }), medijiOdgovora: interval(0, 9, { a: 6, levo: true, ukljA: true }) });
  Q(3, 'Koji je najveći ceo broj za koji važi $3x − 5 < 9$?',
    ['4', '5', '3', '14'],
    'Dobijamo $3x < 14$, pa je $x < 4\\frac{2}{3}$. Najveći ceo broj levo od $4\\frac{2}{3}$ je 4 – broj 5 je već van skupa.', 'najveći',
    { mediji: brojevna(0, 6, []), medijiOdgovora: interval(0, 6, { a: 4.667, levo: true }) });
  Q(3, 'Koji skup rešenja ima nejednačina $7 − 3x > 1$?',
    ['$x < 2$', '$x > 2$', '$x < −2$', '$x > −2$'],
    'Prebacimo 7: $−3x > −6$. Delimo sa $−3$ i okrećemo znak: $x < 2$. Česta greška je zaboraviti okretanje i dobiti $x > 2$.', 'znak',
    { mediji: terazije([7, { tx: '−3x', b: 1 }], [1], { nagib: 1 }), medijiOdgovora: interval(-2, 5, { a: 2, levo: true }) });
  Q(3, 'Reši nejednačinu $(x − 2)(x + 2) > (x − 1)(x + 3)$.',
    ['$x < −\\frac{1}{2}$', '$x > −\\frac{1}{2}$', '$x < \\frac{1}{2}$', '$x > \\frac{1}{2}$'],
    'Kvadratni članovi se poništavaju: $x^{2} − 4 > x^{2} + 2x − 3$, pa je $−1 > 2x$, tj. $x < −\\frac{1}{2}$.', 'kvadrati', { mediji: terazije([{ tx: '(x − 2)(x + 2)', b: 1 }], [{ tx: '(x − 1)(x + 3)', b: 2 }], { nagib: 1 }) });
  Q(2, 'Koji je skup rešenja nejednačine $3x > 3x + 1$?',
    ['prazan skup', 'skup svih realnih brojeva', '$x > 1$', '$x < 1$'],
    'Posle poništavanja ostaje $0 > 1$, što nije tačno ni za jedan broj. Skup rešenja je prazan.', 'prazan', { mediji: brojevna(-2, 4, []) });
  Q(2, 'Ako je $a > b$, koja je tačna nejednakost?',
    ['$−a < −b$', '$−a > −b$', '$−a = −b$', '$a − b < 0$'],
    'Množenjem sa −1 znak se okreće: od $a > b$ dobijamo $−a < −b$. Razlika $a − b$ je pozitivna.', 'suprotan',
    { mediji: brojevna(-3, 3, [[1, 'b', 2], [2, 'a', 1]]) });
  Q(3, 'Za koje $x$ je $3 − 2x > 0$?',
    ['$x < \\frac{3}{2}$', '$x > \\frac{3}{2}$', '$x < −\\frac{3}{2}$', '$x > 3$'],
    'Prebacimo 3: $−2x > −3$, pa delimo sa −2: $x < \\frac{3}{2}$. Prava $y = 3 − 2x$ je iznad x-ose levo od tog broja.', 'iznad',
    { mediji: pravaX(-2, 3), medijiOdgovora: pravaX(-2, 3, { istakni: true }) });
  U(2, 'Koja nejednačina NIJE ekvivalentna sa $−2x < 6$?',
    ['$x < −3$', '$2x > −6$', '$−x < 3$', '$x + 3 > 0$'],
    'Deljenjem sa −2 znak se okreće i dobijamo $x > −3$. Ostale tri nejednačine imaju taj isti skup rešenja.',
    'Ako se znak ne okrene pri deljenju sa negativnim brojem, dobija se pogrešan skup.', 'znak', { mediji: interval(-6, 2, { a: -3 }) });
  S(3, 'Poveži nejednačinu sa njenim rešenjem.',
    [['$x + 4 > 9$', '$x > 5$'], ['$−3x ≤ 6$', '$x ≥ −2$'], ['$2x < −8$', '$x < −4$'], ['$x − 3 ≥ 1$', '$x ≥ 4$']],
    'Kod druge nejednačine deljenje sa −3 okreće znak, pa je $x ≥ −2$.', 'rešenje', { mediji: brojevna(-6, 6, []) });
  Q(1, 'Vaga prikazuje $x − 4 ≤ 3$. Šta dobijamo kad na oba tasa dodamo 4?',
    ['$x ≤ 7$', '$x ≥ 7$', '$x ≤ −1$', '$x < 7$'],
    'Dodamo 4 na obe strane: $x ≤ 7$. Broj 7 pripada skupu jer je nejednakost nestroga (≤).', 'dodavanje',
    { mediji: terazije([{ tx: 'x − 4', b: 1 }], [{ tx: '3', b: 3 }], { nagib: -1 }), medijiOdgovora: interval(0, 9, { a: 7, levo: true, ukljA: true }) });
  Q(2, 'Koji je skup rešenja nejednačine $−x ≥ 2$?',
    ['$x ≤ −2$', '$x ≥ −2$', '$x ≤ 2$', '$x ≥ 2$'],
    'Množenjem sa −1 znak se okreće, pa je $x ≤ −2$. Broj −2 pripada jer je znak ≥.', 'okretanje',
    { mediji: terazije([{ tx: '−x', b: 1 }], [{ tx: '2', b: 3 }], { nagib: 1 }) });
  Q(3, 'Koji je najveći ceo broj x za koji važi $3x − 1 < 5$?',
    ['1', '2', '0', '5'],
    'Dobijamo $3x < 6$, pa je $x < 2$. Broj 2 nije rešenje, a najveći ceo broj manji od 2 je 1.', 'najveći',
    { mediji: brojevna(-2, 4, []) });

  // ════════ 3.14. Primena linearnih nejednačina ════════
  L('Primena linearnih nejednačina');
  Q(1, 'Sa 500 dinara kupujem sokove po 120 dinara. Koliko najviše sokova mogu da kupim?',
    ['4', '5', '3', '6'],
    'Pet sokova košta 600 dinara, a četiri 480 dinara. Zato je najviše četiri.', 'budžet',
    { mediji: brojevna(0, 600, [[500, '500 din', 1]], { podela: 100 }), medijiOdgovora: brojevna(0, 600, [[480, '480', 2], [600, '600', 3]], { podela: 100 }) });
  Q(1, 'Lift može da nosi najviše 400 kg. Ako je prosečna osoba 80 kg, koliko najviše osoba sme da uđe?',
    ['5', '4', '6', '8'],
    'Pet osoba je 400 kg, a to je još dozvoljeno jer je nosivost najviše 400. Šest osoba je 480 kg.', 'nosivost',
    { mediji: brojevna(0, 500, [[400, '400 kg', 2]], { podela: 50 }) });
  Q(1, 'Najveća dozvoljena brzina je 50 km/h. Koja nejednačina važi za brzinu $v$ vozila koje se vozi u skladu sa ograničenjem?',
    ['$v ≤ 50$', '$v < 50$', '$v ≥ 50$', '$v > 50$'],
    'Reč „najviše“ znači da je 50 dozvoljeno, pa je znak ≤. Zapis $v < 50$ bi zabranio baš 50.', 'najviše',
    { mediji: brojevna(0, 80, [[50, '50 km/h', 2]], { podela: 10 }), medijiOdgovora: interval(0, 80, { a: 50, levo: true, ukljA: true }) });
  Q(2, 'Ana ima ocene 3, 4 i 3 iz tri testa. Koju najmanju ocenu mora da dobije na četvrtom testu da prosek bude bar 3,5?',
    ['4', '3', '2', '5'],
    'Zbir četiri ocene mora biti bar $4 · 3{,}5 = 14$. Tri ocene daju 10, pa četvrta mora biti bar 4.', 'prosek',
    { mediji: stubici([['1. test', 3], ['2. test', 4], ['3. test', 3]], { maxY: 5, visina: 5, vrednosti: true }),
      medijiOdgovora: stubici([['1. test', 3], ['2. test', 4], ['3. test', 3], ['4. test', 4]], { maxY: 5, visina: 5, vrednosti: true, istakni: [3] }) });
  Q(2, 'Taksi uzima 150 dinara za polazak i 40 dinara po kilometru. Koliko najviše celih kilometara mogu da pređu za 500 dinara?',
    ['8', '9', '10', '12'],
    'Nejednačina je $150 + 40x ≤ 500$, pa je $x ≤ 8{,}75$. Najveći ceo broj je 8.', 'taksi',
    { mediji: brojevna(0, 12, [], { podela: 1 }) });
  Q(2, 'Zbir tri uzastopna prirodna broja manji je od 40. Koji je najveći od njih?',
    ['14', '13', '12', '15'],
    'Ako je najmanji broj $x$, zbir je $3x + 3 < 40$, pa je $x ≤ 12$. Najveći od tri uzastopna je tada 14.', 'zbir', { mediji: brojevna(0, 20, [], { podela: 1 }) });
  Q(3, 'Ana kupuje sveske (po 25 dinara) i olovke (po 15 dinara), ukupno 10 komada, i ima 200 dinara. Najviše koliko svesaka može da kupi?',
    ['5', '4', '6', '7'],
    'Ako kupi $s$ svesaka, ostaje $10 − s$ olovaka, pa je $25s + 15(10 − s) ≤ 200$, tj. $s ≤ 5$.', 'sveske',
    { mediji: brojevna(0, 10, [], { podela: 1 }) });
  Q(3, 'Jedna pizza košta 450 dinara, a sok 120 dinara. Ima 1000 dinara. Najviše koliko sokova može da kupi uz jednu pizzu?',
    ['4', '5', '3', '6'],
    'Nejednačina je $450 + 120s ≤ 1000$, pa je $s ≤ 4{,}58$. Najviše četiri soka.', 'pica', { mediji: brojevna(0, 1000, [[1000, '1000 din', 1]], { podela: 100 }) });
  Q(3, 'Pomešamo $x$ litara vode na 80 stepeni sa 40 litara vode na 16 stepeni. Za koje $x$ mešavina ima temperaturu ispod 60 stepeni?',
    ['$x < 88$ litara', '$x < 60$ litara', '$x < 40$ litara', '$x > 88$ litara'],
    'Ravnotežna temperatura je $\\frac{80x + 640}{x + 40}$. Nejednačina $80x + 640 < 60x + 2400$ daje $x < 88$.', 'mešavina',
    { mediji: brojevna(0, 120, [], { podela: 10 }), medijiOdgovora: interval(0, 120, { a: 88, levo: true }) });
  Q(2, 'Pretplata na internet košta 300 dinara mesečno, a svaki gigabajt još 20 dinara. Koliko gigabajta najviše mogu da potrošim za 500 dinara?',
    ['10 gigabajta', '9 gigabajta', '11 gigabajta', '12 gigabajta'],
    'Računamo $300 + 20g ≤ 500$, pa je $g ≤ 10$. Za 11 gigabajta bi bilo 520 dinara.', 'pretplata', { mediji: brojevna(0, 600, [[500, '500 din', 1]], { podela: 100 }) });
  U(2, 'Koja nejednačina NIJE ista kao „najviše 5“ (broj je najviše 5)?',
    ['$x ≥ 5$', '$x ≤ 5$', '$5 ≥ x$', '$5 − x ≥ 0$'],
    '„Najviše 5“ znači $x ≤ 5$. Zapis $x ≥ 5$ znači da je broj bar 5, što je suprotno.',
    'Saobraćajni znak „50“ je u stvari nejednačina: brzina $v ≤ 50$ km/h. Granična vrednost je dozvoljena, zato je znak ≤, a ne <.', 'najviše', { mediji: interval(0, 8, { a: 5, levo: true, ukljA: true }) });
  S(1, 'Poveži rečenicu sa nejednačinom.',
    [['najviše 9 bombona', '$x ≤ 9$'], ['bar 18 godina', '$x ≥ 18$'], ['više od 30 minuta', '$t > 30$'], ['manje od 3 kilograma', '$m < 3$']],
    'Reč „najviše“ je ≤, „bar“ je ≥, a „više od“ i „manje od“ su stroge nejednakosti.', 'primena', { mediji: brojevna(0, 40, [], { podela: 5 }) });
  Q(2, 'Stranica kvadrata je $x$ cm. Za koje $x$ je obim manji od 40 cm?',
    ['$x < 10$ cm', '$x < 40$ cm', '$x > 10$ cm', '$x < 4$ cm'],
    'Obim kvadrata je $4x$, pa je $4x < 40$, tj. $x < 10$ cm.', 'obim',
    { mediji: kvadrat() });
  Q(3, 'Pravougaonik ima stranice 6 cm i $x$ cm. Njegov obim je veći od 30 cm. Za koje $x$ to važi?',
    ['$x > 9$ cm', '$x > 24$ cm', '$x > 12$ cm', '$x < 9$ cm'],
    'Obim je $2(6 + x) > 30$, pa je $6 + x > 15$, tj. $x > 9$ cm.', 'obim',
    { mediji: pravoug(6, 4, '6 cm', 'x') });
  Q(2, 'Ako vozim 30 km/h i treba da stignem za manje od 2 sata, koliko najviše kilometara može da bude put?',
    ['manje od 60 km', 'manje od 30 km', 'manje od 15 km', 'manje od 2 km'],
    'Put je $s = 30t$, a $t < 2$, pa je $s < 60$ km.', 'put',
    { mediji: brojevna(0, 80, [], { podela: 10 }), medijiOdgovora: interval(0, 80, { a: 60, levo: true }) });
  Q(1, 'Ana ima 80 dinara. Sladoled košta 30 dinara. Koliko sladoleda najviše može da kupi?',
    ['2', '3', '4', '5'],
    'Tri sladoleda bi koštala 90 dinara, što je više od 80. Dva sladoleda su 60 dinara.', 'sladoled',
    { mediji: brojevna(0, 100, [], { podela: 10 }) });
  Q(3, 'Koji je najveći ceo broj $x$ za koji važi $2x + 5 ≤ 17$?',
    ['6', '7', '5', '8'],
    'Dobijamo $2x ≤ 12$, pa je $x ≤ 6$. Ceo broj 7 bi dao 19, što je previše.', 'najveći',
    { mediji: brojevna(0, 10, []) });
  Q(2, 'Koja nejednačina ima isti smisao kao „najmanje 4 dana“ (broj dana je bar 4)?',
    ['$x ≥ 4$', '$x > 4$', '$x ≤ 4$', '$x < 4$'],
    'Reč „najmanje“ znači bar, pa je znak ≥. Broj 4 pripada skupu, jer je zapis nestroga.', 'najmanje',
    { mediji: interval(0, 8, { a: 4, ukljA: true }) });
};
