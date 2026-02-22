import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default grid data structure
export const getDefaultGridData = (): ComponentData => ({
  visible: true,
  content: {
    title: "عقارات متاحة",
    subtitle: "اكتشف أفضل العقارات المتاحة في المنطقة",
    emptyMessage: "لم يتم العثور على نتائج.",
  },
  styling: {
    bgColor: "#ffffff",
    textColor: "#374151",
    titleColor: "#111827",
    subtitleColor: "#6b7280",
    gridGap: "1.5rem",
    maxWidth: "1600px",
  },
  layout: {
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      large: 4,
    },
    padding: {
      top: "2rem",
      bottom: "2rem",
      horizontal: "1rem",
    },
  },
  dataSource: {
    apiUrl: "/v1/tenant-website/{{tenantID}}/properties",
    enabled: true,
    cache: {
      enabled: true,
      duration: 30,
    },
  },
  cardSettings: {
    theme: "card1",
    showImage: true,
    showPrice: true,
    showDetails: true,
    showViews: true,
    showStatus: true,
    card4Styling: {
      unifyColors: false,
      singleColorValue: "#896042",
      cardBackgroundColor: "#ffffff",
      featuredBadgeBackground: "#fbbf24",
      featuredBadgeTextColor: "#000000",
      titleColor: "#000000",
      cityDistrictColor: "#000000",
      statusColor: "#16a34a",
      dividerColor: "#e5e7eb",
      detailsColor: "#896042",
      priceBackgroundColor: "#896042",
      priceTextColor: "#ffffff",
    },
    cardStyle: {
      borderRadius: "rounded-xl",
      shadow: "lg",
      hoverEffect: "scale",
    },
    imageSettings: {
      aspectRatio: "16/10",
      objectFit: "cover",
    },
    contentSettings: {
      titleStyle: {
        fontSize: "lg",
        fontWeight: "bold",
        color: "#1f2937",
      },
      priceStyle: {
        fontSize: "xl",
        color: "#059669",
        currency: "ريال",
      },
    },
  },
});

export const gridFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.gridStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          gridStates: { ...state.gridStates, [variantId]: initial },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    const defaultData = getDefaultGridData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      gridStates: { ...state.gridStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
   */
  getData: (state: any, variantId: string) =>
    state.gridStates[variantId] || getDefaultGridData(),

  /**
   * setData - Set/replace component data completely
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    gridStates: { ...state.gridStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from gridStates (saved data) or defaults
    const savedData = state.gridStates[variantId] || getDefaultGridData();

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

