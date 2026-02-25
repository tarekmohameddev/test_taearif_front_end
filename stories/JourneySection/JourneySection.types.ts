/* ------------------------------------------------------------------ */
/*  JourneySection — Type definitions (6-stage journey)                */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

export interface JourneyStep {
  number: number;
  title: string;
  duration: string;
  description: string;
  /** Optional CTA label (e.g. step 1 "استثمر ارضك الآن") */
  ctaLabel?: string;
  /** Optional CTA href (e.g. "#form-section") */
  ctaHref?: string;
}

export interface JourneySectionProps {
  /** Section heading */
  heading?: string;
  /** 6 steps */
  steps?: JourneyStep[];
  /** Optional decorative flag/image URL */
  flagImageSrc?: string;
  /** Flag image alt */
  flagImageAlt?: string;
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  /** Style overrides for heading */
  headingTextProps?: TextStyleProps;
  /** Style overrides for step title */
  stepTitleTextProps?: TextStyleProps;
  /** Style overrides for step duration */
  stepDurationTextProps?: TextStyleProps;
  /** Style overrides for step description */
  stepDescriptionTextProps?: TextStyleProps;
  // TODO: Add visible prop
  visible?: boolean;
}
