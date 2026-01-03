import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultLogosTickerData = (): ComponentData => ({
  visible: true,

  // Layout configuration
  layout: {
    maxWidth: "1600px",
    padding: {
      top: "4rem",
      bottom: "4rem",
    },
  },

  // Content
  content: {
    title: "موثوق بنا من قبل الفرق الطموحة التي تبني المستقبل",
    subtitle:
      "من الشركات الناشئة إلى الشركات الكبرى يعتمد عملائنا على رواد لتبسيط العمليات وتعزيز الرؤية وتسريع النمو.",
  },

  // Logos array - dynamic images
  logos: [
    {
      id: "1",
      src: "/logo.svg",
      alt: "Client Logo 1",
    },
    {
      id: "2",
      src: "/logo.svg",
      alt: "Client Logo 2",
    },
    {
      id: "3",
      src: "/logo.svg",
      alt: "Client Logo 3",
    },
    {
      id: "4",
      src: "/logo.svg",
      alt: "Client Logo 4",
    },
    {
      id: "5",
      src: "/logo.svg",
      alt: "Client Logo 5",
    },
    {
      id: "6",
      src: "/logo.svg",
      alt: "Client Logo 6",
    },
    {
      id: "7",
      src: "/logo.svg",
      alt: "Client Logo 7",
    },
    {
      id: "8",
      src: "/logo.svg",
      alt: "Client Logo 8",
    },
    {
      id: "9",
      src: "/logo.svg",
      alt: "Client Logo 9",
    },
  ],

  // Display mode: "both" | "forward" | "reverse"
  displayMode: "both",

  // Animation settings
  animation: {
    speed: 40, // seconds for one full cycle
    pauseOnHover: true,
  },

  // Styling
  styling: {
    backgroundColor: "transparent",
    titleColor: "#0D2EA1",
    subtitleColor: "#6b7280",
    logoOpacity: 0.6,
    logoHoverOpacity: 1.0,
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
  },
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const logosTickerFunctions = {
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
      state.logosTickerStates[variantId] &&
      Object.keys(state.logosTickerStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Use default data
    const defaultData = getDefaultLogosTickerData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      logosTickerStates: { ...state.logosTickerStates, [variantId]: data },
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
    state.logosTickerStates[variantId] || getDefaultLogosTickerData(),

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    logosTickerStates: { ...state.logosTickerStates, [variantId]: data },
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
    const source =
      state.logosTickerStates[variantId] || getDefaultLogosTickerData();
    const newData = updateDataByPath(source, path, value);

    return {
      logosTickerStates: { ...state.logosTickerStates, [variantId]: newData },
    } as any;
  },
};
