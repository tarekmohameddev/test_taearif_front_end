import type { EditorStore } from "../../types/types";
import type { StateCreator } from "zustand";

export const createWebsiteLayoutActions = (
  set: StateCreator<EditorStore>["setState"],
): Pick<
  EditorStore,
  | "setWebsiteLayout"
  | "updateCustomBranding"
  | "addPageToWebsiteLayout"
  | "setCurrentTheme"
> => ({
  setWebsiteLayout: (data) => set(() => ({ WebsiteLayout: data })),
  updateCustomBranding: (type, data) =>
    set((state) => {
      console.log("🔧 [updateCustomBranding] Called:", { type, data });
      console.log(
        "🔧 [updateCustomBranding] Current CustomBranding:",
        state.WebsiteLayout?.CustomBranding,
      );

      const currentTypeData = state.WebsiteLayout?.CustomBranding?.[type] || {
        logo: "",
        name: "",
      };

      const updatedTypeData = {
        ...currentTypeData,
        ...data,
      };

      const updatedBranding = {
        ...(state.WebsiteLayout?.CustomBranding || {}),
        [type]: updatedTypeData,
      };

      console.log("🔧 [updateCustomBranding] Step by step:", {
        type,
        dataReceived: data,
        currentTypeData,
        updatedTypeData,
        updatedBranding,
        updatedBrandingHeader: updatedBranding.header,
        updatedBrandingFooter: updatedBranding.footer,
      });

      const newWebsiteLayout = {
        ...state.WebsiteLayout,
        CustomBranding: updatedBranding as any,
      };

      console.log(
        "🔧 [updateCustomBranding] New WebsiteLayout.CustomBranding:",
        newWebsiteLayout.CustomBranding,
      );
      console.log(
        "🔧 [updateCustomBranding] New WebsiteLayout.CustomBranding.header:",
        newWebsiteLayout.CustomBranding?.header,
      );

      return {
        WebsiteLayout: newWebsiteLayout,
        hasChangesMade: true,
      };
    }),
  addPageToWebsiteLayout: (pageData) =>
    set((state) => ({
      WebsiteLayout: {
        ...state.WebsiteLayout,
        metaTags: {
          ...state.WebsiteLayout.metaTags,
          pages: [...state.WebsiteLayout.metaTags.pages, pageData],
        },
      },
    })),
  setCurrentTheme: (themeNumber) =>
    set((state) => ({
      WebsiteLayout: {
        ...state.WebsiteLayout,
        currentTheme: themeNumber,
      },
      themeChangeTimestamp: Date.now(), // Force sync after theme change
    })),
});
