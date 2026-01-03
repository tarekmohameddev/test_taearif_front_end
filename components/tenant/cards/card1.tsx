"use client";

import Image from "next/image";
import { Eye, Bed } from "lucide-react";
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
  transactionType_en?: string;
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
  images?: string[];
};

interface PropertyCardProps {
  property: Property;
  showImage?: boolean;
  showPrice?: boolean;
  showDetails?: boolean;
  showViews?: boolean;
  showStatus?: boolean;
}

export function PropertyCard({
  property: p,
  showImage = true,
  showPrice = true,
  showDetails = true,
  showViews = true,
  showStatus = true,
}: PropertyCardProps) {
  const router = useRouter();
  const { tenantId } = useTenantId();

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

  // Helper function to convert hex color to CSS filter for SVG coloring
  const hexToFilter = (hex: string): string => {
    if (!hex || !hex.startsWith("#")) {
      // Default emerald-600 filter (fallback)
      return "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(470%) hue-rotate(119deg) brightness(85%) contrast(94%)";
    }

    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) {
      return "brightness(0) saturate(100%) invert(52%) sepia(74%) saturate(470%) hue-rotate(119deg) brightness(85%) contrast(94%)";
    }

    // Parse RGB values
    const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
    const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

    // Convert RGB to HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    // Convert HSL to filter values
    const hue = Math.round(h * 360);
    const saturation = Math.round(s * 100);
    const lightness = Math.round(l * 100);

    // Calculate filter values
    const brightness = lightness > 50 ? (lightness - 50) * 2 : 0;
    const contrast = 100 + saturation * 0.5;

    return `brightness(0) saturate(100%) invert(${Math.round((1 - lightness / 100) * 100)}%) sepia(${Math.round(saturation)}%) saturate(${Math.round(saturation * 5)}%) hue-rotate(${hue}deg) brightness(${Math.round(100 + brightness)}%) contrast(${Math.round(contrast)}%)`;
  };

  const primaryColorHover = getDarkerColor(primaryColor, 20);
  const primaryColorFilter = hexToFilter(primaryColor);
  // Black filter for currency symbol (always black)
  const blackFilter = "brightness(0) saturate(100%)";

  // Check if property exists
  if (!p) {
    return null;
  }

  const isUnavailable =
    p.status?.toLowerCase() === "rented" ||
    p.status?.toLowerCase() === "sold" ||
    p.status?.toLowerCase() === "unavailable";

  // تحديد النص المناسب للحالة
  const getStatusText = () => {
    const status = p.status?.toLowerCase();
    const transactionType = p.transactionType_en?.toLowerCase();

    // إذا كان unavailable، نحدد النص حسب نوع المعاملة
    if (status === "unavailable") {
      if (transactionType === "sale") return "مُباع";
      if (transactionType === "rent") return "تم تأجيره";
      return "غير متاحة";
    }

    // الحالات الأخرى
    if (status === "rented") return "تم تأجيره";
    if (status === "sold") return "مُباع";

    return "غير متاحة";
  };

  const handleClick = () => {
    if (!isUnavailable && tenantId) {
      const propertySlug = p.slug || p.id; // Use slug if available, fallback to id

      // Check if this is a project (based on transactionType or type)
      const isProject = p.transactionType === "project" || p.type === "مشروع";

      if (isProject) {
        console.log(
          `PropertyCard: Navigating to project ${propertySlug} with tenantId: ${tenantId}`,
        );
        router.push(`/ar/project/${propertySlug}`);
      } else {
        console.log(
          `PropertyCard: Navigating to property ${propertySlug} with tenantId: ${tenantId}`,
        );
        router.push(`/property/${propertySlug}`);
      }
    } else if (!tenantId) {
      console.log("PropertyCard: No tenantId available, cannot navigate");
    } else if (isUnavailable) {
      console.log("PropertyCard: Property is unavailable, cannot navigate");
    }
  };

  return (
    <div
      className={`block h-fit w-full ${isUnavailable ? "pointer-events-none" : "cursor-pointer"}`}
      aria-disabled={isUnavailable}
      onClick={handleClick}
    >
      <div className="h-fit w-full transition-transform hover:scale-[1.02]">
        {/* صورة العقار مع الأيقونات */}
        {showImage && (
          <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
            <Image
              src={
                p.image ||
                "/placeholder.svg?height=300&width=480&query=property"
              }
              alt={p.title}
              fill
              sizes="(min-width:1280px) 25vw, (min-width:900px) 33vw, (min-width:640px) 50vw, 90vw"
              className="rounded-xl object-cover"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />

            {/* المستطيل العلوي الأيمن - غرف النوم والمشاهدات */}
            {showDetails && (
              <div className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 shadow-sm">
                <div className="flex items-center gap-1">
                  <Bed className="size-4" style={{ color: primaryColor }} />
                  <span className="text-sm font-semibold text-gray-700">
                    {p.bedrooms}
                  </span>
                </div>
                {showViews && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {p.views}
                    </span>
                    <Eye className="size-4 text-gray-600" />
                  </div>
                )}
              </div>
            )}

            {/* Overlay للعقارات غير المتاحة */}
            {isUnavailable && showStatus && (
              <div
                aria-label={getStatusText()}
                className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/70"
                style={{ pointerEvents: "none" }}
              >
                <span
                  className="rounded-lg  px-4 py-2 text-2xl sm:text-3xl font-semibold text-white"
                  style={{ pointerEvents: "none" }}
                >
                  {getStatusText()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* محتوى البطاقة - بدون خلفية */}
        <div className="mt-4 space-y-3" dir="rtl">
          <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {p.district}
          </p>

          {showPrice && (
            <div className="flex items-center justify-between">
              {/* السعر على اليسار */}
              <span className="flex items-center gap-1 text-lg font-extrabold text-foreground">
                {p.price}
                <img
                  src="/Saudi_Riyal_Symbol.svg"
                  alt="ريال سعودي"
                  className="w-5 h-5"
                  style={{
                    filter: blackFilter,
                  }}
                />
              </span>
              {/* زر التفاصيل على اليمين - بدون Link لتجنب التداخل */}
              <Button
                variant="ghost"
                className="h-auto p-0 hover:bg-transparent hover:underline"
                style={{ color: primaryColorHover }}
              >
                تفاصيل
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
