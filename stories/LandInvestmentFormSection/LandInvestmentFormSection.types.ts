/* ------------------------------------------------------------------ */
/*  LandInvestmentFormSection — Type definitions (form CTA + image)    */
/* ------------------------------------------------------------------ */

import type { ReactNode } from "react";
import type { TextStyleProps } from "../Text/Text.types";

export interface LandInvestmentFormSectionProps {
  /** Section id (e.g. "form-section") */
  id?: string;
  /** Heading */
  heading?: string;
  /** Description below heading */
  description?: string;
  /** Form content or CTA — rendered in the form area */
  children?: ReactNode;
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
}
