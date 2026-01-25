/**
 * Blog Categories List Page Component
 * 
 * @description صفحة عرض جميع تصنيفات المدونات في Grid layout
 * 
 * @dependencies
 * - Uses: hooks/use-categories.ts (جلب قائمة التصنيفات)
 * - Used by: app/dashboard/blogs/categories/page.tsx
 * 
 * @related
 * - services/category-api.ts (API calls)
 * - types/category.types.ts (Category type)
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useCategories } from "./hooks/use-categories";
import { BlogLoadingState } from "./components/shared/blog-loading-state";
import { BlogErrorState } from "./components/shared/blog-error-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Plus } from "lucide-react";
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

export function BlogCategoriesListPage() {
  const { categories, loading, error, refetch } = useCategories();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

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
      await categoryApi.createCategory(categoryName.trim());
      toast.success("تم إنشاء التصنيف بنجاح");
      handleCloseCategoryDialog();
      refetch(); // إعادة تحميل قائمة التصنيفات
    } catch (err: any) {
      console.error("Error creating category:", err);
      toast.error(err.response?.data?.message || err.message || "فشل في إنشاء التصنيف");
    } finally {
      setCreatingCategory(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">تصنيفات المدونات</h1>
          <Button onClick={handleOpenCategoryDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة تصنيف
          </Button>
        </div>
        <BlogLoadingState type="list" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">تصنيفات المدونات</h1>
          <Button onClick={handleOpenCategoryDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة تصنيف
          </Button>
        </div>
        <BlogErrorState
          title="حدث خطأ"
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">تصنيفات المدونات</h1>
          <Button onClick={handleOpenCategoryDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة تصنيف
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
            <Tag className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            لا توجد تصنيفات
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
            لم يتم إنشاء أي تصنيفات بعد.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">تصنيفات المدونات</h1>
        <Button onClick={handleOpenCategoryDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة تصنيف
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/dashboard/blogs/categories/${category.id}`}
            className="block"
          >
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer border-2 hover:border-primary">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Tag className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      عرض المدونات
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

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
