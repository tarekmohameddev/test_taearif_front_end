"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { addNoteToAction } from "@/lib/services/customers-hub-requests-api";

export interface UseNoteFormParams {
  actionId: string;
  storeAddActionNote: (actionId: string, note: string) => void;
  userData: { user?: { id?: string | number }; id?: string | number } | null;
  onRefetch?: () => Promise<void>;
  /** Optional: mutate action.metadata.notes when present */
  onNoteAdded?: (note: string) => void;
}

export function useNoteForm({
  actionId,
  storeAddActionNote,
  userData,
  onRefetch,
  onNoteAdded,
}: UseNoteFormParams) {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState("");

  const resetNote = useCallback(() => {
    setNewNote("");
    setShowNoteForm(false);
  }, []);

  const handleAddNote = useCallback(async () => {
    const trimmed = newNote.trim();
    if (!trimmed || !actionId) return;

    const toastId = toast.loading("جاري إضافة الملاحظة...");
    try {
      const currentUserId = userData?.user?.id ?? userData?.id ?? null;
      const response = await addNoteToAction(
        actionId,
        trimmed,
        currentUserId != null ? parseInt(String(currentUserId), 10) : undefined
      );

      if (response.status === "success") {
        storeAddActionNote(actionId, trimmed);
        onNoteAdded?.(trimmed);
        toast.success("تم إضافة الملاحظة بنجاح", { id: toastId });
        resetNote();
        if (onRefetch) await onRefetch();
      } else {
        throw new Error(response.message ?? "فشل إضافة الملاحظة");
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data
          ? String((err.response.data as { message?: string }).message)
          : err instanceof Error
            ? err.message
            : "حدث خطأ أثناء إضافة الملاحظة";
      console.error("Error adding note:", err);
      toast.error(message, { id: toastId });
    }
  }, [actionId, newNote, storeAddActionNote, userData, onRefetch, onNoteAdded, resetNote]);

  return {
    showNoteForm,
    setShowNoteForm,
    newNote,
    setNewNote,
    handleAddNote,
    resetNote,
  };
}
