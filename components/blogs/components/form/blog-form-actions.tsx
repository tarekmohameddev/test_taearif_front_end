/**
 * Blog Form Actions Component
 * 
 * @description أزرار الحفظ والإلغاء
 * 
 * @dependencies
 * - Uses: components/ui/button (للأزرار)
 * - Used by: components/blogs/blog-form.tsx
 * 
 * @props
 * - mode: "create" | "edit" (وضع النموذج)
 * - loading: boolean (حالة التحميل)
 * - onCancel: () => void (دالة الإلغاء)
 * 
 * @related
 * - components/blogs/blog-form.tsx (النموذج الرئيسي)
 */

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BlogFormActionsProps {
  mode: "create" | "edit";
  loading: boolean;
  onCancel: () => void;
}

export function BlogFormActions({
  mode,
  loading,
  onCancel,
}: BlogFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-4 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
        إلغاء
      </Button>
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "create" ? "إنشاء المقال" : "حفظ التغييرات"}
      </Button>
    </div>
  );
}
