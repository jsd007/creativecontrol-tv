import type { Metadata } from "next";
import { Suspense } from "react";
import { Television } from "@/components/tv/Television";

export const metadata: Metadata = {
  title: "Television",
};

export default function TvPage() {
  return (
    <Suspense>
      <Television />
    </Suspense>
  );
}
