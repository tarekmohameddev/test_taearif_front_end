"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn, toDimension } from "@/lib/utils";
import useStore from "@/context/Store";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { getDefaultHeaderData as getDefaultHeaderDataFromFunctions } from "@/context/editorStoreFunctions/headerFunctions";
import { logChange } from "@/lib/debugLogger";
import { CustomDropdown, DropdownItem, DropdownSubMenu } from "@/components/customComponents/customDropdownWithSUB";
import SidebarMenu from "./SidebarMenu";

// Default header data
const getDefaultHeaderData = () => ({
  visible: true,
  position: {
    type: "sticky",
    top: 0,
    zIndex: 50,
  },
  height: {
    desktop: 96,
    tablet: 80,
    mobile: 64,
  },
  background: {
    type: "solid",
    opacity: "0.8",
    blur: true,
    colors: {
      from: "#ffffff",
      to: "#ffffff",
    },
  },
  colors: {
    text: "#1f2937",
    link: "#374151",
    linkHover: "#1f2937",
    linkActive: "#059669",
    icon: "#374151",
    iconHover: "#1f2937",
    border: "#e5e7eb",
    accent: "#059669",
  },
  logo: {
    type: "image+text",
    image: "https://dalel-lovat.vercel.app/images/logo.svg",
    text: "الشركة العقارية",
    font: {
      family: "Tajawal",
      size: 24,
      weight: "600",
    },
    url: "/",
    clickAction: "navigate",
  },
  menu: [
    {
      id: "home",
      type: "link",
      text: "الرئيسية",
      url: "/",
    },
    {
      id: "about",
      type: "link",
      text: "حول",
      url: "/about-us",
    },
    {
      id: "services",
      type: "link",
      text: "الخدمات",
      url: "/services",
    },
    {
      id: "contact",
      type: "link",
      text: "اتصل بنا",
      url: "/contact-us",
    },
  ],
  actions: {
    search: {
      enabled: false,
      placeholder: "بحث...",
    },
    user: {
      showProfile: true,
      showCart: false,
      showWishlist: false,
      showNotifications: false,
    },
    mobile: {
      showLogo: true,
      showLanguageToggle: false,
      showSearch: false,
    },
  },
  responsive: {
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1280,
    },
    mobileMenu: {
      side: "right",
      width: 320,
      overlay: true,
    },
  },
  animations: {
    menuItems: {
      enabled: true,
      duration: 200,
      delay: 50,
    },
    mobileMenu: {
      enabled: true,
      duration: 300,
      easing: "ease-in-out",
    },
  },
});

interface HeaderProps {
  visible?: boolean;
  position?: {
    type?: "static" | "sticky" | "fixed";
    top?: number;
    zIndex?: number;
  };
  height?: {
    desktop?: number;
    tablet?: number;
    mobile?: number;
  };
  background?: {
    type?: "solid" | "gradient";
    opacity?: string;
    blur?: boolean;
    colors?: {
      from?: string;
      to?: string;
    };
  };
  colors?: {
    text?: string;
    link?: string;
    linkHover?: string;
    linkActive?: string;
    icon?: string;
    iconHover?: string;
    border?: string;
    accent?: string;
  };
  logo?: {
    type?: "image+text" | "image" | "text";
    image?: string;
    text?: string;
    font?: {
      family?: string;
      size?: number;
      weight?: string;
    };
    url?: string;
    clickAction?: "navigate" | "none";
  };
  menu?: Array<{
    id?: string;
    type?: "link" | "mega_menu" | "dropdown" | "button";
    text?: string;
    icon?: string;
    url?: string;
  }>;
  actions?: {
    search?: {
      enabled?: boolean;
      placeholder?: string;
    };
    user?: {
      showProfile?: boolean;
      showCart?: boolean;
      showWishlist?: boolean;
      showNotifications?: boolean;
    };
    mobile?: {
      showLogo?: boolean;
      showLanguageToggle?: boolean;
      showSearch?: boolean;
    };
  };
  responsive?: {
    breakpoints?: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
    mobileMenu?: {
      side?: "left" | "right";
      width?: number;
      overlay?: boolean;
    };
  };
  animations?: {
    menuItems?: {
      enabled?: boolean;
      duration?: number;
      delay?: number;
    };
    mobileMenu?: {
      enabled?: boolean;
      duration?: number;
      easing?: string;
    };
  };
  // Editor props
  overrideData?: any;
  variant?: string;
  useStore?: boolean;
  id?: string;
}

const Header1 = (props: HeaderProps = {}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "header1";
  const uniqueId = props.id || variantId;

  // Force re-render state
  const [forceUpdate, setForceUpdate] = useState(0);

  // Check if this is a global header
  const isGlobalHeader =
    variantId === "global-header" || uniqueId === "global-header";


  // Subscribe to editor store updates for this header variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  // Subscribe to global components data with explicit selector
  const globalHeaderData = useEditorStore(
    useCallback((state) => state.globalHeaderData, []),
  );

  // Debug: Log globalHeaderData changes
  useEffect(() => {}, [globalHeaderData, isGlobalHeader, uniqueId]);

  // Subscribe to header states for real-time updates
  const headerStates = useEditorStore((s) => s.headerStates);
  const currentStoreData = headerStates[uniqueId] || {};

  useEffect(() => {
    if (props.useStore) {
      // ⭐ CRITICAL: Use getState() directly to avoid dependency issues
      // ensureComponentVariant is stable but including it in deps can cause loops
      const store = useEditorStore.getState();
      store.ensureComponentVariant("header", uniqueId, props);
    }
    // ⭐ CRITICAL: Only depend on uniqueId and props.useStore
    // Don't include ensureComponentVariant to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueId, props.useStore]);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Subscribe to website layout for custom branding
  const customBranding = useEditorStore((s) => s.WebsiteLayout.CustomBranding);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("header", uniqueId) || {}
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
            (component as any).type === "header" &&
            (component as any).componentName === variantId &&
            componentId === uniqueId
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // Get default data once
  const defaultData = useMemo(() => getDefaultHeaderDataFromFunctions(), []);

  // Merge data with priority:
  // overrideData > globalHeaderData (if global) > currentStoreData > storeData > tenantComponentData > props > default
  const mergedData = useMemo(() => {
    const fallbackData = defaultData;
    
    // Start with base data
    let result = {
      ...fallbackData,
      ...props,
      ...tenantComponentData,
      ...storeData,
      ...currentStoreData,
    };

    // If it's a global header, incorporate globalHeaderData (highest priority from store)
    if (isGlobalHeader) {
      result = {
        ...result,
        ...globalHeaderData,
      };
    }

    // Apply overrideData (highest priority altogether, used by Live Editor sidebar)
    if (props.overrideData) {
      result = {
        ...result,
        ...props.overrideData,
      };
    }

    // ⭐ CRITICAL: Deep merge logic for nested objects
    if (result.background) {
      result.background = {
        ...fallbackData.background,
        ...props.background,
        ...tenantComponentData.background,
        ...storeData.background,
        ...currentStoreData.background,
        ...(isGlobalHeader ? globalHeaderData?.background : {}),
        ...(props.overrideData?.background || {}),
      };
    }

    if (result.colors) {
      result.colors = {
        ...fallbackData.colors,
        ...props.colors,
        ...tenantComponentData.colors,
        ...storeData.colors,
        ...currentStoreData.colors,
        ...(isGlobalHeader ? globalHeaderData?.colors : {}),
        ...(props.overrideData?.colors || {}),
      };
    }

    if (result.logo) {
      result.logo = {
        ...fallbackData.logo,
        ...props.logo,
        ...tenantComponentData.logo,
        ...storeData.logo,
        ...currentStoreData.logo,
        ...(isGlobalHeader ? globalHeaderData?.logo : {}),
        ...(props.overrideData?.logo || {}),
      };
    }

    // Apply branding data with high priority, but respect overrides
    // 1. Custom Branding (from editor store WebsiteLayout)
    if (customBranding?.header) {
      if (!result.logo) result.logo = {} as any;

      if (customBranding.header.logo && !props.overrideData?.logo?.image) {
        result.logo.image = customBranding.header.logo;
      }
      if (customBranding.header.name && !props.overrideData?.logo?.text) {
        result.logo.text = customBranding.header.name;
      }
    }

    // 2. Tenant Branding (historical fallback)
    if (tenantData?.branding) {
      if (!result.logo) result.logo = {} as any;

      if (tenantData.branding.logo && !customBranding?.header?.logo && !props.overrideData?.logo?.image) {
        result.logo.image = tenantData.branding.logo;
      }

      if (tenantData.branding.name && !customBranding?.header?.name && !props.overrideData?.logo?.text) {
        result.logo.text = tenantData.branding.name;
      } else if (tenantData.websiteName && !customBranding?.header?.name && !props.overrideData?.logo?.text) {
        result.logo.text = tenantData.websiteName;
      }
    }

    return result;
  }, [
    isGlobalHeader,
    defaultData,
    globalHeaderData,
    currentStoreData,
    props,
    tenantComponentData,
    storeData,
    tenantData,
    customBranding,
  ]);

  // Resolve branding colors: when editor stores { useDefaultColor, globalColorType }, resolve to actual hex
  // Prefer editor store (live preview) then tenantData (saved site)
  const editorWebsiteLayout = useEditorStore((s) => s.WebsiteLayout);
  const brandingColors =
    editorWebsiteLayout?.branding?.colors ??
    tenantData?.WebsiteLayout?.branding?.colors;
  const resolveColor = useCallback(
    (raw: unknown, fallback: string): string => {
      if (raw == null) return fallback;
      if (typeof raw === "string" && raw.trim().length > 0) return raw;
      if (typeof raw === "object" && !Array.isArray(raw)) {
        const o = raw as Record<string, unknown>;
        if (o.useDefaultColor && typeof o.globalColorType === "string" && brandingColors) {
          const hex =
            brandingColors[o.globalColorType as keyof typeof brandingColors];
          if (typeof hex === "string") return hex;
        }
        const v = o.value ?? o.color;
        if (typeof v === "string") return v;
      }
      return fallback;
    },
    [brandingColors],
  );

  const resolvedColors = useMemo(() => {
    const c = mergedData.colors;
    const def = (key: keyof NonNullable<typeof c>, fallback: string) =>
      resolveColor(c?.[key], fallback);
    return {
      text: def("text", "#1f2937"),
      link: def("link", "#374151"),
      linkHover: def("linkHover", "#1f2937"),
      linkActive: def("linkActive", "#059669"),
      icon: def("icon", "#374151"),
      iconHover: def("iconHover", "#1f2937"),
      border: def("border", "#e5e7eb"),
      accent: def("accent", "#059669"),
    };
  }, [mergedData.colors, resolveColor]);

  // Sidebar (الجوال) props from mergedData.sidebarMobile with fallback for background
  const sidebarMobileProps = useMemo(() => {
    const sm = mergedData.sidebarMobile;
    const headerBgFallback = mergedData.background?.colors?.from || "#ffffff";
    const bgType = sm?.background?.type ?? "color";
    const bgColorResolved =
      bgType === "color"
        ? resolveColor(sm?.background?.color, headerBgFallback)
        : undefined;
    return {
      sidebarBackground: {
        type: bgType,
        color: bgColorResolved,
        image: bgType === "image" ? sm?.background?.image : undefined,
        imageOpacity: typeof sm?.background?.imageOpacity === "number" ? sm.background.imageOpacity : 1,
      },
      showLogo: sm?.showLogo !== false,
      showCompanyName: sm?.showCompanyName !== false,
      textColors:
        sm?.textColors
          ? {
              heading: resolveColor(sm.textColors.heading, "#1c1917"),
              link: resolveColor(sm.textColors.link, "#44403c"),
              text: resolveColor(sm.textColors.text, "#57534e"),
            }
          : undefined,
      overlay:
        sm?.overlay?.color != null || sm?.overlay?.opacity != null
          ? {
              color: typeof sm.overlay.color === "string" ? sm.overlay.color : "#000000",
              opacity: typeof sm.overlay.opacity === "number" ? sm.overlay.opacity : 0.4,
            }
          : undefined,
    };
  }, [mergedData.sidebarMobile, mergedData.background?.colors?.from, resolveColor]);

  // Force re-render when globalHeaderData changes
  useEffect(() => {
    if (globalHeaderData) {
      setForceUpdate((prev) => prev + 1);
    }
  }, [globalHeaderData]);

  // Debug logging for global header changes
  useEffect(() => {
    logChange(uniqueId, "header1", "header", mergedData, "GLOBAL_HEADER");
  }, [uniqueId, mergedData, forceUpdate]);

  // Force re-render when globalHeaderData changes
  useEffect(() => {
    if (globalHeaderData) {
      // This will trigger a re-render when globalHeaderData changes
    }
  }, [globalHeaderData, mergedData, forceUpdate]);



  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const cartCount = useStore((state) => state.cart?.items?.length || 0);
  const router = useRouter();

  // Mobile menu item component is no longer needed here as it's moved to SidebarMenu
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Generate nav links from merged data
  const navLinks = useMemo(
    () =>
      mergedData.menu?.map((item: any) => ({
        name: item.text || item.id || "Link",
        href: item.url?.startsWith("http")
          ? item.url
          : tenantId
            ? `${item.url}`
            : item.url || "/",
        type: item.type,
        id: item.id,
        submenu: item.submenu,
      })) || [],
    [mergedData.menu, tenantId],
  );

  // Recursive function for desktop menu...
  const renderMenuItem = useCallback((item: any, level: number = 0): React.ReactNode => {
    // If item has submenu, render as DropdownSubMenu
    if (item.submenu && Array.isArray(item.submenu) && item.submenu.length > 0) {
      return (
        <DropdownSubMenu key={item.id || item.text} trigger={item.text || item.name}>
          {item.submenu.map((submenuSection: any) => {
            // Handle submenu sections (for mega_menu structure)
            if (submenuSection.items && Array.isArray(submenuSection.items)) {
              return submenuSection.items.map((subItem: any) => renderMenuItem(subItem, level + 1));
            }
            // Handle direct submenu items
            return renderMenuItem(submenuSection, level + 1);
          })}
        </DropdownSubMenu>
      );
    }

    // Regular menu item
    const href = item.url?.startsWith("http")
      ? item.url
      : tenantId
        ? `${item.url || item.path || "/"}`
        : item.url || item.path || "/";

    return (
      <DropdownItem
        key={item.id || item.text || item.name}
        onClick={() => {
          if (href && href !== "#") {
            router.push(href);
          }
        }}
      >
        <div className="w-full">
          {item.text || item.name}
        </div>
      </DropdownItem>
    );
  }, [tenantId, router]);

  // Render desktop menu item...
  const renderDesktopMenuItem = useCallback((item: any, index: number) => {
    const href = item.href || item.url || "/";
    const isActive = pathname === href;

    // If dropdown or mega_menu with submenu, use CustomDropdown
    if ((item.type === "dropdown" || item.type === "mega_menu") && item.submenu && Array.isArray(item.submenu) && item.submenu.length > 0) {
      return (
        <CustomDropdown
          key={item.id || `menu-item-${index}`}
          trigger={
            <span
              className={cn("header1-nav-link relative pb-2 text-xl font-medium transition-colors", isActive && "font-semibold")}
              {...(isActive ? { "aria-current": "page" as const } : {})}
            >
              {item.name}
              {isActive && (
                <span
                  className="pointer-events-none absolute inset-x-0 -bottom-[6px] mx-auto block h-[2px] w-8 rounded-full"
                  style={{
                    backgroundColor: resolvedColors.accent,
                  }}
                />
              )}
            </span>
          }
          triggerClassName="bg-transparent border-0 ring-0 shadow-none hover:bg-transparent p-0"
          iconColor={
            mergedData.styling?.textColor || (isActive ? resolvedColors.linkActive : resolvedColors.link)
          }
        >
          {item.submenu.map((submenuSection: any) => {
            if (submenuSection.items && Array.isArray(submenuSection.items)) {
              return submenuSection.items.map((subItem: any) => renderMenuItem(subItem));
            }
            return renderMenuItem(submenuSection);
          })}
        </CustomDropdown>
      );
    }

    // Regular link
    return (
      <Link
        key={item.id || `menu-item-${index}`}
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={cn("header1-nav-link relative pb-2 text-xl font-medium transition-colors", isActive && "font-semibold")}
      >
        {item.name}
        {isActive && (
          <span
            className="pointer-events-none absolute inset-x-0 -bottom-[6px] mx-auto block h-[2px] w-8 rounded-full"
            style={{
              backgroundColor: resolvedColors.accent,
            }}
          />
        )}
      </Link>
    );
  }, [pathname, mergedData, resolvedColors, renderMenuItem]);

  // Generate dynamic styles
  const headerStyles = useMemo(
    () => ({
      position: mergedData.position?.type || "sticky",
      top: `${mergedData.position?.top || 0}px`,
      zIndex: mergedData.position?.zIndex || 50,
      background:
        mergedData.background?.type === "gradient"
          ? `linear-gradient(90deg, ${mergedData.background?.colors?.from || "#ffffff"} 0%, ${mergedData.background?.colors?.to || "#ffffff"} 100%)`
          : mergedData.background?.colors?.from ||
            mergedData.styling?.bgColor ||
            "#ffffff",
      opacity: mergedData.background?.opacity || "0.8",
      backdropFilter: mergedData.background?.blur ? "blur(8px)" : undefined,
      height: toDimension(mergedData.height?.desktop, "px", "96px"),
      borderBottom: `1px solid ${resolvedColors.border}`,
      // Nav link colors (used by scoped CSS for default / hover / active)
      ["--header-link" as string]: mergedData.styling?.textColor || resolvedColors.link,
      ["--header-link-hover" as string]: mergedData.styling?.textColor || resolvedColors.linkHover,
      ["--header-link-active" as string]: resolvedColors.linkActive,
    }),
    [mergedData, resolvedColors.border, resolvedColors.link, resolvedColors.linkHover, resolvedColors.linkActive],
  );


  const logoStyles = useMemo(
    () => ({
      fontFamily: mergedData.logo?.font?.family || "Tajawal",
      fontWeight: mergedData.logo?.font?.weight || "600",
      fontSize: `${mergedData.logo?.font?.size || 24}px`,
      color: mergedData.styling?.textColor || resolvedColors.text,
    }),
    [mergedData, resolvedColors.text],
  );

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  const navLinkScope = `header1-nav-${uniqueId}`;

  return (
    <>
      <header
        key={`header-global-${uniqueId}-${forceUpdate}-${JSON.stringify(mergedData.background?.colors)}`}
        className="w-full transition-all duration-300"
        style={headerStyles as any}
        dir="rtl"
        data-debug="header-component"
      >
        <style dangerouslySetInnerHTML={{
          __html: `[data-header-nav="${navLinkScope}"] .header1-nav-link{color:var(--header-link);transition:color .2s}[data-header-nav="${navLinkScope}"] .header1-nav-link:hover{color:var(--header-link-hover)}[data-header-nav="${navLinkScope}"] .header1-nav-link[aria-current="page"]{color:var(--header-link-active)}`,
        }} />
        <div className="mx-auto flex h-full max-w-[1600px] items-center gap-4 px-4">
          {/* Logo */}
          <Link
            href={mergedData.logo?.url || "/"}
            className="flex items-center gap-2"
            style={{
              color: mergedData.styling?.textColor || resolvedColors.text,
            }}
          >
            {mergedData.logo?.type !== "text" && (customBranding?.header?.logo || mergedData.logo?.image || tenantData?.branding?.logo) && (
              <img
                src={customBranding?.header?.logo || mergedData.logo?.image || tenantData?.branding?.logo}
                alt={customBranding?.header?.name || mergedData.logo?.text || tenantData?.branding?.name || tenantData?.websiteName || "Logo"}
                className="h-full max-h-16 w-auto object-contain"
                style={{
                  maxHeight: "4rem", // 64px
                  height: "100%",
                  width: "auto",
                }}
              />
            )}
            {(mergedData.logo?.type === "text" ||
              mergedData.logo?.type === "image+text") && (
              <span style={logoStyles}>
                {customBranding?.header?.name ||
                  mergedData.logo?.text ||
                  tenantData?.branding?.name ||
                  tenantData?.websiteName ||
                  "الشركة العقارية"}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="mx-auto hidden items-center gap-6 md:flex" data-header-nav={navLinkScope}>
            {navLinks.map((link: any, i: number) => renderDesktopMenuItem(link, i))}
          </nav>

          {/* Actions */}
          <div className="ms-auto flex items-center gap-2">
            {/* User Profile */}
            {mergedData.actions?.user?.showProfile && (
              <Link
                href="/account"
                className="p-1.5 md:p-2 transition-colors hover:opacity-80"
                style={{
                  color: mergedData.styling?.textColor || resolvedColors.icon,
                }}
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            )}

            {/* Cart */}
            {mergedData.actions?.user?.showCart && (
              <Link
                href="/cart"
                className="p-1.5 md:p-2 transition-colors hover:opacity-80 relative"
                style={{
                  color: mergedData.styling?.textColor || resolvedColors.icon,
                }}
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden bg-transparent border-none shadow-none hover:bg-stone-100"
              onClick={() => setIsMenuOpen(true)}
              style={{
                color: mergedData.styling?.textColor || resolvedColors.icon,
              }}
            >
              <Menu className="size-6" />
              <span className="sr-only">فتح القائمة</span>
            </Button>
          </div>
        </div>
      </header>

      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuItems={mergedData.menu || []}
        logo={{
          image: customBranding?.header?.logo || mergedData.logo?.image || tenantData?.branding?.logo,
          text: customBranding?.header?.name || mergedData.logo?.text || tenantData?.branding?.name || tenantData?.websiteName || "الشركة العقارية",
          url: mergedData.logo?.url || "/"
        }}
        branding={{
          accent: resolvedColors.accent,
          text: resolvedColors.text,
          background: mergedData.background?.colors?.from || "#ffffff"
        }}
        actions={{
          language: {
            enabled: mergedData.actions?.mobile?.showLanguageToggle,
            current: "ar", // Default to ar for header1
            onToggle: () => {
              // Add language toggle logic here if available
            }
          }
        }}
        side={(mergedData.responsive?.mobileMenu?.side as "left" | "right") || "right"}
        sidebarBackground={sidebarMobileProps.sidebarBackground}
        showLogo={sidebarMobileProps.showLogo}
        showCompanyName={sidebarMobileProps.showCompanyName}
        textColors={sidebarMobileProps.textColors}
        overlay={sidebarMobileProps.overlay}
      />
    </>
  );
};

export default Header1;

