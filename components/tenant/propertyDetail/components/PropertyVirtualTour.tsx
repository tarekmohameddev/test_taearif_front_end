"use client";

interface PropertyVirtualTourProps {
  virtualTourUrl: string;
  primaryColor: string;
}

export function PropertyVirtualTour({
  virtualTourUrl,
  primaryColor,
}: PropertyVirtualTourProps) {
  if (!virtualTourUrl) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3
        className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
        style={{ backgroundColor: primaryColor }}
      >
        جولة افتراضية
      </h3>
      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={virtualTourUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="جولة افتراضية للعقار"
        />
      </div>
    </div>
  );
}
