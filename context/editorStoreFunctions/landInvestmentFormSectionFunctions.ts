import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import {
  DEFAULT_HEADING,
  DEFAULT_DESCRIPTION,
  DEFAULT_BOTTOM_IMAGE_SRC,
  DEFAULT_BOTTOM_IMAGE_ALT,
} from "@/stories/LandInvestmentFormSection/data";

export const getDefaultLandInvestmentFormSectionData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  id: "form-section",
  heading: DEFAULT_HEADING,
  description: DEFAULT_DESCRIPTION,
  bottomImageSrc: DEFAULT_BOTTOM_IMAGE_SRC,
  bottomImageAlt: DEFAULT_BOTTOM_IMAGE_ALT,
  headingTextProps: {},
  descriptionTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultLandInvestmentFormSectionData();
  return {
    ...defaultData,
    ...stored,
    headingTextProps: { ...(defaultData.headingTextProps || {}), ...(stored.headingTextProps || {}) },
    descriptionTextProps: { ...(defaultData.descriptionTextProps || {}), ...(stored.descriptionTextProps || {}) },
  } as ComponentData;
}

export const landInvestmentFormSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultLandInvestmentFormSectionData();
    const stored = state.landInvestmentFormSectionStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }
    return {
      landInvestmentFormSectionStates: {
        ...(state.landInvestmentFormSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.landInvestmentFormSectionStates?.[variantId] || {}),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    landInvestmentFormSectionStates: {
      ...(state.landInvestmentFormSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.landInvestmentFormSectionStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      landInvestmentFormSectionStates: {
        ...(state.landInvestmentFormSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
