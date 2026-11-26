// Zajednički zapis zadataka sa takmičenja iz matematike (Društvo matematičara Srbije, dms.rs).
// Svaki fajl `<školska godina>-<nivo>.js` (npr. `2025-26-opstinsko.js`) izvozi:
//   module.exports = { godina: '2025/26', nivo: 'opstinsko', datum: '7. 2. 2026.', zadaci: ({ Z, G, K }) => { … } }
// Z(razred, broj zadatka, težina, pitanje, odgovori [prvi tačan], rešenje [koraci], mediji, dodatno)
//   – postavka se prepisuje sa takmičenja (latinicom, formule u $…$); ako je zadatak tražio više vrednosti,
//     pitanje se svodi na ono što ima jedan odgovor („Koliki je zbir…“), a ceo izvorni zadatak se rešava u rešenju.
// D(razred, broj, težina, tvrđenje, dokaz [koraci], mediji, dodatno) – dokazni zadatak: bez ponuđenih odgovora,
//   igrač dokazuje na papiru i dugmetom „Pokaži dokaz“ otvara dokaz (vrsta „dokaz“, ne boduje se).
// Rešenje: koraci kao niske ili K(tekst, istaknuti, crtež); crtež uz pitanje je medij `geo` (G).

// kratki nazivi nivoa (lobi: „Nivo takmičenja“ → Opštinsko …)
const KRATKO = { skolsko: 'Školsko', opstinsko: 'Opštinsko', okruzno: 'Okružno (gradsko)', drzavno: 'Državno (republičko)' };
const NIVOI = {
  skolsko: 'Školsko takmičenje',
  opstinsko: 'Opštinsko takmičenje',
  okruzno: 'Okružno (gradsko) takmičenje',
  drzavno: 'Državno (republičko) takmičenje',
};

const G = (t, e, x = {}) => ({ vrsta: 'geo', t, e, ...x });
const K = (t, i, crtez) => ({ t, ...(i && i.length ? { i } : {}), ...(crtez ? { crtez } : {}) });

// ── pomoćni crteži (svi iz zadataka 5–8. razreda) ──
// 5. r.: traka, pica, skok, skokovi, krug, venn, upisi, sat, uglomer, sto, tackice, papir, stabloCinioca …
// 6. r.: brojevna, termometar, trougao, cetvorougao, vektor, koord, kvadratici
// 7. r.: pravilni, stubici, kruzni, kocke, prava;  8. r.: telo, grafik, dvePrave
// prostor (8. r.): prostor, kvadar, kocka, prizma, piramida, valjak, kupa, lopta, mreže tela, terazije, interval
const A6 = require('../zadaci-6/osnova');
const A8 = require('../zadaci-8/osnova');
const P8 = require('../zadaci-8/prostor');
const { r } = A6;
const CRTEZI = {};
for (const izvor of [A6, A8, P8]) for (const [ime, f] of Object.entries(izvor)) {
  if (['lekcije', 'zadaci', 'Z', 'L', 'K', 'G', 'proveri', 'R'].includes(ime)) continue;
  CRTEZI[ime] = f;
}

// tabela: redovi = [['n', 0, 1, 2], ['n²', 0, 1, 4]] – ćelije sa tekstom (može $…$ ne, samo običan tekst);
// istakni = [[red, kolona], …] (boja 1), prviRed/prvaKolona zaglavlje; vraća geo crtež
function tabela(redovi, { sirina = 1, visina = 0.9, istakni = [], k = {}, velicina, zaglavlje = true, e = [] } = {}) {
  const el = [];
  const nr = redovi.length, nk = Math.max(...redovi.map((x) => x.length));
  // sirina: broj (sve kolone iste) ili niz širina po kolonama
  // širina kolone: bar onolika koliko traži najduži tekst u njoj (~0,2 jedinice po znaku, 1 jedinica = 46 px)
  const duz = (c) => String(c ?? '').replace(/^~/, '').length;
  const auto = Array.from({ length: nk }, (_, j) => Math.max(...redovi.map((red) => duz(red[j]))) * 0.2 + 0.5);
  const sir = (j) => Math.max(auto[j], Array.isArray(sirina) ? sirina[j] ?? sirina[sirina.length - 1] : sirina);
  const pocX = (j) => Array.from({ length: j }, (_, q) => sir(q)).reduce((a, b) => a + b, 0);
  const ukupno = pocX(nk);
  redovi.forEach((red, i) => red.forEach((c, j) => {
    const x0 = pocX(j), y0 = (nr - 1 - i) * visina, sirina = sir(j);
    const ist = istakni.some(([a, b]) => a === i && b === j);
    const zag = zaglavlje && (i === 0 || j === 0);
    const kk = k[`${i},${j}`];
    el.push({ lin: [[x0, y0], [x0 + sirina, y0], [x0 + sirina, y0 + visina], [x0, y0 + visina]].map((p) => p.map(r)), zatv: 1, b: ist ? 1 : zag ? 0 : 4, ...(ist || zag ? { gusto: ist ? 1 : undefined } : { prazno: 1 }), ...(kk !== undefined ? { k: kk } : {}) });
    if (c !== '' && c !== null && c !== undefined) el.push({ tx: String(c), at: [r(x0 + sirina / 2), r(y0 + visina / 2 - 0.15)], ...(kk !== undefined ? { k: kk } : {}) });
  }));
  return G({}, [...el, ...e], { velicina: velicina || 46 * Math.max(ukupno, nr * visina) });
}
// pravougaonik na mreži (x, y – donji levi ugao)
const pr = (x, y, w, h, b = 0, x2 = {}) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], zatv: 1, b, ...x2 });
Object.assign(CRTEZI, { tabela, pr });

// pravi pomoćnike za jedno takmičenje; zadaci se skupljaju u `lista`
function zaTakmicenje(tak, lista) {
  const Z = (razred, broj, tezina, pitanje, odgovori, resenje, mediji, dodatno = {}) => {
    const oz = `${tak.godina} ${tak.nivo} ${razred}. razred ${broj}. zadatak`;
    if (![5, 6, 7, 8].includes(razred)) throw new Error(oz + ': razred');
    if (![1, 2, 3].includes(tezina)) throw new Error(oz + ': težina');
    const dokaz = odgovori === null;
    if (!dokaz && (!Array.isArray(odgovori) || odgovori.length !== 4 || new Set(odgovori).size !== 4)) throw new Error(oz + ': 4 različita odgovora');
    if (!Array.isArray(resenje) || resenje.length < 2) throw new Error(oz + ': rešenje mora imati bar 2 koraka');
    lista.push({
      razred, nivo: tak.nivo, godina: tak.godina,
      zadatak: {
        ...(dokaz ? { vrsta: 'dokaz' } : {}),
        tezina, pitanje, ...(dokaz ? {} : { odgovori }),
        ...(mediji ? { mediji } : {}),
        resenje: resenje.map((x) => (typeof x === 'string' ? { t: x } : x)),
        ...dodatno,
        izvor: `${NIVOI[tak.nivo]} ${tak.godina} · ${razred}. razred · ${broj}. zadatak`,
      },
      broj,
    });
  };
  const D = (razred, broj, tezina, tvrdjenje, dokaz, mediji, dodatno) => Z(razred, broj, tezina, tvrdjenje, null, dokaz, mediji, dodatno);
  return { Z, D, G, K, ...CRTEZI };
}

// provera računa u alatu: ako ne važi, gradnja puca (da greška ne bi stigla do dece)
const proveri = (uslov, opis) => { if (!uslov) throw new Error('Provera nije prošla: ' + opis); };

module.exports = { NIVOI, KRATKO, G, K, zaTakmicenje, proveri };
