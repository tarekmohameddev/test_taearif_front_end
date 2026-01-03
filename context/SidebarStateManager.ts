"use client";

import { create } from "zustand";
import { ComponentData, ComponentInstanceWithPosition } from "@/lib/types";
import { useEditorStore } from "./editorStore";

interface SidebarStateManager {
  // Current editing component
  selectedComponent: ComponentInstanceWithPosition | null;
  setSelectedComponent: (
    component: ComponentInstanceWithPosition | null,
  ) => void;

  // Direct editing on pageComponentsByPage
  updateComponentData: (componentId: string, path: string, value: any) => void;
  getComponentData: (componentId: string) => ComponentData | null;

  // Page management
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Global components
  updateGlobalHeader: (path: string, value: any) => void;
  updateGlobalFooter: (path: string, value: any) => void;
  getGlobalHeaderData: () => ComponentData;
  getGlobalFooterData: () => ComponentData;
}

export const useSidebarStateManager = create<SidebarStateManager>(
  (set, get) => ({
    selectedComponent: null,
    currentPage: "homepage",

    setSelectedComponent: (component) => set({ selectedComponent: component }),
    setCurrentPage: (page) => set({ currentPage: page }),

    updateComponentData: (componentId, path, value) => {
      // Get current pageComponentsByPage from editorStore
      const editorStore = useEditorStore.getState();
      const currentPage = get().currentPage;
      const pageComponents =
        editorStore.pageComponentsByPage[currentPage] || [];

      // Find and update the component
      const updatedComponents = pageComponents.map(
        (comp: ComponentInstanceWithPosition) => {
          if (comp.id === componentId) {
            const updatedData = updateDataByPath(comp.data, path, value);
            return { ...comp, data: updatedData };
          }
          return comp;
        },
      );

      // Update pageComponentsByPage
      editorStore.forceUpdatePageComponents(currentPage, updatedComponents);
    },

    getComponentData: (componentId) => {
      const editorStore = useEditorStore.getState();
      const currentPage = get().currentPage;
      const pageComponents =
        editorStore.pageComponentsByPage[currentPage] || [];
      const component = pageComponents.find(
        (comp: ComponentInstanceWithPosition) => comp.id === componentId,
      );
      return component?.data || null;
    },

    updateGlobalHeader: (path, value) => {
      const editorStore = useEditorStore.getState();
      const currentData = editorStore.globalHeaderData || {};
      const updatedData = updateDataByPath(currentData, path, value);
      editorStore.setGlobalHeaderData(updatedData);
    },

    updateGlobalFooter: (path, value) => {
      const editorStore = useEditorStore.getState();
      const currentData = editorStore.globalFooterData || {};
      const updatedData = updateDataByPath(currentData, path, value);
      editorStore.setGlobalFooterData(updatedData);
    },

    getGlobalHeaderData: () => {
      const editorStore = useEditorStore.getState();
      return editorStore.globalHeaderData || {};
    },

    getGlobalFooterData: () => {
      const editorStore = useEditorStore.getState();
      return editorStore.globalFooterData || {};
    },
  }),
);

// Helper function to update nested data by path
function updateDataByPath(data: any, path: string, value: any): any {
  const segments = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  const newData = { ...data };
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

  return newData;
}
