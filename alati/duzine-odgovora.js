// Statistika: koliko često je tačan (prvi) odgovor najduži / najkraći među ponuđenima (slučajno ≈ 25%).
// Pokretanje: node alati/duzine-odgovora.js
const fs = require('fs'), path = require('path');
const K = process.argv[2] || require('path').join(__dirname, '..', 'kvizovi');
const ukupno = { n: 0, najduzi: 0, jedinoNajduzi: 0, najkraci: 0, rang: [0, 0, 0, 0], odnos: [] };
const po = {};
for (const d of fs.readdirSync(K)) {
  const f = path.join(K, d, 'kviz.json'); if (!fs.existsSync(f)) continue;
  const k = JSON.parse(fs.readFileSync(f, 'utf8'));
  const s = (po[d] = { n: 0, najduzi: 0, jedinoNajduzi: 0 });
  for (const p of k.pitanja) {
    if (p.vrsta === 'spoji' || !p.odgovori || p.odgovori.length !== 4) continue;
    const L = p.odgovori.map((o) => [...o].length), t = L[0];
    const vecih = L.slice(1).filter((x) => x > t).length;
    const max = Math.max(...L), min = Math.min(...L);
    s.n++; ukupno.n++;
    if (t === max) { s.najduzi++; ukupno.najduzi++; }
    if (t === max && L.filter((x) => x === max).length === 1) { s.jedinoNajduzi++; ukupno.jedinoNajduzi++; }
    if (t === min) ukupno.najkraci++;
    ukupno.rang[vecih]++; // 0 = najduži (ili deli prvo mesto)
    ukupno.odnos.push(t / (L.slice(1).reduce((a, b) => a + b, 0) / 3));
  }
}
const pr = (a, b) => ((100 * a) / b).toFixed(1) + '%';
console.log(`Ukupno ${ukupno.n} pitanja sa 4 odgovora`);
console.log(`tačan je najduži (ili deli prvo mesto): ${pr(ukupno.najduzi, ukupno.n)}  · jedini najduži: ${pr(ukupno.jedinoNajduzi, ukupno.n)}  · najkraći: ${pr(ukupno.najkraci, ukupno.n)}  (slučajno ≈ 25%)`);
console.log('rang tačnog po dužini (1 = najduži):', ukupno.rang.map((x, i) => `${i + 1}. ${pr(x, ukupno.n)}`).join('  '));
const o = ukupno.odnos.sort((a, b) => a - b);
console.log(`dužina tačnog / prosek netačnih: medijana ${o[o.length >> 1].toFixed(2)}`);
console.log('po kvizu (jedini najduži):');
for (const [d, s] of Object.entries(po).sort((a, b) => b[1].jedinoNajduzi / b[1].n - a[1].jedinoNajduzi / a[1].n)) if (s.n) console.log(`  ${d.padEnd(22)} ${String(s.n).padStart(4)}  ${pr(s.jedinoNajduzi, s.n)}`);
