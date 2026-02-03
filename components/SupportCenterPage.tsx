"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, BookOpen, HelpCircle, FileText, Loader2, ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/homepage/components/Navbar";
import Footer from "@/components/landing/homepage/components/Footer";
import { trackPageView } from "@/lib/gtm";
import {
  getSupportCenterCategories,
  type SupportCenterCategory,
} from "@/lib/api/support-center";

export default function SupportCenterPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<SupportCenterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cats = await getSupportCenterCategories();
      setCategories(cats);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.message || "حدث خطأ في تحميل الفئات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    // Track page view
    trackPageView("/support-center", "Support Center Page");
  }, []);

  // Filter categories based on search
  const filteredCategories = categories.filter((category) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      category.short_description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" dir="rtl">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden pt-[200px]">
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-black">مركز المساعدة</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              ابحث عن إجابات لأسئلتك أو تصفح مقالات المساعدة حسب الفئة
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في مركز المساعدة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
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
                onClick={fetchCategories}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* Categories Grid */}
          {!loading && !error && (
            <>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">
                    {searchQuery
                      ? "لا توجد نتائج للبحث"
                      : "لا توجد فئات متاحة حالياً"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      تصفح حسب الفئة
                    </h2>
                    <p className="text-gray-600">
                      اختر الفئة التي تهمك لتصفح مقالات المساعدة
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCategories.map((category, index) => {
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
                          key={category.id}
                          href={`/support-center/${category.slug}`}
                          className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-200/50 hover:transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                        >
                          {/* Gradient Background on Hover */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                          <div className="relative p-6 flex items-center gap-6">
                            {/* Icon with Gradient Background */}
                            <div className="flex-shrink-0">
                              {category.icon_image ? (
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-4 ring-gray-50 group-hover:ring-gray-100 transition-all duration-300">
                                  <Image
                                    src={category.icon_image}
                                    alt={category.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              ) : (
                                <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                                  <BookOpen className="h-10 w-10 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Category Name */}
                              <h3 className="font-bold text-xl mb-2 group-hover:text-gray-900 transition-colors text-gray-800">
                                {category.name}
                              </h3>

                              {/* Description */}
                              {category.short_description && (
                                <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed text-sm">
                                  {category.short_description}
                                </p>
                              )}

                              {/* Articles Count with Badge */}
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                                <FileText className="h-3.5 w-3.5 text-gray-600" />
                                <span className="text-xs font-medium text-gray-700">
                                  {category.articles_count} مقال
                                </span>
                              </div>
                            </div>

                            {/* Arrow Icon */}
                            <div className="flex-shrink-0">
                              <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                                <ArrowRight className="h-5 w-5 text-white" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
