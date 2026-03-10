/**
 * Delete role confirmation dialog.
 */

import { useState, useCallback } from "react";
import { accessControlApi } from "@/lib/services/access-control-api";
import type { Role } from "../types";
import { getApiErrorMessage, DEFAULT_ERROR_MESSAGES } from "../utils";

export function useDeleteRoleDialog(
  isAuthReady: boolean,
  hasToken: boolean,
  onSuccess?: () => void
) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = useCallback((r: Role) => {
    setRole(r);
    setOpen(true);
    setError(null);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setRole(null);
    setError(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!role || !isAuthReady || !hasToken) return;
    setLoading(true);
    setError(null);
    try {
      await accessControlApi.roles.delete(role.id);
      onSuccess?.();
      close();
    } catch (err) {
      setError(
        getApiErrorMessage(err, DEFAULT_ERROR_MESSAGES.roleDelete)
      );
    } finally {
      setLoading(false);
    }
  }, [role, isAuthReady, hasToken, onSuccess, close]);

  return {
    open,
    setOpen,
    role,
    loading,
    error,
    openDialog,
    close,
    confirmDelete,
  };
}
