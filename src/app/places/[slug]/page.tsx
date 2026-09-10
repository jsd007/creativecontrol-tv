import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog, clipsForLocation, getLocation } from "@/data";
import { EntityView } from "@/components/entity/EntityView";

export function generateStaticParams() {
  return catalog.locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const place = getLocation(slug);
  return { title: place?.name ?? "Place" };
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = getLocation(slug);
  if (!place) notFound();
  return <EntityView kind="place" place={place} clips={clipsForLocation(place.id)} />;
}
