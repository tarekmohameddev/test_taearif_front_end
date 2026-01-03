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
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.gridStates[variantId] &&
      Object.keys(state.gridStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    const defaultData = getDefaultGridData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      gridStates: { ...state.gridStates, [variantId]: data },
    } as any;
  },

  getData: (state: any, variantId: string) =>
    state.gridStates[variantId] || getDefaultGridData(),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    gridStates: { ...state.gridStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.gridStates[variantId] || getDefaultGridData();
    const newData = updateDataByPath(source, path, value);

    return {
      gridStates: { ...state.gridStates, [variantId]: newData },
    } as any;
  },
};
