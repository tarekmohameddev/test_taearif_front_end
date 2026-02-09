"use client";

import { useState } from "react";
import useStore from "@/context/Store";
import {
  Owner,
  EditFormData,
  PasswordData,
  CreateFormData,
} from "../types/owners.types";

export function useOwnerDialogs() {
  const { setRentalOwnerDashboard, fetchAvailableProperties } = useStore();

  // Details Dialog
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Assign Properties Dialog
  const [isAssignPropertiesDialogOpen, setIsAssignPropertiesDialogOpen] =
    useState(false);
  const [selectedOwnerForAssign, setSelectedOwnerForAssign] =
    useState<Owner | null>(null);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);
  const [assignError, setAssignError] = useState<string | null>(null);

  // Edit Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOwnerForEdit, setSelectedOwnerForEdit] =
    useState<Owner | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: "",
    email: "",
    phone: "",
    city: "",
    is_active: true,
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    password: "",
    confirmPassword: "",
  });
  const [editError, setEditError] = useState<string | null>(null);

  // View Properties Dialog
  const [isViewPropertiesDialogOpen, setIsViewPropertiesDialogOpen] =
    useState(false);
  const [selectedOwnerForView, setSelectedOwnerForView] =
    useState<Owner | null>(null);

  // Remove Property Dialog
  const [isRemovePropertyDialogOpen, setIsRemovePropertyDialogOpen] =
    useState(false);
  const [selectedPropertyForRemove, setSelectedPropertyForRemove] = useState<
    number | null
  >(null);

  // Delete Dialog
  const [isDeleteOwnerDialogOpen, setIsDeleteOwnerDialogOpen] = useState(false);
  const [selectedOwnerForDelete, setSelectedOwnerForDelete] =
    useState<Owner | null>(null);

  // Create Dialog
  const [isCreateOwnerDialogOpen, setIsCreateOwnerDialogOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    id_number: "",
    address: "",
    city: "",
    is_active: true,
  });
  const [createError, setCreateError] = useState<string | null>(null);

  // Details Dialog Handlers
  const openDetailsDialog = () => setIsDetailsDialogOpen(true);
  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setRentalOwnerDashboard({
      selectedOwnerDetails: null,
      ownerDetailsError: null,
    });
  };

  // Assign Properties Dialog Handlers
  const openAssignPropertiesDialog = (owner: Owner) => {
    setSelectedOwnerForAssign(owner);
    setIsAssignPropertiesDialogOpen(true);
    setSelectedPropertyIds([]);
    setAssignError(null);
    fetchAvailableProperties();
  };

  const closeAssignPropertiesDialog = () => {
    setIsAssignPropertiesDialogOpen(false);
    setSelectedOwnerForAssign(null);
    setSelectedPropertyIds([]);
    setAssignError(null);
  };

  const togglePropertySelection = (propertyId: number) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId],
    );
  };

  // Edit Dialog Handlers
  const openEditDialog = (owner: Owner) => {
    setSelectedOwnerForEdit(owner);
    setEditFormData({
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      city: owner.city || "",
      is_active: owner.is_active,
    });
    setPasswordData({
      password: "",
      confirmPassword: "",
    });
    setEditError(null);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedOwnerForEdit(null);
    setEditError(null);
  };

  const handleEditFormChange = (field: string, value: any) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // View Properties Dialog Handlers
  const openViewPropertiesDialog = (owner: Owner) => {
    setSelectedOwnerForView(owner);
    setIsViewPropertiesDialogOpen(true);
  };

  const closeViewPropertiesDialog = () => {
    setIsViewPropertiesDialogOpen(false);
    setSelectedOwnerForView(null);
    setRentalOwnerDashboard({
      assignedProperties: [],
      assignedPropertiesPagination: null,
      assignedPropertiesError: null,
    });
  };

  // Remove Property Dialog Handlers
  const openRemovePropertyDialog = (propertyId: number) => {
    setSelectedPropertyForRemove(propertyId);
    setIsRemovePropertyDialogOpen(true);
  };

  const closeRemovePropertyDialog = () => {
    setIsRemovePropertyDialogOpen(false);
    setSelectedPropertyForRemove(null);
  };

  // Delete Dialog Handlers
  const openDeleteOwnerDialog = (owner: Owner) => {
    setSelectedOwnerForDelete(owner);
    setIsDeleteOwnerDialogOpen(true);
  };

  const closeDeleteOwnerDialog = () => {
    setIsDeleteOwnerDialogOpen(false);
    setSelectedOwnerForDelete(null);
  };

  // Create Dialog Handlers
  const openCreateOwnerDialog = () => {
    setCreateFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      id_number: "",
      address: "",
      city: "",
      is_active: true,
    });
    setCreateError(null);
    setIsCreateOwnerDialogOpen(true);
  };

  const closeCreateOwnerDialog = () => {
    setIsCreateOwnerDialogOpen(false);
    setCreateError(null);
  };

  const handleCreateFormChange = (field: string, value: any) => {
    setCreateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    // Details Dialog
    isDetailsDialogOpen,
    openDetailsDialog,
    closeDetailsDialog,

    // Assign Properties Dialog
    isAssignPropertiesDialogOpen,
    selectedOwnerForAssign,
    selectedPropertyIds,
    assignError,
    openAssignPropertiesDialog,
    closeAssignPropertiesDialog,
    togglePropertySelection,
    setAssignError,

    // Edit Dialog
    isEditDialogOpen,
    selectedOwnerForEdit,
    editFormData,
    passwordData,
    editError,
    openEditDialog,
    closeEditDialog,
    handleEditFormChange,
    handlePasswordChange,
    setEditError,

    // View Properties Dialog
    isViewPropertiesDialogOpen,
    selectedOwnerForView,
    openViewPropertiesDialog,
    closeViewPropertiesDialog,

    // Remove Property Dialog
    isRemovePropertyDialogOpen,
    selectedPropertyForRemove,
    openRemovePropertyDialog,
    closeRemovePropertyDialog,

    // Delete Dialog
    isDeleteOwnerDialogOpen,
    selectedOwnerForDelete,
    openDeleteOwnerDialog,
    closeDeleteOwnerDialog,

    // Create Dialog
    isCreateOwnerDialogOpen,
    createFormData,
    createError,
    openCreateOwnerDialog,
    closeCreateOwnerDialog,
    handleCreateFormChange,
    setCreateError,
  };
}
