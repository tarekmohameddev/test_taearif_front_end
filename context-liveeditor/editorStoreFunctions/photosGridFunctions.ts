import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultPhotosGridData = (): ComponentData => ({
  visible: true,

  // Layout configuration
  layout: {
    maxWidth: "1400px",
    columns: {
      mobile: 2,
      tablet: 3,
      desktop: 4,
    },
    gap: "1.25rem",
    padding: {
      top: "3rem",
      bottom: "3rem",
    },
    aspectRatio: "4 / 3",
  },

  // Content
  content: {
    eyebrow: "Gallery",
    title: "Explore Our Photo Grid",
    subtitle: "A curated collection of visuals",
    description: "Discover highlights from recent projects and campaigns.",
  },

  // Photos collection
  photos: [
    {
      id: "photo-1",
      src: "/images/placeholders/responsiveImage/responsiveImage.jpg",
      alt: "Gallery photo 1",
      caption: "Modern workspace",
      tag: "workspace",
    },
    {
      id: "photo-2",
      src: "/images/placeholders/responsiveImage/responsiveImage.jpg",
      alt: "Gallery photo 2",
      caption: "Team collaboration",
      tag: "team",
    },
    {
      id: "photo-3",
      src: "/images/placeholders/responsiveImage/responsiveImage.jpg",
      alt: "Gallery photo 3",
      caption: "Product showcase",
      tag: "product",
    },
    {
      id: "photo-4",
      src: "/images/placeholders/responsiveImage/responsiveImage.jpg",
      alt: "Gallery photo 4",
      caption: "Outdoor session",
      tag: "outdoor",
    },
    {
      id: "photo-5",
      src: "/images/placeholders/responsiveImage/responsiveImage.jpg",
      alt: "Gallery photo 5",
      caption: "Lifestyle capture",
      tag: "lifestyle",
    },
    {
      id: "photo-6",
      src: "/images/placeholders/responsiveImage/responsiveImage.jpg",
      alt: "Gallery photo 6",
      caption: "Architectural details",
      tag: "architecture",
    },
  ],

  // Styling
  styling: {
    backgroundColor: "#ffffff",
    titleColor: "#111827",
    subtitleColor: "#4b5563",
    descriptionColor: "#6b7280",
    captionColor: "#374151",
    tagColor: "#0ea5e9",
    overlayColor: "rgba(0,0,0,0.2)",
    borderRadius: "16px",
    imageBorderRadius: "12px",
    cardShadow: "0 10px 30px rgba(0,0,0,0.06)",
    hoverScale: "1.02",
  },

  // Typography
  typography: {
    title: {
      fontSize: {
        mobile: "2xl",
        tablet: "3xl",
        desktop: "4xl",
      },
      fontWeight: "700",
      fontFamily: "Tajawal",
    },
    subtitle: {
      fontSize: {
        mobile: "lg",
        tablet: "xl",
        desktop: "2xl",
      },
      fontWeight: "500",
      fontFamily: "Tajawal",
    },
    caption: {
      fontSize: {
        mobile: "sm",
        tablet: "sm",
        desktop: "base",
      },
      fontWeight: "500",
      fontFamily: "Tajawal",
    },
  },

  // Responsive behavior
  responsive: {
    mobileBreakpoint: "640px",
    tabletBreakpoint: "1024px",
    desktopBreakpoint: "1280px",
  },

  // Animations
  animations: {
    header: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 120,
    },
    cards: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 180,
      stagger: 100,
    },
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const photosGridFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.photosGridStates[variantId] &&
      Object.keys(state.photosGridStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    const defaultData = getDefaultPhotosGridData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      photosGridStates: { ...state.photosGridStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
   */
  getData: (state: any, variantId: string) =>
    state.photosGridStates[variantId] || getDefaultPhotosGridData(),

  /**
   * setData - Set/replace component data completely
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    photosGridStates: { ...state.photosGridStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.photosGridStates[variantId] || getDefaultPhotosGridData();
    const newData = updateDataByPath(source, path, value);

    return {
      photosGridStates: { ...state.photosGridStates, [variantId]: newData },
    } as any;
  },
};



















