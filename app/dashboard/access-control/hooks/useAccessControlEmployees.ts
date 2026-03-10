/**
 * Employees list, fetch, delete dialog, and addon payment.
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/context/userStore";
import { accessControlApi } from "@/lib/services/access-control-api";
import type { Employee } from "../types";
import { getApiErrorMessage, DEFAULT_ERROR_MESSAGES } from "../utils";

export interface UseAccessControlEmployeesOptions {
  isAuthReady: boolean;
  hasToken: boolean;
}

export function useAccessControlEmployees({
  isAuthReady,
  hasToken,
}: UseAccessControlEmployeesOptions) {
  const router = useRouter();
  const employeesData = useUserStore((s) => s.userData?.employees);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [paymentPopupOpen, setPaymentPopupOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isPurchasingAddon, setIsPurchasingAddon] = useState(false);

  const fetchEmployees = useCallback(async () => {
    if (!isAuthReady || !hasToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await accessControlApi.employees.list();
      setEmployees(data.data);
    } catch (err) {
      setError(
        getApiErrorMessage(err, DEFAULT_ERROR_MESSAGES.employeesFetch)
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthReady, hasToken]);

  const openDeleteDialog = useCallback((employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteDialog(true);
    setDeleteError(null);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
    setEmployeeToDelete(null);
    setDeleteError(null);
  }, []);

  const deleteEmployee = useCallback(async () => {
    if (!employeeToDelete || !isAuthReady || !hasToken) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await accessControlApi.employees.delete(employeeToDelete.id);
      closeDeleteDialog();
      await fetchEmployees();
    } catch (err) {
      setDeleteError(
        getApiErrorMessage(err, DEFAULT_ERROR_MESSAGES.employeeDelete)
      );
    } finally {
      setDeleteLoading(false);
    }
  }, [employeeToDelete, isAuthReady, hasToken, closeDeleteDialog, fetchEmployees]);

  const handlePurchaseAddon = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent?.stopImmediatePropagation?.();
      if (!isAuthReady || !hasToken) return;
      setIsPurchasingAddon(true);
      setError(null);
      try {
        const response = await accessControlApi.addons.purchase(1, 1);
        const data = response.data as { status?: string; payment_url?: string };
        if (data?.status === "success" && data?.payment_url) {
          setPaymentUrl(data.payment_url);
          setPaymentPopupOpen(true);
        } else {
          setError("فشل في إنشاء طلب الشراء");
        }
      } catch (err) {
        setError(
          getApiErrorMessage(err, DEFAULT_ERROR_MESSAGES.purchaseAddon)
        );
      } finally {
        setIsPurchasingAddon(false);
      }
    },
    [isAuthReady, hasToken]
  );

  const handlePaymentSuccess = useCallback(async () => {
    setPaymentPopupOpen(false);
    setPaymentUrl("");
    const userStore = useUserStore.getState();
    await userStore.refreshUserData();
    await fetchEmployees();
  }, [fetchEmployees]);

  const handleNavigateToCreateEmployee = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!employeesData?.max_employees) {
        router.push("/dashboard/access-control/create-employee");
        return;
      }
      const usage =
        employeesData.usage ?? employeesData.total_count ?? 0;
      const max = employeesData.max_employees;
      if (usage / max < 1) {
        router.push("/dashboard/access-control/create-employee");
      }
    },
    [router, employeesData]
  );

  const isAtLimit =
    !!employeesData?.max_employees &&
    ((employeesData.usage ?? employeesData.total_count ?? 0) /
      employeesData.max_employees) >= 1;

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    deleteDialog: {
      open: showDeleteDialog,
      employee: employeeToDelete,
      loading: deleteLoading,
      error: deleteError,
      openDialog: openDeleteDialog,
      closeDialog: closeDeleteDialog,
      confirmDelete: deleteEmployee,
    },
    payment: {
      popupOpen: paymentPopupOpen,
      paymentUrl,
      isPurchasingAddon,
      handlePurchaseAddon,
      handlePaymentSuccess,
      closePopup: () => {
        setPaymentPopupOpen(false);
        setPaymentUrl("");
      },
    },
    handleNavigateToCreateEmployee,
    isAtLimit,
    employeesData,
  };
}
