import publicApiInstance from "@/lib/publicApiInstance";

// Types based on API documentation
export interface AdminArticleCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  articles_count?: number;
}

export interface AdminArticleListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  main_image: string | null;
  published_at: string | null;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

export interface AdminArticle extends AdminArticleListItem {
  body: string;
  status: string;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    name: string;
  } | null;
  meta: {
    title: string | null;
    description: string | null;
    og_image: string | null;
  };
  cta: {
    enabled: boolean;
    text: string | null;
    url: string | null;
    target_blank: boolean;
  } | null;
}

export interface PaginationMeta {
  per_page: number;
  current_page: number;
  from: number;
  to: number;
  total: number;
  last_page: number;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  meta?: {
    pagination?: PaginationMeta;
  };
  message?: string;
  code?: string;
  timestamp?: string;
}

export interface CategoriesResponse {
  categories: AdminArticleCategory[];
}

export interface ArticlesResponse {
  articles: AdminArticleListItem[];
  category?: AdminArticleCategory;
}

export interface ArticleResponse {
  article: AdminArticle;
}

export interface CategoryArticlesResponse {
  category: AdminArticleCategory;
  articles: AdminArticleListItem[];
}

/**
 * Get all categories that have published articles
 * Endpoint: GET /api/public/admin-article-categories
 */
export async function getAdminArticleCategories(): Promise<AdminArticleCategory[]> {
  try {
    const response = await publicApiInstance.get<ApiResponse<CategoriesResponse>>(
      "/public/admin-article-categories"
    );

    if (response.data.status === "success" && response.data.data?.categories) {
      return response.data.data.categories;
    }

    throw new Error("Failed to fetch categories");
  } catch (error: any) {
    console.error("Error fetching admin article categories:", error);
    throw error;
  }
}

/**
 * Get articles in a specific category
 * Endpoint: GET /api/public/admin-article-categories/{slug}/articles
 */
export async function getCategoryArticles(
  categorySlug: string,
  options?: {
    per_page?: number;
    page?: number;
    search?: string;
    order_by?: string;
    order_dir?: "asc" | "desc";
  }
): Promise<{
  category: AdminArticleCategory;
  articles: AdminArticleListItem[];
  pagination?: PaginationMeta;
}> {
  try {
    const params = new URLSearchParams();
    if (options?.per_page) params.append("per_page", options.per_page.toString());
    if (options?.page) params.append("page", options.page.toString());
    if (options?.search) params.append("search", options.search);
    if (options?.order_by) params.append("order_by", options.order_by);
    if (options?.order_dir) params.append("order_dir", options.order_dir);

    const queryString = params.toString();
    const url = `/public/admin-article-categories/${categorySlug}/articles${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await publicApiInstance.get<ApiResponse<CategoryArticlesResponse>>(url);

    if (response.data.status === "success" && response.data.data) {
      return {
        category: response.data.data.category,
        articles: response.data.data.articles,
        pagination: response.data.meta?.pagination,
      };
    }

    throw new Error(
      response.data.message || "Failed to fetch category articles"
    );
  } catch (error: any) {
    console.error("Error fetching category articles:", error);
    throw error;
  }
}

/**
 * Get all published articles with optional filters
 * Endpoint: GET /api/public/admin-articles
 */
export async function getAllAdminArticles(options?: {
  per_page?: number;
  page?: number;
  category?: number;
  categories?: number[] | string;
  search?: string;
  order_by?: string;
  order_dir?: "asc" | "desc";
}): Promise<{
  articles: AdminArticleListItem[];
  pagination?: PaginationMeta;
}> {
  try {
    const params = new URLSearchParams();
    if (options?.per_page) params.append("per_page", options.per_page.toString());
    if (options?.page) params.append("page", options.page.toString());
    if (options?.category) params.append("category", options.category.toString());
    if (options?.categories) {
      if (Array.isArray(options.categories)) {
        params.append("categories", options.categories.join(","));
      } else {
        params.append("categories", options.categories);
      }
    }
    if (options?.search) params.append("search", options.search);
    if (options?.order_by) params.append("order_by", options.order_by);
    if (options?.order_dir) params.append("order_dir", options.order_dir);

    const queryString = params.toString();
    const url = `/public/admin-articles${queryString ? `?${queryString}` : ""}`;

    const response = await publicApiInstance.get<ApiResponse<ArticlesResponse>>(url);

    if (response.data.status === "success" && response.data.data?.articles) {
      return {
        articles: response.data.data.articles,
        pagination: response.data.meta?.pagination,
      };
    }

    throw new Error(response.data.message || "Failed to fetch articles");
  } catch (error: any) {
    console.error("Error fetching admin articles:", error);
    throw error;
  }
}

/**
 * Get a single article by slug
 * Endpoint: GET /api/public/admin-articles/{slug}
 */
export async function getAdminArticleBySlug(
  slug: string
): Promise<AdminArticle> {
  try {
    const response = await publicApiInstance.get<ApiResponse<ArticleResponse>>(
      `/public/admin-articles/${slug}`
    );

    if (response.data.status === "success" && response.data.data?.article) {
      return response.data.data.article;
    }

    throw new Error(
      response.data.message || "Article not found"
    );
  } catch (error: any) {
    console.error("Error fetching admin article:", error);
    throw error;
  }
}
