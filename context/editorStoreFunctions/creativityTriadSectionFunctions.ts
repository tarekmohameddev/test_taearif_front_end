import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import {
  DEFAULT_HEADING,
  DEFAULT_INTRO,
  DEFAULT_CARDS,
} from "@/stories/CreativityTriadSection/data";

export const getDefaultCreativityTriadSectionData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  heading: DEFAULT_HEADING,
  intro: DEFAULT_INTRO,
  cards: DEFAULT_CARDS,
});

export const creativityTriadSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.creativityTriadSectionStates?.[variantId] &&
      Object.keys(state.creativityTriadSectionStates[variantId]).length > 0
    ) {
      return {} as any;
    }
    const defaultData = getDefaultCreativityTriadSectionData();
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      creativityTriadSectionStates: {
        ...(state.creativityTriadSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    state.creativityTriadSectionStates?.[variantId] || getDefaultCreativityTriadSectionData(),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    creativityTriadSectionStates: {
      ...(state.creativityTriadSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.creativityTriadSectionStates?.[variantId] ||
      getDefaultCreativityTriadSectionData();
    const newData = updateDataByPath(source, path, value);
    return {
      creativityTriadSectionStates: {
        ...(state.creativityTriadSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
