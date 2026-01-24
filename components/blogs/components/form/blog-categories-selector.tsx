/**
 * Blog Categories Selector Component
 * 
 * @description اختيار التصنيفات (multi-select)
 * 
 * @dependencies
 * - Uses: hooks/use-categories.ts (جلب التصنيفات)
 * - Uses: components/ui/checkbox (للاختيار)
 * - Used by: components/blogs/blog-form.tsx
 * 
 * @props
 * - formData: { category_ids: number[] } (بيانات النموذج)
 * - onChange: (categoryIds: number[]) => void (دالة التغيير)
 * 
 * @related
 * - types/blog.types.ts (BlogFormData)
 * - types/category.types.ts (Category)
 * - hooks/use-categories.ts (جلب التصنيفات)
 */

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCategories } from "../../hooks/use-categories";
import { BlogLoadingState } from "../shared/blog-loading-state";

interface BlogCategoriesSelectorProps {
  formData: {
    category_ids: number[];
  };
  onChange: (categoryIds: number[]) => void;
}

export function BlogCategoriesSelector({
  formData,
  onChange,
}: BlogCategoriesSelectorProps) {
  // يستخدم useCategories لجلب قائمة التصنيفات (يستخدم category-api.ts داخلياً)
  const { categories, loading } = useCategories();

  const handleToggle = (categoryId: number) => {
    const isSelected = formData.category_ids.includes(categoryId);
    if (isSelected) {
      onChange(formData.category_ids.filter((id) => id !== categoryId));
    } else {
      onChange([...formData.category_ids, categoryId]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>التصنيفات</Label>
        <BlogLoadingState type="list" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>التصنيفات</Label>
      <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">لا توجد تصنيفات متاحة</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-2 space-x-reverse"
              >
                <Checkbox
                  id={`category-${category.id}`}
                  checked={formData.category_ids.includes(category.id)}
                  onCheckedChange={() => handleToggle(category.id)}
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="cursor-pointer flex-1 text-sm"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
