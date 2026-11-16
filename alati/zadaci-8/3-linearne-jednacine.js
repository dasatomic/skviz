// Linearne jednačine i nejednačine sa jednom nepoznatom — 8. razred.
module.exports = ({ L, Z, G, K, proveri }) => {

  // ════════════════ 3.1 Pojam jednačine ════════════════
  L('Pojam jednačine');

  Z(1, 'Koji broj je rešenje jednačine $x + 5 = 12$?',
    ['7', '17', '−7', '6'],
    [K('Rešenje jednačine je broj koji, kad ga uvrstimo umesto nepoznate, daje tačnu jednakost.'),
     K('$x = 12 − 5 = 7$.'),
     K('Provera: $7 + 5 = 12$ ✓')]);

  Z(1, 'Koji broj je rešenje jednačine $3x = 21$?',
    ['7', '18', '24', '63'],
    [K('Nepoznatu nalazimo deljenjem: $x = {21|3} = 7$.'),
     K('Provera: $3 · 7 = 21$ ✓')]);

  Z(2, 'Da li je broj $−3$ rešenje jednačine $2x − 1 = −7$?',
    ['Da', 'Ne', 'Ne može se odrediti', 'Samo ako je x pozitivno'],
    [K('Uvrstimo $x = −3$: $2 · (−3) − 1 = −6 − 1 = −7$.'),
     K('Leva strana je jednaka desnoj, pa $−3$ jeste rešenje.')]);

  Z(2, 'Jednačina $x + 3 = x + 7$…',
    ['nema rešenja', 'ima tačno jedno rešenje', 'ima beskonačno mnogo rešenja', 'ima rešenje 4'],
    [K('Oduzmemo $x$ sa obe strane: $3 = 7$, što nije tačno.'),
     K('Nijedan broj ne zadovoljava ovu jednakost – jednačina nema rešenja.')]);

  Z(3, 'Jednačina $2(x + 1) = 2x + 2$…',
    ['ima beskonačno mnogo rešenja', 'nema rešenja', 'ima tačno jedno rešenje', 'ima rešenje 0'],
    [K('Razvijemo levu stranu: $2x + 2 = 2x + 2$ – identički jednako.'),
     K('Svaki broj zadovoljava jednačinu, pa ona ima beskonačno mnogo rešenja.'),
     K('Takvu jednačinu zovemo identitet.')]);

  // ════════════════ 3.2 Ekvivalentne jednačine; linearna jednačina ════════════════
  L('Ekvivalentne jednačine; linearna jednačina');

  Z(1, 'Dve jednačine su ekvivalentne ako…',
    ['imaju isti skup rešenja', 'izgledaju isto', 'imaju iste brojeve', 'su obe tačne'],
    [K('Ekvivalentne jednačine imaju isti skup rešenja, iako mogu različito da izgledaju.'),
     K('Primer: $x = 3$ i $2x = 6$ su ekvivalentne – obe imaju rešenje $3$.')]);

  Z(1, 'Koja jednačina je ekvivalentna jednačini $x = 4$?',
    ['$2x = 8$', '$x + 1 = 4$', '$x − 1 = 4$', '$x = 5$'],
    [K('Tražimo jednačinu čije je jedino rešenje $4$.'),
     K('$2x = 8$ → $x = 4$ ✓'),
     K('$x + 1 = 4$ → $x = 3$; $x − 1 = 4$ → $x = 5$; $x = 5$ → rešenje $5$.')]);

  Z(2, 'Koja od sledećih jednačina je linearna?',
    ['$3x − 2 = 7$', '$x² = 9$', '${1|x} = 2$', '$√{x} = 3$'],
    [K('Linearna jednačina ima oblik $ax + b = 0$, gde je nepoznata na prvom stepenu.'),
     K('$3x − 2 = 7$ je linearna.'),
     K('$x²$, ${1|x}$ i $√{x}$ nisu linearni izrazi po $x$.')]);

  Z(3, 'Za koju vrednost $a$ jednačina $ax + 1 = 5$ ima rešenje $x = 2$?',
    ['$a = 2$', '$a = 1$', '$a = 4$', '$a = 3$'],
    [K('Uvrstimo $x = 2$: $a · 2 + 1 = 5$.'),
     K('$2a = 4$, pa je $a = 2$.'),
     K('Provera: $2 · 2 + 1 = 5$ ✓')]);

  // ════════════════ 3.3 Ekvivalentne transformacije ════════════════
  L('Ekvivalentne transformacije');

  Z(1, 'Ako obema stranama jednačine dodamo isti broj, nova jednačina je…',
    ['ekvivalentna polaznoj', 'uvek netačna', 'samo slična', 'bez rešenja'],
    [K('Dodavanje istog broja obema stranama ne menja skup rešenja – to je ekvivalentna transformacija.'),
     K('Isto važi za oduzimanje, množenje i deljenje obe strane istim brojem različitim od nule.')]);

  Z(2, 'Koju operaciju NE smemo da primenimo na jednačinu da bi ostala ekvivalentna?',
    ['Množenje obe strane nulom', 'Dodavanje istog broja', 'Oduzimanje istog broja', 'Deljenje istim brojem (≠ 0)'],
    [K('Množenje obe strane nulom daje $0 = 0$, što je uvek tačno – izgubimo informaciju o rešenju.'),
     K('Zato je množenje nulom zabranjena transformacija.'),
     K('Deljenje nulom je takođe nemoguće.')]);

  Z(2, 'Jednačina $3x = 12$ transformisana je deljenjem sa $3$. Šta dobijamo?',
    ['$x = 4$', '$x = 9$', '$x = 36$', '$x = 15$'],
    [K('Delimo obe strane sa $3$: ${3x|3} = {12|3}$.'),
     K('$x = 4$.'),
     K('Deljenje obe strane istim brojem (različitim od nule) je ekvivalentna transformacija.')]);

  Z(3, 'Kojom transformacijom se iz $x − 5 = 2$ dobija $x = 7$?',
    ['Dodavanjem 5 obema stranama', 'Oduzimanjem 5', 'Množenjem sa 5', 'Deljenjem sa 5'],
    [K('$x − 5 + 5 = 2 + 5$'),
     K('$x = 7$'),
     K('„Prebacivanje“ broja na drugu stranu sa promenom znaka je isto što i dodavanje/oduzimanje obema stranama.')]);

  // ════════════════ 3.4 Rešavanje linearnih jednačina ════════════════
  L('Rešavanje linearnih jednačina');

  Z(1, 'Reši jednačinu $2x + 3 = 11$.',
    ['4', '7', '8', '5'],
    [K('$2x = 11 − 3 = 8$'),
     K('$x = {8|2} = 4$'),
     K('Provera: $2 · 4 + 3 = 8 + 3 = 11$ ✓')]);

  Z(1, 'Reši jednačinu $5x − 7 = 3x + 9$.',
    ['8', '2', '16', '1'],
    [K('Nepoznate na levu, brojevi na desnu: $5x − 3x = 9 + 7$.'),
     K('$2x = 16$, pa je $x = 8$.'),
     K('Provera: $40 − 7 = 33$ i $24 + 9 = 33$ ✓')]);

  Z(2, 'Reši jednačinu $3(x − 2) = 2(x + 4)$.',
    ['14', '10', '2', '6'],
    [K('Razvijemo zagrade: $3x − 6 = 2x + 8$.'),
     K('$3x − 2x = 8 + 6$, pa je $x = 14$.'),
     K('Provera: $3 · 12 = 36$ i $2 · 18 = 36$ ✓')]);

  Z(2, 'Reši jednačinu ${x|2} + {x|3} = 10$.',
    ['12', '10', '6', '5'],
    [K('Zajednički imenilac je $6$: ${3x|6} + {2x|6} = 10$.'),
     K('${5x|6} = 10$, pa je $5x = 60$ i $x = 12$.'),
     K('Provera: ${12|2} + {12|3} = 6 + 4 = 10$ ✓')]);

  Z(2, 'Reši jednačinu $4x − 2 = 2x − 2$.',
    ['0', '1', '−2', '2'],
    [K('$4x − 2x = −2 + 2$'),
     K('$2x = 0$, pa je $x = 0$.'),
     K('Provera: $0 − 2 = −2$ i $0 − 2 = −2$ ✓')]);

  Z(3, 'Reši jednačinu $2(x + 1) − 3(x − 2) = x + 6$.',
    ['1', '2', '3', '4'],
    [K('$2x + 2 − 3x + 6 = x + 6$, tj. $−x + 8 = x + 6$.'),
     K('$−x − x = 6 − 8$, pa je $−2x = −2$ i $x = 1$.'),
     K('Provera: $2 · 2 − 3 · (−1) = 4 + 3 = 7$ i $1 + 6 = 7$ ✓')]);

  // ════════════════ 3.5 Još o linearnim jednačinama ════════════════
  L('Još o linearnim jednačinama');

  Z(2, 'Jednačina $2(x − 1) = 2x + 1$…',
    ['nema rešenja', 'ima rešenje 1', 'ima rešenje 0', 'ima beskonačno mnogo rešenja'],
    [K('$2x − 2 = 2x + 1$'),
     K('Oduzmemo $2x$: $−2 = 1$ – netačno.'),
     K('Nema rešenja.')]);

  Z(2, 'Jednačina $3x + 2 = 2 + 3x$…',
    ['ima beskonačno mnogo rešenja', 'nema rešenja', 'ima rešenje 0', 'ima rešenje 1'],
    [K('Obe strane su identične: $3x + 2 = 3x + 2$.'),
     K('Svaki realan broj je rešenje – beskonačno mnogo rešenja.')]);

  Z(3, 'Jednačina ${x + 1|2} = {2x − 3|3}$ ima rešenje:',
    ['9', '3', '−3', '6'],
    [K('Množimo unakrsno: $3(x + 1) = 2(2x − 3)$.'),
     K('$3x + 3 = 4x − 6$, pa je $x = 9$.'),
     K('Provera: ${10|2} = 5$ i ${15|3} = 5$ ✓')]);

  Z(3, 'Ako je rešenje jednačine $ax − 3 = 7$ broj $5$, koliko je $a$?',
    ['2', '1', '3', '4'],
    [K('Uvrstimo $x = 5$: $5a − 3 = 7$.'),
     K('$5a = 10$, pa je $a = 2$.'),
     K('Provera: $2 · 5 − 3 = 7$ ✓')]);

  // ════════════════ 3.6 Jednačine koje se svode na linearnu ════════════════
  L('Jednačine koje se svode na linearnu jednačinu');

  Z(2, 'Reši jednačinu ${x|x − 2} = 0$ (uz uslov $x ≠ 2$).',
    ['0', '2', '−2', '1'],
    [K('Razlomak je nula kad mu je brojilac nula, a imenilac različit od nule.'),
     K('$x = 0$, a uslov $x ≠ 2$ je zadovoljen.'),
     K('Rešenje: $x = 0$.')]);

  Z(2, 'Reši jednačinu $x² = 4x$ tako što je svedeš na linearnu (podeli sa $x$, uz uslov $x ≠ 0$).',
    ['4', '0', '−4', '2'],
    [K('Delimo sa $x$ (uz $x ≠ 0$): $x = 4$.'),
     K('Pazi: $x = 0$ je takođe rešenje polazne jednačine, ali ga ovde isključujemo uslovom.'),
     K('Pod datim uslovom, rešenje je $4$.')]);

  Z(3, 'Reši jednačinu ${2|x + 1} = 1$ (uz uslov $x ≠ −1$).',
    ['1', '2', '−1', '0'],
    [K('Množimo sa $x + 1$: $2 = x + 1$.'),
     K('$x = 1$.'),
     K('Provera: ${2|2} = 1$ ✓')]);

  Z(3, 'Reši jednačinu ${x + 2|x − 3} = 2$ (uz uslov $x ≠ 3$).',
    ['8', '6', '4', '10'],
    [K('Množimo sa $x − 3$: $x + 2 = 2(x − 3)$.'),
     K('$x + 2 = 2x − 6$, pa je $x = 8$.'),
     K('Provera: ${10|5} = 2$ ✓')]);

  // ════════════════ 3.7 Primena linearnih jednačina ════════════════
  L('Primena linearnih jednačina');

  Z(1, 'Zbir tri uzastopna prirodna broja je $96$. Koji je najveći od njih?',
    ['33', '32', '31', '34'],
    [K('Neka su brojevi $n$, $n + 1$, $n + 2$. Zbir: $3n + 3 = 96$.'),
     K('$3n = 93$, pa je $n = 31$.'),
     K('Brojevi su $31, 32, 33$; najveći je $33$.')]);

  Z(2, 'Petar je za $6$ godina stariji od sestre. Zajedno imaju $24$ godine. Koliko Petar ima godina?',
    ['15', '18', '12', '9'],
    [K('Neka sestra ima $x$ godina, Petar $x + 6$. Zbir: $x + x + 6 = 24$.'),
     K('$2x = 18$, pa je $x = 9$ (sestra).'),
     K('Petar: $9 + 6 = 15$ godina.')]);

  Z(2, 'Obim pravougaonika je $36 cm$, a dužina je dva puta veća od širine. Kolika je dužina?',
    ['$12 cm$', '$18 cm$', '$9 cm$', '$24 cm$'],
    [K('Neka je širina $x$, dužina $2x$. Obim: $2(x + 2x) = 36$.'),
     K('$6x = 36$, pa je $x = 6 cm$ (širina).'),
     K('Dužina: $2 · 6 = 12 cm$.')]);

  Z(3, 'U razredu ima $28$ učenika, i to $6$ dečaka više nego devojčica. Koliko ima devojčica?',
    ['11', '14', '17', '16'],
    [K('Neka devojčica ima $x$, dečaka $x + 6$. Ukupno: $x + x + 6 = 28$.'),
     K('$2x = 22$, pa je $x = 11$ devojčica.'),
     K('Dečaka: $11 + 6 = 17$; provera $11 + 17 = 28$ ✓')]);

  // ════════════════ 3.8 Problemi kretanja ════════════════
  L('Primena linearnih jednačina na probleme kretanja');

  Z(2, 'Automobil vozi stalnom brzinom i za $3$ sata pređe $240 km$. Kolika mu je brzina?',
    ['$80 km/h$', '$72 km/h$', '$90 km/h$', '$75 km/h$'],
    [K('Brzina = put : vreme: $v = {240|3} = 80 km/h$.'),
     K('Formula: $s = v · t$.'),
     K('Provera: $80 · 3 = 240$ ✓')]);

  Z(2, 'Dva automobila krenu jedan drugom u susret iz mesta udaljenih $300 km$. Prvi vozi $60 km/h$, drugi $90 km/h$. Posle koliko sati će se sresti?',
    ['2 sata', '3 sata', '2,5 sata', '1,5 sati'],
    [K('Brzina približavanja je zbir brzina: $60 + 90 = 150 km/h$.'),
     K('$t = {300|150} = 2$ sata.'),
     K('Za $2$ sata prvi pređe $120 km$, drugi $180 km$; $120 + 180 = 300$ ✓')]);

  Z(3, 'Biciklista krene u $8:00$ brzinom $15 km/h$. Sat kasnije za njim krene motociklista brzinom $45 km/h$. Kada će ga stići?',
    ['U $9:30$', 'U $9:00$', 'U $10:00$', 'U $9:15$'],
    [K('Za sat vremena biciklista pređe $15 km$ prednosti.'),
     K('Motociklista ga sustiže brzinom $45 − 15 = 30 km/h$.'),
     K('Vreme sustizanja: ${15|30} = 0,5$ h, dakle u $8:00 + 1 h + 0,5 h = 9:30$.')]);

  Z(3, 'Čamac plovi nizvodno brzinom $18 km/h$, a uzvodno $12 km/h$. Kolika je brzina reke?',
    ['$3 km/h$', '$6 km/h$', '$15 km/h$', '$2 km/h$'],
    [K('Nizvodno: brzina čamca + brzina reke = $18$. Uzvodno: brzina čamca − brzina reke = $12$.'),
     K('Saberemo: $2 · (brzina čamca) = 30$, pa je brzina čamca $15 km/h$.'),
     K('Brzina reke: $18 − 15 = 3 km/h$.')]);

  // ════════════════ 3.9 Još neke primene ════════════════
  L('Još neke primene linearnih jednačina');

  Z(2, 'Bure se puni kroz dve cevi. Kroz prvu za $4$ sata, a kroz drugu za $6$ sati. Za koliko sati se napuni kroz obe istovremeno?',
    ['$2,4$ sata', '$10$ sati', '$2$ sata', '$5$ sati'],
    [K('Prva cev za $1$ h napuni ${1|4}$, druga ${1|6}$ bureta.'),
     K('Zajedno za $1$ h: ${1|4} + {1|6} = {3|12} + {2|12} = {5|12}$.'),
     K('Vreme: ${1|{5|12}} = {12|5} = 2,4$ sata.')]);

  Z(2, 'Cena patika snižena je za $20 %$ i sada koštaju $6.400$ dinara. Kolika je bila cena pre sniženja?',
    ['$8.000$ dinara', '$7.680$ dinara', '$5.120$ dinara', '$8.500$ dinara'],
    [K('Nova cena je $80 %$ stare: $0,8x = 6400$.'),
     K('$x = {6400|0,8} = 8000$ dinara.'),
     K('Provera: $20 %$ od $8000$ je $1600$; $8000 − 1600 = 6400$ ✓')]);

  Z(3, 'U posudi je rastvor soli. Ako dodamo $4 kg$ soli, so čini $20 %$ smeše. Ako smeša sada ima $24 kg$, koliko je soli bilo na početku?',
    ['$0,8 kg$', '$4,8 kg$', '$1 kg$', '$2 kg$'],
    [K('Posle dodavanja ima $24 kg$ smeše, a so je $20 %$: $24 · 0,2 = 4,8 kg$.'),
     K('Pre dodavanja je bilo $4,8 − 4 = 0,8 kg$ soli.'),
     K('Provera: $0,8 + 4 = 4,8$ i ${4,8|24} = 0,2 = 20 %$ ✓')]);

  // ════════════════ 3.10 Nejednačine ════════════════
  L('Nejednačine');

  Z(1, 'Koji od znakova označava „veće ili jednako“?',
    ['$≥$', '$>$', '$<$', '$≠$'],
    [K('$≥$ = veće ili jednako, $>$ = strogo veće, $<$ = manje, $≠$ = različito.')]);

  Z(1, 'Koji brojevi su rešenja nejednačine $x > 3$?',
    ['Svi brojevi veći od 3', 'Samo broj 3', 'Svi brojevi manji od 3', 'Brojevi 3 i veći'],
    [K('Stroga nejednakost $x > 3$ važi za sve brojeve veće od $3$ (broj $3$ ne pripada rešenju).'),
     K('Da je pisalo $x ≥ 3$, tada bi i $3$ bilo rešenje.')]);

  Z(2, 'Da li je broj $−2$ rešenje nejednačine $2x + 1 < 0$?',
    ['Da', 'Ne', 'Ne može se odrediti', 'Samo ako je x celo'],
    [K('Uvrstimo: $2 · (−2) + 1 = −4 + 1 = −3 < 0$ ✓'),
     K('Dakle $−2$ jeste rešenje.')]);

  Z(3, 'Skup rešenja nejednačine $x ≤ 5$ na brojevnoj pravoj predstavlja se…',
    ['zrakom ulevo sa punom tačkom na 5', 'zrakom udesno sa praznom tačkom', 'samo tačkom 5', 'celom brojevnom pravom'],
    [K('$x ≤ 5$ znači svi brojevi manji ili jednaki $5$ – zrak ulevo.'),
     K('Kako je $5$ uključeno, tačka na $5$ je puna (ne prazna).')]);

  // ════════════════ 3.11 Ekvivalentne nejednačine ════════════════
  L('Ekvivalentne nejednačine');

  Z(1, 'Ako obema stranama nejednačine dodamo isti broj, znak nejednakosti…',
    ['ostaje isti', 'se okreće', 'postaje =', 'nestaje'],
    [K('Dodavanje (ili oduzimanje) istog broja ne menja znak nejednakosti.'),
     K('Primer: $x − 3 > 2$ → $x > 5$.')]);

  Z(2, 'Ako obe strane nejednačine podelimo NEGATIVNIM brojem, znak nejednakosti…',
    ['se okreće', 'ostaje isti', 'postaje =', 'se gubi'],
    [K('Množenje ili deljenje negativnim brojem okreće znak nejednakosti.'),
     K('Primer: $−2x > 6$ → $x < −3$.'),
     K('Množenje pozitivnim brojem znak ne menja.')]);

  Z(2, 'Reši nejednačinu $x − 4 ≥ 2$.',
    ['$x ≥ 6$', '$x ≤ 6$', '$x > 6$', '$x < 6$'],
    [K('Dodamo $4$ obema stranama: $x ≥ 6$.'),
     K('Znak se ne menja jer dodajemo (ne množimo negativnim).')]);

  Z(3, 'Reši nejednačinu $−3x < 12$.',
    ['$x > −4$', '$x < −4$', '$x > 4$', '$x < 4$'],
    [K('Delimo sa $−3$ (negativno!) pa se znak okreće: $x > {12|−3}$.'),
     K('$x > −4$.'),
     K('Provera: $x = 0$ → $0 < 12$ ✓; $x = −5$ → $15 < 12$ ✗.')]);

  // ════════════════ 3.12 Linearna nejednačina ════════════════
  L('Linearna nejednačina');

  Z(1, 'Koja od sledećih je linearna nejednačina?',
    ['$2x + 1 ≤ 7$', '$x² > 4$', '${1|x} < 2$', '$√{x} ≥ 3$'],
    [K('Linearna nejednačina ima nepoznatu na prvom stepenu.'),
     K('$2x + 1 ≤ 7$ je linearna.'),
     K('$x²$, ${1|x}$ i $√{x}$ nisu linearni.')]);

  Z(2, 'Reši linearnu nejednačinu $2x + 3 ≤ 9$.',
    ['$x ≤ 3$', '$x ≥ 3$', '$x ≤ 6$', '$x ≥ 6$'],
    [K('$2x ≤ 9 − 3$, tj. $2x ≤ 6$.'),
     K('Delimo sa $2$ (pozitivno, znak ostaje): $x ≤ 3$.'),
     K('Provera: $x = 3$ → $9 ≤ 9$ ✓; $x = 4$ → $11 ≤ 9$ ✗.')]);

  Z(3, 'Reši nejednačinu $5 − 2x > 1$.',
    ['$x < 2$', '$x > 2$', '$x < −2$', '$x > −2$'],
    [K('$−2x > 1 − 5$, tj. $−2x > −4$.'),
     K('Delimo sa $−2$ (negativno, znak se okreće): $x < 2$.'),
     K('Provera: $x = 1$ → $3 > 1$ ✓; $x = 3$ → $−1 > 1$ ✗.')]);

  // ════════════════ 3.13 Rešavanje linearnih nejednačina ════════════════
  L('Rešavanje linearnih nejednačina');

  Z(2, 'Reši nejednačinu $3x − 4 < 5x + 2$.',
    ['$x > −3$', '$x < −3$', '$x > 3$', '$x < 3$'],
    [K('$3x − 5x < 2 + 4$, tj. $−2x < 6$.'),
     K('Delimo sa $−2$: $x > −3$.'),
     K('Provera: $x = 0$ → $−4 < 2$ ✓; $x = −4$ → $−16 < −18$ ✗.')]);

  Z(2, 'Reši nejednačinu ${x|2} − 1 ≤ 3$.',
    ['$x ≤ 8$', '$x ≥ 8$', '$x ≤ 4$', '$x ≥ 4$'],
    [K('${x|2} ≤ 4$'),
     K('Množimo sa $2$: $x ≤ 8$.'),
     K('Provera: $x = 8$ → $4 − 1 = 3 ≤ 3$ ✓.')]);

  Z(3, 'Reši nejednačinu $2(x − 1) ≥ 3x + 1$.',
    ['$x ≤ −3$', '$x ≥ −3$', '$x ≤ 3$', '$x ≥ 3$'],
    [K('$2x − 2 ≥ 3x + 1$'),
     K('$2x − 3x ≥ 1 + 2$, tj. $−x ≥ 3$.'),
     K('Množimo sa $−1$: $x ≤ −3$.')]);

  Z(3, 'Najveći ceo broj koji zadovoljava nejednačinu $4x − 7 < 10$ je:',
    ['4', '3', '5', '2'],
    [K('$4x < 17$, pa je $x < 4,25$.'),
     K('Najveći ceo broj manji od $4,25$ je $4$.'),
     K('Provera: $4 · 4 − 7 = 9 < 10$ ✓; $x = 5$ → $13 < 10$ ✗.')]);

  // ════════════════ 3.14 Primena linearnih nejednačina ════════════════
  L('Primena linearnih nejednačina');

  Z(2, 'Za prevoz više od $120$ učenika koriste se autobusi koji primaju po $45$ učenika. Koliko najmanje autobusa treba?',
    ['3', '2', '4', '5'],
    [K('Tražimo najmanji ceo broj $n$ takav da je $45n ≥ 120$.'),
     K('$n ≥ {120|45} = 2,67$, pa je najmanji ceo broj $3$.'),
     K('Provera: $3 · 45 = 135 ≥ 120$ ✓; $2$ autobusa ($90$) nije dovoljno.')]);

  Z(2, 'Milan ima $500$ dinara. Sveška košta $60$ dinara, a olovka $35$. Ako kupi jednu svesku, koliko najviše olovaka može da kupi?',
    ['12', '13', '14', '10'],
    [K('Posle sveske ostaje $500 − 60 = 440$ dinara.'),
     K('$35x ≤ 440$, pa je $x ≤ {440|35} = 12,57$.'),
     K('Najviše $12$ olovaka (za $13$ bi trebalo $455 > 440$).')]);

  Z(3, 'Obim pravougaonika je manji od $50 cm$. Ako je širina $8 cm$, koje vrednosti može imati dužina $a$?',
    ['$a < 17 cm$', '$a < 25 cm$', '$a < 34 cm$', '$a < 42 cm$'],
    [K('Obim: $2(a + 8) < 50$.'),
     K('$a + 8 < 25$, pa je $a < 17 cm$.'),
     K('Dužina mora biti i pozitivna, pa je $0 < a < 17 cm$.')]);

  Z(3, 'Za koje prirodne brojeve $n$ važi da je zbir broja i njegove polovine manji od $9$?',
    ['$n < 6$, tj. $1,2,3,4,5$', '$n < 9$', '$n < 4$', '$n > 6$'],
    [K('$n + {n|2} < 9$, tj. ${3n|2} < 9$.'),
     K('$3n < 18$, pa je $n < 6$.'),
     K('Prirodni brojevi manji od $6$ su $1, 2, 3, 4, 5$.')]);

  // ════════════ dopuna do 10 po lekciji ════════════

  L('Pojam jednačine');
  Z(1, 'Koji broj je rešenje jednačine $x − 7 = 3$?',
    ['10', '4', '−4', '7'],
    [K('$x = 3 + 7 = 10$.'),
     K('Provera: $10 − 7 = 3$ ✓')]);
  Z(1, 'Koji broj je rešenje jednačine ${x|2} = 4$?',
    ['8', '2', '6', '4'],
    [K('Množimo sa $2$: $x = 8$.'),
     K('Provera: ${8|2} = 4$ ✓')]);
  Z(2, 'Da li je broj $5$ rešenje jednačine $3x − 1 = 14$?',
    ['Da', 'Ne', 'Ne može se odrediti', 'Samo ako je x paran'],
    [K('Uvrstimo $x = 5$: $3 · 5 − 1 = 15 − 1 = 14$.'),
     K('Leva strana je jednaka desnoj, pa $5$ jeste rešenje.')]);
  Z(2, 'Da li je broj $0$ rešenje jednačine $x + 2 = 2$?',
    ['Da', 'Ne', 'Ne može se odrediti', 'Samo ako je x negativan'],
    [K('$0 + 2 = 2$ ✓'),
     K('Nula je rešenje.')]);
  Z(2, 'Koji broj je rešenje jednačine $7 = x + 2$?',
    ['5', '9', '−5', '2'],
    [K('$x = 7 − 2 = 5$.'),
     K('Provera: $7 = 5 + 2$ ✓')]);

  L('Ekvivalentne jednačine; linearna jednačina');
  Z(1, 'Koja jednačina je ekvivalentna jednačini $x = 7$?',
    ['$2x = 14$', '$x + 1 = 7$', '$x − 1 = 7$', '$2x = 7$'],
    [K('Ekvivalentna jednačina ima isto rešenje ($7$).'),
     K('$2x = 14$ → $x = 7$ ✓')]);
  Z(2, 'Koja jednačina je ekvivalentna jednačini $x = −2$?',
    ['$x + 3 = 1$', '$x − 3 = 1$', '$2x = 4$', '$x = 2$'],
    [K('$x + 3 = 1$ → $x = −2$ ✓'),
     K('Ostale imaju rešenja $4$, $2$ i $2$.')]);
  Z(2, 'Koja od sledećih jednačina je linearna?',
    ['$5x + 1 = 0$', '$x² = 9$', '${1|x} = 2$', '$√{x} = 4$'],
    [K('Linearna jednačina ima nepoznatu samo na prvom stepenu.'),
     K('$5x + 1 = 0$ je linearna.')]);
  Z(2, 'Koja jednačina NIJE linearna?',
    ['$x² = 4$', '$3x = 12$', '$x − 2 = 0$', '$2x + 1 = 5$'],
    [K('$x² = 4$ ima nepoznatu na kvadrat – nije linearna.'),
     K('Ostale su oblika $ax + b = 0$.')]);
  Z(3, 'Za koju vrednost $a$ jednačina $ax − 2 = 8$ ima rešenje $x = 5$?',
    ['$a = 2$', '$a = 1$', '$a = 3$', '$a = 4$'],
    [K('Uvrstimo: $5a − 2 = 8$.'),
     K('$5a = 10$, pa je $a = 2$.')]);
  Z(3, 'Za koju vrednost $a$ jednačina $ax + 3 = 7$ ima rešenje $x = 1$?',
    ['$a = 4$', '$a = 1$', '$a = 2$', '$a = 3$'],
    [K('$a · 1 + 3 = 7$, pa je $a = 4$.')]);

  L('Ekvivalentne transformacije');
  Z(1, 'Ako obe strane jednačine podelimo istim brojem (različitim od nule), skup rešenja…',
    ['ostaje isti', 'se povećava', 'se smanjuje', 'postaje prazan'],
    [K('Deljenje obe strane istim brojem ≠ 0 je ekvivalentna transformacija.'),
     K('Skup rešenja se ne menja.')]);
  Z(2, 'Kojom transformacijom se iz $2x = 6$ dobija $x = 3$?',
    ['Deljenjem sa 2', 'Oduzimanjem 2', 'Množenjem sa 2', 'Dodavanjem 2'],
    [K('${2x|2} = {6|2}$'),
     K('$x = 3$.')]);
  Z(2, 'Kojom transformacijom se iz $x + 4 = 9$ dobija $x = 5$?',
    ['Oduzimanjem 4', 'Dodavanjem 4', 'Množenjem sa 4', 'Deljenjem sa 4'],
    [K('$x + 4 − 4 = 9 − 4$'),
     K('$x = 5$.')]);
  Z(1, 'Reši jednačinu ${x|3} = 5$.',
    ['15', '8', '${5|3}$', '2'],
    [K('Množimo obe strane sa $3$: $x = 15$.')]);
  Z(1, 'Reši jednačinu $4x = 20$.',
    ['5', '4', '16', '80'],
    [K('$x = {20|4} = 5$.')]);
  Z(2, 'Kojom transformacijom se iz $x − 2 = 3$ dobija $x = 5$?',
    ['Dodavanjem 2', 'Oduzimanjem 2', 'Množenjem sa 2', 'Deljenjem sa 2'],
    [K('$x − 2 + 2 = 3 + 2$'),
     K('$x = 5$.')]);

  L('Rešavanje linearnih jednačina');
  Z(2, 'Reši jednačinu $3x − 4 = 2x + 1$.',
    ['5', '3', '−3', '1'],
    [K('$3x − 2x = 1 + 4$'),
     K('$x = 5$.')]);
  Z(2, 'Reši jednačinu $4x − 1 = 2x + 5$.',
    ['3', '2', '4', '6'],
    [K('$4x − 2x = 5 + 1$'),
     K('$2x = 6$, pa je $x = 3$.')]);
  Z(2, 'Reši jednačinu $5x − 3 = 2x + 9$.',
    ['4', '3', '2', '6'],
    [K('$5x − 2x = 9 + 3$'),
     K('$3x = 12$, pa je $x = 4$.')]);
  Z(3, 'Reši jednačinu $2(x + 3) = 3x + 1$.',
    ['5', '7', '3', '2'],
    [K('$2x + 6 = 3x + 1$'),
     K('$2x − 3x = 1 − 6$, pa je $−x = −5$ i $x = 5$.')]);

  L('Još o linearnim jednačinama');
  Z(2, 'Jednačina $3(x + 1) = 3x + 1$…',
    ['nema rešenja', 'ima rešenje 1', 'ima rešenje 0', 'ima beskonačno mnogo rešenja'],
    [K('$3x + 3 = 3x + 1$'),
     K('Oduzmemo $3x$: $3 = 1$ – netačno, pa nema rešenja.')]);
  Z(2, 'Jednačina $2(x − 3) = 2x − 6$…',
    ['ima beskonačno mnogo rešenja', 'nema rešenja', 'ima rešenje 3', 'ima rešenje 0'],
    [K('Obe strane su identične: $2x − 6 = 2x − 6$.'),
     K('Svaki broj je rešenje – beskonačno mnogo.')]);
  Z(3, 'Jednačina $2x + 1 = 2(x + 1)$…',
    ['nema rešenja', 'ima rešenje 1', 'ima rešenje 0', 'ima beskonačno mnogo rešenja'],
    [K('$2x + 1 = 2x + 2$'),
     K('$1 = 2$ – netačno, pa nema rešenja.')]);
  Z(3, 'Reši jednačinu ${x + 1|2} = {x + 3|3}$.',
    ['3', '2', '4', '1'],
    [K('Unakrsno: $3(x + 1) = 2(x + 3)$.'),
     K('$3x + 3 = 2x + 6$, pa je $x = 3$.')]);
  Z(3, 'Reši jednačinu ${x|3} − {x|4} = 1$.',
    ['12', '6', '24', '1'],
    [K('Zajednički imenilac $12$: ${4x|12} − {3x|12} = 1$.'),
     K('${x|12} = 1$, pa je $x = 12$.')]);
  Z(3, 'Reši jednačinu ${x + 1|3} = {x + 2|4}$.',
    ['2', '1', '3', '4'],
    [K('$4(x + 1) = 3(x + 2)$'),
     K('$4x + 4 = 3x + 6$, pa je $x = 2$.')]);

  L('Jednačine koje se svode na linearnu jednačinu');
  Z(2, 'Reši jednačinu ${x|x − 1} = 2$ (uz uslov $x ≠ 1$).',
    ['2', '1', '−2', '3'],
    [K('Množimo sa $x − 1$: $x = 2(x − 1)$.'),
     K('$x = 2x − 2$, pa je $x = 2$.')]);
  Z(2, 'Reši jednačinu ${3|x + 2} = 1$ (uz uslov $x ≠ −2$).',
    ['1', '3', '−1', '2'],
    [K('Množimo sa $x + 2$: $3 = x + 2$.'),
     K('$x = 1$.')]);
  Z(3, 'Reši jednačinu ${x + 1|x − 1} = 2$ (uz uslov $x ≠ 1$).',
    ['3', '2', '−3', '1'],
    [K('$x + 1 = 2(x − 1)$'),
     K('$x + 1 = 2x − 2$, pa je $x = 3$.')]);
  Z(3, 'Reši jednačinu ${2x|x + 1} = 1$ (uz uslov $x ≠ −1$).',
    ['1', '2', '−1', '0'],
    [K('$2x = x + 1$'),
     K('$x = 1$.')]);
  Z(3, 'Reši jednačinu $x² = 3x$ tako što je svedeš na linearnu (podeli sa $x$, uz uslov $x ≠ 0$).',
    ['3', '0', '−3', '1'],
    [K('Delimo sa $x$ (uz $x ≠ 0$): $x = 3$.'),
     K('Pod datim uslovom rešenje je $3$.')]);
  Z(3, 'Reši jednačinu ${x − 2|x + 3} = {1|2}$ (uz uslov $x ≠ −3$).',
    ['7', '5', '3', '6'],
    [K('$2(x − 2) = x + 3$'),
     K('$2x − 4 = x + 3$, pa je $x = 7$.')]);

  L('Primena linearnih jednačina');
  Z(2, 'Zbir dva broja je $40$, a jedan je za $6$ veći od drugog. Koji je veći broj?',
    ['23', '17', '20', '26'],
    [K('Neka su brojevi $x$ i $x + 6$: $x + x + 6 = 40$.'),
     K('$2x = 34$, pa je $x = 17$; veći je $17 + 6 = 23$.')]);
  Z(2, 'Zbir tri uzastopna parna broja je $36$. Koji je najveći od njih?',
    ['14', '12', '16', '18'],
    [K('Brojevi: $n$, $n + 2$, $n + 4$; zbir $3n + 6 = 36$.'),
     K('$3n = 30$, pa je $n = 10$; najveći je $14$.')]);
  Z(2, 'Obim pravougaonika je $40 cm$, a dužina je za $4 cm$ veća od širine. Kolika je dužina?',
    ['$12 cm$', '$10 cm$', '$14 cm$', '$8 cm$'],
    [K('Širina $x$, dužina $x + 4$: $2(x + x + 4) = 40$.'),
     K('$4x + 8 = 40$, pa je $x = 8 cm$; dužina je $12 cm$.')]);
  Z(2, 'Otac je tri puta stariji od sina, a zajedno imaju $36$ godina. Koliko godina ima sin?',
    ['9', '12', '10', '8'],
    [K('Sin $x$, otac $3x$: $x + 3x = 36$.'),
     K('$4x = 36$, pa je $x = 9$ godina.')]);
  Z(3, 'Cena majice uvećana je za $20 %$ i sada iznosi $960$ dinara. Kolika je bila cena?',
    ['$800$ dinara', '$768$ dinara', '$820$ dinara', '$750$ dinara'],
    [K('Nova cena je $120 %$ stare: $1,2x = 960$.'),
     K('$x = {960|1,2} = 800$ dinara.')]);
  Z(3, 'Broj uvećan za $25 %$ iznosi $50$. Koji je to broj?',
    ['40', '37,5', '45', '42'],
    [K('$1,25x = 50$'),
     K('$x = {50|1,25} = 40$.')]);

  L('Primena linearnih jednačina na probleme kretanja');
  Z(2, 'Automobil pređe $180 km$ za $2,5$ sata. Kolika mu je srednja brzina?',
    ['$72 km/h$', '$75 km/h$', '$90 km/h$', '$70 km/h$'],
    [K('$v = {s|t} = {180|2,5} = 72 km/h$.')]);
  Z(2, 'Pešak hoda brzinom $5 km/h$. Koliko pređe za $3$ sata?',
    ['$15 km$', '$8 km$', '$12 km$', '$18 km$'],
    [K('$s = v · t = 5 · 3 = 15 km$.')]);
  Z(2, 'Dva automobila krenu jedan drugom u susret iz mesta udaljenih $200 km$. Prvi vozi $40 km/h$, drugi $60 km/h$. Posle koliko sati se sreću?',
    ['2 sata', '2,5 sata', '1,5 sati', '3 sata'],
    [K('Brzina približavanja: $40 + 60 = 100 km/h$.'),
     K('$t = {200|100} = 2$ sata.')]);
  Z(2, 'Voz vozi stalnom brzinom $90 km/h$. Koliko pređe za $2$ sata?',
    ['$180 km$', '$45 km$', '$90 km$', '$360 km$'],
    [K('$s = 90 · 2 = 180 km$.')]);
  Z(2, 'Biciklista pređe $45 km$ brzinom $15 km/h$. Koliko dugo vozi?',
    ['3 sata', '4 sata', '2,5 sata', '2 sata'],
    [K('$t = {45|15} = 3$ sata.')]);
  Z(3, 'Pešak pređe $12 km$ za $3$ sata. Kolika mu je srednja brzina?',
    ['$4 km/h$', '$36 km/h$', '$9 km/h$', '$15 km/h$'],
    [K('$v = {s|t} = {12|3} = 4 km/h$.')]);

  L('Još neke primene linearnih jednačina');
  Z(2, 'Bure se puni kroz prvu cev za $3$ sata, a kroz drugu za $6$ sati. Za koliko se napuni kroz obe istovremeno?',
    ['2 sata', '4,5 sata', '1,5 sati', '3 sata'],
    [K('Za $1$ h: ${1|3} + {1|6} = {2|6} + {1|6} = {3|6} = {1|2}$ bureta.'),
     K('Celo bure za $2$ sata.')]);
  Z(2, 'Cena je poskupljenjem od $25 %$ porasla na $1.250$ dinara. Kolika je bila cena pre poskupljenja?',
    ['$1.000$ dinara', '$937,5$ dinara', '$1.100$ dinara', '$1.050$ dinara'],
    [K('$1,25x = 1250$'),
     K('$x = {1250|1,25} = 1000$ dinara.')]);
  Z(3, 'Posle sniženja od $30 %$ jakna košta $3.500$ dinara. Kolika je bila cena pre sniženja?',
    ['$5.000$ dinara', '$4.550$ dinara', '$4.500$ dinara', '$5.500$ dinara'],
    [K('$0,7x = 3500$'),
     K('$x = {3500|0,7} = 5000$ dinara.')]);
  Z(2, 'U smeši mase $30 kg$ so čini $20 %$. Koliko kilograma soli ima u smeši?',
    ['$6 kg$', '$15 kg$', '$5 kg$', '$4 kg$'],
    [K('$30 · 0,2 = 6 kg$.')]);
  Z(2, 'Broj uvećan za svoju trećinu iznosi $20$. Koji je to broj?',
    ['15', '12', '18', '10'],
    [K('$x + {x|3} = 20$, tj. ${4x|3} = 20$.'),
     K('$4x = 60$, pa je $x = 15$.')]);
  Z(3, 'Dve slavine pune bazen: prva za $4$ sata, druga za $12$ sati. Za koliko se bazen napuni kroz obe?',
    ['3 sata', '4 sata', '2 sata', '6 sati'],
    [K('Za $1$ h: ${1|4} + {1|12} = {3|12} + {1|12} = {4|12} = {1|3}$ bazena.'),
     K('Ceo bazen za $3$ sata.')]);
  Z(3, 'U posudu je dodato $5 kg$ soli i sada so čini $30 %$ smeše od $20 kg$. Koliko je soli bilo na početku?',
    ['$1 kg$', '$6 kg$', '$5 kg$', '$2 kg$'],
    [K('Sada ima $20 · 0,3 = 6 kg$ soli.'),
     K('Pre dodavanja: $6 − 5 = 1 kg$.')]);

  L('Nejednačine');
  Z(1, 'Koji znak označava „manje“?',
    ['$<$', '$>$', '$≥$', '$=$'],
    [K('$<$ = manje, $>$ = veće, $≥$ = veće ili jednako.')]);
  Z(1, 'Koji brojevi su rešenja nejednačine $x < 2$?',
    ['Svi brojevi manji od 2', 'Samo broj 2', 'Svi brojevi veći od 2', 'Brojevi 2 i manji'],
    [K('Stroga nejednakost $x < 2$: svi brojevi manji od $2$, a $2$ nije rešenje.')]);
  Z(2, 'Da li je broj $3$ rešenje nejednačine $x ≥ 3$?',
    ['Da', 'Ne', 'Ne može se odrediti', 'Samo ako je x veće od 3'],
    [K('$3 ≥ 3$ je tačno, pa $3$ jeste rešenje.')]);
  Z(2, 'Da li je broj $−1$ rešenje nejednačine $x > 0$?',
    ['Ne', 'Da', 'Ne može se odrediti', 'Samo ako je x celo'],
    [K('$−1 > 0$ je netačno, pa $−1$ nije rešenje.')]);
  Z(3, 'Skup rešenja nejednačine $x ≥ 4$ na brojevnoj pravoj predstavlja se…',
    ['zrakom udesno sa punom tačkom na 4', 'zrakom ulevo sa punom tačkom', 'zrakom udesno sa praznom tačkom', 'samo tačkom 4'],
    [K('$x ≥ 4$: svi brojevi veći ili jednaki $4$ – zrak udesno.'),
     K('Pošto je $4$ uključeno, tačka na $4$ je puna.')]);
  Z(3, 'Skup rešenja nejednačine $x < −1$ predstavlja se…',
    ['zrakom ulevo sa praznom tačkom na −1', 'zrakom udesno sa praznom tačkom', 'zrakom ulevo sa punom tačkom', 'celom brojevnom pravom'],
    [K('$x < −1$: svi brojevi manji od $−1$ – zrak ulevo.'),
     K('Pošto $−1$ nije uključeno, tačka je prazna.')]);

  L('Ekvivalentne nejednačine');
  Z(1, 'Ako obe strane nejednačine pomnožimo POZITIVNIM brojem, znak nejednakosti…',
    ['ostaje isti', 'se okreće', 'postaje =', 'nestaje'],
    [K('Množenje pozitivnim brojem ne menja znak nejednakosti.')]);
  Z(2, 'Reši nejednačinu $x − 3 > 1$.',
    ['$x > 4$', '$x < 4$', '$x > −4$', '$x ≥ 4$'],
    [K('Dodamo $3$: $x > 4$.')]);
  Z(2, 'Reši nejednačinu $x + 2 ≤ 5$.',
    ['$x ≤ 3$', '$x ≥ 3$', '$x ≤ 7$', '$x < 3$'],
    [K('Oduzmemo $2$: $x ≤ 3$.')]);
  Z(2, 'Reši nejednačinu $−2x ≥ 8$.',
    ['$x ≤ −4$', '$x ≥ −4$', '$x ≤ 4$', '$x ≥ 4$'],
    [K('Delimo sa $−2$ (negativno, znak se okreće): $x ≤ −4$.')]);
  Z(2, 'Reši nejednačinu ${x|3} < 2$.',
    ['$x < 6$', '$x > 6$', '$x < 5$', '$x > 5$'],
    [K('Množimo sa $3$: $x < 6$.')]);
  Z(3, 'Reši nejednačinu $2x − 1 > 5$.',
    ['$x > 3$', '$x < 3$', '$x > 2$', '$x ≥ 3$'],
    [K('$2x > 6$, pa je $x > 3$.')]);

  L('Linearna nejednačina');
  Z(1, 'Koja od sledećih je linearna nejednačina?',
    ['$3x − 2 < 7$', '$x² > 4$', '${1|x} < 2$', '$√{x} ≥ 3$'],
    [K('Linearna nejednačina ima nepoznatu na prvom stepenu.'),
     K('$3x − 2 < 7$ je linearna.')]);
  Z(2, 'Reši nejednačinu $2x + 1 ≥ 5$.',
    ['$x ≥ 2$', '$x ≤ 2$', '$x > 2$', '$x ≥ 3$'],
    [K('$2x ≥ 4$, pa je $x ≥ 2$.')]);
  Z(2, 'Reši nejednačinu $3x − 2 ≤ 7$.',
    ['$x ≤ 3$', '$x ≥ 3$', '$x ≤ 5$', '$x < 3$'],
    [K('$3x ≤ 9$, pa je $x ≤ 3$.')]);
  Z(2, 'Reši nejednačinu $4 − x > 1$.',
    ['$x < 3$', '$x > 3$', '$x < −3$', '$x > −3$'],
    [K('$−x > −3$; množimo sa $−1$: $x < 3$.')]);
  Z(2, 'Reši nejednačinu $x + 3 < 2$.',
    ['$x < −1$', '$x > −1$', '$x < 1$', '$x > 1$'],
    [K('Oduzmemo $3$: $x < −1$.')]);
  Z(3, 'Reši nejednačinu $5 − 2x ≥ 1$.',
    ['$x ≤ 2$', '$x ≥ 2$', '$x ≤ −2$', '$x ≥ −2$'],
    [K('$−2x ≥ −4$; delimo sa $−2$: $x ≤ 2$.')]);
  Z(3, 'Reši nejednačinu $2(x − 1) < 4$.',
    ['$x < 3$', '$x > 3$', '$x < 2$', '$x < 5$'],
    [K('$2x − 2 < 4$, pa je $2x < 6$ i $x < 3$.')]);

  L('Rešavanje linearnih nejednačina');
  Z(2, 'Reši nejednačinu $2x − 5 < 3x + 1$.',
    ['$x > −6$', '$x < −6$', '$x > 6$', '$x < 6$'],
    [K('$2x − 3x < 1 + 5$, pa je $−x < 6$.'),
     K('Množimo sa $−1$: $x > −6$.')]);
  Z(2, 'Reši nejednačinu ${x|2} + 1 ≥ 3$.',
    ['$x ≥ 4$', '$x ≤ 4$', '$x ≥ 2$', '$x > 4$'],
    [K('${x|2} ≥ 2$, pa je $x ≥ 4$.')]);
  Z(3, 'Reši nejednačinu $3(x − 1) ≤ 2x + 2$.',
    ['$x ≤ 5$', '$x ≥ 5$', '$x ≤ 3$', '$x ≥ 3$'],
    [K('$3x − 3 ≤ 2x + 2$'),
     K('$3x − 2x ≤ 2 + 3$, pa je $x ≤ 5$.')]);
  Z(3, 'Reši nejednačinu $−x + 4 > 2$.',
    ['$x < 2$', '$x > 2$', '$x < −2$', '$x > −2$'],
    [K('$−x > −2$; množimo sa $−1$: $x < 2$.')]);
  Z(3, 'Najveći ceo broj koji zadovoljava nejednačinu $3x − 8 < 4$ je:',
    ['3', '4', '2', '5'],
    [K('$3x < 12$, pa je $x < 4$.'),
     K('Najveći ceo broj manji od $4$ je $3$.')]);
  Z(3, 'Najmanji ceo broj koji zadovoljava nejednačinu $2x + 5 ≥ 10$ je:',
    ['3', '2', '4', '5'],
    [K('$2x ≥ 5$, pa je $x ≥ 2,5$.'),
     K('Najmanji ceo broj veći ili jednak $2,5$ je $3$.')]);

  L('Primena linearnih nejednačina');
  Z(2, 'Za prevoz $200$ učenika koriste se autobusi koji primaju po $45$ učenika. Koliko najmanje autobusa treba?',
    ['5', '4', '6', '3'],
    [K('$45n ≥ 200$, pa je $n ≥ {200|45} = 4,44$.'),
     K('Najmanji ceo broj je $5$ (jer $4$ autobusa prevoze samo $180$).')]);
  Z(2, 'Milan ima $300$ dinara. Sveska košta $50$, a olovka $25$ dinara. Ako kupi jednu svesku, koliko najviše olovaka može?',
    ['10', '12', '8', '11'],
    [K('Posle sveske ostaje $300 − 50 = 250$ dinara.'),
     K('$25x ≤ 250$, pa je $x ≤ 10$.')]);
  Z(3, 'Obim pravougaonika je manji od $60 cm$. Ako je širina $10 cm$, koje vrednosti može imati dužina $a$?',
    ['$a < 20 cm$', '$a < 30 cm$', '$a < 40 cm$', '$a < 50 cm$'],
    [K('$2(a + 10) < 60$, pa je $a + 10 < 30$.'),
     K('$a < 20 cm$.')]);
  Z(3, 'Za koje prirodne brojeve $n$ važi da je $n + {n|2} < 12$?',
    ['$n < 8$, tj. $1, 2, …, 7$', '$n < 12$', '$n < 6$', '$n < 10$'],
    [K('${3n|2} < 12$, pa je $3n < 24$ i $n < 8$.'),
     K('Prirodni brojevi manji od $8$ su $1, 2, …, 7$.')]);
  Z(3, 'Za priredbu je potrebno obezbediti bar $90$ mesta. Jedan sto prima $8$ osoba. Koliko najmanje stolova treba?',
    ['12', '11', '13', '10'],
    [K('$8n ≥ 90$, pa je $n ≥ {90|8} = 11,25$.'),
     K('Najmanji ceo broj je $12$.')]);
  Z(3, 'U kutiju staje najviše $24$ knjige. Koliko najmanje kutija treba za $160$ knjiga?',
    ['7', '6', '8', '5'],
    [K('$24n ≥ 160$, pa je $n ≥ {160|24} = 6,67$.'),
     K('Najmanji ceo broj je $7$ (šest kutija drži samo $144$).')]);
};
