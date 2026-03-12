"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn, toDimension } from "@/lib/utils";
import useStore from "@/context/Store";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { getDefaultSideBySide2Data } from "@/context/editorStoreFunctions/sideBySideFunctions";

interface sideBySideProps {
  visible?: boolean;
  layout?: {
    direction?: string;
    maxWidth?: string;
    gridCols?: string;
    gap?: {
      x?: string;
      y?: string;
      yMd?: string;
    };
  };
  spacing?: {
    padding?: {
      x?: string;
      y?: string;
      smX?: string;
      smY?: string;
      lgX?: string;
    };
  };
  content?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    stats?:
      | {
          stat1?: { value: string; label: string };
          stat2?: { value: string; label: string };
          stat3?: { value: string; label: string };
          stat4?: { value: string; label: string };
        }
      | Array<{
          value: string;
          label: string;
        }>;
  };
  typography?: {
    eyebrow?: {
      className?: string;
      marginBottom?: string;
    };
    title?: {
      className?: string;
      textBalance?: string;
    };
    description?: {
      className?: string;
    };
    stats?: {
      valueClassName?: string;
      labelClassName?: string;
      labelMarginTop?: string;
    };
  };
  image?: {
    visible?: boolean;
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    style?: {
      className?: string;
      borderRadius?: string;
    };
    background?: {
      enabled?: boolean;
      color?: string;
      className?: string;
      positioning?: {
        pr?: string;
        pb?: string;
        xlPr?: string;
        xlPb?: string;
      };
    };
  };
  responsive?: {
    grid?: {
      textCols?: string;
      imageCols?: string;
      textOrder?: string;
      imageOrder?: string;
    };
    stats?: {
      gridCols?: string;
      gap?: string;
      marginTop?: string;
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
    stats?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
      stagger?: number;
    };
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

const sideBySide = (props: sideBySideProps = {}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "sideBySide2";
  // Subscribe to editor store updates for this side by side variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  const { user, loading } = useAuth();
  const tenantId = useTenantStore((s) => s.tenantId);
  const router = useRouter();
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const error = useTenantStore((s) => s.error);

  // Get data from store or tenantData with fallback logic
  const uniqueId = props.id || variantId;
  const storeData = props.useStore
    ? getComponentData("sideBySide", uniqueId) || {}
    : {};

  // Subscribe to store updates to re-render when data changes
  const sideBySideStates = useEditorStore(
    (s) => s.sideBySideStates,
  );
  const currentStoreData = props.useStore
    ? sideBySideStates[uniqueId] || {}
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

  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultSideBySide2Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultSideBySide2Data(),
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

  // Get default data
  const defaultData = getDefaultSideBySide2Data();

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
    console.group("🔍 SideBySide2 Data Sources");
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

    // Navigate to the field using the path (e.g., "imageBackground.color")
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
      // Image background should use primary color
      if (
        fieldPath.includes("imageBackground") ||
        fieldPath.includes("background")
      ) {
        defaultGlobalColorType = "primary";
      } else if (fieldPath.includes("eyebrow")) {
        defaultGlobalColorType = "primary";
      } else if (fieldPath.includes("stats") || fieldPath.includes("value")) {
        defaultGlobalColorType = "primary";
      } else if (
        fieldPath.includes("textColor") ||
        fieldPath.includes("Text")
      ) {
        defaultGlobalColorType = "secondary";
      } else if (
        fieldPath.includes("color") &&
        !fieldPath.includes("imageBackground") &&
        !fieldPath.includes("background")
      ) {
        // For other color fields (not imageBackground), default to secondary
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
    // Image background should use primary color
    if (
      fieldPath.includes("imageBackground") ||
      fieldPath.includes("background")
    ) {
      defaultGlobalColorType = "primary";
    } else if (fieldPath.includes("eyebrow")) {
      defaultGlobalColorType = "primary";
    } else if (fieldPath.includes("stats") || fieldPath.includes("value")) {
      defaultGlobalColorType = "primary";
    } else if (fieldPath.includes("textColor") || fieldPath.includes("Text")) {
      defaultGlobalColorType = "secondary";
    } else if (
      fieldPath.includes("color") &&
      !fieldPath.includes("imageBackground") &&
      !fieldPath.includes("background")
    ) {
      defaultGlobalColorType = "secondary";
    }
    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

  // Helper function to create darker color for hover states
  const getDarkerColor = (hex: string, amount: number = 20): string => {
    // emerald-700 in Tailwind = #047857 (fallback)
    if (!hex || !hex.startsWith("#")) return "#047857";
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return "#047857";

    const r = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(0, 2), 16) - amount),
    );
    const g = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(2, 2), 16) - amount),
    );
    const b = Math.max(
      0,
      Math.min(255, parseInt(cleanHex.substr(4, 2), 16) - amount),
    );

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  // Get colors for styling
  const imageBackgroundColor = getColor(
    "imageBackground.color",
    brandingColors.primary,
  );
  const eyebrowColor = getColor(
    "typography.eyebrow.color",
    brandingColors.primary,
  );
  const statsValueColor = getColor(
    "typography.stats.valueColor",
    brandingColors.primary,
  );

  // Generate dynamic styles
  const sectionStyles = {
    maxWidth: toDimension(mergedData.layout?.maxWidth, "px", "1600px"),
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  return (
    <section
      className={cn(
        "w-full bg-background",
        mergedData.spacing?.padding?.x || "px-4",
        mergedData.spacing?.padding?.y || "py-5",
        mergedData.spacing?.padding?.smX || "sm:px-6",
        mergedData.spacing?.padding?.smY || "sm:py-20",
        mergedData.spacing?.padding?.lgX || "lg:px-8",
      )}
      style={{
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          "transparent",
      }}
      data-debug="sideBySide2-component"
    >
      <div
        className={cn(
          "mx-auto grid grid-cols-1 items-center",
          mergedData.layout?.gridCols || "md:grid-cols-10",
          mergedData.layout?.gap?.x || "gap-x-10",
          mergedData.layout?.gap?.y || "gap-y-16",
          mergedData.layout?.gap?.yMd || "md:gap-y-10",
        )}
        style={{
          maxWidth: sectionStyles.maxWidth,
          gridTemplateColumns: mergedData.grid?.columns?.desktop
            ? `repeat(${mergedData.grid.columns.desktop}, 1fr)`
            : undefined,
          gap:
            mergedData.grid?.gapX || mergedData.grid?.gapY
              ? `${mergedData.grid.gapY || "40px"} ${mergedData.grid.gapX || "40px"}`
              : undefined,
        }}
        dir={mergedData.layout?.direction || "rtl"}
      >
        {/* النص */}
        <div
          className={cn(
            mergedData.responsive?.grid?.textCols || "md:col-span-5",
            mergedData.responsive?.grid?.textOrder || "order-2 md:order-2",
          )}
        >
          {mergedData.content?.eyebrow && (
            <p
              className={cn(
                mergedData.typography?.eyebrow?.className || "section-title",
                mergedData.typography?.eyebrow?.marginBottom || "mb-3",
              )}
              style={{ color: eyebrowColor }}
            >
              {mergedData.content.eyebrow}
            </p>
          )}

          <h2
            className={cn(
              mergedData.typography?.title?.className ||
                "section-title leading-[1.25] text-black",
              mergedData.typography?.title?.textBalance || "text-balance",
            )}
          >
            {mergedData.content?.title || "إيجاد عقار مناسب هو هدفنا"}
          </h2>

          {mergedData.content?.description && (
            <p
              className={
                mergedData.typography?.description?.className ||
                "section-subtitle-large max-w-3xl"
              }
            >
              {mergedData.content.description}
            </p>
          )}

          {(() => {
            // منطق fallback للتعامل مع البيانات القديمة والجديدة
            const stats = mergedData.content?.stats;
            if (!stats) return null;

            // إذا كانت البيانات بالبنية الجديدة (object)
            if (stats.stat1 || stats.stat2 || stats.stat3 || stats.stat4) {
              return (
                <ul
                  className={cn(
                    "grid text-center",
                    mergedData.responsive?.stats?.gridCols ||
                      "grid-cols-2 sm:grid-cols-4",
                    mergedData.responsive?.stats?.gap || "gap-4",
                    mergedData.responsive?.stats?.marginTop || "mt-10",
                  )}
                >
                  {stats.stat1 && (
                    <li>
                      <div
                        className={
                          mergedData.typography?.stats?.valueClassName
                            ?.replace(/text-emerald-\d+|text-green-\d+/g, "")
                            .trim() || "text-2xl"
                        }
                        style={{ color: statsValueColor }}
                      >
                        {stats.stat1.value}
                      </div>
                      <div
                        className={cn(
                          mergedData.typography?.stats?.labelClassName ||
                            "text-xl text-black",
                          mergedData.typography?.stats?.labelMarginTop ||
                            "mt-1",
                        )}
                      >
                        {stats.stat1.label}
                      </div>
                    </li>
                  )}
                  {stats.stat2 && (
                    <li>
                      <div
                        className={
                          mergedData.typography?.stats?.valueClassName
                            ?.replace(/text-emerald-\d+|text-green-\d+/g, "")
                            .trim() || "text-2xl"
                        }
                        style={{ color: statsValueColor }}
                      >
                        {stats.stat2.value}
                      </div>
                      <div
                        className={cn(
                          mergedData.typography?.stats?.labelClassName ||
                            "text-xl text-black",
                          mergedData.typography?.stats?.labelMarginTop ||
                            "mt-1",
                        )}
                      >
                        {stats.stat2.label}
                      </div>
                    </li>
                  )}
                  {stats.stat3 && (
                    <li>
                      <div
                        className={
                          mergedData.typography?.stats?.valueClassName
                            ?.replace(/text-emerald-\d+|text-green-\d+/g, "")
                            .trim() || "text-2xl"
                        }
                        style={{ color: statsValueColor }}
                      >
                        {stats.stat3.value}
                      </div>
                      <div
                        className={cn(
                          mergedData.typography?.stats?.labelClassName ||
                            "text-xl text-black",
                          mergedData.typography?.stats?.labelMarginTop ||
                            "mt-1",
                        )}
                      >
                        {stats.stat3.label}
                      </div>
                    </li>
                  )}
                  {stats.stat4 && (
                    <li>
                      <div
                        className={
                          mergedData.typography?.stats?.valueClassName
                            ?.replace(/text-emerald-\d+|text-green-\d+/g, "")
                            .trim() || "text-2xl"
                        }
                        style={{ color: statsValueColor }}
                      >
                        {stats.stat4.value}
                      </div>
                      <div
                        className={cn(
                          mergedData.typography?.stats?.labelClassName ||
                            "text-xl text-black",
                          mergedData.typography?.stats?.labelMarginTop ||
                            "mt-1",
                        )}
                      >
                        {stats.stat4.label}
                      </div>
                    </li>
                  )}
                </ul>
              );
            }

            // إذا كانت البيانات بالبنية القديمة (array)
            if (Array.isArray(stats) && stats.length > 0) {
              return (
                <ul
                  className={cn(
                    "grid text-center",
                    mergedData.responsive?.stats?.gridCols ||
                      "grid-cols-2 sm:grid-cols-4",
                    mergedData.responsive?.stats?.gap || "gap-4",
                    mergedData.responsive?.stats?.marginTop || "mt-10",
                  )}
                >
                  {stats.map((stat: any, index: number) => (
                    <li key={index}>
                      <div
                        className={
                          mergedData.typography?.stats?.valueClassName
                            ?.replace(/text-emerald-\d+|text-green-\d+/g, "")
                            .trim() || "text-2xl"
                        }
                        style={{ color: statsValueColor }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className={cn(
                          mergedData.typography?.stats?.labelClassName ||
                            "text-xl text-black",
                          mergedData.typography?.stats?.labelMarginTop ||
                            "mt-1",
                        )}
                      >
                        {stat.label}
                      </div>
                    </li>
                  ))}
                </ul>
              );
            }

            return null;
          })()}
        </div>

        {/* الصورة */}
        {(mergedData.image?.visible ?? true) && (
          <div
            className={cn(
              mergedData.responsive?.grid?.imageCols || "md:col-span-5",
              mergedData.responsive?.grid?.imageOrder || "order-2 md:order-2",
            )}
          >
            <figure
              className={cn(
                "relative flex-1",
                mergedData.image?.background?.positioning?.pr || "pr-[15px]",
                mergedData.image?.background?.positioning?.xlPr ||
                  "xl:pr-[21px]",
                mergedData.image?.background?.positioning?.pb || "pb-[15px]",
                mergedData.image?.background?.positioning?.xlPb ||
                  "xl:pb-[21px]",
                mergedData.image?.background?.enabled &&
                  (mergedData.image?.background?.className ||
                    "bg-emerald-600 rounded-[10px]"),
              )}
              style={{
                background: mergedData.image?.background?.enabled
                  ? `linear-gradient(135deg, ${imageBackgroundColor}, ${imageBackgroundColor})`
                  : undefined,
              }}
            >
              <Image
                src={mergedData.image?.src || "/placeholder.svg"}
                alt={mergedData.image?.alt || "صورة داخلية لغرفة معيشة حديثة"}
                width={mergedData.image?.width || 800}
                height={mergedData.image?.height || 600}
                className={
                  mergedData.image?.style?.className ||
                  "w-full h-full object-cover rounded-[15px]"
                }
              />
            </figure>
          </div>
        )}
      </div>
    </section>
  );
};

export default sideBySide;
