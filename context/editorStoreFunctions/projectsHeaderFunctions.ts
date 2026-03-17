import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import { DEFAULT_HEADING, DEFAULT_DESCRIPTION } from "@/stories/ProjectsHeader/data";

export const getDefaultProjectsHeaderData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  heading: DEFAULT_HEADING,
  description: Array.isArray(DEFAULT_DESCRIPTION)
    ? DEFAULT_DESCRIPTION.join("\n")
    : (typeof DEFAULT_DESCRIPTION === "string" ? DEFAULT_DESCRIPTION : ""),
  headingTextProps: {},
  descriptionTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultProjectsHeaderData();
  return {
    ...defaultData,
    ...stored,
    headingTextProps: { ...(defaultData.headingTextProps || {}), ...(stored.headingTextProps || {}) },
    descriptionTextProps: { ...(defaultData.descriptionTextProps || {}), ...(stored.descriptionTextProps || {}) },
  } as ComponentData;
}

export const projectsHeaderFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultProjectsHeaderData();
    const stored = state.projectsHeaderStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }
    return {
      projectsHeaderStates: {
        ...(state.projectsHeaderStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.projectsHeaderStates?.[variantId] || {}),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    projectsHeaderStates: {
      ...(state.projectsHeaderStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.projectsHeaderStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      projectsHeaderStates: {
        ...(state.projectsHeaderStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
