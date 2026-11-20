// Gradi kvizovi/razred8-hemija-laboratorija/kviz.json – laboratorijske vežbe iz hemije 8. razreda
// (zbirka „Hemija 8: laboratorijske vežbe sa zadacima“, Vidak Raičević, Arhiknjiga – besplatnabiblioteka.com).
//
//   node alati/gradi-hemiju-laboratoriju-8.js          – izgradi i upiši
//   node alati/gradi-hemiju-laboratoriju-8.js --suvo   – samo proveri i ispiši statistiku
//
// Pitanja su u alati/hemija-lab-8/<n>-<tema>.js; svako ima laboratorijsku scenu (public/laboratorija.js), 3D molekul ili reakciju.
// Zapis pitanja i pomoćnici za medije: alati/hemija-osnova.js.
const { gradi } = require('./hemija-osnova');
const { lekcije } = require('./hemija-lab-8/osnova');
gradi({
  lekcije,
  folder: 'hemija-lab-8',
  paket: 'razred8-hemija-laboratorija',
  minPoLekciji: 14,
  kviz: {
    naziv: '8. razred · Hemija – laboratorija',
    ikona: '🥽',
    boja: '#1abc9c',
    opis: 'Laboratorijske vežbe iz hemije 8: bezbedan rad, pribor i posuđe, ogledi sa metalima, nemetalima, kiselinama, solima, ugljovodonicima, alkoholima, kiselinama i biološki važnim jedinjenjima – uz animirane oglede',
    redosled: 111,
    uOpstem: false,
    oblast: 'hemija-laboratorija',
    razred: 8,
    celina: 'Sve vežbe',
  },
});
