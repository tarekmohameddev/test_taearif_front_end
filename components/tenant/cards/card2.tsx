"use client";

import Image from "next/image";
import { Eye, Bed, Bath, Square } from "lucide-react";
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

interface PropertyCard2Props {
  property: Property;
  className?: string;
}

export default function PropertyCard2({
  property,
  className = "",
}: PropertyCard2Props) {
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
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 ${className}`}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Status Badge */}
        {property.status && (
          <div className="absolute top-4 left-4">
            <span
              className="text-white px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: primaryColor }}
            >
              {property.status}
            </span>
          </div>
        )}

        {/* Views Counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm">
          <Eye className="w-4 h-4" />
          <span>{property.views}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and District */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <p className="text-gray-600 text-sm flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {property.district}
          </p>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-gray-600">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span className="text-sm">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span className="text-sm">{property.bathrooms}</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span className="text-sm">{property.area}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price and Type */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">{property.price}</p>
            {property.transactionType && (
              <p className="text-sm text-gray-500">
                {property.transactionType}
              </p>
            )}
          </div>
          {property.type && (
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
              {property.type}
            </span>
          )}
        </div>

        {/* Description */}
        {property.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>
        )}

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {property.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                >
                  {feature}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="text-gray-500 text-xs">
                  +{property.features.length - 3} أكثر
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          className="w-full text-white font-medium py-2.5 rounded-lg transition-colors"
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
    </div>
  );
}
