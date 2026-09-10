import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog, clipsForPerson, getPerson } from "@/data";
import { EntityView } from "@/components/entity/EntityView";

export function generateStaticParams() {
  return catalog.people.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);
  return { title: person?.name ?? "Person" };
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) notFound();
  return <EntityView kind="person" person={person} clips={clipsForPerson(person.id)} />;
}
