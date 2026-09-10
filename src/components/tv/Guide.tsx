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

  /** Named blocks and dayparts are the programming — they open on the page. Years are the long tail. */
  const { shelves, books } = useMemo(() => {
    const shelves: GuideSection[] = [];
    const books: GuideSection[] = [];
    for (const block of sections) {
      const rows = titledRows(block.rows);
      if (!rows.length) continue;
      (isYearBook(block.section) ? books : shelves).push({ section: block.section, rows });
    }
    return { shelves, books };
  }, [sections]);

  const airBook = books.find((block) => block.rows.some((clip) => clip.id === nowId))?.section;
  const [drill, setDrill] = useState<Drill>(() => ({ book: airBook ?? books[0]?.section, page: 0 }));
  const [shelfPage, setShelfPage] = useState<Record<string, number>>({});

  useEffect(() => {
    setDrill({ book: airBook ?? books[0]?.section, page: 0 });
    setShelfPage({});
  }, [channel.id]);

  const open = books.find((block) => block.section === drill.book);
  const openRows = open?.rows ?? [];
  const fatYear = open ? isFatYearBook(open.section, openRows) : false;
  const letters = fatYear ? yearBookChapters(openRows) : null;
  const letter = letters?.find((chapter) => chapter.key === drill.letter);
  const prefixes = letter ? letterPrefixChapters(letter.key, letter.rows) : null;
  const prefix = prefixes?.find((chapter) => chapter.key === drill.prefix);
  const slice = fatYear ? (prefixes ? prefix?.rows : letter?.rows) : openRows;
  const windowed = useMemo(() => guideWindow(slice ?? [], drill.page), [slice, drill.page]);

  const keys = useMemo(
    () =>
      visibleKeys({
        shelves,
        shelfPage,
        books,
        lineup,
        drill,
        letters,
        prefixes,
        slice: slice ?? [],
        windowed: windowed.rows,
      }),
    [shelves, shelfPage, books, lineup, drill, letters, prefixes, slice, windowed.rows],
  );

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

  function turnShelf(section: string, rows: ArchiveClip[], next: number) {
    setShelfPage((cur) => ({ ...cur, [section]: next }));
    const first = guideWindow(rows, next).rows[0];
    if (first) focusKey(`s:${lineup.indexOf(first)}`);
  }

  function focusNext(from: string, dir: 1 | -1) {
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

      {shelves.map((block) => (
        <ProgramShelf
          key={block.section}
          channel={channel}
          section={block.section}
          rows={block.rows}
          lineup={lineup}
          nowId={nowId}
          page={shelfPage[block.section] ?? 0}
          onTune={onTune}
          onPage={(next) => turnShelf(block.section, block.rows, next)}
          onFocusNext={focusNext}
        />
      ))}

      {books.length ? (
        <div className="mt-10">
          <p className="font-cond text-[12px] tracking-[0.18em] text-dust">BY YEAR</p>
          <YearRail
            books={books}
            open={drill.book}
            onOpen={openBook}
            onFocusNext={focusNext}
          />

          {open && fatYear ? (
            <div className="mt-5">
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
              compact
              prevKey="m:prev"
              nextKey="m:next"
              onTune={onTune}
              onPage={turnPage}
              onFocusNext={focusNext}
            />
          ) : null}
        </div>
      ) : null}

      {channel.id === "broadcast" ? <BroadcastRemainder /> : null}
    </section>
  );
}

function visibleKeys({
  shelves,
  shelfPage,
  books,
  lineup,
  drill,
  letters,
  prefixes,
  slice,
  windowed,
}: {
  shelves: GuideSection[];
  shelfPage: Record<string, number>;
  books: GuideSection[];
  lineup: ArchiveClip[];
  drill: Drill;
  letters: YearChapter[] | null;
  prefixes: YearChapter[] | null;
  slice: ArchiveClip[];
  windowed: ArchiveClip[];
}) {
  const keys: string[] = [];

  for (const block of shelves) {
    const page = guideWindow(block.rows, shelfPage[block.section] ?? 0);
    if (page.hasPrev) keys.push(`mp:${block.section}:prev`);
    for (const clip of page.rows) keys.push(`s:${lineup.indexOf(clip)}`);
    if (page.hasMore) keys.push(`mp:${block.section}:next`);
  }

  for (const block of books) keys.push(`b:${block.section}`);

  if (drill.book && letters) {
    for (const chapter of letters) keys.push(`c:${drill.book}:${chapter.key}`);
    if (drill.letter && prefixes) {
      for (const chapter of prefixes) keys.push(`p:${drill.book}:${drill.letter}:${chapter.key}`);
    }
  }

  const showTitles = slice.length && (!letters || drill.letter) && (!prefixes || drill.prefix);
  if (showTitles) {
    const page = guideWindow(slice, drill.page);
    if (page.hasPrev) keys.push("m:prev");
    for (const clip of windowed) keys.push(`s:${lineup.indexOf(clip)}`);
    if (page.hasMore) keys.push("m:next");
  }

  return keys;
}

/** A block short enough to read is read here — not behind a door. */
function ProgramShelf({
  channel,
  section,
  rows,
  lineup,
  nowId,
  page,
  onTune,
  onPage,
  onFocusNext,
}: {
  channel: Channel;
  section: string;
  rows: ArchiveClip[];
  lineup: ArchiveClip[];
  nowId?: string;
  page: number;
  onTune: (index: number) => void;
  onPage: (page: number) => void;
  onFocusNext: (from: string, dir: 1 | -1) => void;
}) {
  const windowed = guideWindow(rows, page);
  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between gap-4 border-b border-paper/15 pb-2">
        <p className="font-cond text-[17px] leading-none tracking-[0.1em] text-paper md:text-[19px]">{section}</p>
        <p className="font-mono text-[11px] tracking-[0.14em] text-dust">
          {rows.length} {rows.length === 1 ? "TITLE" : "TITLES"}
        </p>
      </div>
      <TitlePage
        channel={channel}
        lineup={lineup}
        rows={windowed.rows}
        nowId={nowId}
        hasPrev={windowed.hasPrev}
        hasMore={windowed.hasMore}
        page={windowed.page}
        compact
        prevKey={`mp:${section}:prev`}
        nextKey={`mp:${section}:next`}
        onTune={onTune}
        onPage={onPage}
        onFocusNext={onFocusNext}
      />
    </div>
  );
}

function YearRail({
  books,
  open,
  onOpen,
  onFocusNext,
}: {
  books: GuideSection[];
  open?: string;
  onOpen: (section: string) => void;
  onFocusNext: (from: string, dir: 1 | -1) => void;
}) {
  return (
    <div className="hand-strip mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-3" role="tablist" aria-label="By year">
      {books.map((block) => {
        const key = `b:${block.section}`;
        const on = block.section === open;
        return (
          <button
            key={block.section}
            type="button"
            role="tab"
            data-guide-k={key}
            aria-selected={on}
            onClick={() => onOpen(block.section)}
            onKeyDown={(e) => arrowKeys(e, key, onFocusNext)}
            className={`text-left font-cond leading-none ${on ? "text-paper" : "text-dust hover:text-leader"}`}
          >
            <span className="text-[28px] tracking-[0.04em] md:text-[32px]">{block.section}</span>
            <span className="ml-2 font-mono text-[11px] tracking-[0.12em]">{block.rows.length}</span>
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
  prevKey,
  nextKey,
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
  prevKey: string;
  nextKey: string;
  onTune: (index: number) => void;
  onPage: (page: number) => void;
  onFocusNext: (from: string, dir: 1 | -1) => void;
}) {
  return (
    <div className="mt-2">
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
              data-guide-k={prevKey}
              onClick={() => onPage(page - 1)}
              onKeyDown={(e) => arrowKeys(e, prevKey, onFocusNext)}
              className="font-cond text-[13px] tracking-[0.14em] text-leader hover:text-paper"
            >
              PREV
            </button>
          ) : null}
          {hasMore ? (
            <button
              type="button"
              data-guide-k={nextKey}
              onClick={() => onPage(page + 1)}
              onKeyDown={(e) => arrowKeys(e, nextKey, onFocusNext)}
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
        {clip.youtubeId ? null : <span>{clip.startTimecode}</span>}
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
          className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-paper/10 py-3"
          style={{ opacity: line ? 0.55 : 0.22 }}
        >
          <span className="font-cond text-[12px] tracking-[0.12em] text-dust">—</span>
          <p className="font-mono text-[13px] tracking-[0.12em] text-dust">{line || "\u00a0"}</p>
        </div>
      ))}
    </div>
  );
}
