/**
 * Role details dialog state and fetch.
 * Applies duplicate-API guards per PREVENT_DUPLICATE_API_PROMPT.md.
 */

import { useState, useCallback, useRef } from "react";
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
  const lastFetchedRoleIdRef = useRef<number | null>(null);
  const fetchDetailsInFlightRef = useRef(false);

  const fetchDetails = useCallback(
    async (roleId: number) => {
      if (!isAuthReady || !hasToken) return;
      // Loading guard (ref for synchronous check)
      if (fetchDetailsInFlightRef.current) return;
      // Cache / identity guard: already have details for this role
      if (details && lastFetchedRoleIdRef.current === roleId) return;
      // Last-fetched guard: avoid rapid duplicate for same role
      if (lastFetchedRoleIdRef.current === roleId) return;
      fetchDetailsInFlightRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const response = await accessControlApi.roles.getById(roleId);
        const data = (response as { data?: RoleDetailsData }).data;
        setDetails(data ?? null);
        lastFetchedRoleIdRef.current = roleId;
      } catch (err) {
        setError(
          getApiErrorMessage(err, DEFAULT_ERROR_MESSAGES.roleDetails)
        );
      } finally {
        setLoading(false);
        fetchDetailsInFlightRef.current = false;
      }
    },
    [isAuthReady, hasToken, details]
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
    lastFetchedRoleIdRef.current = null;
    fetchDetailsInFlightRef.current = false;
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
