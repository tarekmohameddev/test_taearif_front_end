"use client";

import { useEffect } from "react";
import SwiperCarousel from "@/components/ui/swiper-carousel";
import { TestimonialCard } from "@/components/testimonial-card";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  location: string;
  rating: number;
};

// Default testimonials data
const getDefaultTestimonialsData = () => ({
  visible: true,
  title: "آراء عملائنا",
  description:
    "نحن نفخر بشركائنا وعملائنا ونسعى دائمًا لتقديم أفضل الحلول التي تدعم نموهم ونجاحهم.",
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
    paddingY: "py-14 sm:py-16",
    marginBottom: "mb-8",
  },
  header: {
    alignment: "text-center md:text-right",
    maxWidth: "mx-auto px-5 sm:px-26",
    title: {
      className: "section-title",
      color: "#1f2937",
      size: "text-3xl sm:text-4xl",
      weight: "font-bold",
    },
    description: {
      className: "section-subtitle-large",
      color: "#6b7280",
      size: "text-lg",
      weight: "font-normal",
    },
  },
  carousel: {
    desktopCount: 3,
    space: 20,
    autoplay: true,
    showPagination: true,
    loop: true,
    slideHeight: {
      mobile: "!h-[260px]",
      tablet: "sm:!h-[220px]",
      desktop: "md:!h-[240px]",
      largeDesktop: "lg:!h-[260px]",
    },
  },
  testimonials: [
    {
      id: "t1",
      quote:
        "الموقع متعوب عليه وواضح أن فيه شغل احترافي وجهد كبير، إن شاء الله تتوسعون أكثر وتغطون عقارات السعودية بشكل كامل.",
      name: "أريام",
      location: "السعودية",
      rating: 5,
    },
    {
      id: "t2",
      quote:
        "أخلاق عالية وسعر ممتاز، ورجل نصوح. الله يجزاك الله خير أبو سليمان. تجربة رائعة وأنصح بها.",
      name: "عبدالعزيز الحمد السايح",
      location: "عيون الجواء",
      rating: 5,
    },
    {
      id: "t3",
      quote:
        "أخلاق جدا عالية رب يرحم الله أبو طارق. تعامل راقٍ وسرعة في الإنجاز.",
      name: "بندر الحربي",
      location: "المرقب",
      rating: 5,
    },
    {
      id: "t4",
      quote:
        "خدمة ممتازة وفريق متعاون. سهّلوا علينا إجراءات التأجير بشكل كبير.",
      name: "محمد العتيبي",
      location: "الرياض",
      rating: 4,
    },
  ],
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: "rounded-2xl",
    shadow: "shadow-sm",
    padding: "p-6",
    minHeight: "h-[200px]",
    quoteIcon: {
      color: "#059669",
      size: "w-[34px] h-[27px]",
      position: "top-[-15px] left-0",
    },
    text: {
      color: "#374151",
      size: "text-md",
      lineHeight: "leading-6",
      maxLines: "line-clamp-3",
    },
    footer: {
      marginTop: "mt-auto",
      paddingTop: "pt-3",
      customerInfo: {
        nameColor: "#111827",
        nameWeight: "font-extrabold",
        locationColor: "#6b7280",
      },
      rating: {
        activeColor: "#fbbf24",
        inactiveColor: "#d1d5db",
        size: "size-3",
      },
    },
  },
  pagination: {
    bulletWidth: "12px",
    bulletHeight: "12px",
    bulletColor: "#6b7280",
    bulletOpacity: "1",
    bulletMargin: "0 4px",
    activeBulletWidth: "32px",
    activeBulletColor: "#059669",
    activeBulletBorderRadius: "6px",
    paginationBottom: "-40px",
  },
  responsive: {
    mobileSlides: 1,
    tabletSlides: 2,
    desktopSlides: 3,
    largeDesktopSlides: 3,
  },
  animations: {
    cards: {
      enabled: true,
      type: "fade-in",
      duration: 500,
      delay: 100,
    },
    header: {
      enabled: true,
      type: "slide-up",
      duration: 600,
      delay: 200,
    },
  },
});

interface TestimonialsProps {
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
    marginBottom?: string;
  };
  header?: {
    alignment?: string;
    maxWidth?: string;
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
    };
  };
  carousel?: {
    desktopCount?: number;
    space?: number;
    autoplay?: boolean;
    showPagination?: boolean;
    loop?: boolean;
    slideHeight?: {
      mobile?: string;
      tablet?: string;
      desktop?: string;
      largeDesktop?: string;
    };
  };
  testimonials?: Testimonial[];
  card?: {
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    shadow?: string;
    padding?: string;
    minHeight?: string;
    quoteIcon?: {
      color?: string;
      size?: string;
      position?: string;
    };
    text?: {
      color?: string;
      size?: string;
      lineHeight?: string;
      maxLines?: string;
    };
    footer?: {
      marginTop?: string;
      paddingTop?: string;
      customerInfo?: {
        nameColor?: string;
        nameWeight?: string;
        locationColor?: string;
      };
      rating?: {
        activeColor?: string;
        inactiveColor?: string;
        size?: string;
      };
    };
  };
  pagination?: {
    bulletWidth?: string;
    bulletHeight?: string;
    bulletColor?: string;
    bulletOpacity?: string;
    bulletMargin?: string;
    activeBulletWidth?: string;
    activeBulletColor?: string;
    activeBulletBorderRadius?: string;
    paginationBottom?: string;
  };
  responsive?: {
    mobileSlides?: number;
    tabletSlides?: number;
    desktopSlides?: number;
    largeDesktopSlides?: number;
  };
  animations?: {
    cards?: {
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

export default function TestimonialsSection(props: TestimonialsProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "testimonials1";

  // Subscribe to editor store updates for this testimonials variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("testimonials", variantId, props);
    }
  }, [variantId, props.useStore, ensureComponentVariant]);

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
    ? getComponentData("testimonials", variantId) || {}
    : {};

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) return {};

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
          if (
            (component as any).type === "testimonials" &&
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
  // Merge data with priority: storeData > tenantComponentData > props > default
  const mergedData = {
    ...getDefaultTestimonialsData(),
    ...props,
    ...tenantComponentData,
    ...storeData,
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
        : "#059669", // fallback to primary
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669",
  ): string => {
    // Get styling data from mergedData
    const styling = mergedData?.styling || {};
    const header = mergedData?.header || {};

    // Navigate to the field using the path
    let fieldData: any = undefined;

    // Check if path starts with specific prefixes
    if (fieldPath === "header.titleColor") {
      // Check styling.header.titleColor first, then header.title.color
      fieldData = styling?.header?.titleColor || header?.title?.color;
    } else if (fieldPath === "header.descriptionColor") {
      // Check styling.header.descriptionColor first, then header.description.color
      fieldData =
        styling?.header?.descriptionColor || header?.description?.color;
    } else if (fieldPath === "quoteIcon.color") {
      // Check styling.quoteIcon.color first, then card.quoteIcon.color
      fieldData =
        styling?.quoteIcon?.color || mergedData?.card?.quoteIcon?.color;
    } else if (fieldPath === "pagination.bulletColor") {
      // Check pagination.bulletColor
      fieldData = mergedData?.pagination?.bulletColor;
    } else if (fieldPath === "pagination.activeBulletColor") {
      // Check pagination.activeBulletColor
      fieldData = mergedData?.pagination?.activeBulletColor;
    } else {
      // Navigate from styling root
      const pathParts = fieldPath.split(".");
      fieldData = styling;
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
      fieldPath.includes("titleColor") ||
      fieldPath.includes("descriptionColor") ||
      fieldPath.includes("textColor") ||
      fieldPath.includes("Text") ||
      fieldPath.includes("title.color") ||
      fieldPath.includes("description.color")
    ) {
      defaultGlobalColorType = "secondary";
    } else if (
      fieldPath.includes("quoteIcon") ||
      fieldPath.includes("icon") ||
      fieldPath.includes("Icon") ||
      fieldPath.includes("activeBulletColor") ||
      fieldPath.includes("bulletColor")
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

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Get colors using getColor function
  const titleColor = getColor("header.titleColor", brandingColors.secondary);
  const descriptionColor = getColor(
    "header.descriptionColor",
    brandingColors.secondary,
  );
  const quoteIconColor = getColor("quoteIcon.color", brandingColors.primary);
  // Pagination bullet color is usually custom (gray), so use direct value or fallback
  const paginationBulletColor =
    mergedData?.pagination?.bulletColor || "#6b7280";
  const paginationActiveBulletColor = getColor(
    "pagination.activeBulletColor",
    brandingColors.primary,
  );

  return (
    <section
      className="w-full bg-background py-14 sm:py-16"
      style={{
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          "transparent",
      }}
    >
      <div
        className="w-full"
        dir="rtl"
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
        <header className="mb-8 text-center md:text-right mx-auto px-5 sm:px-26">
          <h2
            className="section-title"
            style={{
              color: titleColor,
            }}
          >
            {mergedData.title}
          </h2>
          <p
            className="section-subtitle-large"
            style={{
              color: descriptionColor,
            }}
          >
            {mergedData.description}
          </p>
        </header>

        <div className="testimonials-swiper">
          <SwiperCarousel
            desktopCount={mergedData.carousel?.desktopCount || 3}
            // توحيد ارتفاع السلايد للشهادات
            slideClassName="!h-[260px] sm:!h-[220px] md:!h-[240px] lg:!h-[260px]"
            items={
              mergedData.testimonials?.map((t: any) => (
                <div key={t.id} className="h-full w-full">
                  <TestimonialCard t={t} quoteIconColor={quoteIconColor} />
                </div>
              )) || []
            }
            space={mergedData.carousel?.space || 20}
            autoplay={mergedData.carousel?.autoplay || true}
            showPagination={mergedData.carousel?.showPagination || true}
          />
        </div>
      </div>

      <style jsx>{`
        .testimonials-swiper :global(.swiper-pagination-bullet) {
          width: ${mergedData.pagination?.bulletWidth || "12px"};
          height: ${mergedData.pagination?.bulletHeight || "12px"};
          background: ${paginationBulletColor};
          opacity: ${mergedData.pagination?.bulletOpacity || "1"};
          margin: ${mergedData.pagination?.bulletMargin || "0 4px"};
        }

        .testimonials-swiper :global(.swiper-pagination-bullet-active) {
          width: ${mergedData.pagination?.activeBulletWidth || "32px"};
          height: ${mergedData.pagination?.bulletHeight || "12px"};
          border-radius: ${mergedData.pagination?.activeBulletBorderRadius ||
          "6px"};
          background: ${paginationActiveBulletColor};
        }

        .testimonials-swiper :global(.swiper-pagination) {
          bottom: ${mergedData.pagination?.paginationBottom || "-40px"};
        }
      `}</style>
    </section>
  );
}
