#!/usr/bin/env node
// Gradi public/geo/priroda.json – prirodni oblici za medij „mapa“: predeli (planine, pustinje,
// poluostrva, nizije, ostrva), mora/zalivi/moreuzi/okeani, jezera i reke koje nisu u svet.json.
// Izvor: Natural Earth (javni domen), github.com/nvkelso/natural-earth-vector (geojson).
//   node alati/gradi-prirodu.js            → preuzme (keš u os.tmpdir()/natural-earth) i sagradi
//   node alati/gradi-prirodu.js --spisak   → samo ispiše ključeve
// Ključevi su srpski nazivi (latinica) – koriste se u kviz.json: "predeli", "mora", "jezera", "reke".
const fs = require('fs');
const path = require('path');
const os = require('os');

const IZVOR = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/';
const KES = path.join(os.tmpdir(), 'natural-earth');
const IZLAZ = path.join(__dirname, '..', 'public', 'geo', 'priroda.json');

// srpski naziv → nazivi u Natural Earth (NAME u geography_regions_polys)
const PREDELI = {
  // Evropa
  'Alpi': ['ALPS'], 'Pirineji': ['PYRENEES'], 'Apenini': ['APPENNINI'], 'Karpati': ['CARPATHIAN MOUNTAINS', 'Transylvanian Alps', 'Tatra Mts.'],
  'Skandinavske planine': ['KJØLEN MOUNTAINS'], 'Ural': ['URAL MOUNTAINS'], 'Kavkaz': ['CAUCASUS MTS.'], 'Dinaridi': ['Dinaric Alps'],
  'Balkan (Stara planina)': ['Balkan Mts.'], 'Pind': ['Pindus Mts.'], 'Kantabrijske planine': ['Cord. Cantábrica'], 'Sijera Nevada (Španija)': ['S. Nevada'],
  'Sijera Morena': ['Sierra Morena'], 'Centralni masiv': ['Massif Central'], 'Jura': ['Jura'], 'Vogezi': ['Vosges'], 'Ardeni': ['Ardennes'],
  'Harc': ['Harz'], 'Rudne planine': ['Erzgebirge'], 'Sudeti': ['Sudetes Mts.'], 'Šumava': ['Böhmerwald'], 'Grampijske planine': ['Grampian Mts.'],
  'Panonska nizija': ['Alföld'], 'Srednjoevropska nizija': ['NORTHERN EUROPEAN PLAIN'], 'Srednjoruska visija': ['CENTRAL RUSSIAN UPLAND'],
  'Pontska stepa': ['PONTIC STEPPE'], 'Prikaspijska nizija': ['CASPIAN DEPRESSION'], 'Balkansko poluostrvo': ['BALKAN PEN.'],
  'Pirinejsko poluostrvo': ['PENÍNSULA IBÉRICA'], 'Skandinavsko poluostrvo': ['SCANDINAVIA'], 'Jiland': ['JUTLAND'], 'Krim': ['CRIMEA'],
  'Kola': ['KOLA PENINSULA'], 'Peloponez': ['Pelopónnisos'], 'Karelija': ['Karelia'], 'Laponija': ['LAPLAND'], 'Finska jezerska oblast': ['Finnish Lake Region'],
  'Dalmacija': ['Dalmatia'], 'Normandija': ['Normandie'], 'Bretanja': ['Bretagne'], 'Vatnajekul': ['Vatnajökull'],
  'Velika Britanija': ['GREAT BRITAIN'], 'Irska': ['IRELAND'], 'Island': ['ICELAND'], 'Britanska ostrva': ['BRITISH ISLES'], 'Sicilija': ['Sicilia'],
  'Sardinija': ['Sardegna'], 'Korzika': ['Corse'], 'Krit': ['Crete'], 'Balearska ostrva': ['Balearic Islands'], 'Kiklade': ['Cyclades'],
  'Jonska ostrva': ['Ionian Is.'], 'Malta': ['Malta'], 'Svalbard': ['SVALBARD'], 'Nova Zemlja': ['NOVAYA ZEMLYA'], 'Zemlja Franje Josifa': ['FRANZ JOSEF LAND'],
  'Farska ostrva': ['Føroyar'], 'Lofoti': ['Lofoten'], 'Delta Dunava': ['Danube Delta'], 'Delta Volge': ['Volga Delta'], 'Anadolija': ['ANATOLIA'],
  // Azija
  'Himalaji': ['HIMALAYAS'], 'Karakorum': ['KARAKORAM RA.'], 'Hindukuš': ['HINDU KUSH'], 'Pamir': ['PAMIRS'], 'Tjenšan': ['TIAN SHAN'],
  'Altaj': ['ALTAY MOUNTAINS'], 'Kunlun': ['KUNLUN MOUNTAINS'], 'Zagros': ['ZAGROS MOUNTAINS'], 'Elburz': ['ELBURZ MTS.'],
  'Verhojanske planine': ['VERKHOYANSK RANGE'], 'Zapadni Gati': ['WESTERN GHATS'], 'Istočni Gati': ['EASTERN GHATS'], 'Veliki Hingan': ['GREATER KHINGAN RANGE'],
  'Tibetska visoravan': ['PLATEAU OF TIBET'], 'Dekan': ['DECCAN PLATEAU'], 'Srednjosibirska visoravan': ['CENTRAL SIBERIAN PLATEAU'],
  'Mongolska visoravan': ['MONGOLIAN PLATEAU'], 'Zapadnosibirska nizija': ['WESTERN SIBERIAN PLAIN'], 'Severnosibirska nizija': ['NORTH SIBERIAN LOWLAND'],
  'Turanska nizija': ['TURAN LOWLAND'], 'Kazaška stepa': ['KAZAKH STEPPE'], 'Indo-gangeska nizija': ['GANGES PLAIN', 'PUNJAB'],
  'Velika kineska nizija': ['NORTH CHINA PLAIN'], 'Mandžurijska nizija': ['MANCHURIAN PLAIN'], 'Mesopotamija': ['Mesopotamia'], 'Sibir': ['SIBERIA'],
  'Tarimski basen': ['TARIM BASIN'], 'Sečuanski basen': ['SICHUAN BASIN'], 'Ferganska dolina': ['Fergana Valley'],
  'Gobi': ['GOBI DESERT'], 'Tar': ['THAR DESERT'], 'Rub al-Hali': ['RUB’ AL KHALI'], 'Sirijska pustinja': ['SYRIAN DESERT'], 'Karakum': ['GARAGUM DESERT'],
  'Kizilkum': ['QIZILQUM DESERT'], 'Arabijsko poluostrvo': ['ARABIAN PENINSULA'], 'Indijsko poluostrvo': ['INDIA'], 'Indokina': ['INDOCHINA PENINSULA'],
  'Malajsko poluostrvo': ['MALAY PENINSULA'], 'Kamčatka': ['KAMCHATKA PENINSULA'], 'Tajmir': ['TAYMYR PENINSULA'], 'Jamal': ['YAMAL PENINSULA'],
  'Korejsko poluostrvo': ['KOREA'], 'Čukotsko poluostrvo': ['Chukotskiy Pen.', 'CHUKCHI PENINSULA'],
  'Japanska ostrva': ['JAPAN'], 'Filipini': ['PHILIPPINES'], 'Malajski arhipelag': ['MALAY ARCHIPELAGO'], 'Veliki Sundski otoci': ['GREATER SUNDA ISLANDS'],
  'Molučka ostrva': ['MOLUCCAS'], 'Šri Lanka': ['SRI LANKA'], 'Borneo': ['BORNEO'], 'Sumatra': ['SUMATRA'], 'Java': ['JAVA'], 'Sulavesi': ['SULAWESI'],
  'Tajvan': ['TAIWAN'], 'Sahalin': ['SAKHALIN'], 'Honšu': ['HONSHÜ'], 'Delta Mekonga': ['Mekong Delta'],
  // Afrika
  'Sahara': ['SAHARA'], 'Kalahari': ['KALAHARI DESERT'], 'Namib': ['NAMIB DESERT'], 'Libijska pustinja': ['LIBYAN DESERT', 'WESTERN DESERT'],
  'Nubijska pustinja': ['NUBIAN DESERT'], 'Atlas': ['ATLAS MOUNTAINS', 'HAUT ATLAS', 'ATLAS SAHARIEN'], 'Etiopska visoravan': ['ETHIOPIAN HIGHLANDS'],
  'Istočnoafrički rov': ['GREAT RIFT VALLEY'], 'Zmajeve planine': ['DRAKENSBERG'], 'Ahagar': ['AHAGGAR MTS.'], 'Tibesti': ['TIBESTI MTS.'],
  'Kongoanski basen': ['CONGO BASIN'], 'Sahel': ['SAHEL'], 'Somalijsko poluostrvo': ['SOMALI PENINSULA'], 'Madagaskar': ['MADAGASCAR'],
  'Delta Nigera': ['Niger Delta'], 'Sud': ['SUDD'], 'Katanga': ['KATANGA PLATEAU'],
  // Severna Amerika
  'Stenovite planine': ['ROCKY MOUNTAINS'], 'Apalači': ['APPALACHIAN MTS.'], 'Sijera Nevada': ['SIERRA NEVADA'], 'Kaskadne planine': ['CASCADE RANGE'],
  'Obalske planine': ['COAST RANGES', 'COAST MOUNTAINS'], 'Aljaski venac': ['ALASKA RANGE'], 'Bruksov venac': ['BROOKS RANGE'],
  'Istočna Sijera Madre': ['SIERRA MADRE ORIENTAL'], 'Zapadna Sijera Madre': ['SIERRA MADRE OCCIDENTAL'], 'Meksička visoravan': ['ALTI-PLANICIE MEXICANA'],
  'Velike ravnice': ['GREAT PLAINS'], 'Centralna nizija': ['CENTRAL LOWLAND'], 'Primorska nizija': ['COASTAL PLAIN'], 'Kanadski štit': ['CANADIAN SHIELD'],
  'Koloradski plato': ['COLORADO PLATEAU'], 'Veliki basen': ['GREAT BASIN'], 'Florida': ['FLORIDA'], 'Aljaska': ['ALASKA'], 'Kalifornijsko poluostrvo': ['BAJA CALIFORNIA'],
  'Jukatan': ['PEN. DE YUCATÁN'], 'Labrador': ['LABRADOR'], 'Grenland': ['GREENLAND'], 'Srednja Amerika': ['CENTRAL AMERICA'], 'Panamska prevlaka': ['Is. de Panamá'],
  'Veliki Antili': ['GREATER ANTILLES'], 'Mali Antili': ['LESSER ANTILLES'], 'Bahami': ['BAHAMA ISLANDS'], 'Zapadna Indija': ['WEST INDIES'],
  'Kanadski arktički arhipelag': ['ARCTIC ARCHIPELAGO'], 'Bafinova zemlja': ['BAFFIN ISLAND'], 'Elsmir': ['ELLESMERE  ISLAND'], 'Njufaundlend': ['ISLAND OF NEWFOUNDLAND'],
  'Havajska ostrva': ['HAWAIIAN ISLANDS'], 'Aleutska ostrva': ['ALEUTIAN ISLANDS'], 'Delta Misisipija': ['Mississippi Delta'],
  // Južna Amerika
  'Andi': ['ANDES'], 'Atakama': ['DESIERTO DE ATACAMA'], 'Amazonska nizija': ['AMAZON BASIN'], 'Brazilska visoravan': ['BRAZILIAN HIGHLANDS'],
  'Gvajanska visoravan': ['GUIANA SHIELD'], 'Pampa': ['PAMPAS'], 'Gran Čako': ['GRAN CHACO', 'CHACO BOREAL', 'CHACO AUSTRAL'], 'Ljanos': ['LLANOS'],
  'Patagonija': ['PATAGONIA'], 'Altiplano': ['ALTIPLANO'], 'Ognjena zemlja': ['TIERRA DEL FUEGO'], 'Pantanal': ['PANTANAL'], 'Delta Amazona': ['Amazon Delta'],
  'Folklandska ostrva': ['FALKLAND IS.'],
  // Australija i Okeanija
  'Velika razvodna planina': ['GREAT DIVIDING RANGE'], 'Velika peščana pustinja': ['GREAT SANDY DESERT'], 'Velika Viktorijina pustinja': ['GREAT VICTORIA DESERT'],
  'Gibsonova pustinja': ['Gibson Desert'], 'Simpsonova pustinja': ['Simpson Desert'], 'Nalarbor': ['NULLARBOR PLAIN'], 'Zapadnoaustralijska visoravan': ['WESTERN PLATEAU'],
  'Veliki arteški basen': ['GREAT ARTESIAN BASIN'], 'Basen Marej-Darling': ['MURRAY-DARLING BASIN'], 'Jork': ['CAPE YORK PEN.'], 'Arnemova zemlja': ['ARNHEM LAND'],
  'Tasmanija': ['TASMANIA'], 'Novi Zeland': ['NEW ZEALAND'], 'Severno ostrvo': ['NORTH ISLAND'], 'Južno ostrvo': ['SOUTH ISLAND'], 'Južni Alpi': ['SOUTHERN ALPS'],
  'Nova Gvineja': ['NEW GUINEA'], 'Melanezija': ['MELANESIA'], 'Mikronezija': ['MICRONESIA'], 'Polinezija': ['POLYNESIA'],
  // Polarne oblasti
  'Antarktičko poluostrvo': ['Antarctic Peninsula'], 'Transantarktičke planine': ['Transantarctic Mountains'], 'Istočni Antarktik': ['East Antarctica'],
  'Zapadni Antarktik': ['West Antarctica'], 'Zemlja kraljice Mod': ['Queen Maud Land'], 'Elsvortove planine': ['Ellsworth Mountains'],
  'Novosibirska ostrva': ['NEW SIBERIAN ISLANDS'], 'Severna Zemlja': ['SEVERNAYA ZEMLYA'],
};
// srpski naziv → name u geography_marine_polys
const MORA = {
  'Severni ledeni okean': ['Arctic Ocean'], 'Južni okean': ['SOUTHERN OCEAN'], 'Atlantski okean': ['North Atlantic Ocean', 'South Atlantic Ocean'],
  'Tihi okean': ['North Pacific Ocean', 'South Pacific Ocean'], 'Indijski okean': ['INDIAN OCEAN'],
  'Sredozemno more': ['Mediterranean Sea', 'Tyrrhenian Sea', 'Adriatic Sea', 'Ionian Sea', 'Aegean Sea', 'Ligurian Sea', 'Balearic Sea', 'Sea of Crete', 'Alboran Sea', 'Gulf of Sidra', 'Golfe du Lion', 'Gulf of Gabès'],
  'Jadransko more': ['Adriatic Sea'], 'Jonsko more': ['Ionian Sea'], 'Egejsko more': ['Aegean Sea', 'Sea of Crete'], 'Tirensko more': ['Tyrrhenian Sea'],
  'Ligursko more': ['Ligurian Sea'], 'Crno more': ['Black Sea'], 'Azovsko more': ['Sea of Azov'], 'Mramorno more': ['Sea of Marmara'], 'Kaspijsko jezero': ['Caspian Sea'],
  'Baltičko more': ['Baltic Sea', 'Gulf of Bothnia', 'Gulf of Finland', 'Gulf of Riga'], 'Botnijski zaliv': ['Gulf of Bothnia'], 'Finski zaliv': ['Gulf of Finland'],
  'Severno more': ['North Sea'], 'Norveško more': ['Norwegian Sea'], 'Barencovo more': ['Barents Sea'], 'Belo more': ['White Sea'],
  'Karsko more': ['Kara Sea'], 'Laptevsko more': ['Laptev Sea'], 'Istočnosibirsko more': ['East Siberian Sea'], 'Čukotsko more': ['Chukchi Sea'], 'Bofortovo more': ['Beaufort Sea'],
  'Grenlandsko more': ['Greenland Sea'], 'Irsko more': ['Irish Sea'], 'Lamanš': ['English Channel'], 'Biskajski zaliv': ['Bay of Biscay'], 'Skagerak': ['Skagerrak'], 'Kategat': ['Kattegat'],
  'Gibraltarski moreuz': ['Strait of Gibraltar'], 'Bosfor': ['Bosporus'],
  'Crveno more': ['Red Sea'], 'Persijski zaliv': ['Persian Gulf'], 'Omanski zaliv': ['Gulf of Oman'], 'Adenski zaliv': ['Gulf of Aden'], 'Arabijsko more': ['Arabian Sea'],
  'Bengalski zaliv': ['Bay of Bengal'], 'Andamansko more': ['Andaman Sea'], 'Južno kinesko more': ['South China Sea'], 'Istočno kinesko more': ['East China Sea'],
  'Žuto more': ['Yellow Sea', 'Bo Hai'], 'Japansko more': ['Sea of Japan'], 'Ohotsko more': ['Sea of Okhotsk'], 'Beringovo more': ['Bering Sea'],
  'Filipinsko more': ['Philippine Sea'], 'Javansko more': ['Java Sea'], 'Tajlandski zaliv': ['Gulf of Thailand'], 'Malajski moreuz': ['Strait of Malacca'], 'Korejski moreuz': ['Korea Strait'],
  'Tajvanski moreuz': ['Taiwan Strait'],
  'Gvinejski zaliv': ['Gulf of Guinea', 'Bight of Benin', 'Bight of Biafra'], 'Mozambički kanal': ['Mozambique Channel'],
  'Meksički zaliv': ['Gulf of Mexico', 'Bahía de Campeche'], 'Karipsko more': ['Caribbean Sea'], 'Sargaško more': ['Sargasso Sea'], 'Hudsonov zaliv': ['Hudson Bay', 'James Bay'],
  'Bafinov zaliv': ['Baffin Bay'], 'Labradorsko more': ['Labrador Sea'], 'Aljaski zaliv': ['Gulf of Alaska'], 'Kalifornijski zaliv': ['Golfo de California'],
  'Zaliv Svetog Lovrenca': ['Gulf of Saint Lawrence'], 'Floridski moreuz': ['Straits of Florida'], 'Dejvisov moreuz': ['Davis Strait'],
  'La Plata': ['Río de la Plata'],
  'Koralno more': ['Coral Sea'], 'Tasmanovo more': ['Tasman Sea'], 'Arafursko more': ['Arafura Sea'], 'Timorsko more': ['Timor Sea'], 'Karpentarijski zaliv': ['Gulf of Carpentaria'],
  'Veliki australijski zaliv': ['Great Australian Bight'], 'Basov prolaz': ['Bass Strait'], 'Veliki koralni greben': ['Great Barrier Reef'], 'Torezov moreuz': ['Torres Strait'],
  'Vedelovo more': ['Weddell Sea'], 'Rosovo more': ['Ross Sea'], 'Amundsenovo more': ['Amundsen Sea'], 'Belinsgauzenovo more': ['Bellingshausen Sea'],
};
// srpski naziv → name u ne_10m_lakes
const JEZERA = {
  'Bajkal': ['Lake Baikal'], 'Aralsko jezero': ['South Aral Sea', 'North Aral Sea'], 'Balhaš': ['Lake Balkhash'], 'Isik-Kul': ['Issyk-Kul'], 'Mrtvo more': ['Dead Sea'],
  'Van': ['Lake Van'], 'Urmija': ['Lake Urmia'], 'Kukunor': ['Qinghai Hu'], 'Tonle Sap': ['Tonlé Sap'], 'Galilejsko jezero': ['Sea of Galilee'], 'Sevan': ['Lake Sevan'],
  'Viktorijino jezero': ['Lake Victoria'], 'Tanganjika': ['Lake Tanganyika'], 'Malavi': ['Lake Malawi'], 'Čad': ['Lake Chad'], 'Turkana': ['Lake Turkana'],
  'Albertovo jezero': ['Lake Albert'], 'Tana': ['Lake Tana'], 'Kivu': ['Lake Kivu'], 'Naser': ['Lake Nasser'], 'Volta': ['Lake Volta'], 'Kariba': ['Lake Kariba'],
  'Gornje jezero': ['Lake Superior'], 'Mičigen': ['Lake Michigan'], 'Huron': ['Lake Huron'], 'Iri': ['Lake Erie'], 'Ontario': ['Lake Ontario'],
  'Veliko medveđe jezero': ['Great Bear Lake'], 'Veliko ropsko jezero': ['Great Slave Lake'], 'Vinipeg': ['Lake Winnipeg'], 'Veliko slano jezero': ['Great Salt Lake'],
  'Nikaragva': ['Lago de Nicaragua'], 'Titikaka': ['Lago Titicaca'], 'Itaipu': ['Represa Itaipu'],
  'Ladoga': ['Lake Ladoga'], 'Onega': ['Lake Onega'], 'Čudsko jezero': ['Lake Peipus'], 'Vener': ['Vänern'], 'Veter': ['Vättern'], 'Saima': ['Lake Saimaa'],
  'Ženevsko jezero': ['Lake Geneva'], 'Bodensko jezero': ['Bodensee'], 'Balaton': ['Lake Balaton'], 'Ajselmer': ['IJsselmeer'], 'Lof Ni': ['Lough Neagh'],
  'Ejr': ['Lake Eyre North', 'Lake Eyre South'], 'Taupo': ['Lake Taupo'],
};
// srpski naziv → name u ne_10m_rivers_lake_centerlines (reke koje već postoje u svet.json se ne dupliraju)
const REKE = {
  'Kongo': ['Congo', 'Lualaba'], 'Niger': ['Niger'], 'Zambezi': ['Zambezi'], 'Oranž': ['Orange'], 'Limpopo': ['Limpopo'], 'Senegal': ['Sénégal', 'Bafing'],
  'Plavi Nil': ['Abay', 'El Bahr el Azraq'], 'Beli Nil': ['El Bahr el Abyad', 'Bahr el Jebel', 'Albert Nile', 'Victoria Nile'], 'Okavango': ['Okavango', 'Cubango'],
  'Ganges': ['Ganges'], 'Ind': ['Indus'], 'Bramaputra': ['Brahmaputra', 'Yarlung', 'Dihang'], 'Huang He': ['Huang'], 'Mekong': ['Mekong', 'Lancang'],
  'Iravadi': ['Ayeyarwady', 'Irrawaddy Delta'], 'Eufrat': ['Euphrates', 'Firat', 'Al Furat'], 'Tigar': ['Tigris', 'Dicle'], 'Šat el Arab': ['Shatt al Arab'],
  'Amur': ['Amur', 'Heilong Jiang', 'Argun’'], 'Ob': ['Ob'], 'Irtiš': ['Irtysh', 'Ertis', 'Ertix'], 'Jenisej': ['Yenisey', 'Verkhniy Yenisey', 'Malyy Yenisey'],
  'Lena': ['Lena'], 'Angara': ['Angara'], 'Amu Darja': ['Amu  Darya', 'Panj'], 'Sir Darja': ['Syr  Darya', 'Naryn'], 'Jordan': ['Jordan'], 'Kolima': ['Kolyma'],
  'Ural': ['Ural'], 'Dnjepar': ['Dnipro', 'Dnepre'], 'Don': ['Don'], 'Dnjestar': ['Dniester'], 'Kama': ['Kama'], 'Pečora': ['Pechora'], 'Severna Dvina': ['Severnaya Dvina', 'Sukhona'],
  'Neva': ['Neva'], 'Rona': ['Rhône', 'Rhne'], 'Garona': ['Garonne'], 'Ebro': ['Ebro'], 'Taho': ['Tajo', 'Tejo'], 'Duero': ['Duero'], 'Odra': ['Oder'], 'Drava': ['Drau'],
  'Zapadna Dvina': ['Daugava'], 'Glomma': ['Glomma'],
  'Misuri': ['Missouri'], 'Ohajo': ['Ohio', 'Allegheny'], 'Kolorado': ['Colorado'], 'Rio Grande': ['Rio Grande'], 'Kolumbija': ['Columbia'], 'Jukon': ['Yukon'],
  'Mekenzi': ['Mackenzie', 'Slave', 'Peace'], 'Sveti Lovrenc': ['St. Lawrence'], 'Nijagara': ['Niagara'], 'Tenesi': ['Tennessee'], 'Arkanzas': ['Arkansas'], 'Nelson': ['Nelson', 'Saskatchewan'],
  'Hadson': ['Hudson'], 'Potomak': ['Potomac'],
  'Parana': ['Paraná'], 'Orinoko': ['Orinoco'], 'Urugvaj': ['Uruguay'], 'Sao Fransisko': ['São  Francisco'], 'Madeira': ['Madeira', 'Mamoré'],
  'Rio Negro': ['Negro'], 'Magdalena': ['Magdalena'], 'Tokantins': ['Tocantins'], 'Ukajali': ['Ucayali'], 'Maranjon': ['Marañón'],
  'Marej': ['Murray'], 'Darling': ['Darling', 'Barwon'],
  'Suecki kanal': ['Suez Canal'], 'Panamski kanal': ['Panama Canal'],
};

// ───────── geometrija ─────────
const r2 = (v) => Math.round(v * 100) / 100;
function dp(t, eps) { // Douglas–Peucker
  if (t.length < 4) return t;
  const [ax, ay] = t[0], [bx, by] = t[t.length - 1];
  let mx = -1, mi = 0;
  const dx = bx - ax, dy = by - ay, d2 = dx * dx + dy * dy || 1e-12;
  for (let i = 1; i < t.length - 1; i++) {
    const [px, py] = t[i];
    const u = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / d2));
    const qx = ax + u * dx - px, qy = ay + u * dy - py, d = qx * qx + qy * qy;
    if (d > mx) { mx = d; mi = i; }
  }
  if (mx <= eps * eps) return [t[0], t[t.length - 1]];
  return [...dp(t.slice(0, mi + 1), eps).slice(0, -1), ...dp(t.slice(mi), eps)];
}
const cisti = (t, eps) => {
  const o = dp(t, eps).map(([a, b]) => [r2(a), r2(b)]);
  return o.filter((p, i) => !i || p[0] !== o[i - 1][0] || p[1] !== o[i - 1][1]);
};
function prstenovi(geom, eps) {
  const pol = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
  // samo spoljni prsten (rupe u predelima nisu bitne za crtež)
  return pol.map((p) => cisti(p[0], eps)).filter((r) => r.length >= 4);
}
function linije(geom, eps) {
  const ls = geom.type === 'LineString' ? [geom.coordinates] : geom.type === 'MultiLineString' ? geom.coordinates : [];
  return ls.map((l) => cisti(l, eps)).filter((l) => l.length >= 2);
}
// spaja linije reke koje se dodiruju krajevima (manje putanja)
function spoji(lin) {
  const l = lin.map((x) => x.slice());
  let promena = true;
  while (promena) {
    promena = false;
    for (let i = 0; i < l.length && !promena; i++) for (let j = 0; j < l.length && !promena; j++) {
      if (i === j) continue;
      const a = l[i], b = l[j], A = a[a.length - 1], B = b[0];
      if (Math.abs(A[0] - B[0]) < 0.02 && Math.abs(A[1] - B[1]) < 0.02) { l[i] = a.concat(b.slice(1)); l.splice(j, 1); promena = true; }
    }
  }
  return l;
}

async function ucitaj(ime) {
  fs.mkdirSync(KES, { recursive: true });
  const f = path.join(KES, ime + '.geojson');
  if (!fs.existsSync(f)) {
    console.log('preuzimam', ime);
    const r = await fetch(IZVOR + ime + '.geojson');
    if (!r.ok) throw new Error(ime + ': ' + r.status);
    fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
  }
  return JSON.parse(fs.readFileSync(f)).features;
}

function skupi(features, mapa, imeOd, pretvori) {
  const izlaz = {}, nema = [];
  for (const [sr, nazivi] of Object.entries(mapa)) {
    const geo = [];
    for (const f of features) if (nazivi.includes(imeOd(f.properties))) geo.push(...pretvori(f.geometry));
    if (geo.length) izlaz[sr] = geo; else nema.push(sr);
  }
  if (nema.length) console.log('  nije nađeno:', nema.join(', '));
  return izlaz;
}

(async () => {
  if (process.argv.includes('--spisak')) {
    for (const [k, v] of Object.entries({ PREDELI, MORA, JEZERA, REKE })) console.log(k + ':', Object.keys(v).join(', '));
    return;
  }
  const svet = require('../public/geo/svet.json');
  const P = await ucitaj('ne_10m_geography_regions_polys');
  const M = await ucitaj('ne_10m_geography_marine_polys');
  const J = await ucitaj('ne_10m_lakes');
  const R = await ucitaj('ne_10m_rivers_lake_centerlines');
  // mali oblici (ostrva, delte) – finije; velike oblasti – grublje
  const eps = (g) => { const s = JSON.stringify(g.coordinates).length; return s > 200000 ? 0.12 : s > 20000 ? 0.06 : 0.02; };
  console.log('predeli');
  const predeli = skupi(P, PREDELI, (p) => p.NAME, (g) => prstenovi(g, eps(g)));
  console.log('mora');
  const mora = skupi(M, MORA, (p) => p.name, (g) => prstenovi(g, eps(g)));
  console.log('jezera');
  const jezera = skupi(J, JEZERA, (p) => p.name, (g) => prstenovi(g, 0.02));
  console.log('reke');
  const reke = skupi(R, REKE, (p) => p.name, (g) => linije(g, 0.04));
  for (const k of Object.keys(reke)) { if (svet.reke[k]) delete reke[k]; else reke[k] = spoji(reke[k]); }
  const out = { izvor: 'Natural Earth (javni domen) – alati/gradi-prirodu.js', predeli, mora, jezera, reke };
  fs.writeFileSync(IZLAZ, JSON.stringify(out));
  console.log(IZLAZ, (fs.statSync(IZLAZ).size / 1024).toFixed(0) + ' KB', Object.keys(predeli).length, 'predela,', Object.keys(mora).length, 'mora,',
    Object.keys(jezera).length, 'jezera,', Object.keys(reke).length, 'reka');
})();
