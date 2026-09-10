"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { ArchiveClip } from "@/data/types";
import { programTitle } from "@/lib/clipDisplay";
import type { Channel, GuideSection, YearChapter } from "@/lib/television";
import {
  accentOnAir,
  guideNowClass,
  guideWindow,
  isFatYearBook,
  isYearBook,
  letterPrefixChapters,
  yearBookChapters,
} from "@/lib/television";

type Props = {
  channel: Channel;
  sections: GuideSection[];
  lineup: ArchiveClip[];
  nowId?: string;
  onTune: (index: number) => void;
};

type Drill = {
  book?: string;
  letter?: string;
  prefix?: string;
  page: number;
};

function titledRows(rows: ArchiveClip[]) {
  return rows.filter((clip) => programTitle(clip));
}

export function Guide({ channel, sections, lineup, nowId, onTune }: Props) {
  const root = useRef<HTMLElement>(null);
  const books = channel.id === "broadcast";
  const airBook = sections.find((block) => block.rows.some((clip) => clip.id === nowId))?.section;
  const [drill, setDrill] = useState<Drill>(() => ({ book: airBook, page: 0 }));

  useEffect(() => {
    setDrill({ book: airBook, page: 0 });
  }, [channel.id]);

  const open = sections.find((block) => block.section === drill.book);
  const openRows = open ? titledRows(open.rows) : [];
  const fatYear = open ? isFatYearBook(open.section, openRows) : false;
  const letters = fatYear ? yearBookChapters(openRows) : null;
  const letter = letters?.find((chapter) => chapter.key === drill.letter);
  const prefixes = letter ? letterPrefixChapters(letter.key, letter.rows) : null;
  const prefix = prefixes?.find((chapter) => chapter.key === drill.prefix);
  const slice = fatYear ? (prefixes ? prefix?.rows : letter?.rows) : openRows;
  const windowed = useMemo(() => guideWindow(slice ?? [], drill.page), [slice, drill.page]);

  function focusKey(key: string) {
    requestAnimationFrame(() => {
      root.current?.querySelector<HTMLElement>(`[data-guide-k="${CSS.escape(key)}"]`)?.focus();
    });
  }

  function openBook(section: string) {
    setDrill({ book: section, page: 0 });
    focusKey(`b:${section}`);
  }

  function openLetter(key: string) {
    setDrill((cur) => ({ book: cur.book, letter: key, page: 0 }));
    focusKey(`c:${drill.book}:${key}`);
  }

  function openPrefix(key: string) {
    setDrill((cur) => ({ book: cur.book, letter: cur.letter, prefix: key, page: 0 }));
    focusKey(`p:${drill.book}:${drill.letter}:${key}`);
  }

  function turnPage(next: number) {
    setDrill((cur) => ({ ...cur, page: next }));
    const first = guideWindow(slice ?? [], next).rows[0];
    if (first) focusKey(`s:${lineup.indexOf(first)}`);
  }

  function focusNext(from: string, dir: 1 | -1) {
    const keys = visibleKeys({
      sections,
      lineup,
      books,
      drill,
      letters,
      prefixes,
      slice: slice ?? [],
      windowed: windowed.rows,
    });
    const at = keys.indexOf(from);
    const next = keys[at + dir];
    if (!next) return;
    root.current?.querySelector<HTMLElement>(`[data-guide-k="${CSS.escape(next)}"]`)?.focus();
  }

  return (
    <section ref={root} id="guide" className="tv-guide mt-12 scroll-mt-28" data-guide>
      <div className="border-b border-paper/15 pb-2">
        <p className="font-cond text-[12px] tracking-[0.22em] text-leader">GUIDE</p>
        <p className="mt-1 font-cond text-[13px] tracking-[0.12em] text-dust">{channel.voice}</p>
      </div>

      <Board
        sections={sections}
        open={drill.book}
        yearish={books}
        onOpen={openBook}
        onFocusNext={focusNext}
      />

      {open && fatYear ? (
        <div className="mt-6">
          <LetterRail
            book={open.section}
            chapters={letters ?? []}
            open={drill.letter}
            onOpen={openLetter}
            onFocusNext={focusNext}
          />
          {letter && prefixes ? (
            <PrefixRail
              book={open.section}
              letter={letter.key}
              chapters={prefixes}
              open={drill.prefix}
              onOpen={openPrefix}
              onFocusNext={focusNext}
            />
          ) : null}
        </div>
      ) : null}

      {slice?.length && (!fatYear || letter) && (!prefixes || prefix) ? (
        <TitlePage
          channel={channel}
          lineup={lineup}
          rows={windowed.rows}
          nowId={nowId}
          hasPrev={windowed.hasPrev}
          hasMore={windowed.hasMore}
          page={windowed.page}
          compact={books}
          onTune={onTune}
          onPage={turnPage}
          onFocusNext={focusNext}
        />
      ) : null}

      {books ? <BroadcastRemainder /> : null}
    </section>
  );
}

function visibleKeys({
  sections,
  lineup,
  books,
  drill,
  letters,
  prefixes,
  slice,
  windowed,
}: {
  sections: GuideSection[];
  lineup: ArchiveClip[];
  books: boolean;
  drill: Drill;
  letters: YearChapter[] | null;
  prefixes: YearChapter[] | null;
  slice: ArchiveClip[];
  windowed: ArchiveClip[];
}) {
  const keys = sections.filter((block) => titledRows(block.rows).length).map((block) => `b:${block.section}`);
  if (books && drill.book && letters) {
    for (const chapter of letters) keys.push(`c:${drill.book}:${chapter.key}`);
    if (drill.letter && prefixes) {
      for (const chapter of prefixes) keys.push(`p:${drill.book}:${drill.letter}:${chapter.key}`);
    }
  }
  const showTitles = slice.length && (!letters || drill.letter) && (!prefixes || drill.prefix);
  if (showTitles) {
    if (guideWindow(slice, drill.page).hasPrev) keys.push("m:prev");
    for (const clip of windowed) keys.push(`s:${lineup.indexOf(clip)}`);
    if (guideWindow(slice, drill.page).hasMore) keys.push("m:next");
  }
  return keys;
}

function Board({
  sections,
  open,
  yearish,
  onOpen,
  onFocusNext,
}: {
  sections: GuideSection[];
  open?: string;
  yearish: boolean;
  onOpen: (section: string) => void;
  onFocusNext: (from: string, dir: 1 | -1) => void;
}) {
  return (
    <div className="hand-strip mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2" role="tablist" aria-label="Programmed board">
      {sections.map((block) => {
        const titled = titledRows(block.rows);
        if (!titled.length) return null;
        const key = `b:${block.section}`;
        const on = block.section === open;
        const year = yearish && isYearBook(block.section);
        return (
          <button
            key={block.section}
            type="button"
            role="tab"
            data-guide-k={key}
            aria-selected={on}
            onClick={() => onOpen(block.section)}
            onKeyDown={(e) => arrowKeys(e, key, onFocusNext)}
            className={`text-left font-cond leading-none ${
              year ? "text-[28px] tracking-[0.04em] md:text-[32px]" : "text-[15px] tracking-[0.1em] md:text-[16px]"
            } ${on ? "text-paper" : "text-dust hover:text-leader"}`}
          >
            {block.section}
          </button>
        );
      })}
    </div>
  );
}

function LetterRail({
  book,
  chapters,
  open,
  onOpen,
  onFocusNext,
}: {
  book: string;
  chapters: YearChapter[];
  open?: string;
  onOpen: (key: string) => void;
  onFocusNext: (from: string, dir: 1 | -1) => void;
}) {
  return (
    <div className="hand-strip flex flex-wrap items-baseline gap-x-3 gap-y-1" role="tablist" aria-label={`${book} index`}>
      {chapters.map((chapter) => {
        const key = `c:${book}:${chapter.key}`;
        const on = chapter.key === open;
        return (
          <button
            key={chapter.key}
            type="button"
            role="tab"
            data-guide-k={key}
            aria-selected={on}
            onClick={() => onOpen(chapter.key)}
            onKeyDown={(e) => arrowKeys(e, key, onFocusNext)}
            className={`font-cond text-[22px] leading-none tracking-[0.04em] md:text-[24px] ${
              on ? "text-paper" : "text-dust hover:text-leader"
            }`}
          >
            {chapter.label}
          </button>
        );
      })}
    </div>
  );
}

function PrefixRail({
  book,
  letter,
  chapters,
  open,
  onOpen,
  onFocusNext,
}: {
  book: string;
  letter: string;
  chapters: YearChapter[];
  open?: string;
  onOpen: (key: string) => void;
  onFocusNext: (from: string, dir: 1 | -1) => void;
}) {
  return (
    <div className="hand-strip mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2" role="tablist" aria-label={`${book} ${letter} prefix`}>
      {chapters.map((chapter) => {
        const key = `p:${book}:${letter}:${chapter.key}`;
        const on = chapter.key === open;
        return (
          <button
            key={chapter.key}
            type="button"
            role="tab"
            data-guide-k={key}
            aria-selected={on}
            onClick={() => onOpen(chapter.key)}
            onKeyDown={(e) => arrowKeys(e, key, onFocusNext)}
            className={`font-cond text-[16px] leading-none tracking-[0.1em] md:text-[18px] ${
              on ? "text-paper" : "text-dust hover:text-leader"
            }`}
          >
            {chapter.label}
          </button>
        );
      })}
    </div>
  );
}

function TitlePage({
  channel,
  lineup,
  rows,
  nowId,
  hasPrev,
  hasMore,
  page,
  compact,
  onTune,
  onPage,
  onFocusNext,
}: {
  channel: Channel;
  lineup: ArchiveClip[];
  rows: ArchiveClip[];
  nowId?: string;
  hasPrev: boolean;
  hasMore: boolean;
  page: number;
  compact: boolean;
  onTune: (index: number) => void;
  onPage: (page: number) => void;
  onFocusNext: (from: string, dir: 1 | -1) => void;
}) {
  return (
    <div className="mt-6">
      {rows.map((clip) => {
        const title = programTitle(clip);
        if (!title) return null;
        return (
          <TitleRow
            key={clip.id}
            channel={channel}
            clip={clip}
            title={title}
            index={lineup.indexOf(clip)}
            on={clip.id === nowId}
            compact={compact}
            onTune={onTune}
            onFocusNext={onFocusNext}
          />
        );
      })}
      {hasPrev || hasMore ? (
        <div className="mt-4 flex flex-wrap gap-6">
          {hasPrev ? (
            <button
              type="button"
              data-guide-k="m:prev"
              onClick={() => onPage(page - 1)}
              onKeyDown={(e) => arrowKeys(e, "m:prev", onFocusNext)}
              className="font-cond text-[13px] tracking-[0.14em] text-leader hover:text-paper"
            >
              PREV
            </button>
          ) : null}
          {hasMore ? (
            <button
              type="button"
              data-guide-k="m:next"
              onClick={() => onPage(page + 1)}
              onKeyDown={(e) => arrowKeys(e, "m:next", onFocusNext)}
              className="font-cond text-[13px] tracking-[0.14em] text-leader hover:text-paper"
            >
              MORE
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function TitleRow({
  channel,
  clip,
  title,
  index,
  on,
  compact,
  onTune,
  onFocusNext,
}: {
  channel: Channel;
  clip: ArchiveClip;
  title: string;
  index: number;
  on: boolean;
  compact: boolean;
  onTune: (index: number) => void;
  onFocusNext: (from: string, dir: 1 | -1) => void;
}) {
  const key = `s:${index}`;
  return (
    <div
      className={`grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-paper/10 ${
        compact ? "py-2" : "py-3"
      } ${on ? `${guideNowClass(channel.accent)} text-paper` : ""}`}
    >
      <span className={`font-cond text-[12px] tracking-[0.12em] ${on ? accentOnAir(channel.accent) : "text-dust"}`}>
        {on ? "ON" : clip.year}
      </span>
      <button
        type="button"
        data-guide-k={key}
        data-guide-i={index}
        aria-current={on ? "true" : undefined}
        onClick={() => onTune(index)}
        onKeyDown={(e) => arrowKeys(e, key, onFocusNext)}
        className={`text-left ${
          compact
            ? `font-sans text-[15px] leading-snug md:text-[16px] ${on ? "text-paper" : "text-bone hover:text-leader"}`
            : `font-display text-[22px] leading-tight md:text-3xl ${on ? "text-paper" : "hover:text-leader"}`
        }`}
      >
        {title}
      </button>
      <p className="hidden items-baseline gap-3 font-mono text-[12px] tracking-[0.08em] text-dust sm:flex">
        <span>{clip.youtubeId ? "BROADCAST" : clip.startTimecode}</span>
        <Link href={`/clip/${clip.slug}`} className="tracking-[0.12em] text-dust hover:text-paper">
          CLIP
        </Link>
      </p>
    </div>
  );
}

function arrowKeys(e: KeyboardEvent, key: string, onFocusNext: (from: string, dir: 1 | -1) => void) {
  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    e.preventDefault();
    onFocusNext(key, 1);
  }
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    e.preventDefault();
    onFocusNext(key, -1);
  }
}

/** After the official public titles. Unlisted / private / not on the listing. No invented shows. No upload count. */
function BroadcastRemainder() {
  const rows = ["HELD", "UNOPENED", "HELD", "UNOPENED", "", ""] as const;
  return (
    <div className="mt-10" aria-label="Not in this mock">
      <p className="font-cond text-[12px] tracking-[0.18em] text-dust">NOT IN THIS MOCK</p>
      <p className="mt-1 font-cond text-[13px] tracking-[0.12em] text-dust">Unlisted or private.</p>
      {rows.map((line, i) => (
        <div
          key={`held-${i}`}
          className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-paper/8 py-3"
          style={{ opacity: line ? 0.55 : 0.22 }}
        >
          <span className="font-cond text-[12px] tracking-[0.12em] text-dust">—</span>
          <p className="font-mono text-[13px] tracking-[0.12em] text-dust">{line || "\u00a0"}</p>
        </div>
      ))}
    </div>
  );
}
