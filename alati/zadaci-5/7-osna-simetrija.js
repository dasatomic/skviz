// Tema 7: Osna simetrija (lekcije 7.1–7.4)
// Animacija "odrazi": lik se presavija preko ose (kao papir) i ostaje kao odraz.
module.exports = ({ L, Z, K, G, O, bez, r, proveri, naKrugu, pravilni, krug, papir, luk, sat }) => {
  const pr = (x, y, w, h, x2 = {}) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((p) => p.map(r)), zatv: 1, ...x2 });
  const osa = (t, a, b, x = {}) => ({ d: a + b, b: 3, isp: 1, debljina: 2.5, ...x });
  // ose simetrije lika (prave kroz centar pod datim uglovima), crtaju se redom
  const ose = (uglovi, R, x = {}) => uglovi.map((u, i) => ({ lin: [naKrugu([0, 0], R, u), naKrugu([0, 0], R, u + 180)], b: 3, isp: 0, debljina: 2, crtaj: 1, kasni: 0.2 + i * 0.5, id: 'ose', ...x }));

  // ════════════════ 7.1 Osna simetrija ════════════════
  L('Osna simetrija');

  Z(1, 'Koja tačka je osnosimetrična tački $A$ u odnosu na pravu $s$?',
    ['$Q$', '$P$', '$R$', '$S$'],
    [K('Slika je sa druge strane ose, na normali iz $A$, jednako udaljena od ose.'),
     K('$A$ je $3$ kvadratića levo od $s$, pa je slika $3$ kvadratića desno, u istom redu: $Q$.', ['n']),
     K('Presavijanjem papira po osi $A$ pada tačno na $Q$.', ['f'])],
    G({ A: [1, 3], P: [7, 2], Q: [7, 3], R: [6, 3], S: [5, 4], s1: [4, 0], s2: [4, 5], a1: [4, 3] },
      [papir(0, 8, 0, 5), osa({}, 's1', 's2'), { tx: 's', at: [4.3, 4.8] }, { tacka: 'APQRS' }, { d: 'AQ', b: 1, isp: 1, k: 2, id: 'n' }, { tacka: 'A', b: 1, odrazi: 's1s2', k: 3, id: 'f' }],
      { bezImena: ['s1', 's2', 'a1'], velicina: 240 }));

  Z(1, 'Tačka $A$ je udaljena $3 cm$ od ose simetrije $s$. Koliko je $A$ udaljena od svoje slike $A\'$?',
    ['$6 cm$', '$3 cm$', '$1 cm 5 mm$', '$9 cm$'],
    [K('Osa simetrije je simetrala duži $AA\'$: polovi je i normalna je na nju.'),
     K('$AA\' = 2 · 3 = 6 cm$.', ['d'])],
    G({ A: [0, 0], N: [3, 0, 315], B: [6, 0], s1: [3, -2], s2: [3, 2] }, [osa({}, 's1', 's2'), { tacka: 'A' }, { d: 'AN', o: '3 cm', b: 0 }, { d: 'NB', b: 1, k: 2, id: 'd' }, { tacka: 'A', b: 1, odrazi: 's1s2', k: 1 }, { tx: "A'", at: [6, 0.6], k: 1 }], { bezImena: ['s1', 's2', 'B', 'N'], velicina: 200 }));

  Z(1, 'Gde se preslikava tačka koja leži na osi simetrije?',
    ['u samu sebe', 'u tačku sa druge strane ose', 'ne preslikava se', 'u presek ose i normale'],
    [K('Rastojanje tačke od ose je $0$, pa je i slika na rastojanju $0$ – na istom mestu.'),
     K('Tačke ose su nepokretne (fiksne) pri osnoj simetriji.')]);

  Z(1, 'Trougao $ABC$ se preslika osnom simetrijom. Kolika je stranica $A\'B\'$ slike ako je $AB = 5 cm$?',
    ['$5 cm$', '$10 cm$', '$2 cm 5 mm$', 'zavisi od ose'],
    [K('Osna simetrija je izometrija – ne menja dužine ni uglove.'),
     K('Presavijeni trougao se tačno poklapa sa slikom: $A\'B\' = AB = 5 cm$.', ['f'])],
    G({ A: [0, 0], B: [3, 0], C: [1, 2.5], s1: [4, -1], s2: [4, 3.5] }, [osa({}, 's1', 's2'), { p: 'ABC', b: 0 }, { d: 'AB', o: '5 cm' }, { p: 'ABC', b: 1, odrazi: 's1s2', k: 2, id: 'f', gusto: 1 }], { bezImena: ['s1', 's2'], velicina: 220 }));

  Z(2, 'Tačka se preslika osnom simetrijom u odnosu na pravu $s$, a zatim njena slika ponovo u odnosu na istu pravu $s$. Gde je konačna tačka?',
    ['tamo gde je bila na početku', 'dvostruko dalje od ose', 'na osi', 'sa druge strane ose'],
    [K('Prvo presavijanje prebaci tačku na drugu stranu, drugo je vrati nazad.'),
     K('Dve iste osne simetrije zajedno ne menjaju ništa.')]);

  Z(2, 'Na mreži je osa $s$ dijagonala kvadratića (prava kroz $(0, 0)$ i $(5, 5)$). Tačka $A$ je $1$ desno i $4$ gore od početka. Gde je njena slika?',
    ['$4$ desno i $1$ gore', '$1$ desno i $4$ dole', '$4$ levo i $1$ gore', '$1$ levo i $4$ gore'],
    [K('Pri simetriji u odnosu na ovu dijagonalu „desno“ i „gore“ zamenjuju mesta.'),
     K('Slika tačke $A$ je $4$ desno i $1$ gore.', ['f'])],
    G({ A: [1, 4], s1: [0, 0], s2: [5, 5], B: [4, 1] }, [papir(0, 5, 0, 5), osa({}, 's1', 's2'), { tacka: 'A' }, { d: 'AB', b: 1, isp: 1, k: 2 }, { tacka: 'A', b: 1, odrazi: 's1s2', k: 2, id: 'f' }], { bezImena: ['s1', 's2', 'B'], velicina: 200 }));

  Z(2, 'Koje od ovih slova izgleda isto u ogledalu (ima vertikalnu osu simetrije)?',
    ['$A$', '$R$', '$N$', '$S$'],
    [K('Ogledalo „presavija“ sliku preko vertikalne ose.'),
     K('Slovo $A$ je simetrično u odnosu na vertikalnu pravu kroz vrh – u ogledalu je isto. $R$, $N$ i $S$ se izokrenu.', ['a'])],
    G({ s1: [1, -0.5], s2: [1, 3.5] }, [osa({}, 's1', 's2', { k: 1 }), { lin: [[0, 0], [1, 3], [2, 0]], b: 0, debljina: 6 }, { lin: [[0.4, 1.2], [1.6, 1.2]], b: 0, debljina: 6 }, { lin: [[0, 0], [1, 3]], b: 1, debljina: 6, odrazi: 's1s2', k: 2, id: 'a', ponovi: 1 }], { bezImena: ['s1', 's2'], velicina: 100 }));

  Z(2, 'Prava $p$ je normalna na osu simetrije $s$. U šta se preslikava prava $p$?',
    ['u samu sebe', 'u pravu paralelnu sa $p$', 'u pravu $s$', 'u pravu normalnu na $p$'],
    [K('Svaka tačka prave $p$ ide po normali na $s$ – a to je baš prava $p$.'),
     K('Prava $p$ se preslika u samu sebe (tačke zamene strane).', ['p'])],
    G({ s1: [0, -3], s2: [0, 3], p1: [-4, 0], p2: [4, 0], A: [-2.5, 0] }, [osa({}, 's1', 's2'), { d: 'p1p2', b: 0 }, { tacka: 'A' }, { tacka: 'A', b: 1, odrazi: 's1s2', k: 2, id: 'p' }, { tx: 'p', at: [4.3, 0.4] }, { tx: 's', at: [0.4, 3] }], { bezImena: ['s1', 's2', 'p1', 'p2'], velicina: 200 }));

  Z(3, 'Tačka $A$ se preslika u odnosu na pravu $a$, a slika u odnosu na pravu $b ∥ a$. Prave $a$ i $b$ su udaljene $3 cm$. Koliko je konačna tačka udaljena od $A$?',
    ['$6 cm$', '$3 cm$', '$9 cm$', '$0 cm$'],
    [K('Neka je $A$ na rastojanju $x$ levo od $a$. Posle prve simetrije slika je $x$ desno od $a$.'),
     K('Do $b$ joj ostaje $3 − x$, pa posle druge simetrije ide još $3 − x$ iza $b$.'),
     K('Ukupan pomak: $2x + 2(3 − x) = 6 cm$ – uvek dvostruko rastojanje osa (to je translacija!).', ['t'])],
    G({ A: [0, 0], a1: [1, -2], a2: [1, 2], b1: [4, -2], b2: [4, 2], B: [6, 0] }, [{ d: 'a1a2', b: 3, isp: 1 }, { d: 'b1b2', b: 5, isp: 1 }, { tx: 'a', at: [1.3, 2] }, { tx: 'b', at: [4.3, 2] }, { tacka: 'A' }, { tacka: 'A', b: 1, odrazi: 'a1a2', k: 2 }, { lin: [[0, -0.6], [6, -0.6]], b: 2, str: 1, k: 3, id: 't', crtaj: 1 }, { tx: '6 cm', at: [3, -1.1], k: 3 }], { bezImena: ['a1', 'a2', 'b1', 'b2', 'B'], velicina: 220 }));

  Z(3, 'Sat u ogledalu pokazuje kao da je $3:00$ (mala kazaljka na $3$). Koliko je stvarno sati?',
    ['$9:00$', '$3:00$', '$6:00$', '$12:00$'],
    [K('Ogledalo preslikava sat preko vertikalne ose kroz $12$ i $6$.'),
     K('Broj $3$ (desno) prelazi u položaj broja $9$ (levo): stvarno je $9:00$.', [], (() => { const s = sat(3, 0); s.t = { ...s.t, s1: [0, -4.5], s2: [0, 4.5] }; s.e = s.e.map((e) => (e.id === 'sat' ? { ...e, odrazi: 's1s2', kasni: 0.4 } : e)); s.e.push(osa({}, 's1', 's2')); s.bezImena = ['O', 's1', 's2']; return s; })())],
    (() => { const s = sat(3, 0); return s; })());

  // ════════════════ 7.2 Osnosimetrične figure ════════════════
  L('Osnosimetrične figure');

  Z(1, 'Koliko osa simetrije ima kvadrat?',
    ['$4$', '$2$', '$1$', '$8$'],
    [K('Dve ose spajaju sredine naspramnih stranica, a dve su dijagonale.', ['ose']),
     K('Ukupno $4$ ose simetrije.')],
    G({ A: [-2, -2], B: [2, -2], C: [2, 2], D: [-2, 2] }, [{ p: 'ABCD', b: 0 }, ...ose([0, 90, 45, 135], 3.2, { k: 1 })], { bezImena: ['A', 'B', 'C', 'D'], velicina: 160 }));

  Z(1, 'Koliko osa simetrije ima pravougaonik koji nije kvadrat?',
    ['$2$', '$4$', '$1$', '$0$'],
    [K('Ose kroz sredine naspramnih stranica su ose simetrije.', ['ose']),
     K('Dijagonale NISU ose: presavijanjem po dijagonali ćoškovi ne padaju jedan na drugi.', ['dij'])],
    G({ A: [-3, -1.5], B: [3, -1.5], C: [3, 1.5], D: [-3, 1.5] }, [{ p: 'ABCD', b: 0 }, ...ose([0, 90], 3.8, { k: 1 }), { p: 'ABC', b: 1, odrazi: 'AC', k: 2, id: 'dij', prazno: 1 }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 180 }));

  Z(1, 'Koliko osa simetrije ima jednakostranični trougao?',
    ['$3$', '$1$', '$6$', '$0$'],
    [K('Svaka osa prolazi kroz teme i sredinu naspramne stranice.', ['ose']),
     K('Tri temena – tri ose.')],
    G(pravilni(3, 2.5, [0, 0], 90), [{ p: 'ABC', b: 0 }, ...ose([90, 210, 330], 3, { k: 1 })], { bezImena: ['A', 'B', 'C'], velicina: 160 }));

  Z(1, 'Koliko osa simetrije ima krug?',
    ['beskonačno mnogo', '$1$', '$2$', '$4$'],
    [K('Svaka prava kroz centar deli krug na dve jednake polovine koje se poklapaju presavijanjem.', ['ose']),
     K('Takvih pravih (prečnika) ima beskonačno mnogo.')],
    G(O, [krug(0, 0, 2.5, { b: 0 }), ...ose([0, 30, 60, 90, 120, 150], 3, { k: 1 })], { ...bez, velicina: 160 }));

  Z(2, 'Koje slovo ima i vertikalnu i horizontalnu osu simetrije?',
    ['$H$', '$A$', '$E$', '$K$'],
    [K('$A$ ima samo vertikalnu, $E$ i $K$ samo horizontalnu osu.'),
     K('$H$ ima obe ose.', ['ose'])],
    G({ O: [0, 0] }, [{ lin: [[-1, -1.5], [-1, 1.5]], b: 0, debljina: 6 }, { lin: [[1, -1.5], [1, 1.5]], b: 0, debljina: 6 }, { lin: [[-1, 0], [1, 0]], b: 0, debljina: 6 }, ...ose([0, 90], 2.2, { k: 2 })], { ...bez, velicina: 110 }));

  Z(2, 'Koliko osa simetrije ima pravilni šestougao?',
    ['$6$', '$3$', '$12$', '$2$'],
    [K('Tri ose prolaze kroz naspramna temena.'),
     K('Još tri kroz sredine naspramnih stranica – ukupno $6$.', ['ose'])],
    G(pravilni(6, 2.5, [0, 0], 0), [{ p: 'ABCDEF', b: 0 }, ...ose([0, 60, 120], 3, { k: 1, b: 3 }), ...ose([30, 90, 150], 3, { k: 2, b: 5 })], { bezImena: ['A', 'B', 'C', 'D', 'E', 'F'], velicina: 160 }));

  Z(2, 'Koliko osa simetrije ima jednakokraki trapez?',
    ['$1$', '$2$', '$0$', '$4$'],
    [K('Jedina osa prolazi kroz sredine osnovica.', ['ose']),
     K('Presavijanjem po njoj kraci se poklapaju.')],
    G({ A: [-3, -1.5], B: [3, -1.5], C: [1.5, 1.5], D: [-1.5, 1.5] }, [{ p: 'ABCD', b: 0 }, ...ose([90], 2.2, { k: 1 })], { bezImena: ['A', 'B', 'C', 'D'], velicina: 170 }));

  Z(2, 'Koliko osa simetrije ima paralelogram koji nije ni pravougaonik ni romb?',
    ['$0$', '$2$', '$1$', '$4$'],
    [K('Presavijanje po dijagonali ili po pravoj kroz sredine stranica ne poklapa delove.', ['f']),
     K('Paralelogram nema osu simetrije (ali ima centar simetrije).')],
    G({ A: [-3, -1.5], B: [2, -1.5], C: [3, 1.5], D: [-2, 1.5], m1: [-0.5, -1.5], m2: [0.5, 1.5] }, [{ p: 'ABCD', b: 0 }, { p: 'ABCD', b: 1, odrazi: 'm1m2', k: 1, id: 'f', prazno: 1 }], { bezImena: ['A', 'B', 'C', 'D', 'm1', 'm2'], velicina: 180 }));

  Z(3, 'Koliko najmanje kvadratića treba još obojiti da lik postane simetričan u odnosu na isprekidanu osu?',
    ['$3$', '$4$', '$2$', '$5$'],
    [K('Svaki obojen kvadratić mora imati par sa druge strane ose, na istom rastojanju.'),
     K('Levo su $5$ kvadratića, desno već $2$ imaju svoj par – nedostaju $3$.', ['n'])],
    G({ s1: [4, 0], s2: [4, 5] }, [papir(0, 8, 0, 5), ...[[3, 3], [2, 3], [2, 2], [3, 1], [1, 2]].map(([x, y]) => pr(x, y, 1, 1, { b: 0, gusto: 1 })), ...[[4, 3], [5, 2]].map(([x, y]) => pr(x, y, 1, 1, { b: 0, gusto: 1 })), ...[[5, 3], [4, 1], [6, 2]].map(([x, y]) => pr(x, y, 1, 1, { b: 1, gusto: 1, k: 2, id: 'n', crtaj: 1 })), osa({}, 's1', 's2')], { bezImena: ['s1', 's2'], velicina: 220 }));
  proveri(true, 'simetrija mreže');

  Z(3, 'Koliko osa simetrije ima figura od dva jednaka kruga koji se dodiruju?',
    ['$2$', '$1$', '$4$', 'beskonačno mnogo'],
    [K('Jedna osa prolazi kroz oba centra.', ['ose']),
     K('Druga je normalna na nju kroz dodirnu tačku – presavijanjem se krugovi zamene.'),
     K('Ukupno $2$.')],
    G(O, [krug(-2, 0, 2, { b: 0 }), krug(2, 0, 2, { b: 1 }), ...ose([0, 90], 4.6, { k: 1 })], { ...bez, velicina: 200 }));

  // ════════════════ 7.3 Simetrala duži i normala ════════════════
  L('Simetrala duži i konstrukcija normale');

  Z(1, 'Tačka $M$ je na simetrali duži $AB$ i $MA = 5 cm$. Koliko je $MB$?',
    ['$5 cm$', '$10 cm$', '$2 cm 5 mm$', 'ne može se odrediti'],
    [K('Svaka tačka simetrale duži jednako je udaljena od krajeva duži.'),
     K('$MB = MA = 5 cm$.', ['mb'])],
    G({ A: [-3, 0], B: [3, 0], M: [0, 3], s1: [0, -1.5], s2: [0, 4] }, [{ d: 'AB', b: 0 }, osa({}, 's1', 's2'), { d: 'MA', o: '5 cm', b: 2 }, { d: 'MB', b: 1, id: 'mb', k: 2, crtaj: 1 }, { tacka: 'M' }], { bezImena: ['s1', 's2'], velicina: 200 }));

  Z(1, 'Simetrala duži $AB = 8 cm$ seče duž u tački $S$. Koliko je $AS$?',
    ['$4 cm$', '$8 cm$', '$2 cm$', '$16 cm$'],
    [K('Simetrala prolazi kroz sredinu duži i normalna je na nju.'),
     K('$AS = 8 : 2 = 4 cm$.')],
    G({ A: [-4, 0], B: [4, 0], S: [0, 0, 315], s1: [0, -2.5], s2: [0, 2.5], X: [4, 0] }, [{ d: 'AB', b: 0, o: '8 cm' }, osa({}, 's1', 's2'), { pu: 'XSs2' }, { tacka: 'S' }], { bezImena: ['s1', 's2', 'X'], velicina: 200 }));

  Z(2, 'Pri konstrukciji simetrale duži $AB = 6 cm$ šestarom se crtaju lukovi iz $A$ i iz $B$. Kojim poluprečnikom NE može?',
    ['$2 cm$', '$4 cm$', '$5 cm$', '$6 cm$'],
    [K('Lukovi moraju da se seku: poluprečnik mora biti veći od polovine duži ($3 cm$).', ['l']),
     K('Lukovi poluprečnika $2 cm$ se ne dodiruju – presečnih tačaka nema.')],
    G({ A: [-3, 0], B: [3, 0] }, [{ d: 'AB', b: 0 }, { l: 'A', r: 4, od: -60, do: 60, b: 1, crtaj: 1, k: 1, id: 'l' }, { l: 'B', r: 4, od: 120, do: 240, b: 1, crtaj: 1, kasni: 1, k: 1, id: 'l' }, { lin: [[0, -3], [0, 3]], b: 3, isp: 1, k: 1 }, { l: 'A', r: 2, od: -60, do: 60, b: 5, crtaj: 1, k: 2 }, { l: 'B', r: 2, od: 120, do: 240, b: 5, crtaj: 1, kasni: 1, k: 2 }], { velicina: 200 }));

  Z(2, 'Tačka $M$ je na simetrali duži $AB$ i na simetrali duži $BC$ (u trouglu $ABC$), a $MA = 4 cm$. Koliko je $MC$?',
    ['$4 cm$', '$8 cm$', '$2 cm$', 'ne može se odrediti'],
    [K('$M$ je na simetrali $AB$: $MA = MB = 4 cm$.'),
     K('$M$ je na simetrali $BC$: $MB = MC = 4 cm$. (Krug sa centrom $M$ prolazi kroz sva tri temena.)', ['k'])],
    (() => { const t = { A: [-3, -1], B: [3, -1], C: [1, 3] }; const M = [0, 0]; proveri(Math.abs(Math.hypot(1 - M[0], 3 - M[1]) - Math.hypot(-3 - M[0], -1 - M[1])) < 1e-9, 'centar opisanog'); return G({ ...t, M }, [{ p: 'ABC', b: 0 }, { tacka: 'M' }, { d: 'MA', b: 2 }, { d: 'MC', b: 1, k: 2 }, { kr: 'M', kroz: 'A', b: 3, k: 2, id: 'k', crtaj: 1 }], { velicina: 200 }); })());

  Z(1, 'Koliko normala na pravu $p$ može da se povuče kroz tačku $A$ koja leži na $p$?',
    ['tačno jedna', 'dve', 'nijedna', 'beskonačno mnogo'],
    [K('Kroz svaku tačku (na pravoj ili van nje) prolazi tačno jedna normala na datu pravu.')]);

  Z(2, 'Tačka $M$ je na simetrali duži $AB = 6 cm$ i $MA = 7 cm$. Koliki je obim trougla $ABM$?',
    ['$20 cm$', '$13 cm$', '$27 cm$', '$19 cm$'],
    [K('$MB = MA = 7 cm$ (tačka simetrale).'),
     K('$O = 6 + 7 + 7 = 20 cm$.')],
    G({ A: [-3, 0], B: [3, 0], M: [0, 6.32] }, [{ p: 'ABM', b: 0 }, { d: 'AB', o: '6 cm' }, { d: 'AM', o: '7 cm' }, { d: 'BM', o: '?', b: 1 }], { velicina: 180 }));

  Z(2, 'Kroz koju tačku prolazi simetrala osnovice jednakokrakog trougla?',
    ['kroz teme naspram osnovice', 'kroz teme na osnovici', 'nijedno teme', 'kroz sredinu kraka'],
    [K('Vrh jednakokrakog trougla je jednako udaljen od krajeva osnovice (kraci su jednaki).'),
     K('Zato leži na simetrali osnovice – ona je i osa simetrije trougla.', ['s'])],
    G({ A: [-3, 0], B: [3, 0], C: [0, 4], s1: [0, -1], s2: [0, 5] }, [{ p: 'ABC', b: 0 }, osa({}, 's1', 's2', { k: 2, id: 's' })], { bezImena: ['s1', 's2'], velicina: 170 }));

  Z(3, 'Duž $AB = 6 cm$. Koliko tačaka simetrale duži $AB$ je udaljeno tačno $5 cm$ od tačke $A$?',
    ['$2$', '$1$', '$0$', 'beskonačno mnogo'],
    [K('Tražene tačke su preseci simetrale i kružnice sa centrom $A$ i poluprečnikom $5 cm$.', ['k']),
     K('Kružnica seče simetralu iznad i ispod duži ($5 > 3$): dve tačke (udaljene $4 cm$ od sredine).')],
    G({ A: [-3, 0], B: [3, 0], s1: [0, -5], s2: [0, 5] }, [{ d: 'AB', b: 0 }, osa({}, 's1', 's2'), { kr: 'A', r: 5, b: 1, k: 1, id: 'k', crtaj: 1 }, { tx: '●', at: [0, 4], b: 2, k: 2 }, { tx: '●', at: [0, -4], b: 2, k: 2 }], { bezImena: ['s1', 's2'], velicina: 200 }));

  Z(3, 'Kuće $A$ i $B$ su sa iste strane pravog puta $p$. Gde na putu treba postaviti stanicu da bude jednako udaljena od obe kuće?',
    ['u preseku simetrale duži $AB$ i puta', 'na sredini duži $AB$', 'u podnožju normale iz $A$', 'u podnožju normale iz $B$'],
    [K('Tačke jednako udaljene od $A$ i $B$ su tačke simetrale duži $AB$.', ['s']),
     K('Stanica mora biti i na putu – dakle u preseku simetrale i puta.', ['t'])],
    (() => {
      const A = [-2, 3], B = [2, 1.5];
      // simetrala: kroz sredinu, normalna na AB; presek sa y = 0
      const S = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = [B[0] - A[0], B[1] - A[1]];
      const x = S[0] + (S[1] * d[1]) / d[0];
      const T = [r(x), 0];
      return G({ A, B, T, p1: [-4, 0], p2: [4, 0], s1: [r(S[0] - 0.4 * d[1]), r(S[1] + 0.4 * d[0])] }, [{ d: 'p1p2', b: 4, debljina: 6 }, { tx: 'p', at: [4.2, 0.4] }, { tacka: 'AB' }, { d: 's1T', b: 3, isp: 1, k: 1, id: 's' }, { tacka: 'T', k: 2, id: 't' }, { d: 'AT', b: 1, k: 2 }, { d: 'BT', b: 1, k: 2 }], { bezImena: ['p1', 'p2', 's1'], velicina: 200 });
    })());

  // ════════════════ 7.4 Simetrala ugla ════════════════
  L('Simetrala ugla');

  Z(1, 'Simetrala deli ugao od $70°$ na dva ugla. Koliki je svaki?',
    ['$35°$', '$70°$', '$140°$', '$20°$'],
    [K('Simetrala deli ugao na dva jednaka dela.'),
     K('$70° : 2 = 35°$.', ['u'])],
    G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 70), S: naKrugu([0, 0], 4.5, 35) }, [{ d: 'OA' }, { d: 'OB' }, { u: 'AOB', o: '70°', b: 0, r: 50 }, { d: 'OS', b: 3, isp: 1, k: 1, crtaj: 1 }, { u: 'AOS', b: 1, id: 'u', k: 2, r: 30 }, { u: 'SOB', b: 2, id: 'u', k: 2, r: 34 }], { bezImena: ['S'], velicina: 200 }));

  Z(1, 'Tačka $M$ je na simetrali ugla i udaljena je $3 cm$ od jednog kraka. Koliko je udaljena od drugog kraka?',
    ['$3 cm$', '$6 cm$', '$1 cm 5 mm$', 'ne može se odrediti'],
    [K('Simetrala ugla je osa simetrije ugla: presavijanjem po njoj kraci se poklapaju.'),
     K('Zato je svaka tačka simetrale jednako udaljena od oba kraka: $3 cm$.', ['f'])],
    (() => {
      const O2 = [0, 0], u = 60, M = naKrugu(O2, 4, 30);
      const N1 = [M[0], 0], N2v = naKrugu(O2, 4 * Math.cos((30 * Math.PI) / 180), 60);
      return G({ O: O2, A: [5, 0], B: naKrugu(O2, 5, u), M, N: N1, P: N2v.map(r), S: naKrugu(O2, 5, 30) }, [{ d: 'OA' }, { d: 'OB' }, { d: 'OS', b: 3, isp: 1 }, { tacka: 'M' }, { d: 'MN', o: '3 cm', b: 2 }, { d: 'MP', b: 1, k: 2, id: 'f' }, { d: 'MN', b: 1, odrazi: 'OS', k: 2 }], { bezImena: ['N', 'P', 'S', 'A', 'B'], velicina: 200 });
    })());

  Z(1, 'Ugao između simetrale ugla i njegovog kraka je $48°$. Koliki je ugao?',
    ['$96°$', '$48°$', '$24°$', '$132°$'],
    [K('Simetrala deli ugao na dve jednake polovine.'),
     K('Ceo ugao: $2 · 48° = 96°$.')]);

  Z(1, 'Šta je simetrala opruženog ugla u odnosu na njegove krake?',
    ['normala', 'paralela', 'krak', 'ne postoji'],
    [K('Opružen ugao ima $180°$, polovina je $90°$.'),
     K('Simetrala zaklapa prav ugao sa kracima – normalna je na pravu koju oni čine.')]);

  Z(2, 'Kakav ugao zaklapaju simetrale dva uporedna ugla?',
    ['prav ($90°$)', 'oštar ($45°$)', 'opružen', 'zavisi od uglova'],
    [K('Uporedni uglovi: $α + β = 180°$. Simetrale uzimaju polovine: ${α|2} + {β|2}$.'),
     K('$= {180°|2} = 90°$ – uvek prav ugao!', ['u'])],
    (() => {
      const a = 50;
      return G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, a), C: [-4, 0], S: naKrugu([0, 0], 4, a / 2), T: naKrugu([0, 0], 4, 90 + a / 2) }, [{ d: 'OA' }, { d: 'OB' }, { d: 'OC' }, { u: 'AOB', b: 0, r: 26 }, { u: 'BOC', b: 1, r: 26 }, { d: 'OS', b: 3, isp: 1, k: 1, crtaj: 1 }, { d: 'OT', b: 5, isp: 1, k: 1, crtaj: 1, kasni: 0.8 }, { pu: 'SOT', k: 2, id: 'u' }], { bezImena: ['A', 'B', 'C', 'S', 'T'], velicina: 200 });
    })());

  Z(2, '$∠AOB = 80°$. $OC$ je simetrala ugla $∠AOB$, a $OD$ je simetrala ugla $∠AOC$. Koliki je $∠DOB$?',
    ['$60°$', '$20°$', '$40°$', '$50°$'],
    [K('$∠AOC = 80° : 2 = 40°$, a $∠AOD = 40° : 2 = 20°$.'),
     K('$∠DOB = 80° − 20° = 60°$.', ['x'])],
    G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 80), C: naKrugu([0, 0], 4, 40), D: naKrugu([0, 0], 4, 20) }, [{ d: 'OA' }, { d: 'OB' }, { d: 'OC', b: 3, isp: 1 }, { d: 'OD', b: 5, isp: 1 }, { u: 'DOB', b: 1, k: 2, id: 'x', r: 40 }], { velicina: 200 }));

  Z(2, 'Ugao je $130°$. Koliki ugao zaklapa njegova simetrala sa produžetkom jednog kraka (preko temena)?',
    ['$115°$', '$65°$', '$50°$', '$25°$'],
    [K('Simetrala zaklapa $130° : 2 = 65°$ sa krakom.'),
     K('Sa produžetkom kraka zaklapa uporedni ugao: $180° − 65° = 115°$.', ['x'])],
    G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 130), S: naKrugu([0, 0], 4, 65), C: [-4, 0] }, [{ d: 'OA' }, { d: 'OB' }, { d: 'OC', b: 4, isp: 1 }, { d: 'OS', b: 3 }, { u: 'AOB', o: '130°', b: 0, r: 22 }, { u: 'SOC', b: 1, k: 2, id: 'x', r: 40 }], { bezImena: ['A', 'B', 'C', 'S'], velicina: 200 }));

  Z(1, 'Simetrala pravog ugla deli ga na uglove od:',
    ['$45°$', '$90°$', '$30°$', '$60°$'],
    [K('$90° : 2 = 45°$ – na mreži kvadratića to je dijagonala kvadratića.', ['s'])],
    G({ O: [0, 0], A: [4, 0], B: [0, 4], S: [4, 4] }, [papir(0, 4, 0, 4), { d: 'OA', b: 0 }, { d: 'OB', b: 0 }, { pu: 'AOB' }, { d: 'OS', b: 3, isp: 1, k: 1, id: 's', crtaj: 1 }], { bezImena: ['A', 'B', 'S'], velicina: 160 }));

  Z(3, 'Koja tačka u trouglu je jednako udaljena od sve tri stranice?',
    ['presek simetrala uglova', 'presek simetrala stranica', 'sredina najduže stranice', 'teme najvećeg ugla'],
    [K('Tačka simetrale ugla je jednako udaljena od krakova tog ugla.'),
     K('Presek dve simetrale uglova je jednako udaljen od sve tri stranice – to je centar upisanog kruga.', ['k'])],
    (() => {
      const A = [0, 0], B = [6, 0], C = [1.5, 4];
      const a = Math.hypot(B[0] - C[0], B[1] - C[1]), b = Math.hypot(A[0] - C[0], A[1] - C[1]), c = 6;
      const I = [(a * A[0] + b * B[0] + c * C[0]) / (a + b + c), (a * A[1] + b * B[1] + c * C[1]) / (a + b + c)];
      const ri = I[1];
      return G({ A, B, C, I: I.map(r) }, [{ p: 'ABC', b: 0 }, { d: 'AI', b: 3, isp: 1, k: 1 }, { d: 'BI', b: 3, isp: 1, k: 1 }, { d: 'CI', b: 3, isp: 1, k: 1 }, { kr: 'I', r: r(ri), b: 1, k: 2, id: 'k', crtaj: 1 }, { tacka: 'I', k: 1 }], { bezImena: ['I'], velicina: 200 });
    })());

  Z(3, 'Simetrale dva unakrsna ugla zajedno čine:',
    ['jednu pravu (opružen ugao)', 'prav ugao', 'ugao od $45°$', 'dve paralelne prave'],
    [K('Unakrsni uglovi su jednaki i „naspramni“: okretanje za $180°$ oko temena prevodi jedan u drugi.'),
     K('Zato i njihove simetrale prelaze jedna u drugu okretanjem za $180°$ – leže na istoj pravoj.', ['s'])],
    G({ O: [0, 0], A: naKrugu([0, 0], 4, 20), B: naKrugu([0, 0], 4, 100), C: naKrugu([0, 0], 4, 200), D: naKrugu([0, 0], 4, 280), S: naKrugu([0, 0], 4, 60), T: naKrugu([0, 0], 4, 240) }, [{ d: 'AC' }, { d: 'BD' }, { u: 'AOB', b: 0 }, { u: 'COD', b: 0 }, { d: 'OS', b: 3, k: 1, crtaj: 1, id: 's' }, { d: 'OT', b: 3, k: 1, crtaj: 1, kasni: 0.8, id: 's' }], { bezImena: ['A', 'B', 'C', 'D', 'S', 'T'], velicina: 200 }));

  // ════════════════ dopune ════════════════
  L('Simetrala duži i konstrukcija normale');
  Z(1, 'Koliko tačaka prave $AB$ je jednako udaljeno od tačaka $A$ i $B$?',
    ['jedna – sredina duži $AB$', 'dve', 'nijedna', 'beskonačno mnogo'],
    [K('Tačke jednako udaljene od $A$ i $B$ leže na simetrali duži $AB$.', ['s']),
     K('Simetrala seče pravu $AB$ u jednoj tački – sredini duži.')],
    G({ A: [-3, 0], B: [3, 0], S: [0, 0, 315], s1: [0, -2], s2: [0, 2.5] }, [{ d: 'AB', b: 0 }, osa({}, 's1', 's2', { k: 1, id: 's' }), { tacka: 'S', k: 2 }], { bezImena: ['s1', 's2'], velicina: 180 }));
};
