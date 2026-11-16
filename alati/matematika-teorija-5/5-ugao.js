// Lekcije 26–31: ugao i vrste uglova, merenje, unakrsni uglovi, transverzala.
module.exports = ({ L, Q, U, S, G, r, naKrugu, uglomer, O, bez }) => {

  // ugao sa temenom A, krakovima AB (udesno) i AC pod datim stepenom
  const ugao = (stepen, { o = '', pu = false, b = 0 } = {}) => {
    const t = { A: [0, 0], B: [4, 0], C: naKrugu([0, 0], 4, stepen) };
    const e = [{ u: 'BAC', b, ...(o ? { o } : {}) }];
    if (pu) e.push({ pu: 'BAC' });
    return G(t, e, { velicina: 240 });
  };

  // ── 26. pojam ugla ──
  L('Ugao, centralni ugao, jednakost uglova');
  Q(1, 'Šta je ugao?',
    ['Deo ravni između dve poluprave sa zajedničkim početkom', 'Duž između dve tačke', 'Zatvorena linija', 'Tačka preseka'],
    'Ugao čine dve poluprave (kraci) koje polaze iz iste tačke (temena). Ugao je deo ravni između tih krakova.', 'ugao');
  Q(1, 'Kako se zove zajednička početna tačka krakova ugla?',
    ['Teme', 'Krak', 'Stranica', 'Centar'],
    'Teme je tačka iz koje polaze oba kraka ugla. Ugao $\\angle AOB$ ima teme u tački O.', 'teme');
  Q(1, 'Kako se zovu poluprave koje čine ugao?',
    ['Kraci', 'Temena', 'Stranice', 'Dijagonale'],
    'Kraci su dve poluprave koje polaze iz temena. Ugao je „razmak“ između njih.', 'krak');
  Q(2, 'Kako se označava ugao sa temenom O i kracima kroz A i B?',
    ['$\\angle AOB$', '$AB$', '$\\vec{AB}$', '$O + A + B$'],
    'Ugao označavamo sa $\\angle AOB$ (teme u sredini) ili grčkim slovom, na primer $\\alpha$.', 'ugao', { mediji: { vrsta: 'formula', tekst: '$\\angle AOB$' } });
  Q(2, 'Šta je CENTRALNI ugao?',
    ['Ugao čije je teme u centru kružnice', 'Ugao na vrhu trougla', 'Ugao od 90°', 'Ugao veći od 180°'],
    'Centralni ugao ima teme u centru kružnice, a kraci su mu poluprečnici. Njegovi kraci na kružnici odsecaju luk.', 'ugao');
  Q(2, 'Kada su dva ugla jednaka?',
    ['Kada se mogu potpuno preklopiti', 'Kada imaju isto teme', 'Kada su oštri', 'Kada su naslikana istom bojom'],
    'Dva ugla su jednaka ako im je „razmak“ krakova isti – mogu se preklopiti jedan preko drugog. Veličina ugla ne zavisi od dužine krakova.', 'jednakost');
  Q(3, 'Šta se dešava sa uglom ako mu krake produžiš?',
    ['Ugao ostaje isti', 'Ugao se povećava', 'Ugao se smanjuje', 'Ugao postaje prav'],
    'Dužina krakova ne utiče na veličinu ugla – bitan je samo razmak između krakova. Produženi kraci čine isti ugao.', 'ugao');

  // ── 27. prenošenje i nadovezivanje uglova ──
  L('Prenošenje i nadovezivanje uglova');
  Q(1, 'Kojim priborom najlakše prenosiš (meriš) ugao?',
    ['Uglomerom', 'Lenjirom', 'Šestarom', 'Trouglom'],
    'Uglomer je polukrug sa podelom u stepenima – njime merimo i prenosimo uglove. Šestar i lenjir takođe mogu, ali sporije.', 'uglomer');
  Q(1, 'Šta znači NADOVEZATI uglove?',
    ['Postaviti jedan ugao uz drugi, krak do kraka', 'Postaviti ih jedan preko drugog', 'Nacrtati ih daleko', 'Sabrati im temena'],
    'Nadovezivanje: jedan krak drugog ugla postavimo na krak prvog, tako da se uglovi nastave jedan na drugi. Njihove veličine se tada sabiraju.', 'ugao');
  Q(2, 'Nadovežeš ugao od 30° na ugao od 40°. Koliki je zbirni ugao?',
    ['70°', '60°', '80°', '10°'],
    'Nadovezivanjem se uglovi sabiraju: $30° + 40° = 70°$.', 'ugao',
    { mediji: G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 30), C: naKrugu([0, 0], 4, 70) }, [{ u: 'AOB', b: 1, o: '30°' }, { u: 'BOC', b: 2, o: '40°' }, { tx: 'O', at: [0, -0.5], vel: 15 }], { velicina: 260 }) });
  Q(2, 'Ugao od 80° podeljen je na dva dela. Jedan deo ima 30°, koliki je drugi?',
    ['50°', '60°', '40°', '110°'],
    'Delovi se dopunjuju do celog ugla: $80° - 30° = 50°$.', 'ugao');
  Q(3, 'Dva jednaka ugla nadovezana daju ugao od 90°. Koliki je svaki?',
    ['45°', '30°', '60°', '90°'],
    'Ako su jednaki i zajedno daju 90°, svaki je polovina: $90° : 2 = 45°$. To je polovina pravog ugla.', 'ugao');

  S(1, 'Spoji vrstu ugla sa brojem stepeni.',
    [['Prav', '90°'], ['Opružen', '180°'], ['Pun', '360°'], ['Oštar', 'manji od 90°']],
    'Oštar je ispod 90°, prav je tačno 90°, tup je između 90° i 180°, opružen je 180°, a pun ceo krug od 360°.', 'ugao');

  // ── 28. vrste uglova ──
  L('Upoređivanje uglova; vrste uglova');
  Q(1, 'Kako se zove ugao manji od 90°?',
    ['Oštar ugao', 'Tup ugao', 'Prav ugao', 'Opružen ugao'],
    'Oštar ugao je manji od pravog (90°). Ime je dobio jer „bode“ svojim šiljatim vrhom.', 'oštar');
  Q(1, 'Kako se zove ugao od tačno 90°?',
    ['Prav ugao', 'Oštar ugao', 'Tup ugao', 'Pun ugao'],
    'Prav ugao ima tačno 90°. Označavamo ga malim kvadratićem u temenu. Ivice kvadrata zaklapaju prave uglove.', 'prav', { mediji: ugao(90, { pu: true }) });
  Q(1, 'Kako se zove ugao veći od 90°, a manji od 180°?',
    ['Tup ugao', 'Oštar ugao', 'Prav ugao', 'Opružen ugao'],
    'Tup ugao je veći od pravog, a manji od opruženog. „Tup“ znači da je široko otvoren, bez oštrog vrha.', 'tup');
  Q(1, 'Kako se zove ugao od tačno 180°?',
    ['Opružen ugao', 'Prav ugao', 'Pun ugao', 'Oštar ugao'],
    'Opružen ugao ima 180° – kraci su mu na istoj pravoj, ali gledaju na suprotne strane. Liči na potpuno otvoren lenjir.', 'opružen');
  Q(2, 'Koliko stepeni ima PUN ugao?',
    ['360°', '180°', '90°', '270°'],
    'Pun ugao ima 360° – to je ceo krug. Krak se obiđe ceo krug i vrati na početak.', 'pun');
  Q(2, 'Koji ugao je prikazan na slici?',
    ['Prav ugao (90°)', 'Oštar ugao', 'Tup ugao', 'Opružen ugao'],
    'Krak je uspravan u odnosu na drugi, a kvadratić u temenu označava prav ugao od 90°.', 'prav', { mediji: ugao(90, { pu: true }) });
  Q(3, 'Ugao veći od 180°, a manji od 360° zove se…',
    ['Nekonveksan (udubljen) ugao', 'Tup ugao', 'Oštar ugao', 'Prav ugao'],
    'Nekonveksan ugao je „udubljen“ – veći od opruženog, a manji od punog. Primer je ugao od 270° (tri četvrtine kruga).', 'nekonveksan');

  // ── 29. merenje uglova ──
  L('Merenje uglova; sabiranje i oduzimanje uglova');
  Q(1, 'U kojoj jedinici merimo uglove?',
    ['U stepenima (°)', 'U metrima', 'U litrima', 'U gramima'],
    'Uglove merimo u stepenima. Znak za stepen je mali kružić: $90°$. Pun krug ima 360 stepeni.', 'stepen');
  Q(1, 'Koliko stepeni ima prav ugao?',
    ['90°', '45°', '180°', '360°'],
    'Prav ugao ima 90° – četvrtina punog kruga. Četiri prava ugla zajedno čine pun krug.', 'stepen');
  Q(1, 'Koliko minuta ima jedan stepen?',
    ['60', '100', '10', '360'],
    'Jedan stepen deli se na 60 minuta ($60\'$), a jedan minut na 60 sekundi ($60"$). Isto kao kod sata!', 'minut');
  Q(2, 'Koliko stepeni ima opružen ugao?',
    ['180°', '90°', '360°', '45°'],
    'Opružen ugao ima 180° – pola punog kruga. Dva prava ugla zajedno daju opružen ugao.', 'stepen');
  Q(2, 'Koliko je $30° + 45°$?',
    ['75°', '60°', '70°', '80°'],
    'Uglovi se sabiraju kao brojevi: $30° + 45° = 75°$.', 'stepen');
  Q(2, 'Koliko je $120° - 40°$?',
    ['80°', '70°', '90°', '60°'],
    'Oduzimanje uglova: $120° - 40° = 80°$.', 'stepen');
  Q(3, 'Koliko stepeni ima ugao koji je polovina pravog ugla?',
    ['45°', '30°', '60°', '90°'],
    'Polovina pravog ugla: $90° : 2 = 45°$. Taj ugao je oštar.', 'stepen');

  // ── 30. ugao između dve prave; unakrsni uglovi ──
  L('Ugao između dve prave; unakrsni uglovi');
  Q(1, 'Kada se dve prave seku, koliko uglova nastaje?',
    ['4', '2', '6', '8'],
    'Dve prave koje se seku grade 4 ugla oko presečne tačke. Uglovi koji su jedan naspram drugog su unakrsni.', 'ugao');
  Q(1, 'Kako se zovu uglovi koji su jedan NASPRAM drugog pri preseku dve prave?',
    ['Unakrsni uglovi', 'Uporedni uglovi', 'Saglasni uglovi', 'Naizmenični uglovi'],
    'Unakrsni uglovi se nalaze „preko puta“ presečne tačke – kraci jednog su produžeci krakova drugog.', 'unakrsni');
  Q(2, 'Šta važi za unakrsne uglove?',
    ['Oni su jednaki', 'Oni su komplementni', 'Njihov zbir je 180°', 'Oni su oštri'],
    'Unakrsni uglovi su uvek jednaki. Ako jedan ima 70°, njemu unakrsni ugao takođe ima 70°.', 'unakrsni');
  Q(2, 'Dva susedna ugla koja se dopunjuju do opruženog (180°) zovu se…',
    ['Uporedni (suplementni) uglovi', 'Unakrsni uglovi', 'Komplementni uglovi', 'Prav uglovi'],
    'Uporedni uglovi imaju zajednički krak, a ostala dva kraka čine pravu. Njihov zbir je uvek 180°.', 'uporedan');
  Q(2, 'Ako jedan unakrsni ugao ima 55°, koliki je njemu unakrsni ugao?',
    ['55°', '125°', '35°', '90°'],
    'Unakrsni uglovi su jednaki, pa i drugi ima 55°. Ugao uporedan sa njima imao bi $180° - 55° = 125°$.', 'unakrsni');
  Q(3, 'Pri preseku dve prave, jedan ugao ima 120°. Koliki je njemu UPOREDAN ugao?',
    ['60°', '120°', '30°', '90°'],
    'Uporedni uglovi se dopunjuju do 180°: $180° - 120° = 60°$. Unakrsni ugao bi bio 120° (jednak polaznom).', 'uporedan');

  // ── 31. transverzala ──
  L('Uglovi na transverzali');
  Q(1, 'Kako se zove prava koja seče dve (ili više) paralelne prave?',
    ['Transverzala', 'Simetrala', 'Tangenta', 'Dijagonala'],
    'Transverzala je prava koja preseca druge prave. Kad seče dve paralele, nastaje 8 uglova sa posebnim odnosima.', 'saglasni');
  Q(1, 'Uglovi koji su sa iste strane transverzale i na istim mestima uz paralele zovu se…',
    ['Saglasni uglovi', 'Unakrsni uglovi', 'Uporedni uglovi', 'Komplementni uglovi'],
    'Saglasni uglovi su na istim „položajima“ u odnosu na transverzalu – jedan gore levo, drugi dole levo, na primer.', 'saglasni');
  Q(2, 'Šta važi za saglasne uglove na paralelnim pravama?',
    ['Oni su jednaki', 'Njihov zbir je 90°', 'Njihov zbir je 180°', 'Oni su uvek oštri'],
    'Kad transverzala seče paralelne prave, saglasni uglovi su jednaki. To je osnova mnogih dokaza u geometriji.', 'saglasni');
  Q(2, 'Uglovi na suprotnim stranama transverzale, između paralelnih pravih, zovu se…',
    ['Naizmenični uglovi', 'Saglasni uglovi', 'Unakrsni uglovi', 'Prav uglovi'],
    'Naizmenični uglovi su „u cik-cak“ položaju: jedan iznad, drugi ispod, sa suprotnih strana transverzale.', 'naizmeničan');
  Q(2, 'Šta važi za naizmenične uglove na paralelnim pravama?',
    ['Oni su jednaki', 'Njihov zbir je 180°', 'Njihov zbir je 90°', 'Oni su uvek tupi'],
    'Naizmenični uglovi na paralelnim pravama su jednaki. Zajedno sa saglasnim uglovima, to su najvažnija svojstva transverzale.', 'naizmeničan');
  Q(3, 'Na paralelnim pravama presecanim transverzalom, jedan ugao ima 70°. Koliki je njemu saglasan ugao?',
    ['70°', '110°', '20°', '90°'],
    'Saglasni uglovi su jednaki, pa i njemu saglasan ugao ima 70°. Uporedan ugao sa njim imao bi $180°-70°=110°$.', 'saglasni');

};
