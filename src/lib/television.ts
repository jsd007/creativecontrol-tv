import { catalog } from "@/data";
import type { ArchiveClip } from "@/data/types";
import { YOUTUBE_PLAYLISTS, getYoutubeUpload } from "@/data/youtube";
import { programTitle } from "@/lib/clipDisplay";
import { isOfficialHolding } from "@/lib/holdings";
import { isOnAir } from "@/lib/visibility";

/** Sibling channels stay house cuts. Official uploads air on CH 07. */
function houseOnly(match: (c: ArchiveClip) => boolean) {
  return (c: ArchiveClip) => !isOfficialHolding(c) && match(c);
}

export const DAYPARTS = ["OPENING", "DAY", "STUDIO", "NIGHT", "LATE"] as const;
export type Daypart = (typeof DAYPARTS)[number];

export type ChannelAccent = "zero" | "chicago" | "broadcast" | "house";

export type Channel = {
  n: string;
  id: string;
  name: string;
  voice: string;
  accent: ChannelAccent;
  match: (c: ArchiveClip) => boolean;
};

export const CHANNELS: Channel[] = [
  {
    n: "00",
    id: "channel-zero",
    name: "CHANNEL ZERO",
    voice: "Public access.",
    accent: "zero",
    match: houseOnly((c) => c.era === "channel-zero" || c.collectionIds.includes("channel-zero")),
  },
  {
    n: "01",
    id: "origins",
    name: "ORIGINS",
    voice: "First rooms.",
    accent: "house",
    match: houseOnly((c) => c.collectionIds.includes("first-times") || c.era === "through-the-wire"),
  },
  {
    n: "02",
    id: "chicago",
    name: "CHICAGO",
    voice: "The city.",
    accent: "chicago",
    match: houseOnly((c) => ["chicago", "south-side", "cottage-grove"].includes(c.locationId)),
  },
  {
    n: "03",
    id: "studio",
    name: "STUDIO",
    voice: "Sessions.",
    accent: "house",
    match: houseOnly((c) => c.type === "Studio" || c.collectionIds.includes("studio-nights")),
  },
  {
    n: "04",
    id: "new-york",
    name: "NEW YORK",
    voice: "After Chicago.",
    accent: "house",
    match: houseOnly((c) => c.collectionIds.includes("new-york")),
  },
  {
    n: "05",
    id: "performances",
    name: "PERFORMANCES",
    voice: "Live rooms.",
    accent: "house",
    match: houseOnly((c) => c.type === "Performance"),
  },
  {
    n: "06",
    id: "unseen",
    name: "UNSEEN",
    voice: "Leftovers.",
    accent: "house",
    match: houseOnly((c) => c.type === "Unseen" || c.collectionIds.includes("unseen")),
  },
  {
    n: "07",
    id: "broadcast",
    name: "BROADCAST",
    voice: "The public channel.",
    accent: "broadcast",
    match: (c) => Boolean(c.youtubeId),
  },
  {
    n: "08",
    id: "conversations",
    name: "CONVERSATIONS",
    voice: "Talk.",
    accent: "house",
    match: houseOnly((c) => c.type === "Conversation" || c.type === "Interview"),
  },
];

/** Official public playlist names, then Channel Zero, then upload year. Never an invented show. */
const NAMED_BLOCKS = ["CREATIVE CONTROL TV", "CHANNEL ZERO", "TEAR UP", "ECKŌ STUDIO SESSIONS", "BENT"] as const;

export function daypart(clip: ArchiveClip): Daypart {
  if (clip.type === "Title" || clip.type === "Broadcast") return "OPENING";
  if (clip.type === "Unseen") return "LATE";
  if (clip.type === "Studio") return "STUDIO";
  if (clip.type === "Performance" || clip.type === "Conversation" || clip.type === "Interview") return "NIGHT";
  return "DAY";
}

function byEditorialDay(a: ArchiveClip, b: ArchiveClip) {
  const da = DAYPARTS.indexOf(daypart(a));
  const db = DAYPARTS.indexOf(daypart(b));
  if (da !== db) return da - db;
  if (a.year !== b.year) return a.year - b.year;
  return a.startTimecode.localeCompare(b.startTimecode);
}

function programDay(clips: ArchiveClip[], bias?: "leftovers") {
  const air = clips.filter(isOnAir);
  const leftovers = air.filter((c) => c.type === "Unseen").sort(byEditorialDay);
  const rest = air.filter((c) => c.type !== "Unseen").sort(byEditorialDay);
  if (bias === "leftovers") return [...leftovers, ...rest];
  return rest.length ? rest : leftovers;
}

export function officialBlock(clip: ArchiveClip) {
  if (clip.tags.includes("ident")) return "CREATIVE CONTROL TV";
  const upload = clip.youtubeId ? getYoutubeUpload(clip.youtubeId) : undefined;
  const playlistId = upload?.playlistIds?.[0];
  if (playlistId) {
    const named = YOUTUBE_PLAYLISTS.find((p) => p.id === playlistId);
    if (named) return named.title.toUpperCase();
  }
  if (clip.collectionIds.includes("channel-zero") || clip.projectIds.includes("cz")) return "CHANNEL ZERO";
  return String(clip.year);
}

function blockRank(block: string) {
  const named = NAMED_BLOCKS.indexOf(block as (typeof NAMED_BLOCKS)[number]);
  if (named >= 0) return named;
  const year = Number(block);
  return Number.isFinite(year) ? 80 + year : 400;
}

function byBroadcastDay(a: ArchiveClip, b: ArchiveClip) {
  const rank = blockRank(officialBlock(a)) - blockRank(officialBlock(b));
  if (rank) return rank;
  if (a.year !== b.year) return a.year - b.year;
  return (a.dateExact ?? a.dateApproximate ?? "").localeCompare(b.dateExact ?? b.dateApproximate ?? "") || a.title.localeCompare(b.title);
}

/** CH 07 signs on with the house ident, then official public blocks — not type-as-OPENING. */
function programBroadcast(clips: ArchiveClip[]) {
  const air = clips.filter(isOnAir);
  const ident = air.filter((c) => c.tags.includes("ident"));
  const rest = air.filter((c) => !c.tags.includes("ident")).sort(byBroadcastDay);
  return ident.length || rest.length ? [...ident, ...rest] : [];
}

export function channelLineup(channel: Channel) {
  const list = catalog.clips.filter(channel.match);
  const programmed =
    channel.id === "broadcast"
      ? programBroadcast(list)
      : programDay(list, channel.id === "unseen" ? "leftovers" : undefined);
  return programmed.length ? programmed : programDay(catalog.clips.filter((c) => c.featured));
}

export function onAirTitle(channel: Channel) {
  const now = channelLineup(channel)[0];
  return now ? programTitle(now) : "";
}

export type GuideSection = {
  section: string;
  rows: ArchiveClip[];
};

export function guideSections(channel: Channel, lineup: ArchiveClip[]): GuideSection[] {
  const sections: GuideSection[] = [];
  for (const clip of lineup) {
    if (!programTitle(clip)) continue;
    const section = channel.id === "broadcast" ? officialBlock(clip) : daypart(clip);
    const last = sections[sections.length - 1];
    if (last && last.section === section) last.rows.push(clip);
    else sections.push({ section, rows: [clip] });
  }
  return sections;
}

export function programmedTitles(lineup: ArchiveClip[]) {
  const seen = new Set<string>();
  const titles: string[] = [];
  for (const clip of lineup) {
    const title = programTitle(clip);
    if (!title || seen.has(title)) continue;
    seen.add(title);
    titles.push(title);
  }
  return titles;
}

/** CH 07 crawl / GUIDE spines — official blocks and upload years, never a title dump. */
export function programmedBlocks(lineup: ArchiveClip[]) {
  const seen = new Set<string>();
  const blocks: string[] = [];
  for (const clip of lineup) {
    if (!programTitle(clip)) continue;
    const block = officialBlock(clip);
    if (seen.has(block)) continue;
    seen.add(block);
    blocks.push(block);
  }
  return blocks;
}

export function isYearBook(section: string) {
  return /^\d{4}$/.test(section);
}

/** A year book this long is still a dump if opened as one rundown. 2012 (32) stays a year. */
export const FAT_YEAR_BOOK = 36;

/** A letter this long is still a dump if opened as one rundown. Below the year bar so 2010 C (31) nests. */
export const FAT_LETTER_BOOK = 24;

/** Title window in GUIDE. Fat leftovers paginate — no more nest invention. */
export const GUIDE_WINDOW = 10;

export function guideWindow<T>(rows: T[], page: number, size = GUIDE_WINDOW) {
  const pages = Math.max(1, Math.ceil(rows.length / size) || 1);
  const safe = Math.min(Math.max(0, page), pages - 1);
  const start = safe * size;
  return {
    rows: rows.slice(start, start + size),
    page: safe,
    pages,
    hasPrev: safe > 0,
    hasMore: safe < pages - 1,
  };
}

export type YearChapter = {
  key: string;
  label: string;
  rows: ArchiveClip[];
};

function titledCount(rows: ArchiveClip[]) {
  let n = 0;
  for (const clip of rows) {
    if (programTitle(clip)) n += 1;
  }
  return n;
}

/** First A–Z of the official title. Leading punctuation stripped. Digits share 0–9. Not a show name. */
export function titleIndexKey(title: string) {
  const cleaned = title.replace(/^[^A-Za-z0-9]+/, "");
  const ch = cleaned[0];
  if (!ch) return "#";
  if (/[A-Za-z]/.test(ch)) return ch.toUpperCase();
  return "0–9";
}

function chapterOrder(a: string, b: string) {
  if (a === b) return 0;
  if (a === "0–9") return -1;
  if (b === "0–9") return 1;
  if (a === "#") return 1;
  if (b === "#") return -1;
  return a.localeCompare(b);
}

export function isFatYearBook(section: string, rows: ArchiveClip[]) {
  return isYearBook(section) && titledCount(rows) >= FAT_YEAR_BOOK;
}

/** A–Z index of official titles already in the year. Empty letters omitted. Listing order kept. */
export function yearBookChapters(rows: ArchiveClip[]): YearChapter[] {
  const buckets = new Map<string, ArchiveClip[]>();
  for (const clip of rows) {
    const title = programTitle(clip);
    if (!title) continue;
    const key = titleIndexKey(title);
    const list = buckets.get(key);
    if (list) list.push(clip);
    else buckets.set(key, [clip]);
  }
  return [...buckets.entries()]
    .sort((a, b) => chapterOrder(a[0], b[0]))
    .map(([key, chapterRows]) => ({ key, label: key, rows: chapterRows }));
}

export function isFatLetterBook(rows: ArchiveClip[]) {
  return titledCount(rows) >= FAT_LETTER_BOOK;
}

/**
 * Official words already on the title. Glued CREATIVECONTROL is CREATIVE CONTROL
 * on the file. Not a show name.
 */
export function officialTitleWords(title: string) {
  const cleaned = title
    .replace(/^[^A-Za-z0-9]+/, "")
    .replace(/CREATIVECONTROL/gi, "CREATIVE CONTROL")
    .replace(/[^A-Za-z0-9$]+/g, " ")
    .trim()
    .toUpperCase();
  return cleaned ? cleaned.split(/\s+/) : [];
}

/** Leading official prefix already on the title (first two words). */
export function officialTitlePrefix(title: string) {
  const words = officialTitleWords(title);
  if (words.length >= 2) return `${words[0]} ${words[1]}`;
  return words[0] ?? titleIndexKey(title);
}

/** First official word already on the title. Used only when two words are not the dump. */
function officialLeadWord(title: string) {
  return officialTitleWords(title)[0] ?? titleIndexKey(title);
}

/** Shared lead-in that is the dump — not every unique two-word pair. */
function isNestablePrefix(count: number, letterSize: number) {
  if (count < 2) return false;
  return count >= Math.max(8, Math.ceil(letterSize / 3));
}

/** Articles are on the file but are not a prefix. Do not nest THE / A as a show. */
const WEAK_LEAD = new Set(["THE", "A", "AN", "AND", "OF", "FOR", "TO", "IN", "ON"]);

function prefixBuckets(rows: ArchiveClip[], keyOf: (title: string) => string) {
  const buckets = new Map<string, ArchiveClip[]>();
  for (const clip of rows) {
    const title = programTitle(clip);
    if (!title) continue;
    const prefix = keyOf(title);
    const list = buckets.get(prefix);
    if (list) list.push(clip);
    else buckets.set(prefix, [clip]);
  }
  return buckets;
}

function nestableFromBuckets(
  buckets: Map<string, ArchiveClip[]>,
  size: number,
  skipWeakLead: boolean,
) {
  const nests: YearChapter[] = [];
  for (const [prefix, chapterRows] of buckets) {
    if (skipWeakLead && WEAK_LEAD.has(prefix)) continue;
    if (isNestablePrefix(chapterRows.length, size)) {
      nests.push({ key: prefix, label: prefix, rows: chapterRows });
    }
  }
  return nests;
}

function prefixChapterOrder(letter: string, a: string, b: string) {
  if (a === letter && b !== letter) return 1;
  if (b === letter && a !== letter) return -1;
  return chapterOrder(a, b);
}

/**
 * Long letter: official title prefixes already on the file vs the rest of the letter.
 * Two-word prefix first (2011 C → CREATIVE CONTROL). If that is not the dump,
 * the official lead word already on the file (2010 C → CURREN$Y). Thin letters
 * stay a letter rundown. No invented show names. Prefix lists are not split again.
 */
export function letterPrefixChapters(letter: string, rows: ArchiveClip[]): YearChapter[] | null {
  const size = titledCount(rows);
  if (size < FAT_LETTER_BOOK) return null;

  let nests = nestableFromBuckets(prefixBuckets(rows, officialTitlePrefix), size, false);
  if (!nests.length) {
    nests = nestableFromBuckets(prefixBuckets(rows, officialLeadWord), size, true);
  }
  if (!nests.length) return null;

  const nested = new Set(nests.flatMap((chapter) => chapter.rows));
  const listed: ArchiveClip[] = [];
  for (const clip of rows) {
    if (programTitle(clip) && !nested.has(clip)) listed.push(clip);
  }
  if (listed.length) {
    nests.push({ key: letter, label: letter, rows: listed });
  }

  return nests.sort((a, b) => prefixChapterOrder(letter, a.key, b.key));
}

export function accentOnAir(accent: ChannelAccent) {
  if (accent === "broadcast") return "text-signal";
  if (accent === "zero" || accent === "chicago") return "text-chicago";
  return "text-night";
}

export function accentNumber(accent: ChannelAccent) {
  if (accent === "broadcast") return "text-signal";
  if (accent === "zero" || accent === "chicago") return "text-chicago";
  return "text-night";
}

export function accentHair(accent: ChannelAccent) {
  if (accent === "broadcast") return "bg-signal";
  if (accent === "zero" || accent === "chicago") return "bg-chicago";
  return "bg-night";
}

export function accentRule(accent: ChannelAccent) {
  if (accent === "broadcast") return "bg-signal/80";
  if (accent === "zero" || accent === "chicago") return "bg-chicago/80";
  return "bg-night/80";
}

export function guideNowClass(accent: ChannelAccent) {
  if (accent === "broadcast") return "guide-now guide-now--broadcast";
  if (accent === "zero" || accent === "chicago") return "guide-now guide-now--chicago";
  return "guide-now guide-now--house";
}
