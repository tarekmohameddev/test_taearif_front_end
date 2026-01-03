"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { useEditorT } from "@/context/editorI18nStore";
import { getDefaultHalfTextHalfImage7Data } from "@/context/editorStoreFunctions/halfTextHalfImageFunctions";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as ReactIconsFa from "react-icons/fa";
import * as ReactIconsMd from "react-icons/md";
import type { IconType } from "react-icons";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface HalfTextHalfImage7Props {
  visible?: boolean;
  ThemeTwo?: string;
  layout?: {
    ThemeTwo?: string;
    direction?: string;
    maxWidth?: string;
  };
  spacing?: {
    ThemeTwo?: string;
    padding?: {
      ThemeTwo?: string;
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    };
  };
  content?: {
    ThemeTwo?: string;
    title?: string;
    features?: Array<{
      ThemeTwo?: string;
      id?: string;
      title?: string;
      description?: string;
      icon?: string;
    }>;
  };
  styling?: {
    ThemeTwo?: string;
    backgroundColor?: string;
    titleColor?: string;
    dividerColor?: string;
    featureTitleColor?: string;
    featureDescriptionColor?: string;
    iconBackgroundColor?: string;
    iconColor?: string;
  };
  image?: {
    ThemeTwo?: string;
    src?: string;
    alt?: string;
    visible?: boolean;
  };
  responsive?: {
    ThemeTwo?: string;
    mobile?: {
      ThemeTwo?: string;
      imageOrder?: number;
      textOrder?: number;
      imageHeight?: string;
    };
    desktop?: {
      ThemeTwo?: string;
      imageOrder?: number;
      textOrder?: number;
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
export default function HalfTextHalfImage7(props: HalfTextHalfImage7Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "halfTextHalfImage7";
  const uniqueId = props.id || variantId;
  const t = useEditorT();

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
              ...getDefaultHalfTextHalfImage7Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultHalfTextHalfImage7Data(),
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
    ...getDefaultHalfTextHalfImage7Data(), // 1. Defaults (lowest priority)
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
  // Function to get icon component based on type or name
  const getFeatureIcon = (
    typeOrName: string,
  ): LucideIcon | IconType | React.ComponentType<any> => {
    // Legacy icon mapping for backward compatibility
    const legacyIconMap: Record<string, LucideIcon> = {
      transparency: LucideIcons.Shield,
      commitment: LucideIcons.Handshake,
      innovation: LucideIcons.Lightbulb,
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
    return LucideIcons.Shield;
  };

  return (
    <section
      className="w-full flex items-center justify-center py-12 md:py-16"
      style={{
        backgroundColor: mergedData.styling?.backgroundColor || "#f5f0e8",
        paddingTop: mergedData.spacing?.padding?.top || "3rem",
        paddingBottom: mergedData.spacing?.padding?.bottom || "4rem",
        paddingLeft: mergedData.spacing?.padding?.left || "1rem",
        paddingRight: mergedData.spacing?.padding?.right || "1rem",
      }}
      dir={mergedData.layout?.direction || "rtl"}
    >
      <div
        className="w-full mx-auto px-4 md:px-6 lg:px-8"
        style={{
          maxWidth: mergedData.layout?.maxWidth || "1350px",
        }}
      >
        <div className="rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Image */}
            {(mergedData.image?.visible ?? true) && (
              <div
                className={`w-full md:w-[50%] relative rounded-xl overflow-hidden ${
                  mergedData.responsive?.mobile?.imageHeight || "h-[300px]"
                } ${mergedData.responsive?.desktop?.imageHeight || "md:min-h-[500px]"} order-${
                  mergedData.responsive?.mobile?.imageOrder || 1
                } md:order-${mergedData.responsive?.desktop?.imageOrder || 2}`}
              >
                <Image
                  src={
                    mergedData.image?.src ||
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000"
                  }
                  alt={
                    mergedData.image?.alt ||
                    t("components.halfTextHalfImage.default_image_alt")
                  }
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            )}

            {/* Right Side - Text Content */}
            <div
              className={`w-full md:w-[50%] bg-[#f5f0e8] flex flex-col justify-center px-6 md:px-8 lg:px-10 py-8 md:py-12 text-right order-${
                mergedData.responsive?.mobile?.textOrder || 2
              } md:order-${mergedData.responsive?.desktop?.textOrder || 1}`}
            >
              {/* Heading */}
              <div className="mb-6 md:mb-8">
                <h3
                  className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight"
                  style={{
                    color: mergedData.styling?.titleColor || "#000000",
                  }}
                >
                  {mergedData.content?.title ||
                    t("components.halfTextHalfImage.default_title")}
                </h3>
                {/* Divider */}
                <div
                  className="w-24 h-[2px] mb-4 ml-auto"
                  style={{
                    backgroundColor:
                      mergedData.styling?.dividerColor || "#8b5f46",
                  }}
                ></div>
              </div>

              {/* Icon Boxes */}
              <div className="space-y-6 md:space-y-8">
                {(mergedData.content?.features || []).map(
                  (
                    feature: {
                      id?: string;
                      title?: string;
                      description?: string;
                      icon?: string;
                    },
                    index: number,
                  ) => (
                    <div
                      key={feature.id || index}
                      className="flex items-start gap-4"
                    >
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor:
                            mergedData.styling?.iconBackgroundColor ||
                            "#d4a574",
                        }}
                      >
                        {(() => {
                          const iconName = feature.icon || "Shield";
                          const IconComponent = getFeatureIcon(iconName);
                          const iconColor =
                            mergedData.styling?.iconColor || "#896042";

                          // Check if it's a React Icon (from react-icons) by checking the icon name pattern
                          const isReactIcon =
                            iconName.startsWith("Fa") ||
                            iconName.startsWith("Md") ||
                            iconName.startsWith("Io") ||
                            iconName.startsWith("Bi") ||
                            iconName.startsWith("Bs") ||
                            iconName.startsWith("Hi") ||
                            iconName.startsWith("Ai") ||
                            iconName.startsWith("Ti") ||
                            iconName.startsWith("Gi") ||
                            iconName.startsWith("Si") ||
                            iconName.startsWith("Ri") ||
                            iconName.startsWith("Tb") ||
                            iconName.startsWith("Vsc") ||
                            iconName.startsWith("Wi") ||
                            iconName.startsWith("Di") ||
                            iconName.startsWith("Im");

                          // For React Icons, use style with fontSize
                          if (isReactIcon) {
                            return (
                              <IconComponent
                                className="w-6 h-6"
                                style={{
                                  color: iconColor,
                                  fontSize: "24px",
                                  width: "24px",
                                  height: "24px",
                                }}
                              />
                            );
                          }

                          // For Lucide icons, use size prop
                          return (
                            <IconComponent
                              size={24}
                              style={{
                                color: iconColor,
                              }}
                            />
                          );
                        })()}
                      </div>
                      <div className="flex-1">
                        <h4
                          className="text-lg md:text-xl font-bold mb-2"
                          style={{
                            color:
                              mergedData.styling?.featureTitleColor ||
                              "#8b5f46",
                          }}
                        >
                          {feature.title || ""}
                        </h4>
                        <p
                          className="text-sm md:text-base leading-relaxed"
                          style={{
                            color:
                              mergedData.styling?.featureDescriptionColor ||
                              "#8b5f46",
                          }}
                        >
                          {feature.description || ""}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
