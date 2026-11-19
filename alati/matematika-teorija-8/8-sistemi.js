// Tema „Sistemi linearnih jednačina“ (8. razred, udžbenik 2. deo, str. 79–114): lekcije 7.1–7.7.
// Pojmovi, ekvivalentnost, metode smene i suprotnih koeficijenata, grafička metoda, karakteristični
// sistemi (nemoguć, neodređen) i primene. Crteži: prave u koordinatnoj ravni, vage, kartice sa
// sistemom, reka sa strelicama. Računi su provereni u proveri(…) i u komentarima uz pitanja.
module.exports = ({ L, Q, U, S, G, proveri, r, dvePrave, grafik, koord, terazije, A, prava, vektor }) => {

  // ── pomoćni crteži ──
  const minus = (v) => String(v).replace('-', '−');
  // kartica sa redovima teksta (sistem ili postavka zadatka), tekst centriran
  const kartica = (redovi, x = {}) => {
    const h = redovi.length * 1.1 + 0.6;
    return G({}, [
      { lin: [[0, 0], [7, 0], [7, h], [0, h]], zatv: 1, prazno: 1, b: 4 },
      ...redovi.map((s, i) => ({ tx: s, at: [3.5, h - 0.9 - i * 1.1], b: 1, vel: 16 })),
    ], { velicina: 240, ...x });
  };
  // dve prave y = k1·x + n1 i y = k2·x + n2 sa celobrojnim presekom: pitanje bez tačke preseka,
  // odgovor sa tačkom S i njenim koordinatama
  const prave = (k1, n1, k2, n2) => {
    const x = (n2 - n1) / (k1 - k2), y = k1 * x + n1;
    proveri(Number.isInteger(x) && Number.isInteger(y), `presek ${k1}, ${n1}, ${k2}, ${n2}`);
    const pitanje = dvePrave(k1, n1, k2, n2, { presek: false, podela: 1 });
    const odgovor = dvePrave(k1, n1, k2, n2, { kS: 0, podela: 1 });
    odgovor.e.push({ tx: `(${minus(x)}, ${minus(y)})`, at: [x + 0.35, y - 0.6], b: 3, vel: 15 });
    return { pitanje, odgovor };
  };
  // paralelne prave y = kx + n1 i y = kx + n2 (nemaju zajedničku tačku)
  const paralelne = (k, n1, n2) => G({}, [
    { mreza: [-4, 4, -4, 6], ose: ['x', 'y'] }, prava(k, n1, -3, 3, { b: 1 }), prava(k, n2, -3, 3, { b: 2 }),
  ], { velicina: 240 });
  // poklopljene prave: druga je isprekidana preko prve (ista prava)
  const poklopljene = (k, n, mx = [-3, 3, -3, 6]) => G({}, [
    { mreza: mx, ose: ['x', 'y'] }, prava(k, n, mx[0], mx[1], { b: 1 }), prava(k, n, mx[0], mx[1], { b: 4, isp: 1 }),
  ], { velicina: 240 });
  // dve vage jedna iznad druge: sistem kao slika (gornja i donja vaga)
  const pomeri = (g, dy) => ({
    ...g,
    e: g.e.map((el) => ({
      ...el,
      ...(el.lin ? { lin: el.lin.map(([x, y]) => [x, r(y + dy)]) } : {}),
      ...(el.at ? { at: [el.at[0], r(el.at[1] + dy)] } : {}),
    })),
  });
  const vage = (gore, dole, { nagibG = 0, nagibD = 0 } = {}) => {
    const a = pomeri(terazije(gore[0], gore[1], { nagib: nagibG }), 0);
    const b = pomeri(terazije(dole[0], dole[1], { nagib: nagibD }), -7);
    return G({}, [...a.e, ...b.e], { velicina: 300 });
  };
  // pravougaonik sa oznakama stranica (bez brojeva, ili sa zadatim tekstom)
  const pravougaonik = (w = 4, h = 2, o = {}) => G({}, [
    { lin: [[0, 0], [w, 0], [w, h], [0, h]], zatv: 1, prazno: 1, b: 4 },
    { tx: o.a || 'a', at: [w / 2 - 0.2, -0.6], b: 1, vel: 16 },
    { tx: o.b || 'b', at: [w + 0.3, h / 2 - 0.2], b: 1, vel: 16 },
  ], { velicina: 240 });
  // reka: obala (pravougaonik), strelica uz reku (nazad) i niz reku (sa tokom)
  const reka = (tekstUz, tekstNiz) => G({}, [
    { lin: [[0, 0], [10, 0], [10, 3], [0, 3]], zatv: 1, prazno: 1, b: 4 },
    vektor([8.5, 1], [-5, 0], { b: 2, o: tekstUz }),
    vektor([1.5, 2], [5, 0], { b: 3, o: tekstNiz }),
  ], { velicina: 260 });

  // ════════════════ 7.1 Pojam sistema linearnih jednačina sa dve nepoznate ════════════════
  L('Pojam sistema linearnih jednačina sa dve nepoznate');

  Q(1, 'Kako se zove jednačina oblika $ax + by = c$, gde su $x$ i $y$ nepoznate?',
    ['linearna jednačina sa dve nepoznate', 'kvadratna jednačina', 'sistem jednačina', 'nejednačina sa znakom nejednakosti'],
    'Reč „linearna“ dolazi od latinske reči za liniju: kad se takva jednačina nacrta, dobija se prava.',
    'linearna', { mediji: kartica(['a · x + b · y = c']) });

  Q(1, 'Koji par brojeva je rešenje jednačine $x + y = 7$?',
    ['(3, 4)', '(4, 4)', '(2, 4)', '(3, 3)'],
    'Kad je jedna nepoznata izabrana, druga se računa u jednom koraku, pa jedna jednačina ima beskonačno mnogo rešenja.',
    'rešenje', { mediji: kartica(['x + y = 7']) });

  Q(1, 'Šta je rešenje sistema dve linearne jednačine sa dve nepoznate?',
    ['uređeni par $(x, y)$ koji zadovoljava obe jednačine', 'bilo koji broj koji stoji uz $x$', 'samo vrednost za $x$', 'samo vrednost za $y$'],
    'Koordinatnu ravan je u 17. veku uveo Dekart (Descartes), pa se po njemu zove Dekartov koordinatni sistem.',
    'sistem', { mediji: prave(1, 1, -1, 3).pitanje, medijiOdgovora: prave(1, 1, -1, 3).odgovor });

  Q(1, 'Koji uređeni par zadovoljava obe jednačine: $x + y = 3$ i $x − y = 1$?',
    ['(2, 1)', '(1, 2)', '(3, 0)', '(0, 3)'],
    'Računari rešavaju sisteme sa milionima jednačina, a osnovna ideja ostaje ista kao kod dve jednačine.',
    'par', { mediji: prave(-1, 3, 1, -1).pitanje, medijiOdgovora: prave(-1, 3, 1, -1).odgovor });

  Q(2, 'Koliko rešenja ima jedna linearna jednačina $x + y = 4$ kad je posmatramo sama?',
    ['beskonačno mnogo', 'jedno', 'dva', 'nijedno'],
    'Tek kad dodamo drugu jednačinu, broj rešenja se može spustiti na jedno ili na nijedno.',
    'prava', { mediji: grafik(-1, 4, { sece: false }) });

  Q(2, 'Dve prave se seku u jednoj tački. Koliko rešenja ima sistem tih dveju jednačina?',
    ['jedno rešenje', 'nema rešenja', 'beskonačno mnogo', 'dva rešenja'],
    'Dve prave u ravni mogu da se seku, da budu paralelne ili da se poklope. Samo poklapanje daje beskonačno rešenja.',
    'presek', { mediji: prave(2, 1, -1, 4).pitanje, medijiOdgovora: prave(2, 1, -1, 4).odgovor });

  Q(2, 'Koliko rešenja ima sistem $x + y = 2$ i $2x + 2y = 4$?',
    ['beskonačno mnogo', 'jedno', 'nijedno', 'dva'],
    'Dve jednačine koje izgledaju različito mogu biti ista prava: množenjem ili deljenjem jedne dobija se druga.',
    'jednačina', { mediji: kartica(['x + y = 2', '2x + 2y = 4']), medijiOdgovora: poklopljene(-1, 2, [-3, 4, -3, 6]) });

  U(2, 'Koja od ovih jednačina NIJE linearna sa dve nepoznate?',
    ['$x^2 + 3y = 7$', '$2x + 7y = 39$', '$x − 2y = 5$', '$3p + 8q = 12$'],
    'Jednačina $x^2 + 3y = 7$ ima $x$ na kvadrat, pa nije linearna. Ostale imaju nepoznate samo u prvom stepenu.',
    'Nelinearne jednačine daju krive linije: na primer, $x^2 + y^2 = 25$ je kružnica.',
    'stepen', { mediji: koord(-1, 6, -1, 6, {}) });

  Q(2, 'Koji par NE zadovoljava jednačinu $3x − y = 1$?',
    ['(2, 4)', '(1, 2)', '(0, −1)', '(2, 5)'],
    'Parovi koji ne zadovoljavaju jednačinu su tačke van prave, baš kao što tačke izvan kruga nisu na kružnici.',
    'zadovoljava', { mediji: kartica(['3x − y = 1']) });

  Q(2, 'Tačke $A$, $B$, $C$ i $D$ na crtežu su rešenja jedne jednačine sa dve nepoznate. Kakav je skup svih njenih rešenja u koordinatnoj ravni?',
    ['prava', 'jedna tačka', 'krug', 'duž'],
    'Pravu u ravni određuju dve tačke, pa se i jednačina prave može naći iz dva para rešenja.',
    'prava', { mediji: koord(-3, 3, -3, 5, { A: [0, 0], B: [1, 2], C: [2, 4], D: [-1, -2] }, { istakni: ['A', 'B', 'C', 'D'] }) });

  S(1, 'Spoji pojam sa njegovim značenjem.',
    [['jednačina $ax + by = c$', 'prava u koordinatnoj ravni'], ['rešenje sistema', 'uređeni par $(x, y)$'], ['jednačina $x = 4$', 'prava paralelna sa $y$-osom']],
    'Jednačina $x = 4$ nema $y$ u sebi, pa je njeno rešenje cela vertikalna prava.',
    'par', { mediji: kartica(['jednačina → prava', 'rešenje → par brojeva']) });

  Q(3, 'Koji par je rešenje sistema $2x + y = 8$ i $x − y = 1$?',
    ['(3, 2)', '(2, 4)', '(4, 0)', '(5, −2)'],
    'Kad rešavamo sistem računom ili crtanjem, dobijamo isti rezultat. To je dobar način da se proveri rad.',
    'rešenje', { mediji: prave(-2, 8, 1, -1).pitanje, medijiOdgovora: prave(-2, 8, 1, -1).odgovor });

  Q(2, 'Par $(4, −1)$ zadovoljava jednačinu $x + y = 3$. Da li je on i rešenje sistema $x + y = 3$ i $x − y = 5$?',
    ['da, obe jednačine su zadovoljene', 'ne, druga jednačina nije zadovoljena', 'ne, jer $y$ mora biti pozitivno', 'ne, jer je $x$ veće od $3$'],
    'Učenici često proveravaju samo prvu jednačinu. Zato je dobra navika da svaki par uvrstimo i u drugu.',
    'provera', { mediji: kartica(['x + y = 3', 'x − y = 5']) });

  Q(3, 'Za koju vrednost $k$ par $(2, k)$ zadovoljava jednačinu $3x + 2y = 16$?',
    ['$k = 5$', '$k = 4$', '$k = 7$', '$k = 6$'],
    'Jednačina sa dve nepoznate i jednom poznatom vrednošću lako se rešava za drugu nepoznatu.',
    'vrednost', { mediji: kartica(['3x + 2y = 16', 'x = 2']) });

  Q(2, 'Jednačina $x = 2$ ima dve nepoznate, ali $y$ se u njoj ne pojavljuje. Koju tačku ili skup tačaka predstavlja u ravni?',
    ['vertikalna prava $x = 2$', 'horizontalna prava $y = 2$', 'tačka $(2, 0)$', 'krug sa centrom u $(2, 2)$'],
    'Vertikalna prava $x = 2$ je paralelna sa $y$-osom, pa su sve njene tačke na istom rastojanju od nje.',
    'prava', { mediji: koord(-1, 5, -2, 4, {}), medijiOdgovora: koord(-1, 5, -2, 4, {}, { e: [{ lin: [[2, -2], [2, 4]], b: 1, debljina: 3 }] }) });

  Q(3, 'Šta predstavlja jednačina $0 · x + 2y = 6$ u koordinatnoj ravni?',
    ['horizontalna prava $y = 3$', 'vertikalna prava $x = 3$', 'horizontalna prava $y = 6$', 'prava $x = 0$'],
    'Jednačina sa nulom uz jednu nepoznatu je najjednostavniji način da se dobije horizontalna ili vertikalna prava.',
    'prava', { mediji: koord(-1, 5, -1, 6, {}), medijiOdgovora: koord(-1, 5, -1, 6, {}, { e: [{ lin: [[-1, 3], [5, 3]], b: 1, debljina: 3 }] }) });

  Q(1, 'Koliko nepoznatih ima u jednačini $2x + 7y = 39$?',
    ['dve', 'jedna', 'tri', 'nijedna'],
    'Broj uz nepoznatu zove se koeficijent, a broj bez nepoznate je slobodan član.',
    'nepoznata', { mediji: kartica(['2x + 7y = 39']) });

  // ════════════════ 7.2 Ekvivalentnost sistema linearnih jednačina ════════════════
  L('Ekvivalentnost sistema linearnih jednačina');

  Q(1, 'Kada kažemo da su dva sistema ekvivalentna?',
    ['imaju isti skup rešenja', 'imaju iste koeficijente uz nepoznate', 'imaju isti broj jednačina', 'imaju jednake slobodne članove'],
    'Dva sistema koja izgledaju različito mogu imati isto rešenje. Zato oblik sistema može da se menja.',
    'ekvivalent', { mediji: prave(2, 0, -1, 3).pitanje, medijiOdgovora: prave(2, 0, -1, 3).odgovor });

  Q(1, 'Posle koje promene sistem NIJE više ekvivalentan polaznom?',
    ['brisanje jedne jednačine iz sistema', 'zamena mesta dve jednačine', 'množenje jedne jednačine brojem $3$', 'dodavanje jedne jednačine drugoj'],
    'U logici slična ideja zove se ekvivalencija: dve tvrdnje su ekvivalentne ako su obe tačne ili obe netačne.',
    'brisanje', { mediji: kartica(['x + y = 4', 'x − y = 2']) });

  Q(1, 'Zamenimo mesta dvema jednačinama u sistemu. Šta se dešava sa rešenjima?',
    ['ostaju ista', 'menjaju se', 'ima ih dvostruko više', 'nestaju'],
    'Redosled jednačina u sistemu je kao redosled stavki u spisku: kad ga promenimo, spisak ostaje isti.',
    'zamena', { mediji: kartica(['x − y = 2', 'x + y = 4']) });

  Q(2, 'Šta se dešava ako obe strane jednačine $x + y = 4$ pomnožimo brojem $0$?',
    ['dobija se $0 = 0$, pa se gubi informacija', 'sistem ostaje isti, bez promene', 'dobija se jednačina ekvivalentna polaznoj', 'rešenja se udvostručuju'],
    'Množenje nulom je jedna od retkih operacija koja „briše“ informaciju: iz nule ne znamo šta je bilo pre.',
    'množenje', { mediji: kartica(['x + y = 4', '· 0']) });

  Q(1, 'Koji sistem je ekvivalentan sistemu $x + y = 4$ i $x − y = 2$, ako prvu jednačinu pomnožimo sa $2$?',
    ['$2x + 2y = 8$ i $x − y = 2$', '$2x + y = 8$ i $x − y = 2$', '$2x + 2y = 4$ i $x − y = 2$', '$x + 2y = 8$ i $x − y = 2$'],
    'Množenje cele jednačine je kao duplo povećanje obe strane vage: ravnoteža ostaje.',
    'množenje', { mediji: kartica(['x + y = 4', 'x − y = 2']) });

  Q(2, 'Ako prvu jednačinu sistema zamenimo zbirom prve i druge, sistem je…',
    ['ekvivalentan, jer druga jednačina ostaje', 'nemoguć, jer se gubi jedna jednačina', 'ekvivalentan samo ako je $x = 0$', 'nov sistem sa drugim rešenjima'],
    'Zbir jednačina je osnova metode suprotnih koeficijenata, koju ćemo upoznati u sledećim lekcijama.',
    'zbir', { mediji: kartica(['x + y = 4', 'x − y = 2']) });

  Q(3, 'Koja promena sistema sigurno menja skup rešenja?',
    ['dodavanje jednačine $x = 7$', 'zamena mesta dve jednačine', 'množenje jedne jednačine brojem $2$', 'zamena jedne jednačine zbirom nje i druge'],
    'Svaka nova jednačina daje dodatni uslov, kao novo pravilo u igri koje može zabraniti neka rešenja.',
    'uslov', { mediji: kartica(['x + y = 4', 'x − y = 2']) });

  Q(3, 'Koji sistem je ekvivalentan sistemu $x + y = 5$ i $x − y = 1$?',
    ['$x + y = 5$ i $2x = 6$', '$x + y = 5$ i $2x = 4$', '$x + y = 6$ i $x − y = 1$', '$x + y = 5$ i $2y = 4$'],
    'Ova transformacija je jedna od najkorisnijih ideja u matematici: dve jednačine menjamo jednom, jednostavnijom.',
    'ekvivalent', { mediji: kartica(['x + y = 5', 'x − y = 1']) });

  Q(2, 'Sistem $y = 2x$ i $x + y = 9$ je ekvivalentan sistemu…',
    ['$y = 2x$ i $3x = 9$', '$y = 2x$ i $x = 9$', '$y = 2x$ i $3y = 9$', '$y = 2x$ i $x + 2 = 9$'],
    'U metodi smene izraz zamenjuje nepoznatu, kao što ime u rečenici zamenjuje zamenica.',
    'smena', { mediji: kartica(['y = 2x', 'x + y = 9']) });

  Q(3, 'Koji sistem je ekvivalentan sistemu $x = 1$ i $y = 2$?',
    ['$x + y = 3$ i $x − y = −1$', '$x + y = 3$ i $x = 2$', '$x = 1$ i $x + y = 4$', '$x + y = 2$ i $y = 2$'],
    'Sistem u rešenom obliku je kao dokaz koji je već završen: rešenje se čita odmah, bez računa.',
    'zbir', { mediji: kartica(['x = 1', 'y = 2']) });

  U(2, 'Koji sistem NIJE ekvivalentan sistemu $x = 2$ i $y = 3$?',
    ['$x = 2$ i $y = 4$', '$x + y = 5$ i $x = 2$', '$2x = 4$ i $y = 3$', '$x − y = −1$ i $y = 3$'],
    'Sistem $x = 2$ i $y = 4$ ima rešenje $(2, 4)$, a ostali imaju $(2, 3)$.',
    'Najsigurnija provera ekvivalentnosti je da li su rešenja ista, a ne kako sistem izgleda.',
    'rešenje', { mediji: kartica(['x = 2', 'y = 3']) });

  S(2, 'Spoji sistem sa ekvivalentnim sistemom u rešenom obliku.',
    [['$x + y = 4$ i $x − y = 2$', '$x = 3$ i $y = 1$'], ['$x + y = 6$ i $y = 2$', '$x = 4$ i $y = 2$'], ['$2x = 8$ i $y = 1$', '$x = 4$ i $y = 1$'], ['$x = 5$ i $y = 0$', '$x + y = 5$ i $y = 0$']],
    'Cilj svih transformacija je da se sistem svede na oblik $x = …$, $y = …$, u kojem se rešenje čita odmah.',
    'ekvivalent', { mediji: prave(1, -2, -1, 4).pitanje });

  Q(2, 'Koja je ekvivalentna transformacija u prelazu sa sistema $x + y = 3$, $x − y = 1$ na sistem $2x = 4$, $x − y = 1$?',
    ['zamena prve jednačine zbirom prve i druge', 'brisanje prve jednačine', 'množenje prve jednačine sa $x$', 'dodavanje $y$ na obe strane prve'],
    'Ista transformacija je osnova metode suprotnih koeficijenata: sabiranjem dobijamo nepoznatu u jednoj jednačini.',
    'zbir', { mediji: kartica(['x + y = 3', 'x − y = 1']) });

  Q(2, 'Iz prve jednačine $x − y = 3$ izrazimo $x = y + 3$ i uvrstimo u $2x + y = 9$. Koja jednačina se dobija?',
    ['$2(y + 3) + y = 9$', '$2y + 3 + y = 9$', '$2(y − 3) + y = 9$', '$2 + y + 3 = 9$'],
    'Kad uvrštavamo izraz, zagrada je kao kutija: ceo sadržaj se množi spolja, pa koeficijent ne sme da ispadne.',
    'smena', { mediji: kartica(['x − y = 3', '2x + y = 9']) });

  Q(3, 'Sistem $x + y = 10$ i $x − y = 4$ zamenimo sistemom u kojem drugu jednačinu zamenjujemo zbirom obe jednačine. Koji sistem dobijamo?',
    ['$x + y = 10$ i $2x = 14$', '$x + y = 10$ i $2y = 8$', '$x + y = 14$ i $x − y = 4$', '$x + y = 10$ i $x = 14$'],
    'Sabiranje dve jednačine daje zbir leve i zbir desne strane. Zato je dobijeni sistem ekvivalentan polaznom.',
    'zbir', { mediji: kartica(['x + y = 10', 'x − y = 4']) });

  Q(2, 'Koliko je $x$ ako je sistem $x + y = 10$ i $x − y = 4$ ekvivalentan sistemu $2x = 14$ i $x − y = 4$?',
    ['7', '6', '8', '3'],
    'Kad je rešenje celi broj, ono se lako proveri uvrštavanjem. To je dobar način da se izbegne greška.',
    'ekvivalent', { mediji: kartica(['2x = 14', 'x − y = 4']) });

  Q(1, 'Sistem $x + y = 4$ i $x − y = 2$ ima rešenje $(3, 1)$. Sistem $x = 3$ i $y = 1$ ima isto rešenje. Da li su ekvivalentni?',
    ['da, imaju isti skup rešenja', 'ne, jer imaju drugačije koeficijente', 'ne, jer je drugi u obliku $x = …$', 'da, samo ako su brojevi pozitivni'],
    'Oblik sistema nije važan za ekvivalentnost. Važan je jedino skup rešenja.',
    'skup', { mediji: kartica(['x + y = 4', 'x − y = 2', 'x = 3, y = 1']) });

  // ════════════════ 7.3 Rešavanje sistema metodom smene ════════════════
  L('Rešavanje sistema metodom smene');

  Q(1, 'Čime počinje rešavanje sistema metodom smene?',
    ['iz jedne jednačine izraziti jednu nepoznatu', 'sabrati obe jednačine u sistemu', 'nacrtati obe prave', 'pomnožiti obe jednačine nulom i sabrati'],
    'Kad se jedan izraz zameni drugim, matematičari kažu da je izvršena smena. Otuda ime metode.',
    'smena', { mediji: kartica(['x + y = 6', 'x − y = 2']) });

  Q(1, 'Reši sistem smenom: $x + y = 6$ i $x − y = 2$. Koliko je $x$?',
    ['4', '2', '3', '5'],
    'Kod rešavanja sistema računari najčešće koriste varijante ovih metoda, samo nad tablicama brojeva.',
    'smena', { mediji: kartica(['x + y = 6', 'x − y = 2']) });

  Q(1, 'Iz jednačine $y = 2x − 3$ uvrstimo $y$ u drugu jednačinu $x + y = 9$. Šta dobijamo?',
    ['$x + (2x − 3) = 9$', '$x + 2x = 9$', '$x + 2x + 3 = 9$', '$x + x − 3 = 9$'],
    'Kad je koeficijent uz nepoznatu jedan, izraz za nju je bez razlomaka, pa je smena najlakša.',
    'uvrštavanje', { mediji: kartica(['y = 2x − 3', 'x + y = 9']) });

  Q(2, 'Reši sistem smenom: $y = 3x − 4$ i $x + y = 4$. Koliko je $y$?',
    ['2', '3', '1', '5'],
    'Ako sistem ima nepoznatu koja je sama sa jedne strane, smena je obično najbrži put do rešenja.',
    'smena', { mediji: kartica(['y = 3x − 4', 'x + y = 4']) });

  Q(2, 'Reši sistem smenom: $2x + y = 8$ i $x − y = 1$. Koliko je $y$?',
    ['2', '4', '1', '3'],
    'Izrazi se mogu uvrštavati i u zagradi i kad je nepoznata izražena razlomkom, ali je računanje duže.',
    'smena', { mediji: kartica(['2x + y = 8', 'x − y = 1']) });

  Q(2, 'U sistemu $y = 2x$ i $3x + y = 10$, koliko je $x$?',
    ['2', '5', '1', '3'],
    'Ova vrsta sistema često se javlja u fizici, kad je jedna veličina srazmerna drugoj.',
    'smena', { mediji: kartica(['y = 2x', '3x + y = 10']) });

  Q(2, 'U jednačini $x − 2y = 1$, koju nepoznatu je najlakše izraziti?',
    ['$x$, jer joj je koeficijent $1$', '$y$, jer joj je koeficijent $−2$', 'obe su jednako lake', 'nijednu, jer je jednačina nemoguća'],
    'Ako nijedna nepoznata nema koeficijent 1, smena i dalje radi, ali je računanje duže.',
    'koeficijent', { mediji: kartica(['x − 2y = 1', '3x + y = 12']) });

  Q(3, 'Reši sistem smenom: $x + 2y = 8$ i $3x − y = 3$. Koliko je $x$?',
    ['2', '3', '4', '1'],
    'Metoda smene se koristi i u ekonomiji za računanje ravnoteže ponude i potražnje, u jednostavnim modelima.',
    'smena', { mediji: kartica(['x + 2y = 8', '3x − y = 3']) });

  Q(2, 'Uvrštavanjem $y = x + 1$ u $2x + 3y = 17$ dobijamo jednačinu…',
    ['$2x + 3(x + 1) = 17$', '$2x + x + 1 = 17$', '$2x + 3x + 1 = 17$', '$5x + 1 = 17$'],
    'Smenom dobijamo jednačinu sa jednom nepoznatom, a rešenje se može proveriti uvrštavanjem u oba početna izraza.',
    'uvrštavanje', { mediji: kartica(['y = x + 1', '2x + 3y = 17']) });

  Q(3, 'Iz $y = 5 − x$ uvrstimo u $x − y = 1$. Šta dobijamo?',
    ['$x − (5 − x) = 1$', '$x + (5 − x) = 1$', '$x − 5 − x = 1$', '$(5 − x) − x = 0$'],
    'Pri smeni znak minus ispred zagrade menja znak svakog člana u njoj, i to je čest izvor grešaka.',
    'uvrštavanje', { mediji: kartica(['y = 5 − x', 'x − y = 1']) });

  Q(2, 'Posle smene u sistemu ostane jednačina $0 · x = 6$. Šta to znači?',
    ['sistem nema rešenja', 'sistem ima jedno rešenje', 'sistem ima beskonačno mnogo rešenja', 'x mora biti jednako nuli'],
    'Kad sistem nema rešenja, prave koje predstavljaju njegove jednačine su paralelne.',
    'nemoguć', { mediji: kartica(['0 · x = 6']) });

  Q(3, 'Posle smene u sistemu ostane jednačina $0 · x = 0$. Šta to znači za sistem?',
    ['beskonačno mnogo rešenja', 'nema rešenja', 'jedno rešenje $x = 0$', 'dva rešenja'],
    'Sistem sa beskonačno rešenja zove se neodređen, jer nema jedinstvenog odgovora.',
    'neodređen', { mediji: kartica(['0 · x = 0']) });

  Q(2, 'Kad iz jedne jednačine dobijemo vrednost za $y$, šta sledi?',
    ['uvrstimo je u izraz za $x$ i izračunamo $x$', 'sabiramo jednačine', 'menjamo mesta nepoznatim', 'računamo $y$ ponovo iz iste jednačine'],
    'Rešenje se u metodi smene „odmotava“ kao klupko: iz jedne vrednosti lančano dobijamo drugu.',
    'koraci', { mediji: kartica(['y = …', 'x = y + 2']) });

  U(1, 'Koji korak NIJE deo metode smene?',
    ['nacrtati grafik obe prave u koordinatnoj ravni', 'izraziti jednu nepoznatu iz jedne jednačine', 'uvrstiti izraz u drugu jednačinu', 'rešiti dobijenu jednačinu sa jednom nepoznatom'],
    'Metoda smene je računska: izrazimo, uvrstimo i rešimo. Crtanje grafika je druga metoda, iz 7.5.',
    'Ponekad je crtanje dobar način da se proveri rezultat dobijen smenom.',
    'smena', { mediji: koord(-1, 4, -1, 4, {}) });

  S(2, 'Spoji korak metode smene sa njegovim rezultatom.',
    [['izrazimo $x$ iz prve jednačine', 'izraz za $x$ preko $y$'], ['uvrstimo taj izraz u drugu', 'jednačina sa jednom nepoznatom'], ['rešimo jednačinu po $y$', 'vrednost za $y$'], ['vratimo $y$ u izraz za $x$', 'vrednost za $x$']],
    'Koraci se ne mogu menjati redom: prvo izraziti, pa tek onda uvrstiti.',
    'korak', { mediji: kartica(['izraz → jednačina → y → x']) });

  Q(1, 'Koliko koraka ima metoda smene?',
    ['četiri', 'dva', 'tri', 'pet'],
    'Metoda je sistematična: svaki sistem sa dve nepoznate može da se reši istim redosledom koraka.',
    'koraci', { mediji: kartica(['koraci metode smene']) });

  Q(1, 'Koji je cilj metode smene?',
    ['dobiti jednačinu sa jednom nepoznatom', 'dobiti dve iste jednačine', 'dobiti sistem bez rešenja', 'dobiti dve prave koje su paralelne'],
    'U višim razredima ista ideja dolazi u zamenu promenljivih u računu sa integralima.',
    'jednačina', { mediji: kartica(['x + y = 6', 'x − y = 2']) });

  // ════════════════ 7.4 Rešavanje sistema metodom suprotnih koeficijenata ════════════════
  L('Rešavanje sistema metodom suprotnih koeficijenata');

  Q(1, 'Koeficijenti uz $y$ u sistemu $x + y = 7$ i $x − y = 3$ su…',
    ['suprotni brojevi, $1$ i $−1$', 'isti brojevi, oba $1$', 'brojevi čiji je zbir $2$', 'nisu brojevi, nego nepoznate'],
    'Brojevi $a$ i $−a$ daju nulu kad se saberu, a upravo to se dešava sa nepoznatom pri sabiranju jednačina.',
    'suprotni', { mediji: vage([['x', { tx: 'y', b: 2 }], [7]], [['x'], [{ tx: 'y', b: 2 }, 3]]) });

  Q(1, 'Šta dobijemo kad saberemo jednačine $x + y = 7$ i $x − y = 3$?',
    ['$2x = 10$', '$2y = 4$', '$x = 4$', '$0 = 10$'],
    'Sabiranje nepoznate sa njenim suprotnim koeficijentom je kao kad se dve suprotne sile u fizici međusobno ukidaju.',
    'sabiranje', { mediji: kartica(['x + y = 7', 'x − y = 3']) });

  Q(2, 'Posle sabiranja dobijemo $x = 5$. Kako nalazimo $y$?',
    ['uvrstimo $x = 5$ u jednu od jednačina', 'saberemo jednačine ponovo', 'pomnožimo $x$ sa $y$', 'oduzmemo $x$ od $y$'],
    'Posle jedne nepoznate druga se računa lako, pa metode tako „pomažu“ jedna drugoj.',
    'uvrštavanje', { mediji: kartica(['x + y = 7', 'x − y = 3']) });

  Q(2, 'Koeficijenti uz $y$ su isti ($2$ i $2$). Šta treba da uradimo da eliminišemo $y$?',
    ['oduzeti jednu jednačinu od druge', 'sabrati jednačine', 'pomnožiti obe jednačine nulom', 'podeliti jednu jednačinu sa $y$'],
    'Oduzimanje je zapravo sabiranje sa suprotnim znakom: jednačina se pomnoži sa −1 pa sabere.',
    'oduzimanje', { mediji: kartica(['2x + 2y = 8', 'x + 2y = 5']) });

  Q(2, 'Reši sistem: $2x + y = 8$ i $x + y = 5$. Koliko je $x$?',
    ['3', '2', '4', '1'],
    'Redosled oduzimanja je bitan: „druga minus prva“ daje suprotan znak nego „prva minus druga“.',
    'oduzimanje', { mediji: kartica(['2x + y = 8', 'x + y = 5']) });

  Q(2, 'Reši sistem: $3x + 2y = 16$ i $2x − 2y = 4$. Koliko je $x$?',
    ['4', '2', '3', '5'],
    'Kad su koeficijenti veliki, računar ih svodi na iste ili suprotne i tada radi isti princip, bez obzira na broj jednačina.',
    'sabiranje', { mediji: kartica(['3x + 2y = 16', '2x − 2y = 4']) });

  Q(3, 'Reši sistem: $2x + 3y = 13$ i $3x + 2y = 12$. Koliko je $y$?',
    ['3', '2', '1', '4'],
    'Za sisteme sa tri nepoznate isti postupak se ponavlja dvaput: prvo se jedna nepoznata uklanja, pa druga.',
    'eliminacija', { mediji: kartica(['2x + 3y = 13', '3x + 2y = 12']) });

  Q(3, 'Sistem $2x + 3y = 13$ i $3x + 2y = 12$: ako prvu jednačinu pomnožimo sa $2$, a drugu sa $−3$, koeficijenti uz $y$ postaju…',
    ['$6$ i $−6$, suprotni', '$6$ i $6$, jednaki', '$4$ i $−6$, nisu suprotni', '$4$ i $6$, nisu suprotni'],
    'Množenje jednačine negativnim brojem menja znak svih članova i tako pravi suprotne koeficijente.',
    'suprotni', { mediji: kartica(['2x + 3y = 13', '3x + 2y = 12']) });

  Q(2, 'Sabiranjem jednačina $4x + y = 9$ i $2x − y = 3$ dobijamo…',
    ['$6x = 12$', '$3y = 6$', '$6x = 6$', '$2x = 9 + 3$'],
    'Kad su koeficijenti uz nepoznatu suprotni, ona nestaje, a ostale su samo sume leve i desne strane.',
    'sabiranje', { mediji: kartica(['4x + y = 9', '2x − y = 3']) });

  Q(2, 'Oduzmemo jednačine $2x + y = 9$ i $x + y = 6$. Dobijamo…',
    ['$x = 3$', '$x = 15$', '$y = 3$', '$3x = 3$'],
    'Ako je jedna nepoznata ista u obe jednačine, njeno oduzimanje ostavlja samo onu drugu.',
    'oduzimanje', { mediji: kartica(['2x + y = 9', 'x + y = 6']) });

  Q(3, 'U sistemu $2x + 4y = 14$ i $2x − y = 4$ oduzmemo drugu od prve. Koliko je $y$?',
    ['2', '3', '−2', '4'],
    'Ako posle oduzimanja ostane jedna nepoznata sa koeficijentom 5, rešenje se dobija deljenjem sa 5.',
    'oduzimanje', { mediji: kartica(['2x + 4y = 14', '2x − y = 4']) });

  Q(3, 'Reši sistem: $5x + 2y = 12$ i $5x − 2y = 8$. Koliko je $x$?',
    ['2', '1', '3', '4'],
    'Kad je nepoznata uz obe jednačine jednaka, a druga suprotna, sabiranjem ili oduzimanjem dobijamo jednu nepoznatu.',
    'sabiranje', { mediji: kartica(['5x + 2y = 12', '5x − 2y = 8']) });

  Q(1, 'Zašto se pri sabiranju jednačina nepoznata poništi?',
    ['jer su njeni koeficijenti suprotni brojevi', 'jer su jednačine iste', 'jer su koeficijenti jednaki i pozitivni', 'jer je njeno rešenje nula'],
    'Zbir suprotnih brojeva je nula, a to je jedna od osnovnih osobina sabiranja.',
    'suprotni', { mediji: kartica(['a + (−a) = 0']) });

  U(2, 'Koji postupak NIJE deo metode suprotnih koeficijenata?',
    ['izraziti jednu nepoznatu preko druge', 'pomnožiti jednu jednačinu brojem', 'sabrati ili oduzeti jednačine', 'uvrstiti dobijenu vrednost u jednu jednačinu'],
    'Izražavanje nepoznate preko druge je metoda smene. Ovde se nepoznata poništava sabiranjem.',
    'Metoda suprotnih koeficijenata radi bez izražavanja: jednačine se sabiraju ili oduzimaju.',
    'metoda', { mediji: koord(-1, 4, -1, 4, {}) });

  S(2, 'Spoji računsku radnju sa njenim razlogom.',
    [['sabiranje jednačina', 'nepoznata se poništi, jer su koeficijenti suprotni'], ['oduzimanje jednačina', 'nepoznata se poništi, jer su koeficijenti jednaki'], ['množenje jednačine brojem', 'koeficijenti postaju suprotni ili jednaki'], ['uvrštavanje dobijene vrednosti', 'dobija se druga nepoznata']],
    'Množenjem jednačina brojevima stvaramo uslov za eliminaciju. Zato se ta radnja često pojavi pre sabiranja.',
    'eliminacija', { mediji: kartica(['sabiranje · oduzimanje · množenje']) });

  Q(1, 'Posle sabiranja jednačina dobijemo $5y = 15$. Koliko je $y$?',
    ['3', '5', '10', '15'],
    'Ako jednačina ima jednu nepoznatu i koeficijent, rešenje se dobija deljenjem obe strane tim koeficijentom.',
    'vrednost', { mediji: kartica(['5y = 15']) });

  Q(2, 'Sistem $3x − 2y = 4$ i $x + 2y = 12$. Koja je vrednost za $x$?',
    ['4', '3', '5', '6'],
    'Sabiranje ovde ukida $y$, jer su koeficijenti $−2$ i $+2$ suprotni.',
    'sabiranje', { mediji: kartica(['3x − 2y = 4', 'x + 2y = 12']) });

  // ════════════════ 7.5 Rešavanje sistema grafičkom metodom ════════════════
  L('Rešavanje sistema grafičkom metodom');

  Q(1, 'Na crtežu su prave koje predstavljaju dve jednačine sistema. Šta je rešenje sistema?',
    ['tačka preseka dveju pravih', 'tačka preseka sa $x$-osom', 'tačka preseka sa $y$-osom', 'duž između pravih'],
    'Grafička metoda je vizuelna: presek se vidi odmah, bez računa. Zato se često koristi kao prva procena rešenja.',
    'presek', { mediji: prave(2, -1, -1, 5).pitanje, medijiOdgovora: prave(2, -1, -1, 5).odgovor });

  Q(2, 'Na crtežu su prave $y = x + 2$ i $y = −x + 4$. Koje je rešenje sistema?',
    ['(1, 3)', '(3, 1)', '(0, 2)', '(0, 4)'],
    'Ideja da se jednačina nacrta kao linija potiče od Renea Dekarta (17. vek) – po njemu se koordinatni sistem zove i Dekartov.',
    'presek', { mediji: prave(1, 2, -1, 4).pitanje, medijiOdgovora: prave(1, 2, -1, 4).odgovor });

  Q(1, 'Prave $y = 2x$ i $y = x + 2$ seku se u tački…',
    ['(2, 4)', '(4, 2)', '(1, 3)', '(2, 2)'],
    'Prava $y = 2x$ prolazi kroz koordinatni početak, a svaka prava $y = kx$ je takva.',
    'presek', { mediji: prave(2, 0, 1, 2).pitanje, medijiOdgovora: prave(2, 0, 1, 2).odgovor });

  Q(2, 'U kojoj tački prava $y = −x + 2$ seče pravu $y = x$?',
    ['(1, 1)', '(2, 0)', '(0, 2)', '(2, 2)'],
    'Prava $y = x$ je simetrala prvog i trećeg kvadranta: svaka njena tačka ima obe koordinate jednake.',
    'presek', { mediji: prave(-1, 2, 1, 0).pitanje, medijiOdgovora: prave(-1, 2, 1, 0).odgovor });

  Q(3, 'Sa crteža pročitaj rešenje sistema $y = 2x − 3$, $y = x − 1$.',
    ['(2, 1)', '(1, 2)', '(1, 0)', '(3, 3)'],
    'Kad prave imaju različite koeficijente pravca $k$, sigurno se seku u tačno jednoj tački – to znamo i bez crtanja.',
    'presek', { mediji: prave(2, -3, 1, -1).pitanje, medijiOdgovora: prave(2, -3, 1, -1).odgovor });

  Q(2, 'Gde se na crtežu seku prave $y = x$ i $y = −x + 8$?',
    ['(4, 4)', '(8, 0)', '(2, 6)', '(0, 8)'],
    'Svaka tačka prave $y = x$ ima obe koordinate jednake, pa je presek lako pronaći.',
    'presek', { mediji: prave(1, 0, -1, 8).pitanje, medijiOdgovora: prave(1, 0, -1, 8).odgovor });

  Q(2, 'Šta crtež kaže o sistemu $y = x + 3$, $y = x − 1$?',
    ['nema rešenja, prave su paralelne', 'ima jedno rešenje $(0, 3)$', 'ima beskonačno mnogo rešenja', 'ima rešenje $(1, 0)$'],
    'Isti koeficijent pravca znači isti nagib – kao dve trake auto-puta koje idu jedna pored druge i nikad se ne sastaju.',
    'paralelne', { mediji: paralelne(1, 3, -1) });

  Q(1, 'Dve različite prave na crtežu imaju isti nagib. Koliko rešenja ima sistem njihovih jednačina?',
    ['nijedno', 'jedno', 'dva', 'beskonačno mnogo'],
    'Paralelne prave su na stalnom rastojanju po celoj dužini, pa se ne sastaju.',
    'paralelne', { mediji: paralelne(1, 0, 2) });

  Q(3, 'Sistem $y = x + 2$ i $2y = 2x + 4$ ima…',
    ['beskonačno mnogo rešenja', 'nema rešenja', 'jedno rešenje, tačka preseka', 'dva rešenja'],
    'Ako se dve prave poklapaju, grafička metoda pokazuje samo jednu pravu, pa je rešenje cela prava.',
    'poklapanje', { mediji: kartica(['y = x + 2', '2y = 2x + 4']), medijiOdgovora: poklopljene(1, 2) });

  Q(3, 'Koja je tačka preseka pravih $x + y = 6$ i $x − y = 2$?',
    ['(4, 2)', '(2, 4)', '(3, 3)', '(6, 0)'],
    'Iz prve je $y = 6 − x$, a iz druge $y = x − 2$. Izjednačimo: $6 − x = x − 2$, pa je $x = 4$ i $y = 2$.',
    'presek', { mediji: prave(-1, 6, 1, -2).pitanje, medijiOdgovora: prave(-1, 6, 1, -2).odgovor });

  Q(1, 'Prava $x = 2$ je vertikalna, a $y = 3$ horizontalna. Koja tačka je njihov presek?',
    ['(2, 3)', '(3, 2)', '(2, 0)', '(0, 0)'],
    'Vertikalna i horizontalna prava uvek se seku pod pravim uglom.',
    'presek', {
      mediji: koord(-1, 5, -1, 6, {}, { e: [{ lin: [[2, -1], [2, 6]], b: 1, debljina: 3 }, { lin: [[-1, 3], [5, 3]], b: 2, debljina: 3 }] }),
      medijiOdgovora: koord(-1, 5, -1, 6, { P: [2, 3] }, { istakni: ['P'], e: [{ lin: [[2, -1], [2, 6]], b: 1, debljina: 3 }, { lin: [[-1, 3], [5, 3]], b: 2, debljina: 3 }] }),
    });

  Q(1, 'Gde grafik jednačine $y = 2x − 4$ seče $x$-osu?',
    ['u tački $(2, 0)$', 'u tački $(0, −4)$', 'u tački $(4, 0)$', 'u tački $(−2, 0)$'],
    'Na $x$-osi je $y = 0$, a na $y$-osi je $x = 0$. Tako se lako nađu oba preseka sa osama.',
    'osa', {
      mediji: G({}, [{ mreza: [-1, 4, -7, 3], ose: ['x', 'y'] }, prava(2, -4, -1, 3, { b: 1 })], { velicina: 240 }),
      medijiOdgovora: G({ X: [2, 0] }, [{ mreza: [-1, 4, -7, 3], ose: ['x', 'y'] }, prava(2, -4, -1, 3, { b: 1 }), { tacka: 'X', b: 3 }, { tx: '(2, 0)', at: [2.3, -0.6], b: 3, vel: 15 }], { bezImena: ['X'], velicina: 240 }),
    });

  Q(1, 'Prave $y = x + 2$ i $y = −x + 4$ seku se u tački…',
    ['(1, 3)', '(3, 1)', '(2, 4)', '(0, 2)'],
    'Prava sa pozitivnim koeficijentom pravca $k > 0$ raste, a sa $k < 0$ opada.',
    'presek', { mediji: prave(1, 2, -1, 4).pitanje, medijiOdgovora: prave(1, 2, -1, 4).odgovor });

  Q(2, 'Koja je glavna mana grafičkog rešavanja sistema?',
    ['teško je tačno očitati tačku preseka', 'prave uvek imaju tri tačke preseka', 'grafik ne sme da sadrži koordinatne ose', 'prave se nikad ne seku'],
    'Na papiru greška od nekoliko milimetara može da da pogrešan broj, zato se rešenje proverava računom.',
    'očitavanje', { mediji: dvePrave(2, 0, -1, 1, { presek: false }) });

  Q(2, 'Kakav je međusobni položaj pravih u sistemu $x + y = 3$ i $x + y = 5$?',
    ['paralelne prave, sistem nema rešenja', 'poklopljene prave, beskonačno mnogo rešenja', 'seku se u tački $(1, 4)$', 'seku se u tački $(4, 1)$'],
    'Koeficijent pravca obe prave je $−1$, a razlika je u slobodnom članu, što je tipično za paralelne prave.',
    'paralelne', { mediji: kartica(['x + y = 3', 'x + y = 5']) });

  Q(2, 'Zašto poklopljene prave daju beskonačno mnogo rešenja?',
    ['jer svaka tačka jedne prave pripada i drugoj', 'jer se seku u koordinatnom početku', 'jer su obe prave vertikalne', 'jer imaju različite koeficijente pravca'],
    'Dve iste prave su najjednostavniji primer neodređenog sistema, pa se ponekad zadaju u drugom obliku da zbunjuju.',
    'poklapanje', { mediji: poklopljene(1, 2) });

  U(2, 'Koja prava NE prolazi kroz tačku $(2, 3)$?',
    ['$y = 2x − 2$', '$y = x + 1$', '$y = 3$', '$x = 2$'],
    'Tačku proveravamo uvrštavanjem u jednačinu: prava prolazi kroz tačku ako je jednakost tačna.',
    'Uvrstimo $x = 2$ u $y = 2x − 2$: dobijamo $y = 2$, a treba $3$.',
    'tačka', { mediji: koord(-1, 4, -1, 5, { P: [2, 3] }, { istakni: ['P'] }) });

  // ════════════════ 7.6 Rešavanje nekih karakterističnih sistema ════════════════
  L('Rešavanje nekih karakterističnih sistema');

  Q(1, 'Jednačina $0 · x = 0$ ima…',
    ['beskonačno mnogo rešenja', 'nijedno rešenje', 'tačno jedno rešenje $x = 0$', 'rešenje $x = 1$'],
    'Jednačina koja je tačna za sve vrednosti nepoznate zove se identitet.',
    'beskonačno', { mediji: kartica(['0 · x = 0']) });

  Q(1, 'Jednačina $0 · x = 5$ ima…',
    ['nijedno rešenje', 'beskonačno mnogo rešenja', 'jedno rešenje $x = 5$', 'rešenje $x = 0$'],
    'Ovakve jednačine se zovu protivrečne: ne mogu biti tačne ni za jednu vrednost.',
    'protivrečan', { mediji: kartica(['0 · x = 5']) });

  Q(3, 'Sistem $x + y = 5 + y$ i $3x = 18$ je…',
    ['nemoguć, nema rešenja', 'ima jedno rešenje $(6, 0)$', 'neodređen, beskonačno rešenja', 'ima rešenje $(5, 6)$'],
    'Takvi sistemi se pojavljuju kad se u postavci zadatka nalaze dva međusobno isključiva uslova.',
    'nemoguć', { mediji: kartica(['x + y = 5 + y', '3x = 18']) });

  Q(2, 'Sistem $2x + 3y = 7$ i $4x + 6y = 22$ je…',
    ['nemoguć, nema rešenja', 'ima jedno rešenje', 'neodređen, beskonačno rešenja', 'ima rešenje $(1, 1)$'],
    'Sistemi sa istim levim stranama, a različitim desnim, daju paralelne prave.',
    'nemoguć', { mediji: kartica(['2x + 3y = 7', '4x + 6y = 22']) });

  Q(2, 'Sistem $x − y = 5$ i $3x − 3y = 15$ je…',
    ['neodređen, beskonačno rešenja', 'nemoguć, nema rešenja', 'ima jedno rešenje $(5, 0)$', 'ima dva rešenja'],
    'Za neodređen sistem dovoljna je jedna jednačina; druga ne dodaje ništa novo.',
    'neodređen', { mediji: kartica(['x − y = 5', '3x − 3y = 15']), medijiOdgovora: poklopljene(1, -5, [-1, 8, -7, 4]) });

  U(2, 'Koji sistem NIJE neodređen (nema beskonačno mnogo rešenja)?',
    ['$x = 2$ i $y = 3$', '$x − y = 1$ i $2x − 2y = 2$', '$x + y = 4$ i $2x + 2y = 8$', '$3x = 3y + 3$ i $x − y = 1$'],
    'Sistem $x = 2$ i $y = 3$ ima jedno rešenje $(2, 3)$. Ostali su neodređeni jer je jedna jednačina ista kao druga, samo pomnožena ili podeljena.',
    'Neodređen sistem ima dve iste prave, pa svaka tačka prave rešava obe jednačine.',
    'rešenje', { mediji: kartica(['x + y = 2', '2x + 2y = 4']) });

  Q(2, 'Sistem $2x + y = 4$ i $4x + 2y = 9$ je…',
    ['nemoguć (nema rešenja)', 'neodređen (beskonačno rešenja)', 'ima tačno jedno rešenje', 'ima rešenje $(2, 0)$'],
    'Sisteme sa „nemogućim“ desnim stranama nazivamo i protivrečni.',
    'nemoguć', { mediji: kartica(['2x + y = 4', '4x + 2y = 9']) });

  Q(2, 'Sistem $3x − y = 2$ i $6x − 2y = 4$ je…',
    ['neodređen, beskonačno rešenja', 'nemoguć, nema rešenja', 'ima jedno rešenje', 'paralelan, pa nema zajedničkih tačaka'],
    'U tabeli vrednosti za ovakav sistem dobijaju se iste tačke za svaku vrednost $x$.',
    'neodređen', { mediji: kartica(['3x − y = 2', '6x − 2y = 4']) });

  Q(2, 'Ako jednačinu $3x + 3y = 9$ podelimo sa $3$, dobijamo…',
    ['$x + y = 3$', '$x + y = 9$', '$x + y = 27$', '$3x + y = 3$'],
    'Podeliti jednačinu brojem je ekvivalentna transformacija, ali deliti nulom nije dozvoljeno.',
    'deljenje', { mediji: kartica(['3x + 3y = 9', 'x − y = 1']) });

  Q(3, 'Reši sistem: $x + 2y = 8$ i $x = 2y$. Koji par je rešenje?',
    ['$(4, 2)$', '$(2, 4)$', '$(8, 0)$', '$(6, 1)$'],
    'Sistem sa $x = 2y$ je primer kad jedna nepoznata zavisi od druge; takvih sistema ima mnogo u fizici.',
    'smena', { mediji: kartica(['x + 2y = 8', 'x = 2y']) });

  Q(2, 'Koliko je $x$ ako je sistem $2(x + y) = 12$ i $x = y + 2$?',
    ['4', '2', '6', '3'],
    'Zagrade i razlomci se najpre sređuju, pa tek onda rešava sistem.',
    'smena', { mediji: kartica(['2(x + y) = 12', 'x = y + 2']) });

  Q(2, 'Uvođenjem smena $a = \\frac{1}{x}$ i $b = \\frac{1}{y}$, sistem $\\frac{1}{x} + \\frac{1}{y} = 5$ i $\\frac{2}{x} − \\frac{3}{y} = 1$ postaje…',
    ['$a + b = 5$ i $2a − 3b = 1$', '$a · b = 5$ i $2a − 3b = 1$', '$x + y = 5$ i $2x − 3y = 1$', '$a + b = 5$ i $2a + 3b = 1$'],
    'Razlomci u jednačinama se lako svode na linearne ako uvedemo smenu za $\\frac{1}{x}$.',
    'smena', { mediji: kartica(['1/x + 1/y = 5', '2/x − 3/y = 1']) });

  Q(3, 'Sistem $2x + y = x + 3$ i $x − y = 1$ se najpre sređuje. Kako glasi prva jednačina posle sređivanja?',
    ['$x + y = 3$', '$3x + y = 3$', '$x + y = x + 3$', '$2x + y = 3$'],
    'Sređivanje podrazumeva da se svi članovi sa nepoznatom skupe na jednu stranu.',
    'sređivanje', { mediji: kartica(['2x + y = x + 3', 'x − y = 1']) });

  Q(1, 'Sistem $x + y = 4$ i $x + y = 6$ je…',
    ['nemoguć, nema rešenja', 'neodređen', 'ima jedno rešenje', 'ima rešenje $(1, 3)$'],
    'Dve paralelne prave su kao dve železničke šine: nikad se ne sretnu.',
    'nemoguć', { mediji: kartica(['x + y = 4', 'x + y = 6']) });

  Q(3, 'Sistem $0 · x + 2y = 6$ i $x − y = 1$ ima rešenje…',
    ['$(4, 3)$', '$(3, 4)$', '$(2, 3)$', '$(1, 2)$'],
    'Kad jedan član nestane, jednačina postaje jednostavnija i daje odmah vrednost za drugu nepoznatu.',
    'smena', { mediji: kartica(['0 · x + 2y = 6', 'x − y = 1']) });

  Q(1, 'Kakav je sistem $x = 3$ i $x = 5$?',
    ['nemoguć, nema rešenja', 'neodređen', 'ima rešenje $(3, 5)$', 'ima rešenje $(5, 3)$'],
    'Ovakvi sistemi se dešavaju kad u tekstu zadatka postoje dva različita uslova za istu veličinu.',
    'nemoguć', { mediji: kartica(['x = 3', 'x = 5']) });

  S(2, 'Spoji sistem sa njegovom vrstom.',
    [['$x + y = 2$ i $x + y = 5$', 'nemoguć, nema rešenja'], ['$x − y = 1$ i $2x − 2y = 2$', 'neodređen, beskonačno rešenja'], ['$x = 2$ i $y = 3$', 'jedno rešenje $(2, 3)$'], ['$3x = 9$ i $y = x$', 'jedno rešenje $(3, 3)$']],
    'Vrstu sistema vidimo po tome da li su jednačine iste, protivrečne ili različite.',
    'vrsta', { mediji: kartica(['nemoguć · neodređen · jedinstven']) });

  // ════════════════ 7.7 Primena sistema linearnih jednačina ════════════════
  L('Primena sistema linearnih jednačina');

  Q(1, 'Zbir dva broja je $10$, a razlika $4$. Koji je veći broj?',
    ['7', '6', '5', '8'],
    'Zadaci sa zbirom i razlikom su osnova algebre: od starih babilonskih tablica do danas.',
    'zbir', { mediji: vage([['x', { tx: 'y', b: 2 }], [10]], [['x'], [{ tx: 'y', b: 2 }, 4]]) });

  Q(1, 'Kako se u zadatku „zbir dva broja je $100$, a njihova razlika $44$“ zapisuje sistem?',
    ['$x + y = 100$ i $x − y = 44$', '$x · y = 100$ i $x + y = 44$', '$x + y = 44$ i $x − y = 100$', '$x = 100$ i $y = 44$'],
    'Zadatke sa zbirom i razlikom ne treba pogađati: sistem uvek daje tačno rešenje.',
    'zbir', { mediji: kartica(['zbir je 100', 'razlika je 44']) });

  Q(1, 'U kavezu ima zečeva i kokoški: ukupno $15$ glava i $42$ noge. Koji sistem to opisuje, ako je $x$ broj zečeva, a $y$ broj kokoški?',
    ['$x + y = 15$ i $4x + 2y = 42$', '$x + y = 15$ i $2x + 4y = 42$', '$x + y = 42$ i $2x + 4y = 15$', '$x + y = 15$ i $x + y = 42$'],
    'Zagonetka o zečevima i kokoškama je stari klasik matematičkih zagonetki, i uvek se rešava sistemom.',
    'kavez', { mediji: kartica(['zečevi: x, kokoške: y', 'glave: 15', 'noge: 42']) });

  Q(2, 'Tri olovke i dve sveske koštaju $110$ dinara, a dve olovke i tri sveske $100$ dinara. Koliko košta sveska?',
    ['16 dinara', '26 dinara', '20 dinara', '12 dinara'],
    'Dve kupovine daju dve jednačine; treća kupovina bi bila suvišna ili bi dodala uslov.',
    'cena', { mediji: kartica(['3o + 2s = 110', '2o + 3s = 100']) });

  Q(1, 'Otac je $4$ puta stariji od sina, a zajedno imaju $45$ godina. Koji sistem odgovara ovom zadatku?',
    ['$o = 4s$ i $o + s = 45$', '$o = s + 4$ i $o + s = 45$', '$o = 4s$ i $o − s = 45$', '$4o = s$ i $o + s = 45$'],
    'Razlika u godinama oca i sina ostaje ista kako vreme prolazi, a odnos se menja.',
    'godine', { mediji: kartica(['otac: o, sin: s']) });

  Q(3, 'Zbir dva broja je $52$. Kad se veći podeli manjim, količnik je $9$, a ostatak $2$. Koji je manji broj?',
    ['5', '47', '9', '4'],
    'Deljenje sa ostatkom važi po pravilu: deljenik je jednak količniku puta delilac, plus ostatak.',
    'ostatak', { mediji: kartica(['x + y = 52', 'x = 9y + 2']) });

  Q(2, 'Prava $y = kx + n$ prolazi kroz tačke $A(1, 3)$ i $B(4, 6)$. Koji sistem određuje $k$ i $n$?',
    ['$k + n = 3$ i $4k + n = 6$', '$k + n = 6$ i $4k + n = 3$', '$k · n = 3$ i $4 + n = 6$', '$k + 3 = n$ i $4k = 6$'],
    'Prava se može zadati dvema tačkama. To je osnova linearne interpolacije, koja se koristi u grafici računara.',
    'prava', { mediji: koord(-1, 6, -1, 8, { A: [1, 3], B: [4, 6] }, { istakni: ['A', 'B'] }) });

  Q(2, 'Koja je jednačina prave koja prolazi kroz tačke $A(1, 3)$ i $B(4, 6)$?',
    ['$y = x + 2$', '$y = 2x + 1$', '$y = x − 2$', '$y = 3x$'],
    'Linearna interpolacija je način da se između dve tačke izračuna vrednost bilo gde na pravoj.',
    'prava', {
      mediji: koord(-1, 6, -1, 8, { A: [1, 3], B: [4, 6] }, { istakni: ['A', 'B'] }),
      medijiOdgovora: koord(-1, 6, -1, 8, { A: [1, 3], B: [4, 6] }, { istakni: ['A', 'B'], e: [prava(1, 2, -1, 6, { b: 1 })] }),
    });

  Q(3, 'Pomešali smo rastvor od $30\\%$ i rastvor od $50\\%$ i dobili $10$ litara rastvora od $45\\%$. Koliko litara rastvora od $30\\%$ je bilo?',
    ['2,5 l', '7,5 l', '5 l', '4 l'],
    'Mešanje rastvora u hemiji radi po istom pravilu: količine i koncentracije se računaju zajedno.',
    'rastvor', { mediji: kartica(['30%: x litara', '50%: y litara', 'ukupno: 10 litara, 45%']) });

  Q(1, 'Tri olovke i četiri sveske koštaju $110$ dinara, a četiri olovke i tri sveske $100$ dinara. Koliko košta olovka?',
    ['10 dinara', '20 dinara', '30 dinara', '5 dinara'],
    'Zbirom dve jednačine dobija se ukupan broj predmeta, a iz njega lako nalazimo pojedinačne cene.',
    'cena', { mediji: kartica(['3o + 4s = 110', '4o + 3s = 100']) });

  Q(3, 'Zbir cifara dvocifrenog broja je $9$. Kad se cifre zamene mestima, dobijeni broj je veći za $9$. Koji je to broj?',
    ['45', '54', '36', '63'],
    'Dvocifreni broj sa ciframa $x$ i $y$ piše se kao $10x + y$, pa se zamena cifara računa bez pogađanja.',
    'cifre', { mediji: kartica(['x = desetice, y = jedinice', 'x + y = 9', '10y + x = 10x + y + 9']) });

  Q(3, 'Brod uz reku pređe $30$ km za $3$ sata, a niz reku istih $30$ km za $2$ sata. Kolika je brzina reke?',
    ['2,5 km/h', '5 km/h', '10 km/h', '12,5 km/h'],
    'Razlika brzina uz reku i niz reku jednaka je dvostrukoj brzini reke, pa se ona lako izračuna.',
    'reka', { mediji: reka('~uz reku: 30 km za 3 h', '~niz reku: 30 km za 2 h') });

  Q(2, 'Brod uz reku pređe $30$ km za $3$ sata. Ako je $x$ brzina broda, a $y$ brzina reke, koja jednačina važi za vožnju uz reku?',
    ['$x − y = 10$', '$x + y = 10$', '$x · y = 10$', '$x − y = 30$'],
    'Vožnja uz reku je sporija jer voda „vuče“ brod nazad.',
    'brzina', { mediji: reka('~uz reku', '~niz reku') });

  Q(2, 'Obim pravougaonika je $36$ cm, a dužina je dva puta veća od širine. Koji sistem opisuje dužinu $a$ i širinu $b$?',
    ['$a + b = 18$ i $a = 2b$', '$a + b = 36$ i $a = 2b$', '$2a + 2b = 9$ i $a = b$', '$a · b = 36$ i $a = 2b$'],
    'Obim pravougaonika je $2(a + b)$, pa je polovina obima zbir stranica.',
    'obim', { mediji: pravougaonik() });

  Q(3, 'Pravougaonik iz prethodnog pitanja ima obim $36$ cm, a dužina mu je dva puta veća od širine. Kolika mu je površina?',
    ['72 cm²', '36 cm²', '24 cm²', '108 cm²'],
    'Kad su dužina i širina poznate, površina je njihov proizvod, a obim njihov zbir.',
    'površina', { mediji: pravougaonik(), medijiOdgovora: pravougaonik(12, 6, { a: '12 cm', b: '6 cm' }) });

  S(2, 'Poveži veličinu iz zadatka sa odgovarajućom jednačinom.',
    [['zbir dva broja je $30$', '$x + y = 30$'], ['veći je za $6$ od manjeg', '$x − y = 6$'], ['prvi je dvostruko veći od drugog', '$x = 2y$'], ['$3$ olovke i $2$ sveske koštaju $50$', '$3x + 2y = 50$']],
    'Iz reči zadatka izdvajamo veličine i odnose; tada se odmah vidi koja jednačina odgovara kojoj rečenici.',
    'prevođenje', { mediji: kartica(['tekst → jednačina']) });

  U(2, 'Koji sistem NIJE zapisan iz uslova „zbir dva broja je $20$, a jedan je tri puta veći od drugog“?',
    ['$x + y = 20$ i $x = y + 3$', '$x + y = 20$ i $x = 3y$', '$x + y = 20$ i $y = 3x$', '$x + y = 20$ i $3y − x = 0$'],
    'Razlika $3$ znači da je veći za $3$ ($x = y + 3$), a „tri puta veći“ znači $x = 3y$.',
    'Ključna reč u zadatku, kao „puta“ ili „za“, određuje kako se piše odnos među brojevima.',
    'uslov', { mediji: kartica(['zbir: 20', 'jedan je tri puta veći']) });
};
