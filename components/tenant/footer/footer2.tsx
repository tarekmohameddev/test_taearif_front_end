/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/react-in-jsx-scope */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { FaWhatsapp, FaYoutube, FaSnapchat, FaTiktok } from "react-icons/fa";
import { useEditorStore } from "@/context/editorStore";
import useTenantStore from "@/context/tenantStore";
import { getDefaultFooter2Data } from "@/context/editorStoreFunctions/footerFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface Footer2Props {
  // Component-specific props
  visible?: boolean;
  ThemeTwo?: string;
  background?: {
    type?: string;
    image?: string;
    alt?: string;
    color?: string;
    ThemeTwo?: string;
    gradient?: {
      enabled?: boolean;
      direction?: string;
      startColor?: string;
      endColor?: string;
      middleColor?: string;
      ThemeTwo?: string;
    };
    overlay?: {
      enabled?: boolean;
      opacity?: string;
      color?: string;
      blendMode?: string;
      ThemeTwo?: string;
    };
  };
  layout?: {
    columns?: string;
    spacing?: string;
    padding?: string;
    maxWidth?: string;
    ThemeTwo?: string;
  };
  content?: {
    ThemeTwo?: string;
    companyInfo?: {
      enabled?: boolean;
      showCompanyName?: boolean;
      name?: string;
      description?: string;
      tagline?: string;
      logo?: string;
      ThemeTwo?: string;
    };
    newsletter?: {
      enabled?: boolean;
      title?: string;
      description?: string;
      placeholder?: string;
      buttonText?: string;
      ThemeTwo?: string;
    };
    contactInfo?: {
      enabled?: boolean;
      address?: string;
      email?: string;
      whatsapp?: string;
      ThemeTwo?: string;
    };
    socialMedia?: {
      enabled?: boolean;
      platforms?: Array<{
        name?: string;
        url?: string;
        ThemeTwo?: string;
      }>;
      whatsappInquiry?: {
        enabled?: boolean;
        text?: string;
        phoneNumber?: string;
        message?: string;
        buttonColor?: string;
        ThemeTwo?: string;
      };
      ThemeTwo?: string;
    };
  };
  footerBottom?: {
    enabled?: boolean;
    copyright?: string;
    companyUrl?: string;
    designerUrl?: string;
    legalLinks?: Array<{
      text?: string;
      url?: string;
      ThemeTwo?: string;
    }>;
    ThemeTwo?: string;
  };
  styling?: {
    ThemeTwo?: string;
    colors?: {
      textPrimary?: string;
      textSecondary?: string;
      textMuted?: string;
      accent?: string;
      border?: string;
      textAndLinksColor?: string;
      socialMediaIconsColor?: string;
      ThemeTwo?: string;
    };
    typography?: {
      titleSize?: string;
      titleWeight?: string;
      bodySize?: string;
      bodyWeight?: string;
      ThemeTwo?: string;
    };
    spacing?: {
      sectionPadding?: string;
      columnGap?: string;
      itemGap?: string;
      ThemeTwo?: string;
    };
    effects?: {
      hoverTransition?: string;
      shadow?: string;
      borderRadius?: string;
      logoRounded?: boolean;
      ThemeTwo?: string;
    };
  };

  // Editor props (always include these)
  overrideData?: any; // ⭐ NEW: Accept override data directly
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function Footer2(props: Footer2Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "footer2";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const footerStates = useEditorStore((s) => s.footerStates);
  const globalFooterData = useEditorStore((s) => s.globalFooterData); // ⭐ NEW: For global footer support
  const [forceUpdate, setForceUpdate] = useState(0);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Subscribe to website layout for custom branding
  const customBranding = useEditorStore((s) => s.WebsiteLayout.CustomBranding);

  // Check if this is a global footer
  const isGlobalFooter = uniqueId === "global-footer";

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Extract component data from tenantData
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "footer" &&
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
              (component as any).type === "footer" &&
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
      // Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultFooter2Data(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultFooter2Data(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("footer", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = footerStates[uniqueId];
  const currentStoreData = getComponentData("footer", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = useMemo(() => {
    const baseData = isGlobalFooter
      ? {
          ...getDefaultFooter2Data(), // 1. Defaults (lowest priority)
          ...tenantComponentData, // 2. Database data
          ...globalFooterData, // 3. Global footer data
          ...props, // 4. Props
          ...(props.overrideData || {}), // ⭐ NEW: overrideData (highest priority)
        }
      : {
          ...getDefaultFooter2Data(), // 1. Defaults (lowest priority)
          ...tenantComponentData, // 2. Database data
          ...storeData, // 3. Store state
          ...currentStoreData, // 4. Current store data
          ...props, // 5. Props
          ...(props.overrideData || {}), // ⭐ NEW: overrideData (highest priority)
        };


    // Apply branding data with highest priority
    // 1. Custom Branding (from editor store WebsiteLayout)
    if (customBranding?.footer) {
      if (!baseData.content) {
        baseData.content = {};
      }
      if (!baseData.content.companyInfo) {
        baseData.content.companyInfo = {};
      }

      if (customBranding.footer.logo) {
        baseData.content.companyInfo.logo = customBranding.footer.logo;
      }
      if (customBranding.footer.name) {
        baseData.content.companyInfo.name = customBranding.footer.name;
      }
    }

    // 2. Tenant Branding (historical fallback)
    if (tenantData?.branding) {
      if (!baseData.content) {
        baseData.content = {};
      }
      if (!baseData.content.companyInfo) {
        baseData.content.companyInfo = {};
      }

      // Only apply if not already set by customBranding
      if (tenantData.branding.logo && !customBranding?.footer?.logo) {
        baseData.content.companyInfo.logo = tenantData.branding.logo;
      }

      if (tenantData.branding.name && !customBranding?.footer?.name) {
        baseData.content.companyInfo.name = tenantData.branding.name;
      } else if (tenantData.websiteName && !customBranding?.footer?.name) {
        baseData.content.companyInfo.name = tenantData.websiteName;
      }
    }

    // Ensure showCompanyName defaults to true if not set
    if (baseData.content?.companyInfo && baseData.content.companyInfo.showCompanyName === undefined) {
      baseData.content.companyInfo.showCompanyName = true;
    }

    // Ensure showDescription defaults to true if not set
    if (baseData.content?.companyInfo && baseData.content.companyInfo.showDescription === undefined) {
      baseData.content.companyInfo.showDescription = true;
    }

    return baseData;
  }, [
    isGlobalFooter,
    globalFooterData,
    props,
    storeData,
    currentStoreData,
    tenantComponentData,
    forceUpdate,
    tenantData,
  ]);

  // Force re-render when globalFooterData changes (for global footers)
  useEffect(() => {
    if (
      isGlobalFooter &&
      globalFooterData &&
      Object.keys(globalFooterData).length > 0
    ) {
      setForceUpdate((prev) => prev + 1);
    }
  }, [isGlobalFooter, globalFooterData]);

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────
  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith("/dashboard");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  if (isDashboardPage) {
    return null;
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsappNumber) {
      console.log("Subscribing:", whatsappNumber);
      setWhatsappNumber("");
    }
  };

  // دالة لاستبدال "باهية" بـ "تعاريف" و "Baheya" بـ "taearif" تلقائياً
  const replaceBaheya = (text: string | undefined): string => {
    if (!text) return "";
    return text.replace(/باهية/g, "تعاريف").replace(/Baheya/gi, "taearif"); // case-insensitive للغة الإنجليزية
  };

  // Get unified text and links color
  const textAndLinksColor = mergedData.styling?.colors?.textAndLinksColor || "#ffffff";
  const socialMediaIconsColor = mergedData.styling?.colors?.socialMediaIconsColor || textAndLinksColor;

  // Get branding colors from WebsiteLayout (fallback to brown #8b5f46)
  const brandingColors = {
    primary:
      tenantData?.WebsiteLayout?.branding?.colors?.primary &&
      tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.primary
        : "#8b5f46", // Brown fallback
    secondary:
      tenantData?.WebsiteLayout?.branding?.colors?.secondary &&
      tenantData.WebsiteLayout.branding.colors.secondary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.secondary
        : "#8b5f46", // Brown fallback
    accent:
      tenantData?.WebsiteLayout?.branding?.colors?.accent &&
      tenantData.WebsiteLayout.branding.colors.accent.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.accent
        : "#8b5f46", // Brown fallback
  };

  // Helper function to get background color based on useDefaultColor and globalColorType
  const getBackgroundColor = (): string => {
    const colorField = mergedData?.background?.color;

    // Get useDefaultColor and globalColorType from the color field
    let useDefaultColorValue: boolean | undefined;
    let globalColorTypeValue: string | undefined;

    if (colorField && typeof colorField === "object" && !Array.isArray(colorField)) {
      useDefaultColorValue = colorField.useDefaultColor;
      globalColorTypeValue = colorField.globalColorType;
    }

    // Check useDefaultColor value (default is false for custom color)
    const useDefaultColor = useDefaultColorValue !== undefined ? useDefaultColorValue : false;

    // If useDefaultColor is true, use branding color from WebsiteLayout
    if (useDefaultColor) {
      const globalColorType = (globalColorTypeValue || "primary") as keyof typeof brandingColors;
      const brandingColor = brandingColors[globalColorType] || brandingColors.primary;
      return brandingColor;
    }

    // If useDefaultColor is false, try to get custom color
    // The color is stored as a string directly at background.color
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

    // Final fallback: use brown color (default custom color)
    return "#8b5f46";
  };

  // Function to get background style based on background type
  const getBackgroundStyle = (): React.CSSProperties => {
    const { background } = mergedData;
    const bgType = background?.type || "color";

    if (bgType === "image" && background?.image) {
      // Image background - return empty style, image will be rendered separately
      return {};
    } else if (bgType === "color") {
      // Color background - use getBackgroundColor() to support branding colors
      return { backgroundColor: getBackgroundColor() };
    } else if (bgType === "none") {
      // No background
      return {};
    }
    
    // Default fallback - use color
    return { backgroundColor: getBackgroundColor() };
  };

  // Get footer background color for form elements (only when type is "color")
  const footerBgColor = getBackgroundColor();

  // Function to darken a hex color
  const darkenColor = (hex: string, percent: number): string => {
    // Remove # if present
    const color = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    // Darken each component
    const newR = Math.max(0, Math.floor(r * (1 - percent / 100)));
    const newG = Math.max(0, Math.floor(g * (1 - percent / 100)));
    const newB = Math.max(0, Math.floor(b * (1 - percent / 100)));
    
    // Convert back to hex
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  };
  
  const darkerBgColor = darkenColor(footerBgColor, 15); // Darken by 15%

  // Create dynamic style for placeholder color
  useEffect(() => {
    const styleId = 'footer2-newsletter-input-placeholder';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    // Convert hex to rgba for 70% opacity
    const hexToRgba = (hex: string, opacity: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    
    const placeholderColor = hexToRgba(textAndLinksColor, 0.7);
    styleElement.textContent = `
      input[type="tel"].footer2-newsletter-input::placeholder {
        color: ${placeholderColor} !important;
      }
    `;
    
    return () => {
      // Cleanup on unmount
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [textAndLinksColor]);

  // Function to get icon component based on icon name or platform name (for backward compatibility)
  const getIconComponent = (iconName?: string, platformName?: string) => {
    const iconMap: { [key: string]: any } = {
      // Icon names (new format)
      FaWhatsapp: FaWhatsapp,
      Linkedin: Linkedin,
      Instagram: Instagram,
      Twitter: Twitter,
      Facebook: Facebook,
      Youtube: FaYoutube,
      Snapchat: FaSnapchat,
      Tiktok: FaTiktok,
      // Platform names (old format - fallback)
      "YouTube": FaYoutube,
      "X (Twitter)": Twitter,
      "TikTok": FaTiktok,
    };
    return iconMap[iconName || platformName || ""] || MapPin;
  };

  // Get social media position
  const socialMediaPosition = mergedData.content?.socialMedia?.position || "bottom";

  // Component to render Social Media Icons
  const renderSocialMediaIcons = () => {
    if (!mergedData.content?.socialMedia?.enabled) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {mergedData.content?.socialMedia?.platforms?.map(
            (platform: any, index: number) => {
              // Check if this is Twitter/X icon - use custom image instead
              const isTwitter = platform.icon === "Twitter" || platform.name === "Twitter" || platform.name === "X (Twitter)";
              
              return (
                <a
                  key={index}
                  href={platform.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-10 place-items-center rounded-full transition-colors"
                  aria-label={platform.name}
                  style={
                    {
                      backgroundColor: darkerBgColor,
                      color: socialMediaIconsColor,
                      transition: mergedData.styling?.effects?.hoverTransition || "0.3s",
                      "--hover-color": platform.color,
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = darkenColor(footerBgColor, 25);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = darkerBgColor;
                  }}
                >
                  {isTwitter ? (
                    <Image
                      src="/images/icons/x-twitter.png"
                      alt="X (Twitter)"
                      width={20}
                      height={20}
                      className="size-5 object-contain"
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
                  ) : (
                    (() => {
                      const IconComponent = getIconComponent(platform.icon, platform.name);
                      return <IconComponent className="size-5" />;
                    })()
                  )}
                </a>
              );
            },
          )}
        </div>
      </div>
    );
  };

  // Component to render WhatsApp Inquiry Button
  const renderWhatsAppButton = () => {
    if (!mergedData.content?.socialMedia?.whatsappInquiry?.enabled) return null;
    
    return (
      <a
        href={`https://wa.me/${(mergedData.content?.socialMedia?.whatsappInquiry?.phoneNumber || mergedData.content?.contactInfo?.whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent(
          mergedData.content?.socialMedia?.whatsappInquiry?.message || "مرحباً، أريد الاستفسار عن"
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2"
        style={{ 
          color: textAndLinksColor,
          backgroundColor: mergedData.content?.socialMedia?.whatsappInquiry?.buttonColor || darkerBgColor,
        }}
        onMouseEnter={(e) => {
          const baseColor = mergedData.content?.socialMedia?.whatsappInquiry?.buttonColor || darkerBgColor;
          // Darken color by 10% on hover
          const hex = baseColor.replace('#', '');
          if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const newR = Math.max(0, Math.floor(r * 0.9));
            const newG = Math.max(0, Math.floor(g * 0.9));
            const newB = Math.max(0, Math.floor(b * 0.9));
            const toHex = (n: number) => {
              const hex = n.toString(16);
              return hex.length === 1 ? '0' + hex : hex;
            };
            e.currentTarget.style.backgroundColor = `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
          }
        }}
        onMouseLeave={(e) => {
          const baseColor = mergedData.content?.socialMedia?.whatsappInquiry?.buttonColor || darkerBgColor;
          e.currentTarget.style.backgroundColor = baseColor;
        }}
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5 fill-current"
          viewBox="0 0 448 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 339.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56 81.2 56 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
        </svg>
        {replaceBaheya(
          mergedData.content?.socialMedia?.whatsappInquiry?.text || "استفسر عن طريق الواتساب"
        )}
      </a>
    );
  };

  // Get background style and type
  const backgroundStyle = getBackgroundStyle();
  const bgType = mergedData.background?.type || "color";

  // Get dynamic padding values from mergedData
  // These values come from the paddingYGroup fields in componentsStructure/footer.ts (lines 962-990)
  // The fields use full paths: styling.spacing.paddingYMobile/Tablet/Desktop
  const paddingYMobile = mergedData.styling?.spacing?.paddingYMobile || "16";
  const paddingYTablet = mergedData.styling?.spacing?.paddingYTablet || "20";
  const paddingYDesktop = mergedData.styling?.spacing?.paddingYDesktop || "24";

  // Convert padding values to rem (Tailwind: 16 = 4rem, 20 = 5rem, 24 = 6rem)
  const convertToRem = (value: string): string => {
    const numValue = parseInt(value) || 16;
    return `${numValue * 0.25}rem`;
  };

  // Build dynamic style for padding (mobile first)
  const paddingStyle: React.CSSProperties = {
    paddingTop: convertToRem(paddingYMobile),
    paddingBottom: convertToRem(paddingYMobile),
    ...backgroundStyle,
  };

  // Add responsive padding via style tag for tablet and desktop breakpoints
  useEffect(() => {
    const styleId = 'footer2-responsive-padding';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    const pyTablet = convertToRem(paddingYTablet);
    const pyDesktop = convertToRem(paddingYDesktop);
    
    styleElement.textContent = `
      @media (min-width: 768px) {
        footer[data-footer-id="${uniqueId}"] {
          padding-top: ${pyTablet} !important;
          padding-bottom: ${pyTablet} !important;
        }
      }
      @media (min-width: 1024px) {
        footer[data-footer-id="${uniqueId}"] {
          padding-top: ${pyDesktop} !important;
          padding-bottom: ${pyDesktop} !important;
        }
      }
    `;
    
    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        element.remove();
      }
    };
  }, [paddingYTablet, paddingYDesktop, uniqueId]);

  return (
    <>
      <footer
        className="relative z-10"
        style={paddingStyle}
        data-footer-id={uniqueId}
      >
        {/* Background Image - Only show when type is "image" */}
        {bgType === "image" && mergedData.background?.image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={mergedData.background.image}
              alt={mergedData.background.alt || "Footer background"}
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
            />
            {/* Overlay - Only show when enabled and type is "image" */}
            {mergedData.background?.overlay?.enabled && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: mergedData.background.overlay.color,
                  opacity: mergedData.background.overlay.opacity || "0.7",
                  mixBlendMode: mergedData.background.overlay.blendMode as any || "multiply",
                }}
              />
            )}
          </div>
        )}
        <div className="container mx-auto px-4 max-w-[1400px] relative z-10" style={{ color: textAndLinksColor }}>
          {/* Main Content Section */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 mb-12">
            {/* Right Section - Company Info */}
            <div className="w-full lg:w-1/2 xl:w-2/5">
              <div className="flex items-center gap-3 mb-6">
                {(customBranding?.footer?.logo || mergedData.content?.companyInfo?.logo || tenantData?.branding?.logo) ? (
                  <div className="flex">
                    <Image
                      src={customBranding?.footer?.logo || mergedData.content?.companyInfo?.logo || tenantData?.branding?.logo}
                      alt={replaceBaheya(
                        customBranding?.footer?.name ||
                          mergedData.content?.companyInfo?.name ||
                          tenantData?.branding?.name ||
                          tenantData?.websiteName ||
                          "Baheya Real Estate",
                      )}
                      width={mergedData.styling?.المقاسات?.logo?.width ?? 100}
                      height={mergedData.styling?.المقاسات?.logo?.height ?? 100}
                      className={(mergedData.styling?.effects?.logoRounded !== false ? "rounded-full " : "") + "object-contain"}
                    />
                  </div>
                ) : (
                  <Link href="/" className="block">
                    <div 
                      className="relative"
                      style={{
                        width: mergedData.styling?.المقاسات?.logo?.width ?? 192,
                        height: mergedData.styling?.المقاسات?.logo?.height ?? 128,
                      }}
                    >
                      <Image
                        src="/images/main/logo.png"
                        alt="تعاريف العقارية"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Link>
                )}
                {(mergedData.content?.companyInfo?.showCompanyName ?? true) && 
                 (customBranding?.footer?.name || mergedData.content?.companyInfo?.name || tenantData?.branding?.name || tenantData?.websiteName) && (
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: textAndLinksColor }}>
                      {replaceBaheya(
                        customBranding?.footer?.name ||
                          mergedData.content?.companyInfo?.name ||
                          tenantData?.branding?.name ||
                          tenantData?.websiteName ||
                          ""
                      )}
                    </h3>
                    {mergedData.content?.companyInfo?.tagline && (
                      <p className="text-sm" style={{ color: textAndLinksColor, opacity: 0.8 }}>
                        {replaceBaheya(mergedData.content.companyInfo.tagline)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <ul className="space-y-4 mb-6">
                <li className="flex items-center gap-3">
                  <span className="flex-shrink-0">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 384 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
                    </svg>
                  </span>
                  <span className="text-base" style={{ color: textAndLinksColor }}>
                    {replaceBaheya(mergedData.content?.contactInfo?.address)}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <a
                    href={`mailto:${mergedData.content?.contactInfo?.email}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <span className="flex-shrink-0">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"></path>
                      </svg>
                    </span>
                    <span className="text-base" style={{ color: textAndLinksColor }}>
                      {replaceBaheya(mergedData.content?.contactInfo?.email)}
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/${mergedData.content?.contactInfo?.whatsapp?.replace(/\D/g, "") || ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <span className="flex-shrink-0">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path>
                      </svg>
                    </span>
                    <span className="text-base" style={{ color: textAndLinksColor }}>
                      {replaceBaheya(mergedData.content?.contactInfo?.whatsapp)}
                    </span>
                  </a>
                </li>
              </ul>

              {/* Social Media - Right Side Position (below contact numbers) */}
              {socialMediaPosition === "right_side" && (
                <div className="mb-6">
                  {renderSocialMediaIcons()}
                  {renderWhatsAppButton()}
                </div>
              )}

              {/* Company Description */}
              {(mergedData.content?.companyInfo?.showDescription === true) && (
                <p className="text-base leading-relaxed" style={{ color: textAndLinksColor, opacity: 0.9 }}>
                  {replaceBaheya(
                    mergedData.content?.companyInfo?.description ||
                      "نحن هنا لمساعدتك في كل خطوة — من البحث عن العقار المناسب، إلى إتمام المعاملة بكل احترافية وشفافية.",
                  )}
                </p>
              )}
            </div>  


          <div className="flex flex-col lg:flex-col items-center justify-center">
            {/* Social Media - Top Position (in left side, at the top) */}
            {socialMediaPosition === "top" && (
              <div className="w-full lg:w-1/2 xl:w-4/5 mb-6">
                {renderSocialMediaIcons()}
                {renderWhatsAppButton()}
              </div>
            )}

            {/* Left Section - Newsletter */}
            {mergedData.content?.newsletter?.enabled && (

            <div className="w-full lg:w-1/2 xl:w-4/5 ">
              <h5 className="text-xl font-bold mb-4" style={{ color: textAndLinksColor }}>
                {replaceBaheya(
                  mergedData.content?.newsletter?.title ||
                    "اشترك في النشرة البريدية",
                )}
              </h5> 
              <p className="text-base leading-relaxed mb-6" style={{ color: textAndLinksColor, opacity: 0.9 }}>
                {replaceBaheya(
                  mergedData.content?.newsletter?.description ||
                    "كن أول من يتلقى آخر العروض، والأخبار العقارية، ونصائح الاستثمار من فريق تعاريف العقارية. املأ خانة رقم الواتساب وسنوافيك بكل جديد",
                )}
              </p>

              {/* Newsletter Form */}
              {(mergedData.content?.newsletter?.formEnabled ?? true) && (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row gap-3 mb-8"
                >
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder={replaceBaheya(
                      mergedData.content?.newsletter?.placeholder ||
                        "رقم الواتساب",
                    )}
                    required
                    pattern="[0-9()#&+*-=.]+"
                    title="يتم قبول الأرقام وأحرف الهاتف فقط (#، - ، *، إلخ)."
                    className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 footer2-newsletter-input"
                    style={{ 
                      color: textAndLinksColor,
                      backgroundColor: darkerBgColor,
                    }}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                    style={{ 
                      color: textAndLinksColor,
                      backgroundColor: darkerBgColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkenColor(footerBgColor, 25);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkerBgColor;
                    }}
                  >
                    {replaceBaheya(
                      mergedData.content?.newsletter?.buttonText || "اشترك الآن",
                    )}
                  </button>
                </form>
              )}
              </div>
)}

            {/* Social Media - Left Position (in left side, aligned to right) */}
            {socialMediaPosition === "left" && (
              <div className="w-full lg:w-1/2 xl:w-4/5 flex items-end justify-end">
                <div>
                  {renderSocialMediaIcons()}
                  {renderWhatsAppButton()}
                </div>
              </div>
            )}

            {/* Social Media - Right Position (in left side, aligned to left) */}
            {socialMediaPosition === "right" && (
              <div className="w-full lg:w-1/2 xl:w-4/5 flex items-start">
                <div>
                  {renderSocialMediaIcons()}
                  {renderWhatsAppButton()}
                </div>
              </div>
            )}

            {/* Social Media - Bottom Position (in left side, at the bottom) */}
            {socialMediaPosition === "bottom" && (
              <div className="w-full lg:w-1/2 xl:w-4/5 mt-auto">
                {renderSocialMediaIcons()}
                {renderWhatsAppButton()}
              </div>
            )}
            </div>
            </div>

          {/* Bottom Section - Copyright and Links */}
          {(mergedData.footerBottom?.enabled !== false && mergedData.footerBottom) && (
            <div className="border-t border-white/20 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-base text-center md:text-right" style={{ color: textAndLinksColor, opacity: 0.9 }}>
                  {(() => {
                    const copyright =
                      mergedData.footerBottom?.copyright ||
                      `جميع الحقوق محفوظة لشركة تعاريف العقارية 2025©`;
                    // إزالة " | صمم من طرف وكالة سهيل" تلقائياً إذا كان موجوداً
                    let cleaned = copyright.replace(
                      /\s*\|\s*صمم من طرف وكالة سهيل\s*/g,
                      "",
                    );
                    // استبدال "باهية" بـ "تعاريف" تلقائياً
                    return replaceBaheya(cleaned);
                  })()}
                </p>
                <div className="flex items-center gap-6">
                  {mergedData.footerBottom?.legalLinks?.filter((link: any) => link.url).map(
                    (link: any, index: number) => (
                      <Link
                        key={index}
                        href={link.url || "#"}
                        className="text-base hover:underline"
                        style={{ color: textAndLinksColor }}
                      >
                        {replaceBaheya(link.text)}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </footer>
    </>
  );
}
