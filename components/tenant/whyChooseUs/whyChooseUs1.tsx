"use client";

import { useEffect } from "react";
import type React from "react";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as ReactIconsFa from "react-icons/fa";
import * as ReactIconsMd from "react-icons/md";
import type { IconType } from "react-icons";

// Function to get icon component based on type or name
const getWhyChooseUsIcon = (
  typeOrName: string,
): LucideIcon | IconType | React.ComponentType<any> => {
  // Legacy icon mapping for backward compatibility
  const legacyIconMap: Record<string, LucideIcon> = {
    icon1: LucideIcons.UserCircle, // خدمة شخصية
    icon2: LucideIcons.Building2, // مجموعة واسعة من العقارات
    icon3: LucideIcons.GraduationCap, // إرشادات الخبراء
    icon4: LucideIcons.TrendingUp, // تحليل السوق
    icon5: LucideIcons.Briefcase, // الاستشارات الاستثمارية
    icon6: LucideIcons.Settings, // إدارة الممتلكات
  };

  // Check legacy icons first
  if (legacyIconMap[typeOrName]) {
    return legacyIconMap[typeOrName];
  }

  // Try lucide-react icons
  const lucideIcon = (LucideIcons as any)[typeOrName];
  if (lucideIcon) {
    return lucideIcon;
  }

  // Try react-icons Font Awesome
  const faIcon = (ReactIconsFa as any)[typeOrName];
  if (faIcon) {
    return faIcon;
  }

  // Try react-icons Material Design
  const mdIcon = (ReactIconsMd as any)[typeOrName];
  if (mdIcon) {
    return mdIcon;
  }

  // Fallback to default icon
  return LucideIcons.UserCircle;
};

type Feature = {
  title: string;
  desc: string;
  icon: {
    type?: string;
    name?: string; // For custom icon names from react-icons or lucide-react
    size?: string | number;
    color?: string;
    className?: string;
  };
};

// Default why choose us data
const getDefaultWhyChooseUsData = () => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    padding: {
      y: "py-14",
      smY: "sm:py-16",
    },
  },
  header: {
    title: "لماذا تختارنا؟",
    description:
      "مكتبنا يجمع بين الخبرة والالتزام لتقديم خدمات مميزة في مجال العقارات",
    marginBottom: "mb-10",
    textAlign: "text-right",
    paddingX: "px-5",
    typography: {
      title: {
        className: "section-title text-right",
      },
      description: {
        className: "section-subtitle-xl",
      },
    },
  },
  features: {
    list: [
      {
        title: "خدمة شخصية",
        desc: "نحن نركز على تقديم تجربة تركز على العملاء لجعل بحثك عن العقارات سلسًا وناجحًا.",
        icon: {
          type: "icon1",
          size: "80",
          className: "w-20 h-20",
        },
      },
      {
        title: "مجموعة واسعة من العقارات",
        desc: "من الشقق إلى الفلل والمكاتب والمساحات التجارية، لدينا خيارات تناسب جميع الاحتياجات.",
        icon: {
          type: "icon2",
          size: "80",
          className: "w-20 h-20",
        },
      },
      {
        title: "إرشادات الخبراء",
        desc: "بفضل سنوات الخبرة، يقدم فريقنا رؤى ونصائح مخصصة لضمان قرار مناسب لتفضيلاتك.",
        icon: {
          type: "icon3",
          size: "80",
          className: "w-20 h-20",
        },
      },
      {
        title: "تحليل السوق",
        desc: "تحليل متعمق للسوق يوفر رؤية قيمة حول اتجاهات العقارات والأسعار وفرص الاستثمار.",
        icon: {
          type: "icon4",
          size: "80",
          className: "w-20 h-20",
        },
      },
      {
        title: "الاستشارات الاستثمارية",
        desc: "إرشادات من الخبراء لتحقيق أقصى عائد على استثماراتك العقارية واتخاذ قرارات ذكية.",
        icon: {
          type: "icon5",
          size: "80",
          className: "w-20 h-20",
        },
      },
      {
        title: "إدارة الممتلكات",
        desc: "خدمات إدارة شاملة للحفاظ على قيمة ممتلكاتك وتعزيز عوائدها التأجيرية.",
        icon: {
          type: "icon6",
          size: "80",
          className: "w-20 h-20",
        },
      },
    ],
    grid: {
      gap: "gap-6",
      columns: {
        sm: "sm:grid-cols-2",
        xl: "xl:grid-cols-3",
      },
      paddingX: "px-4",
    },
    card: {
      className:
        "rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-emerald-50",
      borderRadius: "rounded-2xl",
      border: "border",
      backgroundColor: "bg-white",
      padding: "p-6",
      shadow: "shadow-sm",
      ring: "ring-1 ring-emerald-50",
    },
    icon: {
      container: {
        className: "mx-auto flex size-20 items-center justify-center",
        size: "size-20",
        flex: "flex",
        items: "items-center",
        justify: "justify-center",
      },
      image: {
        className: "h-[7rem] w-[7rem]",
        height: "h-[7rem]",
        width: "w-[7rem]",
      },
    },
    typography: {
      title: {
        className: "mt-6 text-center text-lg font-bold text-emerald-700",
        marginTop: "mt-6",
        textAlign: "text-center",
        fontSize: "text-lg",
        fontWeight: "font-bold",
        color: "text-emerald-700",
      },
      description: {
        className: "mt-3 text-center text-lg leading-7 text-gray-600",
        marginTop: "mt-3",
        textAlign: "text-center",
        fontSize: "text-lg",
        lineHeight: "leading-7",
        color: "text-gray-600",
      },
    },
  },
  responsive: {
    mobile: {
      padding: "py-14",
      gridCols: "grid-cols-1",
    },
    tablet: {
      padding: "sm:py-16",
      gridCols: "sm:grid-cols-2",
    },
    desktop: {
      gridCols: "xl:grid-cols-3",
    },
  },
  animations: {
    header: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    features: {
      enabled: true,
      type: "fade-up",
      duration: 500,
      delay: 300,
      stagger: 100,
    },
    icons: {
      enabled: true,
      type: "fade-up",
      duration: 500,
      delay: 400,
      stagger: 50,
    },
  },
  colors: {
    background: "#ffffff",
    cardBackground: "#ffffff",
    titleColor: "#059669",
    descriptionColor: "#4b5563",
    borderColor: "#e5e7eb",
    ringColor: "#ecfdf5",
  },
});

interface WhyChooseUsProps {
  visible?: boolean;
  layout?: {
    direction?: string;
    maxWidth?: string;
    padding?: {
      y?: string;
      smY?: string;
    };
  };
  header?: {
    title?: string;
    description?: string;
    marginBottom?: string;
    textAlign?: string;
    paddingX?: string;
    typography?: {
      title?: {
        className?: string;
      };
      description?: {
        className?: string;
      };
    };
  };
  features?: {
    list?: Feature[];
    grid?: {
      gap?: string;
      columns?: {
        sm?: string;
        xl?: string;
      };
      paddingX?: string;
    };
    card?: {
      className?: string;
      borderRadius?: string;
      border?: string;
      backgroundColor?: string;
      padding?: string;
      shadow?: string;
      ring?: string;
    };
    icon?: {
      container?: {
        className?: string;
        size?: string;
        flex?: string;
        items?: string;
        justify?: string;
      };
      image?: {
        className?: string;
        height?: string;
        width?: string;
      };
    };
    typography?: {
      title?: {
        className?: string;
        marginTop?: string;
        textAlign?: string;
        fontSize?: string;
        fontWeight?: string;
        color?: string;
      };
      description?: {
        className?: string;
        marginTop?: string;
        textAlign?: string;
        fontSize?: string;
        lineHeight?: string;
        color?: string;
      };
    };
  };
  responsive?: {
    mobile?: {
      padding?: string;
      gridCols?: string;
    };
    tablet?: {
      padding?: string;
      gridCols?: string;
    };
    desktop?: {
      gridCols?: string;
    };
  };
  animations?: {
    header?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    features?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
      stagger?: number;
    };
    icons?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
      stagger?: number;
    };
  };
  colors?: {
    background?: string;
    cardBackground?: string;
    titleColor?: string;
    descriptionColor?: string;
    borderColor?: string;
    ringColor?: string;
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function WhyChooseUsSection(props: WhyChooseUsProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "whyChooseUs1";
  const uniqueId = props.id || variantId;

  // Subscribe to editor store updates for this why choose us variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const whyChooseUsStates = useEditorStore((s) => s.whyChooseUsStates);

  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultWhyChooseUsData(),
        ...props,
      };
      ensureComponentVariant("whyChooseUs", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("whyChooseUs", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? whyChooseUsStates[uniqueId] || {}
    : {};

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData) {
      return {};
    }

    // First, check if data comes directly from API response (new structure)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "whyChooseUs" &&
          component.componentName === variantId
        ) {
          const componentData = component.data;

          // Transform the API data structure to match component expectations
          return {
            visible: componentData.visible,
            header: {
              title: componentData.texts?.title || componentData.header?.title,
              description:
                componentData.texts?.subtitle ||
                componentData.header?.description,
              typography: {
                title: {
                  className: componentData.texts?.title
                    ? "section-title text-right"
                    : undefined,
                },
                description: {
                  className: componentData.texts?.subtitle
                    ? "section-subtitle-xl"
                    : undefined,
                },
              },
            },
            colors: {
              background: componentData.colors?.background,
              textColor: componentData.colors?.textColor,
              titleColor: componentData.colors?.titleColor,
              descriptionColor: componentData.colors?.descriptionColor,
            },
            layout: {
              direction: componentData.layout?.direction || "rtl",
              maxWidth: componentData.layout?.maxWidth || "1600px",
            },
          };
        }
      }
    }

    // Fallback: check componentSettings (old structure)
    if (tenantData?.componentSettings) {
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
            // Check if this is the exact component we're looking for by type and componentName
            if (
              (component as any).type === "whyChooseUs" &&
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
    // Get styling data from mergedData (check styling.icon.color, styling.colors, and colors)
    const styling = mergedData?.styling || {};

    // Special handling for icon.color path
    if (fieldPath === "icon.color") {
      // Check styling.icon.color first (from EditorSidebar)
      const stylingIconColor = styling?.icon?.color;
      if (stylingIconColor !== undefined && stylingIconColor !== null) {
        // If it's a string with #, return it
        if (
          typeof stylingIconColor === "string" &&
          stylingIconColor.startsWith("#")
        ) {
          return stylingIconColor;
        }
        // If it's an object, check for value and useDefaultColor
        if (
          typeof stylingIconColor === "object" &&
          !Array.isArray(stylingIconColor)
        ) {
          if (
            stylingIconColor.useDefaultColor === false &&
            stylingIconColor.value &&
            typeof stylingIconColor.value === "string" &&
            stylingIconColor.value.startsWith("#")
          ) {
            return stylingIconColor.value;
          }
          if (stylingIconColor.useDefaultColor !== false) {
            // Use branding color
            return brandingColors.primary;
          }
        }
      }
      // Fallback to iconColor from colors
      const colorsIconColor =
        mergedData?.colors?.iconColor || mergedData?.styling?.colors?.iconColor;
      if (
        colorsIconColor &&
        typeof colorsIconColor === "string" &&
        colorsIconColor.startsWith("#")
      ) {
        return colorsIconColor;
      }
      // Final fallback to primary branding color
      return brandingColors.primary;
    }

    // For other paths, use existing logic
    const colors = styling?.colors || mergedData?.colors || {};

    // Navigate to the field using the path (e.g., "titleColor")
    const pathParts = fieldPath.split(".");
    let fieldData = colors;
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
    let useDefaultColorValue = colors;
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
    let globalColorTypeValue = colors;
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
      if (
        fieldPath.includes("titleColor") ||
        fieldPath.includes("descriptionColor") ||
        fieldPath.includes("textColor")
      ) {
        defaultGlobalColorType = "secondary";
      } else if (
        fieldPath.includes("iconColor") ||
        fieldPath.includes("ringColor") ||
        fieldPath.includes("primary")
      ) {
        defaultGlobalColorType = "primary";
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
    if (
      fieldPath.includes("titleColor") ||
      fieldPath.includes("descriptionColor") ||
      fieldPath.includes("textColor")
    ) {
      defaultGlobalColorType = "secondary";
    }
    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

  // Helper function to create lighter color for ring/border (10% opacity of primary)
  const getLighterColor = (hex: string, opacity: number = 0.1): string => {
    if (!hex || !hex.startsWith("#")) return "rgba(5, 150, 105, 0.1)";
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return "rgba(5, 150, 105, 0.1)";

    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const defaultData = getDefaultWhyChooseUsData();
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    // Ensure nested objects are properly merged
    header: {
      ...defaultData.header,
      ...(props.header || {}),
      ...(tenantComponentData.header || {}),
      ...(storeData.header || {}),
      ...(currentStoreData.header || {}),
      typography: {
        ...defaultData.header?.typography,
        ...(props.header?.typography || {}),
        ...(tenantComponentData.header?.typography || {}),
        ...(storeData.header?.typography || {}),
        ...(currentStoreData.header?.typography || {}),
        title: {
          ...defaultData.header?.typography?.title,
          ...(props.header?.typography?.title || {}),
          ...(tenantComponentData.header?.typography?.title || {}),
          ...(storeData.header?.typography?.title || {}),
          ...(currentStoreData.header?.typography?.title || {}),
        },
        description: {
          ...defaultData.header?.typography?.description,
          ...(props.header?.typography?.description || {}),
          ...(tenantComponentData.header?.typography?.description || {}),
          ...(storeData.header?.typography?.description || {}),
          ...(currentStoreData.header?.typography?.description || {}),
        },
      },
    },
    features: {
      ...defaultData.features,
      ...(props.features || {}),
      ...(tenantComponentData.features || {}),
      ...(storeData.features || {}),
      ...(currentStoreData.features || {}),
      grid: {
        ...defaultData.features?.grid,
        ...(props.features?.grid || {}),
        ...(tenantComponentData.features?.grid || {}),
        ...(storeData.features?.grid || {}),
        ...(currentStoreData.features?.grid || {}),
      },
      card: {
        ...defaultData.features?.card,
        ...(props.features?.card || {}),
        ...(tenantComponentData.features?.card || {}),
        ...(storeData.features?.card || {}),
        ...(currentStoreData.features?.card || {}),
      },
      icon: {
        ...defaultData.features?.icon,
        ...(props.features?.icon || {}),
        ...(tenantComponentData.features?.icon || {}),
        ...(storeData.features?.icon || {}),
        ...(currentStoreData.features?.icon || {}),
      },
      typography: {
        ...defaultData.features?.typography,
        ...(props.features?.typography || {}),
        ...(tenantComponentData.features?.typography || {}),
        ...(storeData.features?.typography || {}),
        ...(currentStoreData.features?.typography || {}),
      },
    },
    colors: {
      ...defaultData.colors,
      ...(props.colors || {}),
      ...(tenantComponentData.colors || {}),
      ...(storeData.colors || {}),
      ...(currentStoreData.colors || {}),
    },
    layout: {
      ...defaultData.layout,
      ...(props.layout || {}),
      ...(tenantComponentData.layout || {}),
      ...(storeData.layout || {}),
      ...(currentStoreData.layout || {}),
    },
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Get colors using getColor function
  // Card title always uses primary color (not customizable)
  const titleColor = brandingColors.primary;
  const descriptionColor = "#6b7280"; // Always gray-500 (#6b7280)
  const iconColor = getColor("icon.color", brandingColors.primary);
  const ringColor = getColor(
    "ringColor",
    getLighterColor(brandingColors.primary, 0.1),
  );

  // Get header title color - use primary color as default if available, otherwise use section-title CSS class
  // Check if primary color exists in branding (not just default fallback)
  const hasPrimaryColor =
    tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== "";

  // Priority: custom color > primary branding color > undefined (use CSS class)
  const headerTitleColor =
    mergedData?.styling?.header?.title?.color ||
    mergedData?.header?.title?.color ||
    mergedData?.styling?.textColor ||
    mergedData?.colors?.textColor ||
    (hasPrimaryColor ? brandingColors.primary : undefined);

  return (
    <section
      className="w-full bg-background"
      style={{
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          mergedData.colors?.background ||
          "#ffffff",
        paddingTop: mergedData.layout?.padding?.y || "py-14",
        paddingBottom: mergedData.layout?.padding?.smY || "sm:py-16",
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: mergedData.layout?.maxWidth || "1600px" }}
        dir={mergedData.layout?.direction || "rtl"}
      >
        <header
          className={`${mergedData.header?.marginBottom || "mb-10"} ${mergedData.header?.textAlign || "text-right"} ${mergedData.header?.paddingX || "px-5"}`}
        >
          <h2
            className={
              mergedData.header?.typography?.title?.className !== undefined &&
              mergedData.header?.typography?.title?.className !== ""
                ? mergedData.header.typography.title.className
                : "section-title text-right"
            }
            style={{
              ...(headerTitleColor ? { color: headerTitleColor } : {}),
            }}
          >
            {mergedData.header?.title || "لماذا تختارنا؟"}
          </h2>
          <p
            className={
              mergedData.header?.typography?.description?.className !==
                undefined &&
              mergedData.header?.typography?.description?.className !== ""
                ? mergedData.header.typography.description.className
                : "section-subtitle-xl"
            }
            style={{
              color:
                mergedData.styling?.textColor ||
                mergedData.colors?.textColor ||
                undefined,
            }}
          >
            {mergedData.header?.description ||
              "مكتبنا يجمع بين الخبرة والالتزام لتقديم خدمات مميزة في مجال العقارات"}
          </p>
        </header>

        <div
          className={` py-5 grid ${mergedData.features?.grid?.gap || "gap-6"} ${mergedData.features?.grid?.columns?.sm || "sm:grid-cols-2"} ${mergedData.features?.grid?.columns?.xl || "xl:grid-cols-3"} ${mergedData.features?.grid?.paddingX || "px-4"}`}
          style={{
            gridTemplateColumns: mergedData.grid?.columns?.desktop
              ? `repeat(${mergedData.grid.columns.desktop}, 1fr)`
              : undefined,
            gap:
              mergedData.grid?.gapX || mergedData.grid?.gapY
                ? `${mergedData.grid.gapY || "40px"} ${mergedData.grid.gapX || "40px"}`
                : undefined,
          }}
        >
          {(mergedData.features?.list || []).map((f: any, i: number) => (
            <article
              key={i}
              className={
                mergedData.features?.card?.className ||
                "rounded-2xl border bg-white p-6 shadow-sm ring-1"
              }
              style={
                {
                  backgroundColor:
                    mergedData.colors?.cardBackground || "#ffffff",
                  borderColor: "#e5e7eb", // Always gray (gray-200)
                  "--tw-ring-color": ringColor,
                } as React.CSSProperties
              }
            >
              <div
                className={
                  mergedData.features?.icon?.container?.className ||
                  "mx-auto flex size-20 items-center justify-center"
                }
                style={{
                  color: iconColor,
                }}
              >
                {(() => {
                  // Priority: name > type > default
                  const iconNameOrType =
                    f.icon?.name || f.icon?.type || "icon1";
                  const IconComponent = getWhyChooseUsIcon(iconNameOrType);

                  // Get icon size
                  const iconSize =
                    typeof f.icon?.size === "number"
                      ? f.icon.size
                      : parseInt(f.icon?.size || "80");

                  // Get icon className
                  const iconClassName =
                    f.icon?.className ||
                    mergedData.features?.icon?.image?.className ||
                    "";

                  // Check if it's a React Icon (from react-icons) by checking the icon name pattern
                  // React Icons typically start with Fa, Md, Io, etc.
                  const isReactIcon =
                    iconNameOrType.startsWith("Fa") ||
                    iconNameOrType.startsWith("Md") ||
                    iconNameOrType.startsWith("Io") ||
                    iconNameOrType.startsWith("Bi") ||
                    iconNameOrType.startsWith("Bs") ||
                    iconNameOrType.startsWith("Hi") ||
                    iconNameOrType.startsWith("Ai") ||
                    iconNameOrType.startsWith("Ti") ||
                    iconNameOrType.startsWith("Gi") ||
                    iconNameOrType.startsWith("Si") ||
                    iconNameOrType.startsWith("Ri") ||
                    iconNameOrType.startsWith("Tb") ||
                    iconNameOrType.startsWith("Vsc") ||
                    iconNameOrType.startsWith("Wi") ||
                    iconNameOrType.startsWith("Di") ||
                    iconNameOrType.startsWith("Im");

                  // For React Icons, use style with fontSize
                  if (isReactIcon) {
                    return (
                      <IconComponent
                        className={iconClassName}
                        style={{
                          color: iconColor,
                          fontSize: `${iconSize}px`,
                          width: `${iconSize}px`,
                          height: `${iconSize}px`,
                        }}
                      />
                    );
                  }

                  // For Lucide icons, use size prop
                  return (
                    <IconComponent
                      size={iconSize}
                      className={iconClassName}
                      style={{
                        color: iconColor,
                      }}
                    />
                  );
                })()}
              </div>
              <h3
                className={
                  mergedData.features?.typography?.title?.className ||
                  "mt-6 text-center text-lg font-bold"
                }
                style={{ color: titleColor }}
              >
                {f.title}
              </h3>
              <p
                className={
                  mergedData.features?.typography?.description?.className ||
                  "mt-3 text-center text-lg leading-7"
                }
                style={{
                  color: descriptionColor,
                }}
              >
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
