// Sistemi linearnih jednačina sa dve nepoznate — 8. razred.
module.exports = ({ L, Z, G, K, proveri, r, dvePrave, grafik, A }) => {

  // ════════════════ 7.1 Pojam sistema ════════════════
  L('Pojam sistema linearnih jednačina sa dve nepoznate');

  Z(1, 'Rešenje sistema dve jednačine sa dve nepoznate je…',
    ['uređeni par (x, y) koji zadovoljava obe', 'bilo koji broj', 'samo vrednost x', 'samo vrednost y'],
    [K('Rešenje je par brojeva $(x, y)$ koji zadovoljava OBE jednačine istovremeno.'),
     K('Geometrijski, to je tačka preseka dve prave.')]);

  Z(1, 'Da li je par $(2, 1)$ rešenje sistema $x + y = 3$ i $2x − y = 3$?',
    ['Da', 'Ne', 'Samo prve jednačine', 'Samo druge jednačine'],
    [K('Prva: $2 + 1 = 3$ ✓'),
     K('Druga: $2 · 2 − 1 = 3$ ✓'),
     K('Obe su zadovoljene, pa je $(2, 1)$ rešenje.')]);

  Z(2, 'Koji par je rešenje sistema $x + y = 5$ i $x − y = 1$?',
    ['(3, 2)', '(2, 3)', '(4, 1)', '(1, 4)'],
    [K('Proverimo $(3, 2)$: $3 + 2 = 5$ ✓ i $3 − 2 = 1$ ✓'),
     K('To je tačka preseka pravih $y = 5 − x$ i $y = x − 1$.', [], dvePrave(-1, 5, 1, -1, { podela: 1, kS: 2 }))]);

  // ════════════════ 7.2 Ekvivalentnost sistema ════════════════
  L('Ekvivalentnost sistema linearnih jednačina');

  Z(1, 'Dva sistema su ekvivalentna ako…',
    ['imaju isti skup rešenja', 'imaju iste koeficijente', 'izgledaju isto', 'imaju isti broj jednačina'],
    [K('Ekvivalentni sistemi imaju isti skup rešenja.'),
     K('Mogu se dobiti jedan iz drugog ekvivalentnim transformacijama.')]);

  Z(2, 'Kojom transformacijom sistem ostaje ekvivalentan?',
    ['Množenjem jedne jednačine brojem ≠ 0', 'Množenjem jednačine nulom', 'Brisanjem jedne jednačine', 'Promenom znaka samo jedne nepoznate'],
    [K('Množenje cele jednačine brojem različitim od nule ne menja njen skup rešenja.'),
     K('Zamena redosleda jednačina i dodavanje jedne jednačine drugoj takođe su ekvivalentne transformacije.')]);

  // ════════════════ 7.3 Metoda smene ════════════════
  L('Rešavanje sistema metodom smene');

  Z(1, 'Prvi korak metode smene je…',
    ['izraziti jednu nepoznatu iz jedne jednačine', 'sabrati jednačine', 'pomnožiti obe jednačine', 'nacrtati grafike'],
    [K('Iz jedne jednačine izrazimo jednu nepoznatu (npr. $y$ preko $x$).'),
     K('Zatim je uvrstimo u drugu jednačinu i rešimo po preostaloj nepoznatoj.')]);

  Z(2, 'Reši sistem smenom: $x + y = 6$ i $x − y = 2$.',
    ['$x = 4, y = 2$', '$x = 2, y = 4$', '$x = 3, y = 3$', '$x = 5, y = 1$'],
    [K('Iz prve: $y = 6 − x$. Uvrstimo u drugu: $x − (6 − x) = 2$.'),
     K('$2x − 6 = 2$, pa je $2x = 8$ i $x = 4$.'),
     K('$y = 6 − 4 = 2$. Rešenje: $(4, 2)$.')]);

  Z(2, 'Reši sistem smenom: $y = 2x − 3$ i $x + y = 9$.',
    ['$x = 4, y = 5$', '$x = 3, y = 3$', '$x = 5, y = 4$', '$x = 6, y = 3$'],
    [K('Uvrstimo $y = 2x − 3$ u drugu: $x + 2x − 3 = 9$.'),
     K('$3x = 12$, pa je $x = 4$.'),
     K('$y = 2 · 4 − 3 = 5$. Rešenje: $(4, 5)$.')]);

  Z(3, 'Reši sistem smenom: $2x + y = 7$ i $x − 2y = −4$.',
    ['$x = 2, y = 3$', '$x = 3, y = 1$', '$x = 1, y = 5$', '$x = 2, y = 2$'],
    [K('Iz prve: $y = 7 − 2x$. Uvrstimo u drugu: $x − 2(7 − 2x) = −4$.'),
     K('$x − 14 + 4x = −4$, pa je $5x = 10$ i $x = 2$.'),
     K('$y = 7 − 4 = 3$. Rešenje: $(2, 3)$.')]);

  // ════════════════ 7.4 Metoda suprotnih koeficijenata ════════════════
  L('Rešavanje sistema metodom suprotnih koeficijenata');

  Z(2, 'Reši sistem suprotnim koeficijentima: $x + y = 7$ i $x − y = 3$.',
    ['$x = 5, y = 2$', '$x = 4, y = 3$', '$x = 2, y = 5$', '$x = 6, y = 1$'],
    [K('Koeficijenti uz $y$ su $1$ i $−1$ – suprotni. Saberemo jednačine: $2x = 10$.'),
     K('$x = 5$; iz prve: $5 + y = 7$, pa je $y = 2$.'),
     K('Rešenje: $(5, 2)$.')]);

  Z(2, 'Reši sistem: $2x + y = 8$ i $x + y = 5$.',
    ['$x = 3, y = 2$', '$x = 2, y = 3$', '$x = 4, y = 1$', '$x = 1, y = 4$'],
    [K('Oduzmemo drugu od prve: $(2x + y) − (x + y) = 8 − 5$, pa je $x = 3$.'),
     K('Iz druge: $3 + y = 5$, pa je $y = 2$.'),
     K('Rešenje: $(3, 2)$.')]);

  Z(3, 'Reši sistem: $3x + 2y = 16$ i $2x − 2y = 4$.',
    ['$x = 4, y = 2$', '$x = 2, y = 4$', '$x = 3, y = 3,5$', '$x = 5, y = 0,5$'],
    [K('Koeficijenti uz $y$ su $2$ i $−2$ – suprotni. Saberemo: $5x = 20$, pa je $x = 4$.'),
     K('Uvrstimo: $3 · 4 + 2y = 16$, tj. $2y = 4$, pa je $y = 2$.'),
     K('Rešenje: $(4, 2)$.')]);

  Z(3, 'Reši sistem: $2x + 3y = 13$ i $3x + 2y = 12$.',
    ['$x = 2, y = 3$', '$x = 3, y = 2$', '$x = 1, y = 4$', '$x = 4, y = 1$'],
    [K('Pomnožimo prvu sa $3$, drugu sa $2$: $6x + 9y = 39$ i $6x + 4y = 24$.'),
     K('Oduzmemo: $5y = 15$, pa je $y = 3$.'),
     K('Uvrstimo: $2x + 9 = 13$, pa je $x = 2$. Rešenje: $(2, 3)$.')]);

  // ════════════════ 7.5 Grafička metoda ════════════════
  L('Rešavanje sistema grafičkom metodom');

  Z(1, 'Grafičko rešenje sistema dve linearne jednačine je…',
    ['tačka preseka dve prave', 'presek sa x-osom', 'presek sa y-osom', 'duž između pravih'],
    [K('Svaka jednačina je prava; rešenje je tačka u kojoj se one seku.'),
     K('Koordinate te tačke su $(x, y)$ rešenje sistema.')]);

  Z(2, 'Prave $y = x + 1$ i $y = −x + 3$ seku se u tački…',
    ['(1, 2)', '(2, 1)', '(1, 1)', '(2, 2)'],
    [K('Izjednačimo: $x + 1 = −x + 3$, pa je $2x = 2$ i $x = 1$.'),
     K('$y = 1 + 1 = 2$.'),
     K('Tačka preseka je $(1, 2)$.', [], dvePrave(1, 1, -1, 3, { podela: 1, kS: 2 })),
     K('Animacija – presek dve prave je rešenje:', [], A('sistem-graficki', 'Rešenje sistema je tačka preseka pravih'))]);

  Z(2, 'Sistem $y = 2x$ i $y = 2x + 1$…',
    ['nema rešenja (prave su paralelne)', 'ima jedno rešenje', 'ima beskonačno mnogo rešenja', 'ima rešenje (0,1)'],
    [K('Obe prave imaju koeficijent $k = 2$ – paralelne su.'),
     K('Paralelne prave se ne seku, pa sistem nema rešenja.')]);

  Z(3, 'Sistem $y = x + 2$ i $2y = 2x + 4$…',
    ['ima beskonačno mnogo rešenja', 'nema rešenja', 'ima jedno rešenje', 'ima dva rešenja'],
    [K('Druga jednačina podeljena sa $2$ daje $y = x + 2$ – ista prava.'),
     K('Prave se poklapaju, pa svaka tačka prave zadovoljava sistem – beskonačno mnogo rešenja.')]);

  // ════════════════ 7.6 Karakteristični sistemi ════════════════
  L('Rešavanje nekih karakterističnih sistema');

  Z(2, 'Reši sistem ${x + y|2} = 4$ i $x − y = 2$.',
    ['$x = 5, y = 3$', '$x = 4, y = 2$', '$x = 6, y = 4$', '$x = 3, y = 1$'],
    [K('Prva: $x + y = 8$ (množimo sa $2$).'),
     K('Sada sistem $x + y = 8$ i $x − y = 2$; saberemo: $2x = 10$, $x = 5$.'),
     K('$y = 8 − 5 = 3$. Rešenje: $(5, 3)$.')]);

  Z(3, 'Reši sistem $3(x + y) = 2x + 8$ i $2x − y = 2$.',
    ['$x = 2, y = 2$', '$x = 3, y = 4$', '$x = 4, y = 6$', '$x = 1, y = 0$'],
    [K('Sredimo prvu jednačinu: $3x + 3y = 2x + 8$, tj. $x + 3y = 8$.'),
     K('Iz druge izrazimo $y$: $y = 2x − 2$. Uvrstimo u prvu: $x + 3(2x − 2) = 8$.'),
     K('$x + 6x − 6 = 8$, pa je $7x = 14$ i $x = 2$.'),
     K('$y = 2 · 2 − 2 = 2$. Provera: $3(2 + 2) = 12$ i $2 · 2 + 8 = 12$ ✓; $2 · 2 − 2 = 2$ ✓.')]);

  Z(3, 'Reši sistem $5x + 4y = 11$ i $2x + 3y = 10$ metodom smene (koeficijenti nisu ni suprotni ni jednaki).',
    ['$x = −1, y = 4$', '$x = 1, y = −4$', '$x = −1, y = −4$', '$x = 1, y = 4$'],
    [K('Iz druge jednačine izrazimo $x$: $2x = 10 − 3y$, pa je $x = {10 − 3y|2}$.'),
     K('Uvrstimo u prvu: $5 · {10 − 3y|2} + 4y = 11$.'),
     K('Pomnožimo sa $2$: $5(10 − 3y) + 8y = 22$, tj. $50 − 15y + 8y = 22$.'),
     K('$−7y = −28$, pa je $y = 4$.'),
     K('$x = {10 − 3 · 4|2} = {−2|2} = −1$. Rešenje: $(−1, 4)$.'),
     K('Geometrijski, to je tačka preseka pravih $y = {11 − 5x|4}$ i $y = {10 − 2x|3}$:', [], dvePrave(-5 / 4, 11 / 4, -2 / 3, 10 / 3, { podela: 1, kS: 2 }))]);

  Z(3, 'Isti sistem $5x + 4y = 11$ i $2x + 3y = 10$ reši sada metodom suprotnih koeficijenata.',
    ['$x = −1, y = 4$', '$x = 1, y = 4$', '$x = −1, y = −4$', '$x = 1, y = −4$'],
    [K('Pomnožimo prvu sa $2$, a drugu sa $5$: $10x + 8y = 22$ i $10x + 15y = 50$.'),
     K('Oduzmemo prvu od druge: $7y = 28$, pa je $y = 4$.'),
     K('Uvrstimo u $10x + 8y = 22$: $10x + 32 = 22$, pa je $10x = −10$ i $x = −1$.'),
     K('Provera: $5·(−1) + 4·4 = 11$ ✓ i $2·(−1) + 3·4 = 10$ ✓. Isti rezultat kao metodom smene!')]);

  // ════════════════ 7.7 Primena sistema ════════════════
  L('Primena sistema linearnih jednačina');

  Z(2, 'Zbir dva broja je $20$, a razlika $4$. Koji su to brojevi?',
    ['12 i 8', '14 i 6', '11 i 9', '13 i 7'],
    [K('Sistem: $x + y = 20$ i $x − y = 4$.'),
     K('Saberemo: $2x = 24$, pa je $x = 12$ i $y = 8$.')]);

  Z(2, 'Dve sveske i tri olovke koštaju $170$ dinara, a tri sveske i dve olovke $180$ dinara. Koliko košta sveska?',
    ['40 dinara', '30 dinara', '50 dinara', '35 dinara'],
    [K('Sistem: $2s + 3o = 170$ i $3s + 2o = 180$.'),
     K('Pomnožimo prvu sa $3$, drugu sa $2$: $6s + 9o = 510$ i $6s + 4o = 360$; oduzmemo: $5o = 150$, $o = 30$.'),
     K('$2s + 90 = 170$, pa je $s = 40$ dinara.')]);

  Z(3, 'U kavezu su zečevi i kokoške: ukupno $15$ glava i $42$ noge. Koliko ima zečeva?',
    ['6', '9', '7', '8'],
    [K('Neka je $z$ zečeva i $k$ kokošaka: $z + k = 15$ i $4z + 2k = 42$.'),
     K('Iz prve: $k = 15 − z$. Uvrstimo: $4z + 2(15 − z) = 42$.'),
     K('$4z + 30 − 2z = 42$, pa je $2z = 12$ i $z = 6$ zečeva (i $9$ kokošaka).')]);

  Z(3, 'Otac je $4$ puta stariji od sina, a zajedno imaju $45$ godina. Koliko godina ima sin?',
    ['9', '10', '12', '8'],
    [K('Sistem: $o = 4s$ i $o + s = 45$.'),
     K('$4s + s = 45$, pa je $5s = 45$ i $s = 9$ godina.'),
     K('Otac ima $36$ godina.')]);

  // ════════════ dopuna do 10 po lekciji ════════════

  L('Pojam sistema linearnih jednačina sa dve nepoznate');
  Z(1, 'Da li je par $(1, 2)$ rešenje sistema $x + y = 3$ i $x − y = −1$?',
    ['Da', 'Ne', 'Samo prve', 'Samo druge'],
    [K('Prva: $1 + 2 = 3$ ✓; druga: $1 − 2 = −1$ ✓'),
     K('Obe su zadovoljene, pa je $(1, 2)$ rešenje.')]);
  Z(1, 'Da li je par $(2, 2)$ rešenje sistema $x + y = 4$ i $2x − y = 2$?',
    ['Da', 'Ne', 'Samo prve', 'Samo druge'],
    [K('$2 + 2 = 4$ ✓ i $4 − 2 = 2$ ✓')]);
  Z(2, 'Koji par je rešenje sistema $x + y = 4$ i $x − y = 0$?',
    ['(2, 2)', '(4, 0)', '(0, 4)', '(1, 3)'],
    [K('$2 + 2 = 4$ ✓ i $2 − 2 = 0$ ✓')]);
  Z(2, 'Koji par je rešenje sistema $x + y = 3$ i $2x + y = 4$?',
    ['(1, 2)', '(2, 1)', '(3, 0)', '(1, 1)'],
    [K('$1 + 2 = 3$ ✓ i $2 + 2 = 4$ ✓')]);
  Z(2, 'Rešenje sistema dve jednačine sa dve nepoznate je:',
    ['par (x, y) koji zadovoljava obe', 'samo vrednost x', 'samo vrednost y', 'bilo koji broj'],
    [K('Rešenje je uređeni par koji zadovoljava obe jednačine.')]);
  Z(2, 'Da li je par $(0, 0)$ rešenje sistema $x + y = 0$ i $x − y = 0$?',
    ['Da', 'Ne', 'Samo prve', 'Samo druge'],
    [K('$0 + 0 = 0$ ✓ i $0 − 0 = 0$ ✓')]);
  Z(2, 'Koji par je rešenje sistema $x = 2$ i $y = 3$?',
    ['(2, 3)', '(3, 2)', '(2, 2)', '(3, 3)'],
    [K('Direktno: $x = 2$, $y = 3$, pa je rešenje $(2, 3)$.')]);

  L('Ekvivalentnost sistema linearnih jednačina');
  Z(1, 'Koja transformacija NE daje ekvivalentan sistem?',
    ['Množenje jednačine nulom', 'Zamena redosleda jednačina', 'Množenje jednačine brojem ≠ 0', 'Dodavanje jedne jednačine drugoj'],
    [K('Množenje nulom daje $0 = 0$ i gubi informaciju o rešenju.'),
     K('Ostale transformacije čuvaju skup rešenja.')]);
  Z(2, 'Da li je zamena redosleda dve jednačine ekvivalentna transformacija?',
    ['Da', 'Ne', 'Samo ako su jednačine iste', 'Zavisi od rešenja'],
    [K('Redosled jednačina ne utiče na skup rešenja.')]);
  Z(2, 'Množenje cele jednačine brojem različitim od nule daje:',
    ['ekvivalentan sistem', 'sistem bez rešenja', 'sistem sa više rešenja', 'sistem sa jednim rešenjem manje'],
    [K('Množenje brojem ≠ 0 ne menja skup rešenja.')]);
  Z(3, 'Sistem $x + y = 2$ i $x − y = 0$ ekvivalentan je sistemu:',
    ['$2x + 2y = 4$ i $x − y = 0$', '$2x + y = 4$ i $x − y = 0$', '$x + y = 4$ i $x − y = 0$', '$x + y = 2$ i $x + y = 0$'],
    [K('Prva jednačina pomnožena sa $2$: $2x + 2y = 4$ – isto rešenje.')]);
  Z(2, 'Dodavanje jedne jednačine drugoj daje:',
    ['ekvivalentan sistem', 'sistem bez rešenja', 'sistem sa jednim rešenjem više', 'netačan sistem'],
    [K('Ako od jedne jednačine oduzmemo (ili dodamo) drugu, skup rešenja se ne menja.')]);
  Z(3, 'Ako jednu jednačinu pomnožimo sa $−1$, sistem:',
    ['ostaje ekvivalentan', 'menja rešenje', 'nema rešenja', 'ima dva rešenja'],
    [K('Množenje sa $−1$ je množenje brojem različitim od nule – ekvivalentna transformacija.')]);
  Z(3, 'Koja promena sigurno menja skup rešenja?',
    ['Množenje jedne jednačine nulom', 'Množenje jedne jednačine sa 2', 'Zamena redosleda', 'Sabiranje dve jednačine'],
    [K('Samo množenje nulom kvari jednačinu.')]);
  Z(3, 'Sistem $x = 1$ i $y = 2$ ekvivalentan je sistemu:',
    ['$2x = 2$ i $3y = 6$', '$2x = 2$ i $3y = 3$', '$x = 2$ i $y = 1$', '$2x = 4$ i $y = 2$'],
    [K('$2x = 2$ → $x = 1$; $3y = 6$ → $y = 2$ – isto rešenje.')]);

  L('Rešavanje sistema metodom smene');
  Z(2, 'Reši sistem smenom: $x + y = 7$ i $x − y = 1$.',
    ['$x = 4, y = 3$', '$x = 3, y = 4$', '$x = 5, y = 2$', '$x = 2, y = 5$'],
    [K('Iz prve: $y = 7 − x$; uvrstimo: $x − (7 − x) = 1$.'),
     K('$2x = 8$, pa je $x = 4$ i $y = 3$.')]);
  Z(2, 'Reši sistem smenom: $y = x + 1$ i $x + y = 5$.',
    ['$x = 2, y = 3$', '$x = 3, y = 2$', '$x = 1, y = 4$', '$x = 4, y = 1$'],
    [K('Uvrstimo: $x + (x + 1) = 5$, pa je $2x = 4$ i $x = 2$.'),
     K('$y = 2 + 1 = 3$.')]);
  Z(2, 'Reši sistem smenom: $y = 3x − 4$ i $x + y = 4$.',
    ['$x = 2, y = 2$', '$x = 1, y = −1$', '$x = 3, y = 5$', '$x = 2, y = 1$'],
    [K('$x + (3x − 4) = 4$, pa je $4x = 8$ i $x = 2$.'),
     K('$y = 3 · 2 − 4 = 2$.')]);
  Z(3, 'Reši sistem smenom: $2x + y = 8$ i $x − y = 1$.',
    ['$x = 3, y = 2$', '$x = 2, y = 3$', '$x = 4, y = 0$', '$x = 3, y = 1$'],
    [K('Iz druge: $y = x − 1$; uvrstimo: $2x + (x − 1) = 8$.'),
     K('$3x = 9$, pa je $x = 3$ i $y = 2$.')]);
  Z(3, 'Reši sistem smenom: $y = 2x$ i $3x + y = 10$.',
    ['$x = 2, y = 4$', '$x = 4, y = 2$', '$x = 2, y = 2$', '$x = 1, y = 2$'],
    [K('$3x + 2x = 10$, pa je $5x = 10$ i $x = 2$.'),
     K('$y = 4$.')]);
  Z(3, 'Reši sistem smenom: $x = y + 2$ i $2x + y = 10$.',
    ['$x = 4, y = 2$', '$x = 2, y = 4$', '$x = 3, y = 1$', '$x = 4, y = 3$'],
    [K('$2(y + 2) + y = 10$, pa je $3y + 4 = 10$ i $y = 2$.'),
     K('$x = 2 + 2 = 4$.')]);

  L('Rešavanje sistema metodom suprotnih koeficijenata');
  Z(2, 'Reši sistem suprotnim koeficijentima: $x + y = 10$ i $x − y = 2$.',
    ['$x = 6, y = 4$', '$x = 4, y = 6$', '$x = 5, y = 5$', '$x = 7, y = 3$'],
    [K('Koeficijenti uz $y$ su suprotni; saberemo: $2x = 12$, pa je $x = 6$.'),
     K('$y = 10 − 6 = 4$.')]);
  Z(2, 'Reši sistem: $2x + y = 9$ i $x + y = 6$.',
    ['$x = 3, y = 3$', '$x = 2, y = 4$', '$x = 4, y = 2$', '$x = 3, y = 2$'],
    [K('Oduzmemo drugu od prve: $x = 3$.'),
     K('$3 + y = 6$, pa je $y = 3$.')]);
  Z(3, 'Reši sistem: $2x + 3y = 12$ i $x + 3y = 9$.',
    ['$x = 3, y = 2$', '$x = 2, y = 3$', '$x = 3, y = 1$', '$x = 4, y = 2$'],
    [K('Oduzmemo drugu od prve: $x = 3$.'),
     K('$3 + 3y = 9$, pa je $3y = 6$ i $y = 2$.')]);
  Z(3, 'Reši sistem: $4x − y = 7$ i $2x + y = 5$.',
    ['$x = 2, y = 1$', '$x = 1, y = 2$', '$x = 2, y = 2$', '$x = 3, y = 1$'],
    [K('Saberemo: $6x = 12$, pa je $x = 2$.'),
     K('$4 · 2 − y = 7$, pa je $y = 1$.')]);
  Z(3, 'Reši sistem: $2x + 3y = 13$ i $2x − y = 1$.',
    ['$x = 2, y = 3$', '$x = 3, y = 2$', '$x = 2, y = 1$', '$x = 1, y = 3$'],
    [K('Oduzmemo: $4y = 12$, pa je $y = 3$.'),
     K('$2x + 9 = 13$, pa je $x = 2$.')]);
  Z(3, 'Reši sistem: $5x + 2y = 12$ i $5x − 2y = 8$.',
    ['$x = 2, y = 1$', '$x = 1, y = 2$', '$x = 2, y = 2$', '$x = 3, y = 1$'],
    [K('Saberemo: $10x = 20$, pa je $x = 2$.'),
     K('$10 + 2y = 12$, pa je $y = 1$.')]);

  L('Rešavanje sistema grafičkom metodom');
  Z(2, 'Prave $y = x + 2$ i $y = 2x$ seku se u tački:',
    ['(2, 4)', '(2, 2)', '(4, 2)', '(1, 2)'],
    [K('$x + 2 = 2x$, pa je $x = 2$ i $y = 4$.')]);
  Z(2, 'Prave $y = −x + 4$ i $y = x$ seku se u tački:',
    ['(2, 2)', '(4, 0)', '(2, 4)', '(0, 4)'],
    [K('$−x + 4 = x$, pa je $2x = 4$ i $x = 2$, $y = 2$.', [], dvePrave(-1, 4, 1, 0, { podela: 1 }))]);
  Z(3, 'Sistem $y = x$ i $y = −x + 6$ ima rešenje:',
    ['(3, 3)', '(2, 4)', '(4, 2)', '(1, 5)'],
    [K('$x = −x + 6$, pa je $2x = 6$ i $x = 3$, $y = 3$.', [], dvePrave(1, 0, -1, 6, { podela: 1 }))]);
  Z(3, 'Prave $y = 2x − 1$ i $y = x + 1$ seku se u tački:',
    ['(2, 3)', '(3, 5)', '(1, 2)', '(2, 1)'],
    [K('$2x − 1 = x + 1$, pa je $x = 2$ i $y = 3$.', [], dvePrave(2, -1, 1, 1, { podela: 1 }))]);
  Z(2, 'Sistem $y = x + 1$ i $y = x − 1$…',
    ['nema rešenja (prave su paralelne)', 'ima rešenje (0, 1)', 'ima rešenje (1, 0)', 'ima beskonačno mnogo rešenja'],
    [K('Obe prave imaju $k = 1$ – paralelne su.'),
     K('Paralelne prave se ne seku, pa nema rešenja.')]);
  Z(3, 'Sistem $y = 2x + 1$ i $2y = 4x + 2$…',
    ['ima beskonačno mnogo rešenja', 'nema rešenja', 'ima jedno rešenje', 'ima rešenje (0, 1)'],
    [K('Druga jednačina podeljena sa $2$ daje $y = 2x + 1$ – ista prava.'),
     K('Prave se poklapaju – beskonačno mnogo rešenja.')]);

  L('Rešavanje nekih karakterističnih sistema');
  Z(2, 'Reši sistem ${x + y|2} = 5$ i $x − y = 2$.',
    ['$x = 6, y = 4$', '$x = 4, y = 6$', '$x = 5, y = 3$', '$x = 6, y = 5$'],
    [K('Prva: $x + y = 10$ (množimo sa $2$).'),
     K('Saberemo sa $x − y = 2$: $2x = 12$, pa je $x = 6$ i $y = 4$.')]);
  Z(3, 'Reši sistem $2x + y = x + 3$ i $x − y = 1$.',
    ['$x = 2, y = 1$', '$x = 1, y = 2$', '$x = 3, y = 2$', '$x = 2, y = 2$'],
    [K('Sredimo prvu: $2x + y = x + 3$, tj. $x + y = 3$.'),
     K('Sa $x − y = 1$ saberemo: $2x = 4$, pa je $x = 2$ i $y = 1$.')]);
  Z(3, 'Reši sistem $x + 2y = 8$ i $x = 2y$.',
    ['$x = 4, y = 2$', '$x = 2, y = 4$', '$x = 4, y = 1$', '$x = 2, y = 2$'],
    [K('Uvrstimo $x = 2y$: $2y + 2y = 8$, pa je $y = 2$.'),
     K('$x = 2 · 2 = 4$.')]);
  Z(3, 'Reši sistem $3x = 6y$ i $x + y = 6$.',
    ['$x = 4, y = 2$', '$x = 2, y = 4$', '$x = 3, y = 3$', '$x = 4, y = 1$'],
    [K('$3x = 6y$ → $x = 2y$; uvrstimo: $2y + y = 6$, pa je $y = 2$.'),
     K('$x = 4$.')]);
  Z(3, 'Reši sistem ${x|2} + {y|2} = 3$ i $x − y = 2$.',
    ['$x = 4, y = 2$', '$x = 2, y = 4$', '$x = 3, y = 1$', '$x = 4, y = 3$'],
    [K('Prva (puta $2$): $x + y = 6$.'),
     K('Sa $x − y = 2$: $2x = 8$, pa je $x = 4$ i $y = 2$.')]);
  Z(3, 'Reši sistem $2(x + y) = 12$ i $x = y + 2$.',
    ['$x = 4, y = 2$', '$x = 2, y = 4$', '$x = 3, y = 1$', '$x = 4, y = 1$'],
    [K('Prva: $x + y = 6$; uvrstimo $x = y + 2$: $2y + 2 = 6$, pa je $y = 2$.'),
     K('$x = 4$.')]);
  Z(3, 'Reši sistem $x + y = 0$ i $x − y = 4$.',
    ['$x = 2, y = −2$', '$x = −2, y = 2$', '$x = 2, y = 2$', '$x = 0, y = 4$'],
    [K('Saberemo: $2x = 4$, pa je $x = 2$ i $y = −2$.')]);
  Z(3, 'Reši sistem $3x + 3y = 9$ i $x − y = 1$.',
    ['$x = 2, y = 1$', '$x = 1, y = 2$', '$x = 2, y = 2$', '$x = 3, y = 2$'],
    [K('Prva (podeli sa $3$): $x + y = 3$.'),
     K('Sa $x − y = 1$: $2x = 4$, pa je $x = 2$ i $y = 1$.')]);

  L('Primena sistema linearnih jednačina');
  Z(2, 'Zbir dva broja je $30$, a razlika $6$. Koji je veći broj?',
    ['18', '12', '24', '15'],
    [K('$x + y = 30$ i $x − y = 6$; saberemo: $2x = 36$, pa je $x = 18$.')]);
  Z(2, 'Tri sveske i dve olovke koštaju $190$ dinara, a dve sveske i tri olovke $160$ dinara. Koliko košta sveska?',
    ['50 dinara', '40 dinara', '30 dinara', '60 dinara'],
    [K('$3s + 2o = 190$ i $2s + 3o = 160$; pomnožimo prvu sa $3$, drugu sa $2$.'),
     K('$9s + 6o = 570$ i $4s + 6o = 320$; oduzmemo: $5s = 250$, pa je $s = 50$ dinara.')]);
  Z(3, 'U kavezu su zečevi i kokoške: ukupno $10$ glava i $28$ nogu. Koliko ima zečeva?',
    ['4', '6', '5', '3'],
    [K('$z + k = 10$ i $4z + 2k = 28$.'),
     K('Iz prve $k = 10 − z$; uvrstimo: $4z + 2(10 − z) = 28$, pa je $2z = 8$ i $z = 4$.')]);
  Z(2, 'Otac je tri puta stariji od sina, a zajedno imaju $48$ godina. Koliko godina ima sin?',
    ['12', '16', '10', '14'],
    [K('$o = 3s$ i $o + s = 48$; uvrstimo: $3s + s = 48$, pa je $s = 12$.')]);
  Z(3, 'Zbir dva broja je $50$, a jedan je četiri puta veći od drugog. Koji je veći broj?',
    ['40', '30', '45', '35'],
    [K('$x + y = 50$ i $x = 4y$; uvrstimo: $4y + y = 50$, pa je $y = 10$.'),
     K('Veći je $x = 40$.')]);
  Z(3, 'Prodato je $100$ ulaznica za $16.000$ dinara. Ulaznica za odrasle je $200$, a za decu $100$ dinara. Koliko je prodato ulaznica za odrasle?',
    ['60', '40', '50', '70'],
    [K('$a + d = 100$ i $200a + 100d = 16.000$.'),
     K('Uvrstimo $d = 100 − a$: $200a + 100(100 − a) = 16.000$, pa je $100a = 6000$ i $a = 60$.')]);
};
