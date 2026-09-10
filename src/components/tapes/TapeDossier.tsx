import Link from "next/link";
import { HoldingLine } from "@/components/archive/HoldingLine";
import { clipsOnTape, getLocation } from "@/data";
import type { SourceTape } from "@/data/types";
import { isBroadcastShelf } from "@/data/youtube";
import { isUnlogged } from "@/lib/clipDisplay";
import { holdingsByYear } from "@/lib/holdings";
import { tapeHold } from "@/lib/visibility";
import { TapeFrame } from "./TapeFrame";
import { TapeObject } from "./TapeObject";

export function TapeDossier({ tape }: { tape: SourceTape }) {
  const clips = clipsOnTape(tape.id);
  const broadcast = isBroadcastShelf(tape.id);
  const logged = clips.filter((c) => !isUnlogged(c)).length;
  const unlogged = clips.length - logged;
  const loc = getLocation(tape.locationId);
  const hold = tapeHold(clips);
  const years = broadcast ? holdingsByYear(clips) : [];

  return (
    <div className="px-4 pb-24 md:px-6">
      <p className="pt-4 font-mono text-[11px] tracking-[0.18em] text-dust">
        <Link href="/tapes" className="hover:text-paper">
          THE TAPES
        </Link>{" "}
        / {tape.code}
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(220px,300px)_minmax(0,1fr)]">
        <div>
          <TapeObject
            tape={tape}
            size="hero"
            logged={broadcast ? undefined : logged}
            unlogged={broadcast ? undefined : unlogged}
          />
          <p className="mt-4 font-mono text-[10px] tracking-[0.14em] text-dust">
            {broadcast
              ? `PUBLIC BROADCAST · ${tape.format} · YOUTUBE`
              : `CAMERA ORIGINAL · ${tape.format} · ${tape.digitizationStatus}`}
          </p>
        </div>
        <div className="bg-paper px-6 py-7 text-void md:px-8">
          <p className="font-mono text-[10px] tracking-[0.18em] text-void/55">
            {tape.code} · {tape.format} · {tape.digitizationStatus}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-none md:text-5xl">{tape.originalLabel}</h1>
          {hold ? (
            <p className="mt-4 font-cond text-[13px] tracking-[0.18em] text-void/55">
              {hold.status}
              {hold.all ? " · THIS CASSETTE" : " ON THIS CASSETTE"}
            </p>
          ) : null}
          {tape.notes ? <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-void/70">{tape.notes}</p> : null}

          <dl className="mt-8 grid gap-4 border-t border-void/15 pt-6 font-mono text-[11px] tracking-[0.08em] sm:grid-cols-2">
            <div>
              <dt className="text-void/45">RECORDED</dt>
              <dd>{tape.recordedApproximate ?? tape.recordedDate}</dd>
            </div>
            <div>
              <dt className="text-void/45">PLACE</dt>
              <dd>{loc?.name}</dd>
            </div>
            <div>
              <dt className="text-void/45">CAMERA</dt>
              <dd>{tape.camera}</dd>
            </div>
            <div>
              <dt className="text-void/45">DURATION</dt>
              <dd>{broadcast ? "UNKNOWN" : `${tape.durationMinutes} MIN`}</dd>
            </div>
            <div>
              <dt className="text-void/45">PHYSICAL</dt>
              <dd>{tape.physicalLocation}</dd>
            </div>
            <div>
              <dt className="text-void/45">PROVENANCE</dt>
              <dd>{tape.provenance}</dd>
            </div>
          </dl>
        </div>
      </div>

      {broadcast ? (
        <section className="mt-14">
          <p className="font-cond text-[12px] tracking-[0.22em] text-dust">HOLDINGS</p>
          {years.map((group) => (
            <div key={group.year} className="mt-10 first:mt-6">
              <h2 className="font-display text-4xl leading-none text-paper">{group.year}</h2>
              <ol className="mt-4 list-none">
                {group.clips.map((clip) => (
                  <li key={clip.id}>
                    <HoldingLine clip={clip} />
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>
      ) : (
        <section className="mt-14">
          <p className="font-cond text-[12px] tracking-[0.22em] text-dust">
            CONTACT SHEET · {logged} LOGGED · {unlogged} UNLOGGED
            {hold ? ` · ${hold.count} HELD` : ""}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {clips.map((clip) => (
              <TapeFrame key={clip.id} clip={clip} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
