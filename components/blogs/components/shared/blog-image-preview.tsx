/**
 * Blog Image Preview Component
 * 
 * @description معاينة الصور (يستخدم في النموذج والتفاصيل)
 * 
 * @dependencies
 * - Uses: components/ui/button (لحذف الصورة)
 * - Used by: 
 *   - components/form/blog-thumbnail-upload.tsx
 *   - components/form/blog-media-upload.tsx
 *   - components/detail/blog-detail-media.tsx
 * 
 * @related
 * - types/media.types.ts (Media type)
 */

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface BlogImagePreviewProps {
  src: string;
  alt?: string;
  onRemove?: () => void;
  size?: "sm" | "md" | "lg";
  showRemove?: boolean;
}

export function BlogImagePreview({
  src,
  alt = "Preview",
  onRemove,
  size = "md",
  showRemove = true,
}: BlogImagePreviewProps) {
  const sizeClasses = {
    sm: "h-20 w-20",
    md: "h-32 w-32",
    lg: "h-48 w-48",
  };

  return (
    <div className="relative inline-block group">
      <div
        className={`${sizeClasses[size]} relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {showRemove && onRemove && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
