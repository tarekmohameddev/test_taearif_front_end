/**
 * useBlogForm Hook
 * 
 * @description Hook لإدارة حالة النموذج (form state, validation, submit)
 * 
 * @dependencies
 * - Uses: services/blog-api.ts (createBlog, updateBlog, getBlogById)
 * - Uses: utils/blog-validators.ts (validateBlogForm)
 * - Uses: utils/blog-formatters.ts (generateSlug, formatExcerpt)
 * - Used by: components/blogs/blog-form.tsx
 * 
 * @returns {Object} { formData, errors, handleChange, handleSubmit, loading }
 * 
 * @related
 * - types/blog.types.ts (BlogFormData type)
 * - services/blog-api.ts (API calls)
 * - utils/blog-validators.ts (التحقق من البيانات)
 * - utils/blog-formatters.ts (تنسيق البيانات)
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { blogApi } from "../services/blog-api";
import { mediaApi } from "../services/media-api";
import { validateBlogForm } from "../utils/blog-validators";
import { generateSlug, formatExcerpt } from "../utils/blog-formatters";
import type { BlogFormData, ValidationErrors } from "../types/blog.types";
import toast from "react-hot-toast";

const initialFormData: BlogFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  status: "draft",
  thumbnail_id: null,
  category_ids: [],
  media_ids: [],
};

export function useBlogForm(mode: "create" | "edit", blogId?: number) {
  const router = useRouter();
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(false);
  
  // Store files to upload on submit
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  // Load blog data for edit mode
  useEffect(() => {
    if (mode === "edit" && blogId) {
      setLoadingBlog(true);
      blogApi
        .getBlogById(blogId)
        .then((response) => {
          const blog = response.data;
          setFormData({
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            excerpt: blog.excerpt || "",
            status: blog.status,
            thumbnail_id: blog.thumbnail?.id || null,
            category_ids: blog.categories.map((cat) => cat.id),
            media_ids: blog.media.map((m) => m.id),
          });
        })
        .catch((err) => {
          console.error("Error loading blog:", err);
          toast.error("فشل في تحميل المقال");
        })
        .finally(() => {
          setLoadingBlog(false);
        });
    }
  }, [mode, blogId]);

  const handleChange = (
    field: keyof BlogFormData,
    value: string | number | number[] | null
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate slug from title if slug is empty
      if (field === "title" && !updated.slug) {
        updated.slug = generateSlug(value as string);
      }

      // Auto-generate excerpt from content if excerpt is empty
      if (field === "content" && !updated.excerpt) {
        updated.excerpt = formatExcerpt(value as string);
      }

      return updated;
    });

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateBlogForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Upload thumbnail if new file selected
      let thumbnailId = formData.thumbnail_id;
      if (thumbnailFile) {
        toast.loading("جاري رفع الصورة المصغرة...", { id: "upload-thumbnail" });
        // POST /media - رفع الصورة المصغرة
        const thumbnailResponse = await mediaApi.uploadMedia(thumbnailFile);
        thumbnailId = thumbnailResponse.data.id;
        toast.success("تم رفع الصورة المصغرة", { id: "upload-thumbnail" });
      }

      // Step 2: Upload media files if new files selected
      let mediaIds = [...formData.media_ids];
      if (mediaFiles.length > 0) {
        toast.loading(`جاري رفع ${mediaFiles.length} ملف...`, { id: "upload-media" });
        // POST /media - رفع الملفات الإعلامية
        const uploadPromises = mediaFiles.map((file) =>
          mediaApi.uploadMedia(file)
        );
        const mediaResponses = await Promise.all(uploadPromises);
        const newMediaIds = mediaResponses.map((res) => res.data.id);
        mediaIds = [...mediaIds, ...newMediaIds];
        toast.success(`تم رفع ${mediaFiles.length} ملف بنجاح`, { id: "upload-media" });
      }

      // Step 3: Create or update blog post
      const finalFormData = {
        ...formData,
        thumbnail_id: thumbnailId,
        media_ids: mediaIds,
      };

      if (mode === "create") {
        toast.loading("جاري إنشاء المقال...", { id: "create-blog" });
        // POST /posts - إنشاء مقال جديد
        await blogApi.createBlog(finalFormData);
        toast.success("تم إنشاء المقال بنجاح", { id: "create-blog" });
        router.push("/dashboard/blogs");
      } else if (mode === "edit" && blogId) {
        toast.loading("جاري تحديث المقال...", { id: "update-blog" });
        // PUT /posts/{id} - تحديث مقال
        await blogApi.updateBlog(blogId, finalFormData);
        toast.success("تم تحديث المقال بنجاح", { id: "update-blog" });
        router.push(`/dashboard/blogs/${blogId}`);
      }
    } catch (err: any) {
      console.error("Error submitting form:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "فشل في حفظ المقال";
      toast.error(errorMessage, { id: "error" });

      // Set validation errors from API response
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (type: "thumbnail", file: File | null) => {
    if (type === "thumbnail") {
      setThumbnailFile(file);
    }
  };

  const handleFilesChange = (files: File[]) => {
    setMediaFiles(files);
  };

  return {
    formData,
    errors,
    loading,
    loadingBlog,
    handleChange,
    handleSubmit,
    handleFileChange,
    handleFilesChange,
    setFormData,
  };
}
