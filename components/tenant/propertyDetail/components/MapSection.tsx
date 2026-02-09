import { MapPinIcon } from "lucide-react";
import type { Property } from "../types/types";

interface MapSectionProps {
  property: Property;
  primaryColor: string;
  primaryColorHover: string;
  showMap?: boolean;
}

export const MapSection = ({
  property,
  primaryColor,
  primaryColorHover,
  showMap = true,
}: MapSectionProps) => {
  if (
    !showMap ||
    !property.location ||
    !property.location.lat ||
    !property.location.lng
  ) {
    return null;
  }

  return (
    <section
      className="rounded-lg overflow-hidden shadow-md border-4 border-white h-[550px] relative"
      data-purpose="map-section"
    >
      <h3
        className="pr-4 md:pr-0 mb-4 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
        style={{ backgroundColor: primaryColor }}
      >
        موقع العقار
      </h3>
      <div className="w-full h-[calc(100%-3.5rem)] rounded-lg overflow-hidden">
        <iframe
          src={`https://maps.google.com/maps?q=${property.location.lat},${property.location.lng}&hl=ar&z=15&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="موقع العقار"
        />
      </div>
      <div className="mt-4 text-center">
        <a
          href={`https://maps.google.com/?q=${property.location.lat},${property.location.lng}&entry=gps`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
          style={{ backgroundColor: primaryColor }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primaryColorHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = primaryColor;
          }}
        >
          <MapPinIcon className="w-4 h-4" />
          فتح في خرائط جوجل
        </a>
      </div>
    </section>
  );
};
