import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a stored dimension value (number or string) to a CSS-ready string.
 * - If value is a number, returns value + unit (e.g. 90, "vh" -> "90vh").
 * - If value is a non-empty string, returns it as-is (may already include unit).
 * - Otherwise returns fallback.
 */
export function toDimension(
  value: string | number | undefined,
  unit: string,
  fallback: string
): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "number" && !Number.isNaN(value)) return `${value}${unit}`;
  const s = String(value).trim();
  return s.length > 0 ? s : fallback;
}
