/**
 * Blog Stats Cards Component
 * 
 * @description يعرض 3 بطاقات إحصائية: إجمالي المقالات، المشاهدات، التصنيفات
 * 
 * @dependencies
 * - Uses: hooks/use-blog-stats.ts (للحصول على البيانات)
 * - Uses: components/stats/blog-stat-card.tsx (لرسم كل بطاقة)
 * - Used by: components/blogs/blogs-list-page.tsx
 * 
 * @related
 * - services/blog-api.ts (للحصول على الإحصائيات)
 * - types/blog.types.ts (BlogStats type)
 */

import { FileText, Eye, Tag } from "lucide-react";
import { useBlogStats } from "../../hooks/use-blog-stats";
import { BlogStatCard } from "./blog-stat-card";
import { formatNumber } from "../../utils/blog-formatters";

export function BlogStatsCards() {
  // يستخدم useBlogStats للحصول على الإحصائيات (يستخدم blog-api.ts داخلياً)
  const { stats, loading } = useBlogStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
      {/* بطاقة إجمالي المقالات */}
      <BlogStatCard
        title="إجمالي المقالات"
        value={formatNumber(stats.total_blogs)}
        icon={FileText}
        color="text-blue-600 dark:text-blue-400"
        bgColor="bg-blue-100 dark:bg-blue-900"
        loading={loading}
      />

      {/* بطاقة إجمالي المشاهدات */}
      <BlogStatCard
        title="إجمالي المشاهدات"
        value={formatNumber(stats.total_views)}
        icon={Eye}
        color="text-green-600 dark:text-green-400"
        bgColor="bg-green-100 dark:bg-green-900"
        loading={loading}
      />

      {/* بطاقة إجمالي التصنيفات */}
      <BlogStatCard
        title="إجمالي التصنيفات"
        value={formatNumber(stats.total_categories)}
        icon={Tag}
        color="text-purple-600 dark:text-purple-400"
        bgColor="bg-purple-100 dark:bg-purple-900"
        loading={loading}
      />
    </div>
  );
}
