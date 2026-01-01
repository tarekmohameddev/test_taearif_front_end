import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultpropertyDetail1Data = (): ComponentData => ({
  visible: true,

  // Layout configuration
  layout: {
    maxWidth: "1600px",
    padding: {
      top: "0rem",
      bottom: "3rem",
    },
    gap: "2rem",
  },

  // Styling
  styling: {
    backgroundColor: "#ffffff",
    primaryColor: "#059669", // emerald-600
    textColor: "#1f2937",
    secondaryTextColor: "#6b7280",
    cardBackgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
    badgeBackgroundColor: "#059669",
    badgeTextColor: "#ffffff",
  },

  // Content - نصوص قابلة للتعديل
  content: {
    badgeText: "عقار للبيع",
    similarPropertiesTitle: "عقارات مشابهة",
    floorplansTitle: "مخططات الأرضية",
    locationTitle: "موقع العقار",
    openInGoogleMapsText: "فتح في خرائط جوجل",
    shareTitle: "مشاركة العقار",
    shareDescription: "شارك هذا العقار مع أصدقائك",
  },

  // Display settings - ما الحقول التي تظهر
  displaySettings: {
    showAddress: true,
    showDeveloper: false,
    showUnits: false,
    showCompletionDate: false,
    showCompleteStatus: false,
    showMinPrice: false,
    showMaxPrice: false,
    showVideoUrl: true,
    showLocation: true,
    showCreatedAt: false,
    showUpdatedAt: false,
    showAmenities: true,
    showSpecifications: true,
    showTypes: false,
    showFeatures: true,
    showStatus: true,
    showFloorplans: true,
    showMap: true,
    showSimilarProperties: true,
    showShareButton: true,
  },

  // Gallery settings
  gallery: {
    showThumbnails: true,
    thumbnailCount: 4,
    autoplay: false,
  },

  // Similar properties settings
  similarProperties: {
    enabled: true,
    limit: 6,
  },
});

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

export const propertyDetailFunctions = {
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
      state.propertyDetailStates[variantId] &&
      Object.keys(state.propertyDetailStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data based on variant
    const defaultData =
      variantId === "propertyDetail2" || variantId?.endsWith("propertyDetail2")
        ? getDefaultpropertyDetail2Data()
        : getDefaultpropertyDetail1Data();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      propertyDetailStates: {
        ...state.propertyDetailStates,
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
    const existingData = state.propertyDetailStates[variantId];
    if (existingData && Object.keys(existingData).length > 0) {
      return existingData;
    }
    // Return default based on variant
    return variantId === "propertyDetail2" || variantId?.endsWith("propertyDetail2")
      ? getDefaultpropertyDetail2Data()
      : getDefaultpropertyDetail1Data();
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
    propertyDetailStates: { ...state.propertyDetailStates, [variantId]: data },
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
    const existingData = state.propertyDetailStates[variantId];
    const defaultData =
      variantId === "propertyDetail2" || variantId?.endsWith("propertyDetail2")
        ? getDefaultpropertyDetail2Data()
        : getDefaultpropertyDetail1Data();
    const source = existingData && Object.keys(existingData).length > 0
      ? existingData
      : defaultData;
    const newData = updateDataByPath(source, path, value);

    return {
      propertyDetailStates: {
        ...state.propertyDetailStates,
        [variantId]: newData,
      },
    } as any;
  },
};
