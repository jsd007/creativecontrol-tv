import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog, getClip } from "@/data";
import { ClipView } from "@/components/clip/ClipView";
import Link from "next/link";
import { tvReturnHref } from "@/lib/tvNavigation";
import { parseLensReturn } from "@/lib/lensNavigation";

export function generateStaticParams() {
  return catalog.clips.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const clip = getClip(slug);
  return { title: clip?.title ?? "Clip" };
}

export default async function ClipPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const one = (key: string) => typeof search[key] === "string" ? search[key] as string : undefined;
  const returnTo = parseLensReturn(one("from")) ?? parseLensReturn(tvReturnHref(one("tv")));
  const clip = getClip(slug);
  if (!clip) notFound();
  return (
    <div className="pt-5 md:pt-7">
      {returnTo ? (
        <div className="mx-auto mb-4 max-w-6xl px-4 md:px-6">
          <Link href={returnTo.href} className="inline-flex min-h-11 items-center font-cond text-[13px] tracking-[0.14em] text-leader underline underline-offset-4">
            ← BACK TO {returnTo.label}
          </Link>
        </div>
      ) : null}
      <ClipView clip={clip} activeSegmentId={one("seg")} returnHref={returnTo?.href} />
    </div>
  );
}
