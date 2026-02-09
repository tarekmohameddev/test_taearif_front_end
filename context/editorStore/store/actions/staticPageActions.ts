import type { EditorStore } from "../../types/types";
import type { StateCreator } from "zustand";

export const createStaticPageActions = (
  set: StateCreator<EditorStore>["setState"],
  get: StateCreator<EditorStore>["getState"],
): Pick<EditorStore, "setStaticPageData" | "getStaticPageData"> => ({
  setStaticPageData: (slug, data) =>
    set((state) => {
      // ⭐ NEW: If theme change is in progress, ensure immediate update
      // If themeChangeTimestamp is recent (within last 5 seconds),
      // this is likely a theme change - ensure update
      const isThemeChangeInProgress =
        state.themeChangeTimestamp > Date.now() - 5000;

      if (isThemeChangeInProgress) {
        console.log(
          `[setStaticPageData] Theme change in progress, ensuring immediate update for: ${slug}`,
        );
      }

      return {
        staticPagesData: {
          ...state.staticPagesData,
          [slug]: data,
        },
      };
    }),
  getStaticPageData: (slug) => {
    const state = get();
    return state.staticPagesData[slug] || null;
  },
});
