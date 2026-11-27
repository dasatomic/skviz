// Okružno takmičenje iz matematike učenika osnovnih škola, 21. 3. 2021. (DMS)
// https://dms.rs/wp-content/uploads/2021/04/Resenja-zadataka.pdf
module.exports = {
  godina: '2020/21', nivo: 'okruzno', datum: '21. 3. 2021.',
  zadaci: ({ Z, G, K, ...C }) => {
    // ───────── V razred ─────────
    Z(5, 1, 1,
      'Za sva obdaništa u gradu treba dnevno obezbediti $120 kg$ pomorandži, $260 kg$ banana i $380 kg$ jabuka, tako da svako obdanište dobije iste (cele) količine od svake vrste. a) Koliko najviše obdaništa može biti? b) Koliko limuna treba, ako se troši pet puta manje limuna nego pomorandži i jabuka ukupno?',
      ['a) $20$, b) $100 kg$', 'a) $10$, b) $100 kg$', 'a) $20$, b) $152 kg$', 'a) $40$, b) $50 kg$'],
      [
        'Broj obdaništa mora deliti i $120$, i $260$, i $380$ – najviše ih je $NZD(120, 260, 380)$.',
        K('$120 = 2³ · 3 · 5$, $260 = 2² · 5 · 13$, $380 = 2² · 5 · 19$. Zajedničko: $2² · 5 = 20$.', [], C.tabela([['~voće', '~ukupno', '~po obdaništu'], ['~pomorandže', 120, 6], ['~banane', 260, 13], ['~jabuke', 380, 19]])),
        'b) Pomorandže i jabuke zajedno: $120 + 380 = 500 kg$; limuna pet puta manje: $500 : 5 = 100 kg$.',
      ]);
    Z(5, 2, 1,
      'Ugao $α$ je veći od svog komplementnog ugla tačno za onoliko za koliko je manji od svog suplementnog ugla. Koliki je ugao $α$?',
      ['$67° 30\'$', '$60°$', '$45°$', '$72°$'],
      [
        'Komplementni ugao je $90° − α$, suplementni $180° − α$.',
        'Uslov: $α − (90° − α) = (180° − α) − α$, tj. $2α − 90° = 180° − 2α$.',
        '$4α = 270°$, pa je $α = 67,5° = 67° 30\'$.',
        'Provera: komplementni $22° 30\'$ – razlika $45°$; suplementni $112° 30\'$ – razlika $45°$ ✓.',
      ]);
    Z(5, 3, 2,
      'Jedan peščani sat meri $10$ minuta, a drugi $7$ minuta. Kako se pomoću njih mogu izmeriti tačno $23$ minuta?',
      ['Pokrenemo oba; kad iscuri sat od $7$ min, u većem ostaje pesak za $3$ min – merimo tih $3$ min, pa još dva puta po $10$ min', 'Tri puta merimo satom od $7$ min, pa još $2$ min satom od $10$ min', 'Dva puta merimo satom od $10$ min, pa $3$ min satom od $7$ min', 'To nije moguće sa ova dva sata'],
      [
        'Ideja: $23 = 3 + 10 + 10$. Dvaput po $10$ minuta nije problem, ali kako dobiti $3$ minuta?',
        K('$3 = 10 − 7$: pokrenemo oba sata istovremeno. Kad istekne pesak iz manjeg (posle $7$ min), u većem ostaje peska tačno za $3$ minuta. Tada počinjemo merenje.', [], G({}, [C.pr(0, 2, 10, 1, 0, { prazno: 1 }), C.pr(0, 2, 7, 1, 2, { gusto: 1 }), { tx: '~10 min', at: [5, 3.6] }, C.pr(0, 0, 7, 1, 1, { gusto: 1 }), { tx: '~7 min', at: [3.5, -0.6] }, C.pr(7, 2, 3, 1, 3, { gusto: 1 }), { tx: '~3 min', at: [8.5, 3.6] }])),
        'Merimo: preostala $3$ min iz većeg sata, zatim ga okrenemo i izmerimo $10$ min, pa još jednom $10$ min: $3 + 10 + 10 = 23$.',
        'Pazi: „$2$ min satom od $10$“ i slično se ne mogu izmeriti direktno – peščani sat meri samo svoje celo vreme ili ostatak koji smo stvorili.',
      ]);
    Z(5, 4, 2,
      'Ana je zapisala sve parne brojeve od $2$ do $2022$, redom, jedan za drugim bez razdvajanja. Koja cifra je na $2021$. mestu?',
      ['$1$', '$2$', '$8$', '$0$'],
      [
        K('Prebrojimo cifre: jednocifreni parni ($2, 4, 6, 8$) – $4$ cifre; dvocifreni ($10$–$98$, njih $45$) – $90$ cifara; trocifreni ($100$–$998$, njih $450$) – $1350$ cifara.', [], C.tabela([['~parni brojevi', '2–8', '10–98', '100–998'], ['~koliko', 4, 45, 450], ['~cifara', 4, 90, 1350]])),
        'Ukupno $4 + 90 + 1350 = 1444$ cifre. Do $2021$. mesta treba još $2021 − 1444 = 577$ cifara iz četvorocifrenih.',
        '$577 = 4 · 144 + 1$: posle $144$ cela četvorocifrena parna broja ($1000, 1002, …, 1286$) $2021$. mesto je prva cifra $145$. broja.',
        '$145$. parni četvorocifreni je $1000 + 2 · 144 = 1288$, a njegova prva cifra je $1$.',
      ]);
    Z(5, 5, 2,
      'Koliki je najveći zajednički delilac brojeva $n = 111111$ (šest jedinica) i $m = 111111111$ (devet jedinica)?',
      ['$111$', '$11$', '$3$', '$1001$'],
      [
        'Šest jedinica: $111111 = 111 · 1001$. Devet jedinica: $111111111 = 111 · 1001001$.',
        'Dakle $111$ je zajednički delilac. Da li ima većeg? Treba proveriti da li $1001$ i $1001001$ imaju zajednički činilac.',
        K('$1001 = 7 · 11 · 13$, a $1001001$ nije deljiv ni sa $7$ ni sa $11$ ni sa $13$ ($1001001 = 1001 · 1000 + 1$ daje ostatak $1$ pri deljenju svakim od njih).', [], C.tabela([['n', '111 · 1001', '111 · 7 · 11 · 13'], ['m', '111 · 1001001', '111 · 3 · 333667']])),
        '$NZD(n, m) = 111$. (Opšte pravilo: broj od $a$ jedinica i broj od $b$ jedinica imaju za NZD broj od $NZD(a, b)$ jedinica – ovde $NZD(6, 9) = 3$.)',
      ]);

    // ───────── VI razred ─────────
    Z(6, 1, 1,
      'Koji racionalan broj sa imeniocem $7$ je manji od $−{5|19}$, a veći od $−{6|19}$?',
      ['$−{2|7}$', '$−{1|7}$', '$−{3|7}$', '$−{5|7}$'],
      [
        'Tražimo $x$ tako da $−{6|19} < {x|7} < −{5|19}$. Zajednički imenilac $133$: $−{42|133} < {19x|133} < −{35|133}$.',
        '$−42 < 19x < −35$. Jedini ceo broj: $x = −2$ ($19 · (−2) = −38$).',
        K('Traženi broj je $−{2|7} ≈ −0,286$, između $−0,316$ i $−0,263$.', [], C.brojevna(-45, -30, [[-42, '−6/19', 4], [-38, '−2/7', 1], [-35, '−5/19', 4]], { podela: 1, svaki: 5, e: [{ tx: '~(u 133-im)', at: [-37.5, -2.6] }] })),
      ]);
    Z(6, 2, 2,
      'Filip je napisao nekoliko različitih prirodnih brojeva čiji je zbir $100$, koristeći pri tome samo dve različite cifre. Koliko je najviše brojeva mogao da napiše?',
      ['$5$', '$6$', '$4$', '$7$'],
      [
        'Brojevi su manji od $100$ (zbir je $100$), pa su jedno- ili dvocifreni. Sa ciframa $a, b$ postoji tačno $6$ takvih: $a, b, aa, ab, ba, bb$.',
        'Zbir svih šest: $a + b + 11a + (10a + b) + (10b + a) + 11b = 23(a + b)$ – a $100$ nije deljiv sa $23$. Dakle $6$ brojeva ne može.',
        K('Pet može, npr. sa ciframa $1$ i $6$: $1 + 6 + 11 + 16 + 66 = 100$.', [], C.tabela([['~brojevi', 1, 6, 11, 16, 66, '~zbir'], ['', '', '', '', '', '', 100]], { zaglavlje: false })),
      ]);
    Z(6, 3, 2,
      'U kutiji su plave, zelene i crvene kuglice. Da bismo bili sigurni da imamo sve tri boje, treba izvući $11$ kuglica; da bismo imali bar jednu zelenu – $10$; a bar jednu crvenu – $8$. Koliko ima kuglica svake boje?',
      ['$3$ plave, $4$ zelene, $6$ crvenih', '$4$ plave, $3$ zelene, $6$ crvenih', '$3$ plave, $6$ zelenih, $4$ crvene', '$2$ plave, $5$ zelenih, $6$ crvenih'],
      [
        'Neka je $p$ plavih, $z$ zelenih, $c$ crvenih. „$8$ da bude crvena“ znači: ne-crvenih ima tačno $7$: $p + z = 7$.',
        '„$10$ da bude zelena“: ne-zelenih ima $9$: $p + c = 9$.',
        '„$11$ za sve tri boje“: najveći broj kuglica u dve boje je $10$. Najveći par je crvene + zelene (jer je plavih najmanje): $c + z = 10$.',
        K('Saberemo: $2(p + z + c) = 26$, pa ukupno $13$. Odatle $p = 3$, $z = 4$, $c = 6$.', [], C.stubici([['~plave', 3], ['~zelene', 4], ['~crvene', 6]], { korakY: 2, maxY: 6, vrednosti: true })),
      ]);
    Z(6, 4, 2,
      'Odeljenje je na biciklističkoj turi napravilo prvu pauzu posle ${2|7}$ planiranog puta. Posle još $54 km$ napravili su drugu pauzu; tada su prešli ${7|11}$ puta. Koliko kilometara je iznosio planirani put?',
      ['$154 km$', '$189 km$', '$132 km$', '$231 km$'],
      [
        'Između pauza prešli su ${7|11} − {2|7}$ puta: zajednički imenilac $77$: ${49|77} − {22|77} = {27|77}$.',
        K('${27|77}$ puta je $54 km$, pa je ${1|77}$ puta $2 km$, a ceo put $154 km$.', [], G({}, [C.pr(0, 0, 22, 4, 1, { gusto: 1 }), C.pr(22, 0, 27, 4, 2, { gusto: 1 }), C.pr(49, 0, 28, 4, 4, { prazno: 1 }), { tx: '22/77', at: [11, 5] }, { tx: '27/77 = 54 km', at: [35.5, 5] }, { tx: '~2/7 puta', at: [11, -1.6] }, { tx: '~7/11 = 49/77 puta', at: [24.5, -3.4] }])),
        'Provera: ${2|7} · 154 = 44$, ${7|11} · 154 = 98$, $98 − 44 = 54$ ✓.',
      ]);
    Z(6, 5, 2,
      'Simetrala ugla kod temena $A$ trougla $ABC$ seče $BC$ u tački $D$. Tačka $E$ je na stranici $AB$, pri čemu je $∡ADB = 94°$, $∡ACE = 38°$ i $∡CEB = 84°$. Koja je stranica trougla najkraća, a koja najduža?',
      ['najkraća $BC$, najduža $AB$', 'najkraća $AC$, najduža $AB$', 'najkraća $BC$, najduža $AC$', 'najkraća $AB$, najduža $BC$'],
      [
        'Ugao $CEB$ je spoljašnji ugao trougla $AEC$: $α + 38° = 84°$, pa je $α = 46°$.',
        'U trouglu $ABD$: $β = 180° − 94° − {α|2} = 180° − 94° − 23° = 63°$.',
        '$γ = 180° − 46° − 63° = 71°$.',
        K('Najmanji ugao $α$ – naspram njega najkraća stranica $BC$; najveći ugao $γ$ – naspram njega najduža stranica $AB$.', [], G({ A: [0, 0, 225], B: [6, 0, -45], C: [3.928, 4.067, 90], D: [4.933, 2.094, 0], E: [3.5, 0, -90] },
          [{ p: 'ABC' }, { d: 'AD', b: 1 }, { d: 'CE', b: 2 }, { u: 'BAC', o: '46°' }, { u: 'CBA', o: '63°' }, { u: 'ACB', o: '71°' }])),
      ]);

    // ───────── VII razred ─────────
    Z(7, 1, 1,
      'Uporedi vrednost izraza ${36 · (−6)² · 3^{6}|12³ · 3^{5}}$ i broj $√{{79|25}}$.',
      ['Izraz je veći', 'Broj $√{{79|25}}$ je veći', 'Jednaki su', 'Izraz je negativan, pa je manji'],
      [
        'Brojilac: $36 · 36 · 3^{6} = 6^{4} · 3^{6} = 2^{4} · 3^{10}$. Imenilac: $12³ · 3^{5} = 2^{6} · 3³ · 3^{5} = 2^{6} · 3^{8}$.',
        'Izraz: ${3²|2²} = {9|4}$.',
        'Uporedimo kvadrate (oba broja su pozitivna): $({9|4})² = {81|16}$ i ${79|25}$.',
        '${81|16} > 5$, a ${79|25} < 4$, pa je ${81|16} > {79|25}$ (ili unakrsno: $81 · 25 = 2025 > 16 · 79 = 1264$). Izraz je veći.',
      ]);
    Z(7, 2, 2,
      'Šesnaest radnika je za $5$ dana završilo ${4|9}$ posla. Koliko radnika treba još angažovati da bi preostali deo posla, radeći istim tempom, završili za $4$ dana?',
      ['$9$', '$25$', '$4$', '$16$'],
      [
        'Dnevno $16$ radnika uradi ${4|9} : 5 = {4|45}$ posla, tj. jedan radnik ${1|180}$ posla dnevno.',
        'Preostalo je ${5|9}$ posla, za $4$ dana – dnevno ${5|36}$ posla.',
        K('Potrebno radnika: ${5|36} : {1|180} = {5 · 180|36} = 25$.', [], C.tabela([['', '~radnika', '~dana', '~posla'], ['~do sada', 16, 5, '4/9'], ['~dalje', 'x', 4, '5/9']])),
        'Treba angažovati još $25 − 16 = 9$ radnika.',
      ]);
    Z(7, 3, 2,
      'U jednakokrako-pravougli trougao $ABC$ sa katetama $AC = BC = 1 cm$ upisana je polukružnica sa centrom $O$ na kateti $AC$, koja sadrži teme $C$ i dodiruje hipotenuzu $AB$. Koliki je njen poluprečnik?',
      ['$(√2 − 1) cm$', '${1|2} cm$', '${√2|2} cm$', '$(2 − √2) cm$'],
      [
        K('Podelimo trougao dužom $OB$ na trouglove $AOB$ i $OCB$. Visina trougla $OCB$ na $BC$ je $OC = r$, a visina trougla $AOB$ na $AB$ je $r$ (poluprečnik normalan na tangentu).', ['r']),
        'Površine: $P_{AOB} = {AB · r|2} = {√2 r|2}$, $P_{OCB} = {1 · r|2}$, a $P_{ABC} = {1|2}$.',
        '${√2 r|2} + {r|2} = {1|2}$, tj. $r(√2 + 1) = 1$.',
        '$r = {1|√2 + 1} = √2 − 1 ≈ 0,41 cm$ (racionalisanje: $(√2 + 1)(√2 − 1) = 1$).',
      ],
      G({ C: [0, 0, 225], A: [5, 0, -45], B: [0, 5, 135], O: [2.071, 0, -90], T: [3.536, 1.464, 30] },
        [{ p: 'ABC' }, { pu: 'ACB' }, { l: 'O', r: 2.071, od: 0, do: 180, b: 1 }, { tacka: 'O' }, { d: 'OT', id: 'r', b: 2, k: 1 }, { d: 'OB', isp: 1, k: 1 }], { bezImena: ['T'] }));
    Z(7, 4, 3,
      'U trapezu $ABCD$ kraci su $AD = 3 cm$ i $BC = 4 cm$, kraća osnovica $DC = 4 cm$, a dijagonala $AC = 4 cm$. Kolika je dijagonala $BD$?',
      ['$√{55} cm$', '$7 cm$', '$√{41} cm$', '$5 cm$'],
      [
        K('Neka je $P$ tačka prave $DC$ (iza $C$) sa $CP = 4 cm$. Tada je $CD = CB = CP = 4$: tačke $D$, $B$, $P$ su na kružnici sa centrom $C$, a $DP$ je njen prečnik.', ['k']),
        'Ugao nad prečnikom je prav: $∡DBP = 90°$ (zvanično: iz jednakokrakih trouglova $BCD$ i $BCP$, $∡DBP = {180°|2}$).',
        'Trouglovi $DAC$ i $PBC$ su podudarni ($CA = CB$, $CD = CP$, i uglovi kod $C$ jednaki zbog paralelnosti), pa je $PB = AD = 3 cm$.',
        'Pitagora u trouglu $DBP$: $BD = √{DP² − PB²} = √{64 − 9} = √{55} cm$.',
      ],
      G({ A: [1.125, 0, 225], B: [6.875, 0, -45], C: [4, 2.781, 90], D: [0, 2.781, 135], P: [8, 2.781, 45] },
        [{ p: 'ABCD' }, { d: 'AC', isp: 1 }, { d: 'BD', b: 1 }, { d: 'CP', isp: 1, k: 1 }, { kr: 'C', r: 4, b: 4, isp: 1, k: 1, id: 'k' }, { d: 'BP', b: 2, k: 2 }, { pu: 'DBP', k: 2 }]));
    Z(7, 5, 2,
      'Na policu treba rasporediti devet različitih knjiga označenih brojevima od $1$ do $9$. Na koliko načina se to može uraditi tako da knjige $1$ i $2$ NE budu jedna do druge?',
      ['$7 · 8!$', '$2 · 8!$', '$9! − 8!$', '$8 · 8!$'],
      [
        'a) Ako su $1$ i $2$ susedne, posmatramo ih kao jednu „knjigu“: $8$ celina se raspoređuje na $8!$ načina, a unutar para $2$ načina – ukupno $2 · 8!$.',
        'Svih rasporeda je $9! = 9 · 8!$.',
        K('b) Nesusedne: $9 · 8! − 2 · 8! = 7 · 8! = 282 240$.', [], C.tabela([['~svi', '~susedne', '~nesusedne'], ['9 · 8!', '2 · 8!', '7 · 8!']])),
      ]);

    // ───────── VIII razred ─────────
    Z(8, 1, 1,
      'Za osnovu betonskog stuba (oblika prave prizme) treba iskopati jamu duboku $1,5 m$; osnova jame je trapez sa osnovicama $8 m$ i $4 m$ i visinom $3 m$. Za koliko sati će jamu iskopati tri radnika ako svaki iskopa $0,75 m³$ za $1$ čas?',
      ['$12$ sati', '$9$ sati', '$36$ sati', '$18$ sati'],
      [
        K('Površina osnove (trapez): ${8 + 4|2} · 3 = 18 m²$.', [], G({ A: [0, 0, 225], B: [8, 0, -45], C: [6, 3, 45], D: [2, 3, 135] }, [{ p: 'ABCD' }, { d: 'AB', o: '8 m' }, { d: 'DC', o: '4 m' }, { lin: [[2, 0], [2, 3]], isp: 1 }, { tx: '3 m', at: [2.6, 1.4] }], { bezImena: ['A', 'B', 'C', 'D'] })),
        'Zapremina jame: $18 · 1,5 = 27 m³$.',
        'Tri radnika za sat iskopaju $3 · 0,75 = 2,25 m³$.',
        'Vreme: $27 : 2,25 = 12$ sati.',
      ]);
    Z(8, 2, 2,
      'Bočna strana pravilne trostrane piramide je jednakokraki trougao sa uglom od $30°$ pri vrhu, a bočna ivica je $8 cm$. Kolika je površina piramide?',
      ['$32√3 cm²$', '$48 cm²$', '$48 + 16√3 cm²$', '$64 cm²$'],
      [
        'Visina bočne strane iz temena $A$ na ivicu $BS$: trougao $ADS$ je polovina jednakostraničnog (ugao $30°$ kod $S$), pa je $AD = 4 cm$. Površina strane: ${8 · 4|2} = 16 cm²$, omotač $M = 48 cm²$.',
        '$DS = 4√3$, pa je $DB = 8 − 4√3$ i osnovna ivica $a² = AD² + DB² = 16 + (8 − 4√3)² = 64(2 − √3)$.',
        'Baza: $B = {a²√3|4} = 16(2 − √3)√3 = 32√3 − 48 cm²$.',
        K('Površina: $P = B + M = 32√3 − 48 + 48 = 32√3 cm²$ – lep rezultat.', [], C.piramida(3, 3, 4)),
      ]);
    Z(8, 3, 2,
      'Koliko parova celih brojeva $(x, y)$ zadovoljava jednačinu $2019x^{4} + 2020y^{4} = 20212021$?',
      ['nijedan', 'jedan', 'dva', 'četiri'],
      [
        K('Četvrti stepen celog broja završava se cifrom $0, 1, 5$ ili $6$.', [], C.tabela([['~cifra x', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ['~x⁴ se završava', 0, 1, 6, 1, 6, 5, 6, 1, 6, 1]])),
        'Zato se $2019x^{4}$ završava cifrom $9 · (0, 1, 5, 6)$ → $0, 9, 5, 4$, a $2020y^{4}$ uvek nulom.',
        'Zbir se završava sa $0, 9, 5$ ili $4$, a $20212021$ se završava sa $1$. Rešenja nema.',
      ]);
    Z(8, 4, 2,
      'Od $10$ različitih cvetova treba napraviti buket u kome su bar dva cveta. Na koliko načina se to može uraditi?',
      ['$1013$', '$1024$', '$1023$', '$1014$'],
      [
        'Za svaki cvet biramo „u buketu“ ili „nije“: $2^{10} = 1024$ izbora (uključujući i prazan).',
        'Oduzmemo izbore sa manje od dva cveta: prazan ($1$) i sa tačno jednim cvetom ($10$).',
        '$1024 − 1 − 10 = 1013$.',
      ]);
    Z(8, 5, 2,
      'Reši jednačinu $|2x + 21| − |x − 20| = 2021$.',
      ['$x ∈ \\{−2062, 1980\\}$', 'samo $x = 1980$', '$x ∈ \\{−2062, 1980, 673\\}$', '$x ∈ \\{−1980, 2062\\}$'],
      [
        K('Izrazi u apsolutnim vrednostima menjaju znak u $x = −10,5$ i $x = 20$ – tri intervala.', [], C.brojevna(-15, 25, [[-10.5, '−10,5', 1], [20, '20', 1]], { podela: 5, svaki: 1 })),
        '$x ≥ 20$: $2x + 21 − (x − 20) = x + 41 = 2021$, pa je $x = 1980$ ✓ (jeste $≥ 20$).',
        '$−10,5 ≤ x < 20$: $2x + 21 − (20 − x) = 3x + 1 = 2021$, pa je $x = {2020|3} ≈ 673$ – nije u intervalu, otpada.',
        '$x < −10,5$: $−2x − 21 − (20 − x) = −x − 41 = 2021$, pa je $x = −2062$ ✓.',
        'Rešenja: $x ∈ \\{−2062, 1980\\}$.',
      ]);
  },
};
