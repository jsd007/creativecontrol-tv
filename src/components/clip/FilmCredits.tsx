import Link from "next/link";
import { getPerson } from "@/data";
import type { ArchiveClip, Person } from "@/data/types";
import { creditRoleKey } from "@/lib/credits";

/** Display publisher credits verbatim, linking only people identified by explicit IDs. */
export function FilmCredits({ clip }: { clip: ArchiveClip }) {
  if (!clip.credits?.length) return null;
  return (
    <dl className="space-y-3 text-[14px] leading-snug text-bone">
      {clip.credits.map((credit) => {
        const people = (credit.personIds ?? []).map(getPerson).filter((person): person is Person => Boolean(person));
        return (
          <div key={`${credit.role}-${credit.name}`}>
            <dt className="type-label">{credit.role.toUpperCase()}</dt>
            <dd className="mt-1">
              {people.length === 1 ? (
                <Link href={`/people/${people[0].slug}?role=${creditRoleKey(credit.role)}`} className="underline decoration-paper/30 underline-offset-4 hover:text-leader hover:decoration-leader">
                  {credit.name}
                </Link>
              ) : people.length > 1 ? (
                <>
                  {people.map((person, index) => (
                    <span key={person.id}>
                      {index ? <span className="text-dust"> &amp; </span> : null}
                      <Link href={`/people/${person.slug}?role=${creditRoleKey(credit.role)}`} className="underline decoration-paper/30 underline-offset-4 hover:text-leader hover:decoration-leader">
                        {person.shortName}
                      </Link>
                    </span>
                  ))}
                  {credit.name !== people.map((person) => person.shortName).join(" & ") ? <span className="mt-1 block text-[12px] text-dust">Credited as {credit.name}</span> : null}
                </>
              ) : credit.name}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
