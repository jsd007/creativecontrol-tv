import { catalog, getLocation, getTape } from "@/data";
import type { ArchiveClip, SourceTape } from "@/data/types";
import { clipHeading, isUnlogged } from "@/lib/clipDisplay";
import { isAuthored } from "@/lib/visibility";

/** Official @cctelevisionchannel embed — a holding, not a camera original. */
export function isOfficialHolding(clip: Pick<ArchiveClip, "id" | "tags" | "youtubeId">) {
  return Boolean(clip.youtubeId) && isAuthored(clip as ArchiveClip);
}

export function holdingPlace(clip: Pick<ArchiveClip, "locationId">) {
  return getLocation(clip.locationId)?.name ?? "";
}

/** Citation for an official upload. Place is whatever the record already has. */
export function holdingLine(clip: ArchiveClip) {
  const title = clipHeading(clip);
  const place = holdingPlace(clip);
  return place ? `${clip.year} · ${title} · BROADCAST · ${place}` : `${clip.year} · ${title} · BROADCAST`;
}

export function sortHoldings(clips: ArchiveClip[]) {
  return [...clips].sort((a, b) => {
    const aExact = a.dateExact ?? "";
    const bExact = b.dateExact ?? "";
    if (aExact && bExact && aExact !== bExact) return aExact.localeCompare(bExact);
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    return clipHeading(a).localeCompare(clipHeading(b));
  });
}

export function officialHoldings(clips: ArchiveClip[] = catalog.clips) {
  return clips.filter(isOfficialHolding);
}

/** Lead official title for a year through-line. Never UNLOGGED. */
export function holdingLead(clips: ArchiveClip[]) {
  const list = officialHoldings(clips).filter((c) => !isUnlogged(c));
  if (!list.length) return undefined;
  return list.find((c) => c.featured) ?? sortHoldings(list)[0];
}

export function holdingsByYear(clips: ArchiveClip[]) {
  const map = new Map<number, ArchiveClip[]>();
  for (const clip of officialHoldings(clips)) {
    const list = map.get(clip.year) ?? [];
    list.push(clip);
    map.set(clip.year, list);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, yearClips]) => ({ year, clips: sortHoldings(yearClips) }));
}

export type BroadcastYear = {
  key: string;
  year: number;
  clips: ArchiveClip[];
};

export function broadcastYearKey(year: number) {
  return `broadcast-${year}`;
}

export function parseBroadcastYearKey(id: string) {
  const match = /^broadcast-(\d{4})$/.exec(id);
  return match ? Number(match[1]) : null;
}

export function broadcastYears(clips: ArchiveClip[] = catalog.clips): BroadcastYear[] {
  return holdingsByYear(clips).map(({ year, clips: yearClips }) => ({
    key: broadcastYearKey(year),
    year,
    clips: yearClips,
  }));
}

export function broadcastYearTape(year: number): SourceTape | undefined {
  const base = getTape("t-broadcast");
  if (!base) return undefined;
  return {
    ...base,
    id: broadcastYearKey(year),
    year,
    recordedApproximate: String(year),
  };
}
