/**
 * Role details dialog state and fetch.
 */

import { useState, useCallback } from "react";
import { accessControlApi } from "@/lib/services/access-control-api";
import type { Role } from "../types";
import { getApiErrorMessage, DEFAULT_ERROR_MESSAGES } from "../utils";
import type { RoleDetailsData } from "../types";

export function useRoleDetailsDialog(
  isAuthReady: boolean,
  hasToken: boolean
) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [details, setDetails] = useState<RoleDetailsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(
    async (roleId: number) => {
      if (!isAuthReady || !hasToken) return;
      setLoading(true);
      setError(null);
      try {
        const response = await accessControlApi.roles.getById(roleId);
        const data = (response as { data?: RoleDetailsData }).data;
        setDetails(data ?? null);
      } catch (err) {
        setError(
          getApiErrorMessage(err, DEFAULT_ERROR_MESSAGES.roleDetails)
        );
      } finally {
        setLoading(false);
    }
    },
    [isAuthReady, hasToken]
  );

  const viewRole = useCallback(
    (role: Role) => {
      setSelectedRole(role);
      setOpen(true);
      fetchDetails(role.id);
    },
    [fetchDetails]
  );

  const close = useCallback(() => {
    setOpen(false);
    setSelectedRole(null);
    setDetails(null);
    setError(null);
  }, []);

  const retry = useCallback(() => {
    if (selectedRole) fetchDetails(selectedRole.id);
  }, [selectedRole, fetchDetails]);

  return {
    open,
    setOpen,
    selectedRole,
    details,
    loading,
    error,
    viewRole,
    close,
    retry,
  };
}
