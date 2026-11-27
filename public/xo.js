// Bonus igra „Napucani iks oks“ (matematika): devet malih iks-oks tabli složenih u veliku tablu 3×3 (81 polje).
// Pravila (klasična): prvi potez je bilo gde; svaki sledeći se igra u tabli koja po položaju odgovara polju na koje
// je protivnik upravo odigrao (gornje desno polje → gornja desna tabla). Ako je ta tabla već rešena (osvojena ili
// puna), igrač bira bilo koju slobodnu tablu. Tri znaka u nizu na maloj tabli osvajaju tu tablu, a tri osvojene table
// u nizu na velikoj tabli donose pobedu. Kad su sve table rešene bez niza (ili istekne vreme), pobeđuje ko ima više
// tabli. Igra se u parovima (po rang listi), neparan igrač igra protiv malog robota (potezAI).
// Isti kôd koristi server (pravila, robot – lib/soba.js) i telefon (crtanje table).
(function (koren, f) {
  const K = f();
  if (typeof module === 'object' && module.exports) module.exports = K;
  else koren.XO = K;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // polje i = tabla·9 + ćelija (tabla i ćelija 0–8, red po red)
  const PRAZNO = '.'.repeat(81);
  const LINIJE = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const POTEZ = 20000; // ms za jedan potez (posle toga polje bira robot umesto igrača)
  const drugi = (s) => (s === 'X' ? 'O' : 'X');

  // tri ista znaka u nizu (niz od 9: 'X' | 'O' | '.' | '=')
  function linija(n) {
    for (const l of LINIJE) {
      const a = n[l[0]];
      if ((a === 'X' || a === 'O') && a === n[l[1]] && a === n[l[2]]) return { s: a, l };
    }
    return null;
  }
  // stanje malih tabli: 'X' | 'O' (osvojena), '=' (puna, bez pobednika), '.' (u igri)
  function table(polja) {
    const t = [];
    for (let k = 0; k < 9; k++) {
      const n = polja.slice(k * 9, k * 9 + 9);
      const w = linija(n);
      t.push(w ? w.s : n.includes('.') ? '.' : '=');
    }
    return t;
  }
  function stanje(polja) {
    const t = table(polja);
    const broj = { X: t.filter((x) => x === 'X').length, O: t.filter((x) => x === 'O').length };
    const w = linija(t);
    if (w) return { t, broj, kraj: true, pobednik: w.s, linija: w.l };
    if (!t.includes('.')) return { t, broj, kraj: true, pobednik: poBroju(broj), linija: null, poBroju: true };
    return { t, broj, kraj: false, pobednik: null, linija: null };
  }
  const poBroju = (b) => (b.X > b.O ? 'X' : b.O > b.X ? 'O' : '=');
  // tabla u kojoj se igra sledeći potez: po položaju poslednjeg polja; null = bilo koja (prvi potez ili rešena tabla)
  function cilj(polja, poslednje, t = table(polja)) {
    if (!Number.isInteger(poslednje) || poslednje < 0) return null;
    const c = poslednje % 9;
    return t[c] === '.' ? c : null;
  }
  const slobodno = (polja, i, ciljT = null, t = table(polja)) => Number.isInteger(i) && i >= 0 && i < 81 && polja[i] === '.' && t[Math.floor(i / 9)] === '.' && (ciljT === null || ciljT === undefined || Math.floor(i / 9) === ciljT);
  const postavi = (polja, i, s) => polja.slice(0, i) + s + polja.slice(i + 1);

  // mali robot: osvoji tablu (pogotovo pobedničku), blokiraj protivnika, pravi dvojke, bira korisne table – i pazi gde
  // šalje protivnika (ne u tablu gde odmah osvaja, po mogućstvu ne u slobodan izbor); malo nasumičnosti
  // polje kojim s odmah osvaja tablu k (ili -1)
  function dobitnoPolje(polja, k, s) {
    const n = polja.slice(k * 9, k * 9 + 9);
    for (const l of LINIJE) {
      const prazno = l.filter((j) => n[j] === '.');
      if (prazno.length === 1 && l.filter((j) => n[j] === s).length === 2) return k * 9 + prazno[0];
    }
    return -1;
  }
  function potezAI(polja, s, ciljT = null, rnd = Math.random) {
    const o = drugi(s), t = table(polja);
    let naj = -1, najV = -Infinity;
    for (let i = 0; i < 81; i++) {
      if (!slobodno(polja, i, ciljT, t)) continue;
      const k = Math.floor(i / 9), c = i % 9;
      let v = rnd() * 6;
      const p = postavi(polja, i, s);
      const tm = table(p);
      if (tm[k] === s) { v += 100; if (linija(tm)?.s === s) v += 10000; }
      const tn = table(postavi(polja, i, o));
      if (tn[k] === o) v += 80 + (linija(tn)?.s === o ? 5000 : 0);
      const n = polja.slice(k * 9, k * 9 + 9);
      for (const l of LINIJE) {
        if (!l.includes(c)) continue;
        const z = l.map((j) => n[j]);
        if (!z.includes(o)) v += z.includes(s) ? 8 : 2;
      }
      for (const l of LINIJE) if (l.includes(k) && !l.some((j) => t[j] === o || t[j] === '=')) v += 3;
      v += c === 4 ? 3 : c % 2 === 0 ? 1 : 0;
      // gde šaljem protivnika
      if (tm[c] !== '.') v -= 25; // slobodan izbor za protivnika
      else {
        const d = dobitnoPolje(p, c, o);
        if (d >= 0) v -= 60 + (linija(table(postavi(p, d, o)))?.s === o ? 5000 : 0);
      }
      if (v > najV) { najV = v; naj = i; }
    }
    return naj;
  }

  // bodovi jednog igrača posle partije
  const BODOVI = { tabla: 100, pobeda: 500, nereseno: 200 };

  return { PRAZNO, LINIJE, POTEZ, BODOVI, drugi, linija, table, stanje, poBroju, cilj, slobodno, postavi, potezAI };
});
