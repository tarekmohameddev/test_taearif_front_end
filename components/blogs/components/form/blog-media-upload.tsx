/**
 * Blog Media Upload Component
 * 
 * @description رفع ومعاينة الملفات الإعلامية المتعددة
 * 
 * @dependencies
 * - Uses: hooks/use-media-upload.ts (رفع الملفات)
 * - Uses: components/shared/blog-image-preview.tsx (معاينة الصور)
 * - Used by: components/blogs/blog-form.tsx
 * 
 * @props
 * - formData: { media_ids: number[] } (بيانات النموذج)
 * - mediaUrls?: { id: number; url: string }[] (روابط الملفات الحالية)
 * - onChange: (mediaIds: number[]) => void (دالة التغيير)
 * 
 * @related
 * - types/blog.types.ts (BlogFormData)
 * - types/media.types.ts (Media)
 * - hooks/use-media-upload.ts (رفع الملفات)
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { BlogImagePreview } from "../shared/blog-image-preview";
import toast from "react-hot-toast";

interface BlogMediaUploadProps {
  formData: {
    media_ids: number[];
  };
  mediaUrls?: { id: number; url: string }[];
  onChange: (mediaIds: number[]) => void;
  onFilesChange: (files: File[]) => void;
}

export function BlogMediaUpload({
  formData,
  mediaUrls = [],
  onChange,
  onFilesChange,
}: BlogMediaUploadProps) {
  const [previews, setPreviews] = useState<
    { id: string; url: string; file: File }[]
  >([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Update previews when mediaUrls changes (for edit mode)
  useEffect(() => {
    if (mediaUrls.length > 0 && selectedFiles.length === 0) {
      const urlPreviews = mediaUrls.map((m) => ({
        id: m.id.toString(),
        url: m.url,
        file: null as any,
      }));
      setPreviews(urlPreviews);
    }
  }, [mediaUrls]);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const invalidFiles = files.filter(
      (file) =>
        !file.type.startsWith("image/") && !file.type.startsWith("video/")
    );
    if (invalidFiles.length > 0) {
      toast.error("يجب أن تكون الملفات صور أو فيديوهات");
      return;
    }

    const oversizedFiles = files.filter((file) => file.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("حجم الملف يجب أن يكون أقل من 50 ميجابايت");
      return;
    }

    // Save files (will be uploaded on submit)
    const updatedFiles = [...selectedFiles, ...files];
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);

    // Create previews for images
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [
            ...prev,
            {
              id: `temp-${Date.now()}-${Math.random()}`,
              url: reader.result as string,
              file,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        // For videos, show a placeholder
        setPreviews((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}-${Math.random()}`,
            url: "/video-placeholder.svg",
            file,
          },
        ]);
      }
    });
  };

  const handleRemove = (previewId: string) => {
    // Check if it's a temporary preview (new file) or existing media
    if (previewId.startsWith("temp-")) {
      // Remove from selected files
      const preview = previews.find((p) => p.id === previewId);
      if (preview?.file) {
        const updatedFiles = selectedFiles.filter((f) => f !== preview.file);
        setSelectedFiles(updatedFiles);
        onFilesChange(updatedFiles);
      }
    } else {
      // Remove existing media ID
      const mediaId = parseInt(previewId);
      onChange(formData.media_ids.filter((id) => id !== mediaId));
    }
    setPreviews(previews.filter((p) => p.id !== previewId));
  };

  return (
    <div className="space-y-2">
      <Label>الملفات الإعلامية (اختياري)</Label>
      <div className="space-y-4">
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview) => (
              <BlogImagePreview
                key={preview.id}
                src={preview.url}
                alt="Media preview"
                onRemove={() => handleRemove(preview.id)}
                size="sm"
              />
            ))}
          </div>
        )}

        <div>
          <Label
            htmlFor="media-upload"
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-dashed rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Upload className="h-4 w-4" />
            اختر ملفات
          </Label>
          <input
            id="media-upload"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFilesSelect}
            className="hidden"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        الصيغ المدعومة: JPG, PNG, GIF, WEBP, MP4, MOV, WEBM (حد أقصى 50 ميجابايت لكل ملف)
      </p>
    </div>
  );
}
