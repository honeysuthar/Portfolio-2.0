import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────
   BrainCanvas – particle brain that matches the Mindfolio hero.

   LOOK
   • Two hemispheres with a medial fissure, built from ~4.6k particles
   • Dense, glowing orange rim; purple / lavender / white / teal inside
   • Large particles are HOLLOW outlined triangles, small ones are dust
   • Back-facing particles fade, so the middle of the brain reads dark

   BEHAVIOUR
   • Scroll drives a camera-style timeline (see KEYFRAMES):
       3/4 side view  →  top view  →  front "heart" view  →  disperses
       into a faint field of scattered triangles
   • Hover: particles near the cursor grow, brighten, turn from dust into
     outlined triangles and SPIN. The effect lingers and fades slowly.

   USAGE
   Renders a fixed, full-viewport, pointer-events:none canvas, so mount it
   once near the top of your page (behind your content, z-index 0).
   Pass `fixed={false}` to make it fill its parent instead.
   ───────────────────────────────────────────────────────────── */

/* ── Scroll timeline ─────────────────────────────────────────
   s     : scroll position in viewport heights (scrollY / innerHeight)
   yaw   : rotation about the vertical axis (0 = looking at the front)
   pitch : tilt (π/2 = looking straight down from above)
   x, y  : brain centre as a fraction of viewport width / height
   sc    : brain scale multiplier
   d     : dispersal 0 (intact) → 1 (fully scattered)
   a     : overall opacity
   Tune the `s` values so each stage lines up with your page sections. */
const KEYFRAMES = [
  // hero: tilted side view, sitting in the right column
  { s: 0.0, yaw: 0.9,   pitch: 0.55, x: 0.16,  y: -0.05, sc: 1.0,  d: 0.0,  a: 1.0  },
  // hero scrolls away: brain tips over to a top view (two hemispheres)
  { s: 0.55, yaw: 0.0,  pitch: 1.45, x: 0.06,  y: -0.03, sc: 1.05, d: 0.0,  a: 1.0  },
  // front view while the statement section arrives
  { s: 0.95, yaw: 0.0,  pitch: 0.0,  x: 0.0,   y: -0.02, sc: 1.1,  d: 0.08, a: 0.85 },
  // breaks apart
  { s: 1.35, yaw: -0.3, pitch: -0.1, x: -0.04, y: 0.0,   sc: 1.3,  d: 0.6,  a: 0.5  },
  // faint field of triangles that stays behind the rest of the page
  { s: 1.9, yaw: -0.6,  pitch: -0.2, x: 0.0,   y: 0.0,   sc: 1.5,  d: 1.0,  a: 0.3  },
];

/* ── Palette ── */
const C = (hex) => new THREE.Color(hex);
const ORANGES = [C('#ffb627'), C('#ff9a1a'), C('#e06500')];
const PURPLES = [C('#7b5cfa'), C('#9a82ff')];
const LAVENDER = C('#b8aaff');
const WHITE = C('#ffffff');
const TEAL = C('#2bd8c8');

const pick = (arr) => arr[(Math.random() * arr.length) | 0];

function pickColor(shell, medial) {
  if (medial && Math.random() < 0.55) return WHITE;
  const r = Math.random();
  if (shell < 0.1) {
    // rim: mostly orange
    if (r < 0.72) return pick(ORANGES);
    if (r < 0.9) return pick(PURPLES);
    if (r < 0.96) return WHITE;
    return TEAL;
  }
  // interior
  if (r < 0.38) return pick(PURPLES);
  if (r < 0.56) return LAVENDER;
  if (r < 0.72) return WHITE;
  if (r < 0.80) return TEAL;
  return pick(ORANGES);
}

/* ── Brain shape ──────────────────────────────────────────────
   The brain is a union of anatomical lobes, each an implicit ellipsoid-ish
   surface:  cerebrum (x2), temporal lobes (x2), cerebellum (x2), brainstem.
   Particles are sampled on each lobe's surface and discarded where they sit
   inside another lobe, which leaves the natural creases between them
   (Sylvian fissure, cerebellar fold, longitudinal fissure).
   Folds (gyri/sulci) come from a contour-line noise field: particles thin
   out along the sulci and the surface is pushed in/out along the gyri.
   Axes: +x right, +y up, +z front (frontal lobe).                       */

// --- value noise ---
function h3(x, y, z) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return ((h >>> 0) / 4294967295) * 2 - 1;
}
function vnoise(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const l = (a, b, t) => a + (b - a) * t;
  return l(
    l(l(h3(ix, iy, iz), h3(ix + 1, iy, iz), u), l(h3(ix, iy + 1, iz), h3(ix + 1, iy + 1, iz), u), v),
    l(l(h3(ix, iy, iz + 1), h3(ix + 1, iy, iz + 1), u), l(h3(ix, iy + 1, iz + 1), h3(ix + 1, iy + 1, iz + 1), u), v),
    w,
  );
}
const fold = (x, y, z) =>
  vnoise(x * 0.07, y * 0.07, z * 0.07) * 0.72 + vnoise(x * 0.15 + 13.7, y * 0.15, z * 0.15) * 0.28;

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// --- lobes: f(x,y,z) < 1 inside. `mirror` lobes exist on both sides of x=0 ---
const LOBES = [
  { // cerebrum (frontal / parietal / occipital)
    name: 'cerebrum', mirror: true, weight: 0.62, cx: 43, cy: 10, cz: 0, amp: 4, foldDensity: 1,
    f(x, y, z) {
      const dx = Math.abs(x) - 43, dy = y - 10, zn = z / 98;
      const ry = dy < 0 ? 54 * 0.8 : 54;
      const t = dy < 0 ? -dy / ry : 0;
      // wider at the back, narrower toward the frontal pole, narrower underneath
      const taper = 1 + 0.08 * -zn - 0.2 * smoothstep(0.1, 1, zn);
      const wx = 42 * taper * (1 - 0.22 * t);
      // slightly squared-off exponents → blunt poles and a flatter medial wall,
      // so the two hemispheres form ONE oval separated by a thin fissure
      return Math.pow(Math.abs(dx / wx), 2.3) + (dy / ry) ** 2 + Math.pow(Math.abs(zn), 2.4);
    },
  },
  { // temporal lobe – hangs low on the side, pole points forward and down
    name: 'temporal', mirror: true, weight: 0.16, cx: 54, cy: -30, cz: 14, amp: 3, foldDensity: 1,
    f(x, y, z) {
      const dx = Math.abs(x) - 54, dz = z - 14;
      const dy = y - (-30 - 0.1 * dz);
      return (dx / 21) ** 2 + (dy / 19) ** 2 + (dz / 52) ** 2;
    },
  },
  { // cerebellum – tucked under the occipital lobe, striated
    name: 'cerebellum', mirror: true, weight: 0.16, cx: 26, cy: -46, cz: -68, amp: 1.6, foldDensity: 0,
    f(x, y, z) {
      const dx = Math.abs(x) - 26, dy = y + 46, dz = z + 68;
      return (dx / 30) ** 2 + (dy / 20) ** 2 + (dz / 30) ** 2;
    },
  },
  { // brainstem
    name: 'stem', mirror: false, weight: 0.06, cx: 0, cy: -62, cz: -30, amp: 0, foldDensity: 0,
    f(x, y, z) {
      const dy = y + 62, dz = z + 30 + dy * 0.18;                  // leans backwards as it descends
      return (x / 10) ** 2 + (dy / 32) ** 2 + (dz / 10) ** 2;
    },
  },
];
const LOBE_TOTAL = LOBES.reduce((a, l) => a + l.weight, 0);

function surfaceDistance(lobe, cx, cy, cz, dx, dy, dz) {
  let lo = 0, hi = 160;
  for (let i = 0; i < 18; i++) {
    const m = (lo + hi) / 2;
    if (lobe.f(cx + dx * m, cy + dy * m, cz + dz * m) < 1) lo = m; else hi = m;
  }
  return lo;
}

// 0 = bottom of a sulcus (groove), 1 = crest of a gyrus (ridge)
function ridgeAt(lobe, x, y, z) {
  if (lobe.name === 'cerebellum') {
    return 0.5 + 0.5 * Math.sin(y * 1.25 + vnoise(x * 0.05, y * 0.05, z * 0.05) * 2);
  }
  if (!lobe.foldDensity) return 1;
  // domain-warped so the grooves wind like real sulci instead of forming a grid
  const wx = x + 9 * vnoise(x * 0.03 + 5, y * 0.03, z * 0.03);
  const wy = y + 9 * vnoise(x * 0.03, y * 0.03 + 9, z * 0.03);
  const wz = z + 9 * vnoise(x * 0.03, y * 0.03, z * 0.03 + 2);
  const n =
    vnoise(wx * 0.07, wy * 0.07, wz * 0.07) * 0.72 +
    vnoise(wx * 0.15 + 13.7, wy * 0.15, wz * 0.15) * 0.28;
  return smoothstep(0, 0.35, Math.abs(n));
}

function sampleBrain(isDust, out) {
  for (let attempt = 0; attempt < 80; attempt++) {
    let r = Math.random() * LOBE_TOTAL;
    let lobe = LOBES[0];
    for (const l of LOBES) { if ((r -= l.weight) <= 0) { lobe = l; break; } }
    const side = lobe.mirror ? (Math.random() < 0.5 ? -1 : 1) : 1;
    const cx = lobe.cx * side, cy = lobe.cy, cz = lobe.cz;

    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, rr = Math.sqrt(1 - u * u);
    const dx = rr * Math.cos(th), dy = u, dz = rr * Math.sin(th);
    const t = surfaceDistance(lobe, cx, cy, cz, dx, dy, dz);
    const px = cx + dx * t, py = cy + dy * t, pz = cz + dz * t;

    // drop points buried inside another lobe → natural creases between lobes
    let hidden = false;
    for (const o of LOBES) {
      if (o !== lobe && o.f(px, py, pz) < 0.93) { hidden = true; break; }
    }
    if (hidden) continue;

    // thin out inside the sulci so the folds show as dark winding lines
    const ridge = ridgeAt(lobe, px, py, pz);
    const keep = isDust ? 0.06 + 0.94 * ridge * ridge : 0.3 + 0.7 * ridge;
    if (Math.random() > keep) continue;

    // surface normal = lobe gradient, tilted by the fold height-field
    const e = 1.5;
    let gx = lobe.f(px + e, py, pz) - lobe.f(px - e, py, pz);
    let gy = lobe.f(px, py + e, pz) - lobe.f(px, py - e, pz);
    let gz = lobe.f(px, py, pz + e) - lobe.f(px, py, pz - e);
    let gl = Math.hypot(gx, gy, gz) || 1;
    gx /= gl; gy /= gl; gz /= gl;
    if (lobe.amp > 0) {
      const g = 1.0, k = lobe.amp * 1.6 / (2 * g);
      let hx = (ridgeAt(lobe, px + g, py, pz) - ridgeAt(lobe, px - g, py, pz)) * k;
      let hy = (ridgeAt(lobe, px, py + g, pz) - ridgeAt(lobe, px, py - g, pz)) * k;
      let hz = (ridgeAt(lobe, px, py, pz + g) - ridgeAt(lobe, px, py, pz - g)) * k;
      const dn = hx * gx + hy * gy + hz * gz;       // keep only the tangential part
      hx -= dn * gx; hy -= dn * gy; hz -= dn * gz;
      gx -= hx; gy -= hy; gz -= hz;
      gl = Math.hypot(gx, gy, gz) || 1;
      gx /= gl; gy /= gl; gz /= gl;
    }

    // keep everything close to the surface so the brain reads as a solid object
    const depth = isDust
      ? Math.pow(Math.random(), 3) * 0.08
      : Math.pow(Math.random(), 1.7) * 0.32;
    const tt = (t + lobe.amp * (ridge - 1)) * (1 - depth);

    out.x = cx + dx * tt; out.y = cy + dy * tt; out.z = cz + dz * tt;
    out.nx = gx; out.ny = gy; out.nz = gz;
    out.depth = depth; out.ridge = ridge;
    return;
  }
  out.x = 0; out.y = 0; out.z = 0; out.depth = 1; out.ridge = 1;
  out.nx = 0; out.ny = 0; out.nz = 1;
}

/* ── Shaders ── */
const VERT = /* glsl */ `
  attribute vec3 aColor;
  attribute vec3 aNormal;        // brain-local surface normal
  attribute vec4 aDyn;           // x: size(px) y: angle z: fill w: hover
  attribute float aL;            // 0 = part of the brain, 1 = scattered
  uniform mat3 uRot;
  uniform float uPx;
  uniform float uAlpha;
  uniform float uCam;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vAngle;
  varying float vFill;
  varying float vSizePx;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float depth = -mv.z;
    float size = aDyn.x * uPx * (uCam / depth);
    gl_PointSize = clamp(size, 1.0, 160.0);
    gl_Position = projectionMatrix * mv;

    // lighting + back-face fade make the cloud read as a solid, lit object
    vec3 n = normalize(uRot * aNormal);
    float solid = 1.0 - aL;
    float lambert = dot(n, normalize(vec3(-0.45, 0.65, 0.62)));
    float light = 0.30 + 0.85 * smoothstep(-0.5, 1.0, lambert);
    float rim = 1.0 - smoothstep(0.0, 0.4, abs(n.z));
    float shade = mix(1.0, light + rim * 0.25, solid);
    float ft = smoothstep(-0.25, 0.35, n.z);
    float facing = mix(1.0, mix(0.22, 1.0, ft), solid);

    float near = 1.0 - smoothstep(-150.0, 150.0, depth - uCam);
    float hover = aDyn.w;
    vAlpha = mix(0.45, 1.0, near) * uAlpha * (1.0 + hover * 0.9) * facing;
    // rim glows orange; far-side particles turn dim and grey-lavender
    vec3 col = aColor * shade;
    col = mix(col, vec3(1.0, 0.62, 0.12) * (0.55 + 0.45 * shade), rim * 0.5 * solid);
    float luma = dot(col, vec3(0.3, 0.59, 0.11));
    col = mix(col, vec3(luma) * vec3(0.9, 0.85, 1.0), (1.0 - ft) * 0.55 * solid);
    vColor = mix(col, vec3(1.0), hover * 0.35);
    vAngle = aDyn.y;
    vFill = aDyn.z;
    vSizePx = gl_PointSize;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uDpr;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vAngle;
  varying float vFill;
  varying float vSizePx;

  float sdTri(vec2 p, float r) {
    const float k = 1.7320508;
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * r, 0.0);
    return -length(p) * sign(p.y);
  }

  void main() {
    vec2 q = (gl_PointCoord - 0.5) * 2.0;
    float c = cos(vAngle), s = sin(vAngle);
    q = mat2(c, -s, s, c) * q;

    float d = sdTri(q, 0.6);
    float px = 2.0 / vSizePx;                   // one device pixel in q-space
    float halfW = 0.8 * uDpr * px;              // ~1.6 css px stroke

    float outline = 1.0 - smoothstep(halfW - px, halfW + px, abs(d));
    float fillA   = 1.0 - smoothstep(-px, px, d);
    float glow    = exp(-max(d, 0.0) * 6.0) * 0.18
                  * (1.0 - smoothstep(0.55, 0.95, length(q)));

    float hollow = max(outline, fillA * 0.10) + glow;
    float a = clamp(mix(hollow, fillA, vFill), 0.0, 1.0) * vAlpha;
    if (a < 0.003) discard;

    // premultiplied, with reduced alpha → overlapping particles add up (glow)
    gl_FragColor = vec4(vColor * a, a * 0.5);
  }
`;

const smooth = (u) => u * u * (3 - 2 * u);

function sampleTimeline(s) {
  const k = KEYFRAMES;
  if (s <= k[0].s) return k[0];
  const last = k[k.length - 1];
  if (s >= last.s) return last;
  let i = 0;
  while (s > k[i + 1].s) i++;
  const a = k[i], b = k[i + 1];
  const e = smooth((s - a.s) / (b.s - a.s));
  const l = (p) => a[p] + (b[p] - a[p]) * e;
  return {
    yaw: l('yaw'), pitch: l('pitch'), x: l('x'), y: l('y'),
    sc: l('sc'), d: l('d'), a: l('a'),
  };
}

const BrainCanvas = ({ fixed = true, zIndex = -1, size = 1.7 }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // In fixed mode the canvas is attached straight to <body>. That way a
    // transformed / overflow-hidden / animated parent (e.g. the hero) can't
    // clip it or turn "fixed" into "scrolls with the hero".
    let mount;
    let host = null;
    if (fixed) {
      host = document.createElement('div');
      Object.assign(host.style, {
        position: 'fixed', inset: '0', width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: String(zIndex),   // -1 = behind page content
      });
      document.body.appendChild(host);
      mount = host;
    } else {
      mount = mountRef.current;
    }
    if (!mount) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 700;
    const DUST = small ? 1600 : 2800;
    const TRIS = small ? 1800 : 3600;
    const N = DUST + TRIS;

    /* ── Renderer / camera ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(DPR);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const FOV = 35, CAM_Z = 700;
    const TAN_HALF = Math.tan((FOV * Math.PI) / 360);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 3000);
    camera.position.z = CAM_Z;

    let W = 1, H = 1, aspect = 1, visH = 1, visW = 1, baseScale = 1;
    const resize = () => {
      W = mount.clientWidth || window.innerWidth;
      H = mount.clientHeight || window.innerHeight;
      aspect = W / H;
      renderer.setSize(W, H);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      visH = 2 * CAM_Z * TAN_HALF;
      visW = visH * aspect;
      baseScale = (visH * 0.72 * size) / 230;
      material.uniforms.uPx.value = DPR * Math.min(1.5, Math.max(0.7, H / 650));
    };

    /* ── Particle data ── */
    const base = new Float32Array(N * 3);     // brain-local position
    const scat = new Float32Array(N * 3);     // random scatter target (-1..1)
    const delay = new Float32Array(N);        // dispersal stagger
    const size0 = new Float32Array(N);
    const fill0 = new Float32Array(N);
    const spinBase = new Float32Array(N);
    const spinDir = new Float32Array(N);
    const hov = new Float32Array(N);
    const ang = new Float32Array(N);
    const colors = new Float32Array(N * 3);
    const pos = new Float32Array(N * 3);
    const normals = new Float32Array(N * 3);
    const lAttrData = new Float32Array(N);
    const dyn = new Float32Array(N * 4);

    const tmp = { x: 0, y: 0, z: 0, nx: 0, ny: 0, nz: 1, depth: 0, ridge: 1 };
    for (let i = 0; i < N; i++) {
      const isDust = i < DUST;
      sampleBrain(isDust, tmp);
      base[i * 3] = tmp.x; base[i * 3 + 1] = tmp.y; base[i * 3 + 2] = tmp.z;

      const medial = Math.abs(tmp.x) < 6 && tmp.depth < 0.15;
      const col = pickColor(tmp.depth, medial);
      // grooves (sulci) are darker, crests brighter
      const bright = (0.55 + Math.random() * 0.45) * (isDust ? 0.4 + 0.6 * tmp.ridge : 0.6 + 0.4 * tmp.ridge);
      normals[i * 3] = tmp.nx; normals[i * 3 + 1] = tmp.ny; normals[i * 3 + 2] = tmp.nz;
      colors[i * 3] = col.r * bright;
      colors[i * 3 + 1] = col.g * bright;
      colors[i * 3 + 2] = col.b * bright;

      scat[i * 3] = Math.random() * 2 - 1;
      scat[i * 3 + 1] = Math.random() * 2 - 1;
      scat[i * 3 + 2] = Math.random() * 2 - 1;
      delay[i] = Math.random() * 0.55;

      size0[i] = isDust ? 1.8 + Math.random() * 1.8 : 7 + Math.random() * 6;
      fill0[i] = isDust ? 1 : 0;
      spinDir[i] = Math.random() < 0.5 ? -1 : 1;
      spinBase[i] = reduceMotion ? 0 : spinDir[i] * (0.15 + Math.random() * 0.5);
      ang[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage);
    const dynAttr = new THREE.BufferAttribute(dyn, 4).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    geo.setAttribute('aDyn', dynAttr);
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aNormal', new THREE.BufferAttribute(normals, 3));
    const lAttr = new THREE.BufferAttribute(lAttrData, 1).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aL', lAttr);

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uPx: { value: 1 },
        uAlpha: { value: 1 },
        uCam: { value: CAM_Z },
        uDpr: { value: DPR },
        uRot: { value: new THREE.Matrix3() },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    });

    const points = new THREE.Points(geo, material);
    points.frustumCulled = false;
    scene.add(points);
    resize();

    /* ── Input ── */
    const mouse = { x: -9999, y: -9999, active: false };
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    window.addEventListener('resize', resize, { passive: true });

    /* ── Loop ── */
    const clock = new THREE.Clock();
    let animId;
    let sm = (window.scrollY || 0) / window.innerHeight;   // smoothed scroll

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // smoothed scroll → timeline state
      const target = (window.scrollY || 0) / window.innerHeight;
      sm += (target - sm) * (1 - Math.exp(-dt * 5));
      const st = sampleTimeline(sm);

      const narrow = aspect < 0.8;
      const yaw = st.yaw + (reduceMotion ? 0 : Math.sin(t * 0.4) * 0.08);
      const pitch = st.pitch;
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const S = baseScale * st.sc * (narrow ? 0.75 : 1);
      const ox = st.x * (narrow ? 0.25 : 1) * visW;
      const oy = st.y * visH;
      const d = st.d;

      material.uniforms.uAlpha.value = st.a * (narrow ? 0.6 : 1);

      const hoverR = 120 * Math.min(1.5, Math.max(0.7, H / 650));
      const hoverR2 = hoverR * hoverR;
      const kx = 0.5 / (TAN_HALF * aspect);
      const ky = 0.5 / TAN_HALF;

      for (let i = 0; i < N; i++) {
        const bx = base[i * 3], by = base[i * 3 + 1], bz = base[i * 3 + 2];

        // rotate: yaw about Y, then pitch about X
        const x1 = cy * bx + sy * bz;
        const z1 = -sy * bx + cy * bz;
        const y2 = cp * by - sp * z1;
        const z2 = sp * by + cp * z1;

        let wx = ox + x1 * S;
        let wy = oy + y2 * S;
        let wz = z2 * S;

        // dispersal (staggered per particle)
        let l = 0;
        if (d > 0.001) {
          l = (d - delay[i]) / 0.45;
          l = l < 0 ? 0 : l > 1 ? 1 : l;
          l = l * l * (3 - 2 * l);
          if (l > 0) {
            wx += (scat[i * 3] * visW * 0.55 - wx) * l;
            wy += (scat[i * 3 + 1] * visH * 0.55 - wy) * l;
            wz += (scat[i * 3 + 2] * 180 - wz) * l;
          }
        }

        // gentle float
        if (!reduceMotion) {
          const f = 1.2 + 9 * l;
          wy += Math.sin(t * 0.6 + i * 0.37) * f;
          wx += Math.cos(t * 0.5 + i * 0.21) * f * 0.6;
        }

        pos[i * 3] = wx; pos[i * 3 + 1] = wy; pos[i * 3 + 2] = wz;
        lAttrData[i] = l;

        // screen-space distance to the cursor
        let target = 0;
        if (mouse.active) {
          const dep = CAM_Z - wz;
          const px = (wx / dep * kx + 0.5) * W;
          const py = (0.5 - wy / dep * ky) * H;
          const ddx = px - mouse.x, ddy = py - mouse.y;
          const dist2 = ddx * ddx + ddy * ddy;
          if (dist2 < hoverR2) {
            const k = 1 - Math.sqrt(dist2) / hoverR;
            target = Math.pow(k, 1.5);
          }
        }
        // rises fast, lingers on the way out
        const rate = target > hov[i] ? 14 : 1.6;
        hov[i] += (target - hov[i]) * Math.min(1, dt * rate);
        const h = hov[i];

        ang[i] += dt * (spinBase[i] + (reduceMotion ? 0 : h * spinDir[i] * 16));

        const fillMix = fill0[i] * (1 - Math.min(1, h * 1.6));
        dyn[i * 4] = size0[i] * (1 + h * (fill0[i] ? 3.6 : 1.8));
        dyn[i * 4 + 1] = ang[i];
        dyn[i * 4 + 2] = fillMix;
        dyn[i * 4 + 3] = h;
      }

      posAttr.needsUpdate = true;
      dynAttr.needsUpdate = true;
      lAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('resize', resize);
      geo.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      if (host && host.parentNode) host.parentNode.removeChild(host);
    };
  }, [fixed, size]);

  // In fixed mode this is only an empty placeholder that keeps your hero layout;
  // the real canvas lives on <body>.
  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', minHeight: '480px', pointerEvents: 'none' }}
    />
  );
};

export default BrainCanvas;