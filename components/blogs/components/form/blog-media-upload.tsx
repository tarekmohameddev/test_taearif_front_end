/**
 * Blog Media Upload Component
 * 
 * @description رفع ومعاينة الملفات الإعلامية المتعددة (بنفس تصميم معرض الصور في صفحة إضافة العقار)
 * 
 * @dependencies
 * - Uses: components/ui/button (للأزرار)
 * - Used by: components/blogs/blog-form.tsx
 * 
 * @props
 * - formData: { media_ids: number[] } (بيانات النموذج)
 * - mediaUrls?: { id: number; url: string }[] (روابط الملفات الحالية)
 * - onChange: (mediaIds: number[]) => void (دالة التغيير)
 * - onFilesChange: (files: File[]) => void (دالة تغيير الملفات)
 * 
 * @related
 * - types/blog.types.ts (BlogFormData)
 * - types/media.types.ts (Media)
 */

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ImageIcon, VideoIcon } from "lucide-react";
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
    { id: string; url: string; file: File | null; type: "image" | "video" }[]
  >([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  // Update previews when mediaUrls changes (for edit mode)
  useEffect(() => {
    if (mediaUrls.length > 0 && selectedFiles.length === 0) {
      const urlPreviews = mediaUrls.map((m) => ({
        id: m.id.toString(),
        url: m.url,
        file: null,
        type: m.url.includes("video") || m.url.includes(".mp4") || m.url.includes(".mov") || m.url.includes(".webm") ? "video" : "image" as "image" | "video",
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

    // Create previews for images and videos
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
              type: "image" as const,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        // For videos, show a placeholder
        setPreviews((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}-${Math.random()}`,
            url: "", // Will show video icon
            file,
            type: "video" as const,
          },
        ]);
      }
    });

    // Reset input
    if (mediaInputRef.current) {
      mediaInputRef.current.value = "";
    }
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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {/* Preview existing and new media */}
        {previews.map((preview) => (
          <div
            key={preview.id}
            className="border rounded-md p-1 relative w-16 h-16 flex-shrink-0"
          >
            <div className="w-full h-full bg-muted rounded-md overflow-hidden flex items-center justify-center">
              {preview.type === "image" && preview.url ? (
                <img
                  src={preview.url}
                  alt="Media preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <VideoIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full"
              onClick={() => handleRemove(preview.id)}
              type="button"
            >
              <X className="h-2.5 w-2.5" />
            </Button>
          </div>
        ))}

        {/* Add new media button */}
        <div
          className="border rounded-md p-1 w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => mediaInputRef.current?.click()}
        >
          <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center">
            <ImageIcon className="h-2 w-2 text-muted-foreground" />
          </div>
          <p className="text-[10px] text-muted-foreground">إضافة</p>
        </div>
      </div>

      <input
        ref={mediaInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleFilesSelect}
      />

      <p className="text-sm text-muted-foreground">
        يمكنك رفع صور أو فيديوهات بصيغة JPG، PNG، GIF، WEBP، MP4، MOV، WEBM. الحد الأقصى لحجم الملف هو 50 ميجابايت لكل ملف.
      </p>
    </div>
  );
}
