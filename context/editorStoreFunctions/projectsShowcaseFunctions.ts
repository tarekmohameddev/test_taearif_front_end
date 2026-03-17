import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";
import {
  DEFAULT_FILTERS,
  DEFAULT_PROJECTS,
} from "@/stories/ProjectsShowcase/data";

export const getDefaultProjectsShowcaseData = (): ComponentData => ({
  visible: true,
  dir: "rtl",
  filters: DEFAULT_FILTERS,
  projects: DEFAULT_PROJECTS,
  filterButtonTextProps: {},
  statusBadgeTextProps: {},
  projectTitleTextProps: {},
  projectLocationTextProps: {},
  projectDescriptionTextProps: {},
  unitTypeTextProps: {},
  ctaTextProps: {},
});

/** Merge stored data with defaults so store always has full shape including *TextProps. */
function mergeWithDefaults(stored: Record<string, any>): ComponentData {
  const defaultData = getDefaultProjectsShowcaseData();
  return {
    ...defaultData,
    ...stored,
    filterButtonTextProps: { ...(defaultData.filterButtonTextProps || {}), ...(stored.filterButtonTextProps || {}) },
    statusBadgeTextProps: { ...(defaultData.statusBadgeTextProps || {}), ...(stored.statusBadgeTextProps || {}) },
    projectTitleTextProps: { ...(defaultData.projectTitleTextProps || {}), ...(stored.projectTitleTextProps || {}) },
    projectLocationTextProps: { ...(defaultData.projectLocationTextProps || {}), ...(stored.projectLocationTextProps || {}) },
    projectDescriptionTextProps: { ...(defaultData.projectDescriptionTextProps || {}), ...(stored.projectDescriptionTextProps || {}) },
    unitTypeTextProps: { ...(defaultData.unitTypeTextProps || {}), ...(stored.unitTypeTextProps || {}) },
    ctaTextProps: { ...(defaultData.ctaTextProps || {}), ...(stored.ctaTextProps || {}) },
  } as ComponentData;
}

export const projectsShowcaseFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    const defaultData = getDefaultProjectsShowcaseData();
    const stored = state.projectsShowcaseStates?.[variantId];
    const hasStored = stored && Object.keys(stored).length > 0;

    let data: ComponentData;
    if (hasStored) {
      data = mergeWithDefaults(stored);
    } else {
      data = initial || state.tempData || defaultData;
    }
    return {
      projectsShowcaseStates: {
        ...(state.projectsShowcaseStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    mergeWithDefaults(state.projectsShowcaseStates?.[variantId] || {}),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    projectsShowcaseStates: {
      ...(state.projectsShowcaseStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const stored = state.projectsShowcaseStates?.[variantId] || {};
    const fullSource = mergeWithDefaults(stored);
    const newData = updateDataByPath(fullSource, path, value);
    return {
      projectsShowcaseStates: {
        ...(state.projectsShowcaseStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
