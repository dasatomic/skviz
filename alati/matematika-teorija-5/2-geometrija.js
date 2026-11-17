// Lekcije 9–16: osnovni pojmovi geometrije (teorija i pojmovi).
module.exports = ({ L, Q, U, S, G, r, naKrugu, pravilni, krug, luk, O, bez, papir }) => {

  // prava nacrtana sa strelicama na oba kraja (beskonačna u oba smera)
  const prava = (a, b, { ime = 'p', b1 = 1 } = {}) =>
    G({ A: a, B: b }, [{ d: 'AB', b: b1, str: 1, debljina: 3 }, { d: 'BA', b: b1, str: 1, debljina: 3 }, { tx: ime, at: [b[0], b[1] + 0.65], vel: 16 }], { bezImena: ['A', 'B'], velicina: 300 });
  // pravilni mnogougao (opciono opisana kružnica ili istaknuta dijagonala)
  const mnogougao = (n, x = {}) => {
    const R = x.R ?? 3;
    const t = { O: [0, 0], ...pravilni(n, R) };
    const e = [{ p: 'ABCDEFGHIJ'.slice(0, n), b: x.b ?? 0 }];
    if (x.krugOpisan) e.push({ kr: 'O', r: R, b: 4, prazno: 1 });
    if (x.dijagonala) e.push({ d: 'AC', b: 1, isp: 1, debljina: 3 });
    return G(t, e, { ...bez, velicina: 240 });
  };
  // kružnica sa centrom O i tačkom A na njoj
  const kruznica = (R = 3, dod = []) =>
    G({ O: [0, 0], A: [R, 0] }, [{ kr: 'O', r: R, b: 1 }, { d: 'OA', b: 1, debljina: 3, o: 'r' }, ...dod], { ...bez, velicina: 240 });

  // ── 9. tačke i prave ──
  L('Tačke i prave; pripadanje i raspored');
  Q(1, 'Koji geometrijski objekat nema ni dužinu, ni širinu, ni debljinu?',
    ['Tačka', 'Duž', 'Prava', 'Ravan'],
    'Tačka je najmanji geometrijski objekat – označavamo je velikim slovom, na primer $A$. Ona samo pokazuje položaj.', 'tačka',
    { medijiOdgovora: G({ A: [0, 0] }, [{ tacka: 'A', b: 1 }], { velicina: 160 }) });
  Q(1, 'Šta se proteže beskonačno u oba smera?',
    ['Prava', 'Duž', 'Poluprava', 'Tačka'],
    'Prava nema ni početak ni kraj. Označavamo je malim slovom ($p$, $q$…) ili preko dve tačke: prava $AB$.', 'prava',
    { medijiOdgovora: prava([-4.2, 0], [4.2, 0]) });
  Q(1, 'Kako se zove deo prave koji ima početnu tačku i proteže se beskonačno u jednom smeru?',
    ['Poluprava', 'Duž', 'Prava', 'Krug'],
    'Poluprava ima jedan kraj (početnu tačku), a u drugom smeru ide beskonačno. Kao zrak svetlosti iz lampe.', 'poluprava',
    { medijiOdgovora: G({ A: [0, 0], B: [4.5, 0] }, [{ d: 'AB', b: 1, str: 1, debljina: 3 }, { tacka: 'A', b: 1 }], { velicina: 260 }) });
  Q(1, 'Kako se zove deo prave između dve tačke (ima i početak i kraj)?',
    ['Duž', 'Prava', 'Poluprava', 'Tačka'],
    'Duž je najkraći put između dve tačke. Njene krajnje tačke su početak i kraj duži, a označavamo je $AB$.', 'duž',
    { medijiOdgovora: G({ A: [0, 0], B: [4, 0] }, [{ d: 'AB', b: 1, debljina: 3 }, { tacka: 'A', b: 1 }, { tacka: 'B', b: 1 }], { velicina: 260 }) });
  Q(2, 'Koliko pravih prolazi kroz dve različite tačke?',
    ['Tačno jedna', 'Dve', 'Beskonačno mnogo', 'Nijedna'],
    'Kroz jednu tačku prolazi beskonačno mnogo pravih, ali kroz DVE različite tačke prolazi tačno jedna prava – one je potpuno određuju.', 'prava',
    { mediji: G({ A: [0, 0], B: [4, 0] }, [{ d: 'AB', b: 1, debljina: 3 }, { tacka: 'A', b: 1 }, { tacka: 'B', b: 1 }], { velicina: 260 }) });
  Q(2, 'Ako tačka C leži između tačaka A i B, šta sigurno važi?',
    ['Sve tri leže na istoj pravoj', 'Sve tri su temena trougla', 'Tačka C je van duži AB', 'Tačke A i C se poklapaju'],
    'Kad tačka leži „između“, sve tri tačke su na istoj pravoj – takve tačke zovemo kolinearne. Kažemo i da je C unutrašnja tačka duži AB.', 'kolinearan',
    { mediji: G({ A: [0, 0], C: [1.6, 0], B: [3.6, 0] }, [{ d: 'AB', b: 4, debljina: 2 }, { tacka: 'A', b: 1 }, { tacka: 'C', b: 2 }, { tacka: 'B', b: 1 }], { velicina: 260 }) });
  Q(2, 'Koliko tačaka sadrži jedna duž?',
    ['Beskonačno mnogo', 'Samo dve', 'Tačno tri', 'Nijednu'],
    'Duž ima dva kraja, ali između njih leži beskonačno mnogo tačaka. Zato se i najkraća duž sastoji od beskonačno mnogo tačaka.', 'duž',
    { medijiOdgovora: G({ A: [0, 0], B: [5, 0] }, [{ d: 'AB', b: 1, debljina: 3 }, ...[1, 2, 3, 4].map((x) => ({ tx: '●', at: [x, 0], vel: 12, b: 2 }))], { velicina: 260 }) });
  Q(3, 'Tri tačke A, B i C NE leže na istoj pravoj. Koliko duži one određuju?',
    ['3', '1', '2', '6'],
    'Svake dve tačke određuju jednu duž: $AB$, $BC$ i $CA$ – ukupno 3 duži. One čine trougao.', 'duž',
    { medijiOdgovora: G({ A: [0, 0], B: [3.5, 0], C: [1, 2.2] }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'BC', b: 2, debljina: 3 }, { d: 'CA', b: 3, debljina: 3 }, { tacka: 'A', b: 1 }, { tacka: 'B', b: 1 }, { tacka: 'C', b: 1 }], { velicina: 260 }) });

  // ── 10. odnosi pravih ──
  L('Odnosi pravih u ravni');
  Q(1, 'Kako se zovu prave u ravni koje nemaju nijednu zajedničku tačku?',
    ['Paralelne prave', 'Normalne prave', 'Ukrštene prave', 'Krive prave'],
    'Paralelne prave se nikada ne seku, koliko god ih produžavali. Primer su šine na pruzi. Označavamo ih $a \\parallel b$.', 'paralelne',
    { medijiOdgovora: G({ A: [-3, 1.2], B: [3, 1.2], C: [-3, -1.2], D: [3, -1.2] }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }, { tx: 'a', at: [-2.6, 1.7], vel: 15, b: 1 }, { tx: 'b', at: [-2.6, -1.4], vel: 15, b: 2 }], { velicina: 280 }) });
  Q(1, 'Kako se zovu prave koje se seku pod pravim uglom (90°)?',
    ['Normalne (upravne) prave', 'Paralelne prave', 'Mimoilazne prave', 'Podudarne prave'],
    'Normalne prave seku se pod uglom od $90°$. Označavamo ih $a \\perp b$. Ivice kvadrata su uzajamno normalne.', 'normalne',
    { medijiOdgovora: G({ A: [-3, 0], B: [3, 0], C: [0, -3], D: [0, 3] }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }, { pu: 'AOD' }, { tx: 'a', at: [3.2, 0.4], vel: 15, b: 1 }, { tx: 'b', at: [0.4, 3.2], vel: 15, b: 2 }], { ...bez, velicina: 280 }) });
  Q(2, 'Koliko zajedničkih tačaka najviše mogu imati dve različite prave u ravni?',
    ['Jednu', 'Dve', 'Tri', 'Beskonačno mnogo'],
    'Dve različite prave se ili seku u jednoj tački ili su paralelne (nula zajedničkih tačaka). Više od jedne zajedničke tačke imale bi samo kad bi se poklapale.', 'presek',
    { medijiOdgovora: G({ A: [-3, -2], B: [3, 2], C: [-3, 2], D: [3, -2] }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }], { velicina: 260 }) });
  Q(2, 'Dve prave se seku u tački O. Kako se ta tačka zove?',
    ['Presečna tačka', 'Dodirna tačka', 'Početna tačka', 'Središte'],
    'Tačka u kojoj se dve prave seku zove se presečna tačka. To je jedina zajednička tačka tih pravih.', 'presek',
    { mediji: G({ A: [-3, -2], B: [3, 2], C: [-3, 2], D: [3, -2], O: [0, 0] }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }, { tacka: 'O', b: 1 }, { tx: 'O', at: [0, -0.5], vel: 15 }], { bezImena: ['O'], velicina: 260 }) });
  Q(3, 'Koji od ovih znakova se koristi za paralelnost dveju pravih?',
    ['$\\parallel$', '$\\perp$', '$=$', '$\\angle$'],
    'Znak $\\parallel$ čitamo „paralelno sa“: $a\\parallel b$. Znak $\\perp$ znači „normalno na“.', 'paralelne',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$a \\parallel b$' } });
  Q(2, 'Prava $m$ je normalna na pravu $n$. Koliki ugao one zaklapaju?',
    ['90°', '180°', '45°', '0°'],
    'Normalne prave uvek zaklapaju prav ugao od $90°$. To je četvrtina punog kruga.', 'normalne',
    { medijiOdgovora: G({ A: [-3, 0], B: [3, 0], C: [0, -3], D: [0, 3] }, [{ d: 'AB', b: 1, debljina: 3 }, { d: 'CD', b: 2, debljina: 3 }, { pu: 'AOD' }, { tx: '90°', at: [1, 0.7], vel: 16 }], { ...bez, velicina: 260 }) });

  // ── 11. merenje dužine ──
  L('Merenje dužine i jednakost duži');
  Q(1, 'Koja je osnovna jedinica za merenje dužine?',
    ['Metar', 'Kilogram', 'Litar', 'Sat'],
    'Osnovna jedinica za dužinu je metar (m). Manje jedinice su decimetar, centimetar i milimetar, a veća je kilometar.', 'metar');
  Q(1, 'Koliko milimetara ima jedan centimetar?',
    ['10', '100', '1000', '2'],
    'Jedan centimetar (cm) ima 10 milimetara (mm). Zato lenjir od 10 cm ima 100 mm.', 'milimetar',
    { medijiOdgovora: G({ O: [0, 0] }, [{ osa: [0, 1], podela: 0.1, svaki: 10 }, { tx: '1 cm', at: [0.5, 0.7], vel: 15 }], { ...bez, velicina: 300 }) });
  Q(1, 'Koliko centimetara ima jedan metar?',
    ['100', '10', '1000', '60'],
    'Jedan metar ima 100 centimetara. Prefiks „centi“ znači stoti deo, pa je centimetar stoti deo metra.', 'metar',
    { medijiOdgovora: G({ O: [0, 0] }, [{ osa: [0, 100], podela: 10, svaki: 1 }, { tx: '1 m', at: [50, 0.9], vel: 15 }], { ...bez, velicina: 320 }) });
  Q(1, 'Koliko metara ima jedan kilometar?',
    ['1000', '100', '10', '10000'],
    'Jedan kilometar (km) ima 1000 metara. Prefiks „kilo“ znači hiljadu.', 'kilometar');
  Q(2, 'Kada su dve duži jednake?',
    ['Kada imaju istu dužinu', 'Kada su paralelne', 'Kada imaju isti pravac', 'Kada se seku'],
    'Duži su jednake ako imaju istu dužinu, bez obzira gde se nalaze i kako su okrenute. Jednakost označavamo sa $AB = CD$.', 'jednakost',
    { medijiOdgovora: G({ A: [0, 0], B: [3, 0], C: [0, -2], D: [3, -2] }, [{ d: 'AB', b: 1, debljina: 3, o: '3 cm' }, { d: 'CD', b: 2, debljina: 3, o: '3 cm' }], { velicina: 260 }) });
  Q(2, 'Duž AB je duga 3 cm, a duž CD je duga 30 mm. Šta važi?',
    ['Duži su jednake', 'AB je duža', 'CD je duža', 'Ne može se uporediti'],
    '$30$ mm je isto što i $3$ cm, jer je $1$ cm $= 10$ mm. Zato su duži jednake – samo su izražene različitim jedinicama.', 'jednakost',
    { mediji: G({ A: [0, 0], B: [3, 0], C: [0, -2], D: [3, -2] }, [{ d: 'AB', b: 1, debljina: 3, o: '3 cm' }, { d: 'CD', b: 2, debljina: 3, o: '30 mm' }], { velicina: 260 }) });
  Q(3, 'Koji niz jedinica je poređan od najmanje ka najvećoj?',
    ['mm, cm, dm, m, km', 'km, m, dm, cm, mm', 'cm, mm, m, km, dm', 'dm, cm, mm, km, m'],
    'Od najmanje ka najvećoj: milimetar, centimetar, decimetar, metar, kilometar. Svaka sledeća je 10 puta veća od prethodne (osim km koji je 1000 m).', 'jedinica');

  S(1, 'Spoji jedinicu sa njenom vrednošću.',
    [['1 m', '100 cm'], ['1 km', '1000 m'], ['1 dm', '10 cm'], ['1 cm', '10 mm']],
    'Jedinice za dužinu idu po deseticama: svaka manja jedinica je 10 puta manja od veće (osim kilometra koji je 1000 m).', 'jedinica');

  // ── 12. prenošenje i nadovezivanje duži ──
  L('Prenošenje i nadovezivanje duži');
  Q(1, 'Kojim priborom prenosiš dužinu duži na drugo mesto?',
    ['Šestarom', 'Lenjirom i olovkom', 'Uglomerom', 'Trouglom'],
    'Šestarom „uhvatiš“ dužinu duži i preneseš je. Lenjir služi samo za povlačenje pravih linija, a uglomer za uglove.', 'šestar',
    { medijiOdgovora: G({ A: [-2, 0], B: [2, 0], M: [0, 1.5], N: [0, -1.5] },
      [{ d: 'AB', b: 0, debljina: 3 },
       { l: 'A', r: 2.5, od: 10, do: 85, b: 3 }, { l: 'A', r: 2.5, od: 275, do: 350, b: 3 },
       { l: 'B', r: 2.5, od: 95, do: 170, b: 3 }, { l: 'B', r: 2.5, od: 190, do: 265, b: 3 },
       { tacka: 'M', b: 1 }, { tacka: 'N', b: 1 }], { bezImena: ['M', 'N'], velicina: 260 }) });
  Q(1, 'Ako duž od 3 cm nadovežeš na duž od 4 cm, kolika je ukupna duž?',
    ['7 cm', '6 cm', '5 cm', '8 cm'],
    'Nadovezivanje znači postavljanje jedne duži na kraj druge, pa se dužine sabiraju: $3 + 4 = 7$ cm.', 'duž',
    { mediji: G({ A: [0, 0], B: [3, 0], D: [7, 0] }, [{ d: 'AB', b: 1, debljina: 4, o: '3 cm', na: 0.3 }, { d: 'BD', b: 2, debljina: 4, o: '4 cm', na: 0.7 }], { velicina: 300 }) });
  Q(2, 'Tačka C je na duži AB. Ako je $AB = 5$ cm i $AC = 2$ cm, kolika je duž $CB$?',
    ['3 cm', '2 cm', '5 cm', '7 cm'],
    'Kad je tačka na duži, delovi se dopunjuju do cele duži: $CB = AB - AC = 5 - 2 = 3$ cm.', 'duž',
    { mediji: G({ A: [0, 0], C: [2, 0], B: [5, 0] }, [{ d: 'AB', b: 4, debljina: 2 }, { d: 'AC', b: 1, debljina: 4 }, { tacka: 'C', b: 1 }, { tx: '2 cm', at: [1, 0.45], vel: 14, b: 1 }, { tx: '5 cm', at: [3.6, -0.75], vel: 14 }], { velicina: 260 }) });
  Q(2, 'Šta znači „nadovezati duži“?',
    ['Postaviti jednu duž na kraj druge', 'Postaviti ih tako da se ukrste', 'Postaviti ih jednu ispod druge', 'Prepoloviti obe duži'],
    'Nadovezivanje: kraj jedne duži postane početak druge, tako da zajedno čine jednu dužu duž. Tako se dužine sabiraju.', 'duž',
    { medijiOdgovora: G({ A: [0, 0], B: [2.5, 0], C: [0, -1.8], D: [2.5, -1.8] }, [{ d: 'AB', b: 1, debljina: 4 }, { d: 'CD', b: 2, debljina: 4, pomeri: [2.5, 1.8], ponovi: 1 }], { velicina: 260 }) });
  Q(3, 'Imaš tri duži: 2 cm, 4 cm i 6 cm. Nadovezivanjem sve tri dobijaš duž od…',
    ['12 cm', '10 cm', '8 cm', '14 cm'],
    'Sve tri se sabiraju: $2+4+6=12$ cm. Nadovezivanjem se dužine uvek sabiraju.', 'duž',
    { mediji: G({ A: [0, 0], B: [2, 0], C: [6, 0], D: [12, 0] }, [{ d: 'AB', b: 1, debljina: 4, o: '2', na: 0.4 }, { d: 'BC', b: 2, debljina: 4, o: '4', na: 0.4 }, { d: 'CD', b: 3, debljina: 4, o: '6', na: 0.4 }], { velicina: 320 }) });
  Q(2, 'Duž AB preneta je šestarom na polupravu od tačke C, pa je dobijena duž CD. Šta sigurno važi?',
    ['$AB = CD$', '$AB < CD$', '$AB > CD$', 'Duži su paralelne'],
    'Prenošenje šestarom čuva dužinu, pa su duži jednake: $AB = CD$. To je osnovni način da kopiramo duž.', 'šestar',
    { medijiOdgovora: G({ A: [0, 0], B: [3, 0], C: [0, -2], D: [3, -2] }, [{ d: 'AB', b: 1, debljina: 4, o: '3 cm' }, { d: 'CD', b: 2, debljina: 4, o: '3 cm' }, { d: 'AC', isp: 1, b: 4, str: 1 }], { velicina: 260 }) });

  // ── 13. mnogougao ──
  L('Mnogougao');
  Q(1, 'Šta je mnogougao?',
    ['Zatvorena izlomljena linija', 'Otvorena izlomljena linija', 'Prava linija', 'Kružna linija'],
    'Mnogougao nastaje kad se izlomljena linija zatvori – kraj se spoji sa početkom. Primeri: trougao, kvadrat, petougao.', 'mnogougao',
    { medijiOdgovora: mnogougao(5) });
  Q(1, 'Koliko stranica ima petougao?',
    ['5', '6', '4', '7'],
    'Petougao ima 5 stranica (peta = pet). Svaka stranica je duž koja spaja dva susedna temena.', 'petougao',
    { medijiOdgovora: mnogougao(5) });
  Q(1, 'Kako se zove mnogougao sa 6 stranica?',
    ['Šestougao', 'Petougao', 'Sedmougao', 'Osmougao'],
    'Šestougao ima 6 stranica i 6 temena. Saće u košnici sastoji se od pravilnih šestouglova.', 'šestougao',
    { medijiOdgovora: mnogougao(6) });
  Q(2, 'Kako se zove mnogougao kome su sve stranice i svi uglovi jednaki?',
    ['Pravilan mnogougao', 'Nepravilan mnogougao', 'Konveksan mnogougao', 'Pravougaonik'],
    'Pravilan mnogougao ima sve stranice jednake i sve uglove jednake. Primeri: jednakostranični trougao, kvadrat, pravilni šestougao.', 'pravilan',
    { medijiOdgovora: mnogougao(6, { krugOpisan: true }) });
  Q(2, 'Kako se zove duž koja spaja dva nesusedna temena mnogougla?',
    ['Dijagonala', 'Stranica', 'Visina', 'Poluprečnik'],
    'Dijagonala spaja dva temena koja nisu susedna. Kvadrat ima 2 dijagonale, petougao 5, a šestougao 9.', 'dijagonala',
    { medijiOdgovora: mnogougao(5, { dijagonala: true }) });
  Q(2, 'Šta su temena mnogougla?',
    ['Tačke u kojima se spajaju stranice', 'Sredine stranica', 'Duži koje spajaju tačke', 'Uglovi mnogougla'],
    'Temena su tačke u kojima se sustiču dve susedne stranice. Mnogougao ima isto toliko temena koliko i stranica.', 'teme',
    { medijiOdgovora: G(pravilni(5, 3), [{ p: 'ABCDE', b: 0 }, { tacka: 'A', b: 1 }, { tacka: 'B', b: 1 }, { tacka: 'C', b: 1 }, { tacka: 'D', b: 1 }, { tacka: 'E', b: 1 }], { velicina: 240 }) });
  Q(3, 'Koji od ovih oblika NIJE mnogougao?',
    ['Krug', 'Trougao', 'Šestougao', 'Kvadrat'],
    'Krug nije mnogougao jer nije ograničen dužima, nego zakrivljenom linijom. Mnogougao uvek ima stranice koje su duži.', 'krug',
    { medijiOdgovora: G({ O: [-3, 0], B: [0.5, 0], C: [2.2, 2], D: [3.5, -0.6], E: [1, -2] }, [{ kr: 'O', r: 2.4, b: 1 }, { p: 'BCDE', b: 0 }, { tx: 'O', at: [-3, -0.5], vel: 14 }], { bezImena: ['O'], velicina: 300 }) });

  // ── 14. kružnica i krug ──
  L('Kružnica i krug; kružnica i prava');
  Q(1, 'Šta je kružnica?',
    ['Skup tačaka jednako udaljenih od centra', 'Skup tačaka unutar kruga', 'Duž koja prolazi kroz centar', 'Zatvorena izlomljena linija'],
    'Kružnica je samo linija – sve tačke koje su na istoj udaljenosti od centra $O$. Ta udaljenost je poluprečnik.', 'kružnica',
    { mediji: G({ O: [0, 0] }, [{ kr: 'O', r: 3, b: 1 }, { tx: 'O', at: [0, -0.5], vel: 14 }], { bezImena: ['O'], velicina: 260 }) });
  Q(1, 'Kako se zove duž koja spaja centar kružnice sa bilo kojom tačkom na kružnici?',
    ['Poluprečnik', 'Prečnik', 'Tetiva', 'Tangenta'],
    'Poluprečnik (radijus) je duž od centra do kružnice. Označavamo ga sa $r$. Svi poluprečnici jedne kružnice su jednaki.', 'poluprečnik',
    { medijiOdgovora: G({ O: [0, 0], A: [3, 0] }, [{ kr: 'O', r: 3, b: 1 }, { d: 'OA', b: 1, debljina: 3, o: 'r' }, { tx: 'O', at: [0, -0.5], vel: 14 }], { bezImena: ['O'], velicina: 260 }) });
  Q(1, 'Kako se zove duž koja prolazi kroz centar i spaja dve tačke kružnice?',
    ['Prečnik', 'Poluprečnik', 'Tetiva', 'Sečica'],
    'Prečnik (dijametar) je najduža tetiva. Dva puta je duži od poluprečnika: $d = 2r$.', 'prečnik',
    { medijiOdgovora: G({ O: [0, 0], A: [-3, 0], B: [3, 0] }, [{ kr: 'O', r: 3, b: 1 }, { d: 'AB', b: 2, debljina: 3, o: 'd' }, { tx: 'O', at: [0, -0.5], vel: 14 }], { bezImena: ['O'], velicina: 260 }) });
  Q(2, 'Kako se zove prava koja dodiruje kružnicu u tačno jednoj tački?',
    ['Tangenta', 'Sečica', 'Tetiva', 'Simetrala'],
    'Tangenta dodiruje kružnicu u jednoj tački (dodirna tačka). Ona je normalna na poluprečnik u toj tački.', 'tangenta',
    { medijiOdgovora: G({ O: [0, 0], A: [0, 3], B: [-3, 3], C: [3, 3] }, [{ kr: 'O', r: 3, b: 1 }, { d: 'BC', b: 2, debljina: 3 }, { tacka: 'A', b: 1 }, { pu: 'OAB' }], { ...bez, velicina: 260 }) });
  Q(2, 'Kako se zove prava koja seče kružnicu u dve tačke?',
    ['Sečica', 'Tangenta', 'Tetiva', 'Paralela'],
    'Sečica prolazi kroz kružnicu i seče je u dve tačke. Deo sečice unutar kružnice zove se tetiva.', 'sečica',
    { medijiOdgovora: G({ O: [0, 0], A: [-3.5, -1], B: [3.5, 1] }, [{ kr: 'O', r: 3, b: 1 }, { d: 'AB', b: 2, debljina: 3 }], { ...bez, velicina: 260 }) });
  Q(2, 'Šta je krug (za razliku od kružnice)?',
    ['Kružnica sa svim tačkama unutar nje', 'Samo linija oko centra', 'Centar sa poluprečnikom', 'Najduža tetiva kružnice'],
    'Kružnica je samo linija, a krug je linija PLUS sve unutrašnje tačke. Kružnica je „obod“, krug je „puna ploča“.', 'krug',
    { medijiOdgovora: G({ O: [0, 0], A: [3, 0] }, [{ kr: 'O', r: 3, b: 1, pun: 1, gusto: 1 }, { tx: 'krug', at: [0, 1.4], vel: 15 }], { ...bez, velicina: 240 }) });
  Q(3, 'Duž koja spaja dve tačke kružnice, a ne mora da prolazi kroz centar, zove se…',
    ['Tetiva', 'Prečnik', 'Poluprečnik', 'Tangenta'],
    'Tetiva spaja bilo koje dve tačke kružnice. Prečnik je posebna tetiva – ona koja prolazi kroz centar i najduža je.', 'tetiva',
    { mediji: G({ O: [0, 0] }, [{ kr: 'O', r: 3, b: 1 }], { bezImena: ['O'], velicina: 260 }), medijiOdgovora: G({ O: [0, 0], A: [-2.4, -1.8], B: [2.4, -1.8] }, [{ kr: 'O', r: 3, b: 1 }, { d: 'AB', b: 2, debljina: 3 }], { ...bez, velicina: 260 }) });
  Q(2, 'Koliko puta je prečnik duži od poluprečnika?',
    ['2 puta', '3 puta', '4 puta', 'Isti su'],
    'Prečnik je $2$ puta duži od poluprečnika: $d=2r$. Ako je poluprečnik 5 cm, prečnik je 10 cm.', 'prečnik',
    { medijiOdgovora: G({ O: [0, 0], A: [-3, 0], B: [3, 0] }, [{ kr: 'O', r: 3, b: 1 }, { d: 'OA', b: 1, debljina: 3, o: 'r', na: 0.45 }, { d: 'OB', b: 1, debljina: 3, o: 'r', na: 0.45, os: -1 }], { bezImena: ['O'], velicina: 260 }) });

  // ── 15. centralna simetrija ──
  L('Centralna simetrija');
  Q(1, 'Šta je centar simetrije?',
    ['Tačka oko koje se vrši preslikavanje', 'Prava oko koje se preslikava', 'Duž koja se preslikava', 'Ugao figure'],
    'Centar simetrije je tačka $O$ oko koje preslikavamo. Centralna simetrija je isto što i okretanje za $180°$ oko te tačke.', 'centar',
    { mediji: G({ O: [0, 0] }, [{ tacka: 'O', b: 1 }, { tx: 'O', at: [0, -0.5], vel: 15 }], { bezImena: ['O'], velicina: 160 }) });
  Q(2, 'U centralnoj simetriji sa centrom O, tačka A preslikava se u tačku A′. Šta je tačka O za duž AA′?',
    ['Središte duži AA′', 'Kraj duži AA′', 'Van duži AA′', 'Teme trougla'],
    'Tačka O je tačno na sredini duži $AA\'$: važi $AO = OA\'$, a tačke A, O i A′ su na istoj pravoj.', 'središte',
    { medijiOdgovora: G({ A: [-2.2, 0], O: [0, 0], "A'": [2.2, 0] }, [{ d: "AA'", b: 0 }, { tacka: 'O', b: 1 }, { tx: 'O', at: [0, -0.5], vel: 14 }], { velicina: 280 }) });
  Q(2, 'Centralna simetrija je isto što i okretanje za koliko stepeni?',
    ['180°', '90°', '360°', '45°'],
    'Centralna simetrija je rotacija za $180°$ (pola kruga) oko centra. Figura posle okreta izgleda „naopako“.', 'rotacija',
    { mediji: G({ O: [0, 0], A: [1.5, 0.5], B: [2.5, 1.8], C: [0.5, 1.6], "A'": [-1.5, -0.5], "B'": [-2.5, -1.8], "C'": [-0.5, -1.6] }, [{ p: 'ABC', b: 1, gusto: 1 }, { p: "A'B'C'", b: 2, gusto: 1 }, { tacka: 'O', b: 0 }, { tx: 'O', at: [0, -0.5], vel: 15 }], { bezImena: ['O'], velicina: 260 }) });
  Q(2, 'Koja od ovih figura ima centar simetrije?',
    ['Krug', 'Trougao', 'Poluprava', 'Ugao'],
    'Krug ima centar simetrije u svom središtu – okretanjem za 180° izgleda isto. Kvadrat i paralelogram takođe imaju centar simetrije.', 'centar',
    { medijiOdgovora: G({ O: [0, 0], A: [3, 0] }, [{ kr: 'O', r: 3, b: 1 }, { tacka: 'O', b: 0 }, { tx: 'O', at: [0, -0.5], vel: 15 }], { bezImena: ['O'], velicina: 240 }) });
  Q(3, 'Koliko centara simetrije ima duž?',
    ['Jedan (njeno središte)', 'Dva (krajevi)', 'Nijedan', 'Beskonačno mnogo'],
    'Duž ima centar simetrije u svom središtu: okretanjem za 180° oko središta, krajevi zamene mesta, a duž ostane ista.', 'centar',
    { medijiOdgovora: G({ A: [-3, 0], O: [0, 0], B: [3, 0] }, [{ d: 'AB', b: 0, debljina: 3 }, { tacka: 'O', b: 1 }, { tx: 'O', at: [0, -0.5], vel: 15 }], { bezImena: ['O'], velicina: 260 }) });

  // ── 16. vektor i translacija ──
  L('Vektor i translacija');
  Q(1, 'Šta je vektor?',
    ['Usmerena duž', 'Obična duž', 'Tačka', 'Prava'],
    'Vektor je duž kojoj je važan i smer – zato ga crtamo sa strelicom. Njime opisujemo pomeranje (translaciju).', 'vektor',
    { medijiOdgovora: G({ A: [0, 0], B: [4, 0] }, [{ d: 'AB', b: 1, str: 1, debljina: 4 }], { velicina: 240 }) });
  Q(1, 'Šta sve određuje jedan vektor?',
    ['Pravac, smer i dužina', 'Samo dužina', 'Samo pravac', 'Boja i debljina'],
    'Vektor ima tri osobine: pravac (na kojoj je liniji), smer (na koju stranu pokazuje strelica) i intenzitet (dužinu).', 'vektor',
    { medijiOdgovora: G({ A: [0, 0], B: [4, 0] }, [{ d: 'AB', b: 1, str: 1, debljina: 4, o: 'dužina' }, { tx: 'smer', at: [4, 0.65], vel: 14, b: 1 }], { velicina: 240 }) });
  Q(1, 'Kako se zove pomeranje figure duž vektora?',
    ['Translacija', 'Rotacija', 'Simetrija', 'Merenje'],
    'Translacija je klizanje figure bez okretanja – svaka tačka figure pomeri se za isti vektor. Figura ostaje ista, samo promeni mesto.', 'translacija',
    { medijiOdgovora: G({ A: [0, 0], B: [1.8, 0], C: [0.6, 1.8], D: [4.2, 1.2] }, [{ p: 'ABC', b: 1, gusto: 1 }, { d: 'AD', b: 4, str: 1, isp: 1, debljina: 3 }], { velicina: 240 }) });
  Q(2, 'Kada su dva vektora jednaka?',
    ['Isti pravac, smer i dužina', 'Ista dužina i početak', 'Isti pravac i dužina', 'Isti smer i početak'],
    'Dva vektora su jednaka ako su im pravac, smer i dužina isti. Mesto početka nije bitno – vektor se može pomeriti, a da ostane isti.', 'vektor',
    { medijiOdgovora: G({ A: [0, 0], B: [2.5, 0], C: [0, -2], D: [2.5, -2] }, [{ d: 'AB', b: 1, str: 1, debljina: 4 }, { d: 'CD', b: 2, str: 1, debljina: 4 }], { velicina: 260 }) });
  Q(2, 'Pri translaciji trougla za neki vektor, šta se dešava sa dužinama stranica?',
    ['Ostaju iste', 'Povećaju se', 'Smanje se', 'Zavisi od vektora'],
    'Translacija ne menja ni oblik ni veličinu figure – samo je pomera. Zato su dužine stranica i uglovi posle translacije isti.', 'translacija',
    { medijiOdgovora: G({ A: [0, 0], B: [1.6, 0], C: [0.6, 1.6], "A'": [3, 1.2], "B'": [4.6, 1.2], "C'": [3.6, 2.8] }, [{ p: 'ABC', b: 0 }, { p: "A'B'C'", b: 1 }, { d: "AA'", b: 2, str: 1, isp: 1 }], { velicina: 280 }) });
  Q(3, 'Gde se piše strelica u oznaci vektora?',
    ['Iznad slova', 'Ispod slova', 'Ispred slova', 'Između slova'],
    'Vektor označavamo strelicom iznad slova: $\\vec{AB}$ ili $\\vec{v}$. Strelica pokazuje da je smer važan.', 'vektor',
    { medijiOdgovora: G({ A: [0, 0], B: [4, 0] }, [{ d: 'AB', b: 1, str: 1, debljina: 4 }, { tx: 'A', at: [0, -0.5], vel: 15 }, { tx: 'B', at: [4, -0.5], vel: 15 }], { velicina: 260 }) });

};
