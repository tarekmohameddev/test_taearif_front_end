"use client";

import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { getDefaultContactFormSectionData } from "@/context-liveeditor/editorStoreFunctions/contactFormSectionFunctions";

interface SocialLinkProps {
  href: string;
  alt: string;
  text: string;
  icon?: {
    size?: string;
    color?: string;
  };
  textStyle?: {
    size?: string;
    color?: string;
    weight?: string;
  };
}

const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  alt,
  text,
  icon = { size: "24", color: "#1f2937" },
  textStyle = {
    size: "text-[14px] md:text-[16px]",
    color: "#1f2937",
    weight: "font-normal",
  },
}) => (
  <a href={href} target="_blank" className="flex items-center gap-x-[8px]">
    {alt === "facebook" && (
      <FaFacebook size={parseInt(icon.size || "24")} color={icon.color} />
    )}
    {alt === "x" && (
      <FaTwitter size={parseInt(icon.size || "24")} color={icon.color} />
    )}
    {alt === "instagram" && (
      <FaInstagram size={parseInt(icon.size || "24")} color={icon.color} />
    )}
    {alt === "linkedin" && (
      <FaLinkedinIn size={parseInt(icon.size || "24")} color={icon.color} />
    )}
    {alt === "whatsapp" && (
      <FaWhatsapp size={parseInt(icon.size || "24")} color={icon.color} />
    )}
    <span
      className={`${textStyle.size} ${textStyle.color} ${textStyle.weight}`}
    >
      {text}
    </span>
  </a>
);

interface ContactFormSectionProps {
  useStore?: boolean;
  variant?: string;
  id?: string;
  [key: string]: any;
}

const ContactFormSection1: React.FC<ContactFormSectionProps> = ({
  useStore = true,
  variant = "contactFormSection1",
  id,
  ...props
}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = variant || "contactFormSection1";
  const uniqueId = id || variantId;

  // Add state to force re-renders when store updates
  const [forceUpdate, setForceUpdate] = useState(0);

  // Subscribe to editor store updates for this contactFormSection variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const contactFormSectionStates = useEditorStore(
    (s) => s.contactFormSectionStates,
  );

  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultContactFormSectionData(),
        ...props,
      };
      ensureComponentVariant("contactFormSection", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);

  // Add effect to listen for store updates
  useEffect(() => {
    if (props.useStore) {
      // Force re-render when store data changes
      const unsubscribe = useEditorStore.subscribe((state) => {
        const newContactFormSectionStates = state.contactFormSectionStates;
        if (newContactFormSectionStates[uniqueId]) {
          // Force re-render by updating state
          setForceUpdate((prev) => prev + 1);
        }
      });

      return unsubscribe;
    }
  }, [props.useStore, uniqueId]);

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
    ? getComponentData("contactFormSection", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? contactFormSectionStates[uniqueId] || {}
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
          // Check if this is the exact component we're looking for by type and componentName
          if (
            (component as any).type === "contactFormSection" &&
            (component as any).componentName === variantId
          ) {
            return (component as any).data;
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
    // Get styling data from mergedData
    const styling = mergedData?.styling || {};

    // Navigate to the field using the path (e.g., "icon.color", "submitButton.background")
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

    // Also check in content.socialLinks for icon.color and textStyle.color
    if (fieldPath.includes("socialLinks")) {
      // This will be handled per link in the map function
      fieldData = undefined;
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
    if (
      fieldPath.includes("title") ||
      fieldPath.includes("textStyle") ||
      fieldPath.includes("textColor") ||
      fieldPath.includes("Text")
    ) {
      defaultGlobalColorType = "secondary";
    } else if (
      fieldPath.includes("icon") ||
      fieldPath.includes("Icon") ||
      fieldPath.includes("background") ||
      fieldPath.includes("submitButton")
    ) {
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

    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

  // Check if we have any data from API/stores first
  const hasApiData =
    tenantComponentData && Object.keys(tenantComponentData).length > 0;
  const hasStoreData =
    (storeData && Object.keys(storeData).length > 0) ||
    (currentStoreData && Object.keys(currentStoreData).length > 0);
  const hasPropsData = props.content || props.form;

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const defaultData = getDefaultContactFormSectionData();
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    // Ensure nested objects are properly merged
    content: {
      ...defaultData.content,
      ...(props.content || {}),
      ...(tenantComponentData?.content || {}),
      ...(storeData?.content || {}),
      ...(currentStoreData?.content || {}),
    },
    form: {
      ...defaultData.form,
      ...(props.form || {}),
      ...(tenantComponentData?.form || {}),
      ...(storeData?.form || {}),
      ...(currentStoreData?.form || {}),
    },
    layout: {
      ...defaultData.layout,
      ...(props.layout || {}),
      ...(tenantComponentData?.layout || {}),
      ...(storeData?.layout || {}),
      ...(currentStoreData?.layout || {}),
    },
    styling: {
      ...defaultData.styling,
      ...(props.styling || {}),
      ...(tenantComponentData?.styling || {}),
      ...(storeData?.styling || {}),
      ...(currentStoreData?.styling || {}),
    },
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Use merged data with proper fallbacks
  const title = mergedData.content?.title || defaultData.content.title;
  const socialLinks =
    mergedData.content?.socialLinks || defaultData.content.socialLinks;
  const formFields = mergedData.form?.fields || defaultData.form.fields;
  const submitButton =
    mergedData.form?.submitButton || defaultData.form.submitButton;
  const layout = mergedData.layout || defaultData.layout;
  const styling = mergedData.styling || defaultData.styling;

  // Helper function to darken a color significantly
  const darkenColor = (hex: string, amount: number = 80): string => {
    if (!hex || !hex.startsWith("#")) return "#000000";
    const cleanHex = hex.replace("#", "");
    if (cleanHex.length !== 6) return "#000000";

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

  // Get colors using getColor function
  const submitButtonBgColor = getColor(
    "submitButton.background",
    brandingColors.primary,
  );
  let submitButtonTextColor = getColor("submitButton.textColor", "#ffffff");

  // Ensure text color is never the same as background color
  // If they match, use a very dark version of the background color
  if (
    submitButtonTextColor.toLowerCase() === submitButtonBgColor.toLowerCase()
  ) {
    submitButtonTextColor = darkenColor(submitButtonBgColor, 80);
  }

  return (
    <section
      className={`container mx-auto ${layout?.container?.padding?.horizontal || "px-4"} ${layout?.container?.padding?.vertical || "py-8"} lg:w-full sm:max-w-[${layout?.container?.maxWidth || "1600px"}]`}
      dir="rtl"
    >
      <div
        className={`flex ${layout?.grid?.columns?.mobile || "flex-col"} ${layout?.grid?.columns?.desktop || "md:flex-row"} w-full justify-between ${layout?.grid?.gap || "gap-[16px]"}`}
      >
        <div
          className={`details ${styling?.layout?.detailsWidth || "w-full md:w-[35%]"} flex flex-col items-start justify-center ${styling?.layout?.gap || "gap-[16px] md:gap-[10px]"}`}
        >
          <div className="flex flex-col gap-[2px]">
            <h4
              className={`${styling?.title?.size || "text-[15px] md:text-[24px]"} ${styling?.title?.color || "text-custom-maincolor"} ${styling?.title?.weight || "font-normal"} xs:text-[20px] mb-[24px]`}
            >
              {title}
            </h4>
            <div className="flex flex-col items-start gap-[8px] md:gap-[24px]">
              {socialLinks.map((link: any, index: number) => {
                // Get icon color for this specific link
                const linkIconColor =
                  link.icon?.color &&
                  typeof link.icon.color === "string" &&
                  link.icon.color.startsWith("#")
                    ? link.icon.color
                    : link.icon?.useDefaultColor === false &&
                        link.icon?.value &&
                        typeof link.icon.value === "string" &&
                        link.icon.value.startsWith("#")
                      ? link.icon.value
                      : getColor("icon.color", brandingColors.primary);

                // Get text color for this specific link
                const linkTextColor =
                  link.textStyle?.color &&
                  typeof link.textStyle.color === "string" &&
                  link.textStyle.color.startsWith("#")
                    ? link.textStyle.color
                    : link.textStyle?.useDefaultColor === false &&
                        link.textStyle?.value &&
                        typeof link.textStyle.value === "string" &&
                        link.textStyle.value.startsWith("#")
                      ? link.textStyle.value
                      : getColor("textStyle.color", brandingColors.secondary);

                return (
                  <SocialLink
                    key={index}
                    {...link}
                    icon={{
                      ...link.icon,
                      color: linkIconColor,
                    }}
                    textStyle={{
                      ...link.textStyle,
                      color: linkTextColor,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className={`${styling?.layout?.formWidth || "w-full md:w-[50%]"}`}>
          <div className="Toastify"></div>
          <form className="flex flex-col gap-[12px] md:gap-[24px]">
            {formFields.map((field: any, index: number) => {
              if (field.type === "textarea") {
                return (
                  <textarea
                    key={field.id || index}
                    id={field.id}
                    name={field.id}
                    rows={field.rows || 2}
                    placeholder={field.placeholder}
                    required={field.required}
                    className={
                      field.style?.className ||
                      "border rounded p-2 mb-[12px] outline-custom-secondarycolor"
                    }
                  />
                );
              }
              return (
                <input
                  key={field.id || index}
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  className={
                    field.style?.className ||
                    "border rounded-[6px] p-2 outline-custom-secondarycolor"
                  }
                />
              );
            })}
            <button
              type="submit"
              className={
                submitButton.style?.className ||
                "rounded-[6px] w-full text-[14px] md:text-[20px] hover:scale-105 transition duration-300 py-2 md:py-1"
              }
              style={{
                backgroundColor: submitButtonBgColor,
                color: submitButtonTextColor,
              }}
            >
              {submitButton.text || "إرسال"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection1;
