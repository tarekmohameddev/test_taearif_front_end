/**
 * Blog Detail Author Component
 * 
 * @description معلومات المؤلف
 * 
 * @dependencies
 * - Uses: components/ui/card (للبطاقة)
 * - Used by: components/blogs/blog-detail-page.tsx
 * 
 * @props
 * - author: Author | null (معلومات المؤلف)
 * - createdAt: string (تاريخ الإنشاء)
 * - updatedAt: string (تاريخ التحديث)
 * 
 * @related
 * - types/blog.types.ts (Author)
 */

import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { formatDateTime } from "../../utils/blog-formatters";
import type { Author } from "../../../types/blog.types";

interface BlogDetailAuthorProps {
  author: Author | null;
  createdAt: string;
  updatedAt: string;
}

export function BlogDetailAuthor({
  author,
  createdAt,
  updatedAt,
}: BlogDetailAuthorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {author && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="font-semibold">{author.name}</p>
                <p className="text-sm text-gray-500">المؤلف</p>
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">تاريخ الإنشاء: </span>
              <span>{formatDateTime(createdAt)}</span>
            </div>
            {updatedAt !== createdAt && (
              <div>
                <span className="text-gray-500">آخر تحديث: </span>
                <span>{formatDateTime(updatedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
