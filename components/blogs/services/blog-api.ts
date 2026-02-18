/**
 * Blog API Service
 * 
 * @description جميع API calls المتعلقة بالمقالات
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
 * - DELETE /posts/{id} - حذف مقال
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
  // GET /posts?per_page=15&page=1
  const response = await axiosInstance.get("/posts", {
    params: {
      page,
      per_page: perPage,
    },
  });
  return response.data;
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
  // GET /posts?category_id={categoryId}&per_page=15&page=1
  const response = await axiosInstance.get("/posts", {
    params: {
      category_id: categoryId,
      page,
      per_page: perPage,
    },
  });
  return response.data;
}

/**
 * Get single post by ID
 * @param id - Post ID
 * @returns Promise with post data
 */
export async function getBlogById(id: number): Promise<BlogDetailResponse> {
  // GET /posts/{id}
  const response = await axiosInstance.get(`/posts/${id}`);
  return response.data;
}

/**
 * Get single post by slug
 * @param slug - Post slug
 * @returns Promise with post data
 */
export async function getBlogBySlug(slug: string): Promise<BlogDetailResponse> {
  // GET /posts/{slug}
  const response = await axiosInstance.get(`/posts/${slug}`);
  return response.data;
}

/**
 * Create new post
 * @param data - Post form data
 * @returns Promise with created post
 */
export async function createBlog(
  data: BlogFormData
): Promise<BlogCreateResponse> {
  // POST /posts
  const response = await axiosInstance.post("/posts", data);
  return response.data;
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
  // PUT /posts/{slug}
  const response = await axiosInstance.put(`/posts/${slug}`, data);
  return response.data;
}

/**
 * Delete post
 * @param id - Post ID
 * @returns Promise with success message
 */
export async function deleteBlog(id: number): Promise<{ message: string }> {
  // DELETE /posts/{id}
  const response = await axiosInstance.delete(`/posts/${id}`);
  return response.data;
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
  // Calculate from posts list and categories
  const postsResponse = await getBlogsList(1, 1000); // Get all posts
  const total_blogs = postsResponse.pagination.total;
  const total_views = postsResponse.data.reduce(
    (sum, post) => sum + (post.views || 0),
    0
  );
  
  // Get categories count
  const categoriesResponse = await axiosInstance.get("/categories");
  const total_categories = categoriesResponse.data.data?.length || 0;

  return {
    total_blogs,
    total_views,
    total_categories,
  };
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
