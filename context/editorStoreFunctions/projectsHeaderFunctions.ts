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
});

export const projectsHeaderFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.projectsHeaderStates?.[variantId] &&
      Object.keys(state.projectsHeaderStates[variantId]).length > 0
    ) {
      return {} as any;
    }
    const defaultData = getDefaultProjectsHeaderData();
    const data: ComponentData = initial || state.tempData || defaultData;
    return {
      projectsHeaderStates: {
        ...(state.projectsHeaderStates || {}),
        [variantId]: data,
      },
    } as any;
  },
  getData: (state: any, variantId: string) =>
    state.projectsHeaderStates?.[variantId] || getDefaultProjectsHeaderData(),
  setData: (state: any, variantId: string, data: ComponentData) => ({
    projectsHeaderStates: {
      ...(state.projectsHeaderStates || {}),
      [variantId]: data,
    },
  }),
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source =
      state.projectsHeaderStates?.[variantId] || getDefaultProjectsHeaderData();
    const newData = updateDataByPath(source, path, value);
    return {
      projectsHeaderStates: {
        ...(state.projectsHeaderStates || {}),
        [variantId]: newData,
      },
    } as any;
  },
};
