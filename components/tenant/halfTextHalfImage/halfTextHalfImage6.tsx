"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultHalfTextHalfImage6Data } from "@/context/editorStoreFunctions/halfTextHalfImageFunctions";
import { toDimension } from "@/lib/utils";

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
  console.log("🚀🚀🚀 HalfTextHalfImage6 RENDER START 🚀🚀🚀");
  console.log("📥 PROPS RECEIVED:", {
    props,
    propsKeys: Object.keys(props),
    propsVariant: props.variant,
    propsId: props.id,
    propsUseStore: props.useStore,
    propsData: props,
  });

  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "halfTextHalfImage6";
  const uniqueId = props.id || variantId;
  
  console.log("🆔 ID EXTRACTION:", {
    variantId,
    uniqueId,
    propsVariant: props.variant,
    propsId: props.id,
    finalVariantId: variantId,
    finalUniqueId: uniqueId,
  });

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
  const tenantId = useTenantStore((s) => s.tenantId);
  
  console.log("🏪 STORE DATA:", {
    tenantId,
    tenantDataExists: !!tenantData,
    tenantDataKeys: tenantData ? Object.keys(tenantData) : [],
    componentSettingsExists: !!tenantData?.componentSettings,
    componentSettingsKeys: tenantData?.componentSettings ? Object.keys(tenantData.componentSettings) : [],
    halfTextHalfImageStatesKeys: Object.keys(halfTextHalfImageStates || {}),
  });

  const storeData = props.useStore
    ? halfTextHalfImageStates[uniqueId] || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("halfTextHalfImage", uniqueId) || {}
    : {};
  
  console.log("💾 STORE DATA RETRIEVAL:", {
    useStore: props.useStore,
    uniqueId,
    storeData,
    storeDataKeys: Object.keys(storeData),
    currentStoreData,
    currentStoreDataKeys: Object.keys(currentStoreData),
    currentStoreDataContent: currentStoreData?.content,
    currentStoreDataTitle: currentStoreData?.content?.title,
    allStatesKeys: Object.keys(halfTextHalfImageStates || {}),
  });

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    console.log("🔍🔍🔍 getTenantComponentData CALLED 🔍🔍🔍");
    console.log("🔍 SEARCH PARAMETERS:", {
      propsId: props.id,
      uniqueId,
      variantId,
      tenantDataExists: !!tenantData,
      componentSettingsExists: !!tenantData?.componentSettings,
    });
    
    if (!tenantData?.componentSettings) {
      console.log("❌ NO componentSettings in tenantData");
      return {};
    }
    
    console.log("📋 componentSettings STRUCTURE:", {
      componentSettingsType: typeof tenantData.componentSettings,
      isArray: Array.isArray(tenantData.componentSettings),
      componentSettingsKeys: Object.keys(tenantData.componentSettings),
      componentSettingsLength: Array.isArray(tenantData.componentSettings) 
        ? tenantData.componentSettings.length 
        : Object.keys(tenantData.componentSettings).length,
    });
    
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      console.log(`📄 SEARCHING PAGE: ${pageSlug}`, {
        pageSlug,
        pageComponentsType: typeof pageComponents,
        pageComponentsIsArray: Array.isArray(pageComponents),
        pageComponentsLength: Array.isArray(pageComponents) 
          ? pageComponents.length 
          : pageComponents && typeof pageComponents === "object"
          ? Object.keys(pageComponents).length
          : 0,
      });
      
      // Check if pageComponents is an object (not array)
      if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        console.log(`📦 PAGE ${pageSlug} IS OBJECT FORMAT`);
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          console.log(`  🔎 CHECKING COMPONENT: ${componentId}`, {
            componentId,
            componentType: (component as any)?.type,
            componentIdProp: (component as any)?.id,
            componentName: (component as any)?.componentName,
            propsId: props.id,
            uniqueId,
            matchesType: (component as any)?.type === "halfTextHalfImage",
            matchesId1: componentId === props.id,
            matchesId2: (component as any)?.id === props.id,
            matchesId3: (component as any)?.id === uniqueId,
            componentData: (component as any)?.data,
            componentDataContent: (component as any)?.data?.content,
            componentDataTitle: (component as any)?.data?.content?.title,
          });
          
          // Check if this is the exact component we're looking for by ID
          // Use componentId === props.id (most reliable identifier)
          if (
            (component as any).type === "halfTextHalfImage" &&
            (componentId === props.id ||
              (component as any).id === props.id ||
              (component as any).id === uniqueId)
          ) {
            console.log(`✅✅✅ FOUND MATCH IN OBJECT FORMAT: ${componentId} ✅✅✅`, {
              componentId,
              component,
              componentData: (component as any).data,
              componentDataContent: (component as any).data?.content,
              componentDataTitle: (component as any).data?.content?.title,
              componentDataParagraph: (component as any).data?.content?.paragraph,
            });
            return (component as any).data;
          }
        }
      }
      // Also handle array format
      if (Array.isArray(pageComponents)) {
        console.log(`📋 PAGE ${pageSlug} IS ARRAY FORMAT`, {
          arrayLength: pageComponents.length,
        });
        for (const component of pageComponents) {
          console.log(`  🔎 CHECKING ARRAY COMPONENT:`, {
            componentId: (component as any)?.id,
            componentType: (component as any)?.type,
            componentName: (component as any)?.componentName,
            propsId: props.id,
            uniqueId,
            matchesType: (component as any)?.type === "halfTextHalfImage",
            matchesId1: (component as any)?.id === props.id,
            matchesId2: (component as any)?.id === uniqueId,
            componentData: (component as any)?.data,
            componentDataContent: (component as any)?.data?.content,
            componentDataTitle: (component as any)?.data?.content?.title,
          });
          
          // Search by id (most reliable identifier)
          if (
            (component as any).type === "halfTextHalfImage" &&
            ((component as any).id === props.id ||
              (component as any).id === uniqueId)
          ) {
            console.log(`✅✅✅ FOUND MATCH IN ARRAY FORMAT ✅✅✅`, {
              componentId: (component as any)?.id,
              component,
              componentData: (component as any).data,
              componentDataContent: (component as any).data?.content,
              componentDataTitle: (component as any).data?.content?.title,
              componentDataParagraph: (component as any).data?.content?.paragraph,
            });
            return (component as any).data;
          }
        }
      }
    }
    
    console.log("❌❌❌ NO MATCH FOUND IN getTenantComponentData ❌❌❌");
    return {};
  };

  const tenantComponentData = getTenantComponentData();
  
  console.log("📊 TENANT COMPONENT DATA RESULT:", {
    tenantComponentData,
    tenantComponentDataKeys: Object.keys(tenantComponentData || {}),
    tenantComponentDataExists: !!tenantComponentData && Object.keys(tenantComponentData).length > 0,
    tenantComponentDataContent: tenantComponentData?.content,
    tenantComponentDataTitle: tenantComponentData?.content?.title,
    tenantComponentDataParagraph: tenantComponentData?.content?.paragraph,
    tenantComponentDataTitleUnderlined: tenantComponentData?.content?.titleUnderlined,
  });

  // ─────────────────────────────────────────────────────────
  // 5. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    console.log("🔄 useEffect INITIALIZE IN STORE TRIGGERED", {
      useStore: props.useStore,
      uniqueId,
      tenantComponentDataExists: !!tenantComponentData && Object.keys(tenantComponentData).length > 0,
    });
    
    if (props.useStore) {
      const defaultData = getDefaultHalfTextHalfImage6Data();
      console.log("📦 DEFAULT DATA:", {
        defaultData,
        defaultDataContent: defaultData?.content,
        defaultDataTitle: defaultData?.content?.title,
      });
      
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

      console.log("💾 INITIAL DATA FOR STORE:", {
        initialData,
        initialDataContent: initialData?.content,
        initialDataTitle: initialData?.content?.title,
        initialDataParagraph: initialData?.content?.paragraph,
        initialDataTitleUnderlined: initialData?.content?.titleUnderlined,
        hasTenantData: tenantComponentData && Object.keys(tenantComponentData).length > 0,
      });

      // Initialize in store
      ensureComponentVariant("halfTextHalfImage", uniqueId, initialData);
      console.log("✅ STORE INITIALIZED with uniqueId:", uniqueId);
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
  
  console.log("📊 DEFAULT DATA:", {
    defaultData,
    defaultDataContent: defaultData?.content,
    defaultDataTitle: defaultData?.content?.title,
    defaultDataParagraph: defaultData?.content?.paragraph,
    defaultDataTitleUnderlined: defaultData?.content?.titleUnderlined,
  });

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;
  
  console.log("🔍 TENANT DATA CHECK:", {
    hasTenantData,
    tenantComponentData,
    tenantComponentDataKeys: Object.keys(tenantComponentData || {}),
    tenantComponentDataContent: tenantComponentData?.content,
    tenantComponentDataTitle: tenantComponentData?.content?.title,
  });

  // Check if currentStoreData is just default data (by comparing a key field like content.title)
  const isStoreDataDefault =
    currentStoreData?.content?.title === defaultData?.content?.title;
  
  console.log("🔍 STORE DATA CHECK:", {
    currentStoreData,
    currentStoreDataContent: currentStoreData?.content,
    currentStoreDataTitle: currentStoreData?.content?.title,
    defaultDataTitle: defaultData?.content?.title,
    isStoreDataDefault,
    comparison: `${currentStoreData?.content?.title} === ${defaultData?.content?.title}`,
  });

  // Merge data with correct priority
  const mergedData = {
    ...defaultData, // 1. Defaults (lowest priority)
    ...props, // 2. Props from parent component
    // If tenantComponentData exists, use it (it's from Database)
    ...(hasTenantData ? tenantComponentData : {}), // 3. Backend data (tenant data)
    // Skip store data if tenant data exists (tenant data is source of truth)
    // Only use store data if no tenant data exists
    ...(hasTenantData
      ? {} // Skip store data if tenant data exists
      : currentStoreData), // 4. Current store data (only if no tenant data)
  };
  
  console.log("🔀 MERGED DATA RESULT:", {
    mergedData,
    mergedDataContent: mergedData?.content,
    mergedDataTitle: mergedData?.content?.title,
    mergedDataParagraph: mergedData?.content?.paragraph,
    mergedDataTitleUnderlined: mergedData?.content?.titleUnderlined,
    mergeSteps: {
      step1_defaultData: defaultData?.content?.title,
      step2_props: props?.content?.title,
      step3_tenantData: hasTenantData ? tenantComponentData?.content?.title : "SKIPPED",
      step4_storeData: hasTenantData && isStoreDataDefault ? "SKIPPED (is default)" : currentStoreData?.content?.title,
      final: mergedData?.content?.title,
    },
  });

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
  console.log("👁️ VISIBILITY CHECK:", {
    visible: mergedData.visible,
    willRender: !!mergedData.visible,
  });
  
  if (!mergedData.visible) {
    console.log("❌ COMPONENT NOT VISIBLE - RETURNING NULL");
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 8. RENDER
  // ─────────────────────────────────────────────────────────
  console.log("🎨 RENDERING COMPONENT:", {
    mergedDataContent: mergedData?.content,
    mergedDataTitle: mergedData?.content?.title,
    mergedDataTitleUnderlined: mergedData?.content?.titleUnderlined,
    mergedDataParagraph: mergedData?.content?.paragraph,
    finalTitleDisplay: `${mergedData.content?.titleUnderlined || "خبراء في"}${mergedData.content?.title?.replace(mergedData.content?.titleUnderlined || "", "") || ""}`,
    finalParagraphDisplay: mergedData.content?.paragraph || "نقدّم لك خدمات احترافية...",
  });
  
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
          maxWidth: toDimension(mergedData.layout?.maxWidth, "px", "1280px"),
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
                  {(() => {
                    const titleUnderlined = mergedData.content?.titleUnderlined || "خبراء في";
                    console.log("📝 RENDERING TITLE UNDERLINED:", titleUnderlined);
                    return titleUnderlined;
                  })()}
                </span>
                {(() => {
                  const title = mergedData.content?.title?.replace(
                    mergedData.content?.titleUnderlined || "",
                    "",
                  ) || "";
                  console.log("📝 RENDERING TITLE:", {
                    originalTitle: mergedData.content?.title,
                    titleUnderlined: mergedData.content?.titleUnderlined,
                    replacedTitle: title,
                  });
                  return title;
                })()}
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
                {(() => {
                  const paragraph = mergedData.content?.paragraph ||
                    "نقدّم لك خدمات احترافية في سوق العقارات، بفريق يتمتع بالخبرة والموثوقية، لنساعدك على اتخاذ القرار السليم.";
                  console.log("📝 RENDERING PARAGRAPH:", {
                    paragraphFromData: mergedData.content?.paragraph,
                    finalParagraph: paragraph,
                  });
                  return paragraph;
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
  console.log("🏁🏁🏁 HalfTextHalfImage6 RENDER END 🏁🏁🏁");
}
