import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultProjectDetailsData = (): ComponentData => ({
  visible: true,

  // Layout configuration
  layout: {
    maxWidth: "1280px",
    padding: {
      top: "3rem",
      bottom: "3rem",
    },
    gap: "2rem",
  },

  // Styling
  styling: {
    backgroundColor: "#ffffff",
    primaryColor: "#059669", // emerald-600 default
    textColor: "#1f2937",
    secondaryTextColor: "#6b7280",
    cardBackgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    badgeBackgroundColor: "#059669",
    badgeTextColor: "#ffffff",
  },

  // Content - نصوص قابلة للتعديل
  content: {
    badgeText: "مشروع عقاري",
    similarProjectsTitle: "مشاريع مشابهة",
    floorplansTitle: "مخططات الأرضية",
    locationTitle: "موقع المشروع",
    openInGoogleMapsText: "فتح في خرائط جوجل",
    shareTitle: "مشاركة المشروع",
    shareDescription: "شارك هذا المشروع مع أصدقائك",
  },

  // Display settings - ما الحقول التي تظهر
  displaySettings: {
    showAddress: true,
    showDeveloper: true,
    showUnits: true,
    showCompletionDate: true,
    showCompleteStatus: true,
    showMinPrice: true,
    showMaxPrice: true,
    showVideoUrl: true,
    showLocation: true,
    showCreatedAt: true,
    showUpdatedAt: true,
    showAmenities: true,
    showSpecifications: true,
    showTypes: true,
    showFeatures: true,
    showStatus: true,
    showFloorplans: true,
    showMap: true,
    showSimilarProjects: true,
    showShareButton: true,
  },

  // Typography
  typography: {
    title: {
      fontSize: {
        mobile: "xl",
        tablet: "2xl",
        desktop: "3xl",
      },
      fontWeight: "bold",
      fontFamily: "Tajawal",
    },
    subtitle: {
      fontSize: {
        mobile: "sm",
        tablet: "base",
        desktop: "lg",
      },
      fontWeight: "normal",
      fontFamily: "Tajawal",
    },
    price: {
      fontSize: {
        mobile: "2xl",
        tablet: "3xl",
        desktop: "4xl",
      },
      fontWeight: "bold",
      fontFamily: "Tajawal",
    },
  },

  // Similar projects settings
  similarProjects: {
    enabled: true,
    limit: 10,
    showOnMobile: true,
    showOnDesktop: true,
  },

  // Image gallery settings
  gallery: {
    showThumbnails: true,
    autoplay: false,
    showNavigation: true,
    thumbnailCount: 4,
  },
});

// Default data for variant 2 (Hero Layout with Overlay)
export const getDefaultProjectDetails2Data = (): ComponentData => ({
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
    primaryColor: "#8b5f46", // Brown color for variant 2
    textColor: "#967152",
    secondaryTextColor: "#6b7280",
    cardBackgroundColor: "#8b5f46",
    borderColor: "#e5e7eb",
    badgeBackgroundColor: "#8b5f46",
    badgeTextColor: "#ffffff",
    formBackgroundColor: "#8b5f46",
    formTextColor: "#ffffff",
    formButtonBackgroundColor: "#d4b996",
    formButtonTextColor: "#7a5c43",
  },

  // Content - نصوص قابلة للتعديل
  content: {
    badgeText: "مشروع عقاري",
    descriptionTitle: "وصف المشروع",
    specsTitle: "مواصفات المشروع",
    contactFormTitle: "استفسر عن هذا المشروع",
    contactFormDescription: "استفسر عن المنزل واملأ البيانات لهذا المشروع",
    videoTourText: "جولة فيديو للمشروع",
    submitButtonText: "أرسل استفسارك",
  },

  // Display settings - ما الحقول التي تظهر
  displaySettings: {
    showAddress: true,
    showDeveloper: true,
    showUnits: true,
    showCompletionDate: true,
    showCompleteStatus: true,
    showMinPrice: true,
    showMaxPrice: true,
    showVideoUrl: true,
    showLocation: true,
    showCreatedAt: false,
    showUpdatedAt: false,
    showAmenities: true,
    showSpecifications: true,
    showTypes: true,
    showFeatures: true,
    showStatus: true,
    showFloorplans: false,
    showMap: true,
    showSimilarProjects: false,
    showShareButton: false,
    showContactForm: true,
    showDescription: true,
    showSpecs: true,
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
    price: {
      fontSize: {
        mobile: "xl",
        tablet: "2xl",
        desktop: "3xl",
      },
      fontWeight: "bold",
      fontFamily: "Tajawal",
    },
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
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const projectDetailsFunctions = {
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
      state.projectDetailsStates[variantId] &&
      Object.keys(state.projectDetailsStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data based on variant
    const defaultData =
      variantId === "projectDetails2"
        ? getDefaultProjectDetails2Data()
        : getDefaultProjectDetailsData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      projectDetailsStates: {
        ...state.projectDetailsStates,
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
    const stored = state.projectDetailsStates[variantId];
    if (stored) return stored;

    // Return appropriate default based on variant
    return variantId === "projectDetails2"
      ? getDefaultProjectDetails2Data()
      : getDefaultProjectDetailsData();
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
    projectDetailsStates: { ...state.projectDetailsStates, [variantId]: data },
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
      variantId === "projectDetails2"
        ? getDefaultProjectDetails2Data()
        : getDefaultProjectDetailsData();
    const source = state.projectDetailsStates[variantId] || defaultData;
    const newData = updateDataByPath(source, path, value);

    return {
      projectDetailsStates: {
        ...state.projectDetailsStates,
        [variantId]: newData,
      },
    } as any;
  },
};
