import { DOMAIN_REGEX } from "../constants";

export interface DomainValidationResult {
  valid: boolean;
  error?: string;
}

const PREFIXES_INVALID = ["www.", "http:", "https:"];

/**
 * Validates domain input: no www/http(s), non-empty, and valid domain format.
 */
export function validateDomainInput(value: string): DomainValidationResult {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, error: "اسم النطاق مطلوب" };
  }
  const hasInvalidPrefix = PREFIXES_INVALID.some((p) =>
    trimmed.toLowerCase().startsWith(p),
  );
  if (hasInvalidPrefix) {
    return {
      valid: false,
      error: "تنسيق النطاق غير صالح - أزل www أو http://",
    };
  }
  if (!DOMAIN_REGEX.test(trimmed)) {
    return { valid: false, error: "تنسيق النطاق غير صالح" };
  }
  return { valid: true };
}
