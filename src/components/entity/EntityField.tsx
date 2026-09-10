"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { getClip } from "@/data";
import type { ArchiveClip } from "@/data/types";
import { HeldFrame } from "@/components/media/HeldFrame";
import { PrototypeMedia } from "@/components/media/PrototypeMedia";
import { STAR_KIND_LABEL, weightLine, type Constellation, type StarNode } from "@/lib/constellation";
import { activateOnSpace } from "@/lib/keys";
import { houseGsap } from "@/lib/gsap";
import { GATE_EASE, usePrefersReducedMotion } from "@/lib/motion";
import { isClosed } from "@/lib/visibility";

function provingClip(node: StarNode): ArchiveClip | undefined {
  if (node.kind === "clip") return getClip(node.id);
  const slug = node.via?.href.startsWith("/clip/") ? node.via.href.slice("/clip/".length) : undefined;
  return slug ? getClip(slug) : undefined;
}

function EmptyAperture() {
  return (
    <div className="viewfinder viewfinder-br relative aspect-[4/3] w-full bg-ink">
      <div className="absolute inset-0 bg-[#0c0b09]" />
      <div className="absolute inset-[16%] border border-paper/10" />
    </div>
  );
}

function BondStill({ clip }: { clip: ArchiveClip }) {
  if (isClosed(clip)) return <HeldFrame clip={clip} className="aspect-[4/3] w-full" />;
  return <PrototypeMedia clip={clip} chrome="stamp" className="aspect-[4/3] w-full" />;
}

function Bond({
  node,
  dim,
  onEnter,
}: {
  node: StarNode;
  dim: boolean;
  onEnter: () => void;
}) {
  const clip = provingClip(node);
  const via = node.kind === "clip" ? undefined : node.via;
  const stillHref = clip ? `/clip/${clip.slug}` : node.href;

  return (
    <li
      className={`node-bond${dim ? " node-bond-dim" : ""}`}
      onMouseEnter={onEnter}
      onFocusCapture={onEnter}
    >
      <Link href={stillHref} className="node-bond-still block" onKeyDown={activateOnSpace}>
        {clip ? <BondStill clip={clip} /> : <EmptyAperture />}
      </Link>
      <div className="min-w-0">
        <p className="font-mono text-[10px] tracking-[0.22em] text-leader">
          {node.axis}
          {STAR_KIND_LABEL[node.kind] !== node.axis ? (
            <span className="text-dust"> · {STAR_KIND_LABEL[node.kind]}</span>
          ) : null}
        </p>
        <Link href={node.href} className="mt-3 block" onKeyDown={activateOnSpace}>
          <p className="font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-none text-paper hover:text-leader">
            {node.label}
          </p>
        </Link>
        {node.weight ? (
          <p className="mt-3 font-mono text-[11px] tracking-[0.16em] text-leader">{weightLine(node.weight)}</p>
        ) : null}
        {via ? (
          <Link href={via.href} className="mt-4 block max-w-md" onKeyDown={activateOnSpace}>
            <p className="font-mono text-[10px] tracking-[0.2em] text-dust">FIRST HELD BY</p>
            <p className="mt-2 font-cond text-[16px] tracking-[0.06em] text-bone/80 hover:text-paper">{via.label}</p>
            {via.year && !node.weight ? (
              <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-dust">{via.year}</p>
            ) : null}
          </Link>
        ) : node.year ? (
          <p className="mt-4 font-mono text-[10px] tracking-[0.16em] text-dust">{node.year}</p>
        ) : null}
      </div>
    </li>
  );
}

export function EntityField({ field }: { field: Constellation }) {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLOListElement>(null);
  const [hover, setHover] = useState<string | null>(null);

  useGSAP(
    () => {
      const list = root.current;
      if (!list || reduced) return;
      const { gsap } = houseGsap();
      const rows = list.querySelectorAll(".node-bond");
      gsap.fromTo(
        rows,
        { y: 16 },
        { y: 0, duration: 0.64, stagger: 0.07, ease: GATE_EASE, clearProps: "transform" },
      );
    },
    { dependencies: [field.center.kind, field.center.id, reduced], scope: root },
  );

  return (
    <ol
      ref={root}
      className="node-bonds mt-4 md:mt-6"
      onMouseLeave={() => setHover(null)}
    >
      {field.nodes.map((node) => {
        const key = `${node.kind}-${node.id}`;
        return (
          <Bond
            key={key}
            node={node}
            dim={Boolean(hover && hover !== key && !reduced)}
            onEnter={() => setHover(key)}
          />
        );
      })}
    </ol>
  );
}
