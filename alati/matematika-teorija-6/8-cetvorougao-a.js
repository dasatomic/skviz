// Lekcije 33–37: četvorougao – osnovni elementi, unutrašnji i spoljašnji uglovi, paralelogram, vrste paralelograma.
// Pitanja su sopstvenim rečima, po gradivu Matematike 6 (Arhiknjiga); crteži su medij „geo“
// (pomoćne funkcije za četvorouglove su u alati/zadaci-6/8-cetvorougao-a.js → crtezi).
const { crtezi } = require('../zadaci-6/8-cetvorougao-a');

module.exports = ({ L, Q, U, S, G, r, krug, proveri }) => {
  const { tacka, sred, presek, presekDuzi, ugao, cetv4, paral, crtice, paralelno, cetv } = crtezi;
  const blizu = (x, y) => Math.abs(x - y) < 0.6;
  const verno = (T, u, opis) => {
    const { A, B, C, D } = T;
    const x = [ugao(D, A, B), ugao(A, B, C), ugao(B, C, D), ugao(C, D, A)];
    proveri(x.every((v, i) => blizu(v, u[i])), 'crtež ' + opis + ': ' + x.map((v) => v.toFixed(1)).join(', '));
  };
  const pravoug = (a, b) => ({ A: [0, 0], B: [a, 0], C: [a, b], D: [0, b] });
  const sveCrtice = (T, n = 1) => [...crtice(T.A, T.B, n), ...crtice(T.B, T.C, n), ...crtice(T.C, T.D, n), ...crtice(T.D, T.A, n)];
  const parStrelice = (T) => [...paralelno(T.A, T.B), ...paralelno(T.D, T.C), ...paralelno(T.A, T.D, 2), ...paralelno(T.B, T.C, 2)];

  const opsti = cetv4(80, 70, 115, { a: 6, d: 3.6 }); // „običan“ konveksan četvorougao
  const strela = { A: [0, 0], B: [3, 1.5], C: [6, 0], D: [3, 4] }; // nekonveksan (udubljen kod B)

  // ══════════ 33. Osnovni elementi četvorougla ══════════
  L('Osnovni elementi četvorougla');
  Q(1, 'Koliko temena ima svaki četvorougao?',
    ['4', '3', '5', '8'],
    'Četvorougao ima isto toliko temena koliko stranica i uglova – po četiri. Temena se obeležavaju velikim slovima redom, obično suprotno od kretanja kazaljke na satu.', 'teme',
    { mediji: cetv(opsti, { e: ['A', 'B', 'C', 'D'].map((n) => ({ tacka: n, b: 3 })) }) });
  Q(1, 'Kako se zove duž koja spaja dva naspramna temena četvorougla (na slici isprekidano)?',
    ['Dijagonala', 'Stranica', 'Visina', 'Simetrala'],
    'Reč dijagonala potiče iz grčkog: „dia“ znači „kroz“, a „gonia“ ugao – duž koja ide „kroz ugao na ugao“. Teniseri kažu da igraju „dijagonalu“ kad loptu šalju iz ugla u suprotni ugao terena.', 'dijagonala',
    { mediji: cetv(opsti, { dijag: 'AC' }) });
  Q(1, 'Koliko dijagonala može da se povuče u četvorouglu $ABCD$?',
    ['2', '4', '1', '3'],
    'Iz svakog temena četvorougla polazi samo jedna dijagonala (ka naspramnom temenu), a svaka se tako broji dvaput: $4 · 1 : 2 = 2$.', 'dijagonala',
    { mediji: cetv(opsti), medijiOdgovora: cetv(opsti, { dijag: true }) });
  Q(1, 'Koje teme četvorougla $ABCD$ je naspramno temenu $A$?',
    ['$C$', '$B$', '$D$', 'Nijedno'],
    'Temena $A$ i $B$, kao i $A$ i $D$, su susedna – krajevi su iste stranice. Teme koje sa $A$ ne deli nijednu stranicu je naspramno.', 'naspramno',
    { mediji: cetv(opsti, { e: [{ tacka: 'A', b: 1 }] }) });
  Q(2, 'Koji par stranica četvorougla $ABCD$ su naspramne stranice?',
    ['$AB$ i $CD$', '$AB$ i $BC$', '$AC$ i $BD$', '$DA$ i $AB$'],
    'Naspramne stranice nemaju zajedničko teme. U četvorouglu postoje tačno dva para naspramnih stranica: $AB$ i $CD$, $BC$ i $DA$.', 'stranica',
    { mediji: cetv(opsti) });
  Q(1, 'Kako zovemo četvorougao kod koga duž između bilo koje dve njegove tačke cela leži u njemu?',
    ['Konveksan', 'Nekonveksan', 'Pravilan', 'Zvezdast'],
    'Konveksan znači „ispupčen“ – nema udubljenja. Kod takvog četvorougla svi unutrašnji uglovi su manji od opruženog.', 'konveksan',
    { mediji: cetv(opsti, { t: { p: [1.4, 0.8], q: [4.6, 2.6], s: [2.2, 2.7], u: [5.3, 0.6] }, e: [{ d: 'pq', b: 2, debljina: 3 }, { d: 'su', b: 3, debljina: 3 }, { tacka: 'pqsu', b: 3 }] }) });
  Q(2, 'Kakav je četvorougao na slici, kod koga deo duži $AC$ izlazi van njega?',
    ['Nekonveksan', 'Konveksan', 'Paralelogram', 'Pravougaonik'],
    'Kod nekonveksnog četvorougla jedan unutrašnji ugao je veći od opruženog (ovde kod temena $B$). Takav oblik podseća na vrh strele.', 'udubljen',
    { mediji: cetv(strela, { e: [{ d: 'AC', b: 1, isp: 1, debljina: 3 }] }) });
  Q(1, 'Šta je obim četvorougla?',
    ['Zbir dužina njegovih stranica', 'Zbir dužina dijagonala', 'Proizvod dve susedne stranice', 'Zbir njegovih uglova'],
    'Obim je dužina „ograde“ oko lika: $O = a + b + c + d$. Kada bi četvorougao bio od žice, obim bi bio dužina ispravljene žice.', 'obim',
    { mediji: cetv(opsti, { stranice: { AB: 'a', BC: 'b', CD: 'c', DA: 'd' } }) });
  proveri(6 + 4 + 5 + 3 === 18, 'obim 18');
  Q(2, 'Koliki je obim četvorougla na slici?',
    ['18 cm', '15 cm', '20 cm', '17 cm'],
    'Kod četvorougla ne postoje dogovorene oznake stranica kao kod trougla, pa se stranice obično zovu po temenima: $AB$, $BC$, $CD$, $DA$.', 'obim',
    { mediji: cetv(opsti, { stranice: { AB: '6 cm', BC: '4 cm', CD: '5 cm', DA: '3 cm' } }) });
  proveri(28 / 4 === 7, '28 : 4');
  Q(2, 'Sve stranice četvorougla su jednake, a obim mu je 28 cm. Kolika je jedna stranica?',
    ['7 cm', '14 cm', '4 cm', '24 cm'],
    'Četvorougao sa četiri jednake stranice ne mora biti kvadrat – to može biti i romb, „nakrivljeni kvadrat“.', 'stranica',
    { mediji: (() => { const T = paral(5, 5, 65); return cetv(T, { e: sveCrtice(T) }); })() });
  Q(2, 'Na koliko trouglova jedna dijagonala deli konveksan četvorougao?',
    ['2', '3', '4', '1'],
    'Zbog toga je zbir uglova četvorougla dva puta veći od zbira uglova trougla: $2 · 180° = 360°$.', 'trougao',
    { mediji: cetv(opsti),
      medijiOdgovora: G(opsti, [{ lin: [opsti.A, opsti.B, opsti.C], zatv: 1, b: 0, gusto: 1 }, { lin: [opsti.A, opsti.C, opsti.D], zatv: 1, b: 2, gusto: 1 }, { d: 'AC', b: 3, crtaj: 1 }], { velicina: 240 }) });
  Q(3, 'Koliko ukupno trouglova možeš da vidiš na slici četvorougla sa obe dijagonale?',
    ['8', '4', '6', '2'],
    'Četiri mala trougla nastaju oko preseka dijagonala, a još četiri velika svaka dijagonala pravi sa stranicama ($ABC$, $ACD$, $ABD$, $BCD$).', 'trougao',
    { mediji: cetv(opsti, { dijag: true }) });
  Q(3, 'Koliko dijagonala nekonveksnog četvorougla leži unutar njega?',
    ['Tačno jedna', 'Obe', 'Nijedna', 'Zavisi od stranica'],
    'Dijagonala iz „udubljenog“ temena ostaje unutra i deli četvorougao na dva trougla. Druga dijagonala prolazi spolja.', 'nekonveksan',
    { mediji: cetv(strela), medijiOdgovora: cetv(strela, { e: [{ d: 'BD', b: 2, debljina: 3, crtaj: 1 }, { d: 'AC', b: 1, isp: 1, debljina: 3 }] }) });
  proveri(10 > 2 + 3 + 4, '10 > 9');
  Q(3, 'Da li postoji četvorougao sa stranicama 2 cm, 3 cm, 4 cm i 10 cm?',
    ['Ne, jer je 10 veće od 2 + 3 + 4', 'Da, ali samo nekonveksan', 'Da, uvek postoji', 'Ne, jer su sve stranice različite'],
    'Najduža stranica mora biti kraća od zbira ostale tri, kao kod nejednakosti trougla. Tri kraće stranice od ukupno 9 cm ne mogu „premostiti“ 10 cm.', 'nejednakost',
    { medijiOdgovora: G({ a: [0, 0], b: [10, 0] }, [{ d: 'ab', b: 1, debljina: 3, o: '10 cm' }, { lin: [[0, 0.6], [2, 0.6]], b: 2, debljina: 4 }, { lin: [[2, 0.6], [5, 0.6]], b: 3, debljina: 4 }, { lin: [[5, 0.6], [9, 0.6]], b: 5, debljina: 4 }, { tx: '2 + 3 + 4 = 9', at: [4.5, 1.4] }], { velicina: 300 }) });
  U(1, 'Koji pojam NIJE element četvorougla?',
    ['Hipotenuza', 'Teme', 'Dijagonala', 'Stranica'],
    'Hipotenuza je najduža stranica pravouglog trougla, naspram pravog ugla. Teme, stranica i dijagonala su elementi četvorougla.',
    'Osnovni elementi četvorougla su stranice i unutrašnji uglovi – od njih zavise i obim, i dijagonale, i površina.', 'element',
    { mediji: cetv(opsti, { dijag: 'BD' }) });
  S(2, 'Spoji pojam sa primerom iz četvorougla $ABCD$:',
    [['Susedna temena', '$A$ i $B$'], ['Naspramna temena', '$A$ i $C$'], ['Susedne stranice', '$AB$ i $BC$'], ['Naspramne stranice', '$AB$ i $CD$']],
    'Susedne stranice imaju zajedničko teme, a naspramne nemaju. Slično, susedna temena su krajevi iste stranice.', 'susedno',
    { mediji: cetv(opsti) });
  Q(2, 'Koji uglovi četvorougla $ABCD$ su susedni uglu $α$ (kod temena $A$)?',
    ['$β$ i $δ$', '$β$ i $γ$', 'Samo $γ$', '$γ$ i $δ$'],
    'Uglovi su susedni kad su im temena susedna. Ugao $γ$ je naspram ugla $α$ – kod paralelograma naspramni uglovi su jednaki.', 'ugao',
    { mediji: cetv(opsti, { uglovi: { A: 'α', B: { o: 'β', b: 2 }, C: { o: 'γ', b: 2 }, D: { o: 'δ', b: 2 } } }) });
  proveri(2 * (3 + 4) === 14, 'obim 14');
  Q(3, 'Dva podudarna pravougla trougla sa katetama 3 cm i 4 cm (hipotenuza 5 cm) složena su duž hipotenuze u pravougaonik. Koliki je obim pravougaonika?',
    ['14 cm', '12 cm', '24 cm', '19 cm'],
    'Hipotenuza je sada unutra – postala je dijagonala, pa ne ulazi u obim. Obim čine samo katete: $3 + 4 + 3 + 4$.', 'kateta',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [4, 3], D: [0, 3] }, [
      { lin: [[0, 0], [4, 0], [4, 3]], zatv: 1, b: 0, gusto: 1 }, { lin: [[0, 0], [4, 3], [0, 3]], zatv: 1, b: 2, gusto: 1 },
      { d: 'AB', o: '4 cm' }, { d: 'BC', o: '3 cm' }, { d: 'AC', o: '5 cm', b: 3 }, { pu: 'ABC' }, { pu: 'CDA' }], { velicina: 220, bezImena: ['A', 'B', 'C', 'D'] }) });

  // ══════════ 34. Unutrašnji uglovi četvorougla ══════════
  L('Unutrašnji uglovi četvorougla');
  Q(1, 'Koliki je zbir unutrašnjih uglova svakog četvorougla?',
    ['360°', '180°', '540°', '720°'],
    'Važi za sve četvorouglove – i krive i nekonveksne. Kod pravougaonika se to odmah vidi: $4 · 90° = 360°$.', 'zbir',
    { mediji: cetv(opsti, { uglovi: { A: 'α', B: 'β', C: 'γ', D: 'δ' } }) });
  Q(1, 'Zašto je zbir uglova četvorougla baš 360°?',
    ['Dijagonala ga deli na dva trougla', 'Ima četiri prava ugla', 'Ima četiri jednake stranice', 'Dijagonale se seku pod 90°'],
    'Dijagonala $AC$ deli uglove kod $A$ i $C$ na po dva dela, a svi delovi zajedno čine uglove dva trougla: $180° + 180° = 360°$.', 'dijagonala',
    { mediji: G(opsti, [{ lin: [opsti.A, opsti.B, opsti.C], zatv: 1, b: 0, gusto: 1 }, { lin: [opsti.A, opsti.C, opsti.D], zatv: 1, b: 2, gusto: 1 }, { d: 'AC', b: 3, crtaj: 1, ponovi: 1 }], { velicina: 240 }) });
  Q(1, 'Tri ugla četvorougla su prava. Koliki je četvrti ugao?',
    ['90°', '180°', '60°', '45°'],
    'Ako četvorougao ima tri prava ugla, ima i četvrti – i to je pravougaonik.', 'prav',
    { mediji: G(pravoug(6, 3.5), [{ p: 'ABCD', b: 0 }, { pu: 'DAB' }, { pu: 'ABC' }, { pu: 'BCD' }, { u: 'CDA', o: '?', b: 3 }], { velicina: 240 }) });
  {
    const T = cetv4(80, 100, 110, { a: 6, d: 3.5 });
    verno(T, [80, 100, 70, 110], '80,100,70,110');
    proveri(360 - 80 - 100 - 70 === 110, 'δ = 110');
    Q(2, 'Koliki je ugao $δ$ četvorougla na slici?',
      ['110°', '100°', '120°', '70°'],
      'Kad su poznata tri ugla četvorougla, četvrti je ono što nedostaje do $360°$: $360° − 250° = 110°$.', 'ugao',
      { mediji: cetv(T, { uglovi: { A: '80°', B: '100°', C: '70°', D: { o: 'δ', b: 3 } } }) });
  }
  {
    const T = cetv4(80, 80, 120, { a: 5.5, d: 4 });
    verno(T, [80, 80, 80, 120], '80×3');
    Q(2, 'Tri ugla četvorougla su po 80°. Koliki je četvrti ugao?',
      ['120°', '80°', '100°', '140°'],
      'Tri ugla od $80°$ zajedno daju $240°$, pa za četvrti ostaje $120°$ – tup ugao.', 'ugao',
      { mediji: cetv(T, { uglovi: { A: '80°', B: '80°', C: '80°', D: { o: '?', b: 3 } } }) });
  }
  Q(2, 'Mogu li sva četiri ugla četvorougla biti oštra?',
    ['Ne – zbir bi bio manji od 360°', 'Da, kod romba', 'Da, kod kvadrata', 'Da, ako su stranice jednake'],
    'Četiri oštra ugla zajedno imaju manje od $4 · 90° = 360°$. Zato svaki četvorougao ima bar jedan ugao koji je prav ili tup.', 'oštar',
    { mediji: cetv(opsti, { uglovi: { A: '?', B: '?', C: '?', D: '?' } }) });
  {
    const T = cetv4(100, 105, 110, { a: 5, d: 3 });
    verno(T, [100, 105, 45, 110], 'tri tupa');
    Q(2, 'Koliko najviše tupih uglova može imati četvorougao?',
      ['3', '2', '4', '1'],
      'Četiri tupa ugla bi zajedno imala više od $360°$. Ali tri mogu: na primer $100°$, $105°$, $110°$ i $45°$.', 'tup',
      { medijiOdgovora: cetv(T, { uglovi: { A: '100°', B: '105°', C: { o: '45°', b: 2 }, D: '110°' } }) });
  }
  {
    const T = cetv4(36, 72, 144, { a: 9, d: 5 });
    verno(T, [36, 72, 108, 144], '1:2:3:4');
    proveri(360 / 10 === 36 && 4 * 36 === 144, '1:2:3:4');
    Q(3, 'Uglovi četvorougla odnose se kao $1 : 2 : 3 : 4$. Koliki je najveći ugao?',
      ['144°', '120°', '160°', '108°'],
      'Ukupno ima $1 + 2 + 3 + 4 = 10$ „delova“, pa je jedan deo $360° : 10 = 36°$. Uglovi su $36°$, $72°$, $108°$ i $144°$.', 'razmera',
      { mediji: cetv(T, { uglovi: { A: 'x', B: '2x', C: '3x', D: '4x' } }) });
  }
  {
    const T = cetv4(100, 80, 90, { a: 6, d: 3.5 });
    verno(T, [100, 80, 90, 90], '100,80,90,90');
    Q(2, 'Dva ugla četvorougla su 100° i 80°, a preostala dva su jednaka. Koliki je svaki od njih?',
      ['90°', '100°', '80°', '180°'],
      'Za dva jednaka ugla ostaje $360° − 180° = 180°$, pa je svaki prav. Takav četvorougao je pravougli trapez.', 'jednak',
      { mediji: cetv(T, { uglovi: { A: '100°', B: '80°', C: 'x', D: 'x' } }) });
  }
  {
    const T = cetv4(75, 85, 105, { a: 6, d: 4 });
    verno(T, [75, 85, 95, 105], 'razlika 10');
    proveri(4 * 75 + 60 === 360, 'x = 75');
    Q(3, 'Svaki ugao četvorougla je za 10° veći od prethodnog. Koliki je najmanji ugao?',
      ['75°', '80°', '70°', '85°'],
      'Uglovi su $x$, $x + 10°$, $x + 20°$ i $x + 30°$, pa je $4x + 60° = 360°$ i $x = 75°$. Ostali su $85°$, $95°$ i $105°$.', 'najmanji',
      { mediji: cetv(T, { uglovi: { A: 'x', B: 'x+10°', C: 'x+20°', D: 'x+30°' } }) });
  }
  Q(1, 'Kako se obeležava unutrašnji ugao $α$ četvorougla $ABCD$ pomoću temena i krakova?',
    ['$∠DAB$', '$∠ABC$', '$∠ACD$', '$∠BAC$'],
    'Teme ugla piše se u sredini, a kraci idu ka susednim temenima. Ugao $BAC$ je samo deo ugla $α$ – drugi krak mu je dijagonala.', 'ugao',
    { mediji: cetv(opsti, { uglovi: { A: 'α' } }) });
  Q(3, 'Da li i nekonveksan četvorougao ima zbir unutrašnjih uglova 360°?',
    ['Da – i on se deli na dva trougla', 'Ne, ima više od 360°', 'Ne, ima manje od 360°', 'Zavisi od dužine stranica'],
    'Dijagonala iz „udubljenog“ temena ostaje unutra i deli ga na dva trougla. Ugao kod tog temena je veći od $180°$, ali zbir svih je opet $360°$.', 'nekonveksan',
    { mediji: G(strela, [{ lin: [strela.A, strela.B, strela.D], zatv: 1, b: 0, gusto: 1 }, { lin: [strela.B, strela.C, strela.D], zatv: 1, b: 2, gusto: 1 }, { d: 'BD', b: 3, crtaj: 1 }], { velicina: 240 }) });
  {
    // dijagonala AC: ∠BAC = 35°, ∠CAD = 25°, ∠BCA = 45°, ∠ACD = 40°
    const A = [0, 0], C = [6, 0];
    const B = presek(A, -35, C, 180 + 45), D = presek(A, 25, C, 180 - 40);
    proveri(blizu(ugao(C, D, A), 115) && 180 - 25 - 40 === 115, 'δ = 115');
    Q(3, 'Dijagonala $AC$ deli uglove kao na slici. Koliki je ugao kod temena $D$?',
      ['115°', '100°', '120°', '95°'],
      'Dovoljno je posmatrati trougao $ACD$: $180° − (25° + 40°) = 115°$. Ugao kod $B$ se dobija iz trougla $ABC$: $100°$.', 'trougao',
      { mediji: G({ A, B, C, D }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1, isp: 1 }, { u: 'BAC', o: '35°', b: 2 }, { u: 'CAD', o: '25°', b: 1 }, { u: 'ACB', o: '45°', b: 2 }, { u: 'DCA', o: '40°', b: 1 }, { u: 'CDA', o: '?', b: 3 }], { velicina: 240 }) });
  }
  U(2, 'Koja četvorka uglova NE može biti uglovi jednog četvorougla?',
    ['100°, 100°, 100°, 100°', '90°, 90°, 90°, 90°', '60°, 120°, 60°, 120°', '50°, 130°, 80°, 100°'],
    'Zbir $4 · 100° = 400°$ je veći od $360°$, pa takav četvorougao ne postoji. Ostale četvorke imaju zbir tačno $360°$.',
    'Četvorougao sa svim jednakim uglovima uvek ima četiri prava ugla – to je pravougaonik (ili kvadrat).', 'zbir');
  S(2, 'Spoji tri poznata ugla četvorougla sa četvrtim uglom:',
    [['90°, 90°, 90°', '90°'], ['100°, 80°, 100°', '80°'], ['120°, 120°, 60°', '60°'], ['70°, 70°, 70°', '150°']],
    'Četvrti ugao je uvek $360°$ minus zbir ostala tri.', 'zbir',
    { mediji: cetv(opsti, { uglovi: { A: 'α', B: 'β', C: 'γ', D: { o: '?', b: 3 } } }) });
  {
    const A = [0, 0], B = [6, 0], C = [6, 3], D = presek(A, 65, C, 180);
    Q(2, 'Četvorougao ima dva prava ugla. Koliki je zbir preostala dva ugla?',
      ['180°', '90°', '270°', '360°'],
      'Dva prava ugla „troše“ $180°$ od ukupnih $360°$. Na slici su ostali uglovi $65°$ i $115°$ – zajedno $180°$.', 'prav',
      { mediji: G({ A, B, C, D }, [{ p: 'ABCD', b: 0 }, { pu: 'ABC' }, { pu: 'BCD' }, { u: 'DAB', o: '?', b: 3 }, { u: 'CDA', o: '?', b: 3 }], { velicina: 240 }) });
  }

  // ══════════ 35. Spoljašnji uglovi četvorougla ══════════
  L('Spoljašnji uglovi četvorougla');
  Q(1, 'Šta je spoljašnji ugao četvorougla?',
    ['Ugao uporedan unutrašnjem uglu', 'Ugao između dve dijagonale', 'Ugao naspram unutrašnjeg', 'Ugao između naspramnih stranica'],
    'Spoljašnji ugao dobijamo kad jednu stranicu produžimo preko temena. On i unutrašnji ugao zajedno čine opružen ugao.', 'spoljašnji',
    { mediji: cetv(opsti, { uglovi: { B: 'β' }, spolja: { B: 'β₁' }, produzi: 0.5 }) });
  Q(1, 'Koliki je zbir unutrašnjeg ugla četvorougla i njemu susednog spoljašnjeg ugla?',
    ['180°', '90°', '360°', '270°'],
    'Ta dva ugla su uporedna: imaju zajednički krak, a druga dva kraka čine pravu. Zato je $α + α_{1} = 180°$.', 'opružen',
    { mediji: cetv(opsti, { uglovi: { A: 'α' }, spolja: { A: 'α₁' }, produzi: 0.6 }) });
  Q(1, 'Koliki je zbir spoljašnjih uglova četvorougla (po jedan kod svakog temena)?',
    ['360°', '180°', '720°', '540°'],
    'Kad bi šetao oko četvorougla i kod svakog temena se okretao za spoljašnji ugao, na kraju bi se okrenuo tačno jednom ukrug – za $360°$.', 'spoljašnji',
    { mediji: cetv(opsti, { spolja: { A: 'α₁', B: 'β₁', C: 'γ₁', D: 'δ₁' }, produzi: 0.4, velicina: 230 }) });
  {
    const T = cetv4(70, 95, 100, { a: 6, d: 4 });
    Q(2, 'Unutrašnji ugao četvorougla je 70°. Koliki je spoljašnji ugao kod istog temena?',
      ['110°', '20°', '290°', '70°'],
      'Spoljašnji ugao je dopuna unutrašnjeg do $180°$. Oštrom unutrašnjem uglu odgovara tup spoljašnji. ($20°$ bi bila dopuna do pravog ugla.)', 'uporedan',
      { mediji: cetv(T, { uglovi: { A: '70°' }, spolja: { A: '?' }, produzi: 0.6 }) });
  }
  Q(1, 'Koliki je spoljašnji ugao kvadrata?',
    ['90°', '45°', '180°', '360°'],
    'Kod kvadrata i pravougaonika su i unutrašnji i spoljašnji uglovi pravi. To su jedini četvorouglovi kod kojih su svi ti uglovi jednaki.', 'kvadrat',
    { mediji: cetv(pravoug(4, 4), { spolja: { B: '?' }, produzi: 0.5, velicina: 200 }) });
  Q(2, 'Tri spoljašnja ugla četvorougla su 80°, 90° i 100°. Koliki je četvrti spoljašnji ugao?',
    ['90°', '80°', '100°', '180°'],
    'Zbir spoljašnjih uglova je $360°$: $360° − 270° = 90°$. Zanimljivo, ovaj zbir je isti i za trougao, i za petougao, i za svaki konveksan mnogougao.', 'zbir',
    { mediji: (() => { const T = cetv4(100, 90, 90, { a: 5.5, d: 4 }); verno(T, [100, 90, 80, 90], 'spolj. 80,90,100,90'); return cetv(T, { spolja: { A: '80°', B: '90°', C: '100°', D: { o: '?', b: 3 } }, produzi: 0.4, velicina: 230 }); })() });
  {
    const T = cetv4(85, 95, 100, { a: 6, d: 4 });
    verno(T, [85, 95, 80, 100], 'spolj. 95,85,100');
    proveri(360 - (95 + 85 + 100) === 80 && 180 - 80 === 100, 'unutrašnji 100');
    Q(3, 'Tri spoljašnja ugla četvorougla su 95°, 85° i 100°. Koliki je unutrašnji ugao kod četvrtog temena?',
      ['100°', '80°', '90°', '120°'],
      'Četvrti spoljašnji ugao je $360° − 280° = 80°$, a unutrašnji uz njega $180° − 80° = 100°$. Pazi da ne staneš na pola puta!', 'unutrašnji',
      { mediji: cetv(T, { spolja: { A: '95°', B: '85°', C: '100°' }, uglovi: { D: { o: '?', b: 3 } }, produzi: 0.4, velicina: 230 }) });
  }
  Q(2, 'Koliki je zbir svih unutrašnjih i svih spoljašnjih uglova četvorougla zajedno?',
    ['720°', '360°', '540°', '1080°'],
    'Kod svakog temena unutrašnji i spoljašnji ugao daju $180°$, a temena su četiri: $4 · 180° = 720°$. Oduzmeš li $360°$ unutrašnjih, ostaje $360°$ spoljašnjih.', 'zbir',
    { mediji: cetv(opsti, { uglovi: { A: 'α', B: 'β', C: 'γ', D: 'δ' }, spolja: { A: 'α₁', B: 'β₁', C: 'γ₁', D: 'δ₁' }, produzi: 0.4, velicina: 230 }) });
  Q(2, 'Ako je unutrašnji ugao četvorougla tup, kakav je spoljašnji ugao kod istog temena?',
    ['Oštar', 'Tup', 'Prav', 'Opružen'],
    'Zbir im je $180°$: ako je jedan veći od $90°$, drugi mora biti manji od $90°$.', 'oštar',
    { mediji: (() => { const T = cetv4(70, 125, 95, { a: 6, d: 4 }); return cetv(T, { uglovi: { B: 'tup' }, spolja: { B: '?' }, produzi: 0.6 }); })() });
  Q(3, 'Postoji li četvorougao kod koga su svi unutrašnji i svi spoljašnji uglovi međusobno jednaki?',
    ['Da – svaki pravougaonik', 'Ne, takav ne postoji', 'Da, ali samo romb', 'Da, ali samo trapez'],
    'Ako su svi unutrašnji uglovi jednaki, svaki je $360° : 4 = 90°$, a tada je i svaki spoljašnji $90°$.', 'prav',
    { medijiOdgovora: cetv(pravoug(5.5, 3.5), { spolja: { A: '90°', B: '90°', C: '90°', D: '90°' }, e: [{ pu: 'DAB' }, { pu: 'ABC' }, { pu: 'BCD' }, { pu: 'CDA' }], produzi: 0.4, velicina: 230 }) });
  Q(3, 'Spoljašnji uglovi četvorougla odnose se kao $1 : 2 : 3 : 4$. Koliki je najveći unutrašnji ugao?',
    ['144°', '36°', '108°', '72°'],
    'Spoljašnji uglovi su $36°$, $72°$, $108°$ i $144°$. Najveći unutrašnji ugao stoji uz najmanji spoljašnji: $180° − 36° = 144°$.', 'razmera',
    { mediji: (() => { const T = cetv4(144, 108, 36, { a: 4.5, d: 6 }); verno(T, [144, 108, 72, 36], 'spolj. 1:2:3:4'); return cetv(T, { spolja: { A: 'x', B: '2x', C: '3x', D: '4x' }, produzi: 0.35, velicina: 230 }); })() });
  Q(2, 'Koliko najviše oštrih spoljašnjih uglova može imati četvorougao?',
    ['3', '4', '2', '1'],
    'Oštar spoljašnji ugao stoji uz tup unutrašnji, a četvorougao može imati najviše tri tupa ugla. Zato i najviše tri oštra spoljašnja.', 'oštar',
    { mediji: cetv(opsti, { spolja: { A: '?', B: '?', C: '?', D: '?' }, produzi: 0.4, velicina: 230 }) });
  U(1, 'Koji par NE može biti unutrašnji ugao i njemu susedni spoljašnji ugao?',
    ['60° i 130°', '60° i 120°', '95° i 85°', '30° i 150°'],
    'Zbir $60° + 130° = 190°$ nije $180°$. Kod ostalih parova zbir je tačno $180°$.',
    'Uporedni uglovi se vide i na raskrsnici: ako se ulice seku pod $60°$, susedni ugao je $120°$.', 'uporedan',
    { mediji: cetv(opsti, { uglovi: { A: 'α' }, spolja: { A: 'α₁' }, produzi: 0.6 }) });
  S(2, 'Spoji unutrašnji ugao sa spoljašnjim uglom kod istog temena:',
    [['45°', '135°'], ['90°', '90°'], ['110°', '70°'], ['150°', '30°']],
    'Što je unutrašnji ugao veći, to je spoljašnji manji – zbir im je uvek $180°$.', 'uporedan',
    { mediji: cetv(opsti, { uglovi: { C: 'γ' }, spolja: { C: 'γ₁' }, produzi: 0.6 }) });
  {
    const T = cetv4(80, 95, 120, { a: 6, d: 4 });
    Q(1, 'Spoljašnji ugao kod temena $D$ je 60°. Koliki je unutrašnji ugao kod $D$?',
      ['120°', '60°', '30°', '300°'],
      'Unutrašnji i spoljašnji ugao kod istog temena se „dopunjuju“ do opruženog ugla: $180° − 60° = 120°$.', 'uporedan',
      { mediji: cetv(T, { spolja: { D: '60°' }, uglovi: { D: { o: '?', b: 3 } }, produzi: 0.6 }) });
  }
  Q(3, 'Svi spoljašnji uglovi nekog četvorougla su jednaki. Kakav je taj četvorougao sigurno?',
    ['Pravougaonik', 'Kvadrat', 'Romb', 'Trapez'],
    'Svaki spoljašnji ugao je $360° : 4 = 90°$, pa su i unutrašnji pravi. To je pravougaonik – ali ne mora biti kvadrat, jer stranice mogu biti različite.', 'jednak',
    { mediji: cetv(opsti, { spolja: { A: 'x', B: 'x', C: 'x', D: 'x' }, produzi: 0.4, velicina: 230 }) });

  // ══════════ 36. Paralelogram ══════════
  L('Paralelogram');
  const PG = paral(6, 3.6, 62);
  const PGO = presekDuzi(PG.A, PG.C, PG.B, PG.D);
  Q(1, 'Kako se zove četvorougao kome su naspramne stranice paralelne (kao na slici)?',
    ['Paralelogram', 'Trapez', 'Deltoid', 'Trougao'],
    'Ime dolazi od grčkih reči „parallelos“ (uporedan) i „gramma“ (linija). Strelice iste boje na slici označavaju paralelne stranice.', 'paralela',
    { mediji: cetv(PG, { e: parStrelice(PG) }) });
  Q(1, 'Kakvi su naspramni uglovi paralelograma?',
    ['Jednaki', 'Suplementni', 'Komplementni', 'Uvek pravi'],
    'Naspramni uglovi paralelograma imaju paralelne krake, a oba su oštra ili oba tupa – zato su jednaki: $α = γ$ i $β = δ$.', 'jednak',
    { mediji: cetv(PG, { uglovi: { A: 'α', C: 'γ' } }) });
  Q(1, 'Koliki je zbir dva susedna ugla paralelograma?',
    ['180°', '90°', '360°', '120°'],
    'Susedni uglovi paralelograma su suplementni – kao uglovi sa paralelnim kracima od kojih je jedan oštar, a drugi tup.', 'suplement',
    { mediji: cetv(PG, { uglovi: { A: 'α', B: 'β' } }) });
  {
    const T = paral(6, 3.6, 65);
    Q(2, 'Oštar ugao paralelograma je 65°. Koliki je njegov tup ugao?',
      ['115°', '65°', '125°', '295°'],
      'Dovoljno je znati jedan ugao paralelograma pa da znamo sva četiri: $65°$, $115°$, $65°$, $115°$.', 'tup',
      { mediji: cetv(T, { uglovi: { A: '65°', B: { o: '?', b: 3 } } }) });
    Q(1, 'Ugao $α$ paralelograma je 65°. Koliki je ugao $γ$ (naspram njega)?',
      ['65°', '115°', '25°', '130°'],
      'Ako paralelogram okreneš za $180°$ oko preseka dijagonala, teme $A$ dolazi na mesto temena $C$ – zato su ti uglovi jednaki.', 'naspramni',
      { mediji: cetv(T, { uglovi: { A: '65°', C: { o: '?', b: 3 } } }) });
  }
  Q(2, 'Šta važi za dijagonale svakog paralelograma?',
    ['Polove se', 'Uvek su jednake', 'Uvek su normalne', 'Seku se van njega'],
    'Presek dijagonala je središte i jedne i druge. Jednake dijagonale ima tek pravougaonik, a normalne romb.', 'dijagonala',
    { mediji: cetv(PG, { dijag: true, O: true }),
      medijiOdgovora: cetv(PG, { dijag: true, O: true, e: [...crtice(PG.A, PGO), ...crtice(PGO, PG.C), ...crtice(PG.B, PGO, 2), ...crtice(PGO, PG.D, 2)] }) });
  Q(2, 'Paralelogram je centralnosimetrična figura. Gde je njegov centar simetrije?',
    ['U preseku dijagonala', 'U temenu $A$', 'Na sredini stranice $AB$', 'Paralelogram ga nema'],
    'Okretanjem za $180°$ oko preseka dijagonala paralelogram „pada sam na sebe“: $A$ ide u $C$, a $B$ u $D$.', 'centar',
    { mediji: cetv(PG),
      medijiOdgovora: cetv(PG, { dijag: true, O: true, e: [{ p: 'ABCD', b: 3, prazno: 1, okreni: 180, oko: 'O', kasni: 0.4, trajanje: 2, ponovi: 1 }, { tacka: 'O', b: 3 }] }) });
  {
    const E = [PG.D[0], 0];
    Q(2, 'Šta je visina paralelograma?',
      ['Rastojanje naspramnih stranica', 'Duža dijagonala', 'Polovina obima', 'Kraća stranica'],
      'Visina je najkraće rastojanje između dve paralelne stranice. Paralelogram ima dve visine: $h_{a}$ na stranicu $a$ i $h_{b}$ na stranicu $b$.', 'visina',
      { mediji: cetv(PG, { t: { E }, e: [{ d: 'DE', b: 2, isp: 1, o: 'h', debljina: 3 }, { pu: 'DEB' }] }) });
  }
  proveri(180 / 6 === 30, '5 puta');
  Q(2, 'Jedan ugao paralelograma je 5 puta veći od drugog. Koliki je oštar ugao?',
    ['30°', '36°', '45°', '25°'],
    'Različiti uglovi paralelograma su susedni, pa je $α + 5α = 180°$, $6α = 180°$ i $α = 30°$. Tup ugao je $150°$.', 'oštar',
    { mediji: cetv(paral(6, 3.2, 30), { uglovi: { A: 'α', B: '5α' } }) });
  proveri(140 / 2 === 70 && 180 - 70 === 110, 'zbir 140');
  Q(3, 'Zbir dva ugla paralelograma je 140°. Koliki je njegov tup ugao?',
    ['110°', '140°', '70°', '120°'],
    'Zbir dva susedna ugla bio bi $180°$, pa su ovo naspramni, jednaki uglovi od po $70°$. Tup ugao je $180° − 70° = 110°$.', 'tup',
    { mediji: cetv(paral(6, 3.6, 70), { uglovi: { A: '?', B: '?', C: '?', D: '?' } }) });
  proveri((180 - 40) / 2 === 70, 'razlika 40');
  Q(3, 'Razlika dva ugla paralelograma je 40°. Koliki je oštar ugao?',
    ['70°', '40°', '50°', '80°'],
    'Uglovi se razlikuju, pa su susedni: $α + β = 180°$ i $β − α = 40°$. Odatle je $2α = 140°$, $α = 70°$, $β = 110°$.', 'razlika',
    { mediji: cetv(paral(6, 3.6, 70), { uglovi: { A: 'α', B: 'α + 40°' } }) });
  Q(2, 'Koji uslov je dovoljan da četvorougao bude paralelogram?',
    ['Dijagonale mu se polove', 'Dijagonale su mu normalne', 'Dva ugla su mu prava', 'Dve stranice su mu jednake'],
    'Paralelogram se prepoznaje i po tome što su mu naspramne stranice jednake, ili naspramni uglovi jednaki, ili su dve naspramne stranice i paralelne i jednake.', 'uslov',
    { mediji: cetv(PG, { prazno: true }), medijiOdgovora: cetv(PG, { dijag: true, O: true, prazno: true, e: [...crtice(PG.A, PGO), ...crtice(PGO, PG.C), ...crtice(PG.B, PGO, 2), ...crtice(PGO, PG.D, 2)] }) });
  Q(3, 'Dve naspramne stranice četvorougla su i paralelne i jednake. Da li je on paralelogram?',
    ['Jeste, uvek', 'Samo ako ima prav ugao', 'Nije, to je trapez', 'Ne može se znati'],
    'Tada su i druge dve stranice paralelne. Zato, ako dve jednake duži stoje paralelno (kao prečke merdevina), njihovi krajevi čine paralelogram.', 'paralela',
    { mediji: G(PG, [{ d: 'AB', b: 1, debljina: 4 }, { d: 'DC', b: 1, debljina: 4 }, ...crtice(PG.A, PG.B), ...crtice(PG.D, PG.C), { d: 'BC', b: 4, isp: 1 }, { d: 'DA', b: 4, isp: 1 }], { velicina: 240 }) });
  proveri(2 * (7 + 4) === 22, 'obim 22');
  Q(2, 'Koliki je obim paralelograma na slici?',
    ['22 cm', '11 cm', '28 cm', '18 cm'],
    'Naspramne stranice paralelograma su jednake, pa je $O = 2a + 2b = 2 · (a + b)$.', 'obim',
    { mediji: cetv(paral(7, 4, 60), { stranice: { AB: '7 cm', BC: '4 cm' } }) });
  {
    const T = paral(6, 4, 50), E = [T.D[0], 0];
    const ux = Math.cos((50 * Math.PI) / 180), uy = Math.sin((50 * Math.PI) / 180);
    const tt = (T.D[0] - T.B[0]) * ux + (T.D[1] - T.B[1]) * uy, F = [r(T.B[0] + tt * ux), r(T.B[1] + tt * uy)];
    proveri(blizu(ugao(E, T.D, F), 50), '∠EDF = 50');
    Q(3, 'Visine paralelograma iz temena tupog ugla grade ugao od 50°. Koliki je tup ugao paralelograma?',
      ['130°', '50°', '140°', '120°'],
      'U četvorouglu koji grade visine sa stranicama dva ugla su prava, pa je ugao kod $B$ jednak $360° − 180° − 50° = 130°$. Ugao između visina jednak je oštrom uglu.', 'visina',
      { mediji: cetv(T, { t: { E, F }, e: [{ d: 'DE', b: 2, isp: 1 }, { d: 'DF', b: 2, isp: 1 }, { pu: 'DEB' }, { pu: 'DFB' }, { u: 'EDF', o: '50°', b: 3 }] }) });
  }
  U(1, 'Šta NIJE osobina svakog paralelograma?',
    ['Dijagonale su jednake', 'Naspramne stranice su jednake', 'Naspramni uglovi su jednaki', 'Dijagonale se polove'],
    'Dijagonale su jednake samo kod pravougaonika (i kvadrata). Na slici se vidi da je jedna dijagonala paralelograma duža.',
    'Kad bi zglobni ram od letvica (paralelogram) nakrivio, jedna dijagonala bi se izdužila, a druga skratila.', 'osobina',
    { mediji: cetv(PG, { dijag: true }) });
  S(2, 'Spoji element paralelograma sa njegovom osobinom:',
    [['Naspramne stranice', 'paralelne i jednake'], ['Naspramni uglovi', 'jednaki'], ['Susedni uglovi', 'zbir 180°'], ['Dijagonale', 'polove se']],
    'Svaka od ovih osobina važi i obrnuto: četvorougao koji je ima jeste paralelogram (za susedne uglove – ako važi za svaka dva).', 'osobina',
    { mediji: cetv(PG, { dijag: true, uglovi: { A: 'α', B: 'β' } }) });
  proveri(2 * 30 === 60 && 180 - 60 === 120, 'β = 120');
  Q(3, 'Dijagonala $AC$ paralelograma $ABCD$ je simetrala ugla kod $A$, a $∠BAC = 30°$. Koliki je ugao $β$?',
    ['120°', '60°', '150°', '30°'],
    'Ugao kod $A$ je $2 · 30° = 60°$, pa je $β = 120°$. Paralelogram čija je dijagonala simetrala ugla je romb.', 'simetrala',
    { mediji: (() => { const T = paral(5, 5, 60); return cetv(T, { dijag: 'AC', uglovi: { B: { o: '?', b: 3 } }, e: [{ u: 'BAC', o: '30°', b: 1, r: 34 }, { u: 'CAD', b: 1, r: 34 }] }); })() });

  // ══════════ 37. Vrste paralelograma ══════════
  L('Vrste paralelograma');
  const PR = pravoug(6, 3.6);
  const RB = paral(5, 5, 60);
  const KV = pravoug(4, 4);
  Q(1, 'Kako se zove paralelogram čiji su svi uglovi pravi?',
    ['Pravougaonik', 'Romb', 'Deltoid', 'Trapez'],
    'Pravougaonika ima svuda oko nas: sveska, ekran telefona, vrata, košarkaški teren…', 'pravougli',
    { medijiOdgovora: G(PR, [{ p: 'ABCD', b: 0 }, { pu: 'DAB' }, { pu: 'ABC' }, { pu: 'BCD' }, { pu: 'CDA' }], { velicina: 240 }) });
  Q(1, 'Kako se zove paralelogram čije su sve stranice jednake?',
    ['Romb', 'Pravougaonik', 'Trapez', 'Deltoid'],
    'Romb izgleda kao „nakrivljen kvadrat“. Ime potiče od grčke reči „rhombos“ – čigra koja se vrti.', 'romb',
    { medijiOdgovora: cetv(RB, { e: sveCrtice(RB) }) });
  Q(1, 'Koji paralelogram je istovremeno i pravougaonik i romb?',
    ['Kvadrat', 'Deltoid', 'Trapez', 'Takav ne postoji'],
    'Kvadrat ima sve osobine pravougaonika (prave uglove, jednake dijagonale) i sve osobine romba (jednake stranice, normalne dijagonale).', 'kvadrat',
    { mediji: G({ A: [0, 0], B: [5, 0], C: [5, 3.2], D: [0, 3.2], a: [7, 0], b: [10.5, 0], c: [11.8, 3.3], d: [8.3, 3.3] }, [
      { p: 'ABCD', b: 0 }, { pu: 'DAB' }, { pu: 'BCD' }, { tx: '~pravougaonik', at: [2.5, -0.8] },
      { p: 'abcd', b: 2 }, ...crtice([7, 0], [10.5, 0]), ...crtice([10.5, 0], [11.8, 3.3]), ...crtice([11.8, 3.3], [8.3, 3.3]), ...crtice([8.3, 3.3], [7, 0]), { tx: '~romb', at: [9.3, -0.8] }], { velicina: 300, bezImena: ['A', 'B', 'C', 'D'] }) });
  Q(2, 'Šta važi za dijagonale svakog pravougaonika (osim da se polove)?',
    ['Jednake su', 'Normalne su', 'Polove uglove', 'Jednake su stranici'],
    'Zato se oko pravougaonika može opisati kružnica: sva četiri temena su jednako udaljena od preseka dijagonala.', 'dijagonala',
    { mediji: cetv(PR, { dijag: true, O: true }) });
  Q(2, 'Šta važi za dijagonale svakog romba?',
    ['Seku se pod pravim uglom', 'Jednake su', 'Jednake su stranici', 'Ne seku se'],
    'Dijagonale romba su i simetrale njegovih uglova, a svaka je simetrala druge dijagonale.', 'romb',
    { mediji: cetv(RB, { dijag: true, O: true }), medijiOdgovora: cetv(RB, { dijag: true, O: true, e: [{ pu: 'AOB' }] }) });
  Q(2, 'Oko kog od ovih paralelograma uvek može da se opiše kružnica?',
    ['Pravougaonika', 'Romba koji nije kvadrat', 'Svakog paralelograma', 'Nijednog'],
    'Centar opisane kružnice je presek dijagonala, a poluprečnik je polovina dijagonale. Kod romba (koji nije kvadrat) temena nisu jednako udaljena od centra.', 'kružnica',
    { medijiOdgovora: cetv(PR, { dijag: true, O: true, e: [{ kr: 'O', kroz: 'A', b: 3, crtaj: 1 }] }) });
  {
    const O = presekDuzi(RB.A, RB.C, RB.B, RB.D);
    const h = 5 * Math.sin((60 * Math.PI) / 180);
    Q(2, 'U koji od ovih paralelograma uvek može da se upiše kružnica (koja dodiruje sve stranice)?',
      ['U romb', 'U pravougaonik koji nije kvadrat', 'U svaki paralelogram', 'Ni u jedan'],
      'Presek dijagonala romba je jednako udaljen od sve četiri stranice, a poluprečnik upisane kružnice je polovina visine romba.', 'romb',
      { medijiOdgovora: cetv(RB, { dijag: true, O: true, e: [{ kr: 'O', r: r(h / 2), b: 3, crtaj: 1 }] }) });
    proveri(O[0] > 0, 'O');
  }
  Q(2, 'Kvadrat ima 4 ose simetrije, a romb koji nije kvadrat samo 2. Koje ose kvadrata romb „gubi“?',
    ['Prave kroz središta stranica', 'Obe dijagonale', 'Jednu dijagonalu', 'Nijednu, ima ih isto'],
    'Ose simetrije kvadrata su dve dijagonale i dve prave kroz središta naspramnih stranica. Romb zadržava samo dijagonale, a pravougaonik samo prave kroz središta stranica.', 'osa',
    { mediji: cetv(KV, { velicina: 200 }),
      medijiOdgovora: G(KV, [{ p: 'ABCD', b: 0 }, ...[[[-0.6, -0.6], [4.6, 4.6]], [[-0.6, 4.6], [4.6, -0.6]], [[2, -0.8], [2, 4.8]], [[-0.8, 2], [4.8, 2]]].map((l, i) => ({ lin: l, b: 1, isp: 1, crtaj: 1, kasni: 0.3 + 0.4 * i }))], { velicina: 200 }) });
  Q(2, 'Kod kog paralelograma su ose simetrije prave kroz središta naspramnih stranica, a dijagonale nisu ose?',
    ['Kod pravougaonika', 'Kod romba', 'Kod svakog paralelograma', 'Kod deltoida'],
    'Ose su prave kroz središta naspramnih stranica. Dijagonale nisu ose: presavijen po dijagonali, pravougaonik se ne poklapa sam sa sobom.', 'osa',
    { mediji: G({ O: [0, 0] }, [{ lin: [[-3, 0], [3, 0]], b: 1, isp: 1 }, { lin: [[0, -2], [0, 2]], b: 1, isp: 1 }, { tx: '?', at: [1.5, 1], vel: 30 }], { bezImena: ['O'], velicina: 220 }), medijiOdgovora: G(PR, [{ p: 'ABCD', b: 0 }, { lin: [[3, -0.8], [3, 4.4]], b: 1, isp: 1, crtaj: 1 }, { lin: [[-0.8, 1.8], [6.8, 1.8]], b: 1, isp: 1, crtaj: 1, kasni: 0.7 }], { velicina: 240 }) });
  Q(2, 'Koliko osa simetrije ima romb koji nije kvadrat?',
    ['2', '4', '1', '0'],
    'Ose simetrije romba su njegove dijagonale. Presavijen po dijagonali, romb se tačno poklopi.', 'osa',
    { mediji: cetv(RB), medijiOdgovora: cetv(RB, { e: [{ d: 'AC', b: 1, isp: 1, crtaj: 1 }, { d: 'BD', b: 1, isp: 1, crtaj: 1, kasni: 0.8 }] }) });
  {
    const a = r(3.6 * Math.sqrt(3)), T = pravoug(a, 3.6), O = sred(T.A, T.C);
    proveri(blizu(ugao(T.B, O, T.C), 60), 'BOC 60');
    Q(3, 'Dijagonale pravougaonika seku se pod uglom od 60°. Koliki ugao gradi dijagonala sa dužom stranicom?',
      ['30°', '60°', '45°', '20°'],
      'Trougao $BOC$ je jednakokraki (polovine dijagonala su jednake) sa uglom $60°$ – dakle jednakostraničan. Ugao $OBC$ je $60°$, pa je ugao dijagonale sa dužom stranicom $90° − 60° = 30°$.', 'dijagonala',
      { mediji: cetv(T, { dijag: true, O: true, velicina: 260, e: [{ u: 'BOC', o: '60°', b: 3, r: 18 }, { u: 'BAC', o: '?', b: 1, r: 40 }] }) });
  }
  {
    const T = paral(5, 5, 50);
    proveri(2 * 25 === 50 && 180 - 50 === 130, 'romb 50/130');
    Q(3, 'Duža dijagonala romba gradi sa stranicom ugao od 25°. Koliki je tup ugao romba?',
      ['130°', '50°', '115°', '155°'],
      'Duža dijagonala spaja temena oštrih uglova i polovi ih, pa je oštar ugao $50°$, a tup $180° − 50° = 130°$.', 'romb',
      { mediji: cetv(T, { dijag: 'AC', uglovi: { B: { o: '?', b: 3 } }, e: [{ u: 'BAC', o: '25°', b: 1, r: 38 }] }) });
  }
  Q(2, 'Koja tvrdnja o vrstama paralelograma je tačna?',
    ['Svaki kvadrat je romb', 'Svaki romb je kvadrat', 'Svaki pravougaonik je kvadrat', 'Svaki paralelogram je romb'],
    'Paralelogrami su velika „porodica“: pravougaonici i rombovi su njeni članovi, a kvadrati su u oba skupa istovremeno – u njihovom preseku.', 'porodica',
    { medijiOdgovora: G({ O: [0, 0] }, [
      { lin: [[-6.6, -3.8], [6.6, -3.8], [6.6, 4.2], [-6.6, 4.2]], zatv: 1, b: 4, prazno: 1 }, { tx: '~paralelogrami', at: [-3.6, 3.5] },
      krug(-1.7, -0.2, 3, { b: 0 }), krug(1.7, -0.2, 3, { b: 1 }),
      { tx: '~pravougaonici', at: [-3.2, 2.2] }, { tx: '~rombovi', at: [3.4, 2.2] }, { tx: '~kvadrati', at: [0, -0.2], b: 3 }], { bezImena: ['O'], velicina: 300 }) });
  U(1, 'Koji četvorougao NIJE paralelogram?',
    ['Trapez', 'Romb', 'Kvadrat', 'Pravougaonik'],
    'Trapez ima samo jedan par paralelnih stranica, a paralelogram dva para. Romb, kvadrat i pravougaonik su paralelogrami.',
    'Svaki kvadrat je istovremeno i romb, i pravougaonik, i paralelogram – ima čak četiri imena!', 'trapez',
    { medijiOdgovora: G({ A: [0, 0], B: [6, 0], C: [4.5, 3], D: [1.2, 3] }, [{ p: 'ABCD', b: 0 }, ...paralelno([0, 0], [6, 0]), ...paralelno([1.2, 3], [4.5, 3])], { velicina: 240, bezImena: ['A', 'B', 'C', 'D'] }) });
  S(2, 'Spoji osobine sa vrstom paralelograma:',
    [['Sve stranice jednake, uglovi nisu pravi', 'romb'], ['Svi uglovi pravi, stranice nisu sve jednake', 'pravougaonik'], ['Sve stranice jednake i svi uglovi pravi', 'kvadrat']],
    'Pravougaonik „nasleđuje“ sve osobine paralelograma i dodaje prave uglove; romb dodaje jednake stranice; kvadrat ima oboje.', 'vrsta',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [5.6, 2.8], D: [1.6, 2.8], a: [7, 0], b: [11, 0], c: [11, 2.8], d: [7, 2.8], e: [13, 0], f: [15.8, 0], g: [15.8, 2.8], h: [13, 2.8] }, [
      { p: 'ABCD', b: 0 }, { p: 'abcd', b: 2 }, { pu: 'dab' }, { p: 'efgh', b: 1 }, { pu: 'hef' }], { velicina: 320, bezImena: ['A', 'B', 'C', 'D'] }) });
  Q(3, 'Dijagonale paralelograma su jednake i seku se pod pravim uglom. Koji je to paralelogram?',
    ['Kvadrat', 'Romb', 'Pravougaonik', 'Ne mora biti nijedan'],
    'Jednake dijagonale ima pravougaonik, a normalne romb. Paralelogram koji je i jedno i drugo je kvadrat.', 'kvadrat',
    { mediji: G({ O: [0, 0], A: [0, -3], B: [3, 0], C: [0, 3], D: [-3, 0] }, [{ d: 'AC', b: 1 }, { d: 'BD', b: 2 }, { pu: 'AOB' }, { tacka: 'O' }], { velicina: 220, bezImena: ['O', 'A', 'B', 'C', 'D'] }),
      medijiOdgovora: G({ O: [0, 0], A: [0, -3], B: [3, 0], C: [0, 3], D: [-3, 0] }, [{ p: 'ABCD', b: 3, crtaj: 1 }, { d: 'AC', b: 1 }, { d: 'BD', b: 2 }, { pu: 'AOB' }], { velicina: 220, bezImena: ['O', 'A', 'B', 'C', 'D'] }) });
  {
    const T = pravoug(6, 3.6);
    const M = sred(T.A, T.B), N = sred(T.B, T.C), P = sred(T.C, T.D), Qt = sred(T.D, T.A);
    Q(3, 'Spojimo redom središta stranica pravougaonika (koji nije kvadrat). Kakav četvorougao dobijamo?',
      ['Romb', 'Kvadrat', 'Pravougaonik', 'Trapez'],
      'Sve četiri nove stranice su dijagonale podudarnih pravouglih trouglova u uglovima pravougaonika – zato su jednake. A spajanjem središta stranica kvadrata dobija se opet kvadrat.', 'romb',
      { mediji: G({ ...T, M, N, P, Q: Qt }, [{ p: 'ABCD', b: 0, prazno: 1 }, { tacka: 'MNPQ', b: 3 }], { velicina: 240, bezImena: ['M', 'N', 'P', 'Q'] }),
        medijiOdgovora: G({ ...T, M, N, P, Q: Qt }, [{ p: 'ABCD', b: 0, prazno: 1 }, { p: 'MNPQ', b: 1, crtaj: 1 }, ...crtice(M, N), ...crtice(N, P), ...crtice(P, Qt), ...crtice(Qt, M)], { velicina: 240, bezImena: ['M', 'N', 'P', 'Q'] }) });
  }
  Q(2, 'Koliki je poluprečnik kružnice opisane oko pravougaonika?',
    ['Polovina dijagonale', 'Polovina duže stranice', 'Cela dijagonala', 'Polovina obima'],
    'Presek dijagonala je jednako udaljen od sva četiri temena – za pola dijagonale. Zato je dijagonala pravougaonika prečnik opisane kružnice.', 'poluprečnik',
    { mediji: cetv(PR, { dijag: true, O: true, e: [{ kr: 'O', kroz: 'A', b: 3 }] }) });
};
