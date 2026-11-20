// Lekcije hemije 8. razreda – udžbenik „Hemija 8“ (Snežana Zarić, Fondacija „Alek Kavčić“), po poglavljima
const T1 = 'Metali, oksidi i hidroksidi';
const T2 = 'Nemetali, oksidi nemetala i kiseline';
const T3 = 'Soli';
const T4 = 'Organska jedinjenja i njihova opšta svojstva';
const T5 = 'Ugljovodonici';
const T6 = 'Organska jedinjenja sa kiseonikom';
const T7 = 'Biološki važna organska jedinjenja';
const T8 = 'Zaštita životne sredine i zelena hemija';
const lekcije = [
  { naziv: 'Metali', tema: T1, strana: 9 },
  { naziv: 'Alkalni i zemnoalkalni metali', tema: T1, strana: 12 },
  { naziv: 'Gvožđe, bakar i aluminijum', tema: T1, strana: 17 },
  { naziv: 'Olovo i cink', tema: T1, strana: 21 },
  { naziv: 'Legure', tema: T1, strana: 23 },
  { naziv: 'Nemetali', tema: T2, strana: 28 },
  { naziv: 'Hemijska svojstva nemetala', tema: T2, strana: 34 },
  { naziv: 'Halogeni elementi', tema: T2, strana: 37 },
  { naziv: 'Sumpor', tema: T2, strana: 39 },
  { naziv: 'Azot', tema: T2, strana: 42 },
  { naziv: 'Fosfor', tema: T2, strana: 45 },
  { naziv: 'Ugljenik', tema: T2, strana: 47 },
  { naziv: 'Pisanje formula i naziva soli', tema: T3, strana: 54 },
  { naziv: 'Dobijanje soli', tema: T3, strana: 59 },
  { naziv: 'Svojstva i primena soli', tema: T3, strana: 62 },
  { naziv: 'Uvod u organsku hemiju', tema: T4, strana: 69 },
  { naziv: 'Klase organskih jedinjenja', tema: T4, strana: 71 },
  { naziv: 'Podela ugljovodonika i izomerija', tema: T5, strana: 76 },
  { naziv: 'Alkani', tema: T5, strana: 78 },
  { naziv: 'Alkeni i alkini', tema: T5, strana: 85 },
  { naziv: 'Hemijska svojstva ugljovodonika', tema: T5, strana: 89 },
  { naziv: 'Aromatični ugljovodonici', tema: T5, strana: 92 },
  { naziv: 'Nafta i zemni gas. Polimeri', tema: T5, strana: 95 },
  { naziv: 'Alkoholi', tema: T6, strana: 103 },
  { naziv: 'Dobijanje, svojstva i primena alkohola', tema: T6, strana: 106 },
  { naziv: 'Karboksilne kiseline', tema: T6, strana: 111 },
  { naziv: 'Svojstva i primena karboksilnih kiselina', tema: T6, strana: 114 },
  { naziv: 'Estri', tema: T6, strana: 118 },
  { naziv: 'Uloga biološki važnih jedinjenja', tema: T7, strana: 125 },
  { naziv: 'Masti i ulja', tema: T7, strana: 126 },
  { naziv: 'Ugljeni hidrati – monosaharidi', tema: T7, strana: 132 },
  { naziv: 'Ugljeni hidrati – disaharidi i polisaharidi', tema: T7, strana: 135 },
  { naziv: 'Aminokiseline i proteini', tema: T7, strana: 138 },
  { naziv: 'Vitamini', tema: T7, strana: 142 },
  { naziv: 'Zagađivači i zagađujuće supstance', tema: T8, strana: 149 },
  { naziv: 'Reciklaža i zelena hemija', tema: T8, strana: 153 },
];
module.exports = { lekcije };
