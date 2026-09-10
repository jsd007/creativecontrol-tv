import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog, getCollection } from "@/data";
import { CollectionStory } from "@/components/collections/CollectionStory";

export function generateStaticParams() {
  return catalog.collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  return { title: collection?.name ?? "Story" };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  return <CollectionStory collection={collection} />;
}
