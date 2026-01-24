/**
 * Blog Detail Media Component
 * 
 * @description معرض الملفات الإعلامية (صور/فيديوهات)
 * 
 * @dependencies
 * - Uses: components/shared/blog-image-preview.tsx (معاينة الصور)
 * - Used by: components/blogs/blog-detail-page.tsx
 * 
 * @props
 * - media: Media[] (قائمة الملفات)
 * 
 * @related
 * - types/media.types.ts (Media)
 */

import Image from "next/image";
import { BlogImagePreview } from "../shared/blog-image-preview";
import type { Media } from "../../../types/media.types";

interface BlogDetailMediaProps {
  media: Media[];
}

export function BlogDetailMedia({ media }: BlogDetailMediaProps) {
  if (media.length === 0) {
    return null;
  }

  const images = media.filter((m) => m.type === "image");
  const videos = media.filter((m) => m.type === "video");

  return (
    <div className="space-y-6">
      {/* الصور */}
      {images.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">الصور</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-lg overflow-hidden"
              >
                <Image
                  src={image.url}
                  alt={`Media ${image.id}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الفيديوهات */}
      {videos.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">الفيديوهات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="relative aspect-video rounded-lg overflow-hidden">
                <video
                  src={video.url}
                  controls
                  className="w-full h-full object-cover"
                >
                  متصفحك لا يدعم تشغيل الفيديو.
                </video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
