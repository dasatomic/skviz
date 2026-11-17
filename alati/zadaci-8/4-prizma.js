// Prizma — 8. razred: pojam, dijagonale, mreža, površina i zapremina.
module.exports = ({ L, Z, G, K, proveri, r, S3, telo, A, kocke }) => {

  // ════════════════ 4.1 Pojam, vrste i elementi prizme ════════════════
  L('Pojam, vrste i elementi prizme');

  Z(1, 'Prizma je telo koje ima dve podudarne paralelne osnove i…',
    ['bočne strane paralelograme', 'bočne strane trouglove', 'jednu osnovu', 'bočne strane krugove'],
    [K('Prizma ima dve podudarne i paralelne osnove (mnogouglovi).'),
     K('Bočne strane su paralelogrami; kod prave prizme to su pravougaonici.'),
     K('Prizma se naziva po osnovi: trostrana, četvorostrana, šestostrana…')]);

  Z(1, 'Koliko ivica ima trostrana prizma?',
    ['9', '6', '12', '8'],
    [K('Trostrana prizma ima $2$ osnove po $3$ ivice ($6$) i $3$ bočne ivice.'),
     K('Ukupno $6 + 3 = 9$ ivica.'),
     K('Uopšte, $n$-tostrana prizma ima $3n$ ivica.', [], telo('prizma3', { opis: 'Izbroj ivice: 9' }))]);

  Z(2, 'Koliko temena i strana ima šestostrana prizma?',
    ['12 temena i 8 strana', '6 temena i 8 strana', '12 temena i 6 strana', '18 temena i 8 strana'],
    [K('Šestostrana prizma ima $2 · 6 = 12$ temena.'),
     K('Strane: $2$ osnove + $6$ bočnih = $8$ strana.'),
     K('Uopšte, $n$-tostrana prizma ima $2n$ temena i $n + 2$ strane.', [], telo('prizma6', { opis: 'Izbroj temena i strane' }))]);

  Z(2, 'Koja prizma se zove prava?',
    ['Ona čije su bočne ivice normalne na osnovu', 'Ona koja ima pravougaonu osnovu', 'Ona koja je visoka', 'Ona čija je osnova kvadrat'],
    [K('Kod prave prizme bočne ivice su normalne na ravan osnove.'),
     K('Tada su bočne strane pravougaonici, a bočne ivice jednake visini.'),
     K('Ako osnova nije normalna na bočne ivice, prizma je kosa.')]);

  Z(3, 'Koliko ivica ima prizma koja ima $8$ strana?',
    ['18', '24', '12', '9'],
    [K('Ako prizma ima $8$ strana, to je $8 − 2 = 6$ bočnih, pa je osnova šestougao ($n = 6$).'),
     K('Broj ivica: $3n = 3 · 6 = 18$.'),
     K('Provera: $2$ osnove po $6$ + $6$ bočnih = $12 + 6 = 18$ ✓')]);

  Z(3, 'Za svaki konveksni poliedar važi Ojlerova formula $T − I + S = 2$ (temena − ivice + strane). Koliko temena ima prizma sa $12$ ivica i $6$ strana?',
    ['8', '6', '10', '12'],
    [K('$T − 12 + 6 = 2$, pa je $T = 8$ temena.'),
     K('To je četvorostrana prizma: $8$ temena, $12$ ivica, $6$ strana.'),
     K('Ojlerovu formulu možeš proveriti na modelu od kartona – izbroj temena, ivice i strane!', [], telo('prizma4', { opis: 'Temena − ivice + strane = 2' }))]);

  // ════════════════ 4.2 Dijagonale prizme i dijagonalni presek ════════════════
  L('Dijagonale prizme i dijagonalni presek');

  Z(1, 'Kolika je dijagonala kocke ivice $a$?',
    ['$a√{3}$', '$a√{2}$', '$2a$', '$3a$'],
    [K('Dijagonala kocke (telesna) je hipotenuza trougla čije su katete ivica $a$ i dijagonala strane $a√{2}$.'),
     K('$D² = a² + (a√{2})² = a² + 2a² = 3a²$, pa je $D = a√{3}$.'),
     K('Dijagonala strane (lica) je $a√{2}$.')]);

  Z(2, 'Kolika je dijagonala kvadra dimenzija $3 cm$, $4 cm$ i $12 cm$?',
    ['$13 cm$', '$5 cm$', '$12 cm$', '$19 cm$'],
    [K('$D² = a² + b² + c² = 3² + 4² + 12²$.'),
     K('$D² = 9 + 16 + 144 = 169$, pa je $D = 13 cm$.'),
     K('Brže: $√{3² + 4²} = 5$, pa je $D = √{5² + 12²} = 13 cm$.', [], telo('kvadar', { opis: 'Dijagonala spaja suprotna temena' }))]);

  Z(2, 'Kocka ima ivicu $2 cm$. Kolika je dijagonala njene strane?',
    ['$2√{2} cm$', '$4 cm$', '$2√{3} cm$', '$8 cm$'],
    [K('Dijagonala strane kvadrata stranice $a$: $d = a√{2}$.'),
     K('$d = 2√{2} cm ≈ 2,83 cm$.'),
     K('Telesna dijagonala bila bi $2√{3} cm$.')]);

  Z(3, 'Dijagonala kocke je $6√{3} cm$. Kolika je ivica kocke?',
    ['$6 cm$', '$3 cm$', '$6√{3} cm$', '$2√{3} cm$'],
    [K('$D = a√{3}$, pa je $a√{3} = 6√{3}$.'),
     K('$a = 6 cm$.'),
     K('Provera: dijagonala strane $6√{2}$, a telesna $√{6² + (6√{2})²} = √{36 + 72} = √{108} = 6√{3}$ ✓')]);

  Z(3, 'Kvadar ima ivice $a = 5 cm$, $b = 6 cm$ i dijagonalu $D = 10 cm$. Kolika je treća ivica $c$?',
    ['$√{39} cm$', '$7 cm$', '$8 cm$', '$√{61} cm$'],
    [K('$D² = a² + b² + c²$, pa je $100 = 25 + 36 + c²$.'),
     K('$c² = 100 − 61 = 39$, pa je $c = √{39} cm ≈ 6,24 cm$.')]);

  // ════════════════ 4.3 Mreža prizme ════════════════
  L('Mreža prizme');

  Z(1, 'Mreža kocke sastoji se od…',
    ['6 podudarnih kvadrata', '4 kvadrata i 2 pravougaonika', '6 pravougaonika', '5 kvadrata'],
    [K('Kocka ima $6$ podudarnih kvadratnih strana.'),
     K('Njena mreža je raspored $6$ kvadrata koji se mogu saviti u kocku.'),
     K('Ima ukupno $11$ različitih mreža kocke.', [], telo('kocka', { opis: 'Zamisli kako se mreža savija' })),
     K('Animacija savijanja mreže kocke:', [], A('mreza-kocke', 'Mreža („krst“) se savija u kocku'))]);

  Z(2, 'Mreža prave trostrane prizme sastoji se od…',
    ['2 trougla i 3 pravougaonika', '3 trougla', '2 trougla i 2 pravougaonika', '6 trouglova'],
    [K('Osnove su $2$ podudarna trougla.'),
     K('Omotač čine $3$ pravougaonika (po jedan za svaku bočnu stranu).'),
     K('Ukupno $2$ trougla + $3$ pravougaonika.')]);

  Z(2, 'Koliko strana ima mreža šestostrane prizme?',
    ['8', '6', '12', '7'],
    [K('Mreža sadrži sve strane tela: $2$ osnove + $6$ bočnih = $8$ mnogouglova.'),
     K('U mreži je to $2$ šestougla i $6$ pravougaonika.')]);

  Z(3, 'Da li se svaki raspored $6$ kvadrata savije u kocku?',
    ['Ne', 'Da', 'Da, ako su kvadrati jednaki', 'Samo ako je raspored u obliku krsta'],
    [K('Ne – samo $11$ od mnogo rasporeda $6$ kvadrata daju mrežu kocke.'),
     K('Neki rasporedi se preklapaju ili ostavljaju rupe pri savijanju.'),
     K('Proveri crtanjem i isecanjem!')]);

  // ════════════════ 4.4 Površina prave prizme i četvorostrane prizme ════════════════
  L('Površina prave prizme i prave četvorostrane prizme');

  Z(1, 'Kolika je površina kocke ivice $3 cm$?',
    ['$54 cm²$', '$27 cm²$', '$36 cm²$', '$9 cm²$'],
    [K('Kocka ima $6$ strana, svaka površine $a² = 9 cm²$.'),
     K('$P = 6a² = 6 · 9 = 54 cm²$.'),
     K('Zapremina bi bila $27 cm³$.')]);

  Z(1, 'Površina prave prizme računa se kao…',
    ['$P = 2B + M$', '$P = B + M$', '$P = 2B · M$', '$P = B · H$'],
    [K('$B$ je površina osnove, $M$ je površina omotača.'),
     K('Prizma ima dve osnove, pa je $P = 2B + M$.'),
     K('Omotač je $M = O · H$ (obim osnove puta visina).')]);

  Z(2, 'Kvadar ima dimenzije $2 cm$, $3 cm$ i $5 cm$. Kolika mu je površina?',
    ['$62 cm²$', '$31 cm²$', '$30 cm²$', '$124 cm²$'],
    [K('$P = 2(ab + bc + ac) = 2(2·3 + 3·5 + 2·5)$.'),
     K('$P = 2(6 + 15 + 10) = 2 · 31 = 62 cm²$.')]);

  Z(2, 'Površina kocke je $96 cm²$. Kolika je njena ivica?',
    ['$4 cm$', '$6 cm$', '$8 cm$', '$16 cm$'],
    [K('$6a² = 96$, pa je $a² = 16$ i $a = 4 cm$.'),
     K('Provera: $6 · 16 = 96$ ✓')]);

  Z(3, 'Pravougaona prostorija je duga $6 m$, široka $4 m$ i visoka $3 m$. Koliko je ukupna površina zidova (bez poda i plafona)?',
    ['$60 m²$', '$48 m²$', '$72 m²$', '$36 m²$'],
    [K('Zidovi su omotač: $M = O · H = 2(6 + 4) · 3$.'),
     K('$M = 2 · 10 · 3 = 60 m²$.'),
     K('To je površina za krečenje zidova.')]);

  // ════════════════ 4.5 Površina trostrane i šestostrane prizme ════════════════
  L('Površina prave trostrane prizme i pravilne šestostrane prizme');

  Z(1, 'Prava trostrana prizma ima osnovu pravougli trougao sa katetama $3 cm$ i $4 cm$, i visinu $10 cm$. Kolika je površina osnove?',
    ['$6 cm²$', '$12 cm²$', '$10 cm²$', '$7 cm²$'],
    [K('$B = {3 · 4|2} = 6 cm²$.'),
     K('Hipotenuza osnove je $5 cm$ (trojka $3, 4, 5$).'),
     K('Omotač bi bio $(3 + 4 + 5) · 10 = 120 cm²$.')]);

  Z(2, 'Prava trostrana prizma ima osnovu trougao stranica $3, 4, 5 cm$ i visinu $10 cm$. Kolika joj je površina?',
    ['$132 cm²$', '$120 cm²$', '$144 cm²$', '$126 cm²$'],
    [K('Osnova je pravougli trougao: $B = {3·4|2} = 6 cm²$.'),
     K('Omotač: $M = (3 + 4 + 5) · 10 = 120 cm²$.'),
     K('$P = 2B + M = 12 + 120 = 132 cm²$.')]);

  Z(2, 'Pravilna šestostrana prizma ima ivicu osnove $a = 4 cm$ i visinu $10 cm$. Koliki je omotač?',
    ['$240 cm²$', '$120 cm²$', '$80 cm²$', '$160 cm²$'],
    [K('Obim osnove: $O = 6a = 24 cm$.'),
     K('$M = O · H = 24 · 10 = 240 cm²$.'),
     K('Omotač čini $6$ pravougaonika $4 × 10$.', [], telo('prizma6', { opis: 'Šestougaona osnova, omotač = 6 pravougaonika' }))]);

  Z(3, 'Prava prizma ima osnovu romb stranice $5 cm$ i visine osnove $4 cm$; visina prizme je $8 cm$. Kolika je površina prizme?',
    ['$200 cm²$', '$160 cm²$', '$180 cm²$', '$240 cm²$'],
    [K('$B = a · h_{osnove} = 5 · 4 = 20 cm²$.'),
     K('Omotač: $M = O · H = 4 · 5 · 8 = 160 cm²$.'),
     K('$P = 2 · 20 + 160 = 200 cm²$.')]);

  // ════════════════ 4.6 Zapremina prizme i četvorostrane prizme ════════════════
  L('Zapremina prizme i prave četvorostrane prizme');

  Z(1, 'Zapremina prizme računa se po formuli…',
    ['$V = B · H$', '$V = B + H$', '$V = 2B · H$', '$V = {B · H|2}$'],
    [K('Zapremina prizme = površina osnove puta visina: $V = B · H$.'),
     K('Za kocku: $V = a³$. Za kvadar: $V = a · b · c$.')]);

  Z(1, 'Kolika je zapremina kocke ivice $9 cm$?',
    ['$729 cm³$', '$81 cm³$', '$243 cm³$', '$27 cm³$'],
    [K('$V = a³ = 9³ = 729 cm³$.'),
     K('Površina bi bila $6 · 81 = 486 cm²$.'),
     K('Zapreminu kocke možemo zamisliti i kao kockice od $1 cm³$: $9$ redova × $9$ kolona × $9$ slojeva.', [], telo('kocka', { opis: 'Zapremina kocke: a · a · a' }))]);

  Z(1, 'Koliko kockica ivice $1 cm$ staje u kvadar dimenzija $2 cm × 3 cm × 4 cm$?',
    ['$24$', '$9$', '$48$', '$12$'],
    [K('Broj kockica ivice $1 cm$ jednak je zapremini kvadra u $cm³$.'),
     K('$V = 2 · 3 · 4 = 24 cm³$, pa staje $24$ kockice.'),
     K('Slaganje kockica:', [], kocke(2, 3, 4))]);

  Z(2, 'Kvadar ima dimenzije $5 cm$, $4 cm$ i $10 cm$. Kolika mu je zapremina?',
    ['$200 cm³$', '$100 cm³$', '$20 cm³$', '$50 cm³$'],
    [K('$V = a · b · c = 5 · 4 · 10 = 200 cm³$.'),
     K('Zapremina se izražava u kubnim jedinicama.')]);

  Z(2, 'Akvarijum je oblika kvadra dimenzija $40 cm$, $25 cm$ i $30 cm$. Koliko litara vode staje u njega?',
    ['$30$ litara', '$300$ litara', '$3$ litara', '$3000$ litara'],
    [K('$V = 40 · 25 · 30 = 30.000 cm³$.'),
     K('$1 liter = 1000 cm³$, pa je $V = 30$ litara.')]);

  Z(3, 'Kocka ima zapreminu $125 cm³$. Kolika je njena ivica?',
    ['$5 cm$', '$25 cm$', '$12,5 cm$', '$5√{5} cm$'],
    [K('$a³ = 125$, pa je $a = ∛125 = 5 cm$ (jer je $5³ = 125$).'),
     K('Površina te kocke je $6 · 25 = 150 cm²$.')]);

  // ════════════════ 4.7 Zapremina trostrane i šestostrane prizme ════════════════
  L('Zapremina prave trostrane prizme i pravilne šestostrane prizme');

  Z(1, 'Prava trostrana prizma ima osnovu površine $12 cm²$ i visinu $10 cm$. Kolika joj je zapremina?',
    ['$120 cm³$', '$40 cm³$', '$60 cm³$', '$1,2 cm³$'],
    [K('$V = B · H = 12 · 10 = 120 cm³$.', [], telo('prizma3', { opis: 'Zapremina prizme = osnova × visina' }))]);

  Z(2, 'Osnova prave prizme je pravougli trougao sa katetama $6 cm$ i $8 cm$, a visina prizme je $15 cm$. Kolika je zapremina?',
    ['$360 cm³$', '$240 cm³$', '$720 cm³$', '$180 cm³$'],
    [K('$B = {6 · 8|2} = 24 cm²$.'),
     K('$V = 24 · 15 = 360 cm³$.')]);

  Z(2, 'Pravilna šestostrana prizma ima ivicu osnove $4 cm$, visinu $10 cm$, a površina njene osnove je $24√{3} cm²$. Kolika je zapremina?',
    ['$240√{3} cm³$', '$240 cm³$', '$96√{3} cm³$', '$120√{3} cm³$'],
    [K('$V = B · H = 24√{3} · 10 = 240√{3} cm³ ≈ 415,7 cm³$.'),
     K('Zapremina se dobija množenjem osnove i visine.', [], telo('prizma6', { opis: 'Šestougaona osnova puta visina' }))]);

  Z(3, 'Kolika je površina osnove pravilne šestostrane prizme ivice $a$, ako se šestougao sastoji od $6$ jednakostraničnih trouglova?',
    ['$B = {3a²√{3}|2}$', '$B = 6a²$', '$B = 3a²$', '$B = {a²√{3}|4}$'],
    [K('Šestougao se deli na $6$ jednakostraničnih trouglova stranice $a$.'),
     K('Površina jednog je ${a²√{3}|4}$, pa je $B = 6 · {a²√{3}|4} = {3a²√{3}|2}$.'),
     K('Za $a = 4$: $B = {3 · 16 · √{3}|2} = 24√{3}$ ✓')]);

  // ════════════════ 4.8 Neke primene površine i zapremine prizme ════════════════
  L('Neke primene površine i zapremine prizme');

  Z(2, 'Koliko $m³$ zemlje treba iskopati za temelj oblika kvadra dužine $20 m$, širine $10 m$ i dubine $2 m$?',
    ['$400 m³$', '$200 m³$', '$40 m³$', '$600 m³$'],
    [K('$V = 20 · 10 · 2 = 400 m³$.'),
     K('To je zapremina iskopane zemlje.')]);

  Z(2, 'Kutija bez poklopca oblika je kocke ivice $10 cm$. Koliko kartona treba za nju (zanemari preklope)?',
    ['$500 cm²$', '$600 cm²$', '$100 cm²$', '$400 cm²$'],
    [K('Puna kocka ima $6$ strana po $100 cm²$ = $600 cm²$.'),
     K('Bez poklopca: $5$ strana = $500 cm²$.')]);

  Z(3, 'Metalna kocka ivice $6 cm$ pretopljena je u kvadar čija je osnova $4 cm × 3 cm$. Kolika je visina kvadra?',
    ['$18 cm$', '$9 cm$', '$12 cm$', '$6 cm$'],
    [K('Zapremina kocke: $V = 6³ = 216 cm³$ – ona se ne menja pretapanjem.'),
     K('Kvadar: $V = 4 · 3 · H = 12H = 216$.'),
     K('$H = {216|12} = 18 cm$.')]);

  Z(3, 'Bazen oblika kvadra prima $60 m³$ vode. Ako je dubok $1,5 m$ i širok $5 m$, koliko je dug?',
    ['$8 m$', '$6 m$', '$10 m$', '$12 m$'],
    [K('$V = a · b · H$, pa je $60 = a · 5 · 1,5 = 7,5a$.'),
     K('$a = {60|7,5} = 8 m$.'),
     K('Provera: $8 · 5 · 1,5 = 60$ ✓')]);

  // ════════════ dopuna do 10 po lekciji ════════════

  L('Pojam, vrste i elementi prizme');
  Z(1, 'Bočne strane prave prizme su:',
    ['pravougaonici', 'trouglovi', 'krugovi', 'petouglovi'],
    [K('Kod prave prizme bočne strane su pravougaonici (u opštem slučaju paralelogrami).')]);
  Z(2, 'Koliko ivica ima četvorostrana prizma?',
    ['12', '8', '6', '16'],
    [K('$n$-tostrana prizma ima $3n$ ivica: $3 · 4 = 12$.')]);
  Z(2, 'Koliko temena ima petostrana prizma?',
    ['10', '5', '12', '8'],
    [K('$2n$ temena: $2 · 5 = 10$.')]);
  Z(2, 'Osnove prizme su:',
    ['podudarni mnogouglovi', 'različiti mnogouglovi', 'krugovi', 'uvek kvadrati'],
    [K('Prizma ima dve podudarne osnove u paralelnim ravnima.')]);
  Z(2, 'Pravilna prizma ima osnovu:',
    ['pravilan mnogougao', 'bilo koji mnogougao', 'krug', 'trapez'],
    [K('Pravilna prizma ima pravilan mnogougao u osnovi.')]);
  Z(3, 'Koliko strana ima trostrana prizma?',
    ['5', '6', '4', '8'],
    [K('$2$ osnove + $3$ bočne = $5$ strana.')]);

  L('Dijagonale prizme i dijagonalni presek');
  Z(2, 'Kocka ima ivicu $4 cm$. Kolika je dijagonala njene strane?',
    ['$4√{2} cm$', '$8 cm$', '$4√{3} cm$', '$2√{2} cm$'],
    [K('Dijagonala strane kvadrata: $d = a√{2} = 4√{2} cm$.')]);
  Z(2, 'Kocka ima ivicu $5 cm$. Kolika joj je telesna dijagonala?',
    ['$5√{3} cm$', '$5√{2} cm$', '$10 cm$', '$15 cm$'],
    [K('$D = a√{3} = 5√{3} cm$.')]);
  Z(2, 'Kvadar ima dimenzije $2 cm$, $3 cm$ i $6 cm$. Kolika mu je dijagonala?',
    ['$7 cm$', '$11 cm$', '$5 cm$', '$6 cm$'],
    [K('$D² = 4 + 9 + 36 = 49$, pa je $D = 7 cm$.')]);
  Z(3, 'Kvadar ima ivice $3 cm$ i $4 cm$, a dijagonalu $13 cm$. Kolika je treća ivica?',
    ['$12 cm$', '$10 cm$', '$6 cm$', '$9 cm$'],
    [K('$13² = 9 + 16 + c²$, pa je $c² = 144$ i $c = 12 cm$.')]);
  Z(3, 'Kvadar ima ivice $2 cm$, $6 cm$ i $9 cm$. Kolika mu je dijagonala?',
    ['$11 cm$', '$7 cm$', '$13 cm$', '$15 cm$'],
    [K('$D² = 4 + 36 + 81 = 121$, pa je $D = 11 cm$.')]);

  L('Mreža prizme');
  Z(2, 'Mreža kvadra sastoji se od:',
    ['6 pravougaonika', '6 kvadrata', '4 pravougaonika', '3 kvadrata i 3 trougla'],
    [K('Kvadar ima $6$ pravougaonih strana.')]);
  Z(2, 'Koliko pravougaonika ima omotač petostrane prave prizme?',
    ['5', '10', '4', '7'],
    [K('Omotač čine bočne strane – one su pravougaonici, po jedan za svaku od $5$ bočnih strana.')]);
  Z(3, 'Mreža petostrane prizme sastoji se od:',
    ['2 petougla i 5 pravougaonika', '5 petouglova', '1 petougla i 5 pravougaonika', '2 petougla i 3 pravougaonika'],
    [K('Dve petouglaste osnove + pet bočnih pravougaonika = $7$ mnogouglova.')]);
  Z(3, 'Broj mnogouglova u mreži $n$-tostrane prizme je:',
    ['$n + 2$', '$2n$', '$n$', '$n + 3$'],
    [K('$2$ osnove + $n$ bočnih = $n + 2$ mnogougla.')]);
  Z(2, 'Omotač prizme čine:',
    ['bočne strane', 'osnove', 'samo jedna osnova', 'dijagonalni preseci'],
    [K('Omotač je zbir površina bočnih strana (bez osnova).')]);
  Z(3, 'Mreža prizme sadrži:',
    ['sve strane prizme', 'samo osnove', 'samo bočne strane', 'polovinu strana'],
    [K('Mreža je raspored svih strana tela u jednoj ravni.')]);

  L('Površina prave prizme i prave četvorostrane prizme');
  Z(2, 'Kocka ima ivicu $5 cm$. Kolika joj je površina?',
    ['$150 cm²$', '$125 cm²$', '$100 cm²$', '$25 cm²$'],
    [K('$P = 6a² = 6 · 25 = 150 cm²$.')]);
  Z(2, 'Kvadar ima dimenzije $3 cm$, $4 cm$ i $5 cm$. Kolika mu je površina?',
    ['$94 cm²$', '$60 cm²$', '$47 cm²$', '$188 cm²$'],
    [K('$P = 2(3·4 + 4·5 + 3·5) = 2(12 + 20 + 15) = 2 · 47 = 94 cm²$.')]);
  Z(2, 'Kocka ima ivicu $6 cm$. Kolika joj je površina?',
    ['$216 cm²$', '$36 cm²$', '$144 cm²$', '$108 cm²$'],
    [K('$P = 6 · 36 = 216 cm²$.')]);
  Z(3, 'Prizma ima površinu osnove $20 cm²$ i omotač $80 cm²$. Kolika joj je površina?',
    ['$120 cm²$', '$100 cm²$', '$80 cm²$', '$40 cm²$'],
    [K('$P = 2B + M = 2 · 20 + 80 = 120 cm²$.')]);
  Z(3, 'Površina kocke je $54 cm²$. Kolika joj je ivica?',
    ['$3 cm$', '$6 cm$', '$9 cm$', '$4 cm$'],
    [K('$6a² = 54$, pa je $a² = 9$ i $a = 3 cm$.')]);

  L('Površina prave trostrane prizme i pravilne šestostrane prizme');
  Z(2, 'Prava trostrana prizma ima osnovu pravougli trougao sa katetama $6 cm$ i $8 cm$, i visinu $10 cm$. Koliki joj je omotač?',
    ['$240 cm²$', '$120 cm²$', '$200 cm²$', '$140 cm²$'],
    [K('Hipotenuza osnove: $10 cm$; obim $O = 6 + 8 + 10 = 24 cm$.'),
     K('$M = O · H = 24 · 10 = 240 cm²$.')]);
  Z(3, 'Prava trostrana prizma ima osnovu površine $24 cm²$ i omotač $240 cm²$. Kolika joj je površina?',
    ['$288 cm²$', '$264 cm²$', '$240 cm²$', '$480 cm²$'],
    [K('$P = 2B + M = 2 · 24 + 240 = 288 cm²$.')]);
  Z(2, 'Pravilna šestostrana prizma ima ivicu osnove $5 cm$ i visinu $8 cm$. Koliki joj je omotač?',
    ['$240 cm²$', '$120 cm²$', '$200 cm²$', '$40 cm²$'],
    [K('$O = 6 · 5 = 30 cm$; $M = 30 · 8 = 240 cm²$.')]);
  Z(3, 'Pravilna šestostrana prizma ima ivicu osnove $5 cm$, površinu osnove ${75√{3}|2} cm²$ i visinu $8 cm$. Kolika joj je površina?',
    ['$240 + 75√{3} cm²$', '$240 + 150√{3} cm²$', '$120 + 75√{3} cm²$', '$240 + 75 cm²$'],
    [K('$M = 30 · 8 = 240 cm²$; $2B = 2 · {75√{3}|2} = 75√{3} cm²$.'),
     K('$P = 240 + 75√{3} cm²$.')]);
  Z(3, 'Prava trostrana prizma ima osnovu jednakostranični trougao stranice $4 cm$ (površine $4√{3} cm²$) i visinu $6 cm$. Koliki joj je omotač?',
    ['$72 cm²$', '$36 cm²$', '$24 cm²$', '$144 cm²$'],
    [K('$O = 3 · 4 = 12 cm$; $M = 12 · 6 = 72 cm²$.')]);
  Z(3, 'Pravilna šestostrana prizma ima osnovu površine $24√{3} cm²$ i omotač $120 cm²$. Kolika joj je površina?',
    ['$120 + 48√{3} cm²$', '$120 + 24√{3} cm²$', '$144√{3} cm²$', '$120√{3} cm²$'],
    [K('$P = 2B + M = 2 · 24√{3} + 120 = 120 + 48√{3} cm²$.')]);

  L('Zapremina prizme i prave četvorostrane prizme');
  Z(2, 'Kocka ima ivicu $7 cm$. Kolika joj je zapremina?',
    ['$343 cm³$', '$49 cm³$', '$294 cm³$', '$147 cm³$'],
    [K('$V = 7³ = 343 cm³$.')]);
  Z(2, 'Kvadar ima dimenzije $6 cm$, $8 cm$ i $10 cm$. Kolika mu je zapremina?',
    ['$480 cm³$', '$240 cm³$', '$4800 cm³$', '$48 cm³$'],
    [K('$V = 6 · 8 · 10 = 480 cm³$.')]);
  Z(2, 'Prizma ima površinu osnove $15 cm²$ i visinu $8 cm$. Kolika joj je zapremina?',
    ['$120 cm³$', '$23 cm³$', '$105 cm³$', '$45 cm³$'],
    [K('$V = B · H = 15 · 8 = 120 cm³$.')]);
  Z(3, 'Kocka ima zapreminu $64 cm³$. Kolika joj je ivica?',
    ['$4 cm$', '$8 cm$', '$16 cm$', '$2 cm$'],
    [K('$a³ = 64$, pa je $a = 4 cm$.')]);
  Z(3, 'Kvadar ima zapreminu $120 cm³$ i ivice $4 cm$ i $5 cm$. Kolika je treća ivica?',
    ['$6 cm$', '$3 cm$', '$12 cm$', '$8 cm$'],
    [K('$120 = 4 · 5 · c = 20c$, pa je $c = 6 cm$.')]);

  L('Zapremina prave trostrane prizme i pravilne šestostrane prizme');
  Z(2, 'Prizma ima osnovu površine $20 cm²$ i visinu $12 cm$. Kolika joj je zapremina?',
    ['$240 cm³$', '$120 cm³$', '$32 cm³$', '$480 cm³$'],
    [K('$V = B · H = 20 · 12 = 240 cm³$.')]);
  Z(2, 'Osnova prave prizme je pravougli trougao sa katetama $5 cm$ i $12 cm$, a visina prizme je $10 cm$. Kolika je zapremina?',
    ['$300 cm³$', '$600 cm³$', '$150 cm³$', '$360 cm³$'],
    [K('$B = {5 · 12|2} = 30 cm²$; $V = 30 · 10 = 300 cm³$.')]);
  Z(3, 'Pravilna šestostrana prizma ima osnovu površine $24√{3} cm²$ i visinu $5 cm$. Kolika joj je zapremina?',
    ['$120√{3} cm³$', '$24√{3} cm³$', '$120 cm³$', '$600√{3} cm³$'],
    [K('$V = 24√{3} · 5 = 120√{3} cm³ ≈ 207,8 cm³$.')]);
  Z(3, 'Prizma ima osnovu površine $10 cm²$ i visinu $9 cm$. Kolika joj je zapremina?',
    ['$90 cm³$', '$19 cm³$', '$100 cm³$', '$45 cm³$'],
    [K('$V = 10 · 9 = 90 cm³$.')]);
  Z(3, 'Pravilna šestostrana prizma ima ivicu osnove $4 cm$ (površina osnove $24√{3} cm²$) i visinu $8 cm$. Kolika joj je zapremina?',
    ['$192√{3} cm³$', '$96√{3} cm³$', '$192 cm³$', '$32√{3} cm³$'],
    [K('$V = 24√{3} · 8 = 192√{3} cm³ ≈ 332,6 cm³$.')]);
  Z(3, 'Prizma ima zapreminu $240 cm³$ i površinu osnove $30 cm²$. Kolika joj je visina?',
    ['$8 cm$', '$10 cm$', '$6 cm$', '$12 cm$'],
    [K('$V = B · H$, pa je $240 = 30H$ i $H = 8 cm$.')]);

  L('Neke primene površine i zapremine prizme');
  Z(2, 'Bazen oblika kvadra dimenzija $8 m$, $4 m$ i $2 m$. Kolika mu je zapremina?',
    ['$64 m³$', '$32 m³$', '$16 m³$', '$128 m³$'],
    [K('$V = 8 · 4 · 2 = 64 m³$.')]);
  Z(3, 'Kocka ima ivicu $2 dm$. Koliko litara vode staje u nju?',
    ['8 litara', '4 litra', '2 litra', '6 litara'],
    [K('$V = 2³ = 8 dm³ = 8$ litara (jer je $1 dm³ = 1$ litar).')]);
  Z(2, 'Zemljište oblika kvadra dužine $10 m$, širine $5 m$ i dubine $3 m$. Koliko $m³$ zemlje treba iskopati?',
    ['$150 m³$', '$50 m³$', '$30 m³$', '$300 m³$'],
    [K('$V = 10 · 5 · 3 = 150 m³$.')]);
  Z(3, 'Metalna kocka ivice $4 cm$ pretopljena je u kvadar sa osnovom $2 cm × 4 cm$. Kolika je visina kvadra?',
    ['$8 cm$', '$4 cm$', '$16 cm$', '$2 cm$'],
    [K('$V = 4³ = 64 cm³$; $64 = 2 · 4 · H = 8H$, pa je $H = 8 cm$.')]);
  Z(3, 'Kutija bez poklopca oblika je kocke ivice $12 cm$. Koliko kartona treba (bez preklopa)?',
    ['$720 cm²$', '$864 cm²$', '$144 cm²$', '$600 cm²$'],
    [K('Puna kocka: $6 · 144 = 864 cm²$; bez poklopca $5 · 144 = 720 cm²$.')]);
  Z(3, 'Prostorija je duga $5 m$, široka $4 m$ i visoka $3 m$. Kolika je površina zidova (bez poda i plafona)?',
    ['$54 m²$', '$48 m²$', '$60 m²$', '$27 m²$'],
    [K('$M = O · H = 2(5 + 4) · 3 = 54 m²$.')]);
};
