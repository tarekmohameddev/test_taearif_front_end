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
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID (UUID)
   * @param initial - Optional initial data to override defaults
   * @returns New state object or empty object if already exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Check if variant already exists
    if (
      state.responsiveImageStates[variantId] &&
      Object.keys(state.responsiveImageStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data
    const defaultData = getDefaultResponsiveImageData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      responsiveImageStates: {
        ...state.responsiveImageStates,
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
    state.responsiveImageStates[variantId] || getDefaultResponsiveImageData(),

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    responsiveImageStates: {
      ...state.responsiveImageStates,
      [variantId]: data,
    },
  }),

  /**
   * updateByPath - Update specific field in component data
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param path - Dot-separated path to field (e.g., "image.src")
   * @param value - New value for the field
   * @returns New state object
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.responsiveImageStates[variantId] || getDefaultResponsiveImageData();
    const newData = updateDataByPath(source, path, value);

    return {
      responsiveImageStates: {
        ...state.responsiveImageStates,
        [variantId]: newData,
      },
    } as any;
  },
};
