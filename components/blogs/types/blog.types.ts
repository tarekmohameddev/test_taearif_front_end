/**
 * Blog Types
 * 
 * @description جميع الأنواع المتعلقة بالمقالات
 * 
 * @usedIn
 * - components/blogs/* (جميع مكونات المدونة)
 * - hooks/use-blogs-list.ts, hooks/use-blog-detail.ts, hooks/use-blog-form.ts
 * - services/blog-api.ts (request/response types)
 * 
 * @related
 * - category.types.ts (Category types)
 * - media.types.ts (Media types)
 */

/**
 * Media Object (from API)
 */
export interface Media {
  id: number;
  url: string;
  type: "image" | "video";
  created_at: string;
}

/**
 * Category Object (from API)
 */
export interface Category {
  id: number;
  name: string;
}

/**
 * Author Object (from API)
 */
export interface Author {
  id: number;
  name: string;
}

/**
 * Blog Post (Full) - Complete post data from API
 * Used in detail page and edit form
 */
export interface BlogPost {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string; // HTML content
  excerpt: string | null;
  thumbnail: Media | null;
  status: "draft" | "published";
  published_at: string | null; // ISO 8601 datetime
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  categories: Category[];
  media: Media[];
  author: Author | null;
}

/**
 * Blog List Item - Simplified post data for table/list view
 */
export interface BlogListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: Media | null;
  published_at: string | null;
  status: "draft" | "published";
  views?: number; // Optional, may not be in API response
}

/**
 * Blog Form Data - Data structure for create/edit form
 */
export interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: "draft" | "published";
  thumbnail_id: number | null;
  category_ids: number[];
  media_ids: number[];
}

/**
 * Blog Stats - Statistics data
 */
export interface BlogStats {
  total_blogs: number;
  total_views: number;
  total_categories: number;
}

/**
 * Pagination Object (from API)
 */
export interface Pagination {
  per_page: number;
  current_page: number;
  from: number | null;
  to: number | null;
  total: number;
  last_page: number;
}

/**
 * API Response for List Posts
 */
export interface BlogsListResponse {
  data: BlogListItem[];
  pagination: Pagination;
}

/**
 * API Response for Single Post
 */
export interface BlogDetailResponse {
  data: BlogPost;
}

/**
 * API Response for Create/Update Post
 */
export interface BlogCreateResponse {
  data: BlogPost;
}

/**
 * API Response for Stats
 */
export interface BlogStatsResponse {
  total_blogs: number;
  total_views: number;
  total_categories: number;
}
