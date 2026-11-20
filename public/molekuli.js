// Hemija u 3D (medij „hemija“) + velika biblioteka molekula za medij „molekul“.
//
//   { "vrsta": "molekul", "ime": "propan" }                                   – 3D molekul koji se okreće prstom
//   { "vrsta": "hemija", "scena": "atom", "z": 11 }                           – Borov model u 3D (elektroni kruže)
//   { "vrsta": "hemija", "scena": "jonska", "metal": 11, "nemetal": 17 }      – prelaz elektrona i nastanak jonske veze
//   { "vrsta": "hemija", "scena": "kovalentna", "ime": "voda" }               – zajednički elektronski parovi (Luisove tačke)
//   { "vrsta": "hemija", "scena": "reakcija", "reaktanti": [["vodonik", 2], ["kiseonik", 1]], "proizvodi": [["voda", 2]] }
//   { "vrsta": "hemija", "scena": "metalna" }                                 – metalna veza: katjoni i „more“ elektrona
//   { "vrsta": "hemija", "scena": "rastvaranje", "tip": "so" }                – rastvaranje u vodi (so, secer, ulje, gas)
//   { "vrsta": "hemija", "scena": "ph", "vrednost": 3 }                       – pH skala sa indikatorima
//
// Molekuli se zadaju SMILES zapisom (npr. „CC(C)C“); geometrija se računa sama (veze, uglovi, vodonici). Zajednički
// pomoćnici za 3D (rotacija prstom, senčenje) dolaze iz public/mediji.js. Isti fajl radi i u Node-u
// (alati/proveri-kvizove.js čita Molekuli.SCENE i Molekuli.IMENA).
(function () {
  'use strict';

  // ───────────────────────── vektori ─────────────────────────
  const dod = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const odu = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mno = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const vek = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const duz = (a) => Math.hypot(a[0], a[1], a[2]);
  const jed = (a) => { const d = duz(a) || 1; return [a[0] / d, a[1] / d, a[2] / d]; };
  const lerp = (a, b, u) => a + (b - a) * u;
  const glatko = (u) => { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); };
  const ogr = (v, a, b) => Math.max(a, Math.min(b, v));

  // ───────────────────────── elementi ─────────────────────────
  const POLUPRECNIK = { H: 0.31, C: 0.76, N: 0.71, O: 0.66, S: 1.05, P: 1.07, F: 0.57, Cl: 1.02, Br: 1.2, I: 1.39, Si: 1.11 };
  const VALENCA = { H: 1, C: 4, N: 3, O: 2, S: 2, P: 3, F: 1, Cl: 1, Br: 1, I: 1, Si: 4 };
  // boje (dopuna za ATOMI iz public/mediji.js)
  const BOJE_ELEMENATA = {
    K: { boja: '#9b59b6', r: 0.7, ime: 'kalijum' }, Mg: { boja: '#26de81', r: 0.62, ime: 'magnezijum' }, Al: { boja: '#b2bec3', r: 0.6, ime: 'aluminijum' },
    Cu: { boja: '#d35400', r: 0.6, ime: 'bakar' }, Zn: { boja: '#7f8fa6', r: 0.58, ime: 'cink' }, Ag: { boja: '#dfe6e9', r: 0.62, ime: 'srebro' },
    Au: { boja: '#f1c40f', r: 0.62, ime: 'zlato' }, Br: { boja: '#a5381b', r: 0.64, ime: 'brom' }, I: { boja: '#6c3483', r: 0.7, ime: 'jod' },
    Li: { boja: '#cc8e35', r: 0.55, ime: 'litijum' }, Si: { boja: '#c8a27a', r: 0.6, ime: 'silicijum' }, Pb: { boja: '#576574', r: 0.66, ime: 'olovo' },
    Sn: { boja: '#95a5a6', r: 0.62, ime: 'kalaj' }, Hg: { boja: '#b8c6d6', r: 0.6, ime: 'živa' }, Ba: { boja: '#00b894', r: 0.7, ime: 'barijum' },
    He: { boja: '#d6eaff', r: 0.36, ime: 'helijum' }, Ne: { boja: '#ff7979', r: 0.4, ime: 'neon' }, Ar: { boja: '#c56cf0', r: 0.5, ime: 'argon' },
    Cr: { boja: '#8395a7', r: 0.58, ime: 'hrom' }, Mn: { boja: '#a29bfe', r: 0.58, ime: 'mangan' }, Ni: { boja: '#74b9ff', r: 0.58, ime: 'nikl' },
    B: { boja: '#fab1a0', r: 0.45, ime: 'bor' }, Be: { boja: '#c4e538', r: 0.5, ime: 'berilijum' }, Ti: { boja: '#b8b8c0', r: 0.6, ime: 'titanijum' },
    Co: { boja: '#4a69bd', r: 0.58, ime: 'kobalt' }, Ra: { boja: '#e55039', r: 0.7, ime: 'radijum' }, U: { boja: '#78e08f', r: 0.7, ime: 'uranijum' },
  };
  // redni brojevi i simboli (za scenu „atom“)
  const SIMBOLI = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'];
  const KONFIG = {
    1: [1], 2: [2], 3: [2, 1], 4: [2, 2], 5: [2, 3], 6: [2, 4], 7: [2, 5], 8: [2, 6], 9: [2, 7], 10: [2, 8], 11: [2, 8, 1], 12: [2, 8, 2], 13: [2, 8, 3], 14: [2, 8, 4],
    15: [2, 8, 5], 16: [2, 8, 6], 17: [2, 8, 7], 18: [2, 8, 8], 19: [2, 8, 8, 1], 20: [2, 8, 8, 2], 21: [2, 8, 9, 2], 22: [2, 8, 10, 2], 23: [2, 8, 11, 2], 24: [2, 8, 13, 1],
    25: [2, 8, 13, 2], 26: [2, 8, 14, 2], 27: [2, 8, 15, 2], 28: [2, 8, 16, 2], 29: [2, 8, 18, 1], 30: [2, 8, 18, 2], 31: [2, 8, 18, 3], 32: [2, 8, 18, 4], 33: [2, 8, 18, 5],
    34: [2, 8, 18, 6], 35: [2, 8, 18, 7], 36: [2, 8, 18, 8], 47: [2, 8, 18, 18, 1], 50: [2, 8, 18, 18, 4], 53: [2, 8, 18, 18, 7], 56: [2, 8, 18, 18, 8, 2],
    79: [2, 8, 18, 32, 18, 1], 80: [2, 8, 18, 32, 18, 2], 82: [2, 8, 18, 32, 18, 4],
  };
  const MASE = { 1: 1, 2: 4, 3: 7, 4: 9, 5: 11, 6: 12, 7: 14, 8: 16, 9: 19, 10: 20, 11: 23, 12: 24, 13: 27, 14: 28, 15: 31, 16: 32, 17: 35, 18: 40, 19: 39, 20: 40, 26: 56, 29: 64, 30: 65 };
  function konfiguracija(z, naboj = 0) {
    const e = z - naboj;
    return (KONFIG[e] || KONFIG[z] || [2, 8, 8]).slice();
  }

  // ───────────────────────── SMILES → 3D ─────────────────────────
  // Podskup SMILES-a: C N O S P F Cl Br I, veze - = #, grane ( ), prstenovi (jedan prsten), [Na+] [O-] [NH4+].
  // Vodonici se dopunjavaju po valenci; geometrija: sp3 (109,5°), sp2 (120°, ravan), sp (180°); lanci u cik-cak obliku.
  function razloziSmiles(s) {
    const at = [], ve = [], otv = {};
    const stek = [];
    let prev = -1, red = 1;
    for (let i = 0; i < s.length; ) {
      const c = s[i];
      if (c === '(') { stek.push(prev); i++; continue; }
      if (c === ')') { prev = stek.pop(); i++; continue; }
      if (c === '=') { red = 2; i++; continue; }
      if (c === '#') { red = 3; i++; continue; }
      if (c === '-') { red = 1; i++; continue; }
      if (/\d/.test(c)) {
        const k = c;
        if (otv[k] !== undefined) { ve.push({ a: otv[k], b: prev, red, prsten: true }); delete otv[k]; } else otv[k] = prev;
        red = 1; i++; continue;
      }
      let a;
      if (c === '[') {
        const j = s.indexOf(']', i);
        const m = /^(\d*)([A-Z][a-z]?)(?:H(\d?))?([+-]\d?)?$/.exec(s.slice(i + 1, j));
        if (!m) throw new Error('SMILES: ' + s);
        const nab = m[4] ? (m[4].length > 1 ? +m[4][1] * (m[4][0] === '-' ? -1 : 1) : m[4][0] === '-' ? -1 : 1) : 0;
        a = { el: m[2], h: m[3] === undefined ? (m[0].includes('H') ? 1 : 0) : +m[3] || 1, naboj: nab, zad: true };
        if (!/H/.test(s.slice(i + 1, j))) a.h = 0;
        i = j + 1;
      } else {
        let el = c;
        if ((c === 'C' && s[i + 1] === 'l') || (c === 'B' && s[i + 1] === 'r')) el = s.slice(i, i + 2);
        a = { el, h: null, naboj: 0 };
        i += el.length;
      }
      at.push(a);
      const id = at.length - 1;
      if (prev >= 0) ve.push({ a: prev, b: id, red });
      prev = id; red = 1;
    }
    return { at, ve };
  }
  const duzinaVeze = (e1, e2, red) => ((POLUPRECNIK[e1] || 0.8) + (POLUPRECNIK[e2] || 0.8)) * (red === 2 ? 0.88 : red === 3 ? 0.79 : 1);

  function izSmiles(smiles) {
    const { at, ve } = razloziSmiles(smiles);
    const n0 = at.length;
    // vodonici po valenci
    for (let i = 0; i < n0; i++) {
      const a = at[i];
      const zbir = ve.filter((v) => v.a === i || v.b === i).reduce((s, v) => s + v.red, 0);
      let nh = a.h;
      if (nh === null) nh = Math.max(0, (VALENCA[a.el] ?? 0) - zbir);
      for (let k = 0; k < nh; k++) { at.push({ el: 'H', naboj: 0 }); ve.push({ a: i, b: at.length - 1, red: 1 }); }
    }
    const sus = at.map(() => []);
    ve.forEach((v, k) => { sus[v.a].push({ j: v.b, red: v.red, prsten: v.prsten, k }); sus[v.b].push({ j: v.a, red: v.red, prsten: v.prsten, k }); });
    const poz = at.map(() => null);

    // prsten (jedan): najkraći put između atoma zatvaranja
    const zatv = ve.find((v) => v.prsten);
    let prsten = null;
    if (zatv) {
      const preth = { [zatv.a]: -1 }, red = [zatv.a];
      while (red.length) {
        const x = red.shift();
        for (const { j, k } of sus[x]) {
          if (ve[k] === zatv || preth[j] !== undefined || at[j].el === 'H') continue;
          preth[j] = x; red.push(j);
        }
      }
      prsten = [];
      for (let x = zatv.b; x !== -1; x = preth[x]) prsten.push(x);
    }
    const uPrstenu = (i) => prsten && prsten.includes(i);
    const stepenVeze = (i) => Math.max(0, ...sus[i].map((s) => s.red));
    const hibrid = (i) => {
      const reds = sus[i].map((s) => s.red);
      if (reds.includes(3) || reds.filter((r) => r === 2).length >= 2) return 'sp';
      if (reds.includes(2)) return 'sp2';
      return 'sp3';
    };

    // položaji prstena
    if (prsten) {
      const N = prsten.length, L = duzinaVeze(at[prsten[0]].el, at[prsten[1]].el, 1) * (N === 6 && prsten.some((i) => stepenVeze(i) === 2) ? 0.95 : 1);
      const R = L / (2 * Math.sin(Math.PI / N));
      const stolica = N === 6 && !prsten.some((i) => stepenVeze(i) === 2);
      prsten.forEach((i, k) => {
        const a = (k / N) * Math.PI * 2;
        poz[i] = [R * Math.cos(a), R * Math.sin(a), stolica ? (k % 2 ? 0.25 : -0.25) : 0];
      });
    }

    // širenje: dete dobija položaj oko roditelja
    const potomci = [];
    const sirenje = (i) => {
      const nepost = sus[i].filter((s) => !poz[s.j] && !s.prsten);
      if (!nepost.length) return;
      const postav = sus[i].filter((s) => poz[s.j]);
      nepost.sort((x, y) => (at[x.j].el === 'H') - (at[y.j].el === 'H') || y.red - x.red);
      let dirs = [];
      const hib = hibrid(i);
      const P = poz[i];
      if (uPrstenu(i)) {
        // spoljašnji pravci iz prstena
        const prs = postav.filter((s) => uPrstenu(s.j));
        const u1 = jed(odu(poz[prs[0].j], P)), u2 = jed(odu(poz[prs[1].j], P));
        const b = jed(mno(dod(u1, u2), -1)), nrm = jed(vek(u1, u2));
        if (nepost.length === 1) dirs = [b];
        else dirs = [dod(mno(b, 0.577), mno(nrm, 0.816)), dod(mno(b, 0.577), mno(nrm, -0.816))];
        if (nepost.length === 1 && hib === 'sp3') dirs = [b];
      } else if (!postav.length) {
        // koren
        if (hib === 'sp') dirs = [[1, 0, 0], [-1, 0, 0]];
        else if (hib === 'sp2') dirs = [[1, 0, 0], [-0.5, 0.866, 0], [-0.5, -0.866, 0]];
        else dirs = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]].map(jed);
      } else {
        const rod = postav[0].j;
        const u = jed(odu(poz[rod], P));
        if (hib === 'sp') dirs = [mno(u, -1)];
        else {
          // anti-referenca: drugi sused roditelja
          const dr = sus[rod].filter((s) => s.j !== i && poz[s.j]);
          let w = [0, 0, 0];
          if (dr.length) { const g = odu(poz[dr[0].j], poz[rod]); w = odu(g, mno(u, dot(g, u))); }
          if (duz(w) < 1e-6) { w = vek(u, Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]); w = mno(w, -1); }
          const e1 = mno(jed(w), -1), e2 = vek(u, e1);
          const faze = hib === 'sp2' ? [0, Math.PI] : [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
          const ugao = hib === 'sp2' ? (2 * Math.PI) / 3 : Math.acos(-1 / 3);
          dirs = faze.map((f) => dod(mno(u, Math.cos(ugao)), mno(dod(mno(e1, Math.cos(f)), mno(e2, Math.sin(f))), Math.sin(ugao))));
        }
      }
      nepost.forEach((s, k) => {
        const d = dirs[k] || dirs[dirs.length - 1];
        poz[s.j] = dod(P, mno(jed(d), duzinaVeze(at[i].el, at[s.j].el, s.red)));
        potomci.push(s.j);
      });
    };
    let red = [];
    if (prsten) red = [...prsten];
    else { poz[0] = [0, 0, 0]; red = [0]; }
    while (red.length) {
      const i = red.shift();
      potomci.length = 0;
      sirenje(i);
      red.push(...potomci);
    }
    const atomi = at.map((a, i) => (a.naboj ? [a.el, ...(poz[i] || [0, 0, 0]), { q: a.naboj }] : [a.el, ...(poz[i] || [0, 0, 0])]));
    const veze = ve.map((v) => (v.red > 1 ? [v.a, v.b, v.red] : [v.a, v.b]));
    return { atomi, veze };
  }

  // ───────────────────────── pomoćnici za ručno zadate molekule ─────────────────────────
  const rav = (el, x, y, z = 0) => [el, x, y, z];
  // dva atoma u pravoj liniji: dvoatomni molekul
  const dvoatomni = (e, d, red = 1) => ({ atomi: [rav(e, -d / 2, 0), rav(e, d / 2, 0)], veze: [[0, 1, red]] });
  // oktaedar, tetraedar i sl. za jone
  const tetra = (c, e, d) => [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]].map((v) => [e, ...dod(c, mno(jed(v), d))]);
  function iz3D(rez, naboji = {}) { return { ...rez, naboj: naboji }; }

  // ───────────────────────── BIBLIOTEKA ─────────────────────────
  // ime: { f: formula (za prikaz), n: naziv, s: SMILES  | atomi, veze, naboj: {indeks: 'ᵗ'} }
  const LIB = {};
  const kes = {};
  const def = (ime, f, n, o) => { LIB[ime] = { f, n, ...(typeof o === 'string' ? { s: o } : o) }; };

  // jednostavne supstance
  def('hlor', 'Cl₂', 'molekul hlora', dvoatomni('Cl', 1.99));
  def('brom', 'Br₂', 'molekul broma', dvoatomni('Br', 2.28));
  def('jod', 'I₂', 'molekul joda', dvoatomni('I', 2.67));
  def('fluor', 'F₂', 'molekul fluora', dvoatomni('F', 1.42));
  def('kiseonik', 'O₂', 'molekul kiseonika', dvoatomni('O', 1.21, 2));
  def('azot', 'N₂', 'molekul azota', dvoatomni('N', 1.1, 3));
  def('vodonik', 'H₂', 'molekul vodonika', dvoatomni('H', 0.74));
  def('ugljen-monoksid', 'CO', 'ugljen(II)-oksid', { atomi: [rav('C', -0.56, 0), rav('O', 0.56, 0)], veze: [[0, 1, 3]] });
  def('azot-monoksid', 'NO', 'azot(II)-oksid', { atomi: [rav('N', -0.58, 0), rav('O', 0.58, 0)], veze: [[0, 1, 2]] });
  def('hlorovodonik', 'HCl', 'hlorovodonik', { atomi: [['Cl', 0.63, 0, 0], ['H', -0.64, 0, 0]], veze: [[0, 1]] });
  def('fluorovodonik', 'HF', 'fluorovodonik', { atomi: [['F', 0.46, 0, 0], ['H', -0.46, 0, 0]], veze: [[0, 1]] });
  def('bromovodonik', 'HBr', 'bromovodonik', { atomi: [['Br', 0.7, 0, 0], ['H', -0.7, 0, 0]], veze: [[0, 1]] });
  def('jodovodonik', 'HI', 'jodovodonik', { atomi: [['I', 0.8, 0, 0], ['H', -0.8, 0, 0]], veze: [[0, 1]] });
  def('sumporovodonik', 'H₂S', 'sumporovodonik', { atomi: [['S', 0, 0, 0], ['H', 0.97, 0.7, 0], ['H', -0.97, 0.7, 0]], veze: [[0, 1], [0, 2]] });
  def('sumpor-dioksid', 'SO₂', 'sumpor(IV)-oksid', { atomi: [['S', 0, 0.3, 0], ['O', 1.25, -0.3, 0], ['O', -1.25, -0.3, 0]], veze: [[0, 1, 2], [0, 2, 2]] });
  def('sumpor-trioksid', 'SO₃', 'sumpor(VI)-oksid', { atomi: [['S', 0, 0, 0], ['O', 1.42, 0, 0], ['O', -0.71, 1.23, 0], ['O', -0.71, -1.23, 0]], veze: [[0, 1, 2], [0, 2, 2], [0, 3, 2]] });
  def('azot-dioksid', 'NO₂', 'azot(IV)-oksid', { atomi: [['N', 0, 0.3, 0], ['O', 1.0, -0.3, 0], ['O', -1.0, -0.3, 0]], veze: [[0, 1, 2], [0, 2]] });
  def('azot-suboksid', 'N₂O', 'azot(I)-oksid', { atomi: [['N', -1.2, 0, 0], ['N', 0, 0, 0], ['O', 1.19, 0, 0]], veze: [[0, 1, 3], [1, 2, 2]] });
  def('azot-pentoksid', 'N₂O₅', 'azot(V)-oksid', { atomi: [['O', 0, 0.3, 0], ['N', 1.2, -0.3, 0], ['N', -1.2, -0.3, 0], ['O', 1.9, 0.6, 0], ['O', 1.9, -1.3, 0], ['O', -1.9, 0.6, 0], ['O', -1.9, -1.3, 0]], veze: [[0, 1], [0, 2], [1, 3, 2], [1, 4], [2, 5, 2], [2, 6]] });
  def('ugljena-kiselina', 'H₂CO₃', 'ugljena kiselina', 'OC(=O)O');
  def('sumporasta-kiselina', 'H₂SO₃', 'sumporasta kiselina', { atomi: [['S', 0, 0.15, 0], ['O', 0, 1.5, 0], ['O', 1.3, -0.5, 0.2], ['O', -1.3, -0.5, 0.2], ['H', 1.9, -0.3, 0.95], ['H', -1.9, -0.3, 0.95]], veze: [[0, 1, 2], [0, 2], [0, 3], [2, 4], [3, 5]] });
  def('sumporna-kiselina', 'H₂SO₄', 'sumporna kiselina', { atomi: [['S', 0, 0, 0], ['O', 0.83, 0.83, 0.83], ['O', -0.83, -0.83, 0.83], ['O', -0.83, 0.83, -0.83], ['O', 0.83, -0.83, -0.83], ['H', -1.5, 1.6, -0.9], ['H', 1.6, -1.5, -0.9]], veze: [[0, 1, 2], [0, 2, 2], [0, 3], [0, 4], [3, 5], [4, 6]] });
  def('azotna-kiselina', 'HNO₃', 'azotna kiselina', { atomi: [['N', 0, 0, 0], ['O', 1.1, 0.6, 0], ['O', -1.1, 0.6, 0], ['O', 0, -1.3, 0], ['H', 0.8, -1.8, 0]], veze: [[0, 1, 2], [0, 2], [0, 3], [3, 4]] });
  def('fosforna-kiselina', 'H₃PO₄', 'fosforna kiselina', { atomi: [['P', 0, 0, 0], ['O', 0, 1.5, 0], ['O', 1.4, -0.6, 0.3], ['O', -1.0, -0.6, 1.0], ['O', -0.6, -0.6, -1.3], ['H', 2.0, -0.3, 1.0], ['H', -0.9, -0.2, 1.9], ['H', -1.5, -0.2, -1.8]], veze: [[0, 1, 2], [0, 2], [0, 3], [0, 4], [2, 5], [3, 6], [4, 7]] });
  def('fosfor-pentoksid', 'P₄O₁₀', 'fosfor(V)-oksid', (() => {
    const P = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]].map((v) => mno(v, 0.85));
    const atomi = P.map((p) => ['P', ...p]), veze = [];
    let k = 4;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const m = mno(dod(P[i], P[j]), 0.5), o = jed(m);
      atomi.push(['O', ...dod(m, mno(o, 0.55))]); veze.push([i, k], [j, k]); k++;
    }
    for (let i = 0; i < 4; i++) { atomi.push(['O', ...mno(jed(P[i]), 0.85 * 1.73 + 1.2)]); veze.push([i, k, 2]); k++; }
    return { atomi, veze };
  })());
  def('beli-fosfor', 'P₄', 'beli fosfor', (() => {
    const P = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]].map((v) => mno(v, 0.72));
    const veze = [];
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) veze.push([i, j]);
    return { atomi: P.map((p) => ['P', ...p]), veze };
  })());
  def('sumpor-s8', 'S₈', 'prsten od osam atoma sumpora', (() => {
    const atomi = [], veze = [];
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; atomi.push(['S', 1.9 * Math.cos(a), 1.9 * Math.sin(a), i % 2 ? 0.5 : -0.5]); veze.push([i, (i + 1) % 8]); }
    return { atomi, veze };
  })());
  def('fuleren', 'C₆₀', 'fuleren C₆₀', (() => {
    const f = (1 + Math.sqrt(5)) / 2, tacke = [];
    const permutacije = (a, b, c) => [[a, b, c], [b, c, a], [c, a, b]];
    const znaci = (p) => { const r = []; for (const sx of [1, -1]) for (const sy of [1, -1]) for (const sz of [1, -1]) r.push([p[0] * sx, p[1] * sy, p[2] * sz]); return r; };
    const seme = [[0, 1, 3 * f], [1, 2 + f, 2 * f], [f, 2, 2 * f + 1]];
    for (const [a, b, c] of seme) for (const p of permutacije(a, b, c)) for (const q of znaci(p)) if (!tacke.some((t) => Math.hypot(t[0] - q[0], t[1] - q[1], t[2] - q[2]) < 1e-6)) tacke.push(q);
    const k = 1.42 / 2; // dužina ivice u jedinicama je 2
    const atomi = tacke.map((t) => ['C', ...mno(t, k)]);
    const veze = [];
    for (let i = 0; i < atomi.length; i++) for (let j = i + 1; j < atomi.length; j++) if (Math.hypot(atomi[i][1] - atomi[j][1], atomi[i][2] - atomi[j][2], atomi[i][3] - atomi[j][3]) < 1.5) veze.push([i, j]);
    return { atomi, veze, tanke: true };
  })());
  def('grafit', 'C', 'grafit – slojevi od šestouglova', (() => {
    const atomi = [], veze = [], a = 1.42;
    for (let sloj = 0; sloj < 3; sloj++) {
      const z = (sloj - 1) * 2.2, pomak = sloj % 2 ? a : 0;
      const baza = atomi.length;
      const idx = {};
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
        // šestougaona rešetka
        const x0 = (i + j / 2) * a * 1.732, y0 = j * a * 1.5;
        for (const [dx, dy] of [[0, 0], [0, a]]) {
          const x = x0 + dx, y = y0 + dy;
          if (Math.hypot(x, y) < 3.3) { idx[[i, j, dy]] = atomi.length; atomi.push(['C', x + pomak * 0.4, y, z]); }
        }
      }
      for (let p = baza; p < atomi.length; p++) for (let q = p + 1; q < atomi.length; q++) {
        if (Math.hypot(atomi[p][1] - atomi[q][1], atomi[p][2] - atomi[q][2]) < a * 1.1) veze.push([p, q]);
      }
    }
    return { atomi, veze, tanke: true };
  })());
  def('grafen', 'C', 'grafen – jedan sloj ugljenika', (() => {
    const atomi = [], veze = [], a = 1.42;
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
      const x0 = (i + j / 2) * a * 1.732, y0 = j * a * 1.5;
      for (const dy of [0, a]) { const x = x0, y = y0 + dy; if (Math.hypot(x, y) < 4.6) atomi.push(['C', x, y, 0]); }
    }
    for (let p = 0; p < atomi.length; p++) for (let q = p + 1; q < atomi.length; q++) if (Math.hypot(atomi[p][1] - atomi[q][1], atomi[p][2] - atomi[q][2]) < a * 1.1) veze.push([p, q]);
    return { atomi, veze, tanke: true };
  })());
  // kristalne rešetke metala
  const resetka = (tip, e, a) => {
    const atomi = [], veze = [];
    const tacke = [];
    for (let x = 0; x <= 2; x++) for (let y = 0; y <= 2; y++) for (let z = 0; z <= 2; z++) {
      if (tip === 'fcc' || tip === 'bcc' || tip === 'sc') tacke.push([x, y, z]);
    }
    const sve = [...tacke];
    if (tip === 'bcc') for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) sve.push([x + 0.5, y + 0.5, z + 0.5]);
    if (tip === 'fcc') for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) for (let z = 0; z <= 2; z++) {
      const s = [[x + 0.5, y + 0.5, z], [x + 0.5, z, y + 0.5], [z, x + 0.5, y + 0.5]];
      for (const p of s) if (p.every((v) => v >= 0 && v <= 2) && !sve.some((q) => q.every((v, i) => Math.abs(v - p[i]) < 1e-6))) sve.push(p);
    }
    sve.forEach((p) => atomi.push([e, (p[0] - 1) * a, (p[1] - 1) * a, (p[2] - 1) * a]));
    const d = tip === 'bcc' ? a * 0.87 : tip === 'fcc' ? a * 0.71 : a;
    for (let i = 0; i < atomi.length; i++) for (let j = i + 1; j < atomi.length; j++) if (Math.hypot(atomi[i][1] - atomi[j][1], atomi[i][2] - atomi[j][2], atomi[i][3] - atomi[j][3]) < d + 0.05) veze.push([i, j]);
    return { atomi, veze, tanke: true };
  };
  def('resetka-bakar', 'Cu', 'kristalna rešetka bakra', resetka('fcc', 'Cu', 1.6));
  def('resetka-gvozdje', 'Fe', 'kristalna rešetka gvožđa', resetka('bcc', 'Fe', 1.6));
  def('resetka-natrijum', 'Na', 'kristalna rešetka natrijuma', resetka('bcc', 'Na', 1.8));
  def('natrijum-hlorid', 'NaCl', 'kristal kuhinjske soli', (() => {
    const atomi = [], veze = [], idx = {};
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      idx[[x, y, z]] = atomi.length;
      const kl = (x + y + z + 3) % 2 === 0;
      atomi.push([kl ? 'Cl' : 'Na', x * 1.4, y * 1.4, z * 1.4, { q: kl ? -1 : 1 }]);
    }
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      if (x < 1) veze.push([idx[[x, y, z]], idx[[x + 1, y, z]]]);
      if (y < 1) veze.push([idx[[x, y, z]], idx[[x, y + 1, z]]]);
      if (z < 1) veze.push([idx[[x, y, z]], idx[[x, y, z + 1]]]);
    }
    return { atomi, veze, tanke: true };
  })());
  def('led', 'H₂O', 'led – molekuli vode u šestouglovima', (() => {
    const atomi = [], veze = [];
    for (let sloj = 0; sloj < 2; sloj++) for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + sloj * 0.52;
      const O = [2.1 * Math.cos(a), 2.1 * Math.sin(a), (sloj - 0.5) * 1.9 + (k % 2 ? 0.35 : -0.35)];
      const o = atomi.length;
      atomi.push(['O', ...O]);
      const ka = jed([-Math.cos(a + 0.9), -Math.sin(a + 0.9), 0.15]), kb = jed([-Math.cos(a - 0.9), -Math.sin(a - 0.9), -0.15]);
      atomi.push(['H', ...dod(O, mno(ka, 0.96))], ['H', ...dod(O, mno(kb, 0.96))]);
      veze.push([o, o + 1], [o, o + 2]);
    }
    return { atomi, veze };
  })());

  def('voda', 'H₂O', 'voda', { atomi: [['O', 0, 0, 0], ['H', 0.76, 0.59, 0], ['H', -0.76, 0.59, 0]], veze: [[0, 1], [0, 2]] });
  def('ugljen-dioksid', 'CO₂', 'ugljen(IV)-oksid', { atomi: [['O', -1.16, 0, 0], ['C', 0, 0, 0], ['O', 1.16, 0, 0]], veze: [[0, 1, 2], [1, 2, 2]] });
  def('amonijak', 'NH₃', 'amonijak', { atomi: [['N', 0, 0.12, 0], ['H', 0.94, -0.26, 0], ['H', -0.47, -0.26, 0.81], ['H', -0.47, -0.26, -0.81]], veze: [[0, 1], [0, 2], [0, 3]] });
  def('ozon', 'O₃', 'ozon', { atomi: [['O', 0, 0.3, 0], ['O', 1.08, -0.36, 0], ['O', -1.08, -0.36, 0]], veze: [[0, 1, 2], [0, 2]] });
  def('vodonik-peroksid', 'H₂O₂', 'vodonik-peroksid', { atomi: [['O', 0, 0.72, 0], ['O', 0, -0.72, 0], ['H', 0.9, 0.95, 0.2], ['H', -0.2, -0.95, 0.9]], veze: [[0, 1], [0, 2], [1, 3]] });
  def('kuhinjska-so', 'NaCl', 'natrijum-hlorid (par jona)', { atomi: [['Na', -1.3, 0, 0, { q: 1 }], ['Cl', 1.3, 0, 0, { q: -1 }]], veze: [] });
  def('kalijum-hlorid', 'KCl', 'kalijum-hlorid', { atomi: [['K', -1.5, 0, 0, { q: 1 }], ['Cl', 1.5, 0, 0, { q: -1 }]], veze: [] });
  def('kalijum-hidroksid', 'KOH', 'kalijum-hidroksid', { atomi: [['K', -1.8, 0, 0, { q: 1 }], ['O', 0.3, 0, 0, { q: -1 }], ['H', 1.25, 0, 0]], veze: [[1, 2]] });
  def('natrijum-karbonat', 'Na₂CO₃', 'natrijum-karbonat (soda)', { atomi: [['C', 0, 0, 0], ['O', 1.29, 0, 0, { q: -2 }], ['O', -0.65, 1.12, 0], ['O', -0.65, -1.12, 0], ['Na', 3.4, 0.8, 0, { q: 1 }], ['Na', 3.4, -0.8, 0, { q: 1 }]], veze: [[0, 1], [0, 2, 2], [0, 3]] });
  def('magnezijum-sulfat', 'MgSO₄', 'magnezijum-sulfat', { atomi: [['S', 0, 0, 0], ...tetra([0, 0, 0], 'O', 1.47), ['Mg', 3.1, 0.5, 0, { q: 2 }]], veze: [[0, 1, 2], [0, 2, 2], [0, 3], [0, 4]] });
  def('natrijum-fosfat', 'Na₃PO₄', 'natrijum-fosfat', { atomi: [['P', 0, 0, 0], ...tetra([0, 0, 0], 'O', 1.54), ['Na', 3.2, 1.0, 0, { q: 1 }], ['Na', -3.0, 1.0, 1.0, { q: 1 }], ['Na', 0, -3.2, 0, { q: 1 }]], veze: [[0, 1, 2], [0, 2], [0, 3], [0, 4]] });
  def('kalcijum-fosfat', 'Ca₃(PO₄)₂', 'kalcijum-fosfat', { atomi: [['P', 0, 0, 0], ...tetra([0, 0, 0], 'O', 1.54), ['Ca', 3.2, 1.0, 0, { q: 2 }], ['Ca', -3.0, 1.0, 1.0, { q: 2 }], ['Ca', 0, -3.2, 0, { q: 2 }]], veze: [[0, 1, 2], [0, 2], [0, 3], [0, 4]] });
  def('cink-oksid', 'ZnO', 'cink-oksid', { atomi: [['Zn', -1.0, 0, 0, { q: 2 }], ['O', 1.0, 0, 0, { q: -2 }]], veze: [] });
  def('olovo-jodid', 'PbI₂', 'olovo(II)-jodid', { atomi: [['Pb', 0, 0, 0, { q: 2 }], ['I', 2.8, 0, 0, { q: -1 }], ['I', -2.8, 0, 0, { q: -1 }]], veze: [] });
  def('bakar-hidroksid', 'Cu(OH)₂', 'bakar(II)-hidroksid', { atomi: [['Cu', 0, 0, 0, { q: 2 }], ['O', 2.1, 0, 0, { q: -1 }], ['H', 3.05, 0, 0], ['O', -2.1, 0, 0, { q: -1 }], ['H', -3.05, 0, 0]], veze: [[1, 2], [3, 4]] });
  def('magnezijum-hidroksid', 'Mg(OH)₂', 'magnezijum-hidroksid', { atomi: [['Mg', 0, 0, 0, { q: 2 }], ['O', 2.1, 0, 0, { q: -1 }], ['H', 3.05, 0, 0], ['O', -2.1, 0, 0, { q: -1 }], ['H', -3.05, 0, 0]], veze: [[1, 2], [3, 4]] });
  def('gvozdje-hidroksid', 'Fe(OH)₃', 'gvožđe(III)-hidroksid', { atomi: [['Fe', 0, 0, 0, { q: 3 }], ['O', 2.1, 0, 0, { q: -1 }], ['H', 3.05, 0, 0], ['O', -1.05, 1.82, 0, { q: -1 }], ['H', -1.52, 2.64, 0], ['O', -1.05, -1.82, 0, { q: -1 }], ['H', -1.52, -2.64, 0]], veze: [[1, 2], [3, 4], [5, 6]] });
  def('gvozdje-hlorid', 'FeCl₃', 'gvožđe(III)-hlorid', { atomi: [['Fe', 0, 0, 0, { q: 3 }], ['Cl', 2.5, 0, 0, { q: -1 }], ['Cl', -1.25, 2.17, 0, { q: -1 }], ['Cl', -1.25, -2.17, 0, { q: -1 }]], veze: [] });
  def('gvozdje-hlorid-2', 'FeCl₂', 'gvožđe(II)-hlorid', { atomi: [['Fe', 0, 0, 0, { q: 2 }], ['Cl', 2.5, 0, 0, { q: -1 }], ['Cl', -2.5, 0, 0, { q: -1 }]], veze: [] });
  def('bakar-hlorid', 'CuCl₂', 'bakar(II)-hlorid', { atomi: [['Cu', 0, 0, 0, { q: 2 }], ['Cl', 2.4, 0, 0, { q: -1 }], ['Cl', -2.4, 0, 0, { q: -1 }]], veze: [] });
  def('barijum-hlorid', 'BaCl₂', 'barijum-hlorid', { atomi: [['Ba', 0, 0, 0, { q: 2 }], ['Cl', 2.9, 0, 0, { q: -1 }], ['Cl', -2.9, 0, 0, { q: -1 }]], veze: [] });
  def('aluminijum-sulfat', 'Al₂(SO₄)₃', 'aluminijum-sulfat', { atomi: [['S', 0, 0, 0], ...tetra([0, 0, 0], 'O', 1.47), ['Al', 3.3, 0.5, 0, { q: 3 }], ['Al', -3.3, -0.5, 0, { q: 3 }]], veze: [[0, 1, 2], [0, 2, 2], [0, 3], [0, 4]] });
  def('dijamant', 'C', 'dijamant – trodimenzionalna mreža atoma ugljenika', (() => {
    const baza = [[0, 0, 0], [0, 2, 2], [2, 0, 2], [2, 2, 0], [1, 1, 1], [1, 3, 3], [3, 1, 3], [3, 3, 1]];
    const atomi = baza.map(([x, y, z]) => ['C', (x - 1.5) * 0.9, (y - 1.5) * 0.9, (z - 1.5) * 0.9]);
    const veze = [];
    for (let i = 0; i < atomi.length; i++) for (let j = i + 1; j < atomi.length; j++) if (Math.hypot(atomi[i][1] - atomi[j][1], atomi[i][2] - atomi[j][2], atomi[i][3] - atomi[j][3]) < 1.6) veze.push([i, j]);
    return { atomi, veze };
  })());
  // joni (naboj: indeks atoma → natpis)
  def('natrijum-jon', 'Na⁺', 'jon natrijuma', { atomi: [['Na', 0, 0, 0, { q: 1 }]], veze: [] });
  def('hlorid-jon', 'Cl⁻', 'hloridni jon', { atomi: [['Cl', 0, 0, 0, { q: -1 }]], veze: [] });
  def('vodonik-jon', 'H⁺', 'vodonikov katjon', { atomi: [['H', 0, 0, 0, { q: 1 }]], veze: [] });
  def('hidronijum', 'H₃O⁺', 'hidronijum-jon', { atomi: [['O', 0, 0.12, 0, { q: 1 }], ['H', 0.94, -0.26, 0], ['H', -0.47, -0.26, 0.81], ['H', -0.47, -0.26, -0.81]], veze: [[0, 1], [0, 2], [0, 3]] });
  def('hidroksid', 'OH⁻', 'hidroksidni jon', { atomi: [['O', 0.48, 0, 0, { q: -1 }], ['H', -0.48, 0, 0]], veze: [[0, 1]] });
  def('amonijum', 'NH₄⁺', 'amonijum-jon', { atomi: [['N', 0, 0, 0, { q: 1 }], ...tetra([0, 0, 0], 'H', 1.02)], veze: [[0, 1], [0, 2], [0, 3], [0, 4]] });
  def('sulfat', 'SO₄²⁻', 'sulfatni jon', { atomi: [['S', 0, 0, 0], ...tetra([0, 0, 0], 'O', 1.47).map((a, i) => (i === 0 ? [...a, { q: -2 }] : a))], veze: [[0, 1, 2], [0, 2, 2], [0, 3], [0, 4]] });
  def('nitrat', 'NO₃⁻', 'nitratni jon', { atomi: [['N', 0, 0, 0], ['O', 1.24, 0, 0, { q: -1 }], ['O', -0.62, 1.07, 0], ['O', -0.62, -1.07, 0]], veze: [[0, 1], [0, 2, 2], [0, 3]] });
  def('karbonat', 'CO₃²⁻', 'karbonatni jon', { atomi: [['C', 0, 0, 0], ['O', 1.29, 0, 0, { q: -2 }], ['O', -0.65, 1.12, 0], ['O', -0.65, -1.12, 0]], veze: [[0, 1], [0, 2, 2], [0, 3]] });
  def('fosfat', 'PO₄³⁻', 'fosfatni jon', { atomi: [['P', 0, 0, 0], ...tetra([0, 0, 0], 'O', 1.54).map((a, i) => (i === 0 ? [...a, { q: -3 }] : a))], veze: [[0, 1], [0, 2, 2], [0, 3], [0, 4]] });
  def('natrijum-hidroksid', 'NaOH', 'natrijum-hidroksid', { atomi: [['Na', -1.6, 0, 0, { q: 1 }], ['O', 0.3, 0, 0, { q: -1 }], ['H', 1.25, 0, 0]], veze: [[1, 2]] });
  def('natrijum-oksid', 'Na₂O', 'natrijum-oksid', { atomi: [['O', 0, 0, 0, { q: -2 }], ['Na', 1.9, 0, 0, { q: 1 }], ['Na', -1.9, 0, 0, { q: 1 }]], veze: [] });
  def('kalcijum-oksid', 'CaO', 'kalcijum-oksid (živi kreč)', { atomi: [['Ca', -1.1, 0, 0, { q: 2 }], ['O', 1.1, 0, 0, { q: -2 }]], veze: [] });
  def('magnezijum-oksid', 'MgO', 'magnezijum-oksid', { atomi: [['Mg', -1.0, 0, 0, { q: 2 }], ['O', 1.0, 0, 0, { q: -2 }]], veze: [] });
  def('kalcijum-hidroksid', 'Ca(OH)₂', 'kalcijum-hidroksid (gašeni kreč)', { atomi: [['Ca', 0, 0, 0, { q: 2 }], ['O', 2.2, 0, 0, { q: -1 }], ['H', 3.15, 0, 0], ['O', -2.2, 0, 0, { q: -1 }], ['H', -3.15, 0, 0]], veze: [[1, 2], [3, 4]] });
  def('kalcijum-karbonat', 'CaCO₃', 'kalcijum-karbonat (kreč, mermer)', { atomi: [['Ca', -2.2, 0, 0, { q: 2 }], ['C', 1.1, 0, 0], ['O', 2.4, 0, 0, { q: -1 }], ['O', 0.45, 1.12, 0, { q: -1 }], ['O', 0.45, -1.12, 0]], veze: [[1, 2], [1, 3, 2], [1, 4]] });
  def('natrijum-hidrogenkarbonat', 'NaHCO₃', 'natrijum-hidrogenkarbonat (soda bikarbona)', { atomi: [['Na', -2.3, 0, 0, { q: 1 }], ['C', 0.5, 0, 0], ['O', 1.75, 0, 0, { q: -1 }], ['O', -0.1, 1.1, 0], ['O', -0.1, -1.1, 0], ['H', 0.5, -1.9, 0]], veze: [[1, 2], [1, 3, 2], [1, 4], [4, 5]] });
  def('natrijum-sulfat', 'Na₂SO₄', 'natrijum-sulfat', { atomi: [['S', 0, 0, 0], ...tetra([0, 0, 0], 'O', 1.47), ['Na', 3.4, 0.8, 0, { q: 1 }], ['Na', -3.4, -0.8, 0, { q: 1 }]], veze: [[0, 1, 2], [0, 2, 2], [0, 3], [0, 4]] });
  def('barijum-sulfat', 'BaSO₄', 'barijum-sulfat', { atomi: [['S', 0, 0, 0], ...tetra([0, 0, 0], 'O', 1.47), ['Ba', 3.3, 0.5, 0, { q: 2 }]], veze: [[0, 1, 2], [0, 2, 2], [0, 3], [0, 4]] });
  def('bakar-sulfat', 'CuSO₄', 'bakar(II)-sulfat', { atomi: [['S', 0, 0, 0], ...tetra([0, 0, 0], 'O', 1.47), ['Cu', 3.2, 0.5, 0, { q: 2 }]], veze: [[0, 1, 2], [0, 2, 2], [0, 3], [0, 4]] });
  def('kalcijum-sulfat', 'CaSO₄', 'kalcijum-sulfat (gips)', { atomi: [['S', 0, 0, 0], ...tetra([0, 0, 0], 'O', 1.47), ['Ca', 3.3, 0.5, 0, { q: 2 }]], veze: [[0, 1, 2], [0, 2, 2], [0, 3], [0, 4]] });
  def('kalijum-nitrat', 'KNO₃', 'kalijum-nitrat', { atomi: [['N', 0, 0, 0], ['O', 1.24, 0, 0, { q: -1 }], ['O', -0.62, 1.07, 0], ['O', -0.62, -1.07, 0], ['K', 3.5, 0, 0, { q: 1 }]], veze: [[0, 1], [0, 2, 2], [0, 3]] });
  def('bakar-nitrat', 'Cu(NO₃)₂', 'bakar(II)-nitrat', (() => {
    const nit = [['N', 0, 0, 0], ['O', 1.24, 0, 0, { q: -1 }], ['O', -0.62, 1.07, 0], ['O', -0.62, -1.07, 0]], v = [[0, 1], [0, 2, 2], [0, 3]];
    const levo = nit.map((a) => [a[0], -a[1] - 3.2, a[2], a[3], ...(a[4] ? [a[4]] : [])]), desno = nit.map((a) => [a[0], a[1] + 3.2, a[2], a[3], ...(a[4] ? [a[4]] : [])]);
    return { atomi: [...levo, ...desno, ['Cu', 0, 0, 0, { q: 2 }]], veze: [...v, ...v.map(([i, j, r]) => (r ? [i + 4, j + 4, r] : [i + 4, j + 4]))] };
  })());
  def('cink-sulfat', 'ZnSO₄', 'cink-sulfat', { atomi: [['S', 0, 0, 0], ...tetra([0, 0, 0], 'O', 1.47), ['Zn', 3.2, 0.5, 0, { q: 2 }]], veze: [[0, 1, 2], [0, 2, 2], [0, 3], [0, 4]] });
  def('cink-hlorid', 'ZnCl₂', 'cink-hlorid', { atomi: [['Zn', 0, 0, 0, { q: 2 }], ['Cl', 2.4, 0, 0, { q: -1 }], ['Cl', -2.4, 0, 0, { q: -1 }]], veze: [] });
  def('magnezijum-hlorid', 'MgCl₂', 'magnezijum-hlorid', { atomi: [['Mg', 0, 0, 0, { q: 2 }], ['Cl', 2.4, 0, 0, { q: -1 }], ['Cl', -2.4, 0, 0, { q: -1 }]], veze: [] });
  def('kalcijum-hlorid', 'CaCl₂', 'kalcijum-hlorid', { atomi: [['Ca', 0, 0, 0, { q: 2 }], ['Cl', 2.6, 0, 0, { q: -1 }], ['Cl', -2.6, 0, 0, { q: -1 }]], veze: [] });
  def('aluminijum-hlorid', 'AlCl₃', 'aluminijum-hlorid', { atomi: [['Al', 0, 0, 0, { q: 3 }], ['Cl', 2.5, 0, 0, { q: -1 }], ['Cl', -1.25, 2.17, 0, { q: -1 }], ['Cl', -1.25, -2.17, 0, { q: -1 }]], veze: [] });
  def('aluminijum-oksid', 'Al₂O₃', 'aluminijum-oksid', { atomi: [['Al', -1.6, 0, 0, { q: 3 }], ['Al', 1.6, 0, 0, { q: 3 }], ['O', 0, 1.3, 0, { q: -2 }], ['O', 0, -1.3, 0.6, { q: -2 }], ['O', 0, 0, -1.4, { q: -2 }]], veze: [] });
  def('gvozdje-oksid', 'Fe₂O₃', 'gvožđe(III)-oksid (rđa)', { atomi: [['Fe', -1.6, 0, 0, { q: 3 }], ['Fe', 1.6, 0, 0, { q: 3 }], ['O', 0, 1.3, 0, { q: -2 }], ['O', 0, -1.3, 0.6, { q: -2 }], ['O', 0, 0, -1.4, { q: -2 }]], veze: [] });
  def('bakar-oksid', 'CuO', 'bakar(II)-oksid', { atomi: [['Cu', -1.0, 0, 0, { q: 2 }], ['O', 1.0, 0, 0, { q: -2 }]], veze: [] });
  def('srebro-hlorid', 'AgCl', 'srebro(I)-hlorid', { atomi: [['Ag', -1.3, 0, 0, { q: 1 }], ['Cl', 1.3, 0, 0, { q: -1 }]], veze: [] });
  def('srebro-nitrat', 'AgNO₃', 'srebro(I)-nitrat', { atomi: [['N', 0, 0, 0], ['O', 1.24, 0, 0, { q: -1 }], ['O', -0.62, 1.07, 0], ['O', -0.62, -1.07, 0], ['Ag', 3.4, 0, 0, { q: 1 }]], veze: [[0, 1], [0, 2, 2], [0, 3]] });
  def('natrijum-nitrat', 'NaNO₃', 'natrijum-nitrat', { atomi: [['N', 0, 0, 0], ['O', 1.24, 0, 0, { q: -1 }], ['O', -0.62, 1.07, 0], ['O', -0.62, -1.07, 0], ['Na', 3.4, 0, 0, { q: 1 }]], veze: [[0, 1], [0, 2, 2], [0, 3]] });
  def('bakar', 'Cu', 'atom bakra', { atomi: [['Cu', 0, 0, 0]], veze: [] });
  def('cink', 'Zn', 'atom cinka', { atomi: [['Zn', 0, 0, 0]], veze: [] });
  def('gvozdje', 'Fe', 'atom gvožđa', { atomi: [['Fe', 0, 0, 0]], veze: [] });
  def('magnezijum', 'Mg', 'atom magnezijuma', { atomi: [['Mg', 0, 0, 0]], veze: [] });
  def('natrijum', 'Na', 'atom natrijuma', { atomi: [['Na', 0, 0, 0]], veze: [] });
  def('kalcijum', 'Ca', 'atom kalcijuma', { atomi: [['Ca', 0, 0, 0]], veze: [] });
  def('srebro', 'Ag', 'atom srebra', { atomi: [['Ag', 0, 0, 0]], veze: [] });
  def('aluminijum', 'Al', 'atom aluminijuma', { atomi: [['Al', 0, 0, 0]], veze: [] });
  def('ugljenik', 'C', 'atom ugljenika', { atomi: [['C', 0, 0, 0]], veze: [] });
  def('sumpor', 'S', 'atom sumpora', { atomi: [['S', 0, 0, 0]], veze: [] });
  def('bakar-jon', 'Cu²⁺', 'katjon bakra', { atomi: [['Cu', 0, 0, 0, { q: 2 }]], veze: [] });
  def('cink-jon', 'Zn²⁺', 'katjon cinka', { atomi: [['Zn', 0, 0, 0, { q: 2 }]], veze: [] });
  def('srebro-jon', 'Ag⁺', 'katjon srebra', { atomi: [['Ag', 0, 0, 0, { q: 1 }]], veze: [] });
  def('magnezijum-jon', 'Mg²⁺', 'katjon magnezijuma', { atomi: [['Mg', 0, 0, 0, { q: 2 }]], veze: [] });
  def('barijum-jon', 'Ba²⁺', 'katjon barijuma', { atomi: [['Ba', 0, 0, 0, { q: 2 }]], veze: [] });
  def('kalcijum-jon', 'Ca²⁺', 'katjon kalcijuma', { atomi: [['Ca', 0, 0, 0, { q: 2 }]], veze: [] });

  // organska jedinjenja (SMILES)
  const ORG = [
    ['metan', 'CH₄', 'metan', 'C'], ['etan', 'C₂H₆', 'etan', 'CC'], ['propan', 'C₃H₈', 'propan', 'CCC'], ['butan', 'C₄H₁₀', 'butan', 'CCCC'],
    ['izobutan', 'C₄H₁₀', '2-metilpropan (izobutan)', 'CC(C)C'], ['pentan', 'C₅H₁₂', 'pentan', 'CCCCC'], ['izopentan', 'C₅H₁₂', '2-metilbutan', 'CC(C)CC'],
    ['neopentan', 'C₅H₁₂', '2,2-dimetilpropan', 'CC(C)(C)C'], ['heksan', 'C₆H₁₄', 'heksan', 'CCCCCC'], ['heptan', 'C₇H₁₆', 'heptan', 'CCCCCCC'], ['oktan', 'C₈H₁₈', 'oktan', 'CCCCCCCC'],
    ['dekan', 'C₁₀H₂₂', 'dekan', 'CCCCCCCCCC'],
    ['eten', 'C₂H₄', 'eten', 'C=C'], ['propen', 'C₃H₆', 'propen', 'C=CC'], ['but-1-en', 'C₄H₈', 'but-1-en', 'C=CCC'], ['but-2-en', 'C₄H₈', 'but-2-en', 'CC=CC'],
    ['pent-1-en', 'C₅H₁₀', 'pent-1-en', 'C=CCCC'],
    ['etin', 'C₂H₂', 'etin (acetilen)', 'C#C'], ['propin', 'C₃H₄', 'propin', 'C#CC'], ['but-1-in', 'C₄H₆', 'but-1-in', 'C#CCC'],
    ['cikloheksan', 'C₆H₁₂', 'cikloheksan', 'C1CCCCC1'], ['ciklopentan', 'C₅H₁₀', 'ciklopentan', 'C1CCCC1'], ['ciklopropan', 'C₃H₆', 'ciklopropan', 'C1CC1'],
    ['benzen', 'C₆H₆', 'benzen', 'C1=CC=CC=C1'], ['toluen', 'C₇H₈', 'toluen', 'CC1=CC=CC=C1'], ['fenol', 'C₆H₅OH', 'fenol', 'OC1=CC=CC=C1'],
    ['hlormetan', 'CH₃Cl', 'hlormetan', 'CCl'], ['dihlormetan', 'CH₂Cl₂', 'dihlormetan', 'ClCCl'], ['hloroform', 'CHCl₃', 'trihlormetan (hloroform)', 'ClC(Cl)Cl'],
    ['tetrahlormetan', 'CCl₄', 'tetrahlormetan', 'ClC(Cl)(Cl)Cl'], ['hloretan', 'C₂H₅Cl', 'hloretan', 'CCCl'], ['bromoetan', 'C₂H₅Br', 'bromoetan', 'CCBr'],
    ['dibrometan', 'C₂H₄Br₂', '1,2-dibrometan', 'BrCCBr'], ['brombenzen', 'C₆H₅Br', 'brombenzen', 'BrC1=CC=CC=C1'], ['hlorbenzen', 'C₆H₅Cl', 'hlorbenzen', 'ClC1=CC=CC=C1'], ['nonan', 'C₉H₂₀', 'nonan', 'CCCCCCCCC'],
    ['2-metilpentan', 'C₆H₁₄', '2-metilpentan', 'CC(C)CCC'], ['2,3-dimetilbutan', 'C₆H₁₄', '2,3-dimetilbutan', 'CC(C)C(C)C'], ['3-metilpentan', 'C₆H₁₄', '3-metilpentan', 'CCC(C)CC'], ['2,2-dimetilbutan', 'C₆H₁₄', '2,2-dimetilbutan', 'CC(C)(C)CC'],
    ['pentan-1-ol', 'C₅H₁₁OH', 'pentan-1-ol', 'CCCCCO'], ['butan-2-ol', 'C₄H₉OH', 'butan-2-ol', 'CCC(C)O'], ['2-metilpropan-1-ol', 'C₄H₉OH', '2-metilpropan-1-ol', 'OCC(C)C'], ['2-metilpropan-2-ol', 'C₄H₉OH', '2-metilpropan-2-ol', 'OC(C)(C)C'],
    ['etil-butanoat', 'C₃H₇COOC₂H₅', 'etil-butanoat (miris ananasa)', 'CCCC(=O)OCC'], ['metil-butanoat', 'C₃H₇COOCH₃', 'metil-butanoat (miris jabuke)', 'CCCC(=O)OC'], ['izopentil-etanoat', 'CH₃COOC₅H₁₁', 'izopentil-etanoat (miris banane)', 'CC(=O)OCCC(C)C'], ['izobuten', 'C₄H₈', '2-metilpropen (izobuten)', 'CC(C)=C'], ['stiren', 'C₈H₈', 'stiren', 'C=CC1=CC=CC=C1'], ['hloreten', 'C₂H₃Cl', 'hloreten (vinil-hlorid)', 'C=CCl'],
    ['metanol', 'CH₃OH', 'metanol', 'CO'], ['etanol', 'C₂H₅OH', 'etanol', 'CCO'], ['propan-1-ol', 'C₃H₇OH', 'propan-1-ol', 'CCCO'], ['propan-2-ol', 'C₃H₇OH', 'propan-2-ol', 'CC(O)C'],
    ['butan-1-ol', 'C₄H₉OH', 'butan-1-ol', 'CCCCO'], ['glikol', 'C₂H₄(OH)₂', 'etan-1,2-diol (glikol)', 'OCCO'], ['glicerol', 'C₃H₅(OH)₃', 'propan-1,2,3-triol (glicerol)', 'OCC(O)CO'],
    ['metanal', 'HCHO', 'metanal (formaldehid)', 'C=O'], ['etanal', 'CH₃CHO', 'etanal (acetaldehid)', 'CC=O'], ['propanon', 'CH₃COCH₃', 'propanon (aceton)', 'CC(=O)C'],
    ['metanska-kiselina', 'HCOOH', 'metanska (mravlja) kiselina', 'OC=O'], ['etanska-kiselina', 'CH₃COOH', 'etanska (sirćetna) kiselina', 'CC(=O)O'],
    ['propanska-kiselina', 'C₂H₅COOH', 'propanska kiselina', 'CCC(=O)O'], ['butanska-kiselina', 'C₃H₇COOH', 'butanska kiselina', 'CCCC(=O)O'],
    ['palmitinska-kiselina', 'C₁₅H₃₁COOH', 'palmitinska kiselina', 'CCCCCCCCCCCCCCCC(=O)O'], ['stearinska-kiselina', 'C₁₇H₃₅COOH', 'stearinska (oktadekanska) kiselina', 'CCCCCCCCCCCCCCCCCC(=O)O'],
    ['oksalna-kiselina', '(COOH)₂', 'etandiojska (oksalna) kiselina', 'OC(=O)C(=O)O'], ['benzoeva-kiselina', 'C₆H₅COOH', 'benzoeva kiselina', 'OC(=O)C1=CC=CC=C1'],
    ['mlecna-kiselina', 'C₃H₆O₃', 'mlečna kiselina', 'CC(O)C(=O)O'],
    ['metil-etanoat', 'CH₃COOCH₃', 'metil-etanoat', 'CC(=O)OC'], ['etil-etanoat', 'CH₃COOC₂H₅', 'etil-etanoat (etil-acetat)', 'CC(=O)OCC'],
    ['metil-metanoat', 'HCOOCH₃', 'metil-metanoat', 'O=COC'], ['etil-metanoat', 'HCOOC₂H₅', 'etil-metanoat', 'O=COCC'], ['propil-etanoat', 'CH₃COOC₃H₇', 'propil-etanoat', 'CC(=O)OCCC'],
    ['glicin', 'NH₂CH₂COOH', 'glicin', 'NCC(=O)O'], ['alanin', 'C₃H₇NO₂', 'alanin', 'CC(N)C(=O)O'], ['serin', 'C₃H₇NO₃', 'serin', 'OCC(N)C(=O)O'], ['cistein', 'C₃H₇NO₂S', 'cistein', 'SCC(N)C(=O)O'],
    ['dipeptid', 'C₄H₈N₂O₃', 'glicil-glicin (dipeptid)', 'NCC(=O)NCC(=O)O'], ['tripeptid', 'C₆H₁₁N₃O₄', 'glicil-glicil-glicin (tripeptid)', 'NCC(=O)NCC(=O)NCC(=O)O'],
    ['trigliserid', 'C₃H₅(OCOR)₃', 'trigliserid (mast ili ulje)', 'CCCC(=O)OCC(OC(=O)CCC)COC(=O)CCC'],
    ['sapun', 'C₁₇H₃₅COO⁻', 'anjon stearinske kiseline (sapun)', 'CCCCCCCCCCCCCCCCCC(=O)[O-]'],
    ['freon', 'CCl₂F₂', 'dihlordifluormetan (freon)', 'ClC(Cl)(F)F'], ['retinol', 'C₂₀H₃₀O', 'retinol (vitamin A)', 'CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=CCO)C)C'], ['limunska-kiselina', 'C₆H₈O₇', 'limunska kiselina', 'OC(=O)CC(O)(C(=O)O)CC(=O)O'],
    ['urea', 'CO(NH₂)₂', 'urea', 'NC(=O)N'], ['etilamin', 'C₂H₅NH₂', 'etilamin', 'CCN'], ['vitamin-c-lanac', 'C₆H₈O₆', 'askorbinska kiselina', 'OCC(O)C1OC(=O)C(O)=C1O'],
    ['polietilen', '(–CH₂–CH₂–)ₙ', 'polietilen (odsečak lanca)', 'CCCCCCCCCCCC'],
    ['pvc', '(–CH₂–CHCl–)ₙ', 'polivinil-hlorid (odsečak lanca)', 'CC(Cl)CC(Cl)CC(Cl)C'],
    ['izopropanol', 'C₃H₇OH', 'propan-2-ol', 'CC(O)C'],
  ];
  for (const [ime, f, n, s] of ORG) def(ime, f, n, s);
  // šećeri: glukoza (piranoza, stolica), fruktoza (furanoza); disaharid i skrob nastaju spajanjem preko kiseonika
  def('glukoza', 'C₆H₁₂O₆', 'glukoza', 'OCC1OC(O)C(O)C(O)C1O');
  def('fruktoza', 'C₆H₁₂O₆', 'fruktoza', 'OCC1(O)OC(CO)C(O)C1O');
  // spaja dva molekula: atom a1 prvog i a2 drugog povezuju se novim kiseonikom (uz izbacivanje atoma izbaci1/izbaci2)
  function spojiPreko(A, B, i1, i2, pomak, izbaci1 = [], izbaci2 = []) {
    const atomi = [], veze = [];
    const mapA = {}, mapB = {};
    A.atomi.forEach((a, i) => { if (!izbaci1.includes(i)) { mapA[i] = atomi.length; atomi.push(a.slice()); } });
    B.atomi.forEach((a, i) => { if (!izbaci2.includes(i)) { mapB[i] = atomi.length; atomi.push([a[0], a[1] + pomak[0], a[2] + pomak[1], a[3] + pomak[2], ...(a[4] ? [a[4]] : [])]); } });
    A.veze.forEach(([i, j, r]) => { if (mapA[i] !== undefined && mapA[j] !== undefined) veze.push(r ? [mapA[i], mapA[j], r] : [mapA[i], mapA[j]]); });
    B.veze.forEach(([i, j, r]) => { if (mapB[i] !== undefined && mapB[j] !== undefined) veze.push(r ? [mapB[i], mapB[j], r] : [mapB[i], mapB[j]]); });
    const pa = atomi[mapA[i1]], pb = atomi[mapB[i2]];
    const sredina = [(pa[1] + pb[1]) / 2, (pa[2] + pb[2]) / 2 + 0.5, (pa[3] + pb[3]) / 2];
    atomi.push(['O', ...sredina]);
    veze.push([mapA[i1], atomi.length - 1], [atomi.length - 1, mapB[i2]]);
    return { atomi, veze };
  }
  // indeks atoma u definiciji: prvi ugljenik koji ima dva kiseonika (anomerni), vodonik njegove OH grupe…
  const nadjiGrupu = (d, uslov) => d.atomi.findIndex((a, i) => uslov(a, i, d));
  const sused = (d, i) => d.veze.filter(([x, y]) => x === i || y === i).map(([x, y]) => (x === i ? y : x));
  def('saharoza', 'C₁₂H₂₂O₁₁', 'saharoza (glukoza + fruktoza)', (() => {
    const G = dohvati('glukoza'), F = dohvati('fruktoza');
    // anomerni C glukoze: ugljenik vezan za dva kiseonika (ring O i OH); njegov OH: izbacujemo H, kiseonik ostaje kao most
    const c1 = nadjiGrupu(G, (a, i, d) => a[0] === 'C' && sused(d, i).filter((j) => d.atomi[j][0] === 'O').length === 2);
    const o1 = sused(G, c1).find((j) => G.atomi[j][0] === 'O' && sused(G, j).some((k) => G.atomi[k][0] === 'H'));
    const h1 = sused(G, o1).find((k) => G.atomi[k][0] === 'H');
    // anomerni C fruktoze: ugljenik vezan za dva kiseonika; izbacujemo njegov OH (kiseonik + vodonik)
    const c2 = nadjiGrupu(F, (a, i, d) => a[0] === 'C' && sused(d, i).filter((j) => d.atomi[j][0] === 'O').length === 2);
    const o2 = sused(F, c2).find((j) => F.atomi[j][0] === 'O' && sused(F, j).some((k) => F.atomi[k][0] === 'H'));
    const h2 = sused(F, o2).find((k) => F.atomi[k][0] === 'H');
    // položaji: fruktozu pomeramo tako da C2′ bude pored kiseonika o1
    const p1 = G.atomi[o1], p2 = F.atomi[c2];
    const pomak = [p1[1] + 1.4 - p2[1], p1[2] + 0.4 - p2[2], p1[3] + 0.6 - p2[3]];
    // glukoza zadržava sopstveni kiseonik o1 kao most; fruktoza gubi OH, a most se vezuje za c2
    const atomi = [], veze = [], mapG = {}, mapF = {};
    G.atomi.forEach((a, i) => { if (i !== h1) { mapG[i] = atomi.length; atomi.push(a.slice()); } });
    F.atomi.forEach((a, i) => { if (i !== o2 && i !== h2) { mapF[i] = atomi.length; atomi.push([a[0], a[1] + pomak[0], a[2] + pomak[1], a[3] + pomak[2]]); } });
    G.veze.forEach(([i, j]) => { if (mapG[i] !== undefined && mapG[j] !== undefined) veze.push([mapG[i], mapG[j]]); });
    F.veze.forEach(([i, j]) => { if (mapF[i] !== undefined && mapF[j] !== undefined) veze.push([mapF[i], mapF[j]]); });
    veze.push([mapG[o1], mapF[c2]]);
    return { atomi, veze };
  })());
  def('skrob', '(C₆H₁₀O₅)ₙ', 'skrob (lanac molekula glukoze)', (() => {
    const g = dohvati('glukoza'), atomi = [], veze = [];
    for (let k = 0; k < 3; k++) {
      const pom = atomi.length;
      g.atomi.forEach((x) => atomi.push([x[0], x[1] + (k - 1) * 6.2, x[2] + (k % 2 ? 0.6 : -0.6), x[3]]));
      g.veze.forEach(([i, j]) => veze.push([i + pom, j + pom]));
      if (k) { const m = atomi.length; atomi.push(['O', (k - 1) * 6.2 - 3.1, 0, 0]); veze.push([pom - g.atomi.length + 3, m], [m, pom + 3]); }
    }
    return { atomi, veze };
  })());
  // soli karboksilnih kiselina: anjon (SMILES) + katjon metala pored kiseonika
  const soKiseline = (smiles, metal, kol = 1) => {
    const d = izSmiles(smiles);
    const iO = d.atomi.findIndex((a) => a[4] && a[4].q === -1);
    const p = d.atomi[iO];
    for (let k = 0; k < kol; k++) d.atomi.push([metal, p[1] + 2.1 + k * 0.1, p[2] + 1.0 * k, p[3] + 0.3, { q: 1 }]);
    return d;
  };
  def('natrijum-etanoat', 'CH₃COONa', 'natrijum-etanoat (natrijum-acetat)', soKiseline('CC(=O)[O-]', 'Na'));
  def('natrijum-butanoat', 'C₃H₇COONa', 'natrijum-butanoat', soKiseline('CCCC(=O)[O-]', 'Na'));
  def('natrijum-stearat', 'C₁₇H₃₅COONa', 'natrijum-stearat (sapun)', soKiseline('CCCCCCCCCCCCCCCCCC(=O)[O-]', 'Na'));
  // so sa dva anjona (po jedan sa svake strane metala)
  const soDvaAnjona = (smiles, metal, q) => {
    const d = izSmiles(smiles), n = d.atomi.length;
    const iO = d.atomi.findIndex((a) => a[4] && a[4].q === -1), p = d.atomi[iO];
    const levo = d.atomi.map((a) => [a[0], a[1] - p[1] - 3.0, a[2] - p[2], a[3] - p[3], ...(a[4] ? [a[4]] : [])]);
    const desno = d.atomi.map((a) => [a[0], -(a[1] - p[1]) + 3.0, a[2] - p[2], -(a[3] - p[3]), ...(a[4] ? [a[4]] : [])]);
    const veze = [...d.veze, ...d.veze.map(([i, j, r]) => (r ? [i + n, j + n, r] : [i + n, j + n]))];
    return { atomi: [...levo, ...desno, [metal, 0, 0, 0, { q }]], veze };
  };
  def('kalcijum-etanoat', '(CH₃COO)₂Ca', 'kalcijum-etanoat', soDvaAnjona('CC(=O)[O-]', 'Ca', 2));
  def('magnezijum-etanoat', '(CH₃COO)₂Mg', 'magnezijum-etanoat', soDvaAnjona('CC(=O)[O-]', 'Mg', 2));
  def('natrijum-etoksid', 'C₂H₅ONa', 'natrijum-etoksid', soKiseline('CC[O-]', 'Na'));
  def('natrijum-propanoat', 'C₂H₅COONa', 'natrijum-propanoat', soKiseline('CCC(=O)[O-]', 'Na'));
  def('legura-mesing', 'Cu + Zn', 'mesing – legura bakra i cinka', (() => { const r = resetka('fcc', 'Cu', 1.6); r.atomi.forEach((a, i) => { if (i % 4 === 1) a[0] = 'Zn'; }); return r; })());
  def('legura-bronza', 'Cu + Sn', 'bronza – legura bakra i kalaja', (() => { const r = resetka('fcc', 'Cu', 1.6); r.atomi.forEach((a, i) => { if (i % 6 === 2) a[0] = 'Sn'; }); return r; })());
  def('legura-celik', 'Fe + C', 'čelik – gvožđe sa malo ugljenika', (() => { const r = resetka('bcc', 'Fe', 1.6); for (const p of [[0.8, 0, 0], [-0.8, 0, 0.8], [0, 0.8, -0.8], [0.8, -0.8, 0], [-0.8, 0.8, 0]]) r.atomi.push(['C', ...p]); return r; })());

  // SMILES → geometrija (samo kad je potrebno)
  function dohvati(ime) {
    const d = LIB[ime];
    if (!d) return null;
    if (d.atomi) return d;
    if (!kes[ime]) kes[ime] = izSmiles(d.s);
    return { ...d, ...kes[ime] };
  }
  const IMENA = Object.keys(LIB);

  // ───────────────────────── izvoz ─────────────────────────
  const API = { IMENA, LIB, dohvati, izSmiles, konfiguracija, SIMBOLI, KONFIG, BOJE_ELEMENATA };
  if (typeof window !== 'undefined') window.Molekuli = API;
  if (typeof module !== 'undefined') module.exports = { ...API, SCENE: [] };
})();
