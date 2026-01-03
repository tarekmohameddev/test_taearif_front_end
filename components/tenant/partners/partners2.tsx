"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultPartners2Data } from "@/context/editorStoreFunctions/partnersFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface Partners2Props {
  // Component-specific props
  visible?: boolean;
  layout?: {
    maxWidth?: string;
    padding?: {
      top?: string;
      bottom?: string;
    };
    columns?: number;
    rows?: number;
    gap?: string;
    cardsPerSlide?: number;
  };
  content?: {
    title?: string;
    subtitle?: string;
    badge?: string;
  };
  partners?: Array<{
    id?: string;
    src: string;
    alt?: string;
    logoDark?: string;
    logoLight?: string;
    link?: string;
  }>;
  settings?: {
    autoplay?: boolean;
    intervalMs?: number;
    showBadge?: boolean;
    animation?: boolean;
  };
  styling?: {
    backgroundColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    badgeColor?: string;
    paginationActive?: string;
    paginationInactive?: string;
  };
  typography?: any;

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function Partners2(props: Partners2Props = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "partners2";
  const uniqueId = props.id || variantId;

  // Subscribe to editor store updates for this partners variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const partnersStates = useEditorStore((s) => s.partnersStates);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData) {
      return {};
    }

    // First, check if data comes directly from API response (new structure)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "partners" &&
          component.componentName === variantId
        ) {
          return component.data;
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
              (component as any).type === "partners" &&
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

  useEffect(() => {
    if (props.useStore) {
      // If we have tenant data, use it; otherwise use props or defaults
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultPartners2Data(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultPartners2Data(),
              ...props,
            };
      ensureComponentVariant("partners", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("partners", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore ? partnersStates[uniqueId] || {} : {};

  // Get branding colors from WebsiteLayout (fallback to emerald-600)
  const brandingColors = {
    primary:
      tenantData?.WebsiteLayout?.branding?.colors?.primary &&
      tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.primary
        : "#059669",
    secondary:
      tenantData?.WebsiteLayout?.branding?.colors?.secondary &&
      tenantData.WebsiteLayout.branding.colors.secondary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.secondary
        : "#059669",
    accent:
      tenantData?.WebsiteLayout?.branding?.colors?.accent &&
      tenantData.WebsiteLayout.branding.colors.accent.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.accent
        : "#059669",
  };

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const defaultData = getDefaultPartners2Data();
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
      ...(tenantComponentData.content || {}),
      ...(storeData.content || {}),
      ...(currentStoreData.content || {}),
    },
    layout: {
      ...defaultData.layout,
      ...(props.layout || {}),
      ...(tenantComponentData.layout || {}),
      ...(storeData.layout || {}),
      ...(currentStoreData.layout || {}),
      padding: {
        ...defaultData.layout?.padding,
        ...(props.layout?.padding || {}),
        ...(tenantComponentData.layout?.padding || {}),
        ...(storeData.layout?.padding || {}),
        ...(currentStoreData.layout?.padding || {}),
      },
    },
    settings: {
      ...defaultData.settings,
      ...(props.settings || {}),
      ...(tenantComponentData.settings || {}),
      ...(storeData.settings || {}),
      ...(currentStoreData.settings || {}),
    },
    styling: {
      ...defaultData.styling,
      ...(props.styling || {}),
      ...(tenantComponentData.styling || {}),
      ...(storeData.styling || {}),
      ...(currentStoreData.styling || {}),
    },
    typography: {
      ...defaultData.typography,
      ...(props.typography || {}),
      ...(tenantComponentData.typography || {}),
      ...(storeData.typography || {}),
      ...(currentStoreData.typography || {}),
      title: {
        ...defaultData.typography?.title,
        ...(props.typography?.title || {}),
        ...(tenantComponentData.typography?.title || {}),
        ...(storeData.typography?.title || {}),
        ...(currentStoreData.typography?.title || {}),
        fontSize: {
          ...defaultData.typography?.title?.fontSize,
          ...(props.typography?.title?.fontSize || {}),
          ...(tenantComponentData.typography?.title?.fontSize || {}),
          ...(storeData.typography?.title?.fontSize || {}),
          ...(currentStoreData.typography?.title?.fontSize || {}),
        },
      },
      subtitle: {
        ...defaultData.typography?.subtitle,
        ...(props.typography?.subtitle || {}),
        ...(tenantComponentData.typography?.subtitle || {}),
        ...(storeData.typography?.subtitle || {}),
        ...(currentStoreData.typography?.subtitle || {}),
        fontSize: {
          ...defaultData.typography?.subtitle?.fontSize,
          ...(props.typography?.subtitle?.fontSize || {}),
          ...(tenantComponentData.typography?.subtitle?.fontSize || {}),
          ...(storeData.typography?.subtitle?.fontSize || {}),
          ...(currentStoreData.typography?.subtitle?.fontSize || {}),
        },
      },
    },
    // Partners array - use the one with highest priority
    partners:
      props?.partners ||
      tenantComponentData?.partners ||
      storeData?.partners ||
      currentStoreData?.partners ||
      defaultData.partners,
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669",
  ): string => {
    const styling = mergedData?.styling || {};
    const colors = styling?.colors || mergedData?.colors || {};

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

    const useDefaultColor =
      useDefaultColorValue !== undefined ? useDefaultColorValue : true;

    if (useDefaultColor) {
      let defaultGlobalColorType = "primary";
      if (fieldPath.includes("titleColor")) {
        defaultGlobalColorType = "primary";
      } else if (
        fieldPath.includes("subtitleColor") ||
        fieldPath.includes("descriptionColor") ||
        fieldPath.includes("textColor")
      ) {
        defaultGlobalColorType = "secondary";
      }

      const globalColorType = globalColorTypeValue || defaultGlobalColorType;
      const brandingColor =
        brandingColors[globalColorType as keyof typeof brandingColors] ||
        defaultColor;
      return brandingColor;
    }

    if (typeof fieldData === "string" && fieldData.startsWith("#")) {
      return fieldData;
    }

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

    let defaultGlobalColorType = "primary";
    if (fieldPath.includes("titleColor")) {
      defaultGlobalColorType = "primary";
    } else if (
      fieldPath.includes("subtitleColor") ||
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

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(
    mergedData.layout?.cardsPerSlide || 16,
  );
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { theme } = useTheme();
  const pathname = usePathname();

  // Touch/Mouse tracking refs
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const currentX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    // Update cards per slide based on component data and screen size
    const updateCardsPerSlide = () => {
      const baseCardsPerSlide = mergedData.layout?.cardsPerSlide || 16;
      if (window.innerWidth < 640) {
        setCardsPerSlide(Math.min(baseCardsPerSlide, 12)); // Mobile limit
      } else {
        setCardsPerSlide(baseCardsPerSlide);
      }
    };
    updateCardsPerSlide();
    window.addEventListener("resize", updateCardsPerSlide);
    return () => window.removeEventListener("resize", updateCardsPerSlide);
  }, [mergedData.layout?.cardsPerSlide]);

  // Use partners from merged data
  const allPartners = mergedData.partners || [];

  // Ensure we have at least 4 partners for the slider
  const partners: Array<{
    id?: string;
    src: string;
    alt?: string;
    logoDark?: string;
    logoLight?: string;
    link?: string;
  }> =
    allPartners.length >= 4
      ? allPartners
      : Array.from(
          { length: Math.max(4, allPartners.length || 32) },
          (_, i) => ({
            id: allPartners[i]?.id || `partner-${i + 1}`,
            src: allPartners[i]?.src || `/images/placeholder.svg`,
            alt: allPartners[i]?.alt || `Partner Logo ${i + 1}`,
            logoDark: allPartners[i]?.logoDark,
            logoLight: allPartners[i]?.logoLight,
            link: allPartners[i]?.link,
          }),
        );

  // Split into slides based on cardsPerSlide
  const partnerSlides: Array<typeof partners> = [];
  for (let i = 0; i < partners.length; i += cardsPerSlide) {
    partnerSlides.push(partners.slice(i, i + cardsPerSlide));
  }

  // Auto-advance the slider
  useEffect(() => {
    if (!mergedData.settings?.autoplay) return;

    const interval = setInterval(() => {
      if (isRTL) {
        setCurrentSlide((prev) =>
          prev === 0 ? partnerSlides.length - 1 : prev - 1,
        );
      } else {
        setCurrentSlide((prev) =>
          prev === partnerSlides.length - 1 ? 0 : prev + 1,
        );
      }
    }, mergedData.settings?.intervalMs || 5000);

    return () => clearInterval(interval);
  }, [
    partnerSlides.length,
    isRTL,
    mergedData.settings?.autoplay,
    mergedData.settings?.intervalMs,
  ]);

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Calculate transform based on direction
  const getTransform = (): string => {
    if (isRTL) {
      return `translateX(${currentSlide * 100}%)`;
    }
    return `translateX(-${currentSlide * 100}%)`;
  };

  // Touch/Mouse event handlers
  const handleStart = (clientX: number) => {
    startX.current = clientX;
    currentX.current = clientX;
    isDragging.current = true;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current) return;
    currentX.current = clientX;
  };

  const handleEnd = () => {
    if (
      !isDragging.current ||
      startX.current === null ||
      currentX.current === null
    )
      return;

    const diff = startX.current - currentX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left
        if (isRTL) {
          setCurrentSlide((prev) =>
            prev === 0 ? partnerSlides.length - 1 : prev - 1,
          );
        } else {
          setCurrentSlide((prev) =>
            prev === partnerSlides.length - 1 ? 0 : prev + 1,
          );
        }
      } else {
        // Swiped right
        if (isRTL) {
          setCurrentSlide((prev) =>
            prev === partnerSlides.length - 1 ? 0 : prev + 1,
          );
        } else {
          setCurrentSlide((prev) =>
            prev === 0 ? partnerSlides.length - 1 : prev - 1,
          );
        }
      }
    }

    isDragging.current = false;
    startX.current = null;
    currentX.current = null;
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) =>
    handleStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    handleMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleEnd();

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleMouseUp = () => handleEnd();
  const handleMouseLeave = () => handleEnd();

  // Render slide content
  const renderSlide = (
    slide: Array<(typeof partners)[number]>,
    slideIndex: number,
  ) => {
    const isDark = theme === "dark";

    // Dynamic grid classes based on layout settings
    const columns = mergedData.layout?.columns || 4;
    const rows = mergedData.layout?.rows || 4;
    const gap = mergedData.layout?.gap || "2";

    const slideContent = (
      <div key={slideIndex} className="w-full flex-shrink-0">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: `${gap}rem`,
          }}
        >
          {slide.map((partner, logoIndex) => {
            // Determine logo source based on theme
            let logoSrc: string;
            if (isDark && partner.logoDark) {
              logoSrc = partner.logoDark;
            } else if (!isDark && partner.logoLight) {
              logoSrc = partner.logoLight;
            } else {
              logoSrc = partner.src || "/images/placeholder.svg";
            }

            const logoElement = (
              <div
                key={logoIndex}
                className="group bg-gray-100 dark:bg-[#494949] rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 flex items-center justify-center h-24 sm:h-32 md:h-24 lg:h-36"
              >
                <Image
                  src={logoSrc}
                  alt={partner.alt || `Partner Logo ${logoIndex + 1}`}
                  width={200}
                  height={200}
                  className="max-h-12 md:max-h-14 lg:max-h-16 w-auto object-contain"
                  loading="eager"
                  unoptimized={true}
                />
              </div>
            );

            if (mergedData.settings?.animation && slideIndex === currentSlide) {
              return (
                <motion.div
                  key={logoIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: logoIndex * 0.05,
                    ease: "easeOut",
                  }}
                >
                  {logoElement}
                </motion.div>
              );
            }

            return logoElement;
          })}
        </div>
      </div>
    );

    return slideContent;
  };

  // Get colors
  const titleColor = getColor("titleColor", brandingColors.primary);
  const subtitleColor = mergedData.styling?.subtitleColor || "#2F2E0C";
  const badgeColor = mergedData.styling?.badgeColor || "#004B4B";
  const paginationActive = mergedData.styling?.paginationActive || "#00D1D1";
  const paginationInactive =
    mergedData.styling?.paginationInactive || "#6B7280";
  const backgroundColor = mergedData.styling?.backgroundColor || "transparent";

  const headerContent = (
    <div className="text-center mb-4">
      {mergedData.settings?.showBadge && (
        <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
          <div
            className="py-1 px-3 text-xs sm:text-sm font-medium"
            style={{ color: badgeColor }}
          >
            {mergedData.content?.badge || "— عملاءنا —"}
          </div>
        </div>
      )}

      <h2
        className="text-2xl sm:text-3xl heading font-bold mb-2"
        style={{
          color: titleColor,
          fontWeight: mergedData.typography?.title?.fontWeight || "bold",
          fontFamily: mergedData.typography?.title?.fontFamily || "Tajawal",
          lineHeight: mergedData.typography?.title?.lineHeight || "tight",
        }}
      >
        <span>{mergedData.content?.title || "عملاءنا"}</span>
      </h2>

      <p
        className="font-normal subheading"
        style={{
          color: subtitleColor,
          fontWeight: mergedData.typography?.subtitle?.fontWeight || "normal",
          fontFamily: mergedData.typography?.subtitle?.fontFamily || "Tajawal",
          lineHeight: mergedData.typography?.subtitle?.lineHeight || "relaxed",
        }}
      >
        {mergedData.content?.subtitle ||
          "تنال خدماتنا ثقة الـمؤسسات التي تعتمد علينا في تقديم إنتاج إعلامي مؤثر وموثوق."}
      </p>
    </div>
  );

  const sliderContent = (
    <>
      <div
        ref={containerRef}
        className="relative overflow-hidden active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: getTransform(),
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          {partnerSlides.map((slide, slideIndex) =>
            renderSlide(slide, slideIndex),
          )}
        </div>
      </div>

      {/* Pagination dots */}
      <div
        className="flex justify-center mt-6 sm:mt-8 gap-2"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {partnerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="relative transition-all rounded-full focus:outline-none h-2"
            style={{
              width: currentSlide === index ? "32px" : "8px",
              backgroundColor:
                currentSlide === index ? paginationActive : paginationInactive,
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  );

  if (mergedData.settings?.animation) {
    return (
      <section
        id={`partners-${uniqueId}`}
        className={
          (pathname !== "/"
            ? "py-8 sm:py-12 md:py-16"
            : "pb-8 sm:pb-12 md:pb-16") + " bg-white"
        }
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          backgroundColor:
            backgroundColor === "transparent" ? "transparent" : backgroundColor,
          paddingTop: mergedData.layout?.padding?.top || "5rem",
          paddingBottom: mergedData.layout?.padding?.bottom || "5rem",
        }}
      >
        <div
          className="container mx-auto px-4"
          style={{
            maxWidth: mergedData.layout?.maxWidth || "1600px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {headerContent}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {sliderContent}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={`partners-${uniqueId}`}
      className={
        (pathname !== "/" ? "py-8 sm:py-12 " : "pb-8 sm:pb-12 md:pb-16") +
        " dark:bg-black bg-white"
      }
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        backgroundColor:
          backgroundColor === "transparent" ? "transparent" : backgroundColor,
        paddingTop: mergedData.layout?.padding?.top || "5rem",
        paddingBottom: mergedData.layout?.padding?.bottom || "5rem",
      }}
    >
      <div
        className="container mx-auto px-4"
        style={{
          maxWidth: mergedData.layout?.maxWidth || "1600px",
        }}
      >
        {headerContent}
        {sliderContent}
      </div>
    </section>
  );
}
