// Tema 1: Prirodni brojevi i deljivost – prvi deo (lekcije 1.1–1.8)
module.exports = ({ L, Z, K, G, O, bez, r, proveri, traka, skok, skokovi, krug, venn, upisi, sat, tackice, stubici, naKrugu, sto }) => {
  // pravougaonik (x, y, širina, visina) kao popunjen lik
  const pr = (x, y, w, h, x2 = {}) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((p) => p.map(r)), zatv: 1, ...x2 });
  // mreža kvadratića a×b (množenje kao pravougaonik)
  const kvadratici = (a, b, x2 = {}, x0 = 0, y0 = 0, s = 0.5) => {
    const e = [];
    for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) e.push(pr(x0 + j * s, y0 + i * s, s, s, { b: 0, gusto: 1, ...x2 }));
    return e;
  };

  // ════════════════ 1.1 Svojstva operacija u N₀ ════════════════
  L('Svojstva sabiranja, oduzimanja, množenja i deljenja u skupu N₀');

  Z(1, 'Izračunaj na najlakši način: $357 + 589 + 643$.',
    ['$1 589$', '$1 489$', '$1 599$', '$1 579$'],
    [K('Sabirci mogu da zamene mesta (komutativnost): $357 + 643 + 589$.'),
     K('$357 + 643 = 1 000$ – „okrugao“ broj!', ['a']),
     K('$1 000 + 589 = 1 589$', ['b'])],
    G(O, [traka(1, 1, { w: 3.57, b: 0 }), traka(1, 1, { x: 3.57, w: 5.89, b: 4 }), traka(1, 1, { x: 9.46, w: 6.43, b: 2 }),
      { tx: '357', at: [1.8, 0.6] }, { tx: '589', at: [6.5, 0.6] }, { tx: '643', at: [12.7, 0.6] },
      pr(0, 0, 3.57, 1.2, { b: 0, gusto: 1, id: 'a', k: 2, pomeri: [0, -2] }), pr(9.46, 0, 6.43, 1.2, { b: 2, gusto: 1, id: 'a', k: 2, pomeri: [-5.89, -2] }),
      { tx: '1 000', at: [5, -1.4], k: 2, id: 'a' }, { tx: '+ 589 = 1 589', at: [12.5, -1.4], k: 3, id: 'b' }], { ...bez, velicina: 320 }));

  Z(1, 'Izračunaj na najlakši način: $54 · 17 + 46 · 17$.',
    ['$1 700$', '$1 600$', '$1 754$', '$918$'],
    [K('Oba proizvoda imaju činilac $17$ – to su dva pravougaonika iste visine $17$, širina $54$ i $46$.'),
     K('Kad ih spojimo, dobijamo pravougaonik širine $54 + 46 = 100$ (distributivnost): $(54 + 46) · 17$.', ['d']),
     K('$100 · 17 = 1 700$')],
    G(O, [pr(0, 0, 5.4, 1.7, { b: 0, gusto: 1 }), pr(6.4, 0, 4.6, 1.7, { b: 2, gusto: 1, id: 'd', k: 2, pomeri: [-1, 0] }), pr(6.4, 0, 4.6, 1.7, { b: 2, gusto: 1, kraj: 2 }),
      { tx: '54', at: [2.7, 2.1] }, { tx: '46', at: [8.7, 2.1] }, { tx: '17', at: [-0.6, 0.7] }, { tx: '100', at: [5, -0.6], k: 2 }], { ...bez, velicina: 300 }));

  Z(1, 'Hana je kupila dve iste olovke i šestar od $170$ dinara i ukupno platila $350$ dinara. Koliko košta jedna olovka?',
    ['$90$ dinara', '$180$ dinara', '$85$ dinara', '$260$ dinara'],
    [K('Na traci je ukupno $350$: šestar je $170$, ostatak su dve olovke.', ['s']),
     K('Dve olovke: $350 − 170 = 180$ dinara.', ['o']),
     K('Jedna olovka: $180 : 2 = 90$ dinara. Provera: $90 + 90 + 170 = 350$ ✓')],
    G(O, [pr(0, 0, 9, 1.2, { b: 0, id: 'o' }), { lin: [[4.5, 0], [4.5, 1.2]], b: 0, debljina: 2 }, pr(9, 0, 8.5, 1.2, { b: 5, gusto: 1, id: 's' }),
      { tx: '?', at: [2.25, 0.6] }, { tx: '?', at: [6.75, 0.6] }, { tx: '170', at: [13.25, 0.6] },
      { lin: [[0, -0.5], [17.5, -0.5]], b: 3, debljina: 2 }, { tx: '350', at: [8.75, -1.1] },
      { tx: '90', at: [2.25, 1.8], k: 3, b: 2 }, { tx: '90', at: [6.75, 1.8], k: 3, b: 2 }], { ...bez, velicina: 320 }));

  Z(1, 'Na slici je broj kifli prodatih u pekari od ponedeljka do petka. Koliko kifli je prodato ukupno?',
    ['$400$', '$390$', '$410$', '$315$'],
    [K('Pročitamo stubiće: $73$, $91$, $82$, $69$, $85$.'),
     K('Grupišemo zgodne parove: $(91 + 69) + (73 + 82) + 85 = 160 + 155 + 85$.', ['s1', 's3']),
     K('$160 + 155 + 85 = 400$ kifli.')],
    stubici([['~P', 73], ['~U', 91], ['~S', 82], ['~Č', 69], ['~Pe', 85]], { korakY: 20, maxY: 100, vrednosti: true }));
  proveri(73 + 91 + 82 + 69 + 85 === 400, 'kifle');

  Z(2, 'Izračunaj na najlakši način: $23 · 7 − 13 · 7$.',
    ['$70$', '$84$', '$140$', '$10$'],
    [K('Od pravougaonika $23 × 7$ odsecamo deo $13 × 7$ – ostaje pravougaonik širine $23 − 13 = 10$.', ['od']),
     K('$23 · 7 − 13 · 7 = (23 − 13) · 7 = 10 · 7 = 70$')],
    G(O, [pr(0, 0, 3, 2.1, { b: 0, gusto: 1 }), pr(3, 0, 3.9, 2.1, { b: 0, gusto: 1, kraj: 1 }), pr(3, 0, 3.9, 2.1, { b: 4, prazno: 1, isp: 1, k: 1 }), pr(3, 0, 3.9, 2.1, { b: 1, gusto: 1, id: 'od', k: 1, pomeri: [0, -2.8] }),
      { tx: '23', at: [3.45, 2.6] }, { tx: '7', at: [-0.4, 1.05] }, { tx: '13', at: [5, -2.8 + 2.4], k: 1 }, { tx: '10', at: [1.5, -0.5], k: 2 }], { ...bez, velicina: 260 }));

  Z(2, 'Željko je dobio $5 040$ dinara džeparca za oktobar. Ako je svakog dana trošio po $140$ dinara, koliko mu je ostalo na kraju meseca?',
    ['$700$ dinara', '$840$ dinara', '$1 120$ dinara', '$560$ dinara'],
    [K('Oktobar ima $31$ dan.'),
     K('Potrošio je $31 · 140 = 4 340$ dinara ($30 · 140 = 4 200$, pa još $140$).'),
     K('Ostalo mu je $5 040 − 4 340 = 700$ dinara. (Ko računa $30$ dana dobija pogrešno $840$.)')]);
  proveri(5040 - 31 * 140 === 700, 'džeparac');

  Z(2, 'Izračunaj vrednost izraza $(180 − 44 : 4) : 13 + 7$.',
    ['$20$', '$17$', '$13$', '$10$'],
    [K('Prvo zagrada, a u njoj deljenje pre oduzimanja: $44 : 4 = 11$.'),
     K('$180 − 11 = 169$'),
     K('$169 : 13 = 13$, pa $13 + 7 = 20$. (Greška $17$ dobija se ako se „oduzme pre deljenja“: $(180 − 44) : 4 = 34$.)')]);
  proveri((180 - 44 / 4) / 13 + 7 === 20, 'izraz');

  Z(2, 'Od kog broja treba oduzeti $38$ da bi se dobilo $567$?',
    ['$605$', '$529$', '$595$', '$615$'],
    [K('Na brojevnoj pravoj: od nepoznatog broja idemo $38$ unazad i stižemo do $567$.'),
     K('Zato od $567$ idemo $38$ unapred: $567 + 38 = 605$.', ['sk']),
     K('Provera: $605 − 38 = 567$ ✓')],
    G({ P: [605, 0] }, [{ osa: [560, 610], podela: 5, svaki: 1 }, skok(605, 567, { h: 12, o: '− 38', kasni: 0.3 }), skok(567, 605, { h: 12, ispod: true, k: 2, id: 'sk', o: '+ 38', boja: 2 }), { tx: '?', at: [605, 4], b: 3 }], { bezImena: ['P'], velicina: 320 }));

  Z(3, 'Kada se četvrtina nepoznatog broja pomnoži sa $9$ i proizvodu doda $1 486$, dobija se najmanji petocifreni broj. Koji je to broj?',
    ['$3 784$', '$946$', '$3 744$', '$7 568$'],
    [K('Najmanji petocifreni broj je $10 000$. Idemo unazad: $10 000 − 1 486 = 8 514$.'),
     K('To je četvrtina pomnožena sa $9$: četvrtina $= 8 514 : 9 = 946$.'),
     K('Ceo broj je četiri puta veći: $946 · 4 = 3 784$. Provera: $3 784 : 4 · 9 + 1 486 = 10 000$ ✓')]);
  proveri((3784 / 4) * 9 + 1486 === 10000, 'četvrtina');

  Z(3, 'Za koliko se poveća proizvod $36 · 25$ ako se prvi činilac poveća za $4$, a drugi ostane isti?',
    ['za $100$', 'za $4$', 'za $29$', 'za $144$'],
    [K('Proizvod je površina pravougaonika $36 × 25$. Novi pravougaonik je $40 × 25$.'),
     K('Dodata je traka $4 × 25$ (distributivnost: $(36 + 4) · 25 = 36 · 25 + 4 · 25$).', ['tr']),
     K('Proizvod se poveća za $4 · 25 = 100$: sa $900$ na $1 000$.')],
    G(O, [pr(0, 0, 3.6 * 2, 2.5 * 2, { b: 0, gusto: 1 }), pr(7.2, 0, 0.8, 5, { b: 2, gusto: 1, id: 'tr', k: 2, crtaj: 1 }),
      { tx: '36', at: [3.6, 5.5] }, { tx: '25', at: [-0.6, 2.5] }, { tx: '4', at: [7.6, 5.5], k: 1 }], { ...bez, velicina: 240 }));

  // ════════════════ 1.2 Deljenje sa ostatkom ════════════════
  L('Deljenje sa ostatkom');

  Z(1, '$23$ kolača treba rasporediti na tacne po $5$. Koliko tacni će biti puno i koliko kolača ostaje?',
    ['$4$ tacne, ostaje $3$', '$5$ tacni, ostaje $2$', '$4$ tacne, ostaje $2$', '$3$ tacne, ostaje $8$'],
    [K('Ređamo kolače u redove po $5$: dobijamo $4$ puna reda.'),
     K('Ostaju $3$ kolača – manje od $5$, pa ne čine novi red.', ['ost']),
     K('$23 = 5 · 4 + 3$; ostatak $3$ je manji od delioca $5$.')],
    G(O, tackice(23, 5), { ...bez, velicina: 160 }));

  Z(1, 'Koji sve ostaci mogu da se dobiju pri deljenju prirodnog broja sa $5$?',
    ['$0, 1, 2, 3, 4$', '$1, 2, 3, 4, 5$', '$1, 2, 3, 4$', '$0, 1, 2, 3, 4, 5$'],
    [K('Ostatak je uvek manji od delioca: $0 ≤ r < 5$.'),
     K('Na brojevnoj pravoj se ostaci ponavljaju: $5$ ima ostatak $0$, $6$ ostatak $1$, …, $9$ ostatak $4$, pa $10$ opet $0$.'),
     K('Mogući ostaci: $0, 1, 2, 3, 4$ (ostatak $0$ znači da je broj deljiv sa $5$).')],
    G(O, [{ osa: [0, 15], podela: 1, svaki: 1 }, ...skokovi(0, 5, 3, { h: 1.3, razmak: 0.6 }), ...[0, 1, 2, 3, 4].map((o, i) => ({ tx: String(o), at: [10 + i, -1.6], b: 2, k: 2 }))], { ...bez, velicina: 320 }));

  Z(1, 'Koji broj pri deljenju sa $25$ daje količnik $8$ i ostatak $17$?',
    ['$217$', '$200$', '$183$', '$225$'],
    [K('$a = b · q + r$: deljenik je delilac puta količnik, plus ostatak.'),
     K('$a = 25 · 8 + 17 = 200 + 17 = 217$'),
     K('Provera: $217 : 25 = 8$ i ostatak $217 − 200 = 17$ ✓ ($17 < 25$)')]);

  Z(2, 'Sada je $9$ sati ujutru. Koliko će sati pokazivati sat (od $1$ do $12$) posle $100$ sati?',
    ['$1$', '$9$', '$4$', '$12$'],
    [K('Kazaljka za sate se posle svakih $12$ sati vraća na isto mesto.'),
     K('$100 = 12 · 8 + 4$: posle $96$ sati opet je $9$, ostaju još $4$ sata.', [], sat(9, 0, { okreniSat: -120 })),
     K('$9 + 4 = 13$, a na satu je to $1$.')],
    sat(9, 0));
  proveri(100 % 12 === 4, 'sat');

  Z(2, 'Danas je sreda. Koji će dan biti za $100$ dana?',
    ['petak', 'sreda', 'četvrtak', 'subota'],
    [K('Dani se ponavljaju na svakih $7$: posle $7, 14, 21, …$ dana opet je sreda.'),
     K('$100 = 7 · 14 + 2$: posle $98$ dana je opet sreda, i još $2$ dana.', ['sk']),
     K('Sreda → četvrtak → petak.')],
    (() => {
      const dani = ['~P', '~U', '~S', '~Č', '~Pe', '~Su', '~N'];
      const t = { O: [0, 0] }, e = [];
      dani.forEach((d, i) => { const p = naKrugu([0, 0], 3, 90 - i * (360 / 7)); e.push(krug(p[0], p[1], 0.6, { b: i === 2 ? 3 : 4, gusto: i === 2 ? 1 : 0, prazno: i === 2 ? 0 : 1 }), { tx: d, at: [p[0], p[1] - 0.15] }); });
      e.push({ l: 'O', r: 2.0, od: 90 - 2 * (360 / 7) - 2 * (360 / 7), do: 90 - 2 * (360 / 7), str: -1, crtaj: 1, b: 1, k: 2, id: 'sk' });
      return G(t, e, { ...bez, velicina: 220 });
    })());
  proveri(100 % 7 === 2, 'dani');

  Z(2, 'U skupu je $529$ učenika. Ako se poređaju u redove po $9$, koliko će biti punih redova i koliko će učenika ostati?',
    ['$58$ redova, ostaje $7$', '$59$ redova, ostaje $2$', '$58$ redova, ostaje $9$', '$57$ redova, ostaje $16$'],
    [K('Delimo: $52 : 9 = 5$ (ostatak $7$), spuštamo $9$: $79 : 9 = 8$ (ostatak $7$).'),
     K('$529 = 9 · 58 + 7$'),
     K('Provera: $9 · 58 = 522$, $522 + 7 = 529$ ✓. Ostatak $7 < 9$.')]);
  proveri(529 === 9 * 58 + 7, '529');

  Z(2, 'Koji je najmanji trocifreni broj koji pri deljenju sa $12$ daje ostatak $7$?',
    ['$103$', '$107$', '$115$', '$100$'],
    [K('Takvi brojevi su oblika $12 · q + 7$: $7, 19, 31, …$ – svaki sledeći je za $12$ veći.'),
     K('Najveći sadržalac broja $12$ manji od $100$ je $96 = 12 · 8$. Sledeći broj iz niza: $96 + 7 = 103$.'),
     K('Provera: $103 = 12 · 8 + 7$ ✓, a prethodni $91$ je dvocifren.')]);

  Z(2, 'Izračunaj na najlakši način: $1 125 : 5 − 125 : 5$.',
    ['$200$', '$225$', '$1 000$', '$250$'],
    [K('Oba broja su deljiva sa $5$, pa važi $(a − b) : c = a : c − b : c$.'),
     K('$(1 125 − 125) : 5 = 1 000 : 5 = 200$')]);

  Z(3, 'Broj $a$ pri deljenju sa $6$ daje ostatak $5$. Koliki ostatak daje broj $a + 4$ pri deljenju sa $6$?',
    ['$3$', '$9$', '$1$', '$5$'],
    [K('$a = 6q + 5$, pa je $a + 4 = 6q + 9 = 6q + 6 + 3 = 6(q + 1) + 3$.'),
     K('Na primer $a = 11$: $11 + 4 = 15 = 6 · 2 + 3$.'),
     K('Ostatak je $3$ (ne $9$ – ostatak mora biti manji od $6$).')]);

  Z(3, 'Kada se neki broj podeli sa $7$, količnik je za $3$ veći od ostatka, a ostatak je $5$. Koji je to broj?',
    ['$61$', '$56$', '$40$', '$68$'],
    [K('Ostatak $r = 5$, pa je količnik $q = 5 + 3 = 8$.'),
     K('$a = 7 · 8 + 5 = 61$. Provera: $61 : 7 = 8$, ostatak $5$ ✓')]);

  // ════════════════ 1.3 Činioci i sadržaoci ════════════════
  L('Svojstva deljivosti; činioci i sadržaoci');

  Z(1, 'Koliko delilaca ima broj $12$?',
    ['$6$', '$4$', '$5$', '$12$'],
    [K('Tražimo parove brojeva čiji je proizvod $12$: $1 · 12$, $2 · 6$, $3 · 4$.'),
     K('Svaki par daje dva delioca: $1, 2, 3, 4, 6, 12$ – ukupno $6$.'),
     K('To su i stranice svih pravougaonika od $12$ kvadratića.', [], G(O, [kvadratici(1, 12, {}, 0, 0), kvadratici(2, 6, { b: 2 }, 0, -2), kvadratici(3, 4, { b: 5 }, 4, -2.5)], { ...bez, velicina: 240 }))]);

  Z(1, 'Koji od brojeva $6, 7, 8, 9, 10, 11, 12$ su delioci broja $72$?',
    ['$6, 8, 9, 12$', '$6, 8, 12$', '$6, 9, 12$', '$6, 7, 8, 9, 12$'],
    [K('$72 = 6 · 12 = 8 · 9$ – odmah dobijamo četiri delioca.'),
     K('$72 : 7 = 10$ (ostatak $2$), $72 : 10$ ima ostatak $2$, $72 : 11$ ima ostatak $6$.'),
     K('Delioci iz liste: $6, 8, 9, 12$.')]);

  Z(1, 'Koji je treći po veličini sadržalac broja $17$?',
    ['$51$', '$34$', '$68$', '$17$'],
    [K('Sadržaoci su $17 · 1, 17 · 2, 17 · 3, …$ – skokovi po $17$ od nule.'),
     K('$17, 34, 51$: treći je $51$.', ['s'])],
    G(O, [{ osa: [0, 70], podela: 17, svaki: 1 }, ...skokovi(0, 17, 3, { h: 6, id: 's', k: 1 })], { ...bez, velicina: 300 }));

  Z(2, 'Površina pravougaonika je $18 cm²$, a dužine stranica (u $cm$) su prirodni brojevi. Koliko ima različitih takvih pravougaonika?',
    ['$3$', '$6$', '$2$', '$4$'],
    [K('Stranice su par delilaca broja $18$ čiji je proizvod $18$.'),
     K('$1 · 18$, $2 · 9$, $3 · 6$ – tri pravougaonika ($6 × 3$ je isti kao $3 × 6$, samo okrenut).', [], G(O, [kvadratici(1, 18, {}, 0, 0, 0.4), kvadratici(2, 9, { b: 2 }, 0, -1.4, 0.4), kvadratici(3, 6, { b: 5 }, 4.4, -1.8, 0.4)], { ...bez, velicina: 260 })),
     K('Ukupno $3$ različita pravougaonika.')]);

  Z(2, 'Koliko delilaca ima broj $36$?',
    ['$9$', '$8$', '$6$', '$10$'],
    [K('Parovi: $1 · 36$, $2 · 18$, $3 · 12$, $4 · 9$, $6 · 6$.', ['p']),
     K('Par $6 · 6$ daje samo jedan delilac! Delioci: $1, 2, 3, 4, 6, 9, 12, 18, 36$ – ukupno $9$.'),
     K('Kvadrati brojeva ($36 = 6 · 6$) uvek imaju neparan broj delilaca.')],
    G(O, [{ osa: [0, 36], podela: 1, svaki: 6 }, ...[[1, 36], [2, 18], [3, 12], [4, 9]].map(([a, b], i) => skok(a, b, { h: 3 + i * 2.5, boja: i % 5, k: 1, id: 'p', kasni: 0.3 + i * 0.4 })), { tx: '6', at: [6, 1.2], b: 3, k: 1 }], { ...bez, velicina: 320 }));

  Z(2, 'Da li je broj $34 · 51$ deljiv sa $17$?',
    ['jeste, jer je $34$ deljiv sa $17$', 'nije, jer $51$ nije deljiv sa $17$', 'jeste, ali samo zato što je $51$ neparan', 'ne može se znati bez računanja proizvoda'],
    [K('Ako je jedan činilac deljiv nekim brojem, deljiv je i ceo proizvod.'),
     K('$34 = 2 · 17$, pa je $34 · 51 = 17 · (2 · 51) = 17 · 102$. (I $51 = 3 · 17$ je deljiv sa $17$.)')]);

  Z(2, 'Koji je najveći delilac broja $48$ koji je manji od $48$?',
    ['$24$', '$16$', '$47$', '$12$'],
    [K('Najveći pravi delilac dobija se deljenjem najmanjim deliocem većim od $1$.'),
     K('Najmanji takav delilac broja $48$ je $2$, pa je najveći $48 : 2 = 24$.')]);

  Z(3, 'Važi $a + b + c = d$. Brojevi $a$, $c$ i $d$ su deljivi sa $7$. Šta važi za $b$?',
    ['$b$ je sigurno deljiv sa $7$', '$b$ sigurno nije deljiv sa $7$', '$b$ je deljiv sa $7$ samo ako je paran', 'ne može se odrediti'],
    [K('$b = d − a − c$.'),
     K('Razlika brojeva deljivih sa $7$ je deljiva sa $7$ (na brojevnoj pravoj: skokovi po $7$ ostaju na sadržaocima broja $7$).'),
     K('Dakle $b$ je sigurno deljiv sa $7$.')]);

  Z(3, 'Koliko ima dvocifrenih brojeva deljivih sa $7$?',
    ['$13$', '$14$', '$12$', '$90$'],
    [K('Najmanji: $14 = 7 · 2$; najveći: $98 = 7 · 14$.'),
     K('To su $7 · 2, 7 · 3, …, 7 · 14$ – količnici od $2$ do $14$.'),
     K('Od $2$ do $14$ ima $14 − 2 + 1 = 13$ brojeva.')]);

  Z(3, 'Broj $n$ je deljiv sa $6$ i sa $10$. Koji od ovih brojeva sigurno deli $n$?',
    ['$30$', '$60$', '$16$', '$4$'],
    [K('Proveravamo primerom: $n = 30$ je deljiv i sa $6$ i sa $10$.'),
     K('$30$ nije deljiv sa $60$, $16$ ni $4$ – oni zato ne moraju da dele $n$.'),
     K('Svaki broj deljiv sa $6$ i $10$ je sadržalac broja $30$ ($30, 60, 90, …$), pa ga $30$ uvek deli.')]);

  // ════════════════ 1.4 Deljivost sa 2, 5 i 10 ════════════════
  L('Deljivost sa 2, 5 i dekadnim jedinicama');

  Z(1, 'Koji od brojeva $2 100$, $3 010$, $5 005$, $52 000$ su deljivi sa $100$?',
    ['$2 100$ i $52 000$', 'samo $52 000$', '$2 100$, $3 010$ i $52 000$', 'svi'],
    [K('Broj je deljiv sa $100$ ako se završava sa dve nule.'),
     K('$2 100$ ✓ i $52 000$ ✓ se završavaju sa $00$; $3 010$ ✗ i $5 005$ ✗ ne.')]);

  Z(1, 'Koliko trocifrenih brojeva deljivih sa $5$ možeš da napišeš od cifara $3$, $4$ i $5$ (svaka cifra jednom)?',
    ['$2$', '$3$', '$6$', '$1$'],
    [K('Broj deljiv sa $5$ se završava sa $0$ ili $5$ – ovde mora sa $5$.'),
     K('Prve dve cifre su $3$ i $4$ u bilo kom redu: $345$ i $435$.')]);

  Z(1, 'Koju cifru treba upisati umesto * da broj $9 876*$ bude deljiv i sa $2$ i sa $5$?',
    ['$0$', '$5$', '$2$', '$8$'],
    [K('Deljiv sa $2$: poslednja cifra parna. Deljiv sa $5$: poslednja cifra $0$ ili $5$.'),
     K('Jedina cifra koja je i parna i $0$ ili $5$ je $0$: $98 760$ (deljiv i sa $10$).')]);

  Z(2, 'Koliko ima brojeva od $1$ do $100$ koji su deljivi sa $2$, a nisu deljivi sa $5$?',
    ['$40$', '$50$', '$10$', '$45$'],
    [K('Parnih brojeva od $1$ do $100$ ima $50$.'),
     K('Parni brojevi deljivi sa $5$ su deljivi sa $10$: $10, 20, …, 100$ – njih $10$.'),
     K('$50 − 10 = 40$.')]);

  Z(2, 'Broj $n$ je deljiv sa $2$, a broj $m$ sa $5$. Šta je sigurno tačno?',
    ['$m · n$ je deljiv sa $10$', '$m + n$ je deljiv sa $10$', '$m + n$ je deljiv sa $5$', '$m · n$ je deljiv sa $20$'],
    [K('$n = 2a$, $m = 5b$, pa je $m · n = 10ab$ – deljiv sa $10$ ✓'),
     K('Za zbir: $n = 2$, $m = 5$ daje $7$ – nije deljiv ni sa $5$ ni sa $10$.'),
     K('$m · n = 10$ za $n = 2$, $m = 5$ – nije deljiv sa $20$.')]);

  Z(2, 'Koji je najveći trocifreni broj sa različitim ciframa koji je deljiv sa $5$?',
    ['$985$', '$995$', '$990$', '$980$'],
    [K('Cifre moraju biti različite, pa $995$ i $990$ ne važe.'),
     K('Počinjemo sa $98_$: poslednja cifra je $0$ ili $5$, veća je $5$ → $985$.')]);

  Z(2, 'Koliko ima dvocifrenih brojeva sastavljenih od cifara $0$, $1$ i $2$ (cifre smeju da se ponavljaju) koji su deljivi sa $2$?',
    ['$4$', '$6$', '$3$', '$2$'],
    [K('Prva cifra ne sme biti $0$: može $1$ ili $2$.'),
     K('Poslednja cifra mora biti parna: $0$ ili $2$.'),
     K('$10, 12, 20, 22$ – ukupno $2 · 2 = 4$ broja.')]);

  Z(3, 'Proizvod svih prirodnih brojeva od $1$ do $20$ završava se sa koliko nula?',
    ['$4$', '$2$', '$6$', '$5$'],
    [K('Svaka nula na kraju dolazi od jednog para $2 · 5 = 10$.'),
     K('Petica ima manje: u $5, 10, 15, 20$ po jedna – ukupno $4$. Dvojki ima mnogo više.'),
     K('Zato se proizvod završava sa $4$ nule.')]);

  Z(3, 'Zbir dva broja deljiva sa $5$ je $135$, a jedan od njih je za $25$ veći od drugog. Koji je veći broj?',
    ['$80$', '$55$', '$85$', '$110$'],
    [K('Ako oduzmemo razliku $25$, ostaju dva jednaka broja: $135 − 25 = 110$.', ['m']),
     K('Manji broj: $110 : 2 = 55$, veći: $55 + 25 = 80$. Oba su deljiva sa $5$ ✓')],
    G(O, [pr(0, 0, 5.5, 1, { b: 0 }), pr(0, -1.6, 5.5, 1, { b: 0 }), pr(5.5, -1.6, 2.5, 1, { b: 1, gusto: 1, id: 'm' }), { tx: '25', at: [6.75, -1.1] }, { tx: '?', at: [2.75, 0.5] }, { tx: '?', at: [2.75, -1.1] },
      { lin: [[8.6, 1], [8.9, 1], [8.9, -1.6], [8.6, -1.6]], b: 3, debljina: 2 }, { tx: '135', at: [9.8, -0.3] }], { ...bez, velicina: 260 }));

  Z(3, 'Koliko ima trocifrenih brojeva deljivih sa $10$, a nisu deljivi sa $100$?',
    ['$81$', '$90$', '$9$', '$80$'],
    [K('Trocifrenih brojeva deljivih sa $10$: $100, 110, …, 990$ – ima ih $90$.'),
     K('Od njih su deljivi sa $100$: $100, 200, …, 900$ – njih $9$.'),
     K('$90 − 9 = 81$.')]);

  // ════════════════ 1.5 Deljivost sa 4 i 25 ════════════════
  L('Deljivost sa 4 i 25');

  Z(1, 'Koji od brojeva $425$, $730$, $975$, $880$ su deljivi sa $25$?',
    ['$425$ i $975$', 'samo $425$', '$425$, $730$ i $975$', '$975$ i $880$'],
    [K('Broj je deljiv sa $25$ ako mu je dvocifreni završetak $00$, $25$, $50$ ili $75$ (kao četvrtine stotine).'),
     K('$425$ ✓ ($25$), $730$ ✗, $975$ ✓ ($75$), $880$ ✗')],
    G(O, [sto(25, { b: 1 }), { tx: '25', at: [1.5, 7.0], b: 1 }, { tx: '~od', at: [3, 7.0] }, { tx: '100', at: [4.5, 7.0] }], { ...bez, velicina: 180 }));

  Z(1, 'Koju cifru treba upisati umesto * da bi broj $52 37*$ bio deljiv sa $25$?',
    ['$5$', '$0$', '$4$', '$2$'],
    [K('Dvocifreni završetak mora biti $00$, $25$, $50$ ili $75$.'),
     K('Završetak je $7*$, pa mora biti $75$: broj $52 375$.')]);

  Z(1, 'Da li se $138$ sličica može podeliti na $4$ brata tako da svako dobije isti broj?',
    ['ne, jer $38$ nije deljiv sa $4$', 'da, jer je $138$ paran', 'da, svako dobija $34$', 'ne, jer $138$ nije deljiv sa $2$'],
    [K('Broj je deljiv sa $4$ ako mu je dvocifreni završetak deljiv sa $4$.'),
     K('$38 : 4 = 9$, ostatak $2$ – nije deljiv. ($138 = 4 · 34 + 2$: ostale bi $2$ sličice.)'),
     K('Parnost nije dovoljna: $138$ je deljiv sa $2$, ali ne i sa $4$.')]);

  Z(2, 'Broj $n$ je deljiv i sa $4$ i sa $25$. Kojim dvema ciframa se završava?',
    ['$00$', '$25$', '$50$', '$20$'],
    [K('Deljiv sa $25$: završetak $00$, $25$, $50$ ili $75$.'),
     K('Od njih je deljiv sa $4$ samo $00$ ($25$ i $75$ su neparni, $50 : 4$ ima ostatak $2$).'),
     K('Zato je $n$ deljiv sa $100$.')]);

  Z(2, 'Stranica kvadrata u centimetrima je prirodan broj. Koji od ovih brojeva može biti njegov obim?',
    ['$196 cm$', '$198 cm$', '$121 cm$', '$146 cm$'],
    [K('Obim kvadrata je $4a$ – mora biti deljiv sa $4$.'),
     K('$96 : 4 = 24$ ✓; $98$, $21$ i $46$ nisu deljivi sa $4$.'),
     K('$196 : 4 = 49$, pa je stranica $49 cm$.')],
    G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [{ p: 'ABCD' }, { d: 'AB', o: 'a = ?' }, { lin: [[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]], crtaj: 1, b: 1, trajanje: 2, ponovi: 1 }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 160 }));

  Z(2, 'Koliko ima trocifrenih brojeva većih od $300$, a manjih od $500$, napisanih ciframa $2$, $4$ i $8$ (cifre se mogu ponavljati), koji su deljivi sa $4$?',
    ['$6$', '$4$', '$5$', '$9$'],
    [K('Prva cifra mora biti $4$ (broj je između $300$ i $500$).'),
     K('Dvocifreni završetak od cifara $2, 4, 8$ deljiv sa $4$: $24, 28, 44, 48, 84, 88$ ✓; $22, 42, 82$ ✗.'),
     K('Brojevi: $424, 428, 444, 448, 484, 488$ – ukupno $6$.')]);

  Z(2, 'Za koliko najmanje treba povećati broj $2 023$ da bi bio deljiv sa $4$?',
    ['$1$', '$3$', '$2$', '$5$'],
    [K('Gledamo završetak $23$: $23 = 4 · 5 + 3$.'),
     K('Sledeći sadržalac broja $4$ je $24$, pa dodajemo $1$: $2 024$ je deljiv sa $4$.')]);

  Z(3, 'Koliko ima brojeva od $1$ do $200$ deljivih sa $4$ ili sa $25$?',
    ['$56$', '$58$', '$54$', '$50$'],
    [K('Deljivih sa $4$: $200 : 4 = 50$. Deljivih sa $25$: $200 : 25 = 8$.'),
     K('Neki su brojani dvaput – deljivi i sa $4$ i sa $25$, tj. sa $100$: $100$ i $200$.', ['presek']),
     K('$50 + 8 − 2 = 56$.')],
    (() => { const v = venn({ imena: ['4', '25'], presek: true, k: 2 }); return G(O, [v.e, { tx: '50', at: v.mesta.A, vel: 20 }, { tx: '8', at: v.mesta.B, vel: 20 }, { tx: '2', at: v.mesta.AB, vel: 20, k: 2 }], { ...bez, velicina: 240 }); })());
  proveri([...Array(200)].map((_, i) => i + 1).filter((n) => n % 4 === 0 || n % 25 === 0).length === 56, '4 ili 25');

  Z(3, 'Koju najveću cifru treba upisati umesto * da broj $7*16$ bude deljiv sa $4$?',
    ['$9$', '$8$', '$6$', '$4$'],
    [K('Za deljivost sa $4$ važi samo dvocifreni završetak – ovde $16$, a $16 = 4 · 4$ ✓'),
     K('Cifra stotina ne utiče, pa je najveća moguća $9$: $7 916$.')]);

  Z(3, 'Koliko se puta u toku jednog dana (od $00:00$ do $23:59$) na digitalnom satu pojavi vreme kod kojeg je broj minuta deljiv sa $25$?',
    ['$72$', '$48$', '$96$', '$24$'],
    [K('Minuti od $00$ do $59$ deljivi sa $25$: $00$, $25$, $50$ – tri mogućnosti.'),
     K('Svaki od $24$ sata ima ta tri trenutka: $24 · 3 = 72$.')]);

  // ════════════════ 1.6 Deljivost sa 3 i 9 ════════════════
  L('Deljivost sa 3 i 9');

  Z(1, 'Koji od brojeva $123$, $124$, $125$, $126$, $127$, $128$ su deljivi sa $3$?',
    ['$123$ i $126$', 'samo $126$', '$123$, $126$ i $129$', '$124$ i $127$'],
    [K('Broj je deljiv sa $3$ ako mu je zbir cifara deljiv sa $3$.'),
     K('$1 + 2 + 3 = 6$ ✓, $1 + 2 + 6 = 9$ ✓, ostali daju $7, 8, 10, 11$ ✗.'),
     K('Među uzastopnim brojevima svaki treći je deljiv sa $3$.')],
    G(O, [{ osa: [120, 130], podela: 1, svaki: 1 }, ...skokovi(120, 3, 3, { h: 1.2 })], { ...bez, velicina: 300 }));

  Z(1, 'Da li se $127$ bombona može podeliti na $9$ učenika tako da svi dobiju jednako?',
    ['ne, ostaje $1$ bombona', 'da, svako dobija $14$', 'ne, ostaju $2$ bombone', 'da, jer je $127$ neparan'],
    [K('Zbir cifara: $1 + 2 + 7 = 10$ – nije deljiv sa $9$.'),
     K('$10$ pri deljenju sa $9$ daje ostatak $1$ – isti ostatak daje i $127$: $127 = 9 · 14 + 1$.')]);

  Z(1, 'Koju cifru treba upisati umesto * da broj $41*71$ bude deljiv sa $9$?',
    ['$5$', '$4$', '$0$', '$9$'],
    [K('Zbir poznatih cifara: $4 + 1 + 7 + 1 = 13$.'),
     K('Sledeći sadržalac broja $9$ je $18$: $13 + 5 = 18$, pa je cifra $5$ ($27$ bi tražilo $14$ – nije cifra).'),
     K('Broj $41 571 = 9 · 4 619$ ✓')]);
  proveri(41571 % 9 === 0, '41571');

  Z(2, 'Koji je najmanji trocifreni broj sa različitim ciframa deljiv sa $9$?',
    ['$108$', '$117$', '$102$', '$126$'],
    [K('Zbir cifara mora biti $9$ ili $18$. Najmanji broj počinje sa $10_$.'),
     K('$1 + 0 + x = 9$ daje $x = 8$: $108$ (cifre različite ✓).')]);

  Z(2, 'Koju cifru treba upisati umesto * da broj $7684*$ bude deljiv i sa $3$ i sa $5$?',
    ['$5$', '$0$', '$0$ ili $5$', '$2$'],
    [K('Deljiv sa $5$: poslednja cifra $0$ ili $5$.'),
     K('Zbir cifara $7 + 6 + 8 + 4 = 25$. Sa $0$: $25$ ✗; sa $5$: $30$ ✓ (deljiv sa $3$).'),
     K('Broj je $76 845$.')]);

  Z(2, 'Koji je najveći petocifreni broj deljiv i sa $2$ i sa $3$?',
    ['$99 996$', '$99 999$', '$99 998$', '$99 990$'],
    [K('Deljiv sa $2$ i $3$ znači deljiv sa $6$.'),
     K('$99 999$ je neparan; $99 998$ ima zbir cifara $44$ – nije deljiv sa $3$.'),
     K('$99 996$: paran, zbir cifara $42$ deljiv sa $3$ ✓')]);

  Z(2, 'Koji od brojeva $1 325$, $8 172$, $5 400$, $8 154$ je deljiv i sa $9$ i sa $5$?',
    ['$5 400$', '$1 325$', '$8 172$', '$8 154$'],
    [K('Deljiv sa $5$: $1 325$ i $5 400$.'),
     K('Zbir cifara: $1 + 3 + 2 + 5 = 11$ ✗, $5 + 4 + 0 + 0 = 9$ ✓. Broj je $5 400$.')]);

  Z(3, 'Zašto broj $10^{n}$ (npr. $100$, $1 000$) uvek daje ostatak $1$ pri deljenju sa $9$?',
    ['jer je $10^{n} − 1 = 99…9$ deljiv sa $9$', 'jer je $10$ deljiv sa $9$', 'jer je zbir cifara $0$', 'jer je $10^{n}$ paran'],
    [K('$10 = 9 + 1$, $100 = 99 + 1$, $1 000 = 999 + 1$.'),
     K('Brojevi $9, 99, 999, …$ su deljivi sa $9$, pa svaka dekadna jedinica daje ostatak $1$.'),
     K('Zato je $3 · 100 + 4 · 10 + 5$ istog ostatka kao $3 + 4 + 5$ – odatle pravilo zbira cifara.')]);

  Z(3, 'Koliko ima dvocifrenih brojeva čiji je zbir cifara $9$?',
    ['$9$', '$10$', '$8$', '$11$'],
    [K('To su $18, 27, 36, 45, 54, 63, 72, 81, 90$ – svi deljivi sa $9$.'),
     K('Ima ih $9$ (prva cifra od $1$ do $9$, druga je $9$ minus prva).')]);

  Z(3, 'Broj se sastoji od $20$ jedinica i nekoliko nula (npr. $1101…$). Da li može biti deljiv sa $9$?',
    ['ne, zbir cifara je $20$', 'da, ako ima dovoljno nula', 'da, uvek', 'samo ako se završava nulom'],
    [K('Zbir cifara ne zavisi od nula: uvek je $20$.'),
     K('$20$ nije deljiv sa $9$ (ostatak $2$), pa nijedan takav broj nije deljiv sa $9$.')]);

  // ════════════════ 1.7 Skupovi ════════════════
  L('Skupovi');

  Z(1, 'Koliko elemenata ima skup prirodnih brojeva deljivih sa $5$ koji su veći od $8$, a manji od $23$?',
    ['$3$', '$4$', '$2$', '$15$'],
    [K('Tražimo brojeve deljive sa $5$ između $8$ i $23$.'),
     K('$10, 15, 20$ – tri elementa.', ['s'])],
    G(O, [{ osa: [8, 23], podela: 1, svaki: 1 }, ...[10, 15, 20].map((x, i) => ({ tx: '●', at: [x, 0.05], b: 1, k: 1, id: 's' }))], { ...bez, velicina: 300 }));

  Z(1, 'Da li su skupovi $\\{T, A, T, A\\}$ i $\\{A, T\\}$ jednaki?',
    ['da, oba imaju elemente $A$ i $T$', 'ne, prvi ima $4$ elementa', 'ne, redosled je drugačiji', 'da, ali samo ako se $T$ i $A$ ponavljaju'],
    [K('U skupu se element ne broji dvaput: $\\{T, A, T, A\\} = \\{T, A\\}$.'),
     K('Redosled nije bitan: $\\{T, A\\} = \\{A, T\\}$. Skupovi su jednaki.')]);

  Z(1, 'Koliko elemenata ima skup dana u februaru prestupne godine?',
    ['$29$', '$28$', '$30$', '$366$'],
    [K('Prestupna godina ima $366$ dana jer februar dobija dan više: $29$ dana.')]);

  Z(2, 'Dati su skupovi $A = \\{1, 2, 3, 4, 6\\}$ i $B = \\{2, 4\\}$. Šta je tačno?',
    ['$B ⊂ A$', '$A ⊂ B$', '$A = B$', '$2 ∉ A$'],
    [K('Svaki element skupa $B$ ($2$ i $4$) je i u $A$ – zato je $B$ podskup od $A$.'),
     K('Na Venovom dijagramu krug $B$ je unutar kruga $A$.', [], G(O, [krug(0, 0, 3.2, { b: 0, prazno: 1 }), krug(1, -0.3, 1.4, { b: 5, prazno: 1, crtaj: 1 }), { tx: 'A', at: [-2.2, 2.6], vel: 20 }, { tx: 'B', at: [2.1, 1.1], vel: 20 },
       ...upisi([2, 4], [1, -0.3], { kolona: 2 }), { tx: '1', at: [-1.6, 0.6] }, { tx: '3', at: [-1.4, -1] }, { tx: '6', at: [-0.3, 1.8] }], { ...bez, velicina: 180 }))]);

  Z(2, 'Koliko podskupova ima skup $\\{a, b, c\\}$ (računajući prazan skup i ceo skup)?',
    ['$8$', '$6$', '$7$', '$3$'],
    [K('Za svaki element biramo: „u podskupu“ ili „nije“ – $2 · 2 · 2 = 8$ mogućnosti.'),
     K('$∅$, $\\{a\\}$, $\\{b\\}$, $\\{c\\}$, $\\{a, b\\}$, $\\{a, c\\}$, $\\{b, c\\}$, $\\{a, b, c\\}$.')]);

  Z(2, 'Neka je $A = \\{n \\| n ∈ N, n < 20\\}$ i $B = \\{n \\| n ∈ N, 13 < n < 17\\}$. Šta važi?',
    ['$B ⊂ A$', '$A ⊂ B$', '$A = B$', 'nijedan nije podskup drugog'],
    [K('$A = \\{1, 2, …, 19\\}$, a $B = \\{14, 15, 16\\}$.'),
     K('Svi elementi skupa $B$ su manji od $20$, pa su u $A$: $B ⊂ A$.')],
    G(O, [{ osa: [0, 20], podela: 1, svaki: 2 }, { lin: [[1, 0.5], [19, 0.5]], b: 0, debljina: 5, crtaj: 1 }, { tx: 'A', at: [10, 1.2], b: 0 }, { lin: [[14, -0.5], [16, -0.5]], b: 5, debljina: 5, crtaj: 1, kasni: 1.4 }, { tx: 'B', at: [15, -1.3], b: 5 }], { ...bez, velicina: 300 }));

  Z(2, 'Iz skupa $\\{5 228, 3 045, 29, 531, 7 405\\}$ izdvoj brojeve deljive sa $3$. Koliko ih je?',
    ['$2$', '$1$', '$3$', '$4$'],
    [K('Zbirovi cifara: $5228 → 17$, $3045 → 12$ ✓, $29 → 11$, $531 → 9$ ✓, $7405 → 16$.'),
     K('Deljivi sa $3$: $3 045$ i $531$ – dva broja.')]);

  Z(3, 'Skup $S$ sadrži sve dvocifrene brojeve kojima je cifra desetica dvostruko veća od cifre jedinica. Koliko elemenata ima $S$?',
    ['$4$', '$5$', '$9$', '$3$'],
    [K('Cifra jedinica $j$, desetica $2j$, a $2j$ mora biti cifra od $1$ do $9$.'),
     K('$j = 1, 2, 3, 4$: brojevi $21, 42, 63, 84$. ($j = 0$ daje $00$ – nije dvocifren.)')]);

  Z(3, 'Skup $A$ ima $5$ elemenata. Koliko ima podskupova sa tačno $2$ elementa?',
    ['$10$', '$20$', '$5$', '$25$'],
    [K('Biramo prvi element na $5$ načina, drugi na $4$: $20$ parova.'),
     K('Ali $\\{a, b\\}$ i $\\{b, a\\}$ su isti skup – svaki par je brojan dvaput: $20 : 2 = 10$.'),
     K('Kao dijagonale i stranice petougla: $5 + 5 = 10$.', [], G((() => { const t = {}; 'ABCDE'.split('').forEach((n, i) => (t[n] = naKrugu([0, 0], 3, 90 - i * 72))); return t; })(), [{ p: 'ABCDE', prazno: 1 }, ...['AC', 'AD', 'BD', 'BE', 'CE'].map((d, i) => ({ d, b: 1, crtaj: 1, kasni: 0.3 + i * 0.4 }))], { velicina: 180 }))]);

  Z(3, 'U odeljenju od $28$ učenika, $17$ trenira fudbal, a $15$ košarku; svaki učenik trenira bar jedan sport. Koliko učenika trenira oba sporta?',
    ['$4$', '$2$', '$32$', '$13$'],
    [K('$17 + 15 = 32$, a učenika je $28$: neki su brojani dvaput.'),
     K('Dvaput su brojani oni koji treniraju oba sporta: $32 − 28 = 4$.', ['presek']),
     K('Samo fudbal: $17 − 4 = 13$; samo košarka: $15 − 4 = 11$; $13 + 4 + 11 = 28$ ✓')],
    (() => { const v = venn({ imena: ['~F', '~K'], presek: true, k: 2 }); return G(O, [v.e, { tx: '?', at: v.mesta.AB, vel: 22, b: 3 }, { tx: '17', at: [-3.2, -2.8] }, { tx: '15', at: [3.2, -2.8] }], { ...bez, velicina: 240 }); })());

  // ════════════════ 1.8 Unija, presek, razlika ════════════════
  L('Skupovne operacije: unija, presek i razlika');

  {
    const v = venn({ imena: ['A', 'B'], presek: true, k: 1 });
    Z(1, 'Dati su $A = \\{1, 2, 3, 4\\}$ i $B = \\{3, 4, 5, 7, 9\\}$. Koji je presek $A ∩ B$?',
      ['$\\{3, 4\\}$', '$\\{1, 2, 3, 4, 5, 7, 9\\}$', '$\\{1, 2\\}$', '$\\{5, 7, 9\\}$'],
      [K('Presek čine elementi koji su u oba skupa – u zajedničkom delu dijagrama.', ['presek']),
       K('$A ∩ B = \\{3, 4\\}$')],
      G(O, [v.e, ...upisi([1, 2], v.mesta.A, { kolona: 1 }), ...upisi([3, 4], v.mesta.AB, { kolona: 1 }), ...upisi([5, 7, 9], v.mesta.B, { kolona: 1, razmak: 0.8 })], { ...bez, velicina: 240 }));
  }
  {
    const v = venn({ imena: ['A', 'B'], samoA: true, presek: true, samoB: true, k: 1 });
    Z(1, 'Dati su $A = \\{a, b, c\\}$ i $B = \\{c, d\\}$. Koliko elemenata ima unija $A ∪ B$?',
      ['$4$', '$5$', '$1$', '$2$'],
      [K('Uniju čine svi elementi koji su u bar jednom skupu – ceo obojeni deo.', ['samoA', 'presek', 'samoB']),
       K('$A ∪ B = \\{a, b, c, d\\}$ – element $c$ se piše samo jednom. Ima $4$ elementa.')],
      G(O, [v.e, ...upisi(['a', 'b'], v.mesta.A, { kolona: 1 }), { tx: 'c', at: v.mesta.AB }, { tx: 'd', at: v.mesta.B }], { ...bez, velicina: 240 }));
  }
  {
    const v = venn({ imena: ['A', 'B'], samoA: true, k: 1 });
    Z(1, 'Neka je $A = \\{2, 4, 6, 8\\}$ i $B = \\{3, 6, 9\\}$. Koja je razlika $A \\ B$?',
      ['$\\{2, 4, 8\\}$', '$\\{3, 9\\}$', '$\\{6\\}$', '$\\{2, 3, 4, 8, 9\\}$'],
      [K('$A \\ B$ su elementi skupa $A$ koji nisu u $B$ – deo kruga $A$ izvan $B$.', ['samoA']),
       K('Iz $A$ izbacujemo $6$: $A \\ B = \\{2, 4, 8\\}$.')],
      G(O, [v.e, ...upisi([2, 4, 8], v.mesta.A, { kolona: 1, razmak: 0.8 }), { tx: '6', at: v.mesta.AB }, ...upisi([3, 9], v.mesta.B, { kolona: 1 })], { ...bez, velicina: 240 }));
  }

  {
    const v = venn({ imena: ['A', 'B'], samoB: true, k: 2 });
    Z(2, 'Na Venovom dijagramu su prikazani skupovi $A$ i $B$. Koliko elemenata ima $B \\ A$?',
      ['$3$', '$2$', '$5$', '$4$'],
      [K('$B = \\{3, 6, 10, 12, 15\\}$, a zajedničko sa $A$ je $\\{6, 12\\}$.'),
       K('$B \\ A$ – deo kruga $B$ izvan $A$: $\\{3, 10, 15\\}$, tri elementa.', ['samoB'])],
      G(O, [v.e, ...upisi([2, 4, 8], v.mesta.A, { kolona: 1, razmak: 0.8 }), ...upisi([6, 12], v.mesta.AB, { kolona: 1 }), ...upisi([3, 10, 15], v.mesta.B, { kolona: 1, razmak: 0.8 })], { ...bez, velicina: 240 }));
  }

  Z(2, 'Neka je $A = \\{n \\| n ∈ N, 1 ≤ n ≤ 5\\}$, a $B$ skup jednocifrenih neparnih brojeva. Koliko elemenata ima $A ∪ B$?',
    ['$7$', '$10$', '$3$', '$8$'],
    [K('$A = \\{1, 2, 3, 4, 5\\}$, $B = \\{1, 3, 5, 7, 9\\}$.'),
     K('Zajednički: $1, 3, 5$. Unija: $\\{1, 2, 3, 4, 5, 7, 9\\}$ – $5 + 5 − 3 = 7$ elemenata.')],
    (() => { const v = venn({ imena: ['A', 'B'] }); return G(O, [v.e, ...upisi([2, 4], v.mesta.A, { kolona: 1 }), ...upisi([1, 3, 5], v.mesta.AB, { kolona: 1, razmak: 0.8 }), ...upisi([7, 9], v.mesta.B, { kolona: 1 })], { ...bez, velicina: 240 }); })());

  Z(2, '$A$ je skup parnih brojeva ne većih od $20$, a $B$ skup brojeva deljivih sa $3$ ne većih od $20$. Koji je $A ∩ B$?',
    ['$\\{6, 12, 18\\}$', '$\\{3, 6, 9, 12, 15, 18\\}$', '$\\{6, 12\\}$', '$\\{2, 3, 6, 12, 18\\}$'],
    [K('U preseku su brojevi deljivi i sa $2$ i sa $3$ – tj. sa $6$.'),
     K('Do $20$: $6, 12, 18$.', ['p'])],
    G(O, [{ osa: [0, 20], podela: 1, svaki: 2 }, ...[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((x) => ({ tx: '●', at: [x, 0.7], b: 0 })), ...[3, 6, 9, 12, 15, 18].map((x) => ({ tx: '●', at: [x, -0.6], b: 5 })),
      ...[6, 12, 18].map((x) => ({ lin: [[x, 1.3], [x, -1.2]], b: 2, debljina: 4, k: 2, id: 'p', crtaj: 1 })), { tx: 'A', at: [-1, 0.7], b: 0 }, { tx: 'B', at: [-1, -0.6], b: 5 }], { ...bez, velicina: 320 }));

  Z(2, 'Ako je $A = \\{1, 2, 3\\}$, $B = \\{3, 4, 5, 6, 7\\}$ i $C = \\{2, 3, 4\\}$, koji je skup $(A ∪ B) ∩ C$?',
    ['$\\{2, 3, 4\\}$', '$\\{3\\}$', '$\\{1, 2, 3, 4, 5, 6, 7\\}$', '$\\{3, 4\\}$'],
    [K('Prvo zagrada: $A ∪ B = \\{1, 2, 3, 4, 5, 6, 7\\}$.'),
     K('Presek sa $C = \\{2, 3, 4\\}$: svi elementi skupa $C$ su u uniji, pa je rezultat ceo $C$.')]);

  Z(3, '$A$ je skup svih prirodnih brojeva deljivih sa $3$, a $B$ skup svih prirodnih brojeva deljivih sa $9$. Šta je $B \\ A$?',
    ['prazan skup', 'skup brojeva deljivih sa $9$', 'skup brojeva deljivih sa $3$, a ne sa $9$', 'skup $\\{3, 6\\}$'],
    [K('Svaki broj deljiv sa $9$ je deljiv i sa $3$: $B ⊂ A$.'),
     K('Kad iz $B$ izbacimo sve što je u $A$, ne ostaje ništa: $B \\ A = ∅$.', [], G(O, [krug(0, 0, 3.2, { b: 0, prazno: 1 }), krug(0.8, -0.3, 1.6, { b: 5, prazno: 1 }), { tx: 'A', at: [-2.2, 2.6], vel: 20 }, { tx: 'B', at: [2.0, 1.4], vel: 20 }, { tx: '9, 18, …', at: [0.8, -0.3] }, { tx: '3, 6, …', at: [-1.4, 1] }], { ...bez, velicina: 180 })),
     K('(Obrnuto, $A \\ B$ nije prazan: $3, 6, 12, …$)')]);

  Z(3, 'Za skupove $A$ i $B$ važi: $A ∪ B$ ima $12$ elemenata, $A$ ima $7$, a $B$ ima $9$ elemenata. Koliko elemenata ima $A ∩ B$?',
    ['$4$', '$2$', '$16$', '$5$'],
    [K('$7 + 9 = 16$ – zajednički elementi su brojani dvaput.'),
     K('$|A ∩ B| = 16 − 12 = 4$.', ['presek']),
     K('Samo u $A$: $3$, samo u $B$: $5$, u oba: $4$ → $3 + 4 + 5 = 12$ ✓')],
    (() => { const v = venn({ imena: ['A', 'B'], presek: true, k: 2 }); return G(O, [v.e, { tx: '?', at: v.mesta.AB, vel: 22, b: 3 }, { tx: '3', at: v.mesta.A, k: 3 }, { tx: '5', at: v.mesta.B, k: 3 }], { ...bez, velicina: 240 }); })());

  Z(3, '$A$ je skup jednocifrenih brojeva deljivih sa $2$, a $B$ skup jednocifrenih brojeva deljivih sa $3$ (bez nule). Koliko elemenata ima $(A ∪ B) \\ (A ∩ B)$?',
    ['$5$', '$6$', '$7$', '$1$'],
    [K('$A = \\{2, 4, 6, 8\\}$, $B = \\{3, 6, 9\\}$.'),
     K('$A ∪ B = \\{2, 3, 4, 6, 8, 9\\}$, $A ∩ B = \\{6\\}$.', ['samoA', 'samoB']),
     K('Bez zajedničkog: $\\{2, 3, 4, 8, 9\\}$ – $5$ elemenata.')],
    (() => { const v = venn({ imena: ['A', 'B'], samoA: true, samoB: true, k: 2 }); return G(O, [v.e, ...upisi([2, 4, 8], v.mesta.A, { kolona: 1, razmak: 0.8 }), { tx: '6', at: v.mesta.AB }, ...upisi([3, 9], v.mesta.B, { kolona: 1 })], { ...bez, velicina: 240 }); })());
};
