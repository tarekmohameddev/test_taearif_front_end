import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultCard5Data = (): ComponentData => ({
  visible: true,
  ThemeTwo: "card5",

  // Property data
  property: {
    ThemeTwo: "property",
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

  // Styling
  styling: {
    ThemeTwo: "styling",
    cardBackgroundColor: "#ffffff",
    cardBorderRadius: "20px",
    cardShadow: "sm",
    cardHoverShadow: "md",
    featuredBadgeBackground: "#fbbf24",
    featuredBadgeTextColor: "#000000",
    titleColor: "#000000",
    cityDistrictColor: "#000000",
    statusColor: "#16a34a",
    dividerColor: "#e5e7eb",
    areaIconColor: "#896042",
    areaTextColor: "#896042",
    areaLabelColor: "#6b7280",
    roomsIconColor: "#896042",
    roomsTextColor: "#896042",
    roomsLabelColor: "#6b7280",
    floorsIconColor: "#896042",
    floorsTextColor: "#896042",
    floorsLabelColor: "#6b7280",
    bathroomsIconColor: "#896042",
    bathroomsTextColor: "#896042",
    bathroomsLabelColor: "#6b7280",
    priceTextColor: "#896042",
    whatsappButtonBackground: "#25D366",
    whatsappButtonHoverBackground: "#20BA5A",
    whatsappButtonTextColor: "#ffffff",
  },

  // Typography
  typography: {
    ThemeTwo: "typography",
    title: {
      ThemeTwo: "title",
      fontSize: "xl",
      fontWeight: "bold",
      fontFamily: "Tajawal",
    },
    cityDistrict: {
      ThemeTwo: "cityDistrict",
      fontSize: "sm",
      fontWeight: "normal",
      fontFamily: "Tajawal",
    },
    status: {
      ThemeTwo: "status",
      fontSize: "lg",
      fontWeight: "semibold",
      fontFamily: "Tajawal",
    },
    detailLabel: {
      ThemeTwo: "detailLabel",
      fontSize: "xs",
      fontWeight: "normal",
      fontFamily: "Tajawal",
    },
    detailValue: {
      ThemeTwo: "detailValue",
      fontSize: "sm",
      fontWeight: "medium",
      fontFamily: "Tajawal",
    },
    price: {
      ThemeTwo: "price",
      fontSize: "base",
      fontWeight: "bold",
      fontFamily: "Tajawal",
    },
    whatsappButton: {
      ThemeTwo: "whatsappButton",
      fontSize: "base",
      fontWeight: "semibold",
      fontFamily: "Tajawal",
    },
  },

  // Responsive
  responsive: {
    ThemeTwo: "responsive",
    imageHeight: {
      ThemeTwo: "imageHeight",
      mobile: "250px",
      tablet: "300px",
      desktop: "337px",
    },
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const card5Functions = {
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
      state.card5States[variantId] &&
      Object.keys(state.card5States[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data
    const defaultData = getDefaultCard5Data();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      card5States: { ...state.card5States, [variantId]: data },
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
    state.card5States[variantId] || getDefaultCard5Data(),

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    card5States: { ...state.card5States, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param path - Dot-separated path to field (e.g., "property.title")
   * @param value - New value for the field
   * @returns New state object
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.card5States[variantId] || getDefaultCard5Data();
    const newData = updateDataByPath(source, path, value);

    return {
      card5States: { ...state.card5States, [variantId]: newData },
    } as any;
  },
};
