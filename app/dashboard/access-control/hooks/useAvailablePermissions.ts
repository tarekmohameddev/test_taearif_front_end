/**
 * Available permissions for translation (name_ar / name_en).
 * Applies duplicate-API guards per PREVENT_DUPLICATE_API_PROMPT.md.
 */

import { useState, useCallback } from "react";
import { accessControlApi } from "@/lib/services/access-control-api";
import { translatePermission as translatePermissionUtil } from "../utils";
import type { AvailablePermissionItem } from "../types";

export function useAvailablePermissions(isAuthReady: boolean, hasToken: boolean) {
  const [availablePermissions, setAvailablePermissions] = useState<
    AvailablePermissionItem[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!isAuthReady || !hasToken) return;
    // Loading guard
    if (loading) return;
    // Cache guard: already have data for this resource
    if (availablePermissions.length > 0) return;
    setLoading(true);
    try {
      const response = await accessControlApi.available.permissions();
      const data = response?.data;
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (first && typeof first === "object" && "name_ar" in first) {
          setAvailablePermissions(data as AvailablePermissionItem[]);
          setLoading(false);
          return;
        }
      }
      const full = await accessControlApi.permissions.list();
      if (full?.data) {
        setAvailablePermissions(full.data as AvailablePermissionItem[]);
      }
    } catch {
      // Non-critical; translation will fallback to original name
    } finally {
      setLoading(false);
    }
  }, [isAuthReady, hasToken, loading, availablePermissions.length]);

  const translatePermission = useCallback(
    (permissionName: string) =>
      translatePermissionUtil(permissionName, availablePermissions),
    [availablePermissions]
  );

  return { availablePermissions, fetch, translatePermission };
}
