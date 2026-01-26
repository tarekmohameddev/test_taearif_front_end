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
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID (UUID)
   * @param initial - Optional initial data to override defaults
   * @returns New state object or empty object if already exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Check if variant already exists
    if (
      state.blogCardStates[variantId] &&
      Object.keys(state.blogCardStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data
    const defaultData = getDefaultBlogCardData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      blogCardStates: { ...state.blogCardStates, [variantId]: data },
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
    state.blogCardStates[variantId] || getDefaultBlogCardData(),

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    blogCardStates: { ...state.blogCardStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param path - Dot-separated path to field (e.g., "blog.title")
   * @param value - New value for the field
   * @returns New state object
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.blogCardStates[variantId] || getDefaultBlogCardData();
    const newData = updateDataByPath(source, path, value);

    return {
      blogCardStates: { ...state.blogCardStates, [variantId]: newData },
    } as any;
  },
};
