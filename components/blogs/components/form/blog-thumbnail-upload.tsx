/**
 * Blog Thumbnail Upload Component
 * 
 * @description رفع ومعاينة الصورة المصغرة (بنفس تصميم صفحة إضافة العقار)
 * 
 * @dependencies
 * - Uses: components/ui/button (للأزرار)
 * - Used by: components/blogs/blog-form.tsx
 * 
 * @props
 * - formData: { thumbnail_id: number | null } (بيانات النموذج)
 * - thumbnailUrl?: string (رابط الصورة الحالية)
 * - onChange: (thumbnailId: number | null) => void (دالة التغيير)
 * - onFileChange: (file: File | null) => void (دالة تغيير الملف)
 * 
 * @related
 * - types/blog.types.ts (BlogFormData)
 * - types/media.types.ts (Media)
 */

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";
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
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

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
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      {/* Preview Area */}
      <div className="border rounded-md p-2 flex-1 w-full">
        <div className="flex items-center justify-center h-48 bg-muted rounded-md relative">
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Blog thumbnail"
                className="h-full w-full object-cover rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleRemove}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Upload Button and Info */}
      <div className="flex flex-col gap-4 w-full md:w-1/3">
        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button
          variant="outline"
          className="h-12 w-full"
          onClick={() => thumbnailInputRef.current?.click()}
          type="button"
        >
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <span>رفع صورة</span>
          </div>
        </Button>
        <p className="text-sm text-muted-foreground">
          يمكنك رفع صورة بصيغة JPG أو PNG أو GIF أو WEBP. الحد الأقصى لحجم الملف
          هو 50 ميجابايت.
        </p>
      </div>
    </div>
  );
}
