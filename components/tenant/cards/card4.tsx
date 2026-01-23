"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultCard4Data } from "@/context/editorStoreFunctions/card4Functions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface Property {
  ThemeTwo?: string;
  id: string;
  image: string;
  title: string;
  city: string;
  district: string;
  status: string;
  area: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  rooms: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  units: number;
  floors: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  price: number | {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  bathrooms?: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  featured?: boolean;
  url?: string;
}

interface Card4Props {
  visible?: boolean;
  ThemeTwo?: string;
  property?: Property;
  styling?: {
    ThemeTwo?: string;
    cardBackgroundColor?: string;
    cardBorderRadius?: string;
    cardShadow?: string;
    cardHoverShadow?: string;
    featuredBadgeBackground?: string;
    featuredBadgeTextColor?: string;
    titleColor?: string;
    cityDistrictColor?: string;
    statusColor?: string;
    dividerColor?: string;
    areaIconColor?: string;
    areaTextColor?: string;
    areaLabelColor?: string;
    roomsIconColor?: string;
    roomsTextColor?: string;
    roomsLabelColor?: string;
    unitsIconColor?: string;
    unitsTextColor?: string;
    unitsLabelColor?: string;
    floorsIconColor?: string;
    floorsTextColor?: string;
    floorsLabelColor?: string;
    priceBackgroundColor?: string;
    priceTextColor?: string;
  };
  typography?: {
    ThemeTwo?: string;
    title?: {
      ThemeTwo?: string;
      fontSize?: string;
      fontWeight?: string;
      fontFamily?: string;
    };
    cityDistrict?: {
      ThemeTwo?: string;
      fontSize?: string;
      fontWeight?: string;
      fontFamily?: string;
    };
    status?: {
      ThemeTwo?: string;
      fontSize?: string;
      fontWeight?: string;
      fontFamily?: string;
    };
    detailLabel?: {
      ThemeTwo?: string;
      fontSize?: string;
      fontWeight?: string;
      fontFamily?: string;
    };
    detailValue?: {
      ThemeTwo?: string;
      fontSize?: string;
      fontWeight?: string;
      fontFamily?: string;
    };
    price?: {
      ThemeTwo?: string;
      fontSize?: string;
      fontWeight?: string;
      fontFamily?: string;
    };
  };
  responsive?: {
    ThemeTwo?: string;
    imageHeight?: {
      ThemeTwo?: string;
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// SVG Icons
const AreaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M17.5 22.5v-3.5h-3.5v-1.5h3.5v-3.5h1.5v3.5h3.5v1.5h-3.5v3.5h-1.5Zm-12.5 -3.5V14h1.5v3.5h3.5v1.5H5Zm0 -9V5h5v1.5h-3.5v3.5h-1.5Zm12.5 0v-3.5h-3.5v-1.5h5v5h-1.5Z"
      strokeWidth="0.5"
    />
  </svg>
);

const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M1 19V4.375h1.5v9.85h8.825V6.5h8.05c0.99685 0 1.85025 0.3549 2.56025 1.06475C22.6451 8.27475 23 9.12815 23 10.125V19h-1.5v-3.275H2.5V19H1Zm5.75 -6.225c-0.75 0 -1.37915 -0.25415 -1.8875 -0.7625C4.354165 11.50415 4.1 10.875 4.1 10.125s0.254165 -1.37915 0.7625 -1.8875C5.37085 7.72915 6 7.475 6.75 7.475s1.37915 0.25415 1.8875 0.7625c0.50835 0.50835 0.7625 1.1375 0.7625 1.8875s-0.25415 1.37915 -0.7625 1.8875C8.12915 12.52085 7.5 12.775 6.75 12.775Zm6.075 1.45H21.5v-4.1c0 -0.58435 -0.2081 -1.0846 -0.62425 -1.50075C20.4596 8.2081 19.95935 8 19.375 8h-6.55v6.225Zm-6.075 -2.95c0.31665 0 0.5875 -0.1125 0.8125 -0.3375 0.225 -0.225 0.3375 -0.49585 0.3375 -0.8125s-0.1125 -0.5875 -0.3375 -0.8125c-0.225 -0.225 -0.49585 -0.3375 -0.8125 -0.3375s-0.5875 0.1125 -0.8125 0.3375c-0.225 0.225 -0.3375 0.49585 -0.3375 0.8125s0.1125 0.5875 0.3375 0.8125c0.225 0.225 0.49585 0.3375 0.8125 0.3375Z"
      strokeWidth="0.5"
    />
  </svg>
);

const BuildingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M3 21v-1.5h2.3V3h9.75v1.125h3.675V19.5H21v1.5h-3.775V5.625H15.05V21H3Zm8.275 -8c0.28335 0 0.52085 -0.09585 0.7125 -0.2875s0.2875 -0.42915 0.2875 -0.7125c0 -0.28335 -0.09585 -0.52085 -0.2875 -0.7125S11.55835 11 11.275 11c-0.28335 0 -0.52085 0.09585 -0.7125 0.2875s-0.2875 0.42915 -0.2875 0.7125c0 0.28335 0.09585 0.52085 0.2875 0.7125s0.42915 0.2875 0.7125 0.2875ZM6.8 19.5h6.75V4.5H6.8v15Z"
      strokeWidth="0.5"
    />
  </svg>
);

const StairsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M3 21.75v-1.5h3.75v-4.5h4.5v-4.5h4.5v-4.5h4.5V3h1.5v5.25h-4.5v4.5h-4.5v4.5h-4.5v4.5H3Z"
      strokeWidth="0.5"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    aria-hidden="true"
    className="w-4 h-4"
    viewBox="0 0 576 512"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
  </svg>
);

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function Card4(props: Card4Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "card4";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const card4States = useEditorStore((s) => s.card4States);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Extract component data from tenantData (BEFORE useEffect)
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "card" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    // Check old structure (tenantData.componentSettings)
    if (tenantData?.componentSettings) {
      for (const [pageSlug, pageComponents] of Object.entries(
        tenantData.componentSettings,
      )) {
        if (
          typeof pageComponents === "object" &&
          !Array.isArray(pageComponents)
        ) {
          for (const [componentId, component] of Object.entries(
            pageComponents as any,
          )) {
            if (
              (component as any).type === "card" &&
              (component as any).componentName === variantId
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  };

  const tenantComponentData = getTenantComponentData();

  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultCard4Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultCard4Data(),
              ...props,
            };

      // ⭐ CRITICAL: Use getState() directly to avoid dependency issues
      const store = useEditorStore.getState();
      store.ensureComponentVariant("card", uniqueId, initialData);
    }
    // ⭐ CRITICAL: Only depend on uniqueId, props.useStore, and tenantComponentData
    // Don't include ensureComponentVariant to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueId, props.useStore, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = card4States[uniqueId];
  const currentStoreData = getComponentData("card", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultCard4Data(), // 1. Defaults (lowest priority)
    ...storeData, // 2. Store state
    ...currentStoreData, // 3. Current store data
    ...props, // 4. Props (highest priority)
  };

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  const formatPriceNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  // Translate property status to Arabic
  const translateStatus = (status: string): string => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "available":
        return "متاح";
      case "rented":
        return "تم تأجيره";
      case "sold":
        return "مُباع";
      case "unavailable":
        return "غير متاح";
      case "للبيع":
        return "للبيع";
      case "للإيجار":
        return "للإيجار";
      case "مكتمل":
        return "مكتمل";
      case "قيد الإنشاء":
        return "قيد الإنشاء";
      default:
        // If already in Arabic, return as is
        return status;
    }
  };

  const property = mergedData.property || getDefaultCard4Data().property;
  const styling = mergedData.styling || {};
  const typography = mergedData.typography || {};
  const responsive = mergedData.responsive || {};

  const imageHeight = responsive.imageHeight || {};
  const desktopHeight = imageHeight.desktop || "337px";
  const tabletHeight = imageHeight.tablet || "300px";
  const mobileHeight = imageHeight.mobile || "250px";

  const CardContent = (
    <div
      className="overflow-hidden transition-shadow duration-300"
      style={{
        backgroundColor: styling.cardBackgroundColor || "#ffffff",
        borderRadius: styling.cardBorderRadius || "20px",
        boxShadow:
          styling.cardShadow === "sm"
            ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
            : styling.cardShadow === "md"
              ? "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      }}
      onMouseEnter={(e) => {
        if (styling.cardHoverShadow === "md") {
          e.currentTarget.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.1)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          styling.cardShadow === "sm"
            ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
            : styling.cardShadow === "md"
              ? "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              : "0 1px 2px 0 rgb(0 0 0 / 0.05)";
      }}
    >
      {/* Image Section */}
      <div
        className="relative w-full"
        style={{
          height: desktopHeight,
        }}
      >
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 387px"
        />
        {/* Featured Badge */}
        {property.featured && (
          <div
            className="absolute top-4 right-4 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-md"
            style={{
              backgroundColor: styling.featuredBadgeBackground || "#fbbf24",
            }}
          >
            <StarIcon />
            <span
              className="text-sm font-medium"
              style={{
                color: styling.featuredBadgeTextColor || "#000000",
              }}
            >
              مشروع مميز
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Title and Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4
              className="mb-2"
              style={{
                fontSize: typography.title?.fontSize || "xl",
                fontWeight: typography.title?.fontWeight || "bold",
                fontFamily: typography.title?.fontFamily || "Tajawal",
                color: styling.titleColor || "#000000",
              }}
            >
              {property.title}
            </h4>
            <div
              className="flex items-center gap-2"
              style={{
                fontSize: typography.cityDistrict?.fontSize || "sm",
                fontWeight: typography.cityDistrict?.fontWeight || "normal",
                fontFamily: typography.cityDistrict?.fontFamily || "Tajawal",
                color: styling.cityDistrictColor || "#000000",
              }}
            >
              <span>في {property.city}</span>
              <span>-</span>
              <span>{property.district}</span>
            </div>
          </div>
          <div
            style={{
              fontSize: typography.status?.fontSize || "lg",
              fontWeight: typography.status?.fontWeight || "semibold",
              fontFamily: typography.status?.fontFamily || "Tajawal",
              color: styling.statusColor || "#16a34a",
            }}
          >
            {translateStatus(property.status)}
          </div>
        </div>

        {/* Divider */}
        <div
          className="border-t"
          style={{
            borderColor: styling.dividerColor || "#e5e7eb",
          }}
        ></div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Area */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AreaIcon
                style={{
                  color: styling.areaIconColor || "#896042",
                }}
              />
              <span
                style={{
                  fontSize: typography.detailValue?.fontSize || "sm",
                  fontWeight: typography.detailValue?.fontWeight || "medium",
                  fontFamily: typography.detailValue?.fontFamily || "Tajawal",
                  color: styling.areaTextColor || "#896042",
                }}
              >
                {formatNumber(property.area.min)} -{" "}
                {formatNumber(property.area.max)} م²
              </span>
            </div>
            <span
              style={{
                fontSize: typography.detailLabel?.fontSize || "xs",
                fontWeight: typography.detailLabel?.fontWeight || "normal",
                fontFamily: typography.detailLabel?.fontFamily || "Tajawal",
                color: styling.areaLabelColor || "#6b7280",
              }}
            >
              المساحة
            </span>
          </div>

          {/* Rooms */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BedIcon
                style={{
                  color: styling.roomsIconColor || "#896042",
                }}
              />
              <span
                style={{
                  fontSize: typography.detailValue?.fontSize || "sm",
                  fontWeight: typography.detailValue?.fontWeight || "medium",
                  fontFamily: typography.detailValue?.fontFamily || "Tajawal",
                  color: styling.roomsTextColor || "#896042",
                }}
              >
                {property.rooms.min} - {property.rooms.max}
              </span>
            </div>
            <span
              style={{
                fontSize: typography.detailLabel?.fontSize || "xs",
                fontWeight: typography.detailLabel?.fontWeight || "normal",
                fontFamily: typography.detailLabel?.fontFamily || "Tajawal",
                color: styling.roomsLabelColor || "#6b7280",
              }}
            >
              عدد الغرف
            </span>
          </div>

          {/* Units */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BuildingIcon
                style={{
                  color: styling.unitsIconColor || "#896042",
                }}
              />
              <span
                style={{
                  fontSize: typography.detailValue?.fontSize || "sm",
                  fontWeight: typography.detailValue?.fontWeight || "medium",
                  fontFamily: typography.detailValue?.fontFamily || "Tajawal",
                  color: styling.unitsTextColor || "#896042",
                }}
              >
                {property.units}
              </span>
            </div>
            <span
              style={{
                fontSize: typography.detailLabel?.fontSize || "xs",
                fontWeight: typography.detailLabel?.fontWeight || "normal",
                fontFamily: typography.detailLabel?.fontFamily || "Tajawal",
                color: styling.unitsLabelColor || "#6b7280",
              }}
            >
              عدد الوحدات
            </span>
          </div>

          {/* Floors */}
          <div className="flex flex-col items-center text-center col-start-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <StairsIcon
                style={{
                  color: styling.floorsIconColor || "#896042",
                }}
              />
              <span
                style={{
                  fontSize: typography.detailValue?.fontSize || "sm",
                  fontWeight: typography.detailValue?.fontWeight || "medium",
                  fontFamily: typography.detailValue?.fontFamily || "Tajawal",
                  color: styling.floorsTextColor || "#896042",
                }}
              >
                {property.floors.min} - {property.floors.max}
              </span>
            </div>
            <span
              style={{
                fontSize: typography.detailLabel?.fontSize || "xs",
                fontWeight: typography.detailLabel?.fontWeight || "normal",
                fontFamily: typography.detailLabel?.fontFamily || "Tajawal",
                color: styling.floorsLabelColor || "#6b7280",
              }}
            >
              عدد الطوابق
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div
          className="rounded-lg px-4 py-3 text-center"
          style={{
            backgroundColor: styling.priceBackgroundColor || "#896042",
          }}
        >
          <div
            style={{
              fontSize: typography.price?.fontSize || "base",
              fontWeight: typography.price?.fontWeight || "medium",
              fontFamily: typography.price?.fontFamily || "Tajawal",
              color: styling.priceTextColor || "#ffffff",
            }}
          >
            {(() => {
              // Check if this is a project (based on URL or status)
              const isProject = 
                property.url?.includes('/project/') || 
                property.status === 'مكتمل' || 
                property.status === 'قيد الإنشاء';
              
              // If it's a project and price is an object with min/max, show as range
              if (isProject && typeof property.price === 'object' && 'min' in property.price && 'max' in property.price) {
                return `${formatPriceNumber(property.price.min)} - ${formatPriceNumber(property.price.max)} ريال`;
              }
              
              // For properties or if price is a number, show as single value
              // If price is object but it's a property, use min value or convert to number
              if (typeof property.price === 'object' && 'min' in property.price) {
                return `${formatPriceNumber(property.price.min)} ريال`;
              }
              
              return `${formatPriceNumber(property.price as number)} ريال`;
            })()}
          </div>
        </div>
      </div>
    </div>
  );

  if (property.url) {
    return (
      <Link href={property.url} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
