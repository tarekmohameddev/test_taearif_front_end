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
});

export const philosophyCtaSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.philosophyCtaSectionStates?.[variantId] &&
      Object.keys(state.philosophyCtaSectionStates[variantId]).length > 0
    ) {
      return {} as any;
    }
    const defaultData = getDefaultPhilosophyCtaSectionData();
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      philosophyCtaSectionStates: {
        ...(state.philosophyCtaSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    state.philosophyCtaSectionStates?.[variantId] ||
    getDefaultPhilosophyCtaSectionData(),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    philosophyCtaSectionStates: {
      ...(state.philosophyCtaSectionStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.philosophyCtaSectionStates?.[variantId] ||
      getDefaultPhilosophyCtaSectionData();
    const newData = updateDataByPath(source, path, value);
    return {
      philosophyCtaSectionStates: {
        ...(state.philosophyCtaSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
