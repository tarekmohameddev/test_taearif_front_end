import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import { DEFAULT_HEADING, DEFAULT_DESCRIPTION } from "@/stories/ValuesSection/data";

// Store iconKey instead of ReactNode; tenant component maps to actual icon
const DEFAULT_CARDS = [
  { title: "المجتمع أولاً", description: "مساحات تعزز الترابط الاجتماعي وتناغمها", iconKey: "community", bgVariant: "muted-foreground" as const },
  { title: "الأصالة المتجددة", description: "استلهام من إرثنا المعماري برؤية عصرية.", iconKey: "heritage", bgVariant: "darken" as const },
  { title: "الجودة كمعيار", description: "التزام مطلق بأعلى معايير الجودة في المواد والتنفيذ.", iconKey: "quality", bgVariant: "black" as const },
];

export const getDefaultValuesSectionData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  heading: DEFAULT_HEADING,
  description: DEFAULT_DESCRIPTION,
  cards: DEFAULT_CARDS,
});

export const valuesSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.valuesSectionStates?.[variantId] &&
      Object.keys(state.valuesSectionStates[variantId]).length > 0
    ) {
      return {} as any;
    }
    const defaultData = getDefaultValuesSectionData();
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      valuesSectionStates: {
        ...(state.valuesSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    state.valuesSectionStates?.[variantId] || getDefaultValuesSectionData(),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    valuesSectionStates: {
      ...(state.valuesSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.valuesSectionStates?.[variantId] || getDefaultValuesSectionData();
    const newData = updateDataByPath(source, path, value);
    return {
      valuesSectionStates: {
        ...(state.valuesSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
