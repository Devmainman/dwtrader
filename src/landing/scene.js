// WebGL stage for the landing page.
// One fixed canvas. Scroll sets a timeline value t (0 to 5, one unit per chapter)
// and the camera flies along a spline through six key shots:
//   0 hero      low angle, looking up at the core
//   1 reveal    pull back, the particle floor appears
//   2 markets   skim low across the floor while it swells like a price line
//   3 showcase  rise and drift left (the phone mockup sits in front)
//   4 vault     the floor lifts off and assembles into a vault around the core
//   5 close     wide shot, the vault opens out
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const BG = 0x0e0e0f;
const ACCENT = new THREE.Color(0xe8742a);
const CORE_Y = 1.15;

// Camera key shots: [position, look-at]
const KEYS = [
  [[0.0, 0.3, 6.6], [0.0, 1.3, 0.0]],
  [[0.9, 1.0, 8.6], [0.0, 1.75, 0.0]],
  [[-5.4, 0.5, 3.6], [0.0, 1.05, -0.4]],
  [[3.6, 2.6, 8.8], [0.0, 0.9, 0.0]],
  [[5.0, 6.0, 8.6], [0.0, 1.3, 0.0]],
  [[0.0, 2.0, 14.0], [0.0, 1.3, 0.0]],
];

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.25, 'rgba(255,255,255,.35)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------------------------------------------------------------- floor + vault particles */

const floorVert = /* glsl */ `
  uniform float uTime, uMorph, uWave, uSize, uOpen, uMax, uRipple;
  uniform mat3 uRot;
  uniform vec3 uCenter;
  attribute vec3 aVault;
  attribute float aRand, aSel;
  varying float vA, vHeat, vM;
  void main() {
    vec3 p = position;
    float w = sin(p.x * 0.42 + uTime * 0.55) * 0.34
            + sin(p.z * 0.36 - uTime * 0.42) * 0.40
            + sin((p.x - p.z) * 0.9 + uTime * 0.9) * 0.09;
    p.y += w * uWave;

    // shockwave: a ring travelling out from the core, fading as it goes
    float dc = length(p.xz - uCenter.xz);
    float ring = uRipple > 0.0 ? exp(-pow(dc - uRipple * 6.0, 2.0) * 0.9) * exp(-uRipple * 0.5) : 0.0;
    p.y += ring * 0.6;

    float m = aSel * smoothstep(aRand * 0.55, aRand * 0.55 + 0.45, uMorph);
    vec3 v = uRot * aVault;
    v += normalize(aVault + 0.0001) * uOpen * (0.6 + aRand * 2.6);
    vec3 q = mix(p, v + uCenter, m);
    q.y += sin(m * 3.14159) * (0.8 + aRand * 2.2);
    q.x += sin(m * 3.14159) * (aRand - 0.5) * 1.6;

    vec4 mv = modelViewMatrix * vec4(q, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(uSize * (0.55 + aRand * 0.9) * (1.0 + m * 0.35) / -mv.z, uMax);

    float d = length(p.xz - uCenter.xz);
    float pool = 0.28 + 1.5 * exp(-d * d / 34.0);
    float fog = smoothstep(32.0, 3.0, -mv.z) * smoothstep(0.6, 3.0, -mv.z);
    vHeat = clamp(w * uWave * 1.3 + 0.05 + ring * 1.6, 0.0, 1.0);
    vM = m;
    vA = mix(fog * pool * 0.62, 0.9, m) * (1.0 - uOpen * 0.85 * m);
  }
`;

const floorFrag = /* glsl */ `
  uniform vec3 uAccent;
  varying float vA, vHeat, vM;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.0, r);
    vec3 col = mix(vec3(0.80, 0.77, 0.74), uAccent * 1.6, vHeat * 0.85 * (1.0 - vM));
    col = mix(col, vec3(1.0, 0.92, 0.84), vM);
    gl_FragColor = vec4(col, a * vA);
  }
`;

function buildFloor(mobile) {
  const cols = mobile ? 150 : 250;
  const rows = mobile ? 110 : 170;
  const n = cols * rows;
  const pos = new Float32Array(n * 3);
  const vault = new Float32Array(n * 3);
  const rand = new Float32Array(n);
  const sel = new Float32Array(n);
  const S = 1.12; // vault half size
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++, i++) {
      pos[i * 3] = lerp(-17, 17, c / (cols - 1)) + (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 1] = -0.55;
      pos[i * 3 + 2] = lerp(-24, 9, r / (rows - 1)) + (Math.random() - 0.5) * 0.08;
      rand[i] = Math.random();
      // particles near the core are the ones that lift into the vault
      const d = Math.hypot(pos[i * 3], pos[i * 3 + 2]);
      sel[i] = Math.random() < (d < 9 ? 0.62 : 0.12) ? 1 : 0;
      // a point on the vault: 40% on the edges, the rest on the faces
      let x, y, z;
      const u = Math.random() * 2 - 1, v = Math.random() * 2 - 1;
      const sgn = Math.random() < 0.5 ? -1 : 1, sgn2 = Math.random() < 0.5 ? -1 : 1;
      const axis = Math.floor(Math.random() * 3);
      if (Math.random() < 0.4) {
        const e = [u, sgn, sgn2];
        [x, y, z] = axis === 0 ? e : axis === 1 ? [e[1], e[0], e[2]] : [e[1], e[2], e[0]];
      } else {
        [x, y, z] = axis === 0 ? [sgn, u, v] : axis === 1 ? [u, sgn, v] : [u, v, sgn];
      }
      vault[i * 3] = x * S;
      vault[i * 3 + 1] = y * S;
      vault[i * 3 + 2] = z * S;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aVault', new THREE.BufferAttribute(vault, 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
  geo.setAttribute('aSel', new THREE.BufferAttribute(sel, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);
  const mat = new THREE.ShaderMaterial({
    vertexShader: floorVert,
    fragmentShader: floorFrag,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uMorph: { value: 0 }, uWave: { value: 0.4 }, uOpen: { value: 0 },
      uSize: { value: 30 }, uMax: { value: 4 }, uRipple: { value: -1 }, uRot: { value: new THREE.Matrix3() },
      uCenter: { value: new THREE.Vector3(0, CORE_Y, 0) }, uAccent: { value: ACCENT.clone() },
    },
  });
  return new THREE.Points(geo, mat);
}

/* ---------------------------------------------------------------- light web overhead */

const webFrag = /* glsl */ `
  uniform float uTime, uOpacity;
  varying vec2 vUv;
  vec2 h2(vec2 p) { p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
  float cells(vec2 x) {
    vec2 n = floor(x), f = fract(x);
    float a = 8.0, b = 8.0;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = 0.5 + 0.5 * sin(uTime * 0.3 + 6.2831 * h2(n + g));
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < a) { b = a; a = d; } else if (d < b) { b = d; }
    }
    return sqrt(b) - sqrt(a);
  }
  void main() {
    vec2 p = (vUv - 0.5) * 16.0;
    float e = cells(p);
    float line = 1.0 - smoothstep(0.0, 0.035, e);
    float fall = smoothstep(0.5, 0.04, length(vUv - 0.5));
    gl_FragColor = vec4(vec3(1.0, 0.84, 0.68) * line, line * fall * uOpacity);
  }
`;

function buildWeb() {
  const mat = new THREE.ShaderMaterial({
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: webFrag,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0.4 } },
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(44, 44), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(0, 10, -2);
  return m;
}

/* ---------------------------------------------------------------- floating dust */

function buildDust(count) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 1.5 + Math.random() * 7;
    const a = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.random() * 6 - 0.4;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uSize: { value: 18 }, uMax: { value: 3 } },
    vertexShader: `uniform float uTime, uSize, uMax; varying float vA;
      void main(){ vec3 p = position; p.y += sin(uTime*0.4 + position.x*2.0)*0.15;
        vec4 mv = modelViewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mv;
        gl_PointSize = min(uSize / -mv.z, uMax); vA = smoothstep(26.0, 2.0, -mv.z) * smoothstep(1.0, 3.5, -mv.z) * 0.5; }`,
    fragmentShader: `varying float vA; void main(){ float r = length(gl_PointCoord-0.5); if(r>0.5) discard; gl_FragColor = vec4(vec3(1.0,0.9,0.8), smoothstep(0.5,0.0,r)*vA); }`,
  });
  return new THREE.Points(geo, mat);
}

/* ---------------------------------------------------------------- stage */

export function createStage(canvas, { mobile = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(BG, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;
  scene.environmentIntensity = 0.9;

  const camera = new THREE.PerspectiveCamera(mobile ? 50 : 38, 1, 0.1, 120);

  // The core: a cut crystal with a blue light inside.
  const core = new THREE.Group();
  core.position.y = CORE_Y;
  const gemGeo = new THREE.OctahedronGeometry(1, 1);
  gemGeo.scale(0.44, 0.8, 0.44);
  const gem = new THREE.Mesh(gemGeo, new THREE.MeshPhysicalMaterial({
    color: 0xfff6e6, emissive: 0xd97706, emissiveIntensity: 0.3, roughness: 0.03, metalness: 0, transmission: 1, thickness: 1.5, ior: 1.75,
    dispersion: 0.35, flatShading: true, clearcoat: 1, clearcoatRoughness: 0.04,
    attenuationColor: new THREE.Color(0xb45309), attenuationDistance: 1.6, envMapIntensity: 2.4,
  }));
  core.add(gem);
  const heart = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11, 2), new THREE.MeshBasicMaterial({ color: ACCENT.clone().multiplyScalar(5), toneMapped: false }));
  heart.visible = false; // seen through the facets it splits into blobs; the glow carries the light
  const glowTex = glowTexture();
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xe8742a, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.scale.setScalar(2.2);
  core.add(glow);
  scene.add(core);

  // Thin vault edges: drawn in once the particles have assembled.
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.24, 2.24, 2.24)),
    new THREE.LineBasicMaterial({ color: 0xffe2c4, transparent: true, opacity: 0, depthWrite: false })
  );
  edges.position.y = CORE_Y;
  scene.add(edges);

  const floor = buildFloor(mobile);
  floor.material.uniforms.uSize.value = (mobile ? 26 : 22) * dpr;
  floor.material.uniforms.uMax.value = 3.2 * dpr;
  scene.add(floor);
  const web = buildWeb();
  scene.add(web);
  const dust = buildDust(mobile ? 260 : 520);
  dust.material.uniforms.uSize.value = 14 * dpr;
  dust.material.uniforms.uMax.value = 2.5 * dpr;
  scene.add(dust);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), mobile ? 0.5 : 0.6, 0.5, 0.85);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const posCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k[0])), false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k[1])), false, 'centripetal');
  const camPos = new THREE.Vector3();
  const look = new THREE.Vector3();
  const rotM = new THREE.Matrix4();
  const rotE = new THREE.Euler();

  let target = 0, cur = 0, mx = 0, my = 0, pmx = 0, pmy = 0;
  let raf = 0, running = true, still = false;
  const clock = new THREE.Clock();
  const introPos = new THREE.Vector3(0.0, 10.5, 15.0);
  const introLook = new THREE.Vector3(0.0, 0.2, 0.0);
  const INTRO = 3.2; // seconds
  let rippleAt = INTRO - 0.35; // first wave as the camera lands
  const easeIO = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  const resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.resolution.set(w / 2, h / 2);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);
  const onMove = (e) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; };
  if (!mobile) window.addEventListener('pointermove', onMove, { passive: true });

  const frame = () => {
    const time = still ? 4 : clock.getElapsedTime();
    cur = target; // the page already eases the scroll value
    pmx += (mx - pmx) * 0.05;
    pmy += (my - pmy) * 0.05;
    const t = Math.min(5, Math.max(0, cur));

    posCurve.getPoint(t / 5, camPos);
    lookCurve.getPoint(t / 5, look);
    // Portrait screens: step back so the shot still frames the core.
    if (camera.aspect < 0.8) camPos.sub(look).multiplyScalar(1.6).add(look);
    camPos.x += pmx * 0.6;
    camPos.y -= pmy * 0.3;
    // opening shot (skipped for reduced motion)
    const intro = still ? 1 : easeIO(Math.min(1, time / INTRO));
    if (intro < 1) { camPos.lerpVectors(introPos, camPos, intro); look.lerpVectors(introLook, look, intro); }
    camera.position.copy(camPos);
    camera.lookAt(look);

    const morph = smooth(3.05, 3.85, t);
    const open = smooth(4.04, 4.6, t);
    const calm = smooth(4.0, 4.35, t); // content sections: quieter scene so copy reads cleanly
    const u = floor.material.uniforms;
    u.uTime.value = time;
    u.uMorph.value = morph;
    u.uOpen.value = open;
    u.uWave.value = 0.35 + smooth(1.0, 1.8, t) * 1.15 - smooth(2.2, 3.0, t) * 0.95 + smooth(4.2, 5, t) * 0.3;
    u.uAccent.value.copy(ACCENT);
    // landing pulse, then a gentle wave every 6.5 s while the hero is on screen
    if (!still && time > rippleAt + 6.5 && t < 0.6) rippleAt = time;
    u.uRipple.value = still || time < rippleAt ? -1 : time - rippleAt;
    rotE.set(0.32 + Math.sin(time * 0.2) * 0.05, time * 0.12 + t * 0.9, 0.16);
    rotM.makeRotationFromEuler(rotE);
    u.uRot.value.setFromMatrix4(rotM);
    edges.rotation.copy(rotE);
    edges.material.opacity = smooth(3.7, 4.0, t) * (1 - open) * 0.38;
    edges.scale.setScalar(1 + open * 0.6);

    core.position.y = CORE_Y + Math.sin(time * 0.8) * 0.06;
    gem.rotation.y = time * 0.25 + t * 1.4 + (1 - intro) * 5.0;
    gem.rotation.z = Math.sin(time * 0.3) * 0.05;
    const flare = Math.max(0, 1 - Math.abs(time - INTRO + 0.35) / 0.6) * 0.45; // brief glow as the camera lands
    const pulse = 0.3 + Math.sin(time * 1.6) * 0.05 + (still ? 0 : flare);
    glow.material.opacity = pulse * (1 - smooth(1.6, 2.4, t) * 0.4) * (1 - calm * 0.75);
    bloom.strength = (mobile ? 0.5 : 0.6) * (1 - calm * 0.65);
    core.scale.setScalar(1 - smooth(2.0, 2.6, t) * 0.1 + smooth(4.2, 5, t) * 0.2);

    web.material.uniforms.uTime.value = time;
    web.material.uniforms.uOpacity.value = 0.22 - smooth(1, 2, t) * 0.12 + smooth(3.4, 4.2, t) * 0.08;
    dust.material.uniforms.uTime.value = time;
    dust.rotation.y = time * 0.02;

    composer.render();
    if (running && !still) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  const onVis = () => {
    const was = running;
    running = !document.hidden;
    if (running && !was && !still) { clock.getDelta(); raf = requestAnimationFrame(frame); }
  };
  document.addEventListener('visibilitychange', onVis);

  return {
    setTimeline(t) { target = t; if (still) frame(); },
    setStill(v) { still = v; cur = target; frame(); },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
      glowTex.dispose();
      scene.environment?.dispose();
      envScene.dispose?.();
      pmrem.dispose();
      composer.dispose?.();
      renderer.dispose();
    },
  };
}
