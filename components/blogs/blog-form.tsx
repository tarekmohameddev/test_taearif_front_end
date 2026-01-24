/**
 * Blog Form Component
 * 
 * @description نموذج قابل لإعادة الاستخدام لإضافة/تعديل المقالات
 * 
 * @dependencies
 * - hooks/use-blog-form.ts (إدارة حالة النموذج)
 * - hooks/use-media-upload.ts (رفع الملفات)
 * - hooks/use-categories.ts (جلب التصنيفات)
 * - components/form/* (جميع مكونات النموذج الفرعية)
 * 
 * @usedBy
 * - app/dashboard/blogs/create/page.tsx
 * - app/dashboard/blogs/edit/[id]/page.tsx
 * 
 * @related
 * - services/blog-api.ts (API calls)
 * - types/blog.types.ts (BlogFormData type)
 * - utils/blog-validators.ts (التحقق من البيانات)
 */

"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useBlogForm } from "./hooks/use-blog-form";
import { BlogBasicInfo } from "./components/form/blog-basic-info";
import { BlogContentEditor } from "./components/form/blog-content-editor";
import { BlogStatusSelector } from "./components/form/blog-status-selector";
import { BlogCategoriesSelector } from "./components/form/blog-categories-selector";
import { BlogThumbnailUpload } from "./components/form/blog-thumbnail-upload";
import { BlogMediaUpload } from "./components/form/blog-media-upload";
import { BlogFormActions } from "./components/form/blog-form-actions";
import { BlogLoadingState } from "./components/shared/blog-loading-state";

interface BlogFormProps {
  mode: "create" | "edit";
  blogId?: number;
}

export function BlogForm({ mode, blogId }: BlogFormProps) {
  const router = useRouter();
  // يستخدم useBlogForm لإدارة حالة النموذج (يستخدم blog-api.ts داخلياً)
  const {
    formData,
    errors,
    loading,
    loadingBlog,
    thumbnailUrl,
    mediaUrls,
    handleChange,
    handleSubmit,
    handleFileChange,
    handleFilesChange,
  } = useBlogForm(mode, blogId);

  if (loadingBlog) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <BlogLoadingState type="form" />
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {mode === "create" ? "إضافة مقال جديد" : "تعديل المقال"}
            </CardTitle>
            {mode === "edit" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/blogs")}
                className="gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                العودة
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* المعلومات الأساسية */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogBasicInfo
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                />
              </CardContent>
            </Card>

            {/* المحتوى */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">المحتوى</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogContentEditor
                  formData={formData}
                  errors={errors}
                  onChange={(value) => handleChange("content", value)}
                />
              </CardContent>
            </Card>

            {/* الحالة */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الحالة</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogStatusSelector
                  formData={formData}
                  onChange={(status) => handleChange("status", status)}
                />
              </CardContent>
            </Card>

            {/* التصنيفات */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">التصنيفات</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogCategoriesSelector
                  formData={formData}
                  onChange={(categoryIds) =>
                    handleChange("category_ids", categoryIds)
                  }
                />
              </CardContent>
            </Card>

            {/* الصورة المصغرة */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الصورة المصغرة</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogThumbnailUpload
                  formData={formData}
                  thumbnailUrl={thumbnailUrl}
                  onChange={(thumbnailId) =>
                    handleChange("thumbnail_id", thumbnailId)
                  }
                  onFileChange={(file) => handleFileChange("thumbnail", file)}
                />
              </CardContent>
            </Card>

            {/* الملفات الإعلامية */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الملفات الإعلامية</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogMediaUpload
                  formData={formData}
                  mediaUrls={mediaUrls}
                  onChange={(mediaIds) => handleChange("media_ids", mediaIds)}
                  onFilesChange={(files) => handleFilesChange(files)}
                />
              </CardContent>
            </Card>

            {/* أزرار الإجراءات */}
            <BlogFormActions
              mode={mode}
              loading={loading}
              onCancel={() => router.push("/dashboard/blogs")}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
