// Podaci i dijagrami, verovatnoća, kombinatorika, logika
module.exports = ({ T, Q, U, S, A, F, G, proveri, r, stubici, pr, polja, kuglica }) => {
  T('Podaci, verovatnoća i logika');
  const O = { O: [0, 0] }, bez = { bezImena: ['O'] };

  Q(1, 'Stubičasti dijagram pokazuje omiljeni sport učenika jednog odeljenja. Koliko je učenika ukupno odgovorilo?', ['20', '8', '18', '24'],
    'Saberu se visine svih stubića: 8 + 6 + 4 + 2 = 20. Pre čitanja dijagrama uvek pogledaj koliko vredi jedan podeok na uspravnoj osi – ovde 2.',
    'dijagram', { mediji: stubici([['~Fudbal', 8], ['~Košarka', 6], ['~Odbojka', 4], ['~Tenis', 2]], { korakY: 2, sirina: 9 }) });

  {
    const p = [[1, 1], [2, 3], [3, 5], [4, 7], [5, 4]];
    const n = p.reduce((a, x) => a + x[1], 0), z = p.reduce((a, x) => a + x[0] * x[1], 0);
    proveri(n === 20 && z / n === 3.5, 'srednja ocena');
    Q(3, 'Dijagram pokazuje koliko je učenika dobilo koju ocenu na kontrolnom. Kolika je srednja ocena?', ['3,5', '3', '4', '3,75'],
      'Učenika je 1 + 3 + 5 + 7 + 4 = 20, a zbir svih ocena 1 + 6 + 15 + 28 + 20 = 70. Prosek je 70 : 20 = 3,5. Nije dovoljno uzeti prosek brojeva 1–5 (to bi bilo 3) – svaka ocena se broji onoliko puta koliko je učenika dobilo.',
      'prosek', { mediji: stubici(p.map(([o, v]) => [String(o), v]), { korakY: 1, sirina: 8 }) });
  }

  Q(1, 'Šta je mod (najčešća vrednost) niza 2, 5, 3, 5, 7, 5, 2?', ['5', '2', '7', '4'],
    'Petica se pojavljuje tri puta, više od ostalih. Mod je jedina srednja vrednost koja ima smisla i za podatke koji nisu brojevi – na primer, najčešća boja očiju u odeljenju.',
    'mod');

  {
    const dani = ['~pon', '~uto', '~sre', '~čet', '~pet', '~sub', '~ned'];
    const t = [12, 14, 13, 19, 18, 16, 20];
    const skok = t.slice(1).map((x, i) => x - t[i]);
    proveri(Math.max(...skok) === 6 && skok.indexOf(6) === 2, 'najveći skok');
    const e = [{ mreza: [0, 7, 0, 5], brojevi: 0 }];
    dani.forEach((d, i) => e.push({ tx: d, at: [i + 0.5, -0.5] }));
    for (let j = 1; j <= 5; j++) e.push({ tx: String(10 + j * 2), at: [-0.6, j] });
    e.push({ lin: t.map((v, i) => [i + 0.5, (v - 10) / 2]), b: 1 });
    Q(2, 'Grafik pokazuje najvišu dnevnu temperaturu tokom jedne nedelje. Između koja dva dana je temperatura najviše porasla?', ['Između srede i četvrtka', 'Između subote i nedelje', 'Između ponedeljka i utorka', 'Između četvrtka i petka'],
      'Najveći rast je tamo gde linija ide najstrmije nagore: od 13 °C u sredu do 19 °C u četvrtak, tj. za 6 °C. Linijski grafik je zgodan baš za praćenje promena tokom vremena.',
      'grafik', { mediji: G(O, e, { ...bez, velicina: 300 }) });
  }

  {
    const e = [pr(-0.8, -0.8, 5.6, 3.6, { b: 5, prazno: 1 })];
    const boje = [3, 0, 2, 0, 3, 0, 2, 0, 3, 0];
    boje.forEach((b, i) => e.push(kuglica((i % 5) * 1, Math.floor(i / 5) * 1.6 + ((i % 2) * 0.3), b)));
    Q(1, 'U kesi su 3 žute, 5 plavih i 2 zelene kuglice. Kolika je verovatnoća da se naslepo izvuče žuta?', ['${3|10}$', '${1|3}$', '${3|7}$', '${1|10}$'],
      'Povoljnih ishoda (žutih kuglica) je 3, a svih mogućih 10: verovatnoća je ${3|10}$ = 30%. Za plavu bi bila ${5|10} = {1|2}$ – plave su najverovatnije.',
      'verovatnoća', { mediji: G(O, e, { ...bez, velicina: 220 }) });
  }

  {
    const v = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
    let br = 0;
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === 7) br++;
    proveri(br === 6, 'zbir 7');
    Q(2, 'Bacaju se dve kockice i sabiraju brojevi. Koji zbir pada NAJČEŠĆE?', ['7', '12', '6', 'Svi jednako često'],
      'Zbir 7 se dobija na 6 načina (1+6, 2+5, 3+4, 4+3, 5+2, 6+1), a 12 samo na jedan (6+6). Zato je u igri „Katan“ broj 7 poseban, a polja sa 6 i 8 najvrednija.',
      'kockica', { medijiOdgovora: stubici(v.map((x, i) => [String(i + 2), x]), { korakY: 1, sirina: 11, istakni: [5] }) });
  }

  Q(3, 'Bacaju se dve kockice. Kolika je verovatnoća da obe pokažu šesticu?', ['${1|36}$', '${1|12}$', '${1|6}$', '${2|6}$'],
    'Mogućih ishoda je 6 · 6 = 36, a samo jedan je (6, 6). Verovatnoće nezavisnih događaja se množe: ${1|6} · {1|6} = {1|36}$.',
    'šestica');

  Q(1, 'Na koliko načina troje dece može da stane u red?', ['6', '3', '9', '8'],
    'Na prvo mesto može bilo ko od 3, na drugo neko od preostale 2, a na treće onaj koji je ostao: 3 · 2 · 1 = 6. Za 10 dece bilo bi čak 3.628.800 rasporeda!',
    'raspored', { mediji: { vrsta: 'emodzi', tekst: '👧 👦 🧒' } });

  Q(1, 'Mila ima 3 majice i 4 para pantalona. Na koliko načina može da se obuče?', ['12', '7', '9', '16'],
    'Uz svaku od 3 majice idu 4 pantalone: 3 · 4 = 12 kombinacija. Ovo je pravilo proizvoda – osnova cele kombinatorike.',
    'kombinacija', { mediji: { vrsta: 'emodzi', tekst: '👕👕👕 × 👖👖👖👖' } });

  Q(1, 'Katanac ima šifru od tri cifre (0–9, cifre mogu da se ponavljaju). Koliko ima različitih šifara?', ['1.000', '30', '720', '999'],
    'Svaka od 3 cifre ima 10 mogućnosti: 10 · 10 · 10 = 1.000 (od 000 do 999). Kad se cifre ne bi ponavljale, bilo bi 10 · 9 · 8 = 720.',
    'šifra');

  proveri((8 * 7) / 2 === 28, 'turnir');
  Q(3, 'Na turniru 8 ekipa igra „svako sa svakim“ po jednu utakmicu. Koliko utakmica se odigra?', ['28', '56', '64', '16'],
    'Svaka ekipa igra 7 utakmica: 8 · 7 = 56, ali je tako svaka utakmica brojana dvaput (i za domaćina i za gosta): 56 : 2 = 28.',
    'turnir');

  Q(3, 'Na kup takmičenju (poraženi ispada) učestvuju 32 ekipe. Koliko utakmica treba odigrati do pobednika?', ['31', '16', '32', '63'],
    'Trik bez računanja: svaka utakmica izbaci tačno jednu ekipu, a ispasti mora 31 ekipa. Proveri: 16 + 8 + 4 + 2 + 1 = 31.',
    'pobednik');

  Q(2, 'Neki psi su crni. Svi crni psi laju. Šta SIGURNO važi?', ['Neki psi laju', 'Svi psi laju', 'Sve što laje je crno', 'Nijedan beli pas ne laje'],
    'Crni psi postoje i svi laju, pa sigurno postoji pas koji laje. Ali o psima drugih boja ne znamo ništa – možda i oni laju, a možda ne. Ovakvo zaključivanje proučava logika.',
    'logika');

  {
    const t = { P: [-1.6, 0], R: [1.6, 0] };
    proveri(18 + 15 - (30 - 5) === 8, 'Venov dijagram');
    Q(3, 'U odeljenju je 30 učenika: 18 trenira fudbal, 15 košarku, a 5 ne trenira ništa. Koliko učenika trenira OBA sporta?', ['8', '3', '13', '5'],
      'Bar jedan sport trenira 30 − 5 = 25 učenika. Kad se sabere 18 + 15 = 33, oni koji treniraju oba su brojani dvaput: 33 − 25 = 8. Samo fudbal trenira 10, a samo košarku 7.',
      'skup', {
        mediji: G(t, [{ kr: 'P', r: 2.8, b: 0, pun: 1 }, { kr: 'R', r: 2.8, b: 1, pun: 1 }, { tx: '18', at: [-3, 3.3], b: 0 }, { tx: '15', at: [3, 3.3], b: 1 }, { tx: '?', at: [0, 0] }, { tx: '5', at: [5, -2.6] }], { bezImena: ['P', 'R'], velicina: 240 }),
        medijiOdgovora: G(t, [{ kr: 'P', r: 2.8, b: 0, pun: 1 }, { kr: 'R', r: 2.8, b: 1, pun: 1 }, { tx: '10', at: [-2.6, 0] }, { tx: '8', at: [0, 0], b: 3 }, { tx: '7', at: [2.6, 0] }, { tx: '5', at: [5, -2.6] }], { bezImena: ['P', 'R'], velicina: 240 }),
      });
  }

  proveri(9 + 4 + 1 === 14, 'kvadrati 3×3');
  Q(3, 'Koliko ukupno kvadrata (svih veličina) ima na ovoj tabli 3 × 3?', ['14', '9', '13', '10'],
    'Malih kvadrata 1 × 1 ima 9, srednjih 2 × 2 ima 4, a veliki 3 × 3 je jedan: 9 + 4 + 1 = 14. Na šahovskoj tabli 8 × 8 ima ih čak 204 (zbir kvadrata od 1 do 8).',
    'kvadrat', { mediji: G(O, polja(3, 3, (i, j) => ((i + j) % 2 ? 3 : 0)), { ...bez, velicina: 180 }) });

  Q(2, 'Novčić se baca dva puta. Kolika je verovatnoća da bar jednom padne glava?', ['${3|4}$', '${1|2}$', '${2|3}$', '${1|4}$'],
    'Mogući ishodi su GG, GP, PG i PP – četiri jednako verovatna. Bar jedna glava je u tri od njih. Lakše: jedini „loš“ ishod je PP (${1|4}$), pa je ostatak ${3|4}$.',
    'novčić', { medijiOdgovora: { vrsta: 'citat', tekst: 'GG · GP · PG · PP' } });

  Q(3, 'Plate petoro zaposlenih su 50.000 dinara, a direktorova je 1.000.000. Koja mera bolje pokazuje „tipičnu“ platu u toj firmi?', ['Medijana', 'Aritmetička sredina', 'Najveća plata', 'Zbir svih plata'],
    'Prosek šest plata je oko 208.000 dinara – a niko osim direktora nema ni približno toliko! Medijana (srednja vrednost po veličini) je 50.000 i ne „vuče“ je jedna ogromna vrednost.',
    'medijana');

  U(2, 'Koji događaj NEMA verovatnoću ${1|2}$?', ['Na kockici padne 6', 'Na kockici padne paran broj', 'Novčić padne „pismo“', 'Na kockici padne broj manji od 4'],
    'Šestica je samo jedan od 6 ishoda: ${1|6}$. Parnih brojeva (2, 4, 6) i brojeva manjih od 4 (1, 2, 3) ima po tri od šest, a novčić ima dve strane.',
    'Kockica „ne pamti“ prethodna bacanja: posle pet šestica zaredom, verovatnoća za šesticu je i dalje ${1|6}$.',
    'kockica');

  S(2, 'Spoji događaj sa njegovom verovatnoćom', [['Na kockici padne 7', '0'], ['Na kockici padne broj od 1 do 6', '1'], ['Novčić padne „glava“', '${1|2}$'], ['Na kockici padne 5', '${1|6}$']],
    'Nemoguć događaj ima verovatnoću 0, a siguran 1 (100%). Sve ostale verovatnoće su između – nikad manje od 0 ni veće od 1.',
    'verovatnoća');

  Q(3, 'Iza jednih od troja vrata je nagrada. Izabereš jedna, a voditelj (koji zna gde je nagrada) otvori druga, prazna, i ponudi ti zamenu. Šta je bolje?', ['Zameniti vrata', 'Ostati pri izboru', 'Potpuno je svejedno', 'Zavisi od sreće'],
    'Prvi izbor je tačan u ${1|3}$ slučajeva, pa je u ${2|3}$ nagrada iza preostala dva vrata – a voditelj je jedna prazna otklonio. Zamenom se dobija u ${2|3}$ igara! Ovaj „problem Montija Hola“ zbunio je i mnoge profesore matematike.',
    'vrata', { mediji: { vrsta: 'emodzi', tekst: '🚪 🚪 🚪' }, vreme: 30 });
};
