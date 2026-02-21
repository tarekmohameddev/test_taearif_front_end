/* ------------------------------------------------------------------ */
/*  Header — Type definitions                                          */
/* ------------------------------------------------------------------ */

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
}
