"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import SwiperCarousel from "@/components/ui/swiper-carousel";
import { PropertyCard } from "@/components/tenant/cards/card1";
import PropertyCard2 from "@/components/tenant/cards/card2";
import PropertyCard3 from "@/components/tenant/cards/card3";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { useTenantId } from "@/hooks/useTenantId";
import { toDimension } from "@/lib/utils";

/**
 * PropertySlider Component
 *
 * Supports both Properties and Projects data sources:
 * - Properties: /v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10
 * - Properties: /v1/tenant-website/{tenantId}/properties?purpose=sale&latest=1&limit=10
 * - Projects: /v1/tenant-website/{tenantId}/projects?featured=1&limit=10
 *
 * The component automatically detects the data source type and handles different response formats.
 */

type Property = {
  id: string;
  slug: string;
  title: string;
  district: string;
  price: string;
  views: number;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  transactionType: string;
  image: string;
  status: string;
  createdAt: string;
  description: string;
  features: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
};

// Default data for the component
const getDefaultPropertySliderData = () => ({
  visible: true,
  layout: {
    maxWidth: "1600px",
    padding: {
      top: "56px",
      bottom: "56px",
    },
  },
  spacing: {
    titleBottom: "24px",
    slideGap: "16px",
  },
  content: {
    showTitle: true,
    showDescription: true,
    title: "أحدث العقارات للإيجار",
    description: "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع",
    viewAllText: "عرض الكل",
    viewAllUrl: "#",
  },
  typography: {
    title: {
      fontSize: { desktop: 24, tablet: 20, mobile: 18 },
      color: "#1f2937",
      extraSettings: {
        fontWeight: "extrabold",
        letterSpacing: "0",
        marginBottom: "8px",
      },
    },
    subtitle: {
      fontSize: { desktop: 18, tablet: 16, mobile: 14 },
      color: "#6b7280",
      extraSettings: {
        fontWeight: "normal",
        letterSpacing: "0",
        marginTop: "0",
        marginBottom: "0",
      },
    },
    link: {
      fontSize: 14,
      color: "#059669", // Will be overridden by primaryColor in component
      hoverColor: "#047857", // Will be overridden by primaryColorHover in component
    },
  },
  carousel: {
    desktopCount: 4,
    autoplay: true,
  },
  background: {
    color: "transparent",
  },
  dataSource: {
    apiUrl:
      "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10",
    enabled: true,
  },
});

// No default properties - will fetch from API only

interface PropertySliderProps {
  title?: string;
  description?: string;
  items?: Property[];
  useStore?: boolean;
  variant?: string;
  id?: string;
  /** Override tenant ID (e.g. for Storybook when useStore is false) */
  tenantId?: string;
}

// Helper function to convert old API URLs to new format
const convertLegacyApiUrl = (url: string, tenantId: string): string => {
  if (url === "/api/properties/latestSales") {
    const newUrl = `/v1/tenant-website/${tenantId}/properties?purpose=sale&latest=1&limit=10`;
    return newUrl;
  } else if (url === "/api/properties/latestRentals") {
    const newUrl = `/v1/tenant-website/${tenantId}/properties?purpose=rent&latest=1&limit=10`;
    return newUrl;
  } else if (url === "/api/projects/latestProjects") {
    const newUrl = `/v1/tenant-website/${tenantId}/projects?featured=1&limit=10`;
    return newUrl;
  }
  // If it's already the new format with placeholder, replace tenantId
  return url.replace("{tenantId}", tenantId);
};

// Helper function to convert project data to property format
const convertProjectToProperty = (project: any): Property => {
  // Format price display
  const formatPrice = (minPrice: string, maxPrice: string) => {
    if (!minPrice && !maxPrice) return "غير محدد";
    if (minPrice === maxPrice) return minPrice;
    if (minPrice && maxPrice) return `${minPrice} - ${maxPrice}`;
    return minPrice || maxPrice;
  };

  // Format completion date
  const formatCompletionDate = (date: string) => {
    if (!date) return new Date().toISOString();
    try {
      return new Date(date).toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  // Helper function to convert completeStatus from number to readable text
  const getCompleteStatusText = (status: number | string | undefined | null): string => {
    if (status === undefined || status === null) return "قيد الإنشاء";
    const statusNum = typeof status === "string" ? parseInt(status, 10) : status;
    switch (statusNum) {
      case 0:
        return "قيد الإنشاء";
      case 1:
        return "منتهي";
      case 2:
        return "لم ينشأ بعد";
      default:
        return "قيد الإنشاء";
    }
  };

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    district: project.address || project.location?.address || "غير محدد",
    price: formatPrice(project.minPrice, project.maxPrice),
    views: 0, // Projects don't have views
    bedrooms: 0, // Projects don't have bedrooms
    bathrooms: 0, // Projects don't have bathrooms
    area: project.units ? `${project.units} وحدة` : "غير محدد",
    type: "مشروع", // Project type
    transactionType: "project", // Project transaction type
    image: project.image || project.images?.[0] || "",
    status: getCompleteStatusText(project.completeStatus),
    createdAt: formatCompletionDate(project.completionDate),
    description: project.description || "",
    features: project.amenities || [],
    location: {
      lat: project.location?.lat || 0,
      lng: project.location?.lng || 0,
      address: project.location?.address || project.address || "غير محدد",
    },
    images: project.images || [project.image].filter(Boolean),
  };
};

export default function PropertySlider(props: PropertySliderProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "propertySlider1";

  // Tenant ID hook (skip when tenantId override provided, e.g. Storybook)
  const hookResult = useTenantId();
  const currentTenantId = props.tenantId ?? hookResult.tenantId;
  const tenantLoading = props.tenantId ? false : hookResult.isLoading;

  // State for API data
  const [apiProperties, setApiProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  // Get tenant data (fetched once by wrapper / useTenantDataEffect)
  const tenantData = useTenantStore((s) => s.tenantData);
  const tenantId = useTenantStore((s) => s.tenantId);
  const router = useRouter();

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
            (component as any).type === "propertySlider" &&
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
            (component as any).type === "propertySlider" &&
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

  const tenantComponentData = useMemo(
    () => getTenantComponentData(),
    [tenantData, props.id, variantId]
  );

  // Fetch properties/projects from API
  const fetchProperties = async (apiUrl?: string) => {
    try {
      setLoading(true);

      if (!currentTenantId) {
        setLoading(false);
        return;
      }

      // Convert legacy API URLs to new format and replace tenantId
      const defaultUrl =
        "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10";
      const url = convertLegacyApiUrl(apiUrl || defaultUrl, currentTenantId);

      const response = await axiosInstance.get(url);

      // Handle different API response formats
      if (response.data) {
        let dataToSet = [];

        // Check if it's projects API response
        if (url.includes("/projects")) {
          let projectsData = [];

          if (response.data.projects) {
            projectsData = response.data.projects;
          } else if (Array.isArray(response.data)) {
            projectsData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            projectsData = response.data.data;
          }

          // Convert projects to property format
          if (projectsData.length > 0) {
            dataToSet = projectsData.map((project: any) => {
              return convertProjectToProperty(project);
            });
          } else {
            dataToSet = [];
          }
        }
        // Check if it's properties API response
        else if (response.data.properties) {
          dataToSet = response.data.properties;
        }
        // Handle direct array response
        else if (Array.isArray(response.data)) {
          dataToSet = response.data;
        }
        // Handle pagination wrapper
        else if (response.data.data && Array.isArray(response.data.data)) {
          dataToSet = response.data.data;
        }

        setApiProperties(dataToSet);

        if (response.data.pagination) {
          // Handle pagination if needed
        }
      } else {
        setApiProperties([]);
      }
    } catch (error) {
      // Set empty array on error
      setApiProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultPropertySliderData(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultPropertySliderData(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("propertySlider", variantId, initialData);
    }
  }, [
    variantId,
    props.useStore,
    ensureComponentVariant,
    tenantComponentData,
  ]);

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

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("propertySlider", variantId) || {}
    : {};

  // Get default data
  const defaultData = getDefaultPropertySliderData();

  // Check if tenantComponentData exists
  const hasTenantData =
    tenantComponentData &&
    Object.keys(tenantComponentData).length > 0;

  // Check if currentStoreData is just default data (by comparing a key field like content.title)
  const isStoreDataDefault =
    storeData?.content?.title === defaultData?.content?.title;

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
      : storeData), // 4. Current store data (highest priority if not default)
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

  // Helper: resolve color from path (يدعم useDefaultColor و globalColorType من الـ structure)
  const resolveColorAt = (root: any, path: string): any => {
    let cur = root;
    for (const part of path.split(".")) {
      if (cur == null || typeof cur !== "object" || Array.isArray(cur)) return undefined;
      cur = cur[part];
    }
    return cur;
  };

  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669",
  ): string => {
    // Navigate from mergedData so path "typography.title.color" works
    const fieldData = resolveColorAt(mergedData, fieldPath);
    const useDefaultColorValue = resolveColorAt(mergedData, `${fieldPath}.useDefaultColor`);
    const globalColorTypeValue = resolveColorAt(mergedData, `${fieldPath}.globalColorType`);

    // Check useDefaultColor value (default is true if not specified)
    const useDefaultColor =
      useDefaultColorValue !== undefined ? useDefaultColorValue : true;

    // If useDefaultColor is true, use branding color from WebsiteLayout
    if (useDefaultColor) {
      // Determine default globalColorType based on field path if not set
      let defaultGlobalColorType = "primary";
      if (
        fieldPath.includes("textColor") ||
        fieldPath.includes("Text") ||
        fieldPath.includes("title") ||
        fieldPath.includes("subtitle")
      ) {
        defaultGlobalColorType = "secondary";
      } else if (
        fieldPath.includes("link") ||
        fieldPath.includes("hoverColor")
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
      fieldPath.includes("textColor") ||
      fieldPath.includes("Text") ||
      fieldPath.includes("title") ||
      fieldPath.includes("subtitle")
    ) {
      defaultGlobalColorType = "secondary";
    }
    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

  // Get colors using getColor function (يدعم useDefaultColor و globalColorType من الـ structure)
  const linkColor = getColor("typography.link.color", "#059669");
  const linkHoverColor = getColor(
    "typography.link.hoverColor",
    getDarkerColor(linkColor, 20),
  );
  const titleColor = getColor("typography.title.color", "#1f2937");
  const subtitleColor = getColor("typography.subtitle.color", "#6b7280");

  // Use linkColor as primaryColor for backward compatibility
  const primaryColor = linkColor;
  const primaryColorHover = linkHoverColor;

  // Fetch properties on component mount and when API URL changes
  useEffect(() => {
    const apiUrl =
      mergedData.dataSource?.apiUrl ||
      "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10";
    const useApiData = mergedData.dataSource?.enabled !== false;

    if (useApiData && currentTenantId) {
      fetchProperties(apiUrl);
    }
  }, [
    mergedData.dataSource?.apiUrl,
    mergedData.dataSource?.enabled,
    currentTenantId,
  ]);

  // Use API data if enabled, otherwise use static data
  const useApiData = mergedData.dataSource?.enabled !== false;
  const properties = useApiData
    ? apiProperties
    : mergedData.items || mergedData.properties || [];

  // Visibility: showTitle / showDescription (default true)
  const showTitle = mergedData.content?.showTitle !== false;
  const showDescription = mergedData.content?.showDescription !== false;

  // Font size: number → "Npx", string (legacy) → as-is
  const toFontSizePx = (val: number | string | undefined, fallbackPx: number): string => {
    if (typeof val === "number") return `${val}px`;
    if (typeof val === "string" && /^\d+$/.test(val.trim())) return `${val.trim()}px`;
    if (typeof val === "string" && val) return val;
    return `${fallbackPx}px`;
  };

  // Generate dynamic styles (إعدادات إضافية: fontWeight, letterSpacing, margin)
  const titleExtra = mergedData.typography?.title?.extraSettings;
  const titleFontSize = mergedData.typography?.title?.fontSize?.desktop ?? 24;
  const titleStyles = {
    fontSize: toFontSizePx(titleFontSize, 24),
    fontWeight: titleExtra?.fontWeight || mergedData.typography?.title?.fontWeight || "extrabold",
    color: titleColor,
    letterSpacing: titleExtra?.letterSpacing || mergedData.typography?.title?.letterSpacing || "0",
    marginBottom: toDimension(titleExtra?.marginBottom ?? mergedData.typography?.title?.marginBottom, "px", "8px"),
  };

  const subtitleExtra = mergedData.typography?.subtitle?.extraSettings;
  const subtitleFontSize = mergedData.typography?.subtitle?.fontSize?.desktop ?? 18;
  const subtitleStyles = {
    fontSize: toFontSizePx(subtitleFontSize, 18),
    fontWeight: subtitleExtra?.fontWeight || mergedData.typography?.subtitle?.fontWeight || "normal",
    color: subtitleColor,
    letterSpacing: subtitleExtra?.letterSpacing || mergedData.typography?.subtitle?.letterSpacing || "0",
    marginTop: toDimension(subtitleExtra?.marginTop ?? mergedData.typography?.subtitle?.marginTop, "px", "0"),
    marginBottom: toDimension(subtitleExtra?.marginBottom ?? mergedData.typography?.subtitle?.marginBottom, "px", "0"),
  };

  const linkFontSize = mergedData.typography?.link?.fontSize;
  const linkStyles = {
    fontSize: toDimension(linkFontSize, "px", "14px"),
    color: linkColor,
  };

  const sectionStyles = {
    backgroundColor: mergedData.background?.color || "transparent",
    paddingTop: toDimension(mergedData.layout?.padding?.top, "px", "56px"),
    paddingBottom: toDimension(mergedData.layout?.padding?.bottom, "px", "56px"),
  };

  const containerStyles = {
    maxWidth: toDimension(mergedData.layout?.maxWidth, "px", "1600px"),
  };

  const titleBottomMargin = toDimension(mergedData.spacing?.titleBottom, "px", "24px");
  const slideGap = toDimension(mergedData.spacing?.slideGap, "px", "16px");

  // Check if component should be visible
  if (!mergedData.visible) {
    return null;
  }

  // Hide entire section if no properties
  if (properties.length == 0) {
    return null;
  }

  // Show loading state while tenant is loading
  if (tenantLoading) {
    return (
      <section className="w-full bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderBottomColor: primaryColor }}
            ></div>
            <p className="text-lg text-gray-600 mt-4">
              جاري تحميل بيانات الموقع...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show error if no tenant ID
  if (!currentTenantId) {
    return (
      <section className="w-full bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-lg text-yellow-600 font-medium">
              لم يتم العثور على معرف الموقع
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تأكد من أنك تصل إلى الموقع من الرابط الصحيح
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full bg-background py-14 sm:py-16"
      style={{
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          "transparent",
        paddingTop: mergedData.layout?.padding?.top || "56px",
        paddingBottom: mergedData.layout?.padding?.bottom || "56px",
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: toDimension(mergedData.layout?.maxWidth, "px", "1600px"),
          gridTemplateColumns: mergedData.grid?.columns?.desktop
            ? `repeat(${mergedData.grid.columns.desktop}, 1fr)`
            : undefined,
          gap:
            mergedData.grid?.gapX || mergedData.grid?.gapY
              ? `${mergedData.grid.gapY || "40px"} ${mergedData.grid.gapX || "40px"}`
              : undefined,
        }}
      >
        <div
          className="mb-6 px-5"
          dir="rtl"
          style={{ marginBottom: titleBottomMargin }}
        >
          {/* Mobile Layout - Button on left side */}
          <div className="flex items-center justify-between md:hidden">
            {showTitle && (
              <h2
                className="section-title font-bold"
                style={{
                  ...titleStyles,
                  color: mergedData.styling?.textColor || mergedData.colors?.textColor || titleColor,
                }}
              >
                {mergedData.content?.title || "أحدث العقارات للإيجار"}
              </h2>
            )}
            <Link
              href={mergedData.content?.viewAllUrl || "#"}
              className="hover:underline text-sm"
              style={{
                fontSize: linkStyles.fontSize,
                color: mergedData.styling?.textColor || mergedData.colors?.textColor || linkHoverColor,
              }}
            >
              {mergedData.content?.viewAllText || "عرض الكل"}
            </Link>
          </div>

          {/* Desktop Layout - Button on right side */}
          <div className="hidden md:flex items-end justify-between">
            <div>
              {showTitle && (
                <h2
                  className="section-title font-bold"
                  style={{
                    ...titleStyles,
                    color: mergedData.styling?.textColor || mergedData.colors?.textColor || titleColor,
                  }}
                >
                  {mergedData.content?.title || "أحدث العقارات للإيجار"}
                </h2>
              )}
              {showDescription && (
                <p
                  className="section-subtitle"
                  style={{
                    ...subtitleStyles,
                    color: mergedData.styling?.textColor || mergedData.colors?.textColor || subtitleColor,
                  }}
                >
                  {mergedData.content?.description ||
                    "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع"}
                </p>
              )}
            </div>
            <Link
              href={mergedData.content?.viewAllUrl || "#"}
              className="hover:underline"
              style={{
                ...linkStyles,
                color: mergedData.styling?.textColor || mergedData.colors?.textColor || linkHoverColor,
              }}
            >
              {mergedData.content?.viewAllText || "عرض الكل"}
            </Link>
          </div>

          {/* Description for mobile */}
          {showDescription && (
            <p className="section-subtitle md:hidden" style={subtitleStyles}>
              {mergedData.description ||
                mergedData.content?.description ||
                "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع"}
            </p>
          )}
        </div>

        <div className="">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                  style={{ borderBottomColor: primaryColor }}
                ></div>
                <p className="text-gray-600">جاري تحميل العقارات...</p>
              </div>
            </div>
          ) : properties.length > 0 ? (
            <SwiperCarousel
              desktopCount={mergedData.carousel?.desktopCount || 4}
              slideClassName="!h-fit sm:!h-[400px] md:!h-[420px]"
              items={properties.map((p: Property) => {
                const cardSettings = mergedData.cardSettings || {};
                let CardComponent = PropertyCard;

                if (cardSettings.theme === "card2") {
                  CardComponent = PropertyCard2;
                } else if (cardSettings.theme === "card3") {
                  CardComponent = PropertyCard3;
                }

                return (
                  <div key={p.id} className="h-full w-full">
                    <CardComponent
                      property={p}
                      showImage={cardSettings.showImage !== false}
                      showPrice={cardSettings.showPrice !== false}
                      showDetails={cardSettings.showDetails !== false}
                      showViews={cardSettings.showViews !== false}
                      showStatus={cardSettings.showStatus !== false}
                    />
                  </div>
                );
              })}
              space={parseInt(slideGap) || 16}
              autoplay={mergedData.carousel?.autoplay || true}
            />
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg font-medium">
                  لا توجد عقارات متاحة حالياً
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  يرجى المحاولة مرة أخرى لاحقاً
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
