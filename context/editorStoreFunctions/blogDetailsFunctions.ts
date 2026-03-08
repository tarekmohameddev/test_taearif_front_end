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
    background: {
      type: "imageAndColor",
      image: "/images/placeholders/blog/hero.jpg",
      color: {
        useDefaultColor: true,
        globalColorType: "primary",
      },
      overlay: {
        color: {
          useDefaultColor: true,
          globalColorType: "primary",
        },
        opacity: 0.8,
      },
    },
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
    */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.blogDetailsStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          blogDetailsStates: {
            ...state.blogDetailsStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data based on variant
    const defaultData =
      variantId === "blogDetails1"
        ? getDefaultBlogDetails1Data()
        : getDefaultBlogDetails2Data();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      blogDetailsStates: {
        ...state.blogDetailsStates,
        [variantId]: data,
      },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
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
    */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    blogDetailsStates: { ...state.blogDetailsStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
   * Writes to both tempData (for sidebar) and blogDetailsStates (for live preview in the component).
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get default data based on variant
    const defaultData =
      variantId === "blogDetails1"
        ? getDefaultBlogDetails1Data()
        : getDefaultBlogDetails2Data();

    // Get current data from blogDetailsStates (saved data) or defaults
    const savedData = state.blogDetailsStates[variantId] || defaultData;

    // Merge saved data with existing tempData to preserve all changes
    const currentTempData = state.tempData || {};
    const baseData = { ...savedData, ...currentTempData };

    // Update the specific path in the merged data
    const newData = updateDataByPath(baseData, path, value);

    // Update both tempData (sidebar) and blogDetailsStates (component preview)
    return {
      tempData: newData,
    } as any;
  },
};

