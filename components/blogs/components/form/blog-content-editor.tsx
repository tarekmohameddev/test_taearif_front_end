/**
 * Blog Content Editor Component
 * 
 * @description محرر المحتوى (HTML editor)
 * 
 * @dependencies
 * - Uses: components/ui/textarea (للمحرر)
 * - Used by: components/blogs/blog-form.tsx
 * 
 * @props
 * - formData: { content: string } (بيانات النموذج)
 * - errors: { content?: string } (أخطاء التحقق)
 * - onChange: (value: string) => void (دالة التغيير)
 * 
 * @related
 * - types/blog.types.ts (BlogFormData)
 * - utils/blog-validators.ts (التحقق من البيانات)
 * 
 * @note يمكن استبدال textarea بمحرر HTML متقدم مثل react-quill أو similar
 */

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BlogContentEditorProps {
  formData: {
    content: string;
  };
  errors: {
    content?: string;
  };
  onChange: (value: string) => void;
}

export function BlogContentEditor({
  formData,
  errors,
  onChange,
}: BlogContentEditorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">
        المحتوى <span className="text-red-500">*</span>
      </Label>
      <Textarea
        id="content"
        name="content"
        value={formData.content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="أدخل محتوى المقال (يدعم HTML)"
        rows={15}
        className={`font-mono text-sm ${errors.content ? "border-red-500" : ""}`}
      />
      {errors.content && (
        <p className="text-sm text-red-500">{errors.content}</p>
      )}
      <p className="text-xs text-gray-500">
        يمكنك استخدام HTML لتنسيق المحتوى
      </p>
    </div>
  );
}
