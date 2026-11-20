// Poglavlje 7: Biološki važna organska jedinjenja (lekcije 29–34)
module.exports = ({ L, Q, U, S, mol, at, jon, kov, met, rast, ph, ps, R, lab, epr, pri }) => {
  const bio = (scena, o = {}) => ({ vrsta: 'biologija', scena, ...o });

  // ───────────── Uloga biološki važnih jedinjenja ─────────────
  L('Uloga biološki važnih jedinjenja');
  Q(1, 'Koje su glavne grupe biološki važnih organskih jedinjenja?', ['Masti, ugljeni hidrati, proteini i vitamini', 'Soli, kiseline i baze', 'Metali i legure', 'Gasovi i tečnosti'], 'Tome treba dodati i nukleinske kiseline (DNK i RNK).', 'grupe', { o: mol('glukoza') });
  Q(1, 'Koja jedinjenja su glavni izvor energije u ishrani?', ['Ugljeni hidrati i masti', 'Vitamini i minerali', 'Voda i kiseonik', 'Soli i kiseline'], 'Gram masti daje više od duplo više energije nego gram ugljenih hidrata.', 'energija', { o: mol('trigliserid') });
  Q(2, 'Koja jedinjenja grade mišiće, kožu i enzime?', ['Proteini', 'Ugljeni hidrati', 'Masti', 'Vitamini'], 'Proteini imaju najviše različitih uloga u organizmu.', 'proteini', { o: mol('tripeptid') });
  Q(2, 'Koji elementi su osnovni sastojci svih biološki važnih jedinjenja?', ['Ugljenik, vodonik i kiseonik', 'Natrijum, hlor i kalcijum', 'Helijum, neon i argon', 'Gvožđe, bakar i cink'], 'Proteini sadrže još i azot i često sumpor.', 'elementi', { o: mol('glukoza') });
  Q(2, 'Koliko ugljenikovih atoma ima molekul glukoze?', ['Šest', 'Dvanaest', 'Tri', 'Osam'], 'C₆H₁₂O₆ – šest ugljenika, dvanaest vodonika i šest kiseonika.', 'glukoza', { o: mol('glukoza') });
  Q(2, 'Koji organ i proces je u biljkama zadužen za proizvodnju glukoze?', ['Fotosinteza u listu', 'Disanje u korenu', 'Varenje u plodu', 'Transpiracija u stablu'], 'CO₂ i voda uz svetlost daju glukozu i kiseonik.', 'fotosinteza', { o: R('6ugljen-dioksid+6voda>glukoza+6kiseonik', { efekat: 'sjaj' }) });
  Q(2, 'Šta se dešava sa glukozom pri ćelijskom disanju?', ['Razlaže se uz kiseonik na CO₂ i vodu, oslobađajući energiju', 'Pretvara se u metal', 'Postaje kiselina', 'Pretvara se u so'], 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energija.', 'disanje', { o: R('glukoza+6kiseonik>6ugljen-dioksid+6voda', { efekat: 'sjaj' }) });
  Q(2, 'Gde se u ćeliji nalaze molekuli koji čuvaju nasledne informacije?', ['Nukleinske kiseline (DNK) u jedru', 'Masti u membrani', 'Šećeri u vakuoli', 'Vitamini u citoplazmi'], 'DNK je dvostruka spirala.', 'dnk', { o: { vrsta: 'dnk' } });
  Q(2, 'Koliko različitih aminokiselina ulazi u sastav proteina?', ['Dvadeset', 'Pet', 'Dvesta', 'Tri'], 'Njihovim kombinovanjem nastaje ogroman broj različitih proteina.', 'protein', { o: mol('alanin') });
  Q(2, 'Šta su enzimi?', ['Proteini koji ubrzavaju hemijske reakcije u organizmu', 'Masti koje čuvaju toplotu', 'Šećeri koji daju energiju', 'Soli u krvi'], 'Enzim i supstrat se uklapaju kao ključ i brava.', 'enzimi', { o: bio('enzim') });
  Q(3, 'Koliko iznosi molarna masa glukoze C₆H₁₂O₆ ($Ar(C)$ = 12, $Ar(H)$ = 1, $Ar(O)$ = 16)?', ['180 g/mol', '90 g/mol', '342 g/mol', '60 g/mol'], 'M = 6 · 12 + 12 · 1 + 6 · 16 = 180.', 'masa', { o: mol('glukoza') });
  Q(2, 'Koje biološki važno jedinjenje je glavni sastojak biljnih ćelijskih zidova?', ['Celuloza', 'Skrob', 'Glikogen', 'Insulin'], 'Celulozu ljudi ne mogu da svare, ali je važna kao dijetalno vlakno.', 'celuloza', { o: mol('skrob') });
  Q(2, 'Šta od ovoga se skladišti u jetri i mišićima životinja kao rezerva energije?', ['Glikogen', 'Celuloza', 'Hlorofil', 'Keratin'], 'Biljke rezervu energije čuvaju u obliku skroba.', 'glikogen', { o: mol('skrob') });
  Q(3, 'Zašto su biološki važna jedinjenja uglavnom organska?', ['Građena su od lanaca atoma ugljenika', 'Sadrže mnogo metala', 'Imaju jonske veze', 'Sastoje se od jednog atoma'], 'Ugljenik može da gradi dugačke lance i prstenove, pa daje ogroman broj jedinjenja.', 'ugljenik', { o: mol('saharoza') });
  S(2, 'Spoji jedinjenje sa ulogom u organizmu.', [['Masti', 'Rezerva energije i izolacija'], ['Proteini', 'Građa tkiva i enzimi'], ['Ugljeni hidrati', 'Brz izvor energije'], ['DNK', 'Čuvanje naslednih informacija']], 'Svaka grupa ima više uloga, ali ovo su najvažnije.', 'uloge', { o: mol('trigliserid') });

  // ───────────── Masti i ulja ─────────────
  L('Masti i ulja');
  Q(1, 'Od čega su građene masti i ulja?', ['Od triglicerida – estara glicerola i masnih kiselina', 'Od šećera i soli', 'Od aminokiselina', 'Od metala'], 'Molekul glicerola veže tri masne kiseline preko estarskih veza.', 'masti', { o: mol('trigliserid') });
  Q(1, 'Koji alkohol je sastavni deo svake masti?', ['Glicerol', 'Etanol', 'Metanol', 'Glikol'], 'Glicerol ima tri –OH grupe, a za svaku se vezuje po jedna masna kiselina.', 'glicerol', { o: mol('glicerol') });
  Q(2, 'Po čemu se razlikuju masti i ulja na sobnoj temperaturi?', ['Masti su čvrste, a ulja tečna', 'Masti su tečne, a ulja čvrsta', 'Obe su gasovite', 'Nema razlike'], 'Većina masti je životinjskog, a ulja biljnog porekla.', 'agregatno', { o: epr('masti') });
  Q(2, 'Zašto su masti čvrste, a ulja tečna?', ['Masti sadrže više zasićenih, a ulja više nezasićenih masnih kiselina', 'Masti ne sadrže ugljenik', 'Ulja ne sadrže kiseonik', 'Masti sadrže vodu'], 'Zasićeni lanci su ravni i gusto se pakuju, a nezasićeni su savijeni.', 'zasićene', { o: mol('stearinska-kiselina') });
  Q(2, 'Šta su masti u odnosu na vodu?', ['Nerastvorne, plivaju na vodi', 'Odlično rastvorne', 'Reaguju sa vodom', 'Teže od vode'], 'Masti i ulja su manje guste od vode (oko 0,9 g/cm³).', 'plivaju', { o: epr('masti') });
  Q(2, 'Šta je hidrogenizacija masti?', ['Adicija vodonika na dvostruke veze u mastima', 'Dodavanje vode mastima', 'Sagorevanje masti', 'Hlađenje masti'], 'Tako od tečnog ulja nastaje čvrsta mast – margarin.', 'vodonik', { o: R('but-2-en+vodonik>butan') });
  Q(2, 'Šta se dobija hidrogenizacijom biljnog ulja?', ['Čvrsta mast (margarin)', 'Sapun', 'Šećer', 'Alkohol'], 'Pri tom dvostruke veze prelaze u jednostruke.', 'margarin', { o: R('but-2-en+vodonik>butan') });
  Q(2, 'Šta nastaje zagrevanjem masti sa natrijum-hidroksidom?', ['Sapun i glicerol', 'Šećer i voda', 'Etanol i CO₂', 'Estar i kiselina'], 'Reakcija se zove saponifikacija – hidroliza estra u baznoj sredini.', 'sapun', { o: R('trigliserid+3natrijum-hidroksid>glicerol+3natrijum-butanoat') });
  Q(2, 'Šta su sapuni?', ['Soli viših masnih kiselina', 'Estri glicerola', 'Kiseline sa dugim lancem', 'Alkoholi sa dugim lancem'], 'Najčešće natrijumove (tvrdi sapun) ili kalijumove (meki sapun) soli.', 'sapuni', { o: mol('natrijum-stearat') });
  Q(3, 'Kako sapun uklanja mast sa kože?', ['Nepolarni „rep“ se rastvara u masti, a polarna glava u vodi', 'Rastvara se samo u masti', 'Razlaže mast na ugljenik', 'Zagreva kožu'], 'Tako se mast okruži molekulima sapuna i ispere vodom.', 'sapun', { o: mol('natrijum-stearat') });
  Q(2, 'Koja je uloga masti u organizmu?', ['Izvor energije i termoizolacija', 'Isključivo građa kostiju', 'Prenos kiseonika', 'Pretvaranje u vodu'], 'Sloj masti ispod kože pomaže životinjama da zadrže toplotu.', 'masti', { o: mol('trigliserid') });
  Q(2, 'Šta se dešava kad mast „užegne“?', ['Oksiduje i hidrolizuje se, pa dobija neprijatan miris', 'Postaje šećer', 'Postaje alkohol', 'Pretvara se u metal'], 'Pri tome nastaju slobodne masne kiseline i aldehidi neprijatnog mirisa.', 'užeglost', { o: mol('butanska-kiselina') });
  Q(3, 'Koliko mola NaOH je potrebno za saponifikaciju 1 mola triglicerida?', ['Tri mola', 'Jedan mol', 'Dva mola', 'Šest molova'], 'Triglicerid ima tri estarske veze, pa treba tri NaOH.', 'mol', { o: R('trigliserid+3natrijum-hidroksid>glicerol+3natrijum-butanoat') });
  Q(2, 'Gde se još biljna ulja koriste osim u ishrani?', ['Za biodizel i kozmetiku', 'Za izradu stakla', 'Za dobijanje metala', 'Za proizvodnju soli'], 'Biodizel nastaje od ulja reakcijom sa metanolom.', 'primena', { o: mol('metil-butanoat') });
  Q(3, 'Koja masna kiselina je zasićena?', ['Stearinska', 'Oleinska', 'Linolna', 'Linolenska'], 'Oleinska, linolna i linolenska imaju dvostruke veze.', 'stearinska', { o: mol('stearinska-kiselina') });
  U(2, 'Šta od ovoga NIJE sastavni deo triglicerida?', ['Aminokiselina', 'Glicerol', 'Palmitinska kiselina', 'Oleinska kiselina'], 'Aminokiseline grade proteine, ne masti.', 'Triglicerid = glicerol + tri masne kiseline.', 'trigliserid', { o: mol('trigliserid') });

  // ───────────── Ugljeni hidrati – monosaharidi ─────────────
  L('Ugljeni hidrati – monosaharidi');
  Q(1, 'Koji su najpoznatiji monosaharidi?', ['Glukoza i fruktoza', 'Saharoza i laktoza', 'Skrob i celuloza', 'Glikogen i hitin'], 'Monosaharidi su najprostiji šećeri – ne mogu se hidrolizom razložiti na prostije.', 'šećeri', { o: mol('glukoza') });
  Q(1, 'Koja je molekulska formula glukoze i fruktoze?', ['C₆H₁₂O₆', 'C₆H₁₂O₅', 'C₁₂H₂₂O₁₁', 'C₆H₁₀O₅'], 'Glukoza i fruktoza su izomeri – isti sastav, različita struktura.', 'izomeri', { m: mol('glukoza'), o: mol('fruktoza') });
  Q(2, 'Kako se zove glukoza u svakodnevnom životu?', ['Grožđani šećer', 'Voćni šećer', 'Mlečni šećer', 'Stoni šećer'], 'Nalazi se u grožđu i medu, a u krvi je ima oko 5 mmol/L.', 'grožđani', { o: mol('glukoza') });
  Q(2, 'Kako se fruktoza zove u svakodnevnom životu?', ['Voćni šećer', 'Grožđani šećer', 'Mlečni šećer', 'Slador'], 'Fruktoza je najslađi prirodni šećer.', 'voćni', { o: mol('fruktoza') });
  Q(2, 'Po čemu se glukoza razlikuje od fruktoze?', ['Strukturom – razlikuju se po funkcionalnoj grupi', 'Brojem atoma ugljenika', 'Brojem atoma kiseonika', 'Agregatnim stanjem'], 'Glukoza je aldoza (ima aldehidnu grupu), a fruktoza ketoza.', 'razlika', { m: mol('glukoza'), o: mol('fruktoza') });
  Q(2, 'Kakva su fizička svojstva monosaharida?', ['Bele su, kristalne, slatke i rastvorne u vodi', 'Žute, tečne i nerastvorne', 'Crne, čvrste i gorke', 'Gasovite'], 'Zato se šećeri lako rastvaraju u čaju.', 'svojstva', { o: rast('secer') });
  Q(2, 'Zašto rastvor glukoze ne provodi struju?', ['Sastoji se od molekula, bez jona', 'Sadrži slobodne elektrone', 'Sadrži jone natrijuma', 'Nije rastvorljiva'], 'Šećeri su molekulske supstance.', 'molekul', { o: lab('struja', { predmet: 'secer' }) });
  Q(3, 'Šta pokazuje Felingov test sa glukozom?', ['Crveni talog bakar(I)-oksida pri zagrevanju', 'Plavi talog', 'Beli talog', 'Gas'], 'Glukoza ima redukujuća svojstva zbog aldehidne grupe.', 'felingov', { o: epr('felling') });
  Q(2, 'Koliko ugljenikovih atoma ima molekul fruktoze?', ['Šest', 'Pet', 'Deset', 'Tri'], 'Fruktoza je heksoza.', 'fruktoza', { o: mol('fruktoza') });
  Q(2, 'Šta nastaje alkoholnim vrenjem glukoze?', ['Etanol i ugljen-dioksid', 'Sirće i voda', 'Skrob i voda', 'Metan i kiseonik'], 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂.', 'vrenje', { o: R('glukoza>2etanol+2ugljen-dioksid', { efekat: 'mehurici' }) });
  Q(1, 'Šta nastaje u fotosintezi pored kiseonika?', ['Glukoza', 'Skrob odmah', 'Etanol', 'Sirćetna kiselina'], 'Glukoza se zatim pretvara u skrob ili celulozu.', 'fotosinteza', { o: R('6ugljen-dioksid+6voda>glukoza+6kiseonik', { efekat: 'sjaj' }) });
  Q(2, 'Gde se u prirodi nalazi fruktoza?', ['U voću i medu', 'U mesu', 'U kamenu', 'U vazduhu'], 'Med sadrži oko po polovinu glukoze i fruktoze.', 'med', { o: mol('fruktoza') });
  Q(2, 'Koliko atoma kiseonika ima molekul glukoze?', ['Šest', 'Pet', 'Dvanaest', 'Dvadeset'], 'Šest – pet u –OH grupama i jedan u prstenu (u cikličnom obliku).', 'glukoza', { o: mol('glukoza') });
  Q(3, 'Koliko molova CO₂ je potrebno biljci za dobijanje 2 mola glukoze?', ['12 molova', '6 molova', '2 mola', '24 mola'], '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂: za 2 mola glukoze 12 molova CO₂.', 'mol', { o: R('6ugljen-dioksid+6voda>glukoza+6kiseonik', { efekat: 'sjaj' }) });
  Q(3, 'Zašto se šećeri u organizmu lako razlažu, a energija oslobađa postepeno?', ['Enzimi ubrzavaju razlaganje korak po korak', 'Jer su jonski', 'Jer su metali', 'Jer ne sadrže ugljenik'], 'Postepenim oslobađanjem energije ćelija je koristi bez pregrevanja.', 'enzimi', { o: bio('enzim') });
  U(2, 'Koji od ovih šećera NIJE monosaharid?', ['Saharoza', 'Glukoza', 'Fruktoza', 'Galaktoza'], 'Saharoza je disaharid – nastaje spajanjem glukoze i fruktoze.', 'Monosaharidi su najprostiji šećeri.', 'saharoza', { o: mol('saharoza') });

  // ───────────── Ugljeni hidrati – disaharidi i polisaharidi ─────────────
  L('Ugljeni hidrati – disaharidi i polisaharidi');
  Q(1, 'Koji disaharid je obični beli (stoni) šećer?', ['Saharoza', 'Laktoza', 'Maltoza', 'Glukoza'], 'Dobija se iz šećerne repe i šećerne trske.', 'saharoza', { o: mol('saharoza') });
  Q(1, 'Od kojih monosaharida je izgrađena saharoza?', ['Glukoze i fruktoze', 'Dve glukoze', 'Glukoze i galaktoze', 'Dve fruktoze'], 'Dva molekula se spajaju uz oslobađanje molekula vode.', 'saharoza', { o: R('glukoza+fruktoza>saharoza+voda') });
  Q(2, 'Šta nastaje hidrolizom saharoze?', ['Glukoza i fruktoza', 'Dve molekule glukoze', 'Skrob i voda', 'Etanol i CO₂'], 'C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ + C₆H₁₂O₆.', 'hidroliza', { o: R('saharoza+voda>glukoza+fruktoza') });
  Q(2, 'Koja je molekulska formula saharoze?', ['C₁₂H₂₂O₁₁', 'C₁₂H₂₄O₁₂', 'C₆H₁₂O₆', 'C₆H₁₀O₅'], 'Dva C₆H₁₂O₆ umanjeno za jedan H₂O.', 'formula', { o: mol('saharoza') });
  Q(2, 'U čemu se nalazi disaharid laktoza?', ['U mleku i mlečnim proizvodima', 'U šećernoj repi', 'U grožđu', 'U žitaricama'], 'Neki ljudi ne mogu da je svare – imaju intoleranciju na laktozu.', 'laktoza', { o: bio('varenje') });
  Q(2, 'Koji su najznačajniji polisaharidi?', ['Skrob, celuloza i glikogen', 'Saharoza, laktoza i maltoza', 'Glukoza, fruktoza i galaktoza', 'Insulin, hemoglobin i keratin'], 'Svi su izgrađeni od mnogo ostataka glukoze.', 'skrob', { o: mol('skrob') });
  Q(2, 'Gde biljke skladište rezervu hrane u obliku skroba?', ['U krtolama, semenima i korenu', 'U listovima', 'U cvetovima', 'U kori'], 'Krompir i pirinač su bogati skrobom.', 'skrob', { o: mol('skrob') });
  Q(2, 'Čime se dokazuje prisustvo skroba?', ['Luglovim rastvorom joda – boja postaje tamnoplava', 'Felingovim reagensom – boja postaje crvena', 'Lakmus hartijom', 'Kreč na vodom'], 'Jod se smešta u šupljine skroba i boji ga tamnoplavo.', 'skrob', { o: epr('lugol') });
  Q(2, 'Koji polisaharid je glavni sastojak biljnih ćelijskih zidova?', ['Celuloza', 'Skrob', 'Glikogen', 'Laktoza'], 'Pamuk sadrži 80–90% celuloze.', 'celuloza', { o: mol('skrob') });
  Q(3, 'Zašto ljudi ne mogu da svare celulozu?', ['Nemamo enzime koji razlažu njene veze', 'Celuloza je gas', 'Rastvara se u vodi', 'Nema ugljenika'], 'Preživari i termiti imaju mikroorganizme koji im pomažu da razgrade celulozu.', 'enzimi', { o: mol('skrob') });
  Q(2, 'Gde životinje i ljudi skladište polisaharid glikogen?', ['U jetri i mišićima', 'U kostima', 'U koži', 'U krvi'], 'Iz glikogena se brzo oslobađa glukoza kada organizmu zatreba energija.', 'glikogen', { o: mol('skrob') });
  Q(3, 'Po čemu se razlikuju skrob i celuloza, iako su oboje izgrađeni od glukoze?', ['Načinom povezivanja ostataka glukoze', 'Brojem atoma kiseonika', 'Agregatnim stanjem', 'Sadrže različite elemente'], 'Mala razlika u povezivanju daje potpuno različita svojstva.', 'veza', { o: mol('skrob') });
  Q(2, 'Koji disaharid sadrži glukozu i galaktozu?', ['Laktoza', 'Saharoza', 'Maltoza', 'Celobioza'], 'Mlečni šećer nalazi se samo u mleku sisara.', 'laktoza', { o: bio('varenje') });
  Q(2, 'Šta se dešava sa skrobom u ustima?', ['Enzim iz pljuvačke ga razlaže na kraće šećere', 'Postaje kiselina', 'Pretvara se u mast', 'Ne menja se'], 'Zato hleb duže žvakan postaje blago sladak.', 'pljuvačka', { o: bio('varenje') });
  Q(3, 'Koliko molekula vode se oslobodi pri spajanju dva monosaharida u disaharid?', ['Jedan', 'Dva', 'Nijedan', 'Tri'], 'Spajanje (kondenzacija) je suprotno hidrolizi.', 'voda', { o: R('glukoza+fruktoza>saharoza+voda') });
  S(2, 'Spoji šećer sa njegovom prirodom ili izvorom.', [['Saharoza', 'Šećerna repa'], ['Laktoza', 'Mleko'], ['Skrob', 'Krompir'], ['Celuloza', 'Pamuk']], 'Svi su izgrađeni od glukoze ili njenih izomera.', 'izvori', { o: mol('saharoza') });

  // ───────────── Aminokiseline i proteini ─────────────
  L('Aminokiseline i proteini');
  Q(1, 'Koje funkcionalne grupe sadrže aminokiseline?', ['Aminogrupu –NH₂ i karboksilnu grupu –COOH', 'Samo hidroksilnu grupu', 'Samo estarsku grupu', 'Samo aminogrupu'], 'Obe grupe su vezane za isti, α-ugljenik.', 'grupe', { o: mol('glicin') });
  Q(1, 'Koja je najprostija aminokiselina?', ['Glicin', 'Alanin', 'Cistein', 'Serin'], 'Glicin NH₂CH₂COOH ima samo vodonik kao bočni lanac.', 'glicin', { o: mol('glicin') });
  Q(2, 'Šta su proteini?', ['Polimeri izgrađeni od aminokiselina', 'Polimeri izgrađeni od glukoze', 'Estri glicerola', 'Soli masnih kiselina'], 'Aminokiseline se povezuju peptidnim vezama.', 'proteini', { o: mol('tripeptid') });
  Q(2, 'Kako se zove veza između dve aminokiseline u proteinu?', ['Peptidna veza', 'Jonska veza', 'Metalna veza', 'Estarska veza'], 'Karboksilna grupa jedne reaguje sa aminogrupom druge, uz izdvajanje vode.', 'peptidna', { o: R('2glicin>dipeptid+voda') });
  Q(2, 'Šta nastaje spajanjem dve aminokiseline peptidnom vezom?', ['Dipeptid i voda', 'Estar i alkohol', 'Aldehid i kiselina', 'Dva monosaharida'], 'Spajanjem mnogo aminokiselina nastaje polipeptid, tj. protein.', 'dipeptid', { o: R('2glicin>dipeptid+voda') });
  Q(2, 'Koliko aminokiselina ulazi u sastav prirodnih proteina?', ['Dvadeset', 'Dve', 'Pet', 'Sto'], 'Različitim rasporedom nastaju hiljade proteina.', 'dvadeset', { o: mol('alanin') });
  Q(2, 'Šta su esencijalne aminokiseline?', ['One koje organizam ne može da proizvede i moraju se uneti hranom', 'One koje organizam proizvodi u višku', 'One koje su otrovne', 'One koje su samo biljne'], 'Nalaze se u mesu, jajima, mleku i mahunarkama.', 'esencijalne', { o: mol('serin') });
  Q(2, 'Koje namirnice su bogate proteinima?', ['Jaja, meso, mleko i mahunarke', 'Šećer i so', 'Maslinovo ulje i margarin', 'Voda i led'], 'Mahunarke su važan biljni izvor proteina.', 'namirnice', { o: mol('tripeptid') });
  Q(2, 'Šta je denaturacija proteina?', ['Gubitak prostorne strukture pod dejstvom toplote, kiseline ili teških metala', 'Spajanje proteina sa šećerima', 'Razlaganje proteina na ugljenik', 'Rastvaranje u vodi'], 'Beli deo jajeta pri kuvanju postaje beo i čvrst – to je denaturacija.', 'belance', { o: epr('denaturacija') });
  Q(2, 'Šta može da izazove denaturaciju proteina?', ['Zagrevanje, kiseline i soli teških metala', 'Hlađenje u frižideru', 'Mešanje sa vodom', 'Svetlost sijalice'], 'Zato olovo(II)-nitrat taloži belanca.', 'toplota', { o: epr('denaturacija') });
  Q(3, 'Zašto se jaje „stvrdne“ pri kuvanju?', ['Proteini se denaturišu i povezuju u mrežu', 'Voda ispari potpuno', 'Šećer se pretvara u mast', 'Nastaje so'], 'Posle denaturacije proteini se ne vraćaju u prvobitno stanje.', 'jaje', { o: epr('denaturacija') });
  Q(3, 'Koja aminokiselina sadrži sumpor?', ['Cistein', 'Glicin', 'Alanin', 'Serin'], 'Sumporni atomi dve molekule cisteina povezuju se disulfidnim mostom i stabilizuju oblik proteina.', 'cistein', { o: mol('cistein') });
  Q(2, 'Koji protein prenosi kiseonik u krvi?', ['Hemoglobin', 'Insulin', 'Keratin', 'Kolagen'], 'Hemoglobin u sebi ima atom gvožđa.', 'hemoglobin', { o: at(26, { naboj: 2 }) });
  Q(2, 'Koji protein se nalazi u kosi i noktima?', ['Keratin', 'Hemoglobin', 'Insulin', 'Skrob'], 'Keratin je tvrd, vlaknast protein.', 'keratin', { o: mol('tripeptid') });
  Q(2, 'Kakva svojstva imaju aminokiseline zbog dve različite grupe?', ['I kisela i bazna', 'Samo kisela', 'Samo bazna', 'Nikakva'], 'Karboksilna grupa je kisela, a amino bazna.', 'amfoterne', { o: mol('glicin') });
  U(2, 'Šta od ovoga NIJE protein?', ['Skrob', 'Hemoglobin', 'Keratin', 'Enzim'], 'Skrob je polisaharid izgrađen od glukoze.', 'Proteini sadrže azot, a skrob ne.', 'protein', { o: mol('skrob') });

  // ───────────── Vitamini ─────────────
  L('Vitamini');
  Q(1, 'Šta su vitamini?', ['Organska jedinjenja neophodna organizmu u malim količinama', 'Neorganske soli', 'Gasovi iz vazduha', 'Metali u krvi'], 'Organizam ih uglavnom ne može sam da napravi, pa se unose hranom.', 'vitamini', { o: mol('vitamin-c-lanac') });
  Q(2, 'Koja podela vitamina je tačna?', ['Rastvorljivi u vodi i rastvorljivi u mastima', 'Kiseli i bazni', 'Gasoviti i čvrsti', 'Metalni i nemetalni'], 'Vitamini rastvorljivi u vodi izlučuju se brzo, pa se unose svakodnevno.', 'podela', { o: mol('vitamin-c-lanac') });
  Q(2, 'Koji vitamini su rastvorljivi u mastima?', ['A, D, E i K', 'B i C', 'Samo B', 'Samo C'], 'Zato se unose uz hranu koja sadrži masti.', 'mast', { o: mol('retinol') });
  Q(2, 'Koji vitamini su rastvorljivi u vodi?', ['B kompleks i C', 'A i D', 'E i K', 'Samo A'], 'Višak se izlučuje urinom.', 'voda', { o: mol('vitamin-c-lanac') });
  Q(1, 'Koji vitamin sprečava skorbut?', ['Vitamin C', 'Vitamin A', 'Vitamin D', 'Vitamin K'], 'Mornari su nekad oboljevali od skorbuta bez sveže hrane; pomoć je donelo voće sa vitaminom C.', 'skorbut', { o: mol('vitamin-c-lanac') });
  Q(1, 'Koji vitamin se u koži stvara delovanjem sunčeve svetlosti?', ['Vitamin D', 'Vitamin C', 'Vitamin B₁₂', 'Vitamin E'], 'Neophodan je za upijanje kalcijuma u kostima.', 'sunce', { o: mol('kalcijum-fosfat') });
  Q(2, 'Nedostatak koga vitamina izaziva rahitis kod dece?', ['Vitamina D', 'Vitamina C', 'Vitamina A', 'Vitamina K'], 'Kosti ostaju mekane i krive jer se ne ugrađuje kalcijum.', 'rahitis', { o: mol('kalcijum-fosfat') });
  Q(2, 'Koji vitamin je važan za vid?', ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], 'Nalazi se u šargarepi (kao provitamin beta-karoten).', 'vid', { o: mol('retinol') });
  Q(2, 'Koji vitamin je važan za zgrušavanje krvi?', ['Vitamin K', 'Vitamin C', 'Vitamin A', 'Vitamin D'], 'Nalazi se u zelenom lisnatom povrću.', 'krv', { o: mol('retinol') });
  Q(2, 'Koja namirnica je bogata vitaminom C?', ['Limun, paprika i šipak', 'Maslac', 'Jaja', 'Mleko'], 'Vitamin C se razgrađuje zagrevanjem.', 'limun', { o: ph({ supstance: ['limun'] }) });
  Q(2, 'Šta je avitaminoza?', ['Poremećaj zbog potpunog nedostatka nekog vitamina', 'Višak vitamina', 'Gojaznost', 'Alergija'], 'Višak vitamina (naročito A i D) naziva se hipervitaminoza.', 'avitaminoza', { o: mol('vitamin-c-lanac') });
  Q(3, 'Koliko ugljenikovih atoma ima molekul askorbinske kiseline (vitamin C)?', ['Šest', 'Dvanaest', 'Dva', 'Dvadeset'], 'C₆H₈O₆.', 'askorbinska', { o: mol('vitamin-c-lanac') });
  Q(3, 'Zašto višak vitamina A i D može biti štetan?', ['Rastvorljivi su u mastima, pa se nakupljaju u organizmu', 'Rastvaraju se u vodi pa nestaju', 'Pretvaraju se u so', 'Isparavaju'], 'Zato ne treba uzimati vitamine bez saveta lekara.', 'višak', { o: mol('retinol') });
  Q(2, 'Kojoj grupi organskih jedinjenja pripada limunska kiselina?', ['Karboksilna kiselina', 'Alkohol', 'Estar', 'Ugljovodonik'], 'Ima tri karboksilne grupe – to je trikarboksilna kiselina.', 'limunska', { o: mol('limunska-kiselina') });
  Q(2, 'Gde se vitamin A čuva u organizmu?', ['U jetri', 'U kostima', 'U mozgu', 'U kosi'], 'Zato je jetra bogata vitaminom A.', 'jetra', { o: mol('retinol') });
  S(2, 'Spoji vitamin sa njegovom ulogom ili bolešću.', [['Vitamin C', 'Skorbut'], ['Vitamin D', 'Rahitis'], ['Vitamin A', 'Vid'], ['Vitamin K', 'Zgrušavanje krvi']], 'Vitamini se razlikuju po ulozi, a svi su neophodni za zdravlje.', 'bolesti', { o: mol('vitamin-c-lanac') });
};
