import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchiveIndex } from "@/components/archive/ArchiveIndex";
import { parseFilters } from "@/lib/archiveQuery";

export const metadata: Metadata = {
  title: "The Archive",
};

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <Suspense>
      <ArchiveIndex initial={parseFilters(sp)} />
    </Suspense>
  );
}
