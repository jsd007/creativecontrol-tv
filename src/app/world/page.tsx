import type { Metadata } from "next";
import { Suspense } from "react";
import { WorldGlobe } from "@/components/world/WorldGlobe";

export const metadata: Metadata = {
  title: "The World",
};

export default function WorldPage() {
  return (
    <Suspense>
      <WorldGlobe />
    </Suspense>
  );
}
