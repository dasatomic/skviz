# Objavljivanje (deploy) na skviz.rs

Sve se radi sa svog računara, iz korena projekta.

```bash
cd ~/projects/gric_kviz
git add -A && git commit -m "Opis izmene"   # objavljuje se samo ono što je commitovano
git push                                     # čuva izmene na GitHub-u (nije obavezno za deploy)
./deploy/objavi.sh root@2.29.146.92
```

Na kraju treba da piše `active` i `Igra radi ✓`.

## Šta skripta radi
1. Uzme poslednji commit (necommitovane izmene se **ne šalju** – skripta upozori).
2. Pokrene proveru kvizova – ako ne prođe, ništa se ne šalje.
3. Pošalje kod na server u `/opt/gric-kviz` (ne dira statistiku i istoriju odigranih pitanja na serveru).
4. Restartuje servis `gric-kviz` i proveri da igra odgovara.

## Važno
- Restart **prekida sve sobe u toku** (stanje je samo u memoriji) – objavljujte kad niko ne igra.
- Za pristup serveru koristi se SSH ključ dodat na Hetzneru. Ako traži lozinku, ključ nije učitan.
- Starija verzija (vraćanje): `REF=<commit> ./deploy/objavi.sh root@2.29.146.92`
- Novi server (jednom): `DOMEN=skviz.rs ./deploy/objavi.sh root@IP --prvi-put` – instalira Node, Caddy (HTTPS) i firewall (`deploy/postavi-server.sh`).

## Provera i problemi
- Da li sajt radi: `curl -s https://skviz.rs/api/info`
- Logovi na serveru: `ssh root@2.29.146.92 journalctl -u gric-kviz -n 50`
- Ručni restart: `ssh root@2.29.146.92 systemctl restart gric-kviz`
- Status: `ssh root@2.29.146.92 systemctl status gric-kviz`

## Nalog za predloge (urednik pitanja, `/urednik`)

Urednik pitanja otvara pull request preko posebnog GitHub naloga („robota“). Robot **nema pravo pisanja** u `dasatomic/skviz`:
izmenu stavlja na granu u svom forku i odatle otvara PR, a vlasnik ga pregleda i prihvata ili odbija.
Ako token procuri, najviše što neko može je da otvara PR-ove i menja robotov fork.

1. **Novi nalog** (odjavi se sa svog, ili otvori privatni prozor): <https://github.com/signup>
   - imejl: zaseban, npr. `tvoja.adresa+skviz@gmail.com` (Gmail „+“ adrese stižu u isto sanduče)
   - korisničko ime: npr. `skviz-predlozi` (vidi se kao autor PR-ova)
   - GitHub dozvoljava jedan besplatan „mašinski“ nalog po osobi.
   - Podesi dvofaktorsku zaštitu (Settings → Password and authentication).
2. **Token** (prijavljen kao robot): Settings → Developer settings → Personal access tokens → **Tokens (classic)** → Generate new token (classic)
   - Note: `skviz urednik`, Expiration: 1 godina (stavi podsetnik u kalendar)
   - Scope: **samo `public_repo`**
   - Kopiraj token (`ghp_…`) – prikazuje se samo jednom.
   - Klasični token je potreban jer fine-grained token ne može da otvori PR u tuđem repozitorijumu.
3. **Token na server** (sa svog računara):
   ```bash
   ssh root@2.29.146.92 'umask 077; printf "GITHUB_TOKEN=%s\n" "ghp_TVOJ_TOKEN" > /etc/gric-kviz.env
     mkdir -p /etc/systemd/system/gric-kviz.service.d
     printf "[Service]\nEnvironmentFile=-/etc/gric-kviz.env\n" > /etc/systemd/system/gric-kviz.service.d/token.conf
     systemctl daemon-reload && systemctl restart gric-kviz'
   curl -s https://skviz.rs/api/predlog/info     # → {"ukljuceno":true,...}
   ```
   (Novi serveri dobijaju `EnvironmentFile` automatski iz `postavi-server.sh`; dovoljan je prvi red.)
   Lokalno: `GITHUB_TOKEN=ghp_… npm start`.
4. **Fork** se pravi sam pri prvom predlogu (`skviz-predlozi/skviz`).
5. Na svom nalogu (`dasatomic`): Watch → Custom → Pull requests, da stižu imejlovi o predlozima.
   GitHub Actions za PR-ove iz forka novih saradnika traže odobrenje („Approve and run“) – to je u redu.

Prihvatanje predloga: na stranici PR-a „Merge pull request“, pa `git pull` i `./deploy/objavi.sh …`.
Autor predloga vidi stanje („Čeka pregled / Prihvaćeno“) i komentare u uredniku pod „Moji predlozi“.
Ograničenja: 10 predloga na sat po adresi, 100 dnevno ukupno (`LIMIT_PREDLOGA`, `LIMIT_PREDLOGA_DAN`); provera stanja predloga („Moji predlozi“) 20 puta u minutu po adresi (`LIMIT_STANJA`).
