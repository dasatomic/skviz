// Celi, racionalni i iracionalni brojevi; stepeni i koreni
module.exports = ({ T, Q, U, S, A, F, G, proveri, r, S3, kocke, pr }) => {
  T('Celi, racionalni i iracionalni brojevi');
  const O = { O: [0, 0] }, bez = { bezImena: ['O'] };

  Q(1, 'Koji broj je označen tačkom $A$?', ['−3', '3', '−2', '−4'],
    'Levo od nule su negativni brojevi. Tačka $A$ je 3 podeoka levo od nule, pa je to −3. Broj 3 je isto toliko udaljen od nule, ali sa druge strane – to su suprotni brojevi.',
    'negativan', { mediji: G({ A: [-3, 0, 90] }, [{ osa: [-5, 5] }, { tacka: 'A', b: 1 }], { velicina: 320 }) });

  Q(1, 'Ujutru je bilo −4 °C, a u podne +3 °C. Za koliko stepeni je otoplilo?', ['7 °C', '1 °C', '−1 °C', '12 °C'],
    'Od −4 do 0 su 4 stepena, a od 0 do 3 još 3 – ukupno 7: 3 − (−4) = 7. Termometar je obična brojevna prava postavljena uspravno.',
    'temperatura', { medijiOdgovora: G({ A: [-4, 0, 90], B: [3, 0, 90] }, [{ osa: [-5, 5] }, { tacka: 'A', b: 0 }, { tacka: 'B', b: 1 }, { lin: [[-4, 0.6], [3, 0.6]], b: 2, str: 1, o: '+7', oAt: [-0.5, 1.4] }], { velicina: 320 }) });

  Q(1, 'Koliko je |−7| + |3|?', ['10', '4', '−4', '−10'],
    'Apsolutna vrednost je udaljenost broja od nule, a udaljenost nikad nije negativna: |−7| = 7 i |3| = 3, pa je zbir 10.',
    'apsolutna');

  Q(2, 'Koji od ovih brojeva je najmanji?', ['−2,1', '−2', '−1,99', '−0,5'],
    'Na brojevnoj pravoj manji je onaj koji je više levo. Kod negativnih brojeva to znači: što je „veći“ broj iza minusa, to je broj manji. Zato je −2,1 < −2, kao što je −21 °C hladnije od −20 °C.',
    'manji');

  Q(2, 'Koliko je $(−1)^{101}$?', ['−1', '1', '−101', '101'],
    'Svaki par (−1) · (−1) daje 1. Kod 101 činioca napravi se 50 parova i ostane jedna −1. Paran izložilac daje 1, a neparan −1.',
    'stepen');

  Q(2, 'Koliko racionalnih brojeva ima između 0 i ${1|1000}$?', ['Beskonačno mnogo', 'Nijedan', 'Tačno 999', 'Tačno jedan'],
    'Između bilo koja dva različita racionalna broja uvek postoji još jedan – njihova sredina. Pa između njih opet jedan… Zato kažemo da su racionalni brojevi „svuda gusti“ na brojevnoj pravoj.',
    'racionalan', { medijiOdgovora: A('racionalni-gusti') });

  Q(2, 'Koji od ovih brojeva je iracionalan?', ['$√{2}$', '$√{9}$', '0,(3)', '${22|7}$'],
    '$√{9} = 3$, 0,(3) = ${1|3}$, a ${22|7}$ je već razlomak – svi su racionalni. $√{2}$ se ne može zapisati kao razlomak: decimale mu idu zauvek bez ponavljanja (1,41421356…).',
    'iracionalan');

  // skupovi brojeva – Venov dijagram
  {
    const e = [pr(-7, -5.6, 16.5, 11.2, { b: 5, prazno: 1 }), { kr: 'O', r: 5, b: 0 }, { kr: 'O', r: 3.4, b: 2 }, { kr: 'O', r: 1.8, b: 3 },
      { tx: 'ℕ', at: [0, 0.2], b: 3 }, { tx: 'ℤ', at: [0, 2.5], b: 2 }, { tx: 'ℚ', at: [0, 4.1], b: 0 }, { tx: 'ℝ', at: [8.3, 4.6], b: 5 }, { tx: 'I', at: [7, 0.3], b: 1 },
      { tx: '7', at: [0, -0.8] }, { tx: '−7', at: [0, -2.6] }, { tx: '−3,5', at: [0, -4.2] }, { tx: '√7', at: [7, -1.4] }];
    S(2, 'Spoji broj sa NAJMANJIM skupom kome pripada', [['7', 'prirodni (ℕ)'], ['−7', 'celi (ℤ)'], ['${−7|2}$', 'racionalni (ℚ)'], ['$√{7}$', 'iracionalni ($I$)']],
      'Skupovi su „jedan u drugom“: svaki prirodan broj je i ceo, svaki ceo je i racionalan. Racionalni i iracionalni zajedno čine realne brojeve (ℝ) – sve tačke brojevne prave.',
      'skup', { medijiOdgovora: G(O, e, { ...bez, velicina: 300 }) });
  }

  Q(2, 'Kvadrat ima stranicu 1. Kolika je njegova dijagonala?', ['$√{2}$', '2', '1,5', '$√{3}$'],
    'Po Pitagorinoj teoremi: $d^{2} = 1^{2} + 1^{2} = 2$, pa je $d = √{2}$ ≈ 1,414. Ovo je prvi poznati iracionalan broj – legenda kaže da su Pitagorejci bili toliko uznemireni ovim otkrićem da su ga čuvali kao tajnu.',
    'dijagonala', {
      mediji: G({ A: [0, 0], B: [1, 0], C: [1, 1], D: [0, 1] }, [{ p: 'ABCD', b: 0 }, { d: 'AB', o: '1' }, { d: 'BC', o: '1' }, { d: 'AC', isp: 1, b: 1, o: '?' }], { velicina: 200 }),
      medijiOdgovora: A('koren-iz-dva', 'Dijagonala se šestarom prenosi na brojevnu pravu'),
    });

  Q(2, 'Između koja dva uzastopna cela broja se nalazi $√{50}$?', ['7 i 8', '6 i 7', '8 i 9', '25 i 26'],
    '$7^{2} = 49$, a $8^{2} = 64$, pa je $√{50}$ malo veći od 7 (oko 7,07). Ovako se korenovi procenjuju napamet – traže se najbliži kvadrati.',
    'koren');

  Q(2, 'Koliko je $√{0,09}$?', ['0,3', '0,03', '0,9', '0,0081'],
    '$0,3 · 0,3 = 0,09$. Česta greška je 0,03, ali $0,03 · 0,03 = 0,0009$. Koren broja između 0 i 1 je VEĆI od samog broja!',
    'koren');

  Q(3, 'Koliko je $√{2} · √{8}$?', ['4', '$√{10}$', '16', '$2√{10}$'],
    '$√{2} · √{8} = √{16} = 4$. Dva iracionalna broja mogu da daju i ceo broj – iracionalni brojevi nisu „zatvoreni“ za množenje, za razliku od racionalnih.',
    'koren');

  Q(3, 'Da li je zbir dva iracionalna broja uvek iracionalan?', ['Ne, može biti i racionalan', 'Da, uvek', 'Da, ako su oba pozitivna', 'Ne, uvek je ceo broj'],
    'Primer: $√{2} + (2 − √{2}) = 2$. Oba sabirka su iracionalna, a zbir je ceo broj. Zato u matematici jedan protivprimer obara tvrdnju „uvek“.',
    'iracionalan');

  Q(1, 'Šta je broj π?', ['Odnos obima i prečnika kruga', 'Odnos površine i obima kruga', 'Odnos obima i poluprečnika', 'Površina kruga prečnika 1'],
    'Koliko god krug bio veliki, obim je uvek oko 3,14 puta duži od prečnika. Broj π je iracionalan – decimale mu se nikad ne ponavljaju, a izračunato ih je više od 100 hiljada milijardi.',
    'prečnik', { medijiOdgovora: A('pi-kotrljanje', 'Točak prečnika 1 za jedan okret pređe put π') });

  proveri(Math.abs(22 / 7 - Math.PI) < Math.abs(3.125 - Math.PI) && Math.abs(22 / 7 - Math.PI) < Math.abs(3.1 - Math.PI), '22/7');
  Q(3, 'Koji od ovih brojeva je najbliži broju π?', ['${22|7}$', '3,1', '3,2', '${25|8}$'],
    '${22|7}$ = 3,1428…, a π = 3,1415…, pa se razlikuju tek u hiljaditim delovima. Još bolji je razlomak ${355|113}$ (kineski matematičar Ću Čongdži, 5. vek) – tačan na 6 decimala!',
    'razlomak');

  Q(2, 'Koji razlomak je zapisan kao 0,666…?', ['${2|3}$', '${6|10}$', '${3|5}$', '${1|6}$'],
    'Pošto je ${1|3}$ = 0,333…, dvostruko više je ${2|3}$ = 0,666… Zapis 0,6 = ${6|10}$ je kraći broj – staje posle jedne decimale.',
    'decimala');

  Q(2, 'Kakav decimalni zapis ima razlomak ${1|7}$?', ['Beskonačan periodičan', 'Konačan', 'Beskonačan neperiodičan', 'Nema decimalni zapis'],
    '${1|7}$ = 0,142857 142857… – grupa od 6 cifara se ponavlja. Svaki razlomak ima ili konačan ili periodičan zapis; beskonačan NEPERIODIČAN zapis imaju samo iracionalni brojevi.',
    'period');

  proveri(7 / 40 === 0.175, '7/40');
  Q(3, 'Koji od ovih razlomaka ima KONAČAN decimalni zapis?', ['${7|40}$', '${1|3}$', '${5|6}$', '${2|7}$'],
    'Skraćen razlomak ima konačan zapis samo ako imenilac nema drugih prostih činilaca osim 2 i 5 (jer je 10 = 2 · 5). $40 = 2^{3} · 5$, pa je ${7|40}$ = 0,175.',
    'imenilac');

  Q(1, 'Koliko malih kockica čini ovu kocku?', ['27', '9', '19', '54'],
    'Kocka 3 × 3 × 3 ima $3^{3} = 27$ kockica – zato se treći stepen zove „kub“ (lat. cubus = kocka), a drugi „kvadrat“.',
    'kocka', { mediji: kocke(3) });

  proveri(12 * 1 === 12 && 8 + 12 + 6 + 1 === 27, 'kocka 3');
  Q(3, 'Kocka 3 × 3 × 3 je spolja obojena, pa isečena na 27 kockica. Koliko kockica ima TAČNO dve obojene strane?', ['12', '8', '6', '24'],
    'Dve obojene strane imaju kockice na sredini ivica – kocka ima 12 ivica. Tri strane imaju 8 kockica u temenima, jednu stranu 6 u centrima strana, a jedna kockica u sredini nije obojena uopšte: 8 + 12 + 6 + 1 = 27.',
    'ivica', { mediji: kocke(3, 3, 3, { boja: 1, istakni: 1 }) });

  Q(2, 'Koliko je $2^{3} · 2^{4}$?', ['$2^{7}$', '$2^{12}$', '$4^{7}$', '$4^{12}$'],
    'Stepeni iste osnove se množe tako što se izložioci SABIRAJU: tri dvojke puta četiri dvojke = sedam dvojki = 128.',
    'stepen');

  Q(3, 'Koji broj je veći: $2^{100}$ ili $10^{30}$?', ['$2^{100}$', '$10^{30}$', 'Jednaki su', 'Ne može se odrediti'],
    'Trik: $2^{10} = 1.024$, što je malo više od $10^{3}$. Zato je $2^{100} = (2^{10})^{10}$ malo više od $(10^{3})^{10} = 10^{30}$. Računarski „kilo“ od 1.024 potiče baš odavde.',
    'stepen');

  Q(2, 'Sunce je od Zemlje udaljeno oko 150.000.000 km. Kako se to piše u naučnom zapisu?', ['$1,5 · 10^{8}$ km', '$1,5 · 10^{7}$ km', '$1,5 · 10^{9}$ km', '$15 · 10^{9}$ km'],
    'Zarez se pomera 8 mesta ulevo: 150.000.000 = 1,5 · 100.000.000. Naučni zapis štedi nule – masa Zemlje je oko $6 · 10^{24}$ kg, što bi u običnom zapisu bilo 24 nule.',
    'zapis');

  Q(2, 'Koliko je $0,1^{2}$?', ['0,01', '0,2', '0,1', '0,001'],
    '$0,1 · 0,1 = 0,01$ (deseti deo desetog dela je stoti deo). Kvadrat broja između 0 i 1 je uvek MANJI od samog broja.',
    'kvadrat');

  // (a + b)²
  {
    const a = 3, b = 2;
    const e = [pr(0, b, a, a, { b: 0 }), pr(a, b, b, a, { b: 2 }), pr(0, 0, a, b, { b: 2 }), pr(a, 0, b, b, { b: 1 }),
      { tx: 'a', at: [a / 2, a + b + 0.45] }, { tx: 'b', at: [a + b / 2, a + b + 0.45] }, { tx: 'a', at: [-0.45, b + a / 2] }, { tx: 'b', at: [-0.45, b / 2] }];
    Q(2, 'Kvadrat stranice $a + b$ je podeljen kao na slici. Koliko je $(a + b)^{2}$?', ['$a^{2} + 2ab + b^{2}$', '$a^{2} + b^{2}$', '$a^{2} + ab + b^{2}$', '$2a + 2b$'],
      'Kvadrat se sastoji od kvadrata $a^{2}$, kvadrata $b^{2}$ i DVA pravougaonika $ab$. Najčešća greška je zaboraviti ta dva pravougaonika: $(2 + 3)^{2} = 25$, a $2^{2} + 3^{2}$ je samo 13.',
      'kvadrat', { mediji: G(O, e, { ...bez, velicina: 220 }), medijiOdgovora: A('kvadrat-zbira') });
  }

  proveri(101 * 99 === 9999, '101·99');
  Q(3, 'Koliko je 101 · 99 (napamet)?', ['9.999', '9.909', '10.001', '9.899'],
    '$101 · 99 = (100 + 1)(100 − 1) = 100^{2} − 1^{2} = 9.999$. Razlika kvadrata pretvara teška množenja u laka: $48 · 52 = 50^{2} − 2^{2} = 2.496$.',
    'razlika', { medijiOdgovora: A('razlika-kvadrata', 'a² − b² = (a + b)(a − b)') });

  proveri(35 * 35 === 1225, '35²');
  Q(3, 'Koliko je $35^{2}$?', ['1.225', '925', '1.125', '1.235'],
    'Trik za brojeve koji se završavaju na 5: cifru desetica pomnoži sledećim brojem (3 · 4 = 12) i dopiši 25 → 1.225. Isto: $65^{2}$ → 6 · 7 = 42 → 4.225.',
    'kvadrat');

  Q(2, 'Koliko je $√{3^{2} + 4^{2}}$?', ['5', '7', '25', '12'],
    '$3^{2} + 4^{2} = 9 + 16 = 25$, a $√{25} = 5$. Koren zbira NIJE zbir korenova (to bi dalo 3 + 4 = 7). Trougao sa stranicama 3, 4 i 5 je pravougli – tako su ga zidari koristili za prave uglove.',
    'koren');

  U(2, 'Koji broj NIJE kvadrat celog broja?', ['200', '144', '196', '225'],
    '$144 = 12^{2}$, $196 = 14^{2}$, $225 = 15^{2}$, a 200 je između $14^{2}$ i $15^{2}$.',
    'Kvadrat celog broja nikad se ne završava cifrom 2, 3, 7 ili 8, a ako se završava nulama – mora ih biti paran broj. Broj 200 ima dve nule, ali 2 nije kvadrat.',
    'kvadrat');

  Q(2, 'Koliko je $(−3)^{2}$, a koliko $−3^{2}$?', ['9 i −9', '9 i 9', '−9 i −9', '−9 i 9'],
    'Kod $(−3)^{2}$ kvadrira se ceo broj u zagradi: (−3) · (−3) = 9. Kod $−3^{2}$ stepen ide samo na 3, a minus ostaje ispred: −(3 · 3) = −9. Zagrade su ovde presudne!',
    'zagrada');

  Q(2, 'Koliko je ${1|2} − {2|3}$?', ['${−1|6}$', '${1|6}$', '${−1|5}$', '${1|5}$'],
    'U šestinama: ${3|6} − {4|6} = {−1|6}$. Rezultat je negativan jer se od manjeg broja oduzima veći – zato je bilo važno uvesti negativne razlomke (racionalne brojeve).',
    'razlika');
};
