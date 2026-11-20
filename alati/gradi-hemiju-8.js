// Gradi kvizovi/razred8-hemija/kviz.json – teorija hemije 8. razreda (udžbenik „Hemija 8“, Snežana Zarić, Fondacija Kavčić).
//
//   node alati/gradi-hemiju-8.js          – izgradi i upiši
//   node alati/gradi-hemiju-8.js --suvo   – samo proveri i ispiši statistiku
//
// Pitanja su u alati/hemija-8/<n>-<tema>.js; skoro svako ima vizuelizaciju: 3D molekul (public/molekuli.js), atom,
// jonska/kovalentna veza i reakcija (public/hemija3d.js), laboratorijska scena (public/laboratorija.js).
// Zapis pitanja i pomoćnici za medije: alati/hemija-osnova.js.
const { gradi } = require('./hemija-osnova');
const { lekcije } = require('./hemija-8/osnova');
gradi({
  lekcije,
  folder: 'hemija-8',
  paket: 'razred8-hemija',
  kviz: {
    naziv: '8. razred · Hemija',
    ikona: '🧪',
    boja: '#20bf6b',
    opis: 'Po udžbeniku Hemija 8: metali, nemetali, soli, organska jedinjenja, ugljovodonici, alkoholi, kiseline, biološki važna jedinjenja i zelena hemija – uz 3D molekule, atome i reakcije',
    redosled: 110,
    uOpstem: false,
    oblast: 'hemija',
    razred: 8,
  },
});
