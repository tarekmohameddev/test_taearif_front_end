"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Home, MapPin, Search, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { getDefaultHero3Data } from "@/context/editorStoreFunctions/heroFunctions";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { useSearchParams } from "next/navigation";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface HeroProps {
  visible?: boolean;
  height?: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
  };
  minHeight?: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
  };
  background?: {
    image?: string;
    video?: string;
    videoStart?: number;
    playOnMobile?: boolean;
    privacyMode?: boolean;
    alt?: string;
    overlay?: {
      enabled?: boolean;
      opacity?: string;
      color?: string;
    };
  };
  content?: {
    title?: string;
    subtitle?: string;
    font?: {
      title?: {
        family?: string;
        size?: { desktop?: string; tablet?: string; mobile?: string };
        weight?: string;
        color?: string;
        lineHeight?: string;
      };
      subtitle?: {
        family?: string;
        size?: { desktop?: string; tablet?: string; mobile?: string };
        weight?: string;
        color?: string;
      };
    };
    alignment?: string;
    maxWidth?: string;
    paddingTop?: string;
  };
  searchForm?: {
    enabled?: boolean;
    position?: string;
    offset?: string;
    background?: {
      color?: string;
      opacity?: string;
      shadow?: string;
      border?: string;
      borderRadius?: string;
    };
    fields?: {
      type?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
        options?: string[];
      };
      city?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
        options?: string[];
      };
      status?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
        options?: string[];
      };
    };
    responsive?: {
      desktop?: string;
      tablet?: string;
      mobile?: string;
    };
  };
  animations?: {
    title?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    subtitle?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    searchForm?: {
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

// Search Form Component - Memoized to prevent unnecessary re-renders
const SearchForm = React.memo(function SearchForm({
  config,
  primaryColor,
  primaryColorHover,
}: {
  config: any;
  primaryColor?: string;
  primaryColorHover?: string;
}) {
  const { navigateWithFilters } = useUrlFilters();
  const searchParams = useSearchParams();

  // City options from API
  interface CityOption {
    id: string | number;
    name: string;
  }
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [cityLoading, setCityLoading] = useState(false);

  // Form state
  const [status, setStatus] = useState(() => {
    const purposeParam = searchParams?.get("purpose");
    if (purposeParam === "rent") return "للإيجار";
    if (purposeParam === "sale") return "للبيع";
    return "";
  });
  const [cityId, setCityId] = useState(() => searchParams?.get("city_id") || "");
  const [cityName, setCityName] = useState("");
  const [type, setType] = useState("");

  // Default colors if not provided
  const defaultPrimaryColor = primaryColor || "#8b5f46";
  const defaultPrimaryColorHover = primaryColorHover || "#6b4630";

  // Fetch cities from API
  useEffect(() => {
    let isMounted = true;
    const fetchCities = async () => {
      try {
        setCityLoading(true);
        const res = await fetch(
          "https://nzl-backend.com/api/cities?country_id=1",
        );
        if (!res.ok) throw new Error(`Failed to load cities: ${res.status}`);
        const data = await res.json();
        const list: CityOption[] = Array.isArray(data?.data)
          ? data.data.map((c: any) => ({
              id: c.id,
              name: c.name_ar || c.name_en || String(c.id),
            }))
          : [];
        if (isMounted) setCityOptions(list);
      } catch (e: any) {
        console.error("Error fetching cities:", e);
        // Fallback to config options if API fails
        if (isMounted && config.fields?.city?.options) {
          const fallbackOptions: CityOption[] = config.fields.city.options
            .filter((opt: string) => opt !== "اختر المدينة")
            .map((opt: string, index: number) => ({
              id: index + 1,
              name: opt,
            }));
          setCityOptions(fallbackOptions);
        }
      } finally {
        if (isMounted) setCityLoading(false);
      }
    };
    fetchCities();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update form fields when URL changes
  useEffect(() => {
    if (!searchParams) return;

    const purposeParam = searchParams.get("purpose");
    const cityIdParam = searchParams.get("city_id");

    if (purposeParam === "rent") setStatus("للإيجار");
    else if (purposeParam === "sale") setStatus("للبيع");
    if (cityIdParam) setCityId(cityIdParam);
  }, [searchParams]);

  // Find city name from cityId for display
  useEffect(() => {
    if (cityId && cityOptions.length > 0) {
      const city = cityOptions.find((c) => c.id.toString() === cityId);
      if (city) setCityName(city.name);
    } else {
      setCityName("");
    }
  }, [cityId, cityOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert status to transactionType
    let transactionType: "rent" | "sale" = "rent";
    if (status === "للبيع") {
      transactionType = "sale";
    } else if (status === "للإيجار") {
      transactionType = "rent";
    } else {
      // Default to rent if no status selected
      transactionType = "rent";
    }

    // Collect filters
    const filters: {
      city_id?: string;
      state_id?: string;
      max_price?: string;
      category_id?: string;
      type_id?: string;
      search?: string;
    } = {};

    // Add city_id if city is selected
    if (cityId && cityId.trim()) {
      filters.city_id = cityId.trim();
    }

    // Add type as search term if provided and not "الكل"
    if (type && type.trim() && type !== "الكل") {
      filters.search = type.trim();
    }

    // Log for debugging
    console.log("🔍 Hero3 Search Form Submit:", {
      status,
      transactionType,
      cityId,
      cityName,
      type,
      filters,
    });

    // Navigate to the appropriate listing page with filters
    navigateWithFilters(transactionType, filters);
  };

  if (!config?.enabled) return null;

  // Default options based on the HTML code provided - Memoized to prevent re-computation
  const typeOptions = useMemo(() => config.fields?.type?.options || [
    "الكل",
    "شقق",
    "فلل",
    "اراضي",
    "ادوار",
    "عمائر",
    "تاون هاوس",
    "أبراج",
  ], [config.fields?.type?.options]);
  
  const statusOptions = useMemo(() => config.fields?.status?.options || [
    "بيع / ايجار",
    "للبيع",
    "للإيجار",
  ], [config.fields?.status?.options]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl bg-white p-4 sm:px-6 shadow-lg max-w-6xl"
      aria-label="نموذج البحث عن العقارات"
    >
      {/* Desktop Layout: all in one row */}
      <div className="hidden lg:flex items-end gap-4">
        {/* Property Type */}
        {config.fields?.type?.enabled && (
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <Home className="size-5" style={{ color: "#896042" }} />
              <h6 className="text-sm font-medium text-gray-700">نوع العقار</h6>
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#896042]">
                <SelectValue placeholder="الكل" />
                <ChevronDown className="size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {typeOptions.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* City */}
        {config.fields?.city?.enabled && (
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <MapPin className="size-5" style={{ color: "#896042" }} />
              <h6 className="text-sm font-medium text-gray-700">موقع العقار</h6>
            </div>
            <Select
              value={cityId}
              onValueChange={(value) => {
                setCityId(value);
                const city = cityOptions.find((c) => c.id.toString() === value);
                if (city) setCityName(city.name);
              }}
            >
              <SelectTrigger className="h-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#896042]">
                <SelectValue
                  placeholder={
                    cityLoading
                      ? "جاري التحميل..."
                      : cityName || "اختر المدينة"
                  }
                />
                <ChevronDown className="size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {cityLoading ? (
                  <SelectItem value="loading" disabled>
                    جاري التحميل...
                  </SelectItem>
                ) : cityOptions.length === 0 ? (
                  <SelectItem value="no-cities" disabled>
                    لا توجد مدن
                  </SelectItem>
                ) : (
                  cityOptions.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Property Status */}
        {config.fields?.status?.enabled && (
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <Tag className="size-5" style={{ color: "#896042" }} />
              <h6 className="text-sm font-medium text-gray-700">حالة العقار</h6>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#896042]">
                <SelectValue placeholder="بيع / ايجار" />
                <ChevronDown className="size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {statusOptions.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Apply Button */}
        <div className="flex flex-col gap-2">
          <div className="h-6"></div>
          <button
            type="submit"
            style={{ backgroundColor: "#8b5f46", color: "#ffffff" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = defaultPrimaryColorHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#8b5f46";
            }}
            className="h-12 px-6 rounded-2xl font-medium text-white transition-colors whitespace-nowrap"
          >
            تطبيق البحث
          </button>
        </div>
      </div>

      {/* Tablet/Mobile Layout */}
      <div className="grid gap-4 lg:hidden">
        {/* Property Type */}
        {config.fields?.type?.enabled && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Home className="size-5" style={{ color: "#896042" }} />
              <h6 className="text-sm font-medium text-gray-700">نوع العقار</h6>
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-12 border border-gray-200 rounded-2xl">
                <SelectValue placeholder="الكل" />
                <ChevronDown className="size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {typeOptions.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* City */}
        {config.fields?.city?.enabled && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="size-5" style={{ color: "#896042" }} />
              <h6 className="text-sm font-medium text-gray-700">موقع العقار</h6>
            </div>
            <Select
              value={cityId}
              onValueChange={(value) => {
                setCityId(value);
                const city = cityOptions.find((c) => c.id.toString() === value);
                if (city) setCityName(city.name);
              }}
            >
              <SelectTrigger className="h-12 border border-gray-200 rounded-2xl">
                <SelectValue
                  placeholder={
                    cityLoading
                      ? "جاري التحميل..."
                      : cityName || "اختر المدينة"
                  }
                />
                <ChevronDown className="size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {cityLoading ? (
                  <SelectItem value="loading" disabled>
                    جاري التحميل...
                  </SelectItem>
                ) : cityOptions.length === 0 ? (
                  <SelectItem value="no-cities" disabled>
                    لا توجد مدن
                  </SelectItem>
                ) : (
                  cityOptions.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Property Status */}
        {config.fields?.status?.enabled && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Tag className="size-5" style={{ color: "#896042" }} />
              <h6 className="text-sm font-medium text-gray-700">حالة العقار</h6>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-12 border border-gray-200 rounded-2xl">
                <SelectValue placeholder="بيع / ايجار" />
                <ChevronDown className="size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {statusOptions.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Apply Button */}
        <button
          type="submit"
          style={{ backgroundColor: "#8b5f46", color: "#ffffff" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = defaultPrimaryColorHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#8b5f46";
          }}
          className="h-12 px-6 rounded-2xl font-medium text-white transition-colors w-full"
        >
          تطبيق البحث
        </button>
      </div>
    </form>
  );
});

// ═══════════════════════════════════════════════════════════
// COMPONENT - Memoized to prevent unnecessary re-renders
// ═══════════════════════════════════════════════════════════
function Hero3(props: HeroProps) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "hero3";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const heroStates = useEditorStore((s) => s.heroStates);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  // ⚠️ REMOVED: fetchTenantData useEffect - causes infinite re-renders
  // Tenant data should be loaded at a higher level, not in component

  // Extract component data from tenantData (memoized to prevent re-computation)
  const tenantComponentData = useMemo(() => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "hero" &&
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
              (component as any).type === "hero" &&
              (component as any).componentName === variantId
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  }, [tenantData, variantId, props.id]);

  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultHero3Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultHero3Data(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("hero", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = heroStates[uniqueId];
  const currentStoreData = getComponentData("hero", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER) - Memoized to prevent re-computation
  // ─────────────────────────────────────────────────────────
  const mergedData = useMemo(() => ({
    ...getDefaultHero3Data(), // 1. Defaults (lowest priority)
    ...storeData, // 2. Store state
    ...currentStoreData, // 3. Current store data
    ...props, // 4. Props (highest priority)
  }), [storeData, currentStoreData, props]);

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────

  // Generate dynamic styles with responsive height
  const sectionStyles = {
    "--hero-height-desktop": mergedData.height?.desktop || "90vh",
    "--hero-height-tablet": mergedData.height?.tablet || mergedData.height?.desktop || "90vh",
    "--hero-height-mobile": mergedData.height?.mobile || mergedData.height?.desktop || "90vh",
  } as React.CSSProperties;

  const titleStyles = {
    fontFamily: mergedData.content?.font?.title?.family || "Tajawal",
    fontWeight: mergedData.content?.font?.title?.weight || "extrabold",
    color: mergedData.content?.font?.title?.color || "#ffffff",
    lineHeight: mergedData.content?.font?.title?.lineHeight || "1.25",
  };

  const subtitleStyles = {
    fontFamily: mergedData.content?.font?.subtitle?.family || "Tajawal",
    fontWeight: mergedData.content?.font?.subtitle?.weight || "normal",
    color:
      mergedData.content?.font?.subtitle?.color || "rgba(255, 255, 255, 0.85)",
  };

  const overlayStyles = {
    backgroundColor: mergedData.background?.overlay?.color || "#000000",
    opacity: mergedData.background?.overlay?.opacity || "0.45",
  };

  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    return match ? match[1] : null;
  };

  // Default video URL
  const defaultVideoUrl = "https://youtu.be/ULzl51V38lw?si=iwlRp_cUXmTe50Gc";

  // Use video from data, or fallback to default video
  const videoUrl = mergedData.background?.video || defaultVideoUrl;
  const videoId = getYouTubeVideoId(videoUrl);
  const videoStart = mergedData.background?.videoStart || 0;
  const playOnMobile = mergedData.background?.playOnMobile !== false;
  const privacyMode = mergedData.background?.privacyMode !== false;

  // Build YouTube embed URL
  const getYouTubeEmbedUrl = () => {
    if (!videoId) return "";
    const baseUrl = privacyMode
      ? "https://www.youtube-nocookie.com/embed"
      : "https://www.youtube.com/embed";
    const params = new URLSearchParams({
      controls: "0",
      rel: "0",
      playsinline: "1",
      cc_load_policy: "0",
      enablejsapi: "1",
      origin: typeof window !== "undefined" ? window.location.origin : "",
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: videoId, // Required for loop to work
      start: videoStart.toString(),
    });
    return `${baseUrl}/${videoId}?${params.toString()}`;
  };

  // Default primary color
  const primaryColor = "#059669"; // emerald-600
  const primaryColorHover = "#047857"; // emerald-700

  // Generate unique ID for style tag to avoid conflicts
  const styleId = `hero3-height-${uniqueId.replace(/[^a-zA-Z0-9]/g, '-')}`;
  
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          #${styleId} {
            height: var(--hero-height-mobile);
          }
          @media (min-width: 768px) {
            #${styleId} {
              height: var(--hero-height-tablet);
            }
          }
          @media (min-width: 1024px) {
            #${styleId} {
              height: var(--hero-height-desktop);
            }
          }
        `
      }} />
      <section
        id={styleId}
        className="relative w-full overflow-hidden max-h-[95dvh]"
        style={sectionStyles}
        data-debug="hero-component"
      >
      {/* Background Video */}
      {videoId ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <iframe
            src={getYouTubeEmbedUrl()}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100vw",
              height: "56.25vw",
              minHeight: "100vh",
              minWidth: "177.77vh",
              transform: "translate(-50%, -50%)",
              border: "none",
            }}
            title="Background Video"
          />

          {/* Overlay */}
          {mergedData.background?.overlay?.enabled && (
            <div className="absolute inset-0 z-[1]" style={overlayStyles} />
          )}
        </div>
      ) : (
        <>
          <Image
            src={
              mergedData.background?.image ||
              "https://dalel-lovat.vercel.app/images/hero.webp"
            }
            alt={mergedData.background?.alt || "صورة خلفية"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Overlay */}
          {mergedData.background?.overlay?.enabled && (
            <div className="absolute inset-0 z-[1]" style={overlayStyles} />
          )}
        </>
      )}

      {/* Content - Centered in middle */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          {/* Desktop/Tablet Layout */}
          <div className="hidden md:flex flex-col items-center text-center text-white">
            <h2
              className={cn(
                "mx-auto text-balance mb-3 font-bold",
                `text-${mergedData.content?.font?.title?.size?.tablet || "4xl"} md:text-${mergedData.content?.font?.title?.size?.desktop || "5xl"}`,
                `max-w-${mergedData.content?.maxWidth || "5xl"}`,
              )}
              style={titleStyles}
            >
              {mergedData.content?.title ||
                "مع باهية... اجعل حلمك السكني استثمارا يدوم"}
            </h2>
            <p
              className={cn(
                "mx-auto mb-6",
                `text-${mergedData.content?.font?.subtitle?.size?.tablet || "xs"} md:text-${mergedData.content?.font?.subtitle?.size?.desktop || "md"}`,
                `max-w-${mergedData.content?.maxWidth || "4xl"}`,
              )}
              style={subtitleStyles}
            >
              {mergedData.content?.subtitle ||
                "في باهية، نرتقي بتجربة العقار عبر رؤية احترافية، وخدمة مصمّمة خصيصًا لتليق بتطلعاتك، لنمنحك حلولًا عقارية متكاملة تُلبي طموحاتك وتحقق استثمارًا يدوم."}
            </p>
            {/* Hero Search Form for Desktop/Tablet */}
            {mergedData.searchForm?.enabled && (
              <div className="w-full pointer-events-auto flex items-center justify-center">
                <SearchForm
                  config={mergedData.searchForm}
                  primaryColor={primaryColor}
                  primaryColorHover={primaryColorHover}
                />
              </div>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col items-center text-center text-white">
            <h2
              className={cn(
                "mx-auto text-balance mb-3",
                `text-${mergedData.content?.font?.title?.size?.mobile || "2xl"}`,
                `max-w-${mergedData.content?.maxWidth || "5xl"}`,
              )}
              style={titleStyles}
            >
              {mergedData.content?.title ||
                "مع باهية... اجعل حلمك السكني استثمارا يدوم"}
            </h2>
            <p
              className={cn(
                "mx-auto mb-6",
                `text-${mergedData.content?.font?.subtitle?.size?.mobile || "xs"}`,
                `max-w-${mergedData.content?.maxWidth || "4xl"}`,
              )}
              style={subtitleStyles}
            >
              {mergedData.content?.subtitle ||
                "في باهية، نرتقي بتجربة العقار عبر رؤية احترافية، وخدمة مصمّمة خصيصًا لتليق بتطلعاتك، لنمنحك حلولًا عقارية متكاملة تُلبي طموحاتك وتحقق استثمارًا يدوم."}
            </p>
            {/* Hero Search Form for Mobile */}
            {mergedData.searchForm?.enabled && (
              <div className="w-full px-4 pointer-events-auto">
                <SearchForm
                  config={mergedData.searchForm}
                  primaryColor={primaryColor}
                  primaryColorHover={primaryColorHover}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default React.memo(Hero3, (prevProps, nextProps) => {
  // Only re-render if id changes or props actually change
  if (prevProps.id !== nextProps.id) return false;
  
  // Deep comparison for props (excluding functions)
  const prevKeys = Object.keys(prevProps).filter(k => k !== 'id');
  const nextKeys = Object.keys(nextProps).filter(k => k !== 'id');
  
  if (prevKeys.length !== nextKeys.length) return false;
  
  for (const key of prevKeys) {
    if (JSON.stringify(prevProps[key as keyof HeroProps]) !== 
        JSON.stringify(nextProps[key as keyof HeroProps])) {
      return false;
    }
  }
  
  return true; // Props are equal, skip re-render
});
