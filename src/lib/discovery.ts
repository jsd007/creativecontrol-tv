import { catalog, cityLocations, clipsOnTape, getClip, getLocation } from "@/data";
import type { ArchiveClip, SourceTape } from "@/data/types";
import { MONTHS, MONTHS_SHORT } from "@/lib/format";
import { clipHeading } from "@/lib/clipDisplay";
import { isOfficialHolding } from "@/lib/holdings";
import { isAuthored, isDiscoverable } from "@/lib/visibility";

const STABLE_SEED = 17;

export type DiscoveryDoor = {
  id: "tape" | "somewhere" | "unseen" | "day" | "chicago" | "pick";
  label: string;
  kicker: string;
  href: string;
  note: string;
};

function pick<T>(items: T[], seed: number) {
  if (!items.length) return undefined;
  return items[Math.abs(seed) % items.length];
}

function publicClips() {
  return catalog.clips.filter(isDiscoverable);
}

/** PUBLIC house mock — not the official CH 07 file. */
function housePublic(clip: ArchiveClip) {
  return isDiscoverable(clip) && isAuthored(clip) && !isOfficialHolding(clip);
}

function housePublicClips() {
  return catalog.clips.filter(housePublic);
}

function publicTapes(): SourceTape[] {
  return catalog.tapes.filter((tape) => clipsOnTape(tape.id).some(isDiscoverable));
}

function houseTapes(): SourceTape[] {
  return catalog.tapes.filter((tape) => {
    if (tape.id === "t-broadcast" || tape.id.startsWith("broadcast-")) return false;
    return clipsOnTape(tape.id).some(housePublic);
  });
}

export function randomTape(seed = STABLE_SEED): SourceTape {
  return pick(houseTapes(), seed) ?? pick(publicTapes(), seed) ?? catalog.tapes[0];
}

export function takeMeSomewhereCity(seed = STABLE_SEED) {
  const cities = cityLocations().filter((loc) => {
    if (loc.city === "Chicago") return false;
    return housePublicClips().some((c) => getLocation(c.locationId)?.city === loc.city);
  });
  return pick(cities, seed + 3) ?? cityLocations().find((l) => l.city !== "Chicago") ?? cityLocations()[0];
}

export function watchSomethingUnseen(seed = STABLE_SEED): ArchiveClip {
  const unseen = publicClips().filter(
    (c) => c.type === "Unseen" || c.collectionIds.includes("unseen"),
  );
  const houseType = unseen.filter((c) => housePublic(c) && c.type === "Unseen");
  const house = unseen.filter(housePublic);
  const authoredType = unseen.filter((c) => isAuthored(c) && c.type === "Unseen");
  const authored = unseen.filter(isAuthored);
  return (
    pick(houseType, seed + 7) ??
    pick(house, seed + 7) ??
    pick(authoredType, seed + 7) ??
    pick(authored, seed + 7) ??
    pick(unseen, seed + 7) ??
    pick(housePublicClips(), seed + 7) ??
    pick(publicClips(), seed + 7) ??
    catalog.clips[0]
  );
}

export function onThisDay(date = new Date()): ArchiveClip[] {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const house = housePublicClips();
  const exactHouse = house.filter((c) => c.dateExact?.slice(5) === `${month}-${day}`);
  if (exactHouse.length) return exactHouse;
  const exact = publicClips().filter((c) => c.dateExact?.slice(5) === `${month}-${day}`);
  if (exact.length) return exact;
  const sameMonthHouse = house.filter((c) => c.dateExact?.slice(5, 7) === month);
  if (sameMonthHouse.length) return sameMonthHouse;
  const sameMonth = publicClips().filter((c) => c.dateExact?.slice(5, 7) === month);
  if (sameMonth.length) return sameMonth;
  const featuredHouse = house.filter((c) => c.featured).slice(0, 3);
  if (featuredHouse.length) return featuredHouse;
  return publicClips().filter((c) => c.featured).slice(0, 3);
}

export function fromChicago(seed = STABLE_SEED): ArchiveClip {
  const chi = publicClips().filter((c) => getLocation(c.locationId)?.city === "Chicago");
  const house = chi.filter(housePublic);
  const authored = chi.filter(isAuthored);
  return (
    pick(house, seed + 11) ??
    pick(authored, seed + 11) ??
    pick(chi, seed + 11) ??
    housePublicClips()[0] ??
    publicClips()[0] ??
    catalog.clips[0]
  );
}

export function coodiePick(seed = STABLE_SEED): ArchiveClip {
  const housePicks = housePublicClips().filter((c) => c.collectionIds.includes("coodies-picks"));
  const featuredHouse = housePicks.filter((c) => c.featured);
  const picks = publicClips().filter((c) => c.collectionIds.includes("coodies-picks"));
  const featured = picks.filter((c) => c.featured);
  return (
    pick(featuredHouse.length ? featuredHouse : housePicks, seed + 4) ??
    pick(featured.length ? featured : picks, seed + 4) ??
    housePublicClips().find((c) => c.featured) ??
    publicClips().find((c) => c.featured) ??
    catalog.clips[0]
  );
}

function dayHref(date: Date, hits: ArchiveClip[]) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const exact = hits.every((c) => c.dateExact?.slice(5) === `${month}-${day}`);
  if (hits.length > 1) {
    return exact ? `/archive?month=${month}&day=${day}` : `/archive?month=${month}`;
  }
  return `/clip/${hits[0]?.slug ?? getClip("c-01")?.slug}`;
}

function dayNote(date: Date, hits: ArchiveClip[]) {
  const mon = MONTHS_SHORT[date.getMonth()];
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const exact = hits.some((c) => c.dateExact?.slice(5) === `${month}-${dd}`);
  if (hits.length > 1) {
    return exact ? `${mon} ${day} ACROSS THE YEARS` : MONTHS[date.getMonth()];
  }
  return hits[0] ? `${clipHeading(hits[0]).toUpperCase()} · ${hits[0].year}` : `${mon} ${day}`;
}

export function discoveryDoors(seed = STABLE_SEED, date = new Date()): DiscoveryDoor[] {
  const tape = randomTape(seed);
  const city = takeMeSomewhereCity(seed);
  const unseen = watchSomethingUnseen(seed);
  const dayHits = onThisDay(date);
  const chicago = fromChicago(seed);
  const pickClip = coodiePick(seed);

  return [
    {
      id: "tape",
      label: "RANDOM TAPE",
      kicker: "A CASSETTE",
      href: `/tapes?open=${tape.id}`,
      note: `${tape.code} · ${tape.originalLabel}`,
    },
    {
      id: "somewhere",
      label: "TAKE ME SOMEWHERE",
      kicker: "A CITY",
      href: `/world?city=${city.slug}&fly=1`,
      note: city.city.toUpperCase(),
    },
    {
      id: "unseen",
      label: "UNSEEN",
      kicker: "A LEFTOVER",
      href: `/clip/${unseen.slug}`,
      note: `${clipHeading(unseen).toUpperCase()} · ${getLocation(unseen.locationId)?.name.toUpperCase() ?? ""} · ${unseen.year}`,
    },
    {
      id: "day",
      label: "ON THIS DAY",
      kicker: hitsKicker(dayHits),
      href: dayHref(date, dayHits),
      note: dayNote(date, dayHits),
    },
    {
      id: "chicago",
      label: "FROM CHICAGO",
      kicker: "CHICAGO",
      href: `/clip/${chicago.slug}`,
      note: `${clipHeading(chicago).toUpperCase()} · ${chicago.year}`,
    },
    {
      id: "pick",
      label: "COODIE'S PICK",
      kicker: "HIS CUT",
      href: `/clip/${pickClip.slug}`,
      note: `${clipHeading(pickClip).toUpperCase()} · ${pickClip.year}`,
    },
  ];
}

function hitsKicker(hits: ArchiveClip[]) {
  return hits.length > 1 ? "THE INDEX" : "THE DATE";
}

/** Stable first-paint targets for hydration. Prefer discoveryDoors for the field. */
export function discoveryTargets(seed = STABLE_SEED) {
  const doors = discoveryDoors(seed);
  return {
    randomTape: doors[0].href,
    somewhere: doors[1].href,
    unseen: doors[2].href,
    onThisDay: doors[3].href,
    chicago: doors[4].href,
    pick: doors[5].href,
  };
}
