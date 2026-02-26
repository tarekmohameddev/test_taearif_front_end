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
});

export const projectsShowcaseFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.projectsShowcaseStates?.[variantId] &&
      Object.keys(state.projectsShowcaseStates[variantId]).length > 0
    ) {
      return {} as any;
    }
    const defaultData = getDefaultProjectsShowcaseData();
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      projectsShowcaseStates: {
        ...(state.projectsShowcaseStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    state.projectsShowcaseStates?.[variantId] ||
    getDefaultProjectsShowcaseData(),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    projectsShowcaseStates: {
      ...(state.projectsShowcaseStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.projectsShowcaseStates?.[variantId] ||
      getDefaultProjectsShowcaseData();
    const newData = updateDataByPath(source, path, value);
    return {
      projectsShowcaseStates: {
        ...(state.projectsShowcaseStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
