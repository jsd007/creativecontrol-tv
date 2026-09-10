import type { ArchiveClip } from "@/data/types";

export function formatDuration(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    return `${h}:${String(m % 60).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }
  return `${m}:${String(r).padStart(2, "0")}`;
}

export const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
] as const;

export const MONTHS_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] as const;

export function formatDate(clip: Pick<ArchiveClip, "dateExact" | "dateApproximate" | "year">) {
  const exact = parseArchiveDate(clip.dateExact);
  if (exact) return `${MONTHS_SHORT[exact.month - 1]} ${exact.day} ${exact.year}`;
  if (clip.dateApproximate) return clip.dateApproximate.toUpperCase();
  return String(clip.year);
}

export function parseArchiveDate(raw?: string) {
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const [year, month, day] = raw.split("-").map(Number);
  return { year, month, day, key: raw };
}

export function clipWhen(
  clip: Pick<ArchiveClip, "dateExact" | "year" | "sourceTapeId">,
  tapeDate?: string,
) {
  const exact = parseArchiveDate(clip.dateExact);
  if (exact) return { ...exact, undated: false };
  const tape = parseArchiveDate(tapeDate);
  if (tape && tape.year === clip.year) return { ...tape, undated: false };
  return { year: clip.year, month: null as number | null, day: null as number | null, key: `${clip.year}-UNDATED`, undated: true };
}

export function visibilityLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function hashHue(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) % 360;
  return h;
}

const SMPTE = /^(\d{2}):(\d{2}):(\d{2}):(\d{2})$/;

export function smpteToSeconds(tc: string, fps = 30) {
  const m = tc.match(SMPTE);
  if (!m) return 0;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / fps;
}

export function secondsToSmpte(total: number, fps = 30) {
  const frames = Math.max(0, Math.round(total * fps));
  const f = frames % fps;
  const sec = Math.floor(frames / fps);
  const s = sec % 60;
  const m = Math.floor(sec / 60) % 60;
  const h = Math.floor(sec / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

/** Tape-absolute timecode from a clip SMPTE start plus seconds. */
export function offsetSmpte(base: string, offsetSeconds: number, fps = 30) {
  return secondsToSmpte(smpteToSeconds(base, fps) + offsetSeconds, fps);
}
