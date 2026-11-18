// Gradi kvizovi/razred5-matematika/kviz.json – teorija i pojmovi 5. razreda,
// bez zadataka koji traže olovku i papir (ti su u razred5-matematika-zadaci).
//
//   node alati/gradi-matematiku-teoriju-5.js          – izgradi i upiši
//   node alati/gradi-matematiku-teoriju-5.js --suvo   – samo proveri i ispiši statistiku
//
// Pitanja su u alati/matematika-teorija-5/<n>-<tema>.js; lekcije i crteži (medij „geo“)
// se dele sa zadacima 5. razreda (alati/zadaci-5/osnova.js), pa su redni brojevi lekcija isti.
// Zapis pitanja (Q, U, S) i sređivanje formula: alati/teorija-osnova.js.
const { gradi } = require('./teorija-osnova');
const A = require('./zadaci-5/osnova');

gradi({
  lekcije: A.lekcije,
  pomocne: A,
  folder: 'matematika-teorija-5',
  paket: 'razred5-matematika',
  kviz: {
    naziv: '5. razred · Matematika',
    ikona: '📐',
    boja: '#0984e3',
    opis: 'Teorija i pojmovi iz udžbenika Matematika 5: brojevi, deljivost, skupovi, geometrija, razlomci, uglovi, osna simetrija, procenti – sve kroz slike i igru, bez papira',
    redosled: 10,
    oblast: 'matematika',
    razred: 5,
    uOpstem: false,
  },
});
