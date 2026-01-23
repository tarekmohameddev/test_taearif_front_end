import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";
import { getDefaultHeader2Data } from "./header2Functions";

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

export const headerFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.headerStates[variantId] &&
      Object.keys(state.headerStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    // Determine default data based on variant
    const defaultData =
      variantId === "header2"
        ? getDefaultHeader2Data()
        : getDefaultHeaderData();

    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      headerStates: { ...state.headerStates, [variantId]: data },
    } as any;
  },

  getData: (state: any, variantId: string) =>
    state.headerStates[variantId] || {},

  setData: (state: any, variantId: string, data: ComponentData) => ({
    headerStates: { ...state.headerStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.headerStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      headerStates: { ...state.headerStates, [variantId]: newData },
    } as any;
  },
};
