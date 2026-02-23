/* ------------------------------------------------------------------ */
/*  HeroBanner — Type definitions                                      */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

export interface HeroBannerProps {
  /** Main title (large golden text) */
  title?: string;
  /** Subtitle (white bold text) */
  subtitle?: string;
  /** Description paragraph */
  description?: string;
  /** Style overrides for the title text */
  titleTextProps?: TextStyleProps;
  /** Style overrides for the subtitle text */
  subtitleTextProps?: TextStyleProps;
  /** Style overrides for the description text */
  descriptionTextProps?: TextStyleProps;
  /** Primary CTA button */
  primaryCta?: {
    label: string;
    href: string;
  };
  /** Secondary CTA button (outline style) */
  secondaryCta?: {
    label: string;
    href: string;
  };
  /** Background video source URL */
  videoSrc?: string;
  /** Fallback background image if video fails */
  fallbackImage?: string;
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  /** Show scroll-down indicator */
  showScrollIndicator?: boolean;
  /** Scroll indicator click handler */
  onScrollDown?: () => void;
}
