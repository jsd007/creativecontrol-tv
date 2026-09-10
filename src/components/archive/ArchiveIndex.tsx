"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { catalog, getCollection, getLocation, getPerson, getProject } from "@/data";
import type { ArchiveFilters } from "@/lib/archiveQuery";
import { activeFilterCount, filterClips, sentenceFor, yearsInCatalog } from "@/lib/archiveQuery";
import { bindCollectionFilter } from "@/lib/collectionMembership";
import { isAuthored, isDiscoverable } from "@/lib/visibility";
import { IndexSheet } from "./IndexSheet";
import Link from "next/link";

const DECADES = [
  { id: "1990s", start: 1994, end: 1999 },
  { id: "2000s", start: 2000, end: 2009 },
  { id: "2010s", start: 2010, end: 2019 },
  { id: "2020s", start: 2020, end: 2026 },
] as const;

const GRAVITY_PLACES = ["chicago", "cottage-grove", "south-side", "new-york", "dd172", "coney"];
const SPINE_PEOPLE = ["coodie", "chike", "ye", "ali", "donda"];
const SPINE_TYPES = ["Studio", "Interview", "Performance", "Broadcast", "Unseen"] as const;
const SPINE_COLLECTIONS: { id: string; label: string }[] = [
  { id: "channel-zero", label: "Channel Zero" },
  { id: "through-the-wire", label: "Through the Wire" },
  { id: "coodies-picks", label: "Coodie's Picks" },
  { id: "unseen", label: "Unseen" },
  { id: "classics", label: "Classics" },
  { id: "road-dropout", label: "College Dropout road" },
];

function Rail({
  label,
  value,
  onChange,
  options,
  href,
}: {
  label: string;
  value?: string;
  onChange: (next?: string) => void;
  options: { value: string; label: string }[];
  href?: string;
}) {
  return (
    <div className="border-t border-paper/10 py-3">
      {href ? (
        <Link href={href} className="type-label hover:text-paper">
          {label}
        </Link>
      ) : (
        <p className="type-label">{label}</p>
      )}
      <div className="hand-strip mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={`font-cond text-[13px] tracking-[0.12em] ${value ? "text-dust hover:text-paper" : "text-paper"}`}
        >
          ALL
        </button>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(value === opt.value ? undefined : opt.value)}
            className={`font-cond text-[13px] tracking-[0.12em] ${
              value === opt.value ? "text-leader" : "text-dust hover:text-paper"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function withSelected<T extends { value: string }>(options: T[], selected?: string, extra?: T) {
  if (!selected || options.some((o) => o.value === selected)) return extra ? [extra, ...options.filter((o) => o.value !== extra.value)] : options;
  if (extra) return [extra, ...options];
  return options;
}

export function ArchiveIndex({ initial }: { initial: ArchiveFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const [q, setQ] = useState(initial.q ?? "");
  const [openDecade, setOpenDecade] = useState<string | null>(null);

  const filters: ArchiveFilters = useMemo(
    () => ({
      q: search.get("q") ?? undefined,
      era: search.get("era") ?? undefined,
      year: search.get("year") ?? undefined,
      location: search.get("location") ?? undefined,
      person: search.get("person") ?? undefined,
      track: search.get("track") ?? undefined,
      album: search.get("album") ?? undefined,
      project: search.get("project") ?? undefined,
      event: search.get("event") ?? undefined,
      type: search.get("type") ?? undefined,
      collection: bindCollectionFilter(search.get("collection") ?? undefined),
      month: search.get("month") ?? undefined,
      day: search.get("day") ?? undefined,
    }),
    [search],
  );

  const matches = useMemo(() => filterClips(filters), [filters]);
  const filterCount = activeFilterCount(filters);
  const querying = filterCount > 0;
  const authored = useMemo(() => matches.filter(isAuthored), [matches]);
  const sheet = useMemo(() => authored.filter(isDiscoverable), [authored]);
  /** Search may hit prototype transcript density. A year / rail asks for authored holdings, not UNLOGGED as a title. */
  const results = filters.q ? matches : querying ? authored : sheet;
  const sentence = sentenceFor(filters);
  const years = yearsInCatalog();

  const era = filters.era ? catalog.eras.find((e) => e.id === filters.era) : undefined;
  const yearNum = filters.year ? Number(filters.year) : undefined;
  const decadeFromYear = yearNum
    ? DECADES.find((d) => yearNum >= d.start && yearNum <= d.end)?.id ?? null
    : null;
  const decadeId = openDecade ?? decadeFromYear;
  const decade = DECADES.find((d) => d.id === decadeId);

  const yearOptions = (() => {
    if (era) return years.filter((y) => y >= era.startYear && y <= era.endYear);
    if (decade) return years.filter((y) => y >= decade.start && y <= decade.end);
    return [] as number[];
  })();

  const placeOptions = withSelected(
    GRAVITY_PLACES.map((id) => {
      const loc = getLocation(id);
      return loc ? { value: loc.id, label: loc.name } : null;
    }).filter(Boolean) as { value: string; label: string }[],
    filters.location,
    filters.location
      ? { value: filters.location, label: getLocation(filters.location)?.name ?? filters.location }
      : undefined,
  );

  const personOptions = withSelected(
    SPINE_PEOPLE.map((id) => {
      const p = getPerson(id);
      return p ? { value: p.id, label: p.shortName } : null;
    }).filter(Boolean) as { value: string; label: string }[],
    filters.person,
    filters.person
      ? { value: filters.person, label: getPerson(filters.person)?.shortName ?? filters.person }
      : undefined,
  );

  function setFilters(patch: Partial<Record<keyof ArchiveFilters, string | undefined>>) {
    const next = new URLSearchParams(search.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if ("month" in patch && !patch.month) next.delete("day");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function setFilter(key: keyof ArchiveFilters, value?: string) {
    setFilters({ [key]: value });
  }

  function chooseEra(id?: string) {
    const next: Partial<Record<keyof ArchiveFilters, string | undefined>> = { era: id };
    if (id && yearNum) {
      const chosen = catalog.eras.find((e) => e.id === id);
      if (chosen && (yearNum < chosen.startYear || yearNum > chosen.endYear)) next.year = undefined;
    }
    if (!id) setOpenDecade(null);
    setFilters(next);
  }

  function chooseDecade(id: string) {
    const same = decadeId === id && !filters.year;
    setOpenDecade(same ? null : id);
    if (filters.year) {
      const d = DECADES.find((row) => row.id === id);
      const y = Number(filters.year);
      if (d && (y < d.start || y > d.end)) setFilters({ year: undefined });
    }
  }

  function bindSearch(raw: string) {
    const text = raw.trim();
    if (!text) {
      setQ("");
      setFilters({ q: undefined });
      return;
    }

    const lower = text.toLowerCase();
    const yearHit = years.find((y) => String(y) === text);
    if (yearHit) {
      setQ("");
      setFilters({ q: undefined, year: String(yearHit) });
      return;
    }

    const personHit = catalog.people.find(
      (p) =>
        p.id === lower ||
        p.shortName.toLowerCase() === lower ||
        p.name.toLowerCase() === lower ||
        p.aka?.some((a) => a.toLowerCase() === lower),
    );
    if (personHit) {
      setQ("");
      setFilters({ q: undefined, person: personHit.id });
      return;
    }

    const placeHit = catalog.locations.find(
      (l) => l.id === lower || l.slug === lower || l.name.toLowerCase() === lower,
    );
    if (placeHit) {
      setQ("");
      setFilters({ q: undefined, location: placeHit.id });
      return;
    }

    const typeHit = [...new Set(catalog.clips.map((c) => c.type))].find((t) => t.toLowerCase() === lower);
    if (typeHit) {
      setQ("");
      setFilters({ q: undefined, type: typeHit });
      return;
    }

    const collectionHit =
      SPINE_COLLECTIONS.find((c) => c.label.toLowerCase() === lower) ??
      catalog.collections.find(
        (c) => c.id === lower || c.slug === lower || c.name.toLowerCase() === lower,
      );
    if (collectionHit) {
      setQ("");
      setFilters({ q: undefined, collection: collectionHit.id });
      return;
    }

    setFilters({ q: text });
  }

  return (
    <div className="archive-index px-4 pb-24 md:px-6">
      <h1 className="sr-only">The Index</h1>
      <form
        role="search"
        className="archive-index-search mt-8 border-b border-paper/15 pb-3"
        onSubmit={(e) => {
          e.preventDefault();
          bindSearch(q);
        }}
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="A person, a tape code, a street, a year…"
          aria-label="Search the index"
          className="archive-find w-full bg-transparent font-display text-3xl text-paper placeholder:text-paper/25 md:text-4xl"
        />
      </form>

      <details className="archive-refine mt-6 max-w-5xl">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-y border-paper/10 py-3 font-cond text-[13px] tracking-[0.14em] text-dust hover:text-paper">
          <span>REFINE THE INDEX</span>
          <span className={filterCount ? "text-leader" : "text-dust"}>
            {filterCount ? `${filterCount} SET` : "ERA · YEAR · PLACE · PERSON · TYPE"}
          </span>
        </summary>
        <div className="archive-refine-body pt-3">
          <Rail
            label="ERA"
            value={filters.era}
            onChange={chooseEra}
            options={catalog.eras.map((e) => ({ value: e.id, label: e.name }))}
          />

        <div className="border-t border-paper/10 py-3">
          <p className="type-label">SPAN</p>
          <div className="hand-strip mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <button
              type="button"
              onClick={() => {
                setOpenDecade(null);
                setFilters({ year: undefined });
              }}
              className={`font-cond text-[13px] tracking-[0.12em] ${filters.year || decadeId ? "text-dust hover:text-paper" : "text-paper"}`}
            >
              ALL
            </button>
            {DECADES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => chooseDecade(d.id)}
                className={`font-cond text-[13px] tracking-[0.12em] ${
                  decadeId === d.id ? "text-leader" : "text-dust hover:text-paper"
                }`}
              >
                {d.id}
              </button>
            ))}
          </div>
          {yearOptions.length ? (
            <div className="hand-strip mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {yearOptions.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setFilter("year", filters.year === String(y) ? undefined : String(y))}
                  className={`font-mono text-[12px] tracking-[0.08em] ${
                    filters.year === String(y) ? "text-leader" : "text-dust hover:text-paper"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 font-mono text-[12px] tracking-[0.08em] text-dust">ERA OR DECADE, THEN A YEAR</p>
          )}
        </div>

          <Rail label="PLACE" value={filters.location} onChange={(v) => setFilter("location", v)} options={placeOptions} />
          <Rail label="PERSON" value={filters.person} onChange={(v) => setFilter("person", v)} options={personOptions} />
          <Rail
            label="TYPE"
            value={filters.type}
            onChange={(v) => setFilter("type", v)}
            options={withSelected(
              SPINE_TYPES.map((t) => ({ value: t, label: t })),
              filters.type,
              filters.type ? { value: filters.type, label: filters.type } : undefined,
            )}
          />
          <Rail
            label="COLLECTION"
            href="/collections"
            value={filters.collection}
            onChange={(v) => setFilter("collection", v)}
            options={withSelected(
              SPINE_COLLECTIONS.map((c) => ({ value: c.id, label: c.label })),
              filters.collection,
              filters.collection
                ? {
                    value: filters.collection,
                    label:
                      SPINE_COLLECTIONS.find((c) => c.id === filters.collection)?.label ??
                      getCollection(filters.collection)?.name ??
                      filters.collection,
                  }
                : undefined,
            )}
          />
        </div>
      </details>

      <div className="archive-index-query mt-8 flex flex-wrap items-end justify-between gap-4 border-y border-paper/10 py-4">
        <div>
          <p className="type-label">CURRENT QUERY</p>
          <p className="mt-2 max-w-3xl font-cond text-[16px] tracking-[0.08em] text-paper">{sentence}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {filters.person && getPerson(filters.person) ? (
            <Link href={`/people/${getPerson(filters.person)!.slug}`} className="font-cond text-[12px] tracking-[0.16em] text-dust hover:text-paper">
              {getPerson(filters.person)!.shortName.toUpperCase()}
            </Link>
          ) : null}
          {filters.location && getLocation(filters.location) ? (
            <Link href={`/places/${getLocation(filters.location)!.slug}`} className="font-cond text-[12px] tracking-[0.16em] text-dust hover:text-paper">
              {getLocation(filters.location)!.name.toUpperCase()}
            </Link>
          ) : null}
          {filters.project && getProject(filters.project) ? (
            <Link href={`/projects/${getProject(filters.project)!.slug}`} className="font-cond text-[12px] tracking-[0.16em] text-dust hover:text-paper">
              {getProject(filters.project)!.title.toUpperCase()}
            </Link>
          ) : null}
          {filters.collection && getCollection(filters.collection) ? (
            <Link href={`/collections/${getCollection(filters.collection)!.slug}`} className="font-cond text-[12px] tracking-[0.16em] text-dust hover:text-paper">
              {getCollection(filters.collection)!.name.toUpperCase()}
            </Link>
          ) : null}
          {querying ? (
            <p className="font-mono text-[12px] tracking-[0.16em] text-leader">
              {results.length} {results.length === 1 ? "RECORD" : "RECORDS"}
            </p>
          ) : null}
        </div>
      </div>

      <IndexSheet
        clips={results}
        collapseOfficial={!filters.year && !filters.q && !filters.month && !filters.day && !filters.collection}
        onYear={(y) => setFilter("year", filters.year === String(y) ? undefined : String(y))}
      />

      {!results.length ? (
        <p className="mt-16 font-mono text-[12px] tracking-[0.1em] text-dust">NO RECORDS</p>
      ) : null}
    </div>
  );
}
