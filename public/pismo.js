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
  const TOKEN = /[A-Za-zČĆŽŠĐčćžšđ0-9\u00C0-\u024F]+/g; // i slova sa stranim znacima: Hergé, Paraná, Astérix
  // strana slova sa kvačicama/akcentima (é, ñ, ü…) – reč ostaje cela latinicom (ne „Паранá“)
  const STRANI_ZNAK = /[\u00C0-\u024F]/;
  const SRPSKI_ZNAK = /[ČĆŽŠĐčćžšđ]/g;
  // naglasci u gramatici (rúka, kùća, grȁd, sȗnce): samoglasnik ćirilicom + znak za naglasak, ne latinično slovo usred reči
  const NAGLASCI = { 'á': ['а', '\u0301'], 'à': ['а', '\u0300'], 'ȁ': ['а', '\u030F'], 'ȃ': ['а', '\u0311'], 'é': ['е', '\u0301'], 'è': ['е', '\u0300'], 'ȅ': ['е', '\u030F'], 'ȇ': ['е', '\u0311'],
    'í': ['и', '\u0301'], 'ì': ['и', '\u0300'], 'ȉ': ['и', '\u030F'], 'ȋ': ['и', '\u0311'], 'ó': ['о', '\u0301'], 'ò': ['о', '\u0300'], 'ȍ': ['о', '\u030F'], 'ȏ': ['о', '\u0311'],
    'ú': ['у', '\u0301'], 'ù': ['у', '\u0300'], 'ȕ': ['у', '\u030F'], 'ȗ': ['у', '\u0311'], 'ŕ': ['р', '\u0301'], 'ȑ': ['р', '\u030F'], 'ȓ': ['р', '\u0311'] };
  const NAGLASAK_TEKST = /(akcen|naglas|uzlazn|silazn)/i;
  // SI jedinice i uobičajene oznake mera
  const JEDINICE = new Set(['m', 's', 'km', 'h', 'N', 'kg', 'cm', 'mm', 'dm', 'nm', 'J', 'kJ', 'Hz', 'kHz', 'MHz', 'g', 'mg', 'A', 'mA', 'Pa', 'kPa',
    'K', 'V', 'kV', 'W', 'kW', 'MW', 'Wh', 'kWh', 'eV', 'Sv', 'T', 'C', 'mol', 'mmol', 'L', 'l', 'ml', 'dB', 't', 'ha', 'Gy', 'Bq']);
  const OPERATORI = '=+−-·×÷/^<>()';
  const INDEKSI = /[\u00B2\u00B3\u00B9\u2070-\u209F\u1D2C-\u1D6A]/; // gornji i donji indeksi (², ₂, ᵇ, ⁿ)
  // međunarodne skraćenice koje se i u ćiriličnom tekstu pišu latinicom (ДНК, САД, ТВ… se preslovljavaju)
  const SKRACENICE = new Set(['BTS', 'ILM', 'IUCN', 'RGB', 'OASIS', 'GPS', 'GIS', 'LHC', 'BCG', 'HPV', 'MVP', 'CERN', 'ABO', 'AA', 'AAA', 'USB', 'WC', 'Rh', 'HIPPO', 'SOS',
    // TLA+ (kategorija „Eksperimenti“): ime jezika i alata
    'TLA', 'TLC',
    // skraćenice NBA timova (lenta)
    'GSW', 'CLE']);
  // hemijski simboli (u tekstovima o elementima ostaju latinicom: Au, Fe, Pb, N, Ca…)
  const SIMBOLI = new Set(('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Ti Cr Mn Fe Co Ni Cu Zn As Se Br Kr Ag Sn Sb I Xe ' +
    'Ba Pt Au Hg Pb Bi Po Rn Ra U Pu W Ur Sr Cs').split(' '));
  // tekst o hemiji: tek tada se KOH, HCl, COOH, OH… (simboli elemenata bez indeksa) smatraju formulama, a ne rečima
  const HEM_KONTEKST = /(kiselin|hidroksid|oksid|\bjon(?:a|i|u|e|om|ima)?\b|jedinjenj|molekul|reakcij|\bbaz[aeiu]|alkohol|funkcional|supstanc|\bhemij|rastvor|\batom|karboks|ugljovodonik|\bestr|alkan|alkin|alken|aldehid|katjon|anjon|valenc|elektrolit|formul|\bgrup|→)/i;
  const SRPSKE_RECI = new Set(['ne', 'na', 'ni', 'po', 'se', 'li', 'i', 'u', 'as']);
  // Strane reči i imena koja se i u ćiriličnom tekstu pišu izvorno (igre, brendovi, naslovi, latinski nazivi vrsta,
  // italijanske muzičke oznake). Ostaju latinicom i sa padežnim nastavkom (Minecraftu, Cupheada, Netherita).
  // Prepisana imena (Hari Poter, Dart Vejder, Piksar) se preslovljavaju normalno.
  // Ovde ne smeju reči koje postoje i u srpskom (love, star, let, me, on, king…).
  const STRANE = new Set((
    // video-igre
    'minecraft cuphead mugman chalice fortnite gta terraria creeper enderman ender end nether netherit redstone villagers notch ' +
    'pac bulbasaur nintendo jumpman fandango life counter doom undertale elden baldur gate tomb raider uncharted redemption ' +
    'corrupted duke invaders sports football rocket silksong megalovania black hedgehog sight funcom projekt valve larian ' +
    'drum bass hal ibm bucks minecoins cake lie imdb ' +
    'supercell riot epic gem zero helldivers adopt brookhaven pocketpair science lucia colt primo heist unreal creative steam battle ' +
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
    'aeterni patris unam sanctam rerum novarum humanae vitae flatus vocis ' +
    'centum mille passus septem omnis cellula carpe diem mens sana corpore sano perpetuum mobile ' +
    'crescit collaborare fermentum carbo morus vitro nostrum urbe condita res publica libertas veritas victoria principia ' +
    'zoon botane endling hippo ambulance help ecce mono monuments men das undbild ' +
    // poreklo gramatičkih termina (Gramatika 7): lat. potentia, imperare…, grč. sýntagma, nem. Fußnote
    'potentia imperare congruentia particula copula reportare plagiarius citare aisthesis sýntagma onomatopoiía fußnote fuß ' +
    // sport: nazivi timova i takmičenja, nadimci („Heat“, „Final Four“, „Adriatic Basketball Association“)
    'heat suns joker djoker lakes adriatic basketball association four allez gallus ' +
    // igre, serije, filmovi, likovi i ličnosti u izvornom obliku (dopuna)
    'pubg rockstar electronic activision ubisoft sega mojang rovio theft need speed free fire scarface bellic johnson michael borderland patrick krabs amphibia friends seinfeld narcos dark sherlock luther broadchurch ketchum brock oak dragon vegeta piccolo garfield spider batman minnie donald pluto luigi toad peach rosalina zuckerberg tajiri north east south habitat hunting insects population precipitation parasites overharvesting moesia kampf nitrogen ' +
    // muzičke oznake (italijanski)
    'allegro adagio crescendo decrescendo fortissimo pianissimo ff pp mf mp ' +
    // engleske službene reči (ne postoje u srpskom)
    'the of and with from is am are up off all').split(/\s+/).filter(Boolean));
  const NASTAVCI = /^(a|u|om|e|i|ima|ov|ova|ove|ovi|ovo|ovog|ovom|ovu|ovih|ovim|ovoj|ovim)$/;
  // samo kad su sami u navodu: „love“ (tenis) – inače je to srpska reč (love)
  const STRANE_U_NAVODU = new Set(['love', 'presto']); // presto (muzička oznaka) – inače престо
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
  const RECCE_NAZIVA = new Set(['to', 'no', 'il', 'la', 'le', 'un', 'di', 'd', 's', 'de', 'du', 'del', 'der', 'von', 'van', 'san', 'vita', 'in', 'a', 'ue', 'ka', 'll', 'for']);
  function straniNaziv(deo) {
    const reci = deo.match(/[A-Za-zČĆŽŠĐčćžšđ]+/g);
    if (!reci || !reci.some(strana)) return false;
    return reci.every((r) => strana(r) || /^[A-ZČĆŽŠĐ]/.test(r) || RECCE_NAZIVA.has(r));
  }
  const RIMSKI = /^(?=[MDCLXVI])M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

  function recUCir(t) {
    const m = t.toLowerCase();
    const bezNj = /^(konjug|konjunk|injek|vanjezi|tanjug|anjon)/.test(m), bezDz = /^(nad|pod)ž/.test(m);
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
    // hemijske formule bez indeksa: HCl, KOH, NaOH, CaO, COOH, OH (dva ili više simbola elemenata uzastopno)
    if (HEM_KONTEKST.test(tekst) && /^(?:[A-Z][a-z]?\d*)+$/.test(tok) && tok !== 'BiH') { const sim = tok.match(/[A-Z][a-z]?/g); if (sim.length >= 2 && sim.every((x) => SIMBOLI.has(x))) return true; }
    // simbol ispred zagrade sa indeksom: Ca(OH)₂, Ba(NO₃)₂, Al₂(SO₄)₃
    if (SIMBOLI.has(tok) && /^\([A-Za-z0-9\u2080-\u2089]+\)[\u2080-\u2089\d]/.test(posle)) return true;
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
      // „okular 15× i objektiv 100×“: × posle broja je „puta“, a „i“ je veznik
      const putaPre = preZnak === '×' && /\d×\s?$/.test(pre);
      if ((!putaPre && operator(preZnak, pre.slice(-2, -1))) || operator(posleZnak, posle.slice(1, 2))) return true;
      // oznaka veličine uz jedinicu u zagradi (u grafiku i tabeli): „v (m/s)“, „t (h)“, „a (m/s²)“
      const zagrada = posle.match(/^\s?\(([^()]+)\)/);
      if (zagrada && /^[A-Za-z]+(?:[\/·][A-Za-z]+)*[²³]?$/.test(zagrada[1].replace(/\s/g, '')) && zagrada[1].split(/[\/·²³\s]+/).filter(Boolean).every((j) => JEDINICE.has(j))) return true;
    }
    // kraće oznake uz znak jednakosti (Ek = …, M = 1000)
    if (tok.length <= 3 && (preZnak === '=' || posleZnak === '=' || ((preZnak === '→' || posleZnak === '→') && /[A-Z\d]/.test(tok)))) return true;
    // formula u zagradi u hemijskom tekstu: „Ugljen-monoksid (CO)“
    if (preZnak === '(' && posleZnak === ')' && /^(?:[A-Z][a-z]?\d*)+$/.test(tok) && (tok.match(/[A-Z][a-z]?/g) || []).every((x) => SIMBOLI.has(x))
      && /(oksid|kiselin|gas|hemij|molekul|atom|element|jedinjenj|baz|so\b)/i.test(tekst)) return true;
    // jedinice: posle broja, uz razlomačku crtu, ili same u zagradi – „(Hz)“
    // jedinica na početku čvora teksta posle $…$: „$25$ m.“
    if (JEDINICE.has(tok) && /^\s+$/.test(pre) && /^\s*([.,;:!?)]|$)/.test(posle)) return true;
    if (JEDINICE.has(tok) && (/[\d?]\s?$/.test(pre) || /\d\s(hiljad[aeu]|milion[aui]?|milijard[aei]|bilion[aui]?)\s$/i.test(pre) || odmahPre === '/' || odmahPosle === '/' || (preZnak === '(' && posleZnak === ')'))) return true;
    // rimski brojevi: XIV, II, CM; jedno slovo samo posle imena (Petar I, Džordž V), ne posle „vitamin“
    if (tok === tok.toUpperCase() && RIMSKI.test(tok)) {
      if (tok.length >= 2) return true;
      if (/^[A-ZČĆŽŠĐ][a-zčćžšđ]+$/.test(preRec) && /[a-zčćžšđ]\s$/.test(pre) && !/^vitamin/i.test(preRec)) return true;
      // vek: „u V veku“, „od V do XV veka“
      if (/^\s?(?:(?:do|i|ili|–|-)\s?[MDCLXVI]+\s?)?vek/.test(posle)) return true;
      // „futur I“ (gramatika): vreme, ne ime
      if (/^futur/i.test(preRec) && /[a-zčćžšđ]\s$/.test(pre)) return true;
      // verzija uz skraćenicu: GTA V (prethodna reč je sva velikim slovima)
      if (/^[A-ZČĆŽŠĐ]{2,}$/.test(preRec) && /[A-ZČĆŽŠĐ]\s$/.test(pre)) return true;
    }
    if (SKRACENICE.has(tok)) return true;
    // hemijski simboli u tekstu o elementima
    // (ne deo imena: Al-Horezmi)
    if (SIMBOLI.has(tok) && !/^-[A-ZČĆŽŠĐ]/.test(posle) && /(simbol|hemijsk|latinsk|element|dolazi od|metal)/i.test(tekst)) {
      const recSimbola = /^(dolazi|je)$/.test(posleRec.toLowerCase()) && /^\s*(dolazi|je od)/.test(posle);
      if (!SRPSKE_RECI.has(tok.toLowerCase()) || /^simbol/i.test(preRec)) return true;
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

  // ceo tekst je kratka hemijska formula: sve reči su nizovi simbola elemenata (Mg, OH, COOH), ukupno bar dva simbola, a uz
  // to indeks/zagrada/strelica/malo slovo ili poznata formula (KOH, COOH…) – „SSS“, „UN“, „Ra“, „Ne“ ostaju običan tekst
  const FORMULE_VELIKA = new Set(['KOH', 'OH', 'COOH', 'CHO', 'CO', 'NO', 'HF', 'HI', 'NH', 'CH', 'CS', 'NI']);
  function jeFormula(t) {
    if (!/^[A-Za-z0-9\u2080-\u2089\u2070-\u209F\u00B2\u00B3\u00B9()·\s+→⇌↑↓−–\-=.,/]+$/.test(t)) return false;
    const reci = t.match(/[A-Za-z]+/g) || [];
    if (!reci.length || !reci.every((w) => /^(?:[A-Z][a-z]?)+$/.test(w) && w.match(/[A-Z][a-z]?/g).every((x) => SIMBOLI.has(x)))) return false;
    const jedinice = reci.reduce((n, w) => n + w.match(/[A-Z][a-z]?/g).length, 0);
    if (jedinice < 2) return false;
    if (/[0-9\u2080-\u2089\u2070-\u209F\u00B2\u00B3\u00B9()→⇌↑↓]|[a-z]/.test(t)) return true;
    return reci.every((w) => FORMULE_VELIKA.has(w));
  }

  function uCirilicu(tekst) {
    tekst = String(tekst);
    if (!SLOVO.test(tekst)) return tekst;
    const t = tekst.trim();
    // ceo tekst je jedna oznaka (odgovor „L“, „H“, „XIV“, „AB“) – ostavi
    // (ali ne „U “ ispred $…$ – čvor teksta „U $3$ sata“: to je predlog, ne oznaka)
    // ceo tekst je hemijska formula („Mg(OH)₂“, „–COOH“, „2H₂ + O₂ → 2H₂O“) – ostaje latinicom
    if (jeFormula(t)) return tekst;
    if (/^[A-Z]{1,4}$/.test(t) && (t.length === 1 || RIMSKI.test(t)) && !(/^[AIUOSKV]$/.test(t) && tekst !== t)) return tekst;
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
    const naglasci = NAGLASAK_TEKST.test(tekst);
    return tekst.replace(TOKEN, (tok, i) => {
      if (uNizu(i)) return tok;
      if (STRANI_ZNAK.test(tok.replace(SRPSKI_ZNAK, ''))) {
        const sviNaglasci = naglasci && [...tok.toLowerCase().replace(SRPSKI_ZNAK, '')].every((c) => !STRANI_ZNAK.test(c) || NAGLASCI[c]);
        if (!sviNaglasci) return tok;
        return [...tok].map((c) => { const n = NAGLASCI[c.toLowerCase()]; return n ? (c === c.toLowerCase() ? n[0] : n[0].toUpperCase()) + n[1] : recUCir(c); }).join('');
      }
      return latinicom(tok, i, tekst) ? tok : recUCir(tok);
    });
  }

  const api = { uCirilicu, recUCir, latinicom };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.Pismo = api;
})();
