"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const EditPropertyPage = dynamic(
  () => import("@/components/property/edit-property-page"),
  {
    loading: () => (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    ),
    ssr: false,
  }
);

export default function Page() {
  return <EditPropertyPage />;
}
