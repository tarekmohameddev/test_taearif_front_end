"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultImageTextData } from "@/context/editorStoreFunctions/imageTextFunctions";
import { useClientT } from "@/context/clientI18nStore";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface ImageTextProps {
  // Component-specific props
  visible?: boolean;
  ThemeTwo?: string;
  backgroundImage?: string;
  title?: string;
  paragraph?: string;
  blockquote?: string;
  overlayOpacity?: number;

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function ImageText1(props: ImageTextProps = {}) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "imageText1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const imageTextStates = useEditorStore((s) => s.imageTextStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Translation hook
  const t = useClientT();

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
          component.type === "imageText" &&
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
              (component as any).type === "imageText" &&
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
              ...getDefaultImageTextData(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultImageTextData(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("imageText", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = props.useStore ? imageTextStates[uniqueId] || {} : {};
  const currentStoreData = props.useStore
    ? getComponentData("imageText", uniqueId) || {}
    : {};

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultImageTextData(), // 1. Defaults (lowest priority)
    ...props, // 2. Props
    ...tenantComponentData, // 3. Database data
    ...storeData, // 4. Store state
    ...currentStoreData, // 5. Current store data (highest priority)
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
    <section className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={
            mergedData.backgroundImage ||
            "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80"
          }
          alt={t("components.imageText.alt_text")}
          fill
          className="object-cover brightness-50"
          priority
          sizes="100vw"
        />
        {/* Dark Overlay for better text readability */}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: mergedData.overlayOpacity || 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center text-white space-y-6 md:space-y-8">
          {/* Main Title */}
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            {mergedData.title}
          </h3>

          {/* First Paragraph */}
          <div className="text-base md:text-lg lg:text-xl leading-relaxed text-white/95">
            <p className="whitespace-pre-line">{mergedData.paragraph}</p>
          </div>

          {/* Blockquote */}
          <blockquote className="border-r-0 border-l-0 border-t-0 border-b-0 pt-6 md:pt-8">
            <p className="text-base md:text-lg lg:text-xl leading-relaxed text-white/95 italic">
              {mergedData.blockquote}
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
