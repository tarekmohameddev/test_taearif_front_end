/* ------------------------------------------------------------------ */
/*  FeaturesSection — Type definitions (6 features + certifications)    */
/* ------------------------------------------------------------------ */

import type { ReactNode } from "react";
import type { TextStyleProps } from "../Text/Text.types";

export interface FeatureItem {
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface CertificationItem {
  imageSrc: string;
  imageAlt: string;
  text: string;
}

export interface FeaturesSectionProps {
  /** Section heading */
  heading?: string;
  /** List of 6 feature items */
  features?: FeatureItem[];
  /** Certification blocks (e.g. momah, rega) */
  certifications?: CertificationItem[];
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  /** Style overrides for heading */
  headingTextProps?: TextStyleProps;
  /** Style overrides for feature title */
  featureTitleTextProps?: TextStyleProps;
  /** Style overrides for feature description */
  featureDescriptionTextProps?: TextStyleProps;
  /** Style overrides for certification text */
  certificationTextProps?: TextStyleProps;
  // TODO: Add visible prop
  visible?: boolean;
}
