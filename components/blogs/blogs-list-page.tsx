/**
 * Blogs List Page Component
 * 
 * @description صفحة القائمة الرئيسية للمقالات
 * 
 * @dependencies
 * - Uses: hooks/use-blogs-list.ts (جلب قائمة المقالات)
 * - Uses: hooks/use-blog-stats.ts (جلب الإحصائيات)
 * - Uses: components/stats/blog-stats-cards.tsx (بطاقات الإحصائيات)
 * - Uses: components/table/blog-table.tsx (جدول المقالات)
 * - Uses: components/shared/blog-error-state.tsx (حالة الخطأ)
 * - Used by: app/dashboard/blogs/page.tsx
 * 
 * @related
 * - services/blog-api.ts (API calls)
 * - types/blog.types.ts (BlogListItem, Pagination)
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useBlogsList } from "./hooks/use-blogs-list";
import { BlogStatsCards } from "./components/stats/blog-stats-cards";
import { BlogTable } from "./components/table/blog-table";
import { BlogErrorState } from "./components/shared/blog-error-state";
import { blogApi } from "./services/blog-api";
import toast from "react-hot-toast";

export function BlogsListPage() {
  const router = useRouter();
  // يستخدم useBlogsList للحصول على قائمة المقالات (يستخدم blog-api.ts داخلياً)
  const { blogs, loading, error, pagination, fetchBlogs } = useBlogsList();

  const handleEdit = (id: number) => {
    router.push(`/dashboard/blogs/edit/${id}`);
  };

  const handleView = (id: number) => {
    router.push(`/dashboard/blogs/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      return;
    }

    try {
      // DELETE /posts/{id} - حذف مقال
      await blogApi.deleteBlog(id);
      toast.success("تم حذف المقال بنجاح");
      // إعادة تحميل القائمة
      fetchBlogs(pagination?.current_page || 1);
    } catch (err: any) {
      console.error("Error deleting blog:", err);
      toast.error(err.message || "فشل في حذف المقال");
    }
  };

  const handlePageChange = (page: number) => {
    fetchBlogs(page);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المدونة</h1>
        <Button onClick={() => router.push("/dashboard/blogs/create")} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة مقال جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <BlogStatsCards />

      {/* Error State */}
      {error && <BlogErrorState message={error} onRetry={() => fetchBlogs(1)} />}

      {/* Table */}
      {!error && (
        <BlogTable
          blogs={blogs}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}
    </div>
  );
}
