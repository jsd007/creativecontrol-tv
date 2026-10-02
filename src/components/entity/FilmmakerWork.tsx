import Image from "next/image";
import Link from "next/link";
import type { ArchiveClip, Person } from "@/data/types";
import { youtubeThumbnail } from "@/data/youtube";
import { creditedPublicWork, creditRoleKey, creditRolesForPerson, creditsForPerson } from "@/lib/credits";
import { formatDate } from "@/lib/format";

function WorkCard({ clip, person }: { clip: ArchiveClip; person: Person }) {
  const credits = creditsForPerson(clip, person.id);
  return (
    <article className="min-w-0">
      <Link href={`/clip/${clip.slug}`} className="group block">
        <div className="relative aspect-video overflow-hidden border border-paper/10 bg-ink">
          <Image src={youtubeThumbnail(clip.youtubeId!)} alt="" width={480} height={360} unoptimized className="h-full w-full object-cover transition-opacity group-hover:opacity-85" />
          <span className="absolute bottom-2 left-2 bg-void/90 px-2 py-1 font-mono text-[9px] tracking-[0.1em] text-paper">PUBLIC SOURCE</span>
        </div>
        <h3 className="mt-3 font-display text-[26px] leading-none text-paper group-hover:text-leader">{clip.title}</h3>
      </Link>
      <p className="mt-2 font-mono text-[10px] leading-relaxed text-dust">{formatDate(clip)}</p>
      <p className="mt-2 font-cond text-[13px] leading-snug tracking-[0.04em] text-leader">{credits.map((credit) => credit.role).join(" · ")}</p>
      {clip.publicSource ? (
        <a href={clip.publicSource.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-[12px] leading-snug text-dust underline decoration-paper/20 underline-offset-4 hover:text-paper">
          Source: {clip.publicSource.publisher}<span className="ml-1" aria-hidden>↗</span>
        </a>
      ) : null}
    </article>
  );
}

export function FilmmakerWork({ person, clips, activeRole }: { person: Person; clips: ArchiveClip[]; activeRole?: string }) {
  const works = creditedPublicWork(clips, person.id);
  if (!works.length) return null;
  const roles = creditRolesForPerson(works, person.id);
  const selected = roles.some((role) => role.key === activeRole) ? activeRole : undefined;
  const filtered = selected ? works.filter((clip) => creditsForPerson(clip, person.id).some((credit) => creditRoleKey(credit.role) === selected)) : works;
  const featured = filtered.slice(0, 8);
  const remaining = filtered.slice(8);

  return (
    <section id="made-by" aria-labelledby="made-by-heading" className="mt-14 border-y border-paper/15 py-8 md:mt-16 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="type-label text-leader">MADE BY</p>
          <h2 id="made-by-heading" className="mt-2 font-display text-4xl leading-none text-paper md:text-5xl">{person.shortName}&apos;s credited work.</h2>
        </div>
        <p className="font-mono text-[11px] tracking-[0.08em] text-dust">{works.length} VERIFIED PUBLIC WORK{works.length === 1 ? "" : "S"}</p>
      </div>
      <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-bone/70">Explore the contribution, not just the on-screen appearances. Each piece keeps the original publisher&apos;s credit and source.</p>

      <nav aria-label={`${person.shortName}'s credited roles`} className="mt-6 flex flex-wrap gap-2">
        <Link href={`/people/${person.slug}#made-by`} aria-current={!selected ? "page" : undefined} className={`inline-flex min-h-11 items-center gap-2 border px-3 font-cond text-[12px] tracking-[0.08em] ${!selected ? "border-leader text-paper" : "border-paper/15 text-dust hover:border-paper/40 hover:text-paper"}`}>
          ALL WORK <span className="font-mono text-[10px] text-dust">{works.length}</span>
        </Link>
        {roles.map((role) => (
          <Link key={role.key} href={`/people/${person.slug}?role=${role.key}#made-by`} aria-current={selected === role.key ? "page" : undefined} className={`inline-flex min-h-11 items-center gap-2 border px-3 font-cond text-[12px] tracking-[0.08em] ${selected === role.key ? "border-leader text-paper" : "border-paper/15 text-dust hover:border-paper/40 hover:text-paper"}`}>
            {role.label.toUpperCase()} <span className="font-mono text-[10px] text-dust">{role.count}</span>
          </Link>
        ))}
      </nav>

      <p aria-live="polite" className="mt-5 font-mono text-[10px] tracking-[0.08em] text-dust">{filtered.length} WORK{filtered.length === 1 ? "" : "S"}{selected ? ` · ${roles.find((role) => role.key === selected)?.label.toUpperCase()}` : " · ALL CREDITED ROLES"}</p>
      <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((clip) => <WorkCard key={clip.id} clip={clip} person={person} />)}
      </div>
      {remaining.length ? (
        <details className="mt-8 border-t border-paper/10 pt-4">
          <summary className="min-h-11 cursor-pointer font-cond text-[13px] tracking-[0.12em] text-paper hover:text-leader">MORE VERIFIED WORK · {remaining.length}</summary>
          <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {remaining.map((clip) => <WorkCard key={clip.id} clip={clip} person={person} />)}
          </div>
        </details>
      ) : null}
    </section>
  );
}
