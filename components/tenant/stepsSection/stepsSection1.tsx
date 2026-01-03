"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as ReactIconsFa from "react-icons/fa";
import * as ReactIconsMd from "react-icons/md";
import type { IconType } from "react-icons";

// Function to get icon component based on type or name
const getStepIcon = (
  typeOrName: string,
): LucideIcon | IconType | React.ComponentType<any> => {
  // Legacy icon mapping for backward compatibility
  const legacyIconMap: Record<string, LucideIcon> = {
    step1: LucideIcons.Search, // Property Inspection
    step2: LucideIcons.FileText, // Property Description
    step3: LucideIcons.Camera, // Professional Photography
    step4: LucideIcons.Megaphone, // Marketing Strategy
    step5: LucideIcons.Globe, // Online Listing
    step6: LucideIcons.Users, // Client Communication
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
  return LucideIcons.Search;
};

type Step = {
  title: string;
  desc: string;
  image:
    | string
    | {
        type?: string;
        name?: string; // For custom icon names from react-icons or lucide-react
        size?: string | number;
        className?: string;
      };
  titleStyle?: {
    color?: string;
    size?: { mobile?: string; desktop?: string };
    weight?: string;
  };
  descriptionStyle?: {
    color?: string;
    size?: { mobile?: string; desktop?: string };
    lineHeight?: string;
  };
};

// Default data structure - Marketing Real Estate Steps
const getDefaultStepsSectionData = () => ({
  visible: true,
  background: {
    color: "#f2fbf9",
    padding: {
      desktop: "72px",
      tablet: "48px",
      mobile: "20px",
    },
  },
  header: {
    marginBottom: "40px",
    title: {
      text: "خطواتنا في تسويق العقارات",
      className: "section-title",
    },
    description: {
      text: "نتبع خطوات احترافية لضمان تسويق عقارك بأعلى مستوى من الكفاءة والنجاح",
      className: "section-subtitle-xl text-gray-600",
    },
  },
  grid: {
    gapX: "40px",
    gapY: "40px",
    gapYMobile: "48px",
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
  },
  steps: [
    {
      title: "المعاينة الأولية للعقار",
      desc: "زيارة العقار وتقييم حالته ومعرفة ميزاته ومراجعة التفاصيل التي تحتاج إلى توضيح.",
      image: {
        type: "step1",
        name: "Search",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "كتابة تفصيل العقار",
      desc: "وصف دقيق للممتلكات بما في ذلك الموقع، المساحة، المرافق، والحالة العامة.",
      image: {
        type: "step2",
        name: "FileText",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "التصوير الاحترافي للعقار",
      desc: "الاستعانة بمصور محترف لالتقاط صور عالية الجودة مع الاهتمام بالإضاءة والزوايا.",
      image: {
        type: "step3",
        name: "Camera",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "توقيع اتفاقية الوساطة والتسويق",
      desc: "توقيع عقد رسمي بينك وبين المالك لتنظيم عملية تسويق العقار وحقوق الطرفين.",
      image: {
        type: "step4",
        name: "Megaphone",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "تصميم بوستر للعقار وإضافته لموقعنا",
      desc: "إعداد بوستر يحتوي على الصور والتفاصيل الرئيسية ونشره على موقعنا الإلكتروني.",
      image: {
        type: "step5",
        name: "Globe",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "جذب العملاء المحتملين",
      desc: "استخدام وسائل الاتصال المختلفة لجذب المشترين المهتمين مثل الإعلانات.",
      image: {
        type: "step6",
        name: "Users",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
  ],
  iconStyle: {
    size: { mobile: "40px", desktop: "60px" },
    marginTop: "4px",
    shrink: true,
  },
  layout: {
    direction: "rtl",
    alignment: "left",
    maxWidth: "1200px",
  },
  animations: {
    header: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    steps: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      stagger: 100,
    },
  },
  responsive: {
    mobileBreakpoint: "640px",
    tabletBreakpoint: "1024px",
    desktopBreakpoint: "1280px",
  },
});

interface StepsSectionProps {
  visible?: boolean;
  background?: {
    color?: string;
    padding?: {
      desktop?: string;
      tablet?: string;
      mobile?: string;
    };
  };
  header?: {
    marginBottom?: string;
    title?: {
      text?: string;
      className?: string;
    };
    description?: {
      text?: string;
      className?: string;
    };
  };
  grid?: {
    gapX?: string;
    gapY?: string;
    gapYMobile?: string;
    columns?: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
  };
  steps?: Step[];
  iconStyle?: {
    size?: { mobile?: string; desktop?: string };
    marginTop?: string;
    shrink?: boolean;
  };
  layout?: {
    direction?: "rtl" | "ltr";
    alignment?: "left" | "center" | "right";
    maxWidth?: string;
  };
  animations?: {
    header?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    steps?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      stagger?: number;
    };
  };
  responsive?: {
    mobileBreakpoint?: string;
    tabletBreakpoint?: string;
    desktopBreakpoint?: string;
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function StepsSection1(props: StepsSectionProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "stepsSection1";
  const uniqueId = props.id || variantId;

  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const stepsSectionStates = useEditorStore((s) => s.stepsSectionStates);

  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultStepsSectionData(),
        ...props,
      };
      ensureComponentVariant("stepsSection", uniqueId, initialData);
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
    ? getComponentData("stepsSection", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? stepsSectionStates[uniqueId] || {}
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
          if (
            (component as any).type === "stepsSection" &&
            (component as any).componentName === variantId &&
            componentId === props.id
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const mergedData = {
    ...getDefaultStepsSectionData(),
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
  };

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
        : "#f2fbf9", // light background default
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (fieldPath: string, defaultColor?: string): string => {
    // Use primary color as default, fallback to #059669 if primary not available
    const effectiveDefaultColor =
      defaultColor || brandingColors.primary || "#059669";
    // Get styling data from mergedData
    const styling = mergedData?.styling || {};

    // Navigate to the field using the path (e.g., "background.color", "icon.color")
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

    // Also check in background, iconStyle, titleStyle, descriptionStyle directly
    // First check styling.icon.color, then iconStyle.color
    if (fieldPath === "icon.color") {
      // Check styling.icon.color first (from EditorSidebar)
      const stylingIconColor = mergedData?.styling?.icon?.color;
      if (stylingIconColor !== undefined && stylingIconColor !== null) {
        fieldData = stylingIconColor;
      } else {
        // Fallback to iconStyle.color (from default data)
        fieldData = mergedData?.iconStyle?.color;
      }
    } else if (fieldPath === "background.color") {
      // Check styling.background.color first, then background.color
      const stylingBgColor = mergedData?.styling?.background?.color;
      if (stylingBgColor !== undefined && stylingBgColor !== null) {
        fieldData = stylingBgColor;
      } else {
        fieldData = mergedData?.background?.color;
      }
    } else if (fieldPath === "header.title.color") {
      // Check styling.header.title.color first, then header.title.color
      const stylingHeaderTitleColor = mergedData?.styling?.header?.title?.color;
      if (
        stylingHeaderTitleColor !== undefined &&
        stylingHeaderTitleColor !== null
      ) {
        fieldData = stylingHeaderTitleColor;
      } else {
        fieldData = mergedData?.header?.title?.color;
      }
    } else if (fieldPath === "title.color") {
      // Check in steps array for titleStyle.color, then styling.title.color
      fieldData =
        mergedData?.steps?.[0]?.titleStyle?.color ||
        mergedData?.styling?.title?.color;
    } else if (fieldPath === "description.color") {
      // Check in steps array for descriptionStyle.color, then styling.description.color
      fieldData =
        mergedData?.steps?.[0]?.descriptionStyle?.color ||
        mergedData?.styling?.description?.color;
    } else if (
      !fieldData ||
      (typeof fieldData === "object" &&
        !fieldData.value &&
        !fieldData.useDefaultColor)
    ) {
      // For other paths, try to get from mergedData directly
      if (fieldPath === "background.color") {
        fieldData = mergedData?.background?.color;
      }
    }

    // Check if fieldData is a custom color (string starting with #)
    // If it is, return it directly (useDefaultColor is false)
    if (typeof fieldData === "string" && fieldData.startsWith("#")) {
      return fieldData;
    }

    // If fieldData is an object, check for value property
    if (
      fieldData &&
      typeof fieldData === "object" &&
      !Array.isArray(fieldData)
    ) {
      // If object has useDefaultColor property set to false, use the value
      if (
        fieldData.useDefaultColor === false &&
        fieldData.value &&
        typeof fieldData.value === "string" &&
        fieldData.value.startsWith("#")
      ) {
        return fieldData.value;
      }
      // If object has value but useDefaultColor is true or undefined, still check value first
      if (
        fieldData.value &&
        typeof fieldData.value === "string" &&
        fieldData.value.startsWith("#")
      ) {
        // Check if useDefaultColor is explicitly false
        if (fieldData.useDefaultColor === false) {
          return fieldData.value;
        }
      }
    }

    // If no custom color found, use branding color (useDefaultColor is true by default)
    // Determine globalColorType based on field path
    let defaultGlobalColorType = "primary";
    if (fieldPath.includes("background") || fieldPath.includes("Background")) {
      defaultGlobalColorType = "primary"; // Background uses primary color (with opacity applied separately)
    } else if (
      fieldPath.includes("header.title") ||
      fieldPath.includes("Header.Title")
    ) {
      // Header title uses primary color
      defaultGlobalColorType = "primary";
    } else if (
      fieldPath === "title.color" ||
      (fieldPath.includes("title") && !fieldPath.includes("header"))
    ) {
      // Step titles use primary color (not header titles)
      defaultGlobalColorType = "primary";
    } else if (
      fieldPath.includes("Title") ||
      fieldPath.includes("textColor") ||
      fieldPath.includes("Text")
    ) {
      defaultGlobalColorType = "secondary";
    } else if (
      fieldPath.includes("description") ||
      fieldPath.includes("Description")
    ) {
      defaultGlobalColorType = "secondary";
    } else if (fieldPath.includes("icon") || fieldPath.includes("Icon")) {
      defaultGlobalColorType = "primary";
    }

    // If fieldData is an object with globalColorType, use it
    if (
      fieldData &&
      typeof fieldData === "object" &&
      !Array.isArray(fieldData) &&
      fieldData.globalColorType
    ) {
      defaultGlobalColorType = fieldData.globalColorType;
    }

    // Use primary color as default, fallback to #059669 if primary not available
    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors];
    // If branding color exists and is valid, use it; otherwise use effectiveDefaultColor
    if (brandingColor && brandingColor.trim() !== "") {
      return brandingColor;
    }
    // Fallback to effectiveDefaultColor (primary or #059669) only if branding color is not available
    return effectiveDefaultColor;
  };

  // Helper function to convert hex color to rgba with opacity
  const getColorWithOpacity = (hex: string, opacity: number = 0.1): string => {
    // Use primary color as default if hex is invalid
    const defaultColor = brandingColors.primary || "#059669";
    if (!hex || !hex.startsWith("#")) {
      // Parse default color
      const cleanDefaultHex = defaultColor.replace("#", "");
      if (cleanDefaultHex.length === 6) {
        const r = parseInt(cleanDefaultHex.substr(0, 2), 16);
        const g = parseInt(cleanDefaultHex.substr(2, 2), 16);
        const b = parseInt(cleanDefaultHex.substr(4, 2), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      return `rgba(5, 150, 105, ${opacity})`; // emerald-600 fallback
    }

    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) {
      // Parse default color
      const cleanDefaultHex = defaultColor.replace("#", "");
      if (cleanDefaultHex.length === 6) {
        const r = parseInt(cleanDefaultHex.substr(0, 2), 16);
        const g = parseInt(cleanDefaultHex.substr(2, 2), 16);
        const b = parseInt(cleanDefaultHex.substr(4, 2), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      return `rgba(5, 150, 105, ${opacity})`;
    }

    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Get colors using getColor function
  // Always use primary color as base for background with opacity
  // Priority: custom color > primary color > #059669 fallback
  // Don't pass defaultColor to getColor, let it use primary as default internally
  const backgroundBaseColor = getColor("background.color");
  // Ensure we have a valid hex color, use primary as default, fallback to #059669 if primary not available
  const validBackgroundColor =
    backgroundBaseColor && backgroundBaseColor.startsWith("#")
      ? backgroundBaseColor
      : brandingColors.primary && brandingColors.primary.trim() !== ""
        ? brandingColors.primary
        : "#059669";
  const backgroundColor = getColorWithOpacity(
    getColor("icon.color", brandingColors.primary),
    0.2,
  );
  const iconColor = getColor("icon.color", brandingColors.primary);
  const titleColor = getColor("title.color", brandingColors.primary); // Step titles use primary color
  const descriptionColor = getColor(
    "description.color",
    brandingColors.secondary,
  );
  // Get header title color - check styling.header.title.color first, then use primary color
  const headerTitleColor =
    getColor("header.title.color", brandingColors.primary) ||
    mergedData?.styling?.header?.title?.color ||
    mergedData?.header?.title?.color ||
    brandingColors.primary;

  return (
    <section className="w-full bg-background sm:py-16 ">
      <div
        className="mx-auto p-5 sm:p-18  px-20"
        dir="rtl"
        style={{
          backgroundColor: backgroundColor,
          paddingTop: mergedData.background?.padding?.desktop || "72px",
          paddingBottom: mergedData.background?.padding?.desktop || "72px",
        }}
      >
        <header className="mb-10">
          <h2
            className={mergedData.header?.title?.className || "section-title"}
            style={{
              color: headerTitleColor,
            }}
          >
            {mergedData.header?.title?.text || "كيف يعمل النظام"}
          </h2>
          <p
            className={
              mergedData.header?.description?.className ||
              "section-subtitle-xl text-gray-600"
            }
          >
            {mergedData.header?.description?.text ||
              "خطوات بسيطة وواضحة لتحقيق هدفك"}
          </p>
        </header>

        {/* Steps Grid */}
        {/* شبكة الخطوات - مستوحاة من التصميم: أيقونة خضراء، عنوان، وصف */}
        <div
          className="grid gap-x-10 gap-y-10 sm:gap-y-12"
          style={{
            gridTemplateColumns: `repeat(${mergedData.grid?.columns?.desktop || 3}, 1fr)`,
            gap: `${mergedData.grid?.gapY || "40px"} ${mergedData.grid?.gapX || "40px"}`,
          }}
        >
          {mergedData.steps?.map((step: Step, i: number) => (
            <div key={i} className="flex items-start gap-4">
              <div className="mt-1 shrink-0" style={{ color: iconColor }}>
                {(() => {
                  // Priority: name > type > default
                  const iconNameOrType =
                    typeof step.image === "object" && step.image !== null
                      ? step.image.name || step.image.type || "step1"
                      : "step1";
                  const IconComponent = getStepIcon(iconNameOrType);

                  // Get icon size
                  const iconSize =
                    typeof step.image === "object" && step.image !== null
                      ? typeof step.image.size === "number"
                        ? step.image.size
                        : parseInt(step.image.size || "80")
                      : 80;

                  // Get icon className
                  const iconClassName =
                    typeof step.image === "object" && step.image !== null
                      ? step.image.className || "w-20 h-20"
                      : "w-20 h-20";

                  // Check if it's a React Icon (from react-icons) by checking the icon name pattern
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
              <div>
                <h3
                  className="text-lg sm:text-2xl"
                  style={{
                    color: step.titleStyle?.color || titleColor,
                    fontSize: step.titleStyle?.size?.mobile || "18px",
                    fontWeight: step.titleStyle?.weight || "600",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="sm:mt-2 text-sm sm:text-md leading-7"
                  style={{
                    color: step.descriptionStyle?.color || descriptionColor,
                    fontSize: step.descriptionStyle?.size?.mobile || "14px",
                    lineHeight: step.descriptionStyle?.lineHeight || "1.75",
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
