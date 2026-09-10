import {
  albums,
  authoredClips,
  collections,
  eras,
  events,
  locations,
  organizations,
  people,
  projects,
  tapes,
  themes,
  tracks,
} from "./catalog";
import { broadcastClipsFromUploads } from "./broadcastClips";
import { expandClips } from "./expand";
import { transcripts } from "./transcripts";
import type { ArchiveClip, SourceTape, Transcript } from "./types";

function linkRelations(clips: ArchiveClip[]): ArchiveClip[] {
  const byTape = new Map<string, ArchiveClip[]>();
  for (const clip of clips) {
    const list = byTape.get(clip.sourceTapeId) ?? [];
    list.push(clip);
    byTape.set(clip.sourceTapeId, list);
  }

  return clips.map((clip) => {
    const siblings = (byTape.get(clip.sourceTapeId) ?? [])
      .filter((c) => c.id !== clip.id)
      .sort((a, b) => a.startTimecode.localeCompare(b.startTimecode));
    const sameDay = clips.filter(
      (c) =>
        c.id !== clip.id &&
        c.dateExact &&
        clip.dateExact &&
        c.dateExact === clip.dateExact,
    );
    const related = [
      ...new Set([
        ...clip.relatedClipIds,
        ...siblings.slice(0, 3).map((c) => c.id),
        ...sameDay.slice(0, 2).map((c) => c.id),
      ]),
    ].slice(0, 8);
    return { ...clip, relatedClipIds: related };
  });
}

function attachTranscripts(clips: ArchiveClip[]): ArchiveClip[] {
  const byClip = new Map(transcripts.map((t) => [t.clipId, t.id]));
  return clips.map((clip) => {
    const transcriptId = byClip.get(clip.id);
    return transcriptId ? { ...clip, transcriptId } : clip;
  });
}

export const catalog = {
  people,
  locations,
  eras,
  collections,
  themes,
  organizations,
  tracks,
  albums,
  projects,
  events,
  tapes,
  clips: attachTranscripts(
    linkRelations([...authoredClips, ...broadcastClipsFromUploads(authoredClips), ...expandClips()]),
  ),
};

export { transcripts };

export function getPerson(id: string) {
  return catalog.people.find((p) => p.id === id || p.slug === id);
}

export function getLocation(id: string) {
  return catalog.locations.find((l) => l.id === id || l.slug === id);
}

export function getTape(id: string): SourceTape | undefined {
  return catalog.tapes.find((t) => t.id === id || t.code === id);
}

export function getClip(idOrSlug: string): ArchiveClip | undefined {
  return catalog.clips.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}

export function getCollection(id: string) {
  return catalog.collections.find((c) => c.id === id || c.slug === id);
}

export function getEra(id: string) {
  return catalog.eras.find((e) => e.id === id || e.slug === id);
}

export function getTrack(id: string) {
  return catalog.tracks.find((t) => t.id === id || t.slug === id);
}

export function getAlbum(id: string) {
  return catalog.albums.find((a) => a.id === id || a.slug === id);
}

export function getProject(id: string) {
  return catalog.projects.find((p) => p.id === id || p.slug === id);
}

export function getEvent(id: string) {
  return catalog.events.find((e) => e.id === id || e.slug === id);
}

export function getTranscript(id: string): Transcript | undefined {
  return transcripts.find((t) => t.id === id || t.clipId === id);
}

export function transcriptForClip(clip: Pick<ArchiveClip, "id" | "transcriptId">) {
  if (clip.transcriptId) {
    const byId = transcripts.find((t) => t.id === clip.transcriptId);
    if (byId) return byId;
  }
  return transcripts.find((t) => t.clipId === clip.id);
}

export function transcriptSearchText(clip: Pick<ArchiveClip, "id" | "transcriptId">) {
  const tr = transcriptForClip(clip);
  if (!tr) return "";
  return tr.segments.map((s) => [s.speaker, s.text].filter(Boolean).join(" ")).join(" ");
}

export function clipsOnTape(tapeId: string) {
  return catalog.clips
    .filter((c) => c.sourceTapeId === tapeId)
    .sort((a, b) => a.startTimecode.localeCompare(b.startTimecode));
}

export function cityLocations() {
  const seen = new Set<string>();
  return catalog.locations.filter((l) => {
    if (seen.has(l.city)) return false;
    seen.add(l.city);
    return true;
  });
}

export function clipsForPerson(id: string) {
  const person = getPerson(id);
  if (!person) return [];
  return catalog.clips.filter((c) => c.peopleIds.includes(person.id));
}

export function clipsForLocation(id: string) {
  const loc = getLocation(id);
  if (!loc) return [];
  const cityRoot = cityLocations().some((c) => c.id === loc.id);
  return catalog.clips.filter((c) => {
    const here = getLocation(c.locationId);
    return cityRoot ? here?.city === loc.city : c.locationId === loc.id;
  });
}

export function clipsForProject(id: string) {
  const project = getProject(id);
  if (!project) return [];
  return catalog.clips.filter((c) => c.projectIds.includes(project.id));
}

export function clipsForCollection(id: string) {
  const collection = getCollection(id);
  if (!collection) return [];
  return catalog.clips.filter((c) => c.collectionIds.includes(collection.id));
}

export {
  YOUTUBE_CHANNEL,
  youtubeUploads,
  youtubePlaylistForeign,
  youtubeThumbnail,
  youtubeEmbedSrc,
  getYoutubeUpload,
  isBroadcastShelf,
} from "./youtube";

export type { ArchiveClip, SourceTape, Transcript };
