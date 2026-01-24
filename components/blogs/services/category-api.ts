/**
 * Category API Service
 * 
 * @description جميع API calls المتعلقة بالتصنيفات
 * 
 * @dependencies
 * - Uses: lib/axiosInstance.js (للطلبات)
 * - Used by: hooks/use-categories.ts
 * 
 * @endpoints
 * - GET /categories - قائمة التصنيفات
 * 
 * @related
 * - types/category.types.ts (Category type)
 * - docs/ExcessFiles/blogs.txt (وثائق API)
 */

import axiosInstance from "@/lib/axiosInstance";
import type { CategoriesListResponse } from "../types/category.types";

/**
 * Get list of all categories
 * @returns Promise with categories list
 */
export async function getCategories(): Promise<CategoriesListResponse> {
  // GET /categories
  const response = await axiosInstance.get("/categories");
  return response.data;
}

// Export all functions as default object
export const categoryApi = {
  getCategories,
};
