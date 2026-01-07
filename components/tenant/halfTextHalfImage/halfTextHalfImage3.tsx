"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import {
  logComponentRender,
  logTenantStore,
} from "@/lib/debugLogger";
import { getDefaultHalfTextHalfImage3Data } from "@/context/editorStoreFunctions/halfTextHalfImageFunctions";

interface VisionSectionProps {
  visible?: boolean;
  layout?: {
    direction?: "rtl" | "ltr";
    maxWidth?: string;
    gap?: {
      x?: string;
      y?: string;
    };
    minHeight?: string;
  };
  spacing?: {
    padding?: {
      x?: string;
      y?: string;
      lgY?: string;
    };
  };
  content?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    imagePosition?: "left" | "right";
    button?: {
      text?: string;
      enabled?: boolean;
      style?: {
        width?: string;
        height?: string;
        backgroundColor?: string;
        textColor?: string;
        borderRadius?: string;
        hoverBackgroundColor?: string;
        hoverTextColor?: string;
      };
    };
    font?: {
      eyebrow?: {
        size?: string;
        weight?: string;
        color?: string;
        lineHeight?: string;
      };
      title?: {
        size?: string;
        weight?: string;
        color?: string;
        lineHeight?: string;
      };
      description?: {
        size?: string;
        weight?: string;
        color?: string;
        lineHeight?: string;
      };
      button?: {
        size?: string;
        weight?: string;
        color?: string;
        lineHeight?: string;
      };
    };
  };
  image?: {
    visible?: boolean;
    src?: string;
    alt?: string;
    width?: string;
    aspectRatio?: string;
    background?: {
      enabled?: boolean;
      color?: string;
      width?: string;
      borderRadius?: string;
      position?: string;
    };
  };
  animations?: {
    text?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    image?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    button?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
  };
  // Legacy props for backward compatibility
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function VisionSection(props: VisionSectionProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "halfTextHalfImage3";

  // Force useStore to true if not explicitly set to false
  const useStore = props.useStore !== false;

  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  // Get tenant data
  const tenantData = useTenantStore((s: any) => s.tenantData);
  const fetchTenantData = useTenantStore((s: any) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);
  const router = useRouter();

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get data from store or tenantData with fallback logic
  const uniqueId = props.id || variantId;
  const storeData = useStore
    ? getComponentData("halfTextHalfImage", uniqueId) || {}
    : {};

  // Subscribe to store updates to re-render when data changes
  const halfTextHalfImageStates = useEditorStore(
    (s) => s.halfTextHalfImageStates,
  );
  const currentStoreData = useStore
    ? halfTextHalfImageStates[uniqueId] || {}
    : {};

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      logTenantStore("NO_TENANT_DATA", uniqueId, variantId, {
        reason: "No tenantData.componentSettings found",
        tenantData: tenantData,
      });
      return {};
    }

    // Log tenant data search
    logTenantStore("SEARCHING_TENANT_DATA", uniqueId, variantId, {
      tenantDataKeys: Object.keys(tenantData.componentSettings),
      searchingFor: {
        type: "halfTextHalfImage",
        componentName: variantId,
        componentId: props.id,
        uniqueId: uniqueId,
      },
    });

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
            logTenantStore("FOUND_TENANT_DATA", uniqueId, variantId, {
              pageSlug,
              componentId,
              component: component,
              foundData: (component as any).data,
            });

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
            logTenantStore("FOUND_TENANT_DATA", uniqueId, variantId, {
              pageSlug,
              componentId: (component as any).id,
              component: component,
              foundData: (component as any).data,
            });

            return (component as any).data;
          }
        }
      }
    }

    logTenantStore("NO_TENANT_DATA_FOUND", uniqueId, variantId, {
      reason: "No matching component found in tenant data",
      searchedPages: Object.keys(tenantData.componentSettings),
    });

    return {};
  };

  const tenantComponentData = getTenantComponentData();

  useEffect(() => {
    if (useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultHalfTextHalfImage3Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultHalfTextHalfImage3Data(),
              ...props,
            };

      // Log component initialization
      logComponentRender(uniqueId, variantId, "halfTextHalfImage", {
        action: "INITIALIZE_COMPONENT",
        uniqueId,
        variantId,
        useStore,
        props: props,
        tenantComponentData: tenantComponentData,
        initialData: initialData,
        reason: "Component mounted or props changed",
      });

      // Initialize in store
      ensureComponentVariant("halfTextHalfImage", uniqueId, initialData);
    }
  }, [
    uniqueId,
    useStore,
    ensureComponentVariant,
    tenantComponentData,
    props,
    variantId,
  ]);

  // Get default data
  const defaultData = getDefaultHalfTextHalfImage3Data();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data (by comparing a key field like content.title)
  const isStoreDataDefault =
    currentStoreData?.content?.title === defaultData?.content?.title;

  // Log data analysis
  logComponentRender(uniqueId, variantId, "halfTextHalfImage", {
    action: "DATA_ANALYSIS",
    uniqueId,
    variantId,
    hasTenantData,
    isStoreDataDefault,
    currentStoreDataContent: currentStoreData.content,
    defaultDataContent: defaultData.content,
    tenantComponentDataContent: tenantComponentData.content,
    reason: hasTenantData && isStoreDataDefault
      ? "Detected default store data, will use tenant data"
      : "Using current store data",
  });

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
    // Force override content with correct priority
    content: {
      ...defaultData.content,
      ...(props.content || {}),
      ...(hasTenantData ? tenantComponentData.content || {} : {}),
      ...(hasTenantData && isStoreDataDefault
        ? {}
        : currentStoreData.content || {}),
    },
  };

  // ⭐ DEBUG: Log data sources (optional - remove in production)
  if (
    useStore &&
    typeof window !== "undefined" &&
    (window as any).__DEBUG_COMPONENT_DATA__
  ) {
    console.group("🔍 HalfTextHalfImage3 Data Sources");
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

  // Log final data merge
  logComponentRender(uniqueId, variantId, "halfTextHalfImage", {
    action: "DATA_MERGE",
    uniqueId,
    variantId,
    propsKeys: Object.keys(props),
    tenantComponentDataKeys: Object.keys(tenantComponentData),
    currentStoreDataKeys: Object.keys(currentStoreData),
    mergedDataKeys: Object.keys(mergedData),
    mergedData: mergedData,
    dataSources: {
      defaultData: getDefaultHalfTextHalfImage3Data(),
      props: props,
      tenantComponentData: tenantComponentData,
      currentStoreData: currentStoreData,
    },
  });

  // Extract values from merged data with fallback to legacy props
  const {
    visible = true,
    layout = {},
    spacing = {},
    content = {},
    image = {},
    animations = {},
    // Legacy props fallback
    title: legacyTitle,
    description: legacyDescription,
    imageSrc: legacyImageSrc,
    imageAlt: legacyImageAlt,
    imagePosition: legacyImagePosition,
  } = mergedData;

  // Use new structure with fallback to legacy props
  const title = content.title || legacyTitle || "رسالتنا";
  const description =
    content.description ||
    legacyDescription ||
    "نحن في الشركة العقارية العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات";
  const imageSrc =
    image.src ||
    legacyImageSrc ||
    "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp";
  const imageAlt = image.alt || legacyImageAlt || "Choose Us";
  const imagePosition = content.imagePosition || legacyImagePosition || "left";

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

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669",
  ): string => {
    // Get styling data from mergedData
    const styling = mergedData?.styling || {};

    // Navigate to the field using the path (e.g., "typography.title.color")
    const pathParts = fieldPath.split(".");
    let fieldData = styling;
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
    let useDefaultColorValue = styling;
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
    let globalColorTypeValue = styling;
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
      if (fieldPath.includes("title") && fieldPath.includes("color")) {
        defaultGlobalColorType = "primary";
      } else if (
        fieldPath.includes("textColor") ||
        fieldPath.includes("Text")
      ) {
        defaultGlobalColorType = "secondary";
      } else if (
        fieldPath.includes("Button") ||
        fieldPath.includes("button") ||
        fieldPath.includes("hoverBgColor") ||
        fieldPath.includes("backgroundColor")
      ) {
        defaultGlobalColorType = "primary";
      } else if (
        fieldPath.includes("color") &&
        !fieldPath.includes("imageBackground")
      ) {
        defaultGlobalColorType = "secondary";
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
    if (fieldPath.includes("title") && fieldPath.includes("color")) {
      defaultGlobalColorType = "primary";
    } else if (fieldPath.includes("textColor") || fieldPath.includes("Text")) {
      defaultGlobalColorType = "secondary";
    } else if (
      fieldPath.includes("color") &&
      !fieldPath.includes("imageBackground")
    ) {
      defaultGlobalColorType = "secondary";
    }
    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

  // Get title color - use primary color as default if available, otherwise use custom color or CSS class
  const hasPrimaryColor =
    tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== "";
  const titleColor =
    content.font?.title?.color ||
    getColor("typography.title.color", brandingColors.primary) ||
    (hasPrimaryColor ? brandingColors.primary : undefined);

  if (!visible) return null;

  return (
    <div
      className={`${spacing.padding?.y || "py-[24px]"} ${spacing.padding?.lgY || "lg:py-[52px]"} max-w-[${layout.maxWidth || "1600px"}] mx-auto ${spacing.padding?.x || "px-4"} sm:px-0`}
      dir={layout.direction || "rtl"}
    >
      <div
        className={`flex flex-col ${layout.gap?.y || "gap-[12px]"} ${layout.gap?.x || "md:gap-x-[30px] lg:gap-x-[74px]"} ${imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"}`}
        style={{
          minHeight: layout.minHeight || undefined,
        }}
      >
        <div
          className="md:flex-[.6] xl:flex-[.72] flex flex-col justify-center order-2 md:order-1"
          dir="rtl"
        >
          {content.eyebrow && (
            <p
              className={`mb-2 ${content.font?.eyebrow?.size || "text-xs md:text-base xl:text-lg"} ${content.font?.eyebrow?.weight || "font-normal"} ${content.font?.eyebrow?.color || "text-muted-foreground"} ${content.font?.eyebrow?.lineHeight || "leading-[22.5px]"}`}
            >
              {content.eyebrow}
            </p>
          )}
          <h3
            className={`relative w-fit ${content.font?.title?.size || "section-title-large"} ${content.font?.title?.weight || "font-normal"} ${content.font?.title?.color || (titleColor ? "" : "text-foreground")} ${content.font?.title?.lineHeight || "lg:leading-[64px]"}`}
            style={titleColor ? { color: titleColor } : undefined}
          >
            {title}
          </h3>
          <p
            className={`mb-4 md:mb-10 md:flex-grow ${content.font?.description?.size || "text-sm md:text-sm xl:text-xl"} ${content.font?.description?.weight || "font-normal"} ${content.font?.description?.color || "text-muted-foreground"} ${content.font?.description?.lineHeight || "leading-[35px]"}`}
          >
            {description}
          </p>
          {content.button?.enabled && (
            <button
              className={`transition-colors duration-300 hover:text-emerald-600 hover:bg-white flex items-center justify-center ${content.button.style?.width || "w-[119px] md:w-[148px]"} ${content.button.style?.height || "h-[46px] md:h-[52px]"} ${content.button.style?.borderRadius || "rounded-[10px]"} ${content.font?.button?.size || "text-sm md:text-base xl:text-xl"} ${content.font?.button?.weight || "font-normal"}`}
              style={{
                backgroundColor:
                  content.button.style?.backgroundColor || "#059669",
                color:
                  content.button.style?.textColor ||
                  content.font?.button?.color ||
                  "#ffffff",
              }}
              onClick={() => {
                if (content.button?.url) {
                  router.push(content.button.url);
                }
              }}
            >
              {content.button.text || "تعرف علينا"}
            </button>
          )}
        </div>
        {(image.visible ?? true) && (
          <figure
            dir="rtl"
            className={`w-full sm:w-[50%] mx-auto order-1 md:order-2 mb-[12px] md:mb-[0] md:flex-[.4] xl:flex-[.28] relative md:w-full h-[207px] md:h-[246px] ${image.width || "w-full md:w-[47.2%]"}`}
          >
            {image.background?.enabled && (
              <div
                className={`absolute top-0 left-0 h-full overflow-hidden z-0 ${image.background.borderRadius || "rounded-[5px]"} ${image.background.width || "w-[54%] md:w-1/2"}`}
                style={{
                  backgroundColor: image.background.color || "#059669",
                }}
              />
            )}
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className={`w-full h-full object-cover ${image.background?.borderRadius || "rounded-[5px]"}`}
            />
            <div
              className={`absolute inset-0 bg-black opacity-20 ${image.background?.borderRadius || "rounded-[5px]"}`}
            ></div>
          </figure>
        )}
      </div>
    </div>
  );
}
