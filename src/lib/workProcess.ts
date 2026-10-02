import { getClip } from "@/data";
import { WORK_PROCESS } from "@/data/workProcess";

export function workProcessForClip(clipId: string) {
  const story = WORK_PROCESS.find((row) => row.parts.some((part) => part.clipId === clipId));
  if (!story) return undefined;
  const parts = story.parts.flatMap((part) => {
    const clip = getClip(part.clipId);
    return clip?.youtubeId && clip.visibility === "PUBLIC" ? [{ ...part, clip }] : [];
  });
  return parts.length > 1 ? { ...story, parts } : undefined;
}
