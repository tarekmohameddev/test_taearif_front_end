/**
 * Edit role dialog state and submit.
 */

import { useState, useCallback } from "react";
import { accessControlApi } from "@/lib/services/access-control-api";
import type { Role } from "../types";
import { getApiErrorMessage, DEFAULT_ERROR_MESSAGES } from "../utils";

export function useEditRoleDialog(
  isAuthReady: boolean,
  hasToken: boolean,
  onSuccess?: () => void
) {
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const openDialog = useCallback(async (role: Role) => {
    if (!isAuthReady || !hasToken) return;
    setEditingRole(role);
    setName(role.name);
    setError(null);
    try {
      const response = await accessControlApi.roles.getById(role.id);
      const data = (response as { data?: { permissions_list?: string[] } }).data;
      const list = data?.permissions_list ?? [];
      const map: Record<string, boolean> = {};
      list.forEach((p: string) => {
        map[p] = true;
      });
      setSelectedPermissions(map);
      setOpen(true);
    } catch {
      setError(DEFAULT_ERROR_MESSAGES.roleDetails);
    }
  }, [isAuthReady, hasToken]);

  const setPermission = useCallback((permissionName: string, checked: boolean) => {
    setSelectedPermissions((prev) => ({ ...prev, [permissionName]: checked }));
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setEditingRole(null);
    setName("");
    setSelectedPermissions({});
    setError(null);
    setSuccess(false);
  }, []);

  const submit = useCallback(async () => {
    if (!editingRole || !isAuthReady || !hasToken) return;
    setLoading(true);
    setError(null);
    try {
      const permissions = Object.entries(selectedPermissions)
        .filter(([, checked]) => checked)
        .map(([perm]) => perm);
      await accessControlApi.roles.update(editingRole.id, {
        name: name.trim(),
        permissions,
      });
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        close();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(
        getApiErrorMessage(err, DEFAULT_ERROR_MESSAGES.roleUpdate)
      );
    } finally {
      setLoading(false);
    }
  }, [
    editingRole,
    isAuthReady,
    hasToken,
    name,
    selectedPermissions,
    onSuccess,
    close,
  ]);

  return {
    open,
    setOpen,
    editingRole,
    name,
    setName,
    selectedPermissions,
    setPermission,
    loading,
    error,
    success,
    openDialog,
    close,
    submit,
  };
}
