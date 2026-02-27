/* ------------------------------------------------------------------ */
/*  LandInvestmentFormSection — Type definitions (form CTA + image)    */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

export interface LandInvestmentFormSectionProps {
  /** Section id (e.g. "form-section") */
  id?: string;
  /** Heading */
  heading?: string;
  /** Description below heading */
  description?: string;
  /** Bottom decorative image URL */
  bottomImageSrc?: string;
  /** Bottom image alt */
  bottomImageAlt?: string;
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  /** Style overrides for heading */
  headingTextProps?: TextStyleProps;
  /** Style overrides for description */
  descriptionTextProps?: TextStyleProps;
  /** Form submit handler */
  onFormSubmit?: (data: Record<string, string>) => void;
  visible?: boolean;
}
