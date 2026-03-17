import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import {
  DEFAULT_IMAGE_SRC,
  DEFAULT_IMAGE_ALT,
  DEFAULT_BACKGROUND_IMAGE_SRC,
  DEFAULT_ROLE_LABEL,
  DEFAULT_NAME,
  DEFAULT_HEADING,
  DEFAULT_QUOTE,
} from "@/stories/CommitmentSection/data";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA — matches stories/CommitmentSection types and data
// ═══════════════════════════════════════════════════════════

export const getDefaultCommitmentSectionData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  imageSrc: DEFAULT_IMAGE_SRC,
  imageAlt: DEFAULT_IMAGE_ALT,
  backgroundImageSrc: DEFAULT_BACKGROUND_IMAGE_SRC,
  roleLabel: DEFAULT_ROLE_LABEL,
  name: DEFAULT_NAME,
  heading: DEFAULT_HEADING,
  quote: DEFAULT_QUOTE,
  roleLabelTextProps: {},
  nameTextProps: {},
  headingTextProps: {},
  quoteTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultCommitmentSectionData();
  return {
    ...defaultData,
    ...stored,
    roleLabelTextProps: { ...(defaultData.roleLabelTextProps || {}), ...(stored.roleLabelTextProps || {}) },
    nameTextProps: { ...(defaultData.nameTextProps || {}), ...(stored.nameTextProps || {}) },
    headingTextProps: { ...(defaultData.headingTextProps || {}), ...(stored.headingTextProps || {}) },
    quoteTextProps: { ...(defaultData.quoteTextProps || {}), ...(stored.quoteTextProps || {}) },
  } as ComponentData;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS — Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const commitmentSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultCommitmentSectionData();
    const stored = state.commitmentSectionStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }

    return {
      commitmentSectionStates: {
        ...(state.commitmentSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },

  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.commitmentSectionStates?.[variantId] || {}),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    commitmentSectionStates: {
      ...(state.commitmentSectionStates || {}),
      [variantId]: data,
    },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.commitmentSectionStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      commitmentSectionStates: {
        ...(state.commitmentSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
