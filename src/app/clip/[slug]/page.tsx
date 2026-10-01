import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog, getClip } from "@/data";
import { ClipView } from "@/components/clip/ClipView";
import Link from "next/link";
import { tvReturnHref } from "@/lib/tvNavigation";

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
  searchParams: Promise<{ seg?: string; tv?: string }>;
}) {
  const { slug } = await params;
  const { seg, tv } = await searchParams;
  const returnTo = tvReturnHref(tv);
  const clip = getClip(slug);
  if (!clip) notFound();
  return (
    <div className="pt-5 md:pt-7">
      {returnTo ? (
        <div className="mx-auto mb-4 max-w-6xl px-4 md:px-6">
          <Link href={returnTo} className="inline-flex min-h-11 items-center font-cond text-[13px] tracking-[0.14em] text-leader underline underline-offset-4">
            ← BACK TO YOUR TV SELECTION
          </Link>
        </div>
      ) : null}
      <ClipView clip={clip} activeSegmentId={seg} />
    </div>
  );
}
