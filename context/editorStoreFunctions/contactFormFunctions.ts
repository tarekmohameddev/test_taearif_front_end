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
});

export const contactFormFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.contactFormStates?.[variantId] &&
      Object.keys(state.contactFormStates[variantId]).length > 0
    ) {
      return {} as any;
    }
    const defaultData = getDefaultContactFormData();
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      contactFormStates: {
        ...(state.contactFormStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    state.contactFormStates?.[variantId] || getDefaultContactFormData(),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    contactFormStates: {
      ...(state.contactFormStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.contactFormStates?.[variantId] || getDefaultContactFormData();
    const newData = updateDataByPath(source, path, value);
    return {
      contactFormStates: {
        ...(state.contactFormStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
