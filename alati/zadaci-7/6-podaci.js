// Tema 6: Obrada podataka (lekcije 6.1–6.3)
module.exports = ({ L, Z, K, G, r, proveri, stubici, kruzni }) => {
  const prosek = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const medijana = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  // linijski dijagram: vrednosti po danima
  const linijski = (natpisi, vrednosti, { od = 0, korak = 2, istakni = [], k = 0 } = {}) => {
    const mx = Math.max(...vrednosti), n = vrednosti.length;
    const sy = 5 / (mx - od), sx = 1.4;
    const e = [{ lin: [[0, 0], [n * sx, 0]], b: 5, debljina: 2, str: 1 }, { lin: [[0, 0], [0, 5.8]], b: 5, debljina: 2, str: 1 }];
    for (let y = od + korak; y <= mx + 1e-9; y += korak) e.push({ lin: [[0, (y - od) * sy], [n * sx - 0.2, (y - od) * sy]], b: 5, debljina: 0.6, isp: 1 }, { tx: String(y), at: [-0.5, (y - od) * sy - 0.12] });
    const pts = vrednosti.map((v, i) => [r((i + 0.5) * sx), r((v - od) * sy)]);
    e.push({ lin: pts, b: 1, debljina: 3 });
    const t = { O: [0, 0] };
    pts.forEach((p, i) => { t['p' + i] = p; e.push({ tacka: 'p' + i, b: istakni.includes(i) ? 3 : 1, id: 'v' + i, k: istakni.includes(i) ? k : 0 }, { tx: natpisi[i], at: [p[0], -0.5] }); });
    return G(t, e, { bezImena: ['O'], velicina: 320 });
  };

  // ════════════════ 6.1 Projektni zadatak; prikupljanje podataka ════════════════
  L('Projektni zadatak; prikupljanje podataka');

  Z(1, 'Kakav je podatak „omiljena boja“ ispitanika?',
    ['opisni (kvalitativni)', 'brojčani (kvantitativni)', 'približna vrednost', 'srednja vrednost'],
    [K('Brojčani podaci se dobijaju merenjem ili brojanjem (visina, broj braće, ocena).'),
     K('Boja se ne meri brojem – opisuje se rečima, pa je to opisni (kvalitativni) podatak. Takve podatke možemo prebrojati, ali ne i sabirati.')]);

  {
    const ocene = [5, 4, 5, 3, 5, 4, 2, 5, 4, 5];
    const broj = (o) => ocene.filter((x) => x === o).length;
    proveri(broj(5) === 5 && broj(4) === 3, 'ocene');
    Z(1, 'Ocene iz kontrolnog su: $5, 4, 5, 3, 5, 4, 2, 5, 4, 5$. Koliko je bilo petica?',
      ['$5$', '$4$', '$6$', '$3$'],
      [K('Pravimo tabelu učestalosti: za svaku ocenu prebrojimo koliko puta se javlja.'),
       K('Petice: $5$, četvorke: $3$, trojke: $1$, dvojke: $1$ – ukupno $10$ ✓', ['s3']),
       K('Na stubičastom dijagramu visina stuba je broj ocena.')],
      stubici([['2', broj(2)], ['3', broj(3)], ['4', broj(4)], ['5', broj(5)]], { istakni: [3], k: { 3: 2 }, vrednosti: true }));
  }

  Z(1, 'Koje pitanje je najbolje za anketu o tome koliko vremena učenici provode uz ekrane?',
    ['„Koliko sati dnevno prosečno provodiš uz telefon, računar ili TV?“', '„Zar ne misliš da previše vremena provodiš uz telefon?“', '„Da li si dobar učenik?“', '„Šta misliš o ekranima?“'],
    [K('Dobro anketno pitanje je jasno, ne navodi na odgovor i daje podatke koji se mogu uporediti.'),
     K('„Zar ne misliš da…“ navodi na odgovor; „Šta misliš…“ daje neuporedive odgovore; „Da li si dobar učenik?“ nema veze sa temom.'),
     K('Prvo pitanje traži broj (sate dnevno), koji se lako sabira, poredi i prikazuje.')]);

  Z(2, 'Želimo da saznamo koji je omiljeni sport učenika cele škole. Koga je najbolje anketirati?',
    ['slučajno izabrane učenike iz svih razreda', 'samo članove košarkaške sekcije', 'samo svoje odeljenje', 'samo učenike osmog razreda'],
    [K('Uzorak treba da „liči“ na celu školu – da budu zastupljeni svi razredi, i dečaci i devojčice.'),
     K('Članovi sekcije bi uglavnom rekli košarka, a jedno odeljenje ili jedan razred ne predstavljaju celu školu.'),
     K('Slučajan izbor iz svih razreda daje reprezentativan uzorak.')]);

  Z(2, 'Od $30$ učenika, $12$ voli košarku. Koliki je to procenat?',
    ['$40 %$', '$12 %$', '$36 %$', '$25 %$'],
    [K('Relativna učestalost: ${12|30} = {2|5} = 0,4$.'),
     K('$0,4 = 40 %$')]);

  {
    const p = [['0', 4], ['1', 11], ['2', 7], ['3', 3]];
    Z(2, 'Na dijagramu je prikazano koliko braće i sestara imaju učenici jednog odeljenja. Koliko je ukupno braće i sestara?',
      ['$34$', '$25$', '$6$', '$11$'],
      [K('Učenika ima $4 + 11 + 7 + 3 = 25$, ali pitanje je o broju braće i sestara!'),
       K('$4$ učenika sa po $0$, $11$ sa po $1$, $7$ sa po $2$, $3$ sa po $3$: $0 + 11 + 14 + 9 = 34$.')],
      stubici(p, { vrednosti: true, korakY: 2 }));
  }

  {
    const p = [['~pon', 6], ['~uto', 9], ['~sre', 4], ['~čet', 8], ['~pet', 11]];
    Z(2, 'Dijagram prikazuje koliko je knjiga pozajmljeno iz biblioteke svakog dana jedne nedelje. Koliko je knjiga pozajmljeno ukupno?',
      ['$38$', '$11$', '$40$', '$36$'],
      [K('Očitamo visine stubova: $6$, $9$, $4$, $8$ i $11$.', ['s0', 's1', 's2', 's3', 's4']),
       K('$6 + 9 + 4 + 8 + 11 = 38$')],
      stubici(p, { korakY: 1 }));
  }

  Z(2, 'U anketi je učestvovalo $40$ učenika, a $15 %$ njih ne voli čokoladu. Koliko učenika voli čokoladu?',
    ['$34$', '$6$', '$15$', '$25$'],
    [K('$15 %$ od $40$: $0,15 · 40 = 6$ učenika ne voli čokoladu.'),
     K('Voli je $40 − 6 = 34$ učenika (to je $85 %$).')]);

  Z(3, 'U kružnom dijagramu jedan odgovor zauzima $25 %$ ispitanika. Koliki je centralni ugao tog isečka?',
    ['$90°$', '$25°$', '$45°$', '$75°$'],
    [K('Ceo krug ($100 %$) odgovara uglu od $360°$.'),
     K('$25 % · 360° = {1|4} · 360° = 90°$ – četvrtina kruga.', ['k0'])],
    kruzni([['25 %', 25], ['', 75]]));

  Z(3, 'Anketari su na izlazu sa bazena pitali ljude koliko često plivaju i zaključili da „$80 %$ građana pliva svake nedelje“. U čemu je greška?',
    ['uzorak nije reprezentativan – na bazenu su uglavnom plivači', 'premalo je ispitanika – mora ih biti tačno $100$', 'procenat je pogrešno izračunat', 'plivanje se ne može ispitivati anketom'],
    [K('Ljudi na bazenu češće plivaju od proseka – uzorak je pristrasan.'),
     K('Zaključak o svim građanima traži uzorak koji predstavlja sve građane (npr. slučajno izabrane ljude na raznim mestima).')]);

  Z(3, 'U odeljenju od $32$ učenika odnos dečaka i devojčica je $3 : 5$. Fudbal voli $75 %$ dečaka i $50 %$ devojčica. Koliko učenika voli fudbal?',
    ['$19$', '$20$', '$16$', '$24$'],
    [K('$32$ podelimo na $3 + 5 = 8$ delova po $4$: dečaka je $12$, devojčica $20$.'),
     K('Dečaci: $75 %$ od $12 = 9$; devojčice: $50 %$ od $20 = 10$.'),
     K('Ukupno $9 + 10 = 19$. (Greška: $62,5 %$ – prosek procenata – od $32$ daje $20$, ali grupe nisu jednake.)')]);

  // ════════════════ 6.2 Statistička obeležja podataka ════════════════
  L('Statistička obeležja podataka');

  {
    const a = [4, 7, 5, 8, 6];
    proveri(prosek(a) === 6, 'prosek');
    Z(1, 'Kolika je srednja vrednost brojeva $4, 7, 5, 8, 6$?',
      ['$6$', '$5$', '$7$', '$30$'],
      [K('Saberemo sve podatke: $4 + 7 + 5 + 8 + 6 = 30$.'),
       K('Podelimo brojem podataka: $30 : 5 = 6$.'),
       K('Srednja vrednost „poravna“ stubove: višak iznad $6$ tačno popunjava manjak ispod.', ['s1', 's3'])],
      (() => { const g = stubici(a.map((v, i) => [String(i + 1), v]), { korakY: 1, vrednosti: true }); g.e.push({ lin: [[0, 6 * 6 / 8], [8, 6 * 6 / 8]], b: 3, debljina: 3, k: 3, o: '6', oAt: [8.4, 4.5] }); return g; })());
  }

  {
    const a = [3, 9, 1, 7, 5];
    proveri(medijana(a) === 5, 'medijana');
    Z(1, 'Kolika je medijana podataka $3, 9, 1, 7, 5$?',
      ['$5$', '$1$', '$5,5$', '$9$'],
      [K('Podatke poređamo po veličini: $1, 3, 5, 7, 9$.'),
       K('Medijana je podatak u sredini: ispred i iza njega po dva podatka – $5$. (Bez ređanja bi „srednji“ bio $1$, što je pogrešno.)')]);
  }

  Z(1, 'Koliki je mod podataka $2, 3, 3, 5, 3, 4, 2$?',
    ['$3$', '$2$', '$22$', '$3,14$'],
    [K('Mod je podatak koji se javlja najčešće.'),
     K('$3$ se javlja tri puta, $2$ dva puta, $4$ i $5$ po jednom – mod je $3$.')]);

  {
    const a = [2, 8, 4, 10];
    proveri(medijana(a) === 6, 'medijana parnog broja');
    Z(2, 'Kolika je medijana podataka $2, 8, 4, 10$?',
      ['$6$', '$4$', '$8$', '$6,5$'],
      [K('Poređamo: $2, 4, 8, 10$. Podataka ima paran broj, pa u sredini stoje dva: $4$ i $8$.'),
       K('Medijana je njihova srednja vrednost: ${4 + 8|2} = 6$.')]);
  }

  Z(2, 'Prosek četiri ocene je $4,5$. Kakav je prosek posle pete ocene, petice?',
    ['$4,6$', '$4,75$', '$5$', '$4,5$'],
    [K('Zbir prve četiri ocene: $4 · 4,5 = 18$.'),
     K('Sa peticom: $18 + 5 = 23$, a ocena je $5$.'),
     K('Novi prosek: $23 : 5 = 4,6$. (Greška $4,75$: ${4,5 + 5|2}$ – nova ocena nije jednako „teška“ kao sve stare zajedno.)')]);

  Z(2, 'Na prva četiri testa Mila je imala $72$, $85$, $78$ i $81$ poen. Koliko poena treba da osvoji na petom testu da bi joj prosek bio $80$?',
    ['$84$', '$80$', '$79$', '$90$'],
    [K('Za prosek $80$ na $5$ testova zbir mora biti $5 · 80 = 400$.'),
     K('Do sada ima $72 + 85 + 78 + 81 = 316$.'),
     K('Na petom testu treba $400 − 316 = 84$ poena.')]);

  {
    const plate = [50, 55, 60, 60, 300];
    proveri(prosek(plate) === 105 && medijana(plate) === 60, 'plate');
    Z(2, 'Mesečne zarade pet zaposlenih u maloj firmi (u hiljadama dinara) su: $50, 55, 60, 60, 300$. Koje obeležje najbolje opisuje tipičnu zaradu?',
      ['medijana ($60$)', 'srednja vrednost ($105$)', 'najveća zarada ($300$)', 'razlika najveće i najmanje ($250$)'],
      [K('Srednja vrednost: $525 : 5 = 105$ – veća od zarade čak četvoro od petoro zaposlenih!', ['s4']),
       K('Medijana: $60$ – srednji podatak, na njega ne utiče jedna izuzetno velika vrednost.'),
       K('Kad među podacima ima „ekstremnih“, medijana bolje opisuje tipičan podatak.')],
      stubici(plate.map((v, i) => [String.fromCharCode(65 + i), v]), { korakY: 50, istakni: [4], vrednosti: true }));
  }

  Z(3, 'Srednja vrednost pet brojeva je $10$. Kad dodamo šesti broj, srednja vrednost postaje $11$. Koji je broj dodat?',
    ['$16$', '$11$', '$12$', '$21$'],
    [K('Zbir pet brojeva: $5 · 10 = 50$.'),
     K('Zbir šest brojeva: $6 · 11 = 66$.'),
     K('Dodat je broj $66 − 50 = 16$.')]);

  {
    const p = [['2', 3], ['3', 7], ['4', 6], ['5', 4]];
    const sve = p.flatMap(([o, n]) => Array(n).fill(+o));
    proveri(prosek(sve) === 3.55 && medijana(sve) === 3.5, 'ocene u odeljenju');
    Z(3, 'Dijagram prikazuje ocene $20$ učenika iz jednog kontrolnog. Kolika je prosečna ocena?',
      ['$3,55$', '$3,5$', '$3,75$', '$3$'],
      [K('Zbir ocena: $3 · 2 + 7 · 3 + 6 · 4 + 4 · 5 = 6 + 21 + 24 + 20 = 71$.'),
       K('Prosek: $71 : 20 = 3,55$.'),
       K('Za poređenje: mod je $3$ (najviši stub), a medijana $3,5$ (deseta ocena po redu je $3$, a jedanaesta $4$).', ['s1'])],
      stubici(p, { korakY: 1, vrednosti: true }));
  }

  Z(3, 'Za brojeve $3$, $5$, $x$ i $8$ (pri čemu je $5 ≤ x ≤ 8$) srednja vrednost jednaka je medijani. Koliko je $x$?',
    ['$6$', '$5$', '$7$', '$8$'],
    [K('Poređani: $3, 5, x, 8$, pa je medijana ${5 + x|2}$.'),
     K('Srednja vrednost: ${3 + 5 + x + 8|4} = {16 + x|4}$.'),
     K('${16 + x|4} = {5 + x|2}$, tj. $16 + x = 10 + 2x$, pa je $x = 6$. Provera: prosek ${22|4} = 5,5$, medijana ${5 + 6|2} = 5,5$ ✓')]);

  // ════════════════ 6.3 Priprema, analiza i prezentacija podataka ════════════════
  L('Priprema, analiza i prezentacija podataka');

  {
    const p = [['~pon', 120], ['~uto', 95], ['~sre', 140], ['~čet', 110], ['~pet', 160]];
    Z(1, 'Dijagram prikazuje broj posetilaca muzeja tokom pet dana. Kog dana je bilo najviše posetilaca?',
      ['u petak', 'u sredu', 'u ponedeljak', 'u utorak'],
      [K('Najviši stub odgovara najvećem broju posetilaca.', ['s4']),
       K('To je petak sa $160$ posetilaca (sreda je druga sa $140$).')],
      stubici(p, { korakY: 20 }));
  }

  Z(1, 'U kružnom dijagramu jedan isečak zauzima tačno polovinu kruga. Koji procenat podataka predstavlja?',
    ['$50 %$', '$180 %$', '$25 %$', '$100 %$'],
    [K('Ceo krug je $100 %$ podataka.'),
     K('Polovina kruga (isečak od $180°$) je $50 %$.', ['k0'])],
    kruzni([['', 50], ['', 30], ['', 20]], { poc: 90 }));

  Z(1, 'U kružnom dijagramu omiljenih predmeta $40$ učenika, isečak „matematika“ ima centralni ugao $90°$. Koliko učenika je izabralo matematiku?',
    ['$10$', '$90$', '$4$', '$25$'],
    [K('$90°$ je četvrtina od $360°$.', ['k0']),
     K('Četvrtina od $40$ učenika je $10$.')],
    kruzni([['~mat.', 25], ['~sport', 35], ['~lik.', 20], ['~ostalo', 20]]));

  Z(2, 'Od $36$ ispitanika, $12$ najviše voli leto. Koliki ugao zauzima isečak „leto“ u kružnom dijagramu?',
    ['$120°$', '$12°$', '$36°$', '$100°$'],
    [K('Udeo: ${12|36} = {1|3}$ ispitanika.'),
     K('Ugao: ${1|3} · 360° = 120°$.', ['k0'])],
    kruzni([['~leto', 12], ['~zima', 9], ['~prol.', 8], ['~jesen', 7]]));

  {
    const temp = [12, 15, 9, 14, 18];
    Z(2, 'Linijski dijagram prikazuje podnevne temperature (u °C) tokom pet dana. Između koja dva uzastopna dana je promena temperature bila najveća?',
      ['utorak – sreda (za $6 °C$)', 'sreda – četvrtak (za $5 °C$)', 'četvrtak – petak (za $4 °C$)', 'ponedeljak – utorak (za $3 °C$)'],
      [K('Očitamo temperature: $12$, $15$, $9$, $14$, $18$. Promene: pon–uto $+3$, uto–sre $−6$, sre–čet $+5$, čet–pet $+4$.'),
       K('Najveća promena je između utorka i srede – pad za $6 °C$ (najstrmiji deo linije).', ['v1', 'v2']),
       K('Pazi: pitanje je o najvećoj promeni (i porast i pad), a ne samo o najvećem porastu.')],
      linijski(['~pon', '~uto', '~sre', '~čet', '~pet'], temp, { od: 6, korak: 2, istakni: [1, 2], k: 2 }));
  }

  {
    // dijagram sa „odsečenom“ osom
    const e = [];
    const vr = [[92, 'A'], [96, 'B']];
    e.push({ lin: [[0, 0], [5, 0]], b: 5, debljina: 2 }, { lin: [[0, 0], [0, 6.5]], b: 5, debljina: 2, str: 1 });
    for (let y = 90; y <= 96; y += 2) e.push({ tx: String(y), at: [-0.6, (y - 90) - 0.1] }, { lin: [[0, y - 90], [5, y - 90]], b: 5, debljina: 0.6, isp: 1 });
    vr.forEach(([v, n], i) => { const x = 0.8 + i * 2.2; e.push({ lin: [[x, 0], [x + 1.4, 0], [x + 1.4, v - 90], [x, v - 90]], zatv: 1, gusto: 1, b: i, id: 's' + i }, { tx: '~' + (i ? 'firma B' : 'firma A'), at: [x + 0.7, -0.6] }); });
    Z(2, 'Na dijagramu stub firme B izgleda tri puta viši od stuba firme A. Koliko puta je zarada firme B zaista veća?',
      ['oko $1,04$ puta (samo $4 %$)', 'tačno $3$ puta', '$2$ puta', '$1,5$ puta'],
      [K('Pogledaj osu: ne počinje od $0$, nego od $90$! Firma A ima $92$, a firma B $96$.'),
       K('${96|92} ≈ 1,04$ – zarada je veća samo za oko $4 %$.'),
       K('Odsečena osa „uvećava“ male razlike – na to treba paziti kod dijagrama u reklamama i vestima.')],
      G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 240 }));
  }

  {
    const p = [['~pon', 3], ['~uto', 5], ['~sre', 2], ['~čet', 6], ['~pet', 4]];
    proveri(prosek(p.map((x) => x[1])) === 4, 'prosek sati');
    Z(2, 'Dijagram prikazuje koliko je sati Luka vežbao klavir svakog dana. Koliko je prosečno vežbao dnevno?',
      ['$4$ sata', '$5$ sati', '$3$ sata', '$20$ sati'],
      [K('Ukupno: $3 + 5 + 2 + 6 + 4 = 20$ sati.'),
       K('Prosek: $20 : 5 = 4$ sata dnevno.')],
      stubici(p, { korakY: 1 }));
  }

  Z(3, 'Kružni dijagram prikazuje odgovore $72$ učenika. Dva isečka imaju uglove $150°$ i $90°$. Koliko je učenika dalo treći odgovor?',
    ['$24$', '$120$', '$30$', '$18$'],
    [K('Treći isečak: $360° − 150° − 90° = 120°$.', ['k2']),
     K('To je ${120°|360°} = {1|3}$ kruga, pa je i ${1|3}$ učenika: $72 : 3 = 24$.')],
    kruzni([['150°', 150], ['90°', 90], ['?', 120]]));

  {
    const p6 = [['2024', 40], ['2025', 50]];
    Z(3, 'Broj članova šahovskog kluba porastao je sa $40$ na $50$. Za koliko procenata je porastao?',
      ['$25 %$', '$10 %$', '$20 %$', '$50 %$'],
      [K('Porast: $50 − 40 = 10$ članova.'),
       K('Procenat se računa u odnosu na početnu vrednost: ${10|40} = 0,25 = 25 %$.'),
       K('(Greška $20 %$ je ${10|50}$ – deljenje novom vrednošću.)')],
      stubici(p6, { korakY: 10, vrednosti: true, sirina: 6 }));
  }

  {
    const p = [['1', 2], ['2', 5], ['3', 8], ['4', 4], ['5', 1]];
    const sve = p.flatMap(([v, n]) => Array(n).fill(+v));
    proveri(medijana(sve) === 3, 'medijana broja ukućana');
    Z(3, 'Dijagram prikazuje koliko dece ima u porodicama $20$ učenika (na primer, $5$ porodica ima po dvoje dece). Kolika je medijana broja dece?',
      ['$3$', '$8$', '$2,5$', '$4$'],
      [K('Podataka ima $20$; medijana je srednja vrednost desetog i jedanaestog podatka po veličini.'),
       K('Prvih $2$ su jedinice, sledećih $5$ dvojke (do $7.$), pa trojke od $8.$ do $15.$ mesta.', ['s2']),
       K('Deseti i jedanaesti podatak su trojke, pa je medijana $3$. (Greška $8$ je visina stuba, a ne podatak.)')],
      stubici(p, { korakY: 2, vrednosti: true }));
  }
};
