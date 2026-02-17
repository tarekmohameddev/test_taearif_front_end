"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultImageTextData } from "@/context/editorStoreFunctions/imageTextFunctions";
import { useClientT } from "@/context/clientI18nStore";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface TextItem {
  type: "heading" | "paragraph" | "blockquote" | "feature";
  text: string;
  shapeType?: "plain" | "badge";
  fontSize?: number;
  color?: string;
}

interface ImageTextProps {
  // Component-specific props
  visible?: boolean;
  ThemeTwo?: string;
  backgroundImage?: string;
  texts?: TextItem[];
  overlayOpacity?: number;
  height?: number;

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// VALIDATION FUNCTION
// ═══════════════════════════════════════════════════════════
/**
 * Validates if the data structure matches the expected imageText format
 * Returns false if data has old/incompatible structure (e.g., texts as object, colors/settings fields)
 */
const isValidImageTextData = (data: any): boolean => {
  // If no data, it's invalid
  if (!data || typeof data !== "object") {
    return false;
  }

  // Check if texts exists and is an array
  if (!data.texts || !Array.isArray(data.texts)) {
    return false;
  }

  // Check if texts array has valid structure
  const hasValidTexts = data.texts.every((item: any) => {
    return (
      item &&
      typeof item === "object" &&
      typeof item.type === "string" &&
      typeof item.text === "string"
    );
  });

  if (!hasValidTexts) {
    return false;
  }

  // If data has old structure fields (colors, settings as top-level), it's invalid
  if (data.colors || data.settings) {
    return false;
  }

  // If texts is an object (old structure), it's invalid
  if (data.texts && typeof data.texts === "object" && !Array.isArray(data.texts)) {
    return false;
  }

  return true;
};

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function ImageText1(props: ImageTextProps = {}) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "imageText1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const imageTextStates = useEditorStore((s) => s.imageTextStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Translation hook
  const t = useClientT();

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Extract component data from tenantData using useState
  const [tenantComponentData, setTenantComponentData] = useState<any>({});

  useEffect(() => {
    if (!tenantData) {
      setTenantComponentData({});
      return;
    }

    let foundData = {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        // Search by id (most reliable identifier)
        if (
          component.type === "imageText" &&
          (component.id === props.id ||
            component.id === uniqueId ||
            component.componentName === variantId)
        ) {
          foundData = component.data || {};
          break;
        }
      }
    }

    // Check old structure (tenantData.componentSettings)
    if (!foundData || Object.keys(foundData).length === 0) {
      if (tenantData?.componentSettings) {
        for (const [pageSlug, pageComponents] of Object.entries(
          tenantData.componentSettings,
        )) {
          if (
            pageComponents &&
            typeof pageComponents === "object" &&
            !Array.isArray(pageComponents)
          ) {
            const componentIds = Object.keys(pageComponents);
            for (const [componentId, component] of Object.entries(
              pageComponents as any,
            )) {
              // Check if this is the exact component we're looking for by ID
              // Use componentId === props.id (most reliable identifier)
              if (
                (component as any).type === "imageText" &&
                (componentId === props.id ||
                  (component as any).id === props.id ||
                  (component as any).id === uniqueId ||
                  (component as any).componentName === variantId)
              ) {
                foundData = (component as any).data || {};
                break;
              }
            }
          }
          // Also handle array format
          if (Array.isArray(pageComponents)) {
            for (const component of pageComponents) {
              // Search by id (most reliable identifier)
              if (
                (component as any).type === "imageText" &&
                ((component as any).id === props.id ||
                  (component as any).id === uniqueId)
              ) {
                foundData = (component as any).data || {};
                break;
              }
            }
          }
        }
      }
    }

    setTenantComponentData(foundData);
  }, [tenantData, variantId, props.id]);

  useEffect(() => {
    if (props.useStore) {
      // ✅ Validate data before using it
      const isValidData =
        tenantComponentData &&
        Object.keys(tenantComponentData).length > 0 &&
        isValidImageTextData(tenantComponentData);

      const initialData = isValidData
        ? {
            ...getDefaultImageTextData(),
            ...tenantComponentData, // Database data takes priority (only if valid)
            ...props,
          }
        : {
            ...getDefaultImageTextData(), // Use default data if invalid
            ...props,
          };

      // Initialize in store
      ensureComponentVariant("imageText", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = props.useStore ? imageTextStates[uniqueId] || {} : {};
  const currentStoreData = props.useStore
    ? getComponentData("imageText", uniqueId) || {}
    : {};

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  // Get default data
  const defaultData = getDefaultImageTextData();

  // Check if tenantComponentData exists and is valid
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0 &&
    isValidImageTextData(tenantComponentData);

  // Check if currentStoreData is valid
  const isStoreDataValid =
    currentStoreData &&
    Object.keys(currentStoreData).length > 0 &&
    isValidImageTextData(currentStoreData);

  // Check if currentStoreData is just default data (by comparing a key field like texts[0].text)
  const isStoreDataDefault =
    currentStoreData?.texts?.[0]?.text === defaultData?.texts?.[0]?.text;

  // Merge data with correct priority
  // IMPORTANT: 
  // - When useStore = false (client-side): Use tenantComponentData if valid, otherwise default data
  // - When useStore = true (Live Editor): currentStoreData (saved data) has highest priority after save (only if valid)
  // - tenantComponentData (backend data) is only used if currentStoreData is default AND data is valid
  // - If both are invalid, use default data
  // - tempData is NOT included here - changes only appear after "Save Changes" button
  const mergedData = {
    ...defaultData, // 1. Defaults (lowest priority - always included)
    ...props, // 2. Props from parent component
    // When useStore = false (client-side): Use tenantComponentData if valid
    // When useStore = true (Live Editor): Use store data logic
    ...(props.useStore
      ? // Live Editor mode: Use store data logic
        hasTenantData && isStoreDataDefault && isStoreDataValid
        ? tenantComponentData
        : isStoreDataValid
          ? currentStoreData
          : {}
      : // Client-side mode: Use tenantComponentData if valid, otherwise default data
        hasTenantData
        ? tenantComponentData
        : {}), // 3. Backend data OR saved data (only if valid), otherwise empty (default data already spread)
  };

  // ─────────────────────────────────────────────────────────
  // GET BRANDING COLORS
  // ─────────────────────────────────────────────────────────
  // Get branding colors from WebsiteLayout (fallback to emerald-600)
  const brandingColors = {
    primary:
      tenantData?.WebsiteLayout?.branding?.colors?.primary &&
      tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.primary
        : "#059669", // emerald-600 fallback
    secondary:
      tenantData?.WebsiteLayout?.branding?.colors?.secondary &&
      tenantData.WebsiteLayout.branding.colors.secondary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.secondary
        : "#059669", // fallback
    accent:
      tenantData?.WebsiteLayout?.branding?.colors?.accent &&
      tenantData.WebsiteLayout.branding.colors.accent.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.accent
        : "#059669", // fallback
  };

  // ─────────────────────────────────────────────────────────
  // HELPER FUNCTION: Get Background Color
  // ─────────────────────────────────────────────────────────
  // Helper function to get background color based on useDefaultColor and globalColorType
  // Supports: transparent (empty string), custom color, or primary color
  const getBackgroundColor = (): string | null => {
    const colorField = mergedData?.background?.color;

    // Get useDefaultColor and globalColorType from the color field
    let useDefaultColorValue: boolean | undefined;
    let globalColorTypeValue: string | undefined;

    if (colorField && typeof colorField === "object" && !Array.isArray(colorField)) {
      useDefaultColorValue = colorField.useDefaultColor;
      globalColorTypeValue = colorField.globalColorType;
    }

    // Also check at the path level (ColorObjectRenderer stores them separately)
    if (useDefaultColorValue === undefined) {
      useDefaultColorValue = mergedData?.background?.color?.useDefaultColor;
    }
    if (globalColorTypeValue === undefined) {
      globalColorTypeValue = mergedData?.background?.color?.globalColorType;
    }

    // Check useDefaultColor value (default is false for custom color/transparent)
    const useDefaultColor = useDefaultColorValue !== undefined ? useDefaultColorValue : false;

    // If useDefaultColor is true, use branding color from WebsiteLayout
    if (useDefaultColor) {
      const globalColorType = (globalColorTypeValue || "primary") as keyof typeof brandingColors;
      const brandingColor = brandingColors[globalColorType] || brandingColors.primary;
      return brandingColor;
    }

    // If useDefaultColor is false, try to get custom color
    // Empty string or null = transparent
    if (
      colorField &&
      typeof colorField === "string" &&
      colorField.trim() !== ""
    ) {
      // If it's a valid hex color, return it
      if (colorField.startsWith("#")) {
        return colorField.trim();
      }
      // If empty string, return null for transparent
      return null;
    }

    // If colorField is an object, check for value property
    if (colorField && typeof colorField === "object" && !Array.isArray(colorField)) {
      if (
        colorField.value &&
        typeof colorField.value === "string" &&
        colorField.value.trim() !== ""
      ) {
        if (colorField.value.startsWith("#")) {
          return colorField.value.trim();
        }
        return null; // Empty value = transparent
      }
    }

    // Final fallback: transparent (null)
    return null;
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
  // Get background type (image or color)
  const backgroundType = mergedData.background?.type || "image";

  // Get background color and opacity (only if type is "color")
  const bgColor = backgroundType === "color" ? getBackgroundColor() : null;
  const bgOpacity = mergedData.background?.opacity ?? 1;

  // Calculate background color style (only for color type)
  const backgroundColorStyle: React.CSSProperties = {};
  if (backgroundType === "color") {
    if (bgColor) {
      // If color exists, apply it with opacity
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      backgroundColorStyle.backgroundColor = `rgba(${r}, ${g}, ${b}, ${bgOpacity})`;
    } else if (bgOpacity < 1) {
      // If transparent but opacity is less than 1, apply black with opacity
      backgroundColorStyle.backgroundColor = `rgba(0, 0, 0, ${bgOpacity})`;
    }
    // If bgColor is null and bgOpacity is 1, background is fully transparent (no style needed)
  }

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{
        height: `${mergedData.styling?.height ?? 500}px`,
      }}
    >
      {/* Background Color Layer (only if type is "color") */}
      {backgroundType === "color" && (bgColor || bgOpacity < 1) && (
        <div
          className="absolute inset-0 z-0"
          style={backgroundColorStyle}
        />
      )}

      {/* Background Image (only if type is "image") */}
      {backgroundType === "image" && mergedData.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={
              mergedData.backgroundImage ||
              "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80"
            }
            alt={t("components.imageText.alt_text")}
            fill
            className="object-cover brightness-50"
            priority
            sizes="100vw"
          />
          {/* Dark Overlay for better text readability */}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: mergedData.overlayOpacity || 0.3 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center text-white space-y-6 md:space-y-8">
          {mergedData.texts &&
            Array.isArray(mergedData.texts) &&
            (() => {
              const elements: React.ReactNode[] = [];
              let currentFeatureGroup: TextItem[] = [];

              const getStyle = (item: TextItem) => {
                const style: React.CSSProperties = {};
                if (item.fontSize) style.fontSize = `${item.fontSize}px`;
                if (item.color) style.color = item.color;
                return style;
              };

              const flushFeatures = (startIndex: number) => {
                if (currentFeatureGroup.length > 0) {
                  elements.push(
                    <div
                      key={`feature-group-${startIndex}`}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 pt-4 w-full"
                    >
                      {currentFeatureGroup.map((feat, fIdx) => {
                        const isBadge = feat.shapeType === "badge";
                        return (
                          <div
                            key={fIdx}
                            style={getStyle(feat)}
                            className={`flex items-center justify-center gap-3 text-base md:text-lg lg:text-xl leading-relaxed text-white/95 transition-all duration-300 ${
                              isBadge
                                ? "bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-xl w-full h-full hover:bg-white/20 hover:scale-[1.02]"
                                : "w-full py-2"
                            }`}
                          >
                            {!isBadge && (
                              <span 
                                className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] flex-shrink-0" 
                                style={{ backgroundColor: feat.color || "white" }}
                              />
                            )}
                            <span className="font-medium">{feat.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                  currentFeatureGroup = [];
                }
              };

              mergedData.texts.forEach((item, index) => {
                if (item.type === "feature") {
                  currentFeatureGroup.push(item);
                } else {
                  flushFeatures(index - currentFeatureGroup.length);
                  if (item.type === "heading") {
                    elements.push(
                      <h3
                        key={index}
                        style={getStyle(item)}
                        className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                      >
                        {item.text}
                      </h3>
                    );
                  } else if (item.type === "paragraph") {
                    elements.push(
                      <div
                        key={index}
                        style={getStyle(item)}
                        className="text-base md:text-lg lg:text-xl leading-relaxed text-white/95"
                      >
                        <p className="whitespace-pre-line">{item.text}</p>
                      </div>
                    );
                  } else if (item.type === "blockquote") {
                    elements.push(
                      <blockquote
                        key={index}
                        style={getStyle(item)}
                        className="border-r-0 border-l-0 border-t-0 border-b-0 pt-6 md:pt-8"
                      >
                        <p className="text-base md:text-lg lg:text-xl leading-relaxed text-white/95 italic">
                          {item.text}
                        </p>
                      </blockquote>
                    );
                  }
                }
              });

              flushFeatures(mergedData.texts.length - currentFeatureGroup.length);
              return elements;
            })()}
        </div>
      </div>
    </section>
  );
}
