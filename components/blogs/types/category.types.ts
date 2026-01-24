/**
 * Category Types
 * 
 * @description أنواع البيانات للتصنيفات
 * 
 * @usedIn
 * - hooks/use-categories.ts
 * - services/category-api.ts
 * - components/form/blog-categories-selector.tsx
 * 
 * @related
 * - blog.types.ts (BlogPost uses Category)
 */

/**
 * Category Object (from API)
 */
export interface Category {
  id: number;
  name: string;
}

/**
 * API Response for List Categories
 */
export interface CategoriesListResponse {
  data: Category[];
}
