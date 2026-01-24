"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const BlogForm = dynamic(
  () => import("@/components/blogs/blog-form").then((mod) => mod.BlogForm),
  {
    loading: () => (
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-96 w-full" />
      </div>
    ),
    ssr: false,
  }
);

export default function CreateBlogPage() {
  return <BlogForm mode="create" />;
}
