import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";
import type { PropertyBlock } from "../types/incomingCardTypes";
import { AI_MATCHING_REQUIRED } from "../constants/incomingCardConstants";
import type { AIMatchingStatus } from "../types/incomingCardTypes";

/** خريطة ترجمة نوع العقار إلى العربية (المفتاح lowercase للتوافق مع API) - قطاع ونوع وحدة */
const PROPERTY_TYPE_MAP: Record<string, string> = {
  residential: "سكني",
  industrial: "صناعي",
  agricultural: "زراعي",
  commercial: "تجاري",
  apartment: "شقة",
  apartments: "شقة",
  land: "أرض",
  villa: "فيلا",
  villas: "فيلا",
  building: "مبنى",
  studio: "استوديو",
  duplex: "دوبلكس",
  penthouse: "بنتهاوس",
  townhouse: "تاون هاوس",
  warehouse: "مستودع",
  office: "مكتب",
  shop: "محل",
  retail: "تجاري",
};

export function translatePropertyType(propertyType: string | null | undefined): string {
  if (!propertyType || typeof propertyType !== "string") return "";
  const key = propertyType.trim().toLowerCase();
  return PROPERTY_TYPE_MAP[key] ?? propertyType;
}

export function getPropertyFromMetadata(
  metadata: Record<string, unknown> | undefined
): PropertyBlock | null {
  if (!metadata || typeof metadata !== "object") return null;
  try {
    const title =
      (metadata.propertyTitle as string) ??
      (metadata.property_title as string) ??
      (metadata.title as string);
    const type =
      (metadata.propertyType as string) ??
      (metadata.property_type as string) ??
      (metadata.type as string);
    const price =
      (metadata.propertyPrice as number) ??
      (metadata.property_price as number) ??
      (metadata.price as number);
    const location =
      (metadata.propertyLocation as string) ??
      (metadata.property_location as string) ??
      (metadata.location as string) ??
      (metadata.address as string);
    if (!title && !type && price == null && !location) return null;
    return { title, type, price, location, fromPreferences: false };
  } catch {
    return null;
  }
}

export function getPropertyFromAction(action: CustomerAction): PropertyBlock | null {
  if (action.objectType !== "property_request") return null;
  const hasData =
    action.propertyType ||
    action.city ||
    action.budgetMin != null ||
    action.budgetMax != null;
  if (!hasData) return null;

  let priceRange: string | undefined;
  if (
    action.budgetMin != null &&
    action.budgetMax != null &&
    action.budgetMin !== action.budgetMax
  ) {
    priceRange = `${action.budgetMin.toLocaleString("en-US")}–${action.budgetMax.toLocaleString("en-US")} ر.س`;
  } else if (action.budgetMin != null) {
    priceRange = `${action.budgetMin.toLocaleString("en-US")} ر.س`;
  } else if (action.budgetMax != null) {
    priceRange = `${action.budgetMax.toLocaleString("en-US")} ر.س`;
  }

  const location = action.city || undefined;
  return {
    title: priceRange,
    type: action.propertyType ? translatePropertyType(action.propertyType) : undefined,
    price: action.budgetMin ?? action.budgetMax ?? undefined,
    location,
    fromPreferences: false,
  };
}

export function getPropertyFromPreferences(
  customer: UnifiedCustomer | undefined
): PropertyBlock | null {
  if (!customer?.preferences) return null;
  const p = customer.preferences;
  const type = p.propertyType?.length ? p.propertyType.join("، ") : undefined;
  const price =
    p.budgetMin != null || p.budgetMax != null ? (p.budgetMin ?? p.budgetMax)! : undefined;
  const priceRange =
    p.budgetMin != null && p.budgetMax != null && p.budgetMin !== p.budgetMax
      ? `${(p.budgetMin / 1_000_000).toFixed(1)}–${(p.budgetMax / 1_000_000).toFixed(1)} م.ر`
      : p.budgetMin != null
        ? `${(p.budgetMin / 1_000_000).toFixed(1)} م.ر`
        : undefined;
  const location = p.preferredAreas?.length
    ? p.preferredAreas.slice(0, 2).join(" · ")
    : p.preferredCities?.length
      ? p.preferredCities.slice(0, 2).join("، ")
      : undefined;
  if (!type && !priceRange && !location) return null;
  return {
    title: priceRange ?? undefined,
    type,
    price: p.budgetMin ?? p.budgetMax,
    location,
    fromPreferences: true,
  };
}

export function getAIMatchingStatus(customer: UnifiedCustomer | undefined): AIMatchingStatus {
  const matchCount = customer?.aiInsights?.propertyMatches?.length ?? 0;
  if (!customer?.preferences) {
    return {
      canMatch: false,
      matchCount,
      missingFields: [
        AI_MATCHING_REQUIRED.propertyType,
        AI_MATCHING_REQUIRED.budget,
        AI_MATCHING_REQUIRED.location,
      ],
    };
  }
  const p = customer.preferences;
  const hasPropertyType = (p.propertyType?.length ?? 0) > 0;
  const hasPurpose = !!p.purpose;
  const hasBudget = p.budgetMin != null || p.budgetMax != null;
  const hasLocation =
    (p.preferredAreas?.length ?? 0) > 0 || (p.preferredCities?.length ?? 0) > 0;
  const canMatch = (hasPropertyType || hasPurpose) && (hasBudget || hasLocation);
  const missingFields: string[] = [];
  if (!hasPropertyType && !hasPurpose) missingFields.push(AI_MATCHING_REQUIRED.propertyType);
  if (!hasBudget) missingFields.push(AI_MATCHING_REQUIRED.budget);
  if (!hasLocation) missingFields.push(AI_MATCHING_REQUIRED.location);
  return { canMatch, matchCount, missingFields };
}
