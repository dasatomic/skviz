// Prizma — 8. razred: pojam i elementi, poliedri, dijagonale, mreža, površina i zapremina prizme.
// Pitanja su sopstvenim rečima, po gradivu udžbenika Matematika 8 (Diofant / Fondacija Kavčić, 1. deo,
// 2.9 Poliedri i 4. poglavlje Prizma). Crteži: tela u prostoru (prostor.js), mreže, osnove (jednakostranični
// trouglovi, šestougao podeljen na šest trouglova, trapez, pravougli trougao), kocke i kockice za zapreminu.
module.exports = ({ L, Q, U, S, G, proveri, telo, kocke, kvadar, kocka, prizma, prizmaOsnova, poliedar, pravilnaOsnova, mrezaKvadra, mrezaPrizme }) => {
  // ── pomoćni crteži ──
  const V = (x = {}) => ({ velicina: 240, ...x });
  // kosa prizma: osnova (lista tačaka u ravni), pomak gornje osnove (dx, dy) i visina h; H = podnožje visine
  function kosa(osn, [dx, dy], h, e = [], x = {}) {
    const n = osn.length, ime = 'ABCDEFGH'.slice(0, n);
    const gor = (s) => s + '₁';
    const T3 = {};
    osn.forEach(([px, py], i) => { T3[ime[i]] = [px, py, 0]; T3[gor(ime[i])] = [px + dx, py + dy, h]; });
    const strane = [[...ime].reverse(), [...ime].map(gor)];
    for (let i = 0; i < n; i++) { const a = ime[i], b = ime[(i + 1) % n]; strane.push([a, b, gor(b), gor(a)]); }
    return poliedar(T3, strane, e, { ...x, T3: { H: [dx, dy, 0], ...(x.T3 || {}) } });
  }
  // pravilni šestougao ivice a podeljen na šest jednakostraničnih trouglova iz centra O
  function sestougao(a, e = []) {
    const P = pravilnaOsnova(6, a);
    const t = { O: [0, 0] };
    'ABCDEF'.split('').forEach((n, i) => { t[n] = P[i]; });
    const el = [];
    for (let i = 0; i < 6; i++) el.push({ p: 'O' + 'ABCDEF'[i] + 'ABCDEF'[(i + 1) % 6], b: i % 2 ? 2 : 4, gusto: 1 });
    return G(t, [...el, ...e], V({ bezImena: ['O'] }));
  }
  // jedan kvadrat mreže (x, y donji levi ugao, stranica s)
  const kvadrat = (x, y, s = 1, x2 = {}) => ({ lin: [[x, y], [x + s, y], [x + s, y + s], [x, y + s]], zatv: 1, b: 1, ...x2 });
  // pravougaonik stranica a × b u ravni
  const pravoug = (a, b, e = [], x = {}) => G({}, [{ lin: [[0, 0], [a, 0], [a, b], [0, b]], zatv: 1, b: 1 }, ...e], V(x));
  // trougao u ravni (osnova prizme), tačke A, B, C
  const trougao = (pts, e = [], x = {}) => G({ A: pts[0], B: pts[1], C: pts[2] }, [{ p: 'ABC', b: 0 }, ...e], V({ bezImena: ['A', 'B', 'C'], ...x }));
  const osnovaTrapez = [[0, 0], [8, 0], [5, 4], [3, 4]]; // jednakokraki trapez, osnovice 8 i 2, krak 5, visina 4

  // ── provere računa (gradnja pukne ako ne važi) ──
  const kor = Math.sqrt(3);
  proveri(Math.hypot(4, 3) === 5, 'trojka 3-4-5 (bočna strana kvadra 4 × 3 × 4)');
  proveri(Math.sqrt(9 + 16 + 144) === 13, 'kvadar 3, 4, 12 → D = 13');
  proveri(Math.sqrt(4 + 9 + 36) === 7, 'kvadar 2, 3, 6 → D = 7');
  proveri(Math.hypot(6, 8) === 10 && Math.sqrt(100 + 576) === 26, 'osnova 6×8, visina 24 → D = 26');
  proveri(Math.hypot(5, 12) === 13, 'osnova 5×12 → d = 13');
  proveri(Math.sqrt(50 + 25) === Math.sqrt(75) && Math.sqrt(75 - 50) === 5, 'osnova 5×5, D = 5√3 → visina 5');
  proveri(Math.abs(4 * kor - 4 * Math.sqrt(3)) < 1e-9 && Math.abs(4 * kor * 5 - 20 * kor) < 1e-9, 'manji presek 4√3 · 5 = 20√3');
  proveri(6 * 2 * 5 === 60 && 3 * 6 * 6 === 108, 'omotač šestostrane 6 · 2 · 5 = 60; trostrane 3 · 6 · 6 = 108');

  // ════════════════ Pojam, vrste i elementi prizme (i poliedri) ════════════════
  L('Pojam, vrste i elementi prizme');

  Q(1, 'Koliko osnova ima prizma?',
    ['Dve', 'Jednu', 'Tri', 'Nijednu'],
    'Reč „prizma“ potiče iz grčkog jezika i znači „otesan“: kao komad drveta ili kamena koji je odsečen sa dve ravne, paralelne strane.',
    'prizma', { mediji: kvadar(4, 3, 4) });

  Q(1, 'Kakvi su oblici bočnih strana prave šestostrane prizme?',
    ['Pravougaonici', 'Trouglovi', 'Krugovi', 'Peterouglovi'],
    'Kod prave prizme bočne ivice su normalne na osnovu, pa je svaka bočna strana pravougaonik. Kod kose prizme bočne strane su paralelogrami koji nisu pravougaonici.',
    'strana', { mediji: prizma(6, 3, 5) });

  Q(1, 'Kakav je međusobni položaj osnova prizme?',
    ['Podudarne su i paralelne', 'Podudarne su i normalne', 'Paralelne su, ali različite', 'Seku se pod pravim uglom'],
    'Ravni osnova su paralelne, pa je rastojanje između njih visina prizme. Osnove moraju biti podudarne, inače to nije prizma nego neko drugo telo.',
    'osnova', { mediji: prizma(6, 3, 5) });

  Q(1, 'Čime je ograničen poliedar?',
    ['Konačnim brojem mnogouglova', 'Jednom krivom površi', 'Dvema osnovama i jednom krivom površi', 'Beskonačnim brojem trouglova'],
    'Reč poliedar dolazi od grčkih reči polys (mnogo) i hedra (strana). Telo koje ima krivu površ, poput lopte, valjka ili kupe, nije poliedar.',
    'poliedar', { mediji: prizma(3, 3, 4) });

  Q(1, 'Izbroj: koliko ivica ima trostrana prizma sa crteža?',
    ['9', '6', '12', '8'],
    'Svako teme prizme spaja tri ivice (dve u osnovi i jednu bočnu), pa je broj ivica $3 \\cdot 2n : 2 = 3n$ za n-tostranu prizmu.',
    'ivica', { mediji: prizma(3, 3, 4) });

  Q(2, 'Koliko temena ima šestostrana prizma?',
    ['12', '6', '18', '8'],
    'Ojlerova formula $T − I + S = 2$ važi za sve konveksne poliedre, pa se može proveriti i na prizmi: za šestostranu prizmu je $12 − 18 + 8 = 2$.',
    'teme', { mediji: telo('prizma6') });

  Q(2, 'Prizma ima 8 strana. Koja je to prizma?',
    ['Šestostrana prizma', 'Osmostrana prizma', 'Četvorostrana prizma', 'Trostrana prizma'],
    'Od ukupnog broja strana oduzmemo dve osnove, pa dobijemo broj bočnih strana, a on je jednak broju stranica osnove.',
    'strana', { mediji: prizma(6, 3, 4) });

  Q(2, 'Koliko strana ima prizma sa 18 ivica?',
    ['8', '9', '6', '12'],
    'Piramida sa n-tostranom osnovom ima n + 1 stranu, a prizma sa istom osnovom n + 2 strane, pa se ta dva tela lako pomešaju.',
    'ivica', { mediji: prizma(6, 3, 4) });

  Q(2, 'Kako se naziva prava prizma čije su osnove pravilni mnogouglovi?',
    ['Pravilna prizma', 'Jednakoivična prizma', 'Kosa prizma', 'Pravilna piramida'],
    'Kocka je istovremeno pravilna prizma sa kvadratnim osnovama i jednakoivična prizma, jer su joj sve ivice jednake.',
    'pravilna', { mediji: prizma(6, 3, 5) });

  Q(2, 'Kako se zove prizma čije su sve ivice jednake dužine?',
    ['Jednakoivična prizma', 'Pravilna prizma', 'Kosa prizma', 'Prava prizma'],
    'Ako je osnova jednakostranični trougao, a visina prizme jednaka ivici osnove, sve ivice prizme su jednake.',
    'ivica', { mediji: prizma(3, 4, 4) });

  Q(2, 'Kod prave prizme dužina bočne ivice u odnosu na visinu prizme je:',
    ['Jednaka visini', 'Veća od visine', 'Manja od visine', 'Dvostruko veća'],
    'Kod prave prizme bočna ivica je normalna na osnovu, pa je ona sama visina prizme.',
    'visina', { mediji: prizma(4, 3, 5) });

  Q(3, 'Kod kose prizme dužina bočne ivice u odnosu na visinu prizme je:',
    ['Veća od visine', 'Jednaka visini', 'Manja od visine', 'Ista kao ivica osnove'],
    'Visina je normala iz gornje osnove na donju, a bočna ivica je hipotenuza pravouglog trougla čija je jedna kateta visina. Zato je bočna ivica uvek duža od visine.',
    'kosa', {
      mediji: kosa([[0, 0], [4, 0], [4, 3], [0, 3]], [1.5, 1], 5, [{ d: 'AA₁', b: 1, debljina: 3 }]),
      medijiOdgovora: kosa([[0, 0], [4, 0], [4, 3], [0, 3]], [1.5, 1], 5, [{ d: 'AA₁', b: 1, debljina: 3 }, { d: 'A₁H', b: 3, isp: 1, debljina: 2 }]),
    });

  Q(3, 'Koliko telesnih dijagonala ima kocka?',
    ['4', '6', '8', '12'],
    'Sve telesne dijagonale kocke seku se u njenom centru i tu se međusobno prepolove. Dijagonale strana su duži u istoj strani, pa se ne računaju.',
    'dijagonala', {
      mediji: kocka(4),
      medijiOdgovora: kocka(4, [{ d: 'AC₁', b: 1, debljina: 3 }, { d: 'BD₁', b: 2, debljina: 3 }, { d: 'CA₁', b: 3, debljina: 3 }, { d: 'DB₁', b: 4, debljina: 3 }]),
    });

  Q(2, 'Koliko je $T − I + S$ za kocku, ako je $T$ broj temena, $I$ broj ivica, a $S$ broj strana?',
    ['2', '0', '4', '6'],
    'Ojler (Leonhard Euler) je ovu vezu objavio u 18. veku. Važi za sve konveksne poliedre, ali ne i za šupalj „krofnu“ (torus), gde je rezultat 0.',
    'Ojler', { mediji: kocka(3) });

  Q(3, 'Koja je to pravilna figura (Platonovo telo) koja ima 20 strana?',
    ['Ikosaedar', 'Dodekaedar', 'Oktaedar', 'Tetraedar'],
    'Postoji tačno pet pravilnih poliedara (Platonova tela), a to su tetraedar (4 strane), heksaedar ili kocka (6), oktaedar (8), dodekaedar (12) i ikosaedar (20).',
    'ikosaedar', { mediji: kocka(3) });

  Q(1, 'Koliko temena ima kocka?',
    ['8', '6', '12', '4'],
    'Kocka ima 8 temena, 12 ivica i 6 strana (kvadrata). Kod svakog temena se sastaju tri ivice i tri strane.',
    'teme', { mediji: kocka(3) });

  U(1, 'Koje od ovih tela NIJE prizma?',
    ['Piramida sa kvadratnom osnovom', 'Kocka', 'Kvadar', 'Trostrana prizma'],
    'Piramida ima jednu osnovu, a bočne strane su trouglovi koji se sastaju u jednom vrhu. Ostala tri tela imaju dve podudarne i paralelne osnove.',
    'Kvadar je prizma sa pravougaonom osnovom, a kocka je prizma čije su sve strane kvadrati.',
    'piramida', { mediji: prizma(3, 3, 4) });

  S(2, 'Spoji pojam sa njegovim opisom.',
    [['Bočna ivica', 'ivica koja ne pripada osnovi'], ['Visina prizme', 'rastojanje između ravni osnova'], ['Teme prizme', 'tačka u kojoj se sastaju tri ivice'], ['Bočna strana', 'deo bočne površi između dve bočne ivice']],
    'Kod prave prizme bočne strane su pravougaonici, a bočne ivice su jednake visini.',
    'visina', { mediji: prizma(4, 3, 4, [{ d: 'AA₁', b: 1, debljina: 3 }]) });

  // ════════════════ Dijagonale prizme i dijagonalni presek ════════════════
  L('Dijagonale prizme i dijagonalni presek');

  Q(1, 'Dijagonala prizme je duž čija temena ne pripadaju istoj strani prizme. Koliko dijagonala ima kvadar?',
    ['4', '8', '12', '6'],
    'Dijagonale strana, na primer $AC$ u donjoj osnovi, leže u jednoj strani, pa se ne računaju kao dijagonale prizme.',
    'dijagonala', { mediji: kvadar(4, 3, 2) });

  Q(1, 'Kolika je dužina dijagonale kocke ivice $a$?',
    ['$a\\sqrt{3}$', '$a\\sqrt{2}$', '$2a$', '$3a$'],
    'Dijagonala kocke je hipotenuza pravouglog trougla čije su katete dijagonala strane $a\\sqrt{2}$ i ivica $a$.',
    'dijagonala', { mediji: kocka(3), medijiOdgovora: kocka(3, [{ d: 'AC₁', b: 1, debljina: 3 }]) });

  Q(1, 'Ivice kvadra su 3 cm, 4 cm i 12 cm. Kolika je njegova dijagonala?',
    ['13 cm', '19 cm', '15 cm', '12 cm'],
    'Dijagonala kvadra je uvek duža od svake njegove ivice, ali kraća od zbira svih ivica.',
    'kvadar', { mediji: kvadar(4, 3, 12) });

  Q(2, 'Telesna dijagonala kocke na crtežu je $6\\sqrt{3}$ cm. Kolika je ivica?',
    ['6 cm', '$6\\sqrt{2}$ cm', '12 cm', '$2\\sqrt{3}$ cm'],
    'Dijagonala kocke je $\\sqrt{3}$ puta duža od ivice, a dijagonala strane je $\\sqrt{2}$ puta duža od ivice.',
    'ivica', { mediji: kocka(3) });

  Q(2, 'Osnova prave prizme je pravougaonik dimenzija 6 cm × 8 cm, a visina prizme je 24 cm. Kolika je dijagonala prizme?',
    ['26 cm', '34 cm', '30 cm', '24 cm'],
    'Dijagonala osnove je 10 cm (trojka 6, 8, 10), a dijagonala prizme je hipotenuza trougla sa katetama 10 cm i 24 cm.',
    'dijagonala', { mediji: kvadar(6, 8, 24) });

  Q(2, 'Kolika je dijagonala strane kocke ivice 5 cm?',
    ['$5\\sqrt{2}$ cm', '$5\\sqrt{3}$ cm', '10 cm', '25 cm'],
    'Kvadrat nad dijagonalom strane ima dvostruko veću površinu od kvadrata nad ivicom.',
    'strana', { mediji: kocka(3, [{ d: 'AC', b: 3, debljina: 3 }]) });

  Q(1, 'Kolika je dužina dijagonale osnove kvadra dimenzija 5 cm × 12 cm?',
    ['13 cm', '17 cm', '7 cm', '$\\sqrt{119}$ cm'],
    'Brojevi 5, 12 i 13 čine pitagorejsku trojku, pa je dijagonala osnove $\\sqrt{5^{2} + 12^{2}} = 13$ cm.',
    'osnova', { mediji: kvadar(5, 12, 6, [{ d: 'AC', b: 3, debljina: 3 }]) });

  Q(1, 'Kolika je površina dijagonalnog preseka kocke ivice $a$?',
    ['$a^{2}\\sqrt{2}$', '$a^{2}\\sqrt{3}$', '$2a^{2}$', '$a^{2}$'],
    'Dijagonalni presek kocke je pravougaonik čije su stranice dijagonala osnove i ivica kocke.',
    'presek', { mediji: kocka(4, [{ p: 'ACC₁A₁', b: 2, gusto: 1 }]) });

  Q(3, 'Površina dijagonalnog preseka kocke je $144\\sqrt{2}$ cm². Kolika je ivica kocke?',
    ['12 cm', '72 cm', '24 cm', '18 cm'],
    'Površina preseka je $a \\cdot a\\sqrt{2}$, pa se dvostrukom ivicom površina preseka poveća četiri puta.',
    'presek', { mediji: kocka(5, [{ p: 'BDD₁B₁', b: 2, gusto: 1 }]) });

  Q(1, 'Osnovna ivica pravilne šestostrane prizme je 6 cm. Kolika je dužina duže dijagonale osnove?',
    ['12 cm', '$6\\sqrt{3}$ cm', '6 cm', '18 cm'],
    'Duža dijagonala šestougla prolazi kroz centar, pa je jednaka dvostrukoj ivici.',
    'osnova', { mediji: prizma(6, 6, 10, [{ d: 'AD', b: 1, debljina: 3 }]) });

  Q(2, 'Kolika je površina većeg dijagonalnog preseka pravilne šestostrane prizme ivice osnove 6 cm i visine 10 cm?',
    ['120 cm²', '$60\\sqrt{3}$ cm²', '60 cm²', '72 cm²'],
    'Dijagonalni preseci šestostrane prizme nisu iste površine: jedan prolazi kroz dva naspramna temena (duža dijagonala), a drugi kroz temena na razmaku jednog temena.',
    'presek', { mediji: prizma(6, 6, 10, [{ p: 'ADD₁A₁', b: 2, gusto: 1 }]) });

  Q(3, 'Pravilna šestostrana prizma ima osnovnu ivicu 4 cm i visinu 5 cm. Kolika je površina manjeg dijagonalnog preseka?',
    ['$20\\sqrt{3}$ cm²', '$40\\sqrt{3}$ cm²', '20 cm²', '$10\\sqrt{3}$ cm²'],
    'Manji dijagonalni presek je pravougaonik čija je jedna stranica kraća dijagonala osnove, a druga visina prizme.',
    'presek', { mediji: prizma(6, 4, 5, [{ p: 'BDD₁B₁', b: 2, gusto: 1 }]) });

  Q(1, 'Ivica osnove pravilne četvorostrane prizme je 3 cm, a visina 4 cm. Kolika je dijagonala bočne strane?',
    ['5 cm', '7 cm', '$\\sqrt{7}$ cm', '25 cm'],
    'Trojka 3, 4, 5 je najpoznatija pitagorejska trojka, a bočna strana je pravougaonik čija je dijagonala hipotenuza.',
    'strana', { mediji: kvadar(3, 3, 4, [{ d: 'BC₁', b: 1, debljina: 3 }]) });

  Q(2, 'Ivice kvadra su 2 cm, 3 cm i 6 cm. Kolika mu je dijagonala?',
    ['7 cm', '11 cm', '$\\sqrt{11}$ cm', '5 cm'],
    'Kvadrat dijagonale je zbir kvadrata triju ivica: $2^{2} + 3^{2} + 6^{2} = 49$.',
    'kvadar', { mediji: kvadar(2, 3, 6) });

  Q(2, 'Osnova prave četvorostrane prizme je pravougaonik 3 cm × 4 cm, a visina prizme je 12 cm. Kolika je površina dijagonalnog preseka?',
    ['60 cm²', '84 cm²', '$12\\sqrt{7}$ cm²', '48 cm²'],
    'Dijagonala osnove je 5 cm, pa je dijagonalni presek pravougaonik 5 cm × 12 cm.',
    'omotač', { mediji: kvadar(4, 3, 12, [{ p: 'ACC₁A₁', b: 2, gusto: 1 }]) });

  Q(3, 'Osnova kvadra je kvadrat ivice 5 cm, a telesna dijagonala je $5\\sqrt{3}$ cm. Kolika je visina kvadra?',
    ['5 cm', '$5\\sqrt{2}$ cm', '10 cm', '2,5 cm'],
    'Dijagonala osnove je $5\\sqrt{2}$ cm, a telesna dijagonala je hipotenuza trougla čija je druga kateta visina kvadra.',
    'visina', { medijiOdgovora: kocka(5, [{ d: 'AC₁', b: 1, debljina: 3 }, { d: 'AC', b: 2, isp: 1 }, { d: 'CC₁', b: 3, debljina: 3 }]) });

  U(2, 'Koja od ovih duži NIJE dijagonala kvadra $ABCDA_1B_1C_1D_1$?',
    ['$AB$', '$AC_1$', '$BD_1$', '$CA_1$'],
    '$AB$ je ivica kvadra: njena temena pripadaju istoj strani. Ostale tri duži su dijagonale, jer njihova temena nisu na istoj strani.',
    'Kvadar ima 12 ivica, 12 dijagonala strana i 4 telesne dijagonale, što je ukupno 28 duži između njegovih osam temena.',
    'ivica', { mediji: kvadar(4, 3, 2) });

  S(2, 'Spoji dužinu u kocki ivice $a$ sa njenim izrazom.',
    [['dijagonala kocke', '$a\\sqrt{3}$'], ['dijagonala strane kocke', '$a\\sqrt{2}$'], ['ivica kocke', '$a$'], ['površina dijagonalnog preseka', '$a^{2}\\sqrt{2}$']],
    'Dijagonalu strane dobijamo iz Pitagorine teoreme za kvadrat čije su stranice $a$.',
    'kocka', { mediji: kocka(3, [{ d: 'AC₁', b: 1, debljina: 3 }]) });

  // ════════════════ Mreža prizme ════════════════
  L('Mreža prizme');

  Q(1, 'Šta je mreža prizme?',
    ['Površ prizme razvijena (smotana) u ravan', 'Presek prizme jednom ravni', 'Zbir dužina svih ivica prizme', 'Zbir površina samo bočnih strana'],
    'Ako mrežu isečemo po ivicama i sastavimo lepkom ili trakom, dobijamo model prizme.',
    'mreža', { mediji: mrezaPrizme(4, 3, 5) });

  Q(1, 'Iz kojih delova se sastoji mreža prave prizme?',
    ['Dve osnove i omotač', 'Samo iz omotača', 'Dve osnove i dve bočne strane', 'Samo iz osnova'],
    'Omotač je pravougaonik čija je jedna stranica obim osnove, a druga visina prizme.',
    'omotač', { mediji: mrezaPrizme(3, 3, 5) });

  Q(1, 'Koliko različitih mreža ima kocka?',
    ['11', '6', '3', '24'],
    'Mreže kocke se dele u četiri grupe: 1–4–1 (šest mreža), 2–3–1 (tri), 2–2–2 (jedna) i 3–3 (jedna).',
    'mreža', { mediji: mrezaKvadra(2, 2, 2) });

  Q(1, 'Kocka ima ivicu 2 cm. Kolika je površina njene mreže?',
    ['24 cm²', '8 cm²', '12 cm²', '48 cm²'],
    'Mreža kocke se sastoji od šest jednakih kvadrata, a svaki ima površinu 4 cm².',
    'kvadrat', { mediji: mrezaKvadra(2, 2, 2) });

  Q(2, 'Mreža kvadra ima ivice 2 cm, 3 cm i 5 cm. Kolika je njena površina?',
    ['62 cm²', '31 cm²', '30 cm²', '60 cm²'],
    'Kvadar ima tri para jednakih strana, pa mrežu čine po dva pravougaonika za svaki par.',
    'kvadar', { mediji: mrezaKvadra(2, 3, 5, { oznake: ['2', '3', '5'] }) });

  Q(2, 'Omotač trostrane prizme čija je osnova jednakostranični trougao ivice 5 cm i visine 4 cm je pravougaonik. Koje su njegove stranice?',
    ['15 cm i 4 cm', '5 cm i 4 cm', '10 cm i 4 cm', '15 cm i 5 cm'],
    'Druga stranica omotača je uvek visina prizme, bez obzira na oblik osnove.',
    'omotač', { mediji: mrezaPrizme(3, 5, 4) });

  Q(3, 'Može li se mreža sa slike (četiri kvadrata u nizu, a dva kvadrata iznad prva dva) saviti u kocku?',
    ['Ne, dva kvadrata bi pala na istu stranu kocke', 'Da, to je jedna od 11 mreža kocke', 'Da, ima šest kvadrata', 'Ne, jer kvadrati nisu u jednom redu'],
    'Kad se niz od četiri kvadrata savija oko kocke, svaki kvadrat iznad niza postaje gornja ili donja strana, pa se dva takva poklope.',
    'strana', { mediji: G({}, [kvadrat(0, 0), kvadrat(1, 0), kvadrat(2, 0), kvadrat(3, 0), kvadrat(0, 1), kvadrat(1, 1)], V()) });

  Q(1, 'Koliko pravougaonika ima mreža pravilne šestostrane prizme?',
    ['6', '2', '8', '12'],
    'Dva šestougla su osnove, a između njih se nižu bočne strane.',
    'šestougao', { mediji: mrezaPrizme(6, 3, 5) });

  Q(3, 'Omotač pravilne šestostrane prizme je kvadrat stranice 12 cm, a visina prizme je 12 cm. Kolika je osnovna ivica?',
    ['2 cm', '12 cm', '6 cm', '3 cm'],
    'Omotač je pravougaonik čija je jedna stranica obim osnove, $6 \\cdot a$, a druga visina prizme.',
    'ivica', { mediji: G({}, [kvadrat(0, 0, 12)], V()) });

  Q(3, 'Omotač trostrane prizme je pravougaonik 12 cm × 6 cm, pri čemu je 12 cm obim osnove. Kolika je ivica osnove?',
    ['4 cm', '2 cm', '12 cm', '6 cm'],
    'Ako je 6 cm obim osnove, a 12 cm visina, dobijamo drugu prizmu sa ivicom 2 cm. Zato pitanje mora biti precizno postavljeno.',
    'omotač', { mediji: G({}, [{ lin: [[0, 0], [12, 0], [12, 6], [0, 6]], zatv: 1, b: 1 }, { tx: '12 cm', at: [6, -0.9] }, { tx: '6 cm', at: [13, 3] }], V()) });

  U(2, 'Koji raspored šest kvadrata NIJE mreža kocke?',
    ['Pravougaonik 2 × 3 (dva reda po tri, jedan iznad drugog)', 'Raspored 1–4–1 (četiri u nizu, jedan iznad i jedan ispod)', 'Raspored 2–3–1 (stepenasto)', 'Raspored 3–3 (dva reda po tri, pomereni za jedan kvadrat)'],
    'Pravougaonik 2 × 3 nije mreža kocke: pri savijanju dva kvadrata padnu na istu stranu, a jedna strana ostane bez kvadrata.',
    'Kocka ima 11 mreža, a sve ostale tri vrste rasporeda su među njima.',
    'mreža', { mediji: G({}, [kvadrat(0, 0), kvadrat(1, 0), kvadrat(2, 0), kvadrat(3, 0), kvadrat(1, 1), kvadrat(2, -1)], V()) });

  S(2, 'Spoji mrežu sa vrstom prizme čiji je omotač.',
    [['dva šestougla i šest pravougaonika', 'pravilna šestostrana prizma'], ['dva trougla i tri pravougaonika', 'pravilna trostrana prizma'], ['dva kvadrata i četiri pravougaonika', 'pravilna četvorostrana prizma'], ['šest kvadrata', 'kocka']],
    'Kocka je pravilna četvorostrana prizma čija je visina jednaka ivici osnove.',
    'trougao', { mediji: mrezaKvadra(2, 2, 2) });

  Q(2, 'Mreža pravilne trostrane prizme ima tri pravougaonika ivice 3 cm i 10 cm i dva jednakostranična trougla ivice 3 cm. Kolika je površina omotača?',
    ['90 cm²', '30 cm²', '19 cm²', '60 cm²'],
    'Omotač je zbir površina tri pravougaonika dimenzija 3 cm × 10 cm, bez osnova.',
    'omotač', { mediji: mrezaPrizme(3, 3, 10) });

  Q(2, 'Mreža kocke se sastoji od šest jednakih kvadrata, a njena površina je 150 cm². Kolika je ivica kocke?',
    ['5 cm', '25 cm', '6 cm', '12,5 cm'],
    'Površina mreže je jednaka površini kocke, pa je površina jedne strane $\\frac{150}{6} = 25$ cm².',
    'kocka', { mediji: mrezaKvadra(3, 3, 3) });

  Q(1, 'Koliko pravougaonika ima mreža trostrane prizme?',
    ['3', '2', '6', '4'],
    'Svaki pravougaonik je bočna strana, a trostrana prizma ima tri bočne strane.',
    'bočna', { mediji: mrezaPrizme(3, 3, 5) });

  Q(1, 'Koji pravougaonik je omotač pravilne šestostrane prizme sa osnovnom ivicom 4 cm i visinom 9 cm?',
    ['24 cm i 9 cm', '4 cm i 9 cm', '6 cm i 9 cm', '24 cm i 6 cm'],
    'Šestougao ima šest jednakih stranica, pa omotač ima šest jednakih pravougaonika.',
    'šestougao', { mediji: mrezaPrizme(6, 4, 9) });

  // ════════════════ Površina prave prizme i prave četvorostrane prizme ════════════════
  L('Površina prave prizme i prave četvorostrane prizme');
  proveri(2 * (5 * 4 + 4 * 3 + 3 * 5) === 94 && 2 * (2 * 3 + 3 * 4 + 4 * 2) === 52, 'kvadar 5, 4, 3 i 2, 3, 4');
  proveri(2 * 9 + 4 * 3 * 6 === 90, 'pravilna četvorostrana, a = 3, H = 6');
  proveri(2 * 25 + 4 * 5 * 10 === 250 && 6 * 7 * 7 === 294, 'd = 5√2 → a = 5, H = 10; kocka 7');
  proveri(2 * 12 + 30 === 54 && 4 * 6 * 10 === 240, 'osnova 12 + omotač 30; a = 6');
  proveri(2 * 20 + (8 + 2 + 5 + 5) * 5 === 140 && (8 + 2) / 2 * 4 === 20, 'trapez 8, 2, krak 5, visina 4');
  proveri(360 - 72 === 288 && 288 / (4 * 6) === 12 && 36 * 12 === 432, 'površina 360, a = 6 → H = 12, V = 432');

  Q(1, 'Kolika je površina kocke ivice 4 cm?',
    ['96 cm²', '64 cm²', '24 cm²', '48 cm²'],
    'Kocka ima šest jednakih strana, pa je njena površina $6a^{2}$.',
    'kocka', { mediji: kocka(4) });

  Q(1, 'Šta je površina prave prizme ako je $B$ površina jedne osnove, a $M$ površina omotača?',
    ['$P = 2B + M$', '$P = B \\cdot H$', '$P = B + M$', '$P = 2B \\cdot M$'],
    'Površina prizme je zbir površina svih strana: dve osnove, $2B$, i omotač, $M$.',
    'površina', { mediji: prizma(4, 3, 5) });

  Q(1, 'Kako se računa površina omotača prave prizme?',
    ['Obim osnove puta visina', 'Površina osnove puta visina', 'Obim osnove plus visina', 'Dve površine osnove'],
    'Omotač se može posmatrati kao pravougaonik čija je jedna stranica obim osnove, a druga visina prizme.',
    'omotač', { mediji: prizma(6, 3, 5) });

  Q(1, 'Osnova prizme ima površinu 12 cm², a omotač 30 cm². Kolika je površina prizme?',
    ['54 cm²', '42 cm²', '30 cm²', '60 cm²'],
    'Dve osnove imaju zajedno dvostruku površinu jedne osnove, pa se dodaje $2 \\cdot 12$ na omotač.',
    'osnova', { mediji: prizma(3, 3, 4) });

  Q(1, 'Kvadar ima dimenzije 5 cm, 4 cm i 3 cm. Kolika mu je površina?',
    ['94 cm²', '47 cm²', '60 cm²', '120 cm²'],
    'Kvadar ima tri para jednakih strana, pa mu je površina zbir površina tri para pravougaonika, dvostruko.',
    'kvadar', { mediji: kvadar(5, 4, 3) });

  Q(1, 'Površina kocke je 294 cm². Kolika je njena ivica?',
    ['7 cm', '49 cm', '6 cm', '14 cm'],
    'Kvadrat ivice 7 cm ima površinu 49 cm², a kocka ima šest takvih strana.',
    'kocka', { mediji: kocka(3) });

  Q(2, 'Osnova pravilne četvorostrane prizme je kvadrat ivice 3 cm, a bočna ivica je 6 cm. Kolika je površina prizme?',
    ['90 cm²', '72 cm²', '81 cm²', '54 cm²'],
    'Osnova je kvadrat, pa je njena površina $a^{2}$, a omotač je $4aH$.',
    'osnova', { mediji: prizma(4, 3, 6) });

  Q(2, 'Dijagonala osnove pravilne četvorostrane prizme je $5\\sqrt{2}$ cm, a visina je dva puta veća od ivice osnove. Kolika je površina prizme?',
    ['250 cm²', '200 cm²', '225 cm²', '150 cm²'],
    'Ivicu osnove dobijamo iz dijagonale: $a\\sqrt{2} = 5\\sqrt{2}$, pa je $a = 5$ cm, a visina $10$ cm.',
    'dijagonala', { mediji: prizma(4, 5, 10, [{ d: 'AC', b: 1, debljina: 3 }]) });

  Q(1, 'Osnovna ivica pravilne šestostrane prizme je 2 cm, a visina 5 cm. Kolika je površina omotača?',
    ['60 cm²', '30 cm²', '20 cm²', '$10\\sqrt{3}$ cm²'],
    'Omotač ima šest pravougaonika, a svaki je dimenzija $2 \\cdot 5$ cm.',
    'šestougao', { mediji: prizma(6, 2, 5) });

  Q(3, 'Osnova prave prizme je jednakokraki trapez sa osnovicama 8 cm i 2 cm i krakom 5 cm. Visina prizme je 5 cm. Kolika je površina prizme?',
    ['140 cm²', '120 cm²', '160 cm²', '100 cm²'],
    'Visina trapeza je $\\sqrt{5^{2} - 3^{2}} = 4$ cm, pa je površina osnove 20 cm². Omotač se računa iz obima osnove.',
    'trapez', { mediji: prizmaOsnova([[0, 0], [8, 0], [5, 4], [3, 4]], 5) });

  Q(2, 'Površina osnove pravilne četvorostrane prizme je 36 cm², a visina 10 cm. Kolika je površina omotača?',
    ['240 cm²', '360 cm²', '120 cm²', '60 cm²'],
    'Osnova je kvadrat ivice 6 cm, pa je omotač $4 \\cdot 6 \\cdot 10$.',
    'obim', { mediji: prizma(4, 6, 10) });

  Q(2, 'Kvadar ima ivice 2 cm, 3 cm i 4 cm. Kolika mu je površina?',
    ['52 cm²', '26 cm²', '24 cm²', '96 cm²'],
    'Kvadar je zbir šest pravougaonika koji se parno poklapaju, pa se površina dobija kao zbir proizvoda parova ivica, dvostruko.',
    'omotač', { mediji: kvadar(2, 3, 4) });

  Q(3, 'Površina pravilne četvorostrane prizme je 250 cm², a ivica osnove 5 cm. Kolika je visina prizme?',
    ['10 cm', '12 cm', '8 cm', '20 cm'],
    'Od ukupne površine prvo oduzmemo dve osnove, pa ostatak delimo sa obimom osnove.',
    'visina', { medijiOdgovora: prizma(4, 5, 10) });

  Q(3, 'Ako se ivica osnove pravilne četvorostrane prizme udvostruči, a visina ostane ista, kako se promeni površina omotača?',
    ['Poveća se 2 puta', 'Poveća se 4 puta', 'Ostane ista', 'Poveća se 3 puta'],
    'Omotač je $4aH$, pa je proporcionalan ivici osnove; osnova $a^{2}$ se poveća 4 puta, ali omotač samo 2 puta.',
    'omotač', { mediji: prizma(4, 2, 4), medijiOdgovora: prizma(4, 4, 4) });

  S(2, 'Spoji telo sa formulom za njegovu površinu.',
    [['kocka ivice $a$', '$6a^{2}$'], ['kvadar sa ivicama $a, b, c$', '$2(ab + bc + ca)$'], ['pravilna četvorostrana prizma', '$2a^{2} + 4aH$'], ['omotač prave prizme', '$O \\cdot H$']],
    'Površina prizme je uvek $2B + M$, gde je $B$ površina osnove.',
    'formula', { mediji: prizma(4, 3, 5) });

  U(2, 'Koja formula NIJE za površinu prave prizme?',
    ['$P = B \\cdot H$', '$P = 2B + M$', '$P = 2B + O \\cdot H$', '$P = 2B + 4aH$ (za pravilnu četvorostranu prizmu)'],
    '$B \\cdot H$ je zapremina prizme, a ne površina. Ostale tri formule važe za površinu.',
    'Zapremina meri prostor unutar tela, a površina meri spoljašnju površ.',
    'zapremina', { mediji: prizma(4, 3, 4) });

  Q(3, 'Osnova prave prizme je jednakokraki pravougli trougao sa katetama 4 cm. Visina prizme je 5 cm. Kolika je površina prizme?',
    ['$56 + 20\\sqrt{2}$ cm²', '$40 + 20\\sqrt{2}$ cm²', '$56 + 40\\sqrt{2}$ cm²', '$24 + 20\\sqrt{2}$ cm²'],
    'Hipotenuza osnove je $4\\sqrt{2}$ cm, pa je omotač obim osnove puta visina. Površina osnove je 8 cm².',
    'hipotenuza', { mediji: prizmaOsnova([[0, 0], [4, 0], [0, 4]], 5) });

  // ════════════════ Površina prave trostrane prizme i pravilne šestostrane prizme ════════════════
  L('Površina prave trostrane prizme i pravilne šestostrane prizme');
  proveri(3 * 4 * 10 === 120 && 3 * 3 * 10 === 90 && 3 * 2 * 5 === 30, 'omotači trostrane prizme');
  proveri(6 * 3 * 5 === 90 && 6 * 2 * 4 === 48 && 6 * 4 * 2 === 48, 'omotači šestostrane prizme');
  proveri(Math.abs(2 * Math.sqrt(3) + 12 - (12 + 2 * Math.sqrt(3))) < 1e-9, 'jednakoivična ivica 2');
  proveri(Math.abs(2 * 6 * Math.sqrt(3) + 48 - (48 + 12 * Math.sqrt(3))) < 1e-9, 'šestostrana a = 2, H = 4');
  proveri(Math.abs(6 * 12 * 3 * Math.sqrt(3) - 216 * Math.sqrt(3)) < 1e-9, 'M = 6aH = 216√3 za a = 12, H = 3√3');
  proveri(Math.abs(3 * 144 * Math.sqrt(3) / 2 - 216 * Math.sqrt(3)) < 1e-9, 'osnova 3a²√3/2 = 216√3 za a = 12');
  proveri(Math.abs(4 * 4 * Math.sqrt(3) / 4 - 4 * Math.sqrt(3)) < 1e-9, 'trougao ivice 4: B = 4√3');

  Q(1, 'Osnova prizme je jednakostranični trougao stranice 4 cm. Kolika je površina osnove?',
    ['$4\\sqrt{3}$ cm²', '$8\\sqrt{3}$ cm²', '4 cm²', '16 cm²'],
    'Visina jednakostraničnog trougla stranice $a$ je $\\frac{a\\sqrt{3}}{2}$, pa je površina $\\frac{a^{2}\\sqrt{3}}{4}$.',
    'trougao', { mediji: trougao([[0, 0], [4, 0], [2, 3.464]]) });

  Q(1, 'Pravilna trostrana prizma ima ivicu osnove 2 cm i visinu 5 cm. Kolika je površina omotača?',
    ['30 cm²', '10 cm²', '15 cm²', '60 cm²'],
    'Omotač se sastoji od tri pravougaonika dimenzija 2 cm × 5 cm.',
    'omotač', { mediji: prizma(3, 2, 5) });

  Q(1, 'Pravilna trostrana prizma ima ivicu osnove 4 cm i visinu 10 cm. Kolika je površina omotača?',
    ['120 cm²', '40 cm²', '60 cm²', '140 cm²'],
    'Ako omotač razvijemo, dobijamo pravougaonik čija je dužina tri ivice osnove.',
    'strana', { mediji: prizma(3, 4, 10) });

  Q(1, 'Pravilna šestostrana prizma ima ivicu osnove 3 cm i visinu 5 cm. Kolika je površina omotača?',
    ['90 cm²', '45 cm²', '15 cm²', '60 cm²'],
    'Omotač je pravougaonik čija je jedna stranica obim osnove, $6 \\cdot 3$, a druga visina prizme.',
    'šestougao', { mediji: prizma(6, 3, 5) });

  Q(1, 'Kolika je površina osnove pravilne šestostrane prizme ivice 2 cm?',
    ['$6\\sqrt{3}$ cm²', '$12\\sqrt{3}$ cm²', '$3\\sqrt{3}$ cm²', '$4\\sqrt{3}$ cm²'],
    'Šestougao se može podeliti na šest jednakostraničnih trouglova iste stranice.',
    'osnova', { mediji: prizma(6, 2, 4) });

  Q(2, 'Na koliko jednakostraničnih trouglova se može podeliti osnova pravilne šestostrane prizme?',
    ['6', '3', '4', '12'],
    'Svi trouglovi imaju zajedničko teme u centru šestougla, pa je ugao kod centra $360° : 6 = 60°$.',
    'centar', { mediji: prizma(6, 2, 4), medijiOdgovora: sestougao(2) });

  Q(2, 'Pravilna šestostrana prizma ima ivicu 2 cm i visinu 4 cm. Kolika je površina prizme?',
    ['$48 + 12\\sqrt{3}$ cm²', '$24 + 12\\sqrt{3}$ cm²', '$48 + 6\\sqrt{3}$ cm²', '$12 + 48\\sqrt{3}$ cm²'],
    'Dve osnove daju $12\\sqrt{3}$ cm², a omotač je $12 \\cdot 4 = 48$ cm².',
    'površina', { mediji: prizma(6, 2, 4) });

  Q(3, 'Pravilna trostrana prizma je jednakoivična, a ivica joj je 2 cm. Kolika je njena površina?',
    ['$12 + 2\\sqrt{3}$ cm²', '$12 + \\sqrt{3}$ cm²', '$6 + 2\\sqrt{3}$ cm²', '$4 + 4\\sqrt{3}$ cm²'],
    'Osnova je trougao ivice 2 cm, pa su dve osnove zajedno $2\\sqrt{3}$ cm².',
    'ivica', { mediji: prizma(3, 2, 2) });

  Q(3, 'Rastojanje između ravni osnova pravilne trostrane prizme je 7 cm, a rastojanje između dve bočne ivice je 4 cm. Kolika je površina prizme?',
    ['$84 + 8\\sqrt{3}$ cm²', '$84 + 4\\sqrt{3}$ cm²', '$42 + 8\\sqrt{3}$ cm²', '$56 + 8\\sqrt{3}$ cm²'],
    'Rastojanje između bočnih ivica je ivica osnove, a rastojanje između osnova je visina prizme.',
    'rastojanje', { mediji: prizma(3, 4, 7) });

  Q(3, 'Omotač pravilne trostrane prizme je pravougaonik 12 cm × 6 cm, a 12 cm je obim osnove. Kolika je površina prizme?',
    ['$72 + 8\\sqrt{3}$ cm²', '$72 + 4\\sqrt{3}$ cm²', '$36 + 8\\sqrt{3}$ cm²', '$12 + 8\\sqrt{3}$ cm²'],
    'Ivica osnove je 4 cm, pa je površina osnove $4\\sqrt{3}$ cm². Isti pravougaonik mogao bi biti omotač prizme sa ivicom 2 cm, ali tada je visina 12 cm.',
    'omotač', { mediji: mrezaPrizme(3, 4, 6) });

  Q(2, 'Kolika je površina pravilne šestostrane prizme ivice 1 cm i visine 1 cm?',
    ['$6 + 3\\sqrt{3}$ cm²', '$3 + 6\\sqrt{3}$ cm²', '$6 + 6\\sqrt{3}$ cm²', '$3\\sqrt{3} + 3$ cm²'],
    'Osnova šestougla je šest jednakostraničnih trouglova, pa je njena površina $2 \\cdot \\frac{3\\sqrt{3}}{2}$ za dve osnove.',
    'šestougao', { mediji: prizma(6, 1, 1) });

  U(2, 'Koja formula NIJE za površinu pravilne šestostrane prizme (ivica $a$, visina $H$)?',
    ['$P = \\frac{3a^{2}\\sqrt{3}}{2} \\cdot H$', '$P = 3a^{2}\\sqrt{3} + 6aH$', '$P = 2 \\cdot \\frac{3a^{2}\\sqrt{3}}{2} + 6aH$', '$P = 2B + M$, gde je $B = \\frac{3a^{2}\\sqrt{3}}{2}$ i $M = 6aH$'],
    '$\\frac{3a^{2}\\sqrt{3}}{2} \\cdot H$ je zapremina prizme, a ne površina.',
    'Ostale tri formule su različiti zapisi istog zbira: dve osnove plus omotač.',
    'osnova', { mediji: prizma(6, 2, 3) });

  Q(3, 'Površina omotača pravilne šestostrane prizme jednaka je površini jedne osnove, a ta površina je $216\\sqrt{3}$ cm². Kolika je visina ako je ivica osnove 12 cm?',
    ['$3\\sqrt{3}$ cm', '3 cm', '$6\\sqrt{3}$ cm', '12 cm'],
    'Površina osnove je $\\frac{3a^{2}\\sqrt{3}}{2}$, pa je $a = 12$ cm. Iz omotača $6aH = 216\\sqrt{3}$ sledi visina.',
    'visina', { medijiOdgovora: prizma(6, 12, 3 * Math.sqrt(3)) });

  S(2, 'Spoji oblik osnove sa njenom površinom za ivicu $a$.',
    [['jednakostranični trougao', '$\\frac{a^{2}\\sqrt{3}}{4}$'], ['pravilni šestougao', '$\\frac{3a^{2}\\sqrt{3}}{2}$'], ['kvadrat', '$a^{2}$'], ['pravougli trougao sa katetama $a$ i $b$', '$\\frac{ab}{2}$']],
    'Šestougao se sastoji od šest jednakostraničnih trouglova, pa mu je površina šest puta veća od trougla iste stranice.',
    'trougao', { mediji: prizma(3, 4, 5) });

  Q(2, 'Omotač pravilne trostrane prizme je 48 cm², a visina 4 cm. Kolika je ivica osnove?',
    ['4 cm', '6 cm', '12 cm', '16 cm'],
    'Omotač je obim osnove puta visina, $3a \\cdot 4 = 48$, pa je $3a = 12$ cm.',
    'obim', { medijiOdgovora: prizma(3, 4, 4) });

  Q(1, 'Kolika je površina omotača pravilne šestostrane prizme ivice 4 cm i visine 2 cm?',
    ['48 cm²', '24 cm²', '12 cm²', '96 cm²'],
    'Omotač se sastoji od šest pravougaonika dimenzija 4 cm × 2 cm.',
    'omotač', { mediji: prizma(6, 4, 2) });

  // ════════════════ Zapremina prizme i prave četvorostrane prizme ════════════════
  L('Zapremina prizme i prave četvorostrane prizme');
  proveri(2 * 3 * 4 === 24 && 5 * 6 * 7 === 210 && 6 ** 3 === 216, 'kvadar 2×3×4, 5×6×7, kocka 6');
  proveri(4 ** 2 * 7 === 112 && 4 ** 2 * 5 === 80, 'pravilne četvorostrane prizme');
  proveri(27 + 64 + 125 === 216, 'zbir kubova 3, 4, 5 = 6³');
  proveri(36 * 12 === 432 && 288 / 24 === 12, 'površina 360, a = 6 → H = 12, V = 432');
  proveri((8 + 2) / 2 * 4 * 3 === 60, 'trapez 8, 2, visina 4, prizma visine 3');
  proveri(144 * 10 === 1440 && 7 ** 3 === 343 && 6 * 49 === 294, 'a² · 10 = 1440 → a = 12; kocka 343 → 294');

  Q(1, 'Kolika je zapremina kvadra dimenzija 2 cm, 3 cm i 4 cm?',
    ['24 cm³', '9 cm³', '14 cm³', '48 cm³'],
    'Zapremina je broj jediničnih kockica ivice 1 cm koje ispunjavaju kvadar. Kockice se slažu u tri sloja, pa se broje redovi i kolone.',
    'zapremina', { mediji: kocke(4, 3, 2) });

  Q(1, 'Kolika je zapremina kocke ivice 6 cm?',
    ['216 cm³', '36 cm³', '108 cm³', '72 cm³'],
    'Kad se ivica udvostruči, zapremina kocke se poveća 8 puta.',
    'kocka', { mediji: kocka(6) });

  Q(1, 'Koja je formula za zapreminu prave prizme, ako je $B$ površina osnove, a $H$ visina?',
    ['$V = B \\cdot H$', '$V = B + H$', '$V = 2B + M$', '$V = O \\cdot H$'],
    'Ista formula važi za sve prave prizme, bez obzira na oblik osnove.',
    'visina', { mediji: prizma(4, 3, 5) });

  Q(1, 'Kvadar ima dimenzije 5 cm, 6 cm i 7 cm. Kolika mu je zapremina?',
    ['210 cm³', '180 cm³', '118 cm³', '420 cm³'],
    'Zapremina se dobija množenjem tri dimenzije, pa redosled faktora nije važan.',
    'kvadar', { mediji: kvadar(5, 6, 7) });

  Q(1, 'Koliko kockica ivice 1 cm staje u kocku ivice 4 cm?',
    ['64', '16', '48', '12'],
    'U jedan sloj kocke ivice 4 cm staje $4 \\cdot 4 = 16$ kockica, a slojeva ima četiri.',
    'kockica', { mediji: kocke(4, 4, 4) });

  Q(2, 'Osnova pravilne četvorostrane prizme je kvadrat ivice 4 cm, a visina 7 cm. Kolika je zapremina?',
    ['112 cm³', '28 cm³', '56 cm³', '224 cm³'],
    'Površina osnove je 16 cm², pa zapreminu dobijamo množenjem sa visinom.',
    'osnova', { mediji: prizma(4, 4, 7) });

  Q(2, 'Osnova pravilne četvorostrane prizme je kvadrat ivice 4 cm, a zapremina je 80 cm³. Kolika je visina?',
    ['5 cm', '20 cm', '10 cm', '4 cm'],
    'Iz formule $V = a^{2} \\cdot H$ visina je količnik zapremine i površine osnove.',
    'visina', { medijiOdgovora: prizma(4, 4, 5) });

  Q(2, 'Osnova prave prizme je jednakokraki trapez sa osnovicama 8 cm i 2 cm i visinom trapeza 4 cm. Visina prizme je 3 cm. Kolika je zapremina?',
    ['60 cm³', '40 cm³', '30 cm³', '120 cm³'],
    'Površina trapeza je srednja vrednost osnovica puta visina trapeza, pa je površina osnove 20 cm².',
    'trapez', { mediji: prizmaOsnova([[0, 0], [8, 0], [5, 4], [3, 4]], 3) });

  Q(3, 'Površina pravilne četvorostrane prizme je 360 cm², a ivica osnove 6 cm. Kolika je zapremina?',
    ['432 cm³', '216 cm³', '360 cm³', '288 cm³'],
    'Prvo iz površine nađemo omotač, pa iz omotača visinu, a zatim zapreminu.',
    'površina', { mediji: prizma(4, 6, 12) });

  Q(2, 'Dve prizme imaju osnove iste površine i jednake visine. Šta važi za njihove zapremine?',
    ['Zapremine su jednake, a prizme ne moraju biti podudarne', 'Zapremine su različite', 'Prva je veća za površinu osnove', 'Zapremina zavisi samo od visine'],
    'Ovo je tvrdio italijanski matematičar Bonaventura Kavalijeri (1598–1647). To je Kavalijerijev princip.',
    'kavalijer', { mediji: kocke(4, 3, 2) });

  Q(3, 'Pravilna četvorostrana prizma ima zapreminu 1440 cm³, a bočna ivica je 10 cm. Kolika je ivica osnove?',
    ['12 cm', '24 cm', '6 cm', '144 cm'],
    'Osnova je kvadrat, pa iz zapremine dobijamo površinu osnove $a^{2} = 144$ cm², a zatim i ivicu.',
    'ivica', { medijiOdgovora: prizma(4, 12, 10) });

  Q(3, 'Kocka ima zapreminu 343 cm³. Kolika je njena površina?',
    ['294 cm²', '343 cm²', '98 cm²', '49 cm²'],
    'Od zapremine prvo nađemo ivicu ($7$ cm), a zatim površinu, $6 \\cdot 49$.',
    'kocka', { mediji: kocka(7) });

  Q(3, 'Zapremina kocke jednaka je zbiru zapremina tri kocke ivica 3 cm, 4 cm i 5 cm. Kolika je ivica te kocke?',
    ['6 cm', '12 cm', '8 cm', '9 cm'],
    'Zbir kubova je $3^{3} + 4^{3} + 5^{3} = 27 + 64 + 125 = 216 = 6^{3}$.',
    'zbir', { mediji: kocka(3) });

  Q(2, 'Kolika je zapremina kvadra čije su ivice 2 dm, 3 dm i 5 dm (u litrima)?',
    ['30 l', '10 l', '3 l', '300 l'],
    '1 dm³ je jedan litar, pa se zapremina iz decimetara direktno meri u litrima.',
    'litar', { mediji: kvadar(2, 3, 5) });

  S(2, 'Spoji telo sa formulom za njegovu zapreminu.',
    [['kocka ivice $a$', '$a^{3}$'], ['kvadar sa ivicama $a, b, c$', '$a \\cdot b \\cdot c$'], ['prava prizma sa osnovom $B$ i visinom $H$', '$B \\cdot H$'], ['pravilna četvorostrana prizma osnovne ivice $a$', '$a^{2} \\cdot H$']],
    'Formula $V = B \\cdot H$ važi za sve prave prizme.',
    'formula', { mediji: kocke(3, 3, 3) });

  U(2, 'Koja jedinica NIJE jedinica za zapreminu?',
    ['cm²', 'm³', 'dm³', 'litar'],
    'cm² je jedinica za površinu. cm³, dm³ i m³ su jedinice za zapreminu, a litar je zapremina od 1 dm³.',
    'Jedan kubni metar staje 1000 litara.',
    'jedinica', { mediji: kocka(3) });

  Q(2, 'Pravilna četvorostrana prizma ima osnovnu ivicu 5 cm i visinu 2 cm. Kolika je zapremina?',
    ['50 cm³', '25 cm³', '10 cm³', '100 cm³'],
    'Površina osnove je 25 cm², a visina 2 cm.',
    'osnovna',
    { mediji: prizma(4, 5, 2) });

  // ════════════════ Zapremina prave trostrane prizme i pravilne šestostrane prizme ════════════════
  L('Zapremina prave trostrane prizme i pravilne šestostrane prizme');
  proveri(Math.abs(16 * Math.sqrt(3) / 4 * 5 - 20 * Math.sqrt(3)) < 1e-9, 'trostrana a = 4, H = 5: V = 20√3');
  proveri(Math.abs(36 * Math.sqrt(3) / 4 * 6 - 54 * Math.sqrt(3)) < 1e-9, 'jednakoivična a = 6: V = 54√3');
  proveri(Math.abs(3 * 4 * Math.sqrt(3) / 2 * 5 - 30 * Math.sqrt(3)) < 1e-9 && Math.abs(3 * 4 * Math.sqrt(3) / 2 * 3 - 18 * Math.sqrt(3)) < 1e-9, 'šestostrana a = 2: V = 30√3 (H = 5), 18√3 (H = 3)');
  proveri(Math.abs(3 * 36 * Math.sqrt(3) / 2 * 10 - 540 * Math.sqrt(3)) < 1e-9, 'šestostrana a = 6, H = 10: V = 540√3');
  proveri(Math.abs(16 * Math.sqrt(3) / 4 * 9 - 36 * Math.sqrt(3)) < 1e-9, 'trostrana a = 4, V = 36√3 → H = 9');
  proveri(Math.abs(3 * 16 * Math.sqrt(3) / 2 * 5 - 120 * Math.sqrt(3)) < 1e-9, 'šestostrana a = 4, H = 5: V = 120√3');
  proveri(Math.abs(36 * Math.sqrt(3) / 4 * 2 - 18 * Math.sqrt(3)) < 1e-9, 'trostrana a = 6, H = 2: V = 18√3');

  Q(1, 'Koja je formula za zapreminu pravilne trostrane prizme ivice osnove $a$ i visine $H$?',
    ['$V = \\frac{a^{2}\\sqrt{3}}{4} \\cdot H$', '$V = a^{2}\\sqrt{3} \\cdot H$', '$V = \\frac{a^{2}\\sqrt{3}}{2} \\cdot H$', '$V = \\frac{a^{2}}{4} \\cdot H$'],
    'Osnova je jednakostranični trougao, a njegova površina je $\\frac{a^{2}\\sqrt{3}}{4}$. Zapremina je površina osnove puta visina.',
    'zapremina', { mediji: prizma(3, 4, 6) });

  Q(2, 'Pravilna trostrana prizma je jednakoivična sa ivicom 6 cm. Kolika je zapremina?',
    ['$54\\sqrt{3}$ cm³', '$27\\sqrt{3}$ cm³', '$36\\sqrt{3}$ cm³', '$108\\sqrt{3}$ cm³'],
    'Osnova je trougao ivice 6 cm, pa je njena površina $9\\sqrt{3}$ cm². Visina je takođe 6 cm.',
    'ivica', { mediji: prizma(3, 6, 6) });

  Q(1, 'Osnovna ivica pravilne trostrane prizme je 4 cm, a visina 5 cm. Kolika je zapremina?',
    ['$20\\sqrt{3}$ cm³', '$10\\sqrt{3}$ cm³', '$40\\sqrt{3}$ cm³', '$16\\sqrt{3}$ cm³'],
    'Osnova ima površinu $4\\sqrt{3}$ cm², pa zapreminu dobijamo množenjem sa visinom.',
    'osnova', { mediji: prizma(3, 4, 5) });

  Q(1, 'Osnovna ivica pravilne šestostrane prizme je 2 cm, a visina 5 cm. Kolika je zapremina?',
    ['$30\\sqrt{3}$ cm³', '$10\\sqrt{3}$ cm³', '$60\\sqrt{3}$ cm³', '$15\\sqrt{3}$ cm³'],
    'Šestougao ivice 2 cm sastavljen je od šest trouglova ivice 2 cm, a svaki ima površinu $\\sqrt{3}$ cm².',
    'šestougao', { mediji: prizma(6, 2, 5) });

  Q(2, 'Pravilna šestostrana prizma ima ivicu osnove 2 cm i visinu 3 cm. Kolika je zapremina?',
    ['$18\\sqrt{3}$ cm³', '$9\\sqrt{3}$ cm³', '$36\\sqrt{3}$ cm³', '$6\\sqrt{3}$ cm³'],
    'Kad se ivica udvostruči, površina osnove se poveća 4 puta, pa i zapremina pri istoj visini.',
    'visina', { mediji: prizma(6, 2, 3) });

  Q(3, 'Zapremina pravilne šestostrane prizme je $540\\sqrt{3}$ cm³, a visina 10 cm. Kolika je ivica osnove?',
    ['6 cm', '12 cm', '3 cm', '9 cm'],
    'Iz zapremine dobijamo površinu osnove, $\\frac{3a^{2}\\sqrt{3}}{2} = 54\\sqrt{3}$, a iz nje ivicu.',
    'ivica', { medijiOdgovora: prizma(6, 6, 10) });

  Q(3, 'Zapremina pravilne trostrane prizme je $36\\sqrt{3}$ cm³, a ivica osnove 4 cm. Kolika je visina?',
    ['9 cm', '12 cm', '6 cm', '18 cm'],
    'Površina osnove je $4\\sqrt{3}$ cm², pa visinu dobijamo deljenjem zapremine sa njom.',
    'visina', { medijiOdgovora: prizma(3, 4, 9) });

  Q(2, 'Osnova prave prizme je pravougli trougao sa katetama 3 cm i 8 cm, a visina prizme je 5 cm. Kolika je zapremina?',
    ['60 cm³', '120 cm³', '30 cm³', '15 cm³'],
    'Površina osnove je polovina proizvoda kateta, $\\frac{3 \\cdot 8}{2} = 12$ cm².',
    'kateta', { mediji: prizmaOsnova([[0, 0], [8, 0], [0, 3]], 5) });

  Q(2, 'Osnova prave prizme je jednakokraki pravougli trougao sa katetom 4 cm, a visina prizme je 10 cm. Kolika je zapremina?',
    ['80 cm³', '40 cm³', '160 cm³', '20 cm³'],
    'Hipotenuza osnove je $4\\sqrt{2}$ cm, ali za zapreminu nam ona nije potrebna.',
    'hipotenuza', { mediji: prizmaOsnova([[0, 0], [4, 0], [0, 4]], 10) });

  Q(3, 'Ivica osnove pravilne šestostrane prizme se udvostruči, a visina ostane ista. Kako se promeni zapremina?',
    ['Poveća se 4 puta', 'Poveća se 2 puta', 'Poveća se 8 puta', 'Ne menja se'],
    'Zapremina zavisi od površine osnove, a ona zavisi od kvadrata ivice.',
    'zapremina', { mediji: prizma(6, 2, 4), medijiOdgovora: prizma(6, 4, 4) });

  Q(2, 'Pravilna trostrana prizma je jednakoivična sa ivicom 2 cm. Kolika je zapremina?',
    ['$2\\sqrt{3}$ cm³', '$\\sqrt{3}$ cm³', '$4\\sqrt{3}$ cm³', '$8\\sqrt{3}$ cm³'],
    'Ovo je jednakoivična prizma: visina je jednaka ivici.',
    'ivica', { mediji: prizma(3, 2, 2) });

  Q(3, 'Zapremina pravilne trostrane prizme je $18\\sqrt{3}$ cm³, a visina 2 cm. Kolika je ivica osnove?',
    ['6 cm', '3 cm', '12 cm', '9 cm'],
    'Površina osnove je $9\\sqrt{3}$ cm², pa ivicu nalazimo iz $\\frac{a^{2}\\sqrt{3}}{4} = 9\\sqrt{3}$.',
    'osnova', { medijiOdgovora: prizma(3, 6, 2) });

  U(3, 'Koja formula NIJE za zapreminu pravilne šestostrane prizme?',
    ['$V = \\frac{a^{2}\\sqrt{3}}{4} \\cdot H$', '$V = \\frac{3a^{2}\\sqrt{3}}{2} \\cdot H$', '$V = 6 \\cdot \\frac{a^{2}\\sqrt{3}}{4} \\cdot H$', '$V = B \\cdot H$, gde je $B = \\frac{3a^{2}\\sqrt{3}}{2}$'],
    '$\\frac{a^{2}\\sqrt{3}}{4}$ je površina jednog jednakostraničnog trougla, a ne cele osnove šestostrane prizme.',
    'Šestougao se može podeliti na šest jednakostraničnih trouglova, pa je njegova površina šest puta veća.',
    'šestougao', { mediji: prizma(6, 2, 3) });

  S(2, 'Spoji prizmu sa njenom zapreminom.',
    [['pravilna trostrana prizma, $a = 2$, $H = 5$', '$5\\sqrt{3}$ cm³'], ['pravilna šestostrana prizma, $a = 2$, $H = 5$', '$30\\sqrt{3}$ cm³'], ['kocka ivice 2 cm', '8 cm³'], ['kvadar 2 cm × 3 cm × 5 cm', '30 cm³']],
    'Zapremina se uvek računa kao površina osnove puta visina.',
    'zapremina', { mediji: prizma(3, 2, 5) });

  Q(2, 'Pravilna šestostrana prizma ima dugačku dijagonalu osnove 8 cm i visinu 5 cm. Kolika je zapremina?',
    ['$120\\sqrt{3}$ cm³', '$60\\sqrt{3}$ cm³', '$240\\sqrt{3}$ cm³', '$40\\sqrt{3}$ cm³'],
    'Duža dijagonala šestougla je dvostruka ivica, pa je ivica 4 cm.',
    'dijagonala', { mediji: prizma(6, 4, 5, [{ d: 'AD', b: 1, debljina: 3 }]) });

  Q(2, 'Pravilna šestostrana prizma ima površinu osnove $6\\sqrt{3}$ cm² i visinu 4 cm. Kolika je zapremina?',
    ['$24\\sqrt{3}$ cm³', '$6\\sqrt{3}$ cm³', '$12\\sqrt{3}$ cm³', '$48\\sqrt{3}$ cm³'],
    'Zapremina je površina osnove puta visina, pa je $6\\sqrt{3} \\cdot 4 = 24\\sqrt{3}$ cm³.',
    'površina', { mediji: prizma(6, 2, 4) });

  // ════════════════ Neke primene površine i zapremine prizme ════════════════
  L('Neke primene površine i zapremine prizme');
  proveri(10 * 10 * 10 === 1000 && 2 * 2 * 2 * 8 === 64, 'kocka 10 cm; kocka 2 cm, masa 8 · 8 = 64 g');
  proveri(Math.abs(8.96 * 1000 - 8960) < 1e-9 && 0.74 * 10000 === 7400, 'bakar 8,96 g/cm³ · 1000 cm³; stub 0,74 · 10 000');
  proveri(40 * 20 * 30 === 24000 && 24000 * 0.75 === 18000, 'akvarijum 40 × 20 × 30 cm, tri četvrtine');
  proveri(5 * 10 * 2 === 100 && 20 * 10 * 2 * 0.75 === 300 && 20 * 15 * 2.5 * 0.6 === 450, 'bazeni');
  proveri(2 * (5 * 3 + 4 * 3) === 54 && 3 * 3 * 3 - 4 === 23, 'zidovi sobe; kocka 3 minus 4 ugla');
  proveri(10 * 12 * 4 + 6 * 6 / 2 * 12 === 696, 'kuća: kvadar 480 m³ + prizma 216 m³');

  Q(1, 'Koliko litara vode staje u kocku ivice 1 dm?',
    ['1 l', '10 l', '100 l', '1000 l'],
    '1 dm³ je jedan litar, a 1 m³ je 1000 litara.',
    'litar', { mediji: kocka(3) });

  Q(1, 'Koliko litara vode staje u kocku ivice 1 m?',
    ['1000 l', '100 l', '10 000 l', '1 l'],
    'Kocka ivice 1 m ima zapreminu 1 m³, a to je 1000 dm³, odnosno 1000 litara.',
    'metar', { mediji: kocka(3) });

  Q(1, 'Bazen je oblika kvadra: dužina 5 m, širina 10 m i dubina 2 m. Koliko litara vode može da stane u njega?',
    ['100 000 l', '10 000 l', '1000 l', '20 000 l'],
    'Zapremina bazena je 100 m³, a 1 m³ je 1000 litara.',
    'bazen', { mediji: kvadar(5, 10, 2) });

  Q(3, 'Bazen dimenzija 20 m × 10 m × 2 m napunjen je do tri četvrtine visine. Koliko litara vode ima u njemu?',
    ['300 000 l', '400 000 l', '30 000 l', '150 000 l'],
    'Tri četvrtine od 400 m³ je 300 m³, a to je 300 000 litara.',
    'četvrtina', { mediji: kvadar(20, 10, 2) });

  Q(1, 'Kocka ivice 2 cm ima gustinu 8 g/cm³. Kolika joj je masa?',
    ['64 g', '16 g', '512 g', '24 g'],
    'Masa tela je proizvod gustine i zapremine: $m = \\rho \\cdot V$, pa je $m = 8 \\cdot 8$.',
    'gustina', { mediji: kocka(2) });

  Q(2, 'Bakarna kocka ivice 10 cm ima gustinu 8,96 g/cm³. Kolika je njena masa?',
    ['8,96 kg', '896 g', '89,6 kg', '0,896 kg'],
    'Zapremina je 1000 cm³, pa je masa $8{,}96 \\cdot 1000 = 8960$ g, odnosno 8,96 kg.',
    'bakar', { mediji: kocka(3) });

  Q(2, 'Stub je pravilna četvorostrana prizma osnovne ivice 10 cm i visine 1 m, od drveta gustine 0,74 g/cm³. Kolika mu je masa?',
    ['7,4 kg', '74 kg', '0,74 kg', '740 g'],
    'Zapremina je $10 \\cdot 10 \\cdot 100 = 10\\,000$ cm³, pa je masa $0{,}74 \\cdot 10\\,000 = 7400$ g.',
    'stub');

  Q(2, 'Kad se kocka ivice 4 cm potopi u punu posudu sa vodom, koliko vode se izlije?',
    ['64 cm³', '16 cm³', '48 cm³', '96 cm³'],
    'Arhimedov zakon: potopljeno telo istisne onoliko tečnosti koliki je njegov potopljeni deo.',
    'Arhimed', { mediji: kocka(4) });

  Q(2, 'Kutija oblika kocke ivice 10 cm nema poklopac. Koliko kartona treba za nju?',
    ['500 cm²', '600 cm²', '400 cm²', '1000 cm²'],
    'Kocka ima šest strana, a kutija bez poklopca ima pet.',
    'kutija', { mediji: kocka(10) });

  Q(2, 'Zidovi sobe oblika kvadra dimenzija 5 m × 4 m × 3 m (bez poda i plafona) treba da se okreče. Kolika je površina zidova?',
    ['54 m²', '60 m²', '47 m²', '40 m²'],
    'Zidovi su dve strane 5 m × 3 m i dve strane 4 m × 3 m, pa je zbir $2(15 + 12)$.',
    'zid', { mediji: kvadar(5, 4, 3) });

  Q(3, 'Iz kocke ivice 3 cm izvučene su po jedna mala kocka ivice 1 cm iz četiri ugla. Kolika je zapremina preostalog tela?',
    ['23 cm³', '27 cm³', '19 cm³', '31 cm³'],
    'Kad iz kocke izvučemo mali deo, zapremina se smanji za zapreminu tog dela: $27 - 4 = 23$.',
    'ugao', { mediji: kocke(3, 3, 3) });

  Q(3, 'Kuća ima oblik kvadra dimenzija 10 m × 12 m × 4 m, a na vrhu je prizma čija je osnova jednakokraki pravougli trougao sa katetom 6 m i dužine 12 m. Kolika je zapremina kuće?',
    ['696 m³', '480 m³', '216 m³', '576 m³'],
    'Zapremina kuće je zbir zapremine kvadra (480 m³) i zapremine prizme na njemu (216 m³).',
    'krov');

  Q(3, 'Bazen dimenzija 20 m × 15 m × 2,5 m napunjen je do tri petine visine. Koliko litara vode ima?',
    ['450 000 l', '750 000 l', '300 000 l', '45 000 l'],
    'Pun bazen bi imao 750 m³, a tri petine su 450 m³.',
    'petina', { mediji: kvadar(20, 15, 2.5) });

  Q(2, 'Akvarijum oblika kvadra ima dno 40 cm × 20 cm i visinu 30 cm. Koliko litara vode staje u njega do vrha?',
    ['24 l', '240 l', '2,4 l', '12 l'],
    'Zapremina je 24 000 cm³, a 1 l je $1 dm³ = 1000 cm³$.',
    'akvarijum', { mediji: kvadar(40, 20, 30) });

  Q(3, 'Isti akvarijum (dno 40 cm × 20 cm, visina 30 cm) napunjen je do tri četvrtine visine. Koliko litara vode ima?',
    ['18 l', '24 l', '6 l', '30 l'],
    'Tri četvrtine visine daju tri četvrtine zapremine: $\\frac{3}{4} \\cdot 24 = 18$ l.',
    'nivo', { mediji: kvadar(40, 20, 30) });

  S(2, 'Spoji veličinu sa njenim izrazom ili vrednošću.',
    [['masa tela', '$m = \\rho \\cdot V$'], ['gustina', '$\\rho = \\frac{m}{V}$'], ['1 dm³ zapremine', '1 l'], ['1 cm³ vode teži', '1 g']],
    'Voda ima gustinu približno 1 g/cm³, pa 1 m³ vode teži 1000 kg.',
    'masa', { mediji: kocka(3) });
};
