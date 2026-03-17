import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import {
  DEFAULT_QUOTE,
  DEFAULT_IMAGE_SRC,
  DEFAULT_IMAGE_ALT,
  DEFAULT_NAME,
  DEFAULT_ROLE,
} from "@/stories/QuoteSection/data";

export const getDefaultQuoteSectionData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  quote: DEFAULT_QUOTE,
  imageSrc: DEFAULT_IMAGE_SRC,
  imageAlt: DEFAULT_IMAGE_ALT,
  name: DEFAULT_NAME,
  role: DEFAULT_ROLE,
  quoteTextProps: {},
  nameTextProps: {},
  roleTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultQuoteSectionData();
  return {
    ...defaultData,
    ...stored,
    quoteTextProps: { ...(defaultData.quoteTextProps || {}), ...(stored.quoteTextProps || {}) },
    nameTextProps: { ...(defaultData.nameTextProps || {}), ...(stored.nameTextProps || {}) },
    roleTextProps: { ...(defaultData.roleTextProps || {}), ...(stored.roleTextProps || {}) },
  } as ComponentData;
}

export const quoteSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultQuoteSectionData();
    const stored = state.quoteSectionStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }
    return {
      quoteSectionStates: {
        ...(state.quoteSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.quoteSectionStates?.[variantId] || {}),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    quoteSectionStates: {
      ...(state.quoteSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.quoteSectionStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      quoteSectionStates: {
        ...(state.quoteSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
