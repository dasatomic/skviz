// Istorijske karte za medij „mapa“ (`"karta": "<ime>"`): približne granice država i oblasti u prošlosti,
// pohodi i fronte. Crtaju se preko kopna iz geo/svet.json (sve se iseca po obali, pa granice ka moru
// mogu biti grube). Koordinate su [geografska dužina, širina].
//
// oblasti: ime → { d: [ISO kodovi današnjih država], r: [[prsten tačaka], …], na: [lon, lat] (mesto natpisa) }
// linije:  ime → [[lon, lat], …]
// karte:   ime → { kutija, slojevi: [{ o: oblast | d/r, boja, natpis, kljuc }], linije, natpisi, reke, legenda }
//
// U pitanju: {"vrsta":"mapa","karta":"srbija-1833","istakni":["pasaluk"],"bezNatpisa":true,"tacke":[…]}
//  – `istakni` su ključevi slojeva (sloj treperi), `sakrij` (ključevi) / `bezNatpisa` sakrivaju natpise slojeva
//    (za pitanja „Koja je ovo oblast?“), dodatni `slojevi`, `linije`, `natpisi`, `legenda` se dodaju karti.
// Slojevi se crtaju redom – kasniji prekriva raniji (tako se iz jedne oblasti „iseca“ druga).
'use strict';
(() => {
  // Sava i Dunav od ušća Drine do ušća Timoka (zapad → istok)
  const SAVA_DUNAV = [[19.36, 44.9], [19.39, 44.92], [19.48, 44.98], [19.65, 44.96], [19.76, 44.92], [19.7, 44.81], [19.73, 44.76], [20.01, 44.69], [19.93, 44.66], [19.94, 44.63], [20.13, 44.72], [20.19, 44.68], [20.24, 44.72], [20.27, 44.66], [20.36, 44.78], [20.46, 44.84], [20.64, 44.85], [20.63, 44.77], [20.76, 44.67], [20.88, 44.67], [21.36, 44.83], [21.52, 44.79], [21.64, 44.71], [21.91, 44.67], [22.03, 44.62], [22.09, 44.54], [22.2, 44.56], [22.35, 44.68], [22.5, 44.71], [22.72, 44.61], [22.73, 44.57], [22.55, 44.54], [22.5, 44.49], [22.49, 44.44], [22.53, 44.38], [22.65, 44.32], [22.71, 44.24]];
  // Dunav od ušća Timoka do delte
  const DUNAV_ISTOK = [[23.03, 44.09], [23.02, 44.03], [22.89, 43.99], [22.86, 43.86], [23.13, 43.85], [23.48, 43.88], [23.64, 43.83], [24.16, 43.75], [24.47, 43.8], [24.96, 43.75], [25.4, 43.65], [25.78, 43.73], [26.12, 44.0], [26.75, 44.11], [27.23, 44.12], [27.57, 44.2], [27.97, 44.28], [28.11, 44.44], [28.03, 44.64], [27.88, 44.88], [27.95, 45.13], [28.03, 45.4], [28.24, 45.45], [28.75, 45.23], [29.8, 45.2]];
  // Drina od Bajine Bašte do ušća (jug → sever)
  const DRINA = [[19.55, 43.99], [19.58, 44.04], [19.34, 44.23], [19.13, 44.33], [19.13, 44.48], [19.29, 44.7], [19.36, 44.86]];
  // istočna granica Srbije od ušća Timoka do Knjaževca
  const TIMOK = [[22.63, 44.19], [22.6, 44.08], [22.42, 44.01], [22.37, 43.86], [22.37, 43.78]];
  // jugozapadna granica Srbije 1833–1878 (od Raške ka Drini)
  const JZ_1833 = [[20.6, 43.27], [20.3, 43.33], [20.05, 43.42], [19.75, 43.55], [19.5, 43.66], [19.25, 43.97], [19.31, 43.99]];

  const oblasti = {
    // Beogradski (Smederevski) pašaluk oko 1800 – približno
    pasaluk: { r: [[...SAVA_DUNAV.slice(0, 28), [22.15, 44.35], [21.95, 44.12], [21.6, 43.97], [21.4, 43.9], [21.2, 43.78], [20.95, 43.66], [20.7, 43.6], [20.45, 43.6], [20.15, 43.66], [19.85, 43.7], [19.55, 43.8], [19.3, 43.95], ...DRINA]], na: [20.55, 44.15] },
    // Kneževina Srbija posle hatišerifa 1833 (sa šest pripojenih nahija)
    srbija1833: { r: [[...SAVA_DUNAV, ...TIMOK, [22.42, 43.6], [22.2, 43.5], [21.95, 43.47], [21.75, 43.47], [21.5, 43.43], [21.25, 43.41], [21.0, 43.33], [20.8, 43.27], ...JZ_1833, ...DRINA]], na: [20.75, 44.0] },
    // Kneževina Srbija posle Berlinskog kongresa 1878 (+ Niški, Pirotski, Toplički i Vranjski okrug)
    srbija1878: { r: [[...SAVA_DUNAV, ...TIMOK, [22.55, 43.45], [22.77, 43.35], [22.72, 43.18], [22.62, 42.98], [22.48, 42.82], [22.35, 42.62], [22.2, 42.45], [21.95, 42.38], [21.75, 42.6], [21.5, 42.82], [21.25, 42.98], [21.0, 43.13], [20.8, 43.27], ...JZ_1833, ...DRINA]], na: [20.9, 43.9] },
    // samo krajevi oslobođeni 1877–1878 (za natpis)
    okruzi1878: { r: [[[22.42, 43.6], [22.55, 43.45], [22.77, 43.35], [22.72, 43.18], [22.62, 42.98], [22.48, 42.82], [22.35, 42.62], [22.2, 42.45], [21.95, 42.38], [21.75, 42.6], [21.5, 42.82], [21.25, 42.98], [21.0, 43.13], [20.8, 43.27], [21.0, 43.33], [21.25, 43.41], [21.5, 43.43], [21.75, 43.47], [21.95, 43.47], [22.2, 43.5]]], na: [21.85, 43.05] },
    // Kraljevina Srbija posle Balkanskih ratova (1913): današnja Srbija + Makedonija, bez Vojvodine i zapadne Metohije
    srbija1913: { d: ['SRB', 'MKD'], na: [21.0, 43.3] },
    // Vojvodina (Srem, Bačka, Banat sa rumunskim delom) – pod Habzburzima do 1918.
    vojvodina: { r: [[...SAVA_DUNAV.slice(0, 28).reverse(), [19.0, 44.95], [18.8, 45.05], [18.95, 45.5], [18.8, 45.9], [19.4, 46.2], [20.3, 46.25], [21.4, 46.25], [22.2, 45.6], [22.45, 45.0], [22.35, 44.68]]], na: [20.2, 45.5] },
    metohijaZapad: { r: [[[20.05, 42.76], [20.3, 42.86], [20.55, 42.8], [20.6, 42.55], [20.55, 42.33], [20.45, 42.24], [20.24, 42.34], [20.06, 42.55]]], na: [20.35, 42.55] },
    strumica: { r: [[[22.4, 41.6], [22.65, 41.66], [22.95, 41.62], [22.93, 41.36], [22.78, 41.33], [22.6, 41.3], [22.45, 41.4]]] },
    // Novopazarski sandžak (1878–1912)
    sandzak: { r: [[[19.19, 43.53], [19.5, 43.66], [19.75, 43.55], [20.05, 43.42], [20.3, 43.33], [20.6, 43.27], [20.75, 43.18], [20.65, 43.0], [20.45, 42.86], [20.25, 42.78], [20.0, 42.76], [19.85, 42.78], [19.65, 42.92], [19.4, 43.08], [19.15, 43.2], [18.95, 43.33], [19.04, 43.36], [18.95, 43.5]]], na: [19.85, 43.2] },
    // Crna Gora: posle Grahovca (1859), posle Berlinskog kongresa (1878), posle Balkanskih ratova (1913)
    cg1859: { r: [[[18.55, 42.62], [18.62, 42.74], [18.75, 42.8], [18.95, 42.74], [19.15, 42.74], [19.4, 42.76], [19.6, 42.7], [19.62, 42.56], [19.42, 42.5], [19.3, 42.52], [19.18, 42.45], [19.1, 42.3], [19.0, 42.24], [18.9, 42.28], [18.82, 42.36], [18.7, 42.45], [18.6, 42.5]]], na: [19.05, 42.6] },
    cg1878: { r: [[[18.5, 42.6], [18.7, 42.47], [18.84, 42.38], [18.98, 42.26], [19.03, 42.15], [19.2, 41.92], [19.36, 41.86], [19.4, 42.08], [19.33, 42.2], [19.4, 42.36], [19.58, 42.54], [19.75, 42.62], [19.85, 42.75], [19.65, 42.92], [19.4, 43.06], [19.15, 43.18], [18.95, 43.33], [18.85, 43.35], [18.67, 43.23], [18.62, 43.12], [18.62, 43.03], [18.46, 43.0], [18.47, 42.78], [18.55, 42.64]]], na: [19.1, 42.7] },
    cg1913: { d: ['MNE'], r: [[[20.05, 42.76], [20.3, 42.86], [20.55, 42.8], [20.6, 42.55], [20.55, 42.33], [20.45, 42.24], [20.24, 42.34], [20.06, 42.55]]], na: [19.3, 42.75] },
    boka: { r: [[[18.44, 42.56], [18.5, 42.6], [18.7, 42.47], [18.84, 42.38], [18.98, 42.26], [19.03, 42.15], [18.9, 42.1], [18.4, 42.4]]] },
    // Vojna krajina (Hrvatska, Slavonska i Banatska krajina) – pojas uz osmansku granicu, približno
    krajina: { r: [[[14.9, 44.3], [15.5, 44.35], [15.9, 44.6], [15.75, 45.0], [16.2, 45.2], [16.95, 45.25], [17.5, 45.12], [18.0, 45.15], [18.6, 45.05], [19.1, 44.9], [19.36, 44.9], ...SAVA_DUNAV.slice(1, 28), [22.4, 44.72], [22.35, 45.05], [21.8, 45.0], [21.3, 45.1], [20.8, 45.12], [20.4, 45.3], [20.0, 45.3], [19.6, 45.15], [19.1, 45.2], [18.5, 45.3], [17.8, 45.35], [17.1, 45.45], [16.4, 45.6], [15.8, 45.6], [15.5, 45.4], [15.25, 45.15], [15.0, 44.8], [14.75, 44.6]]], na: [16.3, 45.0] },
    // Habzburške zemlje van današnjih AUT/CZE/SVK/HUN/SVN/HRV
    galicija: { r: [[[18.85, 49.5], [18.9, 50.0], [19.4, 50.1], [20.4, 50.25], [21.6, 50.5], [22.6, 50.8], [23.5, 50.45], [24.1, 50.6], [24.9, 50.2], [26.0, 49.9], [26.3, 49.0], [26.0, 48.3], [24.8, 48.1], [23.0, 48.9], [22.0, 49.2], [20.2, 49.3], [19.0, 49.4]]], na: [23.0, 49.7] },
    erdelj: { r: [[[22.35, 44.68], [23.0, 45.3], [24.0, 45.45], [25.0, 45.4], [25.8, 45.5], [26.2, 45.6], [26.5, 46.0], [26.2, 46.6], [25.9, 47.3], [26.2, 47.75], [26.65, 48.25], [25.0, 48.3], [24.5, 48.2], [23.0, 48.9], [22.3, 49.0], [21.5, 48.5], [20.5, 46.6], [20.3, 46.2], [21.4, 46.25], [22.2, 45.6], [22.45, 45.0]]], na: [24.3, 46.6] },
    trentino: { r: [[[10.4, 46.8], [10.5, 46.0], [10.6, 45.8], [11.2, 45.75], [11.7, 46.0], [12.4, 46.6], [12.2, 47.0], [11.0, 47.0]]] },
    trst: { r: [[[13.35, 45.6], [13.45, 46.0], [13.75, 46.3], [13.9, 45.95], [13.9, 45.55]]] },
    lombardija: { r: [[[8.7, 45.6], [8.45, 46.45], [9.0, 46.5], [10.1, 46.6], [10.5, 46.4], [10.6, 45.8], [10.7, 45.4], [10.9, 45.0], [10.5, 44.95], [9.5, 45.0], [9.3, 45.1], [8.9, 45.3]]], na: [9.7, 45.6] },
    venecija: { r: [[[10.6, 45.8], [11.2, 45.75], [11.7, 46.0], [12.4, 46.6], [12.7, 46.65], [13.4, 46.5], [13.6, 46.0], [13.3, 45.7], [12.8, 45.3], [12.4, 45.0], [12.2, 45.0], [11.4, 45.05], [10.9, 45.0], [10.7, 45.4]]], na: [12.0, 45.7] },
    // Italija pre ujedinjenja
    pijemont: { r: [[[6.6, 45.1], [7.0, 45.9], [7.9, 46.0], [8.45, 46.45], [8.7, 45.6], [8.9, 45.3], [9.3, 45.1], [9.5, 45.0], [9.7, 44.4], [10.05, 44.1], [9.6, 43.9], [8.5, 43.9], [7.6, 43.7], [7.5, 43.8], [7.0, 44.2], [6.9, 44.6]], [[8.0, 38.8], [10.0, 38.8], [10.0, 41.32], [8.0, 41.32]]], na: [7.8, 45.0] },
    srednjaItalija: { r: [[[9.5, 45.0], [10.5, 44.95], [10.9, 45.0], [11.4, 45.05], [12.2, 45.0], [12.4, 44.6], [13.0, 43.9], [13.9, 42.9], [13.5, 42.8], [13.0, 42.65], [12.3, 42.7], [11.5, 42.45], [11.1, 42.4], [10.4, 43.0], [10.05, 44.1], [9.7, 44.4]]], na: [11.4, 43.6] },
    lacij: { r: [[[11.5, 42.45], [12.3, 42.7], [13.0, 42.65], [13.5, 42.2], [13.7, 41.7], [13.1, 41.25], [12.0, 41.6], [11.1, 42.4]]], na: [12.6, 42.0] },
    dveSicilije: { r: [[[13.1, 41.25], [13.7, 41.7], [13.5, 42.2], [13.0, 42.65], [13.5, 42.8], [13.9, 42.9], [16.0, 42.3], [19.0, 40.0], [17.0, 36.0], [11.5, 36.5], [11.8, 38.6], [14.5, 40.8]]], na: [15.7, 40.6] },
    // Nemačka
    nemackaIstok: { r: [[[14.6, 51.0], [15.0, 50.9], [16.3, 50.6], [17.0, 50.2], [18.0, 49.95], [18.9, 49.9], [19.3, 50.3], [18.4, 51.3], [18.0, 52.0], [18.5, 52.6], [19.5, 53.2], [21.0, 53.3], [22.8, 54.35], [22.8, 55.1], [21.2, 55.9], [14.1, 54.3], [14.3, 53.3], [14.7, 52.5]]] },
    alzasLorena: { r: [[[5.9, 49.45], [6.4, 49.47], [7.0, 49.15], [7.6, 49.05], [8.2, 48.97], [7.6, 47.6], [7.05, 47.5], [7.0, 48.3], [6.6, 48.7], [6.0, 48.9]]], na: [7.1, 48.6] },
    severnaNemacka: { r: [[[5.8, 50.1], [9.0, 50.1], [10.5, 50.3], [12.2, 50.3], [12.5, 50.1], [14.8, 50.8], [15.2, 51.5], [14.6, 54.5], [10.0, 55.2], [8.2, 55.2], [6.6, 53.7], [5.8, 52.0]]], na: [10.3, 52.4] },
    pruskaZapad: { r: [[[6.3, 49.1], [7.4, 49.2], [7.8, 50.0], [8.6, 51.0], [9.4, 51.6], [8.6, 52.5], [7.0, 52.3], [6.2, 51.8], [5.9, 50.7], [6.2, 49.6]]] },
    pruskaIstok: { r: [[[11.0, 51.4], [11.0, 52.9], [12.0, 53.2], [13.6, 53.5], [13.0, 54.45], [14.2, 54.1], [14.6, 53.4], [14.7, 51.5], [13.2, 51.6], [12.2, 51.3], [11.4, 51.0]]], na: [13.0, 52.6] },
    varsava1807: { r: [[[16.0, 53.1], [19.5, 53.2], [21.0, 53.3], [23.5, 54.0], [23.9, 53.0], [23.8, 51.6], [24.0, 50.5], [22.6, 50.3], [21.0, 50.4], [19.5, 50.2], [18.3, 51.0], [17.0, 51.7], [15.7, 52.3]]], na: [20.0, 52.0] },
    pruska1812: { r: [[[11.2, 52.9], [12.5, 54.5], [19.5, 54.5], [22.8, 55.1], [22.8, 54.3], [21.0, 53.3], [19.5, 53.2], [16.0, 53.1], [15.7, 52.3], [17.0, 51.7], [18.3, 51.0], [18.0, 50.0], [16.4, 50.4], [15.0, 50.9], [14.6, 51.5], [12.3, 52.0], [11.2, 52.4]]], na: [16.5, 53.4] },
    // Napoleonovo carstvo 1812 – delovi van današnje Francuske/Beneluksa
    hanza1811: { r: [[[6.0, 53.6], [10.9, 54.0], [10.6, 53.4], [8.5, 52.3], [7.0, 51.9], [6.8, 52.4]]] },
    zapadnaItalija1812: { r: [[[6.8, 46.4], [8.0, 46.1], [8.6, 45.3], [9.5, 45.0], [10.4, 44.9], [11.4, 44.2], [12.2, 43.7], [13.3, 42.9], [13.6, 41.9], [13.2, 41.25], [11.5, 42.0], [9.8, 44.0], [7.4, 43.6]]] },
    ilirija: { r: [[[13.4, 46.3], [14.6, 46.5], [15.6, 46.0], [16.2, 45.5], [16.95, 45.25], [16.2, 45.2], [15.75, 45.0], [15.9, 44.6], [16.3, 44.0], [17.3, 43.4], [18.2, 42.8], [18.7, 42.4], [18.9, 42.1], [15.0, 43.0], [13.5, 45.0]]], na: [15.0, 45.6] },
    italija1812: { r: [[[8.6, 46.1], [9.0, 45.2], [9.6, 44.9], [10.4, 44.9], [11.4, 44.2], [12.2, 43.7], [13.3, 42.9], [14.0, 42.7], [13.0, 45.6], [13.6, 45.95], [13.0, 46.6], [10.5, 46.6]]], na: [11.2, 45.4] },
    napulj1812: { r: [[[13.2, 41.25], [13.6, 41.9], [14.1, 42.7], [16.5, 41.9], [18.6, 40.2], [16.7, 38.4], [15.6, 38.0], [15.4, 40.0]]], na: [15.8, 40.8] },
    // Osmansko carstvo na Balkanu južno od Save i Dunava (pre 1830)
    osmBalkan: { d: ['BIH', 'GRC', 'ALB', 'MKD', 'BGR'], r: [[...SAVA_DUNAV, ...DUNAV_ISTOK, [30.5, 45.0], [30.0, 41.2], [26.0, 40.0], [23.0, 37.5], [20.0, 39.0], [19.0, 40.5], [18.9, 42.0], [19.2, 43.0], [19.3, 44.0], [19.36, 44.9]]], na: [23.0, 42.4] },
    osmAzija: { d: ['TUR', 'SYR', 'IRQ', 'LBN', 'ISR', 'PSX', 'JOR', 'EGY', 'LBY', 'KWT', 'CYP'], r: [[[34.9, 29.4], [36.5, 29.8], [38.6, 27.2], [40.5, 24.2], [41.8, 20.6], [43.1, 17.0], [42.0, 16.0], [40.0, 19.5], [38.2, 23.0], [36.4, 26.0], [35.0, 28.0]]], na: [33.5, 39.2] },
    // Turska u Evropi posle 1913 (istočna Trakija) – deo današnje TUR
    istocnaTrakija: { r: [[[26.0, 40.5], [26.6, 41.0], [26.35, 41.75], [27.5, 42.1], [28.1, 42.0], [29.3, 41.2], [28.9, 40.9]]] },
    // Bugarska
    rumelija: { r: [[[24.0, 42.5], [24.4, 42.68], [25.0, 42.75], [26.0, 42.78], [27.0, 42.88], [28.0, 42.88], [28.2, 42.0], [27.4, 41.95], [26.4, 41.78], [25.5, 41.85], [24.8, 41.7], [24.3, 41.85], [24.0, 42.1]]], na: [25.4, 42.3] },
    pirin: { r: [[[22.85, 42.1], [23.6, 42.15], [24.1, 41.75], [23.9, 41.4], [22.95, 41.35]]] },
    sanStefano: { d: ['BGR', 'MKD'], r: [[[20.5, 41.3], [20.75, 40.6], [21.3, 40.65], [22.3, 41.1], [23.0, 41.0], [23.7, 40.75], [24.4, 40.9], [25.0, 40.95], [25.6, 41.4], [26.3, 41.75], [26.3, 42.3], [23.0, 42.2], [21.0, 41.8]]], na: [24.5, 42.4] },
    zapadnaTrakija: { r: [[[24.0, 41.55], [24.4, 40.95], [25.0, 40.9], [26.05, 40.75], [26.35, 41.25], [26.1, 41.7], [25.0, 41.6]]] },
    juznaDobrudza: { r: [[[26.3, 44.0], [27.3, 44.13], [28.7, 43.75], [28.6, 43.38], [28.1, 43.35], [27.1, 43.6], [26.3, 43.8]]] },
    // Grčka do 1912 (deo današnje Grčke koji je tada još bio osmanski)
    grckaSever: { r: [[[19.9, 39.8], [20.5, 39.25], [21.0, 39.15], [21.3, 39.5], [22.0, 39.9], [22.65, 39.95], [23.5, 40.0], [24.5, 40.4], [26.7, 40.6], [26.7, 41.8], [22.0, 41.2], [20.6, 40.9], [20.0, 40.2]]] },
    // Amerika
    kolonije13: { r: [[[-67.8, 47.1], [-69.2, 47.4], [-71.1, 45.3], [-74.7, 45.0], [-76.3, 44.2], [-79.2, 43.4], [-79.8, 42.2], [-80.5, 42.0], [-80.5, 39.7], [-81.0, 38.6], [-80.3, 37.5], [-81.7, 36.6], [-83.0, 35.2], [-84.3, 34.5], [-83.4, 32.6], [-82.2, 30.6], [-81.4, 30.7], [-75.0, 35.0], [-70.0, 41.0], [-66.8, 44.8]]], na: [-77.5, 39.5] },
    sad1783: { r: [[[-67.8, 47.1], [-69.2, 47.4], [-71.1, 45.3], [-74.7, 45.0], [-76.3, 44.2], [-79.2, 43.4], [-79.0, 42.8], [-82.5, 41.7], [-83.1, 42.3], [-82.4, 43.0], [-82.5, 45.3], [-84.5, 46.5], [-89.6, 48.0], [-95.2, 49.0], [-95.2, 47.2], [-91.2, 43.5], [-90.6, 41.5], [-90.2, 38.6], [-89.2, 37.0], [-90.0, 35.1], [-91.2, 32.3], [-91.6, 31.0], [-87.6, 31.0], [-85.0, 31.0], [-82.0, 30.6], [-81.4, 30.7], [-75.0, 35.0], [-70.0, 41.0], [-66.8, 44.8]]], na: [-84.0, 38.0] },
    konfederacija: { r: [[[-75.3, 38.0], [-77.0, 38.9], [-77.7, 39.3], [-78.3, 39.2], [-79.5, 38.4], [-80.3, 37.6], [-81.9, 37.4], [-82.6, 37.2], [-83.7, 36.6], [-89.5, 36.5], [-90.1, 36.0], [-94.6, 36.5], [-94.5, 33.6], [-100.0, 34.56], [-100.0, 36.5], [-103.0, 36.5], [-103.0, 32.0], [-106.6, 32.0], [-104.5, 29.6], [-103.0, 29.0], [-101.4, 29.8], [-99.5, 27.5], [-97.2, 25.9], [-90.0, 28.0], [-80.0, 24.0], [-79.5, 27.0], [-75.0, 35.0]]], na: [-88.0, 33.0] },
  };

  const linije = {
    napoleonMoskva: [[23.9, 54.9], [25.28, 54.69], [27.6, 54.9], [30.2, 55.2], [32.05, 54.78], [34.3, 55.2], [35.82, 55.52], [37.62, 55.75]],
    napoleonPovlacenje: [[37.62, 55.75], [36.46, 55.01], [34.3, 55.0], [32.05, 54.6], [30.4, 54.5], [28.5, 54.23], [25.28, 54.5], [23.9, 54.75]],
    garibaldi: [[8.93, 44.41], [9.6, 43.2], [11.13, 42.56], [11.6, 40.0], [12.44, 37.8], [13.36, 38.12], [15.55, 38.19], [15.65, 38.1], [16.2, 39.3], [15.4, 40.3], [14.25, 40.85]],
    zapadniFront: [[2.75, 51.14], [2.88, 50.85], [2.78, 50.29], [2.9, 49.95], [3.0, 49.58], [3.32, 49.38], [4.03, 49.26], [4.9, 49.2], [5.38, 49.16], [5.54, 48.9], [6.2, 48.75], [6.9, 48.4], [7.1, 48.0], [7.15, 47.5]],
    solunskiFront: [[20.6, 40.75], [21.0, 40.9], [21.33, 41.06], [21.6, 41.05], [21.8, 40.98], [21.95, 41.08], [22.3, 41.13], [22.73, 41.2], [23.1, 41.28], [23.5, 41.1], [23.85, 40.8]],
    proboj1918: [[21.95, 41.1], [21.85, 41.45], [21.6, 41.8], [21.43, 42.0], [21.75, 42.35], [21.9, 42.55], [21.9, 43.32], [21.3, 43.85], [20.91, 44.02], [20.46, 44.8]],
    golgotaKosovo: [[21.16, 42.66], [20.74, 42.21], [20.2, 42.15], [19.51, 42.07], [19.45, 41.32], [19.49, 40.47]],
    golgotaCG: [[20.29, 42.66], [19.87, 42.73], [19.6, 42.6], [19.26, 42.44], [19.51, 42.07]],
    golgotaMore: [[19.49, 40.47], [19.45, 40.0], [19.92, 39.62]],
    velikaSeoba: [[20.29, 42.66], [21.16, 42.66], [21.9, 43.32], [21.3, 43.9], [20.46, 44.82], [19.85, 45.25], [19.07, 47.67]],
    hiljaduKm: [[-2.98, 53.41], [-2.24, 53.48]],
    stokton: [[-1.31, 54.57], [-1.55, 54.52]],
  };

  // boje sila (iste na svim kartama)
  const B = {
    osm: '#c0504d', osm2: '#e08a7e', hab: '#c99a2e', srb: '#3d7fd9', srb2: '#86b5ef', cg: '#20a88f', rus: '#5a8f3c', bug: '#8e6bd1', grc: '#e07fb4',
    rum: '#e6913a', alb: '#8d6e63', fra: '#2f5fb3', fra2: '#7fa6e6', gb: '#c8453b', nem: '#6d6d6d', ita: '#53a653', esp: '#d6b84a', sad: '#3d7fd9', neu: '#56708c',
  };

  const OSM_BALKAN = { o: 'osmBalkan', boja: B.osm, kljuc: 'osmanlije' };
  const HAB = (kljuc = 'habzburzi', natpis) => [
    { d: ['AUT', 'CZE', 'SVK', 'HUN', 'SVN', 'HRV'], r: [oblasti.galicija.r[0], oblasti.erdelj.r[0], oblasti.vojvodina.r[0], oblasti.trentino.r[0], oblasti.trst.r[0]], boja: B.hab, kljuc, natpis, na: [17.5, 47.2] },
  ];

  const karte = {
    // Beogradski pašaluk i Srbija 1833 (Prvi i Drugi ustanak, hatišerifi)
    'srbija-1833': {
      kutija: [18.6, 42.6, 23.3, 45.6], reke: ['Dunav', 'Sava', 'Drina', 'Morava'],
      slojevi: [OSM_BALKAN, ...HAB('habzburzi', 'Habzburška monarhija'), { d: ['ROU'], boja: B.rum, kljuc: 'vlaska', natpis: 'Vlaška', na: [22.9, 45.0] },
        { o: 'srbija1833', boja: B.srb2, kljuc: 'srbija1833' }, { o: 'pasaluk', boja: B.srb, kljuc: 'pasaluk' }],
      natpisi: [{ lon: 21.6, lat: 43.1, t: 'Osmansko carstvo', vel: 'm' }],
      legenda: [[B.srb, 'Beogradski pašaluk'], [B.srb2, 'pripojeno 1833.'], [B.osm, 'Osmansko carstvo'], [B.hab, 'Habzburška monarhija']],
    },
    // Srbija posle Berlinskog kongresa
    'srbija-1878': {
      kutija: [18.4, 41.6, 23.4, 45.4], reke: ['Dunav', 'Sava', 'Drina', 'Morava'],
      slojevi: [OSM_BALKAN, { d: ['BGR'], boja: B.bug, kljuc: 'bugarska', natpis: 'Bugarska', na: [22.95, 42.65] }, ...HAB('habzburzi', 'Austrougarska'), { d: ['BIH'], boja: B.hab, kljuc: 'bih', natpis: 'BiH', na: [18.6, 44.2] },
        { d: ['ROU'], boja: B.rum, kljuc: 'rumunija', natpis: 'Rumunija', na: [22.85, 45.0] }, { o: 'sandzak', boja: B.osm2, kljuc: 'sandzak' },
        { o: 'cg1878', boja: B.cg, kljuc: 'cg' }, { o: 'srbija1878', boja: B.srb2, kljuc: 'okruzi' }, { o: 'srbija1833', boja: B.srb, kljuc: 'srbija1833' }],
      legenda: [[B.srb, 'Srbija do 1878.'], [B.srb2, 'oslobođeno 1878.'], [B.cg, 'Crna Gora'], [B.osm, 'Osmansko carstvo'], [B.hab, 'Austrougarska']],
    },
    // Balkan posle Berlinskog kongresa
    'balkan-1878': {
      kutija: [13.5, 38.0, 30.0, 47.5], reke: ['Dunav', 'Sava'],
      slojevi: [OSM_BALKAN, { d: ['GRC'], boja: B.grc, kljuc: 'grcka', natpis: 'Grčka', na: [22.0, 38.9] }, { o: 'grckaSever', boja: B.osm },
        ...HAB('austrougarska', 'Austrougarska'), { d: ['BIH'], boja: B.hab, kljuc: 'bih', natpis: 'BiH' }, { d: ['ROU'], boja: B.rum, kljuc: 'rumunija', natpis: 'Rumunija', na: [25.5, 44.6] },
        { o: 'erdelj', boja: B.hab }, { d: ['BGR'], boja: B.bug, kljuc: 'bugarska', natpis: 'Bugarska', na: [25.3, 43.3] }, { o: 'pirin', boja: B.osm },
        { o: 'rumelija', boja: B.osm2, kljuc: 'rumelija', natpis: 'Rumelija', vel: 'm' }, { o: 'sandzak', boja: B.osm2, kljuc: 'sandzak' },
        { o: 'cg1878', boja: B.cg, kljuc: 'cg' }, { o: 'srbija1878', boja: B.srb, kljuc: 'srbija', natpis: 'Srbija', na: [21.0, 43.8] }],
      natpisi: [{ lon: 21.6, lat: 41.4, t: 'Osmansko carstvo', vel: 'm' }],
      legenda: [[B.srb, 'Srbija'], [B.cg, 'Crna Gora'], [B.bug, 'Bugarska'], [B.osm, 'Osmansko carstvo'], [B.osm2, 'autonomne oblasti'], [B.hab, 'Austrougarska']],
    },
    // Sanstefanska Bugarska (mart 1878)
    'san-stefano': {
      kutija: [18.0, 38.5, 30.0, 46.5], reke: ['Dunav'],
      slojevi: [OSM_BALKAN, { d: ['GRC'], boja: B.grc, kljuc: 'grcka', natpis: 'Grčka', na: [22.0, 38.9] }, { o: 'grckaSever', boja: B.osm }, ...HAB(), { d: ['BIH'], boja: B.osm },
        { d: ['ROU'], boja: B.rum, natpis: 'Rumunija', na: [25.5, 44.6] }, { o: 'erdelj', boja: B.hab },
        { o: 'sanStefano', boja: B.bug, kljuc: 'bugarska', natpis: 'Velika Bugarska' }, { o: 'cg1878', boja: B.cg }, { o: 'srbija1878', boja: B.srb, natpis: 'Srbija', na: [21.0, 43.8] }],
      legenda: [[B.bug, 'Sanstefanska Bugarska'], [B.srb, 'Srbija'], [B.osm, 'Osmansko carstvo']],
    },
    // Balkan pred Balkanske ratove (1912)
    'balkan-1912': {
      kutija: [17.5, 38.5, 29.5, 46.0], reke: ['Dunav', 'Sava'],
      slojevi: [OSM_BALKAN, { d: ['GRC'], boja: B.grc, kljuc: 'grcka', natpis: 'Grčka', na: [22.0, 38.9] }, { o: 'grckaSever', boja: B.osm },
        ...HAB('austrougarska', 'Austrougarska'), { d: ['BIH'], boja: B.hab, kljuc: 'bih' }, { d: ['ROU'], boja: B.rum, kljuc: 'rumunija', natpis: 'Rumunija', na: [25.5, 44.6] }, { o: 'erdelj', boja: B.hab },
        { d: ['BGR'], boja: B.bug, kljuc: 'bugarska', natpis: 'Bugarska', na: [25.3, 42.9] }, { o: 'pirin', boja: B.osm }, { o: 'sandzak', boja: B.osm },
        { o: 'cg1878', boja: B.cg, kljuc: 'cg' }, { o: 'srbija1878', boja: B.srb, kljuc: 'srbija', natpis: 'Srbija', na: [21.0, 43.8] }],
      natpisi: [{ lon: 21.3, lat: 41.6, t: 'Osmansko carstvo', vel: 'm' }],
      legenda: [[B.srb, 'Srbija'], [B.cg, 'Crna Gora'], [B.bug, 'Bugarska'], [B.grc, 'Grčka'], [B.osm, 'Osmansko carstvo']],
    },
    // Balkan posle Bukureštanskog mira (1913)
    'balkan-1913': {
      kutija: [17.5, 38.5, 29.5, 46.0], reke: ['Dunav', 'Sava'],
      slojevi: [{ d: ['TUR'], boja: B.osm, kljuc: 'osmanlije' }, { d: ['GRC'], boja: B.grc, kljuc: 'grcka', natpis: 'Grčka', na: [22.0, 39.5] },
        ...HAB('austrougarska', 'Austrougarska'), { d: ['BIH'], boja: B.hab, kljuc: 'bih' }, { d: ['ROU'], boja: B.rum, kljuc: 'rumunija', natpis: 'Rumunija', na: [25.5, 44.6] }, { o: 'erdelj', boja: B.hab },
        { d: ['BGR'], boja: B.bug, kljuc: 'bugarska', natpis: 'Bugarska', na: [25.3, 42.9] },
        { o: 'zapadnaTrakija', boja: B.bug, kljuc: 'trakija' }, { o: 'juznaDobrudza', boja: B.rum, kljuc: 'dobrudza' }, { o: 'istocnaTrakija', boja: B.osm },
        { d: ['ALB'], boja: B.alb, kljuc: 'albanija', natpis: 'Albanija', vel: 'm', na: [20.0, 40.9] },
        { o: 'srbija1913', boja: B.srb, kljuc: 'srbija', natpis: 'Srbija' }, { o: 'vojvodina', boja: B.hab }, { o: 'strumica', boja: B.bug },
        { o: 'cg1913', boja: B.cg, kljuc: 'cg' }],
      legenda: [[B.srb, 'Srbija'], [B.cg, 'Crna Gora'], [B.bug, 'Bugarska'], [B.grc, 'Grčka'], [B.alb, 'Albanija'], [B.osm, 'Osmansko carstvo']],
    },
    // Crna Gora kroz XIX vek
    'crna-gora': {
      kutija: [18.2, 41.7, 20.9, 43.65], reke: ['Drina'],
      slojevi: [{ d: ['ALB', 'SRB', 'MNE'], r: [oblasti.metohijaZapad.r[0]], boja: B.osm, kljuc: 'osmanlije' }, { d: ['BIH', 'HRV'], boja: B.hab, kljuc: 'austrija' }, { o: 'boka', boja: B.hab },
        { o: 'cg1878', boja: '#7fd3c1', kljuc: 'cg1878' }, { o: 'cg1859', boja: B.cg, kljuc: 'cg1859' }],
      legenda: [[B.cg, 'Crna Gora 1859.'], ['#7fd3c1', 'proširenje 1878.'], [B.osm, 'Osmansko carstvo'], [B.hab, 'Austrija']],
    },
    'crna-gora-1913': {
      kutija: [18.2, 41.7, 21.2, 43.65], reke: ['Drina'],
      slojevi: [{ d: ['ALB'], boja: B.alb, natpis: 'Albanija', vel: 'm', na: [20.0, 41.9] }, { d: ['SRB', 'MKD'], boja: B.srb, kljuc: 'srbija' }, { d: ['BIH', 'HRV'], boja: B.hab }, { o: 'boka', boja: B.hab },
        { o: 'cg1913', boja: '#7fd3c1', kljuc: 'cg1913' }, { o: 'cg1878', boja: B.cg, kljuc: 'cg1878' }],
      legenda: [[B.cg, 'Crna Gora do 1912.'], ['#7fd3c1', 'pripojeno 1912–1913.'], [B.srb, 'Srbija'], [B.hab, 'Austrougarska']],
    },
    // Vojna krajina
    'vojna-krajina': {
      kutija: [13.5, 43.3, 23.5, 47.6], reke: ['Dunav', 'Sava', 'Drina'],
      slojevi: [OSM_BALKAN, ...HAB('habzburzi', 'Habzburška monarhija'), { d: ['ROU'], boja: B.rum }, { o: 'erdelj', boja: B.hab }, { o: 'krajina', boja: '#e8c766', kljuc: 'krajina' }],
      legenda: [['#e8c766', 'Vojna krajina'], [B.hab, 'Habzburška monarhija'], [B.osm, 'Osmansko carstvo']],
    },
    // Srbi u Habzburškoj monarhiji – Vojvodina
    vojvodina: {
      kutija: [14.0, 43.4, 23.5, 47.6], reke: ['Dunav', 'Sava', 'Tisa', 'Drina'],
      slojevi: [OSM_BALKAN, ...HAB('habzburzi'), { d: ['ROU'], boja: B.rum }, { o: 'erdelj', boja: B.hab }, { o: 'srbija1833', boja: B.srb, kljuc: 'srbija', natpis: 'Srbija' }, { o: 'vojvodina', boja: '#e8c766', kljuc: 'vojvodina' }],
      legenda: [['#e8c766', 'Srem, Bačka i Banat'], [B.hab, 'Habzburška monarhija'], [B.srb, 'Kneževina Srbija'], [B.osm, 'Osmansko carstvo']],
    },
    // Osmansko carstvo oko 1800.
    'osmansko-carstvo': {
      kutija: [8, 12, 52, 50],
      slojevi: [{ d: ['RUS', 'UKR', 'BLR', 'MDA'], boja: B.rus, kljuc: 'rusija', natpis: 'Rusija', na: [36, 49] }, ...HAB('habzburzi'), { o: 'osmBalkan', boja: B.osm, kljuc: 'osmanlije' }, { o: 'osmAzija', boja: B.osm, kljuc: 'osmanlije' },
        { d: ['ROU'], boja: B.osm2, kljuc: 'vazali' }, { o: 'erdelj', boja: B.hab }, { d: ['TUN', 'DZA'], boja: B.osm2, kljuc: 'vazali' }],
      legenda: [[B.osm, 'Osmansko carstvo'], [B.osm2, 'vazalne oblasti'], [B.hab, 'Habzburška monarhija'], [B.rus, 'Rusija']],
    },
    // Evropa 1812. – Napoleonovo carstvo
    'evropa-1812': {
      kutija: [-11, 35.5, 40, 60],
      slojevi: [{ d: ['RUS', 'UKR', 'BLR', 'LTU', 'LVA', 'EST', 'FIN', 'MDA'], boja: B.neu, kljuc: 'rusija', natpis: 'Rusija', na: [33, 53] }, { d: ['GBR', 'IRL', 'PRT', 'SWE', 'NOR', 'DNK'], boja: B.neu, kljuc: 'protivnici' },
        { d: ['TUR', 'GRC', 'BGR', 'ALB', 'MKD', 'SRB', 'BIH', 'MNE', 'ROU'], boja: '#7d7468' },
        { d: ['AUT', 'CZE', 'SVK', 'HUN', 'HRV', 'SVN'], r: [oblasti.galicija.r[0], oblasti.erdelj.r[0]], boja: '#a99bd6', kljuc: 'austrija', natpis: 'Austrija', na: [17.5, 47.6] },
        { d: ['ESP', 'DEU', 'CHE', 'POL', 'ITA'], boja: B.fra2, kljuc: 'zavisne' }, { o: 'pruska1812', boja: '#a99bd6', kljuc: 'pruska', natpis: 'Pruska', vel: 'm' },
        { d: ['FRA', 'BEL', 'NLD', 'LUX'], r: [oblasti.hanza1811.r[0], oblasti.zapadnaItalija1812.r[0], oblasti.ilirija.r[0]], boja: B.fra, kljuc: 'francuska', natpis: 'Francusko carstvo', na: [2.5, 46.8] }],
      natpisi: [{ lon: 20.0, lat: 52.2, t: 'Varš. voj.', vel: 'm' }, { lon: -3.8, lat: 40.2, t: 'Španija', vel: 'm' }],
      legenda: [[B.fra, 'Francusko carstvo'], [B.fra2, 'zavisne države'], ['#a99bd6', 'prisilni saveznici'], [B.neu, 'protivnici']],
    },
    // Ujedinjenje Italije
    italija: {
      kutija: [6.0, 36.4, 19.0, 47.2],
      slojevi: [{ d: ['FRA', 'CHE'], boja: B.neu }, { d: ['AUT', 'SVN', 'HRV'], r: [oblasti.trentino.r[0]], boja: B.hab, kljuc: 'austrija', natpis: 'Austrija', na: [14.5, 47.0] },
        { o: 'pijemont', boja: '#2e7d32', kljuc: 'pijemont', natpis: 'Pijemont', vel: 'm' }, { o: 'lombardija', boja: '#66bb6a', kljuc: 'lombardija' },
        { o: 'srednjaItalija', boja: '#a5d6a7', kljuc: 'srednja' }, { o: 'dveSicilije', boja: '#c5e1a5', kljuc: 'jug', natpis: 'Dve Sicilije', vel: 'm' },
        { o: 'venecija', boja: '#fdd835', kljuc: 'venecija' }, { o: 'lacij', boja: '#ffb74d', kljuc: 'rim' }],
      natpisi: [{ lon: 12.48, lat: 41.9, t: 'Rim', vel: 'm' }],
      legenda: [['#2e7d32', 'Pijemont-Sardinija'], ['#66bb6a', '1859.'], ['#a5d6a7', '1860.'], ['#c5e1a5', '1860. (Garibaldi)'], ['#fdd835', '1866.'], ['#ffb74d', '1870.']],
    },
    // Ujedinjenje Nemačke
    nemacka: {
      kutija: [2.5, 45.6, 24.5, 56.2],
      slojevi: [{ d: ['RUS', 'POL', 'LTU', 'BLR', 'UKR'], boja: B.rus, kljuc: 'rusija' },
        { d: ['DEU'], boja: '#ffcc80', kljuc: 'jug', natpis: 'južne države', vel: 'm', na: [10.6, 48.7] }, { o: 'severnaNemacka', boja: '#9fa8da', kljuc: 'sever' },
        { o: 'pruskaZapad', boja: '#3f51b5', kljuc: 'pruska' }, { o: 'pruskaIstok', boja: '#3f51b5', kljuc: 'pruska' }, { o: 'nemackaIstok', boja: '#3f51b5', kljuc: 'pruska', natpis: 'Pruska', na: [19.0, 53.7] },
        { d: ['AUT', 'CZE', 'SVK', 'HUN', 'SVN'], r: [oblasti.galicija.r[0]], boja: B.hab, kljuc: 'austrija', natpis: 'Austrija', na: [15.5, 48.0] },
        { d: ['FRA', 'BEL', 'NLD', 'LUX', 'CHE', 'DNK'], boja: B.neu }, { o: 'alzasLorena', boja: '#e57373', kljuc: 'alzas' }],
      legenda: [['#3f51b5', 'Pruska'], ['#9fa8da', 'Severnonemački savez 1867.'], ['#ffcc80', 'pripojeno 1871.'], ['#e57373', 'Alzas i Lorena']],
    },
    // Severna Amerika
    'kolonije-13': {
      kutija: [-100, 24, -60, 50],
      slojevi: [{ d: ['USA', 'MEX'], boja: '#b38b5d', kljuc: 'spanija' }, { d: ['CAN'], boja: B.gb, kljuc: 'britanija', natpis: 'Britanska Kanada', vel: 'm', na: [-78, 48.5] }, { o: 'kolonije13', boja: B.sad, kljuc: 'kolonije' }],
      legenda: [[B.sad, '13 kolonija'], [B.gb, 'Britanska Kanada'], ['#b38b5d', 'druge oblasti']],
    },
    'sad-1783': {
      kutija: [-110, 24, -60, 50],
      slojevi: [{ d: ['USA', 'MEX'], boja: '#d6b84a', kljuc: 'spanija', natpis: 'Španija', vel: 'm', na: [-100, 38] }, { d: ['CAN'], boja: B.gb, kljuc: 'britanija', natpis: 'Britanija', vel: 'm', na: [-80, 48.5] },
        { o: 'sad1783', boja: '#82b1ff', kljuc: 'sad' }, { o: 'kolonije13', boja: B.sad, kljuc: 'kolonije' }],
      legenda: [[B.sad, '13 država'], ['#82b1ff', 'teritorija SAD 1783.'], ['#d6b84a', 'Španija'], [B.gb, 'Britanija']],
    },
    'gradjanski-rat': {
      kutija: [-125, 24, -65, 50],
      slojevi: [{ d: ['MEX', 'CAN'], boja: B.neu }, { d: ['USA'], boja: '#3d6fc4', kljuc: 'unija', natpis: 'Unija', na: [-95, 43] }, { o: 'konfederacija', boja: '#9e9e9e', kljuc: 'konfederacija', natpis: 'Konfederacija' }],
      legenda: [['#3d6fc4', 'Unija (Sever)'], ['#9e9e9e', 'Konfederacija (Jug)']],
    },
    // Kolonijalna podela Afrike i sveta pred Prvi svetski rat (1914) – po današnjim državama, približno
    'afrika-1914': {
      kutija: [-20, -36, 53, 38],
      slojevi: [
        { d: ['EGY', 'SDN', 'SDS', 'UGA', 'KEN', 'ZAF', 'LSO', 'SWZ', 'BWA', 'ZWE', 'ZMB', 'MWI', 'NGA', 'GHA', 'SLE', 'GMB', 'SOL'], boja: '#c8453b', kljuc: 'britanija' },
        { d: ['DZA', 'TUN', 'MAR', 'MRT', 'MLI', 'NER', 'TCD', 'SEN', 'GIN', 'CIV', 'BFA', 'BEN', 'CAF', 'COG', 'GAB', 'MDG', 'DJI', 'COM'], boja: '#3d6fc4', kljuc: 'francuska' },
        { d: ['NAM', 'CMR', 'TGO', 'TZA', 'RWA', 'BDI'], boja: '#555', kljuc: 'nemacka' },
        { d: ['COD'], boja: '#e6c229', kljuc: 'belgija' }, { d: ['AGO', 'MOZ', 'GNB'], boja: '#2e9e5b', kljuc: 'portugal' },
        { d: ['LBY', 'ERI', 'SOM'], boja: '#8bc34a', kljuc: 'italija' }, { d: ['SAH', 'GNQ'], boja: '#e69138', kljuc: 'spanija' },
        { d: ['ETH', 'LBR'], boja: '#ffffff', kljuc: 'nezavisne' }],
      legenda: [['#c8453b', 'Britanija'], ['#3d6fc4', 'Francuska'], ['#555', 'Nemačka'], ['#e6c229', 'Belgija'], ['#2e9e5b', 'Portugal'], ['#8bc34a', 'Italija'], ['#e69138', 'Španija'], ['#ffffff', 'nezavisne']],
    },
    'svet-1914': {
      kutija: [-170, -58, 180, 80],
      slojevi: [
        { d: ['CAN', 'AUS', 'NZL', 'IND', 'PAK', 'BGD', 'MMR', 'LKA', 'MYS', 'GUY', 'GBR', 'IRL', 'EGY', 'SDN', 'SDS', 'UGA', 'KEN', 'ZAF', 'LSO', 'SWZ', 'BWA', 'ZWE', 'ZMB', 'MWI', 'NGA', 'GHA', 'SLE', 'GMB', 'SOL', 'JAM', 'BHS'], boja: '#c8453b', kljuc: 'britanija' },
        { d: ['FRA', 'DZA', 'TUN', 'MAR', 'MRT', 'MLI', 'NER', 'TCD', 'SEN', 'GIN', 'CIV', 'BFA', 'BEN', 'CAF', 'COG', 'GAB', 'MDG', 'DJI', 'VNM', 'LAO', 'KHM'], boja: '#3d6fc4', kljuc: 'francuska' },
        { d: ['RUS', 'KAZ', 'UZB', 'TKM', 'KGZ', 'TJK', 'FIN', 'UKR', 'BLR', 'LTU', 'LVA', 'EST', 'GEO', 'ARM', 'AZE'], boja: '#5a8f3c', kljuc: 'rusija' },
        { d: ['DEU', 'NAM', 'CMR', 'TGO', 'TZA', 'RWA', 'BDI', 'PNG'], boja: '#555', kljuc: 'nemacka' },
        { d: ['USA', 'PHL'], boja: '#82b1ff', kljuc: 'sad' }, { d: ['JPN', 'KOR', 'PRK', 'TWN'], boja: '#f48fb1', kljuc: 'japan' },
        { d: ['NLD', 'IDN', 'SUR'], boja: '#ff9800', kljuc: 'holandija' }, { d: ['BEL', 'COD'], boja: '#e6c229', kljuc: 'belgija' },
        { d: ['PRT', 'AGO', 'MOZ', 'GNB'], boja: '#2e9e5b', kljuc: 'portugal' }, { d: ['ITA', 'LBY', 'ERI', 'SOM'], boja: '#8bc34a', kljuc: 'italija' }],
      legenda: [['#c8453b', 'Britanija'], ['#3d6fc4', 'Francuska'], ['#5a8f3c', 'Rusija'], ['#555', 'Nemačka'], ['#82b1ff', 'SAD'], ['#f48fb1', 'Japan'], ['#ff9800', 'Holandija'], ['#2e9e5b', 'Portugal']],
    },
    // Evropa 1914 – savezi
    'evropa-1914': {
      kutija: [-11, 34, 45, 62],
      slojevi: [{ d: ['ESP', 'PRT', 'CHE', 'NLD', 'DNK', 'NOR', 'SWE', 'GRC', 'ROU', 'BGR', 'ALB'], boja: B.neu },
        { d: ['RUS', 'UKR', 'BLR', 'LTU', 'LVA', 'EST', 'FIN', 'MDA', 'POL'], boja: B.rus, kljuc: 'rusija', natpis: 'Rusija', na: [35, 54] },
        { d: ['FRA', 'GBR', 'IRL', 'BEL'], boja: '#2f6fb3', kljuc: 'antanta' }, { d: ['ITA'], boja: '#9ccc65', kljuc: 'italija' },
        { d: ['TUR', 'SYR', 'IRQ'], boja: '#a1887f', kljuc: 'osmanlije' },
        { d: ['DEU'], r: [oblasti.nemackaIstok.r[0], oblasti.alzasLorena.r[0]], boja: '#555', kljuc: 'nemacka', natpis: 'Nemačka', na: [10.2, 51.2] },
        ...HAB('austrougarska', 'Austrougarska'), { d: ['BIH'], boja: B.hab, kljuc: 'austrougarska' },
        { o: 'srbija1913', boja: '#2fb3a5', kljuc: 'srbija' }, { o: 'vojvodina', boja: B.hab }, { d: ['MNE'], boja: '#2fb3a5', kljuc: 'cg' }],
      natpisi: [{ lon: 2.5, lat: 46.8, t: 'Francuska', vel: 'm' }, { lon: -1.8, lat: 52.7, t: 'V. Britanija', vel: 'm' }],
      legenda: [['#2f6fb3', 'Antanta'], [B.rus, 'Rusija (Antanta)'], ['#555', 'Nemačka'], [B.hab, 'Austrougarska'], ['#2fb3a5', 'Srbija i Crna Gora']],
    },
    'zapadni-front': {
      kutija: [-2.5, 46.0, 10.5, 52.6],
      slojevi: [{ d: ['FRA', 'GBR'], boja: '#2f6fb3', kljuc: 'francuska' }, { d: ['BEL'], boja: '#7fa6e6', kljuc: 'belgija' }, { d: ['NLD', 'CHE', 'LUX'], boja: B.neu },
        { d: ['DEU'], r: [oblasti.alzasLorena.r[0]], boja: '#666', kljuc: 'nemacka', natpis: 'Nemačka', na: [9.0, 50.5] }],
      linije: [{ l: 'zapadniFront', boja: '#ff5252', debljina: 6 }],
      natpisi: [{ lon: 2.4, lat: 47.5, t: 'Francuska', vel: 'm' }],
      legenda: [['#ff5252', 'linija fronta 1914–1918.']],
    },
    // Solunski front i Albanska golgota
    'solunski-front': {
      kutija: [18.5, 39.3, 24.5, 45.0], reke: ['Dunav', 'Sava', 'Morava'],
      slojevi: [{ d: ['GRC'], boja: B.grc, kljuc: 'grcka', natpis: 'Grčka', na: [22.3, 39.8] }, { d: ['ALB'], boja: B.alb, kljuc: 'albanija' }, { d: ['BGR'], boja: B.bug, kljuc: 'bugarska', natpis: 'Bugarska', na: [24.0, 42.8] },
        { d: ['ROU', 'HUN', 'HRV', 'BIH'], boja: B.hab }, { o: 'srbija1913', boja: '#5f7ea6', kljuc: 'srbija', natpis: 'okupirana Srbija' }, { o: 'vojvodina', boja: B.hab }, { o: 'cg1913', boja: '#5f9e94', kljuc: 'cg' }],
      linije: [{ l: 'solunskiFront', boja: '#ff5252', debljina: 6, isprekidana: true }],
      legenda: [['#ff5252', 'Solunski front']],
    },
    'albanska-golgota': {
      kutija: [18.3, 39.2, 22.5, 43.6],
      slojevi: [{ d: ['GRC'], boja: B.grc, natpis: 'Grčka', na: [21.5, 39.8] }, { d: ['ALB'], boja: B.alb, kljuc: 'albanija', natpis: 'Albanija', vel: 'm', na: [20.1, 40.9] }, { d: ['SRB', 'MKD', 'BGR'], boja: '#5f7ea6', kljuc: 'srbija' },
        { d: ['BIH', 'HRV'], boja: B.hab }, { o: 'cg1913', boja: B.cg, kljuc: 'cg' }],
      linije: [{ l: 'golgotaKosovo', boja: '#ffeb3b', strelica: true, debljina: 5 }, { l: 'golgotaCG', boja: '#ffeb3b', strelica: true, debljina: 5 }, { l: 'golgotaMore', boja: '#8fc6ff', isprekidana: true, debljina: 4 }],
      natpisi: [{ lon: 19.92, lat: 39.45, t: 'Krf', vel: 'm' }, { lon: 18.9, lat: 41.0, t: 'Jadransko more', more: true, vel: 'm' }],
    },
  };

  const podaci = { oblasti, linije, karte, boje: B };
  if (typeof window !== 'undefined') window.IstorijskeKarte = podaci;
  if (typeof module !== 'undefined') module.exports = podaci;
})();
