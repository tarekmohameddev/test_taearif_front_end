"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const PlatformReportsPage = dynamic(
  () =>
    import("@/components/reports/platform-reports-page").then(
      (mod) => mod.PlatformReportsPage
    ),
  {
    loading: () => (
      <div className="p-6 space-y-4" dir="rtl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    ),
    ssr: false,
  }
);

export default function Page() {
  return <PlatformReportsPage />;
}
