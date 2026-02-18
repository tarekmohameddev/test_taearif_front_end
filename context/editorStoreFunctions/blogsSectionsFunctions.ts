import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultBlogsSectionsData = (): ComponentData => ({
  visible: true,

  // Content - Two paragraphs
  paragraph1:
    "نصمم رحلتك العقارية بخطى واثقة نجمع بين السلاسة في التعامل والاحترافية في الأداء، لنقدّم لك تجربة سلسة من أول استفسار حتى استلام المفتاح. نُراعي احتياجاتك، ونُرشدك نحو أفضل الخيارات بخبرة ودراية تامة.",
  paragraph2:
    "نمتلك فهماً عميقًا للسوق، وشغفًا بتقديم الأفضل لعملائنا. معنا، ستجد عقارك المثالي بسهولة وثقة.",

  // API Settings - Always enabled, data comes from API only
  apiSettings: {
    enabled: true,
    endpoint: "/api/posts",
    limit: 10,
    page: 1,
  },

  // Styling
  styling: {
    backgroundColor: "#8b5f46",
    paragraphColor: "rgba(255, 255, 255, 0.9)",
    dividerColor: "rgba(255, 255, 255, 0.3)",
    cardBackgroundColor: "#ffffff",
    cardTitleColor: "#1f2937",
    cardTitleHoverColor: "#8b5f46",
    cardDescriptionColor: "#4b5563",
    readMoreColor: "#8b5f46",
    readMoreHoverColor: "#6b4630",
    dateColor: "#6b7280",
  },

  // Layout
  layout: {
    maxWidth: "1280px",
    padding: {
      top: "3rem",
      bottom: "3rem",
    },
    gap: {
      paragraphs: "2rem",
      cards: "1.5rem",
    },
    gridColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const blogsSectionsFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
    */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.blogsSectionsStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          blogsSectionsStates: {
            ...state.blogsSectionsStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    const defaultData = getDefaultBlogsSectionsData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      blogsSectionsStates: { ...state.blogsSectionsStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
    */
  getData: (state: any, variantId: string) =>
    state.blogsSectionsStates[variantId] || getDefaultBlogsSectionsData(),

  /**
   * setData - Set/replace component data completely
    */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    blogsSectionsStates: { ...state.blogsSectionsStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
    */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from blogsSectionsStates (saved data) or defaults
    const savedData =
      state.blogsSectionsStates[variantId] || getDefaultBlogsSectionsData();

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

