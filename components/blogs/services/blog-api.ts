/**
 * Blog API Service
 *
 * @description جميع API calls المتعلقة بالمقالات
 * @see docs/important/prompts/PREVENT_DUPLICATE_API_PROMPT.md — منع الطلبات المكررة (loading/cache/last-fetched)
 *
 * @dependencies
 * - Uses: lib/axiosInstance.js (للطلبات)
 * - Used by: hooks/use-blogs-list.ts, hooks/use-blog-detail.ts, hooks/use-blog-form.ts
 *
 * @endpoints
 * - GET /posts - قائمة المقالات
 * - GET /posts/{id} - تفاصيل مقال
 * - POST /posts - إنشاء مقال
 * - PUT /posts/{slug} - تحديث مقال
 * - DELETE /posts/{slug} - حذف مقال
 *
 * @related
 * - types/blog.types.ts (جميع الأنواع المستخدمة)
 * - docs/ExcessFiles/blogs.txt (وثائق API)
 */

import axiosInstance from "@/lib/axiosInstance";
import type {
  BlogsListResponse,
  BlogDetailResponse,
  BlogCreateResponse,
  BlogFormData,
  BlogListItem,
  BlogPost,
  Pagination,
} from "../types/blog.types";

// ─── منع الطلبات المكررة (مأخوذ من PREVENT_DUPLICATE_API_PROMPT / TENANT_STORE_AND_API) ───
const LAST_FETCH_WINDOW_MS = 300;

const inFlight = new Map<string, Promise<unknown>>();
const cache = new Map<string, { data: unknown; ts: number }>();
let lastFetchedKey: string | null = null;
let lastFetchedTs = 0;

function cacheKey(prefix: string, ...parts: (string | number)[]): string {
  return [prefix, ...parts].join(":");
}

/** Guard 1: طلب قيد التنفيذ لنفس المفتاح → إرجاع نفس الـ Promise. Guard 2: بيانات في الكاش لنفس المفتاح → إرجاعها. */
async function withDedup<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  const now = Date.now();

  if (inFlight.has(key)) {
    return inFlight.get(key) as Promise<T>;
  }

  const cached = cache.get(key);
  if (cached != null) {
    return cached.data as T;
  }

  const promise = fetchFn()
    .then((data) => {
      cache.set(key, { data, ts: now });
      lastFetchedKey = key;
      lastFetchedTs = now;
      inFlight.delete(key);
      return data;
    })
    .catch((err) => {
      inFlight.delete(key);
      throw err;
    });

  inFlight.set(key, promise);
  return promise as Promise<T>;
}

/** للعمليات (create/update/delete): منع تنفيذ مكرر لنفس المفتاح فقط (إرجاع نفس الـ Promise). */
async function withMutationDedup<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  if (inFlight.has(key)) {
    return inFlight.get(key) as Promise<T>;
  }
  const promise = fetchFn()
    .then((data) => {
      inFlight.delete(key);
      return data;
    })
    .catch((err) => {
      inFlight.delete(key);
      throw err;
    });
  inFlight.set(key, promise);
  return promise as Promise<T>;
}

/**
 * Get list of all posts (published + drafts)
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 15)
 * @returns Promise with blogs list and pagination
 */
export async function getBlogsList(
  page: number = 1,
  perPage: number = 15
): Promise<BlogsListResponse> {
  const key = cacheKey("list", page, perPage);
  return withDedup(key, async () => {
    const response = await axiosInstance.get("/posts", {
      params: { page, per_page: perPage },
    });
    return response.data;
  });
}

/**
 * Get list of posts by category ID
 * @param categoryId - Category ID
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 15)
 * @returns Promise with blogs list and pagination
 */
export async function getBlogsByCategory(
  categoryId: number,
  page: number = 1,
  perPage: number = 15
): Promise<BlogsListResponse> {
  const key = cacheKey("category", categoryId, page, perPage);
  return withDedup(key, async () => {
    const response = await axiosInstance.get("/posts", {
      params: {
        category_id: categoryId,
        page,
        per_page: perPage,
      },
    });
    return response.data;
  });
}

/**
 * Get single post by ID
 * @param id - Post ID
 * @returns Promise with post data
 */
export async function getBlogById(id: number): Promise<BlogDetailResponse> {
  const key = cacheKey("id", id);
  return withDedup(key, async () => {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  });
}

/**
 * Get single post by slug
 * @param slug - Post slug
 * @returns Promise with post data
 */
export async function getBlogBySlug(slug: string): Promise<BlogDetailResponse> {
  const key = cacheKey("slug", slug);
  return withDedup(key, async () => {
    const response = await axiosInstance.get(`/posts/${slug}`);
    return response.data;
  });
}

/**
 * Create new post
 * @param data - Post form data
 * @returns Promise with created post
 */
export async function createBlog(
  data: BlogFormData
): Promise<BlogCreateResponse> {
  return withMutationDedup("create", async () => {
    const response = await axiosInstance.post("/posts", data);
    return response.data;
  });
}

/**
 * Update existing post
 * @param slug - Post slug
 * @param data - Updated post data (partial)
 * @returns Promise with updated post
 */
export async function updateBlog(
  slug: string,
  data: Partial<BlogFormData>
): Promise<BlogCreateResponse> {
  return withMutationDedup(`update:${slug}`, async () => {
    const response = await axiosInstance.put(`/posts/${slug}`, data);
    return response.data;
  });
}

/**
 * Delete post
 * @param slug - Post slug
 * @returns Promise with success message
 */
export async function deleteBlog(slug: string): Promise<{ message: string }> {
  return withMutationDedup(`delete:${slug}`, async () => {
    const response = await axiosInstance.delete(`/posts/${slug}`);
    return response.data;
  });
}

/**
 * Get blog statistics
 * Calculates stats from posts list and categories
 * @returns Promise with stats
 */
export async function getBlogStats(): Promise<{
  total_blogs: number;
  total_views: number;
  total_categories: number;
}> {
  const key = "stats";
  return withDedup(key, async () => {
    const postsResponse = await getBlogsList(1, 1000);
    const total_blogs = postsResponse.pagination.total;
    const total_views = postsResponse.data.reduce(
      (sum, post) => sum + (post.views || 0),
      0
    );
    const categoriesResponse = await axiosInstance.get("/categories");
    const total_categories = categoriesResponse.data.data?.length || 0;
    return {
      total_blogs,
      total_views,
      total_categories,
    };
  });
}

// Export all functions as default object
export const blogApi = {
  getBlogsList,
  getBlogsByCategory,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogStats,
};
