import type { ArchiveClip, ClipType } from "./types";
import { youtubeUploads, type YoutubeVideo } from "./youtube";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function eraForYear(year: number) {
  if (year < 1998) return "channel-zero";
  if (year < 2002) return "long-shoot";
  if (year < 2005) return "through-the-wire";
  if (year < 2012) return "network";
  if (year < 2019) return "documents";
  if (year < 2023) return "jeen-yuhs";
  return "after";
}

function slugify(title: string, id: string) {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/["'`“”‘’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return base || `cc-tv-${id.toLowerCase()}`;
}

function uploadYear(video: YoutubeVideo) {
  if (video.published) return Number(video.published.slice(0, 4));
  if (video.publishedApproximate && /^\d{4}/.test(video.publishedApproximate)) {
    return Number(video.publishedApproximate.slice(0, 4));
  }
  return 2012;
}

function peopleFrom(title: string) {
  const ids = new Set(["coodie", "chike"]);
  if (/\bkanye(\s+west)?\b/i.test(title)) ids.add("ye");
  if (/\beryah\s+badu\b/i.test(title)) ids.add("badu");
  if (/joey\s+bada|pro\s+era/i.test(title)) ids.add("joey");
  if (/curren\s*\$?y|currensy/i.test(title)) ids.add("currensy");
  if (/\bmos\s+def\b|\byasiin\b/i.test(title)) ids.add("yasiin");
  if (/\bbig\s+k\.?r\.?i\.?t\.?\b|\bbig\s+krit\b/i.test(title)) ids.add("krit");
  if (/\bcool\s+kids\b/i.test(title)) ids.add("coolkids");
  if (/\bdan\s+auerbach\b|\bblack\s+keys\b/i.test(title)) ids.add("auerbach");
  if (/(?:\bdame(?:\s+dash)?\b|\bdamon\s+dash\b)/i.test(title) && !/dash gallery/i.test(title)) {
    ids.add("dash");
  }
  if (/\blupe(\s+fiasco)?\b/i.test(title)) ids.add("lupe");
  return [...ids];
}

function locationFrom(title: string) {
  if (/channel\s*zero/i.test(title) || /\bbenji\b/i.test(title)) return "chicago";
  if (/\bdd172\b/i.test(title)) return "dd172";
  if (/dallas|dealey|window seat/i.test(title)) return "dallas";
  return "new-york";
}

function typeFrom(title: string): ClipType {
  if (/studio session|cinematic tv|in studio/i.test(title)) return "Studio";
  if (/behind the scenes/i.test(title)) return "BTS";
  if (/unprofessional|\binterview\b/i.test(title)) return "Interview";
  if (/official music video|music video/i.test(title)) return "Performance";
  if (/sxsw|\bcmj\b|woodstock|fallon|\btour\b|concert|boiler room|live at/i.test(title)) return "Performance";
  return "Broadcast";
}

function projectsFrom(title: string) {
  if (/channel\s*zero/i.test(title)) return ["cz"];
  if (/tear\s*up/i.test(title)) return ["tear-up"];
  if (/window seat/i.test(title)) return ["window"];
  if (/\bbenji\b/i.test(title)) return ["benji"];
  if (/\bdd172\b/i.test(title)) return ["sessions"];
  if (/jeen-?yuhs/i.test(title)) return ["jeenyuhs"];
  return ["cctv"];
}

function tracksFrom(title: string) {
  const ids: string[] = [];
  if (/michael knight/i.test(title)) ids.push("michael-knight");
  if (/window seat/i.test(title)) ids.push("window-seat");
  return ids;
}

function albumsFrom(title: string) {
  const ids: string[] = [];
  if (/new amerykah/i.test(title)) ids.push("newamerykah");
  if (/blak\s*roc/i.test(title)) ids.push("blakroc");
  return ids;
}

function collectionsFrom(title: string, locationId: string) {
  const ids = new Set(["classics"]);
  if (/channel\s*zero/i.test(title)) {
    ids.add("channel-zero");
    ids.add("chicago-before");
  }
  if (
    /\bnew york\b|\bnyc\b|\bbrooklyn\b|\bcmj\b|fallon|pro era/i.test(title) ||
    locationId === "dd172"
  ) {
    ids.add("new-york");
  }
  // Studio Nights stays 0 public frames. Official studio sessions are not that cut.
  return [...ids];
}

function dateLine(video: YoutubeVideo) {
  if (video.published && /^\d{4}-\d{2}-\d{2}$/.test(video.published)) {
    const [y, m, d] = video.published.split("-").map(Number);
    return `${d} ${MONTHS[m - 1]} ${y}`;
  }
  if (video.publishedApproximate) return video.publishedApproximate;
  return "";
}

function descriptionFor(video: YoutubeVideo) {
  const when = dateLine(video);
  const dated = when ? `Public YouTube upload, ${when}, on @cctelevisionchannel.` : "Public YouTube upload on @cctelevisionchannel.";
  return `${dated} Official title only. Not a vault tape.`;
}

function hueFor(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i += 1) n = (n * 31 + id.charCodeAt(i)) % 360;
  return n;
}

function clipFromUpload(video: YoutubeVideo, slug: string): ArchiveClip {
  const title = video.title;
  const year = uploadYear(video);
  let type = typeFrom(title);
  let locationId = locationFrom(title);
  const peopleIds = peopleFrom(title);
  // Combo Ye+Chicago+2002+Studio stays the basement card only.
  if (peopleIds.includes("ye") && locationId === "chicago" && year === 2002 && type === "Studio") {
    locationId = "new-york";
    type = "Broadcast";
  }
  return {
    id: video.clipId ?? `c-${video.id}`,
    slug,
    title,
    description: descriptionFor(video),
    dateExact: video.published,
    dateApproximate: video.published ? undefined : video.publishedApproximate,
    year,
    era: eraForYear(year),
    locationId,
    peopleIds,
    trackIds: tracksFrom(title),
    albumIds: albumsFrom(title),
    projectIds: projectsFrom(title),
    eventIds: [],
    collectionIds: collectionsFrom(title, locationId),
    themes: type === "Studio" ? ["broadcast", "studio"] : ["broadcast"],
    tags: ["broadcast"],
    sourceTapeId: "t-broadcast",
    startTimecode: "00:00:00:00",
    endTimecode: "00:00:00:00",
    duration: 0,
    thumbnail: "",
    poster: "",
    youtubeId: video.id,
    featured: false,
    visibility: "PUBLIC",
    rightsStatus: "UNCLEAR",
    editorialStatus: "APPROVED",
    sensitivityStatus: "NONE",
    relatedClipIds: [],
    type,
    mediaKind: /trailer|preview|ep\.?\s*\d/i.test(title) ? "LEADER" : "FIELD",
    formatHint: "DIGITAL",
    cameraCredit: /channel\s*zero/i.test(title) ? "CHANNEL ZERO" : "CREATIVE CONTROL",
    hue: hueFor(video.id),
  };
}

/** Remaining official @cctelevisionchannel uploads, authored from listings. Official titles only. */
export function broadcastClipsFromUploads(existing: ArchiveClip[]): ArchiveClip[] {
  const existingIds = new Set(existing.map((c) => c.id));
  const usedSlugs = new Set(existing.map((c) => c.slug));
  const extras: ArchiveClip[] = [];

  for (const video of youtubeUploads) {
    if (!video.clipId || existingIds.has(video.clipId) || video.mapping !== "broadcast-clip") continue;
    let slug = slugify(video.title, video.id);
    if (usedSlugs.has(slug)) slug = `${slug}-${video.id.slice(0, 6).toLowerCase()}`;
    usedSlugs.add(slug);
    extras.push(clipFromUpload(video, slug));
  }

  return extras;
}
