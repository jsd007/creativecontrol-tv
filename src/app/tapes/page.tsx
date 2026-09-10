import type { Metadata } from "next";
import { Suspense } from "react";
import { TapeMosaic } from "@/components/tapes/TapeMosaic";

export const metadata: Metadata = {
  title: "The Tapes",
};

export default function TapesPage() {
  return (
    <Suspense>
      <TapeMosaic />
    </Suspense>
  );
}
