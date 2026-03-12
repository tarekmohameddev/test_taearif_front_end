/**
 * Fetch permissions list (grouped) for role create/edit dialogs.
 * Applies duplicate-API guards per PREVENT_DUPLICATE_API_PROMPT.md.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { accessControlApi } from "@/lib/services/access-control-api";
import type { PermissionsResponse } from "../types";

export function useAccessControlPermissionsForRole(
  isAuthReady: boolean,
  hasToken: boolean,
  whenOpen: boolean
) {
  const [data, setData] = useState<PermissionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchInFlightRef = useRef(false);

  const fetch = useCallback(async () => {
    if (!isAuthReady || !hasToken) return;
    // Loading guard: avoid duplicate request (ref for synchronous check)
    if (fetchInFlightRef.current) return;
    // Cache guard: already have data for this resource
    if (data) return;
    fetchInFlightRef.current = true;
    setLoading(true);
    try {
      const result = await accessControlApi.permissions.list();
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
      fetchInFlightRef.current = false;
    }
  }, [isAuthReady, hasToken, data]);

  useEffect(() => {
    if (whenOpen && !data) fetch();
  }, [whenOpen, data, fetch]);

  return { data, loading, refetch: fetch };
}
