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
  | "createPage"
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
  createPage: (pageData) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pageActions.ts:createPage',message:'createPage called',data:{slug:pageData.slug,name:pageData.name,componentsCount:pageData.components?.length || 0},timestamp:Date.now(),runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    set((state) => {
      // Initialize the page with provided components or empty array
      const components = pageData.components || [];
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9e338d0b-1634-4cc6-9293-9597538269d8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'pageActions.ts:createPage',message:'createPage setting state',data:{slug:pageData.slug,componentsCount:components.length,existingPages:Object.keys(state.pageComponentsByPage)},timestamp:Date.now(),runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return {
        pageComponentsByPage: {
          ...state.pageComponentsByPage,
          [pageData.slug]: components,
        },
      } as any;
    });
  },
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
