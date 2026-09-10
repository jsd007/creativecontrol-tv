import { catalog, getCollection } from "@/data";
import type { ArchiveClip } from "@/data/types";
import { isOfficialHolding } from "@/lib/holdings";
import { isAuthored, isOnAir } from "@/lib/visibility";

/** Bind `/archive?collection=` id or slug to the catalog id. Unknown values stay as written. */
export function bindCollectionFilter(idOrSlug?: string) {
  if (!idOrSlug) return undefined;
  return getCollection(idOrSlug)?.id ?? idOrSlug;
}

/** Editorial house membership. Official CH 07 uploads are holdings, not the cut. */
export function inHouseCollection(clip: ArchiveClip, idOrSlug: string) {
  const collection = getCollection(idOrSlug);
  if (!collection) return false;
  if (!isAuthored(clip) || isOfficialHolding(clip)) return false;
  return clip.collectionIds.includes(collection.id);
}

/** Same public house cut the collection reel films. Held remainder is not this cut. */
export function inHouseCut(clip: ArchiveClip, idOrSlug: string) {
  return inHouseCollection(clip, idOrSlug) && isOnAir(clip);
}

export function houseClipsForCollection(idOrSlug: string) {
  return catalog.clips.filter((clip) => inHouseCollection(clip, idOrSlug));
}
