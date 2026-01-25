/**
 * useBlogsByCategory Hook
 * 
 * @description Hook لجلب قائمة المقالات حسب التصنيف مع pagination
 * 
 * @dependencies
 * - Uses: services/blog-api.ts (getBlogsByCategory)
 * - Used by: components/blogs/blog-category-detail-page.tsx
 * 
 * @returns {Object} { blogs, loading, error, pagination, fetchBlogs }
 * 
 * @related
 * - types/blog.types.ts (BlogPost, BlogListItem, Pagination)
 * - components/table/blog-table.tsx (يعرض البيانات)
 */

import { useState, useEffect, useCallback } from "react";
import { blogApi } from "../services/blog-api";
import type { BlogListItem, Pagination } from "../types/blog.types";

export function useBlogsByCategory(
  categoryId: number | string,
  initialPage: number = 1,
  perPage: number = 15
) {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const fetchBlogs = useCallback(
    async (page: number = currentPage) => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // GET /posts?category_id={categoryId}&per_page=15&page=1 - جلب قائمة المقالات حسب التصنيف
        const numericCategoryId = typeof categoryId === "string" 
          ? parseInt(categoryId, 10) 
          : categoryId;
        
        if (isNaN(numericCategoryId)) {
          throw new Error("معرف التصنيف غير صحيح");
        }

        const response = await blogApi.getBlogsByCategory(
          numericCategoryId,
          page,
          perPage
        );
        setBlogs(response.data || []);
        setPagination(response.pagination || null);
        setCurrentPage(page);
      } catch (err: any) {
        console.error("Error fetching blogs by category:", err);
        setError(err.message || "فشل في تحميل المقالات");
        setBlogs([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [categoryId, currentPage, perPage]
  );

  useEffect(() => {
    if (categoryId) {
      fetchBlogs(initialPage);
    }
  }, [categoryId]); // Re-fetch when categoryId changes

  return {
    blogs,
    loading,
    error,
    pagination,
    currentPage,
    fetchBlogs,
  };
}
