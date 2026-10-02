import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog, getTape } from "@/data";
import { TapeDossier } from "@/components/tapes/TapeDossier";
import { lensHref, parseLensReturn } from "@/lib/lensNavigation";

export function generateStaticParams() {
  return catalog.tapes.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tape = getTape(id);
  return { title: tape ? tape.code : "Tape" };
}

export default async function TapePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ id }, search] = await Promise.all([params, searchParams]);
  const tape = getTape(id);
  if (!tape) notFound();
  const from = parseLensReturn(typeof search.from === "string" ? search.from : undefined);
  return <TapeDossier tape={tape} returnHref={from?.href ?? lensHref("/tapes", "", { open: id })} returnLabel={from?.label} />;
}
