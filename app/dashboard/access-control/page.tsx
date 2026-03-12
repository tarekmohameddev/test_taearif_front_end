"use client";

import { useEffect } from "react";
import useAuthStore from "@/context/AuthContext";
import { selectUserData, selectIsLoading } from "@/context/auth/selectors";
import { useUserStore } from "@/context/userStore";
import PaymentPopup from "@/components/popup/PopupForWhatsapp";
import {
  useAccessControlEmployees,
  useAvailablePermissions,
  useRoleDetailsDialog,
  useCreateRoleDialog,
  useEditRoleDialog,
  useDeleteRoleDialog,
  useDeletePermissionDialog,
  useAccessControlPermissionsForRole,
} from "./hooks";
import {
  AccessControlStatsCards,
  EmployeesTable,
  DeleteEmployeeDialog,
  RoleDetailsDialog,
  CreateRoleDialog,
  EditRoleDialog,
  DeleteRoleDialog,
  DeletePermissionDialog,
} from "./components";

export default function AccessControlPage() {
  const authUserData = useAuthStore(selectUserData);
  const authLoading = useAuthStore(selectIsLoading);
  const isAuthReady = !authLoading && !!authUserData?.token;

  const employees = useAccessControlEmployees({
    isAuthReady,
    hasToken: !!authUserData?.token,
  });

  const { availablePermissions, fetch: fetchAvailablePermissions, translatePermission } =
    useAvailablePermissions(isAuthReady, !!authUserData?.token);

  const roleDetails = useRoleDetailsDialog(isAuthReady, !!authUserData?.token);
  const createRole = useCreateRoleDialog(isAuthReady, !!authUserData?.token);
  const editRole = useEditRoleDialog(isAuthReady, !!authUserData?.token);
  const deleteRole = useDeleteRoleDialog(isAuthReady, !!authUserData?.token);
  const deletePermission = useDeletePermissionDialog(
    isAuthReady,
    !!authUserData?.token
  );

  const permissionsForRole = useAccessControlPermissionsForRole(
    isAuthReady,
    !!authUserData?.token,
    createRole.open || editRole.open
  );

  useEffect(() => {
    if (!isAuthReady) return;
    employees.fetchEmployees();
    fetchAvailablePermissions();
    const userStore = useUserStore.getState();
    if (!userStore.userData?.employees) {
      userStore.fetchUserData();
    }
  }, [authUserData?.token, authLoading, isAuthReady]);

  const hasNoLimit =
    !employees.employeesData || !employees.employeesData.max_employees;

  return (
    <div className="flex min-h-screen flex-col h-screen bg-white">
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              إدارة الموظفين
            </h1>
          </div>

          <AccessControlStatsCards
            employeesData={employees.employeesData}
          />

          <div className="mt-6">
            <EmployeesTable
              employees={employees.employees}
              loading={employees.loading}
              error={employees.error}
              onRetry={employees.fetchEmployees}
              hasNoLimit={hasNoLimit}
              isAtLimit={employees.isAtLimit}
              isPurchasingAddon={employees.payment.isPurchasingAddon}
              onNavigateToCreate={employees.handleNavigateToCreateEmployee}
              onPurchaseAddon={employees.payment.handlePurchaseAddon}
              onDeleteEmployee={employees.deleteDialog.openDialog}
            />
          </div>
        </div>
      </div>

      <DeleteEmployeeDialog
        open={employees.deleteDialog.open}
        onOpenChange={(open) => !open && employees.deleteDialog.closeDialog()}
        employee={employees.deleteDialog.employee}
        loading={employees.deleteDialog.loading}
        error={employees.deleteDialog.error}
        onConfirm={employees.deleteDialog.confirmDelete}
        onCancel={employees.deleteDialog.closeDialog}
      />

      <RoleDetailsDialog
        open={roleDetails.open}
        onOpenChange={roleDetails.setOpen}
        details={roleDetails.details}
        loading={roleDetails.loading}
        error={roleDetails.error}
        onRetry={roleDetails.retry}
        onClose={roleDetails.close}
        translatePermission={translatePermission}
      />

      <CreateRoleDialog
        open={createRole.open}
        onOpenChange={createRole.setOpen}
        name={createRole.name}
        onNameChange={createRole.setName}
        permissionsData={permissionsForRole.data}
        permissionsLoading={permissionsForRole.loading}
        selectedPermissions={createRole.selectedPermissions}
        onPermissionChange={createRole.setPermission}
        loading={createRole.loading}
        error={createRole.error}
        success={createRole.success}
        onClearError={createRole.clearError}
        onSubmit={createRole.submit}
        onCancel={() => createRole.setOpen(false)}
        translatePermission={translatePermission}
      />

      <EditRoleDialog
        open={editRole.open}
        onOpenChange={editRole.setOpen}
        name={editRole.name}
        onNameChange={editRole.setName}
        permissionsData={permissionsForRole.data}
        permissionsLoading={permissionsForRole.loading}
        selectedPermissions={editRole.selectedPermissions}
        onPermissionChange={editRole.setPermission}
        loading={editRole.loading}
        error={editRole.error}
        success={editRole.success}
        onSubmit={editRole.submit}
        onCancel={editRole.close}
        translatePermission={translatePermission}
      />

      <DeleteRoleDialog
        open={deleteRole.open}
        onOpenChange={deleteRole.setOpen}
        role={deleteRole.role}
        loading={deleteRole.loading}
        error={deleteRole.error}
        onConfirm={deleteRole.confirmDelete}
        onCancel={deleteRole.close}
      />

      <DeletePermissionDialog
        open={deletePermission.open}
        onOpenChange={deletePermission.setOpen}
        permission={deletePermission.permission}
        loading={deletePermission.loading}
        error={deletePermission.error}
        onConfirm={deletePermission.confirmDelete}
        onCancel={deletePermission.close}
      />

      {employees.payment.popupOpen && (
        <PaymentPopup
          paymentUrl={employees.payment.paymentUrl}
          onClose={employees.payment.closePopup}
          onPaymentSuccess={employees.payment.handlePaymentSuccess}
        />
      )}
    </div>
  );
}
