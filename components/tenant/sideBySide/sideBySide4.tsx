"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultSideBySide4Data } from "@/context/editorStoreFunctions/sideBySideFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface SideBySide4Props {
  visible?: boolean;
  ThemeTwo?: string;
  layout?: {
    ThemeTwo?: string;
    direction?: "rtl" | "ltr";
    minHeight?: string;
  };
  spacing?: {
    ThemeTwo?: string;
    padding?: {
      ThemeTwo?: string;
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
  };
  content?: {
    ThemeTwo?: string;
    title?: string;
    paragraphs?: Array<{
      ThemeTwo?: string;
      text?: string;
    }>;
    button?: {
      ThemeTwo?: string;
      text?: string;
      url?: string;
      enabled?: boolean;
    };
  };
  styling?: {
    ThemeTwo?: string;
    textBackground?: {
      ThemeTwo?: string;
      color?: string;
    };
    divider?: {
      ThemeTwo?: string;
      color?: string;
      width?: string;
      height?: string;
    };
    button?: {
      ThemeTwo?: string;
      backgroundColor?: string;
      hoverBackgroundColor?: string;
      textColor?: string;
      borderRadius?: string;
    };
    textColors?: {
      ThemeTwo?: string;
      title?: string;
      paragraph?: string;
    };
  };
  image?: {
    ThemeTwo?: string;
    visible?: boolean;
    src?: string;
    alt?: string;
  };
  responsive?: {
    ThemeTwo?: string;
    mobile?: {
      ThemeTwo?: string;
      textOrder?: number;
      imageOrder?: number;
      textWidth?: string;
      imageWidth?: string;
      imageHeight?: string;
    };
    desktop?: {
      ThemeTwo?: string;
      textOrder?: number;
      imageOrder?: number;
      textWidth?: string;
      imageWidth?: string;
      imageHeight?: string;
    };
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function SideBySide4(props: SideBySide4Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "sideBySide4";
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
  const router = useRouter();

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
              ...getDefaultSideBySide4Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultSideBySide4Data(),
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
    props,
  ]);

  // ─────────────────────────────────────────────────────────
  // 6. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  // Get default data
  const defaultData = getDefaultSideBySide4Data();

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
    console.group("🔍 SideBySide4 Data Sources");
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
  const textBackgroundColor =
    mergedData.styling?.textBackground?.color || "#e4bfa1";
  const dividerColor = mergedData.styling?.divider?.color || "#8b5f46";
  const dividerWidth = mergedData.styling?.divider?.width || "96px";
  const dividerHeight = mergedData.styling?.divider?.height || "2px";
  const buttonBgColor =
    mergedData.styling?.button?.backgroundColor || "#8b5f46";
  const buttonHoverBgColor =
    mergedData.styling?.button?.hoverBackgroundColor || "#6b4630";
  const buttonTextColor = mergedData.styling?.button?.textColor || "#ffffff";
  const buttonBorderRadius = mergedData.styling?.button?.borderRadius || "8px";
  const titleColor = mergedData.styling?.textColors?.title || "#1f2937";
  const paragraphColor = mergedData.styling?.textColors?.paragraph || "#374151";

  const mobileTextOrder = mergedData.responsive?.mobile?.textOrder || 2;
  const mobileImageOrder = mergedData.responsive?.mobile?.imageOrder || 1;
  const mobileTextWidth = mergedData.responsive?.mobile?.textWidth || "w-full";
  const mobileImageWidth =
    mergedData.responsive?.mobile?.imageWidth || "w-full";
  const mobileImageHeight =
    mergedData.responsive?.mobile?.imageHeight || "h-[200px]";

  const desktopTextOrder = mergedData.responsive?.desktop?.textOrder || 1;
  const desktopImageOrder = mergedData.responsive?.desktop?.imageOrder || 2;
  const desktopTextWidth =
    mergedData.responsive?.desktop?.textWidth || "md:w-[60%]";
  const desktopImageWidth =
    mergedData.responsive?.desktop?.imageWidth || "md:w-[40%]";
  const desktopImageHeight =
    mergedData.responsive?.desktop?.imageHeight || "md:h-auto";

  const minHeight = mergedData.layout?.minHeight || "350px";
  const direction = mergedData.layout?.direction || "rtl";

  return (
    <section
      className="relative w-full flex flex-col-reverse md:flex-row"
      style={{ minHeight }}
      dir={direction}
    >
      {/* Left Side - Text Content */}
      <div
        className={`${mobileTextWidth} ${desktopTextWidth} flex flex-col justify-center items-start px-6 md:px-12 py-4 md:py-6 text-right`}
        style={{ backgroundColor: textBackgroundColor }}
      >
        <div className="w-full">
          {/* Heading */}
          <h3
            className="text-xl md:text-2xl lg:text-3xl font-bold mb-3"
            style={{ color: titleColor }}
          >
            {mergedData.content?.title || "ابنِ طريقك... ولا تنتظر أن تُمنح"}
          </h3>

          {/* Divider */}
          <div
            className="mb-4"
            style={{
              width: dividerWidth,
              height: dividerHeight,
              backgroundColor: dividerColor,
            }}
          />

          {/* Paragraph Text */}
          <div
            className="text-sm md:text-base leading-relaxed mb-4 space-y-2"
            style={{ color: paragraphColor }}
          >
            {mergedData.content?.paragraphs?.map((paragraph, index) => (
              <p key={index}>{paragraph.text}</p>
            )) || (
              <>
                <p>
                  لا أحد يعرف ثمن النعيم الذي تريد الوصول إليه غيرك. ليس في
                  الوعود ولا في التمنّي، بل في خطواتك، في عزمك، في سكونك حين
                  يتخلّى عنك كل شيء إلا إيمانك بما تستحق.
                </p>
                <p>
                  لا أحد سيأتي ليكملك. كل ما تبحث عنه، يبدأ حين تتوقف عن تقليد
                  من سبقوك، وتبدأ في كتابة فصلك الأول بيدك، بصوتك، بخوفك حتى.
                </p>
                <p>
                  اختر أن تنهض، لا لأنك مجبر، بل لأنك تستحق أن ترى ما خلف
                  الجدار.
                </p>
              </>
            )}
          </div>

          {/* Button */}
          {mergedData.content?.button?.enabled !== false && (
            <Link
              href={mergedData.content?.button?.url || "/projects"}
              className="inline-block text-white font-medium px-6 py-2 rounded-lg transition-colors duration-300 text-base"
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
                borderRadius: buttonBorderRadius,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = buttonHoverBgColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = buttonBgColor;
              }}
            >
              {mergedData.content?.button?.text || "اكتشف عقارك الآن"}
            </Link>
          )}
        </div>
      </div>

      {/* Right Side - Image (Cityscape) */}
      {mergedData.image?.visible !== false && (
        <div
          className={`relative ${mobileImageWidth} ${desktopImageWidth} ${mobileImageHeight} ${desktopImageHeight}`}
        >
          <Image
            src={
              mergedData.image?.src ||
              "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2000"
            }
            alt={mergedData.image?.alt || "منظر المدينة"}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      )}
    </section>
  );
}
