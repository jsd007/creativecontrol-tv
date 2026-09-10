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

export function emptyFill(have: number, min = 4) {
  return Math.max(0, min - have);
}

export function TapeShelf({
  label,
  note,
  recede = false,
  approach = false,
  reduced = false,
  compact = false,
  depth: _depth = 0,
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

  return (
    <motion.section
      aria-label={label}
      className={recede ? "aisle-bay is-recede" : "aisle-bay"}
      initial={false}
      animate={
        reduced || compact
          ? { z: 0, y: 0, rotateX: 0, scale: 1 }
          : {
              z: recede ? -72 : approach ? 20 : 0,
              y: recede ? 8 : 0,
              rotateX: 0,
              scale: 1,
            }
      }
      style={reduced || compact ? { transform: "none" } : { transformStyle: "preserve-3d" }}
      transition={{ duration: 0.82, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="aisle-lintel">
        <p className="font-cond text-[12px] tracking-[0.22em] text-dust">{label}</p>
        {note ? <p className="font-mono text-[9px] tracking-[0.16em] text-dust/55">{note}</p> : null}
      </div>

      {rail ? (
        <div className="aisle-rail">{left ?? children}</div>
      ) : (
        <div className="aisle-corridor">
          <div className="aisle-upright" aria-hidden />
          <div className="aisle-wall aisle-wall-l">{left}</div>
          <div className="aisle-well" aria-hidden>
            <div className="aisle-floor" />
            <p className="aisle-placard">{label}</p>
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
