"use client";

import { useGSAP } from "@gsap/react";
import { useMemo, useRef } from "react";
import {
  STAR_KIND_LABEL,
  constellationHref,
  type Constellation,
  type StarKind,
  type StarNode,
} from "@/lib/constellation";
import { houseGsap } from "@/lib/gsap";
import { activateOnSpace } from "@/lib/keys";
import { GATE_EASE } from "@/lib/motion";

const VB = { w: 1440, h: 900, cx: 720, cy: 400, r: 268 };

/** Authored bearings — not an equal clock. People west; work high; place and frames farther. */
const KIND_SLOT: Record<StarKind, { r: number; bearings: number[] }> = {
  person: { r: 0.5, bearings: [186, 138, 258] },
  project: { r: 0.88, bearings: [-88] },
  track: { r: 0.84, bearings: [12] },
  place: { r: 0.96, bearings: [102] },
  clip: { r: 1.1, bearings: [48, -150] },
  event: { r: 0.96, bearings: [200] },
};

function fieldLabel(label: string) {
  const up = label.toUpperCase();
  return up.length > 22 ? `${up.slice(0, 21)}…` : up;
}

function hash32(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function slotFor(kind: StarKind, index: number) {
  const row = KIND_SLOT[kind];
  const bearing = row.bearings[index] ?? row.bearings[0] + (index + 1) * 34;
  return { r: row.r, bearing };
}

function minClear(a: StarNode, b: StarNode) {
  return 84 + Math.min(a.label.length, 18) * 2.4 + Math.min(b.label.length, 18) * 2.4;
}

function at(n: number) {
  return Math.round(n * 10) / 10;
}

function settle(node: StarNode, deg: number, radius: number) {
  const rad = (deg * Math.PI) / 180;
  const x = at(Math.min(1320, Math.max(120, VB.cx + Math.cos(rad) * radius)));
  const y = at(Math.min(820, Math.max(96, VB.cy + Math.sin(rad) * radius)));
  const lx = at(Math.min(1320, Math.max(120, VB.cx + Math.cos(rad) * (radius + 26))));
  const ly = at(Math.min(820, Math.max(96, VB.cy + Math.sin(rad) * (radius + 26))));
  return { node, deg, radius, x, y, lx, ly };
}

function placeField(nodes: StarNode[]) {
  const seen: Partial<Record<StarKind, number>> = {};
  const placed = nodes.map((node) => {
    const index = seen[node.kind] ?? 0;
    seen[node.kind] = index + 1;
    const slot = slotFor(node.kind, index);
    const h = hash32(`${node.kind}:${node.id}`);
    const jitterA = ((h & 0xff) / 255 - 0.5) * 6;
    const jitterR = (((h >>> 8) & 0xff) / 255 - 0.5) * 0.03;
    return settle(node, slot.bearing + jitterA, VB.r * (slot.r + jitterR));
  });

  for (let pass = 0; pass < 5; pass += 1) {
    for (let i = 0; i < placed.length; i += 1) {
      for (let k = 0; k < i; k += 1) {
        const dx = placed[i].lx - placed[k].lx;
        const dy = placed[i].ly - placed[k].ly;
        const need = minClear(placed[i].node, placed[k].node);
        if (Math.hypot(dx, dy) >= need) continue;
        placed[i] = settle(
          placed[i].node,
          placed[i].deg + (pass % 2 === 0 ? 9 : -9),
          Math.min(340, placed[i].radius + 14),
        );
      }
    }
  }
  return placed;
}

function centerSize(name: string) {
  if (name.length > 26) return 22;
  if (name.length > 18) return 26;
  if (name.length > 14) return 32;
  if (name.length > 9) return 44;
  return 62;
}

function starHref(node: StarNode) {
  if (node.kind === "person" || node.kind === "place" || node.kind === "project") {
    return constellationHref(node.kind, node.id);
  }
  return node.href;
}

function isOn(hover: StarNode | null, node: StarNode) {
  return !!hover && hover.kind === node.kind && hover.id === node.id;
}

/** Denser bonds sit brighter on the same hairline — a ramp the eye reads, not a chart it measures. */
function spokeInk(node: StarNode, heaviest: number) {
  if (!node.weight || heaviest <= 1) return 0.16;
  return 0.1 + Math.min(1, node.weight.frames / heaviest) * 0.17;
}

export function DeepField({
  field,
  reduced,
  hover,
  onHover,
}: {
  field: Constellation;
  reduced: boolean;
  hover: StarNode | null;
  onHover: (node: StarNode | null) => void;
}) {
  const root = useRef<SVGSVGElement>(null);
  const placed = useMemo(() => placeField(field.nodes), [field.nodes]);
  const heaviest = useMemo(
    () => field.nodes.reduce((max, node) => Math.max(max, node.weight?.frames ?? 0), 0),
    [field.nodes],
  );
  const size = centerSize(field.center.shortName);
  const underline = Math.min(112, Math.max(36, field.center.shortName.length * size * 0.18));

  useGSAP(
    () => {
      const { gsap } = houseGsap();
      if (!root.current || reduced) return;
      const q = gsap.utils.selector(root);
      const spokes = q(".field-spoke");
      const stars = q(".field-star");
      const name = q(".field-name");
      const rule = q(".field-rule");
      const open = q(".field-open");

      gsap.set(spokes, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(name, { opacity: 0, letterSpacing: "0.14em" });
      gsap.set(rule, { scaleX: 0, transformOrigin: "50% 50%" });
      gsap.set(open, { opacity: 0 });
      stars.forEach((el) => {
        if (!(el instanceof SVGElement)) return;
        const fromX = Number(el.dataset.fromX ?? 0);
        const fromY = Number(el.dataset.fromY ?? 0);
        gsap.set(el, { opacity: 0, x: fromX, y: fromY });
      });

      gsap
        .timeline({ defaults: { ease: GATE_EASE } })
        .to(name, { opacity: 1, letterSpacing: "0em", duration: 0.88 }, 0)
        .to(rule, { scaleX: 1, duration: 0.55 }, 0.12)
        .to(spokes, { strokeDashoffset: 0, duration: 1.05, stagger: 0.048 }, 0.06)
        .to(stars, { opacity: 1, x: 0, y: 0, duration: 0.82, stagger: 0.05 }, 0.18)
        .to(open, { opacity: 1, duration: 0.42 }, 0.52);
    },
    { scope: root, dependencies: [field.center.kind, field.center.id, reduced] },
  );

  return (
    <svg
      ref={root}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      className="mx-auto block h-[calc(100svh-3.5rem)] w-full max-w-[1500px]"
      role="group"
      aria-label={`${field.center.shortName} and connected records`}
    >
      {placed.map(({ node, x, y }) => {
        const on = isOn(hover, node);
        const dim = !!hover && !on;
        const ink = spokeInk(node, heaviest);
        return (
          <g key={`spoke-${node.kind}-${node.id}`}>
            <line
              className="field-spoke"
              pathLength={1}
              x1={VB.cx}
              y1={VB.cy}
              x2={x}
              y2={y}
              stroke={on ? "#c4a05a" : "#efe6d6"}
              strokeOpacity={on ? 0.72 : dim ? 0.05 : ink}
              strokeWidth={on ? 1.15 : 1}
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={x}
              cy={y}
              r={on ? 2.4 : 1.7}
              fill={on ? "#c4a05a" : "#efe6d6"}
              fillOpacity={on ? 0.9 : dim ? 0.12 : 0.24 + ink}
            />
          </g>
        );
      })}

      <g style={{ opacity: hover ? 0.62 : 1 }}>
        <g className="field-name">
          <text
            x={VB.cx}
            y={VB.cy - 6}
            textAnchor="middle"
            fill="#efe6d6"
            style={{ fontFamily: "var(--font-display)", fontSize: size }}
          >
            {field.center.shortName}
          </text>
          <line
            className="field-rule"
            x1={VB.cx - underline / 2}
            y1={VB.cy + 14}
            x2={VB.cx + underline / 2}
            y2={VB.cy + 14}
            stroke="#c4a05a"
            strokeOpacity="0.55"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </g>
      <a href={field.center.href} className="field-open cursor-pointer" onKeyDown={activateOnSpace}>
        <text
          x={VB.cx}
          y={VB.cy + 36}
          textAnchor="middle"
          fill="#c4a05a"
          style={{ fontFamily: "var(--font-cond)", fontSize: 11, letterSpacing: "0.28em" }}
        >
          OPEN
        </text>
      </a>

      {placed.map(({ node, lx, ly }) => {
        const on = isOn(hover, node);
        const dim = !!hover && !on;
        const clip = node.kind === "clip";
        return (
          <a
            key={`${node.kind}-${node.id}`}
            href={starHref(node)}
            className="cursor-pointer"
            onMouseEnter={() => onHover(node)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(node)}
            onBlur={() => onHover(null)}
            onKeyDown={activateOnSpace}
          >
            <circle className="field-hit" cx={lx} cy={ly} r={42} fill="transparent" />
            <g style={{ opacity: dim ? 0.28 : 1 }}>
              <g
                className="field-star"
                data-from-x={((VB.cx - lx) * 0.18).toFixed(1)}
                data-from-y={((VB.cy - ly) * 0.18).toFixed(1)}
              >
              <text
                x={lx}
                y={ly - (clip ? 7 : 9)}
                textAnchor="middle"
                fill={on ? "#c4a05a" : "#8a8478"}
                style={{
                  fontFamily: "var(--font-cond)",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                }}
              >
                {STAR_KIND_LABEL[node.kind]}
              </text>
              <text
                x={lx}
                y={ly + (clip ? 9 : 11)}
                textAnchor="middle"
                fill={on ? "#efe6d6" : clip ? "#8a8478" : "#d8d0c2"}
                style={{
                  fontFamily: "var(--font-cond)",
                  fontSize: clip ? 13 : 16,
                  letterSpacing: "0.08em",
                }}
              >
                {fieldLabel(node.label)}
              </text>
              </g>
            </g>
          </a>
        );
      })}
    </svg>
  );
}
