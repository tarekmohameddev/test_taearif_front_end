"use client";

import { MapPinIcon } from "lucide-react";
import { Property } from "../types/types";

interface PropertyMapProps {
  location: Property["location"];
  primaryColor: string;
  primaryColorHover: string;
}

export function PropertyMap({
  location,
  primaryColor,
  primaryColorHover,
}: PropertyMapProps) {
  if (!location || !location.lat || !location.lng) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3
        className="pr-4 md:pr-0 mb-4 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl"
        style={{ backgroundColor: primaryColor }}
      >
        موقع العقار
      </h3>
      <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&hl=ar&z=15&output=embed`}
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
          href={`https://maps.google.com/?q=${location.lat},${location.lng}&entry=gps`}
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
    </div>
  );
}
