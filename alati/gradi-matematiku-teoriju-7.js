// Gradi kvizovi/razred7-matematika/kviz.json – teorija i pojmovi 7. razreda, sve „u glavi“,
// bez zadataka koji traže olovku i papir (ti su u razred7-matematika-zadaci).
//
//   node alati/gradi-matematiku-teoriju-7.js          – izgradi i upiši
//   node alati/gradi-matematiku-teoriju-7.js --suvo   – samo proveri i ispiši statistiku
//
// Pitanja su u alati/matematika-teorija-7/<n>-<tema>.js (po udžbeniku Matematika 7, Arhiknjiga /
// Fondacija Kavčić); lekcije se dele sa zadacima 7. razreda (alati/zadaci-7/osnova.js), pa su redni
// brojevi lekcija isti. Pomoćne funkcije za crteže (medij „geo“) su iz alati/zadaci-5/osnova.js
// i alati/zadaci-7/osnova.js; zapis pitanja (Q, U, S) i sređivanje formula: alati/teorija-osnova.js.
const { gradi } = require('./teorija-osnova');
const A5 = require('./zadaci-5/osnova');
const A7 = require('./zadaci-7/osnova');

gradi({
  lekcije: A7.lekcije,
  // G iz zadaci-5 (ravna lista elemenata, e.flat()) + crteži 7. razreda (kocke, prava, stubici…)
  pomocne: { ...A5, ...A7, G: A5.G },
  folder: 'matematika-teorija-7',
  paket: 'razred7-matematika',
  oznake: true, // oznake tačaka i promenljive napisane van $…$ idu u $…$ (da se ne preslove u ćirilicu)
  kviz: {
    naziv: '7. razred · Matematika',
    ikona: '📐',
    boja: '#0984e3',
    opis: 'Teorija i pojmovi iz udžbenika Matematika 7: realni brojevi i koren, Pitagorina teorema, stepeni i polinomi, mnogouglovi, krug, obrada podataka – kroz slike i crteže, bez papira',
    redosled: 10,
    oblast: 'matematika',
    razred: 7,
    uOpstem: false,
  },
});
