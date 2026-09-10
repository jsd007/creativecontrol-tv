"use client";

import Link from "next/link";
import { useRef } from "react";
import type { ArchiveClip } from "@/data/types";
import { programTitle } from "@/lib/clipDisplay";
import type { Channel, GuideSection, YearChapter } from "@/lib/television";
import {
  accentOnAir,
  guideNowClass,
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

export function Guide({ channel, sections, lineup, nowId, onTune }: Props) {
  const root = useRef<HTMLElement>(null);
  const books = channel.id === "broadcast";
  const nowBook = books ? sections.find((block) => block.rows.some((clip) => clip.id === nowId))?.section : undefined;

  function focusNext(from: string, dir: 1 | -1) {
    const keys = visibleKeys(sections, lineup, nowBook, nowId);
    const at = keys.indexOf(from);
    const next = keys[at + dir];
    if (!next) return;
    root.current?.querySelector<HTMLElement>(`[data-guide-k="${CSS.escape(next)}"]`)?.focus();
  }

  return (
    <section ref={root} className="mt-12" data-guide>
      <div className="border-b border-paper/15 pb-2">
        <p className="font-cond text-[12px] tracking-[0.22em] text-leader">GUIDE</p>
        <p className="mt-1 font-cond text-[13px] tracking-[0.16em] text-dust">{channel.voice}</p>
      </div>

      {books ? (
        <div>
          {sections.map((block) => (
            <BroadcastBook
              key={block.section}
              channel={channel}
              block={block}
              lineup={lineup}
              nowId={nowId}
              open={block.section === nowBook}
              onTune={onTune}
              onFocusNext={focusNext}
            />
          ))}
        </div>
      ) : (
        <div>
          {sections.map((block) => (
            <div key={block.section} className="mt-8 first:mt-6">
              <p className="type-label">{block.section}</p>
              {block.rows.map((clip) => {
                const title = programTitle(clip);
                if (!title) return null;
                const index = lineup.indexOf(clip);
                return (
                  <TitleRow
                    key={clip.id}
                    channel={channel}
                    clip={clip}
                    title={title}
                    index={index}
                    on={clip.id === nowId}
                    compact={false}
                    onTune={onTune}
                    onFocusNext={focusNext}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      {channel.id === "broadcast" ? <BroadcastRemainder /> : null}
    </section>
  );
}

function visibleKeys(sections: GuideSection[], lineup: ArchiveClip[], nowBook?: string, nowId?: string) {
  const keys: string[] = [];
  for (const block of sections) {
    const titled = block.rows.filter((clip) => programTitle(clip));
    if (!titled.length) continue;
    if (nowBook) {
      keys.push(`b:${block.section}`);
      if (block.section !== nowBook) continue;
      if (isFatYearBook(block.section, titled)) {
        const chapters = yearBookChapters(titled);
        const openKey = chapters.find((chapter) => chapter.rows.some((clip) => clip.id === nowId))?.key;
        for (const chapter of chapters) {
          keys.push(`c:${block.section}:${chapter.key}`);
          if (chapter.key !== openKey) continue;
          const prefixes = letterPrefixChapters(chapter.key, chapter.rows);
          if (prefixes) {
            const openPrefix = prefixes.find((prefix) => prefix.rows.some((clip) => clip.id === nowId))?.key;
            for (const prefix of prefixes) {
              keys.push(`p:${block.section}:${chapter.key}:${prefix.key}`);
              if (prefix.key === openPrefix) {
                for (const clip of prefix.rows) keys.push(`s:${lineup.indexOf(clip)}`);
              }
            }
          } else {
            for (const clip of chapter.rows) keys.push(`s:${lineup.indexOf(clip)}`);
          }
        }
      } else {
        for (const clip of titled) keys.push(`s:${lineup.indexOf(clip)}`);
      }
    } else {
      for (const clip of titled) keys.push(`s:${lineup.indexOf(clip)}`);
    }
  }
  return keys;
}

function BroadcastBook({
  channel,
  block,
  lineup,
  nowId,
  open,
  onTune,
  onFocusNext,
}: {
  channel: Channel;
  block: GuideSection;
  lineup: ArchiveClip[];
  nowId?: string;
  open: boolean;
  onTune: (index: number) => void;
  onFocusNext: (from: string, dir: 1 | -1) => void;
}) {
  const titled = block.rows.filter((clip) => programTitle(clip));
  const first = titled[0];
  if (!first) return null;
  const firstIndex = lineup.indexOf(first);
  const year = isYearBook(block.section);
  const bookKey = `b:${block.section}`;
  const chapters = isFatYearBook(block.section, titled) ? yearBookChapters(titled) : null;
  const openChapter = chapters?.find((chapter) => chapter.rows.some((clip) => clip.id === nowId));

  return (
    <div className="mt-8 first:mt-6">
      <div className={`grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-paper/15 py-3 ${open ? "text-paper" : ""}`}>
        <span className="font-cond text-[12px] tracking-[0.16em] text-dust">{"\u00a0"}</span>
        <button
          type="button"
          data-guide-k={bookKey}
          aria-expanded={open}
          aria-current={open ? "true" : undefined}
          onClick={() => onTune(firstIndex)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowRight") {
              e.preventDefault();
              onFocusNext(bookKey, 1);
            }
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
              e.preventDefault();
              onFocusNext(bookKey, -1);
            }
          }}
          className={`text-left font-cond leading-none ${
            year ? "text-[40px] tracking-[0.06em] md:text-[48px]" : "text-[22px] tracking-[0.16em] md:text-[28px]"
          } ${open ? "text-paper" : "text-bone hover:text-leader"}`}
        >
          {block.section}
        </button>
      </div>

      {open && chapters
        ? chapters.map((chapter) => (
            <LetterChapter
              key={chapter.key}
              channel={channel}
              book={block.section}
              chapter={chapter}
              lineup={lineup}
              nowId={nowId}
              open={chapter.key === openChapter?.key}
              onTune={onTune}
              onFocusNext={onFocusNext}
            />
          ))
        : open
          ? titled.map((clip) => {
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
                  compact
                  onTune={onTune}
                  onFocusNext={onFocusNext}
                />
              );
            })
          : null}
    </div>
  );
}

function LetterChapter({
  channel,
  book,
  chapter,
  lineup,
  nowId,
  open,
  onTune,
  onFocusNext,
}: {
  channel: Channel;
  book: string;
  chapter: YearChapter;
  lineup: ArchiveClip[];
  nowId?: string;
  open: boolean;
  onTune: (index: number) => void;
  onFocusNext: (from: string, dir: 1 | -1) => void;
}) {
  const first = chapter.rows[0];
  if (!first) return null;
  const chapterKey = `c:${book}:${chapter.key}`;
  const prefixes = letterPrefixChapters(chapter.key, chapter.rows);
  const openPrefix = prefixes?.find((prefix) => prefix.rows.some((clip) => clip.id === nowId));

  return (
    <div>
      <div className={`grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-paper/12 py-2.5 ${open ? "text-paper" : ""}`}>
        <span className="font-cond text-[12px] tracking-[0.16em] text-dust">{"\u00a0"}</span>
        <button
          type="button"
          data-guide-k={chapterKey}
          aria-expanded={open}
          aria-current={open ? "true" : undefined}
          onClick={() => onTune(lineup.indexOf(first))}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowRight") {
              e.preventDefault();
              onFocusNext(chapterKey, 1);
            }
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
              e.preventDefault();
              onFocusNext(chapterKey, -1);
            }
          }}
          className={`text-left font-cond leading-none text-[28px] tracking-[0.08em] md:text-[36px] ${
            open ? "text-paper" : "text-bone hover:text-leader"
          }`}
        >
          {chapter.label}
        </button>
      </div>
      {open && prefixes
        ? prefixes.map((prefix) => (
            <PrefixChapter
              key={prefix.key}
              channel={channel}
              book={book}
              letter={chapter.key}
              chapter={prefix}
              lineup={lineup}
              nowId={nowId}
              open={prefix.key === openPrefix?.key}
              onTune={onTune}
              onFocusNext={onFocusNext}
            />
          ))
        : open
          ? chapter.rows.map((clip) => {
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
                  compact
                  onTune={onTune}
                  onFocusNext={onFocusNext}
                />
              );
            })
          : null}
    </div>
  );
}

function PrefixChapter({
  channel,
  book,
  letter,
  chapter,
  lineup,
  nowId,
  open,
  onTune,
  onFocusNext,
}: {
  channel: Channel;
  book: string;
  letter: string;
  chapter: YearChapter;
  lineup: ArchiveClip[];
  nowId?: string;
  open: boolean;
  onTune: (index: number) => void;
  onFocusNext: (from: string, dir: 1 | -1) => void;
}) {
  const first = chapter.rows[0];
  if (!first) return null;
  const prefixKey = `p:${book}:${letter}:${chapter.key}`;

  return (
    <div>
      <div className={`grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-paper/10 py-2 ${open ? "text-paper" : ""}`}>
        <span className="font-cond text-[12px] tracking-[0.16em] text-dust">{"\u00a0"}</span>
        <button
          type="button"
          data-guide-k={prefixKey}
          aria-expanded={open}
          aria-current={open ? "true" : undefined}
          onClick={() => onTune(lineup.indexOf(first))}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowRight") {
              e.preventDefault();
              onFocusNext(prefixKey, 1);
            }
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
              e.preventDefault();
              onFocusNext(prefixKey, -1);
            }
          }}
          className={`text-left font-cond leading-none text-[20px] tracking-[0.1em] md:text-[26px] ${
            open ? "text-paper" : "text-bone hover:text-leader"
          }`}
        >
          {chapter.label}
        </button>
      </div>
      {open
        ? chapter.rows.map((clip) => {
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
                compact
                onTune={onTune}
                onFocusNext={onFocusNext}
              />
            );
          })
        : null}
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
      <span className={`font-cond text-[12px] tracking-[0.16em] ${on ? accentOnAir(channel.accent) : "text-dust"}`}>
        {on ? "ON" : clip.year}
      </span>
      <button
        type="button"
        data-guide-k={key}
        data-guide-i={index}
        aria-current={on ? "true" : undefined}
        onClick={() => onTune(index)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            onFocusNext(key, 1);
          }
          if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            onFocusNext(key, -1);
          }
        }}
        className={`text-left ${
          compact
            ? `font-sans text-[15px] leading-snug md:text-[16px] ${on ? "text-paper" : "text-bone hover:text-leader"}`
            : `font-display text-[22px] leading-tight md:text-3xl ${on ? "text-paper" : "hover:text-leader"}`
        }`}
      >
        {title}
      </button>
      <p className="hidden items-baseline gap-3 font-mono text-[10px] tracking-[0.12em] text-dust sm:flex">
        <span>{clip.youtubeId ? "BROADCAST" : clip.startTimecode}</span>
        <Link href={`/clip/${clip.slug}`} className="tracking-[0.16em] text-dust hover:text-paper">
          CLIP
        </Link>
      </p>
    </div>
  );
}

/** After the official public titles. Unlisted / private / not on the listing. No invented shows. No upload count. */
function BroadcastRemainder() {
  const rows = ["HELD", "UNOPENED", "HELD", "UNOPENED", "", ""] as const;
  return (
    <div className="mt-10" aria-label="Not in this mock">
      <p className="font-cond text-[11px] tracking-[0.22em] text-dust">NOT IN THIS MOCK</p>
      <p className="mt-1 font-cond text-[13px] tracking-[0.16em] text-dust/65">Unlisted or private.</p>
      {rows.map((line, i) => (
        <div
          key={`held-${i}`}
          className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-paper/8 py-3"
          style={{ opacity: line ? 0.42 : 0.18 - i * 0.02 }}
        >
          <span className="font-cond text-[12px] tracking-[0.16em] text-dust">—</span>
          <p className="font-mono text-[13px] tracking-[0.16em] text-dust">{line || "\u00a0"}</p>
        </div>
      ))}
    </div>
  );
}
