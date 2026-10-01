"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { catalog, getEra, getLocation, getPerson, getProject, getTape } from "@/data";
import type { ArchiveClip } from "@/data/types";
import { youtubeThumbnail, youtubeUploads } from "@/data/youtube";
import { HoldingLine } from "@/components/archive/HoldingLine";
import { PrototypeField } from "@/components/media/PrototypeMedia";
import { clipHeading, filmBeat, isUnlogged } from "@/lib/clipDisplay";
import { clipWhen, formatDate, MONTHS, MONTHS_SHORT } from "@/lib/format";
import { isOfficialHolding, sortHoldings } from "@/lib/holdings";
import { isTypingTarget } from "@/lib/keys";
import { clipHref, lensHref } from "@/lib/lensNavigation";
import { usePrefersReducedMotion } from "@/lib/motion";
import {
  TIMELINE_SPAN,
  TIMELINE_THREADS,
  parseTimelineQuery,
  timelineSearch,
  type TimelinePath,
  type TimelineQuery,
} from "@/lib/timelineQuery";
import "./timeline.css";

const THREADS = TIMELINE_THREADS;
const SPAN = TIMELINE_SPAN;
const UPLOADS = new Map(youtubeUploads.map((upload) => [upload.id, upload]));
const START_MOMENTS = [
  { year: 1995, slug: "she-watch-channel-zero" },
  { year: 2002, slug: "basement-october-2002" },
  { year: 2009, slug: "curren-y-wiz-khalifa-nyc-cmj-2009-www-creativecontrol-tv" },
  { year: 2012, slug: "wiki-wikispeaks" },
  { year: 2016, slug: "channel-zero-redman-erykah-badu" },
  { year: 2025, slug: "vision-behind-window-seat" },
];
const DECADES = [
  { id: "1990s", start: 1994, end: 1999, line: "Public access. Informal rooms. Chicago." },
  { id: "2000s", start: 2000, end: 2009, line: "The long shoot, then a network. New York." },
  { id: "2010s", start: 2010, end: 2019, line: "Documents. Sports." },
  { id: "2020s", start: 2020, end: 2026, line: "jeen-yuhs. Then after the cut." },
] as const;

function matchesPath(path: TimelinePath, clip: ArchiveClip) {
  if (path === "coodie") return clip.peopleIds.includes("coodie");
  if (path === "chike") return clip.peopleIds.includes("chike");
  if (path === "ye") return clip.peopleIds.includes("ye");
  if (path === "dropout") return clip.albumIds.includes("dropout") || clip.collectionIds.includes("road-dropout");
  if (path === "chicago") return getLocation(clip.locationId)?.city === "Chicago";
  if (path === "cc") return clip.era === "network" || clip.collectionIds.includes("classics");
  return true;
}

function whenFor(clip: ArchiveClip) {
  return clipWhen(clip, isOfficialHolding(clip) ? undefined : getTape(clip.sourceTapeId)?.recordedDate);
}

function spanLead(list: ArchiveClip[]) {
  const named = list.filter((clip) => !isUnlogged(clip));
  return named.find((clip) => clip.youtubeId && clip.featured)
    ?? named.find((clip) => clip.youtubeId)
    ?? named.find((clip) => clip.featured)
    ?? named[0]
    ?? list[0];
}

function spanStory(clip?: ArchiveClip) {
  if (!clip) return "";
  return filmBeat({
    title: clip.title,
    unlogged: isUnlogged(clip),
    tapeLabel: getTape(clip.sourceTapeId)?.originalLabel,
    projectTitle: clip.projectIds.map((id) => getProject(id)).find(Boolean)?.title,
    eraName: getEra(clip.era)?.name,
  });
}

function spanBonds(clip?: ArchiveClip) {
  if (!clip) return "";
  const people = clip.peopleIds.map((id) => getPerson(id)?.shortName).filter(Boolean).slice(0, 2);
  const place = getLocation(clip.locationId)?.name;
  return [...people, place].filter(Boolean).join(" · ").toUpperCase();
}

function uploadDateLabel(clip: ArchiveClip) {
  if (clip.contentState === "project-reference") return `PROJECT YEAR · ${clip.year}`;
  if (!clip.youtubeId) return `EXAMPLE DATE · ${formatDate(clip)}`;
  const upload = UPLOADS.get(clip.youtubeId);
  const published = clip.publicSource?.published ?? upload?.published;
  if (published) {
    return `UPLOADED · ${formatDate({ dateExact: published, year: clip.year })}`;
  }
  return `UPLOAD YEAR · ${upload?.publishedApproximate ? `~${upload.publishedApproximate}` : "UNCONFIRMED"}`;
}

/** A small, varied entry point, not the whole year's holdings at once. */
function yearSelection(clips: ArchiveClip[]) {
  const named = clips.filter((clip) => !isUnlogged(clip));
  const publicClips = named.filter((clip) => clip.youtubeId);
  const pool = publicClips.length >= 6 ? publicClips : named;
  const start = START_MOMENTS.find((moment) => pool.some((clip) => clip.slug === moment.slug));
  const ranked = [...pool].sort((a, b) =>
    Number(b.slug === start?.slug) - Number(a.slug === start?.slug) ||
    Number(Boolean(b.youtubeId)) - Number(Boolean(a.youtubeId)) ||
    Number(b.featured) - Number(a.featured) ||
    clipHeading(a).localeCompare(clipHeading(b)),
  );
  const selected: ArchiveClip[] = [];
  const used = new Set<string>();
  const categories = new Set<string>();
  for (const clip of ranked) {
    const category = `${clip.projectIds[0] ?? ""}:${clip.type}`;
    if (categories.has(category)) continue;
    selected.push(clip);
    used.add(clip.id);
    categories.add(category);
    if (selected.length === 6) return selected;
  }
  for (const clip of ranked) {
    if (used.has(clip.id)) continue;
    selected.push(clip);
    if (selected.length === 6) break;
  }
  return selected;
}

function ThroughLine({
  threads,
  onPath,
  className = "mt-4 max-w-[42ch]",
  label = "Through",
}: {
  threads: readonly (typeof THREADS)[number][];
  onPath: (id: TimelinePath) => void;
  className?: string;
  label?: string;
}) {
  if (!threads.length) return null;
  return (
    <nav aria-label={label} className={className}>
      <p className="font-cond text-[14px] leading-[2] tracking-[0.12em] text-dust">
        <span className="text-dust/55">through </span>
        {threads.map((thread, index) => (
          <span key={thread.id}>
            {index > 0 ? <span className="mx-[0.55em] text-paper/20" aria-hidden>·</span> : null}
            <button type="button" onClick={() => onPath(thread.id)} className="hover:text-paper">
              {thread.label}
            </button>
          </span>
        ))}
      </p>
    </nav>
  );
}

export function TimelineView() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const query = useMemo(() => parseTimelineQuery(search), [search]);
  const { through: path, year, month, day } = query;
  const reduced = usePrefersReducedMotion();
  const returnHref = lensHref("/timeline", search.toString());

  function write(next: Partial<TimelineQuery>) {
    const merged: TimelineQuery = { ...query, ...next };
    if (!merged.year) { merged.month = null; merged.day = null; }
    if (merged.month === null) merged.day = null;
    router.replace(`${pathname}${timelineSearch(merged, search)}`, { scroll: false });
  }

  const byYear = useMemo(() => {
    const map = new Map<number, ArchiveClip[]>();
    for (const value of SPAN) map.set(value, []);
    for (const clip of catalog.clips) {
      if (matchesPath(path, clip)) map.get(whenFor(clip).year)?.push(clip);
    }
    return map;
  }, [path]);
  const populated = SPAN.filter((value) => (byYear.get(value)?.length ?? 0) > 0);
  const yearClips = year ? byYear.get(year) ?? [] : [];
  const datedMonths = [...new Set(yearClips.map((clip) => whenFor(clip).month).filter((value): value is number => value !== null))].sort((a, b) => a - b);
  const hasUndated = yearClips.some((clip) => whenFor(clip).undated);
  const periodClips = yearClips.filter((clip) => {
    const when = whenFor(clip);
    if (month === 0) return when.undated;
    if (month !== null && when.month !== month) return false;
    return !day || when.key === day;
  });
  const dates = [...new Set(yearClips.filter((clip) => whenFor(clip).month === month).map((clip) => whenFor(clip).key))].sort();
  const selection = yearSelection(periodClips);
  const thread = THREADS.find((item) => item.id === path);
  const yearIndex = year ? populated.indexOf(year) : -1;
  const previousYear = yearIndex > 0 ? populated[yearIndex - 1] : undefined;
  const nextYear = yearIndex >= 0 ? populated[yearIndex + 1] : undefined;
  const startingMoments = START_MOMENTS.map(({ year: value, slug }) => ({
    year: value,
    clip: (byYear.get(value) ?? []).find((clip) => clip.slug === slug) ?? spanLead(byYear.get(value) ?? []),
  })).filter((item) => item.clip);

  function choosePath(nextPath: TimelinePath) {
    const matching = catalog.clips.filter((clip) => matchesPath(nextPath, clip));
    const keepYear = year && matching.some((clip) => whenFor(clip).year === year);
    write({ through: nextPath, year: keepYear ? year : null, month: null, day: null });
  }

  function chooseYear(value: number) {
    write({ year: value, month: null, day: null });
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target) || event.key !== "Escape") return;
      if (day && month !== 0) write({ day: null });
      else if (month !== null) write({ month: null, day: null });
      else if (year) write({ year: null });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className={`timeline-view px-4 pb-24 md:px-6${year ? " timeline-focused" : ""}`}>
      <header className="pt-4">
        <p className="font-cond text-[12px] tracking-[0.12em] text-leader">{year ? "THE TIMELINE" : thread ? "THROUGH" : "THE TIMELINE"}</p>
        <h1 className="mt-2 font-display text-5xl leading-none text-paper md:text-6xl">{year ?? thread?.label ?? "1994 — 2026"}</h1>
        {year ? <p className="timeline-year-dek">{thread ? `Following ${thread.label.toLowerCase()}. ` : ""}{periodClips.length} {periodClips.length === 1 ? "entry" : "entries"}. A few places to begin, with the full index below.</p> : null}
      </header>

      {year ? (
        <div className="timeline-context-bar">
          <button type="button" onClick={() => write({ year: null })}>← ALL YEARS</button>
          <label>YEAR
            <select aria-label="Jump to a year" value={year} onChange={(event) => chooseYear(Number(event.target.value))}>
              {populated.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>FOLLOW
            <select aria-label="Follow a timeline thread" value={path} onChange={(event) => choosePath(event.target.value as TimelinePath)}>
              <option value="all">ALL STORIES</option>
              {THREADS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <div className="timeline-year-neighbors">
            <button type="button" disabled={!previousYear} aria-label={previousYear ? `Previous year, ${previousYear}` : "No previous year"} onClick={() => previousYear && chooseYear(previousYear)}>← <span>{previousYear ?? "EARLIEST"}</span></button>
            <button type="button" disabled={!nextYear} aria-label={nextYear ? `Next year, ${nextYear}` : "No next year"} onClick={() => nextYear && chooseYear(nextYear)}><span>{nextYear ?? "LATEST"}</span> →</button>
          </div>
        </div>
      ) : null}

      {!year && path === "all" ? (
        <section className="timeline-starts" aria-label="Six moments to start with">
          <div className="timeline-starts-head">
            <div><p className="type-label text-leader">START WITH A MOMENT</p><h2>Follow the years</h2></div>
            <p>Choose a moment to open its year and follow the connected people, places, and sources.</p>
          </div>
          <p className="timeline-scroll-cue">SCROLL FOR MORE <span aria-hidden>→</span></p>
          <div className="timeline-starts-list">
            {startingMoments.map(({ year: value, clip }) => clip ? (
              <button key={value} type="button" onClick={() => chooseYear(value)}>
                <span>{value}</span><strong>{clipHeading(clip)}</strong><small>{clip.youtubeId ? "PUBLIC SOURCE" : "EXAMPLE ENTRY"}</small>
              </button>
            ) : null)}
          </div>
        </section>
      ) : null}

      {!year ? (
        <>
          {path !== "all" ? <ThroughLine threads={THREADS.filter((item) => item.id !== path)} onPath={choosePath} /> : null}
          <div className="timeline-year-select">
            <label htmlFor="timeline-jump">JUMP TO A YEAR</label>
            <select id="timeline-jump" value="" onChange={(event) => event.target.value && chooseYear(Number(event.target.value))}>
              <option value="">CHOOSE A YEAR</option>
              {populated.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
          <details className="timeline-year-jump">
            <summary>BROWSE THE FULL SPAN · 1994 — 2026</summary>
            <div className="timeline-full-years">
              {SPAN.map((value) => (
                <button key={value} type="button" disabled={!byYear.get(value)?.length} onClick={() => chooseYear(value)}>{value}</button>
              ))}
            </div>
          </details>
          <SpanFilm path={path} byYear={byYear} populated={populated} onYear={chooseYear} onPath={choosePath} reduced={reduced} />
        </>
      ) : (
        <section className="timeline-year-content" aria-label={`Entries in ${year}`}>
          <div className="timeline-period-line">
            <p className="type-label">{month === 0 ? "MONTH NOT LOGGED" : month ? `${MONTHS[month - 1]}${day ? ` ${Number(day.slice(8))}` : ""}` : "SELECTED FROM THE YEAR"}</p>
            {datedMonths.length || hasUndated ? (
              <details className="timeline-refine" key={`${path}-${year}-${month}`} open={month !== null}>
                <summary>{month !== null ? "CHANGE PERIOD" : "REFINE BY DATE"}</summary>
                <div>
                  <label>PERIOD
                    <select aria-label="Filter timeline month" value={month ?? "all"} onChange={(event) => write({ month: event.target.value === "all" ? null : Number(event.target.value), day: null })}>
                      <option value="all">FULL YEAR</option>
                      {datedMonths.map((value) => <option key={value} value={value}>{MONTHS[value - 1]}</option>)}
                      {hasUndated ? <option value={0}>MONTH NOT LOGGED</option> : null}
                    </select>
                  </label>
                  {month && month > 0 ? (
                    <label>DATE
                      <select aria-label="Filter timeline day" value={day ?? "all"} onChange={(event) => write({ day: event.target.value === "all" ? null : event.target.value })}>
                        <option value="all">ALL DATES</option>
                        {dates.map((date) => <option key={date} value={date}>{MONTHS_SHORT[month - 1]} {Number(date.slice(8))}</option>)}
                      </select>
                    </label>
                  ) : null}
                </div>
              </details>
            ) : null}
          </div>
          <p className="timeline-date-note">Upload dates are not necessarily filming dates. Sourced project references use project years; example entries use illustrative dates.</p>
          {selection.length ? (
            <div className={`timeline-record-grid${reduced ? "" : " film-advance"}`}>
              {selection.map((clip) => <TimelineRecord key={clip.id} clip={clip} returnHref={returnHref} />)}
            </div>
          ) : <p className="timeline-empty">No entries in this period. Choose the full year or another thread.</p>}
          <YearHoldings key={`${path}-${year}-${month}-${day}`} clips={periodClips} returnHref={returnHref} />
        </section>
      )}
    </div>
  );
}

function TimelineRecord({ clip, returnHref }: { clip: ArchiveClip; returnHref: string }) {
  const reference = clip.contentState === "project-reference";
  return (
    <Link href={clipHref(clip.slug, returnHref)} className="timeline-record group">
      <div className="timeline-record-frame">
        {clip.youtubeId ? <Image src={youtubeThumbnail(clip.youtubeId)} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" unoptimized /> : reference ? <p className="timeline-project-reference">{getProject(clip.projectIds[0])?.kind ?? "PROJECT"}<span>Media not included</span></p> : <PrototypeField clip={clip} className="absolute inset-0 h-full w-full" />}
        <span className={`timeline-media-stamp${clip.youtubeId ? "" : " timeline-media-stamp-example"}`}>{clip.youtubeId ? "PUBLIC UPLOAD" : reference ? "PROJECT REFERENCE" : "EXAMPLE MEDIA"}</span>
      </div>
      <p className="timeline-record-date">{uploadDateLabel(clip)}</p>
      <h2>{clipHeading(clip)}</h2>
      <p className="timeline-record-bonds">{spanBonds(clip)}</p>
      <span className="timeline-record-open">{clip.youtubeId ? "WATCH & EXPLORE" : reference ? "EXPLORE PROJECT" : "EXPLORE EXAMPLE"} <span aria-hidden>↗</span></span>
    </Link>
  );
}

function YearHoldings({ clips, returnHref }: { clips: ArchiveClip[]; returnHref: string }) {
  const [shown, setShown] = useState(12);
  const named = sortHoldings(clips.filter((clip) => !isUnlogged(clip)));
  const unlogged = clips.length - named.length;
  if (!named.length) return null;
  return (
    <details className="timeline-full-index">
      <summary>FULL PERIOD INDEX <span>{named.length} {named.length === 1 ? "ENTRY" : "ENTRIES"} <span aria-hidden>+</span></span></summary>
      <p className="timeline-date-note">Public uploads, project references, and example records are labeled separately.{unlogged ? ` ${unlogged} unlogged example records are not shown here.` : ""}</p>
      <ol className="list-none" aria-label="All entries in this period">
        {named.slice(0, shown).map((clip) => (
          <li key={clip.id}>{clip.youtubeId ? <HoldingLine clip={clip} returnHref={returnHref} /> : (
            <Link href={clipHref(clip.slug, returnHref)} className="timeline-example-row"><span>{clip.year}</span><strong>{clipHeading(clip)}</strong><small>{clip.contentState === "project-reference" ? "PROJECT REFERENCE" : "EXAMPLE RECORD"}</small></Link>
          )}</li>
        ))}
      </ol>
      {shown < named.length ? <button type="button" className="timeline-show-more" onClick={() => setShown((value) => value + 12)}>SHOW {Math.min(12, named.length - shown)} MORE · {shown} OF {named.length}</button> : null}
    </details>
  );
}

function SpanFrame({ clip, kicker, story, era, onClick }: { clip?: ArchiveClip; kicker: string; story: string; era?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="span-frame film-cell group relative shrink-0 text-left">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink shadow-frame">
        <div className="film-perfs" aria-hidden />
        {clip?.youtubeId ? <Image src={youtubeThumbnail(clip.youtubeId)} alt="" fill sizes="(max-width: 640px) 55vw, 240px" className="object-cover" unoptimized /> : clip?.contentState === "project-reference" ? <p className="timeline-project-reference">PROJECT<span>Media not included</span></p> : clip && !isUnlogged(clip) ? <PrototypeField clip={clip} className="absolute inset-0 h-full w-full" /> : null}
        <span className={`timeline-media-stamp${clip?.youtubeId ? "" : " timeline-media-stamp-example"}`}>{clip?.youtubeId ? "PUBLIC UPLOAD" : clip?.contentState === "project-reference" ? "PROJECT REFERENCE" : "EXAMPLE MEDIA"}</span>
      </div>
      <div className="mt-3">
        {era ? <p className="font-mono text-[12px] tracking-[0.08em] text-dust">{era}</p> : null}
        <p className="mt-1 font-display text-3xl leading-none text-paper md:text-4xl">{kicker}</p>
        {story ? <p className="mt-2 line-clamp-2 font-cond text-[13px] tracking-[0.06em] text-bone">{story}</p> : null}
        {clip ? <p className="mt-2 font-cond text-[12px] tracking-[0.12em] text-dust">{spanBonds(clip)}</p> : null}
      </div>
    </button>
  );
}

function SpanFilm({ path, byYear, populated, onYear, onPath, reduced }: { path: TimelinePath; byYear: Map<number, ArchiveClip[]>; populated: number[]; onYear: (year: number) => void; onPath: (path: TimelinePath) => void; reduced: boolean }) {
  return (
    <div className={`timeline-span-film mt-12 space-y-16${reduced ? "" : " film-advance"}`}>
      {DECADES.map((decade) => {
        const years = populated.filter((year) => year >= decade.start && year <= decade.end);
        if (!years.length) return null;
        const threads = THREADS.filter((thread) => thread.id !== path && years.some((year) => (byYear.get(year) ?? []).some((clip) => matchesPath(thread.id, clip))));
        return (
          <section key={decade.id}>
            <div className="timeline-decade-header border-b border-paper/15 pb-4">
              <p className="font-cond text-[12px] tracking-[0.12em] text-leader">{decade.id}</p>
              <h2 className="mt-2 max-w-[22ch] font-display text-4xl leading-none text-paper md:text-5xl">{decade.line}</h2>
              <ThroughLine threads={threads} onPath={onPath} className="timeline-decade-through mt-4 max-w-[42ch]" label={`${decade.id} through`} />
            </div>
            <div className="timeline-decade-frames mt-6 flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {years.map((year) => {
                const lead = spanLead(byYear.get(year) ?? []);
                return <SpanFrame key={year} clip={lead} kicker={String(year)} story={spanStory(lead)} era={getEra(lead?.era ?? "")?.name} onClick={() => onYear(year)} />;
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
