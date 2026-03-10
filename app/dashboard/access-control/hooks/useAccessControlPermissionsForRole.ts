/**
 * Fetch permissions list (grouped) for role create/edit dialogs.
 */

import { useState, useCallback, useEffect } from "react";
import { accessControlApi } from "@/lib/services/access-control-api";
import type { PermissionsResponse } from "../types";

export function useAccessControlPermissionsForRole(
  isAuthReady: boolean,
  hasToken: boolean,
  whenOpen: boolean
) {
  const [data, setData] = useState<PermissionsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!isAuthReady || !hasToken) return;
    setLoading(true);
    try {
      const result = await accessControlApi.permissions.list();
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthReady, hasToken]);

  useEffect(() => {
    if (whenOpen && !data) fetch();
  }, [whenOpen, data, fetch]);

  return { data, loading, refetch: fetch };
}
