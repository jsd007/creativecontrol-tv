import Link from "next/link";
import { catalog, getLocation, getPerson, getTape } from "@/data";
import type { ArchiveClip, Collection } from "@/data/types";
import { PrototypeMedia } from "@/components/media/PrototypeMedia";
import { leftoverFrames, storyFrames, yearSpan } from "@/components/collections/held";
import { clipHeading } from "@/lib/clipDisplay";
import { visibilityLabel } from "@/lib/format";

export function CollectionStory({ collection }: { collection: Collection }) {
  const held = storyFrames(collection.id);
  const leftover = leftoverFrames(collection.id);
  const span = yearSpan(held);
  const empty = !held.length;
  const manyYears = new Set(held.map((c) => c.year)).size > 1;
  const archiveHref = `/archive?collection=${collection.id}`;
  const others = catalog.collections.filter((c) => c.id !== collection.id);

  return (
    <div className="px-4 pb-28 md:px-6">
      <p className="pt-4 font-cond text-[12px] tracking-[0.28em] text-leader">
        <Link href="/collections" className="hover:text-paper">
          STORIES
        </Link>
      </p>
      <h1 className="mt-3 max-w-[14ch] font-display text-5xl leading-none text-paper md:text-7xl">
        {collection.name}
      </h1>
      {collection.dek ? (
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-bone/75">{collection.dek}</p>
      ) : null}
      <p className="mt-5 font-mono text-[11px] tracking-[0.16em] text-leader">
        {span ?? "NO PUBLIC FRAMES"}
      </p>

      <div className="mt-8 flex flex-wrap gap-5 font-cond text-[13px] tracking-[0.16em]">
        {empty ? null : (
          <Link href={archiveHref} className="text-paper underline underline-offset-4">
            OPEN IN THE INDEX
          </Link>
        )}
        <Link href="/collections" className="text-dust hover:text-paper">
          ALL STORIES
        </Link>
      </div>

      {held.length ? (
        <div className="story-reel mt-12">
          <div className="film-perfs hidden md:block" aria-hidden />
          {held.map((clip, i) => {
            const showYear = manyYears && (i === 0 || held[i - 1].year !== clip.year);
            return (
              <div key={clip.id} className="border-t border-paper/10">
                {showYear ? (
                  <p className="pt-10 font-mono text-[11px] tracking-[0.22em] text-leader">{clip.year}</p>
                ) : null}
                <StoryBeat clip={clip} open={i === 0} flip={i % 2 === 1} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="story-reel mt-12 max-w-3xl">
          <div className="film-perfs hidden md:block" aria-hidden />
          <EmptyGate />
        </div>
      )}

      {leftover.length ? (
        <div className="mt-14">
          <p className="font-cond text-[12px] tracking-[0.22em] text-dust">HELD IN THE HOUSE FILE</p>
          <ul className="mt-5 space-y-3">
            {leftover.map((clip) => (
              <li key={clip.id}>
                <Link
                  href={`/clip/${clip.slug}`}
                  className="font-cond text-[13px] tracking-[0.18em] text-paper underline underline-offset-4"
                >
                  {clipHeading(clip)}
                  <span className="text-dust"> · {visibilityLabel(clip.visibility)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <nav className="mt-24 border-t border-paper/10 pt-10" aria-label="Other stories">
        <p className="font-cond text-[12px] tracking-[0.22em] text-dust">STORIES</p>
        <ul className="mt-6 space-y-3">
          {others.map((c) => (
            <li key={c.id}>
              <Link
                href={`/collections/${c.slug}`}
                className="font-display text-2xl leading-none text-paper hover:text-leader md:text-3xl"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function StoryBeat({ clip, open, flip }: { clip: ArchiveClip; open: boolean; flip: boolean }) {
  const loc = getLocation(clip.locationId);
  const tape = getTape(clip.sourceTapeId);
  const people = clip.peopleIds.map((id) => getPerson(id)).filter(Boolean).slice(0, 4);

  return (
    <article className="grid items-center gap-8 py-12 md:grid-cols-2 md:gap-12 lg:gap-16 md:py-14">
      <Link href={`/clip/${clip.slug}`} className={`${open ? "frame-in-gate " : ""}block ${flip ? "md:order-2" : ""}`}>
        <PrototypeMedia clip={clip} chrome="stamp" className="aspect-[4/3] w-full" />
      </Link>
      <div className={flip ? "md:order-1" : undefined}>
        <h2 className="max-w-[16ch] font-display text-3xl leading-none text-paper md:text-5xl">
          <Link href={`/clip/${clip.slug}`} className="hover:text-leader">
            {clipHeading(clip)}
          </Link>
        </h2>
        <p className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-cond text-[13px] tracking-[0.14em] text-dust">
          {loc ? (
            <Link href={`/places/${loc.slug}`} className="hover:text-paper">
              {loc.name.toUpperCase()}
            </Link>
          ) : null}
          {people.map((p) =>
            p ? (
              <Link key={p.id} href={`/people/${p.slug}`} className="hover:text-paper">
                {p.shortName.toUpperCase()}
              </Link>
            ) : null,
          )}
        </p>
        <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-dust">
          {tape?.code}
          {tape ? " · " : ""}
          {clip.type.toUpperCase()}
        </p>
      </div>
    </article>
  );
}

function EmptyGate() {
  return (
    <div className="viewfinder viewfinder-br relative aspect-[4/3] w-full bg-ink">
      <div className="absolute inset-0 bg-[#0c0b09]" />
      <div className="absolute inset-[14%] border border-paper/10" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <p className="font-mono text-[11px] tracking-[0.2em] text-dust">NO PUBLIC FRAMES</p>
      </div>
    </div>
  );
}
