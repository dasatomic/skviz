// Valjak, kupa, lopta — 8. razred: elementi, preseci, mreže, površine i zapremine.
module.exports = ({ L, Z, G, K, proveri, r, telo, A }) => {

  const PI = Math.PI;

  // ════════════════ 8.1 Valjak: osnovni elementi ════════════════
  L('Valjak: osnovni elementi');

  Z(1, 'Valjak ima osnove oblika…',
    ['kruga', 'trougla', 'kvadrata', 'šestougla'],
    [K('Valjak ima dve podudarne kružne osnove u paralelnim ravnima.'),
     K('Bočna površina mu je zakrivljena.'),
     K('Osa valjka spaja centre osnova.', [], telo('valjak', { opis: 'Okreni valjak' }))]);

  Z(2, 'Osni presek valjka je…',
    ['pravougaonik', 'krug', 'trougao', 'elipsa'],
    [K('Osni presek valjka (ravan kroz osu) je pravougaonik.'),
     K('Njegove dimenzije su prečnik osnove ($2r$) i visina valjka ($H$).')]);

  Z(2, 'Valjak ima poluprečnik osnove $3 cm$ i visinu $8 cm$. Koliki je prečnik osnove?',
    ['$6 cm$', '$3 cm$', '$8 cm$', '$9 cm$'],
    [K('Prečnik je dva poluprečnika: $d = 2r = 6 cm$.')]);

  Z(3, 'Osni presek valjka je kvadrat stranice $10 cm$. Koliki je poluprečnik osnove valjka?',
    ['$5 cm$', '$10 cm$', '$20 cm$', '$2,5 cm$'],
    [K('Ako je osni presek kvadrat, onda je prečnik osnove jednak visini: $2r = H = 10 cm$.'),
     K('$r = 5 cm$.')]);

  // ════════════════ 8.2 Ravni preseci valjka ════════════════
  L('Ravni preseci valjka');

  Z(1, 'Presek valjka ravninom paralelnom osnovama je…',
    ['krug', 'pravougaonik', 'elipsa', 'trougao'],
    [K('Ravan paralelna osnovama seče valjak po krugu.'),
     K('Ako je to ravan koja sadrži osu (osni presek), presek je pravougaonik.')]);

  Z(2, 'Presek valjka ravninom koja sadrži osu valjka je…',
    ['pravougaonik', 'krug', 'elipsa', 'kružni isečak'],
    [K('Osni presek valjka je pravougaonik dimenzija $2r × H$.'),
     K('Ako ravan seče valjak koso, presek je elipsa.')]);

  Z(3, 'Valjak poluprečnika $4 cm$ presečen je ravninom paralelnom osnovama na polovini visine. Koliki je poluprečnik dobijenog kruga?',
    ['$4 cm$', '$2 cm$', '$8 cm$', '$6 cm$'],
    [K('Ravan paralelna osnovama seče valjak po krugu istog poluprečnika kao osnova.'),
     K('$r = 4 cm$, bez obzira na visini na kojoj seče.')]);

  // ════════════════ 8.3 Mreža i površina valjka ════════════════
  L('Mreža valjka, površina valjka');

  Z(1, 'Mreža valjka sastoji se od…',
    ['pravougaonika i dva kruga', 'dva kruga i trougla', 'kvadrata i kruga', 'tri kruga'],
    [K('Omotač valjka razvijen je pravougaonik (širina = obim osnove $2rπ$, visina = $H$).'),
     K('Dve osnove su krugovi.'),
     K('Mreža: $2$ kruga + $1$ pravougaonik.', [], telo('valjak', { opis: 'Zamisli kako se mreža savija' }))]);

  Z(1, 'Površina omotača valjka računa se kao…',
    ['$M = 2rπH$', '$M = r²πH$', '$M = rπH$', '$M = 2rπ + H$'],
    [K('Omotač je pravougaonik širine $2rπ$ (obim osnove) i visine $H$.'),
     K('$M = 2rπH$.')]);

  Z(2, 'Valjak ima poluprečnik osnove $r = 5 cm$ i visinu $H = 10 cm$. Koliki mu je omotač? (Uzmi $π ≈ 3,14$.)',
    ['$314 cm²$', '$157 cm²$', '$628 cm²$', '$100 cm²$'],
    [K('$M = 2rπH = 2 · 5 · 3,14 · 10$.'),
     K('$M = 314 cm²$.')]);

  Z(2, 'Valjak ima $r = 3 cm$ i $H = 7 cm$. Kolika mu je površina? (Uzmi $π ≈ 3,14$.)',
    ['$188,4 cm²$', '$131,9 cm²$', '$160,1 cm²$', '$94,2 cm²$'],
    [K('Osnova: $B = r²π = 9π ≈ 28,26 cm²$.'),
     K('Omotač: $M = 2rπH = 2 · 3 · 3,14 · 7 = 131,88 cm²$.'),
     K('$P = 2B + M = 2 · 28,26 + 131,88 = 188,4 cm²$.'),
     K('Mreža valjka – omotač je pravougaonik:', [], A('mreza-valjka', 'Omotač valjka razvija se u pravougaonik širine 2rπ i visine H'))]);

  Z(3, 'Površina omotača valjka je $120π cm²$, a visina $10 cm$. Koliki je poluprečnik osnove?',
    ['$6 cm$', '$12 cm$', '$5 cm$', '$3 cm$'],
    [K('$M = 2rπH$, pa je $120π = 2rπ · 10 = 20rπ$.'),
     K('$r = {120|20} = 6 cm$.')]);

  // ════════════════ 8.4 Zapremina valjka ════════════════
  L('Zapremina valjka');

  Z(1, 'Zapremina valjka računa se kao…',
    ['$V = r²πH$', '$V = {r²πH|3}$', '$V = 2rπH$', '$V = rπH$'],
    [K('Zapremina valjka = površina osnove puta visina: $V = r²πH$.')]);

  Z(2, 'Valjak ima $r = 4 cm$ i $H = 10 cm$. Kolika mu je zapremina? (Uzmi $π ≈ 3,14$.)',
    ['$502,4 cm³$', '$125,6 cm³$', '$251,2 cm³$', '$160 cm³$'],
    [K('$V = r²πH = 4² · 3,14 · 10$.'),
     K('$V = 16 · 3,14 · 10 = 502,4 cm³$.')]);

  Z(3, 'Valjak ima zapreminu $300π cm³$ i poluprečnik osnove $5 cm$. Kolika mu je visina?',
    ['$12 cm$', '$10 cm$', '$6 cm$', '$15 cm$'],
    [K('$V = r²πH$, pa je $300π = 25π · H$.'),
     K('$H = {300|25} = 12 cm$.')]);

  // ════════════════ 8.5 Kupa: osnovni elementi ════════════════
  L('Kupa: osnovni elementi');

  Z(1, 'Kupa ima osnovu oblika…',
    ['kruga', 'trougla', 'kvadrata', 'šestougla'],
    [K('Kupa ima jednu kružnu osnovu i vrh.'),
     K('Bočna površina joj je zakrivljena.'),
     K('Izvodnica $s$ spaja vrh sa tačkom na obodu osnove.', [], telo('kupa', { opis: 'Okreni kupu' }))]);

  Z(2, 'Osni presek kupe je…',
    ['jednakokraki trougao', 'krug', 'pravougaonik', 'elipsa'],
    [K('Osni presek kupe je jednakokraki trougao.'),
     K('Njegova osnovica je prečnik ($2r$), a kraci su izvodnice ($s$).')]);

  Z(2, 'Kupa ima poluprečnik osnove $r = 6 cm$ i izvodnicu $s = 10 cm$. Kolika joj je visina?',
    ['$8 cm$', '$4 cm$', '$10 cm$', '$16 cm$'],
    [K('Visina, poluprečnik i izvodnica čine pravougli trougao: $H² = s² − r²$.'),
     K('$H² = 100 − 36 = 64$, pa je $H = 8 cm$.'),
     K('To je trojka $6, 8, 10$.')]);

  Z(3, 'Kupa ima visinu $12 cm$ i izvodnicu $13 cm$. Koliki je poluprečnik osnove?',
    ['$5 cm$', '$12 cm$', '$13 cm$', '$25 cm$'],
    [K('$r² = s² − H² = 169 − 144 = 25$.'),
     K('$r = 5 cm$.'),
     K('To je trojka $5, 12, 13$.')]);

  // ════════════════ 8.6 Ravni preseci kupe ════════════════
  L('Ravni preseci kupe');

  Z(1, 'Presek kupe ravninom paralelnom osnovi je…',
    ['krug', 'trougao', 'pravougaonik', 'kružni isečak'],
    [K('Ravan paralelna osnovi seče kupu po krugu manjem od osnove.'),
     K('Osni presek (kroz osu) je jednakokraki trougao.')]);

  Z(2, 'Osni presek kupe je trougao. Njegova visina jednaka je:',
    ['visini kupe', 'izvodnici', 'poluprečniku osnove', 'prečniku osnove'],
    [K('Visina osnog preseka (trougla) je upravo visina kupe $H$.')]);

  // ════════════════ 8.7 Mreža i površina kupe ════════════════
  L('Mreža kupe, površina kupe');

  Z(1, 'Mreža kupe sastoji se od…',
    ['kruga i kružnog isečka', 'dva kruga', 'kruga i trougla', 'kruga i pravougaonika'],
    [K('Osnova kupe je krug.'),
     K('Omotač kupe razvijen je kružni isečak poluprečnika $s$.'),
     K('Mreža: $1$ krug + $1$ kružni isečak.', [], telo('kupa', { opis: 'Zamisli kako se mreža savija' }))]);

  Z(1, 'Površina omotača kupe računa se kao…',
    ['$M = rπs$', '$M = r²π$', '$M = 2rπs$', '$M = rπH$'],
    [K('Omotač kupe je kružni isečak poluprečnika $s$ i luka $2rπ$.'),
     K('Njegova površina je $M = rπs$.')]);

  Z(2, 'Kupa ima $r = 5 cm$ i izvodnicu $s = 13 cm$. Koliki joj je omotač? (Uzmi $π ≈ 3,14$.)',
    ['$204,1 cm²$', '$130π cm²$', '$204,1π cm²$', '$102,05 cm²$'],
    [K('$M = rπs = 5 · 3,14 · 13$.'),
     K('$M = 65π cm² ≈ 204,1 cm²$ (za $π ≈ 3,14$).')]);

  Z(3, 'Kupa ima $r = 3 cm$ i $H = 4 cm$. Kolika joj je ukupna površina? (Uzmi $π ≈ 3,14$.)',
    ['$75,36 cm²$', '$37,68 cm²$', '$56,52 cm²$', '$94,2 cm²$'],
    [K('Izvodnica: $s = √{3² + 4²} = 5 cm$.'),
     K('$B = r²π = 9π ≈ 28,26 cm²$; $M = rπs = 15π ≈ 47,1 cm²$.'),
     K('$P = B + M = 28,26 + 47,1 = 75,36 cm²$.')]);

  // ════════════════ 8.8 Zapremina kupe ════════════════
  L('Zapremina kupe');

  Z(1, 'Zapremina kupe računa se kao…',
    ['$V = {r²πH|3}$', '$V = r²πH$', '$V = {rπH|3}$', '$V = 3r²πH$'],
    [K('Kupa je trećina valjka iste osnove i visine.'),
     K('$V = {r²πH|3}$.'),
     K('Animacija – tri kupe napune valjak:', [], A('kupa-valjak', 'Tri kupe iste osnove i visine napune valjak – zato je V kupe trećina'))]);

  Z(2, 'Kupa ima $r = 6 cm$ i $H = 10 cm$. Kolika joj je zapremina? (Uzmi $π ≈ 3,14$.)',
    ['$376,8 cm³$', '$1130,4 cm³$', '$125,6 cm³$', '$376,8π cm³$'],
    [K('$V = {r²πH|3} = {36 · 3,14 · 10|3}$.'),
     K('$V = {1130,4|3} = 376,8 cm³$.')]);

  Z(3, 'Kupa ima zapreminu $96π cm³$ i visinu $8 cm$. Koliki je poluprečnik osnove?',
    ['$6 cm$', '$12 cm$', '$3 cm$', '$4 cm$'],
    [K('$V = {r²πH|3}$, pa je $96π = {r²π · 8|3}$.'),
     K('$r² = {96 · 3|8} = 36$, pa je $r = 6 cm$.')]);

  // ════════════════ 8.9 Lopta: osnovni elementi ════════════════
  L('Lopta: osnovni elementi');

  Z(1, 'Sve tačke lopte (sfere) su od centra udaljene…',
    ['najviše za poluprečnik', 'tačno za poluprečnik', 'najviše za prečnik', 'bar za poluprečnik'],
    [K('Sfera je skup tačaka na tačno $r$ od centra; lopta je sfera sa unutrašnjošću.'),
     K('Tačke lopte su od centra udaljene najviše za poluprečnik $r$.'),
     K('Prečnik je $2r$.', [], telo('lopta', { opis: 'Okreni loptu' }))]);

  Z(2, 'Lopta ima poluprečnik $7 cm$. Koliki joj je prečnik?',
    ['$14 cm$', '$7 cm$', '$3,5 cm$', '$21 cm$'],
    [K('Prečnik je dva poluprečnika: $d = 2 · 7 = 14 cm$.')]);

  Z(3, 'Koliko prečnika prolazi kroz centar lopte?',
    ['Beskonačno mnogo', 'Tačno jedan', 'Tačno dva', 'Tri'],
    [K('Svaka prava kroz centar seče sferu u dve tačke – to je prečnik.'),
     K('Kroz centar prolazi beskonačno mnogo pravih, pa i prečnika.')]);

  // ════════════════ 8.10 Ravni preseci lopte ════════════════
  L('Ravni preseci lopte');

  Z(1, 'Presek lopte ravninom je…',
    ['krug', 'elipsa', 'pravougaonik', 'duž'],
    [K('Svaka ravan koja seče loptu daje presek u obliku kruga.'),
     K('Ako ravan prolazi kroz centar, dobijamo veliki krug (poluprečnika $r$).')]);

  Z(2, 'Presek lopte ravninom kroz centar je…',
    ['veliki krug poluprečnika r', 'mali krug', 'elipsa', 'polovina lopte'],
    [K('Ravan kroz centar seče loptu po krugu istog poluprečnika kao lopta.'),
     K('Taj krug se zove veliki krug.')]);

  Z(3, 'Lopta poluprečnika $13 cm$ presečena je ravninom koja je udaljena $5 cm$ od centra. Koliki je poluprečnik dobijenog kruga?',
    ['$12 cm$', '$8 cm$', '$13 cm$', '$5 cm$'],
    [K('Poluprečnik lopte, udaljenost ravni od centra i poluprečnik preseka čine pravougli trougao.'),
     K('$ρ² = 13² − 5² = 169 − 25 = 144$, pa je $ρ = 12 cm$.'),
     K('To je trojka $5, 12, 13$.')]);

  // ════════════════ 8.11 Površina i zapremina lopte ════════════════
  L('Površina i zapremina lopte');

  Z(1, 'Površina lopte računa se kao…',
    ['$P = 4r²π$', '$P = r²π$', '$P = 2r²π$', '$P = 4rπ$'],
    [K('Površina lopte je $P = 4r²π$ – četiri velika kruga.')]);

  Z(1, 'Zapremina lopte računa se kao…',
    ['$V = {4r³π|3}$', '$V = r³π$', '$V = {r³π|3}$', '$V = 4r³π$'],
    [K('Zapremina lopte je $V = {4r³π|3}$.')]);

  Z(2, 'Lopta ima poluprečnik $3 cm$. Kolika joj je površina? (Uzmi $π ≈ 3,14$.)',
    ['$113,04 cm²$', '$37,68 cm²$', '$28,26 cm²$', '$452,16 cm²$'],
    [K('$P = 4r²π = 4 · 9 · 3,14 = 113,04 cm²$.')]);

  Z(2, 'Lopta ima poluprečnik $6 cm$. Kolika joj je zapremina? (Uzmi $π ≈ 3,14$.)',
    ['$904,32 cm³$', '$226,08 cm³$', '$301,44 cm³$', '$1808,64 cm³$'],
    [K('$V = {4r³π|3} = {4 · 216 · 3,14|3}$.'),
     K('$V = {2712,96|3} = 904,32 cm³$.')]);

  Z(3, 'Površina lopte je $100π cm²$. Koliki joj je poluprečnik?',
    ['$5 cm$', '$10 cm$', '$25 cm$', '$√{50} cm$'],
    [K('$4r²π = 100π$, pa je $4r² = 100$ i $r² = 25$.'),
     K('$r = 5 cm$.')]);

  // ════════════════ 8.12 Upisana i opisana tela ════════════════
  L('Upisana i opisana tela');

  Z(2, 'U kocku ivice $a = 6 cm$ upisana je lopta. Koliki joj je poluprečnik?',
    ['$3 cm$', '$6 cm$', '$12 cm$', '$3√{2} cm$'],
    [K('Lopta upisana u kocku dodiruje svaku stranu, pa joj je prečnik jednak ivici kocke.'),
     K('$2r = 6 cm$, pa je $r = 3 cm$.')]);

  Z(2, 'Oko kocke ivice $a = 6 cm$ opisana je lopta. Koliki joj je poluprečnik?',
    ['$3√{3} cm$', '$6 cm$', '$3√{2} cm$', '$6√{3} cm$'],
    [K('Prečnik opisane lopte jednak je telesnoj dijagonali kocke: $2r = a√{3}$.'),
     K('$2r = 6√{3}$, pa je $r = 3√{3} cm$.')]);

  Z(3, 'U valjak poluprečnika osnove $r$ i visine $2r$ upisana je lopta. Koliki je odnos zapremina lopte i valjka?',
    ['$2 : 3$', '$1 : 2$', '$1 : 3$', '$3 : 4$'],
    [K('Lopta ima poluprečnik $r$ (jer je visina valjka $2r$).'),
     K('$V_{lopte} = {4r³π|3}$, $V_{valjka} = r²π · 2r = 2r³π$.'),
     K('Odnos: ${4r³π|3} : 2r³π = {4|3} · {1|2} = {2|3} = 2 : 3$.')]);

  Z(3, 'Lopta poluprečnika $5 cm$ upisana je u valjak. Kolika je zapremina valjka? (Uzmi $π ≈ 3,14$.)',
    ['$785 cm³$', '$523,3 cm³$', '$1570 cm³$', '$392,5 cm³$'],
    [K('Lopta dodiruje valjak, pa je $r_{valjka} = 5 cm$ i $H = 2 · 5 = 10 cm$.'),
     K('$V = r²πH = 25 · 3,14 · 10 = 785 cm³$.')]);

  // ════════════ dopuna do 10 po lekciji ════════════

  L('Valjak: osnovni elementi');
  Z(1, 'Koliko osnova ima valjak?',
    ['Dve', 'Jednu', 'Tri', 'Nijednu'],
    [K('Valjak ima dve podudarne kružne osnove u paralelnim ravnima.')]);
  Z(1, 'Bočna površina valjka je:',
    ['zakrivljena', 'ravna', 'trougaona', 'kvadratna'],
    [K('Omotač valjka je zakrivljena površina koja se razvija u pravougaonik.')]);
  Z(2, 'Osni presek valjka je pravougaonik dimenzija:',
    ['$2r$ i $H$', '$r$ i $H$', '$2r$ i $2H$', '$r$ i $2r$'],
    [K('Osni presek seče valjak kroz osu: širina je prečnik $2r$, a visina $H$.')]);
  Z(2, 'Valjak ima poluprečnik osnove $4 cm$ i visinu $6 cm$. Koliki je prečnik osnove?',
    ['$8 cm$', '$4 cm$', '$12 cm$', '$2 cm$'],
    [K('$d = 2r = 8 cm$.')]);
  Z(2, 'Osa valjka spaja:',
    ['centre osnova', 'ivice osnova', 'bilo koje dve tačke', 'temena'],
    [K('Osa valjka je prava kroz centre obe osnove.')]);
  Z(3, 'Valjak nastaje rotacijom:',
    ['pravougaonika oko jedne stranice', 'trougla oko katete', 'kruga oko prečnika', 'kvadrata oko dijagonale'],
    [K('Rotacijom pravougaonika oko jedne stranice nastaje valjak.')]);

  L('Ravni preseci valjka');
  Z(1, 'Ravan normalna na osu valjka seče ga po:',
    ['krugu', 'pravougaoniku', 'elipsi', 'trouglu'],
    [K('Ravan normalna na osu (paralelna osnovama) seče valjak po krugu.')]);
  Z(2, 'Presek valjka ravninom kroz osu je:',
    ['pravougaonik', 'krug', 'elipsa', 'kružni isečak'],
    [K('Osni presek valjka je pravougaonik.')]);
  Z(2, 'Kosi presek valjka (ravan nagnuta prema osi) je:',
    ['elipsa', 'krug', 'pravougaonik', 'trougao'],
    [K('Ravan koja seče valjak koso daje elipsu.')]);
  Z(3, 'Valjak poluprečnika $3 cm$ presečen je ravninom paralelnom osnovama na polovini visine. Koliki je poluprečnik dobijenog kruga?',
    ['$3 cm$', '$1,5 cm$', '$6 cm$', '$4 cm$'],
    [K('Presek paralelan osnovama ima isti poluprečnik kao osnova: $3 cm$.')]);
  Z(3, 'Osni presek valjka je kvadrat stranice $12 cm$. Koliki je poluprečnik osnove?',
    ['$6 cm$', '$12 cm$', '$24 cm$', '$3 cm$'],
    [K('Ako je osni presek kvadrat, prečnik je jednak visini: $2r = 12$.'),
     K('$r = 6 cm$.')]);
  Z(3, 'Ravan dodiruje omotač valjka duž jedne izvodnice. Presek ravni i valjka je:',
    ['duž (izvodnica)', 'krug', 'elipsa', 'pravougaonik'],
    [K('Ravan dodiruje valjak samo duž izvodnice, pa je presek jedna duž – ta izvodnica.'),
     K('Ravan kroz osu seče valjak po pravougaoniku, a ravan paralelna osnovama po krugu.')]);
  Z(3, 'Osni presek valjka je kvadrat površine $64 cm²$. Koliki je poluprečnik osnove?',
    ['$4 cm$', '$8 cm$', '$2 cm$', '$16 cm$'],
    [K('Stranica kvadrata je $√{64} = 8 cm$, pa je $2r = H = 8 cm$.'),
     K('$r = 4 cm$.')]);

  L('Mreža valjka, površina valjka');
  Z(1, 'Omotač valjka razvijen u ravan je:',
    ['pravougaonik', 'krug', 'trougao', 'elipsa'],
    [K('Omotač valjka se razvija u pravougaonik.')]);
  Z(2, 'Širina omotača valjka (jedna stranica pravougaonika) jednaka je:',
    ['$2rπ$', '$rπ$', '$r²π$', '$H$'],
    [K('Širina omotača je obim osnove: $2rπ$.')]);
  Z(2, 'Valjak ima $r = 7 cm$ i $H = 10 cm$. Koliki mu je omotač?',
    ['$140π cm²$', '$70π cm²$', '$700π cm²$', '$490π cm²$'],
    [K('$M = 2rπH = 2 · 7 · π · 10 = 140π cm²$.')]);
  Z(2, 'Površina valjka računa se kao:',
    ['$P = 2rπH + 2r²π$', '$P = rπH + r²π$', '$P = 2rπH$', '$P = r²πH$'],
    [K('$P = M + 2B = 2rπH + 2r²π$ (omotač + dve osnove).')]);
  Z(3, 'Valjak ima $r = 2 cm$ i $H = 5 cm$. Koliki mu je omotač?',
    ['$20π cm²$', '$10π cm²$', '$40π cm²$', '$4π cm²$'],
    [K('$M = 2 · 2 · π · 5 = 20π cm² ≈ 62,8 cm²$.')]);

  L('Zapremina valjka');
  Z(2, 'Valjak ima $r = 2 cm$ i $H = 5 cm$. Kolika mu je zapremina?',
    ['$20π cm³$', '$10π cm³$', '$40π cm³$', '$100π cm³$'],
    [K('$V = r²πH = 4π · 5 = 20π cm³ ≈ 62,8 cm³$.')]);
  Z(2, 'Valjak ima $r = 10 cm$ i $H = 3 cm$. Kolika mu je zapremina?',
    ['$300π cm³$', '$100π cm³$', '$30π cm³$', '$900π cm³$'],
    [K('$V = 100π · 3 = 300π cm³ ≈ 942,5 cm³$.')]);
  Z(3, 'Valjak ima zapreminu $200π cm³$ i poluprečnik osnove $5 cm$. Kolika mu je visina?',
    ['$8 cm$', '$10 cm$', '$4 cm$', '$6 cm$'],
    [K('$V = r²πH$, pa je $200π = 25πH$.'),
     K('$H = {200|25} = 8 cm$.')]);
  Z(3, 'Valjak ima zapreminu $120π cm³$ i visinu $10 cm$. Koliki je poluprečnik osnove?',
    ['$2√{3} cm$', '$√{6} cm$', '$4 cm$', '$6 cm$'],
    [K('$120π = r²π · 10$, pa je $r² = 12$.'),
     K('$r = √{12} = 2√{3} cm$.')]);
  Z(3, 'Valjak ima $r = 7 cm$ i $H = 7 cm$. Kolika mu je zapremina?',
    ['$343π cm³$', '$49π cm³$', '$147π cm³$', '$98π cm³$'],
    [K('$V = 49π · 7 = 343π cm³$.')]);
  Z(3, 'Valjak ima prečnik osnove $6 cm$ i visinu $9 cm$. Kolika mu je zapremina?',
    ['$81π cm³$', '$54π cm³$', '$27π cm³$', '$162π cm³$'],
    [K('$r = 3 cm$; $V = 9π · 9 = 81π cm³ ≈ 254,5 cm³$.')]);
  Z(3, 'Ako se poluprečnik valjka udvostruči, a visina ostane ista, zapremina se:',
    ['poveća 4 puta', 'poveća 2 puta', 'poveća 8 puta', 'ne promeni'],
    [K('$V = r²πH$; ako je $r → 2r$, onda $r² → 4r²$, pa je zapremina $4$ puta veća.')]);

  L('Kupa: osnovni elementi');
  Z(1, 'Koliko osnova ima kupa?',
    ['Jednu', 'Dve', 'Tri', 'Nijednu'],
    [K('Kupa ima jednu kružnu osnovu.')]);
  Z(2, 'Izvodnica kupe spaja:',
    ['vrh sa tačkom na obodu osnove', 'vrh sa centrom osnove', 'dve tačke oboda', 'centre osnova'],
    [K('Izvodnica $s$ spaja vrh kupe sa tačkom na kružnici osnove.')]);
  Z(2, 'Kupa ima poluprečnik $8 cm$ i izvodnicu $17 cm$. Kolika joj je visina?',
    ['$15 cm$', '$9 cm$', '$25 cm$', '$7 cm$'],
    [K('$H² = s² − r² = 289 − 64 = 225$, pa je $H = 15 cm$.')]);
  Z(2, 'Visina kupe spaja vrh sa:',
    ['centrom osnove', 'bilo kojom tačkom osnove', 'sredinom izvodnice', 'obimom osnove'],
    [K('Visina kupe ide iz vrha na centar osnove (kod prave kupe).')]);
  Z(3, 'Kupa ima poluprečnik $5 cm$ i visinu $12 cm$. Kolika joj je izvodnica?',
    ['$13 cm$', '$17 cm$', '$7 cm$', '$13√{2} cm$'],
    [K('$s² = r² + H² = 25 + 144 = 169$, pa je $s = 13 cm$.')]);
  Z(3, 'Kupa nastaje rotacijom:',
    ['pravouglog trougla oko katete', 'pravougaonika oko stranice', 'kruga oko prečnika', 'kvadrata oko dijagonale'],
    [K('Rotacijom pravouglog trougla oko jedne katete nastaje kupa.')]);

  L('Ravni preseci kupe');
  Z(1, 'Ravan paralelna osnovi kupe seče je po krugu čiji je poluprečnik:',
    ['manji od poluprečnika osnove', 'jednak poluprečniku osnove', 'veći od poluprečnika osnove', 'uvek nula'],
    [K('Presek paralelan osnovi je krug manji od osnove (sve manji kako se približava vrhu).')]);
  Z(2, 'Kraci (stranice) osnog preseka kupe su:',
    ['izvodnice', 'prečnici', 'visine', 'poluprečnici'],
    [K('Osni presek je jednakokraki trougao čiji su kraci izvodnice $s$.')]);
  Z(2, 'U osnom preseku kupe osnovica trougla je:',
    ['$2r$', '$r$', '$s$', '$H$'],
    [K('Osnovica osnog preseka je prečnik osnove: $2r$.')]);
  Z(3, 'Kupa ima $r = 4 cm$ i $H = 6 cm$. Kolika joj je izvodnica?',
    ['$2√{13} cm$', '$√{30} cm$', '$10 cm$', '$2√{5} cm$'],
    [K('$s² = 16 + 36 = 52$, pa je $s = √{52} = 2√{13} cm ≈ 7,2 cm$.')]);
  Z(2, 'Presek kupe ravninom kroz vrh i dve tačke oboda osnove je:',
    ['trougao', 'krug', 'elipsa', 'pravougaonik'],
    [K('Ravan kroz vrh i dve tačke oboda seče kupu po trouglu.')]);
  Z(3, 'Kupa ima $r = 6 cm$ i izvodnicu $s = 10 cm$. Osnovica njenog osnog preseka je:',
    ['$12 cm$', '$6 cm$', '$10 cm$', '$20 cm$'],
    [K('Osnovica osnog preseka je prečnik: $2r = 12 cm$.')]);
  Z(3, 'Ravan paralelna osnovi seče kupu na polovini visine. Dobijeni presek je:',
    ['krug manji od osnove', 'krug isti kao osnova', 'trougao', 'elipsa'],
    [K('Presek paralelan osnovi je krug, ali manji od osnove (bliže vrhu).')]);
  Z(3, 'Kupa ima poluprečnik osnove $6 cm$ i visinu $8 cm$. Ravan paralelna osnovi, na polovini visine, seče kupu po krugu poluprečnika:',
    ['$3 cm$', '$4 cm$', '$6 cm$', '$2 cm$'],
    [K('Na polovini visine presek je sličan osnovi sa koeficijentom ${1|2}$, jer se visine i poluprečnici menjaju srazmerno.'),
     K('Poluprečnik je ${6|2} = 3 cm$.')]);

  L('Mreža kupe, površina kupe');
  Z(1, 'Omotač kupe razvijen u ravan je:',
    ['kružni isečak', 'krug', 'trougao', 'pravougaonik'],
    [K('Omotač kupe se razvija u kružni isečak poluprečnika $s$.')]);
  Z(2, 'Poluprečnik kružnog isečka (omotača kupe) jednak je:',
    ['izvodnici $s$', 'poluprečniku osnove $r$', 'visini $H$', 'prečniku osnove'],
    [K('Isečak omotača ima poluprečnik jednak izvodnici $s$.')]);
  Z(2, 'Kupa ima $r = 6 cm$ i izvodnicu $s = 10 cm$. Koliki joj je omotač?',
    ['$60π cm²$', '$30π cm²$', '$120π cm²$', '$36π cm²$'],
    [K('$M = rπs = 6 · π · 10 = 60π cm² ≈ 188,5 cm²$.')]);
  Z(2, 'Površina kupe računa se kao:',
    ['$P = rπs + r²π$', '$P = 2rπs + r²π$', '$P = rπs$', '$P = {rπs|2}$'],
    [K('$P = M + B = rπs + r²π$ (omotač + osnova).')]);
  Z(3, 'Kupa ima $r = 7 cm$ i visinu $H = 24 cm$. Kolika joj je površina?',
    ['$224π cm²$', '$175π cm²$', '$168π cm²$', '$224 cm²$'],
    [K('Izvodnica: $s = √{49 + 576} = √{625} = 25 cm$.'),
     K('$P = rπs + r²π = 7 · π · 25 + 49π = 175π + 49π = 224π cm²$.')]);
  Z(3, 'Kupa ima $r = 4 cm$ i izvodnicu $s = 5 cm$. Koliki joj je omotač?',
    ['$20π cm²$', '$10π cm²$', '$25π cm²$', '$16π cm²$'],
    [K('$M = rπs = 4 · π · 5 = 20π cm² ≈ 62,8 cm²$.')]);

  L('Zapremina kupe');
  Z(2, 'Kupa ima $r = 3 cm$ i $H = 10 cm$. Kolika joj je zapremina?',
    ['$30π cm³$', '$90π cm³$', '$10π cm³$', '$45π cm³$'],
    [K('$V = {r²πH|3} = {9π · 10|3} = 30π cm³ ≈ 94,2 cm³$.')]);
  Z(2, 'Kupa ima $r = 5 cm$ i $H = 12 cm$. Kolika joj je zapremina?',
    ['$100π cm³$', '$300π cm³$', '$200π cm³$', '$60π cm³$'],
    [K('$V = {25π · 12|3} = 100π cm³ ≈ 314 cm³$.')]);
  Z(3, 'Kupa ima zapreminu $150π cm³$ i visinu $9 cm$. Koliki je poluprečnik osnove?',
    ['$5√{2} cm$', '$5 cm$', '$√{40} cm$', '$10 cm$'],
    [K('$150π = {r²π · 9|3} = 3r²π$, pa je $r² = 50$.'),
     K('$r = √{50} = 5√{2} cm$.')]);
  Z(3, 'Kupa ima zapreminu $90π cm³$ i poluprečnik $6 cm$. Kolika joj je visina?',
    ['$7,5 cm$', '$5 cm$', '$15 cm$', '$10 cm$'],
    [K('$90π = {36π · H|3} = 12πH$, pa je $H = {90|12} = 7,5 cm$.')]);
  Z(3, 'Kupa ima prečnik osnove $10 cm$ i visinu $9 cm$. Kolika joj je zapremina?',
    ['$75π cm³$', '$225π cm³$', '$25π cm³$', '$150π cm³$'],
    [K('$r = 5 cm$; $V = {25π · 9|3} = 75π cm³ ≈ 235,6 cm³$.')]);
  Z(2, 'Kupa i valjak imaju istu osnovu i istu visinu. Zapremina kupe je:',
    ['trećina zapremine valjka', 'polovina zapremine valjka', 'jednaka zapremini valjka', 'dvostruka zapremina valjka'],
    [K('$V_{kupe} = {1|3} V_{valjka}$ – ista osnova i visina.')]);
  Z(3, 'Kupa ima $r = 9 cm$ i $H = 4 cm$. Kolika joj je zapremina?',
    ['$108π cm³$', '$36π cm³$', '$324π cm³$', '$144π cm³$'],
    [K('$V = {81π · 4|3} = 108π cm³ ≈ 339,3 cm³$.')]);

  L('Lopta: osnovni elementi');
  Z(1, 'Poluprečnik lopte je duž od centra do:',
    ['bilo koje tačke sfere', 'samo jedne tačke', 'centra', 'prečnika'],
    [K('Poluprečnik spaja centar sa bilo kojom tačkom sfere.')]);
  Z(1, 'Prečnik lopte je:',
    ['dva poluprečnika', 'polovina poluprečnika', 'jednak poluprečniku', 'tri poluprečnika'],
    [K('$d = 2r$.')]);
  Z(2, 'Lopta ima poluprečnik $11 cm$. Koliki joj je prečnik?',
    ['$22 cm$', '$11 cm$', '$5,5 cm$', '$33 cm$'],
    [K('$d = 2 · 11 = 22 cm$.')]);
  Z(2, 'Veliki krug lopte ima poluprečnik:',
    ['jednak poluprečniku lopte', 'polovinu poluprečnika', 'dvostruki poluprečnik', 'različit za svaku ravan'],
    [K('Veliki krug je presek kroz centar, pa ima poluprečnik $r$ kao i lopta.')]);
  Z(2, 'Sfera je skup svih tačaka prostora koje su od centra:',
    ['na rastojanju tačno $r$', 'na rastojanju manjem od $r$', 'na rastojanju većem od $r$', 'u istoj ravni'],
    [K('Sfera je površ lopte: tačke na tačno $r$ od centra.')]);
  Z(3, 'Lopta nastaje rotacijom:',
    ['polukruga oko prečnika', 'kruga oko tetive', 'pravougaonika oko stranice', 'trougla oko katete'],
    [K('Rotacijom polukruga oko njegovog prečnika nastaje lopta.')]);
  Z(3, 'Koliko osnova ima lopta?',
    ['Nijednu', 'Jednu', 'Dve', 'Beskonačno mnogo'],
    [K('Lopta nema osnove – cela površ joj je zakrivljena.')]);

  L('Ravni preseci lopte');
  Z(1, 'Ravan koja seče loptu, a ne prolazi kroz centar, daje presek:',
    ['krug manji od velikog kruga', 'veliki krug', 'duž', 'elipsu'],
    [K('Svaka ravan seče loptu po krugu; ako ne prolazi kroz centar, to je manji krug.')]);
  Z(2, 'Presek lopte ravninom kroz centar je:',
    ['veliki krug', 'mali krug', 'elipsa', 'polovina lopte'],
    [K('Ravan kroz centar daje veliki krug poluprečnika $r$.')]);
  Z(3, 'Lopta poluprečnika $10 cm$ presečena je ravninom udaljenom $6 cm$ od centra. Poluprečnik preseka je:',
    ['$8 cm$', '$4 cm$', '$6 cm$', '$10 cm$'],
    [K('$ρ² = 10² − 6² = 100 − 36 = 64$, pa je $ρ = 8 cm$.')]);
  Z(3, 'Lopta poluprečnika $15 cm$ presečena je ravninom udaljenom $9 cm$ od centra. Poluprečnik preseka je:',
    ['$12 cm$', '$6 cm$', '$9 cm$', '$15 cm$'],
    [K('$ρ² = 15² − 9² = 225 − 81 = 144$, pa je $ρ = 12 cm$.')]);
  Z(3, 'Lopta poluprečnika $25 cm$ presečena je ravninom udaljenom $7 cm$ od centra. Poluprečnik preseka je:',
    ['$24 cm$', '$18 cm$', '$25 cm$', '$7 cm$'],
    [K('$ρ² = 25² − 7² = 625 − 49 = 576$, pa je $ρ = 24 cm$.')]);
  Z(3, 'Ravan koja dodiruje loptu u tačno jednoj tački zove se:',
    ['tangentna ravan', 'sečica', 'veliki krug', 'normalna ravan'],
    [K('Tangentna ravan dodiruje loptu u jednoj tački.')]);
  Z(2, 'Poluprečnik $ρ$ preseka lopte poluprečnika $r$ ravninom udaljenom $d$ od centra dat je sa:',
    ['$ρ² = r² − d²$', '$ρ² = r² + d²$', '$ρ = r − d$', '$ρ² = d² − r²$'],
    [K('Pitagorina teorema: $r² = ρ² + d²$, pa je $ρ² = r² − d²$.')]);

  L('Površina i zapremina lopte');
  Z(2, 'Lopta ima poluprečnik $5 cm$. Kolika joj je površina?',
    ['$100π cm²$', '$25π cm²$', '$50π cm²$', '$200π cm²$'],
    [K('$P = 4r²π = 4 · 25π = 100π cm² ≈ 314 cm²$.')]);
  Z(2, 'Lopta ima poluprečnik $2 cm$. Kolika joj je zapremina?',
    ['${32π|3} cm³$', '${8π|3} cm³$', '${16π|3} cm³$', '$8π cm³$'],
    [K('$V = {4r³π|3} = {4 · 8π|3} = {32π|3} cm³ ≈ 33,5 cm³$.')]);
  Z(3, 'Površina lopte je $144π cm²$. Koliki joj je poluprečnik?',
    ['$6 cm$', '$12 cm$', '$8 cm$', '$36 cm$'],
    [K('$4r²π = 144π$, pa je $4r² = 144$ i $r² = 36$.'),
     K('$r = 6 cm$.')]);
  Z(3, 'Zapremina lopte je $36π cm³$. Koliki joj je poluprečnik?',
    ['$3 cm$', '$2 cm$', '$6 cm$', '$9 cm$'],
    [K('${4r³π|3} = 36π$, pa je $4r³ = 108$ i $r³ = 27$.'),
     K('$r = 3 cm$.')]);
  Z(3, 'Lopta ima poluprečnik $9 cm$. Kolika joj je površina?',
    ['$324π cm²$', '$81π cm²$', '$162π cm²$', '$648π cm²$'],
    [K('$P = 4 · 81π = 324π cm² ≈ 1017,9 cm²$.')]);

  L('Upisana i opisana tela');
  Z(2, 'U kocku ivice $8 cm$ upisana je lopta. Koliki joj je poluprečnik?',
    ['$4 cm$', '$8 cm$', '$16 cm$', '$4√{2} cm$'],
    [K('Prečnik upisane lopte jednak je ivici kocke: $2r = 8$.'),
     K('$r = 4 cm$.')]);
  Z(3, 'Oko kocke ivice $3 cm$ opisana je lopta. Koliki joj je poluprečnik?',
    ['${3√{3}|2} cm$', '$3 cm$', '$3√{3} cm$', '${3√{2}|2} cm$'],
    [K('Prečnik opisane lopte je telesna dijagonala kocke: $2r = a√{3} = 3√{3}$.'),
     K('$r = {3√{3}|2} cm$.')]);
  Z(3, 'Valjak je opisan oko lopte poluprečnika $r$. Visina valjka je:',
    ['$2r$', '$r$', '$3r$', '${r|2}$'],
    [K('Lopta dodiruje obe osnove valjka, pa je $H = 2r$.')]);
  Z(3, 'U kocku ivice $10 cm$ upisana je lopta. Kolika je zapremina lopte?',
    ['${500π|3} cm³$', '$500π cm³$', '${1000π|3} cm³$', '${250π|3} cm³$'],
    [K('$r = 5 cm$; $V = {4 · 125π|3} = {500π|3} cm³ ≈ 523,6 cm³$.')]);
  Z(3, 'Kocka ivice $a$ i u nju upisana lopta. Odnos zapremina kocke i lopte je:',
    ['$6 : π$', '$π : 6$', '$4 : 3$', '$3 : 4$'],
    [K('$V_{kocke} = a³$; lopta ima $r = {a|2}$, pa je $V_{lopte} = {4|3}π({a|2})³ = {πa³|6}$.'),
     K('Odnos: $a³ : {πa³|6} = 6 : π$.')]);
  Z(3, 'Lopta poluprečnika $4 cm$ upisana je u kocku. Kolika je zapremina kocke?',
    ['$512 cm³$', '$64 cm³$', '$216 cm³$', '$343 cm³$'],
    [K('Ivica kocke je $a = 2r = 8 cm$.'),
     K('$V = 8³ = 512 cm³$.')]);
};
