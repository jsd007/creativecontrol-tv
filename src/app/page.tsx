import { Suspense } from "react";
import { Threshold } from "@/components/entry/Threshold";

export default function HomePage() {
  return (
    <Suspense>
      <Threshold />
    </Suspense>
  );
}
