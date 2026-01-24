/**
 * useBlogsList Hook
 * 
 * @description Hook لجلب قائمة المقالات مع pagination
 * 
 * @dependencies
 * - Uses: services/blog-api.ts (getBlogsList)
 * - Used by: components/blogs/blogs-list-page.tsx
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

export function useBlogsList(initialPage: number = 1, perPage: number = 15) {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const fetchBlogs = useCallback(
    async (page: number = currentPage) => {
      try {
        setLoading(true);
        setError(null);
        // GET /posts?per_page=15&page=1 - جلب قائمة المقالات
        const response = await blogApi.getBlogsList(page, perPage);
        setBlogs(response.data || []);
        setPagination(response.pagination || null);
        setCurrentPage(page);
      } catch (err: any) {
        console.error("Error fetching blogs list:", err);
        setError(err.message || "فشل في تحميل المقالات");
        setBlogs([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, perPage]
  );

  useEffect(() => {
    fetchBlogs(initialPage);
  }, []); // Only run on mount

  return {
    blogs,
    loading,
    error,
    pagination,
    currentPage,
    fetchBlogs,
  };
}
