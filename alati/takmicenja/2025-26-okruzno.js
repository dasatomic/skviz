// Okružno takmičenje iz matematike učenika osnovnih škola, 8. 3. 2026. (DMS)
// https://dms.rs/wp-content/uploads/2026/03/Postavke-i-resenja-okruzno-2026_04ce712d-5b3c-4181-a473-918dafa1366d.pdf
module.exports = {
  godina: '2025/26', nivo: 'okruzno', datum: '8. 3. 2026.',
  zadaci: ({ Z, D, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Sabiranjem četiri od pet razlomaka ${1|2}, {1|3}, {1|6}, {1|9}, {1|18}$ dobija se zbir $1$. Koji od razlomaka nije upotrebljen?',
      ['${1|6}$', '${1|3}$', '${1|9}$', '${1|18}$'],
      [
        'Najmanji zajednički sadržalac imenilaca je $NZS(2, 3, 6, 9, 18) = 18$. Proširimo sve razlomke: ${9|18}, {6|18}, {3|18}, {2|18}, {1|18}$.',
        'Zbir svih pet razlomaka je ${9 + 6 + 3 + 2 + 1|18} = {21|18} = 1{3|18} = 1{1|6}$.',
        K('Zbir četiri razlomka je $1$, pa izostavljeni razlomak mora biti razlika: ${21|18} − 1 = {3|18} = {1|6}$.', [], C.tabela([['~razlomak', '1/2', '1/3', '1/6', '1/9', '1/18'], ['~osamnaestine', 9, 6, 3, 2, 1]], { sirina: [3, 1.3], istakni: [[0, 3], [1, 3]] })),
        'Provera: ${1|2} + {1|3} + {1|9} + {1|18} = {9 + 6 + 2 + 1|18} = {18|18} = 1$ ✓.',
      ]);
    Z(5, 2, 1,
      'Ugao $α$ je pet puta manji od svog suplementnog ugla, a ugao $β$ je za $2026\'$ manji od ugla komplementnog uglu $α$. Kolika je mera zbira $α + β$?',
      ['$56° 14\'$', '$56° 46\'$', '$63° 46\'$', '$26° 14\'$'],
      [
        K('Neka je $γ$ suplementni ugao uglu $α$: $α + γ = 180°$ i $γ = 5α$. Tada je $6α = 180°$, pa je $α = 30°$.', [], G({ O: [0, 0, 270], A: [6, 0, 270], B: [5.2, 3, 60], X: [-6, 0, 270] }, [{ d: 'XA' }, { d: 'OB' }, { u: 'AOB', o: 'α', b: 1 }, { u: 'BOX', o: '5α', b: 2 }], { bezImena: ['O', 'A', 'B', 'X'] })),
        'Komplementni ugao uglu $α$ je $90° − 30° = 60°$.',
        'Pretvorimo minute u stepene: $2026\' = 33 · 60\' + 46\' = 33° 46\'$ (jer je $33 · 60 = 1980$).',
        '$β = 60° − 33° 46\' = 59° 60\' − 33° 46\' = 26° 14\'$.',
        'Traženi zbir: $α + β = 30° + 26° 14\' = 56° 14\'$.',
      ]);
    Z(5, 3, 1,
      'Količnik dva prirodna broja $a$ i $b$ je $32$, a ostatak je $30$. Koji su to brojevi, ako im je zbir $66 888$?',
      ['$a = 64 862$, $b = 2026$', '$a = 64 832$, $b = 2056$', '$a = 64 892$, $b = 1996$', '$a = 66 858$, $b = 30$'],
      [
        'Deljenje sa ostatkom: $a = b · 32 + 30$, pri čemu je ostatak manji od delioca ($30 < b$).',
        'Zamenimo u zbir: $a + b = 32b + 30 + b = 33b + 30 = 66 888$.',
        'Odatle je $33b = 66 858$, pa je $b = 66 858 : 33 = 2026$.',
        '$a = 66 888 − 2026 = 64 862$.',
        'Provera: $2026 · 32 = 64 832$ i $64 832 + 30 = 64 862$ ✓, a ostatak $30$ je manji od $2026$ ✓.',
      ]);
    Z(5, 4, 2,
      'Dat je pravougaonik sa stranicom $AB = 2 m 7 dm$. Pravougaonik se smanjuje ovako: svaka od stranica $AB$ i $CD$ smanji se za jednu trećinu svoje dužine, a svaka od stranica $BC$ i $AD$ za $2 dm$. Tako se dobija pravougaonik $A_{1}B_{1}C_{1}D_{1}$. Operacija se ponovi još dva puta, pa se dobijaju $A_{2}B_{2}C_{2}D_{2}$ i $A_{3}B_{3}C_{3}D_{3}$, čija je površina $32 dm²$. Kolika je površina pravougaonika $ABCD$?',
      ['$270 dm²$', '$216 dm²$', '$108 dm²$', '$324 dm²$'],
      [
        'Radimo u decimetrima: $AB = 2 m 7 dm = 27 dm$.',
        'Svako smanjivanje za trećinu ostavlja ${2|3}$ dužine: $27 → 18 → 12 → 8$. Dakle $A_{3}B_{3} = 8 dm$.',
        'Druga stranica se svaki put smanji za $2 dm$, tri puta ukupno za $6 dm$: $B_{3}C_{3} = BC − 6 dm$.',
        'Iz površine: $8 · B_{3}C_{3} = 32$, pa je $B_{3}C_{3} = 4 dm$.',
        K('Vraćamo se unazad: $BC = 4 + 6 = 10 dm$.', [], G({}, [C.pr(0, 0, 27, 10, 0, { prazno: 1 }), C.pr(0, 0, 18, 8, 1, { prazno: 1 }), C.pr(0, 0, 12, 6, 2, { prazno: 1 }), C.pr(0, 0, 8, 4, 3), { tx: '27 × 10', at: [22, 9] }, { tx: '18 × 8', at: [15, 7] }, { tx: '12 × 6', at: [10, 5] }, { tx: '8 × 4', at: [4, 1.8] }])),
        'Površina: $P = 27 dm · 10 dm = 270 dm²$.',
      ]);
    Z(5, 5, 2,
      'Koliko ima prirodnih brojeva koji nisu veći od $2500$, a deljivi su bar jednim od brojeva $4$ ili $6$?',
      ['$833$', '$1041$', '$625$', '$1249$'],
      [
        'Neka je $A$ skup brojeva do $2500$ deljivih sa $4$: to su $4, 8, …, 2500$, i ima ih $2500 : 4 = 625$.',
        'Neka je $B$ skup brojeva do $2500$ deljivih sa $6$: $6 · 416 = 2496 ≤ 2500 < 2502$, pa ih ima $416$.',
        'Ako samo saberemo $625 + 416$, brojeve deljive i sa $4$ i sa $6$ brojimo dva puta. Broj je deljiv i sa $4$ i sa $6$ tačno kad je deljiv sa $NZS(4, 6) = 12$.',
        'Brojeva do $2500$ deljivih sa $12$ ima $208$ ($12 · 208 = 2496$).',
        K('Po principu uključenja i isključenja: $|A ∪ B| = 625 + 416 − 208 = 833$.', [], (() => { const v = C.venn({ imena: ['4', '6'], presek: true }); return G({}, [...v.e, ...C.upisi(['417'], v.mesta.A), ...C.upisi(['208'], v.mesta.B), ...C.upisi(['208'], v.mesta.AB)]); })()),
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Koje sabirke treba izbrisati u zbiru ${1|2} + {1|4} + {1|6} + {1|8} + {1|10} + {1|12}$ da bi zbir preostalih brojeva bio tačno $1$?',
      ['${1|8}$ i ${1|10}$', '${1|6}$ i ${1|12}$', '${1|4}$ i ${1|12}$', '${1|10}$ i ${1|12}$'],
      [
        'Zajednički imenilac je $NZS(2, 4, 6, 8, 10, 12) = 120$. Razlomci su ${60|120}, {30|120}, {20|120}, {15|120}, {12|120}, {10|120}$.',
        'Zbir svih: ${60 + 30 + 20 + 15 + 12 + 10|120} = {147|120} = 1{27|120}$.',
        K('Treba izbrisati sabirke čiji je zbir ${27|120}$. Među brojiocima $60, 30, 20, 15, 12, 10$ tražimo one sa zbirom $27$: jedino $15 + 12 = 27$.', [], C.tabela([['~sabirak', '1/2', '1/4', '1/6', '1/8', '1/10', '1/12'], ['~u 120-im', 60, 30, 20, 15, 12, 10]], { sirina: [2.6, 1.3], istakni: [[0, 4], [1, 4], [0, 5], [1, 5]] })),
        'To su ${15|120} = {1|8}$ i ${12|120} = {1|10}$. Provera: ${1|2} + {1|4} + {1|6} + {1|12} = {6 + 3 + 2 + 1|12} = 1$ ✓.',
      ]);
    Z(6, 2, 2,
      'Dat je paralelogram $ABCD$. Dijagonala $AC$ deli oštar ugao $BAD$ na dva dela koji se razlikuju za $15°$. Normala iz temena $D$ na stranicu $BC$ seče dijagonalu $AC$ u tački $H$ tako da je $∡AHD = 55°$. Koje mere može imati oštar ugao paralelograma?',
      ['$55°$ ili $85°$', 'samo $55°$', 'samo $85°$', '$70°$ ili $85°$'],
      [
        K('Neka je $E$ podnožje normale iz $D$ na pravu $BC$. Uglovi $AHD$ i $CHE$ su unakrsni, pa je $∡CHE = 55°$.', ['tr']),
        'U trouglu $CHE$ ugao kod $E$ je prav, pa je $∡HCE = 180° − 55° − 90° = 35°$.',
        'Uglovi $∡CAD$ i $∡ACB$ su naizmenični uglovi kod paralelnih pravih $AD$ i $BC$, pa je $∡CAD = ∡ACB = 35°$.',
        'Dijagonala deli ugao $BAD$ na delove $∡CAD = 35°$ i $∡BAC$, koji se razlikuju za $15°$. Ima dve mogućnosti: $∡BAC = 20°$ ili $∡BAC = 50°$.',
        '1) $∡BAC = 20°$: $∡BAD = 55°$, a tupi ugao je $180° − 55° = 125°$.',
        '2) $∡BAC = 50°$: $∡BAD = 85°$, a tupi ugao je $95°$. Oba paralelograma postoje, pa su uglovi $55°, 125°$ ili $85°, 95°$.',
      ],
      G({ A: [0, 0, 225], B: [6.71, 0, -45], C: [9, 3.28, 45], D: [2.29, 3.28, 135], E: [6.8, 0.12, -20], H: [4.59, 1.67, 270] },
        [{ p: 'ABCD' }, { d: 'AC' }, { d: 'DE', b: 1 }, { pu: 'DEC' }, { u: 'AHD', o: '55°' }, { p: 'CHE', id: 'tr', b: 2, k: 1 }]));
    Z(6, 3, 2,
      'Prirodni brojevi $a, b, c$ zadovoljavaju jednakost ${253|228} = 1 + {1|a + {1|b + {1|c}}}$. Koliko je $a + b + c$?',
      ['$20$', '$19$', '$21$', '$18$'],
      [
        'Oduzmimo $1$: ${253|228} − 1 = {25|228}$, pa je ${1|a + {1|b + {1|c}}} = {25|228}$, tj. $a + {1|b + {1|c}} = {228|25} = 9{3|25}$.',
        'Kako je $c ≥ 1$, imamo $b + {1|c} > 1$, pa je razlomak ${1|b + {1|c}}$ između $0$ i $1$. Zato je $a$ ceo deo broja ${228|25}$: $a = 9$.',
        'Ostaje ${1|b + {1|c}} = {3|25}$, tj. $b + {1|c} = {25|3} = 8{1|3}$.',
        'Ponovo: ${1|c}$ je najviše $1$; ako bi bilo $c = 1$, $b$ bi bio $7{1|3}$ – nije prirodan. Zato je $0 < {1|c} < 1$ i $b = 8$, a ${1|c} = {1|3}$, tj. $c = 3$.',
        K('Rešenje je $a = 9$, $b = 8$, $c = 3$, pa je $a + b + c = 20$. Ovaj zapis se zove verižni (neprekidni) razlomak – isto kao Euklidov algoritam za $253$ i $228$.', [], C.tabela([['253 : 228', '= 1, ostatak 25'], ['228 : 25', '= 9, ostatak 3'], ['25 : 3', '= 8, ostatak 1'], ['3 : 1', '= 3']], { sirina: [3, 4], zaglavlje: false, istakni: [[1, 1], [2, 1], [3, 1]] })),
      ]);
    Z(6, 4, 3,
      'Za koje cifre $a$ i $b$ je zbir četvorocifrenog broja čije su cifre $2, 0, 2, a$ i četvorocifrenog broja čije su cifre $b, 0, 2, 6$ deljiv sa $36$?',
      ['$a = 2, b = 4$ ili $a = 6, b = 9$', 'samo $a = 2, b = 4$', '$a = 6, b = 0$ ili $a = 2, b = 4$', '$a = 4, b = 2$ ili $a = 9, b = 6$'],
      [
        'Broj je deljiv sa $36 = 4 · 9$ tačno kad je deljiv i sa $4$ i sa $9$ (jer su $4$ i $9$ uzajamno prosti).',
        K('Deljivost sa $4$ zavisi od poslednje dve cifre zbira. Poslednje dve cifre su zbir „$2a$“ i $26$, tj. $20 + a + 26 = 46 + a$ (do $55$). Među $46, …, 55$ sa $4$ su deljivi $48$ i $52$, pa je $a = 2$ ili $a = 6$.', [], C.tabela([['a', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ['46 + a', 46, 47, 48, 49, 50, 51, 52, 53, 54, 55]], { sirina: [1.8, 1.1], istakni: [[0, 3], [1, 3], [0, 7], [1, 7]] })),
        'Slučaj $a = 2$: zbir je $2022 + b026 = 1000b + 2048$. Pošto $1000$ daje ostatak $1$ pri deljenju sa $9$, a $2048$ ostatak $5$ ($2 + 0 + 4 + 8 = 14 → 5$), treba $b + 5$ da bude deljivo sa $9$, pa je $b = 4$: $2022 + 4026 = 6048 = 36 · 168$ ✓.',
        'Slučaj $a = 6$: zbir je $2026 + b026 = 1000b + 2052$, a $2052$ je deljiv sa $9$ ($2 + 0 + 5 + 2 = 9$), pa i $b$ mora biti deljiv sa $9$. Broj $b026$ je četvorocifren, pa $b ≠ 0$ i $b = 9$: $2026 + 9026 = 11 052 = 36 · 307$ ✓.',
        'Rešenja: $a = 2, b = 4$ i $a = 6, b = 9$.',
      ]);
    D(6, 5, 3,
      'U unutrašnjosti jednakostraničnog trougla $ABC$ određene su tačke $P$ i $Q$ tako da je $∡ABP = 30°$, $∡BAP = 45°$ i $∡QAB = ∡QBA = 15°$. Dokaži da je $AP = AQ$.',
      [
        'Iz $∡QAB = ∡QBA = 15°$ trougao $ABQ$ je jednakokrak, pa je $AQ = BQ$.',
        K('Tačka $Q$ je jednako udaljena od $A$ i $B$, pa leži na simetrali stranice $AB$. U jednakostraničnom trouglu ta simetrala prolazi kroz $C$ i polovi ugao kod $C$, pa je $∡ACQ = 30°$.', ['cq']),
        '$∡CAQ = ∡BAC − ∡BAQ = 60° − 15° = 45°$.',
        K('Uporedimo trouglove $ABP$ i $ACQ$: $AB = AC$ (stranice jednakostraničnog trougla), $∡BAP = ∡CAQ = 45°$ i $∡ABP = ∡ACQ = 30°$. Po stavu USU su podudarni.', ['t1', 't2']),
        'Iz podudarnosti sledi $AP = AQ$ (odgovarajuće stranice).',
      ],
      G({ A: [0, 0, 225], B: [6, 0, -45], C: [3, 5.196, 90], P: [2.196, 2.196, 90], Q: [3, 0.804, -90] },
        [{ p: 'ABC' }, { d: 'AP' }, { d: 'BP' }, { d: 'AQ' }, { d: 'BQ' }, { u: 'PAB', o: '45°' }, { u: 'ABP', o: '30°' },
          { d: 'CQ', isp: 1, id: 'cq', k: 2 }, { p: 'ABP', id: 't1', b: 2, k: 4 }, { p: 'ACQ', id: 't2', b: 4, k: 4 }]));

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Dati su polinomi $A = 5x² − 3x + 9$, $B = 2x² − 5x − 6$, $C = 5x² + x − 3$, $D = −2x + 3$. Koliki je polinom $P = (A − D) − (B − C)$?',
      ['$8x² + 5x + 9$', '$2x² − 7x + 3$', '$8x² − 7x + 9$', '$2x² + 5x + 3$'],
      [
        '$A − D = 5x² − 3x + 9 − (−2x + 3) = 5x² − 3x + 9 + 2x − 3 = 5x² − x + 6$.',
        '$B − C = 2x² − 5x − 6 − (5x² + x − 3) = 2x² − 5x − 6 − 5x² − x + 3 = −3x² − 6x − 3$.',
        K('$P = (5x² − x + 6) − (−3x² − 6x − 3) = 5x² − x + 6 + 3x² + 6x + 3 = 8x² + 5x + 9$.', [], C.tabela([['', 'x²', 'x', '1'], ['A − D', 5, '−1', 6], ['B − C', '−3', '−6', '−3'], ['P', 8, 5, 9]], { sirina: [2, 1.3], istakni: [[3, 1], [3, 2], [3, 3]] })),
        'Najčešća greška je zaboravljen znak: minus ispred zagrade menja znak svakom članu u zagradi.',
      ]);
    Z(7, 2, 2,
      'Simetrala oštrog ugla kod temena $C$ paralelograma $ABCD$ ($AB > AD$) seče pravu $AD$ u tački $E$, pri čemu je $AE = 5 cm$. Kolike su stranice paralelograma ako je njegov obim $50 cm$?',
      ['$15 cm$ i $10 cm$', '$15 cm$ i $5 cm$', '$17,5 cm$ i $7,5 cm$', '$12,5 cm$ i $12,5 cm$'],
      [
        'Prave $AD$ i $BC$ su paralelne, pa su uglovi $∡DEC$ i $∡ECB$ jednaki (naizmenični uglovi).',
        'Kako je $CE$ simetrala ugla $C$, važi $∡ECB = ∡ECD$. Zato je $∡DEC = ∡DCE$, pa je trougao $DCE$ jednakokrak: $DE = DC$.',
        'Pošto je $DC = AB > AD$, tačka $E$ je iza tačke $A$, na produžetku stranice $DA$: $DE = DA + AE = DA + 5$.',
        'Dakle $CD = DA + 5$. Obim: $2(CD + DA) = 2(2DA + 5) = 50$, pa je $2DA + 5 = 25$ i $DA = 10 cm$.',
        'Stranice su $AD = BC = 10 cm$ i $AB = CD = 15 cm$.',
      ],
      G({ A: [0, 0, 225], B: [15, 0, -45], C: [18, 9.54, 45], D: [3, 9.54, 135], E: [-1.5, -4.77, 225] },
        [{ p: 'ABCD' }, { d: 'CE', b: 1 }, { d: 'AE', isp: 1, o: '5 cm' }, { p: 'DCE', b: 2, k: 2 }]));
    Z(7, 3, 2,
      'Kolika je poslednja cifra zbira $1^{2026} + 2^{2025} + 3^{2026} + 4^{2025} + … + 2024^{2025} + 2025^{2026} + 2026^{2025}$? (Neparni brojevi u osnovi imaju izložilac $2026$, a parni $2025$.)',
      ['$7$', '$5$', '$3$', '$0$'],
      [
        'Poslednja cifra stepena zavisi samo od poslednje cifre osnove. Cifre $0, 1, 5, 6$ u bilo kom stepenu daju istu poslednju cifru.',
        'Poslednje cifre stepena ponavljaju se sa periodom $4$ (npr. za $3$: $3, 9, 7, 1, 3, …$). Pošto je $2026 = 4 · 506 + 2$, stepen $2026$ se ponaša kao kvadrat; pošto je $2025 = 4 · 506 + 1$, stepen $2025$ se ponaša kao prvi stepen.',
        'Neparne osnove (na kvadrat): $1 → 1$, $3 → 9$, $5 → 5$, $7 → 9$, $9 → 1$. Parne osnove (prvi stepen): $2 → 2$, $4 → 4$, $6 → 6$, $8 → 8$, $0 → 0$.',
        K('U svakoj desetici zbir poslednjih cifara je $1 + 2 + 9 + 4 + 5 + 6 + 9 + 8 + 1 + 0 = 45$, tj. završava se cifrom $5$.', [], C.tabela([['~cifra osnove', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0], ['~izložilac', 2026, 2025, 2026, 2025, 2026, 2025, 2026, 2025, 2026, 2025], ['~poslednja cifra', 1, 2, 9, 4, 5, 6, 9, 8, 1, 0]], { sirina: [3.2, 1.3] })),
        'Od $1$ do $2020$ ima $202$ desetice: $202 · 5 = 1010$ – poslednja cifra $0$.',
        'Ostaju sabirci od $2021$ do $2026$, sa poslednjim ciframa $1, 2, 9, 4, 5, 6$; zbir $27$. Tražena poslednja cifra je $7$.',
      ]);
    Z(7, 4, 3,
      'Tačka $M$ pripada unutrašnjosti ugla od $60°$ i udaljena je od njegovih krakova $2 cm$, odnosno $5 cm$. Koliko je rastojanje tačke $M$ od temena tog ugla?',
      ['$2√{13} cm$', '$√{29} cm$', '$2√7 cm$', '$7 cm$'],
      [
        K('Neka je ugao $aOb$, a $A$ i $B$ podnožja normala iz $M$ na krake: $MA = 5 cm$ (na $Oa$) i $MB = 2 cm$ (na $Ob$). Neka prava $MA$ seče krak $Ob$ u tački $C$.', ['mc']),
        'Uglovi $∡AOB = 60°$ i $∡CMB$ imaju normalne krake, pa je $∡CMB = 60°$. Pravougli trougao $MBC$ ima uglove $30°$ i $60°$ – polovina je jednakostraničnog trougla, pa je $MC = 2 · MB = 4 cm$.',
        '$AC = AM + MC = 5 + 4 = 9 cm$. Trougao $OAC$ je takođe polovina jednakostraničnog trougla (uglovi $60°$ kod $O$ i $30°$ kod $C$), a $AC$ je njegova duža kateta: $AC = {OC√3|2}$.',
        'Iz $9 = {OC√3|2}$ sledi $OC = {18|√3} = 6√3 cm$, a kraća kateta $OA = {OC|2} = 3√3 cm$.',
        'Pitagorina teorema za pravougli trougao $OAM$: $OM² = OA² + AM² = 27 + 25 = 52$, pa je $OM = √{52} = 2√{13} cm ≈ 7,2 cm$.',
      ],
      G({ O: [0, 0, 225], A: [5.196, 0, -90], M: [5.196, 5, 0], B: [3.464, 6, 135], C: [5.196, 9, 45], a: [9, 0], b: [5.6, 9.7] },
        [{ d: 'Oa' }, { d: 'Ob' }, { tacka: 'M' }, { d: 'MA', o: '5' }, { d: 'MB', o: '2' }, { pu: 'OAM' }, { pu: 'OBM' }, { u: 'AOB', o: '60°' },
          { d: 'MC', id: 'mc', b: 1, k: 1 }, { d: 'OM', isp: 1, b: 2, k: 5 }]));
    Z(7, 5, 2,
      'Koliko ima petocifrenih prirodnih brojeva deljivih sa $3$, čije su sve cifre međusobno različite i pripadaju skupu $\\{0, 1, 2, 7, 8, 9\\}$?',
      ['$216$', '$120$', '$600$', '$240$'],
      [
        'Na raspolaganju je $6$ cifara, a koristimo $5$ različitih – dakle izostavljamo tačno jednu.',
        'Zbir svih šest cifara je $0 + 1 + 2 + 7 + 8 + 9 = 27$, deljiv sa $3$. Broj je deljiv sa $3$ kad mu je zbir cifara deljiv sa $3$, pa izostavljena cifra mora biti deljiva sa $3$: to je $0$ ili $9$.',
        'Bez nule (cifre $1, 2, 7, 8, 9$): sve permutacije su ispravni petocifreni brojevi: $5 · 4 · 3 · 2 · 1 = 120$.',
        'Bez devetke (cifre $0, 1, 2, 7, 8$): prva cifra ne sme biti $0$, pa za nju ima $4$ izbora, a ostale $4$ cifre raspoređujemo na $4 · 3 · 2 · 1$ načina: $4 · 24 = 96$.',
        K('Ukupno: $120 + 96 = 216$.', [], C.tabela([['~izostavljena', '~cifre', '~prva cifra', '~brojeva'], ['0', '1, 2, 7, 8, 9', '5 izbora', '5 · 4 · 3 · 2 · 1 = 120'], ['9', '0, 1, 2, 7, 8', '4 izbora', '4 · 4 · 3 · 2 · 1 = 96']], { sirina: [2.6, 3, 2.4, 4.6] })),
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 1,
      'Sanja, Ana i Bojana štedele su za ekskurziju. Bojana je uštedela $1600$ dinara više od Ane, a Sanja $45%$ manje nego što bi Ana imala kada bi joj Bojana dala polovinu svog iznosa. Ukupno su uštedele $24 640$ dinara. Koliko je uštedela Sanja?',
      ['$7040$ dinara', '$8000$ dinara', '$9600$ dinara', '$5760$ dinara'],
      [
        'Neka je Ana uštedela $x$ dinara. Bojana ima $x + 1600$.',
        'Kad bi Bojana dala Ani polovinu svog novca, Ana bi imala $x + {x + 1600|2} = {3|2}x + 800$.',
        'Sanja ima $45%$ manje, tj. $55%$ tog iznosa: $0,55 · ({3|2}x + 800) = {33|40}x + 440$.',
        'Ukupno: $x + x + 1600 + {33|40}x + 440 = 24 640$, pa je ${113|40}x = 22 600$ i $x = 8000$.',
        K('Ana: $8000$, Bojana: $9600$, Sanja: ${33|40} · 8000 + 440 = 6600 + 440 = 7040$ dinara. Provera: $8000 + 9600 + 7040 = 24 640$ ✓.', [], C.stubici([['Ana', 8000], ['Bojana', 9600], ['Sanja', 7040]], { korakY: 2000, maxY: 10000, vrednosti: true })),
      ]);
    Z(8, 2, 2,
      'U pravouglom koordinatnom sistemu $xOy$ dat je jednakokraki trougao $OAB$ sa uglom $∡AOB = 120°$, tačkom $A(0, 8)$ i tačkom $B$ u trećem kvadrantu. Koje su koordinate tačke $B$ i koliko je rastojanje tačke $O$ od prave $AB$?',
      ['$B(−4√3, −4)$, rastojanje $4$', '$B(−4, −4√3)$, rastojanje $4$', '$B(−4√3, −4)$, rastojanje $8$', '$B(−4√3, −4)$, rastojanje $4√3$'],
      [
        'Ugao kod $O$ je tup ($120°$), pa su kraci $OA$ i $OB$: $OB = OA = 8$.',
        'Neka je $X_{B}$ podnožje normale iz $B$ na $x$-osu. Ugao između $OB$ i negativnog dela $x$-ose je $120° − 90° = 30°$. Trougao $OX_{B}B$ je polovina jednakostraničnog trougla stranice $8$.',
        'Kateta naspram $30°$ je $BX_{B} = 4$, a druga kateta $OX_{B} = {8√3|2} = 4√3$. Tačka je u trećem kvadrantu, pa je $B(−4√3, −4)$.',
        'Usput (delovi b): $AB² = (4√3)² + (8 + 4)² = 48 + 144 = 192$, $AB = 8√3$; obim $16 + 8√3$, površina $P = {OA · |x_{B}||2} = {8 · 4√3|2} = 16√3$.',
        'Rastojanje $O$ od prave $AB$ je visina $h$ na $AB$: ${AB · h|2} = 16√3$, pa je $h = {32√3|8√3} = 4$.',
        'Kraće: u jednakokrakom trouglu uglovi na osnovici su ${180° − 120°|2} = 30°$, pa je $h = {OA|2} = 4$ (kateta naspram $30°$).',
      ],
      G({ O: [0, 0, 45], A: [0, 8, 0], B: [-6.93, -4, 225], X: [-6.93, 0, 90] },
        [{ mreza: [-8, 2, -5, 9], ose: ['x', 'y'] }, { p: 'OAB' }, { u: 'AOB', o: '120°' }, { d: 'BX', isp: 1, k: 2 }]));
    Z(8, 3, 2,
      'Koliko ima različitih celih brojeva $n$ za koje je broj ${2n² − 2026|n + 3}$ takođe ceo?',
      ['$16$', '$8$', '$12$', '$32$'],
      [
        'Podelimo brojilac imeniocem (izdvojimo ceo deo). Kako je $(n + 3)(2n − 6) = 2n² − 6n + 6n − 18 = 2n² − 18$, imamo $2n² − 2026 = (n + 3)(2n − 6) − 2008$.',
        'Zato je ${2n² − 2026|n + 3} = 2n − 6 − {2008|n + 3}$. Broj $2n − 6$ je uvek ceo, pa je ceo ceo izraz tačno kad je ${2008|n + 3}$ ceo, tj. kad je $n + 3$ (celobrojni) delilac broja $2008$.',
        'Rastavimo: $2008 = 8 · 251 = 2³ · 251$ ($251$ je prost). Broj pozitivnih delilaca je $(3 + 1) · (1 + 1) = 8$: $1, 2, 4, 8, 251, 502, 1004, 2008$.',
        K('Sa negativnim deliocima ima ih $16$, i svaki delilac $d$ daje tačno jedan broj $n = d − 3$: $n ∈ \\{−2011, −1007, −505, −254, −11, −7, −5, −4, −2, −1, 1, 5, 248, 499, 1001, 2005\\}$.', [], C.tabela([['n + 3', 1, 2, 4, 8, 251, 502, 1004, 2008], ['n', '−2', '−1', 1, 5, 248, 499, 1001, 2005], ['n + 3', '−1', '−2', '−4', '−8', '−251', '−502', '−1004', '−2008'], ['n', '−4', '−5', '−7', '−11', '−254', '−505', '−1007', '−2011']], { sirina: [1.6, 1.5] })),
        'Odgovor: $16$ celih brojeva. (Proveri jedan: $n = 5$: ${50 − 2026|8} = {−1976|8} = −247$ ✓.)',
      ]);
    Z(8, 4, 3,
      'Pravilna šestostrana piramida $SABCDEF$ (vrh $S$) ima osnovnu ivicu $a = 6 cm$, a sve bočne strane nagnute su prema ravni osnove pod uglom od $60°$. Na bočnoj ivici $SF$ izabrana je tačka $G$ tako da je $SG : GF = 2 : 1$. Kolika je zapremina piramide $CDFG$?',
      ['$18√3 cm³$', '$54√3 cm³$', '$36√3 cm³$', '$9√3 cm³$'],
      [
        'Neka je $O$ centar osnove (podnožje visine $SO$) i $M$ središte ivice $BC$. Ugao bočne strane prema osnovi je $∡OMS = 60°$.',
        '$OM$ je visina jednakostraničnog trougla $OBC$ stranice $6$: $OM = {6√3|2} = 3√3 cm$.',
        'Trougao $SOM$ je polovina jednakostraničnog trougla stranice $2 · OM = 6√3$, a $SO$ je njegova visina: $SO = {6√3 · √3|2} = 9 cm$.',
        K('Osnova nove piramide je trougao $CDF$. Njegova stranica $CF$ je duža dijagonala šestougla, $CF = 2a = 12 cm$, a visina iz $D$ na $CF$ je visina trougla $OCD$: ${6√3|2} = 3√3 cm$. Površina: $B = {12 · 3√3|2} = 18√3 cm²$.', [], C.piramida(6, 6, 9, [{ p: 'CDF', b: 1 }, { d: 'SO', isp: 1, b: 2 }, { d: 'CF', b: 1 }])),
        'Ravan $FSC$ sadrži visinu $SO$, pa je normalna na osnovu; podnožje $N$ visine iz $G$ leži na $CF$. Trouglovi $FGN$ i $FSO$ su slični, a $FG : FS = 1 : 3$, pa je $GN = {SO|3} = 3 cm$.',
        'Zapremina: $V = {1|3} · B · GN = {1|3} · 18√3 · 3 = 18√3 cm³$.',
      ]);
    Z(8, 5, 2,
      'Na koliko načina je moguće rasporediti $12$ učenika – $3$ iz škole $A$, $2$ iz škole $B$, $1$ iz škole $C$ i $6$ iz škole $D$ – u $3$ različita autobusa, po $4$ učenika u svakom, ako nikoja dva učenika iz različitih škola $A$, $B$, $C$ ne smeju biti u istom autobusu?',
      ['$360$', '$60$', '$120$', '$720$'],
      [
        'Učenici iz $A$, $B$ i $C$ ne smeju se mešati, a ima ih iz tri škole i tri autobusa: zato su svi iz $A$ u jednom, svi iz $B$ u drugom i učenik iz $C$ u trećem autobusu.',
        'Autobuse ovim grupama dodeljujemo na $3! = 3 · 2 · 1 = 6$ načina.',
        'Sada popunjavamo do $4$ učenika učenicima iz $D$: grupi $A$ treba $1$, grupi $B$ treba $2$, a grupi $C$ treba $3$ – ukupno baš $6$.',
        K('Za grupu $A$ biramo $1$ od $6$: $6$ načina. Za grupu $B$ biramo $2$ od preostalih $5$: ${5 · 4|2} = 10$ načina. Preostala $3$ idu sa učenikom iz $C$ – $1$ način.', [], C.tabela([['~autobus', '~škola', '~dopuna iz D', '~načina'], ['1.', 'A (3)', '1', '6'], ['2.', 'B (2)', '2', '10'], ['3.', 'C (1)', '3', '1']], { sirina: [2.2, 2, 2.8, 2] })),
        'Ukupno: $6 · 6 · 10 = 360$ načina.',
      ]);
  },
};
