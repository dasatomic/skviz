// Scena3D – crtanje kugli i štapića (atomi, veze, elektroni, orbite) sa pravom dubinom po pikselu.
// Tehnika kao u 3Dmol.js / Mol*: „impostori“ – kugla i valjak su samo pravougaonik na ekranu, a fragment šejder
// za svaki piksel izračuna presek zraka sa telom (normala za osvetljenje + gl_FragDepth). Zato se veza nikad
// ne „probija“ kroz atom, preseci kugli su tačni, a ivice glatke (MSAA + alpha-to-coverage).
// Jedan zajednički WebGL2 kontekst služi sva platna (slika se prenosi drawImage-om u 2D platno medija, pa
// natpisi i efekti i dalje idu običnim canvas 2D crtanjem preko). Bez WebGL2 → rezerva: canvas 2D (slikarski
// algoritam, veze podeljene na polovine koje počinju u središtu svog atoma).
//
// Koordinate su u CSS pikselima platna: x desno, y dole, z od posmatrača (veće z = dalje), sve u istoj razmeri.
//   Scena3D.crtaj(g, w, h, {
//     kugle:  [{ x, y, z, r, boja, alfa? }],
//     valjci: [{ a: [x, y, z], b: [x, y, z], r, boja, boja2?, alfa?, ravno? }],   // boja2 = druga polovina, ravno = bez senčenja
//     oreoli: [{ x, y, z, r, boja, alfa? }],                                      // mek sjaj (elektroni, joni)
//   })
//   Scena3D.zaklonjen(x, y, z, kugle) – da li je tačka (npr. natpis na atomu) iza neke druge kugle
(function () {
  'use strict';
  if (typeof window === 'undefined') return;

  // ───────────────────────── boje ─────────────────────────
  const kesBoja = new Map();
  function rgb(boja) {
    let c = kesBoja.get(boja);
    if (c) return c;
    let m;
    if ((m = /^#([0-9a-f]{3})$/i.exec(boja))) c = [...m[1]].map((h) => parseInt(h + h, 16) / 255);
    else if ((m = /^#([0-9a-f]{6})$/i.exec(boja))) c = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
    else if ((m = /^rgba?\(([^)]+)\)$/i.exec(boja))) c = m[1].split(',').slice(0, 3).map((v) => parseFloat(v) / 255);
    else c = [0.8, 0.8, 0.8];
    kesBoja.set(boja, c);
    return c;
  }
  function tamnije(boja, f) {
    const [r, g, b] = rgb(boja);
    const t = (v) => Math.round(v * 255 * (1 - f));
    return `rgb(${t(r)},${t(g)},${t(b)})`;
  }

  // ───────────────────────── WebGL2 ─────────────────────────
  const OSVETLI = `
vec3 osvetli(vec3 b, vec3 n) {
  vec3 L = normalize(vec3(-0.45, -0.62, -0.72));
  vec3 H = normalize(L + vec3(0.0, 0.0, -1.0));
  float dif = max(dot(n, L), 0.0);
  float sp = pow(max(dot(n, H), 0.0), 56.0);
  float ivica = pow(1.0 - max(-n.z, 0.0), 2.5);
  vec3 c = b * (0.30 + 0.80 * dif) + vec3(0.6) * sp;
  return c * (1.0 - 0.38 * ivica);
}`;
  const VS_KUGLA = `#version 300 es
in vec2 ugao; in vec4 c; in vec4 boja;
uniform vec2 vel;
out vec2 lp; flat out vec4 vC; flat out vec4 vB;
void main() {
  float m = c.w + 1.5;
  vec2 p = c.xy + ugao * m;
  lp = ugao * m; vC = c; vB = boja;
  gl_Position = vec4(p.x / vel.x * 2.0 - 1.0, 1.0 - p.y / vel.y * 2.0, 0.0, 1.0);
}`;
  const FS_KUGLA = `#version 300 es
precision highp float;
in vec2 lp; flat in vec4 vC; flat in vec4 vB;
uniform float dpr; uniform vec2 dub;
out vec4 izlaz;
${OSVETLI}
void main() {
  float r = vC.w, d = length(lp);
  float a = clamp((r - d) * dpr + 0.5, 0.0, 1.0);
  if (a <= 0.0) discard;
  vec2 q = lp / r;
  float zz = sqrt(max(0.0, 1.0 - dot(q, q)));
  gl_FragDepth = clamp((vC.z - zz * r - dub.x) * dub.y, 0.0, 1.0);
  a *= vB.a;
  izlaz = vec4(osvetli(vB.rgb, normalize(vec3(q, -zz))) * a, a);
}`;
  const VS_VALJAK = `#version 300 es
in vec2 ugao; in vec3 A; in vec3 B; in float r; in vec4 boja; in vec4 boja2; in float ravno;
uniform vec2 vel;
out vec2 vP; flat out vec3 vA; flat out vec3 vB; flat out float vR; flat out vec4 vB1; flat out vec4 vB2; flat out float vRavno;
void main() {
  vec2 d = B.xy - A.xy;
  float L = length(d);
  vec2 t = L > 1e-3 ? d / L : vec2(1.0, 0.0);
  vec2 n = vec2(-t.y, t.x);
  float m = r + 1.5;
  vec2 p = mix(A.xy, B.xy, ugao.x) + t * (ugao.x * 2.0 - 1.0) * m + n * ugao.y * m;
  vP = p; vA = A; vB = B; vR = r; vB1 = boja; vB2 = boja2; vRavno = ravno;
  gl_Position = vec4(p.x / vel.x * 2.0 - 1.0, 1.0 - p.y / vel.y * 2.0, 0.0, 1.0);
}`;
  const FS_VALJAK = `#version 300 es
precision highp float;
in vec2 vP; flat in vec3 vA; flat in vec3 vB; flat in float vR; flat in vec4 vB1; flat in vec4 vB2; flat in float vRavno;
uniform float dpr; uniform vec2 dub;
out vec4 izlaz;
${OSVETLI}
void main() {
  vec3 ax = vB - vA;
  float L = length(ax);
  if (L < 1e-4) discard;
  vec3 u = ax / L;
  vec3 oc = vec3(vP, 0.0) - vA;
  vec3 dp = vec3(0.0, 0.0, 1.0) - u * u.z;
  vec3 op = oc - u * dot(oc, u);
  float qa = dot(dp, dp);
  if (qa < 1e-5) discard;
  float qb = 2.0 * dot(dp, op), oo = dot(op, op);
  float dmin = sqrt(max(oo - qb * qb / (4.0 * qa), 0.0));
  float a = clamp((vR - dmin) / sqrt(qa) * dpr + 0.5, 0.0, 1.0);
  if (a <= 0.0) discard;
  float disc = max(qb * qb - 4.0 * qa * (oo - vR * vR), 0.0);
  float t = (-qb - sqrt(disc)) / (2.0 * qa);
  vec3 P = vec3(vP, t);
  float s = dot(P - vA, u);
  if (s < 0.0 || s > L) discard;
  vec4 b = s < 0.5 * L ? vB1 : vB2;
  vec3 c = vRavno > 0.5 ? b.rgb : osvetli(b.rgb, normalize(P - vA - u * s));
  gl_FragDepth = clamp((t - dub.x) * dub.y, 0.0, 1.0);
  a *= b.a;
  izlaz = vec4(c * a, a);
}`;
  const FS_OREOL = `#version 300 es
precision highp float;
in vec2 lp; flat in vec4 vC; flat in vec4 vB;
uniform vec2 dub;
out vec4 izlaz;
void main() {
  float d = length(lp) / vC.w;
  if (d >= 1.0) discard;
  float a = vB.a * (1.0 - d) * (1.0 - d);
  gl_FragDepth = clamp((vC.z - dub.x) * dub.y, 0.0, 1.0);
  izlaz = vec4(vB.rgb * a, a);
}`;

  let GL = null, glNeuspeh = false;
  function gl() {
    if (GL || glNeuspeh) return GL;
    try {
      if (/(^|[?&])gl=0/.test(location.search)) throw new Error('isključeno');
      const cv = document.createElement('canvas');
      cv.width = 640; cv.height = 400;
      const c = cv.getContext('webgl2', { antialias: true, premultipliedAlpha: true, alpha: true, depth: true, preserveDrawingBuffer: false });
      if (!c) throw new Error('nema WebGL2');
      const prog = (vs, fs) => {
        const p = c.createProgram();
        for (const [tip, src] of [[c.VERTEX_SHADER, vs], [c.FRAGMENT_SHADER, fs]]) {
          const s = c.createShader(tip);
          c.shaderSource(s, src); c.compileShader(s);
          if (!c.getShaderParameter(s, c.COMPILE_STATUS)) throw new Error(c.getShaderInfoLog(s));
          c.attachShader(p, s);
        }
        c.linkProgram(p);
        if (!c.getProgramParameter(p, c.LINK_STATUS)) throw new Error(c.getProgramInfoLog(p));
        const u = {};
        for (const ime of ['vel', 'dpr', 'dub']) u[ime] = c.getUniformLocation(p, ime);
        return { p, u };
      };
      // zajednički „ugao“ pravougaonika: kugla (-1..1)², valjak (0..1) × (-1..1)
      const kvad = (pts) => { const b = c.createBuffer(); c.bindBuffer(c.ARRAY_BUFFER, b); c.bufferData(c.ARRAY_BUFFER, new Float32Array(pts), c.STATIC_DRAW); return b; };
      GL = {
        cv, c,
        kugla: prog(VS_KUGLA, FS_KUGLA), valjak: prog(VS_VALJAK, FS_VALJAK), oreol: prog(VS_KUGLA, FS_OREOL),
        kvK: kvad([-1, -1, 1, -1, -1, 1, 1, 1]), kvV: kvad([0, -1, 1, -1, 0, 1, 1, 1]),
        bafer: c.createBuffer(), vao: c.createVertexArray(),
      };
      cv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); GL = null; glNeuspeh = true; });
    } catch (e) {
      console.info('Scena3D: canvas 2D umesto WebGL2 –', e.message);
      GL = null; glNeuspeh = true;
    }
    return GL;
  }

  // atributi po instanci: [ime, broj komponenti]
  const RASPORED = {
    kugla: [['c', 4], ['boja', 4]],
    valjak: [['A', 3], ['B', 3], ['r', 1], ['boja', 4], ['boja2', 4], ['ravno', 1]],
  };
  function nacrtajInstance(G, pr, kv, raspored, podaci, n) {
    const c = G.c;
    c.useProgram(pr.p);
    c.bindVertexArray(G.vao);
    const lu = c.getAttribLocation(pr.p, 'ugao');
    c.bindBuffer(c.ARRAY_BUFFER, kv);
    c.enableVertexAttribArray(lu);
    c.vertexAttribPointer(lu, 2, c.FLOAT, false, 0, 0);
    c.vertexAttribDivisor(lu, 0);
    c.bindBuffer(c.ARRAY_BUFFER, G.bafer);
    c.bufferData(c.ARRAY_BUFFER, podaci, c.STREAM_DRAW);
    const korak = raspored.reduce((s, [, k]) => s + k, 0) * 4;
    let off = 0;
    const kor = [lu];
    for (const [ime, k] of raspored) {
      const l = c.getAttribLocation(pr.p, ime);
      if (l >= 0) {
        c.enableVertexAttribArray(l);
        c.vertexAttribPointer(l, k, c.FLOAT, false, korak, off);
        c.vertexAttribDivisor(l, 1);
        kor.push(l);
      }
      off += k * 4;
    }
    c.drawArraysInstanced(c.TRIANGLE_STRIP, 0, 4, n);
    for (const l of kor) { c.vertexAttribDivisor(l, 0); c.disableVertexAttribArray(l); }
    c.bindVertexArray(null);
  }

  function pakujKugle(lista) {
    const f = new Float32Array(lista.length * 8);
    lista.forEach((k, i) => {
      const [r, g, b] = rgb(k.boja);
      f.set([k.x, k.y, k.z, k.r, r, g, b, k.alfa ?? 1], i * 8);
    });
    return f;
  }
  function pakujValjke(lista) {
    const f = new Float32Array(lista.length * 16);
    lista.forEach((v, i) => {
      const c1 = rgb(v.boja), c2 = rgb(v.boja2 || v.boja), a = v.alfa ?? 1;
      f.set([...v.a, ...v.b, v.r, ...c1, a, ...c2, a, v.ravno ? 1 : 0], i * 16);
    });
    return f;
  }

  function crtajGL(G, g, w, h, sc) {
    const c = G.c, dpr = g.canvas.width / w || 1;
    const W = Math.ceil(w * dpr), H = Math.ceil(h * dpr);
    if (G.cv.width < W || G.cv.height < H) { G.cv.width = Math.max(G.cv.width, W); G.cv.height = Math.max(G.cv.height, H); }
    const kugle = sc.kugle || [], valjci = sc.valjci || [], oreoli = sc.oreoli || [];
    // opseg dubine
    let zmin = Infinity, zmax = -Infinity;
    for (const k of kugle) { zmin = Math.min(zmin, k.z - k.r); zmax = Math.max(zmax, k.z + k.r); }
    for (const v of valjci) { zmin = Math.min(zmin, v.a[2] - v.r, v.b[2] - v.r); zmax = Math.max(zmax, v.a[2] + v.r, v.b[2] + v.r); }
    for (const o of oreoli) { zmin = Math.min(zmin, o.z); zmax = Math.max(zmax, o.z); }
    if (!(zmax > zmin)) { zmin = -1; zmax = 1; }
    const pad = (zmax - zmin) * 0.05 + 1;
    zmin -= pad; zmax += pad;

    c.viewport(0, 0, W, H);
    c.enable(c.SCISSOR_TEST); c.scissor(0, 0, W, H);
    c.clearColor(0, 0, 0, 0); c.clearDepth(1);
    c.depthMask(true);
    c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
    c.enable(c.DEPTH_TEST); c.depthFunc(c.LEQUAL);
    const uni = (pr) => {
      c.useProgram(pr.p);
      c.uniform2f(pr.u.vel, w, h);
      if (pr.u.dpr) c.uniform1f(pr.u.dpr, dpr);
      c.uniform2f(pr.u.dub, zmin, 1 / (zmax - zmin));
    };
    const neprov = (x) => (x.alfa ?? 1) >= 0.999;
    const kO = kugle.filter(neprov), kP = kugle.filter((x) => !neprov(x));
    const vO = valjci.filter(neprov), vP = valjci.filter((x) => !neprov(x));
    // 1) neprovidno: dubina + alpha-to-coverage za glatke ivice
    c.disable(c.BLEND);
    c.enable(c.SAMPLE_ALPHA_TO_COVERAGE);
    if (kO.length) { uni(G.kugla); nacrtajInstance(G, G.kugla, G.kvK, RASPORED.kugla, pakujKugle(kO), kO.length); }
    if (vO.length) { uni(G.valjak); nacrtajInstance(G, G.valjak, G.kvV, RASPORED.valjak, pakujValjke(vO), vO.length); }
    c.disable(c.SAMPLE_ALPHA_TO_COVERAGE);
    // 2) providno (bledeće veze, orbite) i oreoli: mešanje, bez upisa dubine, od daljih ka bližim
    c.enable(c.BLEND);
    c.blendFunc(c.ONE, c.ONE_MINUS_SRC_ALPHA);
    c.depthMask(false);
    if (vP.length) {
      vP.sort((p, q) => (q.a[2] + q.b[2]) - (p.a[2] + p.b[2]));
      uni(G.valjak); nacrtajInstance(G, G.valjak, G.kvV, RASPORED.valjak, pakujValjke(vP), vP.length);
    }
    if (kP.length) {
      kP.sort((p, q) => q.z - p.z);
      uni(G.kugla); nacrtajInstance(G, G.kugla, G.kvK, RASPORED.kugla, pakujKugle(kP), kP.length);
    }
    if (oreoli.length) { uni(G.oreol); nacrtajInstance(G, G.oreol, G.kvK, RASPORED.kugla, pakujKugle(oreoli), oreoli.length); }
    c.depthMask(true);
    c.disable(c.SCISSOR_TEST);
    // slika iz donjeg levog ugla zajedničkog platna → platno medija
    g.drawImage(G.cv, 0, G.cv.height - H, W, H, 0, 0, w, h);
  }

  // ───────────────────────── rezerva: canvas 2D ─────────────────────────
  function crtaj2D(g, w, h, sc) {
    const st = [];
    for (const k of sc.kugle || []) st.push({ z: k.z, k });
    for (const v of sc.valjci || []) {
      // polovina veze „pripada“ svom atomu: crta se tik pre njega, pa je atom prekriva gde treba
      const s = [(v.a[0] + v.b[0]) / 2, (v.a[1] + v.b[1]) / 2, (v.a[2] + v.b[2]) / 2];
      st.push({ z: v.a[2] + 1e-3, l: [v.a, s, v.boja, v] }, { z: v.b[2] + 1e-3, l: [v.b, s, v.boja2 || v.boja, v] });
    }
    for (const o of sc.oreoli || []) st.push({ z: o.z + 2e-3, o });
    st.sort((a, b) => b.z - a.z);
    g.lineCap = 'round';
    for (const s of st) {
      g.globalAlpha = (s.k || s.o || s.l[3]).alfa ?? 1;
      if (s.k) {
        const { x, y, r, boja } = s.k;
        const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
        gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.25, boja); gr.addColorStop(1, tamnije(boja, 0.55));
        g.fillStyle = gr;
        g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
      } else if (s.o) {
        const { x, y, r } = s.o, [cr, cg, cb] = rgb(s.o.boja).map((v) => Math.round(v * 255));
        const gr = g.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, `rgba(${cr},${cg},${cb},1)`); gr.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        g.fillStyle = gr;
        g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
      } else {
        const [p, q, boja, v] = s.l;
        g.strokeStyle = boja; g.lineWidth = Math.max(1, v.r * 2);
        g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
      }
    }
    g.globalAlpha = 1;
  }

  function crtaj(g, w, h, sc) {
    const G = gl();
    if (G) {
      try { return crtajGL(G, g, w, h, sc); } catch (e) { console.warn('Scena3D:', e); GL = null; glNeuspeh = true; }
    }
    crtaj2D(g, w, h, sc);
  }

  // z = dubina same tačke (za natpis na atomu: prednja strana atoma, k.z - k.r)
  function zaklonjen(x, y, z, kugle) {
    for (const k of kugle) {
      const d2 = (k.x - x) ** 2 + (k.y - y) ** 2;
      if (d2 < k.r * k.r * 0.6 && k.z - Math.sqrt(k.r * k.r - d2) < z - 1) return true;
    }
    return false;
  }

  window.Scena3D = { crtaj, zaklonjen, get webgl() { return !!gl(); } };
})();
