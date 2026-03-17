import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import {
  DEFAULT_HEADING,
  DEFAULT_DESCRIPTION,
  DEFAULT_CTA_LABEL,
  DEFAULT_CTA_HREF,
} from "@/stories/PhilosophyCtaSection/data";

export const getDefaultPhilosophyCtaSectionData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  heading: DEFAULT_HEADING,
  description: DEFAULT_DESCRIPTION,
  ctaLabel: DEFAULT_CTA_LABEL,
  ctaHref: DEFAULT_CTA_HREF,
  headingTextProps: {},
  descriptionTextProps: {},
  ctaTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultPhilosophyCtaSectionData();
  return {
    ...defaultData,
    ...stored,
    headingTextProps: { ...(defaultData.headingTextProps || {}), ...(stored.headingTextProps || {}) },
    descriptionTextProps: { ...(defaultData.descriptionTextProps || {}), ...(stored.descriptionTextProps || {}) },
    ctaTextProps: { ...(defaultData.ctaTextProps || {}), ...(stored.ctaTextProps || {}) },
  } as ComponentData;
}

export const philosophyCtaSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultPhilosophyCtaSectionData();
    const stored = state.philosophyCtaSectionStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }
    return {
      philosophyCtaSectionStates: {
        ...(state.philosophyCtaSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.philosophyCtaSectionStates?.[variantId] || {}),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    philosophyCtaSectionStates: {
      ...(state.philosophyCtaSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.philosophyCtaSectionStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      philosophyCtaSectionStates: {
        ...(state.philosophyCtaSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
