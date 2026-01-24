"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const BlogsListPage = dynamic(
  () =>
    import("@/components/blogs/blogs-list-page").then(
      (mod) => mod.BlogsListPage
    ),
  {
    loading: () => (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    ),
    ssr: false,
  }
);

export default function Blogs() {
  return <BlogsListPage />;
}
