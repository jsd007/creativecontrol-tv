import type { ArchiveClip, Visibility } from "@/data/types";
import { visibilityLabel } from "@/lib/format";

/** Surprise doors only land on PUBLIC footage — never restricted, private, or coming-soon. */
export function isDiscoverable(clip: Pick<ArchiveClip, "visibility">) {
  return clip.visibility === "PUBLIC";
}

/** Authored mock objects — not expand.ts density. */
export function isAuthored(clip: ArchiveClip) {
  return clip.id.startsWith("c-") && !clip.tags.includes("generated");
}

/** Television airs named leftovers, not unlogged density or closed statuses. */
export function isOnAir(clip: ArchiveClip) {
  return isAuthored(clip) && clip.visibility === "PUBLIC";
}

/** A record the visitor can reach, but the picture is not on air. */
export function isClosed(clip: Pick<ArchiveClip, "visibility">) {
  return clip.visibility !== "PUBLIC";
}

const HOLD_RANK: Visibility[] = [
  "PRIVATE",
  "RESTRICTED",
  "PENDING_CLEARANCE",
  "MEMBERS_ONLY",
  "UNLISTED",
  "COMING_SOON",
];

export type HoldCopy = {
  status: string;
  line: string;
};

/** Catalog language for a closed frame. Never “access denied.” */
export function holdFor(
  clip: Pick<ArchiveClip, "visibility" | "rightsStatus" | "sensitivityStatus">,
): HoldCopy {
  const status = visibilityLabel(clip.visibility);
  switch (clip.visibility) {
    case "UNLISTED":
      return { status, line: "On the cassette. Not on the public sheet." };
    case "PRIVATE":
      return { status, line: "Held. The record is here. The picture is not." };
    case "COMING_SOON":
      return { status, line: "Logged. Not released in this cut." };
    case "MEMBERS_ONLY":
      return { status, line: "A house cut. Not the public sheet." };
    case "RESTRICTED":
      return {
        status,
        line:
          clip.sensitivityStatus === "CONTEXT_REQUIRED"
            ? "Context required. Not on air."
            : "Held. Not treated as on air.",
      };
    case "PENDING_CLEARANCE":
      return {
        status,
        line:
          clip.rightsStatus === "MUSIC_PENDING"
            ? "Logged. Music is not cleared."
            : clip.rightsStatus === "APPEARANCE_PENDING"
              ? "Logged. Appearance is not cleared."
              : "The frame is logged. The rights are not.",
      };
    default:
      return { status, line: "" };
  }
}

/** Strictest authored hold on a cassette — or a mixed count. */
export function tapeHold(clips: ArchiveClip[]) {
  const authored = clips.filter(isAuthored);
  const closed = authored.filter(isClosed);
  if (!authored.length || !closed.length) return null;
  if (closed.length === authored.length) {
    const vis = [...closed]
      .map((c) => c.visibility)
      .sort((a, b) => HOLD_RANK.indexOf(a) - HOLD_RANK.indexOf(b))[0];
    return { all: true as const, status: visibilityLabel(vis), count: closed.length };
  }
  return { all: false as const, status: `${closed.length} HELD`, count: closed.length };
}
