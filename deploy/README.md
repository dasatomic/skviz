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
