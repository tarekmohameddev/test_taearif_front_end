"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useStore from "@/context/Store";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useTenantStore from "@/context/tenantStore";
import { useEditorStore } from "@/context/editorStore";
import { getDefaultHeaderData as getDefaultHeaderDataFromFunctions } from "@/context/editorStoreFunctions/headerFunctions";
import { logChange } from "@/lib-liveeditor/debugLogger";

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

  // Debug: Log component render
  console.log("🎯 Header1 Component Rendered:", {
    variantId,
    uniqueId,
    isGlobalHeader,
    forceUpdate,
  });

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
  const router = useRouter();

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

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
  // For global header: globalHeaderData > currentStoreData > default
  // For regular header: currentStoreData > storeData > tenantComponentData > props > default
  const mergedData = useMemo(() => {
    if (isGlobalHeader) {
      // For global headers, prioritize globalHeaderData over everything else
      const result = {
        ...defaultData,
        ...currentStoreData, // Apply currentStoreData first
        ...globalHeaderData, // Then globalHeaderData overrides everything
      };
      return result;
    } else {
      return {
        ...defaultData,
        ...props,
        ...tenantComponentData,
        ...storeData,
        ...currentStoreData,
      };
    }
  }, [
    isGlobalHeader,
    defaultData,
    globalHeaderData,
    currentStoreData,
    props,
    tenantComponentData,
    storeData,
  ]);

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
      })) || [],
    [mergedData.menu, tenantId],
  );

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
      height: `${mergedData.height?.desktop || 96}px`,
      borderBottom: `1px solid ${mergedData.colors?.border || "#e5e7eb"}`,
    }),
    [mergedData],
  );

  // Debug: Log header styles when they change
  console.log("🎨 Header Styles:", headerStyles);
  console.log("🎨 Background Color:", headerStyles.background);

  const logoStyles = useMemo(
    () => ({
      fontFamily: mergedData.logo?.font?.family || "Tajawal",
      fontWeight: mergedData.logo?.font?.weight || "600",
      fontSize: `${mergedData.logo?.font?.size || 24}px`,
      color:
        mergedData.colors?.text || mergedData.styling?.textColor || "#1f2937",
    }),
    [mergedData],
  );

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  return (
    <>
      <header
        key={`header-global-${uniqueId}-${forceUpdate}-${JSON.stringify(mergedData.background?.colors)}`}
        className="w-full transition-all duration-300"
        style={headerStyles as any}
        dir="rtl"
        data-debug="header-component"
      >
        <div className="mx-auto flex h-full max-w-[1600px] items-center gap-4 px-4">
          {/* Logo */}
          <Link
            href={mergedData.logo?.url || "/"}
            className="flex items-center gap-2"
            style={{
              color:
                mergedData.colors?.text ||
                mergedData.styling?.textColor ||
                "#1f2937",
            }}
          >
            {mergedData.logo?.type !== "text" && mergedData.logo?.image && (
              <img
                src={mergedData.logo.image}
                alt={mergedData.logo?.text || "Logo"}
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
                {mergedData.logo?.text ||
                  tenantData?.websiteName ||
                  "الشركة العقارية"}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="mx-auto hidden items-center gap-6 md:flex">
            {navLinks.map((link: any, i: number) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "relative pb-2 text-xl font-medium transition-colors",
                  pathname === link.href
                    ? "text-emerald-700"
                    : "text-muted-foreground hover:text-foreground",
                )}
                style={{
                  color:
                    pathname === link.href
                      ? mergedData.colors?.linkActive ||
                        mergedData.styling?.textColor ||
                        "#059669"
                      : mergedData.colors?.link ||
                        mergedData.styling?.textColor ||
                        "#374151",
                }}
              >
                {link.name}
                {pathname === link.href && (
                  <span
                    className="pointer-events-none absolute inset-x-0 -bottom-[6px] mx-auto block h-[2px] w-8 rounded-full"
                    style={{
                      backgroundColor: mergedData.colors?.accent || "#059669",
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="ms-auto flex items-center gap-2">
            {/* User Profile */}
            {mergedData.actions?.user?.showProfile && (
              <Link
                href="/account"
                className="p-1.5 md:p-2 transition-colors hover:opacity-80"
                style={{
                  color:
                    mergedData.colors?.icon ||
                    mergedData.styling?.textColor ||
                    "#374151",
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
                  color:
                    mergedData.colors?.icon ||
                    mergedData.styling?.textColor ||
                    "#374151",
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
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden bg-transparent"
                  style={{
                    borderColor:
                      mergedData.colors?.border ||
                      mergedData.styling?.borderColor ||
                      "#e5e7eb",
                    color:
                      mergedData.colors?.icon ||
                      mergedData.styling?.textColor ||
                      "#374151",
                  }}
                >
                  <Menu className="size-5" />
                  <span className="sr-only">فتح القائمة</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side={
                  (mergedData.responsive?.mobileMenu?.side as
                    | "left"
                    | "right") || "right"
                }
                className="w-80"
                aria-describedby={undefined}
                style={{
                  width: `${mergedData.responsive?.mobileMenu?.width || 320}px`,
                  backgroundColor:
                    mergedData.background?.colors?.from ||
                    mergedData.styling?.bgColor ||
                    "#ffffff",
                }}
              >
                <div className="flex items-center justify-between">
                  {mergedData.actions?.mobile?.showLogo && (
                    <div className="flex items-center gap-2">
                      {mergedData.logo?.image && (
                        <img
                          src={mergedData.logo.image}
                          alt={mergedData.logo?.text || "Logo"}
                          className="size-8"
                        />
                      )}
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color:
                            mergedData.colors?.text ||
                            mergedData.styling?.textColor ||
                            "#1f2937",
                        }}
                      >
                        {mergedData.logo?.text ||
                          tenantData?.websiteName ||
                          "الشركة العقارية"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 grid gap-2">
                  {navLinks.map((link: any, i: number) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                        pathname === link.href
                          ? "text-emerald-700"
                          : "text-foreground",
                      )}
                      style={{
                        color:
                          pathname === link.href
                            ? mergedData.colors?.linkActive ||
                              mergedData.styling?.textColor ||
                              "#059669"
                            : mergedData.colors?.link ||
                              mergedData.styling?.textColor ||
                              "#374151",
                      }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header1;
