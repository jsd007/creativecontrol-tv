import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog, clipsForProject, getProject } from "@/data";
import { EntityView } from "@/components/entity/EntityView";

export function generateStaticParams() {
  return catalog.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <EntityView kind="project" project={project} clips={clipsForProject(project.id)} />;
}
