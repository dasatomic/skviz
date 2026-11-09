# Kako da doprineseš

Najlakši način je da dodaš nova pitanja ili popraviš netačna – svaka pomoć je dobrodošla! 🦉

## Dodavanje pitanja

**Najlakše:** otvori [skviz.rs/urednik](https://skviz.rs/urednik), izaberi predmet, izmeni ili dodaj pitanje i klikni „Predloži“ – pull request se otvara sam, bez znanja JSON-a i bez GitHub naloga.

Ručno, preko GitHub-a:

1. Pročitaj [kvizovi/UPUTSTVO.md](kvizovi/UPUTSTVO.md) (format kviza i svi tipovi medija).
2. Dodaj pitanja u `kviz.json` postojećeg paketa ili napravi novi folder u `kvizovi/`.
   Za brzo dodavanje većeg broja pitanja koristi `node alati/dodaj-pitanja.js <folder> <fajl.txt>`.
3. Pokreni `npm run proveri` – mora da prođe bez grešaka.
4. Otvori pull request.

## Pravila kvaliteta

- Pitanja su za decu od 11 do 15 godina, ali neka bude i nekoliko teških za odrasle.
- **Činjenice moraju biti tačne** – ako nisi siguran, pitanje ne dodaj. Navedi izvor u opisu pull request-a.
- Obavezna je „zanimljivost“: nešto **neočigledno** što proširuje znanje, a ne ponavljanje odgovora.
- Pored običnih pitanja, dobrodošla su i „Izbaci uljeza“ i „Spoji pojmove“ (vidi `kvizovi/UPUTSTVO.md`).
- Dodaj i `rec` – ključni pojam pitanja (3–11 slova, idealno 5–8). Krug „Najduža reč“ sakriva jedan od tih pojmova u slovima, da se gradivo ponovi.
- Pitanja piši **svojim rečima** – ne prepisuj odlomke iz knjiga, enciklopedija ni stihove pesama.
- Tačan odgovor je uvek prvi u listi `odgovori` (igra ih sama meša); netačni odgovori treba da budu verodostojni.
- Slike: samo sa slobodnom licencom (Wikimedia Commons). Preuzmi ih alatom `alati/preuzmi-slike.js`, a licence proveri/osveži sa `node alati/licence-slika.js`.

## Prijava grešaka

Otvori issue sa pitanjem koje je netačno i tačnim odgovorom (sa izvorom).

Sav sadržaj se objavljuje pod licencama navedenim u [LICENSE](LICENSE) i [LICENSE-SADRZAJ.md](LICENSE-SADRZAJ.md).
