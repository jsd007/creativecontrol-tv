import * as THREE from "three";

/** Shared sun direction — mutated in the R3F frame, read by globe / limb / haze. */
export const SUN = new THREE.Vector3(0.58, 0.36, 0.73).normalize();

export const GLOBE_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Day paper, night void, warm terminator. Land comes from the authored canvas map. */
export const GLOBE_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uSun;
  varying vec3 vN;
  varying vec2 vUv;
  void main() {
    vec3 n = normalize(vN);
    vec3 sun = normalize(uSun);
    vec3 tex = texture2D(uMap, vUv).rgb;
    vec3 lifted = tex * vec3(1.72, 1.58, 1.36) + vec3(0.028, 0.024, 0.018);
    float ndl = dot(n, sun);
    float day = smoothstep(-0.14, 0.34, ndl);
    float wrap = max(ndl * 0.52 + 0.38, 0.0);
    vec3 dayCol = lifted * (0.52 + wrap * 0.78);
    vec3 nightCol = lifted * vec3(0.28, 0.25, 0.22) + vec3(0.02, 0.016, 0.012);
    float term = pow(1.0 - abs(ndl), 2.55);
    vec3 gold = vec3(0.83, 0.68, 0.38) * term * 0.2;
    gl_FragColor = vec4(mix(nightCol, dayCol, day) + gold, 1.0);
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
    float f = pow(1.0 - abs(dot(n, view)), 2.65);
    float sun = pow(max(dot(n, normalize(uSun)), 0.0), 1.35);
    vec3 c = mix(vec3(0.82, 0.66, 0.38), vec3(0.58, 0.52, 0.42), 0.22);
    gl_FragColor = vec4(c, f * (0.28 + sun * 0.16));
  }
`;

export const HAZE_FRAG = /* glsl */ `
  uniform vec3 uSun;
  varying vec3 vN;
  varying vec3 vP;
  void main() {
    vec3 n = normalize(vN);
    vec3 view = normalize(cameraPosition - vP);
    float f = pow(1.0 - abs(dot(n, view)), 3.45);
    float sun = max(dot(n, normalize(uSun)), 0.0);
    vec3 c = mix(vec3(0.78, 0.64, 0.4), vec3(0.5, 0.48, 0.44), 0.4);
    gl_FragColor = vec4(c, f * (0.14 + sun * 0.08));
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
    float vig = smoothstep(0.28, 0.84, r);
    float n = hash(gl_FragCoord.xy + vec2(uTime * 47.0, uTime * 11.0));
    float grain = (n - 0.5) * 0.05;
    gl_FragColor = vec4(vec3(0.03 + grain), vig * 0.28);
  }
`;

export function glowTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d");
  if (!g) return null;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(232,195,106,1)");
  grd.addColorStop(0.2, "rgba(232,195,106,0.5)");
  grd.addColorStop(0.48, "rgba(196,160,90,0.14)");
  grd.addColorStop(1, "rgba(196,160,90,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
