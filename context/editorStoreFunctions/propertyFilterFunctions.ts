import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default property filter data structure
export const getDefaultPropertyFilterData = (): ComponentData => ({
  visible: true,
  content: {
    searchPlaceholder: "أدخل المدينة أو المنطقة",
    propertyTypePlaceholder: "نوع العقار",
    pricePlaceholder: "السعر",
    searchButtonText: "بحث",
    noResultsText: "لم يتم العثور على نتائج.",
    propertyTypes: [
      "مزرعة",
      "دور",
      "ارض سكن",
      "بيت",
      "شقة ارضيه",
      "شقة علويه",
      "أرض زراعية",
      "أرض استراحة",
      "استراحة",
      "فلة غير مكتملة",
      "أرض تجارية",
    ],
  },
  styling: {
    form: {
      bgColor: "#ffffff",
      borderRadius: "0.625rem",
      padding: "1rem",
      gap: "1.25rem",
    },
    inputs: {
      bgColor: "#ffffff",
      borderColor: "#d1d5db",
      textColor: "#374151",
      placeholderColor: "#6b7280",
      borderRadius: "0.625rem",
      padding: "0.5rem",
      height: "3rem",
      fontSize: "0.875rem",
    },
    dropdown: {
      bgColor: "#ffffff",
      borderColor: "#d1d5db",
      textColor: "#374151",
      hoverBgColor: "#f3f4f6",
      borderRadius: "0.625rem",
      maxHeight: "15rem",
      shadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    searchButton: {
      bgColor: "#059669",
      textColor: "#ffffff",
      hoverBgColor: "#047857",
      borderRadius: "0.625rem",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      fontWeight: "500",
    },
  },
  layout: {
    formLayout: "flex",
    responsive: {
      mobileColumns: 1,
      tabletColumns: 2,
      desktopColumns: 4,
    },
    fieldWidths: {
      searchWidth: "32.32%",
      typeWidth: "23.86%",
      priceWidth: "23.86%",
      buttonWidth: "15.18%",
    },
    spacing: {
      marginBottom: "1.5rem",
      gap: "1.25rem",
    },
  },
});

export const propertyFilterFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
    */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Priority 1: Check if variant already exists
    const currentData = state.propertyFilterStates[variantId];
    if (currentData && Object.keys(currentData).length > 0) {
      // If initial data provided, update to ensure backend data is synced
      if (initial && Object.keys(initial).length > 0) {
        return {
          propertyFilterStates: {
            ...state.propertyFilterStates,
            [variantId]: initial,
          },
        } as any;
      }
      return {} as any; // Already exists, skip initialization
    }

    const defaultData = getDefaultPropertyFilterData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      propertyFilterStates: {
        ...state.propertyFilterStates,
        [variantId]: data,
      },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
    */
  getData: (state: any, variantId: string) =>
    state.propertyFilterStates[variantId] || getDefaultPropertyFilterData(),

  /**
   * setData - Set/replace component data completely
    */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    propertyFilterStates: { ...state.propertyFilterStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
    */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    // Get current data from propertyFilterStates (saved data) or defaults
    const savedData =
      state.propertyFilterStates[variantId] || getDefaultPropertyFilterData();

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

