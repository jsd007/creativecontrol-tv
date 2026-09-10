import { getPerson, getProject, getTape, getTrack } from "@/data";
import type { ArchiveClip } from "@/data/types";

const CREW = new Set(["coodie", "chike"]);

function overlap(a: string[], b: string[]) {
  return a.filter((id) => b.includes(id));
}

/** Display axis only. Ranking stays in relatedCards. */
export function relatedAxis(from: ArchiveClip, to: ArchiveClip) {
  if (from.relatedClipIds.includes(to.id)) {
    if (to.type === "Unseen") return "LEFTOVER";
    if (to.type === "Title") return "TITLE CARD";
    return "NAMED CUT";
  }

  if (to.sourceTapeId && to.sourceTapeId === from.sourceTapeId) {
    const tape = getTape(to.sourceTapeId);
    return tape ? `CASSETTE · ${tape.code}` : "SAME CASSETTE";
  }

  const project = overlap(from.projectIds, to.projectIds)[0];
  if (project) return getProject(project)?.title.toUpperCase() ?? "PROJECT";

  const track = overlap(from.trackIds, to.trackIds)[0];
  if (track) return getTrack(track)?.title.toUpperCase() ?? "SONG";

  if (from.dateExact && from.dateExact === to.dateExact) return "THAT DAY";

  const subject = overlap(from.peopleIds, to.peopleIds).find((id) => !CREW.has(id));
  if (subject) return getPerson(subject)?.shortName.toUpperCase() ?? "SUBJECT";

  if (to.type === "Unseen") return "UNSEEN";
  if (to.type === "Title") return "TITLE CARD";
  return "HOUSE";
}
