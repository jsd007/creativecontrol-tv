"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { catalog, clipsOnTape, getLocation } from "@/data";
import type { ArchiveClip, SourceTape } from "@/data/types";
import { clipHeading, isUnlogged } from "@/lib/clipDisplay";
import { isAuthored } from "@/lib/visibility";
import { shelfOf } from "./TapeShelf";
import { TapeObject } from "./TapeObject";

type Scope = "ALL" | "CAMERA" | "DIGITAL";

const STARTERS = ["t-0217", "t-0004", "t-0088", "t-0301", "t-0412", "t-0550", "t-0702", "t-0900"];
const SCOPES: { id: Scope; label: string }[] = [
  { id: "ALL", label: "ALL SOURCES" },
  { id: "CAMERA", label: "CAMERA ORIGINALS" },
  { id: "DIGITAL", label: "DIGITAL & PHONE" },
];

function isCamera(tape: SourceTape) {
  return shelfOf(tape) === "storage";
}

function onTape(tape: SourceTape): ArchiveClip[] {
  return clipsOnTape(tape.id).filter((clip) => isAuthored(clip) && !isUnlogged(clip));
}

function relatedTo(tape: SourceTape, excluding: Set<string>): ArchiveClip[] {
  const city = getLocation(tape.locationId)?.city;
  return catalog.clips
    .filter((clip) => {
      if (!isAuthored(clip) || isUnlogged(clip) || excluding.has(clip.id)) return false;
      const sameCity = getLocation(clip.locationId)?.city === city;
      return sameCity && Math.abs(clip.year - tape.year) <= 5;
    })
    .sort((a, b) => Number(Boolean(b.youtubeId)) - Number(Boolean(a.youtubeId)) || Math.abs(a.year - tape.year) - Math.abs(b.year - tape.year))
    .slice(0, 5);
}

export function TapeExplorer() {
  const router = useRouter();
  const search = useSearchParams();
  const [scope, setScope] = useState<Scope>("ALL");
  const [find, setFind] = useState("");
  const [showAll, setShowAll] = useState(false);
  const fileRef = useRef<HTMLElement>(null);
  const openedRef = useRef<string | null>(null);
  const allTapes = useMemo(() => catalog.tapes.filter((tape) => tape.id !== "t-broadcast"), []);
  const requested = search.get("open");
  const needle = find.trim().toLowerCase();
  const filtered = allTapes.filter((tape) => {
    if (scope === "CAMERA" && !isCamera(tape)) return false;
    if (scope === "DIGITAL" && isCamera(tape)) return false;
    if (!needle) return true;
    const place = getLocation(tape.locationId)?.name ?? "";
    return `${tape.code} ${tape.originalLabel} ${tape.format} ${place} ${tape.year}`.toLowerCase().includes(needle);
  });
  const selected = filtered.find((tape) => tape.id === requested) ?? filtered[0];
  const starters = STARTERS.map((id) => allTapes.find((tape) => tape.id === id)).filter((tape): tape is SourceTape => Boolean(tape));
  const visible = scope !== "ALL" || needle || showAll
    ? filtered
    : selected && !starters.some((tape) => tape.id === selected.id) ? [selected, ...starters.slice(0, 7)] : starters;
  const held = selected ? onTape(selected) : [];
  const related = selected ? relatedTo(selected, new Set(held.map((clip) => clip.id))) : [];

  useEffect(() => {
    if (!requested || requested === openedRef.current) return;
    openedRef.current = requested;
    if (window.matchMedia("(max-width: 1000px)").matches) {
      fileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [requested]);

  function choose(tape: SourceTape) {
    const next = new URLSearchParams(search.toString());
    next.set("open", tape.id);
    router.replace(`/tapes?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="tape-explorer">
      <header className="tape-explorer-head">
        <p className="type-label text-leader">THE TAPES</p>
        <h1>A source, then its story.</h1>
        <p>Choose a source to see the frames and connected stories it could hold.</p>
        <p className="tape-explorer-truth">CONCEPT INVENTORY · Labels and unapproved frames are illustrative. Public films are marked.</p>
      </header>

      <div className="tape-explorer-tools">
        <div role="group" aria-label="Source type">
          {SCOPES.map((item) => (
            <button key={item.id} type="button" aria-pressed={scope === item.id} onClick={() => setScope(item.id)}>{item.label}</button>
          ))}
        </div>
        <label>
          <span className="sr-only">Find a tape</span>
          <input type="search" value={find} onChange={(event) => setFind(event.target.value)} placeholder="Find a code, place, year…" />
        </label>
      </div>

      <div className="tape-explorer-layout">
        <section className="tape-explorer-list" aria-label="Source tapes">
          <div className="tape-explorer-list-head">
            <h2>{scope === "ALL" ? "SELECT A SOURCE" : scope === "CAMERA" ? "CAMERA ORIGINALS" : "DIGITAL & PHONE"}</h2>
            <p>{visible.length} {visible.length === 1 ? "SOURCE" : "SOURCES"}</p>
          </div>
          {visible.length ? visible.map((tape) => {
            const place = getLocation(tape.locationId);
            return (
              <button key={tape.id} type="button" aria-pressed={selected?.id === tape.id} onClick={() => choose(tape)} className="tape-source-row">
                <span className="tape-source-code">{tape.code}</span>
                <span className="tape-source-main"><strong>{tape.originalLabel}</strong><small>{place?.name ?? "Place unconfirmed"} · {tape.format}</small></span>
                <span className="tape-source-year">{tape.year}</span>
              </button>
            );
          }) : <p className="tape-explorer-empty">No sources match this search.</p>}
          {scope === "ALL" && !needle && !showAll ? (
            <button className="tape-explorer-all" type="button" onClick={() => setShowAll(true)}>VIEW ALL {allTapes.length} CONCEPT SOURCES <span aria-hidden>→</span></button>
          ) : null}
        </section>

        {selected ? (
          <section ref={fileRef} className="tape-explorer-file" aria-label={`${selected.code} file`}>
            <div className="tape-explorer-file-top">
              <div className="tape-explorer-object"><TapeObject tape={selected} size="hero" /></div>
              <div className="tape-explorer-file-copy">
                <p className="type-code">CONCEPT SOURCE · {selected.code} · {selected.format}</p>
                <h2>{selected.originalLabel}</h2>
                <p>{getLocation(selected.locationId)?.name ?? "Place unconfirmed"} · {selected.recordedApproximate ?? selected.recordedDate}</p>
                <p className="tape-explorer-note">{selected.notes}</p>
                <Link href={`/tapes/${selected.id}`} className="tape-explorer-open">OPEN THE SOURCE FILE <span aria-hidden>→</span></Link>
              </div>
            </div>
            <div className="tape-explorer-related">
              <h3>IN THIS EXAMPLE FILE</h3>
              {held.length ? held.slice(0, 4).map((clip) => <TapeClipLine key={clip.id} clip={clip} />) : <p className="tape-explorer-empty">No individually described frames yet.</p>}
              {related.length ? <h3>NEARBY IN THE CONCEPT INDEX</h3> : null}
              {related.map((clip) => <TapeClipLine key={clip.id} clip={clip} />)}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function TapeClipLine({ clip }: { clip: ArchiveClip }) {
  return (
    <Link href={`/clip/${clip.slug}`} className="tape-clip-line">
      <span>{clip.year}</span>
      <strong>{clipHeading(clip)}</strong>
      <small>{clip.youtubeId ? "PUBLIC SOURCE" : "EXAMPLE ENTRY"}</small>
    </Link>
  );
}
