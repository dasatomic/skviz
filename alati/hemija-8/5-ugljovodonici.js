// Poglavlje 5: Ugljovodonici (lekcije 18–23)
module.exports = ({ L, Q, U, S, mol, at, jon, kov, met, rast, ph, ps, R, lab, epr, pri }) => {
  // ───────────── Podela ugljovodonika i izomerija ─────────────
  L('Podela ugljovodonika i izomerija');
  Q(1, 'Šta su ugljovodonici?', ['Organske supstance koje sadrže samo ugljenik i vodonik', 'Soli ugljene kiseline', 'Jedinjenja ugljenika i kiseonika', 'Metali sa primesom ugljenika'], 'Ugljovodonici su najjednostavnija organska jedinjenja; nalaze se u nafti i zemnom gasu.', 'ugljovod', { m: mol('propan') });
  Q(1, 'Koji ugljovodonici imaju samo jednostruke veze između ugljenika?', ['Alkani', 'Alkeni', 'Alkini', 'Aromatični ugljovodonici'], 'Zbog toga su alkani zasićeni ugljovodonici.', 'alkani', { o: mol('butan') });
  Q(1, 'Koji ugljovodonici imaju jednu dvostruku vezu između ugljenika?', ['Alkeni', 'Alkani', 'Alkini', 'Cikloalkani'], 'Najprostiji alken je eten.', 'alkeni', { o: mol('eten') });
  Q(1, 'Koji ugljovodonici imaju jednu trostruku vezu između ugljenika?', ['Alkini', 'Alkeni', 'Alkani', 'Cikloalkani'], 'Najprostiji alkin je etin (acetilen).', 'alkini', { o: mol('etin') });
  Q(2, 'Šta znači da je ugljovodonik ciklični?', ['Ugljenikov niz se zatvara u prsten', 'Ima samo jedan atom ugljenika', 'Sadrži atome kiseonika', 'Sastoji se od više molekula'], 'Cikloheksan ima prsten od šest atoma ugljenika.', 'ciklični', { o: mol('cikloheksan') });
  Q(2, 'Koji su ugljovodonici zasićeni i aciklični?', ['Alkani', 'Alkeni', 'Aromatični', 'Alkini'], 'Zasićeni znači samo jednostruke veze, a aciklični da niz nije zatvoren.', 'zasićeni', { o: mol('pentan') });
  Q(2, 'Kako se ugljovodonici ponašaju u vodi?', ['Ne rastvaraju se jer su nepolarni', 'Odlično se rastvaraju jer su polarni', 'Reaguju sa vodom i daju baze', 'Potpuno disosuju na jone'], 'Rastvaraju se u drugim nepolarnim supstancama – benzinu, ulju.', 'nepolarni', { o: rast('ulje') });
  Q(2, 'Šta određuje agregatno stanje ugljovodonika?', ['Broj atoma ugljenika u molekulu', 'Boja plamena', 'Prisustvo soli', 'Količina vode'], 'Mali ugljovodonici (do 4 C) su gasovi, srednji su tečni, a veliki čvrsti.', 'stanje', { o: mol('heptan') });
  Q(1, 'Šta su izomeri?', ['Jedinjenja istog molekulskog sastava, a različite strukture', 'Jedinjenja različitog sastava, a iste strukture', 'Atomi istog elementa', 'Smeše dva ugljovodonika'], 'Butan i izobutan oba su C₄H₁₀, ali različito građeni.', 'izomeri', { m: mol('butan'), o: mol('izobutan') });
  Q(2, 'Koliko izomera ima pentan C₅H₁₂?', ['Tri', 'Dva', 'Pet', 'Jedan'], 'Pentan, 2-metilbutan i 2,2-dimetilpropan.', 'pentan', { o: mol('neopentan') });
  Q(2, 'Koje jedinjenje je strukturni izomer butana?', ['2-metilpropan (izobutan)', 'Propan', 'Pentan', 'Eten'], 'Oba imaju C₄H₁₀.', 'butan', { o: mol('izobutan') });
  Q(3, 'Šta važi za temperature ključanja izomera istog broja ugljenika?', ['Što je više razgranat lanac, to je niža temperatura ključanja', 'Što je više razgranat lanac, to je viša temperatura ključanja', 'Sve su im iste', 'Zavise samo od boje'], 'Kod razgranatih molekula međumolekulske sile su slabije.', 'razgranat', { o: mol('neopentan') });
  Q(2, 'Koliko atoma vodonika ima molekul butana?', ['10', '8', '12', '14'], 'Opšta formula alkana je CₙH₂ₙ₊₂: 2 · 4 + 2 = 10.', 'butan', { o: mol('butan') });
  Q(3, 'Koju molekulsku formulu ima heksan?', ['C₆H₁₄', 'C₆H₁₂', 'C₆H₁₀', 'C₆H₆'], 'C₆H₁₄ – zasićeni acikličan ugljovodonik.', 'heksan', { o: mol('heksan') });
  Q(2, 'Šta pokazuje rationalna strukturna formula?', ['Veze između atoma ugljenika, bez C–H veza', 'Samo brojeve atoma', 'Samo boju molekula', 'Sve veze, uključujući C–H'], 'Zbog toga je pogodna za crtanje velikih molekula.', 'formula', { o: mol('izopentan') });
  U(2, 'Koje jedinjenje NIJE ugljovodonik?', ['Etanol', 'Eten', 'Propan', 'Benzen'], 'Etanol sadrži i kiseonik (–OH), pa je alkohol.', 'Ugljovodonici sadrže samo C i H.', 'ugljovod', { o: mol('etanol') });

  // ───────────── Alkani ─────────────
  L('Alkani');
  Q(1, 'Koji je najjednostavniji alkan?', ['Metan', 'Etan', 'Propan', 'Butan'], 'Metan CH₄ je glavni sastojak zemnog gasa.', 'metan', { o: mol('metan') });
  Q(1, 'Koja je opšta formula alkana?', ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ'], 'Za n = 1 dobija se CH₄, za n = 2 C₂H₆.', 'formula', { o: mol('etan') });
  Q(1, 'Koji nastavak imaju nazivi alkana?', ['-an', '-en', '-in', '-ol'], 'Etan, propan, butan, pentan…', 'nastavak', { o: mol('propan') });
  Q(1, 'Koja je molekulska formula propana?', ['C₃H₈', 'C₃H₆', 'C₃H₄', 'C₂H₆'], 'Propan se nalazi u plinskim bocama (TNG).', 'propan', { o: mol('propan') });
  Q(2, 'Koliko atoma ugljenika ima pentan?', ['Pet', 'Četiri', 'Šest', 'Tri'], 'Pent- znači pet.', 'pentan', { o: mol('pentan') });
  S(1, 'Spoji alkan sa brojem atoma ugljenika.', [['Metan', '1'], ['Etan', '2'], ['Propan', '3'], ['Butan', '4']], 'Posle butana nazivi dolaze od grčkih brojeva: pent-, heks-, hept-, okt-…', 'brojevi', { o: mol('butan') });
  Q(2, 'Šta je homologi niz?', ['Niz jedinjenja u kome se susedni članovi razlikuju za grupu CH₂', 'Niz atoma u molekulu', 'Niz jedinjenja istog agregatnog stanja', 'Niz izomera'], 'Metan, etan, propan… svaki sledeći ima jednu CH₂ grupu više.', 'homologi', { o: mol('heptan') });
  Q(2, 'U kom agregatnom stanju su alkani sa 5 do 17 atoma ugljenika?', ['Tečnom', 'Gasovitom', 'Čvrstom', 'Plazmi'], 'Alkani do 4 C su gasovi, a sa 18 i više C su čvrsti (parafin).', 'tečni', { o: mol('oktan') });
  Q(2, 'Šta su alkil-grupe?', ['Grupe koje se dobiju kad se alkanu oduzme jedan vodonik', 'Alkoholi sa dugim lancem', 'Soli alkana', 'Grupe atoma u alkenima'], 'Ime se dobija zamenom nastavka -an nastavkom -il: metan → metil, etan → etil.', 'alkil', { o: mol('izopentan') });
  Q(2, 'Kako se zove alkil-grupa koja nastaje od metana?', ['Metil (–CH₃)', 'Etil (–C₂H₅)', 'Propil (–C₃H₇)', 'Butil (–C₄H₉)'], 'Alkil-grupa ne postoji sama, već samo kao deo većeg molekula.', 'metil', { o: mol('izobutan') });
  Q(3, 'Koji je ispravan naziv jedinjenja CH₃–CH(CH₃)–CH₂–CH₃?', ['2-metilbutan', '3-metilbutan', '2-etilpropan', '1,1-dimetilpropan'], 'Najduži niz ima četiri C (butan); račvanje je na drugom C od bližeg kraja.', 'naziv', { o: mol('izopentan') });
  Q(3, 'Kako se zove alkan CH₃–C(CH₃)₂–CH₃?', ['2,2-dimetilpropan', '2-metilbutan', 'Pentan', '1,1,1-trimetilmetan'], 'Najduži niz su tri C (propan), a na drugom C su dve metil-grupe.', 'neopentan', { o: mol('neopentan') });
  Q(2, 'Koliko ugljenikovih atoma ima 2,3-dimetilbutan?', ['Šest', 'Četiri', 'Pet', 'Osam'], 'Butan (4 C) plus dve metil-grupe (2 C) = 6 C, formula C₆H₁₄.', 'ugljenik', { o: mol('2,3-dimetilbutan') });
  Q(2, 'Koja je molekulska formula oktana?', ['C₈H₁₈', 'C₈H₁₆', 'C₈H₁₄', 'C₇H₁₆'], 'Oktan je jedan od sastojaka benzina; po njemu se meri oktanski broj.', 'oktan', { o: mol('oktan') });
  Q(3, 'Koliko iznosi molarna masa etana C₂H₆ ($Ar(C)$ = 12, $Ar(H)$ = 1)?', ['30 g/mol', '28 g/mol', '16 g/mol', '32 g/mol'], 'M = 2 · 12 + 6 · 1 = 30.', 'mol', { o: mol('etan') });
  U(2, 'Koja formula NIJE formula alkana?', ['C₄H₈', 'C₃H₈', 'C₅H₁₂', 'CH₄'], 'C₄H₈ ima formulu CₙH₂ₙ – to je alken (ili cikloalkan).', 'Alkani imaju CₙH₂ₙ₊₂.', 'formula', { o: mol('but-1-en') });

  // ───────────── Alkeni i alkini ─────────────
  L('Alkeni i alkini');
  Q(1, 'Koja je opšta formula alkena?', ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙHₙ'], 'Alkeni imaju dva vodonika manje od alkana sa istim brojem ugljenika.', 'formula', { o: mol('propen') });
  Q(1, 'Koja je opšta formula alkina?', ['CₙH₂ₙ₋₂', 'CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₊₁'], 'Zbog trostruke veze imaju četiri vodonika manje od alkana.', 'formula', { o: mol('propin') });
  Q(1, 'Koji nastavak imaju nazivi alkena?', ['-en', '-an', '-in', '-il'], 'Eten, propen, buten…', 'nastavak', { o: mol('eten') });
  Q(1, 'Koji nastavak imaju nazivi alkina?', ['-in', '-en', '-an', '-ol'], 'Etin, propin, butin…', 'nastavak', { o: mol('etin') });
  Q(2, 'Koliko atoma vodonika ima molekul etena?', ['Četiri', 'Šest', 'Dva', 'Tri'], 'C₂H₄ – po dva vodonika na svakom ugljeniku.', 'eten', { o: mol('eten') });
  Q(2, 'Koliko atoma vodonika ima molekul etina?', ['Dva', 'Četiri', 'Šest', 'Jedan'], 'C₂H₂ – po jedan vodonik na svakom ugljeniku.', 'etin', { o: mol('etin') });
  Q(1, 'Koji je najprostiji alken?', ['Eten', 'Metan', 'Propen', 'Etin'], 'Eten se zove i etilen i koristi se za dobijanje polietilena.', 'eten', { o: mol('eten') });
  Q(2, 'Koji gas se koristi za zavarivanje metala, jer pri sagorevanju daje veoma visoku temperaturu?', ['Etin (acetilen)', 'Eten', 'Metan', 'Azot'], 'Plamen etina i kiseonika dostiže oko 3000 °C.', 'acetilen', { o: R('2etin+5kiseonik>4ugljen-dioksid+2voda', { efekat: 'plamen' }) });
  Q(2, 'Koja je molekulska formula propena?', ['C₃H₆', 'C₃H₈', 'C₃H₄', 'C₂H₄'], 'Propen je polazna sirovina za proizvodnju polipropilena.', 'propen', { o: mol('propen') });
  Q(3, 'Koliko izomera sa dvostrukom vezom ima buten C₄H₈ (bez izobutena)?', ['Dva: but-1-en i but-2-en', 'Jedan', 'Tri', 'Nijedan'], 'Položaj dvostruke veze menja svojstva jedinjenja.', 'buten', { m: mol('but-1-en'), o: mol('but-2-en') });
  Q(3, 'Zašto se u nazivu but-1-en piše broj 1?', ['Pokazuje atom ugljenika od koga počinje dvostruka veza', 'Pokazuje broj vodonika', 'Pokazuje broj izomera', 'Pokazuje masu'], 'Numeracija počinje od kraja lanca koji je bliži višestrukoj vezi.', 'položaj', { o: mol('but-1-en') });
  Q(2, 'Koliko ugljenika ima pent-1-en?', ['Pet', 'Jedan', 'Deset', 'Šest'], 'Pent- znači pet, -1-en dvostruku vezu na prvom mestu.', 'penten', { o: mol('pent-1-en') });
  Q(2, 'Kako se alkeni mogu razlikovati od alkana reakcijom sa rastvorom kalijum-permanganata?', ['Alken obezbojava ljubičasti rastvor, alkan ne', 'Alkan obezbojava, alken ne', 'Oba je obezboje', 'Nijedan ne reaguje'], 'Dvostruka veza je reaktivna – KMnO₄ je oksiduje i gubi ljubičastu boju.', 'permanganat', { o: epr('baza') });
  Q(2, 'Koja je molekulska formula but-1-ina?', ['C₄H₆', 'C₄H₈', 'C₄H₁₀', 'C₃H₄'], 'CₙH₂ₙ₋₂ za n = 4 daje C₄H₆.', 'butin', { o: mol('but-1-in') });
  Q(3, 'Koja formula opisuje alkin sa 3 atoma ugljenika?', ['C₃H₄', 'C₃H₆', 'C₃H₈', 'C₃H₂'], '2 · 3 − 2 = 4 vodonika; to je propin.', 'propin', { o: mol('propin') });
  U(2, 'Koji ugljovodonik NIJE alken?', ['Etin', 'Eten', 'Propen', 'But-2-en'], 'Etin ima trostruku vezu – alkin je.', 'Alkeni imaju samo jednu dvostruku vezu.', 'alkin', { o: mol('etin') });

  // ───────────── Hemijska svojstva ugljovodonika ─────────────
  L('Hemijska svojstva ugljovodonika');
  Q(1, 'Šta nastaje potpunim sagorevanjem ugljovodonika?', ['Ugljen(IV)-oksid i voda', 'Ugljen(II)-oksid i čađ', 'Vodonik i ugljenik', 'Kiselina i so'], 'CH₄ + 2O₂ → CO₂ + 2H₂O. Reakcija je egzotermna – oslobađa se toplota.', 'sagorevanje', { o: R('metan+2kiseonik>ugljen-dioksid+2voda', { efekat: 'plamen' }) });
  Q(2, 'Šta nastaje nepotpunim sagorevanjem ugljovodonika?', ['Čađ i otrovni CO', 'Samo voda', 'Samo ugljen-dioksid', 'Sumporna kiselina'], 'Zato u zatvorenim prostorijama gorenje bez dovoljno vazduha može biti smrtonosno.', 'nepotpuno', { o: mol('ugljen-monoksid') });
  Q(2, 'Kako izgleda jednačina sagorevanja propana?', ['C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', 'C₃H₈ + 3O₂ → 3CO₂ + 4H₂O', 'C₃H₈ + 5O₂ → 3CO + 4H₂O', 'C₃H₈ + O₂ → 3CO₂ + H₂O'], 'Na levoj i desnoj strani mora biti isti broj atoma svakog elementa.', 'propan', { o: R('propan+5kiseonik>3ugljen-dioksid+4voda', { efekat: 'plamen' }) });
  Q(2, 'Šta je supstitucija (zamena)?', ['Zamena atoma vodonika drugim atomom ili grupom', 'Dodavanje atoma na dvostruku vezu', 'Spajanje malih molekula u dugi lanac', 'Razlaganje na jednostavnije supstance'], 'Alkani reaguju supstitucijom, na primer sa hlorom.', 'zamena', { o: R('metan+hlor>hlormetan+hlorovodonik', { efekat: 'sjaj' }) });
  Q(2, 'Šta nastaje u reakciji metana sa hlorom na svetlosti?', ['Hlormetan i hlorovodonik', 'Ugljenik i hlorovodonik', 'Hloretan i vodonik', 'Metanol i voda'], 'CH₄ + Cl₂ → CH₃Cl + HCl.', 'hlormetan', { o: R('metan+hlor>hlormetan+hlorovodonik', { efekat: 'sjaj' }) });
  Q(2, 'Šta je adicija (nadovezivanje)?', ['Dodavanje atoma na dvostruku ili trostruku vezu', 'Zamena vodonika hlorom', 'Sagorevanje u kiseoniku', 'Razlaganje zagrevanjem'], 'Pri adiciji dvostruka veza prelazi u jednostruku.', 'adicija', { o: R('eten+vodonik>etan') });
  Q(2, 'Šta nastaje adicijom vodonika na eten?', ['Etan', 'Etin', 'Metan', 'Propan'], 'Reakcija se zove hidrogenizacija: C₂H₄ + H₂ → C₂H₆.', 'etan', { o: R('eten+vodonik>etan') });
  Q(2, 'Šta nastaje adicijom broma na eten?', ['1,2-dibrometan', 'Bromoetan', 'Brombenzen', 'Etan'], 'Narandžasta boja bromne vode nestaje – to je dokaz dvostruke veze.', 'dibrometan', { o: R('eten+brom>dibrometan') });
  Q(3, 'Šta nastaje adicijom dva mola vodonika na jedan mol etina?', ['Etan', 'Eten', 'Metan', 'Propan'], 'Prvo nastaje eten, pa adicijom drugog mola vodonika etan.', 'etin', { o: R('etin+2vodonik>etan') });
  Q(2, 'Koja reakcija je karakteristična za alkane?', ['Supstitucija', 'Adicija', 'Polimerizacija', 'Hidroliza'], 'Alkani nemaju dvostruku vezu, pa ne mogu adirati.', 'alkani', { o: mol('hlormetan') });
  Q(2, 'Koja reakcija je karakteristična za alkene i alkine?', ['Adicija', 'Supstitucija', 'Neutralizacija', 'Taloženje'], 'Dvostruka i trostruka veza se "otvaraju" i prihvataju nove atome.', 'alkeni', { o: R('eten+hlorovodonik>hloretan') });
  Q(3, 'Koji proizvod nastaje adicijom HCl na eten?', ['Hloretan', '1,2-dihloretan', 'Hlorovodonik', 'Hlormetan'], 'C₂H₄ + HCl → C₂H₅Cl.', 'hloretan', { o: R('eten+hlorovodonik>hloretan') });
  Q(2, 'Zašto su ugljovodonici dobra goriva?', ['Sagorevanjem oslobađaju mnogo toplote', 'Ne sagorevaju do kraja', 'Rastvaraju se u vodi', 'Sadrže metale'], 'Zato ih koristimo za grejanje, motore i proizvodnju struje.', 'gorivo', { o: R('metan+2kiseonik>ugljen-dioksid+2voda', { efekat: 'plamen' }) });
  Q(2, 'Koji gas nastaje u većim količinama sagorevanjem fosilnih goriva i pojačava efekat staklene bašte?', ['CO₂', 'N₂', 'O₂', 'He'], 'Zato se traže alternativni izvori energije.', 'staklenik', { o: mol('ugljen-dioksid') });
  Q(3, 'Koliko molova kiseonika je potrebno za potpuno sagorevanje 1 mola etana?', ['3,5 mola', '2 mola', '3 mola', '7 molova'], '2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O: za jedan mol etana 3,5 mola O₂.', 'etan', { o: R('2etan+7kiseonik>4ugljen-dioksid+6voda', { efekat: 'plamen' }) });
  U(2, 'Koja reakcija NIJE tipična za ugljovodonike?', ['Neutralizacija', 'Sagorevanje', 'Supstitucija', 'Adicija'], 'Neutralizacija je reakcija kiseline i baze.', 'Ugljovodonici nisu ni kiseline ni baze.', 'reakcije', { o: R('metan+2kiseonik>ugljen-dioksid+2voda', { efekat: 'plamen' }) });

  // ───────────── Aromatični ugljovodonici ─────────────
  L('Aromatični ugljovodonici');
  Q(1, 'Koji je najjednostavniji aromatični ugljovodonik?', ['Benzen', 'Toluen', 'Cikloheksan', 'Naftalen'], 'Benzen ima prsten od šest atoma ugljenika.', 'benzen', { o: mol('benzen') });
  Q(1, 'Koja je molekulska formula benzena?', ['C₆H₆', 'C₆H₁₂', 'C₆H₁₄', 'C₆H₈'], 'Šest ugljenika i šest vodonika, raspoređenih u ravni.', 'formula', { o: mol('benzen') });
  Q(2, 'Kakav je oblik molekula benzena?', ['Ravan šestougao', 'Tetraedar', 'Linearan', 'Piramida'], 'Svi atomi benzena leže u istoj ravni.', 'prsten', { m: mol('benzen') });
  Q(2, 'Kakve veze povezuju ugljenike u benzenu?', ['Naizmenično jednostruke i dvostruke (delokalizovane)', 'Samo jednostruke', 'Samo dvostruke', 'Jonske'], 'Elektroni dvostrukih veza su razmešteni po celom prstenu – veze su istovetne.', 'prsten', { o: mol('benzen') });
  Q(2, 'Kako se zove benzen sa jednom metil-grupom?', ['Toluen', 'Stiren', 'Fenol', 'Heksan'], 'Toluen je rastvarač u bojama i lakovima.', 'toluen', { o: mol('toluen') });
  Q(2, 'Po čemu su aromatični ugljovodonici dobili ime?', ['Zbog karakterističnog mirisa prvih otkrivenih jedinjenja', 'Zato što su napravljeni od voća', 'Zato što su providni', 'Zbog boje plamena'], 'Mnogi su imali miris, ali su danas poznati i kao štetni.', 'aroma', { o: mol('toluen') });
  Q(3, 'Zašto benzen ulazi pre u supstituciju nego u adiciju?', ['Delokalizovani elektroni daju stabilnost prstenu', 'Nema atoma vodonika', 'Ima trostruku vezu', 'Ne sadrži ugljenik'], 'Adicija bi razorila stabilni aromatični sistem.', 'stabilnost', { o: R('benzen+brom>brombenzen+bromovodonik', { otvoreno: true }) });
  Q(2, 'Šta nastaje supstitucijom jednog vodonika u benzenu hlorom?', ['Hlorbenzen', 'Heksahlorcikloheksan', 'Hlorovodonik', 'Hloroform'], 'C₆H₆ + Cl₂ → C₆H₅Cl + HCl (uz katalizator).', 'hlorbenzen', { o: mol('hlorbenzen') });
  Q(2, 'Šta je rizik izlaganja benzenu?', ['Kancerogen je i otrovan', 'Izaziva alergiju na polen', 'Boji kožu u zeleno', 'Šteti samo biljkama'], 'Zato se benzen sve manje koristi i zamenjuje manje opasnim rastvaračima.', 'otrov', { o: lab('oznake', { znaci: ['zdravlje'] }) });
  Q(2, 'Koja jedinjenja se prave od aromatičnih ugljovodonika?', ['Boje, lekovi, plastika i eksplozivi', 'Samo šećeri', 'Samo đubriva', 'Samo soli'], 'Na primer aspirin, polistiren, TNT.', 'primena', { o: mol('stiren') });
  Q(3, 'Koliko ugljenikovih atoma ima toluen?', ['Sedam', 'Šest', 'Osam', 'Pet'], 'Šest u prstenu i jedan u metil-grupi: C₇H₈.', 'toluen', { o: mol('toluen') });
  Q(2, 'Koja je formula cikloheksana?', ['C₆H₁₂', 'C₆H₆', 'C₆H₁₀', 'C₆H₁₄'], 'Cikloheksan je zasićen – nije aromatičan.', 'cikloheksan', { o: mol('cikloheksan') });
  Q(2, 'Po čemu se cikloheksan razlikuje od benzena?', ['Ima samo jednostruke veze i nije ravan', 'Ima manje atoma ugljenika', 'Ima atom kiseonika', 'Provodi struju'], 'Benzen ima delokalizovane veze i ravan prsten.', 'razlika', { m: mol('cikloheksan'), o: mol('benzen') });
  Q(3, 'Koja je razlika u broju vodonika između heksana i benzena?', ['Osam', 'Šest', 'Dva', 'Dvanaest'], 'C₆H₁₄ i C₆H₆: 14 − 6 = 8.', 'razlika', { o: mol('heksan') });
  Q(2, 'Kako se naziva polimer koji nastaje od stirena?', ['Polistiren (stiropor)', 'Polietilen', 'Polivinil-hlorid', 'Teflon'], 'Stiropor je napenjen polistiren.', 'stiropor', { o: mol('stiren') });
  U(2, 'Koje jedinjenje NIJE aromatično?', ['Cikloheksan', 'Benzen', 'Toluen', 'Stiren'], 'Cikloheksan je zasićeni cikloalkan bez delokalizovanih veza.', 'Aromatični imaju prsten benzena.', 'aromatično', { o: mol('cikloheksan') });

  // ───────────── Nafta i zemni gas. Polimeri ─────────────
  L('Nafta i zemni gas. Polimeri');
  Q(1, 'Koja su tri osnovna fosilna goriva?', ['Ugalj, nafta i zemni gas', 'Drvo, ugalj i voda', 'Vetar, sunce i voda', 'Nafta, so i benzin'], 'Nastala su od ostataka biljaka i životinja tokom miliona godina.', 'fosilna', { o: lab('zemni-gas') });
  Q(1, 'Koji ugljovodonik je glavni sastojak zemnog gasa?', ['Metan', 'Etan', 'Propan', 'Butan'], 'Zemni gas se koristi za grejanje i kuvanje.', 'metan', { o: mol('metan') });
  Q(1, 'Šta je nafta?', ['Smeša mnogo ugljovodonika', 'Čist metan', 'Rastvor soli', 'Čist benzen'], 'Sirova nafta se razdvaja destilacijom na frakcije.', 'nafta', { o: lab('nafta') });
  Q(2, 'Po čemu se razdvajaju sastojci nafte pri frakcionoj destilaciji?', ['Po temperaturama ključanja', 'Po boji', 'Po rastvorljivosti u vodi', 'Po magnetnim svojstvima'], 'Lakši ugljovodonici ključaju na nižoj temperaturi i skupljaju se na vrhu kolone.', 'destilacija', { m: lab('nafta') });
  Q(2, 'Koja frakcija nafte se skuplja na vrhu kolone, na najnižoj temperaturi?', ['Naftni gas', 'Mazut', 'Dizel', 'Asfalt'], 'Na vrhu su najlakši, a na dnu najteži ugljovodonici.', 'gas', { o: lab('nafta', { istakni: 'gas' }) });
  Q(2, 'Šta ostaje na dnu kolone za destilaciju nafte?', ['Mazut i teški ostaci (asfalt)', 'Benzin', 'Kerozin', 'Zemni gas'], 'Od ostataka se prave maziva, parafin i asfalt.', 'mazut', { o: lab('nafta', { istakni: 'mazut' }) });
  Q(2, 'Koja frakcija nafte se koristi kao gorivo za mlazne avione?', ['Kerozin', 'Mazut', 'Naftni gas', 'Asfalt'], 'Kerozin ključa između otprilike 175 i 275 °C.', 'kerozin', { o: lab('nafta', { istakni: 'kerozin' }) });
  Q(2, 'Koja frakcija je gorivo za automobile sa benzinskim motorom?', ['Benzin', 'Dizel', 'Mazut', 'Kerozin'], 'Benzin je smeša ugljovodonika sa 5–10 ugljenikovih atoma.', 'benzin', { o: lab('nafta', { istakni: 'benzin' }) });
  Q(3, 'Zašto je sagorevanje fosilnih goriva problem za životnu sredinu?', ['Oslobađa CO₂ i druge zagađivače', 'Stvara previše kiseonika', 'Hladi atmosferu', 'Smanjuje količinu vode'], 'Nafta i ugalj nisu obnovljivi – troše se brže nego što nastaju.', 'zagađenje', { o: mol('ugljen-dioksid') });
  Q(2, 'Šta su polimeri?', ['Velike molekule nastale spajanjem mnogo malih (monomera)', 'Smeše metala', 'Kiseline sa dugim lancem', 'Sitni kristali soli'], 'Polietilen nastaje spajanjem molekula etena.', 'polimeri', { o: R('6eten>polietilen', { otvoreno: true }) });
  Q(2, 'Od kog monomera nastaje polietilen?', ['Etena', 'Etina', 'Etana', 'Propena'], 'Dvostruka veza u etenu se otvara, a molekuli se nižu u dugačak lanac.', 'polietilen', { o: R('6eten>polietilen', { otvoreno: true }) });
  Q(2, 'Od kog monomera nastaje PVC (polivinil-hlorid)?', ['Vinil-hlorida (hloretena)', 'Etena', 'Stirena', 'Metana'], 'PVC se koristi za cevi, prozore, podne obloge.', 'pvc', { o: R('3hloreten>pvc', { otvoreno: true }) });
  Q(2, 'Kako se naziva reakcija nastajanja polimera iz monomera?', ['Polimerizacija', 'Neutralizacija', 'Hidroliza', 'Supstitucija'], 'Monomeri se nižu jedan na drugi.', 'polimer', { o: R('4eten>polietilen', { otvoreno: true }) });
  Q(3, 'Zašto se plastika teško razgrađuje u prirodi?', ['Veze u polimerima su veoma postojane', 'Ne sadrži ugljenik', 'Rastvara se u vodi', 'Lako sagoreva u zemlji'], 'Zato je važna reciklaža i smanjenje upotrebe jednokratne plastike.', 'plastika', { o: mol('polietilen') });
  Q(2, 'Za šta se najviše koristi polietilen?', ['Za kese, folije i flaše', 'Za izradu kablova od bakra', 'Za proizvodnju stakla', 'Za izradu cigle'], 'Postoje polietilen male i velike gustine.', 'kese', { o: mol('polietilen') });
  S(2, 'Spoji polimer sa monomerom od koga nastaje.', [['Polietilen', 'Eten'], ['PVC', 'Hloreten (vinil-hlorid)'], ['Polistiren', 'Stiren'], ['Polipropilen', 'Propen']], 'Svi ovi monomeri imaju C=C dvostruku vezu koja se otvara pri polimerizaciji.', 'monomeri', { o: mol('pvc') });
};
