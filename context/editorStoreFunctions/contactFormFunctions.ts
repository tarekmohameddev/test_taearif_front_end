import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import {
  DEFAULT_HEADING,
  DEFAULT_DESCRIPTION,
  DEFAULT_FIELDS,
  DEFAULT_LINKS,
  DEFAULT_SUBMIT_TEXT,
  DEFAULT_IMAGE_SRC,
  DEFAULT_IMAGE_ALT,
  DEFAULT_SHAPE_SRC,
} from "@/stories/ContactForm/data";

export const getDefaultContactFormData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  heading: DEFAULT_HEADING,
  description: DEFAULT_DESCRIPTION,
  fields: DEFAULT_FIELDS,
  links: DEFAULT_LINKS,
  submitText: DEFAULT_SUBMIT_TEXT,
  imageSrc: DEFAULT_IMAGE_SRC,
  imageAlt: DEFAULT_IMAGE_ALT,
  shapeSrc: DEFAULT_SHAPE_SRC,
  headingTextProps: {},
  descriptionTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultContactFormData();
  return {
    ...defaultData,
    ...stored,
    headingTextProps: { ...(defaultData.headingTextProps || {}), ...(stored.headingTextProps || {}) },
    descriptionTextProps: { ...(defaultData.descriptionTextProps || {}), ...(stored.descriptionTextProps || {}) },
  } as ComponentData;
}

export const contactFormFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultContactFormData();
    const stored = state.contactFormStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }
    return {
      contactFormStates: {
        ...(state.contactFormStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.contactFormStates?.[variantId] || {}),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    contactFormStates: {
      ...(state.contactFormStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.contactFormStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      contactFormStates: {
        ...(state.contactFormStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
