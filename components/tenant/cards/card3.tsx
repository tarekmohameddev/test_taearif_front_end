"use client";

import Image from "next/image";
import { Eye, Bed, Bath, Square, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTenantId } from "@/hooks/useTenantId";
import useTenantStore from "@/context/tenantStore";

type Property = {
  id: string;
  slug?: string;
  title: string;
  district: string;
  price: string;
  views: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  type?: string;
  transactionType?: string;
  image: string;
  status?: string;
  createdAt?: string;
  description?: string;
  features?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
};

interface PropertyCard3Props {
  property: Property;
  showImage?: boolean;
  showPrice?: boolean;
  showDetails?: boolean;
  showViews?: boolean;
  showStatus?: boolean;
  className?: string;
}

export default function PropertyCard3({
  property,
  showImage = true,
  showPrice = true,
  showDetails = true,
  showViews = true,
  showStatus = true,
  className = "",
}: PropertyCard3Props) {
  const router = useRouter();
  const tenantId = useTenantId();

  // Get tenant data from store
  const { tenantData } = useTenantStore();

  // Get primary color from WebsiteLayout branding (fallback to emerald-600)
  // emerald-600 in Tailwind = #059669
  const primaryColor =
    tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#059669"; // emerald-600 default (fallback)

  // Helper function to create darker color for hover states
  const getDarkerColor = (hex: string, amount: number = 20): string => {
    // emerald-700 in Tailwind = #047857 (fallback)
    if (!hex || !hex.startsWith("#")) return "#047857";
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return "#047857";

    const r = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(0, 2), 16) - amount),
    );
    const g = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(2, 2), 16) - amount),
    );
    const b = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(4, 2), 16) - amount),
    );

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  const primaryColorHover = getDarkerColor(primaryColor, 20);

  // Check if property exists
  if (!property) {
    return null;
  }

  const handleClick = () => {
    if (property.slug) {
      // Check if this is a project (based on transactionType or type)
      const isProject =
        property.transactionType === "project" || property.type === "مشروع";

      if (isProject) {
        router.push(`/ar/project/${property.slug}`);
      } else {
        router.push(`/property/${property.slug}`);
      }
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 cursor-pointer ${className}`}
      style={{
        overflow: "hidden",
        position: "relative",
        maxWidth: "100%",
        maxHeight: "100%",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      onClick={handleClick}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
        div {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Image Container - Vertical Rectangle */}
      {showImage && (
        <div
          className="relative w-full h-96 overflow-hidden"
          style={{
            overflow: "hidden",
            maxWidth: "100%",
            maxHeight: "100%",
            position: "relative",
          }}
        >
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            style={{
              overflow: "hidden",
              transformOrigin: "center",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "cover",
            }}
          />

          {/* Gradient Overlay for better text readability */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent overflow-hidden"
            style={{
              overflow: "hidden",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />

          {/* Status Badge - Top Left */}
          {showStatus && property.status ? (
            <div className="absolute top-4 left-4">
              <span
                className="text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {property.status}
              </span>
            </div>
          ) : null}

          {/* Views Counter - Top Right */}
          {showViews ? (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm backdrop-blur-sm">
              <Eye className="w-4 h-4" />
              <span>{property.views}</span>
            </div>
          ) : null}

          {/* Content Overlay - Bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 p-6 text-white overflow-hidden"
            style={{
              overflow: "hidden",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            {/* Title */}
            <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
              {property.title}
            </h3>

            {/* District */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-300" />
              <span className="text-sm text-gray-200">{property.district}</span>
            </div>

            {/* Property Details */}
            {showDetails ? (
              <div className="flex items-center gap-4 mb-4">
                {property.bedrooms ? (
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                    <Bed className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {property.bedrooms}
                    </span>
                  </div>
                ) : null}
                {property.bathrooms ? (
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                    <Bath className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {property.bathrooms}
                    </span>
                  </div>
                ) : null}
                {property.area ? (
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                    <Square className="w-4 h-4" />
                    <span className="text-sm font-medium">{property.area}</span>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Price and Action */}
            {/* its only hidden for now , i dont want to delete it */}

            {/* {showPrice && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {property.price}
                  </p>
                  {property.transactionType && (
                    <p className="text-sm text-gray-300">
                      {property.transactionType}
                    </p>
                  )}
                </div>
                <Button
                  className="text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColorHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  عرض التفاصيل
                </Button>
              </div>
            )} */}
          </div>
        </div>
      )}

      {/* Fallback content when image is hidden */}
      {!showImage ? (
        <div
          className="p-6 overflow-hidden"
          style={{
            overflow: "hidden",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {property.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">{property.district}</p>

          {showDetails ? (
            <div className="flex items-center gap-4 mb-4 text-gray-600">
              {property.bedrooms ? (
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span className="text-sm">{property.bedrooms}</span>
                </div>
              ) : null}
              {property.bathrooms ? (
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span className="text-sm">{property.bathrooms}</span>
                </div>
              ) : null}
              {property.area ? (
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span className="text-sm">{property.area}</span>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* its only hidden for now , i dont want to delete it */}
          {/* {showPrice && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {property.price}
                </p>
                {property.transactionType && (
                  <p className="text-sm text-gray-500">
                    {property.transactionType}
                  </p>
                )}
              </div>
              <Button
                className="text-white font-medium px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColorHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                عرض التفاصيل
              </Button>
            </div>
          )} */}
        </div>
      ) : null}
    </div>
  );
}
