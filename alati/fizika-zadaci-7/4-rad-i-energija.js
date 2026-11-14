// Tema 4: Mehanički rad, energija i snaga ($g = 10 m/s^{2}$)
module.exports = ({ L, Z, K, G, S, proveri, b, r, F, telo, tlo, T, mera, grafik, stubovi }) => {
  const g = 10;
  // trake energije (Ep, Ek, Q) kao stubići; vrednosti u J
  const energije = (Ep, Ek, Q, x = {}) => stubovi([['Ep', Ep, 0], ['Ek', Ek, 1], ...(Q !== null && Q !== undefined ? [['Q', Q, 5]] : [])], { jedinica: 'J', vis: 3.5, ...x });

  // ════════════════ 14. Mehanički rad ════════════════
  L('Mehanički rad');
  proveri(50 * 4, 200);
  Z(1, 'Kutiju guramo vodoravnom silom od $50 N$ i pomerimo je za $4 m$. Koliki rad smo izvršili?',
    ['$200 J$', '$12,5 J$', '$54 J$', '$2 000 J$'],
    [K('Rad sile u smeru kretanja: $A = F · s$.'),
     K('$A = 50 N · 4 m = 200 J$ (džul = njutn · metar).', ['s'])],
    S('sile', { sile: [{ F: 50, ugao: 0, o: '50 N' }], e: '📦', kretanje: true }),
    { crtez: G([tlo(-1, 8, 0), telo(0, 0, 1.4, 1.4, { tx: '📦', b: 4 }), telo(0, 0, 1.4, 1.4, { tx: '📦', b: 4, k: 1, pomeri: [4.6, 0] }), F(-1.2, 0.7, 1.2, 0, { o: '50 N', b: 1, oAt: [-0.8, 1.2] }), mera(0.7, -0.6, 5.3, -0.6, 's = 4 m', { k: 1, id: 's' })], { velicina: 260 }) });

  proveri(20 * g * 1.5, 300);
  Z(1, 'Koliki rad izvršimo kada ravnomerno podignemo kofer mase $20 kg$ na visinu $1,5 m$? ($g = 10 m/s^{2}$)',
    ['$300 J$', '$30 J$', '$13,3 J$', '$3 000 J$'],
    [K('Pri ravnomernom dizanju sila jednaka je težini: $F = m g = 20 kg · 10 m/s^{2} = 200 N$.'),
     K('$A = F · h = 200 N · 1,5 m = 300 J$.')],
    S('dizanje', { visina: 1.5, e: '🧳', o: '20 kg', sile: true }));

  proveri(-0.2 * 30 * g * 5, -300);
  Z(2, 'Sanduk mase $30 kg$ pomerimo po podu za $5 m$. Koeficijent trenja je $0,2$. Koliki rad izvrši sila trenja? ($g = 10 m/s^{2}$)',
    ['$−300 J$', '$300 J$', '$−1 500 J$', '$60 J$'],
    [K('Sila trenja: $F_{tr} = μ m g = 0,2 · 30 · 10 N = 60 N$.'),
     K('Trenje deluje suprotno kretanju, pa je njegov rad negativan: $A = −F_{tr} · s = −60 N · 5 m = −300 J$.'),
     K('Tih $300 J$ prelazi u toplotu – pod i sanduk se malo zagreju.')],
    S('sile', { sile: [{ F: 80, ugao: 0, o: 'F' }, { F: 60, ugao: 180, o: 'Ftr' }], telo: '30 kg', kretanje: true }));

  Z(2, 'Marko nosi rančić mase $5 kg$ i hoda po ravnom hodniku $10 m$, stalnom brzinom. Koliki rad vrši sila kojom drži rančić?',
    ['$0 J$', '$500 J$', '$50 J$', '$5 J$'],
    [K('Sila kojom drži rančić ($50 N$) je usmerena naviše, a pomeranje je vodoravno.', ['f']),
     K('Sila normalna na pravac kretanja ne vrši rad: $A = 0 J$ – iako se Marko umara!')],
    null,
    { crtez: G([tlo(-1, 8, 0), T('🎒', 0.5, 2.2, { vel: 30 }), T('🎒', 6.5, 2.2, { vel: 30, k: 1 }), F(0.5, 2.8, 0, 1.6, { o: 'F', b: 2, id: 'f' }), F(1.5, 1, 4, 0, { o: 's = 10 m', b: 3, oAt: [3.5, 0.5] })], { velicina: 240 }) });

  proveri(1200 / 40, 30);
  Z(2, 'Vučna sila izvršila je rad od $1,2 kJ$ na putu od $40 m$. Kolika je bila sila (u smeru kretanja)?',
    ['$30 N$', '$48 N$', '$0,03 N$', '$48 000 N$'],
    [K('$1,2 kJ = 1 200 J$.'),
     K('$F = {A|s} = {1 200 J|40 m} = 30 N$.')]);

  proveri(400 * g * 9, 36000);
  Z(2, 'Lift podiže teret mase $400 kg$ sa prizemlja na treći sprat, $9 m$ više. Koliki rad izvrši motor lifta (bez gubitaka)?',
    ['$36 kJ$', '$3,6 kJ$', '$360 kJ$', '$44,4 kJ$'],
    [K('Sila jednaka težini: $F = 400 kg · 10 m/s^{2} = 4 000 N$.'),
     K('$A = F · h = 4 000 N · 9 m = 36 000 J = 36 kJ$.')],
    S('dizanje', { visina: 9, e: '🛗', o: '400 kg' }));

  proveri(2 * g * 15, 300);
  Z(1, 'Kamen mase $2 kg$ padne sa visine $15 m$. Koliki rad izvrši sila Zemljine teže?',
    ['$300 J$', '$30 J$', '$−300 J$', '$7,5 J$'],
    [K('Sila teže $Q = 20 N$ deluje naniže, a kamen se kreće naniže – rad je pozitivan.'),
     K('$A = Q · h = 20 N · 15 m = 300 J$.')],
    S('pad', { tip: 'slobodan', visina: 15, brzina: false }));

  {
    proveri(20 * 3 + 10 * 4, 100);
    const gg = grafik({ xmax: 8, ymax: 25, yk: 5, x: 's (m)', y: 'F (N)' });
    Z(3, 'Grafik prikazuje kako se menjala sila kojom smo vukli sanke duž puta. Koliki je ukupni rad te sile?',
      ['$100 J$', '$210 J$', '$140 J$', '$30 J$'],
      [K('Rad je jednak površini ispod grafika $F(s)$ (kao što je put površina ispod $v(t)$).'),
       K('Prvi deo: $20 N · 3 m = 60 J$.', ['a1']),
       K('Drugi deo: $10 N · 4 m = 40 J$.', ['a2']),
       K('Ukupno: $60 J + 40 J = 100 J$.')],
      G([gg.e, gg.povrs([[0, 20], [3, 20]], { k: 2, id: 'a1', b: 0 }), gg.povrs([[3, 10], [7, 10]], { k: 3, id: 'a2', b: 1 }), gg.linija([[0, 20], [3, 20], [3, 10], [7, 10]], { crtaj: false }), gg.tekst('60 J', 1.5, 10, { k: 2, id: 'a1' }), gg.tekst('40 J', 5, 5, { k: 3, id: 'a2' })], { velicina: 300 }));
  }

  proveri(0.25 * 10 * g * 8, 200);
  Z(3, 'Kutiju mase $10 kg$ vučemo stalnom brzinom po podu $8 m$. Koeficijent trenja je $0,25$. Koliki rad izvrši vučna sila? ($g = 10 m/s^{2}$)',
    ['$200 J$', '$800 J$', '$0 J$', '$20 J$'],
    [K('Stalna brzina ⇒ vučna sila je jednaka trenju: $F = μ m g = 0,25 · 100 N = 25 N$.'),
     K('$A = F · s = 25 N · 8 m = 200 J$. (Ukupan rad svih sila je $0$, jer se brzina ne menja.)')],
    S('sile', { sile: [{ F: 25, ugao: 0, o: 'F' }, { F: 25, ugao: 180, o: 'Ftr' }], e: '📦' }));

  proveri(500 * g * 20, 100000);
  Z(3, 'Dizalica ravnomerno podigne teret mase $500 kg$ na visinu $20 m$, a zatim ga na istoj visini pomeri vodoravno za $10 m$. Koliki je ukupan rad sile kojom dizalica drži teret?',
    ['$100 kJ$', '$150 kJ$', '$50 kJ$', '$112 kJ$'],
    [K('Dizanje: $A_{1} = m g h = 500 · 10 · 20 J = 100 000 J$.'),
     K('Vodoravno pomeranje: sila (naviše) je normalna na pomeranje, pa je $A_{2} = 0$.'),
     K('Ukupno: $100 kJ$.')],
    S('dizanje', { visina: 20, e: '📦', o: '500 kg', sile: true }));

  // ════════════════ 15. Kinetička energija i rad ════════════════
  L('Kinetička energija i rad');
  proveri((0.5 * 10 * 10) / 2, 25);
  Z(1, 'Fudbalska lopta mase $0,5 kg$ leti brzinom $10 m/s$. Kolika je njena kinetička energija?',
    ['$25 J$', '$2,5 J$', '$50 J$', '$5 J$'],
    [K('$E_{k} = {m v^{2}|2}$.'),
     K('$E_{k} = {0,5 kg · (10 m/s)^{2}|2} = {0,5 · 100|2} J = 25 J$.')],
    S('kretanje', { tela: [{ e: '⚽', v: 10 }], duzina: 20, podeok: 2, vektor: true }));

  proveri((1000 * 400) / 2, 200000);
  Z(1, 'Automobil mase $1 000 kg$ vozi brzinom $20 m/s$. Kolika je njegova kinetička energija?',
    ['$200 kJ$', '$20 kJ$', '$400 kJ$', '$10 kJ$'],
    [K('$E_{k} = {1 000 kg · (20 m/s)^{2}|2} = {1 000 · 400|2} J = 200 000 J$.'),
     K('$200 000 J = 200 kJ$ (kilodžula).')],
    S('kretanje', { tela: [{ e: '🚗', v: 20 }], duzina: 60, podeok: 10, vektor: true }));

  Z(2, 'Kako se promeni kinetička energija automobila kada mu se brzina udvostruči (sa $50 km/h$ na $100 km/h$)?',
    ['Poveća se $4$ puta', 'Poveća se $2$ puta', 'Ostane ista', 'Poveća se $8$ puta'],
    [K('$E_{k} = {m v^{2}|2}$ – energija zavisi od kvadrata brzine.'),
     K('$(2v)^{2} = 4 v^{2}$: energija je $4$ puta veća – i zaustavni put je $4$ puta duži.')],
    null,
    { crtez: G(stubovi([['50 km/h', 1, 0], ['100 km/h', 4, 1]], { jedinica: null, vis: 4, sir: 2, razmak: 1 }).concat([T('× 4', 4.5, 4.4, { b: 3, vel: 18 })]), { velicina: 200 }) });

  proveri(Math.sqrt((2 * 90) / 5), 6);
  Z(2, 'Telo mase $5 kg$ ima kinetičku energiju $90 J$. Kolika je njegova brzina?',
    ['$6 m/s$', '$36 m/s$', '$18 m/s$', '$4,2 m/s$'],
    [K('Iz $E_{k} = {m v^{2}|2}$: $v^{2} = {2 E_{k}|m} = {2 · 90|5} = 36$.'),
     K('$v = √{36} m/s = 6 m/s$.')]);

  proveri((80 * (10 * 10 - 5 * 5)) / 2, 3000);
  Z(2, 'Biciklista sa biciklom ima masu $80 kg$ i ubrza sa $5 m/s$ na $10 m/s$. Koliki rad je izvršio?',
    ['$3 000 J$', '$1 000 J$', '$4 000 J$', '$200 J$'],
    [K('Rad je jednak promeni kinetičke energije: $A = E_{k2} − E_{k1}$.'),
     K('$E_{k1} = {80 · 25|2} = 1 000 J$, $E_{k2} = {80 · 100|2} = 4 000 J$.', ['e']),
     K('$A = 4 000 J − 1 000 J = 3 000 J$ – za dvostruku brzinu treba triput više rada nego za prvih $5 m/s$!')],
    S('kretanje', { tela: [{ e: '🚴', v: 5, a: 1.25 }], duzina: 40, podeok: 5, vektor: true }),
    { crtez: G(stubovi([['5 m/s', 1000, 0], ['10 m/s', 4000, 1]], { jedinica: 'J', vis: 4, sir: 2, razmak: 1, k: [0, 2], id: [null, 'e'] }), { velicina: 200 }) });

  proveri((1200 * 400) / 2 / 40, 6000);
  Z(3, 'Automobil mase $1 200 kg$ vozi $20 m/s$ i koči do zaustavljanja na putu od $40 m$. Kolika je srednja sila kočenja?',
    ['$6 000 N$', '$240 000 N$', '$12 000 N$', '$600 N$'],
    [K('Kinetička energija automobila: $E_{k} = {1 200 · 20^{2}|2} J = 240 000 J$.'),
     K('Sila kočenja „potroši“ svu tu energiju: $F · s = E_{k}$.'),
     K('$F = {240 000 J|40 m} = 6 000 N$.')],
    S('kretanje', { tela: [{ e: '🚗', v: 20, a: -5 }], duzina: 45, podeok: 5, vektor: true }));

  proveri((0.01 * 400 * 400) / 2, 800);
  Z(2, 'Strela mase $10 g$ leti brzinom $40 m/s$, a metak iste mase brzinom $400 m/s$. Kolika je kinetička energija metka?',
    ['$800 J$', '$8 J$', '$2 J$', '$80 J$'],
    [K('Masa u kilogramima: $10 g = 0,01 kg$.'),
     K('$E_{k} = {0,01 · 400^{2}|2} J = {0,01 · 160 000|2} J = 800 J$.'),
     K('Strela ima samo $8 J$: brzina $10$ puta manja – energija $100$ puta manja.')]);

  proveri((1500 * 20 * 20) / 2, 300000);
  Z(2, 'Kombi mase $1 500 kg$ vozi brzinom $72 km/h$. Kolika je njegova kinetička energija?',
    ['$300 kJ$', '$3 888 kJ$', '$54 kJ$', '$30 kJ$'],
    [K('Brzina u m/s: $72 km/h = 20 m/s$.'),
     K('$E_{k} = {1 500 · 20^{2}|2} J = 300 000 J = 300 kJ$. ($3 888 kJ$ – zamka, brzina nije pretvorena.)')],
    S('kretanje', { tela: [{ e: '🚐', v: 20 }], duzina: 60, podeok: 10, vektor: true }));

  proveri(Math.sqrt((2 * 50 * 9) / 25), 6);
  Z(3, 'Sanke mase $25 kg$ miruju na ledu. Vučemo ih vodoravnom silom $50 N$ na putu od $9 m$ (trenje zanemari). Kolika je brzina sanki na kraju?',
    ['$6 m/s$', '$18 m/s$', '$36 m/s$', '$3 m/s$'],
    [K('Rad sile: $A = 50 N · 9 m = 450 J$ – toliko je kinetičke energije sanki.'),
     K('${25 · v^{2}|2} = 450$ ⇒ $v^{2} = 36$ ⇒ $v = 6 m/s$.')],
    S('sile', { sile: [{ F: 50, ugao: 0, o: '50 N' }], e: '🛷', kretanje: true }));

  Z(1, 'Kamion mase $6 t$ i automobil mase $2 t$ voze istom brzinom. Kakav je odnos njihovih kinetičkih energija?',
    ['Kamion ima $3$ puta veću', 'Kamion ima $9$ puta veću', 'Jednake su', 'Automobil ima $3$ puta veću'],
    [K('Pri istoj brzini kinetička energija je srazmerna masi.'),
     K('$6 t : 2 t = 3$ – kamion ima $3$ puta veću kinetičku energiju.')],
    S('kretanje', { tela: [{ e: '🚛', v: 10 }, { e: '🚗', v: 10 }], duzina: 40, podeok: 5 }));

  // ════════════════ 16. Potencijalna energija ════════════════
  L('Potencijalna energija');
  proveri(3 * g * 6, 180);
  Z(1, 'Saksija mase $3 kg$ stoji na prozoru, $6 m$ iznad tla. Kolika je njena potencijalna energija u odnosu na tlo? ($g = 10 m/s^{2}$)',
    ['$180 J$', '$18 J$', '$90 J$', '$1 800 J$'],
    [K('$E_{p} = m · g · h$.'),
     K('$E_{p} = 3 kg · 10 m/s^{2} · 6 m = 180 J$.')],
    G([tlo(-3, 3, 0), { lin: [[-2, 0], [-2, 6], [0.3, 6], [0.3, 0]], b: 4, debljina: 2 }, T('🪴', 0.9, 6.5, { vel: 28 }), mera(2, 0, 2, 6, '6 m', { oAt: [2.8, 3] })], { velicina: 170 }));

  proveri(0.5 * g * 20, 100);
  Z(1, 'Kamen mase $0,5 kg$ nalazi se na litici visokoj $20 m$. Kolika je njegova potencijalna energija? ($g = 10 m/s^{2}$)',
    ['$100 J$', '$10 J$', '$40 J$', '$1 000 J$'],
    [K('$E_{p} = m g h = 0,5 · 10 · 20 J = 100 J$.')]);

  proveri(1200 / (40 * g), 3);
  Z(2, 'Dete mase $40 kg$ na toboganu ima potencijalnu energiju $1 200 J$ u odnosu na tlo. Na kojoj je visini? ($g = 10 m/s^{2}$)',
    ['$3 m$', '$30 m$', '$0,3 m$', '$48 m$'],
    [K('$h = {E_{p}|m g} = {1 200 J|40 kg · 10 m/s^{2}} = {1 200|400} m = 3 m$.')],
    S('energija', { tip: 'staza' }));

  proveri(45 * g * (12 - 3), 4050);
  Z(2, 'Dečak mase $45 kg$ popne se sa prvog sprata (na $3 m$) na četvrti sprat (na $12 m$ visine). Za koliko se povećala njegova potencijalna energija? ($g = 10 m/s^{2}$)',
    ['$4 050 J$', '$5 400 J$', '$1 350 J$', '$405 J$'],
    [K('Važna je samo razlika visina: $Δh = 12 m − 3 m = 9 m$.'),
     K('$ΔE_{p} = m g Δh = 45 · 10 · 9 J = 4 050 J$.')],
    S('dizanje', { tip: 'stepenice', visina: 9, stepenika: 9, e: '🧒' }));

  proveri(1 * g * (2 - 0.8), 12);
  Z(3, 'Knjiga mase $1 kg$ stoji na polici $2 m$ iznad poda. Sto je visok $0,8 m$. Kolika je potencijalna energija knjige u odnosu na površinu stola? ($g = 10 m/s^{2}$)',
    ['$12 J$', '$20 J$', '$8 J$', '$28 J$'],
    [K('Potencijalna energija se računa u odnosu na izabrani nivo – ovde sto: $h = 2 m − 0,8 m = 1,2 m$.', ['h']),
     K('$E_{p} = 1 · 10 · 1,2 J = 12 J$. U odnosu na pod bi bila $20 J$.')],
    G([tlo(-3, 4, 0), { lin: [[-2.5, 2], [-0.5, 2]], b: 4, debljina: 5 }, T('📘', -1.5, 2.35, { vel: 22 }), { lin: [[1, 0.8], [3.5, 0.8]], b: 5, debljina: 5 }, { lin: [[1.3, 0.8], [1.3, 0]], b: 5, debljina: 3 }, { lin: [[3.2, 0.8], [3.2, 0]], b: 5, debljina: 3 }, mera(-2.8, 0, -2.8, 2, '2 m', { oAt: [-3.6, 1] }), mera(3.8, 0, 3.8, 0.8, '0,8 m', { oAt: [4.6, 0.4] }), { lin: [[-0.5, 0.8], [1, 0.8]], b: 3, isp: 1, debljina: 1.5, k: 1, id: 'h' }, mera(0, 0.8, 0, 2, '1,2 m', { k: 1, id: 'h', oAt: [0.8, 1.4] })], { velicina: 240 }));

  proveri(60 * g * 1000, 600000);
  Z(2, 'Planinarka mase $60 kg$ popne se od planinarskog doma na $500 m$ do vrha na $1 500 m$ nadmorske visine. Za koliko joj je porasla potencijalna energija? ($g = 10 m/s^{2}$)',
    ['$600 kJ$', '$900 kJ$', '$60 kJ$', '$6 000 kJ$'],
    [K('$Δh = 1 500 m − 500 m = 1 000 m$.'),
     K('$ΔE_{p} = 60 · 10 · 1 000 J = 600 000 J = 600 kJ$ – otprilike koliko energije daje četvrtina čokolade od $100 g$ (a mišići pri penjanju potroše i nekoliko puta više).')]);

  proveri(1000 * g * 50, 500000);
  Z(2, 'Iza brane hidroelektrane voda je $50 m$ iznad turbina. Kolika je potencijalna energija $1 m^{3}$ vode u odnosu na turbine? ($ρ = 1 000 kg/m^{3}$, $g = 10 m/s^{2}$)',
    ['$500 kJ$', '$50 kJ$', '$5 kJ$', '$5 000 kJ$'],
    [K('Masa: $1 m^{3}$ vode ima $1 000 kg$.'),
     K('$E_{p} = 1 000 · 10 · 50 J = 500 000 J = 500 kJ$ – to se u turbinama pretvara u električnu energiju.')],
    S('energija', { tip: 'staza' }));

  Z(3, 'Telo ima potencijalnu energiju $400 J$. Kolika će biti njegova potencijalna energija ako mu se masa udvostruči, a visina smanji $4$ puta?',
    ['$200 J$', '$800 J$', '$400 J$', '$100 J$'],
    [K('$E_{p} = m g h$: dvostruka masa – dvostruka energija; četiri puta manja visina – četiri puta manja.'),
     K('$400 J · 2 : 4 = 200 J$.')]);

  Z(1, 'Gde je potencijalna energija veća: kod tega od $2 kg$ na visini $5 m$ ili kod tega od $5 kg$ na visini $2 m$? ($g = 10 m/s^{2}$)',
    ['Jednake su – po $100 J$', 'Kod tega od $5 kg$', 'Kod tega od $2 kg$', 'Ne može se uporediti'],
    [K('$E_{p1} = 2 · 10 · 5 = 100 J$.'),
     K('$E_{p2} = 5 · 10 · 2 = 100 J$ – jednake.')],
    null, { crtez: G(stubovi([['2 kg, 5 m', 100, 0], ['5 kg, 2 m', 100, 2]], { jedinica: 'J', vis: 3, sir: 2.4, razmak: 1, k: [1, 2] }), { velicina: 200 }) });

  proveri(120000 - 600 * g * 15, 30000);
  Z(3, 'Motor lifta izvrši rad od $120 kJ$ da bi podigao kabinu mase $600 kg$ za $15 m$. Koliko energije se izgubilo (na trenje i zagrevanje)? ($g = 10 m/s^{2}$)',
    ['$30 kJ$', '$90 kJ$', '$120 kJ$', '$0 kJ$'],
    [K('Korisno: porast potencijalne energije kabine $E_{p} = 600 · 10 · 15 J = 90 000 J = 90 kJ$.'),
     K('Izgubljeno: $120 kJ − 90 kJ = 30 kJ$.', ['q'])],
    S('dizanje', { visina: 15, e: '🛗', o: '600 kg' }),
    { crtez: G(stubovi([['A', 120, 4], ['Ep', 90, 0], ['Q', 30, 5]], { jedinica: 'kJ', vis: 4, sir: 1.5, razmak: 0.8, k: [0, 1, 2], id: [null, null, 'q'] }), { velicina: 220 }) });

  // ════════════════ 17. Zakon održanja mehaničke energije ════════════════
  L('Zakon održanja mehaničke energije');
  proveri(0.2 * g * 5, 10);
  Z(1, 'Jabuka mase $0,2 kg$ padne sa grane visine $5 m$. Kolika je njena kinetička energija u trenutku udara u zemlju? (Otpor vazduha zanemari, $g = 10 m/s^{2}$.)',
    ['$10 J$', '$1 J$', '$5 J$', '$0 J$'],
    [K('Na vrhu: $E_{p} = 0,2 · 10 · 5 = 10 J$, $E_{k} = 0$.', ['p']),
     K('Tokom pada potencijalna energija prelazi u kinetičku, a zbir ostaje isti.'),
     K('Pri udaru: $E_{p} = 0$, pa je $E_{k} = 10 J$.', ['k'])],
    S('pad', { tip: 'slobodan', visina: 5, brzina: false }),
    { crtez: G(energije(10, 0, null, { k: [0, 0], id: ['p', 'k'] }).concat(energije(0, 10, null, { k: 3, id: 'k' }).map((e) => ({ ...e, k: 3, ...(e.lin ? { lin: e.lin.map(([x, y]) => [x + 5, y]) } : { at: [e.at[0] + 5, e.at[1]] }) }))).concat([T('~vrh', 1, 4.6), T('~dole', 6, 4.6, { k: 3 })]), { velicina: 220 }) });

  proveri(Math.sqrt(2 * g * 20), 20);
  Z(2, 'Telo slobodno pada sa visine $20 m$. Primenom zakona održanja energije izračunaj brzinu pri udaru u tlo. ($g = 10 m/s^{2}$)',
    ['$20 m/s$', '$400 m/s$', '$200 m/s$', '$14 m/s$'],
    [K('$m g h = {m v^{2}|2}$ – masa se skrati!'),
     K('$v^{2} = 2 g h = 2 · 10 · 20 = 400$ ⇒ $v = 20 m/s$.')],
    S('energija', { tip: 'odskok' }));

  proveri(Math.sqrt(2 * g * 0.45), 3);
  Z(2, 'Kuglica klatna podignuta je tako da je $45 cm$ iznad najnižeg položaja i puštena. Kolika joj je brzina u najnižoj tački? ($g = 10 m/s^{2}$)',
    ['$3 m/s$', '$9 m/s$', '$30 m/s$', '$0,9 m/s$'],
    [K('Potencijalna energija na vrhu prelazi u kinetičku na dnu: $m g h = {m v^{2}|2}$.'),
     K('$v^{2} = 2 · 10 · 0,45 = 9$ ⇒ $v = 3 m/s$. (Pazi: $45 cm = 0,45 m$.)')],
    S('klatno', { ugao: 50, energija: true, brzina: true }));

  proveri(Math.sqrt(2 * g * 1.8), 6);
  Z(2, 'Skejter kreće iz mirovanja sa ivice rampe visoke $1,8 m$. Kolikom brzinom prolazi kroz najnižu tačku? (Trenje zanemari, $g = 10 m/s^{2}$.)',
    ['$6 m/s$', '$36 m/s$', '$18 m/s$', '$3,6 m/s$'],
    [K('$v^{2} = 2 g h = 2 · 10 · 1,8 = 36$.'),
     K('$v = 6 m/s$ ($21,6 km/h$).')],
    S('energija', { tip: 'staza' }));

  proveri((12 * 12) / (2 * g), 7.2);
  Z(3, 'Loptu bacimo vertikalno uvis brzinom $12 m/s$. Do koje visine će se popeti? (Otpor vazduha zanemari, $g = 10 m/s^{2}$.)',
    ['$7,2 m$', '$14,4 m$', '$1,2 m$', '$72 m$'],
    [K('U najvišoj tački sva kinetička energija prešla je u potencijalnu: ${m v^{2}|2} = m g h$.'),
     K('$h = {v^{2}|2 g} = {144|20} m = 7,2 m$.', [], S('pad', { tip: 'navise', v0: 12, strob: 0.4 }))],
    G([tlo(-2, 2, 0), T('🏐', 0, 0.4, { vel: 26 }), F(0.8, 0.4, 0, 2.5, { o: '12 m/s', b: 1 }), mera(-1.4, 0, -1.4, 5, 'h = ?', { oAt: [-2.3, 2.5] })], { velicina: 160 }));

  Z(2, 'Telo slobodno pada sa visine $10 m$. Na kojoj visini su mu kinetička i potencijalna energija jednake?',
    ['$5 m$', '$2,5 m$', '$7,5 m$', '$0 m$'],
    [K('Ukupna energija je stalna: $E = m g · 10 m$.'),
     K('Ako su jednake, svaka je polovina ukupne: $m g h = {1|2} m g · 10 m$ ⇒ $h = 5 m$.')],
    S('pad', { tip: 'slobodan', visina: 10, brzina: false, sat: false }));

  proveri(2 * g * (10 - 4), 120);
  Z(3, 'Telo mase $2 kg$ pada sa visine $10 m$. Kolika je njegova kinetička energija kad se nalazi na visini $4 m$? ($g = 10 m/s^{2}$)',
    ['$120 J$', '$80 J$', '$200 J$', '$60 J$'],
    [K('Ukupna energija: $E = m g h_{0} = 2 · 10 · 10 = 200 J$.'),
     K('Na $4 m$: $E_{p} = 2 · 10 · 4 = 80 J$.', ['p']),
     K('$E_{k} = 200 J − 80 J = 120 J$.', ['k'])],
    null, { crtez: G(stubovi([['Ep', 80, 0], ['Ek', 120, 1], ['E', 200, 4]], { jedinica: 'J', vis: 4, sir: 1.4, razmak: 0.8, k: [2, 3, 1], id: ['p', 'k', null] }), { velicina: 220 }) });

  proveri(Math.sqrt(2 * g * (0.8 - 0.35)), 3);
  Z(3, 'Kuglica kreće iz mirovanja sa visine $80 cm$, spušta se kroz žleb i penje se na brežuljak visok $35 cm$. Kolika joj je brzina na vrhu brežuljka? (Trenje zanemari, $g = 10 m/s^{2}$.)',
    ['$3 m/s$', '$4 m/s$', '$2,6 m/s$', '$0 m/s$'],
    [K('Kinetičku energiju na vrhu brežuljka daje samo razlika visina: $Δh = 0,8 m − 0,35 m = 0,45 m$.'),
     K('$v^{2} = 2 g Δh = 2 · 10 · 0,45 = 9$ ⇒ $v = 3 m/s$.')],
    S('energija', { tip: 'staza' }));

  proveri(0.5 * g * (5 - 3.2), 9);
  Z(3, 'Lopta mase $0,5 kg$ padne sa visine $5 m$ i odskoči do visine $3,2 m$. Koliko mehaničke energije je prešlo u toplotu (unutrašnju energiju)? ($g = 10 m/s^{2}$)',
    ['$9 J$', '$16 J$', '$25 J$', '$1,8 J$'],
    [K('Na početku: $E_{p} = 0,5 · 10 · 5 = 25 J$; posle odskoka: $0,5 · 10 · 3,2 = 16 J$.'),
     K('Izgubljeno: $25 J − 16 J = 9 J$ – lopta i tlo se malo zagreju, a čuje se i udarac.', ['q'])],
    S('energija', { tip: 'odskok' }),
    { crtez: G(stubovi([['~pre', 25, 0], ['~posle', 16, 0], ['Q', 9, 5]], { jedinica: 'J', vis: 4, sir: 1.4, razmak: 0.8, k: [0, 0, 2], id: [null, null, 'q'] }), { velicina: 220 }) });

  Z(1, 'Šta se dešava sa energijom tela koje slobodno pada (bez otpora vazduha)?',
    ['$E_{p}$ opada, $E_{k}$ raste, zbir je stalan', '$E_{p}$ i $E_{k}$ rastu', '$E_{p}$ raste, $E_{k}$ opada', 'Obe opadaju'],
    [K('Telo gubi visinu – potencijalna energija opada.'),
     K('Brzina raste – kinetička energija raste za isto toliko; ukupna mehanička energija se održava.')],
    S('energija', { tip: 'staza' }));

  // ════════════════ 18. Snaga i koeficijent korisnog dejstva ════════════════
  L('Snaga i koeficijent korisnog dejstva');
  proveri(6000 / 20, 300);
  Z(1, 'Motor izvrši rad od $6 000 J$ za $20 s$. Kolika je njegova snaga?',
    ['$300 W$', '$120 kW$', '$3 W$', '$6 020 W$'],
    [K('Snaga je rad u jedinici vremena: $P = {A|t}$.'),
     K('$P = {6 000 J|20 s} = 300 W$ (vat).')]);

  proveri((200 * g * 10) / 20, 1000);
  Z(1, 'Dizalica podigne teret mase $200 kg$ na visinu $10 m$ za $20 s$. Kolika je njena snaga? ($g = 10 m/s^{2}$)',
    ['$1 kW$', '$100 W$', '$20 kW$', '$400 W$'],
    [K('Rad: $A = m g h = 200 · 10 · 10 J = 20 000 J$.'),
     K('$P = {20 000 J|20 s} = 1 000 W = 1 kW$.')],
    S('dizanje', { visina: 10, e: '📦', o: '200 kg', vreme: 20, sat: true }));

  proveri((50 * g * 6) / 10, 300);
  Z(2, 'Dečak mase $50 kg$ potrči uz stepenice i za $10 s$ popne se $6 m$ više. Kolika je bila njegova snaga? ($g = 10 m/s^{2}$)',
    ['$300 W$', '$30 W$', '$3 000 W$', '$83 W$'],
    [K('Rad protiv sile teže: $A = 50 · 10 · 6 J = 3 000 J$.'),
     K('$P = {3 000 J|10 s} = 300 W$ – kao jača bušilica.')],
    S('dizanje', { tip: 'stepenice', visina: 6, stepenika: 10, e: '🏃', vreme: 10, sat: true }));

  proveri((400 * g * 15) / 2000, 30);
  Z(2, 'Za koje vreme motor snage $2 kW$ podigne teret mase $400 kg$ na visinu $15 m$? ($g = 10 m/s^{2}$)',
    ['$30 s$', '$3 s$', '$300 s$', '$0,03 s$'],
    [K('Potreban rad: $A = 400 · 10 · 15 J = 60 000 J$.'),
     K('$t = {A|P} = {60 000 J|2 000 W} = 30 s$.')],
    S('dizanje', { visina: 15, e: '🧱', o: '400 kg' }));

  proveri(3000 * 25, 75000);
  Z(2, 'Automobil vozi stalnom brzinom $25 m/s$, a vučna sila motora je $3 000 N$. Kolika je snaga motora?',
    ['$75 kW$', '$120 W$', '$7,5 kW$', '$750 kW$'],
    [K('Za $1 s$ automobil pređe $25 m$, pa motor svake sekunde izvrši rad $3 000 N · 25 m = 75 000 J$.'),
     K('$P = F · v = 3 000 N · 25 m/s = 75 000 W = 75 kW$ (oko $100$ „konjskih snaga“).')],
    S('kretanje', { tela: [{ e: '🚗', v: 25 }], duzina: 100, podeok: 25, vektor: true, sat: true }));

  proveri(4000 / 5000, 0.8);
  Z(2, 'Motor potroši (uloži) $5 000 J$ energije, a koristan rad je $4 000 J$. Koliki je koeficijent korisnog dejstva?',
    ['$80 %$', '$125 %$', '$20 %$', '$1 000 %$'],
    [K('$η = {A_{korisno}|A_{uloženo}} = {4 000 J|5 000 J} = 0,8$.', ['k']),
     K('$η = 80 %$; ostalih $20 %$ ($1 000 J$) ode na zagrevanje i trenje.', ['q'])],
    null,
    { crtez: G(stubovi([['~uloženo', 5000, 4], ['~korisno', 4000, 2], ['~gubici', 1000, 5]], { jedinica: 'J', vis: 4, sir: 1.6, razmak: 0.8, k: [0, 1, 2], id: [null, 'k', 'q'] }), { velicina: 220 }) });

  proveri((600 * g * 10) / 60 / 0.75, 1333.3333333333333);
  Z(3, 'Pumpa za $1 min$ podigne $600 l$ vode na visinu $10 m$. Koeficijent korisnog dejstva pumpe je $75 %$. Kolika je snaga koju pumpa uzima iz mreže? ($g = 10 m/s^{2}$)',
    ['$≈ 1,33 kW$', '$1 kW$', '$0,75 kW$', '$80 kW$'],
    [K('Koristan rad: $600 l$ vode ima $600 kg$; $A = 600 · 10 · 10 J = 60 000 J$.'),
     K('Korisna snaga: $P_{k} = {60 000 J|60 s} = 1 000 W$.'),
     K('Uložena snaga: $P_{u} = {P_{k}|η} = {1 000 W|0,75} ≈ 1 333 W ≈ 1,33 kW$.')],
    S('dizanje', { visina: 10, e: '🪣', o: '600 kg' }));

  proveri((150 * g * 20) / 750, 40);
  Z(2, 'Konj razvija snagu oko $750 W$. Za koje vreme bi podigao teret mase $150 kg$ na visinu $20 m$ (preko kotura, bez gubitaka)? ($g = 10 m/s^{2}$)',
    ['$40 s$', '$4 s$', '$400 s$', '$5 s$'],
    [K('$A = 150 · 10 · 20 J = 30 000 J$.'),
     K('$t = {30 000 J|750 W} = 40 s$. (Jedna „konjska snaga“ je oko $736 W$.)')],
    S('dizanje', { visina: 20, e: '📦', o: '150 kg' }));

  proveri((600 * 2) / (400 * 4), 0.75);
  Z(3, 'Pomoću sistema koturova teret težine $600 N$ podignemo $2 m$, a pri tom vučemo uže silom $400 N$ na dužini od $4 m$. Koliki je koeficijent korisnog dejstva?',
    ['$75 %$', '$67 %$', '$150 %$', '$133 %$'],
    [K('Koristan rad: $600 N · 2 m = 1 200 J$.'),
     K('Uložen rad: $400 N · 4 m = 1 600 J$.'),
     K('$η = {1 200|1 600} = 0,75 = 75 %$. Koturovi štede silu, ali ne i rad – uvek je $η < 100 %$.')],
    S('dizanje', { visina: 2, e: '🧱', o: '600 N', sile: true, F: 'F = 400 N', Fg: '600 N' }));

  proveri(60 * 60, 3600);
  Z(1, 'Sijalica snage $60 W$ svetli $1 min$. Koliko energije potroši?',
    ['$3 600 J$', '$60 J$', '$1 J$', '$360 J$'],
    [K('Snaga od $60 W$ znači $60 J$ u svakoj sekundi.'),
     K('$E = P · t = 60 W · 60 s = 3 600 J$.')]);
};
