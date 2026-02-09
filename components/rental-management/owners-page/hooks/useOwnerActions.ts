"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import useStore from "@/context/Store";
import { PAGE_SIZE } from "../constants/owners.constants";
import {
  validateCreateForm,
  validateEditForm,
  validatePassword,
} from "../utils/validators";
import {
  EditFormData,
  CreateFormData,
} from "../types/owners.types";

export function useOwnerActions() {
  const {
    rentalOwnerDashboard,
    setRentalOwnerDashboard,
    fetchOwnerRentals,
    fetchOwnerDetails,
    fetchAvailableProperties,
    assignPropertiesToOwner,
    updateOwnerRental,
    changeOwnerPassword,
    fetchAssignedProperties,
    removePropertyFromOwner,
    deleteOwnerRental,
    createOwnerRental,
  } = useStore();

  const {
    pagination,
    selectedOwnerDetails,
    assignedProperties,
    assignedPropertiesPagination,
  } = rentalOwnerDashboard;

  const [assigningProperties, setAssigningProperties] = useState(false);
  const [updatingOwner, setUpdatingOwner] = useState(false);
  const [removingProperty, setRemovingProperty] = useState(false);
  const [deletingOwner, setDeletingOwner] = useState(false);
  const [creatingOwner, setCreatingOwner] = useState(false);

  // Assign Properties Action
  const handleAssignProperties = async (
    ownerId: number,
    propertyIds: number[],
    onSuccess: () => void,
    setError: (error: string | null) => void,
  ) => {
    if (propertyIds.length === 0) {
      setError("الرجاء اختيار عقار واحد على الأقل");
      return;
    }

    setAssigningProperties(true);
    setError(null);

    const result = await assignPropertiesToOwner(ownerId, propertyIds);
    setAssigningProperties(false);

    if (result.success) {
      toast.success("تم ربط العقارات بالمالك بنجاح");
      onSuccess();
      // Refresh owner details if details dialog is open
      if (
        selectedOwnerDetails &&
        selectedOwnerDetails.id === ownerId
      ) {
        fetchOwnerDetails(ownerId);
      }
      // Refresh owners list
      fetchOwnerRentals(pagination?.current_page || 1, PAGE_SIZE);
    } else {
      setError(result.error || "حدث خطأ أثناء ربط العقارات");
    }
  };

  // Update Owner Action
  const handleUpdateOwner = async (
    ownerId: number,
    formData: EditFormData,
    setError: (error: string | null) => void,
    onSuccess: () => void,
  ) => {
    const validationError = validateEditForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUpdatingOwner(true);
    setError(null);

    const result = await updateOwnerRental(ownerId, formData);
    setUpdatingOwner(false);

    if (result.success) {
      toast.success("تم تحديث بيانات المالك بنجاح");
      onSuccess();
      fetchOwnerRentals(pagination?.current_page || 1, PAGE_SIZE);
    } else {
      setError(result.error || "حدث خطأ أثناء تحديث البيانات");
    }
  };

  // Change Password Action
  const handleChangePassword = async (
    ownerId: number,
    password: string,
    confirmPassword: string,
    setError: (error: string | null) => void,
    onSuccess: () => void,
  ) => {
    const validationError = validatePassword({
      password,
      confirmPassword,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setUpdatingOwner(true);
    setError(null);

    const result = await changeOwnerPassword(ownerId, password);
    setUpdatingOwner(false);

    if (result.success) {
      toast.success("تم تغيير كلمة المرور بنجاح");
      onSuccess();
    } else {
      setError(result.error || "حدث خطأ أثناء تغيير كلمة المرور");
    }
  };

  // Remove Property Action
  const handleRemoveProperty = async (
    ownerId: number,
    propertyId: number,
    onSuccess: () => void,
  ) => {
    setRemovingProperty(true);

    const result = await removePropertyFromOwner(ownerId, propertyId);
    setRemovingProperty(false);

    if (result.success) {
      toast.success("تم إلغاء ربط العقار بنجاح");
      onSuccess();
      // Refresh if no properties left on current page
      if (
        assignedProperties.length === 1 &&
        assignedPropertiesPagination &&
        assignedPropertiesPagination.current_page > 1
      ) {
        fetchAssignedProperties(
          ownerId,
          assignedPropertiesPagination.current_page - 1,
          PAGE_SIZE,
        );
      } else {
        // Refresh current page
        fetchAssignedProperties(
          ownerId,
          assignedPropertiesPagination?.current_page || 1,
          PAGE_SIZE,
        );
      }
    } else {
      toast.error(result.error || "حدث خطأ أثناء إلغاء ربط العقار");
    }
  };

  // Delete Owner Action
  const handleDeleteOwner = async (
    ownerId: number,
    onSuccess: () => void,
  ) => {
    setDeletingOwner(true);

    const result = await deleteOwnerRental(ownerId);
    setDeletingOwner(false);

    if (result.success) {
      toast.success("تم حذف المالك بنجاح");
      onSuccess();
      fetchOwnerRentals(pagination?.current_page || 1, PAGE_SIZE);
    } else {
      toast.error(result.error || "حدث خطأ أثناء حذف المالك");
    }
  };

  // Create Owner Action
  const handleCreateOwner = async (
    formData: CreateFormData,
    setError: (error: string | null) => void,
    onSuccess: () => void,
  ) => {
    const validationError = validateCreateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setCreatingOwner(true);
    setError(null);

    // Remove confirmPassword from data
    const { confirmPassword, ...ownerData } = formData;

    const result = await createOwnerRental(ownerData);
    setCreatingOwner(false);

    if (result.success) {
      toast.success("تم إنشاء المالك بنجاح");
      onSuccess();
      fetchOwnerRentals(1, PAGE_SIZE);
    } else {
      setError(result.error || "حدث خطأ أثناء إنشاء المالك");
    }
  };

  return {
    assigningProperties,
    updatingOwner,
    removingProperty,
    deletingOwner,
    creatingOwner,
    handleAssignProperties,
    handleUpdateOwner,
    handleChangePassword,
    handleRemoveProperty,
    handleDeleteOwner,
    handleCreateOwner,
  };
}
