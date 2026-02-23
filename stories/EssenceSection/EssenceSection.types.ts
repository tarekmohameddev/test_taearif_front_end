/* ------------------------------------------------------------------ */
/*  EssenceSection — Type definitions (جوهر وجودنا)                    */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

export interface EssenceSectionProps {
  /** Main heading */
  heading?: string;
  /** First paragraph lead (strong) */
  lead?: string;
  /** First paragraph body */
  body1?: string;
  /** Second paragraph */
  body2?: string;
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  /** Style overrides for heading */
  headingTextProps?: TextStyleProps;
  /** Style overrides for lead text */
  leadTextProps?: TextStyleProps;
  /** Style overrides for body paragraphs */
  bodyTextProps?: TextStyleProps;
}
