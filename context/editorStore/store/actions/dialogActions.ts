import type { EditorStore } from "../../types/types";
import type { StateCreator } from "zustand";

export const createDialogActions = (
  set: StateCreator<EditorStore>["setState"],
): Pick<
  EditorStore,
  "setOpenSaveDialog" | "requestSave" | "closeDialog"
> => ({
  setOpenSaveDialog: (fn) => set(() => ({ openSaveDialogFn: fn })),
  requestSave: () => set(() => ({ showDialog: true })),
  closeDialog: () => set(() => ({ showDialog: false })),
});
