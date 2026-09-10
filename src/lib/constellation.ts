import { catalog, clipsForLocation, clipsForProject, getLocation, getPerson, getProject, getTrack } from "@/data";
import type { ArchiveClip, Location, Person } from "@/data/types";
import { clipHeading } from "@/lib/clipDisplay";
import { relatedCards } from "@/lib/archiveQuery";
import { isAuthored } from "@/lib/visibility";

export type StarKind = "person" | "place" | "project" | "clip" | "track" | "event";

export type GraphKind = "person" | "place" | "project";

/** Axes that may start a relation. Year-alone and city-alone never appear. */
export type StarAxis = "TAPE" | "PROJECT" | "SONG" | "DAY" | "SUBJECT" | "PLACE" | "HOUSE";

export type StarVia = {
  href: string;
  label: string;
  year?: number;
};

/** How much of the archive actually holds this edge up. The bond, not the endpoints. */
export type StarWeight = {
  frames: number;
  firstYear: number;
  lastYear: number;
};

export type StarNode = {
  id: string;
  kind: StarKind;
  label: string;
  href: string;
  axis: StarAxis;
  year?: number;
  via?: StarVia;
  weight?: StarWeight;
};

export type Constellation = {
  center: { id: string; kind: GraphKind; name: string; shortName: string; href: string };
  nodes: StarNode[];
};

export const STAR_KIND_LABEL: Record<StarKind, string> = {
  person: "PERSON",
  place: "PLACE",
  project: "PROJECT",
  clip: "FRAME",
  track: "SONG",
  event: "EVENT",
};

const CREW = new Set(["coodie", "chike"]);
const HOSPITAL_TAPE = "t-0160";
const PARIS = "paris";
const SPINE_IDS = ["coodie", "chike", "ye", "ali", "donda"] as const;
const NODE_ORDER: StarKind[] = ["person", "project", "track", "place", "clip"];

function authoredWith(personId: string) {
  return catalog.clips.filter((c) => isAuthored(c) && c.peopleIds.includes(personId));
}

function authoredAtPlace(locationId: string) {
  return clipsForLocation(locationId).filter(isAuthored);
}

function authoredOnProject(projectId: string) {
  return clipsForProject(projectId).filter(isAuthored);
}

function mineFor(kind: GraphKind, id: string) {
  if (kind === "person") return authoredWith(id);
  if (kind === "place") return authoredAtPlace(id);
  return authoredOnProject(id);
}

function isCityScale(locationId: string) {
  const loc = getLocation(locationId);
  if (!loc) return true;
  return loc.name === loc.city;
}

function leadClip(list: ArchiveClip[]) {
  const featured = list.filter((c) => c.featured);
  return featured.find((c) => c.projectIds.length) ?? featured[0] ?? list[0];
}

function personAxis(centerId: string, otherId: string, shared: ArchiveClip[]): StarAxis | null {
  if (!shared.length) return null;
  if (!CREW.has(otherId)) return "SUBJECT";
  if (shared.some((c) => c.projectIds.length)) return "PROJECT";
  if (shared.some((c) => c.trackIds.length)) return "SONG";
  if (shared.some((c) => c.dateExact)) return "DAY";
  if (shared.some((c) => !isCityScale(c.locationId))) return "PLACE";
  if (shared.some((c) => c.sourceTapeId)) return "TAPE";
  if (CREW.has(centerId) && CREW.has(otherId)) return "PROJECT";
  return null;
}

function clipAxis(from: ArchiveClip, to: ArchiveClip): StarAxis {
  if (to.sourceTapeId && to.sourceTapeId === from.sourceTapeId) return "TAPE";
  if (from.projectIds.some((id) => to.projectIds.includes(id))) return "PROJECT";
  if (from.trackIds.some((id) => to.trackIds.includes(id))) return "SONG";
  if (from.dateExact && from.dateExact === to.dateExact) return "DAY";
  const subjects = from.peopleIds.filter((id) => to.peopleIds.includes(id) && !CREW.has(id));
  if (subjects.length) return "SUBJECT";
  if (from.locationId === to.locationId && !isCityScale(from.locationId)) return "PLACE";
  return "HOUSE";
}

function featuredShared(clips: ArchiveClip[]) {
  return clips.filter((c) => c.featured).length;
}

function isAliCenter(kind: GraphKind, id: string) {
  return (kind === "person" && id === "ali") || (kind === "project" && id === "ali");
}

function allowRelated(kind: GraphKind, id: string, clip: ArchiveClip) {
  if (!isAliCenter(kind, id)) return true;
  if (clip.locationId === PARIS) return false;
  if (clip.sourceTapeId === HOSPITAL_TAPE) return false;
  return true;
}

function allowPlace(kind: GraphKind, id: string, loc: Location) {
  if (!isAliCenter(kind, id)) return true;
  return loc.id !== PARIS;
}

function sortNodes(nodes: StarNode[]) {
  nodes.sort((a, b) => NODE_ORDER.indexOf(a.kind) - NODE_ORDER.indexOf(b.kind) || a.label.localeCompare(b.label));
  return nodes;
}

function pickPeopleNodes(mine: ArchiveClip[], centerId: string): StarNode[] {
  const others = [...new Set(mine.flatMap((c) => c.peopleIds))].filter((id) => id !== centerId);
  const rankedPeople = others
    .map((id) => {
      const shared = mine.filter((c) => c.peopleIds.includes(id));
      const axis = personAxis(centerId, id, shared);
      return { id, axis, n: shared.length, featured: featuredShared(shared), subject: !CREW.has(id) };
    })
    .filter((row) => row.axis)
    .sort((a, b) => Number(b.subject) - Number(a.subject) || b.featured - a.featured || b.n - a.n);

  const peopleIds: string[] = [];
  for (const row of rankedPeople) {
    if (row.subject && peopleIds.length < 2) peopleIds.push(row.id);
  }
  const partner = rankedPeople.find((row) => CREW.has(row.id) && !peopleIds.includes(row.id));
  if (partner) peopleIds.push(partner.id);
  if (peopleIds.length < 3) {
    for (const row of rankedPeople) {
      if (peopleIds.includes(row.id)) continue;
      peopleIds.push(row.id);
      if (peopleIds.length >= 3) break;
    }
  }

  const nodes: StarNode[] = [];
  for (const id of peopleIds) {
    const p = getPerson(id);
    const row = rankedPeople.find((r) => r.id === id);
    if (!p || !row?.axis) continue;
    nodes.push({ id: p.id, kind: "person", label: p.shortName, href: `/people/${p.slug}`, axis: row.axis });
  }
  return nodes;
}

function pickProjectNode(mine: ArchiveClip[], origin: ArchiveClip, excludeId?: string): StarNode | undefined {
  const projectIds = [
    ...origin.projectIds,
    ...mine.filter((c) => c.featured).flatMap((c) => c.projectIds),
    ...mine.flatMap((c) => c.projectIds),
  ];
  const project = [...new Set(projectIds)].map(getProject).find((p) => p && p.id !== excludeId);
  if (!project) return;
  return {
    id: project.id,
    kind: "project",
    label: project.title,
    href: `/projects/${project.slug}`,
    axis: "PROJECT",
    year: project.year,
  };
}

function pickTrackNode(mine: ArchiveClip[], origin: ArchiveClip): StarNode | undefined {
  const trackIds = [
    ...origin.trackIds,
    ...mine.filter((c) => c.featured).flatMap((c) => c.trackIds),
    ...mine.flatMap((c) => c.trackIds),
  ];
  const track = [...new Set(trackIds)].map(getTrack).find(Boolean);
  if (!track) return;
  const hit = mine.find((c) => c.trackIds.includes(track.id) && c.featured) ?? mine.find((c) => c.trackIds.includes(track.id));
  return {
    id: track.id,
    kind: "track",
    label: track.title,
    href: hit ? `/clip/${hit.slug}` : `/archive?track=${track.id}`,
    axis: "SONG",
    year: track.year,
  };
}

function pickPlaceNode(
  mine: ArchiveClip[],
  origin: ArchiveClip,
  kind: GraphKind,
  centerId: string,
  excludeId?: string,
): StarNode | undefined {
  const related = relatedCards(origin, 2).filter((c) => allowRelated(kind, centerId, c));
  const originLoc = getLocation(origin.locationId);
  const nearIds = [origin.locationId, ...related.map((c) => c.locationId)];
  const ok = (loc: Location) => loc.id !== excludeId && allowPlace(kind, centerId, loc);
  const specificNear = nearIds.map(getLocation).find((loc) => loc && loc.name !== loc.city && ok(loc));
  const place =
    (originLoc && originLoc.name !== originLoc.city && ok(originLoc) ? originLoc : undefined) ??
    specificNear ??
    (originLoc && ok(originLoc) && mine.some((c) => c.locationId === originLoc.id && c.featured) ? originLoc : undefined);
  if (!place) return;
  return { id: place.id, kind: "place", label: place.name, href: `/places/${place.slug}`, axis: "PLACE" };
}

function pickNeighborhood(mine: ArchiveClip[], cityId: string): StarNode | undefined {
  const city = getLocation(cityId);
  if (!city || city.name !== city.city) return;
  const counts = new Map<string, { n: number; featured: number }>();
  for (const clip of mine) {
    if (clip.locationId === cityId) continue;
    const loc = getLocation(clip.locationId);
    if (!loc || loc.city !== city.city || loc.name === loc.city) continue;
    const row = counts.get(loc.id) ?? { n: 0, featured: 0 };
    row.n += 1;
    if (clip.featured) row.featured += 1;
    counts.set(loc.id, row);
  }
  const best = [...counts.entries()].sort((a, b) => b[1].featured - a[1].featured || b[1].n - a[1].n)[0];
  if (!best) return;
  const loc = getLocation(best[0]);
  if (!loc) return;
  return { id: loc.id, kind: "place", label: loc.name, href: `/places/${loc.slug}`, axis: "PLACE" };
}

function pickFrameNodes(origin: ArchiveClip, kind: GraphKind, centerId: string): StarNode[] {
  return relatedCards(origin, 2)
    .filter((clip) => allowRelated(kind, centerId, clip))
    .map((clip) => ({
      id: clip.id,
      kind: "clip" as const,
      label: clipHeading(clip),
      href: `/clip/${clip.slug}`,
      axis: clipAxis(origin, clip),
      year: clip.year,
    }));
}

function viaFromClips(clips: ArchiveClip[]): StarVia | undefined {
  const clip = clips.find((c) => isAuthored(c) && c.featured) ?? clips.find((c) => isAuthored(c));
  if (!clip) return;
  return { href: `/clip/${clip.slug}`, label: clipHeading(clip), year: clip.year };
}

function clipsForNode(node: StarNode, mine: ArchiveClip[]) {
  if (node.kind === "person") return mine.filter((c) => c.peopleIds.includes(node.id));
  if (node.kind === "place") {
    const loc = getLocation(node.id);
    if (!loc) return [];
    const cityRoot = loc.name === loc.city;
    return mine.filter((c) => {
      const here = getLocation(c.locationId);
      return cityRoot ? here?.city === loc.city : c.locationId === loc.id;
    });
  }
  if (node.kind === "project") return mine.filter((c) => c.projectIds.includes(node.id));
  if (node.kind === "track") return mine.filter((c) => c.trackIds.includes(node.id));
  return [];
}

function weightFromClips(clips: ArchiveClip[]): StarWeight | undefined {
  if (!clips.length) return;
  const years = clips.map((c) => c.year).sort((a, b) => a - b);
  return { frames: clips.length, firstYear: years[0], lastYear: years[years.length - 1] };
}

/** A frame is one frame — it carries no span. Every other bond states what holds it up. */
function attachEvidence(field: Constellation, mine: ArchiveClip[]): Constellation {
  return {
    ...field,
    nodes: field.nodes.map((node) => {
      if (node.kind === "clip") return node;
      const shared = clipsForNode(node, mine);
      const via = viaFromClips(shared);
      const weight = weightFromClips(shared);
      if (!via && !weight) return node;
      return { ...node, ...(via ? { via } : {}), ...(weight ? { weight } : {}) };
    }),
  };
}

/** The evidence line both relationship surfaces print. Never a score, never a percentage. */
export function weightLine(weight: StarWeight) {
  const span =
    weight.firstYear === weight.lastYear
      ? String(weight.firstYear)
      : `${weight.firstYear} — ${weight.lastYear}`;
  return `${weight.frames} ${weight.frames === 1 ? "FRAME" : "FRAMES"} · ${span}`;
}

function finish(center: Constellation["center"], nodes: StarNode[]): Constellation {
  return { center, nodes: sortNodes(nodes) };
}

export function constellationSpine() {
  return SPINE_IDS.map((id) => getPerson(id)).filter((p): p is Person => {
    if (!p) return false;
    return authoredWith(p.id).length > 0;
  });
}

/** A few true spokes — not every valid edge. Person density is the house cut. */
export function buildConstellation(personId: string): Constellation | null {
  const person = getPerson(personId);
  if (!person) return null;
  const mine = authoredWith(person.id).filter((c) => allowRelated("person", person.id, c));
  if (!mine.length) return null;
  const origin = leadClip(mine);
  const nodes: StarNode[] = [
    ...pickPeopleNodes(mine, person.id),
  ];
  const project = pickProjectNode(mine, origin);
  if (project) nodes.push(project);
  const track = pickTrackNode(mine, origin);
  if (track) nodes.push(track);
  const place = pickPlaceNode(mine, origin, "person", person.id);
  if (place) nodes.push(place);
  nodes.push(...pickFrameNodes(origin, "person", person.id));
  return finish(
    {
      id: person.id,
      kind: "person",
      name: person.name,
      shortName: person.shortName,
      href: `/people/${person.slug}`,
    },
    nodes,
  );
}

function buildPlaceField(locationId: string): Constellation | null {
  const place = getLocation(locationId);
  if (!place) return null;
  const mine = authoredAtPlace(place.id);
  if (!mine.length) return null;
  const origin = leadClip(mine);
  const nodes: StarNode[] = [...pickPeopleNodes(mine, "")];
  const project = pickProjectNode(mine, origin);
  if (project) nodes.push(project);
  const track = pickTrackNode(mine, origin);
  if (track) nodes.push(track);
  if (place.name === place.city) {
    const neighborhood = pickNeighborhood(mine, place.id);
    if (neighborhood) nodes.push(neighborhood);
  }
  nodes.push(...pickFrameNodes(origin, "place", place.id));
  return finish(
    {
      id: place.id,
      kind: "place",
      name: place.name,
      shortName: place.name,
      href: `/places/${place.slug}`,
    },
    nodes,
  );
}

function buildProjectField(projectId: string): Constellation | null {
  const project = getProject(projectId);
  if (!project) return null;
  const mine = authoredOnProject(project.id).filter((c) => allowRelated("project", project.id, c));
  if (!mine.length) return null;
  const origin = leadClip(mine);
  const nodes: StarNode[] = [...pickPeopleNodes(mine, "")];
  const track = pickTrackNode(mine, origin);
  if (track) nodes.push(track);
  const place = pickPlaceNode(mine, origin, "project", project.id);
  if (place) nodes.push(place);
  nodes.push(...pickFrameNodes(origin, "project", project.id));
  return finish(
    {
      id: project.id,
      kind: "project",
      name: project.title,
      shortName: project.title,
      href: `/projects/${project.slug}`,
    },
    nodes,
  );
}

export function buildField(kind: GraphKind, id: string): Constellation | null {
  if (kind === "person") return buildConstellation(id);
  if (kind === "place") return buildPlaceField(id);
  return buildProjectField(id);
}

/** Same spokes as the field, with the frames that prove each edge and the span they cover. */
export function buildEntityGraph(kind: GraphKind, id: string): Constellation | null {
  const field = buildField(kind, id);
  if (!field) return null;
  return attachEvidence(field, mineFor(kind, id).filter((c) => allowRelated(kind, id, c)));
}

export function constellationHref(kind: GraphKind, id: string) {
  if (kind === "person") return `/constellation?person=${id}`;
  if (kind === "place") return `/constellation?place=${id}`;
  return `/constellation?project=${id}`;
}

export function resolveConstellationPerson(raw?: string | null): Person {
  return getPerson(raw ?? "coodie") ?? getPerson("coodie") ?? catalog.people[0];
}

export function resolveConstellationCenter(
  person?: string | null,
  place?: string | null,
  project?: string | null,
): { kind: GraphKind; id: string } {
  if (person) {
    const p = getPerson(person);
    if (p && authoredWith(p.id).length) return { kind: "person", id: p.id };
  }
  if (place) {
    const loc = getLocation(place);
    if (loc && authoredAtPlace(loc.id).length) return { kind: "place", id: loc.id };
  }
  if (project) {
    const proj = getProject(project);
    if (proj && authoredOnProject(proj.id).length) return { kind: "project", id: proj.id };
  }
  return { kind: "person", id: resolveConstellationPerson(person).id };
}
