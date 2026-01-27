import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultBlogDetails1Data = (): ComponentData => ({
  visible: true,

  // Layout configuration
  layout: {
    maxWidth: "1280px",
    padding: {
      top: "0rem",
      bottom: "3rem",
    },
    gap: "2rem",
  },

  // Styling
  styling: {
    backgroundColor: "#ffffff",
    primaryColor: "#059669", // emerald-600 default (same as propertyDetail1)
    textColor: "#374151",
    secondaryTextColor: "#6b7280",
  },

  // Content - نصوص قابلة للتعديل
  content: {
    descriptionTitle: "محتوى المقال",
  },

  // Display settings - ما الحقول التي تظهر
  displaySettings: {
    showDescription: true,
    showAuthor: true,
    showCategories: true,
    showPublishedDate: true,
  },

  // WhatsApp settings - إعدادات الواتساب
  whatsApp: {
    showButton: false, // مخفي بشكل افتراضي
    buttonText: "استفسار عن طريق الواتساب",
    phoneNumber: "",
  },

  // Gallery settings
  gallery: {
    showThumbnails: true,
    thumbnailGridColumns: 4,
    thumbnailHeight: "200px",
  },
});

export const getDefaultBlogDetails2Data = (): ComponentData => ({
  visible: true,

  // Layout configuration
  layout: {
    maxWidth: "1280px",
    padding: {
      top: "0rem",
      bottom: "3rem",
    },
    gap: "2rem",
  },

  // Styling
  styling: {
    backgroundColor: "#ffffff",
    primaryColor: "#8b5f46", // Brown color
    textColor: "#967152",
    secondaryTextColor: "#6b7280",
    formBackgroundColor: "#8b5f46",
    formTextColor: "#ffffff",
    formButtonBackgroundColor: "#d4b996",
    formButtonTextColor: "#7a5c43",
  },

  // Content - نصوص قابلة للتعديل
  content: {
    descriptionTitle: "وصف المقال",
    specsTitle: "معلومات المقال",
  },

  // Display settings - ما الحقول التي تظهر
  displaySettings: {
    showDescription: true,
    showSpecs: true,
    showVideoUrl: true,
    showMap: true,
  },

  // WhatsApp settings - إعدادات الواتساب
  whatsApp: {
    showButton: false, // مخفي بشكل افتراضي
    buttonText: "استفسار عن طريق الواتساب",
    phoneNumber: "",
  },

  // Hero section settings
  hero: {
    height: "500px",
    overlayOpacity: 0.4,
  },

  // Gallery settings
  gallery: {
    showThumbnails: true,
    thumbnailGridColumns: 4,
    thumbnailHeight: "200px",
  },

  // Typography
  typography: {
    title: {
      fontSize: {
        mobile: "2xl",
        tablet: "3xl",
        desktop: "4xl",
      },
      fontWeight: "bold",
      fontFamily: "Tajawal",
    },
    subtitle: {
      fontSize: {
        mobile: "base",
        tablet: "lg",
        desktop: "xl",
      },
      fontWeight: "normal",
      fontFamily: "Tajawal",
    },
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const blogDetailsFunctions = {
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
      state.blogDetailsStates[variantId] &&
      Object.keys(state.blogDetailsStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data based on variant
    const defaultData =
      variantId === "blogDetails1"
        ? getDefaultBlogDetails1Data()
        : getDefaultBlogDetails2Data();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      blogDetailsStates: {
        ...state.blogDetailsStates,
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
  getData: (state: any, variantId: string) => {
    const stored = state.blogDetailsStates[variantId];
    if (stored) return stored;

    // Return appropriate default based on variant
    return variantId === "blogDetails1"
      ? getDefaultBlogDetails1Data()
      : getDefaultBlogDetails2Data();
  },

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    blogDetailsStates: { ...state.blogDetailsStates, [variantId]: data },
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
    const defaultData =
      variantId === "blogDetails1"
        ? getDefaultBlogDetails1Data()
        : getDefaultBlogDetails2Data();
    const source = state.blogDetailsStates[variantId] || defaultData;
    const newData = updateDataByPath(source, path, value);

    return {
      blogDetailsStates: {
        ...state.blogDetailsStates,
        [variantId]: newData,
      },
    } as any;
  },
};
