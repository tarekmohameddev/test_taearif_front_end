import type { EditorStore } from "../../types/types";
import type { StateCreator } from "zustand";
import type { ComponentInstanceWithPosition } from "../../types/types";
import {
  logBefore,
  logAfter,
  logBeforeAfter,
} from "@/lib/fileLogger";

export const createPageActions = (
  set: StateCreator<EditorStore>["setState"],
  get: StateCreator<EditorStore>["getState"],
): Pick<
  EditorStore,
  | "setPageComponentsForPage"
  | "getAllPages"
  | "deletePage"
  | "forceUpdatePageComponents"
> => ({
  setPageComponentsForPage: (page, components) =>
    set((state) => {
      const withPositions: ComponentInstanceWithPosition[] = components.map(
        (c, index) => ({ ...c, position: index }),
      );
      return {
        pageComponentsByPage: {
          ...state.pageComponentsByPage,
          [page]: withPositions,
        },
      } as any;
    }),
  getAllPages: () => {
    const state = get();
    return Object.keys(state.pageComponentsByPage);
  },
  deletePage: (slug) =>
    set((state) => {
      const newPageComponentsByPage = { ...state.pageComponentsByPage };
      delete newPageComponentsByPage[slug];
      return { pageComponentsByPage: newPageComponentsByPage } as any;
    }),
  forceUpdatePageComponents: (slug, components) => {
    // ========== LOG BEFORE ==========
    const stateBefore = get();
    const beforeComponents = stateBefore.pageComponentsByPage[slug] || [];

    logBefore(
      "EDITOR_STORE",
      "FORCE_UPDATE_PAGE_COMPONENTS",
      {
        slug,
        beforeCount: beforeComponents.length,
        afterCount: components.length,
        beforeComponents: beforeComponents.map((c: any) => ({
          id: c.id,
          type: c.type,
          componentName: c.componentName,
        })),
        afterComponents: components.map((c: any) => ({
          id: c.id,
          type: c.type,
          componentName: c.componentName,
        })),
      }
    );

    set((state) => {
      const newState = {
        pageComponentsByPage: {
          ...state.pageComponentsByPage,
          [slug]: components,
        },
      };

      // ========== LOG AFTER ==========
      setTimeout(() => {
        const stateAfter = get();
        const afterComponents = stateAfter.pageComponentsByPage[slug] || [];

        logAfter(
          "EDITOR_STORE",
          "FORCE_UPDATE_PAGE_COMPONENTS_COMPLETE",
          {
            slug,
            beforeCount: beforeComponents.length,
            afterCount: afterComponents.length,
            updatedComponents: afterComponents.map((c: any) => ({
              id: c.id,
              type: c.type,
              componentName: c.componentName,
            })),
          }
        );

        // Log before/after comparison
        logBeforeAfter(
          "FORCE_UPDATE_PAGE_COMPONENTS",
          {
            before: beforeComponents.map((c: any) => ({
              id: c.id,
              type: c.type,
              componentName: c.componentName,
            })),
          },
          {
            after: afterComponents.map((c: any) => ({
              id: c.id,
              type: c.type,
              componentName: c.componentName,
            })),
          }
        );
      }, 0);

      return newState;
    });
  },
});
