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
    */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.mapSectionStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          mapSectionStates: {
            ...state.mapSectionStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    const defaultData = getDefaultMapSectionData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      mapSectionStates: { ...state.mapSectionStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
    */
  getData: (state: any, variantId: string) =>
    state.mapSectionStates[variantId] || getDefaultMapSectionData(),

  /**
   * setData - Set/replace component data completely
    */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    mapSectionStates: { ...state.mapSectionStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
    */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from mapSectionStates (saved data) or defaults
    const savedData =
      state.mapSectionStates[variantId] || getDefaultMapSectionData();

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

