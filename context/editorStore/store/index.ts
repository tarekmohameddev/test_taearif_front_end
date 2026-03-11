"use client";

import { create } from "zustand";
import { ComponentData } from "@/lib/types";
import { COMPONENT_IDS_BY_SECTION } from "@/lib/ComponentsListGroups";
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
import { isDebugEnabled } from "@/lib/debug/live-editor/core/config";
import { storeTracker } from "@/lib/debug/live-editor/trackers/storeTracker";

const ALL_COMPONENT_IDS = Object.values(COMPONENT_IDS_BY_SECTION).flat();

export const useEditorStore = create<EditorStore>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,

    // Dynamic component getters - generated from component group ids (avoids pulling full ComponentsList)
    componentGetters: ALL_COMPONENT_IDS.reduce(
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
