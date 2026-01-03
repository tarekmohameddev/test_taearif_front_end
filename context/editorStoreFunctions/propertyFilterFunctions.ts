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
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.propertyFilterStates[variantId] &&
      Object.keys(state.propertyFilterStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    const defaultData = getDefaultPropertyFilterData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      propertyFilterStates: {
        ...state.propertyFilterStates,
        [variantId]: data,
      },
    } as any;
  },

  getData: (state: any, variantId: string) =>
    state.propertyFilterStates[variantId] || getDefaultPropertyFilterData(),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    propertyFilterStates: { ...state.propertyFilterStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.propertyFilterStates[variantId] || getDefaultPropertyFilterData();
    const newData = updateDataByPath(source, path, value);

    return {
      propertyFilterStates: {
        ...state.propertyFilterStates,
        [variantId]: newData,
      },
    } as any;
  },
};
