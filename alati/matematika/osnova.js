// Zajednički alati za pitanja kviza „Matematika“ (alati/gradi-matematiku.js).
// Svaki fajl teme izvozi funkciju koja dobija ovaj objekat: module.exports = ({ Q, U, S, G, … }) => { … }
// Crteži su medij „geo“ (public/geo.js) – isti kao u zadacima 7. razreda, pa se pomoćne funkcije dele.
const Z7 = require('../zadaci-7/osnova.js');
const { G, pravilni, stubici, kruzni, kocke, prava, naKrugu, r, S3, rad } = Z7;

const pitanja = [];
let tema = '';
const T = (ime) => { tema = ime; };

// provera računa: ako ne važi, gradnja puca (da greška ne bi stigla do dece)
const proveri = (uslov, opis) => { if (!uslov) throw new Error('Netačan račun: ' + opis); };

function dodaj(p) {
  p.tema = tema; // samo za statistiku alata, ne upisuje se u kviz
  pitanja.push(p);
}
const dodatno = (x) => ({
  ...(x.mediji ? { mediji: x.mediji } : {}),
});
const posle = (x) => ({
  ...(x.objasnjenje ? { objasnjenje: x.objasnjenje } : {}),
});

// Q(težina, pitanje, odgovori [prvi tačan], zanimljivost, pojam, { mediji, medijiOdgovora, vreme })
function Q(tezina, pitanje, odgovori, zanimljivost, rec, x = {}) {
  if (new Set(odgovori).size !== 4) throw new Error('Odgovori moraju biti 4 različita: ' + pitanje);
  dodaj({
    tezina, pitanje, ...dodatno(x), odgovori, zanimljivost,
    ...(x.medijiOdgovora ? { medijiOdgovora: x.medijiOdgovora } : {}),
    ...(x.vreme ? { vreme: x.vreme } : {}),
    rec,
  });
}
// U(težina, pitanje, odgovori [prvi je uljez], objašnjenje, zanimljivost, pojam, { … })
function U(tezina, pitanje, odgovori, objasnjenje, zanimljivost, rec, x = {}) {
  if (new Set(odgovori).size !== 4) throw new Error('Odgovori moraju biti 4 različita: ' + pitanje);
  dodaj({
    vrsta: 'uljez', tezina, pitanje, ...dodatno(x), odgovori, objasnjenje, zanimljivost,
    ...(x.medijiOdgovora ? { medijiOdgovora: x.medijiOdgovora } : {}),
    rec,
  });
}
// S(težina, pitanje, parovi [[levo, desno], …], zanimljivost, pojam, { … })
function S(tezina, pitanje, parovi, zanimljivost, rec, x = {}) {
  dodaj({
    vrsta: 'spoji', tezina, pitanje, ...dodatno(x), parovi, zanimljivost,
    ...(x.medijiOdgovora ? { medijiOdgovora: x.medijiOdgovora } : {}),
    rec,
  });
}

// animacija iz alati/manim/scene.py (kvizovi/matematika/animacije/<ime>.webp)
const A = (ime, opis) => ({ vrsta: 'slika', src: `animacije/${ime}.webp`, ...(opis ? { opis } : {}) });
const F = (tekst) => ({ vrsta: 'formula', tekst });

// ── delovi crteža ──
// pravougaonik od (x, y) širine w i visine h
const pr = (x, y, w, h, o = {}) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], zatv: 1, ...o });
// mreža kvadratića: kolone × redovi, obojena polja su skup indeksa [kolona, red] ili funkcija (k, r) => boja|undefined
function polja(kolone, redovi, boja, { x0 = 0, y0 = 0, a = 1, prazno = 5 } = {}) {
  const e = [];
  for (let j = 0; j < redovi; j++) for (let i = 0; i < kolone; i++) {
    const b = boja(i, j);
    e.push(pr(x0 + i * a, y0 + j * a, a, a, b === undefined ? { b: prazno, prazno: 1 } : { b, gusto: 1 }));
  }
  return e;
}
// krug podeljen na n jednakih delova; obojeni = broj delova ili niz boja po delu
function torta(n, obojeni, { c = 'O', R = 4, poc = 90, b = 1 } = {}) {
  const e = [];
  for (let i = 0; i < n; i++) {
    const od = r(poc - ((i + 1) * 360) / n), doo = r(poc - (i * 360) / n);
    const boja = Array.isArray(obojeni) ? obojeni[i] : i < obojeni ? b : undefined;
    e.push({ is: c, r: R, od, do: doo, ...(boja === undefined || boja === null ? { prazno: 1, b: 5 } : { b: boja, gusto: 1 }) });
  }
  return e;
}
// tačke za vagu: tas levo i desno, na tasovima predmeti (kutija „x“ ili teg „1“)
function vaga(levo, desno) {
  const e = [];
  e.push({ lin: [[-0.8, -2.2], [0, 0], [0.8, -2.2]], zatv: 1, b: 5, gusto: 1 });
  e.push({ lin: [[-7.5, 0], [7.5, 0]], b: 5, debljina: 4 });
  const tas = (x, stvari) => {
    e.push({ lin: [[x - 3.3, 0.15], [x + 3.3, 0.15]], b: 3, debljina: 5 });
    let px = x - ((stvari.length - 1) * 1.55) / 2;
    for (const s of stvari) {
      if (s === 'x') { e.push(pr(px - 0.68, 0.3, 1.36, 1.36, { b: 0, gusto: 1 })); e.push({ tx: 'x', at: [px, 0.95] }); }
      else { e.push({ lin: naKrugu8([px, 0.95], 0.65), zatv: 1, b: 1, gusto: 1 }); e.push({ tx: String(s), at: [px, 0.95] }); }
      px += 1.55;
    }
  };
  tas(-4.2, levo);
  tas(4.2, desno);
  return G({ O: [0, 0] }, e, { bezImena: ['O'], velicina: 300 });
}
// mnogougao koji liči na krug (za tegove i kuglice)
const naKrugu8 = (c, R, n = 16) => Array.from({ length: n }, (_, i) => naKrugu(c, R, (360 * i) / n));
// kuglica u boji b na mestu (x, y)
const kuglica = (x, y, b, R = 0.42) => ({ lin: naKrugu8([x, y], R), zatv: 1, b, gusto: 1 });

module.exports = {
  pitanja, T, Q, U, S, A, F, G, proveri, r, S3, rad, naKrugu, naKrugu8, pravilni, stubici, kruzni, kocke, prava,
  pr, polja, torta, vaga, kuglica,
};
