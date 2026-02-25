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
});

export const quoteSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.quoteSectionStates?.[variantId] &&
      Object.keys(state.quoteSectionStates[variantId]).length > 0
    ) {
      return {} as any;
    }
    const defaultData = getDefaultQuoteSectionData();
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      quoteSectionStates: {
        ...(state.quoteSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    state.quoteSectionStates?.[variantId] || getDefaultQuoteSectionData(),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    quoteSectionStates: {
      ...(state.quoteSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.quoteSectionStates?.[variantId] || getDefaultQuoteSectionData();
    const newData = updateDataByPath(source, path, value);
    return {
      quoteSectionStates: {
        ...(state.quoteSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
