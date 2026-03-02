"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { toDimension } from "@/lib/utils";

// Default contact map section data
const getDefaultcontactMapSectionData = () => ({
  visible: true,
  title: "شاركنا تقييمك معنا",
  description:
    "نحن نهتم برأيك! قم بتقييم تجربتك معنا من خلال اختيار عدد النجوم المناسب وكتابة تعليقك. تساعدنا في تحسين الخدمة وتقديم أفضل تجربة لعملائنا",
  background: {
    color: "#ffffff",
    image: "",
    alt: "",
    overlay: {
      enabled: false,
      opacity: "0.1",
      color: "#000000",
    },
  },
  spacing: {
    paddingY: 56,
    maxWidth: 1600,
    paddingX: 16,
    headerMarginBottom: 40,
    gridGap: 32,
    formGap: 24,
    inputGap: 16,
  },
  header: {
    alignment: "text-right",
    title: {
      className: "section-title",
      color: "#1f2937",
      size: "text-3xl sm:text-4xl",
      weight: "font-bold",
    },
    description: {
      className: "section-subtitle",
      color: "#6b7280",
      size: "text-lg",
      weight: "font-normal",
      maxWidth: "max-w-4xl",
      lineHeight: "leading-7",
      marginTop: 16,
    },
  },
  layout: {
    gridCols: "grid-cols-1 lg:grid-cols-2",
    formOrder: "order-1 lg:order-1",
    mapOrder: "order-2 lg:order-2",
    responsiveBreakpoint: "lg",
  },
  form: {
    enabled: true,
    method: "POST",
    action: "",
    fields: {
      name: {
        enabled: true,
        label: "اسمك",
        placeholder: "أدخل اسمك",
        required: true,
        type: "text",
        height: 48,
      },
      country: {
        enabled: true,
        label: "بلدك",
        placeholder: "أدخل بلدك",
        required: true,
        type: "text",
        height: 48,
      },
      feedback: {
        enabled: true,
        label: "تعليقك",
        placeholder: "أدخل تعليقك",
        required: true,
        minHeight: "min-h-[120px]",
        resize: "resize-none",
      },
    },
    rating: {
      enabled: true,
      label: "التقييم",
      maxStars: 5,
      starSize: "size-8",
      activeColor: {
        useDefaultColor: true,
        globalColorType: "primary",
      },
      inactiveColor: "#d1d5db",
      hoverColor: {
        useDefaultColor: true,
        globalColorType: "primary",
      },
      showRatingText: true,
      ratingTextColor: {
        useDefaultColor: true,
        globalColorType: "secondary",
      },
    },
    submitButton: {
      enabled: true,
      text: "إرسال",
      type: "submit",
      width: 100,
      height: 48,
      backgroundColor: {
        useDefaultColor: true,
        globalColorType: "primary",
      },
      hoverBackgroundColor: {
        useDefaultColor: true,
        globalColorType: "primary",
      },
      textColor: {
        useDefaultColor: true,
        globalColorType: "secondary",
      },
      fontSize: "text-lg",
      fontWeight: "font-semibold",
      borderRadius: "rounded-xl",
    },
  },
  map: {
    enabled: true,
    title: "خريطة الرياض",
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.6829087747!2d46.3249!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s",
    width: 100,
    height: 400,
    borderRadius: "rounded-xl",
    border: "border",
    overflow: "overflow-hidden",
    allowFullScreen: true,
    loading: "lazy",
    referrerPolicy: "no-referrer-when-downgrade",
  },
  labels: {
    labelColor: "#374151",
    labelSize: "text-sm",
    labelWeight: "font-medium",
    labelMarginBottom: 8,
  },
  responsive: {
    mobileLayout: "stacked",
    tabletLayout: "stacked",
    desktopLayout: "side-by-side",
    mobileFormOrder: "order-1",
    mobileMapOrder: "order-2",
  },
  animations: {
    form: {
      enabled: true,
      type: "fade-in",
      duration: 500,
      delay: 100,
    },
    map: {
      enabled: true,
      type: "slide-in",
      duration: 600,
      delay: 200,
    },
    header: {
      enabled: true,
      type: "slide-up",
      duration: 600,
      delay: 200,
    },
  },
});

interface contactMapSectionProps {
  visible?: boolean;
  title?: string;
  description?: string;
  background?: {
    color?: string;
    image?: string;
    alt?: string;
    overlay?: {
      enabled?: boolean;
      opacity?: string;
      color?: string;
    };
  };
  spacing?: {
    paddingY?: string;
    maxWidth?: string;
    paddingX?: string;
    headerMarginBottom?: string;
    gridGap?: string;
    formGap?: string;
    inputGap?: string;
  };
  header?: {
    alignment?: string;
    title?: {
      className?: string;
      color?: string;
      size?: string;
      weight?: string;
    };
    description?: {
      className?: string;
      color?: string;
      size?: string;
      weight?: string;
      maxWidth?: string;
      lineHeight?: string;
      marginTop?: string;
    };
  };
  layout?: {
    gridCols?: string;
    formOrder?: string;
    mapOrder?: string;
    responsiveBreakpoint?: string;
  };
  form?: {
    enabled?: boolean;
    method?: string;
    action?: string;
    fields?: {
      name?: {
        enabled?: boolean;
        label?: string;
        placeholder?: string;
        required?: boolean;
        type?: string;
        height?: string;
      };
      country?: {
        enabled?: boolean;
        label?: string;
        placeholder?: string;
        required?: boolean;
        type?: string;
        height?: string;
      };
      feedback?: {
        enabled?: boolean;
        label?: string;
        placeholder?: string;
        required?: boolean;
        minHeight?: string;
        resize?: string;
      };
    };
    rating?: {
      enabled?: boolean;
      label?: string;
      maxStars?: number;
      starSize?: string;
      activeColor?: string;
      inactiveColor?: string;
      hoverColor?: string;
      showRatingText?: boolean;
      ratingTextColor?: string;
    };
    submitButton?: {
      enabled?: boolean;
      text?: string;
      type?: string;
      width?: string;
      height?: string;
      backgroundColor?: string;
      hoverBackgroundColor?: string;
      textColor?: string;
      fontSize?: string;
      fontWeight?: string;
      borderRadius?: string;
    };
  };
  map?: {
    enabled?: boolean;
    title?: string;
    src?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    border?: string;
    overflow?: string;
    allowFullScreen?: boolean;
    loading?: string;
    referrerPolicy?: string;
  };
  labels?: {
    labelColor?: string;
    labelSize?: string;
    labelWeight?: string;
    labelMarginBottom?: string;
  };
  responsive?: {
    mobileLayout?: string;
    tabletLayout?: string;
    desktopLayout?: string;
    mobileFormOrder?: string;
    mobileMapOrder?: string;
  };
  animations?: {
    form?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    map?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    header?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function contactMapSection(props: contactMapSectionProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "contactMapSection1";

  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

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
    ? getComponentData("contactMapSection", variantId) || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("contactMapSection", variantId) || {}
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
            (component as any).type === "contactMapSection" &&
            (componentId === props.id ||
              (component as any).id === props.id ||
              (component as any).id === variantId)
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
            (component as any).type === "contactMapSection" &&
            ((component as any).id === props.id ||
              (component as any).id === variantId)
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
              ...getDefaultcontactMapSectionData(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultcontactMapSectionData(),
              ...props,
            };
      ensureComponentVariant("contactMapSection", variantId, initialData);
    }
  }, [
    variantId,
    props.useStore,
    ensureComponentVariant,
    tenantComponentData,
    props,
  ]);

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

  // Get default data
  const defaultData = getDefaultcontactMapSectionData();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data (by comparing a key field like title)
  const isStoreDataDefault =
    currentStoreData?.title === defaultData?.title;

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
    console.group("🔍 ContactMapSection1 Data Sources");
    console.log("1️⃣ Default Data:", defaultData);
    console.log("2️⃣ Props:", props);
    console.log("3️⃣ Tenant Component Data:", tenantComponentData);
    console.log("4️⃣ Current Store Data:", currentStoreData);
    console.log("🔍 Is Store Data Default?", isStoreDataDefault);
    console.log("🔍 Has Tenant Data?", hasTenantData);
    console.log("🔀 Merged Data:", mergedData);
    console.log("Final Title:", mergedData.title);
    console.groupEnd();
  }

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669",
  ): string => {
    // Navigate to the field using the path (e.g., "form.submitButton.backgroundColor", "form.rating.activeColor")
    const pathParts = fieldPath.split(".");
    let fieldData: any = mergedData;

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

    // If fieldData is an object, check for useDefaultColor and value
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
      // If object has value but useDefaultColor is true or undefined, check if we should use branding color
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
      // If useDefaultColor is true (or undefined, default is true), use branding color
      if (fieldData.useDefaultColor !== false) {
        // Determine globalColorType
        let globalColorType = fieldData.globalColorType;
        if (!globalColorType) {
          // Determine based on field path
          if (
            fieldPath.includes("textColor") ||
            fieldPath.includes("Text") ||
            fieldPath.includes("labelColor") ||
            fieldPath.includes("ratingTextColor")
          ) {
            globalColorType = "secondary";
          } else if (
            fieldPath.includes("activeColor") ||
            fieldPath.includes("hoverColor") ||
            fieldPath.includes("hoverBackgroundColor") ||
            fieldPath.includes("backgroundColor") ||
            fieldPath.includes("submitButton")
          ) {
            globalColorType = "primary";
          } else {
            globalColorType = "primary";
          }
        }
        const brandingColor =
          brandingColors[globalColorType as keyof typeof brandingColors] ||
          defaultColor;
        return brandingColor;
      }
    }

    // If fieldData is a string (legacy format), check if it's emerald color - if so, use branding color instead
    if (typeof fieldData === "string" && fieldData.startsWith("#")) {
      // Check if it's the default emerald color - if so, use branding color
      if (fieldData === "#059669" || fieldData === "#047857") {
        // Determine globalColorType based on field path
        let defaultGlobalColorType = "primary";
        if (
          fieldPath.includes("textColor") ||
          fieldPath.includes("Text") ||
          fieldPath.includes("labelColor") ||
          fieldPath.includes("ratingTextColor")
        ) {
          defaultGlobalColorType = "secondary";
        } else if (
          fieldPath.includes("activeColor") ||
          fieldPath.includes("hoverColor") ||
          fieldPath.includes("hoverBackgroundColor") ||
          fieldPath.includes("backgroundColor") ||
          fieldPath.includes("submitButton")
        ) {
          defaultGlobalColorType = "primary";
        }
        const brandingColor =
          brandingColors[
            defaultGlobalColorType as keyof typeof brandingColors
          ] || defaultColor;
        return brandingColor;
      }
      // If it's a custom color (not emerald), return it
      return fieldData;
    }

    // If no custom color found, use branding color (useDefaultColor is true by default)
    // Determine globalColorType based on field path
    let defaultGlobalColorType = "primary";
    if (
      fieldPath.includes("textColor") ||
      fieldPath.includes("Text") ||
      fieldPath.includes("labelColor") ||
      fieldPath.includes("ratingTextColor")
    ) {
      defaultGlobalColorType = "secondary";
    } else if (
      fieldPath.includes("activeColor") ||
      fieldPath.includes("hoverColor") ||
      fieldPath.includes("hoverBackgroundColor") ||
      fieldPath.includes("backgroundColor") ||
      fieldPath.includes("submitButton")
    ) {
      defaultGlobalColorType = "primary";
    }

    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

  // Local state for form
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    feedback: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Get colors for submit button
  const submitButtonBgColor = getColor(
    "form.submitButton.backgroundColor",
    brandingColors.primary,
  );
  const submitButtonTextColor = getColor(
    "form.submitButton.textColor",
    "#ffffff",
  );
  const submitButtonHoverBgColor = getColor(
    "form.submitButton.hoverBackgroundColor",
    getDarkerColor(submitButtonBgColor, 20),
  );

  // Get colors for rating stars
  const ratingActiveColor = getColor(
    "form.rating.activeColor",
    brandingColors.primary,
  );
  const ratingHoverColor = getColor(
    "form.rating.hoverColor",
    brandingColors.primary,
  );
  const ratingTextColor = getColor(
    "form.rating.ratingTextColor",
    brandingColors.secondary,
  );

  // Get colors for labels
  const labelColor = getColor("labels.labelColor", brandingColors.secondary);

  return (
    <section
      className="w-full bg-background"
      style={{
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          "transparent",
        paddingTop: toDimension(mergedData.spacing?.paddingY, "px", "56px"),
        paddingBottom: toDimension(mergedData.spacing?.paddingY, "px", "56px"),
      }}
    >
      <div
        className="mx-auto"
        dir="rtl"
        style={{
          maxWidth: toDimension(mergedData.spacing?.maxWidth, "px", "1600px"),
          paddingLeft: toDimension(mergedData.spacing?.paddingX, "px", "16px"),
          paddingRight: toDimension(mergedData.spacing?.paddingX, "px", "16px"),
          gridTemplateColumns: mergedData.grid?.columns?.desktop
            ? `repeat(${mergedData.grid.columns.desktop}, 1fr)`
            : undefined,
          gap:
            mergedData.grid?.gapX || mergedData.grid?.gapY
              ? `${mergedData.grid.gapY || "40px"} ${mergedData.grid.gapX || "40px"}`
              : toDimension(mergedData.spacing?.gridGap, "px", "32px"),
        }}
      >
        {/* العنوان والوصف */}
        <header
          className={mergedData.header?.alignment || "text-right"}
          style={{
            marginBottom: toDimension(mergedData.spacing?.headerMarginBottom, "px", "40px"),
          }}
        >
          <h2
            className={mergedData.header?.title?.className || "section-title"}
            style={{
              color:
                mergedData.styling?.textColor ||
                mergedData.colors?.textColor ||
                undefined,
            }}
          >
            {mergedData.title}
          </h2>
          <p
            className={`${mergedData.header?.description?.className || "section-subtitle"} ${mergedData.header?.description?.maxWidth || "max-w-4xl"} ${mergedData.header?.description?.lineHeight || "leading-7"}`}
            style={{
              color:
                mergedData.styling?.textColor ||
                mergedData.colors?.textColor ||
                undefined,
              marginTop: toDimension(mergedData.header?.description?.marginTop, "px", "16px"),
            }}
          >
            {mergedData.description}
          </p>
        </header>

        {/* التقسيم 50/50 */}
        <div
          className={`grid ${mergedData.layout?.gridCols || "grid-cols-1 lg:grid-cols-2"}`}
          style={{
            gridTemplateColumns: mergedData.grid?.columns?.desktop
              ? `repeat(${mergedData.grid.columns.desktop}, 1fr)`
              : undefined,
            gap: toDimension(mergedData.spacing?.gridGap, "px", "32px"),
          }}
        >
          {/* النموذج - الجانب الأيمن */}
          {mergedData.form?.enabled !== false && (
            <div
              className={mergedData.layout?.formOrder || "order-1 lg:order-1"}
            >
              <form
                onSubmit={handleSubmit}
                className="flex flex-col"
                style={{ gap: toDimension(mergedData.spacing?.formGap, "px", "24px") }}
              >
                <div
                  className="grid grid-cols-1 sm:grid-cols-2"
                  style={{ gap: toDimension(mergedData.spacing?.inputGap, "px", "16px") }}
                >
                  {mergedData.form?.fields?.name?.enabled !== false && (
                    <div>
                      <label
                        htmlFor="name"
                        className={`block ${mergedData.labels?.labelSize || "text-sm"} ${mergedData.labels?.labelWeight || "font-medium"}`}
                        style={{ color: labelColor, marginBottom: toDimension(mergedData.labels?.labelMarginBottom, "px", "8px") }}
                      >
                        {mergedData.form?.fields?.name?.label || "اسمك"}
                      </label>
                      <Input
                        id="name"
                        type={mergedData.form?.fields?.name?.type || "text"}
                        placeholder={
                          mergedData.form?.fields?.name?.placeholder ||
                          "أدخل اسمك"
                        }
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        style={{
                          height: toDimension(mergedData.form?.fields?.name?.height, "px", "48px"),
                        }}
                        required={
                          mergedData.form?.fields?.name?.required || true
                        }
                      />
                    </div>
                  )}
                  {mergedData.form?.fields?.country?.enabled !== false && (
                    <div>
                      <label
                        htmlFor="country"
                        className={`block ${mergedData.labels?.labelSize || "text-sm"} ${mergedData.labels?.labelWeight || "font-medium"} text-foreground`}
                        style={{ marginBottom: toDimension(mergedData.labels?.labelMarginBottom, "px", "8px") }}
                      >
                        {mergedData.form?.fields?.country?.label || "بلدك"}
                      </label>
                      <Input
                        id="country"
                        type={mergedData.form?.fields?.country?.type || "text"}
                        placeholder={
                          mergedData.form?.fields?.country?.placeholder ||
                          "أدخل بلدك"
                        }
                        value={formData.country}
                        onChange={(e) =>
                          handleInputChange("country", e.target.value)
                        }
                        style={{
                          height: toDimension(mergedData.form?.fields?.country?.height, "px", "48px"),
                        }}
                        required={
                          mergedData.form?.fields?.country?.required || true
                        }
                      />
                    </div>
                  )}
                </div>

                {mergedData.form?.fields?.feedback?.enabled !== false && (
                  <div>
                    <label
                      htmlFor="feedback"
                      className={`block ${mergedData.labels?.labelSize || "text-sm"} ${mergedData.labels?.labelWeight || "font-medium"} text-foreground`}
                      style={{ marginBottom: toDimension(mergedData.labels?.labelMarginBottom, "px", "8px") }}
                    >
                      {mergedData.form?.fields?.feedback?.label || "تعليقك"}
                    </label>
                    <Textarea
                      id="feedback"
                      placeholder={
                        mergedData.form?.fields?.feedback?.placeholder ||
                        "أدخل تعليقك"
                      }
                      value={formData.feedback}
                      onChange={(e) =>
                        handleInputChange("feedback", e.target.value)
                      }
                      className={`${mergedData.form?.fields?.feedback?.minHeight || "min-h-[120px]"} ${mergedData.form?.fields?.feedback?.resize || "resize-none"}`}
                      required={
                        mergedData.form?.fields?.feedback?.required || true
                      }
                    />
                  </div>
                )}

                {/* تقييم بالنجوم */}
                {mergedData.form?.rating?.enabled !== false && (
                  <div>
                    <label
                      className={`block ${mergedData.labels?.labelSize || "text-sm"} ${mergedData.labels?.labelWeight || "font-medium"}`}
                      style={{ color: labelColor, marginBottom: toDimension(mergedData.labels?.labelMarginBottom, "px", "8px") }}
                    >
                      {mergedData.form?.rating?.label || "التقييم"}
                    </label>
                    <div className="flex items-center gap-2">
                      {Array.from({
                        length: mergedData.form.rating?.maxStars || 5,
                      }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          className="transition-colors"
                          onMouseEnter={() => setHoveredRating(i + 1)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(i + 1)}
                        >
                          <Star
                            className={
                              mergedData.form.rating?.starSize || "size-8"
                            }
                            style={{
                              fill:
                                i < (hoveredRating || rating)
                                  ? ratingActiveColor
                                  : mergedData.form.rating?.inactiveColor ||
                                    "#d1d5db",
                              color:
                                i < (hoveredRating || rating)
                                  ? ratingActiveColor
                                  : hoveredRating > i
                                    ? ratingHoverColor
                                    : mergedData.form.rating?.inactiveColor ||
                                      "#d1d5db",
                            }}
                          />
                        </button>
                      ))}
                      {mergedData.form.rating?.showRatingText && (
                        <span
                          className={`mr-2 ${mergedData.labels?.labelSize || "text-sm"}`}
                          style={{
                            color: ratingTextColor,
                          }}
                        >
                          {rating}/{mergedData.form.rating?.maxStars || 5}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {mergedData.form?.submitButton?.enabled !== false && (
                  <Button
                    type={
                      (mergedData.form?.submitButton?.type as any) || "submit"
                    }
                    className={`rounded-xl ${mergedData.form?.submitButton?.fontSize || "text-lg"} ${mergedData.form?.submitButton?.fontWeight || "font-semibold"} ${mergedData.form?.submitButton?.borderRadius || "rounded-xl"} transition-colors`}
                    style={{
                      backgroundColor: submitButtonBgColor,
                      color: submitButtonTextColor,
                      width: toDimension(mergedData.form?.submitButton?.width, "%", "100%"),
                      height: toDimension(mergedData.form?.submitButton?.height, "px", "48px"),
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        submitButtonHoverBgColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        submitButtonBgColor;
                    }}
                  >
                    {mergedData.form?.submitButton?.text || "إرسال"}
                  </Button>
                )}
              </form>
            </div>
          )}

          {/* الخريطة - الجانب الأيسر */}
          {mergedData.map?.enabled && (
            <div
              className={mergedData.layout?.mapOrder || "order-2 lg:order-2"}
            >
              <div
                className={`w-full ${mergedData.map.overflow || "overflow-hidden"} ${mergedData.map.borderRadius || "rounded-xl"} ${mergedData.map.border || "border"}`}
                style={{
                  width: toDimension(mergedData.map?.width, "%", "100%"),
                  height: toDimension(mergedData.map?.height, "px", "400px"),
                }}
              >
                <iframe
                  src={mergedData.map.src}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={mergedData.map.allowFullScreen}
                  loading={(mergedData.map.loading as any) || "lazy"}
                  referrerPolicy={
                    (mergedData.map.referrerPolicy as any) ||
                    "no-referrer-when-downgrade"
                  }
                  title={mergedData.map.title}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
