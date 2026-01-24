/**
 * Blog Empty State Component
 * 
 * @description حالة فارغة موحدة (لا توجد مقالات)
 * 
 * @dependencies
 * - Uses: components/ui/button (لزر الإضافة)
 * - Used by: components/blogs/blogs-list-page.tsx
 * 
 * @related
 * - blog-loading-state.tsx (حالة التحميل)
 * - blog-error-state.tsx (حالة الخطأ)
 */

import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BlogEmptyStateProps {
  onCreateNew?: () => void;
}

export function BlogEmptyState({ onCreateNew }: BlogEmptyStateProps) {
  const router = useRouter();

  const handleCreate = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      router.push("/dashboard/blogs/create");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
        <FileText className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        لا توجد مقالات
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
        لم يتم إنشاء أي مقالات بعد. ابدأ بإنشاء مقالك الأول الآن.
      </p>
      <Button onClick={handleCreate} className="gap-2">
        <Plus className="h-4 w-4" />
        إضافة مقال جديد
      </Button>
    </div>
  );
}
