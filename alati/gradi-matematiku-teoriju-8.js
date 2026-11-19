// Gradi kvizovi/razred8-matematika/kviz.json – teorija i pojmovi 8. razreda, sve „u glavi“,
// bez zadataka koji traže olovku i papir (ti su u razred8-matematika-zadaci).
//
//   node alati/gradi-matematiku-teoriju-8.js          – izgradi i upiši
//   node alati/gradi-matematiku-teoriju-8.js --suvo   – samo proveri i ispiši statistiku
//
// Pitanja su u alati/matematika-teorija-8/<n>-<tema>.js (po udžbeniku Matematika 8, Matematički
// klub Diofant / Fondacija Kavčić, 1. i 2. deo); lekcije se dele sa zadacima 8. razreda
// (alati/zadaci-8/osnova.js), pa su redni brojevi lekcija isti. Pomoćni crteži: svi iz 5–7. razreda
// (alati/zadaci-6/osnova.js), grafici iz zadaci-8/osnova.js i tela u prostoru, mreže, terazije i
// intervali iz alati/zadaci-8/prostor.js. Zapis pitanja (Q, U, S): alati/teorija-osnova.js.
// Pregled crteža: node alati/pregled-geo.js kvizovi/razred8-matematika/kviz.json <lekcija>
const { gradi } = require('./teorija-osnova');
const A6 = require('./zadaci-6/osnova');
const A8 = require('./zadaci-8/osnova');
const P8 = require('./zadaci-8/prostor');

// grafik/dvePrave su pisani za zadatke (trougao nagiba se pojavljuje u 1. koraku rešenja);
// u teoriji nema koraka, pa element sa k > 0 ne bi bio vidljiv – brišemo k
const bezKoraka = (m) => ({ ...m, e: m.e.map(({ k, ...el }) => el) });

gradi({
  lekcije: A8.lekcije,
  pomocne: { ...A6, grafik: (...a) => bezKoraka(A8.grafik(...a)), dvePrave: (...a) => bezKoraka(A8.dvePrave(...a)), telo: A8.telo, A: A8.A, ...P8, G: A6.G },
  folder: 'matematika-teorija-8',
  paket: 'razred8-matematika',
  oznake: true, // oznake tačaka i promenljive napisane van $…$ idu u $…$ (da se ne preslove u ćirilicu)
  kviz: {
    naziv: '8. razred · Matematika',
    ikona: '📐',
    boja: '#0984e3',
    opis: 'Teorija i pojmovi iz udžbenika Matematika 8: sličnost, tačka, prava i ravan, linearne jednačine i nejednačine, prizma i piramida, linearna funkcija, sistemi jednačina, valjak, kupa i lopta – kroz slike i crteže, bez papira',
    redosled: 10,
    oblast: 'matematika',
    razred: 8,
    uOpstem: false,
  },
});
