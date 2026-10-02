import type { ArchiveClip } from "@/data/types";

export type TVProgram = { clip: ArchiveClip; title: string; block: string; index: number };
export const ALL_PROGRAMS = "__all__";
/** A small allow-list also keeps clip return links free of arbitrary journey query values. */
export const TV_JOURNEY_IDS = ["homecoming", "early-chicago", "studio-connections"] as const;
export const TV_STARTERS = [
  "wiki-wikispeaks",
  "through-the-wire-official-video",
  "window-seat-one-take",
  "jeen-yuhs-slow-jamz-studio",
  "channel-zero-redman-erykah-badu",
  "a-cut-from-the-vault",
] as const;

export function tvChannel(raw: string | null, count: number, fallback: number) {
  if (!raw || !/^\d+$/.test(raw)) return fallback;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value < count ? value : fallback;
}

/** The same selection drives the guide and previous/next. Browsing never silently tunes the player. */
export function tvSelection(programs: TVProgram[], broadcast: boolean, block: string, query: string, journeyClipIds: readonly string[] = []) {
  const needle = query.trim().toLowerCase();
  if (broadcast && journeyClipIds.length && !block && !needle) {
    const byId = new Map(programs.map((program) => [program.clip.id, program]));
    return journeyClipIds.flatMap((id) => {
      const program = byId.get(id);
      return program ? [program] : [];
    });
  }
  if (broadcast && !block && !needle) {
    return TV_STARTERS.flatMap((slug) => {
      const program = programs.find((row) => row.clip.slug === slug);
      return program ? [program] : [];
    });
  }
  return programs.filter((program) => {
    if (block && block !== ALL_PROGRAMS && program.block !== block) return false;
    return !needle || `${program.title} ${program.clip.title} ${program.clip.year} ${program.block}`.toLowerCase().includes(needle);
  });
}

export function tvNeighbors(programs: TVProgram[], id?: string) {
  const position = programs.findIndex((program) => program.clip.id === id);
  return {
    position,
    previous: position > 0 ? programs[position - 1] : undefined,
    next: programs[position + 1],
  };
}

/** Preserve presentation settings while changing only TV-owned parameters. */
export function tvHref(current: string, patch: Record<string, string | null>) {
  const params = new URLSearchParams(current);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
  }
  return `/tv${params.size ? `?${params.toString()}` : ""}`;
}

export function tvClipHref(slug: string, programLink: string) {
  const query = programLink.split("?")[1] ?? "";
  const returnTo = tvHref(query, { clip: slug });
  return `/clip/${encodeURIComponent(slug)}?${new URLSearchParams({ tv: returnTo })}`;
}

/** Clip pages may return only to the TV lens, never to an arbitrary supplied URL. */
export function tvReturnHref(raw?: string) {
  if (!raw?.startsWith("/tv?") || raw.length > 2048) return undefined;
  const incoming = new URLSearchParams(raw.slice(4));
  const safe = new URLSearchParams();
  for (const key of ["ch", "clip", "block", "q", "page", "present"]) {
    const value = incoming.get(key);
    if (value) safe.set(key, value);
  }
  const journey = incoming.get("journey");
  if (journey && TV_JOURNEY_IDS.some((id) => id === journey)) safe.set("journey", journey);
  return tvHref(safe.toString(), {});
}
