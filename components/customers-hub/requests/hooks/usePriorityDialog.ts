"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import type { Priority } from "@/types/unified-customer";
import { getPropertyRequestId } from "../request-detail-types";

export interface UsePriorityDialogParams {
  action: { objectType?: string; property_request_id?: number; priority?: Priority } | null | undefined;
  userData: { token?: string } | null;
  onRefetch?: () => Promise<void>;
}

export function usePriorityDialog({ action, userData, onRefetch }: UsePriorityDialogParams) {
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const [savingPriority, setSavingPriority] = useState(false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && !userData?.token) {
        toast.error("يجب تسجيل الدخول أولاً");
        return;
      }
      setShowPriorityDialog(open);
      if (open && action?.priority) {
        setSelectedPriority((action.priority as Priority) || "medium");
      }
    },
    [userData?.token, action?.priority]
  );

  const handleSavePriority = useCallback(async () => {
    const propertyRequestId = getPropertyRequestId(action);
    if (!userData?.token) return;
    if (!propertyRequestId) {
      toast.error("لم يتم العثور على معرف طلب العقار");
      return;
    }
    setSavingPriority(true);
    try {
      await axiosInstance.put(`/v1/property-requests/${propertyRequestId}/priority`, {
        priority: selectedPriority,
      });
      toast.success("تم تحديث أولوية طلب العميل بنجاح");
      setShowPriorityDialog(false);
      if (onRefetch) await onRefetch();
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error && (error as { response?: { data?: { message?: string } } }).response?.data?.message
          ? String((error as { response: { data: { message: string } } }).response.data.message)
          : "حدث خطأ أثناء تحديث أولوية طلب العقار";
      console.error("Error updating property request priority:", error);
      toast.error(message);
    } finally {
      setSavingPriority(false);
    }
  }, [action, selectedPriority, userData?.token, onRefetch]);

  const onClose = useCallback(() => setShowPriorityDialog(false), []);

  return {
    showPriorityDialog,
    setShowPriorityDialog,
    handleOpenChange,
    selectedPriority,
    setSelectedPriority,
    savingPriority,
    handleSavePriority,
    onClose,
  };
}
