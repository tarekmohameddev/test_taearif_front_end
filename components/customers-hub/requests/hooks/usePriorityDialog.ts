"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import type { Priority } from "@/types/unified-customer";
import { getPropertyRequestId } from "../request-detail-types";

export interface PriorityOption {
  id: number;
  name: string;
  value?: number;
  icon?: string;
  color?: string;
}

export interface UsePriorityDialogParams {
  requestId: string;
  action: { objectType?: string; property_request_id?: number; priority?: Priority } | null | undefined;
  userData: { token?: string } | null;
  onRefetch?: () => Promise<void>;
}

export function usePriorityDialog({ requestId, action, userData, onRefetch }: UsePriorityDialogParams) {
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [priorityOptions, setPriorityOptions] = useState<PriorityOption[]>([]);
  const [loadingPriorities, setLoadingPriorities] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const [savingPriority, setSavingPriority] = useState(false);

  useEffect(() => {
    if (!userData?.token || !requestId) return;
    setLoadingPriorities(true);
    axiosInstance
      .get<{ data?: { priorities?: PriorityOption[] }; priorities?: PriorityOption[] }>("/v1/property-requests/filters")
      .then((response) => {
        const raw = response?.data;
        const list = Array.isArray(raw?.data?.priorities)
          ? raw.data.priorities
          : Array.isArray(raw?.priorities)
            ? raw.priorities
            : [];
        setPriorityOptions(list);
      })
      .catch((error) => {
        console.error("Error fetching property request priorities:", error);
        toast.error("حدث خطأ أثناء تحميل أولويات طلب العقار");
      })
      .finally(() => setLoadingPriorities(false));
  }, [userData?.token, requestId]);

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
    priorityOptions,
    loadingPriorities,
    selectedPriority,
    setSelectedPriority,
    savingPriority,
    handleSavePriority,
    onClose,
  };
}
