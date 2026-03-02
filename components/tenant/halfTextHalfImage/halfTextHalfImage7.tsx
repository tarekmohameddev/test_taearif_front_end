"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { useEditorT } from "@/context/editorI18nStore";
import { getDefaultHalfTextHalfImage7Data } from "@/context/editorStoreFunctions/halfTextHalfImageFunctions";
import { toDimension } from "@/lib/utils";
import { useBrandingColors } from "@/hooks/useBrandingColors";
import { useIsLiveEditor } from "@/hooks/useIsLiveEditor";
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
  // 3. FETCH TENANT DATA
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = props.useStore
    ? halfTextHalfImageStates[uniqueId] || {}
    : {};
  const currentStoreData = props.useStore
    ? getComponentData("halfTextHalfImage", uniqueId) || {}
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
            (component as any).type === "halfTextHalfImage" &&
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
            (component as any).type === "halfTextHalfImage" &&
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
    tenantComponentData,
    props,
  ]);

  // ─────────────────────────────────────────────────────────
  // 6. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  // Get default data
  const defaultData = getDefaultHalfTextHalfImage7Data();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data (by comparing a key field like content.title)
  const isStoreDataDefault =
    currentStoreData?.content?.title === defaultData?.content?.title;

  // Merge data with correct priority
  // According to fixCaching.txt and makeFieldsRequireSaveChanges.txt:
  // Priority: Default → Props → Database (tenantComponentData) → Store (if not default or if no tenant data)
  // Component should read from halfTextHalfImageStates[uniqueId] (storeData) and getComponentData() (currentStoreData)
  // NOT from tempData (which is temporary and not visible until Save Changes)
  // ✅ GOOD: mergedData does NOT include tempData - only reads from saved states
  const mergedData = useMemo(
    () => ({
      ...defaultData, // 1. Defaults (lowest priority)
      ...props, // 2. Props from parent component
      // If tenantComponentData exists, use it (it's from Database)
      ...(hasTenantData ? tenantComponentData : {}), // 3. Backend data (tenant data)
      // Use currentStoreData only if it's not just default data
      // (meaning it has been updated by user) or if tenantComponentData doesn't exist
      ...(hasTenantData && isStoreDataDefault
        ? {} // Skip store data if tenant data exists and store data is default
        : {
            ...storeData, // 4a. Store data from halfTextHalfImageStates (saved data)
            ...currentStoreData, // 4b. Current store data from getComponentData (saved data)
          }),
      // ✅ tempData is NOT included - changes only appear after "Save Changes"
    }),
    [
      defaultData,
      props,
      hasTenantData,
      tenantComponentData,
      isStoreDataDefault,
      storeData,
      currentStoreData,
    ],
  );

  // ⭐ DEBUG: Log data sources (optional - remove in production)
  if (
    props.useStore &&
    typeof window !== "undefined" &&
    (window as any).__DEBUG_COMPONENT_DATA__
  ) {
    console.group("🔍 HalfTextHalfImage7 Data Sources");
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
  // 7. COLOR HELPERS
  // ─────────────────────────────────────────────────────────
  const brandingColors = useBrandingColors();
  
  // Get mainBgColor from branding (similar to useBrandingColors)
  const isLiveEditor = useIsLiveEditor();
  const editorWebsiteLayout = useEditorStore((s) => s.WebsiteLayout);
  const tenantDataFromStore = useTenantStore((s) => s.tenantData);
  
  const mainBgColor = isLiveEditor
    ? editorWebsiteLayout?.branding?.mainBgColor?.trim() || "#f5f0e8"
    : tenantDataFromStore?.WebsiteLayout?.branding?.mainBgColor?.trim() || "#f5f0e8";

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (fieldPath: string, defaultColor: string = "#8b5f46"): string => {
    const colorField = (mergedData.styling as any)?.[fieldPath];
    
    // Get useDefaultColor and globalColorType from the color field
    let useDefaultColorValue: boolean | undefined;
    let globalColorTypeValue: string | undefined;
    
    if (colorField && typeof colorField === "object" && !Array.isArray(colorField)) {
      useDefaultColorValue = colorField.useDefaultColor;
      globalColorTypeValue = colorField.globalColorType;
    }
    
    // Also check at the path level
    if (useDefaultColorValue === undefined) {
      useDefaultColorValue = (mergedData.styling as any)?.[fieldPath]?.useDefaultColor;
    }
    if (globalColorTypeValue === undefined) {
      globalColorTypeValue = (mergedData.styling as any)?.[fieldPath]?.globalColorType;
    }
    
    // Check useDefaultColor value (default is true if not specified)
    const useDefaultColor = useDefaultColorValue !== undefined ? useDefaultColorValue : true;
    
    // If useDefaultColor is true, use branding color from WebsiteLayout
    if (useDefaultColor) {
      const globalColorType = globalColorTypeValue || "primary";
      const brandingColor =
        brandingColors[globalColorType as keyof typeof brandingColors] ||
        brandingColors.primary;
      return brandingColor;
    }
    
    // If useDefaultColor is false, try to get custom color
    if (
      colorField &&
      typeof colorField === "string" &&
      colorField.trim() !== "" &&
      colorField.startsWith("#")
    ) {
      return colorField.trim();
    }
    
    // If colorField is an object, check for value property
    if (colorField && typeof colorField === "object" && !Array.isArray(colorField)) {
      if (
        colorField.value &&
        typeof colorField.value === "string" &&
        colorField.value.trim() !== "" &&
        colorField.value.startsWith("#")
      ) {
        return colorField.value.trim();
      }
    }
    
    // Final fallback: use provided default color or primary branding color
    return defaultColor || brandingColors.primary;
  };

  // Helper function to get background color based on useMainBgColor
  const getBackgroundColor = (): string => {
    const backgroundColorField = mergedData.styling?.backgroundColor;
    
    // BackgroundColorObjectRenderer saves data in this structure:
    // When useMainBgColor = true:
    //   - styling.backgroundColor.useMainBgColor = true
    // When useMainBgColor = false:
    //   - styling.backgroundColor.useMainBgColor = false
    //   - styling.backgroundColor.value = "#hexcolor" (custom color)
    
    // إذا كان backgroundColorField ليس object، استخدم default
    if (!backgroundColorField || typeof backgroundColorField !== "object" || Array.isArray(backgroundColorField)) {
      return mainBgColor || "#f5f0e8";
    }
    
    // قراءة useMainBgColor (default: true)
    const useMainBgColor = backgroundColorField.useMainBgColor !== undefined 
      ? backgroundColorField.useMainBgColor 
      : true;
    
    // إذا كان useMainBgColor = true، استخدم mainBgColor
    if (useMainBgColor) {
      return mainBgColor;
    }
    
    // إذا كان useMainBgColor = false، استخدم اللون المخصص من value
    if (
      backgroundColorField.value &&
      typeof backgroundColorField.value === "string" &&
      backgroundColorField.value.trim() !== "" &&
      backgroundColorField.value.startsWith("#")
    ) {
      return backgroundColorField.value.trim();
    }
    
    // Fallback
    return mainBgColor || "#f5f0e8";
  };

  // Get all colors using helper functions
  const backgroundColor = getBackgroundColor();
  const dividerColor = getColor("dividerColor", "#8b5f46");
  const featureTitleColor = getColor("featureTitleColor", "#8b5f46");
  const featureDescriptionColor = getColor("featureDescriptionColor", "#8b5f46");
  const iconBackgroundColor = getColor("iconBackgroundColor", "#d4a574");
  const iconColor = getColor("iconColor", "#896042");

  // ─────────────────────────────────────────────────────────
  // 8. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 9. RENDER
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
        backgroundColor: backgroundColor,
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
          maxWidth: toDimension(mergedData.layout?.maxWidth, "px", "1350px"),
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
                  className="w-24 h-[2px] mb-4 mr-auto"
                  style={{
                    backgroundColor: dividerColor,
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
                          backgroundColor: iconBackgroundColor,
                        }}
                      >
                        {(() => {
                          const iconName = feature.icon || "Shield";
                          const IconComponent = getFeatureIcon(iconName);

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
                            color: featureTitleColor,
                          }}
                        >
                          {feature.title || ""}
                        </h4>
                        <p
                          className="text-sm md:text-base leading-relaxed"
                          style={{
                            color: featureDescriptionColor,
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
