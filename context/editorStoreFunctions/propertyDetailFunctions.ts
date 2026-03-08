import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultpropertyDetail2Data = (): ComponentData => ({
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
    primaryColor: {
      useDefaultColor: true, // Use branding color from merchant settings
      globalColorType: "primary", // primary, secondary, or accent
      // color value is not stored when useDefaultColor = true
    },
    textColor: { useDefaultColor: true, globalColorType: "primary" },
    secondaryTextColor: "#6b7280",
    formBackgroundColor: "#8b5f46",
    formTextColor: "#ffffff",
    formButtonBackgroundColor: "#d4b996",
    formButtonTextColor: "#7a5c43",
  },

  // Content - نصوص قابلة للتعديل
  content: {
    descriptionTitle: "وصف العقار",
    specsTitle: "مواصفات العقار",
    contactFormTitle: "استفسر عن هذا العقار",
    contactFormDescription: "استفسر عن المنزل واملأ البيانات لهذا العقار",
    submitButtonText: "أرسل استفسارك",
  },

  // Display settings - ما الحقول التي تظهر
  displaySettings: {
    showDescription: true,
    showSpecs: true,
    showContactForm: true,
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
      image: "/images/placeholders/projectDetails2/hero.jpg",
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

export const propertyDetailFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
    */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.propertyDetailStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          propertyDetailStates: {
            ...state.propertyDetailStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    const defaultData = getDefaultpropertyDetail2Data();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      propertyDetailStates: {
        ...state.propertyDetailStates,
        [variantId]: data,
      },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
    */
  getData: (state: any, variantId: string) =>
    state.propertyDetailStates[variantId] || getDefaultpropertyDetail2Data(),

  /**
   * setData - Set/replace component data completely
    */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    propertyDetailStates: { ...state.propertyDetailStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
   * Writes to both tempData (for sidebar) and propertyDetailStates (for live preview in the component).
   * Same pattern as hero: merge saved + tempData, update path; we also write to component state
   * so getComponentData() returns fresh data and the preview updates immediately.
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from propertyDetailStates (saved data) or defaults
    const savedData =
      state.propertyDetailStates[variantId] || getDefaultpropertyDetail2Data();

    // Merge saved data with existing tempData to preserve all changes
    const currentTempData = state.tempData || {};
    const baseData = { ...savedData, ...currentTempData };

    // Update the specific path in the merged data
    const newData = updateDataByPath(baseData, path, value);

    // Update both tempData (sidebar) and propertyDetailStates (component preview)
    return {
      tempData: newData,
    } as any;
  },
};