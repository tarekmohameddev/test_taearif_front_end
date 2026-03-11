/**
 * Delete permission confirmation dialog.
 */

import { useState, useCallback } from "react";
import { accessControlApi } from "@/lib/services/access-control-api";
import type { Permission } from "../types";
import { getApiErrorMessage, DEFAULT_ERROR_MESSAGES } from "../utils";

export function useDeletePermissionDialog(
  isAuthReady: boolean,
  hasToken: boolean,
  onSuccess?: () => void
) {
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = useCallback((p: Permission) => {
    setPermission(p);
    setOpen(true);
    setError(null);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setPermission(null);
    setError(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!permission || !isAuthReady || !hasToken) return;
    setLoading(true);
    setError(null);
    try {
      await accessControlApi.permissions.delete(permission.id);
      onSuccess?.();
      close();
    } catch (err) {
      setError(
        getApiErrorMessage(err, DEFAULT_ERROR_MESSAGES.permissionDelete)
      );
    } finally {
      setLoading(false);
    }
  }, [permission, isAuthReady, hasToken, onSuccess, close]);

  return {
    open,
    setOpen,
    permission,
    loading,
    error,
    openDialog,
    close,
    confirmDelete,
  };
}
