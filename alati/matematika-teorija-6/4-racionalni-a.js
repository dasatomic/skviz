// Lekcije 14–18: skup racionalnih brojeva i brojevna prava, različiti zapisi, apsolutna vrednost i
// upoređivanje, sabiranje i oduzimanje, množenje racionalnih brojeva. Sve „u glavi“, kroz crteže:
// brojevna prava sa razlomcima, skokovi, trake, termometar, skupovi N ⊂ Z ⊂ Q, model površine za množenje.
// Pitanja su sopstvenim rečima, po gradivu Matematike 6 (Arhiknjiga).
module.exports = ({ L, Q, U, S, G, O, bez, r, traka, pica, skok, krug, upisi, termometar, proveri, skrati, isti }) => {
  // ── provera računa: razlomak = [brojilac, imenilac] ──
  const F = (a, b = 1) => skrati([a, b]);
  const zb = (x, y) => skrati([x[0] * y[1] + y[0] * x[1], x[1] * y[1]]);
  const ra = (x, y) => skrati([x[0] * y[1] - y[0] * x[1], x[1] * y[1]]);
  const pr = (x, y) => skrati([x[0] * y[0], x[1] * y[1]]);
  const je = (x, y) => isti(x, y);
  const v = (x) => x[0] / x[1];

  // ── crteži ──
  // brojevna prava od..do sa n podeoka po jedinici; brojevi se pišu na svakom `svaki`-tom podeoku;
  // tacke = [[vrednost, natpis, boja, visina natpisa (1 = obično, 2 = više)]]
  function prava(od, doo, n, tacke = [], e = [], { svaki = n, vel = 320 } = {}) {
    const h = (doo - od) * 0.06;
    const el = [{ osa: [od, doo], podela: 1 / n, svaki }];
    for (const [x, nat, b = 1, dy = 1] of tacke) {
      el.push({ tx: '●', at: [r(x), 0], b, vel: 18 });
      if (nat) el.push({ tx: nat, at: [r(x), r(h * (1 + 0.9 * (dy - 1)) * 1.3)], b, vel: 16 });
    }
    return G({}, [...el, ...e], { velicina: vel });
  }
  // rastojanje od a do b iznad prave (apsolutna vrednost), sa natpisom
  const raz = (a, b, natpis, od, doo, { boja = 2, nivo = 2.6 } = {}) => {
    const h = (doo - od) * 0.06, y = r(h * nivo);
    return [
      { lin: [[a, y], [b, y]], b: boja, debljina: 4 },
      { lin: [[a, r(y - h * 0.4)], [a, r(y + h * 0.4)]], b: boja, debljina: 3 },
      { lin: [[b, r(y - h * 0.4)], [b, r(y + h * 0.4)]], b: boja, debljina: 3 },
      ...(natpis ? [{ tx: natpis, at: [r((a + b) / 2), r(y + h * 0.9)], b: boja, vel: 15 }] : []),
    ];
  };
  // skok po pravoj od a do b (visina srazmerna rasponu prave); ispod = skok ulevo, ispod prave
  const sk = (a, b, od, doo, { boja = 1, ispod = false, kasni = 0.3 } = {}) =>
    skok(a, b, { h: (doo - od) * (ispod ? 0.1 : 0.13), boja, ispod, kasni });
  // skupovi N ⊂ Z ⊂ Q (ugnežđeni krugovi), sa elementima u delovima
  function skupovi(uN = [], uZ = [], uQ = [], { vel = 280 } = {}) {
    const e = [
      krug(0, 0, 4.5, { b: 2, prazno: 1 }), krug(-1.2, -0.6, 2.9, { b: 1, prazno: 1 }), krug(-2, -1, 1.5, { b: 0, prazno: 1 }),
      { tx: 'Q', at: [2.6, 2.9], b: 2, vel: 22 }, { tx: 'Z', at: [-0.4, 1.5], b: 1, vel: 22 }, { tx: 'N', at: [-2, -0.05], b: 0, vel: 20 },
      ...upisi(uN, [-2, -1.4], { vel: 15, kolona: 2, razmak: 0.85 }),
      ...upisi(uZ, [0.55, -1.0], { vel: 15, kolona: 2, razmak: 0.85 }),
      ...upisi(uQ, [3.0, 0.4], { vel: 15, kolona: 1, razmak: 0.85 }),
    ];
    return G({}, e, { velicina: vel });
  }
  // pravila znaka: op = '·' ili ':'; ist = indeks istaknutog reda
  function znaci(op = '·', ist = -1) {
    const redovi = [['+', '+', '+'], ['−', '−', '+'], ['+', '−', '−'], ['−', '+', '−']];
    const e = [];
    redovi.forEach(([a, b, c], i) => {
      const y = -i * 1.1, boja = i === ist ? 1 : 4;
      e.push({ tx: `(${a})  ${op}  (${b})  =  (${c})`, at: [0, y], b: boja, vel: i === ist ? 22 : 18 });
    });
    return G({}, [...e, { tx: '', at: [-3, 0.6] }, { tx: '', at: [3, -3.9] }], { velicina: 220 });
  }
  // niz činilaca kao kartice sa znacima (+/−)
  function cinioci(zn) {
    const e = [];
    zn.forEach((z, i) => {
      const x = i * 1.6;
      e.push({ lin: [[x, 0], [x + 1.1, 0], [x + 1.1, 1.1], [x, 1.1]], zatv: 1, gusto: 1, b: z === '−' ? 1 : 2 });
      e.push({ tx: z, at: [r(x + 0.55), 0.45], vel: 24 });
      if (i < zn.length - 1) e.push({ tx: '·', at: [r(x + 1.35), 0.45], vel: 20 });
    });
    return G({}, e, { velicina: Math.min(320, zn.length * 64) });
  }
  // model površine: jedinični kvadrat, a/b kolona i c/d redova; preklop = proizvod
  function pov(a, b, c, d, { s = 4, natpisi = true } = {}) {
    const p = (x, y, w, h, x2) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((q) => q.map(r)), zatv: 1, ...x2 });
    const e = [p(0, 0, s, s, { b: 4, prazno: 1 })];
    e.push(p(0, 0, (s * a) / b, s, { b: 0 }));
    e.push(p(0, 0, s, (s * c) / d, { b: 1 }));
    e.push(p(0, 0, (s * a) / b, (s * c) / d, { b: 3, gusto: 1 }));
    for (let i = 1; i < b; i++) e.push({ lin: [[r((i * s) / b), 0], [r((i * s) / b), s]], b: 4, debljina: 1 });
    for (let j = 1; j < d; j++) e.push({ lin: [[0, r((j * s) / d)], [s, r((j * s) / d)]], b: 4, debljina: 1 });
    if (natpisi) e.push({ tx: `${a}/${b}`, at: [r((s * a) / b / 2), -0.45], b: 0, vel: 16 }, { tx: `${c}/${d}`, at: [-0.6, r((s * c) / d / 2)], b: 1, vel: 16 });
    return G({}, e, { velicina: 220 });
  }
  // jedan ili dva termometra (t u °C), sa natpisima iznad
  const termo = (lista, { od = -10, doo = 10, korak = 5 } = {}) => G(O, lista.flatMap(([t, natpis, b = 1], i) => [
    ...termometar(t, { od, doo, korak, x: i * 3.2, b }),
    ...(natpis ? [{ tx: natpis, at: [i * 3.2 + 0.4, r(doo * 0.12 + 0.9)], b, vel: 16 }] : []),
  ]), { ...bez, velicina: lista.length > 1 ? 220 : 150 });
  // trake (pravougaonici) dužina iz liste, jedna do druge: [[dužina, boja, natpis]]
  const nadovezi = (redovi, { jed = 3, vel = 320 } = {}) => {
    const e = [];
    redovi.forEach((red, j) => {
      let x = 0;
      const y = -j * 1.6;
      for (const [d, b, nat] of red) {
        const w = d * jed;
        e.push({ lin: [[r(x), y], [r(x + w), y], [r(x + w), y + 1], [r(x), y + 1]], zatv: 1, gusto: 1, b });
        if (nat) e.push({ tx: nat, at: [r(x + w / 2), y + 0.45], vel: 14 });
        x += w;
      }
    });
    return G({}, e, { velicina: vel });
  };

  // ════════════════ 14. Skup racionalnih brojeva i brojevna prava ════════════════
  L('Skup racionalnih brojeva i brojevna prava');
  Q(1, 'Kojim slovom se označava skup racionalnih brojeva – svih razlomaka, pozitivnih i negativnih, zajedno sa nulom?',
    ['$Q$', '$Z$', '$N$', '$R$'],
    'Oznaka potiče od italijanske reči quoziente – količnik. Svaki racionalan broj je količnik dva cela broja, a delilac nije nula.', 'količnik',
    { mediji: prava(-3, 3, 2, [[-2.5, '−5/2'], [-1, '−1', 2], [0.5, '1/2', 0], [2, '2', 3]]) });
  Q(1, 'Gde se na brojevnoj pravoj nalaze negativni racionalni brojevi?',
    ['Levo od nule', 'Desno od nule', 'Između 0 i 1', 'Desno od broja 1'],
    'Negativni razlomak je na istom rastojanju od nule kao njegov suprotni broj, samo sa druge strane: $−{3|4}$ je levo, a ${3|4}$ desno od nule. Obe tačke su na rastojanju ${3|4}$ od nule.', 'negativan',
    { mediji: prava(-2, 2, 4, [[-1.5, 'A'], [-0.75, 'B', 2], [1.25, 'C', 0]]),
      medijiOdgovora: prava(-2, 2, 4, [[-1.5, '−3/2'], [-0.75, '−3/4', 2], [1.25, '5/4', 0]], [{ lin: [[-2, 0], [0, 0]], b: 1, debljina: 6 }]) });
  Q(1, 'Koji racionalan broj nije ni pozitivan ni negativan?',
    ['$0$', '$1$', '$−1$', '${1|2}$'],
    'Nula se može zapisati kao razlomak sa bilo kojim imeniocem: ${0|5} = {0|17} = 0$. Ona je jedini broj koji je sam sebi suprotan.', 'nula',
    { mediji: prava(-2, 2, 2, [[-1.5, ''], [-0.5, '', 2], [0.5, '', 0], [1.5, '', 3]]),
      medijiOdgovora: prava(-2, 2, 2, [[0, '0', 3]], [...raz(-2, -0.05, '~negativni', -2, 2, { boja: 1, nivo: 2 }), ...raz(0.05, 2, '~pozitivni', -2, 2, { boja: 2, nivo: 2 })]) });
  U(1, 'Koji od ovih brojeva nije ceo broj?',
    ['$−{3|4}$', '$−5$', '$0$', '${12|4}$'],
    '$−{3|4}$ je između $−1$ i $0$, pa nije ceo. Ostali jesu: $−5$ i $0$ su celi, a ${12|4} = 3$.',
    'Svaki ceo broj je i racionalan: $−5 = {−5|1}$. Zato je skup $Z$ deo skupa $Q$.', 'ceo',
    { mediji: skupovi([], [], []), medijiOdgovora: skupovi(['3 = 12/4'], ['−5', '0'], ['−3/4']) });
  Q(1, 'Koji broj odgovara tački $M$ – tačno na sredini između $−1$ i $0$?',
    ['$−{1|2}$', '${1|2}$', '$−{1|4}$', '$−1$'],
    'Polovina jedinične duži levo od nule je $−{1|2} = −0,5$. Isto toliko desno od nule je ${1|2}$.', 'polovina',
    { mediji: prava(-2, 1, 2, [[-0.5, 'M']], [], { svaki: 2 }) });
  Q(2, 'Kom broju odgovara tačka $A$?',
    ['$−{4|3}$', '$−{2|3}$', '$−{3|4}$', '$−{5|3}$'],
    'Jedinična duž je podeljena na tri dela, pa je svaki podeok jedna trećina. Od nule do $A$ ima četiri trećine ulevo: $−{4|3} = −1{1|3}$.', 'trećina',
    { mediji: prava(-2, 1, 3, [[-4 / 3, 'A']]) });
  Q(2, 'Tačke $A$ i $B$ su na istom rastojanju od nule, sa različitih strana. Tački $A$ odgovara $−{5|3}$. Kom broju odgovara $B$?',
    ['${5|3}$', '${3|5}$', '$−{3|5}$', '$−{5|3}$'],
    'Tačke simetrične u odnosu na nulu odgovaraju suprotnim brojevima. Broj suprotan broju $−{5|3}$ je ${5|3}$.', 'suprotan',
    { mediji: prava(-2, 2, 3, [[-5 / 3, 'A']]),
      medijiOdgovora: prava(-2, 2, 3, [[-5 / 3, '−5/3'], [5 / 3, '5/3', 2]], [...raz(-5 / 3, 0, '5/3', -2, 2, { boja: 1 }), ...raz(0, 5 / 3, '5/3', -2, 2, { boja: 2 })]) });
  Q(2, 'Kako se označava skup negativnih racionalnih brojeva?',
    ['$Q^{−}$', '$Q^{+}$', '$Z^{−}$', '$N^{−}$'],
    'Skup $Q$ je unija tri dela: pozitivni razlomci $Q^{+}$, negativni $Q^{−}$ i nula. Nula ne pripada ni jednom od ta dva dela.', 'skup',
    { mediji: prava(-3, 3, 2, [], [{ lin: [[-3, 0], [-0.08, 0]], b: 1, debljina: 6 }]) });
  Q(3, 'Koliko ima razlomaka sa imeniocem $4$ (brojilac ceo broj) koji su strogo između $−3$ i $−2$?',
    ['$3$', '$4$', '$2$', '$5$'],
    'To su $−{11|4}$, $−{10|4}$ i $−{9|4}$. Jedinična duž se deli na 4 dela, a između krajeva ostaju 3 podeoka – uvek jedan manje od imenioca.', 'imenilac',
    { mediji: prava(-4, -1, 1, [[-3, '−3', 2], [-2, '−2', 2]]),
      medijiOdgovora: prava(-4, -1, 4, [[-11 / 4, '', 1], [-10 / 4, '', 1], [-9 / 4, '', 1]], [], { svaki: 4 }) });
  Q(2, 'Koliko racionalnih brojeva ima između $0$ i $1$?',
    ['Beskonačno mnogo', 'Devet', 'Deset', 'Nijedan'],
    'Između bilo koja dva racionalna broja uvek postoji treći – na primer njihova sredina. Ponavljanjem dobijamo beskonačno mnogo brojeva i na najkraćoj duži.', 'beskonačno',
    { mediji: prava(0, 1, 10, [[0.5, '1/2'], [0.25, '1/4', 2], [1 / 3, '1/3', 0, 2], [0.75, '3/4', 3]], [], { svaki: 10 }) });
  S(2, 'Spoji broj sa najmanjim skupom kome pripada.',
    [['$7$', '$N$ (prirodni)'], ['$0$', '$N_{0}$ (sa nulom)'], ['$−4$', '$Z$ (celi)'], ['$−{3|4}$', '$Q$ (racionalni)']],
    'Skupovi su kao lutke babuške: $N ⊂ N_{0} ⊂ Z ⊂ Q$. Svaki prirodan broj je i ceo, a svaki ceo je i racionalan.', 'skup',
    { mediji: skupovi([], [], []) });
  Q(1, 'Kom skupu pripada broj $−{7|5}$?',
    ['Samo skupu $Q$', 'Skupovima $Z$ i $Q$', 'Skupovima $N$ i $Q$', 'Samo skupu $Z$'],
    '$−{7|5} = −1,4$ nije ceo broj, pa nije ni u $Z$ ni u $N$. Jeste razlomak, dakle racionalan broj.', 'racionalan',
    { mediji: skupovi([], [], []), medijiOdgovora: skupovi(['3'], ['−2', '0'], ['−7/5']) });
  Q(3, 'Koliko celih brojeva ima između $−{11|4}$ i ${9|2}$?',
    ['$7$', '$6$', '$8$', '$9$'],
    '$−{11|4} = −2,75$ i ${9|2} = 4,5$. Između su celi brojevi od $−2$ do $4$: $−2, −1, 0, 1, 2, 3, 4$ – njih sedam.', 'ceo',
    { medijiOdgovora: prava(-3, 5, 1, [[-2.75, '−11/4', 2, 2], [4.5, '9/2', 2, 2], ...[-2, -1, 0, 1, 2, 3, 4].map((x) => [x, '', 1])]) });
  Q(3, 'Koji je najveći negativan razlomak sa imeniocem $11$ i celim brojiocem?',
    ['$−{1|11}$', '$−{10|11}$', '$−{11|11}$', '$−{1|10}$'],
    'Od negativnih brojeva veći je onaj bliži nuli. Najbliži nuli sa imeniocem 11 je $−{1|11}$. ($−{1|10}$ je čak bliži nuli, ali nema imenilac 11.)', 'imenilac',
    { mediji: prava(-1, 0.3, 11, [], [], { svaki: 11 }),
      medijiOdgovora: prava(-1, 0.3, 11, [[-1 / 11, '−1/11', 1]], [], { svaki: 11 }) });
  Q(3, 'Tački $T$ odgovara broj $−{7|4}$. Koji ceo broj je najbliži tački $T$?',
    ['$−2$', '$−1$', '$2$', '$−3$'],
    '$−{7|4} = −1,75$. Do $−2$ ima samo ${1|4}$, a do $−1$ čak ${3|4}$. Kineski matematičari su još pre 2000 godina računali sa negativnim brojevima: crveni štapići su bili pozitivni, a crni negativni.', 'najbliži',
    { mediji: prava(-3, 1, 4, [[-1.75, 'T']]), medijiOdgovora: prava(-3, 1, 4, [[-1.75, 'T']], raz(-2, -1.75, '1/4', -3, 1, { boja: 2 })) });
  proveri(-11 / 4 < -2 && 9 / 2 > 4 && 9 / 2 < 5, 'celi između −11/4 i 9/2');
  proveri(Math.abs(-7 / 4 + 2) < Math.abs(-7 / 4 + 1), '−7/4 bliže −2');

  // ════════════════ 15. Različiti zapisi racionalnih brojeva ════════════════
  L('Različiti zapisi racionalnih brojeva');
  Q(1, 'Čemu je jednak razlomak ${−3|4}$?',
    ['$−{3|4}$', '${3|4}$', '$−{4|3}$', '${4|3}$'],
    'Razlomak je količnik: ${−3|4} = (−3) : 4$. Pozitivan broj podeljen negativnim (ili obrnuto) daje negativan broj, pa je ${−3|4} = {3|−4} = −{3|4}$.', 'količnik',
    { mediji: G({}, pica(4, 3, { R: 2.5 }), { velicina: 180 }), medijiOdgovora: znaci(':', 3) });
  Q(1, 'Čemu je jednak razlomak ${−5|−8}$?',
    ['${5|8}$', '$−{5|8}$', '$−{8|5}$', '${8|5}$'],
    'Kad brojilac i imenilac imaju isti znak, razlomak je pozitivan: ${−5|−8} = (−5) : (−8) = {5|8}$.', 'pozitivan',
    { mediji: G({}, pica(8, 5, { R: 2.5 }), { velicina: 180 }), medijiOdgovora: znaci(':', 1) });
  Q(1, 'Razlomak ${a|b}$ je pozitivan kada…',
    ['brojilac i imenilac imaju isti znak', 'brojilac i imenilac imaju različit znak', 'je brojilac veći od imenioca', 'je imenilac pozitivan'],
    'Pravilo je isto kao kod deljenja celih brojeva. Razlomak je nula kada je brojilac nula, a imenilac nikada ne sme biti nula.', 'znak',
    { mediji: prava(-2, 2, 4, [[-1.25, '−5/4'], [0.75, '3/4', 2], [1.5, '6/4', 0]], [], { svaki: 4 }), medijiOdgovora: znaci(':', 1) });
  Q(1, 'Kako se decimalno zapisuje broj $−{1|4}$?',
    ['$−0,25$', '$−0,4$', '$−1,4$', '$0,25$'],
    'Prvo zapišemo ${1|4} = {25|100} = 0,25$, pa dodamo minus. Decimalni zapis negativnog broja je decimalni zapis suprotnog broja sa znakom minus.', 'decimala',
    { mediji: G({}, pica(4, 1, { R: 2.5 }), { velicina: 180 }), medijiOdgovora: prava(-1, 0.5, 4, [[-0.25, '−0,25']], [], { svaki: 1 }) });
  U(1, 'Koji zapis nije jednak broju $−2$?',
    ['${−2|−1}$', '${−6|3}$', '${4|−2}$', '$−{10|5}$'],
    '${−2|−1} = 2$, jer su brojilac i imenilac istog znaka. Ostala tri su $−2$.',
    'Isti broj ima beskonačno mnogo zapisa u obliku razlomka – svako proširivanje daje novi zapis istog broja.', 'zapis',
    { mediji: prava(-3, 3, 1, [[-2, '−2'], [2, '2', 2]]) });
  Q(2, 'Koji skraćen razlomak je jednak broju $−0,6$?',
    ['$−{3|5}$', '$−{6|100}$', '$−{2|3}$', '$−{1|6}$'],
    '$0,6 = {6|10}$, a skraćivanjem sa 2 dobijamo ${3|5}$. Zato je $−0,6 = −{3|5}$. Kod nas se decimale odvajaju zarezom, a u Engleskoj i SAD tačkom.', 'skraćen',
    { mediji: G({}, traka(10, 6, { w: 8 }), { velicina: 300 }),
      medijiOdgovora: G({}, [...traka(10, 6, { w: 8 }), ...traka(5, 3, { w: 8, y: -1.8, b: 2 })], { velicina: 300 }) });
  Q(2, 'Kako se decimalno zapisuje mešoviti broj $−3{1|4}$?',
    ['$−3,25$', '$−3,14$', '$−2,75$', '$−3,4$'],
    '$3{1|4} = 3 + 0,25 = 3,25$, pa je $−3{1|4} = −3,25$. Pažnja: minus se odnosi na ceo mešoviti broj, i na celi deo i na razlomak.', 'mešoviti',
    { mediji: G({}, [...pica(4, 4, { R: 1.6 }), ...pica(4, 4, { cx: 3.6, R: 1.6 }), ...pica(4, 4, { cx: 7.2, R: 1.6 }), ...pica(4, 1, { cx: 10.8, R: 1.6, b: 2 })], { velicina: 300 }),
      medijiOdgovora: prava(-4, -2, 4, [[-3.25, '−3,25']], [], { svaki: 4 }) });
  Q(2, 'Koji od ovih razlomaka ima konačan decimalni zapis?',
    ['${3|8}$', '${1|3}$', '${2|7}$', '${5|6}$'],
    '${3|8} = 0,375$. Skraćen razlomak ima konačan decimalni zapis samo kad imenilac nema drugih prostih činilaca osim 2 i 5 – a $8 = 2 · 2 · 2$.', 'konačan',
    { mediji: G({}, [...traka(8, 3, { w: 8 }), ...traka(3, 1, { w: 8, y: -1.6, b: 2 }), ...traka(7, 2, { w: 8, y: -3.2, b: 3 }), ...traka(6, 5, { w: 8, y: -4.8, b: 0 })], { velicina: 260 }) });
  Q(2, 'Koliko je ${1|3}$ zapisano decimalno?',
    ['$0,333…$ (trojka se ponavlja)', '$0,3$', '$0,33$', '$3,1$'],
    'Deljenje $1 : 3$ se nikad ne završava – stalno ostaje ostatak 1. Takav zapis se zove beskonačan periodičan. Kod ${1|7} = 0,142857142857…$ ponavlja se čak šest cifara.', 'period',
    { mediji: G({}, traka(3, 1, { w: 9 }), { velicina: 300 }),
      medijiOdgovora: G({}, [...traka(3, 1, { w: 9 }), ...traka(10, 3, { w: 9, y: -1.6, b: 2 }), { tx: '1/3', at: [10, 0.6], vel: 16, b: 1 }, { tx: '0,3', at: [10, -1], vel: 16, b: 2 }], { velicina: 300 }) });
  Q(2, 'Proširi razlomak $−{2|3}$ tako da imenilac bude $12$.',
    ['$−{8|12}$', '$−{6|12}$', '$−{2|12}$', '$−{10|12}$'],
    'Imenilac 3 množimo sa 4 da bismo dobili 12 – isto moramo da uradimo i sa brojiocem: $−{2 · 4|3 · 4} = −{8|12}$. Vrednost se ne menja, samo su delovi sitniji.', 'proširiti',
    { mediji: G({}, traka(3, 2, { w: 9 }), { velicina: 300 }),
      medijiOdgovora: G({}, [...traka(3, 2, { w: 9 }), ...traka(12, 8, { w: 9, y: -1.6, b: 2 })], { velicina: 300 }) });
  S(2, 'Spoji jednake brojeve.',
    [['$−{1|2}$', '$−0,5$'], ['${3|−4}$', '$−0,75$'], ['${−1|−5}$', '$0,2$'], ['$−{6|5}$', '$−1,2$']],
    'Isti racionalan broj ima mnogo zapisa: kao razlomak, kao količnik, kao decimalni broj, pa i kao procenat ($0,2 = 20\\%$).', 'zapis',
    { mediji: prava(-1.5, 0.5, 4, [[-1.2, '', 3], [-0.75, '', 1], [-0.5, '', 0], [0.2, '', 2]], [], { svaki: 4 }) });
  Q(1, 'Zapis ${a|b}$ je isto što i…',
    ['$a : b$', '$b : a$', '$a · b$', '$a − b$'],
    'Razlomačka crta je znak deljenja. Na kalkulatoru je dugme za deljenje ÷ upravo crta sa tačkom gore i tačkom dole – kao razlomak.', 'deljenje',
    { mediji: G({}, [...pica(4, 3, { R: 2.2 }), { tx: '3 : 4', at: [0, -3], vel: 20 }], { velicina: 180 }) });
  Q(3, 'Koji od ovih razlomaka je ceo broj?',
    ['${−18|−6}$', '${−6|−18}$', '${18|−4}$', '${−3|6}$'],
    '${−18|−6} = 18 : 6 = 3$. Ostali su ${1|3}$, $−4,5$ i $−0,5$ – nisu celi. Razlomak je ceo broj kada se brojilac deli imeniocem bez ostatka.', 'ceo',
    { mediji: prava(-5, 4, 2, [[1 / 3, '', 2], [3, '', 1], [-4.5, '', 3], [-0.5, '', 0]], [], { svaki: 2 }) });
  Q(3, 'Koji od ovih brojeva leži između $−0,4$ i $−0,3$?',
    ['$−{7|20}$', '$−{2|5}$', '$−{1|4}$', '$−{9|20}$'],
    '$−{7|20} = −0,35$ – tačno na sredini. $−{2|5} = −0,4$ je kraj, a ne unutrašnjost; $−0,25$ i $−0,45$ su van tog dela prave.', 'između',
    { mediji: prava(-0.5, 0, 20, [], [{ lin: [[-0.4, 0], [-0.3, 0]], b: 1, debljina: 6 }, { tx: '−0,4', at: [-0.4, 0.06], b: 1, vel: 14 }, { tx: '−0,3', at: [-0.3, 0.06], b: 1, vel: 14 }], { svaki: 10 }) });
  Q(3, 'Koliko je ${−7|−4}$ zapisano kao mešoviti broj?',
    ['$1{3|4}$', '$−1{3|4}$', '$−1{4|7}$', '$1{4|7}$'],
    'Prvo znak: dva minusa daju plus, ${−7|−4} = {7|4}$. Zatim: 7 četvrtina su jedna cela (4 četvrtine) i još 3 četvrtine.', 'mešoviti',
    { mediji: G({}, [...pica(4, 4, { R: 2 }), ...pica(4, 3, { cx: 5, R: 2, b: 2 })], { velicina: 240 }) });
  proveri(je(F(-6, 10), F(-3, 5)) && je(F(-2 * 4, 3 * 4), F(-8, 12)), 'zapisi −0,6, −8/12');
  proveri(-7 / 20 > -0.4 && -7 / 20 < -0.3 && !(-1 / 4 < -0.3) && !(-9 / 20 > -0.4), '−7/20 između');
  proveri(-18 / -6 === 3 && 3.25 === 3 + 1 / 4 && 3 / 8 === 0.375, 'zapisi');

  // ════════════════ 16. Apsolutna vrednost i upoređivanje ════════════════
  L('Apsolutna vrednost i upoređivanje racionalnih brojeva');
  Q(1, 'Koliko je $\\|−{3|5}\\|$?',
    ['${3|5}$', '$−{3|5}$', '${5|3}$', '$0$'],
    'Apsolutna vrednost je rastojanje od nule – a rastojanje nikad nije negativno. Tačka $−{3|5}$ je za tri petine levo od nule.', 'apsolutna',
    { mediji: prava(-1, 1, 5, [[-0.6, '−3/5']]), medijiOdgovora: prava(-1, 1, 5, [[-0.6, '−3/5']], raz(-0.6, 0, '3/5', -1, 1)) });
  Q(1, 'Šta pokazuje apsolutna vrednost racionalnog broja?',
    ['Rastojanje njegove tačke od nule', 'Da li je broj pozitivan', 'Koliko je broj veći od 1', 'Broj koji mu je recipročan'],
    'Zato suprotni brojevi imaju istu apsolutnu vrednost: $\\|−2,5\\| = \\|2,5\\| = 2,5$ – obe tačke su jednako daleko od nule.', 'rastojanje',
    { mediji: prava(-3, 3, 2, [[-2.5, '−2,5'], [2.5, '2,5', 2]]),
      medijiOdgovora: prava(-3, 3, 2, [[-2.5, '−2,5'], [2.5, '2,5', 2]], [...raz(-2.5, 0, '2,5', -3, 3, { boja: 1 }), ...raz(0, 2.5, '2,5', -3, 3)]) });
  Q(1, 'Koji je broj veći: $−{1|2}$ ili $−{1|4}$?',
    ['$−{1|4}$', '$−{1|2}$', 'Jednaki su', 'Ne mogu se uporediti'],
    'Na brojevnoj pravoj veći je broj koji je više udesno. $−{1|4}$ je bliže nuli, pa je desno od $−{1|2}$. Kod negativnih brojeva „manji dug“ je veći broj.', 'veći',
    { mediji: termo([[-5, '−5°'], [-2.5, '−2,5°', 2]]), medijiOdgovora: prava(-1, 0.5, 4, [[-0.5, '−1/2'], [-0.25, '−1/4', 2, 2]], [], { svaki: 4 }) });
  Q(1, 'Kod dva negativna broja, manji je onaj koji ima…',
    ['veću apsolutnu vrednost', 'manju apsolutnu vrednost', 'veći imenilac', 'manji brojilac'],
    'Što je negativan broj dalje od nule, to je manji: $−{5|2} < −{1|2}$, jer je $\\|−{5|2}\\| > \\|−{1|2}\\|$.', 'manji',
    { mediji: prava(-3, 0.5, 2, [[-2.5, '−5/2'], [-0.5, '−1/2', 2]]),
      medijiOdgovora: prava(-3, 0.5, 2, [[-2.5, '−5/2'], [-0.5, '−1/2', 2]], [...raz(-2.5, 0, '5/2', -3, 0.5, { boja: 1, nivo: 3.6 }), ...raz(-0.5, 0, '1/2', -3, 0.5)]) });
  U(1, 'Koji izraz nema vrednost $3$?',
    ['$−\\|−3\\|$', '$\\|−3\\|$', '$\\|3\\|$', '$−(−3)$'],
    '$−\\|−3\\| = −3$: prvo izračunamo $\\|−3\\| = 3$, pa ispred stoji minus. Ostali izrazi su jednaki 3.',
    'Oznaku $\\|x\\|$ za apsolutnu vrednost uveo je nemački matematičar Karl Vajerštras 1841. godine.', 'apsolutna',
    { mediji: prava(-4, 4, 1, [[-3, '−3'], [3, '3', 2]]) });
  Q(2, 'Poređaj brojeve od najmanjeg do najvećeg: $−{3|4}$, ${2|3}$, $−1$, $0$.',
    ['$−1 < −{3|4} < 0 < {2|3}$', '$−{3|4} < −1 < 0 < {2|3}$', '$0 < {2|3} < −{3|4} < −1$', '$−1 < 0 < −{3|4} < {2|3}$'],
    'Svaki negativan broj je manji od nule, a nula je manja od svakog pozitivnog. Od dva negativna, $−1$ je dalje od nule, pa je manji.', 'poredak',
    { mediji: prava(-1.5, 1.5, 12, [], [], { svaki: 12 }), medijiOdgovora: prava(-1.5, 1.5, 12, [[-1, '−1'], [-0.75, '−3/4', 2, 2], [0, '0', 0], [2 / 3, '2/3', 3]], [], { svaki: 12 }) });
  Q(2, 'Uporedi ${5|7}$ i ${7|10}$ pomoću unakrsnih proizvoda.',
    ['${5|7} > {7|10}$', '${5|7} < {7|10}$', '${5|7} = {7|10}$', 'Ne mogu se uporediti'],
    'Unakrsni proizvodi: $5 · 10 = 50$ i $7 · 7 = 49$. Pošto je $50 > 49$, prvi razlomak je veći. To je isto kao svođenje na imenilac 70: ${50|70} > {49|70}$.', 'unakrsni',
    { mediji: prava(0, 1, 10, [[0.7, '7/10', 2]], [], { svaki: 10 }), medijiOdgovora: G({}, [...traka(7, 5, { w: 10 }), ...traka(10, 7, { w: 10, y: -1.6, b: 2 }), { tx: '5/7', at: [11, 0.6], b: 1, vel: 16 }, { tx: '7/10', at: [11.1, -1], b: 2, vel: 16 }], { velicina: 320 }) });
  Q(2, 'Koji broj ima veću apsolutnu vrednost: $−2,5$ ili $2$?',
    ['$−2,5$', '$2$', 'Imaju jednake', 'Ne može se znati'],
    '$\\|−2,5\\| = 2,5$, a $\\|2\\| = 2$. Broj $−2,5$ je manji od $2$, ali je dalje od nule – veličina i rastojanje od nule nisu isto.', 'apsolutna',
    { mediji: prava(-3, 3, 2),
      medijiOdgovora: prava(-3, 3, 2, [[-2.5, '−2,5'], [2, '2', 2]], [...raz(-2.5, 0, '2,5', -3, 3, { boja: 1, nivo: 3.6 }), ...raz(0, 2, '2', -3, 3)]) });
  Q(2, 'U ponoć je bilo $−2,5 °C$, a u zoru $−4 °C$. Kada je bilo hladnije?',
    ['U zoru', 'U ponoć', 'Jednako hladno', 'Ne može se znati'],
    '$−4 < −2,5$, pa je u zoru bilo hladnije. Najniža temperatura izmerena u Srbiji je $−39,5 °C$ (Karajukića Bunari na Pešteri, 1985).', 'hladnije',
    { mediji: termo([[-2.5, '~ponoć'], [-4, '~zora', 2]]) });
  Q(2, 'Koji je broj bliži nuli: $−0,3$ ili ${1|4}$?',
    ['${1|4}$', '$−0,3$', 'Jednako su blizu', 'Ne može se znati'],
    'Bliži nuli je broj manje apsolutne vrednosti: $\\|{1|4}\\| = 0,25$, a $\\|−0,3\\| = 0,3$.', 'bliži',
    { mediji: prava(-0.5, 0.5, 20, [], [], { svaki: 10 }),
      medijiOdgovora: prava(-0.5, 0.5, 20, [[-0.3, '−0,3'], [0.25, '1/4', 2]], [...raz(-0.3, 0, '0,3', -0.5, 0.5, { boja: 1 }), ...raz(0, 0.25, '0,25', -0.5, 0.5)], { svaki: 10 }) });
  Q(2, 'Za koliko je $\\|−{4|3}\\|$ veće od $\\|{1|3}\\|$?',
    ['$1$', '${5|3}$', '$−1$', '${4|9}$'],
    '$\\|−{4|3}\\| = {4|3}$ i $\\|{1|3}\\| = {1|3}$, a razlika je ${3|3} = 1$. Uklanjanje znaka minus je prvi korak – tek onda se računa.', 'razlika',
    { mediji: prava(-2, 1, 3, [[-4 / 3, '−4/3'], [1 / 3, '1/3', 2]]),
      medijiOdgovora: prava(-2, 1, 3, [[-4 / 3, '−4/3'], [1 / 3, '1/3', 2]], [...raz(-4 / 3, 0, '4/3', -2, 1, { boja: 1, nivo: 3.6 }), ...raz(0, 1 / 3, '1/3', -2, 1)]) });
  S(2, 'Spoji izraz sa njegovom vrednošću.',
    [['$\\|−0,5\\|$', '${1|2}$'], ['$\\|−{7|4}\\|$', '$1,75$'], ['$\\|{6|−2}\\|$', '$3$'], ['$\\|0\\|$', '$0$']],
    'Apsolutna vrednost razlomka je razlomak apsolutnih vrednosti: $\\|{a|b}\\| = {\\|a\\||\\|b\\|}$.', 'vrednost',
    { mediji: prava(-3, 3, 4, [[-0.5, '', 0], [-1.75, '', 1], [-3, '', 2], [0, '', 3]], [], { svaki: 4 }) });
  Q(3, 'Za koliko celih brojeva $x$ važi $\\|x\\| < {5|2}$?',
    ['$5$', '$4$', '$2$', '$6$'],
    'To su celi brojevi udaljeni od nule manje od $2,5$: $−2, −1, 0, 1, 2$. Ne zaboravi nulu i negativne!', 'ceo',
    { mediji: prava(-4, 4, 2, [], [], { svaki: 2 }),
      medijiOdgovora: prava(-4, 4, 2, [-2, -1, 0, 1, 2].map((x) => [x, '', 1]), [{ lin: [[-2.5, 0], [2.5, 0]], b: 2, debljina: 5 }, { tx: '○', at: [-2.5, 0], b: 2, vel: 18 }, { tx: '○', at: [2.5, 0], b: 2, vel: 18 }], { svaki: 2 }) });
  Q(3, 'Koji je najveći od brojeva $−{5|6}$, $−{7|9}$, $−{4|5}$, $−{3|4}$?',
    ['$−{3|4}$', '$−{5|6}$', '$−{7|9}$', '$−{4|5}$'],
    'Najveći negativan broj je onaj najbliži nuli – sa najmanjom apsolutnom vrednošću. ${3|4} = 0,75$, ${7|9} ≈ 0,78$, ${4|5} = 0,8$, ${5|6} ≈ 0,83$.', 'najveći',
    { mediji: prava(-1, 0, 20, [], [], { svaki: 20 }),
      medijiOdgovora: G({}, [...traka(6, 5, { w: 9, b: 1 }), ...traka(9, 7, { w: 9, y: -1.5, b: 1 }), ...traka(5, 4, { w: 9, y: -3, b: 1 }), ...traka(4, 3, { w: 9, y: -4.5, b: 2 }), ...['5/6', '7/9', '4/5', '3/4'].map((t, i) => ({ tx: t, at: [10.2, 0.6 - 1.5 * i], vel: 15, b: i === 3 ? 2 : 1 }))], { velicina: 260 }) });
  Q(3, 'Za koje prirodne brojeve $n$ važi ${2|3} < {5|n}$?',
    ['$n ∈ \\{1, 2, …, 7\\}$', '$n ∈ \\{1, 2, …, 6\\}$', '$n ∈ \\{1, 2, …, 8\\}$', '$n ∈ \\{4, 5, 6, 7\\}$'],
    'Unakrsno: $2 · n < 3 · 5 = 15$, pa je $n < 7,5$. Za $n = 7$: ${5|7} ≈ 0,71 > 0,67$ ✓, a za $n = 8$: ${5|8} = 0,625$ – premalo.', 'unakrsni',
    { mediji: prava(0, 1, 21, [[2 / 3, '2/3']], [], { svaki: 21 }), medijiOdgovora: G({}, [...traka(3, 2, { w: 9 }), ...traka(7, 5, { w: 9, y: -1.6, b: 2 }), ...traka(8, 5, { w: 9, y: -3.2, b: 3 }), { tx: '2/3', at: [10, 0.6], b: 1, vel: 15 }, { tx: '5/7', at: [10, -1], b: 2, vel: 15 }, { tx: '5/8', at: [10, -2.6], b: 3, vel: 15 }], { velicina: 300 }) });
  proveri(5 * 10 > 7 * 7, '5/7 > 7/10');
  proveri([1, 2, 3, 4, 5, 6, 7, 8].filter((n) => 2 / 3 < 5 / n).length === 7 && !(2 / 3 < 5 / 8), '2/3 < 5/n');
  proveri([-2, -1, 0, 1, 2, 3].filter((x) => Math.abs(x) < 2.5).length === 5, '|x| < 5/2');
  proveri(-3 / 4 > -7 / 9 && -7 / 9 > -4 / 5 && -4 / 5 > -5 / 6, 'poredak negativnih');

  // ════════════════ 17. Sabiranje i oduzimanje racionalnih brojeva ════════════════
  L('Sabiranje i oduzimanje racionalnih brojeva');
  Q(1, 'Koliko je $−{2|5} + {3|5}$?',
    ['${1|5}$', '$−{1|5}$', '$1$', '${1|10}$'],
    'Imenioci su isti, pa sabiramo samo brojioce: ${−2 + 3|5} = {1|5}$. Na pravoj: od $−{2|5}$ skočimo tri petine udesno.', 'zbir',
    { mediji: prava(-1, 1, 5, [[-0.4, '−2/5']], [], { svaki: 5 }),
      medijiOdgovora: prava(-1, 1, 5, [[-0.4, '−2/5'], [0.2, '1/5', 2]], [sk(-0.4, 0.2, -1, 1)], { svaki: 5 }) });
  Q(1, 'Koliko je $−{3|7} − {2|7}$?',
    ['$−{5|7}$', '$−{1|7}$', '${1|7}$', '${5|7}$'],
    'Oduzimanje pozitivnog broja je pomeranje ulevo: od $−{3|7}$ još dve sedmine levo, do $−{5|7}$.', 'razlika',
    { mediji: prava(-1, 1, 7, [[-3 / 7, '−3/7']], [], { svaki: 7 }),
      medijiOdgovora: prava(-1, 1, 7, [[-3 / 7, '−3/7'], [-5 / 7, '−5/7', 2, 2]], [sk(-3 / 7, -5 / 7, -1, 1, { boja: 2, ispod: true })], { svaki: 7 }) });
  Q(1, 'Koje svojstvo sabiranja kaže da je $p + q = q + p$?',
    ['Komutativnost', 'Asocijativnost', 'Distributivnost', 'Neutralni element'],
    'Redosled sabiraka može da se promeni. Na brojevnoj pravoj: dva skoka u bilo kom redosledu dovode do iste tačke.', 'zamena',
    { mediji: prava(-1, 2, 4, [[0.75, '', 3]], [sk(0, 1.25, -1, 2), sk(1.25, 0.75, -1, 2, { boja: 2, ispod: true, kasni: 0.9 }), sk(0, -0.5, -1, 2, { boja: 2, ispod: true, kasni: 1.6 }), sk(-0.5, 0.75, -1, 2, { kasni: 2.2 })], { svaki: 4 }) });
  Q(1, 'Koji broj je neutralni element sabiranja?',
    ['$0$', '$1$', '$−1$', 'Svaki broj'],
    'Dodavanjem nule broj ostaje isti: $p + 0 = p$. Za množenje tu ulogu ima broj 1. Indijski matematičar Bramagupta je još u 7. veku zapisao pravila za računanje sa nulom i „dugovima“.', 'nula',
    { mediji: prava(-2, 2, 4, [[-1.25, '−5/4'], [1.5, '3/2', 2]], [], { svaki: 4 }) });
  Q(1, 'Za koliko treba povećati $−{2|3}$ da bi se dobila nula?',
    ['${2|3}$', '$−{2|3}$', '${3|2}$', '$1$'],
    'Zbir suprotnih brojeva je nula: $−{2|3} + {2|3} = 0$. Skok od tačke $−{2|3}$ do nule dug je tačno ${2|3}$.', 'suprotan',
    { mediji: prava(-1, 1, 3, [[-2 / 3, '−2/3']]), medijiOdgovora: prava(-1, 1, 3, [[-2 / 3, '−2/3'], [0, '0', 2]], [sk(-2 / 3, 0, -1, 1)]) });
  U(1, 'Koji zbir nije jednak nuli?',
    ['$−{1|2} + {1|3}$', '$−0,5 + {1|2}$', '${3|4} + (−0,75)$', '$−{2|5} + 0,4$'],
    '$−{1|2} + {1|3} = −{3|6} + {2|6} = −{1|6}$. U ostalim zbirovima su sabirci suprotni brojevi (samo različito zapisani), pa je zbir nula.',
    'Suprotni brojevi se prepoznaju po apsolutnoj vrednosti: $\\|−0,5\\| = \\|{1|2}\\|$. Zapis ne mora da bude isti.', 'suprotan',
    { mediji: prava(-1, 1, 6, [[-0.5, '', 1], [1 / 3, '', 2], [0.75, '', 3], [-0.4, '', 0]], [], { svaki: 6 }) });
  Q(2, 'Koliko je ${1|2} − {3|4}$?',
    ['$−{1|4}$', '${1|4}$', '$−{2|2}$', '$−{2|4}$'],
    'Svedemo na četvrtine: ${2|4} − {3|4} = −{1|4}$. Kad se oduzme veći broj od manjeg, razlika je negativna.', 'razlika',
    { mediji: prava(-1, 1, 4, [[0.5, '1/2']], [], { svaki: 4 }),
      medijiOdgovora: prava(-1, 1, 4, [[0.5, '1/2'], [-0.25, '−1/4', 2]], [sk(0.5, -0.25, -1, 1, { boja: 2, ispod: true })], { svaki: 4 }) });
  Q(2, 'Koliko je $−0,75 + 0,4$?',
    ['$−0,35$', '$−1,15$', '$0,35$', '$−0,45$'],
    'Sabirci su različitog znaka: oduzmemo apsolutne vrednosti, $0,75 − 0,4 = 0,35$, i uzmemo znak sabirka sa većom apsolutnom vrednošću – minus.', 'zbir',
    { mediji: prava(-1, 0.5, 20, [[-0.75, '−0,75']], [], { svaki: 10 }),
      medijiOdgovora: prava(-1, 0.5, 20, [[-0.75, '−0,75'], [-0.35, '−0,35', 2, 2]], [sk(-0.75, -0.35, -1, 0.5)], { svaki: 10 }) });
  Q(2, 'Temperatura je bila $−3,5 °C$, pa je porasla za $5 °C$. Kolika je sada?',
    ['$1,5 °C$', '$−8,5 °C$', '$8,5 °C$', '$−1,5 °C$'],
    '$−3,5 + 5 = 1,5$. Živa se ne koristi u termometrima za veliku hladnoću – mrzne se na oko $−39 °C$; zato polarni termometri imaju obojeni alkohol.', 'toplije',
    { mediji: termo([[-3.5, '~pre']]), medijiOdgovora: termo([[-3.5, '~pre'], [1.5, '~posle', 2]]) });
  Q(2, 'Kako glasi izraz $−(q − r)$ bez zagrade?',
    ['$−q + r$', '$−q − r$', '$q − r$', '$q + r$'],
    'Kad je ispred zagrade minus, zagrada se briše, a svi znaci u njoj se menjaju u suprotne. Provera: za $q = 1$, $r = {1|2}$ obe strane daju $−{1|2}$.', 'zagrada',
    { mediji: G({}, [{ tx: '−(  q  −  r  )', at: [0, 0], vel: 26 }, { tx: '↓', at: [0, -1], vel: 22, b: 1 }, { tx: '−q  ?  r', at: [0, -2], vel: 26, b: 1 }, { lin: [[-2.5, 0.6], [2.5, -2.6]], debljina: 0.01, b: 4 }], { velicina: 200 }) });
  S(2, 'Spoji izraz sa vrednošću.',
    [['${1|4} − {1|2}$', '$−{1|4}$'], ['$−{1|3} − {1|3}$', '$−{2|3}$'], ['$0,2 − 1$', '$−0,8$'], ['$−1,5 + 2$', '${1|2}$']],
    'Decimalne brojeve i razlomke možemo mešati u istom zadatku – samo ih pre računanja prevedemo u isti zapis.', 'vrednost',
    { mediji: prava(-1, 1, 12, [[-0.25, '', 0], [-2 / 3, '', 1], [-0.8, '', 2], [0.5, '', 3]], [], { svaki: 12 }) });
  Q(2, 'Broj $p$ je negativan, $q$ je pozitivan i $\\|p\\| > \\|q\\|$. Kakav je zbir $p + q$?',
    ['Negativan', 'Pozitivan', 'Jednak nuli', 'Ne može se znati'],
    'Skok udesno (za $q$) je kraći od rastojanja $p$ do nule, pa ne stižemo do nule – zbir ostaje negativan. Primer: $−{5|2} + 1 = −{3|2}$.', 'negativan',
    { mediji: prava(-3, 1, 2, [[-2.5, 'p'], [1, 'q', 2]]),
      medijiOdgovora: prava(-3, 1, 2, [[-2.5, 'p'], [-1.5, 'p+q', 2, 2]], [sk(-2.5, -1.5, -3, 1)]) });
  Q(3, 'Marko ima $2$ litra soka. Za koktel mu treba ${3|4}$ l, za limunadu $0,8$ l i za žele $0,7$ l. Koliko soka mu nedostaje?',
    ['$0,25$ l', '$0,75$ l', '$0,5$ l', 'Ništa, ima dovoljno'],
    '$2 − ({3|4} + 0,8 + 0,7) = 2 − 2,25 = −0,25$. Negativan rezultat znači da je Marko „u minusu“ – nedostaje mu četvrt litra.', 'nedostaje',
    { mediji: nadovezi([[[2, 0, '2 l']], [[0.75, 1, '3/4'], [0.8, 2, '0,8'], [0.7, 3, '0,7']]]),
      medijiOdgovora: nadovezi([[[2, 0, '2 l'], [0.25, 1, '?']], [[0.75, 1, '3/4'], [0.8, 2, '0,8'], [0.7, 3, '0,7']]]) });
  Q(3, 'Koliko je $−{5|4} + {7|3}$?',
    ['${13|12}$', '${2|7}$', '$−{43|12}$', '${1|12}$'],
    'NZS(4, 3) = 12: $−{15|12} + {28|12} = {13|12} = 1{1|12}$. Česta greška ${2|7}$ nastaje kad se saberu i brojioci i imenioci.', 'imenilac',
    { mediji: prava(-2, 3, 12, [[-1.25, '−5/4']], [], { svaki: 12 }),
      medijiOdgovora: prava(-2, 3, 12, [[-1.25, '−5/4'], [13 / 12, '13/12', 2]], [sk(-1.25, 13 / 12, -2, 3)], { svaki: 12 }) });
  Q(3, 'Zbiru brojeva $−{1|2}$ i ${2|3}$ dodaj njihovu razliku (prvi minus drugi). Šta dobijaš?',
    ['$−1$', '${4|3}$', '${1|6}$', '$−{7|6}$'],
    '$(a + b) + (a − b) = 2a$, pa je rezultat uvek dvostruki prvi broj: $2 · (−{1|2}) = −1$. Ne mora se ništa svoditi na zajednički imenilac!', 'dvostruko',
    { mediji: prava(-2, 2, 6, [[-0.5, 'a'], [2 / 3, 'b', 2]], [], { svaki: 6 }) });
  Q(3, 'Kolika je vrednost izraza $1 − (−1 − (1 − (−1)))$?',
    ['$4$', '$0$', '$−2$', '$2$'],
    'Rešava se od najdublje zagrade: $1 − (−1) = 2$, zatim $−1 − 2 = −3$, i na kraju $1 − (−3) = 4$.', 'zagrada',
    { mediji: G({}, [{ tx: '1 − ( −1 − ( 1 − (−1) ) )', at: [0, 0], vel: 22 }, { tx: '~prvo najdublja zagrada', at: [1.6, -1], vel: 14, b: 1 }, { lin: [[-3.6, 0.7], [3.6, -1.4]], debljina: 0.01, b: 4 }], { velicina: 300 }) });
  proveri(je(zb(F(-2, 5), F(3, 5)), F(1, 5)) && je(ra(F(-3, 7), F(2, 7)), F(-5, 7)), 'L17 isti imenioci');
  proveri(je(ra(F(1, 2), F(3, 4)), F(-1, 4)) && je(zb(F(-5, 4), F(7, 3)), F(13, 12)), 'L17 svođenje');
  proveri(Math.abs(-0.75 + 0.4 + 0.35) < 1e-9 && -3.5 + 5 === 1.5, 'decimale');
  proveri(Math.abs(2 - (0.75 + 0.8 + 0.7) + 0.25) < 1e-9, 'sok');
  proveri(je(zb(zb(F(-1, 2), F(2, 3)), ra(F(-1, 2), F(2, 3))), F(-1)), 'zbir + razlika');
  proveri(1 - (-1 - (1 - (-1))) === 4, 'zagrade');
  proveri(!je(zb(F(-1, 2), F(1, 3)), F(0)) && je(zb(F(-2, 5), F(4, 10)), F(0)), 'uljez zbir');

  // ════════════════ 18. Množenje racionalnih brojeva ════════════════
  L('Množenje racionalnih brojeva');
  Q(1, 'Koliko je ${2|3} · {4|5}$?',
    ['${8|15}$', '${6|8}$', '${10|12}$', '${6|15}$'],
    'Brojilac puta brojilac, imenilac puta imenilac: ${2 · 4|3 · 5} = {8|15}$. Na modelu kvadrata: tamni deo pokriva 8 od 15 polja.', 'proizvod',
    { mediji: G({}, [...traka(3, 2, { w: 6 }), ...traka(5, 4, { w: 6, y: -1.8, b: 2 })], { velicina: 240 }), medijiOdgovora: pov(2, 3, 4, 5) });
  Q(1, 'Proizvod dva racionalna broja je pozitivan. Šta sigurno važi za ta dva broja?',
    ['Imaju isti znak', 'Oba su pozitivna', 'Oba su negativna', 'Imaju različite znake'],
    'Pozitivan proizvod daju i plus puta plus i minus puta minus: ${2|3} · {3|4} = {1|2}$, a $(−{1|2}) · (−4) = 2$. Za minus puta minus pomaže rečenica: „neprijatelj mog neprijatelja je moj prijatelj“.', 'znak',
    { mediji: cinioci(['?', '?']), medijiOdgovora: znaci('·', 1) });
  Q(1, 'Koliko je $−{3|5} · 5$?',
    ['$−3$', '$3$', '$−{15|25}$', '$−{3|25}$'],
    'Množenje celim brojem je ponovljeno sabiranje: pet skokova po $−{3|5}$ ulevo dovodi do $−3$. Računski: $−{3 · 5|5} = −3$.', 'skok',
    { mediji: prava(-4, 1, 5, [[0, '0', 2]], [], { svaki: 5 }),
      medijiOdgovora: prava(-4, 1, 5, [[-3, '−3', 2]], [0, 1, 2, 3, 4].map((i) => sk(-0.6 * i, -0.6 * (i + 1), -4, 1, { boja: 1, kasni: 0.3 + i * 0.5 })), { svaki: 5 }) });
  Q(1, 'Kom broju je jednako $(−1) · r$?',
    ['Broju $−r$, suprotnom od $r$', 'Broju $r$', 'Broju ${1|r}$', 'Nuli'],
    'Množenje sa $−1$ „preslikava“ tačku na drugu stranu nule, na isto rastojanje. Zato je $(−1) · (−r) = r$.', 'suprotan',
    { mediji: prava(-2, 2, 4, [[1.25, 'r']]), medijiOdgovora: prava(-2, 2, 4, [[1.25, 'r'], [-1.25, '−r', 2]], [sk(1.25, -1.25, -2, 2, { boja: 2 })]) });
  Q(1, 'Koliko je $(−1) · (−1) · (−1)$?',
    ['$−1$', '$1$', '$−3$', '$3$'],
    'Prva dva činioca daju $+1$, a treći ponovo menja znak: $1 · (−1) = −1$. Neparan broj minusa – negativan proizvod.', 'neparan',
    { mediji: cinioci(['−', '−', '−']) });
  U(1, 'Koji proizvod nije negativan?',
    ['$(−{1|2}) · (−4)$', '$(−{1|2}) · 4$', '${1|2} · (−4)$', '$−({1|2} · 4)$'],
    '$(−{1|2}) · (−4) = 2$ – dva negativna činioca. Ostala tri proizvoda su $−2$.',
    'Proizvod menja znak svaki put kad dodamo negativan činilac – kao prekidač za svetlo.', 'pozitivan',
    { mediji: cinioci(['−', '−']) });
  Q(2, 'Koliko je $(−{2|3}) · (−{9|4})$?',
    ['${3|2}$', '$−{3|2}$', '${8|27}$', '$−{18|12}$'],
    'Znak: dva minusa – plus. Pre množenja skratimo unakrsno: 2 sa 4 i 9 sa 3, pa je ${1 · 3|1 · 2} = {3|2}$.', 'skratiti',
    { mediji: cinioci(['−', '−']) });
  Q(2, 'Proizvod pet brojeva, od kojih nijedan nije nula, ima tačno tri negativna činioca. Kakav je proizvod?',
    ['Negativan', 'Pozitivan', 'Jednak nuli', 'Ne može se znati'],
    'Paran broj negativnih činilaca daje pozitivan proizvod, a neparan – negativan. Tri je neparan broj.', 'neparan',
    { mediji: cinioci(['−', '+', '−', '+', '−']) });
  Q(2, 'Koliko je ${3|4} · (−20)$?',
    ['$−15$', '$15$', '$−{80|3}$', '$−5$'],
    'Tri četvrtine od 20 je 15 (jedna četvrtina je 5), a znak je minus jer je jedan činilac negativan.', 'četvrtina',
    { mediji: G({}, traka(4, 3, { w: 8 }), { velicina: 260 }),
      medijiOdgovora: G({}, [...traka(4, 3, { w: 8 }), ...[0, 1, 2, 3].map((i) => ({ tx: '−5', at: [1 + 2 * i, 0.6], vel: 16 }))], { velicina: 260 }) });
  Q(2, 'Koja jednakost pokazuje distributivnost množenja prema sabiranju?',
    ['$a · (b + c) = a · b + a · c$', '$a · b = b · a$', '$(a · b) · c = a · (b · c)$', '$a · 1 = a$'],
    'Na slici: pravougaonik širine $a$ i dužine $b + c$ ima istu površinu kao dva manja pravougaonika, $a · b$ i $a · c$, zajedno.', 'zagrada',
    { medijiOdgovora: G({}, [{ lin: [[0, 0], [5, 0], [5, 2], [0, 2]], zatv: 1, b: 0, gusto: 1 }, { lin: [[5, 0], [8, 0], [8, 2], [5, 2]], zatv: 1, b: 1, gusto: 1 }, { tx: 'b', at: [2.5, -0.45], vel: 18 }, { tx: 'c', at: [6.5, -0.45], vel: 18 }, { tx: 'a', at: [-0.4, 1], vel: 18 }, { tx: 'a·b', at: [2.5, 1], vel: 18 }, { tx: 'a·c', at: [6.5, 1], vel: 18 }], { velicina: 280 }) });
  Q(3, 'Koliko je $1,25 · (−0,8)$?',
    ['$−1$', '$1$', '$−10$', '$−0,1$'],
    '$1,25 = {5|4}$ i $0,8 = {4|5}$ – to su recipročni brojevi, pa im je proizvod 1 (ovde $−1$ zbog znaka).', 'recipročan',
    { mediji: G({}, [...traka(4, 4, { w: 6 }), ...traka(4, 1, { x: 6, w: 6, b: 1 }), ...traka(5, 4, { w: 7.5, y: -1.8, b: 2 })], { velicina: 300 }) });
  Q(2, 'Kako se kraće zapisuje $5 · x$?',
    ['$5x$', '$x5$', '$5 + x$', '$x^{5}$'],
    'Znak množenja se izostavlja između broja i slova, kao i ispred zagrade: $3 · (a + 1) = 3(a + 1)$. Ali $5 · 3$ se ne sme pisati kao 53!', 'sažeto',
    { mediji: G({}, [{ tx: '5 · x', at: [0, 0], vel: 28 }, { tx: '~„pet puta iks“', at: [0, -1.1], vel: 16, b: 4 }, { lin: [[-2.2, 0.6], [2.2, -1.6]], debljina: 0.01, b: 4 }], { velicina: 200 }) });
  S(2, 'Spoji proizvod sa vrednošću.',
    [['$(−{1|2}) · (−{1|2})$', '${1|4}$'], ['$(−{1|2}) · {1|2}$', '$−{1|4}$'], ['$2 · (−{1|4})$', '$−{1|2}$'], ['$(−2) · (−{1|4})$', '${1|2}$']],
    'Kad se razlomak manji od 1 pomnoži sam sobom, proizvod je još manji: polovina polovine je četvrtina.', 'proizvod',
    { mediji: pov(1, 2, 1, 2) });
  Q(3, 'Koji proizvod prikazuje tamni deo jediničnog kvadrata?',
    ['${3|4} · {2|3}$', '${3|4} + {2|3}$', '${3|7} · {2|5}$', '${2|4} · {3|3}$'],
    'Tri četvrtine širine i dve trećine visine: tamni deo ima $3 · 2 = 6$ od $4 · 3 = 12$ polja, tj. ${6|12} = {1|2}$ kvadrata.', 'površina',
    { mediji: pov(3, 4, 2, 3, { natpisi: false }), medijiOdgovora: pov(3, 4, 2, 3) });
  Q(3, 'Izračunaj u glavi: $−{4|9} · {3|8} · (−{6|5})$.',
    ['${1|5}$', '$−{1|5}$', '${13|22}$', '${1|10}$'],
    'Dva negativna činioca – proizvod je pozitivan. Skraćivanjem: ${4 · 3 · 6|9 · 8 · 5} = {72|360} = {1|5}$.', 'skratiti',
    { mediji: cinioci(['−', '+', '−']) });
  Q(3, 'Kolika je vrednost izraza $−{3|4}x + {1|4}x$ za $x = −{6|5}$?',
    ['${3|5}$', '$−{3|5}$', '${6|5}$', '$−{12|5}$'],
    'Lakše je prvo izvući $x$: $(−{3|4} + {1|4})x = −{1|2}x$. Zatim $−{1|2} · (−{6|5}) = {3|5}$.', 'izraz',
    { mediji: prava(-2, 1, 5, [[-1.2, 'x']]) });
  proveri(je(pr(F(2, 3), F(4, 5)), F(8, 15)) && je(pr(F(-3, 5), F(5)), F(-3)), 'L18 proizvodi');
  proveri(je(pr(F(-2, 3), F(-9, 4)), F(3, 2)) && je(pr(F(3, 4), F(-20)), F(-15)), 'L18 proizvodi 2');
  proveri(Math.abs(1.25 * -0.8 + 1) < 1e-9, '1,25 · (−0,8)');
  proveri(je(pr(pr(F(-4, 9), F(3, 8)), F(-6, 5)), F(1, 5)), 'tri činioca');
  proveri(je(pr(zb(F(-3, 4), F(1, 4)), F(-6, 5)), F(3, 5)), 'izraz sa x');
  proveri(je(pr(F(3, 4), F(2, 3)), F(1, 2)) && je(pr(F(-1, 2), F(-1, 2)), F(1, 4)), 'model površine');
  proveri(v(F(13, 12)) > 1, 'kontrola');
};
