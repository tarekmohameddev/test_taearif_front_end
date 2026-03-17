import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import {
  DEFAULT_HEADING,
  DEFAULT_JOURNEY_LABEL,
  DEFAULT_STEPS,
  DEFAULT_FLAG_IMAGE_SRC,
  DEFAULT_FLAG_IMAGE_ALT,
} from "@/stories/JourneySection/data";

export const getDefaultJourneySectionData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  heading: DEFAULT_HEADING,
  journeyLabel: DEFAULT_JOURNEY_LABEL,
  steps: DEFAULT_STEPS,
  flagImageSrc: DEFAULT_FLAG_IMAGE_SRC,
  flagImageAlt: DEFAULT_FLAG_IMAGE_ALT,
  headingTextProps: {},
  journeyLabelTextProps: {},
  stepTitleTextProps: {},
  stepDurationTextProps: {},
  stepDescriptionTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultJourneySectionData();
  return {
    ...defaultData,
    ...stored,
    headingTextProps: { ...(defaultData.headingTextProps || {}), ...(stored.headingTextProps || {}) },
    journeyLabelTextProps: { ...(defaultData.journeyLabelTextProps || {}), ...(stored.journeyLabelTextProps || {}) },
    stepTitleTextProps: { ...(defaultData.stepTitleTextProps || {}), ...(stored.stepTitleTextProps || {}) },
    stepDurationTextProps: { ...(defaultData.stepDurationTextProps || {}), ...(stored.stepDurationTextProps || {}) },
    stepDescriptionTextProps: { ...(defaultData.stepDescriptionTextProps || {}), ...(stored.stepDescriptionTextProps || {}) },
  } as ComponentData;
}

export const journeySectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultJourneySectionData();
    const stored = state.journeySectionStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }
    return {
      journeySectionStates: {
        ...(state.journeySectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.journeySectionStates?.[variantId] || {}),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    journeySectionStates: {
      ...(state.journeySectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.journeySectionStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      journeySectionStates: {
        ...(state.journeySectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
