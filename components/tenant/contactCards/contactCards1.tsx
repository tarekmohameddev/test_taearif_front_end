"use client";

import { useEffect } from "react";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { getDefaultContactCardsData } from "@/context/editorStoreFunctions/contactCardsFunctions";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as ReactIconsFa from "react-icons/fa";
import * as ReactIconsMd from "react-icons/md";
import type { IconType } from "react-icons";

// Function to get icon component based on type or name
const getContactCardIcon = (
  typeOrName: string,
): LucideIcon | IconType | React.ComponentType<any> => {
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
  return LucideIcons.MapPin;
};

interface ContactCardProps {
  icon: {
    type?: string;
    name?: string;
    size?: string | number | { mobile?: string; desktop?: string };
    className?: string;
  };
  title: {
    text: string;
    style: {
      size: {
        mobile: string;
        desktop: string;
      };
      weight: string;
      color: string;
      lineHeight: string;
    };
  };
  content: {
    type: "text" | "links";
    text?: string;
    links?: {
      text: string;
      href: string;
    }[];
    style: {
      size: {
        mobile: string;
        desktop: string;
      };
      weight: string;
      color: string;
      lineHeight: string;
    };
  };
  cardStyle: {
    height: {
      mobile: string;
      desktop: string;
    };
    gap: {
      main: string;
      content: {
        mobile: string;
        desktop: string;
      };
      links: string;
    };
    shadow: {
      enabled: boolean;
      value: string;
    };
    alignment: {
      horizontal: string;
      vertical: string;
    };
  };
}

interface ContactCardsProps {
  useStore?: boolean;
  variant?: string;
  id?: string;
  [key: string]: any;
}

const ContactCards1: React.FC<ContactCardsProps> = ({
  useStore = true,
  variant = "contactCards1",
  id,
  ...props
}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = variant || "contactCards1";
  const uniqueId = id || variantId;

  // Subscribe to editor store updates for this contactCards variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const contactCardsStates = useEditorStore((s) => s.contactCardsStates);

  useEffect(() => {
    if (useStore) {
      ensureComponentVariant("contactCards", uniqueId, props);
    }
  }, [uniqueId, useStore, ensureComponentVariant]);

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
  // Use same pattern as stepsSection1.tsx
  const storeData = useStore
    ? getComponentData("contactCards", uniqueId) || {}
    : {};
  const currentStoreData = useStore ? contactCardsStates[uniqueId] || {} : {};

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
            (component as any).type === "contactCards" &&
            (component as any).componentName === variantId &&
            componentId === id
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

  // Get default data as base (99% of the data)
  const defaultData = getDefaultContactCardsData();

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  // Use same pattern as stepsSection1.tsx
  const mergedData = {
    ...defaultData, // 99% - Default data as base
    ...props, // Props from parent component
    ...tenantComponentData, // Backend data (tenant data)
    ...storeData, // Store data
    ...currentStoreData, // Current store data (highest priority)
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669",
  ): string => {
    // Get styling data from mergedData
    const styling = mergedData?.styling || {};

    // Navigate to the field using the path (e.g., "icon.color")
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
      fieldPath.includes("content") ||
      fieldPath.includes("textColor") ||
      fieldPath.includes("Text")
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

    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Get colors using getColor function
  const iconColor = getColor("icon.color", brandingColors.primary);

  return (
    <div
      className={`${mergedData.layout?.container?.padding?.vertical || "py-[48px] md:py-[104px]"} ${mergedData.layout?.container?.padding?.horizontal || "px-4 sm:px-10"}`}
      dir="rtl"
    >
      <div
        className={`grid ${mergedData.layout?.grid?.columns?.mobile || "grid-cols-1"} ${mergedData.layout?.grid?.columns?.desktop || "md:grid-cols-3"} ${mergedData.layout?.grid?.gap || "gap-[24px]"} ${mergedData.layout?.grid?.borderRadius || "rounded-[10px]"}`}
      >
        {/* Use mergedData.cards directly like stepsSection1.tsx uses mergedData.steps */}
        {(mergedData.cards || defaultData.cards || []).map(
          (card: any, index: number) => {
            // Process card data inline to ensure it uses latest mergedData
            const processedCard: ContactCardProps = {
              ...card,
              icon: {
                ...card.icon,
                // Only support icon.type/name (lucide-react or react-icons)
                type: card.icon?.type,
                name: card.icon?.name,
                size:
                  card.icon?.size ||
                  (typeof card.icon?.size === "object" ? card.icon.size : 40),
                className:
                  card.icon?.className ||
                  (typeof card.icon?.size === "object"
                    ? `${card.icon.size?.mobile || "w-[40px] h-[40px]"} ${card.icon.size?.desktop || "md:w-[60px] md:h-[60px]"}`
                    : "w-[40px] h-[40px] md:w-[60px] md:h-[60px]"),
              },
              cardStyle: {
                ...(defaultData.cards?.[0]?.cardStyle || {}),
                ...card.cardStyle,
              },
            };

            return (
              <div
                key={`card-${index}-${processedCard.icon?.type || processedCard.icon?.name || index}`}
                className={`w-full flex flex-col ${processedCard.cardStyle.alignment.horizontal} ${processedCard.cardStyle.alignment.vertical} ${processedCard.cardStyle.height.mobile} ${processedCard.cardStyle.height.desktop} ${processedCard.cardStyle.gap.main}`}
                style={
                  processedCard.cardStyle.shadow.enabled
                    ? { boxShadow: processedCard.cardStyle.shadow.value }
                    : {}
                }
              >
                {(() => {
                  // Render icon component (lucide-react or react-icons only)
                  // Priority: name > type > default
                  const iconNameOrType =
                    processedCard.icon?.name ||
                    processedCard.icon?.type ||
                    "MapPin";
                  const IconComponent = getContactCardIcon(iconNameOrType);

                  // Get icon size
                  const iconSize =
                    typeof processedCard.icon?.size === "number"
                      ? processedCard.icon.size
                      : typeof processedCard.icon?.size === "object"
                        ? 40 // Default size for object-based sizing
                        : parseInt(String(processedCard.icon?.size || "40"));

                  // Get icon className
                  const iconClassName =
                    processedCard.icon?.className ||
                    (typeof processedCard.icon?.size === "object"
                      ? `${processedCard.icon.size?.mobile || "w-[40px] h-[40px]"} ${processedCard.icon.size?.desktop || "md:w-[60px] md:h-[60px]"}`
                      : "w-[40px] h-[40px] md:w-[60px] md:h-[60px]");

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
                <div
                  className={`flex flex-col ${processedCard.cardStyle?.alignment?.horizontal || "items-center"} ${processedCard.cardStyle?.alignment?.vertical || "justify-center"} ${processedCard.cardStyle?.gap?.content?.mobile || "gap-y-[8px]"} ${processedCard.cardStyle?.gap?.content?.desktop || "md:gap-y-[16px]"}`}
                >
                  <h2
                    className={`${processedCard.title?.style?.color || "#525252"} ${processedCard.title?.style?.weight || "font-bold"} ${processedCard.title?.style?.size?.mobile || "text-[16px]"} ${processedCard.title?.style?.size?.desktop || "md:text-[24px]"} ${processedCard.title?.style?.lineHeight || "leading-[35px]"}`}
                  >
                    {processedCard.title?.text || ""}
                  </h2>
                  {processedCard.content?.type === "links" ? (
                    <div
                      className={`flex flex-row items-between justify-between w-full ${processedCard.cardStyle?.gap?.links || "gap-x-[50px]"}`}
                    >
                      {processedCard.content?.links?.map(
                        (item: any, i: number) => (
                          <a
                            key={i}
                            href={item.href}
                            className={`${processedCard.content?.style?.color || "#525252"} ${processedCard.content?.style?.weight || "font-normal"} ${processedCard.content?.style?.size?.mobile || "text-[16px]"} ${processedCard.content?.style?.size?.desktop || "md:text-[20px]"} ${processedCard.content?.style?.lineHeight || "leading-[35px]"}`}
                          >
                            {item.text}
                          </a>
                        ),
                      )}
                    </div>
                  ) : (
                    <p
                      className={`${processedCard.content?.style?.color || "#525252"} ${processedCard.content?.style?.weight || "font-normal"} ${processedCard.content?.style?.size?.mobile || "text-[16px]"} ${processedCard.content?.style?.size?.desktop || "md:text-[20px]"} ${processedCard.content?.style?.lineHeight || "leading-[35px]"}`}
                    >
                      {processedCard.content?.text || ""}
                    </p>
                  )}
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};

export default ContactCards1;
