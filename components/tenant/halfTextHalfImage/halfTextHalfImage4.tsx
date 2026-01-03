"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultHalfTextHalfImage4Data } from "@/context/editorStoreFunctions/halfTextHalfImageFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface HalfTextHalfImage4Props {
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
export default function HalfTextHalfImage4(props: HalfTextHalfImage4Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "halfTextHalfImage4";
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
  const router = useRouter();

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
              ...getDefaultHalfTextHalfImage4Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultHalfTextHalfImage4Data(),
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
    ...getDefaultHalfTextHalfImage4Data(), // 1. Defaults (lowest priority)
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
