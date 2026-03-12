"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const AddProjectPage = dynamic(
  () => import("@/components/project/add-project-page"),
  {
    loading: () => (
      <div className="p-6 space-y-6" dir="rtl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    ),
    ssr: false,
  }
);

export default function AddProjectPageClient() {
  return <AddProjectPage />;
}
