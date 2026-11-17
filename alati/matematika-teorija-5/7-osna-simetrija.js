// Lekcije 44–47: osna simetrija, osnosimetrične figure, simetrala duži i ugla.
module.exports = ({ L, Q, U, S, G, r, naKrugu, pravilni, O, bez }) => {

  // tačka A i njena slika A′ preko ose (ogledalo)
  const ogledalo = () => G({ A: [-2.2, 0.8], "A'": [2.2, 0.8], m: [0, -2.6], n: [0, 2.6], s: [0, 0.8] },
    [{ d: 'mn', isp: 1, b: 4, o: 'osa' }, { d: "AA'", b: 1, str: 1 }, { tacka: 'A', b: 1 }, { tacka: "A'", b: 1 }, { pu: 'Asn' }], { velicina: 280 });
  // kvadrat sa svoje 4 ose simetrije
  const kvadratOse = () => {
    const t = { A: [-2, -2], B: [2, -2], C: [2, 2], D: [-2, 2], m: [0, -2.5], n: [0, 2.5], e: [-2.5, 0], f: [2.5, 0] };
    return G(t, [{ p: 'ABCD', b: 0 }, { d: 'mn', isp: 1, b: 1 }, { d: 'ef', isp: 1, b: 1 }, { d: 'AC', isp: 1, b: 2 }, { d: 'BD', isp: 1, b: 2 }], { velicina: 260 });
  };
  // krug sa nekoliko osa (ima ih beskonačno mnogo)
  const krugOse = () => {
    const t = { O: [0, 0] };
    const e = [{ kr: 'O', r: 3, b: 1 }, { tx: '…', at: [3.3, 0.4], vel: 22, b: 4 }];
    for (let i = 0; i < 4; i++) {
      const a = (i * 45 * Math.PI) / 180, c = Math.cos(a) * 3.3, s = Math.sin(a) * 3.3;
      e.push({ lin: [[-c, -s], [c, s]], b: 2, isp: 1 });
    }
    return G(t, e, { ...bez, velicina: 260 });
  };
  // jednakostranični trougao sa svoje 3 ose
  const oseTrougla = () => {
    const T = pravilni(3, 3);
    const srd = (P, Q) => [r((P[0] + Q[0]) / 2), r((P[1] + Q[1]) / 2)];
    const t = { O: [0, 0], ...T, m1: srd(T.B, T.C), m2: srd(T.C, T.A), m3: srd(T.A, T.B) };
    return G(t, [{ p: 'ABC', b: 0 }, { d: 'Am1', isp: 1, b: 1 }, { d: 'Bm2', isp: 1, b: 1 }, { d: 'Cm3', isp: 1, b: 1 }], { velicina: 260 });
  };
  // pravougaonik (nije kvadrat) sa svoje 2 ose
  const pravougaonikOse = () => {
    const t = { A: [-3, -1.5], B: [3, -1.5], C: [3, 1.5], D: [-3, 1.5], m: [0, -2], n: [0, 2], e: [-3.5, 0], f: [3.5, 0] };
    return G(t, [{ p: 'ABCD', b: 0 }, { d: 'mn', isp: 1, b: 1 }, { d: 'ef', isp: 1, b: 1 }], { velicina: 280 });
  };
  // raznostrani trougao (bez osa simetrije)
  const raznostrani = () => G({ A: [-2.5, -1], B: [2.8, -1.2], C: [0.4, 2] }, [{ p: 'ABC', b: 0 }], { velicina: 240 });
  // jednakokraki trougao (jedna osa)
  const jednakokraki = () => {
    const t = { A: [-2, -1.5], B: [2, -1.5], C: [0, 2], m: [0, -2], n: [0, 2.5] };
    return G(t, [{ p: 'ABC', b: 0 }, { d: 'mn', isp: 1, b: 1 }], { velicina: 260 });
  };
  // simetrala duži (normalna u središtu)
  const simetralaDuzi = () => G({ A: [-3, 0], B: [3, 0], s: [0, 0], m: [0, -2], n: [0, 2] },
    [{ d: 'AB', b: 0, debljina: 3 }, { d: 'mn', b: 2, debljina: 3 }, { pu: 'Asn' }], { velicina: 280 });
  // simetrala ugla
  const simetralaUgla = (stepen = 60, { pu = false, o = '' } = {}) => {
    const t = { O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, stepen), p: naKrugu([0, 0], 4, stepen / 2) };
    const e = [{ d: 'OA', b: 0, debljina: 3 }, { d: 'OB', b: 0, debljina: 3 }, { u: 'AOB', b: 1 }, { d: 'Op', b: 2, str: 1, debljina: 3 }];
    if (pu) e.push({ pu: 'AOB' });
    if (o) e.push({ u: 'AOp', b: 2, o });
    return G(t, e, { ...bez, velicina: 260 });
  };

  // ── 44. osna simetrija ──
  L('Osna simetrija');
  Q(1, 'Šta je osna simetrija?',
    ['Preslikavanje figure preko prave (ose)', 'Okretanje figure oko tačke', 'Pomeranje figure bez okretanja', 'Uvećavanje figure'],
    'Osna simetrija preslikava svaku tačku preko prave koju zovemo osa. To je isto kao presavijanje papira po toj pravoj.', 'simetrija',
    { mediji: ogledalo() });
  Q(1, 'Kako se zove prava preko koje se figura preslikava?',
    ['Osa simetrije', 'Krak', 'Simetrala', 'Tangenta'],
    'Osa simetrije je prava koja „prepolovi“ preslikavanje – figura se ogleda u njoj kao u ogledalu.', 'osa',
    { medijiOdgovora: ogledalo() });
  Q(2, 'Osna simetrija je isto što i…',
    ['presavijanje papira po osi', 'klizanje figure', 'okretanje za 90°', 'smanjivanje figure'],
    'Kad presaviješ papir po osi, tačke sa jedne strane padnu tačno na tačke sa druge strane. To je osna simetrija.', 'simetrija',
    { mediji: G({ A: [-2.2, 0], B: [-2.8, -1.8], C: [-1, -1.8], M: [0, -2.6], N: [0, 2.6] }, [{ d: 'MN', isp: 1, b: 4 }, { p: 'ABC', b: 1, gusto: 1, odrazi: 'MN' }], { velicina: 300 }) });
  Q(2, 'Tačka $A$ i njena slika $A′$ su osnosimetrične. Šta je osa simetrije za duž $AA′$?',
    ['Simetrala duži $AA′$ (normalna u središtu)', 'Sama duž $AA′$', 'Poluprava $AA′$', 'Kružnica kroz $A$ i $A′$'],
    'Osa simetrije stoji normalno na duž $AA\'$ i prolazi kroz njeno središte – zato se i zove simetrala duži.', 'osa',
    { medijiOdgovora: ogledalo() });
  Q(3, 'Na slici se trougao presavija preko isprekidane prave. Kako se zove ta prava?',
    ['Osa simetrije', 'Stranica trougla', 'Simetrala ugla', 'Dijagonala'],
    'Isprekidana prava je osa simetrije: presavijanjem preko nje trougao se preslika u svoj odraz sa druge strane.', 'osa',
    {
      mediji: G(
        { A: [-2.2, 0], B: [-2.8, -1.8], C: [-1, -1.8], M: [0, -2.6], N: [0, 2.6] },
        [{ d: 'MN', isp: 1, b: 4 }, { p: 'ABC', b: 1, gusto: 1, odrazi: 'MN' }],
        { velicina: 300 },
      ),
    });

  // ── 45. osnosimetrične figure ──
  L('Osnosimetrične figure');
  Q(1, 'Šta je osnosimetrična figura?',
    ['Figura koja se preklapanjem po osi poklapa sama sa sobom', 'Figura koja ima centar', 'Figura bez uglova', 'Figura sa svim stranicama jednakim'],
    'Osnosimetrična figura ima bar jednu osu simetrije: kad je presavijemo po toj osi, leva i desna strana se potpuno poklope.', 'simetrija',
    { mediji: jednakokraki() });
  Q(1, 'Koliko osa simetrije ima kvadrat?',
    ['4', '2', '1', '3'],
    'Kvadrat ima 4 ose: dve kroz sredine naspramnih stranica i dve kroz dijagonale.', 'kvadrat',
    { medijiOdgovora: kvadratOse() });
  Q(1, 'Koliko osa simetrije ima krug?',
    ['Beskonačno mnogo', '2', '4', 'Nijednu'],
    'Krug ima beskonačno mnogo osa simetrije – svaka prava kroz centar deli ga na dve jednake polovine.', 'krug',
    { medijiOdgovora: krugOse() });
  Q(2, 'Koliko osa simetrije ima jednakostranični trougao?',
    ['3', '1', '2', '6'],
    'Jednakostranični trougao ima 3 ose simetrije – svaka ide iz temena u središte naspramne stranice.', 'trougao',
    { medijiOdgovora: oseTrougla() });
  Q(2, 'Koliko osa simetrije ima pravougaonik (koji nije kvadrat)?',
    ['2', '4', '1', 'Nijednu'],
    'Pravougaonik ima 2 ose – kroz sredine naspramnih stranica. Dijagonale mu NISU ose simetrije (osim kod kvadrata).', 'simetrija',
    { medijiOdgovora: pravougaonikOse() });
  Q(3, 'Koja od ovih figura NIJE osnosimetrična?',
    ['Raznostrani trougao', 'Kvadrat', 'Krug', 'Jednakokraki trougao'],
    'Raznostrani trougao (sve stranice različite) nema nijednu osu simetrije. Kvadrat, krug i jednakokraki trougao imaju.', 'simetrija',
    { mediji: raznostrani() });
  Q(2, 'Koliko osa simetrije ima jednakokraki trougao?',
    ['1', '2', '3', 'Nijednu'],
    'Jednakokraki trougao ima tačno jednu osu simetrije – visinu koja pada na osnovicu i deli je na dva jednaka dela.', 'trougao',
    { medijiOdgovora: jednakokraki() });

  // ── 46. simetrala duži ──
  L('Simetrala duži i konstrukcija normale');
  Q(1, 'Šta je simetrala duži?',
    ['Prava normalna na duž u njenom središtu', 'Prava paralelna sa duži', 'Poluprava kroz kraj duži', 'Duž jednaka datoj duži'],
    'Simetrala duži je prava koja duž seče pod pravim uglom i to tačno na polovini. Deli duž na dva jednaka dela.', 'simetrala',
    { medijiOdgovora: simetralaDuzi() });
  Q(2, 'Šta važi za svaku tačku na simetrali duži?',
    ['Jednako je udaljena od oba kraja duži', 'Bliža je jednom kraju', 'Nalazi se na duži', 'Ne može se odrediti'],
    'Simetrala duži je skup svih tačaka koje su podjednako udaljene od krajeva duži. Zato je ona i osa simetrije te duži.', 'simetrala',
    { mediji: G({ A: [-3, 0], B: [3, 0], P: [0, 1.8], m: [0, -1.5], n: [0, 3] }, [{ d: 'AB', b: 0, debljina: 3 }, { d: 'mn', b: 2, debljina: 3 }, { d: 'PA', b: 1, debljina: 2.5, o: 'a' }, { d: 'PB', b: 1, debljina: 2.5, o: 'a' }, { tacka: 'P', b: 1 }], { velicina: 280 }) });
  Q(2, 'Čime konstruišeš simetralu duži?',
    ['Šestarom i lenjirom', 'Samo lenjirom', 'Uglomerom', 'Samo šestarom, bez lenjira'],
    'Iz oba kraja duži šestarom opišemo lukove istog poluprečnika; njihove presečne tačke spoje se lenjirom – to je simetrala.', 'šestar',
    { medijiOdgovora: G({ A: [-2, 0], B: [2, 0], M: [0, 1.5], N: [0, -1.5] }, [{ d: 'AB', b: 0, debljina: 3 }, { l: 'A', r: 2.5, od: 10, do: 85, b: 3 }, { l: 'A', r: 2.5, od: 275, do: 350, b: 3 }, { l: 'B', r: 2.5, od: 95, do: 170, b: 3 }, { l: 'B', r: 2.5, od: 190, do: 265, b: 3 }, { tacka: 'M', b: 1 }, { tacka: 'N', b: 1 }], { bezImena: ['M', 'N'], velicina: 260 }) });
  Q(3, 'Simetrala duži deli duž na…',
    ['dva jednaka dela', 'tri jednaka dela', 'dva dela 1:2', 'četiri jednaka dela'],
    'Simetrala prolazi kroz središte duži, pa je deli na dva podudarna dela.', 'simetrala',
    { medijiOdgovora: G({ A: [-3, 0], B: [3, 0], s: [0, 0] }, [{ d: 'AB', b: 0, debljina: 3 }, { tacka: 's', b: 1 }, { tx: 'S', at: [0, -0.5], vel: 14 }], { velicina: 280 }) });
  Q(2, 'Na slici je prava normalna na duž $AB$ u njenoj sredini. Kako se zove ta prava?',
    ['Simetrala duži $AB$', 'Paralela duži $AB$', 'Simetrala ugla', 'Dijagonala'],
    'Prava koja stoji normalno na duž i prolazi kroz njenu sredinu je simetrala duži. Tačka $S$ je središte duži.', 'simetrala',
    { mediji: G({ A: [-3, 0], B: [3, 0], S: [0, 0], M: [0, -2], N: [0, 2] }, [{ d: 'AB', b: 0 }, { d: 'MN', b: 2 }, { pu: 'ASM' }, { tacka: 'S' }, { tx: 'S', at: [0, -0.5], vel: 14 }], { bezImena: ['S'], velicina: 300 }) });

  // ── 47. simetrala ugla ──
  L('Simetrala ugla');
  Q(1, 'Šta je simetrala ugla?',
    ['Poluprava koja deli ugao na dva jednaka dela', 'Prava normalna na krak', 'Duž između krakova', 'Kružnica oko temena'],
    'Simetrala ugla polazi iz temena i deli ugao na dva podudarna ugla. To je osa simetrije tog ugla.', 'simetrala',
    { mediji: simetralaUgla(60) });
  Q(2, 'Šta važi za svaku tačku na simetrali ugla?',
    ['Jednako je udaljena od oba kraka', 'Bliža je jednom kraku', 'Nalazi se na temenu', 'Ne može se odrediti'],
    'Simetrala ugla je skup tačaka koje su podjednako udaljene od oba kraka ugla. Zato je ona osa simetrije ugla.', 'simetrala',
    { mediji: G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 60), p: naKrugu([0, 0], 4, 30), P: naKrugu([0, 0], 3, 30) }, [{ d: 'OA', b: 0, debljina: 3 }, { d: 'OB', b: 0, debljina: 3 }, { u: 'AOB', b: 1 }, { d: 'Op', b: 2, str: 1, debljina: 3 }, { tacka: 'P', b: 1 }], { ...bez, velicina: 260 }) });
  Q(2, 'Simetrala pravog ugla (90°) deli ga na dva ugla od…',
    ['45°', '30°', '60°', '90°'],
    'Polovina od 90° je 45°. Svaki od dva dela je oštar ugao od 45°.', 'simetrala',
    { mediji: simetralaUgla(90, { pu: true, o: '?' }) });
  Q(3, 'Simetrala ugla od 60° deli ga na dva ugla od…',
    ['30°', '20°', '40°', '60°'],
    'Polovina od 60° je 30°. Simetrala uvek deli ugao na dva JEDNAKA dela.', 'simetrala',
    { mediji: simetralaUgla(60, { o: '?' }) });
  Q(2, 'Kako se na slici zove poluprava koja deli ugao $AOB$ na dva jednaka dela?',
    ['Simetrala ugla', 'Simetrala duži', 'Transverzala', 'Tangenta'],
    'Poluprava $OP$ polazi iz temena $O$ i deli ugao $AOB$ na dva jednaka dela – to je simetrala ugla.', 'simetrala',
    { mediji: G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 50), P: naKrugu([0, 0], 4, 25) }, [{ d: 'OA', b: 0, debljina: 3 }, { d: 'OB', b: 0, debljina: 3 }, { u: 'AOB', b: 1 }, { d: 'OP', b: 2, str: 1 }, { tx: 'O', at: [0, -0.45], vel: 15 }], { bezImena: ['O'], velicina: 260 }) });

};
