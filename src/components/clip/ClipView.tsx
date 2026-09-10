import Link from "next/link";
import {
  clipsOnTape,
  getAlbum,
  getCollection,
  getEra,
  getLocation,
  getPerson,
  getProject,
  getTape,
  getTrack,
  transcriptForClip,
} from "@/data";
import type { Album, ArchiveClip, Collection, Person, Project, Track } from "@/data/types";
import { relatedCards, relatedClips } from "@/lib/archiveQuery";
import { clipHeading, clipTechnical, isUnlogged } from "@/lib/clipDisplay";
import { formatDate } from "@/lib/format";
import { holdFor, isClosed } from "@/lib/visibility";
import { ClipDossier } from "@/components/clip/ClipDossier";
import { ClipSleeve } from "@/components/clip/ClipSleeve";
import { ClipStage, RelatedReveal } from "@/components/clip/ClipStage";
import { RelatedFrame } from "@/components/clip/RelatedFrame";
import { TranscriptDossier } from "@/components/clip/TranscriptDossier";
import { ArchivePicture } from "@/components/media/ArchivePicture";
import { isBroadcastShelf } from "@/data/youtube";
import { TapeFrame } from "@/components/tapes/TapeFrame";
import { TapeObject } from "@/components/tapes/TapeObject";

export function ClipView({ clip, activeSegmentId }: { clip: ArchiveClip; activeSegmentId?: string }) {
  const loc = getLocation(clip.locationId);
  const tape = getTape(clip.sourceTapeId);
  const era = getEra(clip.era);
  const related = relatedClips(clip);
  const relatedCut = relatedCards(clip);
  const onTape = tape ? clipsOnTape(tape.id) : [];
  const loggedN = onTape.filter((c) => !isUnlogged(c)).length;
  const unloggedN = onTape.filter((c) => isUnlogged(c)).length;
  const unlogged = isUnlogged(clip);
  const closed = isClosed(clip) && !unlogged;
  const hold = closed ? holdFor(clip) : null;
  const people = clip.peopleIds.map((id) => getPerson(id)).filter((p): p is Person => Boolean(p));
  const tracks = clip.trackIds.map((id) => getTrack(id)).filter((t): t is Track => Boolean(t));
  const albums = clip.albumIds.map((id) => getAlbum(id)).filter((a): a is Album => Boolean(a));
  const projects = clip.projectIds.map((id) => getProject(id)).filter((p): p is Project => Boolean(p));
  const collections = clip.collectionIds
    .map((id) => getCollection(id))
    .filter((c): c is Collection => Boolean(c));
  const transcript = transcriptForClip(clip);
  const broadcast = Boolean(clip.youtubeId || (tape && isBroadcastShelf(tape.id)));

  return (
    <article className="mx-auto max-w-6xl px-4 pb-28 md:px-6">
      <p className="type-meta tracking-[0.16em]">
        {broadcast
          ? `PUBLIC BROADCAST · ${tape?.code ?? "CC-TV"} · ${formatDate(clip)}`
          : `FRAME ON TAPE · ${tape?.code ?? "UNFILED"} · ${formatDate(clip)}`}
      </p>

      <ClipStage
        cassette={
          tape ? (
            <Link href={`/tapes/${tape.id}`} className="block">
              <TapeObject tape={tape} logged={loggedN} unlogged={unloggedN} />
              <p className="type-meta mt-3">{tape.originalLabel}</p>
            </Link>
          ) : (
            <div />
          )
        }
        picture={
          closed ? (
            <ClipSleeve clip={clip} />
          ) : (
            <ArchivePicture clip={clip} large={Boolean(clip.youtubeId)} className="aspect-[4/3] w-full" />
          )
        }
        file={
          <div>
            <p className="font-cond text-[12px] tracking-[0.1em] text-leader">
              {closed ? hold?.status : unlogged ? "UNLOGGED" : broadcast ? "PUBLIC BROADCAST" : "LOGGED FRAME"}
            </p>
            <h1
              className={`mt-2 leading-none text-paper ${
                unlogged ? "font-mono text-2xl tracking-[0.16em] md:text-3xl" : "font-display text-4xl md:text-6xl"
              }`}
            >
              {unlogged ? clipTechnical(clip, tape?.code) : clipHeading(clip)}
            </h1>
            {unlogged ? null : (
              <p className="type-meta mt-3">
                {clipTechnical(clip, tape?.code)}
              </p>
            )}
            {unlogged ? null : (
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-bone">{clip.description}</p>
            )}
            {hold ? (
              <p className="mt-4 max-w-xl font-mono text-[12px] tracking-[0.08em] text-dust">{hold.line}</p>
            ) : null}
            {(related.before || related.after) && (
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-cond text-[12px] tracking-[0.16em]">
                {related.before ? (
                  <Link href={`/clip/${related.before.slug}`} className="text-dust hover:text-paper">
                    BEFORE · {related.before.startTimecode}
                  </Link>
                ) : null}
                {related.after ? (
                  <Link href={`/clip/${related.after.slug}`} className="text-dust hover:text-paper">
                    AFTER · {related.after.startTimecode}
                  </Link>
                ) : null}
              </div>
            )}
            {tape ? (
              <Link
                href={`/tapes/${tape.id}`}
                className="mt-6 inline-block font-cond text-[13px] tracking-[0.18em] text-paper underline underline-offset-4"
              >
                {isBroadcastShelf(tape.id) ? `OPEN THE SHELF · ${tape.code}` : `OPEN THE CASSETTE · ${tape.code}`}
              </Link>
            ) : null}
          </div>
        }
      />

      {onTape.length && !(tape && isBroadcastShelf(tape.id)) ? (
        <section className="relative mt-16">
          <p className="font-cond text-[12px] tracking-[0.1em] text-dust">ON THIS CASSETTE · {tape?.code}</p>
          <div className="story-reel mt-5">
            <div className="film-perfs hidden md:block" aria-hidden />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {onTape.map((frame) => (
                <TapeFrame key={frame.id} clip={frame} current={frame.id === clip.id} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ClipDossier
        people={people}
        location={loc}
        locationHref={loc ? `/places/${loc.slug}` : `/archive?location=${clip.locationId}`}
        tracks={tracks}
        albums={albums}
        projects={projects}
        collections={collections}
        era={era}
        clip={clip}
      />

      {transcript ? (
        <TranscriptDossier clip={clip} transcript={transcript} activeSegmentId={activeSegmentId} />
      ) : null}

      {relatedCut.length ? (
        <section className="mt-20">
          <p className="font-cond text-[12px] tracking-[0.1em] text-dust">RELATED</p>
          <RelatedReveal>
            {relatedCut.map((c) => (
              <RelatedFrame key={c.id} from={clip} clip={c} />
            ))}
          </RelatedReveal>
        </section>
      ) : null}
    </article>
  );
}
