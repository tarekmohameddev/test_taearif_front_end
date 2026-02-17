import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultResponsiveImageData = (): ComponentData => ({
  visible: true,

  // Image configuration
  image: {
    src: "/images/placeholders/responsiveImage/responsiveImage.jpg",
    alt: "صورة متجاوبة",
  },

  // Responsive width settings
  width: {
    mobile: "100%", // Full width on mobile
    tablet: "80%", // 80% width on tablet
    desktop: "70%", // 70% width on desktop
  },

  // Max width constraints
  maxWidth: {
    mobile: "100%",
    tablet: "800px",
    desktop: "1200px",
  },

  // Alignment
  alignment: "center", // "left" | "center" | "right"

  // Spacing
  spacing: {
    margin: {
      top: "0",
      bottom: "0",
      left: "auto",
      right: "auto",
    },
    padding: {
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
    },
  },

  // Styling
  styling: {
    borderRadius: "0",
    objectFit: "cover", // "cover" | "contain" | "fill" | "none" | "scale-down"
    shadow: "none", // "none" | "sm" | "md" | "lg" | "xl" | "2xl"
    border: {
      enabled: false,
      width: "1px",
      color: "#e5e7eb",
      style: "solid",
    },
  },

  // Responsive behavior
  responsive: {
    mobileBreakpoint: "640px",
    tabletBreakpoint: "1024px",
    desktopBreakpoint: "1280px",
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const responsiveImageFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
    */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.responsiveImageStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          responsiveImageStates: {
            ...state.responsiveImageStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    const defaultData = getDefaultResponsiveImageData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      responsiveImageStates: {
        ...state.responsiveImageStates,
        [variantId]: data,
      },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
    */
  getData: (state: any, variantId: string) =>
    state.responsiveImageStates[variantId] || getDefaultResponsiveImageData(),

  /**
   * setData - Set/replace component data completely
    */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    responsiveImageStates: {
      ...state.responsiveImageStates,
      [variantId]: data,
    },
  }),

  /**
   * updateByPath - Update specific field in component data
    */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from responsiveImageStates (saved data) or defaults
    const savedData =
      state.responsiveImageStates[variantId] || getDefaultResponsiveImageData();

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

