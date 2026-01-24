/**
 * Blog Detail Actions Component
 * 
 * @description أزرار التعديل والحذف
 * 
 * @dependencies
 * - Uses: components/ui/button (للأزرار)
 * - Used by: components/blogs/blog-detail-page.tsx
 * 
 * @props
 * - blogId: number (معرف المقال)
 * - onEdit: () => void (دالة التعديل)
 * - onDelete: () => void (دالة الحذف)
 * 
 * @related
 * - components/blogs/blog-detail-page.tsx (الصفحة الرئيسية)
 */

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface BlogDetailActionsProps {
  blogId: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function BlogDetailActions({
  blogId,
  onEdit,
  onDelete,
}: BlogDetailActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button onClick={onEdit} className="gap-2">
        <Edit className="h-4 w-4" />
        تعديل
      </Button>
      <Button variant="destructive" onClick={onDelete} className="gap-2">
        <Trash2 className="h-4 w-4" />
        حذف
      </Button>
    </div>
  );
}
