// Sličnost — 8. razred: proporcionalnost duži, Talesova teorema, sličnost trouglova, primene.
module.exports = ({ L, Z, G, K, proveri, r, S3, rad, naKrugu, telo, A }) => {

  // ── pomoćni crteži ──
  // Talesova teorema: dve prave a i b seku krake ugla sa temenom O; duži na jednom kraku su
  // proporcionalne dužima na drugom. Crtamo ugao sa tačkama A,B na levom kraku i C,D na desnom.
  function tales(OA, AB, OC, CD, { oa = String(OA), ab = String(AB), oc = String(OC), cd = String(CD) } = {}) {
    // levi krak ide duž x-ose udesno, desni krak nagore-desno (nagib 0,4; tačke su na pravom rastojanju od O)
    const A = [OA, 0], B = [OA + AB, 0];
    const u = [1 / Math.sqrt(1.16), 0.4 / Math.sqrt(1.16)];
    const C = [OC * u[0], OC * u[1]], D = [(OC + CD) * u[0], (OC + CD) * u[1]];
    const kraj = OC + CD + 0.8;
    return G({ O: [0, 0], A, B, C, D },
      [{ lin: [[0, 0], [OA + AB + 1, 0]], b: 5, str: 1 }, { lin: [[0, 0], [kraj * u[0], kraj * u[1]]], b: 5, str: 1 },
       { d: 'AC', b: 1 }, { d: 'BD', b: 2 }, { d: 'OA', o: oa, na: 0.35 }, { d: 'AB', o: ab, na: 0.65 }, { d: 'OC', o: oc, na: 0.3 }, { d: 'CD', o: cd, na: 0.75 },
       { tacka: 'ABCD', b: 4 }, { tx: 'O', at: [-0.25, -0.3] }], { bezImena: ['O'], velicina: 300 });
  }

  // ════════════════ 1.1 Proporcionalnost duži ════════════════
  L('Proporcionalnost duži');

  Z(1, 'Duž $AB$ duga je $12 cm$, a duž $CD$ duga je $8 cm$. Koliki je odnos $AB : CD$?',
    ['$3 : 2$', '$2 : 3$', '$4 : 3$', '$3 : 4$'],
    [K('Odnos (razmera) dve duži jednak je odnosu njihovih dužina izraženih istom jedinicom.'),
     K('$AB : CD = 12 : 8$. Oba broja delimo najvećim zajedničkim deliocem $4$: $12 : 8 = 3 : 2$.'),
     K('Obratno, $CD : AB = 2 : 3$ – zato se tačno čita šta je prvo, a šta drugo.')]);

  Z(1, 'Duž $MN$ podeljena je tačkom $P$ u razmeri $2 : 5$ (računajući od $M$). Ako je $|MN| = 21 cm$, kolika je duž $MP$?',
    ['$6 cm$', '$15 cm$', '$7 cm$', '$4 cm$'],
    [K('Razmera $2 : 5$ znači da celu duž delimo na $2 + 5 = 7$ jednakih delova.'),
     K('Jedan deo je $21 : 7 = 3 cm$.', ['del']),
     K('$MP$ ima $2$ takva dela: $MP = 2 · 3 = 6 cm$. (Provera: $PN = 5 · 3 = 15 cm$, zbir $6 + 15 = 21$ ✓)')],
    G({ M: [0, 0], P: [6, 0], N: [21, 0], a: [3, 0], b: [12, 0] },
      [{ osa: [0, 21], svaki: 3 }, { d: 'MN', b: 5 }, { tacka: 'MN', b: 4 }, { d: 'MP', b: 1, id: 'del' }, { tx: '2', at: [3, -0.6] }, { tx: '5', at: [13.5, -0.6] }], { bezImena: ['M', 'N'], velicina: 300 }));

  Z(2, 'Tačka $T$ deli duž $AB$ u razmeri $AT : TB = 3 : 4$. Koliko procenata duži $AB$ zauzima duž $AT$?',
    ['$42,9 %$', '$37,5 %$', '$75 %$', '$43,3 %$'],
    [K('Duž je podeljena na $3 + 4 = 7$ jednakih delova; $AT$ zauzima $3$ od njih.'),
     K('$AT$ je ${3|7}$ duži $AB$.'),
     K('${3|7} = 0,42857… ≈ 42,9 %$. (Duž $TB$ zauzima preostalih $57,1 %$.)')]);

  Z(2, 'Dužine dve duži odnose se kao $5 : 3$, a njihova razlika je $8 cm$. Kolika je duža duž?',
    ['$20 cm$', '$15 cm$', '$12 cm$', '$40 cm$'],
    [K('Neka su duži $5x$ i $3x$. Razlika: $5x − 3x = 2x = 8 cm$, pa je $x = 4 cm$.'),
     K('Duža duž: $5x = 5 · 4 = 20 cm$.'),
     K('Provera: kraća je $3 · 4 = 12 cm$, a $20 − 12 = 8$ ✓.')]);

  Z(2, 'Duž $AB$ treba podeliti na tri duži u razmeri $1 : 2 : 3$. Ako je najduža od njih $12 cm$, kolika je cela duž $AB$?',
    ['$24 cm$', '$12 cm$', '$36 cm$', '$18 cm$'],
    [K('Delovi su $x$, $2x$ i $3x$; najduži je $3x = 12 cm$, pa je $x = 4 cm$.'),
     K('Cela duž: $x + 2x + 3x = 6x = 6 · 4 = 24 cm$.'),
     K('Delovi su redom $4 cm$, $8 cm$ i $12 cm$.')]);

  Z(3, 'Na geografskoj karti razmere $1 : 200 000$ rastojanje dva mesta je $7,5 cm$. Koliko je stvarno rastojanje?',
    ['$15 km$', '$1,5 km$', '$150 km$', '$7,5 km$'],
    [K('Razmera $1 : 200 000$ znači da $1 cm$ na karti predstavlja $200 000 cm$ u prirodi.'),
     K('$7,5 · 200 000 = 1 500 000 cm = 15 000 m = 15 km$.'),
     K('Zapamti: $100 000 cm = 1 km$, pa je $200 000 cm = 2 km$; onda je $7,5 · 2 = 15 km$.')]);

  Z(3, 'Duži $a$ i $b$ odnose se kao $4 : 7$, a duži $b$ i $c$ kao $7 : 2$. Koliko se odnose $a$ i $c$?',
    ['$2 : 1$', '$4 : 2$', '$7 : 4$', '$4 : 7$'],
    [K('Iz $a : b = 4 : 7$ i $b : c = 7 : 2$ sledi da je $b$ „most“: u obe razmere je $7$ delova.'),
     K('$a = 4$ dela, $b = 7$ delova, $c = 2$ dela, pa je $a : c = 4 : 2 = 2 : 1$.'),
     K('Ili algebarski: ${a|b} · {b|c} = {a|c} = {4|7} · {7|2} = {4|2} = 2$.')]);

  // ════════════════ 1.2 Talesova teorema ════════════════
  L('Talesova teorema');

  Z(1, 'Dve paralelne prave $a$ i $b$ seku krake ugla. Na jednom kraku odsecaju duži $OA = 4 cm$ i $AB = 6 cm$, a na drugom duž $OC = 6 cm$. Kolika je duž $CD$?',
    ['$9 cm$', '$4 cm$', '$8 cm$', '$6 cm$'],
    [K('Po Talesovoj teoremi: ${OA|AB} = {OC|CD}$.', ['ac', 'bd']),
     K('${4|6} = {6|CD}$, pa je $CD = {6 · 6|4} = 9 cm$.'),
     K('Provera razmera: ${4|6} = {2|3}$ i ${6|9} = {2|3}$ ✓', [], tales(4, 6, 6, 9)),
     K('Animacija Talesove teoreme:', [], A('tales-proporcije', 'Paralelne prave seku krake ugla na proporcionalne duži'))]);

  Z(1, 'Paralelne prave seku krake ugla i na jednom kraku odsecaju duži $5 cm$ i $3 cm$. Ako je na drugom kraku prva (kraća) duž $7,5 cm$, kolika je druga?',
    ['$4,5 cm$', '$5 cm$', '$12,5 cm$', '$3 cm$'],
    [K('Po Talesovoj teoremi odgovarajuće duži su proporcionalne: ${5|3} = {7,5|x}$.'),
     K('$x = {3 · 7,5|5} = {22,5|5} = 4,5 cm$.'),
     K('Provera: ${5|3} ≈ 1,67$ i ${7,5|4,5} = 1,67$ ✓')]);

  Z(2, 'U trouglu $ABC$ je $DE \\| AB$, tačka $D$ na stranici $AC$, tačka $E$ na stranici $BC$. Ako je $CD = 8 cm$, $DA = 4 cm$ i $CE = 10 cm$, kolika je stranica $BC$?',
    ['$15 cm$', '$12 cm$', '$20 cm$', '$14 cm$'],
    [K('Kad je $DE \\| AB$, po Talesovoj teoremi važi ${CD|DA} = {CE|EB}$.', ['de']),
     K('${8|4} = {10|EB}$, pa je $EB = {4 · 10|8} = 5 cm$.'),
     K('$BC = CE + EB = 10 + 5 = 15 cm$.', ['bc'])],
    G({ A: [-8.944, 0], B: [12.689, 0], C: [0, 8], D: [-5.963, 2.667], E: [8.459, 2.667] },
      [{ p: 'ABC', b: 0 }, { d: 'DE', b: 1, id: 'de' }, { d: 'CD', o: '8 cm' }, { d: 'DA', o: '4 cm' }, { d: 'CE', o: '10 cm' }, { d: 'EB', b: 3, id: 'eb' }, { d: 'BC', id: 'bc', b: 3 }], { velicina: 280 }));

  Z(2, 'Na krake ugla sa temenom $O$ nanete su tačke: na jedan krak $A$ i $B$ ($OA = 3 cm$, $AB = 5 cm$), a na drugi $C$ i $D$ tako da je $AC \\| BD$. Ako je $OC = 4,5 cm$, koliko je $OD$?',
    ['$12 cm$', '$7,5 cm$', '$9 cm$', '$10,5 cm$'],
    [K('Talesova teorema: ${OA|AB} = {OC|CD}$ → ${3|5} = {4,5|CD}$, pa je $CD = {5 · 4,5|3} = 7,5 cm$.', ['ac', 'bd']),
     K('$OD = OC + CD = 4,5 + 7,5 = 12 cm$.'),
     K('Može se odmah i ${OA|OB} = {OC|OD}$: ${3|8} = {4,5|OD}$ → $OD = 12 cm$ ✓', [], tales(3, 5, 4.5, 7.5))]);

  Z(3, 'Duž $AB$ podeljena je tačkom $C$ tako da je $AC : CB = 3 : 2$. Kroz tačku $A$ povučena je prava $p$ koja nije paralelna sa $AB$, i na njoj tačke $M$ i $N$ tako da je $CM \\| BN$. Ako je $AM = 9 cm$, koliko je $MN$?',
    ['$6 cm$', '$15 cm$', '$3 cm$', '$13,5 cm$'],
    [K('Ovde ugao čine prava $AB$ i prava $p$, a $CM$ i $BN$ su paralelne. Po Talesovoj teoremi: ${AC|CB} = {AM|MN}$.'),
     K('${3|2} = {9|MN}$, pa je $MN = {2 · 9|3} = 6 cm$.'),
     K('Provera: ${9|6} = {3|2}$ ✓')]);

  Z(3, 'U trapezu $ABCD$ ($AB \\| CD$) dijagonale se seku u tački $S$. Ako je $AS = 8 cm$, $SC = 4 cm$ i $BS = 6 cm$, koliko je $SD$?',
    ['$3 cm$', '$4 cm$', '$2 cm$', '$12 cm$'],
    [K('U trapezu je $AB \\| CD$, a tačke $A$ i $B$ su na jednoj, $C$ i $D$ na drugoj paralelnoj pravoj.'),
     K('Trouglovi $ABS$ i $CDS$ su slični (podudarni uglovi uz $S$ i uz paralelne prave), pa je ${AS|SC} = {BS|SD}$.'),
     K('${8|4} = {6|SD}$, pa je $SD = {4 · 6|8} = 3 cm$.'),
     K('Provera: ${8|4} = 2$ i ${6|3} = 2$ ✓')]);

  // ════════════════ 1.3 Primena Talesove teoreme u konstrukcijama ════════════════
  L('Primena Talesove teoreme u konstrukcijama');

  Z(1, 'Duž dugu $10 cm$ treba podeliti na $4$ jednaka dela. Koju dužinu nanesemo na pomoćni zrak?',
    ['Bilo koju, $4$ puta', 'Tačno $10 cm$, $4$ puta', 'Tačno $2,5 cm$', 'Duž mora biti celobrojna'],
    [K('Na pomoćni zrak iz jednog kraja duži nanesemo proizvoljnu (ali uvek istu!) duž četiri puta.'),
     K('Poslednju tačku spojimo sa drugim krajem duži, pa kroz ostale tačke povučemo paralelne prave.'),
     K('Po Talesovoj teoremi one dele datu duž na $4$ jednaka dela. (Svaki deo bi bio $2,5 cm$, ali ga ne merimo – konstruišemo.)')]);

  Z(2, 'Duž dugu $9 cm$ treba podeliti u razmeri $2 : 3$. Na pomoćni zrak nanesemo $5$ jednakih duži. Koju tačku na zraku spajamo sa krajem date duži?',
    ['Petu (poslednju)', 'Treću', 'Drugu', 'Prvu'],
    [K('Pošto je $2 + 3 = 5$, na pomoćni zrak nanosimo $5$ jednakih duži.'),
     K('Kraj date duži spajamo sa petom (poslednjom) tačkom na zraku.'),
     K('Kroz drugu tačku (posle $2$ nanete duži) povučemo paralelu – ona deli datu duž u razmeri $2 : 3$.')]);

  Z(2, 'Duž $AB$ podeljena je Talesovom konstrukcijom na $3$ jednaka dela. Ako je cela duž $AB = 15 cm$, koliki je jedan deo?',
    ['$5 cm$', '$3 cm$', '$7,5 cm$', '$10 cm$'],
    [K('Kad duž podelimo na $3$ jednaka dela, svaki je trećina cele duži.'),
     K('$15 : 3 = 5 cm$.'),
     K('Talesova konstrukcija je tačna bez obzira na dužinu duži – zato se i koristi kad dužina nije deljiva.')]);

  Z(3, 'Treba konstruisati četvrtu proporcionalu: za duži $a = 6 cm$, $b = 4 cm$ i $c = 9 cm$ traži se duž $x$ tako da je $a : b = c : x$. Kolika je $x$?',
    ['$6 cm$', '$13,5 cm$', '$8 cm$', '$6,75 cm$'],
    [K('Iz proporcije $a : b = c : x$ sledi $x = {b · c|a}$.'),
     K('$x = {4 · 9|6} = {36|6} = 6 cm$.'),
     K('Konstrukcija: na krake ugla nanesemo $a$ i $b$ na jedan, a $c$ na drugi krak; spojimo krajeve $a$ i $c$, pa paralelu kroz kraj duži $b$.')]);

  Z(3, 'Duž od $7 cm$ podeljena je tačkom $M$ u razmeri $3 : 4$. Koliko je $M$ udaljeno od bližeg kraja?',
    ['$3 cm$', '$4 cm$', '$3,5 cm$', '$2,3 cm$'],
    [K('$3 + 4 = 7$ jednakih delova; cela duž je $7 cm$, pa je jedan deo tačno $1 cm$.'),
     K('Bliži kraj je onaj od koga se broji razmera – od njega je $3$ dela, tj. $3 cm$.'),
     K('Drugi deo je $4 cm$; provera $3 + 4 = 7$ ✓.')]);

  // ════════════════ 1.4 Sličnost trouglova ════════════════
  L('Sličnost trouglova');

  Z(1, 'Dva trougla su slična sa koeficijentom sličnosti $2$. Ako je obim manjeg trougla $15 cm$, koliki je obim većeg?',
    ['$30 cm$', '$17 cm$', '$7,5 cm$', '$22,5 cm$'],
    [K('Slični trouglovi imaju sve odgovarajuće stranice proporcionalne – svaka stranica većeg je $2$ puta duža.'),
     K('Zato je i obim većeg $2$ puta veći: $2 · 15 = 30 cm$.'),
     K('I obratno: odnos obima sličnih trouglova jednak je koeficijentu sličnosti.'),
     K('Animacija sličnosti – uvećanje čuva uglove:', [], A('slicni-trouglovi', 'Stranice se uvećavaju, uglovi ostaju isti'))]);

  Z(1, 'Trouglovi $ABC$ i $A_{1}B_{1}C_{1}$ su slični, pri čemu $AB$ odgovara $A_{1}B_{1}$. Ako je $AB = 8 cm$, $A_{1}B_{1} = 4 cm$ i $BC = 6 cm$, kolika je stranica $B_{1}C_{1}$?',
    ['$3 cm$', '$12 cm$', '$4 cm$', '$2 cm$'],
    [K('Koeficijent sličnosti (veći prema manjem) je $k = {8|4} = 2$; manji prema većem je ${1|2}$.'),
     K('$B_{1}C_{1}$ odgovara $BC$, pa je $B_{1}C_{1} = {BC|2} = {6|2} = 3 cm$.'),
     K('Provera: ${8|4} = {6|3} = 2$ ✓')]);

  Z(2, 'Slični trouglovi imaju obime $24 cm$ i $36 cm$. Ako je najduža stranica manjeg $8 cm$, kolika je najduža stranica većeg?',
    ['$12 cm$', '$10 cm$', '$16 cm$', '$9 cm$'],
    [K('Koeficijent sličnosti većeg prema manjem: $k = {36|24} = {3|2}$.'),
     K('Najduža stranica većeg: ${3|2} · 8 = 12 cm$.'),
     K('Uvek: odnos obima jednak je odnosu odgovarajućih stranica.')]);

  Z(2, 'Dva jednakostranična trougla su uvek slična. Ako su im stranice $5 cm$ i $8 cm$, koliki je odnos njihovih površina?',
    ['$25 : 64$', '$5 : 8$', '$25 : 40$', '$8 : 5$'],
    [K('Koeficijent sličnosti je $k = {5|8}$ (ili ${8|5}$).'),
     K('Površine sličnih figura odnose se kao kvadrat koeficijenta sličnosti: $k² = ({5|8})² = {25|64}$.'),
     K('Ako se stranica uveća $2$ puta, površina se uveća $2² = 4$ puta.')]);

  Z(3, 'Trouglovi su slični, a površine su im $18 cm²$ i $50 cm²$. Koliki je odnos njihovih obima?',
    ['$3 : 5$', '$9 : 25$', '$18 : 50$', '$√{2} : √{5}$'],
    [K('Odnos površina je $k² = {18|50} = {9|25}$.'),
     K('Odnos dužina (pa i obima) je $k = √{{9|25}} = {3|5}$.'),
     K('Provera: $({3|5})² = {9|25}$ ✓')]);

  Z(3, 'Trougao $ABC$ sličan je trouglu $DEF$ sa koeficijentom $k = {3|2}$ ($ABC$ je veći). Ako je $∠A = 40°$ i $∠E = 70°$, koliki je $∠C$?',
    ['$70°$', '$40°$', '$110°$', '$60°$'],
    [K('Slični trouglovi imaju jednake odgovarajuće uglove: $∠A = ∠D$, $∠B = ∠E$, $∠C = ∠F$.'),
     K('$∠B = ∠E = 70°$, $∠A = 40°$.'),
     K('$∠C = 180° − 40° − 70° = 70°$. (Koeficijent sličnosti ne menja uglove!)')]);

  // ════════════════ 1.5 Stavovi sličnosti trouglova ════════════════
  L('Stavovi sličnosti trouglova');

  Z(1, 'Koji stav sličnosti kaže da su dva trougla slična ako su im sve tri stranice proporcionalne?',
    ['SSS', 'SUS', 'UU', 'SSU'],
    [K('Stav SSS: dve trojke stranica su proporcionalne.'),
     K('Stav SUS: dve stranice proporcionalne i podudaran ugao između njih.'),
     K('Stav UU: dva ugla jednog trougla jednaka su dvama uglovima drugog (dovoljna su dva ugla – treći se sam poklopi).')]);

  Z(1, 'Trouglovi imaju stranice $3, 4, 5$ i $6, 8, 10$. Po kom stavu su slični?',
    ['SSS', 'SUS', 'UU', 'Nisu slični'],
    [K('Uporedimo odnose: ${6|3} = 2$, ${8|4} = 2$, ${10|5} = 2$ – svi su jednaki.'),
     K('Sve tri stranice su proporcionalne, pa su trouglovi slični po stavu SSS.'),
     K('To je čuvena Pitagorina trojka $3, 4, 5$ uvećana $2$ puta.')]);

  Z(2, 'Trouglovi $ABC$ i $DEF$ imaju $AB = 9 cm$, $AC = 6 cm$, $DE = 3 cm$, $DF = 2 cm$ i $∠A = ∠D = 50°$. Po kom stavu su slični?',
    ['SUS', 'SSS', 'UU', 'Ne mogu se uporediti'],
    [K('Date su po dve stranice i ugao između njih.'),
     K('${AB|DE} = {9|3} = 3$ i ${AC|DF} = {6|2} = 3$ – proporcionalne su, a zahvaćeni uglovi su jednaki.'),
     K('To je stav SUS (dve stranice i zahvaćeni ugao).')]);

  Z(2, 'Trougao $ABC$ ima uglove $40°$ i $60°$, a trougao $DEF$ uglove $60°$ i $80°$. Jesu li slični?',
    ['Da, po stavu UU', 'Ne', 'Samo ako su stranice jednake', 'Da, po stavu SSS'],
    [K('Treći ugao trougla $ABC$: $180° − 40° − 60° = 80°$.'),
     K('Trougao $DEF$ ima uglove $60°$ i $80°$ – a onda i treći od $40°$ ($180° − 60° − 80°$).'),
     K('Oba trougla imaju uglove $40°, 60°, 80°$, pa su slični po stavu UU.')]);

  Z(2, 'Dva pravougla trougla imaju po jedan oštar ugao od $35°$. Šta sigurno važi?',
    ['Slični su', 'Podudarni su', 'Imaju jednake hipotenuze', 'Ništa ne možemo reći'],
    [K('Oba trougla imaju prav ugao ($90°$) i ugao od $35°$ – to su dva jednaka ugla.'),
     K('Po stavu UU trouglovi su slični.'),
     K('Podudarnost bi tražila još i jednaku bar jednu stranicu – nju ovde ne znamo.')]);

  Z(3, 'Stranice trougla su $4 cm$, $6 cm$ i $8 cm$. Koje stranice ima njemu sličan trougao najmanjeg celobrojnog obima?',
    ['$2, 3, 4$', '$8, 12, 16$', '$1, 1,5, 2$', '$6, 9, 12$'],
    [K('Sličan trougao ima stranice proporcionalne datim: $4 : 6 : 8 = 2 : 3 : 4$.'),
     K('Najmanje celobrojne stranice u toj razmeri su upravo $2, 3, 4$ (ne mogu se više skratiti).'),
     K('Trouglovi $8, 12, 16$ i $6, 9, 12$ su takođe slični, ali veći.')]);

  Z(3, 'U trouglu $ABC$ je $AB = 12 cm$, $AC = 8 cm$, $BC = 10 cm$. Tačka $D$ je na $AB$ tako da je $AD = 4 cm$, a kroz $D$ je povučena paralela sa $BC$ koja seče $AC$ u $E$. Kolika je duž $DE$?',
    ['${10|3} cm$', '$5 cm$', '$4 cm$', '$6,67 cm$'],
    [K('Kako je $DE \\| BC$, trouglovi $ADE$ i $ABC$ su slični (stav UU – zajednički ugao $A$ i jednaki uglovi uz paralelu).', ['de']),
     K('Koeficijent sličnosti (mali prema velikom): $k = {AD|AB} = {4|12} = {1|3}$.'),
     K('$DE = k · BC = {1|3} · 10 = {10|3} cm ≈ 3,33 cm$.')],
    G({ A: [0, 0], B: [12, 0], C: [4, 8], D: [4, 0], E: [1.33, 2.67] },
      [{ p: 'ABC', b: 0 }, { p: 'ADE', b: 1 }, { d: 'BC', b: 3 }, { d: 'DE', b: 3, id: 'de' }, { d: 'AD', o: '4 cm' }, { d: 'AB', o: '12 cm' }], { velicina: 260 }));

  // ════════════════ 1.6 Primena sličnosti na pravougli trougao ════════════════
  L('Primena sličnosti na pravougli trougao');

  // Euklidove teoreme: visina na hipotenuzu deli je na odsečke p i q
  const euklid = (c, p, q, h) => G({ A: [0, 0], B: [c, 0], C: [p, h], D: [p, 0, 90] },
    [{ p: 'ABC', b: 0 }, { p: 'ADC', b: 1 }, { p: 'DBC', b: 2 }, { pu: 'ACB' }, { pu: 'ADC' }, { pu: 'BDC' },
     { d: 'CD', o: 'h', isp: 1, b: 3 }, { d: 'AD', o: String(p) }, { d: 'DB', o: String(q) }, { d: 'AB', o: 'c', na: 0.8 }]);

  Z(1, 'Visina na hipotenuzu deli je na odsečke $p = 4 cm$ i $q = 9 cm$. Kolika je visina?',
    ['$6 cm$', '$13 cm$', '$36 cm$', '$5 cm$'],
    [K('Po Euklidovoj teoremi: $h² = p · q$.', ['h']),
     K('$h² = 4 · 9 = 36$, pa je $h = 6 cm$.'),
     K('Visina je geometrijska sredina odsečaka na hipotenuzi.', [], euklid(13, 4, 9, 6))]);

  Z(1, 'U pravouglom trouglu hipotenuza je $25 cm$, a projekcija katete $a$ na hipotenuzu je $9 cm$. Kolika je kateta $a$?',
    ['$15 cm$', '$16 cm$', '$12 cm$', '$20 cm$'],
    [K('Po Euklidovoj teoremi: $a² = c · p$, gde je $p$ projekcija katete $a$ na hipotenuzu.'),
     K('$a² = 25 · 9 = 225$, pa je $a = 15 cm$.'),
     K('To je trojka $15, 20, 25$ (od $3, 4, 5$ puta $5$).')]);

  Z(2, 'U pravouglom trouglu su katete $6 cm$ i $8 cm$. Koliki su odsečci na koje visina iz pravog ugla deli hipotenuzu?',
    ['$3,6 cm$ i $6,4 cm$', '$4 cm$ i $6 cm$', '$3 cm$ i $7 cm$', '$4,8 cm$ i $5,2 cm$'],
    [K('Hipotenuza: $c = √{6² + 8²} = √{100} = 10 cm$.'),
     K('$a² = c · p$ → $36 = 10 · p$, pa je $p = 3,6 cm$.'),
     K('$q = c − p = 10 − 3,6 = 6,4 cm$. (Provera: $b² = c · q$ → $64 = 10 · 6,4$ ✓)')]);

  Z(2, 'Visina na hipotenuzu duga je $12 cm$, a jedan odsečak hipotenuze je $9 cm$. Kolika je hipotenuza?',
    ['$25 cm$', '$21 cm$', '$16 cm$', '$30 cm$'],
    [K('$h² = p · q$ → $144 = 9 · q$, pa je $q = 16 cm$.', ['h']),
     K('$c = p + q = 9 + 16 = 25 cm$.'),
     K('Katete bi bile $a² = c · p = 225$ → $a = 15 cm$ i $b² = c · q = 400$ → $b = 20 cm$.')],
    G({ A: [0, 0], B: [25, 0], C: [9, 12], D: [9, 0, 90] },
      [{ p: 'ABC', b: 0 }, { p: 'DBC', b: 2 }, { pu: 'ACB' }, { pu: 'ADC' }, { d: 'CD', o: '12', isp: 1, b: 3, id: 'h' }, { d: 'AD', o: '9' }, { d: 'DB', o: '16' }]));

  Z(3, 'U pravouglom trouglu je kateta $a = 12 cm$, a njena projekcija na hipotenuzu je $p = 7,2 cm$. Kolika je površina trougla?',
    ['$96 cm²$', '$86,4 cm²$', '$54 cm²$', '$60 cm²$'],
    [K('Iz Euklidove teoreme $a² = c · p$: $144 = c · 7,2$, pa je $c = {144|7,2} = 20 cm$.'),
     K('Drugi odsečak: $q = c − p = 20 − 7,2 = 12,8 cm$; kateta $b² = c · q = 20 · 12,8 = 256$, pa je $b = 16 cm$.'),
     K('$P = {a · b|2} = {12 · 16|2} = 96 cm²$. Provera Pitagorinom teoremom: $12² + 16² = 144 + 256 = 400 = 20²$ ✓.')],
    G({ A: [0, 0], B: [20, 0], C: [7.2, 9.6], D: [7.2, 0, 90] },
      [{ p: 'ABC', b: 0 }, { pu: 'ACB' }, { pu: 'ADC' }, { d: 'CD', o: 'h', isp: 1 }, { d: 'AD', o: '7,2' }, { d: 'DB', o: '12,8' }]));

  Z(3, 'U pravouglom trouglu visina na hipotenuzu je $h = 4,8 cm$, a hipotenuza $c = 10 cm$. Koliki su odsečci hipotenuze?',
    ['$3,6 cm$ i $6,4 cm$', '$4 cm$ i $6 cm$', '$2 cm$ i $8 cm$', '$4,8 cm$ i $5,2 cm$'],
    [K('$h² = p · q$, a $p + q = c = 10$. Dakle $p · q = 4,8² = 23,04$ i $p + q = 10$.'),
     K('Rešenja jednačine $x² − 10x + 23,04 = 0$ su $3,6$ i $6,4$.'),
     K('Provera: $3,6 · 6,4 = 23,04$ i $3,6 + 6,4 = 10$ ✓. Katete su $6 cm$ i $8 cm$.')]);

  // ════════════════ 1.7 Primena sličnosti ════════════════
  L('Primena sličnosti');

  Z(1, 'Drvo baca senku dugu $12 m$, a štap visok $1,5 m$ u isto vreme baca senku od $2 m$. Koliko je visoko drvo?',
    ['$9 m$', '$8 m$', '$12 m$', '$16 m$'],
    [K('Sunčevi zraci padaju pod istim uglom, pa su trouglovi (drvo i njegova senka, štap i njegova senka) slični.'),
     K('${h|12} = {1,5|2}$, pa je $h = {12 · 1,5|2} = 9 m$.'),
     K('Visina i senka su proporcionalne veličine.')]);

  Z(2, 'Na planu razmere $1 : 250$ soba je pravougaonik $6 cm × 4 cm$. Kolika je stvarna površina sobe?',
    ['$150 m²$', '$60 m²$', '$15 m²$', '$600 m²$'],
    [K('Stvarne dimenzije: $6 · 250 = 1500 cm = 15 m$ i $4 · 250 = 1000 cm = 10 m$.'),
     K('$P = 15 · 10 = 150 m²$.'),
     K('Pazi: površine se odnose kao $250²$, ali ovde je jednostavnije prvo preračunati stranice.')]);

  Z(2, 'Fotografija dimenzija $10 cm × 15 cm$ uvećana je tako da je duža stranica $24 cm$. Kolika je kraća stranica?',
    ['$16 cm$', '$18 cm$', '$14 cm$', '$20 cm$'],
    [K('Uvećanje je sličnost sa koeficijentom $k = {24|15} = {8|5}$.'),
     K('Kraća stranica: $10 · {8|5} = 16 cm$.'),
     K('Provera razmere: ${10|15} = {2|3}$ i ${16|24} = {2|3}$ ✓.')]);

  Z(3, 'U podne štap visok $2 m$ baca senku dugu $2,5 m$. U isto vreme dimnjak baca senku dugu $37,5 m$. Koliko je visok dimnjak?',
    ['$30 m$', '$37,5 m$', '$25 m$', '$32 m$'],
    [K('Sunčevi zraci padaju pod istim uglom, pa su trougao (štap, senka) i trougao (dimnjak, senka) slični.'),
     K('${h|37,5} = {2|2,5}$, pa je $h = {37,5 · 2|2,5} = 30 m$.'),
     K('Provera razmere: ${2|2,5} = 0,8$ i ${30|37,5} = 0,8$ ✓.')]);

  Z(3, 'Čovek visok $1,8 m$ stoji $3 m$ od ulične lampe i baca senku dugu $1,5 m$. Kolika je visina lampe?',
    ['$5,4 m$', '$4,5 m$', '$3,6 m$', '$6 m$'],
    [K('Vrh lampe, vrh senke i vrh čoveka čine slične pravougle trouglove (zraci svetlosti su prave).'),
     K('Sličnost: ${h|3 + 1,5} = {1,8|1,5}$, gde je $h$ visina lampe.'),
     K('$h = {4,5 · 1,8|1,5} = 5,4 m$.')]);

  // ════════════ dopuna do 10 po lekciji ════════════

  L('Proporcionalnost duži');
  Z(1, 'Duž $AB$ duga je $18 cm$, a duž $CD$ duga je $12 cm$. Koliki je odnos $AB : CD$?',
    ['$3 : 2$', '$2 : 3$', '$9 : 4$', '$3 : 4$'],
    [K('$18 : 12$; oba broja delimo sa $6$: $3 : 2$.')]);
  Z(2, 'Duž $AB$ podeljena je tačkom $C$ u razmeri $3 : 4$ (od $A$). Ako je $AB = 28 cm$, kolika je duž $AC$?',
    ['$12 cm$', '$16 cm$', '$7 cm$', '$9 cm$'],
    [K('$3 + 4 = 7$ delova; jedan deo je $28 : 7 = 4 cm$.'),
     K('$AC = 3 · 4 = 12 cm$.')]);
  Z(3, 'Duži $a$ i $b$ odnose se kao $5 : 2$. Ako je $a = 20 cm$, kolika je duž $b$?',
    ['$8 cm$', '$10 cm$', '$4 cm$', '$16 cm$'],
    [K('${5|2} = {20|b}$, pa je $b = {2 · 20|5} = 8 cm$.')]);

  L('Talesova teorema');
  Z(2, 'Dve paralelne prave seku krake ugla: $OA = 6 cm$, $AB = 9 cm$, $OC = 8 cm$. Kolika je duž $CD$?',
    ['$12 cm$', '$10 cm$', '$14 cm$', '$6 cm$'],
    [K('${OA|AB} = {OC|CD}$, tj. ${6|9} = {8|CD}$.'),
     K('$CD = {9 · 8|6} = 12 cm$.', [], tales(6, 9, 8, 12))]);
  Z(2, 'Dve paralelne prave seku krake ugla: $OA = 3 cm$, $OB = 12 cm$, $OC = 5 cm$. Kolika je duž $OD$?',
    ['$20 cm$', '$15 cm$', '$10 cm$', '$18 cm$'],
    [K('${OA|OB} = {OC|OD}$, tj. ${3|12} = {5|OD}$.'),
     K('$OD = {12 · 5|3} = 20 cm$.', [], tales(3, 9, 5, 15))]);
  Z(3, 'U trouglu $ABC$ je $DE \| AB$: $D$ na $AC$, $E$ na $BC$. Ako je $CD = 4 cm$, $DA = 8 cm$ i $CE = 5 cm$, kolika je duž $EB$?',
    ['$10 cm$', '$8 cm$', '$6 cm$', '$12 cm$'],
    [K('${CD|DA} = {CE|EB}$, tj. ${4|8} = {5|EB}$.'),
     K('$EB = {8 · 5|4} = 10 cm$.')]);
  Z(3, 'Dve paralelne prave seku krake ugla i na jednom kraku odsecaju duži $6 cm$ i $4 cm$, a na drugom $9 cm$ i $x$. Koliko je $x$?',
    ['$6 cm$', '$4 cm$', '$12 cm$', '$8 cm$'],
    [K('${6|4} = {9|x}$, pa je $x = {4 · 9|6} = 6 cm$.')]);

  L('Primena Talesove teoreme u konstrukcijama');
  Z(2, 'Da bismo duž podelili na $5$ jednakih delova, na pomoćni zrak nanosimo:',
    ['5 jednakih duži', '5 proizvoljnih duži', 'jednu duž', 'duž cele dužine'],
    [K('Nanosimo $5$ jednakih (proizvoljnih) duži na pomoćni zrak.')]);
  Z(3, 'Duž treba podeliti u razmeri $3 : 5$. Na pomoćni zrak nanosimo $8$ jednakih duži. Koju tačku spajamo sa krajem date duži?',
    ['Osmu', 'Petu', 'Treću', 'Prvu'],
    [K('$3 + 5 = 8$ delova; kraj duži spajamo sa osmom tačkom.'),
     K('Kroz treću tačku povučemo paralelu – ona deli duž u razmeri $3 : 5$.')]);
  Z(2, 'Duž duga $12 cm$ podeljena je Talesovom konstrukcijom na $3$ jednaka dela. Koliki je jedan deo?',
    ['$4 cm$', '$3 cm$', '$6 cm$', '$2 cm$'],
    [K('$12 : 3 = 4 cm$.')]);
  Z(3, 'Konstruiše se četvrta proporcionala: $a = 8 cm$, $b = 4 cm$, $c = 6 cm$, a traži se $x$ tako da je $a : b = c : x$. Kolika je $x$?',
    ['$3 cm$', '$12 cm$', '$6 cm$', '$4 cm$'],
    [K('$x = {b · c|a} = {4 · 6|8} = 3 cm$.')]);
  Z(3, 'Duž duga $20 cm$ podeljena je u razmeri $3 : 2$. Koliki su delovi?',
    ['$12 cm$ i $8 cm$', '$15 cm$ i $5 cm$', '$10 cm$ i $10 cm$', '$14 cm$ i $6 cm$'],
    [K('$3 + 2 = 5$ delova; jedan je $20 : 5 = 4 cm$.'),
     K('Delovi: $3 · 4 = 12 cm$ i $2 · 4 = 8 cm$.')]);

  L('Sličnost trouglova');
  Z(2, 'Dva trougla su slična sa koeficijentom $3$. Obim manjeg je $10 cm$. Koliki je obim većeg?',
    ['$30 cm$', '$13 cm$', '$40 cm$', '$20 cm$'],
    [K('Obim većeg je $3$ puta veći: $3 · 10 = 30 cm$.')]);
  Z(2, 'Trouglovi su slični: $AB = 12 cm$ odgovara $A_{1}B_{1} = 6 cm$, a $BC = 8 cm$. Kolika je stranica $B_{1}C_{1}$?',
    ['$4 cm$', '$16 cm$', '$6 cm$', '$3 cm$'],
    [K('Koeficijent (manji prema većem): ${6|12} = {1|2}$.'),
     K('$B_{1}C_{1} = {1|2} · 8 = 4 cm$.')]);
  Z(3, 'Koeficijent sličnosti dva trougla je $2$. Odnos njihovih površina je:',
    ['$4 : 1$', '$2 : 1$', '$1 : 2$', '$8 : 1$'],
    [K('Površine se odnose kao kvadrat koeficijenta: $2² = 4$, dakle $4 : 1$.')]);
  Z(2, 'Odgovarajući uglovi sličnih trouglova su:',
    ['jednaki', 'proporcionalni', 'komplementni', 'suplementni'],
    [K('Slični trouglovi imaju jednake odgovarajuće uglove.')]);

  L('Stavovi sličnosti trouglova');
  Z(1, 'Stav UU kaže da su trouglovi slični ako imaju:',
    ['dva jednaka ugla', 'dve proporcionalne stranice', 'tri jednake stranice', 'jedan jednak ugao'],
    [K('Dovoljna su dva jednaka ugla – treći se sam poklopi.')]);
  Z(2, 'Trouglovi imaju stranice $2, 3, 4$ i $4, 6, 8$. Po kom stavu su slični?',
    ['SSS', 'SUS', 'UU', 'Nisu slični'],
    [K('${4|2} = {6|3} = {8|4} = 2$ – sve stranice proporcionalne, stav SSS.')]);
  Z(3, 'Trouglovi imaju stranice $3, 4, 5$ i $6, 8, 12$. Jesu li slični?',
    ['Ne', 'Da, po SSS', 'Da, po SUS', 'Da, po UU'],
    [K('${6|3} = 2$, ${8|4} = 2$, ali ${12|5} = 2,4 ≠ 2$.'),
     K('Stranice nisu proporcionalne – nisu slični.')]);

  L('Primena sličnosti na pravougli trougao');
  Z(2, 'Euklidova teorema za visinu na hipotenuzu glasi:',
    ['$h² = p · q$', '$h² = p + q$', '$h = p · q$', '$h² = p² + q²$'],
    [K('Visina na hipotenuzu je geometrijska sredina odsečaka: $h² = p · q$.')]);
  Z(2, 'Visina na hipotenuzu deli je na odsečke $p = 3 cm$ i $q = 12 cm$. Kolika je visina?',
    ['$6 cm$', '$15 cm$', '$9 cm$', '$36 cm$'],
    [K('$h² = 3 · 12 = 36$, pa je $h = 6 cm$.')]);
  Z(3, 'Hipotenuza je $c = 12 cm$, a projekcija katete $a$ na hipotenuzu je $p = 3 cm$. Kolika je kateta $a$?',
    ['$6 cm$', '$4 cm$', '$9 cm$', '$36 cm$'],
    [K('$a² = c · p = 12 · 3 = 36$, pa je $a = 6 cm$.')]);
  Z(3, 'Kateta $a = 8 cm$, a hipotenuza $c = 10 cm$. Kolika je projekcija $p$ katete $a$ na hipotenuzu?',
    ['$6,4 cm$', '$4 cm$', '$8 cm$', '$5 cm$'],
    [K('$a² = c · p$, tj. $64 = 10p$, pa je $p = 6,4 cm$.')]);

  L('Primena sličnosti');
  Z(2, 'Drvo baca senku dugu $15 m$, a štap visok $2 m$ baca senku od $3 m$. Koliko je visoko drvo?',
    ['$10 m$', '$22,5 m$', '$12 m$', '$15 m$'],
    [K('${h|15} = {2|3}$, pa je $h = {15 · 2|3} = 10 m$.')]);
  Z(3, 'Na planu razmere $1 : 500$ parcela je pravougaonik $8 cm × 5 cm$. Kolika joj je stvarna površina?',
    ['$1000 m²$', '$2000 m²$', '$100 m²$', '$500 m²$'],
    [K('Stvarne dimenzije: $8 · 500 = 4000 cm = 40 m$ i $5 · 500 = 2500 cm = 25 m$.'),
     K('$P = 40 · 25 = 1000 m²$.')]);
  Z(3, 'Fotografija $9 cm × 12 cm$ uvećana je tako da je duža stranica $20 cm$. Kolika je kraća stranica?',
    ['$15 cm$', '$18 cm$', '$12 cm$', '$16 cm$'],
    [K('$k = {20|12} = {5|3}$; kraća: $9 · {5|3} = 15 cm$.')]);
  Z(3, 'U podne čovek visok $1,8 m$ baca senku $2,4 m$. U isto vreme toranj baca senku $40 m$. Koliko je visok toranj?',
    ['$30 m$', '$32 m$', '$36 m$', '$24 m$'],
    [K('${h|40} = {1,8|2,4}$, pa je $h = {40 · 1,8|2,4} = 30 m$.')]);
  Z(2, 'Na karti razmere $1 : 100.000$ rastojanje je $4 cm$. Koliko je stvarno rastojanje?',
    ['$4 km$', '$40 km$', '$400 m$', '$10 km$'],
    [K('$4 · 100.000 = 400.000 cm = 4.000 m = 4 km$.')]);
};
