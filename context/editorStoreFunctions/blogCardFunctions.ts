import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultBlogCardData = (): ComponentData => ({
  visible: true,

  // Blog data
  blog: {
    id: "1",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
    title: "مقال تجريبي",
    description: "هذا مقال تجريبي للمحرر المباشر",
    readMoreUrl: "/blog/test-1",
    date: new Date().toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  },

  // Styling
  styling: {
    cardBackgroundColor: "#ffffff",
    cardTitleColor: "#1f2937",
    cardTitleHoverColor: "#8b5f46",
    cardDescriptionColor: "#4b5563",
    readMoreColor: "#8b5f46",
    readMoreHoverColor: "#6b4630",
    dateColor: "#6b7280",
  },

  // Responsive
  responsive: {
    imageHeight: {
      mobile: "250px",
      desktop: "280px",
    },
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const blogCardFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
    */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.blogCardStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          blogCardStates: {
            ...state.blogCardStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    const defaultData = getDefaultBlogCardData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      blogCardStates: { ...state.blogCardStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
    */
  getData: (state: any, variantId: string) =>
    state.blogCardStates[variantId] || getDefaultBlogCardData(),

  /**
   * setData - Set/replace component data completely
    */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    blogCardStates: { ...state.blogCardStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
    */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from blogCardStates (saved data) or defaults
    const savedData =
      state.blogCardStates[variantId] || getDefaultBlogCardData();

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

