"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const BlogDetailPage = dynamic(
  () =>
    import("@/components/blogs/blog-detail-page").then(
      (mod) => mod.BlogDetailPage
    ),
  {
    loading: () => (
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-96 w-full" />
      </div>
    ),
    ssr: false,
  }
);

export default function BlogDetailRoute() {
  const params = useParams();
  const id = params?.id as string;
  
  return <BlogDetailPage blogId={id} />;
}
