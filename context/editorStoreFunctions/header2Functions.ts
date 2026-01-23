import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Header2 (Nav.jsx based)
// ═══════════════════════════════════════════════════════════

export const getDefaultHeader2Data = (): ComponentData => {
  const data = {
    visible: true,
    ThemeTwo: "header2",

    // Position and layout
    position: {
      ThemeTwo: "position",
      type: "fixed",
      top: 0,
      zIndex: 50,
    },

    // Background
    background: {
      ThemeTwo: "background",
      color: "#8b5f46",
      opacity: 1,
    },

    // Logo
    logo: {
      ThemeTwo: "logo",
      image: "/images/main/logo.png",
      alt: "rules",
      url: "/",
      width: 96, // w-24
      height: 80, // h-20
    },

    // Navigation links
    links: [
      {
        ThemeTwo: "link",
        name: "الرئيسية",
        path: "/",
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
        ThemeTwo: "link",
        name: "المشاريع",
        path: "/projects",
      },
      {
        ThemeTwo: "link",
        name: "من نحن",
        path: "/about-us",
      },
      {
        ThemeTwo: "link",
        name: "تواصل معنا",
        path: "/contact-us",
      },
    ],

    // Actions
    actions: {
      ThemeTwo: "actions",
      logout: {
        ThemeTwo: "logout",
        enabled: false,
        text: "Logout",
        showWhenLoggedIn: true,
      },
      languageToggle: {
        ThemeTwo: "languageToggle",
        enabled: true,
        text: {
          ThemeTwo: "text",
          ar: "EN",
          en: "عربي",
        },
      },
    },

    // Mobile menu
    mobileMenu: {
      ThemeTwo: "mobileMenu",
      enabled: true,
      side: "right", // "right" for RTL, "left" for LTR
      width: 256, // w-64
      backgroundColor: "#ffffff",
      showLogo: true,
      showLanguageToggle: true,
      showLogout: true,
    },

    // Styling
    styling: {
      ThemeTwo: "styling",
      linkColor: "#f3f4f6", // text-gray-100
      linkHoverColor: "#ffffff",
      linkActiveColor: "#fbbf24", // yellow-500
      menuIconColor: "#e5e7eb", // text-gray-200
      mobileLinkColor: "#111827", // text-gray-900
      mobileLinkActiveColor: "#7c3aed", // border-purple-500
      logoutButtonColor: "#dc2626", // text-red-600
      logoutButtonHoverBg: "#991b1b", // hover:bg-red-800
      languageButtonColor: "#ffffff",
      languageButtonHoverColor: "#000000",
    },

    // Responsive
    responsive: {
      ThemeTwo: "responsive",
      mobileBreakpoint: 1024, // lg breakpoint
      containerMaxWidth: "100%",
      padding: {
        ThemeTwo: "padding",
        horizontal: "1.75rem", // px-7
      },
    },

    // Animations
    animations: {
      ThemeTwo: "animations",
      logo: {
        ThemeTwo: "logo",
        enabled: true,
        duration: 0.5,
        delay: 0.2,
      },
      menuItems: {
        ThemeTwo: "menuItems",
        enabled: true,
        duration: 0.5,
        delay: 0.4,
        stagger: 0.4,
      },
      logoutButton: {
        ThemeTwo: "logoutButton",
        enabled: true,
        duration: 0.5,
        delay: 1.7,
      },
      languageButton: {
        ThemeTwo: "languageButton",
        enabled: true,
        duration: 0.5,
        delay: 2.7,
      },
      mobileMenuButton: {
        ThemeTwo: "mobileMenuButton",
        enabled: true,
        duration: 0.5,
        delay: 0.4,
      },
    },
  };

  return data;
};

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const header2Functions = {
  /**
   * ensureVariant - Initialize component in store if not exists
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID (UUID)
   * @param initial - Optional initial data to override defaults
   * @returns New state object or empty object if already exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Check if variant already exists
    if (
      state.headerStates[variantId] &&
      Object.keys(state.headerStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data based on variant
    const defaultData =
      variantId === "header2"
        ? getDefaultHeader2Data()
        : getDefaultHeader2Data(); // Default to header2 for now

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      headerStates: { ...state.headerStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @returns Component data or default data if not found
   */
  getData: (state: any, variantId: string) =>
    state.headerStates[variantId] || getDefaultHeader2Data(),

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    headerStates: { ...state.headerStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param path - Dot-separated path to field (e.g., "logo.image")
   * @param value - New value for the field
   * @returns New state object
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.headerStates[variantId] || getDefaultHeader2Data();
    const newData = updateDataByPath(source, path, value);

    return {
      headerStates: { ...state.headerStates, [variantId]: newData },
    } as any;
  },
};
