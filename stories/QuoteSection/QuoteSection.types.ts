/* ------------------------------------------------------------------ */
/*  QuoteSection — Type definitions (blockquote + CEO card)            */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

export interface QuoteSectionProps {
  /** Quote text */
  quote?: string;
  /** CEO image URL */
  imageSrc?: string;
  /** CEO image alt */
  imageAlt?: string;
  /** CEO name */
  name?: string;
  /** CEO role/title */
  role?: string;
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  /** Style overrides for quote text */
  quoteTextProps?: TextStyleProps;
  /** Style overrides for name */
  nameTextProps?: TextStyleProps;
  /** Style overrides for role */
  roleTextProps?: TextStyleProps;
}
