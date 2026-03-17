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
  headingTextProps: {},
  leadTextProps: {},
  bodyTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultEssenceSectionData();
  return {
    ...defaultData,
    ...stored,
    headingTextProps: { ...(defaultData.headingTextProps || {}), ...(stored.headingTextProps || {}) },
    leadTextProps: { ...(defaultData.leadTextProps || {}), ...(stored.leadTextProps || {}) },
    bodyTextProps: { ...(defaultData.bodyTextProps || {}), ...(stored.bodyTextProps || {}) },
  } as ComponentData;
}

export const essenceSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultEssenceSectionData();
    const stored = state.essenceSectionStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }
    return {
      essenceSectionStates: {
        ...(state.essenceSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.essenceSectionStates?.[variantId] || {}),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    essenceSectionStates: {
      ...(state.essenceSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.essenceSectionStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      essenceSectionStates: {
        ...(state.essenceSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
