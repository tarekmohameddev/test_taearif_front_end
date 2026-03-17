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
  headingTextProps: {},
  featureTitleTextProps: {},
  featureDescriptionTextProps: {},
  certificationTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultFeaturesSectionData();
  return {
    ...defaultData,
    ...stored,
    headingTextProps: { ...(defaultData.headingTextProps || {}), ...(stored.headingTextProps || {}) },
    featureTitleTextProps: { ...(defaultData.featureTitleTextProps || {}), ...(stored.featureTitleTextProps || {}) },
    featureDescriptionTextProps: { ...(defaultData.featureDescriptionTextProps || {}), ...(stored.featureDescriptionTextProps || {}) },
    certificationTextProps: { ...(defaultData.certificationTextProps || {}), ...(stored.certificationTextProps || {}) },
  } as ComponentData;
}

export const featuresSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultFeaturesSectionData();
    const stored = state.featuresSectionStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }
    return {
      featuresSectionStates: {
        ...(state.featuresSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.featuresSectionStates?.[variantId] || {}),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    featuresSectionStates: {
      ...(state.featuresSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.featuresSectionStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      featuresSectionStates: {
        ...(state.featuresSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
