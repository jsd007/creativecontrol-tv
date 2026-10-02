import { catalog } from "@/data";
import type { ArchiveClip, Location, Person, Project } from "@/data/types";
import { EntityDoors } from "@/components/entity/EntityDoors";
import { EntityField } from "@/components/entity/EntityField";
import { FilmmakerWork } from "@/components/entity/FilmmakerWork";
import { creditedPublicWork } from "@/lib/credits";
import {
  buildEntityGraph,
  constellationHref,
  type GraphKind,
} from "@/lib/constellation";

type Kind = GraphKind;

export function EntityView({
  kind,
  person,
  place,
  project,
  clips,
  creditRole,
}: {
  kind: Kind;
  person?: Person;
  place?: Location;
  project?: Project;
  clips: ArchiveClip[];
  creditRole?: string;
}) {
  const legal = person?.name ?? place?.name ?? project?.title ?? "";
  const mark = person?.shortName ?? place?.name ?? project?.title ?? "";
  const dek = person?.bio ?? place?.description ?? project?.description ?? "";
  const creditedWork = person ? creditedPublicWork(clips, person.id) : [];
  const kicker = creditedWork.length ? "FILMMAKER / COLLABORATOR" : kind === "person" ? "PERSON" : kind === "place" ? "PLACE" : "PROJECT";
  const entityId = person?.id ?? place?.id ?? project?.id ?? "";
  const archiveHref =
    kind === "person" && person
      ? `/archive?person=${person.id}`
      : kind === "place" && place
        ? `/archive?location=${place.id}`
        : project
          ? `/archive?project=${project.id}`
          : "/archive";

  const cityParent =
    place && place.name !== place.city
      ? catalog.locations.find((l) => l.name === place.city && l.city === place.city)
      : undefined;

  const years = [...new Set((creditedWork.length ? creditedWork : clips).map((c) => c.year))].sort((a, b) => a - b);
  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const span =
    firstYear && lastYear ? (firstYear === lastYear ? String(firstYear) : `${firstYear} — ${lastYear}`) : undefined;
  const field = entityId ? buildEntityGraph(kind, entityId) : null;
  const showLegal = Boolean(person && person.shortName !== person.name);

  const stamps: string[] = [];
  if (person?.origin) stamps.push(person.origin.toUpperCase());
  if (place) {
    if (place.name !== place.city) stamps.push(place.city.toUpperCase());
    if (place.region) stamps.push(place.region.toUpperCase());
    stamps.push(place.country.toUpperCase());
  }
  if (project) {
    stamps.push(String(project.year));
    stamps.push(project.kind.toUpperCase());
  }
  if (span && !(project && String(project.year) === span)) stamps.push(span);

  return (
    <div className="node-file px-4 pb-28 md:px-6">
      <header className="node-file-tab">
        <p className="font-cond text-[12px] tracking-[0.28em] text-leader">{kicker}</p>
        <h1 className="mt-3 max-w-[14ch] font-display text-6xl leading-none text-paper md:text-8xl">{mark}</h1>
        {showLegal ? (
          <p className="mt-4 font-cond text-[15px] tracking-[0.14em] text-dust">{legal}</p>
        ) : null}
        {stamps.length ? (
          <p className="mt-4 font-mono text-[11px] tracking-[0.16em] text-leader">{stamps.join(" · ")}</p>
        ) : null}
        {dek ? <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-bone/70">{dek}</p> : null}

        <EntityDoors
          doors={[
            ...(creditedWork.length ? [{ href: "#made-by", label: "MADE BY", loud: true }] : []),
            { href: archiveHref, label: "THE INDEX", loud: true },
            ...(field ? [{ href: constellationHref(kind, entityId), label: "THE FIELD" }] : []),
            ...(place ? [{ href: "/world", label: "THE WORLD" }] : []),
            ...(cityParent ? [{ href: `/places/${cityParent.slug}`, label: cityParent.name.toUpperCase() }] : []),
            ...(person?.id === "coodie" || person?.id === "chike" || person?.id === "ye"
              ? [{ href: `/timeline?through=${person.id}`, label: "TIMELINE PATH" }]
              : []),
            ...(place?.id === "chicago" ? [{ href: "/timeline?through=chicago", label: "TIMELINE PATH" }] : []),
          ]}
        />
      </header>

      {person && creditedWork.length ? <FilmmakerWork person={person} clips={clips} activeRole={creditRole} /> : null}

      {field ? (
        <section className={creditedWork.length ? "mt-12" : ""}>
          {creditedWork.length ? <p className="type-label text-dust">CONNECTED PEOPLE, PLACES & PROJECTS</p> : null}
          <EntityField field={field} />
        </section>
      ) : (
        <p className="mt-16 font-mono text-[11px] tracking-[0.18em] text-dust">NO FRAMES</p>
      )}
    </div>
  );
}
