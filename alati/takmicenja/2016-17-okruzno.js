// Okružno takmičenje iz matematike učenika osnovnih škola, 25. 3. 2017. (DMS)
// https://dms.rs/wp-content/uploads/2017/03/Okruzno_osnovne_skole_2017.pdf (samo postavke – rešenja su naša, provereni računom)
module.exports = {
  godina: '2016/17', nivo: 'okruzno', datum: '25. 3. 2017.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Zbir tri broja je $2,2$. Prvi sabirak povećamo za $1,2$, drugi smanjimo za $0,2$, a treći smanjimo za zbir $0,4 + 0,5$. Koliki je zbir tako dobijenih brojeva?',
      ['$2,3$', '$2,2$', '$3,4$', '$1,3$'],
      [
        'Zbir se menja onoliko koliko se ukupno promene sabirci.',
        'Ukupna promena: $+1,2 − 0,2 − (0,4 + 0,5) = 1,2 − 0,2 − 0,9 = 0,1$.',
        'Novi zbir: $2,2 + 0,1 = 2,3$.',
      ]);
    Z(5, 2, 2,
      'Pera je iz zbirke istrgnuo $30$ listova (ne obavezno susednih) i sabrao brojeve svih strana na njima. Tvrdi da je dobio $2017$. Da li je to moguće?',
      ['Nije moguće', 'Moguće je', 'Moguće je samo ako su listovi susedni', 'Moguće je samo ako je knjiga duža od $2017$ strana'],
      [
        'Na jednom listu su dve uzastopne strane: neparna $2k − 1$ i parna $2k$. Njihov zbir je $4k − 1$ – neparan.',
        'Zbir $30$ neparnih brojeva je paran (paran broj neparnih sabiraka).',
        '$2017$ je neparan – Pera nije mogao dobiti taj zbir.',
      ]);
    Z(5, 3, 2,
      'Na svakoj strani kocke napisan je broj $2$, $4$ ili $8$. Zoran je bacio kocku dvaput: posle prvog bacanja zbir pet vidljivih strana je bio $16$, a posle drugog $20$. Koji brojevi su na stranama kocke?',
      ['$8, 4, 4, 4, 2, 2$', '$8, 8, 2, 2, 2, 2$', '$4, 4, 4, 4, 4, 4$', '$8, 4, 4, 2, 2, 2$'],
      [
        'Vidljivo je svih pet strana osim donje: zbir vidljivih $=$ zbir svih ($T$) minus donja strana.',
        '$T − d_{1} = 16$ i $T − d_{2} = 20$, pa je $d_{1} − d_{2} = 4$: od brojeva $2, 4, 8$ jedino $d_{1} = 8$, $d_{2} = 4$. Tada je $T = 24$.',
        K('Na kocki su $8$ i $4$, a preostala četiri broja imaju zbir $12$: jedina mogućnost iz $\\{2, 4, 8\\}$ je $4 + 4 + 2 + 2$.', [], C.tabela([['~strane', 8, 4, 4, 4, 2, 2], ['~1. bacanje (dole 8)', '~dole', '✓', '✓', '✓', '✓', '✓'], ['~2. bacanje (dole 4)', '✓', '~dole', '✓', '✓', '✓', '✓']])),
        'Brojevi: $8, 4, 4, 4, 2, 2$ (zbir $24$).',
      ]);
    Z(5, 4, 2,
      'Na koliko načina se slova $A, B, C, D, E$ mogu zameniti brojevima $1, 2, 3, 4, 5$ (različita slova – različiti brojevi) tako da važi $A > B$, $C > A$, $C > D$ i $D > E$?',
      ['$6$', '$4$', '$12$', '$24$'],
      [
        'Iz $C > A > B$ i $C > D > E$: $C$ je veći od svih ostalih, pa je $C = 5$.',
        'Ostaju $1, 2, 3, 4$ za dva „lanca“ $A > B$ i $D > E$. Biramo koja dva broja idu u par $(A, B)$ – veći je $A$; ostala dva idu u $(D, E)$.',
        K('Izbora para: ${4 · 3|2} = 6$.', [], C.tabela([['~A, B', '2,1', '3,1', '4,1', '3,2', '4,2', '4,3'], ['~D, E', '4,3', '4,2', '3,2', '4,1', '3,1', '2,1']])),
      ]);
    Z(5, 5, 3,
      'Aca je podelio neki prost broj $n$ sa $60$ i kao ostatak dobio složen broj. Koji je ostatak?',
      ['$49$', '$25$', '$35$', '$9$'],
      [
        'Neka je $n = 60q + r$. Ako bi $r$ imao zajednički činilac $2$, $3$ ili $5$ sa $60$, i $n$ bi bio deljiv tim činiocem – za prost $n$ to znači $n = 2, 3$ ili $5$, pa bi i ostatak bio taj prost broj. Zato $r$ nije deljiv sa $2, 3, 5$.',
        K('Složen broj manji od $60$ koji nije deljiv sa $2, 3, 5$: najmanji prosti činilac mu je bar $7$, pa je bar $7 · 7 = 49$; sledeći bi bio $7 · 11 = 77 > 60$.', [], C.tabela([['~složeni < 60 bez 2, 3, 5', '49 = 7²'], ['~sledeći', '77 > 60']], { zaglavlje: false })),
        'Ostatak je $49$ (npr. $109 = 60 + 49$ je prost).',
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 3,
      'Treba konstruisati trougao $ABC$ ako je $c = 4 cm$, $a + b = 9 cm$ i $α = 75°$. Koji trougao se konstruiše prvi?',
      ['$ABD$ sa $AB = 4$, $AD = 9$ i uglom $75°$ kod $A$ ($D$ na produžetku $AC$, $CD = CB$)', '$ABC$ sa $AB = 4$, $BC = 9$', 'Jednakostranični trougao stranice $4$', '$ABD$ sa $AB = 9$, $AD = 4$ i uglom $105°$'],
      [
        'Analiza: produžimo $AC$ preko $C$ do $D$ tako da je $CD = CB$. Tada je $AD = AC + CB = b + a = 9 cm$.',
        'Trougao $ABD$ ima dve stranice ($AB = 4$, $AD = 9$) i ugao između njih ($75°$) – konstruiše se po stavu SUS.',
        K('Trougao $BCD$ je jednakokrak ($CB = CD$), pa je $C$ na simetrali duži $BD$: teme $C$ je presek simetrale duži $BD$ sa duži $AD$.', [], G({ A: [0, 0, 225], B: [4, 0, -45], D: [2.33, 8.69, 90], C: [1.056, 3.94, 150] }, [{ p: 'ABC', b: 1 }, { d: 'CD', isp: 1 }, { d: 'BD', isp: 1 }, { u: 'BAC'.split('').reverse().join(''), o: '75°' }])),
      ]);
    Z(6, 2, 2,
      'Simetrale spoljašnjih uglova trougla $ABC$ obrazuju trougao sa uglovima $30°$, $70°$ i $80°$. Koliki su unutrašnji uglovi trougla $ABC$?',
      ['$120°$, $40°$, $20°$', '$60°$, $40°$, $80°$', '$150°$, $110°$, $100°$', '$75°$, $55°$, $50°$'],
      [
        'Simetrale spoljašnjih uglova kod $B$ i $C$ seku se u tački $S_{A}$ naspram $A$. U trouglu $BCS_{A}$ uglovi kod $B$ i $C$ su ${180° − β|2}$ i ${180° − γ|2}$, pa je ugao kod $S_{A}$: $180° − (90° − {β|2}) − (90° − {γ|2}) = {β + γ|2} = 90° − {α|2}$.',
        'Svaki ugao novog trougla je oblika $90° − {α|2}$, $90° − {β|2}$, $90° − {γ|2}$.',
        K('$90° − {α|2} = 30°$ ⇒ $α = 120°$; $70°$ ⇒ $40°$; $80°$ ⇒ $20°$. Provera: $120° + 40° + 20° = 180°$ ✓.', [], C.tabela([['~ugao novog', '30°', '70°', '80°'], ['~unutrašnji', '120°', '40°', '20°']])),
      ]);
    Z(6, 3, 2,
      'Racionalni brojevi $a, b, c$ su takvi da je jedan pozitivan, jedan negativan i jedan nula. Ako je ${(b − a)(c − b)|b} < 0$, šta važi?',
      ['$b$ je pozitivan, a od $a$ i $c$ jedan je nula, a drugi negativan', '$b$ je negativan, $a$ nula, $c$ pozitivan', '$a$ je nula, $b$ negativan, $c$ pozitivan', '$c$ je nula, $a$ pozitivan, $b$ negativan'],
      [
        '$b$ je u imeniocu, pa nije nula.',
        'Ako je $b < 0$, onda su $a$ i $c$ nula i pozitivan broj. Proverom: $a = 0, c > 0$ daje ${b(c − b)|b} = c − b > 0$ ✗; $a > 0, c = 0$ daje ${(b − a)(−b)|b} = a − b > 0$ ✗. Dakle $b > 0$.',
        K('Za $b > 0$: $a = 0, c < 0$ daje $c − b < 0$ ✓; $a < 0, c = 0$ daje $−(b − a) < 0$ ✓ – oba rasporeda važe.', [], C.tabela([['a', 0, '−', 0, '+'], ['b', '+', '+', '−', '−'], ['c', '−', 0, '+', 0], ['~izraz < 0?', '~da', '~da', '~ne', '~ne']])),
        '$b$ je pozitivan, a $a$ i $c$ su nula i negativan broj (u bilo kom redu).',
      ]);
    Z(6, 4, 2,
      'Na tabli je izraz $2 : 3 : 5 : 7$. Dopisivanjem dva para zagrada na razne načine dobijaju se različite vrednosti. Koliko je različitih rezultata moguće?',
      ['$4$', '$5$', '$3$', '$6$'],
      [
        'Sa dva para zagrada možemo dobiti svih $5$ načina grupisanja četiri broja.',
        K('Računamo (deljenje sa razlomkom = množenje recipročnim):', [], C.tabela([['~grupisanje', '((2:3):5):7', '(2:(3:5)):7', '2:((3:5):7)', '2:(3:(5:7))', '(2:3):(5:7)'], ['~vrednost', '2/105', '10/21', '70/3', '10/21', '14/15']])),
        'Grupisanja $(2 : (3 : 5)) : 7$ i $2 : (3 : (5 : 7))$ daju istu vrednost ${10|21}$. Različitih rezultata: $4$.',
      ]);
    Z(6, 5, 3,
      'Koliko ima prirodnih brojeva manjih od $10 000$ čiji je proizvod cifara $42$?',
      ['$50$', '$36$', '$48$', '$24$'],
      [
        '$42 = 2 · 3 · 7$. Cifre (bez $1$) mogu biti $\\{6, 7\\}$, $\\{2, 3, 7\\}$, $\\{2, 21\\}$ (ne – $21$ nije cifra) – dakle $\\{6, 7\\}$ ili $\\{2, 3, 7\\}$, uz dodatne jedinice (broj ima najviše $4$ cifre).',
        K('Prebrojavamo rasporede:', [], C.tabela([['~cifre', '6, 7', '6, 7, 1', '6, 7, 1, 1', '2, 3, 7', '2, 3, 7, 1'], ['~brojeva', 2, 6, 12, 6, 24]])),
        '$\\{6, 7\\}$: $2$; sa jednom jedinicom: $3! = 6$; sa dve jedinice: ${4!|2!} = 12$; $\\{2, 3, 7\\}$: $6$; sa jedinicom: $4! = 24$.',
        'Ukupno: $2 + 6 + 12 + 6 + 24 = 50$.',
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'Kolika je poslednja cifra broja $(9 − 5) · (9² − 5²) · (9³ − 5³) · … · (9^{10} − 5^{10})$?',
      ['$4$', '$6$', '$0$', '$2$'],
      [
        'Stepeni devetke se završavaju sa $9$ (neparan izložilac) ili $1$ (paran), a stepeni petice uvek sa $5$.',
        K('Neparan izložilac: $…9 − …5 = …4$; paran: $…1 − …5 = …6$ (pozajmica).', [], C.tabela([['k', 1, 2, 3, 4, '…', 10], ['9ᵏ − 5ᵏ kraj', 4, 6, 4, 6, '…', 6]])),
        'Proizvod pet činilaca sa krajem $4$ i pet sa krajem $6$: $(4 · 6)^{5}$ – kraj $24 → 4$, pa $4^{5}$ se završava sa $4$.',
      ]);
    Z(7, 2, 2,
      'U temenima kvadrata napisana su četiri različita prirodna broja. Na svakoj stranici je napisan proizvod brojeva sa njenih krajeva. Zbir četiri proizvoda je $124$. Koliki je zbir brojeva u temenima?',
      ['$35$', '$33$', '$64$', '$31$'],
      [
        'Neka su brojevi redom $a, b, c, d$. Zbir proizvoda: $ab + bc + cd + da = b(a + c) + d(a + c) = (a + c)(b + d) = 124$.',
        K('$124 = 2² · 31$. Zbirovi $a + c$ i $b + d$ (dva različita prirodna broja) su bar $3$, pa su činioci $4$ i $31$.', [], C.tabela([['~rastavljanje', '1 · 124', '2 · 62', '4 · 31'], ['~moguće?', '~ne', '~ne', '~da']])),
        'Zbir u temenima: $4 + 31 = 35$ (npr. $1, 2, 3, 29$ raspoređeni tako da su $1$ i $3$ naspramni).',
      ]);
    Z(7, 3, 3,
      'U četvorouglu $ABCD$ uglovi kod temena $A$, $B$ i $D$ su po $45°$. Ako je $BD = 10 cm$, kolika je površina četvorougla?',
      ['$50 cm²$', '$100 cm²$', '$25 cm²$', '$50√2 cm²$'],
      [
        'Zbir uglova je $360°$, pa je ugao kod $C$ $225°$ – četvorougao je nekonveksan. Neka se prave $AD$ i $BC$ seku u $P$: trougao $ABP$ ima uglove $45°, 45°$, pa je $∡APB = 90°$ i $PA = PB$.',
        K('Trougao $PCD$: prav ugao kod $P$ i ugao $45°$ kod $D$ – jednakokrako-pravougli: $PC = PD$.', ['t']),
        'Trouglovi $APC$ i $BPD$ (SUS: $PA = PB$, $PC = PD$, pravi uglovi) su podudarni – i jedan se dobija iz drugog rotacijom oko $P$ za $90°$. Zato je $AC = BD$ i $AC ⊥ BD$.',
        'Površina četvorougla sa normalnim dijagonalama: ${AC · BD|2} = {10 · 10|2} = 50 cm²$.',
      ],
      G({ A: [0, 0, 225], B: [5, 0, -45], C: [2.83, 2.17, -60], D: [2.83, 2.83, 90], P: [2.5, 2.5, 160] },
        [{ p: 'ABCD' }, { d: 'AC', b: 1, isp: 1 }, { d: 'BD', b: 2, isp: 1 }, { d: 'DP', isp: 1, k: 1 }, { d: 'CP', isp: 1, k: 1 }, { p: 'PCD', id: 't', b: 3, k: 2 }]));
    // VII.4: crtež kao na takmičenju – I = AF ∩ BG, J = BE ∩ CF (opisani krug R = 4, stranica a ≈ 3,06)
    D(7, 4, 3,
      'Na slici je pravilan osmougao $ABCDEFGH$; $I$ je presek duži $AF$ i $BG$, a $J$ presek duži $BE$ i $CF$. Dokaži da je zbir površina četvorouglova $AIGH$ i $CDEJ$ jednak površini četvorougla $BJFI$.',
      [
        'Neka je $a$ stranica osmougla. Temena leže na opisanoj kružnici, a svaka stranica se iz centra vidi pod uglom $360° : 8 = 45°$. Unutrašnji ugao osmougla je $135°$.',
        K('Periferijski ugao je polovina centralnog ugla nad istim lukom. Luk $AG$ (preko $H$) čine dve stranice – centralni ugao $90°$, pa je $∡ABG = 45°$. Isto tako luk $HF$ (preko $G$): $∡HAF = 45°$.', ['abg', 'haf']),
        K('Zato je $∡BAI = ∡HAB − ∡HAF = 135° − 45° = 90°$. Trougao $ABI$ ima prav ugao kod $A$ i ugao od $45°$ kod $B$, pa je jednakokrako-pravougli: $AI = AB = a$ i $BI = a√2$ (dijagonala kvadrata stranice $a$).', ['abi']),
        K('Osmougao je simetričan u odnosu na pravu $HD$, pa je i $GI = a$. Četvorougao $AIGH$ ima sve stranice jednake $a$ – to je romb, a njegov ugao kod $A$ je $∡HAI = 45°$.', ['plavi1']),
        K('Visina romba stranice $s$ sa uglom $45°$ je kateta jednakokrako-pravouglog trougla sa hipotenuzom $s$, tj. ${s√2|2}$. Zato je $P_{AIGH} = a · {a√2|2} = {a²√2|2}$. Zbog simetrije u odnosu na pravu $BF$ i $CDEJ$ je takav romb, pa je zbir plavih površina $a²√2$.', ['plavi1', 'plavi2']),
        K('Zbog simetrija u odnosu na $BF$ i $HD$, četvorougao $BJFI$ ima sve stranice jednake $BI = a√2$ – i on je romb. Njegov ugao kod $B$: $∡ABF$ je periferijski nad lukom od tri stranice ($135°$), pa je $∡ABF = 67,5°$ i $∡IBF = 67,5° − 45° = 22,5°$, tj. $∡IBJ = 45°$.', ['zeleni']),
        K('Visina zelenog romba je ${a√2 · √2|2} = a$, pa je $P_{BJFI} = a√2 · a = a²√2$ – tačno koliko i zbir površina plavih rombova. ∎', ['zeleni']),
      ],
      G({ H: [0, 4, 90], G: [2.83, 2.83, 45], F: [4, 0, 0], E: [2.83, -2.83, -45], D: [0, -4, -90], C: [-2.83, -2.83, -135], B: [-4, 0, 180], A: [-2.83, 2.83, 135], I: [0, 1.66, -90], J: [0, -1.66, 90] },
        [{ p: 'ABCDEFGH', prazno: 1 }, { p: 'AIGH', id: 'plavi1', b: 0, gusto: 1 }, { p: 'CDEJ', id: 'plavi2', b: 0, gusto: 1 }, { p: 'BJFI', id: 'zeleni', b: 2, gusto: 1 },
          { d: 'AF' }, { d: 'BG' }, { d: 'BE' }, { d: 'CF' },
          { u: 'ABG', id: 'abg', o: '45°', b: 3, k: 2, kraj: 4, r: 30 }, { u: 'HAF', id: 'haf', o: '45°', b: 4, k: 2, kraj: 4, r: 26 },
          { p: 'ABI', id: 'abi', b: 1, k: 3, kraj: 4 }, { pu: 'BAI', b: 1, k: 3, kraj: 4 }, { u: 'IBJ', o: '45°', b: 3, k: 6, r: 34 }]));
    Z(7, 5, 2,
      'Joca treba da umanji sliku na $31,2%$ originalne veličine, a program umanjuje samo na $p%$ početne veličine ($p ∈ \\{1, 2, …, 99\\}$). Na koliko načina (parova $p, q$, bez obzira na redosled) to može postići sa dva uzastopna umanjenja?',
      ['$4$', '$3$', '$6$', '$2$'],
      [
        'Dva umanjenja: ${p|100} · {q|100} = {31,2|100}$, tj. $p · q = 3120$.',
        '$3120 = 2^{4} · 3 · 5 · 13$. Tražimo parove činilaca, oba manja od $100$.',
        K('Parovi: $39 · 80$, $40 · 78$, $48 · 65$, $52 · 60$.', [], C.tabela([['p', 39, 40, 48, 52], ['q', 80, 78, 65, 60]])),
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Bočna ivica pravilne šestostrane piramide je $√{39} cm$, a apotema sa ravni osnove zaklapa ugao od $60°$. Kolika je zapremina piramide?',
      ['$54 cm³$', '$18√3 cm³$', '$108 cm³$', '$27 cm³$'],
      [
        'Neka je osnovna ivica $a$. Rastojanje centra osnove od ivice je ${a√3|2}$; zbog ugla od $60°$ visina je $H = {a√3|2} · √3 = {3a|2}$.',
        'Bočna ivica: $s² = H² + a²$ (rastojanje temena od centra je $a$): $39 = {9a²|4} + a² = {13a²|4}$, pa je $a² = 12$, $a = 2√3$, $H = 3√3$.',
        K('Osnova: $6 · {a²√3|4} = 18√3$. Zapremina: ${1|3} · 18√3 · 3√3 = 54 cm³$.', [], C.piramida(6, 2, 3)),
      ]);
    D(8, 2, 2,
      'Dokaži da ne postoje prirodni brojevi $x$ i $y$ takvi da je $2015x + y² = 2017^{2017}$.',
      [
        'Posmatramo ostatke pri deljenju sa $5$: $2015x$ je deljivo sa $5$, pa $y²$ daje isti ostatak kao $2017^{2017}$.',
        K('$2017$ daje ostatak $2$; stepeni dvojke daju ostatke $2, 4, 3, 1$ (period $4$), a $2017 = 4 · 504 + 1$, pa $2017^{2017}$ daje ostatak $2$.', [], C.tabela([['y : 5', 0, 1, 2, 3, 4], ['y² : 5', 0, 1, 4, 4, 1]])),
        'Kvadrat daje ostatak $0$, $1$ ili $4$ – nikad $2$. Takvi brojevi ne postoje.',
      ]);
    D(8, 3, 3,
      'U trouglu $ABC$ je $∡ABC = 60°$. Simetrala $AD$ ugla kod $A$ ($D ∈ BC$) i simetrala $CE$ ugla kod $C$ ($E ∈ AB$) seku se u tački $O$. Dokaži da je $OD = OE$.',
      [
        'Kako je $α + γ = 120°$, u trouglu $AOC$: $∡AOC = 180° − {α + γ|2} = 120°$, pa je i $∡EOD = 120°$ (unakrsni).',
        'U četvorouglu $BEOD$: $∡B + ∡EOD = 60° + 120° = 180°$ – tetivan četvorougao.',
        '$O$ je centar upisane kružnice, pa $BO$ polovi ugao $B$: $∡EBO = ∡OBD = 30°$. Periferijski uglovi nad tetivama $OE$ i $OD$ su jednaki, pa su i tetive jednake: $OE = OD$.',
      ]);
    Z(8, 4, 2,
      'Koliko tačaka sa obe celobrojne koordinate u trećem kvadrantu pripada grafiku funkcije $5x + 11y + 217 = 0$?',
      ['$4$', '$3$', '$5$', '$2$'],
      [
        'Treći kvadrant: $x < 0$, $y < 0$. Iz $5x = −217 − 11y$: $x$ je ceo kad je $217 + 11y$ deljivo sa $5$, tj. $11y + 217$, odnosno $y + 2$ deljivo sa $5$: $y = −2, −7, −12, …$',
        '$x = {−217 − 11y|5} < 0$ ⇒ $y > −{217|11} ≈ −19,7$.',
        K('$y ∈ \\{−2, −7, −12, −17\\}$, pa $x = −39, −28, −17, −6$ – četiri tačke.', [], C.tabela([['y', '−2', '−7', '−12', '−17'], ['x', '−39', '−28', '−17', '−6']])),
      ]);
    Z(8, 5, 3,
      'Koliko ima trouglova čije su sve stranice dijagonale datog konveksnog desetougla?',
      ['$50$', '$120$', '$70$', '$40$'],
      [
        'Trougao sa temenima u temenima desetougla ima sve stranice dijagonale ako nikoja dva temena nisu susedna.',
        'Svih trouglova: ${10 · 9 · 8|6} = 120$. Sa bar jednom stranicom desetougla: tačno jedna stranica ($10$ stranica · $6$ nesusednih trećih temena) $= 60$; dve stranice (tri uzastopna temena) $= 10$.',
        K('Traženih: $120 − 60 − 10 = 50$.', [], (() => { const v = Array.from({ length: 10 }, (_, i) => C.naKrugu([0, 0], 4, 90 + 36 * i)); return G({}, [{ lin: v, zatv: 1, prazno: 1 }, { lin: [v[0], v[3], v[6]], zatv: 1, b: 1 }]); })()),
      ]);
  },
};
