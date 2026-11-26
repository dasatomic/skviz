// Državno takmičenje iz matematike učenika osnovnih škola, 9. 5. 2026. (DMS)
// https://dms.rs/wp-content/uploads/2026/05/Postavke-i-resenja-zadataka.pdf
module.exports = {
  godina: '2025/26', nivo: 'drzavno', datum: '9. 5. 2026.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // pravougaonik na mreži (x, y – donji levi ugao; y nagore)
    const pr = (x, y, w, h, b, k) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], zatv: 1, b, ...(k ? { k } : {}) });

    // ───────── VI razred ─────────
    Z(6, 1, 2,
      'Sedmocifreni broj ima cifre redom $6, a, b, a, b, a, b$ i deljiv je sa $18$, a brisanjem njegove prve i poslednje cifre dobija se petocifreni broj (cifre $a, b, a, b, a$) deljiv sa $6$. Koji su to brojevi?',
      ['$6 404 040$ i $6 464 646$', 'samo $6 404 040$', '$6 202 020$ i $6 262 626$', '$6 404 040$ i $6 868 686$'],
      [
        'Broj je deljiv sa $18 = 2 · 9$ ako je paran i deljiv sa $9$. Paran je kad mu je poslednja cifra $b$ parna.',
        'Deljiv sa $9$: zbir cifara $6 + 3a + 3b$ deljiv je sa $9$, tj. (deljenjem sa $3$) $2 + a + b$ je deljivo sa $3$.',
        'Petocifreni broj sa ciframa $a, b, a, b, a$ deljiv je sa $6$ ako je paran (cifra $a$ je parna, i $a ≠ 0$ jer je prva cifra) i deljiv sa $3$: $3a + 2b$ deljivo sa $3$. Kako je $3a$ deljivo sa $3$, mora i $2b$, pa je $b$ deljiv sa $3$.',
        '$b$ je paran i deljiv sa $3$ ⇒ $b = 0$ ili $b = 6$. U oba slučaja uslov „$2 + a + b$ deljivo sa $3$“ postaje „$2 + a$ deljivo sa $3$“, tj. $a ∈ \\{1, 4, 7\\}$.',
        K('Uz to $a$ mora biti paran i različit od nule, pa je $a = 4$. Traženi brojevi su $6 404 040$ i $6 464 646$.', [], C.tabela([['~cifra a', 1, 4, 7], ['~paran i ≠ 0?', '~ne', '~da', '~ne']], { sirina: [3, 1.4], istakni: [[0, 2], [1, 2]] })),
        'Provera: $6 404 040 : 18 = 355 780$ i $6 464 646 : 18 = 359 147$ ✓; $40 404 : 6 = 6734$ i $46 464 : 6 = 7744$ ✓.',
      ]);
    Z(6, 2, 2,
      'Petorica drugova su redom uzimali klikere iz kutije. Prvi je uzeo trećinu svih klikera, a drugi četvrtinu ostatka. Zatim je prvi vratio u kutiju petinu klikera koje je uzeo. Onda je treći pogledao koliko trenutno imaju prva dvojica zajedno i uzeo iz kutije polovinu tog broja. Četvrti je uzeo tri klikera više nego što je ostavio petom, a petom je preostalo tri dvadesetine ukupnog broja klikera. Koliko je klikera uzeo četvrti drug?',
      ['$12$', '$9$', '$13$', '$16$'],
      [
        'Neka je u kutiji na početku $x$ klikera. Prvi uzima ${x|3}$; ostaje ${2x|3}$, pa drugi uzima ${1|4} · {2x|3} = {x|6}$.',
        'Prvi vraća petinu svojih: ${1|5} · {x|3} = {x|15}$, pa mu ostaje ${4x|15}$. Prva dvojica sada imaju ${4x|15} + {x|6} = {8x + 5x|30} = {13x|30}$.',
        'U kutiji je tada $x − {13x|30} = {17x|30}$. Treći uzima polovinu od ${13x|30}$, tj. ${13x|60}$, pa u kutiji ostaje ${34x − 13x|60} = {21x|60} = {7x|20}$.',
        'Peti dobija ${3x|20}$, a četvrti ${3x|20} + 3$. Zajedno uzimaju sve što je ostalo: ${3x|20} + 3 + {3x|20} = {7x|20}$, pa je ${x|20} = 3$ i $x = 60$.',
        K('Redom su uzeli: prvi $20 − 4 = 16$, drugi $10$, treći $13$, četvrti $12$, peti $9$. Zbir: $16 + 10 + 13 + 12 + 9 = 60$ ✓.', [], C.stubici([['1.', 16], ['2.', 10], ['3.', 13], ['4.', 12], ['5.', 9]], { korakY: 4, maxY: 16, vrednosti: true, istakni: [3] })),
      ]);
    Z(6, 3, 3,
      'U trouglu $ABC$ ugao kod temena $A$ je $6$ puta veći od ugla kod temena $B$. Simetrala stranice $AC$ seče stranicu $BC$ u tački $M$, pri čemu je trougao $ABM$ jednakokrak. Koliko ima rešenja (različitih trouglova $ABC$ po uglovima) i koji je najmanji mogući ugao $β$?',
      ['$3$ rešenja, najmanji $β = 15°$', '$2$ rešenja, najmanji $β = 20°$', '$1$ rešenje, $β = 15°$', '$3$ rešenja, najmanji $β = 12°$'],
      [
        'Neka su uglovi $α, β, γ$ i $α = 6β$. Tada je $γ = 180° − 7β$.',
        K('$M$ je na simetrali stranice $AC$, pa je $AM = CM$ i trougao $ACM$ je jednakokrak: $∡MAC = γ$. Spoljašnji ugao trougla $ACM$ kod $M$ je $∡AMB = 2γ = 360° − 14β$, a $∡BAM = α − γ = 13β − 180°$.', ['tr']),
        'U trouglu $ABM$ uglovi su $β$, $13β − 180°$ i $360° − 14β$. Jednakokrak je ako su neka dva ugla jednaka – tri slučaja.',
        '1) $∡BAM = ∡ABM$: $13β − 180° = β$ ⇒ $β = 15°$, pa su uglovi $α = 90°$, $β = 15°$, $γ = 75°$.',
        '2) $∡AMB = ∡BAM$: $360° − 14β = 13β − 180°$ ⇒ $27β = 540°$, $β = 20°$: $α = 120°$, $β = 20°$, $γ = 40°$.',
        '3) $∡AMB = ∡ABM$: $360° − 14β = β$ ⇒ $β = 24°$: $α = 144°$, $β = 24°$, $γ = 12°$.',
        'Sva tri slučaja daju ispravne trouglove (svi uglovi pozitivni), pa postoje $3$ rešenja, a najmanji $β$ je $15°$.',
      ],
      G({ A: [0, 0, 225], B: [7.46, 0, -45], C: [0, 2, 135], M: [3.73, 1, 60] },
        [{ p: 'ABC' }, { d: 'AM' }, { u: 'CBA', o: 'β' }, { p: 'ACM', id: 'tr', b: 2, k: 2 }]));
    D(6, 4, 2,
      'Dat je kvadrat $ABCD$. Tačke $M$, $N$ i $Q$ su redom središta duži $AB$, $BC$ i $DM$, a tačka $P$ je presek duži $CM$ i $DN$. Dokaži da je $CM = 2 · PQ$.',
      [
        'Trouglovi $AMD$ i $BMC$ su podudarni (SUS: $AM = BM$, $AD = BC$, pravi uglovi), pa je $CM = DM$.',
        'Trouglovi $BCM$ i $CDN$ su podudarni (SUS: $BC = CD$, $BM = CN$ – polovine stranice, pravi uglovi kod $B$ i $C$), pa je $∡BCM = ∡CDN$; označimo ga sa $x$.',
        K('Tada je $∡MCD = 90° − x$, pa u trouglu $CDP$: $∡CPD = 180° − (90° − x) − x = 90°$. Dakle $CM ⊥ DN$, i trougao $DMP$ je pravougli sa pravim uglom kod $P$.', ['tr']),
        'Središte hipotenuze pravouglog trougla je centar opisane kružnice, pa je $Q$ (središte $DM$) jednako udaljeno od $D$, $M$ i $P$: $PQ = {DM|2}$.',
        'Zato je $DM = 2 · PQ$, a kako je $CM = DM$, važi $CM = 2 · PQ$, tj. $CM : PQ = 2$.',
      ],
      G({ A: [0, 0, 225], B: [4, 0, -45], C: [4, 4, 45], D: [0, 4, 135], M: [2, 0, -90], N: [4, 2, 0], P: [3.2, 2.4, -30], Q: [1, 2, 180] },
        [{ p: 'ABCD' }, { d: 'CM' }, { d: 'DN' }, { d: 'DM' }, { tacka: 'Q' }, { pu: 'MPD', k: 3 }, { p: 'DMP', id: 'tr', b: 2, k: 3 }, { d: 'PQ', b: 1, k: 4 }]));
    D(6, 5, 3,
      'Dato je $5$ složenih brojeva ne većih od $120$. Dokaži da među njima postoje dva broja koja nisu uzajamno prosta.',
      [
        'Pogledajmo za svaki broj njegov najmanji prost delilac.',
        'Ako se dva najmanja prosta delioca poklapaju, ta dva broja imaju zajednički činilac – nisu uzajamno prosta.',
        'Inače je svih $5$ najmanjih prostih delilaca različito. Složen broj čiji je najmanji prost delilac $p$ iznosi bar $p · p = p²$ (ima bar dva prosta činioca, oba $≥ p$).',
        'Pet različitih prostih brojeva – najmanji izbor je $2, 3, 5, 7, 11$, pa bi neki od brojeva bio bar $11² = 121 > 120$. Kontradikcija – zato $5$ brojeva nije moguće.',
        K('A $4$ jeste: $4, 9, 25, 49$ (kvadrati brojeva $2, 3, 5, 7$) su složeni, ne veći od $120$ i svaka dva su uzajamno prosta. Odgovor: najviše $4$.', [], C.tabela([['p', 2, 3, 5, 7, 11], ['p²', 4, 9, 25, 49, 121]], { sirina: 1.4, istakni: [[1, 5]] })),
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 2,
      'Dat je sedmougao u kome su svi unutrašnji uglovi različiti i tupi. Mere svih uglova su prirodni brojevi deljivi sa $9$. Koje sve vrednosti može imati najveći unutrašnji ugao?',
      ['$162°$ ili $171°$', 'samo $171°$', '$153°$ ili $162°$', 'samo $162°$'],
      [
        'Zbir unutrašnjih uglova sedmougla je $(7 − 2) · 180° = 900°$.',
        'Uglovi su $9 · β_{1} < 9 · β_{2} < … < 9 · β_{7}$, gde su $β_{i}$ prirodni brojevi. Tupi: $90° < 9β_{i} < 180°$, tj. $10 < β_{i} < 20$. Zbir: $β_{1} + … + β_{7} = 100$.',
        'Najmanji mogući zbir sedam različitih brojeva većih od $10$ je $11 + 12 + 13 + 14 + 15 + 16 + 17 = 98$. Nedostaju tačno $2$.',
        K('Ta $2$ možemo dodati (zadržavajući različitost) samo na dva načina: oba na najveći ($17 → 19$) ili po jedan na dva najveća ($16 → 17$, $17 → 18$). Bilo koja druga raspodela bi napravila dva jednaka broja.', [], C.tabela([['β', 11, 12, 13, 14, 15, 16, 17], ['+2', 11, 12, 13, 14, 15, 16, 19], ['+1 +1', 11, 12, 13, 14, 15, 17, 18]], { sirina: [1.8, 1.1], istakni: [[1, 7], [2, 6], [2, 7]] })),
        'Najveći ugao je zato $9 · 19° = 171°$ ili $9 · 18° = 162°$.',
      ]);
    Z(7, 2, 2,
      'Neka je $N = {2^{2025} + 3^{2026}|2^{2026} + 3^{2025}}$. Koji je prirodan broj $n$ takav da je $n < N < n + 1$?',
      ['$2$', '$1$', '$3$', '$0$'],
      [
        'Proverimo $N < 3$: to je isto što i $2^{2025} + 3^{2026} < 3 · 2^{2026} + 3 · 3^{2025} = 3 · 2^{2026} + 3^{2026}$, tj. $2^{2025} < 3 · 2^{2026}$ – očigledno tačno.',
        'Proverimo $N > 2$: to je isto što i $2 · 2^{2026} + 2 · 3^{2025} < 2^{2025} + 3^{2026}$.',
        'Prebacimo: $2^{2027} − 2^{2025} < 3^{2026} − 2 · 3^{2025}$, tj. $2^{2025}(4 − 1) < 3^{2025}(3 − 2)$, odnosno $3 · 2^{2025} < 3^{2025}$, tj. $2^{2025} < 3^{2024}$.',
        'To je tačno: $2^{2025} = 2³ · 2^{2022} < 3² · 3^{2022} = 3^{2024}$, jer je $8 < 9$ i $2^{2022} < 3^{2022}$.',
        'Dakle $2 < N < 3$, pa je $n = 2$.',
      ]);
    Z(7, 3, 3,
      'Trouglovi $ABC$ i $DEC$ su podudarni ($AB = DE$, $AC = DC$, $BC = EC$), pri čemu je $∡CAB = 60°$, $∡ABC = 45°$, $∡ACD = 30°$. Duž $DE$ seče duži $AB$ i $BC$ u tačkama $F$ i $G$, a $M$ je središte duži $FG$. Ako je $CM = √6 cm$, kolika je površina trougla $ABC$?',
      ['$(3 + √3) cm²$', '$(3 + 2√3) cm²$', '$2√6 cm²$', '$(6 + √3) cm²$'],
      [
        'Iz podudarnosti: $∡CDE = 60°$, $∡DEC = 45°$, $∡ACB = ∡DCE = 75°$. Trougao $ACD$ je jednakokrak ($CA = CD$) sa uglom $30°$ kod $C$, pa su uglovi kod $A$ i $D$ po $75°$.',
        'Odatle je $∡DCB = 75° − 30° = 45°$ i $∡BCE = 30°$. Trougao $BCE$ je jednakokrak ($CB = CE$), pa je $∡CBE = ∡CEB = 75°$ i $∡BEF = 75° − 45° = 30°$.',
        K('Iz uglova trouglova $BEF$ i $BEG$ sledi $BE = BF$ i $BE = GE$. Trouglovi $CFB$ i $CGE$ su podudarni (SUS: $CB = CE$, $BF = GE$, uglovi od $45°$), pa je $CF = CG$ i visina iz $C$ pada u središte $M$: $CM ⊥ DE$.', [], G({ A: [0, 0, 225], B: [3.864, 0, -45], C: [1.414, 2.449, 90], D: [1.414, -0.379, -90], E: [4.76, 1.552, 0], F: [2.07, 0, -80], G: [3.208, 0.656, 60], M: [2.639, 0.328, -110] }, [{ p: 'ABC' }, { p: 'DEC', b: 1, prazno: 1 }, { d: 'CM', b: 2 }, { pu: 'CMG' }, { tacka: 'M' }, { u: 'BAC', o: '60°' }, { u: 'CBA', o: '45°' }])),
        'Trougao $CME$ je jednakokrako-pravougli (ugao $45°$ kod $E$): $ME = CM = √6$. Trougao $CMD$ je polovina jednakostraničnog (ugao $60°$ kod $D$): $DM = {CM|√3} = {√6|√3} = √2$.',
        'Zato je $DE = DM + ME = √2 + √6$, a površina trougla $CDE$ (pa i podudarnog $ABC$) je ${DE · CM|2} = {(√2 + √6) · √6|2} = {√{12} + 6|2} = 3 + √3 cm²$.',
        'Usput, obim: $CE = √6 · √2 = 2√3$, $CD = 2 · DM = 2√2$, pa je obim $DE + CE + CD = 3√2 + 2√3 + √6 cm$.',
      ]);
    Z(7, 4, 2,
      'Dešifruj rebus (istim slovima odgovaraju iste cifre, a različitim slovima različite cifre): $LAK² = PRELAK$. Koliko je $LAK$?',
      ['$625$', '$376$', '$125$', '$875$'],
      [
        'Kvadrat broja $LAK$ završava se istim ciframa $LAK$. Poslednja cifra $K$ zato mora biti cifra čiji se kvadrat na nju završava: $0, 1, 5$ ili $6$.',
        '$K = 0$: tada bi se $LAK²$ završavao sa $00$, pa bi i $A = 0 = K$ – nije dozvoljeno. $K = 1$: iz $(10A + 1)²$ dobija se da je $A = 0$, a zatim i $L = 0$ – opet dva ista slova.',
        '$K = 5$: $(10A + 5)² = 100A² + 100A + 25$ uvek se završava sa $25$, pa je $A = 2$. Zatim $(100L + 25)² = 10000L² + 5000L + 625$: prva dva sabirka se završavaju sa $000$, pa se kvadrat završava sa $625$. Te tri cifre moraju biti $L, A, K$, pa je $L = 6$.',
        'Provera: $625² = 390 625$ ✓. Dakle $P = 3$, $R = 9$, $E = 0$, $L = 6$, $A = 2$, $K = 5$ – sve cifre različite.',
        K('$K = 6$: dobija se $A = 7$, $L = 3$, ali $376² = 141 376$ ima $P = E = 1$ – nije dozvoljeno. Jedino rešenje je $625² = 390 625$.', [], C.tabela([['K', '~kraj kvadrata', '~ishod'], [0, '…00', '~A = K, ne'], [1, '…01 → A = L = 0', '~ne'], [5, '625² = 390625', '~DA'], [6, '376² = 141376', '~P = E, ne']], { sirina: [1, 4.4, 2.8], istakni: [[3, 1], [3, 2]] })),
      ]);
    Z(7, 5, 3,
      'Šahovska tabla $8 × 8$ ima $64$ polja. Četiri polja čine centrirani kvadrat ako su centri tih polja temena kvadrata čiji je centar ujedno centar table. Na koliko načina se može odabrati $16$ polja tako da nikoja dva među njima nisu temena istog centriranog kvadrata?',
      ['$4^{16}$', '$16^{4}$', '${64!|16! · 48!}$', '$4 · 16$'],
      [
        'Uzmimo bilo koje polje donje leve četvrtine table ($4 × 4 = 16$ polja) i okrenimo ga oko centra table za $90°$, $180°$ i $270°$. Dobijamo $4$ polja čiji su centri temena centriranog kvadrata.',
        K('Tako se cela tabla deli na $16$ disjunktnih četvorki (svako polje je u tačno jednoj): $16 · 4 = 64$.', [], G({}, [...Array.from({ length: 64 }, (_, i) => C.pr(i % 8, Math.floor(i / 8), 1, 1, 4, (i % 8 + Math.floor(i / 8)) % 2 ? { prazno: 1 } : {})), ...[[0, 0], [7, 0], [7, 7], [0, 7]].map(([x, y]) => C.pr(x, y, 1, 1, 1, { gusto: 1 })), ...[[1, 2], [5, 1], [6, 5], [2, 6]].map(([x, y]) => C.pr(x, y, 1, 1, 2, { gusto: 1 })), { lin: [[0.5, 0.5], [7.5, 0.5], [7.5, 7.5], [0.5, 7.5]], zatv: 1, b: 1, prazno: 1 }, { lin: [[1.5, 2.5], [5.5, 1.5], [6.5, 5.5], [2.5, 6.5]], zatv: 1, b: 2, prazno: 1 }, C.pr(0, 0, 4, 4, 3, { prazno: 1, debljina: 3 })])),
        'Deo a) zadatka: među bilo kojih $17$ polja, po Dirihleovom principu dva su u istoj četvorki – njihovi centri su temena centriranog kvadrata.',
        'Deo b): da nijedna dva od $16$ odabranih polja ne budu u istom centriranom kvadratu, iz svake od $16$ četvorki biramo tačno jedno polje.',
        'Za svaku četvorku imamo $4$ izbora, nezavisno, pa je broj načina $4 · 4 · … · 4 = 4^{16}$ (preko $4$ milijarde).',
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 2,
      'Realni brojevi $x$ i $y$ zadovoljavaju ${x|3y} = {3y|6x − 15y} = {6x − 15y|x}$, a izraz $−4x² + 36y − 8$ ima najveću moguću vrednost. Koliki su $x$ i $y$?',
      ['$x = {3|2}$, $y = {1|2}$', '$x = 3$, $y = 1$', '$x = {1|2}$, $y = {3|2}$', '$x = {3|4}$, $y = {1|4}$'],
      [
        'Deo a): ako je ${a|b} = {b|c} = {c|a}$, onda je $a = b = c$. Unakrsnim množenjem: $a² = bc$, $b² = ca$, $c² = ab$. Iz prve dve: $a² · ca = bc · b²$, tj. $a³ = b³$, pa je $a = b$; slično $b = c$.',
        'Primenimo na $a = x$, $b = 3y$, $c = 6x − 15y$: $x = 3y = 6x − 15y$. Iz $x = 3y$ je i $6x − 15y = 18y − 15y = 3y$ ✓. Dakle uslov je $x = 3y$ (i $x ≠ 0$).',
        'Zamenimo $36y = 12x$: izraz postaje $−4x² + 12x − 8 = −(4x² − 12x + 9) + 1 = −(2x − 3)² + 1$.',
        K('Kvadrat je uvek $≥ 0$, pa je izraz najviše $1$, i to tačno kad je $2x − 3 = 0$, tj. $x = {3|2}$.', [], G({ V: [1.5, 1, 90] }, [{ mreza: [-0.5, 3.5, -4, 2], ose: ['x', 'y'] }, { lin: [[0.5, -3], [0.75, -1.25], [1, 0], [1.25, 0.75], [1.5, 1], [1.75, 0.75], [2, 0], [2.25, -1.25], [2.5, -3]], b: 1, debljina: 3 }, { tacka: 'V', b: 2 }, { tx: '~najveća vrednost 1', at: [1.5, 1.6] }], { bezImena: ['V'] })),
        'Tada je $y = {x|3} = {1|2}$. Najveća vrednost izraza je $1$.',
      ]);
    Z(8, 2, 3,
      'Koliko ima uređenih trojki $(a, b, c)$ prirodnih brojeva iz skupa $\\{1, 2, 3, …, 2026\\}$ takvih da je $a² + b² + c²$ deljivo sa $7$?',
      ['$289³ + 6 · 579³$', '$289³ + 579³$', '$3 · 579³$', '$289³ + 3 · 579³$'],
      [
        K('Ostaci kvadrata pri deljenju sa $7$: za ostatak broja $0, 1, 2, 3, 4, 5, 6$ kvadrat daje redom $0, 1, 4, 2, 2, 4, 1$. Kvadrat daje samo ostatke $0, 1, 2, 4$.', [], C.tabela([['n : 7', 0, 1, 2, 3, 4, 5, 6], ['n² : 7', 0, 1, 4, 2, 2, 4, 1]], { sirina: [2, 1.1] })),
        'Tri ostatka iz $\\{0, 1, 2, 4\\}$ sa zbirom deljivim sa $7$: proverom svih mogućnosti, to su samo $0 + 0 + 0$ i $1 + 2 + 4$ (u bilo kom redosledu).',
        'Slučaj $0, 0, 0$: sva tri broja deljiva su sa $7$. Takvih do $2026$ ima $289$ ($7 · 289 = 2023$), pa trojki ima $289³$.',
        'Slučaj $1, 2, 4$: kvadrat daje ostatak $1$ za brojeve sa ostatkom $1$ ili $6$ ($290 + 289 = 579$ brojeva); ostatak $2$ – ostaci $3$ ili $4$ ($579$); ostatak $4$ – ostaci $2$ ili $5$ ($579$).',
        'Ostatke $1, 2, 4$ raspoređujemo na mesta $a, b, c$ na $3! = 6$ načina, pa ovaj slučaj daje $6 · 579³$ trojki.',
        'Ukupno $289³ + 6 · 579³ = 24 137 569 + 1 164 627 234 = 1 188 764 803$.',
      ]);
    D(8, 3, 3,
      'Neka je $O$ centar opisane kružnice oštrouglog trougla $ABC$ u kome je $AB < AC$, a $AD$ ($D ∈ BC$) simetrala unutrašnjeg ugla kod $A$. Neka su $E$ i $F$ presečne tačke prave $AO$ sa normalama iz $B$ i $C$ na pravu $AD$. Dokaži da su trouglovi $DEF$ i $ABC$ slični.',
      [
        'Neka su uglovi trougla $α, β, γ$.',
        'Pošto je $BE ⊥ AD$, u pravouglom trouglu je $∡ABE = 90° − {α|2}$.',
        'Centralni ugao nad tetivom $AB$ je dvostruki periferijski: $∡AOB = 2γ$. Trougao $AOB$ je jednakokrak ($OA = OB$), pa je $∡OAB = 90° − γ$. Zato je $∡AEB = 180° − (90° − {α|2}) − (90° − γ) = {α|2} + γ$.',
        'Iz trougla $ABD$: $∡ADB = 180° − β − {α|2} = {α|2} + γ$. Kako je $∡ADB = ∡AEB$, tačke $A, E, D, B$ leže na jednoj kružnici (četvorougao $AEDB$ je tetivan).',
        'Iz tetivnosti: $∡AED = 180° − ∡ABD = 180° − β$, pa je $∡DEF = β$. Na isti način (tetivan $ACFD$) je $∡DFE = γ$, pa je $∡EDF = α$.',
        'Trouglovi $DEF$ i $ABC$ imaju jednake uglove, pa su slični.',
      ]);
    Z(8, 4, 3,
      'Pravougaonik $5 × 6$ podeljen je na $8$ pravougaonika čije su stranice paralelne stranicama početnog i imaju dužine prirodne brojeve. Koliko je najmanje, a koliko najviše međusobno podudarnih pravougaonika moguće u takvoj podeli?',
      ['najmanje $2$, najviše $7$', 'najmanje $1$, najviše $8$', 'najmanje $2$, najviše $6$', 'najmanje $3$, najviše $7$'],
      [
        'a) Pretpostavimo da su svih $8$ pravougaonika različiti. Osam različitih pravougaonika najmanjih površina su $1 × 1, 1 × 2, 1 × 3, 1 × 4, 2 × 2, 1 × 5, 1 × 6, 2 × 3$, sa ukupnom površinom $1 + 2 + 3 + 4 + 4 + 5 + 6 + 6 = 31 > 30$. Nemoguće – zato bar dva moraju biti podudarna.',
        K('Primer sa tačno dva podudarna ($1 × 1$ dva puta, ostali $1 × 2, 1 × 3, 1 × 5, 2 × 2, 2 × 3, 2 × 4$ su različiti): najmanje je $2$.', [], G({}, [
          pr(0, 4, 1, 1, 1), pr(1, 4, 1, 1, 1), pr(2, 3, 1, 2, 0), pr(3, 0, 1, 5, 2), pr(4, 3, 2, 2, 3), pr(0, 0, 2, 4, 4), pr(2, 0, 1, 3, 5), pr(4, 0, 2, 3, 0)])),
        'b) Svih $8$ ne mogu biti podudarni: njihova ukupna površina bi bila deljiva sa $8$, a $30$ nije.',
        K('Primer sa $7$ podudarnih: sedam pravougaonika $1 × 4$ i jedan $1 × 2$ ($7 · 4 + 2 = 30$). Najviše je $7$.', [], G({}, [
          pr(0, 4, 4, 1, 0), pr(0, 3, 4, 1, 0), pr(0, 2, 4, 1, 0), pr(0, 1, 4, 1, 0), pr(4, 1, 1, 4, 0), pr(5, 1, 1, 4, 0), pr(0, 0, 4, 1, 0), pr(4, 0, 2, 1, 1)])),
      ]);
    Z(8, 5, 3,
      'Odredi sve proste brojeve $p$ i prirodne brojeve $m$ i $n$ takve da je $p^{n} + 3600 = m²$. Koliko ima takvih trojki $(p, m, n)$?',
      ['$3$', '$1$', '$2$', '$4$'],
      [
        'Prebacimo: $p^{n} = m² − 60² = (m − 60)(m + 60)$. Pošto je $p$ prost, oba činioca su stepeni broja $p$: $m − 60 = p^{a}$, $m + 60 = p^{b}$, $b > a ≥ 0$, $a + b = n$.',
        'Oduzmimo: $120 = p^{b} − p^{a} = p^{a}(p^{b − a} − 1)$.',
        'Ako je $a = 0$: $m = 61$, $p^{b} = 121 = 11²$, pa je $p = 11$, $n = 2$. Provera: $11² + 3600 = 3721 = 61²$ ✓.',
        'Ako je $a ≥ 1$, $p$ deli $120 = 2³ · 3 · 5$, pa je $p ∈ \\{2, 3, 5\\}$. Za $p = 2$: $2^{a} = 8$ i $2^{b − a} − 1 = 15$, pa $a = 3$, $b = 7$, $n = 10$, $m = 68$: $1024 + 3600 = 4624 = 68²$ ✓.',
        'Za $p = 3$: $3^{a} = 3$ i $3^{b − a} = 41$ – nemoguće. Za $p = 5$: $5^{a} = 5$ i $5^{b − a} = 25$, pa $a = 1$, $b = 3$, $n = 4$, $m = 65$: $625 + 3600 = 4225 = 65²$ ✓.',
        K('Rešenja su $(2, 68, 10)$, $(5, 65, 4)$ i $(11, 61, 2)$ – ukupno $3$.', [], C.tabela([['p', 'm', 'n', '~provera'], [2, 68, 10, '1024 + 3600 = 68²'], [5, 65, 4, '625 + 3600 = 65²'], [11, 61, 2, '121 + 3600 = 61²']], { sirina: [1, 1.2, 1.2, 5] })),
      ]);
  },
};
