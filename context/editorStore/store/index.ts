"use client";

import { create } from "zustand";
import { ComponentData } from "@/lib/types";
import { COMPONENTS } from "@/lib/ComponentsList";
import type { EditorStore } from "../types/types";
import { getInitialState } from "./initialState";
import { createDialogActions } from "./actions/dialogActions";
import { createSidebarActions } from "./actions/sidebarActions";
import { createPageStateActions } from "./actions/pageStateActions";
import { createTempDataActions } from "./actions/tempDataActions";
import { createGlobalComponentsActions } from "./actions/globalComponentsActions";
import { createWebsiteLayoutActions } from "./actions/websiteLayoutActions";
import { createStaticPageActions } from "./actions/staticPageActions";
import { createThemeActions } from "./actions/themeActions";
import { createPageActions } from "./actions/pageActions";
import { createComponentActions } from "./actions/componentActions";
import { createDatabaseActions } from "./actions/databaseActions";

export const useEditorStore = create<EditorStore>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,

    // Dynamic component getters - generated from ComponentsList
    componentGetters: Object.keys(COMPONENTS).reduce(
      (acc, componentType) => {
        acc[componentType] = (variantId: string) => {
          const state = get();
          return state.getComponentData(componentType, variantId);
        };
        return acc;
      },
      {} as Record<string, (variantId: string) => ComponentData>,
    ),

    // Dialog actions
    ...createDialogActions(set),

    // Page state actions
    ...createPageStateActions(set),

    // Sidebar actions
    ...createSidebarActions(set),

    // Temp data actions
    ...createTempDataActions(set, get),

    // Global components actions
    ...createGlobalComponentsActions(set),

    // Website layout actions
    ...createWebsiteLayoutActions(set),

    // Static page actions
    ...createStaticPageActions(set, get),

    // Theme actions
    ...createThemeActions(set),

    // Page actions
    ...createPageActions(set, get),

    // Component actions (getComponentData, setComponentData, ensureComponentVariant, updateComponentByPath)
    ...createComponentActions(set, get),

    // Database actions (loadFromDatabase)
    ...createDatabaseActions(set, get),
  } as EditorStore;
});
