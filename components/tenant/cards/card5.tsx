"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultCard5Data } from "@/context/editorStoreFunctions/card5Functions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface Property {
  ThemeTwo?: string;
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
  floors: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  price: number;
  bathrooms?: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  featured?: boolean;
  url?: string;
}

interface Card5Props {
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
    floorsIconColor?: string;
    floorsTextColor?: string;
    floorsLabelColor?: string;
    bathroomsIconColor?: string;
    bathroomsTextColor?: string;
    bathroomsLabelColor?: string;
    priceTextColor?: string;
    whatsappButtonBackground?: string;
    whatsappButtonHoverBackground?: string;
    whatsappButtonTextColor?: string;
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
    whatsappButton?: {
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

const ShowerIcon = () => (
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
      d="M7.45 17.425c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225Zm4.55 0c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225Zm4.55 0c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225ZM5 13.675v-1.5c0 -1.78335 0.60415 -3.34165 1.8125 -4.675 1.20835 -1.33335 2.6875 -2.09165 4.4375 -2.275V3h1.5v2.225c1.75 0.18335 3.22915 0.94165 4.4375 2.275C18.39585 8.83335 19 10.39165 19 12.175v1.5H5Zm1.5 -1.5h11c0 -1.51665 -0.53575 -2.8125 -1.60725 -3.8875 -1.0715 -1.075 -2.36735 -1.6125 -3.8875 -1.6125 -1.52015 0 -2.81775 0.53625 -3.89275 1.60875C7.0375 9.35625 6.5 10.65335 6.5 12.175ZM7.45 21c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225Zm4.55 0c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225Zm4.55 0c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225Z"
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
export default function Card5(props: Card5Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "card5";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const card5States = useEditorStore((s) => s.card5States);

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
              ...getDefaultCard5Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultCard5Data(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("card", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = card5States[uniqueId];
  const currentStoreData = getComponentData("card", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultCard5Data(), // 1. Defaults (lowest priority)
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
    return num.toLocaleString("ar-SA");
  };

  const property = mergedData.property || getDefaultCard5Data().property;
  const styling = mergedData.styling || {};
  const typography = mergedData.typography || {};
  const responsive = mergedData.responsive || {};

  const imageHeight = responsive.imageHeight || {};
  const desktopHeight = imageHeight.desktop || "337px";

  // Generate WhatsApp link
  const whatsappMessage = encodeURIComponent(
    `مرحبًا، أود الاستفسار عن هذا الفرد: ${property.title}${property.url ? `, رابط الأفراد: ${property.url}` : ""}`,
  );
  const whatsappUrl = `https://wa.me/966542120011?text=${whatsappMessage}`;

  const CardContent = (
    <div
      className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{
        backgroundColor: styling.cardBackgroundColor || "#ffffff",
        borderRadius: styling.cardBorderRadius || "20px",
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
            className="absolute top-4 right-4 bg-yellow-400 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-md"
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
              فرد مميز
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Title and Status - Same Row */}
        <div className="flex items-center justify-between gap-4">
          <h4
            className="text-xl font-bold"
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
            style={{
              fontSize: typography.status?.fontSize || "lg",
              fontWeight: typography.status?.fontWeight || "semibold",
              fontFamily: typography.status?.fontFamily || "Tajawal",
              color: styling.statusColor || "#16a34a",
            }}
          >
            {property.status}
          </div>
        </div>

        {/* Location */}
        <div
          className="flex items-center gap-2 text-sm"
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

        {/* Divider */}
        <div
          className="border-t"
          style={{
            borderColor: styling.dividerColor || "#e5e7eb",
          }}
        ></div>

        {/* Property Details Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Area */}
          <div className="flex flex-col items-center text-right">
            <div className="flex items-center justify-end gap-1 mb-1">
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
                {property.area.min === property.area.max
                  ? `${formatNumber(property.area.min)} م²`
                  : `${formatNumber(property.area.min)} - ${formatNumber(property.area.max)} م²`}
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

          {/* Floors */}
          <div className="flex flex-col items-center text-right">
            <div className="flex items-center justify-end gap-1 mb-1">
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
                {property.floors.min === property.floors.max
                  ? property.floors.min
                  : `${property.floors.min} - ${property.floors.max}`}
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

          {/* Bedrooms */}
          <div className="flex flex-col items-center text-right">
            <div className="flex items-center justify-end gap-1 mb-1">
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
                {property.rooms.min === property.rooms.max
                  ? property.rooms.min
                  : `${property.rooms.min} - ${property.rooms.max}`}
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
              غرف النوم
            </span>
          </div>

          {/* Bathrooms */}
          {property.bathrooms && (
            <div className="flex flex-col items-center text-right">
              <div className="flex items-center justify-end gap-1 mb-1">
                <ShowerIcon
                  style={{
                    color: styling.bathroomsIconColor || "#896042",
                  }}
                />
                <span
                  style={{
                    fontSize: typography.detailValue?.fontSize || "sm",
                    fontWeight: typography.detailValue?.fontWeight || "medium",
                    fontFamily: typography.detailValue?.fontFamily || "Tajawal",
                    color: styling.bathroomsTextColor || "#896042",
                  }}
                >
                  {property.bathrooms.min === property.bathrooms.max
                    ? property.bathrooms.min
                    : `${property.bathrooms.min} - ${property.bathrooms.max}`}
                </span>
              </div>
              <span
                style={{
                  fontSize: typography.detailLabel?.fontSize || "xs",
                  fontWeight: typography.detailLabel?.fontWeight || "normal",
                  fontFamily: typography.detailLabel?.fontFamily || "Tajawal",
                  color: styling.bathroomsLabelColor || "#6b7280",
                }}
              >
                الحمامات
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="border-t"
          style={{
            borderColor: styling.dividerColor || "#e5e7eb",
          }}
        ></div>

        {/* Price Section - No Background */}
        <div className="text-center">
          <div
            style={{
              fontSize: typography.price?.fontSize || "base",
              fontWeight: typography.price?.fontWeight || "bold",
              fontFamily: typography.price?.fontFamily || "Tajawal",
              color: styling.priceTextColor || "#896042",
            }}
          >
            {property.price.min === property.price.max
              ? `${formatNumber(property.price.min)} ريال سعودي`
              : `${formatNumber(property.price.min)} - ${formatNumber(property.price.max)} ريال سعودي`}
          </div>
        </div>

        {/* Divider */}
        <div
          className="border-t"
          style={{
            borderColor: styling.dividerColor || "#e5e7eb",
          }}
        ></div>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
          style={{
            backgroundColor: styling.whatsappButtonBackground || "#25D366",
            color: styling.whatsappButtonTextColor || "#ffffff",
            fontSize: typography.whatsappButton?.fontSize || "base",
            fontWeight: typography.whatsappButton?.fontWeight || "semibold",
            fontFamily: typography.whatsappButton?.fontFamily || "Tajawal",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              styling.whatsappButtonHoverBackground || "#20BA5A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              styling.whatsappButtonBackground || "#25D366";
          }}
        >
          <svg
            className="w-5 h-5 fill-white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.98 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span>اطلب الآن</span>
        </a>
      </div>
    </div>
  );

  if (property.url) {
    return (
      <a href={property.url} className="block">
        {CardContent}
      </a>
    );
  }

  return CardContent;
}
