/**
 * Blog Detail Categories Component
 * 
 * @description عرض التصنيفات كـ badges
 * 
 * @dependencies
 * - Uses: components/ui/badge (للـ badges)
 * - Used by: components/blogs/blog-detail-page.tsx
 * 
 * @props
 * - categories: Category[] (قائمة التصنيفات)
 * 
 * @related
 * - types/category.types.ts (Category)
 */

import { Badge } from "@/components/ui/badge";
import type { Category } from "../../../types/category.types";

interface BlogDetailCategoriesProps {
  categories: Category[];
}

export function BlogDetailCategories({
  categories,
}: BlogDetailCategoriesProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">التصنيفات</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge key={category.id} variant="secondary">
            {category.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
