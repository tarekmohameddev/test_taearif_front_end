/**
 * Blog Table Actions Component
 * 
 * @description قائمة الإجراءات (dropdown) لكل مقال في الجدول
 * 
 * @dependencies
 * - Uses: components/ui/dropdown-menu (للـ dropdown)
 * - Used by: components/table/blog-table-row.tsx
 * 
 * @props
 * - blogId: number (معرف المقال)
 * - onEdit: () => void (دالة التعديل)
 * - onDelete: () => void (دالة الحذف)
 * - onView: () => void (دالة العرض)
 * 
 * @related
 * - blog-table-row.tsx (الصف الذي يحتوي على هذا المكون)
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

interface BlogTableActionsProps {
  blogId: number;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export function BlogTableActions({
  blogId,
  onEdit,
  onDelete,
  onView,
}: BlogTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView} className="gap-2">
          <Eye className="h-4 w-4" />
          عرض
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          تعديل
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="gap-2 text-red-600 dark:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
