// Piramida — 8. razred: pojam, vrste, elementi, mreža, površina i zapremina (teorija, „u glavi“).
// Gradivo po udžbeniku Matematika 8 (2. deo, lekcije 5.1–5.6); pitanja su sopstvena, sa sopstvenim brojevima.
// Računi (kao u zadacima za papir) su tu samo kao provera u pitanjima „pogledaj crtež“ i kad je odgovor
// pojam ili tvrdnja, a ne izračunata vrednost. Crteži: piramida, kosa piramida, mreže, prizma iste osnove
// i visine, telo (interaktivni 3D model).
module.exports = ({ L, Q, U, S, G, proveri, r, piramida, piramidaOsnova, mrezaPiramide, mrezaPrizme, prizma, telo, pravilnaOsnova }) => {
  const V = (x = {}) => ({ velicina: 240, ...x });
  const kv = (x) => Math.sqrt(x);
  // provere brojeva koji se pojavljuju u pitanjima i odgovorima (gradnja pukne ako nisu tačni)
  proveri(Math.abs(Math.sqrt(4 * 4 + 3 * 3) - 5) < 1e-9, 'apotema a=6 H=4 (OM=3) je 5');
  proveri(Math.abs(Math.sqrt(3 * 3 + 4 * 4) - 5) < 1e-9, 'apotema a=8 H=3 (OM=4) je 5');
  proveri(Math.abs(Math.sqrt(5 * 5 + 12 * 12) - 13) < 1e-9, 'apotema a=10 H=12 (OM=5) je 13');
  proveri(Math.abs(4 * (6 * 5) / 2 - 60) < 1e-9, 'omotač a=6 apotema 5');
  proveri(Math.abs((8 * 8 * 3) / 3 - 64) < 1e-9, 'V a=8 H=3 (zapremina 64)');
  proveri(Math.abs((36 * 4) / 3 - 48) < 1e-9, 'V a=6 H=4 (zapremina 48)');
  proveri(Math.abs((36 * 2) / 3 - 24) < 1e-9, 'V a=6 H=2 (zapremina 24)');
  proveri(Math.abs(9 * kv(3) * 5 / 3 - 15 * kv(3)) < 1e-9, 'trostrana B=9√3 H=5 → V=15√3');
  proveri(Math.abs(6 * kv(3) * 6 / 3 - 12 * kv(3)) < 1e-9, 'šestostrana a=2 H=6 → V=12√3');
  proveri(Math.abs(1225 * 21.6 / 3 - 8820) < 1e-6, 'Luvr: V ≈ 8820 m³');
  proveri(Math.abs(52900 * 146 / 3 / 8820 - 292) < 1, 'Keops/Luvr odnos ≈ 300 puta');
  proveri(6 - 10 + 6 === 2, 'Ojler: petostrana piramida T=6, I=10, S=6');
  proveri(Math.abs(kv(6 * 6 + 4 * 4) - 7.21) < 0.01, 'dijagonala, provera');

  // središte osnovne ivice AB (A, B = prva dva temena po obodu osnove)
  const sredAB = (n, a) => {
    const p = n === 4 ? [[-a / 2, -a / 2], [a / 2, -a / 2]] : pravilnaOsnova(n, a).slice(0, 2);
    return { M: [r((p[0][0] + p[1][0]) / 2), r((p[0][1] + p[1][1]) / 2), 0] };
  };
  // piramida sa istaknutom apotemom SM (M = sredina ivice AB) i visinom SO
  const saApotemom = (n, a, H, e = []) => piramida(n, a, H, [{ d: 'SM', b: 2, debljina: 3 }, ...e], V({ T3: sredAB(n, a) }));
  const saVisinom = (n, a, H) => piramida(n, a, H, [{ d: 'SO', b: 1, debljina: 3 }], V());
  // šestostrana piramida: pogled pomeren da slovo E ne upadne u oznaku SO
  const sest = (a, H, e = [], x = {}) => piramida(6, a, H, e, V({ theta: 40, ...x }));
  // kosa piramida: vrh S nije iznad centra osnove; O je podnožje visine
  const kosa = (istakni = false) => piramidaOsnova([[0, 0], [6, 0], [6, 4], [0, 4]], [4, 1, 5], istakni ? [{ d: 'SO', b: 1, debljina: 3 }] : [], { T3: { O: [4, 1, 0] } });

  // ════════════════ 5.1 Piramida: pojam, vrste, elementi ════════════════
  L('Piramida: pojam, vrste, elementi');

  Q(1, 'Kako se zove piramida čija je osnova petougao?',
    ['petostrana piramida', 'petostrana prizma', 'petougaona kupa', 'peterostrana kocka'],
    'Piramida se zove po obliku osnove: trostrana, četvorostrana, petostrana, šestostrana. Prizma sa istom osnovom ima drugi naziv.', 'petostrana',
    { mediji: piramida(5, 4, 5, [], V()) });
  Q(1, 'Istaknuta duž na crtežu spaja vrh sa centrom osnove i stoji pod pravim uglom na osnovu. Kako se zove?',
    ['visina piramide', 'apotema', 'bočna ivica', 'ivica osnove'],
    'Visina je normalna na osnovu i pada u centar. Apotema je u bočnoj strani, a bočna ivica ide od vrha do temena osnove.', 'visina',
    { mediji: saVisinom(4, 6, 4) });
  Q(1, 'Koliko bočnih strana ima trostrana piramida?',
    ['3', '2', '4', '6'],
    'Svaka stranica osnove daje jednu bočnu stranu. Trostrana osnova ima tri stranice, pa su tri bočne strane.', 'strana',
    { mediji: piramida(3, 4, 5, [], V()) });
  Q(2, 'Pogledaj crtež četvorostrane piramide. Koja od duži je bočna ivica?',
    ['SC', 'AB', 'BC', 'CD'],
    'Bočna ivica spaja vrh S sa temenom osnove. Duži AB, BC i CD leže u osnovi.', 'ivica',
    { mediji: piramida(4, 6, 4, [], V()) });
  Q(2, 'Istaknuta je duž od sredine osnovne ivice AB do vrha S. Kako se zove?',
    ['apotema', 'visina', 'bočna ivica', 'dijagonala osnove'],
    'Duž od vrha do sredine osnovne ivice je apotema, visina bočne strane. Visina piramide ide do centra osnove.', 'apotema',
    { mediji: piramida(4, 6, 4, [{ d: 'SM', b: 2, debljina: 3 }], V({ T3: sredAB(4, 6) })) });
  Q(2, 'Pravougli trougao SOM je na crtežu. Koja stranica mu je hipotenuza?',
    ['SM', 'SO', 'OM', 'AM'],
    'Ugao kod O je pravi jer je visina normalna na osnovu. Hipotenuza leži naspram pravog ugla, a to je SM, apotema.', 'hipotenuza',
    { mediji: piramida(4, 6, 4, [], V({ T3: sredAB(4, 6) })), medijiOdgovora: saApotemom(4, 6, 4) });
  Q(2, 'Istaknuta je visina SO. Koja tačka je njeno podnožje na osnovi?',
    ['O', 'A', 'M', 'C'],
    'Podnožje visine je tačka u kojoj visina dodiruje osnovu. Kod pravilne piramide to je centar osnove.', 'podnožje',
    { mediji: saVisinom(4, 6, 4) });
  Q(2, 'Koliko bočnih ivica ima šestostrana piramida?',
    ['6', '5', '7', '12'],
    'Od svakog od šest temena osnove ide po jedna bočna ivica do vrha. Ukupno šest, a ne dvanaest.', 'ivica',
    { mediji: sest(4, 6, [], { imena: false }) });
  Q(1, 'Koliko temena ima šestostrana piramida?',
    ['7', '6', '12', '8'],
    'Šest temena osnove i još jedno u vrhu: sedam.', 'teme',
    { mediji: sest(4, 6, [], { imena: false }) });
  Q(2, 'Kako se naziva tačka u kojoj se sastaju sve bočne ivice piramide?',
    ['vrh', 'centar osnove', 'težište osnove', 'podnožje visine'],
    'Sve bočne strane imaju zajedničku tačku, vrh. Iz njega se spušta visina na osnovu.', 'vrh',
    { mediji: piramida(4, 6, 4, [], V({ imena: false })) });
  Q(3, 'Piramida ima 14 ivica. Koliko stranica ima mnogougao osnove?',
    ['7', '6', '8', '14'],
    'Kod n-tostrane piramide ima 2n ivica: n u osnovi i n bočnih. Iz 2n = 14 sledi n = 7.', 'ivica',
    { mediji: piramida(7, 4, 6, [], V({ imena: false })) });
  Q(3, 'Piramida ima 6 temena i 10 ivica. Koliko strana ima? (Ojlerova formula: temena − ivice + strane = 2)',
    ['6', '5', '4', '8'],
    'Iz 6 − 10 + S = 2 sledi S = 6. Petostrana piramida ima jednu petougaonu osnovu i pet bočnih strana.', 'Ojler',
    { mediji: piramida(5, 4, 5, [], V({ imena: false })) });
  Q(3, 'Kosa piramida na crtežu: šta je tačno za nju?',
    ['vrh nije iznad centra osnove', 'sve bočne ivice su jednake', 'osnova je krug', 'vrh leži u sredini osnove'],
    'Kod kose piramide visina pada van centra osnove, a bočne ivice nisu jednake.', 'kosa',
    { mediji: kosa() });
  Q(3, 'Na kosoj piramidi je istaknuta visina. Gde je njeno podnožje?',
    ['u osnovi, ali van njenog centra', 'u vrhu', 'na bočnoj ivici', 'u središtu osnove'],
    'Visina kose piramide je normalna na osnovu, ali njeno podnožje nije u centru osnove.', 'visina',
    { mediji: kosa(true) });
  Q(2, 'Koji trougao je uvek pravougli kod pravilne četvorostrane piramide?',
    ['trougao od visine, polovine osnovne ivice i apoteme', 'trougao od dve bočne ivice', 'trougao od dve ivice osnove', 'trougao od visine i bočne ivice'],
    'Visina H i polovina osnovne ivice su katete, a apotema hipotenuza. Zato važi Pitagorina teorema.', 'trougao',
    { mediji: saApotemom(4, 6, 4), medijiOdgovora: saApotemom(4, 6, 4) });
  U(2, 'Koji od ovih pojmova NIJE element piramide?',
    ['dijagonala kocke', 'vrh', 'bočna ivica', 'apotema'],
    'Dijagonala kocke nije element piramide. Vrh, bočna ivica i apotema jesu.',
    'Reč „apotema“ dolazi od grčkog „spustiti“: to je visina koja se iz vrha spušta niz bočnu stranu.', 'element',
    { mediji: piramida(4, 6, 4, [], V()) });
  S(2, 'Spoji pojam sa opisom:',
    [['osnova', 'mnogougao na koji piramida „stoji“'], ['visina', 'duž od vrha normalna na osnovu'], ['bočna ivica', 'duž od vrha do temena osnove'], ['apotema', 'visina bočne strane']],
    'Kod pravilne piramide apotema i visina nisu isto: visina ide do centra osnove, a apotema do sredine ivice.', 'pojmovi',
    { mediji: piramida(4, 6, 4, [], V()) });

  // ════════════════ 5.2 Mreža piramide ════════════════
  L('Mreža piramide');

  Q(1, 'Pogledaj mrežu. Koliko trouglova ima?',
    ['5', '4', '6', '10'],
    'Pet trouglova: petougao u osnovi je jedini mnogougao koji nije trougao, a svaka strana osnove daje po jedan bočni trougao.', 'trouglovi',
    { mediji: mrezaPiramide(5, 5, 4) });
  Q(1, 'Koliko mnogouglova ima sveukupno ova mreža četvorostrane piramide?',
    ['5', '4', '6', '8'],
    'Jedan kvadrat i četiri trougla: ukupno pet mnogouglova, po jedan za svaku stranu tela.', 'mnogouglova',
    { mediji: mrezaPiramide(4, 6, 5) });
  U(2, 'Koja mreža NE pripada nijednoj piramidi?',
    ['dva kvadrata i četiri pravougaonika', 'jedan kvadrat i četiri trougla', 'četiri trougla', 'jedan petougao i pet trouglova'],
    'Mreža sa dva kvadrata i četiri pravougaonika je mreža prizme: prizma ima dve podudarne osnove. Piramida ima samo jednu osnovu.',
    'Kocka ima čak 11 različitih mreža, a piramida ima mnogo manje, jer se svi bočni trouglovi moraju sastati u jednom vrhu.', 'mreža',
    { mediji: mrezaPrizme(4, 4, 4) });
  Q(2, 'Mreža šestostrane piramide sastoji se od:',
    ['1 šestougla i 6 trouglova', '6 šestouglova', '1 šestougla i 3 trougla', '2 šestougla i 6 trouglova'],
    'Osnova je šestougao, a omotač čine šest bočnih trouglova.', 'šestostrana',
    { mediji: mrezaPiramide(6, 4, 6) });
  Q(2, 'Mreža je nacrtana za piramidu čija je osnova kvadrat stranice 6 cm, a bočni trouglovi visine 5 cm. Kolika je površina cele mreže?',
    ['$96 cm²$', '$60 cm²$', '$36 cm²$', '$120 cm²$'],
    'Osnova je $36 cm²$, omotač $4 · \\frac{6 · 5}{2} = 60 cm²$. Zbir je $96 cm²$.', 'mreža',
    { mediji: mrezaPiramide(4, 6, 5) });
  Q(2, 'Kojom dužinom na mreži pravilne piramide se crta visina bočnog trougla?',
    ['apotemom', 'visinom piramide', 'poluprečnikom osnove', 'dijagonalom osnove'],
    'Visina bočnog trougla je apotema piramide. Visina piramide je unutar tela i ne ide na mrežu.', 'apotema',
    { mediji: mrezaPiramide(4, 6, 5) });
  Q(2, 'Koliko mnogouglova ima mreža šestostrane piramide?',
    ['7', '6', '8', '12'],
    'Jedan šestougao i šest trouglova: sedam mnogouglova.', 'mnogouglova',
    { mediji: mrezaPiramide(6, 4, 5) });
  Q(2, 'Koliko mnogouglova ima mreža tetraedra?',
    ['4', '3', '6', '1'],
    'Tetraedar ima četiri strane, sve trouglove, pa mreža ima četiri trougla.', 'tetraedar',
    { mediji: mrezaPiramide(3, 4, 4) });
  Q(3, 'Na mreži je bočni trougao čija je visina 2 cm, a osnovna ivica 6 cm. Od ove mreže se piramida NE može složiti. Zašto?',
    ['bočne strane ne dolaze do zajedničkog vrha', 'osnova je prevelika za telo', 'trouglovi su jednakostranični', 'nema dovoljno trouglova'],
    'Apotema mora biti dovoljno duga da se bočni trouglovi sastanu u jednoj tački. Kratka apotema ostavlja otvor u vrhu.', 'mreža',
    { mediji: mrezaPiramide(4, 6, 2) });
  Q(3, 'Pravilna šestostrana piramida ima osnovnu ivicu 4 cm i apotemu 6 cm. Koliko centimetara iznosi zbir obima osnove i jedne apoteme?',
    ['30 cm', '28 cm', '24 cm', '34 cm'],
    'Obim osnove je $6 · 4 = 24 cm$. Zbir sa apotemom $6 cm$ daje $30 cm$.', 'obim',
    { mediji: sest(4, 6, [], { imena: false }) });
  Q(3, 'Sa jednim bočnim trouglom na mreži želimo da napravimo piramidu. Kako nazivamo vrstu ivica koje se na mreži spajaju u vrhu?',
    ['bočne ivice', 'ivice osnove', 'visine', 'dijagonale'],
    'Na mreži se u vrhu spajaju bočne ivice, dok ivice osnove ostaju po obodu.', 'ivice',
    { mediji: mrezaPiramide(4, 6, 5) });
  Q(2, 'Pogledaj mrežu. Koja tvrdnja o njoj je tačna?',
    ['osnova je petougao, a bočnih trouglova je pet', 'osnova je kvadrat, a bočnih trouglova je pet', 'ima šest trouglova', 'ima dva petougla'],
    'Osnova je petougao, a uz svaku njegovu stranicu je po jedan bočni trougao: pet trouglova.', 'mreža',
    { mediji: mrezaPiramide(5, 5, 4) });
  Q(3, 'Na mreži su bočni trouglovi jednakokraki. Šta je njihova visina na mreži?',
    ['apotema piramide', 'visina piramide', 'osnovna ivica', 'poluprečnik osnove'],
    'Visina bočnog trougla je apotema piramide, duž od vrha do sredine osnovne ivice.', 'apotema',
    { mediji: mrezaPiramide(4, 6, 5) });
  S(2, 'Spoji telo sa brojem mnogouglova u mreži:',
    [['tetraedar', '4'], ['četvorostrana piramida', '5'], ['petostrana piramida', '6'], ['šestostrana piramida', '7']],
    'Mreža ima onoliko mnogouglova koliko telo ima strana: osnova plus bočne strane.', 'mnogouglovi',
    { mediji: mrezaPiramide(4, 6, 5) });
  Q(1, 'Koliko ivica treba da se spoje pri savijanju mreže piramide u tela?',
    ['bočne ivice se spajaju u vrhu', 'ivice osnove se spajaju u vrhu', 'nijedna', 'sve ivice se lepe jedna za drugu'],
    'Pri savijanju se bočne ivice spajaju u vrhu, a osnovna linija ostaje kao obod osnove.', 'savijanje',
    { mediji: mrezaPiramide(4, 6, 5) });

  // ════════════════ 5.3 Površina piramide ════════════════
  L('Površina piramide');

  Q(1, 'Pogledaj crtež. Koje delove piramide sabiramo da dobijemo ukupnu površinu?',
    ['osnovu i omotač', 'samo omotač', 'osnovu i visinu', 'samo bočne ivice'],
    'Ukupna površina je osnova plus omotač. Visina i ivice nisu površine.', 'površina',
    { mediji: piramida(4, 6, 4, [], V()) });
  Q(1, 'Šta je omotač piramide?',
    ['zbir površina bočnih strana', 'površina osnove', 'zapremina piramide', 'obim osnove'],
    'Omotač je sve što nije osnova: zbir površina bočnih trouglova.', 'omotač',
    { mediji: piramida(4, 6, 4, [], V()) });
  Q(2, 'Pravilna četvorostrana piramida ima osnovnu ivicu $6 cm$ i apotemu $5 cm$. Kolika je površina omotača?',
    ['$60 cm²$', '$120 cm²$', '$30 cm²$', '$150 cm²$'],
    'Četiri podudarna trougla, svaki površine $\\frac{6 · 5}{2} = 15 cm²$. Zbir je $60 cm²$.', 'omotač',
    { mediji: piramida(4, 6, 4, [], V()), medijiOdgovora: saApotemom(4, 6, 4) });
  Q(2, 'Na crtežu je istaknuta apotema bočne strane. Osnovna ivica je $4 cm$, apotema $6 cm$. Kolika je površina jedne bočne strane?',
    ['$12 cm²$', '$24 cm²$', '$6 cm²$', '$4 cm²$'],
    'Bočna strana je trougao: $\\frac{4 · 6}{2} = 12 cm²$.', 'strana',
    { mediji: saApotemom(4, 4, 5) });
  Q(2, 'Površina jedne bočne strane pravilne četvorostrane piramide je $15 cm²$, a osnovna ivica je $6 cm$. Kolika je apotema?',
    ['$5 cm$', '$6 cm$', '$7,5 cm$', '$3 cm$'],
    'Iz $\\frac{6 · h}{2} = 15$ sledi $3h = 15$, pa je $h = 5 cm$.', 'apotema',
    { mediji: saApotemom(4, 6, 4) });
  Q(2, 'Pogledaj crtež: koji deo piramide je zbir površina bočnih trouglova?',
    ['omotač', 'osnova', 'ukupna površina', 'zapremina'],
    'Zbir površina svih bočnih trouglova zove se omotač. Osnova se ne računa u omotač.', 'omotač',
    { mediji: piramida(4, 6, 4, [{ d: 'SA', b: 2, debljina: 3 }, { d: 'SB', b: 2, debljina: 3 }], V()) });
  Q(2, 'Pravilna četvorostrana piramida ima osnovnu ivicu $10 cm$ i apotemu $13 cm$. Koliki je omotač?',
    ['$260 cm²$', '$130 cm²$', '$520 cm²$', '$100 cm²$'],
    'Obim osnove je $40 cm$, pa je $M = \\frac{40 · 13}{2} = 260 cm²$.', 'omotač',
    { mediji: saApotemom(4, 10, 12) });
  Q(2, 'Kako se računa omotač pravilne piramide preko obima osnove $O$ i apoteme $h$?',
    ['$M = \\frac{O · h}{2}$', '$M = O · h$', '$M = \\frac{O · h}{3}$', '$M = O + h$'],
    'Svaki bočni trougao ima površinu $\\frac{a · h}{2}$. Zbir po svim stranama daje $\\frac{O · h}{2}$.', 'omotač',
    { mediji: sest(4, 7, [], { imena: false }) });
  Q(2, 'Piramida ima površinu osnove $25 cm²$ i omotač $100 cm²$. Kolika joj je ukupna površina?',
    ['$125 cm²$', '$75 cm²$', '$250 cm²$', '$50 cm²$'],
    'Zbir osnove i omotača je $25 + 100 = 125 cm²$.', 'površina',
    { mediji: piramida(4, 5, 6, [], V()) });
  Q(3, 'Pravilna četvorostrana piramida ima osnovnu ivicu $6 cm$, a visinu $4 cm$. Kolika joj je apotema?',
    ['$5 cm$', '$4 cm$', '$7 cm$', '$2\\sqrt{3} cm$'],
    'Polovina osnovne ivice je $3 cm$, pa je apotema $h = \\sqrt{3² + 4²} = 5 cm$.', 'apotema',
    { mediji: saVisinom(4, 6, 4), medijiOdgovora: saApotemom(4, 6, 4) });
  Q(3, 'Pravilna četvorostrana piramida ima osnovnu ivicu $8 cm$ i visinu $3 cm$. Kolika je površina cele piramide?',
    ['$144 cm²$', '$80 cm²$', '$64 cm²$', '$120 cm²$'],
    'Apotema je $\\sqrt{4² + 3²} = 5 cm$. Omotač $80 cm²$, osnova $64 cm²$, zbir $144 cm²$.', 'površina',
    { mediji: saVisinom(4, 8, 3), medijiOdgovora: saApotemom(4, 8, 3) });
  Q(3, 'Pravilna trostrana piramida ima osnovnu ivicu $10 cm$ i apotemu $6 cm$. Koliki je omotač?',
    ['$90 cm²$', '$60 cm²$', '$30 cm²$', '$180 cm²$'],
    'Obim osnove je $30 cm$, pa je $M = \\frac{30 · 6}{2} = 90 cm²$.', 'omotač',
    { mediji: saApotemom(3, 10, 6) });
  Q(3, 'Osnovna ivica pravilne četvorostrane piramide je $10 cm$, a apotema $13 cm$. Kolika je ukupna površina?',
    ['$360 cm²$', '$240 cm²$', '$260 cm²$', '$460 cm²$'],
    'Osnova je $100 cm²$, omotač $260 cm²$. Zbir je $360 cm²$.', 'površina',
    { mediji: saApotemom(4, 10, 12) });
  U(2, 'Koja veličina NIJE deo površine piramide?',
    ['visina piramide', 'površina osnove', 'omotač', 'bočna strana'],
    'Visina je duž, a ne površina. Površina piramide je zbir osnove i omotača.',
    'Staklena piramida ispred Luvra ima 603 romba i 70 trouglova od stakla, a osnova joj je na tlu i ne zastakljuje se.', 'površina',
    { mediji: saVisinom(4, 6, 4) });
  S(2, 'Spoji oznaku sa značenjem:',
    [['P', 'ukupna površina piramide'], ['B', 'površina osnove'], ['M', 'površina omotača'], ['h', 'apotema']],
    'Kod piramide P = B + M, gde je M zbir površina bočnih trouglova.', 'oznake',
    { mediji: saApotemom(4, 6, 4) });

  // ════════════════ 5.4 Površina pravilne trostrane i pravilne šestostrane piramide ════════════════
  L('Površina pravilne trostrane i pravilne šestostrane piramide');

  Q(1, 'Pogledaj crtež. Koliko strana ima osnova ove piramide?',
    ['3', '4', '6', '1'],
    'Osnova trostrane piramide je trougao, pa ima tri strane.', 'osnova',
    { mediji: piramida(3, 4, 5, [], V({ imena: false })) });
  Q(1, 'Osnova pravilne šestostrane piramide je:',
    ['pravilan šestougao', 'pravougli trougao', 'kvadrat', 'krug'],
    'Šestostrana piramida ima pravilan šestougao u osnovi, a njega čini šest jednakostraničnih trouglova.', 'šestostrana',
    { mediji: sest(4, 6, [], { imena: false }) });
  Q(1, 'Koliko jednakostraničnih trouglova čini osnovu pravilne šestostrane piramide?',
    ['6', '3', '12', '5'],
    'Pravilan šestougao se deli iz centra na šest jednakih jednakostraničnih trouglova.', 'šestougao',
    { mediji: sest(4, 6, [], { imena: false }) });
  Q(2, 'Pravilna šestostrana piramida ima osnovnu ivicu $3 cm$ i apotemu $4 cm$. Koliki je obim osnove?',
    ['$18 cm$', '$12 cm$', '$24 cm$', '$9 cm$'],
    'Šest stranica po $3 cm$: obim je $6 · 3 = 18 cm$.', 'obim',
    { mediji: sest(3, 4, [], { imena: false }) });
  Q(2, 'Pravilna trostrana piramida ima osnovnu ivicu $8 cm$ i apotemu $3 cm$. Koliki je omotač?',
    ['$36 cm²$', '$24 cm²$', '$12 cm²$', '$48 cm²$'],
    'Obim osnove je $24 cm$, pa je $M = \\frac{24 · 3}{2} = 36 cm²$.', 'omotač',
    { mediji: saApotemom(3, 8, 3) });
  Q(2, 'Koliko podudarnih jednakokrakih trouglova čini omotač pravilne šestostrane piramide?',
    ['6', '3', '12', '5'],
    'Svaka od šest stranica osnove daje po jedan bočni trougao, pa su svi podudarni.', 'šestostrana',
    { mediji: sest(4, 6, [], { imena: false }) });
  Q(2, 'Površina jednakostraničnog trougla stranice $4 cm$ je:',
    ['$4\\sqrt{3} cm²$', '$8\\sqrt{3} cm²$', '$16 cm²$', '$2\\sqrt{3} cm²$'],
    'Po formuli $\\frac{a^{2}\\sqrt{3}}{4} = \\frac{16\\sqrt{3}}{4} = 4\\sqrt{3} cm²$.', 'trougao',
    { mediji: piramida(3, 4, 5, [], V()) });
  Q(2, 'Pravilna šestostrana piramida ima osnovnu ivicu $3 cm$ i apotemu $8 cm$. Koliki je obim osnove i koliki omotač?',
    ['$18 cm$ i $72 cm²$', '$9 cm$ i $36 cm²$', '$18 cm$ i $36 cm²$', '$24 cm$ i $96 cm²$'],
    'Obim je $6 · 3 = 18 cm$, a omotač $\\frac{18 · 8}{2} = 72 cm²$.', 'obim',
    { mediji: sest(3, 6, [], { imena: false }) });
  Q(3, 'Kod pravilne šestostrane piramide sa osnovnom ivicom $a$ površina osnove je:',
    ['$\\frac{6a^{2}\\sqrt{3}}{4}$', '$\\frac{a^{2}\\sqrt{3}}{4}$', '$6a^{2}$', '$\\frac{6a\\sqrt{3}}{4}$'],
    'Osnova je sastavljena od šest jednakostraničnih trouglova stranice $a$.', 'šestougao',
    { mediji: sest(4, 6, [], { imena: false }) });
  Q(3, 'Pravilna trostrana piramida ima osnovnu ivicu $6 cm$ i apotemu $8 cm$. Koliki joj je omotač?',
    ['$72 cm²$', '$36 cm²$', '$144 cm²$', '$48 cm²$'],
    'Obim osnove je $18 cm$, pa je $M = \\frac{18 · 8}{2} = 72 cm²$.', 'omotač',
    { mediji: saApotemom(3, 6, 4) });
  Q(3, 'Pravilna šestostrana piramida ima omotač $84 cm²$ i apotemu $7 cm$. Kolika joj je osnovna ivica?',
    ['$4 cm$', '$3 cm$', '$6 cm$', '$8 cm$'],
    'Obim je $O = \\frac{2M}{h} = \\frac{168}{7} = 24 cm$, pa je osnovna ivica $24 : 6 = 4 cm$.', 'šestostrana',
    { mediji: sest(4, 7, [], { imena: false }) });
  Q(3, 'Površina osnove pravilne šestostrane piramide ivice $3 cm$ je:',
    ['$\\frac{27\\sqrt{3}}{2} cm²$', '$18\\sqrt{3} cm²$', '$9\\sqrt{3} cm²$', '$54\\sqrt{3} cm²$'],
    'Jedan trougao: $\\frac{9\\sqrt{3}}{4}$, a šest trouglova: $6 · \\frac{9\\sqrt{3}}{4} = \\frac{27\\sqrt{3}}{2} cm²$.', 'šestougao',
    { mediji: sest(3, 6, [], { imena: false }) });
  U(3, 'Koja tvrdnja o pravilnoj trostranoj piramidi NIJE tačna?',
    ['osnova je kvadrat', 'bočne strane su trouglovi', 'osnova je jednakostranični trougao', 'sve bočne ivice su jednake'],
    'Osnova trostrane piramide je trougao, ne kvadrat. Ostale tri tvrdnje su tačne za pravilnu trostranu piramidu.',
    'Pravilni tetraedar je piramida kojoj je svaka strana jednakostraničan trougao, pa se bilo koja strana može uzeti za osnovu.', 'trostrana',
    { mediji: piramida(3, 4, 5, [], V()) });
  Q(1, 'Pogledaj crtež: koliko temena ima osnova ove šestostrane piramide?',
    ['6', '5', '7', '12'],
    'Osnova je šestougao, pa ima šest temena. Vrh je sedmo teme piramide.', 'šestougao',
    { mediji: sest(4, 6, [], { imena: false }) });
  S(3, 'Spoji telo sa oblikom osnove:',
    [['pravilna trostrana piramida', 'jednakostranični trougao'], ['pravilna šestostrana piramida', 'pravilan šestougao'], ['pravilna četvorostrana piramida', 'kvadrat']],
    'Osnova se po obliku poklapa sa brojem strana: 3 stranice – jednakostranični trougao, 6 stranica – pravilan šestougao.', 'osnova',
    { mediji: piramida(3, 4, 5, [], V()) });

  // ════════════════ 5.5 Zapremina piramide; zapremina četvorostrane piramide ════════════════
  L('Zapremina piramide; zapremina četvorostrane piramide');

  Q(1, 'Pogledaj crtež piramide i prizme iste osnove i visine. Koliki je odnos zapremine piramide i prizme?',
    ['1 : 3', '1 : 2', '1 : 4', '3 : 1'],
    'Piramida ima trećinu zapremine prizme iste osnove i visine: odnos je $1 : 3$.', 'odnos',
    { mediji: prizma(4, 6, 6, [], V({ pravilna: true })), medijiOdgovora: piramida(4, 6, 6, [], V()) });
  Q(2, 'Piramida ima osnovu površine $12 cm²$ i visinu $9 cm$. Kolika joj je zapremina?',
    ['$36 cm³$', '$108 cm³$', '$12 cm³$', '$21 cm³$'],
    '$V = \\frac{12 · 9}{3} = 36 cm³$.', 'zapremina',
    { mediji: piramida(4, 4, 9, [], V()) });
  Q(2, 'Zapremina piramide je trećina zapremine prizme koja ima:',
    ['istu osnovu i istu visinu', 'istu osnovu, a dvostruku visinu', 'istu visinu, a dvostruku osnovu', 'istu bočnu ivicu'],
    'Ako su osnova i visina iste, prizma ima tri puta veću zapreminu.', 'prizma',
    { mediji: prizma(4, 6, 6, [], V({ pravilna: true })) });
  Q(2, 'Pravilna četvorostrana piramida ima osnovnu ivicu $4 cm$ i visinu $6 cm$. Kolika joj je zapremina?',
    ['$32 cm³$', '$96 cm³$', '$24 cm³$', '$16 cm³$'],
    '$B = 4² = 16 cm²$, pa je $V = \\frac{16 · 6}{3} = 32 cm³$.', 'zapremina',
    { mediji: saVisinom(4, 4, 6) });
  Q(2, 'Piramida ima osnovu površine $15 cm²$ i visinu $4 cm$. Kolika joj je zapremina?',
    ['$20 cm³$', '$60 cm³$', '$15 cm³$', '$30 cm³$'],
    '$V = \\frac{15 · 4}{3} = 20 cm³$.', 'zapremina',
    { mediji: piramida(4, 5, 4, [], V()) });
  Q(2, 'Pravilna četvorostrana piramida ima osnovnu ivicu $10 cm$ i visinu $3 cm$. Kolika joj je zapremina?',
    ['$100 cm³$', '$300 cm³$', '$30 cm³$', '$50 cm³$'],
    '$B = 100 cm²$, pa je $V = \\frac{100 · 3}{3} = 100 cm³$.', 'zapremina',
    { mediji: saVisinom(4, 10, 3) });
  Q(1, 'Ako se visina piramide udvostruči, a osnova ostane ista, zapremina se:',
    ['udvostruči', 'učetvorostruči', 'ostane ista', 'prepolovi'],
    'Zapremina je proporcionalna visini, pa se pri dvostrukoj visini udvostruči.', 'visina',
    { mediji: saVisinom(4, 6, 4), medijiOdgovora: saVisinom(4, 6, 8) });
  Q(2, 'Dve piramide imaju istu osnovu. Visina druge je tri puta veća od visine prve. Koliko puta je zapremina druge veća?',
    ['3 puta', '9 puta', '2 puta', '6 puta'],
    'Zapremina je proporcionalna visini: $V = \\frac{B · H}{3}$, pa je tri puta veća visina daje tri puta veću zapreminu.', 'odnos',
    { mediji: saVisinom(4, 6, 4), medijiOdgovora: saVisinom(4, 6, 12) });
  Q(3, 'Piramida ima zapreminu $40 cm³$ i visinu $6 cm$. Kolika joj je površina osnove?',
    ['$20 cm²$', '$10 cm²$', '$40 cm²$', '$240 cm²$'],
    'Iz $40 = \\frac{B · 6}{3}$ sledi $2B = 40$, pa je $B = 20 cm²$.', 'osnova',
    { mediji: piramida(4, 5, 6, [], V()) });
  Q(3, 'Pravilna četvorostrana piramida ima osnovnu ivicu $5 cm$ i visinu $6 cm$. Kolika joj je zapremina?',
    ['$50 cm³$', '$150 cm³$', '$30 cm³$', '$25 cm³$'],
    '$B = 25 cm²$, pa je $V = \\frac{25 · 6}{3} = 50 cm³$.', 'zapremina',
    { mediji: saVisinom(4, 5, 6) });
  Q(3, 'Piramida ispred Luvra je pravilna četvorostrana sa osnovom približno $35 m$ i visinom približno $21,6 m$. Koliko je približno njena zapremina?',
    ['oko $8\\,800 m³$', 'oko $26\\,000 m³$', 'oko $2\\,600 m³$', 'oko $88\\,000 m³$'],
    '$B = 35² = 1225 m²$, pa je $V = \\frac{1225 · 21,6}{3} ≈ 8\\,820 m³$.', 'Luvr',
    { mediji: saVisinom(4, 35, 21.6), medijiOdgovora: saVisinom(4, 35, 21.6) });
  Q(3, 'Keopsova piramida ima približno 300 puta veću zapreminu od piramide ispred Luvra. Koliko je to približno puta po odnosu zapremina?',
    ['oko 300 puta', 'oko 30 puta', 'oko 3 puta', 'oko 3000 puta'],
    'Keops: osnova 230 m, visina 146 m, zapremina oko 2,57 miliona m³. Luvr: oko 8 820 m³. Odnos je oko 290 puta.', 'Keops',
    { mediji: piramida(4, 230, 146, [], V({ velicina: 260 })), medijiOdgovora: saVisinom(4, 230, 146) });
  Q(3, 'Piramida ima osnovu površine $18 cm²$ i visinu $5 cm$. Kolika joj je zapremina?',
    ['$30 cm³$', '$90 cm³$', '$18 cm³$', '$45 cm³$'],
    '$V = \\frac{18 · 5}{3} = 30 cm³$.', 'zapremina',
    { mediji: piramida(4, 6, 12, [], V()) });
  Q(3, 'Pravilna četvorostrana piramida ima bočnu ivicu $13 cm$ i osnovnu ivicu $10 cm$. Kolika joj je visina?',
    ['$\\sqrt{119} cm$', '$12 cm$', '$5 cm$', '$8 cm$'],
    'Polovina dijagonale osnove je $5\\sqrt{2} cm$. Iz pravouglog trougla: $H^{2} = 13² − (5\\sqrt{2})² = 169 − 50 = 119$.', 'visina',
    { mediji: saVisinom(4, 10, 10) });
  Q(1, 'Piramida ima osnovu površine $20 cm²$ i visinu $3 cm$. Kolika joj je zapremina?',
    ['$20 cm³$', '$60 cm³$', '$10 cm³$', '$40 cm³$'],
    '$V = \\frac{20 · 3}{3} = 20 cm³$.', 'zapremina',
    { mediji: piramida(4, 4.5, 3, [], V()) });
  Q(3, 'Pravilna četvorostrana piramida ima osnovnu ivicu $6 cm$ i zapreminu $96 cm³$. Kolika joj je visina?',
    ['$8 cm$', '$4 cm$', '$12 cm$', '$6 cm$'],
    'Osnova je $36 cm²$, pa iz $96 = \\frac{36 · H}{3}$ sledi $12H = 96$ i $H = 8 cm$.', 'visina',
    { mediji: saVisinom(4, 6, 8) });
  S(2, 'Spoji telo sa formulom zapremine:',
    [['prizma', '$V = B · H$'], ['piramida', '$V = \\frac{B · H}{3}$'], ['kocka', '$V = a^{3}$'], ['tetraedar', '$V = \\frac{a^{3}\\sqrt{2}}{12}$']],
    'Piramida ima trećinu zapremine prizme iste osnove i visine, a tetraedar je specijalan slučaj trostrane piramide.', 'formule',
    { mediji: piramida(4, 6, 6, [], V()) });

  // ════════════════ 5.6 Zapremina pravilne trostrane i pravilne šestostrane piramide ════════════════
  L('Zapremina pravilne trostrane i pravilne šestostrane piramide');

  Q(2, 'Pravilna trostrana piramida ima osnovu površine $9\\sqrt{3} cm²$ i visinu $5 cm$. Kolika je zapremina?',
    ['$15\\sqrt{3} cm³$', '$45\\sqrt{3} cm³$', '$15 cm³$', '$9\\sqrt{3} cm³$'],
    '$V = \\frac{9\\sqrt{3} · 5}{3} = 15\\sqrt{3} cm³$.', 'zapremina',
    { mediji: piramida(3, 6, 5, [], V()), medijiOdgovora: saVisinom(3, 6, 5) });
  Q(2, 'Pravilna šestostrana piramida ima osnovu površine $6\\sqrt{3} cm²$ i visinu $6 cm$. Kolika je zapremina?',
    ['$12\\sqrt{3} cm³$', '$36\\sqrt{3} cm³$', '$12 cm³$', '$6\\sqrt{3} cm³$'],
    '$V = \\frac{6\\sqrt{3} · 6}{3} = 12\\sqrt{3} cm³$.', 'zapremina',
    { mediji: sest(2, 6, [], { imena: false }) });
  Q(2, 'Zapremina pravilne trostrane piramide sa osnovnom ivicom $a$ i visinom $H$ je:',
    ['$V = \\frac{a^{2}\\sqrt{3} · H}{12}$', '$V = \\frac{a^{2} · H}{3}$', '$V = \\frac{a^{2}\\sqrt{3} · H}{3}$', '$V = \\frac{a\\sqrt{3} · H}{4}$'],
    'Osnova je $\\frac{a^{2}\\sqrt{3}}{4}$, pa je $V = \\frac{1}{3} · \\frac{a^{2}\\sqrt{3}}{4} · H = \\frac{a^{2}\\sqrt{3} · H}{12}$.', 'trostrana',
    { mediji: piramida(3, 6, 9, [], V()) });
  Q(3, 'Pravilna šestostrana piramida ima osnovnu ivicu $a$ i visinu $H$. Njena zapremina je:',
    ['$V = \\frac{a^{2}\\sqrt{3} · H}{2}$', '$V = \\frac{a^{2}\\sqrt{3} · H}{12}$', '$V = \\frac{a^{2} · H}{2}$', '$V = \\frac{a^{2}\\sqrt{3} · H}{4}$'],
    'Osnova je $\\frac{6a^{2}\\sqrt{3}}{4}$, pa je $V = \\frac{1}{3} · \\frac{6a^{2}\\sqrt{3}}{4} · H = \\frac{a^{2}\\sqrt{3} · H}{2}$.', 'šestostrana',
    { mediji: sest(4, 6, [], { imena: false }) });
  Q(3, 'Pravilna trostrana piramida ima osnovnu ivicu $6 cm$ i visinu $6 cm$. Kolika joj je zapremina?',
    ['$18\\sqrt{3} cm³$', '$54\\sqrt{3} cm³$', '$18 cm³$', '$27\\sqrt{3} cm³$'],
    '$V = \\frac{9\\sqrt{3} · 6}{3} = 18\\sqrt{3} cm³$.', 'zapremina',
    { mediji: piramida(3, 6, 6, [], V()) });
  Q(3, 'Pravilna šestostrana piramida ima osnovnu ivicu $2 cm$ i visinu $5 cm$. Kolika joj je zapremina?',
    ['$10\\sqrt{3} cm³$', '$5\\sqrt{3} cm³$', '$20\\sqrt{3} cm³$', '$10 cm³$'],
    '$V = \\frac{a^{2}\\sqrt{3} · H}{2} = \\frac{4\\sqrt{3} · 5}{2} = 10\\sqrt{3} cm³$.', 'šestostrana',
    { mediji: sest(2, 5, [], { imena: false }) });
  Q(3, 'Tetraedar sa ivicom $6 cm$ ima zapreminu $V = \\frac{a^{3}\\sqrt{2}}{12}$. Koliko iznosi?',
    ['$18\\sqrt{2} cm³$', '$36\\sqrt{2} cm³$', '$216 cm³$', '$9\\sqrt{2} cm³$'],
    '$V = \\frac{216\\sqrt{2}}{12} = 18\\sqrt{2} cm³$.', 'tetraedar',
    { mediji: telo('piramida3', { opis: 'Ivica a = 6 cm' }) });
  Q(3, 'Piramida ima zapreminu $24 cm³$ i površinu osnove $8 cm²$. Kolika joj je visina?',
    ['$9 cm$', '$3 cm$', '$6 cm$', '$12 cm$'],
    'Iz $24 = \\frac{8 · H}{3}$ sledi $8H = 72$, pa je $H = 9 cm$.', 'visina',
    { mediji: piramida(4, 4, 9, [], V()) });
  Q(3, 'Pravilna trostrana piramida ima osnovnu ivicu $4 cm$ i visinu $6 cm$. Kolika joj je zapremina?',
    ['$8\\sqrt{3} cm³$', '$4\\sqrt{3} cm³$', '$24\\sqrt{3} cm³$', '$8 cm³$'],
    '$B = \\frac{4^{2}\\sqrt{3}}{4} = 4\\sqrt{3}$, pa je $V = \\frac{4\\sqrt{3} · 6}{3} = 8\\sqrt{3} cm³$.', 'trostrana',
    { mediji: piramida(3, 4, 6, [], V()) });
  Q(3, 'Pravilna trostrana piramida ima osnovnu ivicu $6 cm$ i zapreminu $27\\sqrt{3} cm³$. Kolika joj je visina?',
    ['$9 cm$', '$3 cm$', '$27 cm$', '$6 cm$'],
    'Osnova je $9\\sqrt{3}$, pa je $27\\sqrt{3} = \\frac{9\\sqrt{3} · H}{3}$, odnosno $H = 9 cm$.', 'visina',
    { mediji: saVisinom(3, 6, 9) });
  Q(3, 'Koliko puta je zapremina pravilne šestostrane piramide veća od zapremine pravilne trostrane piramide iste osnovne ivice $a$ i iste visine $H$?',
    ['6 puta', '2 puta', '3 puta', '4 puta'],
    'Odnos je $\\frac{a^{2}\\sqrt{3} · H / 2}{a^{2}\\sqrt{3} · H / 12} = 6$.', 'odnos',
    { mediji: sest(4, 6, [], { imena: false }) });
  U(3, 'Koja formula NIJE tačna za zapreminu pravilne piramide?',
    ['$V = \\frac{a^{2}\\sqrt{3} · H}{4}$', '$V = \\frac{a^{2}\\sqrt{3} · H}{12}$', '$V = \\frac{a^{2}\\sqrt{3} · H}{2}$', '$V = \\frac{B · H}{3}$'],
    'Za trostranu piramidu je $\\frac{a^{2}\\sqrt{3} · H}{12}$, za šestostranu $\\frac{a^{2}\\sqrt{3} · H}{2}$, a opšta formula je $\\frac{B · H}{3}$.',
    'Piramida i prizma iste osnove i visine: piramida ima tačno trećinu zapremine. To je prvi dokazao Eudoks, a Arhimed je to pripisao njemu.', 'zapremina',
    { mediji: piramida(3, 4, 6, [], V()) });
  Q(1, 'Zapremina piramide je koliki deo zapremine prizme sa istom osnovom i visinom?',
    ['trećina', 'polovina', 'dvostruko', 'četvrtina'],
    'Piramida sa istom osnovom i visinom ima tačno trećinu zapremine prizme.', 'trećina',
    { mediji: prizma(3, 6, 6, [], V({ pravilna: true })) });
  Q(1, 'Pogledaj tetraedar. Koliko ima temena?',
    ['4', '3', '6', '5'],
    'Tetraedar ima četiri temena: tri u osnovi i jedno u vrhu.', 'tetraedar',
    { mediji: telo('piramida3', { opis: 'Četiri temena' }) });
  Q(2, 'Pravilna šestostrana piramida ima osnovnu ivicu $2 cm$ i visinu $3 cm$. Kolika je površina osnove?',
    ['$6\\sqrt{3} cm²$', '$3\\sqrt{3} cm²$', '$12\\sqrt{3} cm²$', '$2\\sqrt{3} cm²$'],
    'Osnova je šest jednakostraničnih trouglova stranice $2 cm$: $6 · \\frac{4\\sqrt{3}}{4} = 6\\sqrt{3} cm²$.', 'šestougao',
    { mediji: sest(2, 3, [], { imena: false }) });
  S(3, 'Spoji telo sa formulom:',
    [['trostrana piramida', '$V = \\frac{a^{2}\\sqrt{3} · H}{12}$'], ['šestostrana piramida', '$V = \\frac{a^{2}\\sqrt{3} · H}{2}$'], ['tetraedar ivice a', '$V = \\frac{a^{3}\\sqrt{2}}{12}$']],
    'Tetraedar je pravilna trostrana piramida čija je visina $a\\sqrt{\\frac{2}{3}}$, pa iz formule dobijamo $\\frac{a^{3}\\sqrt{2}}{12}$.', 'zapremina',
    { mediji: piramida(3, 6, 4.9, [], V()) });
};
