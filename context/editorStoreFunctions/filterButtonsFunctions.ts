import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default filter buttons data structure
export const getDefaultFilterButtonsData = (): ComponentData => ({
  visible: true,
  content: {
    inspectionButtonText: "طلب معاينة",
    inspectionButtonUrl: "/application-form",
    allButtonText: "الكل",
    availableButtonText: "المتاحة",
    soldButtonText: "تم بيعها",
    rentedButtonText: "تم تأجيرها",
  },
  styling: {
    inspectionButton: {
      bgColor: "#059669",
      textColor: "#ffffff",
      hoverBgColor: "#047857",
      borderRadius: "0.625rem",
      padding: "0.5rem 1.25rem",
      fontSize: "0.75rem",
    },
    filterButtons: {
      activeBgColor: "#059669",
      activeTextColor: "#ffffff",
      inactiveBgColor: "#ffffff",
      inactiveTextColor: "#059669",
      hoverBgColor: "#f0fdf4",
      borderRadius: "0.625rem",
      padding: "0.5rem 1.25rem",
      fontSize: "0.75rem",
      gap: "1.5rem",
    },
  },
  layout: {
    direction: "column",
    alignment: "center",
    inspectionButtonWidth: "80%",
    spacing: {
      marginBottom: "1.5rem",
      gap: "1.5rem",
    },
  },
});

export const filterButtonsFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
    */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.filterButtonsStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          filterButtonsStates: {
            ...state.filterButtonsStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    const defaultData = getDefaultFilterButtonsData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      filterButtonsStates: { ...state.filterButtonsStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
    */
  getData: (state: any, variantId: string) =>
    state.filterButtonsStates[variantId] || getDefaultFilterButtonsData(),

  /**
   * setData - Set/replace component data completely
    */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    filterButtonsStates: { ...state.filterButtonsStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
    */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from filterButtonsStates (saved data) or defaults
    const savedData =
      state.filterButtonsStates[variantId] || getDefaultFilterButtonsData();

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

