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
import { formatDate, publicMediaKind } from "@/lib/format";
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
import { clipHref, tapeHref } from "@/lib/lensNavigation";

export function ClipView({ clip, activeSegmentId, returnHref }: { clip: ArchiveClip; activeSegmentId?: string; returnHref?: string }) {
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
  const projectReference = clip.contentState === "project-reference";
  const broadcast = !projectReference && Boolean(clip.youtubeId || (tape && isBroadcastShelf(tape.id)));
  const publicSource = clip.publicSource;
  const sourceLabel = publicSource?.publisher.toUpperCase() ?? tape?.code ?? "CC-TV";
  const recordLabel = projectReference ? "PROJECT REFERENCE" : broadcast ? (publicSource?.kind === "trailer" ? "PUBLIC TRAILER" : "PUBLIC BROADCAST") : "FRAME ON TAPE";
  const dossier = (
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
  );

  if (projectReference) {
    return (
      <article className="mx-auto max-w-6xl px-4 pb-28 md:px-6">
        <p className="type-meta tracking-[0.16em]">PROJECT REFERENCE · {formatDate(clip)}</p>
        <header className="mt-8 max-w-3xl border-y border-paper/15 py-8 md:py-12">
          <h1 className="font-display text-4xl leading-none text-paper md:text-6xl">{clipHeading(clip)}</h1>
          <p className="mt-6 text-[17px] leading-relaxed text-bone">{clip.description}</p>
          <PublicProjectNotes clip={clip} projects={projects} />
          {publicSource ? (
            <a href={publicSource.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center font-cond text-[13px] tracking-[0.1em] text-leader underline underline-offset-4">
              OPEN OFFICIAL PROJECT SITE <span className="ml-2" aria-hidden>↗</span>
            </a>
          ) : null}
          <p className="mt-3 font-mono text-[11px] leading-relaxed text-dust">PUBLIC PROJECT INFORMATION · No trailer or private archive footage is represented here.</p>
        </header>
        {dossier}
        {relatedCut.length ? (
          <section className="mt-16">
            <p className="type-label">CONNECTED PROJECTS & STORIES</p>
            <RelatedReveal>{relatedCut.map((c) => <RelatedFrame key={c.id} from={clip} clip={c} returnHref={returnHref} />)}</RelatedReveal>
          </section>
        ) : null}
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-6xl px-4 pb-28 md:px-6">
      <p className="type-meta tracking-[0.16em]">
        {recordLabel} · {broadcast || projectReference ? sourceLabel : tape?.code ?? "UNFILED"} · {formatDate(clip)}
      </p>

      <ClipStage
        cassette={
          tape ? (
            <Link href={tapeHref(tape.id, returnHref)} className="block">
              <TapeObject tape={tape} logged={loggedN} unlogged={unloggedN} />
              <p className="type-meta mt-3">{tape.originalLabel}</p>
            </Link>
          ) : null
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
              {closed ? hold?.status : unlogged ? "UNLOGGED" : projectReference ? "PROJECT REFERENCE" : broadcast ? recordLabel : "LOGGED FRAME"}
            </p>
            <h1
              className={`mt-2 leading-none text-paper ${
                unlogged ? "font-mono text-2xl tracking-[0.16em] md:text-3xl" : "font-display text-4xl md:text-6xl"
              }`}
            >
              {unlogged ? clipTechnical(clip, tape?.code) : clipHeading(clip)}
            </h1>
            {unlogged || !tape ? null : (
              <p className="type-meta mt-3">
                {clipTechnical(clip, tape?.code)}
              </p>
            )}
            {unlogged ? null : (
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-bone">{clip.description}</p>
            )}
            <PublicProjectNotes clip={clip} projects={projects} />
            {publicSource ? (
              <div className="mt-5 max-w-xl">
                <a href={publicSource.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-cond text-[13px] tracking-[0.1em] text-leader underline underline-offset-4">
                  VIEW ORIGINAL · {publicSource.publisher.toUpperCase()} <span className="ml-2" aria-hidden>↗</span>
                </a>
                <p className="font-mono text-[11px] leading-relaxed text-dust">
                  {projectReference ? "Public project credit. No archive footage is represented here." : `Public ${publicMediaKind(clip)} from the named publisher. Not a private archive holding.`}
                  {publicSource.published ? ` Published ${publicSource.published}.` : ""}
                </p>
                {clip.dateNote ? <p className="mt-2 font-mono text-[11px] leading-relaxed text-dust">{clip.dateNote}</p> : null}
              </div>
            ) : null}
            {hold ? (
              <p className="mt-4 max-w-xl font-mono text-[12px] tracking-[0.08em] text-dust">{hold.line}</p>
            ) : null}
            {(related.before || related.after) && (
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-cond text-[12px] tracking-[0.16em]">
                {related.before ? (
                  <Link href={clipHref(related.before.slug, returnHref)} className="text-dust hover:text-paper">
                    BEFORE · {related.before.startTimecode}
                  </Link>
                ) : null}
                {related.after ? (
                  <Link href={clipHref(related.after.slug, returnHref)} className="text-dust hover:text-paper">
                    AFTER · {related.after.startTimecode}
                  </Link>
                ) : null}
              </div>
            )}
            {tape ? (
              <Link
                href={tapeHref(tape.id, returnHref)}
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
                <TapeFrame key={frame.id} clip={frame} current={frame.id === clip.id} returnHref={returnHref} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {dossier}

      {transcript ? (
        <TranscriptDossier clip={clip} transcript={transcript} activeSegmentId={activeSegmentId} returnHref={returnHref} />
      ) : null}

      {relatedCut.length ? (
        <section className="mt-20">
          <p className="font-cond text-[12px] tracking-[0.1em] text-dust">RELATED</p>
          <RelatedReveal>
            {relatedCut.map((c) => (
              <RelatedFrame key={c.id} from={clip} clip={c} returnHref={returnHref} />
            ))}
          </RelatedReveal>
        </section>
      ) : null}
    </article>
  );
}

function PublicProjectNotes({ clip, projects }: { clip: ArchiveClip; projects: Project[] }) {
  if (!clip.publicSource) return null;
  return (
    <div className="mt-5 max-w-xl border-t border-paper/10 pt-4">
      {clip.credits?.length ? (
        <dl className="space-y-2 text-[14px] leading-snug text-bone">
          {clip.credits.map((credit) => (
            <div key={`${credit.role}-${credit.name}`}>
              <dt className="type-label">{credit.role.toUpperCase()}</dt>
              <dd className="mt-0.5">{credit.name}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {projects.map((project) => project.dateNote ? <p key={project.id} className="mt-4 text-[13px] leading-relaxed text-dust">{project.dateNote}</p> : null)}
    </div>
  );
}
