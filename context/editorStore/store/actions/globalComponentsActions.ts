import type { EditorStore } from "../../types/types";
import type { StateCreator } from "zustand";
import { ComponentData } from "@/lib/types";
import { getDefaultHeaderData } from "../../../editorStoreFunctions/headerFunctions";
import { getDefaultFooterData } from "../../../editorStoreFunctions/footerFunctions";

export const createGlobalComponentsActions = (
  set: StateCreator<EditorStore>["setState"],
): Pick<
  EditorStore,
  | "setGlobalHeaderData"
  | "setGlobalFooterData"
  | "setGlobalHeaderVariant"
  | "setGlobalFooterVariant"
  | "updateGlobalHeaderByPath"
  | "updateGlobalFooterByPath"
  | "setGlobalComponentsData"
  | "updateGlobalComponentByPath"
> => ({
  setGlobalHeaderData: (data) =>
    set(() => {
      return { globalHeaderData: data };
    }),
  setGlobalFooterData: (data) =>
    set(() => {
      return { globalFooterData: data };
    }),
  setGlobalHeaderVariant: (variant) =>
    set(() => {
      return { globalHeaderVariant: variant };
    }),
  setGlobalFooterVariant: (variant) =>
    set(() => {
      return { globalFooterVariant: variant };
    }),
  updateGlobalHeaderByPath: (path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Use default data if current data is empty
      let currentData = state.globalHeaderData;
      if (!currentData || Object.keys(currentData).length === 0) {
        currentData = getDefaultHeaderData();
      }

      let newData: any = { ...currentData };
      let cursor: any = newData;

      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];

        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          cursor[key] = nextIsIndex ? [] : {};
        } else if (Array.isArray(existing) && !nextIsIndex) {
          cursor[key] = {};
        } else if (
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          nextIsIndex
        ) {
          cursor[key] = [];
        }
        cursor = cursor[key];
      }
      const lastKey = segments[segments.length - 1]!;
      cursor[lastKey] = value;

      // Force a new reference to ensure React re-renders
      const result = {
        globalHeaderData: JSON.parse(JSON.stringify(newData)),
      };
      return result;
    }),
  updateGlobalFooterByPath: (path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Use default data if current data is empty
      let currentData = state.globalFooterData;
      if (!currentData || Object.keys(currentData).length === 0) {
        currentData = getDefaultFooterData();
      }

      let newData: any = { ...currentData };
      let cursor: any = newData;

      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];

        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          cursor[key] = nextIsIndex ? [] : {};
        } else if (Array.isArray(existing) && !nextIsIndex) {
          cursor[key] = {};
        } else if (
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          nextIsIndex
        ) {
          cursor[key] = [];
        }
        cursor = cursor[key];
      }
      const lastKey = segments[segments.length - 1]!;
      cursor[lastKey] = value;

      // Force a new reference to ensure React re-renders
      const result = {
        globalFooterData: JSON.parse(JSON.stringify(newData)),
      };
      return result;
    }),
  setGlobalComponentsData: (data) =>
    set(() => {
      return { globalComponentsData: data };
    }),
  updateGlobalComponentByPath: (componentType, path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Get current data or initialize with defaults
      let currentData = state.globalComponentsData[componentType];
      if (!currentData || Object.keys(currentData).length === 0) {
        currentData =
          componentType === "header"
            ? getDefaultHeaderData()
            : getDefaultFooterData();
      }

      // Create a deep copy to avoid mutations
      let newData = JSON.parse(JSON.stringify(currentData));
      let cursor: any = newData;

      // Navigate to the target path
      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];

        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          cursor[key] = nextIsIndex ? [] : {};
        } else if (Array.isArray(existing) && !nextIsIndex) {
          cursor[key] = {};
        } else if (
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          nextIsIndex
        ) {
          cursor[key] = [];
        }
        cursor = cursor[key];
      }

      // Set the final value
      const lastKey = segments[segments.length - 1]!;
      cursor[lastKey] = value;

      // Return new state with properly replaced data
      return {
        globalComponentsData: {
          ...state.globalComponentsData,
          [componentType]: newData,
        },
      };
    }),
});
