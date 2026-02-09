"use client";

interface PropertyVideoProps {
  videoUrl: string;
  videoImage?: string;
  primaryColor: string;
}

export function PropertyVideo({
  videoUrl,
  videoImage,
  primaryColor,
}: PropertyVideoProps) {
  if (!videoUrl) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3
        className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
        style={{ backgroundColor: primaryColor }}
      >
        فيديو العقار
      </h3>
      <div className="w-full rounded-lg overflow-hidden shadow-lg">
        <video controls className="w-full h-auto" poster={videoImage}>
          <source src={videoUrl} type="video/mp4" />
          متصفحك لا يدعم عرض الفيديو.
        </video>
      </div>
    </div>
  );
}
