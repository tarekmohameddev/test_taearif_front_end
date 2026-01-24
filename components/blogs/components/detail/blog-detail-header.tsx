/**
 * Blog Detail Header Component
 * 
 * @description رأس صفحة التفاصيل مع الصورة المصغرة
 * 
 * @dependencies
 * - Uses: components/ui/card (للبطاقة)
 * - Used by: components/blogs/blog-detail-page.tsx
 * 
 * @props
 * - blog: BlogPost (بيانات المقال)
 * 
 * @related
 * - types/blog.types.ts (BlogPost)
 */

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/blog-formatters";
import { getBlogStatusColor, getBlogStatusLabel, getThumbnailUrl } from "../../utils/blog-helpers";
import type { BlogPost } from "../../../types/blog.types";

interface BlogDetailHeaderProps {
  blog: BlogPost;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BlogDetailHeader({ blog, onEdit, onDelete }: BlogDetailHeaderProps) {
  return (
    <div className="space-y-4">
      {/* العنوان والحالة */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getBlogStatusColor(blog.status)}>
              {getBlogStatusLabel(blog.status)}
            </Badge>
            {blog.published_at && (
              <span className="text-sm text-gray-500">
                نشر في: {formatDate(blog.published_at)}
              </span>
            )}
          </div>
        </div>
        
        {/* أزرار التعديل والحذف */}
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button onClick={onEdit} className="gap-2" size="sm">
                <Edit className="h-4 w-4" />
                تعديل
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" onClick={onDelete} className="gap-2" size="sm">
                <Trash2 className="h-4 w-4" />
                حذف
              </Button>
            )}
        </div>
        )}
      </div>

      {/* الصورة المصغرة */}
      {blog.thumbnail && (
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
          <Image
            src={getThumbnailUrl(blog.thumbnail)}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1100px"
          />
        </div>
      )}
    </div>
  );
}
