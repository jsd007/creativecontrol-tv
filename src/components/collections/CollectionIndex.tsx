import Link from "next/link";
import { catalog } from "@/data";
import { PrototypeMedia } from "@/components/media/PrototypeMedia";
import { leftoverFrames, storyFrames, yearSpan } from "@/components/collections/held";

export function CollectionIndex() {
  return (
    <div className="px-4 pb-28 md:px-6">
      <p className="pt-4 font-cond text-[12px] tracking-[0.28em] text-leader">STORIES</p>
      <h1 className="sr-only">Collections</h1>

      <ol className="mt-6">
        {catalog.collections.map((collection, i) => {
          const held = storyFrames(collection.id);
          const leftover = leftoverFrames(collection.id);
          const lead = held.find((c) => c.featured) ?? held[0];
          const span = yearSpan(held);
          const flip = i % 2 === 1;
          const href = `/collections/${collection.slug}`;

          return (
            <li key={collection.id} className="border-t border-paper/10">
              <article
                className={
                  lead
                    ? "grid items-center gap-8 py-14 md:grid-cols-2 md:gap-12 lg:gap-16 md:py-16"
                    : "max-w-xl py-14 md:py-16"
                }
              >
                <div className={lead && flip ? "md:order-2" : undefined}>
                  <p className="font-mono text-[10px] tracking-[0.22em] text-dust">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 max-w-[14ch] font-display text-5xl leading-none text-paper md:text-6xl">
                    <Link href={href} className="hover:text-leader">
                      {collection.name}
                    </Link>
                  </h2>
                  <p className="mt-4 max-w-md text-[16px] leading-relaxed text-bone/75">{collection.dek}</p>
                  <p className="mt-5 font-mono text-[11px] tracking-[0.16em] text-leader">
                    {span ?? "NO PUBLIC FRAMES"}
                  </p>
                  {!held.length && leftover.length ? (
                    <p className="mt-3 font-cond text-[12px] tracking-[0.18em] text-dust">HELD IN THE HOUSE FILE</p>
                  ) : null}
                </div>
                {lead ? (
                  <Link href={href} className={flip ? "md:order-1" : undefined}>
                    <PrototypeMedia clip={lead} className="aspect-[4/3] w-full" />
                  </Link>
                ) : null}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
