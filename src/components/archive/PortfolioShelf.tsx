import Link from "next/link";
import Image from "next/image";
import { getClip, getProject } from "@/data";
import { PORTFOLIO_CLIP_IDS } from "@/data/portfolio";
import { youtubeThumbnail } from "@/data/youtube";
import { clipHref } from "@/lib/lensNavigation";
import "./portfolio.css";

export function PortfolioShelf({ returnHref }: { returnHref?: string }) {
  return (
    <section className="portfolio-shelf" aria-labelledby="portfolio-heading">
      <div className="portfolio-heading">
        <div><p>CREATIVE CONTROL · SELECTED WORK</p><h2 id="portfolio-heading">Beyond the music.</h2></div>
        <p>Films, music videos and new projects. Public references, not private archive footage.</p>
      </div>
      <div className="portfolio-grid">
        {PORTFOLIO_CLIP_IDS.map((id) => {
          const clip = getClip(id);
          if (!clip) return null;
          const project = clip.projectIds.map(getProject).find(Boolean);
          const title = project?.title ?? clip.title.replace(/\s*\|.*$/, "");
          const credit = clip.credits?.find((c) => c.name.includes("Coodie"));
          return (
            <Link key={id} href={clipHref(clip.slug, returnHref)} className="portfolio-card">
              <div className={`portfolio-image${clip.youtubeId ? "" : " portfolio-reference"}`}>
                {clip.youtubeId ? <Image src={youtubeThumbnail(clip.youtubeId)} alt="" width={480} height={270} unoptimized /> : <p>WHO IS<br />ERNIE BARNES?<span>PUBLIC PROJECT REFERENCE</span></p>}
                {clip.youtubeId ? <span>{clip.publicSource?.kind === "music-video" ? "MUSIC VIDEO" : "OFFICIAL TRAILER"}</span> : null}
              </div>
              <div className="portfolio-copy">
                <p>{project?.year ?? clip.year} · {clip.publicSource?.publisher ?? "Creative Control"}</p>
                <h3>{title}</h3>
                <p className="portfolio-credit">{credit?.role === "Executive producers" ? "Executive produced by Coodie & Chike" : "Directed by Coodie & Chike"}{clip.contentState === "project-reference" ? " · Announced" : ""}</p>
                <span>{clip.youtubeId ? "WATCH & EXPLORE" : "ABOUT THE PROJECT"} <span aria-hidden>↗</span></span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
