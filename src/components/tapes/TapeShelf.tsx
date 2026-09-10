"use client";

import type { SourceTape } from "@/data/types";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type ShelfKey = "storage" | "vault" | "phone" | "studio" | "broadcast" | "unopened";

const BAYS: Array<{ key: Exclude<ShelfKey, "unopened">; label: string; note: string; match: (loc: string) => boolean }> = [
  { key: "storage", label: "STORAGE", note: "CAMERA ORIGINALS", match: (loc) => loc.includes("storage") || loc.includes("time path") },
  { key: "vault", label: "DIGITAL VAULT", note: "INGESTED FILES", match: (loc) => loc.includes("digital") },
  { key: "phone", label: "PHONE", note: "BACKUP", match: (loc) => loc.includes("phone") },
  { key: "studio", label: "STUDIO", note: "LATER WORK", match: (loc) => loc.includes("studio") && !loc.includes("time") },
  { key: "broadcast", label: "BROADCAST", note: "NOT CAMERA ORIGINALS", match: (loc) => loc.includes("youtube") },
];

export function shelfOf(tape: SourceTape): Exclude<ShelfKey, "unopened"> {
  const loc = tape.physicalLocation.toLowerCase();
  return BAYS.find((b) => b.match(loc))?.key ?? "storage";
}

export function shelfBays() {
  return BAYS.map(({ key, label, note }) => ({ key, label, note }));
}

export function splitRack<T>(items: T[]): { left: T[]; right: T[] } {
  const mid = Math.ceil(items.length / 2);
  return { left: items.slice(0, mid), right: items.slice(mid) };
}

export function emptyFill(have: number, min = 0) {
  return Math.max(0, min - have);
}

export function TapeShelf({
  label,
  note,
  recede = false,
  approach = false,
  reduced = false,
  compact = false,
  depth = 0,
  left,
  right,
  children,
}: {
  label: string;
  note?: string;
  recede?: boolean;
  approach?: boolean;
  reduced?: boolean;
  compact?: boolean;
  depth?: number;
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
}) {
  const rail = compact || reduced || !right;
  const rest = Math.max(-depth * 34, -136);

  return (
    <motion.section
      aria-label={note ? `${label}, ${note}` : label}
      className={recede ? "aisle-bay is-recede" : "aisle-bay"}
      initial={false}
      animate={
        reduced || compact
          ? { z: 0, y: 0, rotateX: 0, scale: 1 }
          : {
              z: recede ? -88 : approach ? 16 : rest,
              y: recede ? 10 : 0,
              rotateX: 0,
              scale: 1,
            }
      }
      style={reduced || compact ? { transform: "none" } : { transformStyle: "preserve-3d" }}
      transition={{ duration: 0.82, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="aisle-lintel">
        <p>{label}</p>
      </div>

      {rail ? (
        <div className="aisle-rail">{left ?? children}</div>
      ) : (
        <div className="aisle-corridor">
          <div className="aisle-upright" aria-hidden />
          <div className="aisle-wall aisle-wall-l">{left}</div>
          <div className="aisle-well" aria-hidden>
            <div className="aisle-floor" />
          </div>
          <div className="aisle-wall aisle-wall-r">{right}</div>
          <div className="aisle-upright" aria-hidden />
        </div>
      )}

      <div className="aisle-lip" aria-hidden />
      <div className="aisle-lip-depth" aria-hidden />
    </motion.section>
  );
}
