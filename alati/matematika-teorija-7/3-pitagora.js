// Lekcije 10–13: Pitagorina teorema, obrnuta Pitagorina teorema, primena na pravougaonik i kvadrat,
// primena na jednakokraki i jednakostranični trougao (teorija i pojmovi, u glavi, uz crteže).
module.exports = ({ L, Q, U, S, G, proveri, r, O, bez }) => {
  const GO = { velicina: 240 };
  const kvadrat2 = (x) => x * x;

  // ── trouglovi (stranice: BC = a, CA = b, AB = c) ──
  // pravougli trougao: pravi ugao kod C; CB = a (uspravno), CA = b (vodoravno), AB = c
  const pravi = (a, b) => ({ C: [0, 0], A: [b, 0], B: [0, a] });
  // trougao sa stranicama BC = a, CA = b, AB = c (B u koordinatnom početku, C na x-osi)
  const trougao = (a, b, c) => {
    const x = (c * c + a * a - b * b) / (2 * a);
    const t = { B: [0, 0], C: [a, 0], A: [r(x), r(Math.sqrt(c * c - x * x))] };
    proveri(Math.abs(Math.hypot(t.A[0] - a, t.A[1]) - b) < 0.01 && Math.abs(Math.hypot(t.A[0], t.A[1]) - c) < 0.01, 'trougao ' + [a, b, c]);
    return t;
  };
  // obrtanje crteža oko početka (da pravi ugao ne bude odmah vidljiv na crtežu)
  const rot = (t, stepeni) => {
    const f = (stepeni * Math.PI) / 180, co = Math.cos(f), si = Math.sin(f);
    const o = {};
    for (const k of Object.keys(t)) o[k] = [r(t[k][0] * co - t[k][1] * si), r(t[k][0] * si + t[k][1] * co)];
    return o;
  };
  const tez = (t) => [(t.A[0] + t.B[0] + t.C[0]) / 3, (t.A[1] + t.B[1] + t.C[1]) / 3];
  // trougao ABC: o = oznake stranica ({CB: 'a'}), pu = pravi ugao ('BCA'), u = oznake uglova ({BAC: '30°'}), ist = istaknute stranice
  const tr = (o = {}, { pu, u = {}, ist = [] } = {}) => [
    { p: 'ABC', b: 0 },
    ...(pu ? [{ pu }] : []),
    ...Object.entries(u).map(([ime, s]) => ({ u: ime, o: s })),
    ...ist.map((d) => ({ d, b: 2, debljina: 4 })),
    ...Object.entries(o).map(([d, s]) => ({ d, o: s })),
  ];
  // kvadrati nad stranicama, spolja (strane = [[P, Q], …]); oznake = tekst u centru kvadrata
  const kvadrati = (t, strane, { oznake = [], kasni = 0 } = {}) => {
    const T = tez(t), e = [];
    strane.forEach(([p, q], i) => {
      const P = t[p], Q = t[q];
      let nx = -(Q[1] - P[1]), ny = Q[0] - P[0];
      const mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2;
      if ((mx - T[0]) * nx + (my - T[1]) * ny < 0) { nx = -nx; ny = -ny; }
      const pts = [P, Q, [Q[0] + nx, Q[1] + ny], [P[0] + nx, P[1] + ny]].map(([x, y]) => [r(x), r(y)]);
      e.push({ lin: pts, zatv: 1, gusto: 1, b: i, crtaj: 1, kasni: kasni + 0.6 * i, trajanje: 1.1 });
      if (oznake[i] !== undefined) e.push({ tx: oznake[i], at: [r(pts.reduce((s, z) => s + z[0], 0) / 4), r(pts.reduce((s, z) => s + z[1], 0) / 4)], b: i });
    });
    return e;
  };
  const STRANE = [['C', 'B'], ['C', 'A'], ['A', 'B']]; // kvadrati nad katetama CB, CA i hipotenuzom AB

  // ── 10. Pitagorina teorema ──
  L('Pitagorina teorema');
  Q(1, 'Kako se zove najduža stranica pravouglog trougla?',
    ['Hipotenuza', 'Kateta', 'Visina', 'Težišna duž'],
    'Reč je grčkog porekla i znači „ona koja se proteže ispod“. Leži naspram pravog ugla, a pravi ugao je najveći ugao trougla.', 'hipotenuza',
    { mediji: G(pravi(3, 4), tr({}, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(3, 4), tr({ AB: '~hipotenuza' }, { pu: 'BCA', ist: ['AB'] }), GO) });
  Q(1, 'Koja formula važi za pravougli trougao sa katetama $a$ i $b$ i hipotenuzom $c$?',
    ['$a^{2}+b^{2}=c^{2}$', '$a+b=c$', '$a^{2}-b^{2}=c^{2}$', '$a \\cdot b=c^{2}$'],
    'To je Pitagorina teorema: zbir kvadrata kateta jednak je kvadratu hipotenuze. Ako su katete jednake, iz nje sledi $c=a\\sqrt{2}$.', 'kateta',
    { mediji: G(pravi(4, 3), tr({ CB: 'a', CA: 'b', AB: 'c' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(4, 3), [...tr({ CB: 'a', CA: 'b', AB: 'c' }, { pu: 'BCA' }), ...kvadrati(pravi(4, 3), STRANE, { oznake: ['a²', 'b²', 'c²'] })], GO) });
  Q(1, 'Katete pravouglog trougla su 3 i 4. Kolika je hipotenuza?',
    ['5', '7', '12', '25'],
    'Hipotenuza je uvek kraća od zbira kateta, ali duža od svake od njih.', 'hipotenuza',
    { mediji: G(pravi(3, 4), tr({ CB: '3', CA: '4' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(3, 4), [...tr({ CB: '3', CA: '4', AB: '5' }, { pu: 'BCA' }), ...kvadrati(pravi(3, 4), STRANE, { oznake: ['9', '16', '25'] })], GO) });
  Q(1, 'Koja tvrdnja o pravouglom trouglu je tačna?',
    ['Hipotenuza je duža od svake katete', 'Hipotenuza je kraća od svake katete', 'Obe katete su duže od hipotenuze', 'Zbir kateta jednak je hipotenuzi'],
    'Ostala dva ugla zajedno čine 90°, pa je svaki od njih manji od pravog ugla, a naspram pravog je najduža stranica.', 'hipotenuza',
    { mediji: G(pravi(4, 3), tr({}, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(4, 3), tr({ AB: '~najduža' }, { pu: 'BCA', ist: ['AB'] }), GO) });
  Q(2, 'Obe katete pravouglog trougla su po 1 cm. Kolika je hipotenuza?',
    ['$\\sqrt{2}$ cm', '2 cm', '1 cm', '$\\sqrt{3}$ cm'],
    'Pitagorejcima se pripisuje dokaz da broj $\\sqrt{2}$ nije racionalan – njegov decimalni zapis nikad se ne završava niti periodično ponavlja.', 'koren',
    { mediji: G(pravi(1, 1), tr({ CB: '1', CA: '1' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(1, 1), tr({ AB: '√2' }, { pu: 'BCA', ist: ['AB'] }), GO) });
  Q(1, 'Katete pravouglog trougla su 3 cm i 4 cm. Nad svakom katetom nacrtan je kvadrat. Kolika je zbirna površina ta dva kvadrata?',
    ['25 cm²', '7 cm²', '12 cm²', '49 cm²'],
    'Ista je vrednost kao površina kvadrata nad hipotenuzom – to je srž Pitagorine teoreme.', 'kvadrat',
    { mediji: G(pravi(3, 4), [...tr({ CB: '3', CA: '4' }), ...kvadrati(pravi(3, 4), [['C', 'B'], ['C', 'A']])], GO),
      medijiOdgovora: G(pravi(3, 4), [...tr({ AB: '5' }), ...kvadrati(pravi(3, 4), STRANE, { oznake: ['9', '16', '25'] })], GO) });
  Q(2, 'Nad stranicama pravouglog trougla nacrtani su kvadrati, čije su površine $P_{1}$, $P_{2}$ i $P_{3}$ (P₃ je nad hipotenuzom). Koja veza važi?',
    ['$P_{1}+P_{2}=P_{3}$', '$P_{1}+P_{3}=P_{2}$', '$P_{1}\\cdot P_{2}=P_{3}$', '$P_{3}=2(P_{1}+P_{2})$'],
    'Ova veza važi za svaki pravougli trougao, bez obzira na oblik i veličinu.', 'površina',
    { mediji: G(pravi(4, 3), [...tr({}), ...kvadrati(pravi(4, 3), STRANE, { oznake: ['P₁', 'P₂', 'P₃'] })], GO),
      medijiOdgovora: G(pravi(4, 3), [...tr({}, { pu: 'BCA' }), ...kvadrati(pravi(4, 3), STRANE, { oznake: ['P₁', 'P₂', 'P₃'] })], GO) });
  Q(2, 'Hipotenuza pravouglog trougla je 13 cm, a jedna kateta 5 cm. Kolika je druga kateta?',
    ['12 cm', '8 cm', '18 cm', '$\\sqrt{194}$ cm'],
    'Ako se kateta poveća, a hipotenuza ostane ista, druga kateta mora da se smanji.', 'kateta',
    { mediji: G(pravi(12, 5), tr({ CA: '5', AB: '13' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(12, 5), [...tr({ CB: '12', CA: '5', AB: '13' }), ...kvadrati(pravi(12, 5), STRANE, { oznake: ['144', '25', '169'] })], GO) });
  Q(2, 'Hipotenuza pravouglog trougla je 17 cm, a jedna kateta 8 cm. Kolika je druga kateta?',
    ['15 cm', '9 cm', '$\\sqrt{353}$ cm', '25 cm'],
    'Trojke 5, 12, 13 i 8, 15, 17 nisu iz iste porodice – Pitagorinih trojki ima beskonačno mnogo.', 'kateta',
    { mediji: G(pravi(15, 8), tr({ CA: '8', AB: '17' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(15, 8), [...tr({ CB: '15', CA: '8', AB: '17' }), ...kvadrati(pravi(15, 8), STRANE, { oznake: ['225', '64', '289'] })], GO) });
  Q(1, 'Katete pravouglog trougla su 5 cm i 12 cm. Kolika je površina kvadrata nad hipotenuzom?',
    ['169 cm²', '289 cm²', '17 cm²', '49 cm²'],
    'Površina kvadrata nad hipotenuzom uvek je veća od površine kvadrata nad bilo kojom katetom.', 'hipotenuza',
    { mediji: G(pravi(12, 5), tr({ CB: '12', CA: '5' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(12, 5), [...tr({ CB: '12', CA: '5', AB: '13' }), ...kvadrati(pravi(12, 5), STRANE, { oznake: ['144', '25', '169'] })], GO) });
  Q(2, 'Površina kvadrata nad hipotenuzom je 25 cm², a površina kvadrata nad jednom katetom je 9 cm². Kolika je površina kvadrata nad drugom katetom?',
    ['16 cm²', '34 cm²', '4 cm²', '225 cm²'],
    'Kvadrat nad hipotenuzom ima površinu jednaku zbiru površina kvadrata nad katetama, pa je jedan od njih uvek manji.', 'kateta',
    { mediji: G(pravi(3, 4), [...tr({}), ...kvadrati(pravi(3, 4), [['C', 'B'], ['A', 'B']], { oznake: ['9 cm²', '25 cm²'] }), ...kvadrati(pravi(3, 4), [['C', 'A']], { oznake: ['?'] })], GO),
      medijiOdgovora: G(pravi(3, 4), [...tr({ CB: '3', CA: '4', AB: '5' }), ...kvadrati(pravi(3, 4), STRANE, { oznake: ['9', '16', '25'] })], GO) });
  Q(3, 'Jedna kateta pravouglog trougla je 2 cm, a hipotenuza 4 cm. Kolika je druga kateta?',
    ['$2\\sqrt{3}$ cm', '2 cm', '$\\sqrt{2}$ cm', '6 cm'],
    'Ovaj trougao je polovina jednakostraničnog trougla stranice 4 (vidi 13. lekciju).', 'kateta',
    { mediji: G(pravi(2, 2 * Math.sqrt(3)), tr({ CB: '2', AB: '4' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(2, 2 * Math.sqrt(3)), tr({ CB: '2', CA: '2√3', AB: '4' }, { pu: 'BCA', ist: ['CA'] }), GO) });
  Q(1, 'Katete pravouglog trougla su 7 cm i 24 cm. Kolika je hipotenuza?',
    ['25 cm', '31 cm', '$\\sqrt{527}$ cm', '17 cm'],
    'Ako pomnožiš ovu trojku sa 2, dobijaš novu Pitagorinu trojku: (14, 48, 50).', 'hipotenuza',
    { mediji: G(pravi(24, 7), tr({ CB: '24', CA: '7' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(24, 7), [...tr({ CB: '24', CA: '7', AB: '25' }), ...kvadrati(pravi(24, 7), STRANE, { oznake: ['576', '49', '625'] })], GO) });
  Q(3, 'Hipotenuza pravouglog trougla je $\\sqrt{50}$ cm, a jedna kateta 1 cm. Kolika je druga kateta?',
    ['7 cm', '49 cm', '$\\sqrt{51}$ cm', '$\\sqrt{48}$ cm'],
    'Broj $\\sqrt{50}$ je isto što i $5\\sqrt{2}$ – dijagonala kvadrata stranice 5.', 'kateta',
    { mediji: G(pravi(7, 1), tr({ CA: '1', AB: '√50' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(7, 1), [...tr({ CB: '7', CA: '1', AB: '√50' }), ...kvadrati(pravi(7, 1), STRANE, { oznake: ['49', '1', '50'] })], GO) });
  S(2, 'Spoji katete sa hipotenuzom pravouglog trougla.',
    [['3 cm i 4 cm', '5 cm'], ['5 cm i 12 cm', '13 cm'], ['8 cm i 15 cm', '17 cm'], ['6 cm i 8 cm', '10 cm']],
    'Trojke 3, 4, 5 i 6, 8, 10 su iste „porodice“: druga je dvostruko veća od prve.', 'hipotenuza');

  // ── 11. Obrnuta Pitagorina teorema ──
  L('Obrnuta Pitagorina teorema');
  Q(1, 'Ako za stranice trougla važi $a^{2}+b^{2}=c^{2}$, kakav je trougao?',
    ['Pravougli', 'Oštrougli', 'Tupougli', 'Jednakostranični'],
    'Ovo je obrnuta Pitagorina teorema: ako kvadrat najduže stranice jednak zbiru kvadrata ostale dve, ugao naspram nje je prav.', 'obrnuta',
    { mediji: G(trougao(5, 4, 6), tr({ BC: 'a', CA: 'b', AB: 'c' }), GO),
      medijiOdgovora: G(pravi(3, 4), [...tr({ CB: 'a', CA: 'b', AB: 'c' }, { pu: 'BCA' }), ...kvadrati(pravi(3, 4), STRANE, { oznake: ['a²', 'b²', 'c²'] })], GO) });
  Q(1, 'Trougao ima stranice 5 cm, 12 cm i 13 cm. Da li je pravougli?',
    ['Da, jer je $5^{2}+12^{2}=13^{2}$', 'Ne, jer je $5+12 \\neq 13$', 'Ne, jer je 13 prost broj', 'Da, jer je $5 \\cdot 12=60$'],
    'Brojevi 5, 12 i 13 čine Pitagorinu trojku, a takvih trojki ima beskonačno mnogo.', 'pitagorina',
    { mediji: G(rot(trougao(12, 5, 13), 25), tr({ BC: '12', CA: '5', AB: '13' }), GO),
      medijiOdgovora: G(trougao(12, 5, 13), [...tr({ BC: '12', CA: '5', AB: '13' }, { pu: 'BCA' }), ...kvadrati(trougao(12, 5, 13), [['B', 'C'], ['C', 'A'], ['A', 'B']], { oznake: ['144', '25', '169'] })], GO) });
  Q(2, 'Trougao ima stranice 4 cm, 7 cm i 8 cm. Kakav je?',
    ['Oštrougli', 'Pravougli', 'Tupougli', 'Ne postoji takav trougao'],
    'Uporedi zbir kvadrata dve kraće stranice sa kvadratom najduže: 16 + 49 je veće od 64.', 'oštrougli',
    { mediji: G(rot(trougao(8, 7, 4), 15), tr({ BC: '8', CA: '7', AB: '4' }), GO),
      medijiOdgovora: G(trougao(8, 7, 4), [...tr({ BC: '8', CA: '7', AB: '4' }), ...kvadrati(trougao(8, 7, 4), [['B', 'C'], ['C', 'A'], ['A', 'B']], { oznake: ['64', '49', '16'] })], GO) });
  Q(2, 'Trougao ima stranice 3 cm, 4 cm i 6 cm. Kakav je?',
    ['Tupougli', 'Oštrougli', 'Pravougli', 'Jednakokraki'],
    'Ako je kvadrat najduže stranice veći od zbira kvadrata ostale dve, ugao naspram nje je veći od 90°.', 'tupougli',
    { mediji: G(trougao(6, 4, 3), tr({ BC: '6', CA: '4', AB: '3' }), GO),
      medijiOdgovora: G(trougao(6, 4, 3), [...tr({ BC: '6', CA: '4', AB: '3' }), ...kvadrati(trougao(6, 4, 3), [['B', 'C'], ['C', 'A'], ['A', 'B']], { oznake: ['36', '16', '9'] })], GO) });
  Q(3, 'Trougao ima stranice $\\sqrt{2}$ cm, $\\sqrt{3}$ cm i 2 cm. Kakav je?',
    ['Oštrougli', 'Pravougli', 'Tupougli', 'Jednakostranični'],
    'Zbir kvadrata kraćih stranica je 2 + 3 = 5, a kvadrat najduže je 4. Kad je zbir veći, svi uglovi su oštri.', 'koren',
    { mediji: G(trougao(2, Math.sqrt(3), Math.sqrt(2)), tr({ BC: '2', CA: '√3', AB: '√2' }), GO),
      medijiOdgovora: G(trougao(2, Math.sqrt(3), Math.sqrt(2)), [...tr({ BC: '2', CA: '√3', AB: '√2' }), ...kvadrati(trougao(2, Math.sqrt(3), Math.sqrt(2)), [['B', 'C'], ['C', 'A'], ['A', 'B']], { oznake: ['4', '3', '2'] })], GO) });
  Q(2, 'Za stranice trougla važi $c^{2}<a^{2}+b^{2}$, gde je $c$ najduža stranica. Kakav je trougao?',
    ['Oštrougli', 'Pravougli', 'Tupougli', 'Jednakokraki'],
    'Iz ove nejednakosti se vidi da je ugao naspram $c$ manji od 90°, ali se tačna vrednost ugla ne može odrediti samo iz nje.', 'ugao',
    { mediji: G(trougao(4, 5, 6), tr({ BC: 'a', CA: 'b', AB: 'c' }), GO),
      medijiOdgovora: G(trougao(4, 5, 6), [...tr({ BC: 'a', CA: 'b', AB: 'c' }), ...kvadrati(trougao(4, 5, 6), [['B', 'C'], ['C', 'A'], ['A', 'B']], { oznake: ['16', '25', '36'] })], GO) });
  Q(3, 'Koja od ovih trojki brojeva je primitivna Pitagorina trojka?',
    ['(5, 12, 13)', '(6, 8, 10)', '(9, 12, 15)', '(10, 24, 26)'],
    'Trojka je primitivna ako su njeni članovi uzajamno prosti brojevi: nijedan broj veći od 1 ne deli sva tri.', 'primitivna',
    { medijiOdgovora: G(pravi(12, 5), tr({ CB: '12', CA: '5', AB: '13' }, { pu: 'BCA' }), GO) });
  Q(1, 'Trojka (3, 4, 5) pomnoži se brojem 2. Koja je nova trojka?',
    ['(6, 8, 10)', '(5, 6, 7)', '(6, 8, 11)', '(9, 12, 15)'],
    'Ako sve tri stranice pomnožimo istim brojem, trougao ostaje pravougli, samo veći.', 'trojka',
    { mediji: G(pravi(3, 4), tr({ CB: '3', CA: '4', AB: '5' }), GO),
      medijiOdgovora: G(pravi(6, 8), tr({ CB: '6', CA: '8', AB: '10' }, { pu: 'BCA' }), GO) });
  Q(1, 'Trougao ima stranice 6 cm, 8 cm i 10 cm. Koliki je ugao naspram stranice 10 cm?',
    ['90°', '60°', '45°', '120°'],
    'Trougao 6, 8, 10 je pravougli, pa je naspram najduže stranice pravi ugao.', 'ugao',
    { mediji: G(trougao(10, 8, 6), [...tr({ BC: '10', CA: '8', AB: '6' }, { u: { BAC: '?' } })], GO),
      medijiOdgovora: G(trougao(10, 8, 6), tr({ BC: '10', CA: '8', AB: '6' }, { u: { BAC: '90°' } }), GO) });
  Q(2, 'Stranice pravouglog trougla su $x$ cm, 4 cm i 5 cm, a 5 cm je hipotenuza. Koliko je $x$?',
    ['3', '1', '$\\sqrt{41}$', '9'],
    'Trojka 3, 4, 5 je najmanja Pitagorina trojka sa celim brojevima.', 'kateta',
    { mediji: G(pravi(3, 4), tr({ CB: '?', CA: '4', AB: '5' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(3, 4), tr({ CB: '3', CA: '4', AB: '5' }, { pu: 'BCA' }), GO) });
  Q(3, 'Stranice trougla su $x$, $x+1$ i $x+2$ (u cm), a trougao je pravougli sa hipotenuzom $x+2$. Koliko je $x$?',
    ['3', '2', '4', '5'],
    'Kad se izjednači $x^{2}+(x+1)^{2}=(x+2)^{2}$, dobija se $x^{2}-2x-3=0$, pa je $x=3$.', 'stranica',
    { medijiOdgovora: G(pravi(3, 4), tr({ CB: 'x', CA: 'x+1', AB: 'x+2' }, { pu: 'BCA' }), GO) });
  U(1, 'Koja trojka brojeva NIJE Pitagorina?',
    ['2, 3, 4', '3, 4, 5', '5, 12, 13', '6, 8, 10'],
    'Pitagorina trojka zadovoljava $a^{2}+b^{2}=c^{2}$. Za 2, 3, 4 važi 4 + 9 = 13, a $4^{2}=16$.',
    'Pitagorine trojke nazvane su po Pitagori, ali su bile poznate i mnogo ranije.', 'trojka');
  Q(1, 'Koje stranice ima „egipatski trougao“ kojim su Egipćani dobijali pravi ugao?',
    ['3, 4 i 5', '2, 5 i 5', '4, 4 i 4', '5, 6 i 7'],
    'Konopac se podeli na 12 jednakih delova i savije tako da stranice budu 3, 4 i 5 delova. Pravi ugao dobija se bez šestara.', 'konopac',
    { medijiOdgovora: G(pravi(3, 4), tr({ CB: '3', CA: '4', AB: '5' }, { pu: 'BCA' }), GO) });
  Q(2, 'Koja je najstarija poznata zbirka Pitagorinih trojki?',
    ['Glinena pločica iz Vavilona', 'Euklidovi „Elementi“', 'Papirus iz Egipta', 'Zapis iz Samosa'],
    'Pločica je nastala više od 1000 godina pre Pitagore, u vreme Vavilonaca.', 'glina');
  S(2, 'Spoji stranice trougla sa njegovom vrstom.',
    [['3, 4, 5', 'pravougli'], ['4, 5, 6', 'oštrougli'], ['3, 4, 6', 'tupougli'], ['1, 2, 4', 'ne postoji']],
    'Trougao ne postoji kad zbir dve kraće stranice nije veći od treće: 1 + 2 nije veće od 4.', 'stranica');

  // ── 12. Primena Pitagorine teoreme na pravougaonik i kvadrat ──
  const PR = (w, h) => ({ A: [0, 0], B: [w, 0], C: [w, h], D: [0, h] });
  L('Primena Pitagorine teoreme na pravougaonik i kvadrat');
  Q(1, 'Dijagonala deli pravougaonik na dva dela. Kakva su to dva trougla?',
    ['Podudarni pravougli trouglovi', 'Jednakokraki trouglovi', 'Jednakostranični trouglovi', 'Četiri jednaka trougla'],
    'Presek dijagonala pravougaonika jednako je udaljen od sva četiri temena.', 'dijagonala',
    { mediji: G(PR(8, 5), [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 1, debljina: 3 }], GO),
      medijiOdgovora: G(PR(8, 5), [{ p: 'ABC', b: 0 }, { p: 'ACD', b: 1 }, { pu: 'ABC' }, { pu: 'CDA' }, { d: 'AC', b: 1, debljina: 3 }], GO) });
  Q(1, 'Pravougaonik ima stranice $a$ i $b$, a dijagonalu $d$. Koja formula važi?',
    ['$d^{2}=a^{2}+b^{2}$', '$d=a+b$', '$d^{2}=a^{2}-b^{2}$', '$d=2(a+b)$'],
    'Dijagonala je hipotenuza pravouglog trougla čije su katete stranice pravougaonika.', 'stranica',
    { mediji: G(PR(6, 4), [{ p: 'ABCD', b: 0 }, { d: 'AB', o: 'a' }, { d: 'BC', o: 'b' }, { d: 'AC', o: 'd', b: 2 }], GO),
      medijiOdgovora: G(PR(6, 4), [{ p: 'ABC', b: 0 }, { pu: 'ABC' }, { d: 'AB', o: 'a' }, { d: 'BC', o: 'b' }, { d: 'AC', o: 'd', b: 2 }], GO) });
  Q(1, 'Kakve su dijagonale pravougaonika?',
    ['Jednake su i polove se', 'Različite su i polove se', 'Normalne su jedna na drugu', 'Jednake su i normalne jedna na drugu'],
    'Dijagonale kvadrata su međusobno normalne, ali kod pravougaonika to nije pravilo (osim kod kvadrata).', 'dijagonala',
    { mediji: G(PR(8, 5), [{ p: 'ABCD', b: 0 }, { d: 'AC' }, { d: 'BD' }], GO),
      medijiOdgovora: G(PR(8, 5), [{ p: 'ABCD', b: 0 }, { d: 'AC', o: 'd', b: 2 }, { d: 'BD', o: 'd', b: 2 }], GO) });
  Q(1, 'Pravougaonik ima stranice 6 cm i 8 cm. Kolika je dijagonala?',
    ['10 cm', '14 cm', '$\\sqrt{28}$ cm', '12 cm'],
    'Dijagonala je uvek duža od svake stranice pravougaonika, ali kraća od njihovog zbira.', 'dijagonala',
    { mediji: G(PR(8, 6), [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '8' }, { d: 'BC', o: '6' }], GO),
      medijiOdgovora: G(PR(8, 6), [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '8' }, { d: 'BC', o: '6' }, { d: 'AC', o: '10', b: 2 }], GO) });
  Q(2, 'Dijagonala pravougaonika je 13 cm, a jedna stranica 12 cm. Kolika je druga stranica?',
    ['5 cm', '1 cm', '$\\sqrt{313}$ cm', '25 cm'],
    'Trojka 5, 12, 13 se pojavljuje i kod pravougaonika, ne samo kod trouglova.', 'stranica',
    { mediji: G(PR(12, 5), [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '12' }, { d: 'BC', o: '?' }, { d: 'AC', o: '13', b: 2 }], GO),
      medijiOdgovora: G(PR(12, 5), [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '12' }, { d: 'BC', o: '5' }, { d: 'AC', o: '13', b: 2 }], GO) });
  Q(1, 'Kvadrat ima stranicu $a$. Kolika je dijagonala?',
    ['$a\\sqrt{2}$', '$2a$', '$a^{2}$', '$a\\sqrt{3}$'],
    'Dijagonala kvadrata stranice 1 je $\\sqrt{2}$, a upravo taj broj je Pitagorejcima bio primer iracionalnog broja.', 'kvadrat',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: 'a' }], GO),
      medijiOdgovora: G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: 'a' }, { d: 'AC', o: 'a√2', b: 2 }, { pu: 'ABC' }], GO) });
  Q(3, 'Dijagonala kvadrata je 4 cm. Kolika je njegova stranica?',
    ['$2\\sqrt{2}$ cm', '2 cm', '4 cm', '$4\\sqrt{2}$ cm'],
    'Ako znaš dijagonalu kvadrata, površina se dobija bez korena: $P=d^{2}/2$.', 'kvadrat',
    { mediji: G({ A: [0, 0], B: [2.828, 0], C: [2.828, 2.828], D: [0, 2.828] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', o: '4', b: 2 }], GO),
      medijiOdgovora: G({ A: [0, 0], B: [2.828, 0], C: [2.828, 2.828], D: [0, 2.828] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '2√2' }, { d: 'AC', o: '4', b: 2 }], GO) });
  Q(3, 'Dijagonala kvadrata je 6 cm. Kolika je njegova površina?',
    ['18 cm²', '36 cm²', '$6\\sqrt{2}$ cm²', '9 cm²'],
    'Površina kvadrata može da se izrazi i preko dijagonale: dvostruko manja od kvadrata dijagonale.', 'dijagonala',
    { mediji: G({ A: [0, 0], B: [4.243, 0], C: [4.243, 4.243], D: [0, 4.243] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', o: '6', b: 2 }], GO),
      medijiOdgovora: G({ A: [0, 0], B: [4.243, 0], C: [4.243, 4.243], D: [0, 4.243] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '3√2' }, { tx: 'P = 18 cm²', at: [2.12, 2.12] }], GO) });
  Q(2, 'Obim kvadrata je 20 cm. Kolika je njegova dijagonala?',
    ['$5\\sqrt{2}$ cm', '$10\\sqrt{2}$ cm', '10 cm', '$5\\sqrt{3}$ cm'],
    'Stranica kvadrata je četvrtina obima, pa je dijagonala stranica pomnožena sa $\\sqrt{2}$.', 'obim',
    { mediji: G({ A: [0, 0], B: [5, 0], C: [5, 5], D: [0, 5] }, [{ p: 'ABCD', b: 0 }, { tx: 'O = 20 cm', at: [2.5, 2.5] }], GO),
      medijiOdgovora: G({ A: [0, 0], B: [5, 0], C: [5, 5], D: [0, 5] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '5' }, { d: 'AC', o: '5√2', b: 2 }], GO) });
  Q(3, 'Dijagonala pravougaonika je 10 cm, a jedna stranica 6 cm. Koliki je obim pravougaonika?',
    ['28 cm', '48 cm', '16 cm', '24 cm'],
    'Pravougaonik sa stranicama 6 i 8 ima dijagonalu 10 – to je jedna od Pitagorinih trojki.', 'obim',
    { mediji: G(PR(8, 6), [{ p: 'ABCD', b: 0 }, { d: 'BC', o: '6' }, { d: 'AC', o: '10', b: 2 }], GO),
      medijiOdgovora: G(PR(8, 6), [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '8' }, { d: 'BC', o: '6' }, { tx: 'O = 28 cm', at: [4, 3] }], GO) });
  Q(2, 'Pravougaonik ima stranice 1 cm i $\\sqrt{3}$ cm. Kolika je dijagonala?',
    ['2 cm', '$\\sqrt{3}$ cm', '4 cm', '$\\sqrt{2}$ cm'],
    'Dijagonala pravougaonika dobija se iz zbira kvadrata stranica: 1 + 3 = 4.', 'dijagonala',
    { mediji: G(PR(1.732, 1), [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '√3' }, { d: 'BC', o: '1' }], GO),
      medijiOdgovora: G(PR(1.732, 1), [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '√3' }, { d: 'BC', o: '1' }, { d: 'AC', o: '2', b: 2 }], GO) });
  Q(3, 'Među pravougaonicima sa istom dijagonalom, koji ima najveću površinu?',
    ['Kvadrat', 'Onaj čija je jedna stranica dvostruko kraća od druge', 'Onaj čija je jedna stranica tri puta duža od druge', 'Svi imaju istu površinu'],
    'Pravougaonik sa stranicama 6 i 8 i kvadrat sa istom dijagonalom 10 razlikuju se po površini: 48 i 50.', 'kvadrat',
    { medijiOdgovora: G({ A: [0, 0], B: [8, 0], C: [8, 6], D: [0, 6], E: [10, 0], F: [17.071, 0], G: [17.071, 7.071], H: [10, 7.071] },
      [{ p: 'ABCD', b: 0 }, { d: 'AC', o: '10', b: 2 }, { tx: 'P = 48', at: [4, 1.2] }, { p: 'EFGH', b: 1 }, { d: 'EG', o: '10', b: 2 }, { tx: 'P = 50', at: [13.5, 1.2] }], GO) });
  U(2, 'Koja tvrdnja o dijagonalama kvadrata NIJE tačna?',
    ['Dijagonale kvadrata su različite dužine', 'Dijagonale kvadrata su jednake', 'Dijagonale kvadrata se polove', 'Dijagonale kvadrata su međusobno normalne'],
    'Dijagonale kvadrata su jednake, polove se i seku se pod pravim uglom.',
    'Dijagonale su normalne kod romba i kvadrata, a kod pravougaonika nisu.', 'dijagonala');
  S(2, 'Spoji oblik sa formulom.',
    [['kvadrat sa stranicom $a$', '$d=a\\sqrt{2}$'], ['pravougaonik sa stranicama $a$ i $b$', '$d^{2}=a^{2}+b^{2}$'], ['kvadrat sa dijagonalom $d$', '$P=d^{2}/2$']],
    'Površina kvadrata može da se izrazi preko stranice ($a^{2}$) ili preko dijagonale ($d^{2}/2$), i oba su tačna.', 'formula');
  Q(1, 'Koliko puta je dijagonala kvadrata duža od njegove stranice?',
    ['$\\sqrt{2}$ puta', '2 puta', '$\\sqrt{3}$ puta', '1,5 puta'],
    'Ovaj odnos važi za svaki kvadrat, bez obzira na veličinu.', 'odnos',
    { mediji: G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [{ p: 'ABCD', b: 0 }, { d: 'AC', b: 2 }], GO),
      medijiOdgovora: G({ A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: 'a' }, { d: 'AC', o: 'a√2', b: 2 }], GO) });

  // ── 13. Primena Pitagorine teoreme na jednakokraki i jednakostranični trougao ──
  L('Primena Pitagorine teoreme na jednakokraki i jednakostranični trougao');
  const JEDNAKOKRAK = (osn, h) => ({ A: [0, h], B: [-osn / 2, 0], C: [osn / 2, 0], D: [0, 0] });
  Q(1, 'Šta visina iz vrha jednakokrakog trougla na osnovicu radi sa osnovicom?',
    ['Deli je na dve jednake polovine', 'Udvostručuje je', 'Ne dodiruje je', 'Deli je u odnosu 1 : 2'],
    'Visina jednakokrakog trougla je ujedno i simetrala osnovice i simetrala ugla pri vrhu.', 'visina',
    { mediji: G(JEDNAKOKRAK(6, 4), tr({ BC: 'a', AB: 'b', AC: 'b' }), GO),
      medijiOdgovora: G(JEDNAKOKRAK(6, 4), [...tr({ AB: 'b', AC: 'b' }, { pu: 'ADB' }), { d: 'BC', o: 'a', na: 0.15 }, { d: 'AD', isp: 1, o: 'h' }, { d: 'BD', o: 'a/2' }, { d: 'DC', o: 'a/2' }], GO) });
  Q(2, 'Jednakokraki trougao ima osnovicu 16 cm i krak 10 cm. Kolika je visina na osnovicu?',
    ['6 cm', '8 cm', '$\\sqrt{164}$ cm', '26 cm'],
    'Visina deli osnovicu na dva jednaka dela, pa dobijamo dva podudarna pravougla trougla.', 'visina',
    { mediji: G(JEDNAKOKRAK(16, 6), tr({ BC: '16', AB: '10', AC: '10' }), GO),
      medijiOdgovora: G(JEDNAKOKRAK(16, 6), [...tr({ AB: '10', AC: '10' }, { pu: 'ADB' }), { d: 'AD', isp: 1, o: '6' }, { d: 'BD', o: '8' }, { d: 'DC', o: '8' }], GO) });
  Q(2, 'Kako glasi veza visine $h$, osnovice $a$ i kraka $b$ jednakokrakog trougla?',
    ['$h^{2}+a^{2}/4=b^{2}$', '$h^{2}+a^{2}=b^{2}$', '$h+a/2=b$', '$h^{2}-a^{2}/4=b^{2}$'],
    'Visina je kateta pravouglog trougla čija je hipotenuza krak, a druga kateta polovina osnovice.', 'krak',
    { mediji: G(JEDNAKOKRAK(6, 4), [...tr({ AB: 'b', AC: 'b' }, { pu: 'ADB' }), { d: 'BC', o: 'a', na: 0.15 }, { d: 'AD', isp: 1, o: 'h' }], GO),
      medijiOdgovora: G(JEDNAKOKRAK(6, 4), [...tr({ AB: 'b', AC: 'b' }, { pu: 'ADB' }), { d: 'BC', o: 'a', na: 0.15 }, { d: 'AD', isp: 1, o: 'h' }, { d: 'BD', o: 'a/2' }], GO) });
  Q(1, 'Katete pravouglog trougla su po 4 cm. Kolika je hipotenuza?',
    ['$4\\sqrt{2}$ cm', '8 cm', '4 cm', '$4\\sqrt{3}$ cm'],
    'Trougao sa uglovima 45°, 45° i 90° je polovina kvadrata, pa je hipotenuza njegova dijagonala.', 'hipotenuza',
    { mediji: G(pravi(4, 4), tr({ CB: '4', CA: '4' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(4, 4), tr({ CB: '4', CA: '4', AB: '4√2' }, { pu: 'BCA', ist: ['AB'] }), GO) });
  Q(3, 'Jednakokrako pravougli trougao ima hipotenuzu 6 cm. Kolika je kateta?',
    ['$3\\sqrt{2}$ cm', '3 cm', '6 cm', '$6\\sqrt{2}$ cm'],
    'Visina na hipotenuzu deli ovaj trougao na dva manja jednakokrako pravougla trougla.', 'kateta',
    { mediji: G(pravi(3 * Math.SQRT2, 3 * Math.SQRT2), tr({ AB: '6' }, { pu: 'BCA' }), GO),
      medijiOdgovora: G(pravi(3 * Math.SQRT2, 3 * Math.SQRT2), tr({ CB: '3√2', CA: '3√2', AB: '6' }, { pu: 'BCA', ist: ['AB'] }), GO) });
  Q(3, 'Kateta jednakokrako pravouglog trougla je 4 cm. Kolika je visina iz pravog ugla na hipotenuzu?',
    ['$2\\sqrt{2}$ cm', '2 cm', '4 cm', '$4\\sqrt{2}$ cm'],
    'Visina na hipotenuzu jednakokrako pravouglog trougla jednaka je polovini hipotenuze.', 'visina',
    { mediji: G({ ...pravi(4, 4), M: [2, 2] }, [...tr({ CB: '4', CA: '4' }, { pu: 'BCA' })], GO),
      medijiOdgovora: G({ ...pravi(4, 4), M: [2, 2] }, [...tr({ CB: '4', CA: '4' }, { pu: 'BCA' }), { d: 'CM', o: '2√2', b: 2, debljina: 3 }], GO) });
  Q(3, 'Visina na hipotenuzu jednakokrako pravouglog trougla je 3 cm. Kolika je hipotenuza?',
    ['6 cm', '3 cm', '$3\\sqrt{2}$ cm', '$6\\sqrt{2}$ cm'],
    'Hipotenuza je dvostruko duža od visine na nju, pa se računa unazad.', 'hipotenuza',
    { mediji: G({ ...pravi(3 * Math.SQRT2, 3 * Math.SQRT2), M: [1.5 * Math.SQRT2, 1.5 * Math.SQRT2] }, [...tr({}, { pu: 'BCA' }), { d: 'CM', o: '3', b: 2, debljina: 3 }], GO),
      medijiOdgovora: G({ ...pravi(3 * Math.SQRT2, 3 * Math.SQRT2), M: [1.5 * Math.SQRT2, 1.5 * Math.SQRT2] }, [...tr({}, { pu: 'BCA', ist: ['AB'] }), { d: 'AB', o: '6', na: 0.15 }, { d: 'CM', o: '3', b: 2, debljina: 3 }], GO) });
  Q(2, 'Kolika je visina jednakostraničnog trougla stranice 2 cm?',
    ['$\\sqrt{3}$ cm', '1 cm', '2 cm', '$2\\sqrt{3}$ cm'],
    'Visina jednakostraničnog trougla je istovremeno i simetrala ugla i težišna duž.', 'visina',
    { mediji: G({ A: [0, 1.732], B: [-1, 0], C: [1, 0] }, [{ p: 'ABC', b: 0 }, { d: 'BC', o: '2' }], GO),
      medijiOdgovora: G({ A: [0, 1.732], B: [-1, 0], C: [1, 0], D: [0, 0] }, [{ p: 'ABC', b: 0 }, { pu: 'ADB' }, { d: 'AD', isp: 1, o: '√3' }, { d: 'BC', o: '2', na: 0.15 }], GO) });
  Q(3, 'Visina jednakostraničnog trougla je $2\\sqrt{3}$ cm. Kolika je stranica?',
    ['4 cm', '$4\\sqrt{3}$ cm', '2 cm', '$2\\sqrt{3}$ cm'],
    'Stranica i visina jednakostraničnog trougla su u odnosu $2 : \\sqrt{3}$.', 'stranica',
    { mediji: G({ A: [0, 3.464], B: [-2, 0], C: [2, 0], D: [0, 0] }, [{ p: 'ABC', b: 0 }, { d: 'AD', isp: 1, o: '2√3' }, { pu: 'ADB' }], GO),
      medijiOdgovora: G({ A: [0, 3.464], B: [-2, 0], C: [2, 0], D: [0, 0] }, [{ p: 'ABC', b: 0 }, { d: 'BC', o: '4', na: 0.15 }, { d: 'AD', isp: 1, o: '2√3' }], GO) });
  Q(2, 'Kolika je površina jednakostraničnog trougla stranice 4 cm?',
    ['$4\\sqrt{3}$ cm²', '$16\\sqrt{3}$ cm²', '$8\\sqrt{3}$ cm²', '8 cm²'],
    'Među trouglovima istog obima, jednakostranični ima najveću površinu.', 'površina',
    { mediji: G({ A: [0, 3.464], B: [-2, 0], C: [2, 0] }, [{ p: 'ABC', b: 0 }, { d: 'BC', o: '4' }], GO),
      medijiOdgovora: G({ A: [0, 3.464], B: [-2, 0], C: [2, 0], D: [0, 0] }, [{ p: 'ABC', b: 0 }, { d: 'AD', isp: 1, o: '2√3' }, { tx: 'P = 4√3', at: [-0.7, 1.1] }], GO) });
  Q(3, 'Površina jednakostraničnog trougla je $9\\sqrt{3}$ cm². Kolika je stranica?',
    ['6 cm', '9 cm', '$3\\sqrt{3}$ cm', '12 cm'],
    'Stranica i visina jednakostraničnog trougla su povezane preko $\\sqrt{3}$, pa se površina računa iz stranice.', 'stranica',
    { mediji: G({ A: [0, 5.196], B: [-3, 0], C: [3, 0] }, [{ p: 'ABC', b: 0 }, { tx: 'P = 9√3 cm²', at: [0, 1.6] }], GO),
      medijiOdgovora: G({ A: [0, 5.196], B: [-3, 0], C: [3, 0], D: [0, 0] }, [{ p: 'ABC', b: 0 }, { d: 'BC', o: '6', na: 0.15 }, { d: 'AD', isp: 1, o: '3√3' }], GO) });
  Q(2, 'Pravougli trougao ima uglove 30°, 60° i 90°, a hipotenuza mu je 10 cm. Kolika je kraća kateta?',
    ['5 cm', '$5\\sqrt{3}$ cm', '10 cm', '$10\\sqrt{3}$ cm'],
    'Kraća kateta je naspram ugla od 30°, a duža naspram ugla od 60°.', 'uglovi',
    { mediji: G(pravi(5, 5 * Math.sqrt(3)), tr({ AB: '10' }, { pu: 'BCA', u: { BAC: '30°', ABC: '60°' } }), GO),
      medijiOdgovora: G(pravi(5, 5 * Math.sqrt(3)), tr({ CB: '5', CA: '5√3', AB: '10' }, { pu: 'BCA', u: { BAC: '30°', ABC: '60°' } }), GO) });
  Q(3, 'Kraća kateta pravouglog trougla sa uglovima 30°, 60° i 90° je 4 cm. Kolika je hipotenuza?',
    ['8 cm', '$4\\sqrt{3}$ cm', '4 cm', '$8\\sqrt{3}$ cm'],
    'Dva takva trougla, složena po dužoj kateti, čine jednakostranični trougao.', 'hipotenuza',
    { mediji: G(pravi(4, 4 * Math.sqrt(3)), tr({ CB: '4' }, { pu: 'BCA', u: { BAC: '30°' } }), GO),
      medijiOdgovora: G(pravi(4, 4 * Math.sqrt(3)), tr({ CB: '4', CA: '4√3', AB: '8' }, { pu: 'BCA', u: { BAC: '30°' } }), GO) });
  S(2, 'Spoji oblik sa površinom.',
    [['jednakostranični, stranica 2 cm', '$\\sqrt{3}$ cm²'], ['jednakokrako pravougli, hipotenuza 2 cm', '1 cm²'], ['jednakokrako pravougli, kateta 3 cm', '4,5 cm²'], ['jednakostranični, stranica 4 cm', '$4\\sqrt{3}$ cm²']],
    'Jednakokrako pravougli trougao sa hipotenuzom $c$ ima površinu $c^{2}/4$.', 'površina');
  U(2, 'Koja tvrdnja o jednakostraničnom trouglu NIJE tačna?',
    ['Visina je jednaka stranici pomnoženoj sa $\\sqrt{3}$', 'Svi uglovi su po $60°$', 'Sve stranice su jednake', 'Visina je ujedno i težišna duž'],
    'Visina je $a\\sqrt{3}/2$, dakle polovina stranice pomnožena sa $\\sqrt{3}$, a ne cela stranica.', 'Jednakostranični trougao ima uglove i stranice jednake, a visina je ujedno i težišna duž.', 'trougao');
  return undefined;
};
