"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultPartnersData } from "@/context/editorStoreFunctions/partnersFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface PartnersProps {
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
    description?: string;
  };
  partners?: Array<{
    id?: string;
    src: string;
    alt?: string;
  }>;
  grid?: {
    columns?: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
    gap?: string;
  };
  styling?: {
    backgroundColor?: string;
    titleColor?: string;
    descriptionColor?: string;
    cardBackgroundColor?: string;
    cardHoverBackgroundColor?: string;
    logoOpacity?: number;
    logoHoverOpacity?: number;
  };
  typography?: any;
  animation?: {
    enabled?: boolean;
    type?: string;
    duration?: number;
    threshold?: number;
  };

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function Partners1(props: PartnersProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "partners1";
  const uniqueId = props.id || variantId;

  // Subscribe to editor store updates for this partners variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const partnersStates = useEditorStore((s) => s.partnersStates);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData) {
      return {};
    }

    // First, check if data comes directly from API response (new structure)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "partners" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    // Fallback: check componentSettings (old structure)
    if (tenantData?.componentSettings) {
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
            // Check if this is the exact component we're looking for by type and componentName
            if (
              (component as any).type === "partners" &&
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
      // If we have tenant data, use it; otherwise use props or defaults
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultPartnersData(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultPartnersData(),
              ...props,
            };
      ensureComponentVariant("partners", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("partners", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore ? partnersStates[uniqueId] || {} : {};

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

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const defaultData = getDefaultPartnersData();
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    // Ensure nested objects are properly merged
    content: {
      ...defaultData.content,
      ...(props.content || {}),
      ...(tenantComponentData.content || {}),
      ...(storeData.content || {}),
      ...(currentStoreData.content || {}),
    },
    layout: {
      ...defaultData.layout,
      ...(props.layout || {}),
      ...(tenantComponentData.layout || {}),
      ...(storeData.layout || {}),
      ...(currentStoreData.layout || {}),
      padding: {
        ...defaultData.layout?.padding,
        ...(props.layout?.padding || {}),
        ...(tenantComponentData.layout?.padding || {}),
        ...(storeData.layout?.padding || {}),
        ...(currentStoreData.layout?.padding || {}),
      },
    },
    grid: {
      ...defaultData.grid,
      ...(props.grid || {}),
      ...(tenantComponentData.grid || {}),
      ...(storeData.grid || {}),
      ...(currentStoreData.grid || {}),
      columns: {
        ...defaultData.grid?.columns,
        ...(props.grid?.columns || {}),
        ...(tenantComponentData.grid?.columns || {}),
        ...(storeData.grid?.columns || {}),
        ...(currentStoreData.grid?.columns || {}),
      },
    },
    styling: {
      ...defaultData.styling,
      ...(props.styling || {}),
      ...(tenantComponentData.styling || {}),
      ...(storeData.styling || {}),
      ...(currentStoreData.styling || {}),
    },
    typography: {
      ...defaultData.typography,
      ...(props.typography || {}),
      ...(tenantComponentData.typography || {}),
      ...(storeData.typography || {}),
      ...(currentStoreData.typography || {}),
      title: {
        ...defaultData.typography?.title,
        ...(props.typography?.title || {}),
        ...(tenantComponentData.typography?.title || {}),
        ...(storeData.typography?.title || {}),
        ...(currentStoreData.typography?.title || {}),
        fontSize: {
          ...defaultData.typography?.title?.fontSize,
          ...(props.typography?.title?.fontSize || {}),
          ...(tenantComponentData.typography?.title?.fontSize || {}),
          ...(storeData.typography?.title?.fontSize || {}),
          ...(currentStoreData.typography?.title?.fontSize || {}),
        },
      },
      description: {
        ...defaultData.typography?.description,
        ...(props.typography?.description || {}),
        ...(tenantComponentData.typography?.description || {}),
        ...(storeData.typography?.description || {}),
        ...(currentStoreData.typography?.description || {}),
        fontSize: {
          ...defaultData.typography?.description?.fontSize,
          ...(props.typography?.description?.fontSize || {}),
          ...(tenantComponentData.typography?.description?.fontSize || {}),
          ...(storeData.typography?.description?.fontSize || {}),
          ...(currentStoreData.typography?.description?.fontSize || {}),
        },
      },
    },
    // Partners array - use the one with highest priority
    partners:
      props?.partners ||
      tenantComponentData?.partners ||
      storeData?.partners ||
      currentStoreData?.partners ||
      defaultData.partners,
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669",
  ): string => {
    // Get styling data from mergedData (check styling.colors, and colors)
    const styling = mergedData?.styling || {};

    // For other paths, use existing logic
    const colors = styling?.colors || mergedData?.colors || {};

    // Navigate to the field using the path (e.g., "titleColor")
    const pathParts = fieldPath.split(".");
    let fieldData = colors;
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
    let useDefaultColorValue = colors;
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
    let globalColorTypeValue = colors;
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
      if (fieldPath.includes("titleColor")) {
        defaultGlobalColorType = "primary"; // Title color uses primary color
      } else if (
        fieldPath.includes("descriptionColor") ||
        fieldPath.includes("textColor")
      ) {
        defaultGlobalColorType = "secondary";
      } else if (
        fieldPath.includes("iconColor") ||
        fieldPath.includes("ringColor") ||
        fieldPath.includes("primary")
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
    if (fieldPath.includes("titleColor")) {
      defaultGlobalColorType = "primary"; // Title color uses primary color
    } else if (
      fieldPath.includes("descriptionColor") ||
      fieldPath.includes("textColor")
    ) {
      defaultGlobalColorType = "secondary";
    }
    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Get colors using getColor function
  const titleColor = getColor("titleColor", brandingColors.primary);
  const descriptionColor = mergedData.styling?.descriptionColor || "#6E6E75";
  const backgroundColor = mergedData.styling?.backgroundColor || "transparent";
  const cardBackgroundColor =
    mergedData.styling?.cardBackgroundColor || "#f9fafb";
  const cardHoverBackgroundColor =
    mergedData.styling?.cardHoverBackgroundColor || "#f3f4f6";
  const logoOpacity = mergedData.styling?.logoOpacity || 0.7;
  const logoHoverOpacity = mergedData.styling?.logoHoverOpacity || 1.0;

  // Prepare partners array
  const partners = mergedData.partners || [];

  // Get responsive column values
  const mobileColumns = mergedData.grid?.columns?.mobile || 2;
  const tabletColumns = mergedData.grid?.columns?.tablet || 3;
  const desktopColumns = mergedData.grid?.columns?.desktop || 6;

  return (
    <section
      id={`partners-${uniqueId}`}
      className="relative overflow-hidden"
      style={{
        backgroundColor:
          backgroundColor === "transparent" ? "transparent" : backgroundColor,
        paddingTop: mergedData.layout?.padding?.top || "5rem",
        paddingBottom: mergedData.layout?.padding?.bottom || "5rem",
      }}
    >
      <div
        className="container mx-auto px-4 relative z-10"
        dir="rtl"
        style={{
          maxWidth: mergedData.layout?.maxWidth || "1600px",
        }}
      >
        {/* Main heading */}
        <div className="text-center mb-16" dir="rtl">
          <h2
            className="font-bold mb-8 leading-tight text-2xl lg:text-3xl"
            style={{
              color: titleColor,
              fontWeight: mergedData.typography?.title?.fontWeight || "bold",
              fontFamily: mergedData.typography?.title?.fontFamily || "Tajawal",
              lineHeight: mergedData.typography?.title?.lineHeight || "tight",
            }}
          >
            {mergedData.content?.title}
          </h2>
        </div>

        {/* Responsive grid styles */}
        <style jsx>{`
          .partners-grid-${uniqueId} {
            display: grid;
            grid-template-columns: repeat(${mobileColumns}, 1fr);
            gap: ${mergedData.grid?.gap || "2rem"};
          }

          @media (min-width: 768px) {
            .partners-grid-${uniqueId} {
              grid-template-columns: repeat(${tabletColumns}, 1fr);
            }
          }

          @media (min-width: 1024px) {
            .partners-grid-${uniqueId} {
              grid-template-columns: repeat(${desktopColumns}, 1fr);
            }
          }
        `}</style>

        {/* Partners logos grid */}
        <div className={`partners-grid-${uniqueId}`}>
          {partners.map(
            (
              partner: { id?: string; src: string; alt?: string },
              index: number,
            ) => (
              <div
                key={partner.id + "-" + index || index}
                className="flex items-center justify-center p-6 rounded-lg transition-colors duration-300 group"
                style={{
                  backgroundColor: cardBackgroundColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    cardHoverBackgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = cardBackgroundColor;
                }}
              >
                <Image
                  src={partner.src || "/logo.svg"}
                  alt={partner.alt || `Partner Logo ${index + 1}`}
                  width={120}
                  height={60}
                  className="max-w-full h-auto transition-opacity duration-300"
                  style={{
                    opacity: logoOpacity,
                  }}
                  unoptimized={true}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = logoHoverOpacity.toString();
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = logoOpacity.toString();
                  }}
                />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
