/**
 * Create role dialog state and submit.
 */

import { useState, useCallback } from "react";
import { accessControlApi } from "@/lib/services/access-control-api";
import { translateRoleCreateError } from "../utils/role-error-messages";

export function useCreateRoleDialog(
  isAuthReady: boolean,
  hasToken: boolean,
  onSuccess?: () => void
) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const setPermission = useCallback((permissionName: string, checked: boolean) => {
    setSelectedPermissions((prev) => ({ ...prev, [permissionName]: checked }));
  }, []);

  const reset = useCallback(() => {
    setName("");
    setSelectedPermissions({});
    setError(null);
    setSuccess(false);
  }, []);

  const submit = useCallback(async () => {
    if (!isAuthReady || !hasToken || !name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const permissions = Object.entries(selectedPermissions)
        .filter(([, checked]) => checked)
        .map(([perm]) => perm);
      await accessControlApi.roles.create({ name: name.trim(), permissions });
      setSuccess(true);
      reset();
      onSuccess?.();
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(translateRoleCreateError(err));
    } finally {
      setLoading(false);
    }
  }, [
    isAuthReady,
    hasToken,
    name,
    selectedPermissions,
    reset,
    onSuccess,
  ]);

  const clearError = useCallback(() => setError(null), []);

  return {
    open,
    setOpen,
    name,
    setName,
    selectedPermissions,
    setPermission,
    loading,
    error,
    success,
    submit,
    reset,
    clearError,
  };
}
