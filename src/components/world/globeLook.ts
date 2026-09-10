import * as THREE from "three";

/** Shared sun direction — mutated in the R3F frame, read by globe / limb / haze. */
export const SUN = new THREE.Vector3(0.58, 0.36, 0.73).normalize();

export const GLOBE_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vP;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vP = w.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

/** Day paper, analog night, gold terminator. Land + night come from authored canvases. */
export const GLOBE_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uNight;
  uniform vec3 uSun;
  varying vec3 vN;
  varying vec3 vP;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec3 n = normalize(vN);
    vec3 sun = normalize(uSun);
    vec3 view = normalize(cameraPosition - vP);
    vec3 tex = texture2D(uMap, vUv).rgb;
    vec3 lights = texture2D(uNight, vUv).rgb;
    float lum = dot(tex, vec3(0.32, 0.28, 0.22));
    float land = smoothstep(0.042, 0.11, lum);
    float ndl = dot(n, sun);
    float day = smoothstep(-0.2, 0.4, ndl);
    float wrap = max(ndl * 0.46 + 0.44, 0.0);
    float dusk = smoothstep(-0.46, 0.04, ndl) * (1.0 - smoothstep(-0.02, 0.5, ndl));
    float night = 1.0 - smoothstep(-0.14, 0.26, ndl);
    vec3 lifted = tex * vec3(1.48, 1.36, 1.18) + vec3(0.016, 0.014, 0.011);
    vec3 dayCol = lifted * (0.46 + wrap * 0.9);
    vec3 halfV = normalize(sun + view);
    float spec = pow(max(dot(n, halfV), 0.0), 26.0) * (1.0 - land);
    dayCol += vec3(0.24, 0.2, 0.14) * spec * day * 0.32;
    vec3 nightLand = lifted * vec3(0.14, 0.12, 0.1);
    vec3 nightOcean = vec3(0.01, 0.012, 0.014) + vec3(0.018, 0.026, 0.026) * 0.42;
    vec3 nightCol = mix(nightOcean, nightLand, land);
    nightCol += lights * night * (0.62 + land * 0.55);
    vec3 gold = vec3(0.88, 0.7, 0.38) * dusk * (0.2 + land * 0.1);
    float fres = pow(1.0 - max(dot(n, view), 0.0), 2.75);
    float sunEdge = pow(max(ndl, 0.0), 1.15);
    vec3 rim = mix(vec3(0.36, 0.42, 0.42), vec3(0.86, 0.68, 0.38), sunEdge) * fres * 0.3;
    float grain = (hash(vUv * vec2(1640.0, 820.0)) - 0.5) * 0.03;
    gl_FragColor = vec4(mix(nightCol, dayCol, day) + gold + rim + grain, 1.0);
  }
`;

export const SHELL_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vP;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vP = w.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

export const LIMB_FRAG = /* glsl */ `
  uniform vec3 uSun;
  varying vec3 vN;
  varying vec3 vP;
  void main() {
    vec3 n = normalize(vN);
    vec3 view = normalize(cameraPosition - vP);
    vec3 sun = normalize(uSun);
    float f = pow(1.0 - abs(dot(n, view)), 2.28);
    float lit = pow(max(dot(n, sun), 0.0), 1.08);
    float anti = pow(max(-dot(n, sun), 0.0), 1.55);
    vec3 warm = vec3(0.92, 0.74, 0.4);
    vec3 lamp = vec3(0.78, 0.48, 0.28);
    vec3 cool = vec3(0.38, 0.46, 0.46);
    vec3 c = mix(cool, mix(warm, lamp, 0.28), lit);
    float a = f * (0.2 + lit * 0.48) + f * anti * 0.08;
    gl_FragColor = vec4(c, a);
  }
`;

export const HAZE_FRAG = /* glsl */ `
  uniform vec3 uSun;
  varying vec3 vN;
  varying vec3 vP;
  void main() {
    vec3 n = normalize(vN);
    vec3 view = normalize(cameraPosition - vP);
    vec3 sun = normalize(uSun);
    float f = pow(1.0 - abs(dot(n, view)), 2.95);
    float lit = pow(max(dot(n, sun), 0.0), 0.78);
    vec3 c = mix(vec3(0.74, 0.6, 0.4), vec3(0.46, 0.44, 0.4), 0.22);
    float a = f * (0.09 + lit * 0.18) + pow(lit, 3.6) * f * 0.16;
    gl_FragColor = vec4(c, a);
  }
`;

/** Thin air on the disk — FrontSide, additive. */
export const AIR_FRAG = /* glsl */ `
  uniform vec3 uSun;
  varying vec3 vN;
  varying vec3 vP;
  void main() {
    vec3 n = normalize(vN);
    vec3 view = normalize(cameraPosition - vP);
    float f = pow(1.0 - max(dot(n, view), 0.0), 3.2);
    float lit = max(dot(n, normalize(uSun)), 0.0);
    vec3 c = mix(vec3(0.52, 0.46, 0.36), vec3(0.86, 0.68, 0.38), lit);
    gl_FragColor = vec4(c, f * (0.03 + lit * 0.055));
  }
`;

export const FILM_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/** Screen grain + vignette. Does not sample the scene — no composer, no bloom pipeline. */
export const FILM_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  void main() {
    float r = length(vUv - 0.5);
    float vig = smoothstep(0.24, 0.86, r);
    float n = hash(gl_FragCoord.xy + vec2(uTime * 47.0, uTime * 11.0));
    float grain = (n - 0.5) * 0.055;
    gl_FragColor = vec4(vec3(0.028 + grain), vig * 0.3);
  }
`;

export function glowTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d");
  if (!g) return null;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(239,230,214,1)");
  grd.addColorStop(0.12, "rgba(226,184,92,0.72)");
  grd.addColorStop(0.32, "rgba(193,122,66,0.28)");
  grd.addColorStop(0.58, "rgba(196,160,90,0.08)");
  grd.addColorStop(1, "rgba(196,160,90,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function starDisc() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const g = c.getContext("2d");
  if (!g) return null;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,252,244,1)");
  grd.addColorStop(0.28, "rgba(242,234,217,0.62)");
  grd.addColorStop(0.55, "rgba(212,176,90,0.16)");
  grd.addColorStop(1, "rgba(212,176,90,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}
