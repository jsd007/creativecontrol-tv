"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DeepField } from "@/components/constellation/DeepField";
import { HandField } from "@/components/constellation/HandField";
import { EASE_GATE, usePrefersReducedMotion } from "@/lib/motion";
import {
  STAR_KIND_LABEL,
  buildEntityGraph,
  constellationHref,
  constellationSpine,
  resolveConstellationCenter,
  weightLine,
  type StarNode,
} from "@/lib/constellation";

export function ConstellationView() {
  const search = useSearchParams();
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const center = resolveConstellationCenter(search.get("person"), search.get("place"), search.get("project"));
  const field = useMemo(() => buildEntityGraph(center.kind, center.id), [center.kind, center.id]);
  const spine = useMemo(() => constellationSpine(), []);
  const [hover, setHover] = useState<StarNode | null>(null);

  useEffect(() => {
    setHover(null);
  }, [center.kind, center.id]);

  function choosePerson(id: string) {
    router.replace(constellationHref("person", id), { scroll: false });
  }

  if (!field) {
    return (
      <div className="constellation-room px-4 pb-24 pt-4 md:px-6">
        <h1 className="sr-only">The Constellation</h1>
        <p className="font-mono text-[11px] tracking-[0.18em] text-dust">NO FRAMES</p>
      </div>
    );
  }

  const credit = hover ?? null;

  return (
    <div className="constellation-room relative min-h-[calc(100svh-3.5rem)] md:pb-8">
      <h1 className="sr-only">The Constellation</h1>
      <div className="constellation-head">
        <div>
          <p className="font-cond text-[12px] tracking-[0.28em] text-leader">THE CONSTELLATION</p>
          <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-dust">
            {credit
              ? `${STAR_KIND_LABEL[credit.kind]} · ${credit.axis}`
              : `${STAR_KIND_LABEL[field.center.kind]} · ${field.center.shortName.toUpperCase()}`}
          </p>
          {credit?.weight ? (
            <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-leader">{weightLine(credit.weight)}</p>
          ) : null}
          {credit?.via ? (
            <p className="constellation-credit mt-1 font-cond text-[13px] tracking-[0.08em] text-paper/80">
              {credit.via.label}
              {credit.via.year ? `  ·  ${credit.via.year}` : ""}
            </p>
          ) : credit ? (
            <p className="constellation-credit mt-1 font-cond text-[13px] tracking-[0.08em] text-paper/80">{credit.label}</p>
          ) : null}
        </div>
        <div className="hand-strip constellation-spine" role="tablist" aria-label="People">
          {spine.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={center.kind === "person" && p.id === center.id}
              onClick={() => choosePerson(p.id)}
              className={`font-cond text-[13px] tracking-[0.16em] ${
                center.kind === "person" && p.id === center.id ? "text-paper" : "text-dust hover:text-paper"
              }`}
            >
              {p.shortName.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="constellation-hand md:hidden">
        <HandField field={field} hover={hover} onHover={setHover} />
      </div>
      <div className="hidden md:block">
        <AnimatePresence mode={reduced ? "sync" : "wait"}>
          <motion.div
            key={`${field.center.kind}-${field.center.id}`}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18, ease: EASE_GATE }}
          >
            <DeepField field={field} reduced={reduced} hover={hover} onHover={setHover} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
