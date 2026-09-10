import type { ArchiveClip } from "@/data/types";

/** Per-work prototype field. Inherit materials; do not copy jeen-yuhs.com or WØRKS Act III. */
export type MediaVoice =
  | "ali"
  | "kendall"
  | "coney"
  | "channel-zero-open"
  | "channel-zero"
  | "sessions"
  | "window-seat"
  | "ingest"
  | "basement"
  | "sports"
  | "architecture"
  | "default";

export type VoiceClip = Pick<
  ArchiveClip,
  | "title"
  | "year"
  | "hue"
  | "mediaKind"
  | "formatHint"
  | "type"
  | "projectIds"
  | "collectionIds"
  | "locationId"
  | "tags"
  | "era"
  | "themes"
>;

export function resolveMediaVoice(clip: VoiceClip): MediaVoice {
  const projects = clip.projectIds ?? [];
  const collections = clip.collectionIds ?? [];
  const tags = clip.tags ?? [];
  const themes = clip.themes ?? [];
  const title = clip.title.toLowerCase();

  if (projects.includes("ali") || title.includes("people's champ") || title.includes("peoples champ")) {
    return "ali";
  }
  if (projects.includes("kendalls-cross") || title.includes("kendall")) {
    return "kendall";
  }
  if (projects.includes("coney") || clip.locationId === "coney") {
    return "coney";
  }
  if (projects.includes("window") || tags.includes("one-take") || title.includes("window seat")) {
    return "window-seat";
  }
  if (projects.includes("sessions") || clip.locationId === "dd172") {
    return "sessions";
  }
  if (projects.includes("jeenyuhs") || tags.includes("ingest") || tags.includes("duffel")) {
    return "ingest";
  }
  if (
    projects.includes("ttw") ||
    tags.includes("basement") ||
    tags.includes("polaroid") ||
    title.includes("basement")
  ) {
    return "basement";
  }
  if (projects.includes("benji") || tags.includes("gym") || tags.includes("basketball")) {
    return "sports";
  }
  if (projects.includes("cz") || collections.includes("channel-zero") || clip.era === "channel-zero") {
    const open =
      clip.type === "Broadcast" ||
      clip.type === "Title" ||
      clip.mediaKind === "LEADER" ||
      tags.includes("open") ||
      title.includes("yellow field") ||
      title.includes("she watch");
    return open ? "channel-zero-open" : "channel-zero";
  }
  if (themes.includes("sports") && !projects.includes("ali")) {
    return "sports";
  }
  if (clip.mediaKind === "MAP" && ["paris", "tokyo", "accra", "london"].includes(clip.locationId)) {
    return "architecture";
  }
  return "default";
}
