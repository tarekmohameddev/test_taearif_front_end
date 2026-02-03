"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Sparkles, Loader2 } from "lucide-react";
import { getAllAdminArticles, type AdminArticleListItem } from "@/lib/api/admin-articles";

export default function UpdatesSection() {
  const [articles, setArticles] = useState<AdminArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("updates-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setLoading(true);
        const result = await getAllAdminArticles({
          per_page: 3,
          page: 1,
          order_by: "published_at",
          order_dir: "desc",
        });
        setArticles(result.articles.slice(0, 3));
      } catch (error) {
        console.error("Error fetching latest articles:", error);
        // Fallback to empty array on error
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <section id="updates-section" className="py-24 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-purple-100/30 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-cyan-100/30 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-indigo-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-100 mb-6"
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">مركز التحديثات</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-black mb-4"
          >
            آخر التحديثات والمميزات
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            اكتشف أحدث المميزات والتحسينات التي نضيفها باستمرار لتحسين تجربتك
          </motion.p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Articles Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {articles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">لا توجد تحديثات متاحة حالياً</p>
              </div>
            ) : (
              articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    href={`/updates/${article.slug}`}
                    className="block h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Image Container */}
                    <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200">
                      {article.main_image ? (
                        <>
                          <Image
                            src={article.main_image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-cyan-50 to-blue-50">
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <Sparkles className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Shine Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      
                      {/* Category Badge */}
                      {article.category && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-semibold text-gray-800 shadow-lg border border-gray-100">
                            {article.category.name}
                          </span>
                        </div>
                      )}

                      {/* Top Gradient Border */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-white">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <Calendar className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium">{formatDate(article.published_at)}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 transition-all duration-300 line-clamp-2 leading-tight">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed text-sm">
                          {article.excerpt}
                        </p>
                      )}

                      {/* Read More Link */}
                      <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                        <span>اقرأ المزيد</span>
                        <div className="p-1.5 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-300">
                          <ArrowLeft className="h-4 w-4 group-hover:translate-x-[-4px] transition-transform duration-300" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Border & Shadow */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-200 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 pointer-events-none"></div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/updates"
            className="relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-black via-gray-900 to-black text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 group overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button content */}
            <span className="relative z-10">عرض الكل</span>
            <div className="relative z-10 p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-300">
              <ArrowLeft className="h-5 w-5 group-hover:translate-x-[-6px] transition-transform duration-300" />
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
