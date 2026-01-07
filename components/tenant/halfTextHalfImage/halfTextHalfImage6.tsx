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
  // 3. FETCH TENANT DATA
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = props.useStore
    ? halfTextHalfImageStates[uniqueId] || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("halfTextHalfImage", uniqueId) || {}
    : {};

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
          // Use componentId === props.id (most reliable identifier)
          if (
            (component as any).type === "halfTextHalfImage" &&
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
            (component as any).type === "halfTextHalfImage" &&
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

  // ─────────────────────────────────────────────────────────
  // 5. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (props.useStore) {
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
    tenantComponentData,
    props,
  ]);

  // ─────────────────────────────────────────────────────────
  // 6. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  // Get default data
  const defaultData = getDefaultHalfTextHalfImage6Data();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data (by comparing a key field like content.title)
  const isStoreDataDefault =
    currentStoreData?.content?.title === defaultData?.content?.title;

  // Merge data with correct priority
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

  // ⭐ DEBUG: Log data sources (optional - remove in production)
  if (
    props.useStore &&
    typeof window !== "undefined" &&
    (window as any).__DEBUG_COMPONENT_DATA__
  ) {
    console.group("🔍 HalfTextHalfImage6 Data Sources");
    console.log("1️⃣ Default Data:", defaultData);
    console.log("2️⃣ Props:", props);
    console.log("3️⃣ Tenant Component Data:", tenantComponentData);
    console.log("4️⃣ Current Store Data:", currentStoreData);
    console.log("🔍 Is Store Data Default?", isStoreDataDefault);
    console.log("🔍 Has Tenant Data?", hasTenantData);
    console.log("🔀 Merged Data:", mergedData);
    console.log("Final Title:", mergedData.content?.title);
    console.groupEnd();
  }

  // ─────────────────────────────────────────────────────────
  // 7. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 8. RENDER
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
