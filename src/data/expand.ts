import { authoredClips, tapes } from "./catalog";
import type { ArchiveClip, ClipType, MediaKind, TapeFormat, Visibility } from "./types";
import { parseArchiveDate } from "@/lib/format";

const TYPES: ClipType[] = [
  "Broadcast",
  "Interview",
  "Studio",
  "Performance",
  "Travel",
  "Street",
  "Conversation",
  "BTS",
  "Unseen",
];

const KINDS: MediaKind[] = ["FIELD", "LEADER", "MAP", "CONTACT", "STATIC"];

const VIS: Visibility[] = [
  "PUBLIC",
  "UNLISTED",
  "COMING_SOON",
  "MEMBERS_ONLY",
  "PENDING_CLEARANCE",
  "RESTRICTED",
];

function pad(n: number, w = 2) {
  return String(n).padStart(w, "0");
}

function tc(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}:00`;
}

function eraForYear(year: number) {
  if (year < 1998) return "channel-zero";
  if (year < 2002) return "long-shoot";
  if (year < 2005) return "through-the-wire";
  if (year < 2012) return "network";
  if (year < 2019) return "documents";
  if (year < 2023) return "jeen-yuhs";
  return "after";
}

function collectionsFor(year: number, locationId: string, type: ClipType): string[] {
  const ids: string[] = [];
  if (year <= 1999) ids.push("channel-zero", "chicago-before");
  if (year >= 1998 && year <= 2004) ids.push("road-dropout");
  if (locationId === "new-york" || locationId === "dd172" || locationId === "coney") ids.push("new-york");
  if (type === "Studio") ids.push("studio-nights");
  if (type === "Unseen" || year % 5 === 0) ids.push("unseen");
  if (year >= 2009) ids.push("classics");
  return [...new Set(ids)];
}

export function expandClips(): ArchiveClip[] {
  const extras: ArchiveClip[] = [];
  let n = 0;

  for (const tape of tapes) {
    if (tape.id === "t-broadcast") continue;
    const chapters = tape.format === "PHONE" ? 3 : tape.format === "VHS" ? 4 : 5;
    for (let i = 0; i < chapters; i++) {
      n += 1;
      const id = `g-${pad(n, 3)}`;
      if (authoredClips.some((c) => c.sourceTapeId === tape.id && i === 0 && n % 7 === 0)) {
        continue;
      }
      const type = TYPES[(n + tape.year) % TYPES.length];
      const start = 90 * i + (n % 17);
      const duration = 40 + ((n * 13) % 280);
      extras.push({
        id,
        slug: `${tape.code.toLowerCase()}-unlogged-${i + 1}`,
        title: "UNLOGGED",
        description: `Unlabelled density on ${tape.code}. Not a shot-log. The vault is larger than the authored cut.`,
        dateExact: parseArchiveDate(tape.recordedDate) ? tape.recordedDate : undefined,
        dateApproximate: tape.recordedApproximate,
        year: tape.year,
        era: eraForYear(tape.year),
        locationId: tape.locationId,
        peopleIds: tape.camera.includes("CHIKE")
          ? ["chike", "coodie"]
          : tape.year <= 2004
            ? ["coodie"]
            : ["coodie", "chike"],
        trackIds: [],
        albumIds: tape.year >= 2002 && tape.year <= 2004 ? ["dropout"] : [],
        projectIds: tape.year <= 1999 ? ["cz"] : tape.year >= 2009 && tape.year <= 2013 ? ["cctv"] : [],
        eventIds: [],
        collectionIds: collectionsFor(tape.year, tape.locationId, type),
        themes: tape.locationId.includes("chicago") || tape.locationId === "south-side" || tape.locationId === "cottage-grove"
          ? ["chicago", "presence"]
          : ["presence", "memory"],
        tags: [tape.format.toLowerCase(), "generated", "unlogged"],
        sourceTapeId: tape.id,
        startTimecode: tc(start),
        endTimecode: tc(start + duration),
        duration,
        thumbnail: "",
        poster: "",
        featured: false,
        visibility: VIS[n % VIS.length],
        rightsStatus: n % 4 === 0 ? "MUSIC_PENDING" : n % 5 === 0 ? "UNCLEAR" : "CLEARED",
        editorialStatus: n % 6 === 0 ? "ROUGH" : "APPROVED",
        sensitivityStatus: n % 11 === 0 ? "CONTEXT_REQUIRED" : "NONE",
        relatedClipIds: [],
        type,
        mediaKind: KINDS[n % KINDS.length],
        formatHint: tape.format as TapeFormat,
        cameraCredit: tape.camera,
        hue: (tape.year * 7 + n * 19) % 360,
      });
    }
  }

  return extras;
}
