"use client";

import { useState, useCallback, useEffect } from "react";
import type { CustomerAction } from "@/types/unified-customer";
import type { EmployeeOption } from "../types/incomingCardTypes";
import { assignRequests } from "@/lib/services/customers-hub-assignment-api";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

interface UseAssignEmployeeArgs {
  action: CustomerAction;
  hasToken: boolean;
  showAssignEmployeeDialog: boolean;
  setShowAssignEmployeeDialog: (v: boolean) => void;
  onActionUpdated?: (updates: { assignedTo: string; assignedToName: string }) => void;
}

export function useAssignEmployee({
  action,
  hasToken,
  showAssignEmployeeDialog,
  setShowAssignEmployeeDialog,
  onActionUpdated,
}: UseAssignEmployeeArgs) {
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [savingEmployee, setSavingEmployee] = useState(false);

  useEffect(() => {
    if (!showAssignEmployeeDialog || !hasToken || employees.length > 0) return;
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const response = await axiosInstance.get("/v1/employees");
        if (response.data?.data) setEmployees(response.data.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("حدث خطأ أثناء تحميل الموظفين");
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, [showAssignEmployeeDialog, hasToken, employees.length]);

  const handleAssignEmployee = useCallback(async () => {
    if (!hasToken) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }
    if (
      !action.id ||
      !action.objectType ||
      (action.objectType !== "property_request" && action.objectType !== "inquiry")
    ) {
      toast.error("لا يمكن تعيين الموظف: نوع الطلب غير مدعوم");
      return;
    }
    if (selectedEmployeeId == null) {
      toast.error("الرجاء اختيار موظف");
      return;
    }
    setSavingEmployee(true);
    try {
      const response = await assignRequests([action.id], String(selectedEmployeeId));
      if (response.status === "success") {
        toast.success("تم تعيين الموظف المسؤول بنجاح!");
        const emp = employees.find((e) => e.id === selectedEmployeeId);
        const name =
          emp?.first_name && emp?.last_name
            ? `${emp.first_name} ${emp.last_name}`
            : emp?.name ?? emp?.email ?? `موظف #${emp?.id}` ?? "";
        onActionUpdated?.({
          assignedTo: String(selectedEmployeeId),
          assignedToName: name,
        });
        setShowAssignEmployeeDialog(false);
        setSelectedEmployeeId(null);
      } else {
        throw new Error(response.message ?? "فشل تعيين الموظف");
      }
    } catch (error: unknown) {
      console.error("Error assigning employee:", error);
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response
          ?.data?.message ??
        (error as { message?: string })?.message ??
        "حدث خطأ أثناء تعيين الموظف المسؤول";
      toast.error(message);
    } finally {
      setSavingEmployee(false);
    }
  }, [
    hasToken,
    action.id,
    action.objectType,
    selectedEmployeeId,
    employees,
    onActionUpdated,
    setShowAssignEmployeeDialog,
  ]);

  return {
    employees,
    selectedEmployeeId,
    setSelectedEmployeeId,
    loadingEmployees,
    savingEmployee,
    handleAssignEmployee,
  };
}
