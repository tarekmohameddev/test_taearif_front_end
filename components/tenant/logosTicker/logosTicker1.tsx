"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultLogosTickerData } from "@/context/editorStoreFunctions/logosTickerFunctions";
import {
  TrustedBrandsScroller,
  TrustedBrandsScrollerReverse,
} from "@/components/tenant/logosTicker/components/trusted-brands-scroller";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface LogosTickerProps {
  // Component-specific props
  visible?: boolean;
  layout?: {
    maxWidth?: string;
    padding?: {
      top?: string;
      bottom?: string;
    };
  };
  content?: {
    title?: string;
    subtitle?: string;
  };
  logos?: Array<{
    id?: string;
    src: string;
    alt?: string;
  }>;
  displayMode?: "both" | "forward" | "reverse";
  animation?: {
    speed?: number;
    pauseOnHover?: boolean;
  };
  styling?: {
    backgroundColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    logoOpacity?: number;
    logoHoverOpacity?: number;
  };
  typography?: any;

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function LogosTicker1(props: LogosTickerProps) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "logosTicker1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const logosTickerStates = useEditorStore((s) => s.logosTickerStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // ─────────────────────────────────────────────────────────
  // 3. FETCH TENANT DATA
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // ─────────────────────────────────────────────────────────
  // 4. GET TENANT COMPONENT DATA
  // ─────────────────────────────────────────────────────────
  // Get tenant data for this specific component variant - memoized
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
          // Use componentId === props.id (most reliable identifier)
          if (
            (component as any).type === "logosTicker" &&
            (componentId === props.id ||
              (component as any).id === props.id ||
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
            (component as any).type === "logosTicker" &&
            ((component as any).id === props.id ||
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

  // ⭐ DEBUG: Log tenant component data search
  if (props.useStore && Object.keys(tenantComponentData).length === 0) {
    console.group("🔍 LogosTicker1 Tenant Data Search Debug");
    console.log("Searching for component with:");
    console.log("  - props.id:", props.id);
    console.log("  - uniqueId:", uniqueId);
    console.log("  - variantId:", variantId);
    console.log("  - type: logosTicker");
    console.log("Tenant Data componentSettings:", tenantData?.componentSettings);
    if (tenantData?.componentSettings?.homepage) {
      const homepage = tenantData.componentSettings.homepage;
      console.log("Homepage components:", Array.isArray(homepage) ? homepage : Object.values(homepage));
      const logosTickerComponents = Array.isArray(homepage)
        ? homepage.filter((c: any) => c.type === "logosTicker")
        : Object.values(homepage).filter((c: any) => (c as any).type === "logosTicker");
      console.log("LogosTicker components found:", logosTickerComponents);
    }
    console.groupEnd();
  }

  // ─────────────────────────────────────────────────────────
  // 5. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultLogosTickerData(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultLogosTickerData(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("logosTicker", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 6. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = logosTickerStates[uniqueId];
  const currentStoreData = getComponentData("logosTicker", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 7. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  // Merge data with priority: currentStoreData > tenantComponentData > props > default
  // This follows the exact same pattern as hero1.tsx
  // Priority order: Current Store > Backend > Props > Default
  // However, if currentStoreData contains default data and tenantComponentData exists,
  // prioritize tenantComponentData (it has the actual database data)
  const defaultData = getDefaultLogosTickerData();
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data (by comparing content.title)
  const isStoreDataDefault =
    currentStoreData?.content?.title === defaultData?.content?.title;

  // If tenantComponentData exists and currentStoreData is just default data,
  // prioritize tenantComponentData over currentStoreData
  const mergedData = {
    ...defaultData, // 1. Defaults (lowest priority)
    ...props, // 2. Props from parent component
    // If tenantComponentData exists, use it (it's from Database)
    ...(hasTenantData ? tenantComponentData : {}), // 3. Backend data (tenant data)
    // Use currentStoreData only if it's not just default data
    // (meaning it has been updated by user) or if tenantComponentData doesn't exist
    ...(hasTenantData && isStoreDataDefault
      ? {}
      : currentStoreData), // 4. Current store data (highest priority if not default)
  };

  // ⭐ DEBUG: Log data sources
  if (props.useStore) {
    console.group("🔍 LogosTicker1 Data Sources");
    console.log("1️⃣ Default Data:", defaultData);
    console.log("2️⃣ Props:", props);
    console.log("3️⃣ Tenant Component Data:", tenantComponentData);
    console.log("4️⃣ Current Store Data:", currentStoreData);
    console.log("🔍 Is Store Data Default?", isStoreDataDefault);
    console.log("🔍 Has Tenant Data?", hasTenantData);
    console.log("🔀 Merged Data:", mergedData);
    console.log("Final Title:", mergedData.content?.title);
    console.log("Final Subtitle:", mergedData.content?.subtitle);
    console.log("Final Logos Count:", mergedData.logos?.length);
    console.log("Display Mode:", mergedData.displayMode);
    console.groupEnd();
  }

  // ─────────────────────────────────────────────────────────
  // 8. GET BRANDING COLORS
  // ─────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────
  // 9. HELPER FUNCTION TO GET COLOR
  // ─────────────────────────────────────────────────────────
  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669",
  ): string => {
    // Get styling data from mergedData
    const styling = mergedData?.styling || {};

    // Navigate to the field using the path (e.g., "titleColor")
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
      if (fieldPath.includes("titleColor") || fieldPath.includes("title")) {
        defaultGlobalColorType = "primary";
      } else if (
        fieldPath.includes("textColor") ||
        fieldPath.includes("Text") ||
        fieldPath.includes("subtitleColor")
      ) {
        defaultGlobalColorType = "secondary";
      } else if (
        fieldPath.includes("button") ||
        fieldPath.includes("Button") ||
        fieldPath.includes("bgColor") ||
        fieldPath.includes("backgroundColor")
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
    if (fieldPath.includes("titleColor") || fieldPath.includes("title")) {
      defaultGlobalColorType = "primary";
    } else if (
      fieldPath.includes("textColor") ||
      fieldPath.includes("Text") ||
      fieldPath.includes("subtitleColor")
    ) {
      defaultGlobalColorType = "secondary";
    }
    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

  // ─────────────────────────────────────────────────────────
  // 10. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 11. RENDER
  // ─────────────────────────────────────────────────────────
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === "ar";

  // Get display mode (default to "both")
  const displayMode = mergedData.displayMode || "both";

  // Prepare logos array
  const logos = mergedData.logos || [];

  // Animation settings
  const animationSpeed = mergedData.animation?.speed || 40;
  const pauseOnHover = mergedData.animation?.pauseOnHover !== false;
  const logoOpacity = mergedData.styling?.logoOpacity || 0.6;
  const logoHoverOpacity = mergedData.styling?.logoHoverOpacity || 1.0;

  return (
    <section
      className="py-16 md:py-20"
      style={{
        backgroundColor: mergedData.styling?.backgroundColor || "transparent",
        paddingTop: mergedData.layout?.padding?.top || "4rem",
        paddingBottom: mergedData.layout?.padding?.bottom || "4rem",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          maxWidth: mergedData.layout?.maxWidth || "1600px",
        }}
      >
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="section-title font-bold mb-6"
            style={{
              color: getColor("titleColor", brandingColors.primary),
              fontSize:
                mergedData.typography?.title?.fontSize?.desktop || "3xl",
              fontWeight: mergedData.typography?.title?.fontWeight || "bold",
              fontFamily: mergedData.typography?.title?.fontFamily || "Tajawal",
            }}
          >
            {mergedData.content?.title ||
              (isRTL
                ? "موثوق بنا من قبل الفرق الطموحة التي تبني المستقبل"
                : "Trusted by ambitious teams building the future")}
          </h2>
          <p
            className="section-subtitle text-gray-600 max-w-3xl mx-auto leading-relaxed"
            style={{
              color: mergedData.styling?.subtitleColor || "#6b7280",
              fontSize:
                mergedData.typography?.subtitle?.fontSize?.desktop || "lg",
              fontWeight:
                mergedData.typography?.subtitle?.fontWeight || "normal",
              fontFamily:
                mergedData.typography?.subtitle?.fontFamily || "Tajawal",
            }}
          >
            {mergedData.content?.subtitle ||
              (isRTL
                ? "من الشركات الناشئة إلى الشركات الكبرى يعتمد عملائنا على رواد لتبسيط العمليات وتعزيز الرؤية وتسريع النمو."
                : "From startups to established enterprises, our clients rely on Rouad to streamline operations, boost visibility, and accelerate growth.")}
          </p>
        </div>

        {/* Scrolling Logos */}
        <div className="space-y-8" dir="ltr">
          {/* Show forward scroller if displayMode is "both" or "forward" */}
          {(displayMode === "both" || displayMode === "forward") && (
            <TrustedBrandsScroller
              logos={logos}
              speed={animationSpeed}
              pauseOnHover={pauseOnHover}
              opacity={logoOpacity}
              hoverOpacity={logoHoverOpacity}
            />
          )}

          {/* Show reverse scroller if displayMode is "both" or "reverse" */}
          {(displayMode === "both" || displayMode === "reverse") && (
            <TrustedBrandsScrollerReverse
              logos={logos}
              speed={animationSpeed}
              pauseOnHover={pauseOnHover}
              opacity={logoOpacity}
              hoverOpacity={logoHoverOpacity}
            />
          )}
        </div>
      </div>
    </section>
  );
}
