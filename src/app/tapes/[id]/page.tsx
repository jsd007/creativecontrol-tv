import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog, getTape } from "@/data";
import { TapeDossier } from "@/components/tapes/TapeDossier";

export function generateStaticParams() {
  return catalog.tapes.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tape = getTape(id);
  return { title: tape ? tape.code : "Tape" };
}

export default async function TapePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tape = getTape(id);
  if (!tape) notFound();
  return <TapeDossier tape={tape} />;
}
