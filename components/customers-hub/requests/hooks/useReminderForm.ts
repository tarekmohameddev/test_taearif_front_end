"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import type { CustomerAction } from "@/types/unified-customer";
import { createReminderForRequest } from "@/lib/services/customers-hub-requests-api";
import { DEFAULT_TIME } from "../constants";

export interface UseReminderFormParams {
  action: CustomerAction | null | undefined;
  onRefetch?: () => Promise<void>;
}

type ReminderPriority = "low" | "medium" | "high" | "urgent";
type ReminderType = "follow_up" | "payment_due" | "document_required" | "other";

export function useReminderForm({ action, onRefetch }: UseReminderFormParams) {
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState(DEFAULT_TIME);
  const [reminderPriority, setReminderPriority] = useState<ReminderPriority>("medium");
  const [reminderType, setReminderType] = useState<ReminderType>("follow_up");
  const [reminderNotes, setReminderNotes] = useState("");

  const resetReminder = useCallback(() => {
    setShowReminderForm(false);
    setReminderTitle("");
    setReminderDescription("");
    setReminderDate("");
    setReminderTime(DEFAULT_TIME);
    setReminderPriority("medium");
    setReminderType("follow_up");
    setReminderNotes("");
  }, []);

  const handleAddReminder = useCallback(async () => {
    if (!reminderTitle.trim()) {
      toast.error("الرجاء إدخال عنوان التذكير");
      return;
    }
    if (!reminderDate || !reminderTime) {
      toast.error("الرجاء اختيار التاريخ والوقت");
      return;
    }
    const datetime = new Date(`${reminderDate}T${reminderTime}`).toISOString();
    const now = new Date();
    if (new Date(datetime) <= now) {
      toast.error("التاريخ والوقت يجب أن يكون في المستقبل");
      return;
    }

    const isRequest = action?.objectType === "property_request" || action?.objectType === "inquiry";
    if (!isRequest || !action?.id) {
      toast.error("لا يمكن إضافة التذكير: نوع الطلب غير مدعوم");
      return;
    }

    const toastId = toast.loading("جاري إضافة التذكير...");
    try {
      await createReminderForRequest(action.id, {
        title: reminderTitle.trim(),
        description: reminderDescription.trim() || undefined,
        datetime,
        priority: reminderPriority,
        type: reminderType,
        notes: reminderNotes.trim() || undefined,
      });
      toast.success("تم إضافة التذكير بنجاح", { id: toastId });
      if (onRefetch) await onRefetch();
      resetReminder();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err && err.response && typeof err.response === "object" && "data" in err.response && (err.response as { data?: { message?: string } }).data?.message
          ? (err.response as { data: { message: string } }).data.message
          : err instanceof Error
            ? err.message
            : "حدث خطأ أثناء إضافة التذكير";
      console.error("Error adding reminder:", err);
      toast.error(message, { id: toastId });
    }
  }, [action, reminderTitle, reminderDescription, reminderDate, reminderTime, reminderPriority, reminderType, reminderNotes, onRefetch, resetReminder]);

  return {
    showReminderForm,
    setShowReminderForm,
    reminderTitle,
    setReminderTitle,
    reminderDescription,
    setReminderDescription,
    reminderDate,
    setReminderDate,
    reminderTime,
    setReminderTime,
    reminderPriority,
    setReminderPriority,
    reminderType,
    setReminderType,
    reminderNotes,
    setReminderNotes,
    handleAddReminder,
    resetReminder,
  };
}
