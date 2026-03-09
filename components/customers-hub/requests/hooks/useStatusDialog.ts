"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { getPropertyRequestId } from "../request-detail-types";

export interface StatusOption {
  id: number;
  name_ar: string;
  name_en: string;
}

export interface UseStatusDialogParams {
  requestId: string;
  action: { objectType?: string; property_request_id?: number } | null | undefined;
  userData: { token?: string } | null;
  onRefetch?: () => Promise<void>;
}

export function useStatusDialog({ requestId, action, userData, onRefetch }: UseStatusDialogParams) {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (!userData?.token || !requestId) return;
    setLoadingStatuses(true);
    axiosInstance
      .get<{ data?: { status?: StatusOption[] }; status?: StatusOption[] }>("/v1/property-requests/filters")
      .then((response) => {
        const raw = response?.data;
        const statuses = Array.isArray(raw?.data?.status)
          ? raw.data.status
          : Array.isArray(raw?.status)
            ? raw.status
            : [];
        setStatusOptions(statuses);
      })
      .catch((error) => {
        console.error("Error fetching property request statuses:", error);
        toast.error("حدث خطأ أثناء تحميل حالات طلب العقار");
      })
      .finally(() => setLoadingStatuses(false));
  }, [userData?.token, requestId]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && !userData?.token) {
        toast.error("يجب تسجيل الدخول أولاً");
        return;
      }
      setShowStatusDialog(open);
      if (open && statusOptions.length > 0 && selectedStatusId === null) {
        setSelectedStatusId(statusOptions[0].id);
      }
      if (!open) setSelectedStatusId(null);
    },
    [userData?.token, statusOptions.length, selectedStatusId]
  );

  const handleSaveStatus = useCallback(async () => {
    const propertyRequestId = getPropertyRequestId(action);
    if (!selectedStatusId || !userData?.token) return;
    if (!propertyRequestId) {
      toast.error("لم يتم العثور على معرف طلب العقار");
      return;
    }
    setSavingStatus(true);
    try {
      await axiosInstance.put(`/v1/property-requests/${propertyRequestId}/status`, {
        status_id: selectedStatusId,
      });
      toast.success("تم تحديث حالة طلب العقار بنجاح");
      setShowStatusDialog(false);
      setSelectedStatusId(null);
      if (onRefetch) await onRefetch();
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error && (error as { response?: { data?: { message?: string } } }).response?.data?.message
          ? String((error as { response: { data: { message: string } } }).response.data.message)
          : "حدث خطأ أثناء تحديث حالة طلب العقار";
      console.error("Error updating property request status:", error);
      toast.error(message);
    } finally {
      setSavingStatus(false);
    }
  }, [action, selectedStatusId, userData?.token, onRefetch]);

  const onClose = useCallback(() => {
    setShowStatusDialog(false);
    setSelectedStatusId(null);
  }, []);

  return {
    showStatusDialog,
    setShowStatusDialog,
    handleOpenChange,
    statusOptions,
    selectedStatusId,
    setSelectedStatusId,
    loadingStatuses,
    savingStatus,
    handleSaveStatus,
    onClose,
  };
}
