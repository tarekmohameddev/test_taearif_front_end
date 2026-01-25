"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const BlogCategoryDetailPage = dynamic(
  () =>
    import("@/components/blogs/blog-category-detail-page").then(
      (mod) => mod.BlogCategoryDetailPage
    ),
  {
    loading: () => (
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    ),
    ssr: false,
  }
);

export default function BlogCategoryDetailRoute() {
  const params = useParams();
  const categoryId = params?.categoryId as string;

  if (!categoryId) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-lg text-red-600 font-medium">
            معرف التصنيف غير موجود
          </p>
        </div>
      </div>
    );
  }

  return <BlogCategoryDetailPage categoryId={categoryId} />;
}
