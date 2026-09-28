import type { ArchiveClip } from "@/data/types";

export type TVProgram = { clip: ArchiveClip; title: string; block: string; index: number };
export const ALL_PROGRAMS = "__all__";
export const TV_STARTERS = [
  "wiki-wikispeaks",
  "curren-y-wiz-khalifa-nyc-cmj-2009-www-creativecontrol-tv",
  "channel-zero-redman-erykah-badu",
  "tear-up",
  "pro-era-beast-coastal",
  "vision-behind-window-seat",
] as const;

export function tvChannel(raw: string | null, count: number, fallback: number) {
  if (!raw || !/^\d+$/.test(raw)) return fallback;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value < count ? value : fallback;
}

/** The same selection drives the guide and previous/next. Browsing never silently tunes the player. */
export function tvSelection(programs: TVProgram[], broadcast: boolean, block: string, query: string) {
  const needle = query.trim().toLowerCase();
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
