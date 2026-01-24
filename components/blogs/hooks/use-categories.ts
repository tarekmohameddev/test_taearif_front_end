/**
 * useCategories Hook
 * 
 * @description Hook لجلب قائمة التصنيفات
 * 
 * @dependencies
 * - Uses: services/category-api.ts (getCategories)
 * - Used by: 
 *   - components/form/blog-categories-selector.tsx
 *   - hooks/use-blog-form.ts
 * 
 * @returns {Object} { categories, loading, error, refetch }
 * 
 * @related
 * - types/category.types.ts (Category type)
 * - services/category-api.ts (API calls)
 */

import { useState, useEffect } from "react";
import { categoryApi } from "../services/category-api";
import type { Category } from "../types/category.types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      // GET /categories - جلب قائمة التصنيفات
      const response = await categoryApi.getCategories();
      setCategories(response.data || []);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.message || "فشل في تحميل التصنيفات");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
