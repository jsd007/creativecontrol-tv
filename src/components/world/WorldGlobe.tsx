"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { catalog, cityLocations, getLocation } from "@/data";
import type { Location } from "@/data/types";
import { CONTINENTS, CUTS, paintLand, paintNight, pathD } from "@/lib/geography";
import { gsap, houseGsap } from "@/lib/gsap";
import { activateOnSpace, isTypingTarget } from "@/lib/keys";
import { useIsNarrow, usePrefersReducedMotion } from "@/lib/motion";
import {
  AIR_FRAG,
  FILM_FRAG,
  FILM_VERT,
  GLOBE_FRAG,
  GLOBE_VERT,
  HAZE_FRAG,
  LIMB_FRAG,
  SHELL_VERT,
  SUN,
  glowTexture,
  starDisc,
} from "@/components/world/globeLook";

const GLOBE_R = 1.6;
const MARK_R = 1.632;
const IDLE_R = 5.78;
const IDLE_LAT = 18;
const IDLE_LON = -38;
const FOV = 34;
const LABEL_FACE = 0.22;
const FLY_R = 4.85;
const CHICAGO_R = 4.52;
const LOOK = new THREE.Vector3(0, 0.04, 0);

function probeWebGL() {
  const tryId = (id: "webgl2" | "webgl") => {
    try {
      return Boolean(document.createElement("canvas").getContext(id));
    } catch {
      return false;
    }
  };
  return tryId("webgl2") || tryId("webgl");
}

const _n = new THREE.Vector3();
const _c = new THREE.Vector3();
const _dir = new THREE.Vector3();

/** Unit-direction slerp; lerp when the arc is nearly degenerate. */
function slerpDir(out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, t: number) {
  const dot = THREE.MathUtils.clamp(a.dot(b), -1, 1);
  if (dot > 0.9995) return out.copy(a).lerp(b, t).normalize();
  const theta = Math.acos(dot);
  const sinT = Math.sin(theta);
  return out
    .copy(a)
    .multiplyScalar(Math.sin((1 - t) * theta) / sinT)
    .addScaledVector(b, Math.sin(t * theta) / sinT);
}

function latLonToVec(lat: number, lon: number, r = MARK_R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function facingAmount(world: THREE.Vector3, camera: THREE.Camera) {
  return _n.copy(world).normalize().dot(_c.copy(camera.position).normalize());
}

function canvasTexture(paint: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const g = c.getContext("2d");
  if (!g) return null;
  paint(g, 2048, 1024);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function landTexture() {
  return canvasTexture(paintLand);
}

function nightTexture(cities: Location[]) {
  return canvasTexture((g, w, h) =>
    paintNight(
      g,
      w,
      h,
      cities.map((c) => ({ lon: c.lon, lat: c.lat, glow: c.glow, chicago: c.city === "Chicago" })),
    ),
  );
}

function recordsToYear(location: Location, year: number) {
  return catalog.clips.filter((c) => {
    const loc = getLocation(c.locationId);
    return loc?.city === location.city && c.year <= year;
  }).length;
}

function markVisible(location: Location, year: number) {
  return location.city === "Chicago" || recordsToYear(location, year) > 0;
}

/** Selected, then Chicago, then other facing marks. Not a chip row. */
function cityPath(cities: Location[], selected: string, facing: string[], year: number) {
  const seen = new Set<string>();
  const out: Location[] = [];
  const add = (loc?: Location) => {
    if (!loc || seen.has(loc.id)) return;
    if (loc.id !== selected && !markVisible(loc, year)) return;
    seen.add(loc.id);
    out.push(loc);
  };
  add(cities.find((c) => c.id === selected));
  add(cities.find((c) => c.city === "Chicago"));
  for (const id of facing) add(cities.find((c) => c.id === id));
  return out;
}

/** Re-read the landed camera into OrbitControls so resume doesn't snap back to idle. */
function syncOrbit(ctrl: OrbitControlsImpl | null) {
  if (!ctrl) return;
  ctrl.target.copy(LOOK);
  ctrl.update();
}

function FacingWatch({
  cities,
  onFacing,
}: {
  cities: Location[];
  onFacing: (ids: string[]) => void;
}) {
  const { camera } = useThree();
  const last = useRef("");
  const wait = useRef(0);
  const held = useRef<Set<string>>(new Set());
  const citiesRef = useRef(cities);
  const onFacingRef = useRef(onFacing);
  const pos = useMemo(
    () => cities.map((c) => ({ id: c.id, vec: latLonToVec(c.lat, c.lon) })),
    [cities],
  );
  citiesRef.current = cities;
  onFacingRef.current = onFacing;

  useFrame((_, dt) => {
    wait.current += dt;
    if (wait.current < 0.22) return;
    wait.current = 0;
    const next = new Set<string>();
    for (const c of pos) {
      const face = facingAmount(c.vec, camera);
      if (face > LABEL_FACE || (held.current.has(c.id) && face > 0.08)) next.add(c.id);
    }
    held.current = next;
    const ids = pos.filter((c) => next.has(c.id)).map((c) => c.id);
    const key = ids.join(",");
    if (key === last.current) return;
    last.current = key;
    onFacingRef.current(ids);
  });
  return null;
}

function GlobeBody({ cities }: { cities: Location[] }) {
  const tex = useMemo(() => landTexture(), []);
  const night = useMemo(() => nightTexture(cities), [cities]);
  const mat = useMemo(() => {
    if (!tex) return null;
    return new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: tex },
        uNight: { value: night },
        uSun: { value: SUN },
      },
      vertexShader: GLOBE_VERT,
      fragmentShader: GLOBE_FRAG,
      toneMapped: false,
    });
  }, [tex, night]);
  useEffect(
    () => () => {
      tex?.dispose();
      night?.dispose();
      mat?.dispose();
    },
    [tex, night, mat],
  );
  if (!mat) {
    return (
      <mesh>
        <sphereGeometry args={[GLOBE_R, 64, 64]} />
        <meshStandardMaterial color="#2a2418" roughness={0.94} metalness={0} />
      </mesh>
    );
  }
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_R, 80, 80]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function AtmosphereShell({
  radius,
  frag,
  side = THREE.BackSide,
  additive = false,
}: {
  radius: number;
  frag: string;
  side?: THREE.Side;
  additive?: boolean;
}) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uSun: { value: SUN } },
        transparent: true,
        depthWrite: false,
        depthTest: true,
        side,
        blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
        toneMapped: false,
        vertexShader: SHELL_VERT,
        fragmentShader: frag,
      }),
    [frag, side, additive],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  return (
    <mesh>
      <sphereGeometry args={[radius, 48, 48]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function starField(count: number, radius: number, spread: number, goldBias: number) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const id = i + goldBias * 17.13;
    const u = Math.abs(Math.sin(id * 12.9898) * 43758.5453) % 1;
    const v = Math.abs(Math.sin(id * 78.233) * 23421.631) % 1;
    const w = Math.abs(Math.sin(id * 45.164) * 91827.13) % 1;
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const r = radius + w * spread;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi);
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    const bright = Math.abs(Math.sin(id * 3.1) * 43758.5453) % 1;
    if (bright > 0.984) {
      col[i * 3] = 0.49;
      col[i * 3 + 1] = 0.67;
      col[i * 3 + 2] = 0.64;
    } else if (bright > goldBias) {
      col[i * 3] = 0.91;
      col[i * 3 + 1] = 0.78;
      col[i * 3 + 2] = 0.52;
    } else {
      const t = 0.62 + bright * 0.38;
      col[i * 3] = 0.96 * t;
      col[i * 3 + 1] = 0.92 * t;
      col[i * 3 + 2] = 0.84 * t;
    }
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geom.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return geom;
}

function FieldStars({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const field = useMemo(() => starField(1480, 40, 30, 0.9), []);
  const brights = useMemo(() => starField(70, 36, 22, 0.55), []);
  const tex = useMemo(() => starDisc(), []);
  useFrame((_, dt) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += dt * 0.0032;
    ref.current.rotation.x += dt * 0.00055;
  });
  useEffect(
    () => () => {
      field.dispose();
      brights.dispose();
      tex?.dispose();
    },
    [field, brights, tex],
  );
  const mat = (size: number, opacity: number) => (
    <pointsMaterial
      size={size}
      map={tex ?? undefined}
      vertexColors
      transparent
      depthWrite={false}
      blending={THREE.AdditiveBlending}
      sizeAttenuation
      opacity={opacity}
      toneMapped={false}
    />
  );
  return (
    <group ref={ref}>
      <points geometry={field}>{mat(0.48, 0.88)}</points>
      <points geometry={brights}>{mat(0.95, 1)}</points>
    </group>
  );
}

function FilmGrade() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
        vertexShader: FILM_VERT,
        fragmentShader: FILM_FRAG,
      }),
    [],
  );
  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
  });
  useEffect(() => () => mat.dispose(), [mat]);
  return (
    <mesh renderOrder={40} frustumCulled={false} raycast={() => null}>
      <planeGeometry args={[2, 2]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function CityMark({
  location,
  selected,
  hovered,
  year,
  reduced,
  onSelect,
  onHover,
}: {
  location: Location;
  selected: boolean;
  hovered: boolean;
  year: number;
  reduced: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const pos = useMemo(() => latLonToVec(location.lat, location.lon, MARK_R), [location.lat, location.lon]);
  const wash = useRef<THREE.Sprite>(null);
  const markMat = useRef<THREE.MeshBasicMaterial>(null);
  const shown = useRef(false);
  const [labelOn, setLabelOn] = useState(false);
  const count = recordsToYear(location, year);
  const chicago = location.city === "Chicago";
  const intensity = chicago ? 1 : Math.min(1, location.glow + count / 40);
  const glow = useMemo(() => (chicago ? glowTexture() : null), [chicago]);
  useEffect(() => () => glow?.dispose(), [glow]);

  useFrame(({ camera, clock }) => {
    const face = facingAmount(pos, camera);
    const vis = face < 0.04 ? 0.1 : THREE.MathUtils.clamp(0.18 + face * 0.95, 0.18, 1);
    if (markMat.current && !chicago) markMat.current.opacity = vis;
    if (wash.current) {
      const pulse = chicago && !reduced ? 1 + Math.sin(clock.elapsedTime * 0.48) * 0.1 : 1;
      wash.current.scale.setScalar(1.42 * pulse);
      const mat = wash.current.material;
      if (!Array.isArray(mat)) mat.opacity = 0.62 * vis;
    }
    const want = face > LABEL_FACE && hovered;
    if (want !== shown.current) {
      shown.current = want;
      setLabelOn(want);
    }
  });

  if (count === 0 && !chicago) return null;

  return (
    <group position={pos}>
      {chicago && glow ? (
        <>
          <sprite ref={wash} scale={1.42}>
            <spriteMaterial
              map={glow}
              color="#e2b85c"
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              opacity={0.62}
              toneMapped={false}
            />
          </sprite>
          <sprite scale={0.38}>
            <spriteMaterial
              map={glow}
              color="#efe6d6"
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              opacity={0.78}
              toneMapped={false}
            />
          </sprite>
        </>
      ) : null}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(location.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(location.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[chicago ? 0.07 : selected || hovered ? 0.044 : 0.018 + intensity * 0.022, 12, 12]} />
        <meshBasicMaterial
          ref={markMat}
          color={chicago ? "#e2b85c" : selected || hovered ? "#f2ead9" : "#d4b05a"}
          transparent
          opacity={chicago ? 0 : 1}
          depthWrite={false}
        />
      </mesh>
      {labelOn ? (
        <Html distanceFactor={36} position={[0.09, 0.07, 0]} style={{ pointerEvents: selected ? "auto" : "none" }}>
          <div className="world-mark-label whitespace-nowrap border-l border-leader/70">
            <p className="font-cond text-[12px] tracking-[0.1em] text-paper">{location.city.toUpperCase()}</p>
            {selected ? (
              <Link
                href={`/places/${location.slug}`}
                tabIndex={-1}
                aria-hidden
                className="mt-1 block font-cond text-[12px] tracking-[0.1em] text-leader hover:text-paper"
              >
                THE PLACE
              </Link>
            ) : null}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Arcs({ year }: { year: number }) {
  const chicago = catalog.locations.find((l) => l.id === "chicago");
  if (!chicago || year < 2001) return null;
  const from = latLonToVec(chicago.lat, chicago.lon, 1.64);
  return (
    <group>
      {catalog.locations
        .filter((l) => l.id !== "chicago" && l.glow > 0.2)
        .map((t) => {
          const to = latLonToVec(t.lat, t.lon, 1.64);
          const mid = from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(2.02);
          const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
          return <Line key={t.id} points={curve.getPoints(28)} color="#c4a05a" transparent opacity={year >= 2009 ? 0.14 : 0.08} lineWidth={1} />;
        })}
    </group>
  );
}

function CameraRig({
  lat,
  lon,
  flying,
  chicago,
  reduced,
  controls,
  onArrive,
}: {
  lat: number;
  lon: number;
  flying: boolean;
  chicago: boolean;
  reduced: boolean;
  controls: RefObject<OrbitControlsImpl | null>;
  onArrive: () => void;
}) {
  const { camera } = useThree();
  const dest = useMemo(() => latLonToVec(lat, lon, chicago ? CHICAGO_R : FLY_R), [lat, lon, chicago]);
  const startDir = useRef(new THREE.Vector3());
  const destDir = useRef(new THREE.Vector3());
  const startR = useRef(IDLE_R);
  const destR = useRef(FLY_R);
  const pullR = useRef(IDLE_R);
  const tween = useRef<ReturnType<typeof gsap.to> | null>(null);
  const destKey = `${lat.toFixed(3)}:${lon.toFixed(3)}:${chicago ? 1 : 0}`;

  useEffect(() => {
    const { gsap } = houseGsap();
    tween.current?.kill();
    tween.current = null;

    const persp = camera as THREE.PerspectiveCamera;
    const lock = () => {
      camera.position.copy(dest);
      camera.lookAt(LOOK);
      if (persp.isPerspectiveCamera) {
        persp.fov = FOV;
        persp.updateProjectionMatrix();
      }
      syncOrbit(controls.current);
    };

    if (!flying) return;

    if (reduced) {
      lock();
      onArrive();
      return;
    }

    startDir.current.copy(camera.position).normalize();
    destDir.current.copy(dest).normalize();
    startR.current = camera.position.length();
    destR.current = dest.length();
    const ang = startDir.current.angleTo(destDir.current);
    if (ang < 0.035 && Math.abs(startR.current - destR.current) < 0.07) {
      lock();
      onArrive();
      return;
    }
    pullR.current = Math.max(startR.current, destR.current) + Math.min(0.78, 0.32 + ang * 0.4);

    const flight = { u: 0 };
    const apply = (u: number) => {
      let r: number;
      if (u < 0.18) {
        const p = u / 0.18;
        r = THREE.MathUtils.lerp(startR.current, pullR.current, p * p);
        _dir.copy(startDir.current);
      } else {
        const p = (u - 0.18) / 0.82;
        const eased = 1 - (1 - p) ** 3;
        slerpDir(_dir, startDir.current, destDir.current, eased);
        r = THREE.MathUtils.lerp(pullR.current, destR.current, eased * eased);
      }
      camera.position.copy(_dir).multiplyScalar(r);
      camera.lookAt(LOOK);
      if (persp.isPerspectiveCamera) {
        persp.fov = FOV - 2.1 * Math.sin(u * Math.PI);
        persp.updateProjectionMatrix();
      }
    };

    tween.current = gsap.to(flight, {
      u: 1,
      duration: chicago ? 2.9 : 2.4,
      ease: "power2.inOut",
      onUpdate: () => apply(flight.u),
      onComplete: () => {
        lock();
        onArrive();
      },
    });

    return () => {
      tween.current?.kill();
      tween.current = null;
    };
  }, [flying, destKey, reduced, chicago, camera, dest, onArrive, controls]);

  useFrame(() => {
    if (flying) return;
    const persp = camera as THREE.PerspectiveCamera;
    if (persp.isPerspectiveCamera && Math.abs(persp.fov - FOV) > 0.04) {
      persp.fov += (FOV - persp.fov) * 0.08;
      persp.updateProjectionMatrix();
    }
  });
  return null;
}

function Sun({ reduced }: { reduced: boolean }) {
  const light = useRef<THREE.DirectionalLight>(null);
  useFrame(({ clock }) => {
    const t = reduced ? 0 : clock.elapsedTime * 0.048;
    const x = 3.2 + Math.sin(t) * 0.52;
    const y = 2.15 + Math.sin(t * 0.65) * 0.14;
    const z = 4 + Math.cos(t) * 0.42;
    SUN.set(x, y, z).normalize();
    if (light.current) light.current.position.set(x, y, z);
  });
  return <directionalLight ref={light} position={[3.2, 2.2, 4]} intensity={0.42} color="#efe6d6" />;
}

function WorldMap({
  cities,
  selected,
  year,
  onSelect,
}: {
  cities: Location[];
  selected: string;
  year: number;
  onSelect: (id: string) => void;
}) {
  return (
    <svg viewBox="0 0 360 180" className="h-full w-full" aria-hidden>
      <rect width="360" height="180" fill="#070706" />
      {CONTINENTS.map((ring, i) => (
        <path key={i} d={pathD(ring, 360, 180)} fill="#4a4030" stroke="#c4a05a" strokeOpacity="0.4" strokeWidth="0.4" />
      ))}
      {CUTS.map((ring, i) => (
        <path key={`cut-${i}`} d={pathD(ring, 360, 180)} fill="#070706" />
      ))}
      {cities.map((c) => {
        const x = ((c.lon + 180) / 360) * 360;
        const y = ((90 - c.lat) / 180) * 180;
        const loc = getLocation(c.id);
        const n = loc ? recordsToYear(loc, year) : 0;
        if (n === 0 && c.city !== "Chicago") return null;
        const chicago = c.city === "Chicago";
        return (
          <g key={c.id} onClick={() => onSelect(c.id)} className="cursor-pointer">
            {chicago ? <circle cx={x} cy={y} r="8" fill="#e8c36a" opacity="0.25" /> : null}
            <circle cx={x} cy={y} r={selected === c.id ? 4.5 : chicago ? 3.6 : 2.2} fill={chicago ? "#e8c36a" : "#c4a05a"} />
            {selected === c.id ? (
              <a href={`/places/${c.slug}`} tabIndex={-1} aria-hidden>
                <text x={x + 7} y={y - 7} fill="#efe6d6" fontSize="8" letterSpacing="0.14em">
                  {c.city.toUpperCase()}
                </text>
              </a>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function WorldGlobe() {
  const cities = useMemo(() => cityLocations(), []);
  const search = useSearchParams();
  const reduced = usePrefersReducedMotion();
  const narrow = useIsNarrow();
  const [year, setYear] = useState(2004);
  const [selected, setSelected] = useState("chicago");
  const [hovered, setHovered] = useState<string | null>(null);
  const [facing, setFacing] = useState<string[]>(["chicago"]);
  const [webgl, setWebgl] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [flying, setFlying] = useState(false);
  const [settling, setSettling] = useState(false);
  const controls = useRef<OrbitControlsImpl | null>(null);
  const loc = getLocation(selected);
  const records = loc ? recordsToYear(loc, year) : 0;
  const marks = useMemo(() => cities.filter((c) => markVisible(c, year)), [cities, year]);
  const path = useMemo(() => cityPath(cities, selected, facing, year), [cities, selected, facing, year]);
  const extras = path.filter((c) => c.id !== selected);

  useEffect(() => {
    if (!loc) return;
    if (records) return;
    const latest = Math.max(
      0,
      ...catalog.clips.filter((c) => getLocation(c.locationId)?.city === loc.city).map((c) => c.year),
    );
    if (latest > year) setYear(latest);
  }, [loc, records, year]);
  const useGlobe = mounted && !narrow && !reduced && webgl;
  const useMap = mounted && !useGlobe;

  useEffect(() => {
    setMounted(true);
    setWebgl(probeWebGL());
  }, []);

  useEffect(() => {
    const raw = search.get("city");
    if (!raw) return;
    const hit = cities.find((c) => c.id === raw || c.slug === raw || c.city.toLowerCase() === raw.toLowerCase());
    if (hit) setSelected(hit.id);
  }, [cities, search]);

  useEffect(() => {
    if (search.get("fly") === "1") setFlying(true);
  }, [search]);

  useEffect(() => {
    if (!settling) return;
    const t = window.setTimeout(() => setSettling(false), 1700);
    return () => window.clearTimeout(t);
  }, [settling]);

  const arrive = useCallback(() => {
    setFlying(false);
    setSettling(true);
    const ctrl = controls.current;
    if (!ctrl) return;
    syncOrbit(ctrl);
  }, []);

  const choose = useCallback((id: string) => {
    setSelected(id);
    setSettling(false);
    setFlying(true);
  }, []);

  const travel = useCallback((dir: 1 | -1) => {
    setSelected((cur) => {
      const i = cities.findIndex((c) => c.id === cur);
      return cities[(i + dir + cities.length) % cities.length].id;
    });
    setSettling(false);
    setFlying(true);
  }, [cities]);

  useEffect(() => {
    if (!useMap) return;
    setFacing(marks.map((c) => c.id));
  }, [useMap, marks]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") travel(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") travel(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [travel]);

  return (
    <div className="relative min-h-[calc(100svh-3.5rem)] pb-16 md:pb-0">
      <div className="absolute inset-0">
        {useMap ? (
          <WorldMap
            cities={cities}
            selected={selected}
            year={year}
            onSelect={choose}
          />
        ) : useGlobe ? (
          <Canvas
            camera={{ position: latLonToVec(IDLE_LAT, IDLE_LON, IDLE_R).toArray(), fov: FOV, near: 0.12, far: 90 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              const ctx = typeof gl.getContext === "function" ? gl.getContext() : undefined;
              if (ctx === null) setWebgl(false);
            }}
            onPointerDown={() => {
              if (flying) {
                setFlying(false);
                setSettling(false);
              }
            }}
          >
            <color attach="background" args={["#0a0908"]} />
            <ambientLight intensity={0.1} />
            <Sun reduced={reduced} />
            <pointLight position={[-2.2, -0.6, -2.8]} intensity={0.12} color="#c4a05a" />
            <FieldStars reduced={reduced} />
            <GlobeBody cities={cities} />
            <AtmosphereShell radius={1.66} frag={AIR_FRAG} side={THREE.FrontSide} additive />
            <AtmosphereShell radius={1.82} frag={LIMB_FRAG} />
            <AtmosphereShell radius={2.08} frag={HAZE_FRAG} additive />
            <Arcs year={year} />
            <FacingWatch cities={marks} onFacing={setFacing} />
            {cities.map((city) => (
              <CityMark
                key={city.id}
                location={city}
                selected={selected === city.id}
                hovered={hovered === city.id}
                year={year}
                reduced={reduced}
                onSelect={choose}
                onHover={setHovered}
              />
            ))}
            {loc ? (
              <CameraRig
                lat={loc.lat}
                lon={loc.lon}
                flying={flying}
                chicago={loc.city === "Chicago"}
                reduced={reduced}
                controls={controls}
                onArrive={arrive}
              />
            ) : null}
            <FilmGrade />
            <OrbitControls
              ref={controls}
              enabled={!flying}
              enablePan={false}
              enableRotate={!flying}
              enableZoom={!flying}
              minDistance={2.68}
              maxDistance={6.5}
              enableDamping={!reduced && !flying}
              autoRotate={!flying && !reduced && !settling}
              autoRotateSpeed={0.1}
              target={[0, 0.04, 0]}
              onStart={() => {
                setFlying(false);
                setSettling(false);
              }}
            />
          </Canvas>
        ) : (
          <div className="h-full w-full bg-void" />
        )}
      </div>

      <div className="world-dock pointer-events-none relative z-10 flex min-h-[calc(100svh-3.5rem)] flex-col justify-end px-4 pb-8 pt-6 md:px-6">
        <h1 className="sr-only">The World</h1>
        <div className="world-hud pointer-events-auto w-full max-w-[14rem]">
          <p className={`font-mono text-[12px] tracking-[0.12em] text-leader ${reduced ? "" : "year-register"}`}>
            {useMap ? `YEAR ${year} · MAP` : year}
          </p>
          <input
            type="range"
            min={1994}
            max={2026}
            value={year}
            aria-label="Year"
            onChange={(e) => setYear(Number(e.target.value))}
            className="world-year mt-3 w-full"
          />
          <p className="sr-only" aria-live="polite">
            {loc ? loc.city : ""}
          </p>
          <p className="sr-only">Arrow keys travel. Tab reaches a facing city and THE PLACE.</p>
          <nav className="world-cities" aria-label="Cities">
            {loc ? (
              <button
                type="button"
                className="world-city"
                aria-current="true"
                onClick={() => choose(loc.id)}
                onFocus={() => setHovered(loc.id)}
                onBlur={() => setHovered(null)}
              >
                {loc.city.toUpperCase()}
              </button>
            ) : null}
            {loc ? (
              <Link
                href={`/places/${loc.slug}`}
                className="world-place"
                onKeyDown={activateOnSpace}
                onFocus={() => setHovered(loc.id)}
                onBlur={() => setHovered(null)}
              >
                THE PLACE
              </Link>
            ) : null}
            {extras.map((city) => (
              <button
                key={city.id}
                type="button"
                className="world-city"
                onClick={() => choose(city.id)}
                onFocus={() => setHovered(city.id)}
                onBlur={() => setHovered(null)}
              >
                {city.city.toUpperCase()}
              </button>
            ))}
          </nav>
          {useMap ? (
            <div className="mt-5 flex items-center gap-6">
              <button
                type="button"
                onClick={() => travel(-1)}
                className="font-cond text-[12px] tracking-[0.1em] text-dust hover:text-paper"
              >
                PREV
              </button>
              <button
                type="button"
                onClick={() => travel(1)}
                className="font-cond text-[12px] tracking-[0.1em] text-dust hover:text-paper"
              >
                NEXT
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
