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
});

export const journeySectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.journeySectionStates?.[variantId] &&
      Object.keys(state.journeySectionStates[variantId]).length > 0
    ) {
      return {} as any;
    }
    const defaultData = getDefaultJourneySectionData();
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      journeySectionStates: {
        ...(state.journeySectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    state.journeySectionStates?.[variantId] || getDefaultJourneySectionData(),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    journeySectionStates: {
      ...(state.journeySectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.journeySectionStates?.[variantId] || getDefaultJourneySectionData();
    const newData = updateDataByPath(source, path, value);
    return {
      journeySectionStates: {
        ...(state.journeySectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
