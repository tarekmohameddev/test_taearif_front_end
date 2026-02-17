import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultPartnersData = (): ComponentData => ({
  visible: true,

  // Layout configuration
  layout: {
    maxWidth: "1600px",
    padding: {
      top: "5rem",
      bottom: "5rem",
    },
  },

  // Content
  content: {
    title: "موثوق من خبراء العقار. في جميع أنحاء المملكة.",
    description:
      "من المسوّقين إلى المكاتب والمطوّرين — يعتمدون على تعاريف كل يوم لإدارة العقارات، وأتمتة التواصل، وزيادة الصفقات بسرعة وذكاء.",
  },

  // Partners logos array
  partners: [
    {
      id: "1",
      src: "/images/landingPage/1.png",
      alt: "Partner Logo 1",
    },
    {
      id: "2",
      src: "/images/landingPage/2.png",
      alt: "Partner Logo 2",
    },
    {
      id: "3",
      src: "/images/landingPage/3.png",
      alt: "Partner Logo 3",
    },
    {
      id: "4",
      src: "/images/landingPage/6.png",
      alt: "Partner Logo 4",
    },
    {
      id: "5",
      src: "/images/landingPage/5.png",
      alt: "Partner Logo 5",
    },
    {
      id: "6",
      src: "/images/landingPage/4.png",
      alt: "Partner Logo 6",
    },
  ],

  // Styling
  styling: {
    backgroundColor: "transparent",
    titleColor: "#000000",
    descriptionColor: "#6E6E75",
    cardBackgroundColor: "#f9fafb",
    cardHoverBackgroundColor: "#f3f4f6",
    logoOpacity: 0.7,
    logoHoverOpacity: 1.0,
  },

  // Typography
  typography: {
    title: {
      fontSize: {
        mobile: "2xl",
        tablet: "4xl",
        desktop: "6xl",
      },
      fontWeight: "bold",
      fontFamily: "Tajawal",
      lineHeight: "tight",
    },
    description: {
      fontSize: {
        mobile: "base",
        tablet: "lg",
        desktop: "xl",
      },
      fontWeight: "normal",
      fontFamily: "Tajawal",
      lineHeight: "relaxed",
    },
  },

  // Grid configuration
  grid: {
    columns: {
      mobile: 2,
      tablet: 3,
      desktop: 6,
    },
    gap: "2rem",
  },

  // Animation settings
  animation: {
    enabled: true,
    type: "fade-up",
    duration: 1000,
    threshold: 0.1,
  },
});

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA FOR VARIANT 2 - Slider/Carousel
// ═══════════════════════════════════════════════════════════

export const getDefaultPartners2Data = (): ComponentData => ({
  visible: true,

  // Layout configuration
  layout: {
    maxWidth: "1600px",
    padding: {
      top: "5rem",
      bottom: "5rem",
    },
    columns: 4,
    rows: 4,
    gap: "2",
    cardsPerSlide: 16,
  },

  // Content
  content: {
    title: "عملاءنا",
    subtitle:
      "تنال خدماتنا ثقة الـمؤسسات التي تعتمد علينا في تقديم إنتاج إعلامي مؤثر وموثوق.",
    badge: "— عملاءنا —",
  },

  // Partners logos array (for slider)
  partners: [
    {
      id: "1",
      src: "/images/landingPage/1.png",
      alt: "Partner Logo 1",
    },
    {
      id: "2",
      src: "/images/landingPage/2.png",
      alt: "Partner Logo 2",
    },
    {
      id: "3",
      src: "/images/landingPage/3.png",
      alt: "Partner Logo 3",
    },
    {
      id: "4",
      src: "/images/landingPage/6.png",
      alt: "Partner Logo 4",
    },
    {
      id: "5",
      src: "/images/landingPage/5.png",
      alt: "Partner Logo 5",
    },
    {
      id: "6",
      src: "/images/landingPage/4.png",
      alt: "Partner Logo 6",
    },
  ],

  // Settings for slider
  settings: {
    autoplay: true,
    intervalMs: 5000,
    showBadge: true,
    animation: true,
  },

  // Styling
  styling: {
    backgroundColor: "transparent",
    titleColor: "#2F2E0C",
    subtitleColor: "#2F2E0C",
    badgeColor: "#004B4B",
    paginationActive: "#00D1D1",
    paginationInactive: "#6B7280",
  },

  // Typography
  typography: {
    title: {
      fontSize: {
        mobile: "2xl",
        tablet: "3xl",
        desktop: "3xl",
      },
      fontWeight: "bold",
      fontFamily: "Tajawal",
      lineHeight: "tight",
    },
    subtitle: {
      fontSize: {
        mobile: "base",
        tablet: "lg",
        desktop: "lg",
      },
      fontWeight: "normal",
      fontFamily: "Tajawal",
      lineHeight: "relaxed",
    },
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const partnersFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.partnersStates?.[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          partnersStates: {
            ...state.partnersStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data based on variant
    let defaultData: ComponentData;
    if (variantId === "partners2" || variantId.includes("partners2")) {
      defaultData = getDefaultPartners2Data();
    } else {
      defaultData = getDefaultPartnersData();
    }

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      partnersStates: { ...state.partnersStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
   */
  getData: (state: any, variantId: string) => {
    // If data exists in store, return it
    if (state.partnersStates[variantId]) {
      return state.partnersStates[variantId];
    }

    // Otherwise, return default data based on variant
    if (variantId === "partners2" || variantId.includes("partners2")) {
      return getDefaultPartners2Data();
    }
    return getDefaultPartnersData();
  },

  /**
   * setData - Set/replace component data completely
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    partnersStates: { ...state.partnersStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Determine default data based on variant
    const defaultData =
      variantId === "partners2" || variantId.includes("partners2")
        ? getDefaultPartners2Data()
        : getDefaultPartnersData();

    // Get current data from partnersStates (saved data) or defaults
    const savedData = state.partnersStates?.[variantId] || defaultData;

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

