"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultSideBySide6Data } from "@/context/editorStoreFunctions/sideBySideFunctions";
import { toDimension } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface SideBySide6Props {
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
      top?: string | number;
      bottom?: string | number;
    };
    innerPadding?: {
      x?: { mobile?: number; tablet?: number; desktop?: number };
      y?: { mobile?: number; tablet?: number; desktop?: number };
    };
  };
  content?: {
    ThemeTwo?: string;
    title?: string;
    titleUnderlined?: string;
    paragraph?: string;
    textBlocks?: Array<{ text: string }>;
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
export default function SideBySide6(props: SideBySide6Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "sideBySide6";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const sideBySideStates = useEditorStore(
    (s) => s.sideBySideStates,
  );

  const tenantData = useTenantStore((s) => s.tenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // RETRIEVE DATA FROM STORE
  const storeData = props.useStore
    ? sideBySideStates[uniqueId] || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("sideBySide", uniqueId) || {}
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
            (component as any).type === "sideBySide" &&
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
            (component as any).type === "sideBySide" &&
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

  const tenantComponentData = useMemo(
    () => getTenantComponentData(),
    [tenantData, props.id, uniqueId]
  );

  // ─────────────────────────────────────────────────────────
  // 5. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultSideBySide6Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultSideBySide6Data(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("sideBySide", uniqueId, initialData);
    }
  }, [
    uniqueId,
    props.useStore,
    ensureComponentVariant,
    tenantComponentData,
  ]);

  // ─────────────────────────────────────────────────────────
  // 6. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  // Get default data
  const defaultData = getDefaultSideBySide6Data();

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
    console.group("🔍 SideBySide6 Data Sources");
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
  const toPx = (v: string | number | undefined, fallback: number) =>
    typeof v === "number" ? `${v}px` : typeof v === "string" && /^\d+$/.test(v) ? `${v}px` : v === undefined ? `${fallback}px` : undefined;
  const paddingTop = toPx(mergedData.spacing?.padding?.top, 80) ?? "5rem";
  const paddingBottom = toPx(mergedData.spacing?.padding?.bottom, 48) ?? "3rem";

  const inner = mergedData.spacing?.innerPadding;
  const ix = inner?.x;
  const iy = inner?.y;
  const innerXMobile = ix?.mobile ?? 24;
  const innerXTablet = ix?.tablet ?? 32;
  const innerXDesktop = ix?.desktop ?? 40;
  const innerYMobile = iy?.mobile ?? 32;
  const innerYTablet = iy?.tablet ?? 48;
  const innerYDesktop = iy?.desktop ?? 48;
  const sectionId = `sidebyside6-${uniqueId.replace(/[^a-zA-Z0-9]/g, "-")}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          #${sectionId} .sbs6-inner-content {
            padding-left: ${innerXMobile}px;
            padding-right: ${innerXMobile}px;
            padding-top: ${innerYMobile}px;
            padding-bottom: ${innerYMobile}px;
          }
          @media (min-width: 768px) {
            #${sectionId} .sbs6-inner-content {
              padding-left: ${innerXTablet}px;
              padding-right: ${innerXTablet}px;
              padding-top: ${innerYTablet}px;
              padding-bottom: ${innerYTablet}px;
            }
          }
          @media (min-width: 1024px) {
            #${sectionId} .sbs6-inner-content {
              padding-left: ${innerXDesktop}px;
              padding-right: ${innerXDesktop}px;
              padding-top: ${innerYDesktop}px;
              padding-bottom: ${innerYDesktop}px;
            }
          }
        `,
      }} />
      <section
        id={sectionId}
        className="w-full flex items-center justify-center"
        style={{
          backgroundColor: mergedData.styling?.backgroundColor || "#f5f0e8",
          paddingTop,
          paddingBottom,
        }}
      >
      <div
        className="w-full mx-auto px-4 md:px-6 lg:px-8"
        style={{
          maxWidth: toDimension(mergedData.layout?.maxWidth, "px", "1280px"),
        }}
      >
        <div className=" rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Image (40% من العرض) */}
            {(mergedData.image?.visible ?? true) && (
              <div 
                className="relative w-full md:w-[40%] h-[300px] md:h-[500px] order-1 md:order-2 rounded-2xl overflow-hidden bg-transparent"
                style={{ backgroundColor: 'transparent' }}
              >
                {mergedData.image?.src ? (
                  <Image
                    src={mergedData.image.src}
                    alt={mergedData.image?.alt || "صورة"}
                    fill
                    className="object-cover rounded-2xl"
                    priority
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                ) : null}
              </div>
            )}

            {/* Right Side - Text Content (60% من العرض) - الحشو الداخلي من spacing.innerPadding */}
            <div className="w-full md:w-[60%] flex flex-col justify-center sbs6-inner-content text-right order-2 md:order-1">
              {/* Heading */}
              <h3
                className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight"
                style={{
                  color: mergedData.styling?.titleColor || "#000000",
                }}
              >
                <span className="">
                  {mergedData.content?.title || "خبراء في خدمتك – نرافقك نحو استثمار آمن"}
                </span>
              </h3>
              <div
                className="w-24 h-[2px] mb-4 mr-auto"
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

              {/* Text Blocks */}
              {mergedData.content?.textBlocks &&
                mergedData.content.textBlocks.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {mergedData.content.textBlocks.map((block, index) => (
                      <p
                        key={index}
                        className="text-sm md:text-base lg:text-lg leading-relaxed"
                        style={{
                          color: mergedData.styling?.paragraphColor || "#000000",
                        }}
                      >
                        {block.text}
                      </p>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
