// Bonus igra „Gde je u telu?“ (uz biologiju): na crtežu tela (organi ili kostur) ili ćelije (životinjska, biljna)
// igrač redom dodirne tri zadata dela – organ, žlezdu, kost ili organelu. Poeni zavise od udaljenosti dodira od
// tog dela (0 = dodir je na samom delu): pogodak donosi pun iznos i bonus, a promašaj sve manje što je dalje.
// Telo je okrenuto prema igraču, kao na slici u udžbeniku: levi organi čoveka (srce, slezina) su na DESNOJ strani crteža.
// Isti kôd koristi server (izbor delova, bodovanje – lib/soba.js) i telefon (crtež, dodir) – oblik delova je
// zajednički, pa se obe strane uvek slažu oko udaljenosti.
(function (koren, f) {
  const A = f();
  if (typeof module === 'object' && module.exports) module.exports = A;
  else koren.Anatomija = A;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const PO_RUNDI = 3;
  const MAX = 300; // poena po delu
  const POGODAK = 100; // bonus za dodir na samom delu

  // ───────── oblici: e = elipsa, k = kapsula (duž sa debljinom), p = prsten (ivica elipse) ─────────
  const e = (x, y, rx, ry = rx, rot = 0) => ({ k: 'e', x, y, rx, ry, rot });
  const k = (x1, y1, x2, y2, w) => ({ k: 'k', x1, y1, x2, y2, w });
  const p = (x, y, rx, ry, w) => ({ k: 'p', x, y, rx, ry, w });
  // ogledalo levo–desno (telo je simetrično oko x = 100)
  const og = (o) => (o.k === 'k' ? { ...o, x1: 200 - o.x1, x2: 200 - o.x2 } : { ...o, x: 200 - o.x, rot: -o.rot });
  const par = (...o) => [...o, ...o.map(og)];

  function udaljenost(o, x, y) {
    if (o.k === 'k') {
      const dx = o.x2 - o.x1, dy = o.y2 - o.y1;
      const t = Math.max(0, Math.min(1, ((x - o.x1) * dx + (y - o.y1) * dy) / (dx * dx + dy * dy || 1)));
      return Math.max(0, Math.hypot(x - o.x1 - t * dx, y - o.y1 - t * dy) - o.w);
    }
    const r = (-(o.rot || 0) * Math.PI) / 180;
    const ux = (x - o.x) * Math.cos(r) - (y - o.y) * Math.sin(r);
    const uy = (x - o.x) * Math.sin(r) + (y - o.y) * Math.cos(r);
    const q = Math.hypot(ux / o.rx, uy / o.ry); // 1 = na ivici elipse
    const dc = Math.hypot(ux, uy);
    if (o.k === 'p') return q === 0 ? Math.min(o.rx, o.ry) : Math.max(0, Math.abs(dc - dc / q) - o.w);
    return q <= 1 ? 0 : dc - dc / q;
  }

  // ───────── scene ─────────
  // svaki deo: id, ime, opis (pokazuje se na otkrivanju), oblik (za dodir i crtež), boja, tacka (gde stoji broj),
  // tezak: true – sitan ili skriven deo (u rundi najviše jedan)
  const SCENE = {
    organi: {
      naziv: 'Unutrašnji organi', ikona: '🫀', w: 200, h: 420, dobar: 26, telo: true,
      delovi: [
        { id: 'mozak', ime: 'mozak', boja: '#f3a6b8', oblik: [e(100, 31, 18, 15)], opis: 'Mozak troši oko petine energije celog tela, iako je težak samo oko 1,4 kg.' },
        { id: 'hipofiza', ime: 'hipofiza', boja: '#a55eea', oblik: [e(100, 49, 3.5, 3)], tezak: true, opis: 'Hipofiza je velika kao zrno graška, a upravlja radom drugih žlezda – zato je zovu „glavna žlezda“.' },
        { id: 'stitna', ime: 'štitna žlezda', boja: '#a55eea', oblik: [e(95.5, 76, 4, 5), e(104.5, 76, 4, 5)], opis: 'Štitna žlezda ima oblik leptira i hormonima podešava koliko brzo telo troši energiju.' },
        { id: 'dusnik', ime: 'dušnik', boja: '#dfe6e9', oblik: [k(100, 64, 100, 102, 3.5)], opis: 'Dušnik drže otvorenim hrskavičavi prstenovi u obliku slova C.' },
        { id: 'pluca', ime: 'pluća', boja: '#ff9fb0', oblik: [e(81, 122, 14, 27), e(119, 122, 14, 27)], opis: 'Levo plućno krilo je manje od desnog, jer deo mesta zauzima srce; desno ima tri režnja, a levo dva.' },
        { id: 'srce', ime: 'srce', boja: '#e84a5f', oblik: [e(105, 138, 10, 11.5, -25)], opis: 'Srce je malo levo od sredine grudi i otkuca oko 100.000 puta dnevno.' },
        { id: 'dijafragma', ime: 'dijafragma', boja: '#e17055', oblik: [k(68, 156, 84, 150, 2.5), k(84, 150, 116, 150, 2.5), k(116, 150, 132, 156, 2.5)], tezak: true, opis: 'Dijafragma je mišić ispod pluća: kad se spusti, pluća se šire i udišemo. Štucanje je njen nagli grč.' },
        { id: 'jetra', ime: 'jetra', boja: '#a0413c', oblik: [e(86, 163, 19, 10, 8)], opis: 'Jetra je najveća žlezda u telu i jedini organ koji može ponovo da izraste kad se deo ukloni.' },
        { id: 'zucna', ime: 'žučna kesa', boja: '#6ab04c', oblik: [e(90, 175, 3.5, 5)], tezak: true, opis: 'Žučna kesa čuva žuč iz jetre, koja pomaže da se svare masti.' },
        { id: 'zeludac', ime: 'želudac', boja: '#f7a072', oblik: [e(117, 166, 12, 8.5, -20)], opis: 'Želudačna kiselina je toliko jaka da nagriza i neke metale – zid želuca od nje štiti sluz.' },
        { id: 'slezina', ime: 'slezina', boja: '#8e3a59', oblik: [e(133, 163, 5, 8, 15)], tezak: true, opis: 'Slezina je sa leve strane tela i razgrađuje stara crvena krvna zrnca.' },
        { id: 'gusteraca', ime: 'gušterača', boja: '#f6d365', oblik: [k(98, 182, 124, 176, 3.5)], opis: 'Gušterača pravi sokove za varenje, ali i insulin, koji reguliše šećer u krvi.' },
        { id: 'nadbubrezne', ime: 'nadbubrežne žlezde', boja: '#a55eea', oblik: par(e(78, 187, 4, 3)), tezak: true, opis: 'Nadbubrežne žlezde luče adrenalin – zbog njega srce brže kuca kad se uplašimo.' },
        { id: 'bubrezi', ime: 'bubrezi', boja: '#b33939', oblik: par(e(78, 200, 5.5, 10)), opis: 'Bubrezi svakog dana prečiste oko 180 litara krvi i od viška vode i otpada prave mokraću.' },
        { id: 'debelo', ime: 'debelo crevo', boja: '#d4a373', oblik: [k(85, 234, 85, 207, 4.5), k(85, 207, 115, 207, 4.5), k(115, 207, 115, 234, 4.5)], opis: 'U debelom crevu žive milijarde korisnih bakterija, a ono iz ostataka hrane upija vodu.' },
        { id: 'tanko', ime: 'tanko crevo', boja: '#f5b7b1', oblik: [e(100, 224, 11, 10)], opis: 'Tanko crevo je dugo oko 6 metara – u njemu se hrana vari do kraja i upija u krv.' },
        { id: 'slepo', ime: 'slepo crevo', boja: '#c08552', oblik: [k(85, 238, 88, 246, 2)], tezak: true, opis: 'Slepo crevo (crvuljak) je dole desno u stomaku; kad se upali, mora hitno da se operiše.' },
        { id: 'besika', ime: 'mokraćna bešika', boja: '#f9e79f', oblik: [e(100, 244, 6.5, 5.5)], opis: 'Mokraćna bešika može da primi oko pola litre tečnosti.' },
      ],
    },
    kostur: {
      naziv: 'Kostur', ikona: '🦴', w: 200, h: 420, dobar: 26, telo: true,
      delovi: [
        { id: 'lobanja', ime: 'lobanja', oblik: [e(100, 33, 19, 23)], opis: 'Lobanja odraslog čoveka ima 22 kosti, a sve osim donje vilice su srasle.' },
        { id: 'vilica', ime: 'donja vilica', oblik: [k(85, 50, 92, 61, 3), k(92, 61, 108, 61, 3), k(108, 61, 115, 50, 3)], opis: 'Donja vilica je jedina pokretna kost lobanje.' },
        { id: 'kljucna', ime: 'ključna kost', oblik: par(k(97, 85, 70, 81, 2.8)), opis: 'Ključna kost se najčešće slomi od svih kostiju, obično pri padu na ispruženu ruku.' },
        { id: 'grudna', ime: 'grudna kost', oblik: [k(100, 91, 100, 140, 4)], opis: 'Grudna kost je u sredini grudi i za nju su hrskavicom vezana rebra.' },
        { id: 'rebra', ime: 'rebra', oblik: [0, 1, 2, 3, 4, 5].flatMap((i) => par(k(95, 96 + i * 8, 73 + i * 0.5, 101 + i * 9, 2.5))), opis: 'Čovek ima 12 pari rebara; ona čuvaju srce i pluća kao kavez.' },
        { id: 'kicma', ime: 'kičma', oblik: [k(100, 64, 100, 82, 4), k(100, 150, 100, 226, 5)], opis: 'Kičma ima 33–34 pršljena, a njen oblik slova S ublažava udarce pri hodu.' },
        { id: 'karlica', ime: 'karlica', oblik: [...par(k(72, 218, 88, 244, 5.5)), k(91, 247, 109, 247, 3)], opis: 'Karlica nosi težinu gornjeg dela tela i štiti organe u donjem delu stomaka.' },
        { id: 'ramena', ime: 'ramena kost', oblik: par(k(60, 94, 50, 166, 4)), opis: 'Ramena kost je u nadlaktici – spaja rame i lakat.' },
        { id: 'palcana', ime: 'palčana kost', oblik: par(k(43, 175, 36, 236, 2.3)), tezak: true, opis: 'Palčana kost je u podlaktici sa strane palca; okreće se oko lakatne kosti kad okrećemo dlan.' },
        { id: 'lakatna', ime: 'lakatna kost', oblik: par(k(52, 175, 46, 238, 2.3)), tezak: true, opis: 'Lakatna kost je u podlaktici sa strane malog prsta, a njen vrh je lakat.' },
        { id: 'saka', ime: 'kosti šake', oblik: par(e(38, 259, 7, 14, 8)), opis: 'Šaka ima 27 kostiju – skoro četvrtina svih kostiju tela je u šakama.' },
        { id: 'butna', ime: 'butna kost', oblik: par(k(80, 252, 84, 318, 4.5)), opis: 'Butna kost je najduža i najjača kost u telu – otprilike četvrtina visine čoveka.' },
        { id: 'casica', ime: 'čašica kolena', oblik: par(e(85, 326, 4.5)), opis: 'Čašica kolena se kod beba tek okoštava – rađamo se sa hrskavicom umesto nje.' },
        { id: 'golenjaca', ime: 'golenjača', oblik: par(k(88, 334, 88, 392, 3.5)), opis: 'Golenjača je deblja kost potkolenice – njenu prednju ivicu osetimo pod kožom ispod kolena.' },
        { id: 'lisnjaca', ime: 'lisnjača', oblik: par(k(78, 336, 81, 390, 2)), tezak: true, opis: 'Lisnjača je tanka kost sa spoljne strane potkolenice; skoro ne nosi težinu tela.' },
        { id: 'stopalo', ime: 'kosti stopala', oblik: par(e(83, 404, 10, 5)), opis: 'Stopalo ima 26 kostiju, a petna kost je najveća među njima.' },
      ],
    },
    celija: {
      naziv: 'Životinjska ćelija', ikona: '🔬', w: 320, h: 240, dobar: 30,
      delovi: [
        { id: 'membrana', ime: 'ćelijska membrana', boja: '#74b9ff', oblik: [p(160, 120, 148, 108, 3)], opis: 'Membrana je tanja od hiljaditog dela milimetra, a odlučuje šta ulazi u ćeliju i šta izlazi.' },
        { id: 'jedro', ime: 'jedro', boja: '#6c5ce7', oblik: [e(150, 118, 34, 30)], opis: 'Jedro čuva DNK – „uputstvo“ po kome ćelija radi i deli se.' },
        { id: 'jedarce', ime: 'jedarce', boja: '#341f97', oblik: [e(158, 110, 9, 8)], tezak: true, opis: 'U jedarcetu se prave ribozomi.' },
        { id: 'mitohondrija', ime: 'mitohondrija', boja: '#fd9644', oblik: [e(70, 82, 17, 8, 25), e(252, 168, 17, 8, -30), e(88, 182, 15, 7, -12), e(258, 82, 14, 7, 40)], opis: 'Mitohondrije su „elektrane“ ćelije: u njima se iz hrane oslobađa energija (ćelijsko disanje).' },
        { id: 'ribozomi', ime: 'ribozomi', boja: '#2d3436', oblik: [[218, 112], [224, 126], [216, 140], [230, 100], [120, 62], [196, 196], [62, 128], [276, 124], [128, 196]].map(([x, y]) => e(x, y, 2.5)), tezak: true, opis: 'Ribozomi su sićušne „fabrike“ belančevina; ima ih na milione u jednoj ćeliji.' },
        { id: 'er', ime: 'endoplazmatični retikulum', boja: '#55efc4', oblik: [k(192, 92, 210, 102, 3), k(196, 104, 212, 120, 3), k(196, 120, 210, 140, 3), k(192, 136, 204, 152, 3)], tezak: true, opis: 'Endoplazmatični retikulum je mreža kanala oko jedra kojom se kroz ćeliju prenose materije.' },
        { id: 'goldzi', ime: 'Goldžijev aparat', boja: '#fab1a0', oblik: [e(96, 132, 15, 11)], tezak: true, opis: 'Goldžijev aparat „pakuje“ belančevine u kesice i šalje ih tamo gde su potrebne.' },
        { id: 'lizozom', ime: 'lizozomi', boja: '#00b894', oblik: [e(222, 54, 6), e(206, 196, 6), e(114, 42, 5)], opis: 'Lizozomi razgrađuju istrošene delove ćelije – to je „reciklaža“ ćelije.' },
        { id: 'centrozom', ime: 'centrozom', boja: '#ffeaa7', oblik: [e(236, 138, 8, 6)], tezak: true, opis: 'Centrozom ima dve centriole i pomaže da se hromozomi pravilno raspodele pri deobi ćelije.' },
      ],
    },
    biljna: {
      naziv: 'Biljna ćelija', ikona: '🌿', w: 320, h: 240, dobar: 30,
      delovi: [
        { id: 'zid', ime: 'ćelijski zid', boja: '#b8e994', oblik: [k(14, 13, 306, 13, 4), k(14, 227, 306, 227, 4), k(13, 14, 13, 226, 4), k(307, 14, 307, 226, 4)], opis: 'Ćelijski zid od celuloze daje biljnoj ćeliji čvrst oblik – od njega se pravi i papir.' },
        { id: 'membrana', ime: 'ćelijska membrana', boja: '#74b9ff', oblik: [k(24, 24, 296, 24, 2), k(24, 216, 296, 216, 2), k(24, 24, 24, 216, 2), k(296, 24, 296, 216, 2)], tezak: true, opis: 'I biljna ćelija ima membranu – nalazi se odmah ispod ćelijskog zida.' },
        { id: 'vakuola', ime: 'vakuola', boja: '#81ecec', oblik: [e(186, 128, 90, 62)], opis: 'Velika vakuola je puna ćelijskog soka; kad se isprazni, biljka vene.' },
        { id: 'jedro', ime: 'jedro', boja: '#6c5ce7', oblik: [e(62, 70, 23, 21)], opis: 'U biljnoj ćeliji jedro je obično potisnuto uz ivicu, jer sredinu zauzima vakuola.' },
        { id: 'hloroplast', ime: 'hloroplasti', boja: '#27ae60', oblik: [e(58, 172, 16, 8, 20), e(122, 204, 16, 8, -5), e(250, 42, 16, 8, -10), e(274, 152, 8, 16, 10), e(150, 40, 16, 8, 12)], opis: 'U hloroplastima se odvija fotosinteza; zeleni su zbog hlorofila.' },
        { id: 'mitohondrija', ime: 'mitohondrija', boja: '#fd9644', oblik: [e(52, 124, 12, 6, 70), e(282, 204, 12, 6, -20), e(206, 42, 11, 5, 5)], tezak: true, opis: 'I biljke imaju mitohondrije: hranu prave fotosintezom danju, a u mitohondrijama je danju i noću razlažu da dobiju energiju.' },
      ],
    },
  };
  const TEZINE_SCENA = { organi: 35, kostur: 35, celija: 15, biljna: 15 };

  const promesaj = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // scena i tri dela (najviše jedan „težak“), redom kojim se traže; bilo = već traženi ('scena:id')
  function napravi(bilo = []) {
    let r = Math.random() * Object.values(TEZINE_SCENA).reduce((a, b) => a + b, 0);
    let scena = 'organi';
    for (const [id, t] of Object.entries(TEZINE_SCENA)) if ((r -= t) < 0) { scena = id; break; }
    const S = SCENE[scena];
    const vec = new Set(bilo);
    const sveze = S.delovi.filter((d) => !vec.has(scena + ':' + d.id));
    const red = [...promesaj(sveze), ...promesaj(S.delovi.filter((d) => !sveze.includes(d)))];
    const izbor = [];
    let teskih = 0;
    for (const d of red) {
      if (izbor.length >= PO_RUNDI) break;
      if (d.tezak && teskih) continue;
      if (d.tezak) teskih++;
      izbor.push(d.id);
    }
    return { scena, delovi: izbor };
  }

  const deo = (scena, id) => SCENE[scena]?.delovi.find((d) => d.id === id) || null;
  const centar = (d) => {
    const o = d.oblik[0];
    return o.k === 'k' ? [(o.x1 + o.x2) / 2, (o.y1 + o.y2) / 2] : o.k === 'p' ? [o.x, o.y - o.ry] : [o.x, o.y];
  };

  // poeni za dodir (x, y) na traženi deo
  function bodovi(scena, id, x, y) {
    const S = SCENE[scena], D = deo(scena, id);
    if (!S || !D || !Number.isFinite(x) || !Number.isFinite(y)) return { d: Infinity, poeni: 0, bonus: 0, oznaka: '' };
    const d = Math.min(...D.oblik.map((o) => udaljenost(o, x, y)));
    const udeo = Math.max(0, 1 - d / (2 * S.dobar));
    const poeni = Math.round((MAX * udeo) / 10) * 10;
    const pogodak = d === 0;
    return { d, poeni, bonus: pogodak ? POGODAK : 0, oznaka: pogodak ? 'Pogodak!' : d <= S.dobar / 3 ? 'Za dlaku!' : d <= S.dobar ? 'Blizu!' : '' };
  }
  // udaljenost kao procenat visine crteža (za prikaz: „promašaj 4%“)
  const procenat = (scena, d) => Math.round((100 * d) / SCENE[scena].h);

  // ───────── crtanje (samo klijent) ─────────
  const f1 = (v) => (+v).toFixed(1);
  function oblikSVG(o, stil) {
    if (o.k === 'k') return `<line x1="${f1(o.x1)}" y1="${f1(o.y1)}" x2="${f1(o.x2)}" y2="${f1(o.y2)}" stroke-width="${f1(o.w * 2)}" stroke-linecap="round" ${stil.linija}/>`;
    const rot = o.rot ? ` transform="rotate(${o.rot} ${f1(o.x)} ${f1(o.y)})"` : '';
    if (o.k === 'p') return `<ellipse cx="${f1(o.x)}" cy="${f1(o.y)}" rx="${o.rx}" ry="${o.ry}" fill="none" stroke-width="${o.w * 2}" ${stil.linija}${rot}/>`;
    return `<ellipse cx="${f1(o.x)}" cy="${f1(o.y)}" rx="${o.rx}" ry="${o.ry}" ${stil.puno}${rot}/>`;
  }

  // obris tela (glatka kriva kroz tačke leve polovine i njihov odraz)
  const POLOVINA = [[91, 60], [91, 76], [72, 82], [58, 88], [50, 104], [46, 140], [42, 170], [38, 206], [35, 238], [30, 254], [29, 270], [36, 283], [44, 281], [47, 262], [49, 240], [53, 200], [56, 160], [60, 130], [66, 114], [68, 150], [70, 186], [64, 222], [64, 252], [68, 300], [72, 326], [72, 360], [78, 392], [70, 403], [73, 412], [96, 412], [94, 392], [92, 350], [90, 326], [94, 290], [100, 256]];
  function glatko(t) {
    const n = t.length;
    let d = `M${t[0][0]},${t[0][1]}`;
    for (let i = 0; i < n; i++) {
      const [p0, p1, p2, p3] = [t[(i - 1 + n) % n], t[i], t[(i + 1) % n], t[(i + 2) % n]];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${f1(c1[0])},${f1(c1[1])} ${f1(c2[0])},${f1(c2[1])} ${p2[0]},${p2[1]}`;
    }
    return d + 'Z';
  }
  const OBRIS = glatko([...POLOVINA, ...POLOVINA.slice(0, -1).reverse().map(([x, y]) => [200 - x, y])]);

  // ukrasi koji nisu delovi za traženje (uz kostur: kičma iza grudne kosti, oči; uz organe: vijuge mozga, prstenovi dušnika)
  function ukrasi(scena) {
    if (scena === 'kostur') {
      let s = '';
      for (let y = 66; y < 228; y += 7) s += `<rect x="96" y="${y}" width="8" height="5" rx="1.5" class="an-kost an-iza"/>`;
      return s;
    }
    if (scena === 'celija') return '<ellipse cx="160" cy="120" rx="146" ry="106" class="an-citoplazma"/>';
    if (scena === 'biljna') return '<rect x="10" y="10" width="300" height="220" rx="14" class="an-zid-poz"/><rect x="22" y="22" width="276" height="196" rx="8" class="an-citoplazma"/>';
    return '';
  }
  // ukrasi preko delova (oči lobanje, vijuge mozga, prstenovi dušnika, vijuge creva, krstača na karlici)
  function ukrasiPreko(scena) {
    if (scena === 'kostur') {
      let s = '<ellipse cx="92" cy="32" rx="5" ry="6" class="an-rupa"/><ellipse cx="108" cy="32" rx="5" ry="6" class="an-rupa"/><path d="M100,38 l-3,7 h6z" class="an-rupa"/>';
      for (let y = 154; y < 226; y += 9) s += `<line x1="95" y1="${y}" x2="105" y2="${y}" class="an-vijuga"/>`;
      return s;
    }
    if (scena === 'organi') {
      let s = '<path d="M86,26 q6,-6 12,0 q6,6 12,0 M84,35 q8,-5 16,0 q8,5 16,0" class="an-vijuga"/>';
      for (let y = 68; y < 100; y += 5) s += `<line x1="97" y1="${y}" x2="103" y2="${y}" class="an-vijuga"/>`;
      s += '<path d="M92,218 q4,-6 8,0 t8,0 M90,226 q5,-6 10,0 t10,0" class="an-vijuga"/>';
      return s;
    }
    return '';
  }
  // detalji unutar delova (kriste mitohondrija, tilakoidi hloroplasta, kese Goldžija)
  function detalji(scena, d) {
    let s = '';
    for (const o of d.oblik) {
      if (o.k !== 'e') continue;
      const rot = o.rot ? ` transform="rotate(${o.rot} ${f1(o.x)} ${f1(o.y)})"` : '';
      if (d.id === 'mitohondrija') s += `<path d="M${f1(o.x - o.rx * 0.7)},${f1(o.y)} q${f1(o.rx * 0.2)},${f1(-o.ry * 0.8)} ${f1(o.rx * 0.35)},0 t${f1(o.rx * 0.35)},0 t${f1(o.rx * 0.35)},0 t${f1(o.rx * 0.35)},0" class="an-detalj"${rot}/>`;
      if (d.id === 'hloroplast') for (const dx of [-0.45, 0, 0.45]) s += `<rect x="${f1(o.x + dx * o.rx - 2.5)}" y="${f1(o.y - o.ry * 0.5)}" width="5" height="${f1(o.ry)}" rx="1" class="an-detalj"${rot}/>`;
      if (d.id === 'goldzi') for (let i = 0; i < 4; i++) s += `<path d="M${f1(o.x - o.rx + i * 2)},${f1(o.y - o.ry + i * 6)} q${f1(o.rx - i * 2)},-6 ${f1(2 * (o.rx - i * 2))},0" class="an-detalj"/>`;
      if (d.id === 'jedro' && scena !== 'kostur') s += `<ellipse cx="${o.x}" cy="${o.y}" rx="${o.rx}" ry="${o.ry}" class="an-opna"/>`;
    }
    return s;
  }

  // SVG scene: svaki deo je <g data-deo="id"> (otkrivanje ga ističe); bez natpisa – imena bi odala odgovor
  function svg(scena) {
    const S = SCENE[scena];
    const kost = scena === 'kostur';
    let s = `<svg viewBox="0 0 ${S.w} ${S.h}" class="an-svg an-${scena}" xmlns="http://www.w3.org/2000/svg">`;
    if (S.telo) s += `<ellipse cx="100" cy="36" rx="23" ry="28" class="an-obris"/><path d="${OBRIS}" class="an-obris"/>`;
    s += ukrasi(scena);
    // veliki delovi prvo, da sitni (žlezde, jedarce) ostanu navrhu
    const red = [...S.delovi].sort((a, b) => (b.oblik[0].rx || 0) * (b.oblik[0].ry || 0) - (a.oblik[0].rx || 0) * (a.oblik[0].ry || 0));
    for (const d of red) {
      const boja = kost ? '#efe6cf' : d.boja;
      const stil = { puno: `fill="${boja}" class="an-puno"`, linija: `stroke="${boja}" class="an-linija"` };
      s += `<g data-deo="${d.id}" class="an-deo">${d.oblik.map((o) => oblikSVG(o, stil)).join('')}${detalji(scena, d)}</g>`;
    }
    return s + ukrasiPreko(scena) + '</svg>';
  }

  // ivica istaknutog dela na otkrivanju (iste oblike crta deblje, zlatno)
  function istakni(scena, id) {
    const D = deo(scena, id);
    if (!D) return '';
    const stil = { puno: 'class="an-ist"', linija: 'class="an-ist-l"' };
    return `<g class="an-istaknuto">${D.oblik.map((o) => (o.k === 'k' ? `<line x1="${f1(o.x1)}" y1="${f1(o.y1)}" x2="${f1(o.x2)}" y2="${f1(o.y2)}" stroke-width="${f1(o.w * 2 + 3)}" stroke-linecap="round" class="an-ist-l"/>` : oblikSVG({ ...o, w: (o.w || 0) + 1.5 }, stil))).join('')}</g>`;
  }

  return { SCENE, PO_RUNDI, MAX, POGODAK, napravi, deo, centar, bodovi, udaljenost, procenat, svg, istakni };
});
