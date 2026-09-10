"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { catalog, getEra, getLocation, getPerson, getProject, getTape } from "@/data";
import type { ArchiveClip, SourceTape } from "@/data/types";
import { HoldingLine } from "@/components/archive/HoldingLine";
import { HeldFrame } from "@/components/media/HeldFrame";
import { PrototypeField, PrototypeMedia } from "@/components/media/PrototypeMedia";
import { TapeFrame } from "@/components/tapes/TapeFrame";
import { filmBeat, isUnlogged } from "@/lib/clipDisplay";
import { clipWhen, MONTHS, MONTHS_SHORT } from "@/lib/format";
import { isOfficialHolding, officialHoldings, sortHoldings } from "@/lib/holdings";
import { isTypingTarget } from "@/lib/keys";
import { usePrefersReducedMotion } from "@/lib/motion";
import {
  TIMELINE_SPAN,
  TIMELINE_THREADS,
  parseTimelineQuery,
  timelineSearch,
  type TimelinePath,
  type TimelineQuery,
} from "@/lib/timelineQuery";
import { holdFor, isClosed } from "@/lib/visibility";

const THREADS = TIMELINE_THREADS;
const SPAN = TIMELINE_SPAN;

type PathId = TimelinePath;

function matchesPath(path: PathId, clip: ArchiveClip) {
  if (path === "coodie") return clip.peopleIds.includes("coodie");
  if (path === "chike") return clip.peopleIds.includes("chike");
  if (path === "ye") return clip.peopleIds.includes("ye");
  if (path === "dropout") return clip.albumIds.includes("dropout") || clip.collectionIds.includes("road-dropout");
  if (path === "chicago") return getLocation(clip.locationId)?.city === "Chicago";
  if (path === "cc") return clip.era === "network" || clip.collectionIds.includes("classics");
  return true;
}

function whenFor(clip: ArchiveClip) {
  if (isOfficialHolding(clip)) return clipWhen(clip);
  const tape = getTape(clip.sourceTapeId);
  return clipWhen(clip, tape?.recordedDate);
}

/** Authored title for a year/day beat. House first, then official. Never UNLOGGED. */
function spanLead(list: ArchiveClip[]) {
  const named = list.filter((c) => !isUnlogged(c));
  const house = named.filter((c) => !isOfficialHolding(c));
  return (
    house.find((c) => c.featured) ??
    named.find((c) => c.featured) ??
    house[0] ??
    named[0] ??
    list[0]
  );
}

function spanStory(clip?: ArchiveClip) {
  if (!clip) return "";
  const project = clip.projectIds.map((id) => getProject(id)).find(Boolean);
  return filmBeat({
    title: clip.title,
    unlogged: isUnlogged(clip),
    tapeLabel: getTape(clip.sourceTapeId)?.originalLabel,
    projectTitle: project?.title,
    eraName: getEra(clip.era)?.name,
  });
}

function threadsThrough(
  clipsForYear: Map<number, ArchiveClip[]>,
  years: number[],
  except: PathId,
) {
  return THREADS.filter((t) => {
    if (t.id === except) return false;
    return years.some((y) => (clipsForYear.get(y) ?? []).some((c) => matchesPath(t.id, c)));
  });
}

function spanBonds(clip?: ArchiveClip) {
  if (!clip) return "";
  const people = clip.peopleIds
    .map((id) => getPerson(id)?.shortName)
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name!.toUpperCase());
  const place = getLocation(clip.locationId)?.name;
  const bits = [...people];
  if (place) bits.push(place.toUpperCase());
  return bits.join(" · ");
}

function threadYearsFromCatalog() {
  const map = new Map<PathId, Set<number>>();
  for (const t of THREADS) {
    const years = new Set<number>();
    for (const clip of catalog.clips) {
      if (matchesPath(t.id, clip)) years.add(whenFor(clip).year);
    }
    map.set(t.id, years);
  }
  return map;
}

function ThroughLine({
  threads,
  onPath,
  onHover,
  className = "mt-8 max-w-[42ch]",
  label = "Through",
}: {
  threads: readonly (typeof THREADS)[number][];
  onPath: (id: PathId) => void;
  onHover?: (id: PathId | null) => void;
  className?: string;
  label?: string;
}) {
  if (!threads.length) return null;
  return (
    <nav aria-label={label} className={className}>
      <p className="font-cond text-[14px] leading-[2] tracking-[0.12em] text-dust">
        <span className="text-dust/55">through </span>
        {threads.map((t, i) => (
          <span key={t.id}>
            {i > 0 ? (
              <span className="mx-[0.55em] text-paper/20" aria-hidden>
                —
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => onPath(t.id)}
              onMouseEnter={() => onHover?.(t.id)}
              onMouseLeave={() => onHover?.(null)}
              onFocus={() => onHover?.(t.id)}
              onBlur={() => onHover?.(null)}
              className="hover:text-paper"
            >
              {t.label}
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
  const path = query.through;
  const year = query.year;
  const month = query.month;
  const day = query.day;
  const [hoverPath, setHoverPath] = useState<PathId | null>(null);
  const reduced = usePrefersReducedMotion();
  const threadYears = useMemo(() => threadYearsFromCatalog(), []);
  const litPath = hoverPath && hoverPath !== "all" ? hoverPath : path !== "all" ? path : null;
  const litYears = litPath ? (threadYears.get(litPath) ?? new Set<number>()) : null;

  function write(next: Partial<TimelineQuery>) {
    const merged: TimelineQuery = {
      through: next.through ?? path,
      year: "year" in next ? next.year ?? null : year,
      month: "month" in next ? next.month ?? null : month,
      day: "day" in next ? next.day ?? null : day,
    };
    if (!merged.year) {
      merged.month = null;
      merged.day = null;
    }
    if (merged.month === null) merged.day = null;
    router.replace(`${pathname}${timelineSearch(merged, search)}`, { scroll: false });
  }

  const clips = useMemo(() => catalog.clips.filter((c) => matchesPath(path, c)), [path]);

  const byYear = useMemo(() => {
    const map = new Map<number, ArchiveClip[]>();
    for (const y of SPAN) map.set(y, []);
    for (const clip of clips) {
      const list = map.get(whenFor(clip).year);
      if (list) list.push(clip);
    }
    return map;
  }, [clips]);

  const yearClips = year ? (byYear.get(year) ?? []) : [];

  const byMonth = useMemo(() => {
    const map = new Map<number, ArchiveClip[]>();
    for (let m = 1; m <= 12; m += 1) map.set(m, []);
    for (const clip of yearClips) {
      const w = whenFor(clip);
      if (w.month) map.get(w.month)?.push(clip);
    }
    return map;
  }, [yearClips]);

  const undated = yearClips.filter((c) => whenFor(c).undated);
  const monthClips = month ? (byMonth.get(month) ?? []) : [];

  const byDay = useMemo(() => {
    const map = new Map<string, ArchiveClip[]>();
    for (const clip of monthClips) {
      const w = whenFor(clip);
      const key = w.undated ? "UNDATED" : w.key;
      const list = map.get(key) ?? [];
      list.push(clip);
      map.set(key, list);
    }
    return map;
  }, [monthClips]);

  const dayKeys = [...byDay.keys()].sort((a, b) => {
    if (a === "UNDATED") return 1;
    if (b === "UNDATED") return -1;
    return a.localeCompare(b);
  });
  const dayClips = day ? (byDay.get(day) ?? []) : [];
  const dayTapes = useMemo(() => {
    const ids = new Set(dayClips.map((c) => c.sourceTapeId));
    return catalog.tapes.filter((t) => ids.has(t.id));
  }, [dayClips]);

  function resetDrill() {
    write({ year: null, month: null, day: null });
  }

  function choosePath(id: PathId) {
    const nextClips = catalog.clips.filter((c) => matchesPath(id, c));
    const keepYear = Boolean(year && nextClips.some((c) => whenFor(c).year === year));
    const keepMonth =
      keepYear &&
      month !== null &&
      month > 0 &&
      nextClips.some((c) => {
        const w = whenFor(c);
        return w.year === year && w.month === month;
      });
    const keepDay =
      keepMonth &&
      day &&
      day !== "UNDATED" &&
      nextClips.some((c) => {
        const w = whenFor(c);
        return w.key === day;
      });
    write({
      through: id,
      year: keepYear ? year : null,
      month: keepMonth ? month : null,
      day: keepDay ? day : null,
    });
  }

  function chooseYear(y: number) {
    write({ year: year === y && !month ? null : y, month: null, day: null });
  }

  function chooseMonth(m: number) {
    write({ month: month === m && !day ? null : m, day: null });
  }

  function pop() {
    if (day) write({ day: null });
    else if (month !== null) write({ month: null, day: null });
    else if (year) write({ year: null, month: null, day: null });
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.key === "Escape") pop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const populated = SPAN.filter((y) => (byYear.get(y)?.length ?? 0) > 0);
  const thread = THREADS.find((t) => t.id === path);

  return (
    <div className="timeline-view px-4 pb-24 md:px-6">
      <header className="pt-4">
          <p className="font-cond text-[12px] tracking-[0.12em] text-leader">{thread ? "THROUGH" : "THE TIMELINE"}</p>
        {thread ? (
          <>
            <h1 className="mt-2 font-display text-5xl leading-none text-paper md:text-6xl">{thread.label}</h1>
            <button
              type="button"
              onClick={() => write({ through: "all" })}
              className="mt-4 font-cond text-[12px] tracking-[0.18em] text-dust hover:text-paper"
            >
              THE SPAN · 1994 — 2026
            </button>
          </>
        ) : (
          <h1 className="mt-2 font-display text-5xl leading-none text-paper md:text-6xl">1994 — 2026</h1>
        )}
      </header>

      {path !== "all" || year ? (
        <ThroughLine
          threads={THREADS.filter((t) => t.id !== path)}
          onPath={choosePath}
          onHover={setHoverPath}
        />
      ) : null}

      {year ? (
        <nav
          className="timeline-scope mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-cond text-[14px] tracking-[0.16em]"
          aria-label="Time drill"
        >
          <button type="button" onClick={resetDrill} className="text-dust hover:text-paper">
            SPAN
          </button>
          <span className="text-leader/50" aria-hidden>
            /
          </span>
          <button
            type="button"
            onClick={() => write({ month: null, day: null })}
            className={!month ? "text-paper" : "text-dust hover:text-paper"}
          >
            {year}
          </button>
          {month && month > 0 ? (
            <>
              <span className="text-leader/50" aria-hidden>
                /
              </span>
              <button
                type="button"
                onClick={() => write({ day: null })}
                className={!day ? "text-paper" : "text-dust hover:text-paper"}
              >
                {MONTHS[month - 1]}
              </button>
            </>
          ) : null}
          {month === 0 ? (
            <>
              <span className="text-leader/50" aria-hidden>
                /
              </span>
              <span className="text-paper">UNDATED</span>
            </>
          ) : null}
          {day && month !== 0 ? (
            <>
              <span className="text-leader/50" aria-hidden>
                /
              </span>
              <span className="text-paper">{day === "UNDATED" ? "UNDATED" : day.slice(8)}</span>
            </>
          ) : null}
          <button
            type="button"
            onClick={pop}
            className="ml-1 font-mono text-[11px] tracking-[0.14em] text-leader hover:text-paper"
          >
            ← BACK
          </button>
        </nav>
      ) : null}

      <p className="timeline-rail-mark mt-8">
        EVERY YEAR · 1994 — 2026 · {populated.length} {populated.length === 1 ? "YEAR HOLDS" : "YEARS HOLD"} FRAMES
      </p>
      <div className="mt-2 overflow-x-auto no-scrollbar">
        <div className="relative min-w-[720px] pb-2 md:min-w-[1100px]">
          <div className="type-label mb-2 flex justify-between tracking-[0.18em]">
            <span>1990s</span>
            <span>2000s</span>
            <span>2010s</span>
            <span>2020s</span>
          </div>
          <div className="flex border-y border-paper/15 py-2" role="listbox" aria-label="Year on the film">
            {SPAN.map((y) => {
              const list = byYear.get(y) ?? [];
              const active = year === y;
              const empty = list.length === 0;
              const onThread = Boolean(litYears?.has(y));
              return (
                <button
                  key={y}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => chooseYear(y)}
                  className={`flex w-8 flex-col items-center gap-1.5 ${active ? "sprocket-in" : ""}`}
                >
                  <span className="flex flex-col gap-0.5" aria-hidden>
                    <span
                      className={`sprocket-hole ${
                        active ? "bg-leader" : onThread ? "bg-leader/75" : empty ? "bg-paper/10" : "bg-paper/50"
                      }`}
                    />
                    <span
                      className={`sprocket-hole ${
                        active ? "bg-leader" : onThread ? "bg-leader/75" : empty ? "bg-paper/10" : "bg-paper/50"
                      }`}
                    />
                  </span>
                  <span className={`block h-px w-full ${active || onThread ? "bg-leader/70" : "bg-paper/15"}`} aria-hidden />
                  <span
                    className={`font-mono text-[12px] tracking-[0.04em] ${
                      active ? "text-leader" : onThread || y % 5 === 0 ? "text-paper" : "text-dust"
                    }`}
                  >
                    {String(y).slice(2)}
                  </span>
                </button>
              );
            })}
          </div>
          {litPath ? (
            <div className="span-thread" aria-hidden>
              {SPAN.map((y) => (
                <span key={y} className={`span-thread-tick${litYears?.has(y) ? " span-thread-tick-on" : ""}`}>
                  <i />
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {year ? (
        <section className="mt-10">
          {month === null || month === 0 ? (
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-5xl text-paper">{year}</h2>
              <p className="font-cond text-[12px] tracking-[0.16em] text-dust">{getEra(yearClips[0]?.era ?? "")?.name ?? ""}</p>
            </div>
          ) : null}
          <p className="timeline-rail-mark mt-6">MONTHS IN {year}</p>
          <MonthSprocket byMonth={byMonth} selected={month && month > 0 ? month : null} onMonth={chooseMonth} />
          {month === null ? (
            <>
              <MonthFilm key={`${path}-${year}`} byMonth={byMonth} onMonth={chooseMonth} reduced={reduced} />
              <YearHoldings clips={yearClips} />
              {undated.some((c) => !isOfficialHolding(c)) ? (
                <button
                  type="button"
                  onClick={() => write({ month: 0, day: "UNDATED" })}
                  className="mt-6 font-cond text-[12px] tracking-[0.16em] text-dust hover:text-paper"
                >
                  UNDATED IN {year}
                </button>
              ) : null}
            </>
          ) : null}
        </section>
      ) : null}

      {year && month && month > 0 ? (
        <section className="mt-6">
          {!day ? (
            <h2 className="font-display text-5xl text-paper">
              {MONTHS[month - 1]} {year}
            </h2>
          ) : null}
          <p className="timeline-rail-mark mt-6">
            DAYS IN {MONTHS[month - 1]} {year}
          </p>
          <DaySprocket year={year} month={month} byDay={byDay} selected={day} onDay={(key) => write({ day: key })} />
          {!day ? (
            <DayFilm
              key={`${path}-${year}-${month}`}
              month={month}
              byDay={byDay}
              dayKeys={dayKeys}
              onDay={(key) => write({ day: key })}
              reduced={reduced}
            />
          ) : null}
        </section>
      ) : null}

      {year && month === 0 ? (
        <DayStage
          key={`${path}-${year}-undated`}
          clips={undated}
          tapes={catalog.tapes.filter((t) => undated.some((c) => c.sourceTapeId === t.id))}
          year={year}
          month={0}
          day="UNDATED"
          reduced={reduced}
        />
      ) : null}

      {year && month && month > 0 && day ? (
        <DayStage
          key={`${path}-${year}-${month}-${day}`}
          clips={dayClips}
          tapes={dayTapes}
          year={year}
          month={month}
          day={day}
          reduced={reduced}
        />
      ) : null}

      {!year ? (
        <SpanFilm
          key={path}
          path={path}
          byYear={byYear}
          populated={populated}
          onYear={chooseYear}
          onPath={choosePath}
          onHover={setHoverPath}
          reduced={reduced}
        />
      ) : null}
    </div>
  );
}

function dayKey(year: number, month: number, d: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function YearHoldings({ clips }: { clips: ArchiveClip[] }) {
  const air = sortHoldings(officialHoldings(clips).filter((c) => whenFor(c).undated));
  if (!air.length) return null;
  return (
    <ol className="mt-10 list-none" aria-label="Broadcast holdings">
      {air.map((clip) => (
        <li key={clip.id}>
          <HoldingLine clip={clip} />
        </li>
      ))}
    </ol>
  );
}

function MonthSprocket({
  byMonth,
  selected,
  onMonth,
}: {
  byMonth: Map<number, ArchiveClip[]>;
  selected: number | null;
  onMonth: (m: number) => void;
}) {
  return (
    <div className="mt-8 overflow-x-auto no-scrollbar">
      <div className="type-label mb-2 flex justify-between tracking-[0.18em]">
        <span>JAN</span>
        <span>JUN</span>
        <span>DEC</span>
      </div>
      <div className="flex min-w-[520px] border-y border-paper/15 py-2" role="listbox" aria-label="Month on the film">
        {MONTHS_SHORT.map((label, i) => {
          const m = i + 1;
          const list = byMonth.get(m) ?? [];
          const active = selected === m;
          const empty = list.length === 0;
          return (
            <button
              key={label}
              type="button"
              role="option"
              aria-selected={active}
              disabled={empty}
              onClick={() => onMonth(m)}
              className={`flex flex-1 flex-col items-center gap-1.5 ${active ? "sprocket-in" : ""} ${empty ? "cursor-default" : ""}`}
            >
              <span className="flex flex-col gap-0.5" aria-hidden>
                <span className={`sprocket-hole ${active ? "bg-leader" : empty ? "bg-paper/10" : "bg-paper/50"}`} />
                <span className={`sprocket-hole ${active ? "bg-leader" : empty ? "bg-paper/10" : "bg-paper/50"}`} />
              </span>
              <span className={`block h-px w-full ${active ? "bg-leader/70" : "bg-paper/15"}`} aria-hidden />
              <span
                    className={`font-mono text-[12px] tracking-[0.04em] ${
                      active ? "text-leader" : empty ? "text-dust/55" : "text-paper"
                    }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SpanFrame({
  clip,
  kicker,
  story,
  era,
  onClick,
}: {
  clip?: ArchiveClip;
  kicker: string;
  story: string;
  era?: string;
  onClick: () => void;
}) {
  const unlogged = clip ? isUnlogged(clip) : false;
  const closed = Boolean(clip && isClosed(clip) && !unlogged);
  const hold = closed && clip ? holdFor(clip) : null;
  const bonds = spanBonds(clip);
  return (
    <button type="button" onClick={onClick} className="span-frame film-cell group relative shrink-0 text-left">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink shadow-frame">
        <div className="film-perfs" aria-hidden />
        {clip && !unlogged ? (
          <PrototypeField clip={clip} className="absolute inset-0 h-full w-full" />
        ) : (
          <div className="absolute inset-0 bg-ink" />
        )}
        {hold ? (
          <p className="absolute right-2 top-2 bg-paper px-1.5 py-0.5 font-cond text-[11px] tracking-[0.12em] text-void">
            {hold.status}
          </p>
        ) : null}
      </div>
      <div className="mt-3">
        {era ? <p className="font-mono text-[12px] tracking-[0.08em] text-dust">{era}</p> : null}
        <p className="mt-1 font-display text-3xl leading-none text-paper md:text-4xl">{kicker}</p>
        {story ? (
          <p className="mt-2 line-clamp-2 font-cond text-[13px] tracking-[0.06em] text-bone">{story}</p>
        ) : null}
        {bonds ? <p className="mt-2 font-cond text-[12px] tracking-[0.12em] text-dust">{bonds}</p> : null}
      </div>
    </button>
  );
}

function MonthFilm({
  byMonth,
  onMonth,
  reduced,
}: {
  byMonth: Map<number, ArchiveClip[]>;
  onMonth: (m: number) => void;
  reduced: boolean;
}) {
  const months = MONTHS_SHORT.map((_, i) => i + 1).filter((m) => (byMonth.get(m)?.length ?? 0) > 0);
  if (!months.length) return null;
  return (
    <div className={`mt-8 ${reduced ? "" : "film-advance"}`}>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {months.map((m) => {
          const list = byMonth.get(m) ?? [];
          const lead = spanLead(list);
          const era = getEra(lead?.era ?? "");
          return (
            <SpanFrame
              key={m}
              clip={lead}
              kicker={MONTHS[m - 1]}
              story={spanStory(lead)}
              era={era?.name}
              onClick={() => onMonth(m)}
            />
          );
        })}
      </div>
    </div>
  );
}

function DaySprocket({
  year,
  month,
  byDay,
  selected,
  onDay,
}: {
  year: number;
  month: number;
  byDay: Map<string, ArchiveClip[]>;
  selected: string | null;
  onDay: (key: string) => void;
}) {
  const last = daysInMonth(year, month);
  const days = Array.from({ length: last }, (_, i) => i + 1);
  return (
    <div className="mt-8 overflow-x-auto no-scrollbar">
      <div className="flex min-w-[640px] border-y border-paper/15 py-2" role="listbox" aria-label="Day on the film">
        {days.map((d) => {
          const key = dayKey(year, month, d);
          const list = byDay.get(key) ?? [];
          const active = selected === key;
          const empty = list.length === 0;
          return (
            <button
              key={key}
              type="button"
              role="option"
              aria-selected={active}
              disabled={empty}
              onClick={() => onDay(key)}
              className={`flex w-8 flex-col items-center gap-1.5 ${active ? "sprocket-in" : ""} ${empty ? "cursor-default" : ""}`}
            >
              <span className="flex flex-col gap-0.5" aria-hidden>
                <span className={`sprocket-hole ${active ? "bg-leader" : empty ? "bg-paper/10" : "bg-paper/50"}`} />
                <span className={`sprocket-hole ${active ? "bg-leader" : empty ? "bg-paper/10" : "bg-paper/50"}`} />
              </span>
              <span className={`block h-px w-full ${active ? "bg-leader/70" : "bg-paper/15"}`} aria-hidden />
              <span
                className={`font-mono text-[12px] tracking-[0.04em] ${
                  active ? "text-leader" : empty ? "text-dust/55" : d === 1 || d % 5 === 0 ? "text-paper" : "text-dust"
                }`}
              >
                {d}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DayFilm({
  month,
  byDay,
  dayKeys,
  onDay,
  reduced,
}: {
  month: number;
  byDay: Map<string, ArchiveClip[]>;
  dayKeys: string[];
  onDay: (key: string) => void;
  reduced: boolean;
}) {
  if (!dayKeys.length) return null;
  return (
    <div className={`mt-8 ${reduced ? "" : "film-advance"}`}>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {dayKeys.map((key) => {
          const list = byDay.get(key) ?? [];
          const lead = spanLead(list);
          const era = getEra(lead?.era ?? "");
          const label = key === "UNDATED" ? "—" : String(Number(key.slice(8)));
          return (
            <SpanFrame
              key={key}
              clip={lead}
              kicker={label}
              story={spanStory(lead)}
              era={key === "UNDATED" ? "UNDATED" : era?.name ?? `${MONTHS_SHORT[month - 1]} ${label}`}
              onClick={() => onDay(key)}
            />
          );
        })}
      </div>
    </div>
  );
}

const DECADES = [
  { id: "1990s", start: 1994, end: 1999, line: "Public access. Informal rooms. Chicago." },
  { id: "2000s", start: 2000, end: 2009, line: "The long shoot, then a network. New York." },
  { id: "2010s", start: 2010, end: 2019, line: "Documents. Sports." },
  { id: "2020s", start: 2020, end: 2026, line: "jeen-yuhs. Then after the cut." },
] as const;

function SpanFilm({
  path,
  byYear,
  populated,
  onYear,
  onPath,
  onHover,
  reduced,
}: {
  path: PathId;
  byYear: Map<number, ArchiveClip[]>;
  populated: number[];
  onYear: (y: number) => void;
  onPath: (id: PathId) => void;
  onHover?: (id: PathId | null) => void;
  reduced: boolean;
}) {
  return (
    <div className={`timeline-span-film mt-12 space-y-16 ${reduced ? "" : "film-advance"}`}>
      {DECADES.map((decade) => {
        const years = populated.filter((y) => y >= decade.start && y <= decade.end);
        if (!years.length) return null;
        const threads = threadsThrough(byYear, years, path);
        return (
          <section key={decade.id}>
            <div className="timeline-decade-header border-b border-paper/15 pb-4">
              <p className="font-cond text-[12px] tracking-[0.12em] text-leader">{decade.id}</p>
              <h2 className="mt-2 max-w-[22ch] font-display text-4xl leading-none text-paper md:text-5xl">{decade.line}</h2>
              <ThroughLine
                threads={threads}
                onPath={onPath}
                onHover={onHover}
                className="timeline-decade-through mt-4 max-w-[42ch]"
                label={`${decade.id} through`}
              />
            </div>
            <div className="timeline-decade-frames mt-6 flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {years.map((y) => {
                const list = byYear.get(y) ?? [];
                const lead = spanLead(list);
                const era = getEra(lead?.era ?? "");
                return (
                  <SpanFrame
                    key={y}
                    clip={lead}
                    kicker={String(y)}
                    story={spanStory(lead)}
                    era={era?.name}
                    onClick={() => onYear(y)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function DayStage({
  clips,
  tapes,
  year,
  month,
  day,
  reduced,
}: {
  clips: ArchiveClip[];
  tapes: SourceTape[];
  year: number;
  month: number;
  day: string;
  reduced: boolean;
}) {
  const undated = day === "UNDATED" || month === 0;
  const lead = spanLead(clips);
  const story = spanStory(lead);
  const era = getEra(lead?.era ?? "");
  const dayNum = undated ? null : Number(day.slice(8));
  const frames = [...clips].sort(
    (a, b) => a.startTimecode.localeCompare(b.startTimecode) || a.sourceTapeId.localeCompare(b.sourceTapeId),
  );
  const houseFrames = frames.filter((c) => !isOfficialHolding(c));
  const air = sortHoldings(officialHoldings(frames));
  const people = [...new Set(clips.flatMap((c) => c.peopleIds))]
    .map((id) => getPerson(id))
    .filter(Boolean);
  const places = [...new Set(clips.map((c) => c.locationId))]
    .map((id) => getLocation(id))
    .filter(Boolean);
  const reels = tapes.filter((tape) => clips.some((c) => c.sourceTapeId === tape.id) && tape.id !== "t-broadcast");

  return (
    <section className={`mt-10 ${reduced ? "" : "film-advance"}`} aria-label={undated ? `Undated film in ${year}` : `Film of ${MONTHS[month - 1]} ${dayNum} ${year}`}>
      <header className="max-w-3xl">
        {era?.name || undated ? (
          <p className="font-cond text-[12px] tracking-[0.12em] text-leader">
            {era?.name ?? "UNDATED"}
          </p>
        ) : null}
        {undated ? (
          <>
            <h2 className="mt-2 font-display text-5xl leading-none text-paper md:text-7xl">UNDATED</h2>
            <p className="mt-3 font-display text-3xl leading-none text-bone/70">{year}</p>
          </>
        ) : (
          <>
            <h2 className="mt-2 font-display text-5xl leading-none text-paper md:text-7xl">
              {MONTHS[month - 1]} {dayNum}
            </h2>
            <p className="mt-3 font-display text-3xl leading-none text-bone/70">{year}</p>
          </>
        )}
        {story ? (
          <p className="mt-5 max-w-[28ch] font-cond text-[16px] tracking-[0.08em] text-bone/85">{story}</p>
        ) : null}
        {people.length || places.length ? (
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-cond text-[13px] tracking-[0.14em] text-dust">
            {people.map((p) =>
              p ? (
                <Link key={p.id} href={`/people/${p.slug}`} className="hover:text-paper">
                  {p.shortName.toUpperCase()}
                </Link>
              ) : null,
            )}
            {places.map((loc) =>
              loc ? (
                <Link key={loc.id} href={`/places/${loc.slug}`} className="hover:text-paper">
                  {loc.name.toUpperCase()}
                </Link>
              ) : null,
            )}
          </p>
        ) : null}
      </header>

      {!clips.length ? (
        <p className="mt-10 font-mono text-[12px] tracking-[0.1em] text-dust">
          {undated ? `NO UNDATED FRAMES IN ${year}` : "NO FRAMES THIS DAY"}
        </p>
      ) : (
        <>
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)]">
            {lead ? <DayGate clip={lead} /> : null}
            {reels.length ? (
              <div className="flex flex-col gap-4">
                {reels.map((tape) => (
                  <Link key={tape.id} href={`/tapes/${tape.id}`} className="group block border-y border-paper/15 py-3">
                    <p className="font-mono text-[12px] tracking-[0.08em] text-dust group-hover:text-leader">{tape.code}</p>
                    <p className="mt-2 font-display text-[22px] leading-tight text-paper group-hover:text-leader">
                      {tape.originalLabel}
                    </p>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {houseFrames.length ? (
            <div className="mt-8">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {houseFrames.map((clip) => (
                  <div key={clip.id} className="film-cell relative w-[9.5rem] shrink-0 md:w-44">
                    <div className="film-perfs z-[1]" aria-hidden />
                    <TapeFrame clip={clip} current={clip.id === lead?.id} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {air.length ? (
            <ol className="mt-8 list-none">
              {air.map((clip) => (
                <li key={clip.id}>
                  <HoldingLine clip={clip} />
                </li>
              ))}
            </ol>
          ) : null}
        </>
      )}
    </section>
  );
}

function DayGate({ clip }: { clip: ArchiveClip }) {
  const unlogged = isUnlogged(clip);
  const closed = isClosed(clip) && !unlogged;
  return (
    <Link href={`/clip/${clip.slug}`} className="frame-in-gate block max-w-3xl">
      {closed ? (
        <HeldFrame clip={clip} large className="aspect-[4/3] w-full" />
      ) : (
        <PrototypeMedia clip={clip} large className="aspect-[4/3] w-full" />
      )}
    </Link>
  );
}
