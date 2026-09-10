import Link from "next/link";
import type { Album, ArchiveClip, Collection, Era, Location, Person, Project, Track } from "@/data/types";
import { visibilityLabel } from "@/lib/format";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="dossier-row grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 border-t border-paper/10 py-3.5 md:grid-cols-[9rem_minmax(0,1fr)]">
      <p className="type-label">{label}</p>
      <div className="text-[15px] leading-snug text-paper">{children}</div>
    </div>
  );
}

export function ClipDossier({
  people,
  location,
  locationHref,
  tracks,
  albums,
  projects,
  collections,
  era,
  clip,
}: {
  people: Person[];
  location?: Location;
  locationHref: string;
  tracks: Track[];
  albums: Album[];
  projects: Project[];
  collections: Collection[];
  era?: Era;
  clip: ArchiveClip;
}) {
  return (
    <aside className="mt-16 max-w-3xl">
      <p className="type-label tracking-[0.22em]">DOSSIER</p>
      <div className="mt-5 border-b border-paper/10">
        <Row label="PEOPLE">
          {people.length ? (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {people.map((p) => (
                <Link key={p.id} href={`/people/${p.slug}`} className="hover:text-leader">
                  {p.shortName}
                </Link>
              ))}
            </div>
          ) : (
            <span className="text-dust">—</span>
          )}
        </Row>
        <Row label="PLACE">
          <Link href={locationHref} className="hover:text-leader">
            {location?.name ?? "Unfiled"}
          </Link>
        </Row>
        {tracks.length || albums.length ? (
          <Row label="MUSIC">
            <div>
              {tracks.map((t) => (
                <Link key={t.id} href={`/archive?track=${t.id}`} className="mr-3 hover:text-leader">
                  {t.title}
                </Link>
              ))}
              {albums.map((a) => (
                <span key={a.id} className="mt-1 block text-dust">
                  {a.title} · {a.year}
                </span>
              ))}
            </div>
          </Row>
        ) : null}
        {projects.length ? (
          <Row label="PROJECT">
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="mr-3 hover:text-leader">
                {p.title}
              </Link>
            ))}
          </Row>
        ) : null}
        <Row label="RIGHTS">
          <span className="font-mono text-[11px] tracking-[0.08em] text-bone/80">
            {visibilityLabel(clip.visibility)} · {clip.rightsStatus.replaceAll("_", " ")}
            {clip.sensitivityStatus !== "NONE" ? ` · ${clip.sensitivityStatus.replaceAll("_", " ")}` : ""}
          </span>
        </Row>
        <Row label="CUTS">
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-display text-[22px] leading-none">
            {collections.map((c) => (
              <Link key={c.id} href={`/collections/${c.slug}`} className="hover:text-leader">
                {c.name}
              </Link>
            ))}
            {era ? (
              <Link href={`/archive?era=${era.id}`} className="text-bone/60 hover:text-leader">
                {era.name}
              </Link>
            ) : null}
          </div>
        </Row>
      </div>
    </aside>
  );
}
