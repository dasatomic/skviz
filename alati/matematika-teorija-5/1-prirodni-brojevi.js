// Lekcije 1–8: prirodni brojevi, deljivost, skupovi (teorija i pojmovi, bez računa na papiru).
module.exports = ({ L, Q, U, S, G, r, naKrugu, skok, skokovi, venn, upisi, tackice, traka, pica, O, bez, dec }) => {

  // broj sa istaknutim ciframa (za pravila deljivosti): delovi = [[tekst, boja?], …]
  const broj = (delovi) => {
    const e = [];
    let x = 0;
    for (const d of delovi) {
      const t = d[0], b = d[1];
      e.push({ tx: t, at: [x, 0], vel: 26, ...(b !== undefined ? { b } : {}) });
      x += String(t).length * 0.66;
    }
    return G(O, e, { ...bez, velicina: 240 });
  };
  // zbir cifara broja (pravilo deljivosti sa 3 i 9)
  const zbirCifara = (cifre) => {
    const z = cifre.reduce((a, b) => a + b, 0);
    const e = [];
    let x = 0;
    cifre.forEach((c, i) => {
      e.push({ tx: String(c), at: [x, 0], vel: 22 });
      x += 0.7;
      if (i < cifre.length - 1) { e.push({ tx: '+', at: [x, 0], vel: 22, b: 4 }); x += 0.55; }
    });
    e.push({ tx: '= ' + z, at: [x + 0.25, 0], vel: 22, b: 1 });
    return G(O, e, { ...bez, velicina: 280 });
  };

  // ── 1. svojstva računskih operacija ──
  L('Svojstva sabiranja, oduzimanja, množenja i deljenja u skupu N₀');
  Q(1, 'Koje svojstvo kaže da sabirci mogu da zamene mesta, a zbir ostaje isti?',
    ['Komutativnost sabiranja', 'Asocijativnost sabiranja', 'Distributivnost', 'Tranzitivnost'],
    'Komutativnost znači „razmena“: $a+b=b+a$. Isto važi i za množenje: $a \\cdot b = b \\cdot a$. Oduzimanje i deljenje ovo svojstvo nemaju!', 'zamena',
    { mediji: { vrsta: 'formula', tekst: '$a+b=b+a$' } });
  Q(1, 'Koje svojstvo omogućava da sabiraš u parovima, kako ti je lakše: $(a+b)+c=a+(b+c)$?',
    ['Asocijativnost sabiranja', 'Komutativnost sabiranja', 'Distributivnost', 'Zatvorenost'],
    'Asocijativnost znači „udruživanje“ – zagrade se mogu pomerati. Zahvaljujući njoj možeš prvo sabrati $357+643=1000$, pa tek onda dodati $589$.', 'udruživanje',
    { mediji: { vrsta: 'formula', tekst: '$(a+b)+c=a+(b+c)$' } });
  Q(2, 'Koje svojstvo povezuje množenje i sabiranje: $a \\cdot (b+c) = a \\cdot b + a \\cdot c$?',
    ['Distributivnost', 'Komutativnost', 'Asocijativnost', 'Idempotencija'],
    'Distributivnost znači „razdeljivanje“: množenje se raspodeljuje na svaki sabirak u zagradi. Zato je $7 \\cdot 12 = 7\\cdot10 + 7\\cdot2 = 70+14=84$.', 'raspodela',
    { mediji: { vrsta: 'formula', tekst: '$a\\cdot(b+c)=a\\cdot b+a\\cdot c$' } });
  Q(1, 'Koji broj je neutralan za sabiranje (ne menja broj kad mu se doda)?',
    ['0', '1', '10', 'Ne postoji'],
    'Nula je neutralna za sabiranje: $a+0=a$. Zato se nula i zove „neutral“. Za množenje je neutralan broj 1.', 'nula',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$a+0=a$' } });
  Q(1, 'Koji broj je neutralan za množenje (ne menja broj kad se njime pomnoži)?',
    ['1', '0', '2', '10'],
    'Jedinica je neutralna za množenje: $a \\cdot 1 = a$. Svaki broj pomnožen jedinicom ostaje isti.', 'jedinica',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$a\\cdot1=a$' } });
  Q(2, 'Šta se dešava kad bilo koji broj pomnožiš nulom?',
    ['Rezultat je uvek 0', 'Rezultat je 1', 'Rezultat je isti broj', 'Ne može se izračunati'],
    'Množenje nulom „uništava“ sve: $a \\cdot 0 = 0$. Zato se nula zove i „upijajući element“ za množenje.', 'množenje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$a\\cdot0=0$' } });
  Q(2, 'Zašto deljenje nulom nije dozvoljeno?',
    ['Nijedan broj ne daje smislen rezultat', 'Rezultat je uvek 0', 'Rezultat je uvek 1', 'Rezultat je beskonačno velik'],
    'Da je $10:0=x$, moralo bi da važi $x \\cdot 0 = 10$ – a svaki broj puta nula daje nulu. Zato deljenje nulom nema rešenje; kažemo da nije definisano.', 'deljenje',
    { mediji: { vrsta: 'formula', tekst: '$a:0$ nije definisano' } });
  Q(1, 'Koliko je $0$ podeljeno nekim brojem različitim od nule, na primer $0:7$?',
    ['0', '7', '1', 'Ne može se podeliti'],
    'Nula podeljena bilo čim (osim nulom) je uvek nula: nemaš ništa, pa na koliko god delova da podeliš, svaki deo je prazan.', 'nula',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$0:7=0$' } });
  Q(2, 'Šta je $a - a$ za bilo koji broj $a$?',
    ['Uvek 0', 'Uvek $a$', 'Uvek 1', 'Zavisi od broja'],
    'Kad od broja oduzmeš samog sebe, ostaje ništa: $a-a=0$. Isto kao kad pojedeš sve što imaš.', 'oduzimanje',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$a-a=0$' } });

  // ── 2. deljenje sa ostatkom ──
  L('Deljenje sa ostatkom');
  Q(1, 'Pri deljenju sa ostatkom, kakav mora biti ostatak u odnosu na delilac?',
    ['Manji od delioca', 'Veći od delioca', 'Jednak deliocu', 'Uvek paran'],
    'Ostatak je uvek manji od delioca. Kad bi bio jednak ili veći, mogli bismo još jednom da podelimo. Pri deljenju sa 7 ostatak može biti samo $0,1,2,3,4,5$ ili $6$.', 'ostatak',
    { mediji: G(O, tackice(13, 7), { ...bez, velicina: 300 }) });
  Q(2, 'Kako proveravaš deljenje sa ostatkom $23 = 4 \\cdot 5 + 3$?',
    ['Delilac puta količnik plus ostatak daje deljenik', 'Delilac puta ostatak daje količnik', 'Količnik plus ostatak daje delilac', 'Ostatak puta količnik daje deljenik'],
    'Provera je uvek: $deljenik = delilac \\cdot količnik + ostatak$. Ovde: $23 = 4\\cdot5 + 3$. Ako ovo važi, deljenje je tačno.', 'provera',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$a=b\\cdot q+r$' } });
  Q(1, 'Koji je najveći mogući ostatak pri deljenju sa 6?',
    ['5', '6', '7', '10'],
    'Ostatak mora biti manji od delioca, dakle najviše $6-1=5$. Kad bi ostatak bio 6, deljenje ne bi bilo do kraja.', 'ostatak',
    { mediji: G(O, tackice(11, 6), { ...bez, velicina: 300 }) });
  Q(2, 'Kružići su poređani u redove po 4. Koliki je ostatak pri deljenju $14:4$?',
    ['2', '3', '1', '0'],
    'Od 14 kružića u redovima po 4 dobiju se 3 puna reda ($12$) i ostaju još $2$ kružića – to je ostatak: $14=4\\cdot3+2$.', 'ostatak',
    { mediji: G(O, tackice(14, 4), { ...bez, velicina: 300 }) });
  Q(2, 'Pri deljenju sa 5, koji od ovih brojeva NE može biti ostatak?',
    ['5', '0', '2', '4'],
    'Ostatak pri deljenju sa 5 može biti samo $0,1,2,3$ ili $4$ – uvek manji od 5. Broj 5 bi značio da deljenje nije završeno.', 'ostatak',
    { mediji: G(O, [{ osa: [0, 5], podela: 1, svaki: 1 }, ...[0, 1, 2, 3, 4].map((i) => ({ tx: '●', at: [i, 0], vel: 10, b: 1 }))], { ...bez, velicina: 300 }) });
  Q(3, 'Ako je delilac 9, a ostatak 7, koji je najmanji broj koji treba dodati deljeniku da bi deljenje bilo bez ostatka?',
    ['2', '1', '7', '9'],
    'Do delioca (9) fali još $9-7=2$. Kad ostatak povećaš za 2, on postaje 9 – što znači još jedan ceo deo i ostatak 0.', 'ostatak',
    { mediji: G(O, [{ osa: [0, 9], podela: 1, svaki: 1 }, { lin: [[7, -0.05], [7, 0.05]], b: 1, debljina: 4 }, { tx: '7', at: [7, 0.3], vel: 14, b: 1 }, { tx: '+2', at: [8, 0.55], vel: 14, b: 2 }], { ...bez, velicina: 300 }) });

  // ── 3. činioci i sadržaoci ──
  L('Svojstva deljivosti; činioci i sadržaoci');
  Q(1, 'Kako se zove broj kojim se dati broj deli bez ostatka?',
    ['Delilac (činilac)', 'Sadržalac', 'Količnik', 'Ostatak'],
    'Ako $6$ deli $24$ bez ostatka, onda je $6$ delilac (činilac) broja $24$. Činioci su brojevi čijim množenjem nastaje dati broj: $6\\cdot4=24$.', 'delilac',
    { mediji: { vrsta: 'formula', tekst: '$24=6\\cdot4$' } });
  Q(1, 'Kako se zove broj koji je deljiv datim brojem?',
    ['Sadržalac', 'Delilac', 'Prost broj', 'Neparan broj'],
    'Sadržalac (višekratnik) broja $6$ je svaki broj koji se dobija množenjem: $6, 12, 18, 24, 30, \\dots$ Ima ih beskonačno mnogo.', 'sadržalac',
    { mediji: G(O, [...skokovi(0, 6, 4), { tx: '…', at: [24, 1.2], vel: 22 }], { ...bez, velicina: 320 }) });
  Q(2, 'Ako $8$ deli $40$ bez ostatka, šta je $40$ u odnosu na $8$?',
    ['Sadržalac broja 8', 'Delilac broja 8', 'Prost činilac', 'Neutralan broj'],
    '$40 = 8 \\cdot 5$, pa je $40$ sadržalac broja $8$. Istovremeno je $8$ delilac broja $40$. Delilac i sadržalac su dve strane iste priče.', 'sadržalac',
    { mediji: G(O, [...skokovi(0, 8, 5), { tx: '40', at: [40, 1.2], vel: 18 }], { ...bez, velicina: 320 }) });
  Q(2, 'Koji broj je delilac SVAKOG prirodnog broja?',
    ['1', '0', '2', '10'],
    'Broj 1 deli svaki broj bez ostatka, pa je delilac svih prirodnih brojeva. Zato se i ne računa u „prave“ delioce kada tražimo proste brojeve.', 'jedinica',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$n:1=n$' } });
  Q(2, 'Broj 0 je sadržalac svakog prirodnog broja. Zašto?',
    ['Jer je $0 = n \\cdot 0$ za svako $n$', 'Jer je $0 + n = n$ za svako $n$', 'Jer je 0 najmanji broj', 'Jer je 0 paran broj'],
    'Za svaki prirodan broj $n$ važi $n \\cdot 0 = 0$, pa je $0$ sadržalac svakog broja. Zato je 0 i deljiva svim brojevima (osim deljenja nulom).', 'nula',
    { mediji: { vrsta: 'formula', tekst: '$n\\cdot0=0$' } });
  Q(3, 'Skokovi na brojevnoj pravoj idu po 3: 0, 3, 6, 9, 12… Koji od ovih brojeva će biti „pogođen“ skokom?',
    ['27', '28', '29', '31'],
    'Skok po 3 pogađa samo sadržaoce broja 3, a to su brojevi deljivi sa 3. Od ponuđenih je to $27 = 3\\cdot9$.', 'sadržalac',
    { mediji: G(O, [...skokovi(0, 3, 4), { tx: '…', at: [13, 0.9], vel: 22 }], { ...bez, velicina: 320 }) });

  // ── 4. deljivost sa 2, 5 i dekadnim jedinicama ──
  L('Deljivost sa 2, 5 i dekadnim jedinicama');
  Q(1, 'Po kojoj cifri prepoznaješ da je broj deljiv sa 2?',
    ['Po cifri jedinica – mora biti parna', 'Po prvoj cifri', 'Po zbiru cifara', 'Po poslednje dve cifre'],
    'Broj je deljiv sa 2 ako mu je poslednja cifra parna: $0, 2, 4, 6$ ili $8$. Takve brojeve zovemo parni.', 'deljivost',
    { medijiOdgovora: { vrsta: 'formula', tekst: 'parne cifre: $0,2,4,6,8$' } });
  Q(1, 'Koji od ovih brojeva je deljiv sa 5?',
    ['1.235', '1.234', '1.238', '1.232'],
    'Broj je deljiv sa 5 ako se završava cifrom 0 ili 5. Broj $1\\,235$ se završava sa 5, pa je deljiv sa 5.', 'deljivost',
    { medijiOdgovora: broj([['1.23'], ['5', 1]]) });
  Q(1, 'Broj deljiv sa 10 mora da se završava…',
    ['cifrom 0', 'cifrom 5', 'parnom cifrom', 'cifrom 1'],
    'Deljivost sa 10 traži poslednju cifru 0, jer je $10=2\\cdot5$ – broj mora istovremeno biti deljiv sa 2 i sa 5.', 'deset',
    { mediji: { vrsta: 'formula', tekst: '$10=2\\cdot5$' } });
  Q(2, 'Koliko nula na kraju mora imati broj da bi bio deljiv sa 100?',
    ['Bar dve nule', 'Bar jednu nulu', 'Bar tri nule', 'Četiri nule'],
    'Dekadne jedinice: deljivost sa 10 traži jednu nulu, sa 100 dve nule, sa 1000 tri nule, i tako dalje.', 'stotina',
    { medijiOdgovora: broj([['1'], ['00', 1]]) });
  Q(2, 'Koji od ovih brojeva je deljiv i sa 2 i sa 5?',
    ['370', '365', '372', '375'],
    'Da bi broj bio deljiv i sa 2 i sa 5, mora da se završava sa 0 (jer 2 traži parnu cifru, a 5 traži 0 ili 5 – jedino 0 zadovoljava oba).', 'deset',
    { medijiOdgovora: broj([['37'], ['0', 1]]) });
  Q(3, 'Koji od ovih brojeva je deljiv sa 2, sa 5 i sa 10 istovremeno?',
    ['1.000', '1.005', '1.002', '1.025'],
    'Deljivost sa 10 povlači deljivost sa 2 i sa 5. Od ponuđenih, samo se $1\\,000$ završava nulom; $1\\,002$ je deljiv samo sa 2, a $1\\,005$ i $1\\,025$ samo sa 5.', 'deset',
    { medijiOdgovora: broj([['1.'], ['000', 1]]) });

  // ── 5. deljivost sa 4 i 25 ──
  L('Deljivost sa 4 i 25');
  Q(1, 'Po čemu prepoznaješ da je broj deljiv sa 4?',
    ['Poslednje dve cifre čine broj deljiv sa 4', 'Poslednja cifra je 4', 'Zbir cifara je deljiv sa 4', 'Broj je paran'],
    'Gledaš samo poslednje dve cifre: ako čine broj deljiv sa 4, ceo broj je deljiv sa 4. Na primer, $132$ je deljivo sa 4 jer je $32$ deljivo sa 4.', 'deljivost',
    { mediji: broj([['1'], ['32', 1]]) });
  Q(1, 'Koji od ovih brojeva je deljiv sa 4?',
    ['1.024', '1.014', '1.022', '1.026'],
    'Gledamo poslednje dve cifre: $24$ je deljivo sa 4 ($24=4\\cdot6$), pa je i ceo broj $1\\,024$ deljiv sa 4.', 'deljivost',
    { medijiOdgovora: broj([['10'], ['24', 1]]) });
  Q(1, 'Broj deljiv sa 25 mora da se završava na…',
    ['00, 25, 50 ili 75', 'samo na 25', 'samo na 00', '5 ili 0'],
    'Četiri moguća završetka: $00, 25, 50$ i $75$. Na primer, $3\\,175$ se završava sa $75$, pa je deljiv sa 25.', 'deljivost',
    { medijiOdgovora: G(O, [{ tx: '00', at: [-3, 0], vel: 20, b: 1 }, { tx: '25', at: [-1, 0], vel: 20, b: 1 }, { tx: '50', at: [1, 0], vel: 20, b: 1 }, { tx: '75', at: [3, 0], vel: 20, b: 1 }], { ...bez, velicina: 280 }) });
  Q(2, 'Koji od ovih brojeva je deljiv sa 25?',
    ['4.075', '4.070', '4.085', '4.055'],
    'Broj $4\\,075$ se završava sa $75$, a to je jedan od dozvoljenih završetaka za deljivost sa 25 ($00,25,50,75$).', 'deljivost',
    { medijiOdgovora: broj([['4.0'], ['75', 1]]) });
  Q(2, 'Ako se broj završava sa 00, on je sigurno deljiv sa…',
    ['i sa 4 i sa 25', 'samo sa 4', 'samo sa 25', 'sa 3'],
    'Završetak 00 znači da su poslednje dve cifre deljive i sa 4 i sa 25, pa je i ceo broj deljiv sa oba. Takav broj je deljiv i sa 100.', 'stotina',
    { mediji: broj([['2 3'], ['00', 1]]) });
  Q(3, 'Koji od ovih brojeva je deljiv i sa 4 i sa 25?',
    ['2.300', '2.325', '2.304', '2.350'],
    'Deljiv sa 4: gledamo poslednje dve cifre. Deljiv sa 25: završetak $00,25,50,75$. Završetak $00$ (broj $2\\,300$) zadovoljava oba uslova.', 'deljivost',
    { medijiOdgovora: broj([['23'], ['00', 1]]) });

  // ── 6. deljivost sa 3 i 9 ──
  L('Deljivost sa 3 i 9');
  Q(1, 'Kako bez deljenja proveravaš da li je broj deljiv sa 3?',
    ['Po zbiru svih cifara', 'Po poslednjoj cifri', 'Po poslednje dve cifre', 'Po prvoj cifri'],
    'Sabereš sve cifre broja. Ako je taj zbir deljiv sa 3, ceo broj je deljiv sa 3. Na primer, $123$: zbir $1+2+3=6$, a $6$ je deljivo sa 3.', 'deljivost',
    { medijiOdgovora: zbirCifara([1, 2, 3]) });
  Q(1, 'Koji od ovih brojeva je deljiv sa 3?',
    ['405', '406', '407', '409'],
    'Za $405$: zbir cifara je $4+0+5=9$, a $9$ je deljivo sa 3, pa je i $405$ deljivo sa 3.', 'deljivost',
    { medijiOdgovora: zbirCifara([4, 0, 5]) });
  Q(2, 'Koji od ovih brojeva je deljiv sa 9?',
    ['3.186', '3.183', '3.187', '3.185'],
    'Za $3\\,186$: zbir cifara je $3+1+8+6=18$, a $18$ je deljivo sa 9, pa je i ceo broj deljiv sa 9.', 'deljivost',
    { medijiOdgovora: zbirCifara([3, 1, 8, 6]) });
  Q(2, 'Da li je broj 1.234 deljiv sa 3?',
    ['Ne, jer je zbir cifara 10', 'Da, jer je paran', 'Da, jer se završava sa 4', 'Ne, jer se završava sa 4'],
    'Zbir cifara je $1+2+3+4=10$, a $10$ nije deljivo sa 3, pa ni $1\\,234$ nije deljivo sa 3. Paran broj nije automatski deljiv sa 3!', 'deljivost',
    { mediji: zbirCifara([1, 2, 3, 4]) });
  Q(2, 'Ako je broj deljiv sa 9, on je uvek deljiv i sa…',
    ['3', '6', '2', '5'],
    'Svaki broj deljiv sa 9 deljiv je i sa 3, jer je $9=3\\cdot3$. Obrnuto ne važi: $12$ je deljivo sa 3, ali ne i sa 9.', 'deljivost',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$9=3\\cdot3$' } });
  Q(3, 'Koja cifra na mestu zvezdice čini broj 5★1 deljivim sa 3?',
    ['3', '2', '4', '5'],
    'Zbir cifara je $5+\\star+1=6+\\star$. Da bi bio deljiv sa 3, zvezdica može biti $0, 3, 6$ ili $9$. Od ponuđenih, to je 3: $531$, a $5+3+1=9$.', 'deljivost',
    { mediji: G(O, [{ tx: '5', at: [-1.4, 0], vel: 22 }, { tx: '+', at: [-0.8, 0], vel: 22, b: 4 }, { tx: '★', at: [-0.2, 0], vel: 22, b: 1 }, { tx: '+', at: [0.4, 0], vel: 22, b: 4 }, { tx: '1', at: [1, 0], vel: 22 }, { tx: '= 6 + ★', at: [2, 0], vel: 22, b: 1 }], { ...bez, velicina: 300 }) });

  // ── 7. skupovi ──
  L('Skupovi');
  Q(1, 'Kako se zove zbirka objekata koji čine jednu celinu?',
    ['Skup', 'Broj', 'Formula', 'Jednačina'],
    'Skup je osnovni pojam: objekte skupa zovemo elementima. Skup se zapisuje vitičastim zagradama, na primer $A=\\{1,2,3\\}$.', 'skup',
    { mediji: { vrsta: 'formula', tekst: '$A=\\{1,2,3\\}$' } });
  Q(1, 'Koja oznaka znači da element pripada skupu?',
    ['$\\in$', '$=$', '$>$', '$\\notin$'],
    'Oznaka $\\in$ čitamo „pripada“: $2 \\in A$ znači da je 2 element skupa $A$. Precrtana oznaka $\\notin$ znači „ne pripada“.', 'pripada',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$2 \\in A$' } });
  Q(1, 'Kako se zove skup koji nema nijedan element?',
    ['Prazan skup', 'Nula skup', 'Pun skup', 'Neparan skup'],
    'Prazan skup označavamo sa $\\varnothing$ ili $\\{\\}$. On nema nijedan element, ali je i dalje skup – kao prazna kutija.', 'prazan',
    { mediji: { vrsta: 'formula', tekst: '$\\varnothing = \\{\\}$' } });
  Q(2, 'Kojim slovom označavamo skup prirodnih brojeva?',
    ['$\\mathbb{N}$', '$\\mathbb{Z}$', '$\\mathbb{Q}$', '$\\mathbb{R}$'],
    'Prirodni brojevi su brojevi za brojanje: $1,2,3,4,\\dots$ Označavamo ih sa $\\mathbb{N}$ (od engleskog „natural“).', 'prirodan',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\mathbb{N}=\\{1,2,3,4,\\dots\\}$' } });
  Q(2, 'Kojim slovom označavamo skup prirodnih brojeva zajedno sa nulom?',
    ['$\\mathbb{N}_0$', '$\\mathbb{N}$', '$\\mathbb{Z}$', '$\\varnothing$'],
    'Skup $\\mathbb{N}_0$ dobijamo kad prirodnim brojevima dodamo nulu: $0,1,2,3,\\dots$ Donja nula u oznaci upravo to i govori.', 'prirodan',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\mathbb{N}_0=\\{0,1,2,3,\\dots\\}$' } });
  Q(2, 'Da li su $\\varnothing$ i $\\{0\\}$ isto?',
    ['Ne – prazan skup i skup sa jednim elementom 0', 'Da – oba su prazna', 'Da – oba imaju po jedan element', 'Ne – oba su puna'],
    '$\\varnothing$ nema nijedan element, a $\\{0\\}$ ima jedan element – broj 0. To je razlika kao između prazne kutije i kutije u kojoj je jedna nula.', 'prazan',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$\\varnothing\\neq\\{0\\}$' } });
  Q(3, 'Koliko elemenata ima skup $B = \\{2, 4, 6, 2, 8\\}$?',
    ['4', '5', '6', '3'],
    'Element 2 se pojavljuje dva puta, ali se u skupu računa samo jednom. Zato skup $B$ ima 4 različita elementa: $2, 4, 6$ i $8$.', 'skup',
    { medijiOdgovora: G(O, [{ tx: '2  4  6  2  8', at: [0, 0.8], vel: 22 }, { tx: 'skup', at: [0, 0], vel: 13, b: 4 }, { tx: '{ 2 , 4 , 6 , 8 }', at: [0, -0.8], vel: 22, b: 1 }], { ...bez, velicina: 300 }) });

  U(2, 'Koji broj je uljez?', ['7', '2', '4', '6'],
    '7 je neparan, a ostali su parni brojevi (deljivi sa 2).',
    'Parni brojevi se završavaju ciframa 0, 2, 4, 6 ili 8 – sedmica to nije, pa se ne uklapa u društvo.', 'paran',
    { mediji: G(O, [{ tx: '2', at: [-2, 0], vel: 22 }, { tx: '4', at: [-1, 0], vel: 22 }, { tx: '6', at: [0, 0], vel: 22 }, { tx: '7', at: [1, 0], vel: 22 }], { ...bez, velicina: 260 }) });

  // ── 8. skupovne operacije ──
  L('Skupovne operacije: unija, presek i razlika');
  Q(1, 'Koja skupovna operacija spaja SVE elemente dva skupa?',
    ['Unija', 'Presek', 'Razlika', 'Množenje'],
    'Unija $A \\cup B$ sadrži sve elemente koji su u $A$, u $B$ ili u oba. Zajednički elementi se ne dupliraju.', 'unija',
    { mediji: { vrsta: 'formula', tekst: '$A\\cup B$' } });
  Q(1, 'Koja skupovna operacija daje samo ZAJEDNIČKE elemente?',
    ['Presek', 'Unija', 'Razlika', 'Sabiranje'],
    'Presek $A \\cap B$ sadrži elemente koji su i u $A$ i u $B$. Ako zajedničkih elemenata nema, presek je prazan skup.', 'presek',
    { mediji: { vrsta: 'formula', tekst: '$A\\cap B$' } });
  Q(2, 'Ako je $A=\\{1,2,3\\}$ i $B=\\{3,4\\}$, koliki je presek $A \\cap B$?',
    ['$\\{3\\}$', '$\\{1,2,3,4\\}$', '$\\{1,2\\}$', '$\\{4\\}$'],
    'Jedini element koji je u oba skupa je 3, pa je $A\\cap B=\\{3\\}$. Presek traži ono što je zajedničko.', 'presek',
    { medijiOdgovora: G(O, [...venn({ imena: ['A', 'B'], presek: true }).e, ...upisi(['1', '2'], venn({ imena: ['A', 'B'] }).mesta.A, { vel: 15 }), ...upisi(['4'], venn({ imena: ['A', 'B'] }).mesta.B, { vel: 15 }), ...upisi(['3'], venn({ imena: ['A', 'B'] }).mesta.AB, { vel: 15, b: 1 })], { ...bez, velicina: 260 }) });
  Q(2, 'Ako je $A=\\{1,2,3\\}$ i $B=\\{3,4\\}$, kolika je unija $A \\cup B$?',
    ['$\\{1,2,3,4\\}$', '$\\{3\\}$', '$\\{1,2\\}$', '$\\{4\\}$'],
    'Unija uzima sve elemente iz oba skupa, bez ponavljanja: $\\{1,2,3,4\\}$. Element 3 pišemo samo jednom.', 'unija',
    { medijiOdgovora: G(O, [...venn({ imena: ['A', 'B'], samoA: true, samoB: true, presek: true }).e, ...upisi(['1', '2'], venn({ imena: ['A', 'B'] }).mesta.A, { vel: 15 }), ...upisi(['4'], venn({ imena: ['A', 'B'] }).mesta.B, { vel: 15 }), ...upisi(['3'], venn({ imena: ['A', 'B'] }).mesta.AB, { vel: 15 })], { ...bez, velicina: 260 }) });
  Q(2, 'Ako je $A=\\{1,2,3\\}$ i $B=\\{3,4\\}$, kolika je razlika $A \\setminus B$?',
    ['$\\{1,2\\}$', '$\\{3\\}$', '$\\{1,2,3,4\\}$', '$\\{4\\}$'],
    'Razlika $A\\setminus B$ sadrži elemente koji su u $A$, a nisu u $B$: to su $1$ i $2$. Uklanjamo sve što pripada skupu $B$.', 'razlika',
    { mediji: { vrsta: 'formula', tekst: '$A\\setminus B$' } });
  Q(2, 'Ako dva skupa nemaju nijedan zajednički element, njihov presek je…',
    ['prazan skup', 'jednak uniji', 'jednak većem skupu', 'ne postoji'],
    'Kad nema zajedničkih elemenata, presek je prazan skup $\\varnothing$. Takvi skupovi se zovu disjunktni – ne seku se.', 'presek',
    { mediji: G({ c1: [-2.5, 0], c2: [2.5, 0] }, [{ kr: 'c1', r: 1.8, b: 1, prazno: 1 }, { kr: 'c2', r: 1.8, b: 2, prazno: 1 }, { tx: 'A', at: [-2.5, 2.1], vel: 16, b: 1 }, { tx: 'B', at: [2.5, 2.1], vel: 16, b: 2 }], { velicina: 260 }) });
  Q(1, 'Koji deo Venovog dijagrama je obojen?',
    ['Presek skupova A i B', 'Unija skupova A i B', 'Razlika A i B', 'Samo skup A'],
    'Obojen je „listić“ gde se krugovi preklapaju – to je presek $A\\cap B$, deo koji pripada i skupu A i skupu B.', 'presek',
    { mediji: G(O, venn({ presek: true }).e, { ...bez, velicina: 260 }) });
  Q(3, 'Na Venovom dijagramu obojen je deo skupa A koji se NE preklapa sa B. Koja je to operacija?',
    ['Razlika $A \\setminus B$', 'Presek $A \\cap B$', 'Unija $A \\cup B$', 'Prazan skup'],
    'Obojen je samo deo kruga A van kruga B – to su elementi koji pripadaju A, ali ne pripadaju B, dakle razlika $A\\setminus B$.', 'razlika',
    { mediji: G(O, venn({ samoA: true }).e, { ...bez, velicina: 260 }) });
  S(2, 'Spoji operaciju sa rezultatom za $A=\\{1,2,3\\}$ i $B=\\{3,4\\}$.',
    [['$A \\cap B$', '$\\{3\\}$'], ['$A \\cup B$', '$\\{1,2,3,4\\}$'], ['$A \\setminus B$', '$\\{1,2\\}$']],
    'Presek uzima zajedničko, unija spaja sve bez ponavljanja, a razlika ostavlja samo ono što je u prvom skupu.', 'presek');

};
