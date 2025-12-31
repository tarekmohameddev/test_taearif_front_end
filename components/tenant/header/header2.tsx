"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultHeader2Data } from "@/context-liveeditor/editorStoreFunctions/header2Functions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════

interface Header2Props {
  // Component-specific props
  visible?: boolean;
  ThemeTwo?: string;
  position?: {
    ThemeTwo?: string;
    type?: "fixed" | "sticky" | "static";
    top?: number;
    zIndex?: number;
  };
  background?: {
    ThemeTwo?: string;
    color?: string;
    opacity?: number;
  };
  logo?: {
    ThemeTwo?: string;
    image?: string;
    alt?: string;
    url?: string;
    width?: number;
    height?: number;
  };
  links?: Array<{
    ThemeTwo?: string;
    name?: string;
    path?: string;
  }>;
  actions?: {
    ThemeTwo?: string;
    logout?: {
      ThemeTwo?: string;
      enabled?: boolean;
      text?: string;
      showWhenLoggedIn?: boolean;
    };
    languageToggle?: {
      ThemeTwo?: string;
      enabled?: boolean;
      text?: {
        ThemeTwo?: string;
        ar?: string;
        en?: string;
      };
    };
  };
  mobileMenu?: {
    ThemeTwo?: string;
    enabled?: boolean;
    side?: "left" | "right";
    width?: number;
    backgroundColor?: string;
    showLogo?: boolean;
    showLanguageToggle?: boolean;
    showLogout?: boolean;
  };
  styling?: {
    ThemeTwo?: string;
    linkColor?: string;
    linkHoverColor?: string;
    linkActiveColor?: string;
    menuIconColor?: string;
    mobileLinkColor?: string;
    mobileLinkActiveColor?: string;
    logoutButtonColor?: string;
    logoutButtonHoverBg?: string;
    languageButtonColor?: string;
    languageButtonHoverColor?: string;
  };
  responsive?: {
    ThemeTwo?: string;
    mobileBreakpoint?: number;
    containerMaxWidth?: string;
    padding?: {
      ThemeTwo?: string;
      horizontal?: string;
    };
  };
  animations?: {
    ThemeTwo?: string;
    logo?: {
      ThemeTwo?: string;
      enabled?: boolean;
      duration?: number;
      delay?: number;
    };
    menuItems?: {
      ThemeTwo?: string;
      enabled?: boolean;
      duration?: number;
      delay?: number;
      stagger?: number;
    };
    logoutButton?: {
      ThemeTwo?: string;
      enabled?: boolean;
      duration?: number;
      delay?: number;
    };
    languageButton?: {
      ThemeTwo?: string;
      enabled?: boolean;
      duration?: number;
      delay?: number;
    };
    mobileMenuButton?: {
      ThemeTwo?: string;
      enabled?: boolean;
      duration?: number;
      delay?: number;
    };
  };

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
  overrideData?: any; // Support overrideData prop for TenantPageWrapper
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export default function Header2(props: Header2Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "header2";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const headerStates = useEditorStore((s) => s.headerStates);

  // Subscribe to global header data for force update
  const globalHeaderData = useEditorStore((s) => s.globalHeaderData);
  const [forceUpdate, setForceUpdate] = useState(0);

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  // Get tenant data FIRST
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Extract component data from tenantData (BEFORE useEffect)
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check if this is a global header - read from globalComponentsData
    if (uniqueId === "global-header" || variantId === "global-header") {
      const globalHeaderData = tenantData?.globalComponentsData?.header;
      if (globalHeaderData && Object.keys(globalHeaderData).length > 0) {
        // Remove variant from data if it exists (variant is metadata, not part of component data)
        const { variant: _variant, ...headerDataWithoutVariant } =
          globalHeaderData;
        return headerDataWithoutVariant;
      }
    }

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "header" &&
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
              (component as any).type === "header" &&
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
              ...getDefaultHeader2Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultHeader2Data(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("header", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = headerStates[uniqueId];
  const currentStoreData = getComponentData("header", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = useMemo(() => {
    // Check if this is a global header - also check globalHeaderData from tenantData
    const isGlobalHeader =
      uniqueId === "global-header" || variantId === "global-header";
    const tenantGlobalHeaderData = isGlobalHeader
      ? tenantData?.globalComponentsData?.header
      : null;

    // Remove variant from tenantGlobalHeaderData if it exists
    const tenantGlobalHeaderDataWithoutVariant = tenantGlobalHeaderData
      ? (() => {
          const { variant: _variant, ...data } = tenantGlobalHeaderData;
          return data;
        })()
      : null;

    const merged = {
      ...getDefaultHeader2Data(), // 1. Defaults (lowest priority)
      ...storeData, // 2. Store state
      ...currentStoreData, // 3. Current store data
      ...tenantComponentData, // 4. Database data
      ...(tenantGlobalHeaderDataWithoutVariant || {}), // 5. Global header data from tenantData (if global header)
      ...props, // 6. Props
      ...(props.overrideData || {}), // 7. OverrideData (highest priority)
    };

    // Convert menu (StaticHeader1 format) to links (Header2 format) if needed
    if (
      merged.menu &&
      Array.isArray(merged.menu) &&
      (!merged.links || merged.links.length === 0)
    ) {
      merged.links = merged.menu.map((item: any) => ({
        name: item.text || item.name || "",
        path: item.url || item.path || "#",
      }));
    }

    return merged;
  }, [
    storeData,
    currentStoreData,
    tenantComponentData,
    props,
    uniqueId,
    variantId,
    tenantData,
    globalHeaderData,
    forceUpdate,
  ]);

  // Force re-render when globalHeaderData changes (for global headers)
  useEffect(() => {
    const isGlobalHeader =
      uniqueId === "global-header" || variantId === "global-header";
    if (
      isGlobalHeader &&
      globalHeaderData &&
      Object.keys(globalHeaderData).length > 0
    ) {
      setForceUpdate((prev) => prev + 1);
    }
  }, [uniqueId, variantId, globalHeaderData]);

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER - Component Logic
  // ─────────────────────────────────────────────────────────
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [ISadmin, setISadmin] = useState(false);
  const [UserIslogged, setUserIslogged] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const router = useRouter();

  // Use merged data for links
  const links = mergedData.links || [];

  // إغلاق القائمة عند تغيير الرابط
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // تغيير الاتجاه بناءً على اللغة
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  async function getData() {
    try {
      const userInfoResponse = await fetch("/api/user/getUserInfo");
      if (!userInfoResponse.ok) return [];

      const userData = await userInfoResponse.json();
      const email = userData.email;

      const [userResponse] = await Promise.all([
        fetch(`/api/user/getData?email=${email}`),
      ]);

      if (userResponse.ok) {
        const currentUserData = await userResponse.json();
        setUserIslogged(true);
        setISadmin(currentUserData.IsAdmin);
      }
    } catch (error) {}
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setLastScrollPos(currentScrollPos);
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPos]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to Logout");
      }
      setUserIslogged(false);
      setISadmin(false);
      // Dynamically import and use Swal
      const Swal = (await import("sweetalert2")).default;
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Done! Logged Out`,
        showConfirmButton: false,
        timer: 8000,
      });
      const data = await res.json();
      // setSessionMessage(data.message);
    } catch (error) {}
  };

  const getButtonClass = (link: any, index: number) => {
    if (!pathname)
      return `relative text-lg font-semibold transition-all before:content-[''] before:absolute before:left-[-5px] before:top-[60%] before:h-[4px] before:transform before:-translate-y-1/2 before:w-[calc(100%+10px)] before:z-[-1] before:scale-x-0 before:origin-${i18n.language === "ar" ? "right" : "left"} before:transition-all before:duration-300 before:ease-in-out`;

    const isActive =
      link.path == pathname ||
      (pathname && pathname.startsWith(link.path) && link.path != "/");

    return `relative text-lg font-semibold transition-all before:content-[''] before:absolute before:left-[-5px] before:top-[60%] before:h-[4px] before:transform before:-translate-y-1/2 before:w-[calc(100%+10px)] before:z-[-1] before:scale-x-0 before:origin-${i18n.language === "ar" ? "right" : "left"} before:transition-all before:duration-300 before:ease-in-out`;
  };

  const handleChangeLanguage = useCallback(() => {
    const newLang = lang === "ar" ? "en" : "ar";

    i18n
      .changeLanguage(newLang)
      .then(() => {
        if (!pathname) return;
        const newPath = pathname.replace(/^\/[^\/]+/, `/${newLang}`);
        router.push(newPath);

        setLang(newLang);
        localStorage.setItem("lang", newLang);
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = newLang;
      })
      .catch((err) => {
        console.error("Failed to change language:", err);
      });
  }, [lang, pathname, router, i18n]);

  const bgColor = mergedData.background?.color || "#8b5f46";
  const positionType = mergedData.position?.type || "fixed";
  const zIndex = mergedData.position?.zIndex || 50;

  return (
    <nav
      className={`${positionType} top-0 left-0 right-0 z-${zIndex} transition-colors duration-500`}
      style={{
        backgroundColor: bgColor,
        opacity: 1,
        zIndex: zIndex,
      }}
    >
      <div
        className={`container mx-auto max-w-screen flex items-center justify-around transition-all duration-500`}
        style={{
          paddingLeft: mergedData.responsive?.padding?.horizontal || "1.75rem",
          paddingRight: mergedData.responsive?.padding?.horizontal || "1.75rem",
        }}
      >
        {/* الشعار */}
        <Link href={mergedData.logo?.url || "/"} className={`cursor-pointer`}>
          <motion.div
            className={`relative `}
            style={{
              width: mergedData.logo?.width || 96,
              height: mergedData.logo?.height || 80,
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: 0.2,
            }}
          >
            <Image
              src={mergedData.logo?.image || "/images/main/logo.png"}
              alt={mergedData.logo?.alt || "rules"}
              fill
              style={{ objectFit: "contain" }}
            />
          </motion.div>
        </Link>

        {/* قائمة الروابط مع التأثير التدريجي */}
        <div className="hidden lg:flex gap-8">
          {links.map((link: any, index: number) => {
            // Check if animations are enabled - default to false if animations config doesn't exist
            // This ensures links are visible even if animations fail
            const hasAnimationsConfig =
              mergedData.animations?.menuItems !== undefined;
            const animationsEnabled =
              hasAnimationsConfig &&
              mergedData.animations?.menuItems?.enabled === true;
            const animationDuration =
              mergedData.animations?.menuItems?.duration || 0.3;
            const animationDelay =
              mergedData.animations?.menuItems?.delay || 0.1;
            const animationStagger =
              mergedData.animations?.menuItems?.stagger || 0.05;

            // If animations are disabled or not configured, show links immediately
            if (!animationsEnabled) {
              return (
                <div key={index}>
                  <Link
                    href={link.path || "#"}
                    className={getButtonClass(link, index)}
                    style={{
                      color: mergedData.styling?.linkColor || "#f3f4f6",
                    }}
                    onMouseEnter={() => setIsHovered(index)}
                    onMouseLeave={() => setIsHovered(null)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </div>
              );
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: 0.4 * index,
                }}
              >
                <Link
                  href={link.path || "#"}
                  className={getButtonClass(link, index)}
                  style={{
                    color: mergedData.styling?.linkColor || "#f3f4f6",
                  }}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* الأزرار */}
        <div className="flex items-center gap-4">
          {UserIslogged && mergedData.actions?.logout?.showWhenLoggedIn && (
            <motion.button
              className={`rounded-all px-3 py-2 font-bold hover:bg-red-800 hover:text-white hidden lg:flex`}
              style={{
                color: mergedData.styling?.logoutButtonColor || "#dc2626",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: mergedData.animations?.logoutButton?.duration || 0.5,
                ease: "easeOut",
                delay: mergedData.animations?.logoutButton?.delay || 1.7,
              }}
              onClick={handleLogout}
            >
              {mergedData.actions?.logout?.text || "Logout"}
            </motion.button>
          )}

          {mergedData.actions?.languageToggle?.enabled && (
            <motion.button
              className={`rounded-all font-semibold hover:text-black text-white hidden lg:flex`}
              style={{
                color: mergedData.styling?.languageButtonColor || "#ffffff",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration:
                  mergedData.animations?.languageButton?.duration || 0.5,
                ease: "easeOut",
                delay: mergedData.animations?.languageButton?.delay || 2.7,
              }}
              onClick={handleChangeLanguage}
            >
              {i18n.language === "en"
                ? mergedData.actions?.languageToggle?.text?.ar || "عربي"
                : mergedData.actions?.languageToggle?.text?.en || "EN"}
            </motion.button>
          )}
        </div>

        {/* زر القائمة المنبثقة */}
        {pathname &&
          !pathname.startsWith("/dashboard") &&
          mergedData.mobileMenu?.enabled && (
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`fixed lg:hidden text-3xl`}
              style={{
                [i18n.language === "en" ? "right" : "left"]: "3rem",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration:
                  mergedData.animations?.mobileMenuButton?.duration || 0.5,
                ease: "easeOut",
                delay: mergedData.animations?.mobileMenuButton?.delay || 0.4,
              }}
            >
              {isMenuOpen ? (
                <FiX
                  style={{
                    color: mergedData.styling?.menuIconColor || "#e5e7eb",
                  }}
                />
              ) : (
                <FiMenu
                  style={{
                    color: mergedData.styling?.menuIconColor || "#e5e7eb",
                  }}
                />
              )}
            </motion.button>
          )}

        {/* القائمة الجانبية */}
        {isMenuOpen && mergedData.mobileMenu?.enabled && (
          <div
            className={`fixed top-0 ${
              i18n.language === "ar" ? "right-0" : "left-0"
            } bottom-0 h-screen w-64 bg-white shadow-lg lg:hidden transition-transform transform translate-x-0 z-40`}
            style={{
              width: `${mergedData.mobileMenu?.width || 256}px`,
              backgroundColor:
                mergedData.mobileMenu?.backgroundColor || "#ffffff",
            }}
          >
            <div className="p-4 flex flex-col gap-6">
              {links.map((link: any, index: number) => {
                return (
                  <Link
                    href={link.path || "#"}
                    key={index}
                    className={`capitalize font-medium text-lg ${
                      link.path === pathname
                        ? "border-b-2 border-purple-500 text-gray-900"
                        : "text-gray-900"
                    }`}
                    style={{
                      color:
                        link.path === pathname
                          ? mergedData.styling?.mobileLinkActiveColor ||
                            "#7c3aed"
                          : mergedData.styling?.mobileLinkColor || "#111827",
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {UserIslogged && mergedData.mobileMenu?.showLogout && (
                <button
                  className={` rounded-all px-3 py-2 font-bold bg-red-800 text-white`}
                  onClick={handleLogout}
                >
                  {mergedData.actions?.logout?.text || "Logout"}
                </button>
              )}
              {mergedData.mobileMenu?.showLanguageToggle && (
                <button
                  className={`rounded-all px-3 py-2 font-semibold text-white`}
                  style={{
                    background: "linear-gradient(to bottom, #8B5CF6, #150d26)",
                  }}
                  onClick={handleChangeLanguage}
                >
                  {i18n.language === "en"
                    ? mergedData.actions?.languageToggle?.text?.ar || "عربي"
                    : mergedData.actions?.languageToggle?.text?.en || "EN"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
