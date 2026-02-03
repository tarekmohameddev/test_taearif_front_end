"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  ArrowDown,
  Rocket,
  CheckCircle,
  MessageCircle,
  Database,
  Calendar,
  Smartphone,
  Check,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import SharedHeader from "./shared/SharedHeader";
import { trackPageView } from "@/lib/gtm";
import {
  getAdminArticleCategories,
  getAllAdminArticles,
  getCategoryArticles,
  type AdminArticleCategory,
  type AdminArticleListItem,
} from "@/lib/api/admin-articles";

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
      const cats = await getAdminArticleCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  // Fetch articles
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

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
      setError(err.message || "حدث خطأ في تحميل التحديثات");
      setArticles([]);
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

    // Initialize animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
          }
        });
      },
      { threshold: 0.1 },
    );

    const animatedElements = document.querySelectorAll(".animate-slide-up");

    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
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
      <SharedHeader activePage="updates" />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-800 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 text-purple-600" />
              <span>آخر التحديثات</span>
            </div>
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
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-600 rounded-xl flex items-center justify-center ml-4">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
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

      {/* Coming Soon Section */}
      <section className="py-20 bg-gray-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-black">قريباً </span>
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                جداً
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              مميزات جديدة ومثيرة في الطريق إليكم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Coming Soon Feature 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-green-500 rounded-xl flex items-center justify-center ml-4">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">يناير 2025</div>
                  <div className="text-sm text-purple-600 font-medium">
                    متاح قريباً
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-2xl mb-4">جدولة الردود الآلية</h3>
              <p className="text-gray-600 mb-6 text-lg">
                برمج ردود واتساب لتصل في أوقات محددة وتفاعل مع العملاء بشكل أكثر
                احترافية
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  جدولة الرسائل مسبقاً
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  ردود تلقائية ذكية
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  تتبع حالة الرسائل
                </li>
              </ul>
            </div>

            {/* Coming Soon Feature 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-purple-500 rounded-xl flex items-center justify-center ml-4">
                  <Smartphone className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">فبراير 2025</div>
                  <div className="text-sm text-green-600 font-medium">
                    قيد التطوير
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-2xl mb-4">تطبيق الجوال</h3>
              <p className="text-gray-600 mb-6 text-lg">
                تطبيق جوال متكامل لإدارة عقاراتك وعملائك من أي مكان
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  رفع الصور والفيديو مباشرة
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  إشعارات فورية
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  عمل بدون إنترنت
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-black">خارطة </span>
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                الطريق
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تابع رحلة تطوير منصة تعاريف والمميزات القادمة
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Timeline Item 1 */}
              <div className="relative pr-8">
                <div className="absolute right-0 top-0 w-3 h-3 bg-black rounded-full border-3 border-white shadow-lg"></div>
                <div className="absolute right-1 top-3 w-0.5 h-full bg-gradient-to-b from-black to-transparent"></div>
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl">
                      المرحلة الأولى - مكتملة
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      مكتمل
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    إطلاق المنصة الأساسية مع مميزات إدارة العقارات والعملاء
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      إدارة العقارات
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      CRM
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      واتساب
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative pr-8">
                <div className="absolute right-0 top-0 w-3 h-3 bg-black rounded-full border-3 border-white shadow-lg"></div>
                <div className="absolute right-1 top-3 w-0.5 h-full bg-gradient-to-b from-black to-transparent"></div>
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl">
                      المرحلة الثانية - جاري العمل
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      قيد التطوير
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    تطوير الذكاء الاصطناعي وتحسين تجربة المستخدم
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      ذكاء اصطناعي
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      تحليلات متقدمة
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      أتمتة العمليات
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative pr-8">
                <div className="absolute right-0 top-0 w-3 h-3 bg-black rounded-full border-3 border-white shadow-lg"></div>
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl">
                      المرحلة الثالثة - قريباً
                    </h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      مخطط
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    إطلاق تطبيق الجوال والتكامل مع منصات خارجية
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      تطبيق الجوال
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      API متقدم
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      تكاملات خارجية
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <svg
                  version="1.0"
                  width="120"
                  height="80"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 565.000000 162.000000"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    transform="translate(0.000000,162.000000) scale(0.100000,-0.100000)"
                    fill="#FFFFFF"
                    stroke="none"
                  >
                    <path
                      d="M4182 1488 c-17 -17 -17 -1279 0 -1296 9 -9 128 -12 473 -12 l460 0
                    188 188 187 187 0 457 c0 402 -2 458 -16 472 -14 14 -86 16 -648 16 -478 0
                    -635 -3 -644 -12z m1030 -265 c17 -15 18 -37 18 -270 l0 -253 -112 0 c-150 0
                    -148 2 -148 -147 l0 -113 -140 0 -140 0 0 110 c0 97 -2 112 -20 130 -18 18
                    -33 20 -130 20 l-110 0 0 260 c0 236 2 260 18 269 10 7 152 11 381 11 325 0
                    366 -2 383 -17z"
                    ></path>
                    <path
                      d="M837 1274 c-4 -4 -7 -43 -7 -86 l0 -78 95 0 96 0 -3 83 -3 82 -85 3
                    c-47 1 -89 0 -93 -4z"
                    ></path>
                  </g>
                </svg>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                منصة تعاريف هي الحل الشامل لإدارة أعمالك العقارية بكفاءة
                واحترافية عالية
              </p>
              <div className="flex gap-4">
                <a
                  href="https://snapchat.com/t/WRXySyZi"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <i className="fa-brands fa-snapchat h-5"></i>
                </a>
                <a
                  href="https://www.facebook.com/share/1HZffKAhn2/"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/taearif1"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@taearif"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <i className="fa-brands fa-tiktok h-5"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => router.push("/")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    الرئيسية
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/solutions")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    الحلول
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/about-us")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    من نحن
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/updates")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    التحديثات
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/privacy")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    سياسة الخصوصية
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <Mail className="h-4 w-4" />
                  <span>info@taearif.com</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Phone className="h-4 w-4" />
                  <span>+966592960339</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>الرياض، المملكة العربية السعودية</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 تعاريف. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
