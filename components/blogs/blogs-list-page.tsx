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
import { Plus, Tag } from "lucide-react";
import { useBlogsList } from "./hooks/use-blogs-list";
import { BlogStatsCards } from "./components/stats/blog-stats-cards";
import { BlogTable } from "./components/table/blog-table";
import { BlogErrorState } from "./components/shared/blog-error-state";
import { blogApi } from "./services/blog-api";
import { categoryApi } from "./services/category-api";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export function BlogsListPage() {
  const router = useRouter();
  // يستخدم useBlogsList للحصول على قائمة المقالات (يستخدم blog-api.ts داخلياً)
  const { blogs, loading, error, pagination, fetchBlogs } = useBlogsList();
  
  // State for category dialog
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

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

  const handleOpenCategoryDialog = () => {
    setCategoryDialogOpen(true);
    setCategoryName("");
  };

  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setCategoryName("");
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("يرجى إدخال اسم التصنيف");
      return;
    }

    setCreatingCategory(true);
    try {
      // POST /categories - إنشاء تصنيف جديد
      await categoryApi.createCategory(categoryName.trim());
      toast.success("تم إنشاء التصنيف بنجاح");
      handleCloseCategoryDialog();
    } catch (err: any) {
      console.error("Error creating category:", err);
      toast.error(err.response?.data?.message || err.message || "فشل في إنشاء التصنيف");
    } finally {
      setCreatingCategory(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">المدونة</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/blogs/categories")}
            className="gap-2"
          >
            <Tag className="h-4 w-4" />
            التصنيفات
          </Button>
          <Button onClick={() => router.push("/dashboard/blogs/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة مقال جديد
          </Button>
        </div>
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

      {/* Category Creation Dialog */}
      <CustomDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        maxWidth="max-w-md"
      >
        <CustomDialogContent>
          <CustomDialogClose onClose={handleCloseCategoryDialog} />
          <CustomDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <CustomDialogTitle>إضافة تصنيف جديد</CustomDialogTitle>
            </div>
            <CustomDialogDescription>
              أدخل اسم التصنيف الجديد. يجب أن يكون الاسم فريداً ولا يتجاوز 255 حرفاً.
            </CustomDialogDescription>
          </CustomDialogHeader>

          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">اسم التصنيف</Label>
              <Input
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="مثال: تقنية، تصميم، تسويق..."
                disabled={creatingCategory}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !creatingCategory) {
                    handleCreateCategory();
                  }
                }}
                autoFocus
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
              <Button
                variant="outline"
                onClick={handleCloseCategoryDialog}
                disabled={creatingCategory}
                className="w-full sm:w-auto"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleCreateCategory}
                disabled={creatingCategory || !categoryName.trim()}
                className="w-full sm:w-auto"
              >
                {creatingCategory ? "جاري الإنشاء..." : "إنشاء التصنيف"}
              </Button>
            </div>
          </div>
        </CustomDialogContent>
      </CustomDialog>
    </div>
  );
}
