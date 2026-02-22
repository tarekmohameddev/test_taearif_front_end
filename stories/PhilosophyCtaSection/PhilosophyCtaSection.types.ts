/* ------------------------------------------------------------------ */
/*  PhilosophyCtaSection — Type definitions (شاهد الفلسفة.. تتجسد)      */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

export interface PhilosophyCtaSectionProps {
  /** Section heading */
  heading?: string;
  /** Description paragraph */
  description?: string;
  /** CTA button label */
  ctaLabel?: string;
  /** CTA href */
  ctaHref?: string;
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  /** Style overrides for heading */
  headingTextProps?: TextStyleProps;
  /** Style overrides for description */
  descriptionTextProps?: TextStyleProps;
  /** Style overrides for CTA label */
  ctaTextProps?: TextStyleProps;
}
