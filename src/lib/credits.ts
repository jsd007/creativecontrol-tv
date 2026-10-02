import type { ArchiveClip } from "../data/types";

type CreditedClip = Pick<ArchiveClip, "credits">;
type FilmCredit = NonNullable<ArchiveClip["credits"]>[number];

/** Credit identity is an explicit catalog link, never a guess from a name or biography. */
export function creditedPersonIds(clip: CreditedClip): string[] {
  return [...new Set((clip.credits ?? []).flatMap((credit) => credit.personIds ?? []))];
}

export function hasPersonCredit(clip: CreditedClip, personId: string): boolean {
  return (clip.credits ?? []).some((credit) => credit.personIds?.includes(personId));
}

export function creditsForPerson(clip: CreditedClip, personId: string): FilmCredit[] {
  return (clip.credits ?? []).filter((credit) => credit.personIds?.includes(personId));
}

/** A featured filmography contains playable public sources with verified, explicit credits. */
export function creditedPublicWork(clips: ArchiveClip[], personId: string): ArchiveClip[] {
  return clips.filter((clip) => clip.visibility === "PUBLIC" && clip.youtubeId && clip.publicSource && clip.contentState !== "placeholder" && hasPersonCredit(clip, personId));
}

// These are presentation groups for exact recorded roles. The source's full role is retained.
const ROLE_GROUPS: Record<string, { key: string; label: string }> = {
  director: { key: "direction", label: "Direction" },
  directors: { key: "direction", label: "Direction" },
  "documentary directors": { key: "direction", label: "Direction" },
  camera: { key: "camera", label: "Camera" },
  "camera, per publisher": { key: "camera", label: "Camera" },
  "filmed by": { key: "camera", label: "Camera" },
  "shot by": { key: "camera", label: "Camera" },
  editing: { key: "editing", label: "Editing" },
  "camera and editing": { key: "camera-and-editing", label: "Camera & editing" },
  editor: { key: "editing", label: "Editing" },
  editors: { key: "editing", label: "Editing" },
  "executive producer": { key: "executive-production", label: "Executive production" },
  "executive producers": { key: "executive-production", label: "Executive production" },
  producer: { key: "production", label: "Production" },
  producers: { key: "production", label: "Production" },
  interviewer: { key: "interviews", label: "Interviews" },
  host: { key: "hosting", label: "Hosting" },
  commentary: { key: "commentary", label: "Commentary" },
};

export function creditRoleKey(role: string): string {
  return ROLE_GROUPS[role.trim().toLowerCase()]?.key ?? role.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function creditRoleLabel(role: string): string {
  return ROLE_GROUPS[role.trim().toLowerCase()]?.label ?? role;
}

export function creditRolesForPerson(clips: ArchiveClip[], personId: string): { key: string; label: string; count: number }[] {
  const groups = new Map<string, { key: string; label: string; count: number }>();
  for (const clip of clips) {
    const seen = new Set<string>();
    for (const credit of creditsForPerson(clip, personId)) {
      const key = creditRoleKey(credit.role);
      if (seen.has(key)) continue;
      seen.add(key);
      const group = groups.get(key) ?? { key, label: creditRoleLabel(credit.role), count: 0 };
      group.count += 1;
      groups.set(key, group);
    }
  }
  return [...groups.values()];
}
