"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowRight, Calendar, FileText } from "lucide-react";
import Navbar from "@/components/landing/homepage/components/Navbar";
import Footer from "@/components/landing/homepage/components/Footer";
import {
  getSupportCenterArticleBySlug,
  type SupportCenterArticleDetail,
} from "@/lib/api/support-center";

interface SupportCenterArticlePageProps {
  articleSlug: string;
}

export default function SupportCenterArticlePage({
  articleSlug,
}: SupportCenterArticlePageProps) {
  const router = useRouter();
  const [article, setArticle] = useState<SupportCenterArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSupportCenterArticleBySlug(articleSlug);
        setArticle(data);
      } catch (err: any) {
        console.error("Error fetching article:", err);
        setError(err.message || "حدث خطأ في تحميل المقال");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleSlug]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Process CTA URL - use NEXTAUTH_URL for relative URLs
  const getCtaUrl = (url: string | null): string => {
    if (!url) return "#";
    
    // If URL is already absolute (starts with http:// or https://), use it as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    
    // If URL is relative, prepend NEXTAUTH_URL
    const nextAuthUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || process.env.NEXTAUTH_URL || "";
    
    // Remove trailing slash from NEXTAUTH_URL if exists
    const baseUrl = nextAuthUrl.replace(/\/$/, "");
    
    // Ensure URL starts with /
    const relativeUrl = url.startsWith("/") ? url : `/${url}`;
    
    return `${baseUrl}${relativeUrl}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden" dir="rtl">
        <Navbar />
        <div className="flex justify-center items-center py-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden" dir="rtl">
        <Navbar />
        <div className="text-center py-40">
          <p className="text-red-600 mb-4">{error || "المقال غير موجود"}</p>
          <Link
            href="/support-center"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-block"
          >
            العودة إلى مركز المساعدة
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" dir="rtl">
      <Navbar />

      {/* Article Header */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden pt-[200px]">
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* Category Link */}
          {article.category && (
            <Link
              href={`/support-center/${article.category.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <FileText className="h-4 w-4 ml-2" />
              <span>{article.category.name}</span>
            </Link>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{article.title}</h1>

          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
          )}

          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.published_at)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Main Image */}
          {article.main_image && (
            <div className="relative w-full h-96 mb-12 rounded-2xl overflow-hidden">
              <Image
                src={article.main_image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* CTA Button */}
          {article.cta_enabled && article.cta && article.cta.text && (
            <div className="mt-12 text-center">
              <a
                href={getCtaUrl(article.cta.url)}
                target={article.cta.target_blank ? "_blank" : "_self"}
                rel={article.cta.target_blank ? "noopener noreferrer" : undefined}
                className="inline-flex items-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all text-lg"
              >
                {article.cta.text}
                <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </div>
          )}

          {/* Back to Category */}
          {article.category && (
            <div className="mt-12 text-center">
              <Link
                href={`/support-center/${article.category.slug}`}
                className="text-blue-600 hover:text-blue-700 inline-flex items-center"
              >
                <ArrowRight className="h-4 w-4 ml-2 rotate-180" />
                العودة إلى {article.category.name}
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
