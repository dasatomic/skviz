// Tema „Linearne jednačine“ (prvi deo poglavlja „Linearne jednačine i nejednačine“), 8. razred:
// pojam jednačine, ekvivalentne jednačine, transformacije (vaga), rešavanje, jednačine koje se svode
// na linearnu, primene (zadaci sa rečima, kretanje, mešanje). Teorija je „u glavi“, uz crteže.
module.exports = ({ L, Q, U, S, G, proveri, r, brojevna, terazije }) => {
  const GO = { velicina: 240 };
  // vaga: levo/desno = niz kutija ({ tx, b }) i tegova (broj ili { tx, b, teg: 1 })
  const V = (levo, desno, x = {}) => terazije(levo, desno, { velicina: 250, ...x });
  // brojevna prava sa tačkama [vrednost, natpis, boja]
  const P = (od, doo, tacke = [], x = {}) => brojevna(od, doo, tacke, { velicina: 280, ...x });
  // ponuđene vrednosti na brojevnoj pravoj, bez odgovora (tačke sa „?“)
  const KAND = (vrednosti) => P(Math.min(...vrednosti) - 1, Math.max(...vrednosti) + 1, vrednosti.map((v) => [v, '?', 1]));
  // trake: delovi = [[širina, natpis, boja], …] jedan pored drugog
  const TR = (delovi, x = {}) => {
    const { y = 0, h = 1.2, velicina = 280 } = x;
    const el = [];
    let xx = 0;
    for (const [w, tx, b = 1] of delovi) {
      el.push({ lin: [[xx, y], [xx + w, y], [xx + w, y + h], [xx, y + h]].map(([a, c]) => [r(a), r(c)]), zatv: 1, b, gusto: 1 });
      if (tx) el.push({ tx, at: [r(xx + w / 2), r(y + h / 2 - 0.2)], vel: 16 });
      xx += w;
    }
    return G({ O: [0, 0] }, el, { bezImena: ['O'], velicina });
  };
  // staza na pravoj: A (levo) i B (desno) na rastojanju d; strelice = [[od, do, boja, natpis, visina]]
  const STAZA = (d, strelice = []) => {
    const el = [{ lin: [[0, 0], [d, 0]], b: 4, debljina: 3 }, { tacka: 'A', b: 0 }, { tacka: 'B', b: 0 }];
    for (const [a, b2, bb, natpis, y = 1.6] of strelice) {
      el.push({ lin: [[a, y], [b2, y]], str: 1, b: bb, debljina: 3 });
      if (natpis) el.push({ tx: natpis, at: [r((a + b2) / 2), r(y + 1.1)], b: bb, vel: 15 });
    }
    return G({ A: [0, 0], B: [d, 0] }, el, { velicina: 280, bezImena: [] });
  };

  // provere računa (gradnja pukne ako ne važi)
  proveri(2 * 17 + 3 * 22 === 5 * 20, 'finoća legure 20 karata');
  proveri(Math.abs(0.8 * 100 + 0.35 * 80 - 0.6 * 180) < 1e-9, 'mešanje alkohola: 108 l od 180 l');
  proveri(Math.abs(1 / (1 / 2 + 1 / 3 + 1 / 4) - 12 / 13) < 1e-9, 'sena: t = 12/13 meseca');
  proveri(Math.abs(Math.hypot(10, 24) - 26) < 1e-9 && 10 * 24 / 2 === 120, 'pravougli trougao 10, 24, 26');
  proveri(16 * 16 + 12 * 12 === 20 * 20 && 32 - 12 === 20, 'drvo: h = 12 m, vrh pada na 16 m');
  proveri(84 / 6 + 84 / 12 + 84 / 7 + 5 + 84 / 2 + 4 === 84, 'Diofant: x = 84');
  proveri(1 / (1 / 6 + 1 / 12) === 4, 'bazen: 4 h');
  proveri(180 / 90 === 2 && 60 * 3 === 180, 'put 180 km');
  proveri(5 * 6 + 4 * 6 === 54, 'pešaci: 6 h');
  proveri(33 + 39 + 12 + 108 === 192 && (36 - 3) === 33 && 3 * 36 === 108 && 36 / 3 === 12, 'četiri broja: zbir 192');

  // ════════ 1. Pojam jednačine ════════
  L('Pojam jednačine');
  Q(1, 'Kako se zove jednakost u kojoj sa obe strane stoje samo brojevi, npr. $3 + 4 = 2 + 5$?',
    ['Brojevna jednakost', 'Jednačina', 'Nejednakost sa znakom <', 'Identitet'],
    'Znak = uveo je velški matematičar Robert Rekord 1557. godine. Napisao je da se ne može naći ništa jednakije od dve paralelne linije.', 'brojevna',
    { mediji: V([3, 4], [2, 5]) });
  U(1, 'Koja od ovih jednakosti NIJE jednačina po $x$?',
    ['$3 + 4 = 7$', '$x + 4 = 9$', '$2x + 1 = 11$', '$x² = 9$'],
    'Prva jednakost nema nepoznatu $x$, pa je to brojevna jednakost. Ostale tri sadrže $x$ i zato su jednačine.',
    'Brojevna jednakost može biti tačna ili netačna, ali ne sadrži slova.', 'jednačina', {});
  Q(1, 'Koja jednakost je jednačina?',
    ['$3x + 2 = 17$', '$3 + 2 = 17$', '$15 : 5 = 3$', '$5 · 5 − 7 = 18$'],
    'Jednačina ima bar jednu nepoznatu, obično $x$. Ostale tri su brojevne jednakosti, tačne ili netačne.', 'nepoznata',
    { mediji: V([{ tx: '?', b: 1 }, 2], [17]), medijiOdgovora: V([{ tx: '3x', b: 1 }, 2], [{ tx: '17', b: 3, teg: 1 }]) });
  Q(2, 'Koliko rešenja u skupu realnih brojeva ima jednačina $x² = 49$?',
    ['Dva: $7$ i $−7$', 'Jedno: $7$', 'Nijedno', 'Beskonačno mnogo'],
    'Kvadrat i pozitivnog i negativnog broja daje pozitivan rezultat, pa su oba rešenja. Za $x² = −49$ nema rešenja, jer kvadrat nikad nije negativan.', 'kvadrat',
    { mediji: P(-8, 8), medijiOdgovora: P(-8, 8, [[7, '7', 3], [-7, '−7', 3]]) });
  Q(1, 'Koji broj je rešenje jednačine $2x + 1 = 9$?',
    ['$4$', '$5$', '$−8$', '$3$'],
    'Reč „algebra“ potiče od arapske reči al-džebr iz naslova knjige al-Horezmija iz oko 820. godine, u kojoj se jednačine rešavaju.', 'rešenje',
    { mediji: V([{ tx: '2x', b: 1 }, 1], [9]), medijiOdgovora: P(0, 10, [[4, 'x = 4', 3]]) });
  Q(2, 'Koliko rešenja ima jednačina $x + 3 = x + 7$?',
    ['Nijedno', 'Jedno: $4$', 'Beskonačno mnogo', 'Jedno: $10$'],
    'Ako sa obe strane oduzmemo $x$, ostaje $3 = 7$, što nije tačno ni za jedan broj. Vaga bi uvek bila nagnuta na desnu stranu.', 'nemoguća',
    { mediji: V(['x', 3], ['x', 7], { nagib: -1 }) });
  Q(2, 'Koliko rešenja ima jednačina $2(x + 1) = 2x + 2$?',
    ['Beskonačno mnogo (svaki broj)', 'Nijedno, jer su strane različite', 'Jedno: $1$', 'Jedno: $0$'],
    'Kad razvijemo zagradu, obe strane postaju iste, pa svaki broj zadovoljava jednačinu. Takva jednačina se zove identitet.', 'identitet',
    { mediji: P(-3, 3), medijiOdgovora: V([{ tx: '2x + 2', b: 1 }], [{ tx: '2x + 2', b: 3 }]) });
  S(1, 'Spoji pojam sa njegovim značenjem.',
    [['Jednačina', 'jednakost sa nepoznatom'], ['Rešenje', 'broj koji je zadovoljava'], ['Identitet', 'važi za svaki broj'], ['Brojevna jednakost', 'bez slova, samo brojevi']],
    'Reč „identitet“ dolazi od latinske reči „idem“, što znači „isti“: sa obe strane stoji isto.', 'pojmovi', {});
  Q(1, 'Šta znači „rešiti jednačinu“ $x + 2 = 7$?',
    ['Naći broj koji je zadovoljava', 'Nacrtati vagu', 'Sabrati sve brojeve u jednačini i podeliti ih', 'Podeliti $7$ sa $2$'],
    'Rešiti jednačinu znači naći sve brojeve koji, umesto nepoznate, daju tačnu jednakost. Ovde je to $x = 5$.', 'rešiti',
    { mediji: V(['x', 2], [7]) });
  Q(3, 'Koja od ponuđenih vrednosti je rešenje jednačine $a² − 2a = 3$?',
    ['$−1$', '$1,5$', '$2$', '$0$'],
    'Za $a = −1$ je $(−1)² − 2 · (−1) = 1 + 2 = 3$. Za $a = 3$ takođe važi, pa jednačina ima dva rešenja.', 'provera',
    { mediji: KAND([-1, 1, 2, 0]) });
  Q(2, 'Broj $5$ je rešenje jednačine…',
    ['$3x − 4 = 11$', '$3x − 4 = 10$', '$x + 5 = 0$', '$2x + 3 = 5$'],
    'Proveravamo zamenom: $3 · 5 − 4 = 11$, pa je to tačno. Za drugu jednačinu dobijamo $11 ≠ 10$, a za ostale $x$ nije $5$.', 'provera',
    { mediji: KAND([5, 3, 7, 0]) });
  Q(3, 'Koliko rešenja u skupu realnih brojeva ima jednačina $|x| = −3$?',
    ['Nijedno', 'Jedno: $3$', 'Dva: $3$ i $−3$', 'Jedno: $0$'],
    'Apsolutna vrednost broja je rastojanje od nule, pa nikad nije negativna. Zato jednačina $|x| = −3$ nema rešenja.', 'apsolutna',
    { mediji: P(-5, 5) });
  Q(2, 'Koja jednačina ima samo jedno rešenje $x = 4$?',
    ['$x − 4 = 0$', '$x² − 16 = 0$', '$|x| = 4$', '$x + 4 = 0$'],
    'Jednačine $x² = 16$ i $|x| = 4$ imaju i $4$ i $−4$. Jednačina $x + 4 = 0$ ima rešenje $−4$.', 'jedinstveno',
    { mediji: P(-6, 6) });
  Q(3, 'Koliko rešenja ima jednačina $(x − 2)(x + 3) = 0$?',
    ['Dva: $2$ i $−3$', 'Jedno: $2$', 'Nijedno', 'Tri: $2$, $3$ i $−2$'],
    'Proizvod je nula ako je bar jedan činilac nula: $x − 2 = 0$ daje $x = 2$, a $x + 3 = 0$ daje $x = −3$.', 'proizvod',
    { mediji: P(-4, 4), medijiOdgovora: P(-4, 4, [[-3, '−3', 3], [2, '2', 3]]) });
  Q(1, 'Kako se zove vrednost nepoznate koja jednačinu pretvara u tačnu jednakost?',
    ['Rešenje', 'Koeficijent', 'Konstanta', 'Izraz'],
    'Konstanta je broj koji se ne menja, a koeficijent je broj uz nepoznatu. Rešenje je vrednost nepoznate koja jednakost čini tačnom.', 'rešenje',
    { mediji: V(['x'], [4]) });
  Q(2, 'Koja jednakost važi za svaki realan broj $x$?',
    ['$x + x = 2x$', '$x + 1 = x$', '$2x = x$', '$x · x · x = x$'],
    'Zbir dva jednaka sabirka je dvostruki sabirak, pa je $x + x = 2x$ za svaki $x$. Ostale jednakosti nisu tačne za sve brojeve.', 'identitet',
    { mediji: P(-3, 3) });
  Q(3, 'Koliko rešenja u skupu realnih brojeva ima jednačina $x² + 4 = 0$?',
    ['Nijedno', 'Jedno: $0$', 'Dva: $2$ i $−2$', 'Jedno: $4$'],
    'Kvadrat realnog broja nikad nije negativan, pa je $x² + 4$ uvek bar $4$. Zato jednačina nema rešenja.', 'kvadrat',
    { mediji: P(-4, 4) });

  // ════════ 2. Ekvivalentne jednačine; linearna jednačina ════════
  L('Ekvivalentne jednačine; linearna jednačina');
  Q(1, 'Kada su dve jednačine ekvivalentne?',
    ['Kad imaju isti skup rešenja', 'Kad imaju isti broj članova i znakova', 'Kad su obe tačne za $x = 0$', 'Kad im je ista leva strana'],
    'Ekvivalentne jednačine mogu da izgledaju različito, ali imaju ista rešenja. Primer: $x = 3$ i $2x = 6$.', 'ekvivalent',
    { mediji: P(0, 8, [[4, '?', 1], [4, '?', 2]]) });
  Q(1, 'Koja jednačina ima isto rešenje kao $x = 4$?',
    ['$2x = 8$', '$x + 1 = 4$', '$x − 1 = 4$', '$x² = 16$'],
    'Jedino $2x = 8$ ima isto rešenje, $x = 4$. Jednačina $x + 1 = 4$ daje $x = 3$, a $x − 1 = 4$ daje $x = 5$. Jednačina $x² = 16$ ima i $−4$.', 'ekvivalent',
    { mediji: KAND([3, 4, 5, -4]), medijiOdgovora: P(-6, 6, [[4, '4', 3]]) });
  Q(1, 'Šta je linearna jednačina po $x$?',
    ['Jednačina oblika $ax = b$, gde su $a$ i $b$ realni brojevi', 'Jednačina oblika $x² = b$', 'Jednačina sa dve nepoznate', 'Jednačina sa razlomkom u kojoj je $x$ u imeniocu'],
    'Linearna jednačina po $x$ može da se svede na oblik $ax = b$. Nepoznata je na prvom stepenu.', 'linearna',
    { mediji: V([{ tx: 'a · x', b: 1 }], [{ tx: 'b', b: 3, teg: 1 }]) });
  Q(2, 'Koja od ovih jednačina NIJE linearna po $x$?',
    ['$x² = 49$', '$3x − 4 = 0$', '$\\frac{x}{2} = 7$', '$5 − x = 2x$'],
    'Jednačina $x² = 49$ ima $x$ na drugom stepenu, pa nema oblik $ax = b$. Ostale se svode na $ax = b$.', 'stepen',
    { mediji: P(-8, 8) });
  Q(2, 'Da li je jednačina $2x + 3 = 5x − 1$ linearna?',
    ['Da, svodi se na $ax = b$', 'Ne, jer je $x$ sa obe strane', 'Ne, jer ima sabiranje', 'Ne, jer nema rešenja'],
    'Prebacimo članove sa $x$ na jednu stranu, a brojeve na drugu: $−3x = −4$. Jednačina je linearna sa $a = −3$, $b = −4$.', 'svođenje',
    { mediji: V([{ tx: '2x', b: 1 }, 3], [{ tx: '5x', b: 3 }, { tx: '1', b: 3, teg: 1 }]) });
  Q(2, 'Koja jednačina je ekvivalentna jednačini $2x = 12$?',
    ['$x = 6$', '$x = 24$', '$x + 2 = 12$', '$x = 12$'],
    'Obe strane podelimo sa $2$ i dobijamo $x = 6$. Ekvivalentne jednačine imaju isto rešenje, pa je $x = 6$ jedina od ovih.', 'ekvivalent',
    { mediji: V([{ tx: '2x', b: 1 }], [{ tx: '12', b: 3, teg: 1 }]) });
  U(1, 'Koja od ovih jednačina NIJE linearna?',
    ['$y² − 49 = 0$', '$4z = 12$', '$7x + 1 = 2x − 3$', '$\\frac{x}{3} = 5$'],
    'Jednačina $y² − 49 = 0$ ima nepoznatu na drugom stepenu, pa nije linearna. Ostale se svode na oblik $ax = b$.',
    'Jednačina $y² = 49$ ima dva rešenja, a linearna jednačina ima najviše jedno.', 'linearna',
    { mediji: P(-8, 8) });
  Q(2, 'Koja od ovih jednačina je ekvivalentna sa $3x = 9$?',
    ['$x = 3$', '$x = 9$', '$6x = 9$', '$x + 3 = 9$'],
    'Obe strane podelimo sa $3$ i dobijamo $x = 3$. Ostale nemaju rešenje $3$.', 'ekvivalent',
    { mediji: V([{ tx: '3x', b: 1 }], [{ tx: '9', b: 3, teg: 1 }]) });
  Q(3, 'Za koju vrednost $a$ je jednačina $ax = 5$ linearna?',
    ['Za svako $a ≠ 0$', 'Samo za $a = 0$', 'Za $a = 5$', 'Za svako $a$, bez izuzetka'],
    'Linearna jednačina $ax = b$ mora imati $a ≠ 0$. Za $a = 0$ jednačina postaje $0 · x = 5$, što nije linearna jednačina.', 'uslov',
    { mediji: V([{ tx: 'a · x', b: 1 }], [{ tx: '5', b: 3, teg: 1 }]) });
  Q(2, 'Da li su jednačine $x = 6$ i $2x = 12$ ekvivalentne?',
    ['Da, obe imaju rešenje $6$', 'Ne, jer je druga veća', 'Ne, jer je prva bez množenja', 'Ne, jer nemaju zajedničko rešenje'],
    'Drugu jednačinu podelimo sa $2$ i dobijamo $x = 6$. Zato su ekvivalentne.', 'ekvivalent',
    { mediji: P(0, 12) });
  Q(1, 'Koji broj je rešenje jednačine $5x = 0$?',
    ['$0$', '$5$', '$\\frac{1}{5}$', 'Nema rešenja'],
    'Ako je $5 · x = 0$, onda je $x = 0$. Linearna jednačina $ax = b$ sa $b = 0$ ima rešenje $0$.', 'nula',
    { mediji: P(-2, 2) });
  Q(3, 'Koliko linearnih jednačina po $x$ je ekvivalentno sa jednačinom $x = 2$?',
    ['Beskonačno mnogo', 'Nijedna', 'Samo jedna, i to $x = 2$', 'Dve'],
    'Svaka jednačina čiji je jedini skup rešenja $\\{2\\}$ je ekvivalentna sa $x = 2$. Takvih ima beskonačno mnogo, na primer $3x = 6$, $x − 2 = 0$, $4x = 8$.', 'beskonačno',
    { mediji: P(-2, 6, [[2, '?', 1]]) });
  Q(2, 'Jednačina $y + 4 = 4 + y$ je…',
    ['identitet (važi za svaki broj)', 'linearna jednačina sa jednim rešenjem', 'nemoguća jednačina', 'nejednačina'],
    'Zamena mesta sabircima ne menja zbir, pa je jednakost tačna za svaki $y$. Ovakva jednačina je identitet.', 'identitet',
    { mediji: P(-3, 3) });
  Q(1, 'Ako je $x$ rešenje jednačine $x + 1 = 5$, koliko je $x$?',
    ['$4$', '$−6$', '$5$', '$1$'],
    'Od obe strane oduzmemo $1$ i dobijemo $x = 4$. Provera: $4 + 1 = 5$.', 'provera',
    { mediji: V(['x', 1], [5]) });
  S(2, 'Spoji jednačinu sa brojem koji je rešava.',
    [['$x + 3 = 8$', '$x = 5$'], ['$2x = 14$', '$x = 7$'], ['$x − 9 = 1$', '$x = 10$'], ['$5x = 0$', '$x = 0$']],
    'Broj iz para zamenjen u jednačinu daje tačnu jednakost. Kad menjamo oblik jednačine, rešenje ostaje isto.', 'rešenje', {});
  U(2, 'Koja jednačina NIJE ekvivalentna sa $x − 3 = 5$?',
    ['$x = 2$', '$x = 8$', '$x − 3 + 3 = 8$', '$2x = 16$'],
    'Rešenje jednačine $x − 3 = 5$ je $x = 8$. Jednačina $x = 2$ ima drugo rešenje, pa nije ekvivalentna.',
    'Oblici u kojima se rešenje ne menja su ekvivalentni.', 'ekvivalent',
    { mediji: V([{ tx: 'x − 3', b: 1 }], [{ tx: '5', b: 3, teg: 1 }]) });
  Q(3, 'Da li su jednačine $2x = 6$ i $x² = 9$ ekvivalentne?',
    ['Ne, jer druga ima i rešenje $−3$', 'Da, jer su obe tačne za $x = 3$', 'Ne, jer prva jednačina nema rešenje za $x = 3$', 'Da, jer je $x² = 9$ jednakost'],
    'Prva ima samo rešenje $3$, a druga $3$ i $−3$. Skupovi rešenja su različiti, pa nisu ekvivalentne.', 'ekvivalent',
    { mediji: P(-4, 4, [[3, '3', 1]]) });

  // ════════ 3. Ekvivalentne transformacije ════════
  L('Ekvivalentne transformacije');
  Q(1, 'Vaga je u ravnoteži. Ako na obe strane dodamo isti teg, šta se dešava?',
    ['Vaga ostaje u ravnoteži', 'Vaga se nagne na levu stranu', 'Vaga se nagne na desnu stranu', 'Vaga se prevrne'],
    'Ako dodamo isto na obe strane, jednakost se ne narušava. Zato jednačina ostaje ekvivalentna prvoj.', 'ravnoteža',
    { mediji: V([3], [3]), medijiOdgovora: V([3, 2], [3, 2]) });
  Q(1, 'Vaga je u ravnoteži: levo kutija $x$ i teg $2$, desno teg $8$. Koliko treba skinuti sa obe strane da levo ostane samo $x$?',
    ['$2$', '$−8$', '$6$', '$4$'],
    'Skinemo $2$ sa obe strane. Levo ostaje $x$, a desno $8 − 2 = 6$. Zato je $x = 6$.', 'promena',
    { mediji: V(['x', 2], [8]) });
  Q(2, 'Obe strane jednakosti $x = 4$ pomnožimo sa $3$. Dobija se:',
    ['$3x = 12$', '$x + 3 = 4$', '$x = 12$', '$3x = 4$'],
    'Množenje obe strane istim brojem različitim od nule ne menja rešenje. Dobijamo $3x = 12$.', 'množenje',
    { mediji: V([{ tx: 'x', b: 1 }], [{ tx: '4', b: 3, teg: 1 }]) });
  Q(2, 'Koju transformaciju treba uraditi da iz $5x = 35$ dobijemo $x = 7$?',
    ['Podeliti obe strane sa $5$', 'Pomnožiti obe strane sa $5$', 'Oduzeti $5$ sa obe strane', 'Dodati $7$ na obe strane'],
    'Ako su obe strane podeljene sa $5$, dobija se $x = 35 : 5 = 7$. Deljenje sa $5$ poništava množenje sa $5$.', 'deljenje',
    { mediji: V([{ tx: '5x', b: 1 }], [{ tx: '35', b: 3, teg: 1 }]) });
  Q(2, 'Zašto ne smemo da obe strane jednačine podelimo nulom?',
    ['Deljenje nulom nije definisano', 'Rezultat je uvek nula, a jednačina nestaje', 'Jednačina postaje nejednačina', 'Dobija se negativan broj'],
    'Deljenje nulom nema smisla, pa to nije dozvoljena transformacija. Zato nikad ne delimo sa $0$, ni u jednačinama.', 'nula',
    { mediji: V([{ tx: 'x', b: 1 }], [{ tx: '0', b: 3, teg: 1 }]) });
  S(2, 'Spoji transformaciju sa njenim dejstvom na jednačinu.',
    [['dodamo isti broj na obe strane', 'jednakost ostaje tačna'], ['pomnožimo sa nenultim brojem', 'rešenje se ne menja'], ['oduzmemo $x$ sa obe strane', 'nepoznata nestaje'], ['$a = b$ i $b = c$', 'važi $a = c$']],
    'Osobina $a = b$, $b = c$ ⇒ $a = c$ zove se transitivnost, ili prenosivost jednakosti.', 'promena', {});
  Q(2, 'Obe strane jednačine $2x = 10$ podelimo sa $2$. Dobija se:',
    ['$x = 5$', '$x = 20$', '$x = 8$', '$4x = 10$'],
    'Podelimo sa $2$: $x = 10 : 2 = 5$. Provera: $2 · 5 = 10$.', 'deljenje',
    { mediji: V([{ tx: '2x', b: 1 }], [{ tx: '10', b: 3, teg: 1 }]) });
  Q(2, 'Obe strane jednačine $y − 5 = 2$ dodamo $5$. Dobija se:',
    ['$y = 7$', '$y = 3$', '$y = 10$', '$y − 5 = 7$'],
    'Dodavanjem $5$ sa obe strane levo ostaje $y$, a desno $2 + 5 = 7$. Zato je $y = 7$.', 'sabiranje',
    { mediji: V([{ tx: 'y − 5', b: 1 }], [2]) });
  Q(1, 'Ako je $a = b$ i $b = c$, koja jednakost važi?',
    ['$a = c$', '$a = b + c$', '$a + b = c$', '$c = 2a$'],
    'Ovo je transitivnost jednakosti: ako su dva broja jednaka trećem, onda su jednaka i između sebe.', 'prenosivost',
    { mediji: TR([[1, 'a', 1], [1, 'b', 2], [1, 'c', 3]]) });
  Q(3, 'Jednačina je $2x + 3 = x + 7$. Ako sa obe strane oduzmemo $x$, a zatim $3$, dobijamo:',
    ['$x = 4$', '$x = 10$', '$3x = 4$', '$x = 3$'],
    'Oduzmemo $x$: $x + 3 = 7$. Oduzmemo $3$: $x = 4$. Provera: $2 · 4 + 3 = 11 = 4 + 7$.', 'koraci',
    { mediji: V([{ tx: '2x', b: 1 }, 3], [{ tx: 'x', b: 1 }, 7]) });
  U(2, 'Koja transformacija NE daje ekvivalentnu jednačinu?',
    ['Množenje obe strane nulom', 'Dodavanje istog broja na obe strane', 'Množenje obe strane brojem $4$', 'Oduzimanje istog izraza sa obe strane'],
    'Množenjem nulom sve jednačine postaju $0 = 0$, pa se izgube sva rešenja. Ostale transformacije čuvaju rešenje.',
    'Nula je jedini broj koji sve pretvara u nulu.', 'nula',
    { mediji: V([{ tx: 'x', b: 1 }], [{ tx: '5', b: 3, teg: 1 }]) });
  Q(3, 'Kad rešavamo $\\frac{x}{3} = 4$, koju transformaciju koristimo?',
    ['Pomnožimo obe strane sa $3$', 'Oduzmemo $4$ sa obe strane i podelimo sa $3$', 'Podelimo obe strane sa $3$', 'Dodamo $3$ na obe strane'],
    'Množenjem sa $3$ dobijamo $x = 12$. Deljenje sa $3$ bi dalo $\\frac{x}{9} = \\frac{4}{3}$, što nije korisno.', 'razlomak',
    { mediji: V([{ tx: 'x : 3', b: 1 }], [{ tx: '4', b: 3, teg: 1 }]) });
  Q(3, 'Koja jednačina je ekvivalentna sa $4x − 6 = 2x + 2$ posle dodavanja $6$ i oduzimanja $2x$ sa obe strane?',
    ['$2x = 8$', '$2x = 4$', '$4x = 8$', '$2x = 8 + 2$'],
    'Dodamo $6$: $4x = 2x + 8$. Oduzmemo $2x$: $2x = 8$. Ostale jednačine se ovim redom ne dobijaju.', 'koraci',
    { mediji: V([{ tx: '4x − 6', b: 1 }], [{ tx: '2x + 2', b: 3 }]) });
  Q(1, 'Vaga je u ravnoteži. Ako levu i desnu stranu pomnožimo sa $2$, šta se dešava sa ravnotežom?',
    ['Ostaje u ravnoteži', 'Levo postaje teže i vaga se nagne', 'Desno postaje teže', 'Vaga se oborila'],
    'Ako obe strane pomnožimo istim brojem, jednakost ostaje tačna, pa vaga ostaje u ravnoteži.', 'ravnoteža',
    { mediji: V([3], [3]) });
  Q(2, 'Iz jednačine $x − 7 = 2$ dodavanjem $7$ sa obe strane dobijamo:',
    ['$x = 9$', '$x = 5$', '$x − 7 = 9$', '$x = −5$'],
    'Levo ostaje $x$, a desno $2 + 7 = 9$. Zato je $x = 9$.', 'sabiranje',
    { mediji: V([{ tx: 'x − 7', b: 1 }], [2]) });
  Q(1, 'Kad oduzmemo isti broj sa obe strane jednakosti, šta se dešava?',
    ['Jednakost ostaje tačna', 'Jednakost postaje netačna', 'Rešenje se menja', 'Vaga se prevrne'],
    'Oduzimanje istog broja sa obe strane je ekvivalentna transformacija, kao i sabiranje.', 'ravnoteža',
    { mediji: V([5], [5]) });
  Q(3, 'Zašto $x = 5$ zadovoljava $2x = 10$, ali ne i $x² = 25$ kao ekvivalentnu jednačinu?',
    ['Jer $x² = 25$ ima i rešenje $−5$', 'Jer su brojevi $10$ i $25$ različiti', 'Jer je $2$ veći od $1$', 'Jer se dodaje $x$ sa obe strane'],
    'Jednačina $x² = 25$ ima dva rešenja, $5$ i $−5$. Kvadriranje nije ekvivalentna transformacija.', 'kvadriranje',
    { mediji: P(-6, 6) });

  // ════════ 4. Rešavanje linearnih jednačina ════════
  L('Rešavanje linearnih jednačina');
  Q(1, 'Šta je dobijeno ako iz jednačine $A(x) + a = B(x) + b$ prebacimo $a$ i $B(x)$ na suprotne strane?',
    ['$A(x) − B(x) = b − a$', '$A(x) = b − a + B(x)$', '$A(x) − B(x) = a + b$', '$A(x) + B(x) = b − a$'],
    'Prebacivanjem izraza i brojeva na jednu stranu dobijamo $A(x) − B(x) = b − a$. Tako se članovi sa $x$ i konstante odvajaju.', 'članovi',
    { mediji: V([{ tx: 'A(x) + a', b: 1 }], [{ tx: 'B(x) + b', b: 3 }]) });
  Q(2, 'Kako prebacujemo član $−2$ sa leve strane jednačine $3x − 2 = x + 4$?',
    ['Na desnu stranu sa suprotnim znakom, tj. kao $+2$', 'Na desnu stranu bez promene znaka', 'Množenjem obe strane sa $3$ i zatim oduzimanjem $2$', 'Ostaje na mestu'],
    'Pri prebacivanju člana sa jedne strane na drugu menjamo mu znak. Tako $−2$ postaje $+2$ na desnoj strani.', 'znak',
    { mediji: V([{ tx: '3x − 2', b: 1 }], [{ tx: 'x + 4', b: 3 }]) });
  Q(2, 'Rešenje jednačine $3x − 2 = x + 4$ je:',
    ['$x = 3$', '$x = 2$', '$x = 6$', '$x = −3$'],
    'Prebacimo: $3x − x = 4 + 2$, pa je $2x = 6$, i konačno $x = 3$. Provera: $3 · 3 − 2 = 7$ i $3 + 4 = 7$.', 'rešenje',
    { mediji: P(0, 8), medijiOdgovora: P(0, 8, [[3, 'x = 3', 3]]) });
  Q(2, 'Rešenje jednačine $3(x − 5) = 2(x + 7)$ je:',
    ['$x = 29$', '$x = 1$', '$x = 17$', '$x = −29$'],
    'Razvijemo zagrade: $3x − 15 = 2x + 14$. Prebacimo: $x = 29$. Provera: $3 · 24 = 72$ i $2 · 36 = 72$.', 'zagrade',
    { mediji: V([{ tx: '3(x − 5)', b: 1 }], [{ tx: '2(x + 7)', b: 3 }]) });
  Q(3, 'Koja je vrednost $y$ u jednačini $9(3y + 1) − 6(5y − 7) = 4(y + 11)$?',
    ['$y = 1$', '$y = −1$', '$y = 4$', '$y = 0$'],
    'Razvijemo: $27y + 9 − 30y + 42 = 4y + 44$, pa je $−3y + 51 = 4y + 44$. Dobijamo $−7y = −7$, pa je $y = 1$.', 'zagrade',
    { mediji: V([{ tx: '9(3y + 1)', b: 1 }], [{ tx: '4(y + 11)', b: 3 }]) });
  Q(2, 'Koliko iznosi $x$ ako je $\\frac{x}{2} − \\frac{x}{3} = 1$?',
    ['$x = 6$', '$x = −6$', '$x = 1$', '$x = 3$'],
    'Pomnožimo sa NZS $(2, 3) = 6$: $3x − 2x = 6$, pa je $x = 6$. Provera: $3 − 2 = 1$.', 'razlomak',
    { mediji: P(0, 8), medijiOdgovora: P(0, 8, [[6, 'x = 6', 3]]) });
  Q(2, 'Ako pomnožimo jednačinu $\\frac{x}{4} + 1 = \\frac{x}{2}$ sa $4$, dobijamo:',
    ['$x + 4 = 2x$', '$x + 1 = 2x$', '$x + 4 = x$', '$4x + 1 = 2x$'],
    'Množenjem sa $4$ svaki član se pomnoži: $x + 4 = 2x$. Zatim je $x = 4$.', 'razlomak',
    { mediji: V([{ tx: 'x/4 + 1', b: 1 }], [{ tx: 'x/2', b: 3 }]) });
  Q(1, 'Koji broj dobijamo kad jednačinu $5x = 45$ podelimo sa $5$?',
    ['$x = 9$', '$x = 40$', '$x = 50$', '$x = 4,5$'],
    'Deljenje sa $5$: $x = 45 : 5 = 9$.', 'deljenje',
    { mediji: V([{ tx: '5x', b: 1 }], [{ tx: '45', b: 3, teg: 1 }]) });
  Q(3, 'Rešenje jednačine $\\frac{5y − 4}{3} = 6 + y$ je:',
    ['$y = 11$', '$y = 9$', '$y = 13$', '$y = −11$'],
    'Pomnožimo sa $3$: $5y − 4 = 18 + 3y$. Zatim $2y = 22$, pa je $y = 11$. Provera: $\\frac{55 − 4}{3} = 17 = 6 + 11$.', 'razlomak',
    { mediji: V([{ tx: '(5y − 4) : 3', b: 1 }], [{ tx: '6 + y', b: 3 }]) });
  Q(2, 'Koliko iznosi $x$ u jednačini $7x + 8 = 22$?',
    ['$2$', '$3$', '$30$', '$−2$'],
    'Od $22$ oduzmemo $8$: $7x = 14$, pa je $x = 2$.', 'prebaciti',
    { mediji: V([{ tx: '7x', b: 1 }, 8], [22]) });
  Q(1, 'Prvi korak u rešavanju jednačine $2x + 6 = 4$ je:',
    ['oduzeti $6$ sa obe strane', 'podeliti sa $2$', 'dodati $x$ i oduzeti $2$ sa obe strane', 'pomnožiti sa $6$'],
    'Prvo se oslobađamo slobodnog člana: oduzmemo $6$ sa obe strane. Zatim delimo sa koeficijentom uz $x$.', 'korak',
    { mediji: V([{ tx: '2x', b: 1 }, 6], [4]) });
  U(2, 'Koja od ovih jednačina je rešena POGREŠNO?',
    ['$3x + 3 = 9$, pa je $3x = 12$', '$5x = 10$, pa je $x = 2$', '$x − 4 = 2$, pa je $x = 6$', '$x + 1 = 5$, pa se od obe strane oduzme $1$ i dobija se $x = 4$'],
    'Od $9$ oduzmemo $3$ i dobijemo $6$, a ne $12$. Zato je $3x = 6$ i $x = 2$. Ostali koraci su tačni.',
    'Provera zamenom najbrže otkriva grešku.', 'provera',
    { mediji: V([{ tx: '3x + 3', b: 1 }], [{ tx: '9', b: 3, teg: 1 }]) });
  Q(3, 'Rešenje jednačine $6(x + 1) − 2 = 4x + 14$ je:',
    ['$x = 5$', '$x = 4$', '$x = 2$', '$x = −7$'],
    'Razvijemo: $6x + 6 − 2 = 4x + 14$, pa je $6x + 4 = 4x + 14$. Zatim $2x = 10$, tj. $x = 5$. Provera: $6 · 6 − 2 = 34$ i $4 · 5 + 14 = 34$.', 'zagrade',
    { mediji: V([{ tx: '6(x + 1) − 2', b: 1 }], [{ tx: '4x + 14', b: 3 }]) });
  S(2, 'Poveži svaku jednačinu sa njenim rešenjem.',
    [['$2x + 5 = 9$', '$x = 2$'], ['$3x − 1 = 8$', '$x = 3$'], ['$x + 7 = 4$', '$x = −3$'], ['$5x = 20$', '$x = 4$']],
    'Svaka jednačina se rešava obrnutim redosledom računskih operacija.', 'rešenje', {});
  Q(1, 'Koliko iznosi $x$ ako je $x − 6 = 0$?',
    ['$6$', '$−6$', '$0$', '$1$'],
    'Prebacimo $−6$ na desnu stranu, dobijamo $x = 6$. Provera: $6 − 6 = 0$.', 'prebaciti',
    { mediji: V([{ tx: 'x − 6', b: 1 }], [{ tx: '0', b: 3, teg: 1 }]) });
  Q(2, 'Da li smemo da prebacimo član $5$ sa leve strane na desnu bez promene znaka?',
    ['Ne, znak se menja', 'Da, ništa se ne menja', 'Da, ali samo za pozitivne brojeve', 'Samo ako je nula'],
    'Pri prebacivanju člana menjamo mu znak: $+5$ postaje $−5$ na drugoj strani.', 'znak',
    { mediji: V([{ tx: 'x + 5', b: 1 }], [{ tx: '8', b: 3, teg: 1 }]) });
  U(2, 'Koji korak NIJE dozvoljen pri rešavanju jednačine?',
    ['Deljenje obe strane nulom', 'Dodavanje istog broja na obe strane', 'Množenje obe strane sa $2$', 'Oduzimanje $x$ sa obe strane'],
    'Deljenje nulom nije definisano, pa je to nedozvoljen korak. Ostali koraci su ekvivalentne transformacije.',
    'Nula ne sme biti delilac.', 'deljenje',
    { mediji: V([{ tx: 'x', b: 1 }], [{ tx: '0', b: 3, teg: 1 }]) });

  // ════════ 5. Još o linearnim jednačinama ════════
  L('Još o linearnim jednačinama');
  Q(1, 'Koliko rešenja ima linearna jednačina $ax = b$ kad je $a ≠ 0$?',
    ['Tačno jedno', 'Nijedno', 'Beskonačno mnogo', 'Dva'],
    'Jedino rešenje je $x = \\frac{b}{a}$. Zato se broj $\\frac{b}{a}$ zove jedinstveno rešenje.', 'jedinstveno',
    { mediji: P(-6, 6) });
  Q(2, 'Koliko rešenja ima jednačina $2x − 8 = 4x − 2(x + 4)$?',
    ['Beskonačno mnogo', 'Nijedno', 'Jedno: $x = 0$ ili $x = 8$', 'Jedno: $x = 8$'],
    'Razvijemo: $4x − 2x − 8 = 2x − 8$. Obe strane su iste, pa je jednačina identitet i svaki realan broj je rešenje.', 'identitet',
    { mediji: P(-6, 6), medijiOdgovora: V([{ tx: '2x − 8', b: 1 }], [{ tx: '2x − 8', b: 3 }]) });
  Q(1, 'Za koju vrednost $a$ je jednačina $ax = 2021$ nemoguća?',
    ['$a = 0$', '$a = 2021$', '$a = 1$', '$a = −1$'],
    'Za $a = 0$ jednačina postaje $0 · x = 2021$, što nema rešenja. Takva jednačina se zove nemoguća.', 'nemoguća',
    { mediji: V([{ tx: 'a · x', b: 1 }], [{ tx: '2021', b: 3, teg: 1 }]) });
  Q(3, 'Koliko rešenja ima jednačina $3x − 7 = 3x + 5$?',
    ['Nijedno', 'Jedno: $x = 4$', 'Beskonačno mnogo', 'Jedno: $x = −4$'],
    'Oduzmemo $3x$ sa obe strane: $−7 = 5$, što nikad nije tačno. Jednačina nema rešenja, pa je nemoguća.', 'nemoguća',
    { medijiOdgovora: V([{ tx: '3x', b: 1 }, { tx: '7', b: 3, teg: 1 }], [{ tx: '3x', b: 1 }, { tx: '5', b: 3, teg: 1 }]) });
  Q(1, 'Za koju vrednost $b$ jednačina $5x = b$ ima jedinstveno rešenje?',
    ['Za svako $b$', 'Samo za $b = 0$', 'Za $b = 5$', 'Nijedno $b$'],
    'Jednačina $5x = b$ je linearna jer je $a = 5 ≠ 0$. Za svako $b$ postoji jedinstveno rešenje $x = \\frac{b}{5}$.', 'uslov',
    { mediji: P(-6, 6) });
  Q(2, 'Za koju vrednost $m$ je jednačina $0 · x = m − 2$ neodređena (identitet)?',
    ['$m = 2$', '$m = 0$', '$m = −2$', '$m = 1$'],
    'Jednačina $0 · x = m − 2$ je tačna za svako $x$ samo ako je $m − 2 = 0$, tj. $m = 2$. Takva jednačina se zove neodređena.', 'neodređena',
    { mediji: V([{ tx: '0 · x', b: 1 }], [{ tx: 'm − 2', b: 3 }]) });
  Q(3, 'Koliko rešenja ima jednačina $x + 2 = 2x − (x − m)$ za $m = 2$?',
    ['Beskonačno mnogo', 'Nijedno', 'Jedno, za svako $m$', 'Dva'],
    'Razvijemo: $x + 2 = 2x − x + m = x + m$. Za $m = 2$ obe strane su iste, pa je jednačina neodređena.', 'neodređena',
    { mediji: V([{ tx: 'x + 2', b: 1 }], [{ tx: '2x − (x − m)', b: 3 }]) });
  Q(2, 'Koliko rešenja ima jednačina $0 · x = 5$?',
    ['Nijedno', 'Jedno: $5$', 'Jedno: $0$', 'Beskonačno mnogo'],
    'Za svaki realan broj $x$ levo je $0$, a desno $5$. Nijedan broj ne zadovoljava jednačinu.', 'nemoguća',
    { mediji: V([{ tx: '0 · x', b: 1 }], [{ tx: '5', b: 3, teg: 1 }]) });
  S(2, 'Spoji jednačinu sa vrstom rešenja.',
    [['$3x = 6$', 'jedno rešenje'], ['$0 · x = 0$', 'beskonačno mnogo'], ['$0 · x = 4$', 'nema rešenja'], ['$5x = 0$', 'rešenje je nula']],
    'Jednačina $0 · x = 0$ je tačna za svaki broj, a $0 · x = 4$ nikad nije tačna.', 'vrste', {});
  U(2, 'Koja jednačina NIJE linearna (uz $a ≠ 0$)?',
    ['$0 · x = 3$', '$2x − 5 = 4$', '$x = 0$', '$3 − x = 5x$'],
    'Jednačina $0 · x = 3$ ima oblik $ax = b$ sa $a = 0$, pa nije prava linearna jednačina.',
    'Kad je koeficijent $a = 0$, jednačina nema jedinstveno rešenje.', 'uslov',
    { mediji: P(-3, 3) });
  Q(3, 'Koliko iznosi $x$ ako je $\\frac{2x + 1}{4} = \\frac{x}{2}$?',
    ['Nema rešenja', '$x = 1$', '$x = −1$ ili $x = 1$', '$x = 2$'],
    'Pomnožimo sa $4$: $2x + 1 = 2x$, tj. $1 = 0$. Jednačina nema rešenja.', 'nemoguća',
    { mediji: V([{ tx: '(2x + 1) : 4', b: 1 }], [{ tx: 'x : 2', b: 3 }]) });
  Q(3, 'Za koje vrednosti $b$ jednačina $bx = b$ ima tačno jedno rešenje?',
    ['Za svako $b ≠ 0$', 'Za svako $b$', 'Samo za $b = 1$ ili $b = −1$', 'Za $b = 0$'],
    'Za $b ≠ 0$ je $x = \\frac{b}{b} = 1$. Za $b = 0$ jednačina je $0 · x = 0$, pa je neodređena.', 'uslov',
    { mediji: V([{ tx: 'b · x', b: 1 }], [{ tx: 'b', b: 3, teg: 1 }]) });
  Q(1, 'Koji je rezultat jednačine $4x = 0$?',
    ['$x = 0$', '$x = 4$', '$x = \\frac{1}{4}$', 'Nema rešenja'],
    'Ako je $4x = 0$, onda je $x = 0$. Deljenjem sa $4$ dobijamo $0$.', 'nula',
    { mediji: P(-2, 2, [[0, '?', 1]]) });
  Q(1, 'Koliko iznosi $x$ ako je $\\frac{x}{5} = 0$?',
    ['$0$', '$5$', '$\\frac{1}{5}$', 'Nema rešenja'],
    'Razlomak je nula samo kad mu je brojilac nula, pa je $x = 0$.', 'nula',
    { mediji: V([{ tx: 'x : 5', b: 1 }], [{ tx: '0', b: 3, teg: 1 }]) });
  Q(2, 'Koja jednačina ima beskonačno mnogo rešenja?',
    ['$4x − 4 = 4(x − 1)$', '$4x − 4 = 4(x − 1) + 1$', '$x = 0$', '$x² = 1$'],
    'Razvijemo zagradu: $4x − 4 = 4x − 4$, što je tačno za svaki $x$. Ostale imaju konačno rešenja.', 'identitet',
    { medijiOdgovora: V([{ tx: '4x − 4', b: 1 }], [{ tx: '4(x − 1)', b: 3 }]) });

  // ════════ 6. Jednačine koje se svode na linearnu jednačinu ════════
  L('Jednačine koje se svode na linearnu jednačinu');
  Q(1, 'Ako je proizvod dva izraza $A · B = 0$, šta mora da važi?',
    ['$A = 0$ ili $B = 0$', '$A = B = 0$ uvek', '$A + B = 0$', 'Ni jedan izraz nije nula'],
    'Pravilo nulte vrednosti proizvoda: ako je proizvod nula, bar jedan činilac mora biti nula.', 'proizvod',
    { mediji: P(-4, 4, [[0, '?', 1]]) });
  Q(2, 'Koja su rešenja jednačine $(3y − 12)(25 + 5y) = 0$?',
    ['$4$ i $−5$', '$4$ i $5$', '$12$ i $−5$', '$−4$ i $5$'],
    'Pravilo nulte vrednosti: $3y − 12 = 0$ daje $y = 4$, a $25 + 5y = 0$ daje $y = −5$.', 'proizvod',
    { mediji: P(-6, 6), medijiOdgovora: P(-6, 6, [[4, '4', 3], [-5, '−5', 3]]) });
  Q(2, 'Koliko rešenja ima jednačina $x² = 16x$?',
    ['Dva: $0$ i $16$', 'Jedno: $16$, pa i $−16$', 'Jedno: $0$', 'Nijedno'],
    'Prebacimo sve na levu stranu: $x² − 16x = 0$, pa je $x(x − 16) = 0$. Rešenja su $x = 0$ i $x = 16$.', 'proizvod',
    { mediji: P(-2, 18), medijiOdgovora: P(-2, 18, [[0, '0', 3], [16, '16', 3]]) });
  Q(2, 'Rešenje jednačine $|2x − 3| = 5$ je:',
    ['$4$ i $−1$', '$4$ i $1$', '$2$ i $−4,5$', '$3$ i $−5$'],
    'Dva slučaja: $2x − 3 = 5$ daje $x = 4$, a $2x − 3 = −5$ daje $x = −1$. Obe vrednosti zadovoljavaju jednačinu.', 'apsolutna',
    { mediji: P(-6, 6), medijiOdgovora: P(-6, 6, [[-1, '−1', 3], [4, '4', 3]]) });
  Q(3, 'Ako je $x$ pozitivan broj, koliko je rešenje jednačine $3\\sqrt{x} − 7 = \\sqrt{x} + 3$?',
    ['$x = 25$', '$x = 5$', '$x = 100$', '$x = 49$'],
    'Smenom $t = \\sqrt{x}$ dobijamo $3t − 7 = t + 3$, pa je $t = 5$. Zato je $x = 5² = 25$.', 'smena',
    { mediji: P(0, 30), medijiOdgovora: P(0, 30, [[25, 'x = 25', 3]]) });
  Q(3, 'Koje je rešenje jednačine $\\frac{x − 11}{x} = 0$ (uz $x ≠ 0$)?',
    ['$x = 11$', '$x = 0$', '$x = −11$', 'Nema rešenja'],
    'Razlomak je nula kad mu je brojilac nula, a imenilac nije. Zato je $x − 11 = 0$, pa je $x = 11$.', 'razlomak',
    { mediji: P(-2, 14) });
  Q(2, 'Koliko rešenja ima jednačina $\\frac{x² − 4}{x + 2} = 0$ (uz $x ≠ −2$)?',
    ['Jedno: $2$', 'Dva: $2$ i $−2$', 'Jedno: $−2$', 'Nijedno'],
    'Uslov $x ≠ −2$ isključuje $−2$. Ostaje $x² − 4 = 0$, pa je $x = 2$, a $x = −2$ nije dozvoljeno.', 'razlomak',
    { mediji: P(-4, 4, [[-2, '✕', 2]]) });
  Q(2, 'Koja su rešenja jednačine $x³ = 16x$?',
    ['$0$, $4$ i $−4$', '$0$ i $4$', '$4$ i $−4$', '$0$, $16$ i $−16$'],
    'Prebacimo: $x³ − 16x = 0$, pa je $x(x − 4)(x + 4) = 0$. Tri rešenja: $0$, $4$ i $−4$.', 'proizvod',
    { mediji: P(-6, 6) });
  Q(3, 'Koliko iznosi $y$ u jednačini $(2y + 4)(y − 5) = y² − 25$?',
    ['Dva: $5$ i $1$', 'Jedno: $5$', 'Dva: $−5$ i $1$', 'Dva: $5$ i $−1$'],
    'Desna strana je $(y − 5)(y + 5)$. Prebacimo na levu i izvučemo $(y − 5)$: $(y − 5)(y − 1) = 0$. Rešenja su $5$ i $1$.', 'proizvod',
    { mediji: P(-2, 8) });
  Q(2, 'Koja je jednačina dobijena iz $(x + 7)(x − 1) = (x + 2)(x − 3)$ kad se množe zagrade i skrati $x²$?',
    ['$6x − 7 = −x − 6$', '$7x − 7 = −6$', '$x² + 7x − 7 = x² + 2x − 6$', '$6x = 6$'],
    'Množenjem zagrada: $x² + 6x − 7 = x² − x − 6$. Ako skratimo $x²$, dobijamo $6x − 7 = −x − 6$.', 'množenje',
    { mediji: V([{ tx: '(x + 7)(x − 1)', b: 1 }], [{ tx: '(x + 2)(x − 3)', b: 3 }]) });
  Q(3, 'Kako se rešava jednačina $\\frac{2x}{x − 1} = 2$ uz uslov $x ≠ 1$?',
    ['Množenjem sa $x − 1$ dobijamo $2x = 2x − 2$, što je nemoguće', 'Dodavanjem $1$ sa obe strane', 'Deljenjem sa $2$ i dobijanjem $x = 1$', 'Kvadriranjem obe strane, pa deljenjem sa $x$'],
    'Pomnožimo sa $x − 1$: $2x = 2x − 2$, tj. $0 = −2$. Jednačina je nemoguća, pa nema rešenja.', 'nemoguća',
    { mediji: V([{ tx: '2x : (x − 1)', b: 1 }], [{ tx: '2', b: 3, teg: 1 }]) });
  Q(1, 'Jednačina $\\frac{A}{B} = 0$ (uz $B ≠ 0$) je ekvivalentna sa jednačinom…',
    ['$A = 0$', '$B = 0$', '$A = B$', '$A + B = 0$'],
    'Razlomak je nula samo ako je brojilac nula, a imenilac nije nula. Zato je jednačina ekvivalentna sa $A = 0$.', 'razlomak',
    { mediji: V([{ tx: 'A : B', b: 1 }], [{ tx: '0', b: 3, teg: 1 }]) });
  U(3, 'Koja jednačina je uljez: nema realnih rešenja, a ostale imaju?',
    ['$x² + 4 = 0$', '$x(x − 2) = 0$', '$(x − 3)(x + 1) = 0$', '$\\frac{x − 1}{x + 2} = 0$'],
    'Jednačina $x² + 4 = 0$ nema realnih rešenja. Ostale tri imaju realna rešenja: $0$ i $2$; $3$ i $−1$; $1$ (uz $x ≠ −2$).',
    'Kvadrat realnog broja nikad nije negativan.', 'kvadrat',
    { mediji: P(-4, 4) });
  S(2, 'Spoji jednačinu sa skupom rešenja.',
    [['$x(x − 3) = 0$', '{0, 3}'], ['$(x + 2)(x − 5) = 0$', '{−2, 5}'], ['$x² = 9$', '{3, −3}'], ['$|x| = 2$', '{2, −2}']],
    'Proizvod je nula kad je bar jedan činilac nula, a $|x| = a$ ima dva rešenja, $a$ i $−a$.', 'skup', {});
  Q(1, 'Koliko rešenja ima jednačina $x · x = 0$?',
    ['Jedno: $0$', 'Dva', 'Nijedno', 'Beskonačno mnogo'],
    'Jedini broj čiji je kvadrat nula je nula, pa je rešenje $x = 0$.', 'nula',
    { mediji: P(-2, 2, [[0, '?', 1]]) });
  Q(1, 'Kako se rešava jednačina $(x + 4)(x − 4) = 0$?',
    ['$x = 4$ ili $x = −4$', 'Samo $x = 4$, bez $x = 0$', 'Samo $x = 0$', 'Nema rešenja'],
    'Svaki činilac izjednačimo sa nulom: $x + 4 = 0$ i $x − 4 = 0$. Dobijamo $x = −4$ i $x = 4$.', 'proizvod',
    { mediji: P(-6, 6) });
  Q(3, 'Koje je rešenje jednačine $\\frac{x}{x} = 1$?',
    ['Svaki broj osim $0$', 'Nema rešenja', 'Samo $x = 1$ i $x = −1$', 'Svaki broj'],
    'Razlomak $\\frac{x}{x}$ je $1$ za svaki $x ≠ 0$, a za $x = 0$ nije definisan. Zato je rešenje svaki broj osim nule.', 'uslov',
    { mediji: P(-3, 3, [[0, '✕', 2]]) });

  // ════════ 7. Primena linearnih jednačina ════════
  L('Primena linearnih jednačina');
  Q(1, 'Zbir dva broja je $30$, a razlika $4$. Koji je manji broj?',
    ['$13$', '$17$', '$26$', '$8,5$'],
    'Ako je manji broj $m$, veći je $m + 4$. Zbir: $2m + 4 = 30$, pa je $m = 13$, a veći je $17$.', 'zbir',
    { mediji: TR([[1, 'm', 1], [1, 'm', 1], [1, '4', 2]]), medijiOdgovora: TR([[1, '13', 1], [1, '13', 1], [1, '4', 2]]) });
  Q(1, 'Četiri uzastopna prirodna broja imaju zbir $30$. Koji je najmanji?',
    ['$6$', '$7$', '$−5$', '$8$'],
    'Ako je prvi broj $x$, ostali su $x + 1$, $x + 2$, $x + 3$. Zbir $4x + 6 = 30$ daje $x = 6$.', 'uzastopni',
    { mediji: TR([[1, 'x', 1], [1, 'x+1', 2], [1, 'x+2', 3], [1, 'x+3', 4]]) });
  Q(2, 'Otac je $4$ puta stariji od sina, a zajedno imaju $50$ godina. Koliko godina ima sin?',
    ['$10$', '$12$', '$8$', '$40$'],
    'Ako sin ima $x$ godina, otac ima $4x$. Zbir je $5x = 50$, pa sin ima $10$ godina.', 'starosti',
    { mediji: TR([[1, '~sin', 1], [4, '~otac', 3]]), medijiOdgovora: TR([[1, '10', 1], [4, '40', 3]]) });
  Q(2, 'Ana je $3$ godine starija od Mile, a zajedno imaju $33$ godine. Koliko godina ima Ana?',
    ['$18$', '$15$', '$−21$', '$12$'],
    'Ako Mila ima $m$ godina, Ana ima $m + 3$. Zbir je $2m + 3 = 33$, pa je $m = 15$, a Ana ima $18$ godina.', 'starosti',
    { mediji: TR([[1, 'm', 1], [1.3, 'm + 3', 2]]) });
  Q(3, 'Zbir četiri uzastopna prirodna broja je $42$. Koji je najveći?',
    ['$12$', '$11$', '$10$', '$−12$'],
    'Ako su brojevi $x, x+1, x+2, x+3$, zbir je $4x + 6 = 42$, pa je $x = 9$. Brojevi su $9, 10, 11, 12$.', 'uzastopni',
    { mediji: TR([[1, 'x', 1], [1, 'x+1', 2], [1, 'x+2', 3], [1, 'x+3', 4]]) });
  Q(2, 'U kiosku bombone koštaju $300$ dinara po kilogramu, a čokolade $600$ dinara po kilogramu. Ukupno je $3$ kg za $1200$ dinara. Koliko kilograma bombona je kupljeno?',
    ['$2$ kg', '$1$ kg', '$1,5$ kg', '$3$ kg'],
    'Ako je $b$ kilograma bombona, čokolade je $3 − b$. Tada je $300b + 600(3 − b) = 1200$, pa je $b = 2$. Provera: $600 + 600 = 1200$.', 'troškovi',
    { mediji: TR([[2, '~bombone', 1], [1, '~čoko', 3]]) });
  Q(2, 'Zbir tri uzastopna neparna broja je $75$. Koji je najveći?',
    ['$27$', '$25$', '$29$', '$23,5$'],
    'Ako je prvi $x$, ostali su $x + 2$ i $x + 4$. Zbir $3x + 6 = 75$ daje $x = 23$, pa je najveći $27$.', 'neparni',
    { mediji: TR([[1, 'x', 1], [1, 'x+2', 2], [1, 'x+4', 3]]) });
  Q(1, 'Kad se broju doda $7$, pa se zbir pomnoži sa $2$, dobije se $26$. Koji je broj?',
    ['$6$', '$9$', '$8$', '$12$'],
    'Jednačina: $2(x + 7) = 26$, pa je $x + 7 = 13$, tj. $x = 6$.', 'postupak',
    { mediji: V([{ tx: '2 · (x + 7)', b: 1 }], [{ tx: '26', b: 3, teg: 1 }]) });
  Q(2, 'Dvostruki broj je za $5$ veći od broja $13$ umanjenog za $2$. Koji je broj?',
    ['$8$', '$6$', '$7$', '$9,5$'],
    'Jednačina: $2x = 13 − 2 + 5$, pa je $2x = 16$, tj. $x = 8$. Provera: $2 · 8 = 16$.', 'postupak',
    { mediji: V([{ tx: '2x', b: 1 }], [{ tx: '13 − 2 + 5', b: 3 }]) });
  Q(3, 'Cena knjige sa porezom od $10\\%$ je $660$ dinara. Kolika je cena bez poreza?',
    ['$600$ dinara', '$594,50$ dinara', '$650$ dinara', '$620$ dinara'],
    'Ako je cena bez poreza $x$, sa porezom je $x + 0,1x = 1,1x = 660$, pa je $x = 600$ dinara.', 'porez',
    { mediji: TR([[1, '~bez poreza', 1], [0.3, '+10 %', 2]]) });
  U(2, 'Koji zadatak NE rešavamo linearnom jednačinom sa jednom nepoznatom?',
    ['Zbir dva broja je $10$, a proizvod $21$', 'Zbir dva broja je $10$, a razlika $2$', 'Cena jedne sveske je $x$, pet svezaka košta $50$', 'Broj je $3$ puta veći od drugog, a zbir im je $20$'],
    'Zadatak sa zbirom i proizvodom dva broja vodi do jednačine drugog stepena, jer se drugi broj izražava kao $10 − x$, pa proizvod daje $x(10 − x) = 21$, a to je kvadratna jednačina.',
    'Proizvod dva nepoznata broja obično vodi do kvadratne jednačine.', 'primena', {});
  Q(2, 'Broj je najpre uvećan za $3$, zatim pomnožen sa $4$, a dobijeno je $28$. Koji je broj?',
    ['$4$', '$5$', '$3$', '$−4$'],
    'Jednačina: $4(x + 3) = 28$, pa je $x + 3 = 7$, tj. $x = 4$.', 'postupak',
    { mediji: V([{ tx: '4 · (x + 3)', b: 1 }], [{ tx: '28', b: 3, teg: 1 }]) });
  Q(3, 'Tri broja su u odnosu $2 : 3 : 4$, a zbir im je $45$. Koliki je najveći?',
    ['$20$', '$15$', '$10$', '$−30$'],
    'Ako su brojevi $2x$, $3x$, $4x$, zbir je $9x = 45$, pa je $x = 5$ i najveći je $4 · 5 = 20$.', 'odnos',
    { mediji: TR([[2, '2x', 1], [3, '3x', 2], [4, '4x', 3]]), medijiOdgovora: TR([[2, '10', 1], [3, '15', 2], [4, '20', 3]]) });
  S(2, 'Spoji tekstualni zadatak sa jednačinom.',
    [['Broj uvećan za $5$ je $12$', '$x + 5 = 12$'], ['Dvostruki broj je $14$', '$2x = 14$'], ['Trećina broja je $4$', '$\\frac{x}{3} = 4$'], ['Broj umanjen za $3$ je $10$', '$x − 3 = 10$']],
    'Reči „uvećan za“ znače sabiranje, „umanjen za“ oduzimanje, a „trećina“ deljenje sa tri.', 'tekst', {});
  Q(1, 'Broj umanjen za $4$ je $9$. Koji je broj?',
    ['$13$', '$5$', '$−13$', '$9$'],
    'Jednačina: $x − 4 = 9$, pa je $x = 13$. Provera: $13 − 4 = 9$.', 'umanjen',
    { mediji: V([{ tx: 'x − 4', b: 1 }], [{ tx: '9', b: 3, teg: 1 }]) });
  Q(3, 'Polovina nekog broja uvećana za $7$ je $15$. Koji je broj?',
    ['$16$', '$22,5$', '$8$', '$11$'],
    'Jednačina: $\\frac{x}{2} + 7 = 15$, pa je $\\frac{x}{2} = 8$, tj. $x = 16$.', 'polovina',
    { mediji: V([{ tx: 'x : 2 + 7', b: 1 }], [{ tx: '15', b: 3, teg: 1 }]) });

  // ════════ 8. Primena linearnih jednačina na probleme kretanja ════════
  L('Primena linearnih jednačina na probleme kretanja');
  Q(1, 'Ako se automobil kreće brzinom $60$ km/h, koliko kilometara pređe za $2$ sata?',
    ['$120$ km', '$30$ km', '$62$ km', '$2400$ km'],
    'Gepard može kratko da trči i preko $100$ km/h, ali ne može dugo da održi takvu brzinu.', 'put',
    { mediji: STAZA(120, [[0, 120, 2, '60 km/h', 1.6]]) });
  Q(2, 'Dva pešaka kreću jedan drugom u susret iz mesta udaljenih $32$ km, brzinama $4$ km/h i $12$ km/h. Posle koliko sati će se sresti?',
    ['$2$ h', '$3$ h', '$4$ h', '$2,5$ h'],
    'Kad se kreću u susret, njihove brzine se sabiraju, jer se razdaljina smanjuje sa obe strane.', 'susret',
    { mediji: STAZA(32, [[0, 32, 2, '4 km/h', 1.6], [32, 0, 3, '12 km/h', 2.7]]), medijiOdgovora: STAZA(32, [[0, 8, 2, '8 km', 1.6]]) });
  Q(2, 'Sa mesta A krene automobil brzinom $70$ km/h. Dva sata kasnije sa istog mesta krene drugi, brzinom $90$ km/h. Posle koliko sati od polaska drugog će ga stići?',
    ['$7$ h', '$5$ h', '$9,5$ h', '$2$ h'],
    'Razlika brzina određuje koliko brzo se razdaljina između automobila smanjuje.', 'sustizanje',
    { mediji: STAZA(140, [[0, 140, 2, '70 km/h', 1.6]]), medijiOdgovora: STAZA(630, [[0, 630, 3, '90 km/h', 1.6]]) });
  Q(2, 'Motociklista je krenuo iz A u B. Ako vozi $40$ km/h, zakasni $3$ sata. Ako vozi $60$ km/h, stigne $1$ sat ranije. Koliko je rastojanje AB?',
    ['$480$ km', '$360$ km', '$240$ km', '$1200$ km'],
    'Vreme i brzina su obrnuto srazmerni kad je put isti: u prvom slučaju vozi $12$ h, a u drugom $8$ h.', 'rastojanje',
    { mediji: STAZA(480, [[0, 480, 2, 'A → B', 1.6]]) });
  Q(3, 'Dva pešaka iz mesta udaljenih $54$ km kreću istovremeno jedan drugom u susret, brzinama $5$ km/h i $4$ km/h. Posle koliko sati se sreću?',
    ['$6$ h', '$5$ h', '$7,5$ h', '$4$ h'],
    'Ako se kreću u istom smeru, računa se razlika brzina, a ne zbir.', 'pešaci',
    { mediji: STAZA(54, [[0, 54, 2, '5 km/h', 1.6], [54, 0, 3, '4 km/h', 2.7]]) });
  Q(2, 'Voz krene iz A ka B brzinom $40$ km/h. Sat vremena kasnije iz istog mesta krene drugi voz brzinom $60$ km/h. Posle koliko sati od polaska drugog će ga stići?',
    ['$2$ h', '$1,5$ h', '$2,5$ h', '$3$ h'],
    'Prvi voz je pre polaska drugog prešao $40$ km. Jednačina $60t = 40(t + 1)$ daje $20t = 40$, pa je $t = 2$ h.', 'voz',
    { mediji: STAZA(40, [[0, 40, 2, '40 km/h', 1.6]]), medijiOdgovora: STAZA(120, [[0, 120, 3, '60 km/h', 1.6]]) });
  Q(3, 'Dva biciklista se kreću jedan prema drugom: prvi $15$ km/h, drugi $10$ km/h. Startuju istovremeno sa razdaljine $75$ km. Koliko kilometara pređe drugi do susreta?',
    ['$30$ km', '$45$ km', '$60$ km/h', '$75$ km'],
    'Vreme do susreta je $75 : 25 = 3$ h, pa drugi pređe $10 · 3 = 30$ km.', 'razdaljina',
    { mediji: STAZA(75, [[0, 75, 2, '15 km/h', 1.6], [75, 0, 3, '10 km/h', 2.7]]) });
  Q(1, 'Ako pešak hoda brzinom $4$ km/h, koliko vremena mu treba za $10$ km?',
    ['$2,5$ h', '$40$ h', '$6$ h', '$0,25$ h'],
    'Vreme je put podeljen brzinom: $10 : 4 = 2,5$ h, tj. $2$ h $30$ min.', 'vreme',
    { mediji: STAZA(10, [[0, 10, 2, '4 km/h', 1.6]]) });
  Q(2, 'Dva biciklista kreću iz istog mesta u isto vreme u istom smeru. Prvi ide $20$ km/h, drugi $12$ km/h. Posle koliko sati je prvi ispred za $16$ km?',
    ['$2$ h', '$1$ h', '$3$ h', '$4,5$ h'],
    'Razlika brzina je $8$ km/h, a razlika puteva $16$ km. Vreme je $16 : 8 = 2$ h.', 'razlika',
    { mediji: STAZA(16, [[0, 16, 2, '20 km/h', 1.6]]) });
  U(2, 'Koja tvrdnja o kretanju u susret NIJE tačna?',
    ['Brzina približavanja je razlika brzina', 'Brzina približavanja je zbir brzina', 'Vreme do susreta je put podeljen zbirom brzina', 'Svaki pređe deo puta srazmeran svojoj brzini'],
    'Kad se kreću jedan prema drugom, razdaljina se smanjuje zbirom brzina, a ne njihovom razlikom.',
    'Razlika brzina važi kad se kreću u istom smeru.', 'susret',
    { mediji: STAZA(90, [[0, 90, 2, '~brzina 1', 1.6], [90, 0, 3, '~brzina 2', 2.7]]) });
  Q(3, 'Brzi voz pređe $180$ km za isto vreme kao sporiji voz $120$ km. Brzina brzog je $30$ km/h veća. Kolika je brzina sporijeg?',
    ['$60$ km/h', '$90$ km/h', '$30$ km/h', '$120$ km/h'],
    'Kad je vreme isto, odnosi puteva i brzina su jednaki. Ako je sporiji brzine $v$, iz $\\frac{180}{v + 30} = \\frac{120}{v}$ sledi $v = 60$ km/h.', 'vreme',
    { mediji: TR([[6, '180 km', 1], [4, '120 km', 2]]) });
  Q(3, 'Pešak krene brzinom $5$ km/h. Posle $1$ sata za njim krene biciklista brzinom $15$ km/h. Posle koliko sati biciklista stiže pešaka?',
    ['$0,5$ h', '$1$ h', '$1,5$ h', '$0,25$ h'],
    'Pešak je pre polaska biciklista prešao $5$ km. Jednačina $15t = 5(t + 1)$ daje $10t = 5$, pa je $t = 0,5$ h.', 'sustizanje',
    { mediji: STAZA(5, [[0, 5, 2, '5 km/h', 1.6]]) });
  Q(1, 'Šta znači oznaka „km/h“?',
    ['Kilometara na sat', 'Kilogram po času', 'Kilometar pre sata', 'Kilometara u hektaru'],
    'Brzina je pređeni put u jedinici vremena, pa je km/h oznaka za kilometre na sat.', 'brzina',
    { mediji: STAZA(60, [[0, 60, 2, 'km / h', 1.6]]) });
  U(2, 'Koji zapis NIJE tačan?',
    ['put = brzina : vreme', 'put = brzina · vreme', 'vreme = put : brzina', 'brzina = put : vreme'],
    'Put je brzina pomnožena vremenom, a brzina je put podeljen vremenom. Put se ne dobija deljenjem brzinom sa vremenom.',
    'Ove tri veze su jedna ista formula, zapisana na tri načina.', 'formula',
    { mediji: TR([[2, '~put', 1], [1, '~brzina', 2], [1, '~vreme', 3]]) });
  Q(2, 'Auto pređe put za $3$ h brzinom $60$ km/h. Koliko sati bi vozio brzinom $90$ km/h da pređe isti put?',
    ['$2$ h', '$4$ h', '$1$ h', '$3,5$ h'],
    'Put je $60 · 3 = 180$ km. Vreme je $180 : 90 = 2$ h.', 'put',
    { mediji: STAZA(180, [[0, 180, 2, '60 km/h', 1.6]]) });
  Q(2, 'Dva automobila kreću jedan prema drugom iz mesta udaljenih $200$ km, brzinama $60$ km/h i $40$ km/h. Posle koliko sati se sreću?',
    ['$2$ h', '$3$ h', '$5,5$ h', '$4$ h'],
    'Brzina približavanja je zbir $60 + 40 = 100$ km/h, pa je vreme $200 : 100 = 2$ h.', 'automobili',
    { mediji: STAZA(200, [[0, 200, 2, '60 km/h', 1.6], [200, 0, 3, '40 km/h', 2.7]]) });
  S(2, 'Spoji veličinu sa formulom za nju.',
    [['put', 'brzina · vreme'], ['vreme', 'put : brzina'], ['brzina', 'put : vreme'], ['brzina pri susretu', 'zbir brzina']],
    'Ista tri pravila važe za sve vrste kretanja.', 'formule', {});

  // ════════ 9. Još neke primene linearnih jednačina ════════
  L('Još neke primene linearnih jednačina');
  Q(1, 'Cev A napuni bazen za $6$ h, a cev B za $12$ h. Ako rade zajedno, za koliko sati će se bazen napuniti?',
    ['$4$ h', '$3$ h', '$4,5$ h', '$9$ h'],
    'Kad rade zajedno, vreme je manje od vremena svake cevi ponaosob.', 'bazen',
    { mediji: TR([[2, '~cev A', 1], [1, '~cev B', 2]]) });
  Q(3, 'Pravougli trougao ima manju katetu $10$ cm, a hipotenuza je za $2$ cm duža od veće katete. Kolika je površina trougla?',
    ['$120$ cm²', '$60$ cm²', '$2400$ cm²', '$100$ cm²'],
    'Trougao sa stranicama $10$, $24$ i $26$ je poznata Pitagorina trojka.', 'pravougli',
    { mediji: G({ C: [0, 0], A: [0, 24], B: [10, 0] }, [{ p: 'ABC', b: 0 }, { pu: 'BCA' }, { d: 'CB', o: '10 cm' }, { d: 'CA', o: 'x' }, { d: 'AB', o: 'x + 2' }], GO) });
  Q(2, 'Drvo visine $32$ m polomi oluja, tako da vrh padne $16$ m od stabla. Na kojoj visini se drvo polomilo?',
    ['$12$ m', '$16$ m', '$20$ m', '$8,5$ m'],
    'Deo drveta koji je pao čini hipotenuzu pravouglog trougla.', 'drvo',
    { mediji: G({ O: [0, 0], V: [16, 0], S: [0, 32] }, [{ d: 'OS', o: '32 m' }, { d: 'OV', o: '16 m' }, { p: 'OSV', b: 1 }], GO) });
  Q(1, 'Zlato finoće $14$ karata ima $585$ hiljaditih delova čistog zlata. Koliko grama čistog zlata ima u $200$ g takvog zlata?',
    ['$117$ g', '$585$ g', '$200$ g', '$1170$ g'],
    'Zlato se meri u karatima, a čisto zlato ima $24$ karata.', 'zlato',
    { mediji: TR([[5.85, '~585 od 1000', 1], [4.15, '~ostalo', 2]]) });
  Q(3, 'Pomešamo $2$ kg zlata finoće $17$ karata i $3$ kg zlata finoće $22$ karata. Kolika je finoća legure u karatima?',
    ['$20$ karata', '$19,5$ karata', '$21$ karat', '$18$ karata'],
    'Karat je jedinica finoće zlata: $24$ karata je čisto zlato.', 'mešanje',
    { mediji: TR([[2, '2 kg · 17', 1], [3, '3 kg · 22', 2]]) });
  Q(2, 'Pomešano je $100$ l rastvora sa $80\\%$ alkohola i $80$ l rastvora sa $35\\%$ alkohola. Koliki je procenat alkohola u mešavini?',
    ['$60\\%$', '$55,5\\%$', '$58\\%$', '$65\\%$'],
    'Ovakav zadatak se zove zadatak o mešanju.', 'mešanje',
    { mediji: TR([[8, '80 %', 1], [4, '35 %', 2]]) });
  Q(2, 'Koliko kilograma pasulja cene $200$ dinara po kilogramu treba dodati $100$ kg pasulja cene $280$ dinara, da bi prosečna cena bila $250$ dinara?',
    ['$60$ kg', '$50$ kg', '$80,5$ kg', '$40$ kg'],
    'Zadatak se može rešiti i metodom ukrštanja, bez jednačine.', 'pasulj',
    { mediji: TR([[1, '100 kg · 280', 2], [1, 'm · 200', 1]]) });
  Q(2, 'Zbir četiri prirodna broja je $192$. Ako prvom dodamo $3$, drugom oduzmemo $3$, treći pomnožimo sa $3$, a četvrti podelimo sa $3$, dobijamo isti broj. Koji je najmanji od četiri početna broja?',
    ['$12$', '$−33$', '$36$', '$9$'],
    'Zadatak se najlakše rešava kad sve brojeve izrazimo jednim slovom.', 'zbir',
    { mediji: TR([[3, 'y − 3', 1], [3, 'y + 3', 2], [1, 'y : 3', 3], [3, '3y', 4]]) });
  Q(2, 'Koliko litara tople vode od $60 °C$ treba doliti u $100$ l vode od $20 °C$, da mešavina ima $40 °C$?',
    ['$100$ l', '$50$ l', '$60$ l', '$1000$ l'],
    'Mešanje tople i hladne vode ima isti račun kao mešanje legura.', 'voda',
    { mediji: V([{ tx: '100 · 20', b: 1 }, { tx: 'x · 60', b: 2 }], [{ tx: '(100 + x) · 40', b: 3 }]) });
  Q(1, 'Koliko je $x$ ako je $\\frac{1}{x} = \\frac{4}{3}$?',
    ['$\\frac{3}{4}$', '$\\frac{4}{3}$', '$\\frac{1}{30}$', '$4$'],
    'Obrnuta vrednost razlomka zove se recipročna vrednost.', 'razlomak',
    { mediji: V([{ tx: '1 : x', b: 1 }], [{ tx: '4 : 3', b: 3, teg: 1 }]) });
  Q(2, 'Dva broja imaju zbir $13$, a zbir njihovih kvadrata $89$. Kolika je njihova razlika ako je veći broj $8$?',
    ['$3$', '$5$', '$2$', '$−8$'],
    'Kvadrati brojeva $5$ i $8$ daju zbir $89$, a sami brojevi zbir $13$.', 'razlika',
    { mediji: TR([[5, '~manji', 1], [8, '~veći = 8', 2]]) });
  Q(2, 'Dva broja se razlikuju za $4$, a njihov zbir je $18$. Koji je veći?',
    ['$11$', '$7$', '$−14$', '$9$'],
    'Ako je manji broj $x$, veći je $x + 4$. Zbir: $2x + 4 = 18$, pa je $x = 7$, a veći je $11$.', 'razlika',
    { mediji: TR([[1, 'x', 1], [1.6, 'x + 4', 2]]) });
  Q(3, 'Koliko iznosi $x$ u jednačini $\\frac{x + 1}{3} = \\frac{x − 1}{2}$?',
    ['$5$', '$3$', '$7$', '$−5$'],
    'Razlomke rešavamo množenjem sa najmanjim zajedničkim sadržaocem imenilaca.', 'razlomak',
    { mediji: V([{ tx: '(x + 1) : 3', b: 1 }], [{ tx: '(x − 1) : 2', b: 3 }]) });
  Q(3, 'Obim pravougaonika je $30$ cm, a jedna stranica je za $3$ cm duža od druge. Kolika je duža stranica?',
    ['$9$ cm', '$8$ cm', '$12$ cm', '$10$ cm'],
    'Obim je zbir svih stranica, pa je polovina obima zbir dve susedne stranice.', 'obim',
    { mediji: G({ A: [0, 0], B: [1.5, 0], C: [1.5, 1], D: [0, 1] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: 'a' }, { d: 'BC', o: 'b' }], GO) });
  S(2, 'Spoji vrstu zadatka sa primerom.',
    [['mešanje', 'procenat u rastvoru'], ['kretanje', 'susret pešaka'], ['geometrija', 'Pitagorina teorema'], ['rad cevi', 'zajedničko punjenje bazena']],
    'Sve ove vrste zadataka se svode na jednu linearnu jednačinu.', 'vrste', {});
  Q(3, 'Diofantov životni vek je $x$ godina. Koliko godina je živeo ako važi $\\frac{x}{6} + \\frac{x}{12} + \\frac{x}{7} + 5 + \\frac{x}{2} + 4 = x$?',
    ['$84$', '$72$', '$96$', '$−60$'],
    'Diofant Aleksandrijski, grčki matematičar iz oko 250. godine n. e., često se smatra ocem algebre.', 'diofant',
    { mediji: TR([[1, 'x : 6', 1], [1, 'x : 12', 2], [1, 'x : 7', 3], [1, 'x : 2', 4]]) });
  Q(3, 'Konj pojede stog sena za $2$ meseca, ovca za $3$ meseca, a koza za $4$ meseca. Za koje vreme sva tri zajedno pojedu stog?',
    ['$\\frac{12}{13}$ meseca', '$1$ mesec i $3$ dana', '$\\frac{13}{12}$ meseca', '$\\frac{9}{4}$ meseca'],
    'Zadaci sa radom (koliko vremena treba) imaju isti račun kao zadaci sa cevima.', 'senka',
    { mediji: TR([[6, '~stog sena', 1]]) });
};
