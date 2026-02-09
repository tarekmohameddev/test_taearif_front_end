import type { EditorStore } from "../../types/types";
import type { StateCreator } from "zustand";

export const createSidebarActions = (
  set: StateCreator<EditorStore>["setState"],
): Pick<
  EditorStore,
  | "setIsComponentsSidebarOpen"
  | "setIsTabsContentOpen"
  | "setWasComponentsSidebarManuallyClosed"
> => ({
  setIsComponentsSidebarOpen: (isOpen) =>
    set(() => ({ isComponentsSidebarOpen: isOpen })),
  setIsTabsContentOpen: (isOpen) =>
    set(() => ({ isTabsContentOpen: isOpen })),
  setWasComponentsSidebarManuallyClosed: (wasClosed) =>
    set(() => ({ wasComponentsSidebarManuallyClosed: wasClosed })),
});
