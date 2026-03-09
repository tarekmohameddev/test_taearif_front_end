"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import type { CustomerAction } from "@/types/unified-customer";
import { getEmployees as getAssignmentEmployees, assignRequests } from "@/lib/services/customers-hub-assignment-api";
import type { EmployeeWorkload } from "@/lib/services/customers-hub-assignment-api";

export interface UseAssignEmployeeDialogParams {
  action: CustomerAction | null | undefined;
  userData: { token?: string } | null;
  onRefetch?: () => Promise<void>;
}

export function useAssignEmployeeDialog({
  action,
  userData,
  onRefetch,
}: UseAssignEmployeeDialogParams) {
  const [showAssignEmployeeDialog, setShowAssignEmployeeDialog] = useState(false);
  const [employees, setEmployees] = useState<EmployeeWorkload[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);

  useEffect(() => {
    if (!showAssignEmployeeDialog || !userData?.token || employees.length > 0) return;
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const response = await getAssignmentEmployees();
        if (response.status === "success" && response.data.employees) {
          setEmployees(response.data.employees);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("حدث خطأ أثناء تحميل الموظفين");
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, [showAssignEmployeeDialog, userData?.token, employees.length]);

  useEffect(() => {
    if (!showAssignEmployeeDialog) return;
    if (action?.assignedTo != null) {
      setSelectedEmployeeId(typeof action.assignedTo === "string" ? action.assignedTo : String(action.assignedTo));
    } else {
      setSelectedEmployeeId(null);
    }
  }, [showAssignEmployeeDialog, action?.assignedTo]);

  const handleAssignEmployee = useCallback(async () => {
    if (!userData?.token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }
    const isRequest = action?.objectType === "property_request" || action?.objectType === "inquiry";
    if (!action?.id || !isRequest) {
      toast.error("لا يمكن تعيين الموظف: نوع الطلب غير مدعوم");
      return;
    }
    if (!selectedEmployeeId) {
      toast.error("الرجاء اختيار موظف");
      return;
    }

    setSavingEmployee(true);
    try {
      const response = await assignRequests([action.id], selectedEmployeeId);
      if (response.status === "success") {
        toast.success("تم تعيين الموظف المسؤول بنجاح!");
        if (onRefetch) await onRefetch();
        setShowAssignEmployeeDialog(false);
        setSelectedEmployeeId(null);
      } else {
        throw new Error(response.message ?? "فشل تعيين الموظف");
      }
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error && (error as { response?: { data?: { message?: string } } }).response?.data?.message
          ? (error as { response: { data: { message: string } } }).response.data.message
          : error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تعيين الموظف المسؤول";
      console.error("Error assigning employee:", error);
      toast.error(message);
    } finally {
      setSavingEmployee(false);
    }
  }, [action, userData?.token, selectedEmployeeId, onRefetch]);

  const onClose = useCallback(() => {
    setShowAssignEmployeeDialog(false);
    setSelectedEmployeeId(null);
  }, []);

  return {
    showAssignEmployeeDialog,
    setShowAssignEmployeeDialog,
    employees,
    selectedEmployeeId,
    setSelectedEmployeeId,
    loadingEmployees,
    savingEmployee,
    handleAssignEmployee,
    onClose,
  };
}
