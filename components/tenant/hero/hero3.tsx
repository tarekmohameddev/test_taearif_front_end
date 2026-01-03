"use client";

import { useState, useEffect } from "react";
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

// Search Form Component
function SearchForm({
  config,
  primaryColor,
  primaryColorHover,
}: {
  config: any;
  primaryColor?: string;
  primaryColorHover?: string;
}) {
  const [status, setStatus] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  // Default colors if not provided
  const defaultPrimaryColor = primaryColor || "#8b5f46";
  const defaultPrimaryColorHover = primaryColorHover || "#6b4630";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Navigate to results page or trigger search
  };

  if (!config?.enabled) return null;

  // Default options based on the HTML code provided
  const typeOptions = config.fields?.type?.options || [
    "الكل",
    "شقق",
    "فلل",
    "اراضي",
    "ادوار",
    "عمائر",
    "تاون هاوس",
    "أبراج",
  ];
  const cityOptions = config.fields?.city?.options || [
    "اختر المدينة",
    "الرياض",
    "جدة",
    "مكة المكرمة",
    "المدينة المنورة",
    "الدمام",
  ];
  const statusOptions = config.fields?.status?.options || [
    "بيع / ايجار",
    "للبيع",
    "للإيجار",
  ];

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
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#896042]">
                <SelectValue placeholder="اختر المدينة" />
                <ChevronDown className="size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {cityOptions.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
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
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-12 border border-gray-200 rounded-2xl">
                <SelectValue placeholder="اختر المدينة" />
                <ChevronDown className="size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {cityOptions.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
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
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function Hero3(props: HeroProps) {
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
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Extract component data from tenantData (BEFORE useEffect)
  const getTenantComponentData = () => {
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
  };

  const tenantComponentData = getTenantComponentData();

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
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultHero3Data(), // 1. Defaults (lowest priority)
    ...storeData, // 2. Store state
    ...currentStoreData, // 3. Current store data
    ...props, // 4. Props (highest priority)
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

  // Generate dynamic styles
  const sectionStyles = {
    height: mergedData.height?.desktop || "90vh",
    minHeight: mergedData.minHeight?.desktop || "520px",
  };

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

  return (
    <section
      className="relative w-full overflow-hidden max-h-[95dvh]"
      style={sectionStyles as any}
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
  );
}
