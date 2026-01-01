import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Centered title configuration
// ═══════════════════════════════════════════════════════════
export const getDefaultTitleData = (): ComponentData => ({
  visible: true,

  content: {
    title: "Page Title",
  },

  styling: {
    textAlign: "center",
    color: "#111827",
    backgroundColor: "transparent",
  },

  typography: {
    fontSize: {
      mobile: "24px",
      tablet: "32px",
      desktop: "40px",
    },
    fontWeight: "700",
    fontFamily: "Tajawal",
    lineHeight: "1.2",
    letterSpacing: "0px",
  },

  spacing: {
    padding: {
      top: "24px",
      bottom: "24px",
      left: "0px",
      right: "0px",
    },
  },

  animations: {
    enabled: false,
    type: "fade-up",
    duration: 600,
    delay: 0,
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════
export const titleFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.titleStates[variantId] &&
      Object.keys(state.titleStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists
    }

    const defaultData = getDefaultTitleData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      titleStates: {
        ...state.titleStates,
        [variantId]: data,
      },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
   */
  getData: (state: any, variantId: string) =>
    state.titleStates[variantId] || getDefaultTitleData(),

  /**
   * setData - Set/replace component data completely
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    titleStates: {
      ...state.titleStates,
      [variantId]: data,
    },
  }),

  /**
   * updateByPath - Update specific field in component data
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.titleStates[variantId] || getDefaultTitleData();
    const newData = updateDataByPath(source, path, value);

    return {
      titleStates: {
        ...state.titleStates,
        [variantId]: newData,
      },
    } as any;
  },
};

