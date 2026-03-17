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
  headingTextProps: {},
  introTextProps: {},
  cardTitleTextProps: {},
  cardDescriptionTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultCreativityTriadSectionData();
  return {
    ...defaultData,
    ...stored,
    headingTextProps: { ...(defaultData.headingTextProps || {}), ...(stored.headingTextProps || {}) },
    introTextProps: { ...(defaultData.introTextProps || {}), ...(stored.introTextProps || {}) },
    cardTitleTextProps: { ...(defaultData.cardTitleTextProps || {}), ...(stored.cardTitleTextProps || {}) },
    cardDescriptionTextProps: { ...(defaultData.cardDescriptionTextProps || {}), ...(stored.cardDescriptionTextProps || {}) },
  } as ComponentData;
}

export const creativityTriadSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultCreativityTriadSectionData();
    const stored = state.creativityTriadSectionStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }
    return {
      creativityTriadSectionStates: {
        ...(state.creativityTriadSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.creativityTriadSectionStates?.[variantId] || {}),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    creativityTriadSectionStates: {
      ...(state.creativityTriadSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.creativityTriadSectionStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      creativityTriadSectionStates: {
        ...(state.creativityTriadSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
