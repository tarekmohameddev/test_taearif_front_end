import type { EditorStore } from "../../types/types";
import type { StateCreator } from "zustand";
import { ComponentData } from "@/lib/types";
import { deepMerge } from "../../utils/deepMerge";
import { getDefaultHeaderData } from "../../../editorStoreFunctions/headerFunctions";
import { getDefaultFooterData } from "../../../editorStoreFunctions/footerFunctions";

export const createTempDataActions = (
  set: StateCreator<EditorStore>["setState"],
  get: StateCreator<EditorStore>["getState"],
): Pick<EditorStore, "setTempData" | "updateTempField" | "updateByPath"> => ({
  setTempData: (data) => set(() => ({ tempData: data })),
  updateTempField: (field, key, value) =>
    set((state) => {
      const updated = {
        ...state.tempData,
        [field]: {
          ...state.tempData?.[field],
          [key]: value,
        },
      } as ComponentData;
      return { tempData: updated };
    }),
  updateByPath: (path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Initialize tempData with current component data if it's empty
      let newData: any = { ...(state.tempData || {}) };

      // Special handling for menu items - always preserve tempData if it exists
      if (path === "menu" && state.tempData && state.tempData.menu) {
        newData = { ...state.tempData };
      }
      // If tempData is empty, try to get current component data
      else if (!state.tempData || Object.keys(state.tempData).length === 0) {
        // For global components, use the global data as base
        if (state.currentPage === "global-header") {
          // This is a global header component, use globalHeaderData as base
          newData = { ...state.globalHeaderData };
        } else if (state.currentPage === "global-footer") {
          // This is a global footer component, use globalFooterData as base
          newData = { ...state.globalFooterData };
        } else {
          // For other components, use empty object
          newData = {};
        }
      } else {
        // If tempData exists, use it as base and merge with global data for missing fields
        if (state.currentPage === "global-header") {
          // Merge tempData with globalHeaderData to ensure all fields are present
          // Use deep merge to preserve nested objects like menu arrays
          // Priority: tempData > globalHeaderData (tempData should override)
          newData = deepMerge(state.globalHeaderData, state.tempData);
        } else if (state.currentPage === "global-footer") {
          // Merge tempData with globalFooterData to ensure all fields are present
          // Use deep merge to preserve nested objects
          newData = deepMerge(state.globalFooterData, state.tempData);
        }
      }

      let cursor: any = newData;
      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];
        const nextKey = segments[i + 1]!;

        // Special handling: If we're navigating to a property of a color field (e.g., bgColor.useDefaultColor),
        // and the existing value is a string (color hex), preserve it in a value property
        const isColorFieldProperty =
          (nextKey === "useDefaultColor" || nextKey === "globalColorType") &&
          typeof existing === "string" &&
          existing.startsWith("#");

        // إذا كان existing string أو primitive value، استبدله بـ object أو array
        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          if (isColorFieldProperty) {
            // Preserve the color value when converting to object
            cursor[key] = { value: existing };
            if (path.includes("styling") && path.includes("bgColor")) {
              console.log(
                `🔧 Preserving color value: ${existing} in ${key}.value`,
              );
            }
          } else {
            cursor[key] = nextIsIndex ? [] : {};
          }
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

      // Special handling: If we're setting useDefaultColor or globalColorType on a color field,
      // and the parent object has a value property (from a previous string-to-object conversion),
      // preserve it
      if (
        (lastKey === "useDefaultColor" || lastKey === "globalColorType") &&
        cursor &&
        typeof cursor === "object" &&
        !Array.isArray(cursor) &&
        cursor.value &&
        typeof cursor.value === "string" &&
        cursor.value.startsWith("#")
      ) {
        // The value property already exists, just update useDefaultColor or globalColorType
        cursor[lastKey] = value;
        if (path.includes("styling") && path.includes("bgColor")) {
          console.log(
            `🔧 Preserving existing color value: ${cursor.value} while setting ${lastKey} to ${value}`,
          );
        }
      } else {
        cursor[lastKey] = value;
      }

      // Debug: Log the update for styling paths
      if (
        path.includes("styling") ||
        path.includes("searchButton") ||
        path.includes("bgColor")
      ) {
        console.group("🔧 updateByPath Debug");
        console.log("Path:", path);
        console.log("Value:", value);
        console.log("Segments:", segments);
        console.log("New Data:", newData);
        console.group("Styling in New Data");
        console.log("Styling:", newData?.styling);
        console.log("SearchButton:", newData?.styling?.searchButton);
        console.groupEnd();
        console.groupEnd();
      }

      // Only update tempData, don't update global data until Save Changes is pressed

      return { tempData: newData };
    }),
});
