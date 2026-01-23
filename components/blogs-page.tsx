// components/blogs-page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination2";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import useStore from "@/context/Store"; // استيراد الـ store

// تعريف الواجهات (Interfaces) للمدونة
interface Author {
  id: number;
  name: string;
}

export interface IBlogPost {
  id: number;
  title: string;
  excerpt: string;
  featured_image: string;
  category: string;
  status: string;
  tags: string[];
  published_at: string;
  views: number;
  comments: number;
  featured: boolean;
  author: Author;
  created_at: string;
  updated_at: string;
}

export interface IPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

// دالة لتحويل التاريخ إلى تنسيق عربي مبسط
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// دالة التحقق مما إذا كانت الصورة صالحة بناءً على امتداد الملف
const getImageUrl = (url: string): string => {
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  if (url && validExtensions.some((ext) => url.toLowerCase().endsWith(ext))) {
    return url;
  }
  return "/placeholder.svg"; // صورة بديلة في حال عدم صلاحية URL الصورة
};

export default function BlogsPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("blog");
  const router = useRouter();
  const {
    blogsData: { posts, pagination, isBlogsFetched, loading, error },
    fetchBlogs,
    setBlogsData,
  } = useStore();

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchBlogs(1); // جلب الصفحة الأولى عند تحميل الصفحة
  }, [fetchBlogs]);

  // دالة للتعامل مع تغيير الصفحة
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagination?.last_page || 1)) {
      fetchBlogs(page);
    }
  };

  // دالة لإنشاء مصفوفة أرقام الصفحات للعرض
  const getPageNumbers = () => {
    if (!pagination) return [];

    const currentPage = pagination.current_page;
    const lastPage = pagination.last_page;
    const pages = [];

    // إذا كان عدد الصفحات أقل من أو يساوي 7، اعرض جميع الصفحات
    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
      return pages;
    }

    // إظهار أقصى 5 صفحات حول الصفحة الحالية
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(lastPage, currentPage + 2);

    // إضافة الصفحة الأولى إذا لم تكن مدرجة
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    // إضافة الصفحات المحيطة بالصفحة الحالية
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // إضافة الصفحة الأخيرة إذا لم تكن مدرجة
    if (end < lastPage) {
      if (end < lastPage - 1) pages.push("...");
      pages.push(lastPage);
    }

    return pages;
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">المدونة</h1>
                <p className="text-muted-foreground">
                  إدارة ونشر محتوى المدونة الخاص بك
                </p>
              </div>
              <Button
                className="flex items-center gap-2"
                onClick={() => router.push("/blogs/add")}
              >
                <Plus className="h-4 w-4" />
                <span>إضافة مقال جديد</span>
              </Button>
            </div>

            {loading ? (
              // عرض Skeleton Loading أثناء تحميل البيانات
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-md border p-6 animate-pulse"
                  >
                    <div className="aspect-video w-full bg-gray-300 rounded" />
                    <div className="mt-4 space-y-2">
                      <div className="h-5 w-3/4 bg-gray-300 rounded" />
                      <div className="h-4 w-full bg-gray-300 rounded" />
                      <div className="h-4 w-5/6 bg-gray-300 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post: IBlogPost) => (
                    <Card
                      key={post.id}
                      className="overflow-hidden flex flex-col"
                    >
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={getImageUrl(post.featured_image)}
                          alt={post.title}
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg line-clamp-1">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="mt-1 line-clamp-2">
                              {post.excerpt}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">القائمة</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" />
                                <span>تعديل</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Eye className="h-4 w-4" />
                                <span>معاينة</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash className="h-4 w-4" />
                                <span>حذف</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span>الكاتب: {post.author.name}</span>
                          <span>•</span>
                          <span>التاريخ: {formatDate(post.published_at)}</span>
                          <span>•</span>
                          <span>التصنيف: {post.category}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : post.status === "draft"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {post.status === "published"
                              ? "منشور"
                              : post.status === "draft"
                                ? "مسودة"
                                : post.status}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{post.views} مشاهدة</span>
                          <span>{post.comments} تعليق</span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {pagination && pagination.last_page > 1 && (
                  <div className="mt-6 space-y-4">
                    <Pagination>
                      <PaginationContent className="flex flex-wrap justify-center gap-1 sm:gap-2">
                        {/* زر الصفحة السابقة */}
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              handlePageChange(pagination.current_page - 1)
                            }
                            className={`cursor-pointer transition-colors ${
                              pagination.current_page <= 1
                                ? "pointer-events-none opacity-50"
                                : "hover:bg-gray-100"
                            }`}
                          />
                        </PaginationItem>

                        {/* أرقام الصفحات */}
                        {getPageNumbers().map((page, index) => (
                          <PaginationItem key={index}>
                            {page === "..." ? (
                              <span className="px-2 sm:px-3 py-2 text-muted-foreground text-sm">
                                ...
                              </span>
                            ) : (
                              <PaginationLink
                                onClick={() => handlePageChange(page as number)}
                                isActive={pagination.current_page === page}
                                className={`cursor-pointer transition-colors text-sm ${
                                  pagination.current_page === page
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                {page}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}

                        {/* زر الصفحة التالية */}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              handlePageChange(pagination.current_page + 1)
                            }
                            className={`cursor-pointer transition-colors ${
                              pagination.current_page >= pagination.last_page
                                ? "pointer-events-none opacity-50"
                                : "hover:bg-gray-100"
                            }`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>

                    {/* معلومات إضافية عن الصفحة */}
                    <div className="text-center text-xs sm:text-sm text-muted-foreground">
                      عرض {pagination.from} إلى {pagination.to} من أصل{" "}
                      {pagination.total} مقال
                      <span className="block sm:inline sm:mr-2 sm:ml-2">•</span>
                      الصفحة {pagination.current_page} من {pagination.last_page}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
