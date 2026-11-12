// Tema 4: Mnogougao (lekcije 4.1–4.7)
module.exports = ({ L, Z, K, G, r, S3, proveri, pravilni, ime, naKrugu }) => {
  // pravilni n-tougao sa (opciono) dijagonalama: dijag = 'sve' | 'iz A' | false
  const mnogougao = (n, { dijag = false, kDijag = 1, R = 5, dod = [], t: dodT = {}, bez = [], imena } = {}) => {
    const t = { ...pravilni(n, R, [0, 0], undefined, imena), ...dodT };
    const im = imena || ime(n);
    const e = [{ p: im.slice(0, n), b: 0 }];
    if (dijag) {
      for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) {
        if (i === 0 && j === n - 1) continue;
        if (dijag === 'iz A' && i !== 0) continue;
        e.push({ d: im[i] + im[j], b: i === 0 ? 1 : 3, k: kDijag, id: i === 0 ? 'izA' : 'ost' });
      }
    }
    return G(t, [...e, ...dod], { bezImena: bez, velicina: 240 });
  };

  // ════════════════ 4.1 Pojam mnogougla i broj dijagonala ════════════════
  L('Pojam mnogougla i broj dijagonala');

  Z(1, 'Koliko dijagonala ima šestougao?',
    ['$9$', '$6$', '$18$', '$3$'],
    [K('Iz svakog temena polaze dijagonale ka svim temenima osim sebe i dva susedna: $6 − 3 = 3$ dijagonale.', ['izA']),
     K('Šest temena puta $3$ daje $18$, ali je tako svaka dijagonala brojana dvaput (iz oba kraja).', ['ost']),
     K('$D = {n(n − 3)|2} = {6 · 3|2} = 9$')],
    mnogougao(6, { dijag: 'sve' }));

  Z(1, 'Koliko dijagonala polazi iz jednog temena osmougla?',
    ['$5$', '$8$', '$6$', '$20$'],
    [K('Teme se ne spaja dijagonalom sa samim sobom ni sa dva susedna temena (to su stranice).'),
     K('$8 − 3 = 5$ dijagonala.', ['izA'])],
    mnogougao(8, { dijag: 'iz A', kDijag: 2 }));

  Z(1, 'Koji mnogougao ima tačno $5$ dijagonala?',
    ['petougao', 'četvorougao', 'šestougao', 'sedmougao'],
    [K('$D = {n(n − 3)|2}$. Za $n = 4$: $2$; za $n = 5$: ${5 · 2|2} = 5$ ✓; za $n = 6$: $9$; za $n = 7$: $14$.'),
     K('Petougao: dijagonale grade petokraku zvezdu.', [], mnogougao(5, { dijag: 'sve', kDijag: 0 }))]);

  Z(2, 'Mnogougao ima $20$ dijagonala. Koliko ima stranica?',
    ['$8$', '$10$', '$5$', '$40$'],
    [K('${n(n − 3)|2} = 20$, pa je $n(n − 3) = 40$.'),
     K('Tražimo dva broja koji se razlikuju za $3$ i daju proizvod $40$: $8 · 5 = 40$, pa je $n = 8$.'),
     K('Provera: ${8 · 5|2} = 20$ ✓')]);

  Z(2, 'Dijagonale povučene iz jednog temena desetougla dele ga na trouglove. Koliko ih ima?',
    ['$8$', '$7$', '$10$', '$9$'],
    [K('Iz jednog temena polazi $10 − 3 = 7$ dijagonala.', ['izA']),
     K('$7$ dijagonala deli mnogougao na $7 + 1 = 8$ trouglova, tj. $n − 2$.'),
     K('Odatle zbir unutrašnjih uglova: $8 · 180° = 1440°$.')],
    mnogougao(10, { dijag: 'iz A', kDijag: 1 }));

  Z(2, 'Koliko dijagonala ima dvanaestougao?',
    ['$54$', '$108$', '$9$', '$66$'],
    [K('$D = {n(n − 3)|2} = {12 · 9|2}$'),
     K('$= {108|2} = 54$. ($66$ je broj svih duži između temena – i stranica i dijagonala.)')]);

  Z(2, 'Koji mnogougao ima isto toliko dijagonala koliko i stranica?',
    ['petougao', 'šestougao', 'četvorougao', 'takav ne postoji'],
    [K('${n(n − 3)|2} = n$, pa je (za $n ≠ 0$) $n − 3 = 2$.'),
     K('$n = 5$: petougao ima $5$ stranica i $5$ dijagonala.')]);

  Z(3, 'Na sastanku je $10$ osoba i svaka se rukuje sa svakom po jednom. Koliko ima rukovanja?',
    ['$45$', '$100$', '$90$', '$35$'],
    [K('Osobe zamislimo kao temena desetougla, a rukovanja kao duži između njih.'),
     K('Rukovanja susednih osoba su stranice ($10$), a ostala su dijagonale: ${10 · 7|2} = 35$.', ['izA', 'ost']),
     K('Ukupno $10 + 35 = 45 = {10 · 9|2}$. (Greška $90$ broji svako rukovanje dvaput.)')],
    mnogougao(10, { dijag: 'sve', kDijag: 2 }));

  Z(3, 'Mnogougao ima tri puta više dijagonala nego stranica. Koliko ima stranica?',
    ['$9$', '$6$', '$12$', '$8$'],
    [K('${n(n − 3)|2} = 3n$, pa je ${n − 3|2} = 3$.'),
     K('$n − 3 = 6$, $n = 9$. Provera: devetougao ima ${9 · 6|2} = 27 = 3 · 9$ dijagonala ✓')]);

  Z(3, 'Kada mnogouglu dodamo još jedno teme (i stranicu), broj dijagonala se poveća za $7$. Koliko stranica je imao mnogougao?',
    ['$8$', '$7$', '$10$', '$9$'],
    [K('Novo teme daje $(n + 1) − 3 = n − 2$ novih dijagonala, a stara stranica između njegovih suseda postaje dijagonala: ukupno $n − 1$ novih.'),
     K('$n − 1 = 7$, pa je $n = 8$.'),
     K('Provera: osmougao ima $20$, a devetougao $27$ dijagonala – razlika $7$ ✓')]);

  // ════════════════ 4.2 Uglovi mnogougla ════════════════
  L('Uglovi mnogougla');

  Z(1, 'Koliki je zbir unutrašnjih uglova šestougla?',
    ['$720°$', '$1080°$', '$540°$', '$360°$'],
    [K('Dijagonale iz jednog temena dele šestougao na $6 − 2 = 4$ trougla.', ['izA']),
     K('Zbir uglova je $4 · 180° = 720°$. Uopšte: $(n − 2) · 180°$.')],
    mnogougao(6, { dijag: 'iz A' }));

  Z(1, 'Koliki je zbir spoljašnjih uglova konveksnog sedmougla?',
    ['$360°$', '$900°$', '$1260°$', '$180°$'],
    [K('Kod svakog temena unutrašnji i spoljašnji ugao zajedno daju $180°$: ukupno $7 · 180° = 1260°$.'),
     K('Unutrašnji: $(7 − 2) · 180° = 900°$. Spoljašnji: $1260° − 900° = 360°$.'),
     K('Zbir spoljašnjih uglova je $360°$ za svaki konveksan mnogougao – kao da obiđemo jedan pun krug.')]);

  Z(1, 'Koliki je unutrašnji ugao pravilnog osmougla?',
    ['$135°$', '$120°$', '$140°$', '$45°$'],
    [K('Zbir unutrašnjih uglova: $(8 − 2) · 180° = 1080°$.'),
     K('Svi uglovi su jednaki: $1080° : 8 = 135°$. (Spoljašnji ugao je $360° : 8 = 45°$, a $180° − 45° = 135°$.)', ['ug'])],
    mnogougao(8, { dod: [{ u: 'HAB', id: 'ug', o: '?' }] }));

  Z(2, 'Zbir unutrašnjih uglova mnogougla je $1440°$. Koliko stranica ima mnogougao?',
    ['$10$', '$8$', '$12$', '$9$'],
    [K('$(n − 2) · 180° = 1440°$'),
     K('$n − 2 = 8$, pa je $n = 10$ (desetougao).')]);

  Z(2, 'Četiri unutrašnja ugla petougla su $100°$, $110°$, $120°$ i $95°$. Koliki je peti ugao?',
    ['$115°$', '$75°$', '$135°$', '$108°$'],
    [K('Zbir uglova petougla: $(5 − 2) · 180° = 540°$.'),
     K('$100° + 110° + 120° + 95° = 425°$'),
     K('Peti ugao: $540° − 425° = 115°$.', ['x'])],
    G({ A: [0, 0], B: [6, 0], C: [7.6, 4.2], D: [3.4, 7.2], E: [-1.4, 4.4] },
      [{ p: 'ABCDE' }, { u: 'EAB', o: '100°' }, { u: 'ABC', o: '110°' }, { u: 'BCD', o: '95°' }, { u: 'CDE', o: '120°' }, { u: 'DEA', o: 'x', id: 'x', b: 1 }], { bezImena: ['A', 'B', 'C', 'D', 'E'] }));

  Z(2, 'Spoljašnji ugao pravilnog mnogougla je $24°$. Koliko stranica ima mnogougao?',
    ['$15$', '$24$', '$12$', '$7$'],
    [K('Zbir spoljašnjih uglova je $360°$, a kod pravilnog mnogougla svi su jednaki.'),
     K('$n = 360° : 24° = 15$')]);

  Z(2, 'Tri unutrašnja ugla četvorougla su $80°$, $95°$ i $110°$. Koliki je spoljašnji ugao kod četvrtog temena?',
    ['$105°$', '$75°$', '$95°$', '$85°$'],
    [K('Zbir uglova četvorougla: $360°$. Četvrti ugao: $360° − 80° − 95° − 110° = 75°$.', ['u4']),
     K('Spoljašnji ugao je njegov naporedni: $180° − 75° = 105°$.', ['sp'])],
    G({ A: [0, 0], B: [7, 0], C: [6.37, 3.6], D: [1.42, 5.31], e: [-2, 0] },
      [{ p: 'ABCD' }, { u: 'DAB', o: '75°', id: 'u4', k: 1 }, { u: 'ABC', o: '80°' }, { u: 'BCD', o: '110°' }, { u: 'CDA', o: '95°' }, { d: 'Ae', isp: 1 }, { u: 'eAD', id: 'sp', b: 1, k: 2, r: 30 }], { bezImena: ['A', 'B', 'C', 'D'] }));
  {
    // uglovi nacrtanog četvorougla (provera da crtež odgovara tekstu)
    const ug = (p, v, q) => { const a = Math.atan2(p[1] - v[1], p[0] - v[0]), b = Math.atan2(q[1] - v[1], q[0] - v[0]); let d = Math.abs(a - b) * 180 / Math.PI; return d > 180 ? 360 - d : d; };
    const A = [0, 0], B = [7, 0], D = [1.42, 5.31];
    proveri(Math.abs(ug(D, A, B) - 75) < 0.5, 'crtež četvorougla');
  }

  Z(3, 'Svaki unutrašnji ugao pravilnog mnogougla je $4$ puta veći od spoljašnjeg. Koliko stranica ima mnogougao?',
    ['$10$', '$8$', '$5$', '$12$'],
    [K('Unutrašnji + spoljašnji $= 180°$. Ako je spoljašnji $s$, unutrašnji je $4s$: $5s = 180°$, $s = 36°$.'),
     K('$n = 360° : 36° = 10$. Provera: unutrašnji ugao desetougla je $144° = 4 · 36°$ ✓')]);

  Z(3, 'Zbir unutrašnjih uglova mnogougla je za $900°$ veći od zbira njegovih spoljašnjih uglova. Koliko mnogougao ima stranica?',
    ['$9$', '$7$', '$5$', '$11$'],
    [K('Zbir spoljašnjih je $360°$, pa je zbir unutrašnjih $360° + 900° = 1260°$.'),
     K('$(n − 2) · 180° = 1260°$, $n − 2 = 7$, $n = 9$.')]);

  {
    const t = pravilni(5, 5, [0, 0], 90);
    Z(3, 'Koliki je zbir uglova na vrhovima pravilne petokrake zvezde (kao na slici)?',
      ['$180°$', '$360°$', '$540°$', '$300°$'],
      [K('Unutrašnji petougao zvezde je pravilan, pa su mu uglovi $540° : 5 = 108°$.', ['pet']),
       K('Krak zvezde je jednakokraki trougao; uglovi uz njegovu osnovicu su naporedni sa $108°$: $180° − 108° = 72°$.'),
       K('Ugao na vrhu kraka: $180° − 2 · 72° = 36°$. Pet vrhova: $5 · 36° = 180°$. (Zanimljivo: isto važi za svaku petokraku zvezdu, i nepravilnu!)', ['v'])],
      G({ ...t, P: naKrugu([0, 0], 1.91, 126), Q: naKrugu([0, 0], 1.91, 54), R: naKrugu([0, 0], 1.91, -18), S: naKrugu([0, 0], 1.91, -90), T: naKrugu([0, 0], 1.91, -162) },
        [{ p: 'ACEBD', b: 3, prazno: 1 }, { p: 'PQRST', b: 1, id: 'pet', k: 1 }, { u: 'CAD', id: 'v', o: '?', b: 1, r: 30 }],
        { bezImena: ['A', 'B', 'C', 'D', 'E', 'P', 'Q', 'R', 'S', 'T'], velicina: 240 }));
  }

  // ════════════════ 4.3 Pravilni mnogouglovi ════════════════
  L('Pravilni mnogouglovi');

  Z(1, 'Stranica pravilnog šestougla je $4 cm$. Koliki je poluprečnik kruga opisanog oko njega?',
    ['$4 cm$', '$8 cm$', '$2 cm$', '$4√{3} cm$'],
    [K('Duži od centra do temena dele šestougao na $6$ trouglova sa uglom $360° : 6 = 60°$ kod centra.', ['tr']),
     K('Ti trouglovi su jednakokraki sa uglom od $60°$ – dakle jednakostranični: poluprečnik je jednak stranici, $r = 4 cm$.', ['r'])],
    mnogougao(6, { t: { O: [0, 0] }, bez: ['O'], dod: [{ kr: 'O', r: 5, b: 4, isp: 1 }, { p: 'OAB', b: 1, id: 'tr', k: 1 }, { d: 'OA', b: 3, id: 'r', k: 1 }, { d: 'AB', o: '4 cm' }] }));

  Z(1, 'Koliki je centralni ugao pravilnog petougla?',
    ['$72°$', '$108°$', '$60°$', '$36°$'],
    [K('Centralni ugao ima teme u centru, a kraci idu ka dva susedna temena.', ['cu']),
     K('Pet jednakih centralnih uglova čini pun ugao: $360° : 5 = 72°$. ($108°$ je unutrašnji ugao petougla.)')],
    mnogougao(5, { t: { O: [0, 0] }, bez: ['O'], dod: [{ d: 'OA', isp: 1 }, { d: 'OB', isp: 1 }, { u: 'AOB', id: 'cu', b: 1, o: '?' }] }));

  Z(1, 'Koliki je unutrašnji ugao pravilnog šestougla?',
    ['$120°$', '$60°$', '$135°$', '$108°$'],
    [K('Zbir unutrašnjih uglova: $(6 − 2) · 180° = 720°$.'),
     K('$720° : 6 = 120°$ (dva ugla jednakostraničnih trouglova od po $60°$).')]);

  Z(2, 'Kolika je površina pravilnog šestougla stranice $2 cm$?',
    ['$6√{3} cm²$', '$12 cm²$', '$3√{3} cm²$', '$24√{3} cm²$'],
    [K('Šestougao se sastoji od $6$ jednakostraničnih trouglova stranice $2 cm$.', ['t1']),
     K('Površina jednog: ${a²√{3}|4} = {4√{3}|4} = √{3} cm²$.'),
     K('$P = 6√{3} cm² ≈ 10,4 cm²$')],
    mnogougao(6, { t: { O: [0, 0] }, bez: ['O'], dod: [{ p: 'OAB', b: 1, id: 't1' }, { p: 'OBC', b: 2, k: 1 }, { p: 'OCD', b: 1, k: 1 }, { p: 'ODE', b: 2, k: 1 }, { p: 'OEF', b: 1, k: 1 }, { p: 'OFA', b: 2, k: 1 }, { d: 'AB', o: '2 cm' }] }));

  {
    // popločavanje oko jednog temena: trouglovi, kvadrati, šestouglovi
    Z(2, 'Kojim od ovih pravilnih mnogouglova se NE može popločati ravan (bez praznina i preklapanja)?',
      ['petouglovima', 'jednakostraničnim trouglovima', 'kvadratima', 'šestouglovima'],
      [K('Oko svakog temena pločice moraju da popune pun ugao $360°$, pa unutrašnji ugao mora biti delilac broja $360°$.'),
       K('Trougao: $360° : 60° = 6$ ✓; kvadrat: $360° : 90° = 4$ ✓; šestougao: $360° : 120° = 3$ ✓ (kao saće).', [], (() => {
         const t = { O: [0, 0] }, e = [];
         for (let i = 0; i < 3; i++) {
           const imena = ['abcdef', 'ghijkl', 'mnopqr'][i];
           Object.assign(t, pravilni(6, 1, naKrugu([0, 0], 1, 30 + i * 120), 210 + i * 120, imena));
           e.push({ p: imena, b: i + 1 });
         }
         return G(t, e, { bezImena: ['O'], velicina: 200 });
       })()),
       K('Petougao ima ugao $108°$: tri daju $324°$ (ostaje praznina), a četiri $432°$ (preklapanje). Petouglovima se ne može popločati.')]);
  }

  Z(2, 'Stranica pravilnog šestougla $ABCDEF$ je $6 cm$. Kolika je kraća dijagonala $AC$?',
    ['$6√{3} cm$', '$12 cm$', '$6√{2} cm$', '$3√{3} cm$'],
    [K('Trougao $ABC$ je jednakokraki ($AB = BC = 6 cm$) sa uglom $120°$ kod $B$. Visina iz $B$ polovi $AC$.', ['abc']),
     K('Ta visina deli ga na dve polovine jednakostraničnog trougla stranice $6$: visina $3 cm$, a pola dijagonale je ${6√{3}|2} = 3√{3} cm$.', ['h']),
     K('$AC = 2 · 3√{3} = 6√{3} cm ≈ 10,4 cm$', ['ac'])],
    mnogougao(6, { t: { M: naKrugu([0, 0], 2.5, -60) }, bez: ['M'], dod: [{ p: 'ABC', b: 1, id: 'abc', k: 1 }, { d: 'AC', b: 3, id: 'ac' }, { d: 'BM', isp: 1, id: 'h', k: 2 }, { d: 'AB', o: '6 cm' }] }));

  Z(2, 'Stranica pravilnog šestougla je $5 cm$. Kolika je njegova duža dijagonala?',
    ['$10 cm$', '$5√{3} cm$', '$15 cm$', '$5√{2} cm$'],
    [K('Duža dijagonala prolazi kroz centar i sastoji se od dva poluprečnika opisanog kruga.', ['ad']),
     K('Kod pravilnog šestougla poluprečnik je jednak stranici: $r = 5 cm$, pa je duža dijagonala $2 · 5 = 10 cm$.')],
    mnogougao(6, { t: { O: [0, 0] }, bez: ['O'], dod: [{ d: 'AD', b: 3, id: 'ad' }, { p: 'OAB', b: 1, k: 2 }, { d: 'AB', o: '5 cm' }] }));

  Z(3, 'Kvadrat i pravilni šestougao imaju isti obim, $24 cm$. Koji ima veću površinu?',
    ['šestougao: $24√{3} cm²$ prema $36 cm²$', 'kvadrat: $36 cm²$ prema $24√{3} cm²$', 'imaju jednake površine', 'šestougao: $36√{3} cm²$ prema $36 cm²$'],
    [K('Kvadrat: $a = 24 : 4 = 6 cm$, $P = 36 cm²$.'),
     K('Šestougao: $a = 24 : 6 = 4 cm$; šest jednakostraničnih trouglova: $P = 6 · {16√{3}|4} = 24√{3} cm²$.'),
     K('$24√{3} ≈ 41,6 > 36$ – šestougao je veći. Što je lik „okrugliji“, to pri istom obimu obuhvata veću površinu (zato pčele grade šestougaono saće).')]);

  Z(3, 'Koliki je ugao $BAC$ u pravilnom šestouglu $ABCDEF$?',
    ['$30°$', '$60°$', '$20°$', '$45°$'],
    [K('Trougao $ABC$ je jednakokraki: $AB = BC$.', ['abc']),
     K('Ugao kod $B$ je unutrašnji ugao šestougla: $120°$.', ['ub']),
     K('Uglovi na osnovici: $(180° − 120°) : 2 = 30°$.', ['ua'])],
    mnogougao(6, { dod: [{ p: 'ABC', b: 1, id: 'abc' }, { u: 'ABC', id: 'ub', o: '120°', k: 2 }, { u: 'CAB', id: 'ua', o: '?', b: 1, r: 34 }] }));

  Z(3, 'U krug poluprečnika $10 cm$ upisan je pravilni dvanaestougao. Kolika je njegova površina?',
    ['$300 cm²$', '$314 cm²$', '$600 cm²$', '$150 cm²$'],
    [K('Dvanaestougao se deli na $12$ trouglova $OAB$ sa uglom $360° : 12 = 30°$ kod centra.', ['oab']),
     K('Visina iz $A$ na $OB$ naspram je ugla od $30°$ – to je polovina jednakostraničnog trougla, pa je $h = {10|2} = 5 cm$.', ['h']),
     K('$P(OAB) = {OB · h|2} = {10 · 5|2} = 25 cm²$; ukupno $12 · 25 = 300 cm² = 3r²$. (Krug ima $≈ 314 cm²$ – malo više.)')],
    (() => {
      const t = pravilni(12, 5, [0, 0], 0, 'ABCDEFGHIJKL');
      // Z – podnožje visine iz A na OB
      return G({ ...t, O: [0, 0], Z: [r(5 * Math.cos(Math.PI / 6) * Math.cos(Math.PI / 6)), r(5 * Math.cos(Math.PI / 6) * Math.sin(Math.PI / 6))] },
        [{ kr: 'O', r: 5, b: 4, isp: 1 }, { p: 'ABCDEFGHIJKL', b: 0 }, { p: 'OAB', b: 1, id: 'oab', o: '30°' }, { d: 'AZ', isp: 1, b: 3, id: 'h', k: 2 }, { pu: 'AZO', k: 2 }],
        { bezImena: ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Z'], velicina: 240 });
    })());

  // ════════════════ 4.4 Konstrukcija pravilnih mnogouglova ════════════════
  L('Konstrukcija pravilnih mnogouglova');

  {
    // šestougao nanošenjem poluprečnika: lukovi oko svakog temena
    const t = { ...pravilni(6, 5, [0, 0], 0), O: [0, 0] };
    const e = [{ kr: 'O', r: 5, b: 4 }, { tacka: 'O' }];
    'ABCDEF'.split('').forEach((v, i) => { e.push({ l: v, r: 5, od: 60 * i + 90, do: 60 * i + 150, b: 3, k: 1 }); e.push({ tacka: v, b: 1, k: 1 }); });
    e.push({ p: 'ABCDEF', b: 1, prazno: 1, k: 2, id: 'sest' });
    Z(1, 'U krug poluprečnika $3 cm$ treba upisati pravilni šestougao. Na koliko treba otvoriti šestar da bi se temena nanosila redom po kružnici?',
      ['$3 cm$', '$6 cm$', '$1,5 cm$', '$3√{3} cm$'],
      [K('Stranica pravilnog šestougla jednaka je poluprečniku opisanog kruga (šest jednakostraničnih trouglova).'),
       K('Otvor šestara $r = 3 cm$: iz proizvoljne tačke na kružnici nanosimo tetive dužine $r$ – tačno šest puta obiđemo krug.'),
       K('Spojimo susedne tačke i dobijamo šestougao.', ['sest'])],
      G(t, e, { bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'O'], velicina: 240 }));
  }

  Z(1, 'Šta treba nacrtati u krugu da bi se u njega upisao kvadrat?',
    ['dva međusobno normalna prečnika', 'dve paralelne tetive', 'šest tetiva dužine poluprečnika', 'jedan prečnik i jednu tangentu'],
    [K('Dijagonale kvadrata su jednake, polove se i normalne su jedna na drugu.'),
     K('U krugu su to dva normalna prečnika: njihovi krajevi su temena kvadrata.', ['pr']),
     K('Normalni prečnik se konstruiše kao simetrala prvog prečnika.', ['kv'])],
    G({ O: [0, 0], A: [5, 0], B: [0, 5], C: [-5, 0], D: [0, -5] },
      [{ kr: 'O', r: 5, b: 4 }, { d: 'AC', b: 3, id: 'pr', k: 2 }, { d: 'BD', b: 3, id: 'pr', k: 2 }, { pu: 'AOB', k: 2 }, { p: 'ABCD', b: 1, prazno: 1, id: 'kv', k: 3 }], { bezImena: ['O'], velicina: 220 }));

  Z(1, 'Kako se od upisanog pravilnog šestougla dobija upisan jednakostranični trougao?',
    ['spajanjem svakog drugog temena', 'spajanjem svaka dva susedna temena', 'povlačenjem svih dužih dijagonala', 'prepolovljavanjem svake stranice'],
    [K('Temena šestougla dele krug na $6$ jednakih lukova od $60°$.'),
     K('Svako drugo teme ($A$, $C$, $E$) deli krug na $3$ luka od $120°$ – to su temena jednakostraničnog trougla.', ['ace'])],
    mnogougao(6, { t: { O: [0, 0] }, bez: ['O'], dod: [{ kr: 'O', r: 5, b: 4, isp: 1 }, { p: 'ACE', b: 1, id: 'ace', k: 2 }] }));

  Z(2, 'Kako se konstruiše pravilni osmougao upisan u krug?',
    ['prvo upisani kvadrat, pa simetrale njegovih stranica seku krug u preostalim temenima', 'nanošenjem poluprečnika osam puta po kružnici', 'spajanjem svakog drugog temena šestougla', 'deljenjem prečnika na osam jednakih delova'],
    [K('Centralni ugao osmougla je $360° : 8 = 45°$ – polovina centralnog ugla kvadrata ($90°$).'),
     K('Simetrala stranice kvadrata prolazi kroz centar i polovi centralni ugao od $90°$ – seče krug baš u novom temenu.', ['sim']),
     K('Tako dobijamo $4 + 4 = 8$ temena.', ['osm'])],
    (() => {
      const t = { ...pravilni(8, 5, [0, 0], 0, 'ABCDEFGH'), O: [0, 0] };
      return G(t, [{ kr: 'O', r: 5, b: 4 }, { p: 'ACEG', b: 0, k: 1 }, { d: 'BF', isp: 1, b: 3, id: 'sim', k: 2 }, { d: 'DH', isp: 1, b: 3, id: 'sim', k: 2 }, { p: 'ABCDEFGH', b: 1, prazno: 1, id: 'osm', k: 3 }], { bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'O'], velicina: 220 });
    })());

  Z(2, 'Kolika je stranica kvadrata upisanog u krug poluprečnika $5 cm$?',
    ['$5√{2} cm$', '$10 cm$', '$5 cm$', '$10√{2} cm$'],
    [K('Dijagonala upisanog kvadrata je prečnik kruga: $d = 10 cm$.', ['d']),
     K('Iz $d = a√{2}$: $a = {10|√{2}} = 5√{2} cm ≈ 7,07 cm$. (Ili: trougao $AOB$ je pravougli sa katetama $5$: $a² = 25 + 25 = 50$.)', ['aob'])],
    G({ O: [0, 0], A: [5, 0], B: [0, 5], C: [-5, 0], D: [0, -5] },
      [{ kr: 'O', r: 5, b: 4 }, { p: 'ABCD' }, { d: 'AC', b: 3, id: 'd', isp: 1 }, { p: 'AOB', b: 1, id: 'aob', k: 2 }, { pu: 'AOB', k: 2 }, { d: 'OA', o: '5 cm' }], { bezImena: ['O'], velicina: 220 }));

  Z(2, 'Kolika je stranica jednakostraničnog trougla upisanog u krug poluprečnika $4 cm$?',
    ['$4√{3} cm$', '$8 cm$', '$6 cm$', '$2√{3} cm$'],
    [K('Stranica $AC$ upisanog trougla je kraća dijagonala upisanog šestougla stranice $r = 4 cm$.', ['ac']),
     K('Iz pravouglog trougla $ACD$ ($AD$ je prečnik, ugao kod $C$ je prav): $AC² = 8² − 4² = 48$.', ['acd']),
     K('$AC = √{48} = 4√{3} cm ≈ 6,9 cm$, tj. $a = r√{3}$.')],
    mnogougao(6, { t: { O: [0, 0] }, bez: ['O'], dod: [{ kr: 'O', r: 5, b: 4, isp: 1 }, { p: 'ACE', b: 0, prazno: 1 }, { d: 'AC', b: 3, id: 'ac' }, { p: 'ACD', b: 1, id: 'acd', k: 2 }, { pu: 'ACD', k: 2 }] }));

  Z(2, 'Za konstrukciju pravilnog dvanaestougla polazi se od upisanog šestougla. Koliki centralni ugao treba dobiti i kako?',
    ['$30°$ – simetralom centralnog ugla šestougla', '$60°$ – nanošenjem poluprečnika', '$45°$ – simetralom pravog ugla', '$36°$ – deljenjem kruga na deset delova'],
    [K('Centralni ugao dvanaestougla: $360° : 12 = 30°$ – polovina centralnog ugla šestougla ($60°$).'),
     K('Simetrala ugla od $60°$ (ili simetrala stranice šestougla) seče krug u novom temenu.')]);

  Z(3, 'Krugu poluprečnika $3 cm$ upisan je kvadrat, a opisan je drugi kvadrat. Koliko puta je površina opisanog kvadrata veća od površine upisanog?',
    ['$2$ puta', '$4$ puta', '$√{2}$ puta', '$1,5$ puta'],
    [K('Opisani kvadrat ima stranicu jednaku prečniku: $6 cm$, $P = 36 cm²$.', ['op']),
     K('Upisani kvadrat ima dijagonalu $6 cm$: $P = {d²|2} = {36|2} = 18 cm²$.', ['up']),
     K('Bez računa: četiri ugaona trougla opisanog kvadrata, okrenuta za $180°$ oko središta stranica upisanog kvadrata, tačno ga prekriju. Opisani kvadrat je dvostruko veći: $36 : 18 = 2$.', ['rot'])],
    G({ O: [0, 0], A: [3, 0], B: [0, 3], C: [-3, 0], D: [0, -3], P: [-3, -3], Q: [3, -3], R: [3, 3], S: [-3, 3], m: [1.5, 1.5], n: [-1.5, 1.5], o: [-1.5, -1.5], q: [1.5, -1.5] },
      [{ p: 'PQRS', b: 0, id: 'op' }, { kr: 'O', r: 3, b: 4, isp: 1 }, { p: 'ABCD', b: 1, id: 'up' }, { d: 'AC', isp: 1, k: 2 },
       { p: 'ARB', b: 2, okreni: 180, oko: 'm', k: 3, gusto: 1, id: 'rot' }, { p: 'BSC', b: 2, okreni: 180, oko: 'n', k: 3, gusto: 1, id: 'rot' },
       { p: 'CPD', b: 2, okreni: 180, oko: 'o', k: 3, gusto: 1, id: 'rot' }, { p: 'DQA', b: 2, okreni: 180, oko: 'q', k: 3, gusto: 1, id: 'rot' }],
      { bezImena: ['O', 'A', 'B', 'C', 'D', 'P', 'Q', 'R', 'S'], velicina: 220 }));

  Z(1, 'U krug prečnika $10 cm$ upisan je pravilni šestougao. Kolika je njegova stranica?',
    ['$5 cm$', '$10 cm$', '$5√{3} cm$', '$2,5 cm$'],
    [K('Poluprečnik kruga je $r = 10 : 2 = 5 cm$.', ['r']),
     K('Stranica upisanog pravilnog šestougla jednaka je poluprečniku: $a = 5 cm$. Obim šestougla je $30 cm$ – malo manje od obima kruga ($10π ≈ 31,4 cm$).', ['tr'])],
    mnogougao(6, { t: { O: [0, 0] }, bez: ['O'], dod: [{ kr: 'O', r: 5, b: 4 }, { d: 'AD', isp: 1, o: '10 cm', b: 3 }, { d: 'OB', b: 1, id: 'r', k: 1 }, { p: 'OAB', b: 1, id: 'tr', k: 2 }] }));

  Z(3, 'Koji od ovih pravilnih mnogouglova NE može da se konstruiše lenjirom i šestarom?',
    ['sedmougao', 'osmougao', 'dvanaestougao', 'šesnaestougao'],
    [K('Osmougao, dvanaestougao i šesnaestougao dobijaju se ponovljenim prepolovljavanjem centralnih uglova kvadrata ($90° → 45° → 22,5°$) ili šestougla ($60° → 30°$).'),
     K('Pravilni sedmougao se ne može konstruisati samo lenjirom i šestarom – to je dokazano u 19. veku (Gaus).'),
     K('Gaus je, kao devetnaestogodišnjak, otkrio da se može konstruisati pravilni sedamnaestougao!')]);

  // ════════════════ 4.5 Obim i površina mnogougla ════════════════
  L('Obim i površina mnogougla');

  Z(1, 'Osnovice trapeza su $10 cm$ i $6 cm$, a visina $4 cm$. Kolika je površina trapeza?',
    ['$32 cm²$', '$64 cm²$', '$40 cm²$', '$24 cm²$'],
    [K('$P = {a + b|2} · h$ – srednja linija puta visina.', ['m']),
     K('$P = {10 + 6|2} · 4 = 8 · 4 = 32 cm²$')],
    G({ A: [0, 0], B: [10, 0], C: [8, 4], D: [2, 4], M: [1, 2], N: [9, 2], d: [2, 0] },
      [{ p: 'ABCD' }, { d: 'AB', o: '10 cm' }, { d: 'DC', o: '6 cm' }, { d: 'MN', isp: 1, b: 3, id: 'm', o: '8', k: 1 }, { d: 'Dd', isp: 1, o: '4' }], { bezImena: ['M', 'N'] }));

  Z(1, 'Dijagonale romba su $8 cm$ i $6 cm$. Kolika je površina romba?',
    ['$24 cm²$', '$48 cm²$', '$14 cm²$', '$28 cm²$'],
    [K('Romb je pola pravougaonika čije su stranice jednake dijagonalama.', ['pr']),
     K('$P = {d₁ · d₂|2} = {8 · 6|2} = 24 cm²$')],
    G({ A: [-4, 0], B: [0, -3], C: [4, 0], D: [0, 3], e: [-4, -3], f: [4, -3], g: [4, 3], h: [-4, 3] },
      [{ p: 'efgh', b: 5, prazno: 1, isp: 1, id: 'pr', k: 1 }, { p: 'ABCD' }, { d: 'AC', o: '8 cm', isp: 1, na: 0.75 }, { d: 'BD', o: '6 cm', isp: 1, na: 0.25 }], { bezImena: ['A', 'B', 'C', 'D'] }));

  Z(1, 'Kolika je površina figure na slici, ako je stranica kvadratića mreže $1 cm$?',
    ['$14 cm²$', '$16 cm²$', '$12 cm²$', '$20 cm²$'],
    [K('Figuru razložimo na pravougaonike: donji $5 × 2 = 10 cm²$…', ['d']),
     K('…i gornji $2 × 2 = 4 cm²$.', ['g']),
     K('$P = 10 + 4 = 14 cm²$. (Ili: pravougaonik $5 × 4 = 20$ minus izrezani deo $3 × 2 = 6$.)')],
    G({ A: [0, 0], B: [5, 0], C: [5, 2], D: [2, 2], E: [2, 4], F: [0, 4], H: [0, 2] },
      [{ mreza: [0, 6, 0, 5], brojevi: 0 }, { p: 'ABCDEF', b: 1 }, { p: 'ABCH', b: 0, id: 'd', k: 1, prazno: 1 }, { p: 'HDEF', b: 2, id: 'g', k: 2, prazno: 1 }],
      { bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'H'], velicina: 220 }));

  Z(2, 'Kućica na slici je sastavljena od pravougaonika $6 × 4$ i trougla osnovice $6$ i visine $3$ (u cm). Kolika je njena površina?',
    ['$33 cm²$', '$42 cm²$', '$24 cm²$', '$27 cm²$'],
    [K('Pravougaonik: $6 · 4 = 24 cm²$.', ['pr']),
     K('Trougao (krov): ${6 · 3|2} = 9 cm²$.', ['kr']),
     K('$P = 24 + 9 = 33 cm²$. (Greška $42$: krov računat kao $6 · 3$ bez deljenja sa $2$.)')],
    G({ A: [0, 0], B: [6, 0], C: [6, 4], D: [3, 7], E: [0, 4], M: [3, 4] },
      [{ p: 'ABCE', id: 'pr' }, { p: 'ECD', b: 1, id: 'kr' }, { d: 'AB', o: '6 cm' }, { d: 'BC', o: '4 cm' }, { d: 'MD', isp: 1, o: '3' }], { bezImena: ['A', 'B', 'C', 'D', 'E', 'M'] }));

  Z(2, 'Kolika je površina četvorougla sa temenima $A(1, 1)$, $B(7, 1)$, $C(5, 5)$ i $D(1, 4)$?',
    ['$18$', '$24$', '$20$', '$15$'],
    [K('Četvorougao „upakujemo“ u pravougaonik od $x = 1$ do $7$ i od $y = 1$ do $5$: $6 · 4 = 24$.', ['pr']),
     K('Oduzmemo dva pravougla trougla van četvorougla: kod $B$ i $C$ (katete $2$ i $4$, $P = 4$) i kod $D$ i $C$ (katete $4$ i $1$, $P = 2$).', ['t1', 't2']),
     K('$P = 24 − 4 − 2 = 18$')],
    G({ A: [1, 1], B: [7, 1], C: [5, 5], D: [1, 4], g: [7, 5], h: [1, 5], O: [0, 0] },
      [{ mreza: [0, 8, 0, 6], ose: ['x', 'y'] }, { p: 'ABgh', b: 5, prazno: 1, isp: 1, id: 'pr', k: 1 }, { p: 'BgC', b: 2, id: 't1', k: 2 }, { p: 'ChD', b: 2, id: 't2', k: 2 }, { p: 'ABCD', b: 1 }],
      { bezImena: ['O'], velicina: 260 }));

  Z(2, 'Obim pravougaonika je $30 cm$, a stranice su u razmeri $2 : 3$. Kolika je površina?',
    ['$54 cm²$', '$36 cm²$', '$90 cm²$', '$150 cm²$'],
    [K('$a + b = 15 cm$; $15$ podelimo na $2 + 3 = 5$ delova po $3 cm$.'),
     K('$a = 6 cm$, $b = 9 cm$, pa je $P = 6 · 9 = 54 cm²$.')]);

  Z(2, 'Stranice paralelograma su $8 cm$ i $10 cm$, a visina koja odgovara stranici od $8 cm$ je $5 cm$. Kolika je druga visina?',
    ['$4 cm$', '$6,25 cm$', '$5 cm$', '$3 cm$'],
    [K('$P = a · hₐ = 8 · 5 = 40 cm²$.', ['ha']),
     K('Ista površina preko druge stranice: $40 = 10 · h_{b}$, pa je $h_{b} = 4 cm$.', ['hb']),
     K('Duža stranica – kraća visina.')],
    G({ A: [0, 0], B: [8, 0], C: [16.66, 5], D: [8.66, 5], E: [8.66, 0], F: [6, 3.464] },
      [{ p: 'ABCD' }, { d: 'AB', o: '8 cm' }, { d: 'AD', o: '10 cm' }, { d: 'DE', isp: 1, o: '5 cm', id: 'ha', b: 3 }, { pu: 'DEA' }, { d: 'BF', isp: 1, b: 1, id: 'hb', k: 2 }, { pu: 'BFA', k: 2 }], { bezImena: ['E', 'F'] }));

  Z(3, 'Kvadrat stranice $12 cm$ i pravougaonik sa jednom stranicom $16 cm$ imaju istu površinu. Koliki je obim pravougaonika?',
    ['$50 cm$', '$48 cm$', '$56 cm$', '$64 cm$'],
    [K('$P = 12² = 144 cm²$.'),
     K('Druga stranica pravougaonika: $144 : 16 = 9 cm$.'),
     K('$O = 2(16 + 9) = 50 cm$ – veći od obima kvadrata ($48 cm$).')]);

  Z(3, 'Kolika je površina trougla $ACE$ u odnosu na površinu pravilnog šestougla $ABCDEF$?',
    ['polovina', 'trećina', 'dve trećine', 'četvrtina'],
    [K('Šestougao se sastoji od trougla $ACE$ i tri „ugaona“ trougla $ABC$, $CDE$ i $EFA$.', ['ace', 't1']),
     K('Okrenimo trougao $ABC$ za $180°$ oko središta duži $AC$: teme $B$ pada tačno u centar $O$ (jer je $ABCO$ romb).', ['t1', 'r1']),
     K('Isto važi i za druga dva trougla – zajedno tačno pokrivaju trougao $ACE$.', ['r2', 'r3']),
     K('Dakle, $ACE$ je jednak zbiru tri ugaona trougla – to je polovina šestougla.')],
    (() => {
      const t = { ...pravilni(6, 5, [0, 0], 90), O: [0, 0] };
      const sr = (a, b) => [r((t[a][0] + t[b][0]) / 2), r((t[a][1] + t[b][1]) / 2)];
      return G({ ...t, M: sr('A', 'C'), N: sr('C', 'E'), P: sr('E', 'A') },
        [{ p: 'ABCDEF', b: 0 }, { p: 'ACE', b: 1, id: 'ace' }, { p: 'ABC', b: 2, id: 't1' }, { p: 'CDE', b: 2 }, { p: 'EFA', b: 2 },
         { p: 'ABC', b: 3, okreni: 180, oko: 'M', k: 2, id: 'r1', gusto: 1 }, { p: 'CDE', b: 3, okreni: 180, oko: 'N', k: 3, id: 'r2', gusto: 1 }, { p: 'EFA', b: 3, okreni: 180, oko: 'P', k: 3, id: 'r3', gusto: 1 }],
        { bezImena: ['O', 'M', 'N', 'P'], velicina: 240 });
    })());

  Z(3, 'Kolika je obim „stepenaste“ figure na slici, ako je stranica kvadratića $1 cm$?',
    ['$20 cm$', '$24 cm$', '$16 cm$', '$28 cm$'],
    [K('Vodoravni delovi stepenica zajedno daju koliko i gornja ivica: $6 cm$ (pomerimo ih gore).', ['h']),
     K('Uspravni delovi zajedno daju koliko i desna ivica: $4 cm$ (pomerimo ih udesno).', ['v']),
     K('Obim je isti kao obim pravougaonika $6 × 4$: $O = 2(6 + 4) = 20 cm$.')],
    G({ A: [0, 0], B: [6, 0], C: [6, 4], D: [4.5, 4], E: [4.5, 3], F: [3, 3], H: [3, 2], I: [1.5, 2], J: [1.5, 1], M: [0, 1] },
      [{ mreza: [0, 6, 0, 4], brojevi: 0, podela: 0.5 }, { p: 'ABCDEFHIJM', b: 1 },
       { lin: [[0, 4.4], [6, 4.4]], b: 3, k: 1, id: 'h', o: '6 cm', oAt: [3, 4.9] }, { lin: [[6.4, 0], [6.4, 4]], b: 2, k: 2, id: 'v', o: '4 cm', oAt: [7.3, 2] }],
      { bezImena: ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'M'], velicina: 240 }));

  // ════════════════ 4.6 Ortocentar i težište trougla ════════════════
  L('Ortocentar i težište trougla');

  // trougao sa težišnim dužima
  const tezisni = (A, B, C, x = {}) => {
    const s = (p, q) => [r((p[0] + q[0]) / 2), r((p[1] + q[1]) / 2)];
    const T = [r((A[0] + B[0] + C[0]) / 3), r((A[1] + B[1] + C[1]) / 3), x.ugT ?? -30];
    return G({ A, B, C, 'A₁': s(B, C), 'B₁': s(A, C), 'C₁': [...s(A, B), -90], T },
      [{ p: 'ABC', b: 0 }, { d: 'AA₁', b: 3, id: 'ta', isp: 1 }, { d: 'BB₁', b: 3, id: 'tb', isp: 1 }, { d: 'CC₁', b: 3, id: 'tc', isp: 1 }, { tacka: 'T', b: 1 }, ...(x.dod || [])],
      { bezImena: x.bez || [], velicina: 260 });
  };

  Z(1, 'Težišna duž $AA₁$ trougla $ABC$ duga je $12 cm$, a $T$ je težište. Koliko je $AT$?',
    ['$8 cm$', '$4 cm$', '$6 cm$', '$9 cm$'],
    [K('Težište deli svaku težišnu duž u razmeri $2 : 1$, računajući od temena.', ['at', 'ta1']),
     K('$12$ podelimo na $3$ dela po $4 cm$: $AT = 2 · 4 = 8 cm$, a $TA₁ = 4 cm$.')],
    (() => { const g = tezisni([0, 0], [9, 0], [3, 7]); g.e.push({ d: 'AT', b: 1, id: 'at', k: 1 }, { d: 'TA₁', b: 2, id: 'ta1', k: 1 }); return g; })());

  Z(1, 'Gde se nalazi ortocentar pravouglog trougla?',
    ['u temenu pravog ugla', 'u središtu hipotenuze', 'u težištu', 'izvan trougla'],
    [K('Ortocentar je presek pravih na kojima leže visine.'),
     K('U pravouglom trouglu svaka kateta je visina na drugu katetu – obe prolaze kroz teme pravog ugla $C$.', ['ha', 'hb']),
     K('Zato se i treća visina (na hipotenuzu) seče sa njima u temenu $C$: $H = C$.', ['hc'])],
    G({ A: [8, 0], B: [0, 6], C: [0, 0, 225], D: [2.88, 3.84] },
      [{ p: 'ABC' }, { pu: 'ACB' }, { d: 'CA', b: 3, id: 'ha', k: 2 }, { d: 'CB', b: 3, id: 'hb', k: 2 }, { d: 'CD', b: 1, isp: 1, id: 'hc', k: 3 }, { pu: 'CDA', k: 3 }, { tacka: 'C', b: 1, k: 3 }], { bezImena: ['D'] }));

  Z(1, 'Gde se nalazi ortocentar tupouglog trougla?',
    ['izvan trougla', 'unutar trougla', 'na najdužoj stranici', 'u temenu tupog ugla'],
    [K('Visine iz temena oštrih uglova padaju na produžetke stranica, izvan trougla.', ['h1', 'h2']),
     K('Prave na kojima leže visine seku se izvan trougla, iza temena tupog ugla.', ['H'])],
    (() => {
      const A = [0, 0], B = [10, 0], C = [2, 3];
      // ortocentar: x = 2 (visina iz C), visina iz A normalna na BC
      const H = [2, r((10 - 2) * 2 / 3)];
      const A1 = (() => { const d = [C[0] - B[0], C[1] - B[1]]; const t = ((A[0] - B[0]) * d[0] + (A[1] - B[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2); return [r(B[0] + t * d[0]), r(B[1] + t * d[1])]; })();
      const B1 = (() => { const d = [C[0], C[1]]; const t = (B[0] * d[0] + B[1] * d[1]) / (d[0] ** 2 + d[1] ** 2); return [r(t * d[0]), r(t * d[1])]; })();
      return G({ A, B, C, H: [...H, 90], 'A₁': A1, 'B₁': B1, D: [2, 0, -90] },
        [{ p: 'ABC' }, { d: 'CD', isp: 1, b: 3 }, { d: 'AA₁', b: 3, id: 'h1', k: 1 }, { d: 'BB₁', b: 3, id: 'h2', k: 1 }, { d: 'CB₁', isp: 1, k: 1 }, { d: 'A₁H', isp: 1, b: 1, k: 2 }, { d: 'B₁H', isp: 1, b: 1, k: 2 }, { d: 'CH', isp: 1, b: 1, k: 2 }, { tacka: 'H', b: 1, k: 2, id: 'H' }],
        { bezImena: ['A₁', 'B₁', 'D'], velicina: 260 });
    })());

  Z(2, 'Težišna duž $CC₁$ trougla $ABC$ duga je $9 cm$. Koliko je težište udaljeno od tačke $C₁$ (središta stranice $AB$)?',
    ['$3 cm$', '$6 cm$', '$4,5 cm$', '$2 cm$'],
    [K('Težište deli težišnu duž u razmeri $2 : 1$ od temena: $CT : TC₁ = 2 : 1$.'),
     K('$TC₁ = {9|3} = 3 cm$ (a $CT = 6 cm$).', ['tc'])],
    tezisni([0, 0], [10, 0], [6, 7]));

  Z(2, 'Kod jednakostraničnog trougla stranice $6 cm$, koliko je težište udaljeno od temena?',
    ['$2√{3} cm$', '$3√{3} cm$', '$√{3} cm$', '$4 cm$'],
    [K('Visina je ujedno i težišna duž: $h = {a√{3}|2} = 3√{3} cm$.', ['tc']),
     K('Težište je na ${2|3}$ visine od temena: ${2|3} · 3√{3} = 2√{3} cm ≈ 3,46 cm$. (Kod jednakostraničnog trougla ortocentar i težište se poklapaju.)')],
    tezisni([0, 0], [6, 0], [3, r(3 * S3)], { bez: ['A₁', 'B₁', 'C₁'] }));

  Z(2, 'Katete pravouglog trougla su $6 cm$ i $8 cm$. Koliko je težište udaljeno od temena pravog ugla?',
    ['${10|3} cm$', '$5 cm$', '${5|3} cm$', '$4 cm$'],
    [K('Hipotenuza: $√{36 + 64} = 10 cm$.'),
     K('Središte hipotenuze je centar opisanog kruga, pa je težišna duž iz $C$ jednaka polovini hipotenuze: $CC₁ = 5 cm$.', ['tc']),
     K('$CT = {2|3} · 5 = {10|3} cm ≈ 3,33 cm$.')],
    (() => { const g = tezisni([8, 0], [0, 6], [0, 0], { bez: ['A₁', 'B₁'] }); g.e.push({ pu: 'ACB' }, { d: 'CA', o: '8 cm' }, { d: 'CB', o: '6 cm' }); g.t.C[2] = 225; return g; })());

  Z(2, 'U trouglu $ABC$ je $∠A = 70°$ i $∠B = 60°$, a $H$ je ortocentar. Koliki je ugao $AHB$?',
    ['$130°$', '$50°$', '$120°$', '$110°$'],
    [K('$∠C = 180° − 70° − 60° = 50°$.'),
     K('U četvorouglu $CA₁HB₁$ uglovi kod podnožja visina su pravi, pa je $∠A₁HB₁ = 360° − 90° − 90° − 50° = 130°$.', ['cetv']),
     K('$∠AHB$ je unakrsni sa $∠A₁HB₁$, pa je i on $130°$, tj. $180° − ∠C$.', ['ahb'])],
    (() => {
      const A = [0, 0], B = [8, 0];
      // C iz uglova 70° i 60°
      const tA = Math.tan(70 * Math.PI / 180), tB = Math.tan(60 * Math.PI / 180);
      const cx = 8 * tB / (tA + tB), C = [r(cx), r(cx * tA)];
      const proj = (P, Q, X) => { const d = [Q[0] - P[0], Q[1] - P[1]]; const t = ((X[0] - P[0]) * d[0] + (X[1] - P[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2); return [r(P[0] + t * d[0]), r(P[1] + t * d[1])]; };
      const A1 = proj(B, C, A), B1 = proj(A, C, B);
      const H = [C[0], r(C[0] * (8 - C[0]) / C[1])];
      return G({ A, B, C, 'A₁': A1, 'B₁': B1, H: [...H, -90] },
        [{ p: 'ABC' }, { d: 'AA₁', isp: 1, b: 3 }, { d: 'BB₁', isp: 1, b: 3 }, { pu: 'BA₁A' }, { pu: 'AB₁B' }, { u: 'BAC', o: '70°', r: 26 }, { u: 'CBA', o: '60°', r: 26 },
         { p: 'CA₁HB₁', b: 2, id: 'cetv', k: 2 }, { u: 'AHB', b: 1, id: 'ahb', o: '?', r: 18 }], { velicina: 260 });
    })());

  Z(3, 'Površina trougla $ABC$ je $36 cm²$, a $T$ je njegovo težište. Kolika je površina trougla $ABT$?',
    ['$12 cm²$', '$18 cm²$', '$9 cm²$', '$24 cm²$'],
    [K('Trouglovi $ABT$ i $ABC$ imaju zajedničku osnovicu $AB$.', ['abt']),
     K('Težište je na trećini težišne duži od $C₁$, pa je i njegova visina na $AB$ trećina visine trougla $ABC$.'),
     K('$P(ABT) = {1|3} · 36 = 12 cm²$. Težište deli trougao na tri trougla jednake površine.', ['abt', 'bct', 'cat'])],
    (() => { const g = tezisni([0, 0], [9, 0], [6, 7]); g.e.unshift({ p: 'ABT', b: 1, id: 'abt' }, { p: 'BCT', b: 2, id: 'bct', k: 3 }, { p: 'CAT', b: 4, id: 'cat', k: 3 }); return g; })());

  Z(3, 'Težišne duži dele trougao površine $48 cm²$ na šest manjih trouglova. Kolika je površina trougla $AC₁T$?',
    ['$8 cm²$', '$16 cm²$', '$12 cm²$', '$6 cm²$'],
    [K('Trouglovi $AC₁T$ i $BC₁T$ imaju jednake osnovice ($AC₁ = C₁B$) i istu visinu iz $T$ – jednake su površine.', ['m1', 'm2']),
     K('Isto važi za svaki par uz istu stranicu, a $P(ABT) = P(BCT) = P(CAT) = 16 cm²$, pa je svih šest trouglova jednako.'),
     K('$P(AC₁T) = 48 : 6 = 8 cm²$')],
    (() => { const g = tezisni([0, 0], [10, 0], [3, 8]); g.e.unshift({ p: 'AC₁T', b: 1, id: 'm1' }, { p: 'C₁BT', b: 2, id: 'm2', k: 1 }); return g; })());

  Z(3, 'Krak jednakokrakog trougla je $10 cm$, a osnovica $12 cm$. Koliko je težište udaljeno od osnovice?',
    ['${8|3} cm$', '$4 cm$', '${16|3} cm$', '$2 cm$'],
    [K('Visina na osnovicu: $h² = 10² − 6² = 64$, $h = 8 cm$. Ona je i težišna duž $CC₁$.', ['tc']),
     K('Težište je na trećini težišne duži od osnovice: $TC₁ = {8|3} cm ≈ 2,67 cm$.')],
    tezisni([-6, 0], [6, 0], [0, 8], { bez: ['A₁', 'B₁'] }));

  // ════════════════ 4.7 Složenije primene stavova podudarnosti ════════════════
  L('Složenije primene stavova podudarnosti');

  Z(1, 'Dva trougla imaju jednake po dve stranice i ugao između njih. Po kom stavu su podudarni?',
    ['SUS', 'USU', 'SSS', 'SSU'],
    [K('Jednaki su: stranica, ugao, stranica – i to baš ugao između te dve stranice.'),
     K('To je stav SUS (stranica–ugao–stranica).')],
    G({ A: [0, 0], B: [5, 0], C: [1.5, 3], D: [7, 0], E: [12, 0], F: [8.5, 3] },
      [{ p: 'ABC', b: 0 }, { p: 'DEF', b: 1 }, { d: 'AB', b: 3 }, { d: 'DE', b: 3 }, { d: 'AC', b: 2 }, { d: 'DF', b: 2 }, { u: 'BAC', r: 22 }, { u: 'EDF', r: 22 }], { bezImena: ['A', 'B', 'C', 'D', 'E', 'F'] }));

  Z(1, 'Koji od ovih podataka NIJE dovoljan da bi dva trougla bila podudarna?',
    ['jednaka sva tri ugla', 'jednake sve tri stranice', 'jednake dve stranice i ugao između njih', 'jednaka stranica i dva nalegla ugla'],
    [K('SSS, SUS i USU su stavovi podudarnosti.'),
     K('Trouglovi sa istim uglovima mogu biti različite veličine (jedan je „uvećan“ drugi) – slični su, ali ne i podudarni.', ['mali', 'vel'])],
    G({ A: [0, 0], B: [3, 0], C: [1, 2], D: [4, 0], E: [10, 0], F: [6, 4] },
      [{ p: 'ABC', b: 1, id: 'mali' }, { p: 'DEF', b: 2, id: 'vel' }, { u: 'BAC', r: 14 }, { u: 'EDF', r: 14 }, { u: 'CBA', r: 14 }, { u: 'FED', r: 14 }], { bezImena: ['A', 'B', 'C', 'D', 'E', 'F'] }));

  Z(2, 'Trougao se konstruiše iz stranica $b = AC$, $c = AB$ i težišne duži $t_{c}$, tako što se prvo konstruiše trougao $AC₁C$. Za koje podatke trougao NE postoji?',
    ['$b = 6 cm$, $c = 24 cm$, $t_{c} = 5 cm$', '$b = 6 cm$, $c = 4 cm$, $t_{c} = 5 cm$', '$b = 5 cm$, $c = 6 cm$, $t_{c} = 4 cm$', '$b = 7 cm$, $c = 10 cm$, $t_{c} = 4 cm$'],
    [K('Trougao $AC₁C$ ima stranice $AC = b$, $CC₁ = t_{c}$ i $AC₁ = {c|2}$.', ['pom']),
     K('Za $c = 24$: stranice su $6$, $5$ i $12$, a $6 + 5 = 11 < 12$ – nejednakost trougla ne važi.'),
     K('Ostali: $(6, 5, 2)$, $(5, 4, 3)$, $(7, 4, 5)$ – svi zadovoljavaju nejednakost trougla.')],
    G({ A: [0, 0], B: [4, 0], C: [0.75, 5.95], 'C₁': [2, 0, -90] },
      [{ p: 'ABC', b: 0, prazno: 1, isp: 1 }, { p: 'AC₁C', b: 1, id: 'pom' }, { d: 'AC', o: 'b' }, { d: 'CC₁', o: 'tc' }, { d: 'AC₁', o: 'c/2' }]));

  Z(2, 'U jednakokrakom trouglu $ABC$ (osnovica $AB$) povučene su visine $AA₁$ i $BB₁$. Kojim stavom se dokazuje da su trouglovi $ABB₁$ i $BAA₁$ podudarni (pa su visine jednake)?',
    ['USU', 'SSS', 'SUS', 'nisu podudarni'],
    [K('Stranica $AB$ je zajednička.', ['ab']),
     K('Uglovi na osnovici jednakokrakog trougla su jednaki: $∠BAB₁ = ∠ABA₁$.'),
     K('Pravi uglovi kod $A₁$ i $B₁$ daju i $∠ABB₁ = ∠BAA₁ = 90° − α$. Stranica i dva nalegla ugla – USU, pa je $AA₁ = BB₁$.', ['t1', 't2'])],
    (() => {
      const A = [0, 0], B = [8, 0], C = [4, 7];
      const proj = (P, Q, X) => { const d = [Q[0] - P[0], Q[1] - P[1]]; const t = ((X[0] - P[0]) * d[0] + (X[1] - P[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2); return [r(P[0] + t * d[0]), r(P[1] + t * d[1])]; };
      return G({ A, B, C, 'A₁': proj(B, C, A), 'B₁': proj(A, C, B) },
        [{ p: 'ABC', b: 0 }, { p: 'ABB₁', b: 1, id: 't1', k: 3 }, { p: 'BAA₁', b: 2, id: 't2', k: 3 }, { d: 'AA₁', b: 3, isp: 1 }, { d: 'BB₁', b: 3, isp: 1 }, { pu: 'BA₁A' }, { pu: 'AB₁B' }, { d: 'AB', id: 'ab' }]);
    })());

  Z(2, 'U trouglu $ABC$ je $b = 7 cm$ i $c = 5 cm$. Koja od ovih dužina može biti težišna duž $tₐ$?',
    ['$5 cm$', '$6 cm$', '$7 cm$', '$8 cm$'],
    [K('Produžimo $AA₁$ do $D$ tako da je $A₁D = AA₁$. Trouglovi $AA₁C$ i $DA₁B$ su podudarni (SUS), pa je $BD = b$.', ['abd']),
     K('U trouglu $ABD$: $AD = 2tₐ < c + b = 12$, pa je $tₐ < 6 cm$.'),
     K('Takođe $2tₐ > b − c = 2$, pa je $tₐ > 1 cm$. Od ponuđenih jedino $5 cm$ ispunjava $1 < tₐ < 6$.')],
    G({ A: [0, 0], B: [5, 0], C: [1.4, 6.86], 'A₁': [3.2, 3.43], D: [6.4, 6.86] },
      [{ p: 'ABC', b: 0 }, { d: 'AA₁', b: 3, o: 'tₐ' }, { d: 'A₁D', b: 3, isp: 1, k: 1 }, { p: 'ABD', b: 1, prazno: 1, id: 'abd', k: 1 }, { d: 'BD', b: 1, k: 1 }, { d: 'AB', o: '5' }, { d: 'AC', o: '7' }]));
  {
    // provera: |AC| = 7 i A₁ je središte BC
    proveri(Math.abs(Math.hypot(1.4, 6.86) - 7) < 0.01, 'AC = 7');
  }

  Z(2, 'Dijagonala $AC$ deli paralelogram $ABCD$ na dva trougla. Kojim stavom se najlakše dokazuje da su trouglovi $ABC$ i $CDA$ podudarni?',
    ['SSS', 'UUU', 'SSU', 'nisu podudarni'],
    [K('Naspramne stranice paralelograma su jednake: $AB = CD$ i $BC = DA$.'),
     K('Dijagonala $AC$ je zajednička – sve tri stranice su jednake: stav SSS.', ['t1', 't2']),
     K('Odatle sledi i da su naspramni uglovi paralelograma jednaki.')],
    G({ A: [0, 0], B: [7, 0], C: [9.5, 4], D: [2.5, 4] },
      [{ p: 'ABC', b: 1, id: 't1' }, { p: 'CDA', b: 2, id: 't2' }, { d: 'AC', b: 3 }]));

  Z(3, 'Konstruiše se trougao $ABC$ ako je $∠A = 30°$, $a = BC = 4 cm$ i visina $h_{c} = 3 cm$. Koliko rešenja ima zadatak?',
    ['dva', 'jedno', 'nijedno', 'beskonačno mnogo'],
    [K('Pravougli trougao $AC₁C$ ($∠A = 30°$, $CC₁ = 3$) je polovina jednakostraničnog, pa je $AC = 6 cm$.', ['acc']),
     K('Teme $B$ je na polupravoj $AC₁$, na rastojanju $4 cm$ od $C$: kružnica $k(C, 4 cm)$.', ['kr']),
     K('Pošto je $4 > 3 = h_{c}$, kružnica seče polupravu u dve tačke $B₁$ i $B₂$ – dva trougla.', ['b1', 'b2'])],
    G({ A: [0, 0], C: [5.196, 3], 'C₁': [5.196, 0, -90], 'B₁': [2.55, 0, -90], 'B₂': [7.84, 0, -90], e: [10, 0] },
      [{ d: 'Ae', b: 5 }, { p: 'AC₁C', b: 2, id: 'acc', k: 1 }, { pu: 'CC₁A' }, { d: 'CC₁', isp: 1, o: '3' }, { u: 'C₁AC', o: '30°', r: 34 }, { d: 'AC', b: 0 },
       { kr: 'C', r: 4, b: 4, isp: 1, id: 'kr', k: 2 }, { p: 'AB₁C', b: 1, prazno: 1, id: 'b1', k: 3 }, { p: 'AB₂C', b: 3, prazno: 1, id: 'b2', k: 3 }, { tacka: 'B₁B₂', b: 1, k: 3 }], { velicina: 280 }));
  proveri(Math.abs(Math.hypot(5.196 - 2.55, 3) - 4) < 0.01 && Math.abs(Math.hypot(7.84 - 5.196, 3) - 4) < 0.01, 'B₁, B₂ na kružnici');

  Z(3, 'Isti zadatak, ali sa $a = BC = 3 cm$ ($∠A = 30°$, $h_{c} = 3 cm$). Koliko sada ima rešenja?',
    ['jedno', 'dva', 'nijedno', 'tri'],
    [K('Kružnica $k(C, 3 cm)$ ima poluprečnik jednak rastojanju tačke $C$ od prave $AC₁$.', ['kr']),
     K('Zato je dodiruje u samo jednoj tački – u $C₁$: $B = C₁$ i trougao je pravougli.', ['b']),
     K('Za $a < 3 cm$ ne bi bilo rešenja, a za $3 < a < 6$ bila bi dva.')],
    G({ A: [0, 0], C: [5.196, 3], B: [5.196, 0, -90], e: [10, 0] },
      [{ d: 'Ae', b: 5 }, { p: 'ABC', b: 1, id: 'b', k: 2 }, { pu: 'CBA' }, { d: 'CB', isp: 1, o: '3' }, { u: 'BAC', o: '30°', r: 34 }, { kr: 'C', r: 3, b: 4, isp: 1, id: 'kr' }, { tacka: 'B', b: 1, k: 2 }], { velicina: 260 }));

  Z(3, 'Težišna duž $AA₁$ trougla $ABC$ produžena je preko $A₁$ do tačke $D$ tako da je $A₁D = AA₁$. Kakav je četvorougao $ABDC$?',
    ['paralelogram', 'trapez koji nije paralelogram', 'deltoid', 'uvek pravougaonik'],
    [K('Dijagonale četvorougla $ABDC$ su $AD$ i $BC$, a seku se u $A₁$.', ['ad', 'bc']),
     K('$A₁$ je središte duži $BC$ (težišna duž) i središte duži $AD$ (po konstrukciji) – dijagonale se polove.'),
     K('Četvorougao čije se dijagonale polove je paralelogram (podudarnost $AA₁C ≅ DA₁B$ po SUS daje $BD = AC$ i $BD ∥ AC$).', ['par'])],
    G({ A: [0, 0], B: [6, 0], C: [1.5, 4.5], 'A₁': [3.75, 2.25], D: [7.5, 4.5] },
      [{ p: 'ABC', b: 0 }, { d: 'AA₁', b: 3 }, { d: 'A₁D', b: 3, isp: 1 }, { d: 'AD', b: 3, id: 'ad', k: 1 }, { d: 'BC', b: 2, id: 'bc', k: 1 }, { p: 'ABDC', b: 1, prazno: 1, id: 'par', k: 3 }]));

  Z(2, 'Dva pravougla trougla imaju jednake hipotenuze i po jednu katetu. Po kom stavu su podudarni?',
    ['SSU', 'SUS', 'USU', 'UUU'],
    [K('Jednake su dve stranice (hipotenuza i kateta) i prav ugao – ali to nije ugao između njih, već naspram hipotenuze.'),
     K('Stav SSU: dve stranice i ugao naspram veće od njih. Hipotenuza je najveća stranica, pa važi.')]);
};
