// Logika jedne sobe (igre).
const kvizovi = require('./kvizovi');
const recnik = require('./recnik');
const statistika = require('./statistika');

const BOJE = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8', '#fab1a0', '#81ecec', '#e17055', '#00b894'];
// za veće sobe – još 30 različitih boja (zlatni ugao po krugu boja)
for (let i = 0; i < 30; i++) BOJE.push(`hsl(${Math.round((i * 137.5 + 20) % 360)} ${i % 2 ? 65 : 80}% ${i % 3 ? 68 : 60}%)`);
const MAKS_IGRACA = 40;

class Soba {
  constructor(kod, onPromena) {
    this.kod = kod;
    this.onPromena = onPromena;
    this.igraci = new Map(); // id -> igrač
    this.domacin = null;
    this.faza = 'lobi';
    this.podesavanja = {
      kviz: 'opste',
      brojPitanja: 15,
      vreme: 20,
      krugovi: 'oba', // 'oba' | 'pitanja' | 'reci'
      brojReci: 1,
      vremeReci: 75,
      pismo: 'cirilica',
      // matematički zadaci: posebno (manje zadataka, više vremena)
      brojZadataka: 5,
      vremeZadatka: 300,
    };
    this.pitanja = [];
    this.i = -1;
    this.krug = 0;
    this.krugovi = [];
    this.tajmer = null;
    this.rokDo = 0;
    this.pocetak = 0;
    this.prethodniRang = [];
    this.reci = null;
    this.zadnjaAktivnost = Date.now();
    this.verzija = 0;
    this.napravljena = Date.now();
    this.igraPocela = 0;
  }

  // telemetrija (server postavlja Soba.zabelezi = (tip, soba, trajanje) => …)
  zabelezi(tip, trajanje) {
    try { Soba.zabelezi?.(tip, this, trajanje); } catch (e) { console.error('telemetrija:', e.message); }
  }

  // igrač je „prisutan“ ako ima otvoren SSE tok ili se skoro javio preko long-pollinga
  aktivan(ig) {
    return ig.veze > 0 || Date.now() - (ig.zadnjiPoziv || 0) < 35000;
  }

  vidjen(id) {
    const ig = this.igraci.get(id);
    if (!ig) return;
    const bio = this.aktivan(ig);
    ig.zadnjiPoziv = Date.now();
    if (!bio) this.promena();
  }

  // ───────── igrači ─────────
  dodajIgraca(id, ime, avatar) {
    ime = String(ime || '').trim().slice(0, 16) || 'Igrač';
    let ig = this.igraci.get(id);
    if (!ig) {
      if (this.igraci.size >= MAKS_IGRACA) return null; // soba je puna
      const zauzeto = new Set([...this.igraci.values()].map((x) => x.boja));
      ig = {
        id, ime, avatar: String(avatar || '🙂').slice(0, 8),
        boja: BOJE.find((b) => !zauzeto.has(b)) || BOJE[this.igraci.size % BOJE.length],
        poeni: 0, niz: 0, tacnih: 0, odgovorenih: 0, najduzaRec: '',
        veze: 0, odsutanOd: 0, usaoU: Date.now(),
      };
      this.igraci.set(id, ig);
    } else {
      ig.ime = ime;
      if (avatar) ig.avatar = String(avatar).slice(0, 8);
    }
    if (!this.domacin) this.domacin = id;
    this.promena();
    return ig;
  }

  // brojVeza = koliko otvorenih SSE tokova igrač trenutno ima (broji server iz skupa tokova)
  povezan(id, brojVeza) {
    const ig = this.igraci.get(id);
    if (!ig) return;
    const bio = this.aktivan(ig);
    if (ig.veze > 0 && !brojVeza) ig.odsutanOd = Date.now();
    ig.veze = brojVeza;
    if (bio !== this.aktivan(ig)) this.promena();
  }

  // Vođa koji je odsutan duže od 8 s predaje vođstvo prvom prisutnom igraču. Server ovo proverava
  // periodično, pa važi i za telefone na long-pollingu (tamo nema događaja „veza je pukla“) –
  // inače bi igra ostala zaglavljena na ekranu koji čeka vođino „Dalje“.
  proveriDomacina() {
    const d = this.igraci.get(this.domacin);
    if (d) {
      if (this.aktivan(d)) return;
      const odsutanOd = Math.max(d.odsutanOd || 0, d.usaoU || 0, d.zadnjiPoziv ? d.zadnjiPoziv + 35000 : 0);
      if (Date.now() - odsutanOd < 8000) return;
    }
    const novi = [...this.igraci.values()].find((x) => x !== d && this.aktivan(x));
    if (!novi) return;
    this.domacin = novi.id;
    this.promena();
  }

  izbaci(id) {
    this.igraci.delete(id);
    if (this.domacin === id) this.domacin = [...this.igraci.keys()][0] || null;
    this.proveriKrajOdgovora();
    this.promena();
  }

  promena() {
    this.verzija++;
    this.zadnjaAktivnost = Date.now();
    this.onPromena(this);
  }

  // ───────── tok igre ─────────
  postavi(p) {
    const s = this.podesavanja;
    if (p.kviz && kvizovi.postoji(p.kviz)) s.kviz = p.kviz;
    if ([5, 10, 15, 20, 25].includes(+p.brojPitanja)) s.brojPitanja = +p.brojPitanja;
    if ([10, 15, 20, 30, 45, 60].includes(+p.vreme)) s.vreme = +p.vreme;
    if (['oba', 'pitanja', 'reci'].includes(p.krugovi)) s.krugovi = p.krugovi;
    if ([1, 3, 5, 10, 15].includes(+p.brojReci)) s.brojReci = +p.brojReci;
    if ([45, 60, 75, 90, 120].includes(+p.vremeReci)) s.vremeReci = +p.vremeReci;
    if (['latinica', 'cirilica'].includes(p.pismo)) s.pismo = p.pismo;
    if ([1, 3, 5, 10].includes(+p.brojZadataka)) s.brojZadataka = +p.brojZadataka;
    if ([120, 180, 300, 480, 600, 900].includes(+p.vremeZadatka)) s.vremeZadatka = +p.vremeZadatka;
    this.promena();
  }

  // vraća false ako za izabrani kviz nema pitanja (soba ostaje u lobiju)
  pokreni() {
    if (this.faza !== 'lobi') return true; // dvostruki pritisak na „Pokreni“ – igra je već krenula
    const s = this.podesavanja;
    for (const ig of this.igraci.values()) Object.assign(ig, { poeni: 0, niz: 0, tacnih: 0, odgovorenih: 0, najduzaRec: '' });
    this.krugovi = [];
    this.pitanja = [];
    this.iskorisceniPojmovi = new Set();
    // zadaci: samo krug pitanja (zadataka), bez „Najduže reči“
    this.zadaci = kvizovi.jeZadaci(s.kviz);
    if (this.zadaci) {
      this.pitanja = kvizovi.izaberi(s.kviz, s.brojZadataka).map((p) => this.pripremi(p));
      if (this.pitanja.length) this.krugovi.push('pitanja');
    } else {
      if (s.krugovi !== 'reci') {
        this.pitanja = kvizovi.izaberi(s.kviz, s.brojPitanja).map((p) => this.pripremi(p));
        if (this.pitanja.length) this.krugovi.push('pitanja');
      }
      if (s.krugovi !== 'pitanja') this.krugovi.push('reci');
    }
    // bez ijednog kruga (npr. kviz je u međuvremenu obrisan) igra bi se odmah završila i upisala praznu partiju u statistiku
    if (!this.krugovi.length) return false;
    this.krug = -1;
    this.prethodniRang = this.rang();
    this.igraPocela = Date.now();
    this.zabelezi('igra-pocela');
    this.sledeciKrug();
    return true;
  }

  // promešaj odgovore (u JSON-u je prvi odgovor uvek tačan)
  pripremi(p) {
    if (p.vrsta === 'spoji') {
      // levo i desno se mešaju nezavisno; tacanP[i] = indeks tačnog para (desno) za i-ti pojam levo
      const levi = kvizovi.promesaj(p.parovi.map((_, i) => i));
      const desni = kvizovi.promesaj(p.parovi.map((_, i) => i));
      return {
        ...p,
        levo: levi.map((i) => p.parovi[i][0]),
        desno: desni.map((i) => p.parovi[i][1]),
        tacanP: levi.map((i) => desni.indexOf(i)),
      };
    }
    const red = kvizovi.promesaj([0, 1, 2, 3].slice(0, p.odgovori.length));
    return {
      ...p,
      odgovoriP: red.map((i) => p.odgovori[i]),
      tacanP: red.indexOf(p.tacan ?? 0),
    };
  }

  sledeciKrug() {
    this.krug++;
    if (this.krug >= this.krugovi.length) return this.kraj();
    this.faza = 'uvod';
    this.uvod = { vrsta: this.krugovi[this.krug], broj: this.krug + 1 };
    this.i = -1;
    this.brojacReci = 0;
    this.zakaziAuto(6000, () => this.dalje());
    this.promena();
  }

  zakaziAuto(ms, fn) {
    clearTimeout(this.tajmer);
    this.rokDo = Date.now() + ms;
    this.tajmer = setTimeout(() => {
      // niko nije prisutan duže od minut – partija se prekida (ne vrti se u praznoj sobi)
      if (this.igraci.size && this.nikoNijeTu()) return this.uLobi();
      fn();
    }, ms);
  }

  nikoNijeTu() {
    const sad = Date.now();
    return [...this.igraci.values()].every((x) => !this.aktivan(x) && sad - Math.max(x.odsutanOd || 0, x.zadnjiPoziv || 0) > 60000);
  }

  // domaćin pritisne „Dalje“ (ili istekne automatski tajmer)
  // izFaze: faza koju je vođa video kad je pritisnuo – ako se u međuvremenu promenila (dvostruki pritisak,
  // ili je tajmer baš tad sam nastavio), pritisak se zanemaruje da ne preskoči sledeći ekran
  dalje(izFaze) {
    if (izFaze && izFaze !== this.faza) return;
    clearTimeout(this.tajmer);
    const vrsta = this.krugovi[this.krug];
    if (this.faza === 'uvod' || this.faza === 'otkrivanje' || this.faza === 'reci-otkrivanje') {
      if (vrsta === 'pitanja') {
        if (this.i + 1 < this.pitanja.length) return this.postaviPitanje(this.i + 1);
      } else if (this.brojacReci < this.podesavanja.brojReci) return this.postaviReci();
      return this.tabela();
    }
    if (this.faza === 'tabela') return this.sledeciKrug();
    if (this.faza === 'pitanje') return this.otkrij();
    if (this.faza === 'reci') return this.otkrijReci();
  }

  postaviPitanje(i) {
    this.i = i;
    this.faza = 'pitanje';
    const p = this.pitanja[i];
    const imaMedij = p.mediji && ['melodija', 'morze'].includes(p.mediji.vrsta);
    const sekundi = p.vreme || (this.zadaci ? this.podesavanja.vremeZadatka : 0) || this.podesavanja.vreme + (imaMedij ? 15 : p.mediji ? 5 : 0) + (p.vrsta === 'spoji' ? 5 * p.parovi.length : 0);
    this.odgovori = new Map(); // id -> { izbor, ms }
    this.pocetak = Date.now();
    this.zakaziAuto(sekundi * 1000 + 600, () => this.otkrij());
    this.trajanje = sekundi * 1000;
    this.promena();
  }

  odgovori_(id, izbor) {
    if (this.faza !== 'pitanje' || !this.igraci.has(id) || this.odgovori.has(id)) return;
    const p = this.pitanja[this.i];
    if (p.vrsta === 'spoji') {
      // izbor: za svaki pojam levo – indeks pojma desno (svaki desni najviše jednom)
      const n = p.levo.length;
      if (!Array.isArray(izbor) || izbor.length !== n) return;
      if (izbor.some((x) => !(Number.isInteger(x) && x >= 0 && x < n)) || new Set(izbor).size !== n) return;
    } else {
      if (!(Number.isInteger(izbor) && izbor >= 0 && izbor < 4)) return;
    }
    this.odgovori.set(id, { izbor, ms: Date.now() - this.pocetak });
    this.proveriKrajOdgovora();
    this.promena();
  }

  proveriKrajOdgovora() {
    if (this.faza === 'pitanje') {
      // ko je ušao posle početka pitanja ne zadržava otkrivanje (može da odgovori, ali se ne čeka)
      const aktivni = [...this.igraci.values()].filter((x) => this.odgovori.has(x.id) || (this.aktivan(x) && x.usaoU <= this.pocetak));
      if (aktivni.length && aktivni.every((x) => this.odgovori.has(x.id))) {
        clearTimeout(this.tajmer);
        this.tajmer = setTimeout(() => this.otkrij(), 900);
      }
    }
    if (this.faza === 'reci' && this.reci) {
      const aktivni = [...this.igraci.values()].filter((x) => this.aktivan(x));
      if (aktivni.length && aktivni.every((x) => this.reci.gotovi.has(x.id))) {
        clearTimeout(this.tajmer);
        this.tajmer = setTimeout(() => this.otkrijReci(), 600);
      }
    }
  }

  otkrij() {
    if (this.faza !== 'pitanje') return;
    clearTimeout(this.tajmer);
    const p = this.pitanja[this.i];
    const mnozilac = p.tezina === 3 ? 1.5 : 1;
    this.dobitak = {};
    for (const ig of this.igraci.values()) {
      const o = this.odgovori.get(ig.id);
      if (!o) { ig.niz = 0; this.dobitak[ig.id] = { poeni: 0, tacno: false, bez: true }; continue; }
      ig.odgovorenih++;
      // „spoji pojmove“: poeni srazmerno broju tačnih parova, a tačno je tek kad su svi parovi dobri
      const pogodjeno = p.vrsta === 'spoji' ? (Array.isArray(o.izbor) ? o.izbor.filter((x, i) => x === p.tacanP[i]).length : 0) : null;
      const udeo = p.vrsta === 'spoji' ? pogodjeno / p.tacanP.length : o.izbor === p.tacanP ? 1 : 0;
      const tacno = udeo === 1;
      let poeni = 0, bonus = 0;
      if (udeo > 0) {
        const brzina = Math.max(0, 1 - o.ms / this.trajanje);
        // u zadacima je tačnost važnija od brzine
        poeni = this.zadaci
          ? Math.round(((700 + 300 * brzina) * mnozilac * udeo) / 10) * 10
          : Math.round(((500 + 500 * brzina) * mnozilac * udeo) / 10) * 10;
      }
      if (tacno) {
        ig.niz++;
        ig.tacnih++;
        bonus = ig.niz >= 3 ? Math.min(300, (ig.niz - 2) * 100) : 0;
      } else ig.niz = 0;
      ig.poeni += poeni + bonus;
      this.dobitak[ig.id] = { poeni, bonus, tacno, niz: ig.niz, izbor: o.izbor, ms: o.ms, ...(pogodjeno !== null && { pogodjeno, od: p.tacanP.length }) };
    }
    // koliko je igrača pogodilo – pojmove iz težih pitanja češće vraćamo u krugu reči
    const odgovorilo = Object.values(this.dobitak).filter((d) => !d.bez);
    p.udeoTacnih = odgovorilo.length ? odgovorilo.filter((d) => d.tacno).length / odgovorilo.length : 0;
    this.faza = 'otkrivanje';
    this.promena();
  }

  // ───────── krug reči ─────────
  postaviReci() {
    this.brojacReci++;
    const kljuc = this.izaberiPojam();
    const slova = kljuc ? recnik.slovaSaRecju(kljuc.rec, 12) : recnik.novaSlova(12);
    this.reci = {
      slova,
      kljuc,
      nasli: new Set(), // ko je složio pojam iz kviza
      najbolje: recnik.najduze(slova, 6),
      pokusaji: new Map(), // id -> [{rec, ok, poruka}]
      najbolja: new Map(), // id -> rec
      gotovi: new Set(),
    };
    this.faza = 'reci';
    this.pocetak = Date.now();
    this.trajanje = this.podesavanja.vremeReci * 1000;
    this.zakaziAuto(this.trajanje + 500, () => this.otkrijReci());
    this.promena();
  }

  // pojam iz odigranih pitanja koji će se kriti u slovima (idealno 5–8 slova, prednost pitanjima koja su
  // igrači promašili); svaki pojam samo jednom po igri
  izaberiPojam() {
    this.iskorisceniPojmovi ||= new Set();
    const kandidati = [];
    for (const p of this.pitanja) {
      const rec = recnik.kljucnaRec(p);
      if (!rec || this.iskorisceniPojmovi.has(rec)) continue;
      const n = [...rec].length;
      if (n < 3 || n > 11) continue;
      let tezina = n >= 5 && n <= 8 ? 4 : n === 4 || n === 9 ? 1.5 : 0.5;
      if (p.udeoTacnih !== undefined) tezina *= 1 + (1 - p.udeoTacnih);
      kandidati.push({ rec, p, tezina });
    }
    if (!kandidati.length) return null;
    let x = Math.random() * kandidati.reduce((a, k) => a + k.tezina, 0);
    const k = kandidati.find((k) => (x -= k.tezina) <= 0) || kandidati[kandidati.length - 1];
    this.iskorisceniPojmovi.add(k.rec);
    const odgovor = k.p.vrsta === 'spoji' ? k.p.parovi.map((x) => x.join(' – ')).join(', ') : k.p.odgovori[k.p.tacan ?? 0];
    return { rec: k.rec, pitanje: k.p.pitanje, odgovor };
  }

  posaljiRec(id, indeksi) {
    if (this.faza !== 'reci' || !this.igraci.has(id) || !Array.isArray(indeksi)) return null;
    const S = this.reci.slova;
    if (indeksi.length > S.length || indeksi.some((i) => !(Number.isInteger(i) && i >= 0 && i < S.length))) return null;
    if (new Set(indeksi).size !== indeksi.length) return null;
    const rec = indeksi.map((i) => S[i]).join('');
    const lista = this.reci.pokusaji.get(id) || [];
    let ok = false, poruka;
    if (rec.length < 2) poruka = 'Prekratko';
    else if (lista.some((x) => x.rec === rec)) poruka = 'Već poslato';
    else if (this.reci.kljuc && rec === this.reci.kljuc.rec) {
      ok = true; poruka = `Pojam iz kviza! ${[...rec].length} slova ✓`;
      this.reci.nasli.add(id);
    } else if (recnik.postoji(rec)) { ok = true; poruka = `${[...rec].length} slova ✓`; }
    else poruka = 'Nema u rečniku';
    if (poruka !== 'Već poslato') lista.unshift({ rec, ok, poruka });
    this.reci.pokusaji.set(id, lista.slice(0, 8));
    if (ok) {
      const pre = this.reci.najbolja.get(id);
      if (!pre || [...rec].length > [...pre].length) this.reci.najbolja.set(id, rec);
    }
    this.promena();
    return { ok, poruka };
  }

  gotovSaRecima(id) {
    if (this.faza !== 'reci' || !this.igraci.has(id) || this.reci.gotovi.has(id)) return;
    this.reci.gotovi.add(id);
    this.proveriKrajOdgovora();
    this.promena();
  }

  otkrijReci() {
    if (this.faza !== 'reci') return;
    clearTimeout(this.tajmer);
    const R = this.reci;
    const duz = (r) => (r ? [...r].length : 0);
    const maxIgraca = Math.max(0, ...[...R.najbolja.values()].map(duz));
    this.dobitak = {};
    for (const ig of this.igraci.values()) {
      const rec = R.najbolja.get(ig.id);
      const n = duz(rec);
      let poeni = n * 100, bonus = 0, oznaka = '';
      if (n && n === maxIgraca && this.igraci.size > 1) { bonus += 300; oznaka = 'Najduža!'; }
      if (n && n >= R.najbolje.duzina) { bonus += 500; oznaka = 'Savršeno!'; }
      if (R.nasli.has(ig.id)) { bonus += 200; oznaka = oznaka ? oznaka + ' · Pojam iz kviza!' : 'Pojam iz kviza!'; }
      ig.poeni += poeni + bonus;
      if (n > duz(ig.najduzaRec)) ig.najduzaRec = rec;
      this.dobitak[ig.id] = { rec: rec || '', poeni, bonus, oznaka };
    }
    this.faza = 'reci-otkrivanje';
    this.promena();
  }

  // ───────── tabele i kraj ─────────
  rang() {
    return [...this.igraci.values()]
      .sort((a, b) => b.poeni - a.poeni || a.ime.localeCompare(b.ime))
      .map((x) => ({ id: x.id, poeni: x.poeni }));
  }

  tabela() {
    this.faza = 'tabela';
    this.tabelaPodaci = { pre: this.prethodniRang, sada: this.rang(), poslednja: this.krug === this.krugovi.length - 1 };
    this.prethodniRang = this.tabelaPodaci.sada;
    this.promena();
  }

  kraj() {
    this.faza = 'kraj';
    clearTimeout(this.tajmer);
    const rang = this.rang();
    try {
      statistika.zabeleziIgru({
        kviz: this.podesavanja.kviz,
        igraci: rang.map((r) => {
          const ig = this.igraci.get(r.id);
          return { ime: ig.ime, avatar: ig.avatar, poeni: ig.poeni, tacnih: ig.tacnih, odgovorenih: ig.odgovorenih, najduzaRec: ig.najduzaRec };
        }),
      });
    } catch (e) { console.error('statistika:', e.message); }
    this.zabelezi('igra-zavrsena', Date.now() - this.igraPocela);
    this.promena();
  }

  uLobi() {
    clearTimeout(this.tajmer);
    // vođa vratio sve u lobi usred partije, ili su svi otišli
    if (this.faza !== 'lobi' && this.faza !== 'kraj') this.zabelezi('igra-prekinuta', Date.now() - this.igraPocela);
    this.faza = 'lobi';
    this.reci = null;
    this.promena();
  }

  // ───────── pogled za jednog klijenta ─────────
  pogled(zaId) {
    const s = this;
    const igraci = [...s.igraci.values()].map((x) => ({
      id: x.id, ime: x.ime, avatar: x.avatar, boja: x.boja, poeni: x.poeni, niz: x.niz,
      povezan: s.aktivan(x), najduzaRec: x.najduzaRec,
    }));
    const v = {
      kod: s.kod, verzija: s.verzija, klijent: Soba.verzijaKlijenta ? Soba.verzijaKlijenta() : '', faza: s.faza, domacin: s.domacin, ja: zaId, igraci,
      podesavanja: s.podesavanja,
      zadaci: s.faza === 'lobi' ? kvizovi.jeZadaci(s.podesavanja.kviz) : !!s.zadaci,
      sada: Date.now(), rokDo: s.rokDo,
      krug: s.krug, krugovi: s.krugovi,
    };
    if (s.faza === 'uvod') v.uvod = { ...s.uvod, brojPitanja: s.pitanja.length, brojReci: s.podesavanja.brojReci };
    if (s.faza === 'pitanje' || s.faza === 'otkrivanje') {
      const p = s.pitanja[s.i];
      const pk = kvizovi.paket(p.paket);
      v.pitanje = {
        rb: s.i + 1, ukupno: s.pitanja.length, tekst: p.pitanje, vrsta: p.vrsta || 'izbor', mediji: p.mediji || null,
        ...(p.vrsta === 'spoji' ? { levo: p.levo, desno: p.desno } : { odgovori: p.odgovoriP }),
        tezina: p.tezina, paket: p.paket, jezik: pk?.jezik || null, zadatak: !!pk?.zadaci, oblast: pk ? { naziv: pk.naziv, ikona: pk.ikona, boja: pk.boja } : null,
        pocetak: s.pocetak, trajanje: s.trajanje,
      };
      v.odgovorili = [...s.odgovori.keys()];
      v.mojOdgovor = s.odgovori.get(zaId)?.izbor ?? null;
      if (s.faza === 'otkrivanje') {
        v.pitanje.tacan = p.tacanP;
        v.pitanje.zanimljivost = p.zanimljivost || '';
        v.pitanje.objasnjenje = p.objasnjenje || '';
        if (p.resenje) v.pitanje.resenje = p.resenje;
        // slika (ili drugi medij) uz „Da li si znao?“ – stiže tek posle odgovora, jer bi u pitanju otkrila rešenje
        if (p.medijiOdgovora) v.pitanje.medijiOdgovora = p.medijiOdgovora;
        v.dobitak = s.dobitak;
        if (p.vrsta === 'spoji') {
          // za svaki pojam levo: koliko igrača ga je tačno spojilo
          v.raspodela = p.tacanP.map((t, i) => [...s.odgovori.values()].filter((o) => o.izbor[i] === t).length);
        } else {
          v.raspodela = [0, 0, 0, 0];
          for (const o of s.odgovori.values()) v.raspodela[o.izbor]++;
        }
        v.izbori = Object.fromEntries([...s.odgovori.entries()].map(([k, o]) => [k, o.izbor]));
      }
    }
    if (s.faza === 'reci' || s.faza === 'reci-otkrivanje') {
      v.reci = {
        rb: s.brojacReci, ukupno: s.podesavanja.brojReci,
        slova: s.reci.slova, pocetak: s.pocetak, trajanje: s.trajanje,
        moji: s.reci.pokusaji.get(zaId) || [],
        mojaNajbolja: s.reci.najbolja.get(zaId) || '',
        gotovi: [...s.reci.gotovi],
        predali: [...s.reci.najbolja.keys()],
        imaPojam: !!s.reci.kljuc,
      };
      if (s.faza === 'reci-otkrivanje') {
        v.reci.najbolje = s.reci.najbolje;
        v.reci.kljuc = s.reci.kljuc;
        v.reci.nasli = [...s.reci.nasli];
        v.dobitak = s.dobitak;
      }
    }
    if (s.faza === 'tabela') v.tabela = s.tabelaPodaci;
    if (s.faza === 'kraj') v.konacno = s.rang();
    return v;
  }
}

module.exports = Soba;
