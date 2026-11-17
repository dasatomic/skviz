// Piramida — 8. razred: pojam, mreža, površina i zapremina.
module.exports = ({ L, Z, G, K, proveri, r, S3, telo }) => {

  // ════════════════ 5.1 Piramida: pojam, vrste, elementi ════════════════
  L('Piramida: pojam, vrste, elementi');

  Z(1, 'Piramida je telo koje ima…',
    ['jednu osnovu i bočne strane trouglove', 'dve osnove', 'bočne strane pravougaonike', 'osnovu krug'],
    [K('Piramida ima jednu osnovu (mnogougao) i bočne strane koje su trouglovi.'),
     K('Svi bočni trouglovi se sastaju u jednom temenu – vrhu piramide.'),
     K('Naziva se po osnovi: trostrana, četvorostrana, šestostrana…')]);

  Z(1, 'Koliko ivica ima četvorostrana piramida?',
    ['8', '6', '12', '4'],
    [K('Osnova ima $4$ ivice, a iz svakog temena osnove ide po jedna bočna ivica do vrha ($4$).'),
     K('Ukupno $4 + 4 = 8$ ivica.'),
     K('Uopšte, $n$-tostrana piramida ima $2n$ ivica.', [], telo('piramida4', { opis: 'Izbroj ivice: 8' }))]);

  Z(2, 'Koliko strana ima šestostrana piramida?',
    ['7', '6', '12', '8'],
    [K('Jedna osnova + $6$ bočnih trouglova = $7$ strana.'),
     K('Temena: $6$ na osnovi i još $1$ u vrhu, ukupno $7$.'),
     K('Ivica: $6 + 6 = 12$.', [], telo('piramida6', { opis: '7 strana, 12 ivica' }))]);

  Z(2, 'Šta je apotema pravilne piramide?',
    ['Visina bočne strane', 'Visina piramide', 'Ivica osnove', 'Dijagonala osnove'],
    [K('Apotema je visina bočnog trougla (spuštena iz vrha piramide na ivicu osnove).'),
     K('Visina piramide ide iz vrha na centar osnove.'),
     K('Apotema se koristi za računanje omotača.')]);

  Z(3, 'Piramida ima $10$ ivica. Koliko strana ima?',
    ['6', '5', '10', '4'],
    [K('Ako je $n$-tostrana, ima $2n$ ivica: $2n = 10$, pa je $n = 5$.'),
     K('Petostrana piramida ima $1$ osnovu + $5$ bočnih = $6$ strana.')]);

  Z(3, 'Za svaki konveksni poliedar važi Ojlerova formula $T − I + S = 2$. Četvorostrana piramida ima $5$ temena i $8$ ivica. Koliko ima strana?',
    ['5', '4', '6', '3'],
    [K('$5 − 8 + S = 2$, pa je $S = 5$ strana.'),
     K('Provera: $1$ osnova (kvadrat) + $4$ bočna trougla = $5$ strana.'),
     K('Ojlerovu formulu možeš proveriti na modelu piramide od kartona.', [], telo('piramida4', { opis: 'Temena − ivice + strane = 2' }))]);

  // ════════════════ 5.2 Mreža piramide ════════════════
  L('Mreža piramide');

  Z(1, 'Mreža četvorostrane piramide sastoji se od…',
    ['1 kvadrat i 4 trougla', '2 kvadrata i 4 trougla', '4 kvadrata', '1 trougao i 4 kvadrata'],
    [K('Osnova je kvadrat ($1$), a omotač su $4$ bočna trougla.'),
     K('Ukupno $1$ kvadrat + $4$ trougla.', [], telo('piramida4', { opis: 'Zamisli kako se mreža savija' }))]);

  Z(2, 'Mreža trostrane piramide (tetraedra) sastoji se od…',
    ['4 trougla', '1 trougao i 3 kvadrata', '2 trougla', '6 trouglova'],
    [K('Tetraedar ima $4$ strane i sve su trouglovi.'),
     K('Mreža je $4$ trougla.'),
     K('Pravilni tetraedar ima $4$ jednakostranična trougla.')]);

  Z(3, 'Koliko mnogouglova ukupno ima mreža petostrane piramide?',
    ['6', '5', '10', '7'],
    [K('Mreža ima onoliko mnogouglova koliko telo ima strana.'),
     K('Petostrana piramida: $1$ petougao + $5$ trouglova = $6$ mnogouglova.')]);

  // ════════════════ 5.3 Površina piramide ════════════════
  L('Površina piramide');

  Z(1, 'Površina piramide računa se kao…',
    ['$P = B + M$', '$P = 2B + M$', '$P = B · M$', '$P = {B + M|2}$'],
    [K('Piramida ima jednu osnovu, pa je $P = B + M$ (osnova + omotač).'),
     K('Omotač je zbir površina svih bočnih trouglova.')]);

  Z(2, 'Pravilna četvorostrana piramida ima osnovnu ivicu $a = 6 cm$ i apotemu $h_{a} = 5 cm$. Kolika je površina omotača?',
    ['$60 cm²$', '$120 cm²$', '$30 cm²$', '$150 cm²$'],
    [K('Omotač su $4$ podudarna trougla, svaki površine ${a · h_{a}|2}$.'),
     K('Jedan trougao: ${6 · 5|2} = 15 cm²$; sva četiri: $4 · 15 = 60 cm²$.'),
     K('Moglo bi se i $M = {O · h_{a}|2} = {24 · 5|2} = 60 cm²$.')]);

  Z(2, 'Pravilna četvorostrana piramida ima osnovnu ivicu $8 cm$ i apotemu $5 cm$. Kolika joj je površina?',
    ['$144 cm²$', '$64 cm²$', '$80 cm²$', '$184 cm²$'],
    [K('$B = a² = 8² = 64 cm²$.'),
     K('Omotač: $M = {O · h_{a}|2} = {4 · 8 · 5|2} = 80 cm²$.'),
     K('$P = B + M = 64 + 80 = 144 cm²$.')]);

  Z(3, 'Pravilna trostrana piramida ima osnovnu ivicu $6 cm$, a visina bočne strane (apotema) je $10 cm$. Kolika je površina omotača?',
    ['$90 cm²$', '$180 cm²$', '$60 cm²$', '$30 cm²$'],
    [K('Omotač čine $3$ trougla osnovice $6 cm$ i visine $10 cm$.'),
     K('Jedan: ${6 · 10|2} = 30 cm²$; tri: $3 · 30 = 90 cm²$.'),
     K('Ili $M = {O · h_{a}|2} = {18 · 10|2} = 90 cm²$.')]);

  // ════════════════ 5.4 Površina pravilne trostrane i šestostrane piramide ════════════════
  L('Površina pravilne trostrane i pravilne šestostrane piramide');

  Z(1, 'Osnova pravilne trostrane piramide je…',
    ['jednakostranični trougao', 'pravougli trougao', 'kvadrat', 'šestougao'],
    [K('Pravilna piramida ima pravilan mnogougao u osnovi, a vrh joj je iznad centra osnove.'),
     K('Pravilna trostrana piramida ima jednakostranični trougao u osnovi.'),
     K('Sve bočne ivice su joj jednake.')]);

  Z(2, 'Pravilna trostrana piramida ima osnovnu ivicu $a = 12 cm$ i apotemu $h_{a} = 8 cm$. Kolika joj je površina? (Površina jednakostraničnog trougla stranice $a$ je ${a²√{3}|4}$.)',
    ['$36√{3} + 144 cm²$', '$36√{3} + 48 cm²$', '$48√{3} + 144 cm²$', '$72√{3} + 144 cm²$'],
    [K('Osnova: $B = {12²√{3}|4} = {144√{3}|4} = 36√{3} cm²$.'),
     K('Omotač: $M = {O · h_{a}|2} = {3 · 12 · 8|2} = 144 cm²$.'),
     K('$P = 36√{3} + 144 cm² ≈ 206,4 cm²$.')]);

  Z(3, 'Pravilna šestostrana piramida ima osnovnu ivicu $4 cm$ i apotemu $10 cm$. Kolika je površina omotača?',
    ['$120 cm²$', '$240 cm²$', '$60 cm²$', '$80 cm²$'],
    [K('Obim osnove: $O = 6 · 4 = 24 cm$.'),
     K('$M = {O · h_{a}|2} = {24 · 10|2} = 120 cm²$.'),
     K('Omotač čini $6$ trouglova $4 × 10$.', [], telo('piramida6', { opis: 'Šest bočnih trouglova' }))]);

  // ════════════════ 5.5 Zapremina piramide ════════════════
  L('Zapremina piramide; zapremina četvorostrane piramide');

  Z(1, 'Zapremina piramide računa se po formuli…',
    ['$V = {B · H|3}$', '$V = B · H$', '$V = {B · H|2}$', '$V = 3B · H$'],
    [K('Zapremina piramide je trećina zapremine prizme iste osnove i visine.'),
     K('$V = {B · H|3}$.')]);

  Z(1, 'Piramida ima osnovu površine $30 cm²$ i visinu $9 cm$. Kolika joj je zapremina?',
    ['$90 cm³$', '$270 cm³$', '$30 cm³$', '$45 cm³$'],
    [K('$V = {B · H|3} = {30 · 9|3} = 90 cm³$.')]);

  Z(2, 'Pravilna četvorostrana piramida ima osnovnu ivicu $6 cm$ i visinu $8 cm$. Kolika joj je zapremina?',
    ['$96 cm³$', '$288 cm³$', '$144 cm³$', '$48 cm³$'],
    [K('$B = 6² = 36 cm²$.'),
     K('$V = {36 · 8|3} = 96 cm³$.', [], telo('piramida4', { opis: 'Zapremina piramide = osnova × visina / 3' }))]);

  Z(3, 'Zapremina piramide je $100 cm³$, a površina osnove $25 cm²$. Kolika joj je visina?',
    ['$12 cm$', '$4 cm$', '$75 cm$', '$25 cm$'],
    [K('Iz $V = {B · H|3}$: $100 = {25 · H|3}$.'),
     K('$25H = 300$, pa je $H = 12 cm$.')]);

  // ════════════════ 5.6 Zapremina pravilne trostrane i šestostrane piramide ════════════════
  L('Zapremina pravilne trostrane i pravilne šestostrane piramide');

  Z(2, 'Pravilna trostrana piramida ima osnovnu ivicu $6 cm$ i visinu $9 cm$. Površina osnove je $9√{3} cm²$. Kolika je zapremina?',
    ['$27√{3} cm³$', '$81√{3} cm³$', '$27 cm³$', '$54√{3} cm³$'],
    [K('$V = {B · H|3} = {9√{3} · 9|3} = 27√{3} cm³ ≈ 46,8 cm³$.', [], telo('piramida3', { opis: 'Trostrana osnova' }))]);

  Z(2, 'Pravilna šestostrana piramida ima osnovu površine $24√{3} cm²$ i visinu $12 cm$. Kolika je zapremina?',
    ['$96√{3} cm³$', '$288√{3} cm³$', '$96 cm³$', '$32√{3} cm³$'],
    [K('$V = {B · H|3} = {24√{3} · 12|3} = 96√{3} cm³ ≈ 166,3 cm³$.', [], telo('piramida6', { opis: 'Šestougaona osnova' }))]);

  Z(3, 'Keopsova piramida je približno pravilna četvorostrana piramida osnovne ivice $230 m$ i visine $146 m$. Kolika joj je približna zapremina?',
    ['$2,57$ miliona $m³$', '$7,7$ miliona $m³$', '$1,1$ milion $m³$', '$3,4$ miliona $m³$'],
    [K('$B = 230² = 52 900 m²$.'),
     K('$V = {52 900 · 146|3} = {7 723 400|3} ≈ 2 574 467 m³$.'),
     K('Dakle oko $2,57$ miliona kubnih metara.')]);

  Z(3, 'Pravilna četvorostrana piramida ima osnovnu ivicu $10 cm$ i bočnu ivicu $13 cm$. Kolika joj je visina?',
    ['$√{119} cm$', '$12 cm$', '$5 cm$', '$8 cm$'],
    [K('Polovina dijagonale osnove: ${a√{2}|2} = {10√{2}|2} = 5√{2} cm$.'),
     K('Visina, poludijagonala i bočna ivica čine pravougli trougao: $H² = 13² − (5√{2})² = 169 − 50 = 119$.'),
     K('$H = √{119} cm ≈ 10,9 cm$.')]);

  // ════════════ dopuna do 10 po lekciji ════════════

  L('Piramida: pojam, vrste, elementi');
  Z(1, 'Bočne strane piramide su:',
    ['trouglovi', 'pravougaonici', 'krugovi', 'šestouglovi'],
    [K('Bočne strane piramide su trouglovi koji se sastaju u vrhu.')]);
  Z(2, 'Broj bočnih strana piramide jednak je broju:',
    ['stranica osnove', 'temena osnove uvećanom za 1', 'dijagonala osnove', 'uglova osnove podeljenom sa 2'],
    [K('Svaka stranica osnove daje jednu bočnu stranu.')]);
  Z(2, 'Koliko ivica ima trostrana piramida (tetraedar)?',
    ['6', '4', '8', '12'],
    [K('$3$ ivice osnove + $3$ bočne = $6$ ivica.')]);
  Z(2, 'Koliko temena ima petostrana piramida?',
    ['6', '5', '10', '7'],
    [K('$5$ temena osnove i još $1$ u vrhu: ukupno $6$ temena.')]);
  Z(2, 'Visina pravilne piramide spaja vrh sa:',
    ['centrom osnove', 'jednim temenom osnove', 'sredinom ivice osnove', 'bilo kojom tačkom osnove'],
    [K('Kod pravilne piramide vrh je tačno iznad centra osnove.')]);
  Z(3, 'Koliko bočnih ivica ima četvorostrana piramida?',
    ['4', '8', '6', '5'],
    [K('Iz svakog od $4$ temena osnove ide po jedna bočna ivica do vrha.')]);

  L('Mreža piramide');
  Z(2, 'Mreža šestostrane piramide sastoji se od:',
    ['1 šestougao i 6 trouglova', '6 šestouglova', '1 šestougao i 3 trougla', '2 šestougla i 6 trouglova'],
    [K('Osnova je šestougao, a omotač čini $6$ bočnih trouglova.')]);
  Z(2, 'Koliko bočnih trouglova ima mreža petostrane piramide?',
    ['5', '6', '4', '3'],
    [K('Petostrana piramida ima $5$ bočnih strana – sve su trouglovi.')]);
  Z(2, 'Mreža trostrane piramide (tetraedra) ima:',
    ['4 trougla', '3 trougla', '1 trougao i 3 kvadrata', '6 trouglova'],
    [K('Tetraedar ima $4$ trouglaste strane.')]);
  Z(3, 'Mreža petostrane piramide sastoji se od:',
    ['1 petougao i 5 trouglova', '5 petouglova', '1 petougao i 3 trougla', '2 petougla i 5 trouglova'],
    [K('Osnova je petougao, omotač je $5$ trouglova.')]);
  Z(2, 'Bočne strane piramide su uvek:',
    ['trouglovi', 'pravougaonici', 'kvadrati', 'trapezi'],
    [K('Bez obzira na osnovu, bočne strane piramide su trouglovi.')]);
  Z(3, 'Koliko trouglova ima mreža pravilne četvorostrane piramide?',
    ['4', '5', '3', '6'],
    [K('Omotač čine $4$ bočna trougla (osnova je kvadrat, nije trougao).')]);
  Z(3, 'Sve bočne ivice pravilne piramide su:',
    ['međusobno jednake', 'različite dužine', 'jednake ivicama osnove', 'jednake visini'],
    [K('Kod pravilne piramide sve bočne ivice su jednake.')]);

  L('Površina piramide');
  Z(2, 'Površina piramide je:',
    ['zbir osnove i omotača', 'samo omotač', 'samo osnova', 'dva puta omotač'],
    [K('$P = B + M$ (osnova + omotač).')]);
  Z(2, 'Pravilna četvorostrana piramida ima osnovnu ivicu $10 cm$ i apotemu $12 cm$. Koliki je omotač?',
    ['$240 cm²$', '$120 cm²$', '$480 cm²$', '$60 cm²$'],
    [K('$O = 4 · 10 = 40 cm$; $M = {O · h_{a}|2} = {40 · 12|2} = 240 cm²$.')]);
  Z(3, 'Pravilna četvorostrana piramida ima osnovnu ivicu $5 cm$ i apotemu $8 cm$. Kolika joj je površina?',
    ['$105 cm²$', '$65 cm²$', '$40 cm²$', '$120 cm²$'],
    [K('$B = 25 cm²$; $M = {20 · 8|2} = 80 cm²$.'),
     K('$P = 25 + 80 = 105 cm²$.')]);
  Z(2, 'Omotač piramide čine:',
    ['bočni trouglovi', 'osnova i bočne strane', 'samo osnova', 'dijagonalni preseci'],
    [K('Omotač je zbir površina svih bočnih trouglova.')]);
  Z(3, 'Pravilna četvorostrana piramida ima osnovnu ivicu $12 cm$ i apotemu $9 cm$. Koliki je omotač?',
    ['$216 cm²$', '$108 cm²$', '$432 cm²$', '$54 cm²$'],
    [K('$O = 48 cm$; $M = {48 · 9|2} = 216 cm²$.')]);
  Z(3, 'Pravilna četvorostrana piramida ima površinu osnove $36 cm²$ i omotač $60 cm²$. Kolika joj je površina?',
    ['$96 cm²$', '$60 cm²$', '$36 cm²$', '$72 cm²$'],
    [K('$P = B + M = 36 + 60 = 96 cm²$.')]);

  L('Površina pravilne trostrane i pravilne šestostrane piramide');
  Z(2, 'Pravilna šestostrana piramida ima osnovu:',
    ['pravilan šestougao', 'pravougli trougao', 'kvadrat', 'krug'],
    [K('Pravilna šestostrana piramida ima pravilan šestougao u osnovi.')]);
  Z(2, 'Pravilna trostrana piramida ima osnovnu ivicu $6 cm$ i apotemu $5 cm$. Koliki joj je omotač?',
    ['$45 cm²$', '$90 cm²$', '$15 cm²$', '$30 cm²$'],
    [K('$O = 18 cm$; $M = {18 · 5|2} = 45 cm²$.')]);
  Z(2, 'Pravilna šestostrana piramida ima osnovnu ivicu $4 cm$ i apotemu $7 cm$. Koliki joj je omotač?',
    ['$84 cm²$', '$42 cm²$', '$168 cm²$', '$28 cm²$'],
    [K('$O = 24 cm$; $M = {24 · 7|2} = 84 cm²$.')]);
  Z(3, 'Površina jednakostraničnog trougla stranice $6 cm$ je:',
    ['$9√{3} cm²$', '$36 cm²$', '$18√{3} cm²$', '$6√{3} cm²$'],
    [K('$B = {a²√{3}|4} = {36√{3}|4} = 9√{3} cm²$.')]);
  Z(3, 'Pravilna šestostrana piramida ima osnovnu ivicu $8 cm$ i apotemu $6 cm$. Koliki joj je omotač?',
    ['$144 cm²$', '$72 cm²$', '$288 cm²$', '$48 cm²$'],
    [K('$O = 48 cm$; $M = {48 · 6|2} = 144 cm²$.')]);
  Z(3, 'Pravilna trostrana piramida ima osnovnu ivicu $4 cm$, apotemu $6 cm$, a površina osnove joj je $4√{3} cm²$. Kolika joj je površina?',
    ['$36 + 4√{3} cm²$', '$36 + 8√{3} cm²$', '$12 + 4√{3} cm²$', '$24 + 4√{3} cm²$'],
    [K('$M = {O · h_{a}|2} = {12 · 6|2} = 36 cm²$.'),
     K('$P = B + M = 36 + 4√{3} cm²$.')]);
  Z(3, 'Kod pravilne piramide važi:',
    ['sve bočne ivice su jednake', 'sve ivice osnove su različite', 'bočne ivice su jednake visini', 'osnova je uvek kvadrat'],
    [K('Pravilna piramida ima pravilan mnogougao u osnovi i jednake bočne ivice.')]);

  L('Zapremina piramide; zapremina četvorostrane piramide');
  Z(2, 'Piramida ima osnovu površine $24 cm²$ i visinu $6 cm$. Kolika joj je zapremina?',
    ['$48 cm³$', '$144 cm³$', '$24 cm³$', '$72 cm³$'],
    [K('$V = {B · H|3} = {24 · 6|3} = 48 cm³$.')]);
  Z(2, 'Piramida ima osnovu površine $18 cm²$ i visinu $9 cm$. Kolika joj je zapremina?',
    ['$54 cm³$', '$162 cm³$', '$27 cm³$', '$81 cm³$'],
    [K('$V = {18 · 9|3} = 54 cm³$.')]);
  Z(2, 'Pravilna četvorostrana piramida ima osnovnu ivicu $8 cm$ i visinu $9 cm$. Kolika joj je zapremina?',
    ['$192 cm³$', '$576 cm³$', '$64 cm³$', '$288 cm³$'],
    [K('$B = 64 cm²$; $V = {64 · 9|3} = 192 cm³$.')]);
  Z(3, 'Piramida ima zapreminu $60 cm³$ i površinu osnove $15 cm²$. Kolika joj je visina?',
    ['$12 cm$', '$4 cm$', '$45 cm$', '$9 cm$'],
    [K('$60 = {15 · H|3} = 5H$, pa je $H = 12 cm$.')]);
  Z(3, 'Pravilna četvorostrana piramida ima osnovnu ivicu $9 cm$ i visinu $7 cm$. Kolika joj je zapremina?',
    ['$189 cm³$', '$567 cm³$', '$63 cm³$', '$189√{2} cm³$'],
    [K('$B = 81 cm²$; $V = {81 · 7|3} = 189 cm³$.')]);
  Z(3, 'Zapremina piramide je trećina zapremine:',
    ['prizme iste osnove i visine', 'prizme iste osnove', 'kocke', 'valjka'],
    [K('Zapremina piramide je ${1|3}$ zapremine prizme sa istom osnovom i visinom.')]);

  L('Zapremina pravilne trostrane i pravilne šestostrane piramide');
  Z(2, 'Pravilna trostrana piramida ima osnovnu ivicu $6 cm$ (površina osnove $9√{3} cm²$) i visinu $6 cm$. Kolika joj je zapremina?',
    ['$18√{3} cm³$', '$54√{3} cm³$', '$18 cm³$', '$27√{3} cm³$'],
    [K('$V = {B · H|3} = {9√{3} · 6|3} = 18√{3} cm³$.')]);
  Z(2, 'Pravilna šestostrana piramida ima osnovu površine $24√{3} cm²$ i visinu $9 cm$. Kolika joj je zapremina?',
    ['$72√{3} cm³$', '$216√{3} cm³$', '$72 cm³$', '$24√{3} cm³$'],
    [K('$V = {24√{3} · 9|3} = 72√{3} cm³ ≈ 124,7 cm³$.')]);
  Z(3, 'Piramida ima zapreminu $48 cm³$ i površinu osnove $16 cm²$. Kolika joj je visina?',
    ['$9 cm$', '$3 cm$', '$8 cm$', '$12 cm$'],
    [K('$48 = {16 · H|3}$, pa je $16H = 144$ i $H = 9 cm$.')]);
  Z(3, 'Pravilna trostrana piramida ima osnovnu ivicu $12 cm$ (površina osnove $36√{3} cm²$) i visinu $8 cm$. Kolika joj je zapremina?',
    ['$96√{3} cm³$', '$288√{3} cm³$', '$96 cm³$', '$32√{3} cm³$'],
    [K('$V = {36√{3} · 8|3} = 96√{3} cm³ ≈ 166,3 cm³$.')]);
  Z(3, 'Piramida ima zapreminu $150 cm³$ i visinu $10 cm$. Kolika joj je površina osnove?',
    ['$45 cm²$', '$15 cm²$', '$50 cm²$', '$30 cm²$'],
    [K('$150 = {B · 10|3}$, pa je $10B = 450$ i $B = 45 cm²$.')]);
  Z(3, 'Piramida ima osnovu površine $30 cm²$ i visinu $12 cm$. Kolika joj je zapremina?',
    ['$120 cm³$', '$360 cm³$', '$40 cm³$', '$90 cm³$'],
    [K('$V = {30 · 12|3} = 120 cm³$.')]);
};
