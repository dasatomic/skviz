// Linearne funkcije — 8. razred: pojam, grafik, karakteristike, primene.
module.exports = ({ L, Z, G, K, proveri, r, grafik, prava, A }) => {

  // ════════════════ 6.1 Pojam funkcije ════════════════
  L('Pojam funkcije');

  Z(1, 'Funkcija je pravilo koje svakoj vrednosti $x$ dodeljuje…',
    ['tačno jednu vrednost $y$', 'bar dve vrednosti $y$', 'nulu', 'bilo koju vrednost'],
    [K('Funkcija svakom $x$ iz oblasti definisanosti dodeljuje tačno jednu vrednost $y$.'),
     K('Zato na grafiku funkcije ne smeju postojati dve tačke sa istim $x$ i različitim $y$.')]);

  Z(1, 'Za funkciju $y = 2x + 1$, koliko je $y$ kada je $x = 3$?',
    ['7', '6', '5', '8'],
    [K('$y = 2 · 3 + 1 = 7$.'),
     K('Uređeni par $(3, 7)$ pripada grafiku funkcije.')]);

  Z(2, 'Koja zavisnost jeste funkcija po $x$?',
    ['$y = x + 1$', '$y² = x$', '$x² + y² = 1$', '$|y| = x$'],
    [K('U $y = x + 1$ svakom $x$ odgovara tačno jedno $y$.'),
     K('Kod $y² = x$ (tj. $x = y²$), za $x = 4$ imamo $y = 2$ i $y = −2$ – dva rešenja, pa to nije funkcija.'),
     K('Kružnica $x² + y² = 1$ takođe nije grafik funkcije.')]);

  Z(3, 'Funkcija je zadata sa $f(x) = 3x − 2$. Koliko je $f(4) − f(1)$?',
    ['9', '12', '7', '3'],
    [K('$f(4) = 3 · 4 − 2 = 10$, $f(1) = 3 · 1 − 2 = 1$.'),
     K('$f(4) − f(1) = 10 − 1 = 9$.'),
     K('Za linearnu funkciju promena je proporcionalna promeni $x$: $3 · (4 − 1) = 9$.')]);

  // ════════════════ 6.2 Linearna funkcija y = kx + n ════════════════
  L('Linearna funkcija y = kx + n');

  Z(1, 'U linearnoj funkciji $y = kx + n$, šta predstavlja $k$?',
    ['koeficijent pravca (nagib)', 'odsečak na y-osi', 'nulu funkcije', 'promenljivu'],
    [K('$k$ je koeficijent pravca – govori koliko je grafik strm.'),
     K('$n$ je odsečak na $y$-osi (vrednost $y$ za $x = 0$).')]);

  Z(1, 'Za funkciju $y = 2x + 3$, gde grafik seče $y$-osu?',
    ['U tački (0, 3)', 'U tački (3, 0)', 'U tački (0, 2)', 'U tački (2, 0)'],
    [K('$y$-osa se seče za $x = 0$: $y = 2 · 0 + 3 = 3$.'),
     K('Odsečak na $y$-osi je $n = 3$.', [], grafik(2, 3, { nagib: 1, kT: 1 }))]);

  Z(2, 'Koliki je koeficijent pravca funkcije $y = −3x + 5$?',
    ['−3', '5', '3', '−5'],
    [K('Koeficijent pravca je broj uz $x$: $k = −3$.'),
     K('Odsečak na $y$-osi je $n = 5$.'),
     K('Negativan $k$ znači da funkcija opada.'),
     K('Grafik linearne funkcije je prava:', [], A('linearna-funkcija', '$k$ je nagib, a $n$ presek sa y-osom'))]);

  Z(2, 'Koja funkcija ima odsečak na $y$-osi jednak $4$?',
    ['$y = 2x + 4$', '$y = 4x$', '$y = 4x + 2$', '$y = x − 4$'],
    [K('Odsečak na $y$-osi je slobodan član: $n = 4$.'),
     K('$y = 2x + 4$ seče $y$-osu u $(0, 4)$.'),
     K('$y = 4x$ seče je u $(0, 0)$.')]);

  // ════════════════ 6.3 Primeri linearnih funkcija ════════════════
  L('Primeri linearnih funkcija');

  Z(1, 'Taksi naplaćuje start od $150$ dinara i $60$ dinara po kilometru. Koja funkcija daje cenu $y$ za $x$ pređenih kilometara?',
    ['$y = 60x + 150$', '$y = 150x + 60$', '$y = 60x$', '$y = 150x$'],
    [K('Fiksni deo (start) je odsečak: $150$.'),
     K('Cena po kilometru je koeficijent: $60$ dinara/km.'),
     K('$y = 60x + 150$.')]);

  Z(2, 'Voda u sudu hladi se $2°C$ svakog minuta. Početna temperatura je $80°C$. Koja funkcija daje temperaturu $y$ posle $x$ minuta?',
    ['$y = −2x + 80$', '$y = 2x + 80$', '$y = 80x − 2$', '$y = 2x − 80$'],
    [K('Temperatura opada, pa je koeficijent negativan: $−2$.'),
     K('Početna vrednost je odsečak: $80$.'),
     K('$y = −2x + 80$.')]);

  Z(3, 'Krojač naplaćuje $500$ dinara po košulji plus fiksni trošak materijala od $1000$ dinara. Koliko košta izrada $8$ košulja?',
    ['$5000$ dinara', '$4000$ dinara', '$5400$ dinara', '$4500$ dinara'],
    [K('Funkcija: $y = 500x + 1000$.'),
     K('Za $x = 8$: $y = 500 · 8 + 1000 = 4000 + 1000 = 5000$ dinara.')]);

  // ════════════════ 6.4 Grafik linearne funkcije ════════════════
  L('Grafik linearne funkcije');

  Z(1, 'Grafik linearne funkcije je…',
    ['prava', 'parabola', 'kružnica', 'hiperbola'],
    [K('Grafik linearne funkcije $y = kx + n$ je prava linija.'),
     K('Za crtanje su dovoljne dve tačke.')]);

  Z(1, 'Kroz koje dve tačke prolazi grafik funkcije $y = x + 2$?',
    ['(0, 2) i (1, 3)', '(0, 0) i (1, 2)', '(2, 0) i (0, 1)', '(0, 2) i (2, 1)'],
    [K('Za $x = 0$: $y = 2$ → tačka $(0, 2)$.'),
     K('Za $x = 1$: $y = 3$ → tačka $(1, 3)$.'),
     K('Obe tačke leže na istoj pravoj.')]);

  Z(2, 'Koja tačka NE pripada grafiku funkcije $y = 2x − 1$?',
    ['(1, 2)', '(0, −1)', '(2, 3)', '(−1, −3)'],
    [K('Proverimo $(1, 2)$: $2 · 1 − 1 = 1 ≠ 2$ – ne pripada.'),
     K('Ostale: $(0, −1)$ → $−1$ ✓; $(2, 3)$ → $3$ ✓; $(−1, −3)$ → $−3$ ✓.')]);

  Z(3, 'Grafik funkcije $y = {x|2} + 1$ seče $x$-osu u tački…',
    ['(−2, 0)', '(2, 0)', '(0, −2)', '(0, 1)'],
    [K('Na $x$-osi je $y = 0$: $0 = {x|2} + 1$.'),
     K('${x|2} = −1$, pa je $x = −2$.'),
     K('Tačka preseka je $(−2, 0)$.')]);

  // ════════════════ 6.5 Neke karakteristike i grafici ════════════════
  L('Neke karakteristike linearne funkcije i njihovi grafici');

  Z(1, 'Grafik funkcije $y = 3$ je…',
    ['horizontalna prava', 'vertikalna prava', 'kosa prava', 'parabola'],
    [K('$y = 3$ znači da je $y$ uvek $3$, bez obzira na $x$.'),
     K('To je horizontalna prava paralelna $x$-osi.'),
     K('Ovde je $k = 0$, $n = 3$.', [], grafik(0, 3, { nagib: false, podela: 1 }))]);

  Z(2, 'Koje dve funkcije imaju paralelne grafike?',
    ['$y = 2x + 1$ i $y = 2x − 3$', '$y = 2x + 1$ i $y = −2x + 1$', '$y = x + 1$ i $y = 2x + 1$', '$y = 2x$ i $y = 2$'],
    [K('Paralelne prave imaju isti koeficijent pravca $k$.'),
     K('$y = 2x + 1$ i $y = 2x − 3$ imaju $k = 2$ – paralelne su.'),
     K('Razlikuju se po odsečku $n$.')]);

  Z(3, 'Za koju vrednost $a$ je grafik funkcije $y = ax + 4$ paralelan grafiku $y = 5x − 1$?',
    ['$a = 5$', '$a = 4$', '$a = −1$', '$a = −5$'],
    [K('Paralelne prave imaju isti koeficijent pravca.'),
     K('Druga funkcija ima $k = 5$, pa mora biti $a = 5$.')]);

  // ════════════════ 6.6 Nule i znak linearne funkcije ════════════════
  L('Nule i znak linearne funkcije');

  Z(1, 'Nula funkcije je vrednost $x$ za koju je…',
    ['$y = 0$', '$x = 0$', '$y = 1$', '$x = 1$'],
    [K('Nula funkcije je rešenje jednačine $f(x) = 0$.'),
     K('Na grafiku je to tačka preseka sa $x$-osom.')]);

  Z(2, 'Kolika je nula funkcije $y = 2x − 6$?',
    ['3', '−3', '6', '2'],
    [K('$2x − 6 = 0$, pa je $2x = 6$ i $x = 3$.'),
     K('Grafik seče $x$-osu u tački $(3, 0)$.', [], grafik(2, -6, { od: -1, do: 5 }))]);

  Z(2, 'Za koje $x$ je funkcija $y = x − 2$ pozitivna?',
    ['$x > 2$', '$x < 2$', '$x > 0$', '$x < 0$'],
    [K('$x − 2 > 0$, pa je $x > 2$.'),
     K('Nula je $x = 2$; desno od nule funkcija je pozitivna (jer $k = 1 > 0$).', [], grafik(1, -2, { od: -2, do: 5, podela: 1 }))]);

  Z(3, 'Funkcija $y = −2x + 8$ je negativna za…',
    ['$x > 4$', '$x < 4$', '$x > −4$', '$x < −4$'],
    [K('Nula: $−2x + 8 = 0$, pa je $x = 4$.'),
     K('Kako je $k = −2 < 0$, funkcija opada: desno od nule (za $x > 4$) je negativna.'),
     K('Provera: $x = 5$ → $−10 + 8 = −2 < 0$ ✓.', [], grafik(-2, 8, { od: -1, do: 6, podela: 2 }))]);

  // ════════════════ 6.7 Rast i opadanje linearne funkcije ════════════════
  L('Rast i opadanje linearne funkcije');

  Z(1, 'Funkcija $y = kx + n$ je rastuća ako je…',
    ['$k > 0$', '$k < 0$', '$k = 0$', '$n > 0$'],
    [K('Ako je $k > 0$, sa porastom $x$ raste i $y$ – funkcija je rastuća.'),
     K('Ako je $k < 0$, funkcija je opadajuća.'),
     K('Ako je $k = 0$, funkcija je konstantna.')]);

  Z(2, 'Koja funkcija je opadajuća?',
    ['$y = −3x + 1$', '$y = 3x + 1$', '$y = 1$', '$y = 0,5x − 2$'],
    [K('Opadajuća funkcija ima negativan koeficijent pravca.'),
     K('$y = −3x + 1$ ima $k = −3 < 0$ – opada.')]);

  Z(3, 'Za koju vrednost $a$ funkcija $y = (a − 2)x + 1$ raste?',
    ['$a > 2$', '$a < 2$', '$a = 2$', '$a > 0$'],
    [K('Funkcija raste ako je koeficijent pozitivan: $a − 2 > 0$.'),
     K('$a > 2$.'),
     K('Za $a = 2$ funkcija bi bila konstantna ($y = 1$).')]);

  // ════════════════ 6.8 Implicitni oblik linearne funkcije ════════════════
  L('Implicitni oblik linearne funkcije');

  Z(1, 'Implicitni (opšti) oblik jednačine prave je…',
    ['$ax + by + c = 0$', '$y = kx + n$', '$y = ax² + bx + c$', '$xy = c$'],
    [K('Opšti oblik: $ax + by + c = 0$.'),
     K('Eksplicitni oblik: $y = kx + n$.'),
     K('Iz opšteg se dobija eksplicitni rešavanjem po $y$.')]);

  Z(2, 'Izrazi jednačinu $2x + y − 4 = 0$ u eksplicitnom obliku.',
    ['$y = −2x + 4$', '$y = 2x − 4$', '$y = −2x − 4$', '$y = 2x + 4$'],
    [K('Rešimo po $y$: $y = −2x + 4$.'),
     K('Koeficijent pravca je $k = −2$, odsečak $n = 4$.')]);

  Z(3, 'Napiši u opštem obliku pravu $y = 3x − 5$.',
    ['$3x − y − 5 = 0$', '$3x + y − 5 = 0$', '$3x − y + 5 = 0$', '$y − 3x = 5$'],
    [K('Prebacimo sve na jednu stranu: $3x − y − 5 = 0$.'),
     K('Ovo je oblik $ax + by + c = 0$ sa $a = 3$, $b = −1$, $c = −5$.')]);

  // ════════════════ 6.9 Čitanje grafika linearne funkcije ════════════════
  L('Čitanje grafika linearne funkcije');

  Z(2, 'Prava prolazi kroz tačke $(0, 1)$ i $(1, 3)$. Koja joj je jednačina?',
    ['$y = 2x + 1$', '$y = x + 1$', '$y = 3x + 1$', '$y = 2x + 3$'],
    [K('Odsečak na $y$-osi je $n = 1$ (tačka $(0, 1)$).'),
     K('Koeficijent pravca: za porast $x$ za $1$, $y$ poraste za $3 − 1 = 2$, pa je $k = 2$.'),
     K('$y = 2x + 1$.')]);

  Z(2, 'Prava prolazi kroz tačke $(1, 2)$ i $(3, 6)$. Koliki joj je koeficijent pravca?',
    ['2', '3', '${1|2}$', '4'],
    [K('$k = {y_{2} − y_{1}|x_{2} − x_{1}} = {6 − 2|3 − 1} = {4|2} = 2$.')]);

  Z(3, 'Prava prolazi kroz $(0, 3)$ i $(2, 5)$. Gde seče $x$-osu?',
    ['U $x = −3$', 'U $x = 3$', 'U $x = −1,5$', 'U $x = 1,5$'],
    [K('$n = 3$; $k = {5 − 3|2 − 0} = 1$, pa je $y = x + 3$.'),
     K('Nula: $x + 3 = 0$, pa je $x = −3$.'),
     K('Tačka preseka sa $x$-osom je $(−3, 0)$.')]);

  // ════════════ dopuna do 10 po lekciji ════════════

  L('Pojam funkcije');
  Z(1, 'Za funkciju $y = x + 2$, koliko je $y$ kada je $x = 5$?',
    ['7', '3', '10', '5'],
    [K('$y = 5 + 2 = 7$.')]);
  Z(1, 'Za funkciju $y = 3x − 1$, koliko je $y$ kada je $x = 2$?',
    ['5', '4', '6', '7'],
    [K('$y = 3 · 2 − 1 = 5$.')]);
  Z(2, 'Funkcija je data sa $f(x) = 2x + 3$. Koliko je $f(0)$?',
    ['3', '2', '5', '0'],
    [K('$f(0) = 2 · 0 + 3 = 3$.')]);
  Z(2, 'Koja zavisnost jeste funkcija po $x$?',
    ['$y = 2x$', '$y² = x$', '$|y| = x$', '$x² + y² = 4$'],
    [K('U $y = 2x$ svakom $x$ odgovara tačno jedno $y$.'),
     K('Kod $y² = x$ (tj. $x = y²$) i kružnice $x² + y² = 4$ nekom $x$ odgovara više vrednosti $y$.')]);
  Z(2, 'Funkcija je data sa $f(x) = x²$. Koliko je $f(3)$?',
    ['9', '6', '3', '0'],
    [K('$f(3) = 3² = 9$.'),
     K('To nije linearna funkcija, ali jeste funkcija.')]);
  Z(3, 'Koja zavisnost NIJE funkcija po $x$?',
    ['$x = y²$', '$y = x + 1$', '$y = −2x$', '$y = 5$'],
    [K('Iz $x = y²$ (isto što i $y² = x$): za $x = 4$ su i $y = 2$ i $y = −2$ rešenja.'),
     K('Dve vrednosti $y$ za isti $x$ – to nije funkcija.')]);

  L('Linearna funkcija y = kx + n');
  Z(1, 'Koliki je koeficijent pravca funkcije $y = 3x − 2$?',
    ['3', '−2', '2', '−3'],
    [K('Koeficijent pravca je broj uz $x$: $k = 3$.'),
     K('Odsečak na $y$-osi je $n = −2$.')]);
  Z(1, 'Gde grafik funkcije $y = −x + 4$ seče $y$-osu?',
    ['U (0, 4)', 'U (4, 0)', 'U (0, −4)', 'U (−1, 4)'],
    [K('Za $x = 0$: $y = 4$, pa je presek $(0, 4)$.'),
     K('Odsečak na $y$-osi je $n = 4$.')]);
  Z(2, 'Koliki je odsečak na $y$-osi funkcije $y = 5x$?',
    ['0', '5', '1', '−5'],
    [K('$y = 5x$ nema slobodan član, pa je $n = 0$.'),
     K('Grafik prolazi kroz koordinatni početak.')]);
  Z(2, 'Za funkciju $y = 2x − 1$, koliko je $y$ kada je $x = 0$?',
    ['−1', '0', '1', '2'],
    [K('$y = 2 · 0 − 1 = −1$.'),
     K('To je odsečak na $y$-osi: $n = −1$.')]);
  Z(2, 'Koja funkcija ima koeficijent pravca $k = −2$?',
    ['$y = −2x + 1$', '$y = 2x − 1$', '$y = x − 2$', '$y = 2 + x$'],
    [K('Broj uz $x$ mora biti $−2$: to je $y = −2x + 1$.')]);
  Z(3, 'Ako je $n = −3$, gde grafik seče $y$-osu?',
    ['U (0, −3)', 'U (−3, 0)', 'U (0, 3)', 'U (3, 0)'],
    [K('Odsečak na $y$-osi je baš $n$.'),
     K('Tačka preseka je $(0, −3)$.')]);

  L('Primeri linearnih funkcija');
  Z(2, 'Telefonska pretplata je $300$ dinara plus $10$ dinara po minutu. Koja funkcija daje račun $y$ za $x$ minuta?',
    ['$y = 10x + 300$', '$y = 300x + 10$', '$y = 10x$', '$y = 310x$'],
    [K('Fiksni deo (pretplata) je odsečak: $300$.'),
     K('Cena po minutu je koeficijent: $10$.'),
     K('$y = 10x + 300$.')]);
  Z(2, 'Taksi naplaćuje start od $100$ dinara i $80$ dinara po kilometru. Funkcija je:',
    ['$y = 80x + 100$', '$y = 100x + 80$', '$y = 180x$', '$y = 80x$'],
    [K('$y = 80x + 100$.')]);
  Z(2, 'Temperatura raste $3 °C$ svakog minuta, a početna je $20 °C$. Funkcija temperature je:',
    ['$y = 3x + 20$', '$y = 20x + 3$', '$y = −3x + 20$', '$y = 3x$'],
    [K('Rast $3 °C$/min je koeficijent, početnih $20 °C$ je odsečak.'),
     K('$y = 3x + 20$.')]);
  Z(3, 'Krojač naplaćuje $200$ dinara po košulji plus fiksni trošak od $500$ dinara. Koliko košta $6$ košulja?',
    ['$1.700$ dinara', '$1.200$ dinara', '$2.200$ dinara', '$1.500$ dinara'],
    [K('$y = 200x + 500$.'),
     K('Za $x = 6$: $200 · 6 + 500 = 1700$ dinara.')]);
  Z(2, 'Telefon se puni $10 %$ po minutu, a baterija je na $40 %$. Funkcija napunjenosti je:',
    ['$y = 10x + 40$', '$y = 40x + 10$', '$y = −10x + 40$', '$y = 10x$'],
    [K('$y = 10x + 40$.')]);
  Z(3, 'Račun za struju: fiksna pretplata $500$ dinara plus $15$ dinara po kWh. Koja funkcija daje račun?',
    ['$y = 15x + 500$', '$y = 500x + 15$', '$y = 515x$', '$y = 15x$'],
    [K('$y = 15x + 500$.')]);
  Z(3, 'Iz bazena sa $100$ litara ističe $2$ litra vode u minutu. Funkcija količine vode je:',
    ['$y = −2x + 100$', '$y = 2x + 100$', '$y = 100x − 2$', '$y = 2x$'],
    [K('Voda ističe, pa je koeficijent negativan: $−2$.'),
     K('Početnih $100$ litara je odsečak: $y = −2x + 100$.')]);

  L('Grafik linearne funkcije');
  Z(1, 'Grafik funkcije $y = 2x + 1$ prolazi kroz tačke:',
    ['(0, 1) i (1, 3)', '(0, 2) i (1, 3)', '(0, 1) i (1, 2)', '(0, 0) i (1, 3)'],
    [K('Za $x = 0$: $y = 1$ → $(0, 1)$; za $x = 1$: $y = 3$ → $(1, 3)$.')]);
  Z(2, 'Koja tačka pripada grafiku $y = x − 2$?',
    ['$(3, 1)$', '$(3, 2)$', '$(1, 3)$', '$(2, 1)$'],
    [K('Za $x = 3$: $y = 3 − 2 = 1$, pa tačka $(3, 1)$ pripada grafiku.'),
     K('Ostale: $(3, 2)$ → $1 ≠ 2$; $(1, 3)$ → $−1 ≠ 3$; $(2, 1)$ → $0 ≠ 1$.')]);
  Z(2, 'Gde grafik $y = −x + 1$ seče $y$-osu?',
    ['U (0, 1)', 'U (1, 0)', 'U (0, −1)', 'U (−1, 0)'],
    [K('Za $x = 0$: $y = 1$, pa je presek $(0, 1)$.')]);
  Z(2, 'Koja tačka pripada grafiku $y = 3x$?',
    ['(2, 6)', '(3, 6)', '(1, 2)', '(2, 3)'],
    [K('$3 · 2 = 6$, pa je $(2, 6)$ tačno.')]);
  Z(2, 'Grafik funkcije $y = 4$ je:',
    ['horizontalna prava', 'vertikalna prava', 'kosa prava', 'parabola'],
    [K('$y$ je uvek $4$, pa je grafik horizontalna prava na visini $4$.')]);
  Z(1, 'Za crtanje grafika linearne funkcije dovoljno je:',
    ['dve tačke', 'jedna tačka', 'tri tačke', 'nula'],
    [K('Prava je određena sa dve tačke, pa su dve tačke dovoljne.')]);

  L('Neke karakteristike linearne funkcije i njihovi grafici');
  Z(1, 'Funkcija $y = 5$ ima koeficijent pravca:',
    ['0', '5', '1', '−5'],
    [K('$y = 5 = 0 · x + 5$, pa je $k = 0$.')]);
  Z(2, 'Koje prave su paralelne?',
    ['$y = 2x$ i $y = 2x + 5$', '$y = 2x$ i $y = −2x$', '$y = x$ i $y = 2x$', '$y = 2x$ i $y = 5$'],
    [K('Paralelne prave imaju isti koeficijent pravca.'),
     K('Obe imaju $k = 2$.')]);
  Z(2, 'Prave $y = 2x + 3$ i $y = −2x + 3$ seku se…',
    ['na y-osi, u (0, 3)', 'u (1, 5)', 'u (0, 0)', 'nikad'],
    [K('Obe seku $y$-osu u $(0, 3)$ (isti odsečak $n = 3$).'),
     K('To im je zajednička tačka.')]);
  Z(2, 'Za koju vrednost $a$ je grafik $y = ax + 1$ paralelan grafiku $y = 3x − 2$?',
    ['$a = 3$', '$a = 1$', '$a = −2$', '$a = 2$'],
    [K('Paralelne prave imaju isti $k$, pa je $a = 3$.')]);
  Z(3, 'Prave $y = −2x + 1$ i $y = −2x − 5$ su:',
    ['paralelne', 'normalne', 'seku se u (0, 1)', 'iste'],
    [K('Obe imaju $k = −2$ – paralelne su.')]);
  Z(2, 'Grafik funkcije $y = 0$ je:',
    ['x-osa', 'y-osa', 'kosa prava', 'tačka (0, 0)'],
    [K('$y = 0$ je upravo jednačina $x$-ose.')]);
  Z(3, 'Prave $y = x$ i $y = −x$ seku se u tački:',
    ['(0, 0)', '(1, 1)', '(1, −1)', '(0, 1)'],
    [K('Izjednačimo: $x = −x$, pa je $2x = 0$ i $x = 0$, $y = 0$.')]);

  L('Nule i znak linearne funkcije');
  Z(2, 'Kolika je nula funkcije $y = x − 5$?',
    ['5', '−5', '0', '1'],
    [K('$x − 5 = 0$, pa je $x = 5$.')]);
  Z(2, 'Kolika je nula funkcije $y = 3x + 6$?',
    ['−2', '2', '6', '−6'],
    [K('$3x + 6 = 0$, pa je $3x = −6$ i $x = −2$.')]);
  Z(3, 'Funkcija $y = x + 1$ je pozitivna za:',
    ['$x > −1$', '$x < −1$', '$x > 1$', '$x > 0$'],
    [K('Nula je $x = −1$; kako je $k = 1 > 0$, desno od nule funkcija je pozitivna.')]);
  Z(3, 'Funkcija $y = −x + 2$ je pozitivna za:',
    ['$x < 2$', '$x > 2$', '$x < −2$', '$x > 0$'],
    [K('Nula je $x = 2$; kako je $k = −1 < 0$, levo od nule funkcija je pozitivna.')]);
  Z(2, 'Kolika je nula funkcije $y = 2x$?',
    ['0', '2', '−2', '1'],
    [K('$2x = 0$, pa je $x = 0$.')]);
  Z(3, 'Koliko nula ima funkcija $y = 4$?',
    ['Nijednu', 'Jednu', 'Dve', 'Beskonačno mnogo'],
    [K('$y = 4$ nikad nije $0$, pa funkcija nema nulu.')]);

  L('Rast i opadanje linearne funkcije');
  Z(1, 'Funkcija $y = 2x + 1$ je:',
    ['rastuća', 'opadajuća', 'konstantna', 'parna'],
    [K('$k = 2 > 0$, pa funkcija raste.')]);
  Z(1, 'Funkcija $y = −x + 3$ je:',
    ['opadajuća', 'rastuća', 'konstantna', 'neparna'],
    [K('$k = −1 < 0$, pa funkcija opada.')]);
  Z(1, 'Funkcija $y = 5$ je:',
    ['konstantna', 'rastuća', 'opadajuća', 'nema grafika'],
    [K('$k = 0$: vrednost se ne menja – funkcija je konstantna.')]);
  Z(2, 'Za koju vrednost $a$ funkcija $y = (a + 1)x$ raste?',
    ['$a > −1$', '$a < −1$', '$a = −1$', '$a > 0$'],
    [K('Koeficijent $a + 1$ mora biti pozitivan: $a > −1$.')]);
  Z(2, 'Funkcija $y = 0,5x − 2$ je:',
    ['rastuća', 'opadajuća', 'konstantna', 'nema nulu'],
    [K('$k = 0,5 > 0$, pa funkcija raste.')]);
  Z(3, 'Koja funkcija opada?',
    ['$y = −3x + 2$', '$y = 3x − 2$', '$y = 3$', '$y = x$'],
    [K('Opadajuća funkcija ima negativan koeficijent: $y = −3x + 2$.')]);
  Z(3, 'Za koju vrednost $a$ funkcija $y = (2 − a)x$ opada?',
    ['$a > 2$', '$a < 2$', '$a = 2$', '$a > 0$'],
    [K('Koeficijent $2 − a$ mora biti negativan: $2 − a < 0$, pa je $a > 2$.')]);

  L('Implicitni oblik linearne funkcije');
  Z(2, 'Izrazi jednačinu $3x + y − 2 = 0$ u eksplicitnom obliku.',
    ['$y = −3x + 2$', '$y = 3x − 2$', '$y = −3x − 2$', '$y = 3x + 2$'],
    [K('Rešimo po $y$: $y = −3x + 2$.')]);
  Z(2, 'Izrazi jednačinu $x − y + 1 = 0$ u eksplicitnom obliku.',
    ['$y = x + 1$', '$y = x − 1$', '$y = −x + 1$', '$y = −x − 1$'],
    [K('$−y = −x − 1$, pa je $y = x + 1$.')]);
  Z(3, 'Napiši u opštem obliku pravu $y = 2x + 3$.',
    ['$2x − y + 3 = 0$', '$2x + y + 3 = 0$', '$2x − y − 3 = 0$', '$2x + y − 3 = 0$'],
    [K('Prebacimo sve na jednu stranu: $2x − y + 3 = 0$.')]);
  Z(3, 'Napiši u opštem obliku pravu $y = −x + 5$.',
    ['$x + y − 5 = 0$', '$x − y + 5 = 0$', '$x + y + 5 = 0$', '$−x + y − 5 = 0$'],
    [K('$x + y − 5 = 0$.')]);
  Z(3, 'Izrazi $2x + 2y − 4 = 0$ u eksplicitnom obliku.',
    ['$y = −x + 2$', '$y = x − 2$', '$y = −2x + 4$', '$y = 2x − 4$'],
    [K('$2y = −2x + 4$, pa je $y = −x + 2$.')]);
  Z(3, 'Izrazi $4x − 2y = 6$ u eksplicitnom obliku.',
    ['$y = 2x − 3$', '$y = 2x + 3$', '$y = −2x + 3$', '$y = 4x − 6$'],
    [K('$−2y = −4x + 6$, pa je $y = 2x − 3$.')]);
  Z(2, 'Koja jednačina je u opštem obliku?',
    ['$2x − y + 1 = 0$', '$y = 2x + 1$', '$y = 2x − 1$', '$2x = y² + 1$'],
    [K('Opšti oblik je $ax + by + c = 0$: to je $2x − y + 1 = 0$.')]);

  L('Čitanje grafika linearne funkcije');
  Z(2, 'Prava prolazi kroz $(0, 2)$ i $(1, 4)$. Koja joj je jednačina?',
    ['$y = 2x + 2$', '$y = x + 2$', '$y = 4x + 2$', '$y = 2x + 4$'],
    [K('$n = 2$ (presek sa y-osom); $k = {4 − 2|1 − 0} = 2$.'),
     K('$y = 2x + 2$.')]);
  Z(3, 'Prava prolazi kroz $(0, −1)$ i $(2, 3)$. Koja joj je jednačina?',
    ['$y = 2x − 1$', '$y = x − 1$', '$y = 2x + 1$', '$y = 3x − 1$'],
    [K('$n = −1$; $k = {3 − (−1)|2 − 0} = {4|2} = 2$.'),
     K('$y = 2x − 1$.')]);
  Z(2, 'Prava prolazi kroz $(1, 3)$ i $(2, 5)$. Koliki joj je koeficijent pravca?',
    ['2', '3', '1', '4'],
    [K('$k = {5 − 3|2 − 1} = 2$.')]);
  Z(3, 'Prava prolazi kroz $(0, 3)$ i $(3, 0)$. Koliki joj je koeficijent pravca?',
    ['−1', '1', '3', '0'],
    [K('$k = {0 − 3|3 − 0} = {−3|3} = −1$.')]);
  Z(3, 'Prava prolazi kroz $(0, 0)$ i $(2, 6)$. Koja joj je jednačina?',
    ['$y = 3x$', '$y = 2x$', '$y = 6x$', '$y = x$'],
    [K('$n = 0$; $k = {6 − 0|2 − 0} = 3$.'),
     K('$y = 3x$.')]);
  Z(2, 'Prava sa koeficijentom $k = 2$ i odsečkom $n = 1$ seče $y$-osu u:',
    ['(0, 1)', '(1, 0)', '(2, 0)', '(0, 2)'],
    [K('Odsečak $n$ je presek sa $y$-osom: $(0, 1)$.')]);
  Z(3, 'Prava prolazi kroz $(0, 4)$ i $(1, 1)$. Koliki joj je koeficijent pravca?',
    ['−3', '3', '−4', '4'],
    [K('$k = {1 − 4|1 − 0} = −3$.')]);
};
