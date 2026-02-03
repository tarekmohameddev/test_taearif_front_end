import publicApiInstance from "@/lib/publicApiInstance";

// Types based on API documentation
export interface SupportCenterCategory {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  icon_image: string | null;
  articles_count: number;
}

export interface SupportCenterArticleListItem {
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
  };
}

export interface SupportCenterArticleDetail extends SupportCenterArticleListItem {
  body: string;
  cta_enabled: boolean;
  cta?: {
    text: string;
    url: string;
    target_blank: boolean;
  };
}

export interface PaginationMeta {
  per_page: number;
  current_page: number;
  from: number | null;
  to: number | null;
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
}

export interface CategoriesResponse {
  categories: SupportCenterCategory[];
}

export interface CategoryArticlesResponse {
  category: Omit<SupportCenterCategory, "articles_count"> & {
    icon_image: string | null;
  };
  articles: SupportCenterArticleListItem[];
}

export interface ArticlesListResponse {
  articles: SupportCenterArticleListItem[];
}

export interface ArticleDetailResponse {
  article: SupportCenterArticleDetail;
}

/**
 * Get all categories that have published articles
 * Endpoint: GET /public/support-center/categories
 */
export async function getSupportCenterCategories(): Promise<SupportCenterCategory[]> {
  try {
    const response = await publicApiInstance.get<ApiResponse<CategoriesResponse>>(
      "/public/support-center/categories"
    );

    if (response.data.status === "success" && response.data.data?.categories) {
      return response.data.data.categories;
    }

    throw new Error("Failed to fetch categories");
  } catch (error: any) {
    console.error("Error fetching support center categories:", error);
    throw error;
  }
}

/**
 * Get articles in a specific category
 * Endpoint: GET /public/support-center/categories/{slug}/articles
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
  category: Omit<SupportCenterCategory, "articles_count"> & {
    icon_image: string | null;
  };
  articles: SupportCenterArticleListItem[];
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
    const url = `/public/support-center/categories/${categorySlug}/articles${
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
 * Endpoint: GET /public/support-center/articles
 */
export async function getAllSupportCenterArticles(options?: {
  per_page?: number;
  page?: number;
  category?: number;
  categories?: number[] | string;
  search?: string;
  order_by?: string;
  order_dir?: "asc" | "desc";
}): Promise<{
  articles: SupportCenterArticleListItem[];
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
    const url = `/public/support-center/articles${queryString ? `?${queryString}` : ""}`;

    const response = await publicApiInstance.get<ApiResponse<ArticlesListResponse>>(url);

    if (response.data.status === "success" && response.data.data?.articles) {
      return {
        articles: response.data.data.articles,
        pagination: response.data.meta?.pagination,
      };
    }

    throw new Error(response.data.message || "Failed to fetch articles");
  } catch (error: any) {
    console.error("Error fetching support center articles:", error);
    throw error;
  }
}

/**
 * Get a single article by slug
 * Endpoint: GET /public/support-center/articles/{slug}
 */
export async function getSupportCenterArticleBySlug(
  slug: string
): Promise<SupportCenterArticleDetail> {
  try {
    const response = await publicApiInstance.get<ApiResponse<ArticleDetailResponse>>(
      `/public/support-center/articles/${slug}`
    );

    if (response.data.status === "success" && response.data.data?.article) {
      return response.data.data.article;
    }

    throw new Error(
      response.data.message || "Article not found"
    );
  } catch (error: any) {
    console.error("Error fetching support center article:", error);
    throw error;
  }
}
