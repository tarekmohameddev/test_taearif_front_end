"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
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

export default function EditBlogPage() {
  const params = useParams();
  const id = params?.id as string;
  
  return <BlogForm mode="edit" blogId={Number(id)} />;
}
