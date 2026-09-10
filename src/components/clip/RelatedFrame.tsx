import Link from "next/link";
import { getLocation, getTape } from "@/data";
import type { ArchiveClip } from "@/data/types";
import { HeldFrame } from "@/components/media/HeldFrame";
import { PrototypeMedia } from "@/components/media/PrototypeMedia";
import { clipHeading, clipTechnical, isUnlogged } from "@/lib/clipDisplay";
import { formatDate } from "@/lib/format";
import { isClosed } from "@/lib/visibility";
import { relatedAxis } from "@/components/clip/relatedAxis";

export function RelatedFrame({ from, clip }: { from: ArchiveClip; clip: ArchiveClip }) {
  const loc = getLocation(clip.locationId);
  const tape = getTape(clip.sourceTapeId);
  const unlogged = isUnlogged(clip);
  const closed = isClosed(clip) && !unlogged;
  const title = unlogged ? clipTechnical(clip, tape?.code) : clipHeading(clip);

  return (
    <article>
      <p className="font-cond text-[11px] tracking-[0.2em] text-leader">{relatedAxis(from, clip)}</p>
      <Link href={`/clip/${clip.slug}`} className="mt-3 block">
        {closed ? (
          <HeldFrame clip={clip} className="aspect-[4/3]" />
        ) : (
          <PrototypeMedia clip={clip} className="aspect-[4/3]" />
        )}
        <h3
          className={`mt-3 leading-none text-paper hover:text-leader ${
            unlogged ? "font-mono text-[13px] tracking-[0.14em]" : "font-display text-[26px] md:text-[30px]"
          }`}
        >
          {title}
        </h3>
      </Link>
      <p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-dust">
        {formatDate(clip)}
        {loc ? ` · ${loc.name.toUpperCase()}` : ""}
      </p>
    </article>
  );
}
