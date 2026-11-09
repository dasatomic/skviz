# 🦉 Skviz

Porodični kviz znanja za igru preko telefona (u stilu Jackbox igara). Igra se na **https://skviz.rs**, a može se pokrenuti i kod kuće, u kućnoj mreži.

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
6. **Krug 2 – Najduža reč:** od 12 slova složi najdužu srpsku reč u osnovnom obliku. Reči proverava rečnik od ~160.000 reči; na kraju se vidi i najduža moguća reč.
7. **Proglašenje pobednika** na podijumu; rezultati se upisuju u porodičnu tablu slavnih.

TV ili računar može biti veliki ekran za sve: otvori `/ekran` i upiši kod sobe.

## Oblasti

Matematika, fizika, hemija, biologija, srpska istorija, svetska istorija, manastiri Srbije, geografija, srpski jezik i književnost, muzička kultura, slikarstvo i arhitektura, sport, opšta kultura, zabava (filmovi, serije, igrice).

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
- **Pitanja i tekstovi:** [CC BY-SA 4.0](LICENSE-SADRZAJ.md)
- **Slike:** sopstvene licence autora, vidi [SLIKE.md](SLIKE.md)
- **Rečnik, mape i drugi tuđi materijali:** vidi [NOTICE.md](NOTICE.md)

Paketi pitanja „5/6/7. razred“ nastali su po besplatnim udžbenicima Fondacije „Alek Kavčić“; tekst udžbenika
nije deo repozitorijuma (pitanja su napisana svojim rečima).
