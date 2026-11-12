// Tema 5: Krug (lekcije 5.1–5.7)
module.exports = ({ L, Z, K, G, r, S3, proveri, pravilni, naKrugu }) => {
  const kp = (ugao, R = 5, c = [0, 0]) => naKrugu(c, R, ugao); // tačka na kružnici

  // ════════════════ 5.1 Krug i kružnica ════════════════
  L('Krug i kružnica');

  Z(1, 'Kolika je najduža tetiva kruga poluprečnika $7 cm$?',
    ['$14 cm$', '$7 cm$', '$7π cm$', '$49 cm$'],
    [K('Tetiva spaja dve tačke kružnice. Najduža je ona koja prolazi kroz centar – prečnik.', ['pr']),
     K('$d = 2r = 2 · 7 = 14 cm$')],
    G({ O: [0, 0, 90], A: kp(200), B: kp(20), C: kp(120), D: kp(60) },
      [{ kr: 'O', r: 5, b: 4 }, { d: 'CD', b: 2 }, { d: 'AB', b: 1, id: 'pr', k: 1 }, { d: 'OB', o: '7 cm', k: 0, isp: 1 }, { tacka: 'O' }], { bezImena: ['A', 'B', 'C', 'D'], velicina: 220 }));

  Z(1, 'Rastojanje centra kruga poluprečnika $3 cm$ od prave $p$ je $5 cm$. Kakav je međusobni položaj prave i kruga?',
    ['prava i krug nemaju zajedničkih tačaka', 'prava dodiruje krug', 'prava seče krug u dve tačke', 'prava prolazi kroz centar'],
    [K('Upoređujemo rastojanje $d$ centra od prave sa poluprečnikom $r$.', ['d']),
     K('$d = 5 > 3 = r$ – prava je dalje od centra nego bilo koja tačka kružnice, pa je ne dodiruje.'),
     K('Za $d = r$ prava bi bila tangenta, a za $d < r$ sečica.')],
    G({ O: [0, 0], P: [0, -5, -90], a: [-6, -5], b: [6, -5], c: [2.12, 2.12] },
      [{ kr: 'O', r: 3, b: 4 }, { d: 'ab', b: 3 }, { d: 'OP', isp: 1, b: 1, o: 'd = 5', id: 'd' }, { pu: 'OPb' }, { d: 'Oc', o: 'r = 3', k: 0 }, { tacka: 'O' }], { bezImena: ['P'], velicina: 220 }));

  Z(1, 'Dve kružnice imaju poluprečnike $5 cm$ i $3 cm$, a rastojanje njihovih centara je $8 cm$. Kakav im je međusobni položaj?',
    ['dodiruju se spolja', 'seku se u dve tačke', 'dodiruju se iznutra', 'nemaju zajedničkih tačaka'],
    [K('Zbir poluprečnika: $5 + 3 = 8 cm$ – jednak rastojanju centara.'),
     K('Kružnice se dodiruju u jednoj tački koja leži na duži $O₁O₂$ – spoljašnji dodir.', ['t'])],
    G({ 'O₁': [0, 0], 'O₂': [8, 0], T: [5, 0, 90] },
      [{ kr: 'O₁', r: 5, b: 0 }, { kr: 'O₂', r: 3, b: 1 }, { d: 'O₁O₂', isp: 1, o: '8 cm' }, { tacka: 'T', b: 3, k: 2, id: 't' }, { tacka: 'O₁O₂' }], { bezImena: ['T'], velicina: 260 }));

  Z(2, 'Tetiva kruga poluprečnika $10 cm$ udaljena je od centra $6 cm$. Kolika je dužina tetive?',
    ['$16 cm$', '$8 cm$', '$12 cm$', '$2√{34} cm$'],
    [K('Normala iz centra na tetivu polovi tetivu: trougao $OMB$ je pravougli.', ['omb']),
     K('$MB² = 10² − 6² = 64$, $MB = 8 cm$.', ['mb']),
     K('Tetiva: $AB = 2 · 8 = 16 cm$.', ['ab'])],
    G({ O: [0, 0, 90], A: [-8, -6], B: [8, -6], M: [0, -6, -90] },
      [{ kr: 'O', r: 10, b: 4 }, { d: 'AB', b: 3, id: 'ab' }, { p: 'OMB', b: 1, id: 'omb', k: 1 }, { d: 'OM', isp: 1, o: '6 cm' }, { d: 'OA', o: '10 cm' }, { d: 'MB', id: 'mb', k: 2 }, { pu: 'OMB' }], { velicina: 240 }));

  Z(2, 'Tačka $P$ je od centra kruga poluprečnika $5 cm$ udaljena $13 cm$. Kolika je tangentna duž iz $P$ do tačke dodira?',
    ['$12 cm$', '$8 cm$', '$18 cm$', '$√{194} cm$'],
    [K('Tangenta je normalna na poluprečnik u tački dodira $T$: trougao $OTP$ je pravougli sa pravim uglom kod $T$.', ['otp']),
     K('$PT² = 13² − 5² = 169 − 25 = 144$', ['pt']),
     K('$PT = 12 cm$')],
    G({ O: [0, 0], P: [13, 0], T: [1.923, 4.615], S: [1.923, -4.615] },
      [{ kr: 'O', r: 5, b: 4 }, { d: 'OP', o: '13 cm' }, { d: 'OT', o: '5' }, { p: 'OTP', b: 1, id: 'otp', k: 1 }, { pu: 'OTP' }, { d: 'PT', b: 3, id: 'pt' }, { d: 'PS', b: 3, isp: 1 }, { tacka: 'OP' }], { bezImena: ['S'], velicina: 260 }));
  proveri(Math.abs(Math.hypot(13 - 1.923, 4.615) - 12) < 0.01 && Math.abs(Math.hypot(1.923, 4.615) - 5) < 0.01, 'tangenta 5-12-13');

  Z(2, 'Kružnice poluprečnika $7 cm$ i $3 cm$ imaju centre na rastojanju $2 cm$. Kakav im je međusobni položaj?',
    ['manja je unutar veće, bez zajedničkih tačaka', 'dodiruju se iznutra', 'seku se u dve tačke', 'dodiruju se spolja'],
    [K('Razlika poluprečnika: $7 − 3 = 4 cm$.'),
     K('Rastojanje centara $2 cm$ je manje od $4 cm$: najdalja tačka manje kružnice je od $O₁$ udaljena samo $2 + 3 = 5 < 7$.'),
     K('Manja kružnica je cela unutar veće. (Za rastojanje $4 cm$ bio bi unutrašnji dodir.)')],
    G({ 'O₁': [0, 0, 180], 'O₂': [2, 0, 0] }, [{ kr: 'O₁', r: 7, b: 0 }, { kr: 'O₂', r: 3, b: 1 }, { tacka: 'O₁O₂' }], { velicina: 220 }));

  Z(2, 'Iz tačke $P$ povučene su dve tangente na krug, sa tačkama dodira $A$ i $B$. Ugao $APB$ je $60°$, a $PA = 8 cm$. Kolika je tetiva $AB$?',
    ['$8 cm$', '$4 cm$', '$8√{3} cm$', '$16 cm$'],
    [K('Tangentne duži iz iste tačke su jednake: $PA = PB = 8 cm$ (trouglovi $OAP$ i $OBP$ su podudarni).', ['pa', 'pb']),
     K('Trougao $PAB$ je jednakokraki sa uglom od $60°$ između krakova – jednakostranični.', ['pab']),
     K('$AB = 8 cm$.')],
    G({ O: [0, 0], P: [-9.24, 0], A: [-2.31, 4], B: [-2.31, -4] },
      [{ kr: 'O', r: 4.62, b: 4 }, { d: 'PA', b: 3, id: 'pa', o: '8 cm' }, { d: 'PB', b: 3, id: 'pb' }, { u: 'BPA', o: '60°', r: 30 }, { d: 'OA', isp: 1 }, { d: 'OB', isp: 1 }, { pu: 'OAP' }, { pu: 'PBO' }, { p: 'PAB', b: 1, id: 'pab', k: 2 }, { tacka: 'O' }], { velicina: 260 }));

  Z(3, 'U krugu poluprečnika $10 cm$ povučene su dve paralelne tetive, duge $12 cm$ i $16 cm$, sa iste strane centra. Koliko su udaljene jedna od druge?',
    ['$2 cm$', '$14 cm$', '$4 cm$', '$6 cm$'],
    [K('Tetiva $12 cm$: $d₁² = 10² − 6² = 64$, $d₁ = 8 cm$ od centra.', ['t1']),
     K('Tetiva $16 cm$: $d₂² = 10² − 8² = 36$, $d₂ = 6 cm$ od centra.', ['t2']),
     K('Sa iste strane centra: $8 − 6 = 2 cm$. (Da su sa različitih strana, bilo bi $14 cm$.)')],
    G({ O: [0, 0], A: [-6, 8], B: [6, 8], C: [-8, 6], D: [8, 6], M: [0, 8], N: [0, 6] },
      [{ kr: 'O', r: 10, b: 4 }, { d: 'AB', b: 1, o: '12 cm' }, { d: 'CD', b: 2, o: '16 cm' }, { d: 'OM', isp: 1, b: 3 }, { p: 'OMB', b: 1, k: 1, id: 't1' }, { p: 'ODN', b: 2, k: 2, id: 't2', prazno: 1 }, { d: 'OB', k: 1 }, { d: 'OD', k: 2 }, { tacka: 'O' }], { bezImena: ['A', 'B', 'C', 'D', 'M', 'N'], velicina: 240 }));

  Z(3, 'Tri kruga dodiruju se spolja svaki sa svakim. Rastojanja njihovih centara su $5 cm$, $6 cm$ i $7 cm$. Koliki je poluprečnik najvećeg kruga?',
    ['$4 cm$', '$3,5 cm$', '$3 cm$', '$5 cm$'],
    [K('Kod spoljašnjeg dodira rastojanje centara je zbir poluprečnika: $r₁ + r₂ = 5$, $r₂ + r₃ = 6$, $r₁ + r₃ = 7$.'),
     K('Saberemo sve tri jednakosti: $2(r₁ + r₂ + r₃) = 18$, pa je $r₁ + r₂ + r₃ = 9$.'),
     K('$r₃ = 9 − 5 = 4$, $r₁ = 9 − 6 = 3$, $r₂ = 9 − 7 = 2$. Najveći je $4 cm$.', ['k3'])],
    G({ 'O₁': [0, 0, 200], 'O₂': [5, 0, -20], 'O₃': [3.8, 5.879, 90] },
      [{ kr: 'O₁', r: 3, b: 0 }, { kr: 'O₂', r: 2, b: 1 }, { kr: 'O₃', r: 4, b: 2, id: 'k3' }, { p: 'O₁O₂O₃', b: 3, prazno: 1, isp: 1 }, { d: 'O₁O₂', o: '5' }, { d: 'O₂O₃', o: '6' }, { d: 'O₁O₃', o: '7' }], { velicina: 240 }));
  proveri(Math.abs(Math.hypot(3.8, 5.879) - 7) < 0.01 && Math.abs(Math.hypot(1.2, 5.879) - 6) < 0.01, 'tri kruga: rastojanja centara 7 i 6');

  Z(3, 'U pravougli trougao sa katetama $6 cm$ i $8 cm$ upisan je krug. Koliki je njegov poluprečnik?',
    ['$2 cm$', '$2,5 cm$', '$3 cm$', '$5 cm$'],
    [K('Hipotenuza: $c = √{6² + 8²} = 10 cm$.'),
     K('Tangentne duži iz istog temena su jednake. Iz temena pravog ugla $C$ obe su jednake $r$ (sa poluprečnicima grade kvadrat).', ['kv']),
     K('Iz $A$: $8 − r$, iz $B$: $6 − r$, a one zajedno čine hipotenuzu: $(8 − r) + (6 − r) = 10$.'),
     K('$14 − 2r = 10$, pa je $r = 2 cm$.')],
    G({ C: [0, 0, 225], A: [8, 0], B: [0, 6], O: [2, 2], M: [2, 0], N: [0, 2] },
      [{ p: 'ABC', b: 0 }, { pu: 'ACB' }, { kr: 'O', r: 2, b: 1 }, { p: 'CMON', b: 3, id: 'kv', k: 2 }, { d: 'CA', o: '8 cm' }, { d: 'CB', o: '6 cm' }], { bezImena: ['O', 'M', 'N'] }));

  // ════════════════ 5.2 Centralni i periferijski ugao ════════════════
  L('Centralni i periferijski ugao kruga');

  // krug sa centralnim (AOB) i periferijskim (ACB) uglom
  const ugloviKruga = (a, b, c, x = {}) => G({ O: [0, 0, x.ugO ?? -90], A: kp(a), B: kp(b), C: kp(c), ...(x.t || {}) },
    [{ kr: 'O', r: 5, b: 4 }, { d: 'OA', b: 1, k: x.kc ?? 0 }, { d: 'OB', b: 1, k: x.kc ?? 0 }, { u: 'AOB', b: 1, id: 'cu', o: x.oc, k: x.kc ?? 0 },
     { d: 'CA', b: 3, k: x.kp ?? 0 }, { d: 'CB', b: 3, k: x.kp ?? 0 }, { u: 'ACB', b: 3, id: 'pu', o: x.op, r: 30, k: x.kp ?? 0 }, { tacka: 'O' }, ...(x.dod || [])],
    { velicina: 240 });

  Z(1, 'Centralni ugao $AOB$ je $80°$. Koliki je periferijski ugao $ACB$ nad istim lukom?',
    ['$40°$', '$80°$', '$160°$', '$100°$'],
    [K('Periferijski ugao je jednak polovini centralnog ugla nad istim lukom.', ['cu', 'pu']),
     K('$∠ACB = 80° : 2 = 40°$')],
    ugloviKruga(-130, -50, 90, { oc: '80°', op: '?' }));

  Z(1, 'Koliki je periferijski ugao nad prečnikom kruga?',
    ['$90°$', '$180°$', '$45°$', '$60°$'],
    [K('Prečniku odgovara centralni ugao od $180°$ (opružen ugao).', ['ab']),
     K('Periferijski ugao je polovina: $180° : 2 = 90°$ – to je Talesova teorema.', ['pu'])],
    G({ O: [0, 0, -90], A: kp(180), B: kp(0), C: kp(60) },
      [{ kr: 'O', r: 5, b: 4 }, { d: 'AB', b: 1, id: 'ab' }, { d: 'CA', b: 3 }, { d: 'CB', b: 3 }, { u: 'ACB', b: 3, id: 'pu', o: '?', r: 26 }, { tacka: 'O' }], { velicina: 240 }));

  Z(1, 'Periferijski ugao nad lukom $AB$ je $35°$. Koliki je centralni ugao nad tim lukom?',
    ['$70°$', '$35°$', '$17,5°$', '$145°$'],
    [K('Centralni ugao je dva puta veći od periferijskog nad istim lukom.'),
     K('$∠AOB = 2 · 35° = 70°$', ['cu'])],
    ugloviKruga(-125, -55, 90, { oc: '?', op: '35°', kc: 0 }));

  Z(2, 'Tačke $C$ i $D$ su na istom luku kružnice nad tetivom $AB$, i $∠ACB = 50°$. Koliki je $∠ADB$?',
    ['$50°$', '$100°$', '$130°$', '$25°$'],
    [K('Oba ugla su periferijska nad istim lukom $AB$.', ['pu', 'pd']),
     K('Svaki je jednak polovini istog centralnog ugla – pa su jednaki: $∠ADB = 50°$.')],
    ugloviKruga(-140, -40, 120, { op: '50°', kc: 1, oc: '100°', t: { D: kp(40) }, dod: [{ d: 'DA', b: 2 }, { d: 'DB', b: 2 }, { u: 'ADB', b: 2, o: '?', id: 'pd', r: 30 }] }));

  Z(2, 'Tetiva $AB$ jednaka je poluprečniku kruga. Koliki je periferijski ugao nad njom (sa veće strane)?',
    ['$30°$', '$60°$', '$45°$', '$120°$'],
    [K('$OA = OB = AB = r$, pa je trougao $OAB$ jednakostranični: centralni ugao je $60°$.', ['oab', 'cu']),
     K('Periferijski ugao je polovina: $30°$.', ['pu'])],
    (() => { const g = ugloviKruga(-120, -60, 90, { op: '?', kc: 1 }); g.e.push({ p: 'OAB', b: 1, id: 'oab', k: 1 }); return g; })());

  Z(2, 'Četvorougao $ABCD$ je upisan u krug, i $∠A = 75°$. Koliki je $∠C$?',
    ['$105°$', '$75°$', '$150°$', '$285°$'],
    [K('$∠A$ i $∠C$ su periferijski uglovi nad dva luka $BD$ koji zajedno čine celu kružnicu ($360°$).', ['ua', 'uc']),
     K('Zato je $∠A + ∠C = 360° : 2 = 180°$ – naspramni uglovi tetivnog četvorougla su suplementni.'),
     K('$∠C = 180° − 75° = 105°$')],
    G({ O: [0, 0], A: kp(200), B: kp(300), C: kp(15), D: kp(90) },
      [{ kr: 'O', r: 5, b: 4 }, { p: 'ABCD', b: 0 }, { u: 'BAD', o: '75°', id: 'ua', b: 1 }, { u: 'DCB', o: '?', id: 'uc', b: 3 }], { bezImena: ['O'], velicina: 240 }));

  Z(2, 'Trougao $ABC$ je upisan u krug tako da je $AB$ prečnik, a $∠A = 35°$. Koliki je $∠B$?',
    ['$55°$', '$35°$', '$145°$', '$45°$'],
    [K('Ugao kod $C$ je periferijski nad prečnikom: $∠C = 90°$.', ['uc']),
     K('$∠B = 180° − 90° − 35° = 55°$')],
    G({ O: [0, 0, -90], A: kp(180), B: kp(0), C: kp(110) },
      [{ kr: 'O', r: 5, b: 4 }, { p: 'ABC', b: 0 }, { u: 'CAB', o: '35°', r: 34 }, { pu: 'ACB', id: 'uc', k: 1 }, { u: 'ABC', o: '?', b: 3, r: 26 }, { tacka: 'O' }], { velicina: 240 }));

  Z(3, 'Tačke $A$, $B$ i $C$ dele kružnicu na tri luka čije su dužine u razmeri $2 : 3 : 4$. Koliki je najveći ugao trougla $ABC$?',
    ['$80°$', '$160°$', '$60°$', '$90°$'],
    [K('Lukovi: $360°$ podelimo na $9$ delova po $40°$: $80°$, $120°$ i $160°$.', ['l1', 'l2', 'l3']),
     K('Svaki ugao trougla je periferijski ugao nad suprotnim lukom – polovina tog luka: $40°$, $60°$ i $80°$.'),
     K('Najveći ugao je $80°$ (naspram najvećeg luka od $160°$).')],
    G({ O: [0, 0], A: kp(90), B: kp(170), C: kp(290) },
      [{ kr: 'O', r: 5, b: 4, isp: 1 }, { l: 'O', r: 5, od: 90, do: 170, b: 0, pun: 1, id: 'l1' }, { l: 'O', r: 5, od: 170, do: 290, b: 1, pun: 1, id: 'l2' }, { l: 'O', r: 5, od: 290, do: 450, b: 2, pun: 1, id: 'l3' }, { p: 'ABC', b: 3, prazno: 1 }, { tacka: 'ABC', b: 3 }], { bezImena: ['O'], velicina: 240 }));

  Z(3, 'U pravilnom šestouglu $ABCDEF$ (upisanom u krug) koliki je ugao $ADB$?',
    ['$30°$', '$60°$', '$20°$', '$45°$'],
    [K('Luk $AB$ je šestina kružnice: centralni ugao $AOB = 60°$.', ['cu']),
     K('$∠ADB$ je periferijski nad tim lukom: $60° : 2 = 30°$.', ['pu'])],
    (() => {
      const t = { ...pravilni(6, 5, [0, 0]), O: [0, 0] };
      return G(t, [{ kr: 'O', r: 5, b: 4, isp: 1 }, { p: 'ABCDEF', b: 0, prazno: 1 }, { d: 'DA', b: 3 }, { d: 'DB', b: 3 }, { u: 'ADB', b: 3, id: 'pu', o: '?', r: 40 }, { d: 'OA', b: 1, k: 1 }, { d: 'OB', b: 1, k: 1 }, { u: 'AOB', b: 1, id: 'cu', k: 1, o: '60°' }], { bezImena: ['O'], velicina: 240 });
    })());

  Z(3, 'Centralni ugao $AOB$ je $100°$. Tačka $D$ je na manjem luku $AB$. Koliki je ugao $ADB$?',
    ['$130°$', '$50°$', '$100°$', '$80°$'],
    [K('Tačka $D$ „vidi“ tetivu $AB$ nad većim lukom, čiji je centralni ugao $360° − 100° = 260°$.'),
     K('$∠ADB = 260° : 2 = 130°$ – tupi ugao.', ['pd']),
     K('Provera: tačka $C$ na većem luku daje $∠ACB = 50°$, a $ACBD$ je tetivni četvorougao: $50° + 130° = 180°$ ✓', ['pu'])],
    ugloviKruga(-140, -40, 90, { oc: '100°', op: '50°', kp: 3, t: { D: kp(-90) }, ugO: 90, dod: [{ d: 'DA', b: 2 }, { d: 'DB', b: 2 }, { u: 'BDA', b: 2, o: '?', id: 'pd', r: 22 }] }));

  // ════════════════ 5.3 Obim kruga; broj π ════════════════
  L('Obim kruga; broj π');

  Z(1, 'Koliki je obim kruga poluprečnika $5 cm$?',
    ['$10π cm$', '$25π cm$', '$5π cm$', '$10 cm$'],
    [K('$O = 2rπ = 2 · 5 · π = 10π cm$.'),
     K('Približno: $10 · 3,14 = 31,4 cm$ – nešto više od tri prečnika. ($25π$ je površina, ne obim.)', ['razm'])],
    G({ O: [0, 0], A: [5, 0], a: [-5, -6.5], b: [26.4, -6.5], c: [-5, -6], d: [5, -6], e: [15, -6], f: [25, -6] },
      [{ kr: 'O', r: 5, b: 1 }, { d: 'OA', o: '5 cm' }, { d: 'ab', b: 1, k: 2, id: 'razm', o: '10π ≈ 31,4' }, { d: 'cd', b: 3, k: 2 }, { d: 'de', b: 0, k: 2 }, { d: 'ef', b: 3, k: 2 }], { bezImena: ['O', 'A'], velicina: 300 }));

  Z(1, 'Koliki je obim kruga prečnika $20 cm$?',
    ['$20π cm$', '$40π cm$', '$10π cm$', '$100π cm$'],
    [K('$O = dπ$ – obim je prečnik puta $π$.'),
     K('$O = 20π cm ≈ 62,8 cm$')]);

  Z(1, 'Obim kruga je $18π cm$. Koliki je poluprečnik?',
    ['$9 cm$', '$18 cm$', '$3 cm$', '$6 cm$'],
    [K('$2rπ = 18π$'),
     K('$2r = 18$, $r = 9 cm$.')]);

  Z(2, 'Žica duga $62,8 cm$ savijena je u kružnicu. Koliki je poluprečnik? (Uzmi $π ≈ 3,14$.)',
    ['$10 cm$', '$20 cm$', '$5 cm$', '$31,4 cm$'],
    [K('Dužina žice je obim: $2rπ = 62,8$.'),
     K('$r = {62,8|2 · 3,14} = {62,8|6,28} = 10 cm$')]);

  Z(2, 'Koliki je obim kruga upisanog u kvadrat stranice $8 cm$?',
    ['$8π cm$', '$16π cm$', '$4π cm$', '$32 cm$'],
    [K('Prečnik upisanog kruga jednak je stranici kvadrata: $d = 8 cm$.', ['d']),
     K('$O = dπ = 8π cm ≈ 25,1 cm$ (malo manje od obima kvadrata, $32 cm$).')],
    G({ O: [0, 0], A: [-4, -4], B: [4, -4], C: [4, 4], D: [-4, 4], M: [-4, 0], N: [4, 0] },
      [{ p: 'ABCD', b: 0, prazno: 1 }, { kr: 'O', r: 4, b: 1 }, { d: 'AB', o: '8 cm' }, { d: 'MN', b: 3, isp: 1, id: 'd', k: 1 }], { bezImena: ['O', 'A', 'B', 'C', 'D', 'M', 'N'], velicina: 220 }));

  Z(2, 'Koliki je obim polukruga prečnika $10 cm$ (luk zajedno sa prečnikom)?',
    ['$5π + 10 cm$', '$10π + 10 cm$', '$5π cm$', '$10π cm$'],
    [K('Luk je polovina obima kruga: ${10π|2} = 5π cm$.', ['luk']),
     K('Dodamo i prečnik: $O = 5π + 10 ≈ 25,7 cm$.', ['d'])],
    G({ O: [0, 0], A: [-5, 0], B: [5, 0] },
      [{ l: 'O', r: 5, od: 0, do: 180, b: 1, pun: 1, id: 'luk' }, { d: 'AB', b: 3, o: '10 cm', id: 'd' }], { bezImena: ['O', 'A', 'B'], velicina: 220 }));

  {
    // točak koji se kotrlja: posle jednog obrta pređe put jednak obimu
    Z(2, 'Prečnik točka bicikla je $70 cm$. Koliko obrtaja napravi točak na putu od $1,1 km$? (Uzmi $π ≈ {22|7}$.)',
      ['$500$', '$50$', '$1571$', '$250$'],
      [K('Za jedan obrt točak pređe put jednak svom obimu.', ['put']),
       K('$O = dπ = 70 · {22|7} = 220 cm = 2,2 m$.'),
       K('$1,1 km = 1100 m$, pa je broj obrtaja $1100 : 2,2 = 500$.')],
      G({ O: [0, 3.5], A: [0, 0], B: [21.99, 0], P: [21.99, 3.5], a: [-2, 0], b: [26, 0], s: [0, 7] },
        [{ d: 'ab', b: 5 }, { kr: 'O', r: 3.5, b: 0 }, { d: 'Os', b: 3, okreni: -360, oko: 'O', trajanje: 2.5 }, { d: 'AB', b: 1, id: 'put', o: '~jedan obrt = obim', k: 1 }, { kr: 'P', r: 3.5, b: 0, isp: 1, k: 1 }, { d: 'OA', o: '35 cm', isp: 1 }],
        { bezImena: ['O', 'A', 'B', 'P'], velicina: 320 }));
  }

  Z(3, 'Uže je zategnuto oko Zemlje po ekvatoru. Zatim ga produžimo za $6,28 m$ i podignemo tako da je svuda jednako udaljeno od tla. Koliko je visoko iznad tla? (Uzmi $π ≈ 3,14$.)',
    ['oko $1 m$', 'oko $1 mm$', 'oko $1 cm$', 'oko $6,28 m$'],
    [K('Ako je poluprečnik Zemlje $R$, a uže se podigne za $h$, novi obim je $2π(R + h) = 2πR + 2πh$.'),
     K('Razlika obima je $2πh = 6,28 m$ – i uopšte ne zavisi od $R$!'),
     K('$h = {6,28|2 · 3,14} = 1 m$. Ispod užeta bi prošla mačka – isto kao da je uže oko lopte.')],
    G({ O: [0, 0] }, [{ kr: 'O', r: 6, b: 2 }, { kr: 'O', r: 6.8, b: 3, isp: 1 }, { tx: 'h', at: [7.2, 0.5], b: 3 }, { tx: '~Zemlja', at: [0, 0] }], { bezImena: ['O'], velicina: 200 }));

  Z(3, 'Nad svakom stranicom kvadrata stranice $4 cm$ nacrtan je polukrug (ka spolja), kao na slici. Koliki je obim dobijenog „cveta“?',
    ['$8π cm$', '$16π cm$', '$4π cm$', '$8π + 16 cm$'],
    [K('Svaki polukrug ima prečnik $4 cm$, pa mu je luk ${4π|2} = 2π cm$.', ['l1']),
     K('Obim čine samo lukovi (stranice kvadrata su unutra): $4 · 2π = 8π cm ≈ 25,1 cm$.')],
    G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], M: [2, 0], N: [4, 2], P: [2, 4], Q: [0, 2] },
      [{ p: 'ABCD', b: 0, isp: 1, prazno: 1 }, { l: 'M', r: 2, od: 180, do: 360, b: 1, pun: 1, id: 'l1' }, { l: 'N', r: 2, od: -90, do: 90, b: 1, pun: 1 }, { l: 'P', r: 2, od: 0, do: 180, b: 1, pun: 1 }, { l: 'Q', r: 2, od: 90, do: 270, b: 1, pun: 1 }, { d: 'AB', o: '4 cm' }],
      { bezImena: ['A', 'B', 'C', 'D', 'M', 'N', 'P', 'Q'], velicina: 220 }));

  Z(3, 'Dva zupčanika su spojena. Manji ima poluprečnik $15 cm$, a veći $25 cm$. Kada manji napravi $50$ obrtaja, koliko obrtaja napravi veći?',
    ['$30$', '$50$', '$83$', '$75$'],
    [K('Na mestu dodira oba zupčanika „pređu“ isti put po obodu.'),
     K('Manji: $50 · 2π · 15 = 1500π cm$.'),
     K('Veći: $n · 2π · 25 = 50πn$. Iz $50πn = 1500π$ sledi $n = 30$. (Broj obrtaja je obrnuto srazmeran poluprečniku.)')],
    G({ 'O₁': [0, 0], 'O₂': [40, 0], a: [0, 15], b: [40, 25] },
      [{ kr: 'O₁', r: 15, b: 0 }, { kr: 'O₂', r: 25, b: 1 }, { d: 'O₁a', b: 3, okreni: -300, oko: 'O₁', trajanje: 2.5 }, { d: 'O₂b', b: 3, okreni: 180, oko: 'O₂', trajanje: 2.5 }, { tacka: 'O₁O₂' }],
      { bezImena: ['O₁', 'O₂'], velicina: 300 }));

  // ════════════════ 5.4 Dužina kružnog luka ════════════════
  L('Dužina kružnog luka');

  const lukCrtez = (od, doo, R, oznaka, x = {}) => G({ O: [0, 0], A: kp(od, R), B: kp(doo, R) },
    [{ kr: 'O', r: R, b: 4, isp: 1 }, { d: 'OA' }, { d: 'OB' }, { u: 'AOB', o: x.ugao, r: 22 }, { l: 'O', r: R, od, do: doo, b: 1, pun: 1, id: 'luk', o: oznaka }, ...(x.dod || [])],
    { bezImena: ['O', 'A', 'B'], velicina: 220 });

  Z(1, 'Kolika je dužina luka koji odgovara centralnom uglu od $90°$ u krugu poluprečnika $8 cm$?',
    ['$4π cm$', '$8π cm$', '$16π cm$', '$2π cm$'],
    [K('Ugao od $90°$ je četvrtina punog ugla, pa je luk četvrtina obima.'),
     K('$l = {2 · 8 · π|4} = 4π cm ≈ 12,6 cm$', ['luk'])],
    lukCrtez(0, 90, 8, 'l', { ugao: '90°', dod: [{ d: 'OA', o: '8 cm' }] }));

  Z(1, 'Kolika je dužina polukružnice poluprečnika $6 cm$?',
    ['$6π cm$', '$12π cm$', '$3π cm$', '$36π cm$'],
    [K('Polukružnica je pola obima: ${2 · 6 · π|2} = 6π cm ≈ 18,8 cm$.')]);

  Z(2, 'Kolika je dužina luka koji odgovara centralnom uglu od $60°$ u krugu poluprečnika $9 cm$?',
    ['$3π cm$', '$6π cm$', '$9π cm$', '$1,5π cm$'],
    [K('$l = {rπα|180°}$, tj. deo obima: ${60°|360°} = {1|6}$ obima.'),
     K('$l = {1|6} · 2 · 9 · π = 3π cm ≈ 9,4 cm$', ['luk'])],
    lukCrtez(30, 90, 9, 'l', { ugao: '60°' }));

  Z(2, 'Luk dužine $5π cm$ pripada krugu poluprečnika $15 cm$. Koliki mu je centralni ugao?',
    ['$60°$', '$30°$', '$120°$', '$75°$'],
    [K('Obim kruga: $2 · 15 · π = 30π cm$.'),
     K('Luk je ${5π|30π} = {1|6}$ obima, pa je ugao ${1|6} · 360° = 60°$.')]);

  {
    // sat: minutna kazaljka za 20 minuta
    const t = { O: [0, 0], A: kp(90, 6), B: kp(-30, 6) };
    const e = [{ kr: 'O', r: 7, b: 4 }];
    for (let i = 0; i < 12; i++) { const p = kp(90 - i * 30, 6.6), q = kp(90 - i * 30, 7); t['c' + i] = p; t['d' + i] = q; e.push({ d: `c${i}d${i}`, b: 5 }); }
    e.push({ d: 'OA', b: 3, okreni: -120, oko: 'O', trajanje: 2, k: 1 }, { d: 'OA', b: 3, isp: 1 }, { l: 'O', r: 6, od: -30, do: 90, b: 1, pun: 1, id: 'luk', str: -1, k: 2 }, { u: 'BOA', o: '120°', k: 1, r: 18 });
    Z(2, 'Minutna kazaljka sata duga je $12 cm$. Koliki luk opiše njen vrh za $20$ minuta?',
      ['$8π cm$', '$4π cm$', '$24π cm$', '$20π cm$'],
      [K('Za $60$ minuta kazaljka opiše pun krug ($360°$), pa za $20$ minuta trećinu: $120°$.'),
       K('$l = {1|3} · 2 · 12 · π = 8π cm ≈ 25,1 cm$', ['luk'])],
      G(t, e, { bezImena: ['O', 'A', 'B'], velicina: 220 }));
  }

  Z(2, 'Centralni ugao je $45°$, a dužina luka $3π cm$. Koliki je poluprečnik kruga?',
    ['$12 cm$', '$6 cm$', '$24 cm$', '$3 cm$'],
    [K('$45°$ je osmina punog ugla, pa je ceo obim $8 · 3π = 24π cm$.'),
     K('$2rπ = 24π$, pa je $r = 12 cm$.')]);

  Z(2, 'Za koliki centralni ugao je dužina luka jednaka poluprečniku kruga?',
    ['oko $57,3°$', 'tačno $60°$', 'tačno $45°$', 'oko $90°$'],
    [K('$l = {rπα|180°} = r$, pa je ${πα|180°} = 1$.'),
     K('$α = {180°|π} ≈ {180°|3,14} ≈ 57,3°$ – malo manje od $60°$, jer je luk duži od tetive. (Ovaj ugao se zove radijan.)', ['luk'])],
    lukCrtez(0, 57.3, 5, 'r', { dod: [{ d: 'OA', o: 'r' }, { d: 'OB', o: 'r' }] }));

  Z(3, 'Koliki je obim kružnog isečka poluprečnika $6 cm$ i centralnog ugla $120°$?',
    ['$12 + 4π cm$', '$4π cm$', '$6 + 4π cm$', '$12 + 12π cm$'],
    [K('Obim isečka čine dva poluprečnika i luk.', ['is']),
     K('Luk: ${120°|360°} · 2 · 6 · π = 4π cm$.', ['luk']),
     K('$O = 6 + 6 + 4π = 12 + 4π cm ≈ 24,6 cm$')],
    G({ O: [0, 0], A: kp(30, 6), B: kp(150, 6) },
      [{ is: 'O', r: 6, od: 30, do: 150, b: 0, id: 'is' }, { l: 'O', r: 6, od: 30, do: 150, b: 1, pun: 1, id: 'luk', k: 2 }, { d: 'OA', o: '6 cm' }, { d: 'OB' }, { u: 'AOB', o: '120°', r: 20 }], { bezImena: ['O', 'A', 'B'], velicina: 220 }));

  Z(3, 'Atletska staza ima dve prave deonice od po $80 m$ i dva polukruga. Unutrašnja ivica polukruga ima poluprečnik $30 m$. Koliko je duži krug po liniji udaljenoj $1 m$ od unutrašnje ivice?',
    ['$2π ≈ 6,28 m$', '$π ≈ 3,14 m$', '$4 m$', '$60π m$'],
    [K('Prave deonice su iste ($2 · 80 m$), menja se samo dužina dva polukruga – zajedno jedan pun krug.'),
     K('Unutra: $2 · 30 · π$, spolja: $2 · 31 · π$. Razlika: $2 · 1 · π = 2π ≈ 6,28 m$.'),
     K('Zato na trci na $400 m$ trkači u spoljnim stazama kreću „ispred“ – da bi svi pretrčali isto.', ['sp'])],
    G({ 'O₁': [0, 0], 'O₂': [80, 0], a: [0, -30], b: [80, -30], c: [0, 30], d: [80, 30], e: [0, -31], f: [80, -31], g: [0, 31], h: [80, 31] },
      [{ d: 'ab', b: 2 }, { d: 'cd', b: 2 }, { l: 'O₁', r: 30, od: 90, do: 270, b: 2, pun: 1 }, { l: 'O₂', r: 30, od: -90, do: 90, b: 2, pun: 1 },
       { d: 'ef', b: 1, isp: 1, k: 2 }, { d: 'gh', b: 1, isp: 1, k: 2 }, { l: 'O₁', r: 31, od: 90, do: 270, b: 1, id: 'sp', k: 2 }, { l: 'O₂', r: 31, od: -90, do: 90, b: 1, id: 'sp', k: 2 }, { tx: '80 m', at: [40, 25] }, { d: 'O₁c', o: '30 m', isp: 1 }],
      { bezImena: ['O₁', 'O₂'], velicina: 320 }));

  Z(3, 'Za jedan sat vrh male (časovne) kazaljke duge $9 cm$ opiše luk. Kolika je njegova dužina?',
    ['$1,5π cm$', '$3π cm$', '$18π cm$', '$0,75π cm$'],
    [K('Mala kazaljka obiđe ceo krug za $12$ sati, pa za $1$ sat pređe $360° : 12 = 30°$.'),
     K('$l = {30°|360°} · 2 · 9 · π = {18π|12} = 1,5π cm ≈ 4,7 cm$')]);

  // ════════════════ 5.5 Površina kruga ════════════════
  L('Površina kruga');

  Z(1, 'Kolika je površina kruga poluprečnika $3 cm$?',
    ['$9π cm²$', '$6π cm²$', '$3π cm²$', '$9 cm²$'],
    [K('$P = r²π = 3² · π = 9π cm²$'),
     K('Približno $9 · 3,14 = 28,26 cm²$. (Greška $6π$ je obim.)')]);

  Z(1, 'Kolika je površina kruga prečnika $10 cm$?',
    ['$25π cm²$', '$100π cm²$', '$10π cm²$', '$50π cm²$'],
    [K('Poluprečnik je pola prečnika: $r = 5 cm$.'),
     K('$P = 5² · π = 25π cm² ≈ 78,5 cm²$')]);

  Z(1, 'Površina kruga je $49π cm²$. Koliki je njegov obim?',
    ['$14π cm$', '$7π cm$', '$49π cm$', '$98π cm$'],
    [K('$r² = 49$, pa je $r = 7 cm$.'),
     K('$O = 2 · 7 · π = 14π cm$')]);

  Z(2, 'Poluprečnik kruga se udvostruči. Koliko puta se poveća njegova površina?',
    ['$4$ puta', '$2$ puta', '$8$ puta', '$π$ puta'],
    [K('$P = r²π$. Novi krug: $(2r)²π = 4r²π$.'),
     K('Površina se poveća $4$ puta (a obim samo $2$ puta).')]);

  Z(2, 'U kvadrat stranice $10 cm$ upisan je krug. Kolika je površina dela kvadrata van kruga? (Uzmi $π ≈ 3,14$.)',
    ['$21,5 cm²$', '$78,5 cm²$', '$68,6 cm²$', '$31,4 cm²$'],
    [K('Kvadrat: $10² = 100 cm²$.'),
     K('Krug: $r = 5 cm$, $P = 25π ≈ 78,5 cm²$.', ['kr']),
     K('Ostatak (četiri „ugla“): $100 − 78,5 = 21,5 cm²$.', ['ost'])],
    G({ O: [0, 0], A: [-5, -5], B: [5, -5], C: [5, 5], D: [-5, 5] },
      [{ p: 'ABCD', b: 3, id: 'ost', gusto: 1 }, { kr: 'O', r: 5, b: 0, pun: 1, id: 'kr', gusto: 1 }, { d: 'AB', o: '10 cm' }], { bezImena: ['O', 'A', 'B', 'C', 'D'], velicina: 200 }));

  Z(2, 'Šta je više: jedna pica prečnika $30 cm$ ili dve pice prečnika $20 cm$ (iste debljine)?',
    ['jedna velika ($225π$ prema $200π cm²$)', 'dve male ($200π$ prema $150π cm²$)', 'jednako je', 'dve male ($400π$ prema $225π cm²$)'],
    [K('Velika: $r = 15 cm$, $P = 225π cm²$.'),
     K('Male: $r = 10 cm$, $P = 100π$ svaka – ukupno $200π cm²$.'),
     K('Velika pica je veća za $25π ≈ 78,5 cm²$, iako je „$30 < 20 + 20$“. Površina raste sa kvadratom poluprečnika!')],
    G({ A: [0, 0], B: [21, 3.5], C: [21, -6.5] }, [{ kr: 'A', r: 7.5, b: 3, pun: 1 }, { kr: 'B', r: 5, b: 1, pun: 1 }, { kr: 'C', r: 5, b: 1, pun: 1 }, { tx: '30 cm', at: [0, 0] }, { tx: '20 cm', at: [21, 3.5] }, { tx: '20 cm', at: [21, -6.5] }], { bezImena: ['A', 'B', 'C'], velicina: 260 }));

  Z(2, 'Obim kruga je $12π cm$. Kolika je njegova površina?',
    ['$36π cm²$', '$144π cm²$', '$12π cm²$', '$24π cm²$'],
    [K('$2rπ = 12π$, $r = 6 cm$.'),
     K('$P = 6²π = 36π cm²$')]);

  Z(3, 'Kolika je površina kruga opisanog oko kvadrata stranice $4 cm$?',
    ['$8π cm²$', '$16π cm²$', '$4π cm²$', '$32π cm²$'],
    [K('Prečnik opisanog kruga je dijagonala kvadrata: $d = 4√{2} cm$.', ['d']),
     K('$r = 2√{2}$, pa je $r² = 8$.'),
     K('$P = 8π cm² ≈ 25,1 cm²$')],
    G({ O: [0, 0], A: [-2, -2], B: [2, -2], C: [2, 2], D: [-2, 2] },
      [{ kr: 'O', r: 2.83, b: 1 }, { p: 'ABCD', b: 0 }, { d: 'AC', b: 3, isp: 1, id: 'd', k: 1 }, { d: 'AB', o: '4 cm' }], { bezImena: ['O', 'A', 'B', 'C', 'D'], velicina: 200 }));

  Z(3, 'Oko svakog temena kvadrata stranice $2 cm$ nacrtana je četvrtina kruga poluprečnika $1 cm$ (unutar kvadrata). Kolika je površina dela kvadrata koji nije pokriven? (Uzmi $π ≈ 3,14$.)',
    ['$0,86 cm²$', '$3,14 cm²$', '$1 cm²$', '$2,86 cm²$'],
    [K('Četiri četvrtine kruga poluprečnika $1$ zajedno čine ceo krug: $P = 1² · π = π cm²$.', ['c1', 'c2', 'c3', 'c4']),
     K('Kvadrat: $2² = 4 cm²$.'),
     K('Nepokriveno: $4 − π ≈ 4 − 3,14 = 0,86 cm²$.')],
    G({ A: [0, 0], B: [2, 0], C: [2, 2], D: [0, 2] },
      [{ p: 'ABCD', b: 3, gusto: 1 }, { is: 'A', r: 1, od: 0, do: 90, b: 1, gusto: 1, id: 'c1' }, { is: 'B', r: 1, od: 90, do: 180, b: 1, gusto: 1, id: 'c2' }, { is: 'C', r: 1, od: 180, do: 270, b: 1, gusto: 1, id: 'c3' }, { is: 'D', r: 1, od: 270, do: 360, b: 1, gusto: 1, id: 'c4' }, { d: 'AB', o: '2 cm' }],
      { bezImena: ['A', 'B', 'C', 'D'], velicina: 200 }));

  Z(3, 'U kvadratu stranice $4 cm$ nacrtane su dve četvrtine kruga poluprečnika $4 cm$, sa centrima u dva naspramna temena. Kolika je površina „lista“ u kome se preklapaju?',
    ['$8π − 16 cm²$', '$16 − 4π cm²$', '$8π cm²$', '$4π − 8 cm²$'],
    [K('Jedna četvrtina kruga: ${16π|4} = 4π cm²$. Kad od nje oduzmemo trougao $ABD$ (pola kvadrata, $8 cm²$), ostaje polovina lista: $4π − 8$.', ['c1', 'tr']),
     K('List je simetričan u odnosu na dijagonalu $BD$, pa je ceo list $2(4π − 8) = 8π − 16 cm²$.', ['c2']),
     K('Približno $8 · 3,14 − 16 = 9,12 cm²$.')],
    G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] },
      [{ p: 'ABCD', b: 0, prazno: 1 }, { is: 'A', r: 4, od: 0, do: 90, b: 1, id: 'c1' }, { is: 'C', r: 4, od: 180, do: 270, b: 2, id: 'c2' }, { p: 'ABD', b: 3, prazno: 1, isp: 1, id: 'tr', k: 1 }, { d: 'AB', o: '4 cm' }],
      { bezImena: ['A', 'B', 'C', 'D'], velicina: 220 }));

  // ════════════════ 5.6 Kružni isečak i prsten ════════════════
  L('Površina kružnog isečka i kružnog prstena');

  Z(1, 'Kolika je površina kružnog isečka poluprečnika $4 cm$ i centralnog ugla $90°$?',
    ['$4π cm²$', '$16π cm²$', '$2π cm²$', '$8π cm²$'],
    [K('Isečak od $90°$ je četvrtina kruga.', ['is']),
     K('$P = {4²π|4} = {16π|4} = 4π cm² ≈ 12,6 cm²$')],
    G({ O: [0, 0], A: [4, 0] }, [{ kr: 'O', r: 4, b: 4, isp: 1 }, { is: 'O', r: 4, od: 0, do: 90, b: 1, id: 'is', gusto: 1 }, { d: 'OA', o: '4 cm' }], { bezImena: ['O', 'A'], velicina: 200 }));

  Z(1, 'Poluprečnici kružnog prstena su $5 cm$ i $3 cm$. Kolika je površina prstena?',
    ['$16π cm²$', '$4π cm²$', '$2π cm²$', '$34π cm²$'],
    [K('Prsten = veliki krug minus mali krug.', ['pr']),
     K('$P = 5²π − 3²π = 25π − 9π = 16π cm² ≈ 50,2 cm²$. (Greška $4π = (5 − 3)²π$.)')],
    G({ O: [0, 0], A: [5, 0], B: [0, 3] }, [{ is: 'O', r: 5, r0: 3, od: 0, do: 360, b: 1, id: 'pr', gusto: 1 }, { d: 'OA', o: '5 cm' }, { d: 'OB', o: '3', isp: 1 }], { bezImena: ['O', 'A', 'B'], velicina: 200 }));

  Z(2, 'Kolika je površina kružnog isečka poluprečnika $6 cm$ i centralnog ugla $120°$?',
    ['$12π cm²$', '$4π cm²$', '$36π cm²$', '$24π cm²$'],
    [K('$120°$ je trećina punog ugla.'),
     K('$P = {6²π|3} = {36π|3} = 12π cm² ≈ 37,7 cm²$', ['is'])],
    G({ O: [0, 0], A: kp(-30, 6) }, [{ kr: 'O', r: 6, b: 4, isp: 1 }, { is: 'O', r: 6, od: -30, do: 90, b: 1, id: 'is', gusto: 1, o: '120°', oR: 0.35 }, { d: 'OA', o: '6 cm' }], { bezImena: ['O', 'A'], velicina: 200 }));

  Z(2, 'Površina kružnog isečka je $6π cm²$, a poluprečnik $6 cm$. Koliki je centralni ugao?',
    ['$60°$', '$30°$', '$120°$', '$6°$'],
    [K('Ceo krug: $6²π = 36π cm²$.'),
     K('Isečak je ${6π|36π} = {1|6}$ kruga, pa je ugao ${360°|6} = 60°$.')]);

  Z(2, 'Obimi graničnih kružnica kružnog prstena su $20π cm$ i $12π cm$. Kolika je površina prstena?',
    ['$64π cm²$', '$8π cm²$', '$16π cm²$', '$136π cm²$'],
    [K('Poluprečnici: $2Rπ = 20π$, $R = 10 cm$; $2rπ = 12π$, $r = 6 cm$.'),
     K('$P = 10²π − 6²π = 100π − 36π = 64π cm²$')]);

  {
    // pita na 8 delova; jedan se izdvaja rotacijom
    Z(2, 'Okrugla pita poluprečnika $12 cm$ isečena je na $8$ jednakih parčadi. Kolika je površina jednog parčeta?',
      ['$18π cm²$', '$12π cm²$', '$3π cm²$', '$144π cm²$'],
      [K('Cela pita: $12²π = 144π cm²$.'),
       K('Jedno parče je isečak od $360° : 8 = 45°$: $P = {144π|8} = 18π cm² ≈ 56,5 cm²$.', ['par'])],
      G({ O: [0, 0], A: [12, 0] },
        [...Array.from({ length: 8 }, (_, i) => ({ is: 'O', r: 12, od: i * 45, do: (i + 1) * 45, b: 3, ...(i === 1 ? { id: 'par', b: 1, gusto: 1 } : {}) })), { d: 'OA', o: '12 cm' }], { bezImena: ['O', 'A'], velicina: 200 }));
  }

  Z(2, 'Dužina luka kružnog isečka je $5 cm$, a poluprečnik $4 cm$. Kolika je površina isečka?',
    ['$10 cm²$', '$20 cm²$', '$5π cm²$', '$40 cm²$'],
    [K('Isečak je deo kruga srazmeran luku: $P = {l|2rπ} · r²π = {l · r|2}$.'),
     K('$P = {5 · 4|2} = 10 cm²$ – kao trougao čija je „osnovica“ luk, a visina poluprečnik.')]);

  Z(3, 'Kolika je površina kružnog odsečka između tetive $AB$ i manjeg luka, ako je poluprečnik $6 cm$, a centralni ugao $AOB = 90°$?',
    ['$9π − 18 cm²$', '$9π cm²$', '$36π − 18 cm²$', '$18 − 9π cm²$'],
    [K('Isečak $AOB$: ${36π|4} = 9π cm²$.', ['is']),
     K('Trougao $AOB$ je pravougli: ${6 · 6|2} = 18 cm²$.', ['tr']),
     K('Odsečak = isečak − trougao $= 9π − 18 ≈ 10,3 cm²$.', ['od'])],
    G({ O: [0, 0], A: [6, 0], B: [0, 6] },
      [{ kr: 'O', r: 6, b: 4, isp: 1 }, { is: 'O', r: 6, od: 0, do: 90, b: 0, id: 'is' }, { p: 'OAB', b: 3, id: 'tr', k: 2 }, { pu: 'AOB' }, { d: 'AB', b: 1, id: 'od' }, { d: 'OA', o: '6 cm' }, { tx: '?', at: [3.2, 3.2], b: 1 }],
      { bezImena: ['O'], velicina: 200 }));

  Z(3, 'Tetiva većeg kruga kružnog prstena dodiruje manji krug i duga je $10 cm$. Kolika je površina prstena?',
    ['$25π cm²$', '$100π cm²$', '$10π cm²$', 'ne može se odrediti'],
    [K('Tetiva dodiruje manji krug u svom središtu $M$, pa je $OM = r$ i $OM ⊥ AB$, $MB = 5 cm$.', ['omb']),
     K('Pitagora u trouglu $OMB$: $R² − r² = 5² = 25$.'),
     K('$P = R²π − r²π = (R² − r²)π = 25π cm²$ – a da ne znamo ni $R$ ni $r$!', ['pr'])],
    G({ O: [0, 0, 90], A: [-5, -4], B: [5, -4], M: [0, -4, -90] },
      [{ is: 'O', r: 6.4, r0: 4, od: 0, do: 360, b: 1, id: 'pr', k: 3 }, { kr: 'O', r: 6.4, b: 0 }, { kr: 'O', r: 4, b: 0 }, { d: 'AB', b: 3, o: '10 cm' }, { p: 'OMB', b: 2, id: 'omb', k: 1 }, { pu: 'OMB', k: 1 }, { d: 'OB', k: 1, o: 'R' }, { d: 'OM', k: 1, o: 'r' }],
      { velicina: 220 }));
  proveri(Math.abs(6.4 ** 2 - 4 ** 2 - 25) < 0.1, 'prsten 6,4 / 4');

  Z(3, 'Koza je vezana užetom od $6 m$ za ugao kvadratne štale stranice $10 m$ (sa spoljne strane). Kolika je površina livade po kojoj može da pase?',
    ['$27π m²$', '$36π m²$', '$9π m²$', '$18π m²$'],
    [K('Štala zaklanja jednu četvrtinu kruga oko ugla (ugao štale je $90°$).', ['st']),
     K('Koza može da obiđe tri četvrtine kruga poluprečnika $6 m$: ${3|4} · 36π = 27π m² ≈ 84,8 m²$.', ['is']),
     K('Uže ($6 m$) je kraće od zida ($10 m$), pa koza ne može da zađe iza štale.')],
    G({ A: [0, 0], B: [-10, 0], C: [-10, -10], D: [0, -10], E: [6, 0] },
      [{ is: 'A', r: 6, od: -90, do: 180, b: 2, id: 'is', gusto: 1 }, { p: 'ABCD', b: 5, gusto: 1, id: 'st', o: '~štala' }, { d: 'AE', o: '6 m', b: 3 }, { tacka: 'A', b: 3 }],
      { bezImena: ['A', 'B', 'C', 'D', 'E'], velicina: 220 }));

  // ════════════════ 5.7 Rotacija ════════════════
  L('Rotacija');

  // koordinatna ravan sa tačkom A koja se okreće oko O
  const rotTacka = (A, ugao, x = {}) => {
    const fi = (ugao * Math.PI) / 180;
    const A2 = [r(A[0] * Math.cos(fi) - A[1] * Math.sin(fi)), r(A[0] * Math.sin(fi) + A[1] * Math.cos(fi))];
    const m = Math.max(Math.abs(A[0]), Math.abs(A[1])) + 1;
    const pocetak = (Math.atan2(A[1], A[0]) * 180) / Math.PI;
    return G({ O: [0, 0, 225], A, "A'": A2 },
      [{ mreza: [-m, m, -m, m], ose: ['x', 'y'] }, { d: 'OA', b: 3, isp: 1 }, { d: 'OA', b: 1, okreni: ugao, oko: 'O', k: x.k ?? 1 }, { tacka: 'A', b: 3 },
       { l: 'O', r: r(Math.hypot(A[0], A[1])), od: r(Math.min(pocetak, pocetak + ugao)), do: r(Math.max(pocetak, pocetak + ugao)), b: 1, str: ugao > 0 ? 1 : -1, k: x.k ?? 1 }, { tacka: "A'", b: 1, k: (x.k ?? 1) + 1, id: 'a2' }, ...(x.dod || [])],
      { velicina: 240, bezImena: x.bezA2 ? ["A'"] : [] });
  };

  Z(1, 'Tačka $A(3, 0)$ rotira oko koordinatnog početka za $90°$ (suprotno kretanju kazaljke na satu). Koje su koordinate slike $A\'$?',
    ['$(0, 3)$', '$(0, −3)$', '$(−3, 0)$', '$(3, 3)$'],
    [K('Rotacija čuva rastojanje od centra: $OA\' = OA = 3$. Duž $OA$ se okreće za $90°$.'),
     K('Iz pozitivnog dela $x$-ose stižemo na pozitivni deo $y$-ose: $A\'(0, 3)$.', ['a2'])],
    rotTacka([3, 0], 90));

  Z(1, 'Rotacija oko koordinatnog početka za $180°$ preslikava tačku $A(2, 5)$ u:',
    ['$(−2, −5)$', '$(−2, 5)$', '$(2, −5)$', '$(5, 2)$'],
    [K('Rotacija za $180°$ je isto što i centralna simetrija u odnosu na centar rotacije.'),
     K('Obe koordinate menjaju znak: $A\'(−2, −5)$. Tačke $A$, $O$ i $A\'$ su na istoj pravoj.', ['a2'])],
    rotTacka([2, 5], 180));

  Z(1, 'Šta se NE čuva pri rotaciji?',
    ['položaj (osim centra rotacije)', 'dužine duži', 'veličine uglova', 'površine likova'],
    [K('Rotacija je izometrija: lik se samo okrene, pa su slika i original podudarni – dužine, uglovi i površine se čuvaju.'),
     K('Menja se položaj tačaka (svih osim centra rotacije, koji ostaje na mestu).', ['rot'])],
    G({ O: [0, 0], A: [2, 1], B: [5, 1], C: [3, 4] },
      [{ p: 'ABC', b: 0 }, { p: 'ABC', b: 1, okreni: 120, oko: 'O', k: 2, id: 'rot' }, { tacka: 'O', b: 3 }], { bezImena: ['A', 'B', 'C'], velicina: 220 }));

  Z(2, 'Trougao sa temenima $A(1, 1)$, $B(4, 1)$ i $C(1, 3)$ rotira oko temena $A$ za $90°$ (suprotno kazaljki na satu). Gde je slika tačke $B$?',
    ['$(1, 4)$', '$(4, 4)$', '$(−2, 1)$', '$(1, −2)$'],
    [K('$B$ je $3$ jedinice desno od $A$. Posle rotacije za $90°$ oko $A$ biće $3$ jedinice iznad $A$.', ['rot']),
     K('$B\'(1, 1 + 3) = (1, 4)$.', ['b2'])],
    G({ O: [0, 0, 225], A: [1, 1, 225], B: [4, 1], C: [1, 3], "B'": [1, 4, 180] },
      [{ mreza: [-2, 5, -1, 5], ose: ['x', 'y'] }, { p: 'ABC', b: 0 }, { p: 'ABC', b: 1, okreni: 90, oko: 'A', k: 1, id: 'rot' }, { tacka: "B'", b: 1, k: 2, id: 'b2' }], { bezImena: ['O'], velicina: 240 }));

  {
    const t = { O: [0, 0], A: [0, 6] };
    const e = [{ kr: 'O', r: 7, b: 4 }];
    for (let i = 0; i < 12; i++) { t['c' + i] = kp(90 - i * 30, 6.5); t['d' + i] = kp(90 - i * 30, 7); e.push({ d: `c${i}d${i}`, b: 5 }); }
    e.push({ d: 'OA', b: 3, isp: 1 }, { d: 'OA', b: 1, okreni: -120, oko: 'O', k: 1 }, { l: 'O', r: 5, od: -30, do: 90, b: 1, str: -1, k: 1 });
    Z(2, 'Za koliki ugao i u kom smeru se rotira minutna kazaljka za $20$ minuta?',
      ['$120°$, u smeru kazaljke na satu', '$120°$, suprotno kazaljki na satu', '$20°$, u smeru kazaljke na satu', '$60°$, u smeru kazaljke na satu'],
      [K('Za $60$ minuta kazaljka napravi pun krug: $360°$. Za $20$ minuta – trećinu: $120°$.'),
       K('Kazaljka se okreće „u smeru kazaljke na satu“ – to je negativan smer rotacije ($−120°$).')],
      G(t, e, { bezImena: ['O', 'A'], velicina: 200 }));
  }

  Z(2, 'Za koji najmanji ugao (veći od $0°$) treba rotirati pravilni šestougao oko njegovog centra da bi se preslikao sam na sebe?',
    ['$60°$', '$120°$', '$30°$', '$360°$'],
    [K('Svako teme mora da pređe u susedno teme – za jedan centralni ugao.'),
     K('Centralni ugao šestougla: $360° : 6 = 60°$.', ['rot'])],
    G({ ...pravilni(6, 5, [0, 0], 0), O: [0, 0] },
      [{ p: 'ABCDEF', b: 0 }, { p: 'ABCDEF', b: 1, okreni: 60, oko: 'O', k: 2, id: 'rot', prazno: 1 }, { d: 'OA', b: 3, k: 2, okreni: 60, oko: 'O' }, { d: 'OA', b: 3, isp: 1 }, { tacka: 'O' }], { bezImena: ['O'], velicina: 220 }));

  Z(2, 'Tačka $A(4, −2)$ rotira oko koordinatnog početka za $90°$ (suprotno kazaljki na satu). Koje su koordinate slike?',
    ['$(2, 4)$', '$(−2, 4)$', '$(−4, 2)$', '$(2, −4)$'],
    [K('Pravougli trougao sa katetama $4$ (vodoravno) i $2$ (naniže) okreće se za $90°$: vodoravna kateta postaje uspravna, a uspravna vodoravna.', ['a2']),
     K('Pravilo za $90°$: $(x, y) → (−y, x)$, pa je $A\'(2, 4)$. Provera: $OA = OA\' = √{20}$.')],
    rotTacka([4, -2], 90));

  Z(3, 'Tačka $A$ udaljena je $5 cm$ od centra $O$. Rotacijom oko $O$ za $60°$ dobija se tačka $A\'$. Kolika je duž $AA\'$?',
    ['$5 cm$', '$10 cm$', '$5√{2} cm$', '$5√{3} cm$'],
    [K('$OA = OA\' = 5 cm$ (rotacija čuva rastojanje), a $∠AOA\' = 60°$.', ['tr']),
     K('Jednakokraki trougao sa uglom $60°$ između krakova je jednakostranični: $AA\' = 5 cm$.')],
    G({ O: [0, 0, 225], A: [5, 0], "A'": kp(60) },
      [{ d: 'OA', b: 3 }, { d: 'OA', b: 1, okreni: 60, oko: 'O', k: 1 }, { l: 'O', r: 5, od: 0, do: 60, b: 1, str: 1 }, { u: "AOA'", o: '60°', r: 18 }, { p: "OAA'", b: 2, id: 'tr', k: 1 }, { d: 'OA', o: '5 cm' }], { velicina: 200 }));

  Z(3, 'Tačka $A$ udaljena je $6 cm$ od centra $O$. Rotacijom oko $O$ za $90°$ dobija se $A\'$. Kolika je duž $AA\'$?',
    ['$6√{2} cm$', '$6 cm$', '$12 cm$', '$3√{2} cm$'],
    [K('$OA = OA\' = 6 cm$, a ugao između njih je prav: trougao $OAA\'$ je jednakokraki pravougli.', ['tr']),
     K('$AA\'² = 6² + 6² = 72$, $AA\' = √{72} = 6√{2} cm ≈ 8,5 cm$.')],
    G({ O: [0, 0, 225], A: [6, 0], "A'": [0, 6] },
      [{ d: 'OA', b: 3 }, { d: 'OA', b: 1, okreni: 90, oko: 'O', k: 1 }, { l: 'O', r: 6, od: 0, do: 90, b: 1, str: 1 }, { pu: "AOA'" }, { p: "OAA'", b: 2, id: 'tr', k: 1 }, { d: 'OA', o: '6 cm' }], { velicina: 200 }));

  Z(3, 'Lik je rotiran oko tačke $O$ za $150°$, a zatim još za $240°$ u istom smeru. Kojom jednom rotacijom se može dobiti isti rezultat?',
    ['$30°$ u istom smeru', '$390°$ u suprotnom smeru', '$90°$ u istom smeru', '$30°$ u suprotnom smeru'],
    [K('Dve rotacije oko istog centra daju rotaciju za zbir uglova: $150° + 240° = 390°$.'),
     K('Pun krug ($360°$) vraća lik na isto mesto: $390° − 360° = 30°$ u istom smeru.', ['rot'])],
    G({ O: [0, 0], A: [2, 0.5], B: [5, 0.5], C: [2, 2.5] },
      [{ p: 'ABC', b: 0 }, { p: 'ABC', b: 1, okreni: 390, oko: 'O', trajanje: 3, k: 2, id: 'rot' }, { tacka: 'O', b: 3 }], { bezImena: ['A', 'B', 'C'], velicina: 200 }));
};
