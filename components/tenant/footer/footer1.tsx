"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState, useMemo } from "react";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { logChange } from "@/lib/debugLogger";

// Define footer data type
type FooterData = {
  visible: boolean;
  background: {
    type: string;
    image: string;
    alt: string;
    color: string;
    gradient: {
      enabled: boolean;
      direction: string;
      startColor: string;
      endColor: string;
      middleColor: string;
    };
    overlay: {
      enabled: boolean;
      opacity: string;
      color: string;
      blendMode: string;
    };
  };
  layout: {
    columns: string;
    spacing: string;
    padding: string;
    maxWidth: string;
  };
  content: {
    companyInfo: {
      enabled: boolean;
      name: string;
      description: string;
      tagline: string;
      logo: string;
    };
    quickLinks: {
      enabled: boolean;
      title: string;
      links: Array<{ text: string; url: string }>;
    };
    contactInfo: {
      enabled: boolean;
      title: string;
      address: string;
      phone1: string;
      phone2: string;
      email: string;
    };
    socialMedia: {
      enabled: boolean;
      title: string;
      platforms: Array<{
        name: string;
        icon: string;
        url: string;
        color: string;
      }>;
    };
  };
  footerBottom: {
    enabled: boolean;
    copyright: string;
    legalLinks: Array<{ text: string; url: string }>;
  };
  styling: {
    colors: {
      textPrimary: string;
      textSecondary: string;
      textMuted: string;
      accent: string;
      border: string;
    };
    typography: {
      titleSize: string;
      titleWeight: string;
      bodySize: string;
      bodyWeight: string;
    };
    spacing: {
      sectionPadding: string;
      columnGap: string;
      itemGap: string;
    };
    effects: {
      hoverTransition: string;
      shadow: string;
      borderRadius: string;
    };
  };
};

// Default footer data
const getDefaultFooterData = (): FooterData => ({
  visible: true,
  background: {
    type: "image",
    image: "https://dalel-lovat.vercel.app/images/footer/FooterImage.webp",
    alt: "خلفية الفوتر",
    color: "#1f2937",
    gradient: {
      enabled: false,
      direction: "to-r",
      startColor: "#1f2937",
      endColor: "#374151",
      middleColor: "#4b5563",
    },
    overlay: {
      enabled: true,
      opacity: "0.7",
      color: "#000000",
      blendMode: "multiply",
    },
  },
  layout: {
    columns: "3",
    spacing: "8",
    padding: "16",
    maxWidth: "7xl",
  },
  content: {
    companyInfo: {
      enabled: true,
      name: "الشركة العقارية",
      description:
        "نقدم لك أفضل الحلول العقارية بخبرة واحترافية لتلبية كافة احتياجاتك في البيع والإيجار مع ضمان تجربة مريحة وموثوقة",
      tagline: "للخدمات العقارية",
      logo: "",
    },
    quickLinks: {
      enabled: true,
      title: "روابط مهمة",
      links: [
        { text: "الرئيسية", url: "/" },
        { text: "البيع", url: "/for-sale" },
        { text: "الإيجار", url: "/for-rent" },
        { text: "من نحن", url: "/about-us" },
        { text: "تواصل معنا", url: "/contact-us" },
      ],
    },
    contactInfo: {
      enabled: true,
      title: "معلومات التواصل",
      address: "المملكة العربية السعودية",
      phone1: "0000",
      phone2: "0000",
      email: "info@example.com",
    },
    socialMedia: {
      enabled: true,
      title: "وسائل التواصل الاجتماعي",
      platforms: [
        { name: "واتساب", icon: "FaWhatsapp", url: "#", color: "#25D366" },
        { name: "لينكد إن", icon: "Linkedin", url: "#", color: "#0077B5" },
        { name: "إنستغرام", icon: "Instagram", url: "#", color: "#E4405F" },
        { name: "تويتر", icon: "Twitter", url: "#", color: "#1DA1F2" },
        { name: "فيسبوك", icon: "Facebook", url: "#", color: "#1877F2" },
      ],
    },
  },
  footerBottom: {
    enabled: true,
    copyright: "© 2024 الشركة العقارية للخدمات العقارية. جميع الحقوق محفوظة.",
    legalLinks: [
      { text: "سياسة الخصوصية", url: "/privacy" },
      { text: "الشروط والأحكام", url: "/terms" },
    ],
  },
  styling: {
    colors: {
      textPrimary: "#ffffff",
      textSecondary: "#ffffff",
      textMuted: "rgba(255, 255, 255, 0.7)",
      accent: "#10b981",
      border: "rgba(255, 255, 255, 0.2)",
    },
    typography: {
      titleSize: "xl",
      titleWeight: "bold",
      bodySize: "sm",
      bodyWeight: "normal",
    },
    spacing: {
      sectionPadding: "16",
      columnGap: "8",
      itemGap: "3",
    },
    effects: {
      hoverTransition: "0.3s",
      shadow: "none",
      borderRadius: "none",
    },
  },
});

interface FooterProps {
  // Editor props
  overrideData?: any; // ⭐ NEW: Accept override data directly
  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function Footer(props: FooterProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "footer1";

  // Force re-render state
  const [forceUpdate, setForceUpdate] = useState(0);

  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  // Subscribe to global components data
  const globalFooterData = useEditorStore((s) => s.globalFooterData);

  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("footer", variantId, props);
    }
  }, [variantId, props.useStore, ensureComponentVariant]);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Subscribe to website layout for custom branding
  const customBranding = useEditorStore((s) => s.WebsiteLayout.CustomBranding);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Check if this is a global footer
  const isGlobalFooter = variantId === "global-footer" || props.id === "global-footer";

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("footer", variantId) || {}
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
          if (
            (component as any).type === "footer" &&
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

  // Merge data with priority:
  // overrideData > globalFooterData (if global) > storeData > tenantComponentData > props > default
  const mergedData = useMemo(() => {
    const fallbackData = getDefaultFooterData();
    
    // Start with base data
    let result = {
      ...fallbackData,
      ...props,
      ...tenantComponentData,
      ...storeData,
    };

    // If it's a global footer, incorporate global store data
    if (isGlobalFooter) {
      result = {
        ...result,
        ...globalFooterData,
      };
    }

    // Apply overrideData (highest priority, used by Live Editor sidebar)
    if (props.overrideData) {
      result = {
        ...result,
        ...props.overrideData,
      };
    }

    // ⭐ CRITICAL: Deep merge content and styling to prevent partial data loss
    if (result.content) {
      result.content = {
        ...fallbackData.content,
        ...props.content,
        ...tenantComponentData.content,
        ...storeData.content,
        ...(isGlobalFooter ? globalFooterData?.content : {}),
        ...(props.overrideData?.content || {}),
      };

      // Handle nested content objects (companyInfo, quickLinks, etc.)
      const contentKeys = ["companyInfo", "quickLinks", "contactInfo", "socialMedia"];
      contentKeys.forEach(key => {
        if (result.content[key]) {
          result.content[key] = {
            ...(fallbackData.content as any)[key],
            ...(props.content as any)?.[key],
            ...(tenantComponentData.content as any)?.[key],
            ...(storeData.content as any)?.[key],
            ...(isGlobalFooter ? (globalFooterData?.content as any)?.[key] : {}),
            ...(props.overrideData?.content as any)?.[key],
          };
        }
      });
    }

    if (result.styling) {
      result.styling = {
        ...fallbackData.styling,
        ...props.styling,
        ...tenantComponentData.styling,
        ...storeData.styling,
        ...(isGlobalFooter ? globalFooterData?.styling : {}),
        ...(props.overrideData?.styling || {}),
      };
      
      // Handle nested styling objects
      const stylingKeys = ["colors", "typography", "spacing", "effects"];
      stylingKeys.forEach(key => {
        if (result.styling[key]) {
          result.styling[key] = {
            ...(fallbackData.styling as any)[key],
            ...(props.styling as any)?.[key],
            ...(tenantComponentData.styling as any)?.[key],
            ...(storeData.styling as any)?.[key],
            ...(isGlobalFooter ? (globalFooterData?.styling as any)?.[key] : {}),
            ...(props.overrideData?.styling as any)?.[key],
          };
        }
      });
    }

    // Apply branding data with high priority, but respect overrides
    // 1. Custom Branding (from editor store WebsiteLayout)
    if (customBranding?.footer) {
      if (!result.content) result.content = {} as any;
      if (!result.content.companyInfo) result.content.companyInfo = {} as any;

      // Only apply if not already provided by overrideData or explicit props
      if (customBranding.footer.logo && !props.overrideData?.content?.companyInfo?.logo) {
        result.content.companyInfo.logo = customBranding.footer.logo;
      }
      if (customBranding.footer.name && !props.overrideData?.content?.companyInfo?.name) {
        result.content.companyInfo.name = customBranding.footer.name;
      }
    }

    // 2. Tenant Branding (historical fallback)
    if (tenantData?.branding) {
      if (!result.content) result.content = {} as any;
      if (!result.content.companyInfo) result.content.companyInfo = {} as any;

      // Only apply if not already set by customBranding or overrides
      if (tenantData.branding.logo && !customBranding?.footer?.logo && !props.overrideData?.content?.companyInfo?.logo) {
        result.content.companyInfo.logo = tenantData.branding.logo;
      }

      if (tenantData.branding.name && !customBranding?.footer?.name && !props.overrideData?.content?.companyInfo?.name) {
        result.content.companyInfo.name = tenantData.branding.name;
      } else if (tenantData.websiteName && !customBranding?.footer?.name && !props.overrideData?.content?.companyInfo?.name) {
        result.content.companyInfo.name = tenantData.websiteName;
      }
    }

    return result;
  }, [
    isGlobalFooter,
    props,
    globalFooterData,
    tenantComponentData,
    storeData,
    tenantData,
    customBranding,
    variantId,
  ]);

  // Debug logging for global footer changes
  useEffect(() => {
    if (isGlobalFooter) {
      logChange(variantId, "footer1", "footer", mergedData, "GLOBAL_FOOTER");
    }
  }, [isGlobalFooter, variantId, mergedData]);

  // Force re-render when globalFooterData changes
  useEffect(() => {
    if (
      isGlobalFooter &&
      globalFooterData &&
      Object.keys(globalFooterData).length > 0
    ) {
      setForceUpdate((prev) => prev + 1);
    }
  }, [isGlobalFooter, globalFooterData]);

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  const getBackgroundStyle = () => {
    const { background } = mergedData;

    if (background.type === "image" && background.image) {
      return {};
    } else if (background.type === "color" && background.color) {
      return { backgroundColor: background.color };
    } else if (background.type === "gradient" && background.gradient.enabled) {
      const { direction, startColor, endColor, middleColor } =
        background.gradient;
      if (middleColor) {
        return {
          background: `linear-gradient(${direction}, ${startColor}, ${middleColor}, ${endColor})`,
        };
      }
      return {
        background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
      };
    }
    return {};
  };

  const getOverlayStyle = () => {
    const { overlay } = mergedData.background;
    if (!overlay.enabled) return {};

    return {
      backgroundColor: overlay.color,
      opacity: overlay.opacity,
      mixBlendMode: overlay.blendMode as any,
    };
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      FaWhatsapp: FaWhatsapp,
      Linkedin: Linkedin,
      Instagram: Instagram,
      Twitter: Twitter,
      Facebook: Facebook,
    };
    return iconMap[iconName] || MapPin;
  };

  return (
    <footer
      className="relative w-full"
      style={{
        ...getBackgroundStyle(),
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          undefined,
      }}
    >
      {/* صورة الخلفية */}
      {mergedData.background.type === "image" &&
        mergedData.background.image && (
          <div className="absolute inset-0">
            <Image
              src={mergedData.background.image}
              alt={mergedData.background.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
            />
            <div className="absolute inset-0" style={getOverlayStyle()} />
          </div>
        )}

      {/* المحتوى */}
      <div
        className={`relative z-10 px-4 py-16 text-white`}
        dir="rtl"
        style={{
          padding: `${mergedData.layout.padding}px`,
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
          className={`mx-auto grid max-w-${mergedData.layout.maxWidth} grid-cols-1 gap-${mergedData.layout.spacing} md:grid-cols-${mergedData.layout.columns}`}
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
          {/* العمود الأيمن: عن المكتب */}
          {mergedData.content.companyInfo.enabled && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {/* Logic for determining the logo source with strict priority */}
                {(() => {
                  // 1. Custom Branding (Highest Priority)
                  const brandingLogo = customBranding?.footer?.logo;
                  if (brandingLogo) {
                     return (
                      <div className="flex">
                        <Image
                          src={brandingLogo}
                          alt={customBranding?.footer?.name || mergedData.content.companyInfo.name || tenantData?.branding?.name || tenantData?.websiteName || "Logo"}
                          width={100}
                          height={100}
                          className="rounded-full object-contain"
                        />
                      </div>
                     );
                  }

                  // 2. Merged Data Logo (if not empty string and not default empty)
                  const contentLogo = mergedData.content.companyInfo.logo;
                  if (contentLogo && contentLogo.trim() !== "") {
                     return (
                      <div className="flex">
                        <Image
                          src={contentLogo}
                          alt={mergedData.content.companyInfo.name || tenantData?.branding?.name || "Logo"}
                          width={100}
                          height={100}
                          className="rounded-full object-contain"
                        />
                      </div>
                     );
                  }

                  // 3. Tenant Branding (Fallback)
                  const tenantLogo = tenantData?.branding?.logo;
                  if (tenantLogo) {
                     return (
                      <div className="flex">
                         <Image
                          src={tenantLogo}
                          alt={tenantData?.branding?.name || tenantData?.websiteName || "Logo"}
                          width={100}
                          height={100}
                          className="rounded-full object-contain"
                        />
                      </div>
                     );
                  }

                   // 4. Default / Fallback Icon (If no logo found anywhere)
                  return (
                    <div className="grid size-10 place-items-center rounded-full border border-emerald-500">
                      <MapPin className="size-5" />
                    </div>
                  );
                })()}

                <div>
                  <h3
                    className={`text-lg font-${mergedData.styling.typography.titleWeight} text-white`}
                    style={{
                      fontSize: `var(--${mergedData.styling.typography.titleSize})`,
                    }}
                  >
                    {customBranding?.footer?.name ||
                      mergedData.content.companyInfo.name ||
                      tenantData?.branding?.name ||
                      tenantData?.websiteName ||
                      ""}
                  </h3>
                  <p className="text-sm text-white/80">
                    {mergedData.content.companyInfo.tagline}
                  </p>
                </div>
              </div>
              <h4
                className={`text-xl font-${mergedData.styling.typography.titleWeight}`}
                style={{
                  fontSize: `var(--${mergedData.styling.typography.titleSize})`,
                }}
              >
                عن المكتب
              </h4>
              <p
                className={`text-${mergedData.styling.typography.bodySize} font-${mergedData.styling.typography.bodyWeight} leading-7 text-white/90`}
              >
                {mergedData.content.companyInfo.description}
              </p>
            </div>
          )}

          {/* العمود الأوسط: روابط مهمة */}
          {mergedData.content.quickLinks.enabled && (
            <div className="space-y-4">
              <h4
                className={`text-xl font-${mergedData.styling.typography.titleWeight}`}
                style={{
                  fontSize: `var(--${mergedData.styling.typography.titleSize})`,
                }}
              >
                {mergedData.content.quickLinks.title}
              </h4>
              <nav className="space-y-3">
                {mergedData.content.quickLinks.links.filter((link: any) => link.url).map(
                  (link: any, index: number) => (
                    <Link
                      key={index}
                      href={link.url}
                      className="block text-white/90 transition-colors hover:text-emerald-400"
                      style={{
                        transition: mergedData.styling.effects.hoverTransition,
                      }}
                    >
                      {link.text}
                    </Link>
                  ),
                )}
              </nav>
            </div>
          )}

          {/* العمود الأيسر: معلومات التواصل */}
          {mergedData.content.contactInfo.enabled && (
            <div className="space-y-4">
              <h4
                className={`text-xl font-${mergedData.styling.typography.titleWeight}`}
                style={{
                  fontSize: `var(--${mergedData.styling.typography.titleSize})`,
                }}
              >
                {mergedData.content.contactInfo.title}
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 size-5" />
                  <span
                    className={`text-${mergedData.styling.typography.bodySize} text-white/90`}
                  >
                    {mergedData.content.contactInfo.address}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-5" />
                  <div className="space-y-1">
                    <a
                      href={`tel:${mergedData.content.contactInfo.phone1}`}
                      className={`block text-${mergedData.styling.typography.bodySize} text-white/90 hover:text-emerald-400`}
                      style={{
                        transition: mergedData.styling.effects.hoverTransition,
                      }}
                    >
                      {mergedData.content.contactInfo.phone1}
                    </a>
                    <a
                      href={`tel:${mergedData.content.contactInfo.phone2}`}
                      className={`block text-${mergedData.styling.typography.bodySize} text-white/90 hover:text-emerald-400`}
                      style={{
                        transition: mergedData.styling.effects.hoverTransition,
                      }}
                    >
                      {mergedData.content.contactInfo.phone2}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-5" />
                  <a
                    href={`mailto:${mergedData.content.contactInfo.email}`}
                    className={`text-${mergedData.styling.typography.bodySize} text-white/90 hover:text-emerald-400`}
                    style={{
                      transition: mergedData.styling.effects.hoverTransition,
                    }}
                  >
                    {mergedData.content.contactInfo.email}
                  </a>
                </div>
              </div>

              {/* أيقونات وسائل التواصل الاجتماعي */}
              {mergedData.content.socialMedia.enabled && (
                <div className="flex items-center gap-3 pt-4">
                  {mergedData.content.socialMedia.platforms.map(
                    (platform: any, index: number) => {
                      const IconComponent = getIconComponent(platform.icon);
                      return (
                        <a
                          key={index}
                          href={platform.url}
                          className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-emerald-600"
                          aria-label={platform.name}
                          style={
                            {
                              transition:
                                mergedData.styling.effects.hoverTransition,
                              "--hover-color": platform.color,
                            } as React.CSSProperties
                          }
                        >
                          <IconComponent className="size-5" />
                        </a>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* خط الفصل وحقوق الطبع */}
        {mergedData.footerBottom.enabled && (
          <div
            className={`mx-auto mt-12 max-w-${mergedData.layout.maxWidth} border-t border-white/20 pt-8`}
            style={{ borderColor: mergedData.styling.colors.border }}
          >
            <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-white/70 md:flex-row md:text-right">
              <p className={`text-${mergedData.styling.typography.bodySize}`}>
                {mergedData.footerBottom.copyright}
              </p>
              <div className="flex gap-6">
                {mergedData.footerBottom.legalLinks.filter((link: any) => link.url).map(
                  (link: any, index: number) => (
                    <Link
                      key={index}
                      href={link.url}
                      className="hover:text-emerald-400"
                      style={{
                        transition: mergedData.styling.effects.hoverTransition,
                      }}
                    >
                      {link.text}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
