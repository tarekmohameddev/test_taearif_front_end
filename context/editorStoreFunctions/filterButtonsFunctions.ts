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
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.filterButtonsStates[variantId] &&
      Object.keys(state.filterButtonsStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    const defaultData = getDefaultFilterButtonsData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      filterButtonsStates: { ...state.filterButtonsStates, [variantId]: data },
    } as any;
  },

  getData: (state: any, variantId: string) =>
    state.filterButtonsStates[variantId] || getDefaultFilterButtonsData(),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    filterButtonsStates: { ...state.filterButtonsStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.filterButtonsStates[variantId] || getDefaultFilterButtonsData();
    const newData = updateDataByPath(source, path, value);

    return {
      filterButtonsStates: {
        ...state.filterButtonsStates,
        [variantId]: newData,
      },
    } as any;
  },
};
