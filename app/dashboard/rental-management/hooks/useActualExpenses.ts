import { useCallback, useEffect, useState } from "react";

import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

interface ExpenseFormData {
  expense_name: string;
  amount_type: "fixed" | "percentage";
  amount_value: string;
  cost_center: "tenant" | "owner";
  is_active: boolean;
  image: File | null;
  image_path: string;
}

export interface RentalExpense {
  id: number;
  expense_name: string;
  amount_type: "fixed" | "percentage";
  calculated_amount: number;
  cost_center: "tenant" | "owner";
  image_url?: string | null;
  created_at: string;
  is_active: boolean;
  can_be_modified?: boolean;
  [key: string]: unknown;
}

interface UseActualExpensesOptions {
  rentalId?: string | null;
  enabled?: boolean;
}

interface UseActualExpensesResult {
  expenses: RentalExpense[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  // add dialog
  isAddDialogOpen: boolean;
  openAddDialog: () => void;
  closeAddDialog: () => void;
  formData: ExpenseFormData;
  setFormData: (updater: (prev: ExpenseFormData) => ExpenseFormData) => void;
  formSubmitting: boolean;
  createExpense: () => Promise<void>;
  // delete dialog
  isDeleteDialogOpen: boolean;
  openDeleteDialog: (expense: RentalExpense) => void;
  closeDeleteDialog: () => void;
  deleting: boolean;
  expenseToDelete: RentalExpense | null;
  deleteExpense: () => Promise<void>;
}

export function useActualExpenses(
  options: UseActualExpensesOptions,
): UseActualExpensesResult {
  const { rentalId, enabled = false } = options;

  const [expenses, setExpenses] = useState<RentalExpense[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormDataState] = useState<ExpenseFormData>({
    expense_name: "",
    amount_type: "fixed",
    amount_value: "",
    cost_center: "tenant",
    is_active: true,
    image: null,
    image_path: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<RentalExpense | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const setFormData = (updater: (prev: ExpenseFormData) => ExpenseFormData) => {
    setFormDataState((prev) => updater(prev));
  };

  const fetchActualExpenses = useCallback(async () => {
    if (!rentalId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/v1/rms/rentals/${rentalId}/expenses`,
      );

      if (response.data.status) {
        setExpenses(response.data.data);
      } else {
        setError("فشل في تحميل بيانات المصروفات");
      }
    } catch (err: any) {
      console.error("Error fetching actual expenses data:", err);
      setError(
        err.response?.data?.message ||
          "حدث خطأ أثناء تحميل بيانات المصروفات",
      );
    } finally {
      setLoading(false);
    }
  }, [rentalId]);

  useEffect(() => {
    if (enabled && rentalId) {
      fetchActualExpenses();
    }
  }, [enabled, rentalId, fetchActualExpenses]);

  const uploadExpenseImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosInstance.post(
        "/v1/rms/expenses/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status) {
        return response.data.data.image_path;
      } else {
        throw new Error(response.data.message || "فشل في رفع الصورة");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      throw new Error(error.response?.data?.message || "فشل في رفع الصورة");
    }
  };

  const createExpense = async () => {
    if (!rentalId) return;

    try {
      setFormSubmitting(true);

      let imagePath = "";
      if (formData.image) {
        imagePath = await uploadExpenseImage(formData.image);
      }

      const payload = {
        expense_name: formData.expense_name,
        amount_type: formData.amount_type,
        amount_value: parseFloat(formData.amount_value),
        cost_center: formData.cost_center,
        is_active: formData.is_active,
        ...(imagePath && { image_path: imagePath }),
      };

      const response = await axiosInstance.post(
        `/v1/rms/rentals/${rentalId}/expenses`,
        payload,
      );

      if (response.data.status) {
        setIsAddDialogOpen(false);
        setFormDataState({
          expense_name: "",
          amount_type: "fixed",
          amount_value: "",
          cost_center: "tenant",
          is_active: true,
          image: null,
          image_path: "",
        });
        await fetchActualExpenses();
        toast.success("تم إضافة المصروف بنجاح");
      } else {
        toast.error(
          "فشل في إضافة المصروف: " + (response.data.message || "خطأ غير معروف"),
        );
      }
    } catch (error: any) {
      console.error("Error creating expense:", error);
      toast.error(
        "خطأ في إضافة المصروف: " +
          (error.response?.data?.message || error.message || "خطأ غير معروف"),
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const deleteExpense = async () => {
    if (!rentalId || !expenseToDelete?.id) return;

    try {
      setDeleting(true);

      const response = await axiosInstance.delete(
        `/v1/rms/rentals/${rentalId}/expenses/${expenseToDelete.id}`,
      );

      if (response.data.status) {
        setIsDeleteDialogOpen(false);
        setExpenseToDelete(null);
        await fetchActualExpenses();
        toast.success("تم حذف المصروف بنجاح");
      } else {
        toast.error(
          "فشل في حذف المصروف: " + (response.data.message || "خطأ غير معروف"),
        );
      }
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      toast.error(
        "خطأ في حذف المصروف: " +
          (error.response?.data?.message || error.message || "خطأ غير معروف"),
      );
    } finally {
      setDeleting(false);
    }
  };

  const openAddDialog = () => setIsAddDialogOpen(true);
  const closeAddDialog = () => setIsAddDialogOpen(false);

  const openDeleteDialog = (expense: RentalExpense) => {
    setExpenseToDelete(expense);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  return {
    expenses,
    loading,
    error,
    refetch: fetchActualExpenses,
    isAddDialogOpen,
    openAddDialog,
    closeAddDialog,
    formData,
    setFormData,
    formSubmitting,
    createExpense,
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    deleting,
    expenseToDelete,
    deleteExpense,
  };
}

