/* ------------------------------------------------------------------ */
/*  CommitmentSection — Type definitions (عهد وإلتزام)                 */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

export interface CommitmentSectionProps {
  /** CEO image URL */
  imageSrc?: string;
  /** CEO image alt */
  imageAlt?: string;
  /** Background image URL behind the CEO photo (e.g. decorative frame) */
  backgroundImageSrc?: string;
  /** Role label (e.g. الرئيس التنفيذي) */
  roleLabel?: string;
  /** CEO name */
  name?: string;
  /** Section heading */
  heading?: string;
  /** Quote text */
  quote?: string;
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  /** Style overrides for role label */
  roleLabelTextProps?: TextStyleProps;
  /** Style overrides for name */
  nameTextProps?: TextStyleProps;
  /** Style overrides for heading */
  headingTextProps?: TextStyleProps;
  /** Style overrides for quote */
  quoteTextProps?: TextStyleProps;
}
