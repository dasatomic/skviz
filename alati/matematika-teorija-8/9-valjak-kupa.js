// Lekcije 1–8 teme „Valjak, kupa, lopta“ (deo o valjku i kupi): osnovni elementi, ravni preseci,
// mreže i površine, zapremine. Gradivo: udžbenik Matematika 8, 2. deo, str. 115–144; pitanja su sopstvena.
// Crteži: valjak/kupa u prostoru (projekcija kao u prostor.js), preseci kao ravni u istom pogledu,
// mreže valjka i kupe, pravougli trouglovi u ravni (obrtanje oko katete).
module.exports = ({ L, Q, U, S, G, proveri, telo, A, valjak, kupa, elipsa3, mrezaValjka, mrezaKupe }) => {

  // ── pogled kao u prostor.js (θ = 30°): vV = vodoravna osa crteža (prečnik osnove), uT = ka posmatraču ──
  const T = Math.PI / 6;
  const vV = [Math.cos(T), Math.sin(T), 0];
  const uT = [Math.sin(T), -Math.cos(T), 0];
  // tačka u prostoru: a duž prečnika (vV), b ka posmatraču (uT), z visina
  const p3 = (a, b, z) => [a * vV[0] + b * uT[0], a * vV[1] + b * uT[1], z];

  // ── ravni u prostoru (elementi za valjak/kupu) ──
  // vodoravna ravan na visini z (kvadrat poluprečnika w)
  const vodoravna = (z, w = 6, b = 4) => [{ lin3: [p3(-w, -w, z), p3(w, -w, z), p3(w, w, z), p3(-w, w, z)], zatv: 1, b, gusto: 1 }];
  // ravan paralelna osi na rastojanju d (deo ravni za crtež, veći od preseka)
  const ravanOsi = (d, w, H, b = 4) => [{ lin3: [p3(-w, d, -1), p3(w, d, -1), p3(w, d, H + 1), p3(-w, d, H + 1)], zatv: 1, b, gusto: 1 }];
  // presek valjka ravninom paralelnom osi na rastojanju d: pravougaonik širine 2√(r²−d²) i visine H
  const presekOsi = (R, H, d, b = 2) => { const w = Math.sqrt(R * R - d * d); return [{ lin3: [p3(-w, d, 0), p3(w, d, 0), p3(w, d, H), p3(-w, d, H)], zatv: 1, b, gusto: 1 }]; };
  // ravan kroz osu (osni presek) – deo ravni koji sadrži osu
  const osna = (R, H, b = 4) => [{ lin3: [p3(-R - 1.5, 0, -1), p3(R + 1.5, 0, -1), p3(R + 1.5, 0, H + 1), p3(-R - 1.5, 0, H + 1)], zatv: 1, b, gusto: 1 }];

  // ── ravni crteži (pravougaonik, pravougli trougao) ──
  const pravoug = (a, b, oa, ob, e = [], x = {}) => G({ A: [0, 0], B: [a, 0], C: [a, b], D: [0, b] },
    [{ p: 'ABCD', b: 0 }, ...(oa ? [{ d: 'AB', o: oa }] : []), ...(ob ? [{ d: 'BC', o: ob }] : []), ...e], { velicina: 240, ...x });
  // pravougli trougao OAS sa pravim uglom kod O (OA = a vodoravno, OS = b uspravno)
  const pravi = (a, b, { oa, ob, hip, e = [], x = {} } = {}) => G({ O: [0, 0], A: [a, 0], S: [0, b] },
    [{ p: 'OAS', b: 0 }, { pu: 'AOS' }, ...(oa ? [{ d: 'OA', o: oa }] : []), ...(ob ? [{ d: 'OS', o: ob }] : []), ...(hip ? [{ d: 'AS', o: hip }] : []), ...e], { velicina: 240, ...x });

  // ── provere računa (gradnja pukne ako nije tačno) ──
  proveri(Math.abs(2 * Math.sqrt(5 * 5 - 4 * 4) - 6) < 1e-9, 'širina preseka r = 5, d = 4 je 6');
  proveri(Math.abs(2 * Math.sqrt(5 * 5 - 3 * 3) - 8) < 1e-9, 'kvadratni presek r = 5, d = 3, H = 8');
  proveri(Math.abs(2 * Math.sqrt(13 * 13 - 5 * 5) - 24) < 1e-9, 'tetiva 24 za r = 13, d = 5');
  proveri(Math.abs(Math.sqrt(3 * 3 + 4 * 4) - 5) < 1e-9, 'izvodnica kupe r = 3, H = 4 je 5');
  proveri(Math.abs(Math.sqrt(6 * 6 + 8 * 8) - 10) < 1e-9, 'dijagonala osnog preseka r = 3, H = 8 je 10');
  proveri(Math.abs(Math.sqrt(12 * 12 + 9 * 9) - 15) < 1e-9, 'izvodnica 12, 9 je 15');
  proveri(Math.abs(Math.sqrt(13 * 13 - 5 * 5) - 12) < 1e-9, 'visina kupe 13, 5 je 12');
  proveri(Math.abs(Math.sqrt(17 * 17 - 8 * 8) - 15) < 1e-9, 'visina kupe 17, 8 je 15');
  proveri(Math.abs(Math.sqrt(6 * 6 + 8 * 8) - 10) < 1e-9, 'izvodnica 6, 8 je 10');
  proveri(Math.abs(2 * 9 * Math.PI + 2 * 3 * 5 * Math.PI - 48 * Math.PI) < 1e-9, 'P valjka r = 3, H = 5 je 48π');
  proveri(Math.abs(2 * 2 * Math.PI * 6 - 24 * Math.PI) < 1e-9, 'omotač r = 2, H = 6 je 24π');
  proveri(Math.abs(2 * Math.PI * 6 * (6 + 5) - 132 * Math.PI) < 1e-9, 'P valjka r = 6, H = 5 je 132π');
  proveri(Math.abs(2 * Math.PI * 6 * 5 - 60 * Math.PI) < 1e-9, 'omotač r = 6, H = 5 je 60π');
  proveri(Math.abs(2 * Math.PI * 3 * (3 + 2) - 30 * Math.PI) < 1e-9, 'P valjka r = 3, H = 2 je 30π');
  proveri(Math.abs(2 * Math.PI * 2 * (2 + 6) - 32 * Math.PI) < 1e-9, 'P valjka r = 2, H = 6 je 32π');
  proveri(Math.abs(2 * Math.PI * 6 * (6 + 2) - 96 * Math.PI) < 1e-9, 'P valjka r = 6, H = 2 je 96π');
  proveri(Math.abs(Math.PI * 4 * 4 * 6 - 96 * Math.PI) < 1e-9, 'V valjka r = 4, H = 6 je 96π');
  proveri(Math.abs(Math.PI * 3 * 3 * 6 - 54 * Math.PI) < 1e-9 && Math.abs(54 * Math.PI / (9 * Math.PI) - 6) < 1e-9, 'V = 54π, r = 3 → H = 6');
  proveri(Math.abs(Math.PI * 2 * 2 * 5 - 20 * Math.PI) < 1e-9, 'V valjka r = 2, H = 5 je 20π');
  proveri(Math.abs(Math.PI * 4 * 4 * 3 - 48 * Math.PI) < 1e-9, 'V valjka prečnik 8, H = 3 je 48π');
  proveri(Math.abs(Math.PI * 16 * 8 - 128 * Math.PI) < 1e-9 && Math.abs(Math.PI * 64 * 4 - 256 * Math.PI) < 1e-9, 'obrtanje pravougaonika 8 × 4');
  proveri(Math.abs(72 * Math.PI / (9 * Math.PI) - 8) < 1e-9, 'V = 72π, r = 3 → H = 8');
  proveri(Math.abs(Math.PI * 100 * 20 / 1000 - 6.28) < 0.01 && Math.abs(3 * 100 * 20 - 6000) < 1e-9, 'posuda r = 10, H = 20, π ≈ 3 → 6 l');
  proveri(Math.abs(Math.PI * 4 * 1 * 0 + 2 * Math.PI * 3 * 6 - 36 * Math.PI) < 1e-9, 'valjak r = 3, H = 6: omotač 36π');
  proveri(Math.abs(Math.PI * 16 * 6 / 3 * 0 + (1 / 3) * Math.PI * 16 * 6 - 32 * Math.PI) < 1e-9, 'kupa r = 4, H = 6: V = 32π');
  proveri(Math.abs((1 / 3) * Math.PI * 9 * 4 - 12 * Math.PI) < 1e-9, 'kupa r = 3, H = 4: V = 12π');
  proveri(Math.abs((1 / 3) * Math.PI * 36 * 8 - 96 * Math.PI) < 1e-9, 'kupa r = 6, H = 8: V = 96π');
  proveri(Math.abs((1 / 3) * Math.PI * 25 * 12 - 100 * Math.PI) < 1e-9, 'kupa r = 5, H = 12: V = 100π');
  proveri(Math.abs((1 / 3) * Math.PI * 4 * 9 - 12 * Math.PI) < 1e-9, 'kupa r = 2, H = 9: V = 12π');
  proveri(Math.abs((1 / 3) * Math.PI * 100 * 3 - 100 * Math.PI) < 1e-9, 'kupa r = 10, H = 3: V = 100π');
  proveri(Math.abs((1 / 3) * Math.PI * 64 * 6 - 128 * Math.PI) < 1e-9, 'kupa r = 8, H = 6: V = 128π');
  proveri(Math.abs(3 * Math.sqrt(3) * 2 - 6 * Math.sqrt(3)) < 1e-9 && Math.abs((1 / 3) * Math.PI * 36 * 6 * Math.sqrt(3) - 72 * Math.sqrt(3) * Math.PI) < 1e-9, 'jednakostranični 12: V = 72√3π');
  proveri(Math.abs((1 / 3) * Math.PI * 9 * 3 * Math.sqrt(3) - 9 * Math.sqrt(3) * Math.PI) < 1e-9, 'osni presek 6: V = 9√3π');
  proveri(Math.abs(Math.PI * 3 * (3 + 5) - 24 * Math.PI) < 1e-9 && Math.abs(Math.PI * 3 * 5 - 15 * Math.PI) < 1e-9, 'P kupe r = 3, s = 5: 24π, M = 15π');
  proveri(Math.abs(Math.PI * 6 * (6 + 10) - 96 * Math.PI) < 1e-9, 'P kupe r = 6, s = 10: 96π');
  proveri(Math.abs(Math.PI * 3 * (3 + 12) - 45 * Math.PI) < 1e-9 && Math.abs(360 * 3 / 12 - 90) < 1e-9, 'kupa iz isečka 90°, s = 12: 45π');
  proveri(Math.abs(360 * 3 / 5 - 216) < 1e-9 && Math.abs(360 * 2 / 6 - 120) < 1e-9, 'uglovi isečaka');
  proveri(Math.abs(6 * 2 * 0 + 120 * 6 / 360 - 2) < 1e-9, 'kupa s = 6, ugao 120° → r = 2');
  proveri(Math.abs(Math.sqrt(36 + 64) - 10) < 1e-9 && Math.abs(Math.sqrt(3 * 3 + 4 * 4) - 5) < 1e-9, 'Pitagorine trojke');

  // ════════ 1. Valjak: osnovni elementi ════════
  L('Valjak: osnovni elementi');

  Q(1, 'Kakav je oblik osnova valjka?',
    ['Dva podudarna kruga', 'Dva jednakostranična trougla', 'Dva kvadrata', 'Dve elipse'],
    'Osnova se na crtežu vidi kao izdužen ovalčić, ali je u stvarnosti krug. Ovalni oblik je samo pogled sa strane, kao kad gledaš tanjir pod uglom.', 'krug',
    { mediji: valjak(3, 6, [], {}),
      medijiOdgovora: valjak(3, 6, [...elipsa3([0, 0, 0], 3, { cela: 1, pun: 1, gusto: 1, b: 2 })], {}) });

  Q(1, 'Kako se zove prava koja prolazi kroz centre obe osnove valjka?',
    ['osa valjka', 'izvodnica', 'poluprečnik', 'tetiva'],
    'Valjak izgleda isto kad se okrene oko svoje ose, za bilo koji ugao. Zato se valjkaste šipke izrađuju okretanjem na tokarskom strugu.', 'osa',
    { mediji: valjak(3, 6, [], { imena: true, bezImena: ['A', 'B', 'A₁', 'B₁'] }),
      medijiOdgovora: valjak(3, 6, [{ d: 'OO₁', b: 2, isp: 1, debljina: 2 }], { imena: true, bezImena: ['A', 'B', 'A₁', 'B₁'] }) });

  Q(1, 'Pravougaonik sa stranicama 4 cm i 7 cm obrće se oko kraće stranice. Kolika je visina dobijenog valjka?',
    ['4 cm', '7 cm', '3,5 cm', '11 cm'],
    'Visina valjka jednaka je stranici oko koje se pravougaonik obrće. Druga stranica postaje poluprečnik osnove.', 'visina',
    { mediji: pravoug(4, 7, '~kraća stranica', '7 cm'),
      medijiOdgovora: valjak(7, 4, [{ d: 'AA₁', b: 1, debljina: 3, o: 'H = 4 cm' }], { imena: true, bezImena: ['O', 'O₁', 'B', 'B₁'] }) });

  Q(2, 'Valjak ima poluprečnik osnove 3 cm i visinu 8 cm. Koliki mu je prečnik osnove?',
    ['6 cm', '3 cm', '8 cm', '11 cm'],
    'Prečnik osnove je dva puta veći od poluprečnika. Visina valjka nema veze sa osnovom: valjak može biti kratak kao novčić ili visok kao stub.', 'prečnik',
    { mediji: valjak(3, 8, [{ d: 'OB', b: 1, debljina: 3, o: 'r = 3 cm' }], { imena: true, bezImena: ['O₁', 'A', 'A₁', 'B₁'] }),
      medijiOdgovora: valjak(3, 8, [{ d: 'AB', b: 1, debljina: 3, o: 'd = 6 cm' }], { imena: true, bezImena: ['O₁', 'A₁', 'B₁'] }) });

  Q(2, 'Valjak ima poluprečnik osnove 3 cm i visinu 8 cm. Kolika je dužina izvodnice?',
    ['8 cm', '3 cm', '√{73} cm', '11 cm'],
    'Izvodnica valjka je normalna na osnove, pa je jednaka visini. Kod kupe je drugačije: tamo izvodnica nije jednaka visini, nego je hipotenuza pravouglog trougla.', 'izvodnica',
    { mediji: valjak(3, 8, [{ d: 'AA₁', b: 1, debljina: 3, o: 's = ?' }, { d: 'OB', b: 1, debljina: 2, o: 'r = 3 cm' }], { imena: true, bezImena: ['O₁', 'A', 'B', 'A₁', 'B₁'] }),
      medijiOdgovora: valjak(3, 8, [{ d: 'AA₁', b: 1, debljina: 3, o: 's = 8 cm' }], { imena: true, bezImena: ['O', 'O₁', 'B', 'A', 'B₁'] }) });

  Q(2, 'Osni presek valjka je kvadrat stranice 10 cm. Koliki je poluprečnik osnove?',
    ['5 cm', '10 cm', '20 cm', '2,5 cm'],
    'Kad je osni presek kvadrat, valjak je „visok koliko je širok“. Stranica kvadrata je prečnik osnove, pa je poluprečnik polovina od 10 cm. Ovakvi valjci su stabilni, zato su tako pravljene mnoge konzerve.', 'kvadrat',
    { mediji: valjak(5, 10, [{ d: 'BB₁', b: 1, debljina: 3, o: 'H = 10 cm' }], { imena: true, bezImena: ['O', 'O₁', 'A', 'A₁'] }),
      medijiOdgovora: valjak(5, 10, [{ p: 'ABB₁A₁', b: 2, gusto: 1 }, { d: 'OB', b: 1, debljina: 3, o: 'r = 5 cm' }], { imena: true, bezImena: ['O', 'O₁', 'A', 'A₁'] }) });

  Q(1, 'Koliko osnova ima valjak sa crteža?',
    ['Dve', 'Jednu', 'Tri', 'Nijednu'],
    'Zbog dve ravne kružne osnove valjak može da stoji na jednoj, a da se ne prevrne, kao konzerva.', 'osnova',
    { mediji: telo('valjak', { opis: 'Okreni valjak i pogledaj obe osnove' }) });

  Q(1, 'Kako se zove zakrivljeni deo površine valjka koji povezuje dve osnove?',
    ['omotač', 'osnova', 'osni presek', 'visina'],
    'Kad bi se omotač mogao odmotati, dobio bi se pravougaonik. Tako nastaje mreža valjka, o kojoj će biti reči u jednoj od narednih lekcija.', 'omotač',
    { mediji: valjak(3, 6, [], {}) });

  U(2, 'Koji pojam se NE odnosi na valjak?',
    ['stranica trougla', 'izvodnica', 'osa', 'visina'],
    'Izvodnica, osa i visina su pojmovi za valjak. Stranica trougla je deo trougla, a valjak nema ravnih strana ni uglova.', 'Valjak nema ni temena ni ravnih ivica kao kvadar, pa su mu sve linije na osnovama krugovi.', 'izvodnica',
    { mediji: valjak(3, 6, [], {}) });

  Q(1, 'Duž AB na donjoj osnovi valjka prolazi kroz centar osnove. Kako se zove?',
    ['prečnik osnove', 'poluprečnik', 'izvodnica', 'visina valjka'],
    'Duž koja spaja dve tačke kruga i prolazi kroz centar dvostruko je duža od poluprečnika. Zato se zove prečnik.', 'prečnik',
    { mediji: valjak(4, 7, [{ d: 'AB', b: 1, debljina: 3 }], { imena: true, bezImena: ['O', 'O₁', 'A₁', 'B₁'] }) });

  Q(2, 'Izvodnica valjka je 6 cm. Kolika je dužina duži OO₁ koja spaja centre osnova?',
    ['6 cm', '3 cm', '12 cm', '4 cm'],
    'Duž OO₁ je osa valjka, a njena dužina je jednaka visini. Izvodnica i visina su jednake, pa je i OO₁ jednaka izvodnici. Mnogi pomešaju osu s poluprečnikom.', 'osa',
    { mediji: valjak(3, 6, [{ d: 'AA₁', b: 1, debljina: 3, o: 's' }, { tacka: 'OO₁' }], { imena: true, bezImena: ['A', 'B', 'A₁', 'B₁'] }),
      medijiOdgovora: valjak(3, 6, [{ d: 'OO₁', b: 2, isp: 1, debljina: 2, o: 'OO₁ = 6 cm' }], { imena: true, bezImena: ['A', 'B', 'A₁', 'B₁'] }) });

  Q(3, 'Pravougaonik ABCD ima stranice AD = 5 cm i AB = 3 cm i obrće se oko stranice AD. Koji je poluprečnik osnove dobijenog valjka?',
    ['3 cm', '5 cm', '8 cm', '1,5 cm'],
    'Oko stranice AD obrće se cela stranica AB, koja opisuje krug osnove. Poluprečnik je zato AB, a AD postaje visina valjka.', 'obrtanje',
    { mediji: pravoug(3, 5, null, 'AD = 5 cm') });

  Q(2, 'Osnova valjka je krug prečnika 10 cm. Kolika je površina osnove?',
    ['25π cm²', '10π cm²', '5π cm²', '100π cm²'],
    'Površina kruga je $r^{2}π$. Ako je prečnik 10 cm, poluprečnik je 5 cm, pa je površina $25π$ cm².', 'osnova',
    { mediji: valjak(5, 8, [{ d: 'AB', b: 1, debljina: 3, o: 'd = 10 cm' }], { imena: true, bezImena: ['O', 'O₁', 'A₁', 'B₁'] }) });

  Q(2, 'Visina valjka je jednaka prečniku osnove. Koliko puta je visina veća od poluprečnika?',
    ['2 puta', '1 put', '3 puta', '4 puta'],
    'Ako je visina jednaka prečniku osnove, onda je $H = 2r$. Tako je visina valjka dva puta veća od poluprečnika.', 'visina',
    { mediji: valjak(3, 6, [{ d: 'OB', b: 1, debljina: 3, o: 'r' }], { imena: true, bezImena: ['A', 'A₁', 'B₁', 'O₁'] }) });

  S(2, 'Spoji pojam za valjak i njegovo objašnjenje.',
    [['osa valjka', 'prava kroz centre osnova'], ['izvodnica', 'duž na omotaču, paralelna osi'], ['visina valjka', 'rastojanje između osnova'], ['poluprečnik osnove', 'polovina prečnika osnove']],
    'Izvodnica je uvek paralelna osi i jednaka visini. Zato se valjak može zamisliti kao duž koja klizi duž kruga.', 'valjak',
    { mediji: valjak(3, 6, [], { imena: true, bezImena: [] }) });

  Q(3, 'Dijagonala osnog preseka valjka je 10 cm, a poluprečnik osnove 3 cm. Kolika je visina valjka?',
    ['8 cm', '7 cm', '6 cm', '√{70} cm'],
    'Iz $(2r)² + H² = d²$ sledi $H² = 100 − 36 = 64$, pa je $H = 8$ cm. Dijagonala je hipotenuza osnog preseka.', 'visina',
    { mediji: valjak(3, 8, [{ d: 'AB₁', b: 1, debljina: 2.5, o: 'd = 10 cm' }], { imena: true, bezImena: ['O', 'O₁', 'A₁', 'B'] }) });

  Q(2, 'Valjak nastaje obrtanjem pravougaonika 6 cm × 10 cm oko duže stranice. Koliki je poluprečnik osnove?',
    ['6 cm', '10 cm', '5 cm', '3 cm'],
    'Oko duže stranice (10 cm) obrće se kraća stranica i opisuje krug osnove. Poluprečnik je 6 cm, a visina 10 cm.', 'strana',
    { mediji: pravoug(6, 10, null, '10 cm') });

  // ════════ 2. Ravni preseci valjka ════════
  L('Ravni preseci valjka');

  Q(1, 'Ravan je paralelna osnovama valjka i seče ga. Kakav je presek?',
    ['krug', 'pravougaonik', 'elipsa', 'trougao'],
    'Na crtežu se krug vidi kao elipsa, jer je iskošen. U stvarnosti je to krug iste veličine kao osnova.', 'presek',
    { mediji: valjak(3, 8, vodoravna(5, 5)),
      medijiOdgovora: valjak(3, 8, [...elipsa3([0, 0, 5], 3, { cela: 1, pun: 1, gusto: 1, b: 2 })], {}) });

  Q(1, 'Ravan prolazi kroz osu valjka. Kakav je osni presek?',
    ['pravougaonik', 'krug', 'elipsa', 'kružni isečak'],
    'Osni presek je ogledalo valjka: obe polovine valjka su iste, jedna je odraz druge. Dimenzije su $2r$ i $H$.', 'osni',
    { mediji: valjak(3, 8, osna(3, 8)),
      medijiOdgovora: valjak(3, 8, [{ p: 'ABB₁A₁', b: 2, gusto: 1 }], { imena: true, bezImena: ['O', 'O₁'] }) });

  Q(3, 'Osni presek valjka je pravougaonik čiji je obim 28 cm, a visina valjka 8 cm. Koliki je prečnik osnove?',
    ['6 cm', '14 cm', '48 cm', '3 cm'],
    'Kad je obim 28 cm, a jedna stranica 8 cm, druga je $(28 − 16) : 2 = 6$ cm, i to je prečnik osnove. Površina osnog preseka bila bi 48 cm².', 'obim',
    { mediji: valjak(3, 8, [{ p: 'ABB₁A₁', b: 2, gusto: 1 }, { d: 'BB₁', b: 1, debljina: 2, o: '8 cm' }], { imena: true, bezImena: ['O', 'O₁'] }) });

  Q(2, 'Osni presek valjka ima površinu 48 cm², a visina valjka je 6 cm. Koliki je poluprečnik osnove?',
    ['4 cm', '8 cm', '3 cm', '24 cm'],
    'Površina osnog preseka je $2rH$, pa je $2r · 6 = 48$, odakle je $2r = 8$ cm i $r = 4$ cm. Prečnik 8 cm lako se pomeša sa poluprečnikom.', 'površina',
    { mediji: valjak(4, 6, [{ d: 'BB₁', b: 1, debljina: 3, o: 'H = 6 cm' }], { imena: true, bezImena: ['O', 'O₁', 'A', 'A₁'] }) });

  Q(2, 'Ravan je paralelna osi valjka i udaljena je 4 cm od ose. Poluprečnik valjka je 5 cm. Kolika je širina preseka?',
    ['6 cm', '3 cm', '8 cm', '10 cm'],
    'Širina preseka je $2√{r² − d²}$, pa je $2√{25 − 16} = 6$ cm. To je dužina tetive na rastojanju 4 cm od centra.', 'širina',
    { mediji: valjak(5, 8, ravanOsi(4, 6, 8), { imena: false }),
      medijiOdgovora: valjak(5, 8, presekOsi(5, 8, 4)) });

  U(1, 'Koji presek valjka NE može da nastane ravninom?',
    ['trougao', 'krug', 'pravougaonik', 'elipsa'],
    'Ravan seče valjak po krugu (normalno na osu), pravougaoniku (kroz osu ili paralelno sa njom) ili elipsi (koso). Trougao ne može: valjak nema oštre uglove ni ravne strane osim osnova.', 'Ravan koja dodiruje valjak daje duž, ali nijedna ravan ne seče valjak tako da nastane trougao.', 'trougao',
    { mediji: valjak(3, 8, [], {}) });

  Q(3, 'Ravan je paralelna osi valjka, na rastojanju 3 cm od ose. Poluprečnik valjka je 5 cm, a visina 8 cm. Kolika je površina preseka?',
    ['64 cm²', '40 cm²', '48 cm²', '80 cm²'],
    'Presek je pravougaonik čija je jedna stranica visina 8 cm, a druga $2√{5² − 3²} = 8$ cm. Površina je $8 · 8 = 64$ cm².', 'stranica',
    { mediji: valjak(5, 8, ravanOsi(3, 6, 8)),
      medijiOdgovora: valjak(5, 8, presekOsi(5, 8, 3)) });

  Q(2, 'Vertikalna ravan prolazi kroz tetivu dužine 24 cm u donjoj osnovi valjka poluprečnika 13 cm, a visina valjka je 10 cm. Kolika je površina preseka?',
    ['240 cm²', '120 cm²', '480 cm²', '260 cm²'],
    'Ravan je paralelna osi, pa je presek pravougaonik sa stranicama 24 cm i 10 cm. Površina je $24 · 10 = 240$ cm².', 'tetiva',
    { mediji: valjak(13, 10, ravanOsi(5, 14, 10)),
      medijiOdgovora: valjak(13, 10, presekOsi(13, 10, 5)) });

  Q(2, 'Ravan dodiruje omotač valjka i paralelna je njegovoj osi. Šta je presek ravni i valjka?',
    ['jedna izvodnica (duž)', 'pravougaonik', 'krug', 'prazan skup'],
    'Ravan dodiruje valjak samo duž jedne izvodnice. Dodirna duž ima dužinu jednaku visini valjka.', 'dodir',
    { mediji: valjak(4, 7, ravanOsi(4, 6, 7)),
      medijiOdgovora: valjak(4, 7, [{ lin3: [p3(0, 4, 0), p3(0, 4, 7)], b: 3, debljina: 4 }]) });

  Q(1, 'Ravan je paralelna osnovama i nalazi se iznad valjka. Kakav je njen presek sa valjkom?',
    ['prazan skup', 'krug', 'tačka', 'pravougaonik'],
    'Ravan iznad valjka nema nijednu zajedničku tačku sa njim, pa je presek prazan skup.', 'iznad',
    { mediji: valjak(3, 8, vodoravna(12, 5)) });

  Q(2, 'Ravan je paralelna osi valjka poluprečnika 4 cm i udaljena je 6 cm od ose. Kakav je presek?',
    ['prazan skup', 'pravougaonik', 'duž', 'krug'],
    'Rastojanje ravni od ose (6 cm) veće je od poluprečnika (4 cm), pa ravan ne dodiruje valjak. Presek je prazan skup.', 'daleko',
    { mediji: valjak(4, 6, ravanOsi(6, 6, 6)) });

  Q(3, 'Osni presek valjka poluprečnika 3 cm i visine 8 cm je pravougaonik. Kolika mu je dijagonala?',
    ['10 cm', '14 cm', '$2√{13}$ cm', '8 cm'],
    'Dijagonala je $√{(2r)² + H²} = √{36 + 64} = 10$ cm, po Pitagorinoj teoremi.', 'dijagonala',
    { mediji: valjak(3, 8, [{ d: 'AB₁', b: 1, debljina: 2.5 }], { imena: true, bezImena: ['O', 'O₁', 'A₁', 'B'] }) });

  Q(3, 'Valjak poluprečnika 5 cm i visine 8 cm seče ravan paralelna osi. Na kom rastojanju od ose je ravan ako je presek kvadrat?',
    ['3 cm', '4 cm', '6 cm', '√{41} cm'],
    'Presek je kvadrat kad je širina jednaka visini: $2√{25 − d²} = 8$, pa je $d² = 9$ i $d = 3$ cm. Kvadrat je poseban slučaj pravougaonika.', 'kvadrat',
    { mediji: valjak(5, 8, [], { imena: true, bezImena: ['O', 'O₁', 'A', 'A₁', 'B', 'B₁'] }),
      medijiOdgovora: valjak(5, 8, presekOsi(5, 8, 3)) });

  Q(2, 'Ravan seče valjak nagnuta prema osi (nije ni normalna ni paralelna osi). Kakav je presek?',
    ['elipsa', 'krug', 'pravougaonik', 'trougao'],
    'Što je ravan nagnutija prema osi, elipsa je izduženija. Elipsa je „spljošten“ krug.', 'elipsa',
    { mediji: valjak(3, 8, [{ lin3: [p3(-5, -3, 0), p3(5, -3, 0), p3(5, 3, 8), p3(-5, 3, 8)], zatv: 1, b: 4, gusto: 1 }]) });

  Q(1, 'Ravan normalna na osu valjka prolazi kroz sredinu visine. Poluprečnik osnove je 6 cm. Koliki je poluprečnik preseka?',
    ['6 cm', '3 cm', '12 cm', '9 cm'],
    'Ravan normalna na osu seče valjak po krugu jednakom osnovi, na bilo kojoj visini.', 'poluprečnik',
    { mediji: valjak(6, 10, vodoravna(5, 8)) });

  Q(2, 'Dve ravni paralelne osi valjka poluprečnika 5 cm i visine 8 cm: jedna je na 1 cm od ose, a druga na 4 cm. Koja daje širi presek?',
    ['ona bliža osi', 'ona dalja od ose', 'obe su jednake', 'zavisi od visine valjka'],
    'Širina preseka je $2√{r² − d²}$. Što je rastojanje d manje, to je širina veća, pa bliža ravan daje širi pravougaonik.', 'blizu',
    { mediji: valjak(5, 8, [...presekOsi(5, 8, 1, 4), ...presekOsi(5, 8, 4, 2)]) });

  S(2, 'Spoji vrstu ravni i presek valjka.',
    [['ravan kroz osu', 'osni presek'], ['ravan normalna na osu', 'krug'], ['ravan paralelna osi, dalja od ose', 'uži pravougaonik'], ['ravan koja dodiruje omotač', 'jedna izvodnica']],
    'Presek paralelan osi uvek je pravougaonik, a što je ravan dalja od ose, to je pravougaonik uži.', 'preseci',
    { mediji: valjak(4, 7, [], {}) });

  // ════════ 3. Mreža valjka, površina valjka ════════
  L('Mreža valjka, površina valjka');

  Q(1, 'Od čega se sastoji mreža valjka?',
    ['dva kruga i jednog pravougaonika', 'dva kruga i jednog kvadrata', 'dva trougla i jednog kruga', 'dva kruga i dva pravougaonika'],
    'Omotač se preseče duž jedne izvodnice i razvije u ravan, pa dobijamo jedan pravougaonik. Osnove ostaju dva kruga.', 'mreža',
    { mediji: mrezaValjka(3, 8) });

  Q(1, 'Jedna stranica pravougaonika u mreži valjka je visina valjka, 9 cm. Kolika je druga stranica ako je poluprečnik osnove 1,5 cm?',
    ['3π cm', '9π cm', '4,5 cm', '18 cm'],
    'Druga stranica je obim osnove: $2rπ = 2 · 1,5 · π = 3π$ cm. Krug se pri odmotavanju pretvara u duž.', 'obim',
    { mediji: mrezaValjka(1.5, 9) });

  Q(1, 'Kako se zove deo valjka koji se odmotava u pravougaonik?',
    ['omotač', 'osnova', 'osna linija', 'gornja ivica'],
    'Kad se omotač preseče i razvije u ravan, njegova površina postaje pravougaonik čija je jedna stranica visina valjka.', 'omotač',
    { mediji: valjak(3, 6, [], {}) });

  Q(1, 'Koliki je obim osnove valjka poluprečnika 5 cm?',
    ['10π cm', '5π cm', '25π cm', '20π cm'],
    'Obim kruga je $2rπ$, pa je za $r = 5$ cm obim $10π$ cm.', 'obim',
    { mediji: valjak(5, 8, [{ d: 'OB', b: 1, debljina: 3, o: 'r = 5 cm' }], { imena: true, bezImena: ['O₁', 'A', 'A₁', 'B₁'] }) });

  Q(2, 'Poluprečnik osnove valjka je 2 cm. Kolika je druga stranica pravougaonika u njegovoj mreži, ako je visina 5 cm?',
    ['4π cm', '2π cm', '8 cm', '4 cm'],
    'Druga stranica je obim osnove, $2 · 2 · π = 4π$ cm. Visina 5 cm je prva stranica.', 'stranica',
    { mediji: mrezaValjka(2, 5) });

  Q(2, 'Površina valjka poluprečnika 3 cm i visine 5 cm je:',
    ['48π cm²', '45π cm²', '30π cm²', '24π cm²'],
    'Površina valjka je zbir dve osnove i omotača: $2 · 9π + 2 · 3 · 5 · π = 18π + 30π = 48π$ cm². Ako zaboravimo osnove, dobijemo samo omotač od 30π cm².', 'površina',
    { mediji: valjak(3, 5, [{ d: 'OB', b: 1, debljina: 3, o: 'r = 3 cm' }], { imena: true, bezImena: ['O₁', 'A', 'A₁', 'B₁'] }) });

  Q(2, 'Valjak poluprečnika 2 cm i visine 6 cm ima omotač površine:',
    ['24π cm²', '12π cm²', '16π cm²', '8π cm²'],
    'Površina omotača je $2rπ · H = 2 · 2 · π · 6 = 24π$ cm². Omotač se odmotava u pravougaonik, pa je njegova površina proizvod obima osnove i visine.', 'omotač',
    { mediji: valjak(2, 6, [], {}),
      medijiOdgovora: A('mreza-valjka', 'Omotač valjka razvija se u pravougaonik širine 2rπ i visine H') });

  Q(2, 'Valjak poluprečnika 2 cm i visine 6 cm: koliki je odnos površine omotača prema površini jedne osnove?',
    ['6 : 1', '1 : 6', '3 : 1', '4 : 1'],
    'Omotač je $2rπ · H = 24π$, a osnova $r²π = 4π$. Odnos je $24π : 4π = 6 : 1$.', 'odnos',
    { mediji: valjak(2, 6, [], {}) });

  Q(3, 'Obim osnove valjka je 12π cm, a visina 5 cm. Kolika je površina valjka?',
    ['132π cm²', '60π cm²', '72π cm²', '120π cm²'],
    'Iz $2rπ = 12π$ sledi $r = 6$ cm. Površina je $2π · 6 · (6 + 5) = 132π$ cm².', 'obim',
    { mediji: mrezaValjka(6, 5) });

  Q(2, 'Izvodnica valjka je 5 cm, a površina omotača 60π cm². Koliki je poluprečnik osnove?',
    ['6 cm', '3 cm', '12 cm', '30 cm'],
    'Površina omotača je $2rπ · 5 = 60π$, pa je $10r = 60$ i $r = 6$ cm.', 'omotač',
    { mediji: valjak(6, 5, [], {}) });

  Q(2, 'Površina jedne osnove valjka je 16π cm². Kolika je površina obe osnove zajedno?',
    ['32π cm²', '16π cm²', '8π cm²', '64π cm²'],
    'Obe osnove zajedno imaju površinu $2 · 16π = 32π$ cm². To je prvi deo površine valjka.', 'osnove',
    { mediji: valjak(4, 6, [], {}) });

  Q(3, 'Valjak ima visinu jednaku prečniku osnove. Kolika je površina omotača prema zbiru površina osnova?',
    ['2 : 1', '1 : 1', '4 : 1', '1 : 2'],
    'Za $H = 2r$ omotač je $2rπ · 2r = 4r²π$, a zbir osnova $2r²π$. Odnos je $4 : 2 = 2 : 1$.', 'odnos',
    { mediji: valjak(3, 6, [], {}) });

  Q(3, 'Valjak poluprečnika 6 cm i visine 2 cm ima površinu:',
    ['96π cm²', '60π cm²', '72π cm²', '120π cm²'],
    'Površina je $2 · 6 · π (6 + 2) = 96π$ cm².', 'valjak',
    { mediji: valjak(6, 2, [], {}) });

  Q(3, 'Površina valjka je 30π cm², a poluprečnik osnove 3 cm. Kolika je visina?',
    ['2 cm', '3 cm', '5 cm', '6 cm'],
    'Iz $2 · 3π (3 + H) = 30π$ sledi $3 + H = 5$, pa je $H = 2$ cm.', 'visina',
    { mediji: valjak(3, 2, [], {}) });

  Q(3, 'Površina omotača valjka jednaka je zbiru površina dve osnove. Kolika je visina ako je poluprečnik r?',
    ['H = r', 'H = 2r', 'H = πr', 'H = r/2'],
    'Omotač $2rπ · H$ jednak je $2 · r²π$, pa je $H = r$. Visina je jednaka poluprečniku.', 'jednako',
    { mediji: valjak(3, 3, [], {}) });

  S(2, 'Spoji deo mreže valjka i odgovarajuću stranicu ili površinu.',
    [['omotač valjka', 'pravougaonik u mreži'], ['osnova valjka', 'krug u mreži'], ['visina valjka', 'jedna stranica pravougaonika'], ['obim osnove', 'druga stranica pravougaonika']],
    'Mreža valjka je jedan pravougaonik i dva kruga. Jedna stranica pravougaonika je visina, a druga obim osnove.', 'mreža',
    { mediji: mrezaValjka(2, 5) });

  U(1, 'Koji oblik NE pripada mreži valjka?',
    ['kružni isečak', 'pravougaonik (omotač)', 'krug (osnova)', 'krug (druga osnova)'],
    'Mreža valjka sadrži pravougaonik i dva kruga. Kružni isečak je deo mreže kupe, a ne valjka.', 'Omotač kupe odmotava se u kružni isečak, a omotač valjka u pravougaonik.', 'isečak',
    { mediji: mrezaValjka(3, 8) });

  // ════════ 4. Zapremina valjka ════════
  L('Zapremina valjka');

  Q(1, 'Koja formula daje zapreminu valjka, ako je $B$ površina osnove a $H$ visina?',
    ['$V = B · H$', '$V = 2πrH$', '$V = πr^{2}$', '$V = 2πr^{2}$'],
    'Zapremina valjka je površina osnove puta visina. Površina osnove je $πr^{2}$.', 'zapremina',
    { mediji: valjak(3, 5, [], {}) });

  Q(1, 'Valjak ima poluprečnik osnove 2 cm i visinu 5 cm. Kolika je njegova zapremina?',
    ['20π cm³', '10π cm³', '5π cm³', '40π cm³'],
    'Osnova je $B = 4π$ cm², pa je $V = 4π · 5 = 20π$ cm³.', 'osnova',
    { mediji: valjak(2, 5, [], {}) });

  Q(1, 'Ako se visina valjka udvostruči, a poluprečnik ostane isti, zapremina se:',
    ['udvostruči', 'učetvorostruči', 'ne menja', 'prepolovi'],
    'Zapremina je proporcionalna visini, pa dvostruka visina daje dvostruku zapreminu.', 'visina',
    { mediji: valjak(2, 4, [], {}),
      medijiOdgovora: valjak(2, 8, [], {}) });

  Q(2, 'Kad poluprečnik valjka udvostručimo, a visinu ne menjamo, zapremina se:',
    ['učetvorostruči', 'udvostruči', 'osmostruči', 'utrostruči'],
    'Poluprečnik ulazi u zapreminu na kvadrat: $(2r)² = 4r²$, pa je zapremina četiri puta veća.', 'poluprečnik',
    { mediji: valjak(2, 4, [], {}),
      medijiOdgovora: valjak(4, 4, [], {}) });

  Q(2, 'Valjak ima prečnik osnove 8 cm i visinu 3 cm. Kolika je zapremina?',
    ['48π cm³', '24π cm³', '96π cm³', '12π cm³'],
    'Poluprečnik je 4 cm, pa je $V = 16π · 3 = 48π$ cm³. Ako zaboraviš da prečnik treba prepoloviti, dobiješ 192π cm³.', 'prečnik',
    { mediji: valjak(4, 3, [{ d: 'AB', b: 1, debljina: 3, o: 'd = 8 cm' }], { imena: true, bezImena: ['O', 'O₁', 'A₁', 'B₁'] }) });

  Q(2, 'Zapremina valjka je 72π cm³, a poluprečnik osnove 3 cm. Kolika je visina?',
    ['8 cm', '24 cm', '6 cm', '4 cm'],
    'Iz $9π · H = 72π$ sledi $H = 8$ cm. Ako samo podelimo sa 3, dobijemo pogrešnih 24 cm.', 'visina',
    { mediji: valjak(3, 8, [], {}) });

  Q(2, 'Koliko litara stane u valjkastu posudu poluprečnika 10 cm i visine 20 cm, ako je $π ≈ 3$?',
    ['6 l', '60 l', '0,6 l', '600 l'],
    'Zapremina je $π · 10² · 20 = 6000$ cm³, a to je $6$ litara. Podsećanje: $1 l = 1 dm³ = 1000 cm³$.', 'litar',
    { mediji: valjak(10, 20, [{ d: 'OB', b: 1, debljina: 3, o: 'r = 10 cm' }], { imena: true, bezImena: ['O', 'O₁', 'A', 'A₁'] }) });

  Q(3, 'Valjak ima visinu jednaku prečniku osnove. Kolika mu je zapremina, ako je poluprečnik $r$?',
    ['$2πr^{3}$', '$πr^{3}$', '$4πr^{3}$', '$2πr^{2}$'],
    'Za $H = 2r$ zapremina je $πr² · 2r = 2πr³$.', 'valjak',
    { mediji: valjak(3, 6, [{ d: 'OB', b: 1, debljina: 3, o: 'r' }], { imena: true, bezImena: ['A', 'A₁', 'B₁', 'O₁'] }) });

  Q(2, 'Pravougaonik sa stranicama 8 cm i 4 cm obrće se oko duže stranice. Kolika je zapremina valjka?',
    ['128π cm³', '64π cm³', '256π cm³', '32π cm³'],
    'Visina valjka je duža stranica 8 cm, a poluprečnik kraća stranica 4 cm. Zapremina je $16π · 8 = 128π$ cm³.', 'obrtanje',
    { mediji: pravoug(8, 4, '8 cm', '4 cm'),
      medijiOdgovora: valjak(4, 8, [], {}) });

  Q(3, 'Pravougaonik sa stranicama 8 cm i 4 cm obrće se oko kraće stranice. Kolika je zapremina valjka?',
    ['256π cm³', '128π cm³', '512π cm³', '64π cm³'],
    'Visina je kraća stranica 4 cm, a poluprečnik je duža stranica 8 cm. Zapremina je $64π · 4 = 256π$ cm³.', 'obrtanje',
    { mediji: pravoug(8, 4, '8 cm', '4 cm'),
      medijiOdgovora: valjak(8, 4, [], {}) });

  Q(2, 'Koliko puta je veća zapremina valjka prečnika 4 cm od valjka prečnika 2 cm, ako su visine iste?',
    ['4 puta', '2 puta', '8 puta', '16 puta'],
    'Poluprečnik je dvostruko veći, pa je zapremina veća $2² = 4$ puta.', 'puta',
    { mediji: valjak(2, 6, [], {}),
      medijiOdgovora: valjak(1, 6, [], {}) });

  Q(3, 'Valjak poluprečnika 4 cm ima zapreminu 96π cm³. Ako se poluprečnik udvostruči, a visina prepolovi, kolika je nova zapremina?',
    ['192π cm³', '96π cm³', '384π cm³', '48π cm³'],
    'Visina je $96π : (16π) = 6$ cm. Novi valjak ima $r = 8$ cm i $H = 3$ cm, pa je $V = 64π · 3 = 192π$ cm³.', 'zapremina',
    { mediji: valjak(4, 6, [], {}) });

  Q(3, 'Zapremina valjka je 54π cm³, a poluprečnik osnove 3 cm. Kolika je površina omotača?',
    ['36π cm²', '54π cm²', '18π cm²', '72π cm²'],
    'Visina je $54π : 9π = 6$ cm. Omotač je $2 · 3 · π · 6 = 36π$ cm².', 'omotač',
    { mediji: valjak(3, 6, [], {}) });

  Q(2, 'Površina osnove valjka je 25π cm², a visina 4 cm. Kolika je zapremina?',
    ['100π cm³', '50π cm³', '29π cm³', '20π cm³'],
    'Zapremina je $B · H = 25π · 4 = 100π$ cm³.', 'baza',
    { mediji: valjak(5, 4, [], {}) });

  U(2, 'Koji račun NE daje zapreminu valjka?',
    ['$2πrH$', '$πr^{2}H$', '$B · H$', '$π(d/2)^{2}H$'],
    '$2πrH$ je površina omotača, a ne zapremina. Ostala tri računa daju istu zapreminu valjka napisanu na različite načine.', 'Površina se meri u cm², a zapremina u cm³. Ako rezultat ima kubne jedinice, to je zapremina.', 'račun',
    { mediji: valjak(3, 5, [], {}) });

  S(2, 'Spoji promenu dimenzije i kako se menja zapremina valjka.',
    [['dvostruka visina', 'dvostruka zapremina'], ['dvostruki poluprečnik', 'četvorostruka zapremina'], ['površina osnove', 'πr²'], ['zapremina valjka', 'B · H']],
    'Visina ulazi u zapreminu jednom, a poluprečnik dvaput (kroz kvadrat). Zato je promena poluprečnika mnogo osetnija.', 'valjak',
    { mediji: valjak(3, 6, [], {}) });

  // ════════ 5. Kupa: osnovni elementi ════════
  L('Kupa: osnovni elementi');

  Q(1, 'Kakav je oblik osnove kupe?',
    ['krug', 'trougao', 'kvadrat', 'elipsa'],
    'Kupa ima jednu kružnu osnovu. Ona se na crtežu vidi kao izdužen ovalčić, ali je u stvarnosti krug.', 'kupa',
    { mediji: kupa(3, 4, [], {}) });

  Q(1, 'Kako se zove tačka S na vrhu kupe?',
    ['vrh', 'centar osnove', 'teme osnove', 'središte izvodnice'],
    'Vrh kupe je jedina tačka koja nije na osnovi. Sve izvodnice polaze iz nje.', 'vrh',
    { mediji: kupa(3, 4, [], { imena: true, bezImena: [] }) });

  Q(1, 'Koja duž je visina kupe?',
    ['OS', 'AS', 'AB', 'OA'],
    'Visina je duž koja spaja vrh sa centrom osnove i normalna je na osnovu. Izvodnica AS je nagnuta, pa nije visina.', 'visina',
    { mediji: kupa(3, 4, [], { imena: true, bezImena: [] }),
      medijiOdgovora: kupa(3, 4, [{ d: 'OS', b: 1, debljina: 3 }], { imena: true, bezImena: [] }) });

  Q(2, 'Kupa ima poluprečnik osnove 3 cm i visinu 4 cm. Koliko je izvodnica?',
    ['5 cm', '7 cm', '√{7} cm', '1 cm'],
    'Izvodnica je hipotenuza pravouglog trougla sa katetama 3 cm i 4 cm: $s = √{9 + 16} = 5$ cm.', 'izvodnica',
    { mediji: kupa(3, 4, [{ d: 'OS', b: 1, debljina: 2, o: 'H = 4 cm' }, { d: 'OA', b: 1, debljina: 2, o: 'r = 3 cm' }], { imena: true, bezImena: ['K', 'L'] }),
      medijiOdgovora: kupa(3, 4, [{ d: 'SA', b: 1, debljina: 3, o: 's = 5 cm' }], { imena: true, bezImena: ['K', 'L'] }) });

  Q(2, 'Pravougli trougao sa katetama 6 cm i 8 cm obrće se oko veće katete. Kolika je izvodnica dobijene kupe?',
    ['10 cm', '14 cm', '√{28} cm', '2 cm'],
    'Veća kateta je visina kupe (8 cm), a manja poluprečnik (6 cm). Izvodnica je hipotenuza: $√{36 + 64} = 10$ cm.', 'hipotenuza',
    { mediji: pravi(6, 8, { oa: '6 cm', ob: '8 cm', hip: '?' }) });

  Q(2, 'Osni presek kupe je jednakostranični trougao stranice 6 cm. Koliki je poluprečnik osnove?',
    ['3 cm', '6 cm', '3√{3} cm', '1,5 cm'],
    'Osnovica osnog preseka je prečnik osnove, pa je $r = 6 : 2 = 3$ cm. Visina trougla je visina kupe.', 'presek',
    { mediji: G({ A: [-3, 0], B: [3, 0], S: [0, 5.2] }, [{ p: 'ABS', b: 0, gusto: 1 }], { velicina: 240 }) });

  Q(3, 'Osni presek kupe je jednakokraki pravougli trougao čija je hipotenuza 12 cm. Kolika je visina kupe?',
    ['6 cm', '12 cm', '6√{2} cm', '3√{2} cm'],
    'Hipotenuza je prečnik, pa je $r = 6$ cm. Kraci su izvodnice, a kod pravouglog jednakokrakog trougla visina na hipotenuzu je polovina hipotenuze, pa je $H = 6$ cm.', 'pravougli',
    { mediji: kupa(6, 6, [{ p: 'ABS', b: 2, gusto: 1 }, { d: 'AB', b: 1, debljina: 2, o: '12 cm' }], { imena: true, bezImena: ['O', 'K', 'L'] }) });

  Q(2, 'Izvodnica kupe je 13 cm, a poluprečnik osnove 5 cm. Kolika je visina?',
    ['12 cm', '8 cm', '18 cm', '13 cm'],
    'Visina je kateta: $H = √{13² − 5²} = √{144} = 12$ cm.', 'katete',
    { mediji: kupa(5, 12, [{ d: 'SA', b: 1, debljina: 3, o: 's = 13 cm' }, { d: 'OA', b: 1, debljina: 2, o: 'r = 5 cm' }], { imena: true, bezImena: ['K', 'L'] }) });

  Q(2, 'Izvodnica kupe je 17 cm, a poluprečnik osnove 8 cm. Kolika je visina?',
    ['15 cm', '9 cm', '25 cm', '21 cm'],
    'Visina je $H = √{17² − 8²} = √{225} = 15$ cm.', 'visina',
    { mediji: kupa(8, 15, [{ d: 'SA', b: 1, debljina: 2, o: 's = 17 cm' }], { imena: true, bezImena: ['K', 'L'] }) });

  Q(1, 'Koliko osnova ima kupa sa crteža?',
    ['jednu', 'dve', 'nijednu', 'tri'],
    'Kupa ima jednu osnovu (krug) i vrh. Dve osnove ima valjak.', 'osnova',
    { mediji: kupa(3, 4, [], {}) });

  Q(1, 'Koja figura nastaje obrtanjem pravouglog trougla oko katete?',
    ['kupa', 'valjak', 'lopta', 'kocka'],
    'Hipotenuza pri obrtanju opisuje omotač kupe, a kateta koja ostaje na osi je visina kupe.', 'katete',
    { mediji: pravi(3, 4, { oa: '3 cm', ob: '4 cm' }),
      medijiOdgovora: kupa(3, 4, [], {}) });

  Q(2, 'Pravougli trougao se obrće oko hipotenuze. Koje telo nastaje?',
    ['dve kupe sa zajedničkom osnovom', 'jedna kupa', 'valjak', 'lopta'],
    'Pri obrtanju oko hipotenuze dve katete opisuju dve kupe sa zajedničkom osnovom, koja je krug nad visinom trougla na hipotenuzu.', 'omotač',
    { mediji: G({ A: [-3, 0], B: [3, 0], C: [0, 4] }, [{ p: 'ABC', b: 0 }, { d: 'AB', b: 1, debljina: 2, o: '6 cm' }], { velicina: 240 }) });

  Q(3, 'Izvodnica kupe dugačka je 8 cm i sa ravni osnove zaklapa ugao 60°. Koliki je poluprečnik osnove?',
    ['4 cm', '4√{3} cm', '8 cm', '2 cm'],
    'Trougao $SOA$ ima prav ugao kod $O$ i ugao od 60° kod $A$ – to je polovina jednakostraničnog trougla stranice 8 cm. Poluprečnik leži naspram ugla od 30°, pa je pola izvodnice: $r = 4$ cm.', 'ugao',
    { mediji: G({ O: [0, 0], A: [4, 0], S: [0, 6.93] }, [{ p: 'OAS', b: 0 }, { pu: 'AOS' }, { u: 'SAO', o: '60°' }, { d: 'AS', o: '8 cm' }], { velicina: 240 }) });

  U(1, 'Koja tvrdnja o kupi NIJE tačna?',
    ['ima dve osnove', 'ima vrh', 'ima izvodnice', 'ima osnovu u obliku kruga'],
    'Kupa ima jednu osnovu (krug) i vrh. Dve osnove ima valjak.', 'Kupa stoji na jednoj osnovi, a vrh je jedina tačka koja nije na njoj.', 'osnova',
    { mediji: kupa(3, 4, [], { imena: true, bezImena: [] }) });

  S(2, 'Spoji pojam za kupu i njegovo značenje.',
    [['visina kupe', 'duž od vrha do centra osnove'], ['izvodnica kupe', 'duž od vrha do ruba osnove'], ['poluprečnik osnove', 'duž od centra do ruba'], ['osa kupe', 'prava kroz vrh i centar osnove']],
    'Kupa ima jedan vrh, pa sve izvodnice polaze iz jedne tačke. Osa spaja vrh i centar osnove.', 'kupa',
    { mediji: kupa(3, 4, [], { imena: true, bezImena: [] }) });

  Q(3, 'Pravougli trougao sa katetama 9 cm i 12 cm obrće se oko katete 9 cm. Kolika je izvodnica dobijene kupe?',
    ['15 cm', '21 cm', '12 cm', '√{63} cm'],
    'Kupa ima visinu 9 cm i poluprečnik 12 cm, pa je izvodnica $√{81 + 144} = √{225} = 15$ cm. Trojka 9, 12, 15 je poznata Pitagorina trojka.', 'Pitagora',
    { mediji: pravi(12, 9, { oa: '12 cm', ob: '9 cm' }) });

  Q(2, 'Koja tvrdnja o izvodnicama kupe je tačna?',
    ['sve su jednake', 'uvek su kraće od visine', 'uvek su jednake visini', 'jedna je duža od ostalih'],
    'Sve izvodnice su jednako udaljene od vrha i od ruba osnove, pa su jednake. Izvodnica je hipotenuza, pa je uvek duža od visine.', 'jednake',
    { mediji: kupa(3, 4, [{ d: 'SM', b: 2, debljina: 2.5 }], { imena: true, bezImena: ['K', 'L'], T3: { M: [3 * Math.cos(1.75), 3 * Math.sin(1.75), 0] } }) });

  // ════════ 6. Ravni preseci kupe ════════
  L('Ravni preseci kupe');

  Q(1, 'Ravan je paralelna osnovi kupe i seče je. Kakav je presek?',
    ['krug', 'pravougaonik', 'elipsa', 'trougao'],
    'Presek paralelan osnovi je krug manji od osnove, a što je ravan bliža vrhu, to je manji. Na crtežu se vidi kao elipsa, jer je iskošen.', 'krug',
    { mediji: kupa(4, 6, vodoravna(3, 6)),
      medijiOdgovora: kupa(4, 6, [...elipsa3([0, 0, 3], 2, { cela: 1, pun: 1, gusto: 1, b: 2 })], { imena: true, bezImena: ['K', 'L'] }) });

  Q(1, 'Ravan prolazi kroz osu kupe. Kakav je osni presek?',
    ['jednakokraki trougao', 'pravougaonik', 'krug', 'pravougli trougao'],
    'Osni presek kupe je jednakokraki trougao: osnovica je prečnik osnove, a kraci su izvodnice.', 'osni',
    { mediji: kupa(4, 6, [], { imena: true, bezImena: ['K', 'L'] }),
      medijiOdgovora: kupa(4, 6, [{ lin3: [p3(-4, 0, 0), p3(4, 0, 0), p3(0, 0, 6)], zatv: 1, b: 2, gusto: 1 }], { imena: true, bezImena: ['K', 'L'] }) });

  Q(2, 'Ravan paralelna osnovi seče kupu poluprečnika 6 cm i visine 8 cm na polovini visine. Koliki je poluprečnik preseka?',
    ['3 cm', '4 cm', '6 cm', '2 cm'],
    'Presek na visini $h$ od osnove ima poluprečnik $r(H − h) : H = 6 · 4 : 8 = 3$ cm.', 'polovina',
    { mediji: kupa(6, 8, vodoravna(4, 7)),
      medijiOdgovora: kupa(6, 8, [...elipsa3([0, 0, 4], 3, { cela: 1, pun: 1, gusto: 1, b: 2 })], { imena: true, bezImena: ['K', 'L'] }) });

  Q(2, 'Osni presek kupe ima osnovicu 10 cm i visinu 9 cm. Kolika mu je površina?',
    ['45 cm²', '90 cm²', '36 cm²', '20 cm²'],
    'Površina osnog preseka je $(10 · 9) : 2 = 45$ cm². Osnovica je prečnik osnove, a visina je visina kupe.', 'osni',
    { mediji: kupa(5, 9, [{ p: 'ABS', b: 2, gusto: 1 }, { d: 'OS', b: 1, debljina: 2, o: '9 cm' }], { imena: true, bezImena: ['O', 'K', 'L'] }) });

  Q(2, 'Ravan prolazi kroz vrh kupe i tetivu osnove. Kakav je presek?',
    ['jednakokraki trougao', 'krug', 'elipsa', 'pravougaonik'],
    'Presek je trougao sa vrhom u S. Kraci su dve izvodnice, pa je jednakokraki.', 'tetiva',
    { mediji: kupa(5, 3, [{ d: 'PQ', b: 2, debljina: 3 }], { imena: true, bezImena: ['K', 'L', 'O', 'A', 'B'], T3: { P: p3(-3, 4, 0), Q: p3(3, 4, 0) } }),
      medijiOdgovora: kupa(5, 3, [{ p: 'SPQ', b: 2, gusto: 1 }], { imena: true, bezImena: ['K', 'L', 'O', 'A', 'B'], T3: { P: p3(-3, 4, 0), Q: p3(3, 4, 0) } }) });

  Q(3, 'Kupa ima poluprečnik 5 cm i visinu 3 cm. Ravan kroz vrh i tetivu dužine 6 cm u osnovi (tetiva je na rastojanju 4 cm od centra) seče kupu. Kolika je površina tog preseka?',
    ['15 cm²', '12 cm²', '18 cm²', '30 cm²'],
    'Visina trougla iz vrha do tetive je $√{3² + 4²} = 5$ cm, pa je površina $(6 · 5) : 2 = 15$ cm².', 'površina',
    { mediji: kupa(5, 3, [{ p: 'SPQ', b: 2, gusto: 1 }, { d: 'PQ', b: 1, debljina: 2, o: '6 cm' }], { imena: true, bezImena: ['K', 'L', 'O', 'A', 'B'], T3: { P: p3(-3, 4, 0), Q: p3(3, 4, 0) } }) });

  U(2, 'Koji presek kupe NE može da nastane ravninom?',
    ['pravougaonik', 'krug', 'trougao', 'elipsa'],
    'Ravan kroz osu daje trougao, paralelna osnovi krug, koso elipsu, a paralelna osi hiperbolu. Pravougaonik kupa ne daje, jer nema ravne bočne strane.', 'Ravan paralelna osi kupe daje krivu liniju hiperbolu, koju učenici upoznaju kasnije kao granu grafika.', 'kupa',
    { mediji: kupa(4, 6, [], {}) });

  Q(2, 'Ravan dodiruje kupu duž jedne izvodnice. Šta je presek?',
    ['jedna izvodnica (duž)', 'krug', 'trougao', 'tačka'],
    'Ravan koja dodiruje kupu sadrži vrh i jednu izvodnicu, pa je presek duž te izvodnice.', 'dodir',
    { mediji: kupa(4, 6, [{ lin3: [p3(4, -3, 0), p3(4, 3, 0), p3(0, 3, 6), p3(0, -3, 6)], zatv: 1, b: 4, gusto: 1 }], { imena: true, bezImena: ['K', 'L'] }) });

  Q(1, 'Ravan je paralelna osnovi kupe i prolazi kroz vrh. Šta je presek?',
    ['samo vrh (tačka)', 'krug', 'trougao', 'prazan skup'],
    'Ravan kroz vrh paralelna osnovi dodiruje kupu samo u vrhu, pa je presek tačka.', 'vrh',
    { mediji: kupa(4, 6, vodoravna(6, 6)) });

  Q(1, 'Ravan je paralelna osnovi kupe i nalazi se iznad vrha. Kakav je presek?',
    ['prazan skup', 'tačka', 'krug', 'trougao'],
    'Ravan iznad vrha ne dodiruje kupu, pa je presek prazan skup.', 'iznad',
    { mediji: kupa(4, 6, vodoravna(9, 6)) });

  Q(2, 'Osni presek kupe je površine 24 cm², a visina kupe je 8 cm. Koliki je poluprečnik osnove?',
    ['3 cm', '6 cm', '12 cm', '8 cm'],
    'Površina osnog preseka je $rH$, pa je $r · 8 = 24$ i $r = 3$ cm.', 'površina',
    { mediji: kupa(3, 8, [{ d: 'OS', b: 1, debljina: 2, o: 'H = 8 cm' }], { imena: true, bezImena: ['K', 'L'] }) });

  Q(3, 'Kupa ima poluprečnik osnove 6 cm i visinu 9 cm. Ravan je paralelna osnovi na visini 3 cm iznad osnove. Koliki je poluprečnik preseka?',
    ['4 cm', '2 cm', '3 cm', '6 cm'],
    'Poluprečnik preseka je $r(H − h) : H = 6 · 6 : 9 = 4$ cm, gde je $h = 3$ cm visina ravni iznad osnove.', 'poluprečnik',
    { mediji: kupa(6, 9, vodoravna(3, 7)) });

  Q(3, 'Kupa ima poluprečnik osnove 4 cm i visinu 8 cm. Ravan paralelna osnovi prolazi na visini 6 cm iznad osnove. Kolika je površina preseka?',
    ['π cm²', '2π cm²', '4π cm²', '8π cm²'],
    'Poluprečnik preseka je $4 · (8 − 6) : 8 = 1$ cm, pa je površina $π$ cm².', 'presek',
    { mediji: kupa(4, 8, vodoravna(6, 6)) });

  S(2, 'Spoji presek kupe i vrstu ravni.',
    [['presek paralelan osnovi', 'krug'], ['osni presek', 'jednakokraki trougao'], ['ravan kroz vrh i tetivu', 'trougao'], ['ravan iznad vrha', 'prazan skup']],
    'Presek kroz osu i presek kroz vrh su uvek trouglovi, a paralelni osnovi uvek su krugovi.', 'presek',
    { mediji: kupa(4, 6, [], {}) });

  Q(2, 'Osni presek kupe je jednakokraki trougao osnovice 12 cm i kraka 10 cm. Kolika je visina kupe?',
    ['8 cm', '6 cm', '√{88} cm', '10 cm'],
    'Osnovica je prečnik osnove, pa je $r = 6$ cm. Krak je izvodnica, pa je $H = √{10² − 6²} = √{64} = 8$ cm.', 'osnovica',
    { mediji: kupa(6, 8, [{ p: 'ABS', b: 2, gusto: 1 }, { d: 'AB', b: 1, debljina: 2, o: '12 cm' }, { d: 'AS', b: 1, debljina: 2, o: '10 cm' }], { imena: true, bezImena: ['O', 'K', 'L'] }) });

  Q(2, 'Kupa ima poluprečnik osnove 4 cm i visinu 6 cm. Ravan paralelna osnovi prolazi na visini 3 cm iznad osnove. Koliki je poluprečnik preseka?',
    ['2 cm', '3 cm', '4 cm', '1 cm'],
    'Poluprečnik preseka je $r(H − h) : H = 4 · 3 : 6 = 2$ cm.', 'sredina',
    { mediji: kupa(4, 6, vodoravna(3, 5)) });

  // ════════ 7. Mreža kupe, površina kupe ════════
  L('Mreža kupe, površina kupe');

  Q(1, 'Od čega se sastoji mreža kupe?',
    ['kružnog isečka i kruga', 'dva kruga i pravougaonika', 'pravougaonika i trougla', 'dva trougla i kruga'],
    'Omotač kupe se odmotava u kružni isečak, a osnova ostaje krug.', 'isečak',
    { mediji: mrezaKupe(3, 5) });

  Q(1, 'Koji deo kupe se u mreži vidi kao kružni isečak?',
    ['omotač', 'osnova', 'osna linija', 'vrh'],
    'Kad se omotač kupe odmota, dobija se kružni isečak čiji je poluprečnik izvodnica kupe.', 'omotač',
    { mediji: kupa(3, 4, [], {}),
      medijiOdgovora: mrezaKupe(3, 5) });

  Q(1, 'Izvodnica kupe je 10 cm. Koliki je poluprečnik kružnog isečka u mreži?',
    ['10 cm', '5 cm', '20 cm', '10π cm'],
    'Poluprečnik isečka u mreži jednak je izvodnici kupe, a to je 10 cm.', 'isečak',
    { mediji: mrezaKupe(4, 10) });

  Q(2, 'Kružni isečak mreže kupe ima poluprečnik 5 cm, a poluprečnik osnove kupe je 3 cm. Koliki je centralni ugao isečka?',
    ['216°', '120°', '60°', '144°'],
    'Ugao isečka je $360° · r : s = 360° · 3 : 5 = 216°$.', 'ugao',
    { mediji: mrezaKupe(3, 5) });

  Q(2, 'Kupa ima poluprečnik osnove 3 cm i izvodnicu 5 cm. Kolika je površina omotača?',
    ['15π cm²', '9π cm²', '24π cm²', '30π cm²'],
    'Površina omotača je $π · r · s = π · 3 · 5 = 15π$ cm².', 'omotač',
    { mediji: kupa(3, 4, [{ d: 'SA', b: 1, debljina: 2, o: 's = 5 cm' }], { imena: true, bezImena: ['K', 'L'] }) });

  Q(3, 'Kupa ima poluprečnik osnove 3 cm i izvodnicu 5 cm. Kolika je površina cele kupe?',
    ['24π cm²', '21π cm²', '33π cm²', '12π cm²'],
    'Površina kupe je $πr(r + s) = 3π · 8 = 24π$ cm². Osnova je $9π$, omotač $15π$.', 'površina',
    { mediji: kupa(3, 4, [], {}) });

  Q(2, 'Koja formula daje površinu kupe, ako je $s$ izvodnica?',
    ['$P = πr(r + s)$', '$P = πr(r + H)$', '$P = 2πr(r + s)$', '$P = πr^{2} + 2πrs$'],
    'Površina kupe je osnova $πr²$ plus omotač $πrs$, što je $πr(r + s)$. Visina $H$ nije u formuli.', 'formula',
    { mediji: kupa(3, 4, [], {}) });

  Q(2, 'Omotač kupe u razvijenom obliku je polukrug, a izvodnica je 6 cm. Koliki je poluprečnik osnove?',
    ['3 cm', '6 cm', '12 cm', '1,5 cm'],
    'Ugao isečka je 180°, pa je $r = s · 180° : 360° = 6 · 1 : 2 = 3$ cm.', 'polukrug',
    { mediji: mrezaKupe(3, 6) });

  Q(3, 'Omotač kupe u razvijenom obliku je kružni isečak sa uglom 120°, a izvodnica je 6 cm. Koliki je poluprečnik osnove?',
    ['2 cm', '3 cm', '4 cm', '1 cm'],
    'Iz $120° · s : 360° = r$ sledi $r = 6 · 120 : 360 = 2$ cm.', 'razvijen',
    { mediji: mrezaKupe(2, 6) });

  Q(3, 'Kružni isečak mreže kupe ima ugao 90°, a poluprečnik 12 cm. Kolika je površina cele kupe?',
    ['45π cm²', '36π cm²', '27π cm²', '60π cm²'],
    'Poluprečnik osnove je $r = 12 · 90 : 360 = 3$ cm, pa je $P = π · 3 · (3 + 12) = 45π$ cm².', 'četvrtina',
    { mediji: mrezaKupe(3, 12) });

  Q(3, 'Površina osnove kupe je 36π cm², a izvodnica 10 cm. Kolika je površina cele kupe?',
    ['96π cm²', '60π cm²', '156π cm²', '132π cm²'],
    'Iz $r²π = 36π$ sledi $r = 6$ cm. Omotač je $π · 6 · 10 = 60π$, pa je površina $36π + 60π = 96π$ cm².', 'zbir',
    { mediji: kupa(6, 8, [{ d: 'SA', b: 1, debljina: 2, o: 's = 10 cm' }], { imena: true, bezImena: ['K', 'L'] }) });

  Q(3, 'Površina kupe je 96π cm², a poluprečnik osnove 6 cm. Kolika je izvodnica?',
    ['10 cm', '12 cm', '16 cm', '8 cm'],
    'Iz $π · 6 · (6 + s) = 96π$ sledi $6 + s = 16$, pa je $s = 10$ cm.', 'izvodnica',
    { mediji: kupa(6, 8, [{ d: 'OA', b: 1, debljina: 3, o: 'r = 6 cm' }], { imena: true, bezImena: ['K', 'L'] }) });

  Q(1, 'Kolika je površina osnove kupe čiji je poluprečnik 3 cm?',
    ['9π cm²', '3π cm²', '6π cm²', '18π cm²'],
    'Površina osnove je $r²π = 9π$ cm².', 'osnova',
    { mediji: kupa(3, 4, [{ d: 'OA', b: 1, debljina: 3, o: 'r = 3 cm' }], { imena: true, bezImena: ['K', 'L'] }) });

  U(2, 'Koji pojam NIJE deo površine kupe?',
    ['osni presek', 'osnova', 'omotač', 'cela površina'],
    'Osni presek je ravan presek unutar kupe, a ne deo njene površine. Osnova i omotač su deo površine, a cela površina je njihov zbir.', 'Ako kupu presečemo po osi, dobijemo dva jednaka dela. Taj presek je unutrašnjost, a ne deo površine.', 'presek',
    { mediji: kupa(3, 4, [], {}) });

  S(2, 'Spoji deo mreže kupe i odgovarajuću veličinu.',
    [['omotač kupe', 'kružni isečak'], ['osnova kupe', 'krug'], ['ugao isečka', '360° · r : s'], ['poluprečnik isečka', 'izvodnica']],
    'Poluprečnik isečka je uvek izvodnica, a ugao isečka zavisi od odnosa r i s.', 'mreža',
    { mediji: mrezaKupe(3, 5) });

  Q(2, 'Izvodnica kupe je dvostruko veća od poluprečnika osnove. Koliki je ugao isečka u mreži?',
    ['180°', '90°', '120°', '360°'],
    'Ugao je $360° · r : s = 360° : 2 = 180°$, pa je isečak polukrug.', 'izvodnica',
    { mediji: mrezaKupe(2, 4) });

  // ════════ 8. Zapremina kupe ════════
  L('Zapremina kupe');

  Q(1, 'Koja formula daje zapreminu kupe, ako je $B$ površina osnove a $H$ visina?',
    ['$\\frac{1}{3} B · H$', '$B · H$', '$\\frac{1}{3} · 2πrH$', '$\\frac{1}{2} B · H$'],
    'Kupa je trećina valjka iste osnove i visine, pa je $V = \\frac{1}{3} B · H$.', 'trećina',
    { mediji: kupa(3, 4, [], {}) });

  Q(1, 'Kupa i valjak imaju istu osnovu i istu visinu. Kolika je zapremina kupe u odnosu na valjak?',
    ['trećina valjka', 'polovina valjka', 'ista kao valjak', 'dvostruko veća'],
    'Zapremina kupe je trećina zapremine valjka iste osnove i visine.', 'valjak',
    { mediji: kupa(3, 4, [], {}),
      medijiOdgovora: A('kupa-valjak', 'Tri kupe iste osnove i visine napune valjak, zato je zapremina kupe trećina') });

  Q(2, 'Kupa ima poluprečnik osnove 3 cm i visinu 4 cm. Kolika je zapremina?',
    ['12π cm³', '36π cm³', '4π cm³', '9π cm³'],
    'Zapremina je $\\frac{1}{3} · 9π · 4 = 12π$ cm³.', 'zapremina',
    { mediji: kupa(3, 4, [{ d: 'OS', b: 1, debljina: 2, o: 'H = 4 cm' }, { d: 'OA', b: 1, debljina: 2, o: 'r = 3 cm' }], { imena: true, bezImena: ['K', 'L'] }) });

  Q(3, 'Zapremina kupe je 96π cm³, a poluprečnik osnove 6 cm. Kolika je visina?',
    ['8 cm', '24 cm', '4 cm', '16 cm'],
    'Iz $\\frac{1}{3} · 36π · H = 96π$ sledi $12H = 96$, pa je $H = 8$ cm.', 'visina',
    { mediji: kupa(6, 8, [], { imena: true, bezImena: ['K', 'L'] }) });

  Q(2, 'Kupa ima prečnik osnove 10 cm i visinu 12 cm. Kolika je zapremina?',
    ['100π cm³', '300π cm³', '60π cm³', '120π cm³'],
    'Poluprečnik je 5 cm, pa je $V = \\frac{1}{3} · 25π · 12 = 100π$ cm³.', 'prečnik',
    { mediji: kupa(5, 12, [{ d: 'AB', b: 1, debljina: 2, o: 'd = 10 cm' }], { imena: true, bezImena: ['K', 'L'] }) });

  Q(2, 'Pravougli trougao sa katetama 3 cm i 4 cm obrće se oko katete 4 cm. Kolika je zapremina dobijene kupe?',
    ['12π cm³', '16π cm³', '4π cm³', '9π cm³'],
    'Visina je 4 cm, a poluprečnik 3 cm. Zapremina je $\\frac{1}{3} · 9π · 4 = 12π$ cm³. Oko katete 3 cm dobila bi se kupa sa $V = 16π$ cm³.', 'obrtanje',
    { mediji: pravi(3, 4, { oa: '3 cm', ob: '4 cm' }),
      medijiOdgovora: kupa(3, 4, [], {}) });

  Q(3, 'Zapremina kupe je 12π cm³, a poluprečnik osnove 2 cm. Kolika je visina?',
    ['9 cm', '6 cm', '3 cm', '4,5 cm'],
    'Iz $\\frac{1}{3} · 4π · H = 12π$ sledi $\\frac{4}{3} H = 12$, pa je $H = 9$ cm.', 'trougao',
    { mediji: kupa(2, 9, [], { imena: true, bezImena: ['K', 'L'] }) });

  Q(3, 'Jednakostranični trougao stranice 12 cm obrće se oko svoje ose simetrije. Kolika je zapremina kupe?',
    ['$72√{3}π$ cm³', '$36√{3}π$ cm³', '$24√{3}π$ cm³', '$216π$ cm³'],
    'Poluprečnik je $r = 6$ cm, a visina $H = 6√{3}$ cm. Zapremina je $\\frac{1}{3} · 36π · 6√{3} = 72√{3}π$ cm³.', 'osnovica',
    { mediji: G({ O: [0, 0], A: [-6, 0], B: [6, 0], S: [0, 10.39] }, [{ p: 'ABS', b: 0 }, { d: 'OS', b: 1, isp: 1, debljina: 2 }, { d: 'AB', o: '12 cm' }], { velicina: 240 }),
      medijiOdgovora: kupa(6, 10.39, [], {}) });

  Q(3, 'Osni presek kupe je jednakostranični trougao stranice 6 cm. Kolika je zapremina kupe?',
    ['$9√{3}π$ cm³', '$18√{3}π$ cm³', '$27π$ cm³', '$3√{3}π$ cm³'],
    'Poluprečnik je $r = 3$ cm, visina $H = 3√{3}$ cm. Zapremina je $\\frac{1}{3} · 9π · 3√{3} = 9√{3}π$ cm³.', 'kupa',
    { mediji: kupa(3, 5.196, [{ p: 'ABS', b: 2, gusto: 1 }], { imena: true, bezImena: ['O', 'K', 'L'] }) });

  Q(2, 'Valjak ima zapreminu 90π cm³. Kupa ima istu osnovu i istu visinu. Kolika je njena zapremina?',
    ['30π cm³', '45π cm³', '60π cm³', '15π cm³'],
    'Zapremina kupe je trećina zapremine valjka: $90π : 3 = 30π$ cm³.', 'trećina',
    { mediji: kupa(3, 4, [], {}) });

  Q(2, 'Koliko puta je zapremina valjka veća od zapremine kupe iste osnove i iste visine?',
    ['3 puta', '2 puta', '4 puta', '1,5 puta'],
    'Kupa je trećina valjka, pa je valjak tri puta veći.', 'puta',
    { mediji: kupa(3, 4, [], {}) });

  Q(1, 'Ako se visina kupe udvostruči, a poluprečnik osnove ostane isti, zapremina se:',
    ['udvostruči', 'učetvorostruči', 'ostane ista', 'prepolovi'],
    'Zapremina je proporcionalna visini, pa se udvostručuje.', 'udvostruči',
    { mediji: kupa(3, 4, [], {}) });

  Q(2, 'Pravougli trougao sa katetama 6 cm i 8 cm obrće se oko veće katete. Kolika je zapremina kupe?',
    ['96π cm³', '48π cm³', '288π cm³', '32π cm³'],
    'Visina je 8 cm, poluprečnik 6 cm. Zapremina je $\\frac{1}{3} · 36π · 8 = 96π$ cm³.', 'obrtanje',
    { mediji: pravi(6, 8, { oa: '6 cm', ob: '8 cm' }) });

  Q(2, 'Zapremina kupe je 100π cm³, a visina 3 cm. Koliki je poluprečnik osnove?',
    ['10 cm', '5 cm', '20 cm', '30 cm'],
    'Iz $\\frac{1}{3} · r²π · 3 = 100π$ sledi $r² = 100$, pa je $r = 10$ cm.', 'osnova',
    { mediji: kupa(10, 3, [], { imena: true, bezImena: ['K', 'L'] }) });

  Q(3, 'Iz valjka poluprečnika 3 cm i visine 6 cm izdubljena je kupa iste osnove i visine. Kolika je zapremina ostatka?',
    ['36π cm³', '18π cm³', '54π cm³', '72π cm³'],
    'Zapremina valjka je $9π · 6 = 54π$ cm³, a kupe $18π$ cm³. Ostatak je $54π − 18π = 36π$ cm³.', 'ostatak',
    { mediji: valjak(3, 6, [], {}) });

  Q(3, 'Kupa ima prečnik osnove 16 cm i visinu 6 cm. Kolika je zapremina?',
    ['128π cm³', '384π cm³', '64π cm³', '96π cm³'],
    'Poluprečnik je 8 cm, pa je $V = \\frac{1}{3} · 64π · 6 = 128π$ cm³.', 'osnova',
    { mediji: kupa(8, 6, [{ d: 'AB', b: 1, debljina: 2, o: 'd = 16 cm' }], { imena: true, bezImena: ['K', 'L'] }) });

  U(2, 'Koja formula NIJE za zapreminu kupe?',
    ['$V = B · H$', '$V = \\frac{1}{3} B · H$', '$V = \\frac{1}{3} πr^{2}H$', '$V = \\frac{πr^{2}H}{3}$'],
    '$B · H$ je zapremina valjka (osnova puta visina). Kupa je trećina toga.', 'Formula sa $\\frac{1}{3}$ daje kupu ili piramidu, a bez trećine dobijamo valjak ili prizmu.', 'valjak',
    { mediji: kupa(3, 4, [], {}) });

  S(2, 'Spoji telo i zapreminu ili pojam.',
    [['zapremina kupe', '$\\frac{1}{3} B · H$'], ['zapremina valjka', '$B · H$'], ['kupa i valjak iste osnove i visine', 'V kupe = V valjka : 3'], ['osnova kupe', '$πr^{2}$']],
    'Kupa je trećina valjka iste osnove i visine. Zato je $\\frac{1}{3}$ u formuli.', 'trećina',
    { mediji: kupa(3, 4, [], {}) });
};
