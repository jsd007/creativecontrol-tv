import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog, getClip } from "@/data";
import { ClipView } from "@/components/clip/ClipView";

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
  searchParams: Promise<{ seg?: string }>;
}) {
  const { slug } = await params;
  const { seg } = await searchParams;
  const clip = getClip(slug);
  if (!clip) notFound();
  return (
    <div className="pt-5 md:pt-7">
      <ClipView clip={clip} activeSegmentId={seg} />
    </div>
  );
}
