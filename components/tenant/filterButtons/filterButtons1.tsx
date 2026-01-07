"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePropertiesStore } from "@/store/propertiesStore";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { getDefaultFilterButtonsData } from "@/context/editorStoreFunctions/filterButtonsFunctions";

type FilterType = "all" | "available" | "sold" | "rented";

interface FilterButtonsProps {
  className?: string;
  useStore?: boolean;
  id?: string;
  variant?: string;
  content?: any;
}

export default function FilterButtons({
  className,
  useStore = false,
  id,
  variant = "filterButtons1",
  content,
}: FilterButtonsProps) {
  // Initialize variant id early so hooks can depend on it
  const variantId = variant || "filterButtons1";
  const uniqueId = id || variantId;

  // Subscribe to editor store updates for this filterButtons variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const filterButtonsStates = useEditorStore((s) => s.filterButtonsStates);

  // Store state
  const { transactionType, activeFilter, setActiveFilter } =
    usePropertiesStore();

  // Get tenant data from store
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get data from store or content prop with fallback logic
  const storeData = useStore
    ? getComponentData("filterButtons", uniqueId) || {}
    : {};
  const currentStoreData = useStore ? filterButtonsStates[uniqueId] || {} : {};

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      return {};
    }
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      // Check if pageComponents is an object (not array)
      if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          // Check if this is the exact component we're looking for by ID
          // Use componentId === id (most reliable identifier)
          if (
            (component as any).type === "filterButtons" &&
            (componentId === id ||
              (component as any).id === id ||
              (component as any).id === uniqueId)
          ) {
            return (component as any).data;
          }
        }
      }
      // Also handle array format
      if (Array.isArray(pageComponents)) {
        for (const component of pageComponents) {
          // Search by id (most reliable identifier)
          if (
            (component as any).type === "filterButtons" &&
            ((component as any).id === id ||
              (component as any).id === uniqueId)
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  useEffect(() => {
    if (useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultFilterButtonsData(),
              ...tenantComponentData, // Database data takes priority
              ...content,
            }
          : {
              ...getDefaultFilterButtonsData(),
              ...content,
            };
      ensureComponentVariant("filterButtons", uniqueId, initialData);
    }
  }, [
    uniqueId,
    useStore,
    ensureComponentVariant,
    tenantComponentData,
    content,
  ]);

  // Get default data
  const defaultData = getDefaultFilterButtonsData();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data
  const isStoreDataDefault =
    JSON.stringify(currentStoreData) === JSON.stringify(defaultData);

  // Merge content prop with correct priority
  const mergedContent = {
    ...defaultData, // 1. Defaults (lowest priority)
    ...content, // 2. Props from parent component
    // If tenantComponentData exists, use it (it's from Database)
    ...(hasTenantData ? tenantComponentData : {}), // 3. Backend data (tenant data)
    // Use currentStoreData only if it's not just default data
    ...(hasTenantData && isStoreDataDefault
      ? {}
      : currentStoreData), // 4. Current store data (highest priority if not default)
  };

  // ⭐ DEBUG: Log data sources (optional - remove in production)
  if (
    useStore &&
    typeof window !== "undefined" &&
    (window as any).__DEBUG_COMPONENT_DATA__
  ) {
    console.group("🔍 FilterButtons1 Data Sources");
    console.log("1️⃣ Default Data:", defaultData);
    console.log("2️⃣ Content Props:", content);
    console.log("3️⃣ Tenant Component Data:", tenantComponentData);
    console.log("4️⃣ Current Store Data:", currentStoreData);
    console.log("🔍 Is Store Data Default?", isStoreDataDefault);
    console.log("🔍 Has Tenant Data?", hasTenantData);
    console.log("🔀 Merged Content:", mergedContent);
    console.groupEnd();
  }

  // Get branding colors from WebsiteLayout (fallback to emerald-600)
  // emerald-600 in Tailwind = #059669
  const brandingColors = {
    primary:
      tenantData?.WebsiteLayout?.branding?.colors?.primary &&
      tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.primary
        : "#059669", // emerald-600 default (fallback)
    secondary:
      tenantData?.WebsiteLayout?.branding?.colors?.secondary &&
      tenantData.WebsiteLayout.branding.colors.secondary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.secondary
        : "#059669", // fallback to primary
    accent:
      tenantData?.WebsiteLayout?.branding?.colors?.accent &&
      tenantData.WebsiteLayout.branding.colors.accent.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.accent
        : "#059669", // fallback to primary
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669",
  ): string => {
    // Get styling data from mergedContent (which includes store data)
    const styling = mergedContent?.styling || {};

    // Navigate to the field using the path (e.g., "inspectionButton.bgColor")
    const pathParts = fieldPath.split(".");
    let fieldData = styling;
    for (const part of pathParts) {
      if (
        fieldData &&
        typeof fieldData === "object" &&
        !Array.isArray(fieldData)
      ) {
        fieldData = fieldData[part];
      } else {
        fieldData = undefined;
        break;
      }
    }

    // Also check for useDefaultColor and globalColorType at the same path level
    const useDefaultColorPath = `${fieldPath}.useDefaultColor`;
    const globalColorTypePath = `${fieldPath}.globalColorType`;
    const useDefaultColorPathParts = useDefaultColorPath.split(".");
    let useDefaultColorValue = styling;
    for (const part of useDefaultColorPathParts) {
      if (
        useDefaultColorValue &&
        typeof useDefaultColorValue === "object" &&
        !Array.isArray(useDefaultColorValue)
      ) {
        useDefaultColorValue = useDefaultColorValue[part];
      } else {
        useDefaultColorValue = undefined;
        break;
      }
    }

    const globalColorTypePathParts = globalColorTypePath.split(".");
    let globalColorTypeValue = styling;
    for (const part of globalColorTypePathParts) {
      if (
        globalColorTypeValue &&
        typeof globalColorTypeValue === "object" &&
        !Array.isArray(globalColorTypeValue)
      ) {
        globalColorTypeValue = globalColorTypeValue[part];
      } else {
        globalColorTypeValue = undefined;
        break;
      }
    }

    // Check useDefaultColor value (default is true if not specified)
    const useDefaultColor =
      useDefaultColorValue !== undefined ? useDefaultColorValue : true;

    // If useDefaultColor is true, use branding color from WebsiteLayout
    if (useDefaultColor) {
      // Determine default globalColorType based on field path if not set
      let defaultGlobalColorType = "primary";
      if (fieldPath.includes("textColor") || fieldPath.includes("Text")) {
        defaultGlobalColorType = "secondary";
      } else if (
        fieldPath.includes("Button") ||
        fieldPath.includes("button") ||
        fieldPath.includes("hoverBgColor")
      ) {
        defaultGlobalColorType = "primary";
      }

      const globalColorType = globalColorTypeValue || defaultGlobalColorType;
      const brandingColor =
        brandingColors[globalColorType as keyof typeof brandingColors] ||
        defaultColor;
      return brandingColor;
    }

    // If useDefaultColor is false, try to get custom color
    // The color might be stored directly as string or in a value property of an object
    if (typeof fieldData === "string" && fieldData.startsWith("#")) {
      return fieldData;
    }

    // If fieldData is an object, check for value property
    if (
      fieldData &&
      typeof fieldData === "object" &&
      !Array.isArray(fieldData)
    ) {
      if (
        fieldData.value &&
        typeof fieldData.value === "string" &&
        fieldData.value.startsWith("#")
      ) {
        return fieldData.value;
      }
    }

    // Final fallback: use default branding color
    let defaultGlobalColorType = "primary";
    if (fieldPath.includes("textColor") || fieldPath.includes("Text")) {
      defaultGlobalColorType = "secondary";
    }
    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

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

  // Helper function to create lighter color (for hover backgrounds)
  const getLighterColor = (hex: string, opacity: number = 0.1): string => {
    if (!hex || !hex.startsWith("#")) return `${primaryColor}1A`; // 10% opacity default
    // Return hex color with opacity using rgba
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return `${primaryColor}1A`;

    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Helper function to get contrast text color (black or white) based on background color
  // Uses WCAG luminance formula to determine if background is light or dark
  const getContrastTextColor = (backgroundColor: string): string => {
    if (!backgroundColor || !backgroundColor.startsWith("#")) return "#ffffff";
    const cleanHex = backgroundColor.replace("#", "");
    if (cleanHex.length !== 6) return "#ffffff";

    // Parse RGB values
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    // Calculate relative luminance using WCAG formula
    // https://www.w3.org/WAI/GL/wiki/Relative_luminance
    const getLuminance = (value: number): number => {
      const normalized = value / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : Math.pow((normalized + 0.055) / 1.055, 2.4);
    };

    const luminance =
      0.2126 * getLuminance(r) +
      0.7152 * getLuminance(g) +
      0.0722 * getLuminance(b);

    // If luminance is less than 0.5, use white text, otherwise use black text
    return luminance < 0.5 ? "#ffffff" : "#000000";
  };

  // Get colors for inspection button
  const inspectionButtonBgColor = getColor(
    "inspectionButton.bgColor",
    "#059669",
  );
  // Always calculate text color from background color (black or white) - ignore custom text color
  const inspectionButtonTextColor = getContrastTextColor(
    inspectionButtonBgColor,
  );
  const inspectionButtonHoverBgColor = getColor(
    "inspectionButton.hoverBgColor",
    getDarkerColor(inspectionButtonBgColor, 20),
  );
  // Always calculate hover text color from hover background color
  const inspectionButtonHoverTextColor = getContrastTextColor(
    inspectionButtonHoverBgColor,
  );

  // Get colors for filter buttons
  const filterButtonsActiveBgColor = getColor(
    "filterButtons.activeBgColor",
    "#059669",
  );
  // Always calculate text color from background color (black or white) - ignore custom text color
  const filterButtonsActiveTextColor = getContrastTextColor(
    filterButtonsActiveBgColor,
  );
  const filterButtonsInactiveTextColor = getColor(
    "filterButtons.inactiveTextColor",
    "#059669",
  );
  const filterButtonsHoverBgColor = getColor(
    "filterButtons.hoverBgColor",
    getLighterColor(filterButtonsActiveBgColor, 0.1),
  );
  // Always calculate hover text color from hover background color
  const filterButtonsHoverTextColor = getContrastTextColor(
    filterButtonsHoverBgColor,
  );

  // Use the colors for primaryColor and variants
  const primaryColor = inspectionButtonBgColor;
  const primaryColorHover = inspectionButtonHoverBgColor;
  const primaryColorLight = getLighterColor(primaryColor, 0.1); // 10% opacity for hover backgrounds
  const getFilterButtons = () => {
    if (transactionType === "rent") {
      return [
        { key: "all" as FilterType, label: "الكل" },
        { key: "available" as FilterType, label: "المتاحة للإيجار" },
        { key: "rented" as FilterType, label: "تم تأجيرها" },
      ];
    } else {
      return [
        { key: "all" as FilterType, label: "الكل" },
        { key: "available" as FilterType, label: "المتاحة للبيع" },
        { key: "sold" as FilterType, label: "تم بيعها" },
      ];
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row justify-between ${className || ""} max-w-[1600px] mx-auto`}
    >
      {/* زر طلب المعاينة */}
      {/* زر طلب معاينة مخفي حالياً بشكل مؤقت ولا اريد ازالته */}
      {/* <Link
        href="/application-form"
        className="w-[80%] mb-[20px] md:w-fit md:mx-0 flex items-center justify-center text-[12px] md:text-[14px] lg:text-[20px] relative transition-all duration-300 ease-in-out text-nowrap rounded-[10px] px-[20px] py-[8px] mx-auto"
        style={{ 
          backgroundColor: primaryColor,
          color: inspectionButtonTextColor
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = primaryColorHover;
          e.currentTarget.style.color = inspectionButtonHoverTextColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = primaryColor;
          e.currentTarget.style.color = inspectionButtonTextColor;
        }}
      >
        طلب معاينة
      </Link> */}

      {/* أزرار الفلتر */}
      <div className="filterButtons mb-6 flex items-center justify-center md:justify-start gap-x-[24px]">
        {getFilterButtons().map((button) => (
          <Button
            key={button.key}
            onClick={() => {
              setActiveFilter(button.key);
            }}
            variant="ghost"
            className="w-fit text-[12px] md:text-[14px] lg:text-[20px] relative transition-all duration-300 ease-in-out text-nowrap rounded-[10px] px-[20px] py-[8px]"
            style={
              activeFilter === button.key
                ? {
                    backgroundColor: filterButtonsActiveBgColor,
                    color: filterButtonsActiveTextColor,
                  }
                : {
                    backgroundColor: "white",
                    color: filterButtonsInactiveTextColor,
                  }
            }
            onMouseEnter={(e) => {
              if (activeFilter !== button.key) {
                e.currentTarget.style.backgroundColor =
                  filterButtonsHoverBgColor;
                e.currentTarget.style.color = filterButtonsHoverTextColor;
              } else {
                const hoverBgColor = getDarkerColor(
                  filterButtonsActiveBgColor,
                  20,
                );
                e.currentTarget.style.backgroundColor = hoverBgColor;
                e.currentTarget.style.color =
                  getContrastTextColor(hoverBgColor);
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter === button.key) {
                e.currentTarget.style.backgroundColor =
                  filterButtonsActiveBgColor;
                e.currentTarget.style.color = filterButtonsActiveTextColor;
              } else {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = filterButtonsInactiveTextColor;
              }
            }}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
