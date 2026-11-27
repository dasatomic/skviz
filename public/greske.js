// Bonus igra „Lovac na greške“ (uz srpski jezik): tri rečenice sa po 1–3 pravopisne greške (ne bi, ć/č, velika
// slova, li, futur, jednačenje po zvučnosti…). Igrač dodiruje pogrešne reči – u svakoj rečenici najviše onoliko
// koliko ima grešaka. Pronađena greška +100, dodirnuta tačna reč −50; na otkrivanju ispravka i pravilo iz Pravopisa.
// Rečenice su u podaci/greske.txt (zapis {pogrešno|tačno|pravilo|napomena}); do telefona tokom igre stižu samo reči,
// a ispravke tek na otkrivanju. Reči se prikazuju kroz preslovljavanje (ćirilica) – alati/proveri-greske.js proverava
// da se svaka greška vidi i u ćirilici.
(function (koren, f) {
  const G = f();
  if (typeof module === 'object' && module.exports) module.exports = G;
  else koren.Greske = G;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const PO_RUNDI = 3;
  const NADJENA = 100, POGRESNA = -50;

  // tekst datoteke → { pravila: { id: tekst }, recenice: [{ id, reci, greske: [{ reci: [i], pogresno, tacno, pravilo, napomena }] }], greske }
  function parsiraj(tekst) {
    const pravila = {}, recenice = [], greske = [];
    String(tekst).split('\n').forEach((red, br) => {
      red = red.trim();
      if (!red || red.startsWith('#')) return;
      const pr = /^@([\w-]+):\s*(.+)$/.exec(red);
      if (pr) { pravila[pr[1]] = pr[2]; return; }
      // znak po znak: koji znak pripada kojoj grešci (-1 = običan tekst)
      let prikaz = '';
      const vlasnik = [];
      const g = [];
      const re = /\{([^{}]*)\}/g;
      let poz = 0, m;
      const dodaj = (t, i) => { prikaz += t; for (let j = 0; j < t.length; j++) vlasnik.push(i); };
      while ((m = re.exec(red))) {
        dodaj(red.slice(poz, m.index), -1);
        const [pogresno, tacno, pravilo, napomena] = m[1].split('|');
        if (!pravilo || !tacno || pogresno === tacno) { greske.push(`red ${br + 1}: neispravna oznaka {${m[1]}}`); dodaj(pogresno || '', -1); }
        else { g.push({ pogresno, tacno, pravilo, ...(napomena && { napomena }) }); dodaj(pogresno, g.length - 1); }
        poz = m.index + m[0].length;
      }
      dodaj(red.slice(poz), -1);
      if (/[{}|]/.test(prikaz)) greske.push(`red ${br + 1}: zagrade ili | van oznake`);
      // reči (razdvojene razmakom) i kojoj grešci pripadaju
      const reci = [];
      let rec = '', vl = new Set();
      for (let i = 0; i <= prikaz.length; i++) {
        if (i === prikaz.length || prikaz[i] === ' ') {
          if (rec) { reci.push({ t: rec, g: [...vl].filter((x) => x >= 0) }); rec = ''; vl = new Set(); }
        } else { rec += prikaz[i]; vl.add(vlasnik[i]); }
      }
      for (const [i, x] of g.entries()) x.reci = reci.map((r, j) => (r.g.includes(i) ? j : -1)).filter((j) => j >= 0);
      if (!g.length) greske.push(`red ${br + 1}: rečenica bez greške`);
      else if (g.length > 3) greske.push(`red ${br + 1}: više od 3 greške`);
      if (reci.some((r) => r.g.length > 1)) greske.push(`red ${br + 1}: dve greške u istoj reči`);
      recenice.push({ id: prikaz, reci: reci.map((r) => r.t), greske: g, red: br + 1 });
    });
    for (const r of recenice) for (const x of r.greske) if (!pravila[x.pravilo]) greske.push(`red ${r.red}: nepoznato pravilo „${x.pravilo}“`);
    return { pravila, recenice, greske };
  }

  const promesaj = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // tri rečenice sa različitim pravilima (koliko se može); bilo = id-jevi već odigranih
  function napravi(sve, bilo = []) {
    const vec = new Set(bilo);
    let izbor = sve.filter((r) => !vec.has(r.id));
    if (izbor.length < PO_RUNDI * 2) izbor = sve;
    const uzeto = [], pravila = new Set();
    for (const r of promesaj(izbor)) {
      if (uzeto.length >= PO_RUNDI) break;
      if (r.greske.some((x) => pravila.has(x.pravilo))) continue;
      uzeto.push(r);
      r.greske.forEach((x) => pravila.add(x.pravilo));
    }
    for (const r of promesaj(izbor)) { if (uzeto.length >= PO_RUNDI) break; if (!uzeto.includes(r)) uzeto.push(r); }
    return uzeto.map(({ red, ...r }) => r);
  }

  // za telefon tokom igre: samo reči i broj grešaka
  const bezResenja = (r) => ({ reci: r.reci, broj: r.greske.length });

  // izbor = indeksi reči koje je igrač označio (najviše onoliko koliko ima grešaka – višak se ne računa)
  function proveriIzbor(r, izbor) {
    return Array.isArray(izbor) && izbor.length <= r.greske.length && new Set(izbor).size === izbor.length &&
      izbor.every((i) => Number.isInteger(i) && i >= 0 && i < r.reci.length);
  }
  function bodovi(r, izbor = []) {
    const oznaceno = new Set(izbor);
    const nadjene = r.greske.map((x) => x.reci.some((i) => oznaceno.has(i)));
    const greskom = izbor.filter((i) => !r.greske.some((x) => x.reci.includes(i)));
    const nadjeno = nadjene.filter(Boolean).length;
    const poeni = Math.max(0, nadjeno * NADJENA + greskom.length * POGRESNA);
    return { nadjene, greskom, nadjeno, ukupno: r.greske.length, poeni, savrseno: nadjeno === r.greske.length && !greskom.length };
  }

  return { PO_RUNDI, NADJENA, POGRESNA, parsiraj, napravi, bezResenja, proveriIzbor, bodovi };
});
