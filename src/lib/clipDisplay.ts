import type { ArchiveClip } from "@/data/types";
import { formatDuration } from "@/lib/format";
import { isAuthored } from "@/lib/visibility";

export function isUnlogged(clip: Pick<ArchiveClip, "id" | "tags">) {
  return !isAuthored(clip as ArchiveClip);
}

/** Short screen labels for a few verbatim upload titles; the catalog retains source wording. */
function screenTitle(title: string) {
  if (/^Curren\$y\s*-\s*Wiz Khalifa\s*-\s*NYC CMJ/.test(title)) return "Curren$y & Wiz Khalifa at NYC CMJ";
  if (title.startsWith("Woodstock 2009 - Curren$y")) return "Curren$y at Woodstock 2009";
  if (title.startsWith("Curren$y NYC CMJ - BBKings")) return "Curren$y at B.B. King Blues Club";
  if (title.startsWith("ESPN 30 FOR 30 DOCUMENTARY - BENJI 1984")) return "Benji | 30 for 30 trailer";
  return title.replace(/\s+-\s+(?:(?:WWW\.)?CREATIVECONTROL\.TV|CREATIVE CONTROL)\s*$/i, "").trim();
}

/** Authored shot-log title, or UNLOGGED — never an invented scene name. */
export function clipHeading(clip: Pick<ArchiveClip, "id" | "tags" | "title">) {
  return isUnlogged(clip) ? "UNLOGGED" : screenTitle(clip.title);
}

/** Museum caption — catalog, vault, or a narrator about the camera. Not a year beat. */
export function isCatalogLecture(title: string) {
  const t = title.toLowerCase();
  return t.includes("catalog") || /\bvault\b/.test(t) || /\bthe camera\b/.test(t);
}

/**
 * Year / decade film beat. Authored title, or cassette label if the year is only density.
 * Never UNLOGGED. Never a caption about the catalog or the camera.
 */
export function filmBeat(opts: {
  title: string;
  unlogged: boolean;
  tapeLabel?: string;
  projectTitle?: string;
  eraName?: string;
}) {
  if (opts.unlogged) return opts.tapeLabel ?? "";
  if (isCatalogLecture(opts.title)) {
    return opts.tapeLabel || opts.projectTitle || opts.eraName || "";
  }
  return opts.title;
}

/** On-air / GUIDE title. Unlogged density is never a program name. */
export function programTitle(clip: Pick<ArchiveClip, "id" | "tags" | "title">) {
  return isUnlogged(clip) ? "" : screenTitle(clip.title);
}

export function clipTechnical(
  clip: Pick<ArchiveClip, "startTimecode" | "duration" | "youtubeId">,
  tapeCode?: string,
) {
  if (clip.youtubeId) {
    return tapeCode ? `${tapeCode} · PUBLIC BROADCAST` : "PUBLIC BROADCAST";
  }
  const time = `${clip.startTimecode} · ${formatDuration(clip.duration)}`;
  return tapeCode ? `${tapeCode} · ${time}` : time;
}
