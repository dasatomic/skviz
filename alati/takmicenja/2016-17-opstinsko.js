// Opštinsko takmičenje iz matematike učenika osnovnih škola, 25. 2. 2017. (DMS)
// https://dms.rs/wp-content/uploads/2017/02/Opstinsko-2017.pdf (samo postavke – rešenja su naša, provereni računom)
module.exports = {
  godina: '2016/17', nivo: 'opstinsko', datum: '25. 2. 2017.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Zbir jedne trećine, jedne četvrtine i jedne šestine nekog broja je za $48$ manji od zbira jedne dvanaestine, pet dvanaestina i sedam dvanaestina istog broja. Koji je to broj?',
      ['$144$', '$48$', '$96$', '$192$'],
      [
        'Svedimo na dvanaestine: ${1|3} + {1|4} + {1|6} = {4 + 3 + 2|12} = {9|12}$, a ${1|12} + {5|12} + {7|12} = {13|12}$.',
        'Razlika je ${13 − 9|12} = {4|12} = {1|3}$ broja, i to je $48$.',
        K('Broj je $3 · 48 = 144$.', [], G({}, [...C.traka(12, 9, { w: 12, h: 1, b: 1, y: 1.6 }), { tx: '9/12', at: [4.5, 3.2] }, ...C.traka(12, 12, { w: 12, h: 1, b: 2 }), C.pr(12, 0, 1, 1, 2, { gusto: 1 }), { tx: '13/12', at: [6.5, -0.6] }])),
      ]);
    Z(5, 2, 2,
      'Ana pojede jednu i po čokoladu za $1$ sat, a Ana i Bora zajedno pojedu trećinu čokolade za $10$ minuta. Za koje vreme Bora sam pojede jednu čokoladu (svi jedu ravnomerno)?',
      ['$2$ sata', '$1$ sat', '$40$ minuta', '$90$ minuta'],
      [
        'Ana: $1,5$ čokolada za $60$ minuta, tj. jedna čokolada za $40$ minuta – za $10$ minuta pojede ${1|4}$ čokolade.',
        'Zajedno za $10$ minuta ${1|3}$, pa Bora za $10$ minuta pojede ${1|3} − {1|4} = {1|12}$ čokolade.',
        K('Celu čokoladu Bora pojede za $12 · 10 = 120$ minuta $= 2$ sata.', [], C.tabela([['~za 10 min', '~Ana', '~Bora', '~zajedno'], ['~čokolade', '1/4', '1/12', '1/3']])),
      ]);
    // V.3: crtež prati sliku sa takmičenja; koordinate su izračunate iz zadatih uglova (22°, 34°, 35°)
    Z(5, 3, 2,
      'Dva pravougaonika $ABCD$ i $EFBG$ spojena su kao na slici. Na slici su označeni uglovi $∡CAB = 22°$, $∡GEC = 35°$ i $∡AFE = 34°$. Izračunaj uglove $α$, $β$ i $γ$.',
      ['$α = 33°$, $β = 125°$, $γ = 56°$', '$α = 33°$, $β = 55°$, $γ = 56°$', '$α = 35°$, $β = 125°$, $γ = 56°$', '$α = 33°$, $β = 125°$, $γ = 12°$'],
      [
        K('Stranice $AB$ i $EF$ su paralelne (naspramne stranice pravougaonika $EFBG$), a prava $AF$ ih seče. Naizmenični uglovi su jednaki: $∡BAF = ∡AFE = 34°$.', ['baf']),
        K('Ugao $γ$ se sastoji od $∡CAB$ i $∡BAF$: $γ = 22° + 34° = 56°$.', ['gama']),
        K('Neka prava $CE$ seče $AB$ u tački $P$. Duž $EG$ je normalna na $AB$, pa je trougao $EGP$ pravougli: $∡GPE = 90° − 35° = 55°$.', ['egp']),
        K('Uglovi $∡GPE$ i $β = ∡BPE$ su uporedni (zajedno čine opruženi ugao): $β = 180° − 55° = 125°$.', ['beta']),
        K('$∡CPB = ∡GPE = 55°$ (unakrsni uglovi). To je spoljašnji ugao trougla $APC$, pa je jednak zbiru dva unutrašnja nesusedna ugla: $55° = 22° + α$.', ['apc']),
        'Dakle $α = 55° − 22° = 33°$, $β = 125°$, $γ = 56°$.',
      ],
      G({ A: [0, 0, 180], B: [6, 0, 0], C: [6, 2.42, 30], D: [0, 2.42, 150], E: [1.47, -4.05, 225], F: [6, -4.05, -45], G: [1.47, 0, -60], P: [4.3, 0, 80] },
        [{ p: 'ABCD', prazno: 1 }, { p: 'GBFE', prazno: 1 }, { d: 'AC' }, { d: 'AF' }, { d: 'EC' },
          { u: 'BAC', o: '22°', r: 60 }, { u: 'GEC', o: '35°' }, { u: 'AFE', o: '34°', r: 30 },
          { u: 'ACE', o: 'α', b: 1, r: 30 }, { u: 'BPE', o: 'β', b: 2 }, { u: 'CAF', o: 'γ', b: 3, r: 28 },
          { u: 'BAF', o: '34°', b: 4, k: 1, kraj: 3, id: 'baf', r: 40 }, { u: 'CAF', id: 'gama', b: 3, k: 2, kraj: 3, r: 28 },
          { p: 'EGP', id: 'egp', b: 4, k: 3, kraj: 5 }, { u: 'GPE', o: '55°', b: 4, k: 3 }, { id: 'beta', u: 'BPE', b: 2, k: 4, kraj: 5 },
          { p: 'APC', id: 'apc', b: 1, k: 5 }, { u: 'CPB', o: '55°', b: 4, k: 5 }]));
    Z(5, 4, 2,
      'Joca baca tri kockice: crvenu (strane $1$–$6$), plavu (strane $1, 2, 3, 4, 4, 4$) i zelenu (strane $3, 3, 3, 4, 5, 6$), i zapisuje trocifren broj: stotine – crvena, desetice – plava, jedinice – zelena. Koliko različitih brojeva može dobiti?',
      ['$96$', '$216$', '$144$', '$72$'],
      [
        'Bitno je koje cifre se mogu pojaviti, a ne koliko puta su napisane na kockici.',
        K('Crvena daje $6$ različitih cifara, plava $4$ ($1, 2, 3, 4$), zelena $4$ ($3, 4, 5, 6$).', [], C.tabela([['~kockica', '~crvena', '~plava', '~zelena'], ['~različite cifre', '1–6', '1, 2, 3, 4', '3, 4, 5, 6'], ['~broj', 6, 4, 4]])),
        'Različitih brojeva: $6 · 4 · 4 = 96$.',
      ]);
    Z(5, 5, 2,
      'Koji je najmanji prirodan broj kojim treba podeliti brojeve $1901$, $2892$ i $1723$ da se dobiju redom ostaci $11$, $12$ i $13$?',
      ['$15$', '$90$', '$18$', '$30$'],
      [
        'Ako $1901$ daje ostatak $11$, onda je $1901 − 11 = 1890$ deljivo deliocem $d$. Isto: $2880$ i $1710$. Uz to $d > 13$ (ostatak je manji od delioca).',
        K('$1890 = 2 · 3³ · 5 · 7$, $2880 = 2^{6} · 3² · 5$, $1710 = 2 · 3² · 5 · 19$: $NZD = 2 · 3² · 5 = 90$.', [], C.tabela([['~broj', 1890, 2880, 1710], ['~rastavljanje', '2·3³·5·7', '2⁶·3²·5', '2·3²·5·19']])),
        'Delioci broja $90$ veći od $13$: $15, 18, 30, 45, 90$ – najmanji je $15$. Provera: $1901 = 15 · 126 + 11$ ✓, $2892 = 15 · 192 + 12$ ✓, $1723 = 15 · 114 + 13$ ✓.',
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Koji su svi oštrougli trouglovi čiji su uglovi (u stepenima) prosti brojevi?',
      ['samo trougao sa uglovima $2°, 89°, 89°$', '$2°, 89°, 89°$ i $3°, 87°, 90°$', 'samo jednakostranični', 'ne postoje'],
      [
        'Zbir uglova je $180$ – paran. Zbir tri neparna broja je neparan, pa je jedan ugao paran prost broj: $2°$.',
        'Ostala dva imaju zbir $178°$, a oba su manja od $90°$ (oštrougli) – dakle oba su veća od $88°$: jedino $89° + 89°$.',
        '$89$ je prost ✓. Jedini takav trougao: $2°, 89°, 89°$.',
      ]);
    Z(6, 2, 2,
      'U trouglu $ABC$ ugao kod $A$ je $48°$, a simetrale unutrašnjeg i spoljašnjeg ugla kod $A$ seku pravu $BC$ u tačkama $M$ i $K$. Ako je trougao $AMK$ jednakokrak, koliki su uglovi trougla $ABC$?',
      ['$48°$, $21°$ i $111°$', '$48°$, $66°$ i $66°$', '$48°$, $45°$ i $87°$', '$48°$, $24°$ i $108°$'],
      [
        'Simetrale unutrašnjeg i spoljašnjeg ugla kod istog temena su normalne ($∡MAK = 90°$). Jednakokraki pravougli trougao $AMK$ ima uglove $45°$ kod $M$ i $K$.',
        'Simetrala deli $48°$ na dva po $24°$. Ugao između $AM$ i prave $BC$ je $45°$.',
        'Ako je $∡AMC = 45°$: u trouglu $AMC$ je $∡C = 180° − 24° − 45° = 111°$ i $∡B = 21°$. Ako je $∡AMB = 45°$, uloge $B$ i $C$ se zamene.',
        'Uglovi trougla: $48°$, $21°$ i $111°$.',
      ]);
    Z(6, 3, 2,
      'Za koje cele brojeve $a$ je ${8|3a + 1}$ ceo broj?',
      ['$a ∈ \\{−3, −1, 0, 1\\}$', '$a ∈ \\{−1, 0, 1\\}$', '$a ∈ \\{0, 1, 7\\}$', '$a ∈ \\{−3, 0, 1, 7\\}$'],
      [
        '$3a + 1$ mora biti delilac broja $8$: $±1, ±2, ±4, ±8$.',
        K('Rešavamo $3a + 1 = d$ i zadržimo cele $a$.', [], C.tabela([['3a + 1', 1, '−1', 2, '−2', 4, '−4', 8, '−8'], ['a', 0, '−2/3', '1/3', '−1', 1, '−5/3', '7/3', '−3'], ['~ceo?', '~da', '~ne', '~ne', '~da', '~da', '~ne', '~ne', '~da']])),
        'Celi: $a ∈ \\{−3, −1, 0, 1\\}$ (vrednosti razlomka $−1, −4, 8, 2$).',
      ]);
    Z(6, 4, 1,
      'U državi Literaniji azbuka ima $19$ slova, a ime svakog stanovnika ima tri reči. Ne smeju postojati dva stanovnika sa istim inicijalima. Može li u Literaniji biti $7000$ stanovnika?',
      ['Ne može', 'Može', 'Može samo ako su imena kraća', 'Može, ali najviše $19$ stanovnika sa istim prvim slovom'],
      [
        'Inicijali su uređena trojka slova; svaka od tri pozicije ima $19$ mogućnosti.',
        'Različitih inicijala ima $19 · 19 · 19 = 6859$.',
        '$7000 > 6859$, pa bi po Dirihleovom principu dva stanovnika imala iste inicijale. Ne može.',
      ]);
    Z(6, 5, 2,
      'Koji je najmanji prirodan broj deljiv sa $5$ čiji je zbir cifara $2017$?',
      ['$599…95$ ($223$ devetke)', '$199…90$ ($224$ devetke)', '$499…95$ ($223$ devetke)', '$599…9$ ($224$ devetke) pa $5$'],
      [
        'Broj se završava sa $0$ ili $5$. Da bi bio mali, treba što manje cifara – što više devetki.',
        'Ako se završava sa $5$: ostale cifre imaju zbir $2012 = 9 · 223 + 5$ – najmanje $224$ cifre, pa ukupno $225$. Ako se završava sa $0$: ostale imaju zbir $2017 = 9 · 224 + 1$ – $225$ cifara, ukupno $226$. Bolje je završiti sa $5$.',
        'Prvih $224$ cifara ima zbir $2012$; prva cifra je najmanja moguća: ostalih $223$ daje najviše $2007$, pa je prva cifra $5$, a ostale devetke.',
        'Broj: $5$, pa $223$ devetke, pa $5$.',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Izračunaj $3,333… · 6,666…$ (cifre $3$, odnosno $6$ se beskonačno ponavljaju) i zapiši rezultat kao decimalan broj.',
      ['$22,222…$', '$21,999…$', '$22,22$', '$19,8$'],
      [
        '$3,333… = 3 + {1|3} = {10|3}$, a $6,666… = 6 + {2|3} = {20|3}$.',
        'Proizvod: ${10|3} · {20|3} = {200|9}$.',
        '${200|9} = 22{2|9} = 22,222…$ (dvojka se beskonačno ponavlja).',
      ]);
    Z(7, 2, 2,
      'Napiši izraz ${16^{n + 1} · 2^{5n + 3}|8^{3n}} : {4²|4^{n}}$ kao stepen sa osnovom $2$.',
      ['$2^{2n + 3}$', '$2^{2n − 1}$', '$2^{7}$', '$2^{6n + 3}$'],
      [
        'Sve kao stepeni dvojke: $16^{n + 1} = 2^{4n + 4}$, $8^{3n} = 2^{9n}$, $4² = 2^{4}$, $4^{n} = 2^{2n}$.',
        'Prvi razlomak: $2^{4n + 4 + 5n + 3 − 9n} = 2^{7}$. Drugi: ${2^{4}|2^{2n}} = 2^{4 − 2n}$.',
        'Deljenje: $2^{7 − (4 − 2n)} = 2^{2n + 3}$.',
      ]);
    Z(7, 3, 3,
      'Neka su $M$ i $N$ tačke na stranicama $AB$ i $BC$ kvadrata $ABCD$, takve da je $AM = BN$. Koliki je zbir uglova $MAN$, $MDN$ i $MCN$?',
      ['$90°$', '$45°$', '$135°$', 'zavisi od položaja tačaka'],
      [
        K('Trouglovi $ABN$ i $DAM$ su podudarni (SUS: $AB = DA$, $BN = AM$, pravi uglovi), pa je $∡BAN = ∡ADM$ – označimo sa $x$. Dakle $∡MAN = x$.', ['t1', 't2']),
        K('Trouglovi $CBM$ i $DCN$ su podudarni ($CB = DC$, $BM = CN$ jer $BM = AB − AM = BC − BN = CN$), pa je $∡BCM = ∡CDN$ – označimo sa $y$. Dakle $∡MCN = y$.', ['t3', 't4']),
        '$∡MDN = 90° − ∡ADM − ∡CDN = 90° − x − y$.',
        'Zbir: $x + (90° − x − y) + y = 90°$ – za svaki položaj tačaka!',
      ],
      G({ A: [0, 0, 225], B: [4, 0, -45], C: [4, 4, 45], D: [0, 4, 135], M: [1.5, 0, -90], N: [4, 1.5, 0] },
        [{ p: 'ABCD', prazno: 1 }, { d: 'AN' }, { d: 'DM' }, { d: 'DN' }, { d: 'CM' }, { p: 'ABN', id: 't1', b: 1, k: 1 }, { p: 'DAM', id: 't2', b: 1, k: 1 }, { p: 'CBM', id: 't3', b: 2, k: 2 }, { p: 'DCN', id: 't4', b: 2, k: 2 }]));
    Z(7, 4, 2,
      'Dat je trougao $ABC$ i jednakostranični trouglovi $ABC_{1}$ i $BCA_{1}$ konstruisani spolja. Koliki je ugao između pravih $AA_{1}$ i $CC_{1}$?',
      ['$60°$', '$90°$', '$45°$', '$120°$'],
      [
        'a) $AA_{1} = CC_{1}$: trouglovi $ABA_{1}$ i $C_{1}BC$ su podudarni (SUS): $AB = C_{1}B$, $BA_{1} = BC$, a $∡ABA_{1} = ∡ABC + 60° = ∡C_{1}BC$.',
        'Drugim rečima, rotacija oko $B$ za $60°$ preslikava $C_{1}$ u $A$ i $C$ u $A_{1}$ – dakle duž $C_{1}C$ u duž $AA_{1}$.',
        'Rotacija za $60°$ okreće svaku pravu za $60°$, pa prave $AA_{1}$ i $CC_{1}$ zaklapaju ugao od $60°$.',
      ]);
    Z(7, 5, 2,
      'Na košarkaškom turniru svaka ekipa je odigrala po jednu utakmicu sa svakom drugom. Na kraju je $90%$ ekipa imalo bar jednu pobedu. Koliko je ekipa učestvovalo? (Nerešenih nema.)',
      ['$10$', '$20$', '$9$', '$100$'],
      [
        'Dve ekipe bez pobede ne mogu postojati – međusobno su igrale, pa je jedna pobedila.',
        'Zato je bez pobede najviše jedna ekipa, a „$10%$ ekipa bez pobede“ mora biti ceo broj: tačno $1$ ekipa.',
        '$10%$ ekipa $= 1$ ⇒ ekipa je $10$.',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Reši jednačinu ${1|1 − {1|1 + {1|\\|x − 1\\|}}} = 2017$.',
      ['$x = 2017$ ili $x = −2015$', 'samo $x = 2017$', '$x = 2016$ ili $x = −2016$', '$x = 2018$ ili $x = −2016$'],
      [
        'Neka je $t = |x − 1|$. Tada je $1 + {1|t} = {t + 1|t}$, a njegova recipročna vrednost ${t|t + 1}$.',
        '$1 − {t|t + 1} = {1|t + 1}$, pa je ceo izraz $t + 1 = 2017$, tj. $t = 2016$.',
        K('$|x − 1| = 2016$: $x = 2017$ ili $x = −2015$.', [], C.brojevna(-2200, 2200, [[-2015, '−2015', 1], [1, '1', 4], [2017, '2017', 1]], { podela: 500, svaki: 2 })),
      ]);
    // VIII.2: G = AC ∩ BF, H = FD ∩ CE (kao na slici sa takmičenja); a = 6, koordinate tačne (3√3 ≈ 5,2)
    Z(8, 2, 2,
      'Na slici je pravilan šestougao $ABCDEF$ stranice $AB = 6 cm$. Tačka $G$ je presek duži $AC$ i $BF$, a $H$ presek duži $FD$ i $CE$. Izračunaj obim četvorougla $GCHF$.',
      ['$16√3 cm$', '$12√3 cm$', '$8 + 8√3 cm$', '$24 cm$'],
      [
        K('Unutrašnji ugao pravilnog šestougla je $120°$. Trougao $ABC$ je jednakokrak ($AB = BC$), pa je $∡BAC = ∡BCA = {180° − 120°|2} = 30°$.', ['abc']),
        K('Četvorougao $BCEF$ je pravougaonik, pa je $∡FBC = 90°$ i $∡ABG = 120° − 90° = 30°$. Trougao $ABG$ ima dva ugla od $30°$ – jednakokrak je: $AG = BG$.', ['abg']),
        K('Spustimo visinu iz $G$ na $AB$: ona polovi $AB$ (po $3 cm$) i sa $AG$ gradi pravougli trougao sa uglom od $30°$, pa je $AG = 2 · $ visina. Iz Pitagorine teoreme: $AG² = 3² + ({AG|2})²$, tj. ${3|4}AG² = 9$, $AG = BG = 2√3 cm$.', ['abg']),
        K('Kraća dijagonala šestougla je $AC = BF = 2 · 3√3 = 6√3 cm$ (dve visine jednakostraničnog trougla stranice $6$). Zato $GC = 6√3 − 2√3 = 4√3$ i $FG = 6√3 − 2√3 = 4√3$.', ['gc', 'fg']),
        K('Šestougao je centralno simetričan: simetrija oko centra preslikava $A → D$, $C → F$, $B → E$, pa duž $AC$ prelazi u $DF$, a $BF$ u $EC$. Zato $G → H$, pa je $CH = FG = 4√3$ i $HF = GC = 4√3$.', ['ch', 'hf']),
        K('$GCHF$ je romb stranice $4√3 cm$, obim $4 · 4√3 = 16√3 cm ≈ 27,7 cm$.', ['romb']),
      ],
      G({ A: [-6, 0, 180], B: [-3, -5.2, 240], C: [3, -5.2, -60], D: [6, 0, 0], E: [3, 5.2, 60], F: [-3, 5.2, 120], G: [-3, -1.73, 120], H: [3, 1.73, 300] },
        [{ p: 'ABCDEF', prazno: 1 }, { d: 'BF' }, { d: 'CE' }, { d: 'AC' }, { d: 'FD' }, { tacka: 'G' }, { tacka: 'H' },
          { p: 'ABC', id: 'abc', b: 4, k: 1, kraj: 2 }, { p: 'ABG', id: 'abg', b: 1, k: 2, kraj: 4 },
          { d: 'GC', id: 'gc', b: 2, k: 4, o: '4√3' }, { d: 'FG', id: 'fg', b: 2, k: 4, o: '4√3', os: -1 },
          { d: 'CH', id: 'ch', b: 2, k: 5, o: '4√3', os: -1 }, { d: 'HF', id: 'hf', b: 2, k: 5, o: '4√3' },
          { p: 'GCHF', id: 'romb', b: 2, k: 6 }]));
    Z(8, 3, 2,
      'Dijagonala $AC_{1}$ pravilne četvorostrane prizme $ABCDA_{1}B_{1}C_{1}D_{1}$ i bočna ivica $AA_{1}$ grade ugao od $30°$. Ako je zapremina prizme $108√3 cm³$, kolika je dijagonala prizme?',
      ['$12 cm$', '$6 cm$', '$6√3 cm$', '$18 cm$'],
      [
        'Neka je dijagonala $D$. U pravouglom trouglu $AA_{1}C_{1}$ (prav ugao kod $A_{1}$): visina $H = D · {√3|2}$ (naleglo uz $30°$), dijagonala osnove $a√2 = {D|2}$ (naspram $30°$).',
        'Osnova je kvadrat: $a² = {(a√2)²|2} = {D²|8}$.',
        K('$V = a² · H = {D²|8} · {D√3|2} = {D³√3|16} = 108√3$ ⇒ $D³ = 1728$ ⇒ $D = 12 cm$.', [], C.kvadar(2.12, 2.12, 5.2, [{ d: 'AC₁', b: 1 }, { d: 'AA₁', b: 2 }])),
      ]);
    D(8, 4, 2,
      'Neka su $a$ i $b$ prirodni brojevi, $a < b$, takvi da je broj $11a + 13b$ deljiv sa $12$. Dokaži da broj $b − a$ ima bar šest različitih prirodnih delilaca.',
      [
        'Zapišimo: $11a + 13b = 12a + 12b + (b − a)$.',
        '$12a + 12b$ je deljivo sa $12$, pa je i $b − a$ deljivo sa $12$.',
        K('$b − a = 12k$ ($k ≥ 1$) ima sigurno delioce $1, 2, 3, 4, 6, 12$ – bar šest. (Npr. $a = 1$, $b = 13$: $11 + 169 = 180 = 12 · 15$, $b − a = 12$ – tačno $6$ delilaca.)', [], C.tabela([['~delioci 12', 1, 2, 3, 4, 6, 12]])),
      ]);
    Z(8, 5, 2,
      'Koji trocifreni brojevi su tri puta veći od kvadrata zbira svojih cifara?',
      ['$243$ i $972$', 'samo $243$', '$147$ i $972$', '$243$, $507$ i $972$'],
      [
        'Neka je $s$ zbir cifara: $n = 3s²$. Broj $n$ je deljiv sa $3$, a broj i njegov zbir cifara daju isti ostatak pri deljenju sa $3$ – zato je i $s$ deljiv sa $3$.',
        'Trocifren: $100 ≤ 3s² ≤ 999$ ⇒ $6 ≤ s ≤ 18$.',
        K('Proveravamo: $n = 3s²$ i zbir cifara od $n$ mora biti $s$.', [], C.tabela([['s', 6, 9, 12, 15, 18], ['3s²', 108, 243, 432, 675, 972], ['~zbir cifara', 9, 9, 9, 18, 18], ['~= s?', '~ne', '~da', '~ne', '~ne', '~da']], { istakni: [[1, 2], [1, 5]] })),
        'Rešenja: $243$ ($s = 9$, $3 · 81 = 243$) i $972$ ($s = 18$, $3 · 324 = 972$).',
      ]);
  },
};
