// Shared property/unit type definitions for the whole app.
// Single source of truth for residential vs commercial classifications.

export type PropertyTypeValue = "residential" | "commercial";

export interface PropertyTypeOption {
  value: PropertyTypeValue;
  labelAr: string;
}

export const PROPERTY_TYPES: PropertyTypeOption[] = [
  { value: "residential", labelAr: "سكني" },
  { value: "commercial", labelAr: "تجاري" },
];

export const PROPERTY_TYPE_LABELS_AR: Record<PropertyTypeValue, string> = {
  residential: "سكني",
  commercial: "تجاري",
};

