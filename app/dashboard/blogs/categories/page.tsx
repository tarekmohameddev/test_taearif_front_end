"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const BlogCategoriesListPage = dynamic(
  () =>
    import("@/components/blogs/blog-categories-list-page").then(
      (mod) => mod.BlogCategoriesListPage
    ),
  {
    loading: () => (
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function BlogCategoriesPage() {
  return <BlogCategoriesListPage />;
}
