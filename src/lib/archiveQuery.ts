import {
  catalog,
  getAlbum,
  getCollection,
  getLocation,
  getPerson,
  getProject,
  getTape,
  getTrack,
  transcriptSearchText,
} from "@/data";
import { bindCollectionFilter, inHouseCut } from "@/lib/collectionMembership";
import { MONTHS_SHORT } from "@/lib/format";
import type { ArchiveClip, ClipType } from "@/data/types";
import { isAuthored, isDiscoverable } from "@/lib/visibility";

export type ArchiveFilters = {
  q?: string;
  era?: string;
  year?: string;
  location?: string;
  person?: string;
  track?: string;
  album?: string;
  project?: string;
  event?: string;
  type?: string;
  collection?: string;
  month?: string;
  day?: string;
};

export function parseFilters(sp: Record<string, string | string[] | undefined>): ArchiveFilters {
  const one = (key: keyof ArchiveFilters) => {
    const v = sp[key];
    return typeof v === "string" && v.length ? v : undefined;
  };
  return {
    q: one("q"),
    era: one("era"),
    year: one("year"),
    location: one("location"),
    person: one("person"),
    track: one("track"),
    album: one("album"),
    project: one("project"),
    event: one("event"),
    type: one("type"),
    collection: bindCollectionFilter(one("collection")),
    month: one("month"),
    day: one("day"),
  };
}

function matchesQuery(clip: ArchiveClip, q: string) {
  const personNames = clip.peopleIds.map((id) => getPerson(id)?.name ?? "").join(" ");
  const loc = getLocation(clip.locationId);
  const tape = getTape(clip.sourceTapeId);
  const hay = [
    clip.title,
    clip.description,
    clip.tags.join(" "),
    clip.themes.join(" "),
    clip.type,
    personNames,
    loc?.name,
    loc?.city,
    tape?.code,
    tape?.originalLabel,
    clip.dateExact,
    String(clip.year),
    transcriptSearchText(clip),
  ]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((part) => hay.includes(part));
}

export function filterClips(filters: ArchiveFilters): ArchiveClip[] {
  return catalog.clips.filter((clip) => {
    if (filters.q && !matchesQuery(clip, filters.q)) return false;
    if (filters.era && clip.era !== filters.era) return false;
    if (filters.year && String(clip.year) !== filters.year) return false;
    if (filters.location) {
      const loc = getLocation(clip.locationId);
      if (clip.locationId !== filters.location && loc?.city.toLowerCase() !== filters.location && loc?.slug !== filters.location) {
        return false;
      }
    }
    if (filters.person && !clip.peopleIds.includes(filters.person)) return false;
    if (filters.track && !clip.trackIds.includes(filters.track)) return false;
    if (filters.album && !clip.albumIds.includes(filters.album)) return false;
    if (filters.project && !clip.projectIds.includes(filters.project)) return false;
    if (filters.event && !clip.eventIds.includes(filters.event)) return false;
    if (filters.type && clip.type !== filters.type) return false;
    if (filters.collection && !inHouseCut(clip, filters.collection)) return false;
    if (filters.month) {
      const mm = filters.month.padStart(2, "0");
      if (!clip.dateExact || clip.dateExact.slice(5, 7) !== mm) return false;
      if (filters.day) {
        const dd = filters.day.padStart(2, "0");
        if (clip.dateExact.slice(8) !== dd) return false;
      }
    }
    return true;
  });
}

export function sentenceFor(filters: ArchiveFilters) {
  const parts: string[] = [];
  if (filters.person) parts.push(`PERSON ${getPerson(filters.person)?.shortName ?? filters.person}`);
  if (filters.location) {
    const loc = getLocation(filters.location);
    parts.push(`LOCATION ${loc?.name ?? filters.location}`);
  }
  if (filters.year) parts.push(`YEAR ${filters.year}`);
  if (filters.era) parts.push(`ERA ${catalog.eras.find((e) => e.id === filters.era)?.name ?? filters.era}`);
  if (filters.type) parts.push(`TYPE ${filters.type}`);
  if (filters.collection) {
    parts.push(`COLLECTION ${getCollection(filters.collection)?.name ?? filters.collection}`);
  }
  if (filters.track) parts.push(`TRACK ${getTrack(filters.track)?.title ?? filters.track}`);
  if (filters.album) parts.push(`ALBUM ${getAlbum(filters.album)?.title ?? filters.album}`);
  if (filters.project) parts.push(`PROJECT ${getProject(filters.project)?.title ?? filters.project}`);
  if (filters.event) parts.push(`EVENT ${catalog.events.find((e) => e.id === filters.event)?.title ?? filters.event}`);
  if (filters.month) {
    const mon = MONTHS_SHORT[Number(filters.month) - 1] ?? filters.month;
    parts.push(filters.day ? `ON THIS DAY ${mon} ${Number(filters.day)}` : `MONTH ${mon}`);
  }
  if (filters.q) parts.push(`SEARCH “${filters.q}”`);
  return parts.length ? parts.join("  +  ") : "THE FULL INDEX";
}

/** Camera duo is on almost every card. Sharing only them is not a relationship. */
const CREW = new Set(["coodie", "chike"]);

/** Expand.ts dumps these on most later tapes. They must not start a relation by themselves. */
const WEAK_COLLECTIONS = new Set(["classics", "unseen"]);

/** Authored PUBLIC house works — films, titles, leftovers already in the catalog. */
const HOUSE_PROJECTS = new Set([
  "ali",
  "coney",
  "kendalls-cross",
  "window",
  "good-morning",
  "accel-origins",
  "jeenyuhs",
  "cz",
  "jesus-walks",
  "two-words",
  "benji",
  "cctv",
]);

function isHouseWork(clip: ArchiveClip) {
  if (!isAuthored(clip) || !isDiscoverable(clip)) return false;
  if (clip.type === "Title") return true;
  return clip.projectIds.some((id) => HOUSE_PROJECTS.has(id));
}

function overlap(a: string[], b: string[]) {
  return a.filter((id) => b.includes(id));
}

/** City dump (Los Angeles, Chicago, New York) vs a room someone could walk to. */
function isCityScalePlace(locationId: string) {
  const loc = getLocation(locationId);
  if (!loc) return true;
  return loc.name === loc.city;
}

/**
 * Shared tape / project / song / day / subject / specific place / specific collection.
 * Year alone — or year + crew only — scores 0.
 * City-scale place (LA, Chicago, NY) cannot start a relation by itself.
 */
export function relationScore(from: ArchiveClip, to: ArchiveClip) {
  if (from.id === to.id) return 0;

  let score = 0;
  if (to.sourceTapeId && to.sourceTapeId === from.sourceTapeId) score += 100;
  if (overlap(from.projectIds, to.projectIds).length) score += 50;
  if (overlap(from.trackIds, to.trackIds).length) score += 45;
  if (from.dateExact && from.dateExact === to.dateExact) score += 40;

  const people = overlap(from.peopleIds, to.peopleIds);
  const subjects = people.filter((id) => !CREW.has(id));
  if (subjects.length) score += 35 + subjects.length * 5;

  if (isHouseWork(from) && isHouseWork(to)) score += 16;

  const collections = overlap(from.collectionIds, to.collectionIds);
  const specific = collections.filter((id) => !WEAK_COLLECTIONS.has(id));
  if (specific.length) score += 12;

  const samePlace = to.locationId === from.locationId;
  if (samePlace) {
    const cityDump = isCityScalePlace(from.locationId);
    if (!cityDump) score += 25;
    else if (score > 0) score += 10;
  }

  if (collections.length && score > 0) score += 4;
  if (score > 0 && to.year === from.year) score += 5;
  if (score > 0 && people.length && !subjects.length) score += 3;

  return score;
}

export function relatedClips(clip: ArchiveClip) {
  const byId = new Map(catalog.clips.map((c) => [c.id, c]));
  const sameTape = catalog.clips
    .filter((c) => c.sourceTapeId === clip.sourceTapeId && c.id !== clip.id)
    .sort((a, b) => a.startTimecode.localeCompare(b.startTimecode));
  const named = clip.relatedClipIds.map((id) => byId.get(id)).filter(Boolean) as ArchiveClip[];

  const before = sameTape.filter((c) => c.startTimecode < clip.startTimecode).at(-1);
  const after = sameTape.find((c) => c.startTimecode > clip.startTimecode);

  return {
    named,
    sameTape,
    before,
    after,
  };
}

/** Six-card rabbit hole: named first, then scored axes, authored leftovers before PUBLIC density. */
export function relatedCards(clip: ArchiveClip, limit = 6) {
  const related = relatedClips(clip);
  const seen = new Set<string>([clip.id]);
  const out: ArchiveClip[] = [];

  const take = (c: ArchiveClip) => {
    if (seen.has(c.id) || out.length >= limit) return;
    /** Same-cassette UNLOGGED already lives on the chronological strip. */
    if (!isAuthored(c) && c.sourceTapeId === clip.sourceTapeId) return;
    seen.add(c.id);
    out.push(c);
  };

  related.named.forEach(take);

  const ranked = catalog.clips
    .map((c) => ({ c, score: relationScore(clip, c) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.c.startTimecode.localeCompare(b.c.startTimecode))
    .map((row) => row.c);

  ranked.filter((c) => isAuthored(c) && c.type === "Title").forEach(take);
  ranked.filter((c) => isAuthored(c) && c.type === "Unseen").forEach(take);
  ranked.filter(isAuthored).forEach(take);
  ranked.filter((c) => !isAuthored(c) && isDiscoverable(c)).forEach(take);

  return out;
}

export function yearsInCatalog() {
  return [...new Set(catalog.clips.map((c) => c.year))].sort((a, b) => a - b);
}

export function typesInCatalog(): ClipType[] {
  return [...new Set(catalog.clips.map((c) => c.type))].sort();
}

export function activeFilterCount(filters: ArchiveFilters) {
  return Object.values(filters).filter(Boolean).length;
}
