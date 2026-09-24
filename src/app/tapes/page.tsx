import type { Metadata } from "next";
import { Suspense } from "react";
import { TapeExplorer } from "@/components/tapes/TapeExplorer";

export const metadata: Metadata = {
  title: "The Tapes",
};

export default function TapesPage() {
  return (
    <Suspense>
      <TapeExplorer />
    </Suspense>
  );
}
