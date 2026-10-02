"use client";

import Link from "next/link";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { accentOnAir, guideNowClass, guideWindow, type Channel, type GuideSection } from "@/lib/television";
import { ALL_PROGRAMS, tvClipHref, type TVProgram } from "@/lib/tvNavigation";
import { usePrefersReducedMotion } from "@/lib/motion";

type Props = {
  channel: Channel;
  sections: GuideSection[];
  programs: TVProgram[];
  results: TVProgram[];
  find: string;
  block: string;
  page: number;
  programLink: string;
  onFind: (value: string) => void;
  onBlock: (value: string) => void;
  onPage: (value: number) => void;
  onReset: () => void;
  journeyTitle?: string;
  onLeaveJourney?: () => void;
  nowId?: string;
  onTune: (index: number) => void;
};

export function Guide({ channel, sections, programs, results, find, block, page, programLink, onFind, onBlock, onPage, onReset, journeyTitle, onLeaveJourney, nowId, onTune }: Props) {
  const root = useRef<HTMLElement>(null);
  const focusPage = useRef(false);
  const reduced = usePrefersReducedMotion();
  const isBroadcast = channel.id === "broadcast";
  const needle = find.trim().toLowerCase();
  const browsing = Boolean(needle || block);
  const windowed = guideWindow(results, page, 8);
  const start = windowed.page * 8 + 1;
  const end = Math.min(start + windowed.rows.length - 1, results.length);

  function changePage(next: number) {
    focusPage.current = true;
    onPage(next);
  }

  useEffect(() => {
    if (!focusPage.current) return;
    focusPage.current = false;
    root.current?.querySelector<HTMLHeadingElement>("h2")?.focus({ preventScroll: true });
    root.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }, [windowed.page, reduced]);

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
          <h2 tabIndex={-1} className="mt-1 font-display text-2xl leading-none text-paper">
            {journeyTitle ?? (browsing ? (needle ? "Find a program" : block === ALL_PROGRAMS ? "All broadcasts" : block) : isBroadcast ? "Start watching" : channel.name)}
          </h2>
          <p className="mt-2 font-sans text-[13px] leading-snug text-dust">
            {journeyTitle ? `${results.length} parts in order. Choose a title to watch.` : browsing
              ? `${results.length} ${results.length === 1 ? "program" : "programs"} in this view`
              : isBroadcast
                ? "Six starting points. Choose a title to watch."
                : `${programs.length} public ${programs.length === 1 ? "program" : "programs"}. Choose a title to watch.`}
          </p>
        </div>
        <span className="font-mono text-[11px] tracking-[0.12em] text-dust">CH {channel.n}</span>
      </div>

      {journeyTitle ? <button type="button" onClick={onLeaveJourney} className="tv-guide-return">← LEAVE JOURNEY / ALL BROADCASTS</button> : null}

      <div className="tv-guide-tools">
        <label className="tv-guide-field">
          <span>SEARCH THIS CHANNEL</span>
          <input
            value={find}
            onChange={(e) => onFind(e.target.value)}
            type="search"
            placeholder="Title, year, or block"
            aria-label="Search programs on this channel"
            className="tv-guide-find"
          />
        </label>
        <label className="tv-guide-field">
          <span>PROGRAM BLOCK</span>
          <select value={block} onChange={(e) => onBlock(e.target.value)} aria-label="Choose a program block">
            <option value="">{journeyTitle ? "Current journey" : isBroadcast ? "Start here (6 picks)" : "Full channel"}</option>
            {isBroadcast ? <option value={ALL_PROGRAMS}>All public uploads ({programs.length})</option> : null}
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
              detailHref={tvClipHref(program.clip.slug, programLink)}
            />
          ))}
        </div>
      ) : (
        <div className="tv-guide-empty">
          <p className="font-cond text-[17px] tracking-[0.1em] text-paper">NO PROGRAMS FOUND</p>
          <p className="mt-1 text-[13px] text-dust">Try another title, year, or block.</p>
          <button type="button" onClick={onReset} className="mt-4 font-cond text-[12px] tracking-[0.14em] text-leader underline underline-offset-4">
            RESET GUIDE
          </button>
        </div>
      )}

      {(browsing || windowed.pages > 1) && results.length > 0 ? (
        <div className="tv-guide-pager">
          <span>{start}–{end} OF {results.length}</span>
          <div>
            <button type="button" disabled={!windowed.hasPrev} onClick={() => changePage(windowed.page - 1)} aria-label="Previous guide page">← PREV</button>
            <button type="button" disabled={!windowed.hasMore} onClick={() => changePage(windowed.page + 1)} aria-label="Next guide page">NEXT →</button>
          </div>
        </div>
      ) : null}

      {isBroadcast && browsing ? (
        <button type="button" onClick={onReset} className="tv-guide-return">
          ← BACK TO SIX STARTING POINTS
        </button>
      ) : null}

      {isBroadcast && !browsing && !journeyTitle ? (
        <p className="tv-guide-note">
          {programs.length} public uploads indexed across verified blocks. Search or choose a block to go deeper.
        </p>
      ) : null}
      {journeyTitle ? <p className="tv-guide-note">An editorial path through released public videos. Choose a part to watch; your sound setting carries across programs. Search or choose a block to leave this sequence.</p> : null}
      {!isBroadcast ? <p className="tv-guide-note">An editorial selection of released public videos, not an official playlist or private archive inventory.</p> : null}
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
  detailHref,
}: {
  channel: Channel;
  program: TVProgram;
  number: number;
  on: boolean;
  onTune: (index: number) => void;
  onArrow: (e: KeyboardEvent, index: number) => void;
  detailHref: string;
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
          <span>{title}</span>
          <span className="tv-guide-row-meta block">{block === String(clip.year) ? block : `${block} · ${clip.year}`}</span>
        </button>
      </div>
      <Link href={detailHref} aria-label={`Open archive file for ${title}`} className="tv-guide-row-file">
        DETAILS ↗
      </Link>
    </div>
  );
}
