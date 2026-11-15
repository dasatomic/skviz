// Bonus igra „Elementi – cena i opasnost“: jedan krug, dva zadatka o elementima periodnog sistema.
//   1. Vrednost – među 10 elemenata izaberi 3 najskuplja po gramu (cene su okvirne, red veličine).
//   2. Radioaktivnost – među 8 elemenata izaberi 3 najradioaktivnija (najkraće poluvreme raspada).
// Bodovi su srazmerni uspehu: koliko je igrač „sakupio“ vrednosti/aktivnosti u odnosu na najbolji mogući izbor.
// Isti kôd koristi server (bodovanje, lib/soba.js) i telefon (prikaz) – cene, aktivnosti i optimalan izbor su
// zajednički, pa se obe strane uvek slažu.
(function (koren, f) {
  const H = f();
  if (typeof module === 'object' && module.exports) module.exports = H;
  else koren.Hemija = H;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ───────── podaci ─────────
  // Cene su okvirne tržišne cene čistog elementa u evrima po gramu (red veličine, ne precizan kurs).
  const VREDNOSTI = [
    { z: 79, simbol: 'Au', ime: 'zlato', cena: 80 },
    { z: 78, simbol: 'Pt', ime: 'platina', cena: 32 },
    { z: 46, simbol: 'Pd', ime: 'paladijum', cena: 55 },
    { z: 45, simbol: 'Rh', ime: 'rodijum', cena: 150 },
    { z: 77, simbol: 'Ir', ime: 'iridijum', cena: 160 },
    { z: 76, simbol: 'Os', ime: 'osmijum', cena: 400 },
    { z: 44, simbol: 'Ru', ime: 'rutenijum', cena: 15 },
    { z: 47, simbol: 'Ag', ime: 'srebro', cena: 0.8 },
    { z: 75, simbol: 'Re', ime: 'renijum', cena: 3 },
    { z: 29, simbol: 'Cu', ime: 'bakar', cena: 0.009 },
    { z: 26, simbol: 'Fe', ime: 'gvožđe', cena: 0.0001 },
    { z: 13, simbol: 'Al', ime: 'aluminijum', cena: 0.002 },
    { z: 30, simbol: 'Zn', ime: 'cink', cena: 0.003 },
    { z: 28, simbol: 'Ni', ime: 'nikl', cena: 0.02 },
    { z: 50, simbol: 'Sn', ime: 'kalaj', cena: 0.03 },
    { z: 82, simbol: 'Pb', ime: 'olovo', cena: 0.002 },
    { z: 22, simbol: 'Ti', ime: 'titanijum', cena: 0.006 },
    { z: 12, simbol: 'Mg', ime: 'magnezijum', cena: 0.003 },
    { z: 27, simbol: 'Co', ime: 'kobalt', cena: 0.03 },
    { z: 3, simbol: 'Li', ime: 'litijum', cena: 0.1 },
    { z: 24, simbol: 'Cr', ime: 'hrom', cena: 0.01 },
    { z: 25, simbol: 'Mn', ime: 'mangan', cena: 0.002 },
    { z: 74, simbol: 'W', ime: 'volfram', cena: 0.03 },
    { z: 42, simbol: 'Mo', ime: 'molibden', cena: 0.04 },
    { z: 80, simbol: 'Hg', ime: 'živa', cena: 0.05 },
    { z: 83, simbol: 'Bi', ime: 'bizmut', cena: 0.01 },
    { z: 32, simbol: 'Ge', ime: 'germanijum', cena: 1.2 },
    { z: 31, simbol: 'Ga', ime: 'galijum', cena: 0.3 },
    { z: 49, simbol: 'In', ime: 'indijum', cena: 0.6 },
    { z: 73, simbol: 'Ta', ime: 'tantal', cena: 0.3 },
    { z: 4, simbol: 'Be', ime: 'berilijum', cena: 1 },
    { z: 21, simbol: 'Sc', ime: 'skandijum', cena: 6 },
    { z: 23, simbol: 'V', ime: 'vanadijum', cena: 0.4 },
    { z: 41, simbol: 'Nb', ime: 'niobijum', cena: 0.06 },
    { z: 40, simbol: 'Zr', ime: 'cirkonijum', cena: 0.04 },
    { z: 72, simbol: 'Hf', ime: 'hafnijum', cena: 1 },
  ];

  // radio = logaritam specifične aktivnosti (raspada u sekundi po gramu) – veći broj = radioaktivniji.
  // poluvreme = vreme za koje se raspadne polovina jezgara (najkraće = najradioaktivnije).
  const RADIOAKTIVNI = [
    { z: 87, simbol: 'Fr', ime: 'francijum', radio: 18.2, poluvreme: '22 minuta' },
    { z: 85, simbol: 'At', ime: 'astat', radio: 16.9, poluvreme: '8,1 sati' },
    { z: 86, simbol: 'Rn', ime: 'radon', radio: 15.8, poluvreme: '3,8 dana' },
    { z: 84, simbol: 'Po', ime: 'polonijum', radio: 14.2, poluvreme: '138 dana' },
    { z: 89, simbol: 'Ac', ime: 'aktinijum', radio: 11.4, poluvreme: '22 godine' },
    { z: 95, simbol: 'Am', ime: 'americijum', radio: 11.1, poluvreme: '432 godine' },
    { z: 88, simbol: 'Ra', ime: 'radijum', radio: 10.6, poluvreme: '1600 godina' },
    { z: 94, simbol: 'Pu', ime: 'plutonijum', radio: 9.4, poluvreme: '24.100 godina' },
    { z: 43, simbol: 'Tc', ime: 'tehnecijum', radio: 8.8, poluvreme: '211.000 godina' },
    { z: 93, simbol: 'Np', ime: 'neptunijum', radio: 7.4, poluvreme: '2,14 miliona godina' },
    { z: 92, simbol: 'U', ime: 'uranijum', radio: 4.4, poluvreme: '4,5 milijardi godina' },
    { z: 90, simbol: 'Th', ime: 'torijum', radio: 3.6, poluvreme: '14 milijardi godina' },
  ];

  const SVE = [...VREDNOSTI, ...RADIOAKTIVNI];
  const poSimbolu = new Map(SVE.map((e) => [e.simbol, e]));

  // ───────── formatiranje ─────────
  const broj = (x, d = 2) => String(+x.toFixed(d)).replace('.', ',');
  function cena(x) {
    if (x >= 100) return String(Math.round(x));
    if (x >= 1) {
      const s = String(+x.toFixed(1));
      return s.endsWith('.0') ? s.slice(0, -2) : s.replace('.', ',');
    }
    return String(+x.toFixed(4)).replace('.', ',').replace(/,?0+$/, '').replace(/,$/, '');
  }

  // ───────── scenario ─────────
  function uzorak(lista, n, rnd) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  }

  function napraviVrednost(rnd = Math.random) {
    const elementi = uzorak(VREDNOSTI, 10, rnd).map((e) => ({ ...e }));
    const poredjani = [...elementi].sort((a, b) => b.cena - a.cena);
    const optimalno = poredjani.slice(0, 3).map((e) => e.simbol);
    const maksimum = poredjani.slice(0, 3).reduce((a, e) => a + e.cena, 0);
    return { vrsta: 'vrednost', brojBira: 3, elementi, optimalno, maksimum };
  }

  function napraviRadioaktivnost(rnd = Math.random) {
    const elementi = uzorak(RADIOAKTIVNI, 8, rnd).map((e) => ({ ...e }));
    const poredjani = [...elementi].sort((a, b) => b.radio - a.radio);
    const optimalno = poredjani.slice(0, 3).map((e) => e.simbol);
    const maksimum = poredjani.slice(0, 3).reduce((a, e) => a + e.radio, 0);
    return { vrsta: 'radio', brojBira: 3, elementi, optimalno, maksimum };
  }

  // udeo uspeha 0–1: koliko je izbor sakupio vrednosti/aktivnosti u odnosu na najbolji mogući
  function udeo(sc, izbor) {
    const kljuc = sc.vrsta === 'vrednost' ? 'cena' : 'radio';
    const suma = (izbor || []).reduce((a, s) => a + (poSimbolu.get(s)?.[kljuc] || 0), 0);
    return Math.max(0, Math.min(1, suma / sc.maksimum));
  }

  // provera izbora (server pre bodovanja): tačno brojBira različitih elemenata iz scenarija
  function proveriIzbor(sc, izbor) {
    if (!Array.isArray(izbor) || izbor.length !== sc.brojBira) return false;
    if (new Set(izbor).size !== izbor.length) return false;
    const dozvoljeni = new Set(sc.elementi.map((e) => e.simbol));
    return izbor.every((s) => dozvoljeni.has(s));
  }

  // ───────── tekstovi (latinica – klijent preslovljava DOM) ─────────
  function objasniVrednost(sc) {
    const top = sc.elementi.filter((e) => sc.optimalno.includes(e.simbol)).sort((a, b) => b.cena - a.cena);
    const rec = top.map((e) => `${e.ime} – ${cena(e.cena)} €/g`).join(' · ');
    return [
      `Najskuplji po gramu su: ${rec}.`,
      'Zlato je najpoznatije, ali su rodijum, iridijum i osmijum još skuplji (i ređi) – zato se koriste u katalizatorima, svećicama i preciznim instrumentima.',
    ];
  }

  function objasniRadio(sc) {
    const top = sc.elementi.filter((e) => sc.optimalno.includes(e.simbol)).sort((a, b) => b.radio - a.radio);
    const rec = top.map((e) => `${e.ime} (poluvreme ${e.poluvreme})`).join(' · ');
    return [
      `Najradioaktivniji su: ${rec}.`,
      'Radioaktivniji element = kraće poluvreme raspada (brže se raspada). Uranijum i plutonijum su opasni, ali se po gramu raspadaju mnogo sporije od francijuma, astata i radona.',
    ];
  }

  function opisAktivnosti(e) {
    const r = e.radio;
    if (r >= 16) return 'ekstremno radioaktivan';
    if (r >= 12) return 'izuzetno radioaktivan';
    if (r >= 8) return 'veoma radioaktivan';
    if (r >= 4) return 'umereno radioaktivan';
    return 'slabo radioaktivan';
  }

  return {
    VREDNOSTI, RADIOAKTIVNI, poSimbolu,
    napraviVrednost, napraviRadioaktivnost,
    udeo, proveriIzbor, objasniVrednost, objasniRadio, opisAktivnosti,
    broj, cena,
  };
});
