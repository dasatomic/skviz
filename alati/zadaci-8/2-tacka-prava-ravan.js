// Tačka, prava, ravan — 8. razred: osnovni pojmovi geometrije u prostoru.
module.exports = ({ L, Z, G, K, telo }) => {

  // ════════════════ 2.1 Odnos tačke i prave; određenost prave ════════════════
  L('Odnos tačke i prave; određenost prave');

  Z(1, 'Kroz koliko tačaka je jednoznačno određena prava?',
    ['Kroz dve', 'Kroz jednu', 'Kroz tri', 'Kroz četiri'],
    [K('Kroz jednu tačku prolazi beskonačno mnogo pravih.'),
     K('Kroz dve različite tačke prolazi tačno jedna prava.'),
     K('To je osnovna osobina prave: dve tačke je jednoznačno određuju.')]);

  Z(1, 'Koliko pravih prolazi kroz jednu datu tačku $A$?',
    ['Beskonačno mnogo', 'Tačno jedna', 'Tačno dve', 'Nijedna'],
    [K('Kroz jednu tačku može se povući bezbroj pravih – sve one čine „pramen“ pravih kroz $A$.'),
     K('Zato je za jednoznačno određivanje prave potrebna još jedna tačka.')]);

  Z(2, 'Koliko najviše pravih određuju $4$ tačke u istoj ravni, ako nikoje tri nisu na istoj pravoj?',
    ['6', '4', '12', '8'],
    [K('Prava je određena parom tačaka; tražimo broj parova od $4$ tačke.'),
     K('$C_{4}^{2} = {4 · 3|2} = 6$ pravih.'),
     K('To su stranice i dijagonale četvorougla: $4$ stranice + $2$ dijagonale = $6$.')]);

  Z(3, 'Koliko najviše preseka može imati $5$ pravih u ravni, ako nikoje dve nisu paralelne i nikoje tri se ne seku u istoj tački?',
    ['10', '5', '15', '20'],
    [K('Svake dve prave daju po jedan presek: broj parova od $5$ pravih.'),
     K('$C_{5}^{2} = {5 · 4|2} = 10$ preseka.'),
     K('Proveri crtanjem za $3$ prave: $3$ preseka; za $4$: $6$; za $5$: $10$.')]);

  // ════════════════ 2.2 Odnos tačke, prave i ravni; određenost ravni ════════════════
  L('Odnos tačke, prave i ravni; određenost ravni');

  Z(1, 'Koliko tačaka jednoznačno određuje ravan?',
    ['Tri nekolinearne', 'Dve', 'Tri bilo koje', 'Četiri'],
    [K('Kroz jednu ili dve tačke prolazi beskonačno mnogo ravni.'),
     K('Kroz tri kolinearne tačke takođe prolazi beskonačno mnogo ravni (kao „listovi knjige“).'),
     K('Ravan je jednoznačno određena trima tačkama koje ne leže na istoj pravoj (nekolinearne).')]);

  Z(1, 'Sto sa tri noge nikad se ne klima, a sto sa četiri može. Zašto?',
    ['Tri nekolinearne tačke uvek leže u jednoj ravni', 'Tri noge su uvek jednake', 'Četiri noge su teže', 'Zbog težine stola'],
    [K('Krajevi tri noge su tri nekolinearne tačke, a tri nekolinearne tačke uvek leže u tačno jednoj ravni.'),
     K('Krajevi četiri noge su četiri tačke, a četiri tačke ne moraju sve da leže u istoj ravni – zato se četvoronožni sto klima na neravnom podu.')]);

  Z(2, 'Koliko ravni prolazi kroz dve date tačke?',
    ['Beskonačno mnogo', 'Tačno jedna', 'Tačno dve', 'Nijedna'],
    [K('Dve tačke određuju pravu kroz sebe.'),
     K('Kroz tu pravu prolazi beskonačno mnogo ravni (kao listovi knjige oko kičme).'),
     K('Zato dve tačke nisu dovoljne za jednoznačno određivanje ravni.')]);

  Z(3, 'Koliko najviše ravni prolazi kroz pravu $p$ i tačku $A$ koja ne leži na $p$?',
    ['Tačno jedna', 'Beskonačno mnogo', 'Dve', 'Nijedna'],
    [K('Prava $p$ i tačka $A$ van nje jednoznačno određuju ravan.'),
     K('Zašto: uzmemo dve tačke na $p$; sa tačkom $A$ to su tri nekolinearne tačke, a one određuju tačno jednu ravan.'),
     K('Dakle, tačno jedna ravan sadrži datu pravu i datu tačku van nje.')]);

  // ════════════════ 2.3 Međusobni odnosi pravih ════════════════
  L('Međusobni odnosi pravih');

  Z(1, 'Dve prave u ravni koje se ne seku zovu se…',
    ['paralelne', 'mimoilazne', 'normalne', 'podudarne'],
    [K('Dve prave u istoj ravni ili se seku (imaju jednu zajedničku tačku) ili su paralelne (nemaju zajedničkih tačaka).'),
     K('Mimoilazne prave postoje samo u prostoru – ne leže u istoj ravni.'),
     K('Normalne prave se seku pod pravim uglom.')]);

  Z(2, 'Koliko zajedničkih tačaka imaju dve paralelne prave?',
    ['Nijednu', 'Jednu', 'Dve', 'Beskonačno mnogo'],
    [K('Paralelne prave se ne seku, pa nemaju nijednu zajedničku tačku.'),
     K('Prave koje se seku imaju tačno jednu zajedničku tačku.'),
     K('Dve prave koje se poklapaju imaju beskonačno mnogo zajedničkih tačaka.')]);

  Z(2, 'Ako je prava $a$ paralelna sa $b$, a $b$ paralelna sa $c$, šta važi za $a$ i $c$?',
    ['Paralelne su', 'Seku se', 'Mimoilazne su', 'Normalne su'],
    [K('Odnos paralelnosti je tranzitivan: ako je $a \\| b$ i $b \\| c$, onda je i $a \\| c$.'),
     K('Ili se $a$ i $c$ poklapaju, ako su sve tri ista prava – ali u svakom slučaju se ne seku.')]);

  Z(3, 'Kroz tačku $A$ van prave $p$, u istoj ravni sa njom, može se povući…',
    ['tačno jedna paralela sa $p$', 'beskonačno mnogo paralela sa $p$', 'nijedna paralela', 'tačno dve paralele'],
    [K('Ovo je Euklidov postulat (aksiom) o paralelama.'),
     K('Kroz tačku van prave prolazi tačno jedna prava paralelna datoj.'),
     K('Ostale prave kroz $A$ seku pravu $p$.')]);

  // ════════════════ 2.4 Mimoilazne prave; presek pravih ════════════════
  L('Mimoilazne prave; presek pravih');

  Z(1, 'Dve prave u prostoru koje se ne seku i nisu paralelne zovu se…',
    ['mimoilazne', 'normalne', 'podudarne', 'kose'],
    [K('Mimoilazne prave ne leže u istoj ravni.'),
     K('Da leže u istoj ravni, morale bi se seći ili biti paralelne.'),
     K('Primer: ivica poda i ivica plafona koje idu u različitim smerovima.')]);

  Z(2, 'Koliko zajedničkih tačaka imaju mimoilazne prave?',
    ['Nijednu', 'Jednu', 'Dve', 'Beskonačno mnogo'],
    [K('Mimoilazne prave se ne seku, pa nemaju zajedničkih tačaka.'),
     K('Razlika u odnosu na paralelne: paralelne leže u istoj ravni, mimoilazne ne.')]);

  Z(2, 'Na kocki, ivica $AB$ i ivica $EH$ su…',
    ['mimoilazne', 'paralelne', 'normalne', 'podudarne'],
    [K('Ivica $AB$ leži u donjoj osnovi, a $EH$ u gornjoj; idu u različitim smerovima i nisu paralelne.'),
     K('Ne seku se i ne leže u istoj ravni – dakle mimoilazne su.', [], telo('kocka', { opis: 'Okreni kocku i pronađi ivice AB i EH' }))]);

  Z(3, 'Koliko parova mimoilaznih ivica ima kocka?',
    ['24', '12', '6', '48'],
    [K('Kocka ima $12$ ivica; svaka ivica je mimoilazna sa tačno $4$ druge ivice.'),
     K('$12 · 4 = 48$, ali smo svaki par brojali dvaput, pa je $48 : 2 = 24$.'),
     K('Provera na kocki: ivica $AB$ je mimoilazna sa $CG$, $DH$, $EH$ i $FG$.')]);

  // ════════════════ 2.5 Odnos prave i ravni; normala na ravan ════════════════
  L('Odnos prave i ravni; normala na ravan');

  Z(1, 'Prava i ravan su paralelne ako…',
    ['nemaju zajedničkih tačaka', 'imaju jednu zajedničku tačku', 'se seku pod pravim uglom', 'leže u istoj ravni'],
    [K('Prava i ravan su paralelne ako nemaju nijednu zajedničku tačku.'),
     K('Ako prava seče ravan u jednoj tački, one se seku.'),
     K('Ako prava leži u ravni, imaju beskonačno mnogo zajedničkih tačaka.')]);

  Z(2, 'Prava je normalna na ravan ako je normalna na…',
    ['dve prave u ravni koje se seku', 'jednu pravu u ravni', 'sve prave osim jedne', 'dve paralelne prave u ravni'],
    [K('Da bi prava bila normalna na ravan, mora biti normalna na svaku pravu u ravni.'),
     K('Dovoljno je proveriti dve prave u ravni koje se seku – ako je prava normalna na obe, normalna je na celu ravan.')]);

  Z(2, 'Koliko normala može se spustiti iz tačke na ravan?',
    ['Tačno jedna', 'Beskonačno mnogo', 'Dve', 'Nijedna'],
    [K('Iz date tačke na ravan može se spustiti tačno jedna normala.'),
     K('Njen podnožni deo na ravni je normalna projekcija tačke.'),
     K('Dužina te normale je rastojanje tačke od ravni.')]);

  Z(3, 'Stub visok $8 m$ stoji normalno na horizontalno tlo. Njegov vrh spojen je zategom sa tačkom na tlu udaljenom $6 m$ od podnožja stuba. Koliko je duga zatega?',
    ['$10 m$', '$14 m$', '$9 m$', '$√{28} m$'],
    [K('Stub, tlo i zatega čine pravougli trougao sa katetama $8 m$ i $6 m$.'),
     K('$d² = 8² + 6² = 64 + 36 = 100$, pa je $d = 10 m$.'),
     K('To je Pitagorina trojka $6, 8, 10$.')]);

  // ════════════════ 2.6 Odnosi dve ravni ════════════════
  L('Odnosi dve ravni');

  Z(1, 'Dve ravni koje se ne seku zovu se…',
    ['paralelne', 'normalne', 'mimoilazne', 'podudarne'],
    [K('Dve ravni koje se ne seku su paralelne (nemaju zajedničkih tačaka).'),
     K('Ako se seku, seku se po pravoj.'),
     K('Mimoilazne mogu biti samo prave, ne i ravni.')]);

  Z(2, 'Po čemu se seku dve ravni koje nisu paralelne?',
    ['Po pravoj', 'Po tački', 'Po duži', 'Ne seku se'],
    [K('Dve ravni koje se seku imaju zajedničku pravu – „presečnu pravu“.'),
     K('Primer: zid i pod u sobi seku se po pravoj duž spoja.'),
     K('Dve ravni se ne mogu seći samo u jednoj tački.')]);

  Z(3, 'Pod i plafon sobe su paralelne ravni na rastojanju $2,7 m$. Lampa visi $1,2 m$ ispod plafona. Koliko je lampa udaljena od poda?',
    ['$1,5 m$', '$3,9 m$', '$1,2 m$', '$2,7 m$'],
    [K('Rastojanje između paralelnih ravni je isto u svakoj tački: svaka tačka plafona je na $2,7 m$ od poda.'),
     K('Lampa je $1,2 m$ ispod plafona, pa je od poda udaljena $2,7 − 1,2 = 1,5 m$.')]);

  // ════════════════ 2.7 Normalna projekcija tačke, prave i duži na ravan ════════════════
  L('Normalna projekcija tačke, prave i duži na ravan');

  Z(1, 'Normalna projekcija tačke na ravan je…',
    ['podnožje normale iz tačke na ravan', 'bilo koja tačka ravni', 'tačka iznad ravni', 'duž do ravni'],
    [K('Normalna projekcija tačke $A$ na ravan je tačka $A′$ u ravni u koju „pada“ normala iz $A$.'),
     K('Duž $AA′$ je normalna na ravan.'),
     K('Projekcija je kao senka kad sunce sija tačno odozgo.')]);

  Z(2, 'Normalna projekcija kose duži na ravan je…',
    ['duž', 'tačka', 'duž jednake dužine', 'prava'],
    [K('Ako duž nije normalna na ravan, njena projekcija je duž (kraća ili jednaka originalu).'),
     K('Ako je duž normalna na ravan, cela se projicira u jednu tačku.'),
     K('Projekcija duži je duž čija je dužina uvek manja ili jednaka dužini originala.')]);

  Z(3, 'Duž $AB$ duga $13 cm$ nagnuta je prema ravni. Njena projekcija na ravan je $5 cm$, a jedan kraj duži leži u ravni. Koliko je drugi kraj udaljen od ravni?',
    ['$12 cm$', '$8 cm$', '$18 cm$', '$10 cm$'],
    [K('Duž $AB$, njena projekcija $A′B$ i normala $AA′$ čine pravougli trougao (hipotenuza je $AB$).'),
     K('$h² = 13² − 5² = 169 − 25 = 144$, pa je $h = 12 cm$.'),
     K('To je Pitagorina trojka $5, 12, 13$.')]);

  // ════════════════ 2.8 Normalna projekcija prave; ugao između prave i ravni ════════════════
  L('Normalna projekcija prave; ugao između prave i ravni');

  Z(1, 'Ugao između prave i ravni je ugao između prave i njene…',
    ['normalne projekcije na ravan', 'normale na ravan', 'bilo koje prave u ravni', 'presečne prave'],
    [K('Ugao između prave i ravni merimo tako što pravu normalno projicujemo na ravan.'),
     K('Ugao između prave i njene projekcije je traženi ugao.'),
     K('Ako je prava paralelna ravni, ugao je $0°$; ako je normalna, ugao je $90°$.')]);

  Z(2, 'Prava je normalna na ravan. Koliki je ugao između nje i ravni?',
    ['$90°$', '$0°$', '$45°$', '$180°$'],
    [K('Ako je prava normalna na ravan, njena projekcija na ravan je tačka.'),
     K('Ugao je tada prav: $90°$.'),
     K('Ako je prava paralelna ravni, ugao je $0°$.')]);

  Z(3, 'Duž duga $10 cm$ nagnuta je prema ravni pod uglom od $30°$. Kolika je njena normalna projekcija na ravan?',
    ['$5√{3} cm$', '$5 cm$', '$10 cm$', '$10√{3} cm$'],
    [K('U pravouglom trouglu koji čine duž, projekcija i normala: projekcija je nalegla kateta ugla od $30°$.'),
     K('Trougao sa uglom od $30°$ je polovina jednakostraničnog trougla: kateta naspram $30°$ je pola hipotenuze, a druga kateta je $√{3}$ puta duža od nje.'),
     K('Hipotenuza je $10 cm$, pa je kraća kateta (normalna na ravan) $5 cm$, a projekcija (duža kateta) je $5√{3} cm ≈ 8,66 cm$.')]);

  // ════════════ dopuna do 10 po lekciji ════════════

  L('Odnos tačke i prave; određenost prave');
  Z(1, 'Dve različite tačke određuju:',
    ['tačno jednu pravu', 'beskonačno mnogo pravih', 'tačno dve prave', 'nijednu pravu'],
    [K('Kroz dve različite tačke prolazi tačno jedna prava.')]);
  Z(2, 'Tačka prema pravoj može biti:',
    ['na pravoj ili van nje', 'samo na pravoj', 'samo van prave', 'uvek van prave'],
    [K('Tačka ili leži na pravoj ili ne leži na njoj.')]);
  Z(2, 'Tri tačke koje leže na istoj pravoj zovu se:',
    ['kolinearne', 'nekolinearne', 'podudarne', 'paralelne'],
    [K('Kolinearne tačke leže na istoj pravoj.')]);
  Z(3, 'Koliko najviše pravih određuju $3$ nekolinearne tačke?',
    ['3', '1', '6', '2'],
    [K('Svaki par tačaka daje po jednu pravu: $3$ prave (stranice trougla).')]);
  Z(3, 'Koliko najviše pravih određuje $5$ tačaka, ako nikoje tri nisu kolinearne?',
    ['10', '5', '20', '15'],
    [K('$C_{5}^{2} = {5 · 4|2} = 10$ pravih.')]);
  Z(2, 'Tačke koje leže na istoj pravoj su:',
    ['kolinearne', 'paralelne', 'normalne', 'simetrične'],
    [K('Kolinearne tačke pripadaju istoj pravoj.')]);

  L('Odnos tačke, prave i ravni; određenost ravni');
  Z(1, 'Tri nekolinearne tačke određuju:',
    ['tačno jednu ravan', 'beskonačno mnogo ravni', 'tačno tri ravni', 'nijednu ravan'],
    [K('Tri tačke koje ne leže na istoj pravoj jednoznačno određuju ravan.')]);
  Z(2, 'Prava i tačka van nje određuju:',
    ['tačno jednu ravan', 'beskonačno mnogo ravni', 'tačno dve ravni', 'nijednu ravan'],
    [K('Prava i tačka van nje jednoznačno određuju ravan.')]);
  Z(2, 'Dve prave koje se seku određuju:',
    ['tačno jednu ravan', 'beskonačno mnogo ravni', 'nijednu ravan', 'dve ravni'],
    [K('Dve prave koje se seku leže u tačno jednoj ravni.')]);
  Z(3, 'Dve paralelne prave određuju:',
    ['tačno jednu ravan', 'beskonačno mnogo ravni', 'nijednu ravan', 'dve ravni'],
    [K('Dve paralelne prave leže u tačno jednoj ravni.')]);
  Z(3, 'Koliko ravni prolazi kroz tri kolinearne tačke?',
    ['Beskonačno mnogo', 'Tačno jedna', 'Tačno tri', 'Nijedna'],
    [K('Kroz tri kolinearne tačke prolazi beskonačno mnogo ravni (kao listovi knjige).')]);
  Z(2, 'Tačka prema ravni može biti:',
    ['u ravni ili van nje', 'samo u ravni', 'samo van ravni', 'uvek van ravni'],
    [K('Tačka ili leži u ravni ili ne leži u njoj.')]);

  L('Međusobni odnosi pravih');
  Z(1, 'Dve prave u istoj ravni:',
    ['seku se ili su paralelne', 'uvek se seku', 'uvek su paralelne', 'uvek su mimoilazne'],
    [K('U ravni, dve prave se ili seku (jedna zajednička tačka) ili su paralelne.')]);
  Z(2, 'Dve prave koje se seku imaju:',
    ['tačno jednu zajedničku tačku', 'nijednu zajedničku tačku', 'beskonačno mnogo zajedničkih tačaka', 'dve zajedničke tačke'],
    [K('Prave koje se seku imaju tačno jednu zajedničku tačku.')]);
  Z(2, 'Normalne prave seku se pod uglom:',
    ['$90°$', '$45°$', '$60°$', '$180°$'],
    [K('Normalne prave su uzajamno normalne – seku se pod pravim uglom.')]);
  Z(2, 'Ako je $a \\| b$ i $b$ normalna na $c$, onda je:',
    ['$a$ normalna na $c$', '$a \\| c$', '$a$ i $c$ se seku', '$a$ i $c$ se poklapaju'],
    [K('Prava $a$ ima pravac prave $b$, a $b$ je normalna na $c$, pa je i $a$ normalna na $c$.')]);
  Z(3, 'Dve prave koje se poklapaju imaju:',
    ['beskonačno mnogo zajedničkih tačaka', 'jednu zajedničku tačku', 'nijednu', 'dve zajedničke tačke'],
    [K('Ako se prave poklapaju, sve tačke su im zajedničke.')]);
  Z(2, 'Koliko najviše preseka mogu imati $3$ prave u ravni, ako nikoje dve nisu paralelne i nikoje tri nisu u istoj tački?',
    ['3', '2', '6', '9'],
    [K('Svake dve prave daju po jedan presek: $C_{3}^{2} = {3 · 2|2} = 3$.')]);

  L('Mimoilazne prave; presek pravih');
  Z(2, 'Da li mimoilazne prave leže u istoj ravni?',
    ['Ne', 'Da', 'Uvek', 'Samo ako su paralelne'],
    [K('Mimoilazne prave ne leže u istoj ravni.')]);
  Z(2, 'Dve prave u prostoru mogu biti:',
    ['paralelne, da se seku ili mimoilazne', 'samo paralelne', 'samo da se seku', 'samo mimoilazne'],
    [K('U prostoru: paralelne, prave koje se seku, ili mimoilazne.')]);
  Z(2, 'Koliko ivica kocke je paralelno sa ivicom $AB$ (ne računajući nju samu)?',
    ['3', '4', '2', '6'],
    [K('Kocka ima po $4$ ivice u svakom od tri pravca; od njih $3$ su paralelne sa $AB$.')]);
  Z(3, 'Jedna ivica kocke je mimoilazna sa koliko drugih ivica?',
    ['4', '2', '6', '8'],
    [K('Svaka ivica kocke je mimoilazna sa tačno $4$ druge ivice.')]);
  Z(2, 'Ako dve prave ne leže u istoj ravni, one su:',
    ['mimoilazne', 'paralelne', 'normalne', 'podudarne'],
    [K('Prave koje ne leže u istoj ravni su mimoilazne.')]);
  Z(3, 'Na kvadru, koliko ivica je mimoilazno sa jednom datom bočnom ivicom?',
    ['4', '2', '3', '6'],
    [K('Bočna ivica je mimoilazna sa dve ivice donje osnove i sa dve ivice gornje osnove koje je ne dodiruju.')]);

  L('Odnos prave i ravni; normala na ravan');
  Z(1, 'Prava i ravan mogu biti:',
    ['paralelne, da se seku, ili prava leži u ravni', 'samo paralelne', 'samo da se seku', 'uvek normalne'],
    [K('Prava i ravan: paralelne (nema zajedničkih tačaka), seku se (jedna tačka), ili prava leži u ravni.')]);
  Z(2, 'Prava je normalna na ravan ako je normalna na:',
    ['svaku pravu u ravni', 'jednu pravu u ravni', 'samo jednu pravu', 'nijednu pravu'],
    [K('Prava normalna na ravan normalna je na svaku pravu u toj ravni.')]);
  Z(2, 'Rastojanje tačke od ravni jednako je:',
    ['dužini normale iz tačke na ravan', 'dužini bilo koje duži do ravni', 'dva puta dužini normale', 'polovini normale'],
    [K('Rastojanje tačke od ravni je dužina najkraće duži – normale.')]);
  Z(2, 'Ako tačka leži u ravni, njeno rastojanje od ravni je:',
    ['0', '1', 'jednako visini', 'ne postoji'],
    [K('Tačka koja leži u ravni je na rastojanju $0$ od nje.')]);
  Z(3, 'Prava koja seče ravan ima sa njom:',
    ['tačno jednu zajedničku tačku', 'nijednu', 'beskonačno mnogo', 'dve'],
    [K('Prava koja seče ravan prolazi kroz nju u tačno jednoj tački.')]);
  Z(3, 'Prava koja leži u ravni ima sa njom:',
    ['beskonačno mnogo zajedničkih tačaka', 'jednu', 'nijednu', 'dve'],
    [K('Sve tačke prave koja leži u ravni su u toj ravni.')]);

  L('Odnosi dve ravni');
  Z(1, 'Dve ravni u prostoru:',
    ['paralelne su ili se seku', 'uvek se seku', 'uvek su paralelne', 'uvek se poklapaju'],
    [K('Dve ravni su paralelne ili se seku (ili se poklapaju).')]);
  Z(2, 'Dve ravni koje se seku, seku se po:',
    ['pravoj', 'tački', 'duži', 'krugu'],
    [K('Presek dve ravni je prava.')]);
  Z(2, 'Paralelne ravni imaju zajedničkih tačaka:',
    ['nijednu', 'jednu', 'dve', 'beskonačno mnogo'],
    [K('Paralelne ravni se ne seku – nemaju zajedničkih tačaka.')]);
  Z(3, 'Rastojanje između dve paralelne ravni je:',
    ['isto u svakoj tački', 'različito u svakoj tački', 'uvek nula', 'uvek beskonačno'],
    [K('Rastojanje između paralelnih ravni je konstantno.')]);
  Z(2, 'Koliko zajedničkih tačaka imaju dve ravni koje se seku?',
    ['Beskonačno mnogo', 'Jednu', 'Dve', 'Nijednu'],
    [K('Dve ravni koje se seku imaju zajedničku pravu, a na pravoj ima beskonačno mnogo tačaka.')]);
  Z(3, 'Dve ravni koje se poklapaju imaju zajedničkih tačaka:',
    ['beskonačno mnogo', 'jednu', 'nijednu', 'dve'],
    [K('Ako se ravni poklapaju, sve tačke su im zajedničke.')]);
  Z(1, 'Pod i plafon sobe su:',
    ['paralelne ravni', 'ravni koje se seku', 'normalne ravni', 'iste ravni'],
    [K('Pod i plafon su paralelne ravni.')]);

  L('Normalna projekcija tačke, prave i duži na ravan');
  Z(1, 'Duž koja spaja tačku sa njenom normalnom projekcijom na ravan je:',
    ['normalna na ravan', 'paralelna ravni', 'kosa prema ravni', 'proizvoljna duž'],
    [K('Ta duž je normala iz tačke na ravan, pa je normalna na ravan.')]);
  Z(2, 'Normalna projekcija duži paralelne ravni je:',
    ['duž jednake dužine', 'tačka', 'kraća duž', 'duža duž'],
    [K('Ako je duž paralelna ravni, njena projekcija je duž iste dužine.')]);
  Z(3, 'Normalna projekcija duži normalne na ravan je:',
    ['tačka', 'duž jednake dužine', 'kraća duž', 'duža duž'],
    [K('Duž normalna na ravan projicira se u jednu tačku.')]);
  Z(2, 'Normalna projekcija kose duži na ravan je:',
    ['duž kraća od originala', 'duž jednake dužine', 'tačka', 'duža duž'],
    [K('Kosa duž se projicira u kraću duž.')]);
  Z(3, 'Duž duga $10 cm$ nagnuta je prema ravni, a njena projekcija je $6 cm$. Koliko je drugi kraj udaljen od ravni?',
    ['$8 cm$', '$4 cm$', '$16 cm$', '$6 cm$'],
    [K('$h² = 10² − 6² = 100 − 36 = 64$, pa je $h = 8 cm$.')]);
  Z(3, 'Duž duga $13 cm$ ima projekciju na ravan $12 cm$. Kolika je normala (udaljenost drugog kraja od ravni)?',
    ['$5 cm$', '$12 cm$', '$13 cm$', '$1 cm$'],
    [K('$h² = 13² − 12² = 169 − 144 = 25$, pa je $h = 5 cm$.')]);
  Z(2, 'Normalna projekcija tačke na pravu je:',
    ['podnožje normale iz tačke na pravu', 'bilo koja tačka prave', 'središte prave', 'tačka van prave'],
    [K('Projekcija tačke na pravu je podnožje normale spuštene na pravu.')]);

  L('Normalna projekcija prave; ugao između prave i ravni');
  Z(1, 'Ugao između prave i ravni je ugao između prave i:',
    ['njene normalne projekcije na ravan', 'normale na ravan', 'bilo koje prave u ravni', 'presečne prave'],
    [K('Ugao merimo između prave i njene projekcije na ravan.')]);
  Z(2, 'Ako je prava paralelna ravni, ugao između njih je:',
    ['$0°$', '$90°$', '$45°$', '$180°$'],
    [K('Prava paralelna ravni sa njom zaklapa ugao $0°$.')]);
  Z(2, 'Ako je prava normalna na ravan, ugao između njih je:',
    ['$90°$', '$0°$', '$45°$', '$180°$'],
    [K('Prava normalna na ravan zaklapa ugao $90°$.')]);
  Z(3, 'Duž duga $12 cm$ nagnuta je prema ravni pod uglom od $60°$. Kolika je njena projekcija na ravan?',
    ['$6 cm$', '$12 cm$', '$6√{3} cm$', '$24 cm$'],
    [K('Trougao sa uglom $60°$ je polovina jednakostraničnog: kateta uz ugao (projekcija) je polovina hipotenuze.'),
     K('Projekcija: $12 : 2 = 6 cm$.')]);
  Z(3, 'Duž duga $8 cm$ nagnuta je prema ravni pod uglom od $45°$. Kolika je njena projekcija?',
    ['$4√{2} cm$', '$4 cm$', '$8 cm$', '$8√{2} cm$'],
    [K('Trougao sa uglovima $45°$ i $90°$ je jednakokraki: projekcija $p$ i normala $h$ su jednake.'),
     K('$p² + p² = 8²$, pa je $2p² = 64$, $p² = 32$ i $p = 4√{2} cm$.')]);
  Z(3, 'Duž $AB$ nagnuta je prema ravni; njena projekcija je $9 cm$, a normala $12 cm$. Kolika je duž $AB$?',
    ['$15 cm$', '$21 cm$', '$13 cm$', '$10 cm$'],
    [K('$AB² = 9² + 12² = 81 + 144 = 225$, pa je $AB = 15 cm$.')]);
  Z(3, 'Ako je projekcija duži na ravan duža od normale na ravan, ugao između duži i ravni je:',
    ['manji od $45°$', 'veći od $45°$', 'tačno $45°$', 'tačno $90°$'],
    [K('Duža projekcija znači da je duž „položenija“ – ugao prema ravni je manji od $45°$.')]);
};
