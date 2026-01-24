/**
 * Blog Status Selector Component
 * 
 * @description اختيار الحالة (draft/published)
 * 
 * @dependencies
 * - Uses: components/ui/radio-group (للاختيار)
 * - Used by: components/blogs/blog-form.tsx
 * 
 * @props
 * - formData: { status: "draft" | "published" } (بيانات النموذج)
 * - onChange: (status: "draft" | "published") => void (دالة التغيير)
 * 
 * @related
 * - types/blog.types.ts (BlogFormData)
 */

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BlogStatusSelectorProps {
  formData: {
    status: "draft" | "published";
  };
  onChange: (status: "draft" | "published") => void;
}

export function BlogStatusSelector({
  formData,
  onChange,
}: BlogStatusSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>الحالة</Label>
      <RadioGroup
        value={formData.status}
        onValueChange={(value) => onChange(value as "draft" | "published")}
      >
        <div className="flex items-center space-x-2 space-x-reverse">
          <RadioGroupItem value="draft" id="draft" />
          <Label htmlFor="draft" className="cursor-pointer">
            مسودة
          </Label>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <RadioGroupItem value="published" id="published" />
          <Label htmlFor="published" className="cursor-pointer">
            منشور
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
