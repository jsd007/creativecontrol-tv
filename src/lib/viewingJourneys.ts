import { catalog } from "@/data";
import { VIEWING_JOURNEYS, type ViewingJourney } from "@/data/journeys";
import type { ArchiveClip } from "@/data/types";
import { tvHref } from "@/lib/tvNavigation";

export type ResolvedViewingJourney = ViewingJourney & { clips: ArchiveClip[] };

export function getViewingJourney(raw?: string | null) {
  return VIEWING_JOURNEYS.find((journey) => journey.id === raw);
}

/** Preserve the authored order, and never substitute an example or a restricted record. */
export function viewingJourneyClips(journey: ViewingJourney, clips: readonly ArchiveClip[] = catalog.clips) {
  const byId = new Map(clips.map((clip) => [clip.id, clip]));
  return journey.clipIds.flatMap((id) => {
    const clip = byId.get(id);
    return clip?.youtubeId && clip.visibility === "PUBLIC" ? [clip] : [];
  });
}

/** Only offer complete paths. A missing video must not silently change the story's promised length. */
export function availableViewingJourneys(clips: readonly ArchiveClip[] = catalog.clips): ResolvedViewingJourney[] {
  return VIEWING_JOURNEYS.flatMap((journey) => {
    const resolved = viewingJourneyClips(journey, clips);
    return resolved.length === journey.clipIds.length ? [{ ...journey, clips: resolved }] : [];
  });
}

export function journeysForClip(id: string) {
  return availableViewingJourneys().filter((journey) => journey.clipIds.includes(id));
}

/** A journey is a selection inside Broadcast, not an additional interface or autoplay queue. */
export function journeyTvHref(journey: ViewingJourney, current = "", clipId?: string) {
  const clips = viewingJourneyClips(journey);
  const clip = clips.find((item) => item.id === clipId) ?? clips[0];
  return clip ? tvHref(current, { ch: "07", clip: clip.slug, journey: journey.id, q: null, block: null, page: null }) : undefined;
}
