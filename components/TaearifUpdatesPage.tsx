"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  Rocket,
  CheckCircle,
  Calendar,
  Smartphone,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/landing/homepage/components/Navbar";
import Footer from "@/components/landing/homepage/components/Footer";
import { trackPageView } from "@/lib/gtm";
import {
  getAdminArticleCategories,
  getAllAdminArticles,
  getCategoryArticles,
  type AdminArticleCategory,
  type AdminArticleListItem,
} from "@/lib/api/admin-articles";

// Dummy data for development
const DUMMY_CATEGORIES: AdminArticleCategory[] = [
  {
    id: 1,
    name: "مميزات جديدة",
    slug: "new-features",
    description: "أحدث المميزات والإضافات",
    articles_count: 5,
  },
  {
    id: 2,
    name: "تحسينات",
    slug: "improvements",
    description: "تحسينات على المميزات الموجودة",
    articles_count: 8,
  },
  {
    id: 3,
    name: "إصلاحات",
    slug: "fixes",
    description: "إصلاح الأخطاء والمشاكل",
    articles_count: 3,
  },
];

const DUMMY_ARTICLES: AdminArticleListItem[] = [
  {
    id: 1,
    title: "إطلاق ميزة إدارة العقارات المتقدمة",
    slug: "advanced-property-management",
    excerpt: "نفخر بإطلاق ميزة جديدة لإدارة العقارات بشكل أكثر احترافية وكفاءة",
    main_image: null,
    published_at: new Date().toISOString(),
    category: {
      id: 1,
      name: "مميزات جديدة",
      slug: "new-features",
    },
  },
  {
    id: 2,
    title: "تحسينات على نظام CRM",
    slug: "crm-improvements",
    excerpt: "تم تحسين نظام إدارة العملاء ليكون أسرع وأكثر سهولة في الاستخدام",
    main_image: null,
    published_at: new Date(Date.now() - 86400000).toISOString(),
    category: {
      id: 2,
      name: "تحسينات",
      slug: "improvements",
    },
  },
  {
    id: 3,
    title: "إصلاح مشكلة في نظام التقارير",
    slug: "reports-fix",
    excerpt: "تم إصلاح مشكلة في عرض التقارير الإحصائية",
    main_image: null,
    published_at: new Date(Date.now() - 172800000).toISOString(),
    category: {
      id: 3,
      name: "إصلاحات",
      slug: "fixes",
    },
  },
  {
    id: 4,
    title: "ميزة جديدة: إشعارات واتساب",
    slug: "whatsapp-notifications",
    excerpt: "أضفنا ميزة إرسال إشعارات تلقائية عبر واتساب للعملاء",
    main_image: null,
    published_at: new Date(Date.now() - 259200000).toISOString(),
    category: {
      id: 1,
      name: "مميزات جديدة",
      slug: "new-features",
    },
  },
  {
    id: 5,
    title: "تحسين واجهة المستخدم",
    slug: "ui-improvements",
    excerpt: "تم تحديث واجهة المستخدم لتكون أكثر جمالاً وسهولة",
    main_image: null,
    published_at: new Date(Date.now() - 345600000).toISOString(),
    category: {
      id: 2,
      name: "تحسينات",
      slug: "improvements",
    },
  },
  {
    id: 6,
    title: "إصلاح مشكلة في التصدير",
    slug: "export-fix",
    excerpt: "تم إصلاح مشكلة في تصدير البيانات إلى Excel",
    main_image: null,
    published_at: new Date(Date.now() - 432000000).toISOString(),
    category: {
      id: 3,
      name: "إصلاحات",
      slug: "fixes",
    },
  },
];

const isDevelopment = process.env.NODE_ENV === "development";

export default function TaearifUpdatesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminArticleCategory[]>([]);
  const [articles, setArticles] = useState<AdminArticleListItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      if (isDevelopment) {
        // Use dummy data in development
        setCategories(DUMMY_CATEGORIES);
        return;
      }
      const cats = await getAdminArticleCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Fallback to dummy data in development if API fails
      if (isDevelopment) {
        setCategories(DUMMY_CATEGORIES);
      }
    }
  }, []);

  // Fetch articles
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (isDevelopment) {
        // Use dummy data in development
        let filteredArticles = [...DUMMY_ARTICLES];

        // Filter by category if selected
        if (selectedCategory) {
          filteredArticles = filteredArticles.filter(
            (article) => article.category?.slug === selectedCategory
          );
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredArticles = filteredArticles.filter(
            (article) =>
              article.title.toLowerCase().includes(query) ||
              article.excerpt?.toLowerCase().includes(query)
          );
        }

        // Pagination
        const perPage = 12;
        const startIndex = (currentPage - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

        setArticles(paginatedArticles);
        setPagination({
          per_page: perPage,
          current_page: currentPage,
          from: startIndex + 1,
          to: Math.min(endIndex, filteredArticles.length),
          total: filteredArticles.length,
          last_page: Math.ceil(filteredArticles.length / perPage),
        });
        setLoading(false);
        return;
      }

      let result;
      if (selectedCategory) {
        result = await getCategoryArticles(selectedCategory, {
          page: currentPage,
          per_page: 12,
          search: searchQuery || undefined,
          order_by: "published_at",
          order_dir: "desc",
        });
        setArticles(result.articles);
        setPagination(result.pagination);
      } else {
        result = await getAllAdminArticles({
          page: currentPage,
          per_page: 12,
          search: searchQuery || undefined,
          order_by: "published_at",
          order_dir: "desc",
        });
        setArticles(result.articles);
        setPagination(result.pagination);
      }
    } catch (err: any) {
      console.error("Error fetching articles:", err);
      // Fallback to dummy data in development if API fails
      if (isDevelopment) {
        setArticles(DUMMY_ARTICLES);
        setPagination({
          per_page: 12,
          current_page: 1,
          from: 1,
          to: DUMMY_ARTICLES.length,
          total: DUMMY_ARTICLES.length,
          last_page: 1,
        });
      } else {
        setError(err.message || "حدث خطأ في تحميل التحديثات");
        setArticles([]);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    // Reset to page 1 when category or search changes
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    // Track page view
    trackPageView("/updates", "Updates Page");
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" dir="rtl">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden pt-[200px]">
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-black">مميزات جديدة</span>
              <br />
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                تطور مستمر
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              نعمل باستمرار على تطوير منصة تعاريف لتقديم أفضل تجربة لعملائنا في
              القطاع العقاري
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() =>
                  document
                    .getElementById("latest-updates")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all text-lg"
              >
                <ArrowDown className="h-5 w-5 ml-2" />
                شاهد التحديثات
              </button>
              <button
                onClick={() => router.push("/register")}
                className="inline-flex items-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all text-lg"
              >
                <Rocket className="h-5 w-5 ml-2" />
                جرّب الآن
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section id="latest-updates" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-black">التحديثات </span>
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                الأخيرة
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اكتشف أحدث المميزات والتحسينات التي أضفناها لمنصة تعاريف
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في التحديثات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  الكل
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.slug
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                    {category.articles_count !== undefined && (
                      <span className="mr-1">({category.articles_count})</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchArticles}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && !error && (
            <>
              {articles.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">
                    لا توجد تحديثات متاحة حالياً
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/updates/${article.slug}`}
                      className="relative bg-white rounded-2xl border border-gray-200 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-sm overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-black to-gray-600"></div>
                      
                      {/* Article Image */}
                      {article.main_image && (
                        <div className="relative w-full h-48 overflow-hidden">
                          <Image
                            src={article.main_image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-600 rounded-xl flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-sm">
                              {formatDate(article.published_at)}
                            </div>
                            {article.category && (
                              <div className="text-xs text-gray-500">
                                {article.category.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <h3 className="font-bold text-xl mb-3 group-hover:text-gray-600 transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>
                        )}
                        {article.category && (
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                              {article.category.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    صفحة {pagination.current_page} من {pagination.last_page}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(pagination.last_page, p + 1)
                      )
                    }
                    disabled={currentPage === pagination.last_page}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
