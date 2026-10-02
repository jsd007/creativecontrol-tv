import Link from "next/link";
import Image from "next/image";
import { getLocation, getTape } from "@/data";
import { youtubeThumbnail } from "@/data/youtube";
import type { ArchiveClip } from "@/data/types";
import { HeldFrame } from "@/components/media/HeldFrame";
import { PrototypeMedia } from "@/components/media/PrototypeMedia";
import { clipHeading, clipTechnical, isUnlogged } from "@/lib/clipDisplay";
import { formatDate } from "@/lib/format";
import { isClosed } from "@/lib/visibility";
import { relatedAxis } from "@/components/clip/relatedAxis";
import { clipHref } from "@/lib/lensNavigation";

export function RelatedFrame({ from, clip, returnHref }: { from: ArchiveClip; clip: ArchiveClip; returnHref?: string }) {
  const loc = getLocation(clip.locationId);
  const tape = getTape(clip.sourceTapeId);
  const unlogged = isUnlogged(clip);
  const closed = isClosed(clip) && !unlogged;
  const title = unlogged ? clipTechnical(clip, tape?.code) : clipHeading(clip);

  return (
    <article>
      <p className="font-cond text-[12px] tracking-[0.1em] text-leader">{relatedAxis(from, clip)}</p>
      <Link href={clipHref(clip.slug, returnHref)} className="mt-3 block">
        {clip.contentState === "project-reference" ? (
          <div className="border-y border-paper/15 py-6">
            <p className="type-label text-leader">PROJECT REFERENCE</p>
            <p className="mt-3 text-[13px] leading-relaxed text-dust">Public project information. No film footage is represented.</p>
          </div>
        ) : clip.youtubeId ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-ink">
            <Image src={youtubeThumbnail(clip.youtubeId)} alt="" width={480} height={360} unoptimized className="h-full w-full object-cover" />
            <p className="absolute inset-x-0 bottom-0 bg-void/90 px-3 py-2 font-mono text-[10px] leading-snug tracking-[0.06em] text-paper">
              {clip.publicSource?.kind === "trailer" ? "PUBLIC TRAILER" : "PUBLIC SOURCE"} · {clip.publicSource?.publisher ?? "Creative Control"}
            </p>
          </div>
        ) : closed ? (
          <HeldFrame clip={clip} className="aspect-[4/3]" />
        ) : (
          <PrototypeMedia clip={clip} chrome="stamp" className="aspect-[4/3]" />
        )}
        <h3
          className={`mt-3 leading-none text-paper hover:text-leader ${
            unlogged ? "font-mono text-[13px] tracking-[0.14em]" : "font-display text-[26px] md:text-[30px]"
          }`}
        >
          {title}
        </h3>
      </Link>
      <p className="mt-2 font-mono text-[12px] tracking-[0.08em] text-dust">
        {formatDate(clip)}
        {loc ? ` · ${loc.name.toUpperCase()}` : ""}
      </p>
    </article>
  );
}
