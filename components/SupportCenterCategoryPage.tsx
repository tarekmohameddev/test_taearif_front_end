"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
  FileText,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/landing/homepage/components/Navbar";
import Footer from "@/components/landing/homepage/components/Footer";
import {
  getCategoryArticles,
  type SupportCenterArticleListItem,
} from "@/lib/api/support-center";

interface SupportCenterCategoryPageProps {
  categorySlug: string;
}

export default function SupportCenterCategoryPage({
  categorySlug,
}: SupportCenterCategoryPageProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<SupportCenterArticleListItem[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch articles
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getCategoryArticles(categorySlug, {
        page: currentPage,
        per_page: 12,
        search: searchQuery || undefined,
        order_by: "published_at",
        order_dir: "desc",
      });

      setCategory(result.category);
      setArticles(result.articles);
      setPagination(result.pagination);
    } catch (err: any) {
      console.error("Error fetching articles:", err);
      setError(err.message || "حدث خطأ في تحميل المقالات");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, currentPage, searchQuery]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    // Reset to page 1 when search changes
    setCurrentPage(1);
  }, [searchQuery]);

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
            {category && (
              <>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {category.name}
                </h1>
                {category.short_description && (
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {category.short_description}
                  </p>
                )}
              </>
            )}

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في المقالات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
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
                    لا توجد مقالات متاحة حالياً
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article, index) => {
                    // Different gradient colors for variety
                    const gradients = [
                      "from-blue-500 to-cyan-500",
                      "from-purple-500 to-pink-500",
                      "from-green-500 to-emerald-500",
                      "from-orange-500 to-red-500",
                      "from-indigo-500 to-blue-500",
                      "from-pink-500 to-rose-500",
                    ];
                    const gradient = gradients[index % gradients.length];

                    return (
                      <Link
                        key={article.id}
                        href={`/support-center/article/${article.slug}`}
                        className="group relative bg-white rounded-3xl border border-gray-100 hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-200/50 hover:transform hover:-translate-y-3 transition-all duration-500 overflow-hidden"
                      >
                        {/* Gradient Background on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                        {/* Article Image */}
                        {article.main_image ? (
                          <div className="relative w-full h-56 overflow-hidden">
                            <Image
                              src={article.main_image}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                          </div>
                        ) : (
                          <div className={`relative w-full h-56 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                            <FileText className="h-16 w-16 text-white/80" />
                          </div>
                        )}

                        <div className="relative p-6">
                          {/* Date and Category */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(article.published_at)}</span>
                            </div>
                            {article.category && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                {article.category.name}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-xl mb-3 group-hover:text-gray-900 transition-colors text-gray-800 line-clamp-2 min-h-[3.5rem]">
                            {article.title}
                          </h3>

                          {/* Excerpt */}
                          {article.excerpt && (
                            <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed text-sm">
                              {article.excerpt}
                            </p>
                          )}

                          {/* Read More Button */}
                          <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full group-hover:bg-gradient-to-r group-hover:from-gray-100 group-hover:to-gray-50 transition-all duration-300`}>
                              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                اقرأ المزيد
                              </span>
                              <ArrowRight className="h-4 w-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
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
