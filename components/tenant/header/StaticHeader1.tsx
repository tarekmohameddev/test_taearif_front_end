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
import HeaderSkeleton from "@/components/skeleton/header/StaticHeaderSkeleton1";
// Function to generate random ID
const generateRandomId = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Function to process menu items and add random IDs
const processMenuItems = (menuItems: any[]): any[] => {
  if (!Array.isArray(menuItems)) return [];

  return menuItems.map((item) => ({
    ...item,
    id: item.id || generateRandomId(),
    submenu: item.submenu ? processSubmenuItems(item.submenu) : undefined,
  }));
};

// Function to process submenu items
const processSubmenuItems = (submenuItems: any[]): any[] => {
  if (!Array.isArray(submenuItems)) return [];

  return submenuItems.map((submenu) => ({
    ...submenu,
    id: submenu.id || generateRandomId(),
    items: submenu.items
      ? submenu.items.map((item: any) => ({
          ...item,
          id: item.id || generateRandomId(),
        }))
      : undefined,
  }));
};

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
    type: "image+text", // صورة مع نص
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
      type: "link",
      text: "الرئيسية",
      url: "/",
    },
    {
      type: "link",
      text: "للإيجار",
      url: "/for-rent",
    },
    {
      type: "link",
      text: "للبيع",
      url: "/for-sale",
    },
    {
      type: "link",
      text: "من نحن",
      url: "/about-us",
    },
    {
      type: "link",
      text: "تواصل معنا",
      url: "/contact-us",
    },
  ],
  actions: {
    search: {
      enabled: false,
      placeholder: "بحث...",
      searchType: "global",
      liveSuggestions: {
        enabled: false,
        api: "",
      },
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

const StaticHeader1 = ({ overrideData }: { overrideData?: any }) => {
  // Force re-render state
  const [forceUpdate, setForceUpdate] = useState(0);

  // Subscribe to global components data with explicit selector
  const globalComponentsData = useEditorStore(
    (state) => state.globalComponentsData,
  );
  const globalHeaderData = useEditorStore((state) => state.globalHeaderData);
  const globalHeaderDataFromComponents = globalComponentsData?.header;

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);

  // Get global components data from tenantData
  const tenantGlobalComponentsData = tenantData?.globalComponentsData;
  const tenantGlobalHeaderData = tenantGlobalComponentsData?.header;
  const tenantId = useTenantStore((s) => s.tenantId);
  const router = useRouter();

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get default data once
  const defaultData = useMemo(() => getDefaultHeaderDataFromFunctions(), []);

  // Merge data with priority: overrideData > globalHeaderData > default
  const [mergedData, setMergedData] = useState(() => {
    // إذا كان التحميل جارياً فقط، لا نستخدم الـ default data
    if (loadingTenantData) {
      return null;
    }

    // Deep merge function for nested objects
    const deepMerge = (target: any, source: any): any => {
      if (!source || typeof source !== "object") return target || source;
      if (!target || typeof target !== "object") return source;

      const result = { ...target };

      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key])
          ) {
            result[key] = deepMerge(target[key], source[key]);
          } else {
            result[key] = source[key];
          }
        }
      }

      return result;
    };

    // Apply merging with proper priority
    let result = { ...defaultData };

    // Apply globalHeaderData from editorStore with deep merge
    if (globalHeaderData && Object.keys(globalHeaderData).length > 0) {
      result = deepMerge(result, globalHeaderData);
    }

    // Apply tenantGlobalHeaderData with deep merge (higher priority than editorStore)
    if (
      tenantGlobalHeaderData &&
      Object.keys(tenantGlobalHeaderData).length > 0
    ) {
      result = deepMerge(result, tenantGlobalHeaderData);
    }

    // Apply overrideData with deep merge (highest priority)
    if (overrideData && Object.keys(overrideData).length > 0) {
      result = deepMerge(result, overrideData);
    }

    // Validate critical fields
    if (!result.menu || !Array.isArray(result.menu)) {
      result.menu = defaultData.menu;
    }

    // Process menu items to add random IDs
    result.menu = processMenuItems(result.menu);

    if (!result.logo || typeof result.logo !== "object") {
      result.logo = defaultData.logo;
    }

    if (!result.colors || typeof result.colors !== "object") {
      result.colors = defaultData.colors;
    }

    return result;
  });

  // Update mergedData whenever dependencies change
  useEffect(() => {
    // إذا كان التحميل جارياً فقط، لا نحدث الـ mergedData
    if (loadingTenantData) {
      return;
    }

    // Deep merge function for nested objects
    const deepMerge = (target: any, source: any): any => {
      if (!source || typeof source !== "object") return target || source;
      if (!target || typeof target !== "object") return source;

      const result = { ...target };

      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key])
          ) {
            result[key] = deepMerge(target[key], source[key]);
          } else {
            result[key] = source[key];
          }
        }
      }

      return result;
    };

    // Apply merging with proper priority
    let result = { ...defaultData };

    // Apply globalHeaderData from editorStore with deep merge
    if (globalHeaderData && Object.keys(globalHeaderData).length > 0) {
      result = deepMerge(result, globalHeaderData);
    }

    // Apply tenantGlobalHeaderData with deep merge (higher priority than editorStore)
    if (
      tenantGlobalHeaderData &&
      Object.keys(tenantGlobalHeaderData).length > 0
    ) {
      result = deepMerge(result, tenantGlobalHeaderData);
    }

    // Apply overrideData with deep merge (highest priority)
    if (overrideData && Object.keys(overrideData).length > 0) {
      result = deepMerge(result, overrideData);
    }

    // Validate critical fields
    if (!result.menu || !Array.isArray(result.menu)) {
      result.menu = defaultData.menu;
    }

    // Process menu items to add random IDs
    result.menu = processMenuItems(result.menu);

    if (!result.logo || typeof result.logo !== "object") {
      result.logo = defaultData.logo;
    }

    if (!result.colors || typeof result.colors !== "object") {
      result.colors = defaultData.colors;
    }

    setMergedData(result);
    setForceUpdate((prev) => prev + 1); // Force re-render
  }, [
    defaultData,
    globalComponentsData,
    globalHeaderData,
    tenantGlobalHeaderData,
    overrideData,
    tenantId,
    tenantData,
    loadingTenantData,
  ]);

  // Monitor globalHeaderData changes
  useEffect(() => {
    if (globalHeaderData && Object.keys(globalHeaderData).length > 0) {
      setForceUpdate((prev) => prev + 1);
    }
  }, [globalHeaderData]);

  // Monitor overrideData changes
  useEffect(() => {
    if (overrideData && Object.keys(overrideData).length > 0) {
      setForceUpdate((prev) => prev + 1);
    }
  }, [overrideData]);

  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const cartCount = useStore((state) => state.cart?.items?.length || 0);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Generate dynamic styles with CSS custom properties for responsive heights
  const headerStyles = useMemo(() => {
    // إذا كانت mergedData null، استخدم القيم الافتراضية
    if (!mergedData) {
      return {
        position: "sticky" as const,
        top: "0px",
        zIndex: 50,
        background: "#ffffff",
        opacity: "0.8",
        height: "96px",
        borderBottom: "1px solid #e5e7eb",
        "--header-height-desktop": "96px",
        "--header-height-tablet": "80px",
        "--header-height-mobile": "64px",
      } as React.CSSProperties;
    }

    return {
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
      // CSS custom properties for responsive heights
      "--header-height-desktop": `${mergedData.height?.desktop || 96}px`,
      "--header-height-tablet": `${mergedData.height?.tablet || 80}px`,
      "--header-height-mobile": `${mergedData.height?.mobile || 64}px`,
    } as React.CSSProperties;
  }, [mergedData]);

  // Generate responsive CSS classes using Tailwind responsive utilities
  const responsiveClasses = useMemo(() => {
    const classes = [];

    // Use Tailwind responsive utilities with CSS custom properties
    classes.push("md:h-[var(--header-height-tablet)]");
    classes.push("max-md:h-[var(--header-height-mobile)]");

    return classes.join(" ");
  }, []);

  const logoStyles = useMemo(() => {
    // إذا كانت mergedData null، استخدم القيم الافتراضية
    if (!mergedData) {
      return {
        fontFamily: "Tajawal",
        fontWeight: "600",
        fontSize: "24px",
        color: "#1f2937",
      };
    }

    return {
      fontFamily: mergedData.logo?.font?.family || "Tajawal",
      fontWeight: mergedData.logo?.font?.weight || "600",
      fontSize: `${mergedData.logo?.font?.size || 24}px`,
      color:
        mergedData.colors?.text || mergedData.styling?.textColor || "#1f2937",
    };
  }, [mergedData]);

  // منطق مبسط: عرض skeleton loading فقط عند الضرورة القصوى
  const shouldShowSkeleton = loadingTenantData || !mergedData;

  if (shouldShowSkeleton) {
    return <HeaderSkeleton />;
  }

  // إذا كانت mergedData موجودة وصالحة، اعرض المكون حتى لو كانت البيانات افتراضية
  // لأن المستخدم قد يكون قد قام بتخصيص البيانات الافتراضية

  // Don't render if not visible
  if (!mergedData) {
    return <HeaderSkeleton />;
  }

  // إذا كان المكون غير مرئي، لا نعرض skeleton loading بل نعرض لا شيء
  if (!mergedData.visible) {
    return null;
  }

  return (
    <>
      {/* Dynamic CSS for responsive heights */}
      <style jsx>{`
        .responsive-header {
          height: var(--header-height-desktop);
        }
        @media (max-width: 1024px) {
          .responsive-header {
            height: var(--header-height-tablet);
          }
        }
        @media (max-width: 768px) {
          .responsive-header {
            height: var(--header-height-mobile);
          }
        }
      `}</style>

      <header
        key={`static-header-${forceUpdate}-${JSON.stringify(mergedData.menu?.map((item: any) => item.text))}-${JSON.stringify(mergedData.menu?.map((item: any) => item.id))}`}
        className={`w-full transition-all duration-300 responsive-header`}
        style={headerStyles as any}
        dir="rtl"
        data-debug="static-header-component"
      >
        <div className="mx-auto flex h-full max-w-[1600px] items-center gap-4 px-4">
          {/* Logo */}
          <Link
            href={
              mergedData.logo?.url?.startsWith("http")
                ? mergedData.logo.url
                : tenantId
                  ? `${mergedData.logo?.url === "/" ? "/" : mergedData.logo?.url || "/"}`
                  : mergedData.logo?.url || "/"
            }
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
              <span
                style={logoStyles}
                className={
                  mergedData.logo?.type === "image+text"
                    ? "hidden sm:inline"
                    : ""
                }
              >
                {mergedData.logo?.text ||
                  tenantData?.websiteName ||
                  "الشركة العقارية"}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="mx-auto hidden items-center gap-6 md:flex">
            {mergedData.menu?.map((item: any, i: number) => {
              const link = {
                name: item.text || item.id || "Link",
                href: item.url?.startsWith("http")
                  ? item.url
                  : tenantId
                    ? `${item.url === "/" ? "/" : item.url}`
                    : item.url || "/",
                type: item.type,
                id: item.id,
                icon: item.icon,
                submenu: item.submenu,
                dynamicData: item.dynamicData,
              };
              return (
                <Link
                  key={link.id || `menu-item-${i}`}
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
                    transition: mergedData.animations?.menuItems?.enabled
                      ? `all ${mergedData.animations.menuItems.duration || 200}ms ease-in-out`
                      : undefined,
                    animationDelay: mergedData.animations?.menuItems?.enabled
                      ? `${(mergedData.animations.menuItems.delay || 50) * i}ms`
                      : undefined,
                  }}
                >
                  {link.icon && (
                    <span className="ml-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                  {link.name}
                  {pathname === link.href && (
                    <span
                      className="pointer-events-none absolute inset-x-0 -bottom-[6px] mx-auto block h-[2px] w-8 rounded-full"
                      style={{
                        backgroundColor: mergedData.colors?.accent || "#059669",
                        transition: mergedData.animations?.menuItems?.enabled
                          ? `all ${mergedData.animations.menuItems.duration || 200}ms ease-in-out`
                          : undefined,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="ms-auto flex items-center gap-2">
            {/* Search */}
            {mergedData.actions?.search?.enabled && (
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder={
                    mergedData.actions.search.placeholder || "بحث..."
                  }
                  className="px-4 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    color: mergedData.colors?.text || "#1f2937",
                    backgroundColor: "rgba(248, 250, 252, 0.8)",
                    borderColor: mergedData.colors?.border || "#e5e7eb",
                  }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: mergedData.colors?.icon || "#374151" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            )}

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

            {/* Wishlist */}
            {mergedData.actions?.user?.showWishlist && (
              <Link
                href="/wishlist"
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Link>
            )}

            {/* Notifications */}
            {mergedData.actions?.user?.showNotifications && (
              <button
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
                    d="M15 17h5l-5 5v-5zM4.5 19.5L9 15l4.5 4.5L9 24l-4.5-4.5z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
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
                  transition: mergedData.animations?.mobileMenu?.enabled
                    ? `all ${mergedData.animations.mobileMenu.duration || 300}ms ${mergedData.animations.mobileMenu.easing || "ease-in-out"}`
                    : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  {mergedData.actions?.mobile?.showLogo && (
                    <div className="flex items-center gap-2">
                      {mergedData.logo?.image && (
                        <img
                          src={mergedData.logo.image}
                          alt={mergedData.logo?.text || "Logo"}
                          className="size-8" // 32x32px مثل الكود الأصلي
                          style={{
                            width: "32px",
                            height: "32px",
                          }}
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

                {/* Mobile Search */}
                {mergedData.actions?.mobile?.showSearch &&
                  mergedData.actions?.search?.enabled && (
                    <div className="mt-6 mb-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={
                            mergedData.actions.search.placeholder || "بحث..."
                          }
                          className="w-full px-4 py-2 pr-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          style={{
                            color: mergedData.colors?.text || "#1f2937",
                            backgroundColor: "rgba(248, 250, 252, 0.8)",
                            borderColor: mergedData.colors?.border || "#e5e7eb",
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{
                              color: mergedData.colors?.icon || "#374151",
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                <div className="mt-6 grid gap-2">
                  {mergedData.menu?.map((item: any, i: number) => {
                    const link = {
                      name: item.text || item.id || "Link",
                      href: item.url?.startsWith("http")
                        ? item.url
                        : tenantId
                          ? `${item.url === "/" ? "/" : item.url}`
                          : item.url || "/",
                      type: item.type,
                      id: item.id,
                      icon: item.icon,
                      submenu: item.submenu,
                      dynamicData: item.dynamicData,
                    };
                    return (
                      <Link
                        key={link.id || `mobile-menu-item-${i}`}
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
                        {link.icon && (
                          <span className="ml-2">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default StaticHeader1;
