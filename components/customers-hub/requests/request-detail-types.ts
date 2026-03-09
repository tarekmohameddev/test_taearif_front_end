import type { CustomerAction } from "@/types/unified-customer";

/**
 * Stats passed to request detail page (e.g. from list or API).
 * Use this instead of `any` for type safety.
 */
export interface RequestDetailStats {
  [key: string]: unknown;
}

/**
 * Type guard: true when action is a property request with a numeric ID.
 */
export function isPropertyRequestAction(
  action: CustomerAction
): action is CustomerAction & { property_request_id: number } {
  return (
    action.objectType === "property_request" &&
    typeof (action as CustomerAction & { property_request_id?: number }).property_request_id === "number"
  );
}

/**
 * Get the numeric property request ID from an action (for API calls).
 * Uses property_request_id first, then sourceId when objectType is property_request (e.g. in list).
 */
export function getPropertyRequestId(
  action: CustomerAction | { property_request_id?: number; objectType?: string; sourceId?: number | string } | null | undefined
): number | undefined {
  if (!action) return undefined;
  const withId = action as { property_request_id?: number; objectType?: string; sourceId?: number | string };
  if (typeof withId.property_request_id === "number") return withId.property_request_id;
  if (withId.objectType === "property_request" && withId.sourceId != null) {
    if (typeof withId.sourceId === "number") return withId.sourceId;
    const parsed = parseInt(String(withId.sourceId), 10);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return undefined;
}
