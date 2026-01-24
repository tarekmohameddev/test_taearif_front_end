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
 * - PUT /posts/{id} - تحديث مقال
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
 * @param id - Post ID
 * @param data - Updated post data (partial)
 * @returns Promise with updated post
 */
export async function updateBlog(
  id: number,
  data: Partial<BlogFormData>
): Promise<BlogCreateResponse> {
  // PUT /posts/{id}
  const response = await axiosInstance.put(`/posts/${id}`, data);
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
 * Note: This endpoint may need to be created on backend
 * For now, we'll calculate from posts list
 * @returns Promise with stats
 */
export async function getBlogStats(): Promise<{
  total_blogs: number;
  total_views: number;
  total_categories: number;
}> {
  // This might need a separate endpoint like GET /posts/stats
  // For now, we'll fetch all posts and calculate
  // Or use a dedicated stats endpoint if available
  try {
    // Try dedicated stats endpoint first
    const response = await axiosInstance.get("/posts/stats");
    return response.data;
  } catch (error) {
    // Fallback: calculate from posts list
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
}

// Export all functions as default object
export const blogApi = {
  getBlogsList,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogStats,
};
