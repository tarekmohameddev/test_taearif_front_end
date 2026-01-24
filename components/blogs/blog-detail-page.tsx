/**
 * Blog Detail Page Component
 * 
 * @description صفحة التفاصيل الكاملة للمقال
 * 
 * @dependencies
 * - Uses: hooks/use-blog-detail.ts (جلب تفاصيل المقال)
 * - Uses: components/detail/* (جميع مكونات التفاصيل)
 * - Uses: components/shared/blog-loading-state.tsx (حالة التحميل)
 * - Uses: components/shared/blog-error-state.tsx (حالة الخطأ)
 * - Used by: app/dashboard/blogs/[id]/page.tsx
 * 
 * @related
 * - services/blog-api.ts (API calls)
 * - types/blog.types.ts (BlogPost)
 */

"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlogDetail } from "./hooks/use-blog-detail";
import { formatDate } from "./utils/blog-formatters";
import { BlogDetailHeader } from "./components/detail/blog-detail-header";
import { BlogDetailContent } from "./components/detail/blog-detail-content";
import { BlogDetailMedia } from "./components/detail/blog-detail-media";
import { BlogDetailCategories } from "./components/detail/blog-detail-categories";
import { BlogDetailAuthor } from "./components/detail/blog-detail-author";
import { BlogLoadingState } from "./components/shared/blog-loading-state";
import { BlogErrorState } from "./components/shared/blog-error-state";
import { blogApi } from "./services/blog-api";
import toast from "react-hot-toast";

interface BlogDetailPageProps {
  blogId: number | string;
}

export function BlogDetailPage({ blogId }: BlogDetailPageProps) {
  const router = useRouter();
  // يستخدم useBlogDetail لجلب تفاصيل المقال (يستخدم blog-api.ts داخلياً)
  const { blog, loading, error, refetch } = useBlogDetail(blogId);

  const handleEdit = () => {
    router.push(`/dashboard/blogs/edit/${blogId}`);
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      return;
    }

    try {
      // DELETE /posts/{id} - حذف مقال
      await blogApi.deleteBlog(Number(blogId));
      toast.success("تم حذف المقال بنجاح");
      router.push("/dashboard/blogs");
    } catch (err: any) {
      console.error("Error deleting blog:", err);
      toast.error(err.message || "فشل في حذف المقال");
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BlogLoadingState type="detail" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BlogErrorState message={error || "المقال غير موجود"} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        {/* Header with Actions */}
        <BlogDetailHeader
          blog={blog}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Excerpt */}
        {blog.excerpt && (
          <Card>
            <CardHeader>
              <CardTitle>الملخص</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">{blog.excerpt}</p>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>المحتوى</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogDetailContent content={blog.content} />
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات إضافية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">معرف المقال:</span>
                <p className="text-gray-900 dark:text-gray-100">{blog.id}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">معرف المستخدم:</span>
                <p className="text-gray-900 dark:text-gray-100">{blog.user_id}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">الرابط اللطيف (Slug):</span>
                <p className="text-gray-900 dark:text-gray-100 font-mono">{blog.slug}</p>
              </div>
              {blog.published_at && (
                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">تاريخ النشر:</span>
                  <p className="text-gray-900 dark:text-gray-100">{formatDate(blog.published_at)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        {blog.categories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>التصنيفات</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogDetailCategories categories={blog.categories} />
            </CardContent>
          </Card>
        )}

        {/* Media */}
        {blog.media.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>الملفات الإعلامية</CardTitle>
            </CardHeader>
            <CardContent>
              <BlogDetailMedia media={blog.media} />
            </CardContent>
          </Card>
        )}

        {/* Author Info */}
        <BlogDetailAuthor
          author={blog.author}
          createdAt={blog.created_at}
          updatedAt={blog.updated_at}
        />
      </div>
    </div>
  );
}
