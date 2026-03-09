import type { CustomerAction, UnifiedCustomer, PropertyInterest } from "@/types/unified-customer";

/** Customer-like object (full UnifiedCustomer or minimal fallback from action). */
export type CustomerLike =
  | (Omit<Partial<UnifiedCustomer>, "id"> & { id?: string | number | null })
  | null
  | undefined;

export interface PropertyInfo {
  title: string;
  type?: string;
  price?: number;
  location?: string;
}

export interface CustomerPreferencesDisplay {
  type?: string;
  budget?: string;
  location?: string;
  bedrooms?: number;
}

export interface AiMatchingInfo {
  canMatch: boolean;
  matchCount: number;
}

/**
 * Get property info from action metadata (snake_case or camelCase).
 */
export function getPropertyInfo(action: CustomerAction): PropertyInfo | null {
  const m = action.metadata;
  const title = m?.propertyTitle ?? m?.property_title;
  if (!title) return null;
  return {
    title: String(title),
    type: m?.propertyType ?? m?.property_type,
    price: m?.propertyPrice ?? m?.property_price,
    location: m?.propertyLocation ?? m?.property_location,
  };
}

/**
 * Get customer preferences as display object for PropertyOrPreferencesCard.
 */
export function getCustomerPreferences(customer: CustomerLike): CustomerPreferencesDisplay | null {
  const prefs = customer?.preferences;
  if (!prefs) return null;
  const budgetMin = prefs.budgetMin;
  const budgetMax = prefs.budgetMax;
  const budget =
    budgetMin != null && budgetMax != null
      ? `${(budgetMin / 1000).toFixed(0)}k - ${(budgetMax / 1000).toFixed(0)}k ريال`
      : budgetMax != null
        ? `حتى ${(budgetMax / 1000).toFixed(0)}k ريال`
        : undefined;
  return {
    type: prefs.propertyType?.length ? prefs.propertyType.join("، ") : undefined,
    budget,
    location: prefs.preferredAreas?.length ? prefs.preferredAreas.slice(0, 3).join("، ") : undefined,
    bedrooms: prefs.bedrooms,
  };
}

/**
 * Get AI matching capability and count for AIMatchingCard.
 */
export function getAiMatching(customer: CustomerLike): AiMatchingInfo {
  if (!customer) return { canMatch: false, matchCount: 0 };
  const prefs = customer.preferences;
  const canMatch =
    (prefs?.propertyType?.length ?? 0) > 0 &&
    ((prefs?.budgetMin ?? 0) > 0 || (prefs?.preferredAreas?.length ?? 0) > 0);
  const matchCount = customer.aiInsights?.propertyMatches?.length ?? 0;
  return { canMatch, matchCount };
}

/**
 * Resolve AI-matched properties from customer.properties by propertyMatches IDs.
 */
export function getMatchedProperties(customer: CustomerLike): PropertyInterest[] {
  if (!customer?.properties?.length || !customer.aiInsights?.propertyMatches?.length) return [];
  const matchIds = customer.aiInsights?.propertyMatches ?? [];
  return customer.properties.filter((p) => matchIds.includes(p.propertyId));
}

/**
 * Get numeric property request ID from action (metadata, property_request_id, or requestId pattern).
 */
export function getPropertyRequestNumericId(action: CustomerAction, requestId: string): number | undefined {
  if (action.objectType !== "property_request") return undefined;
  const withId = action as CustomerAction & { property_request_id?: number };
  const fromMeta = action.metadata?.propertyRequestId as number | undefined;
  const fromField = withId.property_request_id;
  if (typeof fromMeta === "number" && !Number.isNaN(fromMeta)) return fromMeta;
  if (typeof fromField === "number" && !Number.isNaN(fromField)) return fromField;
  if (requestId && /^property_request_(\d+)$/.test(requestId)) {
    return parseInt(requestId.replace(/^property_request_/, ""), 10);
  }
  return undefined;
}

/**
 * Whether to show the RequestPropertiesCard (property request with valid numeric ID).
 */
export function showRequestPropertiesCard(action: CustomerAction, requestId: string): boolean {
  const id = getPropertyRequestNumericId(action, requestId);
  return id != null && !Number.isNaN(id);
}

/**
 * Normalize property_ids from action (API may return array or string like "[1747]").
 */
export function getRequestPropertyIds(action: CustomerAction, showCard: boolean): number[] {
  if (!showCard) return [];
  const raw =
    (action as CustomerAction & { propertyIds?: number[] }).propertyIds ??
    (action.metadata?.propertyIds as number[] | string | undefined) ??
    (action as CustomerAction & { property_ids?: number[] | string }).property_ids;
  if (Array.isArray(raw)) return raw.filter((id): id is number => typeof id === "number");
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? parsed.filter((id: unknown): id is number => typeof id === "number") : [];
    } catch {
      return [];
    }
  }
  return [];
}
