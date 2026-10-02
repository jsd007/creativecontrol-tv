import Link from "next/link";
import { journeysForClip, journeyTvHref } from "@/lib/viewingJourneys";

export function ClipJourneys({ clipId, returnHref }: { clipId: string; returnHref?: string }) {
  const journeys = journeysForClip(clipId);
  if (!journeys.length) return null;
  const currentSearch = returnHref?.startsWith("/tv?") ? returnHref.slice(4) : "";
  return (
    <section aria-labelledby="clip-journey-heading" className="mt-10 border-y border-paper/15 py-5">
      <p className="type-label text-leader">WATCH IN CONTEXT</p>
      <h2 id="clip-journey-heading" className="sr-only">Viewing journeys featuring this clip</h2>
      <div className="mt-3 space-y-4">
        {journeys.map((journey) => {
          const href = journeyTvHref(journey, currentSearch, clipId);
          return href ? (
            <div key={journey.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <div>
                <p className="font-display text-2xl leading-none text-paper">{journey.title}</p>
                <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-dust">Part {journey.clipIds.indexOf(clipId) + 1} of {journey.clips.length}. {journey.description}</p>
              </div>
              <Link href={href} className="inline-flex min-h-11 items-center border border-paper/20 px-4 font-cond text-[13px] tracking-[0.08em] text-leader hover:border-leader">OPEN THIS JOURNEY IN TV →</Link>
            </div>
          ) : null;
        })}
      </div>
    </section>
  );
}
