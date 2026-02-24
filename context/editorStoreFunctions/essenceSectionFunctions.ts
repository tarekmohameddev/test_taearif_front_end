import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import {
  DEFAULT_HEADING,
  DEFAULT_LEAD,
  DEFAULT_BODY1,
  DEFAULT_BODY2,
} from "@/stories/EssenceSection/data";

export const getDefaultEssenceSectionData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  heading: DEFAULT_HEADING,
  lead: DEFAULT_LEAD,
  body1: DEFAULT_BODY1,
  body2: DEFAULT_BODY2,
});

export const essenceSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.essenceSectionStates?.[variantId] &&
      Object.keys(state.essenceSectionStates[variantId]).length > 0
    ) {
      return {} as any;
    }
    const defaultData = getDefaultEssenceSectionData();
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      essenceSectionStates: {
        ...(state.essenceSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    state.essenceSectionStates?.[variantId] || getDefaultEssenceSectionData(),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    essenceSectionStates: {
      ...(state.essenceSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.essenceSectionStates?.[variantId] || getDefaultEssenceSectionData();
    const newData = updateDataByPath(source, path, value);
    return {
      essenceSectionStates: {
        ...(state.essenceSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
