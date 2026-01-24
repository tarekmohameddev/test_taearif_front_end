/**
 * Blog Error State Component
 * 
 * @description حالة الخطأ الموحدة للمكونات
 * 
 * @dependencies
 * - Uses: components/ui/alert (لعرض الخطأ)
 * - Used by: components/blogs/blogs-list-page.tsx, components/blogs/blog-detail-page.tsx
 * 
 * @related
 * - blog-loading-state.tsx (حالة التحميل)
 * - blog-empty-state.tsx (حالة فارغة)
 */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function BlogErrorState({
  title = "حدث خطأ",
  message = "فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.",
  onRetry,
}: BlogErrorStateProps) {
  return (
    <Alert variant="destructive" className="my-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {message}
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-4"
          >
            إعادة المحاولة
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
