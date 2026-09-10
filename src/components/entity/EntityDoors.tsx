"use client";

import Link from "next/link";
import { activateOnSpace } from "@/lib/keys";

type Door = { href: string; label: string; loud?: boolean };

export function EntityDoors({ doors }: { doors: Door[] }) {
  return (
    <nav className="mt-10 flex flex-wrap gap-5 font-cond text-[13px] tracking-[0.16em]" aria-label="Doors">
      {doors.map((door) => (
        <Link
          key={`${door.href}-${door.label}`}
          href={door.href}
          onKeyDown={activateOnSpace}
          className={door.loud ? "text-paper hover:text-leader" : "text-dust hover:text-paper"}
        >
          {door.label}
        </Link>
      ))}
    </nav>
  );
}
