import { FieldDefinition } from "@/componentsStructure/types";

/**
 * Checks if fields contain gradient color pair (from and to)
 */
export function hasGradientPair(fields: FieldDefinition[]): boolean {
  const hasFrom = fields.some((f) => f.key === "colors.from");
  const hasTo = fields.some((f) => f.key === "colors.to");
  return hasFrom && hasTo;
}

/**
 * Gets background mode from value or defaults to gradient if gradient pair exists
 */
export function getBackgroundMode(
  value: any,
  hasGradientPair: boolean,
): string {
  return value || (hasGradientPair ? "gradient" : "solid");
}
