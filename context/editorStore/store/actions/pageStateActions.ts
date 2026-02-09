import type { EditorStore } from "../../types/types";
import type { StateCreator } from "zustand";

export const createPageStateActions = (
  set: StateCreator<EditorStore>["setState"],
): Pick<EditorStore, "setHasChangesMade" | "setCurrentPage"> => ({
  setHasChangesMade: (hasChanges) => {
    set((state) => {
      // Only update if the value is actually different to prevent infinite loops
      if (state.hasChangesMade !== hasChanges) {
        return { hasChangesMade: hasChanges };
      }
      return state; // Return current state if no change needed
    });
  },
  setCurrentPage: (page) => set(() => ({ currentPage: page })),
});
