"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultMapSectionData } from "@/context/editorStoreFunctions/mapSectionFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface MapSectionProps {
  // Component-specific props
  visible?: boolean;
  ThemeTwo?: string; // Added but never used
  title?: string;
  mapUrl?: string;
  styling?: {
    ThemeTwo?: string; // Added but never used
    titleColor?: string;
    titleSize?: {
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
    mapHeight?: string;
  };
  spacing?: {
    ThemeTwo?: string; // Added but never used
    paddingTop?: {
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
    paddingBottom?: {
      mobile?: string;
      tablet?: string;
      desktop?: string;
    };
  };

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function MapSection1(props: MapSectionProps) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "mapSection1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const mapSectionStates = useEditorStore((s) => s.mapSectionStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  // Get tenant data FIRST
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
          component.type === "mapSection" &&
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
              (component as any).type === "mapSection" &&
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
              ...getDefaultMapSectionData(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultMapSectionData(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("mapSection", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]); // ✅ Add tenantComponentData dependency

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = mapSectionStates[uniqueId];
  const currentStoreData = getComponentData("mapSection", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultMapSectionData(), // 1. Defaults (lowest priority)
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
  return (
    <section
      className="w-full"
      style={{
        paddingTop: mergedData.spacing?.paddingTop?.desktop || "4rem",
      }}
    >
      {/* Title */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-8 md:mb-12">
        <h3
          className={`${mergedData.styling?.titleSize?.mobile || "text-xl"} ${mergedData.styling?.titleSize?.tablet || "md:text-2xl"} ${mergedData.styling?.titleSize?.desktop || "lg:text-2xl"} font-bold text-center`}
          style={{
            color: mergedData.styling?.titleColor || "#8b5f46",
          }}
        >
          {mergedData.title}
        </h3>
      </div>

      {/* Google Map - Full Width */}
      <div
        className="w-full"
        style={{
          height: mergedData.styling?.mapHeight || "400px",
        }}
      >
        <iframe
          src={mergedData.mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </section>
  );
}
