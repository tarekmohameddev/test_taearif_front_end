import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";
import { getDefaultHeader2Data } from "./header2Functions";
import {
  DEFAULT_LOGO,
  DEFAULT_NAV_LINKS,
  DEFAULT_LANGUAGE,
  DEFAULT_CTA,
} from "@/stories/Header/data";

// Default header data structure
export const getDefaultHeaderData = (): ComponentData => {
  const data = {
    visible: true,
    position: {
      type: "sticky",
      top: 0,
      zIndex: 50,
    },
    height: {
      desktop: 96, // h-24 = 96px
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
      link: "#6b7280", // text-muted-foreground
      linkHover: "#111827", // hover:text-foreground
      linkActive: "#059669", // text-emerald-700
      icon: "#374151",
      iconHover: "#1f2937",
      border: "#e5e7eb",
      accent: "#059669", // bg-emerald-600
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
        id: "home",
        type: "link",
        text: "الرئيسية",
        url: "/",
      },
      {
        ThemeTwo: "link",
        name: "بحث عن عقار",
        path: "/search",
        submenu: [
          {
            text: "عقارات للإيجار",
            url: "/for-rent",
          },
          {
            text: "عقارات للبيع",
            url: "/for-sale",
          },
        ],
      },
      {
        id: "services",
        type: "dropdown",
        text: "الخدمات",
        url: "/services",
      },
      {
        id: "about",
        type: "link",
        text: "من نحن",
        url: "/about-us",
      },
      {
        id: "contact",
        type: "link",
        text: "تواصل معنا",
        url: "/contact-us",
      },
    ],
    actions: {
      search: {
        enabled: false,
        placeholder: "بحث...",
      },
      user: {
        showProfile: false, // إزالة أيقونة المستخدم
        showCart: false,
        showWishlist: false,
        showNotifications: false,
      },
      mobile: {
        showLogo: true,
        showLanguageToggle: false, // بدون تبديل اللغة
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
    sidebarMobile: {
      background: {
        type: "color",
        color: "#ffffff", // لون مخصص افتراضي (أبيض)
        imageOpacity: 100, // 0-100%
      },
      showLogo: true,
      showCompanyName: true,
      textColors: {
        heading: "#1c1917", // stone-900
        link: "#44403c",    // stone-700
        text: "#57534e",    // stone-600
      },
      overlay: {
        color: "#000000",
        opacity: 0.4,
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
  };

  return data;
};

// Default header3 data — matches stories/Header types and data (logo, navLinks, languageToggle, cta, dir)
export const getDefaultHeader3Data = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  logo: {
    src: DEFAULT_LOGO.src,
    alt: DEFAULT_LOGO.alt,
    href: DEFAULT_LOGO.href,
  },
  navLinks: DEFAULT_NAV_LINKS.map((link) => ({
    label: link.label,
    href: link.href,
    isActive: link.isActive,
  })),
  languageToggle: {
    label: DEFAULT_LANGUAGE.label,
  },
  cta: {
    label: DEFAULT_CTA.label,
    href: DEFAULT_CTA.href,
  },
});

export const headerFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.headerStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          headerStates: { ...state.headerStates, [variantId]: initial },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data based on variant
    const defaultData =
      variantId === "header2"
        ? getDefaultHeader2Data()
        : variantId === "header3"
          ? getDefaultHeader3Data()
          : getDefaultHeaderData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      headerStates: { ...state.headerStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
   */
  getData: (state: any, variantId: string) =>
    state.headerStates[variantId] || {},

  /**
   * setData - Set/replace component data completely
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    headerStates: { ...state.headerStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from headerStates (saved data) or defaults
    const savedData = state.headerStates[variantId] || {};

    // Merge saved data with existing tempData to preserve all changes
    const currentTempData = state.tempData || {};
    const baseData = { ...savedData, ...currentTempData };

    // Update the specific path in the merged data
    const newData = updateDataByPath(baseData, path, value);

    // Return updated tempData ONLY
    return {
      tempData: newData,
    } as any;
  },
};




















