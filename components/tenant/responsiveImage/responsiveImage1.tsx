"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultResponsiveImageData } from "@/context/editorStoreFunctions/responsiveImageFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface ResponsiveImageProps {
  // Component-specific props
  visible?: boolean;
  image?: {
    src?: string;
    alt?: string;
  };
  width?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  maxWidth?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  alignment?: "left" | "center" | "right";
  spacing?: {
    margin?: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    };
    padding?: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    };
  };
  styling?: {
    borderRadius?: string;
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
    shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
    border?: {
      enabled?: boolean;
      width?: string;
      color?: string;
      style?: "solid" | "dashed" | "dotted" | "double";
    };
  };
  responsive?: {
    mobileBreakpoint?: string;
    tabletBreakpoint?: string;
    desktopBreakpoint?: string;
  };

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function ResponsiveImage1(props: ResponsiveImageProps = {}) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "responsiveImage1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const responsiveImageStates = useEditorStore((s) => s.responsiveImageStates);

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
          component.type === "responsiveImage" &&
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
              (component as any).type === "responsiveImage" &&
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
              ...getDefaultResponsiveImageData(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultResponsiveImageData(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("responsiveImage", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]); // ✅ Add tenantComponentData dependency

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = responsiveImageStates[uniqueId];
  const currentStoreData = getComponentData("responsiveImage", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultResponsiveImageData(), // 1. Defaults (lowest priority)
    ...storeData, // 2. Store state
    ...currentStoreData, // 3. Current store data
    ...props, // 4. Props (highest priority)
  };

  const imageSrc =
    mergedData.image?.src ||
    "/images/placeholders/responsiveImage/responsiveImage.jpg";

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────

  // Get alignment classes
  const alignmentClasses = {
    left: "ml-0 mr-auto",
    center: "mx-auto",
    right: "ml-auto mr-0",
  };
  const alignmentKey = (mergedData.alignment ||
    "center") as keyof typeof alignmentClasses;

  // Get shadow classes
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  };
  const shadowKey = (mergedData.styling?.shadow ||
    "none") as keyof typeof shadowClasses;

  // Build responsive width styles
  const enforcedMaxWidth = "1200px";
  const widthStyles: React.CSSProperties = {
    width: mergedData.width?.mobile || "100%",
    maxWidth: `min(${enforcedMaxWidth}, 100%)`,
  };

  // Build container styles
  const containerStyles: React.CSSProperties = {
    marginTop: mergedData.spacing?.margin?.top || "0",
    marginBottom: mergedData.spacing?.margin?.bottom || "0",
    marginLeft: mergedData.spacing?.margin?.left || "auto",
    marginRight: mergedData.spacing?.margin?.right || "auto",
    paddingTop: mergedData.spacing?.padding?.top || "0",
    paddingBottom: mergedData.spacing?.padding?.bottom || "0",
    paddingLeft: mergedData.spacing?.padding?.left || "0",
    paddingRight: mergedData.spacing?.padding?.right || "0",
  };

  // Build image styles
  const imageStyles: React.CSSProperties = {
    width: "100%",
    height: "auto",
    borderRadius: mergedData.styling?.borderRadius || "0",
    objectFit: mergedData.styling?.objectFit || "cover",
    border:
      mergedData.styling?.border?.enabled &&
      mergedData.styling?.border?.width &&
      mergedData.styling?.border?.color
        ? `${mergedData.styling.border.width} ${mergedData.styling.border.style || "solid"} ${mergedData.styling.border.color}`
        : "none",
  };

  return (
    <div
      className={`responsive-image-container ${alignmentClasses[alignmentKey]} ${shadowClasses[shadowKey]}`}
      style={{
        ...containerStyles,
        // Ensure centering by default
        marginLeft: mergedData.spacing?.margin?.left || "auto",
        marginRight: mergedData.spacing?.margin?.right || "auto",
      }}
    >
      <div className="responsive-image-wrapper" style={widthStyles}>
        <style jsx>{`
          .responsive-image-wrapper {
            width: ${mergedData.width?.mobile || "100%"};
            max-width: min(${enforcedMaxWidth}, 100%);
          }

          @media (min-width: ${mergedData.responsive?.tabletBreakpoint ||
            "1024px"}) {
            .responsive-image-wrapper {
              width: ${mergedData.width?.tablet || "80%"};
              max-width: min(${enforcedMaxWidth}, 100%);
            }
          }

          @media (min-width: ${mergedData.responsive?.desktopBreakpoint ||
            "1280px"}) {
            .responsive-image-wrapper {
              width: ${mergedData.width?.desktop || "70%"};
              max-width: min(${enforcedMaxWidth}, 100%);
            }
          }
        `}</style>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={mergedData.image.alt || "صورة متجاوبة"}
            width={1200}
            height={600}
            style={imageStyles}
            className="responsive-image"
            priority={false}
          />
        ) : (
          <div
            className="responsive-image-placeholder"
            style={{
              ...imageStyles,
              width: "100%",
              height: "400px",
              backgroundColor: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
            }}
          >
            <span>لا توجد صورة</span>
          </div>
        )}
      </div>
    </div>
  );
}
