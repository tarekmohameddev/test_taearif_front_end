/**
 * Blog Category Detail Page Component
 * 
 * @description صفحة عرض جميع المدونات الخاصة بتصنيف معين
 * 
 * @dependencies
 * - Uses: hooks/use-blogs-by-category.ts (جلب المدونات حسب التصنيف)
 * - Uses: hooks/use-categories.ts (جلب اسم التصنيف)
 * - Uses: components/table/blog-table.tsx (جدول المدونات)
 * - Used by: app/dashboard/blogs/categories/[categoryId]/page.tsx
 * 
 * @related
 * - services/blog-api.ts (API calls)
 * - types/blog.types.ts (BlogListItem, Pagination)
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle, Tag } from "lucide-react";
import { useBlogsByCategory } from "./hooks/use-blogs-by-category";
import { useCategories } from "./hooks/use-categories";
import { BlogTable } from "./components/table/blog-table";
import { BlogLoadingState } from "./components/shared/blog-loading-state";
import { BlogErrorState } from "./components/shared/blog-error-state";
import { BlogEmptyState } from "./components/shared/blog-empty-state";
import { blogApi } from "./services/blog-api";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import toast from "react-hot-toast";

interface BlogCategoryDetailPageProps {
  categoryId: string | number;
}

export function BlogCategoryDetailPage({
  categoryId,
}: BlogCategoryDetailPageProps) {
  const router = useRouter();
  const { blogs, loading, error, pagination, fetchBlogs } =
    useBlogsByCategory(categoryId);
  const { categories } = useCategories();

  // الحصول على اسم التصنيف
  const category = categories.find(
    (cat) => cat.id === Number(categoryId)
  );
  const categoryName = category?.name || "تصنيف غير معروف";

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<{ slug: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (blog: { id: number; slug: string }) => {
    router.push(`/dashboard/blogs/edit/${blog.slug}`);
  };

  const handleView = (blog: { id: number; slug: string }) => {
    router.push(`/dashboard/blogs/${blog.slug}`);
  };

  const handleDeleteClick = (blog: { slug: string; title: string }) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBlogToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    setDeleting(true);
    try {
      await blogApi.deleteBlog(blogToDelete.slug);
      toast.success("تم حذف المقال بنجاح");
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
      fetchBlogs(pagination?.current_page || 1);
    } catch (err: any) {
      console.error("Error deleting blog:", err);
      toast.error(err.message || "فشل في حذف المقال");
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchBlogs(page);
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">المدونات - {categoryName}</h1>
        </div>
        <BlogLoadingState type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">المدونات - {categoryName}</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/blogs/categories")}
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى التصنيفات
          </Button>
        </div>
        <BlogErrorState
          title="حدث خطأ"
          message={error}
          onRetry={() => fetchBlogs(pagination?.current_page || 1)}
        />
      </div>
    );
  }

  if (!category && !loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">تصنيف غير موجود</h1>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/blogs/categories")}
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى التصنيفات
          </Button>
        </div>
        <BlogErrorState
          title="تصنيف غير موجود"
          message="التصنيف المطلوب غير موجود أو تم حذفه."
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">المدونات - {categoryName}</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/blogs/categories")}
          className="gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى التصنيفات
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
            <Tag className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            لا توجد مدونات في هذا التصنيف
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
            لم يتم إنشاء أي مدونات في تصنيف "{categoryName}" بعد.
          </p>
        </div>
      ) : (
        <BlogTable
          blogs={blogs}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onView={handleView}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <CustomDialog open={deleteDialogOpen} onOpenChange={(open) => !open && handleDeleteCancel()} maxWidth="max-w-md">
        <CustomDialogContent>
          <CustomDialogClose onClose={handleDeleteCancel} />
          <CustomDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CustomDialogTitle className="text-red-600 dark:text-red-400">
                تأكيد حذف المقال
              </CustomDialogTitle>
            </div>
            <CustomDialogDescription className="text-base">
              <div className="space-y-3">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  هذا الإجراء لا يمكن التراجع عنه.
                </p>
                {blogToDelete && (
                  <p className="text-gray-700 dark:text-gray-300">
                    سيتم حذف المقال <strong className="text-red-600 dark:text-red-400">"{blogToDelete.title}"</strong> بشكل نهائي من النظام.
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  جميع البيانات المرتبطة بهذا المقال (المحتوى، الصور) سيتم حذفها نهائياً ولن تتمكن من استعادتها.
                </p>
              </div>
            </CustomDialogDescription>
          </CustomDialogHeader>
          <CustomDialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel} disabled={deleting} className="w-full sm:w-auto">
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting} className="w-full sm:w-auto">
              {deleting ? "جاري الحذف..." : "حذف نهائي"}
            </Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>
    </div>
  );
}
