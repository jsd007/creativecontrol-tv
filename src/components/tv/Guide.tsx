"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { ArchiveClip } from "@/data/types";
import { programTitle } from "@/lib/clipDisplay";
import { accentOnAir, guideNowClass, guideWindow, type Channel, type GuideSection } from "@/lib/television";

type Props = {
  channel: Channel;
  sections: GuideSection[];
  lineup: ArchiveClip[];
  nowId?: string;
  onTune: (index: number) => void;
};

type Program = { clip: ArchiveClip; title: string; block: string; index: number };

/** Public uploads that demonstrate several ways into the archive, not a claim about a complete collection. */
const STARTER_SLUGS = [
  "channel-zero-redman-erykah-badu",
  "tear-up",
  "curren-y-wiz-khalifa-nyc-cmj-2009-www-creativecontrol-tv",
  "wiki-wikispeaks",
  "pro-era-beast-coastal",
  "vision-behind-window-seat",
];
const ALL_BLOCKS = "__all__";

export function Guide({ channel, sections, lineup, nowId, onTune }: Props) {
  const root = useRef<HTMLElement>(null);
  const [find, setFind] = useState("");
  const [block, setBlock] = useState("");
  const [page, setPage] = useState(0);
  const isBroadcast = channel.id === "broadcast";

  const programs = useMemo<Program[]>(
    () =>
      sections.flatMap((section) =>
        section.rows.map((clip) => ({
          clip,
          title: programTitle(clip),
          block: section.section,
          index: lineup.indexOf(clip),
        })),
      ),
    [sections, lineup],
  );
  const starters = useMemo(
    () =>
      STARTER_SLUGS.map((slug) => programs.find((program) => program.clip.slug === slug)).filter(
        (program): program is Program => Boolean(program),
      ),
    [programs],
  );
  const needle = find.trim().toLowerCase();
  const browsing = Boolean(needle || block);
  const results = useMemo(() => {
    if (!browsing) return isBroadcast ? starters : programs;
    return programs.filter((program) => {
      if (block && block !== ALL_BLOCKS && program.block !== block) return false;
      if (!needle) return true;
      return `${program.title} ${program.clip.title} ${program.clip.year} ${program.block}`
        .toLowerCase()
        .includes(needle);
    });
  }, [programs, starters, isBroadcast, browsing, block, needle]);
  const windowed = guideWindow(results, page, 8);
  const start = windowed.page * 8 + 1;
  const end = Math.min(start + windowed.rows.length - 1, results.length);

  function changeFind(value: string) {
    setFind(value);
    if (value.trim() && isBroadcast && !block) setBlock(ALL_BLOCKS);
    setPage(0);
  }

  function changeBlock(value: string) {
    setBlock(value);
    setPage(0);
  }

  function arrowKeys(e: KeyboardEvent, index: number) {
    if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
    const direction = e.key === "ArrowDown" ? 1 : -1;
    const at = windowed.rows.findIndex((program) => program.index === index);
    const next = windowed.rows[at + direction];
    if (!next) return;
    e.preventDefault();
    root.current?.querySelector<HTMLElement>(`[data-guide-k="s:${next.index}"]`)?.focus();
  }

  return (
    <section ref={root} id="guide" className="tv-guide scroll-mt-28" data-guide>
      <div className="tv-guide-head">
        <div>
          <p className="font-cond text-[12px] tracking-[0.22em] text-leader">PROGRAM GUIDE</p>
          <h2 className="mt-1 font-display text-2xl leading-none text-paper">
            {browsing ? (needle ? "Find a program" : block === ALL_BLOCKS ? "All broadcasts" : block) : isBroadcast ? "Start watching" : channel.name}
          </h2>
          <p className="mt-2 font-sans text-[13px] leading-snug text-dust">
            {browsing
              ? `${results.length} ${results.length === 1 ? "program" : "programs"} in this view`
              : isBroadcast
                ? "Six public broadcasts. Choose one to tune in."
                : `${programs.length} example ${programs.length === 1 ? "program" : "programs"} on this channel.`}
          </p>
        </div>
        <span className="font-mono text-[11px] tracking-[0.12em] text-dust">CH {channel.n}</span>
      </div>

      <div className="tv-guide-tools">
        <label className="tv-guide-field">
          <span>SEARCH THIS CHANNEL</span>
          <input
            value={find}
            onChange={(e) => changeFind(e.target.value)}
            type="search"
            placeholder="Title, year, or block"
            aria-label="Search programs on this channel"
            className="tv-guide-find"
          />
        </label>
        <label className="tv-guide-field">
          <span>PROGRAM BLOCK</span>
          <select value={block} onChange={(e) => changeBlock(e.target.value)} aria-label="Choose a program block">
            <option value="">{isBroadcast ? "Start here (6 picks)" : "Full channel"}</option>
            {isBroadcast ? <option value={ALL_BLOCKS}>All public uploads ({programs.length})</option> : null}
            {sections.map((section) => (
              <option key={section.section} value={section.section}>
                {section.section} ({section.rows.length})
              </option>
            ))}
          </select>
        </label>
      </div>

      {windowed.rows.length ? (
        <div className="tv-guide-list" aria-live="polite">
          {windowed.rows.map((program, position) => (
            <TitleRow
              key={program.clip.id}
              channel={channel}
              program={program}
              number={windowed.page * 8 + position + 1}
              on={program.clip.id === nowId}
              onTune={onTune}
              onArrow={arrowKeys}
            />
          ))}
        </div>
      ) : (
        <div className="tv-guide-empty">
          <p className="font-cond text-[17px] tracking-[0.1em] text-paper">NO PROGRAMS FOUND</p>
          <p className="mt-1 text-[13px] text-dust">Try another title, year, or block.</p>
          <button type="button" onClick={() => { changeFind(""); changeBlock(""); }} className="mt-4 font-cond text-[12px] tracking-[0.14em] text-leader underline underline-offset-4">
            RESET GUIDE
          </button>
        </div>
      )}

      {browsing && results.length > 0 ? (
        <div className="tv-guide-pager">
          <span>{start}–{end} OF {results.length}</span>
          <div>
            <button type="button" disabled={!windowed.hasPrev} onClick={() => setPage(windowed.page - 1)} aria-label="Previous guide page">← PREV</button>
            <button type="button" disabled={!windowed.hasMore} onClick={() => setPage(windowed.page + 1)} aria-label="Next guide page">NEXT →</button>
          </div>
        </div>
      ) : null}

      {isBroadcast && browsing ? (
        <button type="button" onClick={() => { changeFind(""); changeBlock(""); }} className="tv-guide-return">
          ← BACK TO SIX STARTING POINTS
        </button>
      ) : null}

      {isBroadcast && !browsing ? (
        <p className="tv-guide-note">
          {programs.length} public uploads indexed across verified blocks. Search or choose a block to go deeper.
        </p>
      ) : null}
      {!isBroadcast ? <p className="tv-guide-note">House-channel programming is an interface example, not a published schedule.</p> : null}
    </section>
  );
}

function TitleRow({
  channel,
  program,
  number,
  on,
  onTune,
  onArrow,
}: {
  channel: Channel;
  program: Program;
  number: number;
  on: boolean;
  onTune: (index: number) => void;
  onArrow: (e: KeyboardEvent, index: number) => void;
}) {
  const { clip, title, block, index } = program;
  return (
    <div className={`tv-guide-row ${on ? `${guideNowClass(channel.accent)} is-on-air` : ""}`}>
      <span className={`tv-guide-row-number ${on ? accentOnAir(channel.accent) : ""}`}>
        {on ? "ON" : String(number).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <button
          type="button"
          data-guide-k={`s:${index}`}
          aria-current={on ? "true" : undefined}
          onClick={() => onTune(index)}
          onKeyDown={(e) => onArrow(e, index)}
          className="tv-guide-row-title"
        >
          {title}
        </button>
        <p className="tv-guide-row-meta">{block === String(clip.year) ? block : `${block} · ${clip.year}`}</p>
      </div>
      <Link href={`/clip/${clip.slug}`} aria-label={`Open archive file for ${title}`} className="tv-guide-row-file">
        FILE ↗
      </Link>
    </div>
  );
}
