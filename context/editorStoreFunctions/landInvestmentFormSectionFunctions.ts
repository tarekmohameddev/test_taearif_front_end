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
});

export const landInvestmentFormSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.landInvestmentFormSectionStates?.[variantId] &&
      Object.keys(state.landInvestmentFormSectionStates[variantId]).length > 0
    ) {
      return {} as any;
    }
    const defaultData = getDefaultLandInvestmentFormSectionData();
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      landInvestmentFormSectionStates: {
        ...(state.landInvestmentFormSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    state.landInvestmentFormSectionStates?.[variantId] ||
    getDefaultLandInvestmentFormSectionData(),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    landInvestmentFormSectionStates: {
      ...(state.landInvestmentFormSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.landInvestmentFormSectionStates?.[variantId] ||
      getDefaultLandInvestmentFormSectionData();
    const newData = updateDataByPath(source, path, value);
    return {
      landInvestmentFormSectionStates: {
        ...(state.landInvestmentFormSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
