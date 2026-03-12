"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectsManagementPage = dynamic(
  () =>
    import("@/components/project/projects-management-page").then((m) => ({
      default: m.ProjectsManagementPage,
    })),
  {
    loading: () => (
      <div className="p-6 space-y-6" dir="rtl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    ),
    ssr: false,
  }
);

export default function ProjectsPageClient() {
  return <ProjectsManagementPage />;
}
