// Bonus igra „Pronađi grad na karti“: otvori se karta (Srbija, Evropa ili Severna Amerika), a igrač dodirne mesto
// gde misli da je zadati grad. Poeni zavise od blizine (haversine udaljenost u km) – što bliže, to više poena,
// pogodak „u sam centar“ donosi bonus, a najbliži među igračima dodatni bonus. Isti kôd koristi server
// (bodovanje, lib/soba.js) i telefon (crtanje karte i dodir) – udaljenost je ista na obe strane.
(function (koren, f) {
  const K = f();
  if (typeof module === 'object' && module.exports) module.exports = K;
  else koren.Karta = K;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const RAD = Math.PI / 180;
  const ZEMLJA_R = 6371; // km

  // regioni: kutija [zapad, jug, istok, sever] (lon, lat), pun/dobar u km.
  // `pun` = razdaljina za bonus „U samom centru!“, `dobar` = razdaljina na kojoj vredi još pola poena.
  const REGIONI = {
    srbija: {
      naziv: 'Srbija', ikona: '🇷🇸', kutija: [18.6, 41.75, 23.2, 46.3], pun: 20, dobar: 90,
      gradovi: [
        { ime: 'Beograd', lon: 20.46, lat: 44.82 },
        { ime: 'Novi Sad', lon: 19.84, lat: 45.25 },
        { ime: 'Niš', lon: 21.90, lat: 43.32 },
        { ime: 'Kragujevac', lon: 20.91, lat: 44.01 },
        { ime: 'Subotica', lon: 19.67, lat: 46.10 },
        { ime: 'Zrenjanin', lon: 20.38, lat: 45.38 },
        { ime: 'Pančevo', lon: 20.64, lat: 44.87 },
        { ime: 'Čačak', lon: 20.35, lat: 43.89 },
        { ime: 'Kraljevo', lon: 20.69, lat: 43.72 },
        { ime: 'Novi Pazar', lon: 20.51, lat: 43.14 },
        { ime: 'Smederevo', lon: 20.93, lat: 44.66 },
        { ime: 'Leskovac', lon: 21.95, lat: 43.00 },
        { ime: 'Valjevo', lon: 19.88, lat: 44.27 },
        { ime: 'Šabac', lon: 19.69, lat: 44.76 },
        { ime: 'Vranje', lon: 21.90, lat: 42.55 },
        { ime: 'Užice', lon: 19.84, lat: 43.86 },
        { ime: 'Sombor', lon: 19.12, lat: 45.77 },
        { ime: 'Kikinda', lon: 20.47, lat: 45.83 },
        { ime: 'Požarevac', lon: 21.19, lat: 44.62 },
        { ime: 'Jagodina', lon: 21.26, lat: 43.98 },
      ],
    },
    evropa: {
      naziv: 'Evropa', ikona: '🌍', kutija: [-25, 34, 45, 71], pun: 80, dobar: 350,
      gradovi: [
        { ime: 'Pariz', lon: 2.35, lat: 48.86 },
        { ime: 'London', lon: -0.13, lat: 51.51 },
        { ime: 'Rim', lon: 12.50, lat: 41.90 },
        { ime: 'Berlin', lon: 13.41, lat: 52.52 },
        { ime: 'Madrid', lon: -3.70, lat: 40.42 },
        { ime: 'Beč', lon: 16.37, lat: 48.21 },
        { ime: 'Moskva', lon: 37.62, lat: 55.76 },
        { ime: 'Atina', lon: 23.73, lat: 37.98 },
        { ime: 'Lisabon', lon: -9.14, lat: 38.72 },
        { ime: 'Amsterdam', lon: 4.90, lat: 52.37 },
        { ime: 'Brisel', lon: 4.35, lat: 50.85 },
        { ime: 'Prag', lon: 14.44, lat: 50.08 },
        { ime: 'Varšava', lon: 21.01, lat: 52.23 },
        { ime: 'Budimpešta', lon: 19.04, lat: 47.50 },
        { ime: 'Dablin', lon: -6.26, lat: 53.35 },
        { ime: 'Kopenhagen', lon: 12.57, lat: 55.68 },
        { ime: 'Oslo', lon: 10.75, lat: 59.91 },
        { ime: 'Stokholm', lon: 18.07, lat: 59.33 },
        { ime: 'Helsinki', lon: 24.94, lat: 60.17 },
        { ime: 'Kijev', lon: 30.52, lat: 50.45 },
        { ime: 'Bukurešt', lon: 26.10, lat: 44.43 },
        { ime: 'Sofija', lon: 23.32, lat: 42.70 },
        { ime: 'Minhen', lon: 11.58, lat: 48.14 },
        { ime: 'Barselona', lon: 2.17, lat: 41.39 },
        { ime: 'Milano', lon: 9.19, lat: 45.46 },
        { ime: 'Cirih', lon: 8.54, lat: 47.38 },
        { ime: 'Napulj', lon: 14.27, lat: 40.85 },
        { ime: 'Hamburg', lon: 9.99, lat: 53.55 },
      ],
    },
    amerika: {
      naziv: 'Severna Amerika', ikona: '🗽', kutija: [-126, 23, -66, 50], pun: 120, dobar: 500,
      gradovi: [
        { ime: 'Njujork', lon: -74.01, lat: 40.71 },
        { ime: 'Los Anđeles', lon: -118.24, lat: 34.05 },
        { ime: 'Čikago', lon: -87.63, lat: 41.88 },
        { ime: 'Hjuston', lon: -95.37, lat: 29.76 },
        { ime: 'Finiks', lon: -112.07, lat: 33.45 },
        { ime: 'Filadelfija', lon: -75.17, lat: 39.95 },
        { ime: 'San Antonio', lon: -98.49, lat: 29.42 },
        { ime: 'San Dijego', lon: -117.16, lat: 32.72 },
        { ime: 'Dalas', lon: -96.80, lat: 32.78 },
        { ime: 'San Francisko', lon: -122.42, lat: 37.77 },
        { ime: 'Sijetl', lon: -122.33, lat: 47.61 },
        { ime: 'Majami', lon: -80.19, lat: 25.76 },
        { ime: 'Boston', lon: -71.06, lat: 42.36 },
        { ime: 'Denver', lon: -104.99, lat: 39.74 },
        { ime: 'Vašington', lon: -77.04, lat: 38.91 },
        { ime: 'Las Vegas', lon: -115.14, lat: 36.17 },
        { ime: 'Nju Orleans', lon: -90.07, lat: 29.95 },
        { ime: 'Atlanta', lon: -84.39, lat: 33.75 },
        { ime: 'Detroit', lon: -83.05, lat: 42.33 },
        { ime: 'Mineapolis', lon: -93.27, lat: 44.98 },
      ],
    },
    afrika: {
      naziv: 'Afrika', ikona: '🦁', kutija: [-20, -36, 53, 38], pun: 150, dobar: 650,
      gradovi: [
        { ime: 'Kairo', lon: 31.24, lat: 30.04 },
        { ime: 'Alžir', lon: 3.06, lat: 36.75 },
        { ime: 'Kasablanka', lon: -7.59, lat: 33.57 },
        { ime: 'Lagos', lon: 3.38, lat: 6.52 },
        { ime: 'Dakar', lon: -17.44, lat: 14.69 },
        { ime: 'Adis Abeba', lon: 38.75, lat: 9.02 },
        { ime: 'Najrobi', lon: 36.82, lat: -1.29 },
        { ime: 'Kinšasa', lon: 15.27, lat: -4.44 },
        { ime: 'Kejptaun', lon: 18.42, lat: -33.92 },
        { ime: 'Johanesburg', lon: 28.05, lat: -26.20 },
      ],
    },
    azija: {
      naziv: 'Azija', ikona: '🐉', kutija: [25, -11, 150, 75], pun: 180, dobar: 750,
      gradovi: [
        { ime: 'Tokio', lon: 139.69, lat: 35.68 },
        { ime: 'Peking', lon: 116.41, lat: 39.90 },
        { ime: 'Šangaj', lon: 121.47, lat: 31.23 },
        { ime: 'Hongkong', lon: 114.17, lat: 22.32 },
        { ime: 'Seul', lon: 126.98, lat: 37.57 },
        { ime: 'Nju Delhi', lon: 77.21, lat: 28.61 },
        { ime: 'Mumbaj', lon: 72.88, lat: 19.08 },
        { ime: 'Bankok', lon: 100.50, lat: 13.76 },
        { ime: 'Singapur', lon: 103.82, lat: 1.35 },
        { ime: 'Kuala Lumpur', lon: 101.69, lat: 3.14 },
        { ime: 'Džakarta', lon: 106.85, lat: -6.21 },
        { ime: 'Manila', lon: 120.98, lat: 14.60 },
        { ime: 'Hanoj', lon: 105.83, lat: 21.03 },
        { ime: 'Rijad', lon: 46.68, lat: 24.71 },
        { ime: 'Dubai', lon: 55.27, lat: 25.20 },
        { ime: 'Teheran', lon: 51.39, lat: 35.69 },
        { ime: 'Bagdad', lon: 44.36, lat: 33.31 },
        { ime: 'Jerusalim', lon: 35.21, lat: 31.77 },
        { ime: 'Istanbul', lon: 28.98, lat: 41.01 },
        { ime: 'Kabul', lon: 69.21, lat: 34.56 },
      ],
    },
    australija: {
      naziv: 'Australija', ikona: '🦘', kutija: [112, -45, 155, -10], pun: 100, dobar: 400,
      gradovi: [
        { ime: 'Sidnej', lon: 151.21, lat: -33.87 },
        { ime: 'Melburn', lon: 144.96, lat: -37.81 },
      ],
    },
  };

  const region = (id) => REGIONI[id] || REGIONI.evropa;

  // nasumičan grad iz nasumičnog regiona
  function napravi() {
    const ids = Object.keys(REGIONI);
    const id = ids[Math.floor(Math.random() * ids.length)];
    const R = REGIONI[id];
    const grad = R.gradovi[Math.floor(Math.random() * R.gradovi.length)];
    return { oblast: id, grad: { ...grad } };
  }

  // udaljenost u km između dve tačke (lon/lat)
  function razdaljina(a, b) {
    const f1 = a.lat * RAD, f2 = b.lat * RAD;
    const df = (b.lat - a.lat) * RAD, dl = (b.lon - a.lon) * RAD;
    const h = Math.sin(df / 2) ** 2 + Math.cos(f1) * Math.cos(f2) * Math.sin(dl / 2) ** 2;
    return 2 * ZEMLJA_R * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  // poeni za izabranu tačku (lon/lat) u scenariju `sc`
  function bodovi(sc, lon, lat) {
    const R = region(sc.oblast);
    const d = razdaljina(sc.grad, { lon, lat });
    const udeo = Math.max(0, 1 - d / (2 * R.dobar));
    const poeni = Math.round((500 * udeo) / 10) * 10;
    let bonus = 0;
    const oznake = [];
    if (d <= R.pun) { bonus += 200; oznake.push('U samom centru!'); }
    else if (d <= R.dobar / 2) oznake.push('Vrlo blizu!');
    else if (d <= R.dobar) oznake.push('Blizu!');
    return { d, poeni, bonus, oznake };
  }

  const km = (d) => `${Math.round(d)} km`;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ───────── crtanje karte (samo klijent) ─────────
  let geoPodaci = null;
  function geo() {
    if (!geoPodaci) geoPodaci = fetch('/geo/svet.json').then((r) => r.json()).catch(() => ({ drzave: {} }));
    return geoPodaci;
  }

  // ista (ekvirektangularna) projekcija kao u public/mediji.js
  function projekcija(R) {
    const [x0, y0, x1, y1] = R.kutija;
    const kos = Math.cos(((y0 + y1) / 2) * RAD);
    const W = 1000;
    const H = Math.round((1000 * (y1 - y0)) / ((x1 - x0) * kos));
    const px = (lon, lat) => [((lon - x0) / (x1 - x0)) * W, ((y1 - lat) / (y1 - y0)) * H];
    const inverzno = (x, y) => [x0 + (x / W) * (x1 - x0), y1 - (y / H) * (y1 - y0)];
    return { W, H, px, inverzno };
  }

  // vraća objekat za crtanje i dodir: { pin, ocistiP, klik, unisti }
  async function scena(kontejner, oblast) {
    const R = region(oblast);
    const D = await geo();
    const { W, H, px, inverzno } = projekcija(R);
    const putanja = (prsten) => 'M' + prsten.map(([a, b]) => px(a, b).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z';
    const uOkviru = (rings) => rings.some((r) => r.some(([a, b]) => a > R.kutija[0] - 15 && a < R.kutija[2] + 15 && b > R.kutija[1] - 15 && b < R.kutija[3] + 15));
    let html = `<svg viewBox="0 0 ${W} ${H}" class="mapa karta-svg" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="var(--more)"/>`;
    for (const [kod, rings] of Object.entries(D.drzave || {})) {
      if (!uOkviru(rings)) continue;
      const dom = kod === 'SRB' && oblast === 'srbija';
      html += `<path d="${rings.map(putanja).join('')}" class="drz ${dom ? 'dom' : ''}"/>`;
    }
    html += '</svg>';
    kontejner.innerHTML = html;
    const svg = kontejner.querySelector('svg');
    const pinovi = [];
    function pin(lon, lat, boja, oznaka, veliki) {
      const [x, y] = px(lon, lat);
      const r = veliki ? 15 : 11;
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'pin');
      let unutra = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>`;
      if (veliki) unutra += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" class="talas"/>`;
      if (oznaka) unutra += `<text x="${x.toFixed(1)}" y="${(y - r - 6).toFixed(1)}" text-anchor="middle">${esc(oznaka)}</text>`;
      g.innerHTML = unutra;
      if (boja) g.querySelector('circle').style.fill = boja;
      svg.appendChild(g);
      pinovi.push(g);
      return g;
    }
    const ciscenje = [];
    return {
      svg, pin,
      ocistiP() { pinovi.forEach((p) => p.remove()); pinovi.length = 0; },
      klik(fn) {
        const on = (e) => {
          e.preventDefault();
          const pt = svg.createSVGPoint();
          pt.x = e.clientX; pt.y = e.clientY;
          const ctm = svg.getScreenCTM();
          if (!ctm) return;
          const p = pt.matrixTransform(ctm.inverse());
          const lon = Math.max(R.kutija[0], Math.min(R.kutija[2], inverzno(p.x, p.y)[0]));
          const lat = Math.max(R.kutija[1], Math.min(R.kutija[3], inverzno(p.x, p.y)[1]));
          fn(+lon.toFixed(3), +lat.toFixed(3));
        };
        svg.addEventListener('pointerdown', on);
        ciscenje.push(() => svg.removeEventListener('pointerdown', on));
      },
      unisti() { ciscenje.forEach((f) => f()); if (svg && svg.parentNode) svg.remove(); },
    };
  }

  return { REGIONI, region, napravi, razdaljina, bodovi, km, scena };
});
