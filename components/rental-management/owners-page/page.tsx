"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, Plus, ArrowRight } from "lucide-react";
import useStore from "@/context/Store";
import { useOwnersPage } from "./hooks/useOwnersPage";
import { useOwnerDialogs } from "./hooks/useOwnerDialogs";
import { useOwnerActions } from "./hooks/useOwnerActions";
import { SearchAndFilters } from "./components/SearchAndFilters";
import { StatisticsCards } from "./components/StatisticsCards";
import { OwnersTable } from "./components/OwnersTable";
import { OwnerDetailsDialog } from "./components/OwnerDetailsDialog";
import { AssignPropertiesDialog } from "./components/AssignPropertiesDialog";
import { EditOwnerDialog } from "./components/EditOwnerDialog";
import { CreateOwnerDialog } from "./components/CreateOwnerDialog";
import { ViewPropertiesDialog } from "./components/ViewPropertiesDialog";
import { DeleteOwnerDialog } from "./components/DeleteOwnerDialog";
import { RemovePropertyDialog } from "./components/RemovePropertyDialog";
import { PAGE_SIZE } from "./constants/owners.constants";

export function OwnersPage() {
  const router = useRouter();
  const { rentalOwnerDashboard, fetchOwnerDetails, fetchAssignedProperties } =
    useStore();

  const {
    owners,
    pagination,
    loading,
    error,
    searchTerm,
    statusFilter,
    totalOwners,
    activeOwners,
    totalProperties,
    handlePageChange,
    handleSearchChange,
    handleStatusFilterChange,
    refetch,
  } = useOwnersPage();

  const {
    isDetailsDialogOpen,
    openDetailsDialog,
    closeDetailsDialog,
    isAssignPropertiesDialogOpen,
    selectedOwnerForAssign,
    selectedPropertyIds,
    assignError,
    openAssignPropertiesDialog,
    closeAssignPropertiesDialog,
    togglePropertySelection,
    setAssignError,
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
    isViewPropertiesDialogOpen,
    selectedOwnerForView,
    openViewPropertiesDialog,
    closeViewPropertiesDialog,
    isRemovePropertyDialogOpen,
    selectedPropertyForRemove,
    openRemovePropertyDialog,
    closeRemovePropertyDialog,
    isDeleteOwnerDialogOpen,
    selectedOwnerForDelete,
    openDeleteOwnerDialog,
    closeDeleteOwnerDialog,
    isCreateOwnerDialogOpen,
    createFormData,
    createError,
    openCreateOwnerDialog,
    closeCreateOwnerDialog,
    handleCreateFormChange,
    setCreateError,
  } = useOwnerDialogs();

  const {
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
  } = useOwnerActions();

  const {
    selectedOwnerDetails,
    loadingOwnerDetails,
    ownerDetailsError,
    availableProperties,
    loadingProperties,
    assignedProperties,
    assignedPropertiesPagination,
    loadingAssignedProperties,
    assignedPropertiesError,
  } = rentalOwnerDashboard;

  // View owner details handler
  const viewOwnerDetails = (owner: any) => {
    openDetailsDialog();
    fetchOwnerDetails(owner.id);
  };

  // Handle assigned properties page change
  const handleAssignedPropertiesPageChange = (page: number) => {
    if (selectedOwnerForView) {
      fetchAssignedProperties(selectedOwnerForView.id, page, PAGE_SIZE);
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-8 w-8" />
                إدارة الملاك
              </h1>
              <p className="text-gray-500 mt-1">
                إدارة وعرض معلومات الملاك في النظام
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/dashboard/rental-management")}
                variant="outline"
                className="gap-2"
              >
                <ArrowRight className="h-5 w-5" />
                العودة لإدارة الايجارات
              </Button>
              <Button onClick={openCreateOwnerDialog} className="gap-2">
                <Plus className="h-5 w-5" />
                إضافة مالك جديد
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <SearchAndFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={handleSearchChange}
            onStatusFilterChange={handleStatusFilterChange}
          />

          {/* Statistics Cards */}
          <StatisticsCards
            totalOwners={totalOwners}
            activeOwners={activeOwners}
            totalProperties={totalProperties}
          />

          {/* Owners Table */}
          <OwnersTable
            owners={owners}
            loading={loading}
            isInitialized={rentalOwnerDashboard.isInitialized}
            error={error}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRetry={refetch}
            onViewDetails={viewOwnerDetails}
            onEdit={openEditDialog}
            onAssignProperties={openAssignPropertiesDialog}
            onViewProperties={openViewPropertiesDialog}
            onDelete={openDeleteOwnerDialog}
          />

          {/* Dialogs */}
          <OwnerDetailsDialog
            isOpen={isDetailsDialogOpen}
            onClose={closeDetailsDialog}
            owner={selectedOwnerDetails}
            loading={loadingOwnerDetails}
            error={ownerDetailsError}
            onRetry={() =>
              selectedOwnerDetails && fetchOwnerDetails(selectedOwnerDetails.id)
            }
          />

          <AssignPropertiesDialog
            isOpen={isAssignPropertiesDialogOpen}
            onClose={closeAssignPropertiesDialog}
            owner={selectedOwnerForAssign}
            availableProperties={availableProperties}
            loading={loadingProperties}
            selectedPropertyIds={selectedPropertyIds}
            onToggleProperty={togglePropertySelection}
            onAssign={() => {
              if (selectedOwnerForAssign) {
                handleAssignProperties(
                  selectedOwnerForAssign.id,
                  selectedPropertyIds,
                  closeAssignPropertiesDialog,
                  setAssignError,
                );
              }
            }}
            assigning={assigningProperties}
            error={assignError}
          />

          <EditOwnerDialog
            isOpen={isEditDialogOpen}
            onClose={closeEditDialog}
            owner={selectedOwnerForEdit}
            editFormData={editFormData}
            passwordData={passwordData}
            onFormChange={handleEditFormChange}
            onPasswordChange={handlePasswordChange}
            onUpdate={() => {
              if (selectedOwnerForEdit) {
                handleUpdateOwner(
                  selectedOwnerForEdit.id,
                  editFormData,
                  setEditError,
                  closeEditDialog,
                );
              }
            }}
            onChangePassword={() => {
              if (selectedOwnerForEdit) {
                handleChangePassword(
                  selectedOwnerForEdit.id,
                  passwordData.password,
                  passwordData.confirmPassword,
                  setEditError,
                  closeEditDialog,
                );
              }
            }}
            updating={updatingOwner}
            error={editError}
          />

          <CreateOwnerDialog
            isOpen={isCreateOwnerDialogOpen}
            onClose={closeCreateOwnerDialog}
            formData={createFormData}
            onFormChange={handleCreateFormChange}
            onCreate={() => {
              handleCreateOwner(createFormData, setCreateError, closeCreateOwnerDialog);
            }}
            creating={creatingOwner}
            error={createError}
          />

          <ViewPropertiesDialog
            isOpen={isViewPropertiesDialogOpen}
            onClose={closeViewPropertiesDialog}
            owner={selectedOwnerForView}
            properties={assignedProperties}
            loading={loadingAssignedProperties}
            error={assignedPropertiesError}
            pagination={assignedPropertiesPagination}
            onPageChange={handleAssignedPropertiesPageChange}
            onRetry={() => {
              if (selectedOwnerForView) {
                fetchAssignedProperties(
                  selectedOwnerForView.id,
                  assignedPropertiesPagination?.current_page || 1,
                  PAGE_SIZE,
                );
              }
            }}
            onRemoveProperty={(propertyId) => {
              openRemovePropertyDialog(propertyId);
            }}
          />

          <DeleteOwnerDialog
            isOpen={isDeleteOwnerDialogOpen}
            onClose={closeDeleteOwnerDialog}
            owner={selectedOwnerForDelete}
            onDelete={() => {
              if (selectedOwnerForDelete) {
                handleDeleteOwner(
                  selectedOwnerForDelete.id,
                  closeDeleteOwnerDialog,
                );
              }
            }}
            deleting={deletingOwner}
          />

          <RemovePropertyDialog
            isOpen={isRemovePropertyDialogOpen}
            onClose={closeRemovePropertyDialog}
            onConfirm={() => {
              if (selectedOwnerForView && selectedPropertyForRemove) {
                handleRemoveProperty(
                  selectedOwnerForView.id,
                  selectedPropertyForRemove,
                  closeRemovePropertyDialog,
                );
              }
            }}
            removing={removingProperty}
          />
        </div>
      </main>
    </div>
  );
}
