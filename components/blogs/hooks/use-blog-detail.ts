/**
 * useBlogDetail Hook
 * 
 * @description Hook لجلب تفاصيل مقال واحد
 * 
 * @dependencies
 * - Uses: services/blog-api.ts (getBlogById)
 * - Used by: components/blogs/blog-detail-page.tsx
 * 
 * @returns {Object} { blog, loading, error, refetch }
 * 
 * @related
 * - types/blog.types.ts (BlogPost type)
 * - services/blog-api.ts (API calls)
 * - components/blogs/blog-detail-page.tsx (يعرض البيانات)
 */

import { useState, useEffect } from "react";
import { blogApi } from "../services/blog-api";
import type { BlogPost } from "../types/blog.types";

export function useBlogDetail(blogId: number | string) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = async () => {
    if (!blogId) {
      setError("معرف المقال مطلوب");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // GET /posts/{id} - جلب تفاصيل مقال
      const response = await blogApi.getBlogById(Number(blogId));
      setBlog(response.data);
    } catch (err: any) {
      console.error("Error fetching blog detail:", err);
      setError(
        err.response?.status === 404
          ? "المقال غير موجود"
          : err.message || "فشل في تحميل المقال"
      );
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  return {
    blog,
    loading,
    error,
    refetch: fetchBlog,
  };
}
