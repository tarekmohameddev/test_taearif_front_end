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
  headingTextProps: {},
  descriptionTextProps: {},
  cardTitleTextProps: {},
  cardDescriptionTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultValuesSectionData();
  return {
    ...defaultData,
    ...stored,
    headingTextProps: { ...(defaultData.headingTextProps || {}), ...(stored.headingTextProps || {}) },
    descriptionTextProps: { ...(defaultData.descriptionTextProps || {}), ...(stored.descriptionTextProps || {}) },
    cardTitleTextProps: { ...(defaultData.cardTitleTextProps || {}), ...(stored.cardTitleTextProps || {}) },
    cardDescriptionTextProps: { ...(defaultData.cardDescriptionTextProps || {}), ...(stored.cardDescriptionTextProps || {}) },
  } as ComponentData;
}

export const valuesSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultValuesSectionData();
    const stored = state.valuesSectionStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }
    return {
      valuesSectionStates: {
        ...(state.valuesSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.valuesSectionStates?.[variantId] || {}),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    valuesSectionStates: {
      ...(state.valuesSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.valuesSectionStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      valuesSectionStates: {
        ...(state.valuesSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
