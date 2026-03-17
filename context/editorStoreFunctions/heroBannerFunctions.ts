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
  titleTextProps: {
    color: "#deae6d",
    fontSize: "4.5rem",
    fontWeight: 400,
  },
  subtitleTextProps: {
    color: "#fff",
    fontSize: "3rem",
    fontWeight: 700,
  },
  descriptionTextProps: {
    color: "#fff",
    fontSize: "1.125rem",
    lineHeight: "1.6",
    maxWidth: "36rem",
  },
  primaryCta: DEFAULTS.primaryCta,
  secondaryCta: DEFAULTS.secondaryCta,
  videoSrc: DEFAULTS.videoSrc,
  fallbackImage: undefined,
  showScrollIndicator: true,
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS — Standard 4 functions
// ═══════════════════════════════════════════════════════════

/** Merge stored data with defaults (same shape as getData) so store always has full shape. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultHeroBannerData();
  return {
    ...defaultData,
    ...stored,
    titleTextProps: {
      ...defaultData.titleTextProps,
      ...(stored.titleTextProps || {}),
    },
    subtitleTextProps: {
      ...defaultData.subtitleTextProps,
      ...(stored.subtitleTextProps || {}),
    },
    descriptionTextProps: {
      ...defaultData.descriptionTextProps,
      ...(stored.descriptionTextProps || {}),
    },
    primaryCta: stored.primaryCta
      ? { ...defaultData.primaryCta!, ...stored.primaryCta }
      : defaultData.primaryCta,
    secondaryCta: stored.secondaryCta
      ? { ...defaultData.secondaryCta!, ...stored.secondaryCta }
      : defaultData.secondaryCta,
  } as ComponentData;
}

export const heroBannerFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultHeroBannerData();
    const stored = state.heroBannerStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      // Merge existing stored with defaults so store always has full shape
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }

    return {
      heroBannerStates: {
        ...(state.heroBannerStates || {}),
        [variantId]: data,
      },
    } as any;
  },

  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.heroBannerStates?.[variantId] || {}),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    heroBannerStates: { ...(state.heroBannerStates || {}), [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.heroBannerStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      heroBannerStates: {
        ...(state.heroBannerStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
