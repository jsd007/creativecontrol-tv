import type { Metadata } from "next";
import { CollectionIndex } from "@/components/collections/CollectionIndex";

export const metadata: Metadata = {
  title: "Stories",
};

export default function CollectionsPage() {
  return <CollectionIndex />;
}
