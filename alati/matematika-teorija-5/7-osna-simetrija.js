// Lekcije 44–47: osna simetrija, osnosimetrične figure, simetrala duži i ugla.
module.exports = ({ L, Q, U, S, G, r, naKrugu, O, bez }) => {

  // ── 44. osna simetrija ──
  L('Osna simetrija');
  Q(1, 'Šta je osna simetrija?',
    ['Preslikavanje figure preko prave (ose)', 'Okretanje figure oko tačke', 'Pomeranje figure bez okretanja', 'Uvećavanje figure'],
    'Osna simetrija preslikava svaku tačku preko prave koju zovemo osa. To je isto kao presavijanje papira po toj pravoj.', 'simetrija');
  Q(1, 'Kako se zove prava preko koje se figura preslikava?',
    ['Osa simetrije', 'Krak', 'Simetrala', 'Tangenta'],
    'Osa simetrije je prava koja „prepolovi“ preslikavanje – figura se ogleda u njoj kao u ogledalu.', 'osa');
  Q(2, 'Osna simetrija je isto što i…',
    ['presavijanje papira po osi', 'klizanje figure', 'okretanje za 90°', 'smanjivanje figure'],
    'Kad presaviješ papir po osi, tačke sa jedne strane padnu tačno na tačke sa druge strane. To je osna simetrija.', 'simetrija');
  Q(2, 'Tačka A i njena slika A′ su osnosimetrične. Šta je osa simetrije za duž AA′?',
    ['Simetrala duži AA′ (normalna u središtu)', 'Sama duž AA′', 'Poluprava AA′', 'Kružnica kroz A i A′'],
    'Osa simetrije stoji normalno na duž $AA\'$ i prolazi kroz njeno središte – zato se i zove simetrala duži.', 'osa');
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
    'Osnosimetrična figura ima bar jednu osu simetrije: kad je presavijemo po toj osi, leva i desna strana se potpuno poklope.', 'simetrija');
  Q(1, 'Koliko osa simetrije ima kvadrat?',
    ['4', '2', '1', '3'],
    'Kvadrat ima 4 ose: dve kroz sredine naspramnih stranica i dve kroz dijagonale.', 'kvadrat');
  Q(1, 'Koliko osa simetrije ima krug?',
    ['Beskonačno mnogo', '2', '4', 'Nijednu'],
    'Krug ima beskonačno mnogo osa simetrije – svaka prava kroz centar deli ga na dve jednake polovine.', 'krug');
  Q(2, 'Koliko osa simetrije ima jednakostranični trougao?',
    ['3', '1', '2', '6'],
    'Jednakostranični trougao ima 3 ose simetrije – svaka ide iz temena u središte naspramne stranice.', 'trougao');
  Q(2, 'Koliko osa simetrije ima pravougaonik (koji nije kvadrat)?',
    ['2', '4', '1', 'Nijednu'],
    'Pravougaonik ima 2 ose – kroz sredine naspramnih stranica. Dijagonale mu NISU ose simetrije (osim kod kvadrata).', 'simetrija');
  Q(3, 'Koja od ovih figura NIJE osnosimetrična?',
    ['Raznostrani trougao', 'Kvadrat', 'Krug', 'Jednakokraki trougao'],
    'Raznostrani trougao (sve stranice različite) nema nijednu osu simetrije. Kvadrat, krug i jednakokraki trougao imaju.', 'simetrija');
  Q(2, 'Koliko osa simetrije ima jednakokraki trougao?',
    ['1', '2', '3', 'Nijednu'],
    'Jednakokraki trougao ima tačno jednu osu simetrije – visinu koja pada na osnovicu i deli je na dva jednaka dela.', 'trougao');

  // ── 46. simetrala duži ──
  L('Simetrala duži i konstrukcija normale');
  Q(1, 'Šta je simetrala duži?',
    ['Prava normalna na duž u njenom središtu', 'Prava paralelna sa duži', 'Poluprava kroz kraj duži', 'Duž jednaka datoj duži'],
    'Simetrala duži je prava koja duž seče pod pravim uglom i to tačno na polovini. Deli duž na dva jednaka dela.', 'simetrala');
  Q(2, 'Šta važi za svaku tačku na simetrali duži?',
    ['Jednako je udaljena od oba kraja duži', 'Bliža je jednom kraju', 'Nalazi se na duži', 'Ne može se odrediti'],
    'Simetrala duži je skup svih tačaka koje su podjednako udaljene od krajeva duži. Zato je ona i osa simetrije te duži.', 'simetrala');
  Q(2, 'Čime konstruišeš simetralu duži?',
    ['Šestarom i lenjirom', 'Samo lenjirom', 'Uglomerom', 'Samo šestarom, bez lenjira'],
    'Iz oba kraja duži šestarom opišemo lukove istog poluprečnika; njihove presečne tačke spoje se lenjirom – to je simetrala.', 'šestar');
  Q(3, 'Simetrala duži deli duž na…',
    ['dva jednaka dela', 'tri jednaka dela', 'dva dela 1:2', 'četiri jednaka dela'],
    'Simetrala prolazi kroz središte duži, pa je deli na dva podudarna dela. Zato se i zove simetrala (symmetria = razmera).', 'simetrala');
  Q(2, 'Na slici je prava normalna na duž AB u njenoj sredini. Kako se zove ta prava?',
    ['Simetrala duži AB', 'Paralela duži AB', 'Simetrala ugla', 'Dijagonala'],
    'Prava koja stoji normalno na duž i prolazi kroz njenu sredinu je simetrala duži. Tačka S je središte duži.', 'simetrala',
    { mediji: G({ A: [-3, 0], B: [3, 0], S: [0, 0], M: [0, -2], N: [0, 2] }, [{ d: 'AB', b: 0 }, { d: 'MN', b: 2 }, { pu: 'ASM' }, { tacka: 'S' }, { tx: 'S', at: [0, -0.5], vel: 14 }], { velicina: 300 }) });

  // ── 47. simetrala ugla ──
  L('Simetrala ugla');
  Q(1, 'Šta je simetrala ugla?',
    ['Poluprava koja deli ugao na dva jednaka dela', 'Prava normalna na krak', 'Duž između krakova', 'Kružnica oko temena'],
    'Simetrala ugla polazi iz temena i deli ugao na dva podudarna ugla. To je osa simetrije tog ugla.', 'simetrala');
  Q(2, 'Šta važi za svaku tačku na simetrali ugla?',
    ['Jednako je udaljena od oba kraka', 'Bliža je jednom kraku', 'Nalazi se na temenu', 'Ne može se odrediti'],
    'Simetrala ugla je skup tačaka koje su podjednako udaljene od oba kraka ugla. Zato je ona osa simetrije ugla.', 'simetrala');
  Q(2, 'Simetrala pravog ugla (90°) deli ga na dva ugla od…',
    ['45°', '30°', '60°', '90°'],
    'Polovina od 90° je 45°. Svaki od dva dela je oštar ugao od 45°.', 'simetrala');
  Q(3, 'Simetrala ugla od 60° deli ga na dva ugla od…',
    ['30°', '20°', '40°', '60°'],
    'Polovina od 60° je 30°. Simetrala uvek deli ugao na dva JEDNAKA dela.', 'simetrala');
  Q(2, 'Kako se na slici zove poluprava koja deli ugao AOB na dva jednaka dela?',
    ['Simetrala ugla', 'Simetrala duži', 'Transverzala', 'Tangenta'],
    'Poluprava OP polazi iz temena O i deli ugao AOB na dva jednaka dela – to je simetrala ugla.', 'simetrala',
    { mediji: G({ O: [0, 0], A: [4, 0], B: naKrugu([0, 0], 4, 50), P: naKrugu([0, 0], 4, 25) }, [{ u: 'AOB', b: 1 }, { d: 'OP', b: 2, str: 1 }, { tx: 'O', at: [0, -0.45], vel: 15 }], { velicina: 260 }) });

};
