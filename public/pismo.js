// Preslovljavanje teksta sa latinice na ćirilicu (za prikaz igre na ćirilici).
// Na latinici ostaje ono što se i u ćiriličnom tekstu piše latinicom:
//  – rimski brojevi (Petar I, Luj XIV, M = 1000), formule i promenljive (v = s/t, F = m · a, E = mc²),
//  – hemijske formule (H₂O, CO₂, NaCl), jedinice mere (70 km/h, 230 V, (Hz), −200 °C),
//  – krvne grupe (AB+, B negativna), strane reči (q, w, x, y), oznake sa ciframa (5G).
// Radi i u Node-u (alati/test), i u pregledaču (window.Pismo).
(function () {
  'use strict';
  const CIR = { a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', đ: 'ђ', e: 'е', ž: 'ж', z: 'з', i: 'и', j: 'ј', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п',
    r: 'р', s: 'с', t: 'т', ć: 'ћ', u: 'у', f: 'ф', h: 'х', c: 'ц', č: 'ч', š: 'ш' };
  const SLOVO = /[A-Za-zČĆŽŠĐčćžšđ]/;
  const TOKEN = /[A-Za-zČĆŽŠĐčćžšđ0-9]+/g;
  // SI jedinice i uobičajene oznake mera
  const JEDINICE = new Set(['m', 's', 'km', 'h', 'N', 'kg', 'cm', 'mm', 'dm', 'nm', 'J', 'kJ', 'Hz', 'kHz', 'MHz', 'g', 'mg', 'A', 'mA', 'Pa', 'kPa',
    'K', 'V', 'kV', 'W', 'kW', 'MW', 'Wh', 'kWh', 'eV', 'Sv', 'T', 'C', 'mol', 'mmol', 'L', 'l', 'ml', 'dB', 't', 'ha', 'Gy', 'Bq']);
  const OPERATORI = '=+−-·×÷/^<>()';
  const INDEKSI = /[\u00B2\u00B3\u00B9\u2070-\u209F\u1D2C-\u1D6A]/; // gornji i donji indeksi (², ₂, ᵇ, ⁿ)
  // međunarodne skraćenice koje se i u ćiriličnom tekstu pišu latinicom (ДНК, САД, ТВ… se preslovljavaju)
  const SKRACENICE = new Set(['BTS', 'ILM', 'IUCN', 'RGB', 'OASIS', 'GPS', 'GIS', 'LHC', 'BCG', 'HPV', 'MVP', 'CERN', 'ABO', 'AA', 'AAA', 'USB', 'WC', 'Rh', 'HIPPO', 'SOS',
    // TLA+ (kategorija „Eksperimenti“): ime jezika i alata
    'TLA', 'TLC']);
  // hemijski simboli (u tekstovima o elementima ostaju latinicom: Au, Fe, Pb, N, Ca…)
  const SIMBOLI = new Set(('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Ti Cr Mn Fe Co Ni Cu Zn As Se Br Kr Ag Sn Sb I Xe ' +
    'Ba Pt Au Hg Pb Bi Po Rn Ra U Pu W Ur Sr Cs').split(' '));
  const SRPSKE_RECI = new Set(['ne', 'na', 'ni', 'po', 'se', 'li', 'i', 'u', 'as']);
  // Strane reči i imena koja se i u ćiriličnom tekstu pišu izvorno (igre, brendovi, naslovi, latinski nazivi vrsta,
  // italijanske muzičke oznake). Ostaju latinicom i sa padežnim nastavkom (Minecraftu, Cupheada, Netherita).
  // Prepisana imena (Hari Poter, Dart Vejder, Piksar) se preslovljavaju normalno.
  // Ovde ne smeju reči koje postoje i u srpskom (love, star, let, me, on, king…).
  const STRANE = new Set((
    // video-igre
    'minecraft cuphead mugman chalice fortnite terraria creeper enderman ender end nether netherit redstone villagers notch ' +
    'pac bulbasaur nintendo jumpman fandango life counter doom undertale elden baldur gate tomb raider uncharted redemption ' +
    'corrupted duke invaders sports football rocket silksong megalovania black hedgehog sight funcom projekt valve larian ' +
    'drum bass hal ibm bucks minecoins cake lie imdb ' +
    // izvorni nazivi stranih filmova u zagradi: „Pakleni šund“ (Pulp Fiction)
    'pulp forrest gump philadelphia inception interstellar casablanca noon gladiator avengers endgame iron gisaengchung citizen ' +
    'oppenheimer tale buono brutto cattivo pugno dollari toride akunin shichinin samurai sjunde inseglet bella times ' +
    'coraline encanto moana transformers goosebumps jurassic ice petit jones schindler graffiti grease flash superman tonari ' +
    'kamikakushi ugoku shiro haka hime kimetsu hen ratatouille monsters inside coco aladdin tangled pinocchio fantasia shrek ' +
    'finding encounters beetlejuice titanic lincoln ahsoka strider wall ' +
    // brendovi, kompanije, studiji
    'google discord microsoft apple ghibli pictures animation studios industrial light magic illumination amblin reese pieces ' +
    // filmovi, serije, pesme, likovi (izvorni nazivi)
    'stranger things thing finger hand hunters huntr kpop blackpink golden girls frozen trek bourne fight club hook ' +
    'eleven elder kettle dice ms miss cup coffee delicious course riddle dumbledore running hill that take it africa ' +
    'motion capture phone home run gun thriller dangerous bad abba europe bells jingle mamma nessun dorma clair ' +
    'submarine bohemian little nevermore nišville ' +
    // pojedinačni strani izrazi u zagradama i navodima
    'cell ground hubble pollution poaching passerines appeasement nuclear disarmament straddle dripping uffizi plumber ' +
    'plumbum godt leg vous dirai maman lune della ' +
    // latinski: nazivi vrsta i izreke
    'homo sapiens erectus habilis neanderthalensis floresiensis lactobacillus bulgaricus penicillium turritopsis dohrnii naegleria palingenia longicauda ' +
    'felis catus panthera leo tigris gorilla pongo australopithecus escherichia coli coccinella septempunctata drosophila melanogaster ' +
    'pinus longaeva vacca adolescere tricolor ' +
    'centum mille passus septem omnis cellula carpe diem mens sana corpore sano perpetuum mobile ' +
    // muzičke oznake (italijanski)
    'allegro adagio crescendo decrescendo fortissimo pianissimo ff pp mf mp ' +
    // engleske službene reči (ne postoje u srpskom)
    'the of and with from is am are up off all').split(/\s+/).filter(Boolean));
  const NASTAVCI = /^(a|u|om|e|i|ima|ov|ova|ove|ovi|ovo|ovog|ovom|ovu|ovih|ovim|ovoj|ovim)$/;
  // samo kad su sami u navodu: „love“ (tenis) – inače je to srpska reč (love)
  const STRANE_U_NAVODU = new Set(['love']);
  function strana(tok) {
    if (/[qwxyQWXY]/.test(tok) && /[a-z]/.test(tok)) return true; // ne XIV, HUNTR/X
    const m = tok.toLowerCase();
    if (STRANE.has(m)) return true;
    for (let k = m.length - 1; k >= 4; k--) if (NASTAVCI.test(m.slice(k)) && STRANE.has(m.slice(0, k))) return true;
    return false;
  }
  // deo teksta (ceo tekst, navod, zagrada) koji je u celini strani naziv: sve reči su strane ili pišu velikim slovom,
  // a bar jedna je strana – „Ace of Base“, „(Elder Kettle)“, „(E.T. phone home)“; u takvom nazivu malim slovom smeju
  // i strane rečce – (Back to the Future), (La vita è bella), (Kimi no Na wa), (Hachi: A Dog's Tale)
  const RECCE_NAZIVA = new Set(['to', 'no', 'il', 'la', 'le', 'un', 'di', 'd', 's', 'de', 'du', 'del', 'der', 'von', 'van', 'san', 'vita', 'in', 'a', 'ue', 'ka']);
  function straniNaziv(deo) {
    const reci = deo.match(/[A-Za-zČĆŽŠĐčćžšđ]+/g);
    if (!reci || !reci.some(strana)) return false;
    return reci.every((r) => strana(r) || /^[A-ZČĆŽŠĐ]/.test(r) || RECCE_NAZIVA.has(r));
  }
  const RIMSKI = /^(?=[MDCLXVI])M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

  function recUCir(t) {
    const m = t.toLowerCase();
    const bezNj = /^(konjug|konjunk|injek|vanjezi|tanjug)/.test(m), bezDz = /^(nad|pod)ž/.test(m);
    let out = '';
    for (let i = 0; i < t.length; i++) {
      const c = m[i], d = m[i + 1], vel = t[i] !== c;
      let r;
      if (c === 'l' && d === 'j') { r = 'љ'; i++; }
      else if (c === 'n' && d === 'j' && !bezNj) { r = 'њ'; i++; }
      else if (c === 'd' && d === 'ž' && !bezDz) { r = 'џ'; i++; }
      else r = CIR[c] ?? t[i];
      out += vel ? r.toUpperCase() : r;
    }
    return out;
  }

  // da li token treba da ostane na latinici, s obzirom na okolinu u tekstu
  function latinicom(tok, i, tekst) {
    if (!SLOVO.test(tok)) return true;                                       // samo cifre
    if (/[qwxyQWXY]/.test(tok)) return true;                                 // strane reči
    if (/\d/.test(tok)) return true;                                         // 5G, mp3
    if (/[a-zčćžšđ][A-ZČĆŽŠĐ]/.test(tok) && tok !== 'BiH') return true;      // NaCl, iPhone, pH
    if (strana(tok)) return true;                                            // Minecraft, Homo sapiens, allegro
    const pre = tekst.slice(0, i), posle = tekst.slice(i + tok.length);
    if (/^[A-Z]{1,3}$/.test(tok) && /^-\d/.test(posle)) return true;         // oznake robota: BB-8, IG-88
    const preZnak = (pre.match(/(\S)\s?$/) || [])[1] || '';                  // znak neposredno pre (najviše jedan razmak)
    const posleZnak = (posle.match(/^\s?(\S)/) || [])[1] || '';
    const odmahPre = pre.slice(-1), odmahPosle = posle.slice(0, 1);
    const preRec = (pre.match(/([A-Za-zČĆŽŠĐčćžšđ]+)[\s,]*$/) || [])[1] || '';
    const posleRec = (posle.match(/^[\s,]*([A-Za-zČĆŽŠĐčćžšđ]+)/) || [])[1] || '';
    // hemijske formule i stepeni: H₂O, CO₂, mc², m³
    if (INDEKSI.test(odmahPosle) || INDEKSI.test(odmahPre)) return true;
    // °C, °F
    if (odmahPre === '°') return true;
    // promenljive u formulama: jedno slovo uz operator (v = s/t, F = m · a, n·(n−3))
    if (tok.length === 1) {
      // „i“, „u“, „a“, „s“… su i srpske reči: uz zagradu ili crticu ostaju ćirilica – „(i Nemačka)“
      // „e-cigareta“, „d-mol“ – crtica unutar reči nije operator
      const crticaUReci = (z, susedno) => (z === '-' || z === '−') && SLOVO.test(susedno);
      const operator = (z, susedno) => {
        if (!z || crticaUReci(z, susedno)) return false;
        if (z === '=') return true;
        // „t + j daje ć“ (gramatika) nije matematika – operator važi tek kad u tekstu ima i „=“ ili cifara
        if (!/[=\d]/.test(tekst) && !(/→/.test(tekst) && /^[A-Z]$/.test(tok))) return false;
        return (/^[iuaoskv]$/i.test(tok) ? '+·×÷^<>/' : OPERATORI).includes(z);
      };
      if (operator(preZnak, pre.slice(-2, -1)) || operator(posleZnak, posle.slice(1, 2))) return true;
    }
    // kraće oznake uz znak jednakosti (Ek = …, M = 1000)
    if (tok.length <= 3 && (preZnak === '=' || posleZnak === '=' || ((preZnak === '→' || posleZnak === '→') && /[A-Z\d]/.test(tok)))) return true;
    // formula u zagradi u hemijskom tekstu: „Ugljen-monoksid (CO)“
    if (preZnak === '(' && posleZnak === ')' && /^(?:[A-Z][a-z]?\d*)+$/.test(tok) && (tok.match(/[A-Z][a-z]?/g) || []).every((x) => SIMBOLI.has(x))
      && /(oksid|kiselin|gas|hemij|molekul|atom|element|jedinjenj|baz|so\b)/i.test(tekst)) return true;
    // jedinice: posle broja, uz razlomačku crtu, ili same u zagradi – „(Hz)“
    if (JEDINICE.has(tok) && (/\d\s?$/.test(pre) || odmahPre === '/' || odmahPosle === '/' || (preZnak === '(' && posleZnak === ')'))) return true;
    // rimski brojevi: XIV, II, CM; jedno slovo samo posle imena (Petar I, Džordž V), ne posle „vitamin“
    if (tok === tok.toUpperCase() && RIMSKI.test(tok)) {
      if (tok.length >= 2) return true;
      if (/^[A-ZČĆŽŠĐ][a-zčćžšđ]+$/.test(preRec) && /[a-zčćžšđ]\s$/.test(pre) && !/^vitamin/i.test(preRec)) return true;
    }
    if (SKRACENICE.has(tok)) return true;
    // hemijski simboli u tekstu o elementima
    if (SIMBOLI.has(tok) && /(simbol|hemijsk|latinsk|element|dolazi od|metal)/i.test(tekst)) {
      const recSimbola = /^(dolazi|je)$/.test(posleRec.toLowerCase()) && /^\s*(dolazi|je od)/.test(posle);
      if (!SRPSKE_RECI.has(tok.toLowerCase())) return true;
      if (recSimbola || /(ijum|on|kl|ik|um|ozon|gas)$/.test(preRec)) return true;
    }
    const jednoVeliko = tok.length === 1 && /[A-Z]/.test(tok);
    // slovo kao oznaka: „S“, simbol O, H dolazi od…, prvo P u HIPPO
    if (jednoVeliko) {
      if (/[„"“']$/.test(pre) && /^[“”"']/.test(posle)) return true;
      if (/^(simbol|oznak|slov)/i.test(preRec) || /^(dolazi|označava|znači|potiče)/i.test(posleRec)) return true;
      if (new RegExp('\\b[A-Z]*' + tok + '[A-Z]*\\b').test(tekst.replace(new RegExp('\\b' + tok + '\\b', 'g'), '')) && /\b[A-Z]{3,}\b/.test(tekst)) return true;
      // note i žice (C D E F G A H) u tekstu o muzici
      if (/[A-H]/.test(tok) && /(ton|not[aeiu]|žic|akord|dur\b|mol\b|skal)/i.test(tekst)) return true;
      // Morzeova azbuka (slova T, S, V…)
      if (/morz/i.test(tekst)) return true;
      if (/^od$/.test(posleRec) && /^\s*od\s*„/.test(posle)) return true;
      // rimske cifre u tekstu o rimskim brojevima
      if (/[IVXLCDM]/.test(tok) && /rimsk/i.test(tekst)) return true;
    }
    // hemijske grupe: OH grupa, NH grupa
    if (tok === tok.toUpperCase() && tok.length <= 3 && /^grup/i.test(posleRec)) return true;
    // krvne grupe
    if (/^(A|B|AB|C)$/.test(tok) && /(krvn|antigen|\bABO\b)/i.test(tekst)) return true;
    if (/^(A|B|AB)$/.test(tok) && (/^(grup|antigen)/i.test(preRec) || /^(pozitiv|negativ|antigen|ni)$/i.test(posleRec) || /^(pozitiv|negativ)/i.test(posleRec) || /^[+−-]/.test(odmahPosle))) return true;
    return false;
  }

  function uCirilicu(tekst) {
    tekst = String(tekst);
    if (!SLOVO.test(tekst)) return tekst;
    const t = tekst.trim();
    // ceo tekst je jedna oznaka (odgovor „L“, „H“, „XIV“, „AB“) – ostavi
    if (/^[A-Z]{1,4}$/.test(t) && (t.length === 1 || RIMSKI.test(t))) return tekst;
    if (/^([ČĆŽŠĐ]|Dž|Lj|Nj)$/.test(t)) return tekst; // slovo latinice kao odgovor
    if (/^(A|B|AB|0)[+−-]?$/.test(t)) return tekst; // krvna grupa kao odgovor
    // nizovi pojedinačnih velikih slova (tastatura Q W E R T Y…, note C D E F G A H) ostaju latinicom
    const nizovi = [];
    // strane reči pod navodnicima posle „od latinskog…“, „engleske reči…“: „centum“, „mille“
    for (const m of tekst.matchAll(/(?:latinsk|grčk|engles|nemačk|francusk|italijansk|špansk|tursk|japansk|rimsk|persijsk)[a-zčćžšđ]*\s+(?:(?:reči|naziva|naziv|izraza|izraz|korena|izreka|rečenica|imena|novca)\s+)?„([^“”]+)[“”]|\b[A-Z]\s+(?:dolazi\s+)?od\s+„([^“”]+)[“”]/g)) {
      const deo = m[1] ?? m[2];
      if (/[čćžšđČĆŽŠĐ]/.test(deo)) continue; // „šah mat“, „računar“ – već prilagođeno srpskom
      nizovi.push([m.index + m[0].length - deo.length - 1, m.index + m[0].length]);
    }
    for (const m of tekst.matchAll(/(?:\b[A-Z]\b[\s,]+){4,}\b[A-Z]\b/g)) nizovi.push([m.index, m.index + m[0].length]);
    // navodnici sa stranim tekstom („How Far I'll Go“, „ROY G BIV“) – ceo navod latinicom
    // isto i za navod sa stranom reči („Running Up That Hill“, „Carpe diem“), i zagradu koja je ceo strani naziv („(King Dice)“)
    // ceo tekst (bez navoda i zagrada) je strani naziv: „Ace of Base“, „Homo sapiens (moderan čovek)“
    for (const m of tekst.matchAll(/\b[A-Z]&[A-Z]('s)?\b/g)) nizovi.push([m.index, m.index + m[0].length]); // M&M's, R&B
    const vanZagrada = tekst.replace(/„[^“”]*[“”]|\([^()]*\)/g, (z) => ' '.repeat(z.length));
    if (straniNaziv(vanZagrada)) for (const m of vanZagrada.matchAll(TOKEN)) nizovi.push([m.index, m.index + m[0].length]);
    for (const m of tekst.matchAll(/„([^“”]+)[“”]/g)) {
      if (/[qwxyQWXY]/.test(m[1]) || (m[1].match(TOKEN) || []).some(strana) || STRANE_U_NAVODU.has(m[1])) nizovi.push([m.index, m.index + m[0].length]);
    }
    for (const m of tekst.matchAll(/\(([^()]+)\)/g)) if (straniNaziv(m[1])) nizovi.push([m.index, m.index + m[0].length]);
    // višečlani strani nazivi u rečenici: uz stranu reč ostaju latinicom i susedne reči sa velikim slovom
    // („KPop Demon Hunters“, „Studio Ghibli“, „Pac-Man“), osim na početku rečenice („U Minecraftu…“)
    const tokeni = [...tekst.matchAll(TOKEN)];
    const pocetak = (k) => k === 0 || /[.!?:]\s*[„"]?$/.test(tekst.slice(tokeni[k - 1].index + tokeni[k - 1][0].length, tokeni[k].index));
    const spojeni = (k) => /^(\s|-|\s&\s|')$/.test(tekst.slice(tokeni[k].index + tokeni[k][0].length, tokeni[k + 1].index));
    const velikim = (k) => /^[A-ZČĆŽŠĐ][A-Za-zČĆŽŠĐčćžšđ]+$/.test(tokeni[k][0]) && !pocetak(k);
    tokeni.forEach((m, k) => {
      if (!strana(m[0]) || !/^[A-ZČĆŽŠĐ]/.test(m[0])) return;
      let a = k, b = k;
      while (a > 0 && spojeni(a - 1) && velikim(a - 1)) a--;
      while (b < tokeni.length - 1 && spojeni(b) && velikim(b + 1)) b++;
      if (a < k || b > k) nizovi.push([tokeni[a].index, tokeni[b].index + tokeni[b][0].length]);
    });
    const uNizu = (i) => nizovi.some(([a, b]) => i >= a && i < b);
    return tekst.replace(TOKEN, (tok, i) => (uNizu(i) || latinicom(tok, i, tekst) ? tok : recUCir(tok)));
  }

  const api = { uCirilicu, recUCir, latinicom };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.Pismo = api;
})();
