// Logika jedne sobe (igre).
const kvizovi = require('./kvizovi');
const recnik = require('./recnik');
const bonus = require('./bonus');
const Raptori = require('../public/raptori.js');
const Hemija = require('../public/hemija.js');
const VREME_RAPTORA = 30000; // ms za izbor pravca u igri „Beži od raptora!“
const Trojka = require('../public/trojka.js');
const VREME_TROJKE = 45000; // ms za nišanjenje u igri „Trojka!“
const Karta = require('../public/karta.js');
const VREME_KARTE = 45000; // ms za traženje grada u igri „Pronađi grad na karti“

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
      vremeReci: 60,
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
    // bonus krug: 'reci' (Najduža reč) ili vrsta igre „Na slovo…“ ('geografija', 'nauka', 'istorija', 'sport')
    this.bonus = 'reci';
    this.slovo = null; // stanje runde „Na slovo…“
    this.bilaSlova = []; // slova već odigrana u ovoj partiji
    this.raptori = null; // stanje runde „Beži od raptora!“
    this.trojka = null; // stanje runde „Trojka!“
    this.hemija = null; // stanje runde „Elementi – cena i opasnost“
    this.karta = null; // stanje runde „Pronađi grad na karti“
    this.bonusi = []; // uz svaki krug: null (pitanja) ili { vrsta, runde } – bonus runde su podeljene na krugove različitih igara
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
  // Vođa može da ne učestvuje (ig.gleda – „samo prikazujem“, npr. nastavnik na velikom ekranu): ostaje u sobi i vodi
  // igru, ali ne odgovara, nema poene i ne vidi se među igračima. takmicari() = svi koji igraju.
  takmicari() {
    return [...this.igraci.values()].filter((x) => !x.gleda);
  }

  igra(id) {
    const ig = this.igraci.get(id);
    return !!ig && !ig.gleda;
  }

  // samo u lobiju (pre početka partije)
  postaviGledanje(id, gleda) {
    const ig = this.igraci.get(id);
    if (!ig || this.faza !== 'lobi') return;
    if (gleda) ig.gleda = true; else delete ig.gleda;
    this.promena();
  }

  dodajIgraca(id, ime, avatar) {
    ime = String(ime || '').trim().slice(0, 16) || 'Igrač';
    let ig = this.igraci.get(id);
    if (!ig) {
      if (this.takmicari().length >= MAKS_IGRACA) return null; // soba je puna
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
    if (Number.isInteger(+p.brojPitanja) && +p.brojPitanja >= 1 && +p.brojPitanja <= 25) s.brojPitanja = +p.brojPitanja;
    if ([10, 15, 20, 30, 45, 60].includes(+p.vreme)) s.vreme = +p.vreme;
    if (['oba', 'pitanja', 'reci'].includes(p.krugovi)) s.krugovi = p.krugovi;
    if ([0, 1, 2, 3, 5, 10, 15].includes(+p.brojReci)) s.brojReci = +p.brojReci;
    if (s.krugovi === 'reci' && s.brojReci < 1) s.brojReci = 1;
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
    this.bonusi = [];
    this.pitanja = [];
    this.iskorisceniPojmovi = new Set();
    // zadaci: manje pitanja, više vremena; bonus krugovi kao u predmetu (matematika/fizika – zadaci → raptori…)
    this.zadaci = kvizovi.jeZadaci(s.kviz);
    if (s.krugovi !== 'reci') {
      this.pitanja = kvizovi.izaberi(s.kviz, this.zadaci ? s.brojZadataka : s.brojPitanja).map((p) => this.pripremi(p));
      if (this.pitanja.length) this.krugovi.push('pitanja');
    }
    if (s.krugovi !== 'pitanja') {
      for (const b of this.planBonusa(s.brojReci)) {
        this.bonusi[this.krugovi.length] = b;
        this.krugovi.push(['reci', 'raptori', 'trojka', 'hemija', 'karta'].includes(b.vrsta) ? b.vrsta : 'slovo');
      }
    }
    this.bilaSlova = [];
    // bez ijednog kruga (npr. kviz je u međuvremenu obrisan) igra bi se odmah završila
    if (!this.krugovi.length) return false;
    this.krug = -1;
    this.prethodniRang = this.rang();
    this.igraPocela = Date.now();
    this.zabelezi('igra-pocela');
    this.sledeciKrug();
    return true;
  }

  // bonus igre po predmetu (geografija → zanimljiva geografija, fizika/matematika → naučnici…), u „Opštem znanju“
  // nasumično: najduža reč ili jedna od igara „Na slovo…“. Više bonus rundi se deli na krugove RAZLIČITIH igara
  // (svaki sa svojim uvodom): predmet sa igrom „Na slovo…“ → prvo ta igra, pa najduža reč; „Opšte znanje“ →
  // do 5 različitih igara nasumičnim redom. Runde se dele što ravnomernije (5 rundi, 2 igre → 3 + 2).
  planBonusa(n) {
    if (!n) return []; // 0 bonus rundi – igraju se samo pitanja
    const v = kvizovi.bonusVrsta(this.podesavanja.kviz);
    let vrste;
    if (v === 'nasumicno') vrste = kvizovi.promesaj(['reci', ...bonus.spisakVrsta()]);
    else vrste = kvizovi.bonusVrste(this.podesavanja.kviz).map(kvizovi.resiBonusIgru).filter((x) => ['reci', 'raptori', 'trojka', 'hemija', 'karta'].includes(x) || bonus.postoji(x));
    vrste = vrste.slice(0, Math.max(1, n));
    return vrste.map((vrsta, i) => ({ vrsta, runde: Math.floor(n / vrste.length) + (i < n % vrste.length ? 1 : 0) }));
  }

  // broj rundi tekućeg bonus kruga (sobe sačuvane pre podele na krugove nemaju this.bonusi)
  brojRundi() {
    return this.bonusi[this.krug]?.runde || this.podesavanja.brojReci;
  }

  // promešaj odgovore (u JSON-u je prvi odgovor uvek tačan)
  pripremi(p) {
    if (p.vrsta === 'spoji') {
      // levo i desno se mešaju nezavisno; tacanP[i] = indeks tačnog para (desno) za i-ti pojam levo
      const levi = kvizovi.promesaj(p.parovi.map((_, i) => i));
      let desni = kvizovi.promesaj(p.parovi.map((_, i) => i));
      // desna kolona mora biti izmeštena u odnosu na levu – inače se parovi spajaju 1-1 po položaju
      while (desni.some((x, i) => x === levi[i])) desni = kvizovi.promesaj(desni);
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
    if (this.bonusi[this.krug]) this.bonus = this.bonusi[this.krug].vrsta;
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
    if (['uvod', 'otkrivanje', 'reci-otkrivanje', 'slovo-otkrivanje', 'raptori-otkrivanje', 'trojka-otkrivanje', 'hemija-otkrivanje', 'karta-otkrivanje'].includes(this.faza)) {
      if (vrsta === 'pitanja') {
        if (this.i + 1 < this.pitanja.length) return this.postaviPitanje(this.i + 1);
      } else if (this.brojacReci < this.brojRundi()) return vrsta === 'slovo' ? this.postaviSlovo() : vrsta === 'raptori' ? this.postaviRaptore() : vrsta === 'trojka' ? this.postaviTrojku() : vrsta === 'hemija' ? this.postaviHemiju() : vrsta === 'karta' ? this.postaviKartu() : this.postaviReci();
      return this.tabela();
    }
    if (this.faza === 'tabela') return this.sledeciKrug();
    if (this.faza === 'pitanje') return this.otkrij();
    if (this.faza === 'reci') return this.otkrijReci();
    if (this.faza === 'slovo') return this.otkrijSlovo();
    if (this.faza === 'raptori') return this.otkrijRaptore();
    if (this.faza === 'trojka') return this.otkrijTrojku();
    if (this.faza === 'hemija') return this.otkrijHemiju();
    if (this.faza === 'karta') return this.otkrijKartu();
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
    if (this.faza !== 'pitanje' || !this.igra(id) || this.odgovori.has(id)) return;
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
      const aktivni = this.takmicari().filter((x) => this.odgovori.has(x.id) || (this.aktivan(x) && x.usaoU <= this.pocetak));
      if (aktivni.length && aktivni.every((x) => this.odgovori.has(x.id))) {
        clearTimeout(this.tajmer);
        this.tajmer = setTimeout(() => this.otkrij(), 900);
      }
    }
    if (this.faza === 'raptori') {
      const aktivni = this.takmicari().filter((x) => this.raptori.izbori.has(x.id) || this.aktivan(x));
      if (aktivni.length && aktivni.every((x) => this.raptori.izbori.has(x.id))) {
        clearTimeout(this.tajmer);
        this.tajmer = setTimeout(() => this.zavrsiRaptore(), 300);
      }
    }
    if (this.faza === 'trojka') {
      const aktivni = this.takmicari().filter((x) => this.trojka.sutevi.has(x.id) || this.aktivan(x));
      if (aktivni.length && aktivni.every((x) => this.trojka.sutevi.has(x.id))) {
        clearTimeout(this.tajmer);
        this.tajmer = setTimeout(() => this.zavrsiTrojku(), 300);
      }
    }
    if (this.faza === 'hemija') {
      const aktivni = this.takmicari().filter((x) => this.hemija.izbori.has(x.id) || this.aktivan(x));
      if (aktivni.length && aktivni.every((x) => this.hemija.izbori.has(x.id))) {
        clearTimeout(this.tajmer);
        this.tajmer = setTimeout(() => this.otkrijHemiju(), 300);
      }
    }
    if (this.faza === 'karta') {
      const aktivni = this.takmicari().filter((x) => this.karta.izbori.has(x.id) || this.aktivan(x));
      if (aktivni.length && aktivni.every((x) => this.karta.izbori.has(x.id))) {
        clearTimeout(this.tajmer);
        this.tajmer = setTimeout(() => this.otkrijKartu(), 300);
      }
    }
    const runda = this.faza === 'reci' ? this.reci : this.faza === 'slovo' ? this.slovo : null;
    if (runda) {
      const aktivni = this.takmicari().filter((x) => this.aktivan(x));
      if (aktivni.length && aktivni.every((x) => runda.gotovi.has(x.id))) {
        clearTimeout(this.tajmer);
        this.tajmer = setTimeout(() => (this.faza === 'slovo' ? this.otkrijSlovo() : this.otkrijReci()), 600);
      }
    }
  }

  otkrij() {
    if (this.faza !== 'pitanje') return;
    clearTimeout(this.tajmer);
    const p = this.pitanja[this.i];
    const mnozilac = p.tezina === 3 ? 1.5 : 1;
    this.dobitak = {};
    for (const ig of this.takmicari()) {
      const o = this.odgovori.get(ig.id);
      if (!o) { ig.niz = 0; this.dobitak[ig.id] = { poeni: 0, tacno: false, bez: true }; continue; }
      ig.odgovorenih++;
      // „spoj pojmove“: poeni srazmerno broju tačnih parova, a tačno je tek kad su svi parovi dobri
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
    const kljuc = this.zadaci ? null : this.izaberiPojam(); // zadaci nemaju ključni pojam (`rec`)
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
    // pojam je često promenjen oblik (богиње, везана); igra traži osnovni oblik, pa i on (богиња, везан) važi kao pojam
    const oblici = recnik.postoji(k.rec) ? [] : recnik.osnoveOblika(k.rec).filter((o) => o !== k.rec && recnik.postoji(o));
    return { rec: k.rec, oblici, pitanje: k.p.pitanje, odgovor };
  }

  // da li je složena reč pojam iz kviza: sam pojam ili njegov osnovni oblik (lj/nj/dž su uvek jedno slovo –
  // „билјка“ nije „биљка“)
  jePojam(rec) {
    const K = this.reci.kljuc;
    if (!K) return null;
    return K.rec === rec || K.oblici?.includes(rec) ? rec : null;
  }

  posaljiRec(id, indeksi) {
    if (this.faza !== 'reci' || !this.igra(id) || !Array.isArray(indeksi)) return null;
    const S = this.reci.slova;
    if (indeksi.length > S.length || indeksi.some((i) => !(Number.isInteger(i) && i >= 0 && i < S.length))) return null;
    if (new Set(indeksi).size !== indeksi.length) return null;
    let rec = indeksi.map((i) => S[i]).join('');
    const pojam = rec.length >= 2 && this.jePojam(rec);
    if (pojam) rec = pojam;
    const lista = this.reci.pokusaji.get(id) || [];
    let ok = false, poruka;
    if (rec.length < 2) poruka = 'Prekratko';
    else if (lista.some((x) => x.rec === rec)) poruka = 'Već poslato';
    else if (pojam) {
      ok = true; poruka = `Pojam iz kviza! ${[...rec].length} slova ✓`;
      this.reci.nasli.add(id);
    } else if (recnik.postoji(rec)) { ok = true; poruka = `${[...rec].length} slova ✓`; }
    else {
      // promenjen oblik (кућама, радим) – kažemo koja je osnovna reč
      const osnova = recnik.osnovniOblik(rec);
      poruka = osnova ? `Oblik reči „${recnik.uLatinicu(osnova)}“` : 'Nema u rečniku';
    }
    if (poruka !== 'Već poslato') lista.unshift({ rec, ok, poruka });
    this.reci.pokusaji.set(id, lista.slice(0, 8));
    if (ok) {
      // najbolja = ona koja donosi najviše poena: duža, a pri istoj dužini pojam iz kviza
      const pre = this.reci.najbolja.get(id);
      const n = [...rec].length, m = pre ? [...pre].length : 0;
      if (!pre || n > m || (n === m && pojam)) this.reci.najbolja.set(id, rec);
    }
    this.promena();
    return { ok, poruka };
  }

  gotovSaRecima(id) {
    const runda = this.faza === 'reci' ? this.reci : this.faza === 'slovo' ? this.slovo : null;
    if (!runda || !this.igra(id) || runda.gotovi.has(id)) return;
    runda.gotovi.add(id);
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
    for (const ig of this.takmicari()) {
      const rec = R.najbolja.get(ig.id);
      const n = duz(rec);
      let poeni = n * 100, bonus = 0, oznaka = '';
      if (n && n === maxIgraca && this.takmicari().length > 1) { bonus += 300; oznaka = 'Najduža!'; }
      if (n && n >= R.najbolje.duzina) { bonus += 500; oznaka = 'Savršeno!'; }
      if (R.nasli.has(ig.id)) { bonus += 200; oznaka = oznaka ? oznaka + ' · Pojam iz kviza!' : 'Pojam iz kviza!'; }
      ig.poeni += poeni + bonus;
      if (n > duz(ig.najduzaRec)) ig.najduzaRec = rec;
      this.dobitak[ig.id] = { rec: rec || '', poeni, bonus, oznaka };
    }
    this.faza = 'reci-otkrivanje';
    this.promena();
  }

  // ───────── bonus „Na slovo…“ (zanimljiva geografija, naučnici, istorijske ličnosti, sportisti) ─────────
  postaviSlovo() {
    this.brojacReci++;
    const sl = bonus.izaberiSlovo(this.bonus, this.bilaSlova);
    this.bilaSlova.push(sl);
    this.slovo = {
      vrsta: this.bonus,
      slovo: sl,
      unosi: new Map(), // id -> [{ kat, q }] priznati pojmovi
      pokusaji: new Map(), // id -> [{ unos, ok, poruka }] poslednji pokušaji
      gotovi: new Set(),
      rezultat: null,
    };
    this.faza = 'slovo';
    this.pocetak = Date.now();
    this.trajanje = this.podesavanja.vremeReci * 1000;
    this.zakaziAuto(this.trajanje + 500, () => this.otkrijSlovo());
    this.promena();
  }

  posaljiPojam(id, tekst) {
    if (this.faza !== 'slovo' || !this.igra(id) || typeof tekst !== 'string') return null;
    tekst = tekst.replace(/\s+/g, ' ').trim().slice(0, 60);
    if (!tekst) return null;
    const S = this.slovo;
    const moji = S.unosi.get(id) || [];
    const r = bonus.proveri(S.vrsta, S.slovo, tekst);
    let ok = false, poruka;
    if (r.greska) poruka = r.greska;
    else {
      const novi = r.pogoci.filter((p) => !moji.some((m) => m.kat === p.kat && m.q === p.q));
      if (!novi.length) poruka = 'Već imaš';
      else {
        ok = true;
        moji.push(...novi);
        S.unosi.set(id, moji);
        const kat = bonus.opis(S.vrsta).kategorije;
        poruka = novi.map((p) => `${kat.find((k) => k.id === p.kat)?.naziv}: ${bonus.uLatinicu(bonus.stavka(S.vrsta, p.kat, p.q)?.ime || '')}${p.kao ? ` (${bonus.uLatinicu(p.kao)})` : ''}`).join(' · ')
          + (r.ispravljeno ? ' (uz sitnu grešku)' : '');
        // slika ličnosti se preuzima odmah, da bude spremna za kraj runde
        for (const p of novi) if (bonus.prikaz(S.vrsta, p.kat, p.q)?.slika) Soba.pripremiSliku?.(p.q);
      }
    }
    const lista = S.pokusaji.get(id) || [];
    lista.unshift({ unos: tekst, ok, poruka });
    S.pokusaji.set(id, lista.slice(0, 5));
    this.promena();
    return { ok, poruka };
  }

  otkrijSlovo() {
    if (this.faza !== 'slovo') return;
    clearTimeout(this.tajmer);
    const S = this.slovo;
    const ko = new Map(); // 'kat|q' -> [id igrača]
    for (const [id, l] of S.unosi) {
      if (!this.igra(id)) continue;
      for (const m of l) {
        const k = m.kat + '|' + m.q;
        if (!ko.has(k)) ko.set(k, []);
        ko.get(k).push(id);
      }
    }
    const takmicari = this.takmicari();
    const vise = takmicari.length > 1;
    const broj = (id) => (S.unosi.get(id) || []).length;
    const max = Math.max(0, ...takmicari.map((x) => broj(x.id)));
    this.dobitak = {};
    for (const ig of takmicari) {
      const l = S.unosi.get(ig.id) || [];
      // +50 za pojam koga se niko drugi nije setio, +300 za najviše pojmova
      const jedini = vise ? l.filter((m) => ko.get(m.kat + '|' + m.q)?.length === 1).length : 0;
      const poeni = l.length * 100;
      let dodatak = jedini * 50, oznaka = jedini ? `${jedini}× samo ti` : '';
      if (vise && l.length && l.length === max) { dodatak += 300; oznaka = oznaka ? 'Najviše! · ' + oznaka : 'Najviše!'; }
      ig.poeni += poeni + dodatak;
      this.dobitak[ig.id] = { broj: l.length, jedini, poeni, bonus: dodatak, oznaka };
    }
    // za prikaz: po kategoriji – navedeni pojmovi (ko ih je naveo) i najpoznatiji koje niko nije naveo
    const opis = bonus.opis(S.vrsta);
    S.rezultat = (opis?.kategorije || []).map((k) => {
      const navedeni = [...ko.entries()].filter(([kl]) => kl.startsWith(k.id + '|'))
        .map(([kl, ids]) => ({ ...bonus.prikaz(S.vrsta, k.id, kl.slice(k.id.length + 1)), ko: ids }))
        .sort((a, b) => b.ko.length - a.ko.length || (bonus.stavka(S.vrsta, k.id, b.q)?.sl || 0) - (bonus.stavka(S.vrsta, k.id, a.q)?.sl || 0));
      const predlozi = bonus.predlozi(S.vrsta, k.id, S.slovo, new Set(navedeni.map((n) => n.q)), k.licnosti ? 3 : 5);
      for (const q of predlozi) if (k.licnosti) Soba.pripremiSliku?.(q);
      return { id: k.id, navedeni, predlozi: predlozi.map((q) => bonus.prikaz(S.vrsta, k.id, q)) };
    });
    this.faza = 'slovo-otkrivanje';
    this.promena();
  }

  // ───────── bonus „Beži od raptora!“ (public/raptori.js – ista simulacija na serveru i telefonu) ─────────
  postaviRaptore() {
    this.brojacReci++;
    this.raptori = { sc: Raptori.napravi(), izbori: new Map() }; // izbori: id -> { ugao, jacina, t, at }
    this.faza = 'raptori';
    this.pocetak = Date.now();
    this.trajanje = VREME_RAPTORA;
    this.zakaziAuto(this.trajanje + 500, () => this.zavrsiRaptore());
    this.promena();
  }

  posaljiBeg(id, ugao, jacina) {
    if (this.faza !== 'raptori' || !this.igra(id) || this.raptori.izbori.has(id)) return null;
    ugao = +ugao; jacina = +jacina;
    if (!Number.isFinite(ugao) || !Number.isFinite(jacina) || jacina <= 0 || jacina > 1) return null;
    const t = Raptori.simuliraj(this.raptori.sc, ugao, jacina).t;
    this.raptori.izbori.set(id, { ugao, jacina, t, at: Date.now() });
    this.proveriKrajOdgovora();
    this.promena();
    return { ok: true, t };
  }

  // otkrivanje tek kad se svima završi njihova animacija (traje koliko su izdržali)
  zavrsiRaptore() {
    if (this.faza !== 'raptori') return;
    const kraj = Math.max(0, ...[...this.raptori.izbori.values()].map((o) => o.at + o.t * 1000 + 1200));
    if (kraj > Date.now() + 50) return this.zakaziAuto(kraj - Date.now(), () => this.zavrsiRaptore());
    this.otkrijRaptore();
  }

  otkrijRaptore() {
    if (this.faza !== 'raptori') return;
    clearTimeout(this.tajmer);
    const R = this.raptori;
    const takmicari = this.takmicari();
    const max = Math.max(0, ...takmicari.map((x) => R.izbori.get(x.id)?.t || 0));
    const naj = R.sc.najbolje.t;
    this.dobitak = {};
    for (const ig of takmicari) {
      const o = R.izbori.get(ig.id);
      if (!o) { this.dobitak[ig.id] = { t: 0, poeni: 0, bonus: 0, oznaka: '', bez: true }; continue; }
      // 100 poena po sekundi, +300 za najduže preživljavanje, +200 za (skoro) najbolji mogući beg
      const poeni = Math.round(o.t * 10) * 10;
      let bonus = 0;
      const oznake = [];
      if (takmicari.length > 1 && o.t === max) { bonus += 300; oznake.push('Najduže!'); }
      if (o.t >= naj * 0.97) { bonus += 200; oznake.push('Savršen beg!'); }
      ig.poeni += poeni + bonus;
      this.dobitak[ig.id] = { t: o.t, poeni, bonus, oznaka: oznake.join(' · ') };
    }
    this.faza = 'raptori-otkrivanje';
    this.promena();
  }

  // ───────── bonus „Trojka!“ (public/trojka.js – ista simulacija na serveru i telefonu) ─────────
  postaviTrojku() {
    this.brojacReci++;
    this.trojka = { sc: Trojka.napravi(), sutevi: new Map() }; // sutevi: id -> { sila, ugao, kos, t, at }
    this.faza = 'trojka';
    this.pocetak = Date.now();
    this.trajanje = VREME_TROJKE;
    this.zakaziAuto(this.trajanje + 500, () => this.zavrsiTrojku());
    this.promena();
  }

  posaljiSut(id, sila, ugao) {
    if (this.faza !== 'trojka' || !this.igra(id) || this.trojka.sutevi.has(id)) return null;
    sila = +sila; ugao = +ugao;
    if (!Number.isFinite(sila) || !Number.isFinite(ugao) || sila <= 0 || sila > Trojka.F_MAX || ugao < Trojka.UGAO_MIN || ugao > Trojka.UGAO_MAX) return null;
    [sila, ugao] = Trojka.sredi(sila, ugao);
    const s = Trojka.simuliraj(this.trojka.sc, sila, ugao);
    this.trojka.sutevi.set(id, { sila, ugao, kos: s.kos, t: s.t, at: Date.now() });
    this.proveriKrajOdgovora();
    this.promena();
    return { ok: true, kos: s.kos };
  }

  // otkrivanje tek kad se svima završi let lopte
  zavrsiTrojku() {
    if (this.faza !== 'trojka') return;
    const kraj = Math.max(0, ...[...this.trojka.sutevi.values()].map((o) => o.at + o.t * 1000 + 1200));
    if (kraj > Date.now() + 50) return this.zakaziAuto(kraj - Date.now(), () => this.zavrsiTrojku());
    this.otkrijTrojku();
  }

  otkrijTrojku() {
    if (this.faza !== 'trojka') return;
    clearTimeout(this.tajmer);
    const S = this.trojka;
    this.dobitak = {};
    for (const ig of this.takmicari()) {
      const o = S.sutevi.get(ig.id);
      if (!o) { this.dobitak[ig.id] = { kos: false, poeni: 0, bonus: 0, oznaka: '', bez: true }; continue; }
      const b = Trojka.bodovi(S.sc, o.sila, o.ugao);
      ig.poeni += b.poeni + b.bonus;
      this.dobitak[ig.id] = { kos: b.kos, cisto: b.cisto, blizu: b.blizu, poeni: b.poeni, bonus: b.bonus, oznaka: b.oznaka };
    }
    this.faza = 'trojka-otkrivanje';
    this.promena();
  }

  // ───────── bonus „Elementi – cena i opasnost“ (public/hemija.js – iste cene i aktivnosti na serveru i telefonu) ─────────
  postaviHemiju() {
    this.brojacReci++;
    this.hemija = {
      vrednost: Hemija.napraviVrednost(),
      radio: Hemija.napraviRadioaktivnost(),
      izbori: new Map(), // id -> { vrednost: [simboli], radio: [simboli], at }
    };
    this.faza = 'hemija';
    this.pocetak = Date.now();
    this.trajanje = this.podesavanja.vremeReci * 1000;
    this.zakaziAuto(this.trajanje + 500, () => this.otkrijHemiju());
    this.promena();
  }

  posaljiHemiju(id, izbor) {
    if (this.faza !== 'hemija' || !this.igra(id) || this.hemija.izbori.has(id)) return null;
    izbor = izbor || {};
    const v = Array.isArray(izbor.vrednost) ? izbor.vrednost : [];
    const r = Array.isArray(izbor.radio) ? izbor.radio : [];
    if (!Hemija.proveriIzbor(this.hemija.vrednost, v) || !Hemija.proveriIzbor(this.hemija.radio, r)) return null;
    this.hemija.izbori.set(id, { vrednost: v, radio: r, at: Date.now() });
    this.proveriKrajOdgovora();
    this.promena();
    return { ok: true };
  }

  otkrijHemiju() {
    if (this.faza !== 'hemija') return;
    clearTimeout(this.tajmer);
    const H = this.hemija;
    const takmicari = this.takmicari();
    const rez = takmicari.map((ig) => {
      const o = H.izbori.get(ig.id);
      if (!o) return { ig, bez: true, poeni: 0 };
      const uv = Hemija.udeo(H.vrednost, o.vrednost);
      const ur = Hemija.udeo(H.radio, o.radio);
      // svaki zadatak vredi do 500 poena, srazmerno udelu najboljeg izbora (0–1)
      const pv = Math.round((uv * 500) / 10) * 10;
      const pr = Math.round((ur * 500) / 10) * 10;
      return { ig, bez: false, poeni: pv + pr, vrednost: { izbor: o.vrednost, udeo: uv, poeni: pv }, radio: { izbor: o.radio, udeo: ur, poeni: pr } };
    });
    const maxPoeni = Math.max(0, ...rez.map((r) => r.poeni));
    this.dobitak = {};
    for (const r of rez) {
      const ig = r.ig;
      if (r.bez) { this.dobitak[ig.id] = { poeni: 0, bonus: 0, oznaka: '', bez: true }; continue; }
      let bonus = 0;
      const oznake = [];
      if (r.vrednost.udeo >= 1 && r.radio.udeo >= 1) { bonus += 300; oznake.push('Savršeno!'); }
      if (takmicari.length > 1 && r.poeni === maxPoeni) { bonus += 200; oznake.push('Najbolje!'); }
      ig.poeni += r.poeni + bonus;
      this.dobitak[ig.id] = { poeni: r.poeni, bonus, oznaka: oznake.join(' · '), vrednost: r.vrednost, radio: r.radio };
    }
    this.faza = 'hemija-otkrivanje';
    this.promena();
  }

  // ───────── bonus „Pronađi grad na karti“ (public/karta.js – ista karta i bodovi na serveru i telefonu) ─────────
  postaviKartu() {
    this.brojacReci++;
    this.karta = { sc: Karta.napravi(), izbori: new Map() }; // izbori: id -> { lon, lat, d, at }
    this.faza = 'karta';
    this.pocetak = Date.now();
    this.trajanje = VREME_KARTE;
    this.zakaziAuto(this.trajanje + 500, () => this.otkrijKartu());
    this.promena();
  }

  posaljiGrad(id, lon, lat) {
    if (this.faza !== 'karta' || !this.igra(id) || this.karta.izbori.has(id)) return null;
    lon = +lon; lat = +lat;
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    const b = Karta.bodovi(this.karta.sc, lon, lat);
    this.karta.izbori.set(id, { lon, lat, d: b.d, at: Date.now() });
    this.proveriKrajOdgovora();
    this.promena();
    return { ok: true, d: b.d };
  }

  otkrijKartu() {
    if (this.faza !== 'karta') return;
    clearTimeout(this.tajmer);
    const K = this.karta;
    const takmicari = this.takmicari();
    const najblizi = Math.min(...takmicari.map((x) => K.izbori.get(x.id)?.d ?? Infinity));
    this.dobitak = {};
    for (const ig of takmicari) {
      const o = K.izbori.get(ig.id);
      if (!o) { this.dobitak[ig.id] = { d: 0, poeni: 0, bonus: 0, oznaka: '', bez: true }; continue; }
      const b = Karta.bodovi(K.sc, o.lon, o.lat);
      let bonus = b.bonus;
      const oznake = [...b.oznake];
      if (takmicari.length > 1 && o.d === najblizi && najblizi !== Infinity) { bonus += 300; oznake.push('Najbliže!'); }
      ig.poeni += b.poeni + bonus;
      this.dobitak[ig.id] = { d: b.d, poeni: b.poeni, bonus, oznaka: oznake.join(' · ') };
    }
    this.faza = 'karta-otkrivanje';
    this.promena();
  }

  // ───────── tabele i kraj ─────────
  rang() {
    return this.takmicari()
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
    this.zabelezi('igra-zavrsena', Date.now() - this.igraPocela);
    this.promena();
  }

  uLobi() {
    clearTimeout(this.tajmer);
    // vođa vratio sve u lobi usred partije, ili su svi otišli
    if (this.faza !== 'lobi' && this.faza !== 'kraj') this.zabelezi('igra-prekinuta', Date.now() - this.igraPocela);
    this.faza = 'lobi';
    this.reci = null;
    this.slovo = null;
    this.raptori = null;
    this.trojka = null;
    this.hemija = null;
    this.karta = null;
    this.promena();
  }

  // ───────── čuvanje stanja preko restarta (deploy) ─────────
  // Pri gašenju servera (SIGTERM) sve sobe se upisuju u podaci/sobe.json, a novi server ih vraća i igra ide dalje.
  // Čuvaju se sva polja sobe (Map/Set kao nizovi) osim tajmera i povratnog poziva – novo polje se zato čuva samo od sebe.
  // Soba.FORMAT povećati kad se promeni ZNAČENJE postojećih polja (preimenovanje, drugačiji oblik podataka) –
  // tada novi server odbacuje stari zapis (sobe se prekidaju, kao ranije), umesto da radi sa stanjem koje ne razume.
  // Novo polje sa podrazumevanom vrednošću u konstruktoru NE traži novi format (stari zapis ga samo nema).
  uStanje() {
    const { tajmer, onPromena, ...polja } = this;
    return { ...polja, prisutni: [...this.igraci.values()].filter((x) => this.aktivan(x)).map((x) => x.id) };
  }

  // pauza = koliko je server bio ugašen (ms): rokovi i počeci se pomeraju za toliko, da niko ne izgubi sekunde
  static izStanja(o, onPromena, pauza) {
    const s = new Soba(o.kod, onPromena);
    const { prisutni = [], ...polja } = o;
    Object.assign(s, polja);
    const sad = Date.now();
    for (const k of ['rokDo', 'pocetak', 'igraPocela', 'zadnjaAktivnost']) if (s[k]) s[k] += pauza;
    for (const ig of s.igraci.values()) {
      ig.veze = 0; // posle restarta niko još nije povezan; telefoni se vraćaju za 1–2 s
      if (ig.zadnjiPoziv) ig.zadnjiPoziv += pauza;
      if (ig.odsutanOd) ig.odsutanOd += pauza;
      // ko je bio prisutan pre gašenja važi kao prisutan još 35 s (dok se ne poveže) – inače bi vođa izgubio
      // vođstvo, a „svi su odgovorili“ bi se računalo samo za one koji su se već vratili
      if (prisutni.includes(ig.id)) { ig.zadnjiPoziv = sad; ig.odsutanOd = sad; }
    }
    s.nastaviTajmer();
    return s;
  }

  // automatski tajmer faze (posle vraćanja stanja) – sa preostalim vremenom do rokDo
  nastaviTajmer() {
    const fn = { uvod: () => this.dalje(), pitanje: () => this.otkrij(), reci: () => this.otkrijReci(), slovo: () => this.otkrijSlovo(), raptori: () => this.zavrsiRaptore(), trojka: () => this.zavrsiTrojku(), hemija: () => this.otkrijHemiju(), karta: () => this.otkrijKartu() }[this.faza];
    if (!fn) return; // ostale faze čekaju vođino „Dalje“
    this.zakaziAuto(Math.max(0, this.rokDo - Date.now()), fn);
    this.proveriKrajOdgovora(); // ako su svi već odgovorili, otkrivanje kreće odmah
  }

  // ───────── pogled za jednog klijenta ─────────
  pogled(zaId) {
    const s = this;
    const igraci = s.takmicari().map((x) => ({
      id: x.id, ime: x.ime, avatar: x.avatar, boja: x.boja, poeni: x.poeni, niz: x.niz,
      povezan: s.aktivan(x), najduzaRec: x.najduzaRec,
    }));
    const v = {
      kod: s.kod, verzija: s.verzija, klijent: Soba.verzijaKlijenta ? Soba.verzijaKlijenta() : '', faza: s.faza, domacin: s.domacin, ja: zaId, igraci,
      podesavanja: s.podesavanja, gledam: !!s.igraci.get(zaId)?.gleda,
      zadaci: s.faza === 'lobi' ? kvizovi.jeZadaci(s.podesavanja.kviz) : !!s.zadaci,
      sada: Date.now(), rokDo: s.rokDo,
      krug: s.krug, krugovi: s.krugovi,
    };
    if (s.faza === 'lobi') { v.bonus = kvizovi.bonusVrsta(s.podesavanja.kviz); v.bonusi = kvizovi.bonusVrste(s.podesavanja.kviz); }
    if (s.faza === 'uvod') v.uvod = { ...s.uvod, brojPitanja: s.pitanja.length, brojReci: s.brojRundi(), bonus: s.uvod.vrsta === 'slovo' ? bonus.opis(s.bonus) : null };
    if (s.faza === 'pitanje' || s.faza === 'otkrivanje') {
      const p = s.pitanja[s.i];
      const pk = kvizovi.paket(p.paket);
      v.pitanje = {
        rb: s.i + 1, ukupno: s.pitanja.length, tekst: p.pitanje, vrsta: p.vrsta || 'izbor', mediji: p.mediji || null,
        ...(p.vrsta === 'spoji' ? { levo: p.levo, desno: p.desno } : { odgovori: p.odgovoriP }),
        tezina: p.tezina, paket: p.paket, jezik: pk?.jezik || null, kod: pk?.kod || null, zadatak: !!pk?.zadaci, oblast: pk ? { naziv: pk.naziv, ikona: pk.ikona, boja: pk.boja } : null,
        pocetak: s.pocetak, trajanje: s.trajanje,
      };
      v.odgovorili = [...s.odgovori.keys()];
      v.mojOdgovor = s.odgovori.get(zaId)?.izbor ?? null;
      if (s.faza === 'otkrivanje') {
        v.pitanje.tacan = p.tacanP;
        v.pitanje.zanimljivost = p.zanimljivost || '';
        v.pitanje.objasnjenje = p.objasnjenje || '';
        if (p.resenje) v.pitanje.resenje = p.resenje;
        if (p.resenjeCrtez) v.pitanje.resenjeCrtez = p.resenjeCrtez;
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
        rb: s.brojacReci, ukupno: s.brojRundi(),
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
    if ((s.faza === 'slovo' || s.faza === 'slovo-otkrivanje') && s.slovo) {
      const S = s.slovo;
      const ime = (m) => bonus.stavka(S.vrsta, m.kat, m.q)?.ime || '';
      v.slovo = {
        ...bonus.opis(S.vrsta),
        rb: s.brojacReci, ukupno: s.brojRundi(),
        slovo: S.slovo, pocetak: s.pocetak, trajanje: s.trajanje,
        moji: (S.unosi.get(zaId) || []).map((m) => ({ kat: m.kat, ime: ime(m), ...(m.kao && { kao: m.kao }) })),
        pokusaji: S.pokusaji.get(zaId) || [],
        gotovi: [...S.gotovi],
        brojevi: Object.fromEntries([...S.unosi].map(([id, l]) => [id, l.length])),
      };
      if (s.faza === 'slovo-otkrivanje') {
        v.slovo.rezultat = S.rezultat;
        v.dobitak = s.dobitak;
      }
    }
    if ((s.faza === 'raptori' || s.faza === 'raptori-otkrivanje') && s.raptori) {
      const R = s.raptori;
      const bez = ({ at, ...o }) => o;
      const { najbolje, ...sc } = R.sc;
      v.raptori = {
        rb: s.brojacReci, ukupno: s.brojRundi(), pocetak: s.pocetak, trajanje: s.trajanje,
        sc, moj: R.izbori.has(zaId) ? bez(R.izbori.get(zaId)) : null, predali: [...R.izbori.keys()],
      };
      if (s.faza === 'raptori-otkrivanje') {
        v.raptori.sc = R.sc; // sa najboljim begom
        v.raptori.izbori = Object.fromEntries([...R.izbori].map(([id, o]) => [id, bez(o)]));
        v.dobitak = s.dobitak;
      }
    }
    if ((s.faza === 'trojka' || s.faza === 'trojka-otkrivanje') && s.trojka) {
      const S = s.trojka;
      const bez = ({ at, kos, t, ...o }) => o; // ishod tuđeg šuta se ne vidi pre otkrivanja (klijent ga sam simulira)
      const { najbolje, ...sc } = S.sc;
      v.trojka = {
        rb: s.brojacReci, ukupno: s.brojRundi(), pocetak: s.pocetak, trajanje: s.trajanje,
        sc, moj: S.sutevi.has(zaId) ? bez(S.sutevi.get(zaId)) : null, predali: [...S.sutevi.keys()],
      };
      if (s.faza === 'trojka-otkrivanje') {
        v.trojka.sc = S.sc;
        v.trojka.sutevi = Object.fromEntries([...S.sutevi].map(([id, o]) => [id, bez(o)]));
        v.dobitak = s.dobitak;
      }
    }
    if ((s.faza === 'hemija' || s.faza === 'hemija-otkrivanje') && s.hemija) {
      const H = s.hemija;
      const bezVrednosti = (sc) => ({ brojBira: sc.brojBira, elementi: sc.elementi.map(({ simbol, ime, z }) => ({ simbol, ime, z })) });
      v.hemija = {
        rb: s.brojacReci, ukupno: s.brojRundi(), pocetak: s.pocetak, trajanje: s.trajanje,
        vrednost: bezVrednosti(H.vrednost),
        radio: bezVrednosti(H.radio),
        moj: H.izbori.has(zaId) ? H.izbori.get(zaId) : null,
        predali: [...H.izbori.keys()],
      };
      if (s.faza === 'hemija-otkrivanje') {
        v.hemija.vrednost = H.vrednost;
        v.hemija.radio = H.radio;
        v.hemija.izbori = Object.fromEntries([...H.izbori]);
        v.dobitak = s.dobitak;
      }
    }
    if ((s.faza === 'karta' || s.faza === 'karta-otkrivanje') && s.karta) {
      const K = s.karta;
      const bez = ({ at, ...o }) => o; // tuđe tačke se ne vide pre otkrivanja; tačna lokacija grada takođe ne
      v.karta = {
        rb: s.brojacReci, ukupno: s.brojRundi(), pocetak: s.pocetak, trajanje: s.trajanje,
        oblast: K.sc.oblast, grad: K.sc.grad.ime,
        moj: K.izbori.has(zaId) ? bez(K.izbori.get(zaId)) : null, predali: [...K.izbori.keys()],
      };
      if (s.faza === 'karta-otkrivanje') {
        v.karta.grad = K.sc.grad; // sa lon/lat
        v.karta.izbori = Object.fromEntries([...K.izbori].map(([id, o]) => [id, bez(o)]));
        v.dobitak = s.dobitak;
      }
    }
    if (s.faza === 'tabela') v.tabela = s.tabelaPodaci;
    if (s.faza === 'kraj') v.konacno = s.rang();
    return v;
  }
}

// Verzija oblika sačuvanog stanja (vidi uStanje). Format još nije konačan – kad se promeni:
//   1. povećaj Soba.FORMAT;
//   2. po mogućstvu dodaj migraciju sa prethodnog formata – tada ni taj deploy ne prekida igre u toku:
//        Soba.MIGRACIJE[1] = (o) => ({ ...o, novoPolje: staroPolje(o) });   // soba u formatu 1 → format 2
//      (o = jedna sačuvana soba kao obični objekat: Map/Set su već vraćeni, rokovi još nisu pomereni);
//   3. bez migracije novi server odbacuje stare sobe – deploy tada prekida igre, pa objavi.sh traži da niko ne igra.
// alati/test-deploy.js proverava oba slučaja (sobe vraćene i igra ide do kraja, ili jasno upozorenje).
Soba.FORMAT = 1;
Soba.MIGRACIJE = {};

module.exports = Soba;
