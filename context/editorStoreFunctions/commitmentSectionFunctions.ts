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
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS — Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const commitmentSectionFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.commitmentSectionStates?.[variantId] &&
      Object.keys(state.commitmentSectionStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    const defaultData = getDefaultCommitmentSectionData();
    const data: ComponentData = initial || state.tempData || defaultData;

    return {
      commitmentSectionStates: {
        ...(state.commitmentSectionStates || {}),
        [variantId]: data,
      },
    } as any;
  },

  getData: (state: any, variantId: string) =>
    state.commitmentSectionStates?.[variantId] || getDefaultCommitmentSectionData(),

  setData: (state: any, variantId: string, data: ComponentData) => ({
    commitmentSectionStates: {
      ...(state.commitmentSectionStates || {}),
      [variantId]: data,
    },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.commitmentSectionStates?.[variantId] ||
      getDefaultCommitmentSectionData();
    const newData = updateDataByPath(source, path, value);
    return {
      commitmentSectionStates: {
        ...(state.commitmentSectionStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
