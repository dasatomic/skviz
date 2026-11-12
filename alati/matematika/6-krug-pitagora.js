// Krug, mnogouglovi, Pitagorina teorema, sličnost
module.exports = ({ T, Q, U, S, A, F, G, proveri, r, S3, rad, naKrugu, pravilni, pr }) => {
  T('Krug, mnogouglovi i Pitagorina teorema');
  const K = (u, R = 4) => naKrugu([0, 0], R, u);

  S(2, 'Spoji pojam sa opisom', [['Tetiva', 'Spaja dve tačke kružnice'], ['Prečnik', 'Tetiva kroz centar'], ['Tangenta', 'Dodiruje kružnicu u jednoj tački'], ['Sečica', 'Seče kružnicu u dve tačke']],
    'Prečnik je najduža tetiva i dva puta je duži od poluprečnika. Tangenta je uvek normalna na poluprečnik u tački dodira – zato točak ne „propada“ kroz put.',
    'tetiva', {
      medijiOdgovora: G({ O: [0, 0], A: K(160), B: K(70), C: K(215), D: K(35), T: [0, -4], P: [-5, -4], R: [5, -4], M: [-5.5, -3], N: [5.5, -1.2] }, [
        { kr: 'O', r: 4, b: 5 }, { d: 'AB', b: 0, o: '~tetiva' }, { d: 'CD', b: 2, o: '~prečnik' }, { d: 'PR', b: 1, o: '~tangenta', na: 0.8 }, { d: 'MN', b: 3, o: '~sečica', na: 0.92 },
      ], { bezImena: ['O', 'A', 'B', 'C', 'D', 'T', 'P', 'R', 'M', 'N'], velicina: 240 }),
    });

  Q(1, 'Kako se zove prava p na slici?', ['Tangenta', 'Sečica', 'Tetiva', 'Poluprečnik'],
    'Tangenta dodiruje kružnicu u samo jednoj tački (lat. tangere – dodirnuti). Kad se kamen zavitlan u praćki pusti, poleti baš po tangenti.',
    'tangenta', { mediji: G({ O: [0, 0, -90], T: [0, 3, 90], P: [-4.5, 3], R: [4.5, 3] }, [{ kr: 'O', r: 3, b: 0 }, { d: 'PR', b: 1 }, { tacka: 'OT' }, { tx: 'p', at: [4, 3.6], b: 1 }], { bezImena: ['P', 'R'], velicina: 220 }) });

  {
    const t = { O: [0, 0, 90], A: K(230), B: K(310), C: K(100) };
    Q(3, 'Centralni ugao $AOB$ je 80°. Koliki je periferijski ugao $ACB$ nad istim lukom?', ['40°', '80°', '160°', '20°'],
      'Periferijski ugao je uvek POLOVINA centralnog ugla nad istim lukom: 80° : 2 = 40°. I gde god da se tačka $C$ pomeri po većem luku, ugao ostaje 40°!',
      'ugao', { mediji: G(t, [{ kr: 'O', r: 4, b: 5 }, { d: 'OA' }, { d: 'OB' }, { d: 'CA', b: 0 }, { d: 'CB', b: 0 }, { u: 'AOB', o: '80°' }, { u: 'ACB', o: 'α', b: 1, r: 30 }], { velicina: 220 }), medijiOdgovora: A('periferijski-ugao') });
  }

  Q(2, '$AB$ je prečnik kruga, a $C$ je bilo koja tačka na kružnici. Koliki je ugao $ACB$?', ['Uvek 90°', 'Uvek 60°', 'Uvek 45°', 'Zavisi od tačke $C$'],
    'To je Talesova teorema: ugao nad prečnikom je uvek prav. Centralni ugao nad prečnikom je opružen (180°), a periferijski je njegova polovina. Tako se pravi ugao može naći i bez uglomera.',
    'tales', { mediji: G({ O: [0, 0, -90], A: [-4, 0], B: [4, 0], C: K(60) }, [{ kr: 'O', r: 4, b: 5 }, { p: 'ABC', b: 0 }, { u: 'ACB', o: '?', b: 1 }, { tacka: 'O' }], { velicina: 220 }), medijiOdgovora: A('tales') });

  Q(2, 'Kolika je površina kruga poluprečnika 10 cm (π ≈ 3,14)?', ['314 cm²', '62,8 cm²', '31,4 cm²', '628 cm²'],
    '$P = r^{2}π = 10 · 10 · 3,14 = 314$ cm². Krug isečen na tanke isečke može se preslagati u „pravougaonik“ dužine $πr$ i visine $r$ – zato je površina $πr · r$.',
    'površina', { medijiOdgovora: A('povrsina-kruga') });

  Q(2, 'Ako se poluprečnik kruga udvostruči, šta se desi sa površinom?', ['Poveća se 4 puta', 'Udvostruči se', 'Poveća se 3 puta', 'Poveća se 8 puta'],
    'Površina zavisi od KVADRATA poluprečnika: $(2r)^{2} = 4r^{2}$. Isto važi za svaki lik: kvadrat duplo duže stranice sastoji se od 4 stara kvadrata.',
    'površina', { medijiOdgovora: G({ O: [1, 1], P: [6, 2] }, [{ kr: 'O', r: 1, b: 0, pun: 1 }, { kr: 'P', r: 2, b: 1, pun: 1 }, { tx: 'r', at: [1, -0.5] }, { tx: '2r', at: [6, -0.5] }, { tx: '× 4', at: [3.3, 3.2], b: 3 }], { bezImena: ['O', 'P'], velicina: 220 }) });

  proveri(20 * 20 > 2 * 12.5 * 12.5, 'pice');
  Q(3, 'Šta je više pice: jedna prečnika 40 cm ili dve prečnika 25 cm?', ['Jedna od 40 cm', 'Dve od 25 cm', 'Isto je', 'Zavisi od debljine testa'],
    'Površina raste sa kvadratom: $20^{2} = 400$, a $2 · 12,5^{2} = 312,5$ (puta π). Jedna velika pica ima oko 28% više nego dve srednje!',
    'pica', { mediji: G({ O: [0, 0], P: [6.8, 1.5], R: [6.8, -1.5] }, [{ kr: 'O', r: 4, b: 3, pun: 1 }, { kr: 'P', r: 2.5 * 0.6, b: 1, pun: 1 }, { kr: 'R', r: 2.5 * 0.6, b: 1, pun: 1 }, { tx: '40 cm', at: [0, 0] }, { tx: '25 cm', at: [6.8, 1.5] }, { tx: '25 cm', at: [6.8, -1.5] }], { bezImena: ['O', 'P', 'R'], velicina: 260 }) });

  Q(1, 'Koji deo kruga je ovaj isečak od 120°?', ['${1|3}$', '${1|4}$', '${1|6}$', '${1|2}$'],
    'Ceo krug je 360°, a 120° je trećina od toga. Isečci od 120° dele krug na tri jednaka dela – kao znak „Mercedesa“ ili tri parčeta torte.',
    'isečak', { mediji: G({ O: [0, 0] }, [{ kr: 'O', r: 4, b: 5 }, { is: 'O', r: 4, od: 90, do: 210, b: 1, gusto: 1, o: '120°' }], { bezImena: ['O'], velicina: 200 }) });

  proveri(Math.abs(2 * 10 * Math.PI - 62.8) < 0.1, 'kazaljka');
  Q(2, 'Minutna kazaljka je duga 10 cm. Koliki put pređe njen vrh za jedan sat?', ['Oko 62,8 cm', 'Oko 31,4 cm', 'Oko 314 cm', 'Tačno 60 cm'],
    'Za sat vremena vrh obiđe ceo krug: $O = 2rπ = 2 · 10 · 3,14$ ≈ 62,8 cm. Mala kazaljka iste dužine za to vreme pređe samo dvanaestinu toga.',
    'kazaljka', { mediji: { vrsta: 'sat', vreme: '4:00' } });

  {
    const t = pravilni(6, 4);
    Q(2, 'Koliki je zbir unutrašnjih uglova šestougla?', ['720°', '540°', '1.080°', '360°'],
      'Dijagonale iz jednog temena dele šestougao na 4 trougla: 4 · 180° = 720°. Uopšte, mnogougao sa $n$ stranica ima zbir $(n − 2) · 180°$.',
      'šestougao', { mediji: G(t, [{ p: 'ABCDEF', b: 2 }], { bezImena: Object.keys(t), velicina: 200 }), medijiOdgovora: A('triangulacija') });
  }

  {
    const t = pravilni(8, 4, [0, 0], 22.5);
    proveri(((8 - 2) * 180) / 8 === 135, 'osmougao');
    Q(3, 'Saobraćajni znak STOP je pravilan osmougao. Koliki je svaki njegov unutrašnji ugao?', ['135°', '120°', '140°', '150°'],
      'Zbir uglova osmougla je (8 − 2) · 180° = 1.080°, a pošto su svi jednaki: 1.080° : 8 = 135°. Brže: spoljašnji ugao je 360° : 8 = 45°, a unutrašnji 180° − 45°.',
      'osmougao', { mediji: G(t, [{ p: 'ABCDEFGH', b: 1, gusto: 1 }], { bezImena: Object.keys(t), velicina: 190 }) });
  }

  {
    const t = {}, e = [];
    let k = 0;
    for (const [cx, cy] of [[0, 0], [3, S3], [3, -S3], [0, 2 * S3], [0, -2 * S3], [-3, S3], [-3, -S3]]) {
      const im = 'abcdef'.split('').map((c) => c + k);
      Object.assign(t, pravilni(6, 2, [cx, cy], 0, im));
      e.push({ p: im.join(''), b: k % 2 ? 3 : 2, gusto: k === 0 ? 1 : 0 });
      k++;
    }
    for (const n of Object.keys(t)) t[n] = t[n].map((x) => r(x));
    Q(3, 'Ravan se može popločati bez praznina samo jednom vrstom pravilnih mnogouglova. Kojim NE MOŽE?', ['Petouglovima', 'Trouglovima', 'Kvadratima', 'Šestouglovima'],
      'U jednom temenu uglovi moraju dati tačno 360°: trouglovi 6 · 60°, kvadrati 4 · 90°, šestouglovi 3 · 120°. Ugao petougla je 108°, a 360 nije deljivo sa 108. Pčele grade saće od šestouglova – oni troše najmanje voska za istu površinu.',
      'parket', { medijiOdgovora: G(t, e, { bezImena: Object.keys(t), velicina: 220 }) });
  }

  Q(3, 'Spoljašnji ugao pravilnog mnogougla je 30°. Koliko taj mnogougao ima stranica?', ['12', '10', '6', '30'],
    'Kad se obiđe ceo mnogougao, skrene se ukupno za pun krug: zbir spoljašnjih uglova je uvek 360°. Pa je 360° : 30° = 12 stranica (dvanaestougao).',
    'mnogougao');

  {
    const t = { A: [0, 0, 225], B: [4, 0], C: [0, 3], a1: [4, -4], a2: [0, -4], b1: [-3, 3], b2: [-3, 0], c1: [3, 7], c2: [7, 4] };
    Q(1, 'Nad stranicama pravouglog trougla nacrtani su kvadrati. Kolika je površina najvećeg kvadrata?', ['25', '7', '12', '20'],
      'Pitagorina teorema: kvadrat nad hipotenuzom ima površinu jednaku zbiru kvadrata nad katetama: 9 + 16 = 25. Hipotenuza je zato $√{25} = 5$.',
      'pitagora', {
        mediji: G(t, [{ p: 'ABC', b: 3, gusto: 1 }, { p: 'ABa1a2', b: 0, o: '16' }, { p: 'ACb1b2', b: 2, o: '9' }, { p: 'BCc1c2', b: 1, o: '?' }, { pu: 'BAC', b: 3 }], { bezImena: ['A', 'B', 'C'], velicina: 220 }),
        medijiOdgovora: A('pitagora'),
      });
  }

  proveri(8 * 8 + 15 * 15 === 17 * 17 && 5 * 5 + 11 * 11 !== 12 * 12 && 6 * 6 + 7 * 7 !== 81 && 4 * 4 + 6 * 6 !== 64, 'trojke');
  Q(3, 'Koje dužine mogu biti stranice pravouglog trougla?', ['8, 15 i 17', '5, 11 i 12', '6, 7 i 9', '4, 6 i 8'],
    '$8^{2} + 15^{2} = 64 + 225 = 289 = 17^{2}$. Takve trojke zovu se Pitagorine trojke. Vavilonska glinena pločica Plimpton 322 stara skoro 4.000 godina sadrži spisak takvih trojki!',
    'trojka');

  Q(2, 'Merdevine duge 5 m oslonjene su o zid, a donji kraj je 3 m od zida. Koliko visoko dosežu?', ['4 m', '2 m', '3,5 m', '4,5 m'],
    '$5^{2} − 3^{2} = 25 − 9 = 16$, a $√{16} = 4$ m. Trougao 3–4–5 je najpoznatija Pitagorina trojka – priča se da su egipatski graditelji konopcem sa 12 jednakih razmaka pravili prav ugao.',
    'merdevine', { mediji: G({ A: [0, 0], B: [3, 0], C: [0, 4], Z: [0, 5], P: [4, 0] }, [{ d: 'AZ', b: 5 }, { d: 'AP', b: 5 }, { d: 'BC', b: 3, o: '5 m' }, { d: 'AB', o: '3 m', os: -1 }, { d: 'AC', isp: 1, b: 1, o: '?' }, { pu: 'BAC', b: 5 }], { bezImena: ['A', 'B', 'C', 'Z', 'P'], velicina: 200 }) });

  proveri(48 * 48 + 36 * 36 === 60 * 60, 'TV');
  Q(2, 'Ekran je širok 48 cm i visok 36 cm. Kolika je njegova dijagonala?', ['60 cm', '84 cm', '54 cm', '42 cm'],
    '$48^{2} + 36^{2} = 2.304 + 1.296 = 3.600$, a $√{3.600} = 60$ cm. Brže: to je trougao 3–4–5 uvećan 12 puta. Veličina televizora se meri baš po dijagonali, u inčima (1 inč = 2,54 cm).',
    'ekran', { mediji: G({ A: [0, 0], B: [4.8, 0], C: [4.8, 3.6], D: [0, 3.6] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '48 cm' }, { d: 'BC', o: '36 cm' }, { d: 'AC', isp: 1, b: 1, o: '?' }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 220 }) });

  Q(3, 'Kolika je udaljenost (vazdušnom linijom) od tačke $A$ do tačke $B$ ako je stranica polja 1?', ['5', '7', '6', '$√{7}$'],
    'Od $A$ do $B$ ide se 3 polja udesno i 4 nagore – to su katete, a tražena duž je hipotenuza: $√{3^{2} + 4^{2}} = 5$. Hodanjem „po ulicama“ put bi bio 3 + 4 = 7.',
    'udaljenost', {
      mediji: G({ A: [1, 1, 225], B: [4, 5, 45] }, [{ mreza: [0, 5, 0, 6], brojevi: 0 }, { tacka: 'AB', b: 1 }], { velicina: 200 }),
      medijiOdgovora: G({ A: [1, 1, 225], B: [4, 5, 45], C: [4, 1, -45] }, [{ mreza: [0, 5, 0, 6], brojevi: 0 }, { d: 'AC', b: 3, o: '3' }, { d: 'CB', b: 3, o: '4' }, { d: 'AB', b: 1, o: '5' }, { pu: 'ACB', b: 3 }], { bezImena: ['C'], velicina: 200 }),
    });

  Q(3, 'Kolika je visina jednakostraničnog trougla čija je stranica 2?', ['$√{3}$', '1', '$√{2}$', '2'],
    'Visina deli trougao na dva pravougla trougla sa hipotenuzom 2 i katetom 1: $h = √{2^{2} − 1^{2}} = √{3}$ ≈ 1,73. Uopšte, visina jednakostraničnog trougla stranice $a$ je ${a√{3}|2}$.',
    'visina', { mediji: G({ A: [0, 0], B: [2, 0], C: [1, r(S3)], H: [1, 0] }, [{ p: 'ABC', b: 0 }, { d: 'CH', isp: 1, b: 1, o: 'h' }, { pu: 'BHC', b: 3 }, { d: 'AB', o: '2' }], { bezImena: ['H'], velicina: 180 }) });

  Q(2, 'Štap visok 1 m baca senku dugu 2 m. U isto vreme drvo baca senku od 12 m. Koliko je visoko drvo?', ['6 m', '24 m', '12 m', '3 m'],
    'Sunčevi zraci su paralelni, pa su trouglovi štap–senka i drvo–senka slični: drvo je visoko pola svoje senke. Tako je Tales, kažu, izmerio visinu Keopsove piramide.',
    'senka', { mediji: G({ A: [0, 0], B: [2, 0], C: [0, 1], D: [4, 0], E: [16, 0], F: [4, 6] }, [{ p: 'ABC', b: 3 }, { p: 'DEF', b: 2 }, { d: 'AC', b: 5, o: '1 m' }, { d: 'AB', o: '2 m' }, { d: 'DE', o: '12 m' }, { d: 'DF', b: 5, o: '?' }], { bezImena: ['A', 'B', 'C', 'D', 'E', 'F'], velicina: 280 }) });

  {
    const h = r(S3 / 2), e = [];
    const tr = (x, y, s) => [[x, y], [x + s, y], [r(x + s / 2), r(y + s * h * 2 / 2)]];
    e.push({ lin: tr(0, 0, 1), zatv: 1, b: 0, gusto: 1 });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - i; j++) e.push({ lin: tr(2 + j + i * 0.5, r(i * h), 1), zatv: 1, b: 1 });
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2 - i; j++) e.push({ lin: [[2.5 + j + i * 0.5, r((i + 1) * h)], [3.5 + j + i * 0.5, r((i + 1) * h)], [3 + j + i * 0.5, r(i * h)]], zatv: 1, b: 4 });
    Q(3, 'Sve stranice trougla se uvećaju 3 puta. Koliko puta se poveća njegova površina?', ['9 puta', '3 puta', '6 puta', '27 puta'],
      'Kad se dužine uvećaju $k$ puta, površina se uveća $k · k$ puta: 3 · 3 = 9. Na slici: veliki trougao se sastoji od 9 malih. Zapremina tela bi se uvećala čak 3 · 3 · 3 = 27 puta.',
      'površina', { mediji: G({ O: [0, 0] }, [e[0], { lin: tr(2, 0, 3), zatv: 1, b: 1 }], { bezImena: ['O'], velicina: 220 }), medijiOdgovora: G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 220 }) });
  }

  Q(1, 'Maketa kuće u razmeri 1 : 50 visoka je 20 cm. Kolika je visina prave kuće?', ['10 m', '1 m', '100 m', '2,5 m'],
    '20 cm · 50 = 1.000 cm = 10 m. Razmera kaže koliko puta je stvarnost veća od modela; maketa voza u razmeri 1 : 87 („H0“) je najpopularnija na svetu.',
    'maketa');

  proveri(Math.abs(1 / (2 * Math.PI) - 0.159) < 0.001, 'konopac');
  Q(3, 'Konopac čvrsto obavija Zemlju po ekvatoru. Produžimo ga za samo 1 m i podignemo ravnomerno svuda okolo. Koliko visoko će biti iznad zemlje?', ['Oko 16 cm', 'Manje od 1 mm', 'Oko 1 cm', 'Oko 1 m'],
    'Obim je $2πr$, pa duži obim za 1 m znači poluprečnik veći za ${1|2π}$ m ≈ 16 cm – bez obzira na to koliko je krug velik! Ista visina bi bila i oko lopte za tenis. Većina ljudi pogađa „manje od milimetra“.',
    'konopac', { vreme: 30 });

  Q(3, 'Kvadrat je upisan u krug poluprečnika 1. Kolika je površina kvadrata?', ['2', '1', '4', '1,5'],
    'Dijagonale kvadrata su prečnici kruga (dužine 2) i normalne su, pa kvadrat čine 4 pravougla trougla sa katetama 1: 4 · ${1|2}$ = 2. Krug ima površinu π ≈ 3,14, pa kvadrat zauzima oko 64% kruga.',
    'kvadrat', { mediji: G({ O: [0, 0], A: [1, 0], B: [0, 1], C: [-1, 0], D: [0, -1] }, [{ kr: 'O', r: 1, b: 5 }, { p: 'ABCD', b: 0 }, { d: 'OA', o: '1', b: 3 }], { bezImena: ['O', 'A', 'B', 'C', 'D'], velicina: 190 }), medijiOdgovora: G({ O: [0, 0], A: [1, 0], B: [0, 1], C: [-1, 0], D: [0, -1] }, [{ kr: 'O', r: 1, b: 5 }, { p: 'ABCD', b: 0 }, { d: 'AC', b: 1 }, { d: 'BD', b: 1 }], { bezImena: ['O', 'A', 'B', 'C', 'D'], velicina: 190 }) });

  S(2, 'Spoji veličinu sa formulom (krug poluprečnika $r$)', [['Obim kruga', '$2rπ$'], ['Površina kruga', '$r^{2}π$'], ['Prečnik', '$2r$'], ['Dužina polukružnice', '$rπ$']],
    'Lako se pomešaju obim i površina: površina ima KVADRAT (jedinica je cm²), a obim nema (jedinica je cm). Dužina luka od α stepeni je ${α|360°}$ obima.',
    'obim');
};
