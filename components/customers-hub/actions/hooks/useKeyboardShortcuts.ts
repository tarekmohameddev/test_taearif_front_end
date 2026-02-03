import { useEffect, useCallback } from "react";

export function useKeyboardShortcuts(
  handleSelectAll: () => void,
  handleDeselectAll: () => void,
  handleBulkComplete: () => void,
  handleBulkDismiss: () => void,
  handleUndo: () => void,
  selectedActionIds: Set<string>,
  undoStack: unknown[],
  setShowKeyboardShortcuts: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + A: Select all
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        handleSelectAll();
      }

      // Escape: Deselect all
      if (e.key === "Escape") {
        handleDeselectAll();
      }

      // Ctrl/Cmd + Enter: Complete selected
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && selectedActionIds.size > 0) {
        e.preventDefault();
        handleBulkComplete();
      }

      // Delete/Backspace: Dismiss selected
      if ((e.key === "Delete" || e.key === "Backspace") && selectedActionIds.size > 0) {
        e.preventDefault();
        handleBulkDismiss();
      }

      // ? : Show keyboard shortcuts
      if (e.key === "?") {
        setShowKeyboardShortcuts((prev) => !prev);
      }

      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && undoStack.length > 0) {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSelectAll, handleDeselectAll, handleBulkComplete, handleBulkDismiss, selectedActionIds.size, undoStack.length, handleUndo, setShowKeyboardShortcuts]);
}
