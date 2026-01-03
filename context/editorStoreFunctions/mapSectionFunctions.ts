import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultMapSectionData = (): ComponentData => ({
  visible: true,
  ThemeTwo: "ThemeTwo", // Added but never used
  title: "ويمكنك أيضا زيارتنا في أي وقت من خلال موقعنا على الخريطة اسفله",
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.771653476316!2d46.67541531500078!3d24.71321898413045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f0385e5e5e5e5%3A0x5e5e5e5e5e5e5e5!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus",
  styling: {
    titleColor: "#8b5f46",
    titleSize: {
      mobile: "text-xl",
      tablet: "text-2xl",
      desktop: "text-2xl",
    },
    mapHeight: "400px",
  },
  spacing: {
    paddingTop: {
      mobile: "pt-12",
      tablet: "pt-14",
      desktop: "pt-16",
    },
    paddingBottom: {
      mobile: "pb-8",
      tablet: "pb-10",
      desktop: "pb-12",
    },
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const mapSectionFunctions = {
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
      state.mapSectionStates[variantId] &&
      Object.keys(state.mapSectionStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data
    const defaultData = getDefaultMapSectionData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      mapSectionStates: { ...state.mapSectionStates, [variantId]: data },
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
    state.mapSectionStates[variantId] || getDefaultMapSectionData(),

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    mapSectionStates: { ...state.mapSectionStates, [variantId]: data },
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
      state.mapSectionStates[variantId] || getDefaultMapSectionData();
    const newData = updateDataByPath(source, path, value);

    return {
      mapSectionStates: { ...state.mapSectionStates, [variantId]: newData },
    } as any;
  },
};
