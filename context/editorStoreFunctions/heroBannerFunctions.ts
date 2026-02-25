import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import { DEFAULTS } from "@/stories/HeroBanner/data";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA — matches stories/HeroBanner types and data
// ═══════════════════════════════════════════════════════════

export const getDefaultHeroBannerData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  title: DEFAULTS.title,
  subtitle: DEFAULTS.subtitle,
  description: DEFAULTS.description,
  primaryCta: DEFAULTS.primaryCta,
  secondaryCta: DEFAULTS.secondaryCta,
  videoSrc: DEFAULTS.videoSrc,
  fallbackImage: undefined,
  showScrollIndicator: true,
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS — Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const heroBannerFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.heroBannerStates?.[variantId] &&
      Object.keys(state.heroBannerStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    const defaultData = getDefaultHeroBannerData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      heroBannerStates: {
        ...(state.heroBannerStates || {}),
        [variantId]: data,
      },
    } as any;
  },

  getData: (state: any, variantId: string) =>
    state.heroBannerStates?.[variantId] || {},

  setData: (state: any, variantId: string, data: ComponentData) => ({
    heroBannerStates: { ...(state.heroBannerStates || {}), [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.heroBannerStates?.[variantId] || {};
    const newData = updateDataByPath(source, path, value);
    return {
      heroBannerStates: {
        ...(state.heroBannerStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
