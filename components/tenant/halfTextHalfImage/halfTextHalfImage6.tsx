"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultHalfTextHalfImage6Data } from "@/context/editorStoreFunctions/halfTextHalfImageFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface HalfTextHalfImage6Props {
  visible?: boolean;
  ThemeTwo?: string;
  layout?: {
    ThemeTwo?: string;
    maxWidth?: string;
  };
  spacing?: {
    ThemeTwo?: string;
    padding?: {
      ThemeTwo?: string;
      top?: string;
      bottom?: string;
    };
  };
  content?: {
    ThemeTwo?: string;
    title?: string;
    titleUnderlined?: string;
    paragraph?: string;
  };
  image?: {
    ThemeTwo?: string;
    src?: string;
    alt?: string;
    visible?: boolean;
  };
  styling?: {
    ThemeTwo?: string;
    backgroundColor?: string;
    titleColor?: string;
    paragraphColor?: string;
    dividerColor?: string;
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function HalfTextHalfImage6(props: HalfTextHalfImage6Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "halfTextHalfImage6";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const halfTextHalfImageStates = useEditorStore(
    (s) => s.halfTextHalfImageStates,
  );

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

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "halfTextHalfImage" &&
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
              (component as any).type === "halfTextHalfImage" &&
              (component as any).componentName === variantId &&
              componentId === props.id
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  };

  useEffect(() => {
    if (props.useStore) {
      // Get tenant component data inside useEffect to avoid infinite loops
      const tenantComponentData = getTenantComponentData();

      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultHalfTextHalfImage6Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultHalfTextHalfImage6Data(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("halfTextHalfImage", uniqueId, initialData);
    }
  }, [
    uniqueId,
    props.useStore,
    ensureComponentVariant,
    variantId,
    props.id,
    tenantData,
  ]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = halfTextHalfImageStates[uniqueId];
  const currentStoreData = getComponentData("halfTextHalfImage", uniqueId);
  const tenantComponentData = getTenantComponentData();

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultHalfTextHalfImage6Data(), // 1. Defaults (lowest priority)
    ...tenantComponentData, // 2. Tenant data from database
    ...storeData, // 3. Store state
    ...currentStoreData, // 4. Current store data
    ...props, // 5. Props (highest priority)
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
      className="w-full flex items-center justify-center"
      style={{
        backgroundColor: mergedData.styling?.backgroundColor || "#f5f0e8",
        paddingTop: mergedData.spacing?.padding?.top || "5rem",
        paddingBottom: mergedData.spacing?.padding?.bottom || "3rem",
      }}
    >
      <div
        className="w-full mx-auto px-4 md:px-6 lg:px-8"
        style={{
          maxWidth: mergedData.layout?.maxWidth || "1280px",
        }}
      >
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Image (40% من العرض) */}
            {(mergedData.image?.visible ?? true) && (
              <div className="relative w-full md:w-[40%] h-[300px] md:h-[500px] order-1 md:order-2 rounded-2xl overflow-hidden">
                <Image
                  src={
                    mergedData.image?.src ||
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000"
                  }
                  alt={mergedData.image?.alt || "صورة"}
                  fill
                  className="object-cover rounded-2xl"
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            )}

            {/* Right Side - Text Content (60% من العرض) */}
            <div className="w-full md:w-[60%] bg-[#f5f0e8] flex flex-col justify-center px-6 md:px-8 lg:px-10 py-8 md:py-12 text-right order-2 md:order-1">
              {/* Heading */}
              <h3
                className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight"
                style={{
                  color: mergedData.styling?.titleColor || "#000000",
                }}
              >
                <span className="">
                  {mergedData.content?.titleUnderlined || "خبراء في"}
                </span>
                {mergedData.content?.title?.replace(
                  mergedData.content?.titleUnderlined || "",
                  "",
                )}
              </h3>
              <div
                className="w-24 h-[2px] mb-4 ml-auto"
                style={{
                  backgroundColor:
                    mergedData.styling?.dividerColor || "#8b5f46",
                }}
              ></div>

              {/* Paragraph Text */}
              <p
                className="text-sm md:text-base lg:text-lg leading-relaxed"
                style={{
                  color: mergedData.styling?.paragraphColor || "#000000",
                }}
              >
                {mergedData.content?.paragraph ||
                  "نقدّم لك خدمات احترافية في سوق العقارات، بفريق يتمتع بالخبرة والموثوقية، لنساعدك على اتخاذ القرار السليم."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
