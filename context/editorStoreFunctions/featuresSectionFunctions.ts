import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import {
  DEFAULT_HEADING,
  DEFAULT_FEATURES,
  DEFAULT_CERTIFICATIONS,
} from "@/stories/FeaturesSection/data";

export const getDefaultFeaturesSectionData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  heading: DEFAULT_HEADING,
  features: DEFAULT_FEATURES,
  certifications: DEFAULT_CERTIFICATIONS,
});

export const featuresSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.featuresSectionStates?.[variantId] &&
      Object.keys(state.featuresSectionStates[variantId]).length > 0
    ) {
      return {} as any;
    }
    const defaultData = getDefaultFeaturesSectionData();
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      featuresSectionStates: {
        ...(state.featuresSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    state.featuresSectionStates?.[variantId] || getDefaultFeaturesSectionData(),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    featuresSectionStates: {
      ...(state.featuresSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.featuresSectionStates?.[variantId] || getDefaultFeaturesSectionData();
    const newData = updateDataByPath(source, path, value);
    return {
      featuresSectionStates: {
        ...(state.featuresSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
