// Gradi kvizovi/razred6-matematika/kviz.json – teorija i pojmovi 6. razreda, sve „u glavi“,
// bez zadataka koji traže olovku i papir (ti su u razred6-matematika-zadaci).
//
//   node alati/gradi-matematiku-teoriju-6.js          – izgradi i upiši
//   node alati/gradi-matematiku-teoriju-6.js --suvo   – samo proveri i ispiši statistiku
//
// Pitanja su u alati/matematika-teorija-6/<n>-<tema>.js (po udžbeniku Matematika 6, Arhiknjiga /
// Fondacija Kavčić); lekcije i pomoćni crteži (medij „geo“) se dele sa zadacima 6. razreda
// (alati/zadaci-6/osnova.js), pa su redni brojevi lekcija isti. Zapis pitanja (Q, U, S) i
// sređivanje formula: alati/teorija-osnova.js. Pregled crteža: node alati/pregled-geo.js <kviz.json> <lekcija>
const { gradi } = require('./teorija-osnova');
const A = require('./zadaci-6/osnova');

gradi({
  lekcije: A.lekcije,
  pomocne: A,
  folder: 'matematika-teorija-6',
  paket: 'razred6-matematika',
  oznake: true, // oznake tačaka i promenljive napisane van $…$ idu u $…$ (da se ne preslove u ćirilicu)
  kviz: {
    naziv: '6. razred · Matematika',
    ikona: '📐',
    boja: '#0984e3',
    opis: 'Teorija i pojmovi iz udžbenika Matematika 6: celi i racionalni brojevi, trougao i podudarnost, koordinatni sistem i proporcionalnost, četvorougao i vektori, površina – kroz slike i crteže, bez papira',
    redosled: 10,
    oblast: 'matematika',
    razred: 6,
    uOpstem: false,
  },
});
