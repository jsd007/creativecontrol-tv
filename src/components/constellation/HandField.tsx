"use client";

import { useMemo, type CSSProperties } from "react";
import {
  STAR_KIND_LABEL,
  constellationHref,
  type Constellation,
  type StarKind,
  type StarNode,
} from "@/lib/constellation";
import { activateOnSpace } from "@/lib/keys";

/** Portrait pocket — not the desktop 1440 void scaled down. */
const VB = { w: 360, h: 500, cx: 180, cy: 250, r: 136 };
const CLEAR = 102;

/** Same ethic as the deep field: people closer; work, place, frames farther. Not a clock. */
const KIND_SLOT: Record<StarKind, { r: number; bearings: number[] }> = {
  person: { r: 0.68, bearings: [210, 158, 248] },
  project: { r: 0.8, bearings: [-86] },
  track: { r: 0.8, bearings: [22] },
  place: { r: 0.9, bearings: [114] },
  clip: { r: 1.02, bearings: [60, -158] },
  event: { r: 0.88, bearings: [198] },
};

function pocketLabel(label: string) {
  const up = label.toUpperCase();
  return up.length > 26 ? `${up.slice(0, 25)}…` : up;
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
  const bearing = row.bearings[index] ?? row.bearings[0] + (index + 1) * 32;
  return { r: row.r, bearing };
}

function minClear(a: StarNode, b: StarNode) {
  return 70 + Math.min(a.label.length, 16) * 1.8 + Math.min(b.label.length, 16) * 1.8;
}

function at(n: number) {
  return Math.round(n * 10) / 10;
}

function settle(node: StarNode, deg: number, radius: number) {
  const r = Math.max(CLEAR, radius);
  const rad = (deg * Math.PI) / 180;
  const x = at(Math.min(330, Math.max(30, VB.cx + Math.cos(rad) * r)));
  const y = at(Math.min(470, Math.max(26, VB.cy + Math.sin(rad) * r)));
  return { node, deg, radius: r, x, y };
}

function placePocket(nodes: StarNode[]) {
  const seen: Partial<Record<StarKind, number>> = {};
  const placed = nodes.map((node) => {
    const index = seen[node.kind] ?? 0;
    seen[node.kind] = index + 1;
    const slot = slotFor(node.kind, index);
    const h = hash32(`${node.kind}:${node.id}`);
    const jitterA = ((h & 0xff) / 255 - 0.5) * 5;
    const jitterR = (((h >>> 8) & 0xff) / 255 - 0.5) * 0.025;
    return settle(node, slot.bearing + jitterA, VB.r * (slot.r + jitterR));
  });

  for (let pass = 0; pass < 5; pass += 1) {
    for (let i = 0; i < placed.length; i += 1) {
      for (let k = 0; k < i; k += 1) {
        const dx = placed[i].x - placed[k].x;
        const dy = placed[i].y - placed[k].y;
        if (Math.hypot(dx, dy) >= minClear(placed[i].node, placed[k].node)) continue;
        placed[i] = settle(
          placed[i].node,
          placed[i].deg + (pass % 2 === 0 ? 10 : -10),
          Math.min(168, placed[i].radius + 10),
        );
      }
    }
  }
  return placed;
}

function nameSize(name: string) {
  if (name.length > 22) return "1.22rem";
  if (name.length > 16) return "1.45rem";
  if (name.length > 10) return "1.75rem";
  if (name.length > 6) return "2.05rem";
  return "2.2rem";
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

export function HandField({
  field,
  hover,
  onHover,
}: {
  field: Constellation;
  hover: StarNode | null;
  onHover: (node: StarNode | null) => void;
}) {
  const placed = useMemo(() => placePocket(field.nodes), [field.nodes]);
  const size = nameSize(field.center.shortName);
  const rule = Math.min(5.4, Math.max(2.1, field.center.shortName.length * 0.36));

  return (
    <div
      className="hand-field"
      role="group"
      aria-label={`${field.center.shortName} and connected records`}
      onPointerDown={(e) => {
        if (!(e.target instanceof Element) || e.target.closest("a")) return;
        onHover(null);
      }}
    >
      <div className="hand-field-pocket">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="hand-field-void"
          aria-hidden
        >
          {placed.map(({ node, x, y }, i) => {
            const on = isOn(hover, node);
            const dim = !!hover && !on;
            return (
              <g key={`spoke-${node.kind}-${node.id}`}>
                <line
                  className="spoke-draw"
                  pathLength={1}
                  x1={VB.cx}
                  y1={VB.cy}
                  x2={x}
                  y2={y}
                  stroke={on ? "#c4a05a" : "#efe6d6"}
                  strokeOpacity={on ? 0.7 : dim ? 0.06 : 0.2}
                  strokeWidth={on ? 1.2 : 1}
                  vectorEffect="non-scaling-stroke"
                  style={{ animationDelay: `${0.04 + i * 0.045}s` }}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={on ? 2.6 : 1.8}
                  fill={on ? "#c4a05a" : "#efe6d6"}
                  fillOpacity={on ? 0.9 : dim ? 0.14 : 0.4}
                />
              </g>
            );
          })}
        </svg>

        <a
          href={field.center.href}
          className="hand-name star-center"
          onKeyDown={activateOnSpace}
        >
          <span className="hand-name-type" style={{ fontSize: size }}>
            {field.center.shortName}
          </span>
          <span className="hand-name-rule" style={{ width: `${rule}rem` }} />
          <span className="hand-name-open">OPEN</span>
        </a>

        {placed.map(({ node, x, y }, i) => {
          const on = isOn(hover, node);
          const dim = !!hover && !on;
          const fromX = `${(((VB.cx - x) / VB.w) * 18).toFixed(1)}%`;
          const fromY = `${(((VB.cy - y) / VB.h) * 18).toFixed(1)}%`;
          return (
            <a
              key={`${node.kind}-${node.id}`}
              href={starHref(node)}
              className={`hand-star${on ? " is-on" : ""}${dim ? " is-dim" : ""}${node.kind === "clip" ? " is-clip" : ""}`}
              style={{ left: `${(x / VB.w) * 100}%`, top: `${(y / VB.h) * 100}%` }}
              onPointerDown={() => onHover(node)}
              onFocus={() => onHover(node)}
              onBlur={() => onHover(null)}
              onKeyDown={activateOnSpace}
            >
              <span
                className="hand-star-copy star-label"
                style={
                  {
                    "--from-x": fromX,
                    "--from-y": fromY,
                    animationDelay: `${0.1 + i * 0.05}s`,
                  } as CSSProperties
                }
              >
                <span className="hand-star-kind">{STAR_KIND_LABEL[node.kind]}</span>
                <span className="hand-star-name">{pocketLabel(node.label)}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
