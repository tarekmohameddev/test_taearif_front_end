/**
 * Blog Table Row Component
 * 
 * @description صف واحد في جدول المقالات
 * 
 * @dependencies
 * - Uses: components/table/blog-table-actions.tsx (قائمة الإجراءات)
 * - Used by: components/table/blog-table.tsx
 * 
 * @props
 * - blog: BlogListItem (بيانات المقال)
 * - onEdit: () => void (دالة التعديل)
 * - onDelete: () => void (دالة الحذف)
 * - onView: () => void (دالة العرض)
 * 
 * @related
 * - types/blog.types.ts (BlogListItem)
 * - components/blogs/blogs-list-page.tsx (الصفحة الرئيسية)
 */

import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatDate } from "../../utils/blog-formatters";
import { getBlogStatusColor, getBlogStatusLabel, getThumbnailUrl } from "../../utils/blog-helpers";
import { BlogTableActions } from "./blog-table-actions";
import type { BlogListItem } from "../../types/blog.types";

interface BlogTableRowProps {
  blog: BlogListItem;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export function BlogTableRow({
  blog,
  onEdit,
  onDelete,
  onView,
}: BlogTableRowProps) {
  return (
    <TableRow>
      {/* الصورة المصغرة */}
      <TableCell>
        <div className="relative h-12 w-12 rounded overflow-hidden">
          <Image
            src={getThumbnailUrl(blog.thumbnail)}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      </TableCell>

      {/* العنوان */}
      <TableCell className="font-medium">
        <div className="max-w-[200px] truncate" title={blog.title}>
          {blog.title}
        </div>
      </TableCell>

      {/* الحالة */}
      <TableCell>
        <Badge className={getBlogStatusColor(blog.status)}>
          {getBlogStatusLabel(blog.status)}
        </Badge>
      </TableCell>

      {/* تاريخ النشر */}
      <TableCell className="hidden md:table-cell">
        {formatDate(blog.published_at)}
      </TableCell>

      {/* المشاهدات */}
      <TableCell className="hidden lg:table-cell">
        {blog.views ? blog.views.toLocaleString("ar-EG") : "0"}
      </TableCell>

      {/* الإجراءات */}
      <TableCell>
        <BlogTableActions
          blogId={blog.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      </TableCell>
    </TableRow>
  );
}
