"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  User,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/landing/homepage/components/Navbar";
import Footer from "@/components/landing/homepage/components/Footer";
import type { AdminArticle } from "@/lib/api/admin-articles";

interface ArticleDetailPageProps {
  article: AdminArticle;
}

export default function ArticleDetailPage({
  article,
}: ArticleDetailPageProps) {
  const router = useRouter();

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

      {/* Article Header */}
      <section className="pb-12 bg-gradient-to-br from-white via-gray-50/50 to-white pt-[150px]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            {article.category && (
              <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
                {article.category.name}
              </div>
            )}
            {!article.category && <div></div>}
            <Link
              href="/updates"
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <ChevronRight className="h-5 w-5 ml-1" />
              العودة إلى التحديثات
            </Link>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6">{article.title}</h1>

          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            {article.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(article.published_at)}</span>
              </div>
            )}
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{article.author.name}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Image */}
      {article.main_image && (
        <section className="py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src={article.main_image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-black prose-a:underline prose-img:rounded-lg prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* CTA Button */}
          {article.cta && article.cta.enabled && article.cta.url && (
            <div className="mt-12 text-center">
              <a
                href={article.cta.url}
                target={article.cta.target_blank ? "_blank" : "_self"}
                rel={article.cta.target_blank ? "noopener noreferrer" : undefined}
                className="inline-flex items-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all text-lg"
              >
                {article.cta.text || "اقرأ المزيد"}
                <ArrowRight className="h-5 w-5 mr-2" />
              </a>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
