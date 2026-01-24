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

import { useState, useEffect, useRef, useCallback } from "react";
import { blogApi } from "../services/blog-api";
import type { BlogPost } from "../types/blog.types";

export function useBlogDetail(blogId: number | string) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const fetchingRef = useRef(false);
  const currentBlogIdRef = useRef<number | string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchBlog = useCallback(async () => {
    if (!blogId) {
      if (isMountedRef.current) {
        setError("معرف المقال مطلوب");
        setLoading(false);
      }
      return;
    }

    // Prevent duplicate calls for the same blogId
    if (fetchingRef.current && currentBlogIdRef.current === blogId) {
      return;
    }

    // If we already have the blog data for this ID, skip fetching
    if (currentBlogIdRef.current === blogId && blog) {
      return;
    }

    fetchingRef.current = true;
    currentBlogIdRef.current = blogId;

    try {
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }
      
      // GET /posts/{id} - جلب تفاصيل مقال
      const response = await blogApi.getBlogById(Number(blogId));
      
      // Double check: make sure we're still fetching the same blogId and component is mounted
      if (isMountedRef.current && currentBlogIdRef.current === blogId) {
        setBlog(response.data);
        setLoading(false);
      }
    } catch (err: any) {
      if (isMountedRef.current && currentBlogIdRef.current === blogId) {
        console.error("Error fetching blog detail:", err);
        setError(
          err.response?.status === 404
            ? "المقال غير موجود"
            : err.message || "فشل في تحميل المقال"
        );
        setBlog(null);
        setLoading(false);
      }
    } finally {
      if (currentBlogIdRef.current === blogId) {
        fetchingRef.current = false;
      }
    }
  }, [blogId, blog]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const refetch = useCallback(() => {
    currentBlogIdRef.current = null;
    fetchingRef.current = false;
    fetchBlog();
  }, [fetchBlog]);

  return {
    blog,
    loading,
    error,
    refetch,
  };
}
