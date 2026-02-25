/* ------------------------------------------------------------------ */
/*  Header — Type definitions                                          */
/* ------------------------------------------------------------------ */

import type { TextStyleProps } from "../Text/Text.types";

export interface NavLink {
  /** Display label */
  label: string;
  /** Link URL */
  href: string;
  /** Mark as active page */
  isActive?: boolean;
}

export interface HeaderProps {
  /** Logo — image source, alt text, and link href */
  logo?: {
    src: string;
    alt: string;
    href: string;
  };
  /** Desktop navigation links */
  navLinks?: NavLink[];
  /** Language toggle button */
  languageToggle?: {
    label: string;
    onClick?: () => void;
  };
  /** Call-to-action button */
  cta?: {
    label: string;
    href: string;
  };
  /** Text direction — defaults to `"rtl"` */
  dir?: "rtl" | "ltr";
  /** Style overrides for nav link labels */
  navLinkTextProps?: TextStyleProps;
  /** Style overrides for language toggle label */
  languageToggleTextProps?: TextStyleProps;
  /** Style overrides for CTA label */
  ctaTextProps?: TextStyleProps;
  // TODO: Add visible prop
  visible?: boolean;
}

export interface MobileMenuProps {
  /** Navigation links */
  links: NavLink[];
  /** Language toggle */
  lang: {
    label: string;
    onClick?: () => void;
  };
  /** Call-to-action */
  cta: {
    label: string;
    href: string;
  };
  /** Style overrides for nav link labels (mobile) */
  navLinkTextProps?: TextStyleProps;
  /** Style overrides for language toggle label (mobile) */
  languageToggleTextProps?: TextStyleProps;
  /** Style overrides for CTA label (mobile) */
  ctaTextProps?: TextStyleProps;
}
