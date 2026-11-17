// Lekcije 32–43: računanje sa razlomcima i decimalnim brojevima (pravila i laki primeri, bez papira).
module.exports = ({ L, Q, U, S, G, r, traka, pica, sto, O, bez, dec }) => {

  // tri trake jedna ispod druge (sabiranje/oduzimanje razlomaka)
  const triTrake = (n, m1, m2, m3, { o1 = '', o2 = '', o3 = '' } = {}) =>
    G(O, [...traka(n, m1, { y: 0 }), ...traka(n, m2, { y: -2, b: 2 }), ...traka(n, m3, { y: -4, b: 3 }),
      ...(o1 ? [{ tx: o1, at: [9.5, 0.6], vel: 15, b: 1 }] : []), ...(o2 ? [{ tx: o2, at: [9.5, -1.6], vel: 15, b: 2 }] : []), ...(o3 ? [{ tx: o3, at: [9.5, -3.7], vel: 15, b: 3 }] : [])], { ...bez, velicina: 320 });
  // mreža q×s (množenje razlomaka p/q · r/s), obojeno p redova × r kolona
  const mrezaMnozenja = (q, s, p, r1) => {
    const W = 6, H = 4;
    const e = [];
    for (let i = 0; i < q; i++) for (let j = 0; j < s; j++) {
      const x0 = (j * W) / s, x1 = ((j + 1) * W) / s, y0 = (i * H) / q, y1 = ((i + 1) * H) / q;
      const ob = i < p && j < r1;
      e.push({ lin: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map((p1) => p1.map(r)), zatv: 1, b: ob ? 1 : 4, ...(ob ? { gusto: 1 } : { prazno: 1 }) });
    }
    return G(O, e, { ...bez, velicina: 240 });
  };
  // tačka na brojevnoj pravoj (za jednačine i nejednačine)
  const tackaNaPravoj = (x, oznaka, { od = 0, doo, b = 1 } = {}) =>
    G(O, [{ osa: [od, doo ?? x + 1], podela: 1, svaki: 1 }, { lin: [[x, -0.06], [x, 0.06]], b, debljina: 4 }, { tx: oznaka, at: [x, 0.3], vel: 14, b }], { ...bez, velicina: 300 });

  // ── 32. sabiranje i oduzimanje razlomaka ──
  L('Sabiranje i oduzimanje razlomaka');
  Q(1, 'Kako sabiraš razlomke sa ISTIM imeniocem?',
    ['Sabereš brojioce, a imenilac ostaje isti', 'Sabereš i brojioce i imenioce', 'Pomnožiš brojioce', 'Oduzmeš imenioce'],
    'Kad su imenioci isti, samo sabereš brojioce: $\\frac{1}{5}+\\frac{2}{5}=\\frac{3}{5}$. Imenilac se ne menja.', 'sabiranje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{a}{c}+\\frac{b}{c}=\\frac{a+b}{c}$' } });
  Q(1, 'Koliko je $\\frac{1}{5} + \\frac{2}{5}$?',
    ['$\\frac{3}{5}$', '$\\frac{3}{10}$', '$\\frac{2}{5}$', '$\\frac{5}{5}$'],
    'Isti imenilac, pa sabiramo brojioce: $1+2=3$, a imenilac ostaje 5. Rezultat je $\\frac{3}{5}$.', 'sabiranje',
    { medijiOdgovora: triTrake(5, 1, 2, 3, { o1: '1/5', o2: '2/5', o3: '3/5' }) });
  Q(1, 'Koliko je $\\frac{3}{7} - \\frac{1}{7}$?',
    ['$\\frac{2}{7}$', '$\\frac{4}{7}$', '$\\frac{2}{14}$', '$\\frac{3}{7}$'],
    'Oduzimamo brojioce: $3-1=2$, imenilac ostaje 7. Rezultat je $\\frac{2}{7}$.', 'oduzimanje',
    { medijiOdgovora: triTrake(7, 3, 1, 2, { o1: '3/7', o2: '− 1/7', o3: '2/7' }) });
  Q(2, 'Šta prvo moraš da uradiš da bi sabrao razlomke sa RAZLIČITIM imeniocima?',
    ['Svedeš ih na zajednički imenilac', 'Sabereš imenioce', 'Pomnožiš brojioce', 'Oduzmeš imenioce'],
    'Razlomci sa različitim imeniocima prvo se prošire tako da imaju isti imenilac (najbolje NZS), pa se tek onda saberu.', 'imenilac',
    { medijiOdgovora: triTrake(6, 3, 2, 5, { o1: '3/6', o2: '2/6', o3: '5/6' }) });
  Q(2, 'Koji je zajednički imenilac za $\\frac{1}{2}$ i $\\frac{1}{3}$?',
    ['6', '5', '2', '3'],
    'Najmanji zajednički sadržalac brojeva 2 i 3 je 6. Zato $\\frac{1}{2}=\\frac{3}{6}$, a $\\frac{1}{3}=\\frac{2}{6}$.', 'imenilac',
    { medijiOdgovora: G(O, [...traka(2, 1, { y: 0 }), ...traka(3, 1, { y: -2, b: 2 }), ...traka(6, 3, { y: -4, b: 3 }), ...traka(6, 2, { y: -6, b: 4 })], { ...bez, velicina: 320 }) });
  Q(3, 'Koliko je $\\frac{1}{2} + \\frac{1}{4}$?',
    ['$\\frac{3}{4}$', '$\\frac{2}{6}$', '$\\frac{1}{4}$', '$\\frac{2}{4}$'],
    '$\\frac{1}{2}=\\frac{2}{4}$, pa je $\\frac{2}{4}+\\frac{1}{4}=\\frac{3}{4}$. Polovina i četvrtina zajedno su tri četvrtine.', 'sabiranje',
    { mediji: G(O, [...traka(4, 2, { y: 0 }), ...traka(4, 1, { y: -2, b: 2 })], { ...bez, velicina: 320 }) });

  // ── 33. sabiranje i oduzimanje decimalnih brojeva ──
  L('Sabiranje i oduzimanje decimalnih brojeva');
  Q(1, 'Kako pravilno potpisuješ decimalne brojeve pri sabiranju?',
    ['Zarez ispod zareza', 'Prvi broj ispod drugog', 'Kako god', 'Cifru ispod cifre sleva'],
    'Pri potpisivanju decimalnih brojeva, decimalni zarezi moraju biti tačno jedan ispod drugog – tako se saberu desetinke sa desetinkama, stotinke sa stotinkama…', 'decimala',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$0,\\!3+0,\\!4=0,\\!7$' } });
  Q(1, 'Koliko je $0,\\!3 + 0,\\!4$?',
    ['$0,\\!7$', '$0,\\!07$', '$0,\\!34$', '$7$'],
    'Tri desetinke plus četiri desetinke je sedam desetinki: $0,\\!3+0,\\!4=0,\\!7$.', 'sabiranje',
    { medijiOdgovora: triTrake(10, 3, 4, 7, { o1: '0,3', o2: '0,4', o3: '0,7' }) });
  Q(2, 'Koliko je $0,\\!8 - 0,\\!25$?',
    ['$0,\\!55$', '$0,\\!5$', '$0,\\!65$', '$0,\\!75$'],
    'Dopišemo nulu: $0,\\!80 - 0,\\!25 = 0,\\!55$. Zarez ostaje na istom mestu.', 'oduzimanje',
    { medijiOdgovora: G(O, [...sto(55), { tx: '0,55', at: [3, 7.3], vel: 16, b: 1 }], { ...bez, velicina: 260 }) });
  Q(2, 'Zašto pri oduzimanju decimala ponekad dopisujemo nule?',
    ['Da bi brojevi imali isti broj decimala', 'Da bi broj bio veći', 'Da bi zarez nestao', 'Nule se nikad ne dopisuju'],
    'Dopisivanjem nula na kraju decimalnog broja ne menja se njegova vrednost, a lakše je oduzimati: $0,\\!8=0,\\!80$.', 'decimala',
    { medijiOdgovora: G(O, [...traka(10, 8, { y: 0 }), ...traka(100, 80, { y: -2, b: 2 }), { tx: '0,8', at: [10.5, 0.6], vel: 15, b: 1 }, { tx: '0,80', at: [10.5, -1.6], vel: 15, b: 2 }], { ...bez, velicina: 320 }) });
  Q(3, 'Koliko je $1 - 0,\\!37$?',
    ['$0,\\!63$', '$0,\\!73$', '$0,\\!37$', '$1,\\!37$'],
    'Zapišemo $1$ kao $1,\\!00$, pa oduzmemo: $1,\\!00-0,\\!37=0,\\!63$.', 'oduzimanje',
    { medijiOdgovora: G(O, [...sto(63), { tx: '0,63', at: [3, 7.3], vel: 16, b: 1 }], { ...bez, velicina: 260 }) });

  // ── 34. svojstva i brojevni izrazi ──
  L('Svojstva sabiranja i oduzimanja; brojevni izrazi');
  Q(1, 'U brojevnom izrazu, šta se računa PRVO?',
    ['Operacije u zagradama', 'Sabiranje i oduzimanje', 'Množenje i deljenje', 'Sleva nadesno uvek'],
    'Prvo se računa ono što je u zagradama, zatim množenje i deljenje, pa tek onda sabiranje i oduzimanje.', 'zagrada',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(2+3)\\cdot4=20$' } });
  Q(2, 'U izrazu $6 + 4 \\cdot 3$, šta računaš prvo?',
    ['Množenje $4\\cdot3$', 'Sabiranje $6+4$', 'Zagrade', 'Oduzimanje'],
    'Množenje ima prednost nad sabiranjem: $6+4\\cdot3=6+12=18$.', 'redosled',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$6+4\\cdot3=6+12=18$' } });
  Q(2, 'Koje svojstvo važi i za sabiranje razlomaka?',
    ['Komutativnost i asocijativnost', 'Samo komutativnost', 'Samo distributivnost', 'Nijedno'],
    'Sabiranje razlomaka je komutativno i asocijativno, kao i sabiranje prirodnih brojeva: $\\frac{a}{b}+\\frac{c}{d}=\\frac{c}{d}+\\frac{a}{b}$.', 'svojstvo',
    { mediji: G(O, [...traka(5, 2, { y: 0 }), ...traka(5, 3, { y: -2, b: 2 }), ...traka(5, 5, { y: -4, b: 3 })], { ...bez, velicina: 320 }) });
  Q(3, 'Koliko je $12 - 3 \\cdot 2 + 4$?',
    ['10', '22', '18', '6'],
    'Prvo množenje: $3\\cdot2=6$, pa $12-6=6$, pa $6+4=10$. Računanje redom sleva nadesno daje 22, a to je greška – množenje ide pre sabiranja i oduzimanja.', 'redosled',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$12-3\\cdot2+4=10$' } });
  Q(3, 'Kako se zove izraz sastavljen od brojeva i znakova računskih operacija?',
    ['Brojevni izraz', 'Jednačina', 'Nejednačina', 'Formula'],
    'Brojevni izraz sadrži brojeve i znakove operacija, na primer $3+4\\cdot2$. Kad dodamo znak jednakosti i nepoznatu, dobijamo jednačinu.', 'izraz',
    { mediji: { vrsta: 'formula', tekst: '$3+4\\cdot2=11$' } });

  // ── 35. jednačine sa sabiranjem i oduzimanjem ──
  L('Jednačine sa sabiranjem i oduzimanjem razlomaka');
  Q(1, 'Šta je jednačina?',
    ['Jednakost u kojoj je nepoznat broj označen slovom', 'Brojevni izraz bez slova', 'Nejednakost dva broja', 'Pravilo za računanje'],
    'Jednačina je jednakost sa nepoznatom, obično označenom slovom $x$. Rešiti jednačinu znači naći broj koji je čini tačnom.', 'jednačina',
    { mediji: { vrsta: 'formula', tekst: '$x+3=7$' } });
  Q(1, 'Kako nalaziš nepoznati sabirak?',
    ['Od zbira oduzmeš poznati sabirak', 'Zbiru dodaš poznati sabirak', 'Pomnožiš sabirke', 'Podeliš zbir sabirkom'],
    'Ako je $x + 3 = 7$, onda je $x = 7 - 3 = 4$. Nepoznati sabirak je zbir minus poznati sabirak.', 'jednačina',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$x+3=7 \\Rightarrow x=7-3=4$' } });
  Q(2, 'Koji broj je rešenje jednačine $x + 3 = 7$?',
    ['4', '3', '7', '10'],
    '$x = 7 - 3 = 4$. Provera: $4 + 3 = 7$ – tačno!', 'jednačina',
    { medijiOdgovora: tackaNaPravoj(4, 'x = 4', { od: 0, doo: 8 }) });
  Q(2, 'Kako nalaziš nepoznati umanjenik u jednačini $x - 5 = 9$?',
    ['Sabereš razliku i umanjilac', 'Oduzmeš razliku od umanjioca', 'Podeliš razliku sa 5', 'Pomnožiš razliku i umanjilac'],
    'Umanjenik je broj od kog oduzimamo. Nalazimo ga tako što razliku saberemo sa umanjiocem: $x = 9 + 5 = 14$.', 'jednačina',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$x-5=9 \\Rightarrow x=14$' } });
  Q(3, 'Koji broj je rešenje jednačine $x + \\frac{1}{2} = 1$?',
    ['$\\frac{1}{2}$', '$\\frac{3}{2}$', '$1$', '$\\frac{1}{4}$'],
    '$x = 1 - \\frac{1}{2} = \\frac{1}{2}$. Polovina plus polovina daje celo.', 'jednačina',
    { medijiOdgovora: G(O, [...traka(2, 1, { y: 0 }), ...traka(2, 1, { y: -2, b: 2 }), { tx: '1/2', at: [9.5, 0.6], vel: 15, b: 1 }, { tx: '1/2', at: [9.5, -1.6], vel: 15, b: 2 }], { ...bez, velicina: 320 }) });

  // ── 36. nejednačine sa sabiranjem i oduzimanjem ──
  L('Nejednačine sa sabiranjem i oduzimanjem razlomaka');
  Q(1, 'Šta je nejednačina?',
    ['Nejednakost u kojoj je nepoznat broj označen slovom', 'Jednakost sa slovom', 'Brojevni izraz', 'Pravilo za crtanje'],
    'Nejednačina koristi znakove $>$, $<$, $\\ge$ ili $\\le$. Rešenje je obično čitav skup brojeva, ne samo jedan broj.', 'nejednačina',
    { mediji: { vrsta: 'formula', tekst: '$x<5$' } });
  Q(1, 'Šta znači znak $<$?',
    ['Manje', 'Veće', 'Jednako', 'Približno'],
    'Znak $<$ čitamo „manje je“: $3 < 5$ znači da je 3 manje od 5. Oštar vrh uvek pokazuje ka manjem broju.', 'znak',
    { mediji: tackaNaPravoj(3, '3', { od: 0, doo: 6, b: 1 }) });
  Q(2, 'Rešenja nejednačine $x < 5$ su svi brojevi…',
    ['manji od 5', 'veći od 5', 'jednaki 5', 'veći ili jednaki 5'],
    'Nejednačinu $x<5$ zadovoljavaju svi brojevi manji od 5: $4, 3, 2, \\dots$ ali ne i sam broj 5.', 'nejednačina',
    { medijiOdgovora: G(O, [{ osa: [0, 6], podela: 1, svaki: 1 }, { kr: 'g', r: 0.18, b: 1, prazno: 1 }, { lin: [[5, -0.4], [0, -0.4]], b: 1, debljina: 3, str: 1 }, { tx: '5', at: [5, 0.3], vel: 14 }], { ...bez, t: { O: [0, 0], g: [5, 0] }, velicina: 300 }) });
  Q(2, 'Koji broj zadovoljava nejednačinu $x + 2 > 5$?',
    ['4', '3', '2', '1'],
    '$4+2=6$, a $6>5$ – tačno. Broj 3 bi dao $3+2=5$, a to nije veće od 5.', 'nejednačina',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$x+2>5 \\Rightarrow x>3$' } });
  Q(3, 'Koja nejednačina znači: broj $x$ je manji ili jednak 7?',
    ['$x \\le 7$', '$x < 7$', '$x \\ge 7$', '$x = 7$'],
    'Znak $\\le$ znači „manje ili jednako“, pa $x \\le 7$ uključuje i sam broj 7.', 'nejednačina',
    { medijiOdgovora: G(O, [{ osa: [0, 8], podela: 1, svaki: 1 }, { tacka: 'g', b: 1 }, { lin: [[7, -0.4], [0, -0.4]], b: 1, debljina: 3, str: 1 }, { tx: '7', at: [7, 0.3], vel: 14 }], { ...bez, t: { O: [0, 0], g: [7, 0] }, velicina: 300 }) });

  // ── 37. množenje razlomaka ──
  L('Množenje razlomaka');
  Q(1, 'Kako množiš dva razlomka?',
    ['Brojilac sa brojiocem, imenilac sa imeniocem', 'Sabereš brojioce i imenioce', 'Pomnožiš unakrsno pa sabereš', 'Oduzmeš imenioce'],
    'Množenje razlomaka: $\\frac{a}{b}\\cdot\\frac{c}{d}=\\frac{a\\cdot c}{b\\cdot d}$. Brojioci se množe međusobno, imenioci takođe.', 'množenje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{a}{b}\\cdot\\frac{c}{d}=\\frac{a\\cdot c}{b\\cdot d}$' } });
  Q(1, 'Koliko je $\\frac{1}{2} \\cdot \\frac{1}{3}$?',
    ['$\\frac{1}{6}$', '$\\frac{2}{5}$', '$\\frac{1}{5}$', '$\\frac{3}{2}$'],
    'Množimo brojioce: $1\\cdot1=1$, i imenioce: $2\\cdot3=6$. Polovina trećine je šestina.', 'množenje',
    { medijiOdgovora: mrezaMnozenja(2, 3, 1, 1) });
  Q(2, 'Koliko je $\\frac{2}{3} \\cdot \\frac{3}{4}$?',
    ['$\\frac{1}{2}$', '$\\frac{6}{7}$', '$\\frac{5}{12}$', '$\\frac{1}{3}$'],
    '$\\frac{2}{3}\\cdot\\frac{3}{4}=\\frac{6}{12}$, a to se skrati na $\\frac{1}{2}$. Pre množenja možeš skratiti 3 sa 3 i 2 sa 4.', 'množenje',
    { medijiOdgovora: mrezaMnozenja(3, 4, 2, 3) });
  Q(2, 'Kako množiš razlomak celim brojem, na primer $2 \\cdot \\frac{3}{5}$?',
    ['Celi broj pomnožiš samo brojiocem', 'Celi broj pomnožiš i brojiocem i imeniocem', 'Dodaš celi broj imeniocu', 'Oduzmeš celi broj'],
    'Celi broj napišemo kao $\\frac{2}{1}$, pa množimo: $\\frac{2}{1}\\cdot\\frac{3}{5}=\\frac{6}{5}$. Dakle, samo se brojilac množi.', 'množenje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$2\\cdot\\frac{3}{5}=\\frac{2\\cdot3}{5}=\\frac{6}{5}$' } });
  Q(3, 'Koliko je $2 \\cdot \\frac{3}{5}$?',
    ['$\\frac{6}{5}$', '$\\frac{5}{5}$', '$\\frac{6}{10}$', '$\\frac{3}{5}$'],
    '$2\\cdot\\frac{3}{5}=\\frac{6}{5}$. To je više od jedne celine: $\\frac{6}{5}=1\\frac{1}{5}$.', 'množenje',
    { medijiOdgovora: G(O, [...traka(5, 5, { y: 0 }), ...traka(5, 1, { y: -2, b: 2 }), { tx: '6/5 = 1 1/5', at: [9.5, -1.6], vel: 15, b: 2 }], { ...bez, velicina: 320 }) });

  // ── 38. množenje decimalnih brojeva ──
  L('Množenje decimalnih brojeva');
  Q(1, 'Kako množiš decimalne brojeve?',
    ['Pomnožiš ih kao cele brojeve, pa izbrojiš decimalna mesta', 'Pomnožiš samo cele delove', 'Sabereš decimale', 'Poravnaš zareze pa pomnožiš'],
    'Prvo zanemariš zareze i pomnožiš kao cele brojeve. Zatim u rezultatu odvojiš onoliko decimala koliko ih imaju oba činioca zajedno.', 'množenje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$0,\\!2\\cdot0,\\!3=0,\\!06$' } });
  Q(1, 'Koliko je $0,\\!2 \\cdot 0,\\!3$?',
    ['$0,\\!06$', '$0,\\!6$', '$0,\\!5$', '$6$'],
    'Pomnožimo $2\\cdot3=6$. Oba činioca imaju po jednu decimalu, ukupno dve, pa rezultat ima dve decimale: $0,\\!06$.', 'množenje',
    { medijiOdgovora: G(O, [...sto(6), { tx: '0,06', at: [3, 7.3], vel: 16, b: 1 }], { ...bez, velicina: 260 }) });
  Q(2, 'Koliko je $0,\\!5 \\cdot 4$?',
    ['$2$', '$0,\\!2$', '$0,\\!02$', '$20$'],
    '$0,\\!5\\cdot4=2$. Polovina puta 4 je 2 cela. Možeš i ovako: $5\\cdot4=20$, pa u rezultatu odvojiš jednu decimalu → $2,\\!0=2$.', 'množenje',
    { medijiOdgovora: G(O, [...traka(2, 1, { y: 0 }), ...traka(2, 1, { y: -2, b: 2 }), ...traka(2, 1, { y: -4, b: 3 }), ...traka(2, 1, { y: -6, b: 4 }), { tx: '4 × 0,5 = 2', at: [9.5, -3], vel: 15 }], { ...bez, velicina: 320 }) });
  Q(2, 'Koliko decimalnih mesta ima proizvod $0,\\!12 \\cdot 0,\\!3$?',
    ['3', '2', '1', '4'],
    'Prvi činilac ima 2 decimale, drugi 1 – ukupno 3. Zato proizvod $0,\\!036$ ima 3 decimalna mesta.', 'decimala',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$0,\\!12\\cdot0,\\!3=0,\\!036$' } });
  Q(2, 'Šta se dešava sa decimalnim zarezom kad broj množiš sa 10?',
    ['Pomera se za jedno mesto udesno', 'Pomera se za jedno mesto ulevo', 'Ostaje na mestu', 'Nestaje uvek'],
    'Množenje sa 10 pomera zarez za jedno mesto udesno: $0,\\!7\\cdot10=7$. Svaka nula u dekadnoj jedinici pomera zarez za jedno mesto.', 'decimala',
    { medijiOdgovora: tackaNaPravoj(7, '0,7 · 10 = 7', { od: 0, doo: 8 }) });
  Q(3, 'Koliko je $0,\\!7 \\cdot 10$?',
    ['7', '$0,\\!07$', '$70$', '$0,\\!7$'],
    'Množenje sa 10 pomera zarez udesno: $0,\\!7 \\to 7$.', 'decimala',
    { medijiOdgovora: tackaNaPravoj(7, '7', { od: 0, doo: 8 }) });

  // ── 39. recipročan broj; deljenje razlomaka ──
  L('Recipročan broj; deljenje razlomaka');
  Q(1, 'Šta je recipročna vrednost broja?',
    ['Broj koji pomnožen datim brojem daje 1', 'Broj koji sabran sa datim daje 1', 'Suprotan broj', 'Kvadrat broja'],
    'Recipročna vrednost broja $a$ je $\\frac{1}{a}$, jer je $a\\cdot\\frac{1}{a}=1$. Na primer, recipročno od 5 je $\\frac{1}{5}$.', 'recipročan',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$a\\cdot\\frac{1}{a}=1$' } });
  Q(1, 'Koja je recipročna vrednost razlomka $\\frac{2}{3}$?',
    ['$\\frac{3}{2}$', '$\\frac{2}{3}$', '$\\frac{1}{3}$', '$\\frac{3}{1}$'],
    'Recipročnu vrednost razlomka dobijemo zamenom brojioca i imenioca: $\\frac{2}{3} \\to \\frac{3}{2}$.', 'recipročan',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{2}{3}\\to\\frac{3}{2}$' } });
  Q(1, 'Kako deliš razlomke?',
    ['Pomnožiš prvi razlomak recipročnom vrednošću drugog', 'Podeliš brojioce i imenioce', 'Oduzmeš razlomke', 'Sabereš razlomke'],
    'Deljenje razlomaka pretvaramo u množenje: $\\frac{a}{b}:\\frac{c}{d}=\\frac{a}{b}\\cdot\\frac{d}{c}$. Delilac se „obrne“.', 'deljenje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{a}{b}:\\frac{c}{d}=\\frac{a}{b}\\cdot\\frac{d}{c}$' } });
  Q(2, 'Koliko je $\\frac{1}{2} : \\frac{1}{4}$?',
    ['2', '$\\frac{1}{8}$', '$\\frac{1}{2}$', '$4$'],
    '$\\frac{1}{2}:\\frac{1}{4}=\\frac{1}{2}\\cdot\\frac{4}{1}=\\frac{4}{2}=2$. U polovini se nalaze dve četvrtine.', 'deljenje',
    { medijiOdgovora: G(O, [...traka(2, 1, { y: 0 }), ...traka(4, 1, { y: -2, b: 2 }), ...traka(4, 1, { y: -4, b: 2 }), { tx: '1/2', at: [9.5, 0.6], vel: 15, b: 1 }, { tx: '2 × 1/4', at: [9.5, -3], vel: 15, b: 2 }], { ...bez, velicina: 320 }) });
  Q(2, 'Koja je recipročna vrednost broja 5?',
    ['$\\frac{1}{5}$', '$5$', '$\\frac{5}{1}$', '$0$'],
    'Recipročno od 5 je $\\frac{1}{5}$, jer je $5\\cdot\\frac{1}{5}=1$. Svaki broj (osim nule) ima recipročnu vrednost.', 'recipročan',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$5\\to\\frac{1}{5}$' } });
  Q(3, 'Zašto nula NEMA recipročnu vrednost?',
    ['Jer bi traženi broj množio nulom i dobio 1, što je nemoguće', 'Jer je nula premala', 'Jer je nula paran broj', 'Nula ima recipročnu vrednost'],
    'Recipročno od 0 bi bilo $\\frac{1}{0}$, a deljenje nulom nije dozvoljeno. Nijedan broj pomnožen nulom ne daje 1.', 'recipročan',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\frac{1}{0}$ nije definisano' } });

  // ── 40. deljenje decimalnih brojeva ──
  L('Deljenje decimalnih brojeva');
  Q(1, 'Kako deliš decimalni broj decimalnim?',
    ['Proširiš oba broja tako da delilac postane ceo broj', 'Podeliš samo cele delove', 'Pomnožiš decimale', 'Zanemariš zareze i podeliš'],
    'Na primer, za $1,\\!5:0,\\!5$ proširimo oba broja sa 10: $15:5=3$. Delilac mora postati ceo broj.', 'deljenje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$1,\\!5:0,\\!5=3$' } });
  Q(1, 'Koliko je $1,\\!5 : 0,\\!5$?',
    ['3', '$0,\\!3$', '$30$', '$0,\\!03$'],
    'Proširimo oba broja sa 10: $15:5=3$. U $1,\\!5$ ima tri polovine.', 'deljenje',
    { medijiOdgovora: G(O, [{ osa: [0, 1.5], podela: 0.5, svaki: 1 }, { tx: '3 × 0,5', at: [0.75, 0.5], vel: 14 }], { ...bez, velicina: 300 }) });
  Q(2, 'Deljenje broja sa 0,1 isto je što i…',
    ['množenje sa 10', 'množenje sa 0,1', 'deljenje sa 10', 'oduzimanje 0,1'],
    'Deljenje sa $0,\\!1$ znači „koliko desetinki staje u broj“ – to je isto kao množenje sa 10: $3:0,\\!1=30$.', 'deljenje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$3:0,\\!1=3\\cdot10=30$' } });
  Q(2, 'Šta se dešava sa zarezom kad broj deliš sa 10?',
    ['Pomera se za jedno mesto ulevo', 'Pomera se za jedno mesto udesno', 'Ostaje na mestu', 'Nestaje'],
    'Deljenje sa 10 pomera zarez ulevo: $0,\\!7:10=0,\\!07$. Svaka nula pomera zarez za jedno mesto ulevo.', 'decimala',
    { mediji: tackaNaPravoj(0.7, '0,7', { od: 0, doo: 1, b: 1 }) });
  Q(3, 'Koliko je $0,\\!7 : 10$?',
    ['$0,\\!07$', '$7$', '$70$', '$0,\\!7$'],
    'Deljenje sa 10 pomera zarez ulevo: $0,\\!7 \\to 0,\\!07$.', 'decimala',
    { medijiOdgovora: G(O, [{ osa: [0, 1], podela: 0.1, svaki: 5 }, { lin: [[0.07, -0.06], [0.07, 0.06]], b: 1, debljina: 4 }, { tx: '0,07', at: [0.07, 0.3], vel: 14, b: 1 }], { ...bez, velicina: 300 }) });

  // ── 41. svojstva množenja i deljenja ──
  L('Svojstva množenja i deljenja; brojevni izrazi');
  Q(1, 'U izrazu $2 + 3 \\cdot 4$, šta računaš prvo?',
    ['Množenje $3\\cdot4$', 'Sabiranje $2+3$', 'Sve redom sleva', 'Oduzimanje'],
    'Množenje ima prednost: $2+3\\cdot4=2+12=14$.', 'redosled',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$2+3\\cdot4=14$' } });
  Q(2, 'Koje svojstvo koristiš kad računaš $7 \\cdot 12 = 7\\cdot10 + 7\\cdot2$?',
    ['Distributivnost', 'Komutativnost', 'Asocijativnost', 'Zatvorenost'],
    'Distributivnost razlaže množenje na sabirke: $a\\cdot(b+c)=a\\cdot b+a\\cdot c$. Tako je lakše množiti „okrugle“ brojeve.', 'raspodela',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$a\\cdot(b+c)=a\\cdot b+a\\cdot c$' } });
  Q(2, 'Množenje i deljenje su međusobno…',
    ['obrnute (inverzne) operacije', 'iste operacije', 'nezavisne operacije', 'uvek jednake'],
    'Množenje i deljenje su obrnute operacije: ako je $6\\cdot4=24$, onda je $24:4=6$. Jedna „poništava“ drugu.', 'množenje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$6\\cdot4=24 \\Leftrightarrow 24:4=6$' } });
  Q(3, 'Koliko je $(2+3)\\cdot 4$?',
    ['20', '14', '10', '18'],
    'Prvo zagrada: $2+3=5$, pa $5\\cdot4=20$. Zagrade menjaju redosled računanja!', 'redosled',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$(2+3)\\cdot4=20$' } });
  Q(3, 'Kako se zove svojstvo po kome je $a\\cdot b = b\\cdot a$?',
    ['Komutativnost množenja', 'Asocijativnost množenja', 'Distributivnost', 'Neutralnost'],
    'Komutativnost množenja: činioci mogu da zamene mesta, proizvod ostaje isti. Na primer, $3\\cdot4=4\\cdot3$.', 'zamena',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$a\\cdot b=b\\cdot a$' } });

  // ── 42. jednačine sa množenjem i deljenjem ──
  L('Jednačine sa množenjem i deljenjem razlomaka');
  Q(1, 'Kako nalaziš nepoznati činilac u jednačini $x \\cdot 3 = 12$?',
    ['Proizvod podeliš poznatim činiocem', 'Proizvodu dodaš poznati činilac', 'Pomnožiš proizvod poznatim činiocem', 'Oduzmeš činilac od proizvoda'],
    'Nepoznati činilac nalazimo deljenjem: $x = 12:3 = 4$.', 'jednačina',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$x\\cdot3=12 \\Rightarrow x=4$' } });
  Q(2, 'Koji broj je rešenje jednačine $x \\cdot 3 = 12$?',
    ['4', '3', '12', '36'],
    '$x = 12:3 = 4$. Provera: $4\\cdot3=12$ – tačno!', 'jednačina',
    { medijiOdgovora: tackaNaPravoj(4, 'x = 4', { od: 0, doo: 6 }) });
  Q(2, 'Koji broj je rešenje jednačine $x : 4 = 5$?',
    ['20', '5', '4', '9'],
    'Nepoznati deljenik nalazimo množenjem: $x = 5\\cdot4 = 20$.', 'jednačina',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$x:4=5 \\Rightarrow x=20$' } });
  Q(3, 'Koji broj je rešenje jednačine $\\frac{1}{2} \\cdot x = 3$?',
    ['6', '$\\frac{3}{2}$', '$\\frac{1}{6}$', '3'],
    'Polovina nepoznatog broja je 3, pa je ceo broj duplo veći: $x = 3 \\cdot 2 = 6$.', 'jednačina',
    { mediji: G(O, [...traka(2, 1, { y: 0 }), ...traka(2, 1, { y: -2, b: 2 }), ...traka(2, 1, { y: -4, b: 3 }), { tx: '1/2 · x = 3', at: [9.5, -1.6], vel: 15 }], { ...bez, velicina: 320 }) });
  Q(3, 'Kako nalaziš nepoznati delilac u jednačini $12 : x = 4$?',
    ['Deljenik podeliš količnikom', 'Količnik pomnožiš deljenikom', 'Sabereš deljenik i količnik', 'Oduzmeš količnik od deljenika'],
    'Nepoznati delilac: $x = 12:4 = 3$. Provera: $12:3=4$.', 'jednačina',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$12:x=4 \\Rightarrow x=3$' } });

  // ── 43. nejednačine sa množenjem i deljenjem ──
  L('Nejednačine sa množenjem i deljenjem razlomaka');
  Q(1, 'Koji znak koristimo za „veće ili jednako“?',
    ['$\\ge$', '$>$', '$<$', '$=$'],
    'Znak $\\ge$ čitamo „veće ili jednako“: $x \\ge 3$ znači da je $x$ veće od 3 ili baš 3.', 'znak',
    { mediji: { vrsta: 'formula', tekst: '$x\\ge3$' } });
  Q(2, 'Koji broj zadovoljava nejednačinu $2x < 10$?',
    ['4', '5', '6', '10'],
    'Za $x=4$: $2\\cdot4=8$, a $8<10$ – tačno. Za $x=5$ dobili bismo $10$, a 10 nije manje od 10.', 'nejednačina',
    { medijiOdgovora: G(O, [{ osa: [0, 6], podela: 1, svaki: 1 }, { kr: 'g', r: 0.18, b: 1, prazno: 1 }, { lin: [[5, -0.4], [0, -0.4]], b: 1, debljina: 3, str: 1 }, { tx: '5', at: [5, 0.3], vel: 14 }], { ...bez, t: { O: [0, 0], g: [5, 0] }, velicina: 300 }) });
  Q(2, 'Nejednačina $x \\cdot 2 \\le 8$ znači da je $x$…',
    ['manje ili jednako 4', 'veće od 4', 'jednako 8', 'veće ili jednako 4'],
    'Podelimo obe strane sa 2: $x \\le 4$. Rešenja su svi brojevi manji ili jednaki 4.', 'nejednačina',
    { medijiOdgovora: G(O, [{ osa: [0, 5], podela: 1, svaki: 1 }, { tacka: 'g', b: 1 }, { lin: [[4, -0.4], [0, -0.4]], b: 1, debljina: 3, str: 1 }, { tx: '4', at: [4, 0.3], vel: 14 }], { ...bez, t: { O: [0, 0], g: [4, 0] }, velicina: 300 }) });
  Q(3, 'Koji broj NE zadovoljava nejednačinu $3x > 9$?',
    ['3', '4', '5', '10'],
    'Za $x=3$: $3\\cdot3=9$, a 9 nije veće od 9. Svi brojevi veći od 3 zadovoljavaju nejednačinu.', 'nejednačina',
    { medijiOdgovora: G(O, [{ osa: [0, 4], podela: 1, svaki: 1 }, { kr: 'g', r: 0.18, b: 1, prazno: 1 }, { lin: [[3, -0.4], [4, -0.4]], b: 1, debljina: 3, str: 1 }, { tx: '3', at: [3, 0.3], vel: 14 }], { ...bez, t: { O: [0, 0], g: [3, 0] }, velicina: 300 }) });
  Q(3, 'Ako obe strane nejednačine pomnožiš POZITIVNIM brojem, znak nejednakosti…',
    ['ostaje isti', 'se okreće', 'nestaje', 'postaje jednakost'],
    'Množenje pozitivnim brojem ne menja smer nejednakosti: iz $x<5$ sledi $2x<10$. (Kod negativnih brojeva znak bi se okrenuo.)', 'nejednačina',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$x<5 \\Rightarrow 2x<10$' } });

};
