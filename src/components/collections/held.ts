import { catalog } from "@/data";
import type { ArchiveClip } from "@/data/types";
import { inHouseCollection, inHouseCut } from "@/lib/collectionMembership";
import { isOnAir } from "@/lib/visibility";

/** House editorial PUBLIC frames already in the cut. Official CH 07 uploads stay on Index / timeline / BROADCAST. */
export function storyFrames(id: string) {
  return catalog.clips
    .filter((clip) => inHouseCut(clip, id))
    .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
}

/** Authored house leftover — not the public reel, not the collection Index facet. */
export function leftoverFrames(id: string) {
  return catalog.clips
    .filter((clip) => inHouseCollection(clip, id) && !isOnAir(clip))
    .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
}

export function yearSpan(frames: ArchiveClip[]) {
  if (!frames.length) return null;
  const first = frames[0].year;
  const last = frames[frames.length - 1].year;
  return first === last ? String(first) : `${first} — ${last}`;
}
