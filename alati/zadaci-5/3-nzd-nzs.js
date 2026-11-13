// Tema 3: Prirodni brojevi i deljivost – drugi deo (lekcije 3.1–3.4)
module.exports = ({ L, Z, K, G, O, bez, r, proveri, nzd, nzs, skok, skokovi }) => {
  const pr = (x, y, w, h, x2 = {}) => ({ lin: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].map((p) => p.map(r)), zatv: 1, ...x2 });
  const jeProst = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  const cinioci = (n) => { const c = []; for (let d = 2; n > 1; d++) while (n % d === 0) { c.push(d); n /= d; } return c; };

  // Eratostenovo sito od 1 do n (10 u redu): sadržaoci prostih iz `prosti` precrtavaju se redom (korak k = redni broj)
  function sito(n, prosti, { k0 = 1, kraj } = {}) {
    const e = [];
    const boje = [1, 2, 5, 4];
    const mesto = (x) => [((x - 1) % 10) * 1.1, -Math.floor((x - 1) / 10) * 1.1];
    for (let x = 1; x <= n; x++) {
      const [a, b] = mesto(x);
      // čiji je sadržalac (najmanji prost činilac iz liste, a da nije sam taj prost broj)
      const i = prosti.findIndex((p) => x !== p && x % p === 0);
      if (i >= 0) e.push(pr(a - 0.5, b - 0.5, 1, 1, { b: boje[i], gusto: 1, k: k0 + i, id: 's' + prosti[i] }));
      e.push({ tx: String(x), at: [a, b - 0.15], ...(jeProst(x) && kraj !== undefined ? {} : {}) });
      if (kraj !== undefined && jeProst(x)) e.push(pr(a - 0.5, b - 0.5, 1, 1, { b: 3, prazno: 1, k: kraj, id: 'pr', debljina: 2 }));
    }
    return G(O, e, { ...bez, velicina: 300 });
  }
  // drvo činilaca: n → a · b … (crta se korak po korak)
  function drvo(n, { k0 = 1 } = {}) {
    const e = [{ tx: String(n), at: [0, 0], vel: 20 }];
    let x = 0, y = 0, br = n, i = 0;
    for (const p of cinioci(n).slice(0, -1)) {
      const ostatak = br / p, kk = k0 + i;
      e.push({ lin: [[x, y - 0.3], [x - 1, y - 1.5]], b: 4, k: kk }, { lin: [[x, y - 0.3], [x + 1, y - 1.5]], b: 4, k: kk });
      e.push({ tx: String(p), at: [x - 1.2, y - 1.95], b: 1, vel: 19, k: kk, id: 'p' }, { tx: String(ostatak), at: [x + 1.2, y - 1.95], vel: 19, k: kk });
      x += 1.2; y -= 1.8; br = ostatak; i++;
    }
    return { e, koraka: i };
  }
  // Euklid: pravougaonik a×b se seče na najveće moguće kvadrate (svaki korak deljenja = nova boja)
  function euklid(a, b, s = 0.25) {
    const e = [pr(0, 0, a * s, b * s, { b: 4, prazno: 1 })];
    let [x, y, w, h] = [0, 0, a, b], korak = 1, boja = 0;
    while (w > 0 && h > 0) {
      if (w >= h) { const q = Math.floor(w / h); for (let i = 0; i < q; i++) e.push(pr((x + i * h) * s, y * s, h * s, h * s, { b: boja, gusto: 1, k: korak, crtaj: 1, kasni: 0.2 + i * 0.25, trajanje: 0.5 })); x += q * h; w -= q * h; }
      else { const q = Math.floor(h / w); for (let i = 0; i < q; i++) e.push(pr(x * s, (y + i * w) * s, w * s, w * s, { b: boja, gusto: 1, k: korak, crtaj: 1, kasni: 0.2 + i * 0.25, trajanje: 0.5 })); y += q * w; h -= q * w; }
      korak++; boja = [1, 2, 5, 3][korak % 4];
    }
    e.push({ tx: String(a), at: [a * s / 2, -0.6] }, { tx: String(b), at: [-0.7, b * s / 2] });
    return G(O, e, { ...bez, velicina: 240 });
  }

  // ════════════════ 3.1 Prosti i složeni brojevi ════════════════
  L('Prosti i složeni brojevi; Eratostenovo sito');

  Z(1, 'Koliko ima parnih prostih brojeva?',
    ['jedan', 'nijedan', 'dva', 'beskonačno mnogo'],
    [K('Svaki paran broj je deljiv sa $2$.'),
     K('Jedini paran broj čiji su jedini delioci $1$ i on sam je $2$. Svi ostali parni brojevi imaju bar tri delioca ($1$, $2$ i sebe).')]);

  Z(1, 'Koliko ima prostih brojeva od $1$ do $30$?',
    ['$10$', '$11$', '$9$', '$15$'],
    [K('Eratostenovo sito: precrtavamo sadržaoce broja $2$ (osim same dvojke)…', ['s2']),
     K('…zatim sadržaoce broja $3$ i broja $5$. (Sadržaoci broja $7$ do $30$ su već precrtani.)', ['s3', 's5']),
     K('Broj $1$ nije prost. Ostaju: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29$ – njih $10$.', ['pr'])],
    sito(30, [2, 3, 5], { kraj: 3 }));
  proveri([...Array(30)].map((_, i) => i + 1).filter(jeProst).length === 10, 'prosti do 30');

  Z(1, 'Koji je najmanji trocifreni prost broj?',
    ['$101$', '$100$', '$103$', '$111$'],
    [K('$100$ je paran. $101$: nije deljiv sa $2, 3$ (zbir cifara $2$), $5$, $7$ ($7 · 14 = 98$, $7 · 15 = 105$).'),
     K('Dovoljno je proveriti proste do $10$ (jer je $11 · 11 = 121 > 101$). Zato je $101$ prost.')]);

  Z(1, 'Koliki je zbir svih složenih brojeva prve desetice (od $1$ do $10$)?',
    ['$37$', '$27$', '$38$', '$40$'],
    [K('Prosti do $10$: $2, 3, 5, 7$. Broj $1$ nije ni prost ni složen.'),
     K('Složeni: $4, 6, 8, 9, 10$; zbir $= 37$.')],
    sito(10, [2, 3]));

  Z(2, 'Da li je broj $10 · 16 + 9 = 169$ prost?',
    ['ne, $169 = 13 · 13$', 'da, nije deljiv sa $2$, $3$ i $5$', 'ne, deljiv je sa $3$', 'ne, deljiv je sa $7$'],
    [K('Nije dovoljno proveriti samo $2$, $3$ i $5$! Treba proveriti sve proste brojeve čiji kvadrat nije veći od $169$.'),
     K('$7$: $169 = 7 · 24 + 1$ ✗; $11$: $169 = 11 · 15 + 4$ ✗; $13$: $13 · 13 = 169$ ✓'),
     K('Dakle $169$ je složen – kvadrat broja $13$ (kvadrat od $13 × 13$ kvadratića).', [], G(O, [pr(0, 0, 3.25, 3.25, { b: 0, gusto: 1 }), ...[...Array(12)].map((_, i) => ({ lin: [[(i + 1) * 0.25, 0], [(i + 1) * 0.25, 3.25]], b: 4, debljina: 0.8 })), ...[...Array(12)].map((_, i) => ({ lin: [[0, (i + 1) * 0.25], [3.25, (i + 1) * 0.25]], b: 4, debljina: 0.8 })), { tx: '13', at: [1.6, -0.4] }, { tx: '13', at: [-0.45, 1.6] }], { ...bez, velicina: 160 }))]);

  Z(2, 'Koliko ima prostih brojeva između $40$ i $50$?',
    ['$3$', '$2$', '$4$', '$5$'],
    [K('Parni i oni koji se završavaju sa $5$ otpadaju. Ostaju $41, 43, 47, 49$.'),
     K('$49 = 7 · 7$ je složen. Prosti su $41$, $43$ i $47$ – tri broja.', ['pr'])],
    (() => { const e = []; for (let x = 41; x <= 49; x++) { e.push({ tx: String(x), at: [(x - 41) * 1.1, 0], vel: 18 }); if ([41, 43, 47].includes(x)) e.push(pr((x - 41) * 1.1 - 0.5, -0.5, 1, 1, { b: 2, gusto: 1, k: 2, id: 'pr' })); } return G(O, e, { ...bez, velicina: 280 }); })());

  Z(2, 'Koliki je zbir najvećeg dvocifrenog prostog broja i najmanjeg trocifrenog složenog broja?',
    ['$197$', '$198$', '$196$', '$200$'],
    [K('Najveći dvocifreni prost: $99 = 9 · 11$, $98$ paran, $97$ prost ✓.'),
     K('Najmanji trocifreni složen: $100$.'),
     K('$97 + 100 = 197$.')]);

  Z(2, 'Da li je broj $391$ prost?',
    ['ne, $391 = 17 · 23$', 'da', 'ne, deljiv je sa $3$', 'ne, deljiv je sa $7$'],
    [K('Zbir cifara $13$ – nije deljiv sa $3$. Ni sa $2$, $5$, $7$ ($7 · 55 = 385$, ostatak $6$), $11$ ($11 · 35 = 385$, ostatak $6$), $13$ ($13 · 30 = 390$, ostatak $1$).'),
     K('$17 · 23 = 391$ ✓ – broj je složen.')]);
  proveri(17 * 23 === 391, '391');

  Z(3, 'Zašto je broj $1 001$ složen?',
    ['jer je $1 001 = 7 · 11 · 13$', 'jer je neparan', 'jer mu je zbir cifara $2$', 'nije složen, prost je'],
    [K('Zbir cifara je $2$ – nije deljiv sa $3$; ne završava se parnom cifrom ni sa $5$.'),
     K('Probamo $7$: $1 001 : 7 = 143$. A $143 = 11 · 13$.'),
     K('$1 001 = 7 · 11 · 13$ – zato je npr. $abcabc = abc · 1 001$ uvek deljiv sa $7$, $11$ i $13$!')]);

  Z(3, '$p$ i $q$ su prosti brojevi veći od $2$. Šta je sigurno tačno za broj $p + q$?',
    ['složen je (paran i veći od $2$)', 'prost je', 'deljiv je sa $3$', 'neparan je'],
    [K('Svi prosti brojevi veći od $2$ su neparni.'),
     K('Zbir dva neparna broja je paran, a pošto je $p + q ≥ 3 + 3 = 6 > 2$, ima delioce $1$, $2$ i sebe – složen je.')]);

  // ════════════════ 3.2 Rastavljanje na proste činioce ════════════════
  L('Rastavljanje na proste činioce');

  {
    const d = drvo(360);
    Z(1, 'Kako se broj $360$ rastavlja na proste činioce?',
      ['$2 · 2 · 2 · 3 · 3 · 5$', '$2 · 2 · 3 · 3 · 10$', '$2 · 3 · 6 · 10$', '$2 · 2 · 2 · 3 · 5 · 5$'],
      [K('Delimo redom najmanjim prostim brojem dok može: $360 : 2 = 180$, $180 : 2 = 90$, $90 : 2 = 45$.', ['p']),
       K('$45 : 3 = 15$, $15 : 3 = 5$, a $5$ je prost.'),
       K('$360 = 2 · 2 · 2 · 3 · 3 · 5 = 2^{3} · 3^{2} · 5$. ($10$ i $6$ nisu prosti!)')],
      G(O, d.e.map((x) => (x.k ? { ...x, k: x.k <= 3 ? 1 : 2 } : x)), { ...bez, velicina: 220 }));
  }

  Z(1, 'Rastavi broj $105$ na proste činioce.',
    ['$3 · 5 · 7$', '$5 · 21$', '$3 · 35$', '$3 · 5 · 9$'],
    [K('Zbir cifara $6$: deljiv sa $3$. $105 : 3 = 35$.'),
     K('$35 = 5 · 7$, pa je $105 = 3 · 5 · 7$.')],
    G(O, drvo(105).e, { ...bez, velicina: 160 }));

  Z(1, 'Snežana je $91$ salvetu podelila drugaricama, svakoj jednako (više od jedne, a ima više od jedne drugarice). Koliko salveta je dobila svaka?',
    ['$7$ ili $13$', 'samo $7$', 'samo $13$', '$91$'],
    [K('Broj drugarica i broj salveta po drugarici su činioci broja $91$, oba veća od $1$.'),
     K('$91 = 7 · 13$ – i $7$ i $13$ su prosti. Dakle: $7$ drugarica po $13$ salveta, ili $13$ drugarica po $7$.')]);

  Z(2, 'Svi prosti činioci nekog broja su $2$, $5$, $7$, $11$ i $13$. Koji je najmanji takav broj?',
    ['$10 010$', '$1 001$', '$770$', '$2 002$'],
    [K('Najmanji broj dobijamo kad se svaki prost činilac pojavi tačno jednom.'),
     K('$2 · 5 · 7 · 11 · 13 = 10 · 1 001 = 10 010$.')]);

  Z(2, 'Koliko različitih prostih činilaca ima broj $210$?',
    ['$4$', '$3$', '$5$', '$2$'],
    [K('$210 = 2 · 105 = 2 · 3 · 35 = 2 · 3 · 5 · 7$.'),
     K('Četiri različita prosta činioca: $2, 3, 5, 7$.')],
    G(O, drvo(210).e.map((x) => (x.k ? { ...x, k: Math.min(x.k, 2) } : x)), { ...bez, velicina: 180 }));

  Z(2, 'Koji je najveći prost činilac broja $1 287$?',
    ['$13$', '$11$', '$143$', '$9$'],
    [K('Zbir cifara $18$: deljiv sa $9$. $1 287 : 9 = 143$.'),
     K('$143 = 11 · 13$, pa je $1 287 = 3 · 3 · 11 · 13$.'),
     K('Najveći prost činilac je $13$ ($143$ nije prost!).')]);
  proveri(1287 === 9 * 11 * 13, '1287');

  Z(2, 'Proizvod $24 · 34$ rastavljen na proste činioce je:',
    ['$2^{4} · 3 · 17$', '$2^{3} · 3 · 17$', '$2^{2} · 3 · 17$', '$2^{4} · 3^{2} · 17$'],
    [K('Ne moramo da množimo – rastavimo svaki činilac: $24 = 2^{3} · 3$, $34 = 2 · 17$.'),
     K('Spojimo: $2^{3} · 3 · 2 · 17 = 2^{4} · 3 · 17$ (ukupno četiri dvojke).')]);

  Z(3, 'Da li postoji prirodan broj kome je proizvod cifara jednak $231$?',
    ['ne, jer je $231 = 3 · 7 · 11$, a $11$ nije cifra', 'da, npr. $3711$', 'da, $231$', 'ne, jer je $231$ neparan'],
    [K('$231 = 3 · 7 · 11$.'),
     K('Svaka cifra je od $0$ do $9$, pa u njenom rastavljanju nema prostih činilaca većih od $7$.'),
     K('Prost činilac $11$ ne može da dođe ni iz jedne cifre – takav broj ne postoji.')]);

  Z(3, 'Koliko delilaca ima broj $72 = 2^{3} · 3^{2}$?',
    ['$12$', '$6$', '$5$', '$10$'],
    [K('Svaki delilac je oblika $2^{a} · 3^{b}$, gde je $a$ od $0$ do $3$ (4 mogućnosti), a $b$ od $0$ do $2$ (3 mogućnosti).'),
     K('Tablica: redovi su stepeni dvojke, kolone stepeni trojke – $4 · 3 = 12$ delilaca.', [], G(O, [[1, 2, 4, 8].map((a, i) => [1, 3, 9].map((b, j) => ({ tx: String(a * b), at: [j * 1.6, -i * 1], b: 2, crtaj: 0, kasni: 0.2 + (i * 3 + j) * 0.15 }))), { tx: '·1', at: [0, 1] }, { tx: '·3', at: [1.6, 1] }, { tx: '·9', at: [3.2, 1] }].flat(2), { ...bez, velicina: 140 }))]);
  proveri([...Array(72)].filter((_, i) => 72 % (i + 1) === 0).length === 12, 'delioci 72');

  Z(3, 'Koji je najmanji prirodan broj koji ima tačno $6$ delilaca?',
    ['$12$', '$32$', '$30$', '$36$'],
    [K('Broj delilaca $2^{a} · 3^{b} · …$ je $(a + 1)(b + 1)…$. Za $6$: $p^{5}$ ili $p^{2} · q$.'),
     K('$2^{5} = 32$, a $2^{2} · 3 = 12$. Manji je $12$.'),
     K('Provera: delioci broja $12$ su $1, 2, 3, 4, 6, 12$ ✓')]);

  // ════════════════ 3.3 NZD ════════════════
  L('Najveći zajednički delilac; Euklidov algoritam');

  Z(1, 'Koji je $NZD(24, 36)$?',
    ['$12$', '$6$', '$72$', '$4$'],
    [K('Delioci broja $24$: $1, 2, 3, 4, 6, 8, 12, 24$.'),
     K('Delioci broja $36$: $1, 2, 3, 4, 6, 9, 12, 18, 36$.'),
     K('Zajednički: $1, 2, 3, 4, 6, 12$ – najveći je $12$.')]);

  Z(1, 'Učiteljica je podelila $40$ svezaka i $60$ olovaka tako da svaki đak dobije jednako svezaka i jednako olovaka. Koliko najviše đaka može biti?',
    ['$20$', '$10$', '$120$', '$100$'],
    [K('Broj đaka mora da deli i $40$ i $60$ – tražimo njihov $NZD$.'),
     K('$40 = 2^{3} · 5$, $60 = 2^{2} · 3 · 5$, $NZD = 2^{2} · 5 = 20$.'),
     K('$20$ đaka: svako dobija $2$ sveske i $3$ olovke.')]);

  Z(2, 'Euklidovim algoritmom odredi $NZD(80, 176)$. Pravougaonik $176 × 80$ sečemo na najveće moguće kvadrate.',
    ['$16$', '$8$', '$80$', '$32$'],
    [K('$176 = 2 · 80 + 16$: odsecamo $2$ kvadrata $80 × 80$, ostaje pravougaonik $16 × 80$.'),
     K('$80 = 5 · 16 + 0$: ostatak se tačno deli na $5$ kvadrata $16 × 16$.'),
     K('Poslednji nenulti ostatak je $NZD(80, 176) = 16$ – stranica najmanjeg kvadrata.')],
    euklid(176, 80, 0.035));
  proveri(nzd(80, 176) === 16, 'nzd 80 176');

  Z(2, 'Pravougaona soba $360 cm × 270 cm$ popločava se jednakim kvadratnim pločicama, bez sečenja. Kolika je najveća moguća stranica pločice?',
    ['$90 cm$', '$30 cm$', '$45 cm$', '$270 cm$'],
    [K('Stranica pločice mora da deli i $360$ i $270$: tražimo $NZD(360, 270)$.'),
     K('$360 = 1 · 270 + 90$, $270 = 3 · 90 + 0$ ⇒ $NZD = 90$.'),
     K('Pločice $90 cm$: $4 · 3 = 12$ pločica.', [], G(O, [...[...Array(12)].map((_, i) => pr((i % 4) * 0.9, Math.floor(i / 4) * 0.9, 0.9, 0.9, { b: i % 2 ? 0 : 2, gusto: 1, crtaj: 1, kasni: 0.2 + i * 0.15, trajanje: 0.4 })), { tx: '360', at: [1.8, -0.5] }, { tx: '270', at: [-0.6, 1.35] }], { ...bez, velicina: 200 }))],
    euklid(360, 270, 0.01));

  Z(2, 'Koji su brojevi uzajamno prosti?',
    ['$14$ i $15$', '$70$ i $91$', '$65$ i $156$', '$21$ i $35$'],
    [K('Uzajamno prosti brojevi imaju $NZD = 1$.'),
     K('$70$ i $91$: zajednički $7$; $65$ i $156$: zajednički $13$; $21$ i $35$: zajednički $7$.'),
     K('$14 = 2 · 7$ i $15 = 3 · 5$ nemaju zajedničkih prostih činilaca ✓ (uzastopni brojevi su uvek uzajamno prosti).')]);

  Z(2, 'Stolar ima drveni kvadar $15 cm × 21 cm × 33 cm$ i želi da ga bez otpada iseče na jednake kocke što veće ivice. Kolika je ivica?',
    ['$3 cm$', '$1 cm$', '$5 cm$', '$7 cm$'],
    [K('Ivica mora da deli sve tri dimenzije: $NZD(15, 21, 33)$.'),
     K('$15 = 3 · 5$, $21 = 3 · 7$, $33 = 3 · 11$: zajednički je samo $3$.'),
     K('Kocke ivice $3 cm$: $5 · 7 · 11 = 385$ kocki.')]);

  Z(3, 'Kojim najvećim brojem treba podeliti $178$ i $199$ da ostatak u oba slučaja bude $3$?',
    ['$7$', '$5$', '$3$', '$35$'],
    [K('Ako je ostatak $3$, onda je $178 − 3 = 175$ i $199 − 3 = 196$ deljivo tim brojem.'),
     K('$175 = 5^{2} · 7$, $196 = 2^{2} · 7^{2}$: $NZD = 7$.'),
     K('Provera: $178 = 7 · 25 + 3$, $199 = 7 · 28 + 3$ ✓ (i $7 > 3$, pa je ostatak ispravan).')]);
  proveri(178 % 7 === 3 && 199 % 7 === 3 && nzd(175, 196) === 7, '178 199');

  Z(3, 'Euklidovim algoritmom proveri da li su $104$ i $165$ uzajamno prosti. Koliki je poslednji nenulti ostatak?',
    ['$1$ – jesu uzajamno prosti', '$13$ – nisu', '$61$ – nisu', '$5$ – nisu'],
    [K('$165 = 1 · 104 + 61$, $104 = 1 · 61 + 43$, $61 = 1 · 43 + 18$.'),
     K('$43 = 2 · 18 + 7$, $18 = 2 · 7 + 4$, $7 = 1 · 4 + 3$, $4 = 1 · 3 + 1$, $3 = 3 · 1 + 0$.'),
     K('Poslednji nenulti ostatak je $1$: $NZD(104, 165) = 1$ – uzajamno su prosti.')]);
  proveri(nzd(104, 165) === 1, '104 165');

  Z(3, 'Ako je $a = NZD(120, 168)$ i $b = NZD(144, 264)$, šta važi?',
    ['$a = b$', '$a > b$', '$a < b$', '$a = 2b$'],
    [K('$120 = 2^{3} · 3 · 5$, $168 = 2^{3} · 3 · 7$ ⇒ $a = 2^{3} · 3 = 24$.'),
     K('$144 = 2^{4} · 3^{2}$, $264 = 2^{3} · 3 · 11$ ⇒ $b = 2^{3} · 3 = 24$.'),
     K('$a = b = 24$.')]);
  proveri(nzd(120, 168) === 24 && nzd(144, 264) === 24, 'a=b');

  // ════════════════ 3.4 NZS ════════════════
  L('Najmanji zajednički sadržalac; veza NZD i NZS');

  Z(1, 'Koji je $NZS(9, 12)$?',
    ['$36$', '$108$', '$3$', '$72$'],
    [K('Skačemo po $9$ (gore) i po $12$ (dole) od nule – prvi zajednički broj je $NZS$.', ['a', 'b']),
     K('Sadržaoci broja $9$: $9, 18, 27, 36$; broja $12$: $12, 24, 36$. Prvi zajednički: $36$.')],
    G(O, [{ osa: [0, 40], podela: 1, svaki: 4 }, ...skokovi(0, 9, 4, { h: 3, id: 'a', k: 1, razmak: 0.5 }), ...skokovi(0, 12, 3, { h: 3.5, ispod: true, boja: 2, id: 'b', k: 1, razmak: 0.66 })], { ...bez, velicina: 300 }));

  Z(1, 'Koji je najmanji broj deljiv sa $3$, $4$, $5$ i $6$?',
    ['$60$', '$360$', '$120$', '$30$'],
    [K('Tražimo $NZS(3, 4, 5, 6)$. $4 = 2^{2}$, $6 = 2 · 3$.'),
     K('Uzimamo svaki prost činilac sa najvećim izložiocem: $2^{2} · 3 · 5 = 60$. ($3 · 4 · 5 · 6 = 360$ je zajednički sadržalac, ali nije najmanji.)')]);

  Z(1, 'Dva autobusa polaze sa iste stanice u $8:00$. Prvi polazi na svakih $12$, a drugi na svakih $18$ minuta. Kada će ponovo krenuti zajedno?',
    ['u $8:36$', 'u $8:30$', 'u $8:06$', 'u $11:36$'],
    [K('Tražimo $NZS(12, 18)$: $12 = 2^{2} · 3$, $18 = 2 · 3^{2}$ ⇒ $NZS = 2^{2} · 3^{2} = 36$.'),
     K('Posle $36$ minuta: u $8:36$.', ['a', 'b'])],
    G(O, [{ osa: [0, 40], podela: 2, svaki: 3 }, ...skokovi(0, 12, 3, { h: 4, id: 'a', k: 2, razmak: 0.6 }), ...skokovi(0, 18, 2, { h: 5, ispod: true, boja: 2, id: 'b', k: 2, razmak: 0.9 })], { ...bez, velicina: 300 }));

  Z(2, 'Učenici se mogu podeliti u grupe po $6$ i u grupe po $8$, bez ostatka, a ima ih manje od $30$. Koliko je učenika?',
    ['$24$', '$48$', '$14$', '$12$'],
    [K('Broj učenika je zajednički sadržalac brojeva $6$ i $8$: $24, 48, …$'),
     K('Manje od $30$ je samo $24$.')]);

  Z(2, 'Proveri vezu $NZD(a, b) · NZS(a, b) = a · b$ za $a = 72$ i $b = 132$. Koliki je $NZS(72, 132)$?',
    ['$792$', '$9 504$', '$396$', '$12$'],
    [K('$72 = 2^{3} · 3^{2}$, $132 = 2^{2} · 3 · 11$: $NZD = 2^{2} · 3 = 12$.'),
     K('$NZS = 2^{3} · 3^{2} · 11 = 792$.'),
     K('Provera: $12 · 792 = 9 504 = 72 · 132$ ✓')]);
  proveri(nzs(72, 132) === 792 && 12 * 792 === 72 * 132, 'nzs 72 132');

  Z(2, 'Zupčanik sa $12$ zubaca okreće se zajedno sa zupčanikom od $20$ zubaca. Posle koliko zubaca će se obeleženi zupci ponovo sresti?',
    ['$60$', '$240$', '$4$', '$32$'],
    [K('Prvi zupčanik se vraća u početni položaj na svakih $12$ zubaca, drugi na svakih $20$.'),
     K('Oba istovremeno: $NZS(12, 20) = 60$ zubaca (prvi napravi $5$ krugova, drugi $3$).')]);

  Z(2, 'Koliko ima dvocifrenih zajedničkih sadržalaca brojeva $27$ i $6$?',
    ['$1$', '$2$', '$3$', '$0$'],
    [K('$NZS(27, 6) = 54$, a zajednički sadržaoci su $54, 108, …$'),
     K('Dvocifren je samo $54$.')]);

  Z(3, 'Koji je najmanji prirodan broj koji pri deljenju sa $16$ i sa $24$ daje ostatak $3$?',
    ['$51$', '$48$', '$387$', '$27$'],
    [K('Broj umanjen za $3$ je deljiv i sa $16$ i sa $24$ – sadržalac je $NZS(16, 24)$.'),
     K('$NZS(16, 24) = 48$, pa je traženi broj $48 + 3 = 51$.'),
     K('Provera: $51 = 16 · 3 + 3 = 24 · 2 + 3$ ✓')]);

  Z(3, 'Prednji točak kolica ima obim $80 cm$, a zadnji $200 cm$. Koliki je najkraći put posle kog oba točka naprave ceo broj obrtaja?',
    ['$4 m$', '$16 m$', '$2 m$', '$40 cm$'],
    [K('Put mora biti sadržalac i broja $80$ i broja $200$: $NZS(80, 200)$.'),
     K('$80 = 2^{4} · 5$, $200 = 2^{3} · 5^{2}$ ⇒ $NZS = 2^{4} · 5^{2} = 400 cm = 4 m$.'),
     K('Prednji napravi $5$, zadnji $2$ obrtaja.')]);

  Z(3, 'Izračunaj $NZS(24, NZD(90, 126))$.',
    ['$72$', '$18$', '$24$', '$432$'],
    [K('Prvo unutrašnje: $90 = 2 · 3^{2} · 5$, $126 = 2 · 3^{2} · 7$ ⇒ $NZD = 2 · 3^{2} = 18$.'),
     K('$NZS(24, 18)$: $24 = 2^{3} · 3$, $18 = 2 · 3^{2}$ ⇒ $2^{3} · 3^{2} = 72$.')]);
  proveri(nzs(24, nzd(90, 126)) === 72, 'nzs nzd');

  // ════════════════ dopune ════════════════
  L('Najveći zajednički delilac; Euklidov algoritam');
  Z(1, 'Koji je $NZD(15, 21)$?',
    ['$3$', '$105$', '$5$', '$7$'],
    [K('$15 = 3 · 5$, $21 = 3 · 7$.'),
     K('Zajednički prost činilac je samo $3$: $NZD(15, 21) = 3$.'),
     K('Euklidov algoritam na slici: $21 = 1 · 15 + 6$, $15 = 2 · 6 + 3$, $6 = 2 · 3$ – najmanji kvadrat ima stranicu $3$.')],
    euklid(21, 15, 0.25));
};
