/**
 * Blog Thumbnail Upload Component
 * 
 * @description رفع ومعاينة الصورة المصغرة
 * 
 * @dependencies
 * - Uses: hooks/use-media-upload.ts (رفع الملفات)
 * - Uses: components/shared/blog-image-preview.tsx (معاينة الصورة)
 * - Used by: components/blogs/blog-form.tsx
 * 
 * @props
 * - formData: { thumbnail_id: number | null } (بيانات النموذج)
 * - thumbnailUrl?: string (رابط الصورة الحالية)
 * - onChange: (thumbnailId: number | null) => void (دالة التغيير)
 * 
 * @related
 * - types/blog.types.ts (BlogFormData)
 * - types/media.types.ts (Media)
 * - hooks/use-media-upload.ts (رفع الملفات)
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { BlogImagePreview } from "../shared/blog-image-preview";
import toast from "react-hot-toast";

interface BlogThumbnailUploadProps {
  formData: {
    thumbnail_id: number | null;
  };
  thumbnailUrl?: string | null;
  onChange: (thumbnailId: number | null) => void;
  onFileChange: (file: File | null) => void;
}

export function BlogThumbnailUpload({
  formData,
  thumbnailUrl,
  onChange,
  onFileChange,
}: BlogThumbnailUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    thumbnailUrl || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Update preview when thumbnailUrl changes (for edit mode)
  useEffect(() => {
    if (thumbnailUrl && !selectedFile) {
      setPreviewUrl(thumbnailUrl);
    }
  }, [thumbnailUrl, selectedFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("يجب أن يكون الملف صورة");
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("حجم الملف يجب أن يكون أقل من 50 ميجابايت");
      return;
    }

    // Save file (will be uploaded on submit)
    setSelectedFile(file);
    onFileChange(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreviewUrl(thumbnailUrl || null);
    setSelectedFile(null);
    onFileChange(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <Label>الصورة المصغرة (اختياري)</Label>
      <div className="space-y-4">
        {previewUrl ? (
          <div className="space-y-2">
            <BlogImagePreview
              src={previewUrl}
              alt="Thumbnail preview"
              onRemove={handleRemove}
              size="md"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              إزالة الصورة
            </Button>
          </div>
        ) : (
          <div>
            <Label
              htmlFor="thumbnail-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-dashed rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Upload className="h-4 w-4" />
              اختر صورة
            </Label>
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">
        الصيغ المدعومة: JPG, PNG, GIF, WEBP (حد أقصى 50 ميجابايت)
      </p>
    </div>
  );
}
