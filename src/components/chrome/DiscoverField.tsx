"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { discoveryDoors, type DiscoveryDoor } from "@/lib/discovery";
import { activateOnSpace, isTypingTarget } from "@/lib/keys";
import { playStatic } from "@/lib/sound";

const STABLE = discoveryDoors(17);

export function DiscoverField({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const [doors, setDoors] = useState<DiscoveryDoor[]>(STABLE);
  const lead = useRef<HTMLAnchorElement>(null);
  const last = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) setDoors(discoveryDoors(Date.now()));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    last.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => last.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (open) lead.current?.focus({ preventScroll: true });
  }, [open, doors]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open || isTypingTarget(e.target)) return;
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div id="discover-field" className="discover-field" role="dialog" aria-modal="true" aria-label="Discover">
      <div className="discover-veil" aria-hidden onClick={() => onOpenChange(false)} />
      <div className="discover-offer">
        <ol className="discover-sleeves">
          {doors.map((door) => (
            <li key={door.id} className={`discover-sleeve ${door.id === "tape" ? "is-lead" : ""}`}>
              <Link
                ref={door.id === "tape" ? lead : undefined}
                href={door.href}
                onClick={() => {
                  playStatic();
                  onOpenChange(false);
                }}
                onKeyDown={activateOnSpace}
              >
                {door.id === "tape" ? (
                  <>
                    <i className="discover-reg discover-reg-bl" aria-hidden />
                    <i className="discover-reg discover-reg-br" aria-hidden />
                  </>
                ) : null}
                <span className="discover-lens">{door.kicker}</span>
                <span className="discover-label">{door.label}</span>
                <span className="discover-landing">{door.note}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
