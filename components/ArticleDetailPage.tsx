"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  ChevronRight,
} from "lucide-react";
import SharedHeader from "./shared/SharedHeader";
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
      <SharedHeader activePage="updates" />

      {/* Article Header */}
      <section className="py-12 bg-gradient-to-br from-white via-gray-50/50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/updates"
            className="inline-flex items-center text-gray-600 hover:text-black mb-6 transition-colors"
          >
            <ChevronRight className="h-5 w-5 ml-1" />
            العودة إلى التحديثات
          </Link>

          {article.category && (
            <div className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-medium mb-4">
              {article.category.name}
            </div>
          )}

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
