import type { Property } from "../types/types";

interface VideoSectionProps {
  property: Property;
  primaryColor: string;
  showVideoUrl?: boolean;
}

export const VideoSection = ({
  property,
  primaryColor,
  showVideoUrl = true,
}: VideoSectionProps) => {
  if (!showVideoUrl || !property.video_url) {
    return null;
  }

  return (
    <section
      className="rounded-lg overflow-hidden shadow-md bg-black relative h-64"
      data-purpose="video-section"
    >
      <div className="w-full h-full rounded-lg overflow-hidden">
        <video
          controls
          className="w-full h-full object-cover"
          poster={property.video_image || undefined}
        >
          <source src={property.video_url} type="video/mp4" />
          متصفحك لا يدعم عرض الفيديو.
        </video>
      </div>
      <div
        className="absolute top-4 right-4 text-white px-4 py-2 rounded text-sm font-bold text-right"
        style={{ backgroundColor: primaryColor }}
      >
        جولة فيديو للمقار
      </div>
    </section>
  );
};
