// Lekcije 39–41: projektni zadatak i prikupljanje podataka, statistička obeležja, priprema i prikaz podataka.
module.exports = ({ L, Q, U, S, G, r, sto, O, bez, kruzni, proveri }) => {
  // provera računa (gradnja pukne ako nešto ne važi)
  proveri(Math.abs(150 / 200 - 0.75) < 1e-9, 'odziv 150 od 200 je 75%');
  proveri(Math.abs(14 / 37 - 0.378) < 1e-3 && Math.round((14 / 37) * 100) === 38, '14 od 37 je 38%');
  proveri(Math.abs(5 / 20 - 0.25) < 1e-9, '5 od 20 je 25%');
  proveri(9 / 30 === 0.3, '9 od 30 je 30%');
  proveri(Math.abs(0.4 * 30 - 12) < 1e-9, '40% od 30 je 12');
  proveri(360 / 4 === 90 && 360 * 0.25 === 90, '25% kruga je 90°');
  proveri(100 - (40 + 25 + 20) === 15, 'ostatak kruga 15%');
  proveri((2 + 4 + 5 + 9) / 4 === 5, 'sredina 2, 4, 5, 9 je 5');
  proveri((5 + 8) / 2 === 6.5, 'medijana 3, 5, 8, 10 je 6,5');
  proveri((3 + 4) / 2 === 3.5, 'medijana 1…5 i 10 je 3,5');
  proveri((1 + 2 + 3 + 4 + 5 + 10) / 6 - 4.17 < 0.01, 'sredina 1…5 i 10 je 4,17');
  proveri((4 * 5 + 3) / 5 === 4.6, 'prosek Ane je 4,6');
  proveri(3 * 6 - 4 - 7 === 7, 'treći broj je 7');
  proveri([9, 12, 14, 15, 17, 18, 20][3] === 15, 'medijana temperatura je 15');
  proveri(20 - 9 === 11, 'razlika temperatura');
  proveri(Math.abs(160 / 150 - 1.07) < 0.01, 'Branko je oko 1,07 puta viši od Ane');
  proveri(Math.round(((160 - 150) / 150) * 100) === 7, 'oko 7% više');
  proveri(Math.abs(1 / 3 - 0.33) < 0.01, 'trećina je oko 33%');

  // ── pomoćni crteži ──
  // tabela: zaglavlje i redovi (ćelije su tekst; reči sa ~ se preslovljavaju); istakni = indeksi redova (0 = zaglavlje)
  const tabela = (zag, redovi, { w = 2.6, h = 0.85, istakni = [], velicina = 320 } = {}) => {
    // reči (slova) u ćelijama dobijaju ~ da bi se preslovile u ćirilicu; brojevi i % ostaju
    const tr = (c) => (/[A-Za-zČĆŠĐŽčćšđž]/.test(c) && !c.startsWith('~') ? '~' + c : c);
    const svi = [zag, ...redovi].map((red) => red.map(tr));
    const n = zag.length, m = svi.length, e = [];
    const sirine = Array.isArray(w) ? w : Array(n).fill(w);
    const x = [0];
    sirine.forEach((d) => x.push(x[x.length - 1] + d));
    const W = x[n];
    svi.forEach((red, i) => {
      const y0 = (m - i - 1) * h, y1 = y0 + h;
      if (istakni.includes(i)) e.push({ lin: [[0, y0], [W, y0], [W, y1], [0, y1]], zatv: 1, b: 2, gusto: 1 });
      red.forEach((c, j) => e.push({ tx: c, at: [r((x[j] + x[j + 1]) / 2), r(y0 + h / 2 - 0.12)], vel: 15, ...(i === 0 ? { b: 1 } : {}) }));
    });
    for (let i = 0; i <= m; i++) e.push({ lin: [[0, i * h], [W, i * h]], b: 4, debljina: 1.5 });
    for (let j = 0; j <= n; j++) e.push({ lin: [[x[j], 0], [x[j], m * h]], b: 4, debljina: 1.5 });
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina });
  };

  // stubići; osa Y može da počne od bilo koje vrednosti (baza) – za varljive dijagrame;
  // bezNatpisa = bez naziva stubića i brojeva na osi; vrednosti = broj iznad stubića
  const stubiciY = (podaci, { baza = 0, maxY, korakY = 1, visina = 6, bezNatpisa = false, vrednosti = false, istakni = [] } = {}) => {
    const n = podaci.length, W = Math.max(8, n * 1.6), korak = W / n;
    const mx = maxY ?? Math.max(...podaci.map((p) => p[1]));
    const sy = visina / (mx - baza);
    const e = [
      { lin: [[0, 0], [W + 0.4, 0]], b: 5, debljina: 2 },
      { lin: [[0, 0], [0, visina + 0.8]], b: 5, debljina: 2 },
    ];
    if (!bezNatpisa) for (let y = baza; y <= mx + 1e-9; y += korakY) {
      e.push({ lin: [[-0.15, (y - baza) * sy], [W, (y - baza) * sy]], b: 5, debljina: 0.6, isp: 1 });
      e.push({ tx: String(+y.toFixed(2)).replace('.', ','), at: [-0.55, (y - baza) * sy - 0.12] });
    }
    podaci.forEach(([naziv, v], i) => {
      const x0 = i * korak + korak * 0.18, x1 = (i + 1) * korak - korak * 0.18, h = (v - baza) * sy;
      e.push({ lin: [[x0, 0], [x1, 0], [x1, h], [x0, h]], zatv: 1, gusto: 1, b: istakni.includes(i) ? 1 : 0 });
      if (!bezNatpisa && naziv !== '') e.push({ tx: naziv, at: [r((x0 + x1) / 2), -0.55] });
      if (vrednosti) e.push({ tx: String(v).replace('.', ','), at: [r((x0 + x1) / 2), r(h + 0.4)] });
    });
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 320 });
  };

  // linijski dijagram (grafik) podataka [[naziv, vrednost], …]
  const linijski = (podaci, { baza = 0, maxY, korakY = 5, visina = 6 } = {}) => {
    const n = podaci.length, W = Math.max(8, n * 1.5), dx = W / (n - 1), mx = maxY ?? Math.max(...podaci.map((p) => p[1]));
    const sy = visina / (mx - baza);
    const e = [{ lin: [[0, 0], [W + 0.4, 0]], b: 5, debljina: 2 }, { lin: [[0, 0], [0, visina + 0.8]], b: 5, debljina: 2 }];
    for (let y = baza; y <= mx + 1e-9; y += korakY) {
      e.push({ lin: [[-0.15, (y - baza) * sy], [W, (y - baza) * sy]], b: 5, debljina: 0.6, isp: 1 });
      e.push({ tx: String(+y.toFixed(2)).replace('.', ','), at: [-0.55, r((y - baza) * sy - 0.12)] });
    }
    const pts = podaci.map(([, v], i) => [r(i * dx), r((v - baza) * sy)]);
    e.push({ lin: pts, b: 1, debljina: 3 });
    podaci.forEach(([naziv], i) => {
      e.push({ tx: '●', at: pts[i], vel: 14, b: 2 });
      e.push({ tx: naziv, at: [pts[i][0], -0.55] });
    });
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 320 });
  };

  // brojevna prava sa tačkama podataka; istakni = indeksi tačaka; sredina = dodatna oznaka (sredina, medijana…)
  const tackeOsa = (vr, { istakni = [], sredina, oznaka = 'sredina' } = {}) => {
    const mx = Math.max(...vr, sredina ?? 0);
    const kraj = mx > 20 ? Math.ceil(mx / 10) * 10 : Math.ceil(mx) + 1;
    const velika = kraj > 20;
    const e = [{ osa: [0, kraj], podela: velika ? 5 : 1, svaki: velika ? 10 : 1 }];
    vr.forEach((v, i) => e.push({ tx: '●', at: [v, 0.45], vel: 18, b: istakni.includes(i) ? 2 : 1 }));
    if (sredina !== undefined) {
      e.push({ lin: [[sredina, -0.2], [sredina, 1.0]], b: 0, debljina: 3 });
      e.push({ tx: '~' + oznaka, at: [sredina, 1.35], vel: 15, b: 0 });
    }
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 340 });
  };

  // intervali odgovora na brojevnoj pravoj: [od, do, natpis]
  const intervali = (lista) => G({ O: [0, 0] }, [
    { osa: [0, 6], podela: 1, svaki: 1 },
    ...lista.flatMap(([a, b, t], i) => {
      const y = 1.2 + i * 0.9;
      return [{ lin: [[a, y], [b, y]], b: i, debljina: 6 }, { tx: t, at: [(a + b) / 2, y + 0.4], vel: 14, b: i }];
    }),
  ], { ...bez, velicina: 340 });

  // formula kao medij (tekst u velikim slovima)
  const formula = (tekst) => ({ vrsta: 'formula', tekst });

  // mreža tačaka (uzorak i populacija); istakni(i) – tačka i je u uzorku
  const mrezaTacaka = (redova, kolona, istakni) => {
    const e = [];
    for (let i = 0; i < redova * kolona; i++) e.push({ tx: '●', at: [r((i % kolona) * 1.1), r(Math.floor(i / kolona) * 1.1)], vel: 14, b: istakni(i) ? 2 : 4 });
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 300 });
  };
  // crtice za prebrojavanje: po pet (četiri uspravne i jedna kosa)
  const crtice = (n) => {
    const e = [];
    const grupe = Math.floor(n / 5);
    for (let g = 0; g < grupe; g++) {
      const x0 = g * 1.2;
      for (let k = 0; k < 4; k++) e.push({ lin: [[r(x0 + k * 0.3), 0], [r(x0 + k * 0.3), 2]], b: 1, debljina: 3 });
      e.push({ lin: [[r(x0 - 0.1), 0.4], [r(x0 + 0.95), 1.6]], b: 1, debljina: 3 });
    }
    for (let k = 0; k < n % 5; k++) { const x0 = grupe * 1.2 + k * 0.3; e.push({ lin: [[r(x0), 0], [r(x0), 2]], b: 1, debljina: 3 }); }
    return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 260 });
  };
  // kolona kutija sa natpisima i strelicama nadole (prazna kutija = „?“)
  const kutije = (lista) => G({ O: [0, 0] }, lista.flatMap((t, i) => {
    const y = -i * 1.5;
    return [
      { lin: [[0, y], [5, y], [5, y + 1], [0, y + 1]], b: t === '?' ? 2 : 4, debljina: 2 },
      { tx: t, at: [2.5, r(y + 0.35)], vel: 15, ...(t === '?' ? { b: 2 } : {}) },
      ...(i < lista.length - 1 ? [{ lin: [[2.5, y], [2.5, r(y - 0.5)]], b: 4, debljina: 2, str: 1 }] : []),
    ];
  }), { bezImena: ['O'], velicina: 260 });

  // ── 39. projektni zadatak; prikupljanje podataka ──
  L('Projektni zadatak; prikupljanje podataka');
  Q(1, 'Koja faza obrade podataka dolazi PRVA?',
    ['Postavljanje cilja', 'Prikupljanje podataka', 'Analiza podataka', 'Prikaz rezultata'],
    'Bez cilja ne znamo koje podatke da sakupljamo. Zato prvo tačno kažemo šta želimo da saznamo – pitanje na koje će odgovor dati obrada.', 'cilj',
    { mediji: kutije(['?', '~prikupljanje', '~priprema', '~analiza', '~prikaz']), medijiOdgovora: formula('1. cilj → 2. prikupljanje → 3. priprema → 4. analiza → 5. prikaz') });
  Q(2, 'Reč „anketa“ u srpski je stigla preko francuskog jezika. Od koje latinske reči potiče?',
    ['inquirere (istraživati)', 'respondere (odgovarati na pitanje)', 'computare (računati)', 'mensura (merenje)'],
    'Francuska reč enquête znači i istraživanje i istragu. Anketiranje je zaista istraživanje: pitamo ljude da bismo saznali nešto što ne znamo.', 'anketa',
    { medijiOdgovora: formula('enquête (fr.) → anketa (sr.)') });
  Q(1, 'Ova tabela je deo ankete. Šta predstavlja jedan RED tabele?',
    ['Jednog ispitanika', 'Jedno pitanje iz ankete', 'Jedan odgovor na jedno pitanje', 'Zbir svih podataka u tabeli'],
    'Svakom ispitaniku dodelimo jedan red. Dobro je dodati i redni broj, jer dva učenika mogu imati isto ime.', 'jedinka',
    { mediji: tabela(['Ime', 'Masa (kg)', 'Konzumacija'], [['~Ana', '51', '~retko'], ['~Branko', '50', '~često'], ['~Vanja', '49', '~retko']]) });
  Q(3, 'Anketa pita: „Koliko sati dnevno gledaš ekran?“ Ponuđeni odgovori su: „do 2 sata“, „od 2 do 4 sata“ i „više od 4 sata“. Šta je problem?',
    ['Odgovori se preklapaju', 'Ne pokrivaju jedan sat', 'Odgovor „više od 4“ je prevelik', 'Pitanje traži previše brojeva'],
    'Svaki broj treba da pripada tačno jednom odgovoru. Zato se granice pišu kao „manje od 2“, „od 2 do manje od 4“ i „4 ili više“.', 'odgovor',
    { medijiOdgovora: intervali([[0, 2, '~do 2 sata'], [2, 4, '~od 2 do 4'], [4, 6, '~više od 4']]) });
  Q(2, 'Maja je pitala drugare: „Koliko puta mesečno ideš u bioskop?“ i ponudila odgovore „često“ i „retko“. Šta fali u anketi?',
    ['Odgovor „nikad“', 'Odgovori treba da budu brojevi', 'Pitanje je prekratko', 'Drugare ne smemo da pitamo'],
    'Ponuđeni odgovori treba da pokriju sve mogućnosti i da se ne preklapaju. Tada svaki ispitanik ima tačno jedan odgovor.', 'odgovor',
    { mediji: tabela(['Koliko puta mesečno ideš u bioskop?'], [['~često'], ['~retko']], { w: 4 }) });
  Q(3, 'U tabeli jednog učenika nedostaje visina. Šta je dobra odluka, prema udžbeniku?',
    ['Izbaciti red ili proceniti podatak', 'Upisati nulu umesto nepoznatog podatka', 'Ostaviti prazno i računati dalje', 'Zameniti ga visinom prvog učenika'],
    'Nula nije „prazno mesto“: ako je upišemo umesto nepoznate visine, prosek visine će biti pogrešan. Nedostajući podatak ne smemo samo da prećutimo.', 'podatak',
    { mediji: tabela(['Ime', 'Masa (kg)', 'Visina (m)'], [['~Goran', '55', '1,55'], ['~Dača', '55', '?'], ['~Đorđe', '50', '1,60']]) });
  Q(3, 'Od 30 učenika jedne škole pitali smo ih o sportu i zaključili o svim učenicima u Srbiji. Šta je najveća slabost ovog zaključka?',
    ['Uzorak nije reprezentativan', 'Anketa je bila prekratka', 'Nismo koristili kružni dijagram', 'Učenici su premladi za anketu'],
    'Uzorak treba da liči na celinu koju proučavamo. Ako u njemu nema, recimo, učenika iz sela ili drugih krajeva, zaključci o celoj državi mogu biti pogrešni.', 'uzorak',
    { mediji: mrezaTacaka(8, 6, (i) => i % 6 < 5 && Math.floor(i / 6) < 2) });
  Q(2, 'Anketu je popunilo 150 od 200 učenika. Koliki je procenat odziva?',
    ['75%', '50%', '25%', '150%'],
    'Odziv je deo od ukupnog broja: $\\frac{150}{200} = \\frac{3}{4}$, a to je 75%. Kad se malo ljudi odazove, zaključci su manje pouzdani.', 'odziv',
    { medijiOdgovora: G(O, [...sto(75, { b: 1 })], { ...bez, velicina: 260 }) });
  Q(2, 'Koji format se najlakše učitava u program za obradu velike tabele?',
    ['.csv (odvojeno zarezima)', '.jpg (slika)', '.mp3 (zvuk)', '.pdf (dokument za štampu)'],
    'Tabela fudbalera za video-igre ima preko 17 000 redova i 100 kolona. Takvu tabelu ne bi mogao da obradiš ručno, pa se koriste programi.', 'tabela',
    { medijiOdgovora: { vrsta: 'kod', tekst: 'ime,masa,visina\nAna,51,1.59\nBranko,50,1.52' } });
  Q(2, 'U anketi piše „zaokruži jedan od ponuđenih odgovora“. Zašto?',
    ['Da svaki ispitanik ima jedan odgovor', 'Da anketa bude kraća za štampu', 'Da bi se mogla izračunati aritmetička sredina', 'Da ispitanici ne bi pisali svoje ime'],
    'Kad ispitanik može da zaokruži više odgovora, u tabeli se pojavljuju kombinacije koje je teško uporediti. Jedan odgovor po pitanju daje čistu tabelu.', 'odgovor',
    { mediji: tabela(['Koliko puta mesečno ideš u bioskop?'], [['često ✓'], ['retko ✓']], { w: 4 }) });
  Q(1, 'Koje pitanje je najjasnije i ima tačan odgovor (broj)?',
    ['Koliko sati dnevno spavaš?', 'Da li ti je san dobar?', 'Koliko ti je dobro u životu?', 'Šta misliš o spavanju?'],
    'Dobro pitanje ima odgovor koji se može upisati u tabelu. Pitanja tipa „šta misliš“ daju raznorodne odgovore koje je teško svrstati.', 'pitanje',
    { mediji: tabela(['Pitanja za anketu'], [['Koliko sati dnevno spavaš?'], ['Da li ti je san dobar?'], ['Koliko ti je dobro u životu?'], ['Šta misliš o spavanju?']], { w: 5 }) });
  Q(2, 'Ana je anketirala 20 učenika. Njih 5 nosi naočare. Koliki je procenat učenika sa naočarima?',
    ['25%', '5%', '20%', '50%'],
    'Deo je $\\frac{5}{20} = \\frac{1}{4}$ celine, a četvrtina je 25%. Procenat dobijamo tako što deo podelimo celinom i pomnožimo sa 100.', 'procenat',
    { mediji: mrezaTacaka(4, 5, (i) => i < 5), medijiOdgovora: G(O, [...sto(25, { b: 1 })], { ...bez, velicina: 260 }) });

  Q(1, 'Anketari su glasove za košarku zapisali crticama. Koliko je glasova za košarku?',
    ['7', '6', '8', '5'],
    'Crtice se grupišu po pet: četiri uspravne i jedna kosa. Jedna grupa ima pet, a uz nju su još dve crtice: ukupno 7.', 'crtice',
    { mediji: crtice(7) });
  U(1, 'Koja od ovih stvari NIJE faza obrade podataka?',
    ['Slanje poruke drugu', 'Postavljanje cilja', 'Prikupljanje podataka', 'Prikaz rezultata'],
    'Obrada podataka ima pet faza: cilj, prikupljanje, priprema, analiza i prikaz. Slanje poruke nije među njima.', 'Pet faza važi za svaku anketu, ali i za velika istraživanja sa računarom.', 'faza');
  S(2, 'Spoji fazu obrade sa primerom',
    [['Prikupljanje podataka', 'anketa među drugarima'], ['Priprema podataka', 'provera da li su visine u centimetrima'], ['Analiza podataka', 'računanje srednje vrednosti'], ['Prikaz podataka', 'stubičasti dijagram']],
    'Projektni zadatak prolazi kroz sve faze redom, a svaka sledeća zavisi od prethodne.', 'analiza');

  // ── 40. statistička obeležja podataka ──
  L('Statistička obeležja podataka');
  Q(1, 'Ocene na testu su: 2, 4, 5 i 9. Kolika je aritmetička sredina?',
    ['5', '4,5', '4', '6'],
    'Saberemo sve ocene (2 + 4 + 5 + 9 = 20) i podelimo brojem ocena: 20 : 4 = 5. Sredina ne mora biti jedan od podataka: sredina brojeva 2 i 3 je 2,5.', 'sredina',
    { mediji: tackeOsa([2, 4, 5, 9]), medijiOdgovora: tackeOsa([2, 4, 5, 9], { sredina: 5 }) });
  Q(2, 'Stubičasti dijagram pokazuje koliko je učenika dobilo koju ocenu. Koja ocena je mod?',
    ['3', '5', '4', '2'],
    'Mod je VREDNOST koja se najčešće pojavljuje, a ne broj učenika. Najviši stubić je kod ocene 3 (5 učenika), pa je mod ocena 3.', 'mod',
    { mediji: stubiciY([['2', 1], ['3', 5], ['4', 3], ['5', 4]], { vrednosti: true }) });
  Q(1, 'Pet brojeva: 7, 1, 4, 10 i 3. Kolika je medijana?',
    ['4', '5', '7', '3'],
    'Medijana je srednji podatak kad poređamo brojeve po veličini: 1, 3, 4, 7, 10. Ispred 4 i iza 4 ima po dva broja. Aritmetička sredina ovde je 5, ali medijana je 4.', 'medijana',
    { mediji: tackeOsa([7, 1, 4, 10, 3]), medijiOdgovora: tackeOsa([1, 3, 4, 7, 10], { istakni: [2], sredina: 4, oznaka: 'medijana' }) });
  Q(2, 'Četiri broja su: 3, 8, 5 i 10. Kolika je medijana?',
    ['6,5', '5,5', '8', '7'],
    'Poređamo: 3, 5, 8, 10. Kad je podataka paran broj, medijana je sredina dva srednja: (5 + 8) : 2 = 6,5. Medijana ne mora biti jedan od podataka.', 'medijana',
    { mediji: tackeOsa([3, 8, 5, 10]), medijiOdgovora: tackeOsa([3, 5, 8, 10], { istakni: [1, 2], sredina: 6.5, oznaka: 'medijana' }) });
  Q(3, 'Tri ocene imaju aritmetičku sredinu 4. Ako svaku ocenu uvećamo za 3, kolika je nova aritmetička sredina?',
    ['7', '4', '12', '6'],
    'Kad svaki podatak uvećamo za isti broj, i aritmetička sredina se uveća za taj broj: 4 + 3 = 7. Kad sve pomnožimo nekim brojem, i sredina se pomnoži tim brojem.', 'uvećanje',
    { medijiOdgovora: formula('sredina + 3 = 4 + 3 = 7') });
  Q(2, 'Koji je mod brojeva 1, 2, 2, 6, 9 i 10?',
    ['2', '4', '5', '6'],
    'Mod je broj koji se najčešće pojavljuje: broj 2 je tu dva puta, a ostali po jednom. Medijana je 4, a aritmetička sredina 5. To su druge mere, ne mod.', 'mod',
    { medijiOdgovora: tackeOsa([1, 2, 2, 6, 9, 10], { istakni: [1, 2] }) });
  Q(3, 'Koji su modovi brojeva 2, 3, 3, 5, 5 i 8?',
    ['3 i 5', '3', '5 i 8', '2 i 3'],
    'Skup može imati dva moda: i 3 i 5 se pojavljuju po dva puta, više od ostalih brojeva. Ako se svi podaci pojavljuju po jednom, mod ne postoji.', 'modovi');
  Q(2, 'Ana ima 4 petice i 1 trojku. Kolika joj je prosečna ocena?',
    ['4,6', '4,5', '4,2', '4,8'],
    'Zbir svih ocena je 4 · 5 + 3 = 23, pa je prosek 23 : 5 = 4,6. Greška je računati (5 + 3) : 2 = 4, jer petica ima više puta.', 'prosek',
    { mediji: stubiciY([['3', 1], ['5', 4]], { vrednosti: true }), medijiOdgovora: formula('(4 · 5 + 1 · 3) : 5 = 23 : 5 = 4,6') });
  Q(3, 'Stubičasti dijagram prikazuje visinu dvoje učenika. Koliko puta je viši Branko (160 cm) od Ane (150 cm)?',
    ['1,07 puta', 'oko 3 puta', 'oko 2 puta', 'oko 1,5 puta'],
    'Razlika je 10 cm, što je tek oko 7% više. Osa na crtežu počinje od 145 cm, pa razlika izgleda tri puta veća. Uvek gledaj gde osa počinje.', 'varljivost',
    { mediji: stubiciY([['~Ana', 150], ['~Branko', 160]], { baza: 145, maxY: 160, korakY: 5 }),
      medijiOdgovora: stubiciY([['~Ana', 150], ['~Branko', 160]], { maxY: 160, korakY: 40, vrednosti: true }) });
  Q(2, 'Grafikon prikazuje temperaturu u sedam dana. Kolika je medijana temperatura?',
    ['15', '14', '17', '12'],
    'Poređamo temperature: 9, 12, 14, 15, 17, 18, 20. Srednja je 15 (po tri temperature manje i veće). Da je najtopliji dan bio 30 stepeni, medijana bi ostala 15.', 'stepeni',
    { mediji: linijski([['~Pon', 12], ['~Uto', 15], ['~Sre', 9], ['~Čet', 14], ['~Pet', 18], ['~Sub', 20], ['~Ned', 17]], { maxY: 20, korakY: 5 }) });
  Q(3, 'Tri broja imaju aritmetičku sredinu 6. Dva od njih su 4 i 7. Koji je treći broj?',
    ['7', '5', '6', '8'],
    'Zbir sva tri broja je 3 · 6 = 18. Od toga oduzmemo 4 i 7: 18 − 11 = 7. Treći broj je 7.', 'zbir',
    { medijiOdgovora: formula('3 · 6 = 18; 18 − 4 − 7 = 7') });
  Q(2, 'Šest brojeva: 1, 2, 3, 4, 5 i 10. Kolika je medijana?',
    ['3,5', '4,17', '4', '3'],
    'Srednja dva su 3 i 4, pa je medijana (3 + 4) : 2 = 3,5. Aritmetička sredina bi bila 4,17 zbog broja 10, a medijana to i ne oseti.', 'medijana',
    { mediji: tackeOsa([1, 2, 3, 4, 5, 10]), medijiOdgovora: tackeOsa([1, 2, 3, 4, 5, 10], { istakni: [2, 3], sredina: 3.5, oznaka: 'medijana' }) });
  Q(1, 'Deset đaka nosi plavu majicu, troje belu, petoro šarenu i jedan roze. Koja boja majice je mod?',
    ['Plava', 'Šarena', 'Bela', 'Roze'],
    'Mod je ono što se najčešće pojavljuje, pa se računa i za nenumeričke podatke, kao boje. Za boje ne možemo da računamo srednju vrednost ni medijanu.', 'mod',
    { mediji: stubiciY([['~plava', 10], ['~bela', 3], ['~šarena', 5], ['~roze', 1]], { vrednosti: true }) });
  U(1, 'Koja od ovih stvari NIJE statističko obeležje podataka?',
    ['Ugao od 90 stepeni', 'Medijana', 'Aritmetička sredina', 'Mod'],
    'Aritmetička sredina, medijana i mod jednim brojem opisuju skup podataka. Ugao od 90 stepeni je pojam iz geometrije.', 'Mod može da se odredi i za nenumeričke podatke, npr. za boje majica.', 'obeležje');
  S(2, 'Spoji obeležje sa njegovim opisom',
    [['Aritmetička sredina', 'zbir podeljen brojem podataka'], ['Medijana', 'broj u sredini poređanih podataka'], ['Mod', 'najčešća vrednost'], ['Medijana parnog broja', 'sredina dva srednja podatka']],
    'Za paran broj podataka medijana je sredina dva srednja, zato može biti i broj koji nije među podacima.', 'obeležje');

  // ── 41. priprema, analiza i prezentacija podataka ──
  L('Priprema, analiza i prezentacija podataka');
  Q(3, 'Koja kolona u tabeli sadrži NENUMERIČKE podatke (kategorije)?',
    ['Konzumacija', 'Masa u kilogramima', 'Redni broj ispitanika', 'Visina u metrima'],
    'Podaci kao što su „retko“ i „često“ ne mogu da se saberu, pa ni srednja vrednost nema smisla. Zovemo ih kategorijski ili nenumerički podaci.', 'kategorija',
    { mediji: tabela(['Redni broj', 'Masa (kg)', 'Visina (m)', 'Konzumacija'], [['1', '51', '1,59', '~retko'], ['2', '50', '1,52', '~često'], ['3', '49', '1,59', '~retko']], { w: 3, velicina: 460 }) });
  U(1, 'Koji od ovih prikaza NE pokazuje delove jedne celine?',
    ['Linijski dijagram', 'Kružni dijagram', 'Traka podeljena na jednake delove', 'Mreža sa 100 polja'],
    'Linijski dijagram pokazuje promenu kroz vreme. Kružni dijagram, traka i mreža dele celinu na delove.', 'Kružni dijagram je najpoznatiji za udele, a traka i mreža su njegovi ekvivalenti.', 'dijagram');
  S(1, 'Spoji vrstu dijagrama sa onim što najbolje pokazuje',
    [['Kružni dijagram', 'udeo delova u celini'], ['Stubičasti dijagram', 'poređenje količina'], ['Linijski dijagram', 'promena kroz vreme'], ['Tabela', 'tačne vrednosti po ispitanicima']],
    'Dijagram treba da odgovara onome što želimo da kažemo: za delove celine kružni, za promenu tokom vremena linijski.', 'dijagram');
  Q(1, 'Koji dijagram je najbolji za prikaz delova jedne celine, npr. koliki deo učenika trenira koji sport?',
    ['Kružni dijagram', 'Linijski dijagram', 'Stubičasti dijagram', 'Brojevna prava'],
    'Kružni dijagram deli krug na isečke: što je veći isečak, to je veći udeo u celini. Svi isečci zajedno čine 100%.', 'kruzni',
    { medijiOdgovora: kruzni([['~fudbal 14', 14], ['~košarka 12', 12], ['~odbojka 8', 8], ['~plivanje 3', 3]]) });
  Q(2, 'Kružni dijagram ima isečak za košarku koji je 25% celog kruga. Koliki je njegov centralni ugao?',
    ['90°', '25°', '45°', '250°'],
    'Ceo krug ima 360°, a 25% je četvrtina: 360° : 4 = 90°. Zato je jedan procenat 3,6°.', 'ugao',
    { mediji: kruzni([['~fudbal 40%', 40], ['~košarka 25%', 25], ['~odbojka 20%', 20], ['~ostalo 15%', 15]]) });
  Q(1, 'Kružni dijagram ima tri jednaka isečka. Koliki udeo ima jedan isečak?',
    ['Trećina (oko 33%)', 'Četvrtina (tačno 25%)', 'Polovina (tačno 50%)', 'Petina (tačno 20%)'],
    'Tri jednaka dela čine celinu, pa je svaki trećina: 1 : 3 ≈ 0,33, odnosno oko 33%.', 'trećina',
    { mediji: kruzni([['', 1], ['', 1], ['', 1]], { natpisi: false }) });
  Q(1, 'Kružni dijagram ima isečke: 40%, 25%, 20% i jedan nepoznat isečak. Koliki je nepoznati udeo?',
    ['15%', '10%', '35%', '20%'],
    'Svi isečci zajedno čine 100%. Zbir poznatih je 40 + 25 + 20 = 85, pa je ostalo 100 − 85 = 15%.', 'ostatak',
    { medijiOdgovora: kruzni([['~40%', 40], ['~25%', 25], ['~20%', 20], ['~15%', 15]]) });
  Q(2, 'Stubičasti dijagram prikazuje koliko od 30 učenika trenira koji sport. Koji procenat trenira košarku?',
    ['30%', '9%', '33%', '3%'],
    'Košarku trenira 9 od 30 učenika. Procenat je $\\frac{9}{30}$ = 0,3 = 30%.', 'procenat',
    { mediji: stubiciY([['~fudbal', 12], ['~košarka', 9], ['~odbojka', 6], ['~ostalo', 3]], { vrednosti: true, maxY: 12 }) });
  Q(2, 'Ovaj dijagram je nacrtan bez naslova i oznaka. Šta mu fali da bi bio dobar?',
    ['Naslov i nazivi osa', 'Još boja u stubićima', 'Veći broj stubića', 'Deblje ivice stubića'],
    'Dobar dijagram se čita bez dodatnog objašnjenja: treba da ima naslov, nazive osa i jedinice (npr. kg ili cm). Boje i debljina linija nisu bitne za sadržaj.', 'naslov',
    { mediji: stubiciY([['', 3], ['', 5], ['', 2], ['', 6]], { bezNatpisa: true }) });
  Q(1, 'Koji dijagram je najbolji za poređenje visine učenika (npr. Ana 159 cm, Branko 152 cm)?',
    ['Stubičasti dijagram', 'Kružni dijagram sa isečcima', 'Linijski grafik kroz vreme', 'Mreža od kvadrata'],
    'Stubići lako pokazuju koja vrednost je veća. Kružni je za delove celine, a linijski za promenu kroz vreme.', 'stubici');
  Q(2, 'Prodaja sladoleda po mesecima (u komadima): januar 20, februar 25, mart 40, april 35, maj 45, jun 55. U kom mesecu je prodaja porasla NAJVIŠE u odnosu na prethodni?',
    ['Mart', 'Februar', 'Maj', 'April'],
    'Porasti: februar +5, mart +15, april −5, maj +10, jun +10. Najveći skok je u martu (+15), što se na grafikonu vidi kao najstrmiji uspon.', 'grafik',
    { mediji: linijski([['~jan', 20], ['~feb', 25], ['~mar', 40], ['~apr', 35], ['~maj', 45], ['~jun', 55]], { maxY: 60, korakY: 10 }) });
  Q(3, 'U obe grupe (muškarci i žene) prva bolnica ima bolji procenat izlečenih. Ipak, ukupno je druga bolnica uspešnija (81% prema 78%). Koje objašnjenje je tačno?',
    ['Prva bolnica je primila više žena, a žene se leče slabije', 'Podaci su pogrešno sabrani, pa je ukupni procenat netačan', 'Druga bolnica je bolja kod žena, pa je ukupno bolja i sa njima', 'Muškarci su se u prvoj bolnici lečili duže nego u drugoj'],
    'Ovo je Simpsonov paradoks. Ukupan procenat zavisi od toga koliko kog dela pacijenata ima u svakoj bolnici. Zato uvek pitaj kako su podaci sastavljeni.', 'paradoks',
    { mediji: tabela(['', 'Prva bolnica', 'Druga bolnica'], [['~Broj žena', '260', '75'], ['~Izlečenih žena', '73%', '67%'], ['~Broj muškaraca', '100', '270'], ['~Izlečenih muškaraca', '90%', '85%'], ['~Ukupno izlečenih', '78%', '81%']], { w: [4.6, 3.1, 3.1], velicina: 460 }) });
  Q(1, 'U odeljenju ima 30 učenika, a 40% njih voli plivanje. Koliko učenika voli plivanje?',
    ['12', '10', '4', '40'],
    '40% od 30 je 0,4 · 30 = 12. Procenat je deo od sto, pa se 40 od 100 primenjuje na celinu od 30 učenika.', 'procenat',
    { mediji: G(O, [...sto(40, { b: 1 })], { ...bez, velicina: 260 }) });
  Q(3, 'Koliko je 14 od 37 učenika kao procenat, zaokruženo na ceo broj?',
    ['38%', '37%', '40%', '35%'],
    'Računamo $\\frac{14}{37}$ ≈ 0,378, pa je 38%. Kružni dijagram pokazuje isto, samo sa brojevima umesto procenata.', 'procenat',
    { mediji: kruzni([['~fudbal 14', 14], ['~košarka 12', 12], ['~odbojka 8', 8], ['~plivanje 3', 3]]),
      medijiOdgovora: kruzni([['~fudbal 38%', 14], ['~košarka 32%', 12], ['~odbojka 22%', 8], ['~plivanje 8%', 3]]) });
  Q(3, 'U anketi 70% učenika koji imaju psa i 65% onih koji nemaju psa kažu da su srećni. Šta možemo sigurno da zaključimo?',
    ['Razlika je mala, pa zaključak nije pouzdan', 'Pas sigurno čini čoveka srećnijim od svih ostalih', 'Učenici bez psa su sigurno nesrećni i sami', 'Anketa je pogrešna jer ima procenata u sebi'],
    'Razlika od 5 procentnih poena je mala, a uzorak je mali. Pre zaključka treba proveriti da li je razlika zaista veća od slučajne. Dijagram ne sme da nas zavede.', 'zaključak',
    { mediji: stubiciY([['~sa psom', 70], ['~bez psa', 65]], { maxY: 100, korakY: 20, vrednosti: true }) });
};
