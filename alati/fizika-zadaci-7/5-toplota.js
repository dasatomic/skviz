// Tema 5: Toplotne pojave – temperatura i toplotno širenje, količina toplote, toplotna ravnoteža
// (specifični toplotni kapacitet vode $c = 4 200 J/(kg · °C)$)
module.exports = ({ L, Z, K, G, S, proveri, b, r, F, T, mera, stubovi }) => {
  const cv = 4200;
  // ravnotežna temperatura smeše (iste supstance, c se skrati)
  const smesa = (...d) => d.reduce((a, [m, t]) => a + m * t, 0) / d.reduce((a, [m]) => a + m, 0);
  // „vaga toplote“: predata (toplija) i primljena (hladnija) toplota kao stubići
  const vaga = (dat, primljen, jed = 'kJ', x = {}) => stubovi([['~predaje', dat, 1], ['~prima', primljen, 0]], { jedinica: jed, vis: 3.5, sir: 1.8, razmak: 1, ...x });

  // ════════════════ 19. Toplotno širenje i temperatura ════════════════
  L('Toplotno širenje i temperatura');
  Z(1, 'Temperatura vazduha je $25 °C$. Kolika je to temperatura u kelvinima?',
    ['$298 K$', '$248 K$', '$25 K$', '$273 K$'],
    [K('Veza Kelvinove i Celzijusove skale: $T = t + 273$.'),
     K('$T = 25 + 273 = 298 K$.')],
    S('termometar', { skale: ['C', 'K'], od: -20, do: 110, temp: 25, tacke: [{ c: 25, o: '25 °C', l: '? K' }] }));

  Z(1, 'Temperatura neke tečnosti je $300 K$. Kolika je ona u stepenima Celzijusa?',
    ['$27 °C$', '$573 °C$', '$−27 °C$', '$300 °C$'],
    [K('$t = T − 273$.'),
     K('$t = 300 − 273 = 27 °C$.')],
    S('termometar', { skale: ['C', 'K'], od: -20, do: 110, temp: 27 }));

  Z(2, 'Temperatura vode porasla je sa $15 °C$ na $40 °C$. Kolika je promena temperature izražena u kelvinima?',
    ['$25 K$', '$298 K$', '$313 K$', '$55 K$'],
    [K('Podeok Kelvinove skale jednak je podeoku Celzijusove (skale su samo pomerene za $273$).'),
     K('Zato je promena ista u obe skale: $Δt = 40 − 15 = 25 °C$, tj. $ΔT = 313 K − 288 K = 25 K$.')],
    S('termometar', { skale: ['C', 'K'], od: 0, do: 60, tacke: [{ c: 15, o: '15 °C' }, { c: 40, o: '40 °C' }] }));

  Z(2, 'Telo je zagrejano od $250 K$ do $310 K$. Kolika je njegova konačna temperatura u °C i za koliko °C je zagrejano?',
    ['$37 °C$; za $60 °C$', '$37 °C$; za $333 °C$', '$310 °C$; za $60 °C$', '$−23 °C$; za $60 °C$'],
    [K('Konačna temperatura: $310 − 273 = 37 °C$ (kao temperatura ljudskog tela).'),
     K('Početna je bila $250 − 273 = −23 °C$, a promena $310 K − 250 K = 60 K = 60 °C$.')],
    S('termometar', { skale: ['C', 'K'], od: -30, do: 50, tacke: [{ c: -23, o: '250 K' }, { c: 37, o: '310 K' }] }));

  proveri(0.144 * (40 - -10), 7.2);
  Z(3, 'Čelična šina dužine $12 m$ produži se za $0,144 mm$ kada se zagreje za $1 °C$. Zimi temperatura padne do $−10 °C$, a leti šina dostigne $40 °C$. Za koliko se razlikuju njene dužine leti i zimi?',
    ['$7,2 mm$', '$5,76 mm$', '$4,32 mm$', '$1,44 mm$'],
    [K('Razlika temperatura: $40 °C − (−10 °C) = 50 °C$.'),
     K('Produženje je srazmerno promeni temperature: $50 · 0,144 mm = 7,2 mm$.'),
     K('Zato se između šina ostavlja razmak (dilataciona fuga) od nekoliko milimetara.', [], S('toplota', { tip: 'sine' }))],
    S('toplota', { tip: 'sine' }));

  proveri(0.017 * 20 * 50, 17);
  Z(3, 'Bakarna žica dužine $1 m$ produži se za $0,017 mm$ kad se zagreje za $1 °C$. Za koliko se produži bakarna žica dužine $20 m$ kad se zagreje za $50 °C$?',
    ['$17 mm$', '$0,85 mm$', '$0,34 mm$', '$1,7 mm$'],
    [K('Produženje je srazmerno i dužini i promeni temperature.'),
     K('Za $20 m$ i $1 °C$: $20 · 0,017 mm = 0,34 mm$.'),
     K('Za $50 °C$: $50 · 0,34 mm = 17 mm$ – zato dalekovodi leti više vise.', [], S('toplota', { tip: 'zice' }))],
    S('toplota', { tip: 'zice' }));

  Z(1, 'Najniža moguća temperatura je apsolutna nula, $0 K$. Koliko je to stepeni Celzijusa?',
    ['$−273 °C$', '$0 °C$', '$273 °C$', '$−100 °C$'],
    [K('$t = T − 273 = 0 − 273 = −273 °C$.'),
     K('Na toj temperaturi bi čestice imale najmanju moguću energiju toplotnog kretanja.', [], S('cestice', { stanje: 'cvrsto', temp: 0.1 }))],
    S('cestice', { poredi: [{ stanje: 'gas', temp: 1, o: '300 K' }, { stanje: 'gas', temp: 0.3, o: '100 K' }] }));

  proveri(300 * 0.012 * 40, 144);
  Z(2, 'Ajfelov toranj je visok oko $300 m$. Gvozdena konstrukcija se produži za $0,012 mm$ po metru na svaki stepen. Za koliko je toranj viši leti nego zimi ako je razlika temperatura $40 °C$?',
    ['Oko $14 cm$', 'Oko $1,4 cm$', 'Oko $144 cm$', 'Oko $4,8 mm$'],
    [K('Za $300 m$ i $1 °C$: $300 · 0,012 mm = 3,6 mm$.'),
     K('Za $40 °C$: $40 · 3,6 mm = 144 mm ≈ 14 cm$.')],
    G([T('🗼', 0, 0, { vel: 90 }), mera(1.8, -1.6, 1.8, 1.6, '300 m', { oAt: [3, 0] })], { velicina: 160 }));

  Z(1, 'Voda se na normalnom pritisku ledi na $0 °C$, a ključa na $100 °C$. Kolika je razlika tih temperatura izražena u kelvinima?',
    ['$100 K$', '$373 K$', '$273 K$', '$646 K$'],
    [K('U kelvinima: $273 K$ i $373 K$.'),
     K('Razlika: $373 K − 273 K = 100 K$ – ista kao u °C.')],
    S('termometar', { skale: ['C', 'K'], od: -20, do: 110, tacke: [{ c: 0, o: '~led se topi' }, { c: 100, o: '~voda ključa' }] }));

  Z(2, 'Litar vode zagrevamo od $0 °C$ do $8 °C$. Kako se menja zapremina vode?',
    ['Prvo se smanjuje (do $4 °C$), pa raste', 'Sve vreme raste', 'Sve vreme se smanjuje', 'Ne menja se'],
    [K('Voda se ponaša neobično: između $0 °C$ i $4 °C$ pri zagrevanju se skuplja.'),
     K('Najmanju zapreminu (najveću gustinu) ima na $4 °C$, a posle se širi kao i druge tečnosti.'),
     K('Zato zimi na dnu jezera ostaje voda od $4 °C$, a led pliva na površini.')],
    S('termometar', { skale: ['C', 'K'], od: -10, do: 30, tacke: [{ c: 4, o: '~najveća gustina' }] }));

  // ════════════════ 20. Količina toplote i specifični toplotni kapacitet ════════════════
  L('Količina toplote i specifični toplotni kapacitet');
  proveri(2 * cv * 50, 420000);
  Z(1, 'Koliko toplote je potrebno da se $2 kg$ vode zagreje od $20 °C$ do $70 °C$? ($c = 4 200 J/(kg · °C)$)',
    ['$420 kJ$', '$8,4 kJ$', '$588 kJ$', '$210 kJ$'],
    [K('Količina toplote: $Q = m · c · Δt$, a $Δt = 70 °C − 20 °C = 50 °C$.'),
     K('$Q = 2 kg · 4 200 J/(kg · °C) · 50 °C = 420 000 J = 420 kJ$.')],
    S('kalorimetar', { tip: 'grejanje', m: '2 kg', t1: 20, t2: 70, Q: 'Q = ?', tecnost: '~voda' }));

  proveri(0.5 * cv * 10, 21000);
  Z(1, 'Koliko toplote treba dovesti vodi mase $0,5 kg$ da bi joj se temperatura povećala za $10 °C$? ($c = 4 200 J/(kg · °C)$)',
    ['$21 kJ$', '$2,1 kJ$', '$42 kJ$', '$210 kJ$'],
    [K('$Q = m c Δt = 0,5 · 4 200 · 10 J = 21 000 J = 21 kJ$.')],
    S('kalorimetar', { tip: 'grejanje', m: '0,5 kg', t1: 20, t2: 30, Q: 'Q = ?' }));

  proveri(2 * 900 * 100, 180000);
  Z(2, 'Aluminijumski blok mase $2 kg$ zagrevamo od $20 °C$ do $120 °C$. Koliko toplote je potrebno? ($c_{Al} = 900 J/(kg · °C)$)',
    ['$180 kJ$', '$216 kJ$', '$1,8 kJ$', '$840 kJ$'],
    [K('$Δt = 120 − 20 = 100 °C$.'),
     K('$Q = 2 · 900 · 100 J = 180 000 J = 180 kJ$. ($840 kJ$ bi trebalo za istu masu vode – voda se teško greje!)')],
    S('kalorimetar', { tip: 'grejanje', m: '2 kg', e: '🔳', t1: 20, t2: 120, Q: 'Q = ?', tecnost: '~aluminijum' }));

  proveri(84000 / (1 * cv), 20);
  Z(2, 'Vodi mase $1 kg$ dovedeno je $84 kJ$ toplote. Za koliko joj je porasla temperatura? ($c = 4 200 J/(kg · °C)$)',
    ['$20 °C$', '$0,05 °C$', '$84 °C$', '$2 °C$'],
    [K('Iz $Q = m c Δt$: $Δt = {Q|m c}$.'),
     K('$Δt = {84 000 J|1 kg · 4 200 J/(kg · °C)} = 20 °C$.')],
    S('kalorimetar', { tip: 'grejanje', m: '1 kg', t1: 20, t2: 40, Q: '84 kJ', skrij: true }));

  proveri(1 * cv * 80, 336000);
  Z(2, 'Za čaj zagrevamo $1 l$ vode od $20 °C$ do ključanja ($100 °C$). Koliko toplote je potrebno? ($c = 4 200 J/(kg · °C)$)',
    ['$336 kJ$', '$420 kJ$', '$84 kJ$', '$33,6 kJ$'],
    [K('$1 l$ vode ima masu $1 kg$; $Δt = 80 °C$.'),
     K('$Q = 1 · 4 200 · 80 J = 336 000 J = 336 kJ$.')],
    S('kalorimetar', { tip: 'grejanje', m: '1 l', t1: 20, t2: 100, Q: 'Q = ?', tecnost: '~voda' }));

  proveri((1 * cv * 80) / 1000, 336);
  Z(3, 'Kuvalo snage $1 000 W$ zagreva $1 kg$ vode od $20 °C$ do $100 °C$. Za koje vreme, ako se sva energija predaje vodi? ($c = 4 200 J/(kg · °C)$)',
    ['$5,6 min$', '$336 min$', '$3,36 min$', '$80 s$'],
    [K('Potrebna toplota: $Q = 1 · 4 200 · 80 J = 336 000 J$.'),
     K('Snaga $1 000 W$ daje $1 000 J$ svake sekunde: $t = {336 000 J|1 000 W} = 336 s$.'),
     K('$336 s = 5,6 min$ ($5 min$ i $36 s$). U stvarnosti malo duže – deo toplote ode u vazduh.', [], S('kalorimetar', { tip: 'grejanje', m: '1 kg', t1: 20, t2: 100, Q: '336 kJ', sat: '336 s' }))],
    S('kalorimetar', { tip: 'grejanje', m: '1 kg', t1: 20, t2: 100, Q: 'P = 1 000 W' }));

  proveri(9200 / (0.5 * 40), 460);
  Z(3, 'Metalni predmet mase $0,5 kg$ primi $9 200 J$ toplote i zagreje se za $40 °C$. Od kog metala je napravljen? (Al: $900$, Fe: $460$, Cu: $380$, Pb: $130$ – sve u $J/(kg · °C)$)',
    ['Od gvožđa', 'Od aluminijuma', 'Od bakra', 'Od olova'],
    [K('$c = {Q|m Δt} = {9 200 J|0,5 kg · 40 °C}$.'),
     K('$c = {9 200|20} = 460 J/(kg · °C)$ – to je gvožđe.')],
    S('kalorimetar', { tip: 'grejanje', m: '0,5 kg', e: '🔩', t1: 20, t2: 60, Q: '9,2 kJ', tecnost: '?' }));

  proveri((4 * cv) / 800, 21);
  Z(2, 'Voda i pesak iste mase prime istu količinu toplote. Voda se zagreje za $4 °C$. Za koliko se zagreje pesak? ($c_{vode} = 4 200$, $c_{peska} = 800 J/(kg · °C)$)',
    ['$21 °C$', '$4 °C$', '$0,76 °C$', '$16,8 °C$'],
    [K('Ista $Q$ i ista masa: $c_{v} · Δt_{v} = c_{p} · Δt_{p}$.'),
     K('$Δt_{p} = {4 200 · 4|800} °C = 21 °C$.'),
     K('Zato je leti pesak na plaži vreo, a voda prijatna – voda ima veliki toplotni kapacitet.')],
    S('kalorimetar', { tip: 'grejanje', m: '1 kg', e: '🏖️', t1: 20, t2: 41, skrij: true, tecnost: '~pesak' }));

  proveri(3 * cv * 10, 126000);
  Z(1, 'Koliko toplote preda okolini $3 kg$ vode kada se ohladi za $10 °C$? ($c = 4 200 J/(kg · °C)$)',
    ['$126 kJ$', '$12,6 kJ$', '$42 kJ$', '$1 260 kJ$'],
    [K('Pri hlađenju telo predaje onoliko toplote koliko bi primilo pri zagrevanju za isto toliko.'),
     K('$Q = 3 · 4 200 · 10 J = 126 000 J = 126 kJ$.')],
    S('kalorimetar', { tip: 'grejanje', m: '3 kg', t1: 50, t2: 40, tecnost: '~hladi se' }));

  proveri(0.5 * 900 * 80 + 2 * cv * 80, 708000);
  Z(3, 'U aluminijumskom loncu mase $0,5 kg$ nalazi se $2 kg$ vode na $20 °C$. Koliko toplote treba da bi voda (zajedno sa loncem) dostigla $100 °C$? ($c_{Al} = 900$, $c_{v} = 4 200 J/(kg · °C)$)',
    ['$708 kJ$', '$672 kJ$', '$36 kJ$', '$1 020 kJ$'],
    [K('I lonac i voda se zagreju za $Δt = 80 °C$.'),
     K('Lonac: $Q_{1} = 0,5 · 900 · 80 J = 36 000 J$.', ['l']),
     K('Voda: $Q_{2} = 2 · 4 200 · 80 J = 672 000 J$.', ['v']),
     K('Ukupno: $Q = 36 kJ + 672 kJ = 708 kJ$ – lonac „uzme“ samo oko $5 %$.')],
    S('kalorimetar', { tip: 'grejanje', m: '2 kg + 0,5 kg', t1: 20, t2: 100, Q: 'Q = ?' }),
    { crtez: G(stubovi([['~lonac', 36, 4], ['~voda', 672, 0]], { jedinica: 'kJ', vis: 4, sir: 1.8, razmak: 1, k: [2, 3], id: ['l', 'v'] }), { velicina: 200 }) });

  // ════════════════ 21. Toplotna ravnoteža ════════════════
  L('Toplotna ravnoteža');
  proveri(smesa([1, 80], [1, 20]), 50);
  Z(1, 'Pomešamo $1 kg$ vode temperature $80 °C$ i $1 kg$ vode temperature $20 °C$. Kolika je temperatura smeše? (Gubitke toplote zanemari.)',
    ['$50 °C$', '$60 °C$', '$100 °C$', '$40 °C$'],
    [K('Toplija voda predaje toplotu hladnijoj dok im se temperature ne izjednače (toplotna ravnoteža).'),
     K('Mase su jednake, pa topla voda padne za isto koliko hladna poraste: $80 − t = t − 20$.'),
     K('$t = 50 °C$ – tačno na sredini.', [], S('kalorimetar', { tip: 'mesanje', tela: [{ m: '1 kg', t: 80, o: '~topla' }, { m: '1 kg', t: 20, o: '~hladna' }], tk: 50 }))],
    S('kalorimetar', { tip: 'mesanje', tela: [{ m: '1 kg', t: 80, o: '~topla' }, { m: '1 kg', t: 20, o: '~hladna' }], tk: 50, skrij: true }));

  proveri(smesa([1, 80], [3, 20]), 35);
  Z(2, 'Pomešamo $1 kg$ vode na $80 °C$ i $3 kg$ vode na $20 °C$. Kolika je temperatura smeše?',
    ['$35 °C$', '$50 °C$', '$65 °C$', '$25 °C$'],
    [K('Predata toplota = primljena toplota: $1 · c · (80 − t) = 3 · c · (t − 20)$ ($c$ se skrati).'),
     K('$80 − t = 3t − 60$ ⇒ $4t = 140$ ⇒ $t = 35 °C$.'),
     K('Topla voda se ohladi za $45 °C$, a tri puta veća hladna zagreje se triput manje – za $15 °C$.', [], S('kalorimetar', { tip: 'mesanje', tela: [{ m: '1 kg', t: 80, o: '~topla' }, { m: '3 kg', t: 20, o: '~hladna' }], tk: 35 }))],
    S('kalorimetar', { tip: 'mesanje', tela: [{ m: '1 kg', t: 80, o: '~topla' }, { m: '3 kg', t: 20, o: '~hladna' }], tk: 35, skrij: true }));

  proveri(smesa([2, 90], [3, 10]), 42);
  Z(2, 'U kadu sipamo $2 kg$ vode na $90 °C$ i $3 kg$ vode na $10 °C$. Kolika je temperatura smeše?',
    ['$42 °C$', '$50 °C$', '$58 °C$', '$34 °C$'],
    [K('$2 · (90 − t) = 3 · (t − 10)$.'),
     K('$180 − 2t = 3t − 30$ ⇒ $5t = 210$ ⇒ $t = 42 °C$.'),
     K('Kraće: ravnotežna temperatura je „srednja vrednost sa težinama“: ${2 · 90 + 3 · 10|2 + 3} = {210|5} = 42 °C$.')],
    S('kalorimetar', { tip: 'mesanje', tela: [{ m: '2 kg', t: 90, o: '~topla' }, { m: '3 kg', t: 10, o: '~hladna' }], tk: 42, skrij: true }));

  proveri((2 * (70 - 40)) / (40 - 10), 2);
  Z(2, 'Koliko vode temperature $10 °C$ treba doliti u $2 kg$ vode temperature $70 °C$ da bi se dobila voda od $40 °C$?',
    ['$2 kg$', '$1 kg$', '$3 kg$', '$4 kg$'],
    [K('Topla voda se ohladi za $70 − 40 = 30 °C$, a hladna zagreje za $40 − 10 = 30 °C$.'),
     K('$2 · 30 = m · 30$ ⇒ $m = 2 kg$ – promene su jednake, pa i mase moraju biti jednake.', [], S('kalorimetar', { tip: 'mesanje', tela: [{ m: '2 kg', t: 70, o: '~topla' }, { m: '2 kg', t: 10, o: '~hladna' }], tk: 40 }))],
    S('termometar', { skale: ['C', 'K'], od: 0, do: 80, tacke: [{ c: 70, o: '2 kg' }, { c: 40, o: '~smeša' }, { c: 10, o: '? kg' }] }));

  proveri((40 * (35 - 15)) / (75 - 35), 20);
  Z(3, 'U kadi je $40 l$ vode na $15 °C$. Koliko litara vode temperature $75 °C$ treba doliti da bi kupka imala $35 °C$?',
    ['$20 l$', '$40 l$', '$10 l$', '$80 l$'],
    [K('Hladna voda se zagreje za $35 − 15 = 20 °C$; topla se ohladi za $75 − 35 = 40 °C$.'),
     K('$m · 40 = 40 · 20$ ⇒ $m = 20 kg$, tj. $20 l$.', ['v']),
     K('Provera: ${40 · 15 + 20 · 75|60} = {600 + 1 500|60} = 35 °C$ ✓.', [], S('kalorimetar', { tip: 'mesanje', tela: [{ m: '40 l', t: 15, o: '~kada' }, { m: '20 l', t: 75, o: '~vruća' }], tk: 35 }))],
    S('termometar', { skale: ['C', 'K'], od: 0, do: 80, tacke: [{ c: 75, o: '? l' }, { c: 35, o: '~kupka' }, { c: 15, o: '40 l' }] }),
    { crtez: G(vaga(40 * 4.2 * 20, 40 * 4.2 * 20, 'kJ', { k: [2, 2], id: 'v' }).concat([T('3 360 kJ = 3 360 kJ', 1.4, 4.6, { k: 2, id: 'v', b: 3 })]), { velicina: 200 }) });

  proveri((1 * 420 * 70) / (0.7 * cv) + 20, 30);
  Z(3, 'Metalni teg mase $1 kg$ ($c = 420 J/(kg · °C)$) zagrejan na $100 °C$ spustimo u $0,7 kg$ vode na $20 °C$. Kolika je temperatura kad se uspostavi toplotna ravnoteža?',
    ['$30 °C$', '$60 °C$', '$33 °C$', '$25 °C$'],
    [K('Metal predaje: $1 · 420 · (100 − t)$; voda prima: $0,7 · 4 200 · (t − 20) = 2 940 · (t − 20)$.'),
     K('$420 · (100 − t) = 2 940 · (t − 20)$; delimo sa $420$: $100 − t = 7 · (t − 20)$.'),
     K('$100 − t = 7t − 140$ ⇒ $8t = 240$ ⇒ $t = 30 °C$. Metal se ohladi za $70 °C$, a voda zagreje samo za $10 °C$.', [], S('kalorimetar', { tip: 'mesanje', tela: [{ m: '1 kg', t: 100, o: '~metal', c: 420 }, { m: '0,7 kg', t: 20, o: '~voda', c: 4200 }], tk: 30 }))],
    S('kalorimetar', { tip: 'mesanje', tela: [{ m: '1 kg', t: 100, o: '~metal', c: 420 }, { m: '0,7 kg', t: 20, o: '~voda', c: 4200 }], tk: 30, skrij: true }));

  proveri(1 * cv * 30, 126000);
  Z(2, 'Pomešamo $1 kg$ vode na $80 °C$ i $1 kg$ vode na $20 °C$; smeša ima $50 °C$. Koliko toplote je topla voda predala hladnoj?',
    ['$126 kJ$', '$252 kJ$', '$210 kJ$', '$336 kJ$'],
    [K('Topla voda se ohladila za $80 − 50 = 30 °C$: $Q = 1 · 4 200 · 30 J = 126 000 J$.'),
     K('Hladna je primila isto toliko: $1 · 4 200 · (50 − 20) J = 126 kJ$ – predata toplota = primljena.', ['v'])],
    S('kalorimetar', { tip: 'mesanje', tela: [{ m: '1 kg', t: 80, o: '~topla' }, { m: '1 kg', t: 20, o: '~hladna' }], tk: 50 }),
    { crtez: G(vaga(126, 126, 'kJ', { k: [1, 2], id: [null, 'v'] }), { velicina: 200 }) });

  Z(1, 'Vruć čaj sipamo u hladnu šolju. Šta se dešava dok se ne uspostavi toplotna ravnoteža?',
    ['Toplota prelazi sa čaja na šolju dok im se temperature ne izjednače', 'Hladnoća prelazi sa šolje na čaj', 'Toplota prelazi sa šolje na čaj', 'Ništa – svako telo zadržava svoju temperaturu'],
    [K('Toplota spontano prelazi uvek sa toplijeg na hladnije telo.'),
     K('Čaj se hladi, šolja se greje – dok ne dostignu istu temperaturu (toplotna ravnoteža).', ['q'])],
    null,
    { crtez: G([{ lin: [[0, 0], [2.4, 0], [2.4, 2], [0, 2]], zatv: 1, b: 1, gusto: 1 }, T('~čaj 90 °C', 1.2, 1), { lin: [[2.4, 0], [4.8, 0], [4.8, 2], [2.4, 2]], zatv: 1, b: 0, gusto: 1 }, T('~šolja 20 °C', 3.6, 1), F(0.8, 2.6, 3.2, 0, { o: 'Q', b: 3, k: 1, id: 'q', crtaj: 1, oAt: [2.4, 3.1] })], { velicina: 220 }) });

  proveri(smesa([0.2, 90], [0.05, 10]), 74);
  Z(2, 'U $200 g$ čaja temperature $90 °C$ dolijemo $50 g$ mleka temperature $10 °C$. Kolika je temperatura čaja sa mlekom? (Uzmi da čaj i mleko imaju isti specifični toplotni kapacitet.)',
    ['$74 °C$', '$50 °C$', '$80 °C$', '$70 °C$'],
    [K('Kad je $c$ isto, smeša ima „srednju vrednost sa težinama“: $t = {m_{1} t_{1} + m_{2} t_{2}|m_{1} + m_{2}}$.'),
     K('$t = {200 · 90 + 50 · 10|250} = {18 000 + 500|250} °C = 74 °C$.')],
    S('kalorimetar', { tip: 'mesanje', tela: [{ m: '200 g', t: 90, o: '~čaj' }, { m: '50 g', t: 10, o: '~mleko' }], tk: 74, skrij: true }));

  proveri((2 * (40 - 20)) / 1 + 40, 80);
  Z(3, 'Pomešali smo $2 kg$ vode temperature $20 °C$ sa $1 kg$ tople vode, i dobili smešu od $40 °C$. Kolika je bila temperatura tople vode?',
    ['$80 °C$', '$60 °C$', '$100 °C$', '$70 °C$'],
    [K('Hladna voda je primila: $2 · c · (40 − 20) = 40 · c$.'),
     K('Topla voda je predala isto: $1 · c · (t − 40) = 40 · c$ ⇒ $t − 40 = 40$.'),
     K('$t = 80 °C$.', [], S('kalorimetar', { tip: 'mesanje', tela: [{ m: '1 kg', t: 80, o: '~topla' }, { m: '2 kg', t: 20, o: '~hladna' }], tk: 40 }))],
    S('kalorimetar', { tip: 'mesanje', tela: [{ m: '1 kg', t: 80, o: '~topla', skrij: true }, { m: '2 kg', t: 20, o: '~hladna' }], tk: 40 }));
};
