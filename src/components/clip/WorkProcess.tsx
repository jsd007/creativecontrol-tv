import Link from "next/link";
import { clipHref } from "@/lib/lensNavigation";
import { workProcessForClip } from "@/lib/workProcess";

export function WorkProcess({ clipId, returnHref }: { clipId: string; returnHref?: string }) {
  const story = workProcessForClip(clipId);
  if (!story) return null;
  return (
    <section aria-label={`${story.title}: work and process`} className="mt-7 border-y border-paper/15 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <p className="font-cond text-[12px] tracking-[0.12em] text-dust">WORK & PROCESS · {story.title.toUpperCase()}</p>
        <nav aria-label="Choose the work or its process" className="flex flex-wrap gap-2">
          {story.parts.map((part) => (
            <Link key={part.clipId} href={clipHref(part.clip.slug, returnHref)} aria-current={part.clipId === clipId ? "page" : undefined}
              className={`inline-flex min-h-11 items-center border px-4 font-cond text-[13px] tracking-[0.07em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leader ${part.clipId === clipId ? "border-leader bg-leader/10 text-leader" : "border-paper/15 text-bone hover:border-paper/40 hover:text-paper"}`}>
              {part.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-dust">{story.note}</p>
    </section>
  );
}
