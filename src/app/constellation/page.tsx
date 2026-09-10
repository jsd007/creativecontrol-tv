import type { Metadata } from "next";
import { Suspense } from "react";
import { ConstellationView } from "@/components/constellation/ConstellationView";

export const metadata: Metadata = {
  title: "The Constellation",
};

export default function ConstellationPage() {
  return (
    <Suspense>
      <ConstellationView />
    </Suspense>
  );
}
