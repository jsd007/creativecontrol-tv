import type { Metadata } from "next";
import { TimelineView } from "@/components/timeline/TimelineView";

export const metadata: Metadata = {
  title: "The Timeline",
};

export default function TimelinePage() {
  return <TimelineView />;
}
