import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultPropertiesShowcaseData = (): ComponentData => ({
  visible: true,
  ThemeTwo: "propertiesShowcase", // Theme identifier - not used in rendering

  // Layout configuration
  layout: {
    ThemeTwo: "layout",
    maxWidth: "7xl",
    columns: {
      ThemeTwo: "columns",
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
    gap: "1.5rem",
    padding: {
      ThemeTwo: "padding",
      top: "3rem",
      bottom: "3rem",
    },
  },

  // Content
  content: {
    ThemeTwo: "content",
    title: "المشاريع والعقارات",
    loadMoreButtonText: "تحميل المزيد",
    viewAllButtonText: "عرض الكل",
    cardType: "card1", // "card1" | "card2"
  },

  // Data Source
  dataSource: {
    apiUrl:
      "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10",
    enabled: true,
  },

  // Properties/Projects array - 3 Cards Mock Data
  properties: [
    {
      ThemeTwo: "property",
      id: "1",
      image: "https://dalel-lovat.vercel.app/images/hero.webp",
      title: "مشروع سكني فاخر",
      city: "الرياض",
      district: "حي النرجس",
      status: "للبيع",
      area: {
        ThemeTwo: "area",
        min: 150,
        max: 300,
      },
      rooms: {
        ThemeTwo: "rooms",
        min: 3,
        max: 5,
      },
      units: 50,
      floors: {
        ThemeTwo: "floors",
        min: 3,
        max: 5,
      },
      price: {
        ThemeTwo: "price",
        min: 500000,
        max: 1500000,
      },
      bathrooms: {
        ThemeTwo: "bathrooms",
        min: 2,
        max: 4,
      },
      featured: false,
      url: "#",
    },
    {
      ThemeTwo: "property",
      id: "2",
      image: "https://dalel-lovat.vercel.app/images/hero.webp",
      title: "مجمع سكني حديث",
      city: "جدة",
      district: "حي الزهراء",
      status: "للإيجار",
      area: {
        ThemeTwo: "area",
        min: 200,
        max: 400,
      },
      rooms: {
        ThemeTwo: "rooms",
        min: 4,
        max: 6,
      },
      units: 80,
      floors: {
        ThemeTwo: "floors",
        min: 4,
        max: 6,
      },
      price: {
        ThemeTwo: "price",
        min: 3000,
        max: 8000,
      },
      bathrooms: {
        ThemeTwo: "bathrooms",
        min: 3,
        max: 5,
      },
      featured: true,
      url: "#",
    },
    {
      ThemeTwo: "property",
      id: "3",
      image: "https://dalel-lovat.vercel.app/images/hero.webp",
      title: "عمارة سكنية راقية",
      city: "الدمام",
      district: "حي الفيصلية",
      status: "للبيع",
      area: {
        ThemeTwo: "area",
        min: 180,
        max: 350,
      },
      rooms: {
        ThemeTwo: "rooms",
        min: 3,
        max: 6,
      },
      units: 60,
      floors: {
        ThemeTwo: "floors",
        min: 4,
        max: 7,
      },
      price: {
        ThemeTwo: "price",
        min: 800000,
        max: 2000000,
      },
      bathrooms: {
        ThemeTwo: "bathrooms",
        min: 2,
        max: 5,
      },
      featured: false,
      url: "#",
    },
  ],

  // Styling
  styling: {
    ThemeTwo: "styling",
    backgroundColor: "#efe5dc",
    titleColor: "#1f2937",
    dividerColor: "#8b5f46",
    viewAllButtonColor: "#8b5f46",
    viewAllButtonHoverColor: "#6b4630",
    loadMoreButtonColor: "#8b5f46",
    loadMoreButtonHoverColor: "#8b5f46",
    loadMoreButtonTextColor: "#8b5f46",
    loadMoreButtonHoverTextColor: "#ffffff",
  },

  // Typography
  typography: {
    ThemeTwo: "typography",
    title: {
      ThemeTwo: "title",
      fontSize: {
        ThemeTwo: "fontSize",
        mobile: "xl",
        tablet: "2xl",
        desktop: "3xl",
      },
      fontWeight: "bold",
      fontFamily: "Tajawal",
    },
  },

  // Responsive behavior
  responsive: {
    ThemeTwo: "responsive",
    mobileBreakpoint: "640px",
    tabletBreakpoint: "1024px",
    desktopBreakpoint: "1280px",
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const propertiesShowcaseFunctions = {
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
      state.propertiesShowcaseStates[variantId] &&
      Object.keys(state.propertiesShowcaseStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data
    const defaultData = getDefaultPropertiesShowcaseData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      propertiesShowcaseStates: {
        ...state.propertiesShowcaseStates,
        [variantId]: data,
      },
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
    state.propertiesShowcaseStates[variantId] ||
    getDefaultPropertiesShowcaseData(),

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    propertiesShowcaseStates: {
      ...state.propertiesShowcaseStates,
      [variantId]: data,
    },
  }),

  /**
   * updateByPath - Update specific field in component data
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param path - Dot-separated path to field (e.g., "content.title")
   * @param value - New value for the field
   * @returns New state object
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.propertiesShowcaseStates[variantId] ||
      getDefaultPropertiesShowcaseData();
    const newData = updateDataByPath(source, path, value);

    return {
      propertiesShowcaseStates: {
        ...state.propertiesShowcaseStates,
        [variantId]: newData,
      },
    } as any;
  },
};
