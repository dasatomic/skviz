# 🦉 Skviz

Školski kviz znanja za igru preko telefona (u stilu Jackbox igara). Igra se na **https://skviz.rs**, a može se pokrenuti i kod kuće, u kućnoj mreži.

## Pokretanje

```bash
git clone https://github.com/dasatomic/skviz.git
cd skviz
node server.js
```

Server ispiše adresu, npr. `http://192.168.1.107:3000`. Ako telefoni ne mogu da se povežu, otvori port u firewall-u:

```bash
sudo ufw allow 3000/tcp
```

## Kako se igra

1. Svako na svom telefonu otvori adresu, upiše ime i izabere životinjicu.
2. Jedan igrač napravi sobu („Napravi sobu“) i postaje vođa igre 👑; ostali ulaze sa kodom od 4 slova.
3. Vođa bira kviz (Opšte znanje ili posebna oblast) i podešavanja, pa pokreće igru. Može da se igra i sam.
4. **Krug 1 – pitanja:** 15 pitanja sa 4 ponuđena odgovora (slike, 3D molekuli i tela, mape, melodije, Morzeova azbuka, emodži-rebusi…). Brži tačan odgovor donosi više poena, teška pitanja ×1,5, a niz tačnih odgovora bonus. Posle svakog pitanja ide „💡 Da li si znao?“.
5. **Rang lista** sa animacijom.
6. **Krug 2 – bonus**, zavisno od predmeta:
   - **Na slovo…** (geografija, fizika i matematika, istorija, sport): zadato je slovo, a igrači kucaju što više pojmova na to slovo – država, grad, reka i planina („zanimljiva geografija“), matematičari i fizičari, istorijske ličnosti ili sportisti. Važe latinica i ćirilica, sitne slovne greške (Cacak, Mihailo Pupin) i strani oblici imena (Euler = Ojler), a ne važi pogrešno ime (Marko Pupin). Rečnici su iz Wikidate (`podaci/bonus/`, gradi ih `node alati/gradi-bonus.js`); na kraju runde se vide slike i podaci o navedenim ličnostima i šta se još moglo navesti.
   - **Najduža reč** (ostali predmeti): od 12 slova složi najdužu srpsku reč u osnovnom obliku (važe i imena – Venera, Beograd – i pojmovi iz kvizova). Reči proverava Hunspell rečnik srpskog jezika (~190.000 osnovnih reči); za promenjen oblik („kućama“) igra kaže koja je osnovna reč, a na kraju se vidi i najduža moguća reč.
   - U „Opštem znanju“ bonus je iznenađenje: najduža reč ili jedna od igara „Na slovo…“.
7. **Proglašenje pobednika** na podijumu; rezultati se upisuju u porodičnu tablu slavnih.

TV ili računar može biti veliki ekran za sve: otvori `/ekran` i upiši kod sobe.

## Oblasti

Matematika, fizika, hemija, biologija, srpska istorija, svetska istorija, manastiri Srbije, geografija, srpski jezik i književnost, muzička kultura, slikarstvo i arhitektura, sport, zabava (filmovi, serije, igrice).

Novi kvizovi se dodaju kao folder u `kvizovi/` – vidi [kvizovi/UPUTSTVO.md](kvizovi/UPUTSTVO.md). Provera: `npm run proveri`.

## Pokretanje za razvoj

Potreban je samo Node.js 18 ili noviji – nema `npm install`.

```bash
npm start            # pokreće server na portu 3000
npm run proveri      # proverava sve kvizove (format, duplikate, slike)
```

Statistika igrača čuva se lokalno u `podaci/statistika.json` (nije deo repozitorijuma).

## Doprinos

Pitanja i ispravke su dobrodošli – vidi [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

- **Kôd:** [MIT](LICENSE)
- **Pitanja i tekstovi:** [CC0 – javni domen](LICENSE-SADRZAJ.md)
- **Slike:** sopstvene licence autora, vidi [SLIKE.md](SLIKE.md)
- **Rečnik, mape i drugi tuđi materijali:** vidi [NOTICE.md](NOTICE.md)

Paketi pitanja „5/6/7. razred“ nastali su po besplatnim udžbenicima Fondacije „Alek Kavčić“; tekst udžbenika
nije deo repozitorijuma (pitanja su napisana svojim rečima).
