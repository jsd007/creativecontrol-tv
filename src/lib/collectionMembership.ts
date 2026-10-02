import { catalog, getCollection } from "@/data";
import type { ArchiveClip } from "@/data/types";
import { isAuthored, isOnAir } from "@/lib/visibility";

/** Bind `/archive?collection=` id or slug to the catalog id. Unknown values stay as written. */
export function bindCollectionFilter(idOrSlug?: string) {
  if (!idOrSlug) return undefined;
  return getCollection(idOrSlug)?.id ?? idOrSlug;
}

/** Visitor-facing editorial membership includes real public releases as well as example records. */
export function inHouseCollection(clip: ArchiveClip, idOrSlug: string) {
  const collection = getCollection(idOrSlug);
  if (!collection) return false;
  if (!isAuthored(clip)) return false;
  return clip.collectionIds.includes(collection.id);
}

/** Only publicly discoverable members belong in the collection reel. */
export function inHouseCut(clip: ArchiveClip, idOrSlug: string) {
  return inHouseCollection(clip, idOrSlug) && isOnAir(clip);
}

export function houseClipsForCollection(idOrSlug: string) {
  return catalog.clips.filter((clip) => inHouseCollection(clip, idOrSlug));
}
