// Geometrijska tela: mreže, površina i zapremina, obrtna tela
module.exports = ({ T, Q, U, S, A, F, G, proveri, r, kocke, pr }) => {
  T('Geometrijska tela');
  const O = { O: [0, 0] }, bez = { bezImena: ['O'] };
  const telo = (oblik, x = {}) => ({ vrsta: 'telo', oblik, ...x });

  // „kotrljanje“ kocke po mreži: koje strane kocke pada na koje polje (provera da je mreža ispravna i koje su strane naspramne)
  function savij(polja) {
    const kljuc = (p) => p.join(',');
    const ima = new Set(polja.map(kljuc));
    const strana = { [kljuc(polja[0])]: 'D' }; // D dole, G gore, S sever, J jug, I istok, Z zapad
    const stanje = { [kljuc(polja[0])]: { D: 'D', G: 'G', S: 'S', J: 'J', I: 'I', Z: 'Z' } };
    const red = [polja[0]];
    const kotrljaj = (o, dx, dy) => (dx === 1 ? { ...o, D: o.I, Z: o.D, G: o.Z, I: o.G }
      : dx === -1 ? { ...o, D: o.Z, I: o.D, G: o.I, Z: o.G }
        : dy === 1 ? { ...o, D: o.S, J: o.D, G: o.J, S: o.G }
          : { ...o, D: o.J, S: o.D, G: o.S, J: o.G });
    while (red.length) {
      const p = red.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const q = [p[0] + dx, p[1] + dy];
        if (!ima.has(kljuc(q)) || stanje[kljuc(q)]) continue;
        stanje[kljuc(q)] = kotrljaj(stanje[kljuc(p)], dx, dy);
        strana[kljuc(q)] = stanje[kljuc(q)].D;
        red.push(q);
      }
    }
    return polja.map((p) => strana[kljuc(p)]);
  }
  const NASPRAM = { D: 'G', G: 'D', S: 'J', J: 'S', I: 'Z', Z: 'I' };
  const mreza = (polja, brojevi, b = 0) => G(O, polja.flatMap(([x, y], i) => [pr(x, y, 1, 1, { b: Array.isArray(b) ? b[i] : b }), ...(brojevi ? [{ tx: String(brojevi[i]), at: [x + 0.5, y + 0.5] }] : [])]), { ...bez, velicina: 200 });

  const krst = [[1, 3], [1, 2], [1, 1], [1, 0], [0, 2], [2, 2]];
  proveri(new Set(savij(krst)).size === 6, 'krst je mreža kocke');
  Q(1, 'Koje telo se dobija kad se ova mreža savije po ivicama kvadrata?', ['Kocka', 'Kvadar', 'Četvorostrana piramida', 'Trostrana prizma'],
    'Šest jednakih kvadrata, savijenih kako treba, daju kocku. Postoji tačno 11 različitih mreža kocke – ovaj „krst“ je najpoznatija.',
    'mreža', { mediji: mreza(krst, null, 2), medijiOdgovora: A('mreza-kocke') });

  {
    const pogresna = [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1]];
    proveri(new Set(savij(pogresna)).size < 6, 'pogrešna mreža');
    Q(3, 'Može li se od ove mreže sklopiti kocka?', ['Ne – dva kvadrata padaju na isto mesto', 'Da, bez ikakvog problema', 'Ne – nedostaju dva kvadrata', 'Da, ali bez jedne strane'],
      'Četiri kvadrata u nizu obaviju kocku sa strane, a oba gornja kvadrata se savijaju na istu, gornju stranu – preklope se, a dno ostaje otvoreno. Kod ispravne mreže „poklopci“ moraju biti sa suprotnih strana niza.',
      'mreža', { mediji: mreza(pogresna, null, [2, 2, 2, 2, 1, 1]) });
  }

  {
    const stepenice = [[0, 2], [1, 2], [1, 1], [2, 1], [2, 0], [3, 0]];
    const s = savij(stepenice);
    proveri(new Set(s).size === 6, 'stepenice su mreža');
    const naspram1 = s.indexOf(NASPRAM[s[0]]);
    const brojevi = [1, 2, 3, 4, 5, 6];
    proveri(brojevi[naspram1] === 4, 'naspram 1 je 4');
    Q(2, 'Ova mreža se savije u kocku. Koji broj će biti na strani NASPRAM broja 1?', ['4', '3', '5', '6'],
      'Kod mreže „stepenice“ strane 1 i 2 su gore, 3 i 4 u sredini, 5 i 6 dole. Strana 1 se savija tako da gleda u stranu 4. Na pravoj kockici za igru zbir naspramnih strana je uvek 7.',
      'kockica', { mediji: mreza(stepenice, brojevi, 3) });
  }

  {
    const R = 1.2, H = 3, L = r(2 * Math.PI * R);
    Q(1, 'Kakav lik je omotač valjka kada se „odmota“?', ['Pravougaonik', 'Krug', 'Trougao', 'Kružni isečak'],
      'Omotač valjka je pravougaonik: jedna stranica je visina valjka, a druga je dugačka koliko obim osnove ($2rπ$). Etiketa sa konzerve je baš takav pravougaonik.',
      'valjak', { mediji: telo('valjak'), medijiOdgovora: G({ P: [0.6, H + R], Q: [0.6, -R] }, [pr(0, 0, L, H, { b: 0 }), { tx: '2rπ', at: [r(L / 2), -0.45] }, { tx: 'H', at: [r(L + 0.4), r(H / 2)] }, { kr: 'P', r: R, b: 2 }, { kr: 'Q', r: R, b: 2 }], { bezImena: ['P', 'Q'], velicina: 220 }) });
  }

  Q(2, 'Kakav lik je omotač kupe kada se „odmota“?', ['Kružni isečak', 'Trougao', 'Pravougaonik', 'Trapez'],
    'Sve tačke kružnice osnove jednako su udaljene od vrha kupe, pa se omotač razvija u deo kruga – kružni isečak. Kornet za sladoled se pravi baš od takvog isečka.',
    'kupa', { mediji: telo('kupa'), medijiOdgovora: G({ V: [0, 0], C: [0, -6.1] }, [{ is: 'V', r: 5, od: 210, do: 330, b: 1, gusto: 1 }, { kr: 'C', r: 1.3, b: 2 }], { bezImena: ['V', 'C'], velicina: 200 }) });

  Q(1, 'Koliko malih kockica čini ovaj kvadar?', ['24', '9', '20', '26'],
    'Kvadar ima 4 · 3 = 12 kockica u jednom sloju, a slojeva su 2: 12 · 2 = 24. Zapremina kvadra je proizvod sve tri ivice: $a · b · c$.',
    'zapremina', { mediji: kocke(4, 3, 2) });

  Q(2, 'Kolika je površina kocke ivice 3 cm?', ['54 cm²', '27 cm²', '36 cm²', '18 cm²'],
    'Kocka ima 6 jednakih kvadrata, svaki 3 · 3 = 9 cm²: 6 · 9 = 54 cm². Česta zamena: 27 je ZAPREMINA (u cm³), a ne površina.',
    'površina', { medijiOdgovora: mreza(krst, ['9', '9', '9', '9', '9', '9'], 0) });

  Q(2, 'Koliko kockica šećera ivice 1 cm staje u kutiju oblika kocke ivice 2 cm?', ['8', '2', '4', '6'],
    'Nova kocka ima 2 · 2 · 2 = 8 starih kocaka. Zato su velike životinje „teške“: slon duplo viši od nekog drugog bio bi oko 8 puta teži.',
    'zapremina', { medijiOdgovora: kocke(2, 2, 2, { boja: 2 }) });

  proveri(Math.abs(Math.PI * 1 * 1 * 1 - 3.14) < 0.01, 'valjak 1 dm');
  Q(3, 'Valjak ima poluprečnik osnove 1 dm i visinu 1 dm. Koliko otprilike litara vode staje u njega?', ['Oko 3,14 l', 'Tačno 1 l', 'Oko 6,28 l', 'Tačno 2 l'],
    '$V = r^{2}πH = 1 · 1 · 3,14 · 1$ ≈ 3,14 dm³, a 1 dm³ = 1 litar. Taj valjak je veći od kocke 1 dm × 1 dm × 1 dm jer mu je prečnik 2 dm.',
    'valjak', { mediji: telo('valjak', { boja: '#74b9ff' }) });

  Q(2, 'Kupa i valjak imaju istu osnovu i istu visinu. Koliko puni kupa vode staje u valjak?', ['3', '2', '4', 'π'],
    'Zapremina kupe je trećina zapremine valjka: $V = {1|3}r^{2}πH$. Isto važi i za piramidu i prizmu iste osnove i visine – to je znao još Demokrit, a dokazao Eudoks.',
    'kupa', { medijiOdgovora: A('kupa-valjak') });

  proveri(6 * 3 === 18, 'šestostrana prizma');
  Q(2, 'Koliko ivica ima ova šestostrana prizma?', ['18', '12', '24', '16'],
    'Dve osnove imaju po 6 ivica, a još 6 bočnih ivica ih spaja: 6 + 6 + 6 = 18. Ojlerova formula: 12 temena − 18 ivica + 8 strana = 2.',
    'prizma', { mediji: telo('prizma6', { boja: '#55efc4' }) });

  Q(2, 'Koliko strana ima piramida čija je osnova osmougao?', ['9', '8', '10', '16'],
    'Osam bočnih trouglova (po jedan nad svakom ivicom osnove) i još sama osnova: 8 + 1 = 9. Piramida sa $n$-touglom u osnovi ima $n + 1$ strana i $n + 1$ temena.',
    'piramida', { mediji: telo('piramida8', { boja: '#fdcb6e' }) });

  Q(3, 'Koje telo ima NAJMANJU površinu od svih tela iste zapremine?', ['Lopta', 'Kocka', 'Valjak', 'Tetraedar'],
    'Lopta „pakuje“ zapreminu najštedljivije. Zato su kapi vode i mehurići od sapunice okrugli (površinski napon smanjuje površinu), a mačke se zimi sklupčaju u klupko da manje gube toplotu.',
    'lopta', { medijiOdgovora: telo('lopta') });

  {
    // kosa projekcija: y je dubina; jedino skriveno teme je (0, 1, 0)
    const P = (x, y, z) => [r(x + 0.55 * y), r(z + 0.4 * y)];
    const ivice = [[[0, 0, 0], [1, 0, 0]], [[0, 0, 0], [0, 1, 0]], [[0, 0, 0], [0, 0, 1]], [[1, 0, 0], [1, 1, 0]], [[1, 0, 0], [1, 0, 1]], [[0, 1, 0], [1, 1, 0]], [[0, 1, 0], [0, 1, 1]], [[0, 0, 1], [1, 0, 1]], [[0, 0, 1], [0, 1, 1]], [[1, 1, 0], [1, 1, 1]], [[1, 0, 1], [1, 1, 1]], [[0, 1, 1], [1, 1, 1]]];
    const skriveno = (a, b) => [a, b].some((p) => p[0] === 0 && p[1] === 1 && p[2] === 0);
    const kocka = ivice.map(([a, b]) => ({ lin: [P(...a), P(...b)].map((p) => p.map((x) => x * 3)), b: 5, debljina: 2, ...(skriveno(a, b) ? { isp: 1 } : {}) }));
    const s = (p) => P(...p).map((x) => x * 3);
    Q(3, 'Kocka se preseče ravnim rezom kroz tri temena susedna jednom temenu. Kakav lik je presek?', ['Jednakostranični trougao', 'Pravougli trougao', 'Kvadrat', 'Pravougaonik'],
      'Sve tri stranice preseka su dijagonale jednakih kvadrata (strana kocke), pa su jednake – trougao je jednakostraničan. Ravan kroz sredine šest ivica dala bi čak pravilan šestougao!',
      'presek', {
        medijiOdgovora: G(O, [...kocka, { lin: [s([0, 0, 1]), s([1, 1, 1]), s([1, 0, 0])], zatv: 1, b: 1, gusto: 1 }], { ...bez, velicina: 200 }),
      });

    proveri(Math.abs(Math.hypot(1, 1, 1) - Math.sqrt(3)) < 1e-9, 'prostorna dijagonala');
    Q(3, 'Kolika je prostorna dijagonala kocke ivice 1 (od temena do najdaljeg temena)?', ['$√{3}$', '$√{2}$', '2', '3'],
      'Dijagonala strane je $√{2}$, a ona i uspravna ivica čine pravougli trougao: $D^{2} = (√{2})^{2} + 1^{2} = 3$. Uopšte, kod kvadra $D = √{a^{2} + b^{2} + c^{2}}$ – Pitagora u tri dimenzije.',
      'dijagonala', {
        mediji: G(O, [...kocka, { lin: [s([1, 0, 0]), s([0, 1, 1])], b: 1, debljina: 3, o: '?' }], { ...bez, velicina: 200 }),
        medijiOdgovora: G(O, [...kocka, { lin: [s([1, 0, 0]), s([0, 0, 1])], b: 3, debljina: 3, isp: 1, o: '√2', oAt: [1.1, 1.9] }, { lin: [s([1, 0, 0]), s([0, 1, 1])], b: 1, debljina: 3 }, { lin: [s([0, 0, 1]), s([0, 1, 1])], b: 3, debljina: 3, o: '1' }], { ...bez, velicina: 200 }),
      });
  }

  S(2, 'Spoji lik koji se okreće sa telom koje nastaje', [['Pravougaonik oko stranice', 'Valjak'], ['Pravougli trougao oko katete', 'Kupa'], ['Polukrug oko prečnika', 'Lopta'], ['Pravougli trapez oko kraka uz prave uglove', 'Zarubljena kupa']],
    'Tela koja nastaju okretanjem zovu se obrtna tela – lončar na grnčarskom kolu pravi baš takva tela. Kupa nastaje i okretanjem jednakokrakog trougla oko visine.',
    'obrtno');

  Q(2, 'Koliko temena ima ovo telo?', ['7', '6', '12', '8'],
    'Ovo je šestostrana piramida: 6 temena osnove i još vrh – ukupno 7. Ima 12 ivica i 7 strana: 7 − 12 + 7 = 2 (Ojler).',
    'teme', { mediji: telo('piramida6', { boja: '#fd79a8' }) });

  Q(2, 'Koliko kockica ivice 1 cm može da stane u kocku ivice 1 dm?', ['1.000', '100', '10', '10.000'],
    '1 dm = 10 cm, pa staje 10 · 10 · 10 = 1.000 kockica. Zato je 1 dm³ = 1.000 cm³ = 1 litar, a 1 cm³ = 1 mililitar.',
    'kubni', { medijiOdgovora: kocke(10, 10, 10, { boja: 0 }) });

  proveri(50 * 30 * 40 === 60000, 'akvarijum');
  Q(2, 'Akvarijum ima oblik kvadra 50 cm × 30 cm × 40 cm. Koliko litara vode staje u njega?', ['60 l', '120 l', '600 l', '6 l'],
    '50 · 30 · 40 = 60.000 cm³, a 1 litar = 1.000 cm³, pa je to 60 l. Najlakše je odmah preći na decimetre: 5 · 3 · 4 = 60 dm³.',
    'akvarijum');

  U(1, 'Koje telo NIJE poliedar?', ['Valjak', 'Kocka', 'Piramida', 'Prizma'],
    'Poliedar je telo čije su sve strane mnogouglovi. Valjak ima zakrivljen omotač i krugove za osnove, pa je obrtno telo.',
    'Reč „poliedar“ je grčka: poli = mnogo, edra = osnova, strana. Fudbalska lopta je sašivena od 12 petouglova i 20 šestouglova – naduvana je lopta, ali je kroj poliedar.',
    'poliedar');
};
