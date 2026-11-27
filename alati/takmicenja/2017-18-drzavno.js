// Državno takmičenje iz matematike učenika osnovnih škola, Jagodina, 21. 4. 2018. (DMS)
// https://dms.rs/wp-content/uploads/2018/04/drztak18.pdf (samo postavke – rešenja su naša, provereni računom)
module.exports = {
  godina: '2017/18', nivo: 'drzavno', datum: '21. 4. 2018.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Broj članova biblioteke 2012. bio je za petinu veći nego 2011, 2013. za petinu veći nego 2012, 2014. za petinu veći nego 2013, a 2015. za tri petine manji nego 2014. Ako je 2015. bilo $6176$ članova manje nego 2011, koliko je članova bilo 2015. godine?',
      ['$13 824$', '$20 000$', '$34 560$', '$12 800$'],
      [
        'Neka je 2011. bilo $x$ članova. Svako povećanje za petinu množi sa ${6|5}$: 2014. je bilo $({6|5})³x = {216|125}x$.',
        'Smanjenje za tri petine ostavlja ${2|5}$: 2015. je $ {2|5} · {216|125}x = {432|625}x$.',
        K('Razlika: $x − {432|625}x = {193|625}x = 6176$, pa je $x = 20 000$, a 2015: ${432|625} · 20 000 = 13 824$.', [], C.stubici([['2011', 20000], ['2012', 24000], ['2013', 28800], ['2014', 34560], ['2015', 13824]], { korakY: 10000, maxY: 35000, vrednosti: true, istakni: [4] })),
      ]);
    D(6, 2, 3,
      'Trougao $ABC$ je jednakokrak sa osnovicom $AB$ i uglom pri vrhu $C$ od $30°$. Tačke $D$ i $E$ su podnožja visina iz temena $A$ i $B$, a $F$ i $G$ središta stranica $BC$ i $AC$. Dokaži da su prave $DG$ i $EF$ normalne.',
      [
        'Trougao $ADC$ je pravougli (prav ugao kod $D$), a $G$ središte hipotenuze $AC$: $GD = GC$.',
        K('Zato je trougao $GDC$ jednakokrak sa uglom $30°$ kod $C$: $∡GDC = 30°$, $∡DGC = 120°$, pa prava $DG$ sa pravom $AC$ gradi ugao od $60°$.', ['t1']),
        K('Isto tako je $FE = FC$ (trougao $BEC$), pa je $∡FEC = 30°$: prava $EF$ sa pravom $AC$ gradi ugao od $30°$.', ['t2']),
        'Prave $DG$, $EF$ i $AC$ čine trougao sa uglovima $60°$ i $30°$ uz $AC$ – treći ugao, između $DG$ i $EF$, je $90°$.',
      ],
      G({ C: [0, 0, -90], A: [1.294, 4.83, 45], B: [-1.294, 4.83, 135], D: [-1.121, 4.183, 180], E: [1.121, 4.183, 0], F: [-0.647, 2.415, 180], G: [0.647, 2.415, 0] },
        [{ p: 'ABC' }, { d: 'AD', isp: 1 }, { d: 'BE', isp: 1 }, { d: 'DG', b: 1 }, { d: 'EF', b: 2 }, { p: 'GDC', id: 't1', b: 1, k: 2 }, { p: 'FEC', id: 't2', b: 2, k: 3 }]));
    D(6, 3, 2,
      'Na tabli je napisan trocifren broj čija cifra jedinica nije $0$. U svakom potezu broj sa table se zameni apsolutnom vrednošću razlike tog broja i broja zapisanog istim ciframa obrnutim redom. Dokaži da će posle nekoliko poteza na tabli ostati broj $0$.',
      [
        'Za broj sa ciframa $a, b, c$: $(100a + 10b + c) − (100c + 10b + a) = 99(a − c)$, pa je posle prvog poteza na tabli umnožak broja $99$: $0, 99, 198, …, 891$.',
        K('Umnošci od $99$ imaju lep oblik: $99 · k$ (za $k = 2, …, 9$) ima cifre $k − 1, 9, 10 − k$, a obrnuto je $99 · (11 − k)$. Primer lanca: $198 → 693 → 297 → 495 → 99 → 0$.', [], C.tabela([['~broj', 198, 693, 297, 495, 99, 0], ['~obrnut', 891, 396, 792, 594, 99, '']])),
        'Proverom svih umnožaka od $99$ (njih je samo devet) svaki lanac stiže do $99$, a $99 − 99 = 0$. (Računarskom proverom svih $810$ početnih brojeva – uvek $0$.)',
      ]);
    D(6, 4, 3,
      'Dat je oštrougli trougao $ABC$ i poluprave $Ax$ i $Ay$ takve da uglovi $xAB$ i $yAC$ nemaju zajedničkih tačaka sa trouglom i da je $∡xAB = ∡yAC < 90°$. Neka su $B\'$ i $C\'$ podnožja normala iz $B$ i $C$ na poluprave $Ax$ i $Ay$, a $M$ središte stranice $BC$. Dokaži da je $MB\' = MC\'$.',
      [
        'Neka su $P$ i $Q$ središta $AB$ i $AC$; $PM$ i $QM$ su srednje linije: $PM = QA = {AC|2}$, $QM = PA = {AB|2}$.',
        'U pravouglom trouglu $ABB\'$ je $PB\' = {AB|2}$ (težišna duž na hipotenuzu), a u $ACC\'$ je $QC\' = {AC|2}$. Dakle $PB\' = QM$ i $PM = QC\'$.',
        'Neka je $φ = ∡xAB = ∡yAC$. Trougao $APB\'$ je jednakokrak, pa je $∡B\'PB = 2φ$ (spoljašnji ugao). $PM ∥ AC$ daje $∡BPM = ∡BAC = α$. Zato je $∡B\'PM = 2φ + α$, a isto tako $∡C\'QM = 2φ + α$.',
        'Trouglovi $B\'PM$ i $MQC\'$ su podudarni (SUS), pa je $MB\' = C\'M$.',
      ]);
    Z(6, 5, 2,
      'Koliko ima parnih petocifrenih brojeva čije su sve cifre različite, različite od nule, i svake dve su uzajamno proste?',
      ['$144$', '$120$', '$96$', '$288$'],
      [
        'Parne cifre $2, 4, 6, 8$ nisu uzajamno proste međusobno, pa broj ima tačno jednu parnu cifru – poslednju.',
        'Ostale četiri cifre su neparne, iz $\\{1, 3, 5, 7, 9\\}$, ali $3$ i $9$ ne smeju zajedno. Četvorke: $\\{1, 3, 5, 7\\}$ i $\\{1, 5, 7, 9\\}$.',
        K('Parna cifra mora biti uzajamno prosta sa svima: $6$ ne može (deljiva sa $3$, a svaka četvorka sadrži $3$ ili $9$); mogu $2, 4, 8$.', [], C.tabela([['~poslednja', 2, 4, 8, 6], ['~sa {1,3,5,7}', '~da', '~da', '~da', '~ne'], ['~sa {1,5,7,9}', '~da', '~da', '~da', '~ne']])),
        'Izbora: $2 · 3 = 6$, a prve četiri cifre raspoređujemo na $4! = 24$ načina: $6 · 24 = 144$.',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'Koliko ima petocifrenih palindroma $x$ (čitaju se isto sa obe strane) takvih da je i $3x$ petocifreni palindrom?',
      ['$48$', '$27$', '$64$', '$36$'],
      [
        'Neka je $x$ sa ciframa $a, b, c, b, a$. $3x$ je petocifren, pa je $x < 33 334$, tj. $a ∈ \\{1, 2, 3\\}$.',
        'Poslednja cifra od $3x$ je poslednja cifra od $3a$, a prva je $3a$ (ako nema prenosa na čelo). Pokazuje se da palindrom $3x$ nastaje tačno kad u množenju nema nijednog prenosa: svaka cifra puta $3$ manja od $10$.',
        K('Zato je $b, c ∈ \\{0, 1, 2, 3\\}$ i $a ∈ \\{1, 2, 3\\}$: $3 · 4 · 4 = 48$ brojeva (npr. $12321 · 3 = 36963$).', [], C.tabela([['x', 10001, 12321, 31313], ['3x', 30003, 36963, 93939]])),
        'Sa prenosom bi se cifre $3x$ „pomerile“ nesimetrično (npr. $14041 · 3 = 42123$ nije palindrom) – proverom svih slučajeva dobija se tačno $48$.',
      ]);
    D(7, 2, 3,
      'Neka je $A_{1}A_{2}…A_{12}$ pravilni dvanaestougao, a $D$ i $E$ podnožja visina iz temena $A_{8}$ i $A_{1}$ trougla $A_{1}A_{5}A_{8}$. Neka je $M$ podnožje normale iz tačke $D$ na $A_{1}A_{8}$. Dokaži da je $A_{1}M = A_{8}E$.',
      [
        'Uglovi trougla su periferijski, polovine lukova: luk $A_{5}A_{8}$ je $3 · 30° = 90°$, $A_{1}A_{5}$ je $120°$, $A_{8}A_{1}$ je $150°$.',
        'Zato je $∡A_{1} = 45°$, $∡A_{8} = 60°$, $∡A_{5} = 75°$.',
        'Trougao $A_{1}DA_{8}$ je pravougli sa uglom $45°$ – jednakokraki, pa normala $DM$ na hipotenuzu pada u njeno središte: $A_{1}M = {A_{1}A_{8}|2}$.',
        'Trougao $A_{1}EA_{8}$ je pravougli sa uglom $60°$ kod $A_{8}$ – polovina jednakostraničnog: $A_{8}E = {A_{1}A_{8}|2}$. Dakle $A_{1}M = A_{8}E$.',
      ]);
    D(7, 3, 3,
      'Nad prečnikom $AB$ je polukružnica $k(O, r)$. Kružnica $k_{1}(O_{1}, r_{1})$ dodiruje prečnik $AB$ u njegovom središtu i polukružnicu $k$. Kružnice $k_{2}(O_{2}, r_{2})$ i $k_{3}(O_{3}, r_{3})$ dodiruju polukružnicu $k$, prečnik $AB$ i kružnicu $k_{1}$. Dokaži da su tačke $O$, $O_{2}$, $O_{1}$ i $O_{3}$ temena romba.',
      [
        '$k_{1}$ dodiruje $AB$ u $O$ i $k$ iznutra, pa je njen prečnik $r$: $r_{1} = {r|2}$, $O_{1}$ na visini ${r|2}$ iznad $O$.',
        'Neka je $O_{2} = (x, r_{2})$ (koordinate, $O$ u početku). Dodir sa $k$: $OO_{2} = r − r_{2}$, tj. $x² + r_{2}² = (r − r_{2})²$, pa $x² = r² − 2rr_{2}$.',
        'Dodir sa $k_{1}$: $O_{1}O_{2} = {r|2} + r_{2}$: $x² + ({r|2} − r_{2})² = ({r|2} + r_{2})²$, pa $x² = 2rr_{2}$. Iz obe: $r_{2} = {r|4}$.',
        K('Tada $OO_{2} = r − {r|4} = {3r|4}$ i $O_{1}O_{2} = {r|2} + {r|4} = {3r|4}$; simetrično za $O_{3}$. Sve četiri stranice su ${3r|4}$ – romb (nije kvadrat).', [], G({ O: [0, 0, -90], O1: [0, 2, 90], O2: [2.828, 1, 0], O3: [-2.828, 1, 180] }, [{ l: 'O', r: 4, od: 0, do: 180 }, { lin: [[-4, 0], [4, 0]] }, { kr: 'O1', r: 2, b: 4 }, { kr: 'O2', r: 1, b: 4 }, { kr: 'O3', r: 1, b: 4 }, { p: 'OO2O1O3', b: 1 }])),
      ]);
    Z(7, 4, 2,
      'Koji su svi realni brojevi $a$ takvi da su $a + √{15}$ i ${1|a} − √{15}$ celi brojevi?',
      ['$a = 4 − √{15}$ i $a = −4 − √{15}$', 'samo $a = 4 − √{15}$', '$a = ±4 + √{15}$', 'ne postoje'],
      [
        'Neka je $a + √{15} = m$ i ${1|a} − √{15} = n$ (celi). Tada $a = m − √{15}$ i ${1|a} = n + √{15}$.',
        'Proizvod: $(m − √{15})(n + √{15}) = 1$, tj. $mn − 15 + (m − n)√{15} = 1$. Kako je $√{15}$ iracionalan, mora $m = n$ i $m² − 15 = 1$, pa je $m = ±4$.',
        'Rešenja: $a = 4 − √{15}$ (tada ${1|a} = 4 + √{15}$) i $a = −4 − √{15}$ (tada ${1|a} = −4 + √{15}$).',
      ]);
    D(7, 5, 3,
      'Na tabli su napisana $24$ različita prirodna broja ne veća od $50$. Dokaži da među njima postoje dva čiji je zbir deljiv sa $7$.',
      [
        'Grupišemo brojeve po ostatku pri deljenju sa $7$.',
        K('Do $50$: ostatak $1$ ima $8$ brojeva ($1, 8, …, 50$), ostaci $2$–$6$ i $0$ po $7$.', [], C.tabela([['~ostatak', 0, 1, 2, 3, 4, 5, 6], ['~brojeva', 7, 8, 7, 7, 7, 7, 7]])),
        'Zbir je deljiv sa $7$ ako su ostaci $(1, 6)$, $(2, 5)$, $(3, 4)$ ili oba $0$. Iz para klasa smemo uzeti samo jednu, a iz klase $0$ najviše jedan broj.',
        'Najviše: klasa $1$ ($8$) + klasa $2$ ili $5$ ($7$) + klasa $3$ ili $4$ ($7$) + jedan iz klase $0$ = $23$. Zato je $24$ uvek dovoljno.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 3,
      'Tablica $29 × 41$ ($41$ red, $29$ kolona) popunjena je brojevima $1, 2, …, 29 · 41$: prvo po redovima (u prvom redu od donjeg levog ugla $1$–$29$, u drugom $30$–$58$, …), a zatim po kolonama ($1$–$41$ u prvoj koloni, $42$–$82$ u drugoj…). U koliko polja je u oba popunjavanja isti broj?',
      ['$5$', '$1$', '$29$', '$13$'],
      [
        'Polje u redu $i$ i koloni $j$ (od $0$): po redovima broj $29i + j + 1$, po kolonama $41j + i + 1$.',
        'Jednako: $29i + j = 41j + i$, tj. $28i = 40j$, odnosno $7i = 10j$.',
        K('Rešenja sa $0 ≤ i ≤ 40$, $0 ≤ j ≤ 28$: $i = 10t$, $j = 7t$, $t = 0, 1, 2, 3, 4$ – pet polja.', [], C.tabela([['t', 0, 1, 2, 3, 4], ['~red i', 0, 10, 20, 30, 40], ['~kolona j', 0, 7, 14, 21, 28], ['~broj', 1, 298, 595, 892, 1189]])),
      ]);
    Z(8, 2, 2,
      'Realni brojevi $x, y, z$ zadovoljavaju $x + y + z = 8$ i $x² + y² + z² = 32$. Kolika je najveća moguća vrednost $z$?',
      ['${16|3}$', '$4$', '$8$', '$4√2$'],
      [
        '$x + y = 8 − z$ i $x² + y² = 32 − z²$. Uvek važi $x² + y² ≥ {(x + y)²|2}$ (jer je $(x − y)² ≥ 0$).',
        '$32 − z² ≥ {(8 − z)²|2}$ ⇒ $64 − 2z² ≥ 64 − 16z + z²$ ⇒ $3z² − 16z ≤ 0$ ⇒ $0 ≤ z ≤ {16|3}$.',
        'Za $z = {16|3}$: $x = y = {4|3}$ – provera: ${4|3} + {4|3} + {16|3} = 8$ ✓, ${16 + 16 + 256|9} = 32$ ✓. Najveće $z = {16|3}$.',
      ]);
    Z(8, 3, 3,
      'Bočna strana $OAB$ trostrane piramide $OABC$ je jednakostranični trougao stranice $6√3 cm$. Ivice $CA$, $CB$ i $CO$ su jednake, a visina piramide iz $O$ je $OO_{1} = 4,5√3 cm$. Kolika je površina preseka piramide ravni $COO_{1}$?',
      ['$13,5√3 cm²$', '$27√3 cm²$', '$18 cm²$', '$9√3 cm²$'],
      [
        'Postavimo trougao $OAB$ u ravan: $A(−3√3, 0, 0)$, $B(3√3, 0, 0)$, $O(0, 9, 0)$. $C$ je jednako udaljen od $O, A, B$, pa je iznad centra trougla: $C(0, 3, t)$.',
        'Ravan $ABC$ sadrži $x$-osu i tačku $C$; rastojanje od $O$ do nje je ${9t|√{t² + 9}} = 4,5√3$, odakle je $t² = 27$, $t = 3√3$.',
        'Zbog simetrije (sve je simetrično u odnosu na ravan $x = 0$) ravan $COO_{1}$ je baš ravan simetrije, i seče piramidu po trouglu $O$, $C$, $N$ gde je $N$ središte $AB$.',
        K('$N(0, 0, 0)$, $O(0, 9, 0)$, $C(0, 3, 3√3)$: osnovica $NO = 9$, visina iz $C$ je $3√3$, pa je površina ${1|2} · 9 · 3√3 = 13,5√3 cm²$.', [], C.prostor({ A: [-5.2, 0, 0], B: [5.2, 0, 0], O: [0, 9, 0], C: [0, 3, 5.2], N: [0, 0, 0] }, [{ d: 'AB' }, { d: 'AO', isp: 1 }, { d: 'BO' }, { d: 'CA' }, { d: 'CB' }, { d: 'CO' }, { p: 'NOC', b: 1 }])),
      ]);
    // VIII.4: k1 – centar (0, 0), r = 3 (C, D krajevi prečnika); k2 – centar (2, 1), r = 3,75. Tačke izračunate,
    // jednakost proverena računom (obe strane ≈ 32,20).
    D(8, 4, 3,
      'Kružnice $k_{1}$ i $k_{2}$ seku se u tačkama $A$ i $B$. Neka je $CD$ prečnik kružnice $k_{1}$, pri čemu je tačka $C$ izvan kružnice $k_{2}$, a tačka $D$ unutar nje. Prave $AD$ i $BD$ redom seku kružnicu $k_{2}$ još u tačkama $M$ i $N$, a prave $CD$ i $MN$ se seku u tački $E$. Dokaži da je $AC · BD · EN = AD · BC · EM$.',
      [
        K('$CD$ je prečnik kružnice $k_{1}$, a $A$ i $B$ su na njoj, pa su uglovi nad prečnikom pravi: $∡CAD = ∡CBD = 90°$.', ['cad', 'cbd']),
        K('Trouglovi $DEM$ i $DEN$ imaju zajedničko teme $D$, a osnovice $EM$ i $EN$ na istoj pravoj, pa je $P_{DEM} : P_{DEN} = EM : EN$. Isti trouglovi imaju i zajedničku stranicu $DE$, pa se površine odnose i kao rastojanja tačaka $M$ i $N$ od prave $CD$.', ['dem', 'den']),
        K('Rastojanje tačke $A$ od prave $CD$ je visina pravouglog trougla $CAD$ na hipotenuzu: $h_{A} = {AC · AD|CD}$ (dvostruka površina). Tačka $M$ je na pravoj $AD$, pa je (Talesova teorema) rastojanje tačke $M$ od $CD$ jednako $h_{A} · {DM|DA} = {AC · DM|CD}$. Isto tako je rastojanje tačke $N$ jednako ${BC · DN|CD}$.', ['ha', 'hm', 'hb']),
        'Iz prethodna dva koraka: ${EM|EN} = {AC · DM|BC · DN}$.',
        K('Tetive $AM$ i $BN$ kružnice $k_{2}$ seku se u $D$. Trouglovi $DAB$ i $DNM$ su slični: uglovi kod $D$ su unakrsni, a $∡DAB = ∡MAB = ∡MNB = ∡DNM$ (periferijski uglovi nad lukom $MB$). Zato je $DA : DN = DB : DM$, tj. ${DM|DN} = {DB|DA}$.', ['dab', 'dnm']),
        'Uvrstimo: ${EM|EN} = {AC · BD|BC · AD}$, odnosno $AC · BD · EN = AD · BC · EM$. ∎',
        'Zanimljivo: prava $MN$ je uvek normalna na prečnik $CD$ – na crtežu se vidi da je $E$ podnožje normale iz $M$ i iz $N$.',
      ],
      G({ o1: [0, 0], o2: [2, 1], C: [-3, 0, 180], D: [3, 0, 135], A: [-1.35, 2.68, 120], B: [1.33, -2.69, 250], M: [5.01, -1.24, -45], N: [5.01, 3.24, 45], E: [5.01, 0, 0], a0: [-1.35, 0], b0: [1.33, 0] },
        [{ kr: 'o1', r: 3 }, { kr: 'o2', r: 3.75, b: 2 }, { tx: 'k₁', at: [-2.6, -2.6] }, { tx: 'k₂', at: [5.4, 4.2], b: 2 },
          { d: 'CE' }, { d: 'AM' }, { d: 'BN' }, { d: 'MN' }, { d: 'AC', isp: 1 }, { d: 'BC', isp: 1 },
          { tacka: 'A' }, { tacka: 'B' }, { tacka: 'D' }, { tacka: 'M' }, { tacka: 'N' }, { tacka: 'E' },
          { p: 'CAD', id: 'cad', b: 3, k: 1, kraj: 2 }, { p: 'CBD', id: 'cbd', b: 4, k: 1, kraj: 2 }, { pu: 'CAD', b: 3, k: 1, kraj: 2 }, { pu: 'CBD', b: 4, k: 1, kraj: 2 },
          { p: 'DEM', id: 'dem', b: 1, k: 2, kraj: 3 }, { p: 'DEN', id: 'den', b: 3, k: 2, kraj: 3 },
          { d: 'Aa0', id: 'ha', b: 3, isp: 1, k: 3, kraj: 4 }, { d: 'ME', id: 'hm', b: 1, k: 3, kraj: 4 }, { d: 'Bb0', id: 'hb', b: 4, isp: 1, k: 3, kraj: 4 },
          { p: 'DAB', id: 'dab', b: 3, k: 5, kraj: 6 }, { p: 'DNM', id: 'dnm', b: 4, k: 5, kraj: 6 }, { pu: 'DEN', b: 5, k: 7 }]));
    Z(8, 5, 3,
      'Na koliko načina je moguće obojiti brojeve $1, 2, …, 9$, svaki jednom od tri boje (plava, bela, crvena), tako da nikoja dva broja čiji je zbir neparan nisu iste boje?',
      ['$138$', '$144$', '$96$', '$162$'],
      [
        'Zbir je neparan tačno za par paran–neparan. Dakle nijedna boja ne sme biti i na nekom parnom i na nekom neparnom broju: neparni ($1, 3, 5, 7, 9$) i parni ($2, 4, 6, 8$) koriste disjunktne skupove boja.',
        'Neparni koriste tačno jednu boju: $3$ izbora; parni tada bilo koju od ostale dve: $2^{4} = 16$. Ukupno $48$.',
        'Neparni koriste tačno dve boje: izbor para $3$, a bojenja pet brojeva sa obe boje $2^{5} − 2 = 30$; parni moraju u treću boju: $1$ način. Ukupno $90$.',
        K('Sve tri boje na neparnima ne mogu (parni ne bi imali boju). Ukupno $48 + 90 = 138$.', [], C.tabela([['~boja za neparne', 1, 2], ['~načina neparni', 3, '3 · 30'], ['~načina parni', 16, 1], ['~ukupno', 48, 90]])),
      ]);
  },
};
