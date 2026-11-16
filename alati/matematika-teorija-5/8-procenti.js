// Lekcije 48–49: procenti, razmera, aritmetička sredina.
module.exports = ({ L, Q, U, S, G, r, sto, O, bez }) => {

  // ── 48. procenti ──
  L('Procenti i primena procenata');
  Q(1, 'Šta znači 1 procenat (1%)?',
    ['Stoti deo celine', 'Deseti deo celine', 'Polovinu celine', 'Celu celinu'],
    'Procenat znači „od sto“: $1\\% = \\frac{1}{100} = 0,\\!01$. Znak % podseća na razlomak sa 100.', 'procenat', { mediji: { vrsta: 'formula', tekst: '$1\\%=\\frac{1}{100}$' } });
  Q(1, 'Koji razlomak odgovara procentu 50%?',
    ['$\\frac{1}{2}$', '$\\frac{1}{5}$', '$\\frac{1}{4}$', '$\\frac{1}{10}$'],
    '$50\\% = \\frac{50}{100} = \\frac{1}{2}$. Polovina celine je 50%.', 'procenat');
  Q(1, 'Koji razlomak odgovara procentu 25%?',
    ['$\\frac{1}{4}$', '$\\frac{1}{2}$', '$\\frac{1}{5}$', '$\\frac{1}{3}$'],
    '$25\\% = \\frac{25}{100} = \\frac{1}{4}$. Četvrtina celine je 25%.', 'procenat');
  Q(1, 'Koliko procenata ima CELA (ceo objekat)?',
    ['100%', '50%', '10%', '1000%'],
    'Cela celina uvek ima 100%. Ako pojedeš celu čokoladu, pojeo si 100% čokolade.', 'procenat');
  Q(2, 'Koliko je 50% od 200?',
    ['100', '50', '150', '250'],
    '$50\\%$ je polovina, a polovina od 200 je 100. Dakle, $50\\% \\cdot 200 = 100$.', 'procenat');
  Q(2, 'Koliko je 25% od 80?',
    ['20', '25', '40', '60'],
    '$25\\%$ je četvrtina, a četvrtina od 80 je 20.', 'procenat');
  Q(2, 'Koji procenat je prikazan na mreži?',
    ['35%', '25%', '50%', '65%'],
    'Mreža ima 100 kvadratića, a obojeno je 35 – to je 35%.', 'procenat',
    { mediji: G(O, sto(35), { ...bez, velicina: 280 }) });
  Q(3, 'Koji procenat je prikazan na mreži?',
    ['50%', '5%', '10%', '25%'],
    'Obojeno je pola od 100 kvadratića, dakle 50 kvadratića = 50%.', 'procenat',
    { mediji: G(O, sto(50), { ...bez, velicina: 280 }) });
  Q(3, 'Koliko je 10% od 10% od 100?',
    ['1', '10', '0', '100'],
    'Prvo $10\\%$ od 100 je 10. Zatim $10\\%$ od 10 je 1. Dakle, rezultat je 1.', 'procenat');

  S(2, 'Spoji procenat sa razlomkom.',
    [['50%', '$\\frac{1}{2}$'], ['25%', '$\\frac{1}{4}$'], ['100%', '1'], ['1%', '$\\frac{1}{100}$']],
    'Procenat je razlomak sa imeniocem 100: 50% je polovina, 25% četvrtina, a 100% cela.', 'procenat');

  // ── 49. razmera i aritmetička sredina ──
  L('Razmera; aritmetička sredina');
  Q(1, 'Šta je razmera dva broja?',
    ['Njihov količnik (odnos)', 'Njihov zbir', 'Njihov proizvod', 'Njihova razlika'],
    'Razmera je odnos dve veličine, zapisuje se kao $a:b$ ili $\\frac{a}{b}$. Govori koliko puta je jedna veličina veća od druge.', 'razmera');
  Q(1, 'Šta znači razmera na karti 1 : 100.000?',
    ['1 cm na karti je 100.000 cm u prirodi', '1 cm na karti je 100.000 km', 'Karta je velika 100.000 cm', '1 cm u prirodi je 100.000 cm na karti'],
    'Razmera 1:100.000 znači da 1 cm na karti odgovara 100.000 cm (to je 1 km) u stvarnosti. Karta je umanjena.', 'razmera');
  Q(2, 'Šta je aritmetička sredina nekoliko brojeva?',
    ['Zbir brojeva podeljen njihovim brojem', 'Najveći od tih brojeva', 'Zbir svih brojeva', 'Srednji po veličini broj'],
    'Aritmetička sredina (prosek) se dobija kad zbir svih brojeva podelimo brojem sabiraka. „Sve saberi pa podeli.“', 'sredina');
  Q(1, 'Kolika je aritmetička sredina brojeva 4 i 6?',
    ['5', '10', '2', '24'],
    'Zbir je $4+6=10$, a sabiraka ima 2, pa je sredina $10:2=5$.', 'sredina');
  Q(2, 'Kolika je aritmetička sredina brojeva 2, 4 i 9?',
    ['5', '15', '3', '6'],
    'Zbir je $2+4+9=15$, a sabiraka ima 3, pa je sredina $15:3=5$.', 'sredina');
  Q(2, 'Šta znači razmera 2 : 1?',
    ['Prva veličina je dva puta veća od druge', 'Druga veličina je dva puta veća', 'Obe su jednake', 'Prva je upola manja'],
    'Razmera 2:1 znači da je prva veličina dvostruko veća od druge. Na primer, uvećani crtež 2:1 je dvaput veći od stvarnog.', 'razmera');
  Q(3, 'Ana ima 10, a Marko 20 klikera. Kolika je razmera Aninih i Markovih klikera?',
    ['1 : 2', '2 : 1', '1 : 3', '3 : 1'],
    'Odnos je $10:20$, a to se skrati na $1:2$. Marko ima dvaput više klikera od Ane.', 'razmera');
  Q(3, 'Aritmetička sredina tri uzastopna broja je 5. Koji su to brojevi?',
    ['4, 5 i 6', '3, 4 i 5', '5, 6 i 7', '2, 5 i 8'],
    'Ako je sredina tri broja 5, njihov zbir je $3\\cdot5=15$. Brojevi $4+5+6=15$ – to su tri uzastopna broja.', 'sredina');

};
