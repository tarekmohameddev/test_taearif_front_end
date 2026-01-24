/**
 * Blog Basic Info Component
 * 
 * @description حقول المعلومات الأساسية (title, slug, excerpt)
 * 
 * @dependencies
 * - Uses: components/ui/input (للحقول)
 * - Uses: components/ui/label (للعلامات)
 * - Uses: components/ui/textarea (للملخص)
 * - Uses: utils/blog-formatters.ts (generateSlug)
 * - Used by: components/blogs/blog-form.tsx
 * 
 * @props
 * - formData: BlogFormData (بيانات النموذج)
 * - errors: ValidationErrors (أخطاء التحقق)
 * - onChange: (field, value) => void (دالة التغيير)
 * 
 * @related
 * - types/blog.types.ts (BlogFormData)
 * - utils/blog-validators.ts (التحقق من البيانات)
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BlogBasicInfoProps {
  formData: {
    title: string;
    slug: string;
    excerpt: string;
  };
  errors: {
    title?: string;
    slug?: string;
    excerpt?: string;
  };
  onChange: (field: string, value: string) => void;
}

export function BlogBasicInfo({
  formData,
  errors,
  onChange,
}: BlogBasicInfoProps) {
  return (
    <div className="space-y-4">
      {/* العنوان */}
      <div className="space-y-2">
        <Label htmlFor="title">
          العنوان <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="أدخل عنوان المقال"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* الرابط (Slug) */}
      <div className="space-y-2">
        <Label htmlFor="slug">الرابط (اختياري)</Label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={(e) => onChange("slug", e.target.value)}
          placeholder="سيتم إنشاؤه تلقائياً من العنوان"
        />
        {errors.slug && (
          <p className="text-sm text-red-500">{errors.slug}</p>
        )}
        <p className="text-xs text-gray-500">
          سيتم إنشاء الرابط تلقائياً من العنوان إذا لم تقم بإدخاله
        </p>
      </div>

      {/* الملخص */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">الملخص (اختياري)</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={(e) => onChange("excerpt", e.target.value)}
          placeholder="ملخص قصير عن المقال"
          rows={3}
          className={errors.excerpt ? "border-red-500" : ""}
        />
        {errors.excerpt && (
          <p className="text-sm text-red-500">{errors.excerpt}</p>
        )}
        <p className="text-xs text-gray-500">
          سيتم إنشاء الملخص تلقائياً من المحتوى إذا لم تقم بإدخاله
        </p>
      </div>
    </div>
  );
}
