// Lekcije 17–20: prosti i složeni brojevi, rastavljanje na proste činioce, NZD i NZS.
module.exports = ({ L, Q, U, S, G, r, naKrugu, stabloCinioca, sito, vennDelilaca, pravaNZS, O, bez }) => {

  // ── 17. prosti i složeni brojevi ──
  L('Prosti i složeni brojevi; Eratostenovo sito');
  Q(1, 'Koji broj je PROST?',
    ['Broj koji ima tačno dva delioca', 'Broj koji ima više od dva delioca', 'Broj koji ima jednog delioca', 'Broj koji je paran'],
    'Prost broj ima tačno dva delioca: jedinicu i samog sebe. Primeri: $2, 3, 5, 7, 11, 13, \\dots$', 'prost',
    { medijiOdgovora: G(O, sito(24), { ...bez, velicina: 280 }) });
  Q(1, 'Koji je najmanji prost broj?',
    ['2', '1', '3', '0'],
    'Najmanji prost broj je 2. Broj 1 nije prost jer ima samo jednog delioca (sebe samog).', 'prost',
    { medijiOdgovora: G(O, sito(12), { ...bez, velicina: 260 }) });
  Q(1, 'Koji je jedini PARAN prost broj?',
    ['2', '4', '6', '8'],
    'Jedini paran prost broj je 2. Svi ostali parni brojevi deljivi su sa 2, pa imaju bar tri delioca (1, 2 i sebe).', 'prost',
    { medijiOdgovora: G(O, sito(16), { ...bez, velicina: 280 }) });
  Q(2, 'Šta je SLOŽEN broj?',
    ['Broj koji ima više od dva delioca', 'Broj sa tačno dva delioca', 'Broj sa jednim deliocem', 'Neparan broj'],
    'Složen broj ima više od dva delioca. Na primer, $12$ ima delioce $1, 2, 3, 4, 6, 12$ – ukupno 6 delilaca.', 'složen',
    { medijiOdgovora: stabloCinioca([12, 2, [6, 2, 3]]) });
  Q(2, 'Koji broj nije ni prost ni složen?',
    ['1', '2', '3', '4'],
    'Broj 1 ima samo jednog delioca (sebe), pa nije ni prost (treba mu dva delioca) ni složen (treba mu više od dva).', 'jedinica',
    { medijiOdgovora: G({ A: [0, 0] }, [{ tx: '1', at: [0, 0], vel: 40, b: 5 }], { velicina: 140 }) });
  Q(1, 'Čemu služi Eratostenovo sito?',
    ['Za izdvajanje prostih brojeva', 'Za merenje dužine', 'Za sabiranje', 'Za crtanje krugova'],
    'Eratostenovo sito: napišeš brojeve redom, pa precrtavaš sadržaoce prostih brojeva. Ono što ostane neprecrtano jesu prosti brojevi.', 'eratosten',
    { mediji: G(O, sito(32, { kolona: 8 }), { ...bez, velicina: 300 }) });
  Q(2, 'Koji od ovih brojeva je prost?',
    ['17', '15', '21', '27'],
    'Broj $17$ ima delioce samo $1$ i $17$. Ostali su složeni: $15=3\\cdot5$, $21=3\\cdot7$, $27=3\\cdot9$.', 'prost',
    { medijiOdgovora: G(O, sito(27, { kolona: 9 }), { ...bez, velicina: 280 }) });
  Q(3, 'Koliko delilaca ima prost broj?',
    ['Tačno 2', 'Tačno 1', 'Više od 2', 'Nijedan'],
    'Prost broj ima tačno dva delioca: 1 i samog sebe. Zato se ne može zapisati kao proizvod dva manja broja (osim proizvoda $1 \\cdot p$, gde je $p$ sam taj broj).', 'delilac',
    { medijiOdgovora: G(O, sito(20), { ...bez, velicina: 280 }) });

  // ── 18. rastavljanje na proste činioce ──
  L('Rastavljanje na proste činioce');
  Q(1, 'Šta znači rastaviti broj na proste činioce?',
    ['Zapisati ga kao proizvod prostih brojeva', 'Zapisati ga kao zbir prostih brojeva', 'Podeliti ga sa 2', 'Napisati ga rimskim ciframa'],
    'Rastavljanje na proste činioce: broj zapišemo kao proizvod samih prostih brojeva. Na primer, $12 = 2 \\cdot 2 \\cdot 3$.', 'činilac',
    { medijiOdgovora: stabloCinioca([12, 2, [6, 2, 3]]) });
  Q(1, 'Kako glasi rastavljanje broja 12 na proste činioce?',
    ['$2 \\cdot 2 \\cdot 3$', '$3 \\cdot 4$', '$2 \\cdot 6$', '$1 \\cdot 12$'],
    '$12 = 2\\cdot2\\cdot3$. Svi činioci su prosti brojevi. Zapis $3\\cdot4$ nije do kraja, jer je 4 složen broj.', 'činilac',
    { medijiOdgovora: stabloCinioca([12, 2, [6, 2, 3]]) });
  Q(1, 'Kako glasi rastavljanje broja 18 na proste činioce?',
    ['$2 \\cdot 3 \\cdot 3$', '$2 \\cdot 9$', '$3 \\cdot 6$', '$2 \\cdot 2 \\cdot 3$'],
    '$18 = 2\\cdot3\\cdot3$. Prvo podelimo sa 2, dobijemo 9, a $9=3\\cdot3$.', 'činilac',
    { medijiOdgovora: stabloCinioca([18, 2, [9, 3, 3]]) });
  Q(2, 'Kako glasi rastavljanje broja 30 na proste činioce?',
    ['$2 \\cdot 3 \\cdot 5$', '$5 \\cdot 6$', '$2 \\cdot 15$', '$3 \\cdot 10$'],
    '$30 = 2\\cdot3\\cdot5$ – tri različita prosta činioca. Broj 30 je proizvod prva tri prosta broja: 2, 3 i 5.', 'činilac',
    { medijiOdgovora: stabloCinioca([30, 2, [15, 3, 5]]) });
  Q(2, 'Koji su prosti činioci broja 20?',
    ['$2 \\cdot 2 \\cdot 5$', '$4 \\cdot 5$', '$2 \\cdot 10$', '$1 \\cdot 20$'],
    '$20 = 2\\cdot2\\cdot5$. Broj 4 se mora dalje rastaviti na $2\\cdot2$, jer 4 nije prost.', 'činilac',
    { medijiOdgovora: stabloCinioca([20, 2, [10, 2, 5]]) });
  Q(2, 'Da li je zapis $2 \\cdot 3 \\cdot 7$ rastavljanje na proste činioce?',
    ['Da, svi činioci su prosti', 'Ne, jer je 2 složen', 'Ne, jer je 7 složen', 'Ne, jer je 3 složen'],
    'Svi činioci – 2, 3 i 7 – su prosti brojevi, pa je ovo ispravno rastavljanje. Proizvod je $42$.', 'činilac',
    { medijiOdgovora: stabloCinioca([42, 2, [21, 3, 7]]) });
  Q(3, 'Broj 24 rastavljen na proste činioce glasi…',
    ['$2 \\cdot 2 \\cdot 2 \\cdot 3$', '$2 \\cdot 2 \\cdot 6$', '$3 \\cdot 8$', '$4 \\cdot 6$'],
    '$24 = 2\\cdot2\\cdot2\\cdot3$ (tri dvojke i jedna trojka). To kraće pišemo kao $2^{3} \\cdot 3$.', 'činilac',
    { medijiOdgovora: stabloCinioca([24, 2, [12, 2, [6, 2, 3]]]) });

  // ── 19. NZD ──
  L('Najveći zajednički delilac; Euklidov algoritam');
  Q(1, 'Šta je najveći zajednički delilac (NZD) dva broja?',
    ['Najveći broj koji deli oba broja', 'Najmanji broj deljiv sa oba', 'Proizvod ta dva broja', 'Zbir ta dva broja'],
    'NZD je najveći broj kojim su oba data broja deljiva bez ostatka. Na primer, NZD(12, 18) je 6.', 'delilac',
    { medijiOdgovora: vennDelilaca(12, 18) });
  Q(1, 'Koliki je NZD brojeva 12 i 18?',
    ['6', '4', '3', '9'],
    'Delitelji broja 12: $1,2,3,4,6,12$; broja 18: $1,2,3,6,9,18$. Najveći zajednički je 6.', 'delilac',
    { medijiOdgovora: vennDelilaca(12, 18) });
  Q(2, 'Koliki je NZD brojeva 8 i 12?',
    ['4', '2', '6', '8'],
    'Delitelji broja 8: $1,2,4,8$; broja 12: $1,2,3,4,6,12$. Najveći zajednički je 4.', 'delilac',
    { medijiOdgovora: vennDelilaca(8, 12) });
  Q(2, 'Koliki je NZD brojeva 7 i 11?',
    ['1', '7', '11', '77'],
    'Brojevi 7 i 11 su prosti i nemaju zajedničkih delilaca osim 1, pa je NZD(7, 11) = 1.', 'delilac',
    { medijiOdgovora: vennDelilaca(7, 11) });
  Q(2, 'Kako se zovu brojevi čiji je NZD jednak 1?',
    ['Uzajamno prosti', 'Složeni brojevi', 'Parni brojevi', 'Sadržaoci'],
    'Kad dva broja nemaju nijedan zajednički delilac osim 1, kažemo da su uzajamno prosti. Na primer, 8 i 15 su uzajamno prosti.', 'prost',
    { medijiOdgovora: vennDelilaca(8, 15) });
  Q(2, 'Čemu služi Euklidov algoritam?',
    ['Za nalaženje NZD dva broja', 'Za nalaženje NZS', 'Za sabiranje', 'Za rastavljanje na cifre'],
    'Euklidov algoritam brzo nalazi NZD uzastopnim deljenjem sa ostatkom. Star je preko 2000 godina, a i dalje se koristi.', 'euklid',
    { medijiOdgovora: vennDelilaca(12, 18) });
  Q(3, 'Koliki je NZD brojeva 24 i 36?',
    ['12', '6', '8', '9'],
    'Rastavljanjem: $24=2\\cdot2\\cdot2\\cdot3$, $36=2\\cdot2\\cdot3\\cdot3$. Zajedničko je $2\\cdot2\\cdot3=12$.', 'delilac',
    { medijiOdgovora: vennDelilaca(24, 36) });

  // ── 20. NZS ──
  L('Najmanji zajednički sadržalac; veza NZD i NZS');
  Q(1, 'Šta je najmanji zajednički sadržalac (NZS) dva broja?',
    ['Najmanji broj deljiv sa oba broja', 'Najveći broj koji deli oba', 'Proizvod ta dva broja', 'Razlika ta dva broja'],
    'NZS je najmanji broj koji je sadržalac (višekratnik) oba data broja. Na primer, NZS(4, 6) je 12.', 'sadržalac',
    { medijiOdgovora: pravaNZS(4, 6, 13) });
  Q(1, 'Koliki je NZS brojeva 4 i 6?',
    ['12', '24', '6', '4'],
    'Sadržaoci broja 4: $4, 8, 12, \\dots$; broja 6: $6, 12, 18, \\dots$. Prvi zajednički je 12.', 'sadržalac',
    { medijiOdgovora: pravaNZS(4, 6, 13) });
  Q(2, 'Koliki je NZS brojeva 5 i 7?',
    ['35', '12', '5', '7'],
    'Pošto su 5 i 7 uzajamno prosti, NZS je njihov proizvod: $5\\cdot7=35$.', 'sadržalac',
    { medijiOdgovora: pravaNZS(5, 7, 36) });
  Q(2, 'Koliki je NZS brojeva 6 i 8?',
    ['24', '48', '12', '16'],
    'Sadržaoci broja 6: $6, 12, 18, 24, \\dots$; broja 8: $8, 16, 24, \\dots$. Prvi zajednički je 24.', 'sadržalac',
    { medijiOdgovora: pravaNZS(6, 8, 25) });
  Q(3, 'Koja veza povezuje NZD i NZS dva broja $a$ i $b$?',
    ['$NZD \\cdot NZS = a \\cdot b$', '$NZD + NZS = a + b$', '$NZD = NZS$', '$NZS - NZD = a \\cdot b$'],
    'Zlatno pravilo: proizvod NZD i NZS jednak je proizvodu samih brojeva. Na primer, za 12 i 18: $6 \\cdot 36 = 12 \\cdot 18 = 216$.', 'proizvod',
    { medijiOdgovora: { vrsta: 'formula', tekst: '$NZD\\cdot NZS=a\\cdot b$' } });
  Q(2, 'Ako je NZD(8, 12) = 4, koliki je NZS(8, 12)?',
    ['24', '16', '12', '96'],
    'Iz veze $NZD\\cdot NZS = a\\cdot b$: $4 \\cdot NZS = 8\\cdot12 = 96$, pa je $NZS = 96:4 = 24$.', 'sadržalac',
    { medijiOdgovora: pravaNZS(8, 12, 25) });
  Q(3, 'Dva zvona zvone istovremeno. Prvo zvoni na svakih 4 minuta, drugo na svakih 6 minuta. Posle koliko minuta će ponovo zvoniti zajedno?',
    ['12 minuta', '24 minuta', '6 minuta', '10 minuta'],
    'Tražimo najmanji zajednički sadržalac brojeva 4 i 6, a to je 12. Posle 12 minuta oba zvona zvone u istom trenutku.', 'sadržalac',
    { medijiOdgovora: pravaNZS(4, 6, 13) });

};
