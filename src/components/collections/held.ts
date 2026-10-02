import { catalog } from "@/data";
import type { ArchiveClip } from "@/data/types";
import { inHouseCollection, inHouseCut } from "@/lib/collectionMembership";
import { isOnAir } from "@/lib/visibility";

/** Lead with real releases rather than making a visitor dig through concept records. */
export function storyFrames(id: string) {
  return catalog.clips
    .filter((clip) => inHouseCut(clip, id))
    .sort((a, b) => Number(Boolean(b.youtubeId)) - Number(Boolean(a.youtubeId)) || a.year - b.year || a.title.localeCompare(b.title));
}

/** Authored house leftover — not the public reel, not the collection Index facet. */
export function leftoverFrames(id: string) {
  return catalog.clips
    .filter((clip) => inHouseCollection(clip, id) && !isOnAir(clip))
    .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
}

export function yearSpan(frames: ArchiveClip[]) {
  if (!frames.length) return null;
  const first = Math.min(...frames.map((clip) => clip.year));
  const last = Math.max(...frames.map((clip) => clip.year));
  return first === last ? String(first) : `${first} — ${last}`;
}
