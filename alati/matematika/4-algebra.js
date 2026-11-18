// Izrazi, jednačine i nejednačine, koordinatni sistem, funkcije i grafici, nizovi
module.exports = ({ T, Q, U, S, A, F, G, proveri, r, pr, polja, vaga, prava }) => {
  T('Izrazi, jednačine i funkcije');
  const O = { O: [0, 0] }, bez = { bezImena: ['O'] };
  // korak rešenja (kao K u zadacima)
  const K = (t, crtez, i) => ({ t, ...(i ? { i } : {}), ...(crtez ? { crtez } : {}) });
  // natpis koji se pojavi posle `kasni` sekundi (kratka nevidljiva crta sa oznakom)
  const natpis = (o, at, kasni, b) => ({ lin: [at, [at[0] + 0.01, at[1]]], crtaj: 1, kasni, trajanje: 0.2, debljina: 0.1, o, oAt: at, ...(b !== undefined ? { b } : {}) });
  // brojevna prava sa rešenjem nejednačine: kružić u a, zrak udesno (smer 1) ili ulevo (−1)
  const zrak = (a, smer, [od, doo], pun = false) => G({ K: [a, 0] }, [{ osa: [od, doo] },
    { lin: [[r(a + smer * 0.18), 0.25], [smer > 0 ? doo + 0.3 : od - 0.3, 0.25]], b: 1, debljina: 5, str: 1, crtaj: 1, kasni: 0.4 },
    { kr: 'K', r: 0.17, b: 1, ...(pun ? { pun: 1, gusto: 1 } : {}) }], { bezImena: ['K'], velicina: 320 });

  proveri(3 * 3 + 2 === 11, 'vaga 1');
  Q(1, 'Vaga je u ravnoteži. Koliko je teška jedna kutija $x$?', ['3', '4', '11', '2'],
    'Sa obe strane se skine teg 2 i vaga ostaje u ravnoteži: $3x = 9$, pa je $x = 3$. Rešavanje jednačine je baš to – sa obe strane se radi isto, dok x ne ostane sam.',
    'vaga', { mediji: vaga(['x', 'x', 'x', 2], [11]), resenje: [
      K('Sa obe strane skini teg 2: $3x = 9$', vaga(['x', 'x', 'x'], [9])),
      K('Tri kutije teže 9, pa jedna teži 9 : 3: $x = 3$', vaga(['x'], [3])),
    ] });

  proveri(2 * 4 + 5 === 4 + 9, 'vaga 2');
  Q(2, 'Vaga je u ravnoteži. Koliko je teška jedna kutija $x$?', ['4', '14', '7', '9'],
    'Sa svake strane skini po jednu kutiju: ostaje $x + 5 = 9$. Zatim skini 5 sa obe strane: $x = 4$. Proveri: 4 + 4 + 5 = 13 i 4 + 9 = 13.',
    'jednačina', { mediji: vaga(['x', 'x', 5], ['x', 9]), resenje: [
      K('Sa obe strane skini po jednu kutiju: $x + 5 = 9$', vaga(['x', 5], [9])),
      K('Sa obe strane skini 5: $x = 4$', vaga(['x'], [4])),
    ] });

  Q(1, 'Koje je rešenje jednačine $2x − 7 = 13$?', ['10', '3', '20', '6'],
    '$2x = 13 + 7 = 20$, pa je $x = 10$. Uvek proveri zamenom: 2 · 10 − 7 = 13. ✓ Reč „algebra“ dolazi od arapskog „al-džabr“ – „vraćanje na mesto“, iz knjige Al-Horezmija iz 9. veka.',
    'rešenje', { resenje: [
      K('Dodaj 7 na obe strane: $2x = 20$', vaga(['x', 'x'], [20])),
      K('Podeli obe strane sa 2: $x = 10$', vaga(['x'], [10])),
    ] });

  Q(2, 'Koja nejednačina je prikazana na brojevnoj pravoj (prazan kružić znači da 2 nije uključen)?', ['$x > 2$', '$x ≥ 2$', '$x < 2$', '$x ≤ 2$'],
    'Obojeni deo ide udesno od 2 – to su brojevi veći od 2. Prazan kružić znači da sam broj 2 NIJE rešenje (znak >), a pun kružić bi značio ≥.',
    'nejednačina', { mediji: G({ K: [2, 0] }, [{ osa: [-2, 6] }, { lin: [[2.18, 0.25], [6.3, 0.25]], b: 1, debljina: 5, str: 1 }, { kr: 'K', r: 0.17, b: 1 }], { bezImena: ['K'], velicina: 320 }) });

  Q(3, 'Koje je rešenje nejednačine $−2x < 6$?', ['$x > −3$', '$x < −3$', '$x > 3$', '$x < 3$'],
    'Kad se nejednačina deli NEGATIVNIM brojem, znak se okreće: $x > −3$. Provera sa $x = 0$: −2 · 0 = 0 < 6 ✓, a 0 je zaista veće od −3.',
    'nejednačina', { medijiOdgovora: zrak(-3, 1, [-6, 3]) });

  Q(2, 'Kolika je vrednost izraza $3a − 2b$ za $a = 4$ i $b = −1$?', ['14', '10', '12', '8'],
    '$3 · 4 − 2 · (−1) = 12 + 2 = 14$. Kod zamene negativnog broja uvek ga stavi u zagradu – tako se ne gubi minus.',
    'izraz');

  Q(1, 'Koliko je $3x + 5x − x$?', ['$7x$', '$8x$', '$9x$', '7'],
    'Slični monomi se sabiraju kao jabuke: 3 + 5 − 1 = 7 „iksova“. Samo $x$ znači $1 · x$ – lako je zaboraviti tu jedinicu.',
    'monom');

  {
    const e = [pr(0, 0, 3, 2, { b: 0 }), pr(3, 0, 2, 2, { b: 2 }), { tx: 'b', at: [1.5, 2.45] }, { tx: 'c', at: [4, 2.45] }, { tx: 'a', at: [-0.4, 1] }];
    Q(1, 'Kolika je površina celog pravougaonika na slici?', ['$ab + ac$', '$ab + c$', '$a + bc$', '$abc$'],
      'Ceo pravougaonik ima stranice $a$ i $b + c$, pa je površina $a(b + c)$. Zbir dva dela je $ab + ac$. To je zakon distribucije – zato je 7 · 13 = 7 · 10 + 7 · 3 = 91.',
      'površina', { mediji: G(O, e, { ...bez, velicina: 240 }),
        medijiOdgovora: G(O, [...e, natpis('ab', [1.5, 1], 0.4, 0), natpis('ac', [4, 1], 1, 2), natpis('a(b + c) = ab + ac', [2.5, -0.6], 1.6, 3)], { ...bez, velicina: 240 }) });
  }

  Q(1, 'Koje su koordinate tačke $A$?', ['(3, −2)', '(−2, 3)', '(−3, 2)', '(3, 2)'],
    'Prvo se čita $x$ (levo–desno), pa $y$ (gore–dole): $A$ je 3 desno i 2 dole. Koordinatni sistem je izmislio Dekart – priča se da je posmatrao muvu na plafonu i pitao se kako da opiše gde je.',
    'koordinata', { mediji: G({ A: [3, -2, 0] }, [{ mreza: [-4, 4, -4, 4], ose: ['x', 'y'] }, { tacka: 'A', b: 1 }], { velicina: 260 }) });

  Q(1, 'U kom kvadrantu je tačka (−4, 5)?', ['U drugom', 'U prvom', 'U trećem', 'U četvrtom'],
    'Kvadranti se broje od gornjeg desnog, suprotno kretanju kazaljki: I (+, +), II (−, +), III (−, −), IV (+, −). Tačka sa negativnim x i pozitivnim y je gore levo – u II.',
    'kvadrant', { medijiOdgovora: G({ T: [-4, 5, 0] }, [{ mreza: [-6, 6, -6, 6], podela: 2, ose: ['x', 'y'] }, { tx: 'I', at: [3.5, 3.5], b: 3 }, { tx: 'II', at: [-3.5, 3.5], b: 3 }, { tx: 'III', at: [-3.5, -3.5], b: 3 }, { tx: 'IV', at: [3.5, -3.5], b: 3 }, { tacka: 'T', b: 1 }], { velicina: 240 }) });

  Q(2, 'Koja je jednačina prave na slici?', ['$y = 2x + 1$', '$y = x + 1$', '$y = 2x − 1$', '$y = −2x + 1$'],
    'Prava seče y-osu u 1 (to je slobodan član), a kad x poraste za 1, y poraste za 2 (to je koeficijent pravca). Iz (0, 1) u (2, 5): pomeraj 2 udesno i 4 nagore.',
    'prava', { mediji: G({ M: [0, 1, 180], N: [2, 5, 0] }, [{ mreza: [-3, 4, -3, 6], ose: ['x', 'y'] }, prava(2, 1, -2, 2.5), { tacka: 'MN', b: 3 }], { bezImena: ['M', 'N'], velicina: 260 }),
      medijiOdgovora: G({ M: [0, 1, 180], N: [2, 5, 0] }, [{ mreza: [-3, 4, -3, 6], ose: ['x', 'y'] }, prava(2, 1, -2, 2.5), { tacka: 'MN', b: 3 },
        { lin: [[0, 1], [1, 1]], b: 2, debljina: 4, crtaj: 1, kasni: 0.4, trajanje: 0.6, o: '+1', oAt: [0.5, 0.55] },
        { lin: [[1, 1], [1, 3]], b: 0, debljina: 4, crtaj: 1, kasni: 1.1, trajanje: 0.8, o: '+2', oAt: [1.4, 2] },
        { lin: [[1, 3], [2, 3]], b: 2, debljina: 4, crtaj: 1, kasni: 2, trajanje: 0.6, o: '+1', oAt: [1.5, 2.6] },
        { lin: [[2, 3], [2, 5]], b: 0, debljina: 4, crtaj: 1, kasni: 2.7, trajanje: 0.8, o: '+2', oAt: [2.4, 4] }], { bezImena: ['M', 'N'], velicina: 260 }) });

  Q(2, 'U kojoj tački prava $y = −x + 3$ seče $y$-osu?', ['(0, 3)', '(3, 0)', '(0, −3)', '(−1, 3)'],
    'Na $y$-osi je $x = 0$, pa je $y = −0 + 3 = 3$. Slobodan član u $y = kx + n$ uvek pokazuje gde prava seče y-osu.',
    'prava', { medijiOdgovora: G({ N: [0, 3, 0] }, [{ mreza: [-2, 5, -2, 5], ose: ['x', 'y'] }, prava(-1, 3, -1.5, 4.5), { tacka: 'N', b: 3 }], { bezImena: ['N'], velicina: 230 }) });

  Q(2, 'Grafik pokazuje cenu jabuka u zavisnosti od količine. Kakva je to zavisnost?', ['Direktna proporcionalnost', 'Obrnuta proporcionalnost', 'Cena ne zavisi od količine', 'Kvadratna zavisnost'],
    'Grafik je prava kroz koordinatni početak: 2 puta više jabuka – 2 puta veća cena. Količnik cene i količine je stalan – to je cena jednog kilograma.',
    'srazmera', { mediji: G(O, [{ mreza: [0, 5, 0, 5], ose: ['kg', '~din'], brojevi: 0 }, { lin: [[0, 0], [5, 5]], b: 1 }], { ...bez, velicina: 220 }) });

  {
    const tacke = [1, 1.5, 2, 3, 4, 5, 6].map((x) => [x, r(6 / x)]);
    Q(2, 'Grafik pokazuje za koliko dana radnici završe isti posao. Kakva je veza između broja radnika i broja dana?', ['Obrnuta proporcionalnost', 'Direktna proporcionalnost', 'Nema nikakve veze', 'Linearna funkcija'],
      'Dva puta više radnika – dva puta manje dana; proizvod (radnici · dani) je uvek isti, ovde 6. Grafik takve veze je kriva koja se zove hiperbola i nikad ne dodiruje ose.',
      'radnik', { mediji: G(O, [{ mreza: [0, 6, 0, 6], ose: ['~radnici', '~dani'] }, { lin: tacke, b: 1 }], { ...bez, velicina: 230 }) });
  }

  // grafik puta
  {
    const ose = [];
    for (let i = 1; i <= 6; i++) ose.push({ tx: String(i / 2).replace('.', ','), at: [i, -0.5] });
    for (let j = 1; j <= 4; j++) ose.push({ tx: String(j * 30), at: [-0.7, j] });
    Q(1, 'Grafik pokazuje put automobila. Koliko je trajala pauza?', ['30 minuta', '1 sat', '15 minuta', '2 sata'],
      'Za vreme pauze put se ne menja, pa je grafik vodoravan – od 1 h do 1,5 h, tj. pola sata. Što je deo grafika strmiji, to se auto brže kretao.',
      'pauza', { mediji: G(O, [{ mreza: [0, 6, 0, 4.5], ose: ['t (h)', 's (km)'], brojevi: 0 }, ...ose, { lin: [[0, 0], [2, 2], [3, 2], [5, 4]], b: 1 }], { ...bez, velicina: 300 }),
        medijiOdgovora: G(O, [{ mreza: [0, 6, 0, 4.5], ose: ['t (h)', 's (km)'], brojevi: 0 }, ...ose, { lin: [[0, 0], [2, 2], [3, 2], [5, 4]], b: 1 },
          { lin: [[2, 2], [3, 2]], b: 3, debljina: 6, crtaj: 1, kasni: 0.4, o: '~pauza', oAt: [2.5, 2.5] },
          { lin: [[2, 2], [2, 0]], b: 3, isp: 1 }, { lin: [[3, 2], [3, 0]], b: 3, isp: 1 },
          { lin: [[2, 0.35], [3, 0.35]], b: 3, str: 1, crtaj: 1, kasni: 1.4, trajanje: 0.6, o: '30 min', oAt: [3.9, 0.35] }], { ...bez, velicina: 300 }) });
  }
  {
    const ose = [];
    for (let i = 1; i <= 4; i++) ose.push({ tx: String(i), at: [i, -0.5] });
    for (let j = 1; j <= 6; j++) ose.push({ tx: String(j * 10), at: [-0.7, j] });
    Q(1, 'Grafik pokazuje put biciklista. Kolikom brzinom se kretao?', ['15 km/h', '60 km/h', '10 km/h', '4 km/h'],
      'Za 4 sata je prešao 60 km, pa je brzina 60 : 4 = 15 km/h. Na grafiku se to vidi i iz bilo kog drugog para: za 2 sata 30 km.',
      'brzina', { mediji: G(O, [{ mreza: [0, 4, 0, 6], ose: ['t (h)', 's (km)'], brojevi: 0 }, ...ose, { lin: [[0, 0], [4, 6]], b: 1 }], { ...bez, velicina: 240 }),
        medijiOdgovora: G(O, [{ mreza: [0, 4, 0, 6], ose: ['t (h)', 's (km)'], brojevi: 0 }, ...ose, { lin: [[0, 0], [4, 6]], b: 1 },
          ...[1, 2, 3, 4].map((t) => ({ lin: [[t - 1, r(1.5 * (t - 1))], [t, r(1.5 * (t - 1))], [t, r(1.5 * t)]], b: 3, debljina: 3, crtaj: 1, kasni: 0.3 + (t - 1) * 0.7, trajanje: 0.6 })),
          natpis('1 h', [0.5, -0.2], 0.6, 3), natpis('15 km', [1.65, 0.75], 0.9, 3), natpis('15 km/h', [1.1, 4.6], 3.2, 3)], { ...bez, velicina: 240 }) });
  }

  // šibice
  {
    const e = [];
    for (let i = 0; i <= 3; i++) e.push({ lin: [[i * 2, 0.15], [i * 2, 1.85]], b: 3, debljina: 5 });
    for (let i = 0; i < 3; i++) for (const y of [0, 2]) e.push({ lin: [[i * 2 + 0.15, y], [i * 2 + 1.85, y]], b: 3, debljina: 5 });
    proveri(3 * 10 + 1 === 31, 'šibice');
    Q(2, 'Za 3 kvadratića u nizu potrebno je 10 šibica. Koliko šibica treba za 10 kvadratića u nizu?', ['31', '40', '30', '34'],
      'Prvi kvadratić traži 4 šibice, a svaki sledeći samo 3 (jednu stranicu deli sa prethodnim). Za $n$ kvadratića: $3n + 1$ šibica, pa za 10 → 31. Uočiti pravilo u nizu je prvi korak ka algebri.',
      'šibica', { mediji: G(O, e, { ...bez, velicina: 240 }), medijiOdgovora: (() => {
        // prvi kvadratić 4 šibice (plavo), svaki sledeći još 3 (roze, zeleno …) – šibice se iscrtavaju redom
        const sib = [], boje = [0, 1, 2, 4];
        const s1 = (a, b, i, k) => sib.push({ lin: [a, b], b: boje[i], debljina: 5, crtaj: 1, kasni: 0.3 + k * 0.25, trajanje: 0.25 });
        let k = 0;
        s1([0, 0.15], [0, 1.85], 0, k++);
        for (let i = 0; i < 4; i++) { s1([i * 2 + 0.15, 2], [i * 2 + 1.85, 2], i, k++); s1([i * 2 + 2, 1.85], [i * 2 + 2, 0.15], i, k++); s1([i * 2 + 1.85, 0], [i * 2 + 0.15, 0], i, k++); }
        return G(O, [...sib, natpis('1 + 3', [1, 1], 1.2, 0), natpis('+ 3', [3, 1], 2, 1), natpis('+ 3', [5, 1], 2.7, 2), natpis('+ 3', [7, 1], 3.5, 4),
          natpis('10 → 1 + 3 · 10 = 31', [4, -1], 4, 3)], { ...bez, velicina: 260 });
      })() });
  }

  // stepenice
  {
    const e = [];
    let x0 = 0;
    for (let n = 1; n <= 4; n++) {
      e.push(...polja(n, n, (i, j) => (i + j < n ? n - 1 : undefined), { x0, a: 1, prazno: null }).filter((p) => p.b !== null && !p.prazno));
      e.push({ tx: String(n) + '.', at: [x0 + n / 2, -0.7] });
      x0 += n + 1;
    }
    proveri((10 * 11) / 2 === 55, 'stepenice');
    Q(3, 'Figure od kvadratića rastu kao stepenice (1, 3, 6, 10…). Koliko kvadratića ima 10. figura?', ['55', '50', '45', '100'],
      'Dve iste stepenice sklopljene zajedno daju pravougaonik 10 × 11, pa je jedna stepenica pola od toga: 110 : 2 = 55. Tako je, po legendi, mali Gaus u trenu sabrao brojeve od 1 do 100.',
      'stepenica', { mediji: G(O, e, { ...bez, velicina: 300 }), medijiOdgovora: A('stepenice', '1 + 2 + … + n = n(n + 1) : 2') });
  }

  Q(1, 'Zbir tri uzastopna prirodna broja je 48. Koji je najveći od njih?', ['17', '16', '18', '15'],
    'Srednji broj je prosek: 48 : 3 = 16, pa su brojevi 15, 16 i 17. Algebarski: $n + (n + 1) + (n + 2) = 3n + 3 = 48$, pa je $n = 15$.',
    'uzastopni', { medijiOdgovora: (() => {
      // stubići 15, 16, 17 (jedan kvadratić = 1): višak sa najvišeg prelazi na najniži, pa su sva tri po 16
      const v = 0.25, e = [];
      [15, 16, 17].forEach((n, i) => e.push(pr(i * 2, 0, 1.4, r(Math.min(n, 15) * v), { b: 0 }), { tx: String(n), at: [i * 2 + 0.7, -0.4] }));
      e.push(pr(2, r(15 * v), 1.4, v, { b: 0 }), pr(4, r(15 * v), 1.4, v, { b: 0 }));
      e.push({ ...pr(4, r(16 * v), 1.4, v, { b: 1, gusto: 1 }), pomeri: [-4, -v], kasni: 0.8, trajanje: 1.6 });
      e.push(natpis('16 + 16 + 16 = 48', [2.7, 5.2], 2.6, 3), { lin: [[-0.3, r(16 * v)], [5.7, r(16 * v)]], b: 3, isp: 1 });
      return G(O, e, { ...bez, velicina: 220 });
    })() });

  S(1, 'Spoji opis sa izrazom', [['dvostruki broj x', '$2x$'], ['kvadrat broja x', '$x^{2}$'], ['broj za 2 veći od x', '$x + 2$'], ['polovina broja x', '${x|2}$']],
    'Algebra je jezik: rečenice postaju kratki izrazi. Pazi na razliku: $2x$ je $x + x$, a $x^{2}$ je $x · x$. Za $x = 3$ to je 6, odnosno 9.',
    'izraz');

  U(2, 'Koji izraz NIJE jednak ostalima?', ['$2x + 3$', '$2(x + 3)$', '$2x + 6$', '$x + x + 6$'],
    'Kad se oslobodi zagrade, broj ispred množi OBA sabirka: $2(x + 3) = 2x + 6$. Izraz $2x + 3$ je „zaboravio“ da pomnoži trojku.',
    'Ovo je jedna od najčešćih grešaka u algebri. Proveri bilo kojim brojem: za $x = 1$ tri izraza daju 8, a $2x + 3$ daje 5.',
    'zagrada');

  Q(1, 'Data je funkcija $y = 3x − 1$. Koliko je $y$ za $x = −2$?', ['−7', '−5', '5', '7'],
    '$y = 3 · (−2) − 1 = −6 − 1 = −7$. Funkcija je kao mašina: ubaciš x, ona po pravilu izbaci tačno jedan y.',
    'funkcija');

  Q(2, 'Ako je $x + y = 10$ i $x − y = 4$, koliko je $x$?', ['7', '3', '6', '14'],
    'Saberi jednačine: $2x = 14$, pa je $x = 7$, a $y = 3$. Isto napamet: dva broja čiji je zbir 10, a razlika 4 – veći je pola od 10 + 4.',
    'sistem', { medijiOdgovora: G({ S: [7, 3, 60] }, [{ mreza: [0, 10, -1, 10], ose: ['x', 'y'], podela: 1 },
      prava(-1, 10, 0, 10, { b: 0, crtaj: 1, kasni: 0.3, o: 'x + y = 10', oAt: [2.6, 8.6] }), prava(1, -4, 3, 10, { b: 1, crtaj: 1, kasni: 1.2, o: 'x − y = 4', oAt: [8.9, 3.6] }),
      { tacka: 'S', b: 3, k: 0 }, natpis('(7, 3)', [5.2, 3], 2.4, 3)], { bezImena: ['S'], velicina: 260 }) });

  Q(3, 'U kojoj tački prava $y = 2x − 6$ seče $x$-osu?', ['(3, 0)', '(−6, 0)', '(0, −6)', '(−3, 0)'],
    'Na x-osi je $y = 0$: $2x − 6 = 0$, pa je $x = 3$. Ta vrednost $x$ zove se nula funkcije. Tačka (0, −6) je presek sa y-osom – lako se pomešaju.',
    'nula', { medijiOdgovora: G({ N: [3, 0, -45], M: [0, -6, 180] }, [{ mreza: [-2, 5, -7, 3], ose: ['x', 'y'], podela: 1 }, prava(2, -6, -0.5, 4.5), { tacka: 'N', b: 3 }, { tacka: 'M', b: 1 }], { velicina: 230 }) });

  Q(3, 'Koliko je $(x + 1)^{2} − (x − 1)^{2}$?', ['$4x$', '2', '0', '$2x$'],
    '$(x^{2} + 2x + 1) − (x^{2} − 2x + 1) = 4x$. Provera za $x = 5$: $36 − 16 = 20 = 4 · 5$ ✓. Ovaj identitet je osnova starog trika za množenje pomoću tablice kvadrata.',
    'identitet', { medijiOdgovora: (() => {
      // x = 4: kvadrat 5 × 5 bez unutrašnjeg 3 × 3 je „vetrenjača“ od četiri trake 1 × x
      const x = 4, tr = [[0, 0, x, 1], [x, 0, 1, x], [1, x, x, 1], [0, 1, 1, x]];
      proveri((x + 1) ** 2 - (x - 1) ** 2 === 4 * x, 'vetrenjača');
      return G(O, [pr(1, 1, x - 1, x - 1, { b: 5, prazno: 1, isp: 1 }), { tx: '(x − 1)²', at: [2.5, 2.5], b: 5 },
        ...tr.map(([a, b, w, h], i) => ({ ...pr(a, b, w, h, { b: i, gusto: 1 }), crtaj: 1, kasni: 0.3 + i * 0.6, trajanje: 0.6 })),
        natpis('x', [2, 0.5], 0.9), natpis('x', [4.5, 2], 1.5), natpis('x', [3, 4.5], 2.1), natpis('x', [0.5, 3], 2.7),
        { tx: 'x + 1', at: [2.5, -0.5] }, natpis('4 · x = 4x', [2.5, 5.6], 3.2, 3)], { ...bez, velicina: 220 });
    })() });

  Q(1, 'Koji broj treba upisati umesto ▢ da jednakost važi: ▢ · 6 = 42 + 6?', ['8', '7', '9', '48'],
    '42 + 6 = 48, a 48 : 6 = 8. Znak jednakosti ne znači „sad napiši rezultat“, već „levo i desno je ista vrednost“ – kao vaga u ravnoteži.',
    'jednakost');

  Q(2, 'Mama je 4 puta starija od sina. Zajedno imaju 45 godina. Koliko godina ima sin?', ['9', '11', '15', '36'],
    'Ako je sin $x$, mama je $4x$, a zajedno $5x = 45$, pa je $x = 9$ (mama 36). Crtež pomaže: jedna traka za sina, četiri iste za mamu – ukupno 5 jednakih traka.',
    'godina', { medijiOdgovora: G(O, [pr(0, 1.4, 1.8, 1, { b: 0, gusto: 1 }), ...[0, 1, 2, 3].map((i) => pr(i * 1.8, 0, 1.8, 1, { b: 1, gusto: 1 })), { tx: '9', at: [0.9, 1.9] }, ...[0, 1, 2, 3].map((i) => ({ tx: '9', at: [i * 1.8 + 0.9, 0.5] }))], { ...bez, velicina: 240 }) });
};
