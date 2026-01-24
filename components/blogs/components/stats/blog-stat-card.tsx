/**
 * Blog Stat Card Component
 * 
 * @description بطاقة إحصائية واحدة قابلة لإعادة الاستخدام
 * 
 * @dependencies
 * - Uses: components/ui/card (للبطاقة)
 * - Used by: components/stats/blog-stats-cards.tsx
 * 
 * @props
 * - title: string (عنوان البطاقة)
 * - value: string | number (القيمة)
 * - icon: React.ComponentType (أيقونة)
 * - color: string (لون النص)
 * - bgColor: string (لون الخلفية)
 * - loading?: boolean (حالة التحميل)
 * 
 * @related
 * - blog-stats-cards.tsx (Container للبطاقات)
 */

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface BlogStatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  loading?: boolean;
}

export function BlogStatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  loading = false,
}: BlogStatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            {loading ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-gray-400 text-sm">جاري التحميل...</span>
              </div>
            ) : (
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            )}
          </div>
          <div
            className={`h-12 w-12 ${bgColor} rounded-lg flex items-center justify-center`}
          >
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
