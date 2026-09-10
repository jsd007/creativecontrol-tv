import Link from "next/link";
import { getLocation, getPerson, getTape } from "@/data";
import type { ArchiveClip } from "@/data/types";
import { HoldingLine } from "@/components/archive/HoldingLine";
import { clipHeading, isUnlogged } from "@/lib/clipDisplay";
import { MONTHS_SHORT, parseArchiveDate, visibilityLabel } from "@/lib/format";
import { holdingLead, isOfficialHolding } from "@/lib/holdings";
import { isClosed } from "@/lib/visibility";

function sheetWhen(clip: ArchiveClip) {
  if (isUnlogged(clip)) return clip.startTimecode;
  const exact = parseArchiveDate(clip.dateExact);
  if (exact) return `${MONTHS_SHORT[exact.month - 1]} ${exact.day}`;
  if (clip.dateApproximate) {
    const rest = clip.dateApproximate.toUpperCase().replace(String(clip.year), "").trim();
    return rest || "—";
  }
  return "—";
}

function sortSheet(clips: ArchiveClip[]) {
  return [...clips].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    const aExact = a.dateExact ?? "";
    const bExact = b.dateExact ?? "";
    if (aExact && bExact && aExact !== bExact) return aExact.localeCompare(bExact);
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    const aApprox = a.dateApproximate ?? "";
    const bApprox = b.dateApproximate ?? "";
    if (aApprox !== bApprox) return aApprox.localeCompare(bApprox);
    if (a.startTimecode !== b.startTimecode) return a.startTimecode.localeCompare(b.startTimecode);
    return clipHeading(a).localeCompare(clipHeading(b));
  });
}

function groupByYear(clips: ArchiveClip[]) {
  const groups: { year: number; clips: ArchiveClip[] }[] = [];
  for (const clip of sortSheet(clips)) {
    const last = groups.at(-1);
    if (!last || last.year !== clip.year) groups.push({ year: clip.year, clips: [clip] });
    else last.clips.push(clip);
  }
  return groups;
}

/** Unfiltered index: official uploads are a year through-line, not a 366-card wall. */
function collapseHoldings(clips: ArchiveClip[]) {
  const house = clips.filter((c) => !isOfficialHolding(c));
  const seen = new Set<number>();
  const leads: ArchiveClip[] = [];
  for (const clip of sortSheet(clips)) {
    if (!isOfficialHolding(clip) || seen.has(clip.year)) continue;
    const lead = holdingLead(clips.filter((c) => c.year === clip.year));
    if (lead) {
      seen.add(clip.year);
      leads.push(lead);
    }
  }
  return sortSheet([...house, ...leads]);
}

function stampFor(clip: ArchiveClip) {
  if (isUnlogged(clip)) return "";
  if (isClosed(clip)) return visibilityLabel(clip.visibility);
  return "";
}

function IndexRow({ clip }: { clip: ArchiveClip }) {
  const loc = getLocation(clip.locationId);
  const tape = getTape(clip.sourceTapeId);
  const people = clip.peopleIds.map((id) => getPerson(id)?.shortName).filter(Boolean).slice(0, 3);
  const unlogged = isUnlogged(clip);
  const stamp = stampFor(clip);
  const subjects = people.length ? people.join(" · ") : clip.cameraCredit;
  const paperHold = clip.visibility === "MEMBERS_ONLY";

  return (
    <article className="index-row group border-t border-paper/10 py-3.5 md:grid md:grid-cols-[4.75rem_5.75rem_7.25rem_minmax(12rem,1.4fr)_minmax(7rem,0.7fr)_minmax(8rem,0.85fr)_7.5rem] md:items-baseline md:gap-x-5">
      <div className="flex flex-wrap items-baseline gap-x-2 md:contents">
        <p className="type-meta">{sheetWhen(clip)}</p>
        {tape ? (
          <Link href={`/tapes/${tape.id}`} className="type-code hover:text-paper">
            {tape.code}
          </Link>
        ) : (
          <span className="type-code">—</span>
        )}
        <p className="type-label">{unlogged ? "—" : clip.type.toUpperCase()}</p>
      </div>
      <Link href={`/clip/${clip.slug}`} className="mt-1.5 min-w-0 md:mt-0">
        <h3
          className={`leading-none group-hover:text-leader ${
            unlogged ? "font-mono text-[13px] tracking-[0.16em] text-dust" : "font-display text-[22px] text-paper md:text-[24px]"
          }`}
        >
          {unlogged ? "UNLOGGED" : clipHeading(clip)}
        </h3>
      </Link>
      <div className="mt-1.5 flex items-baseline justify-between gap-3 md:mt-0 md:contents">
        <p className="type-label">
          {loc ? (
            <Link href={`/places/${loc.slug}`} className="hover:text-paper">
              {loc.name}
            </Link>
          ) : (
            "—"
          )}
        </p>
        <p className="type-label">{subjects || "—"}</p>
        <p
          className={`font-mono text-[10px] tracking-[0.14em] md:text-right ${
            paperHold ? "text-paper" : stamp ? "text-leader" : "text-transparent"
          }`}
        >
          {stamp || "\u00a0"}
        </p>
      </div>
    </article>
  );
}

export function IndexSheet({
  clips,
  collapseOfficial = false,
  onYear,
}: {
  clips: ArchiveClip[];
  collapseOfficial?: boolean;
  onYear?: (year: number) => void;
}) {
  const groups = groupByYear(collapseOfficial ? collapseHoldings(clips) : clips);
  if (!groups.length) return null;

  return (
    <section className="mt-8" aria-label="Index">
      {groups.map((group) => (
        <div key={group.year} className="mt-14 first:mt-0">
          {onYear ? (
            <h2 className="font-display text-4xl leading-none text-paper md:text-5xl">
              <button type="button" onClick={() => onYear(group.year)} className="hover:text-leader">
                {group.year}
              </button>
            </h2>
          ) : (
            <h2 className="font-display text-4xl leading-none text-paper md:text-5xl">{group.year}</h2>
          )}
          <ol className="mt-5 list-none">
            {group.clips.map((clip) => (
              <li key={clip.id}>
                {isOfficialHolding(clip) ? <HoldingLine clip={clip} /> : <IndexRow clip={clip} />}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
