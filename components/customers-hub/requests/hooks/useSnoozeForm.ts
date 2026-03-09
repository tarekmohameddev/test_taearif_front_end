"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { DEFAULT_TIME } from "../constants";

type SnoozeAction = (snoozeUntil: string, reason?: string) => void | Promise<void>;

export interface UseSnoozeFormParams {
  snoozeAction: SnoozeAction;
  onRefetch?: () => Promise<void>;
}

export function useSnoozeForm({ snoozeAction, onRefetch }: UseSnoozeFormParams) {
  const [showSnoozeForm, setShowSnoozeForm] = useState(false);
  const [snoozeDate, setSnoozeDate] = useState("");
  const [snoozeTime, setSnoozeTime] = useState(DEFAULT_TIME);

  const resetSnooze = useCallback(() => {
    setShowSnoozeForm(false);
    setSnoozeDate("");
    setSnoozeTime(DEFAULT_TIME);
  }, []);

  const handleSnooze = useCallback(async () => {
    if (!snoozeDate) {
      toast.error("الرجاء اختيار تاريخ التأجيل");
      return;
    }
    try {
      const datetime = new Date(`${snoozeDate}T${snoozeTime}`).toISOString();
      await snoozeAction(datetime);
      resetSnooze();
      if (onRefetch) await onRefetch();
    } catch {
      // Error toast is handled in caller
    }
  }, [snoozeDate, snoozeTime, snoozeAction, onRefetch, resetSnooze]);

  return {
    showSnoozeForm,
    setShowSnoozeForm,
    snoozeDate,
    setSnoozeDate,
    snoozeTime,
    setSnoozeTime,
    handleSnooze,
    resetSnooze,
  };
}
